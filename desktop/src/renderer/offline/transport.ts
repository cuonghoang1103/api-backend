/**
 * Nối hàng đợi đồng bộ với API thật.
 *
 * Đây là chỗ dịch từ "một việc trong hàng đợi" sang "một lời gọi HTTP", và dịch
 * ngược từ mã lỗi HTTP sang quyết định thử-lại-hay-không. Hai chiều đều dễ sai:
 *
 *   • Dịch xuôi sai → gọi nhầm endpoint, dữ liệu vào nhầm chỗ.
 *   • Dịch ngược sai → hoặc thử lại vĩnh viễn thứ không bao giờ thành công,
 *     hoặc bỏ cuộc với thứ chỉ cần đợi mạng.
 *
 * ĐĂNG KÝ ENDPOINT là danh sách đóng. Một `entityType` không có trong bảng sẽ bị
 * từ chối thẳng thay vì đoán ra một URL — đoán URL nghĩa là gửi dữ liệu người
 * dùng tới một địa chỉ không ai kiểm chứng.
 */
import { ApiError, type ApiClient } from '../api/client';
import type { SyncRecord } from './db';
import type { Transport, TransportResult } from './sync-queue';

/**
 * Bảng ánh xạ entityType → endpoint.
 *
 * ⚠️ Chỉ được thêm vào đây những thao tác mà GỬI LẠI VẪN ĐÚNG. Backend không đọc
 * header `Idempotency-Key` (chỉ luồng thanh toán có idempotency, và nó đọc từ
 * thân request), nên nếu máy chủ ghi xong mà phản hồi lạc đường thì lần thử lại
 * sẽ ghi lần hai.
 *
 *   ✓ `update` — ghi cùng nội dung hai lần vẫn ra một trạng thái
 *   ✓ `delete` — xoá thứ đã xoá là no-op
 *   ✗ `create` cho thứ mà bản sao là sai (tin nhắn, bài đăng) — KHÔNG đưa vào.
 *     Giữ dạng nháp cục bộ, để người dùng tự bấm gửi khi có mạng.
 */
interface EndpointSpec {
  update?: (entityId: string) => { path: string; method: 'PUT' | 'PATCH' };
  delete?: (entityId: string) => { path: string; method: 'DELETE' };
  create?: (entityId: string) => { path: string; method: 'POST' };
}

const ENDPOINTS: Record<string, EndpointSpec> = {
  // CV Builder. Đường dẫn đối chiếu với `src/routes/cvBuilder.routes.ts`, mount
  // tại `/api/v1/cv` (src/index.ts:582), ngày 16/08/2026.
  //
  // Lưu ý CV Builder KHÔNG có endpoint kiểu `/cv/:id` — nó là API hồ sơ có cấu
  // trúc: một profile duy nhất cho mỗi người dùng, cộng các bộ sưu tập con
  // (items, skills, certifications, languages).

  /** `PUT /cv/profile` ghi đè toàn bộ hồ sơ — gửi hai lần ra cùng kết quả. */
  'cv-profile': {
    update: () => ({ path: '/api/v1/cv/profile', method: 'PUT' }),
  },

  /**
   * Ghi chú. `PATCH /notes/:id` ghi đè các trường gửi lên nên gửi lại hai lần
   * vẫn ra một trạng thái — an toàn để xếp hàng.
   *
   * KHÔNG có `create`: `POST /notes` sinh ghi chú mới mỗi lần gọi, và một lần
   * thử lại sau timeout sẽ nhân đôi ghi chú của người dùng.
   */
  note: {
    update: (id) => ({ path: `/api/v1/notes/notes/${id}`, method: 'PATCH' }),
    delete: (id) => ({ path: `/api/v1/notes/notes/${id}`, method: 'DELETE' }),
  },

  'cv-item': {
    update: (id) => ({ path: `/api/v1/cv/items/${id}`, method: 'PUT' }),
    delete: (id) => ({ path: `/api/v1/cv/items/${id}`, method: 'DELETE' }),
    // KHÔNG có `create`: `POST /cv/items` sinh bản ghi mới mỗi lần gọi. Không
    // có idempotency phía máy chủ thì một lần thử lại sau timeout sẽ tạo mục
    // trùng trong CV của người dùng.
  },

  'cv-skill': {
    update: (id) => ({ path: `/api/v1/cv/skills/${id}`, method: 'PUT' }),
    delete: (id) => ({ path: `/api/v1/cv/skills/${id}`, method: 'DELETE' }),
  },

  'cv-certification': {
    update: (id) => ({ path: `/api/v1/cv/certifications/${id}`, method: 'PUT' }),
    delete: (id) => ({ path: `/api/v1/cv/certifications/${id}`, method: 'DELETE' }),
  },

  'cv-language': {
    update: (id) => ({ path: `/api/v1/cv/languages/${id}`, method: 'PUT' }),
    delete: (id) => ({ path: `/api/v1/cv/languages/${id}`, method: 'DELETE' }),
  },
};

export function makeTransport(api: ApiClient): Transport {
  return async (record: SyncRecord): Promise<TransportResult> => {
    const spec = ENDPOINTS[record.entityType];
    if (!spec) {
      return {
        outcome: 'rejected',
        message: `Không có endpoint cho loại "${record.entityType}".`,
      };
    }

    const builder = spec[record.operationType];
    if (!builder) {
      return {
        outcome: 'rejected',
        message: `Thao tác "${record.operationType}" chưa được hỗ trợ đồng bộ cho "${record.entityType}".`,
      };
    }

    const { path, method } = builder(record.entityId);

    try {
      await api.request(path, {
        method,
        ...(record.operationType === 'delete' ? {} : { body: record.payload }),
        idempotencyKey: record.idempotencyKey,
      });
      return { outcome: 'confirmed' };
    } catch (error) {
      if (!(error instanceof ApiError)) {
        // Lỗi ngoài dự kiến — coi là tạm thời. Thà thử lại thừa còn hơn vứt
        // dữ liệu người dùng.
        return {
          outcome: 'retry',
          message: error instanceof Error ? error.message : String(error),
        };
      }

      // Dịch phân loại lỗi API sang quyết định của hàng đợi. Đây là chỗ quyết
      // định "thử lại" hay "bỏ cuộc", nên mỗi nhánh phải tường minh.
      switch (error.failure.kind) {
        case 'offline':
        case 'server':
          return { outcome: 'retry', message: error.failure.message };

        case 'conflict':
          return { outcome: 'conflict', message: error.failure.message };

        case 'unauthorized':
          // Phiên chết. KHÔNG phải lỗi của dữ liệu — giữ việc lại và thử lại
          // sau khi đăng nhập lại, thay vì đánh dấu từ chối vĩnh viễn.
          return { outcome: 'retry', message: error.failure.message };

        case 'forbidden':
        case 'rejected':
          return { outcome: 'rejected', message: error.failure.message };
      }
    }
  };
}
