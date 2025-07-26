import React, { useState, useEffect } from "react";
import "./Expenses.css";
import Modal from "./Modal";
import ExpensesTable from "./ExpensesTable";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Expenses = ({ isMobile, isModalOpen, setIsModalOpen }) => {
  const [labels, setLabels] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateFilter, setDateFilter] = useState("month");
  const [expenseType, setExpenseType] = useState("single");
  const [totalPages, setTotalPages] = useState(1);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();


  const fetchLabels = async () => {
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      navigate("/");
      return;
    }

    const requestUrl = `${API_BASE_URL}/labels/${userId}`;
    try {
      const response = await fetch(requestUrl, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        navigate("/");
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch labels. Status: ${response.status}`);
      }
      const data = await response.json();
      setLabels(data);
    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchLabels();
    }
  }, [isModalOpen]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      navigate("/");
      return;
    }
  
    const params = new URLSearchParams({
      page: currentPage,
      items_per_page: itemsPerPage,
      expense_type: expenseType,
      date_filter: dateFilter,
      timestamp: Date.now()
    });
  
    const requestUrl = `${API_BASE_URL}/api/expenses/?${params}`;
  
    try {
      const response = await fetch(requestUrl, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        navigate("/");
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch expenses. Status: ${response.status}`);
      }
      const data = await response.json();
      
      // Sort expenses by date (newest first)
      const sortedExpenses = [...data.expenses].sort((a, b) => {
        // For single expenses with date field
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        // For recurring expenses with created_at field
        else if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        // For installment expenses with begin_date field
        else if (a.begin_date && b.begin_date) {
          return new Date(b.begin_date) - new Date(a.begin_date);
        }
        return 0;
      });
      
      setExpenses(sortedExpenses);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDateFilterChange = (newFilter) => {
    setDateFilter(newFilter);
    setCurrentPage(1);
  };

  const handleExpenseTypeChange = (newType) => {
    setExpenseType(newType);
    setCurrentPage(1);
    if (newType !== 'single') {
      setDateFilter('month');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, itemsPerPage, dateFilter, expenseType, userId]);

  return (
    <div className="dashboard-container">
      {!isMobile && (
        <>
          <div className="dashboard-header">
            <h1 className="dashboard-title">Expenses</h1>
            <button 
              className="new-expense-button"
              onClick={() => setIsModalOpen(true)}
            >
              + New Expense
            </button>
          </div>
          <div className="dashboard-divider"></div>
        </>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-item full-width">
          <ExpensesTable
            expenses={expenses}
            refreshExpenses={fetchExpenses}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            dateFilter={dateFilter}
            onDateFilterChange={handleDateFilterChange}
            expenseType={expenseType}
            onExpenseTypeChange={handleExpenseTypeChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          labels={labels}
          refreshExpenses={fetchExpenses}
        />
      )}
    </div>
  );
};

export default Expenses;
