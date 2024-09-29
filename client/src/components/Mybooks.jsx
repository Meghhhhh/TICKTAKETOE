import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../module/mybooks.module.css";
import Loader from "./Loader"

const Mybooks = () => {
  const [bookHistory, setBookHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchBookHistory = async () => {
      try {
        const response = await axios.get("/users/api/v1/getHistory", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (response.data.success) {
          setBookHistory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching book history:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchBookHistory();
  }, []);

  return (
    <div className={style.body}>
      {loading ? (
        <Loader/>// Loader component
      ) : (
        <div className={style.listContainer}>
          {bookHistory.length > 0 ? (
            bookHistory.map((item, index) => (
              <div key={index} className={style.element}>
                <div className={style.set}>
                  <img
                    src={item.thumbnail}
                    className={style.imgs}
                    alt="PDF Icon"
                  />
                  <div className={style.texts}>{item.title}</div>
                </div>
              </div>
            ))
          ) : (
            <p className={style.noBooksMessage}>No books available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Mybooks;
