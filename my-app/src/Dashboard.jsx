import React, { useState } from "react";
import axios from "axios";
import { Button, Typography, Select, MenuItem } from "@mui/material";
import Charts from "./Charts";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [queryType, setQueryType] = useState("");
  const [queryResult, setQueryResult] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleQueryChange = (event) => {
    setQueryType(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !queryType) {
      alert("Please select a file and query type.");
      return;
    }

    const formData = new FormData();
    formData.append("office", file);
    formData.append("query_type", queryType);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/query-companies/", formData);
      if (response.data.total_revenue !== undefined) {
        setMessage(`Total Revenue: ${response.data.total_revenue}`);
      } else if (response.data.total_employees_usa !== undefined) {
        setMessage(`Total Employees in USA: ${response.data.total_employees_usa}`);
      } else {
        setQueryResult(response.data.data || []);  // Ensure queryResult is always an array
      }
    } catch (error) {
      console.error("Error querying data", error);
    }
  };

  const handleStartScript = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/start-script/");
      // Show success alert
      alert("Script started successfully!");
      console.log("Script started successfully:", response.data);
    } catch (error) {
      // Show error alert
      alert("Error starting script: " + (error.response ? error.response.data : error.message));
      console.error("Error starting script:", error.response ? error.response.data : error.message);
    }
  };
  
  const handleStopScript = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/stop-script/");
      // Show success alert
      alert("Script stopped successfully!");
      console.log("Script stopped successfully:", response.data);
    } catch (error) {
      // Show error alert
      alert("Error stopping script: " + (error.response ? error.response.data : error.message));
      console.error("Error stopping script:", error.response ? error.response.data : error.message);
    }
  };
  
  
  return (
    <div>
      <Typography variant="h6">Company Dashboard</Typography>
      <input type="file" onChange={handleFileChange} />
      <Select value={queryType} onChange={handleQueryChange} displayEmpty>
        <MenuItem value="" disabled>Select Query</MenuItem>
        <MenuItem value="USA">USA Companies</MenuItem>
        <MenuItem value="profit_gt_20000">Profit &gt; 20,000</MenuItem>
        <MenuItem value="revenue_gt_50000">Revenue &gt; 50,000</MenuItem>
        <MenuItem value="total_revenue">Total Revenue</MenuItem>
        <MenuItem value="total_employees_usa">Employees in USA</MenuItem>
      </Select>
      <Button variant="contained" onClick={handleUpload}>Query Data</Button>
      <Button variant="contained" color="success" onClick={handleStartScript}>Start Script</Button>
      <Button variant="contained" color="error" onClick={handleStopScript}>Stop Script</Button>

      {message && <Typography>{message}</Typography>}

      {Array.isArray(queryResult) && queryResult.length > 0 && <Charts companies={queryResult}  />
    }
    </div>
  );
};

export default Dashboard;
