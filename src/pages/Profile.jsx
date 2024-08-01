import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

const Profile = () => {
  const { userid } = useParams();
  const [author, setAuthor] = useState({
    name: "",
    profileimg: "",
  });

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
    <div>
      <h1>User ID is: {userid}</h1>
      <h1>{author.name}</h1>
      <img src={author.profileimg} alt="" />
    </div>
  );
};

export default Profile;
