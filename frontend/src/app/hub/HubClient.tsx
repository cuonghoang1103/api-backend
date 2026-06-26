'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, LogIn, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { hubApi, hubFileApi, hubShareApi, type HubFolder, type HubLink, type HubFile, type HubShare } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

import HubFolderSidebar from './HubFolderSidebar';
import HubToolbar, { type ViewMode, type StatusFilter } from './HubToolbar';
import HubLinkGrid from './HubLinkGrid';
import HubLinkList from './HubLinkList';
import HubLinkCard from './HubLinkCard';
import HubAddLinkModal from './HubAddLinkModal';
import HubFilePreviewModal from '@/components/hub/HubFilePreviewModal';
import HubUploadModal from '@/components/hub/HubUploadModal';
import HubKanbanBoard from '@/components/hub/HubKanbanBoard';
import HubCommandPalette from '@/components/hub/HubCommandPalette';
import HubBanner from '@/components/hub/HubBanner';
import HubFileCard from '@/components/hub/HubFileCard';
import HubShareModal from '@/components/hub/HubShareModal';
import HubSharedWithMe from '@/components/hub/HubSharedWithMe';
import HubSharedItemViewer from '@/components/hub/HubSharedItemViewer';

type FolderSelection = number | 'all' | 'null';

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

  // ── Mounted guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // ── Data state
  const initialLinksArray = Array.isArray(initialLinks) ? initialLinks : [];
  const initialFoldersArray = Array.isArray(initialFolders) ? initialFolders : [];
  const [folders, setFolders] = useState<HubFolder[]>(initialFoldersArray);
  const [links, setLinks] = useState<HubLink[]>(initialLinksArray);
  const [files, setFiles] = useState<HubFile[]>([]);
  const [totalLinks, setTotalLinks] = useState<number>(
    typeof initialTotal === 'number' ? initialTotal : initialLinksArray.length,
  );
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState(false);

  // ── Filter / view state
  const [selectedFolder, setSelectedFolder] = useState<FolderSelection>('all');
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Persist viewMode in localStorage
  useEffect(() => {
    if (!mounted) return;
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('hub:viewMode') : null;
    if (stored === 'grid' || stored === 'list' || stored === 'kanban') setViewMode(stored);
    const storedBanner = localStorage.getItem('hub:bannerUrl');
    if (storedBanner) setBannerUrl(storedBanner);
  }, [mounted]);
  useEffect(() => {
    if (!mounted) return;
    try { window.localStorage.setItem('hub:viewMode', viewMode); } catch { /* ignore */ }
  }, [viewMode, mounted]);

  // Debounce search input → keyword (300ms)
  useEffect(() => {
    const id = window.setTimeout(() => setKeyword(searchInput.trim()), 300);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  // Ctrl+K / Cmd+K shortcut for command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Modal state
  const [addFolderOpen, setAddFolderOpen] = useState(false);
  const [addLinkOpen, setAddLinkOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<HubLink | null>(null);
  const [previewFile, setPreviewFile] = useState<HubFile | null>(null);
  // ── Phase 2 — Hub user-sharing modals
  const [shareModalItem, setShareModalItem] = useState<{ kind: 'folder' | 'link' | 'file'; id: number; label?: string } | null>(null);
  const [viewingShare, setViewingShare] = useState<HubShare | null>(null);
  const [shareItemModalOpen, setShareItemModalOpen] = useState(false);

  // ── Refs
  const foldersRef = useRef(folders);
  foldersRef.current = folders;

  // ── Fetch links whenever filters change
  const reloadLinks = useCallback(async () => {
    if (!mounted || !isAuthenticated) return;
    setLoading(true);
    try {
      const res = await hubApi.listLinks({
        folderId: selectedFolder,
        q: keyword || undefined,
        page: 1,
        pageSize: 100,
      });
      const payload = res.data.data as
        | { items?: HubLink[]; total?: number }
        | HubLink[]
        | undefined;
      if (Array.isArray(payload)) {
        setLinks(payload);
        setTotalLinks(payload.length);
      } else if (payload && typeof payload === 'object') {
        setLinks(payload.items ?? []);
        setTotalLinks(payload.total ?? 0);
      } else {
        setLinks([]);
        setTotalLinks(0);
      }
    } catch (err) {
      console.error('[hub] reloadLinks', err);
      toast.error('Khong tai duoc danh sach link');
    } finally {
      setLoading(false);
    }
  }, [mounted, isAuthenticated, selectedFolder, keyword]);

  // ── Fetch files
  const reloadFiles = useCallback(async () => {
    if (!mounted || !isAuthenticated) return;
    try {
      const res = await hubFileApi.list({
        folderId: selectedFolder,
        q: keyword || undefined,
        page: 1,
        pageSize: 100,
      });
      const payload = res.data.data as
        | { items?: HubFile[]; total?: number }
        | HubFile[]
        | undefined;
      if (Array.isArray(payload)) {
        setFiles(payload);
        setTotalFiles(payload.length);
      } else if (payload && typeof payload === 'object') {
        setFiles(payload.items ?? []);
        setTotalFiles(payload.total ?? 0);
      } else {
        setFiles([]);
        setTotalFiles(0);
      }
    } catch (err) {
      console.error('[hub] reloadFiles', err);
    }
  }, [mounted, isAuthenticated, selectedFolder, keyword]);

  // ── Fetch folders
  const reloadFolders = useCallback(async () => {
    if (!mounted || !isAuthenticated) return;
    try {
      const res = await hubApi.listFolders();
      setFolders(res.data.data);
    } catch (err) {
      console.error('[hub] reloadFolders', err);
    }
  }, [mounted, isAuthenticated]);

  // Re-fetch on filter changes
  useEffect(() => {
    void reloadLinks();
    void reloadFiles();
  }, [reloadLinks, reloadFiles]);

  useEffect(() => {
    if (mounted && isAuthenticated && initialFolders.length === 0) {
      void reloadFolders();
    }
  }, [mounted, isAuthenticated, initialFolders.length, reloadFolders]);

  // ── Handlers
  const handleCreateFolder = useCallback(async (
    name: string,
    icon: string | null,
    parentId?: number | null,
  ) => {
    try {
      const res = await hubApi.createFolder({
        name,
        icon: icon ?? undefined,
        parentId: parentId ?? undefined,
      });
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
      void reloadLinks();
      void reloadFiles();
    } catch (err) {
      console.error(err);
      toast.error('Khong the xoa thu muc');
    }
  }, [selectedFolder, reloadLinks, reloadFiles]);

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
      void reloadLinks();
      void reloadFolders();
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
      setTotalLinks((t) => Math.max(0, t - 1));
      void reloadFolders(); // refresh sidebar counts
      toast.success('Da xoa link');
    } catch (err) {
      console.error(err);
      toast.error('Khong the xoa link');
    }
  }, [reloadFolders]);

  const handleDeleteFile = useCallback(async (id: number) => {
    try {
      await hubFileApi.delete(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      setTotalFiles((t) => Math.max(0, t - 1));
      toast.success('Da xoa file');
    } catch (err) {
      console.error(err);
      toast.error('Khong the xoa file');
    }
  }, []);

  const handleStatusChange = useCallback(async (type: 'link' | 'file', id: number, status: string) => {
    try {
      if (type === 'link') {
        await hubApi.updateLink(id, { status: status as 'unread' | 'learning' | 'done' });
        setLinks((prev) => prev.map((l) => l.id === id ? { ...l, status: status as HubLink['status'] } : l));
      } else {
        await hubFileApi.update(id, { status: status as 'unread' | 'learning' | 'done' });
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, status: status as HubFile['status'] } : f));
      }
      toast.success('Da cap nhat trang thai');
    } catch (err) {
      console.error(err);
      toast.error('Khong the cap nhat trang thai');
    }
  }, []);

  const handleBannerUpload = useCallback(async (file: File) => {
    // Upload banner to R2 via presigned URL
    const presigned = await hubFileApi.presign({
      name: 'banner.jpg',
      mimeType: file.type,
    });
    await fetch(presigned.data.data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
    const bannerKey = presigned.data.data.key;
    // Build public URL from the key
    const cdnBase = process.env.NEXT_PUBLIC_CDN_URL ?? '';
    const url = cdnBase ? `${cdnBase}/${bannerKey}` : bannerKey;
    setBannerUrl(url);
    localStorage.setItem('hub:bannerUrl', url);
  }, []);

  // ── Filtered items based on status
  const filteredLinks = useMemo(() => {
    if (statusFilter === 'all') return links;
    return links.filter((l) => l.status === statusFilter);
  }, [links, statusFilter]);

  const filteredFiles = useMemo(() => {
    if (statusFilter === 'all') return files;
    return files.filter((f) => f.status === statusFilter);
  }, [files, statusFilter]);

  const total = filteredLinks.length + filteredFiles.length;

  // ── Render
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
          Personal Knowledge Hub
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
          Luu link, file, bai viet — tu dong lay metadata chi bang mot lan paste URL.
        </motion.p>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <HubFolderSidebar
            folders={folders}
            selected={selectedFolder}
            onSelect={setSelectedFolder}
            onCreate={handleCreateFolder}
            onDelete={handleDeleteFolder}
            addOpen={addFolderOpen}
            setAddOpen={setAddFolderOpen}
          />
          {/* Phase 2 — sidebar widget showing users who have
              shared items with the current user. Lives below the
              folder list so we keep the existing 2-col grid that
              the rest of the UI was designed for. */}
          <HubSharedWithMe
            onOpenShare={(s) => {
              setViewingShare(s);
              setShareItemModalOpen(true);
            }}
          />
        </aside>

        <section>
          <HubToolbar
            searchInput={searchInput}
            onSearchInput={setSearchInput}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onAddLink={() => { setEditingLink(null); setAddLinkOpen(true); }}
            onAddFile={() => setUploadOpen(true)}
            totalLinks={filteredLinks.length}
            totalFiles={filteredFiles.length}
            loading={loading}
            folderName={folderNameFor(folders, selectedFolder)}
            total={total}
          />

          {total === 0 && !loading ? (
            <EmptyState
              hasFilters={!!keyword || selectedFolder !== 'all' || statusFilter !== 'all'}
              onClear={() => { setSearchInput(''); setSelectedFolder('all'); setStatusFilter('all'); }}
              onAddLink={() => { setEditingLink(null); setAddLinkOpen(true); }}
              onAddFile={() => setUploadOpen(true)}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${statusFilter}-${links.length}-${files.length}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === 'kanban' ? (
                  <HubKanbanBoard
                    key={`kanban-${links.length}-${files.length}`}
                    links={filteredLinks}
                    files={filteredFiles}
                    onEditLink={(l) => { setEditingLink(l); setAddLinkOpen(true); }}
                    onDeleteLink={handleDeleteLink}
                    onDeleteFile={handleDeleteFile}
                    onPreviewFile={setPreviewFile}
                    onRefresh={() => { void reloadLinks(); void reloadFiles(); }}
                  />
                ) : viewMode === 'grid' ? (
                  <div key={`grid-${links.length}-${files.length}`} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredFiles.map((f) => (
                      <HubFileCard
                        key={`file-${f.id}`}
                        file={f}
                        onClick={setPreviewFile}
                        onDelete={handleDeleteFile}
                        onStatusChange={(id, status) => { void handleStatusChange('file', id, status); }}
                        onShare={(file) => setShareModalItem({ kind: 'file', id: file.id, label: file.name })}
                      />
                    ))}
                    {filteredLinks.map((l) => (
<HubLinkCard
                          key={`link-${l.id}`}
                          link={l}
                          onEdit={(link) => { setEditingLink(link); setAddLinkOpen(true); }}
                          onDelete={handleDeleteLink}
                          onStatusChange={(id, status) => { void handleStatusChange('link', id, status); }}
                          onShare={(link) => setShareModalItem({ kind: 'link', id: link.id, label: link.title })}
                        />
                    ))}
                  </div>
                ) : (
                  <div key={`list-${links.length}-${files.length}`} className="space-y-2">
                    {filteredFiles.map((f) => (
                      <div
                        key={`file-${f.id}`}
                        className="flex items-center gap-3 rounded-xl border border-darkborder/50 bg-darkcard/40 px-3 py-2.5 transition-colors hover:border-neon-violet/40 hover:bg-darkcard/60"
                      >
                        <button onClick={() => setPreviewFile(f)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neon-violet/10 text-neon-violet">
                            <Layers className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-text-primary">{f.name}</p>
                            <p className="text-[10px] text-text-muted">
                              {(f.size / 1024).toFixed(1)} KB · {f.mimeType.split('/')[1]?.toUpperCase() ?? 'FILE'}
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => { if (confirm(`Xoa file "${f.name}"?`)) void handleDeleteFile(f.id); }}
                          className="rounded p-1.5 text-text-muted hover:text-red-400"
                          aria-label="Xoa file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <HubLinkList
                      links={filteredLinks}
                      onEdit={(l) => { setEditingLink(l); setAddLinkOpen(true); }}
                      onDelete={handleDeleteLink}
                      onStatusChange={(id, status) => { void handleStatusChange('link', id, status); }}
                      onShare={(l) => setShareModalItem({ kind: 'link', id: l.id, label: l.title })}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </div>

      {/* Modals */}
      <HubAddLinkModal
        open={addLinkOpen}
        initial={editingLink}
        folders={folders}
        onClose={() => { setAddLinkOpen(false); setEditingLink(null); }}
        onSave={handleSaveLink}
      />

      <HubUploadModal
        open={uploadOpen}
        folders={folders}
        onClose={() => setUploadOpen(false)}
        onUploaded={(file) => {
          setFiles((prev) => {
            if (prev.some((f) => f.id === file.id)) return prev;
            return [file, ...prev];
          });
          setTotalFiles((prev) => prev + 1);
          void reloadFolders();
        }}
      />

      <HubFilePreviewModal
        file={previewFile}
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        onDelete={handleDeleteFile}
        onUpdate={(id, data) => {
          void handleStatusChange('file', id, data.status ?? '');
          if (data.notes !== undefined) {
            void hubFileApi.update(id, { notes: data.notes });
          }
        }}
      />

      {/* Phase 2 — owner-side share dialog. Triggered by the
          "Share" button on HubLinkCard / HubFileCard / folder
          row. Re-renders the outbox when a share is created so
          the sidebar's "recent recipients" chips stay fresh. */}
      <HubShareModal
        open={!!shareModalItem}
        item={shareModalItem ? { kind: shareModalItem.kind, id: shareModalItem.id } : null}
        itemLabel={shareModalItem?.label}
        onClose={() => setShareModalItem(null)}
      />

      {/* Phase 2 — recipient-side viewer. Shows the underlying
          folder/link/file with read-only controls + (when
          permission = view_download) a Download button. */}
      <HubSharedItemViewer
        share={viewingShare}
        open={shareItemModalOpen}
        onClose={() => { setShareItemModalOpen(false); setViewingShare(null); }}
      />

      <AnimatePresence>
        {commandPaletteOpen && (
          <HubCommandPalette
            folders={folders}
            onSelectFolder={setSelectedFolder}
            onAddLink={() => { setEditingLink(null); setAddLinkOpen(true); }}
            onAddFile={() => setUploadOpen(true)}
            onAddFolder={() => setAddFolderOpen(true)}
            onSetViewMode={setViewMode}
            onClose={() => setCommandPaletteOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────

function folderNameFor(folders: HubFolder[], selected: FolderSelection): string {
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
  onAddFile,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onAddLink: () => void;
  onAddFile: () => void;
}) {
  return (
    <div className="rounded-2xl border border-darkborder/50 bg-darkcard/40 p-10 text-center backdrop-blur-xl">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-darkborder bg-darkcard/60">
        <Layers className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">
        {hasFilters ? 'Khong co ket qua phu hop' : 'Hub cua ban dang trong'}
      </h3>
      <p className="mx-auto mb-5 max-w-md text-sm text-text-secondary">
        {hasFilters
          ? 'Thu xoa bo loc hoac tu khoa khac.'
          : 'Luu link hoac upload file dau tien de bat dau.'}
      </p>
      {hasFilters ? (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-4 py-2 text-sm font-medium text-neon-violet transition-colors hover:bg-neon-violet/20"
        >
          Xoa bo loc
        </button>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onAddLink}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/30 transition-all hover:opacity-90"
          >
            Them link
          </button>
          <button
            onClick={onAddFile}
            className="inline-flex items-center gap-2 rounded-xl border border-neon-emerald/40 bg-neon-emerald/10 px-4 py-2 text-sm font-semibold text-neon-emerald transition-colors hover:bg-neon-emerald/20"
          >
            Upload file
          </button>
        </div>
      )}
    </div>
  );
}
