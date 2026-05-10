export const STATUS_OPTIONS = [
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

export const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const STATUS_COLORS = {
  todo: "bg-zinc-700 text-zinc-300",
  "in-progress": "bg-amber-500/20 text-amber-400",
  done: "bg-green-500/20 text-green-400",
};

export const PRIORITY_COLORS = {
  low: "bg-blue-500/10 text-blue-400",
  medium: "bg-amber-500/10 text-amber-400",
  high: "bg-red-500/10 text-red-400",
};