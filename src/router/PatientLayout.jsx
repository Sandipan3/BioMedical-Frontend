import React from "react";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const PatientLayout = () => {
  return (
    <section className=" bg-gray-50">
      {/* <PatientNavbar /> */}
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
};

export default PatientLayout;
