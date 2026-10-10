'use client';

/**
 * CT Work đợt 8a — nút "Teams" / "Google Meet" cạnh nút tạo phòng Jitsi trong chi tiết cuộc họp. Chỉ hiện khi NGƯỜI XEM
 * đã kết nối nhà cung cấp tương ứng (kết nối của chính họ tạo phòng); link điền vào chỗ "Join" sẵn có.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workError } from '@/lib/work-api';
import { c8aApi, c8aKeys, type CloudProvider } from '@/lib/work-c8a-api';
import { Spinner } from '../ui';
import { useWT } from '../i18n';
import { ProviderLogo } from './ProviderLogo';

export function CloudMeetingButtons({ pid, num, onDone }: { pid: number; num: number; onDone: () => void }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: c8aKeys.connections, queryFn: c8aApi.connections, staleTime: 60_000, retry: false });
  const make = useMutation({
    mutationFn: (p: CloudProvider) => c8aApi.onlineMeeting(pid, num, p),
    onSuccess: () => { toast.success(t('c8a.roomCreated')); onDone(); },
    onError: (e) => toast.error(workError(e)),
  });
  const ready = (q.data?.providers ?? []).filter((p) => (p.id === 'microsoft' || p.id === 'google') && p.configured && p.connection?.status === 'ACTIVE');
  if (!ready.length) return null;
  return (
    <>
      {ready.map((p) => (
        <button key={p.id} type="button" className="w-btn" disabled={make.isPending} onClick={() => make.mutate(p.id as CloudProvider)} data-testid={`meeting-online-${p.id}`}>
          {make.isPending && make.variables === p.id ? <Spinner size={12} /> : <ProviderLogo provider={p.id} size={14} />}
          {p.id === 'microsoft' ? t('c8a.createTeams') : t('c8a.createMeet')}
        </button>
      ))}
    </>
  );
}
