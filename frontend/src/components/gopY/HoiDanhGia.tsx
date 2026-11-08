'use client';

/**
 * Hộp robot hỏi "Bạn thấy CuongThai thế nào?" (08/11/2026) — chỉ được tải khi `GacHoiDanhGia` thấy đủ điều kiện.
 * Chấm sao ⇒ (tuỳ chọn) một câu góp ý ⇒ gửi. "Để sau" hoãn 7 ngày, ✕ hoãn 3 ngày, "Không hỏi lại" thôi hẳn
 * (trang /gop-y vẫn luôn mở). Gửi xong thì 120 ngày sau mới hỏi lại.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { gopYApi } from '@/lib/api';
import { useLocale } from '@/hooks/useTranslation';
import RobotAI from '@/components/academy/RobotAI';
import { ChonSao } from './TrangGopY';
import { hoanHoi, khongHoiNua } from './GacHoiDanhGia';

export default function HoiDanhGia({ trang, onDong }: { trang: string; onDong: () => void }) {
  const ngon = useLocale() === 'en' ? 'en' : 'vi';
  const vi = ngon === 'vi';
  const [vao, setVao] = useState(false);
  const [sao, setSao] = useState(0);
  const [chu, setChu] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [xong, setXong] = useState(false);

  useEffect(() => { const id = requestAnimationFrame(() => setVao(true)); return () => cancelAnimationFrame(id); }, []);

  const dong = (soNgay: number | 'khong') => {
    if (soNgay === 'khong') khongHoiNua(); else hoanHoi(soNgay);
    setVao(false);
    window.setTimeout(onDong, 200);
  };

  const gui = async () => {
    if (!sao) return;
    setDangGui(true);
    try {
      await gopYApi.gui({
        loai: chu.trim().length >= 5 ? (sao <= 3 ? 'IMPROVE' : 'PRAISE') : 'RATING',
        soSao: sao,
        noiDung: chu.trim() || undefined,
        trang,
        nguon: 'POPUP',
        manHinh: `${window.innerWidth}×${window.innerHeight}`,
      });
      hoanHoi(120);
      setXong(true);
      window.setTimeout(() => { setVao(false); window.setTimeout(onDong, 200); }, 4500);
    } catch {
      hoanHoi(1);
      setVao(false);
      window.setTimeout(onDong, 200);
    } finally { setDangGui(false); }
  };

  const cauHoi = sao === 0 ? null : sao <= 3
    ? (vi ? 'Điều gì chưa tốt? Mình sẽ sửa sớm.' : 'What could be better? We will fix it.')
    : (vi ? 'Bạn thích điều gì nhất? (không bắt buộc)' : 'What do you like most? (optional)');

  return (
    <div role="dialog" aria-live="polite" aria-label={vi ? 'Đánh giá CuongThai' : 'Rate CuongThai'}
      className={`fixed bottom-4 left-4 right-4 z-[60] sm:right-auto sm:w-[380px] transition-all duration-300 ease-out ${vao ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl shadow-indigo-500/10">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
        <button type="button" onClick={() => dong(3)} aria-label={vi ? 'Đóng' : 'Close'}
          className="absolute right-2.5 top-3 rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]">
          <X className="h-4 w-4" />
        </button>
        <div className="p-4 pr-10">
          {xong ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{vi ? 'Cảm ơn bạn rất nhiều!' : 'Thank you so much!'}</p>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                  {vi ? 'Muốn kể chi tiết hơn hay báo lỗi? ' : 'Want to say more or report a bug? '}
                  <Link href={`/gop-y?trang=${encodeURIComponent(trang)}`} className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                    {vi ? 'Viết góp ý đầy đủ →' : 'Write full feedback →'}
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <RobotAI size={44} className="shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold leading-snug text-[var(--text-primary)]">{vi ? 'Bạn thấy CuongThai thế nào?' : 'How is CuongThai for you?'}</p>
                  <p className="text-xs text-[var(--text-muted)]">{vi ? 'Mất 5 giây — giúp mình làm web tốt hơn.' : 'Takes 5 seconds — helps us improve.'}</p>
                </div>
              </div>
              <div className="mt-3"><ChonSao value={sao} onChange={setSao} size={28} ngon={ngon} /></div>
              {cauHoi && (
                <textarea value={chu} onChange={(e) => setChu(e.target.value)} maxLength={1000} rows={2} placeholder={cauHoi} autoFocus
                  className="mt-3 w-full resize-none rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25" />
              )}
              <div className="mt-3 flex items-center gap-2">
                <button type="button" onClick={gui} disabled={!sao || dangGui}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-40">
                  {dangGui ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}{vi ? 'Gửi' : 'Send'}
                </button>
                <button type="button" onClick={() => dong(7)} className="rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]">
                  {vi ? 'Để sau' : 'Later'}
                </button>
                <button type="button" onClick={() => dong('khong')} className="ml-auto text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:underline">
                  {vi ? 'Không hỏi lại' : "Don't ask again"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
