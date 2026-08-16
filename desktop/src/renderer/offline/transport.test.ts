/**
 * Test lớp dịch giữa hàng đợi và API.
 *
 * Đây là chỗ quyết định "thử lại" hay "bỏ cuộc" với dữ liệu người dùng. Dịch
 * sai một nhánh thì hoặc app thử lại vĩnh viễn thứ không bao giờ thành công,
 * hoặc bỏ cuộc với thứ chỉ cần đợi mạng — và cái thứ hai là mất dữ liệu.
 */
import 'fake-indexeddb/auto';
import { describe, expect, it, vi } from 'vitest';
import { ApiError, type ApiClient } from '../api/client';
import type { SyncRecord } from './db';
import { makeTransport } from './transport';

function record(overrides: Partial<SyncRecord> = {}): SyncRecord {
  return {
    id: 1,
    userId: 1,
    operationType: 'update',
    entityType: 'cv-profile',
    entityId: 'me',
    payload: { fullName: 'Cường' },
    createdAt: 0,
    updatedAt: 0,
    retryCount: 0,
    lastError: null,
    status: 'pending',
    idempotencyKey: 'key-1',
    nextAttemptAt: 0,
    ...overrides,
  };
}

/** ApiClient giả — chỉ cần `request`. */
function fakeApi(impl: (path: string, options: unknown) => Promise<unknown>): ApiClient {
  return { request: vi.fn(impl) } as unknown as ApiClient;
}

describe('transport — ánh xạ endpoint', () => {
  it('cv-profile update gọi đúng PUT /api/v1/cv/profile', async () => {
    const calls: { path: string; options: Record<string, unknown> }[] = [];
    const api = fakeApi(async (path, options) => {
      calls.push({ path, options: options as Record<string, unknown> });
      return {};
    });

    const result = await makeTransport(api)(record());

    expect(result).toEqual({ outcome: 'confirmed' });
    expect(calls[0]?.path).toBe('/api/v1/cv/profile');
    expect(calls[0]?.options.method).toBe('PUT');
    expect(calls[0]?.options.body).toEqual({ fullName: 'Cường' });
  });

  it('gắn idempotency key vào lời gọi', async () => {
    let seen: string | undefined;
    const api = fakeApi(async (_path, options) => {
      seen = (options as { idempotencyKey?: string }).idempotencyKey;
      return {};
    });

    await makeTransport(api)(record({ idempotencyKey: 'abc-123' }));

    expect(seen).toBe('abc-123');
  });

  it('delete KHÔNG gửi body', async () => {
    let hadBody = true;
    const api = fakeApi(async (_path, options) => {
      hadBody = 'body' in (options as object);
      return {};
    });

    await makeTransport(api)(
      record({ entityType: 'cv-item', operationType: 'delete', entityId: '42' }),
    );

    expect(hadBody).toBe(false);
  });

  it('entityType lạ bị TỪ CHỐI, không đoán ra URL', async () => {
    const api = fakeApi(async () => ({}));

    const result = await makeTransport(api)(record({ entityType: 'khong-ton-tai' }));

    expect(result.outcome).toBe('rejected');
    // Quan trọng: không hề gọi mạng. Đoán URL nghĩa là gửi dữ liệu người dùng
    // tới một địa chỉ không ai kiểm chứng.
    expect(api.request).not.toHaveBeenCalled();
  });

  it('create cho cv-item bị TỪ CHỐI — backend không có idempotency nên lặp sẽ tạo bản trùng', async () => {
    const api = fakeApi(async () => ({}));

    const result = await makeTransport(api)(
      record({ entityType: 'cv-item', operationType: 'create' }),
    );

    expect(result.outcome).toBe('rejected');
    expect(api.request).not.toHaveBeenCalled();
  });
});

describe('transport — dịch lỗi thành quyết định', () => {
  const cases: {
    ten: string;
    failure: ConstructorParameters<typeof ApiError>[0];
    mong_doi: string;
  }[] = [
    {
      ten: 'mất mạng → thử lại',
      failure: { kind: 'offline', message: 'không nối được' },
      mong_doi: 'retry',
    },
    {
      ten: '5xx → thử lại',
      failure: { kind: 'server', status: 503, message: 'quá tải' },
      mong_doi: 'retry',
    },
    {
      ten: 'phiên hết hạn → thử lại (KHÔNG phải lỗi dữ liệu)',
      failure: { kind: 'unauthorized', message: 'hết hạn' },
      mong_doi: 'retry',
    },
    {
      ten: '409 → xung đột',
      failure: { kind: 'conflict', message: 'bản mới hơn', body: null },
      mong_doi: 'conflict',
    },
    {
      ten: '403 thiếu quyền → từ chối',
      failure: { kind: 'forbidden', message: 'cần Pro' },
      mong_doi: 'rejected',
    },
    {
      ten: '4xx dữ liệu sai → từ chối',
      failure: { kind: 'rejected', status: 422, message: 'email không hợp lệ' },
      mong_doi: 'rejected',
    },
  ];

  for (const c of cases) {
    it(c.ten, async () => {
      const api = fakeApi(async () => {
        throw new ApiError(c.failure);
      });

      const result = await makeTransport(api)(record());

      expect(result.outcome).toBe(c.mong_doi);
    });
  }

  it('lỗi ngoài dự kiến → thử lại, không vứt dữ liệu', async () => {
    const api = fakeApi(async () => {
      throw new TypeError('lỗi lạ');
    });

    const result = await makeTransport(api)(record());

    expect(result.outcome).toBe('retry');
  });
});
