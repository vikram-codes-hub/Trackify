import {
  Layers, CheckSquare, TrendingUp, AlertTriangle,
  Trophy, Medal, Award,
} from "lucide-react";
import { useStats } from "../hooks/useStats";
import Avatar from "./Avatar";

/* ── KPI Card ──────────────────────────────────────────────────── */
const KpiCard = ({ icon, label, value, sub, color, delay }) => (
  <div
    className="stats-kpi-card fade-up"
    style={{
      animationDelay: delay,
      background: "var(--bg-card)",
      border: "1px solid var(--bg-border)",
      borderRadius: "16px",
      padding: "1.375rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      transition: "border-color 0.2s, box-shadow 0.2s",
      flex: "1 1 180px",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.boxShadow = `0 0 24px ${color}22`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "var(--bg-border)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div style={{
      width: "38px", height: "38px", borderRadius: "10px",
      background: `${color}18`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color,
    }}>
      {icon}
    </div>
    <div style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>
      {value ?? "—"}
    </div>
    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ fontSize: "0.72rem", color }}>{sub}</div>}
  </div>
);

/* ── Leaderboard row ───────────────────────────────────────────── */
const medals = [
  <Trophy size={15} color="#F59E0B" />,
  <Medal  size={15} color="#94A3B8" />,
  <Award  size={15} color="#CD7F32" />,
];

const LeaderRow = ({ entry, rank }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "0.75rem",
    padding: "0.625rem 0.875rem",
    background: rank === 0 ? "rgba(245,158,11,0.06)" : "transparent",
    borderRadius: "10px",
    transition: "background 0.2s",
  }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = rank === 0 ? "rgba(245,158,11,0.06)" : "transparent"; }}
  >
    <span style={{ width: "20px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
      {medals[rank] || <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontWeight: 700 }}>#{rank + 1}</span>}
    </span>
    <Avatar name={entry.user?.name || "?"} size="sm" />
    <span style={{ flex: 1, fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {entry.user?.name}
    </span>
    <span style={{
      fontSize: "0.75rem", fontWeight: 700,
      background: "var(--status-done-bg)", color: "var(--status-done)",
      padding: "2px 10px", borderRadius: "999px",
    }}>
      {entry.completed} done
    </span>
  </div>
);

/* ── Progress ring ─────────────────────────────────────────────── */
const ProgressRing = ({ pct }) => {
  const r  = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <svg width="72" height="72" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--bg-border)" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="var(--status-done)" strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="middle"
        style={{ fill: "var(--text-primary)", fontSize: "14px", fontWeight: 800, transform: "rotate(90deg)", transformOrigin: "36px 36px", fontFamily: "Inter, sans-serif" }}>
        {pct}%
      </text>
    </svg>
  );
};

/* ── StatsPanel ────────────────────────────────────────────────── */
const StatsPanel = () => {
  const { data, isLoading } = useStats();
  const s = data?.data;

  if (isLoading) {
    return (
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ flex: "1 1 180px", height: "118px", borderRadius: "16px" }} />
        ))}
      </div>
    );
  }

  if (!s) return null;

  return (
    <div style={{ marginBottom: "2.25rem" }}>

      {/* KPIs */}
      <div className="stats-kpi-grid" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <KpiCard delay="0s"    icon={<Layers size={18} />}       label="Total Projects"   value={s.totalProjects}  color="#6366F1" />
        <KpiCard delay="0.06s" icon={<CheckSquare size={18} />}  label="Total Tasks"      value={s.totalTasks}     color="#818CF8" />
        <KpiCard delay="0.12s" icon={<TrendingUp size={18} />}   label="Tasks Completed"  value={s.completedTasks} sub={`${s.completionRate}% rate`} color="#34D399" />
        <KpiCard delay="0.18s" icon={<AlertTriangle size={18} />} label="Overdue Tasks"   value={s.overdueTasks}   color={s.overdueTasks > 0 ? "#F87171" : "#34D399"} />
      </div>

      {/* Bottom row: progress ring + leaderboard */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>

        {/* Completion card */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--bg-border)",
          borderRadius: "16px", padding: "1.375rem 1.5rem",
          display: "flex", alignItems: "center", gap: "1.25rem",
          flex: "0 0 auto",
        }}>
          <ProgressRing pct={s.completionRate} />
          <div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Overall Progress</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[
                { label: "To Do",       val: s.tasksByStatus?.todo,       color: "var(--text-muted)" },
                { label: "In Progress", val: s.tasksByStatus?.inProgress,  color: "var(--status-progress)" },
                { label: "Done",        val: s.tasksByStatus?.done,        color: "var(--status-done)" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{label}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color, marginLeft: "auto" }}>{val ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {s.leaderboard?.length > 0 && (
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--bg-border)",
            borderRadius: "16px", padding: "1.25rem",
            flex: "1 1 260px", minWidth: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <Trophy size={14} color="#F59E0B" />
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)" }}>Team Leaderboard</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginLeft: "auto" }}>by tasks completed</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {s.leaderboard.map((entry, i) => (
                <LeaderRow key={entry.user?.id || i} entry={entry} rank={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
