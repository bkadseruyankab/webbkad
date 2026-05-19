'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Award,
  Star,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Download,
  Search,
  RefreshCw,
  MessageSquare,
  Building2,
  ClipboardList,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  User,
  Activity,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IkmStatistics {
  totalRespondents: number;
  ikmValue: number;
  ikmQuality: string;
  ikmQualityLabel: string;
  indicators: Array<{
    name: string;
    code: string;
    nrr: number;
    nrrWeighted: number;
    mutu: string;
    distribution: Record<string, number>;
  }>;
  unitStats: Array<{
    unitId: string;
    unitName: string;
    totalRespondents: number;
    ikmValue: number;
    ikmQuality: string;
  }>;
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    education: Record<string, number>;
    occupation: Record<string, number>;
  };
  suggestions: string[];
}

interface IkmUnit {
  id: string;
  name: string;
  code: string;
  headName: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IkmSurveyPeriod {
  id: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  respondentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface IkmResponse {
  id: string;
  respondentName: string;
  unitId: string;
  unitName?: string;
  surveyPeriodId: string;
  surveyPeriodTitle?: string;
  indicators: number[];
  suggestion: string;
  age: string;
  gender: string;
  education: string;
  occupation: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUALITY_COLORS: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  A: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', hex: '#22c55e' },
  B: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', hex: '#3b82f6' },
  C: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', hex: '#f59e0b' },
  D: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', hex: '#ef4444' },
};

const PIE_COLORS = ['#0D6B3F', '#C5960C', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const INDICATOR_LABELS: Record<string, string> = {
  ind1: 'Persyaratan',
  ind2: 'Prosedur',
  ind3: 'Waktu',
  ind4: 'Biaya',
  ind5: 'Produk',
  ind6: 'Kompetensi',
  ind7: 'Perilaku',
  ind8: 'Sarana',
  ind9: 'Penanganan',
};

const ITEMS_PER_PAGE = 10;

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getQualityColor(quality: string) {
  return QUALITY_COLORS[quality] || QUALITY_COLORS['D'];
}

function getIkmQuality(ikmValue: number): { quality: string; label: string } {
  if (ikmValue >= 88.31) return { quality: 'A', label: 'Sangat Baik' };
  if (ikmValue >= 76.61) return { quality: 'B', label: 'Baik' };
  if (ikmValue >= 65.00) return { quality: 'C', label: 'Kurang Baik' };
  return { quality: 'D', label: 'Tidak Baik' };
}

function getGaugeColor(value: number): string {
  if (value >= 88.31) return '#22c55e';
  if (value >= 76.61) return '#3b82f6';
  if (value >= 65.00) return '#f59e0b';
  return '#ef4444';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── IKM Gauge Component ─────────────────────────────────────────────────────

function IkmGauge({ value }: { value: number }) {
  const clampedValue = Math.max(25, Math.min(100, value));
  const percentage = ((clampedValue - 25) / 75) * 100;
  const angle = (percentage / 100) * 180 - 90;
  const color = getGaugeColor(clampedValue);
  const { quality, label } = getIkmQuality(clampedValue);

  const radius = 80;
  const cx = 100;
  const cy = 100;

  const arcPath = (startAngle: number, endAngle: number, r: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const needleLength = 65;
  const needleRad = (angle * Math.PI) / 180;
  const needleX = cx + needleLength * Math.cos(needleRad - Math.PI / 2);
  const needleY = cy + needleLength * Math.sin(needleRad - Math.PI / 2);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[280px]">
        {/* Background arc segments */}
        <path d={arcPath(0, 45, radius)} fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
        <path d={arcPath(45, 90, radius)} fill="none" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round" />
        <path d={arcPath(90, 135, radius)} fill="none" stroke="#3b82f6" strokeWidth="14" strokeLinecap="round" />
        <path d={arcPath(135, 180, radius)} fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#1e293b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill="#1e293b" />

        {/* Labels */}
        <text x={cx - radius - 5} y={cy + 15} textAnchor="middle" fontSize="9" fill="#64748b">25</text>
        <text x={cx} y={cy + radius + 5} textAnchor="middle" fontSize="9" fill="#64748b">62.5</text>
        <text x={cx + radius + 5} y={cy + 15} textAnchor="middle" fontSize="9" fill="#64748b">100</text>

        {/* Zone labels */}
        <text x={cx - 52} y={cy - 15} textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="bold">D</text>
        <text x={cx - 25} y={cy - 55} textAnchor="middle" fontSize="7" fill="#f59e0b" fontWeight="bold">C</text>
        <text x={cx + 25} y={cy - 55} textAnchor="middle" fontSize="7" fill="#3b82f6" fontWeight="bold">B</text>
        <text x={cx + 52} y={cy - 15} textAnchor="middle" fontSize="7" fill="#22c55e" fontWeight="bold">A</text>
      </svg>

      <div className="text-center -mt-2">
        <div className="text-4xl font-bold" style={{ color }}>
          {clampedValue.toFixed(2)}
        </div>
        <Badge
          className={`mt-2 text-sm px-3 py-1 ${getQualityColor(quality).bg} ${getQualityColor(quality).text} ${getQualityColor(quality).border}`}
          variant="outline"
        >
          {quality} - {label}
        </Badge>
      </div>
    </div>
  );
}

// ─── Custom Tooltip Components ────────────────────────────────────────────────

function IndicatorTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-bkad-green font-semibold">NRR: {payload[0].value.toFixed(3)}</p>
    </div>
  );
}

function BarIndicatorTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-900">{data.name}</p>
      <p className="text-bkad-green font-semibold">NRR: {data.nrr.toFixed(3)}</p>
      <p className="text-xs text-gray-500 mt-1">Mutu: {data.mutu}</p>
    </div>
  );
}

function DemographicTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-900">{data.name}</p>
      <p className="font-semibold" style={{ color: data.payload.fill }}>
        {data.value} orang
      </p>
    </div>
  );
}

// ─── Unit Form Dialog ─────────────────────────────────────────────────────────

function UnitFormDialog({
  open,
  onOpenChange,
  unit,
  onSave,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: Partial<IkmUnit> | null;
  onSave: (data: Partial<IkmUnit>) => void;
  loading: boolean;
}) {
  const initialForm: Partial<IkmUnit> = unit || {
    name: '',
    code: '',
    headName: '',
    phone: '',
    email: '',
    isActive: true,
  };
  const [form, setForm] = useState<Partial<IkmUnit>>(initialForm);

  // Reset form when unit prop changes
  const unitKey = unit?.id ?? 'new';
  const handleOpenChange = (val: boolean) => {
    if (val) {
      setForm(initialForm);
    }
    onOpenChange(val);
  };

  const handleSubmit = () => {
    if (!form.name?.trim() || !form.code?.trim()) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" key={unitKey}>
        <DialogHeader>
          <DialogTitle>{unit?.id ? 'Edit Unit Layanan' : 'Tambah Unit Layanan'}</DialogTitle>
          <DialogDescription>
            {unit?.id ? 'Ubah informasi unit layanan' : 'Tambahkan unit layanan baru'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nama Unit *</label>
            <Input
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama unit layanan"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Kode *</label>
            <Input
              value={form.code || ''}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="Kode unit (contoh: UL-01)"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Kepala Unit</label>
            <Input
              value={form.headName || ''}
              onChange={(e) => setForm({ ...form, headName: e.target.value })}
              placeholder="Nama kepala unit"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Telepon</label>
              <Input
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="No. telepon"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                type="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select
              value={form.isActive ? 'active' : 'inactive'}
              onValueChange={(val) => setForm({ ...form, isActive: val === 'active' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !form.name?.trim() || !form.code?.trim()}
            className="bg-bkad-green hover:bg-bkad-dark text-white"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Period Form Dialog ───────────────────────────────────────────────────────

function PeriodFormDialog({
  open,
  onOpenChange,
  period,
  onSave,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: Partial<IkmSurveyPeriod> | null;
  onSave: (data: Partial<IkmSurveyPeriod>) => void;
  loading: boolean;
}) {
  const initialForm: Partial<IkmSurveyPeriod> = period || {
    title: '',
    period: '',
    startDate: '',
    endDate: '',
    isActive: true,
  };
  const [form, setForm] = useState<Partial<IkmSurveyPeriod>>(initialForm);

  // Reset form when period prop changes
  const periodKey = period?.id ?? 'new';
  const handleOpenChange = (val: boolean) => {
    if (val) {
      setForm(initialForm);
    }
    onOpenChange(val);
  };

  const handleSubmit = () => {
    if (!form.title?.trim() || !form.period?.trim()) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" key={periodKey}>
        <DialogHeader>
          <DialogTitle>{period?.id ? 'Edit Periode Survei' : 'Tambah Periode Survei'}</DialogTitle>
          <DialogDescription>
            {period?.id ? 'Ubah informasi periode survei' : 'Tambahkan periode survei baru'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Judul *</label>
            <Input
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Judul periode survei"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Periode *</label>
            <Input
              value={form.period || ''}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              placeholder="Contoh: 2024-I, 2024-II"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
              <Input
                type="date"
                value={form.startDate ? form.startDate.split('T')[0] : ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
              <Input
                type="date"
                value={form.endDate ? form.endDate.split('T')[0] : ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select
              value={form.isActive ? 'active' : 'inactive'}
              onValueChange={(val) => setForm({ ...form, isActive: val === 'active' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !form.title?.trim() || !form.period?.trim()}
            className="bg-bkad-green hover:bg-bkad-dark text-white"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IkmDashboardPage() {
  const { toast } = useToast();

  // ── Shared State ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');
  const [surveyPeriods, setSurveyPeriods] = useState<IkmSurveyPeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');

  // ── Dashboard Overview State ─────────────────────────────────────────────
  const [statistics, setStatistics] = useState<IkmStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Units State ──────────────────────────────────────────────────────────
  const [units, setUnits] = useState<IkmUnit[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [unitDialogOpen, setUnitDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Partial<IkmUnit> | null>(null);
  const [unitSaving, setUnitSaving] = useState(false);
  const [deleteUnitDialog, setDeleteUnitDialog] = useState<IkmUnit | null>(null);

  // ── Periods State ────────────────────────────────────────────────────────
  const [periodsLoading, setPeriodsLoading] = useState(true);
  const [periodDialogOpen, setPeriodDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Partial<IkmSurveyPeriod> | null>(null);
  const [periodSaving, setPeriodSaving] = useState(false);
  const [deletePeriodDialog, setDeletePeriodDialog] = useState<IkmSurveyPeriod | null>(null);

  // ── Responses State ──────────────────────────────────────────────────────
  const [responses, setResponses] = useState<IkmResponse[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(true);
  const [responsesPage, setResponsesPage] = useState(1);
  const [responsesTotal, setResponsesTotal] = useState(0);
  const [filterUnitId, setFilterUnitId] = useState<string>('all');
  const [filterPeriodId, setFilterPeriodId] = useState<string>('all');
  const [deleteResponseDialog, setDeleteResponseDialog] = useState<IkmResponse | null>(null);

  // ── Data Fetching ────────────────────────────────────────────────────────

  const fetchStatistics = useCallback(async () => {
    setStatsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedPeriodId) params.set('surveyPeriodId', selectedPeriodId);
      const res = await fetch(`/api/ikm/statistics?${params.toString()}`);
      const result = await res.json();
      if (result.success || result.data) {
        setStatistics(result.data || result);
      }
    } catch (err) {
      console.error('Error fetching IKM statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [selectedPeriodId]);

  const fetchUnits = useCallback(async () => {
    setUnitsLoading(true);
    try {
      const res = await fetch('/api/ikm/units');
      const result = await res.json();
      if (result.success || result.data) {
        setUnits(result.data || result);
      }
    } catch (err) {
      console.error('Error fetching units:', err);
    } finally {
      setUnitsLoading(false);
    }
  }, []);

  const fetchPeriods = useCallback(async () => {
    setPeriodsLoading(true);
    try {
      const res = await fetch('/api/ikm/survey-periods');
      const result = await res.json();
      if (result.success || result.data) {
        const data = result.data || result;
        setSurveyPeriods(data);
        // Auto-select active period
        if (!selectedPeriodId && data.length > 0) {
          const activePeriod = data.find((p: IkmSurveyPeriod) => p.isActive);
          setSelectedPeriodId(activePeriod?.id || data[0]?.id || '');
        }
      }
    } catch (err) {
      console.error('Error fetching periods:', err);
    } finally {
      setPeriodsLoading(false);
    }
  }, [selectedPeriodId]);

  const fetchResponses = useCallback(async () => {
    setResponsesLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', responsesPage.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());
      if (filterUnitId && filterUnitId !== 'all') params.set('unitId', filterUnitId);
      if (filterPeriodId && filterPeriodId !== 'all') params.set('surveyPeriodId', filterPeriodId);

      const res = await fetch(`/api/ikm/responses?${params.toString()}`);
      const result = await res.json();
      if (result.success || result.data) {
        setResponses(result.data || result.items || result);
        setResponsesTotal(result.total || result.data?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching responses:', err);
    } finally {
      setResponsesLoading(false);
    }
  }, [responsesPage, filterUnitId, filterPeriodId]);

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  useEffect(() => {
    if (activeTab === 'responses') {
      fetchResponses();
    }
  }, [activeTab, fetchResponses]);

  // ── Unit CRUD Handlers ──────────────────────────────────────────────────

  const handleSaveUnit = async (data: Partial<IkmUnit>) => {
    setUnitSaving(true);
    try {
      const isEdit = !!data.id;
      const url = isEdit ? `/api/ikm/units/${data.id}` : '/api/ikm/units';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        toast({
          title: isEdit ? 'Unit diperbarui' : 'Unit ditambahkan',
          description: `Unit layanan berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}`,
        });
        setUnitDialogOpen(false);
        setEditingUnit(null);
        fetchUnits();
      } else {
        toast({ title: 'Gagal', description: result.error || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan jaringan', variant: 'destructive' });
    } finally {
      setUnitSaving(false);
    }
  };

  const handleDeleteUnit = async (unit: IkmUnit) => {
    try {
      const res = await fetch(`/api/ikm/units/${unit.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Unit dihapus', description: 'Unit layanan berhasil dihapus' });
        fetchUnits();
      } else {
        toast({ title: 'Gagal', description: result.error || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan jaringan', variant: 'destructive' });
    }
    setDeleteUnitDialog(null);
  };

  // ── Period CRUD Handlers ────────────────────────────────────────────────

  const handleSavePeriod = async (data: Partial<IkmSurveyPeriod>) => {
    setPeriodSaving(true);
    try {
      const isEdit = !!data.id;
      const url = isEdit ? `/api/ikm/survey-periods/${data.id}` : '/api/ikm/survey-periods';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        toast({
          title: isEdit ? 'Periode diperbarui' : 'Periode ditambahkan',
          description: `Periode survei berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}`,
        });
        setPeriodDialogOpen(false);
        setEditingPeriod(null);
        fetchPeriods();
      } else {
        toast({ title: 'Gagal', description: result.error || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan jaringan', variant: 'destructive' });
    } finally {
      setPeriodSaving(false);
    }
  };

  const handleDeletePeriod = async (period: IkmSurveyPeriod) => {
    try {
      const res = await fetch(`/api/ikm/survey-periods/${period.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Periode dihapus', description: 'Periode survei berhasil dihapus' });
        fetchPeriods();
      } else {
        toast({ title: 'Gagal', description: result.error || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan jaringan', variant: 'destructive' });
    }
    setDeletePeriodDialog(null);
  };

  // ── Response Handlers ───────────────────────────────────────────────────

  const handleDeleteResponse = async (response: IkmResponse) => {
    try {
      const res = await fetch(`/api/ikm/responses/${response.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Responden dihapus', description: 'Data responden berhasil dihapus' });
        fetchResponses();
        fetchStatistics();
      } else {
        toast({ title: 'Gagal', description: result.error || 'Terjadi kesalahan', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan jaringan', variant: 'destructive' });
    }
    setDeleteResponseDialog(null);
  };

  const handleExportCSV = () => {
    if (!responses.length) {
      toast({ title: 'Tidak ada data', description: 'Tidak ada data untuk diekspor', variant: 'destructive' });
      return;
    }

    const headers = [
      'No',
      'Nama',
      'Unit',
      'Periode',
      ...Object.values(INDICATOR_LABELS),
      'Saran',
      'Umur',
      'Jenis Kelamin',
      'Pendidikan',
      'Pekerjaan',
      'Tanggal',
    ];

    const rows = responses.map((r, idx) => [
      idx + 1,
      r.respondentName || '-',
      r.unitName || '-',
      r.surveyPeriodTitle || '-',
      ...(r.indicators || Array(9).fill('-')),
      r.suggestion || '-',
      r.age || '-',
      r.gender || '-',
      r.education || '-',
      r.occupation || '-',
      formatDate(r.createdAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ikm_responses_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Berhasil', description: 'Data berhasil diekspor ke CSV' });
  };

  // ── Derived Data ─────────────────────────────────────────────────────────

  const radarData = statistics?.indicators?.map((ind) => ({
    name: INDICATOR_LABELS[ind.code] || ind.name || ind.code,
    nrr: ind.nrr,
    fullMark: 4,
  })) || [];

  const barData = statistics?.indicators?.map((ind) => ({
    name: INDICATOR_LABELS[ind.code] || ind.name || ind.code,
    nrr: ind.nrr,
    mutu: ind.mutu,
  })) || [];

  const demographicPieData = (data: Record<string, number>) =>
    Object.entries(data || {}).map(([key, value]) => ({
      name: key,
      value,
    }));

  const trendData = surveyPeriods
    .filter((p) => p.respondentCount > 0)
    .map((p) => {
      const unitStat = statistics?.unitStats?.find(
        (u) => u.unitId === p.id
      );
      return {
        period: p.period || p.title,
        ikm: unitStat?.ikmValue || 0,
        respondents: p.respondentCount,
      };
    });

  const activePeriod = surveyPeriods.find((p) => p.id === selectedPeriodId);

  const totalPages = Math.ceil(responsesTotal / ITEMS_PER_PAGE);

  // ── Loading Skeleton ─────────────────────────────────────────────────────

  const renderSkeleton = (rows: number = 4) => (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard IKM
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Indeks Kepuasan Masyarakat - Panel Administrasi
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedPeriodId}
              onValueChange={setSelectedPeriodId}
            >
              <SelectTrigger className="w-[220px]">
                <Calendar className="w-4 h-4 mr-2 text-bkad-green" />
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                {surveyPeriods.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title} ({p.period})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                fetchStatistics();
                fetchUnits();
                fetchPeriods();
              }}
              className="border-bkad-green/30 text-bkad-green hover:bg-bkad-light"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="overview" className="gap-1.5">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="units" className="gap-1.5">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Unit Layanan</span>
            </TabsTrigger>
            <TabsTrigger value="periods" className="gap-1.5">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Periode Survei</span>
            </TabsTrigger>
            <TabsTrigger value="responses" className="gap-1.5">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Data Responden</span>
            </TabsTrigger>
          </TabsList>

          {/* ═════════════════════════════════════════════════════════════════
              TAB 1: DASHBOARD OVERVIEW
              ═════════════════════════════════════════════════════════════════ */}
          <TabsContent value="overview">
            <AnimatePresence mode="wait">
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* ── KPI Cards ─────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                  {/* Total Responden */}
                  <Card className="border-bkad-green/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total Responden</p>
                          {statsLoading ? (
                            <Skeleton className="h-8 w-16" />
                          ) : (
                            <p className="text-3xl font-bold text-gray-900">
                              {statistics?.totalRespondents ?? 0}
                            </p>
                          )}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-bkad-green/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-bkad-green" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Nilai IKM */}
                  <Card className="border-bkad-green/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Nilai IKM</p>
                          {statsLoading ? (
                            <Skeleton className="h-8 w-24" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="text-3xl font-bold text-gray-900">
                                {(statistics?.ikmValue ?? 0).toFixed(2)}
                              </p>
                              {statistics?.ikmQuality && (
                                <Badge
                                  className={`${getQualityColor(statistics.ikmQuality).bg} ${getQualityColor(statistics.ikmQuality).text} ${getQualityColor(statistics.ikmQuality).border}`}
                                  variant="outline"
                                >
                                  {statistics.ikmQuality}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-bkad-gold/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-bkad-gold" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mutu Pelayanan */}
                  <Card className="border-bkad-green/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Mutu Pelayanan</p>
                          {statsLoading ? (
                            <Skeleton className="h-8 w-28" />
                          ) : (
                            <Badge
                              className={`text-base px-3 py-1 ${getQualityColor(statistics?.ikmQuality || 'D').bg} ${getQualityColor(statistics?.ikmQuality || 'D').text} ${getQualityColor(statistics?.ikmQuality || 'D').border}`}
                              variant="outline"
                            >
                              {statistics?.ikmQualityLabel || 'Belum ada data'}
                            </Badge>
                          )}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Star className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Periode Aktif */}
                  <Card className="border-bkad-green/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Periode Aktif</p>
                          {statsLoading ? (
                            <Skeleton className="h-8 w-32" />
                          ) : (
                            <p className="text-lg font-bold text-gray-900 truncate max-w-[180px]">
                              {activePeriod?.title || 'Tidak ada'}
                            </p>
                          )}
                          {activePeriod?.period && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {activePeriod.period}
                            </p>
                          )}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ── Gauge + Radar Chart ────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                  {/* IKM Gauge */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="w-5 h-5 text-bkad-green" />
                        Indikator IKM
                      </CardTitle>
                      <CardDescription>
                        Skala 25 - 100 | Kualitas Pelayanan
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-2 flex justify-center">
                      {statsLoading ? (
                        <div className="h-48 w-48 flex items-center justify-center">
                          <Skeleton className="h-40 w-40 rounded-full" />
                        </div>
                      ) : (
                        <IkmGauge value={statistics?.ikmValue ?? 0} />
                      )}
                    </CardContent>
                  </Card>

                  {/* Radar Chart */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="w-5 h-5 text-bkad-green" />
                        Radar Indikator (NRR)
                      </CardTitle>
                      <CardDescription>
                        Nilai NRR per indikator (skala 1-4)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-2">
                      {statsLoading ? (
                        <div className="h-[300px] flex items-center justify-center">
                          <Skeleton className="h-60 w-60 rounded-full" />
                        </div>
                      ) : radarData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">
                          <p>Belum ada data indikator</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis
                              dataKey="name"
                              tick={{ fontSize: 10, fill: '#64748b' }}
                            />
                            <PolarRadiusAxis
                              angle={30}
                              domain={[0, 4]}
                              tick={{ fontSize: 9 }}
                            />
                            <Radar
                              name="NRR"
                              dataKey="nrr"
                              stroke="#0D6B3F"
                              fill="#0D6B3F"
                              fillOpacity={0.25}
                              strokeWidth={2}
                            />
                            <Tooltip content={<IndicatorTooltip />} />
                          </RadarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* ── Bar Chart + Trend Chart ────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                  {/* Horizontal Bar Chart */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="w-5 h-5 text-bkad-gold" />
                        NRR per Indikator
                      </CardTitle>
                      <CardDescription>
                        Nilai NRR tertimbang setiap indikator
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-2">
                      {statsLoading ? (
                        <div className="h-[320px] flex items-center justify-center">
                          {renderSkeleton(9)}
                        </div>
                      ) : barData.length === 0 ? (
                        <div className="h-[320px] flex items-center justify-center text-gray-400">
                          <p>Belum ada data indikator</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 11 }} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              tick={{ fontSize: 10 }}
                              width={90}
                            />
                            <Tooltip content={<BarIndicatorTooltip />} />
                            <Bar
                              dataKey="nrr"
                              fill="#0D6B3F"
                              radius={[0, 6, 6, 0]}
                              maxBarSize={24}
                            >
                              {barData.map((entry, index) => (
                                <Cell
                                  key={`bar-${index}`}
                                  fill={
                                    entry.nrr >= 3.5
                                      ? '#22c55e'
                                      : entry.nrr >= 3.0
                                      ? '#3b82f6'
                                      : entry.nrr >= 2.5
                                      ? '#f59e0b'
                                      : '#ef4444'
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  {/* Trend Chart */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="w-5 h-5 text-bkad-green" />
                        Tren IKM per Periode
                      </CardTitle>
                      <CardDescription>
                        Perkembangan nilai IKM dari waktu ke waktu
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-2">
                      {statsLoading ? (
                        <div className="h-[320px] flex items-center justify-center">
                          {renderSkeleton(5)}
                        </div>
                      ) : trendData.length <= 1 ? (
                        <div className="h-[320px] flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p>Data tren belum tersedia</p>
                            <p className="text-xs mt-1">
                              Butuh lebih dari 1 periode survei
                            </p>
                          </div>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={320}>
                          <LineChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                            <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} width={40} />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;
                                return (
                                  <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm">
                                    <p className="font-medium text-gray-900 mb-1">{label}</p>
                                    <p className="text-bkad-green font-semibold">
                                      IKM: {payload[0].value?.toFixed(2)}
                                    </p>
                                    {payload[1] && (
                                      <p className="text-bkad-gold font-semibold">
                                        Responden: {payload[1].value}
                                      </p>
                                    )}
                                  </div>
                                );
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line
                              type="monotone"
                              dataKey="ikm"
                              name="Nilai IKM"
                              stroke="#0D6B3F"
                              strokeWidth={2.5}
                              dot={{ fill: '#0D6B3F', r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="respondents"
                              name="Jumlah Responden"
                              stroke="#C5960C"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={{ fill: '#C5960C', r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* ── Demographics Section ───────────────────────────────── */}
                <Card className="shadow-sm mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="w-5 h-5 text-bkad-green" />
                      Demografi Responden
                    </CardTitle>
                    <CardDescription>
                      Distribusi responden berdasarkan karakteristik demografis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-2">
                    {statsLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <Skeleton className="h-48 w-48 rounded-full" />
                          </div>
                        ))}
                      </div>
                    ) : !statistics?.demographics ||
                      Object.keys(statistics.demographics).length === 0 ? (
                      <div className="h-48 flex items-center justify-center text-gray-400">
                        <p>Belum ada data demografi</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Age Pie Chart */}
                        {statistics.demographics.age &&
                          Object.keys(statistics.demographics.age).length > 0 && (
                            <div className="flex flex-col items-center">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Usia</h4>
                              <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                  <Pie
                                    data={demographicPieData(statistics.demographics.age)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) =>
                                      `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                    labelLine={{ strokeDasharray: '2 2' }}
                                  >
                                    {demographicPieData(statistics.demographics.age).map((_, idx) => (
                                      <Cell
                                        key={`age-${idx}`}
                                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                        stroke="white"
                                        strokeWidth={1.5}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<DemographicTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                        {/* Gender Pie Chart */}
                        {statistics.demographics.gender &&
                          Object.keys(statistics.demographics.gender).length > 0 && (
                            <div className="flex flex-col items-center">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</h4>
                              <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                  <Pie
                                    data={demographicPieData(statistics.demographics.gender)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) =>
                                      `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                    labelLine={{ strokeDasharray: '2 2' }}
                                  >
                                    {demographicPieData(statistics.demographics.gender).map((_, idx) => (
                                      <Cell
                                        key={`gender-${idx}`}
                                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                        stroke="white"
                                        strokeWidth={1.5}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<DemographicTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                        {/* Education Pie Chart */}
                        {statistics.demographics.education &&
                          Object.keys(statistics.demographics.education).length > 0 && (
                            <div className="flex flex-col items-center">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Pendidikan</h4>
                              <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                  <Pie
                                    data={demographicPieData(statistics.demographics.education)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) =>
                                      `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                    labelLine={{ strokeDasharray: '2 2' }}
                                  >
                                    {demographicPieData(statistics.demographics.education).map((_, idx) => (
                                      <Cell
                                        key={`edu-${idx}`}
                                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                        stroke="white"
                                        strokeWidth={1.5}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<DemographicTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                        {/* Occupation Pie Chart */}
                        {statistics.demographics.occupation &&
                          Object.keys(statistics.demographics.occupation).length > 0 && (
                            <div className="flex flex-col items-center">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Pekerjaan</h4>
                              <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                  <Pie
                                    data={demographicPieData(statistics.demographics.occupation)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) =>
                                      `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                    labelLine={{ strokeDasharray: '2 2' }}
                                  >
                                    {demographicPieData(statistics.demographics.occupation).map((_, idx) => (
                                      <Cell
                                        key={`occ-${idx}`}
                                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                        stroke="white"
                                        strokeWidth={1.5}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip content={<DemographicTooltip />} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ── Recent Suggestions ─────────────────────────────────── */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="w-5 h-5 text-bkad-green" />
                      Saran Terbaru Responden
                    </CardTitle>
                    <CardDescription>
                      Kumpulan saran dari responden survei terbaru
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-2">
                    {statsLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : !statistics?.suggestions || statistics.suggestions.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada saran dari responden</p>
                      </div>
                    ) : (
                      <ScrollArea className="max-h-96">
                        <div className="space-y-3 pr-3">
                          {statistics.suggestions.map((suggestion, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-bkad-light/50 transition-colors"
                            >
                              <div className="w-7 h-7 rounded-full bg-bkad-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-semibold text-bkad-green">
                                  {idx + 1}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {suggestion}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* ═════════════════════════════════════════════════════════════════
              TAB 2: UNIT LAYANAN
              ═════════════════════════════════════════════════════════════════ */}
          <TabsContent value="units">
            <AnimatePresence mode="wait">
              <motion.div
                key="units"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Building2 className="w-5 h-5 text-bkad-green" />
                          Daftar Unit Layanan
                        </CardTitle>
                        <CardDescription>
                          Kelola unit layanan untuk survei IKM
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => {
                          setEditingUnit(null);
                          setUnitDialogOpen(true);
                        }}
                        className="bg-bkad-green hover:bg-bkad-dark text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Unit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    {unitsLoading ? (
                      renderSkeleton(6)
                    ) : units.length === 0 ? (
                      <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada unit layanan</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Klik &ldquo;Tambah Unit&rdquo; untuk menambahkan unit baru
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">No</TableHead>
                              <TableHead>Nama</TableHead>
                              <TableHead>Kode</TableHead>
                              <TableHead className="hidden md:table-cell">Kepala Unit</TableHead>
                              <TableHead className="hidden lg:table-cell">Telepon</TableHead>
                              <TableHead className="hidden lg:table-cell">Email</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {units.map((unit, idx) => (
                              <TableRow key={unit.id}>
                                <TableCell className="text-gray-400">{idx + 1}</TableCell>
                                <TableCell className="font-medium text-gray-900">{unit.name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {unit.code}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-600">
                                  {unit.headName || '-'}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-gray-600">
                                  {unit.phone ? (
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {unit.phone}
                                    </span>
                                  ) : (
                                    '-'
                                  )}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-gray-600">
                                  {unit.email ? (
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {unit.email}
                                    </span>
                                  ) : (
                                    '-'
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      unit.isActive
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                    }
                                  >
                                    {unit.isActive ? 'Aktif' : 'Tidak Aktif'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setEditingUnit(unit);
                                        setUnitDialogOpen(true);
                                      }}
                                      className="text-bkad-green hover:bg-bkad-green/10"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setDeleteUnitDialog(unit)}
                                      className="text-red-500 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Unit Form Dialog */}
            <UnitFormDialog
              open={unitDialogOpen}
              onOpenChange={setUnitDialogOpen}
              unit={editingUnit}
              onSave={handleSaveUnit}
              loading={unitSaving}
            />

            {/* Delete Unit Confirmation */}
            <AlertDialog
              open={!!deleteUnitDialog}
              onOpenChange={(open) => !open && setDeleteUnitDialog(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Unit Layanan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus unit &ldquo;{deleteUnitDialog?.name}&rdquo;?
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteUnitDialog && handleDeleteUnit(deleteUnitDialog)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* ═════════════════════════════════════════════════════════════════
              TAB 3: PERIODE SURVEI
              ═════════════════════════════════════════════════════════════════ */}
          <TabsContent value="periods">
            <AnimatePresence mode="wait">
              <motion.div
                key="periods"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <ClipboardList className="w-5 h-5 text-bkad-green" />
                          Daftar Periode Survei
                        </CardTitle>
                        <CardDescription>
                          Kelola periode survei kepuasan masyarakat
                        </CardDescription>
                      </div>
                      <Button
                        onClick={() => {
                          setEditingPeriod(null);
                          setPeriodDialogOpen(true);
                        }}
                        className="bg-bkad-green hover:bg-bkad-dark text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Periode
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    {periodsLoading ? (
                      renderSkeleton(5)
                    ) : surveyPeriods.length === 0 ? (
                      <div className="text-center py-12">
                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada periode survei</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Klik &ldquo;Tambah Periode&rdquo; untuk menambahkan periode baru
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">No</TableHead>
                              <TableHead>Judul</TableHead>
                              <TableHead>Periode</TableHead>
                              <TableHead className="hidden md:table-cell">Mulai</TableHead>
                              <TableHead className="hidden md:table-cell">Selesai</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="hidden sm:table-cell">Responden</TableHead>
                              <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {surveyPeriods.map((period, idx) => (
                              <TableRow key={period.id}>
                                <TableCell className="text-gray-400">{idx + 1}</TableCell>
                                <TableCell className="font-medium text-gray-900">
                                  {period.title}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {period.period}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-600">
                                  {period.startDate ? formatDate(period.startDate) : '-'}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-gray-600">
                                  {period.endDate ? formatDate(period.endDate) : '-'}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      period.isActive
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                    }
                                  >
                                    {period.isActive ? 'Aktif' : 'Tidak Aktif'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {period.respondentCount ?? 0}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setEditingPeriod(period);
                                        setPeriodDialogOpen(true);
                                      }}
                                      className="text-bkad-green hover:bg-bkad-green/10"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setDeletePeriodDialog(period)}
                                      className="text-red-500 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Period Form Dialog */}
            <PeriodFormDialog
              open={periodDialogOpen}
              onOpenChange={setPeriodDialogOpen}
              period={editingPeriod}
              onSave={handleSavePeriod}
              loading={periodSaving}
            />

            {/* Delete Period Confirmation */}
            <AlertDialog
              open={!!deletePeriodDialog}
              onOpenChange={(open) => !open && setDeletePeriodDialog(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Periode Survei</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus periode &ldquo;{deletePeriodDialog?.title}&rdquo;?
                    Semua data responden pada periode ini juga akan terhapus. Tindakan ini tidak dapat
                    dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deletePeriodDialog && handleDeletePeriod(deletePeriodDialog)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* ═════════════════════════════════════════════════════════════════
              TAB 4: DATA RESPONDEN
              ═════════════════════════════════════════════════════════════════ */}
          <TabsContent value="responses">
            <AnimatePresence mode="wait">
              <motion.div
                key="responses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Users className="w-5 h-5 text-bkad-green" />
                          Data Responden
                        </CardTitle>
                        <CardDescription>
                          Daftar responden survei kepuasan masyarakat
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={handleExportCSV}
                          className="border-bkad-green/30 text-bkad-green hover:bg-bkad-light"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-2">
                    {/* ── Filters ─────────────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Filter className="w-4 h-4" />
                        Filter:
                      </div>
                      <Select
                        value={filterUnitId}
                        onValueChange={(val) => {
                          setFilterUnitId(val);
                          setResponsesPage(1);
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Semua Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Unit</SelectItem>
                          {units.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={filterPeriodId}
                        onValueChange={(val) => {
                          setFilterPeriodId(val);
                          setResponsesPage(1);
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <SelectValue placeholder="Semua Periode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Periode</SelectItem>
                          {surveyPeriods.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.title} ({p.period})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ── Table ───────────────────────────────────────── */}
                    {responsesLoading ? (
                      renderSkeleton(6)
                    ) : responses.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada data responden</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Data akan muncul setelah responden mengisi survei
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead className="hidden md:table-cell">Unit</TableHead>
                                <TableHead className="hidden lg:table-cell">Periode</TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P1
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P2
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P3
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P4
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P5
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P6
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P7
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P8
                                </TableHead>
                                <TableHead className="hidden xl:table-cell text-center">
                                  P9
                                </TableHead>
                                <TableHead className="hidden md:table-cell">Saran</TableHead>
                                <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {responses.map((response, idx) => {
                                const globalIdx =
                                  (responsesPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                return (
                                  <TableRow key={response.id}>
                                    <TableCell className="text-gray-400">
                                      {globalIdx}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 max-w-[150px] truncate">
                                      {response.respondentName || '-'}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-gray-600 max-w-[120px] truncate">
                                      {response.unitName || '-'}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-gray-600 max-w-[120px] truncate">
                                      {response.surveyPeriodTitle || '-'}
                                    </TableCell>
                                    {/* Indicator values */}
                                    {(response.indicators || Array(9).fill(0)).map(
                                      (val: number, i: number) => (
                                        <TableCell
                                          key={`ind-${i}`}
                                          className="hidden xl:table-cell text-center text-sm"
                                        >
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                              val >= 4
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : val >= 3
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : val >= 2
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                            }`}
                                          >
                                            {val}
                                          </Badge>
                                        </TableCell>
                                      )
                                    )}
                                    <TableCell className="hidden md:table-cell text-gray-600 max-w-[200px] truncate text-xs">
                                      {response.suggestion || '-'}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-gray-500 text-xs">
                                      {formatDate(response.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeleteResponseDialog(response)}
                                        className="text-red-500 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>

                        {/* ── Pagination ──────────────────────────────── */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-500">
                              Menampilkan {(responsesPage - 1) * ITEMS_PER_PAGE + 1}-
                              {Math.min(responsesPage * ITEMS_PER_PAGE, responsesTotal)} dari{' '}
                              {responsesTotal} data
                            </p>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={responsesPage <= 1}
                                onClick={() => setResponsesPage((p) => p - 1)}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (responsesPage <= 3) {
                                  pageNum = i + 1;
                                } else if (responsesPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = responsesPage - 2 + i;
                                }
                                return (
                                  <Button
                                    key={pageNum}
                                    variant={responsesPage === pageNum ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setResponsesPage(pageNum)}
                                    className={
                                      responsesPage === pageNum
                                        ? 'bg-bkad-green hover:bg-bkad-dark text-white'
                                        : ''
                                    }
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              })}
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={responsesPage >= totalPages}
                                onClick={() => setResponsesPage((p) => p + 1)}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Delete Response Confirmation */}
            <AlertDialog
              open={!!deleteResponseDialog}
              onOpenChange={(open) => !open && setDeleteResponseDialog(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Data Responden</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus data responden &ldquo;
                    {deleteResponseDialog?.respondentName || 'ini'}&rdquo;? Tindakan ini tidak
                    dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteResponseDialog && handleDeleteResponse(deleteResponseDialog)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
