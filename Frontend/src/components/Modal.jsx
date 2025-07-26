import React, { useState } from "react";
import "./Modal.css";
import { FaTimes } from "react-icons/fa";
import LabelDropdown from "./LabelDropdown";
import AmountInput from "./AmountInput";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 🔹 API URL

const Modal = ({ onClose, labels, refreshExpenses }) => {
  const [title, setTitle] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("");
  const [isInstallments, setIsInstallments] = useState(false);
  const [numInstallments, setNumInstallments] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [isIncome, setIsIncome] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Prevent multiple submissions
  const [date, setDate] = useState(() => {
    const now = new Date();
    const utc6Offset = -6 * 60; // UTC-6 in minutes
    const localOffset = now.getTimezoneOffset(); // current timezone offset in minutes
    const utc6Date = new Date(now.getTime() - (localOffset - utc6Offset) * 60000);
    return utc6Date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  });
  
  

  // 🔹 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in.");
      setIsSubmitting(false);
      return;
    }
  
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      alert("User ID not found. Please log in again.");
      setIsSubmitting(false);
      return;
    }
  
    const sanitizedAmount = amount.replace(/,/g, "");
    if (!sanitizedAmount || isNaN(sanitizedAmount)) {
      alert("Invalid amount. Please enter a valid number.");
      setIsSubmitting(false);
      return;
    }
  
    const formattedAmount = isIncome
      ? Math.abs(Number(sanitizedAmount))
      : -Math.abs(Number(sanitizedAmount));
  
    if (isRecurring && isInstallments) {
      alert("An expense cannot be both recurring and in installments.");
      setIsSubmitting(false);
      return;
    }

    const expenseData = {
      title,
      amount: formattedAmount,
      type: isIncome ? "income" : "expense",
      is_recurring: isRecurring ? "yes" : "no",
      recurring_frequency: isRecurring ? recurringFrequency : null,
      is_installment: isInstallments ? "yes" : "no",
      num_installments: isInstallments ? Number(numInstallments) : null,
      date: (!isRecurring || isInstallments) ? date : null, // ✅ Send only if relevant
      notes,
      labels: selectedLabels.map((label) => ({
        name: label.name,
        color: label.color,
      })),
      user_id,
    };
    
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save expense: ${response.statusText}`);
      }
  
  
      // Call refreshExpenses and wait for it to complete
      await refreshExpenses();
      
      // Then close modal
      setIsSubmitting(false);
      onClose();
  
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Error connecting to the server.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 🔹 Header Section */}
        <div className="modal-header">
          Add New Expense
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* 🔹 Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* 🔹 Title */}
            <div className="form-group">
              <label>Title</label>
              <input type="text" placeholder="Enter expense title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* 🔹 Amount */}
            <div className="form-group">
              <AmountInput amount={amount} setAmount={setAmount} isIncome={isIncome} setIsIncome={setIsIncome} />
            </div>

            {/* 🔹 Expense Type */}
            <div className="form-group">
              <label>Type</label>
              <select
                value={
                  isRecurring ? "recurring" : isInstallments ? "installment" : "single"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setIsRecurring(value === "recurring");
                  setIsInstallments(value === "installment");
                }}
              >
                <option value="single">Single Time</option>
                <option value="recurring">Recurring</option>
                <option value="installment">Installments</option>
              </select>
            </div>

            {/* 🔹 Number of Installments */}
            {isInstallments && (
              <div className="form-group">
                <label>Number of Installments</label>
                <input
                  type="number"
                  min="1"
                  value={numInstallments}
                  onChange={(e) => setNumInstallments(e.target.value)}
                />
              </div>
            )}

            {/* 🔹 Date */}
            {(!isRecurring || isInstallments) && (
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            )}



            {/* 🔹 Labels Dropdown */}
            <div className="form-group">
              <label>Labels</label>
              <LabelDropdown labels={labels} selectedLabels={selectedLabels} setSelectedLabels={setSelectedLabels} />
            </div>

            
          </div>

          {/* 🔹 Submit Button */}
          <button type="submit" className="modal-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
