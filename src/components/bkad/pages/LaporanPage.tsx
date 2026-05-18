"use client";

import { useState, useEffect } from "react";
import { usePageRouter, pageTitles } from "@/stores/usePageRouter";
import { ChevronRight, Send, CheckCircle2, Clock, AlertCircle, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LaporanItem {
  id: string;
  name: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
}

const categoryOptions = [
  { value: "umum", label: "Umum" },
  { value: "keuangan", label: "Keuangan Daerah" },
  { value: "aset", label: "Aset Daerah" },
  { value: "pajak", label: "Pajak & Retribusi" },
  { value: "anggaran", label: "Anggaran" },
  { value: "pelayanan", label: "Pelayanan Publik" },
  { value: "pengaduan", label: "Pengaduan" },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  baru: { label: "Baru", color: "bg-sky-100 text-sky-700", icon: AlertCircle },
  diproses: { label: "Diproses", color: "bg-amber-100 text-amber-700", icon: Clock },
  selesai: { label: "Selesai", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
};

export default function LaporanPage() {
  const { currentPage } = usePageRouter();
  const [laporanList, setLaporanList] = useState<LaporanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "umum",
  });

  useEffect(() => {
    fetchLaporan();
  }, []);

  async function fetchLaporan() {
    try {
      const res = await fetch("/api/laporan");
      const result = await res.json();
      if (result.success) setLaporanList(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "", category: "umum" });
        fetchLaporan();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a onClick={() => usePageRouter.getState().goHome()} className="hover:text-bkad-green cursor-pointer">Beranda</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-bkad-green font-medium">{pageTitles[currentPage]}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Form */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Laporan Masyarakat</h1>
              <p className="text-gray-600">
                Sampaikan pertanyaan, saran, atau pengaduan Anda terkait pengelolaan keuangan dan aset daerah Kabupaten Seruyan
              </p>
            </div>

            {submitted ? (
              <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Laporan Berhasil Dikirim!</h2>
                <p className="text-gray-600 mb-6">
                  Terima kasih atas laporan Anda. Tim kami akan meninjau dan menindaklanjuti laporan Anda sesegera mungkin.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="border-bkad-green text-bkad-green"
                  >
                    Kirim Laporan Lain
                  </Button>
                  <Button
                    onClick={() => usePageRouter.getState().goHome()}
                    className="bg-bkad-green hover:bg-bkad-dark text-white"
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-bkad-green/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-bkad-green" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Formulir Laporan</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nama Lengkap *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@contoh.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">No. Telepon</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Kategori</label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Subjek *</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Subjek laporan"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Pesan *</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan laporan, pertanyaan, atau saran Anda..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-bkad-green hover:bg-bkad-dark text-white w-full sm:w-auto"
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Laporan
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar - Recent Laporan */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-bkad-green" />
                Riwayat Laporan
              </h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-50 rounded-lg p-3">
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : laporanList.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada laporan</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {laporanList.map((item) => {
                    const config = statusConfig[item.status] || statusConfig.baru;
                    const StatusIcon = config.icon;
                    return (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.subject}</h4>
                          <Badge className={`text-[10px] flex-shrink-0 ${config.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{item.name}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-bkad-green/5 rounded-xl p-5 border border-bkad-green/10">
              <h3 className="font-bold text-gray-900 mb-2">Informasi</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Laporan Anda akan ditinjau oleh tim BKAD dalam waktu 1-3 hari kerja. Status laporan dapat dilihat di daftar riwayat laporan.
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <h3 className="font-bold text-amber-800 mb-2 text-sm">Kontak Darurat</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                Untuk urusan mendesak, hubungi langsung:<br />
                <strong>Telepon:</strong> (0532) 882123<br />
                <strong>Email:</strong> bkad@seruyankab.go.id
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
