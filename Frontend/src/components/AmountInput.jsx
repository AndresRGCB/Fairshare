import React from "react";
import "./AmountInput.css"; // ✅ Import the new styles

const AmountInput = ({ amount, setAmount, isIncome, setIsIncome }) => {
  // Format input with commas
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    setAmount(formattedValue);
  };

  return (
    <div className="amount-input-container">
      <label>Amount</label>
      <div className={`input-wrapper ${isIncome ? "income" : "expense"}`}>
        <span className="currency">$</span>
        <input
          type="text"
          placeholder="Enter amount"
          value={amount}
          onChange={handleAmountChange}
          className={isIncome ? "green-text" : "red-text"} // ✅ Change text color
          required
        />
        {/* 🔹 Vertical Toggle Buttons */}
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${isIncome ? "active plus-btn" : ""}`}
            onClick={() => setIsIncome(true)}
          >
            +
          </button>
          <button
            className={`toggle-btn ${!isIncome ? "active minus-btn" : ""}`}
            onClick={() => setIsIncome(false)}
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmountInput;
