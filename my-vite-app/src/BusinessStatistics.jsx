import React, { useEffect, useState } from "react";
import axios from "axios";

const BusinessStatisticsTable = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/business/stats/")
      .then(response => {
        console.log("API Response:", response.data);  // Debugging
        setStats(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setStats({ error: "Failed to load data" });  // Prevent infinite loading
      });
  }, []);

  if (!stats) return <p>Loading...</p>;
  if (stats.error) return <p style={{ color: "red" }}>Error: {stats.error}</p>;

  // Define default labels since the API response lacks "labels"
  const labels = ["Revenue", "Profit", "Employees"];

  return (
    <div>
      <h2>Business Statistics</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Statistic</th>
            {labels.map((label, index) => <th key={index}>{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {["mean", "std_dev", "min"].map((key) => (
            <tr key={key}>
              <td><b>{key.replace("_", " ").toUpperCase()}</b></td>
              {stats[key] ? stats[key].map((value, index) => <td key={index}>{value}</td>) : <td colSpan={labels.length}>No Data</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessStatisticsTable;
