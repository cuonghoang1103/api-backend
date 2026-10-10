'use client';

/**
 * CTW đợt 8c (R28) — PHỎNG VẤN STAKEHOLDER DO AI ĐÓNG VAI trong một phiên elicitation.
 * Đề SWR302 cho phép "AI-assisted inquiry" nếu giữ transcript: AI trả lời trong vai một stakeholder ĐÃ CÓ trong sổ (vai,
 * giá trị, mối quan tâm, ràng buộc), transcript lưu trong phiên, phiên tự gắn nhãn AI-simulated, và nút "Extract
 * requirements" phía dưới đọc transcript này như mọi nguồn khác (mỗi yêu cầu phải trích dòng có thật).
 * Backend: POST|DELETE /projects/:pid/swr/elicitation/:elc/ai-stakeholder.
 */

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bot, Send, Trash2, User } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { swrPackApi, type AiTurn } from '@/lib/work-c8c-api';
import { Spinner } from '../ui';
import { Select } from '../settings/shared';
import { Section } from '../swr6b/shared';
import { useWT } from '../i18n';

export default function AiStakeholderPanel({ pid, elc, stakeholders, initial, persona, readOnly, onChanged }: {
  pid: number; elc: string; stakeholders: Array<{ key: string; name: string; role: string | null }>;
  initial: AiTurn[]; persona: { key: string; name: string; role: string | null } | null; readOnly: boolean; onChanged: () => void;
}) {
  const { t, locale } = useWT();
  const [turns, setTurns] = useState<AiTurn[]>(initial);
  const [who, setWho] = useState(persona?.key ?? stakeholders[0]?.key ?? '');
  const [q, setQ] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setTurns(initial); }, [initial]);
  useEffect(() => { if (persona?.key) setWho(persona.key); }, [persona?.key]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [turns.length]);
  const ask = useMutation({
    mutationFn: () => swrPackApi.askStakeholder(pid, elc, { stakeholder: turns.length ? undefined : who || null, question: q.trim(), language: locale === 'vi' ? 'vi' : 'en' }),
    onSuccess: (r) => { setTurns(r.turns); setQ(''); onChanged(); },
    onError: (e) => toast.error(workError(e, t('c8c.aiFailed'))),
  });
  const clear = useMutation({
    mutationFn: () => swrPackApi.clearStakeholder(pid, elc),
    onSuccess: () => { setTurns([]); onChanged(); },
    onError: (e) => toast.error(workError(e)),
  });
  const current = persona ?? stakeholders.find((s) => s.key === who) ?? null;
  return (
    <Section id="elc-ai-stakeholder" title={t('c8c.aiTitle')} actions={!readOnly && turns.length ? <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={clear.isPending} onClick={() => clear.mutate()}><Trash2 size={12} /> {t('c8c.aiClear')}</button> : undefined}>
      <p className="text-[12.5px] text-[var(--w-text-2)]">{t('c8c.aiIntro')}</p>
      {!stakeholders.length ? <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c8c.aiNoStakeholders')}</p> : (
        <>
          {!turns.length && !readOnly && (
            <label className="flex flex-col gap-1 text-[12.5px] sm:max-w-[360px]">
              <span className="text-[var(--w-text-2)]">{t('c8c.aiPlays')}</span>
              <Select aria-label={t('c8c.aiPlays')} value={who} onChange={(e) => setWho(e.target.value)}>
                {stakeholders.map((s) => <option key={s.key} value={s.key}>{s.key} · {s.name}{s.role ? ` (${s.role})` : ''}</option>)}
              </Select>
            </label>
          )}
          {!!turns.length && current && <p className="text-[12px] text-[var(--w-text-3)]">{t('c8c.aiPlaying', { who: `${current.key} ${current.name}${current.role ? ` (${current.role})` : ''}` })}</p>}
          <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-2.5" aria-live="polite" data-testid="ai-stakeholder-transcript">
            {!turns.length && <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c8c.aiEmpty')}</p>}
            {turns.map((x, i) => (
              <div key={i} className={`flex gap-2 ${x.role === 'analyst' ? 'flex-row-reverse text-right' : ''}`}>
                <span className="mt-0.5 shrink-0 text-[var(--w-text-3)]">{x.role === 'analyst' ? <User size={14} /> : <Bot size={14} />}</span>
                <span className={`max-w-[85%] rounded-[8px] px-2.5 py-1.5 text-[13px] [overflow-wrap:anywhere] ${x.role === 'analyst' ? 'bg-[var(--w-active)]' : 'border border-[var(--w-border)] bg-[var(--w-panel)]'}`}>
                  <span className="mb-0.5 block text-[11px] text-[var(--w-text-2)]">{x.role === 'analyst' ? t('c8c.aiYou') : t('c8c.aiSimLabel', { who: current?.name ?? '' })}</span>
                  {x.text}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          {!readOnly && (
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask.mutate(); }}>
              <input className="w-input min-w-0 flex-1" value={q} maxLength={2000} onChange={(e) => setQ(e.target.value)} placeholder={t('c8c.aiAskPh')} aria-label={t('c8c.aiAskPh')} data-testid="ai-stakeholder-input" />
              <button type="submit" className="w-btn w-btn-primary" disabled={!q.trim() || ask.isPending}>{ask.isPending ? <Spinner size={12} /> : <Send size={13} />} {t('c8c.aiAsk')}</button>
            </form>
          )}
          <p className="text-[11.5px] text-[var(--w-text-3)]">{t('c8c.aiNote')}</p>
        </>
      )}
    </Section>
  );
}
