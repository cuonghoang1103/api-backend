/**
 * Sổ đăng ký trang của app CT Work RIÊNG (biến thể `ctwork`, 13/10/2026).
 *
 * Bản dựng `ctwork` THAY `page-registry.ts` bằng tệp này (plugin `bienTheCtWork`
 * trong `vite.config.ts`). Bản đầy đủ import TĨNH mọi trang của app — Tổng quan,
 * Học viện, Nhạc, Xưởng Remix… — nên chỉ cần chạm vào nó là cả trăm trang bị gói
 * vào app CT Work. Tệp này chỉ biết đúng một trang.
 *
 * ⚠️ Giữ CÙNG chữ ký export với `page-registry.ts` (`NATIVE_PAGES`,
 * `nativePageFor`) — mọi chỗ import tệp kia nhận tệp này mà không biết.
 */
import type { ComponentType } from 'react';
import { CtWorkPage } from './features/work/CtWorkPage';
import { thuocCtWork } from '../shared/bienThe';

export const NATIVE_PAGES: Readonly<Record<string, ComponentType>> = {
  '/work': CtWorkPage,
};

export function nativePageFor(path: string): ComponentType | undefined {
  return thuocCtWork(path) ? CtWorkPage : undefined;
}
