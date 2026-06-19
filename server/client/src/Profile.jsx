import { Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext.jsx";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    github: user?.github || "",
    portfolio: user?.portfolio || "",
    avatar: user?.avatar || "",
  });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await updateProfile(form);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update profile");
    }
  };

  return (
    <form className="panel form-panel" onSubmit={submit}>
      <div className="panel-header">
        <h2>User Profile</h2>
        <button className="primary-button">
          <Save size={18} />
          Save
        </button>
      </div>
      <div className="form-grid">
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          Avatar URL
          <input
            value={form.avatar}
            onChange={(event) =>
              setForm({ ...form, avatar: event.target.value })
            }
          />
        </label>
        <label className="span-2">
          Bio
          <textarea
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
          />
        </label>
        <label>
          Location
          <input
            value={form.location}
            onChange={(event) =>
              setForm({ ...form, location: event.target.value })
            }
          />
        </label>
        <label>
          GitHub
          <input
            value={form.github}
            onChange={(event) =>
              setForm({ ...form, github: event.target.value })
            }
          />
        </label>
        <label className="span-2">
          Portfolio
          <input
            value={form.portfolio}
            onChange={(event) =>
              setForm({ ...form, portfolio: event.target.value })
            }
          />
        </label>
      </div>
    </form>
  );
}
