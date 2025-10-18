import React from "react";
import "./SearchInput.css";

const SearchInput = ({ setSearchInput }) => {
  return (
    <div className="search-input-main">
      <input
        className="search-input"
        type="text"
        name="category"
        placeholder="Search..."
        onChange={(event) => setSearchInput(event.target.value)}
      />
    </div>
  );
};

export default SearchInput;
