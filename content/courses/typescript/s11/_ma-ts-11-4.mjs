/**
 * _ma (bài 11.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "configConfig": `// A typed, read-only config built from the environment once, at startup.
export type Config = {
  readonly port: number;
  readonly dbUrl: string;
};
export function loadConfig(env: Record<string, string | undefined>): Config {
  return {
    port: Number(env.PORT ?? '3000'),
    dbUrl: env.DATABASE_URL ?? 'postgres://localhost/labflow',
  };
}
const cfg = loadConfig({ PORT: '5432' });
console.log(cfg.port, cfg.dbUrl.length > 0);`,
  "frozenConfig": `export type Config = { readonly port: number; readonly dbUrl: string };
const cfg: Config = { port: 5432, dbUrl: 'postgres://x' };
// Config is read-only — reassigning a field is refused.
cfg.port = 3000;
export { cfg };`,
  "prStart": `type Booking = { id: string; seats: number };
const store: Booking[] = [{ id: 'bk_1', seats: 40 }];
// The lookup may miss, but the return type promises a Booking.
export function bookingById(id: string): Booking {
  return store.find((b) => b.id === id);
}`,
  "prSol": `type Booking = { id: string; seats: number };
const store: Booking[] = [{ id: 'bk_1', seats: 40 }];
export function bookingById(id: string): Booking | undefined {
  return store.find((b) => b.id === id);
}
console.log(bookingById('bk_1')?.seats ?? 0);`,
};
export const OUT = {
  '11-config': `$ node demo11/ts-11-4/config/config.ts
5432 true`,
  '12-frozen': `$ node_modules/.bin/tsc -p demo11/ts-11-4/frozen
demo11/ts-11-4/frozen/config.ts(4,5): error TS2540: Cannot assign to 'port' because it is a read-only property.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo11/ts-11-4/practice/start
demo11/ts-11-4/practice/start/service.ts(5,3): error TS2322: Type 'Booking | undefined' is not assignable to type 'Booking'.
  Type 'undefined' is not assignable to type 'Booking'.`,
  '14-pr-sol': `$ node demo11/ts-11-4/practice/solution/service.ts
40`,
};
