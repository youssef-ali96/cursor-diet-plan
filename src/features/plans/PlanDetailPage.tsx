import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, BarChart3, ChevronDown, ChevronUp, Dumbbell, Salad, BookOpen, FlaskConical, CheckCircle2, Star, Youtube } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { gptPlan } from '@/data/gptPlan';
import type { FitnessPlan, PlanDay, PlanExercise } from '@/data/gptPlan';
import { cn } from '@/lib/utils';

const plans: Record<string, FitnessPlan> = {
  'gpt-plan': gptPlan,
};

export function PlanDetailPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const plan = plans[planId ?? ''];

  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'rules'>('workout');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  if (!plan) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-[#7A7A8C]">Plan not found.</p>
          <Button onClick={() => navigate('/plans')}>Back to Plans</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={plan.coverImage}
            alt={plan.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/60 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate('/plans')}
            className="absolute top-4 left-4 sm:left-6 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge label={plan.difficulty} color="#C8FF00" />
              <Badge label={plan.goal} color="#0A84FF" />
            </div>
            <h1
              className="text-4xl sm:text-5xl font-black text-white uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.01em' }}
            >
              {plan.title}
            </h1>
            <p className="text-[#C8FF00] text-sm font-semibold mt-1">{plan.subtitle}</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Clock size={16} />, label: 'Duration', value: plan.duration, color: '#C8FF00' },
              { icon: <BarChart3 size={16} />, label: 'Level', value: plan.difficulty, color: '#FF9F0A' },
              { icon: <Target size={16} />, label: 'Goal', value: plan.goal.split(' + ')[0], color: '#30D158' },
            ].map(({ icon, label, value, color }) => (
              <Card key={label} className="p-3 text-center">
                <div className="flex justify-center mb-1" style={{ color }}>{icon}</div>
                <p className="text-xs text-[#7A7A8C]">{label}</p>
                <p className="text-sm font-bold text-[#F0F0F5] mt-0.5">{value}</p>
              </Card>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-[#7A7A8C] leading-relaxed">{plan.description}</p>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#17171A] border border-[#2A2A30] rounded-xl p-1">
            {[
              { id: 'workout', label: 'Workout', icon: <Dumbbell size={14} /> },
              { id: 'diet', label: 'Diet', icon: <Salad size={14} /> },
              { id: 'rules', label: 'Rules', icon: <BookOpen size={14} /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all',
                  activeTab === id
                    ? 'bg-[#C8FF00] text-[#0F0F11]'
                    : 'text-[#7A7A8C] hover:text-[#F0F0F5]'
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Workout */}
          {activeTab === 'workout' && (
            <div className="space-y-3">
              {plan.days.map((day) => (
                <DayCard
                  key={day.day}
                  day={day}
                  expanded={expandedDay === day.day}
                  onToggle={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                />
              ))}
            </div>
          )}

          {/* Tab: Diet */}
          {activeTab === 'diet' && <DietTab plan={plan} />}

          {/* Tab: Rules */}
          {activeTab === 'rules' && <RulesTab plan={plan} />}
        </div>
      </div>
    </AppLayout>
  );
}

// ─── Day Card ─────────────────────────────────────────────────────────────────

function DayCard({ day, expanded, onToggle }: {
  day: PlanDay; expanded: boolean; onToggle: () => void;
}) {
  const totalExercises = day.blocks.reduce((a, b) => a + b.exercises.length, 0);

  return (
    <Card className={cn('overflow-hidden transition-all', expanded && 'border-[#C8FF00]/20')}>
      {/* Day header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#1E1E23] transition-colors"
      >
        {/* Day thumbnail */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
          <img src={day.image} alt={day.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div
            className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-black text-white"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            DAY {day.day}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-sm font-black text-[#F0F0F5]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Day {day.day}
            </span>
            <Badge label={day.badge} color={day.badgeColor} size="sm" />
          </div>
          <p className="text-base font-bold text-[#F0F0F5]">{day.title}</p>
          {day.type === 'rest' ? (
            <p className="text-xs text-[#30D158] mt-0.5">Active recovery day</p>
          ) : (
            <p className="text-xs text-[#7A7A8C] mt-0.5">{totalExercises} exercises · {day.blocks.length} blocks</p>
          )}
        </div>

        <div className="shrink-0 text-[#7A7A8C]">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-[#2A2A30]">
          {day.blocks.map((block, bi) => (
            <div key={bi} className="p-4">
              {/* Block label */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
                style={{ backgroundColor: `${block.color}15`, color: block.color }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: block.color }} />
                {block.label}
              </div>

              {/* Exercise list */}
              <div className="space-y-3">
                {block.exercises.map((ex, ei) => (
                  <ExerciseCard key={ei} exercise={ex} blockColor={block.color} />
                ))}
              </div>
            </div>
          ))}

          {/* Finisher */}
          {day.finisher && (
            <div className="mx-4 mb-4 flex items-center gap-3 p-3 rounded-xl bg-[#C8FF00]/8 border border-[#C8FF00]/20">
              <span className="text-xl">🏁</span>
              <div>
                <p className="text-xs font-bold text-[#C8FF00] uppercase tracking-wider">Finisher</p>
                <p className="text-sm text-[#F0F0F5] font-medium">{day.finisher}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, blockColor }: { exercise: PlanExercise; blockColor: string }) {
  const [imgError, setImgError] = useState(false);

  // Map muscle group to an emoji for clean fallback
  const fallbackEmoji: Record<string, string> = {
    'Chest / Triceps': '💪', 'Shoulders': '🏋️', 'Triceps / Chest': '💪',
    'Back / Biceps': '🔙', 'Shoulders / Triceps': '🏋️', 'Full Body / Cardio': '🔥',
    'Core / Cardio': '⚡', 'Full Body': '🔥', 'Legs / Glutes': '🦵',
    'Quads / Glutes': '🦵', 'Glutes / Hamstrings': '🦵', 'Calves': '🦵',
    'Core': '🎯', 'Lower Abs': '🎯', 'Obliques': '🎯', 'Abs / Obliques': '🎯',
    'Low-intensity cardio': '🚶', 'Mobility / Flexibility': '🧘',
    'Triceps': '💪', 'Biceps': '💪', 'Back': '🔙', 'Legs': '🦵',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1E1E23] hover:bg-[#252529] transition-colors">
      {/* Image */}
      <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: `${blockColor}15` }}>
        {!imgError ? (
          <img
            src={exercise.image}
            alt={exercise.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {fallbackEmoji[exercise.muscleGroup] ?? '💪'}
          </div>
        )}
        {!imgError && <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#F0F0F5]">{exercise.name}</p>
        <p className="text-[11px] font-medium mt-0.5" style={{ color: blockColor }}>
          {exercise.muscleGroup}
        </p>

        {/* Sets / reps / duration chips */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {exercise.sets && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2A2A30] text-[#F0F0F5]">
              {exercise.sets} sets
            </span>
          )}
          {exercise.reps && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2A2A30] text-[#F0F0F5]">
              {exercise.reps}
            </span>
          )}
          {exercise.duration && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2A2A30] text-[#F0F0F5]">
              ⏱ {exercise.duration}
            </span>
          )}
        </div>

        {exercise.note && (
          <p className="text-[11px] text-[#7A7A8C] mt-1.5 italic">💡 {exercise.note}</p>
        )}

        {exercise.videoUrl && (
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors"
            style={{ backgroundColor: '#FF000020', color: '#FF4545' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FF000035'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#FF000020'; }}
          >
            <Youtube size={11} />
            Watch Tutorial
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Diet Tab ────────────────────────────────────────────────────────────────

function DietTab({ plan }: { plan: FitnessPlan }) {
  return (
    <div className="space-y-4">
      {plan.meals.map((meal) => (
        <Card key={meal.id} className="overflow-hidden">
          {/* Meal header */}
          <div className="p-4 border-b border-[#2A2A30]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{meal.icon}</span>
              <div>
                <p className="text-base font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {meal.title}
                </p>
                <p className="text-xs text-[#7A7A8C]">{meal.timing}</p>
              </div>
            </div>
            {meal.note && (
              <div
                className="mt-3 text-xs font-semibold px-3 py-2 rounded-xl"
                style={{
                  backgroundColor: meal.note.includes('🚫') ? '#FF456015' : '#C8FF0010',
                  color: meal.note.includes('🚫') ? '#FF4560' : '#C8FF00',
                }}
              >
                {meal.note}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="p-4 space-y-3">
            <p className="text-[10px] font-bold text-[#7A7A8C] uppercase tracking-widest">Choose one option:</p>
            {meal.options.map((opt, i) => (
              <FoodOptionCard key={i} option={opt} />
            ))}

            {/* Carb options */}
            {meal.carbs && (
              <div className="mt-3">
                <p className="text-[10px] font-bold text-[#7A7A8C] uppercase tracking-widest mb-2">+ Choose one carb:</p>
                <div className="flex flex-wrap gap-2">
                  {meal.carbs.map((carb) => (
                    <span
                      key={carb}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/20"
                    >
                      {carb}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function FoodOptionCard({ option }: { option: { name: string; image: string; calories: number; protein: number } }) {
  const [imgError, setImgError] = useState(false);

  const foodEmoji = (name: string) => {
    if (name.toLowerCase().includes('egg')) return '🥚';
    if (name.toLowerCase().includes('chicken')) return '🍗';
    if (name.toLowerCase().includes('oat')) return '🥣';
    if (name.toLowerCase().includes('tuna')) return '🐟';
    if (name.toLowerCase().includes('beef')) return '🥩';
    if (name.toLowerCase().includes('apple') || name.toLowerCase().includes('banana')) return '🍎';
    if (name.toLowerCase().includes('almond') || name.toLowerCase().includes('peanut')) return '🥜';
    return '🥗';
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1E1E23] hover:bg-[#252529] transition-colors">
      <div className="w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-[#252529]">
        {!imgError ? (
          <img
            src={option.image}
            alt={option.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {foodEmoji(option.name)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#F0F0F5]">{option.name}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[11px] text-[#FF9F0A] font-bold">{option.calories} kcal</span>
          <span className="text-[11px] text-[#30D158] font-bold">{option.protein}g protein</span>
        </div>
      </div>
    </div>
  );
}

// ─── Rules Tab ────────────────────────────────────────────────────────────────

function RulesTab({ plan }: { plan: FitnessPlan }) {
  return (
    <div className="space-y-4">
      {/* Important rules */}
      <div>
        <p className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-3">Important Rules</p>
        <div className="space-y-3">
          {plan.rules.map((rule) => (
            <div key={rule.title} className="flex gap-3 p-4 bg-[#17171A] border border-[#2A2A30] rounded-2xl">
              <span className="text-2xl shrink-0">{rule.icon}</span>
              <div>
                <p className="text-sm font-bold text-[#F0F0F5]">{rule.title}</p>
                <p className="text-sm text-[#7A7A8C] mt-1 leading-relaxed">{rule.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplements */}
      <div>
        <p className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-3">
          Supplements <span className="text-[#4A4A5A] font-normal normal-case">(100% optional)</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          {plan.supplements.map((supp) => (
            <div key={supp.name} className="p-4 bg-[#17171A] border border-[#2A2A30] rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical size={16} className="text-[#BF5AF2]" />
                <p className="text-sm font-bold text-[#F0F0F5]">{supp.name}</p>
              </div>
              <p className="text-xs text-[#7A7A8C]">{supp.dose}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#7A7A8C]/10 text-[#7A7A8C]">
                Optional
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly schedule overview */}
      <Card className="p-5">
        <p className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-4">Weekly Schedule</p>
        <div className="grid grid-cols-5 gap-2">
          {plan.days.map((day) => (
            <div
              key={day.day}
              className="flex flex-col items-center p-3 rounded-xl text-center"
              style={{
                backgroundColor: day.type === 'rest' ? '#30D15815' : `${day.badgeColor}12`,
                border: `1px solid ${day.type === 'rest' ? '#30D15830' : `${day.badgeColor}30`}`,
              }}
            >
              <p
                className="text-lg font-black"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: day.type === 'rest' ? '#30D158' : day.badgeColor,
                }}
              >
                {day.day}
              </p>
              <p className="text-[9px] text-[#7A7A8C] font-semibold uppercase mt-0.5 leading-tight">
                {day.type === 'rest' ? 'Rest' : day.title.split(' ')[0]}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
