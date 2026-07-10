'use client';

import { useEffect, useState, useRef } from 'react';
import { Download, FileText, Link2, Loader2, Trash2, Upload } from 'lucide-react';
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
  // Provide exactly one: a lesson-level manager (lessonId) or the
  // course-level "Tài liệu" area (courseId). Course mode loads its own
  // documents on mount via the API.
  lessonId?: number;
  courseId?: number;
  initialDocuments?: DocumentItem[];
}

const MAX_SIZE_BYTES = 150 * 1024 * 1024; // 150 MB — matches backend DOC_MAX_BYTES

function isLinkDoc(doc: DocumentItem): boolean {
  return doc.fileType === 'link';
}

// Map a filename to a human-friendly icon.
function pickFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '📦';
  if (['pdf'].includes(ext)) return '📕';
  if (['doc', 'docx'].includes(ext)) return '📘';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📗';
  if (['ppt', 'pptx'].includes(ext)) return '📙';
  if (['txt', 'md'].includes(ext)) return '📄';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️';
  if (['mp4', 'mov', 'webm', 'mkv'].includes(ext)) return '🎬';
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

export default function LessonDocumentsManager({ lessonId, courseId, initialDocuments = [] }: LessonDocumentsManagerProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Course mode: fetch the course's documents ONCE per course. Depends
  // only on `courseId` — NOT on `initialDocuments`, whose default `[]` is a
  // fresh reference every render and would otherwise loop the fetch forever.
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    coursesApi
      .getCourseDocuments(courseId)
      .then((r) => { if (!cancelled) setDocuments((r.data?.data as DocumentItem[]) ?? []); })
      .catch(() => { if (!cancelled) setDocuments([]); });
    return () => { cancelled = true; };
  }, [courseId]);

  // Lesson mode: mirror the list the parent loaded from the lesson payload.
  useEffect(() => {
    if (courseId) return;
    setDocuments(initialDocuments);
  }, [lessonId, courseId, initialDocuments]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File quá lớn (${formatBytes(file.size)}). Giới hạn 150 MB.`);
      return;
    }

    setUploading(true);
    setUploadPct(0);
    try {
      // Direct-to-R2 (presign → PUT → register). Progress from the R2 PUT.
      const onProg = (f: number) => setUploadPct(Math.round(f * 100));
      const res = courseId
        ? await coursesApi.uploadCourseDocumentDirect(courseId, file, file.name, onProg)
        : await coursesApi.uploadDocumentDirect(lessonId!, file, file.name, onProg);
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
      setUploadPct(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleAddLink = async () => {
    const url = linkUrl.trim();
    if (!/^https?:\/\/.+/i.test(url)) {
      toast.error('Dán link http(s) hợp lệ (vd Google Drive)');
      return;
    }
    setAddingLink(true);
    try {
      const res = courseId
        ? await coursesApi.addCourseDocumentLink(courseId, linkTitle.trim() || 'Tài liệu', url)
        : await coursesApi.addDocumentLink(lessonId!, linkTitle.trim() || 'Tài liệu', url);
      const created = res.data?.data as DocumentItem;
      if (created) {
        setDocuments((prev) => [...prev, created]);
        setLinkTitle('');
        setLinkUrl('');
        toast.success('Đã thêm link');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Thêm link thất bại';
      toast.error(msg);
    } finally {
      setAddingLink(false);
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
          {documents.length} mục • file tối đa 150 MB
        </span>
      </div>

      {/* ── Add a Google Drive / external link ─────────────────── */}
      <div className="mb-3 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={linkTitle}
          onChange={(e) => setLinkTitle(e.target.value)}
          placeholder="Tên tài liệu (vd: Slide + Source)"
          className="sm:w-56 px-3 py-2 rounded-xl bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
        />
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="Dán link Google Drive / URL…"
          className="flex-1 px-3 py-2 rounded-xl bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddLink}
          disabled={addingLink || !linkUrl.trim()}
          className="px-4 py-2 rounded-xl bg-neon-indigo/15 text-neon-indigo text-sm font-medium hover:bg-neon-indigo/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {addingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
          Thêm link
        </button>
      </div>

      {/* ── Upload a file (direct to R2, up to 150MB, any type) ── */}
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
          />
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-neon-violet" />
              <span className="text-sm text-text-secondary">Đang upload… {uploadPct}%</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-secondary">
                Click để upload file (zip, rar, doc, pdf, mp4, … tối đa 150 MB)
              </span>
            </>
          )}
        </label>
        {uploading && (
          <div className="mt-2 h-1.5 rounded-full bg-darkborder overflow-hidden">
            <div
              className="h-full bg-neon-violet transition-[width] duration-150"
              style={{ width: `${uploadPct}%` }}
            />
          </div>
        )}
      </div>

      {/* Document list */}
      {documents.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">
          Chưa có tài liệu nào. Thêm link hoặc upload file để học viên tải về.
        </p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const link = isLinkDoc(doc);
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 bg-darkbg rounded-xl border border-darkborder/40 hover:border-darkborder/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-neon-indigo/10 flex items-center justify-center text-lg shrink-0">
                  {link ? '🔗' : pickFileIcon(doc.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{doc.title}</p>
                  <p className="text-xs text-text-muted truncate">
                    {link
                      ? doc.fileUrl
                      : `${formatBytes(doc.fileSizeBytes)} • ${doc.downloadCount} lượt tải`}
                  </p>
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-text-muted hover:text-neon-indigo hover:bg-white/5 transition-colors"
                  title={link ? 'Mở link' : 'Mở file'}
                >
                  {link ? <Link2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
