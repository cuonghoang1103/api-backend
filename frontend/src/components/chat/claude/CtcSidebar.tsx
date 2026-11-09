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
  CalendarClock, Check, ChevronsUpDown, Folder, FolderKanban, LayoutGrid, LogIn, MoreHorizontal, PanelLeftClose,
  Pencil, Pin, PinOff, Plus, Search, SlidersHorizontal, Trash2,
} from 'lucide-react';
import type { ChatFolder, ChatSession } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { CuongMiniPanda, CuongMiniWordmark } from './CuongMiniPanda';

export type SessionRow = ChatSession & { pinned?: boolean };
export type CtcView = 'chat' | 'recents' | 'projects' | 'artifacts' | 'scheduled' | 'customize' | `project:${string}`;

interface Props {
  open: boolean;
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

  const { ghim, ganDay } = useMemo(() => {
    const sorted = [...p.sessions].sort((a, b) => thoiGian(b) - thoiGian(a));
    return { ghim: sorted.filter((s) => s.pinned), ganDay: sorted.filter((s) => !s.pinned).slice(0, SO_GAN_DAY) };
  }, [p.sessions]);

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
        <button type="button" className="ctc-row-btn" onClick={() => p.onSelect(s.sessionId)} title={s.title || 'Cuộc trò chuyện mới'}>
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
                <button type="button" className="ctc-menu-item" disabled={s.sessionId.startsWith('local_')} onClick={() => { setMenuFor(null); p.onPin(s.sessionId, !s.pinned); }}>
                  {s.pinned ? <PinOff size={15} /> : <Pin size={15} />} {s.pinned ? 'Bỏ ghim' : 'Ghim'}
                </button>
                <button type="button" className="ctc-menu-item" onClick={() => { setMenuFor(null); setEditVal(s.title || ''); setEditing(s.sessionId); }}>
                  <Pencil size={15} /> Đổi tên
                </button>
                <button type="button" className="ctc-menu-item" disabled={s.sessionId.startsWith('local_')} onClick={() => setMoveFor(s.sessionId)}>
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

        <div className="ctc-side-scroll">
          {ghim.length > 0 && (
            <>
              <div className="ctc-group-label">Đã ghim</div>
              {ghim.map(dong)}
            </>
          )}
          <div className="ctc-group-label ctc-group-row">
            <span>Gần đây</span>
            {p.sessions.length > 0 && (
              <button type="button" className="ctc-link" onClick={() => p.onView('recents')}>Xem tất cả</button>
            )}
          </div>
          {ganDay.map(dong)}
          {p.sessions.length === 0 && <div className="ctc-empty-side">Chưa có cuộc trò chuyện nào</div>}
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
