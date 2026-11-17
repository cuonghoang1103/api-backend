'use client';

/**
 * Ô soạn câu hỏi của gia sư bài học — chung cho khung robot và mục cuối bài (17/11/2026).
 *
 *  • chip ngữ cảnh đang GHIM (đoạn video / slide) + bốn câu hỏi nhanh cho đúng chip đó;
 *  • placeholder TIẾNG VIỆT vừa một dòng (bản cũ "Ask about this lesson — screenshots welcome…" tràn hai dòng);
 *  • ô tự cao theo chữ tới ~5 dòng; Enter gửi, Shift+Enter xuống dòng; Enter đang chốt chữ bộ gõ tiếng Việt thì bỏ qua;
 *  • dán ảnh (Ctrl/⌘+V) hoặc nút ảnh.
 */
import { useEffect, useRef, type ClipboardEvent, type ReactNode } from 'react';
import { ImagePlus, Loader2, Send, X } from 'lucide-react';
import type { NguCanhHoi } from '@/store/giaSuBaiStore';
import { HOI_NHANH_DOAN, khoaCacheDoan } from '@/lib/mucLucVideo';
import { cauHoiSlide, khoaCacheSlide } from '@/components/academy/docSlide';
import type { TuyChonHoi } from '@/components/academy/useGiaSuBai';
import { ChipNguCanh } from './TinNhanGiaSu';
import './giaSu.css';

/** Câu hỏi nhanh cho chip đang ghim. Chip theo CHƯƠNG / theo SLIDE thì có cache dùng chung (mọi người cùng câu). */
export function hoiNhanhCho(nc: NguCanhHoi): { nhan: string; cau: string; opts: TuyChonHoi }[] {
  if (nc.loai === 'doan') {
    const d = nc.doan;
    return HOI_NHANH_DOAN.map((k) => ({
      nhan: k.nhan,
      cau: k.cau(d),
      opts: { nguCanh: nc, cauDaCoNguCanh: true, ...(nc.theoMucLuc ? { cacheKey: khoaCacheDoan(k.kieu, d) } : {}) },
    }));
  }
  const sl = nc.slide;
  const ten = `slide ${sl.so}${sl.tong ? `/${sl.tong}` : ''} của bộ ${sl.bo}${sl.ten ? ` (“${sl.ten}”)` : ''}`;
  return [
    { nhan: 'Giảng kỹ slide này', cau: cauHoiSlide(sl), opts: { nguCanh: nc, cauDaCoNguCanh: true, cacheKey: khoaCacheSlide(sl) } },
    { nhan: 'Ví dụ đời thường', cau: `Cho mình một ví dụ đời thường để hiểu ${ten}.`, opts: { nguCanh: nc, cauDaCoNguCanh: true } },
    { nhan: 'Tóm tắt slide này', cau: `Tóm tắt ${ten} thành 3 ý chính, kèm thuật ngữ cần nhớ.`, opts: { nguCanh: nc, cauDaCoNguCanh: true } },
    { nhan: 'Đố mình 3 câu', cau: `Đố mình 3 câu về ${ten} (đáp án để ở cuối, sau dòng "Đáp án").`, opts: { nguCanh: nc, cauDaCoNguCanh: true } },
  ];
}

export default function KhungSoanGiaSu({
  question, setQuestion, asking, hoi, anhDan, themAnh, boAnh, danVao, ghim, boGhim, placeholder, meo, focusKhi,
}: {
  question: string;
  setQuestion: (s: string) => void;
  asking: boolean;
  hoi: (text: string, opts?: TuyChonHoi) => Promise<void> | void;
  anhDan: string[];
  themAnh: (ds: File[]) => void | Promise<void>;
  boAnh: (i: number) => void;
  danVao: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
  ghim?: NguCanhHoi;
  boGhim: () => void;
  placeholder?: string;
  /** Dòng mẹo nhỏ dưới ô (phím tắt…). */
  meo?: ReactNode;
  /** Đổi giá trị ⇒ đặt con trỏ vào ô (vừa ghim chip, vừa mở khung). */
  focusKhi?: unknown;
}) {
  const oNhap = useRef<HTMLTextAreaElement>(null);
  const oFile = useRef<HTMLInputElement>(null);

  // Ô tự cao theo chữ (tối đa ~5 dòng — CSS max-height), co lại khi xoá.
  useEffect(() => {
    const o = oNhap.current;
    if (!o) return;
    o.style.height = '0px';
    o.style.height = `${Math.max(34, Math.min(o.scrollHeight, 140))}px`;
  }, [question]);

  useEffect(() => {
    if (focusKhi === undefined) return;
    const h = window.setTimeout(() => oNhap.current?.focus({ preventScroll: true }), 30);
    return () => window.clearTimeout(h);
  }, [focusKhi]);

  const ph = placeholder
    ?? (ghim ? (ghim.loai === 'doan' ? 'Hỏi về đoạn này…' : 'Hỏi về slide này…') : 'Hỏi về bài này… (dán ảnh chụp màn hình được)');

  return (
    <div className="gsb-soan">
      {ghim && (
        <div className="gsb-goi-y-soan">
          <div style={{ marginBottom: 6 }}><ChipNguCanh nc={ghim} onBo={boGhim} /></div>
          <div className="gsb-goi-y">
            {hoiNhanhCho(ghim).map((g) => (
              <button key={g.nhan} type="button" disabled={asking} onClick={() => void hoi(g.cau, g.opts)}>{g.nhan}</button>
            ))}
          </div>
        </div>
      )}
      {anhDan.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {anhDan.map((u, i) => (
            <div key={i} className="gsb-anh-nho">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" />
              <button type="button" onClick={() => boAnh(i)} aria-label="Bỏ ảnh"><X size={11} /></button>
            </div>
          ))}
        </div>
      )}
      <div className="gsb-o">
        <input
          ref={oFile}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          hidden
          onChange={(e) => {
            const ds = [...(e.target.files ?? [])];
            e.target.value = '';
            if (ds.length) void themAnh(ds);
          }}
        />
        <button type="button" className="gsb-nut-anh" onClick={() => oFile.current?.click()} disabled={asking}
          title="Gửi kèm ảnh (hoặc dán thẳng bằng Ctrl+V)" aria-label="Gửi kèm ảnh">
          <ImagePlus size={17} />
        </button>
        <textarea
          ref={oNhap}
          value={question}
          rows={1}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void hoi(question); }
          }}
          onPaste={danVao}
          placeholder={ph}
          aria-label="Câu hỏi cho gia sư"
        />
        <button type="button" className="gsb-nut-gui" onClick={() => void hoi(question)}
          disabled={asking || (!question.trim() && anhDan.length === 0)} aria-label="Gửi câu hỏi">
          {asking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
      {meo && <div className="gsb-meo">{meo}</div>}
    </div>
  );
}
