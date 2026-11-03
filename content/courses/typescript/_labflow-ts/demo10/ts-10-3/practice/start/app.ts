// No augmentation for DATABASE_URL, so it is string | undefined.
export function dbUrl(): string {
  return process.env.DATABASE_URL;
}
