import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  const getAllPostsFromDB = async () => {
    const querySnapshot = await getDocs(postsCollectionRef);
    const allPosts = querySnapshot.docs.map((doc) => ({
      authorid: doc.data().authorid,
      authorname: doc.data().authorname,
      authorprofile: doc.data().authorprofile,
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
    <section className="container">
      <h3 className="section_heading">Latest Posts:</h3>

      <div className="post_container">
        {posts.map((item, index) => (
          <PostCard index={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Home;
