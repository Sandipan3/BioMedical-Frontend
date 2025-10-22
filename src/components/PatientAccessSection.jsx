import React from "react";

const PatientAccessSection = ({
  doctorAddress,
  setDoctorAddress,
  onGrantAccess,
  granting,
}) => (
  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
    <input
      type="text"
      placeholder="Enter Doctor Wallet Address"
      value={doctorAddress}
      onChange={(e) => setDoctorAddress(e.target.value)}
      className="border px-3 py-2 rounded flex-1"
    />
    <button
      disabled={granting}
      onClick={onGrantAccess}
      className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
    >
      {granting ? "Granting..." : "Grant Access"}
    </button>
  </div>
);

export default PatientAccessSection;
