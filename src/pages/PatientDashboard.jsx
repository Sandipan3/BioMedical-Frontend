import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthUser } from "../slices/authSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const [docs, setDocs] = useState([]);
  const [count, setCount] = useState(0);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [grantedDoctor, setGrantedDoctor] = useState(null);
  const [granting, setGranting] = useState(false);
  const [revoking, setRevoking] = useState(false);

  // fetch documents
  const fetchDocs = async () => {
    try {
      const res = await api.get("document");
      setDocs(res.data.data);
      setCount(res.data.data.length);
    } catch (err) {
      console.error("Error fetching docs", err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleLogout = () => dispatch(logout());

  const handleGrantAccess = async () => {
    try {
      if (!doctorAddress) return toast.error("Enter doctor wallet address");
      setGranting(true);
      const res = await api.post("/access/grant", { doctor: doctorAddress });
      if (res.data.status === "success") {
        toast.success("Access granted (valid 15 mins)");
        const userRes = await api.get(`auth/user/${doctorAddress}`);
        setDoctorName(userRes.data.data.name);
        setGrantedDoctor(doctorAddress);
      } else toast.error("Something went wrong");
      setDoctorAddress("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error granting access");
    } finally {
      setGranting(false);
    }
  };

  const handleRevokeAccess = async () => {
    try {
      if (!grantedDoctor) return toast.error("No active access to revoke");
      setRevoking(true);
      const res = await api.post("/access/revoke", { doctor: grantedDoctor });
      if (res.data.status === "success") {
        toast.success("Access revoked");
        setGrantedDoctor(null);
        setDoctorName("");
      } else toast.error("Failed to revoke access");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error revoking access");
    } finally {
      setRevoking(false);
    }
  };

  const handleDelete = async (docId) => {
    try {
      await api.delete(`document/${docId}`);
      toast.success("Document deleted");
      fetchDocs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting document");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold">Welcome back {user?.name}</h2>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <p className="text-sm sm:text-base font-mono break-all max-w-full">
        Wallet: <span className="text-gray-700">{user?.walletAddress}</span>
      </p>

      <p className="font-medium">Total Documents: {count}</p>

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
          onClick={handleGrantAccess}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {granting ? "Granting..." : "Grant Access"}
        </button>
      </div>

      {grantedDoctor && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded bg-gray-50">
          <div>
            <p className="text-gray-700">You are sharing reports with:</p>
            <p className="font-medium text-gray-900">{doctorName}</p>
            <p className="text-sm text-gray-600 font-mono break-all">
              {grantedDoctor}
            </p>
          </div>
          <button
            disabled={revoking}
            onClick={handleRevokeAccess}
            className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60 mt-2 sm:mt-0"
          >
            {revoking ? "Revoking..." : "Revoke Access"}
          </button>
        </div>
      )}

      <Link
        to="/p/add-report"
        className="bg-green-600 text-white px-4 py-2 rounded w-fit"
      >
        + Add Report
      </Link>

      <div className="flex flex-wrap gap-6">
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="border rounded-lg shadow p-4 flex flex-col items-center w-full sm:w-[45%] lg:w-[22%]"
          >
            {doc.mimetype.startsWith("image/") ? (
              <img
                src={`http://127.0.0.1:8080/ipfs/${doc.cid}`}
                alt={doc.filename}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="h-40 flex items-center justify-center w-full bg-gray-200">
                <p className="text-sm">PDF File</p>
              </div>
            )}
            <p className="mt-2 text-center text-sm">{doc.filename}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() =>
                  window.open(`http://127.0.0.1:8080/ipfs/${doc.cid}`, "_blank")
                }
                className="bg-blue-500 text-white text-sm px-2 py-1 rounded"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(doc._id)}
                className="bg-red-500 text-white text-sm px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
