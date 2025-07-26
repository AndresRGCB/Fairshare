import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const RecurringExpensesChart = ({ data, total, type }) => {
  const isExpense = type === "expense";
  const displayColor = isExpense ? "red" : "green";
  const displaySign = isExpense ? "-" : "+";

  if (!data || Object.keys(data).length === 0) {
    const noDataChart = [{ name: "No Data", value: 1 }];
    return (
      <div className="chart-container" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%" aspect={1}>
          <PieChart>
            <Pie
              data={noDataChart}
              cx="50%"
              cy="50%"
              outerRadius="60%"
              innerRadius="45%"
              strokeWidth={4}
              dataKey="value"
              fill="#d3d3d3"
            >
              <Cell fill="#d3d3d3" strokeWidth={8} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          fontSize: "24px", 
          fontWeight: "900", 
          fontFamily: "Berlin Sans FB", 
          color: "#888", 
          textAlign: "center" 
        }}>
          No Data
        </div>
      </div>
    );
  }

  const pieChartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: Math.abs(value),
  }));

  const COLORS = ["#1B1F3B", "#3D5A80", "#5eaddb", "#b0b7b8", "#5C677D", "#293241"];
  const shuffledColors = COLORS.sort(() => Math.random() - 0.5); // Shuffle colors for variety

  return (
    <div className="chart-container" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%" aspect={1}>
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            outerRadius="60%"
            innerRadius="45%"
            strokeWidth={4}
            dataKey="value"
            label={({ name }) => `${name.length > 3 ? name.substring(0, 4) + "..." : name}`} // Truncate labels to 3 chars + "..."
            labelStyle={{ fontSize: "6px", fontWeight: "bold", fill: "#444" }} // Smaller font
            labelLine={{ strokeWidth: 0 }} 
            labelPosition="outside"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={shuffledColors[index % shuffledColors.length]} strokeWidth={8} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`$${value.toFixed(2)}`, name]} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ 
        position: "absolute", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        fontSize: `${Math.max(10, 0.6 * 45)}px`, // Dynamic size based on innerRadius
        fontWeight: "900", 
        fontFamily: "Berlin Sans FB", 
        color: displayColor, 
        textAlign: "center" 
      }}>
        {displaySign}${Math.abs(total).toFixed(2)}
      </div>
    </div>
  );
};

export default RecurringExpensesChart;
