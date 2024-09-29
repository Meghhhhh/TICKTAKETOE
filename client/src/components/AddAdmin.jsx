import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";
import style from "../module/upresources.module.css";

const AddAdmin = ({ setShowNewComponent2 }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Create a loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request starts
    try {
      const response = await axios.post("/users/api/v1/createAdmin", { email });
      toast.success(response?.data?.message, {
        onClose: () => setShowNewComponent2(false),
      });
    } catch (error) {
      console.error("Error adding Admin:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add admin. Please try again."
      );
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };

  return (
    <div className={style.formContainer} style={{ width: "100%" }}>
      <ToastContainer />
      {loading && <Loader />}
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
              Add Admin
            </button>
            <button
              type="button"
              className={style.button}
              style={{ width: "40%" }}
              onClick={() => setShowNewComponent2(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddAdmin;
