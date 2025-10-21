import React from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import { login, selectAuthLoading } from "../slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask!");
        //later
        //window.location.href="https://metamask.app.link/dapp/hackoasis-frontend.netlify.app";
        return;
      }

      // Request wallet connection
      const [walletAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!walletAddress) {
        toast.error("MetaMask wallet not connected!");
        return;
      }

      // Get nonce from backend
      const { data } = await api.post("auth/nonce", { walletAddress });
      const nonce = data?.nonce;
      if (!nonce) {
        toast.error("Nonce not received from server!");
        return;
      }

      // Sign message using MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(`Sign this nonce: ${nonce}`);

      // Dispatch login thunk
      const result = await dispatch(login({ walletAddress, signature }));

      if (login.fulfilled.match(result)) {
        const user = result.payload.user;
        toast.success(`Welcome ${user.name}!`);

        // Redirect based on role
        if (user.role === "admin") navigate("/a");
        else if (user.role === "doctor") navigate("/d");
        else navigate("/p");
      } else {
        toast.error(result.payload || "Login failed!");
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.code === 4001) {
        toast.error("Signature request rejected.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-semibold">Login</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-60"
      >
        {loading ? "Connecting..." : "Login with MetaMask"}
      </button>
    </div>
  );
};

export default Login;
