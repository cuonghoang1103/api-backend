'use client';

/**
 * HubSharedItemViewer — recipient-side modal to view (and
 * optionally download) an item shared with the current user.
 *
 * Opens when the user clicks a row in HubSharedWithMe's inbox.
 * Resolves the underlying folder/link/file via
 * `GET /hub/shares/:id/item`, then renders it read-only:
 *   - Folder  → flat list of links + files inside, no add/edit
 *   - Link    → clickable URL + metadata card
 *   - File    → metadata card + Download button (only if
 *               permission = view_download; for view-only shares
 *               the button is replaced by a "View-only" badge)
 *
 * Why separate from the owner-side modals: the existing
 * HubFilePreviewModal / HubAddLinkModal both assume the caller
 * is the owner and bake edit affordances in. A dedicated
 * viewer keeps the read-only UX consistent and avoids touching
 * those large owner-side components.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, FileText, FolderOpen, X, Download, Eye,
  ExternalLink, Loader2, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  hubShareApi,
  type HubShare, type HubShareFileMini,
  type HubLink, type HubFile, type HubFolder,
} from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubSharedItemViewerProps {
  share: HubShare | null;
  open: boolean;
  onClose: () => void;
}

export default function HubSharedItemViewer({
  share, open, onClose,
}: HubSharedItemViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<{ kind: 'folder' | 'link' | 'file'; data: any } | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Load the underlying item whenever a different share is opened.
  useEffect(() => {
    if (!open || !share) return;
    setLoading(true);
    setError(null);
    setItem(null);
    hubShareApi.getSharedItem(share.id)
      .then((r) => {
        const data = r.data.data as {
          share: HubShare;
          folder?: HubFolder | null;
          link?: HubLink | null;
          file?: HubFile | null;
        };
        if (data.folder) setItem({ kind: 'folder', data: data.folder });
        else if (data.link) setItem({ kind: 'link', data: data.link });
        else if (data.file) setItem({ kind: 'file', data: data.file });
        else setError('Item khong con ton tai hoac da bi xoa boi nguoi share.');
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message ?? 'Khong the tai item');
      })
      .finally(() => setLoading(false));
  }, [open, share?.id]);

  const handleDownload = async () => {
    if (!item || item.kind !== 'file' || !share) return;
    if (share.permission !== 'view_download') {
      toast.error('Share nay chi cho phep xem, khong the download');
      return;
    }
    setDownloading(true);
    try {
      const r = await hubShareApi.getSharedFileUrl(item.data.id);
      // Trigger download via a hidden link — same trick the
      // owner-side HubFileCard uses.
      const a = document.createElement('a');
      a.href = r.data.data.url;
      a.download = item.data.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Bat dau download');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Khong the download';
      toast.error(msg);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && share && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-darkborder/60 px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="text-neon-violet">
                  {item?.kind === 'folder' ? <FolderOpen className="h-5 w-5" /> :
                   item?.kind === 'link' ? <Link2 className="h-5 w-5" /> :
                   item?.kind === 'file' ? <FileText className="h-5 w-5" /> :
                   <Loader2 className="h-5 w-5 animate-spin" />}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-text-primary">
                    {item?.data?.name ?? item?.data?.title ?? (loading ? 'Dang tai...' : 'Item')}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span>Shared by</span>
                    <span className="font-medium text-text-secondary">@{share.owner.username}</span>
                    <span>·</span>
                    <PermissionInline permission={share.permission} />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                aria-label="Dong"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[calc(85vh-100px)] overflow-y-auto px-5 py-4">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-neon-violet" />
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              {!loading && !error && item && (
                <>
                  {share.note && (
                    <div className="mb-4 rounded-xl border border-neon-violet/30 bg-neon-violet/5 p-3 text-sm text-text-secondary">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neon-violet/80">Loi nhan</span>
                      <p className="mt-1 italic">&ldquo;{share.note}&rdquo;</p>
                    </div>
                  )}
                  {item.kind === 'folder' && <FolderView folder={item.data} />}
                  {item.kind === 'link' && <LinkView link={item.data} />}
                  {item.kind === 'file' && (
                    <FileView
                      file={item.data}
                      canDownload={share.permission === 'view_download'}
                      onDownload={handleDownload}
                      downloading={downloading}
                    />
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-darkborder/60 bg-darkbg/40 px-5 py-3 text-center text-[11px] text-text-muted">
              Ban chi co quyen xem. Moi thay doi can lien he chu so huu.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PermissionInline({ permission }: { permission: 'view' | 'view_download' }) {
  if (permission === 'view_download') {
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-400">
        <Download className="h-3 w-3" />
        Xem + download
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-blue-400">
      <Eye className="h-3 w-3" />
      Chi xem
    </span>
  );
}

function FolderView({ folder }: { folder: HubFolder & { links?: HubLink[]; files?: HubFile[] } }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-darkborder bg-darkcard/40 p-3">
        <div className="flex items-center gap-2 text-text-primary">
          <FolderOpen className="h-4 w-4 text-neon-violet" />
          <span className="font-semibold">{folder.name}</span>
        </div>
      </div>

      {folder.links && folder.links.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Links ({folder.links.length})
          </div>
          <ul className="space-y-1.5">
            {folder.links.map((l) => (
              <li key={l.id}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-darkborder bg-darkbg/40 px-3 py-2 transition-colors hover:border-neon-violet/40"
                >
                  {l.faviconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.faviconUrl} alt="" className="h-4 w-4 shrink-0 rounded" />
                  ) : (
                    <Link2 className="h-4 w-4 shrink-0 text-neon-violet" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-text-primary">{l.title}</div>
                    <div className="truncate text-[10px] text-text-muted">{l.url}</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {folder.files && folder.files.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Files ({folder.files.length})
          </div>
          <ul className="space-y-1.5">
            {folder.files.map((f) => (
              <li key={f.id} className="flex items-center gap-2 rounded-xl border border-darkborder bg-darkbg/40 px-3 py-2">
                <FileText className="h-4 w-4 shrink-0 text-neon-violet" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-text-primary">{f.name}</div>
                  <div className="text-[10px] text-text-muted">
                    {(f.size / 1024).toFixed(1)} KB · {f.mimeType.split('/')[1]?.toUpperCase() ?? 'FILE'}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(!folder.links || folder.links.length === 0) && (!folder.files || folder.files.length === 0) && (
        <p className="text-center text-sm text-text-muted py-6">Folder trong.</p>
      )}
    </div>
  );
}

function LinkView({ link }: { link: HubLink }) {
  return (
    <div className="space-y-3">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl border border-darkborder bg-darkcard/40 transition-colors hover:border-neon-violet/40"
      >
        {link.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnailUrl}
            alt=""
            className="h-40 w-full object-cover"
          />
        )}
        <div className="p-4">
          <div className="mb-1 flex items-center gap-2">
            {link.faviconUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={link.faviconUrl} alt="" className="h-4 w-4 rounded" />
            )}
            <h3 className="truncate text-base font-semibold text-text-primary">{link.title}</h3>
          </div>
          {link.description && (
            <p className="line-clamp-3 text-sm text-text-secondary">{link.description}</p>
          )}
          <div className="mt-2 truncate text-xs text-text-muted">{link.url}</div>
        </div>
      </a>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/20 transition-opacity hover:opacity-90"
      >
        <ExternalLink className="h-4 w-4" />
        Mo link
      </a>
    </div>
  );
}

function FileView({
  file, canDownload, onDownload, downloading,
}: {
  file: HubFile;
  canDownload: boolean;
  onDownload: () => void;
  downloading: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl border border-darkborder bg-darkcard/40 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neon-violet/15 text-neon-violet">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold text-text-primary">{file.name}</div>
          <div className="text-xs text-text-muted">
            {(file.size / 1024).toFixed(1)} KB · {file.mimeType}
          </div>
        </div>
      </div>
      {canDownload ? (
        <button
          onClick={onDownload}
          disabled={downloading}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neon-violet/20 transition-opacity hover:opacity-90 disabled:opacity-50',
          )}
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download
        </button>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm text-blue-400">
          <Eye className="h-4 w-4" />
          Share nay chi cho phep xem, khong the download
        </div>
      )}
    </div>
  );
}