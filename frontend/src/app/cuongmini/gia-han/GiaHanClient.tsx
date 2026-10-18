'use client';

/**
 * Trang nhập mã gia hạn theo $ (xem page.tsx). Gọi thẳng `/api/v1/agent/gia-han-tien` bằng cookie phiên (không thêm
 * phương thức vào lib/api.ts dùng chung). Mã chỉ nằm trong ô nhập + thân một lượt POST — không lưu, không vào URL.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, KeyRound, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface TranCham {
  tran: string; ky: 'ngay' | 'thang' | 'cuaSo'; ten: string; tenEn: string; mucUsd: number; daDungUsd: number; tranUsd: number;
  canDuyet: boolean; dangCho: number | null; lanThu: number;
}
interface YeuCau {
  id: number; tran: string; tenTran: string; tenTranEn: string; soUsd: number; lanThu: number; trangThai: 'CHO_DUYET' | 'DA_CAP' | 'TU_CHOI' | 'HET_KY';
  lyDoTuChoi: string | null; createdAt: string;
}
interface TongQuan { coMa: boolean; tranCham: TranCham[]; ganDay: YeuCau[] }

const API = '/api/v1/agent/gia-han-tien';
const usd = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;
/* Ngôn ngữ đặt SAU khi gắn (máy chủ luôn dựng tiếng Việt) — tránh lệch hydrate với trình duyệt tiếng Anh. */
let laVi = true;
const T = (vi: string, en: string) => (laVi ? vi : en);
const TEN_TT: Record<YeuCau['trangThai'], [string, string]> = {
  CHO_DUYET: ['Chờ duyệt', 'Pending'], DA_CAP: ['Đã cộng', 'Granted'], TU_CHOI: ['Bị từ chối', 'Rejected'], HET_KY: ['Quá kỳ', 'Expired'],
};

export default function GiaHanClient() {
  const [d, setD] = useState<TongQuan | null>(null);
  const [chuaDangNhap, setChuaDangNhap] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [ma, setMa] = useState<Record<string, string>>({});
  const [dang, setDang] = useState<string | null>(null);
  const [bao, setBao] = useState<Record<string, string>>({});
  const [, setNn] = useState(0);
  useEffect(() => { laVi = /^vi/i.test(navigator.language || 'vi'); setNn((x) => x + 1); }, []);

  const nap = useCallback(async () => {
    try {
      const r = await fetch(API, { credentials: 'include' });
      if (r.status === 401) { setChuaDangNhap(true); return; }
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setLoi(j.message ?? `HTTP ${r.status}`); return; }
      setD(j.data as TongQuan);
    } catch { setLoi(T('Không kết nối được máy chủ.', 'Could not reach the server.')); }
  }, []);
  useEffect(() => { void nap(); }, [nap]);
  /* Có yêu cầu đang chờ ⇒ tự kiểm lại mỗi 30 giây. */
  const coCho = !!d?.tranCham.some((t) => t.dangCho) || !!d?.ganDay.some((y) => y.trangThai === 'CHO_DUYET');
  useEffect(() => {
    if (!coCho) return undefined;
    const h = setInterval(() => { void nap(); }, 30_000);
    return () => clearInterval(h);
  }, [coCho, nap]);

  const gui = async (t: TranCham) => {
    const m = (ma[t.tran] ?? '').trim();
    if (!m) return;
    setDang(t.tran);
    try {
      const r = await fetch(API, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ma: m, tran: t.tran }) });
      const j = await r.json().catch(() => ({}));
      setMa((x) => ({ ...x, [t.tran]: '' }));
      if (!r.ok) { setBao((x) => ({ ...x, [t.tran]: `⚠️ ${j.message ?? `HTTP ${r.status}`}` })); return; }
      const k = j.data as { ketQua: 'daCap' | 'choDuyet'; id: number; soUsd: number };
      setBao((x) => ({
        ...x,
        [t.tran]: k.ketQua === 'daCap'
          ? T(`✓ Đã cộng +${usd(k.soUsd)} — quay lại app và gửi lại câu hỏi.`, `✓ +${usd(k.soUsd)} added — go back to the app and resend.`)
          : T(`⏳ Đã gửi yêu cầu #${k.id}, chờ admin duyệt — trang tự kiểm lại.`, `⏳ Request #${k.id} sent, waiting for an admin — this page re-checks.`),
      }));
      await nap();
    } finally { setDang(null); }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-text-primary">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold"><KeyRound className="h-6 w-6" /> {T('Mã gia hạn CuongMini', 'CuongMini extension code')}</h1>
      <p className="mb-6 text-sm text-text-muted">
        {T('Chạm giới hạn chi tiêu của CuongMini (CLI, app desktop, VS Code)? Nhập mã gia hạn do quản trị cấp: lần đầu trong kỳ được cộng ngay một mức, từ lần 2 cần admin duyệt. App bản mới có sẵn ô nhập mã ngay chỗ báo lỗi.',
          'Hit a CuongMini spending limit (CLI, desktop app, VS Code)? Enter the admin-issued extension code: the first time in a period adds one step at once, later ones need an admin\'s approval. Newer apps have the code box right where the error appears.')}
      </p>
      {chuaDangNhap ? (
        <Link href="/login?redirect=/cuongmini/gia-han" className="inline-block rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white">{T('Đăng nhập để tiếp tục', 'Sign in to continue')}</Link>
      ) : loi ? (
        <p className="text-sm text-red-400">{loi}</p>
      ) : !d ? (
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
      ) : (
        <div className="space-y-4">
          {!d.coMa && <p className="rounded-xl border border-amber-500/40 p-3 text-sm text-amber-300">{T('Quản trị chưa bật mã gia hạn.', 'The admin has not enabled extension codes.')}</p>}
          {d.tranCham.length === 0 ? (
            <p className="rounded-xl border border-darkborder p-4 text-sm text-text-muted">{T('Bạn chưa chạm giới hạn nào — không cần gia hạn.', 'You have not hit any limit — nothing to extend.')}</p>
          ) : d.tranCham.map((t) => (
            <section key={t.tran} className="rounded-xl border border-darkborder bg-darkcard p-4 text-sm">
              <b>{T(`Đã chạm giới hạn ${t.ten}`, `Limit reached: ${t.tenEn}`)}</b>
              <p className="mt-1 text-text-muted">{`${usd(t.daDungUsd)} / ${usd(t.tranUsd)}`} · {t.canDuyet
                ? T(`lần ${t.lanThu} trong kỳ — cần admin duyệt (+${usd(t.mucUsd)})`, `attempt ${t.lanThu} — needs approval (+${usd(t.mucUsd)})`)
                : T(`mã đúng ⇒ cộng ngay +${usd(t.mucUsd)}`, `correct code ⇒ +${usd(t.mucUsd)} at once`)}</p>
              {t.dangCho ? (
                <p className="mt-2 flex items-center gap-1 text-amber-300"><Clock className="h-4 w-4" /> {T(`Yêu cầu #${t.dangCho} đang chờ admin duyệt — trang tự kiểm lại mỗi 30 giây.`, `Request #${t.dangCho} is waiting for an admin — re-checking every 30 seconds.`)}</p>
              ) : (
                <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); void gui(t); }}>
                  <input type="password" autoComplete="off" value={ma[t.tran] ?? ''} onChange={(e) => setMa((x) => ({ ...x, [t.tran]: e.target.value }))}
                    placeholder={T('Mã gia hạn', 'Extension code')} className="flex-1 rounded-lg border border-darkborder bg-darkbg px-2 py-1" />
                  <button type="submit" disabled={dang === t.tran || !(ma[t.tran] ?? '').trim() || !d.coMa} className="rounded-lg bg-violet-600 px-3 py-1 font-medium text-white disabled:opacity-50">
                    {dang === t.tran ? T('Đang kiểm…', 'Checking…') : T('Gia hạn', 'Extend')}
                  </button>
                </form>
              )}
              {bao[t.tran] && <p className="mt-2">{bao[t.tran]}</p>}
            </section>
          ))}
          {d.ganDay.length > 0 && (
            <section className="text-sm">
              <h2 className="mb-2 font-semibold">{T('Lượt gần đây', 'Recent')}</h2>
              <ul className="space-y-1 text-text-muted">
                {d.ganDay.map((y) => (
                  <li key={y.id} className="flex items-center gap-2">
                    {y.trangThai === 'DA_CAP' ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : y.trangThai === 'TU_CHOI' ? <XCircle className="h-4 w-4 text-red-400" /> : <Clock className="h-4 w-4" />}
                    <span>#{y.id} · {T(y.tenTran, y.tenTranEn)} · +{usd(y.soUsd)} · {T(...TEN_TT[y.trangThai])}{y.lyDoTuChoi ? ` — ${y.lyDoTuChoi}` : ''}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
