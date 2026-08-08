'use client';

/**
 * /settings/notifications — what you get told about, and what it sounds like.
 *
 * Rebuilt 2026-08-08. Changes from the version this replaces:
 *
 *   - Theme-aware. The old page hardcoded `background: '#0a0a14'` and
 *     `rgba(15,23,42,.6)` panels, so it stayed pitch black in light mode.
 *   - Settings follow the ACCOUNT, not the browser (see preferencesStore).
 *   - Adds per-CATEGORY switches. Previously the only thing you could turn
 *     off was the sound; the notification itself always arrived.
 *   - Adds browser (OS) notifications.
 *   - The "default file name" labels were wrong — they listed
 *     `shikabukiste_yatta.mp3` and `tin_nhan_moi_chua_doc.mp3`, but the
 *     files actually served from public/sounds are `default-*.mp3`. They're
 *     now derived from the same map lib/sound.ts plays from, so they can't
 *     drift again.
 */

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Bell, MessageCircle, LogIn, Send, Volume2, VolumeX, Upload, RotateCcw,
  Play, Check, AlertCircle, Heart, Crown, AtSign, MessageSquare, UserPlus,
  UserCheck, FolderOpen, Share2, CornerDownRight, Monitor, Music,
} from 'lucide-react';
import {
  usePreferencesStore, SOUND_KINDS, ALL_KINDS, ALL_NOTIFY_TYPES,
  NOTIFY_TYPE_META, type SoundKind, type NotifyType,
} from '@/store/preferencesStore';
import { saveSound, getSound, deleteSound, type SoundRecord } from '@/lib/soundStorage';
import { testSound, invalidateCustomSoundCache, DEFAULT_SOUND_FILES } from '@/lib/sound';
import {
  SettingsPage, SettingsCard, SettingsRow, Toggle, Button, SyncBadge, SettingsDivider,
} from '@/components/settings/primitives';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Bell, MessageCircle, LogIn, Send, Heart, Crown, AtSign, MessageSquare,
  UserPlus, UserCheck, FolderOpen, Share2, CornerDownRight,
};

const ACCEPTED_EXTS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
const MAX_BYTES = 5 * 1024 * 1024;

/* ─── One sound slot ─────────────────────────────────────────────── */

function SoundRow({ kind }: { kind: SoundKind }) {
  const meta = SOUND_KINDS[kind];
  const Icon = ICON_MAP[meta.icon] ?? Bell;

  const enabled = usePreferencesStore((s) => s.enabled[kind]);
  const setKindEnabled = usePreferencesStore((s) => s.setKindEnabled);
  const customFileName = usePreferencesStore((s) => s.customFileName[kind]);
  const setCustomFileName = usePreferencesStore((s) => s.setCustomFileName);
  const masterEnabled = usePreferencesStore((s) => s.masterEnabled);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IndexedDB is per-browser but `customFileName` now syncs across devices,
  // so on a second device the name can claim a file this browser doesn't
  // hold. Reconcile on mount: if the blob isn't here, drop the name so the
  // UI says "default" instead of promising a sound it can't play.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rec = await getSound(kind);
      if (cancelled) return;
      const current = usePreferencesStore.getState().customFileName[kind];
      if (!rec && current) setCustomFileName(kind, '');
      else if (rec && rec.name !== current) setCustomFileName(kind, rec.name);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) {
      setError(`Định dạng không hỗ trợ. Chỉ nhận: ${ACCEPTED_EXTS.join(', ')}`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`File quá lớn (tối đa ${Math.round(MAX_BYTES / 1024 / 1024)}MB)`);
      return;
    }
    setUploading(true);
    try {
      const rec: SoundRecord = {
        id: kind, name: file.name, blob: file,
        type: file.type || 'audio/mpeg', updatedAt: Date.now(),
      };
      await saveSound(rec);
      invalidateCustomSoundCache(kind);
      setCustomFileName(kind, file.name);
      toast.success(`Đã đặt "${file.name}" cho ${meta.label.toLowerCase()}.`);
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
      toast.success('Đã trả về âm thanh mặc định.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi khi xoá');
    }
  };

  const handleTest = async () => {
    setError(null);
    try {
      // Test plays at the user's real volume so "nghe thử" matches what a
      // real notification will sound like. It deliberately ignores the
      // enabled flags — you need to hear a sound to decide whether to
      // enable it.
      const v = usePreferencesStore.getState().volume;
      const ok = await testSound(kind, v);
      if (!ok) {
        setError('Trình duyệt chặn phát âm thanh. Hãy bấm vào trang một lần rồi thử lại.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi khi phát thử');
    }
  };

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {meta.label}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                {meta.description}
              </p>
            </div>
            <Toggle
              checked={enabled}
              onChange={(v) => setKindEnabled(kind, v)}
              disabled={!masterEnabled}
              size="sm"
              label={`Âm thanh: ${meta.label}`}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTS.join(',')}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
              className="!px-3 !py-1.5 !text-xs"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? 'Đang lưu…' : 'Chọn file'}
            </Button>
            <Button variant="secondary" onClick={handleTest} className="!px-3 !py-1.5 !text-xs">
              <Play className="h-3.5 w-3.5" /> Nghe thử
            </Button>
            {customFileName && (
              <Button variant="ghost" onClick={handleReset} className="!px-3 !py-1.5 !text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Về mặc định
              </Button>
            )}
          </div>

          <div className="mt-2 text-[11px]">
            {error ? (
              <span className="inline-flex items-center gap-1 text-rose-500">
                <AlertCircle className="h-3 w-3" /> {error}
              </span>
            ) : customFileName ? (
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <Check className="h-3 w-3" />
                <span className="font-mono">Đang dùng: {customFileName}</span>
              </span>
            ) : (
              <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                Mặc định: {DEFAULT_SOUND_FILES[kind]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function NotificationSettingsPage() {
  const masterEnabled = usePreferencesStore((s) => s.masterEnabled);
  const setMasterEnabled = usePreferencesStore((s) => s.setMasterEnabled);
  const volume = usePreferencesStore((s) => s.volume);
  const setVolume = usePreferencesStore((s) => s.setVolume);
  const notifyTypes = usePreferencesStore((s) => s.notifyTypes);
  const setNotifyType = usePreferencesStore((s) => s.setNotifyType);
  const browserPush = usePreferencesStore((s) => s.browserPush);
  const setBrowserPush = usePreferencesStore((s) => s.setBrowserPush);
  const syncStatus = usePreferencesStore((s) => s.syncStatus);
  const reset = usePreferencesStore((s) => s.reset);

  // The OS permission is per-device and can be revoked in browser settings
  // at any time, so it is NOT part of the synced blob — we read it live.
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const handleBrowserPush = async (v: boolean) => {
    if (!v) { setBrowserPush(false); return; }
    if (permission === 'unsupported') {
      toast.error('Trình duyệt này không hỗ trợ thông báo hệ thống.');
      return;
    }
    if (permission === 'denied') {
      toast.error('Bạn đã chặn thông báo cho trang này. Hãy mở cài đặt trình duyệt để bật lại.');
      return;
    }
    if (permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        toast.error('Bạn chưa cấp quyền hiển thị thông báo.');
        return;
      }
    }
    setBrowserPush(true);
    toast.success('Đã bật thông báo trên màn hình.');
  };

  return (
    <SettingsPage
      title="Thông báo"
      description="Chọn loại thông báo muốn nhận và âm thanh riêng cho từng loại. Cài đặt được lưu theo tài khoản nên sang máy khác vẫn giữ nguyên."
      action={<SyncBadge status={syncStatus} />}
    >
      {/* ── Which notifications you receive ─────────────────── */}
      <SettingsCard
        title="Loại thông báo"
        description="Tắt một mục nghĩa là không hiện thông báo mới loại đó ở chuông và không phát âm thanh. Thông báo cũ vẫn còn trong trang Thông báo."
        icon={<Bell className="h-4 w-4" />}
      >
        <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {ALL_NOTIFY_TYPES.map((type: NotifyType) => {
            const meta = NOTIFY_TYPE_META[type];
            const Icon = ICON_MAP[meta.icon] ?? Bell;
            return (
              <SettingsRow
                key={type}
                icon={<Icon className="h-4 w-4" />}
                label={meta.label}
                description={meta.description}
                control={
                  <Toggle
                    checked={notifyTypes?.[type] !== false}
                    onChange={(v) => setNotifyType(type, v)}
                    size="sm"
                    label={meta.label}
                  />
                }
              />
            );
          })}
        </div>
      </SettingsCard>

      {/* ── OS notifications ────────────────────────────────── */}
      <SettingsCard title="Thông báo trên màn hình" icon={<Monitor className="h-4 w-4" />}>
        <SettingsRow
          label="Hiện thông báo của hệ điều hành"
          description={
            permission === 'unsupported'
              ? 'Trình duyệt này không hỗ trợ thông báo hệ thống.'
              : permission === 'denied'
                ? 'Bạn đã chặn quyền thông báo cho trang này — cần mở cài đặt trình duyệt để bật lại.'
                : 'Hiện thông báo ngay cả khi bạn đang ở tab khác. Quyền này áp dụng riêng cho từng trình duyệt.'
          }
          control={
            <Toggle
              checked={browserPush && permission === 'granted'}
              onChange={handleBrowserPush}
              disabled={permission === 'unsupported' || permission === 'denied'}
              label="Thông báo trên màn hình"
            />
          }
        />
      </SettingsCard>

      {/* ── Sound master ────────────────────────────────────── */}
      <SettingsCard title="Âm thanh" icon={<Music className="h-4 w-4" />}>
        <SettingsRow
          label="Bật âm thanh thông báo"
          description="Khi tắt, không âm thanh nào phát ra dù từng loại bên dưới đang bật."
          control={
            <Toggle checked={masterEnabled} onChange={setMasterEnabled} label="Bật âm thanh thông báo" />
          }
        />

        <SettingsDivider />

        <div className="py-3">
          <div className="mb-2 flex items-center gap-3">
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            ) : (
              <Volume2 className="h-4 w-4" style={{ color: '#8b5cf6' }} />
            )}
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Âm lượng chung</span>
            <span className="ml-auto font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            aria-label="Âm lượng chung"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-violet-500"
            disabled={!masterEnabled}
          />
        </div>
      </SettingsCard>

      {/* ── Per-sound ───────────────────────────────────────── */}
      <SettingsCard
        title="Âm thanh từng loại"
        description="Có thể tải lên file MP3/WAV/OGG/M4A riêng (tối đa 5MB). File nhạc được lưu trong trình duyệt này; các bật/tắt thì đồng bộ theo tài khoản."
        icon={<Volume2 className="h-4 w-4" />}
        footer={
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('Khôi phục tất cả cài đặt thông báo về mặc định?')) {
                  reset();
                  toast.success('Đã khôi phục mặc định.');
                }
              }}
            >
              Khôi phục mặc định
            </Button>
          </div>
        }
      >
        <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {ALL_KINDS.map((kind) => (
            <SoundRow key={kind} kind={kind} />
          ))}
        </div>
      </SettingsCard>
    </SettingsPage>
  );
}
