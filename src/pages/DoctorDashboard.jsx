import React, { useState } from "react";
import { ethers } from "ethers";
import api from "../api/api";
import { logout, selectAuthUser } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import DashboardHeader from "../components/DashboardHeader";
import WalletDisplay from "../components/WalletDisplay";
import DocumentGrid from "../components/DocumentGrid";
import DoctorAccessSection from "../components/DoctorAccessSection";
import PatientDetailsCard from "../components/PatientDetailsCard";

const DoctorDashboard = () => {
  const [patientAddress, setPatientAddress] = useState("");
  const [docs, setDocs] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const handleCheckAccess = async () => {
    try {
      if (!window.ethereum) return toast.error("MetaMask not found");
      if (!ethers.isAddress(patientAddress))
        return toast.error("Invalid wallet address");

      setChecking(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const doctorAddress = await signer.getAddress();

      const response = await api.get("access/check", {
        params: { patient: patientAddress, doctor: doctorAddress },
      });

      const allowed = response.data.hasAccess;
      setHasAccess(allowed);

      if (allowed) {
        toast.success("Access granted");
        const userRes = await api.get(`auth/user/${patientAddress}`);
        const patient = userRes.data.data;
        if (!patient?._id) return toast.error("Patient record not found");

        setPatientInfo(patient);
        const docsRes = await api.get(`document/documents/user/${patient._id}`);
        setDocs(docsRes.data.data || []);
      } else {
        setDocs([]);
        setPatientInfo(null);
        toast.error("Access expired or not granted");
      }
    } catch {
      toast.error("Error checking access");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <DashboardHeader name={user?.name} onLogout={() => dispatch(logout())} />
      <WalletDisplay wallet={user?.walletAddress} />
      <DoctorAccessSection
        patientAddress={patientAddress}
        setPatientAddress={setPatientAddress}
        onCheckAccess={handleCheckAccess}
        checking={checking}
      />
      {hasAccess && patientInfo && (
        <PatientDetailsCard patientInfo={patientInfo} docCount={docs.length} />
      )}
      {hasAccess && <DocumentGrid docs={docs} />}
    </div>
  );
};

export default DoctorDashboard;
