import React from "react";

const DashboardHeader = ({ name, onLogout }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    <h2 className="text-2xl font-bold text-gray-800">Welcome back, {name}</h2>
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      onClick={onLogout}
    >
      Logout
    </button>
  </div>
);

export default DashboardHeader;
