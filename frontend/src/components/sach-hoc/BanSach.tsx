'use client';

/**
 * 📖 BẢN SÁCH (09/11/2026) — cả một bài xếp như trang sách giấy, in / lưu PDF được.
 * Người học: "hiện bản in ra như sách… đầy đủ để học cho dễ". Khác trang bài thường (tương tác, mỗi mục
 * một trang): ở đây mọi mục của bài nằm liền nhau theo thứ tự sách, bài tập in thành câu có chỗ trống,
 * còn ĐÁP ÁN gom về cuối bài (sách bài tập thật cũng vậy) để tự làm rồi dò.
 *
 * Mở bằng `?sach=<số buổi>` (CoursePage). Chọn phần muốn in: bài học cốt lõi · buổi trên lớp · luyện thêm.
 * Khối chỉ có nghĩa khi tương tác (công cụ chia, ôn thẻ, tra từ) thì bỏ, có ghi chú.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import type { Block, Lesson } from './types';
import type { Course } from './course';
import { Inline } from './Blocks';
import { anhUrl } from './HinhSlide';
import { inKhung } from './inKhung';
import s from './course.module.css';
import b from './sach.module.css';

type Phan = 'loi' | 'co' | 'luyen';
const TEN_PHAN: Record<Phan, string> = { loi: 'Bài học', co: 'Buổi trên lớp', luyen: 'Luyện thêm' };
const ABCD = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Đáp án gom cuối mỗi mục: [nhãn bài tập, các dòng đáp án]. */
type DapAn = { tieuDe: string; dong: ReactNode[] };

function Anh({ anh, alt }: { anh: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh nhỏ trên CDN
  return <img src={anhUrl(anh)} alt={alt} className={b.anh} loading="eager" decoding="async" />;
}

const Ro = ({ t }: { t?: string }) => (t ? <span className={`${s.ro} ${b.ro}`}>{t}</span> : null);

/** Một khối → dạng in. `dap` nhận đáp án để in cuối mục. */
function KhoiIn({ k, dap }: { k: Block; dap: DapAn[] }): ReactNode {
  switch (k.t) {
    case 'h': return <h3 className={b.h}><Inline text={k.text} /></h3>;
    case 'p': return <p className={b.p}><Inline text={k.text} /></p>;
    case 'recap':
      return (
        <div className={b.khungMuc}>
          <div className={b.khungTen}>🎯 {k.title ?? 'Học xong bài này'}</div>
          <ul>{k.items.map((x, i) => <li key={i}><Inline text={x} /></li>)}</ul>
        </div>
      );
    case 'rule': return <div className={b.congThuc}><b><Inline text={k.formula} /></b>{k.vi && <span> — <Inline text={k.vi} /></span>}</div>;
    case 'note':
      return (
        <div className={b.ghiChu}>
          <div className={b.khungTen}><Inline text={k.title} /></div>
          <ul>{k.items.map((x, i) => <li key={i}><Inline text={x} /></li>)}</ul>
        </div>
      );
    case 'patterns':
      return (
        <div>
          {k.rows.map((r, i) => (
            <div key={i} className={b.mau}>
              <div className={b.congThuc}><b><Inline text={r.formula} /></b> — <Inline text={r.vi} /></div>
              <ol className={b.viDu}>{r.examples.map((e, j) => <li key={j}><Inline text={e.en} /> <Ro t={e.ro} /><span className={b.vi}>{e.vi}</span></li>)}</ol>
            </div>
          ))}
        </div>
      );
    case 'examples':
      return <ol className={b.viDu}>{k.items.map((e, j) => <li key={j}><Inline text={e.en} /> <Ro t={e.ro} /><span className={b.vi}>{e.vi}</span></li>)}</ol>;
    case 'table':
      return (
        <table className={b.bang}>
          {k.caption && <caption><Inline text={k.caption} /></caption>}
          <thead><tr>{k.head.map((c, i) => <th key={i}><Inline text={c} /></th>)}</tr></thead>
          <tbody>{k.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Inline text={c} /></td>)}</tr>)}</tbody>
        </table>
      );
    case 'vocab':
      return (
        <table className={`${b.bang} ${b.bangTu}`}>
          <thead><tr><th>#</th><th>Từ</th><th>Loại</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
          <tbody>
            {k.items.map((v, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td className={b.tu}><Inline text={v.w} /><Ro t={v.ipa} /></td>
                <td>{v.pos}</td>
                <td>{v.vi}</td>
                <td><Inline text={v.ex} /><Ro t={v.exRo} /><span className={b.vi}>{v.exVi}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'hinh':
      return (
        <div className={b.luoiHinh}>
          {k.items.map((x, i) => (
            <figure key={i} className={b.theHinh}><Anh anh={x.anh} alt={x.vi} /><figcaption><Inline text={x.w} /><Ro t={x.ro} /><span className={b.vi}>{x.vi}</span></figcaption></figure>
          ))}
        </div>
      );
    case 'canh':
      return <figure className={b.canh}><div>{k.anh.map((a, i) => <Anh key={i} anh={a} alt="" />)}</div><figcaption><Inline text={k.caption} /></figcaption></figure>;
    case 'alphabet':
      return (
        <div>
          {k.groups.map((g, i) => (
            <div key={i} className={b.hangChu}><span className={b.hangTen}>{g.sound}</span>{g.letters.map((x, j) => <span key={j} className={b.oChu}><span className={b.chuTo}>{x.l}</span><Ro t={x.ipa} /></span>)}</div>
          ))}
        </div>
      );
    case 'dialogue':
      return (
        <div className={b.hoiThoai}>
          {k.title && <div className={b.khungTen}><Inline text={k.title} /></div>}
          {k.lines.map((x, i) => (
            <div key={i} className={b.loi}><span className={b.nguoi}>{x.who}</span><span><Inline text={x.text} /><Ro t={x.ro} />{x.vi && <span className={b.vi}>{x.vi}</span>}</span></div>
          ))}
        </div>
      );
    case 'passage':
      return (
        <div className={b.baiDoc}>
          <div className={b.khungTen}><Inline text={k.title} /></div>
          {k.intro && <p className={b.vi}><Inline text={k.intro} /></p>}
          {k.paras.map((x, i) => <p key={i}>{x.label && <b>{x.label}. </b>}<Inline text={x.text} /></p>)}
        </div>
      );
    case 'listen':
      // Kịch bản nghe = đáp án của bài nghe ⇒ in ở phần đáp án, ở đây chỉ để chỗ.
      dap.push({ tieuDe: `🎧 Kịch bản — ${k.title}`, dong: k.lines.map((x, i) => <span key={i}>{x.who ? `${x.who}: ` : ''}<Inline text={x.text} /> <Ro t={x.ro} />{x.vi && <span className={b.vi}> — {x.vi}</span>}</span>) });
      return <div className={b.baiTap}><div className={b.khungTen}>🎧 <Inline text={k.title} /></div><p className={b.vi}>{k.note ?? 'Nghe bài trong bản trên web/app (nút 🔊). Kịch bản ở phần Đáp án cuối bài.'}</p></div>;
    case 'mcq':
      dap.push({ tieuDe: k.title, dong: k.items.map((q, i) => <span key={i}><b>{i + 1}. {ABCD[q.correct]}</b> — <Inline text={q.why} /></span>) });
      return (
        <div className={b.baiTap}>
          <div className={b.khungTen}>✎ <Inline text={k.title} /></div>
          <ol>{k.items.map((q, i) => <li key={i}><Inline text={q.q} /><div className={b.luaChon}>{q.options.map((o, j) => <span key={j}>{ABCD[j]}. <Inline text={o} /></span>)}</div></li>)}</ol>
        </div>
      );
    case 'quiz':
      dap.push({ tieuDe: k.title, dong: k.items.map((q, i) => <span key={i}><b>{i + 1}.</b> <Inline text={q.answers[0]} />{q.answers.length > 1 && <span className={b.vi}> (cũng đúng: {q.answers.slice(1, 3).join(' · ')})</span>}</span>) });
      return (
        <div className={b.baiTap}>
          <div className={b.khungTen}>✎ <Inline text={k.title} />{k.grammar && <span className={b.vi}> · {k.grammar}</span>}</div>
          <ol>{k.items.map((q, i) => <li key={i}><Inline text={q.q} />{q.hint && <span className={b.vi}> ({q.hint})</span>}<div className={b.dongTrong} /></li>)}</ol>
        </div>
      );
    case 'build':
      dap.push({ tieuDe: k.title, dong: k.items.map((q, i) => <span key={i}><b>{i + 1}.</b> <Inline text={q.answer.join('')} /> <Ro t={q.ro} /></span>) });
      return (
        <div className={b.baiTap}>
          <div className={b.khungTen}>✎ <Inline text={k.title} /> — sắp xếp thành câu</div>
          <ol>{k.items.map((q, i) => <li key={i}>{q.vi}<div className={b.manh}>{[...q.chips].sort().map((c, j) => <span key={j}><Inline text={c} /></span>)}</div><div className={b.dongTrong} /></li>)}</ol>
        </div>
      );
    case 'readkanji':
      dap.push({ tieuDe: k.title, dong: k.items.map((x, i) => <span key={i}><b>{i + 1}.</b> {x.ro} — {x.vi}</span>) });
      return (
        <div className={b.baiTap}>
          <div className={b.khungTen}>🈶 <Inline text={k.title} /> — đọc to, viết cách đọc</div>
          <ol>{k.items.map((x, i) => <li key={i} className={b.chuTo2}>{x.text.replace(/\{([^|}]+)\|[^}]+\}/g, '$1')}<div className={b.dongTrong} /></li>)}</ol>
        </div>
      );
    case 'write':
      return (
        <div className={b.baiTap}>
          <div className={b.khungTen}>✍ <Inline text={k.title} /></div>
          {k.chars.map((c, i) => (
            <div key={i} className={b.oViet}>{Array.from({ length: 10 }, (_, j) => <span key={j} className={j < 2 ? b.oMau : ''}>{j < 2 ? c : ''}</span>)}</div>
          ))}
        </div>
      );
    case 'phatam':
      return (
        <div className={b.baiTap}>
          <div className={b.khungTen}>🗣 {k.title ?? 'Luyện phát âm — đọc to'}</div>
          <ol>{k.items.map((x, i) => <li key={i}><Inline text={x.text} /> <Ro t={x.ipa} />{x.vi && <span className={b.vi}>{x.vi}</span>}</li>)}</ol>
        </div>
      );
    case 'speak':
      return (
        <div className={b.baiTap}>
          <div className={b.khungTen}>🎤 Câu hỏi luyện nói</div>
          <ol>{k.questions.map((q, i) => <li key={i}><Inline text={q} /><div className={b.dongTrong} /></li>)}</ol>
        </div>
      );
    case 'slides':
      return (
        <div className={b.baiTap}>
          <div className={b.khungTen}>📽️ <Inline text={k.title} /></div>
          {k.slides.map((x, i) => (
            <div key={i} className={b.slideNho}>
              <b>{i + 1}. <Inline text={x.tieuDe} /></b>
              {x.anh?.length ? <div>{x.anh.map((a, j) => <Anh key={j} anh={a} alt={x.nhan?.[j] ?? ''} />)}</div> : null}
              {x.dong?.map((d, j) => <div key={j}><Inline text={d} /> <Ro t={x.ro?.[j]} /></div>)}
              {x.hoi && <div>❓ <Inline text={x.hoi} />{x.dap && <span className={b.vi}> → <Inline text={x.dap} /></span>}</div>}
            </div>
          ))}
        </div>
      );
    case 'dictation':
      dap.push({ tieuDe: k.title ?? 'Nghe chép', dong: k.items.map((x, i) => <span key={i}><b>{i + 1}.</b> {x.answer}</span>) });
      return <div className={b.baiTap}><div className={b.khungTen}>🎧 {k.title ?? 'Nghe chép'}</div><ol>{k.items.map((x, i) => <li key={i}>{x.label}<div className={b.dongTrong} /></li>)}</ol></div>;
    case 'essay':
      return <div className={b.baiTap}><div className={b.khungTen}>✍ Viết</div><p><Inline text={k.prompt} /></p>{Array.from({ length: 8 }, (_, i) => <div key={i} className={b.dongTrong} />)}</div>;
    default:
      // hanlop / chia / onthe / vocabAll / chart: công cụ tương tác — không in.
      return null;
  }
}

function MucIn({ l, so }: { l: Lesson; so: string }) {
  const dap: DapAn[] = [];
  const than = (l.blocks ?? []).map((k, i) => <div key={i} className={b.khoi}>{KhoiIn({ k, dap })}</div>);
  return (
    <section className={b.muc}>
      <header className={b.mucDau}>
        <span className={b.mucSo}>{so}</span>
        <div><h2 className={b.mucTen}><Inline text={l.title} /></h2>{l.goal && <p className={b.mucMucTieu}><Inline text={l.goal} /></p>}</div>
      </header>
      {than}
      {dap.length > 0 && (
        <div className={b.dapAn}>
          <div className={b.dapTen}>Đáp án — <Inline text={l.title} /></div>
          {dap.map((d, i) => (
            <div key={i} className={b.dapNhom}><div className={b.khungTen}><Inline text={d.tieuDe} /></div>{d.dong.map((x, j) => <div key={j}>{x}</div>)}</div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function BanSach({ course, n, onBack }: { course: Course; n: number; onBack: () => void }) {
  const [ls, setLs] = useState<Lesson[] | null>(() => course.contentOf(n) ?? null);
  const [loi, setLoi] = useState(false);
  const [chon, setChon] = useState<Record<Phan, boolean>>({ loi: true, co: false, luyen: false });
  const sachRef = useRef<HTMLElement>(null);
  const inRa = () => {
    const el = sachRef.current;
    if (!el) return;
    // Giữ lớp gốc của trang khoá (ẩn furigana/romaji, chữ Nhật) cho bản in.
    const goc = el.closest(`.${s.root}`) as HTMLElement | null;
    inKhung(el, { lop: goc?.className ?? '', tieuDe: `${course.title} — ${course.dayName(n)}` });
  };
  useEffect(() => {
    if (ls) return;
    course.load(n).then(setLs, () => setLoi(true));
  }, [course, n, ls]);

  // Chia phần theo nhóm mục lục của khoá (Dekiru: nhom.ts); khoá không chia nhóm ⇒ tất cả là "Bài học".
  const phan = useMemo(() => {
    const ra: Record<Phan, Lesson[]> = { loi: [], co: [], luyen: [] };
    if (!ls) return ra;
    const nhom = course.nhomMuc?.(ls);
    if (!nhom) { ra.loi = ls; return ra; }
    for (const g of nhom) {
      if (g.key === 'co') ra.co.push(...g.lessons);
      else if (g.key === 'luyen' || g.key === 'thi') ra.luyen.push(...g.lessons);
      else ra.loi.push(...g.lessons);
    }
    return ra;
  }, [course, ls]);

  const tenBuoi = course.dayName(n);
  const dsIn = (Object.keys(TEN_PHAN) as Phan[]).filter((p) => chon[p]).flatMap((p) => phan[p]);

  return (
    <div className={b.goc}>
      <div className={b.thanhCongCu}>
        <button type="button" className={s.btnGhost} onClick={onBack}><ArrowLeft size={15} /> Quay lại</button>
        <div className={b.chonPhan}>
          {(Object.keys(TEN_PHAN) as Phan[]).map((p) => phan[p].length > 0 && (
            <label key={p}><input type="checkbox" checked={chon[p]} onChange={(e) => setChon({ ...chon, [p]: e.target.checked })} /> {TEN_PHAN[p]} ({phan[p].length})</label>
          ))}
        </div>
        <button type="button" className={s.btn} onClick={inRa} disabled={!ls}><Printer size={15} /> In / Lưu PDF</button>
      </div>
      {loi && <div className={s.soonBox}>Không tải được bài — kiểm tra mạng rồi thử lại.</div>}
      {!ls && !loi && <div className={s.soonBox} aria-busy="true">Đang tải bài…</div>}
      {ls && (
        <article ref={sachRef} className={b.sach}>
          <header className={b.bia}>
            <div className={b.biaNhan}>{course.title}</div>
            <h1 className={b.biaTen}>{tenBuoi}</h1>
            <p className={b.biaPhu}>{dsIn.length} mục · {Math.round(dsIn.reduce((a, l) => a + (l.minutes || 0), 0) / 6) / 10} giờ · đáp án in sau mỗi mục</p>
          </header>
          {dsIn.map((l, i) => <MucIn key={l.id} l={l} so={String(i + 1)} />)}
        </article>
      )}
    </div>
  );
}
