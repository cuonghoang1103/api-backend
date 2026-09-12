/**
 * ============================================================
 * ĐỊNH DẠNG XUẤT — bảng dùng chung cho cả main lẫn renderer
 * ============================================================
 *
 * Nằm ở `shared/` chứ không ở `main/nhac/maHoa.ts` vì giao diện phải bày ra
 * đúng những lựa chọn mà bộ mã hoá nhận, và phải gọi tên chúng y hệt. Hai bảng
 * chép tay ở hai nơi là mầm trôi dạt — đúng bài học `seed.ts` trong CLAUDE.md
 * (08/08/2026): union chép tay tự kiểm với chính nó, qua sạch checklist, vỡ
 * trên production.
 *
 * ⚠️ Tệp này KHÔNG được import zod hay bất cứ thứ gì của Node. Cùng lý do với
 * `shared/tronMacDinh.ts`: renderer nạp nó, và một `import` lỡ tay là cả zod
 * đi vào gói của trình duyệt.
 */

export type DinhDang = 'wav' | 'wav16' | 'mp3' | 'flac';

/**
 * ⚠️ `| undefined` tường minh là BẮT BUỘC, không phải thừa. Dự án bật
 * `exactOptionalPropertyTypes`, nên `kbps?: number` nghĩa là "vắng mặt hoặc là
 * số" chứ KHÔNG nhận `kbps: undefined`. Mà zod suy ra đúng dạng sau: một
 * `.optional()` cho ra `kbps?: number | undefined`. Thiếu hai chữ này thì mọi
 * lời gọi từ tầng IPC đều đỏ.
 */
export interface CaiXuat {
  dinhDang: DinhDang;
  /** MP3: 128 | 192 | 256 | 320. Bỏ qua với định dạng khác. */
  kbps?: number | undefined;
  /** FLAC: 16 hay 24 bit. Bỏ qua với định dạng khác. */
  bit?: 16 | 24 | undefined;
}

/** Tốc độ bit MP3 được phép chào. */
export const KBPS_CHO_PHEP = [128, 192, 256, 320] as const;

export function duoiTep(c: CaiXuat): string {
  switch (c.dinhDang) {
    case 'mp3': return 'mp3';
    case 'flac': return 'flac';
    default: return 'wav';
  }
}

/**
 * Kiểu MIME — dùng cho `new File(...)` lúc đẩy lên và lúc nghe thử.
 *
 * Sai kiểu ở đây thì `<audio>` vẫn phát được (Chromium tự dò theo nội dung),
 * nhưng máy chủ lưu bài với sai kiểu, và bàn DJ đọc lại theo kiểu đã lưu.
 */
export function mimeCua(c: CaiXuat): string {
  switch (c.dinhDang) {
    case 'mp3': return 'audio/mpeg';
    case 'flac': return 'audio/flac';
    default: return 'audio/wav';
  }
}

/**
 * Mô tả ngắn để hiện cạnh tên tệp — người dùng phải đọc ra được mình vừa chọn
 * cái gì mà không cần mở tệp ra xem. "MP3" trơn là không đủ: 128 và 320 khác
 * nhau một trời một vực, mà tên tệp thì không mang con số đó.
 */
export function moTaDinhDang(c: CaiXuat): string {
  switch (c.dinhDang) {
    case 'mp3': return `MP3 ${c.kbps ?? 320} kbps`;
    case 'flac': return `FLAC ${c.bit ?? 24}-bit`;
    case 'wav16': return 'WAV 16-bit';
    default: return 'WAV 32-bit float';
  }
}

/** Một lựa chọn trên giao diện. */
export interface MucChonXuat {
  ma: string;
  cai: CaiXuat;
  nhan: string;
  /** Vì sao chọn cái này — câu quyết định, không phải mô tả kỹ thuật. */
  viSao: string;
  /** Cỡ tệp ước tính cho một bài 5 phút stereo, MB. Đo thật, không đoán. */
  mbUocTinh: number;
  /** Có mất dữ liệu không — giao diện phải nói ra chứ không để người dùng đoán. */
  matDuLieu: boolean;
}

/**
 * Bảng lựa chọn bày ra cho người dùng.
 *
 * Cỡ tệp đo thật trên một bài 5 phút stereo 44,1 kHz (12/09/2026): WAV float
 * 105 MB · WAV 16-bit 53 MB · FLAC ~41 MB · MP3 320 12 MB. Con số FLAC phụ
 * thuộc nội dung nhiều nhất (bài càng ồn càng khó nén) nên nó là con số dễ
 * lệch nhất trong bảng — vì thế mọi chỗ hiện nó đều phải có dấu `~`.
 */
export const CHON_XUAT: MucChonXuat[] = [
  {
    ma: 'mp3-320',
    cai: { dinhDang: 'mp3', kbps: 320 },
    nhan: 'MP3 320 kbps',
    viSao: 'Chuẩn để đi diễn và gửi cho người khác. Nhỏ gấp 9 lần WAV, tai gần như không phân biệt được.',
    mbUocTinh: 12,
    matDuLieu: true,
  },
  {
    ma: 'mp3-256',
    cai: { dinhDang: 'mp3', kbps: 256 },
    nhan: 'MP3 256 kbps',
    viSao: 'Nhẹ hơn chút, vẫn thừa cho loa sàn và tai nghe thường.',
    mbUocTinh: 9.6,
    matDuLieu: true,
  },
  {
    ma: 'mp3-192',
    cai: { dinhDang: 'mp3', kbps: 192 },
    nhan: 'MP3 192 kbps',
    viSao: 'Gửi qua mạng chậm, hoặc nghe thử nhanh. Nghe kỹ trên tai nghe tốt thì thấy phần cao mỏng đi.',
    mbUocTinh: 7.2,
    matDuLieu: true,
  },
  {
    ma: 'mp3-128',
    cai: { dinhDang: 'mp3', kbps: 128 },
    nhan: 'MP3 128 kbps',
    viSao: 'Chỉ để gửi bản nháp. Đừng đem đi diễn — cymbal và hi-hat vỡ rõ.',
    mbUocTinh: 4.8,
    matDuLieu: true,
  },
  {
    ma: 'flac-24',
    cai: { dinhDang: 'flac', bit: 24 },
    nhan: 'FLAC 24-bit',
    viSao: 'Không mất một chút dữ liệu nào, mà chỉ bằng nửa WAV. Chọn cái này để lưu trữ hoặc đưa cho người mix tiếp.',
    mbUocTinh: 60,
    matDuLieu: false,
  },
  {
    ma: 'flac-16',
    cai: { dinhDang: 'flac', bit: 16 },
    nhan: 'FLAC 16-bit',
    viSao: 'Cũng không mất dữ liệu, ở độ sâu của đĩa CD. Rekordbox, Serato và Traktor đều đọc được.',
    mbUocTinh: 41,
    matDuLieu: false,
  },
  {
    ma: 'wav-16',
    cai: { dinhDang: 'wav16' },
    nhan: 'WAV 16-bit',
    viSao: 'Định dạng không bao giờ từ chối ở đâu cả. To, nhưng chắc chắn mở được.',
    mbUocTinh: 53,
    matDuLieu: false,
  },
  {
    ma: 'wav-32',
    cai: { dinhDang: 'wav' },
    nhan: 'WAV 32-bit float',
    viSao: 'Nguyên xi thứ xưởng tính ra. Dùng khi còn phải chỉnh tiếp trong FL Studio.',
    mbUocTinh: 105,
    matDuLieu: false,
  },
];

export const CHON_XUAT_MAC_DINH = 'mp3-320';

export function timChonXuat(ma: string): MucChonXuat {
  return CHON_XUAT.find((m) => m.ma === ma) ?? CHON_XUAT[0]!;
}
