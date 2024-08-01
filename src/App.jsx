import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "./context/UserContext";

const App = () => {
  const { userStatus } = useContext(UserContext);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={userStatus === null ? <Register /> : <Layout />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/main/*" element={<Layout />} />
      </Routes>
    </>
  );
};

export default App;
