import React, { useState } from "react";
import styles from "../module/feedback.module.css";
import axios from "axios";
import Loader from "./Loader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Addresources = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("userId", userId);

    const tagsArray = tags.split(",").map((tag) => tag.trim());
    formData.append("tags", tagsArray);

    if (category === "link") {
      formData.append("link", link);
    } else {
      formData.append("file", file);
    }
    formData.append("thumbnail", thumbnail);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }resource/api/v1/postResource`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      toast.success("Resource added successfully!", {
        autoClose: 1000,
        closeButton: false,
        onClose: () => {
          navigate("/");
        },
      });

      setTitle("");
      setCategory("");
      setDescription("");
      setLink("");
      setFile(null);
      setThumbnail(null);
      setTags("");
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "An error occurred.", {
        autoClose: 1500,
        closeButton: false,
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer />
      <div className={styles.outerbody}>
        <div className={styles.mainOuter}>
          <header>
            <h1 id="title" className={`${styles.textCenter} ${styles.h1}`}>
              Add a New Resource
            </h1>
          </header>
          <form
            id="resource-form"
            className={styles.form1}
            onSubmit={handleSubmit}
          >
            <fieldset>
              <label htmlFor="title" className={styles.label1}>
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={styles.formControl}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="category" className={styles.label1}>
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className={styles.formControl}
              >
                <option value="">Select category</option>
                <option value="text">Text</option>
                <option value="pdf">PDF</option>
                <option value="word">Word</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
                <option value="link">Link</option>
              </select>
            </fieldset>
            {category === "link" && (
              <fieldset>
                <label htmlFor="link" className={styles.label1}>
                  Link
                </label>
                <input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className={styles.formControl}
                />
              </fieldset>
            )}
            <fieldset>
              <label htmlFor="description" className={styles.label1}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${styles.formControl} ${styles.textareaField}`}
              ></textarea>
            </fieldset>
            <fieldset>
              <label htmlFor="tags" className={styles.label1}>
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
                className={styles.formControl}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="file" className={styles.label1}>
                Upload File
              </label>
              <input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className={styles.formControl}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="thumbnail" className={styles.label1}>
                Upload Thumbnail
              </label>
              <input
                id="thumbnail"
                type="file"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className={styles.formControl}
              />
            </fieldset>
            <fieldset>
              <button
                type="submit"
                id="submit"
                className={`button ${styles.submitButton}`}
              >
                Submit
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};

export default Addresources;
