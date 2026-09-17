import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/landingPage";
import SignUp from "./components/register/signUp";
import SignIn from "./components/login/signIn";
import Dashboard from "./components/dashboard/dashboard";
import Overview from "./components/dashboard/overview";
import Users from "./components/dashboard/users";
import Services from "./components/dashboard/services";
import Chat from "./components/dashboard/chat";
import Placeholder from "./components/dashboard/placeholder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />}>
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
      </Routes>
    </Router>
  )
}

export default App;