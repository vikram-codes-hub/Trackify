const avatarColors = [
  ["#6366F1", "rgba(99,102,241,0.15)"],
  ["#8B5CF6", "rgba(139,92,246,0.15)"],
  ["#EC4899", "rgba(236,72,153,0.15)"],
  ["#14B8A6", "rgba(20,184,166,0.15)"],
  ["#F59E0B", "rgba(245,158,11,0.15)"],
  ["#3B82F6", "rgba(59,130,246,0.15)"],
];

const Avatar = ({ name = "", size = "md" }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  const [color, bg] = avatarColors[(name.charCodeAt(0) || 0) % avatarColors.length];

  const dim = { sm: 24, md: 32, lg: 40 }[size] || 32;
  const fs  = { sm: "0.625rem", md: "0.75rem", lg: "0.875rem" }[size] || "0.75rem";

  return (
    <div style={{
      width: `${dim}px`, height: `${dim}px`,
      borderRadius: "50%",
      background: bg,
      color,
      fontSize: fs,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      border: `1.5px solid ${color}44`,
      letterSpacing: "0.02em",
    }}>
      {initials}
    </div>
  );
};

export default Avatar;