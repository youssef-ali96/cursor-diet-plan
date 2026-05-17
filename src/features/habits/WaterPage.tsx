import { AppLayout, PageHeader, PageContent } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularProgress, ProgressBar } from '@/components/ui/Progress';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { today, formatWater, calcProgress } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { Plus, Minus } from 'lucide-react';

const glasses = [
  { label: 'Small', icon: '🥛', ml: 200 },
  { label: 'Glass', icon: '💧', ml: 250 },
  { label: 'Bottle', icon: '🍶', ml: 500 },
  { label: 'Large', icon: '🫧', ml: 750 },
];

export function WaterPage() {
  const { getDailyMetrics, updateDailyMetrics } = useTrackingStore();
  const { addXP } = useGoalsStore();

  const todayStr = today();
  const metrics = getDailyMetrics(todayStr);
  const pct = calcProgress(metrics.waterMl, metrics.waterGoalMl);
  const fillLevel = Math.min(pct, 100);

  const addWater = (ml: number) => {
    updateDailyMetrics(todayStr, { waterMl: Math.max(0, metrics.waterMl + ml) });
    if (ml > 0) addXP(2);
  };

  // Last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const m = getDailyMetrics(date);
    return { date, label: format(subDays(new Date(), 6 - i), 'EEE'), waterMl: m.waterMl, goalMl: m.waterGoalMl };
  });

  return (
    <AppLayout>
      <PageHeader title="Water Tracker" subtitle="Stay hydrated, stay sharp" />

      <PageContent>
        {/* Main water display */}
        <Card glow className="p-6 flex flex-col items-center text-center gap-4">
          <div className="relative">
            {/* Bottle visualization */}
            <div className="w-32 h-48 border-2 border-[#0A84FF]/40 rounded-[32px] overflow-hidden relative bg-[#1E1E23]">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
                style={{
                  height: `${fillLevel}%`,
                  background: `linear-gradient(to top, #0A84FF, #5AC8FA80)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                  <p className="text-3xl font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {(metrics.waterMl / 1000).toFixed(2)}
                  </p>
                  <p className="text-xs text-white/70 font-semibold">LITERS</p>
                </div>
              </div>
            </div>
            {/* Level markers */}
            <div className="absolute right-[-24px] top-0 h-full flex flex-col justify-between py-2">
              {[100, 75, 50, 25, 0].map((v) => (
                <div key={v} className="flex items-center gap-1">
                  <div className="w-2 h-px bg-[#2A2A30]" />
                  <span className="text-[9px] text-[#8A8A9C]">{v}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-base font-semibold text-[#B0B0BC]">
              {metrics.waterMl}ml <span className="text-[#7A7A8C]">of</span> {metrics.waterGoalMl}ml daily goal
            </p>
            {pct >= 100 ? (
              <p className="text-[#30D158] font-bold mt-1.5">🎉 Goal Reached!</p>
            ) : (
              <p className="text-sm text-[#9A9AAC] mt-1.5">
                {metrics.waterGoalMl - metrics.waterMl}ml remaining
              </p>
            )}
          </div>

          {/* Manual adjust */}
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => addWater(-250)}
              disabled={metrics.waterMl === 0}
            >
              <Minus size={16} />
            </Button>
            <span className="text-xs text-[#7A7A8C] w-16 text-center">Adjust 250ml</span>
            <Button variant="secondary" size="icon" onClick={() => addWater(250)}>
              <Plus size={16} />
            </Button>
          </div>
        </Card>

        {/* Quick add buttons */}
        <div>
          <p className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest mb-4">Quick Add</p>
          <div className="grid grid-cols-4 gap-4">
            {glasses.map(({ label, icon, ml }) => (
              <button
                key={label}
                onClick={() => addWater(ml)}
                className="flex flex-col items-center gap-3 p-5 bg-[#17171A] border border-[#2A2A30] rounded-2xl hover:border-[#0A84FF]/50 hover:bg-[#0A84FF]/5 transition-all active:scale-95"
              >
                <span className="text-3xl leading-none">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#F0F0F5] text-center">{label}</p>
                  <p className="text-xs text-[#8A8A9C] text-center mt-0.5">{ml}ml</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 7-day history */}
        <Card className="p-6">
          <p className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest mb-5">7-Day History</p>
          <div className="flex items-end gap-3 h-32">
            {last7.map(({ label, waterMl, goalMl }) => {
              const barPct = Math.min((waterMl / Math.max(goalMl, 1)) * 100, 100);
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 bg-[#1E1E23] rounded-xl overflow-hidden flex flex-col justify-end">
                    <div
                      className="w-full rounded-xl transition-all duration-700"
                      style={{
                        height: `${Math.max(barPct, 5)}%`,
                        background: barPct >= 100
                          ? '#30D158'
                          : barPct >= 60
                          ? '#0A84FF'
                          : '#0A84FF40',
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#8A8A9C]">{label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-5 mt-4 text-xs text-[#9A9AAC]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#0A84FF]" /> Partial
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#30D158]" /> Goal met
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-6 border-[#0A84FF]/20 bg-[#0A84FF]/5">
          <p className="text-xs font-bold text-[#0A84FF] uppercase tracking-widest mb-4">Hydration Tips</p>
          <div className="space-y-4">
            {[
              '💧 Drink 500ml immediately after waking up',
              '🏋️ Add 500ml for every hour of intense exercise',
              '☀️ Add 250ml on hot days or high-sweat activities',
              '⏰ Set an hourly reminder: drink one glass every hour',
            ].map((tip) => (
              <p key={tip} className="text-sm text-[#B0B0BC] leading-relaxed">{tip}</p>
            ))}
          </div>
        </Card>
      </PageContent>
    </AppLayout>
  );
}
