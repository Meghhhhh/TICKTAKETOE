import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import style from "../module/resources.module.css";

const Resources = ({ favouriteResources, toggleFavourite }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.post("/resource/api/v1/getResources");
        setResources(response.data.data); // Store all resources in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected); // Set the selected page when the user clicks a page button
  };

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
          {currentItems.map((resource, index) => (
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
                    <h3>{resource.userId.name}</h3>
                  </div>
                </div>
              </div>
              <button
                className={style.btn}
                onClick={() => toggleFavourite(resource._id)}
              >
                {favouriteResources.includes(resource._id) ? (
                  <IoBookmark size={20} />
                ) : (
                  <IoBookmarkOutline size={20} />
                )}
                <span>
                  {favouriteResources.includes(resource._id)
                    ? "Unfavourite"
                    : "Favourite"}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

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