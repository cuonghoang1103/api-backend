/**
 * ============================================================
 * IndexNow Service — báo công cụ tìm kiếm crawl URL ngay
 *
 * IndexNow (indexnow.org) là một giao thức mở: gửi MỘT lời gọi
 * là báo cho Bing, Yandex, Coc Coc, Seznam… biết những URL nào
 * vừa đổi để chúng crawl lại — không phải chờ crawl định kỳ.
 * Miễn phí, không cần tài khoản; chỉ cần một file key công khai
 * đặt ở gốc site (frontend/public/<key>.txt) để chứng minh sở hữu.
 *
 * Ở đây ta lấy toàn bộ URL từ sitemap.xml rồi nộp một lượt. Chạy
 * theo cron (mỗi 6 giờ) — xem cron.service.ts.
 * ============================================================
 */

import { logger } from '../utils/logger.js';

const HOST = 'cuongthai.com';
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_KEY = 'cb36d6e5ecc54ce3ded3fbc9fa441682';
const MAX_URLS = 10000; // giới hạn IndexNow cho một lời gọi

export interface IndexNowResult {
  ok: boolean;
  submitted: number;
  status?: number;
  error?: string;
}

/**
 * Lấy mọi URL trong sitemap.xml rồi nộp cho IndexNow.
 *
 * KHÔNG BAO GIỜ throw — cron gọi nó, một lỗi mạng không được phép
 * làm chết job. Mọi nhánh đều trả về một object kết quả.
 */
export async function submitSitemapToIndexNow(): Promise<IndexNowResult> {
  // Tôn trọng việc tắt tay: đặt INDEXNOW_ENABLED=false để im hẳn.
  if (process.env.INDEXNOW_ENABLED === 'false') {
    return { ok: true, submitted: 0 };
  }

  const key = process.env.INDEXNOW_KEY || DEFAULT_KEY;
  const keyLocation = `https://${HOST}/${key}.txt`;

  try {
    // ── 1. Lấy sitemap ──
    const sitemapRes = await fetch(SITEMAP_URL, {
      signal: AbortSignal.timeout(8000),
    });
    if (!sitemapRes.ok) {
      logger.warn('IndexNow: không tải được sitemap', { status: sitemapRes.status });
      return { ok: false, submitted: 0, status: sitemapRes.status, error: 'sitemap fetch failed' };
    }
    const xml = await sitemapRes.text();

    // ── 2. Rút mọi URL trong <loc>…</loc>, chỉ giữ URL của site ──
    const urlList: string[] = [];
    const seen = new Set<string>();
    const locRegex = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
    let m: RegExpExecArray | null;
    while ((m = locRegex.exec(xml)) !== null) {
      const url = m[1].trim();
      if (url.startsWith(`https://${HOST}`) && !seen.has(url)) {
        seen.add(url);
        urlList.push(url);
        if (urlList.length >= MAX_URLS) break;
      }
    }

    if (urlList.length === 0) {
      logger.warn('IndexNow: sitemap không có URL nào của site', { host: HOST });
      return { ok: false, submitted: 0, error: 'no urls' };
    }

    // ── 3. Nộp cho IndexNow ──
    const postRes = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
      signal: AbortSignal.timeout(8000),
    });

    // 200/202 = nhận rồi. Code khác thì cảnh báo nhưng KHÔNG throw.
    const ok = postRes.status === 200 || postRes.status === 202;
    if (ok) {
      logger.info('IndexNow: đã nộp URL', { submitted: urlList.length, status: postRes.status });
    } else {
      logger.warn('IndexNow: endpoint trả mã lạ', { submitted: urlList.length, status: postRes.status });
    }

    return { ok, submitted: urlList.length, status: postRes.status };
  } catch (err) {
    logger.error('IndexNow: lỗi khi nộp', { error: (err as Error).message });
    return { ok: false, submitted: 0, error: (err as Error).message };
  }
}
