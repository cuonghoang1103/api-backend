'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Send, X, Trash2, Volume2, Copy, Check, Phone } from 'lucide-react';
import { play } from './audio';
import { MiniCuong } from './MiniCuong';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import type { TutorAsk } from './tutorContext';
import s from './course.module.css';

export type Turn = { q: string; a: string | null; err?: string };

/** Bốn nút đặt sẵn — ứng với các `y` mới trong src/services/ielts/hoiAI.service.ts. */
const CHIPS: TutorAsk[] = [
  { label: 'Giảng lại trang này dễ hiểu hơn', y: 'giang' },
  { label: 'Hướng dẫn tôi học trang này', y: 'huongdan' },
  { label: 'Cho thêm ví dụ', y: 'vidu' },
  { label: 'Kiểm tra nhanh tôi 3 câu', y: 'kiemtra' },
];

/** Câu hỏi tiếp sau một câu trả lời — hỏi tiếp dựa trên chính câu vừa trả lời. */
const FOLLOW: TutorAsk[] = [
  { label: 'Giải thích dễ hơn nữa', cauHoi: 'Giải thích lại câu trả lời vừa rồi dễ hơn nữa, như cho người mới bắt đầu hoàn toàn.' },
  { label: 'Thêm ví dụ khác', cauHoi: 'Cho thêm 3 ví dụ khác cho ý vừa giải thích, kèm nghĩa tiếng Việt.' },
  { label: 'Ra bài tập cho tôi', cauHoi: 'Ra 3 câu bài tập ngắn (dịch Việt → Anh) về đúng ý vừa giải thích. Đáp án để cuối dưới dòng **Đáp án**.' },
];

/** Câu tiếng Anh in nghiêng trong câu trả lời (`*...*`) — để bấm nghe cả loạt. */
function englishExamples(md: string): string[] {
  return [...md.matchAll(/(?<![*\w])\*([^*\n]{3,160})\*(?!\*)/g)]
    .map((m) => m[1].trim())
    .filter((t) => /^[A-Za-z0-9 ,.'’?!:;()\-]+$/.test(t) && /[a-z]/i.test(t));
}

function AnswerTools({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const ex = englishExamples(text);
  return (
    <div className={s.ansTools}>
      {ex.length > 0 && (
        <button type="button" className={s.ansTool} onClick={() => play(ex.map((text) => ({ text })))}>
          <Volume2 size={13} /> Nghe {ex.length} ví dụ
        </button>
      )}
      <button
        type="button"
        className={s.ansTool}
        onClick={() => {
          navigator.clipboard?.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }).catch(() => {});
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Đã chép' : 'Chép'}
      </button>
    </div>
  );
}

export function GiaSu({
  name, lessonTitle, turns, asking, loggedIn, selection, onAsk, onClear, onClose, closeLabel, onGoi,
}: {
  /** Tên gia sư hiển thị ("Gia sư IELTS", "Gia sư tiếng Nhật"). */
  name: string;
  lessonTitle: string;
  turns: Turn[];
  asking: boolean;
  loggedIn: boolean;
  /** Đoạn người học đang bôi đen trong bài (nếu có). */
  selection: string;
  onAsk: (a: TutorAsk) => void;
  onClear: () => void;
  onClose?: () => void;
  /** Nhãn nút đóng: ngăn kéo = "Đóng", cột bên phải trên máy tính = "Ẩn gia sư". */
  closeLabel?: string;
  /** Mở cuộc gọi luyện phát âm bằng giọng (chỉ khoá IELTS). */
  onGoi?: () => void;
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
      <div className={`${s.tutorHead} ${s.thMoi}`}>
        <MiniCuong size={46} nghi={asking} />
        <div className="min-w-0 flex-1" style={{ position: 'relative' }}>
          <div className={s.thTen}>CuongMini</div>
          <div className={s.thTrangThai} data-nghi={asking || undefined} title={`${name} · Đang học: ${lessonTitle}`}>
            <i /><span className={s.thChip}>{name.replace(/^Gia sư\s*/i, '')}</span>
            <span className={s.thCat}>{asking ? 'Đang soạn câu trả lời…' : `Đang học: ${lessonTitle}`}</span>
          </div>
        </div>
        {onGoi && (
          <button type="button" className={`${s.goiMoNut} ${s.thGoi}`} onClick={onGoi} title="Gọi CuongMini luyện nói — đọc theo câu mẫu, máy chấm và sửa bằng tiếng Việt">
            <Phone size={14} /><span>Luyện nói</span>
          </button>
        )}
        {turns.length > 0 && (
          <button type="button" className={s.iconBtn} onClick={onClear} aria-label="Xoá cuộc trò chuyện">
            <Trash2 size={16} />
          </button>
        )}
        {onClose && (
          <button type="button" className={s.iconBtn} onClick={onClose} aria-label={closeLabel ?? 'Đóng'} title={closeLabel ?? 'Đóng'}>
            <X size={18} />
          </button>
        )}
      </div>

      <div ref={bodyRef} className={s.tutorBody}>
        <div className={s.thChao}>
          <MiniCuong size={30} />
          <p>
            Chào bạn! Mình là <b>CuongMini</b> 👋 Mình giảng lại, cho thêm ví dụ hoặc chấm câu giúp bạn ngay trên trang đang học.
            {' '}Muốn hỏi riêng một chỗ thì <b>bôi đen</b> đoạn đó trong bài rồi bấm một nút bên dưới.
          </p>
        </div>
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
            <div className={s.turnQWrap}><div className={s.turnQ}>{t.q}</div></div>
            <div className={s.turnARow}>
              <span className={s.turnAvatar}><MiniCuong size={26} nghi={t.a === null && !t.err} /></span>
              <div className={s.turnA}>
                {t.err ? <span className={s.bad}>{t.err}</span>
                  : t.a === null ? (
                    <span className={s.typing} aria-label="Gia sư đang soạn câu trả lời"><i /><i /><i /></span>
                  ) : (
                    <>
                      <ChatMarkdown content={t.a} renderMath={false} />
                      <AnswerTools text={t.a} />
                    </>
                  )}
              </div>
            </div>
            {i === turns.length - 1 && t.a && !asking && (
              <div className={s.chips} style={{ marginTop: 10, paddingLeft: 36 }}>
                {FOLLOW.map((c) => (
                  <button key={c.label} type="button" className={`${s.chip} ${s.chipSoft}`} onClick={() => onAsk(c)}>{c.label}</button>
                ))}
              </div>
            )}
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
