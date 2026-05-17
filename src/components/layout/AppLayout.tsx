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
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-[#2A2A30]"
      style={{ backgroundColor: 'rgba(15,15,17,0.85)', backdropFilter: 'blur(16px)' }}
    >
      <div>
        <h1
          className="text-2xl sm:text-3xl font-black text-[#F0F0F5] uppercase tracking-tight leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-xs text-[#7A7A8C] mt-1 font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 ml-4">{actions}</div>}
    </div>
  );
}

export function PageContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-6 ${className}`}>
      {children}
    </div>
  );
}
