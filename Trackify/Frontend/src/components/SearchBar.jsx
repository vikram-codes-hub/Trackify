import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [local, setLocal] = useState(value || "");

  // Debounce — only call onChange after 400ms pause
  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 400);
    return () => clearTimeout(timer);
  }, [local]);

  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-9 pr-8"
      />
      {local && (
        <button
          onClick={() => { setLocal(""); onChange(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;