import React from "react";

const PaginationDots = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div className="pagination-dots">
      {Array.from({ length: totalPages }).map((_, index) => (
        <span
          key={index}
          className={`dot ${index + 1 === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(index + 1)}
        ></span>
      ))}
    </div>
  );
};

export default PaginationDots;
