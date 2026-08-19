'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  Check,
  Copy,
  Download,
  FolderInput,
  Hash,
  Info,
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import { notesApi } from '@/lib/api';
import type { NoteFull, NoteSubjectTree } from '@/types';

export type NoteMetadataPatch = Partial<Pick<
  NoteFull,
  'tags' | 'reviewDate' | 'subjectId' | 'chapterId'
>>;

interface Props {
  note: NoteFull;
  tree: NoteSubjectTree[];
  onSave: (patch: NoteMetadataPatch) => Promise<void>;
  onDuplicate: () => Promise<void>;
}

function dateTimeLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function NotePropertiesPanel({ note, tree, onSave, onDuplicate }: Props) {
  const [tagDraft, setTagDraft] = useState('');
  const [savingLocation, setSavingLocation] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [savedHint, setSavedHint] = useState<string | null>(null);

  const subject = useMemo(
    () => tree.find((item) => item.id === note.subjectId) ?? null,
    [tree, note.subjectId],
  );
  const availableChapters = subject?.chapters ?? [];

  useEffect(() => {
    if (!savedHint) return;
    const timer = window.setTimeout(() => setSavedHint(null), 1800);
    return () => window.clearTimeout(timer);
  }, [savedHint]);

  const saveWithHint = async (patch: NoteMetadataPatch, hint: string) => {
    await onSave(patch);
    setSavedHint(hint);
  };

  const addTag = async () => {
    const normalized = tagDraft.trim().toLowerCase().replace(/^#+/, '');
    if (!normalized || note.tags.includes(normalized)) {
      setTagDraft('');
      return;
    }
    await saveWithHint({ tags: [...note.tags, normalized].slice(0, 50) }, 'Đã thêm thẻ');
    setTagDraft('');
  };

  const removeTag = async (tag: string) => {
    await saveWithHint({ tags: note.tags.filter((item) => item !== tag) }, 'Đã bỏ thẻ');
  };

  const moveToSubject = async (subjectId: number) => {
    if (subjectId === note.subjectId) return;
    setSavingLocation(true);
    try {
      await saveWithHint({ subjectId, chapterId: null }, 'Đã chuyển môn học');
    } finally {
      setSavingLocation(false);
    }
  };

  const moveToChapter = async (chapterId: number | null) => {
    if (chapterId === note.chapterId) return;
    setSavingLocation(true);
    try {
      await saveWithHint({ subjectId: note.subjectId, chapterId }, 'Đã chuyển chương');
    } finally {
      setSavingLocation(false);
    }
  };

  const [dangTai, setDangTai] = useState<'md' | 'docx' | 'pdf' | null>(null);
  const taiXuong = async (dd: 'md' | 'docx' | 'pdf') => {
    if (dangTai) return;
    setDangTai(dd);
    try {
      await notesApi.taiXuong(note.id, dd);
    } catch {
      // Không chặn màn hình vì một lần tải hỏng — người dùng bấm lại được ngay.
      alert('Không tải được ghi chú. Thử lại nhé.');
    } finally {
      setDangTai(null);
    }
  };

  const duplicate = async () => {
    if (duplicating) return;
    setDuplicating(true);
    try {
      await onDuplicate();
    } finally {
      setDuplicating(false);
    }
  };

  return (
    <section
      aria-label="Thuộc tính ghi chú"
      className="mt-4 border-y border-slate-200 py-3 dark:border-white/[0.07]"
    >
      <div className="grid gap-x-5 gap-y-3 text-[13px] sm:grid-cols-[112px_minmax(0,1fr)]">
        <div className="flex min-h-10 items-center gap-2 text-slate-500 dark:text-slate-400">
          <Hash className="h-4 w-4" />
          <span>Thẻ</span>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex min-h-11 items-center gap-1 rounded-md bg-teal-50 px-2 text-teal-800 sm:min-h-8 dark:bg-teal-500/10 dark:text-teal-200"
            >
              #{tag}
              <button
                type="button"
                onClick={() => void removeTag(tag)}
                className="flex h-11 w-11 items-center justify-center rounded hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:h-7 sm:w-7 dark:hover:bg-teal-500/20"
                aria-label={`Bỏ thẻ ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          <div className="flex min-h-11 min-w-[180px] flex-1 items-center rounded-md border border-slate-200 bg-white px-2 sm:min-h-10 dark:border-white/[0.08] dark:bg-white/[0.025]">
            <Plus className="mr-1.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <input
              value={tagDraft}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  void addTag();
                }
              }}
              onBlur={() => { if (tagDraft.trim()) void addTag(); }}
              placeholder="Thêm thẻ rồi Enter"
              aria-label="Thêm thẻ"
              className="min-w-0 flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-[13px] dark:text-slate-200 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="flex min-h-10 items-center gap-2 text-slate-500 dark:text-slate-400">
          <FolderInput className="h-4 w-4" />
          <span>Vị trí</span>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          <label className="sr-only" htmlFor={`note-subject-${note.id}`}>Môn học</label>
          <select
            id={`note-subject-${note.id}`}
            value={note.subjectId}
            disabled={savingLocation}
            onChange={(event) => void moveToSubject(Number(event.target.value))}
            className="min-h-11 min-w-0 rounded-md border border-slate-200 bg-white px-2 text-base text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:min-h-10 sm:text-[13px] dark:border-white/[0.08] dark:bg-slate-900 dark:text-slate-200"
          >
            {tree.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor={`note-chapter-${note.id}`}>Chương</label>
          <select
            id={`note-chapter-${note.id}`}
            value={note.chapterId ?? ''}
            disabled={savingLocation}
            onChange={(event) => void moveToChapter(event.target.value ? Number(event.target.value) : null)}
            className="min-h-11 min-w-0 rounded-md border border-slate-200 bg-white px-2 text-base text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:min-h-10 sm:text-[13px] dark:border-white/[0.08] dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">Không thuộc chương</option>
            {availableChapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
            ))}
          </select>
        </div>

        <div className="flex min-h-10 items-center gap-2 text-slate-500 dark:text-slate-400">
          <CalendarClock className="h-4 w-4" />
          <label htmlFor={`note-review-${note.id}`}>Ngày ôn</label>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <input
            id={`note-review-${note.id}`}
            type="date"
            value={note.reviewDate?.slice(0, 10) ?? ''}
            onChange={(event) => void saveWithHint(
              // Noon UTC keeps the selected calendar day stable when the
              // ISO value is later rendered with `.slice(0, 10)` in any
              // user timezone (midnight local can roll back one UTC day).
              { reviewDate: event.target.value ? `${event.target.value}T12:00:00.000Z` : null },
              event.target.value ? 'Đã đặt ngày ôn' : 'Đã bỏ ngày ôn',
            )}
            className="min-h-11 rounded-md border border-slate-200 bg-white px-2 text-base text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:min-h-10 sm:text-[13px] dark:border-white/[0.08] dark:bg-slate-900 dark:text-slate-200"
          />
          {note.reviewDate && (
            <button
              type="button"
              onClick={() => void saveWithHint({ reviewDate: null }, 'Đã bỏ ngày ôn')}
              className="flex h-11 items-center rounded-md px-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:h-10 dark:hover:bg-white/[0.05]"
            >
              Bỏ ngày
            </button>
          )}
        </div>

        <div className="flex min-h-10 items-center gap-2 text-slate-500 dark:text-slate-400">
          <Info className="h-4 w-4" />
          <span>Thông tin</span>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500 dark:text-slate-400">
          <span>Tạo {dateTimeLabel(note.createdAt)}</span>
          <span>Cập nhật {dateTimeLabel(note.updatedAt)}</span>
          {savingLocation && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-label="Đang chuyển vị trí" />}
          {savedHint && (
            <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-300" role="status">
              <Check className="h-3.5 w-3.5" /> {savedHint}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        {/* Tải xuống — ba định dạng, mỗi cái một nút. Gộp thành menu xổ thì
            thêm một cú bấm cho việc mà người ta đã biết mình muốn gì. */}
        <span className="mr-auto text-[12px] text-slate-500 dark:text-slate-400">Tải xuống</span>
        {(['md', 'docx', 'pdf'] as const).map((dd) => (
          <button
            key={dd}
            type="button"
            onClick={() => void taiXuong(dd)}
            disabled={dangTai !== null}
            title={dd === 'md' ? 'Markdown — mở được ở Obsidian, VS Code…' : dd === 'docx' ? 'Word' : 'PDF'}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-wait disabled:opacity-60 sm:min-h-10 dark:border-white/[0.08] dark:text-slate-200 dark:hover:bg-white/[0.05]"
          >
            {dangTai === dd ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {dd === 'md' ? 'Markdown' : dd === 'docx' ? 'Word' : 'PDF'}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void duplicate()}
          disabled={duplicating}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-wait disabled:opacity-60 sm:min-h-10 dark:border-white/[0.08] dark:text-slate-200 dark:hover:bg-white/[0.05]"
        >
          {duplicating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
          Nhân bản ghi chú
        </button>
      </div>
    </section>
  );
}
