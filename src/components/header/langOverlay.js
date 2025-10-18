import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

// List of languages for selection
const languages = [
  "english",
  "french",
  "german",
  "italian",
  "spanish",
  "dutch",
];

function LanguageSelector() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    sessionStorage.getItem("selectedLanguage") || "english"
  );

  // Toggles the dropdown visibility
  const handleToggle = (isOpen) => setShowDropdown(isOpen);

  // Handle the selection of a language
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    sessionStorage.setItem("selectedLanguage", language); // Store the language in sessionStorage
    setShowDropdown(false); // Close the dropdown after selection
  };

  return (
    <div>
      <Dropdown
        show={showDropdown}
        onToggle={handleToggle}
        drop="bottom"
        className="language-dropdown-container"
      >
        <Dropdown.Toggle
          variant="dark"
          id="language-dropdown-toggle"
          className="language-dropdown-toggle"
        >
          {selectedLanguage.substring(0, 2).toUpperCase()}
        </Dropdown.Toggle>
        <Dropdown.Menu className="language-dropdown-menu ">
          {languages.map((language) => (
            <Dropdown.Item
              key={language}
              onClick={() => handleLanguageSelect(language)}
              active={language === selectedLanguage}
              className="language-dropdown-item"
            >
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default LanguageSelector;
