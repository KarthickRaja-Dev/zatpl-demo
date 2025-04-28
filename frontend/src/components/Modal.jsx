import React, { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const CandidateModal = ({
  type,
  candidate,
  onClose,
  onUpdateTraining,
  onUpdatePayment,
  trainings,
}) => {
  const [trainingName, setTrainingName] = useState(
    candidate?.trainingName[0] || "",
  );
  const [paymentStatus, setPaymentStatus] = useState(
    candidate?.paymentStatus || "pending"
  );
  const [nextPaymentDate, setNextPaymentDate] = useState(
    candidate?.nextPaymentDate ? dayjs(candidate.nextPaymentDate) : dayjs()
  );

  const handleTrainingUpdate = () => {
    
    onUpdateTraining(trainingName);
    onClose();
  };

  const handlePaymentUpdate = () => {
    onUpdatePayment(paymentStatus, nextPaymentDate.toDate());
    onClose();
  };
  return (
    <Modal
      open
      onCancel={onClose}
      footer={null}
      centered
      title={type === "training" ? "Update Training" : "Update Payment"}
    >
      {type === "training" ? (
        <Form layout="vertical" onFinish={handleTrainingUpdate}>
          <Form.Item
            name="trainingName"
            label="Training Name"
            rules={[{ required: true, message: "Please select Training" }]}
          >
            <Select
              placeholder="Please select Training"
              onChange={setTrainingName}
            >
              {trainings.map((training) => (
                <Option key={training._id} value={training.training}>
                  {training.training}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Training
          </Button>
        </Form>
      ) : (
        <Form layout="vertical" onFinish={handlePaymentUpdate}>
          <Form.Item label="Payment Status" required>
            <Select value={paymentStatus} onChange={setPaymentStatus}>
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Next Payment Date" required>
            <DatePicker
              value={nextPaymentDate}
              onChange={setNextPaymentDate}
              format="DD/MM/YYYY"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Payment
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default CandidateModal;
