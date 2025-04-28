import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance"; // Import your axios instance
import {
  Card,
  Spin,
  Typography,
  Row,
  Col,
  Table,
  Button,
  Select,
  Alert,
  DatePicker,
} from "antd";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";

const { Title, Text } = Typography;

const NextBatch = () => {
  const { user } = useContext(AuthContext);
  const { staffList, fetchStaff } = useContext(AuthContext);
  const [nextBatch, setNextBatch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(moment().add(1, "days"));
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    const fetchNextBatch = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/next-batch/${date.format("YYYY-MM-DD")}`
        );
        setNextBatch(response.data);
      } catch (err) {
        setError("Error fetching next batch");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNextBatch();
  }, [date]);

  useEffect(() => {
    fetchStaff(); // Fetch staff list when the component mounts
  }, [fetchStaff]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleStaffChange = (value) => {
    setSelectedStaff(value);
  };

  const filteredBatches = nextBatch.filter((batch) => {
    return selectedStaff ? batch.staffName === selectedStaff : true;
  });

  const sortedBatches = filteredBatches.sort((a, b) => {
    const aTime = moment(a.inTime, "HH:mm");
    const bTime = moment(b.inTime, "HH:mm");
    return aTime.isBefore(bTime) ? -1 : 1;
  });

  if (loading) {
    return (
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col>
          <Spin size="large" />
          <Text>Loading next batch...</Text>
        </Col>
      </Row>
    );
  }

  if (error) {
    return (
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Alert message="Error" description={error} type="error" showIcon />
        </Col>
      </Row>
    );
  }

  const columns = [
    {
      title: "Candidate Name",
      dataIndex: "candidateName",
      key: "candidateName",
    },
    {
      title: "Training Name",
      dataIndex: "trainingName",
      key: "trainingName",
      render: (trainingNames) => trainingNames.join(", "), // Render array of training names as comma-separated string
    },
    {
      title: "In Time",
      dataIndex: "inTime",
      key: "inTime",
      render: (text, record) =>
        record.present
          ? moment(record.inTime, "HH:mm").format("hh:mm A")
          : "N/A", // Show In Time if present is true
    },
    {
      title: "Out Time",
      dataIndex: "outTime",
      key: "outTime",
      render: (text, record) =>
        record.present
          ? moment(record.outTime, "HH:mm").format("hh:mm A")
          : "N/A", // Show Out Time if present is true
    },
    {
      title: "Leave",
      dataIndex: "leave",
      key: "leave",
      render: (text, record) => (!record.present ? "Leave" : "N/A"), // Show Leave if present is false
    },
    {
      title: "Reason for Leave",
      dataIndex: "reasonForLeave",
      key: "reasonForLeave",
      render: (text, record) =>
        !record.present ? record.reasonForLeave : "N/A", // Show Reason for Leave if present is false
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("MMMM D, YYYY"),
    },
  ];

  return (
    <Row justify="center" style={{ padding: "20px" }}>
      <Col span={24}>
        <Card
          title={<Title level={4}>Next Batch Information</Title>}
          bordered={false}
          style={{ width: "100%" }}
          bodyStyle={{ padding: "16px" }}
        >
          <Row justify="center" style={{ marginBottom: 20 }}>
            <Col>
              <DatePicker
                value={date}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current < moment().endOf("day")
                }
              />
            </Col>
          </Row>

          <Row justify="center" style={{ marginBottom: 20 }}>
            <Col>
              <Select
                value={selectedStaff}
                onChange={handleStaffChange}
                style={{ width: "100%" }}
                placeholder="Select staff"
              >
                <Select.Option value={null}>All Staff</Select.Option>
                {staffList.map((staff) => (
                  <Select.Option key={staff._id} value={staff.name}>
                    {staff.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Table with increased size */}
          <Table
            dataSource={sortedBatches}
            columns={columns}
            rowKey="candidateName"
            pagination={false}
            style={{ width: "100%", maxWidth: "100%" }} // Full width for the table
            scroll={{ x: true }} // Horizontal scroll for large tables
          />
        </Card>
      </Col>
    </Row>
  );
};

export default NextBatch;
