import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const AdminLayout = () => {
  return (
    <section className=" bg-gray-50">
      {/* <AdminNavbar /> */}
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
};

export default AdminLayout;
