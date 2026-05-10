import { STATUS_COLORS } from "../utils/constants";

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status] || "bg-zinc-700 text-zinc-300"}`}
    >
      {status?.replace("-", " ")}
    </span>
  );
};

export default StatusBadge;