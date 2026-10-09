'use client';

/**
 * Ô soạn tin của kênh chat (và của luồng trả lời).
 *   Enter gửi · Shift+Enter xuống dòng · ↑ (ô trống) sửa tin cuối của mình · Esc huỷ sửa / đóng gợi ý.
 *   @ ⇒ gợi ý người trong kênh (↑↓ chọn, Enter/Tab chèn) · nút emoji · đính kèm (chọn / kéo-thả / dán ảnh) · voice note
 *   (≤ 3 phút, dùng lại VoiceRecorder + useGhiAm của K-1). Nháp lưu THEO KÊNH (localStorage, bọc try/catch).
 *   Gõ IME (tiếng Việt Telex/VNI, tiếng Nhật…) đang ghép chữ thì Enter KHÔNG gửi.
 */

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type ClipboardEvent, type DragEvent, type KeyboardEvent } from 'react';
import { toast } from 'sonner';
import { Mic, Paperclip, SendHorizontal, Smile, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError } from '@/lib/work-api';
import { chatApi, CHAT_MAX_BODY, CHAT_MAX_FILES, type ChatFile, type ChatMember, type ChatMessage } from '@/lib/work-chat-api';
import { applyMention, mentionQuery } from '@/lib/work-chat-rules';
import EmojiPickerPopover from '../../messaging/EmojiPickerPopover';
import { VoiceRecorder } from '../comments/CommentFiles';
import { Spinner, UserAvatar } from '../ui';

interface Draft { key: string; name: string; pct: number; voiceMs?: number; file?: ChatFile; error?: string }

const draftKey = (pid: number, cid: number, thread?: number | null) => `ctw.chat.draft.${pid}.${cid}${thread ? `.t${thread}` : ''}`;
function readDraft(k: string): string {
  try { return window.localStorage.getItem(k) ?? ''; } catch { return ''; }
}
function writeDraft(k: string, v: string) {
  try { if (v.trim()) window.localStorage.setItem(k, v); else window.localStorage.removeItem(k); } catch { /* riêng tư / đầy */ }
}

export interface ComposerHandle { focus: () => void; insert: (text: string) => void }

export interface ComposerProps {
  pid: number; cid: number; channelName: string; threadId?: number | null;
  members: ChatMember[]; canPost: boolean; readOnlyReason?: string;
  editing: ChatMessage | null;
  onSend: (input: { body: string; fileIds: number[]; files: ChatFile[] }) => void;
  onSaveEdit: (m: ChatMessage, body: string) => void;
  onCancelEdit: () => void;
  onEditLast?: () => void;
  onTyping?: () => void;
  compact?: boolean;
}

export const Composer = forwardRef<ComposerHandle, ComposerProps>(function Composer(props, ref) {
  const { pid, cid, channelName, threadId, members, canPost, readOnlyReason, editing, onSend, onSaveEdit, onCancelEdit, onEditLast, onTyping, compact } = props;
  const k = draftKey(pid, cid, threadId);
  const [text, setText] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [mention, setMention] = useState<{ start: number; query: string } | null>(null);
  const [sel, setSel] = useState(0);
  const [emoji, setEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [dragging, setDragging] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const emojiBtn = useRef<HTMLButtonElement>(null);
  const composing = useRef(false);

  // Đổi kênh/luồng ⇒ nạp nháp của nó; đang sửa ⇒ nạp thân tin.
  useEffect(() => {
    setText(editing ? editing.body : readDraft(k));
    setDrafts([]);
    setMention(null);
  }, [k, editing]);
  useEffect(() => { if (!editing) writeDraft(k, text); }, [k, text, editing]);
  // Tự giãn chiều cao theo chữ (tối đa ~10 dòng).
  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [text]);
  useEffect(() => { if (editing) setTimeout(() => ta.current?.focus(), 0); }, [editing]);

  useImperativeHandle(ref, () => ({
    focus: () => ta.current?.focus(),
    insert: (s: string) => insertAt(s),
  }));

  const suggestions = useMemo(() => {
    if (!mention) return [];
    const q = mention.query.toLowerCase();
    return members.filter((m) => !q || m.username.toLowerCase().includes(q) || userName(m).toLowerCase().includes(q)).slice(0, 8);
  }, [mention, members]);

  const insertAt = (s: string) => {
    const el = ta.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const next = text.slice(0, start) + s + text.slice(end);
    setText(next);
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(start + s.length, start + s.length); });
  };

  const pick = (m: ChatMember) => {
    if (!mention) return;
    const r = applyMention(text, mention, m.username);
    setText(r.text);
    setMention(null);
    requestAnimationFrame(() => { ta.current?.focus(); ta.current?.setSelectionRange(r.caret, r.caret); });
  };

  const room = () => CHAT_MAX_FILES - drafts.filter((d) => !d.error).length;
  const patch = (key: string, p: Partial<Draft>) => setDrafts((ds) => ds.map((d) => (d.key === key ? { ...d, ...p } : d)));
  const addFiles = useCallback((list: FileList | File[]) => {
    const arr = Array.from(list);
    const files = arr.slice(0, Math.max(0, CHAT_MAX_FILES - drafts.filter((d) => !d.error).length));
    if (arr.length > files.length) toast.error(`A message can have at most ${CHAT_MAX_FILES} files`);
    for (const f of files) {
      const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setDrafts((ds) => [...ds, { key, name: f.name || 'pasted-image.png', pct: 0 }]);
      chatApi.uploadFile(pid, cid, f, (pct) => patch(key, { pct }))
        .then((file) => patch(key, { file, pct: 100 }))
        .catch((err) => { patch(key, { error: workError(err, 'Upload failed') }); toast.error(workError(err, `Could not upload ${f.name}`)); });
    }
  }, [pid, cid, drafts]);
  const addVoice = useCallback((f: File, ms: number) => {
    if (room() <= 0) { toast.error(`A message can have at most ${CHAT_MAX_FILES} files`); return; }
    const key = `v${Date.now()}`;
    setDrafts((ds) => [...ds, { key, name: 'Voice note', pct: 0, voiceMs: ms }]);
    chatApi.uploadVoice(pid, cid, f, ms)
      .then((file) => patch(key, { file, pct: 100 }))
      .catch((err) => { patch(key, { error: workError(err, 'Upload failed') }); toast.error(workError(err, 'Could not save the voice note')); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, cid, drafts]);
  const removeDraft = (key: string) => {
    const d = drafts.find((x) => x.key === key);
    setDrafts((ds) => ds.filter((x) => x.key !== key));
    if (d?.file) void chatApi.discardFile(pid, d.file.id).catch(() => undefined);
  };

  const uploading = drafts.some((d) => !d.file && !d.error);
  const ready = drafts.filter((d) => d.file && !d.error).map((d) => d.file!);
  const canSend = canPost && !uploading && (text.trim().length > 0 || ready.length > 0) && text.length <= CHAT_MAX_BODY;

  const submit = () => {
    if (editing) {
      if (text.trim() === editing.body.trim()) { onCancelEdit(); return; }
      if (!text.trim() && !editing.files.length) { toast.error('A message cannot be empty — delete it instead'); return; }
      onSaveEdit(editing, text);
      return;
    }
    if (!canSend) return;
    onSend({ body: text, fileIds: ready.map((f) => f.id), files: ready });
    setText('');
    setDrafts([]);
    writeDraft(k, '');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const ime = composing.current || e.nativeEvent.isComposing || e.keyCode === 229;
    if (mention && suggestions.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => (s + 1) % suggestions.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => (s - 1 + suggestions.length) % suggestions.length); return; }
      if ((e.key === 'Enter' || e.key === 'Tab') && !ime) { e.preventDefault(); pick(suggestions[Math.min(sel, suggestions.length - 1)]); return; }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setMention(null); return; }
    }
    if (e.key === 'Escape' && editing) { e.preventDefault(); e.stopPropagation(); onCancelEdit(); return; }
    if (e.key === 'ArrowUp' && !text && !editing && onEditLast) { e.preventDefault(); onEditLast(); return; }
    if (e.key === 'Enter' && !e.shiftKey && !ime) { e.preventDefault(); submit(); }
  };

  const onChange = (v: string) => {
    setText(v);
    const caret = ta.current?.selectionStart ?? v.length;
    const mq = mentionQuery(v, caret);
    setMention(mq);
    setSel(0);
    if (v.trim()) onTyping?.();
  };

  const onPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const imgs = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'));
    if (imgs.length && !editing) { e.preventDefault(); addFiles(imgs); }
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (!canPost || editing) return;
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  if (!canPost) {
    return (
      <div className="border-t border-[var(--w-border)] px-4 py-3 text-center text-[13px] text-[var(--w-text-2)] sm:px-5" role="status">
        {readOnlyReason ?? 'You can read this channel but not post in it.'}
      </div>
    );
  }

  return (
    <div
      className={cn('relative shrink-0 px-3 pb-3 pt-1.5 sm:px-4', compact && 'px-3')}
      onDragOver={(e) => { if (e.dataTransfer?.types?.includes('Files')) { e.preventDefault(); setDragging(true); } }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      {mention && suggestions.length > 0 && (
        <ul role="listbox" aria-label="Mention someone" className="absolute bottom-full left-3 right-3 z-20 mb-1 max-h-[260px] overflow-y-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-raised)] p-1 sm:left-4 sm:right-auto sm:w-[320px]" style={{ boxShadow: 'var(--w-shadow-pop)' }}>
          {suggestions.map((m, i) => (
            <li key={m.id} role="option" aria-selected={i === sel}>
              <button type="button" className={cn('flex h-9 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px]', i === sel ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}
                onMouseDown={(e) => { e.preventDefault(); pick(m); }}>
                <UserAvatar user={m} size={20} />
                <span className="min-w-0 flex-1 truncate">{userName(m)}</span>
                <span className="shrink-0 text-[11.5px] text-[var(--w-text-3)]">@{m.username}</span>
                {m.online && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--w-green)]" aria-label="online" />}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={cn('rounded-[10px] border bg-[var(--w-panel)] transition-colors', dragging ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border-strong)] focus-within:border-[var(--w-accent-border)] focus-within:shadow-[0_0_0_3px_var(--w-accent-soft)]')}>
        {editing && (
          <div className="flex items-center gap-2 border-b border-[var(--w-border)] px-3 py-1.5 text-[12px] text-[var(--w-text-2)]">
            <span className="font-medium text-[var(--w-accent-text)]">Editing message</span>
            <span className="text-[var(--w-text-3)]">Enter to save · Esc to cancel</span>
            <button type="button" className="ml-auto w-btn w-btn-ghost w-btn-icon w-btn-sm h-6 w-6" aria-label="Cancel editing" onClick={onCancelEdit}><X size={12} /></button>
          </div>
        )}
        {drafts.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 px-2.5 pt-2" aria-label="Files to send">
            {drafts.map((d) => (
              <li key={d.key} className={cn('w-file-chip', d.error && 'w-file-chip-error')}>
                {d.voiceMs !== undefined ? <Mic size={13} className="shrink-0 text-[var(--w-accent-text)]" aria-hidden="true" /> : <Paperclip size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />}
                <span className="min-w-0 max-w-[200px] truncate">{d.voiceMs !== undefined ? `Voice note · ${Math.round(d.voiceMs / 1000)}s` : d.name}</span>
                {d.error ? <span className="shrink-0 text-[11px] text-[var(--w-red-text)]">Failed</span> : !d.file ? <span className="shrink-0 text-[11px] tabular-nums text-[var(--w-text-3)]" aria-live="polite">{d.pct}%</span> : null}
                <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm h-5 w-5" aria-label={`Remove ${d.name}`} onClick={() => removeDraft(d.key)}><X size={11} /></button>
              </li>
            ))}
          </ul>
        )}
        <label className="sr-only" htmlFor={`chat-input-${cid}-${threadId ?? 0}`}>{threadId ? 'Reply in thread' : `Message #${channelName}`}</label>
        <textarea
          id={`chat-input-${cid}-${threadId ?? 0}`}
          ref={ta}
          value={text}
          rows={1}
          maxLength={CHAT_MAX_BODY + 50}
          placeholder={threadId ? 'Reply…' : `Message #${channelName}`}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={() => { composing.current = false; }}
          onBlur={() => setTimeout(() => setMention(null), 120)}
          className="block max-h-[240px] min-h-[40px] w-full resize-none bg-transparent px-3 py-2.5 text-[14px] leading-[1.45] text-[var(--w-text)] outline-none placeholder:text-[var(--w-text-3)]"
          data-testid="chat-input"
          aria-describedby={`chat-hint-${cid}-${threadId ?? 0}`}
        />
        <div className="flex items-center gap-0.5 px-1.5 pb-1.5">
          {!editing && (
            <>
              <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Attach files" title="Attach files (or drop / paste)" onClick={() => fileInput.current?.click()}><Paperclip size={15} /></button>
              <input ref={fileInput} type="file" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }} />
              <VoiceRecorder onRecorded={addVoice} onActive={setRecording} />
            </>
          )}
          <button ref={emojiBtn} type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Insert emoji" title="Emoji" aria-expanded={emoji} onClick={() => setEmoji((o) => !o)}><Smile size={15} /></button>
          <EmojiPickerPopover open={emoji} onClose={() => setEmoji(false)} anchorRef={emojiBtn} onPick={(e) => { insertAt(e); setEmoji(false); }} />
          <span id={`chat-hint-${cid}-${threadId ?? 0}`} className="ml-1 hidden truncate text-[11px] text-[var(--w-text-3)] md:inline">
            {text.length > CHAT_MAX_BODY - 400 ? `${text.length}/${CHAT_MAX_BODY}` : 'Enter to send · Shift+Enter for a new line · ↑ to edit your last message · **bold** `code`'}
          </span>
          <button
            type="button"
            className="w-btn w-btn-primary w-btn-sm ml-auto h-8 gap-1.5 px-3"
            disabled={editing ? false : !canSend || recording}
            onClick={submit}
            aria-label={editing ? 'Save edit' : 'Send message'}
            data-testid="chat-send"
          >
            {uploading ? <Spinner size={12} /> : <SendHorizontal size={14} />}
            <span className="max-sm:hidden">{editing ? 'Save' : 'Send'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});
