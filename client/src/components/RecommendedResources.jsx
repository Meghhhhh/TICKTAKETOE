import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import style from "../module/resources.module.css";

const RecommendedResources = ({ favouriteResources, toggleFavourite }) => {
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const userId = localStorage.getItem("userId") || "default-user-id";
  const resourceId = "some-resource-id"; // Replace with the current resource ID if needed

  useEffect(() => {
    const fetchRecommendedResources = async () => {
      try {
        const [contentResponse, collaborativeResponse] = await Promise.all([
          axios.post("/resource/api/v1/recommendResourcesByContent", {
            resourceId,
          }),
          axios.post(
            "/resource/api/v1/recommendResourcesByCollaborativeFiltering",
            {
              userId,
            }
          ),
        ]);

        const contentData = contentResponse.data.data || [];
        const collaborativeData = collaborativeResponse.data.data || [];
        const combinedData = [
          ...new Set([...contentData, ...collaborativeData]),
        ];

        setRecommendedResources(combinedData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedResources();
  }, [userId, resourceId]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = recommendedResources.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(recommendedResources.length / itemsPerPage);

  return (
    <div>
      <h2
        className={`${style.h2} ${style.sectionTitle} ${style.hasUnderline}`}
        id="section-title2"
      >
        Recommended Resources
        <span className={style.span} />
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : currentItems.length === 0 ? (
        <p className={style.noResourcesMessage}>Please login to get recommendations</p>
      ) : (
        <div className={style.galleryContainer}>
          {currentItems.map((resource, index) => (
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

export default RecommendedResources;
