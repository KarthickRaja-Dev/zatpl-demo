import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  DatePicker,
  Button,
  Typography,
  Table,
  Checkbox,
  message,
  Modal,
  Input,
  Select,
  Space,
  Divider,
} from "antd";
import dayjs from "dayjs";
import { StatusContext } from "../context/StatusContext";
import { AuthContext } from "../context/AuthContext";

const { Title } = Typography;
const { Option } = Select;

const TrainingStatus = () => {
  const { id } = useParams();
  const { status, getStatusById, updateStatusById, updateTasksById, loading } =
    useContext(StatusContext);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [editableDates, setEditableDates] = useState({});
  const [sameDateChecked, setSameDateChecked] = useState({});
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedTrainingKey, setSelectedTrainingKey] = useState(null);
  const [taskFormState, setTaskFormState] = useState([]);
  const [existingTasks, setExistingTasks] = useState([]);

  useEffect(() => {
    if (id) {
      getStatusById(id);
    }
  }, [id]);

  useEffect(() => {
    if (status?.topics) {
      const initialDates = {};
      const initialCheckbox = {};

      status.topics.forEach((training, trainingIdx) => {
        const trainingKey = training._id || trainingIdx;
        initialDates[trainingKey] = {};
        initialCheckbox[trainingKey] = {};

        training.modules.forEach((mod, modIdx) => {
          const modKey = mod._id || modIdx;
          initialDates[trainingKey][modKey] = {
            startDate: mod.startDate || null,
            endDate: mod.endDate || null,
          };
          initialCheckbox[trainingKey][modKey] = false;
        });
      });

      setEditableDates(initialDates);
      setSameDateChecked(initialCheckbox);
    }
  }, [status]);

  const handleDateChange = (field, value, trainingKey, modKey) => {
    setEditableDates((prev) => ({
      ...prev,
      [trainingKey]: {
        ...prev[trainingKey],
        [modKey]: {
          ...prev[trainingKey][modKey],
          [field]: value,
          ...(field === "startDate" && sameDateChecked[trainingKey]?.[modKey]
            ? { endDate: value }
            : {}),
        },
      },
    }));
  };

  const handleCheckboxChange = (e, trainingKey, modKey) => {
    const checked = e.target.checked;
    setSameDateChecked((prev) => ({
      ...prev,
      [trainingKey]: {
        ...prev[trainingKey],
        [modKey]: checked,
      },
    }));

    if (checked && editableDates?.[trainingKey]?.[modKey]?.startDate) {
      setEditableDates((prev) => ({
        ...prev,
        [trainingKey]: {
          ...prev[trainingKey],
          [modKey]: {
            ...prev[trainingKey][modKey],
            endDate: prev[trainingKey][modKey].startDate,
          },
        },
      }));
    }
  };

  const handleUpdate = async (training, trainingKey) => {
    try {
      const updatedModules = training.modules.map((mod, modIdx) => {
        const modKey = mod._id || modIdx;
        const overrides = editableDates?.[trainingKey]?.[modKey] || {};
        return {
          ...mod,
          startDate: overrides.startDate,
          endDate: overrides.endDate,
        };
      });

      await updateStatusById(id, { ...training, modules: updatedModules });
      message.success("Training dates updated successfully!");
    } catch (error) {
      message.error("Failed to update training dates.");
    }
  };

  const openTaskModal = (training, trainingKey) => {
    training[0].tasks.map((task) => {
      console.log(task, "task in Map");
    });
    setSelectedTrainingKey(trainingKey);
    setExistingTasks(training[0].tasks|| []);
    setTaskFormState([]);
    setTaskModalVisible(true);
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...taskFormState];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTaskFormState(updatedTasks);
  };

  const addNewTaskField = () => {
    setTaskFormState((prev) => [
      ...prev,
      { taskName: "", date: null, taskStatus: "" },
    ]);
  };

  const handleSubmitTasks = async () => {
    try {
      const finalTasks = [...existingTasks, ...taskFormState];
      await updateTasksById(id, {
        trainingKey: selectedTrainingKey,
        tasks: finalTasks,
      });
      message.success("Tasks updated successfully!");
      setTaskModalVisible(false);
    } catch (error) {
      message.error("Failed to update tasks.");
    }
  };

  const columns = (trainingKey) => [
    {
      title: "Module",
      dataIndex: "name",
      key: "name",
      render: (_, mod) => (
        <strong>
          {mod.module}. {mod.name || "Unnamed Module"}
        </strong>
      ),
    },
    {
      title: "Start Date",
      key: "startDate",
      render: (_, mod, modIdx) => {
        const modKey = mod._id || modIdx;
        const moduleDates = editableDates?.[trainingKey]?.[modKey] || {};
        return (
          <DatePicker
            style={{ minWidth: 180 }}
            disabled={isAdmin}
            value={moduleDates.startDate ? dayjs(moduleDates.startDate) : null}
            onChange={(date) =>
              handleDateChange(
                "startDate",
                date ? date.toISOString() : null,
                trainingKey,
                modKey
              )
            }
          />
        );
      },
    },
    {
      title: "Same as Start?",
      key: "checkbox",
      render: (_, mod, modIdx) => {
        const modKey = mod._id || modIdx;
        return (
          <Checkbox
            checked={sameDateChecked?.[trainingKey]?.[modKey] || false}
            disabled={isAdmin}
            onChange={(e) => handleCheckboxChange(e, trainingKey, modKey)}
          >
            Same
          </Checkbox>
        );
      },
    },
    {
      title: "End Date",
      key: "endDate",
      render: (_, mod, modIdx) => {
        const modKey = mod._id || modIdx;
        const moduleDates = editableDates?.[trainingKey]?.[modKey] || {};
        return (
          <DatePicker
            style={{ minWidth: 180 }}
            disabled={isAdmin}
            value={moduleDates.endDate ? dayjs(moduleDates.endDate) : null}
            onChange={(date) =>
              handleDateChange(
                "endDate",
                date ? date.toISOString() : null,
                trainingKey,
                modKey
              )
            }
          />
        );
      },
    },
  ];

  const selectedTraining = status?.topics?.find(
    (training, idx) => (training._id || idx) === selectedTrainingKey
  );

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Training Status Dashboard</Title>
      {loading ? (
        <p>Loading status...</p>
      ) : (
        status?.topics?.map((training, idx) => {
          const trainingKey = training._id || idx;
          return (
            <Card
              key={trainingKey}
              title={
                Array.isArray(training.trainingName)
                  ? training.trainingName.join(", ")
                  : training.trainingName
              }
              style={{ marginBottom: 30 }}
              extra={
                <Button onClick={() => openTaskModal(status.tasks, trainingKey)}>
                  {isAdmin ? "View Tasks" : "Add Tasks"}
                </Button>
              }
            >
              {!isAdmin && (
                <Button
                  type="primary"
                  onClick={() => handleUpdate(training, trainingKey)}
                  style={{ marginBottom: 10, float: "right" }}
                >
                  Update Dates
                </Button>
              )}
              <Table
                dataSource={training.modules}
                columns={columns(trainingKey)}
                rowKey={(record, index) => record._id || index}
                pagination={false}
              />
            </Card>
          );
        })
      )}

      <Modal
        title="Training Tasks"
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        onOk={!isAdmin ? handleSubmitTasks : undefined}
        okText={!isAdmin ? "Submit Tasks" : undefined}
        width={700}
      >
        {selectedTraining && (
          <>
            <Title level={4}>
              {Array.isArray(selectedTraining.trainingName)
                ? selectedTraining.trainingName.join(", ")
                : selectedTraining.trainingName}
            </Title>
            <Divider />
            {(
              existingTasks.map((task, taskIdx) => {
                
                return(
                <div key={taskIdx} style={{ marginBottom: 10 }}>
                  <p>
                    <strong>Task:</strong> {task.taskName}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {dayjs(task.date).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <strong>Status:</strong> {task.taskStatus}
                  </p>
                  <Divider />
                </div>
              )})
            )}
          </>
        )}

        {!isAdmin && (
          <>
            <Title level={5}>Add New Tasks</Title>
            {taskFormState.map((task, index) => (
              <Space
                key={index}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Input
                  placeholder="Task Name"
                  value={task.taskName}
                  onChange={(e) =>
                    handleTaskChange(index, "taskName", e.target.value)
                  }
                />
                <DatePicker
                  value={task.date ? dayjs(task.date) : null}
                  onChange={(date) =>
                    handleTaskChange(index, "date", date?.toISOString() || null)
                  }
                />
                <Select
                  placeholder="Status"
                  value={task.taskStatus}
                  style={{ width: 120 }}
                  onChange={(value) =>
                    handleTaskChange(index, "taskStatus", value)
                  }
                >
                  <Option value="Pending">Pending</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Space>
            ))}
            <Button type="dashed" onClick={addNewTaskField} block>
              + Add Task
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TrainingStatus;
