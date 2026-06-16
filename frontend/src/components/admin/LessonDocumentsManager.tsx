'use client';

import { useEffect, useState, useRef } from 'react';
import { Download, FileText, Loader2, Trash2, Upload } from 'lucide-react';
import { coursesApi } from '@/lib/api';
import { toast } from 'sonner';

interface DocumentItem {
  id: number;
  title: string;
  fileUrl: string;
  fileSizeBytes: number;
  fileType?: string | null;
  downloadCount: number;
  createdAt?: string;
}

interface LessonDocumentsManagerProps {
  lessonId: number;
  initialDocuments?: DocumentItem[];
}

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB — must match backend multer limit

// Map a filename to a human-friendly icon. We don't pull in
// a giant mime-type table; the extension is enough for the
// common cases.
function pickFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '📦';
  if (['pdf'].includes(ext)) return '📕';
  if (['doc', 'docx'].includes(ext)) return '📘';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📗';
  if (['ppt', 'pptx'].includes(ext)) return '📙';
  if (['txt', 'md'].includes(ext)) return '📄';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️';
  return '📄';
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v >= 10 ? 0 : 1)} ${units[i]}`;
}

export default function LessonDocumentsManager({ lessonId, initialDocuments = [] }: LessonDocumentsManagerProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Whenever the admin switches to a different lesson, reset
  // the list to the new lesson's documents. The parent passes
  // `initialDocuments` from the lesson payload.
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [lessonId, initialDocuments]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Client-side pre-flight — the server enforces the same
    // limit but failing fast gives a clearer error message
    // and skips the round-trip for huge files.
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File quá lớn (${formatBytes(file.size)}). Giới hạn 20 MB.`);
      return;
    }

    setUploading(true);
    try {
      const res = await coursesApi.uploadDocument(lessonId, file, file.name);
      const created = res.data?.data as DocumentItem;
      if (created) {
        setDocuments((prev) => [...prev, created]);
        toast.success('Upload thành công');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Upload thất bại';
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (doc: DocumentItem) => {
    if (!window.confirm(`Xoá "${doc.title}"?`)) return;
    try {
      await coursesApi.deleteDocument(doc.id);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      toast.success('Đã xoá');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Xoá thất bại';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-text-primary flex items-center gap-2">
          <FileText className="w-5 h-5 text-neon-violet" /> Tài liệu đính kèm
        </h2>
        <span className="text-xs text-text-muted">
          {documents.length} file{documents.length === 1 ? '' : 's'} • tối đa 20 MB / file
        </span>
      </div>

      {/* Upload dropzone — clicking it opens the file picker.
          The drag-and-drop behaviour is intentionally minimal:
          the input is the only entry point so we don't have
          to manage drag counter state. */}
      <div className="mb-4">
        <label
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            uploading
              ? 'border-neon-violet/40 bg-neon-violet/5 cursor-wait'
              : 'border-darkborder hover:border-neon-violet/50 hover:bg-white/[0.02]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
            // No `accept` attribute — the user wants to upload
            // zip/doc/pdf/etc and we don't want to whitelist
            // a fixed set that would have to be updated every
            // time a new file type is supported.
          />
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-neon-violet" />
              <span className="text-sm text-text-secondary">Đang upload…</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-secondary">
                Click để upload file (zip, doc, pdf, …)
              </span>
            </>
          )}
        </label>
      </div>

      {/* Document list */}
      {documents.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">
          Chưa có tài liệu nào. Upload file để học viên tải về.
        </p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 bg-darkbg rounded-xl border border-darkborder/40 hover:border-darkborder/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-neon-indigo/10 flex items-center justify-center text-lg shrink-0">
                {pickFileIcon(doc.title)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {doc.title}
                </p>
                <p className="text-xs text-text-muted">
                  {formatBytes(doc.fileSizeBytes)} • {doc.downloadCount} lượt tải
                </p>
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-muted hover:text-neon-indigo hover:bg-white/5 transition-colors"
                title="Mở file"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => handleDelete(doc)}
                className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Xoá"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
