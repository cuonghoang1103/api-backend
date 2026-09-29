'use client';

/**
 * Hướng dẫn học ĐÚNG trang đang mở: trang này là gì, từ mới, ngữ pháp (liên
 * kết sang bài ngữ pháp của khoá), dịch từng câu, tranh, cách làm bài, câu cô
 * hay hỏi. Nội dung do AI soạn sẵn một lần từ ảnh trang (scripts/sach-rieng/)
 * — ảnh sách vẫn là nguồn đúng, nên độ tin cậy được ghi ra.
 */
import { useState } from 'react';
import Link from 'next/link';
import { Volume2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Inline } from '@/components/sach-hoc/Blocks';
import { play } from '@/components/sach-hoc/audio';
import cs from '@/components/sach-hoc/course.module.css';
import { TEN_MUC, nhanMuc, type HuongDan } from './useSachRieng';
import st from './sachGoc.module.css';

/** `{漢字|かな}` → chữ trần để đọc to. */
const tran = (s: string) => s.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');

function Nghe({ text }: { text: string }) {
  return (
    <button type="button" className={st.nghe} onClick={() => play({ text: tran(text), voice: 'ja-nu' })} aria-label="Nghe">
      <Volume2 size={15} />
    </button>
  );
}

function CauHoi({ c }: { c: NonNullable<HuongDan['cauHoiCo']>[number] }) {
  const [mo, setMo] = useState(false);
  return (
    <li className={st.cauHoi}>
      <div className={st.cauJa}><Inline text={c.ja} /> <Nghe text={c.ja} /></div>
      {c.ro && <div className={`${st.ro} ${cs.ro}`}>{c.ro}</div>}
      {c.vi && <div className={st.vi}>{c.vi}</div>}
      {c.traLoi && (
        mo ? (
          <div className={st.traLoi}>
            <div className={st.cauJa}>→ <Inline text={c.traLoi} /> <Nghe text={c.traLoi} /></div>
            {c.traLoiRo && <div className={`${st.ro} ${cs.ro}`}>{c.traLoiRo}</div>}
            {c.traLoiVi && <div className={st.vi}>{c.traLoiVi}</div>}
          </div>
        ) : (
          <button type="button" className={st.nutNho} onClick={() => setMo(true)}><Eye size={14} /> Tự trả lời trước, rồi bấm xem câu mẫu</button>
        )
      )}
    </li>
  );
}

export function HuongDanPanel({
  p, hd, dangTai, loi, baiCuaPoint, onHoi,
}: {
  p: number;
  hd: HuongDan | null;
  dangTai: boolean;
  loi: boolean;
  baiCuaPoint: (n: number) => number | null;
  onHoi: () => void;
}) {
  const [anDich, setAnDich] = useState(false);
  if (dangTai) return <div className={st.trong} aria-busy="true">Đang tải hướng dẫn trang {p}…</div>;
  if (loi) return <div className={st.trong} role="alert">Không tải được hướng dẫn. Thử lật lại trang.</div>;
  if (!hd) {
    return (
      <div className={st.trong}>
        Trang {p} chưa có hướng dẫn soạn sẵn (trang mục lục, lời nói đầu hoặc tra từ).
        <button type="button" className={cs.btn} style={{ marginTop: 12 }} onClick={onHoi}><Sparkles size={15} /> Hỏi gia sư về trang này</button>
      </div>
    );
  }
  const muc = hd.muc ?? [];
  return (
    <div className={st.hd}>
      <div className={st.mucChips}>
        {muc.map((m, i) => (
          <span key={i} className={st.mucChip} style={{ ['--m' as string]: TEN_MUC[m.loai]?.mau ?? '#94a3b8' }}>
            {nhanMuc(m)}{m.topic ? ` · トピック${m.topic}` : ''} <small>{TEN_MUC[m.loai]?.vi}</small>
          </span>
        ))}
      </div>
      {hd.tomTat && <p className={st.tomTat}>{hd.tomTat}</p>}
      {hd.mucTieu && <p className={st.mucTieu}><b>🎯 Mục tiêu:</b> {hd.mucTieu}</p>}

      <button type="button" className={st.nutHoi} onClick={onHoi}>
        <Sparkles size={16} /> Hỏi gia sư về trang này <small>AI nhìn đúng ảnh trang {p}</small>
      </button>

      {!!hd.cau?.length && (
        <section className={st.phan}>
          <div className={st.phanDau}>
            <h3>Dịch từng câu trên trang</h3>
            <button type="button" className={st.nutNho} onClick={() => setAnDich(!anDich)}>
              {anDich ? <Eye size={14} /> : <EyeOff size={14} />} {anDich ? 'Hiện nghĩa' : 'Che nghĩa để tự dịch'}
            </button>
          </div>
          <ol className={st.dsCau}>
            {hd.cau.map((c, i) => (
              <li key={i}>
                <div className={st.cauJa}><Inline text={c.ja} /> <Nghe text={c.ja} /></div>
                {c.ro && <div className={`${st.ro} ${cs.ro}`}>{c.ro}</div>}
                <div className={`${st.vi} ${anDich ? st.che : ''}`} onClick={(e) => e.currentTarget.classList.remove(st.che)}>{c.vi}</div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {!!hd.tuMoi?.length && (
        <section className={st.phan}>
          <h3>Từ mới trên trang <span className={st.dem}>{hd.tuMoi.length}</span></h3>
          <div className={st.bangCuon}>
            <table className={st.bangTu}>
              <tbody>
                {hd.tuMoi.map((t, i) => (
                  <tr key={i}>
                    <td className={st.tuW}><Inline text={t.w} /></td>
                    <td><span className={cs.ro}>{t.ro}</span></td>
                    <td>{t.vi}</td>
                    <td><Nghe text={t.w} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!!hd.nguPhap?.length && (
        <section className={st.phan}>
          <h3>Ngữ pháp dùng trên trang</h3>
          <ul className={st.dsNp}>
            {hd.nguPhap.map((g, i) => {
              const b = g.point ? baiCuaPoint(g.point) : null;
              return (
                <li key={i}>
                  <div className={st.npMau}>
                    {g.point ? <span className={st.pt}>ポイント {g.point}</span> : null}
                    <code><Inline text={g.mau} /></code>
                  </div>
                  {g.y && <div className={st.npY}>{g.y}</div>}
                  {b && (
                    <Link className={st.lienKet} href={`/language/ja/dekiru?bai=b${b}-ngu-phap`}>
                      Học kỹ ở mục Ngữ pháp · Bài {b} →
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {!!hd.tranh?.length && (
        <section className={st.phan}>
          <h3>Tranh trên trang</h3>
          <ul className={st.dsTranh}>
            {hd.tranh.map((t, i) => <li key={i}><span className={st.soTranh}>{t.so || '•'}</span> {t.moTa}</li>)}
          </ul>
        </section>
      )}

      {!!hd.cachLam?.length && (
        <section className={st.phan}>
          <h3>Làm trang này thế nào</h3>
          <ol className={st.dsBuoc}>{hd.cachLam.map((x, i) => <li key={i}>{x}</li>)}</ol>
        </section>
      )}

      {!!hd.cauHoiCo?.length && (
        <section className={st.phan}>
          <h3>Câu cô hay hỏi</h3>
          <ul className={st.dsHoi}>{hd.cauHoiCo.map((c, i) => <CauHoi key={`${p}-${i}`} c={c} />)}</ul>
        </section>
      )}

      {!!hd.luuY?.length && (
        <section className={st.phan}>
          <h3>Lưu ý</h3>
          <ul className={st.dsLuuY}>{hd.luuY.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      )}

      <p className={st.ghiChu}>
        Hướng dẫn do AI soạn từ ảnh trang{typeof hd.tinCay === 'number' ? ` (tự đánh giá độ chắc chắn ${Math.round(hd.tinCay * 100)}%)` : ''}.
        {' '}Chỗ nào lệch với sách thì sách đúng — hỏi gia sư để kiểm lại.
      </p>
    </div>
  );
}
