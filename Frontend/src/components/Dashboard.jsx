import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import RecurringExpensesChart from "./RecurringExpensesChart";
import CarryoverChart from './CarryoverChart';
import PeriodSelector from './PeriodSelector';
import MonthlyBalance from './MonthlyBalance';
import ExpensesByLabel from './ExpensesByLabel';
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Dashboard = ({ isMobile, selectedPeriod }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isStacked, setIsStacked] = useState(false);
  const [period, setPeriod] = useState(selectedPeriod || "daily");
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");


  // Sync prop with internal state
  useEffect(() => {
    if (selectedPeriod && selectedPeriod !== period) {
      setPeriod(selectedPeriod);
    }
  }, [selectedPeriod]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      navigate("/");
      return;
    }


    const requestUrl = `${API_BASE_URL}/api/graphs/${period}?user_id=${userId}`;

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
        throw new Error(`Failed to fetch dashboard data. Status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch data when period changes
  useEffect(() => {
    fetchDashboardData();
  }, [userId, period]);

  // Detect if the charts fit and toggle stacking mode
  useEffect(() => {
    const checkOverflow = () => {
      const container = document.querySelector(".dashboard-grid");
      if (container) {
        const isOverflowing = container.scrollWidth > container.clientWidth;
        setIsStacked(isOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="dashboard-container">
      {!isMobile && (
        <>
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="period-selector-container">
              <PeriodSelector onSelect={setPeriod} selectedPeriod={period} />
            </div>
          </div>
          <div className="dashboard-divider"></div>
        </>
      )}

      {/* Daily View */}
      {period === "daily" && (
        <div className={`dashboard-grid ${isStacked ? "stacked" : ""}`}>
          <div className="dashboard-item medium">
            <h2 className="dashboard-section-title">Recurring Expenses</h2>
            {dashboardData?.recurring_expenses ? (
              <RecurringExpensesChart 
                data={dashboardData.recurring_expenses.daily_expenses} 
                total={dashboardData.recurring_expenses.total_daily_expense}
                type="expense" 
              />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium-wide">
            <h2 className="dashboard-section-title-wide">Carryover</h2>
            {dashboardData?.carryover ? (
              <CarryoverChart 
                carryoverHistory={dashboardData.carryover.carryover_history || []}
                todayCarryover={dashboardData.carryover.total_carryover_savings || 0}
              />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium">
            <h2 className="dashboard-section-title">Installment Expenses</h2>
            {dashboardData?.installment_expenses ? (
              <RecurringExpensesChart 
                data={dashboardData.installment_expenses.daily_installment_expenses} 
                total={dashboardData.installment_expenses.total_daily_installment_expense} 
                type="expense"
              />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium">
            <h2 className="dashboard-section-title">Income</h2>
            {dashboardData?.incomes ? (
              <RecurringExpensesChart 
                data={dashboardData.incomes.daily_incomes} 
                total={dashboardData.incomes.total_daily_income} 
                type="income"
              />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium">
            <h2 className="dashboard-section-title">Daily Expenses</h2>
            {dashboardData?.single_expenses ? (
              <RecurringExpensesChart 
                data={dashboardData.single_expenses.today_expenses} 
                total={dashboardData.single_expenses.total_today_expense} 
                type="expense"
              />
            ) : <p>Loading...</p>}
          </div>
        </div>
      )}

      {/* Monthly View */}
      {period === "monthly" && (
        <div className={`dashboard-grid ${isStacked ? "stacked" : ""}`}>
          <div className="dashboard-item medium">
            <h2 className="dashboard-section-title">Recurring Expenses</h2>
            {dashboardData?.recurring_expenses ? (
              <RecurringExpensesChart 
                data={dashboardData.recurring_expenses.monthly_expenses} 
                total={dashboardData.recurring_expenses.total_monthly_expense}
                type="expense" 
              />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium">
            <h2 className="dashboard-section-title">Installment Expenses</h2>
            {dashboardData?.installment_expenses ? (
              <RecurringExpensesChart 
                data={dashboardData.installment_expenses.monthly_installment_expenses} 
                total={dashboardData.installment_expenses.total_monthly_installment_expense} 
                type="expense"
              />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium-long">
            <h2 className="dashboard-section-title-long">Monthly Balance</h2>
            {dashboardData?.monthly_balance ? (
              <MonthlyBalance 
                totalIncome={dashboardData.monthly_balance.total_income}
                totalExpenses={dashboardData.monthly_balance.total_expenses}
                budgetLeft={dashboardData.monthly_balance.budget_left}
              />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium-long">
            <h2 className="dashboard-section-title-long">Expenses by Label</h2>
            {dashboardData?.expenses_by_label ? (
              <ExpensesByLabel data={dashboardData.expenses_by_label} />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium">
            <h2 className="dashboard-section-title">Income</h2>
            {dashboardData?.incomes ? (
              <RecurringExpensesChart 
                data={dashboardData.incomes.monthly_incomes} 
                total={dashboardData.incomes.total_monthly_income} 
                type="income"
              />
            ) : <p>Loading...</p>}
          </div>

          <div className="dashboard-item medium">
            <h2 className="dashboard-section-title">Monthly Expenses</h2>
            {dashboardData?.single_expenses ? (
              <RecurringExpensesChart 
                data={dashboardData.single_expenses.monthly_expenses} 
                total={dashboardData.single_expenses.total_monthly_expense} 
                type="expense"
              />
            ) : <p>Loading...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
