import React from "react";
import "./Pagination.css";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  scrollToTopToCards,
}) => {
  const maxVisiblePages = 5;

  const getPagination = () => {
    let pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pagination-main">
      {/* Previous Button */}
      <button
        onClick={() => {
          onPageChange(currentPage - 1);
          scrollToTopToCards();
        }}
        disabled={currentPage === 1}
        className="px-sm-3 px-1 p-sm-1 py-0.5 border rounded disabled:opacity-50"
      >
        <FaAngleLeft />
      </button>

      {/* Page Numbers */}
      {getPagination().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-sm-3 px-1 p-sm-1 py-0.5">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => {
              onPageChange(page);
              scrollToTopToCards();
            }}
            className={`page-btn px-sm-3 px-1 p-sm-1 py-0.5 border rounded ${
              currentPage === page ? "active-page" : ""
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => {
          onPageChange(currentPage + 1);
          scrollToTopToCards();
        }}
        disabled={currentPage === totalPages}
        className="px-sm-3 px-1 p-sm-1 py-0.5 border rounded disabled:opacity-50"
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default Pagination;
