'use client';

import { useCallback, useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, FolderOpen, Link2, LayoutGrid, List,
  Columns3, Hash, ArrowRight, Command as CommandIcon, X,
} from 'lucide-react';
import { toast } from 'sonner';

import type { HubFile, HubFolder, HubLink } from '@/lib/api';
import { hubApi, hubFileApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubCommandPaletteProps {
  folders: HubFolder[];
  onSelectFolder: (id: number | 'all' | 'null') => void;
  onAddLink: () => void;
  onAddFile: () => void;
  onAddFolder: () => void;
  onSetViewMode: (mode: 'grid' | 'list' | 'kanban') => void;
  onClose: () => void;
}

const COMMAND_ITEMS = [
  { id: 'new-link', label: 'Them link moi', icon: Link2, action: 'action:new-link' },
  { id: 'new-file', label: 'Upload file moi', icon: Plus, action: 'action:new-file' },
  { id: 'new-folder', label: 'Tao thu muc moi', icon: FolderOpen, action: 'action:new-folder' },
  { id: 'goto-all', label: 'Tat ca', icon: LayoutGrid, action: 'folder:all' },
  { id: 'view-grid', label: 'Chuyen sang Grid view', icon: LayoutGrid, action: 'action:view-grid' },
  { id: 'view-list', label: 'Chuyen sang List view', icon: List, action: 'action:view-list' },
  { id: 'view-kanban', label: 'Chuyen sang Kanban view', icon: Columns3, action: 'action:view-kanban' },
];

export default function HubCommandPalette({
  folders, onSelectFolder, onAddLink, onAddFile, onAddFolder, onSetViewMode, onClose,
}: HubCommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<{
    links: HubLink[];
    files: HubFile[];
  }>({ links: [], files: [] });
  const [loading, setLoading] = useState(false);

  const runCommand = useCallback((action: string) => {
    if (action === 'action:new-link') { onAddLink(); onClose(); return; }
    if (action === 'action:new-file') { onAddFile(); onClose(); return; }
    if (action === 'action:new-folder') { onAddFolder(); onClose(); return; }
    if (action === 'action:view-grid') { onSetViewMode('grid'); onClose(); return; }
    if (action === 'action:view-list') { onSetViewMode('list'); onClose(); return; }
    if (action === 'action:view-kanban') { onSetViewMode('kanban'); onClose(); return; }
    if (action.startsWith('folder:')) {
      const id = action.replace('folder:', '');
      if (id === 'all') { onSelectFolder('all'); onClose(); return; }
      if (id === 'null') { onSelectFolder('null'); onClose(); return; }
      onSelectFolder(Number(id));
      onClose();
    }
  }, [onAddLink, onAddFile, onAddFolder, onSetViewMode, onSelectFolder, onClose]);

  // Search links + files when query doesn't start with ">"
  const doSearch = useCallback(async (q: string) => {
    if (!q || q.startsWith('>')) { setResults({ links: [], files: [] }); return; }
    setLoading(true);
    try {
      const [linksRes, filesRes] = await Promise.allSettled([
        hubApi.listLinks({ q, pageSize: 5 }),
        hubFileApi.list({ q, pageSize: 5 }),
      ]);
      setResults({
        links: linksRes.status === 'fulfilled'
          ? (linksRes.value.data.data as { items?: HubLink[] }).items ?? []
          : [],
        files: filesRes.status === 'fulfilled'
          ? (filesRes.value.data.data as { items?: HubFile[] }).items ?? []
          : [],
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { void doSearch(search); }, 200);
    return () => clearTimeout(t);
  }, [search, doSearch]);

  const isCommand = search.startsWith('>');

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      {/* Palette */}
      <div className="pointer-events-none fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4">
        <motion.div
          key="palette"
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.32, 0.94, 0.6, 1] }}
          className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-2xl border border-neon-violet/30 bg-[#0d0f18]/95 shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(139,92,246,0.15)] backdrop-blur-2xl"
        >
          <Command className="[&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:border-darkborder/50" style={{ background: 'transparent' }}>
            <div className="flex items-center gap-3 border-b border-darkborder/50 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-text-muted" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Tim link, file, folder... hoac goi lenh (nhu > goto Java)"
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="rounded p-0.5 text-text-muted hover:text-text-primary"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <kbd className="hidden rounded border border-darkborder bg-darkbg/60 px-1.5 py-0.5 text-[10px] text-text-muted sm:inline">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-xs text-text-muted">
                {loading ? 'Dang tim kiem...' : 'Khong co ket qua'}
              </Command.Empty>

              {/* Command mode (> prefix) */}
              {isCommand && (
                <Command.Group heading="Lenh" className="[&_*]:!text-[10px] [&_*]:!text-text-muted [&_*]:!font-semibold [&_*]:!uppercase [&_*]:!tracking-wider">
                  {COMMAND_ITEMS.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.label}
                      onSelect={() => runCommand(item.action)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-neon-violet/10 hover:text-text-primary data-[selected=true]:bg-neon-violet/15 data-[selected=true]:text-text-primary"
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-neon-violet" />
                      <span>{item.label}</span>
                      <ArrowRight className="ml-auto h-3 w-3 text-text-muted" />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Folder navigation */}
              {!isCommand && search.length === 0 && (
                <Command.Group heading="Thu muc" className="[&_*]:!text-[10px] [&_*]:!text-text-muted [&_*]:!font-semibold [&_*]:!uppercase [&_*]:!tracking-wider">
                  <Command.Item
                    value="Tat ca"
                    onSelect={() => runCommand('folder:all')}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-neon-violet/10 hover:text-text-primary data-[selected=true]:bg-neon-violet/15 data-[selected=true]:text-text-primary"
                  >
                    <LayoutGrid className="h-4 w-4 shrink-0 text-neon-violet" />
                    Tat ca
                  </Command.Item>
                  {folders.filter(f => f.parentId == null).map((f) => (
                    <Command.Item
                      key={f.id}
                      value={f.name}
                      onSelect={() => runCommand(`folder:${f.id}`)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-neon-violet/10 hover:text-text-primary data-[selected=true]:bg-neon-violet/15 data-[selected=true]:text-text-primary"
                    >
                      <FolderOpen className="h-4 w-4 shrink-0 text-neon-violet" />
                      <span className="flex-1">{f.name}</span>
                      <span className="text-[10px] text-text-muted">{f._count.links + f._count.files}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Link results */}
              {!isCommand && results.links.length > 0 && (
                <Command.Group heading="Links" className="[&_*]:!text-[10px] [&_*]:!text-text-muted [&_*]:!font-semibold [&_*]:!uppercase [&_*]:!tracking-wider">
                  {results.links.map((link) => (
                    <Command.Item
                      key={link.id}
                      value={link.title}
                      onSelect={() => { window.open(link.url, '_blank'); onClose(); }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-neon-violet/10 hover:text-text-primary data-[selected=true]:bg-neon-violet/15 data-[selected=true]:text-text-primary"
                    >
                      <Link2 className="h-4 w-4 shrink-0 text-neon-cyan" />
                      <span className="flex-1 truncate">{link.title}</span>
                      {link.tags.length > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-text-muted">
                          <Hash className="h-2.5 w-2.5" />
                          {link.tags[0]}
                        </span>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* File results */}
              {!isCommand && results.files.length > 0 && (
                <Command.Group heading="Files" className="[&_*]:!text-[10px] [&_*]:!text-text-muted [&_*]:!font-semibold [&_*]:!uppercase [&_*]:!tracking-wider">
                  {results.files.map((file) => (
                    <Command.Item
                      key={file.id}
                      value={file.name}
                      onSelect={() => { /* TODO: open file preview */ onClose(); }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-neon-violet/10 hover:text-text-primary data-[selected=true]:bg-neon-violet/15 data-[selected=true]:text-text-primary"
                    >
                      <Plus className="h-4 w-4 shrink-0 text-neon-emerald" />
                      <span className="flex-1 truncate">{file.name}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>

            {/* Footer hint */}
            <div className="flex items-center gap-3 border-t border-darkborder/50 px-4 py-2 text-[10px] text-text-muted">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-darkborder bg-darkbg/60 px-1 py-0.5">↑↓</kbd>
                di chuyen
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-darkborder bg-darkbg/60 px-1 py-0.5">Enter</kbd>
                chon
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-darkborder bg-darkbg/60 px-1 py-0.5">&gt;</kbd>
                goi lenh
              </span>
            </div>
          </Command>
        </motion.div>
      </div>
    </>
  );
}
