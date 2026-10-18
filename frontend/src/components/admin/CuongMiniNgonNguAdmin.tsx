'use client';

/**
 * 💬 Admin — Trò chuyện cùng CuongMini trong khoá ngoại ngữ (19/10/2026): bật/tắt cổng Claude
 * chính hãng (CuongMini Heshin 5.5) cho việc này + trần $/người/ngày (mặc định 0,5 $) + chi 7 ngày.
 * Hết trần / tắt / không key ⇒ tự lùi gpt-6-sol (người học không bị chặn).
 * Máy chủ: `src/services/ielts/troChuyen/troChuyenLuong.service.ts`.
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

type CaiDat = {
  bat: boolean; tranNgayUsd: number; daChiHomNay: number | null;
  thongKe7Ngay?: { soLuot: number; loi: number; tongUsd: number; soNguoi: number; ttfbTrungVi: number | null };
};

export default function CuongMiniNgonNguAdmin() {
  const [d, setD] = useState<CaiDat | null>(null);
  const [tran, setTran] = useState('');
  const [dang, setDang] = useState(false);
  useEffect(() => {
    api.get('/ielts/cuongmini/cai-dat').then((r) => { const v = r.data?.data as CaiDat; setD(v); setTran(String(v?.tranNgayUsd ?? 0.5)); }).catch(() => setD(null));
  }, []);
  const luu = async (patch: Partial<Pick<CaiDat, 'bat' | 'tranNgayUsd'>>) => {
    setDang(true);
    try {
      const r = await api.put('/ielts/cuongmini/cai-dat', patch);
      setD((x) => (x ? { ...x, ...(r.data?.data as Partial<CaiDat>) } : x));
      toast.success('Đã lưu / Saved.');
    } catch (e) { toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lỗi'); } finally { setDang(false); }
  };
  if (!d) return null;
  const tk = d.thongKe7Ngay;
  return (
    <section className="p-4 rounded-xl border border-darkborder bg-darkcard text-sm space-y-3">
      <b className="text-text-primary">💬 Trò chuyện ngoại ngữ cùng CuongMini — Heshin 5.5 · Language chat</b>
      <p className="text-xs text-text-muted">
        Lượt nói ngắn: không nghĩ, effort low, chảy chữ ⇒ câu đầu được đọc ngay. Tắt / hết trần / không key ⇒ tự lùi gpt-6-sol (modelapi).
        <br />Short spoken turns: no thinking, low effort, streamed. Off / over cap / no key ⇒ falls back to gpt-6-sol.
      </p>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <label className="flex items-center gap-2">
          <input type="checkbox" disabled={dang} checked={d.bat} onChange={(e) => void luu({ bat: e.target.checked })} />
          Dùng cổng chính hãng / Use official gateway
        </label>
        <label className="flex items-center gap-2">
          Trần $/người/ngày · USD per user per day
          <input className="w-20 px-2 py-1 rounded bg-darkbg border border-darkborder" inputMode="decimal" value={tran} onChange={(e) => setTran(e.target.value)} />
        </label>
        <button type="button" disabled={dang} className="px-3 py-1 rounded-lg bg-violet-600 text-white" onClick={() => void luu({ tranNgayUsd: Number(tran) })}>Lưu / Save</button>
      </div>
      {tk && (
        <p className="text-xs text-text-muted">
          7 ngày / 7 days: <b className="text-text-primary">{tk.soLuot}</b> lượt · {tk.soNguoi} người · <b className="text-text-primary">${tk.tongUsd.toFixed(4)}</b> · lỗi {tk.loi}
          {tk.ttfbTrungVi !== null && <> · byte đầu trung vị {(tk.ttfbTrungVi / 1000).toFixed(2)} s</>}
        </p>
      )}
    </section>
  );
}
