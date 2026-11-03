import type { ApiResult } from './api.ts';
type Lab = { code: string };
export function labName(r: ApiResult<Lab>): string {
  return r.ok ? r.data.code : r.error.message;
}
console.log(labName({ ok: true, data: { code: 'BE-201' } }));
