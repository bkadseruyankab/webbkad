"use client";

import { useState, useMemo } from "react";
import {
  Shield,
  Globe,
  Palette,
  Menu,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Building2,
  Rocket,
  AlertCircle,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Clock,
  Info,
  Target,
  Briefcase,
  Network,
  BarChart3,
  HeartHandshake,
  MessageSquareWarning,
  HelpCircle,
  Image,
  Download,
  FileText,
  House,
  Users,
  Newspaper,
} from "lucide-react";
import { useSetupStore, type SetupMenuOption } from "@/stores/useSetupStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePageRouter } from "@/stores/usePageRouter";
import { useAppIdentityStore } from "@/stores/useAppIdentityStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

/* -------------------------------------------------------------------------- */
/*  Icon map for menu options                                                 */
/* -------------------------------------------------------------------------- */

const menuIconMap: Record<string, React.ElementType> = {
  Info,
  Target,
  Briefcase,
  Network,
  BarChart3,
  HeartHandshake,
  MessageSquareWarning,
  HelpCircle,
  Image,
  Download,
  FileText,
  House,
  Users,
  Newspaper,
  Shield,
  Phone,
  Mail,
  Globe,
  Building2,
  User,
};

function resolveMenuIcon(iconName: string): React.ElementType {
  return menuIconMap[iconName] || FileText;
}

/* -------------------------------------------------------------------------- */
/*  Step definitions                                                          */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { label: "Selamat Datang", icon: Rocket },
  { label: "Akun Admin", icon: Shield },
  { label: "Identitas", icon: Globe },
  { label: "Menu", icon: Menu },
  { label: "Selesai", icon: CheckCircle2 },
];

/* -------------------------------------------------------------------------- */
/*  Password strength helper                                                  */
/* -------------------------------------------------------------------------- */

function getPasswordStrength(password: string): {
  level: "weak" | "medium" | "strong";
  percent: number;
  label: string;
} {
  if (!password) return { level: "weak", percent: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { level: "weak", percent: 33, label: "Lemah" };
  if (score <= 3) return { level: "medium", percent: 66, label: "Sedang" };
  return { level: "strong", percent: 100, label: "Kuat" };
}

/* -------------------------------------------------------------------------- */
/*  Step Indicator                                                            */
/* -------------------------------------------------------------------------- */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto px-2">
      {STEPS.map((step, idx) => {
        const StepIcon = step.icon;
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-bkad-green border-bkad-green text-white"
                    : isCurrent
                    ? "bg-bkad-green/10 border-bkad-green text-bkad-green"
                    : "bg-gray-100 border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium text-center leading-tight max-w-[60px] ${
                  isCurrent
                    ? "text-bkad-green"
                    : isCompleted
                    ? "text-bkad-green/80"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mt-[-18px] transition-colors duration-300 ${
                  idx < currentStep ? "bg-bkad-green" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 0: Welcome Screen                                                    */
/* -------------------------------------------------------------------------- */

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-6 animate-fade-in">
      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-bkad-green/10 border-4 border-bkad-green flex items-center justify-center">
          <Building2 className="w-12 h-12 text-bkad-green" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-bkad-gold flex items-center justify-center shadow-md">
          <Rocket className="w-4 h-4 text-white" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        Selamat Datang di{" "}
        <span className="text-bkad-green">BKAD Portal</span>
      </h1>
      <p className="text-gray-600 mb-6 max-w-md text-sm sm:text-base">
        Siap mengkonfigurasi website Anda dalam beberapa langkah mudah
      </p>

      {/* Steps overview */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-8">
        {[
          { icon: Shield, label: "Buat Akun Admin", desc: "Akun pengelola utama" },
          { icon: Globe, label: "Identitas Website", desc: "Nama & tampilan" },
          { icon: Menu, label: "Menu Navigasi", desc: "Pilih menu website" },
          { icon: CheckCircle2, label: "Selesai", desc: "Website siap!" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-bkad-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <item.icon className="w-4 h-4 text-bkad-green" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">{item.label}</p>
              <p className="text-[10px] text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="w-full max-w-xs bg-bkad-green hover:bg-bkad-green/90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-bkad-green/20 transition-all duration-200 hover:shadow-xl hover:shadow-bkad-green/30"
      >
        Mulai Setup
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <p className="text-xs text-gray-400 mt-4">
        Setup hanya perlu dilakukan sekali saat pertama kali menggunakan aplikasi
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 1: Admin Account                                                     */
/* -------------------------------------------------------------------------- */

function AdminAccountStep() {
  const {
    adminName,
    adminEmail,
    adminPassword,
    adminConfirmPassword,
    updateField,
  } = useSetupStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const strength = useMemo(
    () => getPasswordStrength(adminPassword),
    [adminPassword]
  );

  const errors: Record<string, string> = {};
  if (touched.name && !adminName.trim()) errors.name = "Nama lengkap wajib diisi";
  if (touched.email && !adminEmail.trim()) errors.email = "Email wajib diisi";
  else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail))
    errors.email = "Format email tidak valid";
  if (touched.password && adminPassword.length < 8)
    errors.password = "Password minimal 8 karakter";
  if (
    touched.confirmPassword &&
    adminConfirmPassword &&
    adminPassword !== adminConfirmPassword
  )
    errors.confirmPassword = "Password tidak cocok";

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center mb-2">
        <div className="w-12 h-12 rounded-full bg-bkad-green/10 flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6 text-bkad-green" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Buat Akun Administrator</h2>
        <p className="text-sm text-gray-500 mt-1">
          Akun ini akan digunakan untuk mengelola seluruh konten website
        </p>
      </div>

      {/* Nama Lengkap */}
      <div className="space-y-1.5">
        <Label htmlFor="adminName" className="text-sm font-medium text-gray-700">
          Nama Lengkap <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="adminName"
            value={adminName}
            onChange={(e) => updateField("adminName", e.target.value)}
            onBlur={() => markTouched("name")}
            placeholder="Masukkan nama lengkap"
            className={`pl-10 ${errors.name ? "border-red-400 focus-visible:ring-red-200" : ""}`}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="adminEmail" className="text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="adminEmail"
            type="email"
            value={adminEmail}
            onChange={(e) => updateField("adminEmail", e.target.value)}
            onBlur={() => markTouched("email")}
            placeholder="admin@bkad.seruyan.go.id"
            className={`pl-10 ${errors.email ? "border-red-400 focus-visible:ring-red-200" : ""}`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="adminPassword"
          className="text-sm font-medium text-gray-700"
        >
          Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="adminPassword"
            type={showPassword ? "text" : "password"}
            value={adminPassword}
            onChange={(e) => updateField("adminPassword", e.target.value)}
            onBlur={() => markTouched("password")}
            placeholder="Minimal 8 karakter"
            className={`pl-10 pr-10 ${errors.password ? "border-red-400 focus-visible:ring-red-200" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.password}
          </p>
        )}

        {/* Password strength indicator */}
        {adminPassword && (
          <div className="space-y-1.5">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  strength.level === "weak"
                    ? "bg-red-500 w-1/3"
                    : strength.level === "medium"
                    ? "bg-amber-500 w-2/3"
                    : "bg-green-500 w-full"
                }`}
              />
            </div>
            <p
              className={`text-xs font-medium ${
                strength.level === "weak"
                  ? "text-red-500"
                  : strength.level === "medium"
                  ? "text-amber-600"
                  : "text-green-600"
              }`}
            >
              Kekuatan password: {strength.label}
            </p>
          </div>
        )}
      </div>

      {/* Konfirmasi Password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="adminConfirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Konfirmasi Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="adminConfirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={adminConfirmPassword}
            onChange={(e) => updateField("adminConfirmPassword", e.target.value)}
            onBlur={() => markTouched("confirmPassword")}
            placeholder="Ulangi password"
            className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-400 focus-visible:ring-red-200" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 2: Site Identity                                                     */
/* -------------------------------------------------------------------------- */

function SiteIdentityStep() {
  const {
    appName,
    appShortName,
    appSubtitle,
    primaryColor,
    secondaryColor,
    darkColor,
    phone,
    email,
    address,
    workHours,
    updateField,
  } = useSetupStore();

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors: Record<string, string> = {};
  if (touched.appName && !appName.trim())
    errors.appName = "Nama instansi wajib diisi";
  if (touched.appShortName && !appShortName.trim())
    errors.appShortName = "Singkatan wajib diisi";

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center mb-2">
        <div className="w-12 h-12 rounded-full bg-bkad-green/10 flex items-center justify-center mx-auto mb-3">
          <Globe className="w-6 h-6 text-bkad-green" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Identitas Website</h2>
        <p className="text-sm text-gray-500 mt-1">
          Atur identitas dan tampilan website Anda
        </p>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="appName" className="text-sm font-medium text-gray-700">
            Nama Instansi <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="appName"
              value={appName}
              onChange={(e) => updateField("appName", e.target.value)}
              onBlur={() => markTouched("appName")}
              placeholder="Nama instansi"
              className={`pl-10 ${errors.appName ? "border-red-400" : ""}`}
            />
          </div>
          {errors.appName && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.appName}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="appShortName"
            className="text-sm font-medium text-gray-700"
          >
            Singkatan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="appShortName"
            value={appShortName}
            onChange={(e) => updateField("appShortName", e.target.value)}
            onBlur={() => markTouched("appShortName")}
            placeholder="BKAD"
            className={errors.appShortName ? "border-red-400" : ""}
          />
          {errors.appShortName && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.appShortName}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="appSubtitle" className="text-sm font-medium text-gray-700">
          Subtitle / Daerah
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="appSubtitle"
            value={appSubtitle}
            onChange={(e) => updateField("appSubtitle", e.target.value)}
            placeholder="Kabupaten Seruyan"
            className="pl-10"
          />
        </div>
      </div>

      {/* Color pickers */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          <Palette className="w-3.5 h-3.5 inline mr-1.5" />
          Warna Tema
        </Label>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Primer</Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5"
                />
              </div>
              <Input
                value={primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="text-xs font-mono h-9"
                maxLength={7}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Sekunder</Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => updateField("secondaryColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5"
                />
              </div>
              <Input
                value={secondaryColor}
                onChange={(e) => updateField("secondaryColor", e.target.value)}
                className="text-xs font-mono h-9"
                maxLength={7}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Gelap</Label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => updateField("darkColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5"
                />
              </div>
              <Input
                value={darkColor}
                onChange={(e) => updateField("darkColor", e.target.value)}
                className="text-xs font-mono h-9"
                maxLength={7}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Telepon
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="phone"
              value={phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="(0532) 882123"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="instEmail" className="text-sm font-medium text-gray-700">
            Email Instansi
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="instEmail"
              type="email"
              value={email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="bkad@seruyankab.go.id"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          Alamat
        </Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="Jl. Trans Kalimantan, Kuala Pembuang..."
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="workHours" className="text-sm font-medium text-gray-700">
          Jam Kerja
        </Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="workHours"
            value={workHours}
            onChange={(e) => updateField("workHours", e.target.value)}
            placeholder="Senin - Jumat, 08:00 - 16:00 WIB"
            className="pl-10"
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="mt-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Preview Header
        </Label>
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Simulated header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: darkColor }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <span className="text-white font-bold text-sm">
                {appShortName?.charAt(0) || "B"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">
                {appName || "Nama Instansi"}
              </p>
              <p
                className="text-xs font-medium truncate"
                style={{ color: secondaryColor }}
              >
                {appSubtitle || "Subtitle / Daerah"}
              </p>
            </div>
          </div>
          {/* Simulated navbar */}
          <div
            className="px-4 py-2 flex gap-3"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="text-white text-xs font-medium">Beranda</span>
            <span className="text-white/70 text-xs">Profil</span>
            <span className="text-white/70 text-xs">Berita</span>
            <span className="text-white/70 text-xs">Layanan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 3: Navigation Menus                                                  */
/* -------------------------------------------------------------------------- */

function NavigationMenusStep() {
  const { menuOptions, toggleMenu } = useSetupStore();

  const selectedCount = menuOptions.filter((m) => m.selected).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="text-center mb-2">
        <div className="w-12 h-12 rounded-full bg-bkad-green/10 flex items-center justify-center mx-auto mb-3">
          <Menu className="w-6 h-6 text-bkad-green" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Menu Navigasi</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pilih menu yang akan ditampilkan di navbar website
        </p>
      </div>

      {/* Count indicator */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-gray-600">
          Menu dipilih:{" "}
          <span className="font-semibold text-bkad-green">{selectedCount}</span>{" "}
          dari {menuOptions.length}
        </span>
        {selectedCount === 0 && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Pilih minimal 1 menu
          </span>
        )}
      </div>

      {/* Menu list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {menuOptions.map((option: SetupMenuOption) => {
          const IconComp = resolveMenuIcon(option.icon);
          return (
            <label
              key={option.slug}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                option.selected
                  ? "border-bkad-green/30 bg-bkad-green/5 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Checkbox
                checked={option.selected}
                onCheckedChange={() => toggleMenu(option.slug)}
                className={
                  option.selected
                    ? "data-[state=checked]:bg-bkad-green data-[state=checked]:border-bkad-green"
                    : ""
                }
              />
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  option.selected ? "bg-bkad-green/10" : "bg-gray-100"
                }`}
              >
                <IconComp
                  className={`w-4 h-4 ${
                    option.selected ? "text-bkad-green" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    option.selected ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {option.label}
                </p>
                <p className="text-xs text-gray-400 font-mono">/{option.slug}</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Menu tambahan dapat ditambahkan melalui panel admin setelah setup
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 4: Complete / Finish                                                 */
/* -------------------------------------------------------------------------- */

function CompleteStep() {
  const { loading, error, adminName, adminEmail, appName, menuOptions, submitSetup } =
    useSetupStore();

  const selectedMenus = menuOptions.filter((m) => m.selected);

  return (
    <div className="flex flex-col items-center text-center py-4 animate-fade-in">
      {/* Success animation */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        {/* Decorative rings */}
        <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-green-200 animate-ping-slow" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Selesai!</h2>
      <p className="text-sm text-gray-500 mb-8">
        Website Anda telah siap digunakan
      </p>

      {/* Summary */}
      <div className="w-full space-y-3 mb-8">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-bkad-green/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-bkad-green" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-xs text-gray-500">Akun Administrator</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {adminName || "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate">{adminEmail}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-bkad-gold/10 flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4 text-bkad-gold" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-xs text-gray-500">Identitas Website</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {appName || "Website"}
            </p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-bkad-green/10 flex items-center justify-center flex-shrink-0">
            <Menu className="w-4 h-4 text-bkad-green" />
          </div>
          <div className="text-left flex-1">
            <p className="text-xs text-gray-500">Menu Navigasi</p>
            <p className="text-sm font-semibold text-gray-800">
              {selectedMenus.length} menu item dikonfigurasi
            </p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="w-full flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit button */}
      <Button
        onClick={submitSetup}
        disabled={loading}
        size="lg"
        className="w-full max-w-xs bg-bkad-green hover:bg-bkad-green/90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-bkad-green/20 transition-all duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Menyimpan Konfigurasi...
          </>
        ) : (
          <>
            Simpan & Selesaikan
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Validation helpers                                                        */
/* -------------------------------------------------------------------------- */

function validateStep(step: number): boolean {
  const state = useSetupStore.getState();

  switch (step) {
    case 1: {
      if (!state.adminName.trim()) return false;
      if (!state.adminEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.adminEmail))
        return false;
      if (state.adminPassword.length < 8) return false;
      if (state.adminPassword !== state.adminConfirmPassword) return false;
      return true;
    }
    case 2: {
      if (!state.appName.trim()) return false;
      if (!state.appShortName.trim()) return false;
      return true;
    }
    case 3: {
      if (!state.menuOptions.some((m) => m.selected)) return false;
      return true;
    }
    default:
      return true;
  }
}

/* -------------------------------------------------------------------------- */
/*  Main SetupWizard Component                                                */
/* -------------------------------------------------------------------------- */

export default function SetupWizard() {
  const {
    currentStep,
    completed,
    loading,
    nextStep,
    prevStep,
    setStep,
    adminEmail,
    adminPassword,
  } = useSetupStore();

  const { login } = useAuthStore();
  const { navigate } = usePageRouter();
  const fetchIdentity = useAppIdentityStore((s) => s.fetchIdentity);

  const [submitting, setSubmitting] = useState(false);

  // Auto-login and navigate after setup completes
  const handleAutoLogin = async () => {
    setSubmitting(true);
    try {
      const loginSuccess = await login(adminEmail, adminPassword);
      if (loginSuccess) {
        await fetchIdentity();
        navigate("home");
      } else {
        navigate("login");
      }
    } catch {
      navigate("login");
    } finally {
      setSubmitting(false);
    }
  };

  // When setup is completed (step 4), show the login button
  const isSetupDone = completed && currentStep === 4;

  const handleNext = () => {
    if (currentStep === 3) {
      // Moving from step 3 to step 4 — no validation needed for step 4
      nextStep();
    } else {
      if (validateStep(currentStep)) {
        nextStep();
      }
    }
  };

  const canGoNext = (() => {
    if (currentStep === 0) return true;
    if (currentStep === 4) return false;
    return validateStep(currentStep);
  })();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-bkad-dark via-bkad-green to-bkad-dark px-4 overflow-y-auto">
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.07] bg-bkad-gold" />
        <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full opacity-[0.07] bg-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full opacity-[0.03] bg-bkad-gold" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-[0.04] bg-bkad-gold animate-pulse" />
      </div>

      <div className="relative w-full max-w-2xl my-8">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 pt-6">
            {/* Step indicator — hidden on step 0, shown on steps 1-4 */}
            {currentStep > 0 && <StepIndicator currentStep={currentStep} />}
          </CardHeader>

          <CardContent className="pt-0 pb-6">
            {/* Step content */}
            {currentStep === 0 && (
              <WelcomeStep onStart={() => setStep(1)} />
            )}
            {currentStep === 1 && <AdminAccountStep />}
            {currentStep === 2 && <SiteIdentityStep />}
            {currentStep === 3 && <NavigationMenusStep />}
            {currentStep === 4 && <CompleteStep />}

            {/* Navigation buttons */}
            {currentStep > 0 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                {currentStep < 4 ? (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={loading}
                    className="rounded-xl px-5"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Kembali
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 4 && (
                  <Button
                    onClick={handleNext}
                    disabled={!canGoNext || loading}
                    className="bg-bkad-green hover:bg-bkad-green/90 text-white rounded-xl px-5 shadow-md shadow-bkad-green/10"
                  >
                    Lanjutkan
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}

                {isSetupDone && (
                  <Button
                    onClick={handleAutoLogin}
                    disabled={submitting}
                    size="lg"
                    className="bg-bkad-green hover:bg-bkad-green/90 text-white font-semibold rounded-xl px-6 shadow-lg shadow-bkad-green/20"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Login & Mulai Kelola
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-white/30 mt-4">
          &copy; {new Date().getFullYear()} BKAD Kabupaten Seruyan &mdash; Setup
          Wizard
        </p>
      </div>

      {/* Custom animations via style tag */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }
        @keyframes pingSlow {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          75%,
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
