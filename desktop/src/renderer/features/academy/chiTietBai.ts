/**
 * ============================================================
 * CHI TIẾT MỘT BÀI HỌC — thứ app desktop vẫn còn thiếu
 * ============================================================
 *
 * Người dùng 15/09/2026: *"trên app desktop đăng sơ sài"*.
 *
 * Đo ra đúng chỗ sơ sài: app chỉ dùng dữ liệu đi kèm `/courses/:slug`, tức
 * danh sách bài với `content`. Web thì gọi thêm `/courses/:id/lessons/:baiId`,
 * và endpoint đó trả về những thứ app CHƯA BAO GIỜ hiện:
 *
 *   • `teachingNotes` — phần GIẢNG SÂU của bài, thường dài hơn `content`
 *   • `quizData`      — đề của bài dạng QUIZ (app đang hiện trang trắng)
 *   • `videoTracks`   — ba luồng video VI / EN / YouTube (app chỉ chơi một)
 *   • `documents`     — tài liệu kèm bài, có cả PDF bài tập / lời giải
 *
 * Nên không phải app thiếu tính năng — nó thiếu MỘT LỜI GỌI.
 *
 * ⚠️ TRỘN CHỒNG LÊN, KHÔNG THAY HẲN. Dữ liệu đi kèm khoá đã đủ để vẽ ngay
 * (tên bài, `content`), còn lời gọi này mất vài trăm mili giây. Thay hẳn là
 * bài nhấp nháy trống rồi mới hiện; trộn chồng thì người đọc thấy chữ ngay,
 * phần sâu hiện thêm khi về tới.
 */
import { useEffect, useState } from 'react';

export interface LuongVideo {
  key: string;
  url: string;
  platform?: string | null;
  label?: string | null;
  credit?: string | null;
}

export interface TaiLieuBai {
  id: number;
  title?: string | null;
  fileUrl?: string | null;
  url?: string | null;
  fileType?: string | null;
  fileName?: string | null;
}

export interface ChiTietBai {
  content?: string | null;
  teachingNotes?: string | null;
  quizData?: unknown;
  videoUrl?: string | null;
  videoPlatform?: string | null;
  videoTracks?: LuongVideo[] | null;
  defaultVideoTrack?: string | null;
  sourceCodeUrl?: string | null;
  documents?: TaiLieuBai[] | null;
  lessonType?: string | null;
}

/**
 * Cách gọi API, truyền từ chỗ dùng vào.
 *
 * Nhận hàm thay vì import thẳng `api`: `useSession()` mới là nơi giữ client đã
 * gắn token, và một hook tự đi lấy client sẽ khó kiểm hơn hẳn.
 */
export interface TuyChonGoi {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /**
   * ⚠️ ĐƯA OBJECT VÀO, ĐỪNG `JSON.stringify` TRƯỚC. `api.request` tự tuần tự
   * hoá; stringify trước là mã hoá HAI LẦN, máy chủ nhận một chuỗi thay vì
   * object nên mọi trường đều `undefined` và nó trả 400.
   *
   * Và hỏng kiểu đó KHÔNG thấy được: giao diện đã tick lạc quan từ trước,
   * `catch` lặng lẽ trả lại, người dùng chỉ thấy dấu tick của mình tự biến mất
   * vài giây sau. Xem chú thích cùng nội dung ở `DashboardPage.tsx`.
   */
  body?: unknown;
}

type Goi = <T>(duong: string, tuyChon?: TuyChonGoi) => Promise<T>;

/**
 * Nạp chi tiết bài. Trả `null` khi chưa có (đang tải, hoặc gọi hỏng).
 *
 * KHÔNG ném và KHÔNG hiện lỗi khi hỏng: bài vẫn đọc được bằng dữ liệu đi kèm
 * khoá, nên một lời gọi phụ hỏng không được phép làm hỏng cả trang bài học.
 * Mất mạng giữa buổi học là chuyện thường.
 */
export function useChiTietBai(goi: Goi | null, monId: number | null, baiId: number | null) {
  const [ct, datCt] = useState<ChiTietBai | null>(null);

  useEffect(() => {
    datCt(null);   // đổi bài ⇒ vứt chi tiết cũ NGAY, đừng để nó hiện nhầm sang bài mới
    if (!goi || !monId || !baiId) return undefined;
    let con = true;
    void goi<ChiTietBai>(`/api/v1/courses/${monId}/lessons/${baiId}`)
      .then((r) => { if (con && r && typeof r === 'object') datCt(r); })
      .catch(() => { /* xem chú thích trên */ });
    return () => { con = false; };
  }, [goi, monId, baiId]);

  return ct;
}

/** Bài này có phải dạng làm bài trắc nghiệm không. */
export function laBaiQuiz(loai?: string | null): boolean {
  return String(loai ?? '').toUpperCase() === 'QUIZ';
}

/**
 * Tài liệu PDF kèm bài — để nhúng trình đọc ngay trong bài.
 *
 * Nhận diện bằng CẢ `fileType` lẫn đuôi tên file: `fileType` do máy chủ suy ra
 * lúc tải lên và có tài liệu cũ để trống, còn tên file thì luôn có.
 */
export function locPdf(ds?: TaiLieuBai[] | null): TaiLieuBai[] {
  return (ds ?? []).filter((d) => {
    const loai = String(d.fileType ?? '').toLowerCase();
    const ten = String(d.fileName ?? d.title ?? '').toLowerCase();
    return loai.includes('pdf') || ten.endsWith('.pdf');
  });
}

/**
 * Đường tải tài liệu, dạng TUYỆT ĐỐI.
 *
 * ⚠️ Web dùng `/api/v1/courses/documents/:id/download` — đường tương đối, và
 * trên web nó trúng cùng origin nên chạy. Trong app, origin là
 * `app://cuongthai`, nên đường đó bay vào một nơi không tồn tại và trình đọc
 * PDF hiện khung trắng KHÔNG báo lỗi. Cùng cái bẫy đã cắn `CourseTutor`.
 */
export function duongTaiLieu(goc: string, id: number): string {
  return `${goc.replace(/\/+$/, '')}/api/v1/courses/documents/${id}/download`;
}

/* ============================================================
 * TIẾN ĐỘ HỌC
 * ============================================================
 *
 * App desktop trước bản này KHÔNG theo dõi tiến độ gì cả: học xong một bài
 * không có gì ghi lại, danh sách bài không có dấu tick, và thanh "% hoàn
 * thành" của web thì app không có. Người dùng học trên app rồi mở web sẽ thấy
 * 0% — như thể buổi học vừa rồi không tồn tại.
 *
 * Tiến độ là dữ liệu CHUNG với web (cùng bảng `lessonProgress`), nên chỉ cần
 * gọi đúng hai endpoint là hai bên khớp nhau ngay.
 */

export interface TienDoBai {
  lessonId: number;
  isCompleted?: boolean | null;
}

export function useTienDo(goi: Goi | null, monId: number | null) {
  const [xong, datXong] = useState<Set<number>>(() => new Set());
  const [dangGhi, datDangGhi] = useState(false);

  useEffect(() => {
    datXong(new Set());
    if (!goi || !monId) return undefined;
    let con = true;
    void goi<TienDoBai[]>(`/api/v1/courses/${monId}/progress`)
      .then((r) => {
        if (!con || !Array.isArray(r)) return;
        datXong(new Set(r.filter((x) => x?.isCompleted).map((x) => x.lessonId)));
      })
      .catch(() => { /* chưa ghi danh thì không có tiến độ — không phải lỗi */ });
    return () => { con = false; };
  }, [goi, monId]);

  /**
   * Đánh dấu một bài đã học xong.
   *
   * ⚠️ CẬP NHẬT GIAO DIỆN TRƯỚC rồi mới gọi máy chủ, và TRẢ LẠI khi hỏng.
   * Lời gọi mất vài trăm mili giây; chờ nó xong mới tick thì người dùng bấm
   * rồi tưởng nút chết và bấm thêm lần nữa.
   */
  const danhDau = async (baiId: number, roi = true): Promise<void> => {
    if (!goi || !monId || dangGhi) return;
    datDangGhi(true);
    datXong((cu) => {
      const m = new Set(cu);
      if (roi) m.add(baiId); else m.delete(baiId);
      return m;
    });
    try {
      await goi(`/api/v1/courses/${monId}/progress`, {
        method: 'POST',
        body: { lessonId: baiId, isCompleted: roi },   // KHÔNG stringify — xem `TuyChonGoi.body`
      });
    } catch {
      datXong((cu) => {
        const m = new Set(cu);
        if (roi) m.delete(baiId); else m.add(baiId);
        return m;
      });
    } finally {
      datDangGhi(false);
    }
  };

  return { xong, danhDau, dangGhi };
}

/* ============================================================
 * CHỨNG CHỈ
 * ============================================================
 *
 * Máy chủ CẤP chứng chỉ ngay khi người học chạm 100% (xem `POST /:id/progress`
 * — nó tạo `Certificate` ngay trong cùng lời gọi). Web hiện tấm băng chúc mừng
 * kèm nút xem chứng chỉ và đổi mã giảm 10%; app thì trước bản này không có gì,
 * nên người học xong cả khoá trên app cũng không biết mình đã có chứng chỉ.
 */

export interface ChungChi {
  id: number;
  certificateNumber: string;
}

export function useChungChi(goi: Goi | null, monId: number | null, daXongHet: boolean) {
  const [cc, datCc] = useState<ChungChi | null>(null);

  useEffect(() => {
    datCc(null);
    /* Chỉ hỏi khi ĐÃ xong hết: endpoint trả 404 khi chưa có, và gọi nó ở mọi
       lần mở môn là mỗi màn hình đẻ một lỗi 404 trong log của máy chủ. */
    if (!goi || !monId || !daXongHet) return undefined;
    let con = true;
    void goi<ChungChi>(`/api/v1/certificates/course/${monId}`)
      .then((r) => { if (con && r?.certificateNumber) datCc(r); })
      .catch(() => { /* 404 = chưa được cấp; không phải lỗi để báo */ });
    return () => { con = false; };
  }, [goi, monId, daXongHet]);

  /** Đổi mã giảm 10%. Máy chủ làm việc này idempotent nên bấm lại vẫn ra mã cũ. */
  const doiMa = async (): Promise<string | null> => {
    if (!goi || !cc) return null;
    try {
      const r = await goi<{ code?: string }>(`/api/v1/certificates/${cc.id}/redeem`, { method: 'POST' });
      return r?.code ?? null;
    } catch {
      return null;
    }
  };

  return { chungChi: cc, doiMa };
}
