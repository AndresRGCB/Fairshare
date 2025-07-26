import React from "react";
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const CarryoverChart = ({ carryoverHistory = [], todayCarryover = 0 }) => {
  // Check for empty or invalid data
  if (!carryoverHistory || carryoverHistory.length === 0) {
    return (
      <div className="chart-container" style={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ 
          fontSize: "24px", 
          fontWeight: "900", 
          fontFamily: "Berlin Sans FB", 
          color: "#888" 
        }}>
          No Carryover Data Available
        </div>
      </div>
    );
  }

  // Format data for the chart
  const chartData = carryoverHistory.map(item => ({
    date: new Date(item.date + "T12:00:00").toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    carryover: item.carryover
  }));

  // Calculate Y-axis domain
  const carryoverValues = chartData.map(item => item.carryover);
  const minValue = Math.min(...carryoverValues);
  const maxValue = Math.max(...carryoverValues);
  
  // Add 10% padding to the range for better visualization
  const padding = (maxValue - minValue) * 0.1;
  const yDomain = [
    Math.min(0, minValue - padding), // Include 0 if data is all positive
    Math.max(0, maxValue + padding)  // Include 0 if data is all negative
  ];

  // Calculate total monthly carryover (sum of all values)
  const totalMonthlyCarryover = todayCarryover;

  
  // Get today's carryover (last value in the array)
  const todaysCarryover = carryoverValues[carryoverValues.length - 1];

  return (
    <div className="chart-container" style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      position: "relative" 
    }}>
      <div style={{ flex: "3" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#666' }}
            />
            <YAxis 
              domain={yDomain}
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#666' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              tickCount={7}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, "Carryover"]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            
            {/* Remove the Area component and keep just the Line */}
            <Line
              type="linear"
              dataKey="carryover"
              stroke="#133d66"  // Dark blue color
              strokeWidth={3}   // Thicker line
              connectNulls={true}  // Ensure points are connected
              dot={(props) => {
                const isPositive = props.payload.carryover >= 0;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    stroke={isPositive ? "#2E7D32" : "#D32F2F"}
                    strokeWidth={2}
                    fill={isPositive ? "#2E7D32" : "#D32F2F"}
                  />
                );
              }}
              activeDot={(props) => {
                const isPositive = props.payload.carryover >= 0;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={6}
                    stroke={isPositive ? "#2E7D32" : "#D32F2F"}
                    strokeWidth={2}
                    fill={isPositive ? "#2E7D32" : "#D32F2F"}
                  />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{ 
        flex: "1",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "0px"
      }}>
        {/* Top Half - Monthly Total Section */}
        <div style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid #eee"
        }}>
          <div style={{ 
            fontSize: "44px",
            fontWeight: "900",
            fontFamily: "Berlin Sans FB",
            color: totalMonthlyCarryover >= 0 ? "green" : "red",
            textAlign: "center",
            marginBottom: "8px"
          }}>
            {totalMonthlyCarryover >= 0 ? "+" : "-"}$
            {Math.abs(totalMonthlyCarryover).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ 
            fontSize: "14px", 
            color: "#666",
            textAlign: "center",
            fontFamily: "Berlin Sans FB"
          }}>
            Total Monthly Carryover
          </div>
        </div>

        {/* Bottom Half - Today's Value Section */}
        <div style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{ 
            fontSize: "34px",
            fontWeight: "900",
            fontFamily: "Berlin Sans FB",
            color: todaysCarryover >= 0 ? "green" : "red",
            textAlign: "center",
            marginBottom: "8px"
          }}>
            {todaysCarryover >= 0 ? "+" : "-"}$
            {Math.abs(todaysCarryover).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ 
            fontSize: "14px", 
            color: "#666",
            textAlign: "center",
            fontFamily: "Berlin Sans FB"
          }}>
            Today's Carryover
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarryoverChart;
