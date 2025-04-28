import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CandidateContext } from "../context/CandidateContext";
import { ReportContext } from "../context/ReportContext";
import {
  Form,
  Input,
  Button,
  Card,
  Alert,
  Select,
  Radio,
  Spin,
  Row,
  Col,
  Typography,
} from "antd";
import "react-time-picker/dist/TimePicker.css";
import TimePicker from "react-time-picker";

const { Option } = Select;
const { Title, Text } = Typography;

const Report = () => {
  const { user } = useContext(AuthContext);
  const { fetchCandidatesByStaff, candidates } = useContext(CandidateContext);
  const { addReport } = useContext(ReportContext);
  const { staffList, fetchStaff } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedReports = localStorage.getItem("unsavedReports");
    const savedIndex = localStorage.getItem("reportIndex");

    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }

    if (savedIndex !== null) {
      setCurrentIndex(Number(savedIndex));
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchCandidatesByStaff(user._id);
    }
  }, [user, fetchCandidatesByStaff]);

  useEffect(() => {
    if (candidates.length > 0 && reports.length === 0) {
      setReports(
        candidates.map((candidate) => ({
          candidate: candidate._id || "",
          trainingStaff: user?._id || "",
          trainingName: candidate.trainingName || "",
          scheduleConductedTodayBy: user?.name || "",
          inTime: null,
          outTime: null,
          modeOfTraining: "",
          topicTaken: "",
          topicStatus: "",
          date: new Date().toISOString().split("T")[0],
          present: null,
          reasonForLeave: "",
          ot: false,
        }))
      );
    }
  }, [candidates, user]);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    localStorage.setItem("reportIndex", currentIndex);
  }, [currentIndex]);

  const handleChange = (name, value) => {
    setReports((prevReports) => {
      const updatedReports = [...prevReports];
      updatedReports[currentIndex] = {
        ...updatedReports[currentIndex],
        [name]: value,
      };
      localStorage.setItem("unsavedReports", JSON.stringify(updatedReports));
      return updatedReports;
    });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const formattedReports = reports.map((report) => ({
      ...report,
      reasonForLeave: report.present ? null : report.reasonForLeave,
    }));

    try {
      await addReport(formattedReports);
      localStorage.removeItem("unsavedReports");
      localStorage.removeItem("reportIndex");
    } catch (err) {
      setError("Failed to submit reports. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" className="p-4">
      <Col xs={24} sm={22} md={16} lg={12} xl={10}>
        <Card bordered className="shadow">
          <Title level={3} className="text-center text-primary">
            Submit Training Reports
          </Title>
          {error && (
            <Alert type="error" message={error} showIcon className="mb-3" />
          )}
          {reports.length > 0 && (
            <>
              <Text strong>
                Candidate {currentIndex + 1} of {reports.length}
              </Text>
              <Form layout="vertical" className="mt-3">
                <Form.Item label="Candidate">
                  <Input
                    value={candidates[currentIndex]?.name || "No Name"}
                    disabled
                  />
                </Form.Item>

                <Form.Item label="Training Name">
                  <Input
                    value={
                      reports[currentIndex].trainingName ||
                      "No Training Assigned"
                    }
                    //disabled
                  />
                </Form.Item>

                <Form.Item label="Attendance">
                  <Radio.Group
                    value={reports[currentIndex].present}
                    onChange={(e) => handleChange("present", e.target.value)}
                  >
                    <Radio value={true}>Present</Radio>
                    <Radio value={false}>Absent</Radio>
                  </Radio.Group>
                </Form.Item>

                {!reports[currentIndex].present && (
                  <Form.Item label="Reason for Leave">
                    <Input
                      value={reports[currentIndex].reasonForLeave}
                      onChange={(e) =>
                        handleChange("reasonForLeave", e.target.value)
                      }
                    />
                  </Form.Item>
                )}

                {reports[currentIndex].present && (
                  <>
                    <Form.Item label="Schedule Conducted BY">
                      <Select
                        placeholder="Select Staff"
                        value={reports[currentIndex].scheduleConductedTodayBy}
                        onChange={(e) =>
                          handleChange("scheduleConductedTodayBy", e)
                        }
                      >
                        <Option value="">All Staff</Option>
                        {staffList.map((staff) => (
                          <Option key={staff._id} value={staff.name}>
                            {staff.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item label="Overtime (OT)">
                      <Radio.Group
                        value={reports[currentIndex].ot}
                        onChange={(e) => handleChange("ot", e.target.value)}
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item label="In-Time">
                          <TimePicker
                            onChange={(value) => handleChange("inTime", value)}
                            value={reports[currentIndex].inTime || ""}
                            format="h:mm a"
                            disableClock={true}
                            clearIcon={null}
                            className="w-100"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Out-Time">
                          <TimePicker
                            onChange={(value) => handleChange("outTime", value)}
                            value={reports[currentIndex].outTime || ""}
                            format="h:mm a"
                            disableClock={true}
                            clearIcon={null}
                            className="w-100"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="Mode of Training">
                      <Select
                        value={reports[currentIndex].modeOfTraining}
                        onChange={(value) =>
                          handleChange("modeOfTraining", value)
                        }
                      >
                        <Option value="">Select Mode</Option>
                        <Option value="online">Online</Option>
                        <Option value="offline">Offline</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item label="Topic Taken">
                      <Input
                        value={reports[currentIndex].topicTaken}
                        onChange={(e) =>
                          handleChange("topicTaken", e.target.value)
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Topic Status">
                      <Select
                        value={reports[currentIndex].topicStatus}
                        onChange={(value) => handleChange("topicStatus", value)}
                      >
                        <Option value="">Select Status</Option>
                        <Option value="ongoing">Ongoing</Option>
                        <Option value="training completed">
                          Training Completed
                        </Option>
                        <Option value="completed">Completed</Option>
                      </Select>
                    </Form.Item>
                  </>
                )}

                <Row justify="space-between" className="mt-4">
                  <Col>
                    <Button
                      onClick={() => setCurrentIndex(currentIndex - 1)}
                      disabled={currentIndex === 0}
                    >
                      Previous
                    </Button>
                  </Col>
                  <Col>
                    {currentIndex < reports.length - 1 ? (
                      <Button
                        type="primary"
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                      >
                        Submit All Reports
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default Report;
