/**
 * CỜ DÒNG LỆNH — tự viết (không commander/yargs): bộ cờ nhỏ, chữ trợ giúp
 * tiếng Việt, và phải kiểm được bằng test mà không chạy tiến trình nào.
 */
import { cheDoTuChu, type CheDoQuyen } from './cheDo';

declare const __PHIEN_BAN__: string | undefined;
export const PHIEN_BAN: string = typeof __PHIEN_BAN__ === 'string' ? __PHIEN_BAN__ : '0.0.0-dev';

export type LenhChinh = 'chat' | 'login' | 'logout' | 'version' | 'help' | 'capNhat' | 'doctor';
export type DinhDangRa = 'text' | 'json' | 'stream-json';

export interface CoDong {
  lenh: LenhChinh;
  /** Câu hỏi gửi ngay (cuongmini "…" hoặc -p "…"). */
  cauHoi: string;
  /** `-p`: chạy một lượt, in kết quả ra stdout rồi thoát. */
  cheDoIn: boolean;
  /** `-c`: mở việc gần nhất của thư mục này. */
  tiepTuc: boolean;
  model?: string;
  cheDo?: CheDoQuyen;
  /** Thư mục dự án khác thư mục đang đứng. */
  thuMuc?: string;
  /** `--resume`: mở bảng chọn việc cũ ngay khi vào. */
  chonViecCu?: boolean;
  /** `--add-dir`: thư mục THÊM mà agent được đọc/sửa (ngoài thư mục dự án). */
  themThuMuc?: string[];
  /** `-p --output-format`. */
  dinhDang?: DinhDangRa;
  /** `--verbose`: in đầy đủ đầu ra lệnh (như bấm ctrl+o). */
  chiTiet?: boolean;
  loi?: string;
}

const LENH_PHU: Record<string, LenhChinh> = {
  login: 'login', 'dang-nhap': 'login', logout: 'logout', 'dang-xuat': 'logout',
  update: 'capNhat', 'cap-nhat': 'capNhat', upgrade: 'capNhat',
  doctor: 'doctor', 'chan-doan': 'doctor',
};

export function phanTichCo(argv: readonly string[]): CoDong {
  const ra: CoDong = { lenh: 'chat', cauHoi: '', cheDoIn: false, tiepTuc: false };
  const viTri: string[] = [];
  const canGiaTri = (ten: string, i: number): string | null => {
    const v = argv[i + 1];
    if (v === undefined || (v.startsWith('-') && v.length > 1)) { ra.loi = `Cờ ${ten} cần một giá trị.`; return null; }
    return v;
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]!;
    if (a === '--') { viTri.push(...argv.slice(i + 1)); break; }
    const [ten, giaTriLien] = a.startsWith('--') && a.includes('=') ? [a.slice(0, a.indexOf('=')), a.slice(a.indexOf('=') + 1)] : [a, undefined];
    switch (ten) {
      case '-h': case '--help': case '--tro-giup': ra.lenh = 'help'; break;
      case '-v': case '-V': case '--version': case '--phien-ban': ra.lenh = 'version'; break;
      case '-p': case '--print': case '--in': ra.cheDoIn = true; break;
      case '-c': case '--continue': case '--tiep-tuc': ra.tiepTuc = true; break;
      case '-m': case '--model': {
        const v = giaTriLien ?? canGiaTri(ten, i);
        if (v === null) return ra;
        if (giaTriLien === undefined) i += 1;
        ra.model = v;
        break;
      }
      case '--che-do': case '--permission-mode': {
        const v = giaTriLien ?? canGiaTri(ten, i);
        if (v === null) return ra;
        if (giaTriLien === undefined) i += 1;
        const cd = cheDoTuChu(v);
        if (!cd) { ra.loi = `Không rõ chế độ "${v}". Có: ke-hoach, hoi, tu-sua, tu-dong, bo-qua-het.`; return ra; }
        ra.cheDo = cd;
        break;
      }
      case '-r': case '--resume': ra.chonViecCu = true; break;
      case '--verbose': case '--chi-tiet': ra.chiTiet = true; break;
      case '--dangerously-skip-permissions': ra.cheDo = 'boQuaHet'; break;
      case '--add-dir': case '--them-thu-muc': {
        const v = giaTriLien ?? canGiaTri(ten, i);
        if (v === null) return ra;
        if (giaTriLien === undefined) i += 1;
        ra.themThuMuc = [...(ra.themThuMuc ?? []), v];
        break;
      }
      case '--output-format': case '--dinh-dang': {
        const v = giaTriLien ?? canGiaTri(ten, i);
        if (v === null) return ra;
        if (giaTriLien === undefined) i += 1;
        if (v !== 'text' && v !== 'json' && v !== 'stream-json') { ra.loi = `--output-format chỉ nhận text, json, stream-json (nhận "${v}").`; return ra; }
        ra.dinhDang = v;
        break;
      }
      case '-C': case '--thu-muc': {
        const v = giaTriLien ?? canGiaTri(ten, i);
        if (v === null) return ra;
        if (giaTriLien === undefined) i += 1;
        ra.thuMuc = v;
        break;
      }
      default:
        if (a.startsWith('-') && a.length > 1 && !/^-\d/.test(a)) { ra.loi = `Không rõ cờ ${a}. Gõ cuongmini --help để xem.`; return ra; }
        viTri.push(a);
    }
  }
  // Lệnh phụ chỉ khi đứng MỘT MÌNH: `cuongmini login` ≠ `cuongmini "login bị lỗi gì?"`.
  if (ra.lenh === 'chat' && viTri.length === 1 && LENH_PHU[viTri[0]!] && !ra.cheDoIn) {
    ra.lenh = LENH_PHU[viTri[0]!]!;
    return ra;
  }
  ra.cauHoi = viTri.join(' ').trim();
  if (ra.dinhDang && ra.dinhDang !== 'text' && !ra.cheDoIn) { ra.loi = '--output-format chỉ dùng cùng -p.'; return ra; }
  return ra;
}

export function chuTroGiup(): string {
  return `CuongMini ${PHIEN_BAN} — trợ lý lập trình trong terminal, dùng lõi AI Code của CuongThai.

Cách dùng:
  cuongmini                      Mở phiên tương tác trong thư mục hiện tại
  cuongmini "câu hỏi"            Mở và gửi ngay câu hỏi
  cuongmini -p "câu hỏi"         Chế độ in: chạy một lượt, in kết quả ra stdout rồi thoát
  echo "…" | cuongmini -p        Đọc câu hỏi (hoặc dữ liệu kèm) từ stdin
  cuongmini login                Đăng nhập tài khoản cuongthai.com
  cuongmini logout               Đăng xuất, xoá phiên trên máy
  cuongmini update               Cập nhật lên bản mới nhất (chạy lại trình cài)
  cuongmini doctor               Kiểm tra máy: Node, PATH, đăng nhập, mạng, trình duyệt cho tool web

Cờ:
  -c, --tiep-tuc                 Mở lại việc gần nhất của thư mục này
  -r, --resume                   Chọn một việc cũ để mở lại
  -m, --model <tên>              Chọn model (vd: sonnet-5, opus-4-8, gpt-sol)
      --che-do <chế độ>          hoi · ke-hoach · tu-sua · tu-dong · bo-qua-het
                                 (mặc định: hoi — đủ công cụ, mỗi lần sửa/chạy lệnh vẫn hỏi;
                                  riêng -p mặc định ke-hoach vì không ai bấm duyệt được)
      --dangerously-skip-permissions   = --che-do bo-qua-het (không hỏi gì — cẩn thận)
  -C, --thu-muc <đường>          Làm việc ở thư mục khác thư mục đang đứng
      --add-dir <đường>          Cho agent đọc/sửa thêm thư mục này (lặp lại được)
      --output-format <dạng>     Với -p: text (mặc định) · json · stream-json
      --verbose                  In đầy đủ đầu ra lệnh (như ctrl+o)
  -v, --version                  In phiên bản
  -h, --help                     In trợ giúp này

Trong phiên:
  /help  danh sách lệnh   ·  @file  nhắc file/hàm  ·  shift+tab  đổi chế độ quyền
  !lệnh  chạy shell ngay  ·  # ghi chú  lưu quy ước dự án  ·  ctrl+v  dán ảnh
  esc  dừng việc đang chạy ·  esc esc  quay lui về câu cũ ·  ctrl+r  xem lại bảng ghi
  ctrl+p  bảng kế hoạch    ·  ctrl+o  mở/thu đầu ra lệnh ·  ctrl+c ×2  thoát
  Alt+Enter, ctrl+j hoặc \\ cuối dòng  xuống dòng  ·  ↑↓  lịch sử

Dữ liệu: ~/.cuongmini (phiên đăng nhập, lịch sử, việc đã lưu).
Cập nhật: chạy lại lệnh cài — curl -fsSL https://cuongthai.com/cli/install.sh | bash`;
}
