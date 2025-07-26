import React from "react";
import "./Button.css";

const Button = ({ children, onClick, type = "button", style = {} }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="button"
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
