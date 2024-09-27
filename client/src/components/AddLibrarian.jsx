import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "../module/upresources.module.css";

const AddLibrarian = ({ setShowNewComponent1 }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/api/v1/createLibrarian", { email });
      toast.success(response?.data?.message, {
        onClose: () => setShowNewComponent1(false),
      });
    } catch (error) {
      console.error("Error adding librarian:", error);
      toast.error(
        error.response?.data?.message || "Failed to add admin. Please try again."
      );
    }
  };

  return ( 
    <div className={style.formContainer} style={{ width: "100%" }}>
      <ToastContainer />
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
    </div>
  );
};

export default AddLibrarian;
