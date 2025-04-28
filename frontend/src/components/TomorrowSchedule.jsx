import React, { useEffect, useState, useContext } from "react";
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Typography,
  TimePicker,
  Button,
  Radio,
  Select,
} from "antd";
import "react-time-picker/dist/TimePicker.css";
import { CandidateContext } from "../context/CandidateContext";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const { Title } = Typography;

const TomorrowSchedule = () => {
  const { user } = useContext(AuthContext);
  const { candidates, fetchCandidatesByStaff } = useContext(CandidateContext);
  const [schedules, setSchedules] = useState([]);
  const [staffList, setStaffList] = useState([]); // State to hold staff list
  const [loading, setLoading] = useState(false); // For loading state

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split("T")[0];

  // Fetch staff list from API
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/users/get/staff");
      setStaffList(res.data.users);
    } catch (error) {
      console.error("Error fetching staff", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidates by staff on user change
  useEffect(() => {
    if (user?._id) {
      fetchCandidatesByStaff(user._id);
    }
    fetchStaff(); // Fetch staff list when component mounts
  }, [user, fetchCandidatesByStaff]);

  useEffect(() => {
    const stored = localStorage.getItem("tomorrowSchedules");
    const storedTimes = JSON.parse(localStorage.getItem("storedTimes")) || {};
    const initial = candidates.map((candidate) => {
      const name = candidate.name;
      return {
        candidateName: name || "",
        trainingName: candidate.trainingName || "",
        inTime: storedTimes[name]?.inTime || null,
        outTime: storedTimes[name]?.outTime || null,
        date: formattedDate,
        present: null,
        reasonForLeave: "",
        staffName: user?.name || "Unknown", // Default to user name if staff is unavailable
      };
    });
    setSchedules(initial);
  }, [candidates, user]);

  useEffect(() => {
    localStorage.setItem("tomorrowSchedules", JSON.stringify(schedules));
  }, [schedules]);

  const handleChange = (index, key, value) => {
    const updated = [...schedules];
    updated[index][key] = value;
    setSchedules(updated);

    if (key === "inTime" || key === "outTime") {
      const name = updated[index].candidateName;
      const times = JSON.parse(localStorage.getItem("storedTimes")) || {};
      times[name] = {
        ...times[name],
        [key]: value,
      };
      localStorage.setItem("storedTimes", JSON.stringify(times));
    }
  };

  return (
    <Row justify="center" className="p-4">
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <Title level={3} className="text-center mb-4 text-primary">
          Tomorrow's Training Schedule
        </Title>
        {schedules.length === 0 ? (
          <div>No schedules available</div>
        ) : (
          schedules.map((schedule, index) => (
            <Card key={index} title={`Candidate ${index + 1}`} className="mb-4">
              <Form layout="vertical">
                {/* Staff Name Dropdown */}
                <Form.Item label="Staff Name">
                  <Select
                    value={schedule.staffName}
                    onChange={(value) =>
                      handleChange(index, "staffName", value)
                    }
                    loading={loading}
                    showSearch
                    optionFilterProp="children"
                  >
                    {staffList.map((staff) => (
                      <Select.Option key={staff._id} value={staff.name}>
                        {staff.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Candidate Name">
                  <Input value={schedule.candidateName} disabled />
                </Form.Item>

                <Form.Item label="Training Name">
                  <Input value={schedule.trainingName} disabled />
                </Form.Item>

                <Form.Item label="Attendance">
                  <Radio.Group
                    value={schedule.present}
                    onChange={(e) =>
                      handleChange(index, "present", e.target.value)
                    }
                  >
                    <Radio value={true}>Present</Radio>
                    <Radio value={false}>Absent</Radio>
                  </Radio.Group>
                </Form.Item>

                {schedule.present === false && (
                  <Form.Item label="Reason for Leave">
                    <Input
                      value={schedule.reasonForLeave}
                      onChange={(e) =>
                        handleChange(index, "reasonForLeave", e.target.value)
                      }
                    />
                  </Form.Item>
                )}

                {schedule.present && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="In-Time">
                        <TimePicker
                          value={
                            schedule.inTime
                              ? moment(schedule.inTime, "HH:mm")
                              : null
                          }
                          format="hh:mm A"
                          onChange={(value) =>
                            handleChange(
                              index,
                              "inTime",
                              value ? value.format("HH:mm") : null
                            )
                          }
                          className="w-100"
                          use12Hours
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Out-Time">
                        <TimePicker
                          value={
                            schedule.outTime
                              ? moment(schedule.outTime, "HH:mm")
                              : null
                          }
                          format="hh:mm A"
                          onChange={(value) =>
                            handleChange(
                              index,
                              "outTime",
                              value ? value.format("HH:mm") : null
                            )
                          }
                          className="w-100"
                          use12Hours
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                <Form.Item label="Date">
                  <Input
                    value={schedule.date}
                    onChange={(value) =>
                      handleChange(
                        index,
                        "date",
                        value 
                      )
                    }
                  />
                </Form.Item>
              </Form>
            </Card>
          ))
        )}

        <div className="text-center">
          <Button
            type="primary"
            onClick={async () => {
              console.log(
                "Tomorrow's Schedules: ",
                JSON.stringify(schedules, null, 2)
              );
              await axiosInstance.post("api/next-batch/add", schedules);
              toast.success("BAtch sent Successfully");
            }}
          >
            Log to Console
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default TomorrowSchedule;
