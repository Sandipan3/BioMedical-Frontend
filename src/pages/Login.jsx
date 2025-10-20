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

      //Connect MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      if (!walletAddress) {
        toast.error("Failed to connect MetaMask wallet.");
        return;
      }

      //Get nonce from backend
      const nonceRes = await api.post("/nonce", { walletAddress });
      const nonce = nonceRes.data.nonce || nonceRes.data.data?.nonce;
      if (!nonce) {
        toast.error("Nonce not received from backend.");
        return;
      }

      //Sign nonce (must match backend’s expected format)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(`Sign this nonce: ${nonce}`);

      //Dispatch login action
      const resultAction = await dispatch(login({ walletAddress, signature }));

      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload.user;
        toast.success(`Welcome back, ${user.name || user.walletAddress}!`);

        //Role-based redirect
        switch (user.role) {
          case "admin":
            navigate("/a");
            break;
          case "doctor":
            navigate("/d");
            break;
          case "patient":
            navigate("/p");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error(resultAction.payload || "Login failed!");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 4001) {
        toast.error("MetaMask signature rejected.");
      } else {
        toast.error(err.response?.data?.message || "Login failed.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 h-screen">
      <h1 className="text-2xl font-bold">Login</h1>
      <button
        disabled={loading}
        onClick={handleLogin}
        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        {loading ? "Logging in..." : "Login with MetaMask"}
      </button>
    </div>
  );
};

export default Login;
