'use client';

/**
 * Các phần của MỘT ngày "1000 câu nền": 📘 Khung câu & ngữ pháp · 🖼️ Từ vựng · 🎧 Nghe & nhắc ·
 * 💬 Hội thoại & trò chơi · ✍️ Viết tay · 📄 Bản in. (Việt→Anh, Anh→Việt, Ôn, Kiểm tra dùng PhienLuyen.)
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Square, Eye, EyeOff, Printer, Timer, ArrowRight, Check, X } from 'lucide-react';
import { Blocks } from '@/components/sach-hoc/Blocks';
import { play, stopAudio } from '@/components/sach-hoc/audio';
import { CauNghe, NoiTheo, doc, GIONG } from './CauNghe';
import { Chu, Anh } from './Chu';
import { PhienLuyen } from './PhienLuyen';
import { xao, hatTu } from './onLap';
import type { NgayCauNen, TuVung, Cau } from './kieu';
import s from './caunen.module.css';

const NutTiep = ({ nhan, onClick }: { nhan: string; onClick: () => void }) => (
  <div className={s.qActions} style={{ justifyContent: 'flex-end' }}>
    <button type="button" className={s.btn} onClick={onClick}>{nhan} <ArrowRight size={16} /></button>
  </div>
);

/* ── 📘 Khung câu & ngữ pháp ── */
export function PhanKhung({ ngay, onTiep }: { ngay: NgayCauNen; onTiep: () => void }) {
  const b = ngay.bai;
  return (
    <>
      <div className={s.card}>
        <div className={s.cardTitle}>📘 Khung câu hôm nay</div>
        <ul className={s.list}>{b.y.map((x, i) => <li key={i}><Chu text={x} /></li>)}</ul>
        {b.khung.map((k, i) => (
          <div key={i} className={s.formula}><b>{k.mau}</b><span>{k.vi}</span></div>
        ))}
      </div>
      <div className={s.card}>
        <div className={s.cardTitle}>🔀 Việt nghĩ thế này — Anh nói thế kia</div>
        <div className={s.cardSub}>Dịch từng chữ theo trật tự tiếng Việt là lỗi số một của người mới. So ba cột: câu Việt · dịch từng chữ (sai) · câu Anh đúng.</div>
        {b.soSanh.map((x, i) => (
          <div key={i} className={s.cmpRow}>
            <div className={`${s.cmpCell} ${s.cmpVi}`}><span className={s.cmpLab}>Tiếng Việt</span>{x.vi}</div>
            <div className={`${s.cmpCell} ${s.cmpSai}`}><span className={s.cmpLab}>Dịch từng chữ ✗</span><s>{x.tungChu}</s></div>
            <button type="button" className={`${s.cmpCell} ${s.cmpDung}`} style={{ textAlign: 'left', border: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }} onClick={() => doc(x.en)}>
              <span className={s.cmpLab}>Tiếng Anh ✓ 🔊</span><b>{x.en}</b>
            </button>
            <div className={s.cmpWhy}>👉 <Chu text={x.viSao} /></div>
          </div>
        ))}
      </div>
      {ngay.nguPhap?.length ? (
        <div className={s.card}>
          <div className={s.cardTitle}>📊 Ngữ pháp chi tiết</div>
          <Blocks blocks={ngay.nguPhap} />
        </div>
      ) : null}
      <div className={s.card}>
        <div className={s.cardTitle}>🔊 Ví dụ — chạm để nghe, rồi nói theo</div>
        {b.viDu.map((x, i) => <CauNghe key={i} en={x.en} vi={x.vi} />)}
        {b.meo?.length ? (
          <div className={s.formula} style={{ display: 'block', marginTop: 14 }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>💡 Mẹo nhớ</div>
            <ul className={s.list}>{b.meo.map((x, i) => <li key={i}><Chu text={x} /></li>)}</ul>
          </div>
        ) : null}
      </div>
      <NutTiep nhan="Đã hiểu — sang Từ vựng" onClick={onTiep} />
    </>
  );
}

/* ── 🖼️ Từ vựng ── */
function TheTu({ t, che }: { t: TuVung; che: 'khong' | 'nghia' | 'tu' }) {
  const [noi, setNoi] = useState(false);
  return (
    <div className={s.vCard} role="group" aria-label={t.w}>
      <button type="button" className={s.vImgBox} style={{ border: 0, cursor: 'pointer' }} onClick={() => doc(t.w)} aria-label={`Nghe: ${t.w}`}>
        <Anh anh={t.anh} alt={t.w} className={s.vImg} oChu={s.vChu} />
      </button>
      <button type="button" className={s.vW} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'inherit', textAlign: 'left' }} onClick={() => doc(t.w)}>
        <span className={che === 'tu' ? s.vHide : undefined}>{t.w}</span> <span className={s.vLoai}>{t.loai}</span>
      </button>
      <div className={`${s.vVi} ${che === 'nghia' ? s.vHide : ''}`}>{t.vi}</div>
      <button type="button" className={s.vEx} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => doc(t.ex)}>
        🔊 <span className={che === 'tu' ? s.vHide : undefined}>{t.ex}</span><br /><span className={che === 'nghia' ? s.vHide : undefined}>{t.exVi}</span>
      </button>
      <div className={s.cauTools}>
        <button type="button" className={s.chipBtn} onClick={() => doc(t.ex, true)}>🐢 Chậm</button>
        <button type="button" className={s.chipBtn} onClick={() => setNoi((x) => !x)}>🎙️ Nói theo</button>
      </div>
      {noi && <NoiTheo text={t.ex} />}
    </div>
  );
}

/** Trò chơi nhỏ: nhìn ảnh / nghe ⇒ chọn đúng từ. */
function DoanTu({ ds }: { ds: TuVung[] }) {
  const thu = useMemo(() => xao(ds, hatTu(ds.map((x) => x.w).join())).slice(0, Math.min(8, ds.length)), [ds]);
  const [i, setI] = useState(0);
  const [chon, setChon] = useState<string | null>(null);
  const [diem, setDiem] = useState(0);
  const t = thu[i];
  const opts = useMemo(() => (t ? xao([t, ...xao(ds.filter((x) => x.w !== t.w), hatTu(t.w)).slice(0, 3)], hatTu(`${t.w}o`)) : []), [t, ds]);
  useEffect(() => { if (t) doc(t.w); }, [t]);
  if (!t) return (
    <div className={s.done}>
      <div className={s.doneBig}>{diem}/{thu.length}</div>
      <div className={s.muted}>Đoán từ xong!</div>
      <button type="button" className={s.btnGhost} style={{ marginTop: 10 }} onClick={() => { setI(0); setDiem(0); setChon(null); }}>Chơi lại</button>
    </div>
  );
  return (
    <div>
      <div className={s.sessTop}><div className={s.sessBar}><i style={{ width: `${(i / thu.length) * 100}%` }} /></div><span className={s.muted}>{i + 1}/{thu.length}</span></div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button type="button" className={s.vImgBox} style={{ width: 120, height: 110, border: 0, cursor: 'pointer' }} onClick={() => doc(t.w)}>
          <Anh anh={t.anh} alt={t.vi} className={s.vImg} oChu={s.vChu} />
        </button>
        <div><div className={s.qLabel}>Nhìn ảnh, nghe — từ nào?</div><div style={{ fontSize: 18, fontWeight: 700 }}>{t.vi}</div></div>
      </div>
      <div className={s.opts} style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        {opts.map((o) => (
          <button key={o.w} type="button" disabled={!!chon} className={`${s.opt} ${chon ? (o.w === t.w ? s.optGood : o.w === chon ? s.optBad : '') : ''}`}
            onClick={() => { setChon(o.w); if (o.w === t.w) setDiem((d) => d + 1); doc(t.w); }}>{o.w}</button>
        ))}
      </div>
      {chon && <NutTiep nhan="Tiếp" onClick={() => { setChon(null); setI((x) => x + 1); }} />}
    </div>
  );
}

export function PhanTuVung({ ngay, onTiep }: { ngay: NgayCauNen; onTiep: () => void }) {
  const [che, setChe] = useState<'khong' | 'nghia' | 'tu'>('khong');
  const [choi, setChoi] = useState(false);
  const ds = ngay.tuVung ?? [];
  if (!ds.length) return <><div className={s.card}><div className={s.muted}>Ngày này dùng lại từ vựng các ngày trước.</div></div><NutTiep nhan="Sang Nghe & nhắc" onClick={onTiep} /></>;
  return (
    <>
      <div className={s.card}>
        <div className={s.cardTitle}>🖼️ Từ vựng của ngày · {ds.length} từ</div>
        <div className={s.cardSub}>Chạm ảnh hoặc chữ để nghe. Bật “Che nghĩa” để tự kiểm tra, rồi chơi “Đoán từ qua ảnh”.</div>
        <div className={s.modeRow}>
          {(['khong', 'nghia', 'tu'] as const).map((k) => (
            <button key={k} type="button" className={`${s.modeBtn} ${che === k ? s.modeBtnOn : ''}`} onClick={() => setChe(k)}>
              {k === 'khong' ? <><Eye size={14} /> Hiện hết</> : k === 'nghia' ? <><EyeOff size={14} /> Che nghĩa</> : <><EyeOff size={14} /> Che tiếng Anh</>}
            </button>
          ))}
          <button type="button" className={`${s.modeBtn} ${choi ? s.modeBtnOn : ''}`} onClick={() => setChoi((x) => !x)}>🎮 Đoán từ qua ảnh</button>
        </div>
        {choi ? <DoanTu ds={ds} /> : <div className={s.vocabGrid}>{ds.map((t) => <TheTu key={t.w} t={t} che={che} />)}</div>}
      </div>
      <NutTiep nhan="Sang Nghe & nhắc" onClick={onTiep} />
    </>
  );
}

/* ── 🎧 Nghe & nhắc lại (shadowing) ── */
export function PhanNghe({ ngay, onTiep }: { ngay: NgayCauNen; onTiep: () => void }) {
  const [che, setChe] = useState<'khong' | 'vi' | 'en'>('khong');
  const [dang, setDang] = useState(-1);
  const [chay, setChay] = useState(false);
  const [cham, setCham] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const phatHet = () => {
    if (chay) { stopAudio(); setChay(false); setDang(-1); return; }
    // Mỗi câu đọc HAI lần, nghỉ đủ dài để người học nhắc lại thành tiếng (shadowing).
    const clips = ngay.cau.flatMap((c) => [{ text: c.en, voice: GIONG, toc: cham ? 0.7 : 0.95, congKhai: true }, { text: c.en, voice: GIONG, toc: cham ? 0.7 : 0.95, congKhai: true }]);
    play(clips, () => { setChay(false); setDang(-1); }, {
      gapMs: 2600,
      onClip: (k) => {
        const i = Math.floor(k / 2);
        setDang(i);
        ref.current?.querySelector(`[data-i="${i}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      },
    });
    setChay(true);
  };
  return (
    <>
      <div className={s.card}>
        <div className={s.cardTitle}>🎧 Nghe & nhắc lại</div>
        <div className={s.cardSub}>
          Cách làm (shadowing): bấm <b>Phát cả bài</b> — mỗi câu đọc 2 lần, nghỉ ~3 giây để bạn <b>nói to theo</b> ngay, bắt chước cả nhịp và âm cuối.
          Câu nào khó thì bấm 🐢 nghe chậm và 🎙️ <b>Nói theo</b> để máy chấm từng từ.
        </div>
        <div className={s.modeRow}>
          <button type="button" className={`${s.modeBtn} ${chay ? s.modeBtnOn : ''}`} onClick={phatHet}>{chay ? <><Square size={14} /> Dừng</> : <><Play size={14} /> Phát cả bài</>}</button>
          <button type="button" className={`${s.modeBtn} ${cham ? s.modeBtnOn : ''}`} onClick={() => setCham((x) => !x)}>🐢 Chậm</button>
          {(['khong', 'vi', 'en'] as const).map((k) => (
            <button key={k} type="button" className={`${s.modeBtn} ${che === k ? s.modeBtnOn : ''}`} onClick={() => setChe(k)}>
              {k === 'khong' ? 'Hiện hết' : k === 'vi' ? 'Che tiếng Việt' : 'Che tiếng Anh'}
            </button>
          ))}
        </div>
        <div ref={ref}>
          {ngay.cau.map((c, i) => (
            <div key={c.id} data-i={i} style={dang === i ? { outline: '2px solid var(--c1)', borderRadius: 14 } : undefined}>
              <CauNghe en={c.en} vi={che === 'vi' ? undefined : c.vi} an={che === 'en'} phu={<span className={s.qKhung}>{c.khung}</span>} />
            </div>
          ))}
        </div>
      </div>
      <NutTiep nhan="Đã nhắc xong — sang Việt → Anh" onClick={() => { stopAudio(); onTiep(); }} />
    </>
  );
}

/* ── 💬 Hội thoại & ⚡ trò chơi ghép câu ── */
const KEY_KY_LUC = 'en-cau-nen:ky-luc-ghep';
function GameGhep({ ngay, onTraLoi }: { ngay: NgayCauNen; onTraLoi: (id: string, d: boolean) => void }) {
  const [lan, setLan] = useState(0);
  const ds = useMemo(() => xao(ngay.cau, hatTu(`${ngay.n}-game-${lan}`)).slice(0, 8).map((cau) => ({ cau, kieu: 've' as const })), [ngay, lan]);
  const bd = useRef(Date.now());
  const [giay, setGiay] = useState(0);
  const [kq, setKq] = useState<{ t: number; d: number; kyLuc: boolean } | null>(null);
  const [kyLuc, setKyLuc] = useState<number | null>(null);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY_KY_LUC) || '{}')[ngay.n]; if (v) setKyLuc(v); } catch { /* bỏ qua */ } }, [ngay.n]);
  useEffect(() => { bd.current = Date.now(); setKq(null); const t = setInterval(() => setGiay(Math.round((Date.now() - bd.current) / 1000)), 500); return () => clearInterval(t); }, [lan]);
  if (kq) return (
    <div className={s.done}>
      <div className={s.doneBig}>{kq.t}s</div>
      <div style={{ fontWeight: 700 }}>{kq.d}/8 câu đúng {kq.kyLuc ? '· 🏆 Kỷ lục mới!' : kyLuc ? `· kỷ lục ${kyLuc}s` : ''}</div>
      <button type="button" className={s.btn} style={{ marginTop: 12 }} onClick={() => setLan((x) => x + 1)}><Timer size={15} /> Chơi lượt mới</button>
    </div>
  );
  return (
    <>
      <div className={s.combo} style={{ marginBottom: 8 }}>⏱ {giay}s {kyLuc ? <span className={s.muted}>· kỷ lục {kyLuc}s</span> : null}</div>
      <PhienLuyen key={lan} ds={ds} kho={ngay.cau} tieuDe="Ghép câu tốc độ" epCheDo="ghep" onTraLoi={onTraLoi}
        onXong={(d) => {
          const t = Math.round((Date.now() - bd.current) / 1000);
          const moi = d === 8 && (!kyLuc || t < kyLuc);
          if (moi) { setKyLuc(t); try { const o = JSON.parse(localStorage.getItem(KEY_KY_LUC) || '{}'); o[ngay.n] = t; localStorage.setItem(KEY_KY_LUC, JSON.stringify(o)); } catch { /* bỏ qua */ } }
          setKq({ t, d, kyLuc: moi });
        }} nhan="Xem thời gian" />
    </>
  );
}

export function PhanHoiThoai({ ngay, onTraLoi, onTiep }: { ngay: NgayCauNen; onTraLoi: (id: string, d: boolean) => void; onTiep: () => void }) {
  const [che, setChe] = useState(false);
  const [game, setGame] = useState(false);
  const ht = ngay.hoiThoai;
  const phat = () => ht && play(ht.luot.map((l) => ({ text: l.en, voice: l.vai === 'A' ? 'us-nu' : 'us-nam', congKhai: true })), undefined, { gapMs: 500 });
  return (
    <>
      {ht && (
        <div className={s.card}>
          <div className={s.cardTitle}>💬 {ht.tieuDe}</div>
          <div className={s.cardSub}>Nghe cả đoạn, rồi bật “Che tiếng Anh” và <b>tự nói</b> từng lượt từ nghĩa tiếng Việt trước khi chạm để nghe đáp án.</div>
          <div className={s.modeRow}>
            <button type="button" className={s.modeBtn} onClick={phat}><Play size={14} /> Nghe cả đoạn</button>
            <button type="button" className={`${s.modeBtn} ${che ? s.modeBtnOn : ''}`} onClick={() => setChe((x) => !x)}>{che ? <EyeOff size={14} /> : <Eye size={14} />} Che tiếng Anh</button>
          </div>
          <div className={s.chat}>
            {ht.luot.map((l, i) => (
              <div key={i} className={`${s.bub} ${l.vai === 'A' ? s.bubA : s.bubB}`}>
                <div className={s.bubWho}>{l.ten}</div>
                <CauNghe en={l.en} vi={l.vi} an={che} voice={l.vai === 'A' ? 'us-nu' : 'us-nam'} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={s.card}>
        <div className={s.cardTitle}>⚡ Ghép câu tốc độ</div>
        <div className={s.cardSub}>8 câu của hôm nay, ghép mảnh theo đúng trật tự tiếng Anh — nhanh nhất có thể. Đúng cả 8 mới được ghi kỷ lục.</div>
        {game ? <GameGhep ngay={ngay} onTraLoi={onTraLoi} /> : <button type="button" className={s.btn} onClick={() => setGame(true)}><Timer size={16} /> Bắt đầu</button>}
      </div>
      <NutTiep nhan="Sang Viết tay" onClick={onTiep} />
    </>
  );
}

/* ── ✍️ Viết tay ── */
function ChepCau({ cau, cheDo, onTraLoi }: { cau: Cau[]; cheDo: 'chep' | 'viet'; onTraLoi: (id: string, d: boolean) => void }) {
  const [mo, setMo] = useState<Record<string, boolean>>({});
  const [cham, setCham] = useState<Record<string, boolean>>({});
  return (
    <div>
      {cau.map((c, i) => (
        <div key={c.id} className={s.copyItem}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className={s.copyNum}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              {cheDo === 'chep' ? (
                <><CauNghe en={c.en} vi={c.vi} /></>
              ) : (
                <>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{c.vi}</div>
                  <div className={s.muted}>{c.khung}</div>
                  {!mo[c.id] ? (
                    <button type="button" className={s.chipBtn} style={{ marginTop: 6 }} onClick={() => setMo({ ...mo, [c.id]: true })}><Eye size={14} /> Viết xong — xem đáp án</button>
                  ) : (
                    <>
                      <CauNghe en={c.en} phu={c.alt?.length ? `Cũng đúng: ${c.alt.join(' · ')}` : undefined} />
                      {c.loi && <div className={s.loi}>⚠️ <Chu text={c.loi} /></div>}
                      {cham[c.id] === undefined ? (
                        <div className={s.cauTools}>
                          <span className={s.muted}>Bạn viết đúng không?</span>
                          <button type="button" className={s.chipBtn} onClick={() => { setCham({ ...cham, [c.id]: true }); onTraLoi(c.id, true); }}><Check size={14} /> Đúng</button>
                          <button type="button" className={s.chipBtn} onClick={() => { setCham({ ...cham, [c.id]: false }); onTraLoi(c.id, false); }}><X size={14} /> Sai / thiếu</button>
                        </div>
                      ) : <div className={s.muted}>{cham[c.id] ? '✓ Đã ghi: đúng' : '✗ Đã ghi: câu này sẽ quay lại phần ôn'}</div>}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PhanVietTay({ ngay, onTraLoi, onIn, onTiep }: { ngay: NgayCauNen; onTraLoi: (id: string, d: boolean) => void; onIn: () => void; onTiep: () => void }) {
  const [cheDo, setCheDo] = useState<'chep' | 'viet'>('viet');
  const [moMau, setMoMau] = useState(false);
  const v = ngay.viet;
  return (
    <>
      <div className={s.card}>
        <div className={s.cardTitle}>✍️ Viết tay — mở vở hoặc iPad</div>
        <div className={s.cardSub}>Viết tay giúp nhớ chính tả và trật tự từ lâu hơn gõ. Đặt bản in/xem gọn cạnh iPad nếu muốn.</div>
        <button type="button" className={s.btnGhost} onClick={onIn}><Printer size={16} /> Bản in / xem gọn của ngày {ngay.n}</button>
        {v && (
          <>
            <div style={{ fontWeight: 800, margin: '16px 0 6px' }}>📏 Cách đặt câu khi viết</div>
            <ul className={s.list}>{v.y.map((x, i) => <li key={i}><Chu text={x} /></li>)}</ul>
            <div style={{ fontWeight: 800, margin: '14px 0 6px' }}>🔤 Lỗi chính tả hay gặp</div>
            <ul className={s.list}>{v.chinhTa.map((x, i) => <li key={i}><Chu text={x} /></li>)}</ul>
          </>
        )}
      </div>
      <div className={s.card}>
        <div className={s.cardTitle}>📝 Chép câu / viết lại</div>
        <div className={s.modeRow}>
          <button type="button" className={`${s.modeBtn} ${cheDo === 'viet' ? s.modeBtnOn : ''}`} onClick={() => setCheDo('viet')}>Viết lại (nhìn tiếng Việt)</button>
          <button type="button" className={`${s.modeBtn} ${cheDo === 'chep' ? s.modeBtnOn : ''}`} onClick={() => setCheDo('chep')}>Chép (nhìn câu Anh)</button>
        </div>
        <div className={s.cardSub}>{cheDo === 'viet' ? 'Nhìn câu tiếng Việt, tự viết câu tiếng Anh vào vở, rồi bấm xem đáp án và tự chấm — câu sai sẽ quay lại phần Ôn.' : 'Nghe và chép lại từng câu tiếng Anh thật cẩn thận: viết hoa đầu câu, dấu chấm cuối câu, dấu nháy của I\'m / don\'t.'}</div>
        <ChepCau cau={ngay.cau} cheDo={cheDo} onTraLoi={onTraLoi} />
      </div>
      {v && (
        <div className={s.card}>
          <div className={s.cardTitle}>📄 Viết một đoạn 3–5 câu</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}><Chu text={v.de} /></div>
          <div className={s.lines}>{[0, 1, 2, 3, 4].map((k) => <div key={k} className={s.line} />)}</div>
          {!moMau ? (
            <button type="button" className={s.chipBtn} style={{ marginTop: 10 }} onClick={() => setMoMau(true)}><Eye size={14} /> Viết xong — xem đoạn mẫu</button>
          ) : (
            <div style={{ marginTop: 10 }}>
              <div className={s.qLabel}>Đoạn mẫu</div>
              {v.mau.map((x, i) => <CauNghe key={i} en={x.en} vi={x.vi} />)}
            </div>
          )}
        </div>
      )}
      <NutTiep nhan="Sang Ôn lặp" onClick={onTiep} />
    </>
  );
}

/* ── 📄 Bản in / xem gọn ── */
export function BanIn({ ngay, onVe }: { ngay: NgayCauNen; onVe: () => void }) {
  const b = ngay.bai;
  return (
    <div className={s.printPage}>
      <div className={`${s.noPrint} ${s.qActions}`} style={{ marginTop: 0, marginBottom: 12 }}>
        <button type="button" className={s.btnGhost} onClick={onVe}>← Quay lại ngày {ngay.n}</button>
        <button type="button" className={s.btn} onClick={() => window.print()}><Printer size={16} /> In / lưu PDF</button>
      </div>
      <h1>Ngày {ngay.n} · {ngay.ten}</h1>
      <div>{ngay.mucTieu}</div>
      <h2>1. Khung câu</h2>
      <ul>{b.y.map((x, i) => <li key={i}><Chu text={x} /></li>)}</ul>
      {b.khung.map((k, i) => <div key={i}><b>{k.mau}</b> — {k.vi}</div>)}
      <h2>2. Việt nghĩ ≠ Anh nói</h2>
      {b.soSanh.map((x, i) => <div key={i} className={s.printRow}><span>{i + 1}.</span><span>{x.vi} → <s>{x.tungChu}</s> → <b>{x.en}</b> · <Chu text={x.viSao} /></span></div>)}
      {ngay.nguPhap?.length ? <><h2>3. Ngữ pháp</h2><Blocks blocks={ngay.nguPhap} /></> : null}
      {ngay.tuVung?.length ? (
        <>
          <h2>4. Từ vựng</h2>
          <div className={s.printVocab}>
            {ngay.tuVung.map((t) => (
              <div key={t.w} className={s.printV}>
                <Anh anh={t.anh} alt={t.w} />
                <div><b>{t.w}</b> ({t.loai}) — {t.vi}<br /><i>{t.ex}</i></div>
              </div>
            ))}
          </div>
        </>
      ) : null}
      <h2>5. Viết lại sang tiếng Anh ({ngay.cau.length} câu)</h2>
      {ngay.cau.map((c, i) => (
        <div key={c.id} className={s.printRow}>
          <span>{i + 1}.</span>
          <div>{c.vi} <span style={{ color: '#777', fontSize: 12 }}>[{c.khung}]</span><div className={s.printLine} /></div>
        </div>
      ))}
      {ngay.viet && (
        <>
          <h2>6. Viết đoạn</h2>
          <div><Chu text={ngay.viet.de} /></div>
          {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} className={s.printLine} />)}
        </>
      )}
      <h2>Đáp án</h2>
      <ol style={{ columns: 2, fontSize: 13 }}>{ngay.cau.map((c) => <li key={c.id}>{c.en}</li>)}</ol>
      {ngay.viet && <><b>Đoạn mẫu:</b> {ngay.viet.mau.map((x) => x.en).join(' ')}</>}
    </div>
  );
}
