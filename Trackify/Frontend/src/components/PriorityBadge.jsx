import { PRIORITY_COLORS } from "../utils/constants";

const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${PRIORITY_COLORS[priority] || "bg-zinc-700 text-zinc-300"}`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;