import React, { useState } from "react";
import "../assets/sass/form.scss";
import api from "../api/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBook = () => {
  const [formData, setFormData] = useState({});
  const [imageData, setImageData] = useState();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addBook = async (e) => {
    e.preventDefault();
    const response = await api.post(
      "/book/add",
      {
        ...formData,
        image: imageData,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        credentials: "same-origin",
      }
    );
    if (response.data.id) {
      toast.success(" Book Added !!");
      setFormData({});
      setImageData();
      e.target.reset();
    } else {
      toast.error(response.data.message);
    }
  };
  const Logout = async () => {
    const response = await api.get("/user/logout", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    if (response.data.success) {
      toast.success(response.data.message);
      setInterval(() => {
        window.location.href = "/";
      }, 5000);
    } else {
      toast.error("Invalid logout without token");
      setInterval(() => {
        window.location.href = "/";
      }, 5000);
    }

    // window.location.href = "/";
  };
  return (
    <>
      <ToastContainer />
      <div style={{ textAlign: "center" }}>
        {" "}
        <h2>
          <span style={{ color: "red" }}>Add New</span> Book
        </h2>
        <button onClick={Logout}>Logout</button>
      </div>
      <hr />
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          onSubmit={addBook}
        >
          Name
          <input type="text" name="name" onChange={handleChange} required />
          Author
          <input type="text" name="author" onChange={handleChange} required />
          Genre
          <input type="text" name="genre" onChange={handleChange} required />
          Description
          <textarea
            name="description"
            rows="10"
            onChange={handleChange}
          ></textarea>
          <input
            type="file"
            name="image"
            onChange={(e) => setImageData(e.target.files[0])}
            required
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default AddBook;
