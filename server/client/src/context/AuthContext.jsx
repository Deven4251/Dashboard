import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("devtrack_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("devtrack_token")));

  useEffect(() => {
    const token = localStorage.getItem("devtrack_token");
    if (!token) return;

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem("devtrack_user", JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem("devtrack_token");
        localStorage.removeItem("devtrack_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("devtrack_token", data.token);
    localStorage.setItem("devtrack_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistSession(data);
    toast.success("Signed in");
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data);
    toast.success("Account created");
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    localStorage.setItem("devtrack_user", JSON.stringify(data));
    setUser(data);
    toast.success("Profile updated");
  };

  const logout = () => {
    localStorage.removeItem("devtrack_token");
    localStorage.removeItem("devtrack_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, updateProfile, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
