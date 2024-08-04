import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import PostCard from "../components/PostCard";
import { toast } from "react-toastify";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id))
      .then(() => toast.success("Post deleted successfully"))
      .catch((err) => {
        console.log(err);
        toast.error("An Error occured while deleting");
      });

    getAllPostsFromDB();
  };

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
        {posts.map((item) => (
          <PostCard index={item.id} item={item} handleDelete={handleDelete} />
        ))}
      </div>
    </section>
  );
};

export default Home;
