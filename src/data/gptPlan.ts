export interface PlanExercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  note?: string;
  image: string;
  muscleGroup: string;
  videoUrl?: string;
}

export interface PlanBlock {
  label: string;
  color: string;
  exercises: PlanExercise[];
}

export interface PlanDay {
  day: number;
  title: string;
  type: 'training' | 'rest';
  badge: string;
  badgeColor: string;
  blocks: PlanBlock[];
  finisher?: string;
  image: string;
}

export interface MealOption {
  name: string;
  image: string;
  calories: number;
  protein: number;
}

export interface PlanMeal {
  id: string;
  title: string;
  timing: string;
  icon: string;
  options: MealOption[];
  carbs?: string[];
  note?: string;
}

export interface FitnessPlan {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  difficulty: string;
  goal: string;
  coverImage: string;
  days: PlanDay[];
  meals: PlanMeal[];
  rules: { icon: string; title: string; body: string }[];
  supplements: { name: string; dose: string; image: string; optional: boolean }[];
}

// ─── Reliable Pexels CDN images (always available, no auth) ──────────────────
const IMGS = {
  // Exercises
  pushup:       'https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?w=400&h=300&fit=crop',
  pikePushup:   'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?w=400&h=300&fit=crop',
  chairDip:     'https://images.pexels.com/photos/4761352/pexels-photo-4761352.jpeg?w=400&h=300&fit=crop',
  bandRow:      'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?w=400&h=300&fit=crop',
  shoulderPress:'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?w=400&h=300&fit=crop',
  jumpingJack:  'https://images.pexels.com/photos/4498294/pexels-photo-4498294.jpeg?w=400&h=300&fit=crop',
  mountainClimb:'https://images.pexels.com/photos/4162580/pexels-photo-4162580.jpeg?w=400&h=300&fit=crop',
  burpee:       'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?w=400&h=300&fit=crop',
  highKnees:    'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?w=400&h=300&fit=crop',
  squat:        'https://images.pexels.com/photos/4162456/pexels-photo-4162456.jpeg?w=400&h=300&fit=crop',
  splitSquat:   'https://images.pexels.com/photos/4162453/pexels-photo-4162453.jpeg?w=400&h=300&fit=crop',
  lunge:        'https://images.pexels.com/photos/4162534/pexels-photo-4162534.jpeg?w=400&h=300&fit=crop',
  gluteBridge:  'https://images.pexels.com/photos/6551133/pexels-photo-6551133.jpeg?w=400&h=300&fit=crop',
  calfRaise:    'https://images.pexels.com/photos/4498154/pexels-photo-4498154.jpeg?w=400&h=300&fit=crop',
  plank:        'https://images.pexels.com/photos/4162583/pexels-photo-4162583.jpeg?w=400&h=300&fit=crop',
  legRaise:     'https://images.pexels.com/photos/6550855/pexels-photo-6550855.jpeg?w=400&h=300&fit=crop',
  russianTwist: 'https://images.pexels.com/photos/4498603/pexels-photo-4498603.jpeg?w=400&h=300&fit=crop',
  bicycleCrunch:'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg?w=400&h=300&fit=crop',
  walking:      'https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?w=400&h=300&fit=crop',
  stretching:   'https://images.pexels.com/photos/4325476/pexels-photo-4325476.jpeg?w=400&h=300&fit=crop',
  curl:         'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?w=400&h=300&fit=crop',
  sqJump:       'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?w=400&h=300&fit=crop',

  // Day covers
  upperBody:    'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=600&h=400&fit=crop',
  lowerBody:    'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?w=600&h=400&fit=crop',
  restDay:      'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?w=600&h=400&fit=crop',
  fatBurn:      'https://images.pexels.com/photos/999309/pexels-photo-999309.jpeg?w=600&h=400&fit=crop',
  upperCore:    'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?w=600&h=400&fit=crop',
  cover:        'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?w=800&h=500&fit=crop',

  // Food
  eggs:         'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?w=400&h=300&fit=crop',
  oats:         'https://images.pexels.com/photos/5765/food-breakfast-eggs-bacon.jpg?w=400&h=300&fit=crop',
  tuna:         'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=300&fit=crop',
  chicken:      'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=400&h=300&fit=crop',
  beef:         'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=400&h=300&fit=crop',
  tunaRice:     'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=400&h=300&fit=crop',
  apple:        'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=400&h=300&fit=crop',
  almonds:      'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?w=400&h=300&fit=crop',
  chickenSalad: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=400&h=300&fit=crop',
  eggVeg:       'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?w=400&h=300&fit=crop',
  tunaSalad:    'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?w=400&h=300&fit=crop',
  oatBowl:      'https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg?w=400&h=300&fit=crop',

  // Supplements
  whey:         'https://images.pexels.com/photos/3621871/pexels-photo-3621871.jpeg?w=400&h=300&fit=crop',
  pills:        'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?w=400&h=300&fit=crop',
};

export const gptPlan: FitnessPlan = {
  id: 'gpt-plan',
  title: 'GPT Plan',
  subtitle: '5-Day Home Workout + Clean Diet',
  description:
    'A complete 5-day training program combining strength, HIIT, and full-body circuits with a clean 4-meal nutrition protocol. No gym required — all exercises are bodyweight or minimal equipment.',
  duration: '2 Weeks',
  difficulty: 'Intermediate',
  goal: 'Fat Loss + Muscle Tone',
  coverImage: IMGS.cover,

  // ─── Days ──────────────────────────────────────────────────────────────────
  days: [
    {
      day: 1,
      title: 'Upper Body + HIIT',
      type: 'training',
      badge: 'Strength + Cardio',
      badgeColor: '#C8FF00',
      image: IMGS.upperBody,
      blocks: [
        {
          label: 'Strength — 45 sec rest',
          color: '#C8FF00',
          exercises: [
            { name: 'Push-ups', sets: 4, reps: '15 reps', image: IMGS.pushup, muscleGroup: 'Chest / Triceps', note: 'Keep core tight, full range of motion', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
            { name: 'Pike Push-ups', sets: 4, reps: '12 reps', image: IMGS.pikePushup, muscleGroup: 'Shoulders', note: 'Hips high, elbows track back', videoUrl: 'https://www.youtube.com/watch?v=yBCWGINLOv8' },
            { name: 'Chair Dips', sets: 4, reps: '15 reps', image: IMGS.chairDip, muscleGroup: 'Triceps / Chest', note: 'Elbows point straight back', videoUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc' },
            { name: 'Resistance Band Rows', sets: 4, reps: '15 reps', image: IMGS.bandRow, muscleGroup: 'Back / Biceps', note: 'Pull elbows behind your body', videoUrl: 'https://www.youtube.com/watch?v=KZUBYB_nJSo' },
            { name: 'Shoulder Press', sets: 4, reps: '12 reps', image: IMGS.shoulderPress, muscleGroup: 'Shoulders / Triceps', note: 'Dumbbells or loaded backpack', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
          ],
        },
        {
          label: 'HIIT — 40 sec work / 20 sec rest × 4 rounds',
          color: '#FF4560',
          exercises: [
            { name: 'Jumping Jacks', duration: '40 sec', image: IMGS.jumpingJack, muscleGroup: 'Full Body / Cardio', videoUrl: 'https://www.youtube.com/watch?v=iSSAk4XCsRA' },
            { name: 'Mountain Climbers', duration: '40 sec', image: IMGS.mountainClimb, muscleGroup: 'Core / Cardio', videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
            { name: 'Burpees', duration: '40 sec', image: IMGS.burpee, muscleGroup: 'Full Body', note: 'Most brutal — rest if needed', videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU' },
            { name: 'High Knees', duration: '40 sec', image: IMGS.highKnees, muscleGroup: 'Core / Cardio', videoUrl: 'https://www.youtube.com/watch?v=tx5rgpDAJCQ' },
            { name: 'Squat Jumps', duration: '40 sec', image: IMGS.sqJump, muscleGroup: 'Legs / Glutes', videoUrl: 'https://www.youtube.com/watch?v=A-cFYWvaHr0' },
          ],
        },
      ],
    },

    {
      day: 2,
      title: 'Lower Body + Core',
      type: 'training',
      badge: 'Legs + Abs',
      badgeColor: '#FF9F0A',
      image: IMGS.lowerBody,
      blocks: [
        {
          label: 'Legs',
          color: '#FF9F0A',
          exercises: [
            { name: 'Squats', sets: 5, reps: '20 reps', image: IMGS.squat, muscleGroup: 'Quads / Glutes', note: 'Chest up, drive through heels', videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
            { name: 'Bulgarian Split Squats', sets: 4, reps: '12 reps each leg', image: IMGS.splitSquat, muscleGroup: 'Quads / Glutes', note: 'Rear foot elevated on chair', videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE' },
            { name: 'Lunges', sets: 4, reps: '14 reps each leg', image: IMGS.lunge, muscleGroup: 'Quads / Glutes', videoUrl: 'https://www.youtube.com/watch?v=3XDriUn0udo' },
            { name: 'Glute Bridge', sets: 4, reps: '20 reps', image: IMGS.gluteBridge, muscleGroup: 'Glutes / Hamstrings', note: 'Squeeze hard at the top', videoUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8' },
            { name: 'Calf Raises', sets: 5, reps: '25 reps', image: IMGS.calfRaise, muscleGroup: 'Calves', note: 'Slow & controlled', videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p1fCI' },
          ],
        },
        {
          label: 'Core',
          color: '#C8FF00',
          exercises: [
            { name: 'Plank', sets: 3, duration: '1 min', image: IMGS.plank, muscleGroup: 'Core', note: 'Hips level, breathe steadily', videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
            { name: 'Leg Raises', sets: 4, reps: '15 reps', image: IMGS.legRaise, muscleGroup: 'Lower Abs', videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI' },
            { name: 'Russian Twists', sets: 4, reps: '20 reps', image: IMGS.russianTwist, muscleGroup: 'Obliques', note: 'Feet off ground for extra burn', videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI' },
            { name: 'Bicycle Crunches', sets: 4, reps: '20 reps', image: IMGS.bicycleCrunch, muscleGroup: 'Abs / Obliques', videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8' },
          ],
        },
      ],
      finisher: '20–30 min fast walking',
    },

    {
      day: 3,
      title: 'Rest Day',
      type: 'rest',
      badge: 'Recovery',
      badgeColor: '#30D158',
      image: IMGS.restDay,
      blocks: [
        {
          label: 'Active Recovery',
          color: '#30D158',
          exercises: [
            { name: '45–60 min Walking', duration: '45–60 min', image: IMGS.walking, muscleGroup: 'Low-intensity cardio', note: 'Comfortable pace, fresh air', videoUrl: 'https://www.youtube.com/watch?v=rZzW_dA2z9M' },
            { name: 'Full Body Stretching', duration: '10 min', image: IMGS.stretching, muscleGroup: 'Mobility / Flexibility', note: 'Focus on quads, hamstrings, hip flexors', videoUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A' },
          ],
        },
      ],
    },

    {
      day: 4,
      title: 'Full Body Fat Burn',
      type: 'training',
      badge: 'Fat Burn Circuit',
      badgeColor: '#FF4560',
      image: IMGS.fatBurn,
      blocks: [
        {
          label: 'Circuit × 5 rounds — 90 sec rest between rounds',
          color: '#FF4560',
          exercises: [
            { name: 'Burpees', reps: '12 reps', image: IMGS.burpee, muscleGroup: 'Full Body', videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU' },
            { name: 'Push-ups', reps: '15 reps', image: IMGS.pushup, muscleGroup: 'Chest / Triceps', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
            { name: 'Squats', reps: '20 reps', image: IMGS.squat, muscleGroup: 'Legs', videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
            { name: 'Mountain Climbers', duration: '30 sec', image: IMGS.mountainClimb, muscleGroup: 'Core / Cardio', videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
            { name: 'Dumbbell / Backpack Rows', reps: '15 reps', image: IMGS.bandRow, muscleGroup: 'Back', videoUrl: 'https://www.youtube.com/watch?v=KZUBYB_nJSo' },
            { name: 'Plank', duration: '45 sec', image: IMGS.plank, muscleGroup: 'Core', videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
          ],
        },
      ],
      finisher: '15 min incline walking or stair climbing',
    },

    {
      day: 5,
      title: 'Upper Body + Core',
      type: 'training',
      badge: 'Upper + Abs',
      badgeColor: '#0A84FF',
      image: IMGS.upperCore,
      blocks: [
        {
          label: 'Upper Body',
          color: '#0A84FF',
          exercises: [
            { name: 'Push-ups', sets: 5, reps: '15 reps', image: IMGS.pushup, muscleGroup: 'Chest / Triceps', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
            { name: 'Shoulder Press', sets: 4, reps: '12 reps', image: IMGS.shoulderPress, muscleGroup: 'Shoulders', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
            { name: 'Chair Dips', sets: 4, reps: '15 reps', image: IMGS.chairDip, muscleGroup: 'Triceps', videoUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc' },
            { name: 'Backpack Curls', sets: 4, reps: '15 reps', image: IMGS.curl, muscleGroup: 'Biceps', videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
            { name: 'Resistance Band Rows', sets: 4, reps: '15 reps', image: IMGS.bandRow, muscleGroup: 'Back', videoUrl: 'https://www.youtube.com/watch?v=KZUBYB_nJSo' },
          ],
        },
        {
          label: 'Core Finisher × 4 rounds',
          color: '#C8FF00',
          exercises: [
            { name: 'Plank', sets: 4, duration: '1 min', image: IMGS.plank, muscleGroup: 'Core', videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
            { name: 'Leg Raises', sets: 4, reps: '15 reps', image: IMGS.legRaise, muscleGroup: 'Lower Abs', videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI' },
            { name: 'Mountain Climbers', sets: 4, duration: '30 sec', image: IMGS.mountainClimb, muscleGroup: 'Core / Cardio', videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
          ],
        },
      ],
    },
  ],

  // ─── Diet ──────────────────────────────────────────────────────────────────
  meals: [
    {
      id: 'meal1',
      title: 'Meal 1 — Breakfast',
      timing: 'First thing in the morning',
      icon: '🌅',
      options: [
        { name: '4 Eggs + Cucumber + Tomato', image: IMGS.eggs, calories: 320, protein: 28 },
        { name: 'Oats + Water + Banana + Peanut Butter', image: IMGS.oatBowl, calories: 420, protein: 14 },
        { name: 'Tuna + Mixed Vegetables', image: IMGS.tuna, calories: 280, protein: 35 },
      ],
    },
    {
      id: 'meal2',
      title: 'Meal 2 — Lunch',
      timing: '2–3 hours after breakfast',
      icon: '☀️',
      options: [
        { name: '200g Grilled Chicken + Vegetables', image: IMGS.chicken, calories: 380, protein: 46 },
        { name: '200g Lean Beef + Salad', image: IMGS.beef, calories: 420, protein: 44 },
        { name: 'Tuna + Rice (small portion)', image: IMGS.tunaRice, calories: 360, protein: 38 },
      ],
      carbs: ['1 cup brown rice', '1 medium sweet potato', '2 slices brown toast'],
      note: 'Pick one carb source only',
    },
    {
      id: 'meal3',
      title: 'Meal 3 — Snack',
      timing: '2–3 hours after lunch',
      icon: '🍎',
      options: [
        { name: 'Apple or Banana', image: IMGS.apple, calories: 90, protein: 1 },
        { name: 'Handful of Almonds / Peanuts', image: IMGS.almonds, calories: 170, protein: 6 },
      ],
      note: 'Black coffee is allowed',
    },
    {
      id: 'meal4',
      title: 'Meal 4 — Dinner',
      timing: 'At least 2 hrs before bed',
      icon: '🌙',
      options: [
        { name: '200g Chicken Breast + Salad', image: IMGS.chickenSalad, calories: 320, protein: 48 },
        { name: 'Eggs + Vegetables', image: IMGS.eggVeg, calories: 260, protein: 22 },
        { name: 'Tuna Salad', image: IMGS.tunaSalad, calories: 230, protein: 32 },
      ],
      note: '🚫 No carbs at dinner during these 2 weeks',
    },
  ],

  // ─── Rules ─────────────────────────────────────────────────────────────────
  rules: [
    { icon: '☕', title: 'Pre-Workout', body: 'Black coffee 30 min before training. Add a banana if energy is low.' },
    { icon: '🥩', title: 'Post-Workout Protein', body: 'Prioritize protein immediately after: eggs, chicken, tuna, or lean beef.' },
    { icon: '💧', title: 'Hydration', body: 'Drink 2.5–3L of water daily. Start with 500ml upon waking.' },
    { icon: '🚫', title: 'No Carbs at Dinner', body: 'Cut all carbs at dinner for these 2 weeks to accelerate fat loss.' },
    { icon: '🔁', title: 'Repeat Weekly', body: 'Days 1–5 each week. Rest Day 3 is non-negotiable for recovery.' },
  ],

  // ─── Supplements ───────────────────────────────────────────────────────────
  supplements: [
    { name: 'Whey Protein', dose: '1 scoop post-workout', image: IMGS.whey, optional: true },
    { name: 'Creatine', dose: '5g daily', image: IMGS.pills, optional: true },
    { name: 'Omega-3', dose: '2 capsules with meal', image: IMGS.pills, optional: true },
    { name: 'Multivitamin', dose: '1 daily with breakfast', image: IMGS.pills, optional: true },
  ],
};
