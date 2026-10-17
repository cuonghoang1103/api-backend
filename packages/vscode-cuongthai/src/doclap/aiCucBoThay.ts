/**
 * Thay `desktop/src/main/aiCucBo/quanLy.ts`: AI Code ngoại tuyến (llama.cpp tải
 * về máy) chỉ có trong app desktop — extension luôn đi cổng máy chủ.
 */
const VI = 'AI Code ngoại tuyến chỉ có trong app desktop CuongThai.';

export async function modelChoCode(): Promise<{ ma: null; ten: string; nhan: string; vi: string; nenTai: null }> {
  return { ma: null, ten: '', nhan: '', vi: VI, nenTai: null };
}

export async function batChoCode(): Promise<never> {
  throw new Error(VI);
}
