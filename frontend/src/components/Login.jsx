import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, Input, Button, Card, Typography, Alert } from "antd";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const user = await login(values);
      console.log("User", user);
      const url =localStorage.getItem("user").role == "admin" ? "/candidate-dashboard" : "/candidate-dashboard-staff";
      navigate(url);
    } catch (err) {
      setError("Invalid email or password.");
      console.log(err);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Typography.Title
          level={3}
          style={{ textAlign: "center", color: "#1890ff" }}
        >
          Login
        </Typography.Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: "1rem" }}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
