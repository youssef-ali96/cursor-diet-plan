import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, glass, glow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-[#17171A] border border-[#2A2A30] rounded-2xl',
        hover && 'transition-all duration-200 hover:border-[#3A3A45] hover:-translate-y-0.5 cursor-pointer active:scale-[0.99]',
        glass && 'bg-[rgba(30,30,35,0.7)] backdrop-blur-[20px]',
        glow && 'shadow-[0_0_20px_rgba(200,255,0,0.08)]',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 pb-0', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-xs font-semibold text-[#7A7A8C] uppercase tracking-widest', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';
