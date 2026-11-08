'use client';

/**
 * 🧩 GHÉP CÂU — cách ôn thứ 9 của "Ôn tập bằng thẻ" (09/11/2026). Người học: "luyện nhớ từ vựng + ghép
 * ngữ pháp như Quizlet". Lấy mọi câu ghép (khối `build`) có sẵn trong các bài đã chọn — bài cốt lõi, buổi
 * trên lớp, luyện thêm — nên không phải soạn riêng: bài nào thêm câu ghép là chế độ này tự có thêm.
 *
 * Một lượt: đọc nghĩa tiếng Việt → chạm các mảnh theo đúng thứ tự → Kiểm tra. Sai thì hiện câu đúng
 * (+ romaji, 🔊) và câu đó quay lại cuối lượt; đúng ngay lần đầu mới tính điểm.
 */
import { useEffect, useMemo, useState } from 'react';
import { Volume2, RotateCcw, Shuffle } from 'lucide-react';
import { Inline } from '../Blocks';
import { play } from '../audio';
import { useCourse } from '../tutorContext';
import type { Block, Lesson } from '../types';
import c from './onthe.module.css';
import g from './ghep.module.css';

type Cau = Extract<Block, { t: 'build' }>['items'][number] & { nguon: string };
const tron = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const docDuoc = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
const SO_CAU = 15;

/** Bài n của Dekiru là buổi n+1 (Bài 0 = buổi 1). */
function useCauGhep(bai: number[]) {
  const course = useCourse();
  const [ls, setLs] = useState<Lesson[] | null>(null);
  useEffect(() => {
    if (!course) { setLs([]); return; }
    let song = true;
    Promise.all(bai.map((n) => course.load(n + 1).catch(() => [] as Lesson[]))).then((r) => { if (song) setLs(r.flat()); });
    return () => { song = false; };
  }, [course, bai]);
  return useMemo<Cau[] | null>(() => {
    if (!ls) return null;
    const ra: Cau[] = [];
    const daCo = new Set<string>();
    for (const l of ls) for (const b of l.blocks ?? []) {
      if (b.t !== 'build') continue;
      for (const it of b.items) {
        const k = it.answer.join('');
        if (daCo.has(k) || it.answer.length < 2) continue;
        daCo.add(k);
        ra.push({ ...it, nguon: l.title });
      }
    }
    return ra;
  }, [ls]);
}

export default function GhepCau({ bai }: { bai: number[] }) {
  const tatCa = useCauGhep(bai);
  const [luot, setLuot] = useState(0);
  const deck = useMemo(() => (tatCa ? tron(tatCa).slice(0, SO_CAU) : []), [tatCa, luot]); // eslint-disable-line react-hooks/exhaustive-deps
  const [hang, setHang] = useState<number[]>([]);
  const [i, setI] = useState(0);
  const [chon, setChon] = useState<number[]>([]);
  const [manh, setManh] = useState<string[]>([]);
  const [kq, setKq] = useState<null | boolean>(null);
  const [diem, setDiem] = useState({ dung: 0, saiLan: new Set<number>() });

  useEffect(() => { setHang(deck.map((_, k) => k)); setI(0); setDiem({ dung: 0, saiLan: new Set() }); }, [deck]);
  const cau = hang.length ? deck[hang[i]] : undefined;
  useEffect(() => { if (cau) { setManh(tron(cau.chips)); setChon([]); setKq(null); } }, [cau]);

  if (!tatCa) return <div className={c.empty}>Đang gom câu ghép của bài…</div>;
  if (!tatCa.length) return <div className={c.empty}>Bài đang chọn chưa có câu ghép nào. Chọn thêm bài khác.</div>;
  if (!cau) {
    return (
      <div className={c.done}>
        <div className={c.score}>Đúng ngay lần đầu {diem.dung}/{deck.length} câu</div>
        <button type="button" className={c.btnPri} onClick={() => setLuot((x) => x + 1)}><RotateCcw size={14} /> Lượt mới ({Math.min(SO_CAU, tatCa.length)} câu khác)</button>
      </div>
    );
  }

  const cauGhep = chon.map((k) => manh[k]);
  const dungKhong = () => {
    const ok = [cau.answer, ...(cau.alt ?? [])].some((a) => a.join('') === cauGhep.join(''));
    setKq(ok);
    const so = hang[i];
    if (ok && !diem.saiLan.has(so)) setDiem((d) => ({ ...d, dung: d.dung + 1 }));
    if (!ok) setDiem((d) => ({ ...d, saiLan: new Set(d.saiLan).add(so) }));
    play({ text: docDuoc(cau.answer.join('')) });
  };
  const tiep = () => {
    if (kq === false) setHang((h) => [...h, h[i]]); // câu sai quay lại cuối lượt
    setI((x) => x + 1);
  };

  return (
    <div className={g.khung}>
      <div className={c.bar}><span>Câu {i + 1}/{hang.length}</span><span>✓ {diem.dung}</span></div>
      <div className={g.de}>
        <div className={g.nghia}>{cau.vi}</div>
        <div className={g.nguon}>{cau.nguon}</div>
      </div>
      <div className={`${g.dong} ${kq === true ? g.dongDung : kq === false ? g.dongSai : ''}`} aria-label="Câu bạn ghép">
        {chon.length === 0 && <span className={g.goiY}>Chạm các mảnh bên dưới theo đúng thứ tự (có thể có mảnh thừa để đánh lừa)…</span>}
        {chon.map((k, j) => (
          <button key={`${k}-${j}`} type="button" className={g.manhDaChon} disabled={kq !== null}
            onClick={() => setChon(chon.filter((_, x) => x !== j))}><Inline text={manh[k]} /></button>
        ))}
      </div>
      <div className={g.kho}>
        {manh.map((m, k) => (
          <button key={k} type="button" className={g.manh} disabled={chon.includes(k) || kq !== null}
            onClick={() => setChon([...chon, k])}><Inline text={m} /></button>
        ))}
      </div>
      {kq === false && (
        <div className={g.sua}>
          Câu đúng: <b><Inline text={cau.answer.join('')} /></b>
          {cau.ro && <div className={g.ro}>{cau.ro}</div>}
        </div>
      )}
      {kq === true && cau.ro && <div className={g.ro}>{cau.ro}</div>}
      <div className={c.row}>
        {kq === null ? (
          <>
            <button type="button" className={c.btnPri} disabled={chon.length < cau.answer.length} onClick={dungKhong}>Kiểm tra</button>
            <button type="button" className={c.btnSm} onClick={() => setChon([])}><Shuffle size={13} /> Xếp lại</button>
          </>
        ) : (
          <>
            <button type="button" className={c.btnPri} onClick={tiep} autoFocus>Câu tiếp →</button>
            <button type="button" className={c.btnSm} onClick={() => play({ text: docDuoc(cau.answer.join('')) })}><Volume2 size={13} /> Nghe lại</button>
          </>
        )}
      </div>
    </div>
  );
}
