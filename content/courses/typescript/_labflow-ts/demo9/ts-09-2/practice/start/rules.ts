export function label(status) {
  const map: Record<string, string> = { PENDING: 'Chờ' };
  const text: string | undefined = map[status];
  return text.toUpperCase();
}
