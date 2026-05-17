import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, User, Ruler, Target, Dumbbell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import type { Gender, ActivityLevel, TrainingExperience, UserProfile } from '@/types';
import { calculateBMI, getBMICategory } from '@/lib/utils';

const activityLabels: Record<ActivityLevel, { label: string; desc: string; icon: string }> = {
  sedentary: { label: 'Sedentary', desc: 'Little to no exercise', icon: '🪑' },
  light: { label: 'Light', desc: '1–3 days/week', icon: '🚶' },
  moderate: { label: 'Moderate', desc: '3–5 days/week', icon: '🏃' },
  active: { label: 'Active', desc: '6–7 days/week', icon: '⚡' },
  very_active: { label: 'Very Active', desc: 'Twice daily workouts', icon: '🔥' },
};

const experienceLabels: Record<TrainingExperience, { label: string; desc: string; icon: string }> = {
  beginner: { label: 'Beginner', desc: 'Just starting out', icon: '🌱' },
  intermediate: { label: 'Intermediate', desc: '1–3 years training', icon: '💪' },
  advanced: { label: 'Advanced', desc: '3+ years training', icon: '🏆' },
};

type FormData = {
  name: string;
  age: string;
  gender: Gender;
  heightCm: string;
  currentWeightKg: string;
  goalWeightKg: string;
  activityLevel: ActivityLevel;
  trainingExperience: TrainingExperience;
};

const steps = ['Welcome', 'Profile', 'Body', 'Goals', 'Experience'];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 60 : -60, opacity: 0 }),
};

export function OnboardingFlow() {
  const { setProfile } = useUserStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: '',
    age: '',
    gender: 'male',
    heightCm: '',
    currentWeightKg: '',
    goalWeightKg: '',
    activityLevel: 'moderate',
    trainingExperience: 'beginner',
  });

  const set = (key: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const finish = () => {
    const profile: Omit<UserProfile, 'id' | 'createdAt'> = {
      name: form.name || 'Athlete',
      age: parseInt(form.age) || 25,
      gender: form.gender,
      heightCm: parseFloat(form.heightCm) || 175,
      currentWeightKg: parseFloat(form.currentWeightKg) || 80,
      goalWeightKg: parseFloat(form.goalWeightKg) || 75,
      activityLevel: form.activityLevel,
      trainingExperience: form.trainingExperience,
      theme: 'dark',
    };
    setProfile(profile);
  };

  const bmi = form.heightCm && form.currentWeightKg
    ? calculateBMI(parseFloat(form.currentWeightKg), parseFloat(form.heightCm))
    : null;
  const bmiCat = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="min-h-screen bg-[#0F0F11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#C8FF00]/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0A84FF]/3 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i <= step ? '#C8FF00' : '#252529',
              }}
            />
          ))}
        </div>

        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {step === 0 && <WelcomeStep onNext={next} form={form} set={set} />}
            {step === 1 && <ProfileStep onNext={next} onBack={back} form={form} set={set} />}
            {step === 2 && <BodyStep onNext={next} onBack={back} form={form} set={set} bmi={bmi} bmiCat={bmiCat} />}
            {step === 3 && <GoalsStep onNext={next} onBack={back} form={form} set={set} />}
            {step === 4 && <ExperienceStep onFinish={finish} onBack={back} form={form} set={set} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Step 0: Welcome ──────────────────────────────────────────────────────────

function WelcomeStep({ onNext, form, set }: {
  onNext: () => void; form: FormData; set: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-[#C8FF00] flex items-center justify-center mx-auto">
        <Zap size={36} className="text-[#0F0F11]" />
      </div>
      <div>
        <h1
          className="text-5xl font-black text-[#F0F0F5] uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.01em' }}
        >
          Welcome to <span className="text-[#C8FF00]">FitForge</span>
        </h1>
        <p className="text-[#7A7A8C] mt-3 text-base">
          Your personal fitness command center. Let's set up your profile to personalize your experience.
        </p>
      </div>

      <div className="bg-[#17171A] border border-[#2A2A30] rounded-2xl p-6 text-left space-y-3">
        <Input
          label="What should we call you?"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="text-lg"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: '📊', text: 'Track Progress' },
          { icon: '🏆', text: 'Hit Goals' },
          { icon: '🔥', text: 'Build Streaks' },
        ].map(({ icon, text }) => (
          <div key={text} className="bg-[#17171A] border border-[#2A2A30] rounded-xl p-3">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs font-medium text-[#7A7A8C]">{text}</div>
          </div>
        ))}
      </div>

      <Button onClick={onNext} size="lg" className="w-full gap-2">
        Let's Go <ArrowRight size={18} />
      </Button>
    </div>
  );
}

// ─── Step 1: Profile ──────────────────────────────────────────────────────────

function ProfileStep({ onNext, onBack, form, set }: {
  onNext: () => void; onBack: () => void; form: FormData; set: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center">
          <User size={20} className="text-[#C8FF00]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#F0F0F5] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Your Profile</h2>
          <p className="text-sm text-[#7A7A8C]">Basic info for personalization</p>
        </div>
      </div>

      <div className="bg-[#17171A] border border-[#2A2A30] rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Age" type="number" placeholder="25" value={form.age} onChange={(e) => set('age', e.target.value)} min="10" max="100" />
          <Select label="Gender" value={form.gender} onChange={(e) => set('gender', e.target.value as Gender)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} size="lg" className="w-full">
          <ArrowLeft size={18} /> Back
        </Button>
        <Button onClick={onNext} size="lg" className="w-full">
          Continue <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2: Body ─────────────────────────────────────────────────────────────

function BodyStep({ onNext, onBack, form, set, bmi, bmiCat }: {
  onNext: () => void; onBack: () => void; form: FormData;
  set: (k: keyof FormData, v: string) => void;
  bmi: number | null; bmiCat: { label: string; color: string } | null;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center">
          <Ruler size={20} className="text-[#C8FF00]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#F0F0F5] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Body Metrics</h2>
          <p className="text-sm text-[#7A7A8C]">Used for calorie & goal calculations</p>
        </div>
      </div>

      <div className="bg-[#17171A] border border-[#2A2A30] rounded-2xl p-5 space-y-4">
        <Input label="Height (cm)" type="number" placeholder="175" value={form.heightCm} onChange={(e) => set('heightCm', e.target.value)} />
        <Input label="Current Weight (kg)" type="number" placeholder="80.0" step="0.1" value={form.currentWeightKg} onChange={(e) => set('currentWeightKg', e.target.value)} />

        {bmi && bmiCat && (
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${bmiCat.color}15`, border: `1px solid ${bmiCat.color}30` }}>
            <span className="text-xs font-semibold text-[#7A7A8C]">Your BMI</span>
            <span className="text-sm font-bold" style={{ color: bmiCat.color }}>{bmi} — {bmiCat.label}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} size="lg" className="w-full">
          <ArrowLeft size={18} /> Back
        </Button>
        <Button onClick={onNext} size="lg" className="w-full">
          Continue <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: Goals ────────────────────────────────────────────────────────────

function GoalsStep({ onNext, onBack, form, set }: {
  onNext: () => void; onBack: () => void; form: FormData; set: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center">
          <Target size={20} className="text-[#C8FF00]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#F0F0F5] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Your Goal</h2>
          <p className="text-sm text-[#7A7A8C]">Where do you want to be?</p>
        </div>
      </div>

      <div className="bg-[#17171A] border border-[#2A2A30] rounded-2xl p-5 space-y-4">
        <Input label="Goal Weight (kg)" type="number" placeholder="75.0" step="0.1" value={form.goalWeightKg} onChange={(e) => set('goalWeightKg', e.target.value)} />

        <div className="space-y-2">
          <p className="text-xs font-medium text-[#7A7A8C] uppercase tracking-wider">Activity Level</p>
          <div className="space-y-2">
            {(Object.entries(activityLabels) as [ActivityLevel, typeof activityLabels[ActivityLevel]][]).map(([key, { label, desc, icon }]) => (
              <button
                key={key}
                type="button"
                onClick={() => set('activityLevel', key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  form.activityLevel === key
                    ? 'border-[#C8FF00]/60 bg-[#C8FF00]/10'
                    : 'border-[#2A2A30] hover:border-[#3A3A45] bg-[#1E1E23]'
                }`}
              >
                <span className="text-xl">{icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${form.activityLevel === key ? 'text-[#C8FF00]' : 'text-[#F0F0F5]'}`}>{label}</p>
                  <p className="text-xs text-[#7A7A8C]">{desc}</p>
                </div>
                {form.activityLevel === key && <Check size={16} className="ml-auto text-[#C8FF00]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} size="lg" className="w-full">
          <ArrowLeft size={18} /> Back
        </Button>
        <Button onClick={onNext} size="lg" className="w-full">
          Continue <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 4: Experience ───────────────────────────────────────────────────────

function ExperienceStep({ onFinish, onBack, form, set }: {
  onFinish: () => void; onBack: () => void; form: FormData; set: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center">
          <Dumbbell size={20} className="text-[#C8FF00]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#F0F0F5] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Experience</h2>
          <p className="text-sm text-[#7A7A8C]">How long have you been training?</p>
        </div>
      </div>

      <div className="space-y-3">
        {(Object.entries(experienceLabels) as [TrainingExperience, typeof experienceLabels[TrainingExperience]][]).map(([key, { label, desc, icon }]) => (
          <button
            key={key}
            type="button"
            onClick={() => set('trainingExperience', key)}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${
              form.trainingExperience === key
                ? 'border-[#C8FF00]/60 bg-[#C8FF00]/8'
                : 'border-[#2A2A30] hover:border-[#3A3A45] bg-[#17171A]'
            }`}
          >
            <span className="text-3xl">{icon}</span>
            <div>
              <p className={`text-base font-bold ${form.trainingExperience === key ? 'text-[#C8FF00]' : 'text-[#F0F0F5]'}`}>{label}</p>
              <p className="text-sm text-[#7A7A8C]">{desc}</p>
            </div>
            {form.trainingExperience === key && (
              <div className="ml-auto w-6 h-6 rounded-full bg-[#C8FF00] flex items-center justify-center">
                <Check size={14} className="text-[#0F0F11]" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-[#17171A] border border-[#2A2A30] rounded-2xl p-4 text-center">
        <p className="text-sm text-[#7A7A8C]">Ready to start your transformation?</p>
        <p className="text-xs text-[#4A4A5A] mt-1">All data is stored locally on your device</p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} size="lg" className="w-full">
          <ArrowLeft size={18} /> Back
        </Button>
        <Button onClick={onFinish} size="lg" className="w-full gap-2">
          Start Training <Zap size={18} />
        </Button>
      </div>
    </div>
  );
}
