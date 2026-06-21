'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Download, Loader2, FileText, FileCode, Image, Film,
  Music, Archive, File, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

import { hubFileApi, type HubFile } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubFilePreviewModalProps {
  file: HubFile | null;
  open: boolean;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: { status?: string; notes?: string; tags?: string[] }) => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  unread: { label: 'Chua doc', color: 'text-text-muted' },
  learning: { label: 'Dang hoc', color: 'text-neon-orange' },
  done: { label: 'Hoan thanh', color: 'text-neon-emerald' },
};

const MIME_CATEGORIES = {
  image: ['image/'],
  pdf: ['application/pdf'],
  video: ['video/'],
  audio: ['audio/'],
  code: [
    'text/plain', 'text/html', 'text/css', 'text/javascript',
    'application/json', 'application/xml', 'application/sql',
    'text/x-python', 'text/x-java', 'text/x-csrc', 'text/x-c++src',
  ],
};

function getFileCategory(mimeType: string): string {
  if (MIME_CATEGORIES.image.some(p => mimeType.startsWith(p))) return 'image';
  if (MIME_CATEGORIES.pdf.some(p => mimeType.startsWith(p))) return 'pdf';
  if (MIME_CATEGORIES.video.some(p => mimeType.startsWith(p))) return 'video';
  if (MIME_CATEGORIES.audio.some(p => mimeType.startsWith(p))) return 'audio';
  if (MIME_CATEGORIES.code.some(p => mimeType.startsWith(p))) return 'code';
  return 'other';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getLanguageFromMime(mimeType: string, name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx',
    py: 'python', java: 'java', sql: 'sql', json: 'json',
    xml: 'xml', html: 'html', css: 'css', md: 'markdown',
    sh: 'bash', ps1: 'powershell', go: 'go', rs: 'rust',
    c: 'c', cpp: 'cpp', cs: 'csharp', rb: 'ruby',
    php: 'php', swift: 'swift', kt: 'kotlin', dart: 'dart',
  };
  return map[ext] ?? 'text';
}

function FileIcon({ mimeType, size = 24 }: { mimeType: string; size?: number }) {
  const cat = getFileCategory(mimeType);
  const map: Record<string, React.ReactNode> = {
    image: <Image className={cn('text-neon-pink')} style={{ width: size, height: size }} />,
    pdf: <FileText className={cn('text-red-400')} style={{ width: size, height: size }} />,
    video: <Film className={cn('text-neon-violet')} style={{ width: size, height: size }} />,
    audio: <Music className={cn('text-neon-cyan')} style={{ width: size, height: size }} />,
    code: <FileCode className={cn('text-neon-emerald')} style={{ width: size, height: size }} />,
    other: <Archive className={cn('text-neon-orange')} style={{ width: size, height: size }} />,
  };
  return <>{map[cat] ?? <File className={cn('text-text-muted')} style={{ width: size, height: size }} />}</>;
}

export default function HubFilePreviewModal({
  file, open, onClose, onDelete, onUpdate,
}: HubFilePreviewModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [codeContent, setCodeContent] = useState<string | null>(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSignedUrl = useCallback(async (f: HubFile) => {
    setLoading(true);
    try {
      const res = await hubFileApi.getSignedUrl(f.id);
      setSignedUrl(res.data.data.url);
      // Refresh URL every 4 minutes to prevent expiry
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        void fetchSignedUrl(f);
      }, 4 * 60 * 1000);
    } catch (err) {
      console.error('[hub] getSignedUrl', err);
      toast.error('Khong tai duoc file');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open || !file) return;
    setCodeContent(null);
    setCurrentPage(1);
    void fetchSignedUrl(file);
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [open, file, fetchSignedUrl]);

  // Fetch and syntax-highlight code files
  useEffect(() => {
    if (!open || !file || getFileCategory(file.mimeType) !== 'code' || !signedUrl) return;
    setLoadingCode(true);
    fetch(signedUrl)
      .then(r => r.text())
      .then(t => setCodeContent(t))
      .catch(() => setCodeContent('// Khong the tai noi dung file'))
      .finally(() => setLoadingCode(false));
  }, [open, file, signedUrl]);

  const handleDownload = async () => {
    if (!signedUrl || !file) return;
    const a = document.createElement('a');
    a.href = signedUrl;
    a.download = file.name;
    a.click();
  };

  if (!file) return null;

  const category = getFileCategory(file.mimeType);
  const statusInfo = STATUS_LABELS[file.status] ?? STATUS_LABELS.unread;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          {/* Modal */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.32, 0.94, 0.6, 1] }}
              className="pointer-events-auto flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-darkborder/60 bg-[#0d0f18]/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon mimeType={file.mimeType} size={20} />
                  <div className="min-w-0">
                    <h2 className="truncate font-heading text-sm font-bold text-text-primary">
                      {file.name}
                    </h2>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                      <span>{formatBytes(file.size)}</span>
                      <span>|</span>
                      <span className={statusInfo.color}>{statusInfo.label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onUpdate && (
                    <select
                      value={file.status}
                      onChange={(e) => {
                        onUpdate(file.id, { status: e.target.value });
                        onClose();
                      }}
                      className="rounded-lg border border-darkborder bg-darkbg/60 px-2 py-1 text-xs text-text-secondary focus:border-neon-violet/50 focus:outline-none"
                    >
                      <option value="unread">Chua doc</option>
                      <option value="learning">Dang hoc</option>
                      <option value="done">Hoan thanh</option>
                    </select>
                  )}
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-neon-violet/15 px-3 py-1.5 text-xs font-semibold text-neon-violet transition-colors hover:bg-neon-violet/25"
                  >
                    <Download className="h-3.5 w-3.5" /> Tai ve
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Preview area */}
                <div className="flex flex-1 overflow-auto bg-black/30">
                  {loading && (
                    <div className="flex h-full w-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-neon-violet" />
                    </div>
                  )}

                  {!loading && category === 'image' && signedUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={signedUrl}
                      alt={file.name}
                      className="mx-auto max-h-full max-w-full object-contain"
                    />
                  )}

                  {!loading && category === 'pdf' && signedUrl && (
                    <iframe
                      src={signedUrl}
                      className="h-full w-full"
                      title={file.name}
                    />
                  )}

                  {!loading && category === 'video' && signedUrl && (
                    <div className="flex h-full w-full items-center justify-center bg-black/50">
                      <video
                        src={signedUrl}
                        controls
                        className="max-h-full max-w-full"
                      />
                    </div>
                  )}

                  {!loading && category === 'audio' && signedUrl && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black/30">
                      <FileIcon mimeType={file.mimeType} size={48} />
                      <audio
                        src={signedUrl}
                        controls
                        className="w-full max-w-md"
                      />
                    </div>
                  )}

                  {!loading && category === 'code' && (
                    loadingCode ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-neon-violet" />
                      </div>
                    ) : codeContent !== null ? (
                      <div className="relative h-full w-full overflow-auto">
                        <div className="relative">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="absolute left-2 top-2 z-10 rounded-lg bg-darkbg/80 p-1 text-text-muted hover:text-text-primary"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="absolute right-2 top-2 z-10 rounded-lg bg-darkbg/80 p-1 text-text-muted hover:text-text-primary"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                        <SyntaxHighlighter
                          language={getLanguageFromMime(file.mimeType, file.name)}
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            minHeight: '100%',
                            background: 'transparent',
                            fontSize: '12px',
                          }}
                          showLineNumbers
                          wrapLines
                        >
                          {codeContent}
                        </SyntaxHighlighter>
                      </div>
                    ) : null
                  )}

                  {!loading && category === 'other' && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                      <FileIcon mimeType={file.mimeType} size={64} />
                      <p className="text-sm text-text-secondary">
                        Khong xem truoc duoc dinh dang nay
                      </p>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/30 transition-all hover:opacity-90"
                      >
                        <Download className="h-4 w-4" /> Tai ve may
                      </button>
                    </div>
                  )}
                </div>

                {/* Sidebar: metadata */}
                <div className="w-64 shrink-0 overflow-y-auto border-l border-white/[0.06] p-4">
                  <div className="space-y-4">
                    {/* Tags */}
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                        Tags
                      </p>
                      {file.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {file.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-[10px] text-text-secondary"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-text-muted">Chua co tag</p>
                      )}
                    </div>

                    {/* Notes */}
                    {file.notes && (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                          Ghi chu
                        </p>
                        <p className="whitespace-pre-wrap text-xs text-text-secondary">
                          {file.notes}
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2 rounded-xl border border-darkborder/50 bg-darkbg/40 p-3">
                      <MetaRow label="Dinh dang" value={file.mimeType} />
                      <MetaRow label="Kich thuoc" value={formatBytes(file.size)} />
                      <MetaRow
                        label="Tai len"
                        value={new Date(file.createdAt).toLocaleDateString('vi-VN')}
                      />
                    </div>

                    {/* Delete */}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm(`Xoa file "${file.name}"?`)) {
                            onDelete(file.id);
                            onClose();
                          }
                        }}
                        className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/20"
                      >
                        Xoa file
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-text-muted">{label}</span>
      <span className="text-text-secondary">{value}</span>
    </div>
  );
}
