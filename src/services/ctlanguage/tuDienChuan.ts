/**
 * CT Language — chuẩn hoá chữ cho TỪ ĐIỂN. Hàm THUẦN, dùng chung cho script nhập (`scripts/ctlanguage/nhap-tu-dien.mts`)
 * và API tra (`tuDien.ts`): khoá lưu và khoá tra PHẢI chuẩn hoá cùng một cách, lệch một chỗ là tra không ra.
 */

/** Khoá tra: chữ thường, bỏ dấu (cả dấu thanh pinyin lẫn dấu tiếng Việt), đ→d, katakana→hiragana, bỏ khoảng trắng
 *  và dấu câu. Giữ chữ Hán/kana nguyên dạng. */
export function khoaTra(s: string): string {
  // ü (kể cả ǖǘǚǜ) → v TRƯỚC khi bỏ dấu — kiểu gõ pinyin quen thuộc (lv = lǜ); bỏ dấu trước thì ra u, lẫn với lu.
  const nfkc = s.normalize('NFKC').toLowerCase().replace(/[üǖǘǚǜ]/g, 'v');
  let ra = '';
  for (const ch of nfkc.normalize('NFD')) {
    const c = ch.codePointAt(0)!;
    if (c >= 0x300 && c <= 0x36f) continue; // dấu kết hợp
    if (ch === 'đ') { ra += 'd'; continue; }
    // Katakana → hiragana (ァ U+30A1 … ヶ U+30F6).
    if (c >= 0x30a1 && c <= 0x30f6) { ra += String.fromCodePoint(c - 0x60); continue; }
    // Giữ dấu đục/bán đục của kana (U+3099/309A — là dấu kết hợp, không phải chữ cái) để NFC gộp lại.
    if (c === 0x3099 || c === 0x309a || /[\p{L}\p{N}ー]/u.test(ch)) ra += ch;
  }
  // NFD tách dakuten của kana (が → か + ゙) — gộp lại.
  return ra.normalize('NFC');
}

/** Có chữ Hán (CJK Unified + Ext A)? */
export const laChuHan = (ch: string) => /[\u3400-\u4dbf\u4e00-\u9fff]/.test(ch);
export const coKana = (s: string) => /[\u3040-\u30ff]/.test(s);

// ─── Pinyin số → pinyin có dấu ───────────────────────────────

const DAU: Record<string, string[]> = {
  a: ['ā', 'á', 'ǎ', 'à'], e: ['ē', 'é', 'ě', 'è'], i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'], u: ['ū', 'ú', 'ǔ', 'ù'], ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

/** Một âm tiết: "xue2" → "xué", "lu:4" → "lǜ", "ma5" → "ma". Luật đặt dấu: a/e trước; "ou" dấu trên o; còn lại nguyên âm cuối. */
export function amTietCoDau(syl: string): string {
  const m = /^([a-zü:]+?)([1-5])$/i.exec(syl);
  if (!m) return syl.replace(/u:/gi, 'ü');
  const goc = m[1].replace(/u:/gi, 'ü').replace(/v/gi, 'ü');
  const thanh = Number(m[2]);
  if (thanh === 5) return goc;
  const thap = goc.toLowerCase();
  let vt = thap.search(/[ae]/);
  if (vt < 0 && thap.includes('ou')) vt = thap.indexOf('o');
  if (vt < 0) {
    for (let i = thap.length - 1; i >= 0; i--) if ('aeiouü'.includes(thap[i])) { vt = i; break; }
  }
  if (vt < 0) return goc;
  const nguyen = thap[vt];
  const doi = DAU[nguyen]?.[thanh - 1];
  if (!doi) return goc;
  const hoa = goc[vt] !== goc[vt].toLowerCase();
  return goc.slice(0, vt) + (hoa ? doi.toUpperCase() : doi) + goc.slice(vt + 1);
}

/** "xue2 xi2" → "xuéxí" (gộp âm tiết như sách; giữ khoảng trắng trước tên riêng/chữ không phải âm tiết). */
export function pinyinCoDau(soCach: string): string {
  return soCach.split(/\s+/).filter(Boolean).map(amTietCoDau).join('').replace(/,/g, ', ');
}

// ─── Kana → romaji (Hepburn) ─────────────────────────────────

const R1: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko', さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to', な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no', は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo', や: 'ya', ゆ: 'yu', よ: 'yo', ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', ゐ: 'i', ゑ: 'e', を: 'o', ん: 'n', が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go', ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do', ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo', ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ゔ: 'vu', ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o', ゎ: 'wa',
};
const R2: Record<string, string> = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo', しゃ: 'sha', しゅ: 'shu', しょ: 'sho', ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo', みゃ: 'mya', みゅ: 'myu', みょ: 'myo', りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo', ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo', ぢゃ: 'ja', ぢゅ: 'ju', ぢょ: 'jo', びゃ: 'bya', びゅ: 'byu', びょ: 'byo', ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo', てぃ: 'ti', でぃ: 'di', とぅ: 'tu', どぅ: 'du', うぃ: 'wi', うぇ: 'we', うぉ: 'wo', しぇ: 'she', じぇ: 'je', ちぇ: 'che',
  つぁ: 'tsa', ゔぁ: 'va', ゔぃ: 'vi', ゔぇ: 've', ゔぉ: 'vo',
};

/** "がっこう" / "ガッコウ" → "gakkou". Chữ không phải kana giữ nguyên. Trường âm "ー" lặp nguyên âm trước. */
export function romaji(kana: string): string {
  const s = khoaTraKana(kana);
  let ra = '';
  let i = 0;
  while (i < s.length) {
    const hai = s.slice(i, i + 2);
    if (s[i] === 'っ') {
      const sau = R2[s.slice(i + 1, i + 3)] ?? R1[s[i + 1]] ?? '';
      ra += sau ? (sau.startsWith('ch') ? 't' : sau[0]) : 'tsu';
      i += 1;
      continue;
    }
    if (s[i] === 'ー') { const nguyen = ra.match(/[aeiou]$/)?.[0]; ra += nguyen ?? '-'; i += 1; continue; }
    if (R2[hai]) { ra += R2[hai]; i += 2; continue; }
    if (s[i] === 'ん' && /^[aiueoy]/.test(R1[s[i + 1]] ?? '')) { ra += "n'"; i += 1; continue; }
    ra += R1[s[i]] ?? s[i];
    i += 1;
  }
  return ra;
}

/** Katakana → hiragana, giữ nguyên chữ khác (cho romaji). */
function khoaTraKana(s: string): string {
  let ra = '';
  for (const ch of s.normalize('NFKC')) {
    const c = ch.codePointAt(0)!;
    ra += c >= 0x30a1 && c <= 0x30f6 ? String.fromCodePoint(c - 0x60) : ch;
  }
  return ra;
}

// ─── Chọn âm Hán Việt chính trong nhiều ứng viên ─────────────
//
// Unihan `kVietnamese` trộn âm NÔM với âm Hán Việt (校: "chò giâu hiệu"), KANJIDIC2 `vietnam` liệt kê nhiều âm không
// theo độ thông dụng (医: "Ế, Y, …"). Chọn bằng QUY LUẬT TƯƠNG ỨNG THANH ĐIỆU Phổ thông ↔ Hán Việt (đều bắt nguồn từ
// 4 thanh tiếng Hán trung đại): thanh 1 ↔ ngang · thanh 2 ↔ huyền/ngang (âm tắc p/t/c/ch ⇒ sắc/nặng) · thanh 3 ↔ hỏi/ngã ·
// thanh 4 ↔ sắc/nặng. Cộng điểm nếu âm có ở CẢ Unihan lẫn KANJIDIC2, và theo thứ hạng trong KANJIDIC2.

type ThanhViet = 'ngang' | 'huyen' | 'sac' | 'hoi' | 'nga' | 'nang';
export function thanhViet(am: string): ThanhViet {
  const d = am.normalize('NFD');
  if (d.includes('̀')) return 'huyen';
  if (d.includes('́')) return 'sac';
  if (d.includes('̉')) return 'hoi';
  if (d.includes('̃')) return 'nga';
  if (d.includes('̣')) return 'nang';
  return 'ngang';
}

/** Thanh Phổ thông (1–4, 5/0 = nhẹ) của pinyin có dấu. */
export function thanhPinyin(py: string): number {
  const d = py.normalize('NFD');
  if (d.includes('̄')) return 1;
  if (d.includes('́')) return 2;
  if (d.includes('̌')) return 3;
  if (d.includes('̀')) return 4;
  return 5;
}

export function hopThanh(amViet: string, pinyin: string | undefined): boolean {
  if (!pinyin) return true;
  const t = thanhPinyin(pinyin);
  const v = thanhViet(amViet);
  const tac = /(p|t|c|ch)$/.test(khoaTra(amViet));
  if (tac) return v === 'sac' || v === 'nang';
  switch (t) {
    case 1: return v === 'ngang';
    case 2: return v === 'huyen' || v === 'ngang';
    case 3: return v === 'hoi' || v === 'nga';
    case 4: return v === 'sac' || v === 'nang' || v === 'nga';
    default: return true;
  }
}

/** "kì" ≡ "kỳ", "hi" ≡ "hy"… — Unihan viết i, KANJIDIC2 viết y (chính tả cũ). Khoá so sánh dùng i; HIỂN THỊ giữ y. */
const Y_I: Record<string, string> = { y: 'i', 'ỳ': 'ì', 'ý': 'í', 'ỷ': 'ỉ', 'ỹ': 'ĩ', 'ỵ': 'ị' };
export function khoaAmHV(am: string): string {
  const s = am.normalize('NFC').toLowerCase();
  const m = /^(k|h|l|m|t|s|qu|ph|th|kh|ch|tr|gi|ng|nh|b|d|đ|v|x|r)?([yỳýỷỹỵ])$/.exec(s);
  return m ? `${m[1] ?? ''}${Y_I[m[2]]}` : s;
}

/** Sắp ứng viên Hán Việt: âm chính đứng đầu. `kd` theo thứ tự KANJIDIC2, `uh` = các âm Unihan (có thể lẫn âm Nôm),
 *  `pinyin` = MỌI cách đọc Phổ thông của chữ (期 qī/qí) — hợp thanh với một trong số đó là đủ. */
export function sapHanViet(kd: string[], uh: string[], pinyin: string | string[] | undefined): string[] {
  const dsPy = (Array.isArray(pinyin) ? pinyin : pinyin ? [pinyin] : []).filter(Boolean);
  const hop = (a: string) => !dsPy.length || dsPy.some((p) => hopThanh(a, p));
  // Gộp theo khoá i/y; giữ cách viết của KANJIDIC2 (Kỳ) nếu có, không thì của Unihan.
  const hienThi = new Map<string, string>();
  for (const a of [...kd, ...uh]) { const k = khoaAmHV(a); if (!hienThi.has(k)) hienThi.set(k, a.normalize('NFC').toLowerCase()); }
  const tatCa = [...hienThi.keys()];
  const kdT = kd.map(khoaAmHV);
  const uhT = new Set(uh.map(khoaAmHV));
  const diem = (a: string) => {
    const r = kdT.indexOf(a);
    // Unihan chỉ MỘT âm thì hay là âm Nôm (強: "càng") ⇒ điểm giao nhau chỉ mạnh khi Unihan liệt kê từ hai âm.
    const giao = uhT.has(a) && r >= 0 ? (uhT.size >= 2 ? 2 : 0.5) : 0;
    return (hop(a) ? 3 : 0) + giao + (r === 0 ? 1 : r === 1 ? 0.5 : 0) + (uhT.has(a) ? 0.3 : 0);
  };
  return tatCa.map((a, i) => ({ a, d: diem(a), i })).sort((x, y) => y.d - x.d || x.i - y.i).map((x) => hienThi.get(x.a)!);
}
