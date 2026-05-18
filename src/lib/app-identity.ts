// ---------------------------------------------------------------------------
// AppIdentity Interface & Defaults — shared across stores and hooks
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
