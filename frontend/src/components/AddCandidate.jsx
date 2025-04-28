import React, { useContext, useEffect } from "react";
import { CandidateContext } from "../context/CandidateContext";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Card,
  Typography,
  Row,
  Col,
} from "antd";
import { AuthContext } from "../context/AuthContext";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

const AddCandidate = () => {
  const { addCandidate } = useContext(CandidateContext);
  const { staffList, fetchStaff, trainings, fetchTrainings } =
    useContext(AuthContext);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStaff();
    fetchTrainings();
  }, []);

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      trainingName: [ values.trainingName ],
      joiningDate: values.joiningDate.format("YYYY-MM-DD"),
      nextPaymentDate: values.nextPaymentDate
        ? values.nextPaymentDate.format("YYYY-MM-DD")
        : null,
    };
    await addCandidate(formattedValues);
    form.resetFields();
  };

  return (
    <Row justify="center" style={{ padding: "40px 20px" }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card
          bordered
          style={{
            borderRadius: 12,
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
            padding: 24,
          }}
        >
          <Title
            level={3}
            style={{ textAlign: "center", marginBottom: 30, color: "#1890ff" }}
          >
            Add New Candidate
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="middle"
          >
            <Form.Item
              name="name"
              label="Candidate Name"
              rules={[
                { required: true, message: "Please enter candidate name" },
              ]}
            >
              <Input placeholder="Enter candidate name" allowClear />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[
                { required: true, message: "Please enter mobile number" },
              ]}
            >
              <Input placeholder="Enter mobile number" allowClear />
            </Form.Item>

            <Form.Item
              name="candidateCode"
              label="Candidate Code"
              rules={[
                { required: true, message: "Please enter candidate code" },
              ]}
            >
              <Input placeholder="Enter unique candidate code" allowClear />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="joiningDate"
                  label="Joining Date"
                  rules={[{ required: true, message: "Select joining date" }]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="nextPaymentDate" label="Next Payment Date">
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="trainingName"
              label="Training Name"
              rules={[{ required: true, message: "Please select training" }]}
            >
              <Select placeholder="Select training" allowClear>
                {trainings.map((training) => (
                  <Option key={training._id} value={training.training}>
                    {training.training}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="modeOfTraining"
              label="Mode of Training"
              rules={[
                { required: true, message: "Please select training mode" },
              ]}
            >
              <Select placeholder="Select mode" allowClear>
                <Option value="online">Online</Option>
                <Option value="offline">Offline</Option>
                <Option value="hybrid">Hybrid</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="trainingStaff"
              label="Training Staff"
              rules={[{ required: true, message: "Please select staff" }]}
            >
              <Select placeholder="Select staff" allowClear>
                {staffList.map((staff) => (
                  <Option key={staff._id} value={staff._id}>
                    {staff.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{ borderRadius: 8 }}
              >
                Add Candidate
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AddCandidate;
