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
import type { AgentInfo, AgentQuota, AgentUiEvent, AgentWorkspace } from '../../../shared/ipc';

/** Một mục trên màn hình. Không phải một tin nhắn giao thức. */
export type MucHienThi =
  | { kieu: 'nguoi'; text: string }
  | { kieu: 'may'; text: string }
  | { kieu: 'tool'; ten: string; tomTat: string; vong: 'may' | 'notes' }
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
}

export function useAgent(info: AgentInfo | null) {
  const [muc, datMuc] = useState<MucHienThi[]>([]);
  const [dangChay, datDangChay] = useState(false);
  const [dangNghi, datDangNghi] = useState(false);
  const [hanMuc, datHanMuc] = useState<AgentQuota | null>(null);
  const [tienPhien, datTienPhien] = useState(0);

  // Hạn mức ban đầu lấy từ `getInfo`; sau đó mỗi khung `xong` tự cập nhật, nên
  // KHÔNG cần gọi lại `/usage` — gọi lại là thêm một round-trip cho một con số
  // máy chủ vừa gửi kèm rồi.
  useEffect(() => {
    if (info?.quota) datHanMuc(info.quota);
  }, [info]);

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
        case 'xong':
          if (e.hanMuc) datHanMuc(e.hanMuc);
          datTienPhien((t) => t + e.tienUsd);
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
  }, [themChu]);

  /** Chặn gửi hai lần khi người dùng bấm nhanh — React chưa kịp vẽ lại nút. */
  const dangGui = useRef(false);

  const gui = useCallback(async (text: string) => {
    const cau = window.cuongthai;
    if (!cau || dangGui.current) return;
    dangGui.current = true;

    datMuc((truoc) => [...truoc, { kieu: 'nguoi', text }]);
    datDangChay(true);
    datDangNghi(true);
    try {
      await cau.agent.send(text);
    } catch (err) {
      datMuc((truoc) => [...truoc, { kieu: 'loi', text: (err as Error).message }]);
    } finally {
      dangGui.current = false;
      datDangChay(false);
      datDangNghi(false);
    }
  }, []);

  const dung = useCallback(() => {
    void window.cuongthai?.agent.cancel();
  }, []);

  const batDauLai = useCallback(async () => {
    await window.cuongthai?.agent.reset();
    datMuc([]);
    datTienPhien(0);
    datDangChay(false);
    datDangNghi(false);
  }, []);

  return {
    trangThai: { muc, dangChay, dangNghi, hanMuc, tienPhien } satisfies TrangThaiAgent,
    gui,
    dung,
    batDauLai,
  };
}

/** Nạp thông tin agent + thư mục. Trả về cả hàm nạp lại cho nút "Thử lại". */
export function useAgentInfo() {
  const [info, datInfo] = useState<AgentInfo | null>(null);
  const [thuMuc, datThuMuc] = useState<AgentWorkspace | null>(null);
  const [dangTai, datDangTai] = useState(true);

  const nap = useCallback(async () => {
    const cau = window.cuongthai;
    if (!cau) { datDangTai(false); return; }
    datDangTai(true);
    const [i, w] = await Promise.all([cau.agent.getInfo(), cau.agent.getWorkspace()]);
    datInfo(i);
    datThuMuc(w);
    datDangTai(false);
  }, []);

  useEffect(() => { void nap(); }, [nap]);

  return { info, thuMuc, datThuMuc, dangTai, nap };
}
