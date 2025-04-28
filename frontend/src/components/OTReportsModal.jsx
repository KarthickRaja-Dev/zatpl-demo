import React, { useState, useContext } from "react";
import { Modal, Button, Table, Form, Select, Typography } from "antd";
import { ReportContext } from "../context/ReportContext";
import { AuthContext } from "../context/AuthContext";
import dayjs from "dayjs";
import moment from "moment";

const { Option } = Select;
const { Title, Text } = Typography;

const OTReportsModal = ({ show, handleClose }) => {
  const { fetchOTByMonth, otReports } = useContext(ReportContext);
  const { staffList } = useContext(AuthContext);
  const [selectedStaff, setSelectedStaff] = useState("");

  const handleStaffChange = (staffId) => {
    setSelectedStaff(staffId);
    if (staffId) {
      fetchOTByMonth(staffId);
    }
  };
const calculateTotalHours = () => {
  if (!otReports.data || otReports.data.length === 0) return "0h 0m";

  let timeSlots = [];

  otReports.data.forEach((report) => {
    if (report.inTime && report.outTime) {
      const inTime = new Date(`1970-01-01 ${convertTo24Hour(report.inTime)}`);
      const outTime = new Date(`1970-01-01 ${convertTo24Hour(report.outTime)}`);
      let merged = false;

      for (let slot of timeSlots) {
        if (
          (inTime >= slot.start && inTime <= slot.end) ||
          (outTime >= slot.start && outTime <= slot.end) ||
          (inTime <= slot.start && outTime >= slot.end)
        ) {
          slot.start = new Date(Math.min(slot.start, inTime));
          slot.end = new Date(Math.max(slot.end, outTime));
          merged = true;
          break;
        }
      }

      if (!merged) {
        timeSlots.push({ start: inTime, end: outTime });
      }
    }
  });

  let totalMinutes = timeSlots.reduce(
    (sum, slot) => sum + (slot.end - slot.start) / (1000 * 60),
    0
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const convertTo24Hour = (time12h) => {
  return moment(time12h, "h:mm A").format("HH:mm:ss");
};

  const columns = [
    { title: "Candidate Name", dataIndex: ["candidate", "name"], key: "candidate", render: (text) => text || "N/A" },
    { title: "Training Staff", dataIndex: ["trainingStaff", "name"], key: "trainingStaff", render: (text) => text || "N/A" },
    { title: "Date", dataIndex: "date", key: "date", render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A") },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <ul style={{ margin: 0, padding: 0 }}>
          <li><strong>In-Time:</strong> {record.inTime || "N/A"}</li>
          <li><strong>Out-Time:</strong> {record.outTime || "N/A"}</li>
          <li><strong>Training Name:</strong> {record.trainingName || "N/A"}</li>
        </ul>
      ),
    },
  ];

  return (
    <Modal open={show} onCancel={handleClose} footer={null} centered title="Overtime Reports" width={800}>
      <Form layout="vertical">
        <Form.Item label="Select Training Staff">
          <Select value={selectedStaff} onChange={handleStaffChange} style={{ width: "100%" }}>
            <Option value="">Select Staff</Option>
            {staffList?.map((staff) => (
              <Option key={staff._id} value={staff.name}>
                {staff.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      {otReports.data && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Total OT Reports:</Text> {otReports.data.length} | <Text strong>Total OT Hours:</Text> {calculateTotalHours()}
        </div>
      )}

      <Table
        dataSource={otReports.data || []}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default OTReportsModal;
