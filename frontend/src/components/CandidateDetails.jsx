import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Tag, Space, Spin, Button } from "antd";
import { CandidateContext } from "../context/CandidateContext";
import { AuthContext } from "../context/AuthContext";
import CandidateModal from "./Modal";
import { SyncOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidates, updateCandidateTraining, updatePaymentStatus ,deleteCandidateTraining } =
    useContext(CandidateContext);
  const { trainings, fetchTrainings } = useContext(AuthContext);

  const [candidate, setCandidate] = useState(null);
  const [modalType, setModalType] = useState("");
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
    const found = candidates.find((c) => c._id === id);
    setCandidate(found);
    fetchTrainings();
  }, []);

  const closeModal = () => setModalType("");

  const handleUpdateTraining = (trainingName) => {
    updateCandidateTraining(candidate._id, trainingName);
    closeModal();
  };

  const handleUpdatePayment = (paymentStatus, nextPaymentDate) => {
    updatePaymentStatus(candidate._id, paymentStatus, nextPaymentDate);
    closeModal();
  };

  if (!candidate) return <Spin tip="Loading Candidate..." />;

  return (
    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title level={3}>{candidate.name}</Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text strong>Candidate Code:</Text>
        <Tag color="blue">{candidate.candidateCode}</Tag>

        <Text strong>Leave Count:</Text>
        <Text>{candidate.leaveCount ?? 0}</Text>

        <Text strong>Joining Date:</Text>
        <Text>
          {new Date(candidate.joiningDate).toLocaleDateString("en-GB")}
        </Text>

        <Text strong>Training Name:</Text>

        {candidate.trainingName.map((name,i) => (
          <Tag color="purple" key={i}>{shortenProgramTitle(name)}</Tag>
        ))}

        <Text strong>Training Staff:</Text>
        <Text>{candidate.trainingStaff?.name}</Text>

        <Text strong>Next Payment Date:</Text>
        <Text>
          {candidate.nextPaymentDate
            ? new Date(candidate.nextPaymentDate).toLocaleDateString("en-GB")
            : "N/A"}
        </Text>

        <Text strong>Payment Status:</Text>
        <Tag color={candidate.paymentStatus === "completed" ? "green" : "red"}>
          {candidate.paymentStatus === "completed" ? "Completed" : "Pending"}
        </Tag>

        {/* Action Buttons */}
        <Space wrap style={{ marginTop: 24 }}>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={() => setModalType("training")}
          >
            Update Training
          </Button>
          <Button
            type="dashed"
            icon={<SyncOutlined />}
            onClick={() => setModalType("payment")}
          >
            Update Payment
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/status/${candidate._id}`)}
          >
            View Status
          </Button>
          <Button
            type="link"
            onClick={() => deleteCandidateTraining(candidate._id)}
          >
            Delete Candidate
          </Button>
        </Space>
      </Space>

      {/* Modal */}
      {modalType && (
        <CandidateModal
          type={modalType}
          candidate={candidate}
          onClose={closeModal}
          onUpdateTraining={handleUpdateTraining}
          onUpdatePayment={handleUpdatePayment}
          trainings={trainings}
        />
      )}
    </Card>
  );
};

export default CandidateDetails;
