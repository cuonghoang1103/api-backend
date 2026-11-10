'use client';

/**
 * "Tác vụ đã lên lịch" của /chat (10/11/2026) — bố cục theo claude.ai: tab Của bạn | Mẫu, tìm · lọc · sắp xếp,
 * nút "Tác vụ mới" (menu), trạng thái trống có đồng hồ bấm giờ + "Thiết lập thủ công", thẻ mẫu kèm dòng lịch.
 *
 * Máy chủ: src/services/chatTacVu.ts (cron mỗi phút, chạy qua đúng đường chat). Mẫu cần Gmail/Lịch ⇒ "Sắp có".
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarClock, CalendarDays, ChevronDown, Inbox, Lightbulb, Loader2, MessageSquare, Newspaper, Play, Plus, Radar,
  Search, Trash2, X, PenLine, BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import type { MauThe } from './ctcCatalog';
import { tuongDoi } from './CtcViews';

type MauId = 'tom-tat-ngay' | 'theo-doi' | 'y-tuong' | 'tong-ket-tuan' | 'tu-dat' | 'hop-thu' | 'cuoc-hop';
interface MauTv {
  id: MauId; ten: string; mota: string; icon: typeof Newspaper; mau: MauThe;
  lich: 'ngay' | 'tuan'; gio: number; thu?: number; canChuDe?: boolean; goiYChuDe?: string; sapCo?: string;
}

export const MAU_TAC_VU: MauTv[] = [
  { id: 'tom-tat-ngay', ten: 'Tóm tắt hằng ngày', mota: '5 tin công nghệ & AI nổi bật trong 24 giờ, mỗi tin 2–3 câu kèm nguồn.', icon: Newspaper, mau: 'blue', lich: 'ngay', gio: 7 * 60 + 30 },
  { id: 'hop-thu', ten: 'Phân loại hộp thư đến', mota: 'Đọc thư mới, gom theo mức quan trọng, gợi ý thư cần trả lời.', icon: Inbox, mau: 'teal', lich: 'ngay', gio: 8 * 60, sapCo: 'Cần kết nối Gmail' },
  { id: 'cuoc-hop', ten: 'Chuẩn bị cuộc họp', mota: 'Trước mỗi cuộc họp: tóm tắt người dự, việc cần chốt, câu hỏi nên hỏi.', icon: CalendarDays, mau: 'amber', lich: 'ngay', gio: 8 * 60, sapCo: 'Cần kết nối Lịch' },
  { id: 'tong-ket-tuan', ten: 'Tổng kết hằng tuần', mota: 'Nhìn lại các chủ đề bạn đã hỏi CuongMini trong tuần, điểm cần ôn và 3 việc cho tuần tới.', icon: BarChart3, mau: 'violet', lich: 'tuan', gio: 20 * 60, thu: 0 },
  { id: 'y-tuong', ten: 'Ý tưởng nội dung', mota: '5 ý tưởng bài viết/video về chủ đề bạn chọn, mỗi ý có tiêu đề và hướng triển khai.', icon: Lightbulb, mau: 'rose', lich: 'tuan', gio: 9 * 60, thu: 1, canChuDe: true, goiYChuDe: 'Lập trình web cho sinh viên' },
  { id: 'theo-doi', ten: 'Theo dõi chủ đề', mota: 'Mỗi ngày tìm tin mới nhất về chủ đề bạn quan tâm, có nguồn để kiểm lại.', icon: Radar, mau: 'green', lich: 'ngay', gio: 8 * 60, canChuDe: true, goiYChuDe: 'Next.js' },
];

const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const hhmm = (p: number) => `${String(Math.floor(p / 60)).padStart(2, '0')}:${String(p % 60).padStart(2, '0')}`;
export const dongLich = (lich: 'ngay' | 'tuan', gio: number, thu?: number | null) =>
  lich === 'ngay' ? `Mỗi ngày lúc ${hhmm(gio)}` : `${THU[thu ?? 0]} hằng tuần lúc ${hhmm(gio)}`;

interface TacVu {
  id: string; ten: string; mau: MauId; chuDe: string | null; loiNhac: string; lich: 'ngay' | 'tuan'; gio: number; thu: number | null;
  bat: boolean; sessionId: string | null; lanToi: string; lanCuoi: string | null; loiCuoi: string | null; soLan: number;
}

/** Hình trống: đồng hồ bấm giờ (SVG tự vẽ, theo màu nhấn). */
function DongHoBamGio() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden className="ctc-stopwatch">
      <defs>
        <radialGradient id="ctcSw" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="var(--ctc-surface)" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--ctc-accent) 14%, var(--ctc-surface))" />
        </radialGradient>
      </defs>
      <rect x="52" y="8" width="16" height="10" rx="3" fill="var(--ctc-accent)" />
      <rect x="57" y="16" width="6" height="8" fill="var(--ctc-accent)" />
      <rect x="86" y="22" width="12" height="7" rx="3" transform="rotate(40 92 25)" fill="var(--ctc-accent)" opacity=".8" />
      <circle cx="60" cy="68" r="42" fill="url(#ctcSw)" stroke="var(--ctc-accent)" strokeWidth="4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={60 + Math.sin(a) * 34} y1={68 - Math.cos(a) * 34} x2={60 + Math.sin(a) * (i % 3 ? 31 : 28)} y2={68 - Math.cos(a) * (i % 3 ? 31 : 28)} stroke="var(--ctc-muted)" strokeWidth={i % 3 ? 1.5 : 2.5} strokeLinecap="round" />;
      })}
      <path d="M60 68 L60 40" stroke="var(--ctc-text)" strokeWidth="3.5" strokeLinecap="round" className="ctc-sw-kim" />
      <path d="M60 68 L76 76" stroke="var(--ctc-accent)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="68" r="4.5" fill="var(--ctc-accent)" />
    </svg>
  );
}

function HopTao({ mau, onClose, onDone }: { mau: MauTv | null; onClose: () => void; onDone: (t: TacVu) => void }) {
  const m = mau ?? { id: 'tu-dat' as MauId, ten: '', lich: 'ngay' as const, gio: 8 * 60 } as MauTv;
  const [ten, setTen] = useState(mau && !mau.canChuDe ? mau.ten : '');
  const [chuDe, setChuDe] = useState('');
  const [loiNhac, setLoiNhac] = useState('');
  const [lich, setLich] = useState<'ngay' | 'tuan'>(m.lich);
  const [gio, setGio] = useState(hhmm(m.gio));
  const [thu, setThu] = useState(m.thu ?? 1);
  const [dang, setDang] = useState(false);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);
  const tao = async () => {
    const [h, p] = gio.split(':').map(Number);
    setDang(true);
    try {
      const r = await api.post('/ai/chat/tac-vu', {
        mau: m.id, ten: ten.trim() || undefined, chuDe: chuDe.trim() || undefined, loiNhac: m.id === 'tu-dat' ? loiNhac : undefined,
        lich, gio: h * 60 + p, thu: lich === 'tuan' ? thu : undefined,
      });
      toast.success('Đã tạo tác vụ');
      onDone(r.data.data as TacVu);
    } catch (e) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Không tạo được tác vụ');
    } finally { setDang(false); }
  };
  const thieu = (m.canChuDe && !chuDe.trim()) || (m.id === 'tu-dat' && !loiNhac.trim());
  return (
    <div className="ctc-modal-wrap" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ctc-modal ctc-tv-modal" role="dialog" aria-modal="true" aria-label="Tác vụ mới">
        <div className="ctc-modal-head"><b>{mau ? mau.ten : 'Thiết lập thủ công'}</b><span style={{ flex: 1 }} /><button type="button" className="ctc-icon-btn" aria-label="Đóng" onClick={onClose}><X size={17} /></button></div>
        <div className="ctc-tv-form">
          {mau && <p className="ctc-page-note" style={{ margin: 0 }}>{mau.mota}</p>}
          <label><span>Tên tác vụ</span><input value={ten} maxLength={120} onChange={(e) => setTen(e.target.value)} placeholder={mau ? mau.ten : 'Ví dụ: Ôn 10 từ tiếng Nhật mỗi sáng'} /></label>
          {m.canChuDe && <label><span>Chủ đề</span><input value={chuDe} maxLength={200} onChange={(e) => setChuDe(e.target.value)} placeholder={m.goiYChuDe} autoFocus /></label>}
          {m.id === 'tu-dat' && (
            <label><span>CuongMini cần làm gì mỗi lần chạy?</span>
              <textarea rows={4} value={loiNhac} maxLength={2000} onChange={(e) => setLoiNhac(e.target.value)} placeholder="Ví dụ: Cho mình 10 từ vựng tiếng Nhật N3 kèm cách đọc và ví dụ" autoFocus />
            </label>
          )}
          <div className="ctc-tv-lich">
            <label><span>Lặp lại</span>
              <select className="ctc-select" value={lich} onChange={(e) => setLich(e.target.value as 'ngay' | 'tuan')}><option value="ngay">Hằng ngày</option><option value="tuan">Hằng tuần</option></select>
            </label>
            {lich === 'tuan' && (
              <label><span>Vào</span>
                <select className="ctc-select" value={thu} onChange={(e) => setThu(Number(e.target.value))}>{THU.map((t, i) => <option key={i} value={i}>{t}</option>)}</select>
              </label>
            )}
            <label><span>Lúc (giờ VN)</span><input type="time" value={gio} onChange={(e) => setGio(e.target.value || '08:00')} /></label>
          </div>
          <p className="ctc-page-note" style={{ margin: 0 }}>{dongLich(lich, Number(gio.slice(0, 2)) * 60 + Number(gio.slice(3, 5)), thu)} · kết quả ghi vào một cuộc trò chuyện riêng · dùng CuongMini 3.11, tính vào hạn mức chat của bạn.</p>
        </div>
        <div className="ctc-tv-foot">
          <button type="button" className="ctc-btn" onClick={onClose}>Huỷ</button>
          <button type="button" className="ctc-btn" data-primary disabled={thieu || dang} onClick={() => void tao()} data-testid="ctc-tv-tao">
            {dang && <Loader2 size={14} className="animate-spin" />} Tạo tác vụ
          </button>
        </div>
      </div>
    </div>
  );
}

export function ScheduledView({ signedIn, onOpenChat }: { signedIn: boolean; onOpenChat: (sessionId: string) => void }) {
  const [tab, setTab] = useState<'cua-ban' | 'mau'>('cua-ban');
  const [ds, setDs] = useState<TacVu[] | null>(null);
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState<'tat-ca' | 'bat' | 'tat'>('tat-ca');
  const [sapXep, setSapXep] = useState<'sap-chay' | 'ten' | 'moi'>('sap-chay');
  const [menuMoi, setMenuMoi] = useState(false);
  const [hop, setHop] = useState<{ mau: MauTv | null } | null>(null);
  const [dangChay, setDangChay] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const tai = useCallback(async () => {
    if (!signedIn) { setDs([]); return; }
    try { const r = await api.get('/ai/chat/tac-vu'); setDs((r.data.data as TacVu[]) ?? []); }
    catch { setDs([]); toast.error('Không tải được tác vụ'); }
  }, [signedIn]);
  useEffect(() => { void tai(); }, [tai]);
  useEffect(() => {
    if (!menuMoi) return;
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuMoi(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuMoi]);

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return (ds ?? [])
      .filter((t) => !kw || `${t.ten} ${t.chuDe ?? ''}`.toLowerCase().includes(kw))
      .filter((t) => loc === 'tat-ca' || (loc === 'bat') === t.bat)
      .sort((a, b) => sapXep === 'ten' ? a.ten.localeCompare(b.ten, 'vi') : sapXep === 'moi' ? 0 : new Date(a.lanToi).getTime() - new Date(b.lanToi).getTime());
  }, [ds, q, loc, sapXep]);

  const moTao = (mau: MauTv | null) => {
    if (!signedIn) { toast.info('Đăng nhập để tạo tác vụ'); return; }
    setMenuMoi(false);
    setHop({ mau });
  };
  const batTat = async (t: TacVu) => {
    setDs((c) => c?.map((x) => (x.id === t.id ? { ...x, bat: !t.bat } : x)) ?? c);
    try { const r = await api.patch(`/ai/chat/tac-vu/${t.id}`, { bat: !t.bat }); setDs((c) => c?.map((x) => (x.id === t.id ? (r.data.data as TacVu) : x)) ?? c); }
    catch { toast.error('Không đổi được'); void tai(); }
  };
  const xoa = async (t: TacVu) => {
    if (!window.confirm(`Xoá tác vụ "${t.ten}"? Cuộc trò chuyện chứa kết quả vẫn còn.`)) return;
    try { await api.delete(`/ai/chat/tac-vu/${t.id}`); setDs((c) => c?.filter((x) => x.id !== t.id) ?? c); }
    catch { toast.error('Không xoá được'); }
  };
  const chay = async (t: TacVu) => {
    setDangChay(t.id);
    try {
      const r = await api.post(`/ai/chat/tac-vu/${t.id}/chay`, {}, { timeout: 180_000 });
      const moi = r.data.data as TacVu;
      setDs((c) => c?.map((x) => (x.id === t.id ? moi : x)) ?? c);
      toast.success('Đã chạy xong', moi.sessionId ? { action: { label: 'Xem kết quả', onClick: () => onOpenChat(moi.sessionId!) } } : undefined);
    } catch (e) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Chạy hỏng');
      void tai();
    } finally { setDangChay(null); }
  };

  return (
    <div className="ctc-page ctc-page-wide">
      <div className="ctc-page-head">
        <h1>Tác vụ đã lên lịch</h1>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button type="button" className="ctc-btn" data-primary onClick={() => setMenuMoi((v) => !v)} aria-haspopup="menu" aria-expanded={menuMoi} data-testid="ctc-tv-moi">
            <Plus size={15} /> Tác vụ mới <ChevronDown size={14} />
          </button>
          {menuMoi && (
            <div className="ctc-menu" style={{ right: 0, top: 'calc(100% + 6px)', minWidth: 250 }} role="menu">
              <button type="button" className="ctc-menu-item" onClick={() => moTao(null)}><PenLine size={15} /> Thiết lập thủ công</button>
              <div className="ctc-menu-sep" />
              <div className="ctc-menu-label">Từ mẫu</div>
              {MAU_TAC_VU.map((m) => (
                <button key={m.id} type="button" className="ctc-menu-item" disabled={!!m.sapCo} onClick={() => moTao(m)}>
                  <m.icon size={15} /> {m.ten}{m.sapCo && <span className="ctc-soon">Sắp có</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ctc-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'cua-ban'} data-on={tab === 'cua-ban'} onClick={() => setTab('cua-ban')}>Của bạn{ds && ds.length ? ` (${ds.length})` : ''}</button>
        <button type="button" role="tab" aria-selected={tab === 'mau'} data-on={tab === 'mau'} onClick={() => setTab('mau')}>Mẫu</button>
      </div>

      {tab === 'cua-ban' ? (
        <>
          {(ds?.length ?? 0) > 0 && (
            <div className="ctc-toolbar">
              <label className="ctc-page-search ctc-toolbar-search"><Search size={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tác vụ…" /></label>
              <select className="ctc-select" value={loc} onChange={(e) => setLoc(e.target.value as typeof loc)} aria-label="Lọc"><option value="tat-ca">Tất cả</option><option value="bat">Đang bật</option><option value="tat">Đã tắt</option></select>
              <select className="ctc-select" value={sapXep} onChange={(e) => setSapXep(e.target.value as typeof sapXep)} aria-label="Sắp xếp"><option value="sap-chay">Sắp chạy</option><option value="ten">Tên A–Z</option><option value="moi">Mới tạo</option></select>
            </div>
          )}
          {ds === null ? (
            <div className="ctc-empty-big"><Loader2 className="animate-spin" /></div>
          ) : ds.length === 0 ? (
            <div className="ctc-empty-big">
              <DongHoBamGio />
              <h3>Chưa có tác vụ nào</h3>
              <p>Để CuongMini tự làm việc theo lịch: tóm tắt tin mỗi sáng, theo dõi một chủ đề, tổng kết tuần học. Kết quả nằm sẵn trong một cuộc trò chuyện.</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button type="button" className="ctc-btn" data-primary onClick={() => moTao(null)}><PenLine size={14} /> Thiết lập thủ công</button>
                <button type="button" className="ctc-btn" onClick={() => setTab('mau')}>Xem mẫu</button>
              </div>
            </div>
          ) : (
            <div className="ctc-tv-list">
              {list.map((t) => {
                const mau = MAU_TAC_VU.find((m) => m.id === t.mau);
                const Ic = mau?.icon ?? CalendarClock;
                return (
                  <div key={t.id} className="ctc-tv-row" data-off={!t.bat}>
                    <span className="ctc-the-ic" data-mau={mau?.mau ?? 'slate'}><Ic size={18} /></span>
                    <div className="ctc-tv-info">
                      <b>{t.ten}</b>
                      <small>
                        {dongLich(t.lich, t.gio, t.thu)}
                        {t.bat ? ` · lần tới ${new Date(t.lanToi).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}` : ' · đang tắt'}
                        {t.lanCuoi && ` · chạy ${tuongDoi(new Date(t.lanCuoi).getTime())}`}
                      </small>
                      {t.loiCuoi && <small className="ctc-tv-loi">Lần trước hỏng: {t.loiCuoi}</small>}
                    </div>
                    {t.sessionId && <button type="button" className="ctc-btn" onClick={() => onOpenChat(t.sessionId!)}><MessageSquare size={14} /> Kết quả</button>}
                    <button type="button" className="ctc-icon-btn" title="Chạy ngay" aria-label="Chạy ngay" disabled={dangChay === t.id} onClick={() => void chay(t)}>
                      {dangChay === t.id ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                    </button>
                    <button type="button" role="switch" aria-checked={t.bat} aria-label={t.bat ? 'Tắt tác vụ' : 'Bật tác vụ'} className="ctc-switch" data-on={t.bat} onClick={() => void batTat(t)}><span /></button>
                    <button type="button" className="ctc-icon-btn" title="Xoá" aria-label="Xoá" onClick={() => void xoa(t)}><Trash2 size={16} /></button>
                  </div>
                );
              })}
              {list.length === 0 && <p className="ctc-page-note">Không có tác vụ khớp.</p>}
            </div>
          )}
        </>
      ) : (
        <div className="ctc-the-grid">
          {MAU_TAC_VU.map((m) => (
            <div key={m.id} className="ctc-the" data-soon={!!m.sapCo}>
              <div className="ctc-the-top">
                <span className="ctc-the-ic" data-mau={m.mau}><m.icon size={20} /></span>
                {m.sapCo && <span className="ctc-soon">Sắp có</span>}
              </div>
              <b>{m.ten}</b>
              <p>{m.mota}</p>
              <div className="ctc-tv-sched"><CalendarClock size={13} /> {dongLich(m.lich, m.gio, m.thu)}</div>
              <div className="ctc-the-foot">
                <small>{m.sapCo ?? 'CuongThai'}</small>
                <button type="button" className="ctc-btn" disabled={!!m.sapCo} onClick={() => moTao(m)}>Dùng mẫu</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {hop && <HopTao mau={hop.mau} onClose={() => setHop(null)} onDone={(t) => { setHop(null); setDs((c) => [t, ...(c ?? [])]); setTab('cua-ban'); }} />}
    </div>
  );
}
