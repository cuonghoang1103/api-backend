'use client';

/**
 * 🧭 Sơ đồ minh hoạ trong bài (12/11/2026) — khối `sodo` (timeline · flow · mindmap · compare) và `figure`
 * (hình Writing Task 1 đủ 6 loại, vẽ bằng FigureView của kho luyện IELTS). Dựng bằng HTML/CSS chứ không SVG
 * thuần để nhãn dùng được cú pháp Inline (**đậm**, ==dạ quang==) và tự xuống dòng trên điện thoại.
 */
import dynamic from 'next/dynamic';
import type { Block, SoDo as SoDoBlock } from './types';
import { Inline } from './Blocks';
import { anhUrl } from './HinhSlide';
import d from './sodo.module.css';

const FigureView = dynamic(() => import('@/app/tech-trends/ielts/FigureView'), { ssr: false });

/** Toạ độ −10…+10 → phần trăm ngang của rãnh. */
const pct = (v: number) => `${((Math.max(-10, Math.min(10, v)) + 10) / 20) * 100}%`;

function Anh({ anh }: { anh: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh nhỏ trên CDN
  return <img src={anhUrl(anh)} alt="" className={d.anh} loading="lazy" decoding="async" draggable={false} />;
}

function Timeline({ b }: { b: Extract<SoDoBlock, { kind: 'timeline' }> }) {
  return (
    <div className={d.tl}>
      {b.marks.map((m, i) => {
        const kieu = m.kieu ?? (m.to === undefined ? 'diem' : 'doan');
        const a = Math.min(m.from, m.to ?? m.from);
        const z = Math.max(m.from, m.to ?? m.from);
        const mau = d[`mau${m.mau ?? 1}`];
        return (
          <div key={i} className={d.tlHang}>
            <div className={d.tlNhan}><Inline text={m.label} /></div>
            <div className={d.tlRanh}>
              <span className={d.tlBay} aria-hidden />
              {kieu === 'diem' && <span className={`${d.tlDiem} ${mau}`} style={{ left: pct(a) }} />}
              {kieu === 'doan' && <span className={`${d.tlDoan} ${mau}`} style={{ left: pct(a), width: `calc(${pct(z)} - ${pct(a)})` }} />}
              {kieu === 'lap' && (
                <>
                  <span className={`${d.tlNen} ${mau}`} style={{ left: pct(a), width: `calc(${pct(z)} - ${pct(a)})` }} />
                  {Array.from({ length: 7 }, (_, k) => a + ((z - a) * k) / 6).map((v, k) => (
                    <span key={k} className={`${d.tlX} ${mau}`} style={{ left: pct(v) }}>×</span>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      })}
      <div className={d.tlHang}>
        <div />
        <div className={d.tlTruc}>
          <span>◀ Quá khứ</span>
          <b>Bây giờ</b>
          <span>Tương lai ▶</span>
        </div>
      </div>
    </div>
  );
}

function Flow({ b }: { b: Extract<SoDoBlock, { kind: 'flow' }> }) {
  return (
    <ol className={d.flow} data-ngang={b.steps.length <= 5 ? '1' : undefined} style={{ ['--n' as string]: b.steps.length }}>
      {b.steps.map((st, i) => (
        <li key={i} className={d.buoc}>
          <span className={d.buocSo}>{i + 1}</span>
          <div className={d.buocChu}><Inline text={st.label} /></div>
          {st.sub && <div className={d.buocPhu}><Inline text={st.sub} /></div>}
        </li>
      ))}
    </ol>
  );
}

function Mindmap({ b }: { b: Extract<SoDoBlock, { kind: 'mindmap' }> }) {
  return (
    <div className={d.mm}>
      <div className={d.mmTam}><Inline text={b.center} /></div>
      <div className={d.mmNhanh}>
        {b.branches.map((br, i) => (
          <div key={i} className={`${d.mmO} ${d[`mau${(i % 3) + 1}`]}`}>
            <div className={d.mmDau}>
              {br.anh && <Anh anh={br.anh} />}
              <span><Inline text={br.label} /></span>
            </div>
            {br.items && br.items.length > 0 && (
              <ul className={d.mmDs}>{br.items.map((it, k) => <li key={k}><Inline text={it} /></li>)}</ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Compare({ b }: { b: Extract<SoDoBlock, { kind: 'compare' }> }) {
  return (
    <div className={d.cmp} style={{ ['--n' as string]: b.cols.length }}>
      {b.cols.map((c, i) => (
        <div key={i} className={`${d.cmpCot} ${d[`mau${(i % 3) + 1}`]}`}>
          <div className={d.cmpDau}>
            {c.anh && <Anh anh={c.anh} />}
            <span><Inline text={c.title} /></span>
          </div>
          <ul className={d.mmDs}>{c.items.map((it, k) => <li key={k}><Inline text={it} /></li>)}</ul>
        </div>
      ))}
    </div>
  );
}

const NHAN: Record<SoDoBlock['kind'], string> = {
  timeline: '🕒 Trục thời gian',
  flow: '🧭 Sơ đồ các bước',
  mindmap: '🧠 Sơ đồ tư duy',
  compare: '⚖️ So sánh',
};

export function SoDo({ b }: { b: SoDoBlock }) {
  return (
    <figure className={d.khung}>
      <div className={d.tieuDe}>
        <span className={d.loai}>{NHAN[b.kind]}</span>
        {b.title && <span className={d.ten}><Inline text={b.title} /></span>}
      </div>
      {b.kind === 'timeline' && <Timeline b={b} />}
      {b.kind === 'flow' && <Flow b={b} />}
      {b.kind === 'mindmap' && <Mindmap b={b} />}
      {b.kind === 'compare' && <Compare b={b} />}
      {b.caption && <figcaption className={d.chuThich}><Inline text={b.caption} /></figcaption>}
    </figure>
  );
}

export function HinhTask1({ b }: { b: Extract<Block, { t: 'figure' }> }) {
  return (
    <div className={d.fig}>
      <FigureView figure={b.fig} />
    </div>
  );
}
