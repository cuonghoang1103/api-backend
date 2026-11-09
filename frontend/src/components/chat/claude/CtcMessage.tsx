'use client';

/**
 * Một tin nhắn kiểu Claude.
 *  - Người dùng: bong bóng canh phải; rê chuột hiện Chép · Sửa. Sửa ⇒ khung sửa tại chỗ, "Gửi" cắt hội thoại từ đây và hỏi lại.
 *  - CuongMini: chữ trần (serif), không bong bóng; dưới cùng Chép · 👍 · 👎 · Tạo lại.
 */
import { memo, useEffect, useRef, useState } from 'react';
import { BookOpen, Check, Copy, FileText, Pencil, RotateCcw, Search, ThumbsDown, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import type { ChatMessage } from '@/types';
import { api } from '@/lib/api';
import ChatMarkdown from '../ChatMarkdown';
import ThinkingSteps from '../ThinkingSteps';
import { NguonCards } from '../NguonCards';

function useCopy() {
  const [ok, setOk] = useState(false);
  return {
    ok,
    copy: async (t: string) => {
      try { await navigator.clipboard.writeText(t); setOk(true); setTimeout(() => setOk(false), 1800); }
      catch { toast.error('Không chép được'); }
    },
  };
}

export function CtcMark({ thinking }: { thinking?: boolean }) {
  return (
    <span className="ctc-mark" data-spin={!!thinking}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/favicon.png" alt="CuongMini" />
    </span>
  );
}

interface UserProps {
  msg: ChatMessage;
  locked: boolean;
  onEdit: (text: string) => void;
}

export const CtcUserMessage = memo(function CtcUserMessage({ msg, locked, onEdit }: UserProps) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(msg.content);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const { ok, copy } = useCopy();

  useEffect(() => {
    if (!editing) return;
    const ta = taRef.current;
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }, [editing]);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 360)}px`;
  }, [val, editing]);

  if (editing) {
    const save = () => {
      const t = val.trim();
      if (!t) return;
      setEditing(false);
      onEdit(t);
    };
    return (
      <div className="ctc-msg ctc-msg-user" data-role="user">
        <div className="ctc-edit">
          <textarea
            ref={taRef}
            value={val}
            rows={1}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); }
              if (e.key === 'Escape') { setEditing(false); setVal(msg.content); }
            }}
            aria-label="Sửa tin nhắn"
          />
          <div className="ctc-edit-foot">
            <span className="ctc-edit-note">Gửi lại sẽ thay các tin phía sau trong cuộc này.</span>
            <span style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="ctc-btn" onClick={() => { setEditing(false); setVal(msg.content); }}>Huỷ</button>
              <button type="button" className="ctc-btn" data-primary disabled={!val.trim() || locked} onClick={save}>Gửi</button>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ctc-msg ctc-msg-user" data-role="user">
      {(msg.images?.length || msg.documentNames?.length) ? (
        <div className="ctc-attach-row">
          {msg.images?.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="Ảnh đính kèm" className="ctc-attach-img" />
          ))}
          {msg.documentNames?.map((n, i) => (
            <div key={`d${i}`} className="ctc-file"><span className="ctc-file-ic"><FileText size={16} /></span><span>{n}</span></div>
          ))}
        </div>
      ) : null}
      {msg.content && <div className="ctc-bubble">{msg.content}</div>}
      <div className="ctc-actions">
        <button type="button" className="ctc-icon-btn" data-sm title={ok ? 'Đã chép' : 'Chép'} aria-label="Chép" onClick={() => void copy(msg.content)}>
          {ok ? <Check size={15} /> : <Copy size={15} />}
        </button>
        {msg.content && (
          <button type="button" className="ctc-icon-btn" data-sm title="Sửa" aria-label="Sửa" disabled={locked} onClick={() => { setVal(msg.content); setEditing(true); }}>
            <Pencil size={15} />
          </button>
        )}
      </div>
    </div>
  );
});

interface AiProps {
  msg: ChatMessage;
  streaming: boolean;
  isLast: boolean;
  locked: boolean;
  steps?: Array<{ viec: string; chu: string }>;
  onRegenerate?: () => void;
}

export const CtcAssistantMessage = memo(function CtcAssistantMessage({ msg, streaming, isLast, locked, steps, onRegenerate }: AiProps) {
  const { ok, copy } = useCopy();
  const [rated, setRated] = useState<null | 'up' | 'down'>(null);
  const empty = !msg.content?.trim();

  const rate = async (kind: 'up' | 'down') => {
    if (!msg.dbId || rated) { if (!msg.dbId) toast.info('Đăng nhập để gửi đánh giá'); return; }
    setRated(kind);
    try {
      await api.post('/ai/feedback', { messageId: msg.dbId, rating: kind === 'up' ? 5 : 1, feedbackType: 'thumbs' });
      toast.success('Cảm ơn phản hồi của bạn!');
    } catch {
      setRated(null);
      toast.error('Không gửi được phản hồi');
    }
  };

  return (
    <div className="ctc-msg ctc-msg-ai" data-role="assistant">
      {(msg.reasoning || (steps && steps.length > 0)) && (
        <div className="ctc-steps">
          {steps?.map((b, i) => (
            <div key={i} className="ctc-step">
              {b.viec === 'tim' ? <Search size={13} /> : <BookOpen size={13} />}
              <span>{b.viec === 'tim' ? 'Đang tìm trên web' : 'Đang đọc'}</span>
              <em>{b.chu}</em>
            </div>
          ))}
          {msg.reasoning && (
            <ThinkingSteps reasoning={msg.reasoning} streaming={streaming} hasAnswer={!empty} skin="studio" />
          )}
        </div>
      )}

      {empty && streaming ? (
        <div className="ctc-wait"><CtcMark thinking /> <span>Đang suy nghĩ…</span></div>
      ) : (
        <div className="ctc-prose">
          <ChatMarkdown content={msg.content} renderMath={!streaming} />
          {streaming && <span className="ctc-caret" aria-hidden />}
        </div>
      )}

      {msg.nguon?.length ? <NguonCards nguon={msg.nguon} /> : null}

      {!streaming && !empty && (
        <div className="ctc-actions" data-last={isLast}>
          {isLast && <span style={{ marginRight: 6, display: 'inline-flex' }}><CtcMark /></span>}
          <button type="button" className="ctc-icon-btn" data-sm title={ok ? 'Đã chép' : 'Chép'} aria-label="Chép" onClick={() => void copy(msg.content)}>
            {ok ? <Check size={15} /> : <Copy size={15} />}
          </button>
          <button type="button" className="ctc-icon-btn" data-sm data-on={rated === 'up'} title="Câu trả lời tốt" aria-label="Câu trả lời tốt" onClick={() => void rate('up')}>
            <ThumbsUp size={15} />
          </button>
          <button type="button" className="ctc-icon-btn" data-sm data-on={rated === 'down'} title="Câu trả lời chưa tốt" aria-label="Câu trả lời chưa tốt" onClick={() => void rate('down')}>
            <ThumbsDown size={15} />
          </button>
          {onRegenerate && (
            <button type="button" className="ctc-icon-btn" data-sm title="Tạo lại" aria-label="Tạo lại" disabled={locked} onClick={onRegenerate}>
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
});
