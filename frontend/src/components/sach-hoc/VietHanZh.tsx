'use client';
/**
 * Tập viết chữ Hán GIẢN THỂ cho khoá CH (05/10/2026). Khối `write` của khoá Nhật
 * vẽ từ KanjiVG (chỉ có chữ Nhật — thiếu 们, 谢, 吗…), nên khoá tiếng Trung dùng
 * hanzi-writer với dữ liệu tiếng Trung lấy qua backend (`HanziWriterBox`, lang 'zh').
 *
 * Mỗi chữ: xem chạy thứ tự nét → tô theo nét mờ → tự viết không nhìn (máy bắt
 * nét sai). Đếm số nét sai lần tự viết gần nhất để người học biết chữ nào cần luyện.
 */
import { useRef, useState } from 'react';
import { Play, PenLine, Brain, RotateCcw } from 'lucide-react';
import { HanziWriterBox, type HanziWriterHandle, type WriterMode } from '@/components/language/hanzi/HanziWriterBox';
import type { Block } from './types';
import s from './course.module.css';

function MotChu({ c }: { c: string }) {
  const ref = useRef<HanziWriterHandle>(null);
  const [mode, setMode] = useState<WriterMode>('animate');
  const [kq, setKq] = useState<number | null>(null);
  const [nets, setNets] = useState<number | null>(null);
  const [loi, setLoi] = useState('');
  const chon = (m: WriterMode) => {
    setKq(null);
    setMode(m);
    if (m === 'animate') setTimeout(() => ref.current?.animate(), 60);
    else setTimeout(() => ref.current?.startQuiz(), 60);
  };
  return (
    <div className={s.vhChu}>
      <div className={s.vhO}>
        <HanziWriterBox
          ref={ref}
          char={c}
          lang="zh"
          size={150}
          mode={mode}
          showOutline={mode !== 'quiz'}
          showGrid
          onReady={setNets}
          onError={setLoi}
          onQuizComplete={(r) => setKq(r.mistakes)}
        />
      </div>
      <div className={s.vhNut}>
        <button type="button" className={mode === 'animate' ? s.btn : s.btnGhost} onClick={() => chon('animate')}><Play size={14} /> Xem nét</button>
        <button type="button" className={mode === 'trace' ? s.btn : s.btnGhost} onClick={() => chon('trace')}><PenLine size={14} /> Tô theo</button>
        <button type="button" className={mode === 'quiz' ? s.btn : s.btnGhost} onClick={() => chon('quiz')}><Brain size={14} /> Tự viết</button>
        <button type="button" className={s.btnGhost} onClick={() => { ref.current?.reset(); setKq(null); }} aria-label="Làm lại"><RotateCcw size={14} /></button>
      </div>
      <div className={s.quizSub}>
        {loi ? `Chưa tải được dữ liệu nét của “${c}”.` : nets ? `${nets} nét` : ''}
        {kq != null && <> · {kq === 0 ? <b className={s.paGood}>Đúng hết, không sai nét nào!</b> : <b className={s.paWarn}>Sai {kq} nét — viết lại nhé</b>}</>}
      </div>
    </div>
  );
}

export default function VietHanZh({ b }: { b: Extract<Block, { t: 'write' }> }) {
  return (
    <div className={s.quiz}>
      <div className={s.quizTitle}>✍️ {b.title}</div>
      <div className={s.quizSub}>{b.note ?? 'Bấm “Xem nét” để xem thứ tự nét, “Tô theo” để viết đè lên chữ mờ, rồi “Tự viết” — viết không nhìn, máy báo nét sai. Dùng chuột, bút cảm ứng hoặc ngón tay.'}</div>
      <div className={s.vhLuoi}>{b.chars.map((c) => <MotChu key={c} c={c} />)}</div>
    </div>
  );
}
