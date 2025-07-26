import React from 'react';
import { Card } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Graphs = ({ data, period }) => {
  if (!data) return null;

  const isMonthly = period === 'monthly';

  // Helper function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(value));
  };

  // Format data for recurring expenses pie chart
  const getRecurringExpensesData = () => {
    const expenses = isMonthly ? data.recurring_expenses.monthly_expenses : data.recurring_expenses.daily_expenses;
    return Object.entries(expenses).map(([title, amount]) => ({
      name: title,
      value: Math.abs(amount)
    }));
  };

  // Format data for installment expenses pie chart
  const getInstallmentExpensesData = () => {
    const expenses = isMonthly ? 
      data.installment_expenses.monthly_installment_expenses : 
      data.installment_expenses.daily_installment_expenses;
    return Object.entries(expenses).map(([title, amount]) => ({
      name: title,
      value: Math.abs(amount)
    }));
  };

  // Format data for single expenses pie chart
  const getSingleExpensesData = () => {
    const expenses = isMonthly ? 
      data.single_expenses.monthly_expenses : 
      data.single_expenses.today_expenses;
    return Object.entries(expenses).map(([title, amount]) => ({
      name: title,
      value: Math.abs(amount)
    }));
  };

  // Format data for income pie chart
  const getIncomeData = () => {
    const incomes = isMonthly ? data.incomes.monthly_incomes : data.incomes.daily_incomes;
    return Object.entries(incomes).map(([title, amount]) => ({
      name: title,
      value: amount
    }));
  };

  // Format data for expenses by label (monthly only)
  const getExpensesByLabelData = () => {
    if (!isMonthly || !data.expenses_by_label) return [];
    return data.expenses_by_label.map(label => ({
      name: label.title,
      value: label.amount
    }));
  };

  const renderPieChart = (data, title) => (
    <Card sx={{ p: 2, m: 1, width: '100%', height: 300 }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '1rem',
      padding: '1rem'
    }}>
      {renderPieChart(getRecurringExpensesData(), `${isMonthly ? 'Monthly' : 'Daily'} Recurring Expenses`)}
      {renderPieChart(getInstallmentExpensesData(), `${isMonthly ? 'Monthly' : 'Daily'} Installment Expenses`)}
      {renderPieChart(getSingleExpensesData(), `${isMonthly ? 'Monthly' : 'Daily'} Single Expenses`)}
      {renderPieChart(getIncomeData(), `${isMonthly ? 'Monthly' : 'Daily'} Income`)}
      {isMonthly && renderPieChart(getExpensesByLabelData(), 'Expenses by Label')}
    </div>
  );
};

export default Graphs;
