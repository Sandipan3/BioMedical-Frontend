import React from "react";

const WalletDisplay = ({ wallet }) => (
  <p className="text-sm sm:text-base font-mono break-all mb-4">
    Wallet: <span className="text-gray-700">{wallet}</span>
  </p>
);

export default WalletDisplay;
