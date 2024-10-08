import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "./Home";
import Footer from "../components/Footer";
import Profile from "./Profile";
import CreatePost from "./CreatePost";

const Layout = () => {
  return (
    <>
      <Navbar />
      <span className="circle circle_one"></span>
      <span className="circle circle_two"></span>
      <Routes>
        <Route index element={<Home />} />
        <Route path="profile/:userid" element={<Profile />} />
        <Route path="create" element={<CreatePost />} />
      </Routes>

      <Footer />
    </>
  );
};

export default Layout;
