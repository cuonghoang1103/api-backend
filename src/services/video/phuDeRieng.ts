/**
 * PHỤ ĐỀ CỦA VIDEO RIÊNG — phần THUẦN (không chạm CSDL), để test được.
 *
 * Hai nguồn phụ đề sống song song:
 *   • `LessonTranscript` — phụ đề YouTube (tiếng Anh), cues `{ t, en }`, đi
 *     cùng track YT. App iOS đọc bảng này.
 *   • `LessonOwnTranscript` — phụ đề video RIÊNG của khoá (tiếng Việt, R2),
 *     cues `{ t, vi }` + `parts` (các cảnh thật lúc dựng video), đi cùng track
 *     VI (hoặc EN khi có bản ghi tiếng Anh tự quay).
 *
 * ⚠️ MỐC CỦA NGUỒN NÀY KHÔNG DÙNG ĐƯỢC CHO VIDEO KIA. Hai video của cùng một
 * bài là hai bản ghi khác nhau, dài khác nhau — đem phụ đề YouTube cho người
 * đang xem video tiếng Việt là mỗi nút `[mm:ss]` tua tới một chỗ không liên
 * quan. Nên `chonNguonPhuDe` KHÔNG BAO GIỜ lùi chéo: track VI mà chưa có phụ
 * đề riêng thì trả `null` (gia sư chuyển sang lời dặn "chưa có phụ đề").
 */

export type TrackVideo = 'VI' | 'EN' | 'YT';

/** Một câu phụ đề, chấp nhận cả hai khuôn: YouTube `{t, en}` và video riêng `{t, vi}`. */
export type CauBatKy = { t: number; en?: string; vi?: string; text?: string };

/** Một phần (cảnh) của video riêng — mốc lấy từ lúc dựng, không phải model đoán. */
export type PhanVideo = { t: number; den?: number; ten: string };

/** Nhận 'VI'/'vi'/'VN'/'EN'/'YT'; còn lại ⇒ `undefined` (= hành vi cũ: YouTube). */
export function chuanTrack(v: unknown): TrackVideo | undefined {
  const s = String(v ?? '').trim().toUpperCase();
  if (s === 'VI' || s === 'VN') return 'VI';
  if (s === 'EN') return 'EN';
  if (s === 'YT') return 'YT';
  return undefined;
}

/** Track nào đọc phụ đề RIÊNG (video R2 tự dựng). YT/không truyền ⇒ phụ đề YouTube như cũ. */
export function laTrackRieng(track: TrackVideo | undefined): track is 'VI' | 'EN' {
  return track === 'VI' || track === 'EN';
}

/** Chữ của một câu, bất kể khuôn nào. */
export function chuCau(c: CauBatKy | null | undefined): string {
  if (!c) return '';
  return String(c.vi ?? c.en ?? c.text ?? '').trim();
}

/**
 * Chọn nguồn phụ đề cho gia sư / phòng video.
 *
 * `rieng` chỉ được dùng khi URL nó được sinh ra KHỚP URL video đang gắn ở
 * track đó — lệch nghĩa là video đã bị thay (dựng lại, đổi mã băm) mà phụ đề
 * chưa sinh lại, và mốc của nó sẽ trỏ sai chỗ.
 */
export function chonNguonPhuDe<R extends { videoUrl: string }, Y>(
  track: TrackVideo | undefined,
  rieng: R | null | undefined,
  urlTrackHienTai: string | null | undefined,
  youtube: Y | null | undefined,
): { loai: 'rieng'; du: R } | { loai: 'youtube'; du: Y } | null {
  if (laTrackRieng(track)) {
    if (rieng && urlTrackHienTai && rieng.videoUrl === urlTrackHienTai) return { loai: 'rieng', du: rieng };
    return null; // KHÔNG lùi về phụ đề YouTube — xem chú thích đầu tệp.
  }
  return youtube ? { loai: 'youtube', du: youtube } : null;
}

/** Khoá cache chip theo track: câu "Tóm tắt video" của video YouTube và của
 *  video tiếng Việt là hai câu trả lời KHÁC NHAU cho cùng một bài. */
export function khoaCacheTheoTrack(cacheKey: string, track: TrackVideo | undefined, phongVideo?: boolean): string {
  if (!phongVideo || !laTrackRieng(track)) return cacheKey;
  return `${cacheKey}@${track.toLowerCase()}`;
}

export const moc = (g: number): string =>
  `${Math.floor(g / 60)}:${String(Math.floor(g % 60)).padStart(2, '0')}`;

/** Đọc mảng parts từ JSON tuỳ ý — bỏ phần tử hỏng thay vì ném. */
export function docPhan(v: unknown): PhanVideo[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((p): p is PhanVideo => !!p && typeof p === 'object'
      && Number.isFinite(Number((p as PhanVideo).t)) && typeof (p as PhanVideo).ten === 'string')
    .map((p) => ({ t: Number(p.t), ...(Number.isFinite(Number(p.den)) ? { den: Number(p.den) } : {}), ten: p.ten.trim() }))
    .sort((a, b) => a.t - b.t);
}

/** Đoạn video người học CHỌN để hỏi ("Hỏi phần này" ở mục lục, "Hỏi đoạn đang xem"). Giây, `den` > `tu`. */
export type DoanHoi = { tu: number; den: number; ten?: string };

/** Trần một đoạn được hỏi: chương dài nhất ~4 phút ≈ 50 câu ≈ 4.000 ký tự — 8.000 là đủ rộng mà không mở cửa nhét cả video. */
export const TRAN_DOAN_HOI_GIAY = 600;

/**
 * Đọc `doan` từ body request — KHÔNG tin client: số hữu hạn, không âm, `den` > `tu`, dài tối đa 10 phút, tên ≤ 120 ký
 * tự. Hỏng ⇒ `undefined` (hỏi như thường), không ném: một tham số phụ sai không được làm chết câu hỏi.
 */
export function docDoanHoi(v: unknown): DoanHoi | undefined {
  if (!v || typeof v !== 'object') return undefined;
  const o = v as Record<string, unknown>;
  const tu = Number(o.tu);
  const den = Number(o.den);
  if (!Number.isFinite(tu) || !Number.isFinite(den) || tu < 0 || den <= tu) return undefined;
  const ten = typeof o.ten === 'string' ? o.ten.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  return {
    tu: Math.round(tu * 10) / 10,
    den: Math.round(Math.min(den, tu + TRAN_DOAN_HOI_GIAY) * 10) / 10,
    ...(ten ? { ten } : {}),
  };
}

/** Khoá cache chip của MỘT đoạn — gắn mốc vào khoá để đoạn khác nhau không bao giờ trùng câu trả lời (≤ 40 ký tự). */
export function khoaCacheDoan(kieu: string, d: DoanHoi): string {
  return `${kieu}@${Math.round(d.tu)}-${Math.round(d.den)}`.slice(0, 40);
}

/**
 * Rút gọn phụ đề cho VỪA trần mà vẫn PHỦ CẢ VIDEO.
 *
 * Bản cũ cắt cụt ở ký tự thứ `tran` — video 25 phút thì gia sư chỉ "nghe" được 12 phút đầu, và câu "phút 20 nói gì"
 * nhận về một câu trả lời bịa từ nội dung bài. Nay giữ 1/k câu (k = 2, 3, …) RẢI ĐỀU cả video cho tới khi vừa; đoạn
 * người học đang xem/đang hỏi vẫn có ĐẦY ĐỦ ở khối riêng nên không mất gì ở chỗ cần nhất.
 */
export function rutGonPhuDe(dong: string[], tran: number): { text: string; buoc: number } {
  const du = dong.join('\n');
  if (du.length <= tran) return { text: du, buoc: 1 };
  for (let k = 2; k <= 40; k++) {
    const chon = dong.filter((_, i) => i % k === 0);
    const t = chon.join('\n');
    if (t.length <= tran) return { text: t, buoc: k };
  }
  const k = 40;
  return { text: dong.filter((_, i) => i % k === 0).join('\n').slice(0, tran), buoc: k };
}

/**
 * Dựng khối PHỤ ĐỀ đưa vào ngữ cảnh gia sư.
 *
 * Ba phần: (1) ĐOẠN NGƯỜI HỌC HỎI — khi họ bấm "Hỏi phần này" / "Hỏi đoạn đang xem", đủ từng câu kèm mốc; không có
 * thì một cửa sổ quanh chỗ đang xem; (2) danh sách CÁC PHẦN (mục lục video riêng); (3) phụ đề toàn video, rút gọn đều
 * khi dài (xem `rutGonPhuDe`) để biết mạch chung.
 */
export function dungKhoiPhuDe(input: {
  cues: CauBatKy[];
  soCau?: number;
  giay?: number;
  /** Đoạn người học chọn để hỏi — thắng `giay`. */
  doan?: DoanHoi;
  parts?: PhanVideo[];
  banKinhGiay: number;
  tran: number;
  /** true ⇒ lời giảng tiếng Việt (video riêng). */
  tiengViet?: boolean;
}): string {
  const cues = input.cues.filter((c) => c && Number.isFinite(Number(c.t)) && chuCau(c));
  if (!cues.length) return '';
  const dong = (c: CauBatKy) => `[${moc(Number(c.t))}] ${chuCau(c)}`;

  let ra = '';
  const parts = input.parts ?? [];
  if (parts.length) {
    const het = (i: number) => parts[i].den ?? parts[i + 1]?.t;
    ra += `\n\nCÁC PHẦN CỦA VIDEO (${parts.length} phần — mục lục học viên đang thấy dưới video, mốc CHÍNH XÁC tới câu):\n`
        + parts.map((p, i) => {
          const d = het(i);
          return `- [${moc(p.t)}${d != null ? ` - ${moc(d)}` : ''}] ${p.ten}`;
        }).join('\n');
  }

  const doan = input.doan;
  const giay = input.giay;
  if (doan) {
    /* Câu nằm trong đoạn, cộng câu ngay trước mốc đầu (câu đang nói dở lúc đoạn bắt đầu). */
    const iDau = cues.findIndex((c) => Number(c.t) >= doan.tu);
    const tu = iDau > 0 && Number(cues[iDau].t) - doan.tu > 1 ? iDau - 1 : Math.max(0, iDau);
    const trong = iDau < 0 ? [] : cues.slice(tu).filter((c) => Number(c.t) < doan.den);
    if (trong.length) {
      const nhan = doan.ten ? `"${doan.ten}", ` : '';
      const chu = trong.map(dong).join('\n');
      ra += `\n\nĐOẠN NGƯỜI HỌC ĐANG HỎI (${nhan}[${moc(doan.tu)} - ${moc(doan.den)}] — đủ từng câu):\n`
          + (chu.length > 8000 ? chu.slice(0, 8000) + '\n…' : chu);
    }
  } else if (typeof giay === 'number' && giay >= 0) {
    const gan = cues.filter((c) => Math.abs(Number(c.t) - giay) <= input.banKinhGiay);
    if (gan.length) {
      ra += `\n\nĐOẠN NGƯỜI HỌC ĐANG XEM (quanh mốc ${moc(giay)}):\n` + gan.map(dong).join('\n');
    }
  }

  const conLai = Math.max(2000, input.tran - ra.length);
  const { text, buoc } = rutGonPhuDe(cues.map(dong), conLai);
  ra += `\n\nPHỤ ĐỀ TOÀN VIDEO${input.tiengViet ? ' (lời giảng tiếng Việt)' : ''} (${input.soCau ?? cues.length} câu`
      + (buoc > 1 ? `, rút gọn: giữ 1/${buoc} câu rải đều cả video` : '') + `):\n`
      + text;
  return ra;
}
