import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Form,
  Table,
  Select,
  DatePicker,
  Button,
  Spin,
  Tag,
  Typography,
  Row,
  Col,
  Drawer,
  Grid,
  Space,
  Dropdown,
  Menu,
} from "antd";
import {
  FileSearchOutlined,
  UserOutlined,
  CalendarOutlined,
  FilterOutlined,
  DownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import OTReportsModal from "./OTReportsModal";
import { ReportContext } from "../context/ReportContext";
import { AuthContext } from "../context/AuthContext";

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const ReportDashboard = () => {
  const { reports, fetchReportsByStaffAndDate, loading } =
    useContext(ReportContext);
  const { staffList, fetchStaff } = useContext(AuthContext);

  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    staffId: "",
    date: dayjs(),
  });

  useEffect(() => {
    fetchStaff();
  }, []);
function formatTo12Hour(time) {
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}
  useEffect(() => {
    if (filters.staffId && filters.date) {
      fetchReportsByStaffAndDate(
        filters.staffId,
        filters.date.format("YYYY-MM-DD")
      );
    }
  }, [filters]);

  const handleFilterChange = (value, field) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filterForm = (
    <Form layout="vertical">
      <Form.Item label="Training Staff">
        <Select
          value={filters.staffId}
          onChange={(value) => handleFilterChange(value, "staffId")}
          placeholder="Select Staff"
        >
          <Option value="">All Staff</Option>
          {staffList.map((staff) => (
            <Option key={staff._id} value={staff.name}>
              {staff.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Date">
        <DatePicker
          value={filters.date}
          onChange={(date) => handleFilterChange(date, "date")}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Button
        type="primary"
        icon={<FileSearchOutlined />}
        onClick={() => setShowModal(true)}
        block
      >
        Fetch OT Reports
      </Button>
    </Form>
  );

  return (
    <div style={{ padding: 16 }}>
      <Card
        style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
        bordered={false}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
              📊 Report Dashboard
            </Title>
          </Col>
          {!screens.md && (
            <Col>
              <Button
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
              />
            </Col>
          )}
        </Row>

        {screens.md ? (
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <span>
                    <UserOutlined /> Staff
                  </span>
                }
              >
                <Select
                  value={filters.staffId}
                  onChange={(value) => handleFilterChange(value, "staffId")}
                >
                  <Option value="">All Staff</Option>
                  {staffList.map((staff) => (
                    <Option key={staff._id} value={staff.name}>
                      {staff.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={
                  <span>
                    <CalendarOutlined /> Date
                  </span>
                }
              >
                <DatePicker
                  value={filters.date}
                  onChange={(date) => handleFilterChange(date, "date")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Button
                type="primary"
                icon={<FileSearchOutlined />}
                onClick={() => setShowModal(true)}
                block
              >
                Fetch OT Reports
              </Button>
            </Col>
          </Row>
        ) : null}

        <Drawer
          title="Filters"
          placement="right"
          closable
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
        >
          {filterForm}
        </Drawer>

        <div style={{ marginTop: 24 }}>
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
              <Text type="secondary"> Loading data...</Text>
            </div>
          ) : reports.length === 0 ? (
            <Text type="secondary">
              No reports found for the selected filters.
            </Text>
          ) : (
            <Table
              dataSource={reports}
              rowKey="_id"
              bordered
              scroll={{ x: 1000 }}
              pagination={{ pageSize: 5 }}
            >
              <Table.Column
                title="Candidate"
                dataIndex={["candidate", "name"]}
              />
              <Table.Column
                title="Trainer"
                dataIndex="scheduleConductedTodayBy"
              />
              <Table.Column
                title="Date"
                dataIndex="date"
                render={(date) => dayjs(date).format("DD/MM/YYYY")}
              />
              <Table.Column
                title="Status"
                dataIndex="present"
                render={(present) =>
                  present ? (
                    <Tag color="green">Present</Tag>
                  ) : (
                    <Tag color="red">Absent</Tag>
                  )
                }
              />
              <Table.Column
                title="Details"
                render={(record) =>
                  record.present ? (
                    <div>
                      <Text strong>In-Time:</Text>{" "}
                      {formatTo12Hour(record.inTime)} <br />
                      <Text strong>Out-Time:</Text>{" "}
                      {formatTo12Hour(record.outTime)} <br />
                      <Text strong>Topic:</Text> {record.topicTaken} <br />
                      <Text strong>Status:</Text> {record.topicStatus} <br />
                      <Text strong>Mode:</Text> {record.modeOfTraining} <br />
                      <Text strong>Training Name:</Text> {record.trainingName}
                    </div>
                  ) : (
                    <Text type="danger">
                      <strong>Reason:</strong> {record.reasonForLeave || "N/A"}
                    </Text>
                  )
                }
              />
            </Table>
          )}
        </div>
      </Card>

      <OTReportsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ReportDashboard;
