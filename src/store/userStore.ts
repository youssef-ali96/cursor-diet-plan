import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Theme } from '@/types';
import { genId } from '@/lib/utils';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  setProfile: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setTheme: (theme: Theme) => void;
  resetOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isOnboarded: false,

      setProfile: (profileData) => {
        const profile: UserProfile = {
          ...profileData,
          id: genId(),
          createdAt: new Date().toISOString(),
          theme: 'dark',
        };
        set({ profile, isOnboarded: true });
      },

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : state.profile,
        })),

      setTheme: (theme) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, theme } : state.profile,
        })),

      resetOnboarding: () => set({ profile: null, isOnboarded: false }),
    }),
    { name: 'fitness-user' }
  )
);
