/**
 * ============================================================
 * ÂM THANH GIAO DIỆN — dùng chung web + app desktop (04/10/2026)
 * ============================================================
 *
 * Người dùng: "thêm âm thanh hiệu ứng như nút ấn, thông báo… nhưng phải hoạt
 * động đúng, nhạy — đừng như mấy âm thanh trước đó trên web không hoạt động".
 *
 * Vì sao hệ cũ (`lib/sound.ts`) bị cảm là "không chạy": nó chỉ được gọi ở 5 chỗ
 * (tin đến / thông báo / thích / đăng bài / đăng nhập) qua socket — bấm nút, bật
 * tắt, xong việc… KHÔNG có tiếng nào; và tiếng tới lúc tab đang để yên bị trình
 * duyệt nuốt vì chưa có cú bấm nào mở khoá. Hệ cũ vẫn giữ cho tin đến/thông báo
 * (người dùng chọn tiếng riêng ở /settings/notifications); tệp này lo phần còn lại.
 *
 * Thiết kế để NHẠY và KHÔNG IM CÂM:
 *  • Web Audio, không `<audio>`: mọi tệp tải + giải mã MỘT lần thành AudioBuffer,
 *    phát là `start()` ngay (~0 ms), không chờ mạng, không giật lần đầu.
 *  • Mở khoá ở cú `pointerdown`/`keydown` ĐẦU TIÊN (capture) — trước cả khi nút
 *    xử lý click, nên ngay tiếng bấm đầu tiên đã kêu.
 *  • Chống dồn: cùng một tiếng không phát lại trong 45 ms (bấm liên tục không
 *    thành tiếng rè), tối đa 6 tiếng chồng nhau.
 *  • Tự gắn vào giao diện (`ganTuDong`): nút, công tắc, hộp thoại, toast thành
 *    công/lỗi — không phải sửa từng component. Phần tử nào muốn im: `data-im`.
 *  • Đếm số lần phát thật (`window.__ctAmThanh`) để bộ kiểm đo được "đã kêu"
 *    thay vì đoán.
 *
 * Tệp âm thanh: Kenney "Interface Sounds" — CC0 (public domain), xem
 * public/sounds/ui/LICENSE-kenney-CC0.txt.
 */

export type TiengUi =
  | 'click' | 'bat' | 'tat' | 'xong' | 'luu' | 'loi' | 'gui' | 'tin-den'
  | 'thong-bao' | 'thich' | 'xoa' | 'mo' | 'dong' | 'len-cap';

export const DS_TIENG: readonly TiengUi[] = [
  'click', 'bat', 'tat', 'xong', 'luu', 'loi', 'gui', 'tin-den',
  'thong-bao', 'thich', 'xoa', 'mo', 'dong', 'len-cap',
];

/** Nhãn cho trang Cài đặt. */
export const NHAN_TIENG: Record<TiengUi, string> = {
  click: 'Bấm nút', bat: 'Bật công tắc', tat: 'Tắt công tắc', xong: 'Hoàn thành / thành công',
  luu: 'Lưu', loi: 'Lỗi', gui: 'Gửi tin', 'tin-den': 'Tin nhắn đến', 'thong-bao': 'Thông báo',
  thich: 'Thả tim', xoa: 'Xoá', mo: 'Mở hộp thoại', dong: 'Đóng hộp thoại', 'len-cap': 'Lên cấp',
};

/**
 * Hệ số âm lượng TỪNG tiếng — đo bằng ffmpeg volumedetect sau khi chuẩn hoá:
 * tiếng ngắn (click) vẫn nghe to hơn mức trung bình của nó, nên hạ; tiếng nhỏ
 * (lên cấp, thả tim) nâng. Mục tiêu: không tiếng nào làm giật mình.
 */
const HE_SO: Record<TiengUi, number> = {
  click: 0.35, bat: 0.55, tat: 0.55, xong: 0.7, luu: 0.6, loi: 0.8, gui: 0.9,
  'tin-den': 0.9, 'thong-bao': 0.85, thich: 1, xoa: 0.6, mo: 0.45, dong: 0.45, 'len-cap': 1,
};

/** Nhóm bật/tắt riêng — "bấm nút" là thứ dày đặc nhất nên tách để tắt riêng. */
export interface CaiDatAmThanh {
  bat: boolean;
  /** 0..1 */
  amLuong: number;
  /** Tiếng mỗi lần bấm nút / mục chọn. */
  bamNut: boolean;
}

const KHOA = 'ct-am-thanh-ui';
const MAC_DINH: CaiDatAmThanh = { bat: true, amLuong: 0.6, bamNut: true };

export function docCaiDat(): CaiDatAmThanh {
  try {
    const t = JSON.parse(localStorage.getItem(KHOA) ?? 'null') as Partial<CaiDatAmThanh> | null;
    if (!t) return { ...MAC_DINH };
    return {
      bat: t.bat !== false,
      amLuong: typeof t.amLuong === 'number' ? Math.min(1, Math.max(0, t.amLuong)) : MAC_DINH.amLuong,
      bamNut: t.bamNut !== false,
    };
  } catch { return { ...MAC_DINH }; }
}

let caiDat: CaiDatAmThanh | null = null;
const lay = (): CaiDatAmThanh => (caiDat ??= typeof window === 'undefined' ? { ...MAC_DINH } : docCaiDat());

export function ghiCaiDat(moi: Partial<CaiDatAmThanh>): CaiDatAmThanh {
  caiDat = { ...lay(), ...moi };
  try { localStorage.setItem(KHOA, JSON.stringify(caiDat)); } catch { /* chế độ riêng tư */ }
  if (typeof document !== 'undefined') { if (caiDat.bat) batGiuSong(); else tatGiuSong(); }
  return caiDat;
}

// ─── Bộ máy ──────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let nhanh: GainNode | null = null;
const dem: Record<string, number> = {};
const lanCuoi: Partial<Record<TiengUi, number>> = {};
let dangPhat = 0;
const bo = new Map<TiengUi, AudioBuffer>();
let dangNap: Promise<void> | null = null;

/**
 * Gốc thư mục âm thanh. Web: `/sounds/ui/`. App desktop chạy ở
 * app://cuongthai/index.html và đóng gói sẵn bản sao trong `public/sounds/ui/`
 * ⇒ đường TƯƠNG ĐỐI theo trang (không đi mạng, không dính CORS).
 */
function goc(): string {
  if (typeof window === 'undefined') return '/sounds/ui/';
  return /^https?:$/.test(window.location.protocol)
    ? '/sounds/ui/'
    : new URL('sounds/ui/', window.location.href).href;
}

function layCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C({ latencyHint: 'interactive' });
    nhanh = ctx.createGain();
    nhanh.connect(ctx.destination);
  }
  return ctx;
}

/** Tải + giải mã cả bộ (~70 KB). Gọi nhiều lần vô hại. */
export function napBo(): Promise<void> {
  if (dangNap) return dangNap;
  const c = layCtx();
  if (!c) return Promise.resolve();
  dangNap = Promise.all(DS_TIENG.map(async (t) => {
    try {
      const r = await fetch(`${goc()}${t}.mp3`);
      if (!r.ok) return;
      const buf = await c.decodeAudioData(await r.arrayBuffer());
      bo.set(t, buf);
    } catch { /* một tiếng hỏng không làm hỏng cả bộ */ }
  })).then(() => { capNhatDem(); });
  return dangNap;
}

function capNhatDem(): void {
  if (typeof window === 'undefined') return;
  (window as unknown as { __ctAmThanh?: unknown }).__ctAmThanh = {
    daPhat: { ...dem },
    daNap: bo.size,
    trangThai: ctx?.state ?? 'chua-tao',
    giuSong: !!giuSong,
    /** Độ trễ thật tới loa (giây) — đo được, không đoán. */
    treMs: ctx ? Math.round(((ctx.baseLatency ?? 0) + ((ctx as AudioContext & { outputLatency?: number }).outputLatency ?? 0)) * 1000) : null,
  };
}

/**
 * GIỮ LUỒNG ÂM THANH LUÔN SỐNG (04/10/2026).
 *
 * Người dùng: "ấn xong 1-2s sau nó mới kêu". Tiếng đã `start()` ngay ở
 * pointerdown — chỗ trễ nằm DƯỚI trình duyệt: Chromium dừng luồng ra loa sau vài
 * giây toàn im lặng (tiết kiệm điện), và macOS cho thiết bị âm thanh (nhất là
 * tai nghe Bluetooth) ngủ. Cú bấm kế tiếp phải chờ thiết bị thức dậy ⇒ trễ cả giây.
 *
 * Phát một tín hiệu MỨC -70 dB (tai không nghe được) để luồng không bao giờ "im
 * hoàn toàn". Chỉ khi trang ĐANG HIỆN — ẩn tab / thu nhỏ cửa sổ thì dừng, không
 * giữ máy thức vô cớ.
 */
let giuSong: ConstantSourceNode | null = null;
function batGiuSong(): void {
  const c = ctx;
  if (!c || !nhanh || giuSong || document.visibilityState !== 'visible' || !lay().bat) return;
  try {
    const src = c.createConstantSource();
    src.offset.value = 0.0003;
    src.connect(c.destination);
    src.start();
    giuSong = src;
  } catch { /* trình duyệt cũ không có ConstantSourceNode — bỏ qua */ }
}
function tatGiuSong(): void {
  try { giuSong?.stop(); giuSong?.disconnect(); } catch { /* đã dừng */ }
  giuSong = null;
}

/** Mở khoá (gọi trong một cú bấm/phím). */
export function moKhoa(): void {
  const c = layCtx();
  if (!c) return;
  if (c.state === 'suspended') void c.resume().then(capNhatDem);
  batGiuSong();
  void napBo();
}

/**
 * Phát một tiếng. `bat` trả về false nếu bị tắt/chưa sẵn — để bộ kiểm biết lý do.
 */
export function phat(t: TiengUi, opt: { boQuaTat?: boolean } = {}): boolean {
  const cd = lay();
  if (!opt.boQuaTat && (!cd.bat || (t === 'click' && !cd.bamNut))) return false;
  const c = layCtx();
  if (!c || !nhanh) return false;
  if (c.state === 'suspended') void c.resume();
  const buf = bo.get(t);
  if (!buf) { void napBo(); return false; }
  const bay = performance.now();
  if ((lanCuoi[t] ?? 0) > bay - 45 || dangPhat >= 6) return false;
  lanCuoi[t] = bay;
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = HE_SO[t] * cd.amLuong;
  src.connect(g).connect(nhanh);
  dangPhat += 1;
  src.onended = () => { dangPhat -= 1; src.disconnect(); g.disconnect(); };
  src.start();
  dem[t] = (dem[t] ?? 0) + 1;
  capNhatDem();
  return true;
}

// ─── Tự gắn vào giao diện ────────────────────────────────────────

const CHON_NUT = 'button, [role="button"], [role="menuitem"], [role="tab"], [role="option"], a[href], summary, label[for]';

function laCongTac(el: Element): HTMLInputElement | HTMLElement | null {
  const sw = el.closest('[role="switch"], input[type="checkbox"]');
  return sw as HTMLInputElement | HTMLElement | null;
}

function dangBat(el: HTMLInputElement | HTMLElement): boolean {
  if (el instanceof HTMLInputElement) return el.checked;
  return el.getAttribute('aria-checked') === 'true';
}

/**
 * Gắn MỘT lần cho cả trang. Trả về hàm gỡ.
 *  • pointerdown (capture): mở khoá + tiếng bấm — sớm nhất có thể nên "nhạy".
 *  • click: công tắc → bật/tắt (đọc trạng thái SAU khi nó đổi).
 *  • MutationObserver: hộp thoại xuất hiện/biến mất → mở/đóng; toast
 *    `[data-sonner-toast][data-type=success|error]` → xong/lỗi.
 */
export function ganTuDong(): () => void {
  if (typeof window === 'undefined') return () => {};

  const onDown = (e: PointerEvent): void => {
    moKhoa();
    if (e.button !== 0) return;
    const t = e.target as Element | null;
    if (!t || t.closest('[data-im]')) return;
    if (laCongTac(t)) return; // công tắc kêu tiếng riêng ở `click`
    const nut = t.closest(CHON_NUT);
    if (!nut || (nut as HTMLButtonElement).disabled || nut.getAttribute('aria-disabled') === 'true') return;
    phat('click');
  };
  const onKey = (): void => { moKhoa(); };
  const onHien = (): void => {
    if (document.visibilityState === 'visible') { if (ctx) batGiuSong(); } else tatGiuSong();
  };
  const onClick = (e: MouseEvent): void => {
    const t = e.target as Element | null;
    if (!t || t.closest('[data-im]')) return;
    const sw = laCongTac(t);
    if (!sw) return;
    // Trạng thái đổi trong cùng lượt sự kiện (React setState) — đọc ở microtask sau.
    queueMicrotask(() => requestAnimationFrame(() => phat(dangBat(sw) ? 'bat' : 'tat')));
  };

  /* ⚠️ RẺ là điều kiện sống còn: bộ theo dõi chạy cho MỌI thay đổi DOM của cả
     trang, kể cả lúc dựng 500 thẻ. Chỉ xét chính nút được thêm/gỡ và tối đa hai
     tầng con (toast của sonner là `li[data-sonner-toast]` thêm thẳng; hộp thoại
     portal là phần tử role=dialog hoặc bọc nó một-hai lớp) — KHÔNG quét sâu. */
  const HOP = '[role="dialog"], [role="alertdialog"]';
  const HOP_NONG = `:scope > :is(${HOP}), :scope > * > :is(${HOP})`;
  const coHop = (n: Element): boolean => n.matches(HOP) || !!n.querySelector(HOP_NONG);
  const daThay = new WeakSet<Element>();
  let soHop = document.querySelectorAll(HOP).length;
  const quan = new MutationObserver((ds) => {
    let doiHop = false;
    for (const d of ds) {
      for (const n of d.addedNodes) {
        if (!(n instanceof Element)) continue;
        if (n.matches('[data-sonner-toast]') && !daThay.has(n)) {
          daThay.add(n);
          const kieu = n.getAttribute('data-type');
          if (kieu === 'success') phat('xong');
          else if (kieu === 'error') phat('loi');
        }
        if (!doiHop && coHop(n)) doiHop = true;
      }
      for (const n of d.removedNodes) {
        if (!doiHop && n instanceof Element && coHop(n)) doiHop = true;
      }
    }
    if (!doiHop) return;
    const moi = document.querySelectorAll('[role="dialog"], [role="alertdialog"]').length;
    if (moi > soHop) phat('mo');
    else if (moi < soHop) phat('dong');
    soHop = moi;
  });
  quan.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('pointerdown', onDown, true);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('click', onClick, true);
  document.addEventListener('visibilitychange', onHien);
  capNhatDem();
  return () => {
    quan.disconnect();
    window.removeEventListener('pointerdown', onDown, true);
    window.removeEventListener('keydown', onKey, true);
    window.removeEventListener('click', onClick, true);
    document.removeEventListener('visibilitychange', onHien);
    tatGiuSong();
  };
}
