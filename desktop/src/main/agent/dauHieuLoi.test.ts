/**
 * DẤU HIỆU LỖI — canh bằng đầu ra THẬT của các công cụ hay hỏng nhất.
 *
 * Thứ đáng kiểm không phải "rút ra được một chuỗi", mà là: cùng một lỗi ở hai
 * lần chạy (khác đường dẫn, khác số dòng, khác mã băm) phải ra CÙNG dấu hiệu;
 * còn lệnh xanh thì KHÔNG ra gì, để không khớp nhầm bài học.
 */
import { describe, expect, it } from 'vitest';
import type { BaiHoc } from './boNho';
import { BoDemLoiLap, chuanHoaDauHieu, dauHieuLoi, khopBoNho } from './dauHieuLoi';

const NPM_ERESOLVE = `npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR!
npm ERR! While resolving: my-app@0.1.0
npm ERR! Found: react@18.2.0
npm ERR! node_modules/react
npm ERR!   react@"^18.2.0" from the root project
npm ERR!
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^17.0.0" from react-beautiful-dnd@13.1.1

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/cuong/.npm/_logs/2026-09-26T03_12_44_123Z-debug-0.log`;

const tsc = (file: string, dong: number, cot: number) =>
  `\u001b[96m${file}\u001b[0m:\u001b[93m${dong}\u001b[0m:\u001b[93m${cot}\u001b[0m - \u001b[91merror\u001b[0m\u001b[90m TS2345: \u001b[0mArgument of type 'string' is not assignable to parameter of type 'number'.

${dong}   tinh(ten);
        ~~~

Found 1 error in ${file}:${dong}
`;

const bai = (id: string, dauHieu?: string): BaiHoc => ({
  id, phamVi: 'chung', loai: 'loi', tieuDe: id, viSao: 'x', apDung: 'y',
  tao: '2026-09-26', sua: '2026-09-26', lanKhop: 0, ...(dauHieu ? { dauHieu } : {}),
});

describe('dauHieuLoi — đầu ra thật', () => {
  it('npm ERESOLVE: giữ mã lỗi, gọt phiên bản và đường dẫn log', () => {
    const d = dauHieuLoi('npm install react-beautiful-dnd', NPM_ERESOLVE, 1)!;
    expect(d.startsWith('npm install :: ')).toBe(true);
    expect(d).toContain('npm err! code eresolve');
    expect(d).toContain('eresolve unable to resolve dependency tree');
    // Dòng "npm ERR!" trơn không có thông tin — không được chiếm chỗ.
    expect(d).not.toMatch(/\| npm err!( \||$)/);
    expect(d.length).toBeLessThanOrEqual(300);
  });

  it('tsc TS2345: khác đường dẫn tuyệt đối + khác dòng/cột ⇒ CÙNG dấu hiệu', () => {
    const a = dauHieuLoi('npx tsc --noEmit', tsc('/Users/cuong/proj/src/tinh.ts', 12, 5), 2);
    const b = dauHieuLoi('npx tsc --noEmit', tsc('/home/ci/work/repo/src/lib/khac.ts', 98, 17), 2);
    expect(a).not.toBeNull();
    expect(a).toBe(b);
    expect(a).toContain('ts2345');
    expect(a).toContain('<P>');
    expect(a).not.toContain('cuong');
    expect(a!.startsWith('npx tsc :: ')).toBe(true);
  });

  it('tsc dạng gọn (đường dẫn tương đối, (dòng,cột)) cũng gộp được', () => {
    const a = dauHieuLoi('tsc', "src/a.ts(3,7): error TS2345: Argument of type 'string' is not assignable.", 2);
    const b = dauHieuLoi('tsc', "src/b/c.tsx(40,1): error TS2345: Argument of type 'string' is not assignable.", 2);
    expect(a).toBe(b);
  });

  it('docker: port is already allocated — mã băm container gọt thành <H>', () => {
    const ra = (id: string, cong: number) =>
      `Error response from daemon: driver failed programming external connectivity on endpoint web-1 (${id}): Bind for 0.0.0.0:${cong} failed: port is already allocated`;
    const a = dauHieuLoi('docker compose up -d', ra('3f2a9c81d0e4b7a6', 3000), 1);
    const b = dauHieuLoi('docker compose up -d', ra('aa01bb22cc33dd44', 5432), 1);
    expect(a).toBe(b);
    expect(a).toContain('port is already allocated');
    expect(a!.startsWith('docker compose :: ')).toBe(true);
  });

  it('dotnet build CS0246 (đường dẫn Windows) — giữ mã CS, bỏ dòng "Build FAILED."', () => {
    const ra = (p: string) => `  Determining projects to restore...
${p}\\Program.cs(3,7): error CS0246: The type or namespace name 'Newtonsoft' could not be found (are you missing a using directive or an assembly reference?) [${p}\\App.csproj]

Build FAILED.`;
    const a = dauHieuLoi('dotnet build', ra('C:\\Users\\cuong\\src\\App'), 1);
    const b = dauHieuLoi('dotnet build', ra('D:\\work\\App'), 1);
    expect(a).toBe(b);
    expect(a).toContain('error cs0246');
    expect(a).not.toContain('build failed');
    expect(a!.startsWith('dotnet build :: ')).toBe(true);
  });

  it('PowerShell: is not recognized as the name of a cmdlet', () => {
    const ra = `pnpm : The term 'pnpm' is not recognized as the name of a cmdlet, function, script file, or operable program.
At line:1 char:1
+ pnpm install
+ ~~~~
    + CategoryInfo          : ObjectNotFound: (pnpm:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException`;
    const d = dauHieuLoi('pnpm install', ra, 1)!;
    expect(d.startsWith('pnpm install :: ')).toBe(true);
    expect(d).toContain("is not recognized as the name of a cmdlet");
  });

  it('python Traceback ModuleNotFoundError', () => {
    const ra = (p: string, dong: number) => `Traceback (most recent call last):
  File "${p}", line ${dong}, in <module>
    import requests
ModuleNotFoundError: No module named 'requests'`;
    const a = dauHieuLoi('python app.py', ra('/Users/cuong/app.py', 1), 1);
    const b = dauHieuLoi('python3 scripts/app.py', ra('/srv/app/scripts/app.py', 7), 1);
    expect(a).toContain("modulenotfounderror: no module named 'requests'");
    expect(a).toContain('traceback');
    // Tiền tố khác (python vs python3) nhưng phần lỗi phải như nhau.
    expect(a!.split(' :: ')[1]).toBe(b!.split(' :: ')[1]);
  });

  it('lệnh xanh ⇒ null, kể cả khi đầu ra có chữ "0 Error(s)"', () => {
    expect(dauHieuLoi('npm test', '✓ 12 tests passed\nDone in 3.2s', 0)).toBeNull();
    expect(dauHieuLoi('dotnet build', 'Build succeeded.\n    0 Warning(s)\n    0 Error(s)\n', 0)).toBeNull();
    expect(dauHieuLoi('npm audit', 'found 0 vulnerabilities', 0)).toBeNull();
  });

  it('hỏng mà không có dòng "trông như lỗi" ⇒ lấy dòng chốt cuối', () => {
    const d = dauHieuLoi('make build', 'building...\nsomething went wrong at step 3', 2);
    expect(d).toBe('make build :: something went wrong at step <N>');
  });

  it('bỏ cd/biến môi trường trước lệnh thật khi lấy tiền tố', () => {
    const d = dauHieuLoi('cd /x/y && NODE_ENV=production npm run build', 'npm ERR! code ELIFECYCLE\nnpm ERR! errno 1', 1)!;
    expect(d.startsWith('npm run :: ')).toBe(true);
  });

  it('cắt ≤300 ký tự', () => {
    const dai = Array.from({ length: 3 }, (_, i) => `error: ${'thứ gì đó rất dài '.repeat(20)} ${i}`).join('\n');
    expect(dauHieuLoi('node x', dai, 1)!.length).toBeLessThanOrEqual(300);
  });
});

describe('chuanHoaDauHieu', () => {
  it('UUID, hex, số, đường dẫn đều được gọt', () => {
    expect(chuanHoaDauHieu('Lỗi ở /tmp/a/b.txt id 123e4567-e89b-12d3-a456-426614174000 commit 9fceb02d0ae598e95dc970b74767f19372d61af8 dòng 42'))
      .toBe('lỗi ở <P> id <U> commit <H> dòng <N>');
  });
});

describe('khopBoNho', () => {
  const d = dauHieuLoi('npm install', NPM_ERESOLVE, 1)!;

  it('bài lưu dấu hiệu ngắn nằm gọn trong dấu hiệu đầy đủ ⇒ khớp', () => {
    const ds = [bai('khac', 'docker compose :: port is already allocated'), bai('eresolve', 'npm err! code ERESOLVE')];
    expect(khopBoNho(d, ds)?.id).toBe('eresolve');
  });

  it('bỏ qua bài không có dấu hiệu, và không có gì gần ⇒ null', () => {
    expect(khopBoNho(d, [bai('khong-dau-hieu'), bai('xa', 'dotnet build :: error cs0246')])).toBeNull();
  });

  it('Jaccard ≥ 0,5 khi câu chữ hơi khác', () => {
    const luu = 'npm install :: npm err! code eresolve | npm err! eresolve could not resolve the dependency tree | npm err! could not resolve dependency:';
    expect(khopBoNho(d, [bai('gan', luu)])?.id).toBe('gan');
  });

  it('chuỗi quá ngắn không được "chứa" mọi thứ', () => {
    expect(khopBoNho(d, [bai('ngan', 'error')])).toBeNull();
  });

  it('nhiều bài khớp ⇒ chọn bài điểm cao nhất', () => {
    const ds = [bai('rong', 'npm err! code eresolve'), bai('sat', 'npm err! code eresolve | npm err! eresolve unable to resolve dependency tree')];
    expect(khopBoNho(d, ds)?.id).toBe('sat');
  });
});

describe('BoDemLoiLap', () => {
  it('đếm lần thứ mấy và nhớ bước đầu tiên', () => {
    const dem = new BoDemLoiLap();
    expect(dem.ghi('a', 4)).toEqual({ lanThu: 1, buocDau: 4 });
    expect(dem.ghi('b', 5)).toEqual({ lanThu: 1, buocDau: 5 });
    expect(dem.ghi('a', 9)).toEqual({ lanThu: 2, buocDau: 4 });
    expect(dem.ghi('a', 12)).toEqual({ lanThu: 3, buocDau: 4 });
  });
});
