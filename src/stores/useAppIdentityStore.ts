import { create } from "zustand";
import {
  type AppIdentity,
  APP_IDENTITY_DEFAULTS,
} from "@/lib/app-identity";

// ---------------------------------------------------------------------------
// Global Store — shares AppIdentity across all components
// ---------------------------------------------------------------------------

interface AppIdentityStoreState {
  /** Merged identity that always contains values (falls back to defaults) */
  resolved: AppIdentity;
  /** Whether the initial fetch has completed */
  loaded: boolean;
  /** Fetch (or re-fetch) identity from /api/app-identity */
  fetchIdentity: () => Promise<void>;
}

export const useAppIdentityStore = create<AppIdentityStoreState>((set) => ({
  resolved: { ...APP_IDENTITY_DEFAULTS },
  loaded: false,

  fetchIdentity: async () => {
    try {
      const res = await fetch("/api/app-identity");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        set({
          resolved: { ...APP_IDENTITY_DEFAULTS, ...(json.data as AppIdentity) },
          loaded: true,
        });
        return;
      }
    } catch (err) {
      console.error("Failed to fetch app identity:", err);
    }
    set({ loaded: true });
  },
}));
