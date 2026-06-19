import { Code2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <Code2 />
          <strong>DevTrack</strong>
        </div>
        <h1>Create account</h1>
        <form onSubmit={submit}>
          <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Password<input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          <button className="primary-button" disabled={loading}>{loading ? "Creating" : "Create account"}</button>
        </form>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
