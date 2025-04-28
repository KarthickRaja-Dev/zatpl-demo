import React, { useState } from "react";
import { Form, Input, Button, Space, Card, notification } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const Trainings = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const program = {
      training: values.training,
      modules: values.modules.map((mod, index) => ({
        module: Number(mod.module),
        name: mod.name,
      })),
    };

    try {
      const res = await axiosInstance.put(
        "/api/programs/update/trainings",
        {
          program,
        }
      );
      notification.success({ message: res.data.message });
      form.resetFields();
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong.";
      notification.error({ message: msg });
    }
  };

  return (
    <Card
      title="Add or Update Training Program"
      style={{ maxWidth: 800, margin: "auto" }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="training"
          label="Training Program Name"
          rules={[
            { required: true, message: "Please input the training name" },
          ]}
        >
          <Input placeholder="e.g. Master Program in Data Science" />
        </Form.Item>

        <Form.List
          name="modules"
          rules={[
            {
              validator: async (_, modules) => {
                if (!modules || modules.length < 1) {
                  return Promise.reject(
                    new Error("At least one module is required")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "module"]}
                    rules={[{ required: true, message: "Module number" }]}
                  >
                    <Input placeholder="Module #" type="number" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Module name" }]}
                  >
                    <Input placeholder="Module Name" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add Module
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Training Program
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Trainings;
