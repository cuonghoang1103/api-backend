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
import { BIEU_TUONG_TIN } from './bieuTuongTin';

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

/** "2 phút" / "3 giờ" / "5 ngày" — đọc nhanh hơn một mốc ngày giờ đầy đủ. */
function truoc(iso: string): string {
  const giay = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (giay < 60) return 'vừa xong';
  if (giay < 3600) return `${Math.floor(giay / 60)} phút`;
  if (giay < 86400) return `${Math.floor(giay / 3600)} giờ`;
  return `${Math.floor(giay / 86400)} ngày`;
}

export default function ChuongAdmin({ onDem }: { onDem?: (d: { chuaDoc: number; canXuLy: number }) => void } = {}) {
  const [mo, setMo] = useState(false);
  const [dem, setDem] = useState({ chuaDoc: 0, canXuLy: 0 });
  // Báo số việc chờ lên khung (sidebar hiện nó cạnh mục Inbox) — một nguồn
  // đếm duy nhất, không để hai chỗ tự hỏi server rồi lệch nhau.
  const onDemRef = useRef(onDem);
  onDemRef.current = onDem;
  useEffect(() => { onDemRef.current?.(dem); }, [dem]);
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
        aria-label={`Admin inbox${dem.canXuLy > 0 ? ` — ${dem.canXuLy} pending` : ''}`}
        title="Inbox"
        className="a-icon-btn relative"
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        {dem.canXuLy > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[var(--a-red)] px-1 text-[9.5px] font-semibold tabular-nums text-white">
            {dem.canXuLy > 99 ? '99+' : dem.canXuLy}
          </span>
        ) : dem.chuaDoc > 0 ? (
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[var(--a-accent)]" />
        ) : null}
      </button>

      {mo && (
        <div
          className="a-pop absolute right-0 z-50 mt-1.5 w-[min(92vw,400px)] overflow-hidden rounded-[8px] border border-[var(--a-border-strong)] bg-[var(--a-raised)]"
          style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.35), 0 16px 40px -12px rgba(0,0,0,.65)' }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--a-border)] px-3.5 py-2.5">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--a-text)]">Inbox</p>
              <p className="text-[11.5px] text-[var(--a-text-3)]">
                {dem.canXuLy > 0 ? `${dem.canXuLy} việc đang chờ bạn` : 'Không còn việc nào đang chờ'}
              </p>
            </div>
            {dem.chuaDoc > 0 && (
              <button onClick={docHet} className="a-btn !h-6 !px-2 !text-[11.5px]">
                <CheckCheck className="h-3.5 w-3.5" /> Đọc hết
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {dangTai && tin.length === 0 ? (
              <div className="flex justify-center py-10"><Loader2 className="h-4 w-4 animate-spin text-[var(--a-text-3)]" /></div>
            ) : tin.length === 0 ? (
              <p className="py-10 text-center text-[13px] text-[var(--a-text-3)]">Chưa có thông báo nào.</p>
            ) : (
              tin.map((t) => {
                const Icon = BIEU_TUONG_TIN[t.loai] ?? BIEU_TUONG_TIN.KHAC;
                const cho = t.mucDo === 'can_xu_ly' && !t.daXuLy;
                return (
                  <div key={t.id} className="flex gap-2.5 border-b border-[var(--a-border)] px-3.5 py-2.5 last:border-0">
                    <span className="relative mt-[1px] shrink-0">
                      <Icon className="h-4 w-4 text-[var(--a-text-3)]" strokeWidth={1.75} />
                      {!t.daDoc && <span className="absolute -left-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--a-accent)]" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-[13px] leading-snug text-[var(--a-text)]">{t.tieuDe}</p>
                      {t.noiDung && (
                        <p className="mt-0.5 whitespace-pre-line break-words text-[12px] leading-snug text-[var(--a-text-3)]">{t.noiDung}</p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] text-[var(--a-text-3)]">
                        <span className="tabular-nums">{truoc(t.createdAt)}</span>
                        {t.nguoi?.username && <span>{t.nguoi.fullName || t.nguoi.username}</span>}
                        {cho && <span className="font-medium text-[var(--a-orange)]">Cần xử lý</span>}
                        {t.duongDan && (
                          <Link href={t.duongDan} onClick={() => setMo(false)} className="inline-flex items-center gap-1 text-[var(--a-accent-text)] hover:underline">
                            Mở <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                        {cho && (
                          <button onClick={() => xong(t.id)} className="inline-flex items-center gap-1 hover:text-[var(--a-green)]">
                            <Check className="h-3 w-3" /> Xong
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <Link
            href="/admin/thong-bao"
            onClick={() => setMo(false)}
            className="block border-t border-[var(--a-border)] px-3.5 py-2 text-center text-[12px] text-[var(--a-text-3)] hover:bg-[var(--a-hover)] hover:text-[var(--a-text)]"
          >
            Xem tất cả
          </Link>
        </div>
      )}
    </div>
  );
}
