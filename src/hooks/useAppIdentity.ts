'use client';

import { useEffect, useCallback } from 'react';
import { useAppIdentityStore } from '@/stores/useAppIdentityStore';

// Re-export from the shared location for backward compatibility
export type { AppIdentity } from '@/lib/app-identity';
export { APP_IDENTITY_DEFAULTS, parseLinks } from '@/lib/app-identity';
export type { ParsedLink } from '@/lib/app-identity';

// ---------------------------------------------------------------------------
// Hook – backed by global Zustand store so all components share same data
// ---------------------------------------------------------------------------

interface UseAppIdentityReturn {
  /** Merged identity that always contains values (falls back to defaults) */
  resolved: import('@/lib/app-identity').AppIdentity;
  /** Whether the initial fetch is in progress */
  loading: boolean;
  /** Manually re-fetch the identity data */
  refetch: () => Promise<void>;
}

export function useAppIdentity(): UseAppIdentityReturn {
  const { resolved, loaded, fetchIdentity } = useAppIdentityStore();

  useEffect(() => {
    if (!loaded) {
      fetchIdentity();
    }
  }, [loaded, fetchIdentity]);

  const refetch = useCallback(async () => {
    await fetchIdentity();
  }, [fetchIdentity]);

  return { resolved, loading: !loaded, refetch };
}
