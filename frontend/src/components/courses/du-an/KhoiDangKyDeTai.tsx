'use client';
/**
 * 🎯 Khối "Đăng ký đề tài" — vẽ dưới bài có `dangKyDuAn` (docs/du-an-hop-dong.md §2).
 * ≥ 5 thẻ đề tài gợi ý (chọn / đổi có xác nhận) + ô đề tài tự chọn gửi AI duyệt + lịch sử đề tài.
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, ChevronDown, ChevronUp, History, Loader2, Map as MapIcon, Sparkles } from 'lucide-react';
import { duAnApi } from '@/lib/api';
import { pickLang } from '@/lib/utils';
import { tachDong, type DeTaiGoiY, type DuAnKhoa, type DuAnTraVe } from '@/lib/duAn';
import { chuDuAn } from './chu';
import { loiCua } from './useDuAn';
import { Chip, DanhSach, Html, NutChinh, NutPhu, oNhap, The, ThanhTienDo, TieuDeKhoi } from './ui';

type Locale = 'en' | 'vi';

function DoKho({ muc, locale }: { muc: 1 | 2 | 3; locale: Locale }) {
  const t = chuDuAn(locale);
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted" title={t.doKho[muc]}>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => <span key={i} className={`h-1.5 w-3 rounded-full ${i <= muc ? 'bg-neon-violet' : 'bg-darkborder'}`} />)}
      </span>
      {t.doKho[muc]}
    </span>
  );
}

function TheDeTai({
  d, duAn, locale, dangChon, coDeTaiKhac, tenHienTai, dangGui, onChon,
}: {
  d: DeTaiGoiY; duAn: DuAnKhoa; locale: Locale; dangChon: boolean; coDeTaiKhac: boolean; tenHienTai: string;
  dangGui: boolean; onChon: () => void;
}) {
  const t = chuDuAn(locale);
  const [moRong, setMoRong] = useState(false);
  const [banDo, setBanDo] = useState(false);
  const [hoi, setHoi] = useState(false);
  const tinhNang = moRong ? d.tinhNang : d.tinhNang.slice(0, 4);
  const tenMoc = (so: number) => pickLang(duAn.moc.find((m) => m.so === so)?.ten ?? `${t.moc} ${so}`, locale);
  return (
    <article className={`flex min-w-0 flex-col rounded-xl border p-4 transition-colors ${dangChon ? 'border-neon-violet bg-neon-violet/10' : 'border-darkborder/70 bg-darkbg/40 hover:border-neon-violet/40'}`}>
      <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
        <h4 className="min-w-0 break-words text-base font-semibold text-text-primary">{pickLang(d.ten, locale)}</h4>
        {dangChon && <Chip mau="violet"><Check className="h-3 w-3" aria-hidden />{t.dangLam}</Chip>}
      </div>
      <DoKho muc={d.doKho} locale={locale} />
      <Html as="p" s={d.moTa} locale={locale} className="mt-2 break-words text-sm leading-relaxed text-text-secondary" />

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-text-muted">{t.tinhNangChinh}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {tinhNang.map((x, i) => <li key={i} className="max-w-full break-words rounded-lg bg-white/5 px-2 py-1 text-xs text-text-secondary">{pickLang(x, locale)}</li>)}
        {d.tinhNang.length > 4 && (
          <li>
            <button type="button" onClick={() => setMoRong((v) => !v)} className="rounded-lg px-2 py-1 text-xs font-medium text-tone-violet hover:bg-white/5">
              {moRong ? t.thuGon : t.themTinhNang(d.tinhNang.length - 4)}
            </button>
          </li>
        )}
      </ul>

      {d.banDoChuong.length > 0 && (
        <div className="mt-3">
          <button type="button" onClick={() => setBanDo((v) => !v)} aria-expanded={banDo}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-tone-violet hover:underline">
            <MapIcon className="h-3.5 w-3.5" aria-hidden />{t.banDoMoc}
            {banDo ? <ChevronUp className="h-3.5 w-3.5" aria-hidden /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
          </button>
          {banDo && (
            <ol className="mt-2 space-y-1.5 border-l border-darkborder pl-3">
              {d.banDoChuong.map((b, i) => (
                <li key={i} className="min-w-0 text-xs leading-relaxed">
                  <span className="font-semibold text-text-primary">{tenMoc(b.moc)}</span>
                  <span className="text-text-muted"> — </span>
                  <Html s={b.dung} locale={locale} className="break-words text-text-secondary" />
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {d.thamKhaoThat.length > 0 && (
        <p className="mt-3 break-words text-xs text-text-muted">
          <span className="font-medium">{t.ngoaiDoi}: </span>{d.thamKhaoThat.map((x) => pickLang(x, locale)).join(' · ')}
        </p>
      )}

      <div className="mt-auto pt-4">
        {hoi ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-sm font-semibold text-text-primary">{t.doiSang}</p>
            <p className="mt-1 text-xs text-text-secondary">{t.doiGiaiThich(tenHienTai)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <NutChinh onClick={() => { setHoi(false); onChon(); }} disabled={dangGui}>{t.dongYDoi}</NutChinh>
              <NutPhu onClick={() => setHoi(false)}>{t.huy}</NutPhu>
            </div>
          </div>
        ) : dangChon ? null : (
          <NutChinh className="w-full" disabled={dangGui} onClick={() => (coDeTaiKhac ? setHoi(true) : onChon())}>
            {dangGui ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}{t.chonDeTai}
          </NutChinh>
        )}
      </div>
    </article>
  );
}

function KetQuaDuyet({ data, locale, slug, onData }: { data: DuAnTraVe; locale: Locale; slug: string; onData: (d: DuAnTraVe) => void }) {
  const t = chuDuAn(locale);
  const ai = data.cuaToi?.aiDuyet;
  const lc = data.cuaToi?.luaChon;
  const [hoi, setHoi] = useState(false);
  const [gui, setGui] = useState(false);
  if (!ai) return null;
  const dangDung = lc?.loai === 'TU_CHON' && lc.ten === ai.ban.ten;
  const chuyen = async () => {
    setGui(true);
    try {
      onData((await duAnApi.chon(slug, { tuChonDaDuyet: true })).data.data);
      toast.success(t.daChotTuChon);
    } catch (e) { toast.error(loiCua(e, 'Không đổi được đề tài.')); } finally { setGui(false); setHoi(false); }
  };
  const duyet = ai.ketQua === 'DUYET';
  return (
    <div className={`mt-4 rounded-xl border p-4 ${duyet ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10'}`} role="status">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-text-primary">{t.ketQuaAi}:</span>
        <Chip mau={duyet ? 'emerald' : 'amber'}>{duyet ? `✓ ${t.duyet}` : `✎ ${t.canSua}`}</Chip>
        {ai.quyMo && <Chip mau="xam">{t.quyMoNhan[ai.quyMo]}</Chip>}
        <span className="min-w-0 break-words text-xs text-text-muted">“{ai.ban.ten}”</span>
      </div>
      <p className="mt-2 break-words text-sm leading-relaxed text-text-secondary">{ai.nhanXet}</p>
      {ai.diemManh.length > 0 && (
        <div className="mt-3"><p className="mb-1 text-xs font-semibold text-tone-emerald">{t.diemManh}</p><DanhSach ds={ai.diemManh} locale={locale} dau="+" /></div>
      )}
      {ai.goiYSua.length > 0 && (
        <div className="mt-3"><p className="mb-1 text-xs font-semibold text-tone-amber">{t.goiYSua}</p><DanhSach ds={ai.goiYSua} locale={locale} dau="→" /></div>
      )}
      {duyet && !dangDung && (
        <div className="mt-3">
          {hoi && lc ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="min-w-0 text-xs text-text-secondary">{t.doiGiaiThich(pickLang(lc.ten, locale))}</span>
              <NutChinh onClick={chuyen} disabled={gui}>{t.dongYDoi}</NutChinh>
              <NutPhu onClick={() => setHoi(false)}>{t.huy}</NutPhu>
            </div>
          ) : (
            <NutChinh onClick={() => (lc ? setHoi(true) : chuyen())} disabled={gui}>{t.chuyenTuChon}</NutChinh>
          )}
        </div>
      )}
    </div>
  );
}

function FormTuChon({ data, locale, slug, onData }: { data: DuAnTraVe; locale: Locale; slug: string; onData: (d: DuAnTraVe) => void }) {
  const t = chuDuAn(locale);
  const duAn = data.duAn!;
  const gh = data.cuaToi?.gioiHan;
  const banCu = data.cuaToi?.aiDuyet?.ban;
  const [ten, setTen] = useState(banCu?.ten ?? '');
  const [moTa, setMoTa] = useState(banCu?.moTa ?? '');
  const [tinhNang, setTinhNang] = useState(banCu?.tinhNang.join('\n') ?? '');
  const [gui, setGui] = useState(false);
  // Bản đã gửi đổi (vd tải lại dữ liệu) ⇒ điền lại để người học sửa tiếp theo góp ý.
  useEffect(() => {
    if (!banCu) return;
    setTen(banCu.ten); setMoTa(banCu.moTa); setTinhNang(banCu.tinhNang.join('\n'));
  }, [banCu?.ten, banCu?.moTa]); // eslint-disable-line react-hooks/exhaustive-deps

  const ds = tachDong(tinhNang);
  const hopLe = ten.trim().length >= 3 && moTa.trim().length >= 20 && ds.length >= 3;
  const het = gh ? gh.duyetConLai <= 0 : false;
  const guiDuyet = async () => {
    if (!hopLe) { toast.error(t.thieuTruong); return; }
    setGui(true);
    try {
      const r = await duAnApi.tuChon(slug, { ten: ten.trim(), moTa: moTa.trim(), tinhNang: ds.slice(0, 15), ngonNgu: locale });
      onData(r.data.data);
      const v = r.data.data.vuaDuyet;
      if (v?.ketQua === 'DUYET') toast.success(v.daChot ? t.daChotTuChon : t.duyet);
    } catch (e) { toast.error(loiCua(e, 'AI chưa duyệt được.')); } finally { setGui(false); }
  };

  return (
    <div className="mt-6 rounded-xl border border-dashed border-darkborder p-4 sm:p-5">
      <h4 className="flex items-center gap-2 text-base font-semibold text-text-primary"><Sparkles className="h-4 w-4 text-tone-violet" aria-hidden />{t.tuChonTieuDe.replace(/^✍️\s*/, '')}</h4>
      <p className="mt-1 text-sm text-text-secondary">{t.tuChonMoTa}</p>
      {duAn.tuChon.yeuCauToiThieu.length > 0 && (
        <div className="mt-3 rounded-lg bg-darkbg/60 p-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">{t.yeuCauToiThieu}</p>
          <DanhSach ds={duAn.tuChon.yeuCauToiThieu} locale={locale} dau="✓" />
          {duAn.tuChon.goiYQuyMo && <p className="mt-2 text-xs text-text-muted"><span className="font-medium">{t.quyMo}: </span>{pickLang(duAn.tuChon.goiYQuyMo, locale)}</p>}
        </div>
      )}
      <div className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm text-text-secondary">{t.tenDeTai}
          <input className={oNhap} value={ten} maxLength={120} onChange={(e) => setTen(e.target.value)} placeholder={t.tenGoiY} />
        </label>
        <label className="grid gap-1 text-sm text-text-secondary">{t.moTaDeTai}
          <textarea className={`${oNhap} min-h-[84px] resize-y`} value={moTa} maxLength={1500} onChange={(e) => setMoTa(e.target.value)} placeholder={t.moTaGoiY} />
        </label>
        <label className="grid gap-1 text-sm text-text-secondary">{t.tinhNangDeTai}
          <textarea className={`${oNhap} min-h-[108px] resize-y font-mono text-[13px]`} value={tinhNang} onChange={(e) => setTinhNang(e.target.value)} placeholder={t.tinhNangGoiY} />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <NutChinh onClick={guiDuyet} disabled={gui || het}>
          {gui ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden />{t.dangDuyet}</> : t.guiDuyet}
        </NutChinh>
        {gh && <span className="text-xs text-text-muted">{het ? t.hetLuot : t.conLuot(gh.duyetConLai, gh.duyetToiDa)}</span>}
      </div>
      <KetQuaDuyet data={data} locale={locale} slug={slug} onData={onData} />
    </div>
  );
}

export default function KhoiDangKyDeTai({ slug, data, locale, onData }: { slug: string; data: DuAnTraVe; locale: Locale; onData: (d: DuAnTraVe) => void }) {
  const t = chuDuAn(locale);
  const duAn = data.duAn!;
  const ct = data.cuaToi;
  const lc = ct?.luaChon ?? null;
  const [dangGui, setDangGui] = useState<string | null>(null);
  const [moGioiThieu, setMoGioiThieu] = useState(false);
  const [moLichSu, setMoLichSu] = useState(false);

  const chon = async (deTaiSlug: string) => {
    setDangGui(deTaiSlug);
    try {
      onData((await duAnApi.chon(slug, { deTaiSlug })).data.data);
      toast.success(`${t.deTaiCuaBan}: ${pickLang(duAn.deTai.find((d) => d.slug === deTaiSlug)?.ten ?? '', locale)}`);
    } catch (e) { toast.error(loiCua(e, 'Không chọn được đề tài.')); } finally { setDangGui(null); }
  };

  return (
    <The id="dang-ky-de-tai">
      <TieuDeKhoi>{t.dangKyTieuDe}</TieuDeKhoi>
      <p className="text-sm leading-relaxed text-text-secondary">{t.dangKyMoTa}</p>
      {duAn.gioiThieu && (
        <div className="mt-2">
          <button type="button" onClick={() => setMoGioiThieu((v) => !v)} aria-expanded={moGioiThieu}
            className="inline-flex items-center gap-1 text-sm font-medium text-tone-violet hover:underline">
            {t.viSaoDuAn}{moGioiThieu ? <ChevronUp className="h-4 w-4" aria-hidden /> : <ChevronDown className="h-4 w-4" aria-hidden />}
          </button>
          {moGioiThieu && <Html as="div" s={duAn.gioiThieu} locale={locale} className="rich-content prose prose-invert mt-2 max-w-none text-sm text-text-secondary" />}
        </div>
      )}

      {lc && ct && (
        <div className="mt-4 rounded-xl border border-neon-violet/40 bg-neon-violet/10 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-tone-violet">{t.deTaiCuaBan}</span>
            <Chip mau={lc.loai === 'GOI_Y' ? 'violet' : 'emerald'}>{lc.loai === 'GOI_Y' ? t.goiY : t.tuChon}</Chip>
            {lc.chotLuc && <span className="text-xs text-text-muted">{t.chotNgay} {new Date(lc.chotLuc).toLocaleDateString(locale === 'en' ? 'en-GB' : 'vi-VN')}</span>}
          </div>
          <p className="mt-1 break-words text-base font-semibold text-text-primary">{pickLang(lc.ten, locale)}</p>
          <div className="mt-3"><ThanhTienDo phanTram={ct.tienDo.phanTram} nhan={t.mocXong(ct.tienDo.xong, ct.tienDo.tong)} /></div>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {duAn.deTai.map((d) => (
          <TheDeTai
            key={d.slug} d={d} duAn={duAn} locale={locale}
            dangChon={lc?.loai === 'GOI_Y' && lc.deTaiSlug === d.slug}
            coDeTaiKhac={!!lc} tenHienTai={lc ? pickLang(lc.ten, locale) : ''}
            dangGui={dangGui === d.slug} onChon={() => chon(d.slug)}
          />
        ))}
      </div>

      <FormTuChon data={data} locale={locale} slug={slug} onData={onData} />

      {ct && ct.lichSu.length > 0 && (
        <div className="mt-4">
          <button type="button" onClick={() => setMoLichSu((v) => !v)} aria-expanded={moLichSu}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary">
            <History className="h-3.5 w-3.5" aria-hidden />{t.lichSuDeTai(ct.lichSu.length)}
          </button>
          {moLichSu && (
            <ul className="mt-2 space-y-1 text-xs text-text-muted">
              {ct.lichSu.map((h, i) => (
                <li key={i} className="break-words">
                  {pickLang(h.ten, locale)} · {h.loai === 'GOI_Y' ? t.goiY : t.tuChon} · {new Date(h.denLuc).toLocaleDateString(locale === 'en' ? 'en-GB' : 'vi-VN')}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </The>
  );
}
