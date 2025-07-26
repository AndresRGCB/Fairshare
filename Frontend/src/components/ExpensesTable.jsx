import React, { useState, useEffect } from "react";
import "./ExpensesTable.css";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import Modal from "./Modal";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const StatusIndicator = ({ isActive }) => (
  <span className={`status-indicator ${isActive ? 'active' : 'inactive'}`}>
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

const ExpensesTable = ({ 
  expenses, 
  refreshExpenses,
  currentPage,
  totalPages,
  onPageChange,
  dateFilter,
  onDateFilterChange,
  expenseType,
  onExpenseTypeChange
}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDateFilterChange = (value) => {
    onDateFilterChange(value);
  };

  const handleExpenseTypeChange = (value) => {
    onExpenseTypeChange(value);
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // 🔥 Fetch expenses from API
  const fetchExpenses = async (page = currentPage, items = 10, filter = dateFilter) => {
    try {

      const response = await fetch(
        `${API_BASE_URL}?page=${page}&items_per_page=${items}&date_filter=${filter}&timestamp=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch expenses. Status: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // 🔥 Delete Expense Function
  const deleteExpense = async (expenseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(
        `${API_BASE_URL}/api/expenses/delete/${expenseType}/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete expense. Status: ${response.status}`);
      }
  
      refreshExpenses(); // ✅ Refresh the list
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Error deleting expense. Please try again.");
    }
  };
  
  

  const renderLabels = (labels) => {
    
    if (!labels || labels.length === 0) return "-";
    
    return (
      <div className="labels-container">
        {labels.map((label, index) => (
          <span 
            key={index} 
            className="label-bubble"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
          </span>
        ))}
      </div>
    );
  };

  // Renderiza diferentes columnas según el tipo de gasto
  const renderTableHeader = () => {
    switch (expenseType) {
      case "recurring":
        return (
          <div className="table-header recurring-type">
            <span>Title</span>
            <span>Amount</span>
            <span>Created At</span>
            <span>Status</span>
            {windowWidth >= 1000 && <span>Labels</span>}
            <span>Actions</span>
          </div>
        );
      case "installment":
        return (
          <div className="table-header installment-type">
            <span>Title</span>
            <span>Amount</span>
            {windowWidth >= 1000 && <span>Begin Date</span>}
            <span>End Date</span>
            <span>Status</span>
            {windowWidth >= 1000 && <span>Labels</span>}
            <span>Actions</span>
          </div>
        );
      default: // single
        return (
          <div className="table-header single-type">
            <span>Title</span>
            <span>Amount</span>
            <span>Date</span>
            {windowWidth >= 1000 && <span>Labels</span>}
            <span>Actions</span>
          </div>
        );
    }
  };

  const renderTableRow = (expense) => {
    switch (expenseType) {
      case "recurring":
        return (
          <div className="table-row recurring-type">
            <span>{expense.title}</span>
            <span className="amount">${Math.abs(expense.amount)}</span>
            <span>{new Date(expense.created_at).toLocaleDateString()}</span>
            <span><StatusIndicator isActive={expense.is_active} /></span>
            {windowWidth >= 1000 && (
              <span className="labels-cell">
                {renderLabels(expense.labels)}
              </span>
            )}
            <span className="actions">
              {expense.is_active && (
                <FaTrash 
                  className="delete-icon" 
                  onClick={() => deleteExpense(expense.id)}
                />
              )}
            </span>
          </div>
        );
      case "installment":
        return (
          <div className="table-row installment-type">
            <span>{expense.title}</span>
            <span className="amount">${Math.abs(expense.amount)}</span>
            {windowWidth >= 1000 && (
              <span>{new Date(expense.begin_date).toLocaleDateString()}</span>
            )}
            <span>{new Date(expense.end_date).toLocaleDateString()}</span>
            <span><StatusIndicator isActive={expense.is_active} /></span>
            {windowWidth >= 1000 && (
              <span className="labels-cell">{renderLabels(expense.labels)}</span>
            )}
            <span className="actions">
              {expense.is_active && (
                <FaTrash 
                  className="delete-icon" 
                  onClick={() => deleteExpense(expense.id)}
                />
              )}
            </span>
          </div>
        );
      default: // single
        return (
          <div className="table-row single-type">
            <span>{expense.title}</span>
            <span className="amount">${Math.abs(expense.amount)}</span>
            <span>{new Date(expense.date).toLocaleDateString()}</span>
            {windowWidth >= 1000 && (
              <span className="labels-cell">{renderLabels(expense.labels)}</span>
            )}
            <span className="actions">
              <FaTrash 
                className="delete-icon" 
                onClick={() => deleteExpense(expense.id)}
              />
            </span>
          </div>
        );
    }
  };

  return (
    <div className="expenses-table-container">

      {/* 🔹 Show Modal When Open */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          refreshExpenses={() => {
            fetchExpenses(currentPage, 10, dateFilter);
          }} // ✅ Fixed refresh issue
          labels={[]} // You may need to pass real labels
        />
      )}

      <div className="table-controls">
        <select 
          value={expenseType}
          onChange={(e) => handleExpenseTypeChange(e.target.value)}
          className="expense-type-select"
        >
          <option value="single">Single Expenses</option>
          <option value="recurring">Recurring Expenses</option>
          <option value="installment">Installment Expenses</option>
        </select>

        {expenseType === "single" && (
          <select
            value={dateFilter}
            onChange={(e) => handleDateFilterChange(e.target.value)}
            className="date-filter-select"
          >
            <option value="today">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        )}
      </div>

      <div className="table-container">
        {renderTableHeader()}
        <div className="table-body">
          {expenses.map((expense) => (
            <div key={expense.id}>
              {renderTableRow(expense)}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-dots">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`pagination-dot ${currentPage === idx + 1 ? 'active' : ''}`}
              onClick={() => onPageChange(idx + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesTable;
