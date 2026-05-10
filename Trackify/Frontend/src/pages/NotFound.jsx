import { useNavigate } from "react-router-dom";
import { Zap, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "500px", height: "400px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="fade-up" style={{ position: "relative" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #6366F1, #818CF8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(99,102,241,0.3)",
          }}>
            <Zap size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.125rem", letterSpacing: "-0.02em" }}>
            Trackify
          </span>
        </div>

        {/* 404 */}
        <div style={{
          fontSize: "6rem", fontWeight: 900,
          background: "linear-gradient(135deg, #6366F1, #818CF8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          marginBottom: "1rem",
        }}>
          404
        </div>

        <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Page not found
        </p>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "2rem", maxWidth: "320px" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <button onClick={() => navigate("/dashboard")} className="btn-primary">
          <Home size={15} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;