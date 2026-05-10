import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { loginAPI } from "../api/auth";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginAPI(form);
      login(res.data.user, res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      background: "var(--bg-primary)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "0", right: "0",
        width: "400px", height: "400px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="fade-up" style={{ width: "100%", maxWidth: "400px", position: "relative" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", marginBottom: "2rem" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, #6366F1, #818CF8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(99,102,241,0.4)",
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Trackify
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "2rem",
          backdropFilter: "blur(20px)",
        }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.375rem", letterSpacing: "-0.02em" }}>
            Sign in
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.75rem" }}>
            Welcome back. Enter your credentials to continue.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            {/* Email */}
            <div>
              <label className="form-label">Email address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none" }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-base"
                  style={{ paddingLeft: "2.25rem" }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              {errors.email && <p style={{ fontSize: "0.75rem", color: "var(--priority-high)", marginTop: "0.375rem" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", pointerEvents: "none" }} />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-base"
                  style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: "0.75rem", color: "var(--priority-high)", marginTop: "0.375rem" }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.25rem", padding: "0.6875rem 1rem", fontSize: "0.875rem" }}
            >
              {loading ? <div className="spinner" style={{ width: "16px", height: "16px" }} /> : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </div>

          <div style={{ borderTop: "1px solid var(--bg-border)", marginTop: "1.5rem", paddingTop: "1.25rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;