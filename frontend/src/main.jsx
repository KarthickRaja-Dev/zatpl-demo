import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import CandidateProvider from "./context/CandidateContext";
import ReportProvider from "./context/ReportContext";
import "./index.css"
import { StatusProvider } from "./context/StatusContext";
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CandidateProvider>
          <ReportProvider>
            <StatusProvider>
              <App />
            </StatusProvider>
          </ReportProvider>
        </CandidateProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
