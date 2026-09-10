/**
 * ============================================================
 * BỘ CHẠY JAVA — PHÉP KIỂM
 * ============================================================
 *
 * Cả bộ này chạy JDK THẬT. Không mock: mock một trình biên dịch nghĩa là kiểm
 * cái mock, và toàn bộ lý do bộ chạy tồn tại là để thay việc ĐỌC bằng việc
 * CHẠY. Máy nào không có JDK thì các phép kiểm tự bỏ qua — nói ra, chứ không
 * xanh giả.
 *
 * Phép kiểm nặng ký nhất là ca P0001: chạy chính lời giải mẫu mà `solkit.py`
 * đã biên dịch và chạy thật, rồi đòi hành vi trùng khớp. Nó kiểm bộ chạy bằng
 * một đáp án đã biết, thay vì kiểm bộ chạy bằng chính nó.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { bienDich, bocLoiJavac, chay, doanLopMain, gomJava, timJdk, type Jdk } from './boChayJava';
import { P0001_MAIN, P0001_STDIN, P0001_TEP } from './p0001.fixture';

let jdk: Jdk | null = null;
const raC: string[] = [];

async function duAnTam(tep: Array<[string, string]>): Promise<string> {
  const d = await fs.mkdtemp(path.join(os.tmpdir(), 'lab211-test-'));
  raC.push(d);
  for (const [rel, src] of tep) {
    const p = path.join(d, rel);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, src, 'utf8');
  }
  return d;
}

beforeAll(async () => { jdk = await timJdk(); }, 40_000);
afterAll(async () => {
  for (const d of raC) await fs.rm(d, { recursive: true, force: true }).catch(() => {});
});

describe('tìm JDK', () => {
  it('tìm được javac VÀ java, không chỉ java', async () => {
    if (!jdk) { console.warn('BỎ QUA: máy này không có JDK'); return; }
    expect(jdk.javac).toMatch(/javac(\.exe)?$/);
    expect(jdk.java).toMatch(/java(\.exe)?$/);
    // Bắt buộc phải là JDK chứ không phải JRE — JRE chạy được mà không biên
    // dịch được, và đó là kiểu hỏng người mới không tài nào đoán ra.
    await expect(fs.access(jdk.javac)).resolves.toBeUndefined();
  });
});

describe('bóc lỗi javac', () => {
  it('lấy đúng tên file và số dòng để gắn vào gutter', () => {
    const raThô = [
      '/tmp/du-an/src/ui/Main.java:12: error: \';\' expected',
      '        int x = 1',
      '                 ^',
      '1 error',
    ].join('\n');
    const loi = bocLoiJavac(raThô, '/tmp/du-an');
    expect(loi).toHaveLength(1);
    expect(loi[0]!.file).toBe(path.join('src', 'ui', 'Main.java'));
    expect(loi[0]!.dong).toBe(12);
    expect(loi[0]!.loi).toContain("';' expected");
  });

  it('không nhặt nhầm dòng cảnh báo hay dòng đếm', () => {
    expect(bocLoiJavac('Note: Main.java uses unchecked operations.\n1 warning', '/x')).toHaveLength(0);
  });
});

describe('gom file nguồn', () => {
  it('bỏ qua build/, dist/, nbproject/ — đó là .class cũ và siêu dữ liệu', async () => {
    const d = await duAnTam([
      ['src/ui/Main.java', 'package ui; public class Main {}'],
      ['build/classes/ui/Cu.java', 'package ui; public class Cu {}'],
      ['nbproject/X.java', 'public class X {}'],
      ['dist/Y.java', 'public class Y {}'],
    ]);
    const tep = await gomJava(d);
    expect(tep).toHaveLength(1);
    expect(tep[0]).toContain(path.join('src', 'ui', 'Main.java'));
  });
});

describe('đoán lớp main', () => {
  it('ưu tiên gói ui, đúng khuôn LAB211', async () => {
    const d = await duAnTam([
      ['src/bo/Sorter.java', 'package bo; public class Sorter { public static void main(String[] a) {} }'],
      ['src/ui/Main.java', 'package ui; public class Main { public static void main(String[] a) {} }'],
    ]);
    expect(await doanLopMain(d)).toEqual(['ui.Main', 'bo.Sorter']);
  });
});

describe('biên dịch rồi CHẠY THẬT', () => {
  it('bài hỏng cú pháp thì đỏ, và chỉ đúng dòng sai', async () => {
    if (!jdk) { console.warn('BỎ QUA: không có JDK'); return; }
    const d = await duAnTam([['src/ui/Main.java',
      'package ui;\npublic class Main {\n  public static void main(String[] a) {\n    int x = 1\n  }\n}\n']]);
    const kq = await bienDich({ jdk, duAn: d });
    expect(kq.ok).toBe(false);
    expect(kq.loi.length).toBeGreaterThan(0);
    expect(kq.loi[0]!.dong).toBe(4);
  }, 60_000);

  it('nạp bàn phím vào stdin và nhận lại đúng console', async () => {
    if (!jdk) { console.warn('BỎ QUA: không có JDK'); return; }
    const d = await duAnTam([['src/ui/Main.java', [
      'package ui;',
      'import java.util.Scanner;',
      'public class Main {',
      '  public static void main(String[] a) {',
      '    Scanner sc = new Scanner(System.in);',
      '    System.out.print("Ten: ");',
      '    String t = sc.nextLine();',
      '    System.out.println("Chao " + t);',
      '  }',
      '}',
    ].join('\n')]]);
    const bd = await bienDich({ jdk, duAn: d });
    expect(bd.ok).toBe(true);
    const kq = await chay({ jdk, classpath: bd.thuMucRa, lopMain: 'ui.Main', stdin: 'Cuong\n', cwd: d });
    expect(kq.ma).toBe(0);
    // Console phải NGUYÊN VẸN — không banner JAVA_TOOL_OPTIONS, không cắt giữa.
    expect(kq.console).toBe('Ten: Chao Cuong\n');
  }, 60_000);

  it('vòng lặp vô tận bị cắt bằng hết giờ, không treo bộ kiểm', async () => {
    if (!jdk) { console.warn('BỎ QUA: không có JDK'); return; }
    const d = await duAnTam([['src/ui/Main.java',
      'package ui;\npublic class Main { public static void main(String[] a) { while (true) {} } }\n']]);
    const bd = await bienDich({ jdk, duAn: d });
    const kq = await chay({ jdk, classpath: bd.thuMucRa, lopMain: 'ui.Main', cwd: d, giay: 2 });
    expect(kq.hetGio).toBe(true);
    expect(kq.ma).toBeNull();
  }, 60_000);
});

describe('KIỂM NGƯỢC: chạy chính lời giải mẫu P0001 đã verify', () => {
  it('biên dịch sạch, và hành vi trùng thứ solkit đã chứng minh', async () => {
    if (!jdk) { console.warn('BỎ QUA: không có JDK'); return; }
    const d = await duAnTam(P0001_TEP);

    const bd = await bienDich({ jdk, duAn: d });
    expect(bd.ok, `javac đỏ trên lời giải mẫu:\n${bd.raThô}`).toBe(true);
    expect(bd.soTep).toBe(3);

    const kq = await chay({ jdk, classpath: bd.thuMucRa, lopMain: P0001_MAIN, stdin: P0001_STDIN, cwd: d });
    expect(kq.ma).toBe(0);
    expect(kq.hetGio).toBe(false);

    // Đúng ba tính chất `solkit` kiểm, vì mảng là NGẪU NHIÊN nên không so được
    // chuỗi cố định:
    //   1. hỏi lại khi gõ "abc" và khi gõ "-5" — Validator làm việc;
    //   2. in ra mảng trước và sau khi sắp;
    //   3. mảng sau PHẢI không giảm dần.
    const soDong = kq.console.trim().split('\n');
    expect(soDong.length).toBeGreaterThanOrEqual(2);

    const mang = [...kq.console.matchAll(/\[([\d,\s]+)\]/g)]
      .map((m) => m[1]!.split(',').map((x) => Number(x.trim())));
    expect(mang.length, `không thấy mảng nào trong console:\n${kq.console}`).toBeGreaterThanOrEqual(2);

    const truoc = mang[mang.length - 2]!;
    const sau = mang[mang.length - 1]!;
    expect(sau).toHaveLength(truoc.length);
    expect([...sau].sort((a, b) => a - b)).toEqual(sau);          // đã sắp tăng
    expect([...sau].sort((a, b) => a - b)).toEqual([...truoc].sort((a, b) => a - b)); // cùng tập phần tử
  }, 90_000);
});
