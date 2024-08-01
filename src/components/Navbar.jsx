import { signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { UserContext } from "../context/UserContext";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const navigate = useNavigate();
  const { handleRemoveUser, JSONData } = useContext(UserContext);

  const user = JSONData();
  const [currentUser, setCurrentUser] = useState("");

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
    const getCurrentUser = async (user) => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userInfo = docSnap.data();
        setCurrentUser(userInfo.profileimg);
      } else {
        console.log("No data Found");
      }
    };
    getCurrentUser(user);
  }, []);

  return (
    <nav>
      <div>
        <img
          onClick={() => navigate(`/main/profile/${user?.uid}`)}
          src={currentUser}
          alt=""
        />
      </div>

      <button onClick={handleSignOut}>SignOut</button>
    </nav>
  );
};

export default Navbar;
