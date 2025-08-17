interface BadgeProps {
  count: number;
  maxCount?: number;
  className?: string;
}

const Badge = ({ count, maxCount = 99, className = "" }: BadgeProps) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  if (count === 0) return null;

  return (
    <div
      className={`inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1 rounded-full bg-red-500 text-white text-xs font-medium ${className}`}
      aria-label={`${count} unread messages`}
    >
      {displayCount}
    </div>
  );
};

export default Badge;
