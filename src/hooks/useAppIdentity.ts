'use client';

import { useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface AppIdentity {
  id: string;
  appName: string;
  appShortName: string;
  appSubtitle: string;
  logoUrl: string;
  logoText: string;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
  phone: string;
  email: string;
  workHours: string;
  topLinks: string;
  address: string;
  footerDescription: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  quickLinks: string;
  layananLinks: string;
  copyrightText: string;
  faviconUrl: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Defaults – mirrors Prisma schema defaults so consumers always have values
// ---------------------------------------------------------------------------

export const APP_IDENTITY_DEFAULTS: AppIdentity = {
  id: '',
  appName: 'Badan Keuangan dan Aset Daerah',
  appShortName: 'BKAD',
  appSubtitle: 'Kabupaten Seruyan',
  logoUrl: '',
  logoText: 'BK',
  primaryColor: '#0D6B3F',
  secondaryColor: '#C5960C',
  darkColor: '#064E2B',
  phone: '(0532) 882123',
  email: 'bkad@seruyankab.go.id',
  workHours: 'Senin - Jumat, 08:00 - 16:00 WIB',
  topLinks: 'PPID|SIPD|Lapor!',
  address:
    'Jl. Trans Kalimantan, Kuala Pembuang, Kab. Seruyan, Kalimantan Tengah 74211',
  footerDescription:
    'Badan Keuangan dan Aset Daerah Kabupaten Seruyan, Kalimantan Tengah. Mewujudkan pengelolaan keuangan daerah yang transparan, akuntabel, dan berorientasi pada pelayanan publik.',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  twitterUrl: '',
  quickLinks:
    'Kementerian Dalam Negeri|https://kemendagri.go.id,Pemerintah Kabupaten Seruyan|#',
  layananLinks: 'Pengelolaan APBD|#',
  copyrightText: 'Badan Keuangan dan Aset Daerah Kabupaten Seruyan',
  faviconUrl: '',
  metaDescription:
    'Website resmi Badan Keuangan dan Aset Daerah Kabupaten Seruyan',
  metaKeywords: 'BKAD, Seruyan, Keuangan Daerah, Aset Daerah',
  isActive: true,
};

// ---------------------------------------------------------------------------
// Helper – parse "Label|url,Label|url" formatted strings
// ---------------------------------------------------------------------------

export interface ParsedLink {
  label: string;
  url: string;
}

export function parseLinks(linkString: string): ParsedLink[] {
  if (!linkString || typeof linkString !== 'string') return [];

  return linkString
    .split(',')
    .filter(Boolean)
    .map((pair) => {
      const [label, url] = pair.split('|').map((s) => s.trim());
      return { label: label || '', url: url || '#' };
    });
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseAppIdentityReturn {
  /** The identity data (null until first successful fetch) */
  identity: AppIdentity | null;
  /** Merged identity that always contains values (falls back to defaults) */
  resolved: AppIdentity;
  /** Whether the initial fetch is in progress */
  loading: boolean;
  /** Manually re-fetch the identity data */
  refetch: () => Promise<void>;
}

export function useAppIdentity(): UseAppIdentityReturn {
  const [identity, setIdentity] = useState<AppIdentity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchIdentity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/app-identity');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.success && json.data) {
        setIdentity(json.data as AppIdentity);
      }
    } catch (err) {
      console.error('Failed to fetch app identity:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdentity();
  }, [fetchIdentity]);

  // Merge loaded data with defaults so consumers always have a complete object
  const resolved: AppIdentity = identity
    ? { ...APP_IDENTITY_DEFAULTS, ...identity }
    : { ...APP_IDENTITY_DEFAULTS };

  return { identity, resolved, loading, refetch: fetchIdentity };
}
