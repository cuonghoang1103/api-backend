/**
 * ============================================================
 * MENU CHUỘT PHẢI CỦA ROBOT — bảng thuần, kiểm được
 * ============================================================
 *
 * ─── VÌ SAO CÓ MENU NÀY ───
 * Cách duy nhất đổi cỡ / ghim / tắt robot trước đây là cử chỉ **ấn ba lần**.
 * Nó chạy, nhưng không ai ĐOÁN RA nếu không được kể — và người dùng thử app
 * trên Windows đã không tìm thấy. Chuột phải thì ai cũng thử.
 * Cử chỉ ba-cú-bấm vẫn giữ nguyên cho người đã quen tay.
 *
 * ─── VÌ SAO MENU NATIVE, KHÔNG PHẢI `div` TỰ VẼ ───
 * Cửa sổ robot chỉ rộng 150px và Electron **xén** mọi thứ tràn ra ngoài biên
 * cửa sổ. Một menu tự vẽ trong đó sẽ bị cắt còn vài chữ. Menu của hệ điều hành
 * nổi ra ngoài mọi cửa sổ và tự lật hướng khi gần mép màn hình — không làm lại
 * được bằng HTML trong một cửa sổ 150px.
 *
 * ─── VÌ SAO TÁCH RA HÀM THUẦN ───
 * `Menu.popup()` là **modal**: nó chặn tới khi người dùng chọn xong, nên không
 * có cách nào lái nó bằng bộ kiểm tự động. Tách bảng ra thì kiểm được phần
 * QUYẾT ĐỊNH (mục nào hiện, mục nào đang chấm, bấm thì gọi gì), còn phần vẽ để
 * hệ điều hành lo.
 */
import type { MenuItemConstructorOptions } from 'electron';

import { TU_DIEN } from '../renderer/i18n/tuDien';

/**
 * Dịch cho MAIN.
 *
 * ⚠️ Tiến trình main KHÔNG dùng được `useT()` của renderer — nó không có React,
 * và `datNgonNgu()` chỉ chạy trong renderer. Nhưng nó vẫn phải dịch: menu chuột
 * phải này là chữ do main dựng, và nếu bỏ qua thì người dùng đổi sang tiếng Anh
 * xong vẫn thấy một menu tiếng Việt — đúng kiểu "đổi rồi mà một chỗ chưa đổi".
 *
 * Dùng CHUNG `TU_DIEN` với renderer chứ không chép một bảng riêng: hai bảng là
 * hai thứ phải giữ cho khớp mãi mãi, và chúng sẽ lệch ngay lần sửa câu chữ đầu.
 */
function dich(cau: string, en: boolean): string {
  return en ? TU_DIEN[cau] ?? cau : cau;
}

export const NHAN_CO = ['100%', '82%', '66%', '52%'] as const;

export interface TuyChonMenuRobot {
  /** `true` = con robot vẽ TRONG trang app; `false` = cửa sổ nổi riêng. */
  trongApp: boolean;
  /** Người dùng đang để giao diện tiếng Anh. */
  tiengAnh: boolean;
  nacCo: number;
  bamMep: boolean;
  moChat: () => void;
  datCo: (nac: number) => void;
  datBamMep: (v: boolean) => void;
  tat: () => void;
}

export function bangMenuRobot(o: TuyChonMenuRobot): MenuItemConstructorOptions[] {
  const d = (cau: string): string => dich(cau, o.tiengAnh);
  return [
    { label: d('Mở AI Chat'), click: () => o.moChat() },
    { type: 'separator' },
    {
      label: d('Cỡ'),
      submenu: NHAN_CO.map((ten, i) => ({
        label: ten,
        type: 'radio' as const,
        checked: o.nacCo === i,
        click: () => o.datCo(i),
      })),
    },
    {
      label: d('Tự dính mép màn hình'),
      type: 'checkbox',
      checked: o.bamMep,
      click: (m) => o.datBamMep(m.checked),
      /* CHỈ con nổi. Con trong app dính mép CỬA SỔ và đi theo luật riêng của
         renderer — bày mục này cho nó là hứa một thứ nút không làm được. */
      visible: !o.trongApp,
    },
    { type: 'separator' },
    {
      label: d(o.trongApp ? 'Tắt robot trong app' : 'Tắt robot nổi'),
      click: () => o.tat(),
    },
  ];
}
