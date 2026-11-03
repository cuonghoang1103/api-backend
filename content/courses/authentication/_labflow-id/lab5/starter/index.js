// lab5/starter/index.js — Lab 5 starter. Write LabFlow ID's refresh-token layer.
//
// refreshLayer(config) returns { issue, rotate, revokeFamily, revokeAll, revokeDevice, listDevices }.
//   config = { store, now, graceMs, familyTtlMs }.
//   store = { insert(row), getByDigest(d), getById(id), markUsed(id,{usedAt,replacedBy}),
//             revokeFamily(familyId,t), revokeAllForUser(userId,t), revokeFamilyForUser(userId,familyId,t),
//             listFamilies(userId,t) }.
// A token is a secret from newToken('lfid_rt'); store ONLY its tokenDigest (never the token). Rotate on every use;
// reusing an already-rotated token (outside the grace window) means theft ⇒ revoke the whole family.
// You may import ../../src/crypto (newToken, tokenDigest). Do NOT import ../../src/refresh/layer.js — that is the answer.
import { newToken, tokenDigest } from '../../src/crypto/index.js';

export function refreshLayer({ store, now = () => Date.now(), familyTtlMs = 30 * 24 * 3600e3, graceMs = 10e3 }) {
  async function issue(userId, opts = {}) {
    // TODO: make a token, store its digest in a row (new family unless opts.familyId), return { token, row }.
    throw new Error('not implemented');
  }
  async function rotate(presented, opts = {}) {
    // TODO: look up by digest; reject INVALID/REVOKED/EXPIRED; if already used, the grace window (race) or REUSE_DETECTED
    //       (revoke the family); otherwise mark used and issue a new token in the same family.
    throw new Error('not implemented');
  }
  return {
    issue, rotate,
    revokeFamily: (familyId) => { throw new Error('not implemented'); },
    revokeAll: (userId) => { throw new Error('not implemented'); },
    revokeDevice: (userId, familyId) => { throw new Error('not implemented'); },
    listDevices: (userId) => { throw new Error('not implemented'); },
  };
}
