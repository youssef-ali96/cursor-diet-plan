# FitForge — Fitness Tracking Web App

> A production-ready fitness SaaS application for tracking workouts, nutrition, body metrics, habits, and transformation progress.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [Features](#features)
   - [Onboarding](#1-onboarding)
   - [Dashboard](#2-dashboard)
   - [Daily Log](#3-daily-log)
   - [Training Plans](#4-training-plans)
   - [Calendar](#5-calendar)
   - [Analytics](#6-analytics)
   - [Progress Photos](#7-progress-photos)
   - [Goals](#8-goals)
   - [Achievements](#9-achievements)
   - [Habits](#10-habits)
   - [Smart Insights](#11-smart-insights)
   - [Water Tracker](#12-water-tracker)
   - [Settings](#13-settings)
7. [State Management](#state-management)
8. [TypeScript Types](#typescript-types)
9. [Custom Hooks](#custom-hooks)
10. [UI Component System](#ui-component-system)
11. [Data Layer](#data-layer)
12. [Routing](#routing)
13. [Styling & Design System](#styling--design-system)
14. [Gamification System](#gamification-system)
15. [Adding a New Feature](#adding-a-new-feature)
16. [Adding a New Training Plan](#adding-a-new-training-plan)
17. [Environment & Build](#environment--build)

---

## Overview

**FitForge** is a full-featured fitness tracking web application built with React 19 + Vite. It gives users a complete fitness command center — from logging workouts and meals, to tracking body weight trends, building daily habits, and following structured training programs.

All data is stored **locally** in `localStorage` via Zustand persist middleware. No backend or database is required. The codebase is structured as a real SaaS product and is ready to be connected to a real API.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React + Vite | 19 / 8 |
| Language | TypeScript | ~6.0 |
| Styling | Tailwind CSS | v4 |
| State | Zustand (persisted) | ^5 |
| Data layer | TanStack React Query | ^5 |
| Charts | Recharts | ^3 |
| Date handling | date-fns | ^4 |
| Animations | Framer Motion | ^12 |
| Icons | Lucide React | ^1 |
| Routing | React Router DOM | ^7 |
| Headless UI | Radix UI primitives | ^1–2 |
| Utilities | clsx, tailwind-merge | latest |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
# Clone / open project
cd diet-sheet

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

### Build for Production

```bash
npm run build       # TypeScript check + Vite build
npm run preview     # Preview the production build locally
```

---

## Project Structure

```
diet-sheet/
├── index.html                    # App entry point (fonts, meta tags)
├── vite.config.ts                # Vite + Tailwind plugin + path alias
├── tsconfig.app.json             # TypeScript config with @/ alias
├── package.json
│
└── src/
    ├── main.tsx                  # React root mount
    ├── App.tsx                   # Router, QueryClient, onboarding gate
    ├── index.css                 # Global styles, Tailwind v4 theme
    ├── vite-env.d.ts             # Vite type declarations
    │
    ├── types/
    │   └── index.ts              # All TypeScript interfaces & enums
    │
    ├── lib/
    │   └── utils.ts              # BMI, TDEE, XP, date, format helpers
    │
    ├── store/
    │   ├── userStore.ts          # User profile (Zustand + localStorage)
    │   ├── trackingStore.ts      # Workouts, meals, weight, metrics, photos
    │   └── goalsStore.ts         # Goals, achievements, level, habits
    │
    ├── hooks/
    │   ├── useAppData.ts         # Mock data seeder + today's stats hook
    │   └── useInsights.ts        # Rule-based insights engine
    │
    ├── data/
    │   ├── mockData.ts           # 30-day seeded mock history
    │   └── gptPlan.ts            # GPT Plan data (workout + diet)
    │
    ├── components/
    │   ├── ui/                   # Reusable atomic UI components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Progress.tsx      # ProgressBar + CircularProgress
    │   │   └── Badge.tsx
    │   │
    │   └── layout/               # App shell components
    │       ├── AppLayout.tsx     # Main layout wrapper + PageHeader
    │       ├── Sidebar.tsx       # Desktop left navigation
    │       └── MobileNav.tsx     # Mobile bottom navigation bar
    │
    └── features/                 # Feature modules (self-contained)
        ├── onboarding/
        │   └── OnboardingFlow.tsx
        ├── dashboard/
        │   ├── Dashboard.tsx
        │   └── QuickAddModal.tsx
        ├── tracking/
        │   └── TrackingPage.tsx
        ├── plans/
        │   ├── PlansPage.tsx
        │   └── PlanDetailPage.tsx
        ├── calendar/
        │   └── CalendarPage.tsx
        ├── analytics/
        │   └── AnalyticsPage.tsx
        ├── photos/
        │   └── PhotosPage.tsx
        ├── goals/
        │   └── GoalsPage.tsx
        ├── gamification/
        │   └── AchievementsPage.tsx
        ├── habits/
        │   ├── HabitsPage.tsx
        │   └── WaterPage.tsx
        ├── insights/
        │   └── InsightsPage.tsx
        └── settings/
            └── SettingsPage.tsx
```

---

## Architecture

### Core Principles

1. **No business logic in UI components** — All calculations live in `lib/utils.ts` or custom hooks.
2. **Feature-first folder structure** — Each feature is self-contained under `src/features/`.
3. **Zustand for all global state** — Three stores: user, tracking, goals.
4. **localStorage persistence** — All stores use Zustand's `persist` middleware automatically.
5. **API-ready data layer** — React Query is wired up. Swap mock data for real API calls without touching UI.

### Data Flow

```
User Action
    │
    ▼
Feature Component (UI only)
    │
    ▼
Zustand Store Action  ──► localStorage (auto-persist)
    │
    ▼
Derived State (hooks / selectors)
    │
    ▼
UI Re-render
```

---

## Features

### 1. Onboarding

**Route:** shown on first visit (before `isOnboarded` is true)  
**File:** `src/features/onboarding/OnboardingFlow.tsx`

A 5-step animated wizard that collects:

| Step | Fields |
|------|--------|
| Welcome | Name |
| Profile | Age, Gender |
| Body | Height (cm), Current weight (kg), BMI preview |
| Goals | Goal weight, Activity level |
| Experience | Training experience level |

On completion, `useUserStore.setProfile()` saves the profile and sets `isOnboarded: true`. The app then redirects to `/dashboard` and seeds 30 days of mock data.

**BMI is calculated live** during the Body step using `calculateBMI(weight, height)` from `lib/utils.ts`.

---

### 2. Dashboard

**Route:** `/dashboard`  
**File:** `src/features/dashboard/Dashboard.tsx`

The main hub. Shows:

| Widget | Description |
|--------|-------------|
| Streak card | Current 🔥 streak + personal best |
| Level card | XP level, title, progress bar |
| Weight card | Today's weight vs goal |
| Workout card | Sessions completed today |
| Calorie ring | Circular progress — consumed vs goal |
| Macro targets | Protein / Carbs / Fat progress bars |
| Steps widget | Steps with quick-add button |
| Water widget | Water intake with quick-add button |
| Quick actions | 4 tap-to-log shortcuts |
| Today's insights | 3 rule-based insight cards |
| Today's workouts | List of logged workouts |

**Quick Add Modal** (`QuickAddModal.tsx`) supports 5 types:
- `workout` — name, type, intensity, duration, calories burned
- `meal` — food name, type, calories, macros
- `weight` — kg + optional body fat %
- `steps` — numeric with ±500 steppers
- `water` — preset glass sizes (200ml, 250ml, 500ml, 750ml)

Every log action awards **XP** via `useGoalsStore.addXP()`.

---

### 3. Daily Log

**Route:** `/tracking`  
**File:** `src/features/tracking/TrackingPage.tsx`

Browse any past or future date with prev/next navigation. For each date shows:

- **Summary bar** — calories, steps, water, weight in compact cards
- **Workouts section** — logged sessions with intensity badge, delete button
- **Nutrition section** — meals grouped by type (breakfast/lunch/dinner/snack), per-meal calorie totals
- **Body metrics** — weight entry with optional body fat %
- **Activity section** — steps + water progress bars side by side

All sections have an "+ Add" button that opens the Quick Add Modal pre-filled for that type.

---

### 4. Training Plans

**Route:** `/plans`, `/plans/:planId`  
**Files:** `src/features/plans/PlansPage.tsx`, `src/features/plans/PlanDetailPage.tsx`  
**Data:** `src/data/gptPlan.ts`

#### Plans List (`/plans`)
Displays all available training programs as large cover-photo cards with metadata (duration, difficulty, goal).

#### Plan Detail (`/plans/:planId`)
Full plan viewer with 3 tabs:

**Workout Tab**
- Collapsible day cards (Day 1–5)
- Each day shows cover photo, badge, exercise count
- Expanded view shows exercise cards with:
  - Real food/exercise photo (Pexels CDN)
  - Muscle group label
  - Sets × reps / duration chips
  - Coaching tip
  - Smart emoji fallback if image fails

**Diet Tab**
- 4 meals: Breakfast, Lunch, Snack, Dinner
- Each option shows photo, name, calories, protein
- Carb selector chips for Meal 2
- Warning banner for Meal 4 (no carbs)

**Rules Tab**
- Pre/post workout protocols
- Supplement cards (all optional)
- Weekly schedule visual overview

#### Currently included plan:

**GPT Plan** — 5-Day Home Workout + Clean Diet
- Day 1: Upper Body Strength + HIIT (20 min)
- Day 2: Lower Body + Core
- Day 3: Rest / Active Recovery
- Day 4: Full Body Fat Burn Circuit
- Day 5: Upper Body + Core Finisher

---

### 5. Calendar

**Route:** `/calendar`  
**File:** `src/features/calendar/CalendarPage.tsx`

Monthly calendar grid. Each day cell shows colored indicator dots:
- 🟢 (lime) — workout logged
- 🟢 (green) — meal logged
- 🟠 (orange) — weight logged

Clicking any day opens a **detail modal** showing all workouts, meals, and weight for that day.

Bottom of page shows monthly summary stats: total workouts, days with meals logged, weigh-ins.

---

### 6. Analytics

**Route:** `/analytics`  
**File:** `src/features/analytics/AnalyticsPage.tsx`

Period selector: **7 Days / 30 Days / 3 Months**

| Chart | Type | Data |
|-------|------|------|
| Weight Progression | Area chart | Daily weight entries |
| Calorie Trend | Area chart + goal line | Daily calorie totals |
| Weekly Workout Frequency | Bar chart | Workouts per week |
| Daily Steps | Bar chart | Steps vs goal |

Summary cards: total workouts, avg calories, avg steps, weight change.

Charts use **Recharts** with custom dark-themed tooltips.

---

### 7. Progress Photos

**Route:** `/photos`  
**File:** `src/features/photos/PhotosPage.tsx`

- Upload photos via file picker (JPG/PNG/WEBP)
- Tag each photo: **Front / Side / Back**
- Add optional notes
- Photos grouped by week in a responsive grid
- Hover reveals angle label + date + delete button
- **Before/After comparison modal** — side-by-side view of any two photos

---

### 8. Goals

**Route:** `/goals`  
**File:** `src/features/goals/GoalsPage.tsx`

5 goal types tracked:

| Goal | Unit | Period |
|------|------|--------|
| Weekly Workouts | sessions | This week |
| Daily Steps | steps | Today |
| Daily Calories | kcal | Today |
| Daily Water | ml | Today |
| Weekly Cardio | minutes | This week |

Each goal shows a **circular ring** (overview) and a **horizontal progress bar** (detail card).

Tap **Edit Goals** to inline-edit any target value. Saves to `useGoalsStore`.

---

### 9. Achievements

**Route:** `/achievements`  
**File:** `src/features/gamification/AchievementsPage.tsx`

**Level card** at top shows XP ring, current level, title, and 3 lifetime stats.

**10 built-in achievements:**

| ID | Title | Trigger |
|----|-------|---------|
| streak_7 | 7-Day Warrior | 7-day active streak |
| streak_30 | Month Master | 30-day streak |
| workouts_10 | Getting Started | 10 workouts completed |
| workouts_30 | Dedicated | 30 workouts |
| workouts_100 | Century Club | 100 workouts |
| weight_5 | First Steps | Lose 5kg |
| steps_10k | Step Master | 10,000 steps in one day |
| log_7 | Food Logger | 7 consecutive meal-log days |
| consistent_14 | Consistent | 14-day workout streak |
| photo_first | First Transformation | Upload first progress photo |

Unlocked achievements show the unlock date. Locked ones show progress bars.

---

### 10. Habits

**Route:** `/habits`  
**File:** `src/features/habits/HabitsPage.tsx`

Daily habit checklist with:
- One-tap toggle for today
- 7-day dot heatmap (shows which days were completed this week)
- Custom icon (12 options) + color (8 options) + target days/week
- Completion summary card at top

Default habits: Morning Workout, Drink Water, Log Meals, Evening Walk, Sleep 8hrs.

---

### 11. Smart Insights

**Route:** `/insights`  
**File:** `src/features/insights/InsightsPage.tsx`  
**Hook:** `src/hooks/useInsights.ts`

Rule-based engine generates up to 6 insights per session:

| Rule | Trigger |
|------|---------|
| Weight trend | Compares first vs last weight in 14-day window |
| Weekly workout count | Compares this week vs goal and vs last week |
| Activity change | % change vs prior week |
| Streak milestone | If streak ≥ 5 days |
| Steps average | 7-day avg vs daily step goal |
| Meal logging | Counts unique logged days |

Insight types: `success` (green), `warning` (orange), `info` (blue), `tip` (purple).

Page also shows body overview (BMI, current weight, goal weight, delta), weekly comparison cards, and static recommendation cards.

---

### 12. Water Tracker

**Route:** `/water`  
**File:** `src/features/habits/WaterPage.tsx`

- **Animated bottle fill** visualization (CSS height transition)
- Percentage markers on the side
- Quick-add presets: Small (200ml), Glass (250ml), Bottle (500ml), Large (750ml)
- Manual ±250ml adjustment buttons
- **7-day bar chart** showing intake vs goal per day (color-coded: partial blue, goal-met green)
- Hydration tips card

---

### 13. Settings

**Route:** `/settings`  
**File:** `src/features/settings/SettingsPage.tsx`

- Edit all profile fields (name, age, gender, height, weight, goal weight, activity level, experience)
- Live BMI recalculation on weight/height change
- Lifetime stats summary (workouts, meals, weigh-ins, active days)
- **Export all data** as a `.json` file (workout logs, meals, weight history, profile)
- **Reset & Re-Onboard** — clears all data and returns to onboarding (with confirmation dialog)

---

## State Management

Three Zustand stores, all persisted to `localStorage`:

### `useUserStore` — `src/store/userStore.ts`

```ts
interface UserState {
  profile: UserProfile | null
  isOnboarded: boolean
  setProfile(profile)       // called at onboarding completion
  updateProfile(updates)    // used by settings page
  setTheme(theme)
  resetOnboarding()         // clears all and returns to onboarding
}
```

localStorage key: `fitness-user`

---

### `useTrackingStore` — `src/store/trackingStore.ts`

```ts
interface TrackingState {
  workouts: WorkoutLog[]
  meals: MealLog[]
  weights: WeightEntry[]
  dailyMetrics: DailyMetrics[]
  progressPhotos: ProgressPhoto[]
  streak: StreakData

  // Actions
  addWorkout / updateWorkout / deleteWorkout / toggleWorkoutComplete
  addMeal / updateMeal / deleteMeal
  addWeight / deleteWeight
  updateDailyMetrics / getDailyMetrics
  addPhoto / deletePhoto
  updateStreak

  // Selectors
  getWorkoutsForDate(date)   // → WorkoutLog[]
  getMealsForDate(date)      // → MealLog[]
  getWeightForDate(date)     // → WeightEntry | undefined
  getCaloriesForDate(date)   // → number
}
```

localStorage key: `fitness-tracking`

---

### `useGoalsStore` — `src/store/goalsStore.ts`

```ts
interface GoalsState {
  goals: WeeklyGoals
  achievements: Achievement[]
  userLevel: UserLevel
  habits: Habit[]

  setGoals(partial)
  addXP(amount)                          // advances level automatically
  unlockAchievement(id)
  updateAchievementProgress(id, value)
  addHabit / toggleHabitDate / deleteHabit
}
```

localStorage key: `fitness-goals`

---

## TypeScript Types

All types are in `src/types/index.ts`:

```ts
// Enums / unions
type Gender = 'male' | 'female' | 'other'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
type TrainingExperience = 'beginner' | 'intermediate' | 'advanced'
type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'yoga' | 'pilates' | ...
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
type WorkoutIntensity = 'light' | 'moderate' | 'high' | 'max'
type InsightType = 'success' | 'warning' | 'info' | 'tip'
type PhotoAngle = 'front' | 'side' | 'back'

// Core models
UserProfile, WorkoutLog, Exercise, MealLog, FoodItem
WeightEntry, DailyMetrics, ProgressPhoto
WeeklyGoals, Achievement, UserLevel, Habit, Insight, StreakData
```

---

## Custom Hooks

### `useAppData` — `src/hooks/useAppData.ts`

Seeds mock data when the store is empty (first login). Run once via `useEffect` in `AppInitializer`.

### `useTodayStats` — `src/hooks/useAppData.ts`

Returns a snapshot of today's data:

```ts
{
  todayWorkouts, todayMeals, todayMetrics, todayWeight,
  caloriesConsumed, caloriesBurned, netCalories, goals
}
```

### `useInsights` — `src/hooks/useInsights.ts`

`useMemo`-based rule engine. Returns `Insight[]` derived from tracking store + goals. Re-runs when workouts, weights, meals, metrics, streak, or goals change.

---

## UI Component System

All components are in `src/components/ui/`:

### `Button`
```tsx
<Button variant="primary|secondary|ghost|danger|outline" size="sm|md|lg|icon" loading>
```

### `Card`
```tsx
<Card hover glass glow>
<CardHeader> <CardContent> <CardTitle>
```

### `Input` / `Select`
```tsx
<Input label="..." error="..." icon={<Icon />} />
<Select label="...">...</Select>
```

### `Modal`
```tsx
<Modal open={bool} onClose={fn} title="..." size="sm|md|lg|xl">
```
Locks body scroll when open. Animated entry via CSS keyframes.

### `ProgressBar`
```tsx
<ProgressBar value={0–100} color="#C8FF00" height={6} animated showLabel />
```

### `CircularProgress`
```tsx
<CircularProgress value={0–100} size={80} strokeWidth={6} color="#C8FF00">
  <span>label</span>
</CircularProgress>
```

### `Badge`
```tsx
<Badge label="HIGH" color="#FF9F0A" variant="filled|subtle|outline" size="sm|md" />
```

---

## Data Layer

### Mock Data (`src/data/mockData.ts`)

Generates realistic 30-day history:
- 10 completed workouts across various types
- 7 meals (today + 1 day ago)
- 30 weight entries with gradual downward trend + variance
- 14 days of step/water/sleep metrics

Seeded once on first login via `useAppData`.

### Training Plans (`src/data/gptPlan.ts`)

Typed plan data conforming to `FitnessPlan` interface. Add new plans by exporting additional objects and adding them to the `plans` map in `PlanDetailPage.tsx` and the `allPlans` array in `PlansPage.tsx`.

---

## Routing

All routes defined in `src/App.tsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | redirect | → `/dashboard` |
| `/dashboard` | `Dashboard` | Main hub |
| `/tracking` | `TrackingPage` | Daily log |
| `/plans` | `PlansPage` | Plan library |
| `/plans/:planId` | `PlanDetailPage` | Plan detail |
| `/calendar` | `CalendarPage` | Monthly calendar |
| `/analytics` | `AnalyticsPage` | Charts & trends |
| `/photos` | `PhotosPage` | Progress photos |
| `/goals` | `GoalsPage` | Weekly targets |
| `/achievements` | `AchievementsPage` | Badges & XP |
| `/habits` | `HabitsPage` | Daily habit tracker |
| `/insights` | `InsightsPage` | Smart analysis |
| `/water` | `WaterPage` | Hydration tracker |
| `/settings` | `SettingsPage` | Profile & data |
| `*` | redirect | → `/dashboard` |

**Onboarding gate:** If `isOnboarded === false`, the `<OnboardingFlow>` is rendered instead of any route.

---

## Styling & Design System

### Theme Tokens (`src/index.css`)

```css
--color-brand:        #C8FF00   /* Neon lime — primary accent */
--color-brand-dim:    #a3d400
--color-surface:      #0F0F11   /* Page background */
--color-surface-2:    #17171A   /* Card background */
--color-surface-3:    #1E1E23   /* Input / hover */
--color-surface-4:    #252529
--color-border:       #2A2A30
--color-text:         #F0F0F5
--color-text-muted:   #7A7A8C
--color-text-subtle:  #4A4A5A
--color-danger:       #FF4560
--color-warning:      #FF9F0A
--color-info:         #0A84FF
--color-success:      #30D158
```

### Typography

| Font | Usage |
|------|-------|
| `Barlow Condensed` (800–900) | Headings, stats, numbers, nav logo |
| `DM Sans` (300–700) | Body text, labels, UI |

### Layout

- Desktop: fixed left sidebar (256px) + `lg:pl-64` main content
- Mobile: full-width + fixed bottom nav (5 items)
- Mobile nav `pb-20` ensures content clears the bottom bar

---

## Gamification System

### XP Awards

| Action | XP |
|--------|-----|
| Log workout | +50 |
| Log meal | +20 |
| Log weight | +10 |
| Log steps | +5 |
| Add water | +2 |

### Level Titles

| Level | Title |
|-------|-------|
| 1–4 | Rookie |
| 5–9 | Contender |
| 10–19 | Athlete |
| 20–29 | Champion |
| 30–39 | Elite |
| 40+ | Legend |

XP per level: **500 XP**. Level is calculated as `Math.floor(totalXP / 500) + 1`.

### Streak Logic

`updateStreak()` in `trackingStore.ts`:
1. Adds today's date to `activeDates`
2. Iterates backward from today, counting consecutive days
3. Updates `currentStreak` and `longestStreak`

---

## Adding a New Feature

1. Create folder: `src/features/myfeature/`
2. Create `MyFeaturePage.tsx` — import `AppLayout` and `PageHeader`
3. Add route in `src/App.tsx`
4. Add nav item in `src/components/layout/Sidebar.tsx` and `MobileNav.tsx`
5. If state is needed, add actions to an existing store or create `src/store/myFeatureStore.ts`

```tsx
// MyFeaturePage.tsx skeleton
import { AppLayout, PageHeader } from '@/components/layout/AppLayout';

export function MyFeaturePage() {
  return (
    <AppLayout>
      <PageHeader title="My Feature" subtitle="Description" />
      <div className="p-6">
        {/* content */}
      </div>
    </AppLayout>
  );
}
```

---

## Adding a New Training Plan

1. Open `src/data/gptPlan.ts` and duplicate / adapt the `gptPlan` export.
2. Assign a unique `id`, `title`, `coverImage`, and fill in `days`, `meals`, `rules`, `supplements`.
3. In `src/features/plans/PlansPage.tsx`, add the new plan to `allPlans`:
   ```ts
   import { myNewPlan } from '@/data/myNewPlan';
   const allPlans: FitnessPlan[] = [gptPlan, myNewPlan];
   ```
4. In `src/features/plans/PlanDetailPage.tsx`, add to the `plans` map:
   ```ts
   const plans: Record<string, FitnessPlan> = {
     'gpt-plan': gptPlan,
     'my-plan-id': myNewPlan,
   };
   ```

---

## Environment & Build

### Scripts

```bash
npm run dev        # Vite dev server (HMR)
npm run build      # tsc + vite build → dist/
npm run preview    # Serve dist/ locally
npm run lint       # ESLint check
```

### Path Alias

`@/` maps to `src/`. Configured in both `vite.config.ts` and `tsconfig.app.json`.

```ts
// Instead of:
import { Button } from '../../../components/ui/Button';
// Use:
import { Button } from '@/components/ui/Button';
```

### localStorage Keys

| Key | Store |
|-----|-------|
| `fitness-user` | userStore |
| `fitness-tracking` | trackingStore |
| `fitness-goals` | goalsStore |

To fully reset the app during development:
```js
// In browser console:
localStorage.clear(); location.reload();
```

---

## License

Private project. All rights reserved.
