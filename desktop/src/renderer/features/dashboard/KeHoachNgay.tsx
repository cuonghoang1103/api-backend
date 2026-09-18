/**
 * ============================================================
 * BẢNG KẾ HOẠCH CHI TIẾT
 * ============================================================
 *
 * Lịch tháng → bấm một ngày → lập kế hoạch cho ngày đó: từng việc có
 * GIỜ BẮT ĐẦU, THỜI LƯỢNG, MỨC KHÓ, MỨC QUAN TRỌNG và ghi chú. Hết giờ
 * mà chưa tích xong thì việc tự bị đánh trượt và trừ điểm uy tín.
 *
 * ─── Vì sao BẮT chọn khó + quan trọng ───
 * Mức trừ uy tín = khó × quan trọng. Cho phép bỏ trống thì máy chủ phải
 * đoán thay người dùng, và điểm bị trừ dựa trên một con số họ chưa từng
 * nhìn thấy — đó là cách nhanh nhất để họ mất tin vào cả hệ thống. Nút
 * "Thêm việc" khoá cho tới khi cả hai được chọn.
 *
 * ─── Vì sao có nút "Dời" ───
 * Thiếu nó, cách duy nhất để không mất điểm cho một việc không kịp làm
 * là XOÁ nó. Khi người dùng học được điều đó thì bảng kế hoạch chỉ còn
 * lại những việc đã xong — nó thành một cuốn album, không còn là công cụ.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, CalendarClock, Check, ChevronLeft, ChevronRight,
  Clock, RotateCcw, Sparkles, Trash2, TrendingUp,
} from 'lucide-react';

import { useSession } from '../../auth/session';
import { useDich } from '../../i18n';
import {
  MAU_KHO, TEN_KHO, TEN_QUAN_TRONG, tomTatNgay, trangThai, xepTheoGio,
  type ViecKeHoach,
} from './keHoach';
import {
  chongGio, ghepGio, gioMay, luoiThang, maThang, moTaPhut,
  ngayDayDu, ngayMay, nhichThang, TEN_THU, tongPhut,
} from './lichThang';

interface TomTatNgay { tong: number; xong: number; truot: number; khoNhat: number }
interface Bac { ma: string; ten: string; mau: string; mo: string }
interface UyTin {
  diem: number; bac: Bac; moc: number;
  so: Array<{ delta: number; diemSau: number; loai: string; lyDo: string; luc: string }>;
}

/** Bảng chọn 1–3 dùng chung cho cả "khó" lẫn "quan trọng". */
function ChonMuc({ giaTri, datGiaTri, ten, mauTheoMuc, nhan }: {
  giaTri: number;
  datGiaTri: (n: number) => void;
  ten: Record<number, string>;
  mauTheoMuc: boolean;
  nhan: string;
}) {
  return (
    <div className="ct-kh-chon" role="group" aria-label={nhan}>
      <span className="ct-kh-chon-nhan">{nhan}</span>
      {[1, 2, 3].map((m) => (
        <button
          key={m}
          type="button"
          className="ct-kh-muc"
          data-chon={giaTri === m}
          aria-pressed={giaTri === m}
          style={mauTheoMuc && giaTri === m
            ? { background: MAU_KHO[m]!.nen, borderColor: MAU_KHO[m]!.vien, color: MAU_KHO[m]!.chu }
            : undefined}
          onClick={() => datGiaTri(m)}
        >
          {ten[m]}
        </button>
      ))}
    </div>
  );
}

export function KeHoachNgay({ onDoiViec }: { onDoiViec?: () => void }) {
  const { api } = useSession();
  const { dich, dichP } = useDich();

  const [moc, datMoc] = useState(() => {
    const d = new Date();
    return { nam: d.getFullYear(), thang: d.getMonth() + 1 };
  });
  const [chon, datChon] = useState(() => ngayMay());
  const [thangDu, datThangDu] = useState<Record<string, TomTatNgay>>({});
  const [viec, datViec] = useState<ViecKeHoach[]>([]);
  const [uyTin, datUyTin] = useState<UyTin | null>(null);
  const [dangTai, datDangTai] = useState(false);
  const [nhanXet, datNhanXet] = useState<string | null>(null);
  const [dangXem, datDangXem] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [moSo, datMoSo] = useState(false);

  /* Ô nhập việc mới. `kho`/`quanTrong` khởi điểm 0 = CHƯA CHỌN, và nút
     thêm khoá cho tới khi cả hai khác 0 — xem chú thích đầu tệp. */
  const [ten, datTen] = useState('');
  const [gio, datGio] = useState('');
  const [phut, datPhut] = useState('');
  const [kho, datKho] = useState(0);
  const [quanTrong, datQuanTrong] = useState(0);
  const [ghiChu, datGhiChu] = useState('');

  const napThang = useCallback(async (nam: number, thang: number) => {
    if (!api) return;
    try {
      const j = await api.request(`/api/v1/dashboard/thang?ym=${maThang(nam, thang)}`) as { ngay?: Record<string, TomTatNgay> };
      datThangDu(j.ngay ?? {});
    } catch { /* lịch thiếu chấm màu vẫn dùng được — không chặn cả trang vì nó */ }
  }, [api]);

  const napNgay = useCallback(async (ngay: string) => {
    if (!api) return;
    datDangTai(true);
    try {
      const [j, u] = await Promise.all([
        api.request(`/api/v1/dashboard/ngay?date=${ngay}`) as Promise<{ tasks?: ViecKeHoach[] }>,
        api.request('/api/v1/dashboard/uy-tin') as Promise<UyTin>,
      ]);
      datViec(j.tasks ?? []);
      datUyTin(u);
      datLoi(null);
    } catch (e) {
      datLoi(e instanceof Error ? e.message : String(e));
    } finally { datDangTai(false); }
  }, [api]);

  useEffect(() => { void napThang(moc.nam, moc.thang); }, [napThang, moc.nam, moc.thang]);
  useEffect(() => {
    void napNgay(chon);
    /* Đổi ngày ⇒ XOÁ nhận xét cũ. Không xoá thì lời khuyên về thứ Ba nằm
       nguyên dưới kế hoạch thứ Tư, và người đọc không có cách nào biết nó
       đang nói về ngày nào. */
    datNhanXet(null);
  }, [napNgay, chon]);

  const lamMoi = useCallback(async () => {
    await napNgay(chon);
    await napThang(moc.nam, moc.thang);
    onDoiViec?.();
  }, [napNgay, napThang, chon, moc.nam, moc.thang, onDoiViec]);

  const themViec = useCallback(async () => {
    if (!api || !ten.trim() || kho === 0 || quanTrong === 0) return;
    const p = Number(phut);
    try {
      await api.request('/api/v1/dashboard/tasks', {
        method: 'POST',
        body: {
          title: ten.trim(),
          scope: 'today',
          date: chon,
          doKho: kho,
          priority: quanTrong,
          batDauAt: gio ? ghepGio(chon, gio) : null,
          phutLam: Number.isFinite(p) && p > 0 ? Math.round(p) : null,
          note: ghiChu.trim() || null,
        },
      });
      datTen(''); datGio(''); datPhut(''); datKho(0); datQuanTrong(0); datGhiChu('');
      await lamMoi();
    } catch (e) { datLoi(e instanceof Error ? e.message : String(e)); }
  }, [api, ten, kho, quanTrong, phut, chon, gio, ghiChu, lamMoi]);

  const sua = useCallback(async (v: ViecKeHoach, thay: Record<string, unknown>) => {
    if (!api) return;
    /* Đổi giao diện TRƯỚC — tick là thao tác làm nhiều nhất, và chờ mạng
       ở đây làm app có cảm giác đơ. */
    datViec((c) => c.map((x) => (x.id === v.id ? { ...x, ...thay } as ViecKeHoach : x)));
    try {
      await api.request(`/api/v1/dashboard/tasks/${v.id}`, { method: 'PATCH', body: thay });
      /* Tick xong ⇒ nạp lại: điểm uy tín và cờ trượt do MÁY CHỦ tính, nên
         con số trên đầu chỉ đúng sau khi hỏi lại. Sửa ghi chú hay giờ thì
         không đụng tới điểm, không cần thêm một vòng mạng. */
      if (thay.done !== undefined) await lamMoi();
    } catch (e) {
      datLoi(e instanceof Error ? e.message : String(e));
      await napNgay(chon);
    }
  }, [api, lamMoi, napNgay, chon]);

  const doiNgay = useCallback(async (v: ViecKeHoach) => {
    if (!api) return;
    const mai = new Date(new Date(`${chon}T12:00:00`).getTime() + 86_400_000);
    try {
      await api.request(`/api/v1/dashboard/tasks/${v.id}/hoan`, {
        method: 'POST', body: { date: ngayMay(mai), batDauAt: v.batDauAt },
      });
      await lamMoi();
    } catch (e) { datLoi(e instanceof Error ? e.message : String(e)); }
  }, [api, chon, lamMoi]);

  const xoa = useCallback(async (v: ViecKeHoach) => {
    if (!api) return;
    datViec((c) => c.filter((x) => x.id !== v.id));
    try { await api.request(`/api/v1/dashboard/tasks/${v.id}`, { method: 'DELETE' }); await lamMoi(); }
    catch { await napNgay(chon); }
  }, [api, lamMoi, napNgay, chon]);

  const nhoAiXem = useCallback(async () => {
    if (!api) return;
    datDangXem(true);
    try {
      /* Dùng dạng generic `request<T>(…)` chứ KHÔNG `await … as T`: trong tệp
         .tsx, một `as` nằm ở dòng SAU lời gọi làm bộ phân tích JSX vỡ
         (`TS1434`), và thông báo lỗi chỉ vào chữ `as` chứ không nói vì sao. */
      const j = await api.request<{ nhanXet?: string | null; lyDo?: string }>(
        '/api/v1/dashboard/danh-gia', { method: 'POST', body: { date: chon } },
      );
      datNhanXet(j.nhanXet
        ?? (j.lyDo === 'ai_unavailable'
          ? dich('Chưa cắm khoá AI nên chỉ có phần số liệu ở trên.')
          : dich('AI chưa trả lời được, thử lại sau.')));
    } catch (e) {
      datNhanXet(e instanceof Error ? e.message : String(e));
    } finally { datDangXem(false); }
  }, [api, chon, dich]);

  const luoi = useMemo(() => luoiThang(moc.nam, moc.thang), [moc.nam, moc.thang]);
  const xep = useMemo(() => xepTheoGio(viec), [viec]);
  const tom = useMemo(() => tomTatNgay(viec), [viec]);
  const phutDaXep = useMemo(() => tongPhut(viec), [viec]);
  const chong = useMemo(() => chongGio(viec), [viec]);
  const homNay = ngayMay();
  const duChon = kho > 0 && quanTrong > 0 && ten.trim().length > 0;

  return (
    <section className="ct-kh">
      <header className="ct-kh-dau">
        <h2><CalendarClock size={18} aria-hidden /> {dich('Bảng kế hoạch')}</h2>
        {uyTin && (
          <button
            type="button"
            className="ct-kh-uytin"
            style={{ borderColor: uyTin.bac.mau, color: uyTin.bac.mau }}
            onClick={() => datMoSo((c) => !c)}
            aria-expanded={moSo}
            title={uyTin.bac.mo}
          >
            <TrendingUp size={15} aria-hidden />
            <b>{uyTin.diem}</b>
            <span>{uyTin.bac.ten}</span>
          </button>
        )}
      </header>

      {moSo && uyTin && (
        <div className="ct-kh-so">
          <p className="ct-kh-so-mo">{uyTin.bac.mo} {dichP('Mốc khởi điểm là {n}.', { n: uyTin.moc })}</p>
          {uyTin.so.length === 0
            ? <p className="ct-kh-trong">{dich('Chưa có thay đổi uy tín nào.')}</p>
            : (
              <ul>
                {uyTin.so.slice(0, 12).map((r, i) => (
                  <li key={`${r.luc}-${i}`} data-am={r.delta < 0}>
                    <b>{r.delta > 0 ? `+${r.delta}` : r.delta}</b>
                    <span>{r.lyDo}</span>
                    <i>{r.diemSau}</i>
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}

      {/* ─── Lịch tháng ─── */}
      <div className="ct-kh-lich">
        <div className="ct-kh-thang">
          <button type="button" onClick={() => datMoc((c) => nhichThang(c.nam, c.thang, -1))} aria-label={dich('Tháng trước')}>
            <ChevronLeft size={16} aria-hidden />
          </button>
          <strong>{dichP('Tháng {t}/{n}', { t: moc.thang, n: moc.nam })}</strong>
          <button type="button" onClick={() => datMoc((c) => nhichThang(c.nam, c.thang, 1))} aria-label={dich('Tháng sau')}>
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
        <div className="ct-kh-thu">
          {TEN_THU.map((t) => <span key={t}>{dich(t)}</span>)}
        </div>
        <div className="ct-kh-o">
          {luoi.map((o) => {
            const d = thangDu[o.ngay];
            return (
              <button
                key={o.ngay}
                type="button"
                className="ct-kh-ngay"
                data-ngoai={!o.trongThang}
                data-chon={o.ngay === chon}
                data-homnay={o.ngay === homNay}
                data-cuoituan={o.cuoiTuan}
                onClick={() => datChon(o.ngay)}
                aria-current={o.ngay === homNay ? 'date' : undefined}
                aria-label={ngayDayDu(o.ngay)}
              >
                <span>{o.so}</span>
                {d && d.tong > 0 && (
                  <em className="ct-kh-cham" aria-hidden>
                    {d.truot > 0 && <i data-loai="truot" />}
                    {d.xong > 0 && <i data-loai="xong" />}
                    {d.tong > d.xong + d.truot && (
                      <i data-loai="con" style={{ background: MAU_KHO[d.khoNhat || 2]!.chu }} />
                    )}
                  </em>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Kế hoạch của ngày đang chọn ─── */}
      <div className="ct-kh-ngay-chi">
        <div className="ct-kh-tieu">
          <h3>{ngayDayDu(chon)}</h3>
          <span className="ct-kh-tom">
            {tom
              ? dichP('{xong}/{tong} xong · còn {con}', { xong: tom.xong, tong: tom.tong, con: tom.con })
              : dich('Chưa có việc nào')}
            {phutDaXep > 0 && ` · ${dichP('đã xếp {t}', { t: moTaPhut(phutDaXep) })}`}
          </span>
        </div>

        <div className="ct-kh-ai">
          <button type="button" className="ct-kh-ai-nut" disabled={dangXem || viec.length === 0} onClick={() => void nhoAiXem()}>
            <Sparkles size={14} aria-hidden />
            {dangXem ? dich('Đang xem…') : dich('Nhờ AI xem lại ngày này')}
          </button>
          {nhanXet && <div className="ct-kh-ai-chu">{nhanXet}</div>}
        </div>

        {phutDaXep > 600 && (
          <p className="ct-kh-canh" role="status">
            <AlertTriangle size={14} aria-hidden />
            {dichP('Ngày này đã xếp {t} — nhiều hơn một ngày làm việc. Kế hoạch xa thực tế là nguyên nhân trượt phổ biến nhất.', { t: moTaPhut(phutDaXep) })}
          </p>
        )}
        {chong.length > 0 && (
          <p className="ct-kh-canh" role="status">
            <AlertTriangle size={14} aria-hidden />
            {dichP('{n} cặp việc trùng giờ nhau: {ds}', {
              n: chong.length,
              ds: chong.slice(0, 3).map(([a, b]) => `${a.title} ↔ ${b.title}`).join(' · '),
            })}
          </p>
        )}

        {/* Ô nhập */}
        <div className="ct-kh-them">
          <input
            className="ct-kh-ten"
            value={ten}
            onChange={(e) => datTen(e.target.value)}
            placeholder={dich('Việc cần làm ngày này…')}
            onKeyDown={(e) => { if (e.key === 'Enter' && duChon) void themViec(); }}
          />
          <div className="ct-kh-gio">
            <label>
              <Clock size={13} aria-hidden />
              <input type="time" value={gio} onChange={(e) => datGio(e.target.value)} aria-label={dich('Giờ bắt đầu')} />
            </label>
            <label>
              <input
                type="number" min={5} max={1440} step={5} value={phut}
                onChange={(e) => datPhut(e.target.value)}
                placeholder={dich('phút')} aria-label={dich('Thời lượng (phút)')}
              />
            </label>
          </div>
          <ChonMuc giaTri={kho} datGiaTri={datKho} ten={TEN_KHO} mauTheoMuc nhan={dich('Mức khó')} />
          <ChonMuc giaTri={quanTrong} datGiaTri={datQuanTrong} ten={TEN_QUAN_TRONG} mauTheoMuc={false} nhan={dich('Mức quan trọng')} />
          <textarea
            className="ct-kh-note"
            value={ghiChu}
            onChange={(e) => datGhiChu(e.target.value)}
            placeholder={dich('Ghi chú chi tiết (không bắt buộc)')}
            rows={2}
          />
          <div className="ct-kh-them-duoi">
            <span className="ct-kh-goi">
              {kho > 0 && quanTrong > 0
                ? dichP('Trượt việc này sẽ trừ {n} uy tín.', { n: kho * quanTrong })
                : dich('Chọn mức khó và mức quan trọng để thêm việc.')}
            </span>
            <button type="button" className="ct-btn" disabled={!duChon} onClick={() => void themViec()}>
              {dich('Thêm việc')}
            </button>
          </div>
        </div>

        {loi && <p className="ct-kh-loi" role="alert">{loi}</p>}

        {/* Danh sách việc */}
        {dangTai && viec.length === 0 && <p className="ct-kh-trong">{dich('Đang tải…')}</p>}
        {!dangTai && viec.length === 0 && <p className="ct-kh-trong">{dich('Ngày này chưa có việc nào. Thêm việc đầu tiên ở trên.')}</p>}

        <ul className="ct-kh-ds">
          {xep.map((v) => {
            const tt = trangThai(v);
            const m = MAU_KHO[v.doKho] ?? MAU_KHO[0]!;
            return (
              <li
                key={v.id}
                className="ct-kh-viec"
                data-tt={tt}
                style={{ borderLeftColor: m.vien }}
              >
                <button
                  type="button"
                  className="ct-kh-tick"
                  aria-label={v.done ? dich('Bỏ đánh dấu xong') : dich('Đánh dấu đã xong')}
                  aria-pressed={v.done}
                  onClick={() => void sua(v, { done: !v.done })}
                >
                  {v.done && <Check size={14} aria-hidden />}
                </button>

                <div className="ct-kh-than">
                  <div className="ct-kh-dong1">
                    {v.batDauAt && <time className="ct-kh-luc">{gioMay(v.batDauAt)}</time>}
                    <span className="ct-kh-tieude">{v.title}</span>
                    {v.phutLam ? <span className="ct-kh-dai">{moTaPhut(v.phutLam)}</span> : null}
                  </div>
                  <div className="ct-kh-nhan">
                    <span className="ct-kh-the" style={{ background: m.nen, borderColor: m.vien, color: m.chu }}>
                      {dich(TEN_KHO[v.doKho] ?? 'Chưa chọn')}
                    </span>
                    <span className="ct-kh-the">{dich(TEN_QUAN_TRONG[v.priority] ?? 'Chưa chọn')}</span>
                    {tt === 'truot' && (
                      <span className="ct-kh-the" data-xau>
                        {dichP('Trượt −{n}', { n: v.daTruUyTin ?? v.truNeuTruot })}
                      </span>
                    )}
                    {tt === 'dangLam' && (
                      <span className="ct-kh-the" data-mo>{dichP('Trượt sẽ −{n}', { n: v.truNeuTruot })}</span>
                    )}
                    {v.soLanHoan > 0 && (
                      <span className="ct-kh-the" data-mo>{dichP('đã dời {n} lần', { n: v.soLanHoan })}</span>
                    )}
                  </div>
                  {v.note && <p className="ct-kh-ghi">{v.note}</p>}
                </div>

                <div className="ct-kh-nut">
                  <button type="button" onClick={() => void doiNgay(v)} title={dich('Dời sang ngày mai (không bị trừ điểm)')} aria-label={dich('Dời sang ngày mai')}>
                    <RotateCcw size={14} aria-hidden />
                  </button>
                  <button type="button" onClick={() => void xoa(v)} title={dich('Xoá việc')} aria-label={dich('Xoá việc')}>
                    <Trash2 size={14} aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
