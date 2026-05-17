import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#7A7A8C] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A5A]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full h-11 rounded-[10px] bg-[#1E1E23] border border-[#2A2A30] text-[#F0F0F5] text-sm',
            'placeholder:text-[#4A4A5A] outline-none px-3',
            'focus:border-[#C8FF00]/60 focus:ring-1 focus:ring-[#C8FF00]/20',
            'transition-colors duration-150',
            icon && 'pl-10',
            error && 'border-[#FF4560]/50',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#FF4560]">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#7A7A8C] uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'w-full h-11 rounded-[10px] bg-[#1E1E23] border border-[#2A2A30] text-[#F0F0F5] text-sm',
          'outline-none px-3',
          'focus:border-[#C8FF00]/60 focus:ring-1 focus:ring-[#C8FF00]/20',
          'transition-colors duration-150',
          error && 'border-[#FF4560]/50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[#FF4560]">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';
