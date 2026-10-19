'use client';

/**
 * Đợt 8A — "Tài trợ CuongMini cho mọi dự án tôi tham gia" (ADMIN WEB). Phiên CuongMini gắn một dự án CT Work có admin web
 * là thành viên / trưởng dự án / chủ không gian ⇒ mọi thành viên dùng Sonic 5.5 · Heshin 5.5 · Solid (+ Default/Classic)
 * KHÔNG trần $ (admin trả), chỉ chống spam. Mặc định BẬT (chủ app chốt); tắt chung hoặc tắt từng dự án.
 * Máy chủ: `GET/PUT /agent/tai-tro-admin` (`src/services/agent/taiTroAdmin.ts`). Gọi API trong component (không sửa
 * `lib/api.ts` dùng chung). Dùng ở: Project settings → CuongMini (`projectId`) và trang admin cổng Anthropic (không có).
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface TrangThai {
  laAdmin: boolean;
  bat?: boolean;
  tatDuAn?: number[];
  duAn?: { projectId: number; dangTaiTro: boolean; nhaTaiTro: string | null; toiTat: boolean };
}

export default function TaiTroAdminCongTac({ projectId, vi = true }: { projectId?: number; vi?: boolean }) {
  const T = (a: string, b: string) => (vi ? a : b);
  const qc = useQueryClient();
  const khoa = ['cuongmini', 'tai-tro-admin', projectId ?? 0] as const;
  const q = useQuery({
    queryKey: khoa,
    queryFn: async () => (await api.get<{ data: TrangThai }>(`/agent/tai-tro-admin${projectId ? `?projectId=${projectId}` : ''}`)).data.data,
  });
  const dat = useMutation({
    mutationFn: async (body: { bat?: boolean; duAn?: { id: number; bat: boolean } }) => (await api.put<{ data: TrangThai }>('/agent/tai-tro-admin', body)).data.data,
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['cuongmini', 'tai-tro-admin'] }); toast.success(T('Đã lưu', 'Saved')); },
    onError: () => toast.error(T('Không lưu được', 'Could not save')),
  });
  const d = q.data;
  if (!d) return null;
  const duAn = d.duAn;
  if (!d.laAdmin && !duAn?.dangTaiTro) return null;
  return (
    <div className="rounded-[8px] border border-[var(--w-border,#e5e7eb)] p-3 text-[13px]" data-testid="cuongmini-tai-tro-admin">
      {duAn?.dangTaiTro && (
        <p className="mb-2">
          {T(`✅ Dự án này được admin ${duAn.nhaTaiTro ?? ''} tài trợ CuongMini: mọi thành viên dùng Sonic 5.5, Heshin 5.5, Solid (và Default/Classic) KHÔNG trần tiền khi phiên gắn dự án — chỉ chống spam (10 câu/phút, 300 câu/ngày).`,
            `✅ This project is sponsored by admin ${duAn.nhaTaiTro ?? ''}: every member can use Sonic 5.5, Heshin 5.5, Solid (and Default/Classic) with NO $ cap when the session is bound to it — anti-spam only (10 q/min, 300 q/day).`)}
        </p>
      )}
      {d.laAdmin && (
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={d.bat !== false} disabled={dat.isPending} onChange={(e) => dat.mutate({ bat: e.target.checked })} />
            <span><b className="font-medium">{T('Tài trợ CuongMini cho mọi dự án tôi tham gia', 'Sponsor CuongMini for every project I am in')}</b>
              <span className="block text-[12px] opacity-75">{T('Admin web trả, không trần $ — mặc định bật. Sổ ghi người dùng + bạn + dự án.', 'You (site admin) pay, no $ cap — on by default. Ledger records user + you + project.')}</span></span>
          </label>
          {projectId ? (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!duAn?.toiTat} disabled={dat.isPending || d.bat === false} onChange={(e) => dat.mutate({ duAn: { id: projectId, bat: e.target.checked } })} />
              <span>{T('Tài trợ cho dự án này', 'Sponsor this project')}</span>
            </label>
          ) : (d.tatDuAn?.length ? <p className="text-[12px] opacity-75">{T(`Đang tắt ở ${d.tatDuAn.length} dự án (bật lại trong Project settings → CuongMini của dự án đó).`, `Turned off for ${d.tatDuAn.length} project(s) — re-enable in that project's settings → CuongMini.`)}</p> : null)}
        </div>
      )}
    </div>
  );
}
