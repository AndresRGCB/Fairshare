import React, { useState } from "react";
import "./PeriodSelector.css";

const PeriodSelector = ({ onSelect }) => {
  const [selected, setSelected] = useState("daily");

  const handleSelect = (period) => {
    setSelected(period);
    if (onSelect) onSelect(period);
  };

  return (
    <div className="period-selector">
      <div className="period-pill">
        <button
          className={`period-btn left ${selected === "daily" ? "selected" : ""}`}
          onClick={() => handleSelect("daily")}
        >
          Daily
        </button>
        <button
          className={`period-btn right ${selected === "monthly" ? "selected" : ""}`}
          onClick={() => handleSelect("monthly")}
        >
          Monthly
        </button>
      </div>
    </div>
  );
};

export default PeriodSelector;
