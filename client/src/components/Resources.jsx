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
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;
  const debounceDelay = 1000;
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.post("/resource/api/v1/getResources");
        setResources(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Debounce search functionality
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim()) {
        setLoading(true);
        try {
          const response = await axios.post(
            "/resource/api/v1/searchResources",
            {
              keyword: searchQuery,
            }
          );
          if (response.data.success) {
            setResources(response.data.data);
            setCurrentPage(0);
          } else {
            setResources([]);
          }
        } catch (error) {
          setError("Error fetching search results");
        } finally {
          setLoading(false);
        }
      } else {
        // Reset to fetch all resources if search query is empty
        const fetchRes = async () => {
          setLoading(true);
          try {
            const response = await axios.post("/resource/api/v1/getResources");
            setResources(response.data.data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        fetchRes();
      }
    }, debounceDelay);

    return () => {
      clearTimeout(handler); // Cleanup on unmount or searchQuery change
    };
  }, [searchQuery]);

  const offset = currentPage * itemsPerPage;
  if (resources) {
    var currentItems = resources?.slice(offset, offset + itemsPerPage);
    var pageCount = Math.ceil(resources?.length / itemsPerPage);
  } else {
     var currentItems = 0;
    var pageCount = 0;
  }
  return (
    <div>
      <h2
        className={`${style.h2} ${style.sectionTitle} ${style.hasUnderline}`}
        id="section-title1"
      >
        Resources
        <span className={style.span} />
      </h2>

      <div className={style.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for resources..."
          className={style.searchInput}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className={style.galleryContainer}>
          {currentItems?.map((resource, index) => (
            <div
              key={index}
              className={style.bookContainer}
              onClick={() => window.open(resource.link, "_blank")} // Open link in a new tab
            >
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
                    <h3>{resource.userId?.name}</h3>
                  </div>
                </div>
              </div>
              <button
                className={style.btn}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the parent onClick from firing
                  toggleFavourite(resource._id);
                }}
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
