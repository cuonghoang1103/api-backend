/**
 * Model cho AI Code ngoại tuyến theo sức máy (03/10/2026).
 *
 * Ngưỡng do chủ app chốt: Apple Silicon ≥ 32 GB, GPU rời ≥ 16 GB VRAM, hoặc
 * RAM ≥ 32 GB kèm GPU ⇒ bản 30B; có GPU + đủ RAM ⇒ 4B "chỉ việc nhỏ"; không
 * GPU ⇒ KHÔNG mời (ranh giới 3).
 */
import { describe, expect, it } from 'vitest';
import { BAN_LLAMA, duongBoChay, duongModel, goiBoChay, loiKhuyenCode, MODEL, timModel } from './kho';
import { chonModelChat, chonModelCode } from './quanLy';
import { vramTuDanhSach } from './quetMay';

const mac = (ramGb: number) => ({ nenTang: 'darwin', kienTruc: 'arm64', ramGb, diaGb: 300, coGpu: true });
const win = (o: Partial<Parameters<typeof loiKhuyenCode>[0]>) => ({
  nenTang: 'win32', kienTruc: 'x64', ramGb: 16, diaGb: 300, coGpu: true, ...o,
});

describe('sổ model — bản lập trình', () => {
  it('trỏ đúng file đã kiểm bằng curl -sI (18.556.689.568 byte)', () => {
    const m = timModel('code')!;
    expect(duongModel(m)).toBe(
      'https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF/resolve/b17cb02dd882d5b6ab62fc777ad2995f19668350/Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf',
    );
    expect(Math.abs(m.gb * 1e9 - 18_556_689_568) / 18_556_689_568).toBeLessThan(0.02);
  });
  it('chỉ bản 4B và 30B được đánh dấu dùng cho AI Code; bản 1,7B và bản ảnh thì không', () => {
    expect(MODEL.filter((m) => m.code).map((m) => m.ma).sort()).toEqual(['code', 'vua']);
    expect(timModel('vua')!.code!.nhan).toBe('chỉ việc nhỏ');
  });
  it('cửa sổ của bản 30B rộng hơn bản 4B, trần bước cũng vậy', () => {
    expect(timModel('code')!.code!.cuaSo).toBeGreaterThan(timModel('vua')!.code!.cuaSo);
    expect(timModel('code')!.code!.tranBuoc).toBeGreaterThan(timModel('vua')!.code!.tranBuoc);
  });
});

describe('loiKhuyenCode', () => {
  it('Apple Silicon 32 GB (máy đo: M1 Max) ⇒ bản 30B', () => {
    expect(loiKhuyenCode(mac(32))).toMatchObject({ nen: 'code', muc: 'manh' });
  });
  it('Apple Silicon 16 GB ⇒ bản 4B, nhãn chỉ việc nhỏ', () => {
    const k = loiKhuyenCode(mac(16));
    expect(k).toMatchObject({ nen: 'vua', muc: 'vua' });
    expect(k.vi).toContain('việc nhỏ');
  });
  it('GPU rời 16 GB VRAM dù RAM chỉ 16 GB ⇒ bản 30B (VRAM gánh phần lớn)', () => {
    expect(loiKhuyenCode(win({ vramGb: 16 }))).toMatchObject({ nen: 'code' });
  });
  it('RAM 32 GB kèm GPU 8 GB ⇒ bản 30B', () => {
    expect(loiKhuyenCode(win({ ramGb: 32, vramGb: 8 }))).toMatchObject({ nen: 'code' });
  });
  it('KHÔNG GPU ⇒ không mời AI Code ngoại tuyến, dù RAM 64 GB (ranh giới 3)', () => {
    const k = loiKhuyenCode(win({ ramGb: 64, coGpu: false }));
    expect(k).toMatchObject({ nen: null, choPhep: [], muc: 'yeu' });
    expect(k.vi).toMatch(/GPU/);
  });
  it('máy mạnh mà đĩa không đủ 18,6 GB ⇒ lùi về 4B và NÓI vì sao', () => {
    const k = loiKhuyenCode({ ...mac(32), diaGb: 10 });
    expect(k.nen).toBe('vua');
    expect(k.vi).toContain('đĩa');
  });
  it('đĩa "chưa đo được" (-1) KHÔNG bị hiểu là hết đĩa', () => {
    expect(loiKhuyenCode({ ...mac(32), diaGb: -1 }).nen).toBe('code');
  });
  it('máy 8 GB có GPU ⇒ không đủ RAM cho cả bản 4B ở cửa sổ agent', () => {
    expect(loiKhuyenCode(win({ ramGb: 8 })).nen).toBeNull();
  });
});

describe('chọn model đã tải', () => {
  const k32 = loiKhuyenCode(mac(32));
  it('ưu tiên 30B nếu đã tải; chỉ có 4B thì dùng 4B', () => {
    expect(chonModelCode({ daCo: ['vua', 'code'], khuyenCode: k32 }).ma).toBe('code');
    expect(chonModelCode({ daCo: ['vua'], khuyenCode: k32 }).ma).toBe('vua');
  });
  it('chỉ có bản 1,7B ⇒ chưa có gì cho AI Code, và mời tải đúng bản hợp máy', () => {
    const r = chonModelCode({ daCo: ['nho'], khuyenCode: k32 });
    expect(r.ma).toBeNull();
    expect(r.nenTai).toBe('code');
  });
  it('máy yếu ⇒ không dùng 4B cho AI Code dù đã tải (ranh giới 3)', () => {
    const yeu = loiKhuyenCode(win({ coGpu: false }));
    expect(chonModelCode({ daCo: ['vua'], khuyenCode: yeu }).ma).toBeNull();
  });
  it('chat: bản đang chạy thắng; không thì bản nên dùng; 30B cũng dùng được cho chat', () => {
    const khuyen = { nen: 'vua' as const, choPhep: ['nho', 'vua'] as Array<'nho' | 'vua'>, vi: '' };
    expect(chonModelChat({ daCo: ['nho'], khuyen, khuyenCode: k32, dangChay: 'code' })).toBe('code');
    expect(chonModelChat({ daCo: ['nho', 'vua'], khuyen, khuyenCode: k32, dangChay: null })).toBe('vua');
    expect(chonModelChat({ daCo: ['code'], khuyen, khuyenCode: k32, dangChay: null })).toBe('code');
    expect(chonModelChat({ daCo: [], khuyen, khuyenCode: k32, dangChay: null })).toBeNull();
  });
});

describe('gói CUDA cho Windows + NVIDIA', () => {
  it('mặc định KHÔNG có CUDA (luật cũ vẫn giữ cho bản 1,7B/4B)', () => {
    expect(goiBoChay('win32', 'x64').some((g) => g.tangToc === 'cuda')).toBe(false);
  });
  it('có NVIDIA + bản 30B ⇒ CUDA đứng ĐẦU, Vulkan/CPU vẫn còn phía sau để lùi', () => {
    const ds = goiBoChay('win32', 'x64', { cuda: true });
    expect(ds.map((g) => g.tangToc)).toEqual(['cuda', 'vulkan', 'cpu']);
    expect(ds[0]!.ten).toBe(`llama-${BAN_LLAMA}-bin-win-cuda-12.4-x64.zip`);
    expect(ds[0]!.kem?.ten).toBe('cudart-llama-bin-win-cuda-12.4-x64.zip');
    expect(duongBoChay(ds[0]!.kem!)).toContain(`/download/${BAN_LLAMA}/cudart-`);
  });
  it('macOS/Linux không đổi khi bật cờ CUDA', () => {
    expect(goiBoChay('darwin', 'arm64', { cuda: true })).toEqual(goiBoChay('darwin', 'arm64'));
    expect(goiBoChay('linux', 'x64', { cuda: true })).toEqual(goiBoChay('linux', 'x64'));
  });
});

describe('VRAM từ --list-devices', () => {
  it('đọc MiB của thiết bị lớn nhất', () => {
    expect(vramTuDanhSach(['CUDA0: NVIDIA GeForce RTX 4080 (16375 MiB, 15000 MiB free)', 'Vulkan0: Intel (2048 MiB, 1 MiB free)'])).toBe(16);
    expect(vramTuDanhSach(['MTL0: Apple M1 Max (25559 MiB, 25558 MiB free)'])).toBe(25);
    expect(vramTuDanhSach(['Vulkan0: lạ'])).toBe(-1);
  });
});
