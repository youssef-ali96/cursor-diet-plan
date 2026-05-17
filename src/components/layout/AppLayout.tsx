import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F0F11] flex overflow-x-hidden">
      <Sidebar />
      <div className="hidden lg:block shrink-0" style={{ width: '16rem' }} />
      <main className="flex-1 min-w-0 pb-20 lg:pb-6">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between px-7 sm:px-10 py-6 border-b border-[#2A2A30]"
      style={{ backgroundColor: 'rgba(15,15,17,0.92)', backdropFilter: 'blur(20px)' }}
    >
      <div>
        <h1
          className="text-3xl sm:text-4xl font-black text-[#F0F0F5] uppercase tracking-tight leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-sm text-[#9A9AAC] mt-2 font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0 ml-6">{actions}</div>}
    </div>
  );
}

export function PageContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-screen-xl mx-auto px-6 sm:px-10 pt-8 pb-16 flex flex-col gap-10 ${className}`}>
      {children}
    </div>
  );
}

/** Visible section divider — lime accent bar + bold title */
export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-7 rounded-full bg-[#C8FF00]" />
        <h2 className="text-lg font-bold text-[#E0E0EA] tracking-wide">{title}</h2>
      </div>
      {action}
    </div>
  );
}
