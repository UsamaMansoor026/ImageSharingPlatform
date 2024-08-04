import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const PostCard = ({ item, index, handleDelete }) => {
  const navigate = useNavigate();
  const { JSONData } = useContext(UserContext);
  const user = JSONData();

  /* Handle Delete */
  /*  const handleDelete = async (id) => {
    console.log(id);
    await deleteDoc(doc(db, "posts", id))
      .then(() => toast.success("Post deleted successfully"))
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while deleting");
      });
  }; */

  return (
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
      <img className="postImg" src={item.postimg} alt="" />
    </article>
  );
};

export default PostCard;
