import React from "react";

const AccessStatusCard = ({
  doctorName,
  doctorAddress,
  onRevoke,
  revoking,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded bg-gray-50">
    <div>
      <p className="text-gray-700">You are sharing reports with:</p>
      <p className="font-medium text-gray-900">{doctorName}</p>
      <p className="text-sm text-gray-600 font-mono break-all">
        {doctorAddress}
      </p>
    </div>
    <button
      disabled={revoking}
      onClick={onRevoke}
      className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60 mt-2 sm:mt-0"
    >
      {revoking ? "Revoking..." : "Revoke Access"}
    </button>
  </div>
);

export default AccessStatusCard;
