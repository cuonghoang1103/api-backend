// src/oidc/store.js — registered OIDC clients (Chapter 8). redirect_uris is an exact allow-list, never a prefix match.
import { q } from '../db.js';
export const clientStore = {
  async get(clientId) {
    const r = (await q('SELECT * FROM oauth_clients WHERE client_id = $1', [clientId])).rows[0];
    return r ? { clientId: r.client_id, name: r.name, redirectUris: JSON.parse(r.redirect_uris) } : null;
  },
};
