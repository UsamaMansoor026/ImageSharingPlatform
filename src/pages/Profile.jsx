import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";

const Profile = () => {
  const navigate = useNavigate();
  const { handleRemoveUser } = useContext(UserContext);
  const { userid } = useParams();
  const [author, setAuthor] = useState({
    name: "",
    profileimg: "",
  });
  const [posts, setPosts] = useState([]);

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

  /* Function to getting all the user posts */
  const gettingAllUserPosts = async (userid) => {
    const q = query(collection(db, "posts"), where("authorid", "==", userid));
    const querySnapshot = await getDocs(q);
    const allPosts = querySnapshot.docs.map((docc) => ({
      authorid: docc.data().authorid,
      authorname: docc.data().authorname,
      authorprofile: docc.data().authorprofile,
      caption: docc.data().caption,
      postimg: docc.data().postimg,
      posttimestamp: docc.data().posttimestamp,
      likedBy: docc.data().postlikedby,
    }));

    setPosts(allPosts);
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
    gettingAllUserPosts(userid);
  }, []);
  return (
    <section className="container">
      <div className="author">
        <img src={author.profileimg} alt="" />
        <h1>{author.name}</h1>
        <button onClick={handleSignOut} className="signOut_btn">
          SignOut
        </button>
      </div>
      <hr className="hr" />

      {/* all posts */}
      <div className="post_container">
        {posts &&
          posts.map((post, index) => <PostCard item={post} index={index} />)}
      </div>
    </section>
  );
};

export default Profile;
