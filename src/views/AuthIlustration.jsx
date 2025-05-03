import React from "react";
import { Routes, Route } from "react-router-dom";

// import auth ilustration layout
import AuthIlustrationLayout from "../components/layouts/AuthIlustrationLayout";
// import authentication
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export default function AuthIlustration() {
  return (
    <AuthIlustrationLayout>
      <Routes>
        {/* authentication  */}
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </AuthIlustrationLayout>
  );
}