import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { UserContext } from "../context/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { handleRemoveUser } = useContext(UserContext);
  const { JSONData } = useContext(UserContext);

  /* Handling The User Sign out Process */
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

  const user = JSONData();
  const [currentUser, setCurrentUser] = useState("");

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
      <Link className="link" to="/main">
        <h1>SnapDrop</h1>
      </Link>

      <ul className="links">
        <li>
          <Link className="navlink" to="/main">
            Home
          </Link>
        </li>
        <li>
          <Link className="navlink" to="/main/create">
            Create Post
          </Link>
        </li>
        <li>
          <button onClick={handleSignOut}>SignOut</button>
        </li>
      </ul>
      <div>
        <img
          onClick={() => navigate(`/main/profile/${user?.uid}`)}
          src={currentUser}
          alt=""
        />
      </div>
    </nav>
  );
};

export default Navbar;
