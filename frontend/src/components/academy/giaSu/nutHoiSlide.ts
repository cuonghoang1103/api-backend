'use client';

/**
 * "💬 Hỏi slide này" ngay trên chú thích của TỪNG ảnh slide trong nội dung bài (17/11/2026).
 *
 * Người dùng: "hỏi về từng slide riêng". Trước đó chỉ có danh sách "Hỏi theo slide" nằm trong khung gia sư — người học
 * phải nhớ số slide rồi đi tìm trong danh sách. Nay bấm ngay dưới tấm slide đang nhìn ⇒ mở CuongMini với chip
 * "📑 SWT0 · slide 2 — ISTQB" ghim sẵn (máy chủ trích đúng phần giảng của slide đó, xem `doanSlide`).
 *
 * Nội dung bài là HTML đổ bằng `dangerouslySetInnerHTML`, nên nút được GẮN VÀO DOM sau khi vẽ (như nút Sao chép của
 * `useToMauCode`) và gỡ ra khi bài/ngôn ngữ đổi. React không đụng lại `innerHTML` khi chuỗi HTML không đổi, nên nút
 * không bị xoá giữa chừng.
 */
import { useEffect, type DependencyList } from 'react';
import { docSlide } from '@/components/academy/docSlide';
import { moGiaSuBai } from '@/store/giaSuBaiStore';
import './giaSu.css';

export function useNutHoiSlide(layKhung: () => HTMLElement | null, lessonId: number | null, deps: DependencyList) {
  useEffect(() => {
    const root = layKhung();
    if (!root || lessonId == null) return undefined;
    const daGan: HTMLButtonElement[] = [];
    root.querySelectorAll<HTMLElement>('.anh-slide').forEach((khoi) => {
      const sl = docSlide(khoi.outerHTML)[0];
      if (!sl) return;
      const dich = khoi.querySelector<HTMLElement>('.chu-thich') ?? khoi;
      if (dich.querySelector('.gsb-nut-slide')) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gsb-nut-slide';
      b.textContent = '💬 Hỏi slide này';
      b.title = `Hỏi CuongMini về slide ${sl.so}${sl.ten ? ` — ${sl.ten}` : ''}`;
      b.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moGiaSuBai(lessonId, { loai: 'slide', slide: sl });
      });
      dich.appendChild(b);
      daGan.push(b);
    });
    return () => { daGan.forEach((b) => b.remove()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
