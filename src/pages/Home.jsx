import React, { useContext } from "react";
import PostCard from "../components/PostCard";
import { DbContext } from "../context/DbContext";

const Home = () => {
  const { posts } = useContext(DbContext);

  return (
    <section className="container">
      <h3 className="section_heading">Latest Posts:</h3>

      <div className="post_container">
        {posts.map((item) => (
          <PostCard index={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Home;
