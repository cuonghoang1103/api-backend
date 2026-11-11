'use client';

/**
 * KHUNG CHUNG của phòng làm bài kiểu thi trên máy tính (12/11/2026) — dùng cho Reading / Listening / Writing.
 * ─────────────────────────────────────────────────────────────────────────
 *  Thanh trên: 👤 thí sinh (tên tài khoản / "Candidate") · đồng hồ ở GIỮA "34 minutes left" (≤ 5′ đổi màu, ≤ 1′ nhấp nháy nhẹ)
 *              · Settings (cỡ chữ Standard/Large/Extra large · bảng màu Black on white / White on black / Yellow on black)
 *              · Help (hướng dẫn thao tác) · Hide (ẩn đồng hồ) · Thoát (có xác nhận) · Submit.
 *  Hộp thoại: Settings · Help · Xác nhận nộp (liệt kê câu chưa trả lời + câu cắm cờ, bấm số là nhảy tới) · Xác nhận thoát.
 *  Màn làm bài phủ TOÀN màn hình (cdt.module.css `.thi` inset 0, z-index trên thanh menu web) — không còn menu web/MenuTren.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLangUser } from '@/components/language/primitives';
import { CO_CHU, type MauThi, type TuyChon } from '../chung/MenuTren';
import { conChu, dinhDangGio } from './cham';
import s from '../chung/cdt.module.css';

/** Tên thí sinh hiện trên thanh trên: displayName → fullName → username → "Candidate". */
export function useTenThiSinh(): string {
  const { user } = useLangUser();
  const u = user as { displayName?: string; fullName?: string; username?: string } | null;
  return u?.displayName || u?.fullName || u?.username || 'Candidate';
}

/** Đồng hồ: `con` giây còn lại (null = không giới hạn), `daQua` giây đã làm; hết giờ gọi `onHetGio` đúng một lần. */
export function useDongHo(batDau: number, hetLuc: number | null, dung: boolean, onHetGio?: () => void) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { if (dung) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [dung]);
  const con = hetLuc ? Math.max(0, Math.round((hetLuc - now) / 1000)) : null;
  const daQua = Math.round((now - batDau) / 1000);
  const ref = useRef(onHetGio);
  ref.current = onHetGio;
  const daBao = useRef(false);
  useEffect(() => {
    if (dung || con == null) return;
    if (con === 0 && !daBao.current) { daBao.current = true; ref.current?.(); }
  }, [con, dung]);
  return { con, daQua, now };
}

type Props = {
  tenBai: string;
  kyNang: 'Listening' | 'Reading' | 'Writing';
  cheDo: string;
  con: number | null;
  daQua: number;
  xem?: boolean;
  tc: TuyChon;
  doi: (p: Partial<TuyChon>) => void;
  onThoat: () => void;
  onNop?: () => void;
  /** Nút thêm (📝 ghi chú, 🔊 âm lượng…). */
  them?: ReactNode;
  /** Dòng phụ cạnh đồng hồ ("đang phát Part 2"). */
  phu?: ReactNode;
  help: ReactNode;
};

export function ThanhThi({ tenBai, kyNang, cheDo, con, daQua, xem, tc, doi, onThoat, onNop, them, phu, help }: Props) {
  const ten = useTenThiSinh();
  const [anGio, setAnGio] = useState(false);
  const [hop, setHop] = useState<null | 'caiDat' | 'help' | 'thoat'>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setHop(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const gap = con != null && con <= 300;
  const gapLam = con != null && con <= 60;
  return (
    <>
      <header className={s.thiTren}>
        <div className={s.thiSinh}>
          <span className={s.thiSinhTen} title="Thí sinh">👤 {ten}</span>
          <span className={s.tenThi}>IELTS {kyNang} · {tenBai}</span>
          <span className={s.cheDoThi}>{cheDo}</span>
        </div>
        <div className={`${s.dongHoGiua} ${anGio ? s.dongHoAn : ''} ${gap && !anGio ? s.dongHoGap : ''} ${gapLam && !anGio ? s.dongHoNhay : ''}`} role="timer" aria-live="off" aria-label="Thời gian còn lại">
          <span className={s.dongHoChu}>
            {xem ? `Reviewed · ${dinhDangGio(daQua)}` : anGio ? 'Timer hidden' : con != null ? conChu(con) : `${dinhDangGio(daQua)} elapsed`}
          </span>
          {phu && <span className={s.dongHoPhu}>{phu}</span>}
        </div>
        <div className={s.thiDieuKhien}>
          {them}
          <button type="button" className={s.iconBtn} onClick={() => setHop((h) => (h === 'caiDat' ? null : 'caiDat'))} aria-expanded={hop === 'caiDat'} title="Cỡ chữ, bảng màu">⚙ Settings</button>
          <button type="button" className={s.iconBtn} onClick={() => setHop((h) => (h === 'help' ? null : 'help'))} aria-expanded={hop === 'help'} title="Hướng dẫn thao tác">? Help</button>
          {!xem && <button type="button" className={s.iconBtn} onClick={() => setAnGio((v) => !v)} aria-pressed={anGio} title={anGio ? 'Hiện đồng hồ' : 'Ẩn đồng hồ'}>{anGio ? 'Show' : 'Hide'}</button>}
          {xem ? (
            <button type="button" className={s.nop} onClick={onThoat}>Đóng xem lại</button>
          ) : (
            <>
              <button type="button" className={s.iconBtn} onClick={() => setHop('thoat')} title="Thoát phòng thi (bài được lưu)">Thoát</button>
              {onNop && <button type="button" className={s.nop} onClick={onNop}>Submit</button>}
            </>
          )}
        </div>
      </header>
      {hop === 'caiDat' && <BangCaiDat tc={tc} doi={doi} dong={() => setHop(null)} />}
      {hop === 'help' && <HopThoai tieuDe="Help — hướng dẫn thao tác" dong={() => setHop(null)} rong>{help}</HopThoai>}
      {hop === 'thoat' && (
        <HopThoai tieuDe="Thoát phòng thi?" dong={() => setHop(null)}>
          <p className={s.mo} style={{ margin: '0 0 12px' }}>Bài đang làm được <b>tự lưu trên máy này</b>. Mở lại trung tâm luyện thi sẽ hỏi “Tiếp tục bài đang làm?”. Đồng hồ vẫn chạy như thi thật.</p>
          <div className={s.hangNut}>
            <button type="button" className={s.nutPhu} onClick={() => setHop(null)}>Làm tiếp</button>
            <button type="button" className={s.nop} onClick={() => { setHop(null); onThoat(); }}>Thoát</button>
          </div>
        </HopThoai>
      )}
    </>
  );
}

/** Hộp thoại giữa màn (nền mờ, Esc đóng). */
export function HopThoai({ tieuDe, children, dong, rong }: { tieuDe: string; children: ReactNode; dong: () => void; rong?: boolean }) {
  return (
    <div className={s.phuMo} onMouseDown={(e) => { if (e.target === e.currentTarget) dong(); }}>
      <div className={`${s.hopThoai} ${rong ? s.hopThoaiRong : ''}`} role="dialog" aria-modal="true" aria-label={tieuDe}>
        <div className={s.hopThoaiDau}>
          <b>{tieuDe}</b>
          <button type="button" className={s.iconBtn} onClick={dong} aria-label="Đóng">✕</button>
        </div>
        <div className={s.hopThoaiThan}>{children}</div>
      </div>
    </div>
  );
}

const MAU: { id: MauThi; ten: string; mo: string }[] = [
  { id: 'bw', ten: 'Black on white', mo: 'Chuẩn phòng thi' },
  { id: 'wb', ten: 'White on black', mo: 'Dịu mắt khi làm lâu' },
  { id: 'yb', ten: 'Yellow on black', mo: 'Tương phản cao' },
];

export function BangCaiDat({ tc, doi, dong }: { tc: TuyChon; doi: (p: Partial<TuyChon>) => void; dong: () => void }) {
  return (
    <HopThoai tieuDe="Settings" dong={dong}>
      <p className={s.caiDatNhan}>Text size — cỡ chữ (bài đọc + câu hỏi)</p>
      <div className={s.caiDatHang} role="radiogroup" aria-label="Cỡ chữ">
        {CO_CHU.map((c) => (
          <button key={c.id} type="button" role="radio" aria-checked={tc.co === c.co} className={`${s.caiDatNut} ${tc.co === c.co ? s.caiDatOn : ''}`} onClick={() => doi({ co: c.co })} style={{ fontSize: Math.min(18, c.co) }}>{c.ten}</button>
        ))}
      </div>
      <p className={s.caiDatNhan}>Colour — bảng màu</p>
      <div className={s.caiDatHang} role="radiogroup" aria-label="Bảng màu">
        {MAU.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={tc.mau === m.id} className={`${s.caiDatNut} ${s[`mau_${m.id}`]} ${tc.mau === m.id ? s.caiDatOn : ''}`} onClick={() => doi({ mau: m.id })}>
            <b>{m.ten}</b><span>{m.mo}</span>
          </button>
        ))}
      </div>
      <div className={s.caiDatHang} style={{ marginTop: 6 }}>
        <button type="button" className={`${s.caiDatNut} ${tc.mau === 'auto' ? s.caiDatOn : ''}`} onClick={() => doi({ mau: 'auto', toi: null })}>Theo giao diện web (sáng/tối)</button>
        <button type="button" className={`${s.caiDatNut} ${tc.serif ? s.caiDatOn : ''}`} onClick={() => doi({ serif: !tc.serif })} style={{ fontFamily: tc.serif ? 'Georgia, serif' : undefined }}>Chữ có chân (bài đọc)</button>
      </div>
      <p className={s.mo} style={{ margin: '12px 0 0' }}>Cài đặt nhớ trên máy, áp cho mọi phòng thi. Phím tắt: <kbd className={s.phim}>Esc</kbd> đóng.</p>
    </HopThoai>
  );
}

/** Xác nhận nộp: liệt kê câu chưa trả lời + câu cắm cờ; bấm số để nhảy tới. */
export function HoiNop({ chuaLam, co, tong, toiCau, dong, nop, dongThem }: {
  chuaLam: number[]; co: number[]; tong: number; toiCau?: (n: number) => void; dong: () => void; nop: () => void; dongThem?: ReactNode;
}) {
  const So = ({ n, lop }: { n: number; lop?: string }) => (
    <button type="button" className={`${s.oSo} ${lop ?? ''}`} style={{ display: 'inline-grid', placeItems: 'center' }} onClick={() => { dong(); toiCau?.(n); }} aria-label={`Tới câu ${n}`}>{n}</button>
  );
  return (
    <HopThoai tieuDe="Submit — nộp bài?" dong={dong}>
      {dongThem}
      <p style={{ margin: '0 0 8px', fontSize: 14.5 }}>
        {chuaLam.length === 0 ? <>Bạn đã trả lời đủ <b>{tong}</b> câu.</> : <>Còn <b style={{ color: 'var(--c-red)' }}>{chuaLam.length}</b>/{tong} câu chưa trả lời:</>}
      </p>
      {chuaLam.length > 0 && <div className={s.dsSo}>{chuaLam.map((n) => <So key={n} n={n} />)}</div>}
      {co.length > 0 && (
        <>
          <p style={{ margin: '10px 0 8px', fontSize: 14.5 }}>Câu đang cắm cờ <b>Review</b> ({co.length}):</p>
          <div className={s.dsSo}>{co.map((n) => <So key={n} n={n} lop={s.oSoCo} />)}</div>
        </>
      )}
      <p className={s.mo} style={{ margin: '12px 0 12px' }}>Nộp rồi không sửa được — như thi thật. Hết giờ hệ thống tự nộp.</p>
      <div className={s.hangNut}>
        <button type="button" className={s.nutPhu} onClick={dong}>Làm tiếp</button>
        <button type="button" className={s.nop} onClick={nop}>Submit</button>
      </div>
    </HopThoai>
  );
}

/** Nội dung Help cho từng kỹ năng (EN ngắn + VI). */
export function HelpNoiDung({ kyNang }: { kyNang: 'doc' | 'nghe' | 'viet' }) {
  return (
    <div className={s.help}>
      <h3>Navigation · Điều hướng</h3>
      <ul>
        <li>Thanh dưới: bấm <b>Part / Passage</b> để đổi phần; ô số câu: <i>xám</i> = đã trả lời, <i>viền đậm</i> = đang ở, <i>góc cam</i> = cờ Review.</li>
        <li>Phím <kbd className={s.phim}>←</kbd> <kbd className={s.phim}>→</kbd> (hoặc <kbd className={s.phim}>Alt</kbd>+←/→ khi đang gõ) đổi câu · <kbd className={s.phim}>Tab</kbd> sang ô kế · <kbd className={s.phim}>Alt</kbd>+<kbd className={s.phim}>F</kbd> cắm cờ Review · <kbd className={s.phim}>Esc</kbd> đóng hộp thoại.</li>
      </ul>
      {kyNang !== 'viet' && (
        <>
          <h3>Highlight &amp; Notes · Tô sáng, ghi chú</h3>
          <ul>
            <li>Bôi chọn chữ trong bài đọc rồi <b>chuột phải</b> (hoặc thả chuột) → <b>Highlight</b> / <b>Note</b>. Bấm vào chỗ đã tô → sửa ghi chú / <b>Clear</b>.</li>
            <li>Nút 📝 trên thanh trên mở bảng ghi chú; <b>Clear all</b> xoá mọi tô sáng của phần đang xem.</li>
          </ul>
        </>
      )}
      {kyNang === 'nghe' && (
        <>
          <h3>Listening</h3>
          <ul>
            <li>Chế độ thi: băng phát <b>một lần</b>, liền 4 Part, có thời gian đọc câu hỏi; không dừng, không tua. Chỉnh 🔊 âm lượng bất cứ lúc nào.</li>
            <li>Hết băng: <b>2 phút</b> kiểm tra lại đáp án (đồng hồ riêng) rồi tự nộp. Chế độ Practice: phát từng Part, tua từng câu thoại, chỉnh tốc độ.</li>
          </ul>
        </>
      )}
      {kyNang === 'doc' && (
        <>
          <h3>Reading</h3>
          <ul>
            <li>Kéo thanh giữa để đổi độ rộng bài đọc | câu hỏi (phím ←/→ khi thanh đang được chọn). Cửa sổ hẹp: hai tab “Bài đọc / Câu hỏi”.</li>
            <li>Dạng nối (headings, features…): kéo thả lựa chọn vào ô hoặc chọn trong ô. Nhiều đáp án: tick đúng số lượng.</li>
          </ul>
        </>
      )}
      {kyNang === 'viet' && (
        <>
          <h3>Writing</h3>
          <ul>
            <li>Đếm từ cập nhật khi gõ; dưới số từ tối thiểu (150 / 250) hiện cảnh báo đỏ. Không có kiểm tra chính tả — như phòng thi thật.</li>
            <li>Nút <b>Cut / Copy / Paste</b> trên ô viết (hoặc phím tắt hệ thống). Task 1 / Task 2 đổi ở thanh dưới; đồng hồ chung 60′, gợi ý 20′ + 40′.</li>
          </ul>
        </>
      )}
      <h3>Settings · Hide · Submit</h3>
      <ul>
        <li><b>Settings</b>: cỡ chữ Standard / Large / Extra large; bảng màu Black on white · White on black · Yellow on black.</li>
        <li><b>Hide</b> ẩn đồng hồ (≤ 5 phút tự hiện lại cảnh báo). <b>Submit</b> hiện danh sách câu chưa trả lời + câu cắm cờ trước khi nộp.</li>
        <li><b>Thoát</b>: bài tự lưu trên máy; mở lại sẽ hỏi “Tiếp tục bài đang làm?”.</li>
      </ul>
    </div>
  );
}
