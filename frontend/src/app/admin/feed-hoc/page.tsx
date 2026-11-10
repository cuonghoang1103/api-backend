'use client';

/**
 * /admin/feed-hoc — "Học mỗi ngày" trên Bảng tin + dọn bài bot mẫu cũ (10/11/2026).
 * Backend: /api/v1/admin/feed-hoc (src/routes/feedHocAdmin.routes.ts).
 *   • Xem: thư viện bao nhiêu bài, đã đăng bao nhiêu, bài kế tiếp sẽ chọn + vì sao.
 *   • Đăng ngay một bài (không phụ thuộc cờ FEED_HOC_AUTOPOST).
 *   • Bài bot MẪU CŨ (so sánh "A vs B" + mẹo Claude 💡): đếm → ẩn (PUBLIC → PRIVATE, đảo ngược được).
 *     Không có nút xoá: xoá hẳn là việc phải hỏi riêng.
 */
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BookOpenCheck, EyeOff, Loader2, RotateCcw, Send } from 'lucide-react';
import { PageHeader, Section } from '@/components/admin/ui';

interface DuLieu {
  autopost: boolean;
  moiNgay: number;
  thuVien: number;
  daDang: number;
  ganDay: Array<{ id: string; nhom: string; dinhDang: string; mau: string; luc: number }>;
  keTiep: { reason?: string; id?: string; lyDo?: string[] };
  baiBot: {
    tong: number; mauCu: number; dangHien: number; daAn: number;
    theoTieuDe: Array<{ tieuDe: string; so: number }>;
  };
}

async function goi<T>(duong: string, body?: unknown): Promise<T> {
  const r = await fetch(`/api/v1/admin/feed-hoc${duong}`, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.message ?? `Lỗi ${r.status}`);
  return j.data as T;
}

export default function FeedHocAdminPage() {
  const [d, setD] = useState<DuLieu | null>(null);
  const [ban, setBan] = useState<string | null>(null);
  const [xacNhanAn, setXacNhanAn] = useState(false);

  const tai = useCallback(async () => {
    try { setD(await goi<DuLieu>('')); } catch (e) { toast.error((e as Error).message); }
  }, []);
  useEffect(() => { void tai(); }, [tai]);

  const lam = async (viec: string, fn: () => Promise<string>) => {
    setBan(viec);
    try { toast.success(await fn()); await tai(); } catch (e) { toast.error((e as Error).message); } finally { setBan(null); }
  };

  const nut = 'inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50';

  return (
    <div>
      <PageHeader
        eyebrow="BẢNG TIN"
        title="Học mỗi ngày"
        description="Bài học soạn sẵn đã kiểm chứng (code chạy thật, nguồn đã mở), CuongMini đăng theo vòng xoay chủ đề + định dạng + mẫu ảnh. Không gọi AI."
      />
      {!d ? (
        <p className="flex items-center gap-2 text-[var(--a-text-2)]"><Loader2 className="h-4 w-4 animate-spin" /> Đang tải…</p>
      ) : (
        <div className="grid gap-5">
          <Section title="Trạng thái" icon={BookOpenCheck}>
            <div className="grid gap-3 text-sm text-[var(--a-text-2)] sm:grid-cols-4">
              <p><b className="text-2xl text-white tabular-nums">{d.daDang}/{d.thuVien}</b><br />bài thư viện đã đăng</p>
              <p><b className="text-2xl text-white tabular-nums">{d.moiNgay}</b><br />bài/ngày (FEED_HOC_MOI_NGAY)</p>
              <p><b className={`text-2xl ${d.autopost ? 'text-emerald-400' : 'text-amber-400'}`}>{d.autopost ? 'BẬT' : 'TẮT'}</b><br />tự đăng (FEED_HOC_AUTOPOST)</p>
              <p><b className="text-2xl text-white">{d.keTiep.id ?? '—'}</b><br />bài kế tiếp</p>
            </div>
            {d.keTiep.lyDo && <p className="mt-3 text-xs text-[var(--a-text-2)]">Vì sao: {d.keTiep.lyDo.join(' · ')}</p>}
            <div className="mt-4">
              <button className={nut} disabled={!!ban || !d.keTiep.id} onClick={() => lam('dang', async () => {
                const r = await goi<{ posted: boolean; postId?: number; id?: string; reason?: string }>('/dang', {});
                return r.posted ? `Đã đăng bài #${r.postId} (${r.id})` : `Không đăng: ${r.reason}`;
              })}>
                {ban === 'dang' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Đăng ngay bài kế tiếp
              </button>
            </div>
            {d.ganDay.length > 0 && (
              <ul className="mt-4 space-y-1 text-xs text-[var(--a-text-2)]">
                {d.ganDay.map((h) => (
                  <li key={`${h.id}-${h.luc}`} className="tabular-nums">
                    {new Date(h.luc).toLocaleString('vi-VN')} · <span className="text-white">{h.id}</span> · {h.nhom} · {h.dinhDang} · ảnh {h.mau}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Bài bot mẫu cũ (so sánh A vs B, mẹo Claude 💡)" icon={EyeOff} tone="#f59e0b">
            <p className="text-sm text-[var(--a-text-2)]">
              Tổng bài của các bot tin: <b className="text-white">{d.baiBot.tong}</b> · thuộc mẫu cũ: <b className="text-white">{d.baiBot.mauCu}</b> ·
              đang hiện: <b className="text-white">{d.baiBot.dangHien}</b> · đã ẩn: <b className="text-white">{d.baiBot.daAn}</b>
            </p>
            {d.baiBot.theoTieuDe.length > 0 && (
              <ul className="mt-3 grid gap-1 text-xs text-[var(--a-text-2)] sm:grid-cols-2">
                {d.baiBot.theoTieuDe.map((t) => <li key={t.tieuDe}><b className="tabular-nums text-white">{t.so}×</b> {t.tieuDe}</li>)}
              </ul>
            )}
            <p className="mt-3 text-xs text-[var(--a-text-2)]">
              Ẩn = chuyển sang Riêng tư (không ai thấy nữa, bot không đăng nhập). Đảo ngược được bằng “Hiện lại”. Không xoá dữ liệu.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {!xacNhanAn ? (
                <button className={nut} disabled={!!ban || d.baiBot.dangHien === 0} onClick={() => setXacNhanAn(true)}>
                  <EyeOff className="h-4 w-4" /> Ẩn {d.baiBot.dangHien} bài mẫu cũ…
                </button>
              ) : (
                <>
                  <span className="text-sm text-amber-300">Ẩn {d.baiBot.dangHien} bài khỏi Bảng tin?</span>
                  <button className={`${nut} border-amber-400/60`} disabled={!!ban} onClick={() => lam('an', async () => {
                    const r = await goi<{ daAn?: number }>('/an-mau-cu', { xacNhan: true });
                    setXacNhanAn(false);
                    return `Đã ẩn ${r.daAn ?? 0} bài`;
                  })}>
                    {ban === 'an' ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Xác nhận ẩn
                  </button>
                  <button className={nut} onClick={() => setXacNhanAn(false)}>Huỷ</button>
                </>
              )}
              <button className={nut} disabled={!!ban || d.baiBot.daAn === 0} onClick={() => lam('hien', async () => {
                const r = await goi<{ hienLai: number }>('/hien-lai', {});
                return `Đã hiện lại ${r.hienLai} bài`;
              })}>
                <RotateCcw className="h-4 w-4" /> Hiện lại
              </button>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
