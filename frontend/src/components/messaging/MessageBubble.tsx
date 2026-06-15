'use client';

import { useState } from 'react';
import { Trash2, FileText, Download, X } from 'lucide-react';
import type { MessagingMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';

export default function MessageBubble({
  message,
  isOwn,
  canDelete,
  onDelete,
}: {
  message: MessagingMessage;
  isOwn: boolean;
  canDelete: boolean;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (message.deleted) {
    return (
      <div className="my-1 flex justify-center">
        <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] italic text-text-muted">
          Tin nhắn đã được xoá
        </span>
      </div>
    );
  }

  return (
    <div className={`my-1 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`group relative max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
          isOwn
            ? 'rounded-br-sm text-white'
            : 'rounded-bl-sm text-text-primary'
        }`}
        style={
          isOwn
            ? { background: 'linear-gradient(135deg, #06B6D4, #6366F1)' }
            : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }
        }
      >
        {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}

        {message.attachments.length > 0 && (
          <div className={`mt-1.5 space-y-1.5 ${message.content ? 'pt-1.5 border-t border-white/10' : ''}`}>
            {message.attachments.map((a) =>
              a.mimeType.startsWith('image/') ? (
                <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src={a.url}
                    alt={a.fileName}
                    className="max-h-48 max-w-[260px] rounded-lg object-cover"
                    loading="lazy"
                  />
                </a>
              ) : (
                <a
                  key={a.id}
                  href={a.url}
                  download={a.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                    isOwn ? 'bg-white/10 hover:bg-white/20' : 'bg-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{a.fileName}</span>
                  <span className="text-[10px] opacity-70">{formatBytes(a.fileSize)}</span>
                  <Download className="h-3 w-3 shrink-0" />
                </a>
              ),
            )}
          </div>
        )}

        <div className={`mt-0.5 flex items-center gap-1 text-[10px] ${isOwn ? 'text-white/70' : 'text-text-muted'}`}>
          <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
          {canDelete && (
            <div className="relative ml-1">
              <button
                onClick={() => setShowMenu((s) => !s)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Tuỳ chọn"
              >
                <X className="h-3 w-3" />
              </button>
              {showMenu && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="absolute right-0 top-4 z-10 flex items-center gap-1 rounded-lg border border-white/10 bg-red-500/90 px-2 py-1 text-[10px] font-medium text-white shadow-lg hover:bg-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                  Xoá
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
