'use client';

/**
 * Cùng hình dạng với `useSpeak` của trang cũ ({ speak, current, supported })
 * để các view cũ khỏi phải sửa — nhưng đọc bằng bộ đọc chung của khoá học
 * (giọng Azure Neural thật, file lưu R2, lùi giọng trình duyệt khi cần).
 * `useSpeak` gọi thẳng speechSynthesis nên luôn là giọng máy của trình duyệt.
 */
import { useCallback, useEffect, useState } from 'react';
import { play, stopAudio } from '@/components/sach-hoc/audio';

export function useDoc() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => () => stopAudio(), []);
  const speak = useCallback((text: string) => {
    void play({ text, voice: 'uk-nu' }, () => setCurrent((c) => (c === text ? null : c)));
    setCurrent(text); // sau play(): play() tắt đèn của lượt cũ trước
  }, []);
  return { speak, current, supported: true };
}
