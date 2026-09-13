'use client';

/**
 * Chuông hộp thư admin — nằm ở header của MỌI trang /admin.
 * ─────────────────────────────────────────────────────────────────────────
 * Vì sao có: sidebar /admin có 43 mục và thứ CẦN XỬ LÝ nằm rải rác trong đó
 * (đơn xin key lẫn trong một tab của /admin/commerce). Không có chỗ nào trả
 * lời được câu "bây giờ có gì đang chờ tôi?" — người dùng nói nguyên văn
 * "xin duyệt key nãy tôi phải mò mãi mới thấy".
 *
 * Hai con số, cố ý KHÁC nhau:
 *   • chuaDoc  — tin chưa xem, chỉ để biết
 *   • canXuLy  — việc CHƯA LÀM XONG, hiện số đỏ
 * Gộp hai thứ này là mất hẳn khả năng trả lời câu hỏi trên: đọc rồi vẫn có
 * thể chưa làm.
 *
 * Cập nhật realtime qua socket `admin:thong-bao`; không có socket thì vẫn tự
 * hỏi lại mỗi 60 giây, nên chuông không bao giờ đứng im hẳn.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCheck, Loader2, ExternalLink } from 'lucide-react';

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

/** "2 phút" / "3 giờ" / "5 ngày" — đọc nhanh hơn một mốc ngày giờ đầy đủ. */
function truoc(iso: string): string {
  const giay = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (giay < 60) return 'vừa xong';
  if (giay < 3600) return `${Math.floor(giay / 60)} phút`;
  if (giay < 86400) return `${Math.floor(giay / 3600)} giờ`;
  return `${Math.floor(giay / 86400)} ngày`;
}

export default function ChuongAdmin() {
  const [mo, setMo] = useState(false);
  const [dem, setDem] = useState({ chuaDoc: 0, canXuLy: 0 });
  const [tin, setTin] = useState<TinAdmin[]>([]);
  const [dangTai, setDangTai] = useState(false);
  const hop = useRef<HTMLDivElement>(null);

  const napDem = useCallback(async () => {
    try {
      const r = await fetch('/api/v1/admin/thong-bao/dem', { credentials: 'include' });
      if (!r.ok) return;
      const j = await r.json();
      if (j?.data) setDem(j.data);
    } catch { /* im lặng: chuông hỏng không được làm vỡ trang admin */ }
  }, []);

  const napTin = useCallback(async () => {
    setDangTai(true);
    try {
      const r = await fetch('/api/v1/admin/thong-bao?limit=15', { credentials: 'include' });
      const j = await r.json();
      if (j?.data) { setTin(j.data.items ?? []); setDem({ chuaDoc: j.data.chuaDoc, canXuLy: j.data.canXuLy }); }
    } catch { /* im lặng */ } finally { setDangTai(false); }
  }, []);

  // Hỏi lại định kỳ. Đây là LƯỚI ĐỠ cho socket: socket rớt, tab ngủ, hay
  // proxy cắt kết nối thì chuông vẫn đúng trong vòng một phút.
  useEffect(() => {
    napDem();
    const h = setInterval(napDem, 60_000);
    return () => clearInterval(h);
  }, [napDem]);

  // Socket: nạp động để trang admin không kéo theo socket.io khi không cần.
  useEffect(() => {
    let huy = false;
    let sk: { off: (s: string) => void } | null = null;
    import('@/lib/socket')
      .then((m) => {
        const s = (m as { getSocket?: () => unknown }).getSocket?.() as
          | { on: (su: string, cb: () => void) => void; off: (su: string) => void }
          | null
          | undefined;
        if (!s || huy) return;
        s.on('admin:thong-bao', () => { napDem(); if (mo) napTin(); });
        sk = s;
      })
      .catch(() => { /* không có socket thì đã có nhịp 60s ở trên */ });
    return () => { huy = true; sk?.off('admin:thong-bao'); };
  }, [napDem, napTin, mo]);

  // Bấm ra ngoài thì đóng.
  useEffect(() => {
    if (!mo) return;
    const ngoai = (e: MouseEvent) => {
      if (hop.current && !hop.current.contains(e.target as Node)) setMo(false);
    };
    document.addEventListener('mousedown', ngoai);
    return () => document.removeEventListener('mousedown', ngoai);
  }, [mo]);

  async function docHet() {
    try {
      const r = await fetch('/api/v1/admin/thong-bao/doc-het', { method: 'POST', credentials: 'include' });
      const j = await r.json();
      if (j?.data) setDem(j.data);
      setTin((t) => t.map((x) => ({ ...x, daDoc: true })));
    } catch { /* im lặng */ }
  }

  async function xong(id: number) {
    try {
      const r = await fetch(`/api/v1/admin/thong-bao/${id}/xong`, { method: 'POST', credentials: 'include' });
      const j = await r.json();
      if (j?.data) setDem(j.data);
      setTin((t) => t.map((x) => (x.id === id ? { ...x, daXuLy: true, daDoc: true } : x)));
    } catch { /* im lặng */ }
  }

  return (
    <div className="relative" ref={hop}>
      <button
        onClick={() => { setMo((v) => !v); if (!mo) napTin(); }}
        aria-label={`Thông báo admin${dem.canXuLy > 0 ? ` — ${dem.canXuLy} việc đang chờ` : ''}`}
        className="relative p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
      >
        <Bell className="w-5 h-5" />
        {dem.canXuLy > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {dem.canXuLy > 99 ? '99+' : dem.canXuLy}
          </span>
        ) : dem.chuaDoc > 0 ? (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-violet" />
        ) : null}
      </button>

      {mo && (
        <div className="absolute right-0 mt-2 w-[min(92vw,420px)] rounded-2xl border border-darkborder bg-darkcard shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-darkborder">
            <div className="min-w-0">
              <p className="font-semibold text-text-primary text-sm">Thông báo admin</p>
              <p className="text-xs text-text-muted">
                {dem.canXuLy > 0 ? `${dem.canXuLy} việc đang chờ bạn` : 'Không còn việc nào đang chờ'}
              </p>
            </div>
            {dem.chuaDoc > 0 && (
              <button onClick={docHet} className="text-xs text-text-muted hover:text-neon-violet flex items-center gap-1 shrink-0">
                <CheckCheck className="w-3.5 h-3.5" /> Đọc hết
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {dangTai && tin.length === 0 ? (
              <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-neon-violet" /></div>
            ) : tin.length === 0 ? (
              <p className="py-10 text-center text-sm text-text-muted">Chưa có thông báo nào.</p>
            ) : (
              tin.map((t) => (
                <div
                  key={t.id}
                  className={`px-4 py-3 border-b border-darkborder/60 last:border-0 ${t.daDoc ? '' : 'bg-neon-violet/[0.05]'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg leading-none mt-0.5 shrink-0">{BIEU_TUONG[t.loai] ?? '🔔'}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text-primary font-medium break-words">{t.tieuDe}</p>
                      {t.noiDung && (
                        <p className="text-xs text-text-muted mt-0.5 whitespace-pre-line break-words">{t.noiDung}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[11px] text-text-muted">{truoc(t.createdAt)}</span>
                        {t.nguoi?.username && (
                          <span className="text-[11px] text-text-muted">· {t.nguoi.fullName || t.nguoi.username}</span>
                        )}
                        {t.mucDo === 'can_xu_ly' && !t.daXuLy && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-300 font-semibold">
                            cần xử lý
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {t.duongDan && (
                          <Link
                            href={t.duongDan}
                            onClick={() => setMo(false)}
                            className="text-xs text-neon-violet hover:underline inline-flex items-center gap-1"
                          >
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
              ))
            )}
          </div>

          <Link
            href="/admin/thong-bao"
            onClick={() => setMo(false)}
            className="block px-4 py-2.5 text-center text-xs text-text-muted hover:text-text-primary border-t border-darkborder"
          >
            Xem tất cả
          </Link>
        </div>
      )}
    </div>
  );
}
