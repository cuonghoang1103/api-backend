/**
 * Màn hình Cài đặt — bố cục hai cột (04/10/2026).
 *
 * Bản trước là MỘT trang dài: chủ đề, robot, mức dùng AI, AI ngoại tuyến, đồng
 * bộ, cập nhật, giọng Odin, dung lượng… xếp nối đuôi nhau trong một khung, cùng
 * một màu, cùng một cỡ chữ. Người dùng nói thẳng: "đứng chung với nhau, rối,
 * không tìm được cài đặt". Nên:
 *   • cột trái là NHÓM, mỗi nhóm một biểu tượng + một màu riêng để mắt nhận ra;
 *   • cột phải chỉ hiện MỘT nhóm, mỗi mục là một thẻ có tiêu đề + lời giải thích;
 *   • ô tìm lọc theo tên/lời giải thích/từ khoá của TỪNG mục, bấm là nhảy tới.
 *
 * ⚠️ Mọi khoá cài đặt GIỮ NGUYÊN (`theme`, `ngonNgu`, `robotEnabled`,
 * `sidebarMode`, `zoomLevel`, `tqAmThanh`, `nhacLichRobot`, `playerThuGon`) — chỉ
 * đổi chỗ đặt nút, không đổi hành vi. Các khối có sẵn (Mức dùng, AI ngoại tuyến,
 * Đồng bộ, Cập nhật, giọng Odin) được bọc nguyên vào thẻ, không viết lại.
 *
 * Ô dung lượng lấy số từ HAI nguồn khác nhau và nói rõ nguồn nào là nguồn nào:
 * cache HTTP do main đo (`session.getCacheSize()`), còn hạn mức và mức dùng của
 * IndexedDB/localStorage chỉ renderer hỏi được (`navigator.storage.estimate()`).
 * Gộp hai con số thành một "tổng dung lượng" sẽ ra một số không tương ứng với
 * bất cứ thứ gì có thật.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Bell, Bot, BrainCircuit, Database, ExternalLink, Info, Keyboard, LogOut, Monitor, Moon,
  Palette, Search, Sun, Trash2, UserRound, X,
} from 'lucide-react';
import { useAppState } from '../app-state';
import { useSession } from '../auth/session';
import { SyncPanel } from '../components/SyncPanel';
import { UpdatePanel } from '../components/UpdatePanel';
import { OdinPanel } from '../features/odin/OdinPanel';
import { AiNgoaiTuyen } from '../features/settings/AiNgoaiTuyen';
import { MucDung } from '../features/settings/MucDung';
import { datBatAm, keuThu } from '../features/dashboard/amThanh';
import { usePreferencesStore } from '@/store/preferencesStore';
import { docThongBaoOs, ghiThongBaoOs } from '../features/thongBao/ThongBaoHost';
import { DS_TIENG, NHAN_TIENG, docCaiDat, ghiCaiDat, phat, type CaiDatAmThanh } from '@/lib/amThanhUi';
import { INTERNAL_ROUTES } from '../routes';
import type { AppInfo, ThemeSetting } from '../../shared/ipc';
import { useDich, type NgonNgu } from '../i18n';
import '../features/settings/settings.css';

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/** Cùng bậc với nút +/− ở thanh trạng thái — hai chỗ đổi cỡ phải đi cùng một thang. */
const ZOOM_STEPS = [0.8, 0.9, 1, 1.1, 1.25, 1.5] as const;

type MaNhom = 'giao-dien' | 'thong-bao' | 'odin' | 'ai' | 'du-lieu' | 'phim' | 'tai-khoan' | 'cap-nhat';

interface Nhom { ma: MaNhom; ten: string; moTa: string; icon: ReactNode; mau: string }
/** Một mục tìm được: thuộc nhóm nào, neo ở đâu, tìm bằng chữ gì. */
interface MucTim { nhom: MaNhom; neo: string; ten: string; moTa: string; tuKhoa: string }

/** Bỏ dấu để gõ "chu de" ra "Chủ đề". */
function fold(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

export function Settings() {
  const { theme, layThamSo, lanDieuHuong, navigate } = useAppState();
  const { dich, dichP } = useDich();

  const NHOM: Nhom[] = [
    { ma: 'giao-dien', ten: dich('Giao diện'), moTa: dich('Chủ đề, ngôn ngữ, thanh bên, cỡ chữ'), icon: <Palette size={17} aria-hidden />, mau: '#8b9cff' },
    { ma: 'thong-bao', ten: dich('Thông báo & âm thanh'), moTa: dich('Tiếng chuông, lời nhắc, thanh phát nhạc'), icon: <Bell size={17} aria-hidden />, mau: '#e3a44f' },
    { ma: 'odin', ten: dich('Robot Odin'), moTa: dich('Hiện/ẩn robot, giọng đọc, tốc độ'), icon: <Bot size={17} aria-hidden />, mau: '#4fb6a8' },
    { ma: 'ai', ten: 'AI', moTa: dich('Mức dùng, AI chạy trên máy'), icon: <BrainCircuit size={17} aria-hidden />, mau: '#d17bb5' },
    { ma: 'du-lieu', ten: dich('Dữ liệu & đồng bộ'), moTa: dich('Hàng đợi đồng bộ, dung lượng, cache'), icon: <Database size={17} aria-hidden />, mau: '#5aa0e0' },
    { ma: 'phim', ten: dich('Phím tắt'), moTa: dich('Mọi tổ hợp phím của app'), icon: <Keyboard size={17} aria-hidden />, mau: '#93b56f' },
    { ma: 'tai-khoan', ten: dich('Tài khoản'), moTa: dich('Người đang đăng nhập, đăng xuất'), icon: <UserRound size={17} aria-hidden />, mau: '#c98a6b' },
    { ma: 'cap-nhat', ten: dich('Cập nhật & giới thiệu'), moTa: dich('Phiên bản, bản mới, thông tin app'), icon: <Info size={17} aria-hidden />, mau: '#9a8cf0' },
  ];

  /* Chỉ mục tìm kiếm. Mỗi dòng là MỘT thứ người dùng có thể muốn đổi — kể cả
     những thứ nằm trong khối có sẵn (giọng Odin, AI ngoại tuyến…), để gõ
     "giọng" ra đúng chỗ thay vì ra cả nhóm. */
  const MUC_TIM: MucTim[] = [
    { nhom: 'giao-dien', neo: 'chu-de', ten: dich('Chủ đề'), moTa: dich('Sáng, tối hoặc theo hệ thống'), tuKhoa: 'theme dark light sang toi mau nen' },
    { nhom: 'giao-dien', neo: 'ngon-ngu', ten: dich('Ngôn ngữ'), moTa: dich('Tiếng Việt hoặc tiếng Anh'), tuKhoa: 'language english tieng anh viet' },
    { nhom: 'giao-dien', neo: 'thanh-ben', ten: dich('Thanh bên'), moTa: dich('Đầy đủ, chỉ biểu tượng hoặc ẩn'), tuKhoa: 'sidebar menu thu gon an' },
    { nhom: 'giao-dien', neo: 'co-chu', ten: dich('Cỡ hiển thị'), moTa: dich('Phóng to/thu nhỏ toàn bộ app'), tuKhoa: 'zoom co chu phong to thu nho font' },
    { nhom: 'thong-bao', neo: 'tb-am', ten: dich('Âm thanh tin nhắn & thông báo'), moTa: dich('Kêu khi có tin nhắn, thông báo, admin đăng bài'), tuKhoa: 'am thanh tin nhan thong bao admin notification sound' },
    { nhom: 'thong-bao', neo: 'tb-os', ten: dich('Thông báo của hệ điều hành'), moTa: dich('Hiện thông báo góc màn hình khi app đang ở nền'), tuKhoa: 'thong bao he dieu hanh notification desktop popup nen' },
    { nhom: 'thong-bao', neo: 'am-thanh-ui', ten: dich('Âm thanh giao diện'), moTa: dich('Tiếng bấm nút, bật tắt, thông báo, lỗi…'), tuKhoa: 'am thanh sound click nut hieu ung tieng bam am luong volume' },
    { nhom: 'thong-bao', neo: 'am-thanh', ten: dich('Tiếng chuông khi xong việc'), moTa: dich('Kêu “ting” khi tick xong một việc'), tuKhoa: 'am thanh sound chuong tieng' },
    { nhom: 'thong-bao', neo: 'nhac-lich', ten: dich('Robot nhắc lịch học & việc sắp tới'), moTa: dich('Nhắc trước buổi học và việc trong kế hoạch'), tuKhoa: 'nhac nho lich hoc reminder thong bao' },
    { nhom: 'thong-bao', neo: 'thanh-phat', ten: dich('Thanh phát nhạc thu gọn'), moTa: dich('Thanh phát ở đáy app chỉ còn một dải mỏng'), tuKhoa: 'nhac music player thanh phat' },
    { nhom: 'odin', neo: 'robot', ten: dich('Hiện robot Odin'), moTa: dich('Trợ lý ở góc màn hình'), tuKhoa: 'robot odin tro ly an hien' },
    { nhom: 'odin', neo: 'giong-odin', ten: dich('Giọng đọc của Odin'), moTa: dich('Đọc thành tiếng, ngôn ngữ, tốc độ, giọng'), tuKhoa: 'giong noi doc tts voice toc do ngat loi' },
    { nhom: 'ai', neo: 'muc-dung', ten: dich('Mức dùng AI'), moTa: dich('Ví AI Code và AI Chat của bạn'), tuKhoa: 'han muc usage ngan sach quota tien' },
    { nhom: 'ai', neo: 'ai-ngoai-tuyen', ten: dich('AI ngoại tuyến'), moTa: dich('Tải AI về chạy trên máy, dùng khi mất mạng'), tuKhoa: 'offline local model mat mang tren may' },
    { nhom: 'du-lieu', neo: 'dong-bo', ten: dich('Hàng đợi đồng bộ'), moTa: dich('Thay đổi chưa gửi lên máy chủ'), tuKhoa: 'sync dong bo xung dot conflict' },
    { nhom: 'du-lieu', neo: 'dung-luong', ten: dich('Dung lượng & cache'), moTa: dich('Xem và xoá cache ảnh, tệp tĩnh'), tuKhoa: 'cache bo nho storage xoa' },
    { nhom: 'phim', neo: 'phim', ten: dich('Phím tắt'), moTa: dich('Mọi tổ hợp phím của app'), tuKhoa: 'shortcut keyboard ban phim to hop' },
    { nhom: 'tai-khoan', neo: 'tai-khoan', ten: dich('Tài khoản'), moTa: dich('Người đang đăng nhập, đăng xuất'), tuKhoa: 'account dang xuat logout email' },
    { nhom: 'cap-nhat', neo: 'cap-nhat', ten: dich('Cập nhật'), moTa: dich('Kiểm tra và cài bản mới'), tuKhoa: 'update phien ban moi version' },
    { nhom: 'cap-nhat', neo: 'gioi-thieu', ten: dich('Giới thiệu'), moTa: dich('Phiên bản app, Electron, máy chủ API'), tuKhoa: 'about version phien ban electron' },
  ];

  const [nhom, setNhom] = useState<MaNhom>('giao-dien');
  const [tim, setTim] = useState('');
  const [neoSang, setNeoSang] = useState<string | null>(null);
  const than = useRef<HTMLElement>(null);

  /** Mở một nhóm rồi cuộn tới mục `neo` (đợi nó được vẽ — khối nạp dữ liệu thì vẽ muộn). */
  const toi = useCallback((ma: MaNhom, neo?: string) => {
    setNhom(ma);
    setTim('');
    if (!neo) { than.current?.scrollTo({ top: 0 }); return; }
    const batDau = performance.now();
    const thu = () => {
      const el = document.getElementById(`st-${neo}`) ?? document.getElementById(neo);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setNeoSang(neo);
        window.setTimeout(() => setNeoSang((c) => (c === neo ? null : c)), 1800);
      } else if (performance.now() - batDau < 2500) requestAnimationFrame(thu);
    };
    requestAnimationFrame(thu);
  }, []);

  /* Lối vào từ chỗ khác: `muc=ai-ngoai-tuyen` (dải "mất mạng" của AI Code/Chat)
     hoặc `muc=<nhóm>`. ⚠️ `layThamSo` đọc MỘT lần rồi xoá — nên trang này đọc
     thay `AiNgoaiTuyen` và tự cuộn; khối đó chỉ còn thấy tham số khi nó đã sẵn
     trên màn hình lúc điều hướng tới. */
  useEffect(() => {
    const m = layThamSo('muc');
    if (!m) return;
    const muc = MUC_TIM.find((x) => x.neo === m);
    if (muc) toi(muc.nhom, muc.neo);
    else if (NHOM.some((n) => n.ma === m)) toi(m as MaNhom);
    // NHOM/MUC_TIM dựng lại mỗi lần vẽ nhưng nội dung không đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lanDieuHuong, layThamSo, toi]);

  const ketQua = useMemo(() => {
    const q = fold(tim.trim());
    if (!q) return [];
    return MUC_TIM.filter((m) => fold(`${m.ten} ${m.moTa} ${m.tuKhoa}`).includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tim, dich]);

  const hien = NHOM.find((n) => n.ma === nhom) ?? NHOM[0]!;
  const sang = (neo: string) => (neoSang === neo ? 'true' : undefined);

  return (
    /* `.st-boc` là CONTAINER — bố cục theo bề rộng thật của vùng nội dung. */
    <div className="st-boc">
    <div className="st">
      <aside className="st-nav">
        <h1 className="st-tieude">{dich('Cài đặt')}</h1>
        <label className="st-tim">
          <Search size={14} aria-hidden />
          <input
            value={tim}
            onChange={(e) => setTim(e.target.value)}
            placeholder={dich('Tìm cài đặt…')}
            aria-label={dich('Tìm cài đặt')}
          />
          {tim && (
            <button type="button" onClick={() => setTim('')} aria-label={dich('Xoá tìm kiếm')}><X size={13} aria-hidden /></button>
          )}
        </label>
        <nav className="st-ds" aria-label={dich('Nhóm cài đặt')}>
          {NHOM.map((n) => (
            <button
              key={n.ma}
              type="button"
              className="st-nhom"
              data-on={!tim && nhom === n.ma}
              style={{ ['--m' as string]: n.mau }}
              onClick={() => toi(n.ma)}
            >
              <span className="st-o">{n.icon}</span>
              <span className="st-nhom-chu">
                <strong>{n.ten}</strong>
                <small>{n.moTa}</small>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="st-than" ref={than}>
        {tim.trim() ? (
          <section className="st-kq">
            <h2 className="st-kq-dau">{dichP('{n} kết quả cho “{q}”', { n: ketQua.length, q: tim.trim() })}</h2>
            {ketQua.length === 0 && <p className="st-giai">{dich('Không có cài đặt nào khớp. Thử từ khác, ví dụ “giọng”, “tối”, “cache”.')}</p>}
            {ketQua.map((m) => {
              const n = NHOM.find((x) => x.ma === m.nhom)!;
              return (
                <button key={m.neo} type="button" className="st-kq-dong" style={{ ['--m' as string]: n.mau }} onClick={() => toi(m.nhom, m.neo)}>
                  <span className="st-o">{n.icon}</span>
                  <span className="st-nhom-chu">
                    <strong>{m.ten}</strong>
                    <small>{n.ten} · {m.moTa}</small>
                  </span>
                </button>
              );
            })}
          </section>
        ) : (
          <div className="st-trang" style={{ ['--m' as string]: hien.mau }} key={hien.ma}>
            <header className="st-dau">
              <span className="st-o st-o-lon">{hien.icon}</span>
              <div>
                <h2>{hien.ten}</h2>
                <p>{hien.moTa}</p>
              </div>
            </header>

            {nhom === 'giao-dien' && <NhomGiaoDien theme={theme} sang={sang} />}
            {nhom === 'thong-bao' && <NhomThongBao sang={sang} />}
            {nhom === 'odin' && (
              <>
                <TheRobot sang={sang} />
                <The id="giong-odin" sang={sang('giong-odin')} ten={dich('Giọng đọc của Odin')} moTa={dich('Odin đọc câu trả lời thành tiếng — chọn ngôn ngữ, giọng và tốc độ.')} boc>
                  <OdinPanel />
                </The>
              </>
            )}
            {nhom === 'ai' && (
              <>
                <The id="muc-dung" sang={sang('muc-dung')} ten={dich('Mức dùng AI')} moTa={dich('Ví riêng của bạn cho AI Code và AI Chat — đã tiêu bao nhiêu, bao giờ hồi.')} boc>
                  <MucDung />
                </The>
                <The id="ai-ngoai-tuyen" sang={sang('ai-ngoai-tuyen')} ten={dich('AI ngoại tuyến')} moTa={dich('Tải AI về chạy thẳng trên máy — vẫn hỏi được khi mất mạng.')} boc>
                  <AiNgoaiTuyen />
                </The>
              </>
            )}
            {nhom === 'du-lieu' && (
              <>
                <The id="dong-bo" sang={sang('dong-bo')} ten={dich('Hàng đợi đồng bộ')} moTa={dich('Những thay đổi làm lúc mất mạng, đang chờ gửi lên máy chủ.')} boc>
                  <SyncPanel />
                </The>
                <TheDungLuong sang={sang('dung-luong')} />
              </>
            )}
            {nhom === 'phim' && <ThePhimTat sang={sang('phim')} />}
            {nhom === 'tai-khoan' && <TheTaiKhoan sang={sang('tai-khoan')} />}
            {nhom === 'cap-nhat' && (
              <>
                <The id="cap-nhat" sang={sang('cap-nhat')} ten={dich('Cập nhật')} moTa={dich('App tự tải bản mới ở nền; bấm cài khi bạn sẵn sàng.')} boc>
                  <UpdatePanel />
                </The>
                <TheGioiThieu sang={sang('gioi-thieu')} onMo={() => navigate(INTERNAL_ROUTES.about)} />
              </>
            )}
          </div>
        )}
      </main>
    </div>
    </div>
  );
}

function NhomGiaoDien({ theme: chuDe, sang: s }: { theme: ThemeSetting; sang: (n: string) => string | undefined }) {
  const { settings, setSetting } = useAppState();
  const { dich } = useDich();
  const ngonNgu: NgonNgu = settings.ngonNgu === 'en' ? 'en' : 'vi';
  const cheDoBen = settings.sidebarMode === 'icons' || settings.sidebarMode === 'hidden' ? settings.sidebarMode : 'full';
  const zoom = typeof settings.zoomLevel === 'number' ? settings.zoomLevel : 1;
  const CHU_DE: { value: ThemeSetting; label: string; icon: ReactNode }[] = [
    { value: 'light', label: dich('Sáng'), icon: <Sun size={14} aria-hidden /> },
    { value: 'dark', label: dich('Tối'), icon: <Moon size={14} aria-hidden /> },
    { value: 'system', label: dich('Theo hệ thống'), icon: <Monitor size={14} aria-hidden /> },
  ];
  return (
    <>
      <The id="chu-de" sang={s('chu-de')} ten={dich('Chủ đề')} moTa={dich('“Theo hệ thống” sẽ đổi theo cài đặt sáng/tối của máy.')}>
        <div className="st-chude" role="radiogroup" aria-label={dich('Chủ đề')}>
          {CHU_DE.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={chuDe === o.value}
              data-on={chuDe === o.value}
              className="st-chude-o"
              onClick={() => setSetting('theme', o.value)}
            >
              <span className="st-xem" data-kieu={o.value} aria-hidden><i /><i /><i /></span>
              <span className="st-chude-ten">{o.icon}{o.label}</span>
            </button>
          ))}
        </div>
      </The>

      {/* ĐỔI NGÔN NGỮ. Đặt ngay dưới Chủ đề vì nó cùng nhóm "vẻ ngoài của
          app", và đó là chỗ người ta tìm đầu tiên. */}
      <The id="ngon-ngu" sang={s('ngon-ngu')} ten={dich('Ngôn ngữ')} moTa={dich('Chữ trong app đổi ngay, không cần khởi động lại. Nội dung tải từ web (bài học, bài viết, tin nhắn) giữ nguyên ngôn ngữ gốc.')}>
        <Doan
          nhan={dich('Ngôn ngữ')}
          gia={ngonNgu}
          ds={[{ v: 'vi', t: dich('Tiếng Việt') }, { v: 'en', t: dich('Tiếng Anh') }]}
          onChon={(v) => setSetting('ngonNgu', v)}
        />
      </The>

      <The id="thanh-ben" sang={s('thanh-ben')} ten={dich('Thanh bên')} moTa={dich('Cũng đổi được bằng ⌘B (ẩn/hiện) hoặc nút “Thu gọn” cuối thanh bên.')}>
        <Doan
          nhan={dich('Thanh bên')}
          gia={cheDoBen}
          ds={[{ v: 'full', t: dich('Đầy đủ') }, { v: 'icons', t: dich('Chỉ biểu tượng') }, { v: 'hidden', t: dich('Ẩn') }]}
          onChon={(v) => setSetting('sidebarMode', v)}
        />
      </The>

      <The id="co-chu" sang={s('co-chu')} ten={dich('Cỡ hiển thị')} moTa={dich('Phóng to hoặc thu nhỏ cả app — cùng thang với nút +/− ở thanh trạng thái.')}>
        <Doan
          nhan={dich('Cỡ hiển thị')}
          gia={String(ZOOM_STEPS.reduce((a, b) => (Math.abs(b - zoom) < Math.abs(a - zoom) ? b : a)))}
          ds={ZOOM_STEPS.map((z) => ({ v: String(z), t: `${Math.round(z * 100)}%` }))}
          onChon={(v) => {
            const z = Number(v);
            void window.cuongthai?.app.setZoom(z);
            setSetting('zoomLevel', z);
          }}
        />
      </The>
    </>
  );
}

function NhomThongBao({ sang: s }: { sang: (n: string) => string | undefined }) {
  const { settings, setSetting } = useAppState();
  const { dich } = useDich();
  const coTieng = settings.tqAmThanh !== false;
  const nhacLich = settings.nhacLichRobot !== false;
  const thuGon = settings.playerThuGon === true;
  return (
    <>
      <ThongBaoChung sang={s} />
      <AmThanhUi sang={s('am-thanh-ui')} />
      <The id="am-thanh" sang={s('am-thanh')} ten={dich('Tiếng chuông khi xong việc')} moTa={dich('Một tiếng “ting” ngắn khi bạn tick xong một việc ở Tổng quan. Bật lên là kêu thử ngay.')}>
        <CongTac
          bat={coTieng}
          nhan={dich('Tiếng chuông khi xong việc')}
          onDoi={(v) => {
            setSetting('tqAmThanh', v);
            datBatAm(v);
            if (v) keuThu();
          }}
        />
      </The>
      <The id="nhac-lich" sang={s('nhac-lich')} ten={dich('Robot nhắc lịch học & việc sắp tới')} moTa={dich('Odin nhắc còn bao lâu tới buổi học sớm nhất và việc sắp tới trong kế hoạch. Tắt ở đây hay trên khối Lịch học là một.')}>
        <CongTac bat={nhacLich} nhan={dich('Robot nhắc lịch học & việc sắp tới')} onDoi={(v) => setSetting('nhacLichRobot', v)} />
      </The>
      <The id="thanh-phat" sang={s('thanh-phat')} ten={dich('Thanh phát nhạc thu gọn')} moTa={dich('Khi đang nghe nhạc, thanh phát ở đáy app chỉ còn một dải mỏng có nút phát và tên bài.')}>
        <CongTac bat={thuGon} nhan={dich('Thanh phát nhạc thu gọn')} onDoi={(v) => setSetting('playerThuGon', v)} />
      </The>
    </>
  );
}

/** Tin nhắn / thông báo / admin (04/10/2026) — xem features/thongBao/ThongBaoHost. */
function ThongBaoChung({ sang: s }: { sang: (n: string) => string | undefined }) {
  const { dich } = useDich();
  const coAm = usePreferencesStore((st) => st.masterEnabled);
  const datAm = usePreferencesStore((st) => st.setMasterEnabled);
  const [os, datOs] = useState(() => docThongBaoOs());
  return (
    <>
      <The id="tb-am" sang={s('tb-am')} ten={dich('Âm thanh tin nhắn & thông báo')}
        moTa={dich('Tiếng riêng khi có tin nhắn mới, thông báo mới hay admin đăng bài. Dùng chung cài đặt với web.')}>
        <CongTac bat={coAm} nhan={dich('Âm thanh tin nhắn & thông báo')} onDoi={(v) => datAm(v)} />
      </The>
      <The id="tb-os" sang={s('tb-os')} ten={dich('Thông báo của hệ điều hành')}
        moTa={dich('Khi app đang ở nền, hiện thông báo ở góc màn hình; bấm vào là mở đúng tin nhắn hoặc trang Thông báo.')}>
        <CongTac bat={os} nhan={dich('Thông báo của hệ điều hành')} onDoi={(v) => {
          ghiThongBaoOs(v); datOs(v);
          if (v && typeof Notification !== 'undefined' && Notification.permission === 'default') void Notification.requestPermission();
        }} />
      </The>
    </>
  );
}

/**
 * Âm thanh giao diện (04/10/2026) — bộ phát dùng chung với web
 * (`frontend/src/lib/amThanhUi.ts`), tiếng Kenney CC0. Cài đặt lưu ở máy
 * (localStorage) như trên web. Nút "Nghe" gắn `data-im` để không kêu kèm tiếng bấm.
 */
function AmThanhUi({ sang }: { sang: string | undefined }) {
  const { dich } = useDich();
  const [cd, datCd] = useState<CaiDatAmThanh>(() => docCaiDat());
  const doi = (moi: Partial<CaiDatAmThanh>) => datCd(ghiCaiDat(moi));
  return (
    <The id="am-thanh-ui" sang={sang} boc ten={dich('Âm thanh giao diện')}
      moTa={dich('Tiếng nhỏ khi bấm nút, bật tắt, mở hộp thoại, lưu xong hay gặp lỗi — trong toàn bộ app.')}>
      <div className="st-am">
        <div className="st-am-hang">
          <span>{dich('Bật âm thanh giao diện')}</span>
          <CongTac bat={cd.bat} nhan={dich('Bật âm thanh giao diện')} onDoi={(v) => { doi({ bat: v }); if (v) phat('bat', { boQuaTat: true }); }} />
        </div>
        <div className="st-am-hang">
          <span>{dich('Tiếng mỗi lần bấm nút')}</span>
          <CongTac bat={cd.bamNut} nhan={dich('Tiếng mỗi lần bấm nút')} onDoi={(v) => doi({ bamNut: v })} />
        </div>
        <label className="st-am-hang">
          <span>{dich('Âm lượng')} · {Math.round(cd.amLuong * 100)}%</span>
          <input type="range" min={0} max={100} step={5} value={Math.round(cd.amLuong * 100)} data-im
            onChange={(e) => doi({ amLuong: Number(e.target.value) / 100 })}
            onPointerUp={() => phat('xong', { boQuaTat: true })} aria-label={dich('Âm lượng')} />
        </label>
        <div className="st-am-luoi">
          {DS_TIENG.map((t) => (
            <button key={t} type="button" className="st-am-thu" data-im onClick={() => phat(t, { boQuaTat: true })}>
              ▶ {dich(NHAN_TIENG[t])}
            </button>
          ))}
        </div>
      </div>
    </The>
  );
}

/** Một thẻ cài đặt: tiêu đề + lời giải thích ở trái, nút điều khiển ở phải.
    `boc` = bọc nguyên một khối có sẵn (nó tự dựng phần thân của mình). */
function The({ id, ten, moTa, children, boc = false, sang }: {
  id: string; ten: string; moTa: string; children: ReactNode; boc?: boolean; sang?: string | undefined;
}) {
  return (
    <section className="st-the" id={`st-${id}`} data-sang={sang} data-boc={boc}>
      <div className="st-the-dau">
        <div className="st-the-chu">
          <h3>{ten}</h3>
          <p>{moTa}</p>
        </div>
        {!boc && <div className="st-the-nut">{children}</div>}
      </div>
      {boc && <div className="st-the-boc">{children}</div>}
    </section>
  );
}

function Doan<T extends string>({ nhan, gia, ds, onChon }: {
  nhan: string; gia: T; ds: { v: T; t: string }[]; onChon: (v: T) => void;
}) {
  return (
    <div className="st-doan" role="radiogroup" aria-label={nhan}>
      {ds.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={gia === o.v} data-on={gia === o.v} onClick={() => onChon(o.v)}>
          {o.t}
        </button>
      ))}
    </div>
  );
}

function CongTac({ bat, nhan, onDoi }: { bat: boolean; nhan: string; onDoi: (v: boolean) => void }) {
  return (
    <label className="ct-switch st-switch">
      <input type="checkbox" checked={bat} onChange={(e) => onDoi(e.target.checked)} aria-label={nhan} />
      <span />
    </label>
  );
}

function TheRobot({ sang }: { sang: (n: string) => string | undefined }) {
  const { settings, setSetting } = useAppState();
  const { dich, dichP } = useDich();
  const robotEnabled = settings.robotEnabled !== false;
  /**
   * Phím tắt THẬT SỰ đang giữ được, hỏi main chứ không viết cứng ở đây.
   * `globalShortcut.register()` trả `false` khi một app khác đã chiếm phím, và
   * nó KHÔNG ném lỗi — nên phím đầu danh sách chưa chắc là phím đang chạy.
   * Xem `main/phimRobot.ts`.
   */
  const [phimTat, datPhimTat] = useState<string | null>(null);
  useEffect(() => { void window.cuongthai?.robot.phimTat().then(datPhimTat); }, []);
  return (
    <section className="st-the" id="st-robot" data-sang={sang('robot')}>
      <div className="st-the-dau">
        <div className="st-the-chu">
          <h3>{dich('Trợ lý Odin')}</h3>
          <p>{dich('Hiển thị bảng trợ lý ở cạnh phải. Tắt đi thì app vẫn dùng bình thường.')}</p>
        </div>
        <div className="st-the-nut">
          <CongTac bat={robotEnabled} nhan={dich('Trợ lý Odin')} onDoi={(v) => setSetting('robotEnabled', v)} />
        </div>
      </div>
      {/* Công tắc này có BA lối khác ngoài chính nó, và người dùng không đoán ra
          lối nào — nên phải kể ở đây. Quan trọng nhất là dòng phím tắt: bốn cú
          bấm chỉ ẨN được, còn muốn robot quay lại mà không có phím tắt thì chỉ
          còn đường lần vào đúng trang này. */}
      <ul className="st-meo">
        <li>{dich('Bấm 4 lần vào robot: ẩn nhanh, không cần vào đây.')}</li>
        <li>
          {phimTat
            ? dichP('Phím tắt ẩn/hiện (chạy cả khi đang ở app khác): {phim}', { phim: phimTat })
            : dich('Phím tắt ẩn/hiện: không giữ được — một app khác đang chiếm cả ba tổ hợp dự phòng.')}
        </li>
        <li>{dich('Bấm 3 lần vào robot: bật/tắt chế độ kéo và đổi cỡ.')}</li>
        <li>{dich('Chuột phải vào robot: menu đầy đủ (cỡ, ghim mép, tắt).')}</li>
      </ul>
    </section>
  );
}

function TheDungLuong({ sang }: { sang?: string | undefined }) {
  const { dich } = useDich();
  const [httpCache, setHttpCache] = useState<number | null>(null);
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null);
  const [clearing, setClearing] = useState(false);

  const refreshStorage = useCallback(async () => {
    const [cache, quota] = await Promise.all([
      window.cuongthai?.storage.usage() ?? Promise.resolve(null),
      navigator.storage?.estimate?.() ?? Promise.resolve(null),
    ]);
    if (cache) setHttpCache(cache.usage);
    if (quota) setEstimate(quota);
  }, []);
  useEffect(() => { void refreshStorage(); }, [refreshStorage]);

  const clearCache = async () => {
    setClearing(true);
    try {
      await window.cuongthai?.storage.clearCache();
      await refreshStorage();
    } finally {
      setClearing(false);
    }
  };
  const phanTram = estimate?.usage !== undefined && estimate.quota ? Math.min(100, (estimate.usage / estimate.quota) * 100) : 0;

  return (
    <section className="st-the" id="st-dung-luong" data-sang={sang}>
      <div className="st-the-dau">
        <div className="st-the-chu">
          <h3>{dich('Dung lượng')}</h3>
          {/* Câu này có <strong> ở GIỮA. Dịch TRỌN câu, rồi tô đậm bằng cách
              tách theo dấu ** — cùng một cách ở cả hai thứ tiếng. */}
          <p>
            {dich('Chỉ xoá ảnh và tệp tĩnh đã tải. **Không** đụng tới nháp hay dữ liệu ngoại tuyến của bạn.')
              .split('**')
              .map((m, i) => (i % 2 ? <strong key={i}>{m}</strong> : <span key={i}>{m}</span>))}
          </p>
        </div>
        <div className="st-the-nut">
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void clearCache()} disabled={clearing}>
            <Trash2 size={14} aria-hidden />
            {clearing ? dich('Đang xoá…') : dich('Xoá cache HTTP')}
          </button>
        </div>
      </div>
      <div className="st-so">
        <div className="st-so-o">
          <small>{dich('Cache HTTP (ảnh, tệp tĩnh)')}</small>
          <strong>{httpCache === null ? '…' : formatBytes(httpCache)}</strong>
        </div>
        <div className="st-so-o">
          <small>{dich('Dữ liệu ứng dụng đã dùng')}</small>
          <strong>{estimate?.usage === undefined ? '…' : formatBytes(estimate.usage)}</strong>
        </div>
        <div className="st-so-o">
          <small>{dich('Hạn mức trình duyệt cấp')}</small>
          <strong>{estimate?.quota === undefined ? '…' : formatBytes(estimate.quota)}</strong>
        </div>
      </div>
      <div className="st-vach" aria-hidden><div style={{ width: `${phanTram}%` }} /></div>
    </section>
  );
}

function ThePhimTat({ sang }: { sang?: string | undefined }) {
  const { dich } = useDich();
  const [phimRobot, datPhimRobot] = useState<string | null>(null);
  useEffect(() => { void window.cuongthai?.robot.phimTat().then(datPhimRobot); }, []);
  const NHOM_PHIM: { ten: string; ds: [string, string][] }[] = [
    {
      ten: dich('Toàn app'),
      ds: [
        ['⌘ K', dich('Mở bảng lệnh — tìm trang, chạy lệnh')],
        ['⌘ B', dich('Ẩn / hiện thanh bên')],
        ['⌥ ⇧ N', dich('Ghi nhanh vào Ghi chú')],
        [phimRobot ?? '—', dich('Ẩn / hiện robot Odin (chạy cả khi đang ở app khác)')],
        ['⏯ ⏭ ⏮', dich('Phím media trên bàn phím/tai nghe: phát, bài sau, bài trước')],
      ],
    },
    {
      ten: dich('Trang Nhạc'),
      ds: [
        ['Space', dich('Phát / tạm dừng')],
        ['← →', dich('Tua 5 giây')],
        ['N / P', dich('Bài sau / bài trước')],
        ['L', dich('Thích bài đang phát')],
        ['F', dich('Chế độ thư giãn')],
        ['?', dich('Xem đủ phím tắt của trang Nhạc')],
      ],
    },
    {
      ten: 'CT Work',
      ds: [
        ['⌘ K', dich('Bảng lệnh riêng của CT Work')],
        ['⌘ J', dich('Hỏi AI về dự án đang mở')],
      ],
    },
  ];
  return (
    <section className="st-the" id="st-phim" data-sang={sang} data-boc="true">
      <div className="st-the-dau">
        <div className="st-the-chu">
          <h3>{dich('Phím tắt')}</h3>
          <p>{dich('Trên Windows/Linux, ⌘ là Ctrl và ⌥ là Alt.')}</p>
        </div>
      </div>
      <div className="st-phim">
        {NHOM_PHIM.map((n) => (
          <div key={n.ten} className="st-phim-nhom">
            <h4>{n.ten}</h4>
            <dl>
              {n.ds.map(([k, v]) => (
                <div key={v}><dt><kbd>{k}</kbd></dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function TheTaiKhoan({ sang }: { sang?: string | undefined }) {
  const { dich, dichP } = useDich();
  const { user, logout, unsyncedCount } = useSession();
  const [dang, setDang] = useState(false);
  const [choGui, setChoGui] = useState(0);
  useEffect(() => { void unsyncedCount().then(setChoGui).catch(() => undefined); }, [unsyncedCount]);
  if (!user) return null;
  const ten = user.fullName || user.username;
  /* Cùng luật với menu tài khoản ở thanh bên: còn thay đổi chưa gửi thì hỏi
     trước, vì đăng xuất là BỎ chúng — không có đường lấy lại. */
  const dangXuat = async () => {
    const n = await unsyncedCount().catch(() => 0);
    const hoi = n > 0
      ? dichP('Còn {n} thay đổi chưa gửi lên máy chủ. Đăng xuất bây giờ sẽ BỎ chúng. Tiếp tục?', { n })
      : dich('Đăng xuất khỏi app?');
    if (!window.confirm(hoi)) return;
    setDang(true);
    try { await logout({ discardUnsynced: n > 0 }); } finally { setDang(false); }
  };
  return (
    <section className="st-the" id="st-tai-khoan" data-sang={sang}>
      <div className="st-the-dau">
        <div className="st-tk">
          {user.avatarUrl
            ? <img src={user.avatarUrl} alt="" className="st-tk-anh" />
            : <span className="st-tk-anh st-tk-chu">{ten.slice(0, 1).toUpperCase()}</span>}
          <div className="st-the-chu">
            <h3>{ten}</h3>
            <p>{user.email} · @{user.username}</p>
            <div className="st-tk-vai">
              {(user.roles ?? []).map((r) => <span key={r}>{r.replace(/^ROLE_/, '')}</span>)}
            </div>
          </div>
        </div>
        <div className="st-the-nut">
          <button type="button" className="ct-btn ct-btn-ghost st-nguy" onClick={() => void dangXuat()} disabled={dang}>
            <LogOut size={14} aria-hidden /> {dang ? dich('Đang đăng xuất…') : dich('Đăng xuất')}
          </button>
        </div>
      </div>
      {choGui > 0 && (
        <p className="st-giai">{dichP('Có {n} thay đổi đang chờ đồng bộ — xem ở nhóm Dữ liệu & đồng bộ.', { n: choGui })}</p>
      )}
    </section>
  );
}

function TheGioiThieu({ sang, onMo }: { sang?: string | undefined; onMo: () => void }) {
  const { dich } = useDich();
  const [info, setInfo] = useState<AppInfo | null>(null);
  useEffect(() => { void window.cuongthai?.app.getInfo().then(setInfo); }, []);
  return (
    <section className="st-the" id="st-gioi-thieu" data-sang={sang}>
      <div className="st-the-dau">
        <div className="st-the-chu">
          <h3>CuongThai Desktop</h3>
          <p>{dich('Ứng dụng desktop cho cuongthai.com — nền tảng CuongHoangDev.')}</p>
        </div>
        <div className="st-the-nut">
          <button type="button" className="ct-btn ct-btn-ghost" onClick={onMo}>
            <ExternalLink size={14} aria-hidden /> {dich('Chi tiết')}
          </button>
        </div>
      </div>
      <div className="st-so">
        <div className="st-so-o"><small>{dich('Phiên bản')}</small><strong>{info?.version ?? '…'}</strong></div>
        <div className="st-so-o"><small>Electron</small><strong>{info?.electronVersion ?? '…'}</strong></div>
        <div className="st-so-o"><small>{dich('Nền tảng')}</small><strong>{info ? `${info.platform} · ${info.arch}` : '…'}</strong></div>
      </div>
    </section>
  );
}
