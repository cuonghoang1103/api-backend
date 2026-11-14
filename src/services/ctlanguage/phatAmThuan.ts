/**
 * CT Language — LUYỆN PHÁT ÂM (15/11/2026): phần THUẦN — đọc đầu vào, gắn THANH ĐIỆU (tiếng Trung) vào từng chữ, sinh gợi ý
 * sửa bằng tiếng Việt từ điểm Azure. Không gọi mạng, không CSDL.
 *
 *   npx tsx --test src/services/ctlanguage/phatAmThuan.test.ts
 *
 * Gợi ý là LUẬT TĨNH (không gọi LLM): mỗi lượt chấm đã tốn giây Azure; thêm một lời gọi model chỉ để viết 2–3 câu nhắc
 * "âm /θ/ đặt lưỡi giữa răng" là trả tiền cho thứ bảng luật làm được ngay, đúng và giống nhau mọi lần.
 *
 * Thanh điệu: Azure Pronunciation Assessment KHÔNG có ErrorType riêng cho thanh. Có hai nguồn:
 *   1. Tên âm/âm tiết Azure trả kèm số thanh ("xue2", "i 3") ⇒ đọc ra thanh đúng của chữ.
 *   2. Không có ⇒ lấy từ pinyin app gửi kèm (`doc`, có dấu hoặc số).
 * Rồi: chữ điểm thấp ⇒ "có thể sai thanh" + mô tả thanh đúng — nói rõ là CÓ THỂ, vì điểm thấp còn do phụ âm / vận.
 */

export type NnPhatAm = 'en' | 'ja' | 'zh';

export interface AmCham { am: string; diem: number }
export interface AmTietCham { amTiet: string; diem: number }
export interface TuCham { tu: string; diem: number; loi: string; am: AmCham[]; amTiet: AmTietCham[] }
export interface KetQuaCham {
  diem: { chinhXac: number; troiChay: number; dayDu: number; tong: number; ngonDieu: number | null };
  ngheRa: string;
  tu: TuCham[];
}

/** Một chữ Hán đã gắn thanh (tiếng Trung). `nghiNgoThanh` = điểm thấp ⇒ nên nghe lại thanh. */
export interface ChuThanh { chu: string; pinyin: string | null; thanh: number | null; diem: number; nghiNgoThanh: boolean }

export const NGUONG_TOT = 80;
export const NGUONG_YEU = 60;

export function docNnPhatAm(v: unknown): NnPhatAm | null {
  return v === 'en' || v === 'ja' || v === 'zh' ? v : null;
}

/** en: 'us' (mặc định — có tên âm IPA) | 'uk'. Nhật/Trung bỏ qua. */
export function giongAzure(nn: NnPhatAm, giong: unknown): 'us' | 'uk' | 'ja' | 'zh' {
  if (nn === 'ja' || nn === 'zh') return nn;
  return giong === 'uk' ? 'uk' : 'us';
}

// ─── Pinyin ⇒ thanh ────────────────────────────────────────────────────────────────────────────────────────────────

const DAU: Record<string, number> = {};
for (const [t, chu] of [[1, 'āēīōūǖĀĒĪŌŪǕ'], [2, 'áéíóúǘÁÉÍÓÚǗ'], [3, 'ǎěǐǒǔǚǍĚǏǑǓǙ'], [4, 'àèìòùǜÀÈÌÒÙǛ']] as const) {
  for (const c of chu) DAU[c] = t;
}

/** Thanh của MỘT âm tiết pinyin: dấu (xué ⇒ 2) hoặc số cuối (xue2 ⇒ 2); không dấu ⇒ 5 (thanh nhẹ); không phải pinyin ⇒ null. */
export function thanhAmTiet(s: string): number | null {
  const t = s.trim();
  if (!t) return null;
  const so = /([1-5])\s*$/.exec(t);
  if (so) return Number(so[1]);
  for (const c of t) if (DAU[c]) return DAU[c];
  return /^[a-zA-ZüÜv:]+$/.test(t) ? 5 : null;
}

const NGUYEN_AM = 'aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ';
/**
 * Một âm tiết pinyin: phụ âm đầu? + nguyên âm + (ng|n|r)? + số thanh?. Phần đuôi -n/-ng chỉ nhận khi KHÔNG có nguyên âm
 * theo sau (regex tự lùi) ⇒ "dàngāo" ⇒ dàn + gāo, "xiànzài" ⇒ xiàn + zài, "péngyou" ⇒ péng + you.
 */
const AM_TIET = new RegExp(`(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?[${NGUYEN_AM}]+(?:ng|n|r)?(?![${NGUYEN_AM}])[1-5]?`, 'giu');

/** Tách pinyin của cả câu thành âm tiết (có dấu hoặc số; viết liền theo từ cũng tách được). */
export function tachAmTietPinyin(doc: string): string[] {
  return doc.normalize('NFC').toLowerCase().match(AM_TIET) ?? [];
}

const LA_HAN = /\p{Script=Han}/u;

/** Mô tả thanh bằng tiếng Việt (so với thanh tiếng Việt cho người Việt dễ hình dung). */
export function moTaThanh(t: number): string {
  switch (t) {
    case 1: return 'thanh 1 — ngang, cao và giữ đều (như thanh ngang nhưng cao hơn)';
    case 2: return 'thanh 2 — đi lên từ giữa lên cao (gần dấu sắc)';
    case 3: return 'thanh 3 — xuống thấp rồi hơi lên (gần dấu hỏi); đứng trước thanh 3 khác thì đọc thành thanh 2';
    case 4: return 'thanh 4 — rơi mạnh từ cao xuống thấp, dứt khoát (gần dấu huyền nhưng nhanh và gắt)';
    default: return 'thanh nhẹ — đọc ngắn, nhẹ, không nhấn';
  }
}

/**
 * Gắn thanh vào từng CHỮ Hán theo thứ tự (Azure tách câu tiếng Trung thành TỪ — "学习" một từ hai chữ). Thanh lấy từ tên
 * âm tiết/âm Azure trả nếu có số thanh, không thì từ pinyin `doc`. Pinyin lệch số chữ ⇒ không gắn (thà không nói còn hơn
 * nói sai thanh).
 */
export function ganThanh(tu: TuCham[], doc?: string | null): ChuThanh[] {
  const that = tu.filter((w) => w.loi !== 'Insertion');
  const chu: { chu: string; diem: number; azThanh: number | null; pinyinAz: string | null }[] = [];
  for (const w of that) {
    const ds = [...w.tu].filter((c) => LA_HAN.test(c));
    ds.forEach((c, i) => {
      // Âm tiết Azure (nếu số âm tiết khớp số chữ) — điểm riêng từng chữ + có thể kèm số thanh.
      const at = w.amTiet.length === ds.length ? w.amTiet[i] : undefined;
      const az = at ? thanhSo(at.amTiet) : ds.length === 1 ? thanhTuAm(w.am) : null;
      chu.push({ chu: c, diem: at?.diem ?? w.diem, azThanh: az, pinyinAz: at && /[a-z]/i.test(at.amTiet) ? at.amTiet : null });
    });
  }
  const amTiet = doc ? tachAmTietPinyin(doc) : [];
  const khop = amTiet.length === chu.length;
  return chu.map((c, i) => {
    const py = khop ? amTiet[i] : c.pinyinAz;
    const thanh = c.azThanh ?? (py ? thanhAmTiet(py) : null);
    return { chu: c.chu, pinyin: py ?? null, thanh, diem: c.diem, nghiNgoThanh: c.diem < NGUONG_YEU };
  });
}

/** Chỉ nhận số thanh (Azure "xue2" / "ue 2"); chữ không có số ⇒ null — dấu thanh không phải thứ Azure trả. */
function thanhSo(s: string): number | null {
  const m = /([1-5])\s*$/.exec(s.trim());
  return m ? Number(m[1]) : null;
}

function thanhTuAm(am: AmCham[]): number | null {
  for (let i = am.length - 1; i >= 0; i--) { const t = thanhSo(am[i].am); if (t) return t; }
  return null;
}

// ─── Gợi ý sửa (tiếng Việt) ───────────────────────────────────────────────────────────────────────────────────────

/** Âm IPA (en-US) ⇒ mẹo cho người Việt. Khoá là tên âm Azure trả (IPA). */
const MEO_AM_EN: Record<string, string> = {
  'θ': 'Âm /θ/ (th trong "think"): đặt đầu lưỡi giữa hai hàm răng rồi thổi hơi ra — đừng đọc thành /t/ hay /s/.',
  'ð': 'Âm /ð/ (th trong "this"): lưỡi giữa hai răng như /θ/ nhưng RUNG cổ họng — không phải /d/ hay /z/.',
  'ʃ': 'Âm /ʃ/ (sh): tròn môi, lưỡi lùi sau hơn /s/, hơi thoát ra như "suỵt".',
  'ʒ': 'Âm /ʒ/ (trong "measure"): khẩu hình như /ʃ/ nhưng có rung — không đọc thành /z/ hay "gi".',
  'tʃ': 'Âm /tʃ/ (ch trong "chair"): bật hơi mạnh, tròn môi — khác "ch" tiếng Việt (không tròn môi).',
  'dʒ': 'Âm /dʒ/ (j trong "job"): như /tʃ/ nhưng rung — đừng đọc thành "d" hay "gi" tiếng Việt.',
  'ɹ': 'Âm /r/: cong lưỡi lên, KHÔNG chạm vòm miệng và không rung lưỡi như "r" tiếng Việt; không đọc thành /z/.',
  'r': 'Âm /r/: cong lưỡi lên, KHÔNG chạm vòm miệng và không rung lưỡi như "r" tiếng Việt; không đọc thành /z/.',
  'v': 'Âm /v/: răng trên chạm nhẹ môi dưới rồi rung — đừng mím hai môi thành /b/ hay bỏ hẳn.',
  'z': 'Âm /z/: như /s/ nhưng rung cổ họng (đặt tay lên cổ thấy rung) — đuôi "-s" của "reads", "dogs" là /z/.',
  'iː': 'Âm /iː/ (trong "sheep"): kéo dài, căng môi như cười; khác /ɪ/ ngắn trong "ship".',
  'ɪ': 'Âm /ɪ/ (trong "ship"): NGẮN và lỏng, giữa "i" và "ê" — đừng kéo dài thành /iː/.',
  'æ': 'Âm /æ/ (trong "cat"): mở miệng rộng, hạ hàm, giữa "a" và "e" — không phải "e" tiếng Việt.',
  'ə': 'Âm /ə/ (schwa): âm "ơ" rất nhẹ, ngắn, không nhấn — đa số âm tiết không trọng âm đọc như vậy.',
  'ʌ': 'Âm /ʌ/ (trong "cup"): "ă" ngắn, miệng mở vừa — không tròn môi thành "o".',
  'ɜː': 'Âm /ɜː/ (trong "bird"): "ơ" dài, lưỡi giữa miệng (giọng Mỹ thêm cong lưỡi /ɝ/).',
  'ɝ': 'Âm /ɝ/ (trong "bird", giọng Mỹ): "ơ" dài kèm cong lưỡi như /r/.',
  'ɔ': 'Âm /ɔ/: tròn môi, mở miệng vừa, giữ hơi lâu hơn "o" tiếng Việt.',
  'ʊ': 'Âm /ʊ/ (trong "book"): "u" ngắn, môi tròn lỏng; khác /uː/ dài trong "food".',
  'uː': 'Âm /uː/ (trong "food"): "u" dài, môi tròn chu ra.',
  'eɪ': 'Nguyên âm đôi /eɪ/ (trong "day"): trượt từ "ê" sang "i" — đừng chỉ đọc "ê".',
  'aɪ': 'Nguyên âm đôi /aɪ/ (trong "my"): trượt từ "a" sang "i" rõ ràng.',
  'oʊ': 'Nguyên âm đôi /oʊ/ (trong "go"): trượt từ "ô" sang "u", tròn môi dần — đừng chỉ đọc "ô".',
  'aʊ': 'Nguyên âm đôi /aʊ/ (trong "now"): trượt từ "a" sang "u".',
  'l': 'Âm /l/ cuối từ (trong "feel"): đầu lưỡi chạm lợi trên và giữ — đừng bỏ hay đọc thành "u".',
  'ŋ': 'Âm /ŋ/ (ng): cuống lưỡi chạm vòm mềm, không bật thêm /g/ phía sau.',
  'n': 'Âm /n/: đầu lưỡi chạm lợi trên; ở cuối từ phải đọc rõ, không nuốt.',
  'h': 'Âm /h/: chỉ là hơi thở ra nhẹ — không đọc nặng như "h" khàn.',
  'w': 'Âm /w/: chu tròn môi rồi mở ra nhanh (như "qu" tiếng Việt) — không đọc thành /v/.',
  'j': 'Âm /j/ (y trong "yes"): như "d" miền Nam — không đọc thành "gi".',
};
const PHU_AM_CUOI_EN = new Set(['t', 'd', 'k', 'ɡ', 'g', 'p', 'b', 's', 'z', 'ʃ', 'tʃ', 'dʒ', 'v', 'f', 'θ', 'ð', 'l', 'n', 'm', 'ŋ', 'ʒ']);

export function goiYPhatAm(nn: NnPhatAm, kq: KetQuaCham, chuThanh: ChuThanh[] = []): string[] {
  const goiY: string[] = [];
  const that = kq.tu.filter((w) => w.loi !== 'Insertion');
  const thieu = kq.tu.filter((w) => w.loi === 'Omission').map((w) => w.tu);
  const thua = kq.tu.filter((w) => w.loi === 'Insertion').map((w) => w.tu);
  if (thieu.length) goiY.push(`Bạn đọc thiếu: ${thieu.slice(0, 4).map((t) => `“${t}”`).join(', ')}. Đọc đủ cả câu mẫu nhé.`);
  if (thua.length) goiY.push(`Có chữ đọc thừa (${thua.slice(0, 3).map((t) => `“${t}”`).join(', ')}) — đọc đúng theo câu mẫu.`);

  if (nn === 'en') {
    // Âm yếu nhất (có tên) ⇒ mẹo riêng cho âm đó; tối đa 2 âm khác nhau.
    const yeu = that.flatMap((w) => w.am.map((a, i) => ({ ...a, tu: w.tu, cuoi: i === w.am.length - 1 && w.am.length > 1 })))
      .filter((a) => a.am && a.diem < NGUONG_YEU).sort((a, b) => a.diem - b.diem);
    const daNoi = new Set<string>();
    for (const a of yeu) {
      if (daNoi.size >= 2) break;
      if (a.cuoi && PHU_AM_CUOI_EN.has(a.am) && !daNoi.has('cuoi')) {
        daNoi.add('cuoi');
        goiY.push(`Âm cuối /${a.am}/ trong “${a.tu}” gần như mất (${a.diem} điểm). Người Việt hay nuốt âm cuối — đọc rõ trọn âm cuối rồi mới sang từ sau.`);
        continue;
      }
      const meo = MEO_AM_EN[a.am];
      if (meo && !daNoi.has(a.am)) { daNoi.add(a.am); goiY.push(`${meo} (trong “${a.tu}”: ${a.diem} điểm)`); }
    }
    if (!daNoi.size) {
      const w = that.filter((x) => x.loi !== 'Omission' && x.diem < NGUONG_YEU).sort((a, b) => a.diem - b.diem)[0];
      if (w) goiY.push(`Từ “${w.tu}” còn chưa chuẩn (${w.diem} điểm). Bấm nghe mẫu, chú ý trọng âm và âm cuối của từ đó rồi đọc lại.`);
    }
    if (kq.diem.ngonDieu != null && kq.diem.ngonDieu < NGUONG_YEU) {
      goiY.push('Ngữ điệu còn đều đều: nhấn mạnh từ mang nghĩa chính, lướt nhẹ các từ nhỏ (a, the, to…), câu kể hạ giọng ở cuối.');
    }
  } else if (nn === 'zh') {
    const sai = chuThanh.filter((c) => c.nghiNgoThanh).sort((a, b) => a.diem - b.diem).slice(0, 3);
    for (const c of sai) {
      goiY.push(c.thanh
        ? `“${c.chu}”${c.pinyin ? ` (${c.pinyin})` : ''} chỉ đạt ${c.diem} điểm — có thể sai thanh điệu. Chữ này là ${moTaThanh(c.thanh)}.`
        : `“${c.chu}” chỉ đạt ${c.diem} điểm — nghe lại mẫu, chú ý thanh điệu và vận mẫu của chữ này.`);
    }
    const py = sai.map((c) => c.pinyin ?? '').join(' ').toLowerCase();
    if (/\b(zh|ch|sh|r)/.test(py)) goiY.push('zh / ch / sh / r là âm uốn lưỡi: cong đầu lưỡi lên chạm sau lợi trên — khác z / c / s (lưỡi thẳng chạm răng).');
    if (/[üǖǘǚǜ]|\b[jqxy]u/.test(py)) goiY.push('Âm ü (ju, qu, xu, yu): giữ lưỡi như đọc "i" rồi tròn môi lại — không đọc thành "u".');
    if (/\b[jqx]/.test(py)) goiY.push('j / q / x: mặt lưỡi áp vòm cứng, môi dẹt; q bật hơi mạnh — đừng đọc như "ch", "s" tiếng Việt.');
  } else {
    const w = that.filter((x) => x.loi !== 'Omission' && x.diem < NGUONG_YEU).sort((a, b) => a.diem - b.diem).slice(0, 2);
    for (const x of w) {
      const m: string[] = [];
      if (/[ーうぅ]|[おこそとのほもよろごぞどぼぽ]う|[えけせてねへめれげぜでべぺ]い/.test(x.tu)) m.push('trường âm phải kéo dài gấp đôi');
      if (/[っッ]/.test(x.tu)) m.push('っ là một nhịp NGẮT — dừng hẳn một nhịp trước phụ âm sau');
      if (/[んン]/.test(x.tu)) m.push('ん đủ một nhịp riêng, không nuốt');
      if (/[らりるれろラリルレロ]/.test(x.tu)) m.push('âm r tiếng Nhật: chạm nhẹ đầu lưỡi một lần (giữa "r" và "l")');
      if (/[つツ]/.test(x.tu)) m.push('つ đọc "tsư", không phải "chư"');
      if (/[ふフ]/.test(x.tu)) m.push('ふ thổi hơi nhẹ qua hai môi, giữa "f" và "h"');
      goiY.push(`“${x.tu}” còn chưa chuẩn (${x.diem} điểm)` + (m.length ? `: ${m.join('; ')}.` : '. Nghe lại mẫu, đọc đủ số nhịp (mỗi kana một nhịp đều nhau).'));
    }
  }

  if (kq.diem.troiChay < NGUONG_YEU && that.length > 2) goiY.push('Đọc còn ngắt quãng: đọc chậm mà đều, liền mạch cả cụm, đừng dừng giữa các từ.');
  if (!goiY.length) {
    goiY.push(kq.diem.tong >= NGUONG_TOT ? 'Phát âm tốt! Thử đọc nhanh hơn một chút cho tự nhiên.' : 'Gần đúng rồi — nghe lại mẫu một lần nữa rồi đọc lại cho tròn từng âm.');
  }
  return goiY.slice(0, 5);
}
