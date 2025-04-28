import React, { createContext, useCallback, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const CandidateContext = createContext();

const CandidateProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Fetch all candidates
  const fetchAllCandidates = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/candidates/all");
      setCandidates(res.data);
      // (res);
    } catch (error) {
      console.error("Error fetching candidates", error);
      toast.error(error);
    }
    setLoading(false);
  };

  // 🔹 Fetch candidates with pending payments
  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/candidates/payment-pending");
      setCandidates(res.data);
      //(res);
    } catch (error) {
      console.error("Error fetching pending payments", error);
      toast.error(error);
    }
    setLoading(false);
  };

  // 🔹 Fetch candidates trained by a specific staff
  const fetchCandidatesByStaff = useCallback(async (staffId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/candidates/staff/${staffId}`);
      setCandidates(res.data);
      //(res);
    } catch (error) {
      console.error("Error fetching staff candidates", error);
      toast.error(error);
    }
    setLoading(false);
  }, []);

  // 🔹 Add a new candidate
  const addCandidate = async (candidateData) => {
    try {
      const res = await axiosInstance.post(
        "/api/candidates/add",
        candidateData
      );
      setCandidates((prev) => [...prev, res.data]);
      toast.success("Candidate Added Successfully");
      //(res);
    } catch (error) {
      console.error("Error adding candidate", error);
      toast.error(error);
    }
  };

  // 🔹 Update candidate training
  const updateCandidateTraining = async (id, trainingName) => {
    try {
      await axiosInstance.put(`/api/candidates/update-training/${id}`, {
        trainingName,
      });

      toast.success("Training Updated Successfully");
      window.location.reload();
      //(res);
    } catch (error) {
      console.error("Error updating training", error);
      toast.error(error);
    }
  };

  // 🔹 Delete candidate
  const deleteCandidateTraining = async (id) => {
    try {
      await axiosInstance.delete(`/api/candidates/delete/${id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
      navigate("/candidate-dashboard");
      //(res);
    } catch (error) {
      console.error("Error deleting candidate", error);
      toast.error(error);
    }
  };

  // 🔹 Update candidate payment date
  const updatePaymentDate = async (id, nextPaymentDate) => {
    try {
      const res = await axiosInstance.put(
        `/api/candidates/update-payment-date/${id}`,
        {
          nextPaymentDate,
        }
      );
      setCandidates((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, nextPaymentDate: res.data.nextPaymentDate } : c
        )
      );
      toast.success("Payment Date Changed Successfully");
      //(res);
    } catch (error) {
      console.error("Error updating payment date", error);
      toast.error(error);
    }
  };

  // 🔹 Update candidate payment status
  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const res = await axiosInstance.put(
        `/api/candidates/update-payment-status/${id}`,
        {
          paymentStatus,
        }
      );
      setCandidates((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, paymentStatus: res.data.paymentStatus } : c
        )
      );
      navigate("/candidate-dashboard");
      toast.success("Payment Status Changed Successfully");
      //(res);
      //updatePaymentDate(id, nextPaymentDate); // optional: also shows success in that function
    } catch (error) {
      toast.error("Error updating payment status", error);
      // (error);
    }
  };

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        loading,
        fetchAllCandidates,
        fetchPendingPayments,
        fetchCandidatesByStaff,
        addCandidate,
        updateCandidateTraining,
        updatePaymentDate,
        updatePaymentStatus,
        deleteCandidateTraining,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export default CandidateProvider;
