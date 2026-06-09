'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  folder?: string;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export default function ImageUpload({
  value,
  onChange,
  label = 'Upload Image',
  accept = 'image/*',
  maxSizeMB = 5,
  folder = 'courses',
}: ImageUploadProps) {
  const [state, setState] = useState<UploadState>(value ? 'success' : 'idle');
  const [preview, setPreview] = useState<string>(value || '');
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);


  const uploadToBackend = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'images');

    const res = await fetch('/api/v1/files/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message || 'Upload failed');
    }

    const data = await res.json();
    return data?.data?.url || null;
  }, [folder]);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setState('uploading');
    setErrorMsg('');

    try {
      const url = await uploadToBackend(file);
      if (url) {
        onChange(url);
        setState('success');
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMsg(msg);
      setState('error');
      toast.error(msg);
    }
  }, [uploadToBackend, onChange, maxSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    setPreview('');
    setState('idle');
    setErrorMsg('');
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRetry = () => {
    setState('idle');
    setErrorMsg('');
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {state === 'idle' || state === 'error' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center ${
            dragOver
              ? 'border-neon-violet bg-neon-violet/5'
              : state === 'error'
              ? 'border-red-500/40 bg-red-500/5'
              : 'border-darkborder bg-darkbg/50 hover:border-neon-violet/40 hover:bg-darkbg'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            {state === 'error' ? (
              <>
                <AlertCircle className="w-10 h-10 text-red-400" />
                <p className="text-sm text-red-400">{errorMsg || 'Upload failed'}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRetry(); }}
                  className="text-xs text-neon-violet hover:text-neon-indigo transition-colors"
                >
                  Try again
                </button>
              </>
            ) : (
              <>
                <Upload className={`w-10 h-10 ${dragOver ? 'text-neon-violet' : 'text-text-muted'}`} />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Drop image here or <span className="text-neon-violet">click to browse</span>
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {accept === 'image/*' ? 'PNG, JPG, WEBP' : accept} up to {maxSizeMB}MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : state === 'uploading' ? (
        <div className="relative border border-darkborder rounded-xl p-4 flex items-center gap-4 bg-darkbg/50">
          {preview && (
            <img src={preview} alt="Preview" className="w-20 h-20 rounded-lg object-cover shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary mb-1">Uploading...</p>
            <div className="h-1.5 bg-darkborder rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet rounded-full animate-pulse w-2/3" />
            </div>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-neon-violet shrink-0" />
        </div>
      ) : (
        <div className="relative border border-green-500/30 bg-green-500/5 rounded-xl p-4 flex items-center gap-4">
          {preview ? (
            <img src={preview} alt="Uploaded" className="w-20 h-20 rounded-lg object-cover shrink-0" />
          ) : value ? (
            <img src={value} alt="Uploaded" className="w-20 h-20 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-darkbg flex items-center justify-center shrink-0">
              <ImageIcon className="w-8 h-8 text-text-muted" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <p className="text-sm text-green-400 font-medium">Uploaded successfully</p>
            </div>
            <p className="text-xs text-text-muted truncate">{value}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-violet transition-colors"
              title="Replace image"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
