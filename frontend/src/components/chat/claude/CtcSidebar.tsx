'use client';

/**
 * Thanh bên kiểu Claude: Cuộc trò chuyện mới · tìm · danh sách nhóm theo ngày
 * (Ghim / Hôm nay / Hôm qua / 7 ngày / 30 ngày / Cũ hơn) · menu từng dòng
 * (đổi tên, ghim, chuyển thư mục, xoá) · thư mục lọc dạng chip · tài khoản ở đáy.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Check, Folder, FolderPlus, MoreHorizontal, PanelLeftClose, Pencil, Pin, PinOff, Plus, Search, Trash2,
} from 'lucide-react';
import type { ChatFolder, ChatSession } from '@/types';
import { getImageUrl } from '@/lib/utils';

export type SessionRow = ChatSession & { pinned?: boolean };

interface Props {
  open: boolean;
  sessions: SessionRow[];
  currentId: string | null;
  folders: ChatFolder[];
  folderFilter: 'all' | 'none' | string;
  onFolderFilter: (f: 'all' | 'none' | string) => void;
  onCreateFolder: (ten: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveToFolder: (sessionId: string, folderId: string | null) => void;
  onClose: () => void;
  onNew: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string, pinned: boolean) => void;
  user?: { name: string; avatarUrl?: string; isPro: boolean } | null;
}

function nhomNgay(iso: string | undefined, now: Date): string {
  const t = iso ? new Date(iso) : now;
  const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const ms = t.getTime();
  if (ms >= d0) return 'Hôm nay';
  if (ms >= d0 - 86_400_000) return 'Hôm qua';
  if (ms >= d0 - 7 * 86_400_000) return '7 ngày qua';
  if (ms >= d0 - 30 * 86_400_000) return '30 ngày qua';
  return 'Cũ hơn';
}
const THU_TU = ['Đã ghim', 'Hôm nay', 'Hôm qua', '7 ngày qua', '30 ngày qua', 'Cũ hơn'];

export function CtcSidebar(p: Props) {
  const [q, setQ] = useState('');
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [moveFor, setMoveFor] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const [newFolder, setNewFolder] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuFor) return;
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) { setMenuFor(null); setMoveFor(null); } };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuFor(null); setMoveFor(null); } };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [menuFor]);

  const groups = useMemo(() => {
    const now = new Date();
    const kw = q.trim().toLowerCase();
    const list = p.sessions.filter((s) => {
      if (kw && !(s.title || '').toLowerCase().includes(kw)) return false;
      if (p.folderFilter === 'all') return true;
      if (p.folderFilter === 'none') return !s.folderId;
      return s.folderId === p.folderFilter;
    });
    const map = new Map<string, SessionRow[]>();
    for (const s of list) {
      const g = s.pinned ? 'Đã ghim' : nhomNgay(s.updatedAt ?? s.createdAt, now);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(s);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime());
    }
    return THU_TU.filter((g) => map.has(g)).map((g) => ({ g, items: map.get(g)! }));
  }, [p.sessions, p.folderFilter, q]);

  const commitRename = useCallback((id: string) => {
    const t = editVal.trim();
    setEditing(null);
    if (t) p.onRename(id, t);
  }, [editVal, p]);

  return (
    <aside className="ctc-side" data-open={p.open} aria-label="Lịch sử trò chuyện" aria-hidden={!p.open}>
      <div className="ctc-side-inner">
        <div className="ctc-side-head">
          <div className="ctc-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.png" alt="" />
            CuongMini
          </div>
          <button type="button" className="ctc-icon-btn" onClick={p.onClose} aria-label="Đóng thanh bên" title="Đóng thanh bên">
            <PanelLeftClose size={18} />
          </button>
        </div>

        <button type="button" className="ctc-new" onClick={p.onNew} data-testid="ctc-new">
          <span className="ctc-new-dot"><Plus size={15} strokeWidth={2.5} /></span>
          Cuộc trò chuyện mới
        </button>

        <div className="ctc-search">
          <Search size={14} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm cuộc trò chuyện…" aria-label="Tìm cuộc trò chuyện" />
        </div>

        <div className="ctc-side-scroll">
          <div className="ctc-group-label" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>Thư mục</span>
            <button type="button" className="ctc-icon-btn" data-sm aria-label="Thư mục mới" title="Thư mục mới" onClick={() => setNewFolder('')}>
              <FolderPlus size={14} />
            </button>
          </div>
          <div className="ctc-folders">
            <button type="button" className="ctc-chip" data-on={p.folderFilter === 'all'} onClick={() => p.onFolderFilter('all')}>Tất cả</button>
            <button type="button" className="ctc-chip" data-on={p.folderFilter === 'none'} onClick={() => p.onFolderFilter('none')}>Chưa xếp</button>
            {p.folders.map((f) => (
              <button
                key={f.id}
                type="button"
                className="ctc-chip"
                data-on={p.folderFilter === f.id}
                onClick={() => p.onFolderFilter(f.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (window.confirm(`Xoá thư mục "${f.ten}"? Các cuộc bên trong vẫn còn.`)) p.onDeleteFolder(f.id);
                }}
                title="Chuột phải để xoá thư mục"
              >
                <Folder size={11} style={f.mau ? { color: f.mau } : undefined} />
                {f.ten}
                {typeof f._count?.sessions === 'number' && <span style={{ opacity: 0.55 }}>{f._count.sessions}</span>}
              </button>
            ))}
          </div>
          {newFolder !== null && (
            <div style={{ display: 'flex', gap: 4, padding: '2px 4px 6px' }}>
              <input
                autoFocus
                className="ctc-row-edit"
                value={newFolder}
                maxLength={80}
                placeholder="Tên thư mục…"
                onChange={(e) => setNewFolder(e.target.value)}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === 'Enter' && newFolder.trim()) { p.onCreateFolder(newFolder.trim()); setNewFolder(null); }
                  if (e.key === 'Escape') setNewFolder(null);
                }}
                onBlur={() => setNewFolder(null)}
              />
            </div>
          )}

          {groups.length === 0 && (
            <div className="ctc-empty-side">{q ? 'Không tìm thấy cuộc nào' : 'Chưa có cuộc trò chuyện nào'}</div>
          )}

          {groups.map(({ g, items }) => (
            <div key={g}>
              <div className="ctc-group-label">{g}</div>
              {items.map((s) => {
                const on = s.sessionId === p.currentId;
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
                      {s.pinned && <Pin size={12} className="ctc-row-pin" />}
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
                            <div className="ctc-menu-label">Chuyển vào thư mục</div>
                            <button type="button" className="ctc-menu-item" onClick={() => { setMenuFor(null); setMoveFor(null); p.onMoveToFolder(s.sessionId, null); }}>
                              Không thư mục {!s.folderId && <Check size={14} style={{ marginLeft: 'auto' }} />}
                            </button>
                            {p.folders.map((f) => (
                              <button key={f.id} type="button" className="ctc-menu-item" onClick={() => { setMenuFor(null); setMoveFor(null); p.onMoveToFolder(s.sessionId, f.id); }}>
                                <Folder size={14} style={f.mau ? { color: f.mau } : undefined} /> {f.ten}
                                {s.folderId === f.id && <Check size={14} style={{ marginLeft: 'auto' }} />}
                              </button>
                            ))}
                            {p.folders.length === 0 && <div className="ctc-menu-label">Chưa có thư mục nào</div>}
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
                              <Folder size={15} /> Chuyển vào thư mục
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
              })}
            </div>
          ))}
        </div>

        {p.user && (
          <div className="ctc-side-foot">
            <Link href="/profile" className="ctc-user" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ctc-user-av">
                {p.user.avatarUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={getImageUrl(p.user.avatarUrl)} alt="" />
                  : p.user.name.slice(0, 1).toUpperCase()}
              </span>
              <span style={{ minWidth: 0 }}>
                <div className="ctc-user-name">{p.user.name}</div>
                <div className="ctc-user-plan">{p.user.isPro ? 'Gói Pro' : 'Gói miễn phí'}</div>
              </span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
