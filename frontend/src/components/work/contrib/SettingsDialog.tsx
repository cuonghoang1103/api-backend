'use client';

/** CTW Đóng góp — cài đặt (ADMIN dự án): cả nhóm xem bảng chi tiết, múi giờ chia ngày, ngưỡng "N ngày im lặng", gán tác giả git. */

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userName, workError } from '@/lib/work-api';
import { contribKeys, workContribApi, type ContribSettings } from '@/lib/work-contrib-api';
import { Dialog, Spinner } from '@/components/work/ui';

const ZONES = ['Asia/Ho_Chi_Minh', 'Asia/Bangkok', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'UTC'];

export default function SettingsDialog({ open, onClose, pid, settings }: { open: boolean; onClose: () => void; pid: number; settings: ContribSettings }) {
  const qc = useQueryClient();
  const [s, setS] = useState(settings);
  useEffect(() => { if (open) setS(settings); }, [open, settings]);
  const git = useQuery({ queryKey: contribKeys.git(pid), queryFn: () => workContribApi.gitAuthors(pid), enabled: open });
  const save = useMutation({
    mutationFn: () => workContribApi.saveSettings(pid, s),
    onSuccess: () => { toast.success('Contribution settings saved'); qc.invalidateQueries({ queryKey: contribKeys.all(pid) }); onClose(); },
    onError: (e) => toast.error(workError(e)),
  });
  const map = useMutation({
    mutationFn: (v: { identity: string; userId: number | null }) => workContribApi.setGitAuthor(pid, v.identity, v.userId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: contribKeys.all(pid) }); },
    onError: (e) => toast.error(workError(e)),
  });
  return (
    <Dialog open={open} onClose={onClose} title="Contribution settings" width={600} footer={<>
      <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
      <button type="button" className="w-btn w-btn-primary" disabled={save.isPending} onClick={() => save.mutate()}>Save</button>
    </>}>
      <div className="space-y-4 text-[13px]">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-0.5" checked={s.teamVisible} onChange={(e) => setS({ ...s, teamVisible: e.target.checked })} />
          <span><span className="font-medium">Team can see details</span><span className="block text-[12px] text-[var(--w-text-2)]">Off: members see only their own numbers and team totals. Admins and teachers always see everyone. Clients and AI agents never do.</span></span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="text-[12px] font-medium">Time zone for days and deadlines</span>
            <select className="w-input mt-1" value={s.timezone} onChange={(e) => setS({ ...s, timezone: e.target.value })}>
              {[...new Set([s.timezone, ...ZONES])].map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </label>
          <label className="block"><span className="text-[12px] font-medium">Flag after how many quiet days</span>
            <input type="number" min={2} max={30} className="w-input mt-1 w-[100px]" value={s.silentDays} onChange={(e) => setS({ ...s, silentDays: Math.max(2, Math.min(30, Number(e.target.value) || 5)) })} />
          </label>
        </div>
        <div>
          <div className="text-[12px] font-medium">Git authors</div>
          <p className="text-[12px] text-[var(--w-text-2)]">Commits are matched by GitHub/GitLab login, email or name. Map the ones that did not match (e.g. a laptop name) to a member.</p>
          {git.isLoading ? <div className="py-4"><Spinner /></div> : !git.data?.authors.length ? (
            <p className="mt-1 text-[12px] text-[var(--w-text-3)]">No commits received yet. Connect GitHub or GitLab in project settings.</p>
          ) : (
            <table className="mt-1.5 w-full text-[12.5px]">
              <thead><tr className="text-left text-[11.5px] text-[var(--w-text-3)]"><th scope="col" className="py-1 font-medium">Author</th><th scope="col" className="py-1 text-right font-medium">Items</th><th scope="col" className="py-1 pl-3 font-medium">Member</th></tr></thead>
              <tbody>
                {git.data.authors.map((a) => (
                  <tr key={a.identity} className="border-t border-[var(--w-border)]">
                    <td className="py-1.5"><div className="font-medium">{a.login ?? a.name ?? a.email}</div>{(a.email || (a.login && a.name && a.name !== a.login)) && <div className="text-[11px] text-[var(--w-text-3)]">{[a.login && a.name !== a.login ? a.name : null, a.email].filter(Boolean).join(' · ')}</div>}</td>
                    <td className="py-1.5 text-right tabular-nums">{a.count}</td>
                    <td className="py-1.5 pl-3">
                      <select aria-label={`Member for ${a.login ?? a.name ?? a.email}`} className="w-input h-[28px] py-0 text-[12px]" value={a.userId ?? ''} disabled={map.isPending}
                        onChange={(e) => map.mutate({ identity: a.login ?? a.email ?? a.name ?? a.identity, userId: e.target.value ? Number(e.target.value) : null })}>
                        <option value="">Not matched</option>
                        {git.data!.people.map((p) => <option key={p.id} value={p.id}>{userName(p)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Dialog>
  );
}
