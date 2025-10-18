import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    services: false,
    expertise: false,
    solutions: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size to handle mobile vs desktop behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen((prevState) => {
      const newState = {
        services: false,
        expertise: false,
        solutions: false,
      };

      // Toggle the clicked dropdown
      newState[menu] = !prevState[menu];
      return newState;
    });
  };

  return (
    <div className="menu-container">
      {/* Hamburger icon visible on mobile */}
      <div className="hamburger-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Menu items */}
      <ul
        className="menu-items"
        style={{ display: isOpen || !isMobile ? "flex" : "none" }}
      >
        <li>
          <Link to="/">Home </Link>
        </li>

        {/* Dropdown for Our Services */}
        <li
          className="dropdown"
          onClick={() => toggleDropdown("services")}
          onMouseEnter={() => !isMobile && toggleDropdown("services")}
          onMouseLeave={() => !isMobile && toggleDropdown("services")}
        >
          Our Services
          <ul
            className={`dropdown-menu ${dropdownOpen.services ? "show" : ""}`}
          >
            <li>
              <Link to="/service">About</Link>
            </li>
            <li>Service 2</li>
            <li>Service 3</li>
          </ul>
        </li>

        {/* Dropdown for Our Expertise */}
        <li
          className="dropdown"
          onClick={() => toggleDropdown("expertise")}
          onMouseEnter={() => !isMobile && toggleDropdown("expertise")}
          onMouseLeave={() => !isMobile && toggleDropdown("expertise")}
        >
          Our Expertise
          <ul
            className={`dropdown-menu ${dropdownOpen.expertise ? "show" : ""}`}
          >
            <li>Expertise 1</li>
            <li>Expertise 2</li>
            <li>Expertise 3</li>
          </ul>
        </li>

        {/* Dropdown for Solutions */}
        <li
          className="dropdown"
          onClick={() => toggleDropdown("solutions")}
          onMouseEnter={() => !isMobile && toggleDropdown("solutions")}
          onMouseLeave={() => !isMobile && toggleDropdown("solutions")}
        >
          Solutions
          <ul
            className={`dropdown-menu ${dropdownOpen.solutions ? "show" : ""}`}
          >
            <li>Solution 1</li>
            <li>Solution 2</li>
            <li>Solution 3</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
