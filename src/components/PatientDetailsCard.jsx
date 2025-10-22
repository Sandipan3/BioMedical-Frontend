import React from "react";

const PatientDetailsCard = ({ patientInfo, docCount }) => (
  <div className="mb-6 bg-gray-100 rounded-xl p-4 shadow-sm">
    <h3 className="text-lg font-semibold mb-2">Patient Details</h3>
    <p className="text-gray-700">
      <span className="font-semibold">Name:</span> {patientInfo.name}
    </p>
    <p className="text-gray-700 font-mono break-all">
      <span className="font-semibold">Wallet:</span> {patientInfo.walletAddress}
    </p>
    <p className="text-gray-700 mt-2">
      <span className="font-semibold">Total Shared Documents:</span> {docCount}
    </p>
  </div>
);

export default PatientDetailsCard;
