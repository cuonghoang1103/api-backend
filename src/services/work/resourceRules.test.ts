/**
 * CT Work — Resources (06/10/2026): luật thuần (resourceRules.ts + permissions.resourceAccess).
 *   npx tsx --test src/services/work/resourceRules.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canModifyResource, clientPortalRouteAllowed, resourceAccess } from './permissions.js';
import {
  blockedAddress, blockedHostname, detectKind, embedInfoFor, extractPageInfo, faviconFor, githubRepoOf, linkStatusFrom, matchesQuery,
  normTags, normalizeUrl, parseImport, titleFromUrl,
} from './resourceRules.js';

describe('Resources — URL', () => {
  it('chỉ http/https/mailto, ≤ 2000 ký tự; thiếu scheme ⇒ https', () => {
    assert.equal(normalizeUrl('github.com/vercel/next.js'), 'https://github.com/vercel/next.js');
    assert.equal(normalizeUrl(' <https://x.com/a> '), 'https://x.com/a');
    assert.equal(normalizeUrl('mailto:team@studio.vn'), 'mailto:team@studio.vn');
    for (const bad of ['javascript:alert(1)', 'ftp://x.com', 'file:///etc/passwd', 'data:text/html,hi', 'not a url', 'mailto:nobody', `https://x.com/${'a'.repeat(2000)}`, 'https://user:pw@x.com']) {
      assert.equal(normalizeUrl(bad), null, bad);
    }
  });
  it('tự nhận loại theo host', () => {
    const cases: Array<[string, string]> = [
      ['https://github.com/a/b', 'github'], ['https://gitlab.com/a/b', 'gitlab'], ['https://www.figma.com/file/x', 'figma'],
      ['https://drive.google.com/drive/folders/1', 'gdrive'], ['https://docs.google.com/document/d/1', 'gdocs'],
      ['https://docs.google.com/spreadsheets/d/1', 'gsheets'], ['https://youtu.be/abc', 'youtube'], ['https://x.notion.site/p', 'notion'],
      ['https://assetstore.unity.com/packages/1', 'unity'], ['https://freesound.org/people/a/sounds/1/', 'freesound'],
      ['https://www.mixamo.com/#/', 'mixamo'], ['https://polyhaven.com/a/rock', 'polyhaven'], ['mailto:a@b.co', 'mail'], ['https://example.com', 'link'],
    ];
    for (const [u, k] of cases) assert.equal(detectKind(u), k, u);
  });
  it('favicon Google s2, GitHub owner/repo, tiêu đề dự phòng', () => {
    assert.equal(faviconFor('https://www.figma.com/file/x'), 'https://www.google.com/s2/favicons?domain=figma.com&sz=64');
    assert.equal(faviconFor('mailto:a@b.co'), null);
    assert.deepEqual(githubRepoOf('https://github.com/vercel/next.js.git'), { owner: 'vercel', repo: 'next.js', canonical: 'https://github.com/vercel/next.js' });
    assert.equal(githubRepoOf('https://github.com/orgs/vercel/people'), null);
    assert.equal(githubRepoOf('https://github.com/vercel'), null);
    assert.equal(titleFromUrl('https://github.com/a/b/tree/main'), 'a/b');
  });
  it('nhãn: bỏ #, bỏ trùng không phân biệt hoa thường, tối đa 20', () => {
    assert.deepEqual(normTags(['#UI', 'ui', ' sfx ', '', 'âm thanh']), ['UI', 'sfx', 'âm-thanh']);
    assert.equal(normTags(Array.from({ length: 40 }, (_, i) => `t${i}`)).length, 20);
  });
});

describe('Resources — nhập Markdown / CSV', () => {
  it('Markdown: ## nhóm, [tiêu đề](url), url trần, #nhãn, dòng hỏng báo số dòng', () => {
    const r = parseImport('## Source code\n- [Repo FE](https://github.com/a/fe) main app #fe\n- https://figma.com/file/x\nchỉ là chữ\n### Âm thanh\n* Tiếng bước chân: https://freesound.org/s/1 #sfx #foley');
    assert.equal(r.format, 'markdown');
    assert.deepEqual(r.rows.map((x) => [x.title, x.group, x.tags]), [['Repo FE', 'Source code', ['fe']], [null, 'Source code', []], ['Tiếng bước chân', 'Âm thanh', ['sfx', 'foley']]]);
    assert.equal(r.rows[0].description, 'main app');
    assert.deepEqual(r.errors.map((e) => e.line), [4]);
  });
  it('CSV có tiêu đề cột, ô có dấu phẩy trong ngoặc kép, nhãn ngăn bởi ;', () => {
    const r = parseImport('title,url,group,tags\n"Repo, BE",https://github.com/a/be,Source code,"be;api"\nBad,not-a-link,Docs,');
    assert.equal(r.format, 'csv');
    assert.deepEqual(r.rows[0], { title: 'Repo, BE', url: 'https://github.com/a/be', group: 'Source code', tags: ['be', 'api'], description: null, line: 2 });
    assert.equal(r.errors.length, 1);
  });
});

describe('Resources — tìm bỏ dấu, tiêu đề trang', () => {
  it('"thiet ke" khớp "Thiết kế", nhãn "âm-thanh" khớp "am thanh"', () => {
    assert.ok(matchesQuery({ title: 'Thiết kế màn hình', url: 'https://figma.com' }, 'thiet ke'));
    assert.ok(matchesQuery({ title: 'x', url: 'y', tags: ['âm-thanh'] }, 'am thanh'));
    assert.ok(!matchesQuery({ title: 'Thiết kế', url: 'y' }, 'thiet ke backend'));
  });
  it('OpenGraph thắng <title>, giải mã thực thể', () => {
    assert.equal(extractPageInfo('<title>A &amp; B</title>').title, 'A & B');
    assert.equal(extractPageInfo('<title>A</title><meta property="og:title" content="OG &#39;x&#39;">').title, "OG 'x'");
  });
});

describe('Resources — chống SSRF + trạng thái link', () => {
  it('chặn IP nội bộ kể cả IPv4 ánh xạ IPv6 dạng hex / NAT64', () => {
    for (const ip of ['127.0.0.1', '10.0.0.5', '169.254.169.254', '192.168.1.1', '::1', '::ffff:7f00:1', '::ffff:127.0.0.1', '64:ff9b::a9fe:a9fe', 'fe80::1', '::']) {
      assert.equal(blockedAddress(ip), true, ip);
    }
    for (const ip of ['8.8.8.8', '140.82.112.3', '2001:4860:4860::8888', '::ffff:808:808']) assert.equal(blockedAddress(ip), false, ip);
    assert.ok(blockedHostname('localhost') && blockedHostname('api.localhost') && blockedHostname('metadata.google.internal'));
  });
  it('chỉ 404/410/tên miền chết là BROKEN; repo GitHub private (404) ⇒ UNKNOWN', () => {
    assert.equal(linkStatusFrom({ status: 200 }, 'link'), 'OK');
    assert.equal(linkStatusFrom({ status: 403 }, 'figma'), 'OK');
    assert.equal(linkStatusFrom({ status: 404 }, 'link'), 'BROKEN');
    assert.equal(linkStatusFrom({ status: 404 }, 'github'), 'UNKNOWN');
    assert.equal(linkStatusFrom({ error: 'DNS' }, 'link'), 'BROKEN');
    assert.equal(linkStatusFrom({ error: 'TIMEOUT' }, 'link'), 'UNKNOWN');
    assert.equal(linkStatusFrom({ status: 503 }, 'link'), 'UNKNOWN');
  });
});

describe('Resources — nhúng / xem trước inline (embedInfoFor)', () => {
  // Gọi đúng như service: kind = detectKind(url).
  const info = (url: string) => embedInfoFor(detectKind(url), url);

  it('YouTube ⇒ youtube-nocookie/embed/<id>, 16:9 (watch?v / youtu.be / /embed / /shorts)', () => {
    for (const u of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    ]) {
      assert.deepEqual(info(u), { embeddable: true, embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', aspect: '16:9' }, u);
    }
    // Không có id ⇒ không nhúng.
    assert.deepEqual(info('https://www.youtube.com/'), { embeddable: false, embedUrl: null });
  });

  it('Figma ⇒ www.figma.com/embed?embed_host=ctwork&url=<encoded>, auto', () => {
    const src = 'https://www.figma.com/file/ABC123/Design';
    assert.deepEqual(info(src), {
      embeddable: true, embedUrl: `https://www.figma.com/embed?embed_host=ctwork&url=${encodeURIComponent('https://www.figma.com/file/ABC123/Design')}`, aspect: 'auto',
    });
  });

  it('Google Drive file ⇒ /file/d/<id>/preview; Docs/Sheets/Slides ⇒ /preview, auto', () => {
    assert.deepEqual(info('https://drive.google.com/file/d/1AbC_dEf/view?usp=sharing'),
      { embeddable: true, embedUrl: 'https://drive.google.com/file/d/1AbC_dEf/preview', aspect: 'auto' });
    assert.deepEqual(info('https://docs.google.com/document/d/1xYz/edit#heading=h.1'),
      { embeddable: true, embedUrl: 'https://docs.google.com/document/d/1xYz/preview', aspect: 'auto' });
    assert.deepEqual(info('https://docs.google.com/spreadsheets/d/1xYz/edit'),
      { embeddable: true, embedUrl: 'https://docs.google.com/spreadsheets/d/1xYz/preview', aspect: 'auto' });
  });

  it('Canva ⇒ /design/<id>/view?embed, 16:9', () => {
    assert.deepEqual(info('https://www.canva.com/design/DAFabc123/edit'),
      { embeddable: true, embedUrl: 'https://www.canva.com/design/DAFabc123/view?embed', aspect: '16:9' });
  });

  it('Vimeo / Loom ⇒ trình phát nhúng, 16:9 (nhận theo host, kind = link)', () => {
    assert.deepEqual(info('https://vimeo.com/123456789'),
      { embeddable: true, embedUrl: 'https://player.vimeo.com/video/123456789', aspect: '16:9' });
    assert.deepEqual(info('https://www.loom.com/share/abcDEF123'),
      { embeddable: true, embedUrl: 'https://www.loom.com/embed/abcDEF123', aspect: '16:9' });
  });

  it('GitHub / mail / link chung ⇒ KHÔNG nhúng', () => {
    for (const u of ['https://github.com/vercel/next.js', 'mailto:team@studio.vn', 'https://example.com/page', 'https://notion.so/x']) {
      assert.deepEqual(info(u), { embeddable: false, embedUrl: null }, u);
    }
  });

  it('host nội bộ / SSRF ⇒ KHÔNG nhúng dù trông giống nhà cung cấp', () => {
    // kind ép thành 'youtube' nhưng host là nội bộ ⇒ chốt SSRF chặn trước.
    assert.deepEqual(embedInfoFor('youtube', 'http://localhost/watch?v=dQw4w9WgXcQ'), { embeddable: false, embedUrl: null });
    assert.deepEqual(embedInfoFor('gdrive', 'http://127.0.0.1/file/d/1AbC/view'), { embeddable: false, embedUrl: null });
    assert.deepEqual(embedInfoFor('figma', 'http://169.254.169.254/file/x'), { embeddable: false, embedUrl: null });
    assert.deepEqual(embedInfoFor('youtube', 'javascript:alert(1)'), { embeddable: false, embedUrl: null });
  });
});

describe('Resources — quyền', () => {
  it('khách/GUEST chỉ thấy CLIENT; VIEWER/TEACHER đọc; MEMBER sửa của mình; ADMIN sửa tất', () => {
    assert.deepEqual(resourceAccess('CLIENT', 'MEMBER'), { view: 'CLIENT', edit: false, manage: false });
    assert.deepEqual(resourceAccess('MEMBER', 'GUEST'), { view: 'CLIENT', edit: false, manage: false });
    assert.deepEqual(resourceAccess('TEACHER', 'GUEST'), { view: 'ALL', edit: false, manage: false });
    assert.deepEqual(resourceAccess('VIEWER', 'MEMBER'), { view: 'ALL', edit: false, manage: false });
    assert.deepEqual(resourceAccess('MEMBER', 'MEMBER'), { view: 'ALL', edit: true, manage: false });
    assert.equal(canModifyResource('MEMBER', 'MEMBER', 5, 5), true);
    assert.equal(canModifyResource('MEMBER', 'MEMBER', 5, 6), false);
    assert.equal(canModifyResource('ADMIN', 'MEMBER', 5, 6), true);
    assert.equal(canModifyResource('VIEWER', 'MEMBER', 5, 5), false);
  });
  it('khách bị cách ly: /resources nội bộ bị chặn, /portal/resources mở', () => {
    assert.equal(clientPortalRouteAllowed('GET', '/resources'), false);
    assert.equal(clientPortalRouteAllowed('GET', '/issues/3/web-links'), false);
    assert.equal(clientPortalRouteAllowed('GET', '/portal/resources'), true);
    assert.equal(clientPortalRouteAllowed('POST', '/portal/resources/4/open'), true);
  });
});
