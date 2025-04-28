import React, { createContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [staffList, setStaffList] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const navigate = useNavigate()
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  const signup = async (userData) => {
    try {
      await axiosInstance.post("/api/users/signup", userData);
      toast.success("Staff Added Successfully");
    } catch (error) {
      console.error("Signup failed", error.response?.data || error.message);
      toast.error(error.message);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await axiosInstance.post("/api/users/login", credentials);
      console.log("Login Response 1:", res);
      if (res.data.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        toast.success("Login Successful");
        return res.data.user.role;
      }
      if (res.data.admin) {
        setUser(res.data.admin);
        setToken(res.data.adminToken);
        localStorage.setItem("user", JSON.stringify(res.data.admin));
        localStorage.setItem("token",res.data.adminToken);
        toast.success("Login Successful");
        return "admin";
      }
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
      toast.error("Login failed",error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/api/users/get/staff");
      setStaffList(res.data.users);
      //showSuccess(res);
    } catch (error) {
      console.error("Error fetching staff", error);
      toast.error(error);
    }
  };

  const fetchTrainings = async () => {
    try {
      const res = await axiosInstance.get("/api/programs/get/trainings");
      console.log("Trainings : ", res);
      setTrainings(res.data.masterPrograms);
      //showSuccess(res);
    } catch (error) {
      console.error("Error fetching trainings", error);
      toast.error(error);
    }
  };

  const updateTrainings = async (program) => {
    try {
      await axiosInstance.put("/api/programs/update/trainings", {
        program,
      });
      //showSuccess(res);
      toast.success("Training Updated Succesfully");
    } catch (error) {
      console.error("Error updating trainings", error);
      toast.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signup,
        login,
        logout,
        staffList,
        fetchStaff,
        fetchTrainings,
        updateTrainings,
        trainings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
