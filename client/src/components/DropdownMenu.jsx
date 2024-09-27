import React, { useState, useRef } from "react";
import styles from "../module/dropdownmenu.module.css";

const DropdownMenu = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(""); // State for selected genre
  const [selectedAuthor, setSelectedAuthor] = useState(""); // State for selected author
  const [selectedLanguage, setSelectedLanguage] = useState(""); // State for selected language

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre); // Update state
    onFilterChange("genre", genre);
  };

  const handleAuthorChange = (e) => {
    if (e.key === "Enter") {
      const author = e.target.value;
      setSelectedAuthor(author); // Update state
      onFilterChange("author", author);
    }
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language); // Update state
    onFilterChange("language", language);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button
        type="button"
        className={styles.dropdownButton}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
      >
        <span>Filters</span>
        <svg
          className={`${styles.icon} ${isOpen ? styles.rotate : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={styles.dropdownMenu}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          {/* Genre Dropdown */}
          <div className={styles.menuItem}>
            <label htmlFor="genreSelect">Genre:</label>
            <select
              id="genreSelect"
              className={styles.formControl}
              value={selectedGenre} // Persist selected genre
              onChange={handleGenreChange}
              required
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Young-Adult">Young-Adult</option>
              <option value="Children-Books">Children-Books</option>
              <option value="Graphic-Novels">Graphic-Novels</option>
            </select>
          </div>

          {/* Author Input */}
          <div className={styles.menuItem}>
            <label htmlFor="authorInput">Author:</label>
            <input
              type="text"
              id="authorInput"
              className={styles.formControl}
              value={selectedAuthor} // Persist selected author
              onChange={(e) => setSelectedAuthor(e.target.value)} // Update state on change
              onKeyDown={handleAuthorChange}
              placeholder="Enter author name"
              required
            />
          </div>

          {/* Language Dropdown */}
          <div className={styles.menuItem}>
            <label htmlFor="languageSelect">Language:</label>
            <select
              id="languageSelect"
              className={styles.formControl}
              value={selectedLanguage} // Persist selected language
              onChange={handleLanguageChange}
              required
            >
              <option value="">Select Language</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
