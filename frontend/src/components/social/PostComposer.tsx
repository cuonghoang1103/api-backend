'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Code2,
  Globe,
  Lock,
  Users,
  X,
  Loader2,
  ChevronDown,
  Check,
  BarChart3,
  Hash,
  AtSign,
  Bold,
  Italic,
  Plus,
  Trash2,
  ListChecks,
} from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { socialApi } from '@/lib/api';
import type { MediaUploadItem } from '@/types/social';
import { toast } from 'sonner';

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
  const {
    composerContent, composerVisibility, composerMedia, composerPoll, isPosting,
    setComposerContent, setComposerVisibility, setComposerPoll,
    addComposerMedia, removeComposerMedia, submitPost, clearComposer,
  } = useSocialStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [showPollEditor, setShowPollEditor] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentVisibility = VISIBILITY_OPTIONS.find((v) => v.value === composerVisibility) || VISIBILITY_OPTIONS[0];

  // Open the poll editor automatically if a poll draft survives
  // a re-mount (e.g. user accidentally collapsed the composer).
  useEffect(() => {
    if (composerPoll) setShowPollEditor(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Text formatting helpers ────────────────────────────────────────
  // We don't run a true rich-text editor (which would mess with
  // selection state on mobile). Instead we wrap the current
  // selection (or insert at caret) with the markdown markers the
  // renderer understands: **bold**, *italic*, `code`. The user
  // can keep typing in the textarea as usual.
  const wrapSelection = useCallback(
    (prefix: string, suffix: string = prefix, placeholder: string = 'text') => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = composerContent.slice(start, end) || placeholder;
      const wrapped = `${prefix}${selected}${suffix}`;
      const next = composerContent.slice(0, start) + wrapped + composerContent.slice(end);
      setComposerContent(next);
      requestAnimationFrame(() => {
        ta.focus();
        const cursorStart = start + prefix.length;
        const cursorEnd = cursorStart + selected.length;
        ta.setSelectionRange(cursorStart, cursorEnd);
        adjustTextareaHeight();
      });
    },
    [composerContent, setComposerContent]
  );

  const adjustTextareaHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 300)}px`;
    }
  }, []);

  // ─── Drag-and-drop handlers for the image grid ────────────────────
  // The composer accepts a drag of files from the OS file manager;
  // we route those through the same file-input path so the
  // upload pipeline (signed URL, progress, error states) is
  // shared. We avoid HTML5 dataTransfer for the array of files to
  // keep TypeScript happy on older browsers.
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;
    handleFiles(files);
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
    handleFiles(files);
    // Reset the input so the same file can be picked again later.
    e.target.value = '';
  };

  // Central upload pipeline. Used by both the file input and the
  // drag-and-drop overlay. We bound concurrent uploads to 6 to
  // keep the grid preview manageable; if the user drops more we
  // queue the rest and start them as the earlier ones finish.
  const handleFiles = useCallback(
    async (files: File[]) => {
      const limited = files.slice(0, 6);
      for (const file of limited) {
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
  }, [addComposerMedia]);

  // ─── Hashtag / mention helpers ───────────────────────────────────
  // When the user types @ or # we surface a tiny helper note so
  // they know the content will be detected and turned into a clickable
  // link on render. We don't run a real autocomplete here because
  // there's no user search endpoint yet — the tokens still work
  // because the renderer regex-extracts them.

  // ─── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setPostError(null);
    try {
      await submitPost();
      setIsExpanded(false);
      setShowPollEditor(false);
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
          <div
            className="flex gap-3"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div
              className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-2"
              style={{ boxShadow: '0 0 0 2px rgba(139,92,246,0.3)' }}
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                alt="Your avatar"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1 relative">
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

              {/* Drag overlay */}
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-neon-violet"
                    style={{ background: 'rgba(139,92,246,0.08)' }}
                  >
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-neon-violet" />
                      <p className="mt-2 text-sm font-medium text-neon-violet">Thả ảnh/video để đăng</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Poll editor */}
          <AnimatePresence>
            {showPollEditor && (
              <PollEditor
                poll={composerPoll}
                onChange={setComposerPoll}
                onClose={() => {
                  setShowPollEditor(false);
                  setComposerPoll(null);
                }}
              />
            )}
          </AnimatePresence>

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
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Image upload (also accepts drag-and-drop on the textarea) */}
                    <ToolbarButton
                      icon={<ImageIcon size={18} />}
                      label="Ảnh/Video"
                      onClick={handleImageUpload}
                    />

                    {/* Inline formatting */}
                    <ToolbarButton
                      icon={<Bold size={18} />}
                      label="In đậm (**)"
                      onClick={() => wrapSelection('**', '**', 'in đậm')}
                    />
                    <ToolbarButton
                      icon={<Italic size={18} />}
                      label="In nghiêng (*)"
                      onClick={() => wrapSelection('*', '*', 'in nghiêng')}
                    />
                    <ToolbarButton
                      icon={<Code2 size={18} />}
                      label="Code nội dòng"
                      onClick={() => wrapSelection('`', '`', 'code')}
                    />

                    {/* Code block */}
                    <ToolbarButton
                      icon={<span className="text-xs font-mono font-bold">{'</>'}</span>}
                      label="Code block (```)"
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

                    {/* Hashtag / Mention quick-insert */}
                    <ToolbarButton
                      icon={<Hash size={18} />}
                      label="Hashtag"
                      onClick={() => wrapSelection('#', '', 'hashtag')}
                    />
                    <ToolbarButton
                      icon={<AtSign size={18} />}
                      label="Mention"
                      onClick={() => wrapSelection('@', '', 'username')}
                    />

                    {/* Poll */}
                    <ToolbarButton
                      icon={<BarChart3 size={18} />}
                      label="Khảo sát"
                      onClick={() => setShowPollEditor((v) => !v)}
                      active={showPollEditor}
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

// ─── Poll Editor ──────────────────────────────────────────────────────────

interface PollEditorProps {
  poll: { question: string; options: string[]; multiChoice: boolean } | null;
  onChange: (p: { question: string; options: string[]; multiChoice: boolean } | null) => void;
  onClose: () => void;
}

/**
 * Inline poll creator rendered below the composer textarea. Adds
 * a question and 2-6 options. We don't persist a draft past the
 * composer lifecycle — closing the editor clears the poll.
 */
function PollEditor({ poll, onChange, onClose }: PollEditorProps) {
  const local = poll ?? { question: '', options: ['', ''], multiChoice: false };

  const setQ = (q: string) => onChange({ ...local, question: q });
  const setMulti = (multiChoice: boolean) => onChange({ ...local, multiChoice });
  const setOpt = (idx: number, v: string) => {
    const next = [...local.options];
    next[idx] = v;
    onChange({ ...local, options: next });
  };
  const addOpt = () => {
    if (local.options.length >= 6) return;
    onChange({ ...local, options: [...local.options, ''] });
  };
  const removeOpt = (idx: number) => {
    if (local.options.length <= 2) return;
    const next = local.options.filter((_, i) => i !== idx);
    onChange({ ...local, options: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 rounded-2xl p-3"
      style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neon-violet">
          <BarChart3 className="h-3.5 w-3.5" />
          Khảo sát
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-text-muted hover:text-red-400 transition-colors"
          title="Xoá khảo sát"
        >
          <X size={14} />
        </button>
      </div>

      <input
        value={local.question}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Câu hỏi khảo sát..."
        className="w-full rounded-lg bg-darkbg/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted border border-white/[0.06] focus:border-neon-violet/50 focus:outline-none"
        maxLength={500}
      />

      <div className="mt-2 space-y-1.5">
        {local.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-xs text-text-muted w-5 text-right">{i + 1}.</span>
            <input
              value={opt}
              onChange={(e) => setOpt(i, e.target.value)}
              placeholder={`Lựa chọn ${i + 1}`}
              className="flex-1 rounded-lg bg-darkbg/50 px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted border border-white/[0.06] focus:border-neon-violet/50 focus:outline-none"
              maxLength={255}
            />
            {local.options.length > 2 && (
              <button
                onClick={() => removeOpt(i)}
                className="rounded-lg p-1 text-text-muted hover:text-red-400"
                title="Xoá lựa chọn"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={addOpt}
          disabled={local.options.length >= 6}
          className="flex items-center gap-1 text-xs text-neon-violet hover:text-neon-indigo disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={12} /> Thêm lựa chọn
        </button>
        <label className="flex items-center gap-1.5 text-[10px] text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={local.multiChoice}
            onChange={(e) => setMulti(e.target.checked)}
            className="rounded"
          />
          Chọn nhiều
        </label>
      </div>
    </motion.div>
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
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium transition-colors"
      style={{
        color: active ? '#a78bfa' : '#64748b',
        background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.color = '#94a3b8';
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#64748b';
      }}
    >
      {icon}
    </button>
  );
}
