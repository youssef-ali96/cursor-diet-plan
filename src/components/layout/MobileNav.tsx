import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Calendar, BarChart3, BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/tracking', icon: Dumbbell, label: 'Log' },
  { to: '/plans', icon: BookMarked, label: 'Plans', highlight: true },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Stats' },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F11] border-t border-[#2A2A30]">
      <div className="flex items-center justify-around px-1 py-2">
        {mobileNav.map(({ to, icon: Icon, label, highlight }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all relative',
                isActive ? 'text-[#C8FF00]' : 'text-[#4A4A5A]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} className={cn(isActive && 'drop-shadow-[0_0_8px_rgba(200,255,0,0.6)]')} />
                <span>{label}</span>
                {highlight && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C8FF00]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
