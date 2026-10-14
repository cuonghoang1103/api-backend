'use client';

/**
 * ============================================================
 * XƯỞNG GIỌNG — mục "Đọc tiếng Anh" (khoá `anh`, câu THUẦN tiếng Anh)
 * ============================================================
 *
 * Mục này thu GIỌNG MẪU SẠCH cho máy nhân bản giọng tiếng Anh (Chatterbox /
 * F5 bản Anh): máy chép chất giọng từ mẫu, phát âm là của mô hình. Chủ kênh
 * không giỏi tiếng Anh, nên trước mỗi câu phải NGHE được cả câu, và sau khi
 * thu phải biết mình có đọc sót/vấp chữ nào không.
 *
 *  · `CauAnh`       — câu cần đọc; sau khi chấm, từ đúng xanh / từ sai đỏ.
 *                     Bấm một từ để nghe riêng từ đó.
 *  · `NgheMauAnh`   — 🔊 nghe mẫu cả câu (bấm lại trong 4 giây ⇒ chậm hơn),
 *                     🐢 đọc từng cụm, cụm bấm được, từ khó kèm IPA.
 *  · `KetQuaAnh`    — điểm khớp chữ + "Whisper nghe thành: …" + từ sai/thừa.
 *
 * Đọc mẫu dùng Web Speech API (en-US) của trình duyệt — miễn phí, không qua
 * backend. Chấm: backend nghe bằng Whisper ÉP `en`, KHÔNG mớm câu gốc.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Volume2 } from 'lucide-react';
import type { KetQuaTu } from './XuongTuAnh';
import { TU_ANH, coDocMau, docMau, docTungPhan, tachCau, tachCum, traTu, tuKhoTrongCau } from './xuongTuDien';

export interface ChamAnh {
  /** Tỉ lệ từ của câu gốc Whisper nghe ra, 0..1; null = không chấm được. */
  diem: number | null;
  /** Từng từ của câu gốc (tách theo khoảng trắng) đúng/sai. */
  tu: KetQuaTu[];
  /** Từ gốc nghe lệch / thiếu. */
  sai: string[];
  /** Từ Whisper nghe ra mà câu gốc không có (chỉ có ở lượt vừa thu). */
  thua?: string[];
}

/** Dưới mức này: đáng nghe lại. Khớp ngưỡng `anh` ở backend (NGUONG_SOAT). */
export const NGUONG_ANH = 0.75;

/**
 * Chữ đưa cho giọng máy: thuật ngữ kiểu code ("useState", "JSX", "npm")
 * đổi sang dạng đọc được ("use State", "J S X") theo trường `noi` của từ
 * điển — không thì giọng máy đọc liền một cục hoặc đánh vần lung tung.
 * Chỉ đổi CHỮ ĐỌC MẪU, câu hiện trên màn hình và câu đi vào dữ liệu giữ nguyên.
 */
const CO_NOI = Object.keys(TU_ANH).filter((k) => TU_ANH[k].noi);
export function chuDeDoc(chu: string): string {
  return tachCau(chu, CO_NOI)
    .map((d) => (d.tu ? (traTu(d.tu)?.noi ?? d.t) : d.t))
    .join('');
}

// ── 🔊 cả câu: lần một 0,85; bấm lại cùng câu trong 4 giây ⇒ 0,65 ──────
const lanCuoi = { chu: '', luc: 0 };

export function docCauMau(chu: string) {
  const now = Date.now();
  const cham = lanCuoi.chu === chu && now - lanCuoi.luc < 4000;
  lanCuoi.chu = chu;
  lanCuoi.luc = cham ? 0 : now; // lần ba lại về tốc độ thường
  void docMau(chuDeDoc(chu), cham ? 0.65 : 0.85);
}

/** Bỏ dấu câu hai đầu một từ — để đọc riêng và để so với kết quả chấm. */
const tron = (t: string) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

/** Màu điểm khớp chữ. */
export function mauDiem(d: number): string {
  return d >= 0.9 ? 'text-emerald-400' : d >= NGUONG_ANH ? 'text-amber-400' : 'text-red-400';
}

/**
 * Câu tiếng Anh cần đọc. Sau khi chấm: từ đúng xanh, từ sai đỏ.
 *
 * ⚠️ Cấu trúc ỔN ĐỊNH — luôn là mảng span, khoá ghép vị trí + chữ (cùng lý do
 * ghi ở XuongGiong: bộ dịch của trình duyệt sửa DOM và React vỡ giữa buổi).
 *
 * Kết quả chấm chỉ được tô khi danh sách từ KHỚP ĐÚNG câu đang hiện — người
 * dùng sửa câu sau khi thu thì kết quả cũ không còn nói về câu này nữa.
 */
export function CauAnh({ chu, cham }: { chu: string; cham?: ChamAnh | null }) {
  const manh = useMemo(() => chu.split(/(\s+)/), [chu]);
  const tuCau = manh.filter((t) => t.trim());
  const dungCau =
    !!cham?.tu?.length && cham.tu.length === tuCau.length && cham.tu.every((x, i) => x.tu === tuCau[i]);
  let w = 0;
  return (
    <>
      {manh.map((t, i) => {
        const key = `${i}-${t}`;
        if (!t.trim()) return <span key={key}>{t}</span>;
        const kq = dungCau ? cham!.tu[w]?.dung : undefined;
        w++;
        const mau =
          kq === true
            ? 'text-emerald-300'
            : kq === false
              ? 'rounded bg-red-500/20 text-red-300 underline decoration-red-400 decoration-2 underline-offset-4'
              : '';
        return (
          <span
            key={key}
            role="button"
            tabIndex={-1}
            onClick={() => void docMau(chuDeDoc(tron(t)), 0.75)}
            title="Bấm để nghe riêng từ này"
            className={`cursor-pointer hover:bg-white/10 ${mau}`}
          >
            {t}
          </span>
        );
      })}
    </>
  );
}

/** Nút nghe mẫu cả câu, 🐢 từng cụm, cụm bấm được, từ khó kèm IPA. */
export function NgheMauAnh({ chu }: { chu: string }) {
  const cum = useMemo(() => tachCum(chu), [chu]);
  const kho = useMemo(() => tuKhoTrongCau(chu), [chu]);
  const [dangCum, setDangCum] = useState<number | null>(null);
  // Số lượt đọc-từng-cụm: lượt mới (hoặc đổi câu) tăng số ⇒ vòng lặp của
  // lượt cũ tự thoát. Cờ true/false không đủ — bấm 🐢 hai lần thì lượt sau
  // đặt lại cờ và cả hai vòng cùng chạy, đọc chồng lên nhau.
  const luot = useRef(0);

  // Đổi câu / rời trang thì dừng giọng mẫu đang đọc dở.
  useEffect(() => {
    if (coDocMau()) window.speechSynthesis.getVoices();
    return () => {
      luot.current++;
      if (coDocMau()) window.speechSynthesis.cancel();
    };
  }, [chu]);

  const docCum = async () => {
    if (!coDocMau()) return;
    const cuaToi = ++luot.current;
    window.speechSynthesis.cancel();
    for (let i = 0; i < cum.length; i++) {
      if (luot.current !== cuaToi) return;
      setDangCum(i);
      await docMau(chuDeDoc(cum[i]), 0.7, false);
      await new Promise((r) => setTimeout(r, 450));
    }
    if (luot.current === cuaToi) setDangCum(null);
  };

  if (!coDocMau()) {
    return (
      <p className="mb-5 text-xs text-amber-300">
        Trình duyệt này không có giọng đọc mẫu (Web Speech API) — mở bằng Chrome hoặc Safari để nghe mẫu.
      </p>
    );
  }

  return (
    <div className="-mt-2 mb-5 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => docCauMau(chu)}
          title="Bấm lại trong 4 giây để nghe chậm hơn (phím N)"
          className="rounded-lg border border-sky-400/40 bg-sky-400/15 px-3 py-1.5 text-sm font-medium text-sky-100 hover:bg-sky-400/25"
        >
          🔊 Nghe mẫu cả câu <kbd className="ml-1 rounded bg-black/20 px-1 text-[10px]">N</kbd>
        </button>
        <button
          onClick={() => void docCum()}
          title="Đọc chậm từng cụm, nghỉ giữa các cụm"
          className="rounded-lg border border-sky-400/30 bg-sky-400/5 px-3 py-1.5 text-sm text-sky-200 hover:bg-sky-400/15"
        >
          🐢 Đọc từng cụm
        </button>
        <span className="text-xs text-[var(--text-secondary)]">bấm lại 🔊 trong 4 giây ⇒ chậm hơn · bấm một từ ⇒ nghe riêng từ đó</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {cum.map((c, i) => (
          <button
            key={`${i}-${c}`}
            onClick={() => void docMau(chuDeDoc(c), 0.7)}
            className={`rounded-md border px-2 py-0.5 text-sm ${
              dangCum === i
                ? 'border-sky-300 bg-sky-400/30 text-white'
                : 'border-white/10 bg-black/20 text-[var(--text-primary)] hover:bg-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {kho.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {kho.slice(0, 8).map((k) => (
            <span
              key={k.tu}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/25 bg-sky-400/[0.05] px-2 py-0.5 text-xs"
            >
              <span className="font-semibold text-sky-300">{k.tu}</span>
              <button
                type="button"
                onClick={() => void docMau(k.noi ?? k.tu, 0.75)}
                title="Nghe từ này"
                className="rounded px-0.5 hover:bg-white/10"
              >
                🔊
              </button>
              {k.tach && k.tach.length > 1 && (
                <button
                  type="button"
                  onClick={() => void docTungPhan(k.tach!)}
                  title={`Từng phần: ${k.tach.join(' · ')}`}
                  className="rounded px-0.5 hover:bg-white/10"
                >
                  🐢
                </button>
              )}
              <span className="font-mono text-[var(--text-secondary)]">{k.ipa}</span>
              <span className="text-[var(--text-secondary)]">≈ {k.viet}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Kết quả chấm một lượt thu câu Anh. */
export function KetQuaAnh({
  cham,
  nghe,
  onThuLai,
}: {
  cham: ChamAnh | null | undefined;
  nghe: string;
  onThuLai: () => void;
}) {
  if (!cham || cham.diem == null) {
    return (
      <p className="text-xs text-[var(--text-secondary)]">
        Chưa chấm được câu này (máy chấm bận hoặc không nghe ra) — đoạn thu vẫn đã lưu. Nghe lại ở nút phát.
      </p>
    );
  }
  const d = cham.diem;
  return (
    <div className="text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[var(--text-secondary)]">Khớp chữ (Whisper tiếng Anh, không mớm):</span>
        <span className={`text-sm font-semibold ${mauDiem(d)}`}>{Math.round(d * 100)}%</span>
      </div>
      <p className="mt-1 text-[var(--text-secondary)]">
        Whisper nghe thành: <span className="text-[var(--text-primary)]">“{nghe || '(không nghe ra gì)'}”</span>
      </p>
      {cham.sai.length > 0 && (
        <p className="mt-1 text-red-300">
          Từ nghe sai / thiếu: {cham.sai.map((t) => <span key={t} className="mr-1.5 rounded bg-red-500/15 px-1">{t}</span>)}
          <button onClick={() => void docMau(cham.sai.join(', '), 0.7)} className="ml-1 underline decoration-dotted">
            <Volume2 className="mr-0.5 inline h-3 w-3" />
            nghe mẫu các từ này
          </button>
        </p>
      )}
      {!!cham.thua?.length && (
        <p className="mt-1 text-amber-300">Nghe thừa (đọc thêm / vấp?): {cham.thua.join(', ')}</p>
      )}
      {d < NGUONG_ANH ? (
        <div className="mt-2 flex items-start gap-1.5 rounded border border-red-400/30 bg-red-500/10 px-2 py-1.5 text-red-200">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>
            Điểm thấp — có thể đọc sót hoặc vấp. Bấm 🔊 nghe mẫu cả câu rồi{' '}
            <button onClick={onThuLai} className="underline">
              thu lại
            </button>{' '}
            (phím R). Không bắt buộc: đoạn thu ĐÃ LƯU — Whisper nghe giọng Việt hay hụt cả chữ đọc đúng, tai anh là
            chốt cuối.
          </span>
        </div>
      ) : d < 1 ? (
        <p className="mt-1 text-amber-300">Gần đủ — xem từ đỏ trên câu; đọc đủ chữ là được, không cần giọng bản xứ.</p>
      ) : (
        <p className="mt-1 text-emerald-400">Đủ chữ, Whisper nghe ra hết — tốt.</p>
      )}
    </div>
  );
}
