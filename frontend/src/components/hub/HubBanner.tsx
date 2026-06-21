'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

interface HubBannerProps {
  bannerUrl: string | null;
  onUpload: (file: File) => Promise<void>;
}

export default function HubBanner({ bannerUrl, onUpload }: HubBannerProps) {
  const [uploading, setUploading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Chi chap nhan file hinh anh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Anh bia toi da 5MB');
      return;
    }
    setUploading(true);
    try {
      await onUpload(file);
      toast.success('Da cap nhat anh bia');
    } catch {
      toast.error('Khong the tai anh bia');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="relative mb-6 h-40 w-full overflow-hidden rounded-2xl border border-darkborder/50 bg-darkcard sm:h-48"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {bannerUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bannerUrl}
          alt="Hub banner"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon-indigo/20 via-neon-violet/10 to-neon-pink/20">
          <div className="text-center">
            <Sparkles className="mx-auto mb-2 h-8 w-8 text-neon-violet/50" />
            <p className="text-xs text-text-muted">Them anh bia</p>
          </div>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Upload button on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-black/60 px-4 py-2 text-sm font-semibold text-neon-violet backdrop-blur-md shadow-lg shadow-neon-violet/20 transition-all hover:bg-black/80"
        >
          <Camera className="h-4 w-4" />
          {uploading ? 'Dang tai...' : 'Doi anh bia'}
        </button>
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            void handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
