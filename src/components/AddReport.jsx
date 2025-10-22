import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import toast from "react-hot-toast";
import api from "../api/api";

const AddReport = ({ onUploadSuccess }) => {
  const user = useSelector(selectAuthUser);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      setUploading(true);
      const { data } = await api.post("document/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Uploaded: ${data.data.filename}`);
      setFile(null);

      // Notify parent to refresh documents
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Report</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button
          disabled={!file || uploading}
          type="submit"
          className={`p-2 rounded text-white transition ${
            uploading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default AddReport;
