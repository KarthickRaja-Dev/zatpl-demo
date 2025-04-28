import React, { createContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

export const ReportContext = createContext();

const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otReports, setOtReports] = useState([]);

  const addReport = async (reportData) => {
    try {
      const res = await axiosInstance.post("/api/reports/add", reportData);
      //setReports((prev) => [...prev, res.data]);
      toast.success("Report Added Successfully");
      //(res);
    } catch (error) {
      console.error("Error adding report", error);
      toast.error(error);
    }
  };

  const fetchReportsByStaffAndDate = async (staffId, date) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/reports/filter/${staffId}/${date}`
      );
      console.log("Response:", res.data);
      setReports(res.data);
      //(res);
    } catch (error) {
      console.error("Error fetching reports", error);
      toast.error(error);
    }
    setLoading(false);
  };

  const fetchOTByMonth = async (staffId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/reports/ot/${staffId}`);
      console.log("OT Reports:", res.data);
      setOtReports(res.data);
      //(res);
    } catch (error) {
      console.error("Error fetching OT reports", error);
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        addReport,
        fetchReportsByStaffAndDate,
        fetchOTByMonth,
        otReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export default ReportProvider;
