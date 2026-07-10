'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { Loader2, Ticket, KeyRound, Tag, Plus, Trash2, Copy, Check } from 'lucide-react';
import { myCodesApi, type SavedCode } from '@/lib/api';
import { toast } from 'sonner';

const TYPE_META: Record<string, { label: string; icon: typeof Ticket; color: string }> = {
  DISCOUNT: { label: 'Mã giảm giá', icon: Tag, color: 'text-emerald-400' },
  COURSE: { label: 'Mã vào học', icon: KeyRound, color: 'text-neon-violet' },
  OTHER: { label: 'Khác', icon: Ticket, color: 'text-text-secondary' },
};

export default function MyCodesPage() {
  const router = useRouter();
  const { status } = useSession();
  const { isAuthenticated: isBackendAuth, isLoading: isBackendLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAuthenticated = mounted && (isBackendAuth || status === 'authenticated');

  const [codes, setCodes] = useState<SavedCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Add form
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [codeType, setCodeType] = useState<'DISCOUNT' | 'COURSE' | 'OTHER'>('COURSE');
  const [expiresAt, setExpiresAt] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await myCodesApi.getAll();
      setCodes(res.data.data || []);
    } catch {
      setCodes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isBackendLoading && status !== 'loading' && !isAuthenticated) {
      router.push('/login?callbackUrl=/my-codes');
      return;
    }
    if (isAuthenticated) load();
  }, [mounted, isAuthenticated, isBackendLoading, status, load, router]);

  const add = async () => {
    if (!label.trim() || !code.trim()) {
      toast.error('Nhập tên mã và mã');
      return;
    }
    setSaving(true);
    try {
      await myCodesApi.add({
        label: label.trim(),
        code: code.trim(),
        codeType,
        note: note.trim() || undefined,
        expiresAt: expiresAt || undefined,
      });
      setLabel(''); setCode(''); setNote(''); setExpiresAt(''); setCodeType('COURSE');
      toast.success('Đã lưu mã');
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lưu mã thất bại');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await myCodesApi.remove(id);
      setCodes((prev) => prev.filter((c) => c.id !== id));
      toast.success('Đã xoá');
    } catch {
      toast.error('Xoá thất bại');
    }
  };

  const copy = (c: SavedCode) => {
    navigator.clipboard.writeText(c.code);
    setCopiedId(c.id);
    toast.success('Đã copy mã');
    window.setTimeout(() => setCopiedId((v) => (v === c.id ? null : v)), 1500);
  };

  if (!mounted || isBackendLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg pt-16">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Ticket className="w-7 h-7 text-neon-violet" /> My Code
          </h1>
          <p className="text-text-secondary mt-1">Lưu mã giảm giá, mã kích hoạt khoá học của bạn. Mã bạn đã dùng được tự động lưu vào đây.</p>
        </div>

        {/* Add form */}
        <div className="rounded-2xl border border-darkborder bg-darkcard p-5 mb-8">
          <p className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Thêm mã thủ công</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Tên mã (VD: Mã giảm 10%)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50" />
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã (VD: CERT10-12)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 font-mono" />
            <select value={codeType} onChange={(e) => setCodeType(e.target.value as typeof codeType)} className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary focus:outline-none focus:border-neon-violet/50">
              <option value="COURSE">Mã vào học</option>
              <option value="DISCOUNT">Mã giảm giá</option>
              <option value="OTHER">Khác</option>
            </select>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary focus:outline-none focus:border-neon-violet/50" title="Hạn dùng (tuỳ chọn)" />
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 sm:col-span-2" />
          </div>
          <button onClick={add} disabled={saving} className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Lưu mã
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>
        ) : codes.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <Ticket className="w-10 h-10 mx-auto mb-3 opacity-50" />
            Chưa có mã nào. Thêm thủ công ở trên, hoặc mã sẽ tự lưu khi bạn kích hoạt khoá / đổi chứng chỉ.
          </div>
        ) : (
          <div className="space-y-3">
            {codes.map((c) => {
              const meta = TYPE_META[c.codeType] || TYPE_META.OTHER;
              const Icon = meta.icon;
              const expired = c.expiresAt ? new Date(c.expiresAt).getTime() < Date.now() : false;
              return (
                <div key={c.id} className="flex items-center gap-4 rounded-2xl border border-darkborder bg-darkcard p-4">
                  <div className={`w-10 h-10 rounded-xl bg-darkbg flex items-center justify-center shrink-0 ${meta.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-text-primary truncate">{c.label}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border border-darkborder ${meta.color}`}>{meta.label}</span>
                      {c.source === 'AUTO' && <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-darkborder text-text-muted">tự lưu</span>}
                      {expired && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400">hết hạn</span>}
                    </div>
                    <button onClick={() => copy(c)} className="mt-1 inline-flex items-center gap-1.5 font-mono text-sm text-neon-violet hover:underline" title="Bấm để copy">
                      {c.code}
                      {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {(c.note || c.expiresAt) && (
                      <p className="text-xs text-text-muted mt-0.5">
                        {c.note}{c.note && c.expiresAt ? ' · ' : ''}{c.expiresAt ? `Hạn: ${new Date(c.expiresAt).toLocaleDateString('vi-VN')}` : ''}
                      </p>
                    )}
                  </div>
                  <button onClick={() => remove(c.id)} className="shrink-0 p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10" title="Xoá">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
