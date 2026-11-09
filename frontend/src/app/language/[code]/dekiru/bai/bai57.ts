/**
 * Bài 57 — 語彙 N2：Kho từ vựng N2 bổ sung (09/11/2026).
 * Mức N2 thường nêu ~6.000 từ; khoá (Bài 0–55 + kho N3) dạy ~4.500 ⇒ kho này bù ~1.500 từ N2 HAY GẶP mà các bài chưa
 * dạy, chia theo chủ đề + phần 語形成 (tiền tố/hậu tố), 慣用句, 同音異義語 — đúng các dạng đề N2.
 * Hai phần soạn song song: kho57a.ts (chủ đề 1–10), kho57b.ts (chủ đề 11–20).
 */
import type { Lesson } from '@/components/sach-hoc/types';
import { KHO_57A } from './kho57a';
import { KHO_57B } from './kho57b';

export const BAI_57: Lesson[] = [...KHO_57A, ...KHO_57B];
