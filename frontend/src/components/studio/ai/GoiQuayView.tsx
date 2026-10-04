'use client';

/**
 * Hiển thị một GÓI QUAY do AI soạn — dùng chung cho "Quay khoá học", "Ý tưởng AI"
 * và tab "Trợ lý AI" trong trình sửa dự án.
 *
 * Bố cục cho màn rộng (app desktop 1280–1920px): cột trái là dòng thời gian
 * các cảnh (lời thoại to, đọc được từ xa), cột phải dính là "bàn đạo diễn":
 * mục tiêu, chuẩn bị, thiết lập máy, câu hỏi, YouTube.
 */
import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Camera,
  Check,
  ClipboardList,
  Code2,
  Copy,
  Film,
  HelpCircle,
  Lightbulb,
  Monitor,
  Settings2,
  Target,
  Type,
  Youtube,
} from 'lucide-react';
import {
  KHUNG_NHAN,
  LOAI_CANH_NHAN,
  chepChu,
  mocGio,
  type GoiQuay,
  type LoaiCanh,
} from '@/lib/creator-ai';
import css from './creatorAi.module.css';

const MAU_LOAI: Record<LoaiCanh, string> = {
  HOOK: '#f59e0b',
  INTRO: '#60a5fa',
  BODY: '#a78bfa',
  DEMO: '#34d399',
  MISTAKE: '#f87171',
  RECAP: '#22d3ee',
  QUIZ: '#f472b6',
  CTA: '#fb923c',
  OUTRO: '#94a3b8',
};

function NutChep({ text, nhan = 'Chép' }: { text: string; nhan?: string }) {
  const [da, setDa] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await chepChu(text)) {
          setDa(true);
          setTimeout(() => setDa(false), 1400);
        }
      }}
      className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-medium text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
      title={nhan}
    >
      {da ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {da ? 'Đã chép' : nhan}
    </button>
  );
}

function The({ tieuDe, icon: Icon, children, phai }: { tieuDe: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; phai?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-darkborder bg-darkcard p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-4 h-4 text-studio-400" />
        <h3 className="text-[13px] font-semibold text-text-primary flex-1">{tieuDe}</h3>
        {phai}
      </div>
      {children}
    </section>
  );
}

export default function GoiQuayView({ goi, nhan }: { goi: GoiQuay; nhan?: string }) {
  const tong = useMemo(() => goi.canh.reduce((s, c) => s + c.giay, 0), [goi]);
  const moc = useMemo(() => {
    let t = 0;
    return goi.canh.map((c) => {
      const tu = t;
      t += c.giay;
      return [tu, t] as const;
    });
  }, [goi]);
  const loiTatCa = useMemo(() => goi.canh.map((c) => c.loi).filter(Boolean).join('\n\n'), [goi]);
  const soTu = useMemo(() => loiTatCa.trim().split(/\s+/).filter(Boolean).length, [loiTatCa]);

  return (
    <div className={`${css.goi} space-y-4`}>
      {/* Đầu gói: tiêu đề + chữ thumbnail + số liệu */}
      <div className="rounded-2xl border border-studio-500/25 bg-darkcard p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-muted mb-2">
          <span className="inline-flex items-center gap-1 px-2 h-6 rounded-full bg-studio-500/15 text-studio-300 font-semibold">
            <Film className="w-3 h-3" /> Gói quay AI
          </span>
          {nhan && <span className="truncate max-w-[520px]">{nhan}</span>}
          <span>· {goi.canh.length} cảnh</span>
          <span>· ≈ {mocGio(tong)} phút</span>
          <span>· {soTu.toLocaleString('vi-VN')} từ lời thoại</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary leading-snug">
          {goi.tieuDe[0] || 'Gói quay'}
        </h2>
        {goi.tomTat && <p className="mt-1.5 text-sm text-text-secondary max-w-3xl">{goi.tomTat}</p>}
        {goi.tieuDe.length > 1 && (
          <div className="mt-3">
            <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Tiêu đề khác</p>
            <div className="flex flex-wrap gap-1.5">
              {goi.tieuDe.slice(1).map((t) => (
                <button key={t} type="button" onClick={() => void chepChu(t)} title="Bấm để chép"
                  className="px-2.5 h-7 rounded-lg border border-darkborder text-xs text-text-secondary hover:text-text-primary hover:border-studio-500/40 transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
        {goi.chuThumbnail.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Chữ thumbnail</p>
            <div className="flex flex-wrap gap-1.5">
              {goi.chuThumbnail.map((t) => (
                <button key={t} type="button" onClick={() => void chepChu(t)} title="Bấm để chép"
                  className="px-2.5 h-7 rounded-lg bg-studio-500/10 text-studio-200 text-xs font-bold uppercase tracking-wide hover:bg-studio-500/20 transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {goi.canBoSung.length > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2 text-amber-200 font-semibold text-sm mb-1.5">
            <AlertTriangle className="w-4 h-4" />
            Nguồn chưa đủ — cần bạn bổ sung trước khi quay
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-[13px] text-amber-100/90">
            {goi.canBoSung.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <p className="mt-2 text-[11px] text-amber-200/70">Trong lời thoại, những chỗ này được đánh dấu “[CẦN BỔ SUNG: …]”.</p>
        </div>
      )}

      <div className={css.goiLuoi}>
        {/* Dòng thời gian cảnh */}
        <ol className="space-y-3 min-w-0">
          {goi.canh.map((c, i) => (
            <li key={i} className={`${css.canh} rounded-2xl border border-darkborder bg-darkcard overflow-hidden`}>
              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-darkborder" style={{ boxShadow: `inset 3px 0 0 ${MAU_LOAI[c.loai]}` }}>
                <span className="font-heading text-sm font-bold text-text-muted tabular-nums w-6">{i + 1}</span>
                <span className="px-2 h-5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center"
                  style={{ background: `${MAU_LOAI[c.loai]}22`, color: MAU_LOAI[c.loai] }}>
                  {LOAI_CANH_NHAN[c.loai]}
                </span>
                <h4 className="text-sm font-semibold text-text-primary truncate flex-1">{c.ten}</h4>
                <span className="text-[11px] text-text-muted tabular-nums shrink-0">
                  {mocGio(moc[i][0])}–{mocGio(moc[i][1])} · {c.giay}s
                </span>
              </div>
              <div className={css.canhLuoi}>
                <div className="p-4 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Lời thoại</span>
                    {c.loi && <NutChep text={c.loi} />}
                  </div>
                  <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-wrap">
                    {c.loi || <span className="italic text-text-muted">(cảnh không lời — chỉ hình)</span>}
                  </p>
                  {c.ma && (
                    <div className="mt-3 rounded-xl border border-darkborder bg-black/40 overflow-hidden">
                      <div className="flex items-center justify-between px-3 h-8 border-b border-darkborder">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted"><Code2 className="w-3.5 h-3.5" /> Code trên màn hình</span>
                        <NutChep text={c.ma} />
                      </div>
                      <pre className="p-3 text-[12.5px] leading-relaxed text-emerald-100 overflow-x-auto font-mono"><code>{c.ma}</code></pre>
                    </div>
                  )}
                </div>
                <dl className={`${css.canhMeta} p-4 space-y-2.5 text-[12.5px] bg-white/[0.015]`}>
                  <div>
                    <dt className="flex items-center gap-1.5 text-text-muted text-[11px] font-semibold"><Camera className="w-3.5 h-3.5" /> {KHUNG_NHAN[c.khungHinh]}</dt>
                    {c.gocMay && <dd className="text-text-secondary mt-0.5">{c.gocMay}</dd>}
                  </div>
                  {c.manHinh && (
                    <div>
                      <dt className="flex items-center gap-1.5 text-text-muted text-[11px] font-semibold"><Monitor className="w-3.5 h-3.5" /> Màn hình</dt>
                      <dd className="text-text-secondary mt-0.5">{c.manHinh}</dd>
                    </div>
                  )}
                  {c.chuTrenManHinh && (
                    <div>
                      <dt className="flex items-center gap-1.5 text-text-muted text-[11px] font-semibold"><Type className="w-3.5 h-3.5" /> Chữ trên màn hình</dt>
                      <dd className="text-studio-200 font-semibold mt-0.5">{c.chuTrenManHinh}</dd>
                    </div>
                  )}
                  {c.broll && (
                    <div>
                      <dt className="flex items-center gap-1.5 text-text-muted text-[11px] font-semibold"><Film className="w-3.5 h-3.5" /> B-roll</dt>
                      <dd className="text-text-secondary mt-0.5">{c.broll}</dd>
                    </div>
                  )}
                  {c.nguon && (
                    <div>
                      <dt className="flex items-center gap-1.5 text-text-muted text-[11px] font-semibold"><ClipboardList className="w-3.5 h-3.5" /> Nguồn trong bài</dt>
                      <dd className="text-text-muted mt-0.5 italic">{c.nguon}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </li>
          ))}
        </ol>

        {/* Bàn đạo diễn */}
        <aside className={css.banDaoDien}>
          {goi.mucTieu.length > 0 && (
            <The tieuDe="Mục tiêu bài" icon={Target}>
              <ul className="space-y-1 text-[13px] text-text-secondary list-disc pl-4">
                {goi.mucTieu.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </The>
          )}
          {goi.chuanBi.length > 0 && (
            <The tieuDe="Chuẩn bị trước khi bấm máy" icon={Lightbulb}>
              <ul className="space-y-1 text-[13px] text-text-secondary">
                {goi.chuanBi.map((x) => (
                  <li key={x} className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-studio-400 shrink-0" />{x}</li>
                ))}
              </ul>
            </The>
          )}
          {(goi.thietLap.boCuc || goi.thietLap.anhSang || goi.thietLap.amThanh || goi.thietLap.manHinh) && (
            <The tieuDe="Thiết lập quay" icon={Settings2}>
              <dl className="space-y-1.5 text-[13px]">
                {([['Bố cục', goi.thietLap.boCuc], ['Ánh sáng', goi.thietLap.anhSang], ['Âm thanh', goi.thietLap.amThanh], ['Màn hình', goi.thietLap.manHinh]] as const)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}><dt className="text-[11px] text-text-muted font-semibold">{k}</dt><dd className="text-text-secondary">{v}</dd></div>
                  ))}
              </dl>
            </The>
          )}
          {goi.cauHoi.length > 0 && (
            <The tieuDe="Câu hỏi nhanh" icon={HelpCircle}>
              <ol className="space-y-2 text-[13px] list-decimal pl-4">
                {goi.cauHoi.map((q) => (
                  <li key={q.hoi} className="text-text-secondary">
                    {q.hoi}
                    <div className="text-[12px] text-emerald-300/90 mt-0.5">→ {q.dapAn}</div>
                  </li>
                ))}
              </ol>
            </The>
          )}
          {(goi.youtube.moTa || goi.youtube.the.length > 0) && (
            <The tieuDe="YouTube" icon={Youtube} phai={<NutChep text={[goi.youtube.moTa, goi.youtube.the.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ')].filter(Boolean).join('\n\n')} />}>
              {goi.youtube.moTa && <p className="text-[13px] text-text-secondary whitespace-pre-wrap">{goi.youtube.moTa}</p>}
              {goi.youtube.the.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {goi.youtube.the.map((t) => (
                    <span key={t} className="px-1.5 h-5 rounded bg-white/5 text-[11px] text-text-muted inline-flex items-center">#{t}</span>
                  ))}
                </div>
              )}
              <p className="mt-2 text-[11px] text-text-muted">Mốc chương được tự thêm vào bài đăng YouTube của dự án.</p>
            </The>
          )}
          <The tieuDe="Toàn bộ lời thoại" icon={Film} phai={<NutChep text={loiTatCa} nhan="Chép hết" />}>
            <p className="text-[12px] text-text-muted">Dán vào máy nhắc chữ ngoài, hoặc mở tab Teleprompter của dự án.</p>
          </The>
        </aside>
      </div>
    </div>
  );
}
