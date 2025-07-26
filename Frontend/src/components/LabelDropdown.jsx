import React, { useState, useEffect, useRef } from "react";
import "./LabelDropdown.css";

const getRandomColor = (selectedLabels = []) => {
  const colors = [
    "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#9333ea", "#14b8a6",
    "#ff69b4", "#ff4500", "#2ecc71", "#1abc9c", "#3498db", "#9b59b6",
    "#f1c40f", "#e74c3c", "#95a5a6", "#d35400", "#8e44ad", "#16a085",
    "#2c3e50", "#c0392b", "#7f8c8d", "#27ae60", "#ff7700", "#00bfff",
    "#ff1493", "#7b68ee", "#dc143c", "#ff8c00", "#20b2aa", "#4682b4"
  ];
  
  let randomColor;
  do {
    randomColor = colors[Math.floor(Math.random() * colors.length)];
  } while (selectedLabels.some((label) => label.color === randomColor));

  return randomColor;
};

const LabelDropdown = ({ labels = [], selectedLabels, setSelectedLabels }) => {
  const [newLabel, setNewLabel] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Select a label (allow only one)
  const handleSelectLabel = (label) => {
    // Set the selected label directly, allowing only one
    setSelectedLabels([label]); // Set as an array with a single label
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  // 🔹 Add new label (without triggering form submission)
  const handleAddLabel = (e) => {
    e.preventDefault();

    if (newLabel.trim() && !labels.some((label) => label.name === newLabel)) {
      const newLabelObj = { name: newLabel, color: getRandomColor(selectedLabels) };
      setSelectedLabels([newLabelObj]); // Set as an array with the new label
      setNewLabel("");
    }
  };

  // 🔹 Remove a selected label
  const removeLabel = () => {
    setSelectedLabels([]); // Clear the selected label
  };

  return (
    <div className="label-dropdown" ref={dropdownRef}>
      {/* Selected Labels */}
      <div className="selected-labels" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {selectedLabels.length > 0 ? (
          selectedLabels.map((label, index) => (
            <span key={index} className="label-tag" style={{ backgroundColor: label.color }}>
              {label.name}
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeLabel();
                }}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="placeholder-text">Select a label...</span>
        )}
      </div>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div className="dropdown-content">
          {/* Existing Labels */}
          {labels.map((label, index) => (
            <div key={index} className="dropdown-item" onClick={() => handleSelectLabel(label)}>
              <span className="color-dot" style={{ backgroundColor: label.color }}></span>
              {label.name}
            </div>
          ))}

          {/* Divider */}
          <div className="dropdown-divider"></div>

          {/* Add New Label */}
          <div className="add-label">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Add new label"
              className="new-label-input"
            />
            <button onClick={handleAddLabel} className="add-btn">+</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelDropdown;
