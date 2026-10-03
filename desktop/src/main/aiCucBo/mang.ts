/**
 * ============================================================
 * BIẾT CHẮC LÀ MẤT MẠNG — gõ cửa máy chủ thật, không tin một cờ
 * ============================================================
 *
 * Chủ app 03/10/2026: *"Khi không có mạng nó tự đổi sang AI ngoại tuyến và
 * giao diện của AI cũng đổi theo để user còn biết nó đã hoạt động rồi."*
 *
 * Tự đổi thì phải BIẾT CHẮC là mất mạng, mà hai cờ sẵn có đều nói dối:
 *
 *   • `navigator.onLine` chỉ nói "có card mạng đang bật". Cắm WiFi vào một
 *     router không ra được internet (rất hay gặp ở ký túc xá, quán cà phê chưa
 *     đăng nhập cổng) ⇒ nó vẫn báo online, và AI Code đứng chờ máy chủ tới hết
 *     hạn rồi mới báo lỗi.
 *   • `net.isOnline()` của Electron sát hơn, nhưng vẫn chỉ là phỏng đoán của
 *     Chromium về giao diện mạng — không biết máy chủ CỦA MÌNH có với tới không.
 *
 * Nên tệp này GÕ CỬA MÁY CHỦ: `GET /api/v1/system/health`, trần vài giây.
 *   • Có MỘT phản hồi HTTP bất kỳ ⇒ có mạng. 401/404 vẫn là "có mạng": máy
 *     chủ đã trả lời, chỉ là không thích câu hỏi.
 *   • Lỗi kết nối / quá hạn / 502-504 / 52x (Cloudflare không với tới gốc) ⇒
 *     một lần HỎNG.
 *
 * Trễ có chủ ý — HAI lần hỏng liên tiếp mới tuyên bố mất mạng, MỘT lần thành
 * công là có mạng lại. Mạng chập chờn một nhịp mà đã đổi cả giao diện sang
 * ngoại tuyến rồi lại đổi về là thứ làm người dùng mất tin vào cả hai màu.
 *
 * Tệp này THUẦN: không nạp `electron`, mọi thứ chạm thế giới đều được tiêm vào
 * (`goCua`, `coGiaoDien`, đồng hồ) — để vitest kiểm được mà không dựng Electron.
 */

export type KetQuaGoCua = 'song' | 'hong';

export interface TrangThaiMang {
  online: boolean;
  /** Lần gõ cửa gần nhất, ms epoch. `0` = chưa gõ lần nào. */
  luc: number;
  /** Vì sao đang nói như thế — cho log và cho dòng chú thích nhỏ trên giao diện. */
  lyDo: 'khoiDong' | 'mayChuTraLoi' | 'khongCoGiaoDien' | 'goCuaHong';
  /** Số lần gõ hỏng liên tiếp tính tới giờ — `> 0` khi `online` là "đang nghi". */
  hongLienTiep: number;
}

export interface TuyChonTheoDoi {
  /** Gõ cửa máy chủ một lần. KHÔNG được ném — ném coi như hỏng. */
  goCua: () => Promise<KetQuaGoCua>;
  /** Có card mạng nào đang lên không (`net.isOnline()`). Vắng = luôn có. */
  coGiaoDien?: () => boolean;
  /** Mỗi khi trạng thái ĐỔI (không phải mỗi lần gõ). */
  khiDoi?: (t: TrangThaiMang) => void;
  /** Nhịp gõ khi đang có mạng. 30 giây: đủ nhạy, và 2 lời gọi/phút/máy là rẻ. */
  nhipCoMangMs?: number;
  /** Nhịp gõ khi đang mất mạng — dày hơn để có mạng lại là biết sớm. */
  nhipMatMangMs?: number;
  /** Bao nhiêu lần hỏng LIÊN TIẾP mới tuyên bố mất mạng. */
  soLanHong?: number;
  datHen?: (fn: () => void, ms: number) => unknown;
  huyHen?: (h: unknown) => void;
}

export class TheoDoiMang {
  private tt: Omit<TrangThaiMang, 'hongLienTiep'> = { online: true, luc: 0, lyDo: 'khoiDong' };
  private hongLienTiep = 0;
  private hen: unknown = null;
  private dangGo: Promise<TrangThaiMang> | null = null;
  private daDung = false;
  private readonly o: Required<Omit<TuyChonTheoDoi, 'khiDoi'>> & Pick<TuyChonTheoDoi, 'khiDoi'>;

  constructor(o: TuyChonTheoDoi) {
    this.o = {
      coGiaoDien: () => true,
      nhipCoMangMs: 30_000,
      nhipMatMangMs: 5_000,
      soLanHong: 2,
      datHen: (fn, ms) => setTimeout(fn, ms),
      huyHen: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
      ...o,
    };
  }

  trangThai(): TrangThaiMang {
    return { ...this.tt, hongLienTiep: this.hongLienTiep };
  }

  /** Bắt đầu gõ theo nhịp. Gõ ngay một lần. */
  batDau(): void {
    this.daDung = false;
    void this.kiemNgay();
  }

  dung(): void {
    this.daDung = true;
    if (this.hen !== null) this.o.huyHen(this.hen);
    this.hen = null;
  }

  /**
   * Gõ cửa NGAY. Hai lời gọi chồng nhau dùng chung một lượt gõ — renderer
   * nhận `online` đổi rồi gọi, AI Code sắp gửi cũng gọi: một lần gõ là đủ.
   */
  kiemNgay(): Promise<TrangThaiMang> {
    if (this.dangGo) return this.dangGo;
    this.dangGo = this.goMotLan().finally(() => {
      this.dangGo = null;
      this.henLanSau();
    });
    return this.dangGo;
  }

  /**
   * Một lời gọi API vừa hỏng vì mạng (không phải vì máy chủ nói "không").
   * Đếm như một lần gõ hỏng và gõ lại ngay để xác nhận — không tự kết luận.
   */
  baoHong(): Promise<TrangThaiMang> {
    return this.kiemNgay();
  }

  private async goMotLan(): Promise<TrangThaiMang> {
    if (!this.o.coGiaoDien()) {
      /* Không có card mạng nào thì khỏi chờ quá hạn — chắc chắn mất. */
      this.hongLienTiep = this.o.soLanHong;
      this.datTrangThai(false, 'khongCoGiaoDien');
      return this.trangThai();
    }
    let kq: KetQuaGoCua;
    try {
      kq = await this.o.goCua();
    } catch {
      kq = 'hong';
    }
    if (kq === 'song') {
      this.hongLienTiep = 0;
      this.datTrangThai(true, 'mayChuTraLoi');
    } else {
      this.hongLienTiep += 1;
      if (this.hongLienTiep >= this.o.soLanHong) this.datTrangThai(false, 'goCuaHong');
      else this.tt = { ...this.tt, luc: Date.now() };
    }
    return this.trangThai();
  }

  private datTrangThai(online: boolean, lyDo: TrangThaiMang['lyDo']): void {
    const doi = online !== this.tt.online;
    this.tt = { online, luc: Date.now(), lyDo };
    if (doi) this.o.khiDoi?.(this.trangThai());
  }

  private henLanSau(): void {
    if (this.daDung) return;
    if (this.hen !== null) this.o.huyHen(this.hen);
    /* Vừa hỏng một lần mà chưa đủ để kết luận ⇒ gõ lại sau nhịp NGẮN, đừng
       để người dùng chờ 30 giây mới biết mạng đã đứt. */
    const ms = !this.tt.online || this.hongLienTiep > 0 ? this.o.nhipMatMangMs : this.o.nhipCoMangMs;
    this.hen = this.o.datHen(() => { this.hen = null; void this.kiemNgay(); }, ms);
  }
}

/** Mã HTTP coi như "máy chủ KHÔNG với tới được": cổng/proxy trả lời thay cho nó. */
const MA_KHONG_TOI = new Set([502, 503, 504, 520, 521, 522, 523, 524, 525, 526, 530]);

/**
 * Gõ cửa bằng `fetch` thật. Tách riêng để `TheoDoiMang` không biết gì về HTTP.
 *
 * `hanMs` 5 giây: máy chủ khoẻ trả lời trong ~0,2 giây (đo 03/10/2026), nên
 * quá 5 giây thì dù có "mạng" cũng không dùng nổi cho AI — người dùng sẽ ngồi
 * chờ từng mẩu chữ.
 */
export function taoGoCua(url: string, hanMs = 5000, fetchImpl: typeof fetch = fetch): () => Promise<KetQuaGoCua> {
  return async () => {
    try {
      const r = await fetchImpl(url, {
        method: 'GET',
        signal: AbortSignal.timeout(hanMs),
      });
      /* Rút cạn thân để socket được trả về pool — thân treo là kết nối treo. */
      await r.arrayBuffer().catch(() => {});
      return MA_KHONG_TOI.has(r.status) ? 'hong' : 'song';
    } catch {
      return 'hong';
    }
  };
}

// ─── Một bộ theo dõi dùng chung cho cả app ──────────────────────────

let chung: TheoDoiMang | null = null;

export function datTheoDoiMang(t: TheoDoiMang): void {
  chung?.dung();
  chung = t;
}

/** Bộ theo dõi đang chạy. `null` trong vitest / trước khi app dựng xong. */
export function theoDoiMang(): TheoDoiMang | null {
  return chung;
}

/**
 * Lúc này có nên coi là MẤT MẠNG không — hỏi lại ngay nếu kết quả cũ quá
 * `cuNhatMs`. Chưa có bộ theo dõi ⇒ coi như CÓ mạng (ranh giới 1: nghi ngờ
 * thì đi máy chủ, máy chủ hỏng sẽ tự báo).
 */
export async function dangMatMang(cuNhatMs = 10_000): Promise<boolean> {
  const t = chung;
  if (!t) return false;
  const tt = t.trangThai();
  if (Date.now() - tt.luc <= cuNhatMs && tt.hongLienTiep === 0) return !tt.online;
  /* Đang "nghi" (đã hỏng một lần) hoặc kết quả cũ ⇒ gõ tới khi kết luận được:
     tối đa hai lần, mỗi lần trần 5 giây. Gửi một câu hỏi cho AI Code mà phải
     chờ 30 giây máy chủ quá hạn mới rơi xuống ngoại tuyến là tệ hơn 10 giây này. */
  let moi = await t.kiemNgay();
  if (moi.online && moi.hongLienTiep > 0) moi = await t.kiemNgay();
  return !moi.online;
}
