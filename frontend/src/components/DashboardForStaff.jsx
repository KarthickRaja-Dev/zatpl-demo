import React, { useContext, useEffect, useState } from "react";
import { CandidateContext } from "../context/CandidateContext";
import { AuthContext } from "../context/AuthContext";
import CandidateModal from "./Modal";
import axiosInstance from "../utils/axiosInstance";
import { Table, Card, Typography, Select, Button, Modal, Tag } from "antd";
import {
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CandidateDashboard2 = () => {
  const { candidates, fetchAllCandidates } = useContext(CandidateContext);
  //const { user } = useContext(AuthContext);
  const [filterStaff, setFilterStaff] = useState("");
  const [staffList, setStaffList] = useState([]);
  const navigate = useNavigate();
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
  }, []);

  const filteredCandidates = candidates.filter(
    (candidate) => !filterStaff || candidate.trainingStaff.name === filterStaff
  );

  const columns = [
    { title: "Candidate Name", dataIndex: "name", key: "name" },
    {
      title: "Candidate Code",
      dataIndex: "candidateCode",
      key: "candidateCode",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    { title: "Training Name", dataIndex: "trainingName", key: "trainingName" },
    {
      title: "Training Staff",
      dataIndex: ["trainingStaff", "name"],
      key: "trainingStaff",
    },
    {
      title: "Next Payment Date",
      dataIndex: "nextPaymentDate",
      key: "nextPaymentDate",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "N/A",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) =>
        status === "completed" ? (
          <Tag color="green">
            <CheckCircleOutlined /> Completed
          </Tag>
        ) : (
          <Tag color="red">
            <CloseCircleOutlined /> Pending
          </Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, candidate) => (
        <>
          <Button
            type="link"
            //icon={<DeleteOutlined />}
            onClick={() => navigate(`/status/${candidate._id}`)}
          >
            View Training Status
          </Button>
        </>
      ),
    },
  ];

  return (
    <Card style={{  }}>
      <Title level={3} style={{ textAlign: "center", color: "#1890ff" }}>
        Candidate Dashboard
      </Title>
      <Select
        placeholder="Filter by Training Staff"
        style={{ width: "100%", marginBottom: "20px" }}
        onChange={setFilterStaff}
      >
        <Select.Option value="">All Staff</Select.Option>
        {staffList.map((staff) => (
          <Select.Option key={staff._id} value={staff.name}>
            {staff.name}
          </Select.Option>
        ))}
      </Select>
      <Table
        dataSource={filteredCandidates}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default CandidateDashboard2;
