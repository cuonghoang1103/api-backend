'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, LogIn } from 'lucide-react';
import { toast } from 'sonner';

import { hubApi, type HubFolder, type HubLink } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

import HubFolderSidebar from './HubFolderSidebar';
import HubToolbar from './HubToolbar';
import HubLinkGrid from './HubLinkGrid';
import HubLinkList from './HubLinkList';
import HubAddLinkModal from './HubAddLinkModal';

type FolderSelection = number | 'all' | 'null';
type ViewMode = 'grid' | 'list';

interface HubClientProps {
  initialFolders: HubFolder[];
  initialLinks: HubLink[];
  initialTotal: number;
}

export default function HubClient({
  initialFolders,
  initialLinks,
  initialTotal,
}: HubClientProps) {
  const { isAuthenticated } = useAuthStore();

  // ── Mounted guard — per the workspace's SSR/hydration rule, we
  // never render content that depends on the client until after
  // mount. We also use this to gate auth (zustand persists to
  // localStorage, so it returns null on the first server render).
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // ── Data state ─────────────────────────────────────────────
  // Coerce initial state so we always have an array even if SSR
  // somehow passes an object (defense in depth — HubLinkGrid calls
  // links.map() unconditionally and crashes otherwise).
  const initialLinksArray = Array.isArray(initialLinks) ? initialLinks : [];
  const initialFoldersArray = Array.isArray(initialFolders) ? initialFolders : [];
  const [folders, setFolders] = useState<HubFolder[]>(initialFoldersArray);
  const [links, setLinks] = useState<HubLink[]>(initialLinksArray);
  const [total, setTotal] = useState<number>(
    typeof initialTotal === 'number'
      ? initialTotal
      : initialLinksArray.length,
  );
  const [loading, setLoading] = useState(false);

  // ── Filter / view state ────────────────────────────────────
  const [selectedFolder, setSelectedFolder] = useState<FolderSelection>('all');
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Persist viewMode in localStorage. Wrapped in mounted guard
  // so SSR never reads localStorage and trips a hydration warning.
  useEffect(() => {
    if (!mounted) return;
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('hub:viewMode') : null;
    if (stored === 'grid' || stored === 'list') setViewMode(stored);
  }, [mounted]);
  useEffect(() => {
    if (!mounted) return;
    try { window.localStorage.setItem('hub:viewMode', viewMode); } catch { /* ignore */ }
  }, [viewMode, mounted]);

  // Debounce search input → keyword (300ms).
  useEffect(() => {
    const id = window.setTimeout(() => setKeyword(searchInput.trim()), 300);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  // ── Modal state ────────────────────────────────────────────
  const [addFolderOpen, setAddFolderOpen] = useState(false);
  const [addLinkOpen, setAddLinkOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<HubLink | null>(null);

  // ── Refs to avoid stale closures in the fetch effect ───────
  const foldersRef = useRef(folders);
  foldersRef.current = folders;

  // ── Fetch links whenever filters change ────────────────────
  const reloadLinks = useCallback(async () => {
    if (!mounted || !isAuthenticated) return;
    setLoading(true);
    try {
      const res = await hubApi.listLinks({
        folderId: selectedFolder,
        q: keyword || undefined,
        page: 1,
        pageSize: 50,
      });
      // Backend wraps the listLinks result in `{ success, data: { items, total, ... } }`.
      // Be defensive in case the shape ever drifts back.
      const payload = res.data.data as
        | { items?: HubLink[]; total?: number }
        | HubLink[]
        | undefined;
      if (Array.isArray(payload)) {
        setLinks(payload);
        setTotal(payload.length);
      } else if (payload && typeof payload === 'object') {
        setLinks(payload.items ?? []);
        setTotal(payload.total ?? 0);
      } else {
        setLinks([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('[hub] reloadLinks', err);
      toast.error('Khong tai duoc danh sach link');
    } finally {
      setLoading(false);
    }
  }, [mounted, isAuthenticated, selectedFolder, keyword]);

  useEffect(() => {
    reloadLinks();
  }, [reloadLinks]);

  // ── Fetch folders once (after auth) ────────────────────────
  const reloadFolders = useCallback(async () => {
    if (!mounted || !isAuthenticated) return;
    try {
      const res = await hubApi.listFolders();
      setFolders(res.data.data);
    } catch (err) {
      console.error('[hub] reloadFolders', err);
    }
  }, [mounted, isAuthenticated]);

  useEffect(() => {
    if (mounted && isAuthenticated && initialFolders.length === 0) {
      reloadFolders();
    }
  }, [mounted, isAuthenticated, initialFolders.length, reloadFolders]);

  // ── Handlers ───────────────────────────────────────────────
  const handleCreateFolder = useCallback(async (name: string, icon: string | null) => {
    try {
      const res = await hubApi.createFolder({ name, icon: icon ?? undefined });
      setFolders((prev) => [...prev, res.data.data]);
      toast.success('Da tao thu muc');
    } catch (err) {
      console.error(err);
      toast.error('Khong the tao thu muc');
    }
  }, []);

  const handleDeleteFolder = useCallback(async (id: number) => {
    try {
      await hubApi.deleteFolder(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
      if (selectedFolder === id) setSelectedFolder('all');
      toast.success('Da xoa thu muc');
      reloadLinks();
    } catch (err) {
      console.error(err);
      toast.error('Khong the xoa thu muc');
    }
  }, [selectedFolder, reloadLinks]);

  const handleSaveLink = useCallback(async (data: {
    id?: number;
    folderId: number | null;
    url: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    faviconUrl?: string | null;
    notes?: string | null;
    tags?: string[];
    isPublic?: boolean;
  }) => {
    try {
      if (data.id) {
        await hubApi.updateLink(data.id, data);
        toast.success('Da cap nhat link');
      } else {
        await hubApi.createLink(data);
        toast.success('Da luu link');
      }
      reloadLinks();
      reloadFolders(); // counts may have changed
    } catch (err) {
      console.error(err);
      toast.error('Khong the luu link');
      throw err;
    }
  }, [reloadLinks, reloadFolders]);

  const handleDeleteLink = useCallback(async (id: number) => {
    try {
      await hubApi.deleteLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      toast.success('Da xoa link');
    } catch (err) {
      console.error(err);
      toast.error('Khong the xoa link');
    }
  }, []);

  // ── Render ─────────────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-darkbg pt-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neon-violet/20 border-t-neon-violet" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-darkbg pt-24 pb-20 text-text-primary">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-neon-violet/30 bg-neon-violet/10">
            <Layers className="h-8 w-8 text-neon-violet" />
          </div>
          <h1 className="mb-2 font-heading text-3xl font-bold">
            <span className="bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-pink bg-clip-text text-transparent">
              Hub
            </span>
          </h1>
          <p className="mb-6 text-text-secondary">
            Dang nhap de luu va to chuc cac link, bai viet, cong cu ban yeu thich.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neon-violet/30 transition-all hover:opacity-90"
          >
            <LogIn className="h-4 w-4" /> Dang nhap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg pt-24 pb-20 text-text-primary">
      {/* Hero */}
      <header className="relative z-10 mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-violet/30 bg-neon-violet/10 px-4 py-1.5 text-xs uppercase tracking-wider text-neon-violet"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Personal Bookmark Manager
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-3 font-heading text-4xl font-bold leading-tight md:text-5xl"
        >
          <span className="bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-pink bg-clip-text text-transparent">
            Hub
          </span>{' '}
          cua ban
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-text-secondary"
        >
          Luu link, bai viet, cong cu — tu dong lay metadata chi bang mot lan paste URL.
        </motion.p>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <HubFolderSidebar
            folders={folders}
            selected={selectedFolder}
            onSelect={setSelectedFolder}
            onCreate={handleCreateFolder}
            onDelete={handleDeleteFolder}
            addOpen={addFolderOpen}
            setAddOpen={setAddFolderOpen}
          />
        </aside>

        <section>
          <HubToolbar
            searchInput={searchInput}
            onSearchInput={setSearchInput}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddLink={() => { setEditingLink(null); setAddLinkOpen(true); }}
            total={total}
            loading={loading}
            folderName={folderNameFor(folders, selectedFolder)}
          />

          {links.length === 0 && !loading ? (
            <EmptyState
              hasFilters={!!keyword || selectedFolder !== 'all'}
              onClear={() => { setSearchInput(''); setSelectedFolder('all'); }}
              onAddLink={() => { setEditingLink(null); setAddLinkOpen(true); }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === 'grid' ? (
                  <HubLinkGrid
                    links={links}
                    onEdit={(l) => { setEditingLink(l); setAddLinkOpen(true); }}
                    onDelete={handleDeleteLink}
                  />
                ) : (
                  <HubLinkList
                    links={links}
                    onEdit={(l) => { setEditingLink(l); setAddLinkOpen(true); }}
                    onDelete={handleDeleteLink}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </div>

      <HubAddLinkModal
        open={addLinkOpen}
        initial={editingLink}
        folders={folders}
        onClose={() => { setAddLinkOpen(false); setEditingLink(null); }}
        onSave={handleSaveLink}
      />
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────

function folderNameFor(
  folders: HubFolder[],
  selected: FolderSelection,
): string {
  if (selected === 'all') return 'Tat ca';
  if (selected === 'null') return 'Chua phan loai';
  const f = folders.find((x) => x.id === selected);
  return f?.name ?? 'Tat ca';
}

// Sub-component to keep this file self-contained.
function EmptyState({
  hasFilters,
  onClear,
  onAddLink,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onAddLink: () => void;
}) {
  return (
    <div className="rounded-2xl border border-darkborder/50 bg-darkcard/40 p-10 text-center backdrop-blur-xl">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-darkborder bg-darkcard/60">
        <Layers className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">
        {hasFilters ? 'Khong co link phu hop' : 'Hub cua ban dang trong'}
      </h3>
      <p className="mx-auto mb-5 max-w-md text-sm text-text-secondary">
        {hasFilters
          ? 'Thu xoa bo loc hoac tu khoa khac.'
          : 'Luu link dau tien de bat dau — chi can paste URL, chung toi se tu dong lay metadata.'}
      </p>
      {hasFilters ? (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-4 py-2 text-sm font-medium text-neon-violet transition-colors hover:bg-neon-violet/20"
        >
          Xoa bo loc
        </button>
      ) : (
        <button
          onClick={onAddLink}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/30 transition-all hover:opacity-90"
        >
          Luu link dau tien
        </button>
      )}
    </div>
  );
}
