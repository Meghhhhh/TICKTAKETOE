import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ReactPaginate from "react-paginate";
import style from "../module/resources.module.css";

const Recommended = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://ticktechtoe.onrender.com/books/api/v1/getLatests"
        );
        setBooks(response?.data?.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const offset = currentPage * itemsPerPage;
  const currentItems = books.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(books.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div>
      <h2 className={`${style.h2} ${style.sectionTitle} ${style.hasUnderline}`} id="section-title1">
        New Arrivals Books
        <span className={style.span} />
      </h2>

      {loading ? (
        <Loader />
      ) : currentItems.length === 0 ? (
        <p>No books available</p>
      ) : (
        <div className={style.galleryContainer}>
          {currentItems.map((book, index) => (
            <div key={index}>
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
                    <h6>{book.year}</h6>
                    <h5>{book.genre}</h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conditional rendering for pagination */}
      {currentItems.length > 0 && pageCount > 1 && (
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
        )}
      </div>
    );
  };
  
  export default Recommended;
  