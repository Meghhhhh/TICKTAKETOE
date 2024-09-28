import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../module/home.module.css";
import image from "../assets/logo-pink.png";
import Resources from "./Resources";
import RecommendedResources from "./RecommendedResources";
import Footer from "./Footer";

const Home = () => {
  const [favouriteResources, setFavouriteResources] = useState([]);
  const [userId, setUserId] = useState("logged-in-user-id"); // Replace with actual userId logic

  // Fetch user's favourite resources
  useEffect(() => {
    const fetchFavouriteResources = async () => {
      try {
        const response = await axios.get("/users/api/v1/getFavouriteResources", {
          params: { userId }, // Send userId as a query param or include in headers
        });
        if (response.data.success) {
          setFavouriteResources(
            response.data.data.map((resource) => resource._id)
          );
        }
      } catch (error) {
        console.error("Error fetching favourite resources:", error);
      }
    };

    fetchFavouriteResources();
  }, [userId,favouriteResources]);

  // Toggle favourite resource
  const toggleFavourite = async (resourceId) => {
    try {
      if (favouriteResources.includes(resourceId)) {
        // Unfavourite the resource
        const response = await axios.post("/users/api/v1/unfavouriteResource", {
          userId, // Send userId in request
          resourceId,
        });
        if (response.data.success) {
          setFavouriteResources(favouriteResources.filter((id) => id !== resourceId));
        }
      } else {
        // Favourite the resource
        const response = await axios.post("/users/api/v1/favouriteResource", {
          userId, // Send userId in request
          resourceId,
        });
        if (response.data.success) {
          setFavouriteResources([...favouriteResources, resourceId]);
        }
      }
    } catch (error) {
      console.error("Error favouriting/unfavouriting resource:", error);
    }
  };

  return (
    <div>
      <div className={style.outerConatiner}>
        <div className={style.secondMain}>
          <div className={style.textOuter}>
            <div className={style.hf}>Elite Reads</div>
            <div className={style.hs}>One stop library</div>
            <div className={style.ht}>for all your books</div>
          </div>
          <div className={style.imageOuter}>
            <img src={image} alt="" className={style.firstImg} />
          </div>
        </div>
      </div>
      <Resources
        favouriteResources={favouriteResources}
        toggleFavourite={toggleFavourite}
      />
      <RecommendedResources
        favouriteResources={favouriteResources}
        toggleFavourite={toggleFavourite}
      />
      <Footer />
    </div>
  );
};

export default Home;