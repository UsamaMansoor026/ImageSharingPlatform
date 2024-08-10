import React from "react";

const ImageModal = ({ postURL, postCaption, setCloseModal }) => {
  return (
    <div className="modal_container">
      <article className="modal">
        <h1 onClick={() => setCloseModal(false)}>X</h1>
        <h3>{postCaption}</h3>
        <img src={postURL} alt={postCaption} />
      </article>
    </div>
  );
};

export default ImageModal;
