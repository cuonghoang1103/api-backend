'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Code2,
  Globe,
  Lock,
  Users,
  X,
  Loader2,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { socialApi } from '@/lib/api';
import type { MediaUploadItem } from '@/types/social';

const VISIBILITY_OPTIONS = [
  {
    value: 'PUBLIC',
    label: 'Public',
    icon: Globe,
    desc: 'Anyone can see',
    color: '#22c55e',
  },
  {
    value: 'FRIENDS',
    label: 'Friends',
    icon: Users,
    desc: 'Only friends',
    color: '#3b82f6',
  },
  {
    value: 'PRIVATE',
    label: 'Private',
    icon: Lock,
    desc: 'Only me',
    color: '#64748b',
  },
] as const;

export function PostComposer() {
  const { composerContent, composerVisibility, composerMedia, isPosting, setComposerContent, setComposerVisibility, addComposerMedia, removeComposerMedia, submitPost, clearComposer } = useSocialStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const currentVisibility = VISIBILITY_OPTIONS.find((v) => v.value === composerVisibility) || VISIBILITY_OPTIONS[0];

  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 300)}px`;
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComposerContent(e.target.value);
    adjustTextareaHeight();
  };

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        setPostError('File too large (max 50MB)');
        continue;
      }

      const isVideo = file.type.startsWith('video/');
      const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const preview = URL.createObjectURL(file);
      const item: MediaUploadItem = {
        id,
        file,
        preview,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        progress: 0,
      };
      addComposerMedia([item]);

      // Get dimensions for images
      if (!isVideo) {
        const img = document.createElement('img');
        img.onload = () => {
          useSocialStore.setState((s) => ({
            composerMedia: s.composerMedia.map((m) =>
              m.id === id ? { ...m, width: img.naturalWidth, height: img.naturalHeight } : m
            ),
          }));
        };
        img.src = preview;
      }

      // Simulate upload progress (real upload goes through signed URL)
      for (let p = 0; p <= 100; p += 20) {
        await new Promise((r) => setTimeout(r, 100));
        useSocialStore.setState((s) => ({
          composerMedia: s.composerMedia.map((m) => (m.id === id ? { ...m, progress: p } : m)),
        }));
      }

      // Mark as done (in real implementation, upload to signed URL here)
      useSocialStore.setState((s) => ({
        composerMedia: s.composerMedia.map((m) =>
          m.id === id ? { ...m, progress: 100, url: preview } : m
        ),
      }));
    }

    e.target.value = '';
  };

  const handleSubmit = async () => {
    setPostError(null);
    try {
      await submitPost();
      setIsExpanded(false);
    } catch (err: unknown) {
      setPostError(err instanceof Error ? err.message : 'Failed to post');
    }
  };

  const hasContent = composerContent.trim() || composerMedia.length > 0;

  return (
    <div>
      <motion.div
        layout
        className="overflow-hidden rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: isExpanded ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Top accent */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: isExpanded
              ? 'linear-gradient(90deg, #8B5CF6, #06b6d4)'
              : 'transparent',
            transition: 'background 0.3s',
          }}
        />

        <div className="p-4">
          {/* Avatar + textarea */}
          <div className="flex gap-3">
            <div
              className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-2"
              style={{ ringColor: 'rgba(139,92,246,0.3)' }}
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                alt="Your avatar"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={composerContent}
                onChange={handleContentChange}
                onFocus={() => setIsExpanded(true)}
                placeholder="What are you thinking about?"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-sm"
                style={{ color: '#e2e8f0' }}
              />

              {/* Media preview */}
              <AnimatePresence>
                {composerMedia.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <MediaPreview media={composerMedia} onRemove={removeComposerMedia} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Expanded toolbar */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Toolbar */}
                <div
                  className="mt-3 flex items-center justify-between"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}
                >
                  <div className="flex items-center gap-1">
                    {/* Image upload */}
                    <ToolbarButton
                      icon={<Image size={18} />}
                      label="Photo"
                      onClick={handleImageUpload}
                    />

                    {/* Code block insert */}
                    <ToolbarButton
                      icon={<Code2 size={18} />}
                      label="Code"
                      onClick={() => {
                        const ta = textareaRef.current;
                        if (!ta) return;
                        const start = ta.selectionStart;
                        const end = ta.selectionEnd;
                        const selected = composerContent.slice(start, end);
                        const code = selected || 'your code here';
                        const wrapped = `\`\`\`\n${code}\n\`\`\``;
                        setComposerContent(
                          composerContent.slice(0, start) + wrapped + composerContent.slice(end)
                        );
                        setTimeout(adjustTextareaHeight, 0);
                      }}
                    />

                    {/* Visibility */}
                    <div className="relative">
                      <button
                        onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors"
                        style={{
                          color: currentVisibility.color,
                          background: `${currentVisibility.color}15`,
                          border: `1px solid ${currentVisibility.color}30`,
                        }}
                      >
                        <currentVisibility.icon size={14} />
                        {currentVisibility.label}
                        <ChevronDown size={12} />
                      </button>

                      <AnimatePresence>
                        {showVisibilityMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.95 }}
                            className="absolute left-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-2xl py-1"
                            style={{
                              background: 'rgba(15,15,25,0.98)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(20px)',
                            }}
                          >
                            {VISIBILITY_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors"
                                onClick={() => {
                                  setComposerVisibility(option.value);
                                  setShowVisibilityMenu(false);
                                }}
                                style={{
                                  background:
                                    composerVisibility === option.value
                                      ? `${option.color}15`
                                      : 'transparent',
                                  color: '#e2e8f0',
                                }}
                              >
                                <option.icon size={16} style={{ color: option.color }} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{option.label}</p>
                                  <p className="text-xs" style={{ color: '#64748b' }}>
                                    {option.desc}
                                  </p>
                                </div>
                                {composerVisibility === option.value && (
                                  <Check size={14} style={{ color: option.color }} />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-3">
                    {postError && (
                      <p className="text-xs" style={{ color: '#f87171' }}>
                        {postError}
                      </p>
                    )}

                    <button
                      onClick={() => {
                        setIsExpanded(false);
                        clearComposer();
                      }}
                      className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                      style={{ color: '#94a3b8' }}
                    >
                      Cancel
                    </button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={!hasContent || isPosting}
                      className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #06b6d4)',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
                      }}
                    >
                      {isPosting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Posting...
                        </>
                      ) : (
                        'Post'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </motion.div>
    </div>
  );
}

// ─── Media Preview ───────────────────────────────────────────────────────────

function MediaPreview({
  media,
  onRemove,
}: {
  media: MediaUploadItem[];
  onRemove: (id: string) => void;
}) {
  if (media.length === 1) {
    const item = media[0];
    return (
      <div className="relative inline-block w-full overflow-hidden rounded-2xl" style={{ maxHeight: '300px' }}>
        {item.type === 'VIDEO' ? (
          <video src={item.preview} className="w-full object-cover" style={{ maxHeight: '300px' }} />
        ) : (
          <img
            src={item.preview}
            alt="Upload preview"
            className="w-full object-cover"
            style={{ maxHeight: '300px' }}
          />
        )}
        {item.progress < 100 && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div className="text-center">
              <Loader2 size={24} className="mx-auto animate-spin text-white" />
              <p className="mt-1 text-xs text-white">{item.progress}%</p>
            </div>
          </div>
        )}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <X size={14} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {media.slice(0, 6).map((item, i) => (
        <div key={item.id} className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '1' }}>
          {item.type === 'VIDEO' ? (
            <video src={item.preview} className="h-full w-full object-cover" />
          ) : (
            <img src={item.preview} alt="Upload" className="h-full w-full object-cover" />
          )}
          {i === 5 && media.length > 6 && (
            <div
              className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white"
              style={{ background: 'rgba(0,0,0,0.6)' }}
            >
              +{media.length - 5}
            </div>
          )}
          <button
            onClick={() => onRemove(item.id)}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          >
            <X size={10} className="text-white" />
          </button>
          {item.progress < 100 && (
            <div
              className="absolute inset-x-0 bottom-0 h-1"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <div
                className="h-full transition-all"
                style={{ width: `${item.progress}%`, background: '#8B5CF6' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Toolbar Button ──────────────────────────────────────────────────────────

function ToolbarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium transition-colors"
      style={{ color: '#64748b' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.color = '#94a3b8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#64748b';
      }}
    >
      {icon}
    </button>
  );
}
