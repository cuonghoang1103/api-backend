import { describe, it, expect } from 'vitest';
import { decideMerge } from './gate.js';

const all = (result) => ({ unit: { result }, integration: { result }, e2e: { result } });
const REQUIRED = ['unit', 'integration', 'e2e'];

describe('decideMerge — the ci-ok gate', () => {
  it('every required job succeeded → may merge', () => {
    expect(decideMerge(all('success'), REQUIRED)).toEqual({ ok: true, problems: [] });
  });

  it.each(['failure', 'cancelled', 'skipped'])('a required job that is %s blocks the merge', (result) => {
    const needs = { ...all('success'), integration: { result } };
    expect(decideMerge(needs, REQUIRED)).toEqual({ ok: false, problems: ['integration: ' + result] });
  });

  it('a required job missing from needs blocks (someone deleted it from the workflow)', () => {
    const { e2e, ...rest } = all('success');
    expect(decideMerge(rest, REQUIRED)).toEqual({ ok: false, problems: ['e2e: not in needs'] });
  });

  it('every problem is listed, not only the first', () => {
    expect(decideMerge({ unit: { result: 'failure' } }, REQUIRED).problems).toEqual(['unit: failure', 'integration: not in needs', 'e2e: not in needs']);
  });

  it('a job that is not required never blocks (report-only, e.g. quarantine)', () => {
    const needs = { ...all('success'), quarantine: { result: 'failure' } };
    expect(decideMerge(needs, REQUIRED).ok).toBe(true);
  });
});
