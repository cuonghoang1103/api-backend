'use client';

/**
 * Cài đặt dự án → CuongMini cho cả nhóm (đợt 6, 18/10/2026). Thành viên KHÔNG có Pro dùng CuongMini (CLI · app desktop ·
 * VS Code) cho dự án này bằng hạn mức của trưởng nhóm (ADMIN có Pro). Trưởng nhóm bật/tắt, chỉnh trần mỗi người/ngày và
 * cả nhóm/tháng, chọn người tài trợ; ai cũng xem được ai dùng bao nhiêu.
 * Server: GET/PUT /work/projects/:pid/cuongmini-team (src/services/agent/hanMucNhom.ts). Gọi API ngay trong component
 * (không thêm vào lib/api.ts dùng chung).
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { currentWorkLocale } from '@/components/work/i18n/store';
import { PageLoading } from '../ui';
import { Section, Select, Switch } from './shared';

interface CauHinh { bat: boolean; tranNgayNguoiUsd: number; tranThangNhomUsd: number; chuId: number | null }
/** Máy chủ trả thêm `dongY` (ai đã tự đồng ý tài trợ) — KHÔNG gửi lại (PUT `.strict()` từ chối khoá lạ). */
const chiSua = (c: CauHinh & { dongY?: number[] }): CauHinh => ({ bat: c.bat, tranNgayNguoiUsd: c.tranNgayNguoiUsd, tranThangNhomUsd: c.tranThangNhomUsd, chuId: c.chuId });
interface BangNhom {
  cauHinh: CauHinh;
  chu: { id: number; username: string; ten: string } | null;
  daDungThang: number;
  nguoi: Array<{ userId: number; username: string; ten: string; thang: number; homNay: number; soLuot: number }>;
  sua: boolean;
  ungVien: Array<{ id: number; username: string; ten: string; pro: boolean; dongY?: boolean }>;
  toiId?: number;
}

const T = (vi: string, en: string): string => (currentWorkLocale() === 'vi' ? vi : en);
const usd = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;
const khoa = (pid: number) => ['work', 'project', pid, 'cuongmini-team'] as const;

export default function ProjectCuongMini({ config }: { config: ProjectConfig; slug: string }) {
  const pid = config.id;
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: khoa(pid),
    queryFn: async () => (await api.get<{ data: BangNhom }>(`/work/projects/${pid}/cuongmini-team`)).data.data,
  });
  const [s, setS] = useState<CauHinh | null>(null);
  useEffect(() => { if (q.data) setS(chiSua(q.data.cauHinh)); }, [q.data]);
  const save = useMutation({
    mutationFn: async (body: Partial<CauHinh>) => (await api.put<{ data: BangNhom }>(`/work/projects/${pid}/cuongmini-team`, body)).data.data,
    onSuccess: (r) => { qc.setQueryData(khoa(pid), r); setS(chiSua(r.cauHinh)); toast.success(T('Đã lưu', 'Saved')); },
    onError: (err) => toast.error(workError(err, T('Không lưu được', 'Could not save'))),
  });

  if (!q.data || !s) return q.error ? <p className="text-[13px] text-[var(--w-red)]">{workError(q.error)}</p> : <PageLoading rows={4} />;
  const d = q.data;
  const can = d.sua;
  const dirty = JSON.stringify(s) !== JSON.stringify(chiSua(d.cauHinh));
  const phanTram = s.tranThangNhomUsd > 0 ? Math.min(100, Math.round((d.daDungThang / s.tranThangNhomUsd) * 100)) : 0;

  return (
    <div className="max-w-[880px]" data-testid="project-cuongmini-settings">
      <Section
        title={T('CuongMini cho cả nhóm', 'CuongMini for the whole team')}
        description={T(
          'Thành viên không có gói Pro vẫn dùng được CuongMini (CLI, app desktop, VS Code) cho dự án này — bằng hạn mức của trưởng nhóm. Chỉ model miễn phí của CuongMini Core (Solid, Nova, Shin, Eco); model cần khoá vẫn cần khoá. Người tài trợ phải là ADMIN có Pro và TỰ đồng ý (chọn chính mình ở ô Người tài trợ) — người tạo dự án được tính là đã đồng ý. Agent CT Work không dùng được đường này.',
          'Members without Pro can use CuongMini (CLI, desktop app, VS Code) for this project — on the team lead\'s allowance. Free CuongMini Core models only (Solid, Nova, Shin, Eco); locked models still need a key. The sponsor must be an admin with Pro who agrees themselves (picks themselves as sponsor) — the project creator counts as agreed. CT Work AI agents cannot use it.',
        )}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Switch checked={s.bat} disabled={!can} onChange={(v) => setS({ ...s, bat: v })} label={T('Bật cho cả nhóm', 'On for the team')} />
            <span className="text-[13px]">
              <b className="font-medium">{T('Bật cho cả nhóm', 'On for the team')}</b>
              <span className="block text-[12.5px] text-[var(--w-text-2)]">
                {d.chu
                  ? T(`Đang dùng hạn mức của @${d.chu.username} (${d.chu.ten}).`, `Using the allowance of @${d.chu.username} (${d.chu.ten}).`)
                  : T('Chưa có ADMIN nào của dự án có gói Pro còn hạn VÀ đã đồng ý tài trợ — thành viên chưa dùng được.', 'No admin of this project with an active Pro plan has agreed to sponsor — members cannot use it yet.')}
              </span>
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-[13px]">
              <span className="block text-[12px] text-[var(--w-text-3)]">{T('Trần mỗi người / ngày (USD)', 'Per member / day (USD)')}</span>
              <input
                type="number" min={0} max={50} step={0.5} disabled={!can} value={s.tranNgayNguoiUsd}
                onChange={(e) => setS({ ...s, tranNgayNguoiUsd: Math.max(0, Math.min(50, Number(e.target.value) || 0)) })}
                className="mt-1 h-8 w-full rounded-[6px] border border-[var(--w-border)] bg-[var(--w-surface)] px-2"
                data-testid="cm-tran-ngay"
              />
            </label>
            <label className="text-[13px]">
              <span className="block text-[12px] text-[var(--w-text-3)]">{T('Trần cả nhóm / tháng (USD)', 'Whole team / month (USD)')}</span>
              <input
                type="number" min={0} max={1000} step={1} disabled={!can} value={s.tranThangNhomUsd}
                onChange={(e) => setS({ ...s, tranThangNhomUsd: Math.max(0, Math.min(1000, Number(e.target.value) || 0)) })}
                className="mt-1 h-8 w-full rounded-[6px] border border-[var(--w-border)] bg-[var(--w-surface)] px-2"
                data-testid="cm-tran-thang"
              />
            </label>
            <label className="text-[13px]">
              <span className="block text-[12px] text-[var(--w-text-3)]">{T('Người tài trợ', 'Sponsoring lead')}</span>
              <Select disabled={!can} value={s.chuId ?? ''} onChange={(e) => setS({ ...s, chuId: e.target.value ? Number(e.target.value) : null })} className="mt-1 w-full">
                <option value="">{T('Tự chọn (lead ⇒ ADMIN có Pro)', 'Automatic (lead ⇒ an admin with Pro)')}</option>
                {d.ungVien.map((u) => {
                  const toi = u.id === d.toiId;
                  /* Người khác chỉ chọn được khi HỌ đã tự đồng ý; chọn chính mình = đồng ý. */
                  const chuaDongY = !toi && u.dongY === false;
                  return (
                    <option key={u.id} value={u.id} disabled={!u.pro || chuaDongY}>
                      {`@${u.username} — ${u.ten}${toi ? T(' (tôi — chọn = đồng ý tài trợ)', ' (me — picking = I agree to sponsor)') : ''}${u.pro ? '' : T(' (chưa có Pro)', ' (no Pro)')}${u.pro && chuaDongY ? T(' (chưa đồng ý)', ' (has not agreed)') : ''}`}
                    </option>
                  );
                })}
              </Select>
            </label>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px] text-[var(--w-text-3)]">
              <span>{T('Cả nhóm đã dùng tháng này', 'Team usage this month')}</span>
              <span>{`${usd(d.daDungThang)} / ${usd(s.tranThangNhomUsd)}`}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--w-surface-2)]">
              <div className="h-full rounded-full bg-[var(--w-accent)]" style={{ width: `${phanTram}%` }} />
            </div>
          </div>
          {can ? (
            <div className="flex gap-2">
              <button type="button" disabled={!dirty || save.isPending} onClick={() => save.mutate(s)} className="h-8 rounded-[6px] bg-[var(--w-accent)] px-3 text-[13px] font-medium text-white disabled:opacity-50" data-testid="cm-luu">
                {save.isPending ? T('Đang lưu…', 'Saving…') : T('Lưu', 'Save')}
              </button>
              {dirty ? <button type="button" onClick={() => setS(chiSua(d.cauHinh))} className="h-8 rounded-[6px] px-3 text-[13px] text-[var(--w-text-2)] hover:bg-[var(--w-surface-2)]">{T('Huỷ thay đổi', 'Discard')}</button> : null}
            </div>
          ) : (
            <p className="text-[12.5px] text-[var(--w-text-3)]">{T('Chỉ ADMIN của dự án sửa được mục này.', 'Only project admins can change this.')}</p>
          )}
        </div>
      </Section>

      <Section title={T('Ai dùng bao nhiêu (tháng này)', 'Who used how much (this month)')} description={T('Chỉ tính lượt dùng HẠN MỨC NHÓM — người có Pro riêng dùng gói của họ, không hiện ở đây.', 'Only turns on the TEAM allowance — members with their own Pro use their plan and do not appear here.')}>
        {d.nguoi.length ? (
          <table className="w-full text-[13px]" data-testid="cm-bang">
            <thead>
              <tr className="text-left text-[12px] text-[var(--w-text-3)]">
                <th className="py-1 font-normal">{T('Thành viên', 'Member')}</th>
                <th className="py-1 text-right font-normal">{T('Hôm nay', 'Today')}</th>
                <th className="py-1 text-right font-normal">{T('Tháng này', 'This month')}</th>
                <th className="py-1 text-right font-normal">{T('Số lượt', 'Turns')}</th>
              </tr>
            </thead>
            <tbody>
              {d.nguoi.map((n) => (
                <tr key={n.userId} className="border-t border-[var(--w-border)]">
                  <td className="py-1.5">{`@${n.username}`} <span className="text-[var(--w-text-3)]">{n.ten}</span></td>
                  <td className={`py-1.5 text-right ${n.homNay >= s.tranNgayNguoiUsd && s.tranNgayNguoiUsd > 0 ? 'text-[var(--w-red)]' : ''}`}>{usd(n.homNay)}</td>
                  <td className="py-1.5 text-right">{usd(n.thang)}</td>
                  <td className="py-1.5 text-right">{n.soLuot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="flex items-center gap-2 text-[13px] text-[var(--w-text-3)]"><Sparkles size={14} /> {T('Chưa ai dùng hạn mức nhóm tháng này.', 'Nobody has used the team allowance this month.')}</p>
        )}
      </Section>
    </div>
  );
}
