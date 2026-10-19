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

/**
 * Dựng khối PHỤ ĐỀ đưa vào ngữ cảnh gia sư.
 *
 * Hai phần: một cửa sổ quanh chỗ đang xem (đầy đủ, để "giải thích đoạn này"
 * trúng đích) và phần còn lại của bài (rút gọn, để biết mạch chung). Video
 * riêng có thêm khối CÁC PHẦN — danh sách cảnh thật, gia sư phải dùng y nguyên.
 */
export function dungKhoiPhuDe(input: {
  cues: CauBatKy[];
  soCau?: number;
  giay?: number;
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
    ra += `\n\nCÁC PHẦN CỦA VIDEO (${parts.length} phần — lấy từ chính kịch bản dựng video, mốc CHÍNH XÁC):\n`
        + parts.map((p, i) => {
          const d = het(i);
          return `- [${moc(p.t)}${d != null ? ` - ${moc(d)}` : ''}] ${p.ten}`;
        }).join('\n');
  }

  const giay = input.giay;
  if (typeof giay === 'number' && giay >= 0) {
    const gan = cues.filter((c) => Math.abs(Number(c.t) - giay) <= input.banKinhGiay);
    if (gan.length) {
      ra += `\n\nĐOẠN NGƯỜI HỌC ĐANG XEM (quanh mốc ${moc(giay)}):\n` + gan.map(dong).join('\n');
    }
  }

  const toanBai = cues.map(dong).join('\n');
  const conLai = Math.max(2000, input.tran - ra.length);
  ra += `\n\nPHỤ ĐỀ TOÀN VIDEO${input.tiengViet ? ' (lời giảng tiếng Việt)' : ''} (${input.soCau ?? cues.length} câu`
      + (toanBai.length > conLai ? ', đã cắt bớt' : '') + `):\n`
      + (toanBai.length > conLai ? toanBai.slice(0, conLai) + '\n…' : toanBai);
  return ra;
}
