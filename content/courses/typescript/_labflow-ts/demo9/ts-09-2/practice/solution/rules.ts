export function label(status: string): string {
  const map: Record<string, string> = { PENDING: 'Chờ' };
  const text: string | undefined = map[status];
  return (text ?? status).toUpperCase();
}
console.log(label('PENDING'), label('DONE'));
