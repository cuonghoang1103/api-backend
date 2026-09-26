'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Send, X, Trash2 } from 'lucide-react';
import RobotAI from '@/components/academy/RobotAI';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import type { TutorAsk } from './tutorContext';
import s from './ielts.module.css';

export type Turn = { q: string; a: string | null; err?: string };

/** Bốn nút đặt sẵn — ứng với các `y` mới trong src/services/ielts/hoiAI.service.ts. */
const CHIPS: TutorAsk[] = [
  { label: 'Giảng lại trang này dễ hiểu hơn', y: 'giang' },
  { label: 'Hướng dẫn tôi học trang này', y: 'huongdan' },
  { label: 'Cho thêm ví dụ', y: 'vidu' },
  { label: 'Kiểm tra nhanh tôi 3 câu', y: 'kiemtra' },
];

export function GiaSu({
  lessonTitle, turns, asking, loggedIn, selection, onAsk, onClear, onClose,
}: {
  lessonTitle: string;
  turns: Turn[];
  asking: boolean;
  loggedIn: boolean;
  /** Đoạn người học đang bôi đen trong bài (nếu có). */
  selection: string;
  onAsk: (a: TutorAsk) => void;
  onClear: () => void;
  onClose?: () => void;
}) {
  const [text, setText] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns.length, asking]);

  const send = () => {
    const q = text.trim();
    if (!q || asking) return;
    onAsk({ label: q, cauHoi: q.slice(0, 500) });
    setText('');
  };

  return (
    <div className={s.tutor}>
      <div className={s.tutorHead}>
        <RobotAI size={34} dangNghi={asking} />
        <div className="min-w-0 flex-1">
          <div className={s.tutorName}>Gia sư IELTS</div>
          <div className={s.tutorSub}>Đang học: {lessonTitle}</div>
        </div>
        {turns.length > 0 && (
          <button type="button" className={s.iconBtn} onClick={onClear} aria-label="Xoá cuộc trò chuyện">
            <Trash2 size={16} />
          </button>
        )}
        {onClose && (
          <button type="button" className={s.iconBtn} onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        )}
      </div>

      <div ref={bodyRef} className={s.tutorBody}>
        <p className={s.hello}>
          Chào bạn! Mình giảng lại, cho thêm ví dụ hoặc chấm câu giúp bạn ngay trên trang đang học.
          {' '}Muốn hỏi riêng một chỗ thì <b>bôi đen</b> đoạn đó trong bài rồi bấm một nút bên dưới.
        </p>
        {!loggedIn ? (
          <p className={s.hello}>
            <Link href="/login" className={s.linkBtn}>Đăng nhập</Link> để hỏi gia sư.
          </p>
        ) : (
          <div className={s.chips}>
            {CHIPS.map((c) => (
              <button key={c.label} type="button" className={s.chip} disabled={asking} onClick={() => onAsk(c)}>
                {c.label}
              </button>
            ))}
          </div>
        )}
        {selection && (
          <div className={s.sel}>Đang hỏi về: “{selection.length > 120 ? `${selection.slice(0, 120)}…` : selection}”</div>
        )}

        {turns.map((t, i) => (
          <div key={i} className={s.turn}>
            <div className={s.turnQ}>{t.q}</div>
            <div className={s.turnA}>
              {t.err ? <span className={s.bad}>{t.err}</span>
                : t.a === null ? <span className={s.muted}>Gia sư đang soạn câu trả lời…</span>
                  : <ChatMarkdown content={t.a} renderMath={false} />}
            </div>
          </div>
        ))}
      </div>

      {loggedIn && (
        <div className={s.tutorFoot}>
          <textarea
            className={s.tutorInput}
            rows={1}
            value={text}
            placeholder="Hỏi bất cứ điều gì về bài này…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              // Enter gửi, Shift+Enter xuống dòng. Bỏ qua lúc gõ tiếng Việt (IME)
              // đang ghép chữ, không thì Enter chốt dấu cũng gửi luôn câu dở.
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button type="button" className={s.btn} onClick={send} disabled={asking || !text.trim()} aria-label="Gửi">
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
