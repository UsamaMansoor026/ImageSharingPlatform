import React from "react";
import { useNavigate } from "react-router-dom";

const PostCard = ({ item, index }) => {
  const navigate = useNavigate();
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
      </div>
      <hr className="hr" />
      <p className="postCaption">{item.caption}</p>
      <img className="postImg" src={item.postimg} alt="" />
    </article>
  );
};

export default PostCard;
