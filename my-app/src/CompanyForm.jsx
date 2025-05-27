import React, { useState, useEffect } from "react";
import axios from "axios";

const CompanyForm = ({ selectedCompany, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    revenue: "",
    profit: "",
    employees: "",
    country: ""
  });

  useEffect(() => {
    if (selectedCompany) {
      setFormData(selectedCompany);
    } else {
      setFormData({ name: "", revenue: "", profit: "", employees: "", country: "" });
    }
  }, [selectedCompany]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCompany) {
      await axios.put(`http://127.0.0.1:8000/api/companies/${selectedCompany.id}/`, formData);
    } else {
      await axios.post("http://127.0.0.1:8000/api/companies/", formData);
    }
    onFormSubmit();
    setFormData({ name: "", revenue: "", profit: "", employees: "", country: "" });
  };

  return (
    <form className="bg-white p-4 shadow-md rounded-lg max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">{selectedCompany ? "Edit Company" : "Add Company"}</h2>
      <input className="w-full p-2 border mb-2 rounded" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Company Name" required />
      <input className="w-full p-2 border mb-2 rounded" type="number" name="revenue" value={formData.revenue} onChange={handleChange} placeholder="Revenue" required />
      <input className="w-full p-2 border mb-2 rounded" type="number" name="profit" value={formData.profit} onChange={handleChange} placeholder="Profit" required />
      <input className="w-full p-2 border mb-2 rounded" type="number" name="employees" value={formData.employees} onChange={handleChange} placeholder="Employees" required />
      <input className="w-full p-2 border mb-4 rounded" type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full" type="submit">
        {selectedCompany ? "Update" : "Add"} Company
      </button>
    </form>
  );
};

export default CompanyForm;
