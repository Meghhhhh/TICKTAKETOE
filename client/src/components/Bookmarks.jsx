import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import style from "../module/resources.module.css";
import Loader from "./Loader"; // Import the Loader component

const Bookmarks = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [favouriteResources, setFavouriteResources] = useState([]);
  const [loading, setLoading] = useState(false); // Single loading state for all requests
  const [errorBookmarks, setErrorBookmarks] = useState(null);
  const [errorFavourites, setErrorFavourites] = useState(null);

  // Fetch Bookmarked Books
  useEffect(() => {
    const fetchBookmarkedBooks = async () => {
      setLoading(true); // Start loading
      try {
        const booksResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/getBookmarkedBooks`
        );
        setBookmarkedBooks(booksResponse.data.data || []);
      } catch (err) {
        setErrorBookmarks(err.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBookmarkedBooks();
  }, []);

  // Fetch Favourite Resources
  useEffect(() => {
    const fetchFavouriteResources = async () => {
      setLoading(true); // Start loading
      try {
        const resourcesResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/getFavouriteResources`);
        setFavouriteResources(resourcesResponse?.data?.data || []);
      } catch (err) {
        setErrorFavourites(err.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchFavouriteResources();
  }, []);

  const toggleBookmark = async (bookId) => {
    setLoading(true); // Start loading
    try {
      if (bookmarkedBooks.some((book) => book._id === bookId)) {
        // Unbookmark the book if it is already bookmarked
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/unbookmarkBook`, {
          bookId,
        });
        if (response.data.success) {
          setBookmarkedBooks((prev) =>
            prev.filter((book) => book._id !== bookId)
          );
        }
      } else {
        // Bookmark the book if it is not already bookmarked
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/bookmarkBook`, {
          bookId,
        });
        if (response.data.success) {
          const bookmarkedBook = await axios.get(
            `${
              import.meta.env.VITE_REACT_APP_BASE_URL
            }/books/api/v1/getBook/${bookId}`
          );
          setBookmarkedBooks((prev) => [...prev, bookmarkedBook.data.data]);
        }
      }
    } catch (err) {
      setErrorBookmarks(err.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleToggleFavouriteResource = async (resourceId) => {
    setLoading(true); // Start loading
    try {
      const isFavourited = favouriteResources.some(
        (resource) => resource._id === resourceId
      );

      if (isFavourited) {
        // Unfavourite the resource
        await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/unfavouriteResource`, { resourceId });
        setFavouriteResources((prev) =>
          prev.filter((resource) => resource._id !== resourceId)
        );
      } else {
        // Favourite the resource
        await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/favouriteResource`, { resourceId });
      }
    } catch (err) {
      setErrorFavourites(err.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <h2
        className={`${style.h2} ${style.sectionTitle} ${style.hasUnderline}`}
        id="section-title2"
        style={{ marginTop: "150px" }}
      >
        Bookmarked Books
        <span className={style.span} />
      </h2>

      {loading ? (
        <Loader />
      ) : errorBookmarks ? (
        <p style={{ color: "gold", textAlign: "center" }}>
          No favourite books added yet.
        </p>
      ) : bookmarkedBooks.length === 0 ? (
        <p style={{ color: "gold", textAlign: "center" }}>
          No favourite books added yet.
        </p>
      ) : (
        <div className={style.galleryContainer}>
          {bookmarkedBooks.map((book, index) => (
            <div key={index} className={style.bookContainer}>
              <div className={style.row}>
                <div
                  className={style.booki}
                  style={{ "--book-image": `url(${book.thumbnail})` }}
                >
                  <img
                    src={book.thumbnail}
                    alt={`Book ${index + 1}`}
                    className={style.bookiImg}
                  />
                  <div className={style.content}>
                    <h3>{book.title}</h3>
                  </div>
                </div>
              </div>
              <button
                className={style.btn}
                onClick={() => toggleBookmark(book._id)}
              >
                {bookmarkedBooks.some((b) => b._id === book._id) ? (
                  <IoBookmark size={20} />
                ) : (
                  <IoBookmarkOutline size={20} />
                )}
                <span>
                  {bookmarkedBooks.some((b) => b._id === book._id)
                    ? "Unbookmark"
                    : "Bookmark"}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      <h2
        className={`${style.h2} ${style.sectionTitle} ${style.hasUnderline}`}
        id="section-title2"
      >
        Favourite Resources
        <span className={style.span} />
      </h2>

      {loading ? (
        <Loader />
      ) : errorFavourites ? (
        <p style={{ color: "gold", textAlign: "center" }}>
          No favourite resources added yet.
        </p>
      ) : favouriteResources.length === 0 ? (
        <p style={{ color: "gold", textAlign: "center" }}>
          No favourite resources added yet.
        </p>
      ) : (
        <div className={style.galleryContainer}>
          {favouriteResources.map((resource, index) => (
            <div key={index} className={style.bookContainer}>
              <div className={style.row}>
                <div
                  className={style.booki}
                  style={{ "--book-image": `url(${resource.imgs})` }}
                >
                  <img
                    src={resource.thumbnail}
                    alt={`Resource ${index + 1}`}
                    className={style.bookiImg}
                  />
                  <div className={style.content}>
                    <h3>{resource.title}</h3>
                  </div>
                </div>
              </div>
              <button
                className={style.btn}
                onClick={() => handleToggleFavouriteResource(resource._id)}
              >
                {favouriteResources.some((res) => res._id === resource._id) ? (
                  <IoBookmark size={20} />
                ) : (
                  <IoBookmarkOutline size={20} />
                )}
                <span>
                  {favouriteResources.some((res) => res._id === resource._id)
                    ? "Unfavourite"
                    : "Favourite"}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
