'use client';

/**
 * 🃏 FLASHCARDS IELTS — 100 từ mới/ngày + lặp lại ngắt quãng (07/10/2026)
 * /language/en/ielts/the-tu · app desktop: /ielts/the-tu
 * ─────────────────────────────────────────────────────────────────────────
 * Bố cục kiểu thẻ học quen thuộc: tên bộ trái trên, nút Match / Practice Flashcards phải trên,
 * thẻ lớn giữa (bấm/Space lật), dưới thẻ: công tắc Track Progress, ✗ 4/58 ✓, thanh tiến độ mảnh,
 * ba cột Total Words · Have learned · Need to study.
 *
 * Phiên học: thẻ ĐẾN HẠN ôn hiện TRƯỚC, rồi mới tới từ mới (tối đa mục tiêu/ngày − số đã học hôm nay).
 * Chấm: ✗ = Quên (1) · Khó (2) · ✓ = Nhớ (3) · Dễ (4) — phím 1–4. Quên ⇒ thẻ quay lại sau ~5 thẻ.
 * Trạng thái SRS lưu MÁY CHỦ theo người (web + app desktop dùng chung).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MenuTren, useHienThi } from '../chung/MenuTren';
import { BO_TU, taiKho, type Tu } from './boTu';
import { tuHomNay, tuThongKe, tuDanhGia, tuMucTieu, loiGhi, loiMang, type HomNay, type ThongKeTu } from '../chung/api';
import { play } from '@/components/sach-hoc/audio';
import { useLangUser } from '@/components/language/primitives';
import s from '../chung/cdt.module.css';

type CheDo = 'hoc' | 'match' | 'go';
type The = { k: string; loai: 'on' | 'moi' };

const KHOA_BO = 'ielts-the-tu:bo';
const KHOA_THEO = 'ielts-the-tu:theo-doi';
const KHOA_MATCH = 'ielts-the-tu:match-nhanh';

const docLS = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const ghiLS = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* bỏ qua */ } };
const tron = <T,>(a: T[]): T[] => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const nghe = (w: string) => { void play({ text: w, voice: 'uk-nu', toc: 0.9 }); };

export default function TheTu() {
  const { isAuthenticated } = useLangUser();
  const { thuocTinh } = useHienThi();
  const [kho, setKho] = useState<{ tu: Tu[]; theoBo: Record<string, number> } | null>(null);
  const [bo, setBo] = useState('tat');
  const [hn, setHn] = useState<HomNay | null>(null);
  const [tk, setTk] = useState<ThongKeTu | null>(null);
  const [cheDo, setCheDo] = useState<CheDo>('hoc');
  const [theoDoi, setTheoDoi] = useState(true);
  const [hang, setHang] = useState<The[]>([]);
  const [vt, setVt] = useState(0);
  const [lat, setLat] = useState(false);
  const [daCham, setDaCham] = useState(0);
  const [loi, setLoi] = useState('');
  const [suaMucTieu, setSuaMucTieu] = useState<string | null>(null);

  useEffect(() => {
    const b = docLS(KHOA_BO); if (b) setBo(b);
    const t = docLS(KHOA_THEO); if (t === '0') setTheoDoi(false);
    void taiKho().then(setKho);
  }, []);

  const taiMayChu = useCallback(async () => {
    if (!isAuthenticated) { setHn(null); setTk(null); return; }
    try { const [a, b] = await Promise.all([tuHomNay(), tuThongKe()]); setHn(a); setTk(b); setLoi(''); }
    catch (e) { setLoi(loiMang(e).message ?? 'Không tải được tiến độ từ máy chủ.'); }
  }, [isAuthenticated]);
  useEffect(() => { void taiMayChu(); }, [taiMayChu]);

  const theoKhoa = useMemo(() => new Map((kho?.tu ?? []).map((t) => [t.k, t])), [kho]);
  const tuBo = useMemo(() => (kho?.tu ?? []).filter((t) => bo === 'tat' || t.bo === bo), [kho, bo]);

  // Dựng hàng đợi hôm nay: ĐẾN HẠN trước, rồi từ MỚI (theo thứ tự bộ) tới đủ mục tiêu.
  useEffect(() => {
    if (!kho) return;
    if (isAuthenticated && !hn) return;
    const daCo = new Set(hn?.daCo ?? []);
    const on: The[] = (hn?.denHan ?? []).filter((t) => theoKhoa.has(t.tu)).map((t) => ({ k: t.tu, loai: 'on' }));
    const conMoi = Math.max(0, (hn?.mucTieu ?? 100) - (hn?.moiHomNay ?? 0));
    const moi: The[] = tuBo.filter((t) => !daCo.has(t.k)).slice(0, conMoi).map((t) => ({ k: t.k, loai: 'moi' }));
    setHang([...on, ...moi]);
    setVt(0); setLat(false); setDaCham(0);
    // Chỉ dựng lại khi đổi bộ / tải lại dữ liệu ngày — không dựng lại sau mỗi lần chấm.
  }, [kho, hn, bo, isAuthenticated, tuBo, theoKhoa]);

  const the = hang[vt];
  const tu = the ? theoKhoa.get(the.k) : undefined;

  const cham = useCallback((diem: 1 | 2 | 3 | 4) => {
    if (!the) return;
    if (theoDoi && isAuthenticated) {
      void tuDanhGia(the.k, diem).catch((e) => setLoi(loiMang(e).message ?? 'Chưa lưu được lần chấm này.'));
      setDaCham((n) => n + 1);
    }
    setHang((h) => {
      if (diem !== 1) return h;
      // Quên ⇒ gặp lại sau ~5 thẻ trong cùng phiên.
      const moi = [...h];
      moi.splice(Math.min(moi.length, vt + 6), 0, { k: the.k, loai: 'on' });
      return moi;
    });
    setVt((v) => v + 1);
    setLat(false);
  }, [the, theoDoi, isAuthenticated, vt]);

  // Làm mới thống kê sau mỗi 10 thẻ.
  useEffect(() => { if (daCham && daCham % 10 === 0) void tuThongKe().then(setTk).catch(() => {}); }, [daCham]);

  // Phím: Space lật · 1–4 chấm · ←/→ đi thẻ khi tắt Track Progress · P nghe.
  useEffect(() => {
    if (cheDo !== 'hoc') return;
    const h = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el?.closest('input, textarea, select')) return;
      if (e.code === 'Space') { e.preventDefault(); setLat((v) => !v); }
      else if (['1', '2', '3', '4'].includes(e.key)) { e.preventDefault(); cham(Number(e.key) as 1 | 2 | 3 | 4); }
      else if (e.key === 'ArrowRight') { setVt((v) => Math.min(hang.length, v + 1)); setLat(false); }
      else if (e.key === 'ArrowLeft') { setVt((v) => Math.max(0, v - 1)); setLat(false); }
      else if (e.key.toLowerCase() === 'p' && tu) nghe(tu.w);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [cheDo, cham, hang.length, tu]);

  const tong = tuBo.length;
  const daThuoc = tk?.daThuoc ?? 0;
  const tenBo = bo === 'tat' ? 'Học hôm nay — tất cả bộ' : BO_TU.find((b) => b.id === bo)?.ten ?? '';
  const soOn = hang.filter((h) => h.loai === 'on').length;

  return (
    <div className={s.goc} {...thuocTinh}>
      <MenuTren dang="the-tu" />
      <div className={s.khung} style={{ maxWidth: 1000 }}>
        <div className={s.ftDau}>
          <div>
            <h1 className={s.ftTen}>{tenBo}</h1>
            <label className={s.mo} style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
              Nguồn từ mới:
              <select value={bo} onChange={(e) => { setBo(e.target.value); ghiLS(KHOA_BO, e.target.value); }} style={{ height: 28, maxWidth: 260 }}>
                <option value="tat">Tất cả bộ (theo thứ tự dễ → khó)</option>
                {BO_TU.map((b) => <option key={b.id} value={b.id}>{b.ten} · {kho?.theoBo[b.id] ?? '…'} từ</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className={`${s.nutXanh} ${cheDo === 'match' ? s.nutXanhOn : ''}`} onClick={() => setCheDo('match')}>Match</button>
            <button type="button" className={`${s.nutXanh} ${cheDo === 'hoc' ? s.nutXanhOn : ''}`} onClick={() => setCheDo('hoc')}>Practice Flashcards</button>
            <button type="button" className={`${s.nutPhu} ${cheDo === 'go' ? s.tabOn : ''}`} onClick={() => setCheDo('go')} title="Nghe rồi gõ lại chính tả">🎧 Gõ lại</button>
          </div>
        </div>

        {!kho && <p className={s.mo}>Đang tải kho từ…</p>}
        {!isAuthenticated && <p className={s.mo}>Chưa đăng nhập: vẫn học được, nhưng tiến độ lặp lại ngắt quãng không được lưu (đăng nhập để đồng bộ web + app).</p>}
        {loi && <p className={s.loi}>{loi}</p>}

        {cheDo === 'hoc' && kho && (
          <>
            {tu ? (
              <div className={`${s.the} ${lat ? s.theLat : ''}`} role="button" tabIndex={0} aria-label={lat ? `Mặt sau: ${tu.vi}` : `Thẻ: ${tu.w}. Bấm hoặc Space để lật`}
                onClick={() => setLat((v) => !v)} onKeyDown={(e) => { if (e.key === 'Enter') setLat((v) => !v); }}>
                <div className={s.theTrong}>
                  <div className={s.mat}>
                    <span className={s.mo} style={{ position: 'absolute', top: 12, left: 16 }}>{the.loai === 'on' ? 'Ôn lại' : 'Từ mới'}{tu.chuDe ? ` · ${tu.chuDe}` : ''}</span>
                    <div className={s.tuLon}>{tu.w}</div>
                    <div className={s.ipa}>{tu.ipa} {tu.pos && <i>· {tu.pos}</i>}</div>
                    <button type="button" className={s.nutPhu} onClick={(e) => { e.stopPropagation(); nghe(tu.w); }} aria-label="Nghe phát âm">🔊 Nghe <span className={s.phim}>P</span></button>
                    <span className={s.lapLai} aria-hidden>⟳</span>
                  </div>
                  <div className={`${s.mat} ${s.matSau}`}>
                    <div className={s.nghiaLon}>{tu.vi}</div>
                    <div className={s.mo}>{tu.w} · {tu.ipa}</div>
                    {tu.ex && <div className={s.viDu}>“{tu.ex}”{tu.exVi ? <><br /><span className={s.mo}>{tu.exVi}</span></> : null}</div>}
                    {tu.col && <div className={s.viDu}>Collocation: <b>{tu.col}</b></div>}
                    <span className={s.lapLai} aria-hidden>⟳</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={s.the} style={{ cursor: 'default' }}>
                <div className={s.mat} style={{ position: 'absolute' }}>
                  <div className={s.nghiaLon}>🎉 Xong phiên hôm nay</div>
                  <div className={s.viDu}>{daCham ? `Bạn vừa chấm ${daCham} thẻ.` : 'Không còn thẻ đến hạn hay từ mới trong mục tiêu hôm nay.'} Muốn học thêm thì tăng mục tiêu ngày bên dưới, hoặc chơi Match / Gõ lại.</div>
                  <button type="button" className={s.nutPhu} onClick={() => void taiMayChu()}>Tải lại hàng đợi</button>
                </div>
              </div>
            )}

            <div className={s.ftDuoi}>
              <label className={s.congTac}>
                <input type="checkbox" checked={theoDoi} disabled={!isAuthenticated} onChange={(e) => { setTheoDoi(e.target.checked); ghiLS(KHOA_THEO, e.target.checked ? '1' : '0'); }} />
                Track Progress
              </label>
              <div className={s.danhGia}>
                <button type="button" className={s.nutX} onClick={() => cham(1)} disabled={!tu} aria-label="Quên (phím 1)" title="Quên — phím 1">✗</button>
                <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{Math.min(vt + 1, hang.length)} / {hang.length}</span>
                <button type="button" className={s.nutV} onClick={() => cham(3)} disabled={!tu} aria-label="Nhớ (phím 3)" title="Nhớ — phím 3">✓</button>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button type="button" className={s.nutNho} onClick={() => cham(2)} disabled={!tu} title="Khó — phím 2">Khó <span className={s.phim}>2</span></button>
                <button type="button" className={s.nutNho} onClick={() => cham(4)} disabled={!tu} title="Dễ — phím 4">Dễ <span className={s.phim}>4</span></button>
                <span className={s.mo} style={{ fontSize: 11.5 }}><span className={s.phim}>Space</span> lật</span>
              </div>
            </div>
            <div className={s.thanhTien} aria-hidden><i style={{ width: `${hang.length ? (Math.min(vt, hang.length) / hang.length) * 100 : 0}%` }} /></div>
            <div className={s.baCot}>
              <div>Total Words<b>{tong}</b></div>
              <div>Have learned<b>{daThuoc}</b></div>
              <div>Need to study<b>{Math.max(0, tong - daThuoc)}</b></div>
            </div>
            <ThongKe tk={tk} hn={hn} soOn={soOn} soMoi={hang.length - soOn} dangNhap={isAuthenticated}
              suaMucTieu={suaMucTieu} setSuaMucTieu={setSuaMucTieu}
              luuMucTieu={async (n) => { try { await tuMucTieu(n); setSuaMucTieu(null); await taiMayChu(); } catch (e) { setLoi(loiMang(e).message ?? 'Chưa lưu được mục tiêu.'); } }} />
          </>
        )}

        {cheDo === 'match' && kho && <Match tuDs={chonTuLuyen(hang, tuBo, theoKhoa)} />}
        {cheDo === 'go' && kho && <GoLai tuDs={chonTuLuyen(hang, tuBo, theoKhoa)} dangNhap={isAuthenticated} />}
      </div>
    </div>
  );
}

/** Từ để chơi Match / Gõ lại: ưu tiên từ trong phiên hôm nay, thiếu thì lấy đầu bộ. */
function chonTuLuyen(hang: The[], tuBo: Tu[], theoKhoa: Map<string, Tu>): Tu[] {
  const ra: Tu[] = [];
  const co = new Set<string>();
  for (const h of hang) { const t = theoKhoa.get(h.k); if (t && !co.has(t.k)) { co.add(t.k); ra.push(t); } }
  for (const t of tuBo) { if (ra.length >= 60) break; if (!co.has(t.k)) { co.add(t.k); ra.push(t); } }
  return ra;
}

function ThongKe({ tk, hn, soOn, soMoi, dangNhap, suaMucTieu, setSuaMucTieu, luuMucTieu }: {
  tk: ThongKeTu | null; hn: HomNay | null; soOn: number; soMoi: number; dangNhap: boolean;
  suaMucTieu: string | null; setSuaMucTieu: (v: string | null) => void; luuMucTieu: (n: number) => void;
}) {
  if (!dangNhap) return null;
  if (!tk || !hn) return <p className={s.mo}>Đang tải thống kê…</p>;
  const max = Math.max(1, ...tk.ngay30.map((d) => d.moi + d.on));
  return (
    <section style={{ marginTop: 18 }} aria-label="Thống kê">
      <div className={s.tomTat}>
        <div className={s.oSoLieu}><span>Đến hạn hôm nay</span><b>{tk.denHan}</b><span className={s.ghiChuNho}>{soOn} thẻ ôn trong phiên · ôn TRƯỚC từ mới</span></div>
        <div className={s.oSoLieu}>
          <span>Từ mới hôm nay</span><b>{hn.moiHomNay}/{hn.mucTieu}</b>
          {suaMucTieu == null ? (
            <button type="button" className={s.nutNho} onClick={() => setSuaMucTieu(String(hn.mucTieu))}>Đổi mục tiêu ngày</button>
          ) : (
            <span style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              <input type="number" min={5} max={300} value={suaMucTieu} onChange={(e) => setSuaMucTieu(e.target.value)} style={{ width: 70, height: 28 }} aria-label="Mục tiêu từ mới mỗi ngày" />
              <button type="button" className={s.nutPhu} style={{ height: 28 }} onClick={() => luuMucTieu(Number(suaMucTieu))}>Lưu</button>
            </span>
          )}
        </div>
        <div className={s.oSoLieu}><span>Chuỗi ngày</span><b>{tk.chuoi} 🔥</b><span className={s.ghiChuNho}>ngày liên tiếp có học thẻ</span></div>
        <div className={s.oSoLieu}>
          <span>Nhớ sau ≥ 7 ngày</span><b>{tk.nho7.tiLe != null ? `${tk.nho7.tiLe}%` : '—'}</b>
          <span className={s.ghiChuNho}>{tk.nho7.tong ? `${tk.nho7.nho}/${tk.nho7.tong} lần ôn cách ≥ 7 ngày vẫn nhớ` : 'cần ôn lại sau ≥ 7 ngày mới có số'}</span>
        </div>
      </div>
      <div className={s.mo} style={{ marginBottom: 4 }}>30 ngày qua · <span style={{ color: 'var(--c-green)' }}>■</span> từ mới · <span style={{ color: 'var(--c-brand)' }}>■</span> lượt ôn {soMoi ? `· phiên này còn ${soMoi} từ mới` : ''}</div>
      <div className={s.bieuDo} role="img" aria-label="Biểu đồ số thẻ học 30 ngày">
        {tk.ngay30.map((d) => (
          <div key={d.ngay} title={`${d.ngay}: ${d.moi} mới, ${d.on} ôn`}>
            <i className={s.cotMoi} style={{ height: `${(d.moi / max) * 100}%` }} />
            <i className={s.cotOn} style={{ height: `${(d.on / max) * 100}%` }} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Match: ghép từ – nghĩa, tính giờ ── */
function Match({ tuDs }: { tuDs: Tu[] }) {
  const [vong, setVong] = useState(0);
  const cap = useMemo(() => tron(tuDs.slice(0, 40)).slice(0, 6), [tuDs, vong]); // eslint-disable-line react-hooks/exhaustive-deps
  const o = useMemo(() => tron(cap.flatMap((t) => [{ id: `w:${t.k}`, k: t.k, s: t.w }, { id: `v:${t.k}`, k: t.k, s: t.vi }])), [cap]);
  const [chon, setChon] = useState<string | null>(null);
  const [xong, setXong] = useState<Set<string>>(new Set());
  const [sai, setSai] = useState<string[]>([]);
  const [batDau, setBatDau] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [ketThuc, setKetThuc] = useState<number | null>(null);
  const [kyLuc, setKyLuc] = useState<number | null>(null);
  const [phat, setPhat] = useState(0);
  useEffect(() => { const v = Number(docLS(KHOA_MATCH)); if (v > 0) setKyLuc(v); }, []);
  useEffect(() => { setXong(new Set()); setChon(null); setSai([]); setBatDau(Date.now()); setKetThuc(null); setPhat(0); }, [cap]);
  useEffect(() => { if (ketThuc) return; const t = setInterval(() => setNow(Date.now()), 100); return () => clearInterval(t); }, [ketThuc]);

  const bam = (x: { id: string; k: string }) => {
    if (xong.has(x.id) || ketThuc) return;
    if (!chon) { setChon(x.id); return; }
    if (chon === x.id) { setChon(null); return; }
    const k0 = chon.slice(2);
    if (k0 === x.k && chon[0] !== x.id[0]) {
      const moi = new Set(xong); moi.add(chon); moi.add(x.id);
      setXong(moi); setChon(null);
      if (moi.size === o.length) {
        const giay = (Date.now() - batDau) / 1000 + phat;
        setKetThuc(giay);
        if (!kyLuc || giay < kyLuc) { setKyLuc(giay); ghiLS(KHOA_MATCH, String(giay)); }
      }
    } else {
      setSai([chon, x.id]); setPhat((p) => p + 1); setChon(null);
      setTimeout(() => setSai([]), 450);
    }
  };
  if (cap.length < 2) return <p className={s.mo}>Chưa đủ từ để chơi Match.</p>;
  const giay = ketThuc ?? (now - batDau) / 1000 + phat;
  return (
    <section aria-label="Match">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px', flexWrap: 'wrap', gap: 8 }}>
        <span>Ghép mỗi từ với nghĩa của nó. Sai một lần: +1 giây.</span>
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: 18 }}>{giay.toFixed(1)}s{kyLuc ? <span className={s.mo} style={{ fontWeight: 400, fontSize: 13 }}> · kỷ lục {kyLuc.toFixed(1)}s</span> : null}</span>
      </div>
      {ketThuc ? (
        <div className={s.mat} style={{ position: 'relative', minHeight: 200 }}>
          <div className={s.nghiaLon}>⏱ {ketThuc.toFixed(1)} giây</div>
          <div className={s.viDu}>{ketThuc === kyLuc ? 'Kỷ lục mới!' : 'Chơi lại để phá kỷ lục.'}</div>
          <button type="button" className={s.nutXanh} onClick={() => setVong((v) => v + 1)}>Chơi lại</button>
        </div>
      ) : (
        <div className={s.luoiMatch}>
          {o.map((x) => (
            <button key={x.id} type="button" onClick={() => bam(x)} aria-pressed={chon === x.id} data-cap={x.k}
              className={`${s.oMatch} ${chon === x.id ? s.oMatchChon : ''} ${sai.includes(x.id) ? s.oMatchSai : ''} ${xong.has(x.id) ? s.oMatchXong : ''}`}>
              {x.s}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Gõ lại: nghe → gõ chính tả; sai ⇒ vào Sổ lỗi (Từ vựng · chính tả) ── */
function GoLai({ tuDs, dangNhap }: { tuDs: Tu[]; dangNhap: boolean }) {
  const ds = useMemo(() => tuDs.slice(0, 30), [tuDs]);
  const [i, setI] = useState(0);
  const [go, setGo] = useState('');
  const [kq, setKq] = useState<null | boolean>(null);
  const [dem, setDem] = useState({ dung: 0, sai: 0 });
  const o = useRef<HTMLInputElement>(null);
  const t = ds[i];
  useEffect(() => { if (t) { nghe(t.w); o.current?.focus(); } }, [t]);
  if (!t) return <div className={s.mat} style={{ position: 'relative', minHeight: 200 }}><div className={s.nghiaLon}>Xong {ds.length} từ</div><div className={s.viDu}>Đúng {dem.dung} · Sai {dem.sai}</div><button type="button" className={s.nutXanh} onClick={() => { setI(0); setDem({ dung: 0, sai: 0 }); }}>Làm lại</button></div>;
  const kiem = () => {
    if (kq !== null) { setI((x) => x + 1); setGo(''); setKq(null); return; }
    const dung = go.trim().toLowerCase().replace(/\s+/g, ' ') === t.w.trim().toLowerCase().replace(/\s+/g, ' ');
    setKq(dung);
    setDem((d) => ({ dung: d.dung + (dung ? 1 : 0), sai: d.sai + (dung ? 0 : 1) }));
    if (!dung && dangNhap) {
      void loiGhi([{ nguon: `tu:${t.k}`, kyNang: 'tuvung', dang: 'Chính tả (nghe – gõ)', cauHoi: `Nghe và gõ lại từ: ${t.vi} (${t.pos})`, daChon: go.trim() || '(bỏ trống)', dapAn: t.w, giaiThich: `${t.w} ${t.ipa} — ${t.vi}${t.ex ? `. Ví dụ: ${t.ex}` : ''}`, lyDo: 'chinh-ta', duLieu: { loai: 'tu', tu: t.w } }]).catch(() => {});
    }
  };
  return (
    <section aria-label="Nghe và gõ lại" style={{ textAlign: 'center' }}>
      <p className={s.mo}>Từ {i + 1}/{ds.length} · Đúng {dem.dung} · Sai {dem.sai}{dangNhap ? ' · từ gõ sai tự vào Sổ lỗi' : ''}</p>
      <div className={s.mat} style={{ position: 'relative', minHeight: 230 }}>
        <button type="button" className={s.nutXanh} onClick={() => nghe(t.w)}>🔊 Nghe lại</button>
        <div className={s.mo}>Gợi ý nghĩa: {t.vi} · {t.pos}</div>
        <input ref={o} className={s.goO} value={go} onChange={(e) => setGo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') kiem(); }}
          readOnly={kq !== null} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} aria-label="Gõ từ vừa nghe" />
        {kq !== null && <div style={{ fontSize: 18, fontWeight: 600, color: kq ? 'var(--c-ok)' : 'var(--c-red)' }}>{kq ? '✓ Đúng' : <>✗ Đúng là: <b>{t.w}</b> <span className={s.mo}>{t.ipa}</span></>}</div>}
        <button type="button" className={s.nutPhu} onClick={kiem}>{kq === null ? 'Kiểm tra (Enter)' : 'Từ tiếp (Enter)'}</button>
      </div>
    </section>
  );
}
