import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Loader from "./Loader";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import style from "../module/resources.module.css";

const Resources = ({ favouriteResources, toggleFavourite }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const itemsPerPage = 5;
  const debounceDelay = 1000;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.post("/resource/api/v1/getResources");
        setResources(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          const response = await axios.post("/resource/api/v1/searchResources", {
            keyword: searchQuery,
          });
          if (response.data.success) {
            setResources(response.data.data);
            setCurrentPage(0);
          } else {
            setResources([]);
          }
        } catch (error) {
          console.log(error);
          
        }
      } else {
        const fetchRes = async () => {
          try {
            const response = await axios.post("/resource/api/v1/getResources");
            setResources(response.data.data);
          } catch (err) {
            console.log(err);
            
          }
        };
        fetchRes();
      }
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const filteredResources = resources.filter((resource) => {
    if (filter === "all") {
      return true;
    }
    return resource.category === filter;
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredResources.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredResources.length / itemsPerPage);

  return (
    <div>
      <h2 className={`${style.h2} ${style.sectionTitle} ${style.hasUnderline}`} id="section-title1">
        Resources
        <span className={style.span} />
      </h2>

      <div className={style.searchContainer}>
        <div className={style.filterContainer}>
          <label>Filter by category:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={style.filterSelect}
          >
            <option value="all">All</option>
            <option value="pdf">PDF</option>
            <option value="link">Link</option>
            <option value="word">Word Document</option>
          </select>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for resources..."
          className={style.searchInput}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className={style.galleryContainer}>
          {currentItems.map((resource, index) => (
            <div
              key={index}
              className={style.bookContainer}
              onClick={() => window.open(resource.link, "_blank")}
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
                  e.stopPropagation();
                  toggleFavourite(resource._id);
                }}
              >
                {favouriteResources.includes(resource._id) ? (
                  <IoBookmark size={20} />
                ) : (
                  <IoBookmarkOutline size={20} />
                )}
                <span>
                  {favouriteResources.includes(resource._id) ? "Unfavourite" : "Favourite"}
                </span>
              </button>
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

export default Resources;
