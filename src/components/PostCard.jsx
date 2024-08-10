import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ImageModal from "./ImageModal";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const PostCard = ({ item, index, handleDelete }) => {
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
    // const postData = await getDoc(doc(db, "posts", index));
    const likedArr = likedArray;
    likedArr.push(user.uid);
    const docRef = doc(db, "posts", index);
    await updateDoc(docRef, { postlikedby: likedArr })
      .then(() => {
        toast.success("Liked");
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred");
      });
    setLikes(likedArr.length);
  };

  /* UseEffect */
  useEffect(() => {
    const getLikedInfo = async () => {
      const postData = await getDoc(doc(db, "posts", item.id));
      if (postData.exists) {
        setLikedArray(postData.data().postlikedby || []);
        setLikes(postData.data().postlikedby?.length || 0);
      }
    };
    /* Clean up information */
    return () => getLikedInfo();
  }, [item.id]);

  /*  */
  useEffect(() => {
    const cleanup = onSnapshot(doc(db, "posts", item.id), (snapshot) => {
      if (snapshot.exists) {
        setLikedArray(snapshot.data().postlikedby || []);
        setLikes(snapshot.data().postlikedby?.length || 0);
      }
    });

    return () => cleanup();
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
          <button onClick={() => handleLike(index)} type="button">
            Likes: {likes}
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
