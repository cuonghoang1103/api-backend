export function dbUrl(): string {
  return process.env.DATABASE_URL;  // now string, thanks to the augmentation
}
console.log(typeof dbUrl);
