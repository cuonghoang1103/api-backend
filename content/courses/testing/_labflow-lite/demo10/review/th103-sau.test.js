// Practice 10.3 — the same test AFTER review: a fixed clock, the exact boundary, the exact result.
import { describe, it, expect } from 'vitest';
import { offerNext, acceptOffer } from '../../src/rules/waitlist.js';

const at = (hhmm) => new Date('2026-11-16T' + hhmm + ':00+07:00');

describe('acceptOffer', () => {
  const { offer } = offerNext([{ userId: 'an' }], at('10:00'));

  it('accepts the offer one minute before it expires (10:29)', () => {
    expect(acceptOffer(offer, at('10:29'))).toEqual({ ok: true });
  });

  it('refuses it at 10:30 with OFFER_EXPIRED', () => {
    expect(acceptOffer(offer, at('10:30'))).toEqual({ ok: false, code: 'OFFER_EXPIRED' });
  });
});
