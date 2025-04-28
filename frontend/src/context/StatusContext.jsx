import React, { createContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
export const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET /api/status/get/:id
  const getStatusById = async (id) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/status/get/${id}`);
      setStatus(res.data.topics);
      console.log("Array", res.data.topics);
      //showSuccess(res); // 🎉 Toast!
    } catch (err) {
      toast.error(err); // ❌ Toast!
    } finally {
      setLoading(false);
    }
  };

  // PUT /api/status/update/:id
  const updateStatusById = async (id, updatedData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/api/status/update/${id}`, {
        topics: updatedData,
      });
      setStatus(res.data.statusController.topics);
      console.log(res);
      //showSuccess(res); // 🎉 Toast!
      return res.data;
    } catch (err) {
      toast.error(err); // ❌ Toast!
      return null;
    } finally {
      setLoading(false);
    }
  };
 const updateTasksById = async (id, updatedData) => {
   setLoading(true);
   try {
     const res = await axiosInstance.put(`/api/status/update/task/${id}`, {
       tasks: updatedData,
     });
     setStatus(res.data.statusController);
     console.log(res);
     //showSuccess(res); // 🎉 Toast!
     return res.data;
   } catch (err) {
     toast.error(err); // ❌ Toast!
     return null;
   } finally {
     setLoading(false);
   }
 };
  return (
    <StatusContext.Provider
      value={{
        status,
        loading,
        getStatusById,
        updateStatusById,
        updateTasksById,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};
