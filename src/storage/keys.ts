/**
 * Centralised "where in the bucket does this file go?" logic.
 *
 * Putting every key prefix in one place means a refactor
 * (e.g. moving avatars to `users/<id>/avatar/` instead of
 * `images/avatar/`) is a one-line change. It also keeps the
 * bucket layout documented and reviewable.
 *
 * Key rules:
 *   - lowercase ASCII only, forward slashes for nesting
 *   - no leading slash (would produce `//` in public URLs)
 *   - no trailing slash
 *   - extension is preserved on the final segment
 *   - random suffix prevents collisions and makes enumeration
 *     harder
 */
import path from 'path';
import { randomBytes } from 'crypto';

const SAFE_RANDOM_BYTES = 6; // 12 hex chars, plenty for collision avoidance

function randomSuffix(): string {
  // 6 bytes = 12 hex chars. crypto.randomBytes is sync-block-cheap
  // and avoids the Math.random predictability footgun.
  return randomBytes(SAFE_RANDOM_BYTES).toString('hex');
}

/** Always use forward slashes in keys, regardless of host OS. */
function normalize(key: string): string {
  return key.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
}

/** Build a key under the given category. `originalName` is used
 *  to preserve the extension; the basename is replaced with a
 *  timestamp + random suffix to avoid collisions and obscure
 *  the original filename. */
export function buildKey(
  category: StorageCategory,
  originalName: string,
  options: { userId?: number; subPrefix?: string } = {},
): string {
  const ext = path.extname(originalName).toLowerCase().slice(0, 16) || '';
  const stamp = Date.now();
  const suffix = randomSuffix();
  const filename = `${stamp}-${suffix}${ext}`;
  const sub = options.subPrefix ? `${options.subPrefix}/` : '';
  return normalize(`${category}/${sub}${filename}`);
}

/**
 * Convert an HTTP file upload category to a bucket prefix. The
 * R2 layout follows the original local layout 1:1 so the
 * migration script can copy files with `cp -r` semantics.
 */
export type StorageCategory =
  | 'images/avatar'
  | 'images/cover'
  | 'images/post'
  | 'images/chat'
  | 'images/sticker'
  | 'images/project'
  | 'images/playlist-covers'
  | 'images/thumbnails'
  | 'audio/songs'
  | 'audio/notifications'
  | 'video'
  | 'documents/lesson'
  | 'documents/chat';

/** Helper for the audio path — pre-pends `songs/` per the spec. */
export function buildAudioKey(originalName: string, _options: { userId?: number } = {}): string {
  void _options; // reserved for future per-user prefixes
  const ext = path.extname(originalName).toLowerCase().slice(0, 16) || '.mp3';
  const stamp = Date.now();
  const suffix = randomSuffix();
  return normalize(`audio/songs/${stamp}-${suffix}${ext}`);
}

/** Helper for notification sounds — small files, fixed prefix. */
export function buildNotificationSoundKey(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase().slice(0, 16) || '.mp3';
  const stamp = Date.now();
  const suffix = randomSuffix();
  return normalize(`audio/notifications/${stamp}-${suffix}${ext}`);
}

/** Helper for chat attachments — keeps the original extension. */
export function buildChatAttachmentKey(
  originalName: string,
  options: { userId?: number } = {},
): string {
  return buildKey('documents/chat', originalName, options);
}
