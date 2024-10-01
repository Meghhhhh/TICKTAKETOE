import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../module/myresources.module.css";
import Loader from "./Loader"

const Myresources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingResourceId,setDeletingResourceId]=useState("");


  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/resource/api/v1/getMyResources` ,{
          withCredentials: true,
        });
        setResources(response?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    setDeletingResourceId(id); // Set the resource ID that is being deleted
    try {
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_BASE_URL}/resource/api/v1/deleteResource`, {
        data: { id },
      });
      if (response.data.success) {
        setResources(resources.filter((resource) => resource._id !== id));
      } else {
        console.error("Failed to delete resource:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    } finally {
      setDeletingResourceId(null); // Reset after deletion is complete
    }
  };

  if (loading) {
    return <div className={styles.loading}><Loader/></div>;
  }

  return (
    <div className={styles.container}>
      {resources?.length === 0 || resources === null ? (
        <div className={styles.noResourcesMessage}>No resources available</div>
      ) : (
        resources?.map((resource) => (
          <div key={resource._id} className={styles.card}>
            <h3 className={styles.title}>{resource.title}</h3>
            <p className={styles.description}>{resource.description}</p>
            <p className={styles.category}>Category: {resource.category}</p>
            {resource.link && (
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                View Resource
              </a>
            )}

            {deletingResourceId === resource._id ? (
              <div className={styles.deletingLoader}><Loader/></div> // Show loader while deleting
            ) : (
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(resource._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Myresources;
