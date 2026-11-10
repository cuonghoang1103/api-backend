/**
 * Chế độ Trò chuyện — chat thường, chảy chữ theo thời gian thực.
 *
 * Gọi `POST /api/v1/ai/chat` (SSE) bằng `fetch` thẳng chứ không qua
 * `api.request()`: `request()` đọc trọn thân rồi `JSON.parse`, tức là nó sẽ
 * ngồi chờ tới khi máy chủ đóng kết nối — đúng thứ mà stream sinh ra để tránh.
 *
 * ─── ĐÍNH KÈM: MÁY CHỦ VỐN ĐÃ LÀM ĐƯỢC TỪ TRƯỚC ───
 * `/ai/chat` nhận `images` + `documents` từ lâu (4 ảnh ≤4MB, 3 tài liệu ≤6MB:
 * PDF/Word/txt/md/csv), tự rút chữ khỏi PDF ở backend và tự ép lượt có ảnh lên
 * model nhìn được thật. Bản desktop chỉ đơn giản là chưa gửi. Nên phần việc ở
 * đây là NỐI DÂY cho đúng, không phải dựng tính năng mới.
 *
 * ⛔ KHÔNG CÓ "TẠO ẢNH", và đó không phải thiếu sót.
 * Cổng có liệt kê `gpt-image-2` / `gpt-image-1.5` trong `GET /v1/models`, nhưng
 * gọi thật (17/08/2026) trả **HTTP 403 "Image generation is not enabled for
 * this group"** — cả hai model, chặn ở cấp nhóm khoá. Dựng nút cho nó là dựng
 * một nút chết. Mở kênh sinh ảnh trong Console của cổng thì mới làm được.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, BookOpen, Check, ChevronDown, Code2, Coffee, FolderKanban, GraduationCap, Menu, PenLine, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppState } from '../../app-state';
import { docThanhTieng, ngungNoi, phatTieng } from '../odin/giongNoi';
import { catCauDau } from '../odin/hoiOdin';
import { ManGoi } from './ManGoi';
import { DangNghi } from './DangNghi';
import { useSession } from '../../auth/session';
import { ChuAgent } from './markdown';
import { DinhKemDaGui, useDinhKem, type TepDinhKem } from './DinhKem';
import { anhKemLai, type LuotChat } from '../../../shared/nguCanhChat';
import type { AiCucBoTinhTrang } from '../../../shared/ipc';
import { useDanKhapNoi } from './DinhKemCode';
import { ChupManHinh } from './ChupManHinh';
/* Kiểu `PhienChat`/`ThuMuc` sống ở `ThanhBenChat` chứ không ở đây: thanh bên
   là chỗ vẽ chúng ra, và hai bản khai trùng nhau thì thêm một trường ở máy chủ
   là phải nhớ sửa hai chỗ — đúng kiểu trôi dạt đã làm vỡ seed hồi 08/08. */
import { ThanhBenChat, type PhienChat, type ThuMuc } from './ThanhBenChat';
import {
  HopTim, TrangArtifacts, TrangDuAn, TrangLichSu, TrangMotDuAn, TrangTacVu, TrangTuyChinh, moWeb, type CtdView,
} from './CtdTrang';
import { thanTuyChinh, useTuyChinh } from './ctdTuyChinh';
import { KY_NANG } from './ctdDanhMuc';
import { useDich } from '../../i18n';
import { DaiNgoaiTuyen, NhanMay, useGiaoDienNgoaiTuyen } from './NgoaiTuyen';
/* Giao diện kiểu Claude (09/11/2026) — mọi style mới nằm trong `chatClaude.css`,
   gói dưới `.ctc-root`; `styles.css` chung (AgentMode dùng) không bị đụng. */
// Chữ có chân CÓ tiếng Việt cho câu trả lời + wordmark (xem --ctc-serif, 10/11/2026).
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import './chatClaude.css';
import { CtcSoan } from './CtcSoan';
import { CtcDau } from './CtcDau';
import { HanhDongMay, HanhDongNguoi } from './CtcHanhDong';
import { MODEL_MAC_DINH, modelHopLe, tenModel, type MaModel } from './CtcChonModel';
import { useCtcChu } from './CtcChu';

/** Một trang web đã dùng để trả lời. */
export interface Nguon {
  tieuDe: string;
  url: string;
  mien: string;
}

interface Luot {
  vai: 'user' | 'assistant';
  text: string;
  /**
   * Lúc gửi. Chỉ có ở lượt gõ trong phiên này — mở lại cuộc cũ thì máy chủ
   * KHÔNG trả `createdAt` theo từng tin (`getChatHistory` trả cả bảng, nhưng
   * app chỉ đọc `role`/`content`). Thà không hiện gì còn hơn hiện giờ sai.
   */
  luc?: number;
  /** Đính kèm của lượt này — giữ lại để bảng ghi còn thấy đã gửi gì. */
  tep?: TepDinhKem[];
  /** Nguồn web đã dùng cho lượt trả lời này. Gắn vào LƯỢT chứ không vào màn
      hình — cuộn lên xem câu cũ vẫn phải thấy nó đã dựa vào đâu. */
  nguon?: Nguon[];
  /** Tên model TRÊN MÁY đã viết câu này (lưới đỡ lúc mất mạng) — ranh giới 2. */
  cucBo?: string;
}

/**
 * Thẻ NGUỒN dưới câu trả lời.
 *
 * ⚠️ Đánh số khớp với `[1]`, `[2]` trong câu trả lời. Model được dặn ghi số
 * ngay sau câu nó dùng nguồn đó; không đánh số ở đây thì người đọc thấy
 * `[2]` mà không biết `[2]` là trang nào — tệ hơn là không có gì.
 *
 * ⚠️ Favicon lấy TỪ CHÍNH TRANG ĐÓ (`https://<miền>/favicon.ico`), KHÔNG
 * qua dịch vụ favicon của Google. Dùng Google thì mỗi lần hiện thẻ nguồn là
 * một lần báo cho họ biết trợ lý của người dùng đang trích trang nào — đi
 * ngược đúng lý do web này tự dựng máy tìm kiếm thay vì mua API.
 *
 * Đổi lại: nhiều trang không có `/favicon.ico` ở gốc nên ảnh hỏng. Hỏng thì
 * ẨN chứ không hiện ô vỡ — một hàng thẻ ba ô ảnh vỡ trông như giao diện
 * hỏng, còn thiếu ảnh thì thẻ vẫn đọc được bằng số, tiêu đề và tên miền.
 */
function TheNguon({ nguon }: { nguon: Nguon[] }) {
  const { dich } = useDich();
  return (
    <div className="ct-nguon">
      <p className="ct-nguon-nhan">{dich('Nguồn')}</p>
      <ul>
        {nguon.map((n, i) => (
          <li key={n.url + i}>
            <button
              type="button"
              onClick={() => void window.cuongthai?.app.openExternal(n.url)}
              title={n.url}
            >
              <span className="ct-nguon-so">{i + 1}</span>
              <img
                src={`https://${n.mien}/favicon.ico`}
                alt=""
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="ct-nguon-chu">
                <strong>{n.tieuDe}</strong>
                <em>{n.mien}</em>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Số lượt cũ gửi kèm làm ngữ cảnh. Đủ để nhớ mạch, không đủ để phình hoá đơn. */
const SO_LUOT_NGU_CANH = 10;

/**
 * Model đã chọn được NHỚ qua lần mở app (như Claude). Bốn bậc + nhãn nằm ở
 * `CtcChonModel.tsx` — ⛔ không bao giờ hiện tên model thật.
 */
const KHOA_MODEL = 'ctc:model';
function docModelDaLuu(): string | null {
  try { return localStorage.getItem(KHOA_MODEL); } catch { return null; }
}
function luuModel(id: string): void {
  try { localStorage.setItem(KHOA_MODEL, id); } catch { /* bộ nhớ bị chặn — chỉ mất phần nhớ */ }
}

export function ChatMode({ pro, onLapTrinh }: { pro: boolean; onLapTrinh?: () => void }) {
  const { dich, dichP } = useDich();
  const { c, cP } = useCtcChu();
  const { api, user } = useSession();
  const { settings, layThamSo, lanDieuHuong, online } = useAppState();
  const [luot, datLuot] = useState<Luot[]>([]);
  const [nhap, datNhap] = useState('');
  const [bac, datBacTho] = useState<MaModel>(() => modelHopLe(docModelDaLuu(), pro));
  /* `pro` về SAU lần dựng đầu (hỏi máy chủ) ⇒ đọc lại model đã nhớ khi nó đổi. */
  useEffect(() => { datBacTho(modelHopLe(docModelDaLuu(), pro)); }, [pro]);
  const datBac = useCallback((id: MaModel) => { datBacTho(id); luuModel(id); }, []);
  /** Đang sửa tin nhắn người dùng thứ `i` (sửa tại chỗ rồi gửi lại). */
  const [dangSua, datDangSua] = useState<{ i: number; text: string } | null>(null);
  /** Ngăn kéo thanh bên (cửa sổ hẹp). */
  const [ngan, datNgan] = useState(false);
  /** Người dùng đang ở gần đáy bảng ghi ⇒ chữ mới tự kéo xuống; cuộn lên đọc thì KHÔNG giật. */
  const [ganDay, datGanDay] = useState(true);
  const ganDayRef = useRef(true);
  const [suaTieuDe, datSuaTieuDe] = useState<string | null>(null);
  const oSoanRef = useRef<HTMLTextAreaElement>(null);
  const [dangChay, datDangChay] = useState(false);
  const [dangCho, datDangCho] = useState(false);
  /**
   * Đã chờ bao nhiêu giây.
   *
   * ⚠️ Đây là phần vá cảm giác "load mãi", và nó là vá THẬT chứ không phải trang
   * trí. Đo 17/08: chữ đầu tiên về sau 3–4s là bình thường, nhưng cổng có lúc
   * vọt lên 35s. Một con quay không đếm thì 4 giây và 40 giây trông y hệt nhau,
   * nên người dùng không phân biệt được "đang chạy" với "treo rồi".
   */
  const [choGiay, datChoGiay] = useState(0);
  /* Bước và nguồn của LƯỢT ĐANG CHẠY. Gắn vào lượt trả lời cuối cùng khi
     xong — giữ riêng ở đây thì đổi cuộc là mất, mà người dùng vẫn muốn thấy
     nguồn của câu trả lời cũ khi cuộn lên. */
  const [buocDangChay, datBuocDangChay] = useState<Array<{ viec: string; chu: string }>>([]);
  const [moManGoi, datMoManGoi] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  // Trạng thái AI trên máy — để hiện dải báo "đang ngoại tuyến" và tên model.
  const [cucBoTt, datCucBoTt] = useState<AiCucBoTinhTrang | null>(null);
  /** Máy chủ đã HẠ BẬC lượt này chưa, và vì sao — xem khung `model` của SSE. */
  const [roiBac, datRoiBac] = useState<string | null>(null);
  /**
   * Phiên chat đang mở, và danh sách phiên cũ.
   *
   * ⚠️ Trước bản này chế độ Trò chuyện KHÔNG lưu gì: rời trang là mất sạch hội
   * thoại — đúng lỗi đã sửa cho chế độ Lập trình, chỉ là ở đây chưa sửa. Máy
   * chủ vốn đã có sẵn `/ai/chat/sessions` + `/ai/chat/history/:id` và BẢN WEB
   * dùng từ lâu; app chỉ đơn giản là chưa gọi.
   */
  const [phienId, datPhienId] = useState<string | null>(null);
  const [dsPhien, datDsPhien] = useState<PhienChat[]>([]);
  const [dsThuMuc, datDsThuMuc] = useState<ThuMuc[]>([]);
  /** Màn bên phải: hội thoại, hoặc một màn của thanh bên (Lịch sử, Dự án, Artifacts, Tác vụ, Tùy chỉnh). */
  const [view, datView] = useState<CtdView>('chat');
  const [timMo, datTimMo] = useState(false);
  /** Màn Lịch sử đang xem KHO LƯU TRỮ (danh sách riêng, thanh bên luôn là danh sách thường). */
  const [xemLuuTru, datXemLuuTru] = useState(false);
  const [dsLuuTru, datDsLuuTru] = useState<PhienChat[]>([]);
  /** Dự án gán cho cuộc MỚI sắp gửi (chọn dưới ô soạn ở màn chào). */
  const [duAnMoi, datDuAnMoi] = useState<string | null>(null);
  /** Kỹ năng chọn trong ô soạn / "Dùng thử" — gửi `kyNang` thay cho tự nhận. */
  const [kyNangEp, datKyNangEp] = useState<string | null>(null);
  const [chuDe, datChuDe] = useState<string | null>(null);
  const tuyChinh = useTuyChinh();
  const huyRef = useRef<AbortController | null>(null);
  const cuonRef = useRef<HTMLDivElement>(null);
  const dk = useDinhKem();
  /* Dán ở bất kỳ đâu trong khung chat — không chỉ khi con trỏ đã nằm trong ô
     nhập. Xem `useDanKhapNoi` ở DinhKemCode.tsx cho lý do. Chỉ bật cho Pro,
     đúng như nút đính kèm: không Pro thì máy chủ bỏ file, dán được chỉ làm
     người dùng tưởng đã gửi. */
  useDanKhapNoi(dk.them, pro);
  const [dangChupMan, datDangChupMan] = useState(false);

  /* Tự kéo xuống CHỈ khi người dùng đang ở gần đáy — đang cuộn lên đọc câu cũ
     mà chữ mới giật màn hình xuống là thứ khó chịu nhất của một khung chat. */
  useEffect(() => {
    const el = cuonRef.current;
    if (!el || !ganDayRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [luot, dangCho, buocDangChay]);

  const doCuon = useCallback((): void => {
    const el = cuonRef.current;
    if (!el) return;
    const g = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    ganDayRef.current = g;
    datGanDay(g);
  }, []);

  const xuongDay = useCallback((muot = true): void => {
    const el = cuonRef.current;
    ganDayRef.current = true;
    datGanDay(true);
    el?.scrollTo({ top: el.scrollHeight, behavior: muot ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    if (!dangCho) { datChoGiay(0); return; }
    const t0 = Date.now();
    const id = setInterval(() => datChoGiay(Math.round((Date.now() - t0) / 1000)), 500);
    return () => clearInterval(id);
  }, [dangCho]);

  const napDsPhien = useCallback(async () => {
    if (!api) return;
    try {
      // ⚠️ `api.request` ĐÃ bóc `envelope.data` (xem `unwrap` trong api/client.ts),
      // nên đây là mảng luôn — bóc `.data` lần nữa cho ra `undefined`, và danh
      // sách rỗng vĩnh viễn trong khi máy chủ trả về đủ dữ liệu.
      // 10/11: thanh bên luôn là danh sách THƯỜNG (lọc dự án làm ở màn Dự án); kho lưu trữ nạp riêng (napLuuTru).
      const r = await api.request<PhienChat[]>('/api/v1/ai/chat/sessions');
      datDsPhien(Array.isArray(r) ? r : []);
    } catch { /* mất mạng — danh sách rỗng, không phải lỗi chặn đường */ }
  }, [api]);

  const napLuuTru = useCallback(async () => {
    if (!api) return;
    try {
      const r = await api.request<PhienChat[]>('/api/v1/ai/chat/sessions?archived=1');
      datDsLuuTru(Array.isArray(r) ? r : []);
    } catch { /* như trên */ }
  }, [api]);
  useEffect(() => { if (xemLuuTru) void napLuuTru(); }, [xemLuuTru, napLuuTru]);

  const napThuMuc = useCallback(async () => {
    if (!api) return;
    try {
      const r = await api.request<ThuMuc[]>('/api/v1/ai/chat/folders');
      datDsThuMuc(Array.isArray(r) ? r : []);
    } catch { /* chưa đăng nhập hoặc mất mạng */ }
  }, [api]);

  const taoThuMuc = useCallback(async (tenGoc: string) => {
    const ten = tenGoc.trim();
    if (!ten || !api) return;
    try {
      await api.request('/api/v1/ai/chat/folders', { method: 'POST', body: { ten } });
      await napThuMuc();
    } catch (err) {
      datLoi(dichP('Không tạo được thư mục: {loi}', { loi: (err as Error).message }));
    }
  }, [api, napThuMuc]);

  const xoaThuMuc = useCallback(async (id: string) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/ai/chat/folders/${id}`, { method: 'DELETE' });
      // Cuộc bên trong KHÔNG mất — máy chủ đặt `folderId` về null. Nếu đang lọc
      // theo đúng thư mục vừa xoá thì quay về xem tất cả, không để màn hình
      // trống trơn mà người dùng tưởng mất hết.
      datView((v) => (v === `project:${id}` ? 'projects' : v));
      if (duAnMoi === id) datDuAnMoi(null);
      await Promise.all([napThuMuc(), napDsPhien()]);
    } catch (err) {
      datLoi(dichP('Không xoá được thư mục: {loi}', { loi: (err as Error).message }));
    }
  }, [api, duAnMoi, napThuMuc, napDsPhien]);

  const xepVaoThuMuc = useCallback(async (sid: string, folderId: string | null) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/ai/chat/sessions/${sid}/folder`, { method: 'PATCH', body: { folderId } });
      await Promise.all([napThuMuc(), napDsPhien()]);
    } catch (err) {
      datLoi(dichP('Không xếp được: {loi}', { loi: (err as Error).message }));
    }
  }, [api, napThuMuc, napDsPhien]);

  useEffect(() => { void napDsPhien(); }, [napDsPhien]);
  useEffect(() => { void napThuMuc(); }, [napThuMuc]);

  /** Mở một phiên cũ: nạp lịch sử từ máy chủ và gõ tiếp vào chính phiên đó. */
  /* Bấm hai lần vào robot nổi ⇒ main gửi kèm `phien=<id>` của cuộc trò chuyện
     bằng giọng nói. Mở đúng cuộc đó, vì đấy chính là lý do người dùng bấm:
     họ vừa NGHE xong và muốn ĐỌC lại đầy đủ.

     ⚠️ THEO DÕI `lanDieuHuong`, KHÔNG PHẢI `[]`. Bấm bong bóng Odin trong
     lúc ĐANG Ở trang này không gắn lại component, nên effect chạy-một-lần
     sẽ im lặng không làm gì — và đó chính là cảnh người dùng gặp: bấm vào
     khung chữ, không có gì xảy ra. `layThamSo` vẫn tự xoá sau khi đọc, nên
     những lần điều hướng KHÔNG mang tham số đọc ra `null` và trang đứng
     yên — không có chuyện tự nhảy về cuộc cũ giữa lúc đang gõ. */
  useEffect(() => {
    const id = layThamSo('phien');
    if (id) void moPhien(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lanDieuHuong]);

  const moPhien = useCallback(async (id: string) => {
    if (!api) return;
    try {
      const r = await api.request<Array<{ role: string; content: string; createdAt?: string }>>(
        `/api/v1/ai/chat/history/${id}`,
      );
      const ds = Array.isArray(r) ? r : [];
      datLuot(ds.map((m) => {
        // `createdAt` VỐN ĐÃ nằm trong đáp án — `getChatHistory` trả cả bảng
        // `chat_messages`. Bản trước chỉ đọc `role`/`content`, nên mở lại một
        // cuộc cũ là mọi nhãn thời gian biến mất dù dữ liệu có sẵn ngay đó.
        const luc = m.createdAt ? new Date(m.createdAt).getTime() : NaN;
        return {
          vai: m.role === 'user' ? 'user' as const : 'assistant' as const,
          // NFC: model có lúc trả tiếng Việt dạng tổ hợp (chữ + dấu rời) ⇒ dấu vẽ tách khỏi chữ.
          text: String(m.content ?? '').normalize('NFC'),
          ...(Number.isFinite(luc) ? { luc } : {}),
        };
      }));
      datPhienId(id);
      datView('chat');
      datTimMo(false);
      datLoi(null);
      datRoiBac(null);
      datDangSua(null);
      ganDayRef.current = true;
      datGanDay(true);
    } catch (err) {
      datLoi(dichP('Không mở được việc cũ: {loi}', { loi: (err as Error).message }));
    }
  }, [api]);

  const xoaPhien = useCallback(async (id: string) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/ai/chat/sessions/${id}`, { method: 'DELETE' });
      if (id === phienId) { datPhienId(null); datLuot([]); }
      await napDsPhien();
      if (xemLuuTru) await napLuuTru();
    } catch (err) {
      datLoi(dichP('Không xoá được: {loi}', { loi: (err as Error).message }));
    }
  }, [api, phienId, napDsPhien, xemLuuTru, napLuuTru]);

  /** Xoá nhiều cuộc một lần (màn Lịch sử → Chọn). */
  const xoaNhieu = useCallback(async (ids: string[]) => {
    if (!api || !ids.length) return;
    try {
      await api.request('/api/v1/ai/chat/sessions/xoa-nhieu', { method: 'POST', body: { ids } });
      if (phienId && ids.includes(phienId)) { datPhienId(null); datLuot([]); }
      toast.success(cP('Đã xoá {n} cuộc trò chuyện', { n: ids.length }));
      await Promise.all([napDsPhien(), xemLuuTru ? napLuuTru() : Promise.resolve()]);
    } catch (err) {
      toast.error(dichP('Không xoá được: {loi}', { loi: (err as Error).message }));
    }
  }, [api, phienId, napDsPhien, xemLuuTru, napLuuTru, cP]);

  /** Dọn các cuộc chưa có tin nhắn nào (robot/bản cũ tạo sẵn). */
  const donCuocTrong = useCallback(async () => {
    if (!api) return;
    try {
      const r = await api.request<{ soXoa?: number }>('/api/v1/ai/chat/sessions/xoa-trong', { method: 'POST', body: {} });
      const n = Number(r?.soXoa ?? 0);
      toast.success(n > 0 ? cP('Đã dọn {n} cuộc trò chuyện trống', { n }) : c('Không có cuộc trò chuyện trống nào'));
      await napDsPhien();
    } catch (err) {
      toast.error(dichP('Không xoá được: {loi}', { loi: (err as Error).message }));
    }
  }, [api, napDsPhien, cP, c]);

  /**
   * GHIM · ĐỔI TÊN · LƯU TRỮ · TÁCH NHÁNH.
   *
   * Cả bốn đi qua cùng một dạng: gọi máy chủ rồi nạp lại danh sách. KHÔNG sửa
   * `dsPhien` tại chỗ trước như bên AI Code — ở đây máy chủ mới là chỗ quyết
   * thứ tự (nó sắp ghim lên đầu), nên đoán trước rồi để máy chủ trả về thứ tự
   * khác chỉ làm danh sách nhảy hai lần.
   */
  const ghimPhien = useCallback(async (p: PhienChat) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/ai/chat/sessions/${p.id}`, {
        method: 'PATCH', body: { pinned: p.pinned !== true },
      });
      await napDsPhien();
    } catch (err) { datLoi(dichP('Không ghim được: {loi}', { loi: (err as Error).message })); }
  }, [api, napDsPhien]);

  const luuTruPhien = useCallback(async (p: PhienChat) => {
    if (!api) return;
    try {
      // Đang xem kho ⇒ thao tác là LẤY RA. Đang xem danh sách thường ⇒ CẤT ĐI.
      // 10/11: thao tác từ thanh bên (luôn là danh sách thường) ⇒ CẤT ĐI; phiên đang nằm trong kho ⇒ LẤY RA.
      const trongKho = !!p.archivedAt;
      await api.request(`/api/v1/ai/chat/sessions/${p.id}`, {
        method: 'PATCH', body: { archived: !trongKho },
      });
      await Promise.all([napDsPhien(), xemLuuTru ? napLuuTru() : Promise.resolve()]);
    } catch (err) { datLoi(dichP('Không lưu trữ được: {loi}', { loi: (err as Error).message })); }
  }, [api, napDsPhien, xemLuuTru, napLuuTru]);

  const doiTenPhien = useCallback(async (id: string, ten: string) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/ai/chat/sessions/${id}`, { method: 'PATCH', body: { title: ten } });
      await napDsPhien();
    } catch (err) { datLoi(dichP('Không đổi tên được: {loi}', { loi: (err as Error).message })); }
  }, [api, napDsPhien]);

  /**
   * Tách nhánh TRỌN cuộc rồi mở bản mới ra.
   *
   * Không mở thì người dùng bấm xong chỉ thấy danh sách dài thêm một dòng, mà
   * dòng đó lại nằm ngay cạnh bản gốc — trông như hàng bị nhân đôi chứ không
   * như một việc vừa xảy ra.
   */
  const tachNhanhPhien = useCallback(async (id: string) => {
    if (!api) return;
    try {
      const r = await api.request<{ sessionId: string }>(
        `/api/v1/ai/chat/sessions/${id}/fork`, { method: 'POST', body: {} },
      );
      await napDsPhien();
      if (r?.sessionId) await moPhien(r.sessionId);
    } catch (err) { datLoi(dichP('Không tách nhánh được: {loi}', { loi: (err as Error).message })); }
  }, [api, napDsPhien, moPhien]);

  /**
   * TÁCH NHÁNH từ lượt thứ `i` — cuộc mới dừng ngay TRƯỚC lượt đó, cuộc này
   * giữ nguyên. Bản không phá của quay lui.
   */
  const tachNhanhTu = useCallback(async (i: number) => {
    if (!api || !phienId) {
      datLoi(c('Cuộc này chưa được lưu nên chưa tách nhánh được — hãy gửi một câu trước.'));
      return;
    }
    try {
      const r = await api.request<{ sessionId: string }>(
        `/api/v1/ai/chat/sessions/${phienId}/fork`, { method: 'POST', body: { denChiSo: i } },
      );
      await napDsPhien();
      if (r?.sessionId) await moPhien(r.sessionId);
    } catch (err) {
      datLoi(dichP('Không tách nhánh được: {loi}', { loi: (err as Error).message }));
    }
  }, [api, phienId, napDsPhien, moPhien]);

  const chatMoi = (duAn: string | null = null): void => {
    huyRef.current?.abort();
    datView('chat');
    datTimMo(false);
    datDuAnMoi(duAn);
    datKyNangEp(null);
    datChuDe(null);
    datPhienId(null);
    datLuot([]);
    datLoi(null);
    datRoiBac(null);
    datDangSua(null);
    dk.xoaHet();
    setTimeout(() => oSoanRef.current?.focus(), 0);
  };

  // Rời trang giữa chừng ⇒ cắt kết nối. Không cắt thì stream chạy tiếp tới cùng
  // và vẫn bị tính tiền, chỉ khác là không còn ai đọc.
  useEffect(() => {
    // Nạp lại mỗi khi trạng thái mạng đổi: mất mạng thì cần biết ngay có model
    // trên máy để chạy hay không mà báo cho người dùng.
    let huy = false;
    void window.cuongthai?.aiCucBo?.tinhTrang().then((t) => { if (!huy) datCucBoTt(t ?? null); });
    return () => { huy = true; };
  }, [online]);

  // Model sẽ dùng khi mất mạng: bản đang chạy, hoặc bản nên dùng trong số đã
  // tải, hoặc bản đầu đã tải. `null` = chưa có gì để chạy offline.
  const modelCucBoSanSang = ((): string | null => {
    if (settings.aiCucBoBat === false || settings.aiCucBoTuDong === false) return null;
    const daCo = cucBoTt?.daCo ?? [];
    if (!daCo.length) return null;
    const ma = cucBoTt?.dangChay
      ?? (cucBoTt?.khuyen.nen && daCo.includes(cucBoTt.khuyen.nen) ? cucBoTt.khuyen.nen : daCo[0]);
    return cucBoTt?.kho.find((m) => m.ma === ma)?.ten ?? 'AI trên máy';
  })();

  /* ── Giao diện ngoại tuyến (03/10/2026) — cùng luật với AI Code, xem
     `shared/cheDoAi.ts`. `online` giờ là kết quả GÕ CỬA máy chủ thật (main),
     không còn là `navigator.onLine`. */
  const luotCuoi = luot[luot.length - 1];
  const ngoaiTuyen = useGiaoDienNgoaiTuyen({
    dangChay,
    luotLaCucBo: luotCuoi?.vai === 'assistant' && !!luotCuoi.cucBo,
    coModel: (cucBoTt?.daCo.length ?? 0) > 0,
    choPhep: settings.aiCucBoBat !== false && settings.aiCucBoTuDong !== false,
  });

  useEffect(() => () => huyRef.current?.abort(), []);

  /**
   * Gửi một câu. TRẢ VỀ trọn câu trả lời để nút gọi thoại đọc thành tiếng.
   *
   * `nhapNgoai` để gọi được mà không đi qua state `nhap`: nút gọi thoại có sẵn
   * câu vừa nhận dạng, mà `datNhap(x)` rồi gọi ngay `guiDi()` thì hàm vẫn đọc
   * giá trị CŨ — state React chỉ đổi ở lần dựng sau.
   */
  /**
   * @param tuMicro Lượt này đến từ nút giữ-để-nói, nên câu trả lời sẽ được ĐỌC
   *   THÀNH TIẾNG bằng giọng của ngôn ngữ đang chọn. Khi đó phải nói cho máy
   *   chủ biết CẢ HAI điều: trả lời bằng tiếng gì, và trả lời theo kiểu nói.
   *   Thiếu điều thứ nhất là đúng lỗi người dùng gặp 18/08/2026 — chọn English
   *   thì giọng đổi mà chữ vẫn ra tiếng Việt. Thiếu điều thứ hai là máy đọc
   *   phải đọc cả dấu sao của chữ in đậm.
   *
   *   Lượt GÕ TAY thì KHÔNG khoá ngôn ngữ: người dùng gõ tiếng gì muốn được
   *   trả lời tiếng đó, và thiết đặt kia là thiết đặt của trợ lý GIỌNG NÓI.
   */
  /**
   * Một lượt của màn NÓI CHUYỆN: tiếng đã thu → chữ → câu trả lời → tiếng.
   *
   * Đi qua đúng `guiDi` của khung chat, nên cuộc nói chuyện được lưu vào
   * chính phiên đang mở — đóng màn gọi ra là thấy toàn bộ dạng chữ, không
   * phải một cuộc trò chuyện song song biến mất khi tắt.
   */
  const luotGoi = useCallback(async (tiengBase64: string) => {
    if (!api) throw new Error('Chưa đăng nhập.');
    /*
     * ⚠️ KHÔNG DÙNG `fetch('data:...')` ĐỂ ĐỔI base64 → Blob.
     *
     * `connect-src` của app chỉ cho `app://cuongthai` và vài origin đã khai;
     * `data:` KHÔNG có trong đó, nên CSP chặn và trình duyệt ném đúng một
     * câu: "Failed to fetch". Không nhắc gì tới CSP, không nhắc gì tới
     * `data:` — nhìn y như mất mạng. Người dùng gặp đúng câu đó 19/08/2026.
     *
     * Giải mã thẳng bằng `atob` — thuần JS, không đụng mạng, không đụng CSP.
     * Đây cũng đúng cách `phatBase64` trong `nghePhat.ts` vẫn làm; chỗ này
     * lệch đi là do tôi viết hai kiểu cho cùng một việc.
     *
     * Và NỚI CSP để cho `data:` qua là hướng sai: thà sửa một dòng mã còn
     * hơn mở rộng thứ đang bảo vệ cả app.
     */
    const byte = Uint8Array.from(atob(tiengBase64), (c) => c.charCodeAt(0));
    const blob = new Blob([byte], { type: 'audio/webm' });
    const form = new FormData();
    form.append('audio', blob, 'goi.webm');
    const r = await fetch(`${api.baseUrlForForms()}/api/v1/ai/stt`, {
      method: 'POST', headers: api.authHeaders(), body: form, credentials: 'omit',
    });
    const than = await r.json() as { message?: string; data?: { text?: string } };
    if (!r.ok) throw new Error(than.message ?? `Nghe hỏng (${r.status})`);
    const cau = than.data?.text?.trim() ?? '';
    if (!cau) return { traLoi: '', phat: async () => {}, ngung: () => {} };

    const giong = settings.odinNgonNgu === 'en' ? settings.odinGiongEn : settings.odinGiongVi;
    const tenGiong = typeof giong === 'string' && giong ? giong : undefined;
    const doc = settings.odinNoiThanhTieng !== false;

    /*
     * ĐẶT HÀNG MÁY ĐỌC NGAY KHI CÓ CÂU ĐẦU, không chờ trọn câu trả lời.
     *
     * Bốn chặng của một lượt nói: nghe → nhận dạng → nghĩ → đọc → phát. Bản
     * trước chạy nối đuôi cả bốn. Nay chặng "đọc" của câu đầu nằm GỌN TRONG
     * chặng "nghĩ", nên tiếng ra sớm hơn đúng bằng thời gian máy đọc chạy.
     */
    /*
     * HÀNG ĐỢI TIẾNG — mỗi mẩu được đặt hàng NGAY khi nó đủ, không chờ trọn
     * câu trả lời.
     *
     * Bản trước chỉ đặt hàng MỘT mẩu đầu, rồi phần đuôi mới được gọi trong
     * `phat()` — tức SAU khi model viết xong hết, và gọi trọn một cục. Người
     * dùng nghe: đọc câu 1, LẶNG 5-6 giây, rồi đọc một hơi hết phần còn lại.
     */
    const cacMau: string[] = [];
    const hangTieng: Promise<Blob>[] = [];
    const datHang = (c: string) => {
      cacMau.push(c);
      const t = docThanhTieng(api, c, tenGiong);
      void t.catch(() => {});            // lỗi thật nổi lên ở await bên dưới
      hangTieng.push(t);
    };
    const traLoi = await guiDi(cau, true, (c) => { if (doc) datHang(c); });

    return {
      traLoi,
      phat: async () => {
        if (!doc || !traLoi) return;
        if (!hangTieng.length) {
          await phatTieng(await docThanhTieng(api, traLoi, tenGiong));
          return;
        }
        /*
         * Đuôi CHƯA đủ một câu (model kết thúc không có dấu chấm) thì chưa ai
         * đặt hàng — phải xả nốt, không thì mất chữ cuối. Dò bằng con trỏ chạy
         * theo thứ tự các mẩu, chứ không `startsWith`: khoảng trắng giữa các
         * câu có thể khác với lúc gom.
         */
        let viTri = 0;
        for (const m of cacMau) {
          const i = traLoi.indexOf(m, viTri);
          if (i >= 0) viTri = i + m.length;
        }
        const conLai = traLoi.slice(viTri).trim();
        if (conLai) datHang(conLai);
        for (const t of hangTieng) await phatTieng(await t);
      },
      ngung: () => ngungNoi(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, settings]);

  const guiDi = async (
    nhapNgoai?: string,
    tuMicro = false,
    /**
     * Gọi MỘT LẦN ngay khi câu đầu tiên đã đủ, trong lúc phần còn lại vẫn
     * đang chảy về.
     *
     * ⚠️ ĐÂY LÀ TOÀN BỘ CHỖ CẮT ĐƯỢC ĐỘ TRỄ. Không có nó thì bốn chặng chạy
     * nối đuôi: nghe → nhận dạng → NGHĨ XONG HẲN → đọc → phát. Có nó thì
     * chặng "đọc" nằm GỌN TRONG chặng "nghĩ", và người dùng nghe thấy tiếng
     * sớm hơn đúng bằng thời gian máy đọc chạy.
     */
    onCauDau?: (cau: string) => void,
    /**
     * GỬI LẠI (Tạo lại / Sửa tin nhắn): `goc` = hội thoại đã cắt tới TRƯỚC lượt
     * gửi lại — `luot` trong closure vẫn là bản CŨ vì state React chỉ đổi ở lần
     * dựng sau. `tep` = đính kèm của chính lượt gốc (còn trong bộ nhớ), để tạo
     * lại câu hỏi về một ảnh thì model vẫn nhìn thấy ảnh đó. Ô soạn và dải
     * đính kèm đang dở của người dùng KHÔNG bị xoá.
     */
    tuyChon?: { goc: Luot[]; tep: TepDinhKem[] },
  ): Promise<string> => {
    const text = (nhapNgoai ?? nhap).trim();
    const tep = tuyChon ? tuyChon.tep : dk.tep;
    // Có đính kèm thì KHÔNG bắt buộc phải gõ chữ — máy chủ cũng cho vậy. Thả
    // một ảnh lỗi vào rồi bấm gửi là một câu hỏi hoàn chỉnh.
    if ((!text && tep.length === 0) || dangChay || !api) return '';
    // Gom song song với việc dựng giao diện: `luot` là state, đọc ngay sau vòng
    // lặp sẽ ra bản cũ.
    let traLoiDayDu = '';
    let nguonLuot: Nguon[] = [];
    let daBaoCauDau = false;

    const truoc: Luot[] = [
      ...(tuyChon?.goc ?? luot),
      { vai: 'user', text, luc: Date.now(), ...(tep.length ? { tep } : {}) },
    ];
    datLuot(truoc);
    // Vừa gửi ⇒ luôn kéo xuống đáy, kể cả khi trước đó đang cuộn lên đọc.
    ganDayRef.current = true;
    datGanDay(true);
    // Ảnh của lượt này ở dạng data URL — dành cho lối lùi model trên máy khi
    // mất mạng (chỉ nhận `data:image/…`, xem schema `aiCucBo:hoi`).
    const anhCucBo = tep
      .filter((t) => t.loai === 'image' && typeof t.url === 'string' && t.url.startsWith('data:image/'))
      .map((t) => t.url)
      .slice(0, 3);
    if (!tuyChon) {
      datNhap('');
      dk.xoaHet();
    }
    datLoi(null);
    datRoiBac(null);
    datDangChay(true);
    datDangCho(true);

    const dieuKhien = new AbortController();
    huyRef.current = dieuKhien;

    try {
      /* Bộ theo dõi mạng (main) đã KẾT LUẬN mất mạng ⇒ đi thẳng xuống AI trên
         máy, đừng bắt người dùng chờ lời gọi máy chủ quá hạn rồi mới rơi xuống.
         `TypeError` để rơi đúng vào nhánh lưới đỡ ở `catch` bên dưới. */
      if (!online) throw new TypeError('ngoại tuyến');
      /**
       * Tạo phiên TRƯỚC nếu chưa có.
       *
       * ⚠️ Máy chủ KHÔNG tự tạo: `/ai/chat` lấy `sessionId` thẳng từ body, và
       * không có thì nó bỏ qua bước lưu tin nhắn (`if (sessionId) saveUserMessage`).
       * Khung `connected` vẫn trả về một trường `sessionId` — nhưng đó chính là
       * thứ client vừa gửi, nên tin vào nó là tin vào `undefined`. Bản đầu của
       * tôi làm đúng như vậy và hội thoại không bao giờ được lưu, trong khi mọi
       * thứ trên màn hình trông hoàn toàn bình thường.
       */
      let phienDung = phienId;
      if (!phienDung) {
        /* 10/11: KHÔNG đặt tiêu đề ở đây — để tên tạm của máy chủ, trả lời xong máy chủ tự đặt tiêu đề ngắn
           (src/services/chatTieuDe.ts, khung SSE `title`). Đặt sẵn 60 chữ đầu thì tên đó là "tên thật", không bao
           giờ được thay. */
        const r = await api.request<{ sessionId?: string }>(
          '/api/v1/ai/chat/sessions', { method: 'POST', body: {} },
        );
        phienDung = r?.sessionId ?? null;
        if (phienDung) datPhienId(phienDung);
        // Cuộc mới bắt đầu trong một dự án ⇒ xếp vào dự án ngay.
        if (phienDung && duAnMoi) {
          const duAn = duAnMoi;
          datDuAnMoi(null);
          void api.request(`/api/v1/ai/chat/sessions/${phienDung}/folder`, { method: 'PATCH', body: { folderId: duAn } })
            .then(() => napThuMuc()).catch(() => toast.error(c('Không xếp được cuộc trò chuyện vào dự án')));
        }
      }

      const anh = tep.filter((t) => t.loai === 'image');
      const tai = tep.filter((t) => t.loai === 'tailieu');

      /* ⚠️ Lịch sử lên model là CHỮ THUẦN — ảnh chỉ đi kèm đúng lượt người
         dùng vừa đính. Nên gửi ảnh đề rồi hỏi tiếp "câu b thì sao" là model
         KHÔNG CÒN NHÌN THẤY ĐỀ, và nó quay ra xin gửi lại ảnh. Người dùng gửi
         đúng ảnh chứng minh điều này 19/09/2026.
         Bản WEB đã vá từ trước (`TAM_NHO_ANH` trong `frontend/.../chat/page.tsx`);
         app thì chưa — hai kho, một tính năng, chỉ một bên được vá. */
      const luotCu: LuotChat[] = truoc.slice(0, -1).map((l) => ({
        vai: l.vai,
        chu: l.text,
        anh: l.tep?.filter((t) => t.loai === 'image').map((t) => t.url),
      }));
      const anhGui = anhKemLai(luotCu, anh.length ? anh.map((t) => t.url) : undefined);
      const res = await fetch(`${api.baseUrlForForms()}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...api.authHeaders() },
        signal: dieuKhien.signal,
        body: JSON.stringify({
          message: text,
          model: bac,
          // Có phiên thì gõ tiếp vào phiên đó; chưa có thì để máy chủ tự tạo và
          // nhặt id nó trả về ở khung `connected`.
          ...(phienDung ? { sessionId: phienDung } : {}),
          history: truoc.slice(-SO_LUOT_NGU_CANH - 1, -1).map((l) => ({ role: l.vai, content: l.text })),
          // Máy chủ nhận data URL đầy đủ và tự tách phần base64 (`parseChatImages`
          // / `parseChatDocuments`). Gửi kèm TÊN FILE vì nó là nhãn duy nhất
          // model có để nói "trong file hợp-đồng.pdf thì…".
          ...(anhGui?.length ? { images: anhGui } : {}),
          ...(tai.length ? { documents: tai.map((t) => t.url), documentNames: tai.map((t) => t.ten) } : {}),
          // Tùy chỉnh (ngôn ngữ / tìm web / kỹ năng) — danh sách trắng của máy chủ. Lượt nói khoá ngôn ngữ đè lên.
          ...thanTuyChinh(tuyChinh, kyNangEp),
          ...(tuMicro
            ? { voice: true, ngonNgu: settings.odinNgonNgu === 'en' ? 'en' : 'vi' }
            : {}),
        }),
      });
      if (!res.ok || !res.body) {
        // Lỗi đính kèm trả về JSON thường (400) chứ không phải khung SSE — đọc
        // nó ra để nói đúng file nào sai, thay vì "Máy chủ trả về 400".
        const than = await res.json().catch(() => null) as { message?: string } | null;
        throw new Error(than?.message ?? `Máy chủ trả về ${res.status}`);
      }

      const doc = res.body.getReader();
      const giaiMa = new TextDecoder();
      let dem = '';
      let daMo = false;

      for (;;) {
        const { done, value } = await doc.read();
        if (done) break;
        dem += giaiMa.decode(value, { stream: true });
        const dong = dem.split('\n');
        dem = dong.pop() ?? '';

        for (const d of dong) {
          if (!d.startsWith('data: ')) continue;
          let e: {
            type?: string; text?: string; error?: string; fellBack?: boolean; reason?: string;
            requested?: string; viec?: string; chu?: string; nguon?: unknown; title?: string; sessionId?: string;
          };
          try { e = JSON.parse(d.slice(6)); } catch { continue; }

          if (e.type === 'buoc') {
            datBuocDangChay((c) => [...c, { viec: String(e.viec ?? ''), chu: String(e.chu ?? '') }]);
            continue;
          }
          if (e.type === 'nguon' && Array.isArray(e.nguon)) {
            // Gắn nguồn vào lượt trả lời — nó thuộc về câu trả lời đó, không
            // thuộc về màn hình. Đổi cuộc rồi quay lại vẫn phải còn.
            nguonLuot = (e.nguon as Nguon[]).map((n) => ({ ...n, tieuDe: String(n.tieuDe ?? '').normalize('NFC') }));
            continue;
          }
          // Máy chủ vừa đặt tiêu đề cho cuộc (lượt đầu) — cập nhật ngay, không chờ nạp lại danh sách.
          if (e.type === 'title' && typeof e.title === 'string' && e.title.trim()) {
            const t = e.title.normalize('NFC');
            const sid = e.sessionId ?? phienDung;
            datDsPhien((ds) => ds.map((p) => (p.id === sid ? { ...p, title: t } : p)));
            continue;
          }
          if (e.type === 'chunk' && e.text) {
            // (callback câu đầu xử lý ngay dưới, sau khi đã cộng chuỗi)
            datDangCho(false);
            const mieng = e.text;
            traLoiDayDu += mieng;
            // NFC cả chuỗi mỗi lần: dấu tổ hợp có thể tới ở mẩu SAU chữ gốc.
            datLuot((cu) => {
              if (!daMo) { daMo = true; return [...cu, { vai: 'assistant', text: mieng.normalize('NFC') }]; }
              const cuoi = cu[cu.length - 1];
              if (!cuoi || cuoi.vai !== 'assistant') return [...cu, { vai: 'assistant', text: mieng.normalize('NFC') }];
              return [...cu.slice(0, -1), { vai: 'assistant', text: (cuoi.text + mieng).normalize('NFC') }];
            });
            if (onCauDau && !daBaoCauDau) {
              const cau = catCauDau(traLoiDayDu);
              if (cau) { daBaoCauDau = true; onCauDau(cau); }
            }
          } else if (e.type === 'error') {
            datLoi(e.error ?? 'Lỗi không rõ.');
          } else if (e.type === 'model' && e.fellBack) {
            /**
             * ⚠️ MÁY CHỦ CÓ THỂ HẠ BẬC MÀ KHÔNG BÁO LỖI.
             *
             * Bậc Pro/Max là đặc quyền Pro, và đó cũng là ĐƯỜNG DUY NHẤT xử lý
             * ảnh + tài liệu. Không Pro ⇒ máy chủ lặng lẽ quay về bậc thường và
             * **bỏ luôn file đính kèm**, rồi trả lời như chưa từng thấy file
             * nào. Đo thật 17/08: gửi ảnh đỏ + hỏi "màu gì" → "Tôi chưa thấy
             * ảnh đính kèm".
             *
             * Đó là kiểu hỏng tệ nhất: có câu trả lời, nghe trôi chảy, và sai
             * vì thiếu đúng thứ người dùng vừa gửi. Nên phải nói ra.
             */
            const ten = tenModel(e.requested ?? bac);
            const thuong = tenModel(MODEL_MAC_DINH);
            const cau = e.reason === 'pro_required'
              ? cP('{ten} cần tài khoản Pro — lượt này dùng {thuong}.', { ten, thuong })
              : e.reason === 'claude_cham_tran'
                ? cP('{ten} đã chạm hạn mức hôm nay — lượt này dùng {thuong}.', { ten, thuong })
                : cP('{ten} đang tạm bận — lượt này dùng {thuong}.', { ten, thuong });
            datRoiBac(tep.length ? cau + c(' File đính kèm có thể không được đọc.') : cau);
            // Trả bộ chọn về bậc mặc định — để nguyên bậc cao thì lượt sau lại rơi y hệt.
            datBac(MODEL_MAC_DINH);
          }
          // 'connected' | 'model' | 'reasoning' | 'figure_fix' | 'done' — bản
          // này không dùng tới, bỏ qua im lặng là đúng: thêm khung mới ở máy
          // chủ không được phép làm vỡ app cũ đang cài trên máy người dùng.
        }
      }
    } catch (err) {
      if (dieuKhien.signal.aborted) {
        // Người dùng tự huỷ — không phải lỗi.
      } else if ((!online || err instanceof TypeError) && window.cuongthai?.aiCucBo) {
        /* MẤT MẠNG → LƯỚI ĐỠ: hỏi model chạy trên máy (nếu đã tải + bật).
           Chỉ chạy khi mạng đứt — có mạng thì luôn đi máy chủ (máy chủ trả
           4xx là nó đang nói rõ điều người dùng cần biết, đừng che). Ranh giới
           này khớp với con robot CuongMini: xem `main/aiCucBo/hoi.ts`. */
        const lichSuCucBo = truoc
          .slice(0, -1)
          .filter((l) => l.text.trim())
          .slice(-10)
          .map((l) => ({ vaiTro: l.vai === 'user' ? 'nguoi' as const : 'may' as const, chu: l.text }));
        let kq: { chu: string; loi?: string } | undefined;
        try {
          kq = await window.cuongthai.aiCucBo.hoi({
            chu: text || 'Xem giúp mình.',
            ...(lichSuCucBo.length ? { lichSu: lichSuCucBo } : {}),
            ...(anhCucBo.length ? { anh: anhCucBo } : {}),
          });
        } catch {
          kq = undefined;
        }
        if (kq?.chu) {
          /* Gắn nhãn để KHÔNG ai nhầm câu từ máy (yếu hơn) với câu trên mạng.
             Hai lớp: nhãn chữ NẰM TRONG nội dung (sống qua sao chép/lưu), và
             `cucBo` để bong bóng tự vẽ huy hiệu + đổi màu. */
          const daGanNhan = `${dich('_Trả lời bởi CuongMini trên máy bạn (ngoại tuyến) — có thể kém chính xác hơn._')}

${kq.chu}`;
          traLoiDayDu = kq.chu;
          const tenMay = modelCucBoSanSang ?? dich('CuongMini trên máy');
          datLuot((cu) => [...cu, { vai: 'assistant', text: daGanNhan, cucBo: tenMay }]);
          onCauDau?.(kq.chu);
        } else {
          datLoi(kq?.loi ?? dich('Mất mạng, và chưa có CuongMini trên máy để dùng thay. Vào Cài đặt → CuongMini ngoại tuyến để tải model dùng khi không có mạng.'));
        }
      } else {
        datLoi((err as Error).message);
      }
    } finally {
      huyRef.current = null;
      datDangChay(false);
      datDangCho(false);
      datBuocDangChay([]);
      // Gắn nguồn vào LƯỢT trả lời (không phải vào màn hình): cuộn lên xem
      // câu cũ vẫn phải thấy nó đã dựa vào những trang nào.
      if (nguonLuot.length) {
        datLuot((cu) => {
          const c = [...cu];
          for (let i = c.length - 1; i >= 0; i -= 1) {
            if (c[i]!.vai === 'assistant') { c[i] = { ...c[i]!, nguon: nguonLuot }; break; }
          }
          return c;
        });
      }
      // Cập nhật danh sách SAU khi xong: tiêu đề phiên do máy chủ đặt từ câu
      // hỏi đầu, và nó chỉ có sau khi lượt chạy.
      void napDsPhien();
    }
    return traLoiDayDu.trim();
  };


  /**
   * Cắt hội thoại ở MÁY CHỦ từ chỉ số `i` trở đi (`POST …/cat`) — bước đầu của
   * Tạo lại và Sửa tin nhắn.
   *
   * Cắt TRƯỚC rồi mới gửi: gửi trước thì tin mới được lưu rồi bị chính lệnh cắt
   * xoá mất. Cắt hỏng ⇒ DỪNG, không gửi — gửi tiếp thì mở lại cuộc này sẽ thấy
   * cả bản cũ lẫn bản mới chồng lên nhau. Cuộc chưa lưu (chưa có phiên) thì
   * không có gì để cắt ở máy chủ.
   */
  const catTu = async (i: number): Promise<boolean> => {
    if (!api || !phienId) return true;
    try {
      await api.request(`/api/v1/ai/chat/sessions/${phienId}/cat`, {
        method: 'POST', body: { tuChiSo: i },
      });
      return true;
    } catch (err) {
      datLoi(cP('Không cắt được trên máy chủ: {loi}', { loi: (err as Error).message }));
      return false;
    }
  };

  /** Bỏ tin người dùng thứ `iNguoi` + mọi thứ sau nó, rồi gửi `text` vào đúng chỗ đó. */
  const guiLaiTu = async (iNguoi: number, text: string): Promise<void> => {
    const goc = luot[iNguoi];
    if (!goc || goc.vai !== 'user' || dangChay) return;
    if (!(await catTu(iNguoi))) return;
    const nen = luot.slice(0, iNguoi);
    datLuot(nen);
    datDangSua(null);
    void guiDi(text, false, undefined, { goc: nen, tep: goc.tep ?? [] });
  };

  /** TẠO LẠI câu trả lời thứ `iMay`: gửi lại câu hỏi ngay trước nó. */
  const taoLai = (iMay: number): void => {
    let u = iMay - 1;
    while (u >= 0 && luot[u]?.vai !== 'user') u -= 1;
    const g = luot[u];
    if (u < 0 || !g) return;
    void guiLaiTu(u, g.text);
  };

  const luuSua = (): void => {
    if (!dangSua) return;
    const t = dangSua.text.trim();
    const g = luot[dangSua.i];
    if (!t && !g?.tep?.length) return;
    void guiLaiTu(dangSua.i, t);
  };

  const phienDangMo = dsPhien.find((p) => p.id === phienId);
  /* Cuộc vừa tạo chưa có trong danh sách (danh sách nạp lại SAU lượt chạy) ⇒
     tạm lấy câu hỏi đầu làm tiêu đề, như máy chủ sẽ đặt. */
  const tieuDe = phienDangMo?.title?.trim()
    || luot.find((l) => l.vai === 'user')?.text.trim().slice(0, 60)
    || c('Cuộc chưa đặt tên');
  const luuTieuDe = (): void => {
    const t = suaTieuDe?.trim();
    datSuaTieuDe(null);
    if (t && phienId && t !== tieuDe) void doiTenPhien(phienId, t);
  };

  const trong = luot.length === 0;
  const iCuoi = luot.length - 1;
  /** Chữ ĐANG chảy về (khác với còn đang chờ chữ đầu). */
  const dangChayChu = dangChay && !dangCho;

  /* ── Lời chào + chip chủ đề + chọn dự án (màn trống, như /chat web) ── */
  const tenGoi = tuyChinh.tenGoi || user?.fullName?.trim().split(/\s+/).slice(-1)[0] || user?.username || '';
  const loiChao = ((): string => {
    const h = new Date().getHours();
    const buoi = h < 11 ? c('Chào buổi sáng') : h < 14 ? c('Chào buổi trưa') : h < 18 ? c('Chào buổi chiều') : c('Chào buổi tối');
    return tenGoi ? `${buoi}, ${tenGoi}` : buoi;
  })();
  const CHU_DE = [
    { id: 'viet', nhan: 'Viết', Icon: PenLine, goiY: ['Viết email xin nghỉ học gửi thầy cô, lịch sự và ngắn gọn', 'Viết phần giới thiệu bản thân cho CV thực tập IT', 'Viết lại đoạn văn sau cho mạch lạc và tự nhiên hơn:\n\n', 'Soạn bài đăng LinkedIn chia sẻ dự án mình vừa làm xong'] },
    { id: 'hoc', nhan: 'Học', Icon: GraduationCap, goiY: ['Giải thích độ phức tạp Big-O bằng ví dụ đời thường', 'Lập kế hoạch ôn thi 7 ngày cho môn ', 'Tạo 10 câu trắc nghiệm ôn tập về SQL JOIN, kèm đáp án', 'So sánh TCP và UDP thật dễ hiểu'] },
    { id: 'code', nhan: 'Code', Icon: Code2, goiY: ['Review đoạn code này và chỉ ra lỗi:\n\n', 'Viết API REST CRUD bằng Express + Prisma cho bảng Student', 'Giải thích khi nào useEffect chạy trong React', 'Viết câu SQL lấy top 3 sinh viên điểm cao nhất mỗi lớp'] },
    { id: 'song', nhan: 'Đời sống', Icon: Coffee, goiY: ['Gợi ý thực đơn 3 ngày cho sinh viên, tiết kiệm mà đủ chất', 'Lên lịch học và làm thêm hợp lý cho một tuần', 'Cách chuẩn bị cho buổi phỏng vấn thực tập đầu tiên', 'Gợi ý quà sinh nhật dưới 300 nghìn'] },
  ];
  const chuDeMo = CHU_DE.find((x) => x.id === chuDe);
  const duAnDangChon = dsThuMuc.find((f) => f.id === duAnMoi);
  const [duAnMenu, datDuAnMenu] = useState(false);
  const chonDuAn = (
    <span className="ctd-du-an" data-mo={duAnMenu}>
      <button type="button" className="ctd-duoi-nut" data-on={!!duAnDangChon} onClick={() => datDuAnMenu((v) => !v)} aria-haspopup="menu" aria-expanded={duAnMenu}>
        <FolderKanban size={15} aria-hidden /> <span>{duAnDangChon ? duAnDangChon.ten : c('Dự án')}</span> <ChevronDown size={13} aria-hidden />
      </button>
      {duAnMenu && (
        <div className="ctd-menu ctd-menu-duoi" role="menu" onMouseLeave={() => datDuAnMenu(false)}>
          <div className="ctd-menu-nhan">{c('Bắt đầu trong dự án')}</div>
          <button type="button" className="ctd-menu-muc" onClick={() => { datDuAnMoi(null); datDuAnMenu(false); }}>{c('Không thuộc dự án')} {!duAnMoi && <Check size={14} style={{ marginLeft: 'auto' }} />}</button>
          {dsThuMuc.map((f) => (
            <button key={f.id} type="button" className="ctd-menu-muc" onClick={() => { datDuAnMoi(f.id); datDuAnMenu(false); }}>
              <FolderKanban size={14} /> {f.ten} {duAnMoi === f.id && <Check size={14} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
          <div className="ctd-menu-vach" />
          <button type="button" className="ctd-menu-muc" onClick={() => { datDuAnMenu(false); datView('projects'); }}><FolderKanban size={14} /> {c('Quản lý dự án…')}</button>
        </div>
      )}
    </span>
  );
  /** "Dùng thử" ở Tùy chỉnh ⇒ cuộc mới, chọn sẵn kỹ năng, điền câu mẫu. */
  const dungThuKyNang = (id: string, viDu: string): void => {
    if (id === 'goi-thoai') { datMoManGoi(true); return; }
    chatMoi();
    datKyNangEp(['anh', 'code', 'toan', 'tieng-anh', 'tieng-nhat', 'tieng-viet'].includes(id) ? id : null);
    if (viDu) { datNhap(viDu); setTimeout(() => oSoanRef.current?.focus(), 0); }
  };

  const thongBao = (
    <>
      {loi && <div className="ct-notice ctc-bao" data-tone="err"><span>{loi}</span></div>}
      {roiBac && <div className="ct-notice ctc-bao" data-tone="warn"><span>{roiBac}</span></div>}
      {dk.loi && <div className="ct-notice ctc-bao" data-tone="warn"><span>{dk.loi}</span></div>}
    </>
  );

  return (
    /* Thanh bên + khung chat nằm CẠNH nhau trong `.ctc-root`. Mọi trạng thái
       của danh sách cuộc sống ở đây (chỗ gửi tin) — thanh bên chỉ vẽ và bấm. */
    <div className="ctc-root" data-ngan={ngan}>
      <ThanhBenChat
        ds={dsPhien}
        dangMo={phienId}
        view={view}
        onView={datView}
        onTim={() => datTimMo(true)}
        onMo={(id) => void moPhien(id)}
        onTaoMoi={() => chatMoi()}
        onXoa={(id) => void xoaPhien(id)}
        onGhim={(p) => void ghimPhien(p)}
        onLuuTru={(p) => void luuTruPhien(p)}
        onDoiTen={(id, t) => void doiTenPhien(id, t)}
        onTachNhanh={(id) => void tachNhanhPhien(id)}
        onXepVaoThuMuc={(sid, fid) => void xepVaoThuMuc(sid, fid)}
        dsThuMuc={dsThuMuc}
        ngan={ngan}
        onNgan={datNgan}
      />

      <div
        className="ctc-main"
        data-trong={trong}
        data-ngoai-tuyen={ngoaiTuyen.nen === 'ngoaiTuyen' ? '1' : undefined}
        data-keo={dk.dangKeo}
        /* `onDragEnter` PHẢI có bên cạnh `onDragOver`: thiếu nó thì lớp phủ chỉ
           hiện khi con trỏ đã rê được một quãng. */
        onDragEnter={dk.keoVao}
        onDragOver={dk.keoVao}
        onDragLeave={dk.keoRa}
        /* Không Pro thì vẫn NHẬN cú thả rồi nói lý do — để `undefined` thì hệ
           điều hành từ chối cú kéo và người dùng không nhận được chữ nào. */
        onDrop={pro ? dk.thaVao : (e) => { e.preventDefault(); dk.keoRa(); dk.datLoi(c('Đính kèm file cần tài khoản Pro.')); }}
      >
        {dk.dangKeo && (
          <div className="ct-dk-phu ctc-phu-keo" data-thieu={!pro}>
            <span>{pro ? c('Thả file vào đây') : c('Đính kèm file cần tài khoản Pro')}</span>
          </div>
        )}

        <header className="ctc-dau-trang">
          <button
            type="button" className="ctc-dau-nut ctc-chi-hep"
            onClick={() => datNgan(true)}
            aria-label={c('Mở thanh bên')} title={c('Mở thanh bên')}
          >
            <Menu size={18} aria-hidden />
          </button>
          {view === 'chat' && phienId && (suaTieuDe !== null ? (
            <input
              className="ctc-dau-sua"
              autoFocus
              value={suaTieuDe}
              maxLength={200}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => datSuaTieuDe(e.target.value)}
              onBlur={luuTieuDe}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') { e.preventDefault(); luuTieuDe(); }
                if (e.key === 'Escape') { e.preventDefault(); datSuaTieuDe(null); }
              }}
            />
          ) : (
            <button
              type="button" className="ctc-dau-tieude"
              onClick={() => datSuaTieuDe(tieuDe)}
              title={c('Đổi tên')}
            >
              {tieuDe}
            </button>
          ))}
          <span className="ctc-dau-dem" />
          <button
            type="button" className="ctc-dau-nut ctc-chi-hep" data-nut="chatMoi"
            onClick={() => chatMoi()}
            aria-label={c('Cuộc trò chuyện mới')} title={c('Cuộc trò chuyện mới')}
          >
            <Plus size={18} aria-hidden />
          </button>
        </header>

        <DaiNgoaiTuyen
          tt={ngoaiTuyen}
          tenModel={luotCuoi?.cucBo ?? modelCucBoSanSang ?? ''}
          lyDo={dich('Vào Cài đặt → CuongMini ngoại tuyến để tải model dùng khi không có mạng.')}
          dangChay={dangChay}
        />

        {view !== 'chat' && (
          <div className="ctd-cuon">
            {view === 'recents' ? (
              <TrangLichSu
                ds={xemLuuTru ? dsLuuTru : dsPhien}
                xemLuuTru={xemLuuTru}
                onXemLuuTru={datXemLuuTru}
                onMo={(id) => void moPhien(id)}
                onMoi={() => chatMoi()}
                onXoaNhieu={xoaNhieu}
                onDonTrong={donCuocTrong}
              />
            ) : view === 'projects' ? (
              <TrangDuAn dsThuMuc={dsThuMuc} onMo={(id) => datView(`project:${id}`)} onTao={(t) => void taoThuMuc(t)} />
            ) : view.startsWith('project:') ? (
              <TrangMotDuAn
                thuMuc={dsThuMuc.find((f) => f.id === view.slice('project:'.length))}
                ds={dsPhien}
                onLui={() => datView('projects')}
                onMo={(id) => void moPhien(id)}
                onBatDau={() => chatMoi(view.slice('project:'.length))}
                onXoa={() => void xoaThuMuc(view.slice('project:'.length))}
              />
            ) : view === 'artifacts' ? (
              <TrangArtifacts api={api} ds={dsPhien} onMoPhien={(id) => void moPhien(id)} />
            ) : view === 'scheduled' ? (
              <TrangTacVu api={api} onMoPhien={(id) => void moPhien(id)} />
            ) : (
              <TrangTuyChinh
                pro={pro}
                model={bac}
                onChonModel={datBac}
                onThu={dungThuKyNang}
                onLapTrinh={() => onLapTrinh?.()}
                onMoTrang={moWeb}
              />
            )}
          </div>
        )}

        {view === 'chat' && !trong && (
          <div className="ctc-cuon" ref={cuonRef} onScroll={doCuon}>
            <div className="ctc-cot">
              {luot.map((l, i) => (l.vai === 'user' ? (
                dangSua?.i === i ? (
                  <div key={i} className="ctc-sua">
                    <textarea
                      autoFocus
                      value={dangSua.text}
                      rows={Math.min(12, Math.max(2, dangSua.text.split('\n').length))}
                      onChange={(e) => datDangSua({ i, text: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); luuSua(); }
                        if (e.key === 'Escape') { e.preventDefault(); datDangSua(null); }
                      }}
                    />
                    <div className="ctc-sua-nut">
                      <button type="button" className="ctc-nut-vien" onClick={() => datDangSua(null)}>{c('Huỷ')}</button>
                      <button
                        type="button" className="ctc-nut-chinh"
                        onClick={luuSua}
                        disabled={dangChay || (!dangSua.text.trim() && !l.tep?.length)}
                      >
                        {c('Lưu & gửi')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="ctc-nguoi">
                    <div className="ctc-nguoi-bong">
                      <DinhKemDaGui tep={l.tep ?? []} />
                      {l.text && <div className="ctc-nguoi-chu">{l.text}</div>}
                    </div>
                    <HanhDongNguoi
                      text={l.text}
                      {...(l.luc === undefined ? {} : { luc: l.luc })}
                      khoa={dangChay}
                      onSua={() => datDangSua({ i, text: l.text })}
                      onTachNhanh={() => void tachNhanhTu(i)}
                    />
                  </div>
                )
              ) : (
                <div
                  key={i}
                  className="ctc-may"
                  data-cuc-bo={l.cucBo ? '1' : undefined}
                  data-chay={dangChayChu && i === iCuoi}
                  data-cuoi={i === iCuoi}
                >
                  {l.cucBo && <NhanMay ten={l.cucBo} />}
                  <ChuAgent text={l.text} />
                  {l.nguon?.length ? <TheNguon nguon={l.nguon} /> : null}
                  {dangChay && i === iCuoi ? (
                    <div className="ctc-may-chay"><CtcDau co={20} dangChay /></div>
                  ) : (
                    <HanhDongMay
                      text={l.text}
                      khoa={dangChay}
                      cuoi={i === iCuoi}
                      {...(l.cucBo ? {} : { onTaoLai: () => taoLai(i) })}
                      dau={i === iCuoi ? <CtcDau co={20} /> : null}
                    />
                  )}
                </div>
              )))}

              {buocDangChay.map((b, i) => (
                <div key={`b${i}`} className="ct-buoc ctc-buoc" data-viec={b.viec}>
                  {b.viec === 'tim' ? <Search size={12} aria-hidden /> : <BookOpen size={12} aria-hidden />}
                  <span>{b.viec === 'tim' ? c('Đang tìm trên web') : c('Đang đọc')}</span>
                  <em>{b.chu}</em>
                </div>
              ))}
              {dangCho && (
                <div className="ctc-cho">
                  <CtcDau co={20} dangChay />
                  <DangNghi giay={choGiay} />
                </div>
              )}
              {thongBao}
            </div>
          </div>
        )}

        {view === 'chat' && <div className="ctc-day">
          {!trong && !ganDay && (
            <button
              type="button" className="ctc-xuong"
              onClick={() => xuongDay()}
              aria-label={c('Xuống cuối')} title={c('Xuống cuối')}
            >
              <ArrowDown size={16} aria-hidden />
            </button>
          )}
          {trong && (
            <div className="ctc-chao">
              <CtcDau co={56} />
              <h1>{loiChao}</h1>
            </div>
          )}
          {trong && <div className="ctc-day-bao">{thongBao}</div>}
          <CtcSoan
            oRef={oSoanRef}
            nhap={nhap}
            datNhap={datNhap}
            onGui={() => void guiDi()}
            onDung={() => huyRef.current?.abort()}
            dangChay={dangChay}
            pro={pro}
            model={bac}
            onChonModel={datBac}
            dk={dk}
            onChupMan={() => datDangChupMan(true)}
            onMoGoi={() => datMoManGoi(true)}
            onNoi={(cau) => guiDi(cau, true)}
            giuaTrang={trong}
            duoiTrai={trong ? chonDuAn : <span className="ctc-luuy ctd-luuy">{c('CuongMini có thể nhầm. Hãy kiểm tra lại thông tin quan trọng.')}</span>}
            kyNang={kyNangEp ? { id: kyNangEp, ten: KY_NANG.find((k) => k.id === kyNangEp)?.ten ?? kyNangEp } : null}
            dsKyNang={KY_NANG.filter((k) => k.loai === 'ky-nang' && tuyChinh.kyNangBat.includes(k.id)).map((k) => ({ id: k.id, ten: k.ten }))}
            onChonKyNang={datKyNangEp}
          />
          {trong && (
            <div className="ctd-chip-hang">
              {CHU_DE.map((cd) => (
                <button key={cd.id} type="button" className="ctd-chip" data-on={chuDe === cd.id} onClick={() => datChuDe((v) => (v === cd.id ? null : cd.id))}>
                  <cd.Icon size={15} aria-hidden /> {c(cd.nhan)}
                </button>
              ))}
            </div>
          )}
          {trong && chuDeMo && (
            <div className="ctd-goi-y" role="list">
              <div className="ctd-goi-y-dau">
                <chuDeMo.Icon size={15} aria-hidden /> <span>{c(chuDeMo.nhan)}</span>
                <button type="button" className="ctd-icon" onClick={() => datChuDe(null)} aria-label={c('Đóng')}><X size={14} /></button>
              </div>
              {chuDeMo.goiY.map((g) => (
                <button key={g} type="button" role="listitem" onClick={() => { datNhap(g); datChuDe(null); setTimeout(() => oSoanRef.current?.focus(), 0); }}>{g.trim()}</button>
              ))}
            </div>
          )}
        </div>}

        {dangChupMan && (
          <ChupManHinh
            onXong={(f) => void dk.them([f])}
            onDong={() => datDangChupMan(false)}
          />
        )}

        {timMo && (
          <HopTim ds={dsPhien} onDong={() => datTimMo(false)} onMo={(id) => void moPhien(id)} onMoi={() => chatMoi()} />
        )}

        {/* Màn nói chuyện phủ lên trên — đặt CUỐI cây để nó nằm trên mọi thứ. */}
        {moManGoi && (
          <ManGoi
            hoi={luotGoi}
            catLoiBangGiong={settings.odinCatLoi !== false}
            onDong={() => { ngungNoi(); datMoManGoi(false); }}
          />
        )}
      </div>
    </div>
  );
}
