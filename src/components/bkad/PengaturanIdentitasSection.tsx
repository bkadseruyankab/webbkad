"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  RotateCcw,
  Building2,
  Phone,
  FileText,
  Globe,
  Palette,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/bkad/ImageUpload";
import {
  APP_IDENTITY_DEFAULTS,
  type AppIdentity,
} from "@/lib/app-identity";
import { useAppIdentityStore } from "@/stores/useAppIdentityStore";
import { resolveFileUrl } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Section key type & defaults                                               */
/* -------------------------------------------------------------------------- */

type FormKey = keyof AppIdentity;

const BKAD_GREEN = "#0D6B3F";
const BKAD_GOLD = "#C5960C";

/* -------------------------------------------------------------------------- */
/*  Field helper – builds a labelled input or textarea                        */
/* -------------------------------------------------------------------------- */

interface FieldProps {
  label: string;
  fieldKey: FormKey;
  value: string;
  onChange: (key: FormKey, value: string) => void;
  type?: "text" | "color";
  placeholder?: string;
  helperText?: string;
  isTextarea?: boolean;
  rows?: number;
}

function FormField({
  label,
  fieldKey,
  value,
  onChange,
  type = "text",
  placeholder,
  helperText,
  isTextarea = false,
  rows = 3,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={fieldKey}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      {type === "color" ? (
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              id={fieldKey}
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(fieldKey, e.target.value)}
              className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer p-0.5"
            />
          </div>
          <Input
            value={value || ""}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            placeholder="#000000"
            className="flex-1 font-mono text-sm"
          />
        </div>
      ) : isTextarea ? (
        <Textarea
          id={fieldKey}
          value={value || ""}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="resize-y text-sm"
        />
      ) : (
        <Input
          id={fieldKey}
          type="text"
          value={value || ""}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          className="text-sm"
        />
      )}
      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Collapsible section wrapper                                               */
/* -------------------------------------------------------------------------- */

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SettingsSection({
  icon,
  title,
  description,
  defaultOpen = false,
  children,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${BKAD_GREEN}15`, color: BKAD_GREEN }}
              >
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export default function PengaturanIdentitasSection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [identityId, setIdentityId] = useState<string>("");
  const [form, setForm] = useState<AppIdentity>({ ...APP_IDENTITY_DEFAULTS });

  /* ---------------------------------------------------------------------- */
  /*  Fetch identity on mount                                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    async function fetchIdentity() {
      try {
        const res = await fetch("/api/app-identity");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data as AppIdentity;
          setIdentityId(data.id);
          setForm({ ...APP_IDENTITY_DEFAULTS, ...data });
        }
      } catch (err) {
        console.error("Failed to fetch identity:", err);
        toast({
          title: "Gagal memuat data",
          description: "Tidak dapat mengambil data identitas aplikasi.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchIdentity();
  }, []);

  /* ---------------------------------------------------------------------- */
  /*  Field change handler                                                   */
  /* ---------------------------------------------------------------------- */

  const handleChange = (key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------------------------------------------------------------- */
  /*  Save handler                                                           */
  /* ---------------------------------------------------------------------- */

  const handleSave = async () => {
    if (!identityId) {
      toast({
        title: "Gagal menyimpan",
        description: "ID identitas tidak ditemukan. Muat ulang halaman.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/app-identity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: identityId, ...form }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json.success) {
        toast({
          title: "Berhasil disimpan",
          description: "Pengaturan identitas aplikasi telah diperbarui.",
        });
        if (json.data) {
          setForm({ ...APP_IDENTITY_DEFAULTS, ...json.data });
          // Update global store so all components (header, footer, etc.) get the new identity immediately
          useAppIdentityStore.getState().resolved = { ...APP_IDENTITY_DEFAULTS, ...json.data };
          useAppIdentityStore.getState().fetchIdentity();
        }
      } else {
        throw new Error(json.error || "Unknown error");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*  Reset handler                                                          */
  /* ---------------------------------------------------------------------- */

  const handleReset = () => {
    setForm({ ...APP_IDENTITY_DEFAULTS });
    toast({
      title: "Form direset",
      description: "Semua field telah dikembalikan ke nilai bawaan.",
    });
  };

  /* ---------------------------------------------------------------------- */
  /*  Live preview                                                           */
  /* ---------------------------------------------------------------------- */

  const renderLivePreview = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Top Info Bar Preview */}
      <div
        className="text-white text-xs py-1.5 px-3 flex flex-wrap items-center gap-x-4 gap-y-1"
        style={{ backgroundColor: form.darkColor || BKAD_GREEN }}
      >
        {form.phone && (
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {form.phone}
          </span>
        )}
        {form.email && <span>{form.email}</span>}
        {form.workHours && (
          <span className="hidden sm:inline">{form.workHours}</span>
        )}
      </div>

      {/* Header Preview */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        {/* Logo circle */}
        {resolveFileUrl(form.logoUrl) ? (
          <img
            src={resolveFileUrl(form.logoUrl)!}
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2"
            style={{ borderColor: form.primaryColor || BKAD_GREEN }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: form.primaryColor || BKAD_GREEN }}
          >
            <span className="text-white font-bold text-sm">
              {form.logoText || "BK"}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-gray-900 truncate">
            {form.appName || "Nama Aplikasi"}
          </h4>
          <p
            className="text-xs font-semibold truncate"
            style={{ color: form.primaryColor || BKAD_GREEN }}
          >
            {form.appSubtitle || "Subtitle"}
          </p>
        </div>
      </div>

      {/* Nav Bar Preview */}
      <div
        className="h-8 flex items-center px-4 gap-2"
        style={{ backgroundColor: form.primaryColor || BKAD_GREEN }}
      >
        <span className="text-white/80 text-xs">Beranda</span>
        <span className="text-white/80 text-xs">Profil</span>
        <span className="text-white/80 text-xs">Berita</span>
        <span className="text-white/80 text-xs">Layanan</span>
        <span className="text-white/80 text-xs hidden sm:inline">Kontak</span>
      </div>

      {/* Preview label */}
      <div className="px-3 py-1.5 bg-gray-50 text-xs text-gray-400 flex items-center gap-1.5">
        <Globe className="w-3 h-3" />
        Pratinjau Langsung Header
      </div>
    </div>
  );

  /* ---------------------------------------------------------------------- */
  /*  Loading state                                                          */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${BKAD_GREEN}40`, borderTopColor: "transparent" }}
          />
          <p className="text-sm text-gray-500">Memuat pengaturan identitas...</p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${BKAD_GREEN}15`, color: BKAD_GREEN }}
          >
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Pengaturan Identitas
            </h2>
            <p className="text-sm text-gray-500">
              Kelola identitas dan tampilan aplikasi
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-gray-600"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-1.5 text-white"
            style={{ backgroundColor: BKAD_GREEN }}
          >
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      {renderLivePreview()}

      {/* Section 1: Header & Logo */}
      <SettingsSection
        icon={<Palette className="w-4 h-4" />}
        title="Header & Logo"
        description="Nama, logo, dan warna aplikasi"
        defaultOpen={true}
      >
        <FormField
          label="Nama Aplikasi"
          fieldKey="appName"
          value={form.appName}
          onChange={handleChange}
          placeholder="Badan Keuangan dan Aset Daerah"
        />
        <FormField
          label="Nama Singkat"
          fieldKey="appShortName"
          value={form.appShortName}
          onChange={handleChange}
          placeholder="BKAD"
        />
        <FormField
          label="Subtitle"
          fieldKey="appSubtitle"
          value={form.appSubtitle}
          onChange={handleChange}
          placeholder="Kabupaten Seruyan"
        />
        <FormField
          label="Teks Logo"
          fieldKey="logoText"
          value={form.logoText}
          onChange={handleChange}
          placeholder="BK"
        />
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-700">Logo Gambar</Label>
          <ImageUpload
            value={form.logoUrl}
            onChange={(url) => handleChange("logoUrl", url)}
            label=""
            compress={true}
            maxWidth={400}
            maxHeight={400}
            quality={0.9}
          />
          <FormField
            label="Atau masukkan URL Logo"
            fieldKey="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
        </div>
        <FormField
          label="Warna Primer"
          fieldKey="primaryColor"
          value={form.primaryColor}
          onChange={handleChange}
          type="color"
        />
        <FormField
          label="Warna Sekunder"
          fieldKey="secondaryColor"
          value={form.secondaryColor}
          onChange={handleChange}
          type="color"
        />
        <FormField
          label="Warna Gelap"
          fieldKey="darkColor"
          value={form.darkColor}
          onChange={handleChange}
          type="color"
        />
      </SettingsSection>

      {/* Section 2: Info Bar Atas */}
      <SettingsSection
        icon={<Phone className="w-4 h-4" />}
        title="Info Bar Atas"
        description="Telepon, email, jam kerja, dan link atas"
        defaultOpen={false}
      >
        <FormField
          label="Telepon"
          fieldKey="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="(0532) 882123"
        />
        <FormField
          label="Email"
          fieldKey="email"
          value={form.email}
          onChange={handleChange}
          placeholder="bkad@seruyankab.go.id"
        />
        <FormField
          label="Jam Kerja"
          fieldKey="workHours"
          value={form.workHours}
          onChange={handleChange}
          placeholder="Senin - Jumat, 08:00 - 16:00 WIB"
        />
        <FormField
          label="Link Atas"
          fieldKey="topLinks"
          value={form.topLinks}
          onChange={handleChange}
          isTextarea
          rows={2}
          placeholder="PPID|https://ppid.example.com,SIPD|https://sipd.example.com"
          helperText='Format: Label|URL,Label|URL'
        />
      </SettingsSection>

      {/* Section 3: Footer */}
      <SettingsSection
        icon={<FileText className="w-4 h-4" />}
        title="Footer"
        description="Alamat, media sosial, link cepat, dan hak cipta"
        defaultOpen={false}
      >
        <FormField
          label="Alamat"
          fieldKey="address"
          value={form.address}
          onChange={handleChange}
          isTextarea
          rows={2}
          placeholder="Jl. Trans Kalimantan, Kuala Pembuang"
        />
        <FormField
          label="Deskripsi Footer"
          fieldKey="footerDescription"
          value={form.footerDescription}
          onChange={handleChange}
          isTextarea
          rows={3}
          placeholder="Deskripsi singkat tentang instansi"
        />
        <FormField
          label="URL Facebook"
          fieldKey="facebookUrl"
          value={form.facebookUrl}
          onChange={handleChange}
          placeholder="https://facebook.com/bkad"
        />
        <FormField
          label="URL Instagram"
          fieldKey="instagramUrl"
          value={form.instagramUrl}
          onChange={handleChange}
          placeholder="https://instagram.com/bkad"
        />
        <FormField
          label="URL YouTube"
          fieldKey="youtubeUrl"
          value={form.youtubeUrl}
          onChange={handleChange}
          placeholder="https://youtube.com/bkad"
        />
        <FormField
          label="URL Twitter"
          fieldKey="twitterUrl"
          value={form.twitterUrl}
          onChange={handleChange}
          placeholder="https://twitter.com/bkad"
        />
        <FormField
          label="Link Cepat"
          fieldKey="quickLinks"
          value={form.quickLinks}
          onChange={handleChange}
          isTextarea
          rows={2}
          placeholder="Kementerian Dalam Negeri|https://kemendagri.go.id,Pemerintah Kabupaten|#"
          helperText='Format: Label|URL,Label|URL'
        />
        <FormField
          label="Link Layanan"
          fieldKey="layananLinks"
          value={form.layananLinks}
          onChange={handleChange}
          isTextarea
          rows={2}
          placeholder="Pengelolaan APBD|#"
          helperText='Format: Label|URL,Label|URL'
        />
        <FormField
          label="Teks Hak Cipta"
          fieldKey="copyrightText"
          value={form.copyrightText}
          onChange={handleChange}
          placeholder="Badan Keuangan dan Aset Daerah Kabupaten Seruyan"
        />
      </SettingsSection>

      {/* Section 4: Metadata */}
      <SettingsSection
        icon={<Globe className="w-4 h-4" />}
        title="Metadata"
        description="Favicon, meta deskripsi, dan kata kunci SEO"
        defaultOpen={false}
      >
        <FormField
          label="URL Favicon"
          fieldKey="faviconUrl"
          value={form.faviconUrl}
          onChange={handleChange}
          placeholder="https://example.com/favicon.ico"
        />
        <FormField
          label="Meta Deskripsi"
          fieldKey="metaDescription"
          value={form.metaDescription}
          onChange={handleChange}
          isTextarea
          rows={3}
          placeholder="Website resmi Badan Keuangan dan Aset Daerah"
        />
        <FormField
          label="Meta Kata Kunci"
          fieldKey="metaKeywords"
          value={form.metaKeywords}
          onChange={handleChange}
          placeholder="BKAD, Seruyan, Keuangan Daerah, Aset Daerah"
        />
      </SettingsSection>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 -mx-4 px-4 py-3 flex items-center justify-between z-10 sm:-mx-6 sm:px-6">
        <p className="text-xs text-gray-500 hidden sm:block">
          Perubahan akan diterapkan setelah disimpan
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-gray-600"
          >
            <RotateCcw className="w-4 h-4" />
            Reset ke Bawaan
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-1.5 text-white min-w-[120px]"
            style={{ backgroundColor: BKAD_GREEN }}
          >
            {saving ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "rgba(255,255,255,0.4)", borderTopColor: "transparent" }}
                />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
