const Avatar = ({ name = "", size = "md" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-accent/20 text-accent font-semibold flex items-center justify-center flex-shrink-0`}
    >
      {initials || "?"}
    </div>
  );
};

export default Avatar;