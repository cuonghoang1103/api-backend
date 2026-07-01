'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Edit3, Trash2, Hash, Calendar, Globe2, Lock, Tag, Loader2, Link2 } from 'lucide-react';

import type { HubLink } from '@/lib/api';

const C = {
  primary: '#a855f7',
  secondary: '#ec4899',
  tertiary: '#22d3ee',
  text: '#f8fafc',
  textMuted: '#64748b',
  textSecondary: '#cbd5e1',
  border: 'rgba(168,85,247,0.15)',
  glassBg: 'rgba(10,8,25,0.92)',
  codeBg: 'rgba(5,3,15,0.9)',
};

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface HubLinkDetailModalProps {
  link: HubLink | null;
  open: boolean;
  onClose: () => void;
  onEdit: (link: HubLink) => void;
  onDelete: (id: number) => void;
}

export default function HubLinkDetailModal({ link, open, onClose, onEdit, onDelete }: HubLinkDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!link) return null;

  const host = (() => {
    try { return new URL(link.url).hostname.replace(/^www\./, ''); }
    catch { return link.url; }
  })();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl rounded-2xl overflow-hidden my-auto"
            style={{ background: C.glassBg, border: `1px solid ${C.border}` }}
          >
            {/* Header - Code window style */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: C.codeBg, borderBottom: `1px solid ${C.border}` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                </div>
                <div className="flex items-center gap-2">
                  {link.faviconUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={link.faviconUrl} alt="" className="w-4 h-4" />
                  )}
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase" style={{ color: C.tertiary }}>
                    <Link2 className="w-3.5 h-3.5" />{host}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { onEdit(link); onClose(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                  style={{ background: 'rgba(168,85,247,0.2)', color: C.primary, border: `1px solid ${C.border}` }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Sua
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', color: C.textMuted }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row">
              {/* Left: Details */}
              <div className="flex-1 px-6 py-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                {/* Title */}
                <div className="mb-4">
                  <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: C.text }}>
                    {link.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: C.textMuted }}>
                    {link.isPublic ? (
                      <span className="flex items-center gap-1"><Globe2 className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />Cong khai</span>
                    ) : (
                      <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" style={{ color: C.textMuted }} />Rieng tu</span>
                    )}
                    {link.createdAt && (
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{timeAgo(link.createdAt)}</span>
                    )}
                  </div>
                </div>

                {/* URL */}
                <div className="mb-6">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                    style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: '#fff', boxShadow: `0 0 16px rgba(168,85,247,0.4)` }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Mo link
                  </a>
                </div>

                {/* Description */}
                {link.description && (
                  <div className="mb-6">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.primary }}>
                      <Tag className="w-3.5 h-3.5" />Mo ta
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: C.textSecondary }}>
                      {link.description}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {link.notes && (
                  <div className="mb-6">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.primary }}>
                      <Edit3 className="w-3.5 h-3.5" />Ghi chu
                    </h3>
                    <div
                      className="rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.25)', color: C.textSecondary }}
                    >
                      {link.notes}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {link.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.primary }}>
                      <Hash className="w-3.5 h-3.5" />Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {link.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full"
                          style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Thumbnail/Cover */}
              <div className="w-full lg:w-80 shrink-0 flex flex-col" style={{ borderLeft: `1px solid ${C.border}` }}>
                {link.coverImageUrl || link.thumbnailUrl ? (
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: C.textMuted }}>
                      Hinh anh
                    </p>
                    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={link.coverImageUrl || link.thumbnailUrl || ''}
                        alt={link.title}
                        className="w-full h-auto"
                      />
                    </div>
                    {link.coverImageUrl && (
                      <p className="text-[9px] mt-1 text-center" style={{ color: C.textMuted }}>
                        Custom cover image
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center" style={{ minHeight: '200px' }}>
                    <Link2 className="w-12 h-12 mb-2" style={{ color: `${C.primary}40` }} />
                    <p className="text-xs text-center" style={{ color: C.textMuted }}>
                      Khong co hinh anh
                    </p>
                  </div>
                )}

                {/* Delete button */}
                <div className="mt-auto p-4 border-t" style={{ borderColor: C.border }}>
                  <button
                    onClick={() => {
                      if (confirm(`Xoa link "${link.title}"?`)) {
                        onDelete(link.id);
                        onClose();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xoa link
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
