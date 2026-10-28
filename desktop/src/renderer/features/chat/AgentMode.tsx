/**
 * Chế độ Lập trình — agent đọc dự án trên máy người dùng.
 *
 * ─── BA THỨ MÀN HÌNH NÀY BẮT BUỘC PHẢI NÓI RÕ ───
 *
 *  1. AGENT ĐANG ĐƯỢC ĐỌC THƯ MỤC NÀO. Đây là quyền người dùng vừa cấp cho một
 *     mô hình ngôn ngữ, nên nó phải hiện thường trực trên đầu màn hình, không
 *     giấu trong Cài đặt. Không thấy phạm vi quyền = không thật sự đồng ý.
 *
 *  2. CÒN BAO NHIÊU. Nhưng hiện "còn ~15 việc" chứ KHÔNG hiện "còn 3,4 triệu
 *     token" — con số token không nói lên điều gì với người dùng, còn số việc
 *     thì trả lời đúng câu họ đang hỏi trong đầu.
 *
 *  3. NÓ ĐANG LÀM GÌ. Đo được: có tới ~10 giây im lặng giữa lúc bấm gửi và
 *     dòng chữ đầu tiên, vì model đang nghĩ xem gọi tool nào. Con quay phải
 *     bật NGAY, nếu không màn hình đứng im và người dùng tưởng app treo.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { MoiGhiChu } from './MoiGhiChu';
import {
  Keyboard,
  MousePointerClick,
  Bug,
  Camera,
  Download,
  Link2,
  Copy,
  BookOpen, Check, Circle, CircleDot, CircleStop, FileCode2, FilePen, FilePlus2, FolderOpen,
  FolderPlus, FolderTree, GitBranch, History, ListChecks, Loader2, NotebookPen, Plug, RotateCcw, Search, Send,
  ShieldCheck, Sparkles, SquareTerminal, Terminal, Trash2, Undo2, X, ChevronDown, Cpu, Globe, Zap, ListPlus, PanelRight, LifeBuoy, WifiOff,
  MoreHorizontal, Brain, Webhook, PlugZap, ChevronsDownUp, ChevronsUpDown, Code2, Monitor,
} from 'lucide-react';
import { useSession } from '../../auth/session';
import { moTam, useMoTuNgoai } from './moTam';
import {
  PROMPT_DUYET_KE_HOACH, PROMPT_INIT, TEN_CHE_DO, chonPhien, dsCauHoi, layUsage, locPhien, moTaChanDoan, moTaUsage2,
  moTaDsCauHoi, moTaDsPhien, moTaNguCanh, moTaTrangThai, moTaTroGiup, moTaUsage, promptPlan, promptReview,
  tachLenh, tenFileXuat, timMuc, timTheoChu, xuatMarkdown,
} from './lenhGach';
import { hoiDongBoGit, lenhDongBo } from './gitDongBoLenh';
import { hanhDongMcp, lamHanhDongMcp, trangThaiMcpChu, hoiGanDoan, homNay as homNayCtw, hoiCtworkMotLan, kiemTinCtw, laLoiXacThucCtw, lenhCtwork, moCtworkTuMcp, veDongCtw, xongViec as xongViecCtw, type DongCtw, type GiaoDienCtw, type TheChonCtw } from './ctworkLenh';
import { useAppState } from '../../app-state';
import { useMoRieng } from '../../components/moRieng';
import { ThanhDangLam } from './ThanhDangLam';
import { viecDangLam, viecCuaTool } from './viecDangLam';
import { TerminalThat } from './TerminalThat';
import { KhungWeb } from './KhungWeb';
import { GoiYLenh, LENH_AGENT } from './GoiYLenh';
import { NutCuongMiniCli } from './NutCuongMiniCli';
import { NutTrinhSoan } from './NutTrinhSoan';
import { ID_FABLE, XinThemFable } from './HanMucFable';
import { HoiQuayVeCongChinh, MoCongDuPhong, moTaDuPhong, useCongDuPhong } from './CongDuPhong';
import { MoCongAnthropic, MoiNangCapCong, OKhoa } from './CongAnthropic';
import { NhapKeyGiaHan } from './NhapKeyGiaHan';
import { NhapMaGiaHanTien } from './NhapMaGiaHanTien';
import { GoiYFile, docTokenFile, type TokenFile } from './GoiYFile';
import { BangHook } from './BangHook';
import { BangBoNho } from './BangBoNho';
import { ghepThamSo } from '../../../shared/lenhDuAn';
import type {
  AgentInfo, AgentMcpTrangThai, AgentNguCanh, AgentViec, AgentWorktree, CheDoQuyen, ModelAgent, MucNoLuc,
} from '../../../shared/ipc';
import { useAgent, useThuMuc, type MucHienThi } from './useAgent';
import { LichSu } from './LichSu';
import { ChuAgent } from './markdown';
import { NutTinNhan } from './NutTinNhan';
import { KhoiDiff, MaDong, ngonNguTuDuong } from './XinPhep';
import { AnhPhongTo } from '../feed/AnhPhongTo';
import { ChonCheDo } from './ChonCheDo';
import {
  DaiTepCode, NutChonTep, ODinhKemCode, useDanKhapNoi, useDinhKemCode,
} from './DinhKemCode';
import { ChupManHinh, NutChupManHinh } from './ChupManHinh';
import { DaiHenCho, DongTinPhien, TheHoi, ThePhu } from './Dot3';
import { XinPhep, XinPhepGit, XinPhepLenh, XinPhepMcp, XinPhepNote } from './XinPhep';
import { ngonNguHienTai, useDich } from '../../i18n';
import { Chu } from '../../i18n/Chu';
import { DaiNgoaiTuyen, NhanMay, useCheDoCode, useGiaoDienNgoaiTuyen, useMoCaiNgoaiTuyen } from './NgoaiTuyen';

/** Nút kèm câu trả lời của lệnh `/`. */
type NutLenh = 'nhapKey' | 'caiNgoaiTuyen' | 'henLo' | { chon: TheChonCtw } | null;

/** Đợt 5: hỏi "Kết nối CT Work? / gắn dự án?" MỘT lần mỗi lần mở app (lõi còn nhớ qua các lần mở). */
let daHoiCtworkLanNay = false;

export function AgentMode({
  cuocId,
  info,
  napLai,
  datTieuDe,
  datDuAn,
  phienCanMo,
  onTachRaTabMoi,
}: {
  /** Cuộc (tab) mà màn hình này thuộc về. Mọi lời gọi IPC mang id này. */
  cuocId: string;
  info: AgentInfo;
  napLai: () => void;
  /** Báo tiêu đề lên cha để thanh tab hiện đúng tên việc. */
  datTieuDe?: (t: string) => void;
  /** Báo tên dự án lên cha — thanh tab cần nó để phân biệt hai tab khác repo. */
  datDuAn?: (d: string | null) => void;
  /**
   * Cha yêu cầu mở một việc cũ (bấm từ thanh bên lịch sử).
   *
   * `lan` tăng mỗi lần bấm, kể cả khi `id` không đổi — bấm lại đúng việc vừa
   * mở phải mở lại được.
   */
  phienCanMo?: { id: string; lan: number };
  /**
   * Mở một việc vừa tách nhánh ra TAB MỚI.
   *
   * Phải là tab mới chứ không phải tab này: cả điểm của tách nhánh là giữ
   * được đường cũ để so: đè bản nhánh lên chính tab đang mở thì nó thành
   * quay lui, chỉ khác là tốn thêm một file trên đĩa.
   */
  onTachRaTabMoi?: (phienId: string) => void;
}) {
  const { dich, dichP, nn } = useDich();
  /** Đợt 5: chữ hai thứ tiếng tại chỗ (không qua từ điển) cho phần CT Work/thẻ lựa chọn mới. */
  const Ld = (vi: string, en: string): string => (nn === 'en' ? en : vi);
  const {
    trangThai, gui, lamTiep, dung, dangDung, batDauLai, traLoiXinPhep, hoanTac, quayLui, luiFile, tachNhanh,
    traLoiHoi, huyCho, huyHen, chenTin,
    phien, phienDangMo, moPhien, xoaPhien, baoTin, datHanMuc,
    tinTraVe, xoaTinTraVe, soLanXong, choChiDan, boChoChiDan,
    goiYTiep, boGoiYTiep, hoiGanCtw, xongHoiGanCtw,
  } = useAgent(cuocId, info);
  /* Đợt 4 — điều khiển máy tính: công tắc TOÀN APP (main giữ), mặc định tắt. */
  const [mayTinh, datMayTinhUi] = useState<{ bat: boolean; hoTro: boolean; quyen: { chup: boolean; dieuKhien: boolean } | null } | null>(null);
  useEffect(() => {
    void window.cuongthai?.agent.mayTinh?.().then((r) => datMayTinhUi(r)).catch(() => undefined);
  }, []);
  const { settings, setSetting, online } = useAppState();
  const { api } = useSession();
  /* ── AI CODE NGOẠI TUYẾN (03/10/2026) ── main tự rẽ lượt xuống máy khi mất
     mạng (`ipc/agent.ts`); ở đây chỉ VẼ cho người dùng biết đã rẽ. */
  const cheDoCode = useCheDoCode();
  const ngoaiTuyen = useGiaoDienNgoaiTuyen({
    dangChay: trangThai.dangChay,
    luotLaCucBo: trangThai.cucBo !== null,
    coModel: !!cheDoCode?.ma,
    choPhep: cheDoCode?.choPhepTuDong ?? true,
  });
  const moCaiNgoaiTuyen = useMoCaiNgoaiTuyen();
  const dangNgoaiTuyen = ngoaiTuyen.nen === 'ngoaiTuyen';
  const tenCucBo = trangThai.cucBo?.ten ?? cheDoCode?.ten ?? '';
  const nhanCucBo = trangThai.cucBo?.nhan ?? cheDoCode?.nhan ?? '';

  /* Mở việc cũ khi thanh bên yêu cầu. Dùng `moPhien` của `useAgent` chứ không
     gọi thẳng IPC — xem chú thích ở `ChatPage.moPhienVaoTab`. */
  useEffect(() => {
    if (phienCanMo) void moPhien(phienCanMo.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phienCanMo?.lan]);
  /** Cảnh báo sau khi quay lui qua một đoạn CÓ sửa file. */
  /*
   * Dải băng sau khi quay lui. Mang theo `moc` (số thứ tự câu hỏi) chứ không chỉ
   * chữ, vì nút "Lùi cả file" cần biết lùi về ĐÂU — và mốc đó phải là mốc của
   * đúng lần quay lui vừa rồi, không phải mốc tính lại từ bảng ghi đã bị cắt.
   */
  const [canhQuayLui, datCanhQuayLui] =
    useState<{ chu: string; moc?: number; soFile?: number } | null>(null);
  const [dangLuiFile, datDangLuiFile] = useState(false);

  /**
   * Thư mục dự án của RIÊNG tab này.
   *
   * Trước đây cha giữ MỘT thư mục rồi phát cho mọi tab — nên hai tab không thể
   * làm hai dự án khác nhau, dù đó chính là lý do người ta mở hai tab.
   */
  const { thuMuc, datThuMuc, napThuMuc } = useThuMuc(cuocId);
  const [nhap, datNhap] = useState('');
  /* Ảnh đang xem phóng to. Dùng lại `AnhPhongTo` của bảng tin thay vì viết
     lightbox thứ hai — nó đã lo chặn cuộn nền, phím Esc và mũi tên. */
  const [anhTo, datAnhTo] = useState<{ ds: string[]; i: number } | null>(null);
  /**
   * Câu đã gõ TRONG LÚC agent đang chạy, chờ gửi khi lượt kết thúc.
   *
   * Trước 24/08/2026 ô nhập bị `disabled` suốt lượt, nên người dùng không
   * GÕ được, chứ đừng nói gửi — muốn nói thêm thì phải bấm Dừng, tức là vứt
   * bỏ một lượt đã trả tiền. Claude Code và Codex đều cho gõ tiếp và xếp
   * hàng; đây là cùng cách.
   *
   * ⛔ XẾP HÀNG chứ KHÔNG chen ngang: gửi giữa lượt sẽ cắt ngang hội thoại
   * mà máy chủ đang giữ, và giao thức ở đây gửi lại CẢ hội thoại mỗi lượt
   * nên chen ngang là hai lượt cùng ghi vào một sổ.
   */
  const [hangCho, datHangCho] = useState<string[]>([]);
  /**
   * Câu trả lời của một lệnh gạch chéo chạy CỤC BỘ (`/help`, `/cost`).
   *
   * ⛔ CỐ Ý nằm NGOÀI `trangThai.muc`. Hội thoại đó được gửi lại TRỌN VẸN lên
   * cổng ở MỖI lượt, nên nhét một bảng trợ giúp vào đó là trả tiền cho nó
   * mãi mãi, ở mọi lượt sau. Nó cũng không phải thứ model cần đọc.
   */
  const [lenhTraLoi, datLenhTraLoi] = useState<string | null>(null);
  /** Nút đi kèm câu trả lời của lệnh (`/usage` → ô nhập key, `/doctor` → cài AI ngoại tuyến). */
  const [lenhNut, datLenhNut] = useState<NutLenh>(null);
  /** `/offline` — tab này đang bị ÉP chạy AI trên máy (nguồn sự thật ở main). */
  const [epCucBo, datEpCucBo] = useState(false);
  /* Trạng thái ép sống ở main — dựng lại khi trang được gắn lại (đổi route rồi
     quay về), nếu không màn hình nói "máy chủ" trong khi lượt sau chạy trên máy. */
  useEffect(() => {
    let con = true;
    void window.cuongthai?.agent.datEpCucBo?.(cuocId)
      .then((r) => { if (con && r) datEpCucBo(r.bat === true); })
      .catch(() => {});
    return () => { con = false; };
  }, [cuocId]);
  /** Vừa `/plan` ⇒ khi lượt xong, mời duyệt kế hoạch rồi mới cho làm. */
  const [choDuyetKH, datChoDuyetKH] = useState(false);

  /*
   * Lệnh gạch chéo do dự án định nghĩa. Nạp lại mỗi khi đổi thư mục — lệnh
   * thuộc về DỰ ÁN, nên mang danh sách của dự án cũ sang dự án mới là bày ra
   * những lệnh không tồn tại ở đây.
   */
  const [lenhDuAn, datLenhDuAn] = useState<Array<{ ten: string; mo: string; than: string }>>([]);

  /*
   * Đoạn `@…` con trỏ đang nằm trong, hoặc `null`.
   *
   * Tính từ vị trí CON TRỎ chứ không từ cả chuỗi: người dùng hay quay lại sửa
   * giữa câu, và nếu chỉ nhìn ký tự cuối thì `@src/a.ts rồi sao nữa` sẽ vẫn mở
   * bảng gợi ý dù con trỏ đã ở cuối câu.
   */


  const [tokenFile, datTokenFile] = useState<TokenFile | null>(null);
  const oNhapRef = useRef<HTMLTextAreaElement | null>(null);

  /**
   * Bung một lệnh của dự án vào ô soạn, và đặt con trỏ vào chỗ cần gõ tiếp.
   *
   * ⚠️ KHÔNG tự gửi. Nội dung lệnh nằm trong repo, nên nó có thể tới từ
   * `git pull` của người khác — tự gửi nghĩa là khởi động một lượt agent tốn
   * tiền với nội dung người dùng chưa từng đọc. Bung ra rồi để họ bấm Enter
   * lần nữa: họ nhìn thấy đúng thứ sắp chạy.
   */
  const bungLenhDuAn = useCallback((than: string, thamSo: string) => {
    /* Vị trí `$ARGUMENTS` TRƯỚC khi thay — để con trỏ dừng đúng chỗ trống khi
       người dùng chưa gõ tham số. Không có nó thì họ nhận một câu thiếu chữ
       giữa dòng và con trỏ ở tận cuối, phải tự đi tìm chỗ cần điền. */
    const oTrong = thamSo.trim() === '' ? than.indexOf('$ARGUMENTS') : -1;
    const chu = ghepThamSo(than, thamSo);
    datNhap(chu);
    datTokenFile(null);
    requestAnimationFrame(() => {
      const o = oNhapRef.current;
      if (!o) return;
      o.focus();
      const vt = oTrong >= 0 ? oTrong : chu.length;
      o.setSelectionRange(vt, vt);
    });
  }, []);
  /* Tấm "Việc đã lưu" cũng vào chung sổ: nó là tấm phủ, và trước đây mở nó
     trong khi bảng MCP đang mở là hai lớp chồng nhau. Nó tự có nền bấm-để-đóng
     nên không cần `boc`. */
  const lichSu = useMoRieng('agent:lichsu', false);
  const moLichSu = lichSu.mo;
  /** Ảnh đã dán, chờ gửi kèm câu hỏi tới. */
  /* Đính kèm: ảnh nhỏ gửi thẳng, mọi thứ khác nằm trên đĩa cho agent tự mở.
     Xem `DinhKemCode.tsx`. Thay hẳn `useState<string[]>` cũ — nó chỉ nhận ảnh
     DÁN vào, không có nút chọn file, không kéo-thả, không nhận PDF/log. */
  const dk = useDinhKemCode(cuocId);
  /* Dán ở bất kỳ đâu trong app — không chỉ khi con trỏ nằm trong ô nhập.
     Xem chú thích ở `useDanKhapNoi` cho lý do `onPaste` trên thẻ gốc không đủ. */
  useDanKhapNoi(dk.them, true);
  const [dangChupMan, datDangChupMan] = useState(false);
  const cuonRef = useRef<HTMLDivElement>(null);

  // Tiêu đề tab = câu hỏi ĐẦU TIÊN, giống cách đặt tên phiên ở main. Một tab
  // tên "Việc mới" mãi mãi thì mở ba tab là không phân biệt được cái nào.
  const cauDau = trangThai.muc.find((m) => m.kieu === 'nguoi');
  useEffect(() => {
    if (cauDau?.kieu === 'nguoi') {
      datTieuDe?.(cauDau.text.slice(0, 40));
    }
  }, [cauDau, datTieuDe]);

  // Báo tên dự án lên thanh tab mỗi khi nó đổi.
  useEffect(() => { datDuAn?.(thuMuc?.name ?? null); }, [thuMuc?.name, datDuAn]);

  /*
   * NÚT NHẢY XUỐNG CUỐI.
   *
   * Người dùng báo 19/08/2026: "đoạn chat dài tôi lướt thủ công bằng tay rất
   * mỏi". Việc agent chạy hàng chục bước làm bảng ghi dài ra rất nhanh, và
   * khi họ kéo lên xem lại một đoạn cũ thì tự-cuộn TẮT (cố ý — bị giật xuống
   * giữa lúc đang đọc còn tệ hơn). Nên phải có đường quay lại.
   *
   * Nút chỉ hiện khi ĐANG Ở XA đáy. Hiện thường trực thì nó che chữ suốt cả
   * những lúc chẳng cần tới.
   */
  /* Khung trình duyệt chia đôi. Hai đường mở:
       • agent gọi `web_mo` → main bắn `agent:moWeb` (nó không tự đặt được
         toạ độ — xem `KhungWeb`) ⇒ `ep: true`, URL là mệnh lệnh;
       • người dùng bấm nút "Khung web" ⇒ `ep: false`, chỉ muốn NHÌN THẤY
         trình duyệt, không muốn cuốn phăng trang đang mở.
     Giữ `ep` trong cùng một state với `url` chứ không tách hai `useState`:
     tách ra là hai lần đặt state cho một sự kiện, và React gộp không đồng bộ
     thì có một khung hình khung mở với cờ `ep` của lần trước. */
  const [web, datWeb] = useState<{ url: string; ep: boolean } | null>(null);
  const webUrl = web?.url ?? null;
  /** localhost:3000 — dev server hay dùng nhất, và chỉ là MẶC ĐỊNH (`ep:false`). */
  const WEB_MAC_DINH = 'http://localhost:3000';
  const batKhungWeb = useCallback(() => {
    datWeb((cu) => (cu ? null : { url: WEB_MAC_DINH, ep: false }));
  }, []);
  /** Gốc của khung — để biết tab này có đang HIỆN không (mọi tab đều dựng). */
  const gocRef = useRef<HTMLDivElement>(null);
  /* Bảng chạy lệnh — mở/đóng bằng nút, KHÔNG tự mở. Nó chiếm chỗ dưới bảng
     ghi, và người dùng phần lớn thời gian không cần tới. */
  const [moBangLenh, datMoBangLenh] = useState(false);
  /* Agent vừa mở terminal hoặc đụng lời hỏi mật khẩu ⇒ BẬT khung Terminal kể
     cả khi đang ẩn: nó sẽ nói "gõ mật khẩu vào terminal", và khung đó phải
     đang hiện. Lọc theo tab: agent của tab khác không được giật khung ở đây. */
  useEffect(() => window.cuongthai?.on('pty:trangThai', (p) => {
    const e = p as { cuocId?: string; nguon?: string; dangChay?: boolean; choNhap?: string | null };
    if (e.cuocId === cuocId && e.nguon === 'agent' && e.dangChay) datMoBangLenh(true);
  }), [cuocId]);
  useEffect(() => {
    const cau = window.cuongthai;
    if (!cau) return;
    return cau.on('agent:moWeb', (p) => {
      const u = (p as { url?: string })?.url;
      if (typeof u === 'string' && u) datWeb({ url: u, ep: true });
    });
  }, []);

  /*
   * KÉO ĐỔI BỀ RỘNG khung trình duyệt.
   *
   * Người dùng muốn cả ba khung đều kéo được như Claude Code. Thanh bên đã
   * có; đây là cái thứ hai, và cái thứ ba (bảng ghi) tự co theo hai cái kia
   * — nó lấy phần còn lại, nên không cần tay nắm riêng.
   *
   * ⚠️ Nghe `pointermove` trên WINDOW. Chuột đi nhanh hơn tốc độ vẽ thì con
   * trỏ rời khỏi vạch kéo giữa chừng, và nghe trên tay nắm là "tuột tay".
   */
  const RONG_WEB_MIN = 320;
  const [dangKeoWeb, datDangKeoWeb] = useState(false);
  const keoWebRef = useRef<{ x: number; rong: number } | null>(null);
  const rongWeb = typeof settings.aiKhungWebRong === 'number'
    ? Math.max(RONG_WEB_MIN, settings.aiKhungWebRong)
    : 560;

  useEffect(() => {
    if (!dangKeoWeb) return;
    const di = (e: PointerEvent): void => {
      const b = keoWebRef.current;
      if (!b) return;
      // Kéo SANG TRÁI ⇒ khung web RỘNG ra, nên trừ chứ không cộng.
      const moi = b.rong - (e.clientX - b.x);
      // Trần theo cửa sổ: để lại ít nhất 380px cho bảng ghi, nếu không người
      // dùng kéo hết cỡ rồi không còn chỗ đọc câu trả lời.
      setSetting('aiKhungWebRong', Math.max(RONG_WEB_MIN, Math.min(moi, window.innerWidth - 380)));
    };
    const tha = (): void => { datDangKeoWeb(false); keoWebRef.current = null; };
    window.addEventListener('pointermove', di);
    window.addEventListener('pointerup', tha, { once: true });
    return () => {
      window.removeEventListener('pointermove', di);
      window.removeEventListener('pointerup', tha);
    };
  }, [dangKeoWeb, setSetting]);

  /*
   * PHÍM TẮT (03/10/2026) — giữ được thao tác khi khung hẹp gom nút vào "⋯".
   * CHỈ tab đang hiện nghe: mọi tab dựng một `AgentMode`, tab ẩn có
   * `offsetParent === null` (cha `display: none`).
   */
  useEffect(() => {
    const phim = (e: KeyboardEvent): void => {
      const goc = gocRef.current;
      if (!goc || goc.offsetParent === null || e.isComposing) return;
      if (e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        datMoBangLenh((v) => !v);
        return;
      }
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'b') batKhungWeb();
      else if (k === 'm') moTam(cuocId, 'model');
      else if (k === 'l') lichSu.bat();
      else if (k === 'y') moTam(cuocId, 'boNho');
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  }, [cuocId, batKhungWeb, lichSu.bat]);

  const [xaDay, datXaDay] = useState(false);
  const XA_DAY_PX = 240;

  const xuongDay = useCallback((muot = true): void => {
    const el = cuonRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: muot ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    const el = cuonRef.current;
    if (!el) return;
    const theo = (): void => {
      /* Bảng ghi CHỈ cuộn dọc. Một khối rộng (bảng, đường dẫn dài) mà lọt
         lưới CSS thì trình duyệt vẫn cho cuộn ngang bằng lập trình (chọn chữ,
         focus, scrollIntoView) — và chữ của MỌI tin nhắn mất ký tự đầu
         ("ản local…"). Kéo về 0 ngay khi lệch. */
      if (el.scrollLeft !== 0) el.scrollLeft = 0;
      datXaDay(el.scrollHeight - el.scrollTop - el.clientHeight > XA_DAY_PX);
    };
    theo();
    el.addEventListener('scroll', theo, { passive: true });
    return () => el.removeEventListener('scroll', theo);
  }, []);

  // Tự cuộn xuống đáy khi có nội dung mới. Chỉ khi người dùng ĐANG ở gần đáy:
  // kéo lên đọc lại một đoạn cũ rồi bị giật xuống là mất chỗ đang đọc.
  useEffect(() => {
    const el = cuonRef.current;
    if (!el) return;
    const ganDay = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (ganDay) el.scrollTop = el.scrollHeight;
    else datXaDay(true);
  }, [trangThai.muc, trangThai.dangNghi]);

  const chonThuMuc = async (): Promise<void> => {
    const w = await window.cuongthai?.agent.chooseWorkspace(cuocId);
    if (w) {
      datThuMuc(w);
      // Main đã xoá hội thoại khi đổi thư mục (bối cảnh cũ không còn đúng);
      // màn hình phải theo, nếu không người dùng nhìn thấy lịch sử của một dự
      // án không còn mở.
      void batDauLai();
    }
  };

  /**
   * Đổi chế độ quyền.
   *
   * Main là nơi SUY RA `choSua`/`choChayLenh` từ chế độ, nên ở đây chỉ nhận
   * lại nguyên trạng thái nó trả về. Tự đoán hai cờ ở renderer là dựng lên
   * nguồn sự thật thứ hai — và hai nguồn thì sẽ có ngày nói ngược nhau.
   */
  const doiCheDoQuyen = async (c: CheDoQuyen): Promise<void> => {
    const w = await window.cuongthai?.agent.datCheDoQuyen(cuocId, c);
    if (w) datThuMuc(w);
  };

  const doiMucNoLuc = async (m: MucNoLuc): Promise<void> => {
    await window.cuongthai?.agent.datMucNoLuc(m);
    const w = await window.cuongthai?.agent.getWorkspace(cuocId);
    if (w) datThuMuc(w);
  };

  /* Odin đang làm gì, tính lại mỗi lần bảng ghi đổi. Suy từ bảng ghi chứ
     không giữ cờ riêng: một cờ riêng là thứ thứ hai phải giữ cho khớp, và nó
     sẽ lệch đúng vào lúc có sự kiện lạ (huỷ giữa chừng, thẻ duyệt hết giờ). */
  const viecHienTai = viecDangLam(trangThai.muc, trangThai.dangNghi, trangThai.suyNghi);

  const doiModel = async (m: ModelAgent): Promise<void> => {
    await window.cuongthai?.agent.datModel(m);
    // Đọc lại thư mục thay vì tự đặt trạng thái: nguồn sự thật là tiến trình
    // main (nó mới là nơi ghi xuống đĩa). Tự đặt ở đây thì giao diện đổi ngay
    // cả khi ghi hỏng — đúng kiểu lỗi chỉ lộ ra sau khi khởi động lại app.
    const w = await window.cuongthai?.agent.getWorkspace(cuocId);
    if (w) datThuMuc(w);
  };

  const doiCheDoTrinhDuyet = async (): Promise<void> => {
    const bat = !thuMuc?.choTrinhDuyet;
    /* NHỚ lựa chọn cho những cuộc sau. Trước bản này nút chỉ sống trong bộ nhớ
       của một cuộc: mở việc mới là tắt lại, và model — không được kể là công
       cụ ấy tồn tại — trả lời "tôi không mở được trang web". Người dùng đọc ra
       thành "app thiếu tính năng". */
    setSetting('aiTrinhDuyetMacDinh', bat);
    const w = await window.cuongthai?.agent.datCheDoTrinhDuyet(cuocId, bat);
    if (w) datThuMuc(w);
  };

  /** Đợt 4 — bật (có xác nhận) / tắt điều khiển máy tính. Trả trạng thái mới. */
  const doiMayTinh = async (bat?: boolean): Promise<{ bat: boolean; hoTro: boolean; quyen: { chup: boolean; dieuKhien: boolean } | null } | null> => {
    const muon = bat ?? !mayTinh?.bat;
    if (muon && !mayTinh?.bat && !window.confirm(dich('Cho agent CHỤP MÀN HÌNH và ĐIỀU KHIỂN chuột/bàn phím máy này?\n\nMọi cú bấm/gõ/phím/cuộn vẫn hỏi bạn từng lần — kể cả chế độ "Bỏ qua tất cả". Tắt lúc nào cũng được.'))) return mayTinh;
    const r = await window.cuongthai?.agent.mayTinh?.(muon).catch(() => null);
    if (r) datMayTinhUi(r);
    return r ?? null;
  };

  const doiCheDoNote = async (): Promise<void> => {
    const w = await window.cuongthai?.agent.datCheDoNote(cuocId, !thuMuc?.choGhiNote);
    if (w) datThuMuc(w);
  };

  const boThuMuc = async (): Promise<void> => {
    const w = await window.cuongthai?.agent.clearWorkspace(cuocId);
    if (w) { datThuMuc(w); void batDauLai(); }
  };

  /** Đặt câu trả lời của một lệnh cục bộ (+ nút kèm nếu có). `null` = đóng. */
  const traLoi = useCallback((md: string | null, nut: NutLenh = null): void => {
    datLenhTraLoi(md);
    datLenhNut(md === null ? null : nut);
  }, []);

  /**
   * Bật/tắt ÉP chạy AI trên máy cho tab này (`/offline`, mục "AI trên máy"
   * trong menu model). Nguồn sự thật ở main (`epCucBo` trong `ipc/agent.ts`) —
   * lấy lại trạng thái nó trả về chứ không tự lật cờ ở đây.
   */
  const doiEpCucBo = useCallback(async (bat: boolean): Promise<boolean> => {
    const r = await window.cuongthai?.agent.datEpCucBo(cuocId, bat);
    const moi = r?.bat === true;
    datEpCucBo(moi);
    if (!moi) ngoaiTuyen.quayVe();
    return moi;
  }, [cuocId, ngoaiTuyen]);

  /**
   * Chạy MỘT câu: lệnh `/` hoặc câu hỏi cho agent.
   *
   * Tách khỏi `guiDi` (03/10/2026) để HÀNG CHỜ đi qua đúng đường này. Bản cũ rút
   * hàng chờ bằng `gui(dau)` thẳng — nên `/clear` gõ lúc agent đang chạy được
   * xếp hàng rồi GỬI CHO MODEL như một câu hỏi, trái với chính chú thích nói
   * "lệnh gạch chéo cũng xếp hàng".
   *
   * `dinhKem` = câu vừa gõ ở ô soạn (mang theo ảnh/file đang đính kèm); câu rút
   * từ hàng chờ thì không — đính kèm đã gửi cùng câu đầu hoặc đã bị bỏ.
   */
  const xuLyCau = (text: string, dinhKem: boolean): void => {
    /* Lệnh của DỰ ÁN, gõ tay kèm tham số: `/rade IOT102` + Enter.
     *
     * Phải bắt Ở ĐÂY chứ không chỉ ở bảng gợi ý: `locLenh` ẩn bảng ngay khi có
     * khoảng trắng, nên đường qua bảng KHÔNG BAO GIỜ chạm tới `$ARGUMENTS`.
     * Thiếu nhánh này thì tham số là một tính năng không có đường nào dùng. */
    const dauCach = text.indexOf(' ');
    const tenLenh = (dauCach < 0 ? text : text.slice(0, dauCach)).toLowerCase();
    const cuaDuAn = lenhDuAn.find((l) => l.ten === tenLenh);
    /* Lệnh dựng sẵn THẮNG lệnh dự án trùng tên — cùng luật với bảng gợi ý. */
    const dungSan = tachLenh(text);
    if (cuaDuAn && !dungSan) {
      bungLenhDuAn(cuaDuAn.than, dauCach < 0 ? '' : text.slice(dauCach + 1));
      return;
    }

    if (dungSan) {
      void chayLenhDungSan(dungSan.ten, dungSan.thamSo, text);
      return;
    }

    /*
     * File nằm trên đĩa được nhắc tới bằng ĐƯỜNG DẪN trong chính câu hỏi.
     *
     * Không nhét vào một trường riêng của giao thức: agent đọc câu hỏi, và một
     * trường phụ mà prompt không nhắc tới thì model bỏ qua — file coi như chưa
     * từng gửi. Một dòng chữ thì nó đọc chắc chắn.
     */
    if (!dinhKem) { void gui(text); return; }
    const duong = dk.duongDanTrenDia;
    const kem = duong.length
      ? `${text}\n\nFile tôi vừa đính kèm (đọc bằng read_file khi cần):\n${duong.map((d) => `- ${d}`).join('\n')}`
      : text;
    const anh = dk.anhGuiThang.length ? dk.anhGuiThang : undefined;
    dk.xoaHet();
    void gui(kem, anh);
  };

  /**
   * LỆNH `/` DỰNG SẴN. Phần thuần (đọc tham số, dựng câu trả lời) ở
   * `lenhGach.ts`; ở đây chỉ nối vào trạng thái của tab.
   *
   * ⛔ Lệnh chạy CỤC BỘ không tốn một lượt nào: chúng đọc trạng thái sẵn có
   * hoặc hỏi máy chủ một route rẻ. Để chúng rơi vào model là trả tiền cho một
   * câu trả lời mà chính app đã biết. Chỉ `/plan`, `/review`, `/init`, `/diff`
   * là câu hỏi cho agent (chúng CẦN agent đọc mã).
   */
  /* ── Đợt 5: CT Work — thẻ lựa chọn (nút + phím số), dòng trạng thái trên ô nhập ── */
  const [dongCtw, datDongCtw] = useState<DongCtw | null>(null);
  const napDongCtw = useCallback(async (): Promise<void> => {
    const r = await window.cuongthai?.agent.ctworkHe?.({ cuocId, viec: 'dong', ngonNgu: nn }).catch(() => null);
    datDongCtw(r?.ok ? (r.dong ?? null) : null);
    // Token hết hạn / bị thu hồi giữa phiên ⇒ đề nghị cấp lại một chạm.
    if (laLoiXacThucCtw(r?.dong?.loi)) void hoiCtworkMotLan(gdCtwRef.current()).catch(() => undefined);
  }, [cuocId, nn]);
  /** Thẻ lựa chọn kiểu CLI: nội dung + hàng nút đánh số (gõ số ở ô nhập trống cũng chọn được). */
  const moTheChon = useCallback((o: TheChonCtw): void => {
    const moTa = o.moTa ? `\n\n${o.moTa.split('\n').map((d) => `_${d}_`).join('  \n')}` : '';
    traLoi(`**${o.tieuDe}**${moTa}${o.than ? `\n\n${o.than}` : ''}`, { chon: o });
  }, [traLoi]);
  /* `napDongCtw` (khai trước) cần gọi `gdCtw` (khai sau) — đi qua ref, khỏi lệ thuộc thứ tự khai. */
  const gdCtwRef = useRef<() => GiaoDienCtw>(() => { throw new Error('chưa sẵn'); });
  const gdCtw = (): GiaoDienCtw => ({
    goi: async <T,>(kenh: string, duLieu?: Record<string, unknown>): Promise<T> => {
      const a = window.cuongthai?.agent;
      if (!a) throw new Error('no bridge');
      if (kenh === 'agent:ctworkHe') return await a.ctworkHe({ cuocId, ...(duLieu ?? {}) } as Parameters<typeof a.ctworkHe>[0]) as T;
      if (kenh === 'agent:ctwork') { const d = (duLieu ?? {}) as { viec: 'noi' | 'ngat' | 'trangThai' | 'capLai'; quyen?: 'doc' | 'ghi' }; return await a.ctwork(cuocId, d.viec, d.quyen) as T; }
      throw new Error(`kênh lạ ${kenh}`);
    },
    traLoi: (md) => traLoi(md),
    chon: moTheChon,
    thongBao: (chu) => traLoi(chu),
    datNhap: (t) => { datNhap(t); requestAnimationFrame(() => oNhapRef.current?.focus()); },
    ngonNgu: nn,
    lamMoiDong: () => { void napDongCtw(); },
  });
  gdCtwRef.current = gdCtw;
  /* Đợt 6: theo dõi nhẹ — lõi tự giới hạn ≥ 60 s, chỉ khi thư mục gắn dự án, tắt bằng /ctwork theo-doi off. */
  const baoTinCtw = useCallback(async (): Promise<void> => {
    const tin = await kiemTinCtw(gdCtwRef.current()).catch(() => [] as string[]);
    for (const t of tin) traLoi(t);
  }, [traLoi]);
  useEffect(() => {
    void napDongCtw();
    const t = setInterval(() => { void napDongCtw(); void baoTinCtw(); }, 60_000);
    return () => clearInterval(t);
  }, [napDongCtw, baoTinCtw]);
  /* Đợt 6: lượt XONG bình thường ⇒ gợi ý bước tiếp theo đúng luật dự án (lõi chỉ trả khi nhánh của thẻ có thay đổi git
     mới, không nhắc lại cùng HEAD) + một lần kiểm tin theo dõi. */
  useEffect(() => {
    if (!soLanXong) return;
    void xongViecCtw(gdCtwRef.current(), undefined, { tuDong: true }).catch(() => undefined);
    void baoTinCtw();
  }, [soLanXong, baoTinCtw]);
  /* Đợt 6: tin gõ giữa lượt chưa tới agent (Esc / lỗi) ⇒ trả về ô nhập (đứng trước chữ đang gõ). */
  useEffect(() => {
    if (!tinTraVe.length) return;
    datNhap((cu) => [...tinTraVe, cu].filter(Boolean).join('\n'));
    xoaTinTraVe();
    requestAnimationFrame(() => oNhapRef.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tinTraVe]);
  useEffect(() => { if (!trangThai.dangChay) void napDongCtw(); }, [trangThai.dangChay, napDongCtw]);
  /* Đợt 8A: câu vừa rồi nhắc `KEY-123` khớp một dự án của bạn mà thư mục chưa gắn ⇒ hỏi gắn MỘT lần (sau lượt). */
  useEffect(() => {
    if (!hoiGanCtw || trangThai.dangChay) return;
    const d = hoiGanCtw;
    xongHoiGanCtw();
    hoiGanDoan(gdCtwRef.current(), d, 'key');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoiGanCtw, trangThai.dangChay]);
  useEffect(() => {
    /* Đợt 8A: nút CT Work trong bảng MCP (đổi dự án · đổi quyền · bỏ gắn · đăng xuất) gửi `giaTri` của `hanhDongMcp`. */
    const f = (e: Event): void => {
      const d = (e as CustomEvent<{ cuocId?: string; giaTri?: string }>).detail;
      if (d?.cuocId !== cuocId) return;
      if (d.giaTri) void lamHanhDongMcp(gdCtwRef.current(), 'ctwork', d.giaTri).then((bao) => { if (bao) traLoi(bao); });
      else void moCtworkTuMcp(gdCtwRef.current());
    };
    window.addEventListener(SU_KIEN_CTW_DU_AN, f);
    return () => window.removeEventListener(SU_KIEN_CTW_DU_AN, f);
  }, [cuocId]);
  useEffect(() => {
    if (daHoiCtworkLanNay) return undefined;
    const t = setTimeout(() => {
      if (daHoiCtworkLanNay) return;
      daHoiCtworkLanNay = true;
      /* Đợt 6: không có gì để hỏi (đã nối + đã gắn) ⇒ "Hôm nay" (lõi: một lần mỗi ngày mỗi thư mục). */
      void hoiCtworkMotLan(gdCtw()).then((coHoi) => { if (!coHoi) void homNayCtw(gdCtwRef.current(), { tuDong: true }).catch(() => undefined); }).catch(() => undefined)
        /* 28/10/2026: repo git ⇒ fetch lặng lẽ, nhánh đang sau GitHub thì hỏi pull (`gitDongBoLenh.ts`). */
        .finally(() => { void hoiDongBoGit(gdCtwRef.current(), { tuDong: true }).catch(() => undefined); });
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuocId]);

  const chayLenhDungSan = async (ten: string, thamSo: string, goc: string): Promise<void> => {
    const b = window.cuongthai?.agent;
    if (!b) return;
    const dsModel = dsModelCua(info);
    const dsMuc = dsMucCua(info);
    switch (ten) {
      case '/help':
        traLoi(moTaTroGiup(LENH_AGENT, lenhDuAn));
        return;

      case '/clear':
        dk.xoaHet();
        datChoDuyetKH(false);
        traLoi(null);
        void batDauLai();
        return;

      /*
       * `/kynang` — mượn kỹ năng từ kho `/ai-templates` (1.877 component).
       *
       * Kho đó và AI Code theo CÙNG quy ước Claude Code, nên "học" một kỹ năng
       * chỉ là chép đúng tệp vào đúng thư mục — không cần dịch gì cả. Xem
       * `main/agent/khoKyNang.ts`.
       *
       * ⚠️ CỐ Ý không cài được hook và MCP từ đây: chúng là dòng lệnh SẼ CHẠY
       * trên máy, và chúng có cửa duyệt vân tay riêng. Ba loại ở đây là CHỮ đi
       * vào ngữ cảnh của model — rủi ro khác hẳn, nên đường vào cũng khác.
       */
      case '/kynang': {
        const phan = thamSo.split(/\s+/).filter(Boolean);
        if (phan[0] === 'cai' || phan[0] === 'install') {
          const tenKn = phan[1];
          if (!tenKn) { traLoi('Thiếu tên. Ví dụ: `/kynang cai database-optimizer`'); return; }
          const ghiDe = phan.includes('--de');
          traLoi(`Đang tải \`${tenKn}\`…`);
          /* Tìm lại để biết LOẠI — người dùng chỉ gõ tên. Trùng tên giữa hai
             loại thì ưu tiên `skill`: đó là loại đông nhất và cũng là thứ họ
             gõ `/kynang` để tìm. */
          const kq = await b.khoTim(cuocId, tenKn);
          const m = kq.find((x) => x.ten === tenKn) ?? kq[0];
          if (!m) { traLoi(`Không tìm thấy \`${tenKn}\` trong kho.`); return; }
          const r = await b.khoCai(cuocId, m.ten, m.loai, ghiDe);
          traLoi(r.ok
            ? `Đã cài **${m.ten}** (${m.loai}) vào \`${r.duongDan}\`.\n\n`
              + 'Agent thấy nó từ lượt sau. Xem lại bằng `git diff` trước khi commit — '
              + 'đây là nội dung từ repo của người khác.\n\n```\n'
              + `${(r.xemTruoc ?? '').slice(0, 600)}\n\`\`\``
            : `Không cài được: ${r.loi}`);
          return;
        }
        const tuKhoa = thamSo.trim();
        if (!tuKhoa) {
          /* Trọn khối markdown là MỘT mục từ điển. Cắt theo dòng rồi nối lại
             thì bản dịch không đảo được trật tự, mà tiếng Anh cần đảo ở đúng
             những dòng có chỗ thay. */
          traLoi(dich('**Kho AI Templates** — 871 kỹ năng · 421 agent phụ · 286 lệnh.\n\n- Tìm: `/kynang <từ khoá>` (bỏ dấu cũng ra — `bao mat`)\n- Cài: `/kynang cai <tên>` · ghi đè: thêm `--de`\n\n_Hook và MCP không cài từ đây — chúng là lệnh sẽ chạy, và có cửa duyệt riêng._'));
          return;
        }
        const ds = await b.khoTim(cuocId, tuKhoa).catch(() => []);
        traLoi(ds.length === 0
          ? dichP('Không có gì khớp "{tu}".', { tu: tuKhoa })
          : `**${ds.length}** kết quả cho "${tuKhoa}":\n\n`
            + ds.map((x) => `- \`${x.ten}\` · ${x.loai} · ${x.danhMuc}`).join('\n')
            + '\n\nCài: `/kynang cai <tên>`');
        return;
      }

      /*
       * `/quyen` — xem và thu hồi danh sách "Luôn cho phép".
       *
       * Một danh sách cho phép KHÔNG xoá được là một cái bẫy: người dùng bấm một
       * lần lúc vội, rồi không bao giờ tìm lại được thứ mình đã cho phép.
       */
      case '/quyen': {
        const dau = thamSo.split(/\s+/).filter(Boolean);
        /* Đợt 3: thêm TIỀN TỐ — `/quyen them npm test` ⇒ mọi lệnh ĐƠN bắt đầu bằng `npm test`. */
        if (dau[0] === 'them' || dau[0] === 'thêm' || dau[0] === 'add') {
          const tt = dau.slice(1).join(' ').replace(/\s*(\*|…)$/, '').trim();
          if (!tt) { traLoi('Gõ tiền tố: `/quyen them npm test` ⇒ mọi lệnh ĐƠN bắt đầu bằng `npm test` tự chạy ở dự án này.'); return; }
          const r = await b.themTienTo(cuocId, tt);
          traLoi(r.ok ? `Đã cho phép lâu dài mọi lệnh bắt đầu bằng \`${tt}\` (lệnh nối \`;\` \`&&\` \`|\` \`$(…)\` vẫn hỏi).` : `⚠ ${r.loi ?? '?'}`);
          return;
        }
        if ((dau[0] === 'xoa' || dau[0] === 'clear') && /^\d+$/.test(dau[1] ?? '')) {
          const ds = await b.dsQuyenLau(cuocId);
          const k = ds?.khoa[Number(dau[1]) - 1];
          if (k) { const n = await b.xoaQuyenLau(cuocId, k); traLoi(n ? `Đã thu hồi \`${k}\`.` : 'Không có quyền nào bị thu hồi.'); return; }
        }
        if (dau[0] === 'xoa' || dau[0] === 'clear') {
          const rieng = dau.slice(1).join(' ').trim();
          const n = await b.xoaQuyenLau(cuocId, rieng || undefined) ?? 0;
          traLoi(n === 0
            ? dich('Không có quyền nào bị thu hồi.')
            : `Đã thu hồi **${n}** quyền${rieng ? ` cho \`${rieng}\`` : ' của dự án này'}.`);
          return;
        }
        const r = await b.dsQuyenLau(cuocId);
        if (!r?.goc) { traLoi(dich('Tab này chưa mở dự án nào.')); return; }
        /* Đợt 5: thẻ lựa chọn (nút + phím số) như CLI. */
        if (!thamSo.trim()) {
          const hien = (k: string): string => (k.startsWith('tien-to:') ? `\`${k.slice(8)} …\` ${Ld('(mọi lệnh bắt đầu bằng)', '(any command starting with)')}` : `\`${k}\``);
          moTheChon({
            tieuDe: Ld('Quyền "Luôn cho phép"', '"Always allow" permissions'),
            than: `${r.khoa.length ? r.khoa.map((x, k) => `${k + 1}. ${hien(x)}`).join('\n') : Ld('_(chưa có quyền nào — nút nằm trên thẻ duyệt)_', '_(none yet — the button is on approval cards)_')}\n\n⎿ \`${r.goc}\``,
            ds: [
              { nhan: Ld('Thêm tiền tố lệnh…', 'Add a command prefix…'), giaTri: 'them' },
              ...r.khoa.slice(0, 7).map((x, k) => ({ nhan: `${Ld('Thu hồi', 'Revoke')} ${x.startsWith('tien-to:') ? `${x.slice(8)} …` : x}`, giaTri: `xoa ${k + 1}` })),
              ...(r.khoa.length ? [{ nhan: Ld('Thu hồi tất cả', 'Revoke all'), giaTri: 'xoa' }] : []),
              { nhan: Ld('Đóng', 'Close'), giaTri: 'dong', so: '0' },
            ],
            khiChon: async (g) => { if (g === 'them') datNhap('/quyen them '); else if (g !== 'dong') await chayLenhDungSan('/quyen', g, `/quyen ${g}`); },
          });
          return;
        }
        traLoi(r.khoa.length === 0
          ? dichP('Dự án `{goc}` chưa có quyền nào được "Luôn cho phép".\n\n_Nút đó nằm trên thẻ duyệt, cạnh "Cho phép"._', { goc: r.goc ?? '' })
          : dichP('**{n}** thứ đang được tự duyệt ở `{goc}`:', { n: r.khoa.length, goc: r.goc ?? '' })
            + '\n\n'
            + r.khoa.map((x) => `- \`${x}\``).join('\n')
            + '\n\n'
            + dich('Thu hồi tất cả: `/quyen xoa` · thu hồi một cái: `/quyen xoa <nguyên văn>`'));
        return;
      }

      /* ── Đợt 3 (18/10/2026) · i18n đợt 4 ── */
      case '/sessions': {
        const r = await b.dsPhienMang(cuocId);
        const dau = r.toi
          ? dichP('Phiên này: **{ten}** (`{id}`)', { ten: r.toi.ten, id: r.toi.id })
          : dich('Phiên này chưa đăng ký (đăng ký sau lượt đầu tiên).');
        /* Đợt 5: nút đổi tên / nhờ agent nhắn (như thẻ của CLI). */
        moTheChon({
          tieuDe: Ld('Phiên CuongMini trên máy này', 'CuongMini sessions on this machine'),
          than: `${dau}\n\n${r.ds.length ? r.ds.map((x) => `- \`${x.id}\` **${x.ten}** · ${x.noi} · ${x.trangThai === 'dangChay' ? dich('đang chạy') : dich('rảnh')} · ${x.thuMuc ?? '—'}`).join('\n') : dich('Không có phiên CuongMini nào khác đang mở trên máy này.')}`,
          ds: [
            { nhan: Ld('Đổi tên phiên này…', 'Rename this session…'), giaTri: 'ten' },
            ...(r.ds.length ? [{ nhan: Ld('Nhờ agent nhắn một phiên…', 'Ask the agent to message a session…'), giaTri: 'nhan' }] : []),
            { nhan: Ld('Đóng', 'Close'), giaTri: 'dong', so: '0' },
          ],
          khiChon: (g) => { if (g === 'ten') datNhap('/rename '); else if (g === 'nhan') datNhap(Ld(`Nhắn phiên ${r.ds[0]!.id}: `, `Message session ${r.ds[0]!.id}: `)); },
        });
        return;
      }
      case '/rename': {
        if (!thamSo.trim()) { traLoi(dich('Gõ tên: `/rename backend-api`')); return; }
        const m = await b.doiTenPhienMang(cuocId, thamSo.trim().slice(0, 60));
        traLoi(m ? dichP('Đã đặt tên phiên: **{ten}** (`{id}`).', { ten: m.ten, id: m.id }) : dich('Không đổi được tên.'));
        return;
      }
      case '/worktree': {
        const d = thamSo.split(/\s+/).filter(Boolean);
        const ds = await b.dsWorktree(cuocId);
        if ((!d.length || d[0] === 'list' || d[0] === 'ds') && ds.length) {
          /* Đợt 5: thẻ lựa chọn (tạo / xoá worktree) như CLI. */
          moTheChon({
            tieuDe: 'Git worktree',
            than: ds.map((w) => `- ${w.dangDung ? '▶ ' : ''}\`${w.duongDan}\` · ${w.nhanh ?? dich('(tách rời)')}${w.laChinh ? ` · ${dich('cây chính')}` : ''}`).join('\n'),
            ds: [
              { nhan: Ld('Tạo worktree mới…', 'Create a new worktree…'), giaTri: 'tao', mo: Ld('nhánh agent/<tên>', 'branch agent/<name>') },
              ...ds.filter((w) => !w.laChinh).slice(0, 6).map((w) => ({ nhan: `${Ld('Xoá', 'Remove')} ${w.nhanh ?? w.duongDan}`, giaTri: `xoa ${w.duongDan}` })),
              { nhan: Ld('Đóng', 'Close'), giaTri: 'dong', so: '0' },
            ],
            khiChon: async (g) => { if (g === 'tao') datNhap('/worktree '); else if (g !== 'dong') await chayLenhDungSan('/worktree', g, `/worktree ${g}`); },
          });
          return;
        }
        if (!d.length || d[0] === 'list' || d[0] === 'ds') {
          traLoi(ds.length
            ? `${dich('Worktree của repo:')}\n\n${ds.map((w) => `- ${w.dangDung ? '▶ ' : ''}\`${w.duongDan}\` · ${w.nhanh ?? dich('(tách rời)')}${w.laChinh ? ` · ${dich('cây chính')}` : ''}`).join('\n')}\n\n${dich('Tạo: `/worktree <tên>` · xoá: `/worktree xoa <đường>` · hoặc nút ⎇ ở thanh trên.')}`
            : dich('Thư mục này không phải kho git.'));
          return;
        }
        if (d[0] === 'xoa' || d[0] === 'remove') {
          const r = await b.xoaWorktree(cuocId, d.slice(1).join(' '));
          traLoi(r.ok ? dich('Đã xoá worktree (nhánh giữ lại).') : `⚠ ${r.loi ?? '?'}`);
          return;
        }
        const r = await b.taoWorktree(cuocId, d.join('-'));
        if (!r.ok) { traLoi(`⚠ ${r.loi ?? dich('Không tạo được worktree.')}`); return; }
        void napThuMuc(); void batDauLai();
        return;
      }
      case '/ctwork': case '/issue': case '/sprint': case '/viec':
        /* Đợt 5: bộ lệnh CT Work CHUNG ba nơi — menu đánh số, thẻ xem trước khi ghi. */
        await lenhCtwork(ten, thamSo, gdCtw());
        return;
      case '/dong-bo':
        /* 28/10/2026: đồng bộ git ↔ GitHub ↔ repo dự án — chung ba nơi (`gitDongBoLenh.ts`). */
        await lenhDongBo(thamSo, gdCtw());
        return;
      case '/hen': {
        const d = thamSo.split(/\s+/).filter(Boolean);
        if (d[0] === 'huy' || d[0] === 'cancel') { const n = await b.huyHen(cuocId, d[1]?.replace(/^#/, '')); traLoi(dichP('Đã huỷ {n} hẹn.', { n })); return; }
        /* Đợt 4: hẹn ĐÃ LỠ lúc app tắt — chạy bù / bỏ. */
        if (['chay-bu', 'run-missed', 'bo-lo', 'drop-missed'].includes(d[0] ?? '')) {
          const chay = d[0] === 'chay-bu' || d[0] === 'run-missed';
          const x = await b.xuLyHenLo(chay ? 'chay' : 'bo');
          traLoi(chay ? dichP('Đang chạy bù {n} hẹn — mỗi hẹn mở lại đúng việc của nó (xem ở Lịch sử).', { n: x.n }) : dichP('Đã bỏ {n} hẹn đã lỡ.', { n: x.n }));
          return;
        }
        const r = await b.henCho(cuocId);
        const lo = (await b.henLo().catch(() => ({ ds: [] as Array<{ luc: number; lyDo: string }> }))).ds;
        const gio = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dong = [
          ...r.cho.map((c) => `- ⏳ ${dich('Đang chờ')}: ${c.moTa}`),
          ...r.hen.map((h) => `- ⏰ \`${h.id}\` ${gio(h.luc)}${h.cron ? ` · cron \`${h.cron}\` · ${dichP('còn {n}×', { n: h.conLai })}` : h.lap ? ` · ${dichP('lặp mỗi {p}′ · còn {n}×', { p: h.phut, n: h.conLai })}` : ''} — ${h.lyDo}`),
          ...(lo.length ? ['', dichP('**Đã lỡ {n} hẹn** lúc app tắt — `/hen chay-bu` để chạy bù, `/hen bo-lo` để bỏ:', { n: lo.length }), ...lo.map((h) => `- ${new Date(h.luc).toLocaleString()} — ${h.lyDo}`)] : []),
        ];
        if (dong.length) {
          /* Đợt 5: nút (như thẻ lựa chọn của CLI) — huỷ từng hẹn, chạy bù / bỏ hẹn đã lỡ. */
          moTheChon({
            tieuDe: Ld('Chờ & hẹn của agent', 'Agent waits & schedules'),
            than: [...dong, '', dich('Huỷ: `/hen huy <id>` · `/hen huy` (tất cả). Hẹn được lưu xuống đĩa: app tắt lúc tới giờ thì lần mở sau được hỏi chạy bù. Đóng cửa sổ mà còn hẹn ⇒ app chạy nền (biểu tượng khay).')].join('\n'),
            ds: [
              ...r.hen.slice(0, 5).map((h) => ({ nhan: `${Ld('Huỷ hẹn', 'Cancel')} ${h.id}`, giaTri: `huy ${h.id}` })),
              ...(r.hen.length > 1 ? [{ nhan: Ld('Huỷ tất cả', 'Cancel all'), giaTri: 'huy' }] : []),
              ...(lo.length ? [{ nhan: Ld('Chạy bù hẹn đã lỡ', 'Run missed'), giaTri: 'chay-bu' }, { nhan: Ld('Bỏ hẹn đã lỡ', 'Drop missed'), giaTri: 'bo-lo' }] : []),
              { nhan: Ld('Đóng', 'Close'), giaTri: 'dong', so: '0' },
            ],
            khiChon: async (g) => { if (g !== 'dong') await chayLenhDungSan('/hen', g, `/hen ${g}`); },
          });
          return;
        }
        traLoi(dich('Không có việc chờ hay hẹn nào.'));
        return;
      }
      /* ── Đợt 4: điều khiển máy tính ── */
      case '/may': {
        const q = thamSo.trim().toLowerCase();
        const bat = /^(on|bat|bật|1)$/.test(q) ? true : /^(off|tat|tắt|0)$/.test(q) ? false : undefined;
        const r = bat === undefined ? mayTinh : await doiMayTinh(bat);
        if (!r) { traLoi(dich('Bản app này chưa đọc được trạng thái điều khiển máy tính.')); return; }
        if (!r.hoTro) { traLoi(dich('Nền tảng này chưa hỗ trợ điều khiển máy tính.')); return; }
        const thieu = r.quyen && (!r.quyen.chup || !r.quyen.dieuKhien)
          ? `\n\n${dich('⚠ macOS còn thiếu quyền cho app CuongThai')}: ${[!r.quyen.chup ? dich('Ghi màn hình') : '', !r.quyen.dieuKhien ? dich('Trợ năng') : ''].filter(Boolean).join(' + ')} — System Settings → Privacy & Security.`
          : '';
        traLoi(`${r.bat
          ? dich('🖥 Điều khiển máy tính: **BẬT** — agent chụp màn hình được; MỌI cú bấm/gõ/phím/cuộn đều hỏi bạn, kể cả "Bỏ qua tất cả". Tắt: `/may off` hoặc nút Máy tính.')
          : dich('🖥 Điều khiển máy tính: **TẮT** (mặc định). Bật: `/may on` hoặc nút Máy tính ở thanh trên.')}${thieu}`);
        return;
      }

      case '/cost': {
        const q = trangThai.hanMuc;
        traLoi(
          dich('**Chi phí việc này**') + '\n\n'
          + dichP('- Đã tiêu: **~${tien}**\n', { tien: trangThai.tienPhien.toFixed(3) })
          /* `buoc` là `{ nay, tran }`, không phải số — lấy `nay`. */
          + dichP('- Số bước đã đi: {n}\n', { n: trangThai.buoc?.nay ?? 0 })
          + (q ? dichP('- Hạn mức 5 giờ: còn **{con}** / {tran} token\n', {
            con: Math.max(0, q.tran - q.daDung).toLocaleString('vi-VN'),
            tran: q.tran.toLocaleString('vi-VN'),
          }) : '')
          + dichP('- File đã sửa (hoàn tác được): {n}\n\n', { n: trangThai.soFileDaSua })
          + dich('_Con số là ƯỚC LƯỢNG — cổng không công khai giá. Chi tiết hạn mức: `/usage`._'),
        );
        return;
      }

      case '/undo':
        if (trangThai.soFileDaSua === 0) { traLoi(dich('Chưa có file nào để hoàn tác trong việc này.')); return; }
        traLoi(null);
        void hoanTac();
        return;

      /* `/diff` cần đọc đĩa, mà chỉ agent mới có quyền đó — nên nó là một câu
         hỏi cho agent (vẫn tốn một lượt), gửi ở chế độ CHỈ ĐỌC. */
      case '/diff':
        traLoi(null);
        void gui('Chạy git_diff rồi tóm tắt ngắn gọn những gì đã thay đổi trong dự án.', undefined, { chiDoc: true, hienThi: goc });
        return;

      // ── Nhóm 1 ────────────────────────────────────────────────
      case '/model': {
        const q = thamSo.trim();
        if (!q) { moTam(cuocId, 'model'); traLoi(null); return; }
        const qc = q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        if (/^(du ?phong|fallback)$/.test(qc)) { moTam(cuocId, 'model'); traLoi('Mở menu model — mục **Dùng cổng dự phòng** ở dưới danh sách.'); return; }
        if (/^(offline|ngoai ?tuyen|may|local|tren may)$/.test(qc)) { await chayLenhDungSan('/offline', 'bat', goc); return; }
        if (/^(server|may ?chu|online)$/.test(qc)) { await chayLenhDungSan('/offline', 'tat', goc); return; }
        const m = timTheoChu(q, dsModel);
        if (!m) {
          traLoi(`Không rõ model "${q}". Có:\n\n${dsModel.map((x) => `- \`${x.id}\` — ${x.ten}${x.dungDuoc ? '' : ' (chưa cắm khoá)'}`).join('\n')}\n\nGõ \`/model\` không tham số để mở menu.`);
          return;
        }
        if (!m.dungDuoc) { traLoi(`**${m.ten}** chưa dùng được — máy chủ chưa cắm khoá cho nhà cung cấp này.`); return; }
        /* Model cao của cổng Claude chính hãng chưa mở khoá ⇒ ô mật khẩu nằm trong menu. */
        if (m.canMoKhoa) { moTam(cuocId, 'model'); traLoi(`**${m.ten}** cần mật khẩu cổng Claude chính hãng — bấm vào nó trong menu vừa mở để mở khoá.`); return; }
        /* Model đắt (Fable ×3,5) phải qua thẻ xác nhận trong menu — gõ tắt
           không được là cửa sau vượt qua câu hỏi đó. */
        if (m.dat) { moTam(cuocId, 'model'); traLoi(`**${m.ten}** tốn gấp 3,5 lần — xác nhận trong menu vừa mở.`); return; }
        await doiModel(m.id);
        traLoi(`Đã đổi model sang **${m.ten}** — ${m.mo}.`);
        return;
      }

      case '/effort': {
        const q = thamSo.trim();
        const nay = thuMuc?.mucNoLuc ?? 'vua';
        if (!q) {
          traLoi(`**Mức nỗ lực** — gõ \`/effort <mức>\`:\n\n${dsMuc.map((x) => `- ${x.id === nay ? '**▸ ' : ''}${x.ten}${x.id === nay ? '**' : ''} — ${x.mo}`).join('\n')}`);
          return;
        }
        const m = timMuc(q, dsMuc);
        if (!m) { traLoi(`Không rõ mức "${q}". Có: ${dsMuc.map((x) => x.ten).join(' · ')}.`); return; }
        await doiMucNoLuc(m.id);
        traLoi(`Đã đổi mức nỗ lực sang **${m.ten}** — ${m.mo}.`);
        return;
      }

      case '/usage': {
        if (!api) { traLoi('Chưa đăng nhập.'); return; }
        traLoi('Đang hỏi hạn mức…');
        /* Đợt 8A: lõi hỏi máy chủ kèm model + dự án CT Work của phiên ⇒ hạn mức THẬT đang chặn; máy chủ cũ ⇒ cách cũ. */
        try {
          const d2 = await window.cuongthai?.agent.usage?.(cuocId);
          const md2 = d2 ? moTaUsage2(d2, { nguCanhPhanTram: trangThai.nguCanh?.phanTram ?? null, tienPhien: trangThai.tienPhien }, (document.documentElement.lang || 'vi').startsWith('en') ? 'en' : 'vi') : null;
          if (md2) {
            if (typeof d2?.phanTram === 'number') datHanMuc({ daDung: d2.daDung, tran: d2.tran, phanTram: d2.phanTram, hoiLucNao: d2.hoiLucNao });
            traLoi(md2);
            return;
          }
        } catch { /* lùi cách cũ */ }
        try {
          const u = await layUsage((d) => api.request(d));
          datHanMuc({ daDung: u.daDung, tran: u.tran, phanTram: u.phanTram, hoiLucNao: u.hoiLucNao });
          traLoi(moTaUsage(u), u.coKeyGiaHan ? 'nhapKey' : null);
        } catch (e) {
          traLoi(`Không đọc được hạn mức: ${(e as Error).message}`);
        }
        return;
      }

      case '/context': {
        const ct = await b.nguCanhChiTiet(cuocId);
        traLoi(moTaNguCanh(ct, trangThai.nguCanh?.tran ?? 600_000, trangThai.nguCanh?.soLuotDaBo ?? 0));
        return;
      }

      case '/compact': {
        traLoi(`Đang tóm tắt phần cũ${thamSo ? ` (giữ: ${thamSo})` : ''}…`);
        const r = await b.compact(cuocId, thamSo || undefined);
        if (!r.ok) { traLoi(`Không /compact được: ${r.loi}`); return; }
        if (r.soTinDaGop === 0) { traLoi('Việc này còn ngắn (chưa quá 2 lượt) — chưa có gì để gộp.'); return; }
        const k = (n?: number): string => (n === undefined ? '?' : `${Math.round(n / 1000)}k`);
        baoTin(`Từ đây trở lên: ${r.soLuotDaGop ?? '?'} lượt đầu đã được tóm tắt (/compact) — agent đọc bản tóm tắt, bạn vẫn cuộn đọc được bản đầy đủ.`, 'COMPACT');
        traLoi(`Đã gộp **${r.soLuotDaGop ?? '?'} lượt đầu** vào một bản tóm tắt. Ngữ cảnh gửi lên: **${k(r.kyTuTruoc)} → ${k(r.kyTuSau)}** ký tự.\n\n`
          + `Bản đầy đủ vẫn ở trên để bạn đọc; quay lui về trước điểm gộp thì bản tóm tắt tự bỏ.\n\n> ${(r.xemTruoc ?? '').split('\n').slice(0, 8).join('\n> ')}`);
        return;
      }

      case '/status': {
        const app = await window.cuongthai?.app.getInfo().catch(() => null);
        const nayModel = dsModel.find((x) => x.id === (thuMuc?.model ?? 'cm-default'));
        const nayMuc = dsMuc.find((x) => x.id === (thuMuc?.mucNoLuc ?? 'vua'));
        const duPhong = trangThai.muc.some((m) => m.kieu === 'loi' && m.ma === 'DOI_CONG');
        traLoi(moTaTrangThai({
          phienBan: app?.version ?? '?',
          cong: epCucBo ? 'epNgoaiTuyen' : dangNgoaiTuyen ? 'ngoaiTuyen' : duPhong ? 'duPhong' : 'chinh',
          online,
          ...(tenCucBo ? { tenCucBo } : {}),
          duAn: thuMuc?.name ?? null,
          duongDan: thuMuc?.path ?? null,
          nhanh: thuMuc?.branch ?? null,
          model: nayModel?.ten ?? thuMuc?.model ?? '?',
          muc: nayMuc?.ten ?? '?',
          cheDo: TEN_CHE_DO[thuMuc?.cheDoQuyen ?? 'keHoach'],
          tomTat: trangThai.muc.some((m) => m.kieu === 'loi' && m.ma === 'COMPACT'),
        }));
        return;
      }

      // ── Nhóm 2 ────────────────────────────────────────────────
      case '/plan': {
        if (!thamSo) { traLoi('Gõ việc cần lập kế hoạch: `/plan thêm trang cài đặt cho AI ngoại tuyến`. Lượt đó CHỈ ĐỌC — không sửa file, không chạy lệnh — rồi bạn duyệt mới làm.'); return; }
        traLoi(null);
        datChoDuyetKH(true);
        void gui(promptPlan(thamSo), undefined, { chiDoc: true, hienThi: goc });
        return;
      }

      case '/review':
        if (!coThuMuc) { traLoi(dich('Tab này chưa mở dự án nào.')); return; }
        traLoi(null);
        void gui(promptReview(thamSo), undefined, { chiDoc: true, hienThi: goc });
        return;

      case '/init': {
        if (!coThuMuc) { traLoi('Chọn thư mục dự án trước — `/init` ghi `AGENTS.md` vào gốc dự án.'); return; }
        /* Ghi file cần quyền sửa. Ở chế độ chỉ đọc thì nâng lên "Hỏi từng việc"
           — mỗi lần ghi VẪN hiện thẻ duyệt, nên không có gì tự ghi sau lưng. */
        if ((thuMuc?.cheDoQuyen ?? 'keHoach') === 'keHoach') {
          await doiCheDoQuyen('hoi');
          baoTin('Đã chuyển sang chế độ "Hỏi từng việc" để agent ghi AGENTS.md — mỗi lần ghi vẫn hỏi bạn.', 'DOI_CHE_DO');
        }
        traLoi(null);
        void gui(PROMPT_INIT, undefined, { hienThi: goc });
        return;
      }

      case '/resume': {
        if (!thamSo) { lichSu.bat(); traLoi(moTaDsPhien(locPhien(phien, ''))); return; }
        const p = chonPhien(phien, thamSo);
        if (!p) { traLoi(moTaDsPhien(locPhien(phien, thamSo))); return; }
        traLoi(null);
        void moPhien(p.id);
        return;
      }

      case '/rewind': {
        const ds = dsCauHoi(trangThai.muc);
        const n = Number(thamSo);
        if (!thamSo || !Number.isInteger(n)) { traLoi(moTaDsCauHoi(ds)); return; }
        if (n < 1 || n > ds.length) { traLoi(`Không có câu hỏi thứ ${n} (việc này có ${ds.length} câu).`); return; }
        traLoi(null);
        const r = await quayLui(n);
        if (!r) return;
        datNhap(r.cauHoi);
        /* "Khôi phục hội thoại + file": dùng ĐÚNG điểm lưu theo lượt mà nút
           "Lùi cả file" vẫn dùng (`luiFile` — mỗi câu hỏi là một mốc). */
        if (r.soFileSeLui > 0) {
          const kq = await luiFile(n);
          datCanhQuayLui({
            chu: kq === null
              ? 'Đã quay lui hội thoại, nhưng lùi file hỏng — xem dòng lỗi trên bảng ghi.'
              : `Đã quay về câu ${n}: cắt hội thoại và lùi ${kq.soFile} file về trước câu đó.`
                + (kq.loi.length > 0 ? ` ${kq.loi.length} file không lùi được: ${kq.loi.join('; ')}` : ''),
          });
        } else {
          datCanhQuayLui({
            chu: r.coSuaFile
              ? `Đã quay về câu ${n}. Đoạn vừa bỏ có chạy lệnh — thay đổi do lệnh gây ra không lùi được tự động.`
              : `Đã quay về câu ${n}. Câu hỏi đó đã nằm lại trong ô soạn để bạn sửa và gửi lại.`,
          });
        }
        return;
      }

      case '/memory': moTam(cuocId, 'boNho'); traLoi(null); return;
      case '/hooks': moTam(cuocId, 'hook'); traLoi(null); return;
      case '/mcp': moTam(cuocId, 'mcp'); traLoi(null); return;

      // ── Nhóm 3 ────────────────────────────────────────────────
      case '/export': {
        if (trangThai.muc.length === 0) { traLoi('Việc này chưa có gì để xuất.'); return; }
        const luc = new Date();
        const tieuDe = cauDau?.kieu === 'nguoi' ? cauDau.text.slice(0, 80) : 'Việc AI Code';
        const md = xuatMarkdown(trangThai.muc, { tieuDe, duAn: thuMuc?.name ?? null, luc });
        const r = await window.cuongthai?.app.luuFile(tenFileXuat(tieuDe, luc), new TextEncoder().encode(md));
        traLoi(r?.ok ? `Đã xuất ${trangThai.muc.length} mục ra file Markdown (${Math.round(md.length / 1024)} KB).`
          : r?.huy ? 'Đã huỷ xuất.' : `Không lưu được: ${r?.loi ?? 'lỗi không rõ'}`);
        return;
      }

      case '/doctor': {
        traLoi('Đang chẩn đoán…');
        const ds = await b.chanDoan(cuocId).catch((e: unknown) => [{ ten: 'Chẩn đoán', muc: 'loi' as const, chiTiet: (e as Error).message }]);
        traLoi(moTaChanDoan(ds), ds.some((m) => m.ten === 'AI ngoại tuyến' && m.muc !== 'ok') ? 'caiNgoaiTuyen' : null);
        return;
      }

      case '/offline': {
        const q = thamSo.trim().toLowerCase();
        const bat = q === 'bat' || q === 'bật' || q === 'on' ? true : q === 'tat' || q === 'tắt' || q === 'off' ? false : !epCucBo;
        if (bat && !cheDoCode?.ma) {
          traLoi(`Máy này chưa có AI ngoại tuyến cho AI Code. ${cheDoCode?.vi ?? ''}`.trim(), 'caiNgoaiTuyen');
          return;
        }
        const moi = await doiEpCucBo(bat);
        traLoi(moi
          ? `Tab này giờ chạy bằng **${tenCucBo || 'AI trên máy'}** (không gửi lên máy chủ) cho tới khi gõ \`/offline\` lần nữa. Model nhỏ — có thể sót, kiểm lại khi cần.`
          : 'Đã quay về AI máy chủ cho tab này.');
        return;
      }
      default:
        traLoi(`Lệnh \`${ten}\` chưa nối.`);
    }
  };

  const guiDi = (): void => {
    const text = nhap.trim();
    if (!text) return;

    /*
     * ⚠️ CHẶN KHI ĐÍNH KÈM CHƯA XONG. Không có chốt này thì bấm Gửi sớm một
     * nhịp là `dk.anhGuiThang`/`dk.duongDanTrenDia` còn RỖNG — câu hỏi đi một
     * mình, model nói "tôi không thấy ảnh nào", và trên màn hình thẻ file vẫn
     * nằm đó như đã gửi. Không có lỗi nào để lần.
     */
    if (dk.dangTai) return;

    /* Đang chạy ⇒ XẾP HÀNG. Xem chú thích ở `hangCho`. Lệnh gạch chéo cũng
       xếp hàng chứ không chạy ngay: `/clear` giữa lượt là xoá hội thoại mà
       máy chủ đang đọc dở. Khi rút ra, nó đi qua `xuLyCau` — chạy như lệnh. */
    if (trangThai.dangChay) {
      datNhap('');
      /* Đợt 4 — câu THƯỜNG ⇒ CHÈN vào lượt đang chạy (main nối vào kết quả tool kế tiếp, như Claude Code).
         Lệnh `/` (và lúc main không nhận — lượt vừa xong) ⇒ xếp hàng như cũ. */
      if (!text.startsWith('/')) {
        void chenTin(text).then((ok) => { if (!ok) datHangCho((truoc) => [...truoc, text]); });
        return;
      }
      datHangCho((truoc) => [...truoc, text]);
      return;
    }
    datNhap('');
    xuLyCau(text, true);
  };

  /* Đợt 4 — nhắc NGỮ CẢNH SẮP ĐẦY (mốc 80/95%, mỗi mốc một lần mỗi việc — như CLI). */
  const daNhacNguCanh = useRef(0);
  useEffect(() => {
    if (trangThai.muc.length === 0) { daNhacNguCanh.current = 0; return; }
    const p = trangThai.nguCanh?.phanTram ?? 0;
    const moc = p >= 95 ? 95 : p >= 80 ? 80 : 0;
    if (!moc || moc <= daNhacNguCanh.current) return;
    daNhacNguCanh.current = moc;
    baoTin(dichP('Ngữ cảnh đã dùng {p}% — gõ /compact (kèm điều cần giữ) để tóm tắt phần cũ, hoặc /clear bắt đầu việc mới. Máy chủ sẽ tự cắt lượt cũ khi đầy.', { p: Math.round(p) }), 'NGU_CANH_DAY');
  }, [trangThai.nguCanh, trangThai.muc.length, baoTin, dichP]);

  /* Đợt 4 — hẹn ĐÃ LỠ lúc app tắt ⇒ hỏi chạy bù hay bỏ (một lần, lúc mở). */
  const daHoiHenLo = useRef(false);
  useEffect(() => {
    if (daHoiHenLo.current) return;
    daHoiHenLo.current = true;
    void window.cuongthai?.agent.henLo?.().then((r) => {
      const ds = r?.ds ?? [];
      if (!ds.length) return;
      traLoi(`${dichP('⏰ **Đã lỡ {n} hẹn** lúc app tắt:', { n: ds.length })}\n\n${ds.slice(0, 6).map((h) => `- ${new Date(h.luc).toLocaleString()} — ${h.lyDo}`).join('\n')}`, 'henLo');
    }).catch(() => undefined);
  }, [traLoi, dichP]);

  /*
   * Rút hàng chờ khi lượt vừa xong.
   *
   * ⚠️ Gửi TỪNG CÂU MỘT, không gộp: mỗi câu là một lượt riêng trong hội thoại,
   * gộp lại thành một khối chữ thì `Quay lui`/`Tách nhánh` không còn mốc để
   * cắt, và model đọc hai yêu cầu rời như một.
   *
   * ⚠️ Phụ thuộc `trangThai.dangChay` chứ không tự đặt cờ riêng: `gui()` bật
   * cờ đó NGAY khi bắt đầu, nên câu thứ hai không thể chen vào giữa.
   */
  useEffect(() => {
    if (trangThai.dangChay || hangCho.length === 0) return;
    const [dau, ...conLai] = hangCho;
    datHangCho(conLai);
    if (dau) xuLyCau(dau, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trangThai.dangChay, hangCho]);

  const phimTrongO = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    // Bộ gõ tiếng Việt/CJK dùng Enter để CHỐT chữ đang gõ. Gửi lúc đó là cắt
    // ngang giữa một từ chưa xong — xem [[feedback_ime_composing_guard]].
    if (e.nativeEvent.isComposing) return;
    /* Đợt 5: thẻ lựa chọn đang mở + ô nhập TRỐNG ⇒ phím số chọn, Esc đóng (như CLI). */
    if (!nhap && typeof lenhNut === 'object' && lenhNut?.chon && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const ds = lenhNut.chon.ds.filter((m) => !m.tat);
      if (/^[0-9]$/.test(e.key)) {
        const m = ds.find((x, k) => (x.so ?? (k < 9 ? String(k + 1) : '')) === e.key);
        if (m) { e.preventDefault(); const c = lenhNut.chon; traLoi(null); void Promise.resolve(c.khiChon(m.giaTri)).catch((er: Error) => traLoi(`⚠ ${er.message}`)); return; }
      }
      if (e.key === 'Escape') { e.preventDefault(); lenhNut.chon.khiHuy?.(); traLoi(null); return; }
    }
    /* Đợt 8A — gợi ý bước tiếp: ô TRỐNG + có gợi ý ⇒ Tab điền câu đầu (Enter mới gửi). Menu `/`/`@` chỉ mở khi đã gõ. */
    if (e.key === 'Tab' && !e.shiftKey && !nhap && goiYTiep.length && !trangThai.dangChay) {
      e.preventDefault();
      capNhatNhap(goiYTiep[0]!, goiYTiep[0]!.length);
      boGoiYTiep();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      guiDi();
    }
  };

  /*
   * ⚠️ KHÔNG `return` SỚM Ở ĐÂY — MỌI HOOK PHẢI CHẠY VÔ ĐIỀU KIỆN.
   *
   * Bản trước thoát ngay tại chỗ này khi `!info.pro` hoặc `!info.configured`,
   * mà `useEffect`/`useCallback` lại nằm BÊN DƯỚI. Bấm "Thử lại" và máy chủ
   * trả về đã bật AI ⇒ lần vẽ sau chạy NHIỀU HOOK HƠN lần trước ⇒ React ném
   * *"Rendered more hooks than during the previous render"* và tháo sạch cây:
   * MÀN HÌNH TRẮNG, ngay từ cú bấm vào đúng cái nút duy nhất trên màn đó.
   *
   * Cùng cơ chế khi `info.pro` chớp `false` rồi hồi (máy chủ trả 403 thoáng
   * qua) — và đường đó không cần ai bấm gì cả.
   *
   * Bài học này đã có sẵn trong kho, ở `FloatingAIAssistant.tsx`: *"tính cờ
   * bây giờ, gọi mọi hook vô điều kiện, rồi mới thoát ngay trước JSX"*. Đây
   * là lần thứ hai nó cắn.
   */
  const coThuMuc = Boolean(thuMuc?.path);

  useEffect(() => {
    let con = true;
    if (!coThuMuc) { datLenhDuAn([]); return; }
    void window.cuongthai?.agent.lenhDuAn(cuocId)
      .then((r) => { if (con) datLenhDuAn(r); })
      .catch(() => { if (con) datLenhDuAn([]); });
    return () => { con = false; };
  }, [cuocId, coThuMuc, thuMuc?.path]);


  /** Cập nhật ô soạn VÀ đoạn `@` theo vị trí con trỏ hiện tại của ô đó. */
  const capNhatNhap = useCallback((chu: string, caret: number) => {
    datNhap(chu);
    datTokenFile(coThuMuc ? docTokenFile(chu, caret) : null);
  }, [coThuMuc]);

  // ─── Chưa đủ điều kiện ─────────────────────────────────────
  // Thoát Ở ĐÂY, sau khi MỌI hook đã chạy — xem chú thích dài ở trên.
  /* Đợt 6: không Pro nhưng có dự án dùng được hạn mức NHÓM ⇒ vẫn mở; máy chủ quyết từng lượt theo dự án gắn. */
  /* 19/10/2026: tài khoản miễn phí dùng được CuongMini Default (máy chủ chặn model khác bằng 403 + lời mời nâng cấp). */
  if (!info.pro && !info.nhom?.length && !info.free?.duocDung) {
    if (info.free?.canXacThucEmail) {
      return (
        <div className="ct-empty">
          <h1>{dich('Xác thực email để dùng CuongMini Default')}</h1>
          <p>{dich('Tài khoản miễn phí dùng được CuongMini Default sau khi xác thực email (mở thư xác thực trong hộp thư, hoặc Cài đặt → Tài khoản trên web). Gói Pro mở thêm mọi model khác.')}</p>
        </div>
      );
    }
    return <MoiNangCap />;
  }
  if (!info.configured) {
    return (
      <div className="ct-empty">
        <h1>{dich('Máy chủ chưa bật CuongMini')}</h1>
        <p>{dich('Chế độ Lập trình cần khoá AI ở máy chủ. Hãy thử lại sau.')}</p>
        <div className="ct-actions">
          <button type="button" className="ct-btn ct-btn-ghost" onClick={napLai}>{dich('Thử lại')}</button>
        </div>
      </div>
    );
  }

  return (
    /* ⛔ KHÔNG gắn `coThuMuc ? … : undefined` như bản cũ nữa.
       Chưa chọn thư mục thì trình duyệt coi đây không phải vùng thả, nên cú kéo
       bị TỪ CHỐI ở tầng hệ điều hành: không lớp phủ, không thông báo, con trỏ
       hiện dấu cấm rồi thôi. Người dùng báo 20/08/2026 là "kéo file vào không
       được" — mã thì vẫn đúng, nó chỉ chưa bao giờ được chạy.
       Giờ luôn nhận, và nếu thiếu thư mục thì lớp phủ nói thẳng phải làm gì. */
    <div
      className="ct-agent"
      ref={gocRef}
      /* ⚠️ Cờ này nằm ở ĐÂY chứ không chỉ ở `.ct-agent-doi` bên trong, vì cột
         đọc được khai trên chính phần tử này — và CSS không chọn ngược lên cha
         được. Thiếu nó thì khi mở khung web, đệm cột tính theo bề ngang của CẢ
         HAI khung cộng lại, rộng hơn cả khung chat, và chữ bị ép xuống một ký
         tự một dòng. Người dùng gửi ảnh 16/09/2026. */
      data-co-web={webUrl !== null}
      data-ngoai-tuyen={dangNgoaiTuyen || epCucBo ? '1' : undefined}
      data-keo={dk.dangKeo}
      onDragEnter={dk.keoVao}
      onDragOver={dk.keoTren}
      onDragLeave={dk.keoRa}
      onDrop={coThuMuc ? dk.thaVao : (e) => { e.preventDefault(); dk.keoRa(); }}
    >
      {dk.dangKeo && (
        <div className="ct-dk-phu" data-thieu={!coThuMuc}>
          <span>
            {coThuMuc
              ? dich('Thả file hoặc thư mục vào đây — agent sẽ đọc được nó')
              : dich('Chọn thư mục dự án trước đã — agent chỉ đọc được trong đó')}
          </span>
        </div>
      )}
      {moLichSu && (
        <LichSu
          phien={phien}
          dangMo={phienDangMo}
          onMo={(id) => { void moPhien(id); lichSu.dong(); }}
          onXoa={(id) => void xoaPhien(id)}
          onDong={lichSu.dong}
        />
      )}

      {!(epCucBo && online) && <DaiNgoaiTuyen
        tt={ngoaiTuyen}
        tenModel={tenCucBo}
        nhan={nhanCucBo}
        lyDo={cheDoCode?.vi ?? ''}
        dangChay={trangThai.dangChay}
      />}

      {/* `/offline` — ép tay chạy trên máy (dải riêng: dải của gói ngoại tuyến
          chỉ nói về MẤT MẠNG, còn đây là người dùng tự chọn khi có mạng). */}
      {epCucBo && online && (
        <div className="ct-ngoai-tuyen-dai" data-loai="chay" role="status">
          <PlugZap size={15} aria-hidden />
          <span className="ct-ngoai-tuyen-chu">
            <strong>{dich('Ngoại tuyến')}</strong>
            {tenCucBo && <> · {tenCucBo}</>}
            {' · '}{dich('bạn bật bằng /offline — không gửi lên máy chủ')}
          </span>
          <button type="button" className="ct-ngoai-tuyen-nut" onClick={() => void doiEpCucBo(false)}>
            <RotateCcw size={13} aria-hidden /> {dich('Quay về CuongMini máy chủ')}
          </button>
        </div>
      )}

      {/* ── Thanh công cụ ──
          Hai nhóm: TRÁI = phạm vi quyền (thư mục, chế độ) — thứ người dùng phải
          luôn thấy; PHẢI = model/ngữ cảnh/hạn mức rồi tới công cụ. Nhóm "phụ"
          (`data-phu`) gom vào menu "⋯" khi CỘT hẹp — đo bằng `@container`, không
          bằng cửa sổ (BO-CUC.md luật 3). */}
      <div className="ct-agent-bar">
        <div className="ct-agent-bar-trai">
          <button
            type="button"
            className="ct-agent-ws"
            onClick={() => void chonThuMuc()}
            title={thuMuc?.path ?? dich('Chưa chọn thư mục dự án')}
          >
            <FolderOpen size={14} aria-hidden />
            <span className="ct-agent-ws-name">{thuMuc?.name ?? dich('Chọn thư mục dự án…')}</span>
            {thuMuc?.branch && <span className="ct-agent-branch">{thuMuc.branch}</span>}
          </button>

          {coThuMuc && (
            <button
              type="button"
              className="ct-agent-icon"
              data-nut="boThuMuc"
              onClick={() => void boThuMuc()}
              title={dich('Thôi cho đọc thư mục này')}
              aria-label={dich('Thôi cho đọc thư mục này')}
            >
              <X size={13} aria-hidden />
            </button>
          )}

          {coThuMuc && (
            <ChonCheDo
              cuocId={cuocId}
              cheDo={thuMuc?.cheDoQuyen ?? 'keHoach'}
              khoa={trangThai.dangChay}
              onChon={(c) => void doiCheDoQuyen(c)}
            />
          )}
        </div>

        <div className="ct-agent-bar-phai">
          {/* Ngoại tuyến ⇒ chip nói ĐÚNG model đang trả lời (model trên máy),
              không phải model máy chủ đã chọn — chọn model máy chủ lúc này
              chẳng có tác dụng gì. */}
          {dangNgoaiTuyen || epCucBo ? (
            <span className="ct-chip-cucbo" title={dich('AI Code đang chạy bằng model trên máy này')}>
              {epCucBo && online ? <PlugZap size={12} aria-hidden /> : <WifiOff size={12} aria-hidden />}
              <span>{tenCucBo || dich('CuongMini trên máy')}</span>
            </span>
          ) : (
            <ChonModelVaMuc
              cuocId={cuocId}
              muc={thuMuc?.mucNoLuc ?? 'vua'}
              model={thuMuc?.model ?? 'cm-default'}
              khoa={trangThai.dangChay}
              info={info}
              onChonMuc={(m) => void doiMucNoLuc(m)}
              onChonModel={(m) => void doiModel(m)}
              cucBo={cheDoCode?.ma ? { ten: tenCucBo || cheDoCode.ten || 'AI trên máy', bat: epCucBo } : null}
              onDoiCucBo={(b) => void doiEpCucBo(b)}
              onNapLaiInfo={napLai}
            />
          )}

          {trangThai.nguCanh && <VongNguCanh n={trangThai.nguCanh} />}

          {trangThai.hanMuc && <ThanhHanMuc quota={trangThai.hanMuc} soViec={info.soViecConLai} />}

          {trangThai.soFileDaSua > 0 && (
            <button
              type="button"
              className="ct-agent-hoantac"
              onClick={() => void hoanTac()}
              title={dich('Trả mọi file agent đã sửa trong việc này về nguyên trạng')}
            >
              <Undo2 size={13} aria-hidden />
              <span className="ct-agent-nhan">Hoàn tác {trangThai.soFileDaSua} file</span>
            </button>
          )}

          <span className="ct-agent-bar-vach" aria-hidden />

          {/* Bảng chạy lệnh của NGƯỜI DÙNG — khác hẳn `run_command` của agent:
              ở đây không có thẻ duyệt, vì chính người dùng vừa gõ lệnh. */}
          <button
            type="button"
            className="ct-agent-cong"
            data-bat={moBangLenh}
            data-nut="terminal"
            onClick={() => datMoBangLenh((v) => !v)}
            title={`${dich('Terminal thật trong thư mục dự án — gõ lệnh, ssh, mật khẩu… (agent cũng dùng chung)')} · ${PHIM.terminal}`}
          >
            <SquareTerminal size={14} aria-hidden />
            <span className="ct-agent-nhan">Terminal</span>
          </button>

          {/* MỞ KHUNG WEB ngay trong AI Code. Khác nút "Trình duyệt" (cấp QUYỀN
              cho agent): nút này chỉ mở khung cho NGƯỜI DÙNG nhìn — nên nó
              không bị khoá lúc agent đang chạy. `ep: false` ⇒ chỉ nạp
              `WEB_MAC_DINH` khi chưa có trang nào. */}
          <button
            type="button"
            className="ct-agent-cong"
            data-bat={webUrl !== null}
            data-nut="khungweb"
            onClick={batKhungWeb}
            title={`${webUrl !== null
              ? dich('Đóng khung trình duyệt bên phải')
              : dich('Mở trình duyệt ngay cạnh bảng ghi — xem trang chạy trong lúc agent sửa mã')} · ${PHIM.web}`}
          >
            <PanelRight size={14} aria-hidden />
            <span className="ct-agent-nhan">{dich('Khung web')}</span>
          </button>

          {/* ── Nhóm PHỤ: hiện thẳng khi cột rộng, gom vào "⋯" khi hẹp ── */}
          {/* Trình duyệt KHÔNG cần thư mục dự án: agent có thể mở một trang bất
              kỳ để đọc tài liệu hay kiểm một API. */}
          <button
            type="button"
            className="ct-agent-cong"
            data-phu
            data-bat={thuMuc?.choTrinhDuyet === true}
            data-nut="trinhduyet"
            onClick={() => void doiCheDoTrinhDuyet()}
            disabled={trangThai.dangChay}
            title={
              thuMuc?.choTrinhDuyet
                ? dich('Agent ĐANG lái được trình duyệt: mở trang, đọc sau khi JS chạy, xem console. Bấm/gõ vẫn phải bạn duyệt. Bấm để tắt. (Nhớ cho những việc sau.)')
                : dich('Bật cho agent MỞ TRANG WEB — YouTube, tài liệu, localhost — ngay cạnh bảng ghi, đọc nội dung sau khi JS chạy và xem lỗi console. Mọi thao tác bấm/gõ vẫn hỏi bạn. (Nhớ cho những việc sau.)')
            }
          >
            <Globe size={14} aria-hidden />
            <span className="ct-agent-nhan">{dich('Trình duyệt')}</span>
            <span className="ct-agent-den" aria-label={thuMuc?.choTrinhDuyet ? dich('đang bật') : dich('đang tắt')} />
          </button>

          {/* KHÔNG bọc trong `coThuMuc`: sổ ghi chú nằm trên máy chủ, không phải
              trong thư mục dự án. */}
          <button
            type="button"
            className="ct-agent-cong"
            data-phu
            data-bat={thuMuc?.choGhiNote === true}
            data-nut="ghinote"
            onClick={() => void doiCheDoNote()}
            disabled={trangThai.dangChay}
            title={
              thuMuc?.choGhiNote
                ? 'Agent ĐANG ghi được vào Ghi chú (mỗi lần ghi vẫn phải bạn duyệt). Bấm để tắt.'
                : 'Bật cho agent tạo và sửa ghi chú của bạn trên cuongthai.com. Bạn thấy nội dung rồi mới duyệt.'
            }
          >
            <NotebookPen size={14} aria-hidden />
            <span className="ct-agent-nhan">{dich('Ghi chú')}</span>
            <span className="ct-agent-den" aria-label={thuMuc?.choGhiNote ? dich('đang bật') : dich('đang tắt')} />
          </button>

          {/* Đợt 4 — ĐIỀU KHIỂN MÁY TÍNH: công tắc toàn app (nhớ trong thiết đặt), mặc định tắt. */}
          {mayTinh?.hoTro && (
            <button
              type="button"
              className="ct-agent-cong"
              data-phu
              data-bat={mayTinh.bat}
              data-nut="maytinh"
              onClick={() => void doiMayTinh()}
              disabled={trangThai.dangChay}
              title={mayTinh.bat
                ? dich('Agent ĐANG được chụp màn hình và điều khiển chuột/bàn phím — mọi thao tác vẫn hỏi bạn từng lần, kể cả "Bỏ qua tất cả". Bấm để tắt.')
                : dich('Bật cho agent chụp màn hình và điều khiển chuột/bàn phím (cho app không có lệnh/API). Mọi thao tác vẫn hỏi bạn từng lần.')}
            >
              <Monitor size={14} aria-hidden />
              <span className="ct-agent-nhan">{dich('Máy tính')}</span>
              <span className="ct-agent-den" aria-label={mayTinh.bat ? dich('đang bật') : dich('đang tắt')} />
            </button>
          )}

          {/* Bốn tấm có bảng riêng. Khi hẹp chỉ ẨN NÚT (CSS), giữ cái bọc để
              bảng của chúng vẫn mở được từ menu "⋯" và từ lệnh `/`. */}
          <span className="ct-agent-tam" data-phu-tam>
            {coThuMuc && (
              <NutWorktree cuocId={cuocId} khoa={trangThai.dangChay} onDoi={() => { void napThuMuc(); void batDauLai(); }} />
            )}
            <NutMcp cuocId={cuocId} khoa={trangThai.dangChay} />
            <BangHook cuocId={cuocId} khoa={trangThai.dangChay} />
            <BangBoNho cuocId={cuocId} khoa={trangThai.dangChay} />
          </span>

          {/* CuongMini Code trong VS Code/Cursor… (17/10/2026) — nút hiện thẳng khi
              cột rộng, gom vào "⋯" khi hẹp; hộp của nó vẫn mở được từ menu. */}
          <NutTrinhSoan cuocId={cuocId} />

          <MenuThem
            onLichSu={lichSu.bat}
            soViec={phien.length}
            onViecMoi={() => void batDauLai()}
            coViec={trangThai.muc.length > 0}
            cuocId={cuocId}
            coThuMuc={coThuMuc}
            khoa={trangThai.dangChay}
            trinhDuyet={thuMuc?.choTrinhDuyet === true}
            ghiChu={thuMuc?.choGhiNote === true}
            onTrinhDuyet={() => void doiCheDoTrinhDuyet()}
            onGhiChu={() => void doiCheDoNote()}
          />

          <button
            type="button"
            className="ct-agent-icon"
            data-phu
            data-nut="lichSu"
            onClick={lichSu.bat}
            title={`Việc đã lưu (${phien.length}) · ${PHIM.lichSu}`}
            aria-label={dich('Việc đã lưu')}
          >
            <History size={14} aria-hidden />
          </button>

          <button
            type="button"
            className="ct-agent-icon"
            data-phu
            data-nut="viecMoi"
            onClick={() => void batDauLai()}
            disabled={trangThai.muc.length === 0}
            title={dich('Bắt đầu việc mới (xoá hội thoại, KHÔNG hoàn lại hạn mức)')}
            aria-label={dich('Bắt đầu việc mới')}
          >
            <RotateCcw size={14} aria-hidden />
          </button>
        </div>
      </div>
      {trangThai.keHoach.length > 0 && <BangKeHoach viec={trangThai.keHoach} />}

      {/*
        DỪNG GIỮA CHỪNG MÀ KẾ HOẠCH CÒN VIỆC ⇒ MỜI LÀM TIẾP.

        Người dùng báo 19/08/2026: "nó chưa trả lời hết đã tự ngắt mà không
        thông báo gì hết. Tôi phải nói 'hết chưa' nó mới trả lời tiếp."

        Nguyên nhân CHÍNH đã vá ở máy chủ (`finish_reason: 'length'` bị bỏ
        qua — nay tự viết tiếp). Nhưng còn một nửa mà máy chủ không vá được:
        model đôi khi dừng "tự nhiên" (`finish_reason: 'stop'`) trong khi kế
        hoạch của chính nó còn việc chưa đánh dấu xong. Không có cách nào
        phân biệt điều đó với một câu trả lời đã đủ, nên ĐỪNG tự gửi tiếp —
        chỉ đưa cái nút, để người dùng quyết. Rẻ hơn một lượt bị tính tiền
        cho một câu hỏi họ không đặt.
      */}
      {!trangThai.dangChay && !choDuyetKH
        && trangThai.keHoach.length > 0
        && trangThai.keHoach.some((v) => v.trangThai !== 'xong') && (
        <div className="ct-notice ct-agent-bao" data-tone="warn">
          <span>
            {dichP('Kế hoạch còn {n} việc chưa xong mà agent đã dừng.',
              { n: trangThai.keHoach.filter((v) => v.trangThai !== 'xong').length })}
          </span>
          <button
            type="button"
            className="ct-btn ct-btn-ghost"
            onClick={() => void gui('Làm tiếp những việc còn lại trong kế hoạch.')}
          >
            {dich('Làm tiếp')}
          </button>
        </div>
      )}

      {canhQuayLui && (
        <div className="ct-notice ct-agent-bao" data-tone="warn">
          <span>{canhQuayLui.chu}</span>
          {canhQuayLui.moc !== undefined && (canhQuayLui.soFile ?? 0) > 0 && (
            <button
              type="button"
              className="ct-notice-nut"
              disabled={dangLuiFile}
              onClick={() => {
                const moc = canhQuayLui.moc;
                if (moc === undefined) return;
                datDangLuiFile(true);
                void luiFile(moc)
                  .then((kq) => {
                    datCanhQuayLui(kq === null ? null : {
                      chu: kq.soFile === 0
                        ? 'Không có file nào cần lùi ở mốc này.'
                        : `Đã lùi ${kq.soFile} file về trạng thái trước câu hỏi đó.`
                          + (kq.loi.length > 0 ? ` ${kq.loi.length} file lùi không được: ${kq.loi.join('; ')}` : ''),
                    });
                  })
                  .finally(() => datDangLuiFile(false));
              }}
            >
              {dangLuiFile ? 'Đang lùi…' : `Lùi cả ${canhQuayLui.soFile} file về mốc này`}
            </button>
          )}
          <button type="button" className="ct-agent-icon" onClick={() => datCanhQuayLui(null)} aria-label={dich('Đóng')}>
            <X size={12} aria-hidden />
          </button>
        </div>
      )}

      {/* ── Bảng ghi (+ khung trình duyệt cạnh bên nếu agent đã mở) ── */}
      <div className="ct-agent-doi" data-co-web={webUrl !== null}>
      <div className="ct-agent-scroll" ref={cuonRef}>
        {trangThai.muc.length === 0 && (
          <ManHinhTrong coThuMuc={coThuMuc} dangChay={trangThai.dangChay} duongDan={thuMuc?.path ?? null} />
        )}

        {trangThai.muc.map((m, i) => {
          if (m.kieu === 'nguoi') {
            // Thứ tự câu hỏi (1, 2, 3…) — điểm neo duy nhất dịch được giữa bảng
            // ghi và hội thoại giao thức. Đếm lại ở đây thay vì lưu sẵn: bảng
            // ghi bị cắt bởi chính thao tác này, nên số phải luôn tính từ hiện tại.
            const thuTu = trangThai.muc.slice(0, i + 1).filter((x) => x.kieu === 'nguoi').length;
            return (
              <div key={i} className="ct-agent-nguoi">
                {m.anh?.length ? (
                  /* `data-so` cho CSS biết xếp mấy cột — con số thật, kiểm
                     được, không nhờ `:has()` đếm anh em. Bấm để xem đủ cỡ:
                     ảnh trong lưới nhiều-ảnh bị cắt vuông, và ảnh chụp màn
                     hình bị cắt thì mất đúng phần người ta muốn hỏi. */
                  <div className="ct-anh-goi" data-so={m.anh.length}>
                    {m.anh.map((a, k) => (
                      <img
                        key={k} src={a} alt={`ảnh ${k + 1}`}
                        onClick={() => datAnhTo({ ds: m.anh!, i: k })}
                      />
                    ))}
                  </div>
                ) : null}
                {m.text}
                {m.ctwork?.length ? (
                  <div className="ct-chip-ctw" title={Ld('Đã đính kèm tóm tắt thẻ CT Work', 'CT Work issue summary attached')}>
                    {m.ctwork.map((k) => <span key={k} className="ct-chip">📎 {k}</span>)}
                  </div>
                ) : null}
                <NutTinNhan
                  text={m.text}
                  {...(m.luc === undefined ? {} : { luc: m.luc })}
                  khoa={trangThai.dangChay}
                  onQuayLui={() => {
                    void quayLui(thuTu).then((r) => {
                      if (!r) return;
                      datNhap(r.cauHoi);
                      /* Trước đây chỉ nói "dùng nút Hoàn tác" — mà Hoàn tác lùi
                         TẤT CẢ về đầu cuộc, tức bỏ luôn những việc đúng trước
                         mốc này. Nay mời đúng thao tác cần: lùi về ĐÚNG mốc. */
                      datCanhQuayLui(r.coSuaFile
                        ? {
                          chu: r.soFileSeLui > 0
                            ? `Đã quay lui hội thoại. ${r.soFileSeLui} file agent sửa từ mốc này trở đi VẪN CÒN trên đĩa.`
                            : 'Đã quay lui. Đoạn vừa bỏ có chạy lệnh — thay đổi do lệnh gây ra không lùi được tự động.',
                          moc: thuTu,
                          soFile: r.soFileSeLui,
                        }
                        : null);
                    });
                  }}
                  /* Chỉ hiện nút tách nhánh khi cha CÓ chỗ để mở tab mới. Hiện
                     nó ở nơi không mở được thì bấm xong sinh ra một file trên
                     đĩa và không có gì trên màn hình — kiểu hỏng tệ nhất. */
                  {...(onTachRaTabMoi
                    ? {
                      onTachNhanh: () => {
                        void tachNhanh(thuTu).then((r) => { if (r) onTachRaTabMoi(r.id); });
                      },
                    }
                    : {})}
                />
              </div>
            );
          }
          if (m.kieu === 'may') {
            return (
              <div key={i} className="ct-agent-may" data-cuc-bo={m.cucBo ? '1' : undefined}>
                {m.cucBo && <NhanMay ten={m.cucBo} />}
                <ChuAgent text={m.text} />
              </div>
            );
          }
          if (m.kieu === 'loi') {
            return (
              <div key={i} className="ct-notice" data-tone={
                m.ma === 'HOAN_TAC' || m.ma === 'RAMBO_BAO_TRI' || m.ma === 'CUC_BO_CHUA_CAI' || m.ma === 'CUC_BO_DA_TAT' || m.ma === 'MAX_STEPS' || m.ma === 'TOOL_HONG'
                || m.ma === 'CONG_ANTHROPIC_KHOA' || m.ma === 'CONG_ANTHROPIC_HET_HAN_MUC' || m.ma === 'CONG_ANTHROPIC_HET_KEY' || m.ma === 'CONG_ANTHROPIC_HONG' || m.ma === 'CUONGMINI_HET_TRAN' ? 'warn'
                  : m.ma === 'DOI_CONG_TU_DONG' ? 'mo'
                  : m.ma === 'KHOI_PHUC' || m.ma === 'DOI_CONG' || m.ma === 'CONG_CHINH_HONG_FREE' || m.ma === 'RAMBO_SONG_LAI' || m.ma === 'LAM_TIEP' || m.ma === 'TU_GO_ANH' || m.ma === 'COMPACT' || m.ma === 'DOI_CHE_DO' || m.ma === 'DA_CHEN' ? 'info'
                  : m.ma === 'NGU_CANH_DAY' ? 'warn' : 'err'
              }>
                <span>{m.text}</span>
                {/* Hết hạn mức Cuong Fable ⇒ xin thêm ngay tại chỗ (26/09/2026). */}
                {m.ma === 'FABLE_QUOTA_EXCEEDED' && <XinThemFable />}
                {/* Cổng chính (rambo) sập ⇒ hỏi có dùng cổng dự phòng không (27/09/2026). */}
                {m.ma === 'RAMBO_BAO_TRI' && <MoCongDuPhong baoTri />}
                {/* CỔNG CLAUDE CHÍNH HÃNG (17/10/2026) — docs/cong-anthropic-chinh-hang.md.
                    Cổng chính hỏng ⇒ máy chủ đã tự sang CuongMini Free; mời chọn cổng cao hơn. */}
                {m.ma === 'CONG_CHINH_HONG_FREE' && !!m.cacCong?.length && (
                  <MoiNangCapCong
                    cuocId={cuocId}
                    cacCong={m.cacCong}
                    onChonModelAnthropic={async (id) => { await doiModel(id as ModelAgent); napLai(); }}
                  />
                )}
                {/* Vé chính hãng chết / chưa có (main đã xoá vé) ⇒ hỏi lại mật khẩu. */}
                {m.ma === 'CONG_ANTHROPIC_KHOA' && (
                  <MoCongAnthropic {...(m.daBat === false ? { daBat: false } : {})} onXong={napLai} />
                )}
                {/* Hết trần / hết key chính hãng ⇒ mời modelapi (vé dự phòng). */}
                {/* 18/10/2026: hết trần / cổng hỏng ⇒ máy chủ đã tự chuyển model free nếu được; không còn mời cổng dự phòng. */}
                {/* Mất mạng mà chưa có / đang tắt AI ngoại tuyến ⇒ một nút tới đúng chỗ cài. */}
                {(m.ma === 'CUC_BO_CHUA_CAI' || m.ma === 'CUC_BO_DA_TAT') && (
                  <button type="button" className="ct-ngoai-tuyen-nut" onClick={moCaiNgoaiTuyen}>
                    {m.ma === 'CUC_BO_DA_TAT' ? dich('Mở cài đặt') : dich('Cài CuongMini ngoại tuyến')}
                  </button>
                )}
                {/* Hết hạn mức token 5 giờ + admin đã bật key gia hạn ⇒ nhập key,
                    tự gửi lại ĐÚNG lượt vừa bị chặn (02/10/2026). */}
                {m.ma === 'AGENT_QUOTA_EXCEEDED' && m.coKeyGiaHan && (
                  <NhapKeyGiaHan khoa={trangThai.dangChay} onXong={(q) => { void lamTiep(q); }} />
                )}
                {/* Chạm trần TIỀN gia hạn được (19/10/2026) ⇒ "Nhập mã gia hạn để dùng tiếp": lần 1 trong kỳ cộng ngay +
                    tự làm tiếp; lần 2+ chờ admin duyệt (tự kiểm lại mỗi 30 s). */}
                {m.giaHanTien && (
                  <NhapMaGiaHanTien g={m.giaHanTien} khoa={trangThai.dangChay} onLamTiep={() => { void lamTiep(); }} />
                )}
                {/* Cổng chính sống lại SAU khi việc xong ⇒ người dùng chọn (27/09/2026). */}
                {m.ma === 'RAMBO_SONG_LAI' && <HoiQuayVeCongChinh cuocId={cuocId} />}
              </div>
            );
          }
          if (m.kieu === 'xinPhep') {
            // Đã trả lời rồi thì thu về một dòng dấu vết, không giữ nguyên thẻ
            // to đùng: hội thoại dài mà mỗi lần sửa chiếm nửa màn hình thì cuộn
            // lại đọc mạch suy nghĩ không nổi.
            if (m.xong) {
              return (
                <div key={i} className="ct-agent-tool" data-vong="may" data-xong={m.xong}>
                  {m.xong === 'dongY' ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />}
                  <code>{m.the.duongDan}</code>
                  <span className="ct-agent-tool-tomtat">
                    {m.xong === 'dongY' ? 'đã duyệt' : 'đã từ chối'}
                  </span>
                </div>
              );
            }
            return <XinPhep key={i} the={m.the} traLoi={traLoiXinPhep} />;
          }
          if (m.kieu === 'xinPhepLenh') {
            if (m.xong) {
              return (
                <div key={i} className="ct-agent-tool" data-vong="may" data-xong={m.xong}>
                  {m.xong === 'dongY' ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />}
                  <code>{m.lenh}</code>
                  <span className="ct-agent-tool-tomtat">
                    {m.xong === 'dongY' ? 'đã chạy' : 'đã từ chối'}
                  </span>
                </div>
              );
            }
            return <XinPhepLenh key={i} id={m.id} lenh={m.lenh} phanLoai={m.phanLoai} traLoi={traLoiXinPhep} tienTo={m.tienTo} phuId={m.phuId} />;
          }
          if (m.kieu === 'xinPhepGit') {
            if (m.xong) {
              return (
                <div key={i} className="ct-agent-tool" data-vong="may" data-xong={m.xong}>
                  {m.xong === 'dongY' ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />}
                  <code>{m.viec === 'pr' ? 'mở PR' : m.viec === 'gop' ? 'gộp agent phụ' : m.viec === 'thuMuc' || m.viec === 'thuMucDoc' ? 'thư mục ngoài' : 'commit'}</code>
                  <span className="ct-agent-tool-tomtat">
                    {m.xong === 'dongY' ? 'đã duyệt' : 'đã từ chối'}
                  </span>
                </div>
              );
            }
            return <XinPhepGit key={i} id={m.id} viec={m.viec} chiTiet={m.chiTiet} traLoi={traLoiXinPhep} />;
          }
          if (m.kieu === 'xinPhepNote') {
            if (m.xong) {
              return (
                <div key={i} className="ct-agent-tool" data-vong="notes" data-xong={m.xong}>
                  {m.xong === 'dongY' ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />}
                  <code>{m.viec === 'tao' ? 'tạo ghi chú' : 'ghi ghi chú'}</code>
                  <span className="ct-agent-tool-tomtat">
                    {m.xong === 'dongY' ? 'đã ghi' : 'đã từ chối'}
                  </span>
                </div>
              );
            }
            return <XinPhepNote key={i} id={m.id} viec={m.viec} chiTiet={m.chiTiet} traLoi={traLoiXinPhep} />;
          }
          if (m.kieu === 'xinPhepMcp') {
            if (m.xong) {
              return (
                <div key={i} className="ct-agent-tool" data-vong="may" data-xong={m.xong}>
                  {m.xong === 'dongY' ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />}
                  <code>{m.server} · {m.tool}</code>
                  <span className="ct-agent-tool-tomtat">
                    {m.xong === 'dongY' ? 'đã gọi' : 'đã từ chối'}
                  </span>
                </div>
              );
            }
            return (
              <XinPhepMcp
                key={i} id={m.id} server={m.server} tool={m.tool} args={m.args} traLoi={traLoiXinPhep} xemTruoc={m.xemTruoc}
              />
            );
          }
          // Đầu ra lệnh: hiện nguyên văn, KHÔNG dựng bằng innerHTML. Đây là chữ
          // do một tiến trình bất kỳ trên máy in ra, và nó có thể chứa bất cứ gì.
          /* ── Đợt 3: hỏi lựa chọn · agent phụ · tin từ phiên khác ── */
          if (m.kieu === 'hoi') return <TheHoi key={i} id={m.id} cauHoi={m.cauHoi} xong={m.xong} traLoi={traLoiHoi} />;
          if (m.kieu === 'phu') return <ThePhu key={i} p={m.p} />;
          if (m.kieu === 'tinPhien') return <DongTinPhien key={i} tu={m.tu} noiDung={m.noiDung} luc={m.luc} />;
          if (m.kieu === 'lenhRa') {
            return <KhoiLenhRa key={i} text={m.text} tenTruoc={lenhTruoc(trangThai.muc, i)} dangChay={trangThai.dangChay && i === trangThai.muc.length - 1} />;
          }
          /* ĐANG CHẠY — chưa có kết quả. Trước 24/08/2026 dòng này chỉ xuất
             hiện SAU khi tool xong, nên một tool mất 30 giây (tạo PDF, chạy
             `npm test`, tải một lô file) là 30 giây màn hình không đổi gì và
             người dùng tưởng app treo. */
          if (m.dangChay === true) {
            return (
              <div key={i} className="ct-agent-tool" data-vong={m.vong} data-ten={m.ten} data-chay="1">
                <Loader2 size={13} className="ct-spin" aria-hidden />
                <code>{m.ten}</code>
                <span className="ct-agent-tool-tomtat">{viecCuaTool(m.ten)}</span>
              </div>
            );
          }
          return <DongTool key={i} m={m} />;
        })}

        {/* Dòng chờ KHÔNG còn nằm ở đây. Nó thành thanh ghim trên ô soạn:
            trong này thì cuộn lên đọc lại là mất, mà đó đúng là lúc người dùng
            đang tìm bằng chứng app còn chạy. Xem `ThanhDangLam`. */}
      </div>

      {/* Nút xuống cuối neo vào KHUNG BẢNG GHI (03/10/2026) — không còn neo
          theo một số px đo từ đáy trang, thứ đã đè lên ô soạn khi ô soạn đổi cỡ. */}
      {xaDay && (
        <button
          type="button"
          className="ct-agent-xuongday"
          onClick={() => xuongDay()}
          title={dich('Xuống cuối hội thoại')}
          aria-label={dich('Xuống cuối hội thoại')}
        >
          <ChevronDown size={16} aria-hidden />
          {trangThai.dangChay && <span className="ct-agent-xuongday-cham" aria-hidden />}
        </button>
      )}
      {webUrl !== null && (
        <>
          <div
            className="ct-keo-doc"
            role="separator"
            aria-orientation="vertical"
            data-keo={dangKeoWeb}
            onPointerDown={(e) => { keoWebRef.current = { x: e.clientX, rong: rongWeb }; datDangKeoWeb(true); }}
            onDoubleClick={() => setSetting('aiKhungWebRong', 560)}
            title={dich('Kéo để đổi bề rộng · bấm đúp để về mặc định')}
          />
          <div className="ct-khungweb-boc" style={{ width: rongWeb }}>
            <KhungWeb url={webUrl} ep={web?.ep ?? true} onDong={() => datWeb(null)} />
          </div>
        </>
      )}
      </div>


      {dangChupMan && (
        <ChupManHinh
          onXong={(f) => void dk.them([f])}
          onDong={() => datDangChupMan(false)}
        />
      )}

      {/* Bảng gợi ý lệnh — chỉ hiện khi ô nhập bắt đầu bằng `/` và chưa có
          khoảng trắng. `GoiYLenh` tự lo phím lên/xuống/Enter/Esc. */}
      <GoiYLenh
        chu={nhap}
        them={lenhDuAn}
        onChon={(ten) => {
          const cua = lenhDuAn.find((l) => l.ten === ten);
          if (!cua) { datNhap(`${ten} `); return; }
          /* Lệnh dự án ⇒ THAY bằng nội dung file, giữ lại phần người dùng đã gõ
             sau tên lệnh làm tham số. Chỉ đặt chữ vào ô soạn, KHÔNG tự gửi —
             file có thể tới từ `git pull` của người khác. */
          bungLenhDuAn(cua.than, nhap.includes(' ') ? nhap.slice(nhap.indexOf(' ') + 1) : '');
        }}
        onDong={() => datNhap('')}
      />

      {/* Bảng gợi ý FILE — chỉ khi con trỏ đang nằm trong một đoạn `@…`. */}
      {tokenFile !== null && (
        <GoiYFile
          cuocId={cuocId}
          token={tokenFile}
          onChon={(duong, tk) => {
            /* Thay ĐÚNG đoạn `@…`, giữ nguyên phần còn lại của câu. Thay cả ô
               nhập là xoá mất thứ người dùng đã viết trước đó. */
            /* Giữ lại phần `:10-40` họ đã gõ. Vứt nó đi thì gõ `@loop:10-40`
               rồi chọn file sẽ mất luôn khoảng dòng vừa gõ. Thư mục kết thúc
               bằng `/` nên KHÔNG thêm dấu cách — họ thường gõ tiếp tên file. */
            const laThuMuc = duong.endsWith('/');
            const chen = `@${duong}${tk.duoi}${laThuMuc ? '' : ' '}`;
            const moi = `${nhap.slice(0, tk.dau)}${chen}${nhap.slice(tk.cuoi)}`;
            datNhap(moi);
            datTokenFile(null);
            // Trả con trỏ về ngay sau đường dẫn vừa chèn, không nhảy về cuối ô.
            const viTri = tk.dau + chen.length;
            requestAnimationFrame(() => {
              const o = oNhapRef.current;
              if (!o) return;
              o.focus();
              o.setSelectionRange(viTri, viTri);
            });
          }}
          onDong={() => datTokenFile(null)}
        />
      )}

      {/* ── Ô nhập ── */}
      {/* Ảnh gửi thẳng vẫn hiện thành hình, vì nhìn thấy nó mới biết mình dán
          đúng cái nào. File trên đĩa thì chỉ có tên — xem trước một file zip
          là chuyện vô nghĩa. */}
      {dk.tep.some((tep) => tep.dataUrl) && (
        <div className="ct-anh-cho">
          {dk.tep.filter((tep) => tep.dataUrl).map((tep) => (
            <div key={tep.id} className="ct-anh-o">
              <img src={tep.dataUrl} alt={tep.ten} />
              <button type="button" onClick={() => dk.bo(tep.id)} title={dich('Bỏ ảnh này')}>
                <X size={11} aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}
      <DaiTepCode tep={dk.tep.filter((x) => !x.dataUrl)} bo={dk.bo} />

      {moBangLenh && (
        <TerminalThat cuocId={cuocId} onDong={() => datMoBangLenh(false)} onCanMo={() => datMoBangLenh(true)} />
      )}

      {lenhTraLoi !== null && (
        <div className="ct-lenh-traloi" role="status">
          <div className="ct-lenh-traloi-than">
            <ChuAgent text={lenhTraLoi} />
            {lenhNut === 'nhapKey' && (
              <NhapKeyGiaHan
                khoa={trangThai.dangChay}
                chuXong="hạn mức mới đã có hiệu lực."
                onXong={(q) => datHanMuc(q)}
              />
            )}
            {lenhNut === 'henLo' && (
              <div className="ct-nut-hang">
                <button type="button" className="ct-btn" onClick={() => { void window.cuongthai?.agent.xuLyHenLo('chay').then((x) => traLoi(dichP('Đang chạy bù {n} hẹn — mỗi hẹn mở lại đúng việc của nó (xem ở Lịch sử).', { n: x.n }))); }}>
                  {dich('Chạy bù ngay')}
                </button>
                <button type="button" className="ct-btn ct-btn-ghost" onClick={() => { void window.cuongthai?.agent.xuLyHenLo('bo').then((x) => traLoi(dichP('Đã bỏ {n} hẹn đã lỡ.', { n: x.n }))); }}>
                  {dich('Bỏ các hẹn đã lỡ')}
                </button>
              </div>
            )}
            {typeof lenhNut === 'object' && lenhNut?.chon && (
              /* Đợt 5: thẻ lựa chọn kiểu CLI — nút đánh số; ô nhập trống + phím số cũng chọn (`phimTrongO`). */
              <div className="ct-nut-hang ct-the-chon" data-the-chon="1">
                {lenhNut.chon.ds.filter((m) => !m.tat).map((m, k) => {
                  const so = m.so ?? (k < 9 ? String(k + 1) : '');
                  return (
                    <button key={m.giaTri} type="button" className={k === 0 ? 'ct-btn' : 'ct-btn ct-btn-ghost'} title={m.mo ?? m.nhan}
                      onClick={() => { const c = lenhNut.chon; traLoi(null); void Promise.resolve(c.khiChon(m.giaTri)).catch((e: Error) => traLoi(`⚠ ${e.message}`)); }}>
                      {so ? <kbd>{so}</kbd> : null} {m.nhan}{m.mo ? <span className="ct-the-chon-mo"> · {m.mo}</span> : null}
                    </button>
                  );
                })}
              </div>
            )}
            {lenhNut === 'caiNgoaiTuyen' && (
              <button type="button" className="ct-ngoai-tuyen-nut" onClick={moCaiNgoaiTuyen}>
                {dich('Mở cài đặt CuongMini ngoại tuyến')}
              </button>
            )}
          </div>
          <button type="button" title={dich('Đóng')} aria-label={dich('Đóng')} onClick={() => traLoi(null)}>
            <X size={12} aria-hidden />
          </button>
        </div>
      )}

      {/* `/plan` xong ⇒ DUYỆT rồi mới làm. Lượt kế hoạch chạy CHỈ ĐỌC (main bỏ
          quyền ghi khỏi lượt đó), nên tới đây chưa có gì bị sửa. */}
      {choDuyetKH && !trangThai.dangChay && trangThai.muc.length > 0 && (
        <div className="ct-notice ct-duyet-kh" data-tone="info">
          <ListChecks size={14} aria-hidden />
          <span>{dich('Kế hoạch ở trên đã xong (chưa sửa gì). Duyệt thì agent làm theo; chế độ "Kế hoạch" sẽ được nâng lên "Hỏi từng việc".')}</span>
          <button
            type="button"
            className="ct-btn"
            onClick={() => {
              datChoDuyetKH(false);
              void (async () => {
                if ((thuMuc?.cheDoQuyen ?? 'keHoach') === 'keHoach') await doiCheDoQuyen('hoi');
                void gui(PROMPT_DUYET_KE_HOACH);
              })();
            }}
          >
            <Check size={13} aria-hidden /> {dich('Duyệt & làm')}
          </button>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => datChoDuyetKH(false)}>
            {dich('Bỏ qua')}
          </button>
        </div>
      )}

      {/* Hàng chờ — người dùng phải THẤY câu mình vừa gõ đang nằm đâu, và bỏ
          được. Không hiện thì gõ xong Enter là chữ biến mất, trông y như mất. */}
      {hangCho.length > 0 && (
        <div className="ct-hang-cho">
          {hangCho.map((c, i) => (
            <div key={`${i}-${c.slice(0, 20)}`} className="ct-hang-cho-o" title={c}>
              <ListPlus size={11} aria-hidden />
              <span>{c.length > 70 ? `${c.slice(0, 70)}…` : c}</span>
              <button
                type="button"
                title={dich('Bỏ khỏi hàng chờ')}
                onClick={() => datHangCho((truoc) => truoc.filter((_, k) => k !== i))}
              >
                <X size={11} aria-hidden />
              </button>
            </div>
          ))}
          <span className="ct-hang-cho-nhan">
            {dich('sẽ gửi lần lượt khi lượt hiện tại xong')}
          </span>
        </div>
      )}

      {/* ⚠️ KEO THEO `dangChay`, KHÔNG PHẢI `dangNghi`. `dangNghi` tắt ở gần
          như mọi sự kiện (chu, toolBatDau, tool, cả năm loại xinPhep) và chỉ
          bật lại ở `batDau` của vòng SAU — nên nó để lại một khoảng vài giây
          sau MỖI tool mà màn hình đứng im hoàn toàn. `dangChay` bật từ `gui()`
          và tắt ở `finally`, phủ trọn lượt, không kẽ hở. */}
      {trangThai.dangChay && (
        <ThanhDangLam
          viec={viecHienTai}
          {...(trangThai.buoc ? { buoc: trangThai.buoc } : {})}
        />
      )}

      <MoiGhiChu cuocId={cuocId} coThuMuc={coThuMuc} />

      {/* Ô soạn = MỘT khung: chữ ở trên, hàng công cụ ở dưới (03/10/2026).
          Bản cũ xếp 📎 · 📷 · ô chữ · nút Gửi trên CÙNG một hàng — cột hẹp là ô
          chữ bị bóp còn vài chục px và placeholder mất cả hai đầu. */}
      {/* Đợt 3: đang CHỜ điều kiện / HẸN quay lại — có nút huỷ. */}
      <DaiHenCho cho={trangThai.henCho.cho} hen={trangThai.henCho.hen} huyCho={huyCho} huyHen={huyHen} />
      {/* Đợt 5: dòng CT Work kiểu Claude Code — dự án · sprint · còn N ngày · ▶ thẻ của nhánh. Bấm = menu /ctwork. */}
      {dongCtw && (
        <button type="button" className="ct-dong-ctw" title={Ld('CT Work — bấm để mở menu', 'CT Work — click for the menu')}
          onClick={() => { void lenhCtwork('/ctwork', '', gdCtw()); }}>
          {veDongCtw(dongCtw, nn, 160)}
        </button>
      )}
      {/* Đợt 8A: hàng chip gợi ý bước tiếp (máy chủ tách từ câu trả lời) — bấm để điền vào ô, Enter gửi. */}
      {goiYTiep.length > 0 && !trangThai.dangChay && !nhap && (
        <div className="ct-agent-goiy" role="list" aria-label={dich('Gợi ý bước tiếp')}>
          {goiYTiep.map((g) => (
            <button key={g} type="button" role="listitem" className="ct-btn ct-btn-ghost ct-mcp-nho"
              onClick={() => { capNhatNhap(g, g.length); boGoiYTiep(); requestAnimationFrame(() => oNhapRef.current?.focus()); }}>
              {g}
            </button>
          ))}
        </div>
      )}
      <div className="ct-agent-soan">
       <div className="ct-agent-soan-khung" data-chay={trangThai.dangChay}>
        <textarea
          ref={oNhapRef}
          className="ct-agent-o"
          rows={2}
          onPaste={dk.danVao}
          value={nhap}
          placeholder={choChiDan
            ? dich('CuongMini nên làm gì khác? Gõ chỉ dẫn rồi Enter…')
            : goiYTiep.length && !trangThai.dangChay
              ? `${goiYTiep[0]}   ⇥ Tab`
            : coThuMuc
              ? `Hỏi về ${thuMuc?.name}… (kéo thả hoặc dán file, gõ / để xem lệnh)`
              : 'Chọn thư mục dự án trước, rồi hỏi…'}
          onChange={(e) => { if (choChiDan) boChoChiDan(); if (goiYTiep.length && e.target.value) boGoiYTiep(); capNhatNhap(e.target.value, e.target.selectionStart ?? e.target.value.length); }}
          /* Di chuyển con trỏ bằng phím mũi tên hay chuột KHÔNG bắn `onChange`.
             Thiếu dòng này thì bảng gợi ý còn treo lại sau khi người dùng đã
             bấm ra chỗ khác trong câu — một bảng nổi nuốt phím Enter ở nơi
             người dùng không hề gõ `@`. */
          onSelect={(e) => {
            const o = e.currentTarget;
            datTokenFile(coThuMuc ? docTokenFile(o.value, o.selectionStart ?? 0) : null);
          }}
          onBlur={() => datTokenFile(null)}
          onKeyDown={phimTrongO}
        />
        <div className="ct-agent-soan-hang">
        <ODinhKemCode oFileRef={dk.oFileRef} nhanTuO={dk.nhanTuO} />
        {/* Chưa chọn thư mục dự án ⇒ khoá: file trên đĩa phải nằm TRONG gốc dự
            án (ngục của agent), nên không có gốc thì không có chỗ để đặt. */}
        <NutChonTep onBam={dk.moChonTep} khoa={trangThai.dangChay || !coThuMuc} />
        {/* Chụp màn hình KHÔNG cần thư mục dự án: ảnh đi đường "gửi thẳng",
            không ghi xuống đĩa, nên không cần ngục để đặt vào. */}
        <NutChupManHinh onBam={() => datDangChupMan(true)} khoa={trangThai.dangChay} />
        <span className="ct-agent-soan-goiy" aria-hidden>
          <kbd>/</kbd> {dich('lệnh')} · <kbd>@</kbd> {dich('file')} · <kbd>⇧↵</kbd> {dich('xuống dòng')}
        </span>
        <span className="ct-agent-soan-dem" aria-hidden />
        {trangThai.dangChay ? (
          <>
            {nhap.trim() && (
              <button type="button" className="ct-btn ct-btn-ghost" onClick={guiDi}
                title={nhap.trim().startsWith('/')
                  ? dich('Xếp câu này vào hàng chờ — gửi ngay khi lượt hiện tại xong')
                  : dich('Chèn câu này vào lượt ĐANG chạy — agent đọc ngay sau tool kế tiếp (Enter cũng được)')}>
                <ListPlus size={14} aria-hidden />
                {nhap.trim().startsWith('/') ? dich('Xếp hàng') : dich('Chèn vào lượt')}
              </button>
            )}
            {/* Khoá nút và đổi chữ NGAY khi bấm. Không có phản hồi tức thì thì
                người dùng tưởng cú bấm không ăn và bấm tiếp — họ báo đúng vậy. */}
            <button
              type="button"
              className="ct-btn ct-agent-dung"
              onClick={dung}
              disabled={dangDung}
            >
              <CircleStop size={14} aria-hidden />
              {dangDung ? dich('Đang dừng…') : dich('Dừng')}
            </button>
          </>
        ) : (
          <button
            type="button"
            data-nut="gui"
            className="ct-btn"
            onClick={guiDi}
            disabled={!nhap.trim() || dk.dangTai}
            title={dk.dangTai ? 'Đang chuẩn bị file đính kèm…' : undefined}
          >
            <Send size={14} aria-hidden />
            {dich('Gửi')}
          </button>
        )}
        </div>
       </div>
      </div>

      <div className="ct-agent-chan">
        <span>
          {/* Chân màn hình nói ĐÚNG chế độ đang bật. Đây là chỗ duy nhất người
              dùng nhìn thấy thường trực, nên nó phải nói cả cái GIÁ của chế độ
              chứ không chỉ cái tên — nhất là câu về `.env`. */}
          {thuMuc?.cheDoQuyen === 'keHoach' || !thuMuc?.cheDoQuyen
            ? <Chu cau="Đang **chỉ đọc** — chưa sửa file, chưa chạy lệnh. Không đọc `.env` và các file khoá." />
            : thuMuc.cheDoQuyen === 'hoi'
              ? <Chu cau="Agent **sửa file và chạy lệnh** — mỗi việc đều phải bạn duyệt. Lệnh shell **đọc được cả** `.env`, hãy đọc kỹ trước khi duyệt." />
              : thuMuc.cheDoQuyen === 'tuSua'
                ? <Chu cau="Agent **tự sửa file, không hỏi**. Lệnh vẫn hỏi từng cái. Dùng nút Hoàn tác nếu nó sửa nhầm." />
                : <Chu cau="Agent **tự sửa file và tự chạy lệnh thường**, không hỏi. Chỉ lệnh bị xếp **nguy hiểm** mới dừng lại hỏi bạn." />}
        </span>
        {trangThai.tienPhien > 0 && <span className="ct-muted">~${trangThai.tienPhien.toFixed(3)} phiên này</span>}
      </div>

      {anhTo && (
        <AnhPhongTo
          media={anhTo.ds.map((u, k) => ({ id: k, type: 'IMAGE', url: u }))}
          chiSo={anhTo.i}
          onDoiChiSo={(i) => datAnhTo({ ...anhTo, i })}
          onDong={() => datAnhTo(null)}
        />
      )}
    </div>
  );
}

/** Nhãn phím tắt — đúng ký hiệu của từng hệ điều hành. */
const LA_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const PHIM = {
  terminal: LA_MAC ? '⌃`' : 'Ctrl+`',
  web: LA_MAC ? '⇧⌘B' : 'Ctrl+Shift+B',
  model: LA_MAC ? '⇧⌘M' : 'Ctrl+Shift+M',
  lichSu: LA_MAC ? '⇧⌘L' : 'Ctrl+Shift+L',
  boNho: LA_MAC ? '⇧⌘Y' : 'Ctrl+Shift+Y',
} as const;

/**
 * MENU "⋯" — chỉ HIỆN khi cột hẹp (CSS `@container cotagent`).
 *
 * Gom những nút ít dùng: hai công tắc quyền (Trình duyệt, Ghi chú) và bốn tấm
 * (Worktree, MCP, Hook, Bộ nhớ). Mục tấm KHÔNG dựng bảng thứ hai — nó gọi
 * `moTam` để mở đúng bảng gốc (nút gốc chỉ bị ẩn, bảng vẫn còn đó).
 */
function MenuThem({
  cuocId, coThuMuc, khoa, trinhDuyet, ghiChu, onTrinhDuyet, onGhiChu, onLichSu, soViec, onViecMoi, coViec,
}: {
  cuocId: string; coThuMuc: boolean; khoa: boolean; trinhDuyet: boolean; ghiChu: boolean;
  onTrinhDuyet: () => void; onGhiChu: () => void;
  onLichSu: () => void; soViec: number; onViecMoi: () => void; coViec: boolean;
}) {
  const { dich } = useDich();
  const { mo, bat, dong, boc } = useMoRieng('agent:them');
  const coBat = trinhDuyet || ghiChu;
  const muc: Array<{ key: string; icon: React.ReactNode; nhan: string; phai?: string; bat?: boolean; tat?: boolean; lam: () => void }> = [
    { key: 'trinhduyet', icon: <Globe size={14} aria-hidden />, nhan: dich('Trình duyệt cho agent'), bat: trinhDuyet, tat: khoa, lam: () => { onTrinhDuyet(); dong(); } },
    { key: 'ghinote', icon: <NotebookPen size={14} aria-hidden />, nhan: dich('Ghi vào Ghi chú'), bat: ghiChu, tat: khoa, lam: () => { onGhiChu(); dong(); } },
    ...(coThuMuc ? [{ key: 'worktree', icon: <GitBranch size={14} aria-hidden />, nhan: 'Worktree', lam: () => moTam(cuocId, 'worktree') }] : []),
    { key: 'mcp', icon: <Plug size={14} aria-hidden />, nhan: dich('Máy chủ MCP'), phai: '/mcp', lam: () => moTam(cuocId, 'mcp') },
    { key: 'hook', icon: <Webhook size={14} aria-hidden />, nhan: 'Hook', phai: '/hooks', tat: khoa, lam: () => moTam(cuocId, 'hook') },
    { key: 'bonho', icon: <Brain size={14} aria-hidden />, nhan: dich('Bộ nhớ'), phai: PHIM.boNho, tat: khoa, lam: () => moTam(cuocId, 'boNho') },
    { key: 'trinhsoan', icon: <Code2 size={14} aria-hidden />, nhan: dich('Dùng trong VS Code / Cursor…'), lam: () => { dong(); moTam(cuocId, 'trinhSoan'); } },
    { key: 'lichsu', icon: <History size={14} aria-hidden />, nhan: `${dich('Việc đã lưu')} (${soViec})`, phai: PHIM.lichSu, lam: () => { dong(); onLichSu(); } },
    { key: 'viecmoi', icon: <RotateCcw size={14} aria-hidden />, nhan: dich('Việc mới'), phai: '/clear', tat: !coViec, lam: () => { dong(); onViecMoi(); } },
  ];
  return (
    <div className="ct-agent-them" ref={boc}>
      <button
        type="button"
        className="ct-agent-icon"
        data-nut="them"
        data-co-bat={coBat}
        onClick={bat}
        aria-haspopup="menu"
        aria-expanded={mo}
        title={dich('Thêm công cụ')}
        aria-label={dich('Thêm công cụ')}
      >
        <MoreHorizontal size={15} aria-hidden />
      </button>
      {mo && (
        <div className="ct-agent-them-bang" role="menu">
          {muc.map((m) => (
            <button
              key={m.key}
              type="button"
              role="menuitem"
              data-muc={m.key}
              disabled={m.tat}
              onClick={m.lam}
            >
              {m.icon}
              <span>{m.nhan}</span>
              {m.bat !== undefined
                ? <em data-bat={m.bat}>{m.bat ? dich('bật') : dich('tắt')}</em>
                : m.phai ? <kbd>{m.phai}</kbd> : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Dòng tool chạy lệnh gần nhất TRƯỚC khối đầu ra — để khối có tiêu đề. */
function lenhTruoc(muc: readonly MucHienThi[], i: number): string | null {
  for (let j = i - 1; j >= 0 && j >= i - 6; j--) {
    const m = muc[j];
    if (m?.kieu === 'tool' && /run_command|chay_lenh_nen|doc_dau_ra_nen/.test(m.ten)) return m.tomTat || m.ten;
    if (m?.kieu === 'xinPhepLenh') return m.lenh;
    if (m?.kieu === 'nguoi') break;
  }
  return null;
}

/**
 * KHỐI ĐẦU RA LỆNH — tiêu đề lệnh + chép + thu gọn (03/10/2026).
 *
 * Bản cũ là một `pre` trần: không biết của lệnh nào, không chép được gọn, và
 * `npm test` dài hai nghìn dòng chiếm cả bảng ghi. Nay: dòng đầu `$ …` (nếu
 * lệnh tự in ra) hoặc dòng tool ngay trước nó làm tiêu đề; thân cuộn riêng hai
 * chiều với trần chiều cao; dài thì mặc định thu về 12 dòng cuối.
 *
 * Vẫn KHÔNG dựng bằng innerHTML — đây là chữ do một tiến trình bất kỳ in ra.
 */
function KhoiLenhRa({ text, tenTruoc, dangChay }: { text: string; tenTruoc: string | null; dangChay: boolean }) {
  const { dich } = useDich();
  const dong = text.replace(/\n$/, '').split('\n');
  const dau = dong[0]?.startsWith('$ ') ? dong[0].slice(2) : null;
  const tieuDe = dau ?? tenTruoc ?? dich('Đầu ra lệnh');
  const dai = dong.length > 14;
  const [thu, datThu] = useState<boolean | null>(null);
  const daThu = thu ?? false;
  const [daChep, datDaChep] = useState(false);
  const chep = (): void => {
    void navigator.clipboard.writeText(text).then(() => {
      datDaChep(true);
      setTimeout(() => datDaChep(false), 1400);
    }).catch(() => { /* clipboard bị chặn — vẫn chọn-chép tay được */ });
  };
  const hien = daThu ? dong.slice(-3).join('\n') : text;
  return (
    <div className="ct-lenhra" data-thu={daThu} data-chay={dangChay}>
      <div className="ct-lenhra-dau">
        {dangChay ? <Loader2 size={12} aria-hidden className="ct-spin" /> : <SquareTerminal size={12} aria-hidden />}
        <code className="ct-lenhra-ten" title={tieuDe}>{tieuDe}</code>
        <span className="ct-lenhra-dem">{dong.length} {dich('dòng')}</span>
        <button type="button" onClick={chep} title={dich('Chép toàn bộ đầu ra')} aria-label={dich('Chép toàn bộ đầu ra')}>
          {daChep ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
          <span>{daChep ? dich('Đã chép') : dich('Chép')}</span>
        </button>
        {dai && (
          <button type="button" onClick={() => datThu(!daThu)} aria-expanded={!daThu}
            title={daThu ? dich('Mở đầy đủ') : dich('Thu gọn')}>
            {daThu ? <ChevronsUpDown size={12} aria-hidden /> : <ChevronsDownUp size={12} aria-hidden />}
            <span>{daThu ? dich('Mở') : dich('Thu gọn')}</span>
          </button>
        )}
      </div>
      <pre className="ct-lenh-ra" tabIndex={0}>{hien}</pre>
    </div>
  );
}

/**
 * Bảng kế hoạch — ghim TRÊN bảng ghi, không cuộn theo.
 *
 * Nó trả lời đúng câu người dùng hỏi trong đầu suốt một việc dài: "còn bao lâu
 * nữa?". Để nó cuộn theo bảng ghi thì sau bước thứ năm nó trôi khỏi màn hình,
 * đúng lúc câu hỏi đó bắt đầu nhức.
 */
function BangKeHoach({ viec }: { viec: AgentViec[] }) {
  const { dich } = useDich();
  const xong = viec.filter((v) => v.trangThai === 'xong').length;
  const trongXong = viec.length > 0 && xong === viec.length;

  /*
   * GẬP LẠI ĐƯỢC, VÀ TỰ GẬP KHI XONG.
   *
   * Người dùng báo 19/08/2026: ở mức Ultracode agent lập 9 việc, bảng này
   * ghim trên cùng và che gần hết màn hình, không có cách nào ẩn. Ba việc
   * cùng lúc mới đủ chữa:
   *   • bấm vào đầu bảng để gập  — quyền chủ động, lúc nào cũng có
   *   • xong hết thì TỰ gập      — kế hoạch đã hoàn thành chỉ còn là lịch sử,
   *                                giữ nguyên cỡ là chiếm chỗ cho một thứ
   *                                không ai đọc nữa
   *   • kẹp chiều cao + cuộn riêng (CSS) — kể cả khi mở, một kế hoạch 30 việc
   *                                cũng không được phép ăn cả màn hình
   *
   * `null` = người dùng chưa tự quyết ⇒ đi theo luật tự gập. Bấm một lần là
   * ý họ thắng và giữ nguyên tới hết việc.
   */
  const [tuGap, datTuGap] = useState<boolean | null>(null);
  const gap = tuGap ?? trongXong;
  /* Bước ĐANG LÀM — hiện ngay trên đầu dải, kể cả khi gập (03/10/2026): câu
     "đang tới đâu rồi?" phải trả lời được bằng một cái liếc, không phải mở ra
     rồi dò xem dòng nào có chấm quay. */
  const dang = viec.find((v) => v.trangThai === 'dang')
    ?? (trongXong ? null : viec.find((v) => v.trangThai !== 'xong'));
  const soThuTu = dang ? viec.indexOf(dang) + 1 : 0;

  return (
    <div className="ct-kehoach" data-gap={gap}>
      <button
        type="button"
        className="ct-kehoach-dau"
        onClick={() => datTuGap(!gap)}
        aria-expanded={!gap}
        title={gap ? 'Mở kế hoạch' : 'Gập kế hoạch'}
      >
        <ListChecks size={13} aria-hidden />
        <span className="ct-kehoach-nhan">{dich('Kế hoạch')}</span>
        <span className="ct-kehoach-dem">{xong}/{viec.length}</span>
        <div className="ct-kehoach-thanh" aria-hidden>
          <div className="ct-kehoach-day" style={{ width: `${(xong / viec.length) * 100}%` }} />
        </div>
        {dang ? (
          <span className="ct-kehoach-buoc" title={dang.ten}>
            <b>{dich('Bước')} {soThuTu}</b> {dang.ten}
          </span>
        ) : (
          <span className="ct-kehoach-buoc" data-xong>{dich('Đã xong cả kế hoạch')}</span>
        )}
        <ChevronDown size={13} aria-hidden className="ct-kehoach-mui" />
      </button>
      {gap ? null : (
      <ul className="ct-kehoach-ds">
        {viec.map((v, i) => (
          <li key={i} data-tt={v.trangThai} aria-current={v === dang ? 'step' : undefined}>
            {v.trangThai === 'xong'
              ? <Check size={12} aria-hidden />
              : v.trangThai === 'dang'
                ? <CircleDot size={12} aria-hidden className="ct-spin-cham" />
                : <Circle size={12} aria-hidden />}
            <span>{v.ten}</span>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

/**
 * MODEL + MỨC NỖ LỰC — một nút, một bảng.
 *
 * ─── VÌ SAO GỘP LÀM MỘT ───
 * Sáu mức nỗ lực dàn thành sáu cái nút thì chiếm hết thanh công cụ, mà thanh
 * đó đã có bảy thứ khác. Và hai lựa chọn này luôn được cân nhắc CÙNG NHAU —
 * "dùng Opus ở mức Ultracode" là một quyết định, không phải hai.
 *
 * ─── VÌ SAO HAI DANH SÁCH RỜI, KHÔNG PHẢI MỘT THANH TRƯỢT ───
 * Trực giác muốn một thanh "rẻ ↔ mạnh" gộp cả model lẫn số bước. Đo thật
 * 18/08 nói không: model đắt nhất theo bảng giá lẻ của cổng (opus, 2,00/lượt)
 * lại RẺ HƠN BA LẦN so với `gpt-5.6-sol` (1,22/lượt) khi chạy vòng lặp gọi
 * tool — vì cổng bọc model GPT trong ~15k token ẩn mỗi việc, và phần bọc đó
 * nhân theo số vòng. Một thanh trượt gộp sẽ xếp chúng ngược hẳn thực tế.
 *
 * Nhãn nói bằng SỐ ĐO ĐƯỢC — số bước, số giây, gấp mấy lần tiền — chứ không
 * bằng tính từ. "Mạnh hơn" thì ai cũng bấm; "đắt gấp 2,3 lần và chậm hơn 23%"
 * thì người ta bấm khi họ thật sự cần.
 */
/**
 * Tên HIỂN THỊ của model — thương hiệu riêng, không trùng tên Claude của
 * Anthropic (người dùng yêu cầu 25/09/2026): Haiku → "Cuong Haiku", Sonnet →
 * "Cuong Sonnet", Opus → "CuongMini Max"; số phiên bản giữ nguyên.
 *
 * Làm ở CẢ HAI phía: máy chủ (`src/services/agent/models.ts`) đã đổi tên, nhưng
 * app phải chạy được với máy chủ chưa deploy bản mới — nên đổi thêm lúc hiện.
 * Chỉ đổi TÊN; `id` gửi lên máy chủ không đụng tới.
 */
export function doiTenModel(ten: string): string {
  return ten
    .replace(/^Claude Haiku\b/, 'Cuong Haiku')
    .replace(/^Claude Sonnet\b/, 'Cuong Sonnet')
    .replace(/^Claude Opus\b/, 'CuongMini Max')
    .replace(/^Claude Fable\b/, 'Cuong Fable');
}

/** Chỉ dùng khi máy chủ CŨ chưa khai `models` — máy chủ mới luôn gửi bảng CuongMini (18/10/2026). */
const DS_MODEL: Array<{ id: ModelAgent; ten: string; mo: string }> = [
  { id: 'cm-default', ten: 'CuongMini Default', mo: 'Mặc định' },
];

const DS_MUC: Array<{ id: MucNoLuc; ten: string; mo: string }> = [
  { id: 'thap', ten: 'Thấp', mo: '8 bước — hỏi nhanh, trả lời sớm' },
  { id: 'vua', ten: 'Vừa', mo: '30 bước — mặc định' },
  { id: 'cao', ten: 'Cao', mo: '60 bước — đọc rộng, tự chạy test' },
  { id: 'ratCao', ten: 'Rất cao', mo: '100 bước · 5 agent phụ' },
  { id: 'toiDa', ten: 'Tối đa', mo: '160 bước · 6 agent phụ' },
  { id: 'ultracode', ten: 'Ultracode', mo: '260 bước · 10 agent phụ — chia việc, chạy song song, tự phản biện' },
];

/**
 * Bảng của MÁY CHỦ thắng bảng chép cứng ở trên. Con số bước là thứ máy chủ
 * áp đặt, nên app tự khai "60 bước" trong khi máy chủ đã đổi thành 100 là một
 * lời nói dối không ai phát hiện được. Bảng chép cứng chỉ để app còn chạy được
 * với máy chủ cũ chưa khai hai trường này. Dùng chung cho menu và `/effort`.
 */
function dsMucCua(info: AgentInfo): Array<{ id: MucNoLuc; ten: string; mo: string }> {
  return info.mucNoLuc?.length
    ? info.mucNoLuc.map((m) => ({
        id: m.id,
        ten: m.ten,
        mo: `${m.buoc} bước · ${m.viecPhu} agent phụ${m.id === 'ultracode' ? ' — chia việc, chạy song song, tự phản biện' : ''}`,
      }))
    : DS_MUC;
}

interface MucModel {
  id: ModelAgent; ten: string; mo: string; dungDuoc: boolean; dat: boolean;
  /** `anthropic` = cổng "CuongMini Code Max"; còn lại = cổng chính. CHỈ để nhóm — không hiện. */
  cong: 'chinh' | 'anthropic';
  canMoKhoa: boolean;
  /** 19/10/2026: tài khoản miễn phí — model cần gói Pro (ổ khoá + lời mời nâng cấp). */
  canPro?: boolean;
  mienPhi: boolean;
  /** Tên CỔNG hiển thị (CuongMini …) do máy chủ khai. */
  nhom?: string;
}

/** Danh sách model hiện có — dùng chung cho menu và `/model`. */
function dsModelCua(info: AgentInfo): MucModel[] {
  return info.models?.length
    ? info.models.map((m) => ({
        id: m.id as ModelAgent,
        /* 18/10/2026: máy chủ đã gửi TÊN CuongMini, xếp năng lực cao → thấp — hiện nguyên. */
        ten: doiTenModel(m.ten),
        mo: ngonNguHienTai() === 'en' && m.moEn ? m.moEn : m.mo, dungDuoc: m.dungDuoc,
        ...(m.nhom ? { nhom: m.nhom } : {}),
        dat: m.dat === true || m.id === ID_FABLE,
        cong: m.cong === 'anthropic' ? 'anthropic' as const : 'chinh' as const,
        canMoKhoa: m.canMoKhoa === true,
        ...(m.canPro ? { canPro: true } : {}),
        mienPhi: m.mienPhi === true,
      }))
    : DS_MODEL.map((m) => ({ ...m, dungDuoc: true, dat: false, cong: 'chinh' as const, canMoKhoa: false, mienPhi: false }));
}

function ChonModelVaMuc({
  cuocId, muc, model, khoa, info, onChonMuc, onChonModel, cucBo, onDoiCucBo, onNapLaiInfo,
}: {
  cuocId: string;
  muc: MucNoLuc; model: ModelAgent; khoa: boolean; info: AgentInfo;
  onChonMuc: (m: MucNoLuc) => void; onChonModel: (m: ModelAgent) => void;
  /** Đọc lại `info` (sau khi mở khoá cổng chính hãng: `canMoKhoa` đổi). */
  onNapLaiInfo?: () => void;
  /** AI trên máy (gói ngoại tuyến) — `null` khi máy chưa có model cho AI Code. */
  cucBo: { ten: string; bat: boolean } | null;
  onDoiCucBo: (bat: boolean) => void;
}) {
  const { dich } = useDich();
  /* Đóng-khi-bấm-ra-ngoài và "mỗi lúc một tấm" nay ở `useMoRieng`. Bản cũ tự
     lo phần ra-ngoài của RIÊNG nó, nên mở bảng này trong khi bảng MCP đang mở
     là hai bảng chồng lên nhau — không chỗ nào biết chỗ kia tồn tại. */
  /* Không lấy `dong`: chọn model xong bảng CỐ Ý ở lại, vì đa số người đổi
     model rồi đổi luôn mức nỗ lực ngay bên dưới. */
  const { mo, bat, boc } = useMoRieng('agent:model');
  useMoTuNgoai(cuocId, 'model', mo, bat);
  /* Model đắt ⇒ bấm chọn phải XÁC NHẬN. */
  const [hoiFable, datHoiFable] = useState<ModelAgent | null>(null);
  useEffect(() => { if (!mo) datHoiFable(null); }, [mo]);
  /* Cổng dự phòng (modelapi, cần mật khẩu) — một mục riêng dưới danh sách model. */
  const { t: duPhong } = useCongDuPhong(mo);
  const [moDuPhong, datMoDuPhong] = useState(false);
  useEffect(() => { if (!mo) datMoDuPhong(false); }, [mo]);
  /* Model cao chính hãng chưa mở khoá đang được hỏi mật khẩu (id model). */
  const [hoiKhoa, datHoiKhoa] = useState<ModelAgent | null>(null);
  useEffect(() => { if (!mo) datHoiKhoa(null); }, [mo]);

  const dsMuc = dsMucCua(info);
  const dsModel = dsModelCua(info);

  const mucNay = dsMuc.find((m) => m.id === muc) ?? dsMuc[1] ?? DS_MUC[1]!;
  const modelNay = dsModel.find((m) => m.id === model) ?? dsModel[0] ?? { ...DS_MODEL[0]!, dungDuoc: true };
  // Tên ngắn cho cái nút — tên đầy đủ không lọt vào thanh công cụ.
  const tenNgan = modelNay.ten;

  return (
    <div className="ct-chonmm" ref={boc}>
      <button
        type="button"
        className="ct-chonmm-nut"
        data-nut="modelmuc"
        data-muc={muc}
        data-model={model}
        data-ultra={muc === 'ultracode'}
        disabled={khoa}
        onClick={bat}
        title={khoa ? 'Đang chạy một việc — đổi sau khi xong' : `${modelNay.ten} · mức ${mucNay.ten}`}
        aria-expanded={mo}
      >
        {muc === 'ultracode' ? <Zap size={12} aria-hidden /> : <Cpu size={12} aria-hidden />}
        <span className="ct-chonmm-chu">{tenNgan}</span>
        <span className="ct-chonmm-cham">·</span>
        <span className="ct-chonmm-muc">{mucNay.ten}</span>
        <ChevronDown size={11} aria-hidden />
      </button>

      {mo && (
        <div className="ct-chonmm-bang" role="dialog" aria-label={dich('Model và mức nỗ lực')}>
          {/* 18/10/2026: MỘT danh sách, xếp năng lực cao → thấp (thứ tự của máy chủ), CHỈ tên CuongMini.
              Model cần khoá chưa có vé ⇒ tối hơn; bấm ⇒ ô nhập khoá, đúng thì sáng lên và chọn luôn. */}
          <p className="ct-chonmm-nhan">Model</p>
          <ul className="ct-chonmm-ds">
            {dsModel.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  data-chon-model={m.id}
                  data-chon={m.id === model}
                  data-dat={m.dat}
                  data-khoa={m.canMoKhoa}
                  data-mien-phi={m.mienPhi}
                  disabled={!m.dungDuoc}
                  style={m.canMoKhoa || m.canPro ? { opacity: 0.62 } : undefined}
                  title={m.canPro ? dich('Cần gói Pro') : m.dungDuoc ? m.mo : dich('Model này tạm thời chưa dùng được')}
                  onClick={() => {
                    if (m.canMoKhoa) { datHoiKhoa((h) => (h === m.id ? null : m.id)); return; }
                    if (m.dat && m.id !== model) { datHoiFable(m.id); return; }
                    onChonModel(m.id);
                  }}
                >
                  {m.id === model ? <Check size={12} aria-hidden /> : <span className="ct-chonmm-o" />}
                  <span>
                    <strong>
                      {m.ten}
                      {m.dat && <b className="ct-chonmm-dat">$$$</b>}
                      {(m.canMoKhoa || m.canPro) && <OKhoa />}
                    </strong>
                    <em>{m.canPro ? dich('Cần gói Pro — nâng cấp tại cuongthai.com/pro') : m.dungDuoc ? m.mo : dich('tạm thời chưa dùng được')}</em>
                    {m.canMoKhoa && <em>{dich('Cần khoá — bấm để nhập')}</em>}
                  </span>
                </button>
                {m.canMoKhoa && hoiKhoa === m.id && (
                  <div className="ct-chonmm-xacnhan">
                    <MoCongAnthropic
                      model={m.id}
                      onXong={() => {
                        datHoiKhoa(null);
                        /* Đã có vé ⇒ chọn luôn model người dùng vừa bấm. */
                        if (m.dat && m.id !== model) datHoiFable(m.id);
                        else onChonModel(m.id);
                        onNapLaiInfo?.();
                      }}
                    />
                  </div>
                )}
                {m.dat && hoiFable === m.id && !m.canMoKhoa && (
                  <div className="ct-chonmm-xacnhan" role="alertdialog" aria-label={dich('Xác nhận dùng model đắt')}>
                    <p>⚠ <strong>{m.ten}</strong> {dich('là model đắt nhất — chỉ dùng cho việc cực khó.')}</p>
                    <div>
                      <button type="button" className="ct-btn" onClick={() => { datHoiFable(null); onChonModel(m.id); }}>
                        {dich('Vẫn dùng')}
                      </button>
                      <button type="button" className="ct-btn ct-btn-ghost" onClick={() => datHoiFable(null)}>
                        {dich('Thôi')}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {duPhong?.coCongChinh && duPhong.daBat && (
            <p className="ct-chonmm-nhan">{dich('modelapi · cổng dự phòng')}</p>
          )}
          {duPhong?.coCongChinh && duPhong.daBat && (
            <ul className="ct-chonmm-ds">
              <li>
                <button
                  type="button"
                  data-chon-duphong
                  data-chon={duPhong.veHopLe && duPhong.congChinhDangHong}
                  onClick={() => datMoDuPhong((v) => !v)}
                >
                  <LifeBuoy size={12} aria-hidden />
                  <span>
                    <strong>Dùng cổng dự phòng</strong>
                    <em>{moTaDuPhong(duPhong)}</em>
                  </span>
                </button>
                {moDuPhong && (
                  <div className="ct-chonmm-xacnhan">
                    <MoCongDuPhong />
                  </div>
                )}
              </li>
            </ul>
          )}

          {/* AI TRÊN MÁY (03/10/2026) — cùng chỗ với cổng dự phòng: đều là
              "chạy bằng gì". Bật = ép tab chạy model trên máy (y như `/offline`). */}
          {cucBo && (
            <ul className="ct-chonmm-ds">
              <li>
                <button
                  type="button"
                  data-chon-cucbo
                  data-chon={cucBo.bat}
                  onClick={() => onDoiCucBo(!cucBo.bat)}
                >
                  {cucBo.bat ? <Check size={12} aria-hidden /> : <PlugZap size={12} aria-hidden />}
                  <span>
                    <strong>{dich('CuongMini trên máy')} · {cucBo.ten}</strong>
                    <em>{cucBo.bat ? dich('Đang dùng — bấm để quay về máy chủ') : dich('Chạy trên máy này, không gửi lên máy chủ (/offline)')}</em>
                  </span>
                </button>
              </li>
            </ul>
          )}

          <p className="ct-chonmm-nhan">{dich('Mức nỗ lực')}</p>
          <ul className="ct-chonmm-ds">
            {dsMuc.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  data-chon-muc={m.id}
                  data-chon={m.id === muc}
                  data-ultra={m.id === 'ultracode'}
                  onClick={() => onChonMuc(m.id)}
                >
                  {m.id === muc ? <Check size={12} aria-hidden /> : <span className="ct-chonmm-o" />}
                  <span>
                    <strong>{m.ten}</strong>
                    <em>{m.mo}</em>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="ct-chonmm-chan">
            {dich('Mức càng cao càng tốn hạn mức 5 giờ. Ultracode có thể dùng hết hạn mức')}
            trong một việc — nó được sinh ra để làm cho xong hẳn, không để hỏi nhanh.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * VÒNG NGỮ CẢNH — bao nhiêu phần hội thoại còn tới được model.
 *
 * ─── VÌ SAO CON SỐ NÀY ĐÁNG CÓ CHỖ TRÊN MÀN HÌNH ───
 * Người dùng nhìn thấy cả hội thoại và tưởng agent nhớ hết. Thực tế máy chủ tự
 * lược kết quả tool cũ, và khi chạm trần thì BỎ HẲN những lượt cũ nhất. Không
 * hiện ra thì họ hỏi "sao lúc nãy tôi nói rồi mà giờ nó quên?" — và không có
 * chỗ nào trả lời được.
 *
 * Vẽ bằng SVG một vòng cung, không bằng thanh ngang: nó nằm cạnh thanh hạn mức
 * (vốn đã là thanh ngang), và hai thanh ngang cạnh nhau thì mắt không tách được
 * cái nào là cái nào.
 */
function VongNguCanh({ n }: { n: AgentNguCanh }) {
  const R = 7;
  const chuVi = 2 * Math.PI * R;
  const p = Math.min(100, Math.max(0, n.phanTram));
  const muc = p >= 90 ? 'day' : p >= 70 ? 'gan' : 'thoai';
  return (
    <div
      className="ct-vongnc"
      data-muc={muc}
      title={
        `Ngữ cảnh: ${Math.round(n.kyTu / 1000)}k / ${Math.round(n.tran / 1000)}k ký tự (${p}%)`
        + (n.soLuotDaBo > 0
          ? `\n⚠ Đã tự bỏ ${n.soLuotDaBo} lượt cũ nhất để lọt trần — agent KHÔNG còn nhớ phần đó, `
            + 'dù bạn vẫn thấy chúng ở trên.'
          : '\nChạm trần thì lượt cũ nhất sẽ tự bị bỏ, không phải bắt đầu lại.')
      }
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <circle cx="9" cy="9" r={R} className="ct-vongnc-nen" />
        <circle
          cx="9" cy="9" r={R}
          className="ct-vongnc-day"
          strokeDasharray={`${(chuVi * p) / 100} ${chuVi}`}
          // Bắt đầu từ 12 giờ, không phải 3 giờ — mọi vòng tiến trình người ta
          // từng thấy đều chạy từ đỉnh.
          transform="rotate(-90 9 9)"
        />
      </svg>
      <span className="ct-vongnc-so">{p}%</span>
      {n.soLuotDaBo > 0 && <span className="ct-vongnc-canh">↺{n.soLuotDaBo}</span>}
    </div>
  );
}

/**
 * Nút WORKTREE + bảng.
 *
 * `git worktree` cho agent một bản sao riêng của repo: cùng lịch sử, khác nhánh,
 * khác thư mục. Hai điều nó giải quyết:
 *
 *  1. "Để agent sửa thẳng vào chỗ tôi đang làm dở thì sao?" — với worktree thì
 *     nó KHÔNG sửa; cây làm việc của bạn không bị đụng tới.
 *  2. Hai tab cùng repo cùng được ghi thì `chayLuot` phải chặn (đè lên nhau).
 *     Hai worktree = hai đường dẫn ⇒ khoá không còn phải chặn, chạy song song
 *     thật sự.
 */
function NutWorktree({
  cuocId, khoa, onDoi,
}: { cuocId: string; khoa: boolean; onDoi: () => void }) {
  const { dich } = useDich();
  const { mo, bat, boc } = useMoRieng('agent:worktree');
  useMoTuNgoai(cuocId, 'worktree', mo, bat);
  const [ds, datDs] = useState<AgentWorktree[]>([]);
  const [ten, datTen] = useState('');
  const [ban, datBan] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);

  const nap = async (): Promise<void> => {
    datDs((await window.cuongthai?.agent.dsWorktree(cuocId)) ?? []);
  };
  // Hỏi lại mỗi lần MỞ bảng: người dùng có thể vừa tạo/xoá worktree bằng git ở
  // terminal, và một danh sách cũ ở đây dẫn tới thao tác lên thứ không còn nữa.
  useEffect(() => { if (mo) void nap(); }, [mo, cuocId]);

  const chay = async (viec: () => Promise<{ ok: boolean; loi?: string } | undefined>): Promise<void> => {
    datBan(true); datLoi(null);
    try {
      const r = await viec();
      if (r && !r.ok) { datLoi(r.loi ?? 'Không làm được.'); return; }
      await nap();
      onDoi();
    } finally { datBan(false); }
  };

  const dangDung = ds.find((w) => w.dangDung);

  return (
    <div className="ct-mcp-boc" ref={boc}>
      <button
        type="button"
        className="ct-agent-icon"
        data-nut="worktree"
        onClick={bat}
        title={dangDung && !dangDung.laChinh ? `Worktree: ${dangDung.nhanh}` : 'Worktree — bản sao riêng của repo'}
      >
        <GitBranch size={13} aria-hidden />
        {dangDung && !dangDung.laChinh && <span className="ct-mcp-dem">•</span>}
      </button>

      {mo && (
        <div className="ct-mcp-bang">
          <div className="ct-mcp-dau"><strong>Worktree</strong></div>

          {ds.length === 0 ? (
            <p className="ct-mcp-trong">{dich('Thư mục này không phải kho git, nên chưa dùng worktree được.')}</p>
          ) : (
            <ul className="ct-mcp-ds ct-wt-ds">
              {ds.map((w) => (
                <li key={w.duongDan} data-ok={w.dangDung}>
                  <button
                    type="button"
                    className="ct-wt-chon"
                    disabled={ban || khoa || w.dangDung}
                    onClick={() => void chay(() => window.cuongthai!.agent.doiWorktree(cuocId, w.duongDan))}
                    title={w.duongDan}
                  >
                    <span className="ct-mcp-ten">{w.nhanh ?? '(tách rời)'}</span>
                    {w.laChinh && <span className="ct-wt-nhan">{dich('chính')}</span>}
                    {w.dangDung && <span className="ct-wt-nhan" data-dang>{dich('đang mở')}</span>}
                  </button>
                  {w.cuaApp && !w.dangDung && (
                    <button
                      type="button"
                      className="ct-dk-bo ct-wt-xoa"
                      disabled={ban}
                      onClick={() => void chay(() => window.cuongthai!.agent.xoaWorktree(cuocId, w.duongDan))}
                      aria-label={`Xoá worktree ${w.nhanh}`}
                    >
                      <X size={11} aria-hidden />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {ds.length > 0 && (
            <div className="ct-wt-tao">
              <input
                className="ct-td-o"
                value={ten}
                placeholder={dich('tên nhánh mới…')}
                spellCheck={false}
                disabled={ban || khoa}
                onChange={(e) => datTen(e.target.value)}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === 'Enter' && ten.trim()) {
                    e.preventDefault();
                    void chay(() => window.cuongthai!.agent.taoWorktree(cuocId, ten)).then(() => datTen(''));
                  }
                }}
              />
              <button
                type="button"
                className="ct-btn ct-mcp-nho"
                disabled={ban || khoa || !ten.trim()}
                onClick={() => void chay(() => window.cuongthai!.agent.taoWorktree(cuocId, ten)).then(() => datTen(''))}
              >
                {ban ? <Loader2 size={12} aria-hidden className="ct-spin" /> : <FolderPlus size={12} aria-hidden />}
                {dich('Tạo')}
              </button>
            </div>
          )}

          {loi && <p className="ct-mcp-chan" data-loi>{loi}</p>}
          {!loi && ds.length > 0 && (
            <p className="ct-mcp-chan">
              <Chu cau="Nhánh mới mang tiền tố `agent/`. Xoá worktree KHÔNG xoá nhánh, và không xoá ép khi còn thay đổi chưa commit." />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Mẫu cấu hình chép-dán — Figma trước tiên, vì đó là câu người dùng hỏi.
 *
 * KHÔNG có nút "cài" ghi thẳng vào `mcp.json`: một server MCP là một dòng lệnh
 * sẽ chạy trên máy, và file cấu hình là chỗ duy nhất người dùng NHÌN THẤY nó
 * trước khi nó chạy. Chép + dán + tự điền token giữ đúng ranh giới đó.
 */
const MAU_MCP: Array<{ ten: string; moTa: string; json: string }> = [
  {
    ten: 'Figma (token, tài khoản miễn phí)',
    moTa: 'Token: Figma → Settings → Security → Personal access tokens. Dán link frame vào chat là AI đọc được bố cục, màu, chữ.',
    json: `"figma": {
  "command": "npx",
  "args": ["-y", "figma-developer-mcp", "--stdio"],
  "env": { "FIGMA_API_KEY": "figd_..." }
}`,
  },
  {
    ten: 'Figma Dev Mode (app Figma desktop)',
    moTa: 'Mở app Figma → Preferences → Enable Dev Mode MCP Server (cần Dev/Full seat). Có cả ảnh chụp frame.',
    json: `"figma-desktop": {
  "type": "http",
  "url": "http://127.0.0.1:3845/mcp"
}`,
  },
  {
    ten: 'Server qua URL có token',
    moTa: 'Kiểu http (mới) hoặc sse (cũ). ${TEN_BIEN} lấy từ biến môi trường.',
    json: `"ten-server": {
  "type": "http",
  "url": "https://vi-du.com/mcp",
  "headers": { "Authorization": "Bearer \${TOKEN_CUA_BAN}" }
}`,
  },
];

function MauMcp() {
  const [daChep, datDaChep] = useState<number | null>(null);
  const chep = async (i: number) => {
    try {
      await navigator.clipboard.writeText(MAU_MCP[i]!.json);
      datDaChep(i);
      setTimeout(() => datDaChep((x) => (x === i ? null : x)), 1500);
    } catch { /* clipboard bị chặn — người dùng vẫn chọn-chép tay được */ }
  };
  return (
    <details className="ct-mcp-mau">
      <summary>Mẫu cấu hình (Figma…)</summary>
      <p className="ct-mcp-trong">Dán vào trong <code>"servers": {'{ … }'}</code> của <code>mcp.json</code>, điền token, rồi bấm Nạp lại.</p>
      {MAU_MCP.map((m, i) => (
        <div key={m.ten} className="ct-mcp-mau-muc">
          <div className="ct-mcp-dau">
            <strong>{m.ten}</strong>
            <button type="button" className="ct-btn ct-btn-ghost ct-mcp-nho" onClick={() => void chep(i)}>
              {daChep === i ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
              {daChep === i ? 'Đã chép' : 'Chép'}
            </button>
          </div>
          <p className="ct-mcp-trong">{m.moTa}</p>
          <pre className="ct-mcp-args">{m.json}</pre>
        </div>
      ))}
    </details>
  );
}

/**
 * Nút MCP + bảng trạng thái.
 *
 * Chỉ hiện SỐ TOOL trên nút, không hiện danh sách: một người cắm 3 server sẽ có
 * ~20 tool, và đổ hết lên thanh công cụ thì lấp mất mọi thứ khác. Bấm mới mở.
 *
 * Bảng ưu tiên hiện SERVER HỎNG kèm lý do. Một server MCP hỏng thì hỏng câm —
 * agent chỉ đơn giản không có tool đó, không có gì đỏ ở đâu cả, và người dùng
 * ngồi hỏi tại sao nó không chịu dùng công cụ mình vừa cắm.
 */
/** Đợt 6: nút "CT Work — chọn dự án & quyền" trong bảng MCP gọi về AgentMode (nơi có giao diện thẻ lựa chọn CT Work). */
const SU_KIEN_CTW_DU_AN = 'cuongmini:ctwork-du-an';
function NutMcp({ cuocId, khoa }: { cuocId: string; khoa: boolean }) {
  const { dich } = useDich();
  const { mo, bat, boc } = useMoRieng('agent:mcp');
  useMoTuNgoai(cuocId, 'mcp', mo, bat);
  const [tt, datTt] = useState<AgentMcpTrangThai | null>(null);
  const [dangNap, datDangNap] = useState(false);
  const nnMcp: 'vi' | 'en' = (document.documentElement.lang || 'vi').startsWith('en') ? 'en' : 'vi';

  // Hỏi lại MỖI LẦN MỞ BẢNG, không chỉ lúc gắn component.
  //
  // Trạng thái này đổi sau lưng màn hình: một server chết giữa chừng, một tab
  // khác vừa bấm Nạp lại, hạn mức ngày vừa tăng vì agent gọi tool. Chỉ đọc một
  // lần lúc mở app thì bảng kể chuyện của lúc khởi động — và người ta mở đúng
  // cái bảng này KHI nghi có gì đó không ổn, tức là đúng lúc dữ liệu cũ nguy
  // hiểm nhất.
  // `mo` trong danh sách phụ thuộc ⇒ chạy cả lúc gắn (để nút hiện được số tool)
  // lẫn mỗi lần mở bảng.
  useEffect(() => {
    void window.cuongthai?.agent.mcpTrangThai(cuocId).then(datTt).catch(() => {});
  }, [mo, cuocId]);


  const napLai = async () => {
    datDangNap(true);
    try {
      const kq = await window.cuongthai?.agent.mcpNapLai(cuocId);
      if (kq) datTt(kq);
    } finally {
      datDangNap(false);
    }
  };

  const soTool = tt?.soTool ?? 0;
  const soHong = tt?.server.filter((s) => !s.ok).length ?? 0;
  const canDuyet = tt?.server.some((s) => s.canDuyet) ?? false;

  /* Duyệt `.mcp.json` của dự án. Chỉ hiện khi THẬT SỰ có thứ chờ duyệt — một
     nút "Duyệt" đứng sẵn ở đó mọi lúc là thứ người ta bấm cho xong. */
  const duyet = async () => {
    datDangNap(true);
    try {
      const kq = await window.cuongthai?.agent.mcpDuyetDuAn(cuocId);
      if (kq) datTt(kq);
    } finally {
      datDangNap(false);
    }
  };

  return (
    <div className="ct-mcp-boc" ref={boc}>
      <button
        type="button"
        className="ct-agent-icon"
        data-nut="mcp"
        data-canhbao={soHong > 0}
        onClick={bat}
        title={soTool > 0 ? `MCP: ${soTool} tool` : 'MCP — cắm thêm công cụ ngoài'}
      >
        <Plug size={13} aria-hidden />
        {soTool > 0 && <span className="ct-mcp-dem">{soTool}</span>}
      </button>

      {mo && (
        <div className="ct-mcp-bang">
          <div className="ct-mcp-dau">
            <strong>Server MCP</strong>
            <button
              type="button"
              className="ct-btn ct-btn-ghost ct-mcp-nho"
              onClick={() => void napLai()}
              disabled={dangNap || khoa}
              title={khoa ? 'Đang chạy một việc — nạp lại sau khi xong' : 'Tắt hết rồi bật lại theo file cấu hình'}
            >
              {dangNap ? <Loader2 size={12} aria-hidden className="ct-spin" /> : <RotateCcw size={12} aria-hidden />}
              {dich('Nạp lại')}
            </button>
            <button
              type="button"
              className="ct-btn ct-btn-ghost ct-mcp-nho"
              onClick={() => window.dispatchEvent(new CustomEvent(SU_KIEN_CTW_DU_AN, { detail: { cuocId } }))}
              title={dich('Nối CT Work bằng tài khoản đang đăng nhập, chọn dự án (không gian · vai) và quyền đọc/ghi')}
            >
              {dich('CT Work — chọn dự án & quyền')}
            </button>
          </div>

          {tt?.loiCauHinh && (
            /* File hỏng thì app KHÔNG ghi đè nữa — nên phải nói to ở đây, không
               thì người dùng thấy "chưa cắm server nào" và tưởng file bị mất. */
            <p className="ct-mcp-loi" data-cau-hinh>{tt.loiCauHinh}</p>
          )}

          {!tt || tt.server.length === 0 ? (
            <p className="ct-mcp-trong">
              Chưa cắm server nào. Sửa file <code>mcp.json</code> rồi bấm Nạp lại — có sẵn mẫu Figma bên dưới.
            </p>
          ) : (
            <ul className="ct-mcp-ds">
              {tt.server.map((s) => (
                <li key={s.ten} data-ok={s.ok}>
                  <span className="ct-mcp-cham" />
                  <span className="ct-mcp-ten">{s.ten}</span>
                  {s.kieu && s.kieu !== 'stdio' && (
                    <span className="ct-mcp-nhan" title={s.kieu === 'http' ? 'Streamable HTTP' : 'SSE (kiểu cũ)'}>{s.kieu}</span>
                  )}
                  {s.tuDuAn && <span className="ct-mcp-nhan" title={dich('.mcp.json trong dự án')}>{dich('dự án')}</span>}
                  {s.ok && (
                    <span className="ct-mcp-phu" title={s.boBot ? `Bỏ ${s.boBot} tool vì chạm trần tổng 40 tool` : undefined}>
                      {s.soTool} tool{s.soMucLuc ? ` + ${s.soMucLuc} ${dich('nạp khi cần')}` : ''}{s.boBot ? ` · bỏ ${s.boBot}` : ''}
                    </span>
                  )}
                  {/* Lỗi xuống dòng riêng, ĐỌC ĐƯỢC HẾT và chọn-chép được: dòng cuối
                      stderr ("thiếu FIGMA_API_KEY") là thứ duy nhất nói vì sao hỏng,
                      và bản trước cắt nó bằng dấu "…" sau chừng 30 ký tự. */}
                  {!s.ok && !s.tat && !s.ngat && !s.dangNoi && <span className="ct-mcp-loi">{s.loi ?? 'hỏng'}</span>}
                  {(s.ngat || s.dangNoi || s.tat) && <span className="ct-mcp-phu">{trangThaiMcpChu(s, nnMcp)}</span>}
                  {/* Đợt 8A — quản lý từng server (chung ba nơi, `ctworkLenh.ts › hanhDongMcp`): Ngắt (phiên) · Kết nối lại ·
                      Kết nối · Tắt hẳn; CT Work thêm đổi dự án · đổi quyền · bỏ gắn · đăng xuất. */}
                  <span className="ct-mcp-nut">
                    {hanhDongMcp(s, nnMcp).map((h) => (
                      <button
                        key={h.giaTri} type="button" className="ct-btn ct-btn-ghost ct-mcp-battat" disabled={khoa || dangNap}
                        title={h.mo}
                        onClick={() => {
                          if (h.giaTri.startsWith('ctw')) { window.dispatchEvent(new CustomEvent(SU_KIEN_CTW_DU_AN, { detail: { cuocId, giaTri: h.giaTri } })); return; }
                          void window.cuongthai?.agent.mcpServer(cuocId, s.ten, h.giaTri as 'ngat' | 'noiLai' | 'noi' | 'tatHan').then((r) => datTt(r.trangThai)).catch(() => undefined);
                        }}
                      >
                        {h.nhan}
                      </button>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <MauMcp />

          {canDuyet && (
            /* Nói thẳng cái giá trước khi hỏi. `.mcp.json` là một dòng lệnh sẽ
               chạy với env của người dùng — "bạn có muốn bật không?" là câu hỏi
               sai; câu đúng là "bạn có tin repo này chạy lệnh trên máy bạn
               không?". Duyệt khoá theo NỘI DUNG: sửa file là hỏi lại. */
            <div className="ct-mcp-duyet">
              <p>
                <Chu cau="Dự án này khai server MCP trong `.mcp.json`. Bật lên nghĩa là **repo được chạy lệnh trên máy bạn**, với biến môi trường của bạn. Chỉ duyệt nếu bạn tin nguồn của nó." />
              </p>
              <button
                type="button" className="ct-btn ct-btn-ghost ct-mcp-nho"
                onClick={() => void duyet()} disabled={dangNap || khoa}
              >
                <ShieldCheck size={12} aria-hidden />
                {dich('Tôi tin dự án này — bật')}
              </button>
            </div>
          )}

          {tt && (
            <p className="ct-mcp-chan">
              Đã dùng {tt.hanMuc.daDung}/{tt.hanMuc.tran} lượt gọi hôm nay.
              {' '}Mỗi lượt gọi đều cần bạn duyệt.
            </p>
          )}

          <button
            type="button"
            className="ct-btn ct-btn-ghost ct-mcp-nho"
            onClick={() => void window.cuongthai?.agent.mcpMoCauHinh()}
          >
            <FileCode2 size={12} aria-hidden />
            {dich('Mở file cấu hình')}
          </button>

          {/* Đợt 3: CT Work MỘT CHẠM — token tạo bằng phiên đăng nhập, cất trong Keychain/safeStorage,
              mcp.json chỉ chứa `${CTWORK_TOKEN}`. AI không bao giờ thấy token. */}
          <NutCtwork cuocId={cuocId} coServer={Boolean(tt?.server.some((s) => s.ten === 'ctwork' && s.ok))} xong={(k) => k && datTt(k)} />

        </div>
      )}
    </div>
  );
}

/** Nút "Kết nối CT Work" trong bảng MCP (đợt 3). */
function NutCtwork({ cuocId, coServer, xong }: { cuocId: string; coServer: boolean; xong: (k: AgentMcpTrangThai | null | undefined) => void }) {
  const [dang, datDang] = useState(false);
  const [bao, datBao] = useState('');
  const lam = async (viec: 'noi' | 'ngat', quyen?: 'doc' | 'ghi') => {
    datDang(true); datBao('');
    try {
      const r = await window.cuongthai?.agent.ctwork(cuocId, viec, quyen);
      datBao(r?.ok ? (viec === 'ngat' ? 'Đã ngắt CT Work, thu hồi token.' : `✓ ctwork · ${r.soTool ?? 0} tool`) : `⚠ ${r?.loi ?? '?'}`);
      xong(await window.cuongthai?.agent.mcpTrangThai(cuocId));
    } finally { datDang(false); }
  };
  return (
    <div className="ct-mcp-chan" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>CT Work</strong>
      {coServer ? (
        <button type="button" className="ct-btn ct-btn-ghost ct-mcp-nho" disabled={dang} onClick={() => void lam('ngat')}>Ngắt &amp; thu hồi token</button>
      ) : (
        <>
          <button type="button" className="ct-btn ct-mcp-nho" disabled={dang} onClick={() => void lam('noi', 'doc')}>Kết nối (chỉ đọc)</button>
          <button type="button" className="ct-btn ct-btn-ghost ct-mcp-nho" disabled={dang} onClick={() => void lam('noi', 'ghi')}>Kết nối (đọc + ghi)</button>
        </>
      )}
      {bao ? <span>{bao}</span> : null}
    </div>
  );
}

/**
 * Icon riêng cho TỪNG tool.
 *
 * Một icon chung cho mọi tool thì dòng tiến trình chỉ còn phân biệt được bằng
 * cách ĐỌC tên — mà mắt lướt qua mười dòng thì không ai đọc. Hình dạng khác
 * nhau cho phép nhận ra nhịp làm việc (dò → tìm → đọc → sửa → chạy) chỉ bằng
 * liếc, đúng như Claude Code làm.
 */

/**
 * Một dòng tool đã xong — BẤM ĐỂ MỞ RA XEM ĐẦY ĐỦ.
 *
 * ─── Vì sao cần ───
 * Trước bản này dòng tool chỉ có một tóm tắt, và tóm tắt còn bị cắt cụt bởi
 * `text-overflow`. Người dùng thấy `list_dir  demo-se205…` rồi hết. Họ hỏi
 * đúng chỗ đó: "sao mấy cái lệnh nó chạy không hiện đầy đủ cho tôi xem?" —
 * và câu trả lời là dữ liệu chưa từng được gửi lên giao diện.
 *
 * Với tool GHI FILE thì mở ra là DIFF từng dòng. Đây là thứ quan trọng nhất
 * của cả thay đổi này: ở chế độ tự duyệt không có thẻ duyệt nào, nên trước đây
 * "cho nó tự sửa" đồng nghĩa với "không xem được nó sửa gì".
 *
 * MẶC ĐỊNH ĐÓNG. Một việc 40 bước mà mở sẵn hết thì bảng ghi thành mấy nghìn
 * dòng và không ai tìm được câu trả lời của agent ở đâu nữa.
 */
/**
 * Đầu ra tool dạng MÃ — tô màu và có máng số dòng, như trình soạn thảo.
 *
 * ─── Vì sao không để `pre` trơn ───
 * Người dùng chỉ đúng chỗ này: "sao nó không có màu code như VSCode". Với một
 * file 77 dòng thì chữ trắng đều tăm tắp là thứ mắt phải ĐỌC từng dòng mới
 * hiểu, trong khi mã có màu thì liếc là thấy đâu là chuỗi, đâu là từ khoá,
 * đâu là thẻ JSX.
 *
 * ─── `read_file` trả `<số>\t<nội dung>` ───
 * Số dòng nằm ngay trong chữ (xem `toolReadFile`). Để nguyên thì nó trôi
 * trong cùng dòng mã và bị tô màu nhầm thành số của ngôn ngữ. Tách ra máng
 * riêng vừa đúng vừa canh cột được — mã thụt lề mới thẳng hàng.
 *
 * KHÔNG có số dòng (đầu ra `run_command`, `git_status`) thì rơi về `pre` trơn:
 * đầu ra lệnh không phải mã của ngôn ngữ nào, đoán bừa sẽ tô sai lung tung.
 */
function KhoiMa({ chu, duongDan }: { chu: string; duongDan?: string }) {
  const dong = chu.split('\n');
  /* Chỉ coi là "có đánh số" khi ĐA SỐ dòng khớp. Một dòng lẻ bắt đầu bằng số
     rồi tab là chuyện thường trong đầu ra lệnh; đòi mọi dòng khớp thì dòng
     "[… còn 42 dòng nữa]" ở cuối `read_file` cũng làm hỏng cả khối. */
  const tach = dong.map((d) => /^(\d+)\t([\s\S]*)$/.exec(d));
  const soKhop = tach.filter(Boolean).length;
  const coSo = dong.length > 1 && soKhop >= Math.ceil(dong.length * 0.6);

  if (!coSo) return <pre className="ct-agent-tool-chitiet">{chu}</pre>;

  const ngonNgu = ngonNguTuDuong(duongDan ?? '');
  return (
    <div className="ct-ma" data-ngonngu={ngonNgu ?? 'tho'}>
      {dong.map((d, i) => {
        const m = tach[i];
        return (
          <div key={i} className="ct-ma-dong" data-phu={!m}>
            <span className="ct-ma-so">{m ? m[1] : ''}</span>
            <MaDong text={m ? m[2]! : d} ngonNgu={m ? ngonNgu : null} />
          </div>
        );
      })}
    </div>
  );
}

function DongTool({ m }: { m: Extract<MucHienThi, { kieu: 'tool' }> }) {
  const [mo, datMo] = useState(false);
  const coGiDeXem = Boolean(m.diff ?? m.chiTiet ?? m.xemGon);
  /* Đợt 5: tool CT Work ⇒ `CT Work · sprint_current(…)` + tóm tắt một dòng; mở ra là BẢNG GỌN (không JSON thô). */
  const laCtw = m.ten.startsWith('mcp__ctwork__');

  return (
    <div className="ct-agent-tool" data-vong={m.vong} data-ten={m.ten} data-mo={mo}>
      <div
        className="ct-agent-tool-dong"
        {...(coGiDeXem
          ? {
            role: 'button' as const,
            tabIndex: 0,
            onClick: () => datMo((v) => !v),
            /* Bàn phím cũng phải mở được — dòng này là `div`, không phải
               `button`, vì nó nằm trong một hàng có `code` và nhãn riêng. */
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); datMo((v) => !v); }
            },
            title: mo ? 'Thu lại' : 'Bấm để xem đầy đủ',
          }
          : {})}
      >
        <IconTool ten={m.ten} vong={m.vong} />
        <code>{laCtw ? `CT Work · ${m.ten.slice('mcp__ctwork__'.length)}${m.thamSo ? `(${m.thamSo})` : ''}` : m.ten}</code>
        <span className="ct-agent-tool-tomtat" title={m.tomTat}>{m.tomTat}</span>
        {coGiDeXem && (
          <ChevronDown size={12} aria-hidden className="ct-agent-tool-mui" />
        )}
      </div>

      {mo && m.diff && (
        /* `duongDan`, KHÔNG phải `tomTat`. Bản 0.5.95 truyền `tomTat` — mà với
           `edit_file` nó là "+3 −1", không có đuôi file, nên `ngonNguTuDuong`
           trả `null` và diff hiện ra chữ trắng trơn. */
        <KhoiDiff diff={m.diff} duongDan={m.duongDan ?? ''} />
      )}
      {mo && !m.diff && laCtw && m.xemGon && (
        <div className="ct-ctw-gon"><ChuAgent text={m.xemGon} /></div>
      )}
      {mo && !m.diff && !(laCtw && m.xemGon) && m.chiTiet && (
        <KhoiMa chu={m.chiTiet} {...(m.duongDan ? { duongDan: m.duongDan } : {})} />
      )}
    </div>
  );
}

function IconTool({ ten, vong }: { ten: string; vong: 'may' | 'notes' }) {
  const p = { size: 12, 'aria-hidden': true } as const;
  if (vong === 'notes') return <NotebookPen {...p} />;
  switch (ten) {
    case 'list_dir': return <FolderTree {...p} />;
    case 'glob': return <FolderTree {...p} />;
    case 'grep': return <Search {...p} />;
    case 'read_file': return <FileCode2 {...p} />;
    case 'edit_file': return <FilePen {...p} />;
    case 'create_file': return <FilePlus2 {...p} />;
    case 'sua_nhieu_cho': return <FilePen {...p} />;
    case 'xoa_file': return <Trash2 {...p} />;
    case 'doi_ten_file': return <FolderTree {...p} />;
    case 'run_command': return <SquareTerminal {...p} />;
    case 'chay_lenh_nen':
    case 'doc_dau_ra_nen':
    case 'dung_lenh_nen': return <SquareTerminal {...p} />;
    case 'git_status':
    case 'git_diff':
    case 'git_commit':
    case 'tao_pr': return <GitBranch {...p} />;
    /* Nhóm trình duyệt: trước đây rơi hết vào icon `Terminal` chung, nên bảy
       dòng web trông y hệt bảy dòng chạy lệnh. Mỗi việc một hình thì đọc lướt
       một cột icon là biết agent đang làm gì. */
    case 'web_mo':
    case 'doc_web': return <Globe {...p} />;
    case 'tim_web': return <Search {...p} />;
    case 'web_doc': return <FileCode2 {...p} />;
    case 'web_lien_ket': return <Link2 {...p} />;
    case 'xin_quyen_thu_muc': return <FolderOpen {...p} />;
    case 'web_tai': return <Download {...p} />;
    case 'web_tai_nhieu': return <Download {...p} />;
    case 'web_anh': return <Camera {...p} />;
    case 'web_console': return <Bug {...p} />;
    case 'web_bam': return <MousePointerClick {...p} />;
    case 'web_go': return <Keyboard {...p} />;
    default: return ten.endsWith('.md') ? <BookOpen {...p} /> : <Terminal {...p} />;
  }
}

/**
 * Thanh hạn mức.
 *
 * Số VIỆC là con số chính, token nằm trong tooltip. Người dùng hỏi "tôi còn
 * làm được mấy việc nữa", không ai hỏi "tôi còn mấy triệu token".
 */
function ThanhHanMuc({
  quota,
  soViec,
}: {
  quota: { daDung: number; tran: number; phanTram: number; hoiLucNao: string | null };
  soViec: number | null;
}) {
  const trieu = (n: number): string => (n / 1_000_000).toFixed(2);
  const hoi = quota.hoiLucNao
    ? new Date(quota.hoiLucNao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      className="ct-agent-hanmuc"
      title={`Đã dùng ${trieu(quota.daDung)}/${trieu(quota.tran)} triệu token trong 5 giờ qua.${hoi ? ` Hạn mức bắt đầu hồi lại từ khoảng ${hoi}.` : ''}`}
    >
      <div className="ct-agent-hanmuc-thanh">
        <div className="ct-agent-hanmuc-day" style={{ width: `${Math.min(100, quota.phanTram)}%` }} data-cao={quota.phanTram >= 80} />
      </div>
      <span className="ct-agent-hanmuc-chu">
        {soViec !== null ? `còn ~${soViec} việc` : `${quota.phanTram}%`}
      </span>
    </div>
  );
}

function ManHinhTrong({
  coThuMuc, dangChay, duongDan,
}: {
  coThuMuc: boolean;
  dangChay: boolean;
  duongDan: string | null;
}) {
  const { dich } = useDich();
  return (
    <div className="ct-agent-trong">
      <Sparkles size={26} aria-hidden className="ct-empty-icon" />
      <h2>{coThuMuc ? 'Hỏi gì về dự án này?' : 'Chọn thư mục dự án để bắt đầu'}</h2>
      {coThuMuc ? (
        <ul className="ct-agent-goiy">
          <li>{dich('Giải thích cho tôi luồng xác thực trong dự án này.')}</li>
          <li>{dich('Tôi đang sửa dở gì? Tóm tắt các thay đổi chưa commit.')}</li>
          <li>{dich('Hàm xử lý thanh toán nằm ở đâu, và nó gọi những gì?')}</li>
          <li>{dich('Trong ghi chú của tôi có kế hoạch nào cho dự án này không?')}</li>
        </ul>
      ) : (
        <p className="ct-muted">
          {dich('Agent chỉ đọc được thư mục bạn tự chọn — không đọc chỗ nào khác trên máy.')}
        </p>
      )}

      {/* Đặt ở MÀN HÌNH TRỐNG chứ không nhét vào thanh công cụ: đây là việc
          làm MỘT LẦN rồi thôi, và chỗ này là nơi người dùng nhìn khi chưa biết
          bắt đầu từ đâu. 17/10/2026: thay nút OpenCode bằng CuongMini CLI —
          xem NutCuongMiniCli.tsx (NutOpenCode.tsx giữ lại cho key cũ, không hiện). */}
      <NutCuongMiniCli dangChay={dangChay} thuMuc={duongDan} />
    </div>
  );
}

/**
 * Lời mời nâng cấp.
 *
 * Đây là màn hình cho người dùng ĐÃ đăng nhập nhưng chưa có Pro, và máy chủ mới
 * là bên quyết định (403 `PRO_REQUIRED`). Màn hình này chỉ hiển thị — không có
 * cờ cục bộ nào ở đây mở khoá được gì, kể cả khi app bị sửa.
 */
function MoiNangCap() {
  const { dich } = useDich();
  const moWeb = (): void => {
    void window.cuongthai?.app
      .getInfo()
      .then((i) => window.cuongthai?.app.openExternal(`${i.webOrigin}/pro`));
  };

  return (
    <div className="ct-empty">
      <Sparkles size={28} aria-hidden className="ct-empty-icon" />
      <h1>{dich('Chế độ Lập trình dành cho tài khoản Pro')}</h1>
      <p>
        {dich('Agent mở dự án trên máy bạn, đọc mã, tra cứu ghi chú của bạn và trả lời kèm trích dẫn tới đúng dòng. Chế độ Trò chuyện vẫn dùng bình thường.')}
      </p>
      <div className="ct-actions">
        <button type="button" className="ct-btn" onClick={moWeb}>{dich('Xem gói Pro')}</button>
      </div>
    </div>
  );
}
