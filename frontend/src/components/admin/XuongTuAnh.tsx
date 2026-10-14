'use client';

/**
 * ============================================================
 * XƯỞNG GIỌNG — phần THUẬT NGỮ TIẾNG ANH (mục `giang-*`)
 * ============================================================
 *
 * Chủ kênh không giỏi tiếng Anh, nên trước khi đọc một câu như "useState trả
 * về một mảng" thì phải NGHE được cách đọc chuẩn. Ba thứ ở đây:
 *
 *  · `ChipTu`     — một thuật ngữ: 🔊 đọc mẫu (bấm lần hai trong 4 giây ⇒ đọc
 *                   chậm), 🐢 đọc từng phần, IPA Mỹ, cách đọc gần đúng, và
 *                   ✓/✗ nếu đã được Whisper chấm.
 *  · `CauToMau`   — câu cần đọc, thuật ngữ tô màu và bấm được.
 *  · `LuyenTruoc` — danh sách mọi thuật ngữ, thu thử TỪNG TỪ và chấm ngay
 *                   (kiểu luyện phát âm IELTS), không lưu vào dữ liệu train.
 *
 * Đọc mẫu dùng Web Speech API của trình duyệt — miễn phí, không qua backend.
 * Chấm dùng Whisper (Groq) ở backend, KHÔNG mớm từ vựng.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2, Mic, Search, Square, Volume2, X } from 'lucide-react';
import { api } from '@/lib/api';
import {
  NHOM_TU, TU_ANH, coDocMau, docMau, docTungPhan, goiChamTu, tachCau, traTu, type TuAnh,
} from './xuongTuDien';

const BASE = '/admin/maker-lab/ha-tang/xuong';

export interface KetQuaTu {
  tu: string;
  dung: boolean;
}

// ── Nút 🔊: lần một đọc 0,85; bấm lại cùng từ trong 4 giây ⇒ 0,6 ──────
const lanCuoi = { tu: '', luc: 0 };

export function docTu(tu: string) {
  const d = traTu(tu);
  const chu = d?.noi ?? tu;
  const now = Date.now();
  const cham = lanCuoi.tu === tu && now - lanCuoi.luc < 4000;
  lanCuoi.tu = tu;
  lanCuoi.luc = cham ? 0 : now; // lần ba lại về tốc độ thường
  void docMau(chu, cham ? 0.6 : 0.85);
}

export function ChipTu({
  tu,
  ketQua,
  gon = false,
}: {
  tu: string;
  /** undefined = chưa chấm. */
  ketQua?: boolean;
  /** Dòng chip dưới câu: bỏ cách đọc chi tiết cho gọn. */
  gon?: boolean;
}) {
  const d = traTu(tu);
  const vien =
    ketQua === true
      ? 'border-emerald-400/50 bg-emerald-400/10'
      : ketQua === false
        ? 'border-red-400/60 bg-red-500/10'
        : 'border-sky-400/30 bg-sky-400/[0.06]';
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg border px-2 py-1 ${vien}`}>
      {ketQua === true && <Check className="h-3.5 w-3.5 text-emerald-400" aria-label="Whisper nghe đúng" />}
      {ketQua === false && <X className="h-3.5 w-3.5 text-red-400" aria-label="Whisper chưa nhận ra" />}
      <span className="font-semibold text-sky-300">{tu}</span>
      <button
        type="button"
        onClick={() => docTu(tu)}
        title="Nghe mẫu (bấm lần nữa để nghe chậm)"
        className="rounded px-1 text-sm hover:bg-white/10"
      >
        🔊
      </button>
      {d?.tach && d.tach.length > 1 && (
        <button
          type="button"
          onClick={() => void docTungPhan(d.tach!)}
          title={`Đọc chậm từng phần: ${d.tach.join(' · ')}`}
          className="rounded px-1 text-sm hover:bg-white/10"
        >
          🐢
        </button>
      )}
      {d && (
        <span className="text-xs text-[var(--text-secondary)]">
          <span className="font-mono">{d.ipa}</span>
          {!gon && (
            <>
              {' '}≈ <span className="text-[var(--text-primary)]">{d.viet}</span>
              {d.tach && d.tach.length > 1 && <span className="opacity-70"> · {d.tach.join(' · ')}</span>}
              {d.daChon && <span className="ml-1 rounded bg-white/10 px-1 text-[10px]">cách anh đã chọn</span>}
            </>
          )}
          {gon && <> ≈ {d.viet}</>}
        </span>
      )}
    </span>
  );
}

/**
 * Câu cần đọc, thuật ngữ tô màu bấm được.
 *
 * ⚠️ Cấu trúc ổn định (luôn là mảng span, khoá ghép vị trí + chữ) — cùng lý
 * do đã ghi ở XuongGiong: bộ dịch của trình duyệt sửa DOM và React vỡ giữa
 * buổi thu. `lech` = hàm tô đỏ từ tiếng Việt máy nghe lệch (giữ hành vi cũ).
 */
export function CauToMau({
  chu,
  tuAnh,
  kiemTu,
  lech,
}: {
  chu: string;
  tuAnh: string[];
  kiemTu?: KetQuaTu[] | null;
  lech: (tu: string) => boolean;
}) {
  // Danh sách rỗng = câu thường: KHÔNG dò cả từ điển (tachCau với danh sách
  // rỗng sẽ lấy toàn bộ TU_ANH), không thì mục cảm xúc cũng bị tô màu.
  const doan = useMemo(() => (tuAnh.length ? tachCau(chu, tuAnh) : [{ t: chu }]), [chu, tuAnh]);
  const ket = new Map((kiemTu ?? []).map((k) => [k.tu.toLowerCase(), k.dung]));
  let i = 0;
  return (
    <>
      {doan.flatMap((d) => {
        if (d.tu) {
          const k = ket.get(d.tu.toLowerCase());
          const mau =
            k === true
              ? 'text-emerald-300 decoration-emerald-400'
              : k === false
                ? 'text-red-300 decoration-red-400 bg-red-500/15'
                : 'text-sky-300 decoration-sky-400/60';
          const key = `${i++}-${d.t}`;
          return [
            <span
              key={key}
              role="button"
              tabIndex={-1}
              onClick={() => docTu(d.tu!)}
              title={`${traTu(d.tu)?.ipa ?? ''} — bấm để nghe mẫu`}
              className={`cursor-pointer rounded px-0.5 font-semibold underline decoration-2 underline-offset-4 ${mau}`}
            >
              {d.t}
            </span>,
          ];
        }
        return d.t.split(/(\s+)/).map((t) => {
          const key = `${i++}-${t}`;
          return (
            <span key={key} className={t.trim() && lech(t) ? 'rounded bg-red-500/25 px-0.5' : undefined}>
              {t}
            </span>
          );
        });
      })}
    </>
  );
}

/** Đọc lần lượt mọi thuật ngữ trong câu — "nghe cả câu mẫu" (chỉ phần tiếng Anh). */
export async function docCacTu(tuAnh: string[]) {
  if (!coDocMau()) return;
  window.speechSynthesis.cancel();
  for (const t of tuAnh) {
    await docMau(traTu(t)?.noi ?? t, 0.85, false);
    await new Promise((r) => setTimeout(r, 500));
  }
}

// ══════════════════════════════════════════════════════════
//  LUYỆN TRƯỚC
// ══════════════════════════════════════════════════════════

interface KetQuaLuyen {
  dung: boolean;
  nghe: string;
  luc: number;
}

const KHOA_LUU = 'xuong-luyen-tu';

export function LuyenTruoc() {
  const [loc, setLoc] = useState('');
  const [nhom, setNhom] = useState<TuAnh['nhom'] | 'tat' | 'chua'>('tat');
  const [ket, setKet] = useState<Record<string, KetQuaLuyen>>({});
  const [dangThu, setDangThu] = useState<string | null>(null);
  const [dangCham, setDangCham] = useState<string | null>(null);
  const [loi, setLoi] = useState('');
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const henRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KHOA_LUU);
      if (s) setKet(JSON.parse(s) as Record<string, KetQuaLuyen>);
    } catch {
      /* không có localStorage thì kết quả chỉ sống trong phiên — vẫn luyện được */
    }
    // Danh sách giọng của trình duyệt nạp trễ; gọi một lần để nó bắt đầu nạp.
    if (coDocMau()) window.speechSynthesis.getVoices();
    return () => {
      if (henRef.current) clearTimeout(henRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const luu = useCallback((tu: string, k: KetQuaLuyen) => {
    setKet((m) => {
      const moi = { ...m, [tu]: k };
      try {
        localStorage.setItem(KHOA_LUU, JSON.stringify(moi));
      } catch {
        /* đầy quota — kết quả vẫn hiện trong phiên này */
      }
      return moi;
    });
  }, []);

  const dung = useCallback(() => {
    if (henRef.current) clearTimeout(henRef.current);
    if (recRef.current?.state === 'recording') recRef.current.stop();
  }, []);

  const thu = useCallback(
    async (tu: string) => {
      if (dangThu || dangCham) return;
      setLoi('');
      try {
        if (!streamRef.current?.active) {
          streamRef.current = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 },
          });
        }
        const mieng: Blob[] = [];
        const rec = new MediaRecorder(streamRef.current);
        recRef.current = rec;
        rec.ondataavailable = (e) => e.data.size && mieng.push(e.data);
        rec.onstop = async () => {
          setDangThu(null);
          const blob = new Blob(mieng, { type: rec.mimeType || 'audio/webm' });
          if (blob.size < 800) {
            setLoi('Đoạn thu rỗng — bấm thu, đọc từ, rồi bấm dừng.');
            return;
          }
          setDangCham(tu);
          try {
            const form = new FormData();
            form.append('tieng', blob, 'luyen.webm');
            form.append('tuAnh', JSON.stringify(goiChamTu([tu])));
            const r = await api.post(`${BASE}/luyen`, form, { timeout: 60_000 });
            const d = r.data?.data;
            luu(tu, { dung: !!d?.kiemTu?.[0]?.dung, nghe: String(d?.nghe ?? ''), luc: Date.now() });
          } catch (e) {
            const m = e as { response?: { data?: { message?: string } }; message?: string };
            setLoi(m.response?.data?.message ?? m.message ?? 'Chấm thất bại.');
          } finally {
            setDangCham(null);
          }
        };
        rec.start();
        setDangThu(tu);
        // Một từ không ai đọc quá 4 giây — tự dừng, khỏi phải bấm.
        henRef.current = setTimeout(() => rec.state === 'recording' && rec.stop(), 4000);
      } catch (e) {
        setLoi(e instanceof Error ? e.message : 'Không mở được mic.');
      }
    },
    [dangThu, dangCham, luu],
  );

  const tatCa = Object.keys(TU_ANH);
  const datRoi = tatCa.filter((t) => ket[t]?.dung).length;
  const ds = tatCa.filter((t) => {
    if (loc && !t.toLowerCase().includes(loc.toLowerCase())) return false;
    if (nhom === 'chua') return !ket[t]?.dung;
    if (nhom !== 'tat') return TU_ANH[t].nhom === nhom;
    return true;
  });

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-3 rounded-lg border-l-2 border-sky-400/60 bg-sky-400/5 px-3 py-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        Tập từng thuật ngữ <strong>trước khi</strong> thu câu thật: bấm 🔊 nghe mẫu (bấm lần nữa nghe chậm),
        🐢 nghe từng phần, rồi bấm <Mic className="inline h-3.5 w-3.5" /> đọc đúng một từ. Whisper nghe bằng
        tiếng Anh, <strong>không được mớm trước</strong> — nó viết lại đúng từ thì ✓, ra chữ khác thì ✗ kèm
        chữ nó nghe thành. Phần này <strong>không lưu vào dữ liệu train</strong>, thu bao nhiêu lần cũng được.
        <br />
        <span className="text-xs">
          Lưu ý: từ rất ngắn (id, key, let, if…) Whisper hay nghe hụt dù đọc đúng — ✗ ở đó chỉ là gợi ý, tai anh
          mới là chốt cuối.
        </span>
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-[var(--text-primary)]">
          Đạt <strong className="text-emerald-400">{datRoi}</strong> / {tatCa.length} thuật ngữ
        </span>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 text-[var(--text-secondary)]" />
          <input
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            placeholder="Find a term…"
            className="w-44 rounded-lg border border-white/10 bg-black/30 py-1 pl-7 pr-2 text-sm text-[var(--text-primary)]"
          />
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5 text-xs">
        {([['tat', 'Tất cả'], ['chua', 'Chưa đạt'], ...Object.entries(NHOM_TU)] as Array<[string, string]>).map(
          ([k, ten]) => (
            <button
              key={k}
              onClick={() => setNhom(k as typeof nhom)}
              className={`rounded-full border px-2.5 py-1 ${
                nhom === k ? 'border-sky-400/60 bg-sky-400/15 text-sky-200' : 'border-white/10 text-[var(--text-secondary)] hover:bg-white/5'
              }`}
            >
              {ten}
            </button>
          ),
        )}
      </div>

      {loi && <p className="mb-3 text-sm text-red-300">{loi}</p>}

      <ul className="space-y-2">
        {ds.map((t) => {
          const k = ket[t];
          return (
            <li key={t} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black/20 p-2">
              <ChipTu tu={t} ketQua={k?.dung} />
              <button
                onClick={() => (dangThu === t ? dung() : void thu(t))}
                disabled={(!!dangThu && dangThu !== t) || !!dangCham}
                className={`ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-40 ${
                  dangThu === t ? 'bg-red-500 text-white' : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400'
                }`}
              >
                {dangCham === t ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : dangThu === t ? (
                  <>
                    <Square className="h-3.5 w-3.5" /> Dừng
                  </>
                ) : (
                  <>
                    <Mic className="h-3.5 w-3.5" /> Thu thử
                  </>
                )}
              </button>
              {k && (
                <span className={`w-full text-xs ${k.dung ? 'text-emerald-400' : 'text-red-300'}`}>
                  {k.dung ? '✓ Whisper nghe đúng' : '✗ Chưa đúng'} — Whisper nghe thành:{' '}
                  <span className="text-[var(--text-primary)]">“{k.nghe || '(không nghe ra gì)'}”</span>
                  {!k.dung && (
                    <button onClick={() => docTu(t)} className="ml-2 underline decoration-dotted">
                      <Volume2 className="mr-0.5 inline h-3 w-3" />
                      nghe lại mẫu
                    </button>
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
