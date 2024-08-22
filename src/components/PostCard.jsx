import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ImageModal from "./ImageModal";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const PostCard = ({ item, index, handleDelete }) => {
  const [postModal, setPostModal] = useState(false);
  const [alreadyLike, setAlreadyLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likedArray, setLikedArray] = useState([]);
  const [singlePostDetail, setSinglePostDetail] = useState({
    postURL: "",
    postCaption: "",
  });
  const navigate = useNavigate();
  const { JSONData } = useContext(UserContext);
  const user = JSONData();

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
    // Check if user has already liked the post
    if (likedArray.includes(user.uid)) {
      setAlreadyLike(true);
      toast.error("You have already liked this post!");
      return;
    }

    try {
      // Create a copy of likedArray and add the user's ID
      const likedArr = [...likedArray, user.uid];

      // Reference to the Firestore document
      const docRef = doc(db, "posts", index);

      // Update the document with the new liked array
      await updateDoc(docRef, { postlikedby: likedArr });

      // Update the state with the new liked array and likes count
      setLikedArray(likedArr);
      setLikes(likedArr.length);

      // Show success message
      toast.success("Liked");
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
              {alreadyLike ? (
                <ion-icon name="thumbs-up"></ion-icon>
              ) : (
                <ion-icon name="thumbs-up-outline"></ion-icon>
              )}
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
