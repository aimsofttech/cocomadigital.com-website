import React, { useState } from "react";
import "./Category.css";
import SearchInput from "../../common/SearchInput/SearchInput";
import { GrFormDown } from "react-icons/gr";
import EditLink from "../../Edit-Link/Edit-Link";
import { ADMIN_URL } from "../../../utils";

const Category = ({
  categories,
  activeCategory,
  setActiveCategory,
  setSearchInput,
}) => {
  return (
    <header className="blog-header">
      <nav className="blog-navigation">
        <div
          style={{ marginRight: "10px" }}
          className={`blog-nav-link ${!activeCategory && "blog-category-active"
            }`}
          onClick={() => setActiveCategory("")}
        >
          All
        </div>
        {categories?.map((item, index) => (
          <NavItem
            key={index}
            title={item?.blog_category_name}
            items={item?.sub_categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        ))}
        <EditLink
          path={`${ADMIN_URL}/blog`} className="mb-2"
        />
      </nav>
      <SearchInput setSearchInput={setSearchInput} />
    </header>
  );
};

const NavItem = ({ title, items, activeCategory, setActiveCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasDropdown = items && items.length > 0;
  const categoryListArray = items?.map((item) => item?.blog_sub_category_slug);

  return (
    <div
      className="blog-nav-item"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={`blog-nav-link ${categoryListArray.includes(activeCategory) && "blog-category-active"
          }`}
      >
        {title}
        {items.length > 0 && (
          <span className={`blog-dropdown-icon ${isOpen ? "rotate" : " "}`}>
            <GrFormDown size={20} />
          </span>
        )}
      </div>
      {hasDropdown && isOpen && (
        <div className="blog-dropdown">
          <div className="blog-dropdown-content">
            {items?.map((item, index) => (
              <button
                key={index}
                className={`blog-dropdown-item ${activeCategory === item?.blog_sub_category_slug
                  ? "active"
                  : " "
                  }`}
                onClick={() => setActiveCategory(item?.blog_sub_category_slug)}
              >
                {item?.blog_sub_category_name}
              </button>
            ))}
              <EditLink
                path={`${ADMIN_URL}/blog_sub_category`}
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
