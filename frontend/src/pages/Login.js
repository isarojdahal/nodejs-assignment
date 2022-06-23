import React, { useState } from "react";
import "../assets/sass/form.scss";
import { toast, ToastContainer } from "react-toastify";
import api from "../api/config.js";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();

    if (!formData.email || formData.email === "") {
      toast.error("Email should not be empty!!");
    } else if (!formData.password || formData.password === "") {
      toast.error("Password should not be empty!!");
    } else {
      const response = await api.post(
        "/user/login",
        {
          ...formData,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
        }
      );

      if (response.data.success) {
        toast.success("Login Success!!");
        setFormData({});
        e.target.reset();
        setInterval(() => {
          window.location.href = "http://localhost:3000/dashboard/addBook";
        }, 5000);
      } else {
        toast.error(response.data.message);
      }
    }
  };
  return (
    <>
      <ToastContainer />
      <div style={{ textAlign: "center" }}>
        {" "}
        <h2>
          Book Store <span style={{ color: "purple" }}>Login</span>
        </h2>
      </div>
      <hr />
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={login}
        >
          Email
          <input type="email" name="email" onChange={handleChange} required />
          Password
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
          <input type="submit" value="Login" />
          <a
            href="http://localhost:8000/user/auth/google"
            style={{
              marginRight: "10px",
              padding: "5px",
              border: "1px solid black",
              textAlign: "center",
            }}
          >
            Login by google
          </a>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "10px",
              color: "red",
            }}
          >
            Not Registerd Yet??
            <a
              href="/signup"
              style={{
                marginLeft: "10px",
              }}
            >
              SignUp
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
