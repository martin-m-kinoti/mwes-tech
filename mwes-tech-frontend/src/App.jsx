import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./AuthContext";
import { RequireAdmin, RequireClient } from "./ProtectedRoute";
import LandingPage from "./components/landingPage";
import SignUp from "./components/register/signUp";
import SignIn from "./components/login/signIn";
import UserDashboard from "./components/userDashboard/userDashboard";
import UserHome from "./components/userDashboard/userHome";
import MyServices from "./components/userDashboard/myServices";
import Order from "./components/userDashboard/order";
import UserChat from "./components/userDashboard/userChat";
import AdminDashboard from "./components/Admindashboard/dashboard";
import Overview from "./components/Admindashboard/overview";
import Users from "./components/Admindashboard/users";
import Services from "./components/Admindashboard/services";
import Chat from "./components/Admindashboard/chat";
import Placeholder from "./components/Admindashboard/placeholder";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route
            path="/dashboard"
            element={
              <RequireClient>
                <UserDashboard />
              </RequireClient>
            }
          >
            <Route index element={<UserHome />} />
            <Route path="order" element={<Order />} />
            <Route path="my-services" element={<MyServices />} />
            <Route path="chat" element={<UserChat />} />
            <Route
              path="settings"
              element={
                <Placeholder title="Settings" description="Manage your account and preferences." />
              }
            />
            <Route
              path="payments"
              element={
                <Placeholder title="Payments" description="Invoices, billing and payment methods." />
              }
            />
            <Route
              path="help"
              element={
                <Placeholder title="Help" description="Guides and support resources." />
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          >
            <Route index element={<Overview />} />
            <Route path="users" element={<Users />} />
            <Route path="services" element={<Services />} />
            <Route path="chat" element={<Chat />} />
            <Route
              path="settings"
              element={
                <Placeholder title="Settings" description="Manage your account and preferences." />
              }
            />
            <Route
              path="payments"
              element={
                <Placeholder title="Payments" description="Invoices, billing and payment methods." />
              }
            />
            <Route
              path="help"
              element={
                <Placeholder title="Help" description="Guides and support resources." />
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;