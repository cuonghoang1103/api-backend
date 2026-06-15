import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Returns a friendly relative time string ("5 phút trước", "2
 * hours ago", …) but never throws. If the input is missing,
 * unparseable, or otherwise invalid, we fall back to a sane
 * placeholder instead of crashing the surrounding card.
 *
 * `formatDistanceToNow(new Date(undefined))` throws
 * `RangeError: Invalid time value` which produced the
 * production crash "Invalid time value" in the React error
 * boundary. The PostCard, comments and notifications all use
 * this helper now.
 */
export function formatRelative(
  value: string | number | Date | null | undefined,
  options: { addSuffix?: boolean } = {},
): string {
  if (value == null || value === '') return '';
  const d = new Date(value);
  // Invalid Date → NaN getTime()
  if (Number.isNaN(d.getTime())) return '';
  try {
    return formatDistanceToNow(d, {
      addSuffix: options.addSuffix ?? true,
      locale: vi,
    });
  } catch {
    return '';
  }
}

/**
 * Absolute timestamp formatter ("15/06/2026 14:32"). Also
 * defensive against invalid input.
 */
export function formatAbsolute(
  value: string | number | Date | null | undefined,
  pattern: string = 'dd/MM/yyyy HH:mm',
): string {
  if (value == null || value === '') return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  try {
    return format(d, pattern);
  } catch {
    return '';
  }
}
