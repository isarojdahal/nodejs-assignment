import React, { useState } from "react";
import "../assets/sass/form.scss";
import { toast, ToastContainer } from "react-toastify";
import api from "../api/config.js";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast.error("Password must contain at least 8 letter!!");
    } else {
      const response = await api.post(
        "/user/register",
        {
          ...formData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {

        toast.success("Registeration Success!!");
        setFormData({});
        e.target.reset();
      } else {
       
        toast.error(response.data.message);
      }
 
    }
  };
  return (
    <>
      <ToastContainer />
      <div style={{textAlign: "center"   }}>   <h2>Book Store <span style={{color:"red"}}>Signup</span></h2></div>
     <hr/>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={addUser}
        >
          Name
          <input type="text" name="name" onChange={handleChange} required/>
          Email
          <input type="email" name="email" onChange={handleChange} required/>
          Password
          <input type="password" name="password" onChange={handleChange} required/>
          Address
          <input type="text" name="address" onChange={handleChange} required/>
          <input type="submit" value="Register" />
          {/* <a
              href="http://localhost:8000/user/auth/google"
              style={{
                marginRight: "10px",
                padding:"5px",
                border:"1px solid black",
                textAlign:"center"
              }}
            >
              Signup with google
            </a> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "10px",
              color: "red",
            }}
          >
          
            {" "}
            Already have an account!!
            <a
              href="/login"
              style={{
                marginLeft: "10px",
              }}
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
