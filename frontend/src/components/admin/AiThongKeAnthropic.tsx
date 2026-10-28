'use client';

/**
 * 🤖 AI thống kê chi tiêu cổng Claude chính hãng — đầu tab /admin/commerce?tab=anthropic (23/10/2026).
 * Bấm một câu hỏi có sẵn ⇒ backend gom số liệu thật hôm nay (theo giờ Việt Nam) + Sonnet 5.5 viết nhận xét.
 * Bảng xếp hạng do MÃ tính; AI chỉ ĐỀ XUẤT trần — bấm "Áp dụng" mới đổi (gọi PUT /tran/nguoi/:id có sẵn).
 * USD là số tự đo, không phải số dư thật.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';
import MarkdownRenderer from '@/components/projects/MarkdownRenderer';

const API = '/api/v1/admin/cong-anthropic';

const CAU_HOI = [
  { id: 'tong', nhan: '💵 Hôm nay đã tiêu bao nhiêu $?' },
  { id: 'nguon', nhan: '🧭 Tiền đến từ đâu, việc gì, model nào?' },
  { id: 'xep-hang', nhan: '🏆 Xếp hạng người dùng nhiều nhất hôm nay' },
  { id: 'gan-tran', nhan: '🚧 Ai sắp chạm trần?' },
  { id: 'bat-thuong', nhan: '🔎 Có gì bất thường không?' },
  { id: 'de-xuat', nhan: '🎚️ Đề xuất giới hạn / tăng hạn mức từng người' },
  { id: 'key', nhan: '🔑 Các key còn bao nhiêu, đủ tới cuối tháng không?' },
] as const;

/** Lần THỬ hỏng chia theo mã — `tuXuLy` = cổng tự thử lại thành công, `that` = người dùng có thể đã thấy lỗi. */
interface MaLoi { ma: string; nhan: string; tong: number; tuXuLy: number; that: number }
interface Han { daNgay: number; tranNgay: number | null; daThang: number; tranThang: number | null; nguon: string }
interface Dong {
  userId: number | null; ten: string; email: string | null; goi: string;
  usdHomNay: number; usdHomQua: number; tbNgay7: number; usdThang: number; luot: number; viecChinh: string;
  loi: number; loiTuXuLy?: number; loiThat?: number; tiLeLoiThatPct?: number | null; loiTheoMa?: MaLoi[];
  han: null | { free: Han; cao: Han };
}
interface HanhDong {
  loai: 'dat_tran' | 'xoa_tran'; userId: number; ten: string; hang?: 'free' | 'cao';
  ngayUsd?: number | null; thangUsd?: number | null; lyDo: string;
}
interface KetQua {
  cauHoiId: string | null; traLoi: string | null; hanhDong: HanhDong[]; loi: string | null; model: string; usdLuotNay: number;
  soLieu: {
    homNay: {
      usd: number; luot: number; loi: number; duBaoCaNgayUsd: number | null;
      loiTuXuLy?: number; loiThat?: number; tiLeLoiThatPct?: number | null; loiTheoMa?: MaLoi[];
    };
    homQua: { usd: number }; tb7NgayTruoc: { usdMoiNgay: number };
    theoViec: Array<{ viec: string; usd: number; luot: number }>;
    theoModel: Array<{ model: string; hang: string; usd: number; luot: number }>;
    xepHang: Dong[];
  };
}

const usd = (n: number | null | undefined, d = 2) => (n == null ? '∞' : `$${n.toLocaleString('en-US', { maximumFractionDigits: d })}`);

/** Chú thích khi rê chuột vào ô Lượt/Lỗi: chia theo mã lỗi. */
function chuThichLoi(l: { loi: number; loiTuXuLy?: number; loiThat?: number; loiTheoMa?: MaLoi[] }): string {
  if (!l.loi) return 'Không có lần thử nào hỏng.';
  const dong = [
    `${l.loi} lần thử hỏng: ${l.loiTuXuLy ?? 0} thử lại tự động thành công, ${l.loiThat ?? l.loi} lỗi người dùng thấy.`,
    ...(l.loiTheoMa ?? []).map((m) => `• ${m.ma === 'KHONG_MA' ? 'Không mã' : m.ma}: ${m.tong} (${m.tuXuLy} tự xử lý, ${m.that} thật) — ${m.nhan}`),
  ];
  return dong.join('\n');
}

async function goi<T>(duong: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API}${duong}`, { credentials: 'include', ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.message ?? `Lỗi ${r.status}`);
  return j.data as T;
}

function mota(h: HanhDong) {
  if (h.loai === 'xoa_tran') return 'Bỏ trần riêng (về theo gói)';
  const ten = h.hang === 'cao' ? 'model cao' : 'CuongMini Free';
  const p: string[] = [];
  if (h.ngayUsd !== undefined) p.push(`${h.ngayUsd === null ? 'không giới hạn' : usd(h.ngayUsd)}/ngày`);
  if (h.thangUsd !== undefined) p.push(`${h.thangUsd === null ? 'không giới hạn' : usd(h.thangUsd)}/tháng`);
  return `Đặt trần ${ten}: ${p.join(' · ')}`;
}

export default function AiThongKeAnthropic() {
  const [dang, setDang] = useState<string | null>(null);
  const [kq, setKq] = useState<KetQua | null>(null);
  const [tuGo, setTuGo] = useState('');
  const [daAp, setDaAp] = useState<Record<string, boolean>>({});

  const hoi = async (body: { id?: string; cauHoi?: string }) => {
    setDang(body.id ?? 'tu-go');
    setDaAp({});
    try { setKq(await goi<KetQua>('/ai-thong-ke', { method: 'POST', body: JSON.stringify(body) })); }
    catch (e) { toast.error((e as Error).message); }
    finally { setDang(null); }
  };

  const apDung = async (h: HanhDong, k: string) => {
    try {
      if (h.loai === 'xoa_tran') {
        await goi(`/tran/nguoi/${h.userId}`, { method: 'DELETE' });
      } else {
        const free = h.hang !== 'cao';
        const b: Record<string, unknown> = {};
        if (h.ngayUsd !== undefined) b[free ? 'freeNgayUsd' : 'tranNgayUsd'] = h.ngayUsd;
        if (h.thangUsd !== undefined) b[free ? 'freeThangUsd' : 'tranThangUsd'] = h.thangUsd;
        await goi(`/tran/nguoi/${h.userId}`, { method: 'PUT', body: JSON.stringify(b) });
      }
      setDaAp((x) => ({ ...x, [k]: true }));
      toast.success(`Đã áp dụng cho ${h.ten}`);
    } catch (e) { toast.error((e as Error).message); }
  };

  const nut = 'px-3 py-1.5 rounded-lg text-xs border border-darkborder text-text-primary hover:border-violet-500/60 disabled:opacity-50';
  return (
    <section className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/5 text-sm space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <b className="text-text-primary">🤖 AI thống kê chi tiêu hôm nay</b>
        <span className="text-xs text-text-muted">Sonnet 5.5 · cổng chính hãng · ngày tính theo giờ Việt Nam</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {CAU_HOI.map((c) => (
          <button key={c.id} type="button" disabled={dang !== null} onClick={() => hoi({ id: c.id })} className={nut}>
            {dang === c.id ? <Loader2 className="w-3 h-3 inline animate-spin" /> : null} {c.nhan}
          </button>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (tuGo.trim()) hoi({ cauHoi: tuGo.trim() }); }}>
        <input value={tuGo} onChange={(e) => setTuGo(e.target.value.slice(0, 300))} placeholder="Hoặc tự hỏi (vd: người nào dùng nhiều nhất cho AI Code?)"
          className="flex-1 px-2 py-1 rounded-lg bg-darkbg border border-darkborder text-text-primary text-sm" />
        <button type="submit" disabled={dang !== null || !tuGo.trim()} className={nut}>
          {dang === 'tu-go' ? <Loader2 className="w-3 h-3 inline animate-spin" /> : 'Hỏi'}
        </button>
      </form>

      {kq && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              ['Hôm nay', usd(kq.soLieu.homNay.usd)],
              ['Dự báo cả ngày', usd(kq.soLieu.homNay.duBaoCaNgayUsd)],
              ['Hôm qua', usd(kq.soLieu.homQua.usd)],
              ['TB 7 ngày trước', usd(kq.soLieu.tb7NgayTruoc.usdMoiNgay)],
            ].map(([a, b]) => (
              <div key={a} className="p-2 rounded-lg bg-darkbg border border-darkborder">
                <div className="text-xs text-text-muted">{a}</div>
                <div className="text-text-primary font-semibold">{b}</div>
              </div>
            ))}
          </div>

          {kq.traLoi && <div className="p-3 rounded-lg bg-darkbg border border-darkborder"><MarkdownRenderer mdx={kq.traLoi} openLinksInNewTab={false} /></div>}
          {kq.loi && <p className="text-xs text-amber-300">⚠ AI không trả lời được ({kq.loi}). Bảng số liệu bên dưới vẫn là số thật.</p>}

          {kq.hanhDong.length > 0 && (
            <div className="space-y-2">
              <b className="text-text-primary">Đề xuất của AI (bấm Áp dụng mới đổi)</b>
              {kq.hanhDong.map((h, i) => {
                const k = `${h.userId}-${i}`;
                return (
                  <div key={k} className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-darkborder bg-darkbg">
                    <div className="flex-1 min-w-[220px]">
                      <div className="text-text-primary"><b>{h.ten}</b> — {mota(h)}</div>
                      <div className="text-xs text-text-muted">{h.lyDo}</div>
                    </div>
                    <button type="button" disabled={daAp[k]} onClick={() => apDung(h, k)} className={`${nut} ${daAp[k] ? '' : 'border-violet-500/60'}`}>
                      {daAp[k] ? '✓ Đã áp dụng' : 'Áp dụng'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {kq.soLieu.homNay.loi > 0 && (
            <details className="p-2 rounded-lg bg-darkbg border border-darkborder text-xs text-text-primary">
              <summary className="cursor-pointer">
                Lỗi hôm nay: <b>{kq.soLieu.homNay.loiThat ?? kq.soLieu.homNay.loi}</b> lỗi người dùng thấy
                {kq.soLieu.homNay.tiLeLoiThatPct != null ? ` (${kq.soLieu.homNay.tiLeLoiThatPct}%)` : ''}
                {' · '}{kq.soLieu.homNay.loiTuXuLy ?? 0} lần thử lại tự động thành công
                <span className="text-text-muted"> — tổng {kq.soLieu.homNay.loi} lần thử hỏng, bấm để xem theo mã</span>
              </summary>
              <table className="w-full mt-1">
                <thead><tr className="text-text-muted text-left"><th className="pr-2">Mã</th><th className="pr-2 text-right">Lần</th><th className="pr-2 text-right">Thử lại tự động</th><th className="pr-2 text-right">Người dùng thấy</th><th>Nguyên nhân</th></tr></thead>
                <tbody>
                  {(kq.soLieu.homNay.loiTheoMa ?? []).map((m) => (
                    <tr key={m.ma} className="border-t border-darkborder">
                      <td className="pr-2 font-mono">{m.ma === 'KHONG_MA' ? '—' : m.ma}</td>
                      <td className="pr-2 text-right">{m.tong}</td>
                      <td className="pr-2 text-right">{m.tuXuLy}</td>
                      <td className="pr-2 text-right">{m.that}</td>
                      <td className="text-text-muted">{m.nhan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-1 text-text-muted">“Thử lại tự động” = cổng tự chuyển key / gửi lại bản tối giản và thành công trong ~2 phút, người dùng không thấy lỗi. Ước đoán theo cùng người + cùng việc (sổ không có mã lượt).</p>
            </details>
          )}

          <div className="overflow-x-auto">
            <b className="text-text-primary">🏆 Xếp hạng hôm nay (số do mã tính)</b>
            <table className="w-full text-xs mt-1">
              <thead>
                <tr className="text-text-muted text-left">
                  <th className="py-1 pr-2">#</th><th className="pr-2">Người</th><th className="pr-2">Gói</th><th className="pr-2 text-right">Hôm nay</th>
                  <th className="pr-2 text-right">TB 7 ngày</th><th className="pr-2 text-right">Tháng</th><th className="pr-2 text-right" title="Lượt = số dòng sổ (gồm cả lần thử hỏng) · lỗi = lần thử hỏng (trong ngoặc: lỗi người dùng thấy). Rê chuột vào từng ô để xem theo mã.">Lượt / lỗi (thật)</th>
                  <th className="pr-2">Việc chính</th><th className="text-right">Trần free (ngày)</th>
                </tr>
              </thead>
              <tbody>
                {kq.soLieu.xepHang.map((x, i) => {
                  const vot = x.tbNgay7 > 0 ? x.usdHomNay / x.tbNgay7 : null;
                  return (
                    <tr key={`${x.userId}-${i}`} className="border-t border-darkborder text-text-primary">
                      <td className="py-1 pr-2">{i + 1}</td>
                      <td className="pr-2" title={x.email ?? ''}>{x.ten}</td>
                      <td className="pr-2">{x.goi}</td>
                      <td className="pr-2 text-right font-semibold">{usd(x.usdHomNay, 3)}{vot !== null && vot >= 3 ? ' 🔺' : ''}</td>
                      <td className="pr-2 text-right text-text-muted">{usd(x.tbNgay7, 3)}</td>
                      <td className="pr-2 text-right">{usd(x.usdThang)}</td>
                      <td className="pr-2 text-right whitespace-nowrap" title={chuThichLoi(x)}>
                        {x.luot} / {x.loi}
                        {x.loi > 0 && x.loiThat !== undefined && (
                          <span className={x.loiThat > 0 ? 'text-amber-300' : 'text-text-muted'}> ({x.loiThat} thật)</span>
                        )}
                      </td>
                      <td className="pr-2">{x.viecChinh}</td>
                      <td className="text-right">{x.han ? `${usd(x.han.free.daNgay)}/${usd(x.han.free.tranNgay)}` : '—'}</td>
                    </tr>
                  );
                })}
                {kq.soLieu.xepHang.length === 0 && <tr><td colSpan={9} className="py-2 text-text-muted">Hôm nay chưa có lượt nào.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <b className="text-text-primary">Theo việc</b>
              {kq.soLieu.theoViec.map((v) => <div key={v.viec} className="flex justify-between text-xs text-text-primary"><span>{v.viec}</span><span>{usd(v.usd, 3)} · {v.luot} lượt</span></div>)}
            </div>
            <div>
              <b className="text-text-primary">Theo model</b>
              {kq.soLieu.theoModel.map((v) => <div key={v.model + v.hang} className="flex justify-between text-xs text-text-primary"><span>{v.model} ({v.hang})</span><span>{usd(v.usd, 3)} · {v.luot} lượt</span></div>)}
            </div>
          </div>
          <p className="text-xs text-text-muted">Lượt hỏi này tốn {usd(kq.usdLuotNay, 4)} (ghi sổ riêng “AI thống kê”, không ăn trần người dùng). USD là số tự đo, không phải số dư thật.</p>
        </div>
      )}
    </section>
  );
}
