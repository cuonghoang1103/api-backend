'use client';

/**
 * /admin/giao-dien — admin đặt GIAO DIỆN CHUNG (27/10/2026):
 *   1. Nền 4 mùa mặc định cho web (người chưa tự chọn) + tuỳ chọn ÉP cho mọi người.
 *   2. Nền của chính trang admin: Nâu dịu (mặc định) · Xanh aidev · Theo mùa (có hoa/lá/tuyết rơi).
 * Backend: GET /api/v1/giao-dien (công khai) · PUT /api/v1/giao-dien/admin. Người dùng nhận thay đổi ở lần tải trang kế
 * tiếp (đệm 60 s ở máy chủ); trang ngoài nạp lúc trình duyệt rảnh nên không làm chậm lần vẽ đầu.
 */
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CalendarDays, Check, Flower2, Leaf, Loader2, Palette, Snowflake, Sun } from 'lucide-react';
import { PageHeader, Section } from '@/components/admin/ui';
import { datNenAdminTam, type GiaoDienWeb, type NenAdmin } from '@/components/admin/shell/useNenAdmin';
import { CAC_CHU_DE, TEN_CHU_DE, TEN_MUA, giaiMua, type ChuDe } from '@/lib/chuDeMua/logic';

const CanvasXemTruoc = dynamic(() => import('@/components/chuDeMua/CanvasXemTruoc'), { ssr: false });

const BIEU_TUONG: Record<ChuDe, React.ReactNode> = {
  macDinh: <Palette className="h-4 w-4" />, tuDong: <CalendarDays className="h-4 w-4" />, xuan: <Flower2 className="h-4 w-4" />,
  ha: <Sun className="h-4 w-4" />, thu: <Leaf className="h-4 w-4" />, dong: <Snowflake className="h-4 w-4" />,
};

const NEN: Array<{ id: NenAdmin; ten: string; mo: string; mau: string }> = [
  { id: 'nau', ten: 'Nâu dịu', mo: 'Đen nâu ấm, dịu mắt khi làm lâu', mau: 'linear-gradient(135deg, #0f0b09, #1d1511 50%, #2b1d15)' },
  { id: 'xanh', ten: 'Xanh than', mo: 'Xanh dương đậm kiểu aidev.edu.vn', mau: 'linear-gradient(135deg, #141a21, #021d6f 50%, #063ba7)' },
  { id: 'mua', ten: 'Theo mùa', mo: 'Màu + hoa, lá, tuyết rơi theo mùa của web', mau: 'linear-gradient(135deg, #100a06, #3a1e0c 55%, #2a1410)' },
];

async function goi(init?: RequestInit): Promise<GiaoDienWeb> {
  const r = await fetch(`/api/v1/giao-dien${init ? '/admin' : ''}`, {
    credentials: 'include', ...init, headers: { 'Content-Type': 'application/json' },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.message ?? `Lỗi ${r.status}`);
  return j.data as GiaoDienWeb;
}

export default function GiaoDienAdminPage() {
  const [g, setG] = useState<GiaoDienWeb | null>(null);
  const [dangLuu, setDangLuu] = useState(false);
  useEffect(() => { goi().then(setG).catch((e) => toast.error((e as Error).message)); }, []);

  const luu = async (moi: Partial<GiaoDienWeb>) => {
    if (!g) return;
    setDangLuu(true);
    const truoc = g;
    setG({ ...g, ...moi });
    try {
      const v = await goi({ method: 'PUT', body: JSON.stringify(moi) });
      setG(v);
      datNenAdminTam(v);
      toast.success('Đã lưu — người dùng nhận ở lần tải trang kế tiếp');
    } catch (e) { setG(truoc); toast.error((e as Error).message); } finally { setDangLuu(false); }
  };

  if (!g) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[var(--a-text-3)]" /></div>;
  const muaTuDong = giaiMua('tuDong');

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Hệ thống" title="Giao diện & nền"
        description="Đặt nền 4 mùa mặc định cho toàn web và nền của trang quản trị. Lưu là áp ngay cho mọi người."
        actions={dangLuu ? <Loader2 className="h-5 w-5 animate-spin text-[var(--a-text-3)]" /> : undefined} />

      <div className="space-y-6">
        <Section title="Nền 4 mùa của web" icon={Flower2}>
          <p className="mb-4 text-[14.5px] text-[var(--a-text-2)]">
            Người dùng <b className="text-[var(--a-text)]">chưa tự chọn</b> chủ đề sẽ thấy chủ đề này. Ai đã chọn riêng ở Cài đặt → Giao diện thì giữ lựa chọn của họ,
            trừ khi bật &ldquo;Áp cho mọi người&rdquo;. Màn đọc dài (bài học, thi, sách, CT Work) luôn chỉ giữ màu, không hạt rơi.
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {CAC_CHU_DE.map((c) => {
              const mua = giaiMua(c);
              const chon = g.chuDeMacDinh === c;
              return (
                <button key={c} type="button" onClick={() => void luu({ chuDeMacDinh: c, ...(c === 'macDinh' ? { epTatCa: false } : {}) })}
                  aria-pressed={chon}
                  className={`overflow-hidden rounded-2xl border text-left transition-colors ${chon ? 'border-[var(--a-accent)] ring-2 ring-[var(--a-accent)]' : 'border-[var(--a-border)] hover:border-[var(--a-border-strong)]'}`}>
                  <div className="xem-mua relative h-24 overflow-hidden" data-xem={mua ?? 'macDinh'} style={{ background: 'var(--bg-primary)' }}>
                    {mua && <CanvasXemTruoc mua={mua} toi chay />}
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--a-raised)] px-3 py-2.5">
                    <span className="text-[var(--a-accent-text)]">{BIEU_TUONG[c]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-[var(--a-text)]">{TEN_CHU_DE[c].ten}</p>
                      <p className="truncate text-[12px] text-[var(--a-text-3)]">{c === 'tuDong' && muaTuDong ? `Đang là ${TEN_MUA[muaTuDong]}` : TEN_CHU_DE[c].moTa}</p>
                    </div>
                    {chon && <Check className="h-4 w-4 shrink-0 text-[var(--a-accent-text)]" />}
                  </div>
                </button>
              );
            })}
          </div>
          <label className={`mt-4 flex items-start gap-3 rounded-xl border border-[var(--a-border)] p-3.5 ${g.chuDeMacDinh === 'macDinh' ? 'opacity-50' : 'cursor-pointer'}`}>
            <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--a-accent)]" disabled={g.chuDeMacDinh === 'macDinh' || dangLuu}
              checked={g.epTatCa} onChange={(e) => void luu({ epTatCa: e.target.checked })} />
            <span>
              <span className="block text-[15px] font-bold text-[var(--a-text)]">Áp cho mọi người (đè lựa chọn riêng)</span>
              <span className="block text-[13px] text-[var(--a-text-3)]">Dùng dịp Tết, Noel… Tắt đi thì ai đã chọn riêng lại thấy lựa chọn của họ.</span>
            </span>
          </label>
        </Section>

        <Section title="Nền trang quản trị" icon={Palette}>
          <div className="grid gap-3 md:grid-cols-3">
            {NEN.map((n) => {
              const chon = g.nenAdmin === n.id;
              return (
                <button key={n.id} type="button" onClick={() => void luu({ nenAdmin: n.id })} aria-pressed={chon}
                  className={`overflow-hidden rounded-2xl border text-left ${chon ? 'border-[var(--a-accent)] ring-2 ring-[var(--a-accent)]' : 'border-[var(--a-border)] hover:border-[var(--a-border-strong)]'}`}>
                  <div className="h-20" style={{ background: n.mau }} />
                  <div className="flex items-center gap-2 bg-[var(--a-raised)] px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold text-[var(--a-text)]">{n.ten}</p>
                      <p className="text-[12.5px] text-[var(--a-text-3)]">{n.mo}</p>
                    </div>
                    {chon && <Check className="h-4 w-4 text-[var(--a-accent-text)]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}
