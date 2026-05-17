import { describe, it, expect } from 'vitest';
import { gptPlan } from '@/data/gptPlan';
import type { PlanExercise } from '@/data/gptPlan';

// ─── Plan metadata ────────────────────────────────────────────────────────────

describe('gptPlan — metadata', () => {
  it('has required top-level fields', () => {
    expect(gptPlan.id).toBeTruthy();
    expect(gptPlan.title).toBeTruthy();
    expect(gptPlan.subtitle).toBeTruthy();
    expect(gptPlan.duration).toBeTruthy();
    expect(gptPlan.difficulty).toBeTruthy();
    expect(gptPlan.goal).toBeTruthy();
    expect(gptPlan.coverImage).toBeTruthy();
  });

  it('has exactly 5 workout days', () => {
    expect(gptPlan.days).toHaveLength(5);
  });

  it('has at least one meal entry', () => {
    expect(gptPlan.meals.length).toBeGreaterThan(0);
  });

  it('has rules array', () => {
    expect(Array.isArray(gptPlan.rules)).toBe(true);
    expect(gptPlan.rules.length).toBeGreaterThan(0);
  });
});

// ─── Workout days ─────────────────────────────────────────────────────────────

describe('gptPlan — workout days', () => {
  it('each day has required fields', () => {
    for (const day of gptPlan.days) {
      expect(typeof day.day).toBe('number');
      expect(day.title).toBeTruthy();
      expect(Array.isArray(day.blocks)).toBe(true);
    }
  });

  it('day numbers are sequential starting at 1', () => {
    const dayNumbers = gptPlan.days.map((d) => d.day);
    expect(dayNumbers).toEqual([1, 2, 3, 4, 5]);
  });

  it('each block has label, color, and exercises array', () => {
    for (const day of gptPlan.days) {
      for (const block of day.blocks) {
        expect(block.label).toBeTruthy();
        expect(block.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(Array.isArray(block.exercises)).toBe(true);
      }
    }
  });

  it('each exercise has name, image, and muscleGroup', () => {
    for (const day of gptPlan.days) {
      for (const block of day.blocks) {
        for (const ex of block.exercises) {
          expect(ex.name, `exercise name in day ${day.day}`).toBeTruthy();
          expect(ex.image, `image in exercise "${ex.name}"`).toBeTruthy();
          expect(ex.muscleGroup, `muscleGroup in exercise "${ex.name}"`).toBeTruthy();
        }
      }
    }
  });

  it('every exercise has a videoUrl', () => {
    const missing: string[] = [];
    for (const day of gptPlan.days) {
      for (const block of day.blocks) {
        for (const ex of block.exercises) {
          if (!ex.videoUrl) missing.push(`Day ${day.day} / "${ex.name}"`);
        }
      }
    }
    expect(missing, `exercises missing videoUrl: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('all videoUrls point to YouTube', () => {
    for (const day of gptPlan.days) {
      for (const block of day.blocks) {
        for (const ex of block.exercises) {
          if (ex.videoUrl) {
            expect(
              ex.videoUrl,
              `videoUrl for "${ex.name}" should be a YouTube link`
            ).toMatch(/youtube\.com\/watch\?v=/);
          }
        }
      }
    }
  });

  it('each exercise has sets, reps, or duration (at least one volume indicator)', () => {
    const noVolume: string[] = [];
    for (const day of gptPlan.days) {
      for (const block of day.blocks) {
        for (const ex of block.exercises) {
          if (!ex.sets && !ex.reps && !ex.duration) {
            noVolume.push(`Day ${day.day} / "${ex.name}"`);
          }
        }
      }
    }
    expect(noVolume, `exercises without volume: ${noVolume.join(', ')}`).toHaveLength(0);
  });

  it('total exercise count across all days is > 20', () => {
    let total = 0;
    for (const day of gptPlan.days) {
      for (const block of day.blocks) {
        total += block.exercises.length;
      }
    }
    expect(total).toBeGreaterThan(20);
  });
});

// ─── Diet / meals ─────────────────────────────────────────────────────────────

describe('gptPlan — meals', () => {
  it('each meal has id, title, timing, icon, and options', () => {
    for (const meal of gptPlan.meals) {
      expect(meal.id).toBeTruthy();
      expect(meal.title).toBeTruthy();
      expect(meal.timing).toBeTruthy();
      expect(meal.icon).toBeTruthy();
      expect(Array.isArray(meal.options)).toBe(true);
      expect(meal.options.length).toBeGreaterThan(0);
    }
  });

  it('each food option has required fields', () => {
    for (const meal of gptPlan.meals) {
      for (const opt of meal.options) {
        expect(opt.name, `food name in meal "${meal.title}"`).toBeTruthy();
        expect(opt.image, `image in food "${opt.name}"`).toBeTruthy();
        expect(typeof opt.calories, `calories in food "${opt.name}"`).toBe('number');
        expect(typeof opt.protein, `protein in food "${opt.name}"`).toBe('number');
      }
    }
  });

  it('calorie values are positive', () => {
    for (const meal of gptPlan.meals) {
      for (const opt of meal.options) {
        expect(opt.calories).toBeGreaterThan(0);
      }
    }
  });

  it('has 4 meals (breakfast, lunch, snack, dinner)', () => {
    expect(gptPlan.meals).toHaveLength(4);
  });
});

// ─── Rules & supplements ──────────────────────────────────────────────────────

describe('gptPlan — rules', () => {
  it('each rule has a non-empty title and body', () => {
    for (const rule of gptPlan.rules) {
      expect(rule.title.trim()).toBeTruthy();
      expect(rule.body.trim()).toBeTruthy();
    }
  });

  it('each rule has an icon', () => {
    for (const rule of gptPlan.rules) {
      expect(rule.icon).toBeTruthy();
    }
  });
});
