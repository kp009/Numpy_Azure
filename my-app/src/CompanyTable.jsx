import React, { useEffect, useState } from "react";
import axios from "axios";

const CompanyTable = ({ onEdit }) => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCompanies();
  }, [search, sortBy, order, page]);

  const fetchCompanies = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/api/companies/?search=${search}&sort_by=${sortBy}&order=${order}&page=${page}`);
    setCompanies(response.data.results);
    setTotalPages(Math.ceil(response.data.count / 5)); // Assuming 5 items per page
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/companies/${id}/`);
    fetchCompanies();
  };

  // Determine page range to display
  const maxPagesToShow = 5;
  const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  return (
    <div className="max-w-5xl mx-auto mt-6">
      {/* Search Box */}
      <input
        className="w-full p-2 border rounded mb-4"
        type="text"
        placeholder="Search Companies..."
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {/* Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {["name", "revenue", "profit", "employees", "country"].map((field) => (
              <th key={field} className="p-3 border cursor-pointer" onClick={() => setSortBy(field)}>
                {field.toUpperCase()} {sortBy === field ? (order === "asc" ? "🔼" : "🔽") : ""}
              </th>
            ))}
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="text-center border-t">
              <td className="p-3 border">{company.name}</td>
              <td className="p-3 border">{company.revenue}</td>
              <td className="p-3 border">{company.profit}</td>
              <td className="p-3 border">{company.employees}</td>
              <td className="p-3 border">{company.country}</td>
              <td className="p-3 border">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600" onClick={() => onEdit(company)}>
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(company.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button className={`px-4 py-2 border ${page === 1 ? "opacity-50 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`} disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((p) => (
          <button key={p} className={`mx-2 px-4 py-2 border ${page === p ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`} onClick={() => setPage(p)}>
            {p}
          </button>
        ))}
        <button className={`px-4 py-2 border ${page === totalPages ? "opacity-50 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyTable;
