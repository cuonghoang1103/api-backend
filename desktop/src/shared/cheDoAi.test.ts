/**
 * Luật tự chuyển máy chủ ↔ ngoại tuyến. Ranh giới 1 (có mạng ⇒ LUÔN máy chủ)
 * là thứ được kiểm kỹ nhất ở đây.
 */
import { describe, expect, it } from 'vitest';
import { duongChoLuot, giaoDienAi } from './cheDoAi';

const DU = { choPhepChay: true, tuDungKhiMatMang: true, coModel: true };

describe('duongChoLuot — lượt mới đi đâu', () => {
  it('có mạng ⇒ LUÔN máy chủ, bất kể đã có model, công tắc ra sao', () => {
    for (const coModel of [true, false]) {
      for (const choPhepChay of [true, false]) {
        expect(duongChoLuot({ matMang: false, choPhepChay, tuDungKhiMatMang: true, coModel })).toBe('mayChu');
      }
    }
  });
  it('mất mạng + có model + được phép ⇒ chạy trên máy', () => {
    expect(duongChoLuot({ matMang: true, ...DU })).toBe('cucBo');
  });
  it('mất mạng mà chưa có model ⇒ chuaCai (giao diện mời cài)', () => {
    expect(duongChoLuot({ matMang: true, ...DU, coModel: false })).toBe('chuaCai');
  });
  it('mất mạng, có model, nhưng tắt một trong hai công tắc ⇒ daTat — KHÔNG lén chạy', () => {
    expect(duongChoLuot({ matMang: true, ...DU, choPhepChay: false })).toBe('daTat');
    expect(duongChoLuot({ matMang: true, ...DU, tuDungKhiMatMang: false })).toBe('daTat');
  });
});

describe('giaoDienAi — dải trạng thái', () => {
  const co = { dangChay: false, luotLaCucBo: false, daQuayVe: false, coModel: true, choPhep: true };

  it('có mạng, lượt máy chủ ⇒ không dải nào', () => {
    expect(giaoDienAi({ online: true, ...co })).toEqual({ nen: 'mayChu', hoiQuayVe: null });
  });
  it('mất mạng có model ⇒ ngoại tuyến (đổi màu), chưa hỏi gì', () => {
    expect(giaoDienAi({ online: false, ...co })).toEqual({ nen: 'ngoaiTuyen', hoiQuayVe: null });
  });
  it('mất mạng chưa có model ⇒ dải mời cài; tắt công tắc ⇒ dải chỉ chỗ bật', () => {
    expect(giaoDienAi({ online: false, ...co, coModel: false }).nen).toBe('matMangChuaCai');
    expect(giaoDienAi({ online: false, ...co, choPhep: false }).nen).toBe('matMangDaTat');
  });
  it('CÓ MẠNG LẠI giữa lượt trên máy ⇒ giữ màu ngoại tuyến, báo sẽ quay về SAU lượt (không cắt ngang)', () => {
    expect(giaoDienAi({ online: true, ...co, dangChay: true, luotLaCucBo: true }))
      .toEqual({ nen: 'ngoaiTuyen', hoiQuayVe: { sauLuot: true } });
  });
  it('có mạng lại, lượt trên máy đã xong ⇒ hỏi "quay về AI máy chủ?"; bấm rồi ⇒ về bình thường', () => {
    expect(giaoDienAi({ online: true, ...co, luotLaCucBo: true }).hoiQuayVe).toEqual({ sauLuot: false });
    expect(giaoDienAi({ online: true, ...co, luotLaCucBo: true, daQuayVe: true }).nen).toBe('mayChu');
  });
  it('lượt máy chủ đang chạy lúc có mạng ⇒ không dải nào', () => {
    expect(giaoDienAi({ online: true, ...co, dangChay: true }).nen).toBe('mayChu');
  });
});
