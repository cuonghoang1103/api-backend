export type Config = { readonly port: number; readonly dbUrl: string };
const cfg: Config = { port: 5432, dbUrl: 'postgres://x' };
// Config is read-only — reassigning a field is refused.
cfg.port = 3000;
export { cfg };
