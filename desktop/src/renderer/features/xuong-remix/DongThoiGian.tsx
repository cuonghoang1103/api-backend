/**
 * ============================================================
 * DÒNG THỜI GIAN — cắt nhiều bài, xếp lại thành một bản mashup
 * ============================================================
 *
 * Tới trước khối này Xưởng Remix làm được mọi thứ trên MỘT bài. Đây là chỗ
 * nhiều bài gặp nhau: nạp vài bài, cắt lấy đoạn hay, kéo tất cả về cùng một
 * nhịp và một tông, xếp chồng lên nhau, rồi kết xuất thành một track.
 *
 * ─── Một LÀN cho mỗi BÀI ───
 * Không cho người dùng tự chọn làn. Làn suy ra từ bài nguồn, theo thứ tự bài
 * xuất hiện lần đầu. Được hai thứ: đọc đúng cách người ta nghĩ về một bản
 * mashup ("chỗ này bài A hát, chỗ kia bài B vào"), và KHÔNG có thêm một
 * trường dữ liệu nào để lệch giữa thứ vẽ ra và thứ gửi xuống bộ dựng.
 *
 * ─── Kéo thì cập nhật NGAY, không đợi thả ───
 * Mảnh phải đi theo chuột. Vẽ lại một mảnh là vẽ lại một `div` — rẻ hơn nhiều
 * so với cái giá của việc kéo một thứ không bám tay.
 *
 * ─── Bắt nhịp theo GIÂY, không theo điểm ảnh ───
 * Xem chú thích trong `hinhDong.ts`. Bắt theo điểm ảnh thì cùng một thao
 * tác ra hai kết quả khác nhau tuỳ mức phóng to.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { Loader2, Plus, Scissors, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import type { BaiTrongKho, KetQuaDungRa, ManhDung } from '../../../shared/ipc';
import { useDich } from '../../i18n';
import { KetQuaAmThanh } from './KetQuaAmThanh';
import {
  batNhip, catPhai, catTrai, daiTrenDong, giayMoiO, khungManh, lanTheoBai,
  soO, tiLeKeo, vachLuoi,
} from './hinhDong';

/** Màu theo ĐƯỜNG, giống bàn làm việc và bàn trộn. */
const MAU: Record<string, string> = {
  goc: 'rgba(148,163,184,0.9)',
  drums: 'rgba(248,150,110,0.9)',
  bass: 'rgba(250,204,21,0.9)',
  other: 'rgba(129,140,248,0.9)',
  vocals: 'rgba(74,222,128,0.9)',
};

const NHAN_DUONG: Record<string, string> = {
  goc: 'Bản gốc', drums: 'Trống', bass: 'Bass', other: 'Nhạc nền', vocals: 'Giọng hát',
};

const CAO_LAN = 56;
const PHONG = [4, 8, 16, 32, 64, 128] as const;
const CHIA = [
  { gia: 1, nhan: 'Ô' },
  { gia: 4, nhan: '1/4' },
  { gia: 16, nhan: '1/16' },
  { gia: 0, nhan: 'Tắt' },
] as const;

interface Props {
  kho: BaiTrongKho[];
  dangTaiKho: boolean;
  onLamMoiKho: () => void;
}

type CheDoKeo = { manhId: string; kieu: 'dat' | 'trai' | 'phai'; x: number; goc: ManhDung };

export function DongThoiGian({ kho, dangTaiKho, onLamMoiKho }: Props) {
  const { dich } = useDich();
  const cau = window.cuongthai;

  const [bpm, setBpm] = useState(128);
  const [chuAm, setChuAm] = useState<number | null>(null);
  const [manh, setManh] = useState<ManhDung[]>([]);
  const [chon, setChon] = useState<string | null>(null);
  const [phong, setPhong] = useState(16);
  const [chia, setChia] = useState(1);
  const [dangDung, setDangDung] = useState(false);
  const [ra, setRa] = useState<KetQuaDungRa | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  const keoRef = useRef<CheDoKeo | null>(null);
  const dongRef = useRef<HTMLDivElement | null>(null);

  const baiTheoId = useMemo(() => {
    const m: Record<string, BaiTrongKho> = {};
    for (const b of kho) m[b.id] = b;
    return m;
  }, [kho]);

  const tiLeCua = useCallback(
    (m: ManhDung) => tiLeKeo(baiTheoId[m.baiId]?.bpm ?? 0, bpm),
    [baiTheoId, bpm],
  );

  const daiTong = useMemo(() => {
    let het = giayMoiO(bpm) * 8;   // luôn chừa 8 ô trống để còn chỗ thả mảnh
    for (const m of manh) het = Math.max(het, m.datGiay + daiTrenDong(m, tiLeCua(m)));
    return het;
  }, [manh, bpm, tiLeCua]);

  const lan = useMemo(() => lanTheoBai(manh), [manh]);

  const suaManh = useCallback((id: string, thay: (m: ManhDung) => ManhDung) => {
    setManh((ds) => ds.map((m) => (m.id === id ? thay(m) : m)));
    setRa(null);
  }, []);

  const themManh = useCallback((b: BaiTrongKho, nguon: string) => {
    /* Thả vào CUỐI bản dựng, bắt về ô. Thả ở giây 0 thì mảnh mới nằm chồng
       lên mảnh đầu và người dùng phải kéo nó ra trước khi làm được gì. */
    const dat = batNhip(daiTong, bpm, chia || 1);
    setManh((ds) => [...ds, {
      id: `m${Date.now().toString(36)}${ds.length}`,
      baiId: b.id,
      nguon,
      tuGiay: 0,
      /* Mặc định 8 ô, hoặc cả bài nếu bài ngắn hơn. Cả bài 5 phút làm mặc
         định thì mảnh đầu tiên đã dài hơn màn hình và không thấy gì khác. */
      denGiay: Math.min(b.giay, giayMoiO(bpm) * 8 / tiLeKeo(b.bpm, bpm)),
      datGiay: dat,
      gainDb: 0,
      vaoGiay: 0,
      raGiay: 0,
    }]);
    setRa(null);
  }, [daiTong, bpm, chia]);

  const xoaManh = useCallback((id: string) => {
    setManh((ds) => ds.filter((m) => m.id !== id));
    setChon((c) => (c === id ? null : c));
    setRa(null);
  }, []);

  /* ── Kéo ─────────────────────────────────────────────── */

  const batKeo = useCallback((e: React.PointerEvent, m: ManhDung, kieu: CheDoKeo['kieu']) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    keoRef.current = { manhId: m.id, kieu, x: e.clientX, goc: m };
    setChon(m.id);
  }, []);

  const diKeo = useCallback((e: React.PointerEvent) => {
    const k = keoRef.current;
    if (!k) return;
    const dGiay = (e.clientX - k.x) / phong;
    const tl = tiLeCua(k.goc);
    if (k.kieu === 'dat') {
      const dat = batNhip(k.goc.datGiay + dGiay, bpm, e.altKey ? 0 : chia);
      suaManh(k.manhId, (m) => ({ ...m, datGiay: dat }));
      return;
    }
    const daiBai = baiTheoId[k.goc.baiId]?.giay ?? k.goc.denGiay;
    suaManh(k.manhId, () => (k.kieu === 'trai'
      ? catTrai(k.goc, dGiay, tl)
      : catPhai(k.goc, dGiay, tl, daiBai)));
  }, [phong, bpm, chia, tiLeCua, suaManh, baiTheoId]);

  const thaKeo = useCallback((e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    keoRef.current = null;
  }, []);

  /* ── Dựng ────────────────────────────────────────────── */

  const dung = useCallback(async () => {
    if (!cau || manh.length === 0) return;
    setDangDung(true);
    setLoi(null);
    try {
      setRa(await cau.xuongRemix.dungMashup({ bpm, chuAm, manh }));
    } catch (e) {
      setLoi((e as Error).message);
      setRa(null);
    } finally {
      setDangDung(false);
    }
  }, [cau, bpm, chuAm, manh]);

  const dangChon = manh.find((m) => m.id === chon) ?? null;
  const luoi = vachLuoi(daiTong, bpm, phong);

  return (
    <div className="ct-xr-dtg">
      {/* ── Thanh điều khiển ────────────────────────── */}
      <div className="ct-xr-dtg-thanh">
        <label className="ct-xr-dtg-o">
          <span>{dich('Nhịp chung')}</span>
          <input type="number" min={40} max={300} step={1} value={bpm}
            onChange={(e) => { setBpm(Number(e.target.value) || 128); setRa(null); }} />
          <em>BPM</em>
        </label>

        <label className="ct-xr-dtg-o">
          <span>{dich('Tông chung')}</span>
          <select
            value={chuAm === null ? '' : String(chuAm)}
            onChange={(e) => {
              setChuAm(e.target.value === '' ? null : Number(e.target.value));
              setRa(null);
            }}
          >
            {/* "Giữ nguyên" là mặc định CÓ CHỦ Ý. Dò tông chỉ đúng khoảng một
                nửa số lần (xem `nhipVaTong.ts`), nên tự động dịch tông mọi
                mảnh theo một phép dò nửa đúng là cách chắc chắn làm hỏng bài
                mà người dùng không hiểu vì sao. */}
            <option value="">{dich('Giữ nguyên')}</option>
            {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((t, i) => (
              <option key={t} value={i}>{t}</option>
            ))}
          </select>
        </label>

        <label className="ct-xr-dtg-o">
          <span>{dich('Bắt nhịp')}</span>
          <select value={chia} onChange={(e) => setChia(Number(e.target.value))}>
            {CHIA.map((c) => <option key={c.nhan} value={c.gia}>{c.nhan}</option>)}
          </select>
        </label>

        <div className="ct-xr-dtg-phong">
          <button type="button" className="ct-xr-x" aria-label={dich('Thu nhỏ')}
            disabled={phong <= PHONG[0]}
            onClick={() => setPhong((p) => PHONG[Math.max(0, PHONG.indexOf(p as 16) - 1)]!)}>
            <ZoomOut size={14} aria-hidden />
          </button>
          <button type="button" className="ct-xr-x" aria-label={dich('Phóng to')}
            disabled={phong >= PHONG[PHONG.length - 1]!}
            onClick={() => setPhong((p) => PHONG[Math.min(PHONG.length - 1, PHONG.indexOf(p as 16) + 1)]!)}>
            <ZoomIn size={14} aria-hidden />
          </button>
        </div>

        <button type="button" className="ct-btn" disabled={dangDung || manh.length === 0}
          onClick={() => void dung()}>
          {dangDung ? <Loader2 size={14} className="ct-xoay" aria-hidden />
                    : <Scissors size={14} aria-hidden />}
          {dangDung ? dich('Đang dựng…') : dich('Dựng bản')}
        </button>
      </div>

      {/* ── Kho bài ─────────────────────────────────── */}
      <div className="ct-xr-dtg-kho">
        <span className="ct-xr-nhan">{dich('Các bài đang mở')}</span>
        {dangTaiKho && <Loader2 size={13} className="ct-xoay" aria-hidden />}
        {kho.length === 0 && !dangTaiKho && (
          <span className="ct-muted">
            {dich('Chưa có bài nào. Thả tệp nhạc ở trên rồi quay lại đây.')}{' '}
            <button type="button" className="ct-linklike" onClick={onLamMoiKho}>
              {dich('Xem lại')}
            </button>
          </span>
        )}
        {kho.map((b) => (
          <div key={b.id} className="ct-xr-dtg-bai">
            <b title={b.ten}>{b.ten}</b>
            <code>{b.bpm > 0 ? `${b.bpm.toFixed(0)} BPM` : '— BPM'} · {b.tongCamelot || '—'}</code>
            {/* `.ct-xr-dtg-nut`, KHÔNG dùng lại `.ct-xr-tag`: lớp kia là nút
                VUÔNG 22px cho chữ S và cái loa ở đầu dải track. Nhét nhãn
                "Nhạc nền" vào một ô rộng cố định 22px thì các chip đè lên
                nhau — mà cả `tsc` lẫn bộ đo tràn đều không thấy, vì không có
                gì tràn ra ngoài CỘT: chúng chỉ chồng lên chính mình. Chỉ nhìn
                ảnh chụp mới ra. */}
            <div className="ct-xr-dtg-them">
              {b.duong.map((d) => (
                <button key={d} type="button" className="ct-xr-dtg-nut"
                  style={{ borderColor: MAU[d] }}
                  onClick={() => themManh(b, d)}
                  title={`${dich('Thêm mảnh')} — ${dich(NHAN_DUONG[d] ?? d)}`}>
                  <Plus size={10} aria-hidden />{' '}
                  {dich(NHAN_DUONG[d] ?? d)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Dòng thời gian ──────────────────────────── */}
      <div className="ct-xr-dtg-cuon">
        <div className="ct-xr-dtg-dong" ref={dongRef}
          style={{ width: Math.max(320, daiTong * phong) }}
          onPointerMove={diKeo} onPointerUp={thaKeo} onPointerCancel={thaKeo}>

          <div className="ct-xr-dtg-thuoc">
            {luoi.map((t) => (
              <span key={t} style={{ left: t * phong }}>{soO(t, bpm)}</span>
            ))}
          </div>

          {lan.length === 0 && (
            <p className="ct-xr-dtg-rong">
              {dich('Bấm một đường ở trên để thả mảnh đầu tiên xuống đây.')}
            </p>
          )}

          {lan.map((baiId) => (
            <div key={baiId} className="ct-xr-dtg-lan" style={{ height: CAO_LAN }}>
              <span className="ct-xr-dtg-lan-ten">{baiTheoId[baiId]?.ten ?? baiId}</span>
              {luoi.map((t) => (
                <i key={t} className="ct-xr-dtg-vach" style={{ left: t * phong }} />
              ))}
              {manh.filter((m) => m.baiId === baiId).map((m) => {
                const k = khungManh(m, tiLeCua(m), phong);
                return (
                  <div
                    key={m.id}
                    className="ct-xr-dtg-manh"
                    data-chon={m.id === chon ? '1' : undefined}
                    style={{ left: k.trai, width: k.rong, background: MAU[m.nguon] }}
                    onPointerDown={(e) => batKeo(e, m, 'dat')}
                    onPointerMove={diKeo}
                    onPointerUp={thaKeo}
                    onPointerCancel={thaKeo}
                  >
                    <span className="ct-xr-dtg-manh-ten">{dich(NHAN_DUONG[m.nguon] ?? m.nguon)}</span>
                    {/* Tay nắm hai mép. `stopPropagation` trong `batKeo` giữ cho
                        cú bấm vào mép không rơi xuống thân mảnh và biến thành
                        thao tác DI CHUYỂN. */}
                    <i className="ct-xr-dtg-mep trai"
                      onPointerDown={(e) => batKeo(e, m, 'trai')}
                      onPointerMove={diKeo} onPointerUp={thaKeo} />
                    <i className="ct-xr-dtg-mep phai"
                      onPointerDown={(e) => batKeo(e, m, 'phai')}
                      onPointerMove={diKeo} onPointerUp={thaKeo} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Chi tiết mảnh đang chọn ─────────────────── */}
      {dangChon && (
        <div className="ct-xr-dtg-chitiet">
          <span className="ct-xr-nhan">
            {baiTheoId[dangChon.baiId]?.ten ?? dangChon.baiId}
            {' · '}{dich(NHAN_DUONG[dangChon.nguon] ?? dangChon.nguon)}
          </span>
          {([
            ['Cắt từ', 'tuGiay', 0, 3600, 0.1, 's'],
            ['Cắt đến', 'denGiay', 0, 3600, 0.1, 's'],
            ['Đặt ở', 'datGiay', 0, 3600, 0.1, 's'],
            ['Mức', 'gainDb', -48, 12, 0.5, 'dB'],
            ['Fade vào', 'vaoGiay', 0, 60, 0.1, 's'],
            ['Fade ra', 'raGiay', 0, 60, 0.1, 's'],
          ] as const).map(([nhan, khoa, min, max, buoc, dv]) => (
            <label key={khoa} className="ct-xr-dtg-o">
              <span>{dich(nhan)}</span>
              <input type="number" min={min} max={max} step={buoc}
                value={Number(dangChon[khoa].toFixed(2))}
                onChange={(e) => suaManh(dangChon.id, (m) => ({
                  ...m, [khoa]: Number(e.target.value) || 0,
                }))} />
              <em>{dv}</em>
            </label>
          ))}
          <button type="button" className="ct-btn ct-btn-ghost"
            onClick={() => xoaManh(dangChon.id)}>
            <Trash2 size={14} aria-hidden />
            {dich('Xoá mảnh')}
          </button>
        </div>
      )}

      {loi && <p className="ct-xr-ngo" data-tone="loi">{loi}</p>}

      {ra && (
        <div className="ct-xr-tron-ra">
          {ra.dinhTruoc > 1 && (
            <p className="ct-xr-ngo" data-tone="canh">
              ⚠️ {dich('Các mảnh cộng lại vượt trần')} {((ra.dinhTruoc - 1) * 100).toFixed(0)}%
              {' — '}{dich('bộ hạn biên đã ghì xuống. Hạ mức vài mảnh thì sạch hơn.')}
            </p>
          )}
          {ra.boQua.length > 0 && (
            <p className="ct-xr-ngo" data-tone="canh">
              {dich('Bỏ qua')} {ra.boQua.length} {dich('mảnh')}:{' '}
              {ra.boQua.map((b) => b.viSao).join(' · ')}
            </p>
          )}
          <p className="ct-muted">
            {ra.daDung.length} {dich('mảnh')} · {ra.daiGiay.toFixed(1)}s
            {' · '}{dich('độ to')} {ra.lufs.toFixed(1)} LUFS
            {' · '}{dich('đỉnh thật')} {ra.dinhThat.toFixed(1)} dBTP
            {' · '}{ra.giay.toFixed(1)}s
          </p>
          <KetQuaAmThanh duong={ra.duong} bpm={bpm} />
        </div>
      )}
    </div>
  );
}
