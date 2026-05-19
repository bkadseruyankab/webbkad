'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Building2,
  ClipboardList,
  UserCircle,
  Shield,
  Loader2,
  AlertCircle,
  Star,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { usePageRouter, pageTitles } from '@/stores/usePageRouter';

// ─── Types ───────────────────────────────────────────────────────────────────

interface IkmUnit {
  id: string;
  name: string;
  code: string;
  description: string;
  headName: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  order: number;
}

interface IkmSurveyPeriod {
  id: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  active: boolean;
  description: string;
}

interface IkmSubmission {
  unitId: string;
  surveyPeriodId: string;
  ind1: number;
  ind2: number;
  ind3: number;
  ind4: number;
  ind5: number;
  ind6: number;
  ind7: number;
  ind8: number;
  ind9: number;
  respondentName: string;
  respondentAge: string;
  respondentGender: string;
  respondentEdu: string;
  respondentJob: string;
  suggestions: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INDICATORS = [
  { key: 'ind1', name: 'Persyaratan Pelayanan', description: 'Kemudahan persyaratan pelayanan yang diberikan' },
  { key: 'ind2', name: 'Prosedur Pelayanan', description: 'Kemudahan prosedur pelayanan yang diberikan' },
  { key: 'ind3', name: 'Waktu Pelayanan', description: 'Kecepatan waktu pelayanan yang diberikan' },
  { key: 'ind4', name: 'Biaya/Tarif Pelayanan', description: 'Kewajaran biaya/tarif dalam pelayanan' },
  { key: 'ind5', name: 'Produk Pelayanan', description: 'Kesesuaian produk pelayanan yang diberikan' },
  { key: 'ind6', name: 'Kompetensi Petugas', description: 'Kompetensi/kemampuan petugas dalam pelayanan' },
  { key: 'ind7', name: 'Perilaku Petugas', description: 'Perilaku kesopanan dan keramahan petugas' },
  { key: 'ind8', name: 'Penanganan Pengaduan', description: 'Penanganan pengaduan, saran dan masukan' },
  { key: 'ind9', name: 'Sarana dan Prasarana', description: 'Kualitas sarana dan prasarana pelayanan' },
];

const RATING_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Tidak Baik', shortLabel: 'TB', bgClass: 'bg-red-50 hover:bg-red-100 border-red-200', activeBgClass: 'bg-red-500 border-red-500 text-white', activeEmoji: 'bg-red-600' },
  { value: 2, emoji: '😐', label: 'Kurang Baik', shortLabel: 'KB', bgClass: 'bg-orange-50 hover:bg-orange-100 border-orange-200', activeBgClass: 'bg-orange-500 border-orange-500 text-white', activeEmoji: 'bg-orange-600' },
  { value: 3, emoji: '🙂', label: 'Baik', shortLabel: 'B', bgClass: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200', activeBgClass: 'bg-emerald-500 border-emerald-500 text-white', activeEmoji: 'bg-emerald-600' },
  { value: 4, emoji: '😊', label: 'Sangat Baik', shortLabel: 'SB', bgClass: 'bg-bkad-green/10 hover:bg-bkad-green/20 border-bkad-green/30', activeBgClass: 'bg-bkad-green border-bkad-green text-white', activeEmoji: 'bg-bkad-dark' },
];

const AGE_RANGES = ['<20', '20-30', '31-40', '41-50', '>50'];
const GENDER_OPTIONS = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];
const EDUCATION_OPTIONS = ['SD', 'SMP', 'SMA/sederajat', 'D3', 'S1', 'S2', 'S3'];
const OCCUPATION_OPTIONS = ['PNS', 'Swasta', 'Wiraswasta', 'TNI/Polri', 'Pelajar/Mahasiswa', 'Pensiunan', 'Lainnya'];

// ─── Animation Variants ─────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
};

const successVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 400 - 200,
  y: Math.random() * 400 - 200,
  rotation: Math.random() * 360,
  scale: Math.random() * 0.5 + 0.5,
  color: ['#0D6B3F', '#C5960C', '#22C55E', '#F59E0B', '#064E2B', '#3B82F6'][i % 6],
  delay: Math.random() * 0.3,
}));

// ─── Sub-Components ──────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: 'Pilih Layanan', icon: Building2 },
    { num: 2, label: 'Penilaian', icon: ClipboardList },
    { num: 3, label: 'Data Diri', icon: UserCircle },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isActive = currentStep === s.num;
        const isCompleted = currentStep > s.num;

        return (
          <div key={s.num} className="flex items-center">
            <motion.div
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-bkad-green text-white shadow-lg shadow-bkad-green/25'
                  : isCompleted
                  ? 'bg-bkad-green/10 text-bkad-green'
                  : 'bg-gray-100 text-gray-400'
              }`}
              whileHover={{ scale: 1.02 }}
              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  isActive
                    ? 'bg-white text-bkad-green'
                    : isCompleted
                    ? 'bg-bkad-green text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-1 transition-all duration-300 ${
                  isCompleted ? 'bg-bkad-green' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RatingCard({
  indicator,
  indicatorIndex,
  selectedValue,
  onSelect,
}: {
  indicator: (typeof INDICATORS)[0];
  indicatorIndex: number;
  selectedValue: number;
  onSelect: (key: string, value: number) => void;
}) {
  return (
    <motion.div
      custom={indicatorIndex}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-bkad-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-bkad-green font-bold text-sm">{indicatorIndex + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold text-gray-900 leading-tight">
                {indicator.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">{indicator.description}</p>
            </div>
            {selectedValue > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex-shrink-0"
              >
                <CheckCircle className="w-5 h-5 text-bkad-green" />
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RATING_OPTIONS.map((opt) => {
              const isSelected = selectedValue === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(indicator.key, opt.value)}
                  className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? opt.activeBgClass + ' shadow-md'
                      : opt.bgClass
                  }`}
                >
                  <span className={`text-2xl ${isSelected ? 'scale-110' : ''} transition-transform`}>
                    {opt.emoji}
                  </span>
                  <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                    {opt.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ConfettiEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confettiParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
            scale: [0, p.scale, p.scale * 0.5],
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: 'easeOut',
          }}
          className="absolute left-1/2 top-1/2 w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function IkmSurveyPage() {
  const { currentPage } = usePageRouter();

  // State
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [units, setUnits] = useState<IkmUnit[]>([]);
  const [surveyPeriod, setSurveyPeriod] = useState<IkmSurveyPeriod | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [respondentName, setRespondentName] = useState('');
  const [respondentAge, setRespondentAge] = useState('');
  const [respondentGender, setRespondentGender] = useState('');
  const [respondentEdu, setRespondentEdu] = useState('');
  const [respondentJob, setRespondentJob] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch units and active survey period
  useEffect(() => {
    async function fetchData() {
      try {
        const [unitsRes, periodsRes] = await Promise.all([
          fetch('/api/ikm/units'),
          fetch('/api/ikm/survey-periods?active=true'),
        ]);

        const unitsData = await unitsRes.json();
        const periodsData = await periodsRes.json();

        if (unitsData.success) {
          setUnits(unitsData.data || []);
        }
        if (periodsData.success && periodsData.data?.length > 0) {
          setSurveyPeriod(periodsData.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch IKM data:', err);
        setError('Gagal memuat data survei. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Computed
  const ratedCount = Object.values(ratings).filter((v) => v > 0).length;
  const allRated = ratedCount === 9;

  // Handlers
  const handleRatingSelect = useCallback((key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const goToStep = useCallback(
    (newStep: number) => {
      setDirection(newStep > step ? 1 : -1);
      setStep(newStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [step]
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedUnitId || !surveyPeriod || !allRated || !suggestions.trim()) return;

    setSubmitting(true);
    try {
      const payload: IkmSubmission = {
        unitId: selectedUnitId,
        surveyPeriodId: surveyPeriod.id,
        ind1: ratings.ind1 || 0,
        ind2: ratings.ind2 || 0,
        ind3: ratings.ind3 || 0,
        ind4: ratings.ind4 || 0,
        ind5: ratings.ind5 || 0,
        ind6: ratings.ind6 || 0,
        ind7: ratings.ind7 || 0,
        ind8: ratings.ind8 || 0,
        ind9: ratings.ind9 || 0,
        respondentName,
        respondentAge,
        respondentGender,
        respondentEdu,
        respondentJob,
        suggestions,
      };

      const res = await fetch('/api/ikm/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Gagal mengirim survei. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedUnitId, surveyPeriod, allRated, ratings, suggestions, respondentName, respondentAge, respondentGender, respondentEdu, respondentJob]);

  const handleReset = useCallback(() => {
    setStep(1);
    setDirection(1);
    setSelectedUnitId('');
    setRatings({});
    setRespondentName('');
    setRespondentAge('');
    setRespondentGender('');
    setRespondentEdu('');
    setRespondentJob('');
    setSuggestions('');
    setSubmitted(false);
    setError('');
  }, []);

  const selectedUnit = units.find((u) => u.id === selectedUnitId);

  // ─── Render ──────────────────────────────────────────────────────────────

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-bkad-green animate-spin" />
          <p className="text-gray-500 font-medium">Memuat data survei...</p>
        </div>
      </div>
    );
  }

  // Error / no active period
  if (!loading && !surveyPeriod) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="bg-gradient-to-r from-bkad-dark via-bkad-green to-bkad-green rounded-2xl p-6 md:p-10 text-white mb-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Survei Kepuasan Masyarakat</h1>
            <p className="text-white/80 text-sm md:text-base">
              Indeks Kepuasan Masyarakat (IKM) sesuai Permenpan-RB No. 14 Tahun 2017
            </p>
          </div>
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Survei Belum Tersedia</h2>
            <p className="text-gray-600 mb-6">
              Saat ini tidak ada periode survei yang aktif. Silakan kembali lagi nanti.
            </p>
            <Button
              onClick={() => usePageRouter.getState().goHome()}
              variant="outline"
              className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Hero */}
          <div className="bg-gradient-to-r from-bkad-dark via-bkad-green to-bkad-green rounded-2xl p-6 md:p-10 text-white mb-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Survei Kepuasan Masyarakat</h1>
            <p className="text-white/80 text-sm md:text-base">
              Indeks Kepuasan Masyarakat (IKM) sesuai Permenpan-RB No. 14 Tahun 2017
            </p>
          </div>

          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <ConfettiEffect />
            <Card className="p-8 md:p-12 text-center border-bkad-green/20 shadow-lg overflow-hidden">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                className="w-24 h-24 bg-bkad-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-14 h-14 text-bkad-green" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
              >
                Terima Kasih!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-2 text-lg"
              >
                Survei kepuasan masyarakat Anda telah berhasil dikirim.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-500 mb-8 text-sm"
              >
                Masukan Anda sangat berarti untuk meningkatkan kualitas pelayanan kami.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-bkad-green text-bkad-green hover:bg-bkad-green hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Isi Survei Lagi
                </Button>
                <Button
                  onClick={() => usePageRouter.getState().goHome()}
                  className="bg-bkad-green hover:bg-bkad-dark text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a
            onClick={() => usePageRouter.getState().goHome()}
            className="hover:text-bkad-green cursor-pointer transition-colors"
          >
            Beranda
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium">Survei Kepuasan Masyarakat</span>
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-bkad-dark via-bkad-green to-bkad-green rounded-2xl p-6 md:p-10 text-white mb-8 shadow-lg relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-bkad-gold/10 rounded-full" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-6 h-6 text-bkad-gold" />
              <span className="text-bkad-gold font-semibold text-sm tracking-wider uppercase">
                Survei Kepuasan Masyarakat
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Survei Kepuasan Masyarakat
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl">
              Indeks Kepuasan Masyarakat (IKM) sesuai Permenpan-RB No. 14 Tahun 2017
            </p>
            {surveyPeriod && (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <ClipboardList className="w-4 h-4" />
                <span className="font-medium">{surveyPeriod.title}</span>
                {surveyPeriod.startDate && surveyPeriod.endDate && (
                  <span className="text-white/60">
                    ({new Date(surveyPeriod.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(surveyPeriod.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium text-sm">Terjadi Kesalahan</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* ─── Step 1: Select Unit & Period ─── */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <Card className="shadow-md border-gray-100">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bkad-green/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-bkad-green" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Pilih Unit Layanan
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Pilih unit layanan yang ingin Anda nilai
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Unit Selection */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Unit Pelayanan <span className="text-red-500">*</span>
                      </label>
                      {units.length === 0 ? (
                        <div className="p-6 bg-gray-50 rounded-xl text-center">
                          <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Belum ada unit layanan yang tersedia</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {units
                            .filter((u) => u.active)
                            .sort((a, b) => a.order - b.order)
                            .map((unit) => {
                              const isSelected = selectedUnitId === unit.id;
                              return (
                                <motion.button
                                  key={unit.id}
                                  type="button"
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => setSelectedUnitId(unit.id)}
                                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                    isSelected
                                      ? 'border-bkad-green bg-bkad-green/5 shadow-md'
                                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        isSelected ? 'bg-bkad-green text-white' : 'bg-gray-100 text-gray-400'
                                      }`}
                                    >
                                      <Building2 className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className={`font-semibold text-sm ${
                                          isSelected ? 'text-bkad-green' : 'text-gray-900'
                                        }`}
                                      >
                                        {unit.name}
                                      </h4>
                                      {unit.description && (
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                          {unit.description}
                                        </p>
                                      )}
                                      {unit.headName && (
                                        <p className="text-xs text-gray-400 mt-1">
                                          Kepala: {unit.headName}
                                        </p>
                                      )}
                                    </div>
                                    {isSelected && (
                                      <CheckCircle className="w-5 h-5 text-bkad-green flex-shrink-0" />
                                    )}
                                  </div>
                                </motion.button>
                              );
                            })}
                        </div>
                      )}
                    </div>

                    {/* Selected Period Info */}
                    {surveyPeriod && (
                      <div className="p-4 bg-bkad-light rounded-xl border border-bkad-green/10">
                        <div className="flex items-center gap-2 mb-1">
                          <ClipboardList className="w-4 h-4 text-bkad-green" />
                          <span className="text-sm font-semibold text-bkad-green">Periode Survei Aktif</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{surveyPeriod.title}</p>
                        {surveyPeriod.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{surveyPeriod.description}</p>
                        )}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => goToStep(2)}
                        disabled={!selectedUnitId || !surveyPeriod}
                        className="bg-bkad-green hover:bg-bkad-dark text-white min-w-[140px]"
                      >
                        Lanjutkan
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ─── Step 2: Rate 9 Indicators ─── */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <Card className="shadow-md border-gray-100 mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bkad-green/10 rounded-xl flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-bkad-green" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">
                          Penilaian Indikator
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          Berikan penilaian Anda untuk setiap indikator
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Progress</p>
                        <p className="text-sm font-bold text-bkad-green">
                          {ratedCount}/9
                        </p>
                      </div>
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-bkad-green rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(ratedCount / 9) * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Selected unit reminder */}
              {selectedUnit && (
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 bg-bkad-light rounded-lg px-4 py-2.5">
                  <Building2 className="w-4 h-4 text-bkad-green flex-shrink-0" />
                  <span>Menilai: <strong className="text-bkad-green">{selectedUnit.name}</strong></span>
                </div>
              )}

              {/* Rating Cards */}
              <div className="space-y-4 mb-6">
                {INDICATORS.map((ind, i) => (
                  <RatingCard
                    key={ind.key}
                    indicator={ind}
                    indicatorIndex={i}
                    selectedValue={ratings[ind.key] || 0}
                    onSelect={handleRatingSelect}
                  />
                ))}
              </div>

              {/* Validation hint */}
              {!allRated && ratedCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-sm text-amber-700"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Masih ada <strong>{9 - ratedCount}</strong> indikator yang belum dinilai</span>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <Button
                  onClick={() => goToStep(1)}
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Kembali
                </Button>
                <Button
                  onClick={() => goToStep(3)}
                  disabled={!allRated}
                  className="bg-bkad-green hover:bg-bkad-dark text-white min-w-[140px]"
                >
                  Lanjutkan
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Demographics & Submit ─── */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <Card className="shadow-md border-gray-100">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bkad-green/10 rounded-xl flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-bkad-green" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Data Responden & Saran
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Lengkapi data diri (opsional) dan berikan saran Anda
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {/* Optional notice */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-600">
                        Data diri bersifat <strong>opsional</strong> dan dijamin kerahasiaannya. Survei ini bersifat anonim sesuai prinsip Permenpan-RB No. 14 Tahun 2017.
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Nama <span className="text-gray-400 font-normal">(opsional)</span>
                      </label>
                      <Input
                        value={respondentName}
                        onChange={(e) => setRespondentName(e.target.value)}
                        placeholder="Masukkan nama Anda"
                        className="focus-visible:ring-bkad-green"
                      />
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Usia <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <Select
                          value={respondentAge}
                          onValueChange={setRespondentAge}
                        >
                          <SelectTrigger className="focus:ring-bkad-green">
                            <SelectValue placeholder="Pilih rentang usia" />
                          </SelectTrigger>
                          <SelectContent>
                            {AGE_RANGES.map((age) => (
                              <SelectItem key={age} value={age}>
                                {age}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Jenis Kelamin <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <Select
                          value={respondentGender}
                          onValueChange={setRespondentGender}
                        >
                          <SelectTrigger className="focus:ring-bkad-green">
                            <SelectValue placeholder="Pilih jenis kelamin" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDER_OPTIONS.map((g) => (
                              <SelectItem key={g.value} value={g.value}>
                                {g.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Education & Occupation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Pendidikan Terakhir <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <Select
                          value={respondentEdu}
                          onValueChange={setRespondentEdu}
                        >
                          <SelectTrigger className="focus:ring-bkad-green">
                            <SelectValue placeholder="Pilih pendidikan" />
                          </SelectTrigger>
                          <SelectContent>
                            {EDUCATION_OPTIONS.map((edu) => (
                              <SelectItem key={edu} value={edu}>
                                {edu}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Pekerjaan <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <Select
                          value={respondentJob}
                          onValueChange={setRespondentJob}
                        >
                          <SelectTrigger className="focus:ring-bkad-green">
                            <SelectValue placeholder="Pilih pekerjaan" />
                          </SelectTrigger>
                          <SelectContent>
                            {OCCUPATION_OPTIONS.map((job) => (
                              <SelectItem key={job} value={job}>
                                {job}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Suggestions (Required) */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Saran dan Masukan <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        placeholder="Tuliskan saran, masukan, atau pengaduan Anda terkait pelayanan yang diberikan..."
                        rows={5}
                        className="focus-visible:ring-bkad-green resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Minimal 10 karakter
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Ringkasan Survei</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Unit:</span>
                          <p className="font-medium text-gray-900">{selectedUnit?.name || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Periode:</span>
                          <p className="font-medium text-gray-900">{surveyPeriod?.title || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Indikator:</span>
                          <p className="font-medium text-bkad-green">9/9 dinilai</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                      <Button
                        onClick={() => goToStep(2)}
                        variant="outline"
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Kembali
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || !suggestions.trim() || suggestions.trim().length < 10}
                        className="bg-bkad-green hover:bg-bkad-dark text-white min-w-[160px]"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Kirim Survei
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Privacy Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>
              Data survei dijamin kerahasiaannya sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik dan Permenpan-RB No. 14 Tahun 2017
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
