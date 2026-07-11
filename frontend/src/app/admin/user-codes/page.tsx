'use client';

import { useState } from 'react';
import { Ticket, Loader2, Send } from 'lucide-react';
import { myCodesApi } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminUserCodesPage() {
  const [userId, setUserId] = useState('');
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [codeType, setCodeType] = useState<'DISCOUNT' | 'COURSE' | 'OTHER'>('DISCOUNT');
  const [expiresAt, setExpiresAt] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  const grant = async () => {
    const uid = Number(userId);
    if (!uid || !label.trim() || !code.trim()) {
      toast.error('Nhập User ID, tên mã và mã');
      return;
    }
    setSending(true);
    try {
      await myCodesApi.adminGrant({
        userId: uid,
        label: label.trim(),
        code: code.trim(),
        codeType,
        note: note.trim() || undefined,
        expiresAt: expiresAt || undefined,
      });
      toast.success(`Đã cấp mã vào ví (My Code) của user #${uid}`);
      setLabel(''); setCode(''); setNote(''); setExpiresAt('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cấp mã thất bại');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-1 flex items-center gap-2">
        <Ticket className="w-6 h-6 text-neon-violet" /> Cấp mã vào ví User (My Code)
      </h1>
      <p className="text-text-secondary text-sm mb-6">Tạo và gán thẳng một mã (giảm giá / vào học) vào mục <b>My Code</b> của một user. User sẽ thấy ngay trong ví mã của họ.</p>

      <div className="rounded-2xl border border-darkborder bg-darkcard p-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-text-muted mb-1">User ID (xem ở Quản lý Users)</label>
            <input value={userId} onChange={(e) => setUserId(e.target.value.replace(/[^0-9]/g, ''))} placeholder="VD: 27" className="w-full px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Loại mã</label>
            <select value={codeType} onChange={(e) => setCodeType(e.target.value as typeof codeType)} className="w-full px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary">
              <option value="DISCOUNT">Mã giảm giá</option>
              <option value="COURSE">Mã vào học</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Tên mã (VD: Giảm 20% Tết)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã (VD: TET20)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary font-mono" />
          <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary" title="Hạn dùng (tuỳ chọn)" />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú (tuỳ chọn)" className="px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-text-primary" />
        </div>
        <button onClick={grant} disabled={sending} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Cấp mã
        </button>
      </div>
    </div>
  );
}
