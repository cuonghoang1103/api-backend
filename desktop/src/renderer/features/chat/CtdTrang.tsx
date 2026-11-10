/**
 * Các màn của thanh bên Trò chuyện (app desktop, 10/11/2026) — cùng bố cục với /chat web (claude.ai):
 *   Lịch sử (chọn nhiều · xoá · dọn cuộc trống · kho lưu trữ) · Dự án (= thư mục chat) · một Dự án · Artifacts ·
 *   Tác vụ đã lên lịch · Tùy chỉnh · hộp Tìm kiếm.
 *
 * Máy chủ dùng chung với web: `/ai/chat/sessions/xoa-nhieu|xoa-trong`, `/ai/chat/tac-vu…` (src/routes/ai.routes.ts).
 * "Code" của web = chế độ Lập trình của app (làm việc THẬT trên máy) — không làm lại ở đây.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, BarChart3, CalendarClock, CalendarDays, Check, ChevronDown, Code2, Copy, Eraser, ExternalLink,
  FolderKanban, FolderPlus, Github, Globe, Image as ImageIcon, Inbox, KanbanSquare, Languages, Lightbulb, ListChecks,
  Loader2, MessageSquare, Mic, MonitorDown, Newspaper, PenLine, Play, Plus, Radar, Search, Sigma,
  TerminalSquare, Trash2, Workflow, X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ApiClient } from '../../api/client';
import { ChuAgent } from './markdown';
import { CtcDau } from './CtcDau';
import { CtcChonModel, type MaModel } from './CtcChonModel';
import { useCtcChu } from './CtcChu';
import { datTuyChinh, useTuyChinh } from './ctdTuyChinh';
import { KET_NOI, KY_NANG, PLUGIN, type KyNangThe, type MauThe } from './ctdDanhMuc';
import type { PhienChat, ThuMuc } from './ThanhBenChat';

export type CtdView = 'chat' | 'recents' | 'projects' | 'artifacts' | 'scheduled' | 'customize' | `project:${string}`;

const lucCua = (p: PhienChat): number => new Date(p.updatedAt).getTime();
const loiCua = (e: unknown): string => (e instanceof Error ? e.message : String(e));

export function moWeb(duong: string): void {
  const goc = (globalThis as { __ctWebOrigin?: string }).__ctWebOrigin ?? 'https://cuongthai.com';
  void window.cuongthai?.app.openExternal(`${goc}${duong}`);
}

export function tuongDoi(ms: number): string {
  const m = Math.round((Date.now() - ms) / 60_000);
  if (m < 1) return 'vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const n = Math.round(h / 24);
  if (n < 30) return `${n} ngày trước`;
  return new Date(ms).toLocaleDateString('vi-VN');
}

function Trong({ tieuDe, children }: { tieuDe: string; children?: React.ReactNode }) {
  return (
    <div className="ctd-trong">
      <CtcDau co={84} />
      <h3>{tieuDe}</h3>
      {children}
    </div>
  );
}

/* ═══ Lịch sử ═══════════════════════════════════════════════════════════ */
export function TrangLichSu({
  ds, xemLuuTru, onXemLuuTru, onMo, onMoi, onXoaNhieu, onDonTrong,
}: {
  ds: PhienChat[];
  xemLuuTru: boolean;
  onXemLuuTru: (v: boolean) => void;
  onMo: (id: string) => void;
  onMoi: () => void;
  onXoaNhieu: (ids: string[]) => Promise<void>;
  onDonTrong: () => Promise<void>;
}) {
  const { c } = useCtcChu();
  const [q, datQ] = useState('');
  const [chon, datChon] = useState<Set<string> | null>(null);
  const [dangXoa, datDangXoa] = useState(false);
  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return [...ds].filter((p) => !kw || (p.title ?? '').toLowerCase().includes(kw)).sort((a, b) => lucCua(b) - lucCua(a));
  }, [ds, q]);
  const tatCa = !!chon && list.length > 0 && list.every((p) => chon.has(p.id));
  const doiChon = (id: string): void => datChon((cu) => {
    const n = new Set(cu ?? []);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  return (
    <div className="ctd-trang">
      <div className="ctd-dau">
        <h1>{c('Lịch sử trò chuyện')}</h1>
        <button type="button" className="ctd-nut" data-chinh onClick={onMoi}><Plus size={15} /> {c('Cuộc trò chuyện mới')}</button>
      </div>
      <div className="ctd-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={!xemLuuTru} data-on={!xemLuuTru} onClick={() => { onXemLuuTru(false); datChon(null); }}>{c('Đang dùng')}</button>
        <button type="button" role="tab" aria-selected={xemLuuTru} data-on={xemLuuTru} onClick={() => { onXemLuuTru(true); datChon(null); }}>{c('Kho lưu trữ')}</button>
      </div>
      <label className="ctd-tim"><Search size={16} /><input autoFocus value={q} onChange={(e) => datQ(e.target.value)} placeholder={c('Tìm cuộc trò chuyện…')} /></label>
      <div className="ctd-thanh">
        {chon ? (
          <>
            <label className="ctd-chon-het">
              <input type="checkbox" checked={tatCa} onChange={() => datChon(tatCa ? new Set() : new Set(list.map((p) => p.id)))} />
              <span>{chon.size > 0 ? `${c('Đã chọn')} ${chon.size}` : c('Chọn tất cả')}</span>
            </label>
            <span style={{ flex: 1 }} />
            <button type="button" className="ctd-nut" onClick={() => datChon(null)}>{c('Huỷ')}</button>
            <button
              type="button" className="ctd-nut" data-nguy disabled={chon.size === 0 || dangXoa}
              onClick={async () => {
                if (!window.confirm(`${c('Xoá')} ${chon.size}? ${c('Không thể hoàn tác.')}`)) return;
                datDangXoa(true);
                try { await onXoaNhieu([...chon]); datChon(null); } finally { datDangXoa(false); }
              }}
            >
              <Trash2 size={14} /> {c('Xoá')}{chon.size ? ` (${chon.size})` : ''}
            </button>
          </>
        ) : (
          <>
            <span className="ctd-ghi" style={{ flex: 1, margin: 0 }}>{ds.length} {c('cuộc trò chuyện')}</span>
            {!xemLuuTru && <button type="button" className="ctd-nut" onClick={() => void onDonTrong()}><Eraser size={14} /> {c('Xoá các cuộc trò chuyện trống')}</button>}
            {ds.length > 0 && <button type="button" className="ctd-nut" onClick={() => datChon(new Set())}><ListChecks size={14} /> {c('Chọn')}</button>}
          </>
        )}
      </div>
      <div className="ctd-ds">
        {list.map((p) => (chon ? (
          <label key={p.id} className="ctd-dong ctd-dong-chon" data-on={chon.has(p.id)}>
            <input type="checkbox" checked={chon.has(p.id)} onChange={() => doiChon(p.id)} />
            <span className="ctd-dong-cot"><b>{p.title?.trim() || c('Cuộc chưa đặt tên')}</b><small>{tuongDoi(lucCua(p))}</small></span>
          </label>
        ) : (
          <button key={p.id} type="button" className="ctd-dong" onClick={() => onMo(p.id)}>
            <span className="ctd-dong-cot"><b>{p.title?.trim() || c('Cuộc chưa đặt tên')}</b><small>{c('Tin nhắn cuối')} {tuongDoi(lucCua(p))}</small></span>
          </button>
        )))}
        {list.length === 0 && <Trong tieuDe={q ? c('Không khớp cuộc nào.') : xemLuuTru ? c('Kho lưu trữ đang trống.') : c('Chưa có cuộc trò chuyện nào.')} />}
      </div>
    </div>
  );
}

/* ═══ Dự án ═════════════════════════════════════════════════════════════ */
export function TrangDuAn({ dsThuMuc, onMo, onTao }: { dsThuMuc: ThuMuc[]; onMo: (id: string) => void; onTao: (ten: string) => void }) {
  const { c } = useCtcChu();
  const [q, datQ] = useState('');
  const [taoMoi, datTaoMoi] = useState<string | null>(null);
  const list = dsThuMuc.filter((f) => !q.trim() || f.ten.toLowerCase().includes(q.trim().toLowerCase()));
  const luu = (): void => { const t = taoMoi?.trim(); datTaoMoi(null); if (t) onTao(t); };
  return (
    <div className="ctd-trang">
      <div className="ctd-dau">
        <h1>{c('Dự án')}</h1>
        <button type="button" className="ctd-nut" data-chinh onClick={() => datTaoMoi('')}><Plus size={15} /> {c('Dự án mới')}</button>
      </div>
      {taoMoi !== null && (
        <div className="ctd-tao">
          <input autoFocus value={taoMoi} maxLength={80} placeholder={c('Tên dự án, ví dụ: Đồ án SWP391')} onChange={(e) => datTaoMoi(e.target.value)}
            onKeyDown={(e) => { if (e.nativeEvent.isComposing) return; if (e.key === 'Enter') luu(); if (e.key === 'Escape') datTaoMoi(null); }} />
          <button type="button" className="ctd-nut" data-chinh disabled={!taoMoi.trim()} onClick={luu}>{c('Tạo')}</button>
          <button type="button" className="ctd-nut" onClick={() => datTaoMoi(null)}>{c('Huỷ')}</button>
        </div>
      )}
      {dsThuMuc.length > 0 && <label className="ctd-tim"><Search size={16} /><input value={q} onChange={(e) => datQ(e.target.value)} placeholder={c('Tìm dự án…')} /></label>}
      <div className="ctd-luoi">
        {list.map((f) => (
          <button key={f.id} type="button" className="ctd-the ctd-the-bam" onClick={() => onMo(f.id)}>
            <span className="ctd-ic" data-mau="violet" style={f.mau ? { background: f.mau } : undefined}><FolderKanban size={18} /></span>
            <b>{f.ten}</b>
            <small>{f._count?.sessions ?? 0} {c('cuộc trò chuyện')}</small>
          </button>
        ))}
      </div>
      {dsThuMuc.length === 0 && taoMoi === null && (
        <Trong tieuDe={c('Chưa có dự án nào')}>
          <p>{c('Dự án gom các cuộc trò chuyện cùng một việc (một môn học, một đồ án…) để dễ tìm lại.')}</p>
          <button type="button" className="ctd-nut" data-chinh onClick={() => datTaoMoi('')}><FolderPlus size={14} /> {c('Tạo dự án')}</button>
        </Trong>
      )}
    </div>
  );
}

export function TrangMotDuAn({ thuMuc, ds, onLui, onMo, onBatDau, onXoa }: {
  thuMuc: ThuMuc | undefined; ds: PhienChat[]; onLui: () => void; onMo: (id: string) => void; onBatDau: () => void; onXoa: () => void;
}) {
  const { c } = useCtcChu();
  if (!thuMuc) return <div className="ctd-trang"><Trong tieuDe={c('Không tìm thấy dự án')} /></div>;
  const list = ds.filter((p) => p.folderId === thuMuc.id).sort((a, b) => lucCua(b) - lucCua(a));
  return (
    <div className="ctd-trang">
      <button type="button" className="ctd-lui" onClick={onLui}><ArrowLeft size={15} /> {c('Tất cả dự án')}</button>
      <div className="ctd-dau">
        <h1><FolderKanban size={26} style={{ color: thuMuc.mau || 'var(--ctc-nhan)', flexShrink: 0 }} /><span>{thuMuc.ten}</span></h1>
        <button type="button" className="ctd-icon" title={c('Xoá dự án')} aria-label={c('Xoá dự án')}
          onClick={() => { if (window.confirm(`${c('Xoá dự án')} "${thuMuc.ten}"? ${c('Các cuộc trò chuyện bên trong vẫn còn.')}`)) onXoa(); }}>
          <Trash2 size={17} />
        </button>
      </div>
      <button type="button" className="ctd-bat-dau" onClick={onBatDau}><Plus size={16} /> {c('Bắt đầu cuộc trò chuyện mới trong dự án này')}</button>
      <div className="ctd-ds">
        {list.map((p) => (
          <button key={p.id} type="button" className="ctd-dong" onClick={() => onMo(p.id)}>
            <span className="ctd-dong-cot"><b>{p.title?.trim() || c('Cuộc chưa đặt tên')}</b><small>{c('Tin nhắn cuối')} {tuongDoi(lucCua(p))}</small></span>
          </button>
        ))}
        {list.length === 0 && <p className="ctd-ghi">{c('Dự án này chưa có cuộc trò chuyện nào.')}</p>}
      </div>
    </div>
  );
}

/* ═══ Artifacts ═════════════════════════════════════════════════════════
   Code & sơ đồ CuongMini đã viết — đọc lịch sử của tối đa 20 cuộc gần nhất (một lần mỗi lần mở màn). */
interface Artifact { khoa: string; lang: string; code: string; phien: string; ten: string; luc: number }
const RE_KHOI = /```([\w+#.-]*)[^\n]*\n([\s\S]*?)```/g;

export function trichArtifacts(tin: Array<{ phien: string; ten: string; role: string; content: string; luc: number }>): Artifact[] {
  const out: Artifact[] = [];
  tin.forEach((m, i) => {
    if (m.role !== 'assistant' || !m.content) return;
    let k = 0;
    for (const r of m.content.matchAll(RE_KHOI)) {
      const code = (r[2] ?? '').replace(/\s+$/, '');
      const lang = (r[1] || 'text').toLowerCase();
      if (!(lang === 'svg' || lang === 'mermaid') && code.split('\n').length < 4) continue;
      out.push({ khoa: `${m.phien}:${i}:${k++}`, lang, code, phien: m.phien, ten: m.ten, luc: m.luc });
    }
  });
  return out.sort((a, b) => b.luc - a.luc);
}

export function TrangArtifacts({ api, ds, onMoPhien }: { api: ApiClient | null; ds: PhienChat[]; onMoPhien: (id: string) => void }) {
  const { c } = useCtcChu();
  const [tat, datTat] = useState<Artifact[] | null>(null);
  const [q, datQ] = useState('');
  const [mo, datMo] = useState<Artifact | null>(null);
  useEffect(() => {
    if (!api) { datTat([]); return; }
    let huy = false;
    const gan = [...ds].sort((a, b) => lucCua(b) - lucCua(a)).slice(0, 20);
    void Promise.all(gan.map(async (p) => {
      try {
        const r = await api.request<Array<{ role: string; content: string; createdAt?: string }>>(`/api/v1/ai/chat/history/${p.id}`);
        return (Array.isArray(r) ? r : []).map((m) => ({ phien: p.id, ten: p.title?.trim() || 'Cuộc trò chuyện', role: m.role, content: String(m.content ?? '').normalize('NFC'), luc: m.createdAt ? new Date(m.createdAt).getTime() : lucCua(p) }));
      } catch { return []; }
    })).then((x) => { if (!huy) datTat(trichArtifacts(x.flat())); });
    return () => { huy = true; };
  }, [api, ds]);
  const list = (tat ?? []).filter((a) => !q.trim() || `${a.ten} ${a.lang} ${a.code}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="ctd-trang ctd-trang-rong">
      <div className="ctd-dau"><h1>Artifacts</h1></div>
      <p className="ctd-ghi">{c('Code và sơ đồ CuongMini đã viết trong 20 cuộc trò chuyện gần nhất.')}</p>
      {(tat?.length ?? 0) > 0 && <label className="ctd-tim"><Search size={16} /><input value={q} onChange={(e) => datQ(e.target.value)} placeholder={c('Tìm theo tên, ngôn ngữ, nội dung…')} /></label>}
      {tat === null && <div className="ctd-trong"><Loader2 className="ctd-quay" /></div>}
      <div className="ctd-luoi ctd-luoi-art">
        {list.map((a) => (
          <button key={a.khoa} type="button" className="ctd-art" onClick={() => datMo(a)}>
            <pre>{a.code.split('\n').slice(0, 9).join('\n')}</pre>
            <span className="ctd-art-chan">
              <span className="ctd-nhan">{a.lang === 'svg' || a.lang === 'mermaid' ? <Workflow size={12} /> : <Code2 size={12} />} {a.lang}</span>
              <b>{a.ten}</b>
              <small>{tuongDoi(a.luc)}</small>
            </span>
          </button>
        ))}
      </div>
      {tat !== null && tat.length === 0 && (
        <Trong tieuDe={c('Chưa có artifact nào')}><p>{c('Nhờ CuongMini viết code, dựng sơ đồ hay một đoạn SQL — chúng sẽ được gom về đây.')}</p></Trong>
      )}
      {mo && <HopArtifact a={mo} onDong={() => datMo(null)} onMoPhien={() => { datMo(null); onMoPhien(mo.phien); }} />}
    </div>
  );
}

function HopArtifact({ a, onDong, onMoPhien }: { a: Artifact; onDong: () => void; onMoPhien: () => void }) {
  const { c } = useCtcChu();
  const [ok, datOk] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent): void => { if (e.key === 'Escape') onDong(); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [onDong]);
  return (
    <div className="ctd-hop-nen" onMouseDown={(e) => { if (e.target === e.currentTarget) onDong(); }}>
      <div className="ctd-hop ctd-hop-lon" role="dialog" aria-modal="true" aria-label={a.ten}>
        <div className="ctd-hop-dau">
          <b>{a.ten}</b><span className="ctd-nhan">{a.lang}</span><span style={{ flex: 1 }} />
          <button type="button" className="ctd-nut" onClick={async () => {
            try { await navigator.clipboard.writeText(a.code); datOk(true); setTimeout(() => datOk(false), 1600); } catch { toast.error(c('Không chép được')); }
          }}>{ok ? <Check size={14} /> : <Copy size={14} />} {ok ? c('Đã chép') : c('Chép')}</button>
          <button type="button" className="ctd-nut" onClick={onMoPhien}><MessageSquare size={14} /> {c('Mở cuộc trò chuyện')}</button>
          <button type="button" className="ctd-icon" aria-label={c('Đóng')} onClick={onDong}><X size={17} /></button>
        </div>
        <div className="ctd-hop-than ctc-may"><ChuAgent text={'```' + a.lang + '\n' + a.code + '\n```'} /></div>
      </div>
    </div>
  );
}

/* ═══ Tùy chỉnh ═════════════════════════════════════════════════════════ */
function Cong({ on, onDoi, nhan }: { on: boolean; onDoi: (v: boolean) => void; nhan: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={nhan} className="ctd-cong" data-on={on} onClick={() => onDoi(!on)}><span /></button>;
}
const ICON: Record<string, typeof Code2> = {
  code: Code2, sigma: Sigma, image: ImageIcon, languages: Languages, pen: PenLine, workflow: Workflow, terminal: TerminalSquare,
  mic: Mic, globe: Globe, github: Github, kanban: KanbanSquare, desktop: MonitorDown, vscode: Code2,
};
function IconThe({ icon, mau, co = 20 }: { icon: string; mau: MauThe; co?: number }) {
  if (icon === 'japan') return <span className="ctd-ic" data-mau={mau} style={{ fontSize: co * 0.8, fontWeight: 700 }}>あ</span>;
  const I = ICON[icon] ?? Code2;
  return <span className="ctd-ic" data-mau={mau}><I size={co} /></span>;
}

export function TrangTuyChinh({ pro, model, onChonModel, onThu, onLapTrinh, onMoTrang }: {
  pro: boolean; model: string; onChonModel: (m: MaModel) => void; onThu: (id: string, viDu: string) => void; onLapTrinh: () => void; onMoTrang: (duong: string) => void;
}) {
  const { c } = useCtcChu();
  const p = useTuyChinh();
  const [tab, datTab] = useState<'skills' | 'ket-noi' | 'plugin' | 'cai-dat'>('skills');
  const [pham, datPham] = useState<'cua-ban' | 'kham-pha'>('kham-pha');
  const [q, datQ] = useState('');
  const [loc, datLoc] = useState<'tat-ca' | 'ky-nang' | 'cong-cu'>('tat-ca');
  const [sapXep, datSapXep] = useState<'noi-bat' | 'ten'>('noi-bat');
  const [moiDu, datMoiDu] = useState(false);
  const [ten, datTen] = useState(p.tenGoi);
  const daCo = (k: KyNangThe): boolean => k.loai === 'cong-cu' || p.kyNangBat.includes(k.id);
  const batTat = (k: KyNangThe): void => {
    if (k.loai === 'cong-cu') return;
    datTuyChinh({ kyNangBat: p.kyNangBat.includes(k.id) ? p.kyNangBat.filter((x) => x !== k.id) : [...p.kyNangBat, k.id] });
  };
  const kw = q.trim().toLowerCase();
  const skills = KY_NANG.filter((k) => (pham === 'cua-ban' ? daCo(k) : true)).filter((k) => loc === 'tat-ca' || k.loai === loc)
    .filter((k) => !kw || `${k.ten} ${k.mota}`.toLowerCase().includes(kw)).sort((a, b) => (sapXep === 'ten' ? a.ten.localeCompare(b.ten, 'vi') : 0));
  const moi = KY_NANG.filter((k) => k.moi);
  const the = (k: KyNangThe) => (
    <div key={k.id} className="ctd-the">
      <div className="ctd-the-tren">
        <IconThe icon={k.icon} mau={k.mau} />
        <button type="button" className="ctd-them" data-on={daCo(k)} disabled={k.loai === 'cong-cu'} onClick={() => batTat(k)}
          title={k.loai === 'cong-cu' ? c('Luôn bật') : daCo(k) ? c('Đã thêm — bấm để bỏ') : c('Thêm vào của bạn')}>
          {daCo(k) ? <Check size={15} /> : <Plus size={15} />}
        </button>
      </div>
      <b>{k.ten}{k.canPro && <span className="ctd-pro">Pro</span>}</b>
      <p>{k.mota}</p>
      <div className="ctd-the-chan">
        <small>CuongThai · {k.loai === 'cong-cu' ? c('Công cụ') : c('Kỹ năng')}</small>
        {k.viDu && <button type="button" className="ctd-nut" disabled={k.canPro && !pro} onClick={() => onThu(k.id, k.viDu)}>{c('Dùng thử')}</button>}
      </div>
    </div>
  );
  return (
    <div className="ctd-trang ctd-trang-rong">
      <div className="ctd-dau"><h1>{c('Tùy chỉnh')}</h1></div>
      <div className="ctd-tabs" role="tablist">
        {([['skills', 'Skills'], ['ket-noi', c('Trình kết nối')], ['plugin', 'Plugin'], ['cai-dat', c('Cài đặt trả lời')]] as const).map(([v, l]) => (
          <button key={v} type="button" role="tab" aria-selected={tab === v} data-on={tab === v} onClick={() => datTab(v)}>{l}</button>
        ))}
      </div>

      {tab === 'skills' && (
        <>
          <div className="ctd-thanh">
            <div className="ctd-seg" role="radiogroup">
              <button type="button" role="radio" aria-checked={pham === 'cua-ban'} data-on={pham === 'cua-ban'} onClick={() => datPham('cua-ban')}>{c('Của bạn')}</button>
              <button type="button" role="radio" aria-checked={pham === 'kham-pha'} data-on={pham === 'kham-pha'} onClick={() => datPham('kham-pha')}>{c('Khám phá')}</button>
            </div>
            <label className="ctd-tim ctd-tim-nho"><Search size={15} /><input value={q} onChange={(e) => datQ(e.target.value)} placeholder={c('Tìm kỹ năng…')} /></label>
            <select className="ctd-chon" value={loc} onChange={(e) => datLoc(e.target.value as typeof loc)} aria-label={c('Lọc')}>
              <option value="tat-ca">{c('Tất cả')}</option><option value="ky-nang">{c('Kỹ năng')}</option><option value="cong-cu">{c('Công cụ')}</option>
            </select>
            <select className="ctd-chon" value={sapXep} onChange={(e) => datSapXep(e.target.value as typeof sapXep)} aria-label={c('Sắp xếp')}>
              <option value="noi-bat">{c('Nổi bật')}</option><option value="ten">{c('Tên A–Z')}</option>
            </select>
          </div>
          {pham === 'kham-pha' && !kw && loc === 'tat-ca' && (
            <div className="ctd-banner">
              <div className="ctd-banner-chu">
                <span className="ctd-banner-nhan">{c('Nổi bật')}</span>
                <h2>{c('Học ngoại ngữ cùng CuongMini')}</h2>
                <p>{c('Gia sư tiếng Anh và tiếng Nhật: giải thích bằng tiếng Việt, ví dụ chuẩn bản xứ, sửa từng lỗi trong câu bạn viết.')}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button type="button" className="ctd-nut" data-chinh onClick={() => onThu('tieng-nhat', KY_NANG.find((k) => k.id === 'tieng-nhat')!.viDu)}>{c('Dùng thử tiếng Nhật')}</button>
                  <button type="button" className="ctd-nut" onClick={() => onThu('tieng-anh', KY_NANG.find((k) => k.id === 'tieng-anh')!.viDu)}>{c('Tiếng Anh')}</button>
                </div>
              </div>
              <CtcDau co={110} />
            </div>
          )}
          <h3 className="ctd-muc">{pham === 'cua-ban' ? c('Kỹ năng của bạn') : c('Dành cho bạn')}</h3>
          {skills.length > 0 ? <div className="ctd-luoi">{skills.map(the)}</div> : <p className="ctd-ghi">{c('Không có kỹ năng khớp.')}</p>}
          {pham === 'kham-pha' && !kw && moi.length > 0 && (
            <>
              <div className="ctd-muc-hang"><h3 className="ctd-muc" style={{ margin: 0 }}>{c('Skills mới')}</h3>
                {moi.length > 2 && <button type="button" className="ctd-lien" onClick={() => datMoiDu((v) => !v)}>{moiDu ? c('Thu gọn') : c('Hiển thị tất cả')}</button>}</div>
              <div className="ctd-luoi">{(moiDu ? moi : moi.slice(0, 2)).map(the)}</div>
            </>
          )}
          <p className="ctd-ghi" style={{ marginTop: 18 }}>{c('Kỹ năng đã thêm hiện trong nút ＋ của ô soạn để chọn cho từng câu hỏi.')}</p>
        </>
      )}

      {tab === 'ket-noi' && (
        <div className="ctd-luoi">
          {KET_NOI.map((k) => (
            <div key={k.id} className="ctd-the">
              <div className="ctd-the-tren"><IconThe icon={k.icon} mau={k.mau} />{k.kieu === 'cong-tac' && <Cong on={p.timWeb} onDoi={(v) => datTuyChinh({ timWeb: v })} nhan={k.ten} />}</div>
              <b>{k.ten}</b><p>{k.mota}</p>
              <div className="ctd-the-chan">
                <small>{k.ghiChu ?? 'CuongThai'}</small>
                {k.kieu === 'lien-ket' && (
                  <button type="button" className="ctd-nut" onClick={() => (k.href === '#lap-trinh' ? onLapTrinh() : onMoTrang(k.href ?? '/'))}>{k.nhanNut}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'plugin' && (
        <div className="ctd-luoi">
          {PLUGIN.map((k) => (
            <div key={k.id} className="ctd-the">
              <div className="ctd-the-tren"><IconThe icon={k.icon} mau={k.mau} /></div>
              <b>{k.ten}</b><p>{k.mota}</p>
              <div className="ctd-the-chan">
                <small>CuongThai</small>
                {k.href ? <button type="button" className="ctd-nut" onClick={() => moWeb(k.href)}>{k.nhanNut} <ExternalLink size={13} /></button> : <span className="ctd-nhan"><Check size={12} /> {c('Đang dùng')}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'cai-dat' && (
        <section className="ctd-cai">
          <div className="ctd-cai-hang">
            <div><b>{c('CuongMini nên gọi bạn là gì?')}</b><small>{c('Dùng trong lời chào trên màn hình.')}</small></div>
            <input className="ctd-o" value={ten} maxLength={40} placeholder={c('Để trống = tên tài khoản')}
              onChange={(e) => datTen(e.target.value)} onBlur={() => datTuyChinh({ tenGoi: ten.trim() })} />
          </div>
          <div className="ctd-cai-hang">
            <div><b>{c('Ngôn ngữ trả lời')}</b><small>{c('Tự động = trả lời theo ngôn ngữ bạn hỏi.')}</small></div>
            <div className="ctd-seg" role="radiogroup">
              {([['auto', c('Tự động')], ['vi', 'Tiếng Việt'], ['en', 'English']] as const).map(([v, l]) => (
                <button key={v} type="button" role="radio" aria-checked={p.ngonNgu === v} data-on={p.ngonNgu === v} onClick={() => datTuyChinh({ ngonNgu: v })}>{l}</button>
              ))}
            </div>
          </div>
          <div className="ctd-cai-hang">
            <div><b>{c('Tìm trên web')}</b><small>{c('Cho phép CuongMini tìm tin mới khi câu hỏi cần (kèm thẻ nguồn).')}</small></div>
            <Cong on={p.timWeb} onDoi={(v) => datTuyChinh({ timWeb: v })} nhan={c('Tìm trên web')} />
          </div>
          <div className="ctd-cai-hang">
            <div><b>{c('Kỹ năng tự nhận')}</b><small>{c('Không chọn kỹ năng nào thì tự bật cách trả lời hợp việc: code, toán, ảnh, tiếng Anh, tiếng Nhật…')}</small></div>
            <Cong on={p.kyNangTuDong} onDoi={(v) => datTuyChinh({ kyNangTuDong: v })} nhan={c('Kỹ năng tự nhận')} />
          </div>
          <div className="ctd-cai-hang">
            <div><b>{c('Model mặc định')}</b><small>{pro ? c('Đổi được bất cứ lúc nào ngay dưới ô soạn.') : c('Pro, Pro 2 và Max dành cho tài khoản Pro.')}</small></div>
            <CtcChonModel giaTri={model} pro={pro} khoa={false} onChon={onChonModel} huong="duoi" />
          </div>
        </section>
      )}
    </div>
  );
}

/* ═══ Tác vụ đã lên lịch ════════════════════════════════════════════════ */
type MauId = 'tom-tat-ngay' | 'theo-doi' | 'y-tuong' | 'tong-ket-tuan' | 'tu-dat' | 'hop-thu' | 'cuoc-hop';
interface MauTv { id: MauId; ten: string; mota: string; icon: typeof Newspaper; mau: MauThe; lich: 'ngay' | 'tuan'; gio: number; thu?: number; canChuDe?: boolean; goiY?: string; sapCo?: string }
const MAU_TV: MauTv[] = [
  { id: 'tom-tat-ngay', ten: 'Tóm tắt hằng ngày', mota: '5 tin công nghệ & AI nổi bật trong 24 giờ, mỗi tin 2–3 câu kèm nguồn.', icon: Newspaper, mau: 'blue', lich: 'ngay', gio: 450 },
  { id: 'hop-thu', ten: 'Phân loại hộp thư đến', mota: 'Đọc thư mới, gom theo mức quan trọng, gợi ý thư cần trả lời.', icon: Inbox, mau: 'teal', lich: 'ngay', gio: 480, sapCo: 'Cần kết nối Gmail' },
  { id: 'cuoc-hop', ten: 'Chuẩn bị cuộc họp', mota: 'Trước mỗi cuộc họp: tóm tắt người dự, việc cần chốt, câu hỏi nên hỏi.', icon: CalendarDays, mau: 'amber', lich: 'ngay', gio: 480, sapCo: 'Cần kết nối Lịch' },
  { id: 'tong-ket-tuan', ten: 'Tổng kết hằng tuần', mota: 'Nhìn lại các chủ đề bạn đã hỏi CuongMini trong tuần, điểm cần ôn và 3 việc cho tuần tới.', icon: BarChart3, mau: 'violet', lich: 'tuan', gio: 1200, thu: 0 },
  { id: 'y-tuong', ten: 'Ý tưởng nội dung', mota: '5 ý tưởng bài viết/video về chủ đề bạn chọn, mỗi ý có tiêu đề và hướng triển khai.', icon: Lightbulb, mau: 'rose', lich: 'tuan', gio: 540, thu: 1, canChuDe: true, goiY: 'Lập trình web cho sinh viên' },
  { id: 'theo-doi', ten: 'Theo dõi chủ đề', mota: 'Mỗi ngày tìm tin mới nhất về chủ đề bạn quan tâm, có nguồn để kiểm lại.', icon: Radar, mau: 'green', lich: 'ngay', gio: 480, canChuDe: true, goiY: 'Next.js' },
];
const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const hhmm = (p: number): string => `${String(Math.floor(p / 60)).padStart(2, '0')}:${String(p % 60).padStart(2, '0')}`;
const dongLich = (lich: 'ngay' | 'tuan', gio: number, thu?: number | null): string => (lich === 'ngay' ? `Mỗi ngày lúc ${hhmm(gio)}` : `${THU[thu ?? 0]} hằng tuần lúc ${hhmm(gio)}`);
interface TacVu { id: string; ten: string; mau: MauId; chuDe: string | null; lich: 'ngay' | 'tuan'; gio: number; thu: number | null; bat: boolean; sessionId: string | null; lanToi: string; lanCuoi: string | null; loiCuoi: string | null }

function DongHo() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <rect x="52" y="8" width="16" height="10" rx="3" fill="var(--ctc-nhan)" />
      <rect x="57" y="16" width="6" height="8" fill="var(--ctc-nhan)" />
      <rect x="86" y="22" width="12" height="7" rx="3" transform="rotate(40 92 25)" fill="var(--ctc-nhan)" opacity=".8" />
      <circle cx="60" cy="68" r="42" fill="color-mix(in srgb, var(--ctc-nhan) 10%, var(--ctc-mat))" stroke="var(--ctc-nhan)" strokeWidth="4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const g = (i / 12) * Math.PI * 2;
        return <line key={i} x1={60 + Math.sin(g) * 34} y1={68 - Math.cos(g) * 34} x2={60 + Math.sin(g) * (i % 3 ? 31 : 28)} y2={68 - Math.cos(g) * (i % 3 ? 31 : 28)} stroke="var(--ctc-chu-mo)" strokeWidth={i % 3 ? 1.5 : 2.5} strokeLinecap="round" />;
      })}
      <path d="M60 68 L60 40" stroke="var(--ctc-chu)" strokeWidth="3.5" strokeLinecap="round" className="ctd-kim" />
      <path d="M60 68 L76 76" stroke="var(--ctc-nhan)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="68" r="4.5" fill="var(--ctc-nhan)" />
    </svg>
  );
}

function HopTaoTacVu({ api, mau, onDong, onXong }: { api: ApiClient; mau: MauTv | null; onDong: () => void; onXong: (t: TacVu) => void }) {
  const { c } = useCtcChu();
  const m: MauTv = mau ?? { id: 'tu-dat', ten: '', mota: '', icon: PenLine, mau: 'slate', lich: 'ngay', gio: 480 };
  const [ten, datTen] = useState(mau && !mau.canChuDe ? mau.ten : '');
  const [chuDe, datChuDe] = useState('');
  const [loiNhac, datLoiNhac] = useState('');
  const [lich, datLich] = useState<'ngay' | 'tuan'>(m.lich);
  const [gio, datGio] = useState(hhmm(m.gio));
  const [thu, datThu] = useState(m.thu ?? 1);
  const [dang, datDang] = useState(false);
  const tao = async (): Promise<void> => {
    const [h, pp] = gio.split(':').map(Number);
    datDang(true);
    try {
      const t = await api.request<TacVu>('/api/v1/ai/chat/tac-vu', { method: 'POST', body: {
        mau: m.id, ten: ten.trim() || undefined, chuDe: chuDe.trim() || undefined, loiNhac: m.id === 'tu-dat' ? loiNhac : undefined,
        lich, gio: (h ?? 8) * 60 + (pp ?? 0), thu: lich === 'tuan' ? thu : undefined,
      } });
      toast.success(c('Đã tạo tác vụ'));
      onXong(t);
    } catch (e) { toast.error(loiCua(e)); } finally { datDang(false); }
  };
  const thieu = (m.canChuDe && !chuDe.trim()) || (m.id === 'tu-dat' && !loiNhac.trim());
  return (
    <div className="ctd-hop-nen" onMouseDown={(e) => { if (e.target === e.currentTarget) onDong(); }}>
      <div className="ctd-hop" role="dialog" aria-modal="true">
        <div className="ctd-hop-dau"><b>{mau ? mau.ten : c('Thiết lập thủ công')}</b><span style={{ flex: 1 }} /><button type="button" className="ctd-icon" onClick={onDong} aria-label={c('Đóng')}><X size={17} /></button></div>
        <div className="ctd-form">
          {mau && <p className="ctd-ghi" style={{ margin: 0 }}>{mau.mota}</p>}
          <label><span>{c('Tên tác vụ')}</span><input value={ten} maxLength={120} onChange={(e) => datTen(e.target.value)} placeholder={mau ? mau.ten : c('Ví dụ: Ôn 10 từ tiếng Nhật mỗi sáng')} /></label>
          {m.canChuDe && <label><span>{c('Chủ đề')}</span><input autoFocus value={chuDe} maxLength={200} onChange={(e) => datChuDe(e.target.value)} placeholder={m.goiY} /></label>}
          {m.id === 'tu-dat' && <label><span>{c('CuongMini cần làm gì mỗi lần chạy?')}</span><textarea autoFocus rows={4} value={loiNhac} maxLength={2000} onChange={(e) => datLoiNhac(e.target.value)} placeholder={c('Ví dụ: Cho mình 10 từ vựng tiếng Nhật N3 kèm cách đọc và ví dụ')} /></label>}
          <div className="ctd-form-hang">
            <label><span>{c('Lặp lại')}</span><select className="ctd-chon" value={lich} onChange={(e) => datLich(e.target.value as 'ngay' | 'tuan')}><option value="ngay">{c('Hằng ngày')}</option><option value="tuan">{c('Hằng tuần')}</option></select></label>
            {lich === 'tuan' && <label><span>{c('Vào')}</span><select className="ctd-chon" value={thu} onChange={(e) => datThu(Number(e.target.value))}>{THU.map((t, i) => <option key={i} value={i}>{t}</option>)}</select></label>}
            <label><span>{c('Lúc (giờ VN)')}</span><input type="time" value={gio} onChange={(e) => datGio(e.target.value || '08:00')} /></label>
          </div>
          <p className="ctd-ghi" style={{ margin: 0 }}>{c('Kết quả ghi vào một cuộc trò chuyện riêng · dùng CuongMini 3.11, tính vào hạn mức chat của bạn.')}</p>
        </div>
        <div className="ctd-hop-chan">
          <button type="button" className="ctd-nut" onClick={onDong}>{c('Huỷ')}</button>
          <button type="button" className="ctd-nut" data-chinh disabled={thieu || dang} onClick={() => void tao()}>{dang && <Loader2 size={14} className="ctd-quay" />} {c('Tạo tác vụ')}</button>
        </div>
      </div>
    </div>
  );
}

export function TrangTacVu({ api, onMoPhien }: { api: ApiClient | null; onMoPhien: (id: string) => void }) {
  const { c } = useCtcChu();
  const [tab, datTab] = useState<'cua-ban' | 'mau'>('cua-ban');
  const [ds, datDs] = useState<TacVu[] | null>(null);
  const [q, datQ] = useState('');
  const [loc, datLoc] = useState<'tat-ca' | 'bat' | 'tat'>('tat-ca');
  const [sapXep, datSapXep] = useState<'sap-chay' | 'ten'>('sap-chay');
  const [menu, datMenu] = useState(false);
  const [hop, datHop] = useState<{ mau: MauTv | null } | null>(null);
  const [dangChay, datDangChay] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tai = useCallback(async () => {
    if (!api) { datDs([]); return; }
    try { const r = await api.request<TacVu[]>('/api/v1/ai/chat/tac-vu'); datDs(Array.isArray(r) ? r : []); } catch { datDs([]); }
  }, [api]);
  useEffect(() => { void tai(); }, [tai]);
  useEffect(() => {
    if (!menu) return;
    const f = (e: MouseEvent): void => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) datMenu(false); };
    document.addEventListener('mousedown', f);
    return () => document.removeEventListener('mousedown', f);
  }, [menu]);
  const list = useMemo(() => (ds ?? [])
    .filter((t) => !q.trim() || `${t.ten} ${t.chuDe ?? ''}`.toLowerCase().includes(q.trim().toLowerCase()))
    .filter((t) => loc === 'tat-ca' || (loc === 'bat') === t.bat)
    .sort((a, b) => (sapXep === 'ten' ? a.ten.localeCompare(b.ten, 'vi') : new Date(a.lanToi).getTime() - new Date(b.lanToi).getTime())), [ds, q, loc, sapXep]);
  const moTao = (mau: MauTv | null): void => { datMenu(false); datHop({ mau }); };
  const batTat = async (t: TacVu): Promise<void> => {
    if (!api) return;
    try { const m = await api.request<TacVu>(`/api/v1/ai/chat/tac-vu/${t.id}`, { method: 'PATCH', body: { bat: !t.bat } }); datDs((cu) => cu?.map((x) => (x.id === t.id ? m : x)) ?? cu); } catch (e) { toast.error(loiCua(e)); }
  };
  const xoa = async (t: TacVu): Promise<void> => {
    if (!api || !window.confirm(`${c('Xoá tác vụ')} "${t.ten}"?`)) return;
    try { await api.request(`/api/v1/ai/chat/tac-vu/${t.id}`, { method: 'DELETE' }); datDs((cu) => cu?.filter((x) => x.id !== t.id) ?? cu); } catch (e) { toast.error(loiCua(e)); }
  };
  const chay = async (t: TacVu): Promise<void> => {
    if (!api) return;
    datDangChay(t.id);
    try {
      const m = await api.request<TacVu>(`/api/v1/ai/chat/tac-vu/${t.id}/chay`, { method: 'POST', body: {} });
      datDs((cu) => cu?.map((x) => (x.id === t.id ? m : x)) ?? cu);
      toast.success(c('Đã chạy xong'), m.sessionId ? { action: { label: c('Xem kết quả'), onClick: () => onMoPhien(m.sessionId!) } } : undefined);
    } catch (e) { toast.error(loiCua(e)); void tai(); } finally { datDangChay(null); }
  };
  return (
    <div className="ctd-trang ctd-trang-rong">
      <div className="ctd-dau">
        <h1>{c('Tác vụ đã lên lịch')}</h1>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button type="button" className="ctd-nut" data-chinh onClick={() => datMenu((v) => !v)} aria-haspopup="menu" aria-expanded={menu}><Plus size={15} /> {c('Tác vụ mới')} <ChevronDown size={14} /></button>
          {menu && (
            <div className="ctd-menu" role="menu">
              <button type="button" className="ctd-menu-muc" onClick={() => moTao(null)}><PenLine size={15} /> {c('Thiết lập thủ công')}</button>
              <div className="ctd-menu-vach" />
              <div className="ctd-menu-nhan">{c('Từ mẫu')}</div>
              {MAU_TV.map((m) => (
                <button key={m.id} type="button" className="ctd-menu-muc" disabled={!!m.sapCo} onClick={() => moTao(m)}>
                  <m.icon size={15} /> {m.ten}{m.sapCo && <span className="ctd-sap">{c('Sắp có')}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="ctd-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'cua-ban'} data-on={tab === 'cua-ban'} onClick={() => datTab('cua-ban')}>{c('Của bạn')}{ds?.length ? ` (${ds.length})` : ''}</button>
        <button type="button" role="tab" aria-selected={tab === 'mau'} data-on={tab === 'mau'} onClick={() => datTab('mau')}>{c('Mẫu')}</button>
      </div>
      {tab === 'cua-ban' ? (
        <>
          {(ds?.length ?? 0) > 0 && (
            <div className="ctd-thanh">
              <label className="ctd-tim ctd-tim-nho"><Search size={15} /><input value={q} onChange={(e) => datQ(e.target.value)} placeholder={c('Tìm tác vụ…')} /></label>
              <select className="ctd-chon" value={loc} onChange={(e) => datLoc(e.target.value as typeof loc)}><option value="tat-ca">{c('Tất cả')}</option><option value="bat">{c('Đang bật')}</option><option value="tat">{c('Đã tắt')}</option></select>
              <select className="ctd-chon" value={sapXep} onChange={(e) => datSapXep(e.target.value as typeof sapXep)}><option value="sap-chay">{c('Sắp chạy')}</option><option value="ten">{c('Tên A–Z')}</option></select>
            </div>
          )}
          {ds === null ? <div className="ctd-trong"><Loader2 className="ctd-quay" /></div> : ds.length === 0 ? (
            <div className="ctd-trong">
              <DongHo />
              <h3>{c('Chưa có tác vụ nào')}</h3>
              <p>{c('Để CuongMini tự làm việc theo lịch: tóm tắt tin mỗi sáng, theo dõi một chủ đề, tổng kết tuần học. Kết quả nằm sẵn trong một cuộc trò chuyện.')}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button type="button" className="ctd-nut" data-chinh onClick={() => moTao(null)}><PenLine size={14} /> {c('Thiết lập thủ công')}</button>
                <button type="button" className="ctd-nut" onClick={() => datTab('mau')}>{c('Xem mẫu')}</button>
              </div>
            </div>
          ) : (
            <div className="ctd-tv-ds">
              {list.map((t) => {
                const m = MAU_TV.find((x) => x.id === t.mau);
                const Ic = m?.icon ?? CalendarClock;
                return (
                  <div key={t.id} className="ctd-tv" data-tat={!t.bat}>
                    <span className="ctd-ic" data-mau={m?.mau ?? 'slate'}><Ic size={18} /></span>
                    <div className="ctd-tv-chu">
                      <b>{t.ten}</b>
                      <small>{dongLich(t.lich, t.gio, t.thu)}{t.bat ? ` · ${c('lần tới')} ${new Date(t.lanToi).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}` : ` · ${c('đang tắt')}`}{t.lanCuoi ? ` · ${c('chạy')} ${tuongDoi(new Date(t.lanCuoi).getTime())}` : ''}</small>
                      {t.loiCuoi && <small className="ctd-loi">{c('Lần trước hỏng')}: {t.loiCuoi}</small>}
                    </div>
                    {t.sessionId && <button type="button" className="ctd-nut" onClick={() => onMoPhien(t.sessionId!)}><MessageSquare size={14} /> {c('Kết quả')}</button>}
                    <button type="button" className="ctd-icon" title={c('Chạy ngay')} aria-label={c('Chạy ngay')} disabled={dangChay === t.id} onClick={() => void chay(t)}>{dangChay === t.id ? <Loader2 size={16} className="ctd-quay" /> : <Play size={16} />}</button>
                    <Cong on={t.bat} onDoi={() => void batTat(t)} nhan={t.ten} />
                    <button type="button" className="ctd-icon" title={c('Xoá')} aria-label={c('Xoá')} onClick={() => void xoa(t)}><Trash2 size={16} /></button>
                  </div>
                );
              })}
              {list.length === 0 && <p className="ctd-ghi">{c('Không có tác vụ khớp.')}</p>}
            </div>
          )}
        </>
      ) : (
        <div className="ctd-luoi">
          {MAU_TV.map((m) => (
            <div key={m.id} className="ctd-the" data-sap={!!m.sapCo}>
              <div className="ctd-the-tren"><span className="ctd-ic" data-mau={m.mau}><m.icon size={20} /></span>{m.sapCo && <span className="ctd-sap">{c('Sắp có')}</span>}</div>
              <b>{m.ten}</b><p>{m.mota}</p>
              <div className="ctd-tv-lich"><CalendarClock size={13} /> {dongLich(m.lich, m.gio, m.thu)}</div>
              <div className="ctd-the-chan"><small>{m.sapCo ?? 'CuongThai'}</small><button type="button" className="ctd-nut" disabled={!!m.sapCo} onClick={() => moTao(m)}>{c('Dùng mẫu')}</button></div>
            </div>
          ))}
        </div>
      )}
      {hop && api && <HopTaoTacVu api={api} mau={hop.mau} onDong={() => datHop(null)} onXong={(t) => { datHop(null); datDs((cu) => [t, ...(cu ?? [])]); datTab('cua-ban'); }} />}
    </div>
  );
}

/* ═══ Hộp tìm kiếm ══════════════════════════════════════════════════════ */
export function HopTim({ ds, onDong, onMo, onMoi }: { ds: PhienChat[]; onDong: () => void; onMo: (id: string) => void; onMoi: () => void }) {
  const { c } = useCtcChu();
  const [q, datQ] = useState('');
  const [sel, datSel] = useState(0);
  const kq = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const s = [...ds].sort((a, b) => lucCua(b) - lucCua(a));
    return (kw ? s.filter((p) => (p.title ?? '').toLowerCase().includes(kw)) : s).slice(0, 30);
  }, [q, ds]);
  useEffect(() => { datSel(0); }, [q]);
  return (
    <div className="ctd-hop-nen ctd-hop-tren" onMouseDown={(e) => { if (e.target === e.currentTarget) onDong(); }}>
      <div className="ctd-hop ctd-hop-tim" role="dialog" aria-modal="true" aria-label={c('Tìm kiếm')}>
        <label className="ctd-tim-dau">
          <Search size={18} />
          <input autoFocus value={q} placeholder={c('Tìm kiếm cuộc trò chuyện…')} onChange={(e) => datQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Escape') onDong();
              if (e.key === 'ArrowDown') { e.preventDefault(); datSel((v) => Math.min(v + 1, kq.length)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); datSel((v) => Math.max(v - 1, 0)); }
              if (e.key === 'Enter') { e.preventDefault(); if (sel === 0) onMoi(); else { const r = kq[sel - 1]; if (r) onMo(r.id); } }
            }} />
          <button type="button" className="ctd-icon" aria-label={c('Đóng')} onClick={onDong}><X size={17} /></button>
        </label>
        <div className="ctd-tim-ds">
          <button type="button" className="ctd-tim-muc" data-on={sel === 0} onMouseEnter={() => datSel(0)} onClick={onMoi}><Plus size={16} /> <span>{c('Cuộc trò chuyện mới')}</span></button>
          {!q.trim() && kq.length > 0 && <div className="ctd-menu-nhan">{c('Gần đây')}</div>}
          {kq.map((p, i) => (
            <button key={p.id} type="button" className="ctd-tim-muc" data-on={sel === i + 1} onMouseEnter={() => datSel(i + 1)} onClick={() => onMo(p.id)}>
              <MessageSquare size={16} /><span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title?.trim() || c('Cuộc chưa đặt tên')}</span><small>{tuongDoi(lucCua(p))}</small>
            </button>
          ))}
          {q.trim() && kq.length === 0 && <p className="ctd-ghi" style={{ padding: 16, textAlign: 'center' }}>{c('Không khớp cuộc nào.')}</p>}
        </div>
      </div>
    </div>
  );
}

