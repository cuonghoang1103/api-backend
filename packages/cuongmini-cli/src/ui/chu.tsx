/**
 * `<Text>` của Ink + đổi ký hiệu sang ASCII khi console không vẽ được Unicode
 * (xem `kyTu.ts`). Mọi chữ của giao diện đi qua đây — một chỗ, không sót.
 */
import { Text as InkText, type TextProps } from 'ink';
import { doiKyTu } from '../kyTu';

export function Text(p: TextProps) {
  const c = p.children;
  return <InkText {...p}>{typeof c === 'string' ? doiKyTu(c) : c}</InkText>;
}
