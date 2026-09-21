'use client';

/**
 * Tờ "Coding check sheet" của thầy, đặt cạnh bài đang làm.
 *
 * Thầy review bằng đúng tờ giấy này: mỗi bài ba cột tự soát, mục nào OK thì
 * điền "O", cả cột đủ "O" mới được xin review. Bảng này làm y như vậy:
 *
 *   • cột "Tự soát" — người học tự chạm để điền "O" trong lúc code (lưu trong
 *     trình duyệt của họ, theo từng bài);
 *   • cột "AI chấm" — kết quả lần nộp gần nhất: máy đo từng dòng + AI phán,
 *     đã ghép ở backend (`ghepChecklist`).
 *
 * Danh sách 25 mục KHÔNG chép ở đây: backend giữ bản duy nhất (`checklistThay.ts`)
 * và trả qua API — chép ra chỗ thứ hai là lần sau thầy đổi một mục, bảng này
 * âm thầm dạy sai.
 */
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ClipboardList } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { ChecklistThayMuc, KetChecklist, LabRoomChecklistRow, LabRoomReview } from '@/types/code-lab';

/** Cache trong module: 25 mục là hằng số, tải một lần cho cả phiên. */
let boNho: ChecklistThayMuc[] | null = null;

const NHOM: Array<ChecklistThayMuc['nhom']> = ['Common', 'Coding Convention', 'Performance'];

const MAU: Record<KetChecklist, { nhan: string; mau: string }> = {
  dat: { nhan: 'Đạt', mau: '#2563eb' },
  truot: { nhan: 'Trượt', mau: '#dc2626' },
  ruiRo: { nhan: 'Rủi ro', mau: '#d97706' },
};

/** Vòng "O" như nét bút bi thầy dặn điền; ✗ / ! cho trượt và rủi ro. */
function DauCham({ ket, title }: { ket: KetChecklist | null; title: string }) {
  if (!ket) {
    return <span title={title} aria-label={title} className="inline-block h-[22px] w-[22px] rounded-full border border-dashed" style={{ borderColor: 'var(--border-color)' }} />;
  }
  if (ket === 'dat') {
    return (
      <span title={title} aria-label={title} className="inline-grid h-[22px] w-[22px] place-items-center"
        style={{ border: '2.2px solid #2563eb', borderRadius: '48% 52% 50% 47% / 52% 47% 53% 48%', transform: 'rotate(-9deg)' }} />
    );
  }
  const m = MAU[ket];
  return (
    <span title={title} aria-label={title} className="inline-grid h-[22px] w-[22px] place-items-center rounded text-[13px] font-bold"
      style={{ color: m.mau, background: `color-mix(in srgb, ${m.mau} 14%, transparent)` }}>
      {ket === 'truot' ? '✗' : '!'}
    </span>
  );
}

export function ChecklistThay({ itemId, ketQua, chuY }: {
  itemId: number;
  ketQua: LabRoomReview | null;
  /** stt các mục mà phần giảng đề nói đề này dễ trượt — tô đậm để để ý. */
  chuY?: string[];
}) {
  const [muc, setMuc] = useState<ChecklistThayMuc[] | null>(boNho);
  const [loi, setLoi] = useState(false);
  const [dangMo, setDangMo] = useState<string | null>(null);
  const [tuSoat, setTuSoat] = useState<Record<string, boolean>>({});
  const khoa = `phong-lab-tu-soat:${itemId}`;

  useEffect(() => {
    if (boNho) return;
    codeLabApi.checklistThay()
      .then((r) => { boNho = r.data.data.muc; setMuc(boNho); })
      .catch(() => setLoi(true));
  }, []);

  useEffect(() => {
    try {
      setTuSoat(JSON.parse(localStorage.getItem(khoa) || '{}') || {});
    } catch {
      setTuSoat({});
    }
  }, [khoa]);

  function lat(stt: string) {
    setTuSoat((cu) => {
      const moi = { ...cu, [stt]: !cu[stt] };
      if (!moi[stt]) delete moi[stt];
      try { localStorage.setItem(khoa, JSON.stringify(moi)); } catch { /* chế độ riêng tư: vẫn chạy, chỉ không nhớ */ }
      return moi;
    });
  }

  const theoStt = useMemo(
    () => new Map<string, LabRoomChecklistRow>((ketQua?.checklist || []).map((r) => [r.stt, r])),
    [ketQua],
  );
  const coKetQuaMoi = !!ketQua?.checklist?.length && !ketQua._cuLuat;
  const dem = useMemo(() => {
    const d = { dat: 0, truot: 0, ruiRo: 0 };
    for (const r of ketQua?.checklist || []) d[r.ket] += 1;
    return d;
  }, [ketQua]);
  const soTuSoat = Object.values(tuSoat).filter(Boolean).length;
  const chuYSet = new Set(chuY || []);

  return (
    <div className="rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <header className="border-b px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          <ClipboardList size={16} style={{ color: 'var(--cl-accent, var(--accent-color))' }} />
          Tờ checklist của thầy
        </div>
        <p className="mt-1 text-[11.5px] leading-snug" style={{ color: 'var(--text-muted)' }}>
          {coKetQuaMoi
            ? <>Lần nộp gần nhất: <b style={{ color: '#2563eb' }}>{dem.dat}</b> đạt · <b style={{ color: '#dc2626' }}>{dem.truot}</b> trượt · <b style={{ color: '#d97706' }}>{dem.ruiRo}</b> rủi ro. Còn một ✗ là thầy chưa review.</>
            : ketQua
              ? 'Kết quả chấm cũ chưa có 25 mục này — nộp lại để AI chấm theo tờ giấy.'
              : 'Chưa nộp bài. Tự soát trước: chạm ô “Tự soát” để điền O, đủ 25 mới gọi thầy.'}
        </p>
        <p className="mt-1 text-[11.5px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
          Tự soát: <b style={{ color: soTuSoat === 25 ? '#2563eb' : 'var(--text-secondary)' }}>{soTuSoat}/25</b>
        </p>
      </header>

      {loi && <p className="px-4 py-3 text-xs" style={{ color: '#dc2626' }}>Chưa tải được tờ checklist.</p>}

      {muc && (
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="sticky top-0 z-[1] grid grid-cols-[minmax(0,1fr)_44px_44px] gap-1 border-b px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
            <span>Mục</span><span className="text-center">Tự soát</span><span className="text-center">AI chấm</span>
          </div>
          {NHOM.map((nhom) => (
            <section key={nhom}>
              <h4 className="border-b px-3 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}>
                {nhom}
              </h4>
              {muc.filter((m) => m.nhom === nhom).map((m) => {
                const r = theoStt.get(m.stt) || null;
                const moRong = dangMo === m.stt;
                const ketAi = coKetQuaMoi && r ? r.ket : null;
                return (
                  <div key={m.stt} className="border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="grid grid-cols-[minmax(0,1fr)_44px_44px] items-center gap-1 px-3 py-2">
                      <button type="button" onClick={() => setDangMo(moRong ? null : m.stt)}
                        className="flex min-w-0 items-start gap-1.5 text-left" aria-expanded={moRong}>
                        <span className="w-8 shrink-0 font-mono text-[11.5px] font-bold tabular-nums"
                          style={{ color: chuYSet.has(m.stt) ? 'var(--cl-accent, var(--accent-color))' : 'var(--text-primary)' }}>{m.stt}</span>
                        <span className="min-w-0 flex-1 text-[12px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                          {m.ngan}
                          {chuYSet.has(m.stt) && <span className="ml-1 rounded px-1 text-[9.5px] font-bold" style={{ color: 'var(--cl-accent, var(--accent-color))', background: 'color-mix(in srgb, var(--cl-accent, var(--accent-color)) 12%, transparent)' }}>đề này dễ trượt</span>}
                        </span>
                        <ChevronDown size={13} className="mt-0.5 shrink-0 transition-transform" style={{ color: 'var(--text-muted)', transform: moRong ? 'rotate(180deg)' : undefined }} />
                      </button>
                      <button type="button" onClick={() => lat(m.stt)} aria-pressed={!!tuSoat[m.stt]}
                        aria-label={`Tự soát mục ${m.stt}`}
                        className="mx-auto grid h-7 w-7 place-items-center rounded-full transition-transform active:scale-90">
                        <DauCham ket={tuSoat[m.stt] ? 'dat' : null} title={tuSoat[m.stt] ? 'Đã tự soát' : 'Chưa tự soát'} />
                      </button>
                      <span className="grid place-items-center">
                        <DauCham ket={ketAi} title={ketAi ? `AI chấm: ${MAU[ketAi].nhan}` : 'Chưa chấm'} />
                      </span>
                    </div>
                    {moRong && (
                      <div className="space-y-2 px-3 pb-3 text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <blockquote className="rounded-lg border-l-2 px-2 py-1 italic" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
                          “{m.nguyenVan}”
                        </blockquote>
                        <p><b style={{ color: 'var(--text-primary)' }}>Làm đúng:</b> {m.cachDung}</p>
                        {r && coKetQuaMoi && (
                          <div className="rounded-lg border px-2 py-1.5" style={{ borderColor: `color-mix(in srgb, ${MAU[r.ket].mau} 35%, transparent)` }}>
                            <p className="font-semibold" style={{ color: MAU[r.ket].mau }}>
                              AI chấm: {MAU[r.ket].nhan}
                              {r.file && <span className="ml-1 font-mono text-[10.5px] font-normal" style={{ color: 'var(--text-muted)' }}>{r.file}{r.dong ? `:${r.dong}` : ''}</span>}
                            </p>
                            {r.chiTiet && <p className="mt-0.5">{r.chiTiet}</p>}
                            {r.bangChung.length > 0 && (
                              <ul className="mt-1 space-y-0.5">
                                {r.bangChung.map((b, i) => (
                                  <li key={i} className="flex gap-1.5 text-[11px]">
                                    <span style={{ color: MAU[b.ket].mau }}>{b.ket === 'truot' ? '✗' : '!'}</span>
                                    <span className="min-w-0"><span className="font-mono" style={{ color: 'var(--text-muted)' }}>{b.file}{b.dong ? `:${b.dong}` : ''}</span> {b.ghiChu}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
