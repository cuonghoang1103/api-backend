/**
 * ============================================================
 * KIỂM THẬT — tải llama.cpp ghim + model, bật llama-server, hỏi thật
 * ============================================================
 *
 * BỎ QUA mặc định (tải 1-19 GB không phải việc của `npm test`). Bật bằng:
 *
 *   CT_THU_THAT=1 npx vitest run src/main/aiCucBo/thuThat.test.ts
 *
 * Biến môi trường:
 *   CT_THU_GOC          thư mục chứa bộ chạy + model (mặc định: thư mục tạm).
 *                       Trỏ vào `<userData>/ai-ngoai-tuyen` để dùng lại file đã tải.
 *   CT_THU_MODEL        bản cho phần A (mặc định `nho` — 1,7B, nhỏ nhất).
 *   CT_THU_AGENT=1      chạy thêm phần B: một việc AI Code THẬT (đọc 1 file,
 *                       sửa 1 dòng) qua đúng `chayLuotCucBo` + `chayToolAgent`.
 *   CT_THU_AGENT_MODEL  ép bản cho phần B (mặc định: bản `batChoCode` tự chọn).
 *
 * Workflow `.github/workflows/desktop-ai-ngoai-tuyen.yml` chạy phần A trên
 * macOS / Windows / Ubuntu — gọi ĐÚNG mã `taiVe` / `giaiNen` / `hoiThietBiThat`
 * / `bat` của app, không phải một bản sao viết riêng cho CI.
 */
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it, vi } from 'vitest';

const BAT = process.env.CT_THU_THAT === '1';
const USER_DATA = await mkdtemp(join(tmpdir(), 'ct-thuthat-ud-'));
vi.mock('electron', () => ({
  app: { getPath: () => USER_DATA, isPackaged: false, getVersion: () => '0.0.0' },
  BrowserWindow: { getAllWindows: () => [] },
  dialog: {},
  nativeImage: {},
}));
const caiDat: Record<string, unknown> = {};
vi.mock('../store', () => ({
  getSettings: () => caiDat,
  setSetting: (k: string, v: unknown) => { caiDat[k] = v; },
}));

const giay = (t0: number): string => `${((Date.now() - t0) / 1000).toFixed(1)}s`;
const ghi = (...a: unknown[]): void => { console.log('[thu-that]', ...a); };

describe.skipIf(!BAT)('AI ngoại tuyến — chạy THẬT', () => {
  afterAll(async () => {
    const { tatModel } = await import('./quanLy');
    await tatModel();
  });

  it('A. tải bộ chạy ghim + model nhỏ nhất, bật, hỏi một câu, rồi một lượt gọi tool', async () => {
    const { cai, datGoc, tinhTrang } = await import('./quanLy');
    const { hoiMay } = await import('./hoi');
    const { chayVongCucBo } = await import('./agentCucBo');
    const { trangThai } = await import('./chay');
    const { BAN_LLAMA } = await import('./kho');
    const { promptCode } = await import('./promptCode');

    const goc = process.env.CT_THU_GOC || await mkdtemp(join(tmpdir(), 'ct-thuthat-'));
    const ma = (process.env.CT_THU_MODEL || 'nho') as 'nho';
    datGoc(goc);
    ghi(`nền tảng ${process.platform}-${process.arch} · llama.cpp ${BAN_LLAMA} · model ${ma} · thư mục ${goc}`);

    /* 1. Cài: tải + giải nén + `--list-devices` (lần đầu macOS ~22s) + tải model + bật. */
    let t0 = Date.now();
    let mocCuoi = '';
    await cai({
      ma,
      bao: (b) => {
        const moc = `${b.viec} ${Math.floor(b.phanTram / 10) * 10}%`;
        if (moc !== mocCuoi) { mocCuoi = moc; ghi(`  ${moc}`); }
      },
    });
    const tt = await tinhTrang();
    ghi(`CÀI XONG ${giay(t0)} · GPU: ${tt.may.coGpu ? tt.may.tenGpu : 'không'} (chắc chắn: ${tt.may.chacChan}) · VRAM ${tt.may.vramGb ?? -1} GB`);
    ghi(`  khuyên chat: ${tt.khuyen.nen} · khuyên AI Code: ${tt.khuyenCode.nen} (${tt.khuyenCode.muc})`);
    expect(tt.coBoChay).toBe(true);
    expect(tt.daCo).toContain(ma);
    const dang = trangThai();
    expect(dang?.maModel).toBe(ma);

    /* 2. Một câu chat thật. */
    t0 = Date.now();
    const tl = await hoiMay({ chu: 'Trả lời đúng một từ: thủ đô của Việt Nam là gì?' });
    ghi(`CHAT ${giay(t0)} → ${JSON.stringify(tl?.chu ?? tl?.loi).slice(0, 160)}`);
    expect(tl?.chu ?? '').toMatch(/Hà Nội|Ha Noi|Hanoi/i);

    /* 3. Một lượt gọi tool GIẢ qua đúng động cơ AI Code ngoại tuyến. */
    t0 = Date.now();
    const daGoi: string[] = [];
    const su: string[] = [];
    const kq = await chayVongCucBo({
      goc: dang!.goc,
      tenModel: ma,
      nhan: 'thử thật',
      /* ĐÚNG prompt sản phẩm — đo cái người dùng sẽ nhận, không đo một prompt thử dễ hơn. */
      heThong: promptCode({
        tenModel: ma, chiViecNho: true, tranBuoc: 4, nenTang: process.platform,
        duAn: 'thu', choSua: false, choChayLenh: false,
      }),
      hoiThoai: [{ role: 'user', content: 'Đọc file ma.txt rồi cho tôi biết MA_SO là bao nhiêu.' }],
      tools: [{
        name: 'read_file',
        description: 'Đọc nội dung một file trong dự án.',
        parameters: { type: 'object', properties: { path: { type: 'string', description: 'Đường dẫn tương đối.' } }, required: ['path'] },
      }],
      cuaSo: dang!.cuaSo,
      tranBuoc: 4,
      signal: new AbortController().signal,
      chayTool: async (g) => { daGoi.push(`${g.name}(${JSON.stringify(g.args)})`); return '1| # cấu hình\n2| MA_SO=4242\n'; },
      phat: (e) => {
        if (e.loai === 'chu') su.push(e.delta);
        if (e.loai === 'loi') ghi(`  LỖI ${e.ma}: ${e.thongDiep}`);
      },
    });
    ghi(`TOOL ${giay(t0)} · kết cục ${kq} · gọi: ${daGoi.join(', ')} · trả lời: ${JSON.stringify(su.join('')).slice(0, 160)}`);
    expect(kq).toBe('xong');
    expect(daGoi.some((d) => d.startsWith('read_file') && d.includes('ma.txt'))).toBe(true);
    expect(su.join('')).toContain('4242');
  }, 1_800_000);

  it.skipIf(process.env.CT_THU_AGENT !== '1')('B. một việc AI Code THẬT: đọc 1 file, sửa 1 dòng', async () => {
    const { datGoc } = await import('./quanLy');
    const { taoCuoc, datGocChoCuoc, datCheDoQuyen, chayLuotCucBo } = await import('../agent/loop');
    if (process.env.CT_THU_GOC) datGoc(process.env.CT_THU_GOC);

    const duAn = await mkdtemp(join(tmpdir(), 'ct-thuthat-duan-'));
    await writeFile(join(duAn, 'cau-hinh.ts'), '// cấu hình máy chủ\nexport const CONG = 3000;\nexport const TEN = "demo";\n');
    const id = taoCuoc();
    datGocChoCuoc(id, duAn);
    datCheDoQuyen(id, 'tuSua');   // tự duyệt sửa file — không có ai bấm thẻ duyệt trong phép thử

    const t0 = Date.now();
    const dong: string[] = [];
    let chu = '';
    await chayLuotCucBo(
      id,
      'Trong file cau-hinh.ts, đổi giá trị CONG từ 3000 thành 8080. Đọc file trước rồi mới sửa.',
      { goc: duAn, choSua: true, choChayLenh: false },
      (e) => {
        if (e.loai === 'chu') chu += e.delta;
        if (e.loai === 'tool') dong.push(`${e.ten}: ${e.tomTat}${process.env.CT_THU_CHI_TIET ? ` ⟨${(e.chiTiet ?? '').slice(0, 160)}⟩` : ''}`);
        if (e.loai === 'toolBatDau' && process.env.CT_THU_CHI_TIET) dong.push(`→ ${e.ten}`);
        if (e.loai === 'batDau' && e.cucBo) dong.push(`[bước ${e.buoc}/${e.tranBuoc} · ${e.cucBo.ten}]`);
        if (e.loai === 'loi') dong.push(`LỖI ${e.ma}: ${e.thongDiep}`);
      },
      process.env.CT_THU_AGENT_MODEL ? { epModel: process.env.CT_THU_AGENT_MODEL as 'nho' } : {},
    );
    const sau = await readFile(join(duAn, 'cau-hinh.ts'), 'utf8');
    ghi(`AGENT ${giay(t0)}\n  ${dong.join('\n  ')}\n  trả lời: ${JSON.stringify(chu).slice(0, 240)}\n  file sau:\n${sau}`);
    expect(sau).toContain('CONG = 8080');
    expect(sau).toContain('TEN = "demo"');
  }, 1_800_000);
});
