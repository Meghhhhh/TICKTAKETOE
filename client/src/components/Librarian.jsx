import React, { useState, useEffect } from "react";
import style from "../module/librarian.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiTwotoneDelete } from "react-icons/ai";
import Loader from "./Loader"
import axios from "axios";

const Librarian = () => {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchLibrarians();
  }, []);

  const fetchLibrarians = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/getLibrarians`);
      setLibrarians(response.data.data);
    } catch (error) {
      console.error("Error fetching librarians:", error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  const deleteLibrarian = async (email) => {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/deleteLibrarian`, { data: { email } });
      setLibrarians((prevLibrarians) =>
        prevLibrarians.filter((librarian) => librarian.email !== email)
      );
      toast.success("Librarian deleted successfully!");
    } catch (error) {
      console.error("Error deleting librarian:", error);
      toast.error("Failed to delete librarian.");
    }
  };

  return (
    <div className={style.body}>
      <ToastContainer />
      {loading ? (
        <Loader/> // Loader while fetching
      ) : (
        <div className={style.parent}>
          {librarians.length > 0 ? (
            librarians.map((librarian, index) => (
              <div key={index} className={style.element}>
                <h3 className={style.head}>
                  {librarian.name} ({librarian.email}){" "}
                  <AiTwotoneDelete
                    className={style.icon}
                    onClick={() => deleteLibrarian(librarian.email)}
                  />
                </h3>
              </div>
            ))
          ) : (
            <p>No librarians found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Librarian;
