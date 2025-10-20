import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthUser } from "../slices/authSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <>
      <div>Admin Layout</div>
      <div>
        Welcome back
        {user && (
          <>
            <p>Name: {user.name}</p> <br />
            <p>Wallet Address : {user.walletAddress}</p>
          </>
        )}
      </div>
      <button className="bg-blue-600 text-white" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default AdminDashboard;
