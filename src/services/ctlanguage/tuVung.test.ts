import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { kiemBoTu, type BoTuBoSung } from './tuVungThuan.js';
import { chuDeCua } from './chuDeTu.js';

const GOC = path.join(process.cwd(), 'content', 'ctlanguage', 'tu-vung');

function docHet(): { tep: string; b: BoTuBoSung }[] {
  const ra: { tep: string; b: BoTuBoSung }[] = [];
  for (const nn of ['en', 'ja', 'zh']) {
    let ds: string[] = [];
    try { ds = fs.readdirSync(path.join(GOC, nn)).filter((f) => f.endsWith('.json')); } catch { /* chưa có */ }
    for (const f of ds) ra.push({ tep: `${nn}/${f}`, b: JSON.parse(fs.readFileSync(path.join(GOC, nn, f), 'utf8')) as BoTuBoSung });
  }
  return ra;
}

test('kiemBoTu: anh phải là slug, và có trong tập slug nếu được đưa vào', () => {
  const tu = Array.from({ length: 20 }, (_, i) => ({
    chu: `word${i}`, doc: '/wɜːd/', loai: 'n' as const, nghia: 'từ', cap: 'B2', viDu: `word${i} here`, viDuNghia: 'ví dụ',
  }));
  const b: BoTuBoSung = { ma: 'thu', nn: 'en', ten: 't', moTa: 'm', nhom: 'ielts', cap: 'B2', tu };
  assert.deepEqual(kiemBoTu({ ...b, tu: [{ ...tu[0], anh: 'robot' }, ...tu.slice(1)] }, new Set(['robot'])), []);
  assert.match(kiemBoTu({ ...b, tu: [{ ...tu[0], anh: 'Robot X' }, ...tu.slice(1)] }).join(), /anh sai/);
  assert.match(kiemBoTu({ ...b, tu: [{ ...tu[0], anh: 'cat' }, ...tu.slice(1)] }, new Set(['robot'])).join(), /chưa có trên R2/);
});

test('bộ từ bổ sung: mọi tệp đúng khuôn, tên tệp = ma, nn = thư mục, ảnh có trong danh mục Fluent', () => {
  const cat = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'hinh', 'fluent-catalog.json'), 'utf8')).hinh));
  for (const { tep, b } of docHet()) {
    const loi = kiemBoTu(b, cat);
    if (`${b.nn}/${b.ma}.json` !== tep) loi.push('tên tệp/nn khác ma');
    assert.deepEqual(loi, [], tep);
  }
});

test('bộ từ bổ sung: KHÔNG trùng kho chủ đề, không trùng giữa các bộ', () => {
  for (const nn of ['en', 'ja', 'zh'] as const) {
    const k = (s: string) => (nn === 'en' ? s.toLowerCase() : s);
    const coSan = new Set(chuDeCua(nn).flatMap(({ tep }) => tep.tu.map((t) => k(t.chu))));
    const thay = new Map<string, string>();
    for (const { tep, b } of docHet().filter((x) => x.b.nn === nn)) {
      for (const t of b.tu) {
        const w = k(t.chu);
        assert.ok(!coSan.has(w), `${tep}: "${t.chu}" đã có trong kho chủ đề`);
        assert.ok(!thay.has(w), `${tep}: "${t.chu}" trùng với ${thay.get(w)}`);
        thay.set(w, tep);
      }
    }
  }
});
