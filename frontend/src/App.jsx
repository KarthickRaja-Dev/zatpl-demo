import React, { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  Route,
  Routes,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  UserAddOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Register from "./components/Register";
import AddCandidate from "./components/AddCandidate";
import CandidateDashboard from "./components/Dashboard";
import CandidateDashboard2 from "./components/DashboardForStaff";
import Report from "./components/Report";
import Login from "./components/Login";
import ReportDashboard from "./components/ReportDashboard";
import TrainingStatus from "./components/TrainingStatus";
import Trainings from "./components/Trainings";
import CandidateDetails from "./components/CandidateDetails";
import TomorrowSchedule from "./components/TomorrowSchedule";
import NextBatch from "./components/NextBatch";

const { Header, Content } = Layout;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  return user && allowedRoles.includes(user.role) ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { label: "Home", to: "/", icon: <HomeOutlined />, show: true },
    { label: "Login", to: "/login", icon: <UserOutlined />, show: !user },
    {
      label: "Register",
      to: "/register",
      icon: <UserAddOutlined />,
      show: user?.role === "admin",
    },
    {
      label: "Add Candidate",
      to: "/add-candidate",
      icon: <UserAddOutlined />,
      show: user?.role === "admin",
    },
    {
      label: "Candidate Dashboard",
      to: "/candidate-dashboard",
      icon: <UserOutlined />,
      show: user?.role === "admin",
    },
    {
      label: "Candidate Dashboard",
      to: "/candidate-dashboard-staff",
      icon: <UserOutlined />,
      show: user?.role === "staff",
    },
    {
      label: "Tomorrow Schedule",
      to: "/next-batch",
      icon: <UserOutlined />,
      show: user?.role === "staff",
    },
    {
      label: "Next Schedule",
      to: "/next-batch-admin",
      icon: <UserOutlined />,
      show: user?.role === "admin",
    },
    {
      label: "Report Dashboard",
      to: "/report-dashboard",
      icon: <FileTextOutlined />,
      show: user?.role === "admin",
    },
    {
      label: "Trainings",
      to: "/trainings",
      icon: <FileTextOutlined />,
      show: user?.role === "admin",
    },
    {
      label: "Submit Report",
      to: "/report",
      icon: <FileTextOutlined />,
      show: user?.role === "staff",
    },
  ];

  return (
    <Header
      className="navbar-header"
      style={{
        display: "flex",
        alignItems: "center",
        background: "#1890ff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        padding: "0 24px",
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{
          flex: 1,
          background: "transparent",
          borderBottom: "none",
        }}
        className="animated-menu"
      >
        {menuItems.map(
          (item) =>
            item.show && (
              <Menu.Item key={item.to} icon={item.icon} className="menu-hover">
                <Link to={item.to}>{item.label}</Link>
              </Menu.Item>
            )
        )}
      </Menu>

      {user && (
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={logout}
          style={{
            marginLeft: 16,
            transition: "all 0.3s ease",
          }}
          className="logout-button"
        >
          Logout
        </Button>
      )}
    </Header>
  );
};


const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      <Content style={{ padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/status/:id" element={<TrainingStatus />} />
          <Route path="/candidate/:id" element={<CandidateDetails />} />
          <Route
            path="/add-candidate"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddCandidate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/next-batch-admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <NextBatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-dashboard-staff"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <CandidateDashboard2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/next-batch"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <TomorrowSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReportDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Trainings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/candidate-dashboard" />
                ) : (
                  <Navigate to="/candidate-dashboard-staff" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
