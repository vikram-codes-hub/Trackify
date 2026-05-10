import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [local, setLocal] = useState(value || "");

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 400);
    return () => clearTimeout(timer);
  }, [local]);

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <Search
        size={14}
        style={{
          position: "absolute", left: "11px", top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-faint)", pointerEvents: "none",
        }}
      />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="input-base"
        style={{ paddingLeft: "2.125rem", paddingRight: local ? "2rem" : undefined }}
      />
      {local && (
        <button
          onClick={() => { setLocal(""); onChange(""); }}
          style={{
            position: "absolute", right: "10px", top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-faint)", display: "flex",
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;