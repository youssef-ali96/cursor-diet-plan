import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, children, className, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-[#17171A] border border-[#2A2A30] rounded-2xl shadow-2xl',
          'animate-[fadeSlideUp_0.25s_ease_forwards]',
          sizes[size],
          className
        )}
        style={{ animation: 'slideUp 0.25s ease forwards' }}
      >
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-[#2A2A30]">
            <h2 className="text-base font-semibold text-[#F0F0F5]">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X size={18} />
            </Button>
          </div>
        )}
        {!title && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10"
          >
            <X size={18} />
          </Button>
        )}
        <div className="p-5">{children}</div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
