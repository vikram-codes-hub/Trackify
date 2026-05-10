import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../utils/constants";

const FilterBar = ({ filters, onChange }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filters.status || ""}
        onChange={(e) => handleChange("status", e.target.value)}
        className="input-base w-auto text-sm"
      >
        <option value="">All Status</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select
        value={filters.priority || ""}
        onChange={(e) => handleChange("priority", e.target.value)}
        className="input-base w-auto text-sm"
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