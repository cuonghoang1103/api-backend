/**
 * Public download links for the apps this site ships — ONE place, so /about,
 * /about/studio and the CT Work download page never drift apart.
 *
 * Every entry was checked by hand on 03/11/2026 (`curl -sI`, `gh release list`,
 * the VS Code Marketplace query API). Do not add a store link here until the
 * listing is public — a badge that 404s is worse than no badge.
 *
 * ⚠️ Only CT Work is on the App Store. The main CuongThai iOS app is in
 * TestFlight testing and must NOT get an App Store badge.
 */
export const CTWORK_APP_STORE = 'https://apps.apple.com/app/id6824877696';
export const CTWORK_DESKTOP_RELEASES = 'https://github.com/cuonghoang1103/ctwork-desktop/releases';
export const CUONGTHAI_DESKTOP_RELEASES = 'https://github.com/cuonghoang1103/cuongthai-desktop/releases';
export const CUONGMINI_VSCODE_MARKETPLACE = 'https://marketplace.visualstudio.com/items?itemName=cuongthai.cuongthai-ai-code';
export const CUONGMINI_OPEN_VSX = 'https://open-vsx.org/extension/cuongthai/cuongthai-ai-code';
