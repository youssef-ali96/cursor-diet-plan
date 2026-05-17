import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F0F11]">
      <Sidebar />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="min-h-screen">{children}</div>
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
    <div className="flex items-start justify-between px-6 py-6 border-b border-[#2A2A30]">
      <div>
        <h1
          className="text-3xl font-black text-[#F0F0F5] uppercase tracking-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-sm text-[#7A7A8C] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 ml-4">{actions}</div>}
    </div>
  );
}
