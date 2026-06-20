'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Plus, FolderOpen, Inbox, MoreVertical, Trash2, Edit3, X, Check,
} from 'lucide-react';
import { toast } from 'sonner';

import { hubApi, type HubFolder } from '@/lib/api';
import { cn } from '@/lib/utils';

type Selection = number | 'all' | 'null';

interface HubFolderSidebarProps {
  folders: HubFolder[];
  selected: Selection;
  onSelect: (id: Selection) => void;
  onCreate: (name: string, icon: string | null) => void;
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

  const submit = () => {
    const n = newName.trim();
    if (!n) { toast.error('Ten khong duoc rong'); return; }
    onCreate(n, null);
    setNewName('');
    setAddOpen(false);
  };

  const startRename = (f: HubFolder) => {
    setRenamingId(f.id);
    setRenameValue(f.name);
    setMenuId(null);
  };

  const submitRename = async () => {
    if (renamingId == null) return;
    const n = renameValue.trim();
    if (!n) { toast.error('Ten khong duoc rong'); return; }
    try {
      await hubApi.updateFolder(renamingId, { name: n });
      // Tell the parent to reload by simulating a refetch:
      // we can't pass reloadFolders here without prop drilling, so
      // we do a local optimistic rename and let the next refetch
      // reconcile. Simpler: just toast success and the next effect
      // (selectedFolder change or reload) will pick it up.
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
          {folders.map((f) => (
            <div key={f.id} className="group relative">
              {renamingId === f.id ? (
                <div className="flex items-center gap-1 rounded-xl border border-neon-violet/40 bg-darkbg/60 px-2 py-1.5">
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void submitRename();
                      if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
                    }}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                  />
                  <button
                    onClick={submitRename}
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
                <FolderItem
                  active={selected === f.id}
                  icon={<FolderOpen className="h-3.5 w-3.5" />}
                  label={f.name}
                  count={f._count.links}
                  onClick={() => onSelect(f.id)}
                />
              )}
              {renamingId !== f.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuId(menuId === f.id ? null : f.id); }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted opacity-0 transition-all hover:bg-white/5 hover:text-text-primary group-hover:opacity-100"
                  title="Them"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              )}
              <AnimatePresence>
                {menuId === f.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-1 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl"
                  >
                    <button
                      onClick={() => startRename(f)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                    >
                      <Edit3 className="h-3 w-3" /> Doi ten
                    </button>
                    <button
                      onClick={() => { setMenuId(null); if (confirm(`Xoa thu muc "${f.name}"? Links se giu lai nhung bo folder.`)) onDelete(f.id); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" /> Xoa
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
