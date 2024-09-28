import React, { useRef, useState } from "react";
import style from "../module/feedback.module.css";
import { FaStar } from "react-icons/fa6";
import axios from "axios";
import Loader from "./Loader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [bookName, setBookName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const feedbackRef = useRef("");

  const rateItem = (rate) => {
    setRating(rate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const feedback = feedbackRef.current.value;

    axios
      .post(
        'feedback/api/v1/postFeedback',
        {
          feedback,
          bookName,
          rating,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          toast.success(res.data.message, {
            autoClose: 1000,
            closeButton: false,
            onClose: () => {
              navigate('/');
            },
          });
        } else {
          toast.error(res.data.message, {
            autoClose: 1500,
            closeButton: false,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.message, {
          autoClose: 1500,
          closeButton: false,
        });
      });
  };

  const searchBookByTitle = async (title) => {
    try {
      const response = await axios.post(
        '/books/api/v1/searchBookByTitle',
        { title },
        { withCredentials: true }
      );
      setSearchResults(response.data.data);
      setShowDropdown(true);
    } catch (error) {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleBookNameChange = (e) => {
    const value = e.target.value;
    setBookName(value);
    if (value.length > 2) {
      searchBookByTitle(value);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleBookSelect = (book) => {
    setBookName(book.title);  // Update bookName with the selected book's title
    setShowDropdown(false);   // Hide the dropdown after selection
    setSearchResults([]);      // Clear previous search results
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer />
      <div className={style.outerbody}>
        <div className={style.mainOuter}>
          <header>
            <h1 id="title" className={`${style.textCenter} ${style.h1}`}>
              We appreciate your valuable feedback.
            </h1>
          </header>
          <form id="survey-form" className={style.form1} onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="bookname" className={style.label1}>
                Book Name
              </label>
              <input
                id="bookname"
                type="text"
                value={bookName}
                onChange={handleBookNameChange}
                placeholder="Search for a book"
                required
                className={style.formControl}
              />
              {showDropdown && (
                <ul className={style.dropdown}>
                  {searchResults.length > 0 ? (
                    searchResults.map((book) => (
                      <li
                        key={book._id}
                        onClick={() => handleBookSelect(book)} // Call handleBookSelect on click
                        className={style.dropdownItem}
                      >
                        {book.title}
                      </li>
                    ))
                  ) : (
                    <li className={style.dropdownItem}>No books found</li>
                  )}
                </ul>
              )}
            </fieldset>
            <fieldset>
              <p className={style.pform}>
                Please provide your feedback or suggestions.
              </p>
              <textarea
                ref={feedbackRef}
                id="feedback"
                name="feedback"
                placeholder="Your feedback"
                className={style.inputTextarea}
              ></textarea>
            </fieldset>
            <fieldset>
              <p className={style.rateTit}>How much would you like to rate us?</p>
              <div className={style.starRating}>
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <div
                      key={index}
                      className={`${style.starButton} ${
                        ratingValue <= (hover || rating) ? style.hover : ""
                      }`}
                      onClick={() => rateItem(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(rating)}
                    >
                      <FaStar />
                    </div>
                  );
                })}
              </div>
            </fieldset>
            <fieldset>
              <button
                type="submit"
                id="submit"
                className={`button ${style.submitButton}`}
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

export default Feedback;
