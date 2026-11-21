'use client';
/**
 * 🛠 Khối "Nộp mốc" — vẽ dưới bài có `mocDuAn` (docs/du-an-hop-dong.md §2): đề tài đã chọn + phần mốc này xây cho đề
 * tài đó, yêu cầu / nâng cao / "Đạt khi" (tick tự kiểm) / gợi ý theo tầng, form nộp link + ghi chú, trạng thái.
 * Máy chủ kiểm lại mọi điều kiện (repo/demo theo `nop`, tick đủ "Đạt khi") — ở đây chỉ để người học thấy trước.
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle2, Lightbulb, Loader2 } from 'lucide-react';
import { duAnApi } from '@/lib/api';
import { pickLang } from '@/lib/utils';
import type { DuAnTraVe, MocDuAn } from '@/lib/duAn';
import { chuDuAn } from './chu';
import { loiCua } from './useDuAn';
import { Chip, DanhSach, Html, NutChinh, NutPhu, oNhap, The, ThanhTienDo, TieuDeKhoi } from './ui';

type Locale = 'en' | 'vi';

export default function KhoiNopMoc({
  slug, data, moc, locale, onData, onXong, denBai,
}: {
  slug: string; data: DuAnTraVe; moc: MocDuAn; locale: Locale; onData: (d: DuAnTraVe) => void;
  /** Mốc vừa XONG ⇒ trang học đánh dấu bài hoàn thành. */
  onXong?: () => void;
  /** Nhảy tới bài theo slug (bài đăng ký đề tài). */
  denBai?: (lessonSlug: string) => void;
}) {
  const t = chuDuAn(locale);
  const duAn = data.duAn!;
  const ct = data.cuaToi;
  const lc = ct?.luaChon ?? null;
  const cua = ct?.moc[moc.slug];
  const [repoUrl, setRepo] = useState(cua?.repoUrl ?? '');
  const [demoUrl, setDemo] = useState(cua?.demoUrl ?? '');
  const [anhUrl, setAnh] = useState(cua?.anhUrl ?? '');
  const [ghiChu, setGhiChu] = useState(cua?.ghiChu ?? '');
  const [tick, setTick] = useState<Set<number>>(new Set(cua?.tuKiem ?? []));
  const [soGoiY, setSoGoiY] = useState(0);
  const [gui, setGui] = useState<'nhap' | 'xong' | null>(null);

  // Đổi bài (component được dùng lại cho mốc khác) ⇒ nạp lại form từ dữ liệu của mốc mới.
  useEffect(() => {
    setRepo(cua?.repoUrl ?? ''); setDemo(cua?.demoUrl ?? ''); setAnh(cua?.anhUrl ?? ''); setGhiChu(cua?.ghiChu ?? '');
    setTick(new Set(cua?.tuKiem ?? [])); setSoGoiY(0);
  }, [moc.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const deTaiGoiY = lc?.loai === 'GOI_Y' ? duAn.deTai.find((d) => d.slug === lc.deTaiSlug) : undefined;
  const phanCuaDeTai = deTaiGoiY?.banDoChuong.filter((b) => b.moc === moc.so) ?? [];
  const xong = cua?.trangThai === 'XONG';
  const duTick = moc.datKhi.every((_, i) => tick.has(i));
  const thieuRepo = moc.nop.includes('repo') && !repoUrl.trim();
  const thieuDemo = moc.nop.includes('demo') && !demoUrl.trim();

  const nop = async (laXong: boolean) => {
    setGui(laXong ? 'xong' : 'nhap');
    try {
      const r = await duAnApi.nopMoc(slug, moc.slug, {
        repoUrl: repoUrl.trim(), demoUrl: demoUrl.trim(), anhUrl: anhUrl.trim(), ghiChu: ghiChu.trim(),
        tuKiem: [...tick].sort((a, b) => a - b), xong: laXong,
      });
      onData(r.data.data);
      if (laXong) { toast.success(t.daNopXong); onXong?.(); } else toast.success(t.daLuu);
    } catch (e) { toast.error(loiCua(e, 'Chưa nộp được mốc.')); } finally { setGui(null); }
  };

  const trangThai = cua?.trangThai ?? null;
  return (
    <The id="nop-moc">
      <TieuDeKhoi phu={<Chip mau={xong ? 'emerald' : trangThai === 'DANG_LAM' ? 'amber' : 'xam'}>{t.trangThaiMoc[String(trangThai)]}</Chip>}>
        {t.nopMocTieuDe(moc.so)} — {pickLang(moc.ten, locale).replace(/^🛠\s*/, '').replace(/^(Mốc|Milestone)\s*\d+\s*[—–:-]\s*/i, '')}
      </TieuDeKhoi>

      {!lc ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="min-w-0 text-sm text-text-secondary">{t.chuaChonDeTai}</p>
          {duAn.bai.dangKy[0] && denBai && (
            <NutChinh onClick={() => denBai(duAn.bai.dangKy[0])}>{t.denBaiDangKy}<ArrowRight className="h-4 w-4" aria-hidden /></NutChinh>
          )}
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-neon-violet/30 bg-neon-violet/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-tone-violet">{t.apVaoDeTai}</p>
          <p className="mt-0.5 break-words font-semibold text-text-primary">{pickLang(lc.ten, locale)}</p>
          {phanCuaDeTai.length > 0 && (
            <p className="mt-1 break-words text-sm text-text-secondary">
              <span className="text-text-muted">{t.voiDeTaiNay}: </span>
              {phanCuaDeTai.map((b, i) => <Html key={i} s={b.dung} locale={locale} />)}
            </p>
          )}
          {ct && <div className="mt-3"><ThanhTienDo phanTram={ct.tienDo.phanTram} nhan={t.mocXong(ct.tienDo.xong, ct.tienDo.tong)} /></div>}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-semibold text-text-primary">{t.batBuoc}</p>
          <DanhSach ds={moc.yeuCau} locale={locale} />
          {moc.nangCao.length > 0 && (
            <>
              <p className="mb-2 mt-4 text-sm font-semibold text-text-primary">{t.nangCao}</p>
              <DanhSach ds={moc.nangCao} locale={locale} dau="☆" />
            </>
          )}
        </div>
        <div className="min-w-0">
          <p className="mb-2 text-sm font-semibold text-text-primary">{t.datKhi}</p>
          <ul className="space-y-1.5">
            {moc.datKhi.map((x, i) => (
              <li key={i}>
                <label className="flex min-w-0 cursor-pointer gap-2.5 rounded-lg p-1.5 text-sm leading-relaxed text-text-secondary hover:bg-white/5">
                  <input
                    type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#8b5cf6]" checked={tick.has(i)}
                    onChange={(e) => setTick((s) => { const n = new Set(s); if (e.target.checked) n.add(i); else n.delete(i); return n; })}
                  />
                  <Html s={x} locale={locale} className={`min-w-0 break-words ${tick.has(i) ? 'text-text-primary' : ''}`} />
                </label>
              </li>
            ))}
          </ul>
          {moc.goiY.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-text-primary"><Lightbulb className="h-4 w-4 text-tone-amber" aria-hidden />{t.goiYTang}</p>
              {moc.goiY.slice(0, soGoiY).map((g, i) => (
                <Html key={i} as="p" s={g} locale={locale} className="mb-1.5 break-words rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-text-secondary" />
              ))}
              {soGoiY < moc.goiY.length && (
                <button type="button" onClick={() => setSoGoiY((n) => n + 1)} className="text-xs font-medium text-tone-amber hover:underline">
                  {t.moGoiY(soGoiY + 1)}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <form className="mt-5 grid gap-3 border-t border-darkborder/60 pt-5" onSubmit={(e) => { e.preventDefault(); void nop(true); }}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid min-w-0 gap-1 text-sm text-text-secondary">
            <span>{t.linkRepo}{moc.nop.includes('repo') && <span className="ml-1 text-xs text-tone-rose">({t.batBuocNhan})</span>}</span>
            <input className={oNhap} type="url" inputMode="url" value={repoUrl} onChange={(e) => setRepo(e.target.value)} placeholder="https://github.com/…" maxLength={500} />
          </label>
          <label className="grid min-w-0 gap-1 text-sm text-text-secondary">
            <span>{t.linkDemo}{moc.nop.includes('demo') && <span className="ml-1 text-xs text-tone-rose">({t.batBuocNhan})</span>}</span>
            <input className={oNhap} type="url" inputMode="url" value={demoUrl} onChange={(e) => setDemo(e.target.value)} placeholder="https://….vercel.app" maxLength={500} />
          </label>
          {moc.nop.includes('anh') && (
            <label className="grid min-w-0 gap-1 text-sm text-text-secondary sm:col-span-2">{t.linkAnh}
              <input className={oNhap} type="url" inputMode="url" value={anhUrl} onChange={(e) => setAnh(e.target.value)} placeholder="https://…" maxLength={500} />
            </label>
          )}
        </div>
        <label className="grid gap-1 text-sm text-text-secondary">{t.ghiChu}
          <textarea className={`${oNhap} min-h-[80px] resize-y`} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} maxLength={3000} />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <NutChinh type="submit" disabled={!lc || !!gui || !duTick || thieuRepo || thieuDemo}
            title={!duTick ? t.datKhi : undefined}>
            {gui === 'xong' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <CheckCircle2 className="h-4 w-4" aria-hidden />}
            {t.nopXong}
          </NutChinh>
          <NutPhu onClick={() => void nop(false)} disabled={!lc || !!gui}>
            {gui === 'nhap' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}{xong ? t.boDanhDau : t.luuNhap}
          </NutPhu>
          {cua?.nopLuc && (
            <span className="text-xs text-text-muted">{new Date(cua.xongLuc ?? cua.nopLuc).toLocaleString(locale === 'en' ? 'en-GB' : 'vi-VN')}</span>
          )}
        </div>
      </form>
    </The>
  );
}
