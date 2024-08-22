import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ImageModal from "./ImageModal";
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { DbContext } from "../context/DbContext";

const PostCard = ({ item, index }) => {
  const [postModal, setPostModal] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likedArray, setLikedArray] = useState([]);
  const [singlePostDetail, setSinglePostDetail] = useState({
    postURL: "",
    postCaption: "",
  });
  const navigate = useNavigate();
  const { JSONData } = useContext(UserContext);
  const user = JSONData();
  const { getAllPostsFromDB } = useContext(DbContext);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id))
      .then(() => toast.success("Post deleted successfully"))
      .catch((err) => {
        console.log(err);
        toast.error("An Error occured while deleting");
      });

    getAllPostsFromDB();
  };

  useEffect(() => {
    getAllPostsFromDB();
  }, []);

  /* Handling Model */
  const handleModal = (item) => {
    setSinglePostDetail((prev) => ({
      ...prev,
      postCaption: item.caption,
      postURL: item.postimg,
    }));
    setPostModal(true);
  };

  /* Handle Like Button Funtionality */
  const handleLike = async (index) => {
    const docRef = doc(db, "posts", index);
    // Check if user has already liked the post
    if (likedArray.includes(user.uid)) {
      /* setAlreadyLike(true);
      toast.error("You have already liked this post!"); */
      if (likedArray.includes(user.uid)) {
        const filteredLikeArray = likedArray.filter((uid) => user.uid !== uid);
        await updateDoc(docRef, { postlikedby: filteredLikeArray });
        setLikedArray(filteredLikeArray);
        setLikes(filteredLikeArray.length);
        toast.success("Unliked");
        return;
      }
    }

    try {
      // Create a copy of likedArray and add the user's ID
      const likedArr = [...likedArray, user.uid];

      await updateDoc(docRef, { postlikedby: likedArr });

      setLikedArray(likedArr);
      setLikes(likedArr.length);

      // Show success message
      toast.success("Liked");
      console.log(likedArray);
    } catch (err) {
      // Handle errors
      console.error("Error liking the post:", err);
      toast.error("An error occurred");
    }
  };

  /* UseEffect */
  useEffect(() => {
    const getLikedInfo = async () => {
      try {
        const postData = await getDoc(doc(db, "posts", item.id));
        if (postData.exists()) {
          setLikedArray(postData.data().postlikedby || []);
          setLikes(postData.data().postlikedby?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching liked info: ", error);
      }
    };
    getLikedInfo();
  }, [item.id]);

  /*  */
  useEffect(() => {
    const cleanup = onSnapshot(doc(db, "posts", item.id), (snapshot) => {
      if (snapshot.exists) {
        setLikedArray(snapshot.data().postlikedby || []);
        setLikes(snapshot.data().postlikedby?.length || 0);
      }
    });

    cleanup();
  }, []);

  return (
    <>
      <article className="postCard" key={index}>
        {/* Author Details */}
        <div className="author_details">
          <img
            onClick={() => navigate(`/main/profile/${item.authorid}`)}
            src={item.authorprofile}
            alt=""
          />
          <h3>{item.authorname}</h3>
          {item.authorid === user.uid ? (
            <span onClick={() => handleDelete(item.id)} className="trash">
              <ion-icon name="trash-outline"></ion-icon>
            </span>
          ) : (
            <></>
          )}
        </div>
        <hr className="hr" />
        <p className="postCaption">{item.caption}</p>
        <img
          onClick={() => handleModal(item)}
          className="postImg"
          src={item.postimg}
          alt=""
        />
        {/* Like Button */}
        <div className="btn__like_wrapper">
          <button
            className="like_btn"
            onClick={() => handleLike(index)}
            type="button"
          >
            <span>
              <ion-icon name="heart"></ion-icon>
            </span>{" "}
            <span>{likes}</span>
          </button>
        </div>
      </article>

      {/* Modal */}
      {postModal && (
        <ImageModal
          postURL={singlePostDetail.postURL}
          postCaption={singlePostDetail.postCaption}
          setCloseModal={setPostModal}
        />
      )}
    </>
  );
};

export default PostCard;
