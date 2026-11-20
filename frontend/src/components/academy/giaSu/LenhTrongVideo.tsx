'use client';

/**
 * ============================================================
 * 💻 LỆNH & CODE TRONG VIDEO — ngay dưới "Mục lục video" của trang học (20/11/2026)
 * ============================================================
 *
 * Người dùng: "những lệnh terminal hay code nào đã được gõ trên terminal của video, ghi rõ ở dưới phần bài giảng một
 * mục để mình ấn xem, để mình biết lệnh terminal đấy đang làm gì, kèm comment — nhìn video mình chả hiểu gì".
 *
 *  • Mục THU GỌN (mặc định đóng): bấm mở ra danh sách THEO THỨ TỰ XUẤT HIỆN mọi lệnh terminal + khối code trên hình.
 *  • Mỗi mục: mốc mm:ss (bấm = tua, như MucLucVideo) · khối lệnh/code (nút chép — chép đúng lệnh/code, không kèm chú
 *    thích) · giải thích: lệnh làm gì, từng cờ/tham số nghĩa là gì, kết quả mong đợi (+ output thật trên video).
 *    Code: chú thích từng dòng quan trọng hiện như COMMENT ngay cuối dòng.
 *  • Mục đang phát (theo giây video) được tô nhẹ.
 *
 * Dữ liệu: `/video-hoc/lenh/:id?track=` — sinh sẵn lúc soạn (trích từ hình video + LLM giải thích), không gọi AI lúc
 * xem. Chỉ video riêng (VI/EN). Không có dữ liệu ⇒ không vẽ gì.
 */
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown, Copy, TerminalSquare } from 'lucide-react';
import { videoHocApi, type MucLenhVideo } from '@/lib/api';
import { moc } from '@/lib/mocThoiGian';
import './giaSu.css';
import './lenhVideo.css';

type Track = 'VI' | 'EN' | 'YT';

/** `…` trong lời giải thích ⇒ <code>. */
function chuCoMa(s: string): ReactNode {
  const phan = s.split(/(`[^`\n]+`)/g);
  return phan.map((p, i) => (p.length > 2 && p.startsWith('`') && p.endsWith('`')
    ? <code key={i}>{p.slice(1, -1)}</code>
    : <Fragment key={i}>{p}</Fragment>));
}

/** Cú pháp comment theo ngôn ngữ — chú thích hiện như comment thật của ngôn ngữ đó. */
function boc(ngon: string | undefined, chu0: string): string {
  const chu = chu0.replace(/`/g, ''); // trong comment không có <code> — bỏ dấu `…` của lời giải thích
  const n = String(ngon ?? '').toLowerCase();
  if (/^(html|xml|vue|svg|md|markdown)$/.test(n)) return `<!-- ${chu} -->`;
  if (n === 'css' || n === 'scss') return `/* ${chu} */`;
  if (/^(py|python|sh|bash|zsh|shell|yaml|yml|dockerfile|toml|ini|conf|r|rb|ruby|nginx|makefile|ps1|powershell)$/.test(n)) return `# ${chu}`;
  if (/^(sql|lua|hs|haskell)$/.test(n)) return `-- ${chu}`;
  return `// ${chu}`;
}

/** Dấu nhắc gọn: "an@MacBook-Air du-an %" ⇒ "%"; "mysql>" / "postgres=#" giữ nguyên; Console DevTools ⇒ "›". */
function kyHieuNhac(nhac: string | undefined): string {
  const n = String(nhac ?? '').trim();
  if (!n) return '$';
  if (n.startsWith('console')) return '›';
  return n.length <= 12 ? n : n.slice(-1);
}

function NutChep({ chu }: { chu: string }) {
  const [xong, datXong] = useState(false);
  return (
    <button type="button" className="lv-chep" title={xong ? 'Đã chép' : 'Chép'} aria-label="Chép"
      onClick={async () => {
        try { await navigator.clipboard.writeText(chu); datXong(true); window.setTimeout(() => datXong(false), 1600); } catch { /* trình duyệt chặn clipboard */ }
      }}>
      {xong ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function KhoiLenh({ m }: { m: MucLenhVideo }) {
  return (
    <>
      <div className="lv-khoi">
        <pre><span className="lv-nhac">{kyHieuNhac(m.nhac) + ' '}</span>{m.lenh}</pre>
        <NutChep chu={m.lenh ?? ''} />
      </div>
      <p className="lv-giai">{chuCoMa(m.giai)}</p>
      {!!m.chiTiet?.length && (
        <dl className="lv-ct">
          {m.chiTiet.map((p, i) => (
            <Fragment key={i}><dt><code>{p.phan}</code></dt><dd>{chuCoMa(p.nghia)}</dd></Fragment>
          ))}
        </dl>
      )}
      {m.ketQua && <p className="lv-phu"><b>Kết quả: </b>{chuCoMa(m.ketQua)}</p>}
      {!!m.ra?.length && (
        <details className="lv-ra">
          <summary>Output trên video ({m.ra.length} dòng)</summary>
          <pre>{m.ra.join('\n')}</pre>
        </details>
      )}
    </>
  );
}

function KhoiMa({ m }: { m: MucLenhVideo }) {
  const dong = useMemo(() => String(m.ma ?? '').split('\n'), [m.ma]);
  const chuThich = useMemo(() => new Map((m.dong ?? []).map((d) => [d.so, d.giai])), [m.dong]);
  return (
    <>
      <div className="lv-khoi">
        <pre>
          {dong.map((d, i) => {
            const c = chuThich.get(i + 1);
            return (
              <Fragment key={i}>
                {c ? <span className="lv-dong-co-chu">{d}<span className="lv-chu-thich">{'   ' + boc(m.ngon, c)}</span></span> : d}
                {i < dong.length - 1 ? '\n' : null}
              </Fragment>
            );
          })}
        </pre>
        <NutChep chu={m.ma ?? ''} />
      </div>
      <p className="lv-giai">{chuCoMa(m.giai)}</p>
      {!!m.sua?.length && (
        <p className="lv-phu"><b>Đã sửa trong video: </b>
          {m.sua.map((z, i) => <Fragment key={i}>{i ? ' · ' : ''}<code>{z.truoc.trim()}</code> → <code>{z.sau.trim()}</code></Fragment>)}
        </p>
      )}
    </>
  );
}

export default function LenhTrongVideo({ lessonId, track, layGiay, tua }: {
  lessonId: number;
  track: Track | null;
  layGiay: () => number | null;
  /** Tua (trang học tự cuộn tới khung video). */
  tua: (giay: number) => void;
}) {
  const khoa = `${lessonId}:${track}`;
  const [duLieu, datDuLieu] = useState<{ khoa: string; items: MucLenhVideo[] } | null>(null);
  useEffect(() => {
    if (track !== 'VI' && track !== 'EN') { datDuLieu(null); return undefined; }
    let huy = false;
    datDuLieu(null);
    videoHocApi.lenhVideo(lessonId, track)
      .then((r) => { if (!huy) datDuLieu({ khoa, items: r.data.data?.items ?? [] }); })
      .catch(() => { if (!huy) datDuLieu({ khoa, items: [] }); });
    return () => { huy = true; };
  }, [lessonId, track, khoa]);

  const items = useMemo(() => (duLieu?.khoa === khoa ? duLieu.items : []), [duLieu, khoa]);
  const dem = useMemo(() => ({
    lenh: items.filter((m) => m.loai === 'lenh').length,
    ma: items.filter((m) => m.loai === 'ma').length,
  }), [items]);

  const [mo, datMo] = useState(false);
  useEffect(() => { datMo(false); }, [khoa]);

  /* Mục đang phát: đọc giây mỗi 1 s khi đang mở (đổi state CHỈ khi sang mục khác). */
  const layGiayRef = useRef(layGiay); layGiayRef.current = layGiay;
  const [dang, datDang] = useState(-1);
  useEffect(() => {
    if (!mo || !items.length) return undefined;
    const h = window.setInterval(() => {
      const g = layGiayRef.current();
      let i = -1;
      if (g !== null) for (let k = 0; k < items.length && items[k].t <= g + 0.5; k++) i = k;
      datDang((cu) => (cu === i ? cu : i));
    }, 1000);
    return () => window.clearInterval(h);
  }, [mo, items]);

  if (!items.length) return null;

  const tom = [dem.lenh ? `${dem.lenh} lệnh` : '', dem.ma ? `${dem.ma} khối code` : ''].filter(Boolean).join(' · ');
  return (
    <section className="gsb mt-3 overflow-hidden rounded-2xl" aria-label="Lệnh và code trong video"
      style={{ border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
      <button type="button" onClick={() => datMo((v) => !v)} aria-expanded={mo}
        className="flex w-full flex-wrap items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold" style={{ color: 'var(--gsb-chu)' }}>
        <TerminalSquare size={16} style={{ color: 'var(--gsb-nhan)' }} />
        <span>Lệnh &amp; code trong video</span>
        <span className="gsb-huy-hieu">{tom}</span>
        <span className="ml-auto hidden text-xs font-normal sm:inline" style={{ color: 'var(--gsb-chu-3)' }}>
          {mo ? 'Thu gọn' : 'Bấm để xem từng lệnh làm gì'}
        </span>
        <ChevronDown size={15} className={mo ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {mo && (
        <ol className="max-h-[70vh] overflow-y-auto">
          {items.map((m, i) => (
            <li key={`${m.t}-${i}`} className="lv-muc" data-dang={i === dang ? '1' : undefined}>
              <div className="lv-dau">
                <button type="button" className="lv-moc" onClick={() => tua(m.t)} title={`Tua tới ${moc(m.t)}`}>{moc(m.t)}</button>
                <span className="lv-nhan">{m.loai === 'lenh' ? 'Terminal' : (m.tep ?? (m.ngon ? m.ngon.toUpperCase() : 'Code'))}</span>
                {m.canh && <span className="lv-canh" title={m.canh}>{m.canh}</span>}
              </div>
              {m.loai === 'lenh' ? <KhoiLenh m={m} /> : <KhoiMa m={m} />}
              {m.ghiChu && <p className="lv-phu">💡 {chuCoMa(m.ghiChu)}</p>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
