import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { handleUserStatus } = useContext(UserContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((response) => {
        toast.success("You successfully signed in");
        handleUserStatus(response.user);
        navigate("/main");
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error Occurred");
      });
    setData({ email: "", password: "" });
  };

  return (
    <section className="registerLogin">
      <div className="registerLogin_content">
        <h3>Login</h3>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email..."
            onChange={handleOnChange}
            value={data.email}
            required
          />
          <input
            type="password"
            name="password"
            onChange={handleOnChange}
            value={data.password}
            placeholder="Enter Password..."
            required
          />

          <button type="submit">Login</button>
          <p>
            Don't have an account? &nbsp;{" "}
            <Link className="link" to="/">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
