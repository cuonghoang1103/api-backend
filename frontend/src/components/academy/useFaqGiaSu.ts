'use client';

/**
 * ============================================================
 * RUỘT CỦA "CÂU HỎI THƯỜNG GẶP" — không giao diện
 * ============================================================
 *
 * Tách ra 15/09/2026 khi mục này cần có mặt ở lối vào thứ hai (con robot nổi).
 * Cùng lý do với `useGiaSuBai`: chép vỏ sang là hai bản trôi lệch nhau, và
 * phần rụng trước sẽ là những luật khó thấy — ai được xoá, nạp lười, vứt danh
 * sách khi đổi bài.
 *
 * ⚠️ Hai vỏ có nền KHÁC NHAU: mục cuối bài ăn theo chủ đề sáng/tối của web,
 * còn khung robot LUÔN nền tối. Nên phần VẼ buộc phải tách riêng — dùng chung
 * một vỏ là ở chủ đề sáng, chữ sáng màu nằm trên nền tối, không đọc được.
 */

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';

export interface MucFaq {
  id: number;
  question: string;
  /** NGUYÊN VĂN — máy chủ không cắt, và ở đây cũng không. */
  answer: string;
  lang?: string;
  createdAt: string;
  nguoiHoi: string;
  avatar: string | null;
  cuaToi: boolean;
}

export function useFaqGiaSu(duong: string, khoaDoiBai: number | string) {
  const [mo, datMo] = useState(false);
  const [ds, datDs] = useState<MucFaq[] | null>(null);
  const [dangTai, datDangTai] = useState(false);
  const [moMuc, datMoMuc] = useState<number | null>(null);
  /** Còn câu cũ hơn ngoài trang đầu không — xem `napThem`. */
  const [conNua, datConNua] = useState(false);

  /* Nạp LƯỜI: chỉ hỏi máy chủ khi người dùng mở mục ra. Một bài đông người hỏi
     có thể trả về vài trăm KB — không đáng kéo về cho mọi lần mở bài. */
  const nap = useCallback(async () => {
    datDangTai(true);
    try {
      const r = await api.get(duong);
      const items: MucFaq[] = r.data?.data?.items ?? [];
      datDs(items);
      datConNua(!!r.data?.data?.conNua);
    } catch {
      datDs([]);
      datConNua(false);
    } finally {
      datDangTai(false);
    }
  }, [duong]);

  /**
   * Nạp thêm câu CŨ HƠN.
   *
   * ⚠️ Vì sao cần: người dùng chốt 15/09/2026 rằng câu hỏi ở đây "không bao
   * giờ biến mất trừ khi chính user đó hoặc admin muốn xoá". Trong CSDL đúng
   * là không có gì xoá chúng — nhưng danh sách chỉ trả 40 câu mới nhất, nên
   * câu thứ 41 trở đi biến mất khỏi TẦM MẮT, và với người dùng thì hai chuyện
   * đó là một. Có nút này thì không câu nào bị giấu.
   */
  const napThem = useCallback(async () => {
    const cu = ds ?? [];
    const cuoi = cu[cu.length - 1];
    if (!cuoi || dangTai) return;
    datDangTai(true);
    try {
      const r = await api.get(`${duong}?truoc=${cuoi.id}`);
      const them: MucFaq[] = r.data?.data?.items ?? [];
      /* Lọc trùng theo id: một câu vừa được ghi trong lúc người dùng đang đọc
         có thể rơi vào cả hai trang, và React sẽ cảnh báo key trùng. */
      const daCo = new Set(cu.map((x) => x.id));
      datDs([...cu, ...them.filter((x) => !daCo.has(x.id))]);
      datConNua(!!r.data?.data?.conNua);
    } catch {
      toast.error('Không tải thêm được.');
    } finally {
      datDangTai(false);
    }
  }, [duong, ds, dangTai]);

  // Đổi bài thì đóng và VỨT danh sách cũ — giữ lại là hiện câu hỏi của bài khác.
  useEffect(() => { datMo(false); datDs(null); datMoMuc(null); datConNua(false); }, [khoaDoiBai]);

  const xoa = useCallback(async (id: number) => {
    if (!window.confirm('Xoá câu hỏi này khỏi mục Câu hỏi thường gặp?')) return;
    try {
      await api.delete(`${duong}/${id}`);
      datDs((cu) => (cu ?? []).filter((x) => x.id !== id));
    } catch {
      toast.error('Xoá không được.');
    }
  }, [duong]);

  const batMo = useCallback(() => {
    datMo((m) => {
      const moi = !m;
      if (moi && ds === null) void nap();
      return moi;
    });
  }, [ds, nap]);

  return { mo, batMo, ds, dangTai, moMuc, datMoMuc, xoa, conNua, napThem, napLai: nap };
}
