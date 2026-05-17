# FitForge — Cursor AI Project Memory

This file provides persistent context for the Cursor AI agent working on this project.
Read this before making any changes.

---

## What This Project Is

**FitForge** is a production-ready fitness tracking SaaS web app built with React 19 + Vite + TypeScript.
It covers: workout logging, nutrition tracking, body weight trends, habit building, gamification, and structured training plans.
All data lives in `localStorage` via Zustand persist — no backend required.

---

## Tech Stack (Do Not Change Without Reason)

| Tool | Version | Role |
|------|---------|------|
| React + Vite | 19 / 8 | Framework |
| TypeScript | ~6.0 | Language |
| Tailwind CSS | v4 | Styling (no config file — CSS-based) |
| Zustand | ^5 | Global state + localStorage persistence |
| TanStack React Query | ^5 | Data layer structure |
| Recharts | ^3 | All charts |
| date-fns | ^4 | All date operations |
| Framer Motion | ^12 | Animations |
| React Router DOM | ^7 | Routing |
| Lucide React | ^1 | Icons |
| clsx + tailwind-merge | latest | Class utilities via `cn()` |

---

## Project Structure

```
src/
├── types/index.ts          ← ALL TypeScript types live here
├── lib/utils.ts            ← BMI, TDEE, XP, formatters, cn()
├── store/                  ← Zustand stores (userStore, trackingStore, goalsStore)
├── hooks/                  ← useAppData, useTodayStats, useInsights
├── data/                   ← mockData.ts, gptPlan.ts
├── components/
│   ├── ui/                 ← Button, Card, Input, Modal, Progress, Badge
│   └── layout/             ← AppLayout, Sidebar, MobileNav, PageHeader
└── features/               ← One folder per page/feature
    ├── onboarding/
    ├── dashboard/
    ├── tracking/
    ├── plans/
    ├── calendar/
    ├── analytics/
    ├── photos/
    ├── goals/
    ├── gamification/
    ├── habits/
    ├── insights/
    └── settings/
```

---

## Core Rules

### 1. No business logic in UI components
All calculations (BMI, TDEE, XP, calorie goals, progress percentages) belong in `lib/utils.ts` or a custom hook. Feature components are UI-only.

### 2. Use the `cn()` utility for all class merging
```ts
import { cn } from '@/lib/utils';
// ALWAYS use cn() when combining conditional classes
className={cn('base-classes', condition && 'conditional-class')}
```

### 3. Use `@/` path alias for all imports
```ts
// ✅ CORRECT
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';

// ❌ WRONG
import { Button } from '../../components/ui/Button';
```

### 4. All dates as `yyyy-MM-dd` strings
Use `format(date, 'yyyy-MM-dd')` from `date-fns` for storage. Never store raw `Date` objects in Zustand.

### 5. Use existing store actions — don't mutate state directly
```ts
// ✅ CORRECT
const { addWorkout } = useTrackingStore();
addWorkout({ ... });

// ❌ WRONG — never do this
useTrackingStore.setState({ workouts: [...] });
```

### 6. Always use `genId()` for new record IDs
```ts
import { genId } from '@/lib/utils';
const id = genId(); // random 9-char base36 string
```

---

## Design System

### Color Tokens (Tailwind v4 — use CSS variables or direct hex)

| Token | Hex | Usage |
|-------|-----|-------|
| Brand / Primary | `#C8FF00` | Accent, CTAs, active states |
| Surface | `#0F0F11` | Page background |
| Surface-2 | `#17171A` | Cards |
| Surface-3 | `#1E1E23` | Inputs, hover states |
| Border | `#2A2A30` | All borders |
| Text | `#F0F0F5` | Primary text |
| Text Muted | `#7A7A8C` | Labels, secondary text |
| Danger | `#FF4560` | Errors, delete actions |
| Warning | `#FF9F0A` | Alerts, high intensity |
| Info | `#0A84FF` | Steps, water, links |
| Success | `#30D158` | Completed states |

### Typography
- **Display / headings / stats:** `Barlow Condensed` — `font-black` (900), uppercase
- **Body / labels / UI:** `DM Sans` — regular to semibold
- Never use Inter, Roboto, Arial, or system-ui

### Spacing / Radius
- Cards: `rounded-[16px]` or `rounded-2xl`
- Buttons: `rounded-[10px]` or `rounded-xl`
- Page padding: `p-6`
- Section gaps: `space-y-6`

### Component Usage

```tsx
// Card
<Card hover glow className="p-5">
  <CardTitle>Section Label</CardTitle>
  ...
</Card>

// Button variants
<Button variant="primary">  // lime fill
<Button variant="secondary"> // dark border
<Button variant="ghost">     // no background
<Button variant="danger">    // red tint
<Button variant="outline">   // lime outline

// Progress
<ProgressBar value={75} color="#C8FF00" height={6} />
<CircularProgress value={75} size={80} strokeWidth={6} color="#C8FF00">
  <span>label</span>
</CircularProgress>
```

---

## State Stores Summary

### `useUserStore` — `src/store/userStore.ts`
```ts
{ profile, isOnboarded }
setProfile(profile)     // onboarding completion
updateProfile(updates)  // settings edits
resetOnboarding()       // full reset
```
localStorage key: `fitness-user`

### `useTrackingStore` — `src/store/trackingStore.ts`
```ts
{ workouts, meals, weights, dailyMetrics, progressPhotos, streak }
// CRUD: addWorkout, updateWorkout, deleteWorkout, toggleWorkoutComplete
// CRUD: addMeal, updateMeal, deleteMeal
// CRUD: addWeight, deleteWeight
// updateDailyMetrics(date, partial) / getDailyMetrics(date)
// addPhoto, deletePhoto
// getWorkoutsForDate(date) / getMealsForDate(date) / getCaloriesForDate(date)
```
localStorage key: `fitness-tracking`

### `useGoalsStore` — `src/store/goalsStore.ts`
```ts
{ goals, achievements, userLevel, habits }
setGoals(partial)
addXP(amount)                    // auto-levels up
unlockAchievement(id)
updateAchievementProgress(id, n)
addHabit / toggleHabitDate / deleteHabit
```
localStorage key: `fitness-goals`

---

## Routing

All routes in `src/App.tsx`. Onboarding gate: if `!isOnboarded` → show `<OnboardingFlow>`.

| Path | Feature |
|------|---------|
| `/dashboard` | Main hub |
| `/tracking` | Daily log |
| `/plans` | Training plans list |
| `/plans/:planId` | Plan detail |
| `/calendar` | Monthly calendar |
| `/analytics` | Charts |
| `/photos` | Progress photos |
| `/goals` | Weekly targets |
| `/achievements` | Badges & XP |
| `/habits` | Habit tracker |
| `/insights` | Smart insights |
| `/water` | Hydration |
| `/settings` | Profile & data |

---

## Adding New Pages

1. Create `src/features/mypage/MyPage.tsx`
2. Wrap with `<AppLayout>` and start with `<PageHeader title="..." />`
3. Add route in `src/App.tsx`
4. Add to `navItems` in `src/components/layout/Sidebar.tsx`
5. Add to `mobileNav` in `src/components/layout/MobileNav.tsx` (max 5 items)

---

## Adding New Training Plans

1. Create `src/data/myPlan.ts` — export object conforming to `FitnessPlan` type from `gptPlan.ts`
2. Add to `allPlans` array in `src/features/plans/PlansPage.tsx`
3. Add to `plans` map in `src/features/plans/PlanDetailPage.tsx`

---

## Key Utility Functions (`src/lib/utils.ts`)

```ts
cn(...classes)                        // tailwind class merge
today()                               // 'yyyy-MM-dd' string for today
formatDate(date, format?)             // date-fns format wrapper
calculateBMI(weightKg, heightCm)      // → number
getBMICategory(bmi)                   // → { label, color }
calculateTDEE(profile)                // Mifflin-St Jeor + activity multiplier
calculateCalorieGoal(profile)         // TDEE ± deficit/surplus
calcProgress(current, goal)           // → 0–100 percentage
getProgressColor(percent)             // → hex color based on %
genId()                               // random 9-char ID
getLevelTitle(level)                  // → 'Rookie' | 'Athlete' | etc.
```

---

## XP System

| Action | XP Awarded |
|--------|-----------|
| Log workout | +50 |
| Log meal | +20 |
| Log weight | +10 |
| Log steps | +5 |
| Add water | +2 |

Always call `useGoalsStore().addXP(n)` after any log action.

---

## Common Patterns

### Page shell
```tsx
export function MyPage() {
  return (
    <AppLayout>
      <PageHeader title="MY PAGE" subtitle="Description here" actions={<Button>Action</Button>} />
      <div className="p-6 space-y-6">
        {/* content */}
      </div>
    </AppLayout>
  );
}
```

### Stat card with number
```tsx
<Card className="p-5 flex flex-col gap-2">
  <CardTitle>Label</CardTitle>
  <span className="text-4xl font-black text-[#C8FF00]"
    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
    {value}
  </span>
  <p className="text-xs text-[#7A7A8C]">Subtitle</p>
</Card>
```

### Empty state
```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <span className="text-5xl mb-4">🎯</span>
  <p className="text-lg font-bold text-[#F0F0F5] mb-2">Nothing here yet</p>
  <p className="text-sm text-[#7A7A8C] mb-6">Description</p>
  <Button onClick={onAdd}>Add First Item</Button>
</div>
```

---

## Dev Commands

```bash
npm run dev        # Dev server (default port 5173)
npm run build      # TypeScript check + Vite build
npm run preview    # Preview production build

# Reset app data in browser console:
localStorage.clear(); location.reload();
```
