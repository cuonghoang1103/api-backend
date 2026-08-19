/**
 * `ALLOWED_EVENTS` trong preload phải KHỚP `EVENT_CHANNELS` trong shared/ipc.
 *
 * Preload cố ý chép lại danh sách thay vì import (bó nhỏ ⇒ bề mặt tấn công
 * nhỏ), và chú thích ở đó đã hứa "test đối chiếu hai bên" — nhưng phép kiểm
 * ấy CHƯA BAO GIỜ được viết. 19/08/2026 tôi thêm `agent:moWeb` vào một bên,
 * quên bên kia, và người dùng nhận nguyên màn hình đỏ:
 *
 *     Đã xảy ra lỗi — Kênh sự kiện không được phép: agent:moWeb
 *
 * `tsc` xanh sạch (cả hai đều là `EventChannel` hợp lệ), lint xanh, và app
 * chỉ vỡ khi CHẠY, ở đúng tính năng vừa thêm.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EVENT_CHANNELS } from '../shared/ipc';

function kenhTrongPreload(): string[] {
  const src = readFileSync(join(import.meta.dirname, 'index.ts'), 'utf8');
  const i = src.indexOf('const ALLOWED_EVENTS');
  expect(i, 'không tìm thấy ALLOWED_EVENTS — đã đổi tên?').toBeGreaterThan(-1);
  const than = src.slice(i, src.indexOf('];', i));
  return [...than.matchAll(/'([a-zA-Z]+:[a-zA-Z]+)'/g)].map((m) => m[1]!);
}

describe('kênh sự kiện', () => {
  it('preload cho phép ĐÚNG những kênh shared khai — không thiếu, không thừa', () => {
    const preload = kenhTrongPreload();
    const shared = [...EVENT_CHANNELS];

    const thieu = shared.filter((k) => !preload.includes(k));
    expect(thieu, `preload THIẾU: ${thieu.join(', ')} ⇒ app vỡ khi renderer nghe kênh đó`).toEqual([]);

    const thua = preload.filter((k) => !shared.includes(k as never));
    expect(thua, `preload THỪA: ${thua.join(', ')} ⇒ mở một kênh không ai khai`).toEqual([]);
  });
});
