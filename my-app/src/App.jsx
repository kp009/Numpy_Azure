import React, { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import FileUpload from "./FileUpload";
import BusinessStatisticsTable from "./BusinessStatistics";
import CompanyForm from "./CompanyForm";
import CompanyTable from "./CompanyTable";


function App() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const handleFormSubmit = () => setSelectedCompany(null);


  return (
    <div>
      <FileUpload />
      <div className="p-6">
      <CompanyForm selectedCompany={selectedCompany} onFormSubmit={handleFormSubmit} />
      <CompanyTable onEdit={setSelectedCompany} />
      </div>
      <BusinessStatisticsTable />
      <Dashboard />
    </div>
  );
}

export default App;
