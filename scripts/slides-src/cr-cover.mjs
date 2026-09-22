/** Content Creator · ảnh bìa khoá (1 slide, dùng làm thumbnailUrl). Deck key 'cr-cover'. */
import { S, timeline, personShot } from './_cr-chung.mjs';

export const deck = { key: 'cr-cover', code: 'CR', title: 'Content Creator', sub: 'Content Creator' };

const strip = timeline({ len: 40, w: 1180, play: 23, tracks: [
  { id: 'V2', clips: [{ s: 6, e: 13, t: 'B-roll', c: 'vio' }, { s: 27, e: 33, t: 'Chữ', c: 'pnk' }] },
  { id: 'V1', clips: [{ s: 0, e: 9, t: 'Hook', c: 'red' }, { s: 9, e: 24, t: 'A-roll', c: 'blu' }, { s: 24, e: 40, t: 'CTA', c: 'tea' }] },
  { id: 'A1', a: true, clips: [{ s: 0, e: 40, t: 'Giọng nói', c: 'grn' }] },
] });

export const slides = S([
  {
    kind: 'cover',
    t: 'Content Creator',
    sub: 'Quay · Dựng · Đăng video — từ số 0 tới làm kênh',
    body: `
<div style="position:absolute;left:0;right:0;top:40px;display:flex;justify-content:center;gap:14px">
  <span class="c-tag red">● REC</span><span class="c-tag amb">Pocket 3 · iPhone</span><span class="c-tag blu">CapCut · DaVinci Resolve</span><span class="c-tag vio">Tiếng Việt · English</span>
</div>
<div style="position:absolute;left:60px;top:112px;width:190px;height:338px;border-radius:24px;overflow:hidden;border:6px solid #1e2533;box-shadow:0 0 0 2px #3a4558, 0 20px 50px #0008;background:linear-gradient(180deg,#34405a,#1d2433);transform:rotate(-6deg)">${personShot({ w: 190, h: 338, size: "MCU", at: 0.5, bg: false })}</div>
<div style="position:absolute;right:46px;top:190px;width:300px;height:169px;border-radius:14px;overflow:hidden;border:3px solid #ffc233;transform:rotate(5deg);box-shadow:0 20px 50px #0008">${personShot({ w: 300, h: 169, size: 'MS', at: 0.4 })}</div>
<div style="position:absolute;left:50px;right:50px;bottom:40px;opacity:.95">${strip}</div>`,
  },
]);
