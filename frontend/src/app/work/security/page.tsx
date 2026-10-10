'use client';

/**
 * /work/security — xác thực 2 lớp (TOTP) cho THÀNH VIÊN CT Work (đợt 7c, C17).
 *
 * Dùng đúng API 2FA sẵn có của site (`/auth/mfa/*` — cùng secret, mã khôi phục, step-up với trang admin
 * /admin/bao-mat-tai-khoan). Không gian bật "Require two-factor" ⇒ thành viên chưa bật bị đưa tới đây (interceptor ở
 * lib/api.ts, mã WORK_2FA_SETUP_REQUIRED); bật xong ⇒ quay lại `?next=`.
 *
 * QR vẽ TẠI CHỖ (qrcode.react) — secret không rời trình duyệt tới dịch vụ QR nào. Mã khôi phục hiện MỘT lần.
 */

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Copy, Download, KeyRound, ShieldCheck, ShieldOff } from 'lucide-react';
import { loiMfaTuApi, mfaApi, yeuCauXacMinhMfa, type MfaStatus } from '@/lib/api';
import { c7cKeys, securityApi, type TwoFactorState } from '@/lib/work-c7c-api';
import { PageLoading, Spinner } from '@/components/work/ui';
import { PageHeader, Section } from '@/components/work/settings/shared';
import { Badge, type Tone } from '@/components/work/quality/qui';
import { useWT, type WKey } from '@/components/work/i18n';

const STATE_TONE: Record<TwoFactorState, Tone> = { OK: 'green', GRACE: 'yellow', SETUP_REQUIRED: 'red', VERIFY_REQUIRED: 'orange' };

/** Chỉ cho quay lại đường nội bộ /work… (chống open-redirect). */
function safeNext(raw: string | null): string | null {
  if (!raw || !raw.startsWith('/work') || raw.startsWith('//')) return null;
  return raw;
}

function SecurityView() {
  const { t, fmtDate, fmtDateTime } = useWT();
  const router = useRouter();
  const search = useSearchParams();
  const next = safeNext(search?.get('next') ?? null);
  const qc = useQueryClient();
  const mine = useQuery({ queryKey: c7cKeys.mySecurity, queryFn: securityApi.mine });
  const [st, setSt] = useState<MfaStatus | null>(null);
  const [setup, setSetup] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [code, setCode] = useState('');
  const [codes, setCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [mode, setMode] = useState<'off' | 'regen' | null>(null);
  const [code2, setCode2] = useState('');

  const loadStatus = useCallback(async () => {
    try { setSt(await mfaApi.status()); } catch (e) { setErr(loiMfaTuApi(e, 'Could not load two-factor status')); }
  }, []);
  useEffect(() => { void loadStatus(); }, [loadStatus]);
  const refresh = async () => { await loadStatus(); await qc.invalidateQueries({ queryKey: ['work'] }); };

  const start = async () => {
    setBusy(true); setErr('');
    try { setSetup(await mfaApi.setup()); setCode(''); } catch (e) { setErr(loiMfaTuApi(e, t('c7c.secSetupFailed'))); } finally { setBusy(false); }
  };
  const enable = async () => {
    setBusy(true); setErr('');
    try {
      const r = await mfaApi.enable(code.trim());
      setCodes(r.recoveryCodes); setSetup(null); setCode('');
      toast.success(t('c7c.secEnabledToast'));
      await refresh();
    } catch (e) { setErr(loiMfaTuApi(e, t('c7c.secWrongCode'))); } finally { setBusy(false); }
  };
  const verify = async () => {
    const ok = await yeuCauXacMinhMfa();
    if (ok) { toast.success(t('c7c.secVerifiedToast')); await refresh(); }
  };
  const act = async () => {
    setBusy(true); setErr('');
    try {
      if (mode === 'off') { await mfaApi.disable({ code: code2.trim() }); toast.success(t('c7c.secDisabledToast')); }
      else { const r = await mfaApi.regenerateRecoveryCodes(code2.trim()); setCodes(r.recoveryCodes); }
      setMode(null); setCode2('');
      await refresh();
    } catch (e) { setErr(loiMfaTuApi(e, t('c7c.secWrongCode'))); } finally { setBusy(false); }
  };
  const copyCodes = async () => { if (codes) { await navigator.clipboard.writeText(codes.join('\n')).catch(() => undefined); toast.success(t('common.copied')); } };
  const downloadCodes = () => {
    if (!codes) return;
    const href = URL.createObjectURL(new Blob([`CT Work recovery codes\n\n${codes.join('\n')}\n`], { type: 'text/plain' }));
    const a = document.createElement('a'); a.href = href; a.download = 'ctwork-recovery-codes.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(href), 3000);
  };

  if (!st && !err) return <PageLoading />;
  const enabled = !!st?.enabled;
  const verified = !!st?.stepUp.valid;
  const required = mine.data?.workspaces ?? [];

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={t('c7c.secTitle')} sub={t('c7c.secSub')} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-5">
          {err && (
            <div role="alert" className="flex gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--w-red)_45%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)] px-3 py-2 text-[13px]">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--w-red-text)]" /> <span>{err}</span>
            </div>
          )}

          <Section title={t('c7c.secStatusTitle')} description={t('c7c.secStatusDesc')}>
            <div className="flex flex-wrap items-center gap-3" data-testid="c7c-2fa-status">
              {enabled ? <ShieldCheck size={20} className="text-[var(--w-green-text)]" /> : <ShieldOff size={20} className="text-[var(--w-text-3)]" />}
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold">{enabled ? t('c7c.secOn') : t('c7c.secOff')}</div>
                <div className="text-[12.5px] text-[var(--w-text-2)]">
                  {enabled
                    ? `${t('c7c.secOnSince', { d: fmtDate(st!.enabledAt) })} · ${t('c7c.secCodesLeft', { count: st!.recoveryCodesRemaining })}`
                    : t('c7c.secOffBody')}
                </div>
                {enabled && (
                  <div className="mt-1 text-[12.5px]">
                    {verified
                      ? <span className="text-[var(--w-green-text)]">{t('c7c.secVerifiedUntil', { d: fmtDateTime(st!.stepUp.expiresAt) })}</span>
                      : <span className="text-[var(--w-orange-text)]">{t('c7c.secNotVerified')}</span>}
                  </div>
                )}
              </div>
              {!enabled && !setup && <button type="button" className="w-btn w-btn-primary" onClick={start} disabled={busy}>{busy && <Spinner size={12} />}<KeyRound size={14} /> {t('c7c.secSetUp')}</button>}
              {enabled && !verified && <button type="button" className="w-btn w-btn-primary" onClick={verify}>{t('c7c.secVerifyNow')}</button>}
            </div>

            {setup && (
              <div className="mt-4 grid gap-4 rounded-[8px] border border-[var(--w-border)] p-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div className="rounded-[8px] bg-white p-2.5" aria-label={t('c7c.secQrAria')}>
                  <QRCodeSVG value={setup.otpauthUri} size={156} level="M" />
                </div>
                <div className="min-w-0 text-[13px]">
                  <ol className="list-decimal space-y-1.5 pl-5 text-[var(--w-text-2)]">
                    <li>{t('c7c.secStep1')}</li>
                    <li>{t('c7c.secStep2')} <code className="break-all rounded bg-[var(--w-sunken)] px-1 font-mono text-[12px]">{setup.secret.replace(/(.{4})/g, '$1 ').trim()}</code></li>
                    <li>{t('c7c.secStep3')}</li>
                  </ol>
                  <form className="mt-3 flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (/^\d{6}$/.test(code.trim()) && !busy) void enable(); }}>
                    <label className="sr-only" htmlFor="c7c-code">{t('c7c.secCode')}</label>
                    <input id="c7c-code" className="w-input w-[160px] font-mono tracking-[0.2em]" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} autoFocus />
                    <button type="submit" className="w-btn w-btn-primary" disabled={!/^\d{6}$/.test(code.trim()) || busy}>{busy && <Spinner size={12} />} {t('c7c.secTurnOn')}</button>
                    <button type="button" className="w-btn" onClick={() => setSetup(null)}>{t('common.cancel')}</button>
                  </form>
                </div>
              </div>
            )}

            {codes && (
              <div className="mt-4 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_45%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)] p-4" data-testid="c7c-recovery">
                <div className="mb-2 text-[13px] font-semibold">{t('c7c.secCodesTitle')}</div>
                <p className="mb-3 text-[12.5px] text-[var(--w-text-2)]">{t('c7c.secCodesBody')}</p>
                <div className="mb-3 grid grid-cols-2 gap-1.5 font-mono text-[13px] sm:grid-cols-5">{codes.map((c) => <span key={c} className="rounded bg-[var(--w-panel)] px-2 py-1 text-center">{c}</span>)}</div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="w-btn w-btn-sm" onClick={copyCodes}><Copy size={12} /> {t('common.copy')}</button>
                  <button type="button" className="w-btn w-btn-sm" onClick={downloadCodes}><Download size={12} /> {t('c7c.secDownload')}</button>
                  <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => { setCodes(null); if (next) router.push(next); }}>{next ? t('c7c.secContinue') : t('common.done')}</button>
                </div>
              </div>
            )}

            {enabled && !codes && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--w-border)] pt-3">
                {mode ? (
                  <form className="flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (/^\d{6}$/.test(code2.trim())) void act(); }}>
                    <label className="text-[12.5px] text-[var(--w-text-2)]" htmlFor="c7c-code2">{mode === 'off' ? t('c7c.secOffPrompt') : t('c7c.secRegenPrompt')}</label>
                    <input id="c7c-code2" className="w-input w-[140px] font-mono" inputMode="numeric" maxLength={6} value={code2} onChange={(e) => setCode2(e.target.value.replace(/\D/g, ''))} autoFocus />
                    <button type="submit" className={mode === 'off' ? 'w-btn w-btn-danger' : 'w-btn w-btn-primary'} disabled={busy || !/^\d{6}$/.test(code2.trim())}>{mode === 'off' ? t('c7c.secTurnOff') : t('c7c.secRegen')}</button>
                    <button type="button" className="w-btn" onClick={() => setMode(null)}>{t('common.cancel')}</button>
                  </form>
                ) : (
                  <>
                    <button type="button" className="w-btn w-btn-sm" onClick={() => setMode('regen')}>{t('c7c.secRegen')}</button>
                    <button type="button" className="w-btn w-btn-sm" onClick={() => setMode('off')}>{t('c7c.secTurnOff')}</button>
                    {required.length > 0 && <span className="text-[12px] text-[var(--w-orange-text)]">{t('c7c.secOffWarn')}</span>}
                  </>
                )}
              </div>
            )}
          </Section>

          <Section title={t('c7c.secWsTitle')} description={t('c7c.secWsDesc')}>
            {mine.isLoading ? <Spinner /> : !required.length ? (
              <p className="text-[13px] text-[var(--w-text-3)]">{t('c7c.secWsNone')}</p>
            ) : (
              <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]">
                {required.map((w) => (
                  <li key={w.id} className="flex flex-wrap items-center gap-2 px-3 py-2.5 text-[13px]">
                    <Link href={`/work/${w.slug}`} className="min-w-0 flex-1 truncate font-medium hover:underline">{w.name}</Link>
                    <Badge tone={STATE_TONE[w.state]}>{t(`c7c.state_${w.state}` as WKey)}</Badge>
                    {w.graceUntil && w.state === 'GRACE' && <span className="text-[12px] text-[var(--w-text-3)]">{t('c7c.graceUntil', { d: fmtDate(w.graceUntil) })}</span>}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[12px] leading-relaxed text-[var(--w-text-3)]">{t('c7c.secExemptNote')}</p>
            {next && enabled && verified && <button type="button" className="w-btn w-btn-primary mt-3" onClick={() => router.push(next)}>{t('c7c.secContinue')}</button>}
          </Section>
        </div>
      </div>
    </div>
  );
}

export default function WorkSecurityPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SecurityView />
    </Suspense>
  );
}
