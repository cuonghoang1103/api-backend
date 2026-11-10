'use client';

/**
 * Thanh bên kiểu claude.ai (bản 11/11/2026):
 *   logo CuongMini · Tạo mới · Tìm kiếm · Dự án · Artifacts · Tác vụ đã lên lịch · Tùy chỉnh
 *   · "Đã ghim" · "Gần đây" (+ "Xem tất cả") · hàng tài khoản ở đáy.
 * Mỗi dòng hội thoại có menu: ghim, đổi tên, chuyển vào dự án, xoá. "Dự án" = thư mục chat của máy chủ.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock, Check, ChevronDown, ChevronsUpDown, Code2, Folder, FolderKanban, LayoutGrid, LogIn, MessageSquare,
  MonitorDown, MoreHorizontal, PanelLeftClose, Pencil, Pin, PinOff, Plus, Search, SlidersHorizontal, Trash2,
} from 'lucide-react';
import type { ChatFolder, ChatSession } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { CuongMiniPanda, CuongMiniWordmark } from './CuongMiniPanda';

export type SessionRow = ChatSession & { pinned?: boolean };
export type CtcView = 'chat' | 'code' | 'recents' | 'projects' | 'artifacts' | 'scheduled' | 'customize' | `project:${string}`;

interface Props {
  open: boolean;
  /** Chat thường hay CuongMini Code — đổi danh mục điều hướng + danh sách phiên gần đây. */
  mode: 'chat' | 'code';
  onMode: (m: 'chat' | 'code') => void;
  /** Mã phiên ⇒ phiên Code (có kho hay không). */
  codeSessions: Record<string, { coKho: boolean }>;
  view: CtcView;
  sessions: SessionRow[];
  currentId: string | null;
  folders: ChatFolder[];
  onMoveToFolder: (sessionId: string, folderId: string | null) => void;
  onClose: () => void;
  onNew: () => void;
  onSearch: () => void;
  onView: (v: CtcView) => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string, pinned: boolean) => void;
  /** Cuộc chỉ có ở máy (khách / chưa gửi) — không ghim/chuyển dự án được. */
  chiOMay: (id: string) => boolean;
  user?: { name: string; avatarUrl?: string; isPro: boolean } | null;
}

const SO_GAN_DAY = 30;
const thoiGian = (s: ChatSession) => new Date(s.updatedAt ?? s.createdAt).getTime();

const NAV: Array<{ v: CtcView; label: string; icon: typeof Search }> = [
  { v: 'projects', label: 'Dự án', icon: FolderKanban },
  { v: 'artifacts', label: 'Artifacts', icon: LayoutGrid },
  { v: 'scheduled', label: 'Tác vụ đã lên lịch', icon: CalendarClock },
  { v: 'customize', label: 'Tùy chỉnh', icon: SlidersHorizontal },
];

export function CtcSidebar(p: Props) {
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [moveFor, setMoveFor] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuFor) return;
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) { setMenuFor(null); setMoveFor(null); } };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuFor(null); setMoveFor(null); } };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [menuFor]);

  const [locCode, setLocCode] = useState<'tat-ca' | 'co-kho' | 'khong-kho'>('tat-ca');
  const [khacMo, setKhacMo] = useState(false);
  const { ghim, ganDay, soCode } = useMemo(() => {
    const sorted = [...p.sessions].sort((a, b) => thoiGian(b) - thoiGian(a));
    if (p.mode === 'code') {
      const code = sorted.filter((s) => p.codeSessions[s.sessionId]);
      const loc = code.filter((s) => locCode === 'tat-ca' || (locCode === 'co-kho') === p.codeSessions[s.sessionId].coKho);
      return { ghim: [] as SessionRow[], ganDay: loc.slice(0, SO_GAN_DAY), soCode: code.length };
    }
    return { ghim: sorted.filter((s) => s.pinned), ganDay: sorted.filter((s) => !s.pinned).slice(0, SO_GAN_DAY), soCode: 0 };
  }, [p.sessions, p.mode, p.codeSessions, locCode]);

  const commitRename = useCallback((id: string) => {
    const t = editVal.trim();
    setEditing(null);
    if (t) p.onRename(id, t);
  }, [editVal, p]);

  const dong = (s: SessionRow) => {
    const on = p.view === 'chat' && s.sessionId === p.currentId;
    if (editing === s.sessionId) {
      return (
        <div key={s.sessionId} className="ctc-row" data-on={on}>
          <input
            autoFocus
            className="ctc-row-edit"
            value={editVal}
            maxLength={255}
            onChange={(e) => setEditVal(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') commitRename(s.sessionId);
              if (e.key === 'Escape') setEditing(null);
            }}
            onBlur={() => commitRename(s.sessionId)}
            aria-label="Tên mới"
          />
        </div>
      );
    }
    return (
      <div key={s.sessionId} className="ctc-row" data-on={on} data-menu={menuFor === s.sessionId}>
        <button
          type="button"
          className="ctc-row-btn"
          onClick={() => p.onSelect(s.sessionId)}
          onDoubleClick={() => { setEditVal(s.title || ''); setEditing(s.sessionId); }}
          title={`${s.title || 'Cuộc trò chuyện mới'} — bấm đúp để đổi tên`}
        >
          <span>{s.title || 'Cuộc trò chuyện mới'}</span>
        </button>
        <button
          type="button"
          className="ctc-icon-btn ctc-row-more"
          data-sm
          aria-label="Tuỳ chọn"
          onClick={() => { setMenuFor((c) => (c === s.sessionId ? null : s.sessionId)); setMoveFor(null); }}
        >
          <MoreHorizontal size={16} />
        </button>
        {menuFor === s.sessionId && (
          <div ref={menuRef} className="ctc-menu" style={{ right: 0, top: 'calc(100% + 2px)' }} role="menu">
            {moveFor === s.sessionId ? (
              <>
                <div className="ctc-menu-label">Chuyển vào dự án</div>
                <button type="button" className="ctc-menu-item" onClick={() => { setMenuFor(null); setMoveFor(null); p.onMoveToFolder(s.sessionId, null); }}>
                  Không thuộc dự án {!s.folderId && <Check size={14} style={{ marginLeft: 'auto' }} />}
                </button>
                {p.folders.map((f) => (
                  <button key={f.id} type="button" className="ctc-menu-item" onClick={() => { setMenuFor(null); setMoveFor(null); p.onMoveToFolder(s.sessionId, f.id); }}>
                    <Folder size={14} style={f.mau ? { color: f.mau } : undefined} /> {f.ten}
                    {s.folderId === f.id && <Check size={14} style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
                {p.folders.length === 0 && <div className="ctc-menu-label">Chưa có dự án nào</div>}
              </>
            ) : (
              <>
                <button type="button" className="ctc-menu-item" disabled={p.chiOMay(s.sessionId)} onClick={() => { setMenuFor(null); p.onPin(s.sessionId, !s.pinned); }}>
                  {s.pinned ? <PinOff size={15} /> : <Pin size={15} />} {s.pinned ? 'Bỏ ghim' : 'Ghim'}
                </button>
                <button type="button" className="ctc-menu-item" onClick={() => { setMenuFor(null); setEditVal(s.title || ''); setEditing(s.sessionId); }}>
                  <Pencil size={15} /> Đổi tên
                </button>
                <button type="button" className="ctc-menu-item" disabled={p.chiOMay(s.sessionId)} onClick={() => setMoveFor(s.sessionId)}>
                  <FolderKanban size={15} /> Chuyển vào dự án
                </button>
                <div className="ctc-menu-sep" />
                <button
                  type="button"
                  className="ctc-menu-item"
                  data-danger
                  onClick={() => {
                    setMenuFor(null);
                    if (window.confirm(`Xoá "${s.title || 'cuộc trò chuyện này'}"? Không khôi phục được.`)) p.onDelete(s.sessionId);
                  }}
                >
                  <Trash2 size={15} /> Xoá
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="ctc-side" data-open={p.open} aria-label="Thanh bên CuongMini" aria-hidden={!p.open}>
      <div className="ctc-side-inner">
        <div className="ctc-side-head">
          <button type="button" className="ctc-brand" onClick={p.onNew} title="Cuộc trò chuyện mới">
            <CuongMiniPanda size={30} />
            <CuongMiniWordmark size={20} />
          </button>
          <button type="button" className="ctc-icon-btn" onClick={p.onClose} aria-label="Đóng thanh bên" title="Đóng thanh bên">
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div className="ctc-mode" role="tablist" aria-label="Chế độ">
          <button type="button" role="tab" aria-selected={p.mode === 'chat'} data-on={p.mode === 'chat'} onClick={() => p.onMode('chat')}><MessageSquare size={14} /> Chat</button>
          <button type="button" role="tab" aria-selected={p.mode === 'code'} data-on={p.mode === 'code'} onClick={() => p.onMode('code')} data-testid="ctc-mode-code"><Code2 size={14} /> Code</button>
        </div>

        {p.mode === 'code' ? (
        <nav className="ctc-nav" aria-label="Điều hướng CuongMini Code">
          <button type="button" className="ctc-nav-item ctc-nav-new" onClick={() => p.onView('code')}>
            <span className="ctc-new-dot"><Plus size={15} strokeWidth={2.6} /></span>
            <span>Tạo mới</span>
          </button>
          <button type="button" className="ctc-nav-item" onClick={p.onSearch}>
            <span className="ctc-nav-ic"><Search size={17} /></span><span>Tìm kiếm</span>
          </button>
          <button type="button" className="ctc-nav-item" data-on={p.view === 'artifacts'} onClick={() => p.onView('artifacts')}>
            <span className="ctc-nav-ic"><LayoutGrid size={17} /></span><span>Artifacts</span>
          </button>
          <button type="button" className="ctc-nav-item" data-on={p.view === 'customize'} onClick={() => p.onView('customize')}>
            <span className="ctc-nav-ic"><SlidersHorizontal size={17} /></span><span>Tùy chỉnh</span>
          </button>
          <button type="button" className="ctc-nav-item" onClick={() => setKhacMo((v) => !v)} aria-expanded={khacMo}>
            <span className="ctc-nav-ic"><MoreHorizontal size={17} /></span><span>Khác</span>
            <ChevronDown size={14} style={{ marginLeft: 'auto', transform: khacMo ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }} />
          </button>
          {khacMo && (
            <div className="ctc-nav-sub">
              <button type="button" className="ctc-nav-item" onClick={() => p.onView('projects')}><span className="ctc-nav-ic"><FolderKanban size={16} /></span><span>Dự án</span></button>
              <button type="button" className="ctc-nav-item" onClick={() => p.onView('scheduled')}><span className="ctc-nav-ic"><CalendarClock size={16} /></span><span>Tác vụ đã lên lịch</span></button>
              <a className="ctc-nav-item" href="/download"><span className="ctc-nav-ic"><MonitorDown size={16} /></span><span>Tải app Desktop</span></a>
            </div>
          )}
        </nav>
        ) : (
        <nav className="ctc-nav" aria-label="Điều hướng CuongMini">
          <button type="button" className="ctc-nav-item ctc-nav-new" onClick={p.onNew} data-testid="ctc-new">
            <span className="ctc-new-dot"><Plus size={15} strokeWidth={2.6} /></span>
            <span>Tạo mới</span>
          </button>
          <button type="button" className="ctc-nav-item" onClick={p.onSearch} data-testid="ctc-search-open">
            <span className="ctc-nav-ic"><Search size={17} /></span>
            <span>Tìm kiếm</span>
          </button>
          {NAV.map(({ v, label, icon: Icon }) => (
            <button
              key={v}
              type="button"
              className="ctc-nav-item"
              data-on={p.view === v || (v === 'projects' && p.view.startsWith('project:'))}
              onClick={() => p.onView(v)}
            >
              <span className="ctc-nav-ic"><Icon size={17} /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        )}

        <div className="ctc-side-scroll">
          {ghim.length > 0 && (
            <>
              <div className="ctc-group-label">Đã ghim</div>
              {ghim.map(dong)}
            </>
          )}
          <div className="ctc-group-label ctc-group-row">
            <span>{p.mode === 'code' ? 'Phiên gần đây' : 'Gần đây'}</span>
            {p.mode === 'code' ? (
              soCode > 0 && (
                <select className="ctc-mini-select" value={locCode} onChange={(e) => setLocCode(e.target.value as typeof locCode)} aria-label="Lọc phiên Code">
                  <option value="tat-ca">Tất cả</option>
                  <option value="co-kho">Có repo</option>
                  <option value="khong-kho">Không repo</option>
                </select>
              )
            ) : p.sessions.length > 0 && (
              <button type="button" className="ctc-link" onClick={() => p.onView('recents')}>Xem tất cả</button>
            )}
          </div>
          {ganDay.map(dong)}
          {p.mode === 'code'
            ? ganDay.length === 0 && <div className="ctc-empty-side">{soCode ? 'Không có phiên khớp bộ lọc' : 'Chưa có phiên Code nào'}</div>
            : p.sessions.length === 0 && <div className="ctc-empty-side">Chưa có cuộc trò chuyện nào</div>}
        </div>

        <div className="ctc-side-foot">
          {p.user ? (
            <Link href="/profile" className="ctc-user">
              <span className="ctc-user-av">
                {p.user.avatarUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={getImageUrl(p.user.avatarUrl)} alt="" />
                  : p.user.name.slice(0, 1).toUpperCase()}
              </span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <div className="ctc-user-name">{p.user.name}</div>
                <div className="ctc-user-plan">{p.user.isPro ? 'Gói Pro' : 'Gói miễn phí'}</div>
              </span>
              <ChevronsUpDown size={15} className="ctc-user-chev" />
            </Link>
          ) : (
            <Link href="/login" className="ctc-user">
              <span className="ctc-user-av"><LogIn size={14} /></span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <div className="ctc-user-name">Đăng nhập</div>
                <div className="ctc-user-plan">Lưu lịch sử · dùng model Pro</div>
              </span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
