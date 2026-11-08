/**
 * Đường cập nhật DỰ PHÒNG — đọc bản phát hành qua `api.github.com` thay vì `github.com`.
 *
 * ─── Vì sao có file này (đo thật 08/11/2026) ───
 *
 * `electron-updater` (provider `github`) dò bản mới bằng `https://github.com/<kho>/releases/latest`
 * kèm `Accept: application/json` — một hành vi KHÔNG có tài liệu của trang web GitHub, rồi tải
 * `latest*.yml` + gói cài qua `github.com/<kho>/releases/download/...`. Ngày 08/11/2026 cạnh
 * `x-github-edge-region: southeastasia` của github.com trả **504** cho MỌI trang (kể cả trang
 * repo, kể cả `releases/download/v0.5.212/latest.yml`), trong khi `api.github.com` vẫn 200 và
 * githubstatus.com báo "All Systems Operational". Người dùng ở Việt Nam thấy cả trang lỗi đỏ
 * dài hàng chục dòng HTML trong Cài đặt → Cập nhật, và KHÔNG nhận được bản mới.
 *
 * API REST là đường có tài liệu, chạy trên hạ tầng khác: `GET /repos/<kho>/releases/latest` cho
 * danh sách tệp, và `GET <asset.url>` với `Accept: application/octet-stream` chuyển hướng thẳng
 * sang CDN `release-assets.githubusercontent.com` — không đi qua github.com chút nào.
 *
 * ⚠️ Không dùng làm đường CHÍNH: API không token chỉ cho 60 lượt/giờ cho MỖI IP, mà cả lớp học
 * chung một IP NAT là chạm trần. Nên đường chính vẫn là provider `github` (không bị giới hạn này),
 * và chỉ khi nó hỏng thì `update.ts` mới chuyển sang đây.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import type { UpdateInfo } from 'electron-updater';

/** Một tệp của bản phát hành theo API GitHub — chỉ những trường cần. */
type TaiSan = { name: string; url: string };

/**
 * Hai hàm tiện ích `electron-updater` dùng NỘI BỘ để đọc `latest*.yml`. Gói không phơi chúng ra
 * ở `main.js`, nên lấy thẳng từ tệp nội bộ — bằng `require` LÚC CHẠY, từ đúng bản `electron-updater`
 * đang nằm trong bản cài (gói này để external trong `vite.main.config.ts`), nên luôn khớp phiên bản
 * với chính `Provider` mà ta kế thừa. Tự viết lại bộ đọc YAML là tự gánh thêm một chỗ có thể lệch.
 */
type NoiBoProvider = {
  parseUpdateInfo(raw: string | null, channelFile: string, channelFileUrl: URL): UpdateInfo;
  getFileList(info: UpdateInfo): Array<{ url: string }>;
};

function napNoiBo(): NoiBoProvider {
  const req = createRequire(__filename);
  const goc = req.resolve('electron-updater');
  return createRequire(goc)('./providers/Provider') as NoiBoProvider;
}

/** Tên kho phát hành `chủ/kho` → địa chỉ API. Tách ra để test được. */
export function urlApiPhatHanh(kho: string, tag?: string): string {
  const goc = `https://api.github.com/repos/${kho}/releases`;
  return tag ? `${goc}/tags/${encodeURIComponent(tag)}` : `${goc}/latest`;
}

/** Tìm tệp trong bản phát hành theo tên — GitHub đổi dấu cách thành `-` khi tải lên. */
export function timTaiSan(ds: TaiSan[], tenTep: string): TaiSan | undefined {
  const ten = path.posix.basename(tenTep).replace(/ /g, '-');
  return ds.find((a) => a.name === ten);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Dựng lớp provider `custom` cho `autoUpdater.setFeedURL({ provider: 'custom', updateProvider })`.
 *
 * `ProviderGoc` phải là lớp `Provider` của ĐÚNG module `electron-updater` vừa nạp (lấy qua
 * `default` nếu cần — xem chú thích trong `getUpdater()` của `update.ts`).
 */
export function taoProviderQuaApi(ProviderGoc: any, kho: string): any {
  const noiBo = napNoiBo();

  return class ProviderQuaApi extends ProviderGoc {
    private taiSan: TaiSan[] = [];

    constructor(_cauHinh: unknown, _updater: unknown, runtimeOptions: unknown) {
      super(runtimeOptions);
    }

    async getLatestVersion(): Promise<UpdateInfo> {
      const urlPhatHanh = new URL(urlApiPhatHanh(kho));
      const raw: string | null = await this.httpRequest(urlPhatHanh, {
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
      });
      const banPhatHanh = raw ? JSON.parse(raw) : null;
      if (!banPhatHanh || !Array.isArray(banPhatHanh.assets)) {
        throw new Error(`API GitHub không trả danh sách tệp của bản phát hành mới nhất (${urlPhatHanh}).`);
      }
      this.taiSan = banPhatHanh.assets.map((a: any) => ({ name: String(a.name), url: String(a.url) }));

      // `latest-mac.yml` / `latest.yml` / `latest-linux.yml` / `latest-linux-arm64.yml`…
      // — đúng quy tắc đặt tên kênh của chính provider gốc.
      const tenKenh = `${this.getDefaultChannelName()}.yml`;
      const kenh = timTaiSan(this.taiSan, tenKenh);
      if (!kenh) throw new Error(`Bản phát hành mới nhất thiếu tệp ${tenKenh}.`);

      const urlKenh = new URL(kenh.url);
      const yml: string | null = await this.httpRequest(urlKenh, { accept: 'application/octet-stream' });
      return noiBo.parseUpdateInfo(yml, tenKenh, urlKenh);
    }

    /** Tải gói cài qua `asset.url` của API cần đúng header này, không thì nhận về JSON mô tả. */
    get fileExtraDownloadHeaders() {
      return { accept: 'application/octet-stream' };
    }

    resolveFiles(info: UpdateInfo) {
      return noiBo.getFileList(info).map((tep) => {
        const ts = timTaiSan(this.taiSan, tep.url);
        if (!ts) throw new Error(`Bản phát hành thiếu tệp ${tep.url}.`);
        return { url: new URL(ts.url), info: tep };
      });
    }
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Tải MỘT tệp của bản phát hành `v<version>` — đường của macOS (tự tải `.zip`/`.dmg`).
 *
 * Thử github.com trước (không tốn lượt API), hỏng (lỗi mạng hoặc 5xx) thì đi API. 404 thì KHÔNG
 * lùi: tệp thật sự không có, lùi sang API cũng chỉ ra 404 và tốn một lượt.
 */
export async function fetchTepPhatHanh(kho: string, version: string, tenTep: string): Promise<Response> {
  const urlWeb = `https://github.com/${kho}/releases/download/v${version}/${tenTep}`;
  try {
    const res = await fetch(urlWeb, { redirect: 'follow' });
    if (res.ok || res.status < 500) return res;
    await res.body?.cancel().catch(() => {});
  } catch {
    /* lỗi mạng → thử API */
  }

  const resBan = await fetch(urlApiPhatHanh(kho, `v${version}`), {
    headers: { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' },
  });
  if (!resBan.ok) throw new Error(`API GitHub trả về ${resBan.status} khi đọc bản v${version}`);
  const ban = (await resBan.json()) as { assets?: TaiSan[] };
  const ts = timTaiSan(ban.assets ?? [], tenTep);
  if (!ts) throw new Error(`Bản v${version} không có tệp ${tenTep}`);
  return fetch(ts.url, { redirect: 'follow', headers: { accept: 'application/octet-stream' } });
}

/**
 * Đổi lỗi thô của `electron-updater` thành MỘT câu người dùng đọc được.
 *
 * Lỗi gốc của provider `github` nhét nguyên trang HTML + header + stack vào `message` (hàng chục
 * dòng — đã tràn ngang cả trang Cài đặt). Chi tiết thô vẫn giữ ở `chiTiet` cho ai cần báo lỗi.
 */
export function loiCapNhatDeDoc(raw: string): { message: string; chiTiet?: string } {
  const chiTiet = raw.length > 1500 ? `${raw.slice(0, 1500)}…` : raw;
  if (
    /ERR_UPDATER_LATEST_VERSION_NOT_FOUND|Unable to find latest version|\b50[0234]\b|Gateway Time-?out|ETIMEDOUT|ENOTFOUND|ECONNRESET|ECONNREFUSED|EAI_AGAIN|net::ERR_|không phản hồi sau|rate limit/i.test(
      raw,
    )
  ) {
    return {
      message: 'Chưa kết nối được máy chủ cập nhật (GitHub). App sẽ tự thử lại sau, bạn không cần làm gì.',
      chiTiet,
    };
  }
  // Lỗi khác: chỉ lấy dòng đầu, cắt ngắn — đủ để nhận ra, không tràn giao diện.
  const dauTien = (raw.split('\n')[0] ?? '').trim();
  const ngan = dauTien.length > 180 ? `${dauTien.slice(0, 180)}…` : dauTien;
  const message = ngan || 'Không kiểm tra được bản mới.';
  return chiTiet === ngan ? { message } : { message, chiTiet };
}
