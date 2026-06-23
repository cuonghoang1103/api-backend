// ──────────────────────────────────────────────────────────
// Phase 6b: RSS 2.0 feed generator for projects
// ──────────────────────────────────────────────────────────
//
// We hand-roll the XML rather than pulling in a library
// because the feed shape is tiny and we want zero new
// dependencies. The output is RSS 2.0 with the Atom
// self-link and a content:encoded payload that uses
// the already-rendered bodyHtml when available (falls
// back to the markdown source wrapped in <pre>).
//
// Sanitization matters: feed readers will render the
// content:encoded HTML, so we re-run the same rehype-
// sanitize pipeline that powers the public case study
// page. If bodyHtml is empty, we fall back to the
// markdown source rather than rendering on the fly —
// RSS consumers usually re-render content:encoded on
// their side and prefer plain text over injected HTML.

import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { renderProjectMarkdown } from './projectMarkdown.service.js';

const escapeXml = (s: string): string =>
 s
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&apos;');

export interface RssProjectItem {
 title: string;
 link: string;
 guid: string;
 pubDate: Date;
 description: string;
 contentEncoded: string;
 category: string | null;
}
void (null as unknown as RssProjectItem);

export async function buildProjectsFeed(limit = 30): Promise<string> {
 const projects = await prisma.project.findMany({
 where: { isPublished: true },
 orderBy: { createdAt: 'desc' },
 take: limit,
 select: {
 id: true,
 slug: true,
 title: true,
 description: true,
 thumbnailUrl: true,
 category: true,
 bodyHtml: true,
 bodyMdx: true,
 createdAt: true,
 },
 });

 const siteUrl = config.frontendUrl.replace(/\/$/, '');
 const feedUrl = `${siteUrl}/api/v1/projects/feed.xml`;
 const now = new Date().toUTCString();

 const items: string[] = [];
 for (const p of projects) {
 const link = `${siteUrl}/projects/${p.slug}`;
 const description = (p.description ?? '').trim();
 const safeDescription = escapeXml(description);

 // Use cached bodyHtml when present; otherwise re-render
 // the markdown lazily. We never expose bodyMdx raw —
 // either sanitized HTML or escaped markdown source.
 let contentHtml: string;
 if (p.bodyHtml && p.bodyHtml.trim().length > 0) {
 contentHtml = p.bodyHtml;
 } else if (p.bodyMdx && p.bodyMdx.trim().length > 0) {
 try {
 contentHtml = await renderProjectMarkdown(p.bodyMdx);
 } catch {
 contentHtml = `<pre>${escapeXml(p.bodyMdx)}</pre>`;
 }
 } else {
 contentHtml = '';
 }

 const thumbTag = p.thumbnailUrl
 ? `<img src="${escapeXml(p.thumbnailUrl)}" alt="${escapeXml(p.title)}" /><br/>`
 : '';
 const categoryTag = p.category
 ? `<category>${escapeXml(p.category)}</category>`
 : '';

 items.push(` <item>
 <title>${escapeXml(p.title)}</title>
 <link>${escapeXml(link)}</link>
 <guid isPermaLink="true">${escapeXml(link)}</guid>
 <pubDate>${p.createdAt.toUTCString()}</pubDate>
 <description>${safeDescription}</description>
 ${categoryTag}
 <content:encoded><![CDATA[${thumbTag}${contentHtml}]]></content:encoded>
 </item>`);
 }

 return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
 xmlns:atom="http://www.w3.org/2005/Atom"
 xmlns:content="http://purl.org/rss/1.0/modules/content/"
 xmlns:dc="http://purl.org/dc/elements/1.1/">
 <channel>
 <title>Cuong Hoang — Projects</title>
 <link>${escapeXml(siteUrl)}/projects</link>
 <description>Case studies and build logs from Cuong Hoang's portfolio.</description>
 <language>vi</language>
 <lastBuildDate>${now}</lastBuildDate>
 <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
 ${items.join('\n')}
 </channel>
</rss>`;
}
