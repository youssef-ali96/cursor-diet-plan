import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 select-none rounded-[10px] disabled:opacity-40 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#C8FF00] text-[#0F0F11] hover:bg-[#a3d400] active:scale-[0.97]',
      secondary: 'bg-[#1E1E23] text-[#F0F0F5] border border-[#2A2A30] hover:bg-[#252529] hover:border-[#3A3A45]',
      ghost: 'text-[#7A7A8C] hover:text-[#F0F0F5] hover:bg-[#1E1E23]',
      danger: 'bg-[#FF4560]/10 text-[#FF4560] border border-[#FF4560]/20 hover:bg-[#FF4560]/20',
      outline: 'border border-[#C8FF00]/40 text-[#C8FF00] hover:bg-[#C8FF00]/10',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
