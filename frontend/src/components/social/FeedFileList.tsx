'use client';

// FeedFileList — the "File" feed tab.
//
// Flattens the FILE / CODE_FILE attachments of the (already type=FILE
// filtered) posts into a download-focused list: type icon, filename,
// size, mime, plus the author + when it was shared, and an open/download
// button. Reuses the existing R2 media URLs — no new storage. Visual
// language mirrors PostCard's file rows so it feels native.

import { motion } from 'framer-motion';
import { Download, FileText, FileCode, FileArchive, FileSpreadsheet } from 'lucide-react';
import type { SocialPost, SocialMedia } from '@/types/social';

function fileIcon(name: string): { Icon: typeof FileText; color: string } {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (['zip', 'rar', '7z', 'tar', 'gz', 'tgz'].includes(ext)) return { Icon: FileArchive, color: '#f59e0b' };
  if (['md', 'txt', 'log'].includes(ext)) return { Icon: FileText, color: '#94a3b8' };
  if (['pdf'].includes(ext)) return { Icon: FileText, color: '#ef4444' };
  if (['doc', 'docx', 'odt'].includes(ext)) return { Icon: FileText, color: '#3b82f6' };
  if (['xls', 'xlsx', 'csv'].includes(ext)) return { Icon: FileSpreadsheet, color: '#22c55e' };
  if (['js', 'jsx', 'ts', 'tsx', 'json', 'py', 'go', 'rs', 'java', 'rb', 'php', 'css', 'html', 'yml', 'yaml'].includes(ext))
    return { Icon: FileCode, color: '#a78bfa' };
  return { Icon: FileText, color: '#64748b' };
}

function humanFileSize(bytes?: number | string | null): string {
  if (bytes == null) return '';
  const n = typeof bytes === 'string' ? Number(bytes) : bytes;
  if (!Number.isFinite(n) || n < 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

interface FileRow {
  media: SocialMedia;
  post: SocialPost;
}

export default function FeedFileList({ posts }: { posts: SocialPost[] }) {
  // Flatten every file attachment across the filtered posts. `?? []`
  // guards keep a malformed post from throwing "media is not iterable".
  const rows: FileRow[] = (posts ?? []).flatMap((post) =>
    (post.media ?? [])
      .filter((m) => m.type === 'FILE' || m.type === 'CODE_FILE')
      .map((media) => ({ media, post })),
  );

  if (rows.length === 0) return null;

  return (
    <ul
      className="overflow-hidden rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {rows.map(({ media: m, post }, i) => {
        const name = m.fileName || m.alt || 'Tệp đính kèm';
        const { Icon, color } = fileIcon(name);
        const author = post.author?.displayName || post.author?.fullName || post.author?.username || 'Người dùng';
        return (
          <motion.li
            key={`${post.id}-${m.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: Math.min(i * 0.02, 0.2) }}
            className="flex items-center gap-3 border-b border-white/[0.04] px-3 py-3 last:border-b-0"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${color}20`, color }}
            >
              <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary" title={name}>
                {name}
              </p>
              <p className="truncate text-[11px]" style={{ color: '#64748b' }}>
                {[humanFileSize(m.fileSize), m.mimeType, `bởi ${author}`].filter(Boolean).join(' · ')}
              </p>
            </div>
            <a
              href={m.url}
              download={name}
              target="_blank"
              rel="noopener noreferrer"
              // 44px min touch target for mobile.
              className="flex h-11 min-h-[44px] items-center gap-1.5 rounded-lg px-3.5 text-xs font-medium transition-colors"
              style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}
              title="Tải xuống / mở"
            >
              <Download size={15} />
              Tải
            </a>
          </motion.li>
        );
      })}
    </ul>
  );
}
