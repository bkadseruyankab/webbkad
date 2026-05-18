import { create } from "zustand";

export interface SetupMenuOption {
  label: string;
  slug: string;
  icon: string;
  selected: boolean;
}

interface SetupState {
  /** Whether the app has been set up already */
  completed: boolean;
  /** Whether we've checked setup status from the server */
  checked: boolean;
  /** Current wizard step (0-indexed) */
  currentStep: number;
  /** Loading state for setup operations */
  loading: boolean;
  /** Error message */
  error: string;

  // Step 1: Admin Account
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminConfirmPassword: string;

  // Step 2: Site Identity
  appName: string;
  appShortName: string;
  appSubtitle: string;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
  phone: string;
  email: string;
  address: string;
  workHours: string;

  // Step 3: Menu Selection
  menuOptions: SetupMenuOption[];

  // Step 4: SEO & Extras
  metaDescription: string;
  metaKeywords: string;
  logoUrl: string;

  // Actions
  checkSetupStatus: () => Promise<void>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateField: (field: string, value: string) => void;
  toggleMenu: (slug: string) => void;
  submitSetup: () => Promise<boolean>;
  reset: () => void;
}

const DEFAULT_MENU_OPTIONS: SetupMenuOption[] = [
  { label: "Tentang Kami", slug: "tentang-kami", icon: "Info", selected: true },
  { label: "Visi & Misi", slug: "visi-misi", icon: "Target", selected: true },
  { label: "Tugas & Fungsi", slug: "tugas-fungsi", icon: "Briefcase", selected: true },
  { label: "Struktur Organisasi", slug: "struktur-organisasi", icon: "Network", selected: true },
  { label: "Transparansi Keuangan", slug: "transparansi-keuangan", icon: "BarChart3", selected: true },
  { label: "Layanan Publik", slug: "layanan-publik", icon: "HeartHandshake", selected: true },
  { label: "Pengaduan Masyarakat", slug: "pengaduan-masyarakat", icon: "MessageSquareWarning", selected: false },
  { label: "FAQ", slug: "faq", icon: "HelpCircle", selected: false },
  { label: "Galeri", slug: "galeri", icon: "Image", selected: true },
  { label: "Unduhan", slug: "unduhan", icon: "Download", selected: false },
];

const initialState = {
  completed: false,
  checked: false,
  currentStep: 0,
  loading: false,
  error: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
  adminConfirmPassword: "",
  appName: "Badan Keuangan dan Aset Daerah",
  appShortName: "BKAD",
  appSubtitle: "Kabupaten Seruyan",
  primaryColor: "#0D6B3F",
  secondaryColor: "#C5960C",
  darkColor: "#064E2B",
  phone: "(0532) 882123",
  email: "bkad@seruyankab.go.id",
  address: "Jl. Trans Kalimantan, Kuala Pembuang, Kab. Seruyan, Kalimantan Tengah 74211",
  workHours: "Senin - Jumat, 08:00 - 16:00 WIB",
  menuOptions: DEFAULT_MENU_OPTIONS,
  metaDescription: "",
  metaKeywords: "",
  logoUrl: "",
};

export const useSetupStore = create<SetupState>((set, get) => ({
  ...initialState,

  checkSetupStatus: async () => {
    try {
      const res = await fetch("/api/setup");
      const data = await res.json();
      if (data.success) {
        set({
          completed: data.data.completed,
          checked: true,
        });
      } else {
        set({ checked: true });
      }
    } catch {
      set({ checked: true });
    }
  },

  setStep: (step: number) => set({ currentStep: step }),

  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),

  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

  updateField: (field: string, value: string) => {
    set({ [field]: value } as Partial<SetupState>);
  },

  toggleMenu: (slug: string) => {
    set((s) => ({
      menuOptions: s.menuOptions.map((m) =>
        m.slug === slug ? { ...m, selected: !m.selected } : m
      ),
    }));
  },

  submitSetup: async () => {
    const state = get();
    set({ loading: true, error: "" });

    try {
      const selectedMenus = state.menuOptions.filter((m) => m.selected);

      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminName: state.adminName,
          adminEmail: state.adminEmail,
          adminPassword: state.adminPassword,
          appName: state.appName,
          appShortName: state.appShortName,
          appSubtitle: state.appSubtitle,
          primaryColor: state.primaryColor,
          secondaryColor: state.secondaryColor,
          darkColor: state.darkColor,
          phone: state.phone,
          email: state.email,
          address: state.address,
          workHours: state.workHours,
          selectedMenus: JSON.stringify(selectedMenus),
          logoUrl: state.logoUrl,
          metaDescription: state.metaDescription || `Website resmi ${state.appName}`,
          metaKeywords: state.metaKeywords || `${state.appShortName}, Keuangan Daerah, Aset Daerah`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        set({ completed: true, loading: false, currentStep: 4 });
        return true;
      } else {
        set({ error: data.error || "Gagal menyimpan setup", loading: false });
        return false;
      }
    } catch {
      set({ error: "Terjadi kesalahan jaringan", loading: false });
      return false;
    }
  },

  reset: () => set({ ...initialState, checked: true }),
}));
