/**
 * Test hàng đợi đồng bộ.
 *
 * Mỗi test ở đây tương ứng với một kiểu mất dữ liệu đã từng xảy ra ở đâu đó
 * trong đời thật: tin nhắn nhân đôi, nháp mất khi hết lượt thử, báo "đã lưu"
 * trong khi máy chủ chưa nhận. Chúng không kiểm "hàm có chạy không" mà kiểm
 * "hàm có làm hỏng dữ liệu người dùng không".
 */
import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from './db';
import {
  enqueue,
  queueCounts,
  retryFailed,
  runSync,
  type Transport,
} from './sync-queue';

const USER = 1;
const OTHER_USER = 2;

beforeEach(async () => {
  await db.queue.clear();
  await db.cache.clear();
});

const confirming: Transport = async () => ({ outcome: 'confirmed' });
const failing: Transport = async () => ({ outcome: 'retry', message: 'mạng lỗi' });

describe('enqueue — gộp trùng', () => {
  it('sửa cùng một thực thể nhiều lần chỉ tạo MỘT việc, giữ nội dung mới nhất', async () => {
    for (let i = 1; i <= 40; i += 1) {
      await enqueue({
        userId: USER,
        operationType: 'update',
        entityType: 'cv',
        entityId: 'cv-1',
        payload: { title: `bản ${i}` },
      });
    }

    const records = await db.queue.toArray();
    expect(records).toHaveLength(1);
    expect(records[0]?.payload).toEqual({ title: 'bản 40' });
  });

  it('giữ nguyên idempotency key khi gộp', async () => {
    await enqueue({
      userId: USER,
      operationType: 'update',
      entityType: 'cv',
      entityId: 'cv-1',
      payload: { v: 1 },
    });
    const first = await db.queue.toArray();
    const key = first[0]?.idempotencyKey;

    await enqueue({
      userId: USER,
      operationType: 'update',
      entityType: 'cv',
      entityId: 'cv-1',
      payload: { v: 2 },
    });
    const second = await db.queue.toArray();

    expect(second[0]?.idempotencyKey).toBe(key);
  });

  it('create rồi update vẫn là create — máy chủ chưa biết thực thể này', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'tmp-1',
      payload: { body: 'a' },
    });
    await enqueue({
      userId: USER,
      operationType: 'update',
      entityType: 'note',
      entityId: 'tmp-1',
      payload: { body: 'b' },
    });

    const records = await db.queue.toArray();
    expect(records).toHaveLength(1);
    expect(records[0]?.operationType).toBe('create');
    expect(records[0]?.payload).toEqual({ body: 'b' });
  });

  it('create rồi delete khi chưa gửi thì huỷ cả hai', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'tmp-1',
      payload: {},
    });
    await enqueue({
      userId: USER,
      operationType: 'delete',
      entityType: 'note',
      entityId: 'tmp-1',
      payload: {},
    });

    expect(await db.queue.count()).toBe(0);
  });

  it('KHÔNG gộp vào việc đang gửi — yêu cầu đã bay lên mạng rồi', async () => {
    const id = await enqueue({
      userId: USER,
      operationType: 'update',
      entityType: 'cv',
      entityId: 'cv-1',
      payload: { v: 1 },
    });
    await db.queue.update(id, { status: 'syncing' });

    await enqueue({
      userId: USER,
      operationType: 'update',
      entityType: 'cv',
      entityId: 'cv-1',
      payload: { v: 2 },
    });

    expect(await db.queue.count()).toBe(2);
  });

  it('tách dữ liệu theo người dùng — hai tài khoản không gộp vào nhau', async () => {
    await enqueue({
      userId: USER,
      operationType: 'update',
      entityType: 'cv',
      entityId: 'cv-1',
      payload: { chu: 'A' },
    });
    await enqueue({
      userId: OTHER_USER,
      operationType: 'update',
      entityType: 'cv',
      entityId: 'cv-1',
      payload: { chu: 'B' },
    });

    expect(await db.queue.count()).toBe(2);
  });
});

describe('runSync — không bao giờ báo thành công giả', () => {
  it('CHỈ đánh dấu synced sau khi máy chủ xác nhận', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: {},
    });

    await runSync({ userId: USER, transport: failing, online: true });
    expect((await db.queue.toArray())[0]?.status).toBe('failed');

    await runSync({ userId: USER, transport: confirming, online: true, now: Date.now() + 10_000 });
    expect((await db.queue.toArray())[0]?.status).toBe('synced');
  });

  it('transport ném lỗi thì coi là tạm thời, KHÔNG mất dữ liệu', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: { quan_trong: true },
    });

    const throwing: Transport = async () => {
      throw new Error('đứt kết nối');
    };
    await runSync({ userId: USER, transport: throwing, online: true });

    const record = (await db.queue.toArray())[0];
    expect(record?.status).toBe('failed');
    expect(record?.payload).toEqual({ quan_trong: true });
    expect(record?.lastError).toContain('đứt kết nối');
  });

  it('ngoại tuyến thì KHÔNG thử gửi và không tăng retryCount', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: {},
    });

    const transport = vi.fn(confirming);
    const summary = await runSync({ userId: USER, transport, online: false });

    expect(transport).not.toHaveBeenCalled();
    expect(summary.attempted).toBe(0);
    expect((await db.queue.toArray())[0]?.retryCount).toBe(0);
  });

  it('máy chủ từ chối vĩnh viễn (4xx) thì KHÔNG thử lại', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: {},
    });

    const rejecting: Transport = async () => ({
      outcome: 'rejected',
      message: 'dữ liệu không hợp lệ',
    });
    await runSync({ userId: USER, transport: rejecting, online: true });

    const record = (await db.queue.toArray())[0];
    expect(record?.status).toBe('rejected');

    // Lượt sau không được đụng tới nó nữa.
    const transport = vi.fn(confirming);
    await runSync({ userId: USER, transport, online: true, now: Date.now() + 10 ** 9 });
    expect(transport).not.toHaveBeenCalled();
  });

  it('backoff giãn dần chứ không thử lại liên tục', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: {},
    });

    await runSync({ userId: USER, transport: failing, online: true });
    const afterFirst = (await db.queue.toArray())[0];
    const firstDelay = (afterFirst?.nextAttemptAt ?? 0) - Date.now();

    // Ngay sau đó chưa tới lượt → transport không được gọi.
    const transport = vi.fn(failing);
    await runSync({ userId: USER, transport, online: true });
    expect(transport).not.toHaveBeenCalled();

    // Sau khi qua mốc backoff thì mới thử lại, và lần chờ kế tiếp phải DÀI HƠN.
    await runSync({
      userId: USER,
      transport: failing,
      online: true,
      now: (afterFirst?.nextAttemptAt ?? 0) + 1,
    });
    const afterSecond = (await db.queue.toArray())[0];
    const secondDelay = (afterSecond?.nextAttemptAt ?? 0) - Date.now();

    expect(afterSecond?.retryCount).toBe(2);
    expect(secondDelay).toBeGreaterThan(firstDelay);
  });

  it('hết lượt thử vẫn GIỮ dữ liệu, không xoá', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: { nguoi_dung_da_go: 'nội dung quan trọng' },
    });

    // Đẩy qua đủ số lần thử.
    for (let i = 0; i < 10; i += 1) {
      await runSync({
        userId: USER,
        transport: failing,
        online: true,
        now: Date.now() + i * 10 ** 8,
      });
    }

    const record = (await db.queue.toArray())[0];
    expect(record).toBeDefined();
    expect(record?.payload).toEqual({ nguoi_dung_da_go: 'nội dung quan trọng' });
  });

  it('xung đột (409) được ghi lại để người dùng xử lý, không tự ghi đè', async () => {
    await enqueue({
      userId: USER,
      operationType: 'update',
      entityType: 'note',
      entityId: 'n1',
      payload: { body: 'bản của tôi' },
    });

    const conflicting: Transport = async () => ({
      outcome: 'conflict',
      message: 'máy chủ có bản mới hơn',
      serverVersion: { body: 'bản của máy chủ' },
    });
    await runSync({ userId: USER, transport: conflicting, online: true });

    const record = (await db.queue.toArray())[0];
    expect(record?.status).toBe('conflict');
    expect(record?.payload).toEqual({ body: 'bản của tôi' });
  });

  it('chỉ đồng bộ việc của ĐÚNG người dùng đang đăng nhập', async () => {
    await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: {},
    });
    await enqueue({
      userId: OTHER_USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n2',
      payload: {},
    });

    const seen: number[] = [];
    const spy: Transport = async (record) => {
      seen.push(record.userId);
      return { outcome: 'confirmed' };
    };
    await runSync({ userId: USER, transport: spy, online: true });

    expect(seen).toEqual([USER]);
  });
});

describe('retryFailed', () => {
  it('đặt lại việc hỏng nhưng KHÔNG đụng việc bị từ chối hay xung đột', async () => {
    const failedId = await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: {},
    });
    const rejectedId = await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n2',
      payload: {},
    });
    await db.queue.update(failedId, { status: 'failed', retryCount: 8 });
    await db.queue.update(rejectedId, { status: 'rejected' });

    const count = await retryFailed(USER);

    expect(count).toBe(1);
    expect((await db.queue.get(failedId))?.status).toBe('pending');
    expect((await db.queue.get(failedId))?.retryCount).toBe(0);
    expect((await db.queue.get(rejectedId))?.status).toBe('rejected');
  });
});

describe('queueCounts', () => {
  it('đếm theo trạng thái và bỏ qua việc đã xong', async () => {
    const a = await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n1',
      payload: {},
    });
    const b = await enqueue({
      userId: USER,
      operationType: 'create',
      entityType: 'note',
      entityId: 'n2',
      payload: {},
    });
    await db.queue.update(a, { status: 'synced' });
    await db.queue.update(b, { status: 'failed' });

    expect(await queueCounts(USER)).toEqual({
      pending: 0,
      syncing: 0,
      failed: 1,
      rejected: 0,
      conflict: 0,
    });
  });
});
