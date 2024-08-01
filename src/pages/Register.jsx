import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profileimg: "",
  });

  const [imgFile, setImageFile] = useState("");

  /* File Reference for Storage */
  const folderName = "userProfileImages";
  const timestamp = new Date().getTime();
  const newFileName = `${folderName}/${timestamp}-${imgFile.name}`;
  const storageRef = ref(storage, newFileName);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((response) => {
        setDoc(doc(db, "users", response.user.uid), data);
        toast.success("Your account has been created");
      })
      .catch((err) => {
        toast.error("An error has occurred");
        console.log(err);
      });
    navigate("/login");

    setData({ name: "", email: "", password: "" });
  };

  /* Uploading Image to Storage */
  useEffect(() => {
    const uploadImageToStorage = () => {
      const uploadTask = uploadBytesResumable(storageRef, imgFile);
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
            setData((prev) => ({ ...prev, profileimg: downloadURL }));
          });
        }
      );
    };

    imgFile && uploadImageToStorage();
  }, [imgFile]);

  return (
    <section className="registerLogin">
      <div className="registerLogin_content">
        <h3>Register</h3>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="file"
            name="profileimg"
            required
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <input
            type="text"
            name="name"
            placeholder="Enter Name..."
            onChange={handleOnChange}
            value={data.name}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email..."
            onChange={handleOnChange}
            value={data.email}
            required
          />
          <input
            type="password"
            name="password"
            onChange={handleOnChange}
            value={data.password}
            placeholder="Enter Password..."
            required
          />

          <button type="submit">Register</button>
          <p>
            Already have an account? &nbsp;{" "}
            <Link className="link" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
