/**
 * ============================================================
 * MENU TUỲ CHỌN CỦA MỘT TIN NHẮN
 * ============================================================
 *
 * ─── Vì sao cần, trong khi bôi đen vẫn chép được ───
 * Bôi đen một bong bóng là kéo qua một khối bo góc có padding: trượt một chút
 * là dính giờ gửi, dính tên người, hoặc rụng mất dòng cuối. Người dùng báo
 * đúng chuyện đó — "nhiều lúc còn thiếu và sai".
 *
 * ⚠️ Menu có cho CẢ tin của người khác, không chỉ tin của mình. Đó mới là ca
 * người dùng kêu: họ cần chép nhanh câu người kia vừa gửi. Mục phá huỷ
 * (thu hồi / xoá) thì vẫn chỉ hiện trên tin của chính mình.
 */
import { useState } from 'react';
import { Check, Copy, CopyCheck, Download, ImageDown, MoreHorizontal, Reply, Trash2, Undo2 } from 'lucide-react';

import { chepDuoc, chuMotTin } from '@/lib/tinNhan/chep';
import type { TinDeChep } from '@/lib/tinNhan/chep';
import { chepAnhVaoClipboard, tenAnhTuUrl } from '@/lib/tinNhan/anh';
import { useMoRieng } from '../../components/moRieng';
import { useDich } from '../../i18n';

/* `| undefined` viết RÕ vì kho này bật `exactOptionalPropertyTypes`: ở chế độ
   đó `thuHoi?: () => void` nghĩa là "vắng mặt HOẶC là hàm", KHÔNG cho gán
   `undefined` vào. Mà bên gọi lại đúng là gán `cuaToi ? f : undefined`. */
export interface ViecTin {
  traLoi?: (() => void) | undefined;
  thuHoi?: (() => void) | undefined;
  xoa?: (() => void) | undefined;
  chonNhieu?: (() => void) | undefined;
}

/** Tải ảnh về rồi đưa qua hộp thoại lưu của hệ điều hành. */
async function luuAnh(url: string): Promise<boolean> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Không tải được ảnh (${r.status}).`);
  const bytes = new Uint8Array(await r.arrayBuffer());
  const kq = await window.cuongthai?.app.luuFile(tenAnhTuUrl(url), bytes);
  if (kq && !kq.ok && !kq.huy) throw new Error(kq.loi ?? 'Lưu ảnh không thành công.');
  return !!kq?.ok;
}

export function MenuTinNhan(
  { tin, cuaToi, viec }: { tin: TinDeChep & { id: number }; cuaToi: boolean; viec: ViecTin },
) {
  const { dich } = useDich();
  /* Khoá RIÊNG theo id tin. Dùng chung một khoá thì mở menu của tin này sẽ mở
     luôn menu của mọi tin khác — xem [[feedback_khoa_popover_dung_chung_mo_moi_tab]]. */
  const { mo, bat, dong, boc } = useMoRieng(`tn:${tin.id}`);
  const [xong, datXong] = useState<string | null>(null);
  const [loi, datLoi] = useState<string | null>(null);

  const baoXong = (c: string) => {
    datXong(c);
    setTimeout(() => datXong(null), 1400);
  };

  const lam = (ten: string, f: () => void | Promise<unknown>) => () => {
    dong();
    void (async () => {
      try {
        await f();
        baoXong(ten);
      } catch (e) {
        datLoi((e as Error).message);
        setTimeout(() => datLoi(null), 3000);
      }
    })();
  };

  const coChu = chepDuoc(tin);
  const coAnh = !!tin.mediaUrl;
  if (tin.recalled || tin.deleted) return null;   // Không còn gì để làm với nó.

  return (
    <div className="ct-tn-menu-boc" ref={boc}>
      <button
        type="button"
        className="ct-tn-menu-nut"
        onClick={bat}
        aria-label={dich('Tuỳ chọn tin nhắn')}
        aria-expanded={mo}
      >
        <MoreHorizontal size={14} aria-hidden />
      </button>

      {/* Báo "đã chép" ngay tại nút. Không có nó thì bấm Chép xong màn hình
          không đổi gì, và người dùng bấm lại lần nữa cho chắc. */}
      {xong && <span className="ct-tn-menu-xong"><Check size={11} aria-hidden />{xong}</span>}
      {loi && <span className="ct-tn-menu-loi">{loi}</span>}

      {mo && (
        <div className="ct-tn-menu" data-toi={cuaToi}>
          {coChu && (
            <button type="button" onClick={lam(dich('Đã chép'), async () => {
              await navigator.clipboard.writeText(chuMotTin(tin));
            })}>
              <Copy size={13} aria-hidden /> {dich('Chép chữ')}
            </button>
          )}
          {coAnh && (
            <button type="button" onClick={lam(dich('Đã chép ảnh'), () => chepAnhVaoClipboard(tin.mediaUrl!))}>
              <ImageDown size={13} aria-hidden /> {dich('Chép ảnh')}
            </button>
          )}
          {coAnh && (
            <button type="button" onClick={lam(dich('Đã lưu'), () => luuAnh(tin.mediaUrl!))}>
              <Download size={13} aria-hidden /> {dich('Lưu ảnh về máy')}
            </button>
          )}
          {viec.traLoi && (
            <button type="button" onClick={() => { dong(); viec.traLoi!(); }}>
              <Reply size={13} aria-hidden /> {dich('Trả lời')}
            </button>
          )}
          {viec.chonNhieu && (
            <button type="button" onClick={() => { dong(); viec.chonNhieu!(); }}>
              <CopyCheck size={13} aria-hidden /> {dich('Chọn nhiều tin')}
            </button>
          )}
          {cuaToi && viec.thuHoi && (
            <button type="button" data-canh onClick={() => { dong(); viec.thuHoi!(); }}>
              <Undo2 size={13} aria-hidden /> {dich('Thu hồi')}
            </button>
          )}
          {cuaToi && viec.xoa && (
            <button type="button" data-hong onClick={() => { dong(); viec.xoa!(); }}>
              <Trash2 size={13} aria-hidden /> {dich('Xoá')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
