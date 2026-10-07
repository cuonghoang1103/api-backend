'use client';

/**
 * 📒 SỔ LỖI IELTS tự động — /language/en/ielts/so-loi · app desktop: /ielts/so-loi (07/10/2026)
 * ─────────────────────────────────────────────────────────────────────────
 * Thay Google Sheet ghi lỗi bằng tay: câu sai ở phòng thi / Gõ lại / lỗi Writing AI chỉ ra
 * TỰ vào đây. Người học chọn lý do sai, tự viết "công thức rút ra" (AI gợi ý được, có trần).
 * Lọc theo kỹ năng/dạng/lý do; thống kê dạng hay sai nhất; xuất CSV.
 * "Ôn sổ lỗi" = làm lại câu sai có giãn cách: chỉ câu đã qua ≥ 2 ngày (rồi 7 ngày) — máy chủ chặn làm sớm.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MenuTren, useHienThi } from '../chung/MenuTren';
import { loiDs, loiSua, loiXoa, loiLamLai, loiGoiY, loiMang, LY_DO_NHAN, TEN_KY_NANG_LOI, type DsLoi, type MucLoi, type KyNangLoi } from '../chung/api';
import { taiDe } from '../thi-may/de/index';
import type { DeDoc, DeNghe, Nhom } from '../thi-may/de/types';
import { chamNhom } from '../thi-may/cham';
import { NhomCau } from '../thi-may/Nhom';
import { play } from '@/components/sach-hoc/audio';
import { useLangUser } from '@/components/language/primitives';
import s from '../chung/cdt.module.css';

const ngayVN = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

function trangThai(m: MucLoi): { nhan: string; lop: string } {
  if (m.daXong) return { nhan: '✓ Đã vững', lop: s.nhanXanh };
  if (new Date(m.hanOn).getTime() <= Date.now()) return { nhan: `Đến hạn ôn (lần ${m.buoc + 1})`, lop: s.nhanDo };
  return { nhan: `Ôn lại từ ${ngayVN(m.hanOn)}`, lop: '' };
}

function xuatCsv(items: MucLoi[]) {
  const cot = ['Ngày ghi', 'Kỹ năng', 'Dạng câu', 'Câu hỏi', 'Bạn chọn', 'Đáp án', 'Giải thích', 'Lý do sai', 'Công thức rút ra', 'Lần sai', 'Hạn ôn', 'Trạng thái'];
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const dong = items.map((m) => [
    new Date(m.createdAt).toLocaleDateString('vi-VN'), TEN_KY_NANG_LOI[m.kyNang] ?? m.kyNang, m.dang, m.cauHoi, m.daChon, m.dapAn, m.giaiThich ?? '',
    m.lyDo ? LY_DO_NHAN[m.lyDo] ?? m.lyDo : '', m.congThuc ?? '', m.lanSai, new Date(m.hanOn).toLocaleDateString('vi-VN'), trangThai(m).nhan,
  ].map(esc).join(','));
  const blob = new Blob([`\uFEFF${[cot.map(esc).join(','), ...dong].join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `so-loi-ielts-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

export default function SoLoi() {
  const { isAuthenticated } = useLangUser();
  const { thuocTinh } = useHienThi();
  const [ky, setKy] = useState<KyNangLoi | ''>('');
  const [dang, setDang] = useState('');
  const [lyDo, setLyDo] = useState('');
  const [tt, setTt] = useState('');
  const [ds, setDs] = useState<DsLoi | null>(null);
  const [loi, setLoi] = useState('');
  const [onTap, setOnTap] = useState<MucLoi[] | null>(null);

  const tai = useCallback(async () => {
    if (!isAuthenticated) return;
    try { setDs(await loiDs({ kyNang: ky || undefined, dang: dang || undefined, lyDo: lyDo || undefined, trangThai: tt || undefined })); setLoi(''); }
    catch (e) { setLoi(loiMang(e).message ?? 'Không tải được Sổ lỗi.'); }
  }, [isAuthenticated, ky, dang, lyDo, tt]);
  useEffect(() => { void tai(); }, [tai]);

  const capNhat = (m: MucLoi) => setDs((d) => (d ? { ...d, items: d.items.map((x) => (x.id === m.id ? m : x)) } : d));
  const cacDang = useMemo(() => (ds?.thongKe.theoDang ?? []).map((d) => d.dang).sort(), [ds]);

  const batDauOn = async () => {
    try {
      const r = await loiDs({ trangThai: 'den-han' });
      setOnTap(r.items.sort((a, b) => a.hanOn.localeCompare(b.hanOn)));
    } catch (e) { setLoi(loiMang(e).message ?? 'Không tải được câu đến hạn.'); }
  };

  return (
    <div className={s.goc} {...thuocTinh}>
      <MenuTren dang="so-loi" />
      <div className={s.khung}>
        <div className={s.dauTrang}>
          <h1 className={s.duongDan} style={{ margin: 0 }}>IELTS / Sổ lỗi</h1>
          {ds && !onTap && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className={s.batDau} onClick={batDauOn} disabled={!ds.thongKe.denHan}>Ôn sổ lỗi ({ds.thongKe.denHan} câu đến hạn)</button>
              <button type="button" className={s.nutPhu} onClick={() => xuatCsv(ds.items)} disabled={!ds.items.length}>⬇ Xuất CSV</button>
            </div>
          )}
        </div>
        {!isAuthenticated && <p className={s.mo}>Đăng nhập để có Sổ lỗi — mỗi câu sai trong <Link href="/language/en/ielts/thi-may" style={{ textDecoration: 'underline' }}>phòng thi</Link> sẽ tự được ghi vào đây.</p>}
        {loi && <p className={s.loi}>{loi}</p>}

        {onTap ? (
          <OnTap ds={onTap} xong={() => { setOnTap(null); void tai(); }} capNhat={capNhat} />
        ) : ds && (
          <>
            <p className={s.mo} style={{ margin: '0 0 14px', maxWidth: 780 }}>
              Câu sai tự vào sổ. Việc của bạn: chọn <b>lý do sai</b> và viết <b>công thức rút ra</b> (1 câu, để lần sau không sai nữa).
              Ôn lại được sau <b>≥ 2 ngày</b>, đúng thì hẹn tiếp <b>7 ngày</b>, đúng nữa là "đã vững" — làm lại ngay chỉ là nhớ đáp án.
            </p>
            <ThongKeLoi ds={ds} />
            <div className={s.loc}>
              <div className={s.locKy} style={{ margin: 0 }} role="tablist">
                <button type="button" className={`${s.tab} ${ky === '' ? s.tabOn : ''}`} onClick={() => setKy('')}>Tất cả ({ds.thongKe.tong})</button>
                {(Object.keys(TEN_KY_NANG_LOI) as KyNangLoi[]).map((k) => {
                  const n = ds.thongKe.theoKyNang.find((x) => x.kyNang === k)?.so ?? 0;
                  return <button key={k} type="button" className={`${s.tab} ${ky === k ? s.tabOn : ''}`} onClick={() => setKy(k)}>{TEN_KY_NANG_LOI[k]} ({n})</button>;
                })}
              </div>
              <select value={dang} onChange={(e) => setDang(e.target.value)} aria-label="Lọc theo dạng câu">
                <option value="">Mọi dạng câu</option>
                {cacDang.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={lyDo} onChange={(e) => setLyDo(e.target.value)} aria-label="Lọc theo lý do">
                <option value="">Mọi lý do</option>
                <option value="chua">(chưa chọn lý do)</option>
                {Object.entries(LY_DO_NHAN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={tt} onChange={(e) => setTt(e.target.value)} aria-label="Lọc theo trạng thái">
                <option value="">Mọi trạng thái</option>
                <option value="den-han">Đến hạn ôn</option>
                <option value="dang-on">Đang ôn</option>
                <option value="vung">Đã vững</option>
              </select>
            </div>
            {ds.items.length === 0 && <p className={s.mo}>Chưa có câu nào{ky || dang || lyDo || tt ? ' khớp bộ lọc' : ''}. Làm một đề ở <Link href="/language/en/ielts/thi-may" style={{ textDecoration: 'underline' }}>Online Test</Link> — câu sai sẽ tự vào đây.</p>}
            {ds.items.map((m) => <TheLoi key={m.id} m={m} capNhat={capNhat} xoa={() => setDs((d) => (d ? { ...d, items: d.items.filter((x) => x.id !== m.id) } : d))} />)}
          </>
        )}
      </div>
    </div>
  );
}

function ThongKeLoi({ ds }: { ds: DsLoi }) {
  const top = ds.thongKe.theoDang.slice(0, 6);
  const max = Math.max(1, ...top.map((d) => d.lanSai));
  if (!top.length) return null;
  return (
    <section style={{ margin: '0 0 18px' }} aria-label="Dạng hay sai nhất">
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Dạng hay sai nhất (tổng số lần sai)</div>
      {top.map((d) => (
        <div key={d.dang} className={s.thanhNgang}>
          <span>{d.dang}</span>
          <i style={{ width: `${(d.lanSai / max) * 100}%` }} />
          <b>{d.lanSai}</b>
        </div>
      ))}
      {ds.thongKe.theoLyDo.length > 0 && (
        <div className={s.mo} style={{ marginTop: 8 }}>
          Lý do: {ds.thongKe.theoLyDo.map((x) => `${x.lyDo ? LY_DO_NHAN[x.lyDo] ?? x.lyDo : 'chưa chọn'} (${x.so})`).join(' · ')}
        </div>
      )}
    </section>
  );
}

function TheLoi({ m, capNhat, xoa }: { m: MucLoi; capNhat: (m: MucLoi) => void; xoa: () => void }) {
  const [ct, setCt] = useState(m.congThuc ?? '');
  const [ban, setBan] = useState('');
  const t = trangThai(m);
  const luu = async (b: { lyDo?: string | null; congThuc?: string | null }) => {
    setBan('Đang lưu…');
    try { capNhat(await loiSua(m.id, b)); setBan('Đã lưu'); setTimeout(() => setBan(''), 1500); }
    catch (e) { setBan(loiMang(e).message ?? 'Chưa lưu được'); }
  };
  const goiY = async () => {
    setBan('AI đang nghĩ…');
    try {
      const r = await loiGoiY(m.id);
      if (!r.goiY) { setBan(r.lyDo === 'ai_unavailable' ? 'AI đang tắt' : 'AI chưa trả lời được'); return; }
      if (r.goiY.congThuc && !ct.trim()) setCt(r.goiY.congThuc);
      await luu({ ...(r.goiY.lyDo && !m.lyDo ? { lyDo: r.goiY.lyDo } : {}), ...(r.goiY.congThuc && !ct.trim() ? { congThuc: r.goiY.congThuc } : {}) });
      if (ct.trim() && r.goiY.congThuc) setBan(`AI gợi ý: ${r.goiY.congThuc}`);
    } catch (e) { setBan(loiMang(e).message ?? 'AI chưa trả lời được'); }
  };
  return (
    <article className={s.theLoi}>
      <div className={s.theLoiDau}>
        <span className={s.nhan}>{TEN_KY_NANG_LOI[m.kyNang] ?? m.kyNang}</span>
        <span className={s.nhan}>{m.dang}</span>
        <span className={`${s.nhan} ${t.lop}`}>{t.nhan}</span>
        {m.lanSai > 1 && <span className={`${s.nhan} ${s.nhanDo}`}>sai {m.lanSai} lần</span>}
        <span>· ghi {ngayVN(m.createdAt)}</span>
        <button type="button" className={s.nutNho} style={{ marginLeft: 'auto' }} onClick={async () => { if (window.confirm('Xoá câu này khỏi Sổ lỗi?')) { try { await loiXoa(m.id); xoa(); } catch { /* bỏ qua */ } } }}>Xoá</button>
      </div>
      <div style={{ whiteSpace: 'pre-wrap' }}>{m.cauHoi}</div>
      <div style={{ margin: '6px 0' }}>
        <span style={{ color: 'var(--c-red)' }}>✗ Bạn: <s>{m.daChon}</s></span>{'  ·  '}
        <span style={{ color: 'var(--c-ok)', fontWeight: 600 }}>✓ Đáp án: {m.dapAn}</span>
      </div>
      {m.giaiThich && <details><summary style={{ cursor: 'pointer', fontSize: 13 }}>Giải thích</summary><div className={s.mo} style={{ fontSize: 14, marginTop: 4 }}>{m.giaiThich}</div></details>}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 260px) 1fr', gap: 8, marginTop: 8, alignItems: 'start' }}>
        <select value={m.lyDo ?? ''} onChange={(e) => void luu({ lyDo: e.target.value || null })} aria-label="Lý do sai" style={{ height: 32 }}>
          <option value="">— Lý do sai —</option>
          {Object.entries(LY_DO_NHAN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <textarea className={s.congThuc} value={ct} onChange={(e) => setCt(e.target.value)} onBlur={() => { if ((m.congThuc ?? '') !== ct) void luu({ congThuc: ct.trim() || null }); }}
          placeholder="Công thức rút ra — vd. TFNG: bài nói NGƯỢC ⇒ FALSE; bài KHÔNG nhắc ⇒ NOT GIVEN" aria-label="Công thức rút ra" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
        <button type="button" className={s.nutNho} onClick={goiY}>✨ AI gợi ý lý do + công thức</button>
        {ban && <span className={s.mo}>{ban}</span>}
      </div>
    </article>
  );
}

/* ── Ôn sổ lỗi: làm lại từng câu đến hạn ── */
function OnTap({ ds, xong, capNhat }: { ds: MucLoi[]; xong: () => void; capNhat: (m: MucLoi) => void }) {
  const [i, setI] = useState(0);
  const m = ds[i];
  if (!m) {
    return (
      <div className={s.mat} style={{ position: 'relative', minHeight: 200 }}>
        <div className={s.nghiaLon}>Xong lượt ôn ({ds.length} câu)</div>
        <div className={s.viDu}>Câu đúng hẹn lại sau 7 ngày (hoặc "đã vững"); câu sai hẹn lại sau 2 ngày.</div>
        <button type="button" className={s.nutXanh} onClick={xong}>Về Sổ lỗi</button>
      </div>
    );
  }
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 12px', gap: 8, flexWrap: 'wrap' }}>
        <b>Ôn sổ lỗi · câu {i + 1}/{ds.length}</b>
        <button type="button" className={s.nutPhu} onClick={xong}>Dừng ôn</button>
      </div>
      <MotCauOn key={m.id} m={m} tiep={(mm) => { if (mm) capNhat(mm); setI((x) => x + 1); }} />
    </section>
  );
}

function MotCauOn({ m, tiep }: { m: MucLoi; tiep: (m?: MucLoi) => void }) {
  const [de, setDe] = useState<DeDoc | DeNghe | null>(null);
  const [ans, setAns] = useState<Record<number, string>>({});
  const [go, setGo] = useState('');
  const [kq, setKq] = useState<null | boolean>(null);
  const [loi, setLoi] = useState('');
  const tiepRef = useRef<MucLoi | undefined>(undefined);
  const dl = (m.duLieu ?? {}) as { deId?: string; n?: number; loai?: string; tu?: string; goc?: string };

  useEffect(() => {
    if (dl.deId) void taiDe(dl.deId)?.then((d) => { if (d.kyNang !== 'viet') setDe(d); });
    if (dl.loai === 'tu' && dl.tu) void play({ text: dl.tu, voice: 'uk-nu', toc: 0.9 });
  }, [dl.deId, dl.loai, dl.tu]);

  const nhom: Nhom | null = useMemo(() => {
    if (!de || dl.n == null) return null;
    for (const p of de.phan as { nhom: Nhom[] }[]) for (const g of p.nhom) if (dl.n >= g.tu && dl.n <= g.den) return g;
    return null;
  }, [de, dl.n]);
  const chiCau = nhom?.nhieu ? nhom.nhieu.ns : dl.n != null ? [dl.n] : [];

  const gui = async (dung: boolean, traLoi: string) => {
    setKq(dung);
    try { tiepRef.current = await loiLamLai(m.id, dung, traLoi); } catch (e) { setLoi(loiMang(e).message ?? 'Chưa lưu được kết quả ôn.'); }
  };

  const kiem = () => {
    if (nhom && de) {
      const r = chamNhom([nhom], de.dapAn, ans).filter((k) => chiCau.includes(k.n));
      void gui(r.every((k) => k.dung), chiCau.map((n) => ans[n] ?? '').join(' + '));
    } else if (dl.loai === 'tu') {
      void gui(go.trim().toLowerCase() === m.dapAn.trim().toLowerCase(), go.trim());
    }
  };

  return (
    <div className={s.theLoi} style={{ fontSize: 15 }}>
      <div className={s.theLoiDau}><span className={s.nhan}>{TEN_KY_NANG_LOI[m.kyNang]}</span><span className={s.nhan}>{m.dang}</span><span>sai {m.lanSai} lần · lần ôn {m.buoc + 1}</span></div>
      {nhom && de ? (
        <>
          <p className={s.mo} style={{ margin: '0 0 6px' }}>{de.ten} · câu {chiCau.join('–')}</p>
          {de.kyNang === 'nghe' && (() => {
            // Bài nghe: phát lại đoạn thoại chứa đáp án (+ câu trước nó làm ngữ cảnh) — chỉ nghe, không hiện chữ trước khi trả lời.
            const ev = de.dapAn[chiCau[0]]?.ev;
            const loi = (de as DeNghe).phan.flatMap((p) => p.loi);
            const i = ev ? loi.findIndex((l) => l.s.includes(ev)) : -1;
            if (i < 0) return null;
            const doan = loi.slice(Math.max(0, i - 1), i + 2);
            return (
              <div style={{ margin: '0 0 8px' }}>
                <button type="button" className={s.nutPhu} onClick={() => void play(doan.map((l) => ({ text: l.s, voice: l.giong })))}>🔊 Nghe đoạn thoại của câu này</button>
                {kq !== null && <div className={s.giai} style={{ marginLeft: 0, marginTop: 8 }}>{doan.map((l, j) => <div key={j}><b>{l.ai}:</b> {l.s}</div>)}</div>}
              </div>
            );
          })()}
          <NhomCau g={nhom} dapAn={de.dapAn} ans={ans} set={(n, v) => setAns((a) => ({ ...a, [n]: v }))} xem={kq !== null}
            kq={kq !== null ? new Map(chamNhom([nhom], de.dapAn, ans).map((k) => [k.n, k])) : undefined}
            co={new Set()} datCo={() => {}} dang={null} onFocus={() => {}} chiCau={chiCau} />
        </>
      ) : dl.loai === 'tu' ? (
        <>
          <p>{m.cauHoi}</p>
          <button type="button" className={s.nutPhu} onClick={() => void play({ text: dl.tu ?? m.dapAn, voice: 'uk-nu', toc: 0.9 })}>🔊 Nghe lại</button>{' '}
          <input className={s.goO} style={{ marginTop: 8 }} value={go} onChange={(e) => setGo(e.target.value)} readOnly={kq !== null} onKeyDown={(e) => { if (e.key === 'Enter' && kq === null) kiem(); }} autoComplete="off" spellCheck={false} aria-label="Gõ từ" />
        </>
      ) : (
        <>
          <p style={{ whiteSpace: 'pre-wrap' }}>{m.cauHoi}</p>
          {m.kyNang === 'viet' && kq === null && <textarea className={s.congThuc} value={go} onChange={(e) => setGo(e.target.value)} placeholder="Viết lại câu cho đúng…" aria-label="Viết lại" />}
        </>
      )}
      {kq === null ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {(nhom || dl.loai === 'tu') ? (
            <button type="button" className={s.batDau} onClick={kiem}>Kiểm tra</button>
          ) : (
            <>
              <button type="button" className={s.nutPhu} onClick={() => void gui(true, go)}>Mình làm đúng ✓</button>
              <button type="button" className={s.nutPhu} onClick={() => void gui(false, go)}>Vẫn chưa đúng ✗</button>
              <span className={s.mo}>Tự chấm: so với đáp án sau khi bấm.</span>
            </>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, color: kq ? 'var(--c-ok)' : 'var(--c-red)' }}>{kq ? '✓ Đúng — hẹn ôn lần sau xa hơn' : '✗ Chưa đúng — hẹn lại sau 2 ngày'}</div>
          {!nhom && <div style={{ margin: '6px 0' }}>Đáp án: <b style={{ color: 'var(--c-ok)' }}>{m.dapAn}</b></div>}
          {m.congThuc && <div className={s.giai} style={{ marginLeft: 0 }}>📌 Công thức của bạn: {m.congThuc}</div>}
          {loi && <p className={s.loi}>{loi}</p>}
          <button type="button" className={s.nutXanh} style={{ marginTop: 10 }} onClick={() => tiep(tiepRef.current)}>Câu tiếp →</button>
        </div>
      )}
    </div>
  );
}
