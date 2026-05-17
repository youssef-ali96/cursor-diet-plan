import { cn } from '@/lib/utils';
import type { WorkoutIntensity, WorkoutType, InsightType } from '@/types';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'subtle' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ label, color = '#C8FF00', variant = 'subtle', size = 'sm', className }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  
  const styles = {
    filled: { backgroundColor: color, color: '#0F0F11' },
    subtle: { backgroundColor: `${color}20`, color },
    outline: { border: `1px solid ${color}40`, color },
  };

  return (
    <span
      className={cn('inline-flex items-center rounded-full font-semibold uppercase tracking-wider', sizeClass, className)}
      style={styles[variant]}
    >
      {label}
    </span>
  );
}

export const intensityColors: Record<WorkoutIntensity, string> = {
  light: '#30D158',
  moderate: '#C8FF00',
  high: '#FF9F0A',
  max: '#FF4560',
};

export const workoutTypeColors: Record<WorkoutType, string> = {
  strength: '#C8FF00',
  cardio: '#0A84FF',
  hiit: '#FF4560',
  yoga: '#BF5AF2',
  pilates: '#FF9F0A',
  cycling: '#30D158',
  running: '#FF9F0A',
  swimming: '#0A84FF',
  sports: '#FF6B35',
  other: '#7A7A8C',
};

export const insightColors: Record<InsightType, string> = {
  success: '#30D158',
  warning: '#FF9F0A',
  info: '#0A84FF',
  tip: '#BF5AF2',
};
