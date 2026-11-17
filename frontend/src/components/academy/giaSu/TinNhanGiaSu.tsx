'use client';

/**
 * Danh sách lượt hỏi–đáp của gia sư bài học — dùng CHUNG cho khung robot nổi và mục cuối bài (17/11/2026), để hai lối
 * vào không bao giờ trình bày khác nhau (cùng lý lẽ với việc tách ruột ra `useGiaSuBai`).
 *
 * Có gì mới so với bản cũ:
 *  • chữ trả lời 14,5px, dòng 1,7, đầu mục có gạch chân, danh sách có dấu màu — theo chủ đề sáng/tối (`giaSu.css`);
 *  • mốc `[3:20]` trong câu trả lời thành nút "▶ 3:20" tua video (khi gia sư đang nghe kèm video);
 *  • chip ngữ cảnh (đoạn video / slide) trên câu hỏi, thay vì một bức tường chữ;
 *  • nút Chép câu trả lời; sau câu trả lời cuối có gợi ý hỏi tiếp ("Giải thích chậm và dễ hơn"…).
 */
import { useState, type MouseEvent } from 'react';
import { Check, Copy, Languages, Loader2, RefreshCw } from 'lucide-react';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import { CuongMiniRobot } from '@/components/cuongmini/CuongMiniRobot';
import type { LuotGiaSu, NguCanhHoi } from '@/store/giaSuBaiStore';
import { giayTuURL, themLienKet } from '@/lib/mocThoiGian';
import { HOI_TIEP, nhanDoan } from '@/lib/mucLucVideo';
import './giaSu.css';

/** Chip ngữ cảnh gọn: "🎬 Tên chương · 3:20 – 5:10" / "📑 SWT0 · slide 2 — ISTQB". */
export function ChipNguCanh({ nc, onBo }: { nc: NguCanhHoi; onBo?: () => void }) {
  const [bieuTuong, chu, moc] = nc.loai === 'doan'
    ? ['🎬', nc.doan.ten || 'Đoạn video', nhanDoan(nc.doan)]
    : ['📑', `${nc.slide.bo} · slide ${nc.slide.so}${nc.slide.ten ? ` — ${nc.slide.ten}` : ''}`, ''];
  return (
    <span className="gsb-chip" title={nc.loai === 'doan' ? `${chu} (${moc})` : chu}>
      <span aria-hidden>{bieuTuong}</span>
      <span className="gsb-chip-chu">{chu}</span>
      {moc && <span className="gsb-chip-moc">{moc}</span>}
      {onBo && (
        <button type="button" onClick={onBo} aria-label="Bỏ ngữ cảnh này" title="Bỏ ngữ cảnh này">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </span>
  );
}

/** Bỏ dòng "(Hỏi về đoạn …)" mà `cauKemNguCanh` nối vào — chip đã nói điều đó, hiện lại là lặp. */
const boDuoiNguCanh = (s: string) => s.replace(/\n\n\(Hỏi về (?:đoạn|slide) [^\n]*\)$/u, '');

function NutChep({ chu }: { chu: string }) {
  const [xong, datXong] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(chu); datXong(true); window.setTimeout(() => datXong(false), 1800); } catch { /* trình duyệt chặn clipboard */ }
      }}
      title="Chép câu trả lời"
    >
      {xong ? <Check size={12} /> : <Copy size={12} />} {xong ? 'Đã chép' : 'Chép'}
    </button>
  );
}

export default function TinNhanGiaSu({
  turns, asking, coVideo, onTua, onHoiTiep, onTiengAnh, onHoiLaiMoi, coTiengAnh = true,
}: {
  turns: LuotGiaSu[];
  asking: boolean;
  /** Gia sư đang nghe kèm video ⇒ biến `[mm:ss]` thành nút tua. */
  coVideo: boolean;
  onTua?: (giay: number) => void;
  /** Gợi ý hỏi tiếp sau câu trả lời cuối. Bỏ trống ⇒ không hiện. */
  onHoiTiep?: (cau: string) => void;
  onTiengAnh: (i: number) => void;
  onHoiLaiMoi: (i: number) => void;
  coTiengAnh?: boolean;
}) {
  const iCuoi = turns.length - 1;

  /* Bấm mốc ⇒ tua. Chặn ở vùng bao (một trình nghe cho cả danh sách) vì `ChatMarkdown` tự vẽ thẻ <a>. */
  const bam = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    const g = giayTuURL(a?.getAttribute('href'));
    if (g == null) return;
    e.preventDefault();
    onTua?.(g);
  };

  return (
    <div onClick={bam}>
      {turns.map((t, i) => (
        t.role === 'user' ? (
          <div key={i} className="gsb-luot" data-vai="user">
            <div className="gsb-bong-hoi">
              {t.nguCanh && <div><ChipNguCanh nc={t.nguCanh} /></div>}
              {!!t.anh?.length && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {t.anh.map((u, k) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={k} src={u} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10 }} />
                  ))}
                </div>
              )}
              {t.nguCanh ? boDuoiNguCanh(t.content) : t.content}
            </div>
          </div>
        ) : (
          <div key={i} className="gsb-luot" data-vai="assistant">
            <span style={{ marginTop: 2 }}>
              <CuongMiniRobot
                size={30}
                chopMat={false}
                tinh={!t.streaming}
                mood={t.streaming ? (t.content ? 'noi' : 'nghi') : 'thuong'}
              />
            </span>
            <div className="gsb-tra-loi">
              <div className="gsb-the">
                {t.streaming && !t.content ? (
                  <span className="gsb-cho"><Loader2 size={14} className="animate-spin" /> CuongMini đang soạn…</span>
                ) : (
                  <div className="gsb-md">
                    {/* `renderMath` chỉ bật khi đã gõ xong — KaTeX/mermaid dựng lại ở mỗi mẩu delta thì nhấp nháy. */}
                    <ChatMarkdown content={coVideo ? themLienKet(t.content) : t.content} renderMath={!t.streaming} />
                    {t.streaming && <span className="gsb-con-tro" />}
                  </div>
                )}
              </div>
              {!t.streaming && t.content && (
                <div className="gsb-hanh-dong">
                  {t.cached && <span className="gsb-co-san">⚡ Trả lời có sẵn</span>}
                  <NutChep chu={t.content} />
                  {coTiengAnh && !t.english && t.srcQuestion && !t.enDone && (
                    <button type="button" onClick={() => onTiengAnh(i)} disabled={asking}><Languages size={12} /> Bản tiếng Anh</button>
                  )}
                  {t.srcQuestion && (
                    <button type="button" onClick={() => onHoiLaiMoi(i)} disabled={asking}><RefreshCw size={11} /> Hỏi lại mới</button>
                  )}
                </div>
              )}
              {i === iCuoi && !t.streaming && !asking && onHoiTiep && t.content && (
                <div className="gsb-goi-y" style={{ marginTop: 8 }}>
                  {HOI_TIEP.map((g) => (
                    <button key={g.nhan} type="button" onClick={() => onHoiTiep(g.cau)}>{g.nhan}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
