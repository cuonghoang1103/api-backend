/**
 * Chủ đề 4 mùa (web): tháng → mùa, khớp màn tập trung/màn tắt, script chống nháy khớp lõi thuần, Tết/can chi,
 * lời chào đếm ngược, và TƯƠNG PHẢN WCAG của mọi bảng trong app/chu-de-mua.css (đọc thẳng tệp CSS).
 *
 * Chạy từ gốc repo: npx tsx --test frontend/src/lib/chuDeMua/logic.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  CAC_MUA, CHU_DE_MUA_BOOT_SCRIPT, MAN_TAT, MAN_YEN, canChi, giaiMua, khopTienTo, loiMua, muaTheoThang,
  parseChuDe, tet, trangThaiDom,
} from './logic';
import { THEME_BOOT_SCRIPT } from '../../context/themeLogic';

describe('tháng → mùa (giống iOS)', () => {
  it('Xuân 1–3 · Hạ 4–7 · Thu 8–10 · Đông 11–12', () => {
    assert.deepEqual(
      Array.from({ length: 12 }, (_, i) => muaTheoThang(i + 1)),
      ['xuan', 'xuan', 'xuan', 'ha', 'ha', 'ha', 'ha', 'thu', 'thu', 'thu', 'dong', 'dong'],
    );
  });
  it('Mặc định ⇒ null; giá trị lạ ⇒ Mặc định', () => {
    assert.equal(giaiMua('macDinh'), null);
    assert.equal(parseChuDe('rác'), 'macDinh');
    assert.equal(parseChuDe(null), 'macDinh');
    assert.equal(giaiMua('tuDong', new Date(2026, 9, 24)), 'thu');
    assert.equal(giaiMua('tuDong', new Date(2026, 10, 1)), 'dong');
  });
});

describe('màn tập trung / màn tắt', () => {
  it('khớp theo đoạn, * là một đoạn', () => {
    assert.ok(khopTienTo('/exam/attempt/12', MAN_YEN));
    assert.ok(khopTienTo('/courses/react/learn', MAN_YEN));
    assert.ok(khopTienTo('/courses/react/learn/5', MAN_YEN));
    assert.ok(!khopTienTo('/courses/react', MAN_YEN));
    assert.ok(!khopTienTo('/courses', MAN_YEN));
    assert.ok(khopTienTo('/books/clean-code', MAN_YEN));
    assert.ok(!khopTienTo('/books', MAN_YEN));
    assert.ok(khopTienTo('/language/en/ielts/ngay/3', MAN_YEN));
    assert.ok(khopTienTo('/work/ws/KEY', MAN_YEN));
    assert.ok(!khopTienTo('/workshop', MAN_YEN)); // không khớp nửa đoạn
    assert.ok(khopTienTo('/notes', MAN_TAT));
    assert.ok(!khopTienTo('/', MAN_YEN));
  });
  it('Notes không bao giờ mang mùa; màn yên vẫn mang màu', () => {
    assert.deepEqual(trangThaiDom('xuan', '/notes/abc'), { mua: null, yen: false });
    assert.deepEqual(trangThaiDom('dong', '/exam'), { mua: 'dong', yen: true });
    assert.deepEqual(trangThaiDom('ha', '/feed'), { mua: 'ha', yen: false });
    assert.deepEqual(trangThaiDom('macDinh', '/feed'), { mua: null, yen: false });
  });
});

/** Chạy CHÍNH chuỗi script (theme + mùa) trên một DOM giả. */
function runBoot(stored: Record<string, string | null>, pathname: string, thang = 10, throws = false) {
  const classes = new Set<string>();
  const attrs: Record<string, string> = {};
  const documentElement = {
    classList: { add: (c: string) => { classes.add(c); } },
    setAttribute: (k: string, v: string) => { attrs[k] = v; },
  };
  const localStorage = {
    getItem: (k: string) => { if (throws) throw new Error('blocked'); return stored[k] ?? null; },
  };
  const RealDate = Date;
  const FakeDate = class extends RealDate {
    constructor() { super(2026, thang - 1, 15); }
  } as DateConstructor;
  new Function('document', 'localStorage', 'window', 'location', 'Date', THEME_BOOT_SCRIPT + CHU_DE_MUA_BOOT_SCRIPT)(
    { documentElement }, localStorage, {}, { pathname }, FakeDate,
  );
  return { classes: [...classes], attrs };
}

describe('script chống nháy khớp lõi thuần', () => {
  const duongDan = ['/', '/feed', '/exam/attempt/1', '/notes', '/books/x', '/courses/a/learn', '/settings/appearance'];
  for (const c of [null, 'macDinh', 'tuDong', 'xuan', 'ha', 'thu', 'dong', 'rác']) {
    for (const p of duongDan) {
      for (const thang of [2, 10, 12]) {
        it(`chuDeMua=${String(c)} · ${p} · tháng ${thang}`, () => {
          const out = runBoot({ theme: 'light', chuDeMua: c }, p, thang);
          const ky = trangThaiDom(parseChuDe(c), p, new Date(2026, thang - 1, 15));
          assert.equal(out.attrs['data-mua'] ?? null, ky.mua);
          assert.equal('data-mua-yen' in out.attrs, ky.yen);
          assert.deepEqual(out.classes, ['light']); // không đụng class sáng/tối, không bao giờ `.dark`
        });
      }
    }
  }
  it('Mặc định ⇒ không gắn một thuộc tính nào ngoài data-theme-pref', () => {
    const out = runBoot({ theme: 'dark' }, '/feed');
    assert.deepEqual(Object.keys(out.attrs), ['data-theme-pref']);
  });
  it('localStorage bị chặn ⇒ không nổ, không gắn mùa', () => {
    const out = runBoot({}, '/feed', 10, true);
    assert.equal(out.attrs['data-mua'], undefined);
  });
});

describe('Tết, can chi, lời chào', () => {
  it('Tết 2027 = 6/2, can chi', () => {
    const t = tet(2027)!;
    assert.deepEqual([t.getMonth() + 1, t.getDate()], [2, 6]);
    assert.equal(canChi(2026), 'Bính Ngọ');
    assert.equal(canChi(2027), 'Đinh Mùi');
  });
  it('đếm ngược Noel rồi Tết', () => {
    assert.match(loiMua('dong', new Date(2026, 11, 20))!.chu, /Còn 5 ngày nữa là Giáng sinh/);
    assert.equal(loiMua('dong', new Date(2026, 11, 25))!.chu, 'Giáng sinh an lành!');
    assert.match(loiMua('dong', new Date(2026, 11, 27))!.chu, /Tết Đinh Mùi/);
    assert.match(loiMua('xuan', new Date(2027, 0, 20))!.chu, /Còn 17 ngày nữa là Tết Đinh Mùi/);
    assert.equal(loiMua('xuan', new Date(2027, 1, 6))!.chu, 'Chúc mừng năm mới Đinh Mùi!');
    assert.equal(loiMua(null), null);
  });
});

// ── Tương phản WCAG của app/chu-de-mua.css ──────────────────────────────────────────────────────

const CSS = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '../../app/chu-de-mua.css'),
  'utf8',
);

function khoiBien(selectorBatDau: string): Record<string, string> {
  const i = CSS.indexOf(selectorBatDau);
  assert.ok(i >= 0, `thiếu khối ${selectorBatDau}`);
  const body = CSS.slice(CSS.indexOf('{', i) + 1, CSS.indexOf('}', i));
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/(--[a-z-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}
function lum(hex: string) {
  const v = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const x = parseInt(v.slice(i, i + 2), 16) / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function tuongPhan(a: string, b: string) {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

describe('tương phản WCAG mọi mùa × sáng/tối', () => {
  for (const mua of CAC_MUA) {
    for (const toi of [false, true]) {
      it(`${mua} · ${toi ? 'tối' : 'sáng'}`, () => {
        const v = khoiBien(toi ? `html.theme-dark[data-mua="${mua}"],` : `html[data-mua="${mua}"],`);
        const loi: string[] = [];
        for (const chu of ['--text-primary', '--text-secondary', '--text-muted', '--accent-color']) {
          for (const nen of ['--bg-primary', '--bg-card', '--bg-surface']) {
            const c = tuongPhan(v[chu], v[nen]);
            if (c < 4.5) loi.push(`${chu} trên ${nen} = ${c.toFixed(2)}`);
          }
        }
        const trang = tuongPhan('#ffffff', v['--accent-color']);
        if (trang < (toi ? 3 : 4.5)) loi.push(`chữ trắng trên accent = ${trang.toFixed(2)}`);
        assert.deepEqual(loi, []);
      });
    }
  }
  it('không có luật nào chạm html khi KHÔNG có data-mua (Mặc định y nguyên)', () => {
    // Mọi bộ chọn phải có [data-mua…] hoặc là thẻ xem trước / canvas riêng.
    const boChon = [...CSS.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim());
    for (const s of boChon) {
      for (const phan of s.split(/,(?![^(]*\))/)) {
        const p = phan.trim();
        assert.ok(/data-mua|\.xem-mua|\.nen-mua-canvas/.test(p), `bộ chọn chạm Mặc định: ${p}`);
      }
    }
    assert.ok(!/\.dark(?![\w-])/.test(CSS.replace(/\/\*[\s\S]*?\*\//g, '')), 'không bao giờ dùng class .dark');
  });
});
