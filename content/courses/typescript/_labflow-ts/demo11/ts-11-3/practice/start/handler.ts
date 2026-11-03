import type { ApiResult } from './api.ts';
type Lab = { code: string };
export function labName(r: ApiResult<Lab>): string {
  // Reading data.code without narrowing on ok.
  return r.data.code;
}
