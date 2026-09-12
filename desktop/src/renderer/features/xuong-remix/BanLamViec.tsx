/**
 * ============================================================
 * BÀN LÀM VIỆC — transport, dải track, nghe từng stem
 * ============================================================
 *
 * Trước bản này, Xưởng Remix là một trang giấy: đọc số rồi bấm nút. Không có
 * chỗ nào NGHE, và không có chỗ nào NHÌN ra hình dạng bài hát. Mà khi làm nhạc
 * thì hai thứ đó là công việc, phần còn lại chỉ là thiết lập.
 *
 * ─── Vì sao tiếng chỉ được nạp khi bấm PHÁT ───
 * Bốn stem của một bài 5 phút, sau khi giải mã ra AudioBuffer, là ~424 MB. Nạp
 * sẵn lúc mở bàn làm việc thì người chỉ muốn xem số đo cũng phải trả ngần ấy
 * RAM. Dạng sóng thì nạp ngay — nó chỉ vài KB, và nó mới là thứ cần nhìn
 * trước.
 *
 * ─── Vì sao con trỏ chạy bằng requestAnimationFrame chứ không setInterval ───
 * `setInterval` vẫn chạy khi cửa sổ bị ẩn, và nó không khớp với nhịp vẽ màn
 * hình nên con trỏ giật. rAF tự ngủ khi cửa sổ ẩn — đúng thứ ta muốn.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Pause, Play, SkipBack, Volume2, VolumeX } from 'lucide-react';
import type { KetQuaPhanTich, SongAmThanh } from '../../../shared/ipc';
import { useDich } from '../../i18n';
import { MayPhatStem } from './mayPhat';
import { Song } from './Song';
import { DongHoMuc } from './DongHoMuc';

/** Thứ tự dải trên bàn: giống thứ tự người ta xếp track trong DAW. */
const DAI = [
  { ma: 'goc', nhan: 'Bản gốc', mau: 'rgba(148,163,184,0.85)' },
  { ma: 'drums', nhan: 'Trống', mau: 'rgba(248,150,110,0.9)' },
  { ma: 'bass', nhan: 'Bass', mau: 'rgba(250,204,21,0.9)' },
  { ma: 'other', nhan: 'Nhạc nền', mau: 'rgba(129,140,248,0.9)' },
  { ma: 'vocals', nhan: 'Giọng hát', mau: 'rgba(74,222,128,0.9)' },
] as const;

const SO_COT = 1400;

interface Props {
  id: string;
  giay: number;
  /**
   * Ô để TRANG giữ máy phát.
   *
   * Máy phát sinh ra ở đây, nhưng bàn trộn ở dưới cũng cần nó — đồng hồ mức
   * của nó đọc chính tiếng đang phát. Cho trang giữ cái ô thì hai khối dùng
   * chung MỘT máy phát; dựng máy thứ hai thì hai bản nhạc chạy chồng nhau.
   */
  mayRef: React.MutableRefObject<MayPhatStem | null>;
  pt: KetQuaPhanTich | null;
  /** Đường WAV bản gốc — thứ nghe được khi chưa tách. */
  tepGoc: string;
  /** Đường dẫn WAV từng stem. Rỗng khi chưa tách. */
  tepStem: Record<string, string>;
  /** Đỉnh hiện thời của một đường; `null` khi không có gì đang phát. */
  docDinh: (ma: string) => number | null;
}

function dongHo(giay: number): string {
  const p = Math.floor(giay / 60);
  const s = Math.floor(giay % 60);
  const t = Math.floor((giay % 1) * 10);
  return `${p}:${String(s).padStart(2, '0')}.${t}`;
}

export function BanLamViec({ id, giay, pt, tepGoc, tepStem, mayRef, docDinh }: Props) {
  const { dich } = useDich();
  const cau = window.cuongthai;

  const [song, setSong] = useState<SongAmThanh | null>(null);
  const [dangNapTieng, setDangNapTieng] = useState(false);
  const [dangPhat, setDangPhat] = useState(false);
  const [viTri, setViTri] = useState(0);
  const [solo, setSolo] = useState<string | null>(null);
  const [tat, setTat] = useState<Record<string, boolean>>({});
  const [muc, setMuc] = useState<Record<string, number>>({});
  const [loi, setLoi] = useState<string | null>(null);

  const khungRef = useRef(0);

  /* Dạng sóng: xin ngay, và xin lại khi có thêm stem. Vài KB, không đáng chờ. */
  useEffect(() => {
    let con = true;
    void (async () => {
      try {
        const s = await cau?.xuongRemix.song(id, SO_COT);
        if (con && s) setSong(s);
      } catch (e) {
        if (con) setLoi((e as Error).message);
      }
    })();
    return () => { con = false; };
  }, [cau, id, Object.keys(tepStem).join(',')]);

  /* Máy phát sống theo PHIÊN, không theo lần vẽ. Đóng bài là trả lại ~424 MB —
     không đóng thì mở vài bài liên tiếp là app phình ra và không bao giờ xẹp. */
  useEffect(() => () => { void mayRef.current?.dong(); mayRef.current = null; }, [id, mayRef]);

  const napTieng = useCallback(async (): Promise<MayPhatStem | null> => {
    if (mayRef.current?.coTieng) return mayRef.current;
    if (!cau) return null;
    setDangNapTieng(true);
    setLoi(null);
    try {
      const may = new MayPhatStem();
      /* Có stem thì nghe stem — đó mới là cái đáng tắt/mở. Chưa tách thì nghe
         bản gốc, để nút phát không phải là một nút chết. */
      const nguon: Array<[string, string]> = Object.keys(tepStem).length > 0
        ? Object.entries(tepStem)
        : [['goc', tepGoc]];
      for (const [ma, duong] of nguon) {
        if (!duong) continue;
        const bg = await cau.xuongRemix.banGiao(duong);
        await may.nap(ma, bg.byte);
      }
      if (!may.coTieng) {
        await may.dong();
        setLoi(dich('Không đọc được tệp tiếng nào để nghe.'));
        return null;
      }
      mayRef.current = may;
      return may;
    } catch (e) {
      setLoi((e as Error).message);
      return null;
    } finally {
      setDangNapTieng(false);
    }
  }, [cau, tepGoc, tepStem, dich, mayRef]);

  const nhipVe = useCallback(() => {
    const may = mayRef.current;
    if (!may) return;
    const t = may.trangThai();
    setViTri(t.giay > 0 ? t.viTri / t.giay : 0);
    if (t.dangPhat && t.viTri < t.giay) {
      khungRef.current = requestAnimationFrame(nhipVe);
    } else if (t.viTri >= t.giay) {
      setDangPhat(false);
    }
  }, [mayRef]);

  const bamPhat = useCallback(async () => {
    const may = mayRef.current?.coTieng ? mayRef.current : await napTieng();
    if (!may) return;
    if (may.trangThai().dangPhat) {
      may.dung();
      setDangPhat(false);
      cancelAnimationFrame(khungRef.current);
      return;
    }
    may.datMuc(dungCai(muc, tat), solo);
    await may.phat();
    setDangPhat(true);
    khungRef.current = requestAnimationFrame(nhipVe);
  }, [napTieng, muc, tat, solo, nhipVe]);

  const veDau = useCallback(() => {
    const may = mayRef.current;
    setViTri(0);
    if (!may) return;
    if (may.trangThai().dangPhat) void may.phat(0);
    else may.dung();
  }, [mayRef]);

  const nhay = useCallback((ti: number) => {
    setViTri(ti);
    const may = mayRef.current;
    if (may?.trangThai().dangPhat) void may.phat(ti * may.giay);
  }, [mayRef]);

  /* Mọi thay đổi mức/tắt/solo phải tới máy phát NGAY, kể cả lúc đang chạy —
     đó là điểm khác biệt giữa một bàn trộn và một cái biểu mẫu. */
  useEffect(() => { mayRef.current?.datMuc(dungCai(muc, tat), solo); }, [muc, tat, solo, mayRef]);
  useEffect(() => () => cancelAnimationFrame(khungRef.current), []);

  const coStem = Object.keys(tepStem).length > 0;
  const daiHien = DAI.filter((d) => (d.ma === 'goc' ? !coStem : tepStem[d.ma]));

  return (
    <div className="ct-xr-ban">
      {/* ── Transport ─────────────────────────────── */}
      <div className="ct-xr-transport">
        <button type="button" className="ct-xr-nut-phat" onClick={() => void bamPhat()}
          disabled={dangNapTieng} aria-label={dangPhat ? dich('Dừng') : dich('Phát')}>
          {dangNapTieng ? <Loader2 size={18} className="ct-xoay" aria-hidden />
            : dangPhat ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
        </button>
        <button type="button" className="ct-xr-x" onClick={veDau} aria-label={dich('Về đầu')}>
          <SkipBack size={15} aria-hidden />
        </button>

        <span className="ct-xr-dongho">{dongHo(viTri * giay)}</span>
        <span className="ct-xr-dongho ct-muted">/ {dongHo(giay)}</span>

        {/* Tên bài KHÔNG lặp lại ở đây: nó đã nằm ngay trên, cách 30px, trong
            đầu khối. Bản đầu có nó, và ở cửa sổ hẹp nó bị cắt cụt thành
            "Bài thử rất dài để xem tên có tràn ra ngoài ô…" ngay dưới chính
            nó dạng đầy đủ — chiếm chỗ của đồng hồ để đổi lấy con số không. */}
        <span className="ct-xr-tp-day" />

        <span className="ct-xr-tp-so">
          <b>{pt && pt.bpm > 0 ? pt.bpm.toFixed(1) : '—'}</b>
          <span>BPM</span>
        </span>
        <span className="ct-xr-tp-so">
          <b>{pt?.tong || '—'}</b>
          <span>{pt?.tongCamelot || dich('tông')}</span>
        </span>
      </div>

      {loi && <p className="ct-xr-ngo" data-tone="loi">{loi}</p>}

      {/* ── Dải track ─────────────────────────────── */}
      <div className="ct-xr-track">
        {daiHien.map((d) => {
          const cam = solo !== null ? solo !== d.ma : (tat[d.ma] ?? false);
          return (
            <div key={d.ma} className={`ct-xr-lan${cam ? ' cam' : ''}`}>
              <div className="ct-xr-lan-dau">
                <b>{dich(d.nhan)}</b>
                <div className="ct-xr-lan-nut">
                  <button type="button" className="ct-xr-tag" data-bat={solo === d.ma ? '1' : undefined}
                    onClick={() => setSolo((s) => (s === d.ma ? null : d.ma))}
                    title={dich('Chỉ nghe đường này')}>S</button>
                  <button type="button" className="ct-xr-tag" data-bat={tat[d.ma] ? '1' : undefined}
                    onClick={() => setTat((t) => ({ ...t, [d.ma]: !t[d.ma] }))}
                    title={dich('Tắt tiếng đường này')}>
                    {tat[d.ma] ? <VolumeX size={12} aria-hidden /> : <Volume2 size={12} aria-hidden />}
                  </button>
                </div>
                <input type="range" min={0} max={100} step={1}
                  value={Math.round((muc[d.ma] ?? 1) * 100)}
                  aria-label={`${dich('Mức')} ${dich(d.nhan)}`}
                  onChange={(e) => setMuc((m) => ({ ...m, [d.ma]: Number(e.target.value) / 100 }))} />
                {/* Đồng hồ nằm luôn trong đầu dải: nhìn dạng sóng biết đoạn nào
                    to, nhìn đồng hồ biết NGAY GIÂY NÀY đường nào đang kêu — hai
                    câu hỏi khác nhau, và câu thứ hai là câu người ta hỏi khi
                    đang bấm tắt/mở từng đường. */}
                <DongHoMuc huong="ngang" doc={() => docDinh(d.ma)} />
              </div>
              <Song min={song?.min[d.ma]} max={song?.max[d.ma]} viTri={viTri}
                mau={d.mau} cao={56} onNhay={nhay} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Gom hai bảng rời thành hình dạng máy phát cần. */
function dungCai(
  muc: Record<string, number>, tat: Record<string, boolean>,
): Record<string, { mucAmLuong: number; tat: boolean }> {
  const ra: Record<string, { mucAmLuong: number; tat: boolean }> = {};
  for (const d of DAI) ra[d.ma] = { mucAmLuong: muc[d.ma] ?? 1, tat: tat[d.ma] ?? false };
  return ra;
}
