import { describe, expect, it } from 'vitest';
import { giayMacDinhCho, TRAN_GIAY_LENH_LAU, TRAN_GIAY_MAC_DINH } from './lenh';

describe('giayMacDinhCho — lệnh lâu tự được chờ lâu', () => {
  it.each([
    'cd frontend && npm run build',
    'npx tsc --noEmit',
    'pnpm test',
    'docker compose up -d --build',
    './gradlew assembleDebug',
    'xcodebuild -scheme App test',
    'npx next build',
  ])('%s ⇒ 15 phút', (l) => expect(giayMacDinhCho(l)).toBe(TRAN_GIAY_LENH_LAU));
  it.each(['ls -la', 'git status', 'cat package.json', 'npm install lodash'])('%s ⇒ 2 phút', (l) =>
    expect(giayMacDinhCho(l)).toBe(TRAN_GIAY_MAC_DINH));
});
