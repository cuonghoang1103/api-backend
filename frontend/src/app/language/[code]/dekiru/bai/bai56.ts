/**
 * Bài 56 — 語彙 N3：Kho từ vựng N3 bổ sung (09/11/2026).
 * Khoá Bài 0–40 dạy ~2.500 từ; mức N3 thường nêu ~3.750 ⇒ kho này bù ~1.200 từ N3 HAY GẶP mà các bài chưa dạy,
 * chia theo chủ đề, mỗi từ có câu ví dụ. Không trùng từ đã dạy (đối chiếu danh sách TU của onTheData.ts).
 * Hai phần soạn song song: kho56a.ts (chủ đề 1–8), kho56b.ts (chủ đề 9–16).
 */
import type { Lesson } from '@/components/sach-hoc/types';
import { KHO_56A } from './kho56a';
import { KHO_56B } from './kho56b';

export const BAI_56: Lesson[] = [...KHO_56A, ...KHO_56B];
