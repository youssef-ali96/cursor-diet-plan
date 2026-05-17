import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, Calendar, BarChart3,
  Camera, Target, Trophy, Lightbulb, CheckSquare,
  Droplets, Settings, ChevronRight, BookMarked
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { CircularProgress } from '@/components/ui/Progress';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tracking', icon: Dumbbell, label: 'Daily Log' },
  { to: '/plans', icon: BookMarked, label: 'Plans' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/photos', icon: Camera, label: 'Progress Photos' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/habits', icon: CheckSquare, label: 'Habits' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
  { to: '/water', icon: Droplets, label: 'Water Tracker' },
];

export function Sidebar() {
  const { profile } = useUserStore();
  const { streak } = useTrackingStore();
  const { userLevel } = useGoalsStore();

  const xpPercent = Math.round((userLevel.xp / userLevel.xpToNextLevel) * 100);

  return (
    <aside className="hidden lg:flex flex-col h-screen bg-[#0F0F11] border-r border-[#2A2A30] fixed left-0 top-0 z-40 overflow-y-auto" style={{ width: '16rem' }}>
      {/* Logo */}
      <div className="p-5 border-b border-[#2A2A30]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C8FF00] flex items-center justify-center">
            <span className="text-[#0F0F11] text-lg font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>F</span>
          </div>
          <div>
            <div className="text-sm font-bold text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>FITFORGE</div>
            <div className="text-[10px] text-[#4A4A5A] font-medium">PRO</div>
          </div>
        </div>
      </div>

      {/* Profile card */}
      {profile && (
        <div className="p-4 border-b border-[#2A2A30]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8FF00] to-[#30D158] flex items-center justify-center text-[#0F0F11] font-bold text-sm shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F0F0F5] truncate">{profile.name}</p>
              <p className="text-[11px] text-[#7A7A8C]">Lvl {userLevel.level} · {userLevel.title}</p>
            </div>
            <div className="shrink-0">
              <CircularProgress value={xpPercent} size={36} strokeWidth={3} color="#C8FF00">
                <span className="text-[9px] font-bold text-[#C8FF00]">{xpPercent}%</span>
              </CircularProgress>
            </div>
          </div>
          {/* Streak */}
          {streak.currentStreak > 0 && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#FF9F0A] font-semibold">
              <span className="text-base leading-none">🔥</span>
              <span>{streak.currentStreak} day streak</span>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20'
                  : 'text-[#5A5A6A] hover:text-[#F0F0F5] hover:bg-[#1E1E23] border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className="shrink-0" />
                <span className="flex-1">{label}</span>
                {to === '/plans' && !isActive && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#C8FF00] text-[#0F0F11]">NEW</span>
                )}
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 py-3 border-t border-[#1E1E23]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border',
              isActive
                ? 'bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/20'
                : 'text-[#5A5A6A] hover:text-[#F0F0F5] hover:bg-[#1E1E23] border-transparent'
            )
          }
        >
          <Settings size={16} className="shrink-0" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
