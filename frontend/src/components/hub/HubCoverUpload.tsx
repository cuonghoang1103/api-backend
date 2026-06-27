'use client';

/**
 * HubCoverUpload — small reusable "upload a cover image" widget
 * used inside HubAddLinkModal, HubFilePreviewModal, and the
 * HubFolderDialog. Renders a square preview (when a URL is set)
 * with three actions overlaid:
 *   - Change (replace): opens a file picker
 *   - Clear (×): resets to null
 *   - (drag-drop also supported on the preview area)
 *
 * Files are uploaded through the existing /files/upload
 * endpoint (POST multipart/form-data, category=images) which
 * routes them to the R2 bucket + image optimizer. The returned
 * URL is stored on the item (HubFolder.coverImageUrl /
 * HubLink.coverImageUrl / HubFile.coverImageUrl).
 *
 * Why a separate component instead of inlining in each modal?
 * The three call sites share ~90% of the UI: preview, picker,
 * clear button, upload spinner, error toast. Extracting keeps
 * each modal focused on its own flow and ensures the UX is
 * consistent across all three (and the upload logic — file
 * size / type validation, progress text — lives in one place).
 *
 * Validation:
 *   - max 8 MB (matches the server's multer limit for images)
 *   - mime: image/* only (jpeg/png/webp/gif)
 *   - reason: bigger images aren't useful for a card cover, and
 *     non-images would silently fail the optimizer on the server.
 *
 * Bounded: zero new server endpoints (reuses /files/upload which
 * the admin tech-trends page already uses — see
 * frontend/src/lib/api.ts fileApi.upload).
 */

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, X, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { fileApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface HubCoverUploadProps {
  /** Current cover URL — null when not set. */
  value: string | null;
  /** Called with the new URL after a successful upload, or
   *  null when the user clears the cover. */
  onChange: (url: string | null) => void;
  /** Used for the "Alt" text on the preview image (falls back
   *  to a generic Vietnamese label when empty). */
  label?: string;
}

export default function HubCoverUpload({ value, onChange, label }: HubCoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Chi ho tro anh jpeg/png/webp/gif');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Anh qua lon (toi da 8MB)');
      return;
    }
    setUploading(true);
    try {
      const r = await fileApi.upload(file);
      onChange(r.data.data.url);
      toast.success('Da upload anh bia');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Khong the upload anh';
      toast.error(msg);
    } finally {
      setUploading(false);
      // Reset the input so picking the SAME file again still fires
      // the change event (browsers dedupe otherwise).
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Anh bia
        </span>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1 text-[11px] text-text-muted transition-colors hover:text-red-400"
            title="Xoa anh bia"
          >
            <X className="h-3 w-3" /> Xoa
          </button>
        )}
      </div>

      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={cn(
          'group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all',
          value
            ? 'border-darkborder bg-darkbg'
            : 'border-darkborder/60 bg-darkbg/40 hover:border-neon-violet/40',
          dragOver && 'border-neon-violet bg-neon-violet/10',
        )}
      >
        {uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-neon-violet" />
            <span className="text-xs text-text-secondary">Dang upload...</span>
          </div>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label ?? 'Cover'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              onError={(e) => {
                // If R2 returns 404/expired, hide the broken image
                // and fall back to the empty state. Doesn't clear
                // the URL — the user might be on a flaky connection.
                (e.currentTarget as HTMLImageElement).style.opacity = '0';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <Upload className="h-3.5 w-3.5" /> Thay anh
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-muted">
            <ImagePlus className="h-7 w-7" />
            <span className="text-xs font-medium">Upload anh bia</span>
            <span className="text-[10px] text-text-muted">
              Hoac keo tha vao day · jpeg/png/webp/gif · toi da 8MB
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
        />
      </motion.div>
    </div>
  );
}
