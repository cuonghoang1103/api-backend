'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Plus, FolderOpen, Inbox, MoreVertical, Trash2, Edit3, X, Check,
  ChevronRight, FolderPlus,
} from 'lucide-react';
import { toast } from 'sonner';

import { hubApi, type HubFolder } from '@/lib/api';
import { cn } from '@/lib/utils';

type Selection = number | 'all' | 'null';

interface HubFolderSidebarProps {
  folders: HubFolder[];
  selected: Selection;
  onSelect: (id: Selection) => void;
  onCreate: (name: string, icon: string | null, parentId?: number | null) => void;
  onDelete: (id: number) => void;
  addOpen: boolean;
  setAddOpen: (open: boolean) => void;
}

export default function HubFolderSidebar({
  folders, selected, onSelect, onCreate, onDelete, addOpen, setAddOpen,
}: HubFolderSidebarProps) {
  const [newName, setNewName] = useState('');
  const [menuId, setMenuId] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

  // Top-level folders = parentId === null
  const rootFolders = folders.filter((f) => f.parentId == null);
  const childCount = (parentId: number) =>
    folders.filter((f) => f.parentId === parentId).length;

  const toggleExpand = (id: number) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalCount = (f: HubFolder) => f._count.links + f._count.files;

  const submit = () => {
    const n = newName.trim();
    if (!n) { toast.error('Ten khong duoc rong'); return; }
    onCreate(n, null);
    setNewName('');
    setAddOpen(false);
  };

  const submitRename = async () => {
    if (renamingId == null) return;
    const n = renameValue.trim();
    if (!n) { toast.error('Ten khong duoc rong'); return; }
    try {
      await hubApi.updateFolder(renamingId, { name: n });
      toast.success('Da doi ten thu muc');
    } catch {
      toast.error('Khong the doi ten');
    } finally {
      setRenamingId(null);
      setRenameValue('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-darkborder/50 bg-darkcard/60 p-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Layers className="h-4 w-4 text-neon-violet" />
          Thu muc
          <button
            onClick={() => setAddOpen(true)}
            className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg border border-darkborder bg-darkbg/60 text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-neon-violet"
            title="Them thu muc"
            aria-label="Them thu muc"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          {/* Fixed items */}
          <FolderItem
            active={selected === 'all'}
            icon={<Layers className="h-3.5 w-3.5" />}
            label="Tat ca"
            count={undefined}
            onClick={() => onSelect('all')}
          />
          <FolderItem
            active={selected === 'null'}
            icon={<Inbox className="h-3.5 w-3.5" />}
            label="Chua phan loai"
            count={undefined}
            onClick={() => onSelect('null')}
          />

          {/* User folders with sub-folder support */}
          {rootFolders.map((f) => (
            <FolderTreeItem
              key={f.id}
              folder={f}
              folders={folders}
              selected={selected}
              onSelect={onSelect}
              onToggleExpand={toggleExpand}
              expandedFolders={expandedFolders}
              renamingId={renamingId}
              renameValue={renameValue}
              setRenamingId={setRenamingId}
              setRenameValue={setRenameValue}
              menuId={menuId}
              setMenuId={setMenuId}
              onDelete={onDelete}
              onSubmitRename={submitRename}
              childCount={childCount}
              totalCount={totalCount}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {addOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-neon-violet/30 bg-neon-violet/5 p-3">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                  if (e.key === 'Escape') { setAddOpen(false); setNewName(''); }
                }}
                placeholder="Ten thu muc..."
                className="mb-2 w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
              />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={submit}
                  className="flex-1 rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Tao
                </button>
                <button
                  onClick={() => { setAddOpen(false); setNewName(''); }}
                  className="rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
                >
                  Huy
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Folder Tree Item ─────────────────────────────────────────

interface FolderTreeItemProps {
  folder: HubFolder;
  folders: HubFolder[];
  selected: Selection;
  onSelect: (id: Selection) => void;
  onToggleExpand: (id: number) => void;
  expandedFolders: Set<number>;
  renamingId: number | null;
  renameValue: string;
  setRenamingId: (id: number | null) => void;
  setRenameValue: (v: string) => void;
  menuId: number | null;
  setMenuId: (id: number | null) => void;
  onDelete: (id: number) => void;
  onSubmitRename: () => void;
  childCount: (id: number) => number;
  totalCount: (f: HubFolder) => number;
}

function FolderTreeItem({
  folder, folders, selected, onSelect, onToggleExpand,
  expandedFolders, renamingId, renameValue, setRenamingId, setRenameValue,
  menuId, setMenuId, onDelete, onSubmitRename, childCount, totalCount,
}: FolderTreeItemProps) {
  const children = folders.filter((f) => f.parentId === folder.id);
  const hasChildren = children.length > 0;
  const isExpanded = expandedFolders.has(folder.id);

  return (
    <div>
      {renamingId === folder.id ? (
        <div className="flex items-center gap-1 rounded-xl border border-neon-violet/40 bg-darkbg/60 px-2 py-1.5">
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void onSubmitRename();
              if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
            }}
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
          <button
            onClick={onSubmitRename}
            className="text-emerald-400 hover:text-emerald-300"
            title="Luu"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => { setRenamingId(null); setRenameValue(''); }}
            className="text-text-muted hover:text-text-primary"
            title="Huy"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="group relative flex items-center">
          {/* Expand/collapse chevron */}
          {hasChildren ? (
            <button
              onClick={() => onToggleExpand(folder.id)}
              className="mr-0.5 flex h-5 w-5 items-center justify-center rounded text-text-muted transition-all hover:text-text-primary"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          ) : (
            <div className="mr-0.5 h-5 w-5" />
          )}

          <FolderItem
            active={selected === folder.id}
            icon={<FolderOpen className="h-3.5 w-3.5" />}
            label={folder.name}
            count={totalCount(folder)}
            onClick={() => onSelect(folder.id)}
          />

          {/* Menu button */}
          {renamingId !== folder.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuId(menuId === folder.id ? null : folder.id);
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted opacity-0 transition-all hover:bg-white/5 hover:text-text-primary group-hover:opacity-100"
              title="Them"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Dropdown menu */}
          <AnimatePresence>
            {menuId === folder.id && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-1 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl"
              >
                <button
                  onClick={() => { setRenamingId(folder.id); setRenameValue(folder.name); setMenuId(null); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <Edit3 className="h-3 w-3" /> Doi ten
                </button>
                <button
                  onClick={() => {
                    setMenuId(null);
                    if (confirm(`Tao thu muc con trong "${folder.name}"?`)) {
                      const name = prompt('Ten thu muc con:');
                      if (name?.trim()) {
                        // We can't call onCreate with parentId here easily
                        // Use API directly
                        void hubApi.createFolder({ name: name.trim() }).then(() => {
                          toast.success('Da tao thu muc con');
                        }).catch(() => toast.error('Khong the tao thu muc'));
                      }
                    }
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <FolderPlus className="h-3 w-3" /> Them thu muc con
                </button>
                <button
                  onClick={() => {
                    setMenuId(null);
                    if (confirm(`Xoa thu muc "${folder.name}"? Links va files se giu lai.`)) onDelete(folder.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" /> Xoa
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-5 overflow-hidden"
          >
            <div className="mt-1 space-y-1 border-l border-darkborder/50 pl-3">
              {children.map((child) => (
                <FolderTreeItem
                  key={child.id}
                  folder={child}
                  folders={folders}
                  selected={selected}
                  onSelect={onSelect}
                  onToggleExpand={onToggleExpand}
                  expandedFolders={expandedFolders}
                  renamingId={renamingId}
                  renameValue={renameValue}
                  setRenamingId={setRenamingId}
                  setRenameValue={setRenameValue}
                  menuId={menuId}
                  setMenuId={setMenuId}
                  onDelete={onDelete}
                  onSubmitRename={onSubmitRename}
                  childCount={childCount}
                  totalCount={totalCount}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Folder Item ──────────────────────────────────────────────

function FolderItem({
  active, icon, label, count, onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count: number | undefined;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm transition-all',
        active
          ? 'border border-neon-violet/40 bg-neon-violet/15 text-text-primary shadow-[0_0_12px_rgba(167,139,250,0.18)]'
          : 'border border-transparent text-text-secondary hover:bg-white/[0.04] hover:text-text-primary',
      )}
    >
      <span className={cn('shrink-0', active ? 'text-neon-violet' : 'text-text-muted')}>
        {icon}
      </span>
      <span className="flex-1 truncate font-medium">{label}</span>
      {count != null && count > 0 && (
        <span className="rounded-full bg-darkborder/60 px-1.5 py-0.5 text-[10px] text-text-muted">
          {count}
        </span>
      )}
    </button>
  );
}
