import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
};

type AuthState = {
    user: User | null;
    token: string | null;
    isHydrated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null as User | null,
            token: null,
            isHydrated: false,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
            setHydrated: () => set({ isHydrated: true }),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            }
        }
    )
);
