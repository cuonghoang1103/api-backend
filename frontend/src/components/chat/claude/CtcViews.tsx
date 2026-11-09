'use client';

/**
 * Các màn của thanh bên /chat (11/11/2026) — hiện ở cột chính thay cho hội thoại:
 *   Tất cả cuộc trò chuyện · Dự án (= thư mục chat của máy chủ) · một Dự án · Artifacts · Tác vụ đã lên lịch ·
 *   Tùy chỉnh · và hộp Tìm kiếm nổi.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, CalendarClock, Check, Code2, Copy, FolderKanban, FolderPlus, MessageSquare, Plus, Search,
  Trash2, Workflow, X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ChatFolder, ChatMessage } from '@/types';
import ChatMarkdown from '../ChatMarkdown';
import { CuongMiniPanda } from './CuongMiniPanda';
import { CtcModelPicker } from './CtcComposer';
import { useCtcPrefs } from './ctcPrefs';
import type { SessionRow } from './CtcSidebar';

const thoiGian = (s: SessionRow) => new Date(s.updatedAt ?? s.createdAt).getTime();

export function tuongDoi(ms: number): string {
  const d = Date.now() - ms;
  const m = Math.round(d / 60_000);
  if (m < 1) return 'vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const n = Math.round(h / 24);
  if (n < 30) return `${n} ngày trước`;
  return new Date(ms).toLocaleDateString('vi-VN');
}

function Trong({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="ctc-empty-big">
      <CuongMiniPanda size={84} />
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function DongPhien({ s, onOpen }: { s: SessionRow; onOpen: () => void }) {
  return (
    <button type="button" className="ctc-list-row" onClick={onOpen}>
      <span className="ctc-list-title">{s.title || 'Cuộc trò chuyện mới'}</span>
      <span className="ctc-list-meta">Tin nhắn cuối {tuongDoi(thoiGian(s))}</span>
    </button>
  );
}

/* ═══ Tất cả cuộc trò chuyện ═══════════════════════════════════════════════ */
export function RecentsView({ sessions, onOpen, onNew }: { sessions: SessionRow[]; onOpen: (id: string) => void; onNew: () => void }) {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return [...sessions].filter((s) => !kw || (s.title || '').toLowerCase().includes(kw)).sort((a, b) => thoiGian(b) - thoiGian(a));
  }, [sessions, q]);
  return (
    <div className="ctc-page">
      <div className="ctc-page-head">
        <h1>Lịch sử trò chuyện</h1>
        <button type="button" className="ctc-btn" data-primary onClick={onNew}><Plus size={15} /> Cuộc trò chuyện mới</button>
      </div>
      <label className="ctc-page-search">
        <Search size={16} />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm cuộc trò chuyện…" />
      </label>
      <p className="ctc-page-note">Bạn có {sessions.length} cuộc trò chuyện với CuongMini</p>
      <div className="ctc-list">
        {list.map((s) => <DongPhien key={s.sessionId} s={s} onOpen={() => onOpen(s.sessionId)} />)}
        {list.length === 0 && <Trong title={q ? 'Không tìm thấy cuộc nào' : 'Chưa có cuộc trò chuyện nào'} />}
      </div>
    </div>
  );
}

/* ═══ Dự án ═════════════════════════════════════════════════════════════════ */
export function ProjectsView({
  folders, signedIn, onOpen, onCreate,
}: { folders: ChatFolder[]; signedIn: boolean; onOpen: (id: string) => void; onCreate: (ten: string) => void }) {
  const [q, setQ] = useState('');
  const [taoMoi, setTaoMoi] = useState<string | null>(null);
  const list = folders.filter((f) => !q.trim() || f.ten.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="ctc-page">
      <div className="ctc-page-head">
        <h1>Dự án</h1>
        {signedIn && <button type="button" className="ctc-btn" data-primary onClick={() => setTaoMoi('')}><Plus size={15} /> Dự án mới</button>}
      </div>
      {!signedIn ? (
        <Trong title="Đăng nhập để dùng Dự án">
          <p>Dự án gom các cuộc trò chuyện cùng một việc (một môn học, một đồ án…) để dễ tìm lại.</p>
        </Trong>
      ) : (
        <>
          {taoMoi !== null && (
            <div className="ctc-new-project">
              <input
                autoFocus
                value={taoMoi}
                maxLength={80}
                placeholder="Tên dự án, ví dụ: Đồ án SWP391"
                onChange={(e) => setTaoMoi(e.target.value)}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === 'Enter' && taoMoi.trim()) { onCreate(taoMoi.trim()); setTaoMoi(null); }
                  if (e.key === 'Escape') setTaoMoi(null);
                }}
              />
              <button type="button" className="ctc-btn" data-primary disabled={!taoMoi.trim()} onClick={() => { onCreate(taoMoi.trim()); setTaoMoi(null); }}>Tạo</button>
              <button type="button" className="ctc-btn" onClick={() => setTaoMoi(null)}>Huỷ</button>
            </div>
          )}
          {folders.length > 0 && (
            <label className="ctc-page-search">
              <Search size={16} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm dự án…" />
            </label>
          )}
          <div className="ctc-cards">
            {list.map((f) => (
              <button key={f.id} type="button" className="ctc-card" onClick={() => onOpen(f.id)}>
                <span className="ctc-card-ic" style={f.mau ? { color: f.mau } : undefined}><FolderKanban size={18} /></span>
                <b>{f.ten}</b>
                <small>{f._count?.sessions ?? 0} cuộc trò chuyện</small>
              </button>
            ))}
          </div>
          {folders.length === 0 && taoMoi === null && (
            <Trong title="Chưa có dự án nào">
              <p>Tạo một dự án để gom các cuộc trò chuyện cùng chủ đề.</p>
              <button type="button" className="ctc-btn" data-primary onClick={() => setTaoMoi('')}><FolderPlus size={15} /> Tạo dự án</button>
            </Trong>
          )}
        </>
      )}
    </div>
  );
}

export function ProjectView({
  folder, sessions, onBack, onOpen, onStart, onDelete,
}: {
  folder: ChatFolder | undefined;
  sessions: SessionRow[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onStart: () => void;
  onDelete: () => void;
}) {
  if (!folder) return <div className="ctc-page"><Trong title="Không tìm thấy dự án" /></div>;
  const list = sessions.filter((s) => s.folderId === folder.id).sort((a, b) => thoiGian(b) - thoiGian(a));
  return (
    <div className="ctc-page">
      <button type="button" className="ctc-back" onClick={onBack}><ArrowLeft size={15} /> Tất cả dự án</button>
      <div className="ctc-page-head">
        <h1><FolderKanban size={26} style={{ color: folder.mau || 'var(--ctc-accent)', flexShrink: 0 }} /><span>{folder.ten}</span></h1>
        <button
          type="button"
          className="ctc-icon-btn"
          title="Xoá dự án"
          aria-label="Xoá dự án"
          onClick={() => { if (window.confirm(`Xoá dự án "${folder.ten}"? Các cuộc trò chuyện bên trong vẫn còn.`)) onDelete(); }}
        >
          <Trash2 size={17} />
        </button>
      </div>
      <button type="button" className="ctc-start-in-project" onClick={onStart}>
        <Plus size={16} /> Bắt đầu cuộc trò chuyện mới trong dự án này
      </button>
      <div className="ctc-list">
        {list.map((s) => <DongPhien key={s.sessionId} s={s} onOpen={() => onOpen(s.sessionId)} />)}
        {list.length === 0 && <p className="ctc-page-note">Dự án này chưa có cuộc trò chuyện nào.</p>}
      </div>
    </div>
  );
}

/* ═══ Artifacts ═════════════════════════════════════════════════════════════
   Khối code / sơ đồ CuongMini đã viết trong các cuộc trò chuyện đang có ở máy này (đọc từ kho tin nhắn của trang). */
interface Artifact { key: string; lang: string; code: string; sessionId: string; title: string; at: number }

const RE_KHOI = /```([\w+#.-]*)[^\n]*\n([\s\S]*?)```/g;

export function trichArtifacts(messages: Record<string, ChatMessage[]>, sessions: SessionRow[]): Artifact[] {
  const ten = new Map(sessions.map((s) => [s.sessionId, s.title || 'Cuộc trò chuyện']));
  const out: Artifact[] = [];
  for (const [sid, msgs] of Object.entries(messages)) {
    msgs.forEach((m, i) => {
      if (m.role !== 'assistant' || !m.content) return;
      let k = 0;
      for (const r of m.content.matchAll(RE_KHOI)) {
        const code = r[2].replace(/\s+$/, '');
        const lang = (r[1] || 'text').toLowerCase();
        const laHinh = lang === 'svg' || lang === 'mermaid';
        if (!laHinh && code.split('\n').length < 4) continue; // vài dòng lệnh lẻ không phải "artifact"
        out.push({ key: `${sid}:${i}:${k++}`, lang, code, sessionId: sid, title: ten.get(sid) ?? 'Cuộc trò chuyện', at: new Date(m.createdAt).getTime() });
      }
    });
  }
  return out.sort((a, b) => b.at - a.at);
}

export function ArtifactsView({
  messages, sessions, onOpenChat,
}: { messages: Record<string, ChatMessage[]>; sessions: SessionRow[]; onOpenChat: (id: string) => void }) {
  const all = useMemo(() => trichArtifacts(messages, sessions), [messages, sessions]);
  const [q, setQ] = useState('');
  const [mo, setMo] = useState<Artifact | null>(null);
  const list = all.filter((a) => !q.trim() || `${a.title} ${a.lang} ${a.code}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="ctc-page ctc-page-wide">
      <div className="ctc-page-head"><h1>Artifacts</h1></div>
      <p className="ctc-page-note">Code và sơ đồ CuongMini đã viết cho bạn trong các cuộc trò chuyện đã mở trên máy này.</p>
      {all.length > 0 && (
        <label className="ctc-page-search">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên, ngôn ngữ, nội dung…" />
        </label>
      )}
      <div className="ctc-cards ctc-art-grid">
        {list.map((a) => (
          <button key={a.key} type="button" className="ctc-art" onClick={() => setMo(a)}>
            <pre className="ctc-art-pre">{a.code.split('\n').slice(0, 9).join('\n')}</pre>
            <span className="ctc-art-foot">
              <span className="ctc-art-lang">{a.lang === 'svg' || a.lang === 'mermaid' ? <Workflow size={12} /> : <Code2 size={12} />} {a.lang}</span>
              <b>{a.title}</b>
              <small>{tuongDoi(a.at)}</small>
            </span>
          </button>
        ))}
      </div>
      {all.length === 0 && (
        <Trong title="Chưa có artifact nào">
          <p>Nhờ CuongMini viết code, dựng sơ đồ hay một đoạn SQL — chúng sẽ được gom về đây.</p>
        </Trong>
      )}
      {mo && <ArtifactDialog a={mo} onClose={() => setMo(null)} onOpenChat={() => { setMo(null); onOpenChat(mo.sessionId); }} />}
    </div>
  );
}

function ArtifactDialog({ a, onClose, onOpenChat }: { a: Artifact; onClose: () => void; onOpenChat: () => void }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);
  return (
    <div className="ctc-modal-wrap" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ctc-modal ctc-modal-lg" role="dialog" aria-modal="true" aria-label={a.title}>
        <div className="ctc-modal-head">
          <b>{a.title}</b>
          <span className="ctc-art-lang">{a.lang}</span>
          <span style={{ flex: 1 }} />
          <button type="button" className="ctc-btn" onClick={async () => {
            try { await navigator.clipboard.writeText(a.code); setOk(true); setTimeout(() => setOk(false), 1600); } catch { toast.error('Không chép được'); }
          }}>{ok ? <Check size={14} /> : <Copy size={14} />} {ok ? 'Đã chép' : 'Chép'}</button>
          <button type="button" className="ctc-btn" onClick={onOpenChat}><MessageSquare size={14} /> Mở cuộc trò chuyện</button>
          <button type="button" className="ctc-icon-btn" aria-label="Đóng" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="ctc-modal-body ctc-prose">
          <ChatMarkdown content={'```' + a.lang + '\n' + a.code + '\n```'} />
        </div>
      </div>
    </div>
  );
}

/* ═══ Tác vụ đã lên lịch ═══════════════════════════════════════════════════ */
export function ScheduledView({ onNew }: { onNew: () => void }) {
  return (
    <div className="ctc-page">
      <div className="ctc-page-head"><h1>Tác vụ đã lên lịch</h1></div>
      <Trong title="Chưa có tác vụ nào">
        <p>Sắp tới CuongMini sẽ tự chạy việc theo lịch — ví dụ tóm tắt tin công nghệ mỗi sáng hay nhắc ôn bài trước giờ thi. Tính năng đang được làm.</p>
        <button type="button" className="ctc-btn" onClick={onNew}><CalendarClock size={15} /> Trò chuyện với CuongMini</button>
      </Trong>
    </div>
  );
}

/* ═══ Tùy chỉnh ═════════════════════════════════════════════════════════════ */
function Cong({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="ctc-switch" data-on={on} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

export function CustomizeView({ isPro }: { isPro: boolean }) {
  const p = useCtcPrefs();
  const [ten, setTen] = useState(p.tenGoi);
  const hen = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <div className="ctc-page">
      <div className="ctc-page-head"><h1>Tùy chỉnh</h1></div>
      <p className="ctc-page-note">Thiết đặt lưu trên trình duyệt này và áp cho mọi cuộc trò chuyện mới.</p>

      <section className="ctc-set">
        <div className="ctc-set-row">
          <div><b>CuongMini nên gọi bạn là gì?</b><small>Dùng trong lời chào trên màn hình.</small></div>
          <input
            className="ctc-set-input"
            value={ten}
            maxLength={40}
            placeholder="Để trống = tên tài khoản"
            onChange={(e) => {
              setTen(e.target.value);
              clearTimeout(hen.current);
              const v = e.target.value.trim();
              hen.current = setTimeout(() => p.set({ tenGoi: v }), 300);
            }}
          />
        </div>
        <div className="ctc-set-row">
          <div><b>Ngôn ngữ trả lời</b><small>Tự động = trả lời theo ngôn ngữ bạn hỏi.</small></div>
          <div className="ctc-seg" role="radiogroup" aria-label="Ngôn ngữ trả lời">
            {([['auto', 'Tự động'], ['vi', 'Tiếng Việt'], ['en', 'English']] as const).map(([v, l]) => (
              <button key={v} type="button" role="radio" aria-checked={p.ngonNgu === v} data-on={p.ngonNgu === v} onClick={() => p.set({ ngonNgu: v })}>{l}</button>
            ))}
          </div>
        </div>
        <div className="ctc-set-row">
          <div><b>Tìm trên web</b><small>Cho phép CuongMini tìm tin mới khi câu hỏi cần (kèm thẻ nguồn).</small></div>
          <Cong on={p.timWeb} onChange={(v) => p.set({ timWeb: v })} label="Tìm trên web" />
        </div>
        <div className="ctc-set-row">
          <div><b>Kỹ năng tự nhận</b><small>Tự bật cách trả lời hợp việc: code, toán, ảnh, tiếng Anh, tiếng Nhật…</small></div>
          <Cong on={p.kyNangTuDong} onChange={(v) => p.set({ kyNangTuDong: v })} label="Kỹ năng tự nhận" />
        </div>
        <div className="ctc-set-row">
          <div><b>Model mặc định</b><small>{isPro ? 'Đổi được bất cứ lúc nào ngay dưới ô soạn.' : 'Pro, Pro 2 và Max dành cho tài khoản Pro.'}</small></div>
          <div className="ctc-set-model"><CtcModelPicker isPro={isPro} placement="down" /></div>
        </div>
      </section>
    </div>
  );
}

/* ═══ Hộp tìm kiếm nổi ═════════════════════════════════════════════════════ */
export function SearchDialog({
  sessions, messages, onClose, onOpen, onNew,
}: {
  sessions: SessionRow[];
  messages: Record<string, ChatMessage[]>;
  onClose: () => void;
  onOpen: (id: string) => void;
  onNew: () => void;
}) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const kq = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const sorted = [...sessions].sort((a, b) => thoiGian(b) - thoiGian(a));
    if (!kw) return sorted.slice(0, 12).map((s) => ({ s, trich: '' }));
    const out: Array<{ s: SessionRow; trich: string }> = [];
    for (const s of sorted) {
      if ((s.title || '').toLowerCase().includes(kw)) { out.push({ s, trich: '' }); continue; }
      const m = (messages[s.sessionId] || []).find((x) => x.content?.toLowerCase().includes(kw));
      if (m) {
        const i = m.content.toLowerCase().indexOf(kw);
        out.push({ s, trich: (i > 30 ? '…' : '') + m.content.slice(Math.max(0, i - 30), i + 70).replace(/\s+/g, ' ') });
      }
      if (out.length >= 30) break;
    }
    return out;
  }, [q, sessions, messages]);
  useEffect(() => { setSel(0); }, [q]);

  return (
    <div className="ctc-modal-wrap" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ctc-modal ctc-search-modal" role="dialog" aria-modal="true" aria-label="Tìm kiếm cuộc trò chuyện">
        <label className="ctc-search-head">
          <Search size={18} />
          <input
            autoFocus
            value={q}
            placeholder="Tìm kiếm cuộc trò chuyện…"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Escape') onClose();
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((v) => Math.min(v + 1, kq.length)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((v) => Math.max(v - 1, 0)); }
              if (e.key === 'Enter') {
                e.preventDefault();
                if (sel === 0) onNew(); else { const r = kq[sel - 1]; if (r) onOpen(r.s.sessionId); }
              }
            }}
          />
          <button type="button" className="ctc-icon-btn" aria-label="Đóng" onClick={onClose}><X size={17} /></button>
        </label>
        <div className="ctc-search-list">
          <button type="button" className="ctc-search-item" data-on={sel === 0} onMouseEnter={() => setSel(0)} onClick={onNew}>
            <Plus size={16} /> <span>Cuộc trò chuyện mới</span>
          </button>
          {!q.trim() && kq.length > 0 && <div className="ctc-menu-label">Gần đây</div>}
          {kq.map(({ s, trich }, i) => (
            <button
              key={s.sessionId}
              type="button"
              className="ctc-search-item"
              data-on={sel === i + 1}
              onMouseEnter={() => setSel(i + 1)}
              onClick={() => onOpen(s.sessionId)}
            >
              <MessageSquare size={16} />
              <span style={{ minWidth: 0, flex: 1 }}>
                <span className="ctc-search-title">{s.title || 'Cuộc trò chuyện mới'}</span>
                {trich && <span className="ctc-search-snip">{trich}</span>}
              </span>
              <small>{tuongDoi(thoiGian(s))}</small>
            </button>
          ))}
          {q.trim() && kq.length === 0 && <div className="ctc-empty-side">Không tìm thấy “{q.trim()}”</div>}
        </div>
      </div>
    </div>
  );
}

