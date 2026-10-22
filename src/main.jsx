import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about.html" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login.html" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register.html" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard.html" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin.html" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
