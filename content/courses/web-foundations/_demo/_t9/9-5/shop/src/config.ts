// Lesson 9.5 — reading configuration at the boundary, checked at runtime too
export interface Config {
  port: number;
  databaseUrl: string;
}
export function loadConfig(env: Record<string, string | undefined>): Config {
  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port)) throw new Error('PORT must be a number');
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  return { port, databaseUrl: env.DATABASE_URL };
}
