import { AppLayout, PageHeader, PageContent } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { ProgressBar, CircularProgress } from '@/components/ui/Progress';
import { useGoalsStore } from '@/store/goalsStore';
import { useTrackingStore } from '@/store/trackingStore';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export function AchievementsPage() {
  const { achievements, userLevel } = useGoalsStore();
  const { workouts, streak } = useTrackingStore();

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);
  const xpPercent = Math.round((userLevel.xp / userLevel.xpToNextLevel) * 100);
  const totalWorkouts = workouts.filter((w) => w.completed).length;

  return (
    <AppLayout>
      <PageHeader
        title="Achievements"
        subtitle={`${unlocked.length} / ${achievements.length} unlocked`}
      />

      <PageContent>
        {/* Level card */}
        <Card glow className="p-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <CircularProgress value={xpPercent} size={90} strokeWidth={7} color="#C8FF00">
                <div className="text-center">
                  <p className="text-2xl font-black text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {userLevel.level}
                  </p>
                  <p className="text-[9px] text-[#7A7A8C] font-semibold uppercase">LVL</p>
                </div>
              </CircularProgress>
            </div>
            <div className="flex-1">
              <p className="text-xl font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {userLevel.title}
              </p>
              <p className="text-sm text-[#7A7A8C]">{userLevel.xp} / {userLevel.xpToNextLevel} XP to Level {userLevel.level + 1}</p>
              <ProgressBar value={xpPercent} color="#C8FF00" height={6} className="mt-3" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#2A2A30]">
            {[
              { label: 'Workouts', value: totalWorkouts, icon: '💪' },
              { label: 'Best Streak', value: `${streak.longestStreak}d`, icon: '🔥' },
              { label: 'Badges', value: unlocked.length, icon: '🏆' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="text-center">
                <p className="text-3xl mb-2 leading-none">{icon}</p>
                <p className="text-2xl font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</p>
                <p className="text-xs font-medium text-[#9A9AAC] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Unlocked achievements */}
        {unlocked.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest mb-4">Unlocked ({unlocked.length})</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {unlocked.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} unlocked />
              ))}
            </div>
          </div>
        )}

        {/* Locked achievements */}
        {locked.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest mb-4">In Progress ({locked.length})</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {locked.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} unlocked={false} />
              ))}
            </div>
          </div>
        )}
      </PageContent>
    </AppLayout>
  );
}

function AchievementCard({
  achievement,
  unlocked,
}: {
  achievement: {
    icon: string; title: string; description: string;
    requirement: number; progress: number; category: string; unlockedAt?: string;
  };
  unlocked: boolean;
}) {
  const pct = Math.min(Math.round((achievement.progress / achievement.requirement) * 100), 100);

  return (
    <Card className={cn('p-5 flex items-start gap-4', unlocked && 'border-[#C8FF00]/25')}>
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0',
          unlocked ? 'bg-[#C8FF00]/15' : 'bg-[#1E1E23] grayscale opacity-50'
        )}
      >
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={cn('text-sm font-bold', unlocked ? 'text-[#C8FF00]' : 'text-[#E0E0EA]')}>
            {achievement.title}
          </p>
          {unlocked && <span className="text-[#30D158] text-xs font-bold bg-[#30D158]/10 px-2 py-0.5 rounded-full">✓</span>}
        </div>
        <p className="text-sm text-[#9A9AAC] leading-snug">{achievement.description}</p>
        {!unlocked && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-[#7A7A8C] mb-1.5">
              <span>{achievement.progress} / {achievement.requirement}</span>
              <span className="font-bold">{pct}%</span>
            </div>
            <ProgressBar value={pct} color="#C8FF00" height={4} />
          </div>
        )}
        {unlocked && achievement.unlockedAt && (
          <p className="text-xs text-[#7A7A8C] mt-2">
            Unlocked {format(parseISO(achievement.unlockedAt), 'MMM d, yyyy')}
          </p>
        )}
      </div>
    </Card>
  );
}
