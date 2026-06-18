'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  LogIn,
  Send,
  Volume2,
  VolumeX,
  Upload,
  RotateCcw,
  Play,
  Check,
  AlertCircle,
  Heart,
  Crown,
} from 'lucide-react';
import {
  usePreferencesStore,
  SOUND_KINDS,
  ALL_KINDS,
  type SoundKind,
} from '@/store/preferencesStore';
import {
  saveSound,
  getSound,
  deleteSound,
  type SoundRecord,
} from '@/lib/soundStorage';
import { testSound, invalidateCustomSoundCache } from '@/lib/sound';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Bell,
  MessageCircle,
  LogIn,
  Send,
  Heart,
  Crown,
};

// Display name of the bundled default MP3 for each kind. Shown in
// the UI as "Đang dùng mặc định: <name>" so the user can see at a
// glance which file is currently configured before they upload
// their own.
const DEFAULT_FILE_NAMES: Record<SoundKind, string> = {
  message: 'tin_nhan_moi_chua_doc.mp3',
  notification: 'co_thong_bao_moi.mp3',
  'admin-notification': 'shikabukiste_yatta.mp3',
  login: 'co_thong_bao_moi.mp3',
  post: 'dang_bai_post_thanh_cong.mp3',
  like: 'moon_drop.mp3',
};

// Allowed mime types. The extension check below is the real
// guard — we accept anything the browser can decode as <audio>.
const ACCEPTED_EXTS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB — IndexedDB has plenty of room but we don't need huge files

interface KindRowProps {
  kind: SoundKind;
}

function KindRow({ kind }: KindRowProps) {
  const meta = SOUND_KINDS[kind];
  const Icon = ICON_MAP[meta.icon] ?? Bell;

  const enabled = usePreferencesStore((s) => s.enabled[kind]);
  const setKindEnabled = usePreferencesStore((s) => s.setKindEnabled);
  const customFileName = usePreferencesStore((s) => s.customFileName[kind]);
  const setCustomFileName = usePreferencesStore((s) => s.setCustomFileName);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedTick, setSavedTick] = useState(0); // visual "Saved!" feedback

  // Re-read the actual file from IndexedDB on mount so the UI
  // shows the persisted file name even if the user navigated away
  // and came back. The store's `customFileName` field is the
  // "last known good" copy; this is the source of truth check.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rec = await getSound(kind);
      if (cancelled) return;
      if (!rec && customFileName) {
        // IndexedDB was cleared (private mode reset, etc.) but
        // localStorage still remembers a name — drop the name.
        setCustomFileName(kind, '');
      } else if (rec && rec.name !== customFileName) {
        setCustomFileName(kind, rec.name);
      }
    })();
    return () => { cancelled = true; };
    // Run once per mount; we don't want a stale `customFileName`
    // dependency to re-run on every state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);

    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) {
      setError(`Định dạng không hỗ trợ. Chỉ chấp nhận: ${ACCEPTED_EXTS.join(', ')}`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`File quá lớn (tối đa ${Math.round(MAX_BYTES / 1024 / 1024)}MB)`);
      return;
    }
    setUploading(true);
    try {
      const rec: SoundRecord = {
        id: kind,
        name: file.name,
        blob: file,
        type: file.type || 'audio/mpeg',
        updatedAt: Date.now(),
      };
      await saveSound(rec);
      // Force the sound service to re-read the blob on next play
      invalidateCustomSoundCache(kind);
      setCustomFileName(kind, file.name);
      setSavedTick((t) => t + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi khi lưu file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = async () => {
    setError(null);
    try {
      await deleteSound(kind);
      invalidateCustomSoundCache(kind);
      setCustomFileName(kind, '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi khi xóa');
    }
  };

  const handleTest = async () => {
    setError(null);
    try {
      await testSound(kind, 0.7);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi khi phát thử');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 backdrop-blur-md"
      style={{
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(139,92,246,0.2)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(236,72,153,0.25))',
            border: '1px solid rgba(139,92,246,0.3)',
          }}
        >
          <Icon className="w-5 h-5 text-violet-300" />
        </div>

        {/* Title + description + controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-semibold text-white">{meta.label}</h3>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setKindEnabled(kind, e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-9 h-5 rounded-full relative transition-colors"
                style={{
                  background: enabled ? 'rgba(139,92,246,0.8)' : 'rgba(148,163,184,0.3)',
                }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: enabled ? 'translateX(18px)' : 'translateX(2px)' }}
                />
              </div>
            </label>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{meta.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTS.join(',')}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              style={{
                background: 'rgba(139,92,246,0.15)',
                color: '#c4b5fd',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Đang lưu...' : 'Chọn file MP3'}
            </button>

            <button
              type="button"
              onClick={handleTest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors hover:bg-white/5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                border: '1px solid rgba(148,163,184,0.2)',
              }}
            >
              <Play className="w-3.5 h-3.5" />
              Nghe thử
            </button>

            {customFileName && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors hover:bg-red-500/10"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
                title="Xóa file tùy chọn, dùng lại âm thanh mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* File info / status */}
          <div className="mt-2 text-[11px] font-mono">
            {error ? (
              <span className="text-red-400 inline-flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </span>
            ) : customFileName ? (
              <span className="text-emerald-400 inline-flex items-center gap-1">
                <Check className="w-3 h-3" /> Đang dùng: {customFileName}
              </span>
            ) : (
              <span className="text-slate-500">
                Đang dùng mặc định: {DEFAULT_FILE_NAMES[kind]}
              </span>
            )}
            {savedTick > 0 && !error && (
              <span key={savedTick} className="ml-2 text-violet-400 animate-pulse">
                · Đã lưu
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function NotificationSettingsPage() {
  const masterEnabled = usePreferencesStore((s) => s.masterEnabled);
  const setMasterEnabled = usePreferencesStore((s) => s.setMasterEnabled);
  const volume = usePreferencesStore((s) => s.volume);
  const setVolume = usePreferencesStore((s) => s.setVolume);
  const reset = usePreferencesStore((s) => s.reset);

  return (
    <div className="min-h-screen w-full relative" style={{ background: '#0a0a14' }}>
      {/* Background gradient — same neon vibe as /social */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 20% 10%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(236,72,153,0.10) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang cá nhân
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Cài đặt âm thanh thông báo</h1>
          <p className="text-sm text-slate-400">
            Chọn âm thanh cho từng loại thông báo. Có thể upload file MP3/WAV/OGG/M4A riêng,
            hoặc dùng âm thanh mặc định được tạo tự động.
          </p>
        </div>

        {/* Master controls */}
        <div
          className="rounded-2xl p-5 mb-6 backdrop-blur-md"
          style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-semibold text-white">Bật/tắt toàn bộ âm thanh</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Khi tắt, không âm thanh nào phát ra dù các mục dưới đây đang bật
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={masterEnabled}
                onChange={(e) => setMasterEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full relative transition-colors"
                style={{
                  background: masterEnabled ? 'rgba(139,92,246,0.8)' : 'rgba(148,163,184,0.3)',
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{ transform: masterEnabled ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </div>
            </label>
          </div>

          {/* Master volume */}
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
            <div className="flex items-center gap-3 mb-2">
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-violet-300" />
              )}
              <span className="text-sm text-slate-200">Âm lượng chung</span>
              <span className="text-xs font-mono text-slate-500 ml-auto">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-violet-500"
              disabled={!masterEnabled}
            />
          </div>
        </div>

        {/* Per-sound settings */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2 px-1">
            Từng loại thông báo
          </h2>
          {ALL_KINDS.map((kind) => (
            <KindRow key={kind} kind={kind} />
          ))}
        </div>

        {/* Reset */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (confirm('Khôi phục tất cả cài đặt âm thanh về mặc định?')) {
                reset();
              }
            }}
            className="px-4 py-2 text-sm rounded-lg transition-colors hover:bg-white/5"
            style={{
              background: 'rgba(255,255,255,0.03)',
              color: '#94a3b8',
              border: '1px solid rgba(148,163,184,0.2)',
            }}
          >
            Khôi phục mặc định
          </button>
        </div>
      </div>
    </div>
  );
}
