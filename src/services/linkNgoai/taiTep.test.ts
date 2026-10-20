/**
 * attach_from_url / gdoc_images (19/10/2026) — phần THUẦN (đổi URL Google, đọc <img>, tên tệp) + bộ tải có rào với mạng
 * giả (không gọi Internet):  npx tsx --test src/services/linkNgoai/taiTep.test.ts
 */
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

process.env.NODE_ENV ??= 'test';

const { __datMangChoTest, LoiTai } = await import('./taiAnToan.js');
const t = await import('./taiTep.js');

const ID = '1Iqe_CzFVA6hyxe7h2bUKusxsjB6frXfdAYLerM3JjPo';
const DNS_CONG = async () => [{ address: '142.250.1.1' }];
afterEach(() => { __datMangChoTest(null); });

describe('urlTepTai: link Google ⇒ URL xuất', () => {
  it('Drawings ⇒ PNG; Docs ⇒ PDF; Sheets ⇒ XLSX; Slides ⇒ PDF / PNG một trang; Drive ⇒ tải thẳng', () => {
    assert.equal(t.urlTepTai(`https://docs.google.com/drawings/d/${ID}/edit?usp=sharing`).url, `https://docs.google.com/drawings/d/${ID}/export/png`);
    assert.equal(t.urlTepTai(`https://docs.google.com/document/d/${ID}/edit#heading=h.1`).url, `https://docs.google.com/document/d/${ID}/export?format=pdf`);
    assert.equal(t.urlTepTai(`docs.google.com/document/u/0/d/${ID}/edit`).url, `https://docs.google.com/document/d/${ID}/export?format=pdf`);
    assert.equal(t.urlTepTai(`https://docs.google.com/spreadsheets/d/${ID}/edit#gid=0`).url, `https://docs.google.com/spreadsheets/d/${ID}/export?format=xlsx`);
    assert.equal(t.urlTepTai(`https://docs.google.com/presentation/d/${ID}/edit`).url, `https://docs.google.com/presentation/d/${ID}/export/pdf`);
    assert.equal(t.urlTepTai(`https://docs.google.com/presentation/d/${ID}/edit#slide=id.g2a3b_0_12`).url, `https://docs.google.com/presentation/d/${ID}/export/png?pageid=g2a3b_0_12`);
    assert.equal(t.urlTepTai(`https://drive.google.com/file/d/${ID}/view?usp=sharing`).url, `https://drive.google.com/uc?export=download&id=${ID}`);
    assert.equal(t.urlTepTai(`https://drive.google.com/open?id=${ID}`).loai, 'gdrive');
    assert.throws(() => t.urlTepTai(`https://drive.google.com/drive/folders/${ID}`), /folder/);
  });
  it('URL đã là bản xuất / ảnh googleusercontent / web thường ⇒ giữ nguyên', () => {
    const xuat = `https://docs.google.com/drawings/d/${ID}/export/svg`;
    assert.equal(t.urlTepTai(xuat).url, xuat);
    const anh = 'https://lh7-rt.googleusercontent.com/docsz/AD_4nXabc?key=xyz';
    assert.deepEqual([t.urlTepTai(anh).loai, t.urlTepTai(anh).url], ['web', anh]);
    assert.equal(t.urlTepTai('https://example.com/a.png').loai, 'web');
    assert.equal(t.urlTepTai(`https://docs.google.com/document/d/e/2PACX-${'x'.repeat(40)}/pub`).loai, 'gdocpub');
    assert.throws(() => t.urlTepTai('ftp://example.com/a.png'), /http/);
  });
  it('urlHtmlCuaDoc: Docs ⇒ export?format=html; bản "publish to web" ⇒ /pub; thứ khác ⇒ null', () => {
    assert.equal(t.urlHtmlCuaDoc(`https://docs.google.com/document/d/${ID}/edit`)!.url, `https://docs.google.com/document/d/${ID}/export?format=html`);
    assert.match(t.urlHtmlCuaDoc(`https://docs.google.com/document/d/e/2PACX-${'x'.repeat(40)}/pub?embedded=true`)!.url, /\/pub$/);
    assert.equal(t.urlHtmlCuaDoc(`https://docs.google.com/spreadsheets/d/${ID}/edit`), null);
  });
});

describe('anhTrongHtml / giaiDataUri / tên tệp', () => {
  const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  // Đúng dạng bản xuất HTML của Google Docs (đo thật 19/10/2026): ảnh nhúng data: base64, cỡ trong style.
  const html = `<html><body><p><span style="overflow: hidden; display: inline-block; width: 624.00px; height: 351.00px;">`
    + `<img alt="oopif-q3.png" src="data:image/png;base64,${PNG_B64}" style="width: 624.00px; height: 351.00px; margin-left: 0.00px;" title=""></span></p>`
    + `<img src="https://lh7-rt.googleusercontent.com/docsz/AD_4n?key=a&amp;b=1" width="300" height="200" alt="So do ERD">`
    + `<img src="/rel/x.jpg"><img src="javascript:alert(1)"><img data-src="nope"></body></html>`;
  it('đánh số theo thứ tự, giữ data: + http(s), tương đối ⇒ tuyệt đối, bỏ javascript:/không src', () => {
    const a = t.anhTrongHtml(html, 'https://docs.google.com/document/d/x/export?format=html');
    assert.equal(a.length, 3);
    assert.deepEqual([a[0].index, a[0].alt, a[0].width, a[0].height], [1, 'oopif-q3.png', 624, 351]);
    assert.ok(a[0].src.startsWith('data:image/png;base64,'));
    assert.deepEqual([a[1].src, a[1].width, a[1].height, a[1].alt], ['https://lh7-rt.googleusercontent.com/docsz/AD_4n?key=a&b=1', 300, 200, 'So do ERD']);
    assert.equal(a[2].src, 'https://docs.google.com/rel/x.jpg');
  });
  it('giaiDataUri: ảnh base64 ⇒ byte + kiểu; thứ khác ⇒ null; coDataUri ước cỡ', () => {
    const d = t.giaiDataUri(`data:image/png;base64,${PNG_B64}`)!;
    assert.equal(d.kieu, 'image/png');
    assert.deepEqual([...d.byte.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
    assert.equal(t.giaiDataUri('data:text/html;base64,PGI+'), null);
    assert.equal(t.giaiDataUri('https://x.y/a.png'), null);
    assert.ok(Math.abs(t.coDataUri(`data:image/png;base64,${PNG_B64}`)! - d.byte.length) <= 2);
  });
  it('tên + kiểu: tên người gọi > Content-Disposition (UTF-8) > đường dẫn > gợi ý; octet-stream ⇒ đoán theo đuôi', () => {
    assert.equal(t.tenTuDispo(`attachment; filename="a.pdf"; filename*=UTF-8''S%C6%A1%20%C4%91%E1%BB%93.pdf`), 'Sơ đồ.pdf');
    assert.equal(t.tenTuDispo('inline; filename=x.png'), 'x.png');
    assert.deepEqual(t.tenVaKieu({ dispo: `attachment; filename*=UTF-8''Feature%20FAQ.pdf`, url: 'https://x/export', kieu: 'application/pdf' }), { fileName: 'Feature FAQ.pdf', contentType: 'application/pdf' });
    assert.deepEqual(t.tenVaKieu({ url: 'https://cdn.x/img/erd.png?v=2', kieu: 'application/octet-stream' }), { fileName: 'erd.png', contentType: 'image/png' });
    assert.deepEqual(t.tenVaKieu({ url: 'https://x/export/png', kieu: 'image/png; charset=binary', goiY: 'drawing' }), { fileName: 'drawing.png', contentType: 'image/png' });
    assert.deepEqual(t.tenVaKieu({ ten: 'NT-13 so do', url: 'https://x/', kieu: 'image/jpeg' }), { fileName: 'NT-13 so do.jpg', contentType: 'image/jpeg' });
  });
});

describe('Tải có rào (mạng giả)', () => {
  it('Drawings: đổi URL, theo chuyển hướng sang googleusercontent, trả PNG kèm tên', async () => {
    const goi: string[] = [];
    __datMangChoTest(async (url) => {
      goi.push(url);
      if (url.includes('/export/png')) return new Response(null, { status: 307, headers: { location: 'https://doc-0s-docs.googleusercontent.com/export/x.png' } });
      return new Response(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), { status: 200, headers: { 'content-type': 'image/png', 'content-disposition': 'attachment; filename="So do.png"' } });
    }, DNS_CONG);
    const r = await t.taiTepTuLink(`https://docs.google.com/drawings/d/${ID}/edit`, 1024);
    assert.equal(r.nguon.loai, 'gdrawing');
    assert.equal(goi[0], `https://docs.google.com/drawings/d/${ID}/export/png`);
    assert.equal(r.kq.byte.length, 4);
    assert.equal(t.tenVaKieu({ dispo: r.kq.dispo, url: r.kq.url, kieu: r.kq.kieu }).fileName, 'So do.png');
  });
  it('tài liệu riêng tư: chuyển hướng tới đăng nhập Google ⇒ RIENG_TU (câu "Anyone with the link")', async () => {
    __datMangChoTest(async () => new Response(null, { status: 302, headers: { location: 'https://accounts.google.com/ServiceLogin?continue=x' } }), DNS_CONG);
    await assert.rejects(t.taiTepTuLink(`https://docs.google.com/document/d/${ID}/edit`, 1024), (e: InstanceType<typeof LoiTai>) => {
      assert.equal(e.ma, 'RIENG_TU');
      assert.match(t.loiChoNguoi(e, 'gdoc').msg, /Anyone with the link/);
      return true;
    });
  });
  it('SSRF: tên miền trỏ IP nội bộ, IP gõ thẳng, chuyển hướng vào nội bộ, localhost ⇒ CAM (không gọi fetch tới đó)', async () => {
    const goi: string[] = [];
    __datMangChoTest(async (url) => { goi.push(url); return new Response('x', { headers: { 'content-type': 'image/png' } }); }, async () => [{ address: '10.0.0.7' }]);
    await assert.rejects(t.taiTepTuLink('https://evil.example.com/a.png', 1024), (e: InstanceType<typeof LoiTai>) => e.ma === 'CAM');
    await assert.rejects(t.taiTepTuLink('http://169.254.169.254/latest/meta-data', 1024), (e: InstanceType<typeof LoiTai>) => e.ma === 'CAM');
    await assert.rejects(t.taiTepTuLink('http://[::ffff:7f00:1]/a.png', 1024), (e: InstanceType<typeof LoiTai>) => e.ma === 'CAM');
    await assert.rejects(t.taiTepTuLink('http://localhost:3000/a.png', 1024), (e: InstanceType<typeof LoiTai>) => e.ma === 'CAM');
    assert.equal(goi.length, 0);
    __datMangChoTest(async (url) => {
      goi.push(url);
      return url.startsWith('https://ok.example.com') ? new Response(null, { status: 302, headers: { location: 'http://127.0.0.1:6379/' } }) : new Response('x');
    }, DNS_CONG);
    await assert.rejects(t.taiTepTuLink('https://ok.example.com/a.png', 1024), (e: InstanceType<typeof LoiTai>) => e.ma === 'CAM');
    assert.deepEqual(goi, ['https://ok.example.com/a.png']);
  });
  it('trang HTML thay vì tệp ⇒ lỗi gợi ý gdoc_images; vượt trần ⇒ QUA_LON', async () => {
    __datMangChoTest(async () => new Response('<html></html>', { headers: { 'content-type': 'text/html; charset=utf-8' } }), DNS_CONG);
    await assert.rejects(t.taiTepTuLink('https://example.com/page', 1024), /gdoc_images/);
    __datMangChoTest(async () => new Response(new Uint8Array(2048), { headers: { 'content-type': 'image/png' } }), DNS_CONG);
    await assert.rejects(t.taiTepTuLink('https://example.com/big.png', 1024), (e: InstanceType<typeof LoiTai>) => e.ma === 'QUA_LON');
  });
  it('anhCuaLink + taiAnh: Google Doc ⇒ bản xuất HTML, ảnh data: giải tại chỗ (không gọi mạng thêm)', async () => {
    const goi: string[] = [];
    const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    __datMangChoTest(async (url) => {
      goi.push(url);
      return new Response(`<p><img alt="erd.png" src="data:image/png;base64,${PNG_B64}" style="width: 10.00px; height: 5.00px;"></p>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });
    }, DNS_CONG);
    const r = await t.anhCuaLink(`https://docs.google.com/document/d/${ID}/edit`);
    assert.deepEqual(goi, [`https://docs.google.com/document/d/${ID}/export?format=html`]);
    assert.equal(r.anh.length, 1);
    const b = await t.taiAnh(r.anh[0], 1024);
    assert.equal(b.kieu, 'image/png');
    assert.equal(goi.length, 1);
    const d = await t.anhCuaLink(`https://docs.google.com/drawings/d/${ID}/edit`);
    assert.equal(d.anh[0].src, `https://docs.google.com/drawings/d/${ID}/export/png`);
  });
});
