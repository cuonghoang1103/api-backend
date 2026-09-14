/**
 * Kho gia sư bài học (`frontend/src/store/giaSuBaiStore.ts`).
 *
 * ⚠️ VÌ SAO PHÉP KIỂM CỦA WEB LẠI NẰM TRONG DỰ ÁN DESKTOP: web không có bộ
 * chạy kiểm nào (`frontend/package.json` chỉ có dev/build/start/lint), còn
 * desktop có vitest và alias `@` của nó trỏ thẳng sang `frontend/src` vì màn
 * Học viện dùng lại đúng mã đó. Nên đây là chỗ DUY NHẤT trong kho chạy được
 * một phép kiểm cho kho trạng thái này. Bỏ qua thì hai quyết định dưới đây
 * không có gì gác, mà cả hai đều hỏng CÂM.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { khoaGiaSu, useGiaSuBaiStore } from '@/store/giaSuBaiStore';

beforeEach(() => {
  useGiaSuBaiStore.setState({ bai: null, cuoc: {} });
});

describe('khoaGiaSu', () => {
  it('ĐỀ LUYỆN và BÀI HỌC không dùng chung một cuộc', () => {
    /* Đề luyện cuối chương dựng gia sư trên CÙNG `lessonId` nhưng ngữ cảnh
       khác hẳn — nó biết đề và đáp án từng câu. Chung khoá là hai cuộc trộn
       vào nhau: học viên hỏi về bài, gia sư trả lời về câu 3 của đề. */
    expect(khoaGiaSu(42)).not.toBe(khoaGiaSu(42, true));
  });

  it('cùng bài thì cùng khoá — đó là thứ nối mục cuối bài với con robot', () => {
    expect(khoaGiaSu(42)).toBe(khoaGiaSu(42));
  });
});

describe('cuoc', () => {
  it('hai vỏ ghi vào cùng khoá thì thấy CHUNG một mạch hội thoại', () => {
    const k = khoaGiaSu(7);
    const { datCuoc } = useGiaSuBaiStore.getState();
    datCuoc(k, (t) => [...t, { role: 'user', content: 'hỏi từ mục cuối bài' }]);
    datCuoc(k, (t) => [...t, { role: 'assistant', content: 'trả lời' }]);
    datCuoc(k, (t) => [...t, { role: 'user', content: 'hỏi tiếp từ robot' }]);
    expect(useGiaSuBaiStore.getState().cuoc[k]).toHaveLength(3);
  });

  it('mỗi bài một mạch riêng', () => {
    const { datCuoc } = useGiaSuBaiStore.getState();
    datCuoc(khoaGiaSu(1), (t) => [...t, { role: 'user', content: 'a' }]);
    datCuoc(khoaGiaSu(2), (t) => [...t, { role: 'user', content: 'b' }]);
    expect(useGiaSuBaiStore.getState().cuoc[khoaGiaSu(1)]?.[0]?.content).toBe('a');
    expect(useGiaSuBaiStore.getState().cuoc[khoaGiaSu(2)]?.[0]?.content).toBe('b');
  });

  it('xoá thì bỏ HẲN khoá, không để lại mảng rỗng', () => {
    // Học một buổi là vài chục bài; để lại khoá rỗng thì chúng tích trong bộ
    // nhớ suốt phiên mà không ai thấy.
    const k = khoaGiaSu(9);
    const { datCuoc, xoaCuoc } = useGiaSuBaiStore.getState();
    datCuoc(k, (t) => [...t, { role: 'user', content: 'x' }]);
    xoaCuoc(k);
    expect(k in useGiaSuBaiStore.getState().cuoc).toBe(false);
  });

  it('cuộc chưa có thì đọc ra mảng rỗng, không nổ', () => {
    expect(useGiaSuBaiStore.getState().cuoc[khoaGiaSu(999)]).toBeUndefined();
  });
});

describe('bai — ngữ cảnh cho con robot', () => {
  it('ghi rồi xoá được', () => {
    const { datBai } = useGiaSuBaiStore.getState();
    datBai({ lessonId: 5, courseCode: 'SWT301', lessonTitle: '0.1 — Giới thiệu' });
    expect(useGiaSuBaiStore.getState().bai?.lessonId).toBe(5);
    datBai(null);
    expect(useGiaSuBaiStore.getState().bai).toBeNull();
  });
});
