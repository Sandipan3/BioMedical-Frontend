import React, { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("auth/register", {
        name,
        walletAddress,
        role,
      });
      if (res.data.status === "success") {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-purple-200">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Register your{" "}
          <span className="text-purple-600 font-extrabold">MediDoc</span>{" "}
          Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="text-lg font-semibold text-gray-700"
            >
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 border-2 border-purple-300 rounded-lg "
            />
          </div>

          {/* Wallet Address */}
          <div>
            <label
              htmlFor="walletAddress"
              className="text-lg font-semibold text-gray-700"
            >
              Wallet Address<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="walletAddress"
              required
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full mt-1 p-3 border-2 border-purple-300 rounded-lg "
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-lg font-semibold text-gray-700 block mb-2">
              Role<span className="text-red-500">*</span>
            </label>
            <div className="flex justify-between px-2">
              {["admin", "patient", "doctor"].map((option) => (
                <label
                  key={option}
                  htmlFor={option}
                  className="flex items-center gap-2 cursor-pointer text-gray-700"
                >
                  <input
                    type="radio"
                    name="role"
                    id={option}
                    value={option}
                    checked={role === option}
                    onChange={(e) => setRole(e.target.value)}
                    className="accent-purple-600 cursor-pointer"
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold"
          >
            Register
          </button>

          <p className="text-center text-gray-700">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
