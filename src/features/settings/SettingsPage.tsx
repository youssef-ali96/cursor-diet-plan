import { useState } from 'react';
import { AppLayout, PageHeader } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { calculateBMI, getBMICategory, calculateTDEE } from '@/lib/utils';
import type { ActivityLevel, TrainingExperience, Gender } from '@/types';
import { Save, RotateCcw, LogOut, Download } from 'lucide-react';

export function SettingsPage() {
  const { profile, updateProfile, resetOnboarding } = useUserStore();
  const { workouts, meals, weights } = useTrackingStore();
  const { userLevel } = useGoalsStore();

  const [form, setForm] = useState({
    name: profile?.name ?? '',
    age: profile?.age?.toString() ?? '',
    gender: profile?.gender ?? 'male',
    heightCm: profile?.heightCm?.toString() ?? '',
    currentWeightKg: profile?.currentWeightKg?.toString() ?? '',
    goalWeightKg: profile?.goalWeightKg?.toString() ?? '',
    activityLevel: profile?.activityLevel ?? 'moderate',
    trainingExperience: profile?.trainingExperience ?? 'beginner',
  });

  const [saved, setSaved] = useState(false);

  const bmi = form.heightCm && form.currentWeightKg
    ? calculateBMI(parseFloat(form.currentWeightKg), parseFloat(form.heightCm))
    : null;
  const bmiCat = bmi ? getBMICategory(bmi) : null;

  const handleSave = () => {
    updateProfile({
      name: form.name,
      age: parseInt(form.age),
      gender: form.gender as Gender,
      heightCm: parseFloat(form.heightCm),
      currentWeightKg: parseFloat(form.currentWeightKg),
      goalWeightKg: parseFloat(form.goalWeightKg),
      activityLevel: form.activityLevel as ActivityLevel,
      trainingExperience: form.trainingExperience as TrainingExperience,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = () => {
    const data = { profile, workouts, meals, weights };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitforge-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <AppLayout>
      <PageHeader title="Settings" subtitle="Manage your profile and preferences" />

      <div className="p-6 space-y-6 max-w-2xl">
        {/* Profile overview */}
        {profile && (
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8FF00] to-[#30D158] flex items-center justify-center text-2xl font-black text-[#0F0F11]">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-black text-[#F0F0F5]">{profile.name}</p>
                <p className="text-sm text-[#7A7A8C]">Level {userLevel.level} · {userLevel.title}</p>
                <p className="text-xs text-[#4A4A5A] mt-0.5">{workouts.length} workouts · {meals.length} meals logged</p>
              </div>
            </div>
          </Card>
        )}

        {/* Edit profile */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#F0F0F5]">Edit Profile</h3>

          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Age" type="number" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
            <Select label="Gender" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Gender }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Height (cm)" type="number" value={form.heightCm} onChange={(e) => setForm((f) => ({ ...f, heightCm: e.target.value }))} />
            <Input label="Current Weight" type="number" step="0.1" value={form.currentWeightKg} onChange={(e) => setForm((f) => ({ ...f, currentWeightKg: e.target.value }))} />
            <Input label="Goal Weight" type="number" step="0.1" value={form.goalWeightKg} onChange={(e) => setForm((f) => ({ ...f, goalWeightKg: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Activity Level" value={form.activityLevel} onChange={(e) => setForm((f) => ({ ...f, activityLevel: e.target.value as ActivityLevel }))}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light (1-3/wk)</option>
              <option value="moderate">Moderate (3-5/wk)</option>
              <option value="active">Active (6-7/wk)</option>
              <option value="very_active">Very Active</option>
            </Select>
            <Select label="Experience" value={form.trainingExperience} onChange={(e) => setForm((f) => ({ ...f, trainingExperience: e.target.value as TrainingExperience }))}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </div>

          {bmi && bmiCat && (
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${bmiCat.color}10`, border: `1px solid ${bmiCat.color}25` }}>
              <span className="text-xs text-[#7A7A8C]">BMI</span>
              <span className="text-sm font-bold" style={{ color: bmiCat.color }}>{bmi} · {bmiCat.label}</span>
            </div>
          )}

          <Button onClick={handleSave} size="lg" className="w-full gap-2">
            <Save size={16} />
            {saved ? 'Saved! ✓' : 'Save Changes'}
          </Button>
        </Card>

        {/* Stats */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-[#F0F0F5] mb-4">Your Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Workouts', value: workouts.filter((w) => w.completed).length },
              { label: 'Meals Logged', value: meals.length },
              { label: 'Weigh-ins', value: weights.length },
              { label: 'Days Active', value: [...new Set(workouts.map((w) => w.date))].length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#1E1E23] rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</p>
                <p className="text-xs text-[#7A7A8C]">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Data actions */}
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F0F0F5]">Data Management</h3>
          <Button variant="secondary" size="lg" className="w-full gap-2" onClick={exportData}>
            <Download size={16} /> Export All Data (JSON)
          </Button>
          <Button
            variant="danger"
            size="lg"
            className="w-full gap-2"
            onClick={() => {
              if (confirm('Reset all data and start over? This cannot be undone.')) {
                resetOnboarding();
              }
            }}
          >
            <RotateCcw size={16} /> Reset & Re-Onboard
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
}
