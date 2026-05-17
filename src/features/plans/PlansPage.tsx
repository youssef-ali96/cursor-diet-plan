import { useNavigate } from 'react-router-dom';
import { Clock, Target, BarChart3, ArrowRight, Star } from 'lucide-react';
import { AppLayout, PageHeader } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { gptPlan } from '@/data/gptPlan';
import type { FitnessPlan } from '@/data/gptPlan';

const allPlans: FitnessPlan[] = [gptPlan];

export function PlansPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <PageHeader
        title="Training Plans"
        subtitle="Structured programs to follow week by week"
      />

      <div className="p-6 space-y-4">
        {allPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onClick={() => navigate(`/plans/${plan.id}`)} />
        ))}
      </div>
    </AppLayout>
  );
}

function PlanCard({ plan, onClick }: { plan: FitnessPlan; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group"
    >
      <div className="relative rounded-2xl overflow-hidden border border-[#2A2A30] hover:border-[#C8FF00]/30 transition-all hover:-translate-y-0.5 duration-200">
        {/* Cover image */}
        <div className="relative h-48 sm:h-56">
          <img
            src={plan.coverImage}
            alt={plan.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/50 to-transparent" />

          {/* Featured badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C8FF00] text-[#0F0F11] text-xs font-bold">
            <Star size={12} fill="currentColor" />
            Featured Plan
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge label={plan.difficulty} color="#C8FF00" />
              <Badge label={plan.goal} color="#0A84FF" />
            </div>
            <h2
              className="text-3xl font-black text-white uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {plan.title}
            </h2>
            <p className="text-[#C8FF00] text-sm font-semibold">{plan.subtitle}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#17171A] p-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-xs text-[#7A7A8C]">
              <Clock size={13} />
              <span>{plan.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#7A7A8C]">
              <BarChart3 size={13} />
              <span>{plan.difficulty}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#7A7A8C]">
              <Target size={13} />
              <span>{plan.days.length} days</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#C8FF00]">
            View Plan <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </button>
  );
}
