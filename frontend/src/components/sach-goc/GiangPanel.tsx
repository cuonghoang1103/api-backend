'use client';

/**
 * 🎓 Giảng chi tiết & cách làm — mỗi bài tập trên trang (言ってみよう, チャレンジ！…):
 * hội thoại mẫu 例 → giảng từng câu → khung thay thế → các bước ghép → từng gợi ý
 * ①–④ (từ cần dùng + câu hoàn chỉnh, che trước để tự nói) → lỗi hay sai → nói về mình.
 * Dữ liệu: trường `giang` của hướng dẫn trang (soạn tay theo ảnh, xem useSachRieng.ts).
 */
import { useState } from 'react';
import { Volume2, Eye, GraduationCap } from 'lucide-react';
import { Inline } from '@/components/sach-hoc/Blocks';
import { play } from '@/components/sach-hoc/audio';
import cs from '@/components/sach-hoc/course.module.css';
import type { CauGiang, GiangPhan } from './useSachRieng';
import st from './sachGoc.module.css';

const tran = (s: string) => s.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');

function Nghe({ text }: { text: string }) {
  return (
    <button type="button" className={st.nghe} onClick={() => play({ text: tran(text), voice: 'ja-nu' })} aria-label="Nghe">
      <Volume2 size={15} />
    </button>
  );
}

function Cau({ c }: { c: CauGiang }) {
  return (
    <div className={st.gCau}>
      {c.ai && <span className={st.gAi}>{c.ai}</span>}
      <div className={st.gCauNd}>
        <div className={st.cauJa}><Inline text={c.ja} /> <Nghe text={c.ja} /></div>
        {c.ro && <div className={`${st.ro} ${cs.ro}`}>{c.ro}</div>}
        <div className={st.vi}>{c.vi}</div>
      </div>
    </div>
  );
}

function Tranh({ t }: { t: NonNullable<GiangPhan['tranh']>[number] }) {
  const [mo, setMo] = useState(false);
  return (
    <li className={st.gTranh}>
      <div className={st.gTranhDau}>
        <span className={st.soTranh}>{t.so}</span>
        <span className={st.gGoiY}><Inline text={t.goiY} /></span>
      </div>
      {!!t.tu?.length && (
        <div className={st.gTu}>
          {t.tu.map((u, i) => (
            <span key={i} className={st.gTuChip}>
              <Inline text={u.w} />{u.ro ? <small className={cs.ro}> {u.ro}</small> : null} — {u.vi}
            </span>
          ))}
        </div>
      )}
      {mo ? (
        <div className={st.gTranhCau}>{t.cau.map((c, i) => <Cau key={i} c={c} />)}</div>
      ) : (
        <button type="button" className={st.nutNho} onClick={() => setMo(true)}>
          <Eye size={14} /> Tự nói trước theo khung, rồi bấm xem câu hoàn chỉnh
        </button>
      )}
      {t.ghiChu && <p className={st.gGhiChu}>💡 <Inline text={t.ghiChu} /></p>}
    </li>
  );
}

function Phan({ g, mo }: { g: GiangPhan; mo: boolean }) {
  const [hetTranh, setHetTranh] = useState(0);
  return (
    <details className={st.gPhan} open={mo}>
      <summary className={st.gTieuDe}><Inline text={g.tieuDe} /></summary>
      {g.gioiThieu && <p className={st.gGioiThieu}><Inline text={g.gioiThieu} /></p>}

      {!!g.mau?.length && (
        <div className={st.gKhoi}>
          <div className={st.phanDau}>
            <h4>📖 Hội thoại mẫu (例)</h4>
            <button type="button" className={st.nutNho} onClick={() => play({ text: g.mau!.map((c) => tran(c.ja)).join('　'), voice: 'ja-nu' })}>
              <Volume2 size={14} /> Nghe cả đoạn
            </button>
          </div>
          {g.mau.map((c, i) => <Cau key={i} c={c} />)}
        </div>
      )}

      {!!g.phanTich?.length && (
        <div className={st.gKhoi}>
          <h4>🔍 Giảng từng câu</h4>
          <ol className={st.gDsGiang}>
            {g.phanTich.map((c, i) => (
              <li key={i}>
                <div className={st.cauJa}><Inline text={c.ja} /> <Nghe text={c.ja} /></div>
                {c.ro && <div className={`${st.ro} ${cs.ro}`}>{c.ro}</div>}
                <div className={st.vi}>{c.vi}</div>
                <div className={st.gGiai}><Inline text={c.giai} /></div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!!g.khung?.length && (
        <div className={st.gKhoi}>
          <h4>🧩 Khung câu — thay vào chỗ ［ ］</h4>
          <ul className={st.dsNp}>
            {g.khung.map((k, i) => (
              <li key={i}>
                <div className={st.npMau}><code><Inline text={k.mau} /></code></div>
                {k.giai && <div className={st.npY}><Inline text={k.giai} /></div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!g.buoc?.length && (
        <div className={st.gKhoi}>
          <h4>🪜 Cách ghép câu từng bước</h4>
          <ol className={st.dsBuoc}>{g.buoc.map((b, i) => <li key={i}><Inline text={b} /></li>)}</ol>
        </div>
      )}

      {!!g.tranh?.length && (
        <div className={st.gKhoi}>
          <div className={st.phanDau}>
            <h4>✍️ Làm từng gợi ý ({g.tranh.length})</h4>
            <button type="button" className={st.nutNho} onClick={() => setHetTranh((n) => n + 1)}>
              <Eye size={14} /> Mở hết đáp án
            </button>
          </div>
          {/* key đổi ⇒ dựng lại mọi thẻ ở trạng thái mở. */}
          <ul className={st.gDsTranh}>
            {g.tranh.map((t, i) => (hetTranh
              ? <TranhMo key={`m${hetTranh}-${i}`} t={t} />
              : <Tranh key={i} t={t} />))}
          </ul>
        </div>
      )}

      {!!g.loiSai?.length && (
        <div className={st.gKhoi}>
          <h4>⚠️ Lỗi hay sai</h4>
          <ul className={st.dsLuuY}>{g.loiSai.map((x, i) => <li key={i}><Inline text={x} /></li>)}</ul>
        </div>
      )}

      {!!g.moRong?.length && (
        <div className={st.gKhoi}>
          <h4>🙋 Nói về bạn</h4>
          {g.moRong.map((c, i) => <Cau key={i} c={c} />)}
        </div>
      )}
    </details>
  );
}

/** Thẻ gợi ý đã mở sẵn đáp án (nút "Mở hết đáp án"). */
function TranhMo({ t }: { t: NonNullable<GiangPhan['tranh']>[number] }) {
  return (
    <li className={st.gTranh}>
      <div className={st.gTranhDau}>
        <span className={st.soTranh}>{t.so}</span>
        <span className={st.gGoiY}><Inline text={t.goiY} /></span>
      </div>
      <div className={st.gTranhCau}>{t.cau.map((c, i) => <Cau key={i} c={c} />)}</div>
      {t.ghiChu && <p className={st.gGhiChu}>💡 <Inline text={t.ghiChu} /></p>}
    </li>
  );
}

export function GiangPanel({ p, giang }: { p: number; giang: GiangPhan[] }) {
  return (
    <section className={`${st.phan} ${st.giang}`}>
      <h3><GraduationCap size={15} style={{ verticalAlign: '-2px' }} /> Giảng chi tiết & cách làm <span className={st.dem}>{giang.length}</span></h3>
      {giang.map((g, i) => <Phan key={`${p}-${i}`} g={g} mo={i === 0} />)}
    </section>
  );
}
