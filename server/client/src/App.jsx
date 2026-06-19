import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AppLayout from "./AppLayout.jsx";
import Assistant from "./Assistant.jsx";
import Analytics from "./Analytics.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";
import Notifications from "./Notifications.jsx";
import Profile from "./Profile.jsx";
import ProjectDetails from "./ProjectDetails.jsx";
import ProjectForm from "./ProjectForm.jsx";
import Projects from "./Projects.jsx";
import Register from "./Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
