import { collection, getDocs, doc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../firebase";

export const DbContext = createContext();

export const DbContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  const getAllPostsFromDB = async () => {
    const querySnapshot = await getDocs(postsCollectionRef);
    const allPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      authorid: doc.data().authorid,
      authorname: doc.data().authorname,
      authorprofile: doc.data().authorprofile,
      caption: doc.data().caption,
      postimg: doc.data().postimg,
      posttimestamp: doc.data().posttimestamp,
      likedBy: doc.data().postlikedby,
    }));

    setPosts(allPosts);
  };

  getAllPostsFromDB();

  useEffect(() => {
    getAllPostsFromDB();
  }, []);

  return (
    <DbContext.Provider value={{ posts, getAllPostsFromDB }}>
      {children}
    </DbContext.Provider>
  );
};
