import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  const getAllPostsFromDB = async () => {
    const querySnapshot = await getDocs(postsCollectionRef);
    const allPosts = querySnapshot.docs.map((doc) => ({
      authorid: doc.data().authorid,
      authorname: doc.data().authorname,
      caption: doc.data().caption,
      postimg: doc.data().postimg,
      posttimestamp: doc.data().posttimestamp,
    }));

    setPosts(allPosts);
  };

  useEffect(() => {
    getAllPostsFromDB();
  }, []);
  return (
    <section>
      <h3>Latest Posts:</h3>

      {posts.map((item, index) => (
        <article key={index}>
          <h3>{item.authorid}</h3>
          <h3>{item.authorname}</h3>
          <p>{item.caption}</p>
          <img style={{ width: "200px" }} src={item.postimg} alt="" />
        </article>
      ))}
    </section>
  );
};

export default Home;
