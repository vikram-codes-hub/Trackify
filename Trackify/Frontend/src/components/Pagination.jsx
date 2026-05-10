import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const btnStyle = (active) => ({
    width: "32px", height: "32px",
    borderRadius: "8px",
    border: `1px solid ${active ? "var(--accent)" : "var(--bg-border)"}`,
    background: active ? "var(--accent)" : "transparent",
    color: active ? "#fff" : "var(--text-muted)",
    fontSize: "0.8125rem",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
    fontFamily: "Inter, sans-serif",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", marginTop: "2rem" }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{ ...btnStyle(false), opacity: page === 1 ? 0.35 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
      >
        <ChevronLeft size={15} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPageChange(p)} style={btnStyle(p === page)}>
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{ ...btnStyle(false), opacity: page === totalPages ? 0.35 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
};

export default Pagination;