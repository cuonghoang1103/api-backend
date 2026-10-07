'use client';

/**
 * 🖥️ PHÒNG THI MÁY TÍNH (computer-delivered) — /language/en/ielts/thi-may · app: /ielts/thi-may
 * ─────────────────────────────────────────────────────────────────────────
 * Danh sách đề → trang đề (Practice | Do Full Test | Result + Start) → màn làm bài
 * (PhongLam / PhongViet) → kết quả: điểm thô, band ƯỚC TÍNH, từng dạng câu, xem lại có
 * giải thích + tô bằng chứng; câu sai TỰ VÀO Sổ lỗi; Writing nhờ AI chấm 4 tiêu chí.
 *
 * Đề là tệp tĩnh (`de/*.ts`) — thêm đề không đụng mã giao diện. Lượt làm lưu máy chủ
 * (`/ielts/thi-may/luot`) ⇒ tab Result thấy cả lượt làm trên app desktop.
 * Bài đang làm dở nằm trong sessionStorage — tải lại trang không mất.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MUC_LUC, taiDe, TEN_KY_NANG } from './de/index';
import type { De, DeDoc, DeNghe, DeViet, KyNang, MucDe, PhanDoc, PhanNghe } from './de/types';
import { TEN_DANG } from './de/types';
import { bandTuDiem, dinhDangGio, type KetQuaCau } from './cham';
import { PhongLam, chamLuot, type TrangThaiLam } from './PhongLam';
import { PhongViet, demTuViet, type TrangThaiViet } from './PhongViet';
import { dongSoLoi } from './soLoiTuDe';
import { ChuDam } from './Nhom';
import { MenuTren, useHienThi } from '../chung/MenuTren';
import {
  thiDsLuot, thiLuuLuot, thiMotLuot, thiChamViet, thiCapNhatLuot, loiGhi, loiMang,
  type LuotThi, type KetQuaViet, type GhiLoi,
} from '../chung/api';
import { docTruyVan, ghiTruyVan } from '@/components/sach-hoc/moiTruong';
import { useLangUser } from '@/components/language/primitives';
import s from '../chung/cdt.module.css';

type Tab = 'practice' | 'full' | 'result';
type Dang =
  | { o: 'ds' }
  | { o: 'de'; id: string; tab: Tab }
  | { o: 'lam'; de: De; cheDo: 'practice' | 'full'; phanChon: number[] }
  | { o: 'kq'; de: De; luot: KetLuot };
type KetLuot = {
  id?: number; cheDo: 'practice' | 'full'; phanChon: number[]; giay: number;
  ans?: Record<number, string>; co?: number[]; kq?: KetQuaCau[];
  bai?: Record<number, string>; ai?: Record<number, KetQuaViet>;
  soLoi?: { moi: number; congDon: number } | 'loi' | 'khach';
};

const KHOA_LAM = 'ielts-thi-may:dang-lam';
type Luu = { deId: string; cheDo: 'practice' | 'full'; phanChon: number[]; lam?: TrangThaiLam; viet?: TrangThaiViet };
const docLuu = (): Luu | null => { try { const r = sessionStorage.getItem(KHOA_LAM); return r ? (JSON.parse(r) as Luu) : null; } catch { return null; } };
const ghiLuu = (l: Luu | null) => { try { if (l) sessionStorage.setItem(KHOA_LAM, JSON.stringify(l)); else sessionStorage.removeItem(KHOA_LAM); } catch { /* bỏ qua */ } };

const phanCua = (de: De): { so: number; nhan: string; mo: string }[] => {
  if (de.kyNang === 'viet') return de.task.map((t) => ({ so: t.so, nhan: `Task ${t.so}`, mo: `${t.phut} phút · ít nhất ${t.minTu} từ` }));
  return (de.phan as (PhanDoc | PhanNghe)[]).map((p) => {
    const ns = p.nhom.reduce((n, g) => n + g.den - g.tu + 1, 0);
    const dang = [...new Set(p.nhom.map((g) => TEN_DANG[g.dang]))].join(', ');
    return { so: p.so, nhan: `${de.kyNang === 'doc' ? 'Passage' : 'Part'} ${p.so} — ${p.tieuDe}`, mo: `${ns} câu · ${dang}` };
  });
};

export default function ThiMay() {
  const { isAuthenticated } = useLangUser();
  const { thuocTinh } = useHienThi();
  const [dang, setDang] = useState<Dang>({ o: 'ds' });
  const [loc, setLoc] = useState<KyNang | 'tat'>('tat');
  const [tim, setTim] = useState('');
  const [deTai, setDeTai] = useState<De | null>(null);
  const [lam, setLam] = useState<TrangThaiLam | null>(null);
  const [viet, setViet] = useState<TrangThaiViet | null>(null);
  const [loi, setLoi] = useState('');

  /* ── Khôi phục: bài đang làm dở / ?de= ── */
  useEffect(() => {
    const l = docLuu();
    if (l) {
      const p = taiDe(l.deId);
      if (p) {
        void p.then((de) => {
          if (l.lam) setLam(l.lam);
          if (l.viet) setViet(l.viet);
          setDang({ o: 'lam', de, cheDo: l.cheDo, phanChon: l.phanChon });
        });
        return;
      }
    }
    const q = docTruyVan();
    const id = q.get('de');
    if (id && MUC_LUC.some((m) => m.id === id)) setDang({ o: 'de', id, tab: (q.get('tab') as Tab) || 'full' });
  }, []);

  // Đồng bộ ?de=&tab= (web: URL thật; app desktop: kho truy vấn của shim).
  useEffect(() => {
    if (dang.o === 'lam' || dang.o === 'kq') return;
    ghiTruyVan((q) => {
      if (dang.o === 'de') { q.set('de', dang.id); q.set('tab', dang.tab); } else { q.delete('de'); q.delete('tab'); }
    });
  }, [dang]);

  // Tải đề khi mở trang đề.
  const deIdDang = dang.o === 'de' ? dang.id : null;
  useEffect(() => {
    if (!deIdDang) return;
    setDeTai(null);
    void taiDe(deIdDang)?.then(setDeTai);
  }, [deIdDang]);

  // Ghi sessionStorage mỗi lần bài thay đổi.
  useEffect(() => {
    if (dang.o !== 'lam') return;
    ghiLuu({ deId: dang.de.id, cheDo: dang.cheDo, phanChon: dang.phanChon, lam: lam ?? undefined, viet: viet ?? undefined });
  }, [dang, lam, viet]);

  // Đang làm bài mà đóng tab → trình duyệt hỏi lại.
  useEffect(() => {
    if (dang.o !== 'lam') return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dang.o]);

  const batDau = (de: De, cheDo: 'practice' | 'full', phanChon: number[], phut: number | null) => {
    const now = Date.now();
    if (de.kyNang === 'viet') {
      setViet({ bai: {}, batDau: now, hetLuc: phut ? now + phut * 60_000 : null });
      setLam(null);
    } else {
      // Listening thi thật: đồng hồ 2′ kiểm tra chỉ bắt đầu khi băng hết (PhongLam đặt).
      setLam({ ans: {}, co: [], hl: {}, batDau: now, hetLuc: de.kyNang === 'nghe' ? null : phut ? now + phut * 60_000 : null });
      setViet(null);
    }
    setDang({ o: 'lam', de, cheDo, phanChon });
  };

  /* ── Nộp ── */
  const nop = useCallback(async () => {
    if (dang.o !== 'lam') return;
    const { de, cheDo, phanChon } = dang;
    ghiLuu(null);
    if (de.kyNang === 'viet') {
      const v = viet ?? { bai: {}, batDau: Date.now(), hetLuc: null };
      const giay = Math.round((Date.now() - v.batDau) / 1000);
      const luot: KetLuot = { cheDo, phanChon, giay, bai: v.bai, ai: {} };
      setDang({ o: 'kq', de, luot });
      if (isAuthenticated) {
        try {
          const r = await thiLuuLuot({ deId: de.id, kyNang: 'viet', cheDo, giay, chiTiet: { bai: v.bai, phanChon } });
          setDang((d) => (d.o === 'kq' ? { ...d, luot: { ...d.luot, id: r.id } } : d));
        } catch { /* vẫn xem được kết quả tại chỗ */ }
      }
      return;
    }
    const t = lam ?? { ans: {}, co: [], hl: {}, batDau: Date.now(), hetLuc: null };
    const { kq, theoSo } = chamLuot(de as DeDoc | DeNghe, phanChon, t.ans);
    const giay = Math.round((Date.now() - t.batDau) / 1000);
    const dung = kq.filter((k) => k.dung).length;
    const luot: KetLuot = { cheDo, phanChon, giay, ans: t.ans, co: t.co, kq };
    setDang({ o: 'kq', de, luot });
    window.scrollTo({ top: 0 });
    if (!isAuthenticated) { setDang((d) => (d.o === 'kq' ? { ...d, luot: { ...d.luot, soLoi: 'khach' } } : d)); return; }
    const band = cheDo === 'full' && kq.length === 40 ? bandTuDiem(dung, de.kyNang === 'doc' ? 'doc' : 'nghe') : null;
    const [r, sl] = await Promise.allSettled([
      thiLuuLuot({ deId: de.id, kyNang: de.kyNang, cheDo, dung, tong: kq.length, band, giay, chiTiet: { ans: t.ans, co: t.co, phanChon } }),
      (async () => {
        const muc: GhiLoi[] = dongSoLoi(de as DeDoc | DeNghe, kq, theoSo);
        return muc.length ? loiGhi(muc) : { moi: 0, congDon: 0 };
      })(),
    ]);
    setDang((d) => (d.o === 'kq' ? {
      ...d,
      luot: { ...d.luot, id: r.status === 'fulfilled' ? r.value.id : undefined, soLoi: sl.status === 'fulfilled' ? sl.value : 'loi' },
    } : d));
  }, [dang, lam, viet, isAuthenticated]);

  const thoatLam = () => {
    // Thoát giữa chừng: bài vẫn trong sessionStorage; mở lại trang là làm tiếp.
    if (dang.o === 'lam') setDang({ o: 'de', id: dang.de.id, tab: dang.cheDo });
  };

  const moLuotCu = async (id: number) => {
    setLoi('');
    try {
      const l = await thiMotLuot(id);
      const de = await taiDe(l.deId);
      if (!de) return;
      const ct = (l.chiTiet ?? {}) as { ans?: Record<number, string>; co?: number[]; phanChon?: number[]; bai?: Record<number, string>; ai?: Record<number, KetQuaViet> };
      const phanChon = ct.phanChon ?? phanCua(de).map((p) => p.so);
      if (de.kyNang === 'viet') {
        setDang({ o: 'kq', de, luot: { id: l.id, cheDo: l.cheDo, phanChon, giay: l.giay, bai: ct.bai ?? {}, ai: ct.ai ?? {} } });
      } else {
        const { kq } = chamLuot(de, phanChon, ct.ans ?? {});
        setDang({ o: 'kq', de, luot: { id: l.id, cheDo: l.cheDo, phanChon, giay: l.giay, ans: ct.ans ?? {}, co: ct.co ?? [], kq } });
      }
    } catch (e) { setLoi(loiMang(e).message ?? 'Không mở được lượt này.'); }
  };

  /* ═════════ Màn làm bài ═════════ */
  if (dang.o === 'lam') {
    if (dang.de.kyNang === 'viet') {
      return viet && <PhongViet de={dang.de} cheDo={dang.cheDo} taskChon={dang.phanChon} tt={viet} setTt={(f) => setViet((c) => (c ? f(c) : c))} onNop={nop} onThoat={thoatLam} />;
    }
    return lam && <PhongLam de={dang.de} cheDo={dang.cheDo} phanChon={dang.phanChon} tt={lam} setTt={(f) => setLam((c) => (c ? f(c) : c))} onNop={nop} onThoat={thoatLam} />;
  }

  return (
    <div className={s.goc} {...thuocTinh}>
      <MenuTren dang="thi-may" />
      {dang.o === 'ds' && <DanhSach loc={loc} setLoc={setLoc} tim={tim} setTim={setTim} mo={(id) => setDang({ o: 'de', id, tab: 'full' })} />}
      {dang.o === 'de' && (
        <TrangDe
          muc={MUC_LUC.find((m) => m.id === dang.id)!} de={deTai} tab={dang.tab} setTab={(tab) => setDang({ ...dang, tab })}
          tim={tim} setTim={setTim} veDs={() => setDang({ o: 'ds' })} batDau={batDau} moLuot={moLuotCu} dangNhap={isAuthenticated} loi={loi}
        />
      )}
      {dang.o === 'kq' && (
        <KetQua de={dang.de} luot={dang.luot} setLuot={(f) => setDang((d) => (d.o === 'kq' ? { ...d, luot: f(d.luot) } : d))}
          veDe={() => setDang({ o: 'de', id: dang.de.id, tab: 'result' })} lamLai={() => setDang({ o: 'de', id: dang.de.id, tab: dang.luot.cheDo })} />
      )}
    </div>
  );
}

/* ═════════ Danh sách đề ═════════ */
function DanhSach({ loc, setLoc, tim, setTim, mo }: { loc: KyNang | 'tat'; setLoc: (k: KyNang | 'tat') => void; tim: string; setTim: (v: string) => void; mo: (id: string) => void }) {
  const ds = MUC_LUC.filter((m) => (loc === 'tat' || m.kyNang === loc) && `${m.ten} ${m.moTa} ${m.boDe}`.toLowerCase().includes(tim.trim().toLowerCase()));
  return (
    <div className={s.khung}>
      <div className={s.dauTrang}>
        <h1 className={s.duongDan} style={{ margin: 0 }}>IELTS Test / Online Test</h1>
        <label className={s.tim}><span aria-hidden>🔍</span><input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Search" aria-label="Tìm đề" /></label>
      </div>
      <p className={s.mo} style={{ margin: '0 0 14px', maxWidth: 760 }}>
        Phòng thi theo giao diện thi trên máy tính: đồng hồ đếm ngược, hai cột bài đọc | câu hỏi kéo được, tô sáng + ghi chú, cờ xem lại, thanh số câu.
        Đề do CuongThai tự soạn theo đúng dạng câu hỏi thật (không phải đề Cambridge/IDP/BC). Band là <b>ước tính</b>.
      </p>
      <div className={s.locKy} role="tablist">
        {(['tat', 'doc', 'nghe', 'viet'] as const).map((k) => (
          <button key={k} type="button" className={`${s.tab} ${loc === k ? s.tabOn : ''}`} onClick={() => setLoc(k)}>{k === 'tat' ? 'Tất cả' : TEN_KY_NANG[k]}</button>
        ))}
      </div>
      <div className={s.luoiDe}>
        {ds.map((m) => (
          <button key={m.id} type="button" className={s.theDe} onClick={() => mo(m.id)}>
            <span className={s.nhanKy}>{TEN_KY_NANG[m.kyNang]} · {m.phut} phút · {m.kyNang === 'viet' ? '2 task' : `${m.soCau} câu`}</span>
            <b style={{ fontSize: 16 }}>{m.ten}</b>
            <span className={s.mo}>{m.boDe} · {m.capDo}</span>
            <span style={{ fontSize: 13.5, color: 'var(--c-ink-2)' }}>{m.moTa}</span>
          </button>
        ))}
        {ds.length === 0 && <p className={s.mo}>Không có đề nào khớp.</p>}
      </div>
      <p className={s.mo} style={{ marginTop: 22 }}>
        Muốn luyện theo chặng / đề dựng tự động? Xem <Link href="/language/en/ielts/phong-thi" style={{ textDecoration: 'underline' }}>Phòng thi thử 3 phần</Link> và{' '}
        <Link href="/language/en/ielts/luyen-them" style={{ textDecoration: 'underline' }}>Kho luyện thêm</Link>.
      </p>
    </div>
  );
}

/* ═════════ Trang một đề: Practice | Do Full Test | Result ═════════ */
function TrangDe({ muc, de, tab, setTab, tim, setTim, veDs, batDau, moLuot, dangNhap, loi }: {
  muc: MucDe; de: De | null; tab: Tab; setTab: (t: Tab) => void; tim: string; setTim: (v: string) => void; veDs: () => void;
  batDau: (de: De, cheDo: 'practice' | 'full', phanChon: number[], phut: number | null) => void;
  moLuot: (id: number) => void; dangNhap: boolean; loi: string;
}) {
  const [chon, setChon] = useState<number[]>([]);
  const [gioiHan, setGioiHan] = useState<number | 0>(0);
  const [luot, setLuot] = useState<LuotThi[] | null>(null);
  const [loiDs, setLoiDs] = useState('');
  const phan = useMemo(() => (de ? phanCua(de) : []), [de]);
  useEffect(() => { setChon(phan.slice(0, 1).map((p) => p.so)); }, [phan]);
  useEffect(() => {
    if (tab !== 'result') return;
    if (!dangNhap) { setLuot([]); return; }
    setLoiDs('');
    thiDsLuot(muc.id).then((r) => setLuot(r.items)).catch((e) => { setLuot([]); setLoiDs(loiMang(e).message ?? 'Không tải được kết quả.'); });
  }, [tab, muc.id, dangNhap]);

  const phutMacDinh = muc.kyNang === 'doc' ? 20 : muc.kyNang === 'viet' ? (chon.includes(2) ? 40 : 20) : 0;

  return (
    <div className={s.khung}>
      <div className={s.dauTrang}>
        <h1 className={s.duongDan} style={{ margin: 0 }}>
          <button type="button" onClick={veDs}>IELTS Test</button> / {TEN_KY_NANG[muc.kyNang]} / <span style={{ color: 'var(--c-ink)' }}>{muc.boDe}</span>
        </h1>
        <label className={s.tim}><span aria-hidden>🔍</span><input value={tim} onChange={(e) => setTim(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') veDs(); }} placeholder="Search" aria-label="Tìm đề" /></label>
      </div>
      <div className={s.tenDe}>{muc.ten.replace(/^.*—\s*/, `${muc.boDe} - `)}</div>
      <div className={s.tabs} role="tablist">
        {([['practice', 'Practice'], ['full', 'Do Full Test'], ['result', 'Result']] as const).map(([k, t]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={`${s.tab} ${tab === k ? s.tabOn : ''}`} onClick={() => setTab(k)}>{t}</button>
        ))}
      </div>

      {!de && tab !== 'result' && <p className={s.mo}>Đang tải đề…</p>}

      {de && tab === 'full' && (
        <>
          <p className={s.nghieng}>To achieve the best results, you need to spend {muc.phut} minutes on this test.</p>
          {muc.kyNang === 'nghe' && <p className={s.mo} style={{ margin: '0 0 14px' }}>🎧 Băng phát <b>một lần</b>, liền 4 part, có thời gian đọc câu hỏi trước mỗi part; hết băng có 2 phút kiểm tra.</p>}
          <button type="button" className={s.batDau} onClick={() => batDau(de, 'full', phan.map((p) => p.so), muc.phut)}>Start</button>
          {!dangNhap && <p className={s.mo} style={{ marginTop: 10 }}>Chưa đăng nhập: vẫn làm được, nhưng kết quả và Sổ lỗi không được lưu{muc.kyNang === 'nghe' ? ', giọng đọc dùng giọng của trình duyệt' : ''}.</p>}
        </>
      )}

      {de && tab === 'practice' && (
        <>
          <p className={s.nghieng}>Luyện từng phần / từng dạng: chọn phần muốn làm và giới hạn thời gian (tuỳ chọn).{muc.kyNang === 'nghe' ? ' Ở chế độ này được nghe lại, tua từng câu thoại và chỉnh tốc độ.' : ''}</p>
          <div className={s.chonPhan}>
            {phan.map((p) => (
              <label key={p.so}>
                <input type="checkbox" checked={chon.includes(p.so)} onChange={(e) => setChon((c) => (e.target.checked ? [...c, p.so].sort() : c.filter((x) => x !== p.so)))} />
                <span><b>{p.nhan}</b><br /><span className={s.mo}>{p.mo}</span></span>
              </label>
            ))}
          </div>
          {muc.kyNang !== 'nghe' && (
            <label className={s.mo} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              Thời gian:
              <select value={gioiHan} onChange={(e) => setGioiHan(Number(e.target.value))} style={{ height: 30 }}>
                <option value={0}>Không giới hạn (đếm giờ đã làm)</option>
                <option value={-1}>Theo đề ({phutMacDinh * Math.max(1, muc.kyNang === 'doc' ? chon.length : 1)} phút)</option>
                {[10, 15, 30, 45].map((m) => <option key={m} value={m}>{m} phút</option>)}
              </select>
            </label>
          )}
          <button type="button" className={s.batDau} disabled={chon.length === 0}
            onClick={() => batDau(de, 'practice', chon, gioiHan === 0 ? null : gioiHan === -1 ? phutMacDinh * Math.max(1, muc.kyNang === 'doc' ? chon.length : 1) : gioiHan)}>Start</button>
        </>
      )}

      {tab === 'result' && (
        <>
          {!dangNhap && <p className={s.mo}>Đăng nhập để lưu và xem lại kết quả các lượt làm.</p>}
          {luot == null && dangNhap && <p className={s.mo}>Đang tải…</p>}
          {luot && luot.length === 0 && dangNhap && !loiDs && <p className={s.mo}>Chưa có lượt làm nào cho đề này.</p>}
          {luot && luot.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className={s.bangKq}>
                <thead><tr><th>Ngày</th><th>Chế độ</th><th>Điểm</th><th>Band (ước tính)</th><th>Thời gian</th><th /></tr></thead>
                <tbody>
                  {luot.map((l) => (
                    <tr key={l.id}>
                      <td>{new Date(l.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td>{l.cheDo === 'full' ? 'Full Test' : 'Practice'}</td>
                      <td>{l.tong != null ? `${l.dung}/${l.tong}` : '—'}</td>
                      <td><b>{l.band != null ? l.band : '—'}</b></td>
                      <td>{dinhDangGio(l.giay)}</td>
                      <td><button type="button" className={s.nutPhu} onClick={() => moLuot(l.id)}>Xem lại</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {(loiDs || loi) && <p className={s.loi}>{loiDs || loi}</p>}
        </>
      )}
    </div>
  );
}

/* ═════════ Kết quả ═════════ */
function KetQua({ de, luot, setLuot, veDe, lamLai }: { de: De; luot: KetLuot; setLuot: (f: (l: KetLuot) => KetLuot) => void; veDe: () => void; lamLai: () => void }) {
  const [xemLai, setXemLai] = useState(false);
  if (de.kyNang === 'viet') return <KetQuaViet de={de} luot={luot} setLuot={setLuot} veDe={veDe} lamLai={lamLai} />;
  const kq = luot.kq ?? [];
  const dung = kq.filter((k) => k.dung).length;
  const du40 = luot.cheDo === 'full' && kq.length === 40;
  const band = du40 ? bandTuDiem(dung, de.kyNang === 'doc' ? 'doc' : 'nghe') : null;
  const theoDang = new Map<string, { d: number; t: number }>();
  for (const k of kq) { const x = theoDang.get(TEN_DANG[k.dang]) ?? { d: 0, t: 0 }; x.t++; if (k.dung) x.d++; theoDang.set(TEN_DANG[k.dang], x); }

  if (xemLai) {
    const tt: TrangThaiLam = { ans: luot.ans ?? {}, co: luot.co ?? [], hl: {}, batDau: Date.now() - luot.giay * 1000, hetLuc: null };
    return <PhongLam de={de} cheDo={luot.cheDo} phanChon={luot.phanChon} tt={tt} setTt={() => {}} kq={kq} onThoat={() => setXemLai(false)} />;
  }
  return (
    <div className={s.khung}>
      <div className={s.dauTrang}>
        <h1 className={s.duongDan} style={{ margin: 0 }}><button type="button" onClick={veDe}>IELTS Test</button> / {TEN_KY_NANG[de.kyNang]} / Result</h1>
      </div>
      <div className={s.tenDe}>{de.ten} · {luot.cheDo === 'full' ? 'Full Test' : `Practice (${de.kyNang === 'doc' ? 'Passage' : 'Part'} ${luot.phanChon.join(', ')})`}</div>
      <div className={s.tomTat}>
        <div className={s.oSoLieu}><span>Điểm thô</span><b>{dung}/{kq.length}</b></div>
        <div className={s.oSoLieu}><span>Band ước tính</span><b>{band ?? '—'}</b><span className={s.ghiChuNho}>{du40 ? 'theo bảng quy đổi phổ biến, thang 40 câu' : 'chỉ quy đổi khi làm Full Test đủ 40 câu'}</span></div>
        <div className={s.oSoLieu}><span>Thời gian</span><b>{dinhDangGio(luot.giay)}</b></div>
        <div className={s.oSoLieu}>
          <span>Sổ lỗi</span>
          <b>{kq.length - dung}</b>
          <span className={s.ghiChuNho}>
            {luot.soLoi === 'khach' ? 'đăng nhập để tự ghi câu sai' : luot.soLoi === 'loi' ? 'chưa ghi được — thử lại sau' : luot.soLoi ? `câu sai đã vào Sổ lỗi (${luot.soLoi.moi} mới, ${luot.soLoi.congDon} sai lại)` : 'đang ghi…'}
          </span>
        </div>
      </div>
      <p className={s.ghiChuNho} style={{ margin: '0 0 16px' }}>⚠️ Band là ƯỚC TÍNH từ đề tự soạn, không phải điểm thi thật. Dùng để theo dõi tiến bộ giữa các lượt.</p>
      <h2 style={{ fontSize: 16, margin: '0 0 8px' }}>Theo dạng câu hỏi</h2>
      <table className={s.bangKq} style={{ maxWidth: 620, marginBottom: 20 }}>
        <thead><tr><th>Dạng</th><th>Đúng</th><th /></tr></thead>
        <tbody>
          {[...theoDang.entries()].sort((a, b) => a[1].d / a[1].t - b[1].d / b[1].t).map(([t, x]) => (
            <tr key={t}><td>{t}</td><td>{x.d}/{x.t}</td><td style={{ width: 160 }}><div className={s.thanhTien} style={{ margin: 0 }}><i style={{ width: `${(x.d / x.t) * 100}%`, background: x.d / x.t < 0.6 ? 'var(--c-red)' : undefined }} /></div></td></tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className={s.batDau} onClick={() => setXemLai(true)}>Xem lại từng câu (giải thích + vị trí)</button>
        <Link href="/language/en/ielts/so-loi" className={s.nutPhu}>Mở Sổ lỗi</Link>
        <button type="button" className={s.nutPhu} onClick={lamLai}>Làm lại</button>
        <button type="button" className={s.nutPhu} onClick={veDe}>Các lượt đã làm</button>
      </div>
      <p className={s.mo} style={{ marginTop: 14 }}>Mẹo: đừng làm lại đề ngay — sẽ nhớ đáp án. Sổ lỗi cho ôn lại từng câu sai sau ≥ 2 ngày, rồi 7 ngày.</p>
    </div>
  );
}

function KetQuaViet({ de, luot, setLuot, veDe, lamLai }: { de: DeViet; luot: KetLuot; setLuot: (f: (l: KetLuot) => KetLuot) => void; veDe: () => void; lamLai: () => void }) {
  const [dangCham, setDangCham] = useState<number | null>(null);
  const [choGiay, setChoGiay] = useState(0);
  const [loi, setLoi] = useState('');
  const [daGhi, setDaGhi] = useState<Record<number, string>>({});
  const tasks = de.task.filter((t) => luot.phanChon.includes(t.so));
  const ai = luot.ai ?? {};
  const bandT1 = ai[1]?.band ?? null, bandT2 = ai[2]?.band ?? null;
  const tong = bandT1 != null && bandT2 != null ? lamTron((bandT1 + 2 * bandT2) / 3) : bandT2 ?? bandT1;

  const cham = async (so: number) => {
    const t = de.task.find((x) => x.so === so)!;
    setDangCham(so); setLoi(''); setChoGiay(0);
    try {
      const r = await thiChamViet({ bai: luot.bai?.[so] ?? '', de: t.de, task: so as 1 | 2, moTaHinh: t.moTaSo }, setChoGiay);
      if (!r.ketQua) {
        setLoi(r.lyDo === 'ai_unavailable' ? 'AI chấm bài đang tạm tắt.'
          : r.lyDo === 'khong_thay' ? 'Máy chủ vừa khởi động lại giữa lúc chấm — bấm chấm lại nhé.'
            : r.lyDo === 'qua_lau' ? 'AI chấm quá lâu — thử lại sau ít phút.'
              : r.lyDo === 'loi_ai' ? `Cổng AI báo lỗi: ${r.thongBao ?? ''}` : 'AI trả kết quả không đọc được — thử lại nhé.');
        return;
      }
      const moi = { ...ai, [so]: r.ketQua };
      setLuot((l) => ({ ...l, ai: moi }));
      if (luot.id) {
        const b1 = moi[1]?.band ?? null, b2 = moi[2]?.band ?? null;
        const band = b1 != null && b2 != null ? lamTron((b1 + 2 * b2) / 3) : b2 ?? b1;
        void thiCapNhatLuot(luot.id, { band, chiTiet: { bai: luot.bai, phanChon: luot.phanChon, ai: moi } }).catch(() => {});
      }
    } catch (e) {
      const m = loiMang(e);
      setLoi(m.status === 401 ? 'Đăng nhập để AI chấm bài.' : m.status === 429 ? (m.message ?? 'Hết hạn mức AI hôm nay.') : m.message ?? 'Không kết nối được máy chấm.');
    } finally { setDangCham(null); }
  };

  const ghiLoiViet = async (so: number) => {
    const k = ai[so];
    if (!k?.loi.length) return;
    try {
      const muc: GhiLoi[] = k.loi.map((l) => ({
        nguon: `viet:${de.id}:t${so}:${l.goc.toLowerCase().replace(/\s+/g, ' ').slice(0, 100)}`,
        kyNang: 'viet', dang: `Writing Task ${so}`, cauHoi: `Viết lại cho đúng: "${l.goc}"`, daChon: l.goc, dapAn: l.sua, giaiThich: l.vi, lyDo: 'ngu-phap',
        duLieu: { loai: 'viet', goc: l.goc },
      }));
      const r = await loiGhi(muc);
      setDaGhi((d) => ({ ...d, [so]: `Đã thêm ${r.moi} lỗi mới${r.congDon ? `, ${r.congDon} lỗi lặp lại` : ''} vào Sổ lỗi.` }));
    } catch (e) { setDaGhi((d) => ({ ...d, [so]: loiMang(e).message ?? 'Chưa ghi được.' })); }
  };

  return (
    <div className={s.khung}>
      <div className={s.dauTrang}>
        <h1 className={s.duongDan} style={{ margin: 0 }}><button type="button" onClick={veDe}>IELTS Test</button> / Writing / Result</h1>
      </div>
      <div className={s.tenDe}>{de.ten}</div>
      <div className={s.tomTat}>
        {tasks.map((t) => <div key={t.so} className={s.oSoLieu}><span>Task {t.so}</span><b>{ai[t.so]?.band ?? '—'}</b><span className={s.ghiChuNho}>{demTuViet(luot.bai?.[t.so] ?? '')} từ</span></div>)}
        <div className={s.oSoLieu}><span>Writing (ước tính)</span><b>{tong ?? '—'}</b><span className={s.ghiChuNho}>Task 2 tính gấp đôi Task 1</span></div>
        <div className={s.oSoLieu}><span>Thời gian</span><b>{dinhDangGio(luot.giay)}</b></div>
      </div>
      <p className={s.ghiChuNho}>⚠️ Band do AI ước lượng theo band descriptors công khai — không phải điểm thi thật.</p>
      {loi && <p className={s.loi}>{loi}</p>}
      {tasks.map((t) => {
        const k = ai[t.so];
        const bai = luot.bai?.[t.so] ?? '';
        return (
          <section key={t.so} style={{ margin: '26px 0' }}>
            <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Task {t.so}</h2>
            <div className={s.vanBan}>{bai || <span className={s.mo}>(bỏ trống)</span>}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '10px 0', flexWrap: 'wrap' }}>
              <button type="button" className={s.batDau} disabled={dangCham != null || demTuViet(bai) < 40} onClick={() => cham(t.so)}>
                {dangCham === t.so ? `AI đang chấm… ${choGiay}s (thường 1–2 phút)` : k ? 'Chấm lại' : `Nhờ AI chấm Task ${t.so} (4 tiêu chí)`}
              </button>
              {demTuViet(bai) < 40 && <span className={s.mo}>Bài dưới 40 từ, chưa chấm được.</span>}
            </div>
            {k && (
              <>
                <div className={s.tieuChi}>
                  {k.tieuChi.map((c) => (
                    <div key={c.ma}>
                      <div className={s.mo}>{c.ten} ({c.ma})</div>
                      <b>{c.band}</b>
                      {c.manh && <p style={{ margin: '6px 0 0' }}>👍 {c.manh}</p>}
                      {c.sua && <p style={{ margin: '6px 0 0' }}>🔧 {c.sua}</p>}
                    </div>
                  ))}
                </div>
                {k.nhanXet && <p style={{ fontSize: 14.5 }}><b>Ưu tiên sửa:</b> {k.nhanXet}</p>}
                {k.loi.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 15, margin: '14px 0 6px' }}>Sửa lỗi cụ thể</h3>
                    <ol className={s.loiViet}>
                      {k.loi.map((l, i) => <li key={i}><span className={s.gach}>{l.goc}</span> → <span className={s.sua}>{l.sua}</span><br /><span className={s.mo}>{l.vi}</span></li>)}
                    </ol>
                    <button type="button" className={s.nutPhu} onClick={() => ghiLoiViet(t.so)}>➕ Thêm các lỗi này vào Sổ lỗi</button>
                    {daGhi[t.so] && <span className={s.mo} style={{ marginLeft: 8 }}>{daGhi[t.so]}</span>}
                  </>
                )}
                {k.banVietLai && (
                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Bản viết lại band 7.5 (giữ ý của bạn)</summary>
                    <div className={s.vanBan} style={{ marginTop: 8 }}>{k.banVietLai}</div>
                  </details>
                )}
              </>
            )}
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Bài mẫu {t.mau.band} + phân tích</summary>
              <div className={s.vanBan} style={{ marginTop: 8 }}>{t.mau.s}</div>
              <ul style={{ fontSize: 14.5, lineHeight: 1.6 }}>{t.mau.phanTich.map((x, i) => <li key={i}><ChuDam t={x} /></li>)}</ul>
            </details>
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Gợi ý cách làm Task {t.so}</summary>
              <ul style={{ fontSize: 14.5, lineHeight: 1.6 }}>{t.goiY.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </details>
          </section>
        );
      })}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className={s.nutPhu} onClick={lamLai}>Viết lại đề này</button>
        <Link href="/language/en/ielts/so-loi" className={s.nutPhu}>Mở Sổ lỗi</Link>
      </div>
    </div>
  );
}

function lamTron(x: number): number {
  const n = Math.floor(x), d = x - n;
  return d < 0.25 ? n : d < 0.75 ? n + 0.5 : n + 1;
}
