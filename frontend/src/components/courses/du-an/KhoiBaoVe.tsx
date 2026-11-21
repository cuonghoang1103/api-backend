'use client';
/**
 * 🎓 Khối "Bảo vệ dự án" — vẽ dưới bài có `baoVeDuAn`: checklist chuẩn bị, rubric, các mốc, phòng hỏi đáp với hội
 * đồng AI (SSE "gõ từng chữ", hỏng thì lùi JSON), kết quả theo rubric + các phiên trước.
 * Trần phiên/ngày + số câu do máy chủ chốt (`cuaToi.gioiHan`) — nút chỉ phản chiếu lại.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Gavel, Loader2, RotateCcw, Send, Square } from 'lucide-react';
import { duAnApi } from '@/lib/api';
import { pickLang } from '@/lib/utils';
import { soDiem, vanBanAi, type DuAnTraVe, type PhienBaoVe } from '@/lib/duAn';
import { chuDuAn } from './chu';
import { goiSse, LoiSse } from './sse';
import { loiCua } from './useDuAn';
import { Chip, DanhSach, Html, NutChinh, NutPhu, oNhap, The, ThanhTienDo, TieuDeKhoi } from './ui';

type Locale = 'en' | 'vi';

function ChecklistChuanBi({ ds, locale, khoa }: { ds: string[]; locale: Locale; khoa: string }) {
  const t = chuDuAn(locale);
  const [tick, setTick] = useState<number[]>([]);
  // Tick chuẩn bị chỉ là tiện ích riêng của máy này ⇒ localStorage (bọc try/catch: trình duyệt chặn thì vẫn chạy).
  useEffect(() => {
    try { const v = JSON.parse(localStorage.getItem(khoa) || '[]'); if (Array.isArray(v)) setTick(v); } catch { /* bỏ qua */ }
  }, [khoa]);
  const doi = (i: number) => setTick((cu) => {
    const moi = cu.includes(i) ? cu.filter((x) => x !== i) : [...cu, i];
    try { localStorage.setItem(khoa, JSON.stringify(moi)); } catch { /* bỏ qua */ }
    return moi;
  });
  if (!ds.length) return null;
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-semibold text-text-primary">{t.chuanBi} <span className="font-normal text-text-muted">({tick.length}/{ds.length})</span></p>
      <ul className="space-y-1">
        {ds.map((x, i) => (
          <li key={i}>
            <label className="flex min-w-0 cursor-pointer gap-2.5 rounded-lg p-1.5 text-sm text-text-secondary hover:bg-white/5">
              <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#8b5cf6]" checked={tick.includes(i)} onChange={() => doi(i)} />
              <Html s={x} locale={locale} className="min-w-0 break-words" />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KetQua({ p, locale }: { p: PhienBaoVe; locale: Locale }) {
  const t = chuDuAn(locale);
  if (p.trangThai !== 'DA_CHAM' || p.diem == null) return null;
  const mau = p.diem >= 8 ? 'text-tone-emerald' : p.diem >= 5 ? 'text-tone-amber' : 'text-tone-rose';
  return (
    <div className="mt-4 rounded-xl border border-darkborder bg-darkbg/50 p-4 sm:p-5" role="status">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm font-semibold text-text-primary">{t.ketQua}</p>
        <p className={`font-heading text-3xl font-bold ${mau}`}>{soDiem(p.diem, locale)}<span className="text-base text-text-muted">/10</span></p>
      </div>
      <ul className="mt-4 space-y-3">
        {(p.diemChiTiet ?? []).map((d, i) => (
          <li key={i} className="min-w-0">
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 break-words text-text-primary">{pickLang(d.tieuChi, locale)}</span>
              <span className="shrink-0 font-semibold text-text-secondary">{soDiem(d.diem, locale)}/{soDiem(d.diemToiDa, locale)}</span>
            </div>
            <ThanhTienDo phanTram={(d.diem / d.diemToiDa) * 100} />
            {d.nhanXet && <p className="mt-1 break-words text-xs text-text-muted">{d.nhanXet}</p>}
          </li>
        ))}
      </ul>
      {p.nhanXet?.chung && <div className="mt-4"><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">{t.nhanXetChung}</p><p className="break-words text-sm leading-relaxed text-text-secondary">{p.nhanXet.chung}</p></div>}
      {!!p.nhanXet?.diemManh.length && <div className="mt-3"><p className="mb-1 text-xs font-semibold text-tone-emerald">{t.diemManh}</p><DanhSach ds={p.nhanXet.diemManh} locale={locale} dau="+" /></div>}
      {!!p.nhanXet?.canCaiThien.length && <div className="mt-3"><p className="mb-1 text-xs font-semibold text-tone-amber">{t.canCaiThien}</p><DanhSach ds={p.nhanXet.canCaiThien} locale={locale} dau="→" /></div>}
      {p.phien.length > 0 && (
        <details className="mt-4 rounded-lg border border-darkborder/70">
          <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-text-muted hover:text-text-primary">{t.xemHoiThoai(p.phien.filter((l) => l.role === 'assistant').length)}</summary>
          <ol className="space-y-2 px-3 pb-3">
            {p.phien.map((l, i) => (
              <li key={i} className="min-w-0 break-words text-sm leading-relaxed">
                <span className={`mr-1.5 text-[11px] font-semibold uppercase tracking-wide ${l.role === 'user' ? 'text-tone-violet' : 'text-text-muted'}`}>{l.role === 'user' ? t.ban : t.hoiDong}:</span>
                <span className="text-text-secondary" dangerouslySetInnerHTML={{ __html: vanBanAi(l.content) }} />
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}

function PhongHoi({
  slug, locale, phien, setPhien, onXong,
}: { slug: string; locale: Locale; phien: PhienBaoVe; setPhien: (p: PhienBaoVe) => void; onXong: () => void }) {
  const t = chuDuAn(locale);
  const [traLoi, setTraLoi] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [nhap, setNhap] = useState(''); // chữ hội đồng đang "gõ"
  const [dangCham, setDangCham] = useState(false);
  const cuoiRef = useRef<HTMLDivElement | null>(null);
  const dangChay = useRef(false);

  useEffect(() => { cuoiRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [phien.phien.length, nhap]);

  const daHoi = phien.phien.filter((l) => l.role === 'assistant').length;
  const choTraLoi = phien.trangThai === 'DANG_HOI' && phien.phien[phien.phien.length - 1]?.role === 'assistant';
  const ketThuc = (p: PhienBaoVe) => { setPhien(p); if (p.trangThai !== 'DANG_HOI') onXong(); };

  const gui = useCallback(async () => {
    const v = traLoi.trim();
    if (!v || dangChay.current) return;
    dangChay.current = true;
    setDangGui(true);
    setNhap('');
    // Hiện ngay câu trả lời của người học (bản lạc quan); máy chủ trả bản chuẩn thay hẳn.
    setPhien({ ...phien, phien: [...phien.phien, { role: 'user', content: v, luc: new Date().toISOString() }] });
    setTraLoi('');
    try {
      let p: PhienBaoVe;
      try {
        p = await goiSse(`/courses/${encodeURIComponent(slug)}/du-an/bao-ve/${phien.id}/tra-loi-stream`, { traLoi: v }, {
          onDelta: (x) => setNhap((s) => s + x), onDangCham: () => setDangCham(true),
        });
      } catch (e) {
        if (e instanceof LoiSse && e.tuMayChu) throw e;
        setNhap('');
        p = (await duAnApi.traLoi(slug, phien.id, v)).data.data; // SSE hỏng ⇒ JSON
      }
      ketThuc(p);
    } catch (e) {
      toast.error(loiCua(e, 'Hội đồng AI chưa trả lời được.'));
      try { setPhien((await duAnApi.layPhien(slug, phien.id)).data.data); } catch { /* giữ bản cũ */ }
    } finally {
      setNhap(''); setDangCham(false); setDangGui(false); dangChay.current = false;
    }
  }, [traLoi, phien, slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const hoiLai = async () => {
    setDangGui(true);
    try { ketThuc((await duAnApi.hoiLai(slug, phien.id)).data.data); } catch (e) { toast.error(loiCua(e, 'Chưa hỏi lại được.')); } finally { setDangGui(false); }
  };
  const ketThucSom = async () => {
    if (!window.confirm(t.xacNhanKetThuc)) return;
    setDangGui(true); setDangCham(true);
    try { ketThuc((await duAnApi.ketThuc(slug, phien.id)).data.data); } catch (e) { toast.error(loiCua(e, 'Chưa kết thúc được.')); } finally { setDangGui(false); setDangCham(false); }
  };

  return (
    <div className="mt-4 rounded-xl border border-darkborder bg-darkbg/50">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-darkborder/70 px-4 py-2.5">
        <span className="flex items-center gap-2 text-sm font-semibold text-text-primary"><Gavel className="h-4 w-4 text-tone-violet" aria-hidden />{t.hoiDong}</span>
        <Chip mau="violet">{t.cauSo(Math.min(daHoi, phien.soCau), phien.soCau)}</Chip>
      </div>
      <div className="max-h-[480px] space-y-3 overflow-y-auto p-4" aria-live="polite">
        {phien.phien.map((l, i) => (
          <div key={i} className={`flex ${l.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`min-w-0 max-w-[88%] break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${l.role === 'user' ? 'rounded-br-md bg-neon-violet/20 text-text-primary' : 'rounded-bl-md border border-darkborder/70 bg-darkcard text-text-secondary'}`}>
              <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">{l.role === 'user' ? t.ban : t.hoiDong}</p>
              <div dangerouslySetInnerHTML={{ __html: vanBanAi(l.content) }} />
            </div>
          </div>
        ))}
        {(nhap || (dangGui && !dangCham)) && (
          <div className="flex justify-start">
            <div className="min-w-0 max-w-[88%] break-words rounded-2xl rounded-bl-md border border-darkborder/70 bg-darkcard px-3.5 py-2.5 text-sm leading-relaxed text-text-secondary">
              <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">{t.hoiDong}</p>
              {nhap ? <div dangerouslySetInnerHTML={{ __html: vanBanAi(nhap) }} /> : <Loader2 className="h-4 w-4 animate-spin text-text-muted" aria-hidden />}
            </div>
          </div>
        )}
        {dangCham && <p className="flex items-center gap-2 text-sm text-tone-amber"><Loader2 className="h-4 w-4 animate-spin" aria-hidden />{t.dangCham}</p>}
        <div ref={cuoiRef} />
      </div>
      {phien.trangThai === 'DANG_HOI' && (
        <div className="border-t border-darkborder/70 p-3">
          {choTraLoi ? (
            <textarea
              className={`${oNhap} min-h-[88px] resize-y`} value={traLoi} maxLength={3000} disabled={dangGui}
              onChange={(e) => setTraLoi(e.target.value)} placeholder={t.traLoiGoiY}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void gui(); } }}
            />
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {choTraLoi ? (
              <NutChinh onClick={() => void gui()} disabled={dangGui || !traLoi.trim()}>
                {dangGui ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}{t.gui}
              </NutChinh>
            ) : (
              <NutChinh onClick={hoiLai} disabled={dangGui}><RotateCcw className="h-4 w-4" aria-hidden />{t.hoiLai}</NutChinh>
            )}
            <NutPhu onClick={ketThucSom} disabled={dangGui}><Square className="h-3.5 w-3.5" aria-hidden />{t.ketThucCham}</NutPhu>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KhoiBaoVe({ slug, data, locale, taiLai }: {
  slug: string; data: DuAnTraVe; locale: Locale; taiLai: () => Promise<void>;
}) {
  const t = chuDuAn(locale);
  const duAn = data.duAn!;
  const ct = data.cuaToi;
  const [phien, setPhien] = useState<PhienBaoVe | null>(null);
  const [dangMo, setDangMo] = useState(false);
  const [nhap, setNhap] = useState('');
  const dangMoId = ct?.baoVe.dangMo ?? null;

  // Có phiên dở ⇒ nạp lại để người học tiếp tục đúng chỗ (đổi máy / tải lại trang).
  useEffect(() => {
    if (!dangMoId || phien?.id === dangMoId) return;
    let huy = false;
    duAnApi.layPhien(slug, dangMoId).then((r) => { if (!huy) setPhien(r.data.data); }).catch(() => {});
    return () => { huy = true; };
  }, [dangMoId, slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const gh = ct?.gioiHan;
  const lc = ct?.luaChon ?? null;
  const duMoc = !!ct && ct.tienDo.xong >= (gh?.mocToiThieu ?? 0);
  const conPhien = gh ? gh.baoVeConLai > 0 : false;
  const coPhienDo = !!dangMoId;
  const moDuoc = !!lc && duMoc && (conPhien || coPhienDo);

  const vaoPhong = async () => {
    setDangMo(true); setNhap('');
    try {
      let p: PhienBaoVe;
      try {
        p = await goiSse(`/courses/${encodeURIComponent(slug)}/du-an/bao-ve-stream`, { ngonNgu: locale }, { onDelta: (x) => setNhap((s) => s + x) });
      } catch (e) {
        if (e instanceof LoiSse && e.tuMayChu) throw e;
        p = (await duAnApi.batDauBaoVe(slug, { ngonNgu: locale })).data.data;
      }
      setPhien(p);
      void taiLai();
    } catch (e) { toast.error(loiCua(e, 'Chưa mở được phòng bảo vệ.')); } finally { setDangMo(false); setNhap(''); }
  };

  const daCo = phien && phien.trangThai !== 'DANG_HOI';
  return (
    <The id="bao-ve-du-an">
      <TieuDeKhoi phu={ct?.baoVe.diemCaoNhat != null ? <Chip mau="emerald">{t.diemCaoNhat}: {soDiem(ct.baoVe.diemCaoNhat, locale)}/10</Chip> : undefined}>
        {t.baoVeTieuDe}
      </TieuDeKhoi>
      <p className="text-sm leading-relaxed text-text-secondary">{t.baoVeMoTa}</p>

      {lc && (
        <p className="mt-3 break-words text-sm"><span className="text-text-muted">{t.deTaiCuaBan}: </span><span className="font-semibold text-text-primary">{pickLang(lc.ten, locale)}</span></p>
      )}

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <ChecklistChuanBi ds={duAn.baoVe.chuanBi} locale={locale} khoa={`cuongthai.duAn.chuanBi.${slug}`} />
        <div className="min-w-0">
          <p className="mb-2 text-sm font-semibold text-text-primary">{t.mocDaNop}</p>
          {ct && <ThanhTienDo phanTram={ct.tienDo.phanTram} nhan={t.mocXong(ct.tienDo.xong, ct.tienDo.tong)} />}
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {(ct?.tienDo.moc ?? duAn.moc.map((m) => ({ so: m.so, slug: m.slug, ten: m.ten, trangThai: null }))).map((m) => (
              <li key={m.slug} title={pickLang(m.ten, locale)}>
                <Chip mau={m.trangThai === 'XONG' ? 'emerald' : m.trangThai === 'DANG_LAM' ? 'amber' : 'xam'}>
                  {m.trangThai === 'XONG' ? '✓' : m.trangThai === 'DANG_LAM' ? '●' : '○'} {t.moc} {m.so}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 min-w-0">
        <p className="mb-2 text-sm font-semibold text-text-primary">{t.rubric}</p>
        <div className="overflow-x-auto rounded-xl border border-darkborder/70">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead className="bg-darkbg/60 text-xs uppercase tracking-wide text-text-muted">
              <tr><th className="px-3 py-2 font-semibold">{t.tieuChi}</th><th className="w-16 px-3 py-2 text-right font-semibold">{t.diem}</th></tr>
            </thead>
            <tbody>
              {duAn.baoVe.rubric.map((r, i) => (
                <tr key={i} className="border-t border-darkborder/60 align-top">
                  <td className="px-3 py-2 text-text-secondary">
                    <span className="font-medium text-text-primary">{pickLang(r.tieuChi, locale)}</span>
                    {r.moTa && pickLang(r.moTa, locale) && <Html as="p" s={r.moTa} locale={locale} className="mt-0.5 text-xs text-text-muted" />}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-text-primary">{r.diem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {phien && phien.trangThai === 'DANG_HOI' ? (
        <PhongHoi slug={slug} locale={locale} phien={phien} setPhien={setPhien} onXong={() => void taiLai()} />
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-neon-violet/30 bg-neon-violet/10 p-4">
          <NutChinh onClick={vaoPhong} disabled={!moDuoc || dangMo}>
            {dangMo ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Gavel className="h-4 w-4" aria-hidden />}
            {dangMo ? t.dangMoPhong : coPhienDo ? t.tiepTucPhong : daCo ? t.luyenLai : t.vaoPhong}
          </NutChinh>
          <div className="min-w-0 text-xs text-text-muted">
            <p>{gh ? t.soCau(gh.soCau) : null}</p>
            {!lc ? <p className="text-tone-amber">{t.chuaChonDeTai}</p>
              : !duMoc ? <p className="text-tone-amber">{t.canMoc(gh?.mocToiThieu ?? 1)}</p>
                : gh ? <p>{t.conPhien(gh.baoVeConLai, gh.baoVeToiDa)}</p> : null}
          </div>
          {dangMo && nhap && <div className="w-full break-words rounded-lg bg-darkcard p-3 text-sm text-text-secondary" dangerouslySetInnerHTML={{ __html: vanBanAi(nhap) }} />}
        </div>
      )}

      {phien && <KetQua p={phien} locale={locale} />}

      {ct && ct.baoVe.phien.filter((p) => p.trangThai !== 'DANG_HOI').length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">{t.phienTruoc}</p>
          <ul className="flex flex-wrap gap-2">
            {ct.baoVe.phien.filter((p) => p.trangThai !== 'DANG_HOI').map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => duAnApi.layPhien(slug, p.id).then((r) => setPhien(r.data.data)).catch(() => {})}
                  className="rounded-lg border border-darkborder px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5">
                  {new Date(p.batDauLuc).toLocaleDateString(locale === 'en' ? 'en-GB' : 'vi-VN')} · {p.trangThai === 'DA_CHAM' && p.diem != null ? `${soDiem(p.diem, locale)}/10` : t.boDo}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </The>
  );
}
