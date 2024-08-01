import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "./Home";
import Footer from "../components/Footer";
import Profile from "./Profile";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="profile/:userid" element={<Profile />} />
      </Routes>

      <Footer />
    </>
  );
};

export default Layout;
