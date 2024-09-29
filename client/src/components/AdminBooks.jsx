import React, { useState, useEffect } from "react";
import style from "../module/adminbooks.module.css";
import pdflogo from "../assets/download.jpeg";
import { IoSearch } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu";
import axios from "axios";
import Loader from "./Loader"; // Import Loader

const AdminBooks = () => {
  const [isGridView, setIsGridView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true); // Loader state for fetching books

  useEffect(() => {
    // Fetch books from the backend
    const fetchBooks = async () => {
      setLoading(true); // Show loader while fetching books
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/books/api/v1/getAllBooks`);
        if (response.data.success) {
          setBooks(response.data.data);
          setFilteredItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false); // Hide loader after fetching books
      }
    };

    fetchBooks();
  }, []);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const newFilteredItems = books.filter((item) =>
      item.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredItems(newFilteredItems);
  };

  const handleSearchClick = async () => {
    setLoading(true); // Show loader while searching
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/books/api/v1/searchBookByTitle`, {
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
    } finally {
      setLoading(false); // Hide loader after search is complete
    }
  };

  const handleFilterChange = (filterType, filterValue) => {
    setFilterType(filterType);
    setFilterValue(filterValue);
    applyFilter(filterType, filterValue);
  };

  const applyFilter = async (filterType, filterValue) => {
    setLoading(true); // Show loader while applying filter
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/books/api/v1/filter`, {
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
    } finally {
      setLoading(false); // Hide loader after filter is applied
    }
  };

  const handleDeleteClick = async (ISBN) => {
    setLoading(true); // Show loader while deleting a book
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/books/api/v1/deleteBook`,
        {
          data: { ISBN },
        }
      );
      if (response.data.success) {
        const newBooks = books.filter((book) => book.ISBN !== ISBN);
        setBooks(newBooks);
        setFilteredItems(newBooks);
      } else {
        console.log("Error deleting book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setLoading(false); // Hide loader after book is deleted
    }
  };

  if (loading) {
    return <Loader />; // Display loader when loading
  }

  return (
    <div className={style.body}>
      <div className={style.header}>
        <div>
          <DropdownMenu onFilterChange={handleFilterChange} />
        </div>
        <div className={style.inside}>
          <input
            type="text"
            className={style.searchBar}
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <IoSearch className={style.searchIcon} onClick={handleSearchClick} />
        </div>
        <button className={style.toggleButton} onClick={toggleView}>
          {isGridView ? "List View" : "Grid View"}
        </button>
      </div>
      <div className={isGridView ? style.gridContainer : style.listContainer}>
        {filteredItems.map((book, index) => (
          <div
            key={index}
            className={isGridView ? style.gridElement : style.element}
          >
            <div className={isGridView ? style.gridSet : style.set}>
              <img
                src={book.thumbnail || pdflogo}
                className={isGridView ? style.gridImgs : style.imgs}
                alt="Book Thumbnail"
              />
              <div className={style.texts}>
                {book.title}
                <FaTrash
                  className={style.icon}
                  onClick={() => handleDeleteClick(book.ISBN)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBooks;
