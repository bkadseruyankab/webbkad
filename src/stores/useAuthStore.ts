import { create } from 'zustand';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verify: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isAuthenticated: false,
  loading: true,

  login: async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('auth_token', data.data.token);
        set({
          user: data.data.user,
          token: data.data.token,
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  logout: async () => {
    const token = get().token;
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // Ignore errors
    }
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  verify: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      set({ loading: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        set({
          user: data.data,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false, loading: false });
      }
    } catch {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  setUser: (user: AuthUser) => set({ user }),
}));
