import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './MonthlyBalance.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const MonthlyBalance = ({ totalIncome, totalExpenses, budgetLeft }) => {
  return (
    <div className="monthly-balance">
      <div className="balance-item income">
        <FaArrowUp className="arrow-icon income-arrow" />
        <div className="balance-details">
          <span className="balance-label">Income</span>
          <span className="balance-amount">{formatCurrency(totalIncome)}</span>
        </div>
      </div>
      
      <div className="balance-item expenses">
        <FaArrowDown className="arrow-icon expenses-arrow" />
        <div className="balance-details">
          <span className="balance-label">Expenses</span>
          <span className="balance-amount">{formatCurrency(Math.abs(totalExpenses))}</span>
        </div>
      </div>

      <div className="balance-item remaining">
        <div className="balance-details">
          <span className="balance-label">Remaining Budget</span>
          <span className="balance-amount large">{formatCurrency(budgetLeft)}</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBalance;
