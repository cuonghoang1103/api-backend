'use client';

/**
 * 🎌 LUYỆN BẢNG CHỮ CÁI (09/11/2026) — kiểu Tofugu Kana Quiz + kana.pro, cho người bắt đầu từ số 0.
 * Người học: "nhất là phần luyện bảng chữ cái và chữ Hán… làm phần luyện tập đầy đủ nhiều cách để học".
 *
 * 4 cách luyện trên đúng các hàng chữ mình chọn (hiragana/katakana · cơ bản/âm đục/âm ghép):
 *   ⌨️ Nhìn chữ → gõ romaji (Tofugu): gõ đúng là tự sang chữ sau, không cần Enter.
 *   🔤 Nhìn romaji → chọn chữ (kana.pro): 4 lựa chọn, nhiễu ưu tiên chữ DỄ NHẦM hình.
 *   🎧 Nghe → chọn chữ.
 *   📊 Bảng tiến độ: mỗi chữ một ô tô màu theo độ thuộc; chạm để nghe.
 * Chữ yếu (hay sai, chưa gặp) ra nhiều hơn; sai thì hiện mẹo nhớ hình chữ và chữ đó quay lại sớm.
 * Tiến độ lưu trên máy (localStorage) — không cần đăng nhập, web và app như nhau.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';
import { play } from '../audio';
import { HIRAGANA, KATAKANA, DE_NHAM, MEO, type KanaChu, type KanaHang } from './kanaData';
import s from '../course.module.css';
import c from './onthe.module.css';
import k from './kana.module.css';

type CheDo = 'go' | 'chon' | 'nghe' | 'bang';
type ThongKe = Record<string, { d: number; sai: number; chuoi: number; ms: number }>;
type TuyChon = { bang: ('h' | 'k')[]; hang: string[]; cheDo: CheDo; soCau: number };

const LUU_TK = 'ct-kana-thongke-v1';
const LUU_TC = 'ct-kana-tuychon-v1';
const CHE_DO: { id: CheDo; icon: string; ten: string; mo: string }[] = [
  { id: 'go', icon: '⌨️', ten: 'Nhìn chữ → gõ', mo: 'kiểu Tofugu' },
  { id: 'chon', icon: '🔤', ten: 'Romaji → chọn chữ', mo: 'kiểu kana.pro' },
  { id: 'nghe', icon: '🎧', ten: 'Nghe → chọn chữ', mo: 'luyện tai' },
  { id: 'bang', icon: '📊', ten: 'Bảng tiến độ', mo: 'chữ nào yếu' },
];
const NHOM_TEN = { 'co-ban': 'Cơ bản (46 chữ)', duc: 'Âm đục ゛゜', ghep: 'Âm ghép ゃゅょ' } as const;

function doc<T>(key: string, md: T): T {
  try { const v = localStorage.getItem(key); return v ? { ...md, ...JSON.parse(v) } : md; } catch { return md; }
}
function ghi(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* chế độ riêng tư */ } }
const tron = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const dapAn = (x: KanaChu) => [x.r, ...(x.khac ?? [])];

/** Mức thuộc của một chữ: 0 chưa gặp · 1 đang học · 2 khá · 3 thuộc. */
function muc(t?: ThongKe[string]) {
  if (!t || t.d + t.sai === 0) return 0;
  const dung = t.d / (t.d + t.sai);
  if (t.chuoi >= 4 && dung >= 0.85) return 3;
  if (t.chuoi >= 2 && dung >= 0.7) return 2;
  return 1;
}

/** Chọn chữ kế tiếp có trọng số: chưa gặp / hay sai / chuỗi đúng ngắn ⇒ ra nhiều hơn; không lặp chữ vừa ra. */
function chonChu(ds: KanaChu[], tk: ThongKe, truoc?: string): KanaChu {
  const w = ds.map((x) => {
    if (x.k === truoc && ds.length > 1) return 0;
    const t = tk[x.k];
    if (!t) return 3;
    return 1 + t.sai * 1.5 / (1 + t.d * 0.5) + Math.max(0, 3 - t.chuoi);
  });
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < ds.length; i++) { r -= w[i]; if (r <= 0) return ds[i]; }
  return ds[ds.length - 1];
}

/** 3 phương án nhiễu: chữ dễ nhầm hình trước, rồi chữ cùng hàng, rồi ngẫu nhiên. */
function nhieu(dung: KanaChu, ds: KanaChu[]): KanaChu[] {
  const theoK = new Map(ds.map((x) => [x.k, x]));
  const cap = DE_NHAM.find((g) => g.includes(dung.k))?.filter((x) => x !== dung.k).map((x) => theoK.get(x)).filter(Boolean) as KanaChu[] ?? [];
  const con = tron(ds.filter((x) => x.k !== dung.k && x.r !== dung.r && !cap.includes(x)));
  const ra: KanaChu[] = [];
  for (const x of [...tron(cap), ...con]) { if (ra.length >= 3) break; if (!ra.some((y) => y.r === x.r)) ra.push(x); }
  return ra;
}

function useThongKe() {
  const [tk, setTk] = useState<ThongKe>({});
  useEffect(() => { setTk(doc<ThongKe>(LUU_TK, {})); }, []);
  const ghiNhan = useCallback((chu: string, dung: boolean, ms: number) => {
    setTk((cu) => {
      const t = cu[chu] ?? { d: 0, sai: 0, chuoi: 0, ms: 0 };
      const moi = { ...cu, [chu]: dung
        ? { d: t.d + 1, sai: t.sai, chuoi: t.chuoi + 1, ms: t.ms ? Math.round(t.ms * 0.7 + ms * 0.3) : ms }
        : { d: t.d, sai: t.sai + 1, chuoi: 0, ms: t.ms } };
      ghi(LUU_TK, moi);
      return moi;
    });
  }, []);
  const xoa = useCallback(() => { setTk({}); ghi(LUU_TK, {}); }, []);
  return { tk, ghiNhan, xoa };
}

type KetQua = { dung: number; sai: number; saiChu: KanaChu[]; ms: number[] };

function PhienLuyen({ ds, cheDo, soCau, tk, ghiNhan, onXong }: {
  ds: KanaChu[]; cheDo: Exclude<CheDo, 'bang'>; soCau: number; tk: ThongKe;
  ghiNhan: (chu: string, dung: boolean, ms: number) => void; onXong: (kq: KetQua) => void;
}) {
  const [hien, setHien] = useState<KanaChu>(() => chonChu(ds, tk));
  const [so, setSo] = useState(1);
  const [go, setGo] = useState('');
  const [phanHoi, setPhanHoi] = useState<null | { dung: boolean; chon?: string }>(null);
  const [kq, setKq] = useState<KetQua>({ dung: 0, sai: 0, saiChu: [], ms: [] });
  const [chuoi, setChuoi] = useState(0);
  const batDau = useRef(Date.now());
  const o = useRef<HTMLInputElement>(null);
  const quayLai = useRef<KanaChu[]>([]);
  const lua = useMemo(() => (cheDo === 'go' ? [] : tron([hien, ...nhieu(hien, ds)])), [hien, cheDo, ds]);

  useEffect(() => {
    batDau.current = Date.now();
    if (cheDo === 'go') o.current?.focus();
    if (cheDo === 'nghe') play({ text: hien.k });
  }, [hien, cheDo]);

  const sangCau = useCallback((kq2: KetQua) => {
    if (soCau > 0 && so >= soCau) { onXong(kq2); return; }
    setSo((x) => x + 1);
    setGo('');
    setPhanHoi(null);
    // Chữ vừa sai quay lại sau 3–5 câu (giống Tofugu) — chen trước lựa chọn ngẫu nhiên.
    const q = quayLai.current;
    if (q.length && Math.random() < 0.45) setHien(q.shift()!);
    else setHien(chonChu(ds, tk, hien.k));
  }, [soCau, so, onXong, ds, tk, hien.k]);

  const cham = (dung: boolean, chon?: string) => {
    const ms = Date.now() - batDau.current;
    ghiNhan(hien.k, dung, ms);
    const kq2 = { dung: kq.dung + (dung ? 1 : 0), sai: kq.sai + (dung ? 0 : 1), saiChu: dung || kq.saiChu.some((x) => x.k === hien.k) ? kq.saiChu : [...kq.saiChu, hien], ms: [...kq.ms, ms] };
    setKq(kq2);
    setChuoi((x) => (dung ? x + 1 : 0));
    setPhanHoi({ dung, chon });
    if (!dung) quayLai.current.push(hien);
    if (cheDo !== 'nghe' || dung) play({ text: hien.k });
    window.setTimeout(() => sangCau(kq2), dung ? 450 : 1900);
  };

  const onGo = (v: string) => {
    if (phanHoi) return;
    const g = v.toLowerCase().replace(/[^a-z]/g, '');
    setGo(g);
    if (dapAn(hien).includes(g)) cham(true);
    // Gõ đủ độ dài mà không khớp, và không còn đáp án nào bắt đầu bằng chuỗi này ⇒ chấm sai luôn.
    else if (g && !dapAn(hien).some((a) => a.startsWith(g))) cham(false);
  };

  const tiLe = kq.dung + kq.sai ? Math.round((kq.dung / (kq.dung + kq.sai)) * 100) : 100;
  return (
    <div className={k.phien}>
      <div className={k.thanh}>
        <span>Câu {so}{soCau > 0 ? `/${soCau}` : ''}</span>
        <span>{chuoi >= 3 && <span key={chuoi} className={k.chuoi}>🔥 {chuoi}</span>} ✓ {kq.dung} · ✗ {kq.sai} · {tiLe}%</span>
        <button type="button" className={c.btnSm} onClick={() => onXong(kq)}>Kết thúc</button>
      </div>
      {soCau > 0 && <div className={k.vach}><i style={{ width: `${((so - 1) / soCau) * 100}%` }} /></div>}

      <div className={`${k.the} ${phanHoi ? (phanHoi.dung ? k.theDung : k.theSai) : ''}`}>
        {cheDo === 'go' && <div key={so} className={k.chuTo} lang="ja">{hien.k}</div>}
        {cheDo === 'chon' && <div key={so} className={k.romajiTo}>{hien.r}</div>}
        {cheDo === 'nghe' && (
          <button type="button" className={k.nutNghe} onClick={() => play({ text: hien.k })} aria-label="Nghe lại">
            <Volume2 size={42} />
          </button>
        )}
        {phanHoi && !phanHoi.dung && (
          <div className={k.sua}>
            <span lang="ja" className={k.suaChu}>{hien.k}</span> = <b>{hien.r}</b>
            {MEO[hien.k] && <div className={k.meo}>💡 {MEO[hien.k]}</div>}
          </div>
        )}
      </div>

      {cheDo === 'go' ? (
        <input
          ref={o}
          className={`${c.input} ${k.oGo}`}
          value={go}
          onChange={(e) => onGo(e.target.value)}
          placeholder="gõ romaji, vd. ka"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} inputMode="text" lang="en"
          aria-label="Gõ cách đọc bằng chữ La-tinh"
        />
      ) : (
        <div className={k.luaChon}>
          {lua.map((x) => {
            const daChon = phanHoi?.chon === x.k;
            const la = phanHoi && x.k === hien.k;
            return (
              <button
                key={x.k}
                type="button"
                lang="ja"
                disabled={!!phanHoi}
                className={`${k.oChon} ${la ? k.oDung : daChon ? k.oSai : ''}`}
                onClick={() => cham(x.k === hien.k, x.k)}
              >{x.k}</button>
            );
          })}
        </div>
      )}
      <p className={k.goiY}>
        {cheDo === 'go' ? 'Gõ đúng là tự sang chữ sau. Chấp nhận cả si/ti/tu/hu/zi, nn.' : 'Bấm phím 1–4 hoặc chạm vào chữ.'}
      </p>
      <PhimSo on={!phanHoi && cheDo !== 'go'} lua={lua} chon={(x) => cham(x.k === hien.k, x.k)} />
    </div>
  );
}

/** Phím 1–4 chọn đáp án (chế độ chọn chữ / nghe). */
function PhimSo({ on, lua, chon }: { on: boolean; lua: KanaChu[]; chon: (x: KanaChu) => void }) {
  useEffect(() => {
    if (!on) return;
    const f = (e: KeyboardEvent) => {
      const i = Number(e.key) - 1;
      if (i >= 0 && i < lua.length && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); chon(lua[i]); }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [on, lua, chon]);
  return null;
}

function BangTienDo({ hangs, tk }: { hangs: KanaHang[]; tk: ThongKe }) {
  return (
    <div className={k.bang}>
      <div className={k.chuGiai}>
        <span><i className={k.m0} /> chưa gặp</span><span><i className={k.m1} /> đang học</span>
        <span><i className={k.m2} /> khá</span><span><i className={k.m3} /> thuộc</span>
      </div>
      {hangs.map((h) => (
        <div key={h.id} className={k.hang}>
          {h.chu.map((x) => {
            const t = tk[x.k];
            const m = muc(t);
            return (
              <button key={x.k} type="button" className={`${k.o} ${k[`m${m}`]}`} onClick={() => play({ text: x.k })}
                title={t ? `Đúng ${t.d} · sai ${t.sai}${t.ms ? ` · ~${(t.ms / 1000).toFixed(1)} giây` : ''}` : 'Chưa luyện'}>
                <span lang="ja" className={k.oChu}>{x.k}</span><span className={k.oRo}>{x.r}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Pháo giấy khi lượt luyện đạt ≥ 90% (≥ 10 câu) — vài chục emoji bay toả, tự tắt. */
function Phao() {
  const ds = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    c: ['🎉', '✨', '🌸', '⭐', '🎊'][i % 5],
    dx: `${Math.round((Math.random() - 0.5) * 520)}px`, dy: `${Math.round(-60 - Math.random() * 220)}px`, r: `${Math.round((Math.random() - 0.5) * 540)}deg`,
    d: `${Math.random() * 0.25}s`,
  })), []);
  return <div className={k.phao} aria-hidden>{ds.map((x, i) => <i key={i} style={{ '--dx': x.dx, '--dy': x.dy, '--r': x.r, animationDelay: x.d } as CSSProperties}>{x.c}</i>)}</div>;
}

export default function LuyenKana() {
  const { tk, ghiNhan, xoa } = useThongKe();
  const [tc, setTcRaw] = useState<TuyChon>({ bang: ['h'], hang: HIRAGANA.filter((h) => h.nhom === 'co-ban').map((h) => h.id.slice(2)), cheDo: 'go', soCau: 30 });
  useEffect(() => { setTcRaw((x) => doc<TuyChon>(LUU_TC, x)); }, []);
  const setTc = (p: Partial<TuyChon>) => setTcRaw((x) => { const n = { ...x, ...p }; ghi(LUU_TC, n); return n; });
  const [dangLuyen, setDangLuyen] = useState(false);
  const [kq, setKq] = useState<KetQua | null>(null);

  // `hang` lưu theo hàng âm (a, ka, sa…) — áp cho cả hiragana và katakana đang bật.
  const hangs = useMemo(() => [
    ...(tc.bang.includes('h') ? HIRAGANA : []),
    ...(tc.bang.includes('k') ? KATAKANA : []),
  ].filter((h) => tc.hang.includes(h.id.slice(2))), [tc.bang, tc.hang]);
  const ds = useMemo(() => hangs.flatMap((h) => h.chu), [hangs]);
  const thuoc = ds.filter((x) => muc(tk[x.k]) === 3).length;
  const bat = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);
  const hangCua = (nhom: KanaHang['nhom']) => HIRAGANA.filter((h) => h.nhom === nhom).map((h) => h.id.slice(2));

  if (dangLuyen && tc.cheDo !== 'bang' && ds.length) {
    return (
      <div className={c.root}>
        <PhienLuyen ds={ds} cheDo={tc.cheDo} soCau={tc.soCau} tk={tk} ghiNhan={ghiNhan}
          onXong={(r) => { setKq(r); setDangLuyen(false); }} />
      </div>
    );
  }

  return (
    <div className={c.root}>
      {kq && kq.dung + kq.sai >= 10 && kq.dung / (kq.dung + kq.sai) >= 0.9 && <Phao />}
      {kq && (
        <div className={k.ketQua}>
          <div className={k.kqSo}>{kq.dung + kq.sai ? Math.round((kq.dung / (kq.dung + kq.sai)) * 100) : 0}%</div>
          <div>
            <b>Đúng {kq.dung}/{kq.dung + kq.sai}</b>
            {kq.ms.length > 0 && <> · trung bình {(kq.ms.reduce((a, b) => a + b, 0) / kq.ms.length / 1000).toFixed(1)} giây/chữ</>}
            {kq.saiChu.length > 0 && (
              <div className={k.kqSai}>Chữ cần ôn: {kq.saiChu.map((x) => <span key={x.k} lang="ja" title={x.r}>{x.k} <small>{x.r}</small></span>)}</div>
            )}
            {kq.saiChu.length === 0 && kq.dung > 0 && <div className={k.kqSai}>Không sai chữ nào — tăng thêm hàng mới hoặc chuyển sang katakana!</div>}
          </div>
        </div>
      )}

      <div className={c.filters}>
        <div className={c.fRow}>
          <span className={c.fLbl}>Bảng</span>
          <button type="button" className={c.chip} aria-pressed={tc.bang.includes('h')} onClick={() => setTc({ bang: bat(tc.bang, 'h').length ? bat(tc.bang, 'h') as TuyChon['bang'] : tc.bang })}>ひらがな Hiragana</button>
          <button type="button" className={c.chip} aria-pressed={tc.bang.includes('k')} onClick={() => setTc({ bang: bat(tc.bang, 'k').length ? bat(tc.bang, 'k') as TuyChon['bang'] : tc.bang })}>カタカナ Katakana</button>
        </div>
        {(['co-ban', 'duc', 'ghep'] as const).map((nhom) => (
          <div key={nhom} className={c.fRow}>
            <span className={c.fLbl}>{NHOM_TEN[nhom]}</span>
            {HIRAGANA.filter((h) => h.nhom === nhom).map((h) => {
              const id = h.id.slice(2);
              const ten = tc.bang.includes('h') ? h.ten : KATAKANA.find((x) => x.id === `k-${id}`)!.ten;
              return <button key={id} type="button" className={c.chip} lang="ja" aria-pressed={tc.hang.includes(id)} onClick={() => setTc({ hang: bat(tc.hang, id) })}>{ten}</button>;
            })}
            <button type="button" className={c.btnSm} onClick={() => {
              const nh = hangCua(nhom);
              const du = nh.every((x) => tc.hang.includes(x));
              setTc({ hang: du ? tc.hang.filter((x) => !nh.includes(x)) : [...new Set([...tc.hang, ...nh])] });
            }}>{hangCua(nhom).every((x) => tc.hang.includes(x)) ? 'Bỏ cả nhóm' : 'Chọn cả nhóm'}</button>
          </div>
        ))}
        <div className={c.fRow}>
          <span className={c.fLbl}>Số câu</span>
          {[20, 30, 50, 100, 0].map((n) => (
            <button key={n} type="button" className={c.chip} aria-pressed={tc.soCau === n} onClick={() => setTc({ soCau: n })}>{n || '∞ không giới hạn'}</button>
          ))}
        </div>
        <span className={c.count}>{ds.length} chữ đang chọn · đã thuộc {thuoc}/{ds.length}</span>
      </div>

      <div className={c.modes} role="group" aria-label="Cách luyện">
        {CHE_DO.map((m) => (
          <button key={m.id} type="button" className={c.mode} aria-pressed={tc.cheDo === m.id} onClick={() => setTc({ cheDo: m.id })}>
            <span aria-hidden>{m.icon}</span>{m.ten}<small>{m.mo}</small>
          </button>
        ))}
      </div>

      {tc.cheDo === 'bang' ? (
        <>
          <BangTienDo hangs={hangs} tk={tk} />
          <button type="button" className={c.btnSm} onClick={() => { if (window.confirm('Xoá toàn bộ tiến độ luyện bảng chữ trên máy này?')) xoa(); }}>
            <RotateCcw size={13} /> Xoá tiến độ
          </button>
        </>
      ) : (
        <button type="button" className={`${s.btn} ${k.batDau}`} disabled={!ds.length} onClick={() => { setKq(null); setDangLuyen(true); }}>
          ▶ Bắt đầu luyện {ds.length} chữ
        </button>
      )}
    </div>
  );
}
