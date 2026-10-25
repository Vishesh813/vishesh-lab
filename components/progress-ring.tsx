type Props = {
  percent: number;
  size?: number;
  stroke?: number;
  className?: string;
};

export function ProgressRing({
  percent,
  size = 112,
  stroke = 8,
  className,
}: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <svg
      className={`progress-ring${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${clamped}% of the track complete`}
    >
      <circle
        className="progress-ring-track"
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        strokeWidth={stroke}
      />
      <circle
        className="progress-ring-fill"
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
