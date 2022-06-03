import React, { useEffect, useState } from "react";
import api from "../api/config";

const HomePage = () => {
  const [bookList, setBookList] = useState([]);
  const [tempBookList, setTempBookList] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    async function fetchBooks() {
      const response = await api.get("/book");
      setBookList(response.data);
      setTempBookList(response.data);
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    async function searchBooks() {
      const response = await api.get(`/book/search/all?q=${searchText}`);
      setBookList(response.data);
    }

    if (searchText) searchBooks();
    else setBookList(tempBookList);
  }, [searchText]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <a href="/signup">
          <button style={{ padding: "2px", border: "2px solid green" }}>
            Sign Up
          </button>
        </a>

        <a href="/login">
          <button
            style={{
              marginLeft: "10px",
              padding: "2px",
              border: "2px solid green",
            }}
          >
            Login
          </button>
        </a>
      </div>

      <center>
        {" "}
        <input
          type="text"
          className="search-field"
          placeholder="Search Books..."
          onChange={(e) => setSearchText(e.target.value)}
        />
      </center>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {bookList
          ? bookList.length > 0
            ? bookList.map((book, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "20px",
                      boxShadow: "0px 0px 5px #ccc",
                      marginLeft: "20px",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={book.image}
                      alt="book "
                      style={{
                        height: "250px",
                        width: "250px",
                        objectFit: "contain",
                      }}
                    />
                    <br />
                    {book.name}
                  </div>
                );
              })
            : "No Book Found"
          : "Loading Books..."}
      </div>
    </>
  );
};

export default HomePage;
