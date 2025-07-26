import React from "react";
import "./InputField.css";

const InputField = ({ label, type, value, onChange }) => {
  return (
    <div className="input-container">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="input-field"
        placeholder={label} // Optional: Add a dynamic placeholder
      />
    </div>
  );
};

export default InputField;

