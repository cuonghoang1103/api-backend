// A typed, read-only config built from the environment once, at startup.
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
console.log(cfg.port, cfg.dbUrl.length > 0);
