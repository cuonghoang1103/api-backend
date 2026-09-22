'use client';

/**
 * /admin/thong-bao — toàn bộ hộp thư admin, có lọc.
 *
 * Cái chuông ở header chỉ hiện 15 tin gần nhất; trang này để lần lại lịch sử
 * và lọc theo loại việc. Xem `services/thongBaoAdmin.service.ts` (backend) để
 * biết vì sao bảng này tồn tại tách khỏi thông báo mạng xã hội.
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, CheckCheck, Loader2, ExternalLink, Inbox } from 'lucide-react';
import { BIEU_TUONG_TIN } from '@/components/admin/bieuTuongTin';
import { EmptyState, PageHeader, Tabs, relTime } from '@/components/admin/ui';

interface TinAdmin {
  id: number;
  loai: string;
  tieuDe: string;
  noiDung: string | null;
  duongDan: string | null;
  mucDo: string;
  daDoc: boolean;
  daXuLy: boolean;
  createdAt: string;
  nguoi: { id: number; username: string | null; fullName: string | null } | null;
}

const TEN_LOAI: Record<string, string> = {
  XIN_KEY: 'Key request', DON_MOI: 'New order', DA_THANH_TOAN: 'Paid',
  CHUYEN_KHOAN_CHO_DUYET: 'Transfer to confirm', DOI_KEY: 'Key replacement', BAO_CAO: 'Report',
  XOA_TAI_KHOAN: 'Account deletion', NAP_DIEM: 'Top-up', MUA_PRO: 'Pro purchase', KHAC: 'Other',
};

const BO_LOC = [
  { ma: 'can_xu_ly', ten: 'Pending' },
  { ma: 'chua_doc', ten: 'Unread' },
  { ma: 'tat_ca', ten: 'All' },
] as const;

function ngayGio(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function TrangThongBaoAdmin() {
  const [loc, setLoc] = useState<(typeof BO_LOC)[number]['ma']>('can_xu_ly');
  const [loai, setLoai] = useState<string>('');
  const [tin, setTin] = useState<TinAdmin[]>([]);
  const [dem, setDem] = useState({ chuaDoc: 0, canXuLy: 0 });
  const [dangTai, setDangTai] = useState(true);

  const nap = useCallback(async () => {
    setDangTai(true);
    try {
      const q = new URLSearchParams({ limit: '60' });
      if (loc === 'can_xu_ly') q.set('canXuLy', '1');
      if (loc === 'chua_doc') q.set('chuaDoc', '1');
      if (loai) q.set('loai', loai);
      const r = await fetch(`/api/v1/admin/thong-bao?${q}`, { credentials: 'include' });
      const j = await r.json();
      if (j?.data) { setTin(j.data.items ?? []); setDem({ chuaDoc: j.data.chuaDoc, canXuLy: j.data.canXuLy }); }
    } catch { /* im lặng */ } finally { setDangTai(false); }
  }, [loc, loai]);

  useEffect(() => { nap(); }, [nap]);

  async function xong(id: number) {
    await fetch(`/api/v1/admin/thong-bao/${id}/xong`, { method: 'POST', credentials: 'include' }).catch(() => {});
    nap();
  }
  async function docHet() {
    await fetch('/api/v1/admin/thong-bao/doc-het', { method: 'POST', credentials: 'include' }).catch(() => {});
    nap();
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Inbox"
        description={
          <>
            {dem.canXuLy > 0 ? `${dem.canXuLy} việc đang chờ bạn xử lý` : 'Không còn việc nào đang chờ'}
            {dem.chuaDoc > 0 && ` · ${dem.chuaDoc} chưa đọc`}
          </>
        }
        actions={
          dem.chuaDoc > 0 && (
            <button onClick={docHet} className="a-btn">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--a-border)] pb-2">
        <Tabs
          value={loc}
          onChange={setLoc}
          items={BO_LOC.map((b) => ({
            value: b.ma,
            label: b.ten,
            count: b.ma === 'can_xu_ly' ? dem.canXuLy : b.ma === 'chua_doc' ? dem.chuaDoc : undefined,
          }))}
        />
        <select
          value={loai}
          onChange={(e) => setLoai(e.target.value)}
          aria-label="Filter by type"
          className="h-7 rounded-[6px] border border-[var(--a-border-strong)] bg-transparent px-2 text-[12.5px] text-[var(--a-text-2)] outline-none"
        >
          <option value="">All types</option>
          {Object.entries(TEN_LOAI).map(([ma, ten]) => (
            <option key={ma} value={ma}>{ten}</option>
          ))}
        </select>
      </div>

      {dangTai ? (
        <div className="flex justify-center py-16"><Loader2 className="h-4 w-4 animate-spin text-[var(--a-text-3)]" /></div>
      ) : tin.length === 0 ? (
        <EmptyState icon={Inbox} title={loc === 'can_xu_ly' ? 'Nothing pending' : 'No notifications'}>
          {loc === 'can_xu_ly' ? 'Mọi việc đã xử lý xong.' : 'Chưa có thông báo nào ở bộ lọc này.'}
        </EmptyState>
      ) : (
        <ul>
          {tin.map((t) => {
            const Icon = BIEU_TUONG_TIN[t.loai] ?? BIEU_TUONG_TIN.KHAC;
            const cho = t.mucDo === 'can_xu_ly' && !t.daXuLy;
            return (
              <li key={t.id} className="group relative flex gap-3 border-b border-[var(--a-border)] py-3 pl-3 pr-1 hover:bg-[var(--a-hover)]">
                {!t.daDoc && <span className="absolute left-0 top-[18px] h-1.5 w-1.5 rounded-full bg-[var(--a-accent)]" aria-label="Unread" />}
                <Icon className="mt-[1px] h-4 w-4 shrink-0 text-[var(--a-text-3)]" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className={`break-words text-[13px] leading-snug ${t.daDoc ? 'text-[var(--a-text-2)]' : 'font-medium text-[var(--a-text)]'}`}>{t.tieuDe}</p>
                    <span className="shrink-0 text-[12px] tabular-nums text-[var(--a-text-3)]" title={ngayGio(t.createdAt)}>{relTime(t.createdAt)}</span>
                  </div>
                  {t.noiDung && (
                    <p className="mt-0.5 line-clamp-3 whitespace-pre-line break-words text-[12.5px] leading-snug text-[var(--a-text-3)]">{t.noiDung}</p>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--a-text-3)]">
                    <span>{TEN_LOAI[t.loai] ?? t.loai}</span>
                    {t.nguoi?.username && <span>{t.nguoi.fullName || t.nguoi.username}</span>}
                    {t.mucDo === 'can_xu_ly' && (
                      <span className={t.daXuLy ? 'text-[var(--a-green)]' : 'font-medium text-[var(--a-orange)]'}>
                        {t.daXuLy ? 'Done' : 'Needs action'}
                      </span>
                    )}
                    {t.duongDan && (
                      <Link href={t.duongDan} className="inline-flex items-center gap-1 text-[var(--a-accent-text)] hover:underline">
                        Open <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                    {cho && (
                      <button onClick={() => xong(t.id)} className="inline-flex items-center gap-1 hover:text-[var(--a-green)]">
                        <Check className="h-3 w-3" /> Mark done
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
