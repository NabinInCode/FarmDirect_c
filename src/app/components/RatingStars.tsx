import { JSX } from "react";

export default function RatingStars({
  value,
  size = "md",
  count,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  count?: number;
}): JSX.Element {
  const filled = Math.round(value * 2) / 2;
  const fullStars = Math.floor(filled);
  const hasHalf = filled - fullStars >= 0.5;

  const dimensions =
    size === "lg" ? "h-5 w-5" : size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return (
            <StarIcon key={i} className={`${dimensions} text-amber-400`} filled />
          );
        }
        if (hasHalf && i === fullStars) {
          return (
            <span key={i} className={`relative inline-block ${dimensions}`}>
              <StarIcon className={`${dimensions} text-faint`} filled />
              <span className="absolute inset-0 overflow-hidden w-1/2">
                <StarIcon className={`${dimensions} text-amber-400`} filled />
              </span>
            </span>
          );
        }
        return <StarIcon key={i} className={`${dimensions} text-faint`} />;
      })}
      {count !== undefined && (
        <span className="ml-1 text-sm font-medium text-muted-2">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}

export function StarIcon({ className, filled }: { className: string; filled?: boolean }): JSX.Element {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      aria-hidden
    >
      {filled ? (
        <path
          fill="currentColor"
          d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77 4.8 17.5l.99-5.79L1.58 7.62l5.82-.85L10 1.5z"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77 4.8 17.5l.99-5.79L1.58 7.62l5.82-.85L10 1.5z"
        />
      )}
    </svg>
  );
}