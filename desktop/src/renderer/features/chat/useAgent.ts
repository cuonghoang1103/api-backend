/**
 * Nối sự kiện agent từ main vào React.
 *
 * ─── VÌ SAO HỘI THOẠI THẬT KHÔNG NẰM Ở ĐÂY ───
 * Bản dưới đây chỉ để HIỂN THỊ. Hội thoại thật (kèm `tool_calls`,
 * `tool_call_id`) sống trong main process — xem `main/agent/loop.ts`. Hai bản
 * cố ý khác nhau: người dùng không cần thấy `tool_call_id`, còn giao thức thì
 * không quan tâm ta gộp mấy dòng chữ lại thành một bong bóng.
 *
 * Hệ quả phải nhớ: rời khỏi trang này KHÔNG huỷ lượt đang chạy. Nó vẫn chạy
 * tiếp ở main và vẫn tính tiền. Đó là hành vi ĐÚNG (người dùng chuyển sang
 * Notes tra cứu rồi quay lại vẫn thấy kết quả), nhưng nghĩa là nút Dừng phải
 * thật sự gọi `cancel()` chứ không chỉ ẩn giao diện đi.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AgentInfo, AgentMucKhoiPhuc, AgentNguCanh, AgentPhanLoaiLenh, AgentPhien, AgentQuota, AgentQuyetDinh,
  AgentUiEvent, AgentViec, AgentWorkspace,
} from '../../../shared/ipc';
import type { TheXinPhep } from './XinPhep';

/** Một mục trên màn hình. Không phải một tin nhắn giao thức. */
export type MucHienThi =
  | { kieu: 'nguoi'; text: string; anh?: string[] }
  | { kieu: 'may'; text: string }
  | { kieu: 'tool'; ten: string; tomTat: string; vong: 'may' | 'notes' }
  /**
   * Thẻ duyệt nằm NGAY TRONG dòng thời gian hội thoại, không phải hộp thoại
   * nổi. Hộp thoại nổi che mất đoạn agent vừa giải thích lý do nó muốn sửa —
   * mà đó chính là thứ người dùng cần đọc để quyết định.
   *
   * `xong` giữ lại sau khi đã trả lời để lịch sử còn thấy "chỗ này đã duyệt /
   * đã từ chối", thay vì thẻ biến mất không dấu vết.
   */
  | { kieu: 'xinPhep'; the: TheXinPhep; xong?: 'dongY' | 'tuChoi' }
  /** Thẻ duyệt LỆNH. Khác thẻ sửa file: hiện chuỗi lệnh + lý do nguy hiểm. */
  | { kieu: 'xinPhepLenh'; id: string; lenh: string; phanLoai: AgentPhanLoaiLenh; xong?: 'dongY' | 'tuChoi' }
  | { kieu: 'xinPhepMcp'; id: string; server: string; tool: string; args: string; xong?: 'dongY' | 'tuChoi' }
  | { kieu: 'xinPhepGit'; id: string; viec: 'commit' | 'pr'; chiTiet: string; xong?: 'dongY' | 'tuChoi' }
  /**
   * Đầu ra lệnh, gom dần khi lệnh còn đang chạy.
   *
   * Là MỘT mục nối thêm chứ không phải mỗi mẩu một mục: `npm test` nhả ra hàng
   * nghìn mẩu, mỗi mẩu một phần tử thì React dựng lại hàng nghìn nút và màn
   * hình giật cứng.
   */
  | { kieu: 'lenhRa'; text: string }
  | { kieu: 'loi'; text: string; ma?: string };

/**
 * Gộp một mẩu chữ vào bảng ghi.
 *
 * Chữ về theo delta hàng chục lần mỗi giây, và giữa hai đợt chữ có thể chen một
 * dòng công cụ. Luật: mục CUỐI là chữ của máy thì nối vào; không thì mở mục
 * mới. Chính luật một dòng này tạo ra nhịp chữ → công cụ → chữ mà Claude Code
 * hiển thị — không cần cờ trạng thái nào riêng.
 *
 * Tách khỏi hook để kiểm được bằng test: đây là chỗ dễ sai nhất của cả màn hình
 * (nối nhầm thì mọi câu trả lời dính liền thành một khối), mà lại là chỗ mắt
 * thường khó soi ra vì nó chỉ hỏng khi có công cụ chen vào giữa.
 */
export function gopChu(truoc: MucHienThi[], delta: string): MucHienThi[] {
  const cuoi = truoc[truoc.length - 1];
  if (cuoi?.kieu === 'may') {
    return [...truoc.slice(0, -1), { kieu: 'may', text: cuoi.text + delta }];
  }
  return [...truoc, { kieu: 'may', text: delta }];
}

export interface TrangThaiAgent {
  muc: MucHienThi[];
  /** Đang chạy — bật con quay và đổi nút Gửi thành Dừng. */
  dangChay: boolean;
  /**
   * Đang chạy NHƯNG chưa có chữ nào. Đo được: có khoảng 10 giây im lặng giữa
   * lúc bắt đầu và khung nội dung đầu tiên, vì model đang nghĩ xem gọi tool
   * nào. Không có cờ này thì màn hình đứng im và người dùng tưởng app treo.
   */
  dangNghi: boolean;
  hanMuc: AgentQuota | null;
  tienPhien: number;
  /** Kế hoạch agent công bố. Rỗng = việc này không cần kế hoạch. */
  keHoach: AgentViec[];
  /** Số file agent đã sửa trong việc này — để bật/tắt nút Hoàn tác. */
  soFileDaSua: number;
  /** Ngữ cảnh đã dùng tới đâu. `null` = chưa chạy lượt nào nên chưa biết. */
  nguCanh: AgentNguCanh | null;
}

/**
 * Một cuộc hội thoại (một tab).
 *
 * ⚠️ MỖI tab gọi hook này, nên MỌI tab cùng nghe kênh `agent:event`. Sự kiện
 * mang `cuocId` và hook LỌC theo nó — thiếu bước lọc thì chữ của tab đang chạy
 * chảy vào bảng ghi của mọi tab khác, và không có gì báo lỗi cả.
 */
export function useAgent(cuocId: string, info: AgentInfo | null) {
  const [muc, datMuc] = useState<MucHienThi[]>([]);
  const [dangChay, datDangChay] = useState(false);
  const [dangNghi, datDangNghi] = useState(false);
  const [hanMuc, datHanMuc] = useState<AgentQuota | null>(null);
  const [tienPhien, datTienPhien] = useState(0);
  const [soFileDaSua, datSoFileDaSua] = useState(0);
  const [keHoach, datKeHoach] = useState<AgentViec[]>([]);
  const [nguCanh, datNguCanh] = useState<AgentNguCanh | null>(null);

  // Hạn mức ban đầu lấy từ `getInfo`; sau đó mỗi khung `xong` tự cập nhật, nên
  // KHÔNG cần gọi lại `/usage` — gọi lại là thêm một round-trip cho một con số
  // máy chủ vừa gửi kèm rồi.
  useEffect(() => {
    if (info?.quota) datHanMuc(info.quota);
  }, [info]);

  /**
   * Dựng lại bảng ghi từ main mỗi lần component được GẮN.
   *
   * Không phải chuyện "cho tiện": React tháo cả trang này khi người dùng đổi
   * route (xem `Content()` trong `App.tsx`), nên `muc` ở đây mất sạch dù hội
   * thoại trong main còn nguyên. Không dựng lại thì màn hình nói dối — nó bảo
   * cuộc này trống trong khi agent vẫn nhớ đủ, và câu trả lời tiếp theo sẽ nhắc
   * tới những thứ người dùng không còn thấy trên màn hình.
   *
   * Cũng nhờ đó mà quay lại giữa lúc một lượt đang chạy vẫn thấy được các bước
   * đã đi; phần chữ đang chảy dở thì hiện nốt khi lượt kết thúc.
   */
  useEffect(() => {
    let huy = false;
    void (async () => {
      const cu = await window.cuongthai?.agent.bangGhi(cuocId);
      if (huy || !cu) return;
      // CHỈ nạp khi đang trống. Sự kiện trực tiếp có thể tới trước lời gọi này
      // trả về, và đè lên chúng bằng ảnh chụp cũ là xoá đúng phần mới nhất.
      if (cu.muc.length) datMuc((truoc) => (truoc.length > 0 ? truoc : cu.muc.map(doiSangMuc)));
      // Lượt vẫn đang chạy ở main ⇒ nút phải là Dừng, và con quay phải quay.
      if (cu.dangChay) { datDangChay(true); datDangNghi(true); }
    })();
    return () => { huy = true; };
  }, [cuocId]);

  const themChu = useCallback((delta: string) => {
    datMuc((truoc) => gopChu(truoc, delta));
  }, []);

  // Gắn listener MỘT LẦN cho cả vòng đời trang. Gắn/gỡ theo `dangChay` sẽ bỏ lỡ
  // những khung đến đúng lúc React đang dựng lại — và khung đầu tiên (`batDau`)
  // đến sau chưa tới 100ms.
  useEffect(() => {
    const cau = window.cuongthai;
    if (!cau) return;

    return cau.on('agent:event', (payload) => {
      const e = payload as AgentUiEvent;
      if (e.cuocId !== cuocId) return; // sự kiện của tab khác
      switch (e.loai) {
        case 'batDau':
          datDangNghi(true);
          break;
        case 'chu':
          datDangNghi(false);
          themChu(e.delta);
          break;
        case 'tool':
          datDangNghi(false);
          datMuc((truoc) => [...truoc, { kieu: 'tool', ten: e.ten, tomTat: e.tomTat, vong: e.vong }]);
          break;
        case 'xinPhep':
          // Tắt con quay: agent KHÔNG còn đang nghĩ, nó đang chờ NGƯỜI DÙNG.
          // Để con quay quay tiếp thì người dùng ngồi đợi một thứ đang đợi họ.
          datDangNghi(false);
          datMuc((truoc) => [...truoc, {
            kieu: 'xinPhep',
            the: { id: e.id, ten: e.ten, duongDan: e.duongDan, taoMoi: e.taoMoi, diff: e.diff },
          }]);
          break;
        case 'xinPhepLenh':
          datDangNghi(false);
          datMuc((truoc) => [...truoc, {
            kieu: 'xinPhepLenh', id: e.id, lenh: e.lenh, phanLoai: e.phanLoai,
          }]);
          break;
        case 'xinPhepMcp':
          datDangNghi(false);
          datMuc((truoc) => [...truoc, {
            kieu: 'xinPhepMcp', id: e.id, server: e.server, tool: e.tool, args: e.args,
          }]);
          break;
        case 'xinPhepGit':
          datDangNghi(false);
          datMuc((truoc) => [...truoc, {
            kieu: 'xinPhepGit', id: e.id, viec: e.viec, chiTiet: e.chiTiet,
          }]);
          break;
        case 'lenhRa':
          datMuc((truoc) => {
            const cuoi = truoc[truoc.length - 1];
            if (cuoi?.kieu === 'lenhRa') {
              // Trần hiển thị: giữ đuôi. Đầu ra lệnh thì phần CUỐI là phần đang
              // xảy ra, và đó là thứ người dùng đang nhìn.
              const gop = (cuoi.text + e.mau).slice(-20_000);
              return [...truoc.slice(0, -1), { kieu: 'lenhRa', text: gop }];
            }
            return [...truoc, { kieu: 'lenhRa', text: e.mau }];
          });
          break;
        case 'xongXinPhep':
          datMuc((truoc) => truoc.map((m) =>
            (m.kieu === 'xinPhep' && m.the.id === e.id)
            || (m.kieu === 'xinPhepLenh' && m.id === e.id)
            || (m.kieu === 'xinPhepMcp' && m.id === e.id)
            || (m.kieu === 'xinPhepGit' && m.id === e.id)
              ? { ...m, xong: e.dongY ? 'dongY' : 'tuChoi' }
              : m,
          ));
          // Trả lời xong thì agent chạy tiếp ⇒ bật lại con quay.
          if (e.dongY) datDangNghi(true);
          break;
        case 'keHoach':
          // THAY THẾ, không nối thêm: agent luôn gửi TOÀN BỘ danh sách. Nối thêm
          // thì mỗi lần cập nhật trạng thái lại nhân đôi số việc.
          datKeHoach(e.viec);
          break;
        case 'xong':
          if (e.nguCanh) datNguCanh(e.nguCanh);
          if (e.hanMuc) datHanMuc(e.hanMuc);
          datTienPhien((t) => t + e.tienUsd);
          datSoFileDaSua(e.soFileDaSua);
          break;
        case 'loi':
          datDangNghi(false);
          datMuc((truoc) => [...truoc, { kieu: 'loi', text: e.thongDiep, ...(e.ma ? { ma: e.ma } : {}) }]);
          break;
        case 'huy':
          datDangNghi(false);
          datMuc((truoc) => [...truoc, { kieu: 'loi', text: 'Đã dừng theo yêu cầu.', ma: 'CANCELLED' }]);
          break;
      }
    });
  }, [themChu, cuocId]);

  /** Việc đã lưu + phiên đang mở. Nạp lại sau mỗi lượt để danh sách luôn đúng. */
  const [phien, datPhien] = useState<AgentPhien[]>([]);
  const [phienDangMo, datPhienDangMo] = useState<string | null>(null);

  const napPhien = useCallback(async () => {
    const ds = await window.cuongthai?.agent.dsPhien();
    if (ds) datPhien(ds);
  }, []);

  useEffect(() => { void napPhien(); }, [napPhien]);

  const moPhien = useCallback(async (id: string) => {
    const kq = await window.cuongthai?.agent.moPhien(cuocId, id);
    if (!kq) return;

    // Bảng ghi khôi phục ĐƠN GIẢN hơn bản gốc (không có thẻ duyệt kèm diff) —
    // xem `dungLaiHienThi` ở main. Nói rõ ra bằng một dòng, thay vì để người
    // dùng tự hỏi vì sao lịch sử trông khác lúc họ đang chạy.
    datMuc([
      ...kq.muc.map(doiSangMuc),
      { kieu: 'loi', ma: 'KHOI_PHUC', text: 'Đã mở lại việc này. Gõ tiếp là agent đi tiếp từ đúng chỗ đó.' },
    ]);
    datPhienDangMo(id);
    datTienPhien(0);
    datSoFileDaSua(0);
    datKeHoach([]);
    datNguCanh(null);
  }, [cuocId]);

  const xoaPhien = useCallback(async (id: string) => {
    await window.cuongthai?.agent.xoaPhien(id);
    if (id === phienDangMo) { datMuc([]); datPhienDangMo(null); }
    await napPhien();
  }, [phienDangMo, napPhien]);

  /** Chặn gửi hai lần khi người dùng bấm nhanh — React chưa kịp vẽ lại nút. */
  const dangGui = useRef(false);

  const gui = useCallback(async (text: string, anh?: string[]) => {
    const cau = window.cuongthai;
    if (!cau || dangGui.current) return;
    dangGui.current = true;

    datMuc((truoc) => [...truoc, { kieu: 'nguoi', text, ...(anh?.length ? { anh } : {}) }]);
    datDangChay(true);
    datDangNghi(true);
    try {
      await cau.agent.send(cuocId, text, anh);
    } catch (err) {
      datMuc((truoc) => [...truoc, { kieu: 'loi', text: (err as Error).message }]);
    } finally {
      dangGui.current = false;
      datDangChay(false);
      datDangNghi(false);
      // Main lưu phiên ở `finally` của mỗi lượt, nên danh sách chỉ đúng SAU khi
      // lượt kết thúc. Nạp lại ở đây thay vì theo đồng hồ.
      void napPhien();
    }
  }, [napPhien, cuocId]);

  const dung = useCallback(() => {
    void window.cuongthai?.agent.cancel(cuocId);
  }, [cuocId]);

  const batDauLai = useCallback(async () => {
    await window.cuongthai?.agent.reset(cuocId);
    datMuc([]);
    datTienPhien(0);
    datSoFileDaSua(0);
    datKeHoach([]);
    datNguCanh(null);
    datDangChay(false);
    datDangNghi(false);
    datPhienDangMo(null);
  }, [cuocId]);

  /**
   * Trả lời thẻ duyệt.
   *
   * KHÔNG tự đánh dấu thẻ là đã xong ở đây — chờ khung `xongXinPhep` từ main.
   * Đánh dấu ngay ở phía giao diện thì một thẻ đã hết giờ 5 phút vẫn hiện ra
   * "đã duyệt" trong khi main đã từ chối nó từ lâu, và người dùng tin vào một
   * thay đổi chưa bao giờ được ghi.
   */
  const traLoiXinPhep = useCallback((id: string, quyetDinh: AgentQuyetDinh) => {
    void window.cuongthai?.agent.traLoiXinPhep(cuocId, id, quyetDinh);
  }, [cuocId]);

  const hoanTac = useCallback(async (): Promise<{ soFile: number; loi: string[] } | null> => {
    const kq = await window.cuongthai?.agent.hoanTac(cuocId);
    if (!kq) return null;
    datSoFileDaSua(0);
    datDangChay(false);
    datDangNghi(false);
    datMuc((truoc) => [...truoc, {
      kieu: 'loi',
      ma: 'HOAN_TAC',
      text: kq.loi.length
        ? `Đã hoàn tác ${kq.soFile} file. Không hoàn tác được: ${kq.loi.join(' · ')}`
        : `Đã trả ${kq.soFile} file về nguyên trạng.`,
    }]);
    return kq;
  }, [cuocId]);

  return {
    trangThai: { muc, dangChay, dangNghi, hanMuc, tienPhien, soFileDaSua, keHoach, nguCanh } satisfies TrangThaiAgent,
    gui,
    dung,
    batDauLai,
    traLoiXinPhep,
    hoanTac,
    phien,
    phienDangMo,
    moPhien,
    xoaPhien,
  };
}

/** Nạp thông tin agent + thư mục. Trả về cả hàm nạp lại cho nút "Thử lại". */
/**
 * Thông tin TOÀN CỤC của agent: có Pro không, hạn mức còn bao nhiêu.
 *
 * ⚠️ KHÔNG còn giữ thư mục dự án. Thư mục là của TỪNG TAB (xem `useThuMuc`) —
 * để ở đây thì mọi tab dùng chung một thư mục, và "tab A làm project A, tab B
 * làm project B" là chuyện không thể dù giao diện có nhiều tab.
 */
export function useAgentInfo() {
  const [info, datInfo] = useState<AgentInfo | null>(null);
  const [dangTai, datDangTai] = useState(true);

  const nap = useCallback(async () => {
    const cau = window.cuongthai;
    if (!cau) { datDangTai(false); return; }
    datDangTai(true);
    datInfo(await cau.agent.getInfo());
    datDangTai(false);
  }, []);

  useEffect(() => { void nap(); }, [nap]);

  return { info, dangTai, nap };
}

/** Thư mục dự án + hai cờ quyền của MỘT tab. Mỗi tab một bộ riêng. */
export function useThuMuc(cuocId: string) {
  const [thuMuc, datThuMuc] = useState<AgentWorkspace | null>(null);

  const napThuMuc = useCallback(async () => {
    const w = await window.cuongthai?.agent.getWorkspace(cuocId);
    if (w) datThuMuc(w);
  }, [cuocId]);

  useEffect(() => { void napThuMuc(); }, [napThuMuc]);

  return { thuMuc, datThuMuc, napThuMuc };
}

/**
 * Mục khôi phục (từ main) → mục bảng ghi (của màn hình).
 *
 * Bản khôi phục CỐ Ý nghèo hơn bản lúc chạy: không có thẻ duyệt kèm diff. Diff
 * không nằm trong bản lưu, và dựng lại nó nghĩa là đọc file HÔM NAY — cho ra
 * một cái diff không phải cái người dùng đã duyệt. Một dòng công cụ nói đúng
 * sự thật thì tốt hơn một cái thẻ nói sai.
 */
function doiSangMuc(m: AgentMucKhoiPhuc): MucHienThi {
  return m.kieu === 'tool'
    ? { kieu: 'tool', ten: m.ten, tomTat: m.tomTat, vong: 'may' }
    : m;
}
