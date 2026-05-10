import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../utils/constants";

const selectStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--bg-border)",
  color: "var(--text-primary)",
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  fontSize: "0.8125rem",
  fontFamily: "Inter, sans-serif",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
};

const FilterBar = ({ filters, onChange }) => {
  const handle = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <select
        value={filters.status || ""}
        onChange={(e) => handle("status", e.target.value)}
        style={selectStyle}
      >
        <option value="">All Status</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select
        value={filters.priority || ""}
        onChange={(e) => handle("priority", e.target.value)}
        style={selectStyle}
      >
        <option value="">All Priority</option>
        {PRIORITY_OPTIONS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;