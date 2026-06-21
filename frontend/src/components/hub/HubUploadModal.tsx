'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Upload, FileText, Loader2, Sparkles, CheckCircle2,
  AlertCircle, Plus, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { hubFileApi, type HubFile, type HubFolder } from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubUploadModalProps {
  open: boolean;
  folders: HubFolder[];
  onClose: () => void;
  onUploaded: (file: HubFile) => void;
}

type UploadState = 'idle' | 'uploading' | 'ai-tagging' | 'done' | 'error';
type FileEntry = {
  id: string;
  file: File;
  state: UploadState;
  progress: number;
  error?: string;
  suggestedTags?: string[];
  selectedTags: string[];
  key?: string;
};

export default function HubUploadModal({ open, folders, onClose, onUploaded }: HubUploadModalProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [folderId, setFolderId] = useState<number | ''>('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((rawFiles: FileList | File[]) => {
    const newEntries: FileEntry[] = Array.from(rawFiles).map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      state: 'idle' as UploadState,
      progress: 0,
      selectedTags: [],
    }));
    setFiles((prev) => [...prev, ...newEntries]);
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const uploadAll = async () => {
    if (files.length === 0) return;

    const uploadedFiles: HubFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      if (entry.state !== 'idle') continue;

      setFiles((prev) =>
        prev.map((f) => (f.id === entry.id ? { ...f, state: 'uploading' as UploadState, progress: 10 } : f)),
      );

      try {
        // Step 1: Get presigned URL
        const presignRes = await hubFileApi.presign({
          name: entry.file.name,
          mimeType: entry.file.type || 'application/octet-stream',
        });
        const { uploadUrl, key } = presignRes.data.data;

        setFiles((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, progress: 30 } : f)),
        );

        // Step 2: Upload directly to R2
        await fetch(uploadUrl, {
          method: 'PUT',
          body: entry.file,
          headers: { 'Content-Type': entry.file.type || 'application/octet-stream' },
        });

        setFiles((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, progress: 60 } : f)),
        );

        // Step 3: Register file in DB (capture response directly)
        const createRes = await hubFileApi.create({
          key,
          name: entry.file.name,
          mimeType: entry.file.type || 'application/octet-stream',
          size: entry.file.size,
          folderId: folderId === '' ? null : folderId,
        });
        const createdFile = createRes.data.data;
        uploadedFiles.push(createdFile);

        setFiles((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, state: 'ai-tagging' as UploadState, progress: 80 } : f)),
        );

        // Step 4: AI auto-tag using the file we already have
        try {
          const tagRes = await hubFileApi.aiSuggestTags(createdFile.id);
          const tags = tagRes.data.data.tags ?? [];
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, state: 'done' as UploadState, progress: 100, suggestedTags: tags, selectedTags: tags }
                : f,
            ),
          );
          if (tags.length > 0) {
            await hubFileApi.update(createdFile.id, { tags });
          }
        } catch {
          setFiles((prev) =>
            prev.map((f) => (f.id === entry.id ? { ...f, state: 'done' as UploadState, progress: 100 } : f)),
          );
        }
      } catch (err) {
        console.error('[hub] upload', err);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === entry.id
              ? { ...f, state: 'error' as UploadState, error: 'Upload that bai' }
              : f,
          ),
        );
      }
    }

    const allDone = files.every((f) => f.state === 'done' || f.state === 'error');
    const doneCount = files.filter((f) => f.state === 'done').length;
    if (allDone && doneCount > 0) {
      toast.success(`Da tai len ${doneCount} file`);
      uploadedFiles.forEach((f) => onUploaded(f));
    }
  };

  const allIdle = files.length > 0 && files.every((f) => f.state === 'idle');
  const hasUploading = files.some((f) => f.state === 'uploading' || f.state === 'ai-tagging');

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.32, 0.94, 0.6, 1] }}
              className="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-darkborder/60 bg-[#0d0f18]/95 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-emerald/15">
                    <Upload className="h-4 w-4 text-neon-emerald" />
                  </div>
                  <h2 className="font-heading text-base font-bold text-text-primary">Upload Files</h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Folder selector */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                    Luu vao thu muc
                  </label>
                  <select
                    value={folderId === '' ? '' : String(folderId)}
                    onChange={(e) => setFolderId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full appearance-none rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary focus:border-neon-violet/50 focus:outline-none"
                  >
                    <option value="">Chua phan loai</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                    'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all',
                    isDragging
                      ? 'border-neon-violet bg-neon-violet/10'
                      : 'border-darkborder hover:border-neon-violet/50 hover:bg-darkcard/30',
                  )}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Upload className={cn('mb-3 h-10 w-10', isDragging ? 'text-neon-violet' : 'text-text-muted')} />
                  <p className="mb-1 text-sm font-semibold text-text-primary">
                    {isDragging ? 'Tha file vao day' : 'Keo tha file hoac click de chon'}
                  </p>
                  <p className="text-xs text-text-muted">
                    PDF, DOCX, ZIP, Code, Hinh anh, Video... tat ca dinh dang deu duoc
                  </p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 rounded-xl border border-darkborder/50 bg-darkbg/40 p-3"
                      >
                        <FileText className="h-5 w-5 shrink-0 text-neon-violet" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-text-primary">{entry.file.name}</p>
                          <p className="text-[10px] text-text-muted">
                            {(entry.file.size / 1024).toFixed(1)} KB
                            {entry.suggestedTags && entry.suggestedTags.length > 0 && (
                              <span className="ml-2 text-neon-emerald">
                                <Sparkles className="inline h-2.5 w-2.5" /> AI tags: {entry.suggestedTags.slice(0, 5).join(', ')}
                              </span>
                            )}
                          </p>
                          {entry.error && (
                            <p className="text-[10px] text-red-400">{entry.error}</p>
                          )}
                          {entry.state === 'uploading' || entry.state === 'ai-tagging' ? (
                            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-darkborder">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-neon-indigo to-neon-violet transition-all"
                                style={{ width: `${entry.progress}%` }}
                              />
                            </div>
                          ) : null}
                        </div>
                        <div className="shrink-0">
                          {entry.state === 'idle' && (
                            <button
                              onClick={() => removeFile(entry.id)}
                              className="rounded p-1 text-text-muted hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {entry.state === 'uploading' && (
                            <Loader2 className="h-4 w-4 animate-spin text-neon-violet" />
                          )}
                          {entry.state === 'ai-tagging' && (
                            <Loader2 className="h-4 w-4 animate-spin text-neon-emerald" />
                          )}
                          {entry.state === 'done' && (
                            <CheckCircle2 className="h-4 w-4 text-neon-emerald" />
                          )}
                          {entry.state === 'error' && (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] bg-black/20 px-5 py-3">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-darkborder bg-darkcard/60 px-4 py-2 text-xs text-secondary hover:text-text-primary"
                >
                  Huy
                </button>
                <button
                  onClick={() => { void uploadAll(); }}
                  disabled={!allIdle || files.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-neon-violet/30 transition-all hover:opacity-90 disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Tai len {files.length > 0 ? `(${files.length})` : ''}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
