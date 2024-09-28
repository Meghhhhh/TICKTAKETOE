import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../module/myresources.module.css";

const Myresources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "66f70a4d80b3ff3d764b9f02";

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.post("resource/api/v1/getResources", { userId });
        setResources(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {resources.map((resource) => (
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
        </div>
      ))}
    </div>
  );
};

export default Myresources;
