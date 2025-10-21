import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthUser } from "../slices/authSlice";
import { Link } from "react-router-dom";
import api from "../api/api";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const [docs, setDocs] = useState([]);
  const [count, setCount] = useState(0);

  console.log(user);

  const fetchDocs = async () => {
    try {
      const res = await api.get("document");
      setDocs(res.data.data);
      setCount(res.data.data.length);
    } catch (err) {
      console.error("Error fetching docs", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`document/${id}`);
      fetchDocs();
    } catch (err) {
      console.error("Error deleting doc", err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome back {user?.name}</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <p>Wallet Address: {user?.walletAddress}</p>
      <p className="mt-2 font-semibold">Total Documents: {count}</p>

      <div className="mt-6">
        <Link
          to="/p/add-report"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Report
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="border rounded-lg shadow p-4 flex flex-col items-center"
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
