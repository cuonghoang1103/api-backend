'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fileApi } from '@/lib/api';

interface ThumbnailUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Set to true while a parent form is submitting — prevents accidental double-submit */
  disabled?: boolean;
}

export default function ThumbnailUploader({
  value,
  onChange,
  label = 'Ảnh đại diện dự án',
  disabled = false,
}: ThumbnailUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (disabled || uploading) return;
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const file = fileArray[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File quá lớn. Tối đa 10MB.');
      return;
    }

    setUploading(true);
    try {
      const res = await fileApi.upload(file, 'images');
        const url = res.data?.data?.url as string | undefined;
      if (url) {
        onChange(url);
        toast.success('Upload ảnh đại diện thành công!');
      } else {
        toast.error(res.data?.message || 'Upload thất bại. Vui lòng thử lại.');
      }
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message
        ?? (err as any)?.message
        ?? 'Upload thất bại. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const c = {
    primary: '#a855f7',
    border: 'rgba(168,85,247,0.2)',
    borderHover: 'rgba(168,85,247,0.45)',
    borderActive: 'rgba(168,85,247,0.6)',
    textMuted: '#64748b',
  };

  const hasImage = value && value.trim().length > 0 && value.startsWith('http');
  const isBusy = uploading || disabled;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>

      {hasImage ? (
        /* Preview mode */
        <div
          className="relative rounded-xl overflow-hidden border group"
          style={{ borderColor: c.border }}
        >
          <Image
            src={value}
            alt="Thumbnail"
            width={400}
            height={225}
            className="w-full h-40 object-cover"
            style={{ aspectRatio: '16/9' }}
          />
          {isBusy && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
          )}
          {!isBusy && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Đổi ảnh"
                disabled={disabled}
              >
                <Upload className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="w-9 h-9 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                title="Xóa ảnh"
                disabled={disabled}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
          />
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); if (!isBusy) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => { if (!isBusy) inputRef.current?.click(); }}
          className="relative flex flex-col items-center justify-center gap-2 py-7 rounded-xl border-2 border-dashed cursor-pointer transition-all"
          style={{
            borderColor: isBusy ? 'rgba(168,85,247,0.1)' : dragOver ? c.borderActive : c.border,
            background: dragOver ? `${c.primary}08` : 'rgba(255,255,255,0.02)',
            cursor: isBusy ? 'not-allowed' : 'pointer',
            opacity: isBusy ? 0.6 : 1,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
          />

          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: c.primary }} />
              <p className="text-sm" style={{ color: c.textMuted }}>Đang upload...</p>
            </>
          ) : disabled ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: c.primary }} />
              <p className="text-sm" style={{ color: c.textMuted }}>Đang xử lý...</p>
            </>
          ) : (
            <>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${c.primary}15` }}
              >
                <ImagePlus className="w-5 h-5" style={{ color: c.primary }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">
                  Kéo thả ảnh hoặc bấm để chọn
                </p>
                <p className="text-xs mt-1" style={{ color: c.textMuted }}>
                  PNG, JPG, WEBP • Tối đa 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL input fallback */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px" style={{ background: c.border }} />
        <span className="text-[10px]" style={{ color: c.textMuted }}>hoặc dán URL</span>
        <div className="flex-1 h-px" style={{ background: c.border }} />
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://images.unsplash.com/..."
        disabled={disabled}
        className="w-full px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors disabled:opacity-50"
      />
    </div>
  );
}
