import React, { useContext, useEffect, useState } from "react";
import uploadArea from "../assets/upload_area.png";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [postImg, setPostImg] = useState("");
  const { JSONData } = useContext(UserContext);
  const author = JSONData();

  const [data, setData] = useState({
    postimg: "",
    caption: "",
    authorid: author.uid,
    authorname: "",
    postlikedby: [],
    posttimestamp: serverTimestamp(),
  });

  /* This function keep track the value of input field */
  const handleInput = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  /* File Reference for Storage */
  const folderName = "userPosts";
  const timestamp = new Date().getTime();
  const newFileName = `${folderName}/${timestamp}-${postImg.name}`;
  const storageRef = ref(storage, newFileName);

  /* This function handle the data upload to the database */
  const handleSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(db, "posts"), data)
      .then(() => toast.success("Post has been created"))
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred");
      });

    setData({ postimg: "", caption: "" });
    navigate("/main");
  };

  /* Getting Author Name from DB */
  const getAuthorName = async () => {
    const docRef = doc(db, "users", author.uid);
    const snapDoc = await getDoc(docRef);
    if (snapDoc.exists()) {
      const name = snapDoc.data().name;
      setData((prev) => ({ ...prev, authorname: name }));
    } else {
      console.log("Error Occured");
    }
  };

  /* Uploading Image to Storage */
  useEffect(() => {
    const uploadImageToStorage = () => {
      const uploadTask = uploadBytesResumable(storageRef, postImg);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setData((prev) => ({ ...prev, postimg: downloadURL }));
          });
        }
      );
    };

    getAuthorName();
    postImg && uploadImageToStorage();
  }, [postImg]);

  return (
    <section>
      <form onSubmit={handleSubmit} className="createPost_form">
        <h1>Create Your Post</h1>
        <hr />

        {/* Input Fields */}
        <div>
          <input
            style={{ display: "none" }}
            onChange={(e) => setPostImg(e.target.files[0])}
            type="file"
            name="post"
            id="post"
          />
          <label htmlFor="post">
            <span style={{ marginBottom: "5px" }}>Upload the image here:</span>
            <img
              src={postImg ? URL.createObjectURL(postImg) : uploadArea}
              alt=""
            />
          </label>

          <input
            type="text"
            name="caption"
            onChange={handleInput}
            placeholder="Enter the suitable caption..."
          />

          <button type="submit">Create Post</button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
