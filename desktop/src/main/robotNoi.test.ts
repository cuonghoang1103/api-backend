/**
 * MỘT CÔNG TẮC, BỐN CÁI NÚT.
 *
 * Bật/tắt robot có bốn lối vào (Cài đặt · menu chuột phải · bốn cú bấm · phím
 * tắt) và mỗi lối phải làm ĐỦ BA việc: ghi thiết đặt, đóng/mở cửa sổ nổi, báo
 * cho các cửa sổ khác. Lịch sử cho thấy mỗi lần thiếu một việc là ra một lỗi
 * người dùng báo thật:
 *
 *   thiếu ghi thiết đặt → tắt xong mở app lần sau robot quay về (14/09/2026)
 *   thiếu đóng cửa sổ   → tắt ở Cài đặt mà con nổi vẫn đứng đó (14/09/2026)
 *   thiếu báo tin       → tắt bằng phím tắt xong, Cài đặt vẫn tick
 *
 * Nên chốt cả ba ở một chỗ.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserWindow } from 'electron';

/** Cửa sổ CHÍNH giả — `dangOTrongApp()` hỏi đúng nó, và nó phải KHÔNG phải robot. */
const cuaSoGia = {
  isDestroyed: () => false,
  coTieuDiem: false,
  isFocused(): boolean { return cuaSoGia.coTieuDiem; },
  webContents: { send: vi.fn(), getURL: () => 'app://x/index.html' },
};

/** Cửa sổ robot mà `moRobot()` dựng ra — đủ mặt các phương thức nó gọi tới. */
/** Khung cửa sổ "thật" của cửa sổ giả — `setBounds` ghi vào, `getBounds` đọc ra. */
let khungGia = { x: 0, y: 0, width: 150, height: 160 };
/** Con trỏ chuột toàn màn hình mà `screen.getCursorScreenPoint()` trả. */
const troGia = { x: 0, y: 0 };

function cuaSoMoi(): unknown {
  return {
    isDestroyed: () => false,
    destroy: vi.fn(),
    setBounds: vi.fn((r: typeof khungGia) => { khungGia = { ...r }; }),
    setSize: vi.fn(),
    getBounds: () => ({ ...khungGia }),
    setAlwaysOnTop: vi.fn(),
    setVisibleOnAllWorkspaces: vi.fn(),
    setIgnoreMouseEvents: vi.fn(),
    showInactive: vi.fn(),
    hide: vi.fn(),
    once: vi.fn(),
    on: vi.fn(),
    loadURL: vi.fn(),
    webContents: { send: vi.fn(), setWindowOpenHandler: vi.fn(), on: vi.fn(), getURL: () => '' },
  };
}

vi.mock('electron', () => ({
  app: { on: vi.fn(), focus: vi.fn() },
  screen: {
    getPrimaryDisplay: () => ({ id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 } }),
    getAllDisplays: () => [{ id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 } }],
    getCursorScreenPoint: () => ({ ...troGia }),
    on: vi.fn(),
  },
  BrowserWindow: Object.assign(vi.fn(cuaSoMoi), { getAllWindows: () => [cuaSoGia] }),
}));

const kho: Record<string, unknown> = {};
vi.mock('./store', () => ({
  getSettings: () => kho,
  setSetting: (k: string, v: unknown) => { kho[k] = v; },
}));

vi.mock('./config', () => ({
  IS_DEV: false, DEV_SERVER_URL: 'http://localhost:5173',
  RENDERER_SOURCE: 'bundle', APP_ORIGIN: 'app://ct',
}));

const {
  batTatRobot, moRobot, dongRobot, dongBoRobotNoi, keoBatDau, keoToi, keoXong, apBoCuc, datPhanTram,
} = await import('./robotNoi');

beforeEach(() => {
  for (const k of Object.keys(kho)) delete kho[k];
  cuaSoGia.webContents.send.mockClear();
  cuaSoGia.coTieuDiem = false;
});

describe('batTatRobot', () => {
  it('tắt ⇒ GHI thiết đặt (không chỉ đóng cửa sổ)', () => {
    expect(batTatRobot(false)).toBe(false);
    expect(kho.robotEnabled).toBe(false);
  });

  it('tắt ⇒ BÁO cho mọi cửa sổ, kèm giá trị mới', () => {
    batTatRobot(false);
    expect(cuaSoGia.webContents.send).toHaveBeenCalledWith('robot:congTac', { bat: false });
  });

  it('⭐ bỏ trống tham số ⇒ LẬT, và lật được cả hai chiều', () => {
    // Phím tắt toàn cục gọi đúng dạng này. Chỉ đi được một chiều thì nó ẩn
    // được robot mà không bao giờ gọi lại được — một cái bẫy, không phải nút.
    expect(batTatRobot()).toBe(false);
    expect(batTatRobot()).toBe(true);
    expect(kho.robotEnabled).toBe(true);
  });

  it('chưa đặt bao giờ ⇒ coi như ĐANG BẬT (mặc định của app)', () => {
    expect(kho.robotEnabled).toBeUndefined();
    expect(batTatRobot()).toBe(false);
  });
});

describe('⭐ LỖI 4 — hai con robot cùng hiện lúc mới mở app', () => {
  /**
   * Đo thật bằng Playwright trên bản đã đóng gói, 16/09/2026:
   *
   *   | trạng thái        | robot.html          | index.html    |
   *   |-------------------|---------------------|---------------|
   *   | ① vừa khởi động   | hiện, **có tiêu điểm** | hiện, không tiêu điểm |
   *   | ② app mất tiêu điểm | hiện              | —             |
   *   | ③ app có tiêu điểm | ẩn ✓               | có tiêu điểm  |
   *
   * Tức là `robotTheoTieuDiem()` vẫn chạy đúng — chỗ hỏng là ở ①: cửa sổ robot
   * CƯỚP tiêu điểm lúc dựng, nên "đang ở trong app" tính ra `false` và con nổi
   * không bao giờ được bảo ẩn. Người dùng thấy hai con robot cho tới khi họ tự
   * bấm vào cửa sổ chính.
   *
   * Cách sửa: dựng ở trạng thái ẩn rồi `showInactive()` sau khi vẽ xong.
   */
  it('dựng cửa sổ ở trạng thái ẨN (`show: false`), không hiện thẳng', () => {
    dongRobot();
    moRobot();
    const opt = (BrowserWindow as unknown as { mock: { calls: [Record<string, unknown>][] } })
      .mock.calls.at(-1)![0];
    expect(opt.show).toBe(false);
  });

  it('⭐ hiện bằng `showInactive()` — `show()` sẽ kéo app lên trước mặt người đang gõ ở app khác', () => {
    dongRobot();
    const w = moRobot() as unknown as {
      once: { mock: { calls: [string, () => void][] } };
      showInactive: { mock: { calls: unknown[] } };
      show?: unknown;
    };
    const san = w.once.mock.calls.find(([ten]) => ten === 'ready-to-show');
    expect(san, 'phải đợi `ready-to-show`, không hiện lúc còn trắng').toBeDefined();
    san![1]();
    expect(w.showInactive.mock.calls).toHaveLength(1);
  });
});

describe('⭐ bật LẠI robot trong lúc app đang ở trước', () => {
  /**
   * Cửa thứ hai vào cùng lỗi "hai con robot", tìm ra bằng đo thật 16/09/2026:
   * ẩn robot bằng bốn cú bấm, rồi bật lại bằng công tắc trong Cài đặt. Lúc ấy
   * cửa sổ chính ĐANG có tiêu điểm, nên sẽ không còn `browser-window-focus`
   * nào bắn ra nữa — con nổi hiện lên cạnh con trong app và ngồi lại đó.
   *
   * Hai chốt phải cùng có: `dongBoRobotNoi()` áp luật ngay sau khi mở, và
   * `ready-to-show` không được lật ngược quyết định ấy.
   */
  it('mở xong thì ẨN ngay, không đợi sự kiện tiêu điểm kế tiếp', () => {
    dongRobot();
    cuaSoGia.coTieuDiem = true;   // app đang ở trước mặt người dùng
    kho.robotEnabled = true;
    dongBoRobotNoi();
    const w = (BrowserWindow as unknown as {
      mock: { results: { value: {
        hide: { mock: { calls: unknown[] } };
        showInactive: { mock: { calls: unknown[] } };
        once: { mock: { calls: [string, () => void][] } };
      } }[] };
    }).mock.results.at(-1)!.value;
    expect(w.hide.mock.calls.length, 'phải gọi hide() ngay').toBeGreaterThan(0);

    // …và `ready-to-show` (đến SAU) không được hiện nó lên lại.
    const san = w.once.mock.calls.find(([ten]) => ten === 'ready-to-show');
    san![1]();
    expect(w.showInactive.mock.calls).toHaveLength(0);
  });
});

describe('⭐ 03/10/2026 — thả ở đâu ĐỨNG YÊN ở đó', () => {
  function moMoi(): { setBounds: { mock: { calls: unknown[][] } } } {
    dongRobot();
    kho.robotViTri = JSON.stringify({ id: 1, x: 500, y: 400, tx: 0, ty: 0, mw: 1920, mh: 1080 });
    const w = moRobot() as unknown as { setBounds: { mock: { calls: unknown[][] } } };
    khungGia = { x: 500, y: 400, width: 150, height: 160 };
    return w;
  }

  it('mở lại ⇒ đúng toạ độ đã lưu, không về góc dưới-phải', () => {
    dongRobot();
    kho.robotViTri = JSON.stringify({ id: 1, x: 321, y: 123, tx: 0, ty: 0, mw: 1920, mh: 1080 });
    moRobot();
    const opt = (BrowserWindow as unknown as { mock: { calls: [Record<string, unknown>][] } }).mock.calls.at(-1)![0];
    expect([opt.x, opt.y]).toEqual([321, 123]);
  });

  it('kéo theo con trỏ, thả ra KHÔNG tự chạy sang mép (mặc định tắt hút mép), và LƯU', async () => {
    const w = moMoi();
    troGia.x = 560; troGia.y = 480;          // nắm robot ở (60, 80) trong hộp
    keoBatDau('hop');
    troGia.x = 960; troGia.y = 580;
    keoToi(400, 100);
    expect(khungGia).toEqual({ x: 900, y: 500, width: 150, height: 160 });
    const soLanTruoc = w.setBounds.mock.calls.length;
    keoXong();
    await new Promise((r) => setTimeout(r, 300));   // quá thời gian trượt hút mép cũ
    expect(w.setBounds.mock.calls.length).toBe(soLanTruoc);
    expect(khungGia.x).toBe(900);
    expect(JSON.parse(kho.robotViTri as string)).toMatchObject({ id: 1, x: 900, y: 500 });
  });

  it('⛔ hiện rồi tắt bong bóng ⇒ cửa sổ về ĐÚNG hộp robot cũ (không trôi)', () => {
    moMoi();
    const kq = apBoCuc({ loai: 'bong', co: { width: 316, height: 70 } }, true)!;
    expect(kq.boCuc.cuaSo.height).toBe(160 + 8 + 70);
    apBoCuc(null, true);
    expect(khungGia).toEqual({ x: 500, y: 400, width: 150, height: 160 });
  });

  it('đổi cỡ 35% ⇒ hộp đúng tỉ lệ; trục ở phần ba giữa giữ TÂM, trục sát mép giữ MÉP', () => {
    moMoi();
    expect(datPhanTram(37)).toBe(35);
    const kq = apBoCuc(null, true)!;
    expect(kq.boCuc.coHop).toEqual({ width: 53, height: 56 });
    // x: tâm 575/1920 = 0,30 ⇒ phần ba TRÁI ⇒ giữ mép trái; y: 480/1080 ⇒ giữa ⇒ giữ tâm.
    expect(khungGia.x).toBe(500);
    const tamY = khungGia.y + khungGia.height / 2;
    expect(Math.abs(tamY - 480)).toBeLessThanOrEqual(1);
    datPhanTram(100);
  });
});
