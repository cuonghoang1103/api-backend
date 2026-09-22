'use client';

/**
 * ============================================================
 * HỎI CUONGMINI VỀ MỘT CÂU — khung dùng chung cho hai lối vào
 * ============================================================
 *
 * Người dùng 22/09/2026: *"khi vào quiz sẽ có icon AI kia ấn vào sẽ hiện all
 * câu hỏi tự chọn như slide giảng dạy chi tiết … ấn vào câu đó và để AI hướng
 * dẫn làm câu nó nếu không biết"*.
 *
 * Nên khung này làm đúng như khung robot ở bài slide:
 *  • "Hỏi theo câu" — danh sách MỌI câu trong bộ đang làm (như "Hỏi theo
 *    slide"), bấm một câu là nhảy tới câu đó;
 *  • chín câu hỏi dựng sẵn cho câu đang xem — bấm một cái, AI giảng ngay;
 *  • ô gõ tự do để hỏi tiếp.
 *
 * Hai vỏ, một khung:
 *  • `robot` = nằm trong con robot nổi: LUÔN nền tối, cao hết khung, ô nhập
 *    dính đáy — y như `GiaSuTrongRobot`;
 *  • mặc định = thẻ nằm ngay dưới câu hỏi, ăn theo chủ đề sáng/tối của web.
 *
 * ⚠️ Vỏ web chỉ dùng các biến chủ đề mà app desktop đã khai cầu nối
 * (`--bg-card`, `--bg-surface`, `--border-color`, `--text-*`, `--accent-color`,
 * `--exam-ok/bad`): `ChapterQuiz` — và khung này bên trong nó — được app dùng
 * lại, và một `var()` không giải được thì trình duyệt VỨT cả khai báo.
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import {
  AlertTriangle, BookOpen, Brain, CheckCircle2, ChevronDown, Circle, ClipboardList, Compass,
  Crown, Languages, Lightbulb, ListOrdered, Loader2, Repeat, Send, Sparkles, Trash2, User, X, XCircle,
} from 'lucide-react';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';
import type { CauTomTat } from '@/store/hoiCauLuyenStore';
import RobotAI from './RobotAI';
import { chipChoCau, useHoiCauLuyen, useLuotCua, type CheDoHoi } from './useHoiCauLuyen';

const BIEU_TUONG: Record<Exclude<CheDoHoi, 'free_qa'>, typeof Lightbulb> = {
  hint: Lightbulb,
  translate: Languages,
  how_to_solve: Compass,
  why_others_wrong: XCircle,
  knowledge: BookOpen,
  how_to_remember: Brain,
  common_mistakes: AlertTriangle,
  similar_example: Repeat,
  summary_rule: ClipboardList,
};

/** Bảng màu của hai vỏ. Tối = đúng bảng của khung robot (`GiaSuTrongRobot`). */
function bangMau(toi: boolean) {
  return toi
    ? {
      vien: 'rgba(34,211,238,0.16)', vienManh: 'rgba(34,211,238,0.4)',
      chu: '#e2e8f0', chuPhu: '#cbd5e1', chuMo: '#64748b', nhan: '#22d3ee',
      nenO: '#0d1117', nenNhap: '#0a0a0f', nenTra: '#0f172a', nenHoi: '#1e293b', nenNhan: 'rgba(34,211,238,0.12)',
      ok: '#4ade80', sai: '#f87171',
    }
    : {
      vien: 'var(--border-color)', vienManh: 'var(--accent-color, #8b5cf6)',
      chu: 'var(--text-primary)', chuPhu: 'var(--text-secondary)', chuMo: 'var(--text-muted)', nhan: 'var(--accent-color, #8b5cf6)',
      nenO: 'var(--bg-surface)', nenNhap: 'var(--bg-surface)', nenTra: 'var(--bg-surface-active, var(--bg-surface))', nenHoi: 'var(--bg-surface)',
      nenNhan: 'color-mix(in srgb, var(--accent-color, #8b5cf6) 12%, transparent)',
      ok: 'var(--exam-ok, #22c55e)', sai: 'var(--exam-bad, #ef4444)',
    };
}

// ── "Hỏi theo câu" — y khuôn "Hỏi theo slide" (`ChonSlide`) ──────────────
function ChonCau({ dsCau, idx, onChon, khoa, toi }: {
  dsCau: CauTomTat[]; idx: number; onChon: (i: number) => void; khoa?: boolean; toi: boolean;
}) {
  const [mo, datMo] = useState(false);
  const m = bangMau(toi);
  if (dsCau.length < 2) return null;
  const soXong = dsCau.filter((c) => c.trangThai !== 'chua').length;
  return (
    <div className="mb-2.5">
      <button
        type="button"
        onClick={() => datMo((v) => !v)}
        aria-expanded={mo}
        className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
        style={{ borderColor: m.vien, color: m.chuPhu, background: m.nenO }}
        title="Chọn câu khác để hỏi CuongMini — bộ đề đang làm"
      >
        <ListOrdered size={13} />
        Hỏi theo câu
        <span className="rounded-full px-1.5 text-[10px] font-bold" style={{ background: m.nenNhan, color: m.nhan }}>
          {soXong}/{dsCau.length}
        </span>
        <ChevronDown size={12} className={mo ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {mo && (
        /* `max-h` + cuộn: bộ "làm tất cả" có thể tới 200 câu. */
        <div className="mt-1.5 max-h-60 overflow-y-auto rounded-lg border" style={{ borderColor: m.vien, background: toi ? m.nenNhap : undefined }}>
          {dsCau.map((c, i) => {
            const dangXem = i === idx;
            return (
              <button
                key={c.id}
                type="button"
                disabled={khoa}
                onClick={() => { onChon(i); datMo(false); }}
                className="flex w-full items-center gap-2 border-b px-2.5 py-1.5 text-left last:border-b-0 disabled:opacity-40"
                style={{ borderColor: m.vien, background: dangXem ? m.nenNhan : undefined }}
                aria-current={dangXem ? 'true' : undefined}
              >
                {c.trangThai === 'dung'
                  ? <CheckCircle2 size={13} className="shrink-0" style={{ color: m.ok }} />
                  : c.trangThai === 'sai'
                    ? <XCircle size={13} className="shrink-0" style={{ color: m.sai }} />
                    : <Circle size={13} className="shrink-0" style={{ color: m.chuMo }} />}
                <span className="shrink-0 font-mono text-[10.5px] font-bold" style={{ color: m.nhan }}>Câu {c.soThuTu}</span>
                {/* `truncate` + `min-w-0`: đề dài không được kéo giãn khung. */}
                <span className="min-w-0 flex-1 truncate text-xs" style={{ color: m.chu }} title={c.tomTat}>
                  {c.tomTat || '(đề có hình/công thức)'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HoiAICauLuyen({ cau, dsCau, idx, onChonCau, onDong, robot = false, tieuDe }: {
  /** Câu đang hỏi. */
  cau: CauTomTat;
  /** Mọi câu trong bộ đang làm — cho mục "Hỏi theo câu". */
  dsCau: CauTomTat[];
  /** Vị trí `cau` trong `dsCau`. */
  idx: number;
  onChonCau: (i: number) => void;
  onDong?: () => void;
  /** `true` = nằm trong con robot nổi (nền tối, cao hết khung). */
  robot?: boolean;
  /** Tên chương — chỉ hiện ở vỏ robot, vì vỏ web đã nằm ngay dưới chương. */
  tieuDe?: string;
}) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { isPro } = usePro();
  const { hoi, dangHoi, xoaCuoc } = useHoiCauLuyen();
  const luot = useLuotCua(cau.id);
  const [nhap, datNhap] = useState('');
  const khungTroRef = useRef<HTMLDivElement>(null);
  const m = bangMau(robot);

  const daLam = cau.trangThai !== 'chua';
  const cauNayDangHoi = dangHoi === cau.id;
  const khoa = dangHoi != null;
  const chips = chipChoCau(daLam);

  /* Cuộn theo câu trả lời đang chảy — cuộn TRONG khung hội thoại, không cuộn
     cả trang: `scrollIntoView` ở vỏ web sẽ giật cả trang học xuống mỗi mẩu
     delta, người học đang đọc đề thì bị kéo đi mất. */
  useEffect(() => {
    const k = khungTroRef.current;
    if (k) k.scrollTop = k.scrollHeight;
  }, [luot]);

  // Đổi câu ⇒ dọn ô nhập (câu gõ dở là về câu cũ).
  useEffect(() => { datNhap(''); }, [cau.id]);

  const gui = () => {
    const q = nhap.trim();
    if (!q || khoa) return;
    datNhap('');
    void hoi(cau.id, 'free_qa', q);
  };

  const chipStyle: CSSProperties = { borderColor: m.vien, background: m.nenO, color: m.chuPhu };

  const khoiChip = (gon: boolean) => (
    /* Vỏ robot KHÔNG chia hai cột: khung robot chỉ rộng 390px trong khi màn
       hình vẫn to, nên `sm:` (theo bề ngang MÀN HÌNH) sẽ ép hai cột vào 390px. */
    <div className={gon ? 'flex flex-wrap gap-1.5' : robot ? 'grid gap-1.5' : 'grid gap-1.5 sm:grid-cols-2'}>
      {chips.map((c) => {
        const Icon = BIEU_TUONG[c.ma];
        return (
          <button
            key={c.ma}
            type="button"
            disabled={khoa}
            onClick={() => void hoi(cau.id, c.ma)}
            className={gon
              ? 'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors disabled:opacity-40'
              : 'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-[12.5px] leading-snug transition-colors hover:opacity-90 disabled:opacity-40'}
            style={chipStyle}
          >
            <Icon size={gon ? 12 : 14} className="shrink-0" style={{ color: m.nhan }} />
            <span className="min-w-0 flex-1">{c.nhan}</span>
            {/* Báo TRƯỚC khi bấm: chip này sẽ nói thẳng đáp án. */}
            {!daLam && c.loDapAn && !gon && (
              <span className="shrink-0 rounded px-1 text-[9.5px] font-semibold uppercase" style={{ background: m.nenNhan, color: m.chuMo }}>lộ đáp án</span>
            )}
          </button>
        );
      })}
    </div>
  );

  // ── Phần thân theo quyền ──
  let than: React.ReactNode;
  if (!isAuthed) {
    than = (
      <p className="text-sm" style={{ color: m.chuPhu }}>
        <Link href="/login" className="font-semibold underline" style={{ color: m.nhan }}>Đăng nhập</Link> để hỏi CuongMini về từng câu.
      </p>
    );
  } else if (!isPro) {
    than = (
      <div className="space-y-2">
        <p className="text-[13px] leading-relaxed" style={{ color: m.chuPhu }}>
          CuongMini giảng riêng từng câu: gợi ý không lộ đáp án, dịch đề sang tiếng Việt, cách làm từng bước,
          vì sao các đáp án khác sai… Đây là tính năng Pro.
        </p>
        <Link href="/pro" className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)' }}>
          <Crown size={14} /> Nâng cấp Pro để hỏi CuongMini
        </Link>
      </div>
    );
  } else {
    than = (
      <>
        {luot.length === 0 ? (
          <div>
            <p className="mb-2 text-xs font-medium" style={{ color: m.chuPhu }}>
              {daLam ? 'Bạn muốn hiểu thêm điều gì về câu này?' : 'Bí câu này? Chọn một câu hỏi — CuongMini hướng dẫn ngay:'}
            </p>
            {khoiChip(false)}
          </div>
        ) : (
          <>
            {/* Vỏ web: khối hội thoại TỰ cuộn (trần 520px). Vỏ robot: khung
                ngoài cao hết panel mới là thứ cuộn — ref gắn ở đó, xem dưới. */}
            <div ref={robot ? undefined : khungTroRef} className={robot ? 'space-y-3' : 'max-h-[520px] space-y-3 overflow-y-auto pr-1'}>
              {luot.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <span className="mt-1 shrink-0">
                    {t.role === 'user'
                      ? <User size={14} style={{ color: m.chuMo }} />
                      : <Sparkles size={14} style={{ color: m.nhan }} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`${t.role === 'user' ? '' : robot ? 'ct-robot-tra' : 'ct-answer'} rounded-xl px-3 py-2 text-[13.5px] leading-relaxed`}
                      /* ⚠️ `overflow-wrap:anywhere`: một khối mã dài hoặc URL liền
                         mạch sẽ đẩy rộng cả khung, người học phải cuộn ngang. */
                      style={{ background: t.role === 'user' ? m.nenHoi : m.nenTra, color: m.chu, overflowWrap: 'anywhere' }}
                    >
                      {t.role === 'user'
                        ? <span className="whitespace-pre-wrap">{t.content}</span>
                        : (t.streaming && !t.content)
                          ? <span className="inline-flex items-center gap-2 opacity-75"><Loader2 size={13} className="animate-spin" /> CuongMini đang soạn…</span>
                          : (
                            <>
                              {/* KaTeX chỉ dựng khi đã gõ xong — dựng lại ở mỗi
                                  mẩu delta thì công thức dở dang nhấp nháy. */}
                              <ChatMarkdown content={t.content} renderMath={!t.streaming} />
                              {t.streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse align-middle" style={{ background: m.nhan }} />}
                            </>
                          )}
                    </div>
                    {t.role === 'assistant' && t.cached && !t.streaming && (
                      <span className="mt-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10.5px]" style={{ background: m.nenNhan, color: m.nhan }}>
                        ⚡ Trả lời có sẵn
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t pt-2.5" style={{ borderColor: m.vien }}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: m.chuMo }}>Hỏi nhanh</p>
                <button type="button" onClick={() => xoaCuoc(cau.id)} disabled={khoa}
                  className="inline-flex items-center gap-1 text-[11px] disabled:opacity-40" style={{ color: m.chuMo }}
                  title="Xoá hội thoại của câu này">
                  <Trash2 size={11} /> Xoá hội thoại
                </button>
              </div>
              {khoiChip(true)}
            </div>
          </>
        )}
      </>
    );
  }

  const oNhap = isAuthed && isPro && (
    <div className="flex items-end gap-2">
      <textarea
        value={nhap}
        onChange={(e) => datNhap(e.target.value)}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return;   // Enter đang chốt chữ cho bộ gõ tiếng Việt
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); gui(); }
        }}
        rows={robot ? 2 : 1}
        placeholder={`Hỏi thêm về câu ${cau.soThuTu}… (VD: vì sao không chọn C?)`}
        className="min-w-0 flex-1 resize-none rounded-xl border px-3 py-2 text-[13px] outline-none"
        style={{ borderColor: m.vien, background: m.nenNhap, color: m.chu }}
      />
      <button
        type="button"
        onClick={gui}
        disabled={khoa || !nhap.trim()}
        aria-label="Gửi câu hỏi cho CuongMini"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white disabled:opacity-35"
        style={{ background: robot ? 'rgba(34,211,238,0.2)' : 'var(--accent-color, #8b5cf6)', color: robot ? '#22d3ee' : '#fff' }}
      >
        {cauNayDangHoi ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
      </button>
    </div>
  );

  const dau = (
    <div className="flex items-center gap-2.5">
      <RobotAI size={robot ? 30 : 34} dangNghi={cauNayDangHoi} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold" style={{ color: m.chu }}>CuongMini · Câu {cau.soThuTu}{dsCau.length > 1 ? `/${dsCau.length}` : ''}</p>
        <p className="truncate text-[11px]" style={{ color: m.chuMo }}>
          {robot && tieuDe ? tieuDe : 'AI hướng dẫn riêng câu này · trả lời bằng tiếng Việt'}
        </p>
      </div>
      {onDong && (
        <button type="button" onClick={onDong} aria-label="Đóng khung hỏi AI"
          className="shrink-0 rounded-lg p-1.5 transition-opacity hover:opacity-70" style={{ color: m.chuMo }}>
          <X size={15} />
        </button>
      )}
    </div>
  );

  // ── Vỏ robot: cao hết khung, ô nhập dính đáy (y như GiaSuTrongRobot) ──
  if (robot) {
    return (
      <>
        <div className="border-b px-4 py-2.5" style={{ borderColor: m.vien, background: 'rgba(34,211,238,0.05)' }}>{dau}</div>
        <div ref={khungTroRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3">
          <ChonCau dsCau={dsCau} idx={idx} onChon={onChonCau} khoa={khoa} toi />
          {than}
        </div>
        {oNhap && <div className="border-t px-3 py-2.5" style={{ borderColor: m.vien, background: 'rgba(13,17,23,0.7)' }}>{oNhap}</div>}
      </>
    );
  }

  // ── Vỏ web: thẻ ngay dưới câu hỏi ──
  return (
    <section
      aria-label={`Hỏi CuongMini về câu ${cau.soThuTu}`}
      className="rounded-xl border"
      style={{ borderColor: 'color-mix(in srgb, var(--accent-color, #8b5cf6) 45%, var(--border-color))', background: 'var(--bg-card)' }}
    >
      <div className="border-b px-3.5 py-2.5" style={{ borderColor: 'var(--border-color)' }}>{dau}</div>
      <div className="p-3.5">
        <ChonCau dsCau={dsCau} idx={idx} onChon={onChonCau} khoa={khoa} toi={false} />
        {than}
        {oNhap && <div className="mt-3">{oNhap}</div>}
      </div>
    </section>
  );
}
