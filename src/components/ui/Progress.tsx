import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  className?: string;
  animated?: boolean;
  showLabel?: boolean;
}

export function ProgressBar({ value, color = '#C8FF00', height = 6, className, animated = true, showLabel }: ProgressBarProps) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className={cn('relative', className)}>
      <div
        className="w-full rounded-full bg-[#252529] overflow-hidden"
        style={{ height }}
      >
        <div
          className={cn('h-full rounded-full', animated && 'transition-all duration-700 ease-out')}
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs text-[#7A7A8C]">{pct}%</span>
      )}
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  color = '#C8FF00',
  trackColor = '#252529',
  children,
  className,
}: CircularProgressProps) {
  const pct = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
