import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, User, Mail, Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { registerAPI } from "../api/auth";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email) e.email = "Email is required";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registerAPI(form);
      login(res.data.user, res.data.token);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type, placeholder, icon, extra) => (
    <div>
      <label className="form-label">{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", display: "flex", pointerEvents: "none" }}>
          {icon}
        </span>
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className="input-base"
          style={{ paddingLeft: "2.25rem", ...(extra || {}) }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {key === "password" && (
          <button type="button" onClick={() => setShowPw(!showPw)}
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {errors[key] && <p style={{ fontSize: "0.75rem", color: "var(--priority-high)", marginTop: "0.375rem" }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", background: "var(--bg-primary)", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="fade-up" style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", marginBottom: "2rem" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #6366F1, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
            <Zap size={20} color="#fff" />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Trackify</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "2rem", backdropFilter: "blur(20px)" }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.375rem", letterSpacing: "-0.02em" }}>Create account</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.75rem" }}>Start managing your projects today.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            {field("Full name", "name", "text", "John Doe", <User size={15} />)}
            {field("Email address", "email", "email", "you@example.com", <Mail size={15} />)}
            {field("Password", "password", showPw ? "text" : "password", "Min 6 characters", <Lock size={15} />)}

            {/* Role */}
            <div>
              <label className="form-label">Role</label>
              <div style={{ position: "relative" }}>
                <Shield size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none" }} />
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="input-base"
                  style={{ paddingLeft: "2.25rem", appearance: "none", cursor: "pointer" }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: "0.25rem", padding: "0.6875rem 1rem", fontSize: "0.875rem" }}>
              {loading ? <div className="spinner" style={{ width: "16px", height: "16px" }} /> : <> Create account <ArrowRight size={15} /></>}
            </button>
          </div>

          <div style={{ borderTop: "1px solid var(--bg-border)", marginTop: "1.5rem", paddingTop: "1.25rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;