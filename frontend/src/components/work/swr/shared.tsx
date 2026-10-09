'use client';

/**
 * CTW đợt 4b — mảnh dùng chung của trang Wiegers (SWR302): làm mới dữ liệu, tải tệp, chip vòng đời / loại yêu cầu,
 * nút hàng. Bảng + chip màu dùng lại từ srs/shared (token AA `--w-*-text`, nền pha nhạt).
 */

import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { saveBlob } from '@/lib/work-docs3a-api';
import { workSwrApi, workSwrKeys, type Lifecycle, type ReqType } from '@/lib/work-swr-api';
import { workCtw4Keys } from '@/lib/work-ctw4-api';
import { wt, type WKey } from '@/components/work/i18n';
import { Chip } from '../srs/shared';

export { Chip, Clip, TableFrame, TD, TextArea, TH } from '../srs/shared';

/** Mọi thứ SWR phụ thuộc lẫn nhau (feature ⇒ sáu liên kết ⇒ RTM) ⇒ làm mới cả cụm. */
export function useSwrRefresh(pid: number) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: workSwrKeys.all(pid) });
    qc.invalidateQueries({ queryKey: workCtw4Keys.rtm(pid) });
    qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) });
  };
}

export async function downloadXlsx(pid: number, what: Parameters<typeof workSwrApi.exportXlsx>[1]) {
  try {
    const f = await workSwrApi.exportXlsx(pid, what);
    saveBlob(f.blob, f.fileName);
    toast.success(wt('swr.downloaded', { name: f.fileName }));
  } catch (e) { toast.error(workError(e, wt('swr.exportFailed'))); }
}

export const LIFECYCLE_KEY: Record<Lifecycle, WKey> = {
  PROPOSED: 'swr.lcProposed', APPROVED: 'swr.lcApproved', IMPLEMENTED: 'swr.lcImplemented', VERIFIED: 'swr.lcVerified', DELETED: 'swr.lcDeleted', REJECTED: 'swr.lcRejected',
};
export const TYPE_KEY: Record<ReqType, WKey> = {
  BUSINESS: 'swr.tBusiness', USER: 'swr.tUser', FUNCTIONAL: 'swr.tFunctional', QUALITY: 'swr.tQuality', CONSTRAINT: 'swr.tConstraint',
  EXTERNAL_INTERFACE: 'swr.tInterface', DATA: 'swr.tData',
};
export const P3_KEY: Record<string, WKey> = { HIGH: 'status.prioHigh', MEDIUM: 'status.prioMedium', LOW: 'status.prioLow' };
/** Nhãn của mã IN HOA ("PERFORMANCE" ⇒ "Performance"). */
export const caps = (s: string | null | undefined) => (s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ') : '');

export function LifecycleChip({ lc }: { lc: Lifecycle }) {
  const tone = lc === 'VERIFIED' ? 'green' : lc === 'IMPLEMENTED' ? 'blue' : lc === 'APPROVED' ? 'accent' : lc === 'PROPOSED' ? 'yellow' : 'muted';
  return <Chip tone={tone}>{wt(LIFECYCLE_KEY[lc])}</Chip>;
}

export const RowActions = ({ onEdit, onDelete, label }: { onEdit?: () => void; onDelete?: () => void; label: string }) => (
  <span className="flex justify-end gap-1">
    {onEdit && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.edit')} ${label}`} title={wt('common.edit')} onClick={onEdit}><Pencil size={13} /></button>}
    {onDelete && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.delete')} ${label}`} title={wt('common.delete')} onClick={onDelete}><Trash2 size={13} /></button>}
  </span>
);

/** Thanh mở đầu của mỗi tab: một câu giải thích + các nút bên phải. */
export function TabIntro({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="min-w-[240px] flex-1 text-[13px] text-[var(--w-text-2)]">{text}</p>
      {children}
    </div>
  );
}
