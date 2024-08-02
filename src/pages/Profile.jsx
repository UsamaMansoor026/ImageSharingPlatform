import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const { handleRemoveUser } = useContext(UserContext);
  const { userid } = useParams();
  const [author, setAuthor] = useState({
    name: "",
    profileimg: "",
  });

  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => {
        handleRemoveUser();
        toast.success("Successfully signed out");
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred");
      });
    navigate("/login");
  };

  useEffect(() => {
    const getAuthorDetails = async (userid) => {
      const docRef = doc(db, "users", userid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userInfo = docSnap.data();
        setAuthor({
          name: userInfo.name,
          profileimg: userInfo.profileimg,
        });
      } else {
        console.log("No data Found");
      }
    };
    getAuthorDetails(userid);
  }, []);
  return (
    <section>
      <h1>{author.name}</h1>
      <img src={author.profileimg} alt="" />
      <button onClick={handleSignOut} className="btn">
        SignOut
      </button>
    </section>
  );
};

export default Profile;
