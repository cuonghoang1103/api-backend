'use client';

// useProjectAutosave — debounced autosave hook used by
// the project editor.
//
// Why a custom hook instead of putting the debounce in
// the editor itself:
// • The editor has 8 tabs but only 3 (Overview /
// Storyboard / Teleprompter) currently have local form
// state. The hook abstracts "fire a PUT 1.2s after the
// last local change" so each tab can just call
// `scheduleSave()` from a useEffect on its form data.
// • Centralises the "flush on unmount" + "flush on tab
// close" logic that otherwise needs to be re-implemented
// per tab.
//
// The hook owns:
// • `saveStatus` — 'idle' | 'dirty' | 'saving' | 'saved'
// | 'error' for the topbar indicator.
// • `lastSavedAt` — for the "Saved 14:32" tooltip.
// • `scheduleSave(payloadFn)` — the debounced trigger.
// The caller passes a function that returns the current
// payload so we always send the freshest values, not a
// stale closure capture.
// • `flushNow()` — cancel the debounce and save
// immediately. Called on tab change + on unmount + on
// page unload.

import { useCallback, useEffect, useRef, useState } from 'react';
import { contentApi } from '@/lib/api';
import type { ContentProject, ContentProjectUpdate } from '@/types';
import type { SaveStatus } from './SaveIndicator';

interface UseProjectAutosaveOptions {
 projectId: number;
 /** Debounce window in ms. Default 1200. */
 debounceMs?: number;
 /** Called after every successful save with the fresh
 project from the server. Lets the editor sync its local
 state to the server's normalised version. */
 onSaved?: (project: ContentProject) => void;
}

export function useProjectAutosave({
 projectId,
 debounceMs = 1200,
 onSaved,
}: UseProjectAutosaveOptions) {
 const [status, setStatus] = useState<SaveStatus>('idle');
 const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

 const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 const isFirstRender = useRef(true);
 const inFlight = useRef<AbortController | null>(null);
 const latestPayload = useRef<(() => ContentProjectUpdate) | null>(null);

 const performSave = useCallback(
 async (payload: ContentProjectUpdate) => {
 // Cancel any in-flight save so we don't race two PUTs.
 if (inFlight.current) inFlight.current.abort();
 const ctrl = new AbortController();
 inFlight.current = ctrl;
 setStatus('saving');
 try {
 const res = await contentApi.update(projectId, payload);
 if (ctrl.signal.aborted) return;
 setLastSavedAt(new Date());
 setStatus('saved');
 onSaved?.(res.data.data);
 // Auto-clear the "saved" pill after 2.5s so it returns
 // to a clean idle state.
 setTimeout(() => {
 setStatus((s) => (s === 'saved' ? 'idle' : s));
 }, 2500);
 } catch (err: unknown) {
 if (ctrl.signal.aborted) return;
 setStatus('error');
 console.error('Studio autosave failed', err);
 }
 },
 [projectId, onSaved],
 );

 // scheduleSave — call from a useEffect on your form data.
 // The function `payloadFn` is stored in a ref so the
 // debounce can call the freshest one when it fires (this
 // is the only way to avoid stale-closure problems with
 // debounce + React state).
 const scheduleSave = useCallback(
 (payloadFn: () => ContentProjectUpdate) => {
 latestPayload.current = payloadFn;
 setStatus('dirty');
 if (debounceRef.current) clearTimeout(debounceRef.current);
 debounceRef.current = setTimeout(() => {
 if (latestPayload.current) {
 void performSave(latestPayload.current());
 }
 }, debounceMs);
 },
 [performSave, debounceMs],
 );

 // Flush — cancel debounce and save right now. Used on
 // tab change + unmount.
 const flushNow = useCallback(async () => {
 if (debounceRef.current) {
 clearTimeout(debounceRef.current);
 debounceRef.current = null;
 }
 if (latestPayload.current) {
 await performSave(latestPayload.current());
 }
 }, [performSave],
 );

 // Skip the very first render — initial state load
 // shouldn't trigger a save.
 useEffect(() => {
 isFirstRender.current = false;
 }, []);

 // Cancel any pending debounce on unmount (and flush
 // if there is one — the editor might be navigating
 // away because they just clicked "Back to dashboard").
 useEffect(() => {
 return () => {
 if (debounceRef.current) {
 clearTimeout(debounceRef.current);
 debounceRef.current = null;
 }
 if (inFlight.current) inFlight.current.abort();
 };
 }, []);

 // Save on tab close / nav away. best-effort.
 useEffect(() => {
 const handler = () => {
 if (latestPayload.current) {
 // fire-and-forget; the page is unloading
 void performSave(latestPayload.current());
 }
 };
 window.addEventListener('beforeunload', handler);
 return () => window.removeEventListener('beforeunload', handler);
 }, [performSave]);

 return { status, lastSavedAt, scheduleSave, flushNow };
}
