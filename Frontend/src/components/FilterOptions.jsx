import React from "react";

const FilterOptions = ({ selectedFilter, setFilter }) => {
  return (
    <div className="filter-options">
      <select value={selectedFilter} onChange={(e) => setFilter(e.target.value)}>
        <option value="day">Today</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="lifetime">Lifetime</option>
      </select>
    </div>
  );
};

export default FilterOptions;
