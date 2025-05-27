import React from "react";
import { Bar, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Ensure chart.js components are correctly imported

const Charts = ({ companies }) => {
  const revenueData = {
    labels: companies.map((company) => company.name), // Extracting company names
    datasets: [
      {
        label: "Revenue",
        data: companies.map((company) => company.revenue), // Extracting revenue
        backgroundColor: "blue",
      },
    ],
  };

  const pieData = {
    labels: companies.map((company) => company.name), // Labels for Pie chart
    datasets: [
      {
        label: "Revenue Distribution",
        data: companies.map((company) => company.revenue), // Data for Pie chart
        backgroundColor: companies.map(() => "#" + Math.floor(Math.random()*16777215).toString(16)), // Random color for each section
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "Company Revenue vs Employees",
        data: companies.map((company) => ({
          x: company.revenue,
          y: company.employees,
        })),
        backgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  return (
    <div>
      <h3>Company Revenue Chart</h3>
      <Bar data={revenueData} />
      <h3>Revenue Distribution (Pie)</h3>
      <Pie data={pieData} />
      <h3>Revenue vs Employees (Scatter)</h3>
      <Scatter data={scatterData} />
    </div>
  );
};

export default Charts;
