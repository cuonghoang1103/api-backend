'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Video,
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
  Youtube,
  Link as LinkIcon,
  FileText,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  Paperclip,
  Code,
  Sparkles,
} from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { UserAvatar } from '@/components/common/UserAvatar';
import { socialApi, fileApi, socialUserApi, videoCategoriesApi } from '@/lib/api';
import { useComposerDraft } from '@/hooks/useComposerDraft';
import { pickAiTemplate } from '@/lib/aiWriteTemplates';
import MentionAutocomplete from '@/components/social/MentionAutocomplete';
import MusicPickerModal from '@/components/social/MusicPickerModal';
import VideoCoverPicker from '@/components/social/VideoCoverPicker';
import type { MediaUploadItem } from '@/types/social';
import { toast } from 'sonner';
import { Music as MusicIcon } from 'lucide-react';

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
    composerYouTubeUrl, composerType, composerVideoCategoryId,
    composerVideoShowInAll,
    composerMusicTrack,
    setComposerContent: setComposerContentRaw, setComposerVisibility, setComposerPoll, setComposerYouTubeUrl,
    setComposerType, setComposerVideoCategoryId, setComposerVideoShowInAll,
    // Phase 5: music picker now writes the picked track + snippet
    // bounds into the store (not local state). Previously the
    // local state was used which meant the value never made it
    // to submitPost() and the post went out without music.
    setComposerMusicTrack,
    addComposerMedia, removeComposerMedia, submitPost, clearComposer,
  } = useSocialStore();

  // Phase 5 home upgrade: composer draft auto-save. On first mount
  // we hydrate from localStorage so a half-written post survives
  // reloads / tab-switches. On every content change we schedule a
  // debounced write (1.5s of inactivity). On a successful submit
  // we clear the slot so the next session starts blank.
  //
  // Implementation: we wrap the store setter ONCE here. Every
  // existing call site that does setComposerContent(next) in this
  // file gets the draft-persist behaviour for free (markdown
  // helpers, paste, AI Write, code block, etc.) without us
  // touching each one.
  const { initialContent, scheduleSave, clearDraft } = useComposerDraft();
  const setComposerContent = useCallback(
    (next: string) => {
      setComposerContentRaw(next);
      scheduleSave(next);
    },
    [setComposerContentRaw, scheduleSave],
  );
  useEffect(() => {
    if (initialContent && !composerContent) {
      // Restore on mount when the store is empty. We call the raw
      // setter so the restoration itself doesn't trigger a save
      // cycle (the persisted content is identical to what we just
      // loaded, so it'd be a no-op write anyway).
      setComposerContentRaw(initialContent);
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the local draft in sync with the store (e.g. after a
  // successful post, clearComposer resets the store to '').
  useEffect(() => {
    setYoutubeDraft(composerYouTubeUrl);
  }, [composerYouTubeUrl]);

  // ─── Browser beforeunload guard ──────────────────────────────────────────
  // Warn the user if they try to close the tab / navigate away while a
  // video is still uploading. This prevents the "orphaned upload" case
  // where the user loses both the video AND their post content.
  // The guard is only active when there are pending uploads (progress < 100).
  useEffect(() => {
    const hasPendingUploads = composerMedia.some((m) => m.progress < 100);
    if (!hasPendingUploads) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Modern browsers require a returnValue to show the dialog.
      // The message itself is ignored in most browsers (security policy)
      // but we keep it for older Safari compatibility.
      e.preventDefault();
      e.returnValue = 'Bạn đang tải video lên. Nếu rời trang, video sẽ bị mất và bài viết sẽ trống.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [composerMedia]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [showPollEditor, setShowPollEditor] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // Phase 3 — YouTube URL. We keep this in component state (not
  // the store) because it's tiny and only relevant while the
  // composer is mounted. The actual store value (which is sent
  // with the post) is mirrored via setComposerYouTubeUrl.
  const [youtubeDraft, setYoutubeDraft] = useState('');
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  // Video categories (fetched once) for the composer's category picker.
  const [videoCategories, setVideoCategories] = useState<Array<{ id: number; name: string }>>([]);
  // Phase 3 add — Instagram-style music sticker. The
  // composer fetches the music library when the user opens
  // the picker. The picked track (id, title, artist, cover,
  // audioUrl, start/end snippet bounds) is written straight
  // into the STORE (composerMusicTrack) so submitPost picks
  // it up on POST. There's no separate local state because
  // the previous version had it disconnected from the store
  // and posts went out silently without the music.
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  // Generic file attachments (zip, md, pdf, source files, …) capped
  // at 10MB per file. The same handleFiles pipeline uploads them;
  // the post card just renders a download row.
  const attachInputRef = useRef<HTMLInputElement>(null);

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

  // Inserts a fenced code block at the caret. The block uses the
  // triple-backtick markdown syntax that the renderer already
  // understands (see CodeBlock.tsx) and sets the language to
  // `tsx` by default since that's what most people paste. The
  // user can change the language tag after the block is
  // inserted.
  const insertCodeBlock = useCallback(
    (lang: string = 'tsx') => {
      const ta = textareaRef.current;
      const start = ta?.selectionStart ?? composerContent.length;
      const end = ta?.selectionEnd ?? composerContent.length;
      // Add blank lines around the block so the surrounding text
      // doesn't get concatenated onto the fence markers.
      const prefix = composerContent.length > 0 && !composerContent.endsWith('\n\n') ? '\n\n' : '';
      const block = `${prefix}\`\`\`${lang}\n\n\`\`\`\n`;
      const next = composerContent.slice(0, start) + block + composerContent.slice(end);
      setComposerContent(next);
      requestAnimationFrame(() => {
        if (!ta) return;
        ta.focus();
        // Place the caret between the opening fence and closing
        // fence so the user can start typing/pasting code
        // immediately.
        const cursor = start + prefix.length + 4 + lang.length + 1;
        ta.setSelectionRange(cursor, cursor);
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

  // ─── Clipboard paste (Cmd/Ctrl+V) ────────────────────────────────
  // Pasting a screenshot / copied image (or any file) into the
  // textarea routes it through the same handleFiles pipeline as the
  // file picker and drag-and-drop — signed upload, progress, preview,
  // rollback all shared. Plain text pastes are untouched: we only
  // preventDefault when the clipboard actually carries files, so the
  // browser would otherwise paste the file NAME as text.
  const handlePaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData?.files ?? []);
    if (files.length === 0) return;
    e.preventDefault();
    setIsExpanded(true);
    handleFiles(files);
    toast.success(files.length === 1 ? 'Đã dán ảnh — đang tải lên…' : `Đã dán ${files.length} tệp — đang tải lên…`);
  };

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Separate button for short vertical videos. We use a dedicated
  // <input type="file" accept="video/*"> so the user can be
  // intentional about it (file pickers hide non-matching types
  // on mobile). The upload pipeline is shared with images via
  // handleFiles — it just looks at the file's MIME type.
  const handleVideoUpload = useCallback(() => {
    videoInputRef.current?.click();
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
  //
  // Real upload flow:
  //   1. POST /api/v1/files/upload with the File and `category`
  //      (videos use category='videos' so the backend applies the
  //      video size/format allow-list).
  //   2. Backend returns { url, ... } pointing to the stored file.
  //   3. We replace the local `preview` blob URL with the real
  //      `url` and emit progress 100.
  //
  // The earlier implementation assigned `url = preview` (a blob
  // URL) which is only valid in the user's own browser — other
  // viewers saw broken images and the renderer crashed on
  // "reading 'length' of undefined" once it tried to render
  // the post.
  const handleFiles = useCallback(
    async (files: File[]) => {
      const limited = files.slice(0, 6);
      for (const file of limited) {
        if (file.size > 150 * 1024 * 1024) {
          setPostError('File too large (max 150MB)');
          continue;
        }

        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');
        // Anything that's not a recognised image / video goes
        // through the FILE pipeline so the post card can render a
        // download link instead of a media tile. 10MB cap to keep
        // a single post from holding 150MB of binaries.
        const isFile = !isImage && !isVideo;
        const FILE_MAX = 10 * 1024 * 1024;
        if (isFile && file.size > FILE_MAX) {
          setPostError(`Tệp "${file.name}" vượt quá 10MB`);
          continue;
        }
        const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        // For files we don't need an object URL preview — the chip
        // shows the icon + filename + size. For images / videos we
        // keep the local blob URL so the preview renders before
        // the upload completes.
        const preview = isFile ? '' : URL.createObjectURL(file);
        const item: MediaUploadItem = {
          id,
          file,
          preview,
          type: isVideo ? 'VIDEO' : isFile ? 'FILE' : 'IMAGE',
          progress: 0,
          fileName: file.name,
        };
        addComposerMedia([item]);

        // Get dimensions for images so the renderer can lay out
        // the grid correctly.
        if (isImage) {
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

        // Real upload. We report a coarse progress while the
        // request is in flight — browser-side XHR progress would
        // be more accurate but axios progress events require
        // additional wiring; the >45MB direct-to-R2 path has real progress.
        useSocialStore.setState((s) => ({
          composerMedia: s.composerMedia.map((m) => (m.id === id ? { ...m, progress: 25 } : m)),
        }));
        try {
          // Files use category='documents' (the only existing
          // bucket that accepts everything). Images and videos
          // keep their tight allow-lists so the backend still
          // rejects arbitrary blobs being smuggled in.
          //
          // Big videos (>45MB) go DIRECTLY to R2 via a presigned PUT —
          // the multipart path flows through the Cloudflare proxy, which
          // caps request bodies at 100MB. Falls back to multipart when
          // the backend isn't on R2 (local dev).
          const category = isFile ? 'documents' : isVideo ? 'video' : 'images';
          const useDirect = isVideo && file.size > 45 * 1024 * 1024;
          const res = useDirect
            ? await fileApi
                .uploadVideoDirect(file, (pct) => {
                  useSocialStore.setState((s) => ({
                    composerMedia: s.composerMedia.map((m) =>
                      m.id === id ? { ...m, progress: Math.max(25, pct) } : m
                    ),
                  }));
                })
                .catch((err) => {
                  // PRESIGN_UNAVAILABLE (or CORS hiccup) → try the normal
                  // path; it works up to the proxy limit.
                  console.warn('Direct R2 upload failed, falling back to multipart:', err);
                  return fileApi.upload(file, category);
                })
            : await fileApi.upload(file, category);
          const url = res.data?.data?.url;
          const serverThumbnail = res.data?.data?.thumbnail; // Auto-generated video thumbnail
          if (!url) {
            throw new Error('Upload response missing url');
          }
          useSocialStore.setState((s) => ({
            composerMedia: s.composerMedia.map((m) =>
              m.id === id
                ? {
                    ...m,
                    progress: 100,
                    url,
                    // For videos, use the server-generated thumbnail; for
                    // images, the uploaded URL. NEVER fall back to the blob
                    // preview here — `thumbnail` is persisted with the post,
                    // and blob: URLs die with the browser session (8 posts
                    // shipped broken posters this way, 2026-06-20→27). The
                    // composer tile renders from `preview`, so no thumbnail
                    // is fine — the player just starts without a poster.
                    thumbnail: isVideo ? (serverThumbnail || undefined) : url
                  }
                : m
            ),
          }));
        } catch (err: any) {
          // Roll back: drop the failed item so it never ships
          // with the post and surface a toast.
          useSocialStore.setState((s) => ({
            composerMedia: s.composerMedia.filter((m) => m.id !== id),
          }));
          try {
            if (preview) URL.revokeObjectURL(preview);
          } catch {}
          const msg = err?.userFriendlyMessage || err?.message || 'Upload failed';
          toast.error(`Không thể tải lên ${file.name}: ${msg}`);
        }
      }
    },
    [addComposerMedia],
  );

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
      // Phase 5 home upgrade: clear the localStorage draft now that
      // the post is committed. If submit fails we keep the draft so
      // the user can retry without losing their text.
      clearDraft();
      setIsExpanded(false);
      setShowPollEditor(false);
    } catch (err: unknown) {
      setPostError(err instanceof Error ? err.message : 'Failed to post');
    }
  };

  // ─── Post button gate ─────────────────────────────────────────────
  // The button is enabled only when:
  //   1. The user has typed text OR attached media
  //   2. No media is currently uploading (progress < 100)
  //      → prevents empty posts when user clicks Post before a large
  //        video finishes uploading to R2
  //   3. We are not already in the posting state
  const isUploadingMedia = composerMedia.some((m) => m.progress < 100);
  const hasContent = composerContent.trim() || composerMedia.length > 0;
  const canPost = hasContent && !isUploadingMedia && !isPosting;

  // Load active video categories once (for the composer's category picker).
  useEffect(() => {
    let cancelled = false;
    videoCategoriesApi
      .list()
      .then((res: any) => {
        if (!cancelled) setVideoCategories(res.data?.data ?? []);
      })
      .catch(() => { /* non-fatal — picker just stays empty */ });
    return () => { cancelled = true; };
  }, []);

  return (
    // On mobile, an expanded composer becomes a full-screen "create post"
    // sheet (Facebook-style) so typing/attaching isn't cramped inside the
    // feed. ≥sm it stays an inline card. Additive wrapper only — the
    // composer internals are untouched.
    <div
      className={
        isExpanded
          ? 'max-sm:fixed max-sm:inset-0 max-sm:z-[70] max-sm:overflow-y-auto max-sm:bg-[var(--bg-primary)] max-sm:p-2 max-sm:pb-[max(1rem,env(safe-area-inset-bottom))] max-sm:pt-[max(0.5rem,env(safe-area-inset-top))]'
          : ''
      }
    >
      <motion.div
        layout
        // Phase 5 home upgrade: smoother expand animation.
        // - `layout` keeps the composer from jumping when tools
        //   (poll editor, media preview, etc.) appear.
        // - The border colour + glow + accent line all transition
        //   together via a single spring so the composer "breathes"
        //   when the user focuses the textarea rather than snapping
        //   open like a modal.
        transition={{ layout: { type: 'spring', stiffness: 280, damping: 28 } }}
        className="overflow-hidden rounded-3xl"
        style={{
          background: 'var(--bg-card)',
          border: isExpanded ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--border-color)',
          backdropFilter: 'blur(20px)',
          boxShadow: isExpanded
            ? '0 8px 32px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'inset 0 1px 0 rgba(255,255,255,0.04)',
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
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
            {/* Logged-in user's avatar, links to own profile */}
            <UserAvatar size={40} linkToProfile ariaLabel="Trang cá nhân của bạn" />

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={composerContent}
                onChange={handleContentChange}
                onPaste={handlePaste}
                onFocus={() => setIsExpanded(true)}
                placeholder="Bạn đang nghĩ gì thế?"
                rows={1}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-sm"
                style={{ color: 'var(--text-primary)' }}
              />

              {/* AI Write shortcut — sits inside the textarea
                  wrapper, anchored to the bottom-right so it
                  never overlaps typed text. Phase 5 home upgrade:
                  now picks from a curated bank of 16 contextual
                  templates (share / ask / learn / goal / thought)
                  instead of 4 random openers. The next iteration
                  can swap pickAiTemplate() for a real LLM call
                  without changing the UI contract. */}
              {composerContent.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const tpl = pickAiTemplate();
                    setComposerContent(`${tpl.emoji} ${tpl.text}`);
                    requestAnimationFrame(() => {
                      textareaRef.current?.focus();
                      const ta = textareaRef.current;
                      if (ta) {
                        const pos = ta.value.length;
                        ta.setSelectionRange(pos, pos);
                        adjustTextareaHeight();
                      }
                    });
                    toast.success('AI Write đã tạo gợi ý — tiếp tục soạn nhé!');
                  }}
                  className="absolute bottom-1.5 right-2 flex min-h-[32px] items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(34,211,238,0.18))',
                    color: '#c4b5fd',
                    border: '1px solid rgba(139,92,246,0.35)',
                  }}
                  title="AI Write — gợi ý nội dung theo ngữ cảnh"
                  aria-label="AI Write"
                >
                  <Sparkles size={11} className="animate-pulse" />
                  AI Write
                </button>
              )}

              {/* Media preview */}
              <AnimatePresence>
                {composerMedia.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <MediaPreview
      media={composerMedia}
      onRemove={removeComposerMedia}
      onSelectCover={(itemId, thumbnailUrl) => {
        useSocialStore.setState((s) => ({
          composerMedia: s.composerMedia.map((m) =>
            m.id === itemId ? { ...m, thumbnail: thumbnailUrl } : m,
          ),
        }));
      }}
    />
    {/* TikTok-style cover picker for single video */}
    {(() => {
      const firstVideo = composerMedia.find((m) => m.type === 'VIDEO' && m.url);
      if (!firstVideo || !firstVideo.url) return null;
      return (
        <VideoCoverPicker
          key={firstVideo.id}
          itemId={firstVideo.id}
          videoUrl={firstVideo.url}
          serverThumbnail={firstVideo.thumbnail}
          currentThumbnail={firstVideo.thumbnail}
          onSelect={(thumb) => {
            useSocialStore.setState((s) => ({
              composerMedia: s.composerMedia.map((m) =>
                m.id === firstVideo.id ? { ...m, thumbnail: thumb } : m,
              ),
            }));
          }}
        />
      );
    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* YouTube URL preview chip — shows the user that a
                  YouTube embed is queued. Clicking the X clears it. */}
              <AnimatePresence>
                {composerYouTubeUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <Youtube className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="flex-1 min-w-0 truncate text-xs text-text-secondary">
                      {composerYouTubeUrl}
                    </span>
                    <button
                      onClick={() => {
                        setComposerYouTubeUrl('');
                        setYoutubeDraft('');
                      }}
                      className="rounded-lg p-1 text-text-muted transition-colors bg-theme-hover hover:text-red-400"
                      title="Bỏ đính kèm"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content-type picker — tells the post which feed tab it
                  belongs to (Bài viết / Video / File). Defaults to Bài
                  viết; the server still derives a sensible type if the
                  user attaches video/file without switching. Only shown
                  once the composer is expanded to keep the collapsed
                  state minimal. */}
              {isExpanded && (
                <div
                  role="radiogroup"
                  aria-label="Loại bài đăng"
                  className="mt-3 inline-flex items-center gap-1 rounded-full border border-theme-light bg-theme-surface p-1"
                >
                  {([
                    { value: 'POST', label: 'Bài viết', Icon: FileText },
                    { value: 'VIDEO', label: 'Video', Icon: Video },
                    { value: 'FILE', label: 'File', Icon: Paperclip },
                  ] as const).map(({ value, label, Icon }) => {
                    const active = composerType === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setComposerType(value)}
                        className={`flex min-h-[32px] items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors ${
                          active
                            ? 'bg-neon-violet/20 text-violet-theme ring-1 ring-neon-violet/40'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Video category picker — only for VIDEO posts. Lets the
                  poster classify the clip (IT / Game / Music…) so it shows
                  up under the matching feed pill. Categories are managed
                  in the admin panel; when there are none the picker is
                  hidden entirely. */}
              {isExpanded && composerType === 'VIDEO' && videoCategories.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[12.5px] font-medium text-text-secondary">Danh mục</label>
                    <select
                      value={composerVideoCategoryId ?? ''}
                      onChange={(e) => setComposerVideoCategoryId(e.target.value ? Number(e.target.value) : null)}
                      className="min-h-[32px] rounded-full border border-theme-light bg-theme-surface px-3 py-1 text-[12.5px] text-text-primary outline-none focus:ring-1 focus:ring-neon-violet/40"
                    >
                      <option value="">— Chưa phân loại —</option>
                      {videoCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* "Hiện ở mục Tất cả" — only offered once a category is
                      picked (unchecking without a category would make the
                      video invisible everywhere; the backend forces it to
                      true in that case anyway). Checked by default so the
                      existing behaviour is a no-op unless the user opts out. */}
                  {composerVideoCategoryId != null && (
                    <label
                      className="flex min-h-[32px] cursor-pointer select-none items-center gap-1.5 text-[12.5px] font-medium text-text-secondary hover:text-text-primary"
                      title="Bỏ tích: video chỉ hiện trong danh mục đã chọn, không hiện ở mục Tất cả"
                    >
                      <input
                        type="checkbox"
                        checked={composerVideoShowInAll}
                        onChange={(e) => setComposerVideoShowInAll(e.target.checked)}
                        className="h-3.5 w-3.5 accent-violet-500"
                      />
                      Hiện ở mục Tất cả
                    </label>
                  )}
                </div>
              )}

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
                  className="mt-3 flex items-center justify-between max-sm:flex-wrap max-sm:gap-y-2"
                  style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}
                >
                  <div className="flex items-center gap-1 flex-wrap min-w-0">
                    {/* Image upload (also accepts drag-and-drop on the textarea) */}
                    <ToolbarButton
                      icon={<ImageIcon size={18} />}
                      label="Ảnh"
                      onClick={handleImageUpload}
                    />

                    {/* Short video upload (TikTok-style vertical clips).
                        Reuses the same upload pipeline as images — the
                        type is auto-detected from the file's MIME type. */}
                    <ToolbarButton
                      icon={<Video size={18} />}
                      label="Video ngắn"
                      onClick={handleVideoUpload}
                    />

                    {/* YouTube link — opens a tiny modal where the user
                        pastes a URL. The renderer embeds it inline. */}
                    <ToolbarButton
                      icon={<Youtube size={18} />}
                      label="YouTube"
                      onClick={() => setShowYouTubeModal(true)}
                      active={!!composerYouTubeUrl}
                    />

                    {/* Phase 3 add — Instagram-style music sticker.
                        Opens the music library picker; the selected
                        track flows into the post body and is
                        rendered as a sticker on the first media
                        tile by PostCard. Highlighted when a track
                        is already attached. */}
                    <ToolbarButton
                      icon={<MusicIcon size={18} />}
                      label="Nhạc"
                      onClick={() => setShowMusicPicker(true)}
                      active={!!composerMusicTrack}
                    />

                    {/* Generic file attachment (zip, md, pdf, source files,
                        …). The 10MB cap is enforced inside handleFiles. */}
                    <ToolbarButton
                      icon={<Paperclip size={18} />}
                      label="Tệp đính kèm"
                      onClick={() => attachInputRef.current?.click()}
                    />

                    {/* Code block — inserts a fenced ``` block at the
                        caret. Useful when pasting code from VSCode
                        alongside text — the renderer preserves monospace
                        + applies syntax highlighting. */}
                    <ToolbarButton
                      icon={<Code size={18} />}
                      label="Chèn khối code"
                      onClick={() => insertCodeBlock()}
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

                    {/* Poll — X/Twitter-style toggle pill with active
                        state and a small animated indicator. Click to
                        open the poll editor; click again to remove the
                        current poll draft. */}
                    <button
                      type="button"
                      onClick={() => setShowPollEditor((v) => !v)}
                      className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all shrink-0 max-sm:min-h-10 ${
                        showPollEditor
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40'
                          : 'text-text-secondary bg-theme-hover border border-transparent border-theme-light-hover'
                      }`}
                      title="Thêm khảo sát"
                    >
                      <BarChart3 size={15} />
                      <span>Khảo sát</span>
                      <AnimatePresence>
                        {showPollEditor && (
                          <motion.span
                            key="poll-dot"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="ml-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400"
                          />
                        )}
                      </AnimatePresence>
                    </button>

                    {/* Visibility */}
                    <div className="relative">
                      <button
                        onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors shrink-0 max-sm:min-h-10"
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
                              background: 'var(--bg-overlay)',
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
                                  color: 'var(--text-primary)',
                                }}
                              >
                                <option.icon size={16} style={{ color: option.color }} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{option.label}</p>
                                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
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
                  <div className="flex items-center gap-3 shrink-0">
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
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Cancel
                    </button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={!canPost}
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
                      ) : isUploadingMedia ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Đang tải video...
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

        {/* Hidden inputs — image picker and dedicated video picker.
            Both feed the same handleFiles pipeline which auto-detects
            the type from the file's MIME type. */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*,video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={handleFileChange}
        />
        {/* Generic file attachment input. No `accept` restriction
            so the user can pick zip, md, pdf, source files, etc.
            The 10MB cap is enforced inside handleFiles. */}
        <input
          ref={attachInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </motion.div>

      {/* YouTube URL modal — small popover that asks the user to
          paste a link. We accept any URL the YouTube IFrame API can
          play. The post card renderer extracts the video id and
          embeds it inline. */}
      <AnimatePresence>
        {showYouTubeModal && (
          <YouTubeModal
            initial={youtubeDraft}
            onClose={() => setShowYouTubeModal(false)}
            onSave={(url) => {
              setComposerYouTubeUrl(url);
              setYoutubeDraft(url);
              setShowYouTubeModal(false);
              if (url) {
                toast.success('Đã đính kèm video YouTube vào bài viết');
              } else {
                toast.success('Đã bỏ đính kèm video YouTube');
              }
            }}
          />
        )}

        {/* Phase 3 add — music sticker picker. The modal searches
            the music library and on selection we save the track
            + the trimmed snippet bounds to the composer store.
            The PostCard MusicSticker then renders the chosen
            track on the first media tile of the published post. */}
        <MusicPickerModal
          open={showMusicPicker}
          onClose={() => setShowMusicPicker(false)}
          onPick={(result) => {
            // Phase 5 fix — write into the STORE (not local state)
            // and include audioUrl + the trim bounds so the post
            // is actually published with the picked snippet.
            setComposerMusicTrack({
              id: result.musicTrackId,
              title: result.track.title,
              artist: result.track.artist,
              coverImage: result.track.coverImage ?? null,
              audioUrl: result.track.audioUrl ?? null,
              startSec: result.musicStartSec,
              endSec: result.musicEndSec,
            });
            toast.success('Đã chọn nhạc cho bài viết');
          }}
        />
      </AnimatePresence>

      {/* Phase 5 home upgrade: @mention autocomplete. Listens to
          the textarea and pops up while the user is typing an
          @-token. Picking an item replaces the @-token with the
          username + space and restores caret. Wrapped in enabled
          so the dropdown only mounts when the composer is
          actually expanded (saves the textarea listener churn). */}
      <MentionAutocomplete
        textareaRef={textareaRef}
        value={composerContent}
        onChange={setComposerContent}
        enabled={isExpanded}
      />
    </div>
  );
}

// ─── YouTube Modal ───────────────────────────────────────────────────────────

function YouTubeModal({
  initial,
  onClose,
  onSave,
}: {
  initial: string;
  onClose: () => void;
  onSave: (url: string) => void;
}) {
  const [value, setValue] = useState(initial);

  // Quick URL normaliser. Accepts:
  // - https://www.youtube.com/watch?v=ID
  // - https://youtu.be/ID
  // - https://www.youtube.com/shorts/ID
  // - raw ID (11 chars)
  const extractVideoId = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    // Already a bare ID (11 alphanumeric chars, dash or underscore)
    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
    let m = trimmed.match(/youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = trimmed.match(/youtube\.com\/(?:shorts|embed)\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return null;
  };

  const valid = value.trim() === '' || extractVideoId(value) !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl"
        style={{
          background: 'var(--bg-overlay)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-semibold text-text-primary">Đính kèm video YouTube</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted bg-theme-hover hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-text-muted">
            Dán liên kết YouTube (youtube.com/watch, youtu.be, hoặc /shorts). Video sẽ hiển thị inline trong bài viết.
          </p>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>
            <LinkIcon className="h-4 w-4 text-text-muted shrink-0" />
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 min-w-0 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
          {!valid && (
            <p className="text-xs text-red-400">Liên kết YouTube không hợp lệ.</p>
          )}
          <div className="flex items-center justify-end gap-2 pt-1">
            {value && (
              <button
                onClick={() => {
                  setValue('');
                  onSave('');
                }}
                className="rounded-xl px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-red-400"
              >
                Bỏ đính kèm
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors bg-theme-hover"
            >
              Huỷ
            </button>
            <button
              onClick={() => onSave(value.trim())}
              disabled={!valid}
              className="rounded-xl px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg, #ef4444, #f97316)' }}
            >
              Lưu
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
        className="w-full rounded-lg bg-theme-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted border border-theme-light focus:border-neon-violet/50 focus:outline-none"
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
              className="flex-1 rounded-lg bg-theme-surface px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted border border-theme-light focus:border-neon-violet/50 focus:outline-none"
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

// Compact icon based on the file extension. We only need a few
// buckets — the renderer is small and we just want a colour cue
// so users can spot PDFs vs source files vs archives at a glance.
function fileIconFor(name: string): { Icon: any; color: string } {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (['zip', 'rar', '7z', 'tar', 'gz', 'tgz'].includes(ext)) {
    return { Icon: FileArchive, color: '#f59e0b' };
  }
  if (['md', 'txt', 'log'].includes(ext)) {
    return { Icon: FileText, color: '#94a3b8' };
  }
  if (['pdf'].includes(ext)) {
    return { Icon: FileText, color: '#ef4444' };
  }
  if (['doc', 'docx', 'odt'].includes(ext)) {
    return { Icon: FileText, color: '#3b82f6' };
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return { Icon: FileSpreadsheet, color: '#22c55e' };
  }
  if (['js', 'jsx', 'ts', 'tsx', 'json', 'py', 'go', 'rs', 'java', 'rb', 'php', 'css', 'html', 'yml', 'yaml'].includes(ext)) {
    return { Icon: FileCode, color: '#a78bfa' };
  }
  return { Icon: FileText, color: '#64748b' };
}

function humanFileSize(bytes?: number): string {
  if (!bytes || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function FileChip({
  item,
  onRemove,
  size = 'md',
}: {
  item: MediaUploadItem;
  onRemove: () => void;
  size?: 'sm' | 'md';
}) {
  const { Icon, color } = fileIconFor(item.file?.name || '');
  const isSm = size === 'sm';
  return (
    <div
      className="relative flex items-center gap-2 rounded-xl p-2 pr-7"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-lg"
        style={{
          background: `${color}20`,
          color,
          width: isSm ? 28 : 32,
          height: isSm ? 28 : 32,
        }}
      >
        <Icon size={isSm ? 14 : 16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-text-primary" title={item.file?.name}>
          {item.file?.name || 'Tệp đính kèm'}
        </p>
        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {humanFileSize(item.file?.size)}
          {item.progress < 100 ? ` · ${item.progress}%` : ''}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-text-muted bg-theme-hover hover:text-red-400"
        title="Bỏ tệp"
      >
        <X size={11} />
      </button>
      {item.progress < 100 && (
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl"
          style={{ background: 'var(--bg-surface-active)' }}
        >
          <div className="h-full transition-all" style={{ width: `${item.progress}%`, background: color }} />
        </div>
      )}
    </div>
  );
}

function MediaPreview({
  media,
  onRemove,
  onSelectCover,
}: {
  media: MediaUploadItem[];
  onRemove: (id: string) => void;
  onSelectCover: (itemId: string, thumbnailUrl: string) => void;
}) {
  const imageVideo = media.filter((m) => m.type !== 'FILE');
  const files = media.filter((m) => m.type === 'FILE');

  return (
    <div className="mt-3 space-y-2">
      {imageVideo.length > 0 && (
        imageVideo.length === 1 ? (
          <div className="relative inline-block w-full overflow-hidden rounded-2xl" style={{ maxHeight: '300px' }}>
            {imageVideo[0].type === 'VIDEO' ? (
              <video src={imageVideo[0].preview} className="w-full object-cover" style={{ maxHeight: '300px' }} />
            ) : (
              <img
                src={imageVideo[0].preview}
                alt="Upload preview"
                className="w-full object-cover"
                style={{ maxHeight: '300px' }}
              />
            )}
            {imageVideo[0].progress < 100 && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)' }}
              >
                <div className="text-center">
                  <Loader2 size={24} className="mx-auto animate-spin text-white" />
                  <p className="mt-1 text-xs text-white">{imageVideo[0].progress}%</p>
                </div>
              </div>
            )}
            <button
              onClick={() => onRemove(imageVideo[0].id)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {imageVideo.slice(0, 6).map((item, i) => (
              <div key={item.id} className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '1' }}>
                {item.type === 'VIDEO' ? (
                  <video src={item.preview} className="h-full w-full object-cover" />
                ) : (
                  <img src={item.preview} alt="Upload" className="h-full w-full object-cover" />
                )}
                {i === 5 && imageVideo.length > 6 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white"
                    style={{ background: 'rgba(0,0,0,0.6)' }}
                  >
                    +{imageVideo.length - 5}
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
        )
      )}

      {files.length > 0 && (
        <div className={files.length === 1 ? '' : 'grid grid-cols-1 gap-1.5 sm:grid-cols-2'}>
          {files.map((item) => (
            <FileChip key={item.id} item={item} onRemove={() => onRemove(item.id)} size={files.length > 2 ? 'sm' : 'md'} />
          ))}
        </div>
      )}
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
      className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium transition-colors shrink-0 max-sm:min-h-10 max-sm:min-w-10 max-sm:justify-center"
      style={{
        color: active ? '#a78bfa' : '#64748b',
        background: active ? 'rgba(139,92,246,0.12)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.background = 'var(--bg-surface-hover)';
        e.currentTarget.style.color = 'var(--text-secondary)';
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
