import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { today, genId } from '@/lib/utils';
import type { WorkoutType, WorkoutIntensity, MealType } from '@/types';
import { Plus, Minus } from 'lucide-react';

type QuickType = 'workout' | 'meal' | 'weight' | 'steps' | 'water' | null;

interface Props {
  type: QuickType;
  onClose: () => void;
}

export function QuickAddModal({ type, onClose }: Props) {
  const titles: Record<NonNullable<QuickType>, string> = {
    workout: 'Log Workout',
    meal: 'Log Meal',
    weight: 'Log Weight',
    steps: 'Log Steps',
    water: 'Add Water',
  };

  return (
    <Modal open={!!type} onClose={onClose} title={type ? titles[type] : ''} size="md">
      {type === 'workout' && <WorkoutForm onClose={onClose} />}
      {type === 'meal' && <MealForm onClose={onClose} />}
      {type === 'weight' && <WeightForm onClose={onClose} />}
      {type === 'steps' && <StepsForm onClose={onClose} />}
      {type === 'water' && <WaterForm onClose={onClose} />}
    </Modal>
  );
}

function WorkoutForm({ onClose }: { onClose: () => void }) {
  const { addWorkout } = useTrackingStore();
  const { addXP } = useGoalsStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkoutType>('strength');
  const [duration, setDuration] = useState('45');
  const [intensity, setIntensity] = useState<WorkoutIntensity>('moderate');
  const [calories, setCalories] = useState('');

  const submit = () => {
    addWorkout({
      date: today(),
      type,
      name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Session`,
      durationMin: parseInt(duration) || 45,
      intensity,
      exercises: [],
      caloriesBurned: calories ? parseInt(calories) : undefined,
      completed: true,
    });
    addXP(50);
    onClose();
  };

  return (
    <div className="space-y-4">
      <Input label="Workout Name" placeholder="e.g. Upper Body Power" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value as WorkoutType)}>
          {(['strength', 'cardio', 'hiit', 'yoga', 'running', 'cycling', 'swimming', 'sports', 'other'] as WorkoutType[]).map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </Select>
        <Select label="Intensity" value={intensity} onChange={(e) => setIntensity(e.target.value as WorkoutIntensity)}>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="max">Max</option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Duration (min)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Input label="Calories Burned" type="number" placeholder="Optional" value={calories} onChange={(e) => setCalories(e.target.value)} />
      </div>
      <Button onClick={submit} size="lg" className="w-full">Log Workout +50 XP</Button>
    </div>
  );
}

function MealForm({ onClose }: { onClose: () => void }) {
  const { addMeal } = useTrackingStore();
  const { addXP } = useGoalsStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<MealType>('lunch');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const submit = () => {
    const cal = parseInt(calories) || 0;
    addMeal({
      date: today(),
      type,
      items: [{
        id: genId(),
        name: name || 'Meal',
        calories: cal,
        proteinG: parseInt(protein) || 0,
        carbsG: parseInt(carbs) || 0,
        fatG: parseInt(fat) || 0,
        servingSize: '1 serving',
        quantity: 1,
      }],
      totalCalories: cal,
    });
    addXP(20);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Food Name" placeholder="e.g. Chicken Rice" value={name} onChange={(e) => setName(e.target.value)} />
        <Select label="Meal Type" value={type} onChange={(e) => setType(e.target.value as MealType)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </Select>
      </div>
      <Input label="Calories (kcal)" type="number" placeholder="500" value={calories} onChange={(e) => setCalories(e.target.value)} />
      <div className="grid grid-cols-3 gap-3">
        <Input label="Protein (g)" type="number" placeholder="30" value={protein} onChange={(e) => setProtein(e.target.value)} />
        <Input label="Carbs (g)" type="number" placeholder="50" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        <Input label="Fat (g)" type="number" placeholder="15" value={fat} onChange={(e) => setFat(e.target.value)} />
      </div>
      <Button onClick={submit} size="lg" className="w-full">Log Meal +20 XP</Button>
    </div>
  );
}

function WeightForm({ onClose }: { onClose: () => void }) {
  const { addWeight } = useTrackingStore();
  const { addXP } = useGoalsStore();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const submit = () => {
    if (!weight) return;
    addWeight({
      date: today(),
      weightKg: parseFloat(weight),
      bodyFatPercent: bodyFat ? parseFloat(bodyFat) : undefined,
    });
    addXP(10);
    onClose();
  };

  return (
    <div className="space-y-4">
      <Input label="Weight (kg)" type="number" step="0.1" placeholder="80.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <Input label="Body Fat % (optional)" type="number" step="0.1" placeholder="18.5" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} />
      <Button onClick={submit} size="lg" className="w-full" disabled={!weight}>Log Weight</Button>
    </div>
  );
}

function StepsForm({ onClose }: { onClose: () => void }) {
  const { updateDailyMetrics, getDailyMetrics } = useTrackingStore();
  const { addXP } = useGoalsStore();
  const current = getDailyMetrics(today());
  const [steps, setSteps] = useState(current.steps.toString());

  const submit = () => {
    updateDailyMetrics(today(), { steps: parseInt(steps) || 0 });
    addXP(5);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <p className="text-xs text-[#7A7A8C] mb-2">CURRENT STEPS</p>
        <p className="text-5xl font-black text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {parseInt(steps).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setSteps(String(Math.max(0, parseInt(steps || '0') - 500)))}
        >
          <Minus size={16} />
        </Button>
        <Input
          type="number"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="flex-1 text-center text-lg font-bold"
        />
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setSteps(String(parseInt(steps || '0') + 500))}
        >
          <Plus size={16} />
        </Button>
      </div>
      <Button onClick={submit} size="lg" className="w-full">Update Steps</Button>
    </div>
  );
}

function WaterForm({ onClose }: { onClose: () => void }) {
  const { updateDailyMetrics, getDailyMetrics } = useTrackingStore();
  const { addXP } = useGoalsStore();
  const current = getDailyMetrics(today());

  const add = (ml: number) => {
    updateDailyMetrics(today(), { waterMl: current.waterMl + ml });
    addXP(2);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-2">
        <p className="text-xs text-[#7A7A8C] mb-2">TODAY'S INTAKE</p>
        <p className="text-4xl font-black text-[#0A84FF]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {(current.waterMl / 1000).toFixed(2)}L
        </p>
        <p className="text-sm text-[#7A7A8C] mt-1">Goal: {(current.waterGoalMl / 1000).toFixed(1)}L</p>
      </div>
      <p className="text-xs text-[#7A7A8C] text-center uppercase tracking-wider">Quick Add</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '1 Glass', ml: 250, icon: '🥛' },
          { label: '1 Bottle', ml: 500, icon: '🍶' },
          { label: '1 Large', ml: 750, icon: '💧' },
          { label: '1 Liter', ml: 1000, icon: '🫧' },
        ].map(({ label, ml, icon }) => (
          <button
            key={label}
            onClick={() => add(ml)}
            className="flex items-center gap-3 p-4 rounded-xl border border-[#2A2A30] bg-[#1E1E23] hover:border-[#0A84FF]/50 hover:bg-[#0A84FF]/10 transition-all text-left"
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-sm font-semibold text-[#F0F0F5]">{label}</p>
              <p className="text-xs text-[#7A7A8C]">{ml}ml</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
