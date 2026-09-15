/**
 * Hỏi AI trên máy — và đường ẢNH.
 *
 * ⚠️⚠️ PHÉP KIỂM ĐẦU TIÊN Ở ĐÂY LÀ QUAN TRỌNG NHẤT, và nó có vì một chuyện đã
 * xảy ra thật ngày 16/09/2026.
 *
 * `hoi.ts` đọc trạng thái máy chủ qua `trangThai()` của `chay.ts` — hai mô-đun,
 * MỘT biến. Nếu vì lý do gì đó chúng thành hai bản sao thì `dangSan()` luôn trả
 * `false` trong khi máy chủ đang chạy ngon lành, và hậu quả là **lưới đỡ ngoại
 * tuyến không bao giờ chạy**: người dùng mất mạng, robot im, không lỗi nào.
 *
 * Chạy thử bằng `tsx` đúng là thấy hai bản sao (`trangThai()` trả về object
 * trong khi `dangSan()` trả `false`) — nhưng đó là tật của `tsx`, không phải
 * của sản phẩm: bản dựng thật gói cả hai mô-đun vào MỘT mẩu `dist/shared/hoi.cjs`
 * mà `aiCucBo.cjs` và `robot.cjs` cùng `require("./hoi.cjs")`, nên CommonJS
 * chỉ tạo một thực thể. Phép kiểm dưới đây chốt điều đó lại: nó bật máy chủ qua
 * `chay.ts` rồi hỏi `hoi.ts` xem có thấy không.
 */
import { chmod, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { bat, tat } from './chay';
import { dangSan, ganNhan, hoiMay, nhinDuocAnh, NHAN_MAY } from './hoi';

/** Máy chủ giả: trả `/health` ok, và ghi lại thân yêu cầu để soi. */
async function mayGia(g: string): Promise<string> {
  const p = join(g, 'llama-server');
  await writeFile(p, `#!/usr/bin/env node
const http=require('http');
const fs=require('fs');
const cong=Number(process.argv[process.argv.indexOf('--port')+1]);
http.createServer((q,s)=>{
  if(q.url==='/health'){s.writeHead(200,{'Content-Type':'application/json'});s.end('{"status":"ok"}');return;}
  let b='';q.on('data',d=>b+=d);q.on('end',()=>{
    fs.writeFileSync(process.env.SO_GHI, b);
    s.writeHead(200,{'Content-Type':'application/json'});
    s.end(JSON.stringify({choices:[{message:{content:'xong'}}]}));
  });
}).listen(cong,'127.0.0.1');
setInterval(()=>{},1000);
`);
  await chmod(p, 0o755);
  return p;
}

let rac: string[] = [];
afterEach(async () => {
  await tat();
  for (const g of rac) await rm(g, { recursive: true, force: true });
  rac = [];
});

async function moiTruong(maModel: 'vua' | 'anh') {
  const g = await mkdtemp(join(tmpdir(), 'hoi-'));
  rac.push(g);
  const soGhi = join(g, 'than.json');
  process.env.SO_GHI = soGhi;
  const tep = await mayGia(g);
  await bat({
    duongLlamaServer: tep,
    duongModel: join(g, 'm.gguf'),
    ...(maModel === 'anh' ? { duongMmproj: join(g, 'mm.gguf') } : {}),
    maModel,
    coGpu: true,
  });
  return { g, soGhi };
}

const ANH = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==';

describe('⭐ hai mô-đun phải thấy CÙNG một trạng thái', () => {
  it('bật bằng chay.ts thì hoi.ts phải thấy — không thấy = lưới đỡ chết câm', async () => {
    expect(dangSan(), 'chưa bật mà đã báo sẵn sàng').toBe(false);
    await moiTruong('vua');
    expect(
      dangSan(),
      'hoi.ts KHÔNG thấy máy chủ mà chay.ts vừa bật ⇒ hai bản sao trạng thái ⇒ '
      + 'lưới đỡ ngoại tuyến không bao giờ chạy, và không có lỗi nào để thấy',
    ).toBe(true);
    await tat();
    expect(dangSan()).toBe(false);
  }, 30_000);
});

describe('đường ảnh', () => {
  it('bản CHỮ + ảnh ⇒ chặn bằng tiếng Việt, KHÔNG gửi đi', async () => {
    const { soGhi } = await moiTruong('vua');
    expect(nhinDuocAnh()).toBe(false);
    const r = await hoiMay({ chu: 'ảnh gì đây', anh: [ANH] });
    expect(r?.loi, 'phải nói rõ vì sao và chỉ đường').toMatch(/Bản xem ảnh/);
    expect(r?.chu).toBeUndefined();
    /* Và QUAN TRỌNG: không được gửi lên máy chủ. Gửi rồi nhận 500 tiếng Anh
       thì người học đọc một câu không dành cho họ. */
    await expect(import('node:fs/promises').then((f) => f.readFile(soGhi)))
      .rejects.toThrow();
  }, 30_000);

  it('bản XEM ẢNH ⇒ gửi đúng hình dạng image_url của tuyến OpenAI', async () => {
    const { soGhi } = await moiTruong('anh');
    expect(nhinDuocAnh()).toBe(true);
    const r = await hoiMay({ chu: 'đọc giúp', anh: [ANH] });
    expect(r?.chu).toBe('xong');

    const than = JSON.parse(
      await import('node:fs/promises').then((f) => f.readFile(soGhi, 'utf8')),
    ) as { messages: { role: string; content: unknown }[] };
    const cuoi = than.messages[than.messages.length - 1]!;
    expect(Array.isArray(cuoi.content), 'có ảnh thì content phải là MẢNG').toBe(true);
    const phan = cuoi.content as { type: string; image_url?: { url: string } }[];
    expect(phan[0]).toEqual({ type: 'text', text: 'đọc giúp' });
    /* Hình dạng này ĐO THẬT trên llama-server b10964 + Qwen3-VL-4B ngày
       16/09/2026: nó đọc đúng con số ngẫu nhiên vẽ trong ảnh. */
    expect(phan[1]).toEqual({ type: 'image_url', image_url: { url: ANH } });
  }, 30_000);

  it('KHÔNG ảnh ⇒ content vẫn là chuỗi trơn, không bọc thành mảng', async () => {
    const { soGhi } = await moiTruong('vua');
    await hoiMay({ chu: 'chào' });
    const than = JSON.parse(
      await import('node:fs/promises').then((f) => f.readFile(soGhi, 'utf8')),
    ) as { messages: { content: unknown }[] };
    expect(than.messages[than.messages.length - 1]!.content).toBe('chào');
  }, 30_000);

  it('quá 3 ảnh ⇒ từ chối trước khi gửi', async () => {
    await moiTruong('anh');
    const r = await hoiMay({ chu: 'x', anh: [ANH, ANH, ANH, ANH] });
    expect(r?.loi).toMatch(/tối đa 3 ảnh/);
  }, 30_000);

  it('chuỗi không phải data URL ảnh ⇒ bỏ qua, không gửi lên', async () => {
    const { soGhi } = await moiTruong('anh');
    await hoiMay({ chu: 'x', anh: ['https://ai-do.example/anh.png', 'rác'] });
    const than = JSON.parse(
      await import('node:fs/promises').then((f) => f.readFile(soGhi, 'utf8')),
    ) as { messages: { content: unknown }[] };
    expect(than.messages[than.messages.length - 1]!.content).toBe('x');
  }, 30_000);

  it('chưa bật ⇒ null, để chỗ gọi biết mà đi đường khác', async () => {
    expect(await hoiMay({ chu: 'x' })).toBeNull();
  });
});

describe('nhãn', () => {
  it('mọi câu từ máy đều mang nhãn nói rõ nguồn', () => {
    const r = ganNhan('nội dung');
    expect(r.startsWith(NHAN_MAY)).toBe(true);
    expect(r).toContain('nội dung');
    expect(NHAN_MAY, 'nhãn phải nói rõ đây là máy của người dùng').toMatch(/trên máy bạn/);
  });
});
