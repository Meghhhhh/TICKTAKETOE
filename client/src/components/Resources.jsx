import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import style from "../module/resources.module.css";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchRes = async () => {
      try {
        const response = await axios.post("/resource/api/v1/getResources");
        setResources(response.data.data); // Store all resources in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRes();
  }, []);

  const toggleBookmark = async (bookId) => {
    try {
      // If the book is already bookmarked, unbookmark it
      if (bookmarkedBooks.includes(bookId)) {
        const response = await axios.post("/resource/api/v1/bookmarkResource", {
          resourceId : bookId,
        });
        if (response.data.success) {
          setBookmarkedBooks(
            bookmarkedBooks.filter((id) => id !== bookId)
          );
        }
      } else {
        // Bookmark the book if not already bookmarked
        const response = await axios.post("/resource/api/v1/bookmarkResource", {
          resourceId : bookId,
        });
        if (response.data.success) {
          setBookmarkedBooks([...bookmarkedBooks, bookId]);
        }
      }
    } catch (error) {
      console.error("Error bookmarking/unbookmarking book:", error);
    }
  };

  useEffect(() => {
    // Fetch bookmarked books
    const fetchBookmarkedBooks = async () => {
      try {
        const response = await axios.get("/users/api/v1/getBookmarkedBooks");
        if (response.data.success) {
          setBookmarkedBooks(response.data.data.map((book) => book._id));
        }
      } catch (error) {
        console.error("Error fetching bookmarked books:", error);
      }
    };

    fetchBookmarkedBooks();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected); // Set the selected page when the user clicks a page button
  };

  // Calculate the starting and ending index for the items to display on the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = resources.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(resources.length / itemsPerPage);

  return (
    <div>
      <h2
        className={`${style.h2} ${style.sectionTitle} ${style.hasUnderline}`}
        id="section-title1"
      >
        Resources
        <span className={style.span} />
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className={style.galleryContainer}>
          {currentItems.map((book, index) => (
            <div key={index} className={style.bookContainer}>
              <div className={style.row}>
                <div
                  className={style.booki}
                  style={{ "--book-image": `url(${book.imgs})` }}
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
                {bookmarkedBooks.includes(book._id) ? (
                  <IoBookmark size={20} />
                ) : (
                  <IoBookmarkOutline size={20} />
                )}
                <span>
                  {bookmarkedBooks.includes(book._id) ? "Unbookmark" : "Bookmark"}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* React Paginate component */}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={style.pagination}
        pageClassName={style.pageItem}
        pageLinkClassName={style.pageLink}
        previousClassName={style.pageItem}
        nextClassName={style.pageItem}
        previousLinkClassName={style.pageLink}
        nextLinkClassName={style.pageLink}
        breakClassName={style.pageItem}
        breakLinkClassName={style.pageLink}
        activeClassName={style.active}
        disabledClassName={style.disabled}
      />
    </div>
  );
};

export default Resources;
