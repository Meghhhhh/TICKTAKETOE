import { useState, useEffect } from "react";
import style from "../module/books.module.css";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import DropdownMenu from "./DropdownMenu";
import axios from "axios";
import Loader from "./Loader"

const Books = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch books from the backend
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/books/api/v1/getAllBooks`);
        if (response.data.success) {
          setBooks(response.data.data);
          setFilteredItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false); // Stop loading once books are fetched
      }
    };

    // Fetch bookmarked books
    const fetchBookmarkedBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/getBookmarkedBooks`);
        if (response.data.success) {
          setBookmarkedBooks(response.data.data.map((book) => book._id));
        }
      } catch (error) {
        console.error("Error fetching bookmarked books:", error);
      }
    };

    fetchBooks();
    fetchBookmarkedBooks();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const newFilteredItems = books.filter((item) =>
      item.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredItems(newFilteredItems);
  };

  const handleSearchClick = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}books/api/v1/searchBookByTitle`, {
        title: searchQuery,
      });
      if (response.data.success) {
        setFilteredItems(response.data.data);
      } else {
        setFilteredItems([]);
        console.log("No books found");
      }
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const handleFilterChange = (filterType, filterValue) => {
    setFilterType(filterType);
    setFilterValue(filterValue);
    applyFilter(filterType, filterValue);
  };

  const applyFilter = async (filterType, filterValue) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}books/api/v1/filter`, {
        type: filterType,
        value: filterValue,
      });
      if (response.data.success) {
        setFilteredItems(response.data.data);
      } else {
        setFilteredItems([]);
      }
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  const toggleBookmark = async (bookId) => {
    try {
      // If the book is already bookmarked, unbookmark it
      if (bookmarkedBooks.includes(bookId)) {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/unbookmarkBook`, {
          bookId,
        });
        if (response.data.success) {
          setBookmarkedBooks(bookmarkedBooks.filter((id) => id !== bookId));
        }
      } else {
        // Bookmark the book if not already bookmarked
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/users/api/v1/bookmarkBook`, {
          bookId,
        });
        if (response.data.success) {
          setBookmarkedBooks([...bookmarkedBooks, bookId]);
        }
      }
    } catch (error) {
      console.error("Error bookmarking/unbookmarking book:", error);
    }
  };

  return (
    <div className={style.outermost}>
      <div className={style.sec1}>
        <h2 className={style.mainHead}>Welcome to the world of BOOKS</h2>
      </div>
      <div className={style.sec2}>
        <div>
          <DropdownMenu onFilterChange={handleFilterChange} />
        </div>
        <input
          type="text"
          className={style.searchBar}
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className={style.sec3}>
        <h2 className={style.header}>All arrivals</h2>

        {loading ? (
          <Loader/> // Display loader while data is being fetched
        ) : filteredItems.length === 0 ? (
          <p className={style.noResourcesMessage}>
            No books found matching your search or filter criteria.
          </p>
        ) : (
          <div className={style.galleryConatiner}>
            {filteredItems.map((book, index) => (
              <div key={index}>
                <div className={style.row}>
                  <div
                    className={style.booki}
                    style={{ "--book-image": `url(${book.bookiImg})` }}
                  >
                    <img
                      src={book.thumbnail}
                      alt={`Book ${index + 1}`}
                      className={style.bookiImg}
                    />
                    <div className={style.content}>
                      <h3>{book.title}</h3>
                      <h6>{book.year}</h6>
                      <h5>{book.genre}</h5>
                    </div>
                  </div>
                </div>
                <div className={style.info}>
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
                      {bookmarkedBooks.includes(book._id)
                        ? "Unbookmark"
                        : "Bookmark"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
