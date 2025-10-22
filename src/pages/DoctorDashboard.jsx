import React, { useState } from "react";
import { ethers } from "ethers";
import api from "../api/api";
import { logout, selectAuthUser } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const DoctorDashboard = () => {
  const [patientAddress, setPatientAddress] = useState("");
  const [docs, setDocs] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const handleCheckAccess = async () => {
    try {
      if (!window.ethereum) return toast.error("MetaMask not found");
      if (!ethers.isAddress(patientAddress))
        return toast.error("Please enter a valid patient wallet address");

      setChecking(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const doctorAddress = await signer.getAddress();

      const response = await api.get("access/check", {
        params: { patient: patientAddress, doctor: doctorAddress },
      });

      const allowed = response.data.hasAccess;
      setHasAccess(allowed);

      if (allowed) {
        toast.success("Access granted ✅");

        // Fetch patient user info by wallet
        const userRes = await api.get(`auth/user/${patientAddress}`);
        const patient = userRes.data.data;

        if (!patient || !patient._id) {
          toast.error("Patient record not found");
          setDocs([]);
          setPatientInfo(null);
          return;
        }

        setPatientInfo(patient);

        // Fetch patient documents
        const docsRes = await api.get(`document/documents/user/${patient._id}`);
        const documents = docsRes.data.data || [];

        setDocs(documents);
        toast.success(`Fetched ${documents.length} shared documents 📄`);
      } else {
        setDocs([]);
        setPatientInfo(null);
        toast.error("Access expired or not granted");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error checking access");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name}
        </h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <p className="text-sm sm:text-base font-mono break-all mb-4">
        Wallet: <span className="text-gray-700">{user?.walletAddress}</span>
      </p>

      {/* Check Access Section */}
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
          onClick={handleCheckAccess}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-60 transition"
        >
          {checking ? "Checking..." : "Check Access"}
        </button>
      </div>

      {/* Patient Info */}
      {hasAccess && patientInfo && (
        <div className="mb-6 bg-gray-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Patient Details</h3>
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {patientInfo.name}
          </p>
          <p className="text-gray-700 font-mono break-all">
            <span className="font-semibold">Wallet:</span>{" "}
            {patientInfo.walletAddress}
          </p>
          <p className="text-gray-700 mt-2">
            <span className="font-semibold">Total Shared Documents:</span>{" "}
            {docs.length}
          </p>
        </div>
      )}

      {/* Documents */}
      {hasAccess && docs.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Shared Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="border rounded-lg shadow p-4 flex flex-col items-center bg-white"
              >
                {doc.mimetype.startsWith("image/") ? (
                  <img
                    src={`http://127.0.0.1:8080/ipfs/${doc.cid}`}
                    alt={doc.filename}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center w-full bg-gray-200 rounded">
                    <p className="text-sm text-gray-600">PDF File</p>
                  </div>
                )}
                <p className="mt-2 text-center text-sm text-gray-800 truncate w-full">
                  {doc.filename}
                </p>
                <button
                  onClick={() =>
                    window.open(
                      `http://127.0.0.1:8080/ipfs/${doc.cid}`,
                      "_blank"
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded mt-2 transition"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
