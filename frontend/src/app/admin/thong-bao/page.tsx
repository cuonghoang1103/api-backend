'use client';

/**
 * /admin/thong-bao — toàn bộ hộp thư admin, có lọc.
 *
 * Cái chuông ở header chỉ hiện 15 tin gần nhất; trang này để lần lại lịch sử
 * và lọc theo loại việc. Xem `services/thongBaoAdmin.service.ts` (backend) để
 * biết vì sao bảng này tồn tại tách khỏi thông báo mạng xã hội.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCheck, Loader2, ExternalLink, Inbox } from 'lucide-react';

interface TinAdmin {
  id: number;
  loai: string;
  tieuDe: string;
  noiDung: string | null;
  duongDan: string | null;
  mucDo: string;
  daDoc: boolean;
  daXuLy: boolean;
  createdAt: string;
  nguoi: { id: number; username: string | null; fullName: string | null } | null;
}

const BIEU_TUONG: Record<string, string> = {
  XIN_KEY: '🔑', DON_MOI: '📦', DA_THANH_TOAN: '💰', CHUYEN_KHOAN_CHO_DUYET: '🏦',
  DOI_KEY: '🛠️', BAO_CAO: '🚩', XOA_TAI_KHOAN: '🗑️', NAP_DIEM: '🪙', MUA_PRO: '👑', KHAC: '🔔',
};

const TEN_LOAI: Record<string, string> = {
  XIN_KEY: 'Xin cấp key', DON_MOI: 'Đơn mới', DA_THANH_TOAN: 'Đã thanh toán',
  CHUYEN_KHOAN_CHO_DUYET: 'Chờ xác nhận CK', DOI_KEY: 'Đổi key hỏng', BAO_CAO: 'Báo cáo',
  XOA_TAI_KHOAN: 'Xoá tài khoản', NAP_DIEM: 'Nạp điểm', MUA_PRO: 'Mua Pro', KHAC: 'Khác',
};

const BO_LOC = [
  { ma: 'can_xu_ly', ten: 'Đang chờ xử lý' },
  { ma: 'chua_doc', ten: 'Chưa đọc' },
  { ma: 'tat_ca', ten: 'Tất cả' },
] as const;

function ngayGio(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function TrangThongBaoAdmin() {
  const [loc, setLoc] = useState<(typeof BO_LOC)[number]['ma']>('can_xu_ly');
  const [loai, setLoai] = useState<string>('');
  const [tin, setTin] = useState<TinAdmin[]>([]);
  const [dem, setDem] = useState({ chuaDoc: 0, canXuLy: 0 });
  const [dangTai, setDangTai] = useState(true);

  const nap = useCallback(async () => {
    setDangTai(true);
    try {
      const q = new URLSearchParams({ limit: '60' });
      if (loc === 'can_xu_ly') q.set('canXuLy', '1');
      if (loc === 'chua_doc') q.set('chuaDoc', '1');
      if (loai) q.set('loai', loai);
      const r = await fetch(`/api/v1/admin/thong-bao?${q}`, { credentials: 'include' });
      const j = await r.json();
      if (j?.data) { setTin(j.data.items ?? []); setDem({ chuaDoc: j.data.chuaDoc, canXuLy: j.data.canXuLy }); }
    } catch { /* im lặng */ } finally { setDangTai(false); }
  }, [loc, loai]);

  useEffect(() => { nap(); }, [nap]);

  async function xong(id: number) {
    await fetch(`/api/v1/admin/thong-bao/${id}/xong`, { method: 'POST', credentials: 'include' }).catch(() => {});
    nap();
  }
  async function docHet() {
    await fetch('/api/v1/admin/thong-bao/doc-het', { method: 'POST', credentials: 'include' }).catch(() => {});
    nap();
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-2">
            <Bell className="w-6 h-6 text-neon-violet" /> Thông báo & việc chờ
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {dem.canXuLy > 0 ? `${dem.canXuLy} việc đang chờ bạn xử lý` : 'Không còn việc nào đang chờ'}
            {dem.chuaDoc > 0 && ` · ${dem.chuaDoc} tin chưa đọc`}
          </p>
        </div>
        {dem.chuaDoc > 0 && (
          <button
            onClick={docHet}
            className="px-3 py-2 rounded-xl border border-darkborder text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 inline-flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" /> Đánh dấu đọc hết
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {BO_LOC.map((b) => (
          <button
            key={b.ma}
            onClick={() => setLoc(b.ma)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              loc === b.ma ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold' : 'text-text-muted hover:text-text-secondary border border-darkborder'
            }`}
          >
            {b.ten}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setLoai('')}
          className={`px-2.5 py-1 rounded-full text-xs border ${loai === '' ? 'border-neon-violet text-neon-violet' : 'border-darkborder text-text-muted hover:text-text-secondary'}`}
        >
          Mọi loại
        </button>
        {Object.entries(TEN_LOAI).map(([ma, ten]) => (
          <button
            key={ma}
            onClick={() => setLoai(ma === loai ? '' : ma)}
            className={`px-2.5 py-1 rounded-full text-xs border ${loai === ma ? 'border-neon-violet text-neon-violet' : 'border-darkborder text-text-muted hover:text-text-secondary'}`}
          >
            {BIEU_TUONG[ma]} {ten}
          </button>
        ))}
      </div>

      {dangTai ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>
      ) : tin.length === 0 ? (
        <div className="py-20 text-center">
          <Inbox className="w-10 h-10 text-text-muted/40 mx-auto mb-3" />
          <p className="text-text-muted">
            {loc === 'can_xu_ly' ? 'Không còn việc nào đang chờ. 🎉' : 'Chưa có thông báo nào ở bộ lọc này.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tin.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border p-4 ${t.daDoc ? 'border-darkborder bg-darkcard' : 'border-neon-violet/30 bg-neon-violet/[0.05]'}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5 shrink-0">{BIEU_TUONG[t.loai] ?? '🔔'}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <p className="text-sm font-medium text-text-primary break-words">{t.tieuDe}</p>
                    <span className="text-xs text-text-muted shrink-0">{ngayGio(t.createdAt)}</span>
                  </div>
                  {t.noiDung && (
                    <p className="text-xs text-text-muted mt-1 whitespace-pre-line break-words">{t.noiDung}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                      {TEN_LOAI[t.loai] ?? t.loai}
                    </span>
                    {t.nguoi?.username && (
                      <span className="text-[11px] text-text-muted">{t.nguoi.fullName || t.nguoi.username}</span>
                    )}
                    {t.mucDo === 'can_xu_ly' && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${t.daXuLy ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                        {t.daXuLy ? 'đã xử lý' : 'cần xử lý'}
                      </span>
                    )}
                    {t.duongDan && (
                      <Link href={t.duongDan} className="text-xs text-neon-violet hover:underline inline-flex items-center gap-1">
                        Mở <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                    {t.mucDo === 'can_xu_ly' && !t.daXuLy && (
                      <button onClick={() => xong(t.id)} className="text-xs text-text-muted hover:text-emerald-400 inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Đánh dấu xong
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
