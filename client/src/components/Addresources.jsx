import React, { useState } from "react";
import styles from "../module/addresources.module.css";
import axios from "axios";

const Addresources = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [file, setFile] = useState(null); // For the main resource file
  const [thumbnail, setThumbnail] = useState(null); // For the thumbnail file
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("userId", userId);

    if (category === "link") {
      formData.append("link", link);
    } else {
      formData.append("file", file);
      formData.append("thumbnail", thumbnail); // Append the thumbnail file
    }

    try {
      const response = await axios.post(
        "resource/api/v1/postResource",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);
      setError("");
      setTitle("");
      setCategory("");
      setDescription("");
      setLink("");
      setFile(null);
      setThumbnail(null); // Reset the thumbnail state
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Resource</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.inputField}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
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
        </div>
        {category === "link" && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Link</label>
            <input
              type="url"
              className={styles.inputField}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={`${styles.inputField} ${styles.textareaField}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Upload File</label>
          <input
            type="file"
            className={styles.inputField}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Upload Thumbnail</label>
          <input
            type="file"
            className={styles.inputField}
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Addresources;
