import React, { useRef, useState } from "react";
import styles from "../module/addbooks.module.css";
import { IoChevronBackCircle } from "react-icons/io5";
import axios from "axios";
import Loader from "./Loader"; // Import Loader component

const AddBooks = ({ setShowNewComponent }) => {
  const [loading, setLoading] = useState(false); // Create a loading state
  const isbnRef = useRef("");
  const isbnRef1 = useRef("");
  const genreRef = useRef("current");
  const quantityRef = useRef("");
  const quantityRef1 = useRef("");

  const handleBlankCardClick = () => {
    setShowNewComponent((showNewComponent) => !showNewComponent);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the request starts

    const ISBN = isbnRef.current.value;
    const genre = genreRef.current.value;
    const quantity = quantityRef.current.value;

    axios
      .post(
        `/books/api/v1/addBook`,
        { ISBN, genre, quantity },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setLoading(false); // Set loading to false when request finishes
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Set loading to false on error
      });
  };

  const handleSubmit1 = (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the request starts

    const ISBN = isbnRef1.current.value;
    const quantity = quantityRef1.current.value;

    axios
      .post(
        `/books/api/v1/updateQuantity`,
        { ISBN, quantity },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setLoading(false); // Set loading to false when request finishes
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Set loading to false on error
      });
  };

  // If loading is true, show the Loader component
  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={handleBlankCardClick}>
        <IoChevronBackCircle />
      </button>
      {/* Form for adding new book */}
      <form
        id="contact-form"
        className={styles.contactForm}
        onSubmit={handleSubmit}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>ISBN</label>
          <input
            type="text"
            className={styles.formControl}
            id="ISBN"
            placeholder="ISBN"
            name="ISBN"
            ref={isbnRef}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Genre</label>
          <select className={styles.formControl} ref={genreRef} required>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Young-Adult">Young-Adult</option>
            <option value="Children-Books">Children-Books</option>
            <option value="Graphic-Novels">Graphic-Novels</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Quantity</label>
          <input
            type="text"
            className={styles.formControl}
            id="quantity"
            placeholder="QUANTITY"
            name="quantity"
            ref={quantityRef}
          />
        </div>
        <div>
          <button
            className={styles.button}
            id="submit"
            type="submit"
            value="SAVE"
            style={{ width: "100%" }}
          >
            SAVE
          </button>
        </div>
      </form>

      {/* Form for updating book quantity */}
      <form
        id="contact-form"
        className={styles.contactForm}
        onSubmit={handleSubmit1}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>ISBN</label>
          <input
            type="text"
            className={styles.formControl}
            id="ISBN"
            placeholder="ISBN"
            name="ISBN"
            ref={isbnRef1}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Quantity</label>
          <input
            type="text"
            className={styles.formControl}
            id="quantity"
            placeholder="QUANTITY"
            name="quantity"
            ref={quantityRef1}
          />
        </div>
        <div
          className={styles.sendButton}
          id="submit"
          type="submit"
          value="SAVE"
        >
          <button
            className={styles.button}
            type="submit"
            style={{ width: "100%" }}
          >
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBooks;
