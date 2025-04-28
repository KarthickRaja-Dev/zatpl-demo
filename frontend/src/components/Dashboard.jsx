import React, { useContext, useEffect, useState } from "react";
import { CandidateContext } from "../context/CandidateContext";
import { AuthContext } from "../context/AuthContext";
import CandidateModal from "./Modal";
import axiosInstance from "../utils/axiosInstance";
import {
  Table,
  Card,
  Typography,
  Select,
  Button,
  Tag,
  Space,
  Input,
} from "antd";

import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CandidateDashboard = () => {
  const {
    candidates,
    fetchAllCandidates,
    updateCandidateTraining,
    updatePaymentStatus,
  } = useContext(CandidateContext);

  const { trainings, fetchTrainings } = useContext(AuthContext);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalType, setModalType] = useState("");
  const [filterStaff, setFilterStaff] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();
 function shortenProgramTitle(title) {
   const degrees = {
     master: "Master's",
     bachelor: "Bachelor's",
     "post graduate": "PG",
     pg: "PG",
     diploma: "Diploma",
   };

   const subjects = {
     "artificial intelligence and machine learning": "AI/ML",
     "data science and data analytics with machine learning": "DS/DA + ML",
     "front-end development with javascript and reactjs": "FE Dev (JS/React)",
     "java full stack web development": "Java FSD",
     "python full stack web development": "Python FSD",
     "web development with gen ai": "Web Dev (Gen AI)",
     "cloud computing with aws and gcp": "Cloud (AWS/GCP)",
     "cyber security": "CS",
     devops: "DevOps",
     "manual testing and automation testing": "QA (Manual + Auto)",
   };

   const normalize = (str) =>
     str
       .toLowerCase()
       .replace(/[^a-z0-9\s]/gi, "")
       .replace(/\s+/g, " ")
       .trim();

   let normalizedTitle = normalize(title);

   // Get degree
   let degree = "";
   for (const key in degrees) {
     if (normalizedTitle.includes(key)) {
       degree = degrees[key];
       normalizedTitle = normalizedTitle.replace(key, "");
       break;
     }
   }

   // Match subject with normalized comparison
   let subject = "";
   for (const key in subjects) {
     const normalizedKey = normalize(key);
     if (normalizedTitle.includes(normalizedKey)) {
       subject = subjects[key];
       break;
     }
   }

   return degree && subject ? `${degree} in ${subject}` : title;
 }

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get("/api/users/get/staff");
        setStaffList(res.data.users);
      } catch (error) {
        console.error("Error fetching staff", error);
      }
    };

    fetchStaff();
    fetchAllCandidates();
    fetchTrainings();
  }, []);

  const closeModal = () => {
    setSelectedCandidate(null);
    setModalType("");
  };

  const handleUpdateTraining = (trainingName) => {
    console.log("Training Name", trainingName);
    updateCandidateTraining(selectedCandidate._id, trainingName);
    closeModal();
  };

  const handleUpdatePayment = (paymentStatus, nextPaymentDate) => {
    updatePaymentStatus(selectedCandidate._id, paymentStatus, nextPaymentDate);
    closeModal();
  };

  const filteredCandidates =
    candidates.filter((candidate) => {
      const matchesStaff =
        !filterStaff || candidate.trainingStaff.name === filterStaff;
      const matchesSearch = candidate.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      return matchesStaff && matchesSearch;
    }) || [];

  const columns = [
    {
      title: "Candidate Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Training Name",
      dataIndex: "trainingName",
      key: "trainingName",
      render: (names) => (
        <>
          {names.map((name, index) => (
            <Tag color="purple" key={index}>
              {shortenProgramTitle(name)}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text) => (
        <Tag color={text == "completed" ? "green" : "red"}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, candidate) => (
        <Button
          type="link"
          onClick={() => navigate(`/candidate/${candidate._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Card style={{ width: "100%" }}>
      <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>
        Candidate Dashboard
      </Title>

      <Select
        placeholder="Filter by Training Staff"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={setFilterStaff}
        allowClear
      >
        {staffList.map((staff) => (
          <Select.Option key={staff._id} value={staff.name}>
            {staff.name}
          </Select.Option>
        ))}
      </Select>

      <Input.Search
        placeholder="Search by Candidate Name"
        allowClear
        onChange={(e) => setSearchName(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <Table
        columns={columns}
        dataSource={filteredCandidates}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
        bordered
        style={{
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
      />

      {modalType && selectedCandidate && (
        <CandidateModal
          type={modalType}
          candidate={selectedCandidate}
          onClose={closeModal}
          onUpdateTraining={handleUpdateTraining}
          onUpdatePayment={handleUpdatePayment}
          trainings={trainings}
        />
      )}
    </Card>
  );
};

export default CandidateDashboard;
