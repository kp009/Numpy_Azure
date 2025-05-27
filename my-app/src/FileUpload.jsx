import React, { useState } from "react";
import axios from "axios";
import { Button, Typography } from "@mui/material";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("office", file); // Append the file with key 'office'

    try {
      // Make a POST request to the Django backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload/", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      // Display success message
      setMessage(response.data.message || "Business data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file.");
    }
  };

  return (
    <div>
      <Typography variant="h6">Upload Business Data</Typography>
      
      {/* File input */}
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      
      {/* Upload button */}
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload Data
      </Button>
      
      {/* Display status message */}
      {message && <Typography>{message}</Typography>}
    </div>
  );
};

export default FileUpload;
