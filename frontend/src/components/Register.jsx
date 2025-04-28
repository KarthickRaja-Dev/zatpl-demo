import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, Input, Select, Button, Alert, Card, Typography, Spin } from "antd";

const { Title } = Typography;
const { Option } = Select;

const Register = () => {
  const { signup } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      await signup(values);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="shadow-lg p-6 w-full max-w-md">
        <Title level={3} className="text-center text-blue-500">
          📝 Register
        </Title>

        {error && <Alert message={error} type="error" showIcon className="mb-4" />}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item label="Select Role" name="role" initialValue="staff">
            <Select>
              <Option value="staff">Staff</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block disabled={loading} className="mt-4">
            {loading ? <Spin size="small" /> : "Register"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
