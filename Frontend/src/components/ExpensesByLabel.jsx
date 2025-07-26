import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ExpensesByLabel = ({ data }) => {
  // Generate random colors for each label
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Custom renderer for the legend
  const renderCustomLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        fontSize: '12px'
      }}>
        {payload.map((entry, index) => (
          <li key={`legend-${index}`} style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginRight: '10px',
            marginBottom: '5px'
          }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: entry.color,
              marginRight: '5px',
              borderRadius: '2px'
            }}/>
            <span>{entry.value} ({data[index].percentage}%)</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%" // Moved up slightly to make room for legend
            innerRadius={0}
            outerRadius="70%" // Reduced to make room for legend
            fill="#8884d8"
            paddingAngle={2}
            dataKey="amount"
            nameKey="title"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `$${value.toFixed(2)} (${props.payload.percentage}%)`,
              props.payload.title
            ]}
          />
          <Legend 
            content={renderCustomLegend}
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesByLabel;
