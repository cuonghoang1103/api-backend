'use client';
/**
 * Kho dữ liệu "Dự án xuyên suốt khoá" theo slug khoá — một lần tải cho cả trang học (khối đăng ký / mốc / bảo vệ
 * ở các bài khác nhau dùng chung), mọi lệnh ghi của máy chủ trả lại toàn bộ bản mới ⇒ `dat()` thay cả gói.
 */
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';
import { duAnApi } from '@/lib/api';
import type { DuAnTraVe } from '@/lib/duAn';

interface MotKhoa { data?: DuAnTraVe; dangTai: boolean; loi?: string }
interface Kho {
  theoKhoa: Record<string, MotKhoa>;
  dat: (slug: string, p: Partial<MotKhoa>) => void;
}

const useKho = create<Kho>((set) => ({
  theoKhoa: {},
  dat: (slug, p) => set((s) => ({ theoKhoa: { ...s.theoKhoa, [slug]: { ...(s.theoKhoa[slug] ?? { dangTai: false }), ...p } } })),
}));

/** Giá trị mặc định DÙNG CHUNG — `?? {}` trong selector tạo object mới mỗi lần ⇒ zustand vẽ lại vô tận. */
const RONG: MotKhoa = { dangTai: false };

/** Lấy câu lỗi tiếng Việt máy chủ trả (AppError), không có thì câu dự phòng. */
export function loiCua(e: unknown, duPhong: string): string {
  const r = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return r || (e as Error)?.message || duPhong;
}

export function useDuAn(slug: string) {
  const st = useKho((s) => s.theoKhoa[slug] ?? RONG);
  const datKho = useKho((s) => s.dat);

  const taiLai = useCallback(async () => {
    datKho(slug, { dangTai: true, loi: undefined });
    try {
      const r = await duAnApi.get(slug);
      datKho(slug, { data: r.data.data, dangTai: false });
    } catch (e) {
      datKho(slug, { dangTai: false, loi: loiCua(e, 'Không tải được dự án của khoá.') });
    }
  }, [slug, datKho]);

  useEffect(() => {
    const hienTai = useKho.getState().theoKhoa[slug];
    if (!hienTai?.data && !hienTai?.dangTai) void taiLai();
  }, [slug, taiLai]);

  const dat = useCallback((data: DuAnTraVe) => datKho(slug, { data }), [slug, datKho]);
  return { ...st, taiLai, dat };
}
