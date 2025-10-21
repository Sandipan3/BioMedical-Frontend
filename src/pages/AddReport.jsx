import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AddReport = () => {
  const user = useSelector(selectAuthUser);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file first!");
    if (!user || !user._id)
      return toast.error("User not found. Please log in again.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", user._id);
    formData.append("uploadedBy", user.role);

    try {
      const { data } = await api.post("document/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Uploaded: ${data.data.filename}`);
      setTimeout(() => navigate("/p"), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Report</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          disabled={!file}
          type="submit"
          className={`p-2 rounded text-white ${
            file
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default AddReport;
