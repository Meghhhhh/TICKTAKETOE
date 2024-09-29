import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader"; // Import Loader component
import style from "../module/upresources.module.css";

const AddLibrarian = ({ setShowNewComponent1 }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Create loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post("/users/api/v1/createLibrarian", {
        email,
      });
      toast.success(response?.data?.message, {
        onClose: () => setShowNewComponent1(false),
      });
    } catch (error) {
      console.error("Error adding librarian:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add librarian. Please try again."
      );
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <div className={style.formContainer} style={{ width: "100%" }}>
      <ToastContainer />
      {loading && <Loader />} {/* Show Loader when loading */}
      {!loading && (
        <form onSubmit={handleSubmit} className={style.contactForm}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              className={style.formControl}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <div className={style.btncntr}>
            <button
              type="submit"
              className={style.button}
              style={{ width: "40%" }}
            >
              Add Librarian
            </button>
            <button
              type="button"
              className={style.button}
              style={{ width: "40%" }}
              onClick={() => setShowNewComponent1(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddLibrarian;
