/**
 * ============================================================
 * BÀN TRỘN — bốn đường dọc, như một bàn mixer thật
 * ============================================================
 *
 * Bản trước là một BẢNG: mỗi stem một hàng, mỗi thông số một thanh trượt ngang
 * dài 160px. Nó đúng chức năng và sai hình. Ba lý do:
 *
 *  1. Bốn thanh trượt ngang × bốn stem là một khối cao 400px mà mắt phải đọc
 *     theo hàng. Người mix nhạc thì so theo CỘT — "mức của trống so với mức
 *     của bass" — và bố cục hàng bắt họ nhảy mắt qua lại.
 *  2. Thanh trượt không nói được giá trị mặc định nằm ở đâu. Núm thì vạch chỉ
 *     nói ngay ở một cái liếc.
 *  3. Không có đồng hồ mức. Một bàn trộn không có đồng hồ thì chỉnh mù: bạn
 *     nghe thấy to hơn, mà không biết đã chạm trần chưa.
 *
 * Bản này: bốn cột đứng, mỗi cột là một đường — núm ở trên, đồng hồ chạy theo
 * tiếng đang phát ở dưới, nút tắt ở đáy. Đúng thứ tự của một bàn mixer.
 *
 * ─── Đồng hồ chỉ sống khi ĐANG PHÁT ───
 * Nó đọc từ chính máy phát của bàn làm việc ở trên. Không phát thì `doc` trả
 * `null` và dải rơi về 0 — chứ không đứng im ở giá trị cuối, thứ trông y hệt
 * "đang phát mà im tiếng".
 */
import { Layers, Loader2, RotateCcw } from 'lucide-react';
import { useDich } from '../../i18n';
import { DongHoMuc, NAC_DB, viTriNac } from './DongHoMuc';
import { NumXoay } from './NumXoay';
import { KHOA_TONG } from './mayPhat';
import type { CaiDatStemTron } from '../../../shared/ipc';

/** Cùng thứ tự và cùng màu với dải track ở bàn làm việc — hai khối nói về
    cùng bốn thứ, đổi thứ tự giữa chúng là bắt mắt học lại từ đầu. */
const DUONG = [
  { ma: 'drums', nhan: 'Trống', mau: 'rgba(248,150,110,0.95)' },
  { ma: 'bass', nhan: 'Bass', mau: 'rgba(250,204,21,0.95)' },
  { ma: 'other', nhan: 'Nhạc nền', mau: 'rgba(129,140,248,0.95)' },
  { ma: 'vocals', nhan: 'Giọng hát', mau: 'rgba(74,222,128,0.95)' },
] as const;

interface Props {
  cai: Record<string, CaiDatStemTron>;
  macDinh: Record<string, CaiDatStemTron>;
  onDoi: (ma: string, thay: Partial<CaiDatStemTron>) => void;
  onVeMacDinh: () => void;
  nenTong: boolean;
  onNenTong: (v: boolean) => void;
  onTron: () => void;
  dangTron: boolean;
  /** Đỉnh hiện thời theo tên đường; `null` khi không có gì đang phát. */
  docDinh: (ma: string) => number | null;
}

export function BanTron({
  cai, macDinh, onDoi, onVeMacDinh, nenTong, onNenTong, onTron, dangTron, docDinh,
}: Props) {
  const { dich } = useDich();

  return (
    <div className="ct-xr-bt">
      <div className="ct-xr-bt-day">
        {DUONG.map((d) => {
          const c = cai[d.ma] ?? macDinh[d.ma]!;
          const md = macDinh[d.ma]!;
          return (
            <div key={d.ma} className="ct-xr-bt-cot" data-tat={c.bat ? undefined : '1'}>
              <div className="ct-xr-bt-ten" style={{ '--mau': d.mau } as React.CSSProperties}>
                {dich(d.nhan)}
              </div>

              <div className="ct-xr-bt-num">
                <NumXoay
                  nhan={dich('Mức')} gia={c.gainDb} min={-24} max={6} buoc={0.5}
                  macDinh={md.gainDb} mau={d.mau} tat={!c.bat}
                  onDoi={(v) => onDoi(d.ma, { gainDb: v })}
                  hien={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`}
                />
                <NumXoay
                  nhan={dich('Chắn trầm')} gia={c.chanTramHz} min={0} max={200} buoc={10}
                  macDinh={md.chanTramHz} mau={d.mau} tat={!c.bat}
                  onDoi={(v) => onDoi(d.ma, { chanTramHz: v })}
                  hien={(v) => (v === 0 ? dich('tắt') : `${v}Hz`)}
                />
                <NumXoay
                  /* "Duck" KHÔNG bọc `dich()`: nó là thuật ngữ tiếng Anh
                     dùng nguyên ở cả hai bản, y như `Bass`. Bọc vào thì
                     `tuDien.test.ts` đòi một mục — mà mục chép y nguyên lại bị
                     chính nó từ chối. Đúng luật đã ghi ở đầu `tuDien.ts`. */
                  nhan="Duck" gia={Math.round(c.duck * 100)} min={0} max={100} buoc={5}
                  macDinh={Math.round(md.duck * 100)} mau={d.mau} tat={!c.bat}
                  onDoi={(v) => onDoi(d.ma, { duck: v / 100 })}
                  hien={(v) => `${v}%`}
                />
              </div>

              <div className="ct-xr-bt-do">
                <DongHoMuc doc={() => docDinh(d.ma)} />
              </div>

              <button
                type="button"
                className="ct-xr-bt-bat"
                data-bat={c.bat ? '1' : undefined}
                aria-pressed={c.bat}
                onClick={() => onDoi(d.ma, { bat: !c.bat })}
              >
                {c.bat ? dich('BẬT') : dich('TẮT')}
              </button>
            </div>
          );
        })}

        {/* Đường TỔNG. Nó không có núm nào — nó là chỗ để NHÌN, và cái đáng
            nhìn nhất là tổng bốn đường cộng lại có chạm trần không. */}
        <div className="ct-xr-bt-cot ct-xr-bt-tong">
          <div className="ct-xr-bt-ten">{dich('Tổng')}</div>
          <div className="ct-xr-bt-num ct-xr-bt-num-tong">
            <button
              type="button"
              className="ct-xr-bt-bat ct-xr-bt-nen"
              data-bat={nenTong ? '1' : undefined}
              aria-pressed={nenTong}
              onClick={() => onNenTong(!nenTong)}
            >
              {dich('Nén tổng')}
            </button>
          </div>
          <div className="ct-xr-bt-do">
            <DongHoMuc doc={() => docDinh(KHOA_TONG)} />
          </div>
          {/* Thang đặt theo CHÍNH hàm dựng đồng hồ, không xếp cách đều. */}
          <div className="ct-xr-bt-thang" aria-hidden>
            {NAC_DB.map((db) => (
              <span key={db} style={{ bottom: `${viTriNac(db)}%` }}>{db}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="ct-xr-dieu-khien">
        <button type="button" className="ct-btn" disabled={dangTron} onClick={onTron}>
          {dangTron ? <Loader2 size={14} className="ct-xoay" aria-hidden />
                    : <Layers size={14} aria-hidden />}
          {dangTron ? dich('Đang trộn…') : dich('Trộn lại')}
        </button>
        <button type="button" className="ct-btn ct-btn-ghost" onClick={onVeMacDinh}>
          <RotateCcw size={14} aria-hidden />
          {dich('Về mặc định')}
        </button>
        <span className="ct-muted ct-xr-bt-meo">
          {dich('Kéo dọc để chỉnh · giữ Shift để chỉnh nhỏ · bấm đúp để về mặc định')}
        </span>
      </div>
    </div>
  );
}
