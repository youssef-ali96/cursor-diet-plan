import { AppLayout, PageHeader, PageContent } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { useInsights } from '@/hooks/useInsights';
import { useTrackingStore } from '@/store/trackingStore';
import { useUserStore } from '@/store/userStore';
import { calculateBMI, getBMICategory, formatWeight } from '@/lib/utils';
import { insightColors } from '@/components/ui/Badge';
import type { InsightType } from '@/types';
import { subWeeks, format, startOfWeek } from 'date-fns';

export function InsightsPage() {
  const insights = useInsights();
  const { workouts, weights, streak } = useTrackingStore();
  const { profile } = useUserStore();

  const bmi = profile ? calculateBMI(profile.currentWeightKg, profile.heightCm) : null;
  const bmiCat = bmi ? getBMICategory(bmi) : null;

  // Weight trend calc
  const recentWeights = weights.slice(0, 14);
  const weightTrend = recentWeights.length >= 2
    ? recentWeights[0].weightKg - recentWeights[recentWeights.length - 1].weightKg
    : 0;

  // Workout frequency this vs last week
  const thisWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const lastWeekStart = format(startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const lastWeekEnd = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  const thisWeekCount = workouts.filter((w) => w.completed && w.date >= thisWeekStart).length;
  const lastWeekCount = workouts.filter((w) => w.completed && w.date >= lastWeekStart && w.date <= lastWeekEnd).length;

  return (
    <AppLayout>
      <PageHeader title="Smart Insights" subtitle="AI-powered analysis of your fitness data" />

      <PageContent>
        {/* Body stats card */}
        {profile && (
          <Card className="p-6">
            <h3 className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest mb-5">Body Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Current Weight', value: formatWeight(profile.currentWeightKg), color: '#FF9F0A' },
                { label: 'Goal Weight', value: formatWeight(profile.goalWeightKg), color: '#30D158' },
                { label: 'To Go', value: formatWeight(Math.abs(profile.currentWeightKg - profile.goalWeightKg)), color: '#0A84FF' },
                { label: 'BMI', value: bmi ? `${bmi} (${bmiCat?.label})` : '--', color: bmiCat?.color ?? '#C8FF00' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-4 bg-[#1E1E23] rounded-2xl">
                  <p className="text-[11px] font-bold text-[#8A8A9C] uppercase tracking-widest mb-2">{label}</p>
                  <p className="text-base font-bold" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Trend summary */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-5 text-center">
            <p className="text-[11px] font-bold text-[#8A8A9C] uppercase tracking-widest mb-3">14-Day Weight Trend</p>
            <p className="text-4xl font-black leading-none" style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: weightTrend > 0 ? '#30D158' : weightTrend < 0 ? '#FF4560' : '#8A8A9C'
            }}>
              {weightTrend > 0 ? '−' : '+'}{Math.abs(weightTrend).toFixed(1)} kg
            </p>
            <p className="text-sm text-[#9A9AAC] mt-2">
              {weightTrend > 0 ? '✅ Losing weight' : weightTrend < 0 ? '📈 Gaining weight' : 'Stable'}
            </p>
          </Card>

          <Card className="p-5 text-center">
            <p className="text-[11px] font-bold text-[#8A8A9C] uppercase tracking-widest mb-3">Weekly Workouts</p>
            <p className="text-4xl font-black leading-none text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {thisWeekCount}
            </p>
            <p className="text-sm text-[#9A9AAC] mt-2">
              {thisWeekCount > lastWeekCount ? `+${thisWeekCount - lastWeekCount} vs last week` : thisWeekCount === lastWeekCount ? 'Same as last week' : `${lastWeekCount - thisWeekCount} less than last week`}
            </p>
          </Card>

          <Card className="p-5 text-center">
            <p className="text-[11px] font-bold text-[#8A8A9C] uppercase tracking-widest mb-3">Current Streak</p>
            <p className="text-4xl font-black leading-none text-[#FF9F0A]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {streak.currentStreak} 🔥
            </p>
            <p className="text-sm text-[#9A9AAC] mt-2">Best: {streak.longestStreak} days</p>
          </Card>
        </div>

        {/* Insights list */}
        <div>
          <h2 className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest mb-4">
            Generated Insights ({insights.length})
          </h2>
          <div className="space-y-3">
            {insights.map((insight, i) => {
              const color = insightColors[insight.type as InsightType];
              return (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: `${color}08`, borderColor: `${color}22` }}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{insight.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-bold" style={{ color }}>{insight.title}</p>
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {insight.type}
                      </span>
                    </div>
                    <p className="text-sm text-[#9A9AAC] mt-1.5 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              );
            })}

            {insights.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-3xl mb-3">📊</p>
                <p className="text-sm text-[#7A7A8C]">
                  Log data for a few days to unlock personalized insights
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <Card className="p-6">
          <h3 className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest mb-5">Recommendations</h3>
          <div className="space-y-3">
            {[
              { icon: '🥗', title: 'Track Every Meal', desc: 'Consistent meal logging is the #1 predictor of successful weight management.', color: '#30D158' },
              { icon: '💧', title: 'Hydration First', desc: 'Start your day with 500ml of water. Dehydration can be mistaken for hunger.', color: '#0A84FF' },
              { icon: '😴', title: 'Prioritize Sleep', desc: 'Aim for 7–9 hours. Poor sleep increases cortisol and slows metabolism.', color: '#BF5AF2' },
              { icon: '📈', title: 'Progressive Overload', desc: 'Increase weights by 2.5–5% every 1–2 weeks to keep making progress.', color: '#C8FF00' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="flex gap-4 p-4 rounded-2xl bg-[#1E1E23]">
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold" style={{ color }}>{title}</p>
                  <p className="text-sm text-[#9A9AAC] mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </PageContent>
    </AppLayout>
  );
}
