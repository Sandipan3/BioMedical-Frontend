import React from "react";

const DoctorAccessSection = ({
  patientAddress,
  setPatientAddress,
  onCheckAccess,
  checking,
}) => (
  <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
    <input
      type="text"
      placeholder="Enter Patient Wallet Address"
      value={patientAddress}
      onChange={(e) => setPatientAddress(e.target.value)}
      className="border border-gray-300 px-3 py-2 rounded-lg w-full sm:w-96 focus:ring-2 focus:ring-blue-500 outline-none"
    />
    <button
      disabled={checking}
      onClick={onCheckAccess}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-60 transition"
    >
      {checking ? "Checking..." : "Check Access"}
    </button>
  </div>
);

export default DoctorAccessSection;
