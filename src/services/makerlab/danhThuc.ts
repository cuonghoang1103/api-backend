/**
 * ============================================================
 * Cổng đánh thức — robot chỉ trả lời khi được GỌI TÊN
 * ============================================================
 *
 * Trước khi có file này, robot trả lời MỌI thứ nó nghe thấy. Đặt trên
 * bàn cả ngày thì nó chen vào từng câu chuyện trong phòng. Đây là cái
 * cổng: im cho tới khi có người gọi "Odin", rồi mở tai một lúc.
 *
 * ── VÌ SAO KHÔNG LÀM TRÊN BO (ESP-SR / WakeNet) ──
 *
 * Espressif có bộ đánh thức chạy thẳng trên ESP32-S3, không cần mạng.
 * Nhưng nó chỉ nhận vài từ đúc sẵn ("Hi ESP", "Alexa"…) — KHÔNG có từ
 * tiếng Việt, và "Hey Odin" thì phải đặt Espressif huấn luyện riêng, mất
 * tiền và mất nhiều tuần. Nên cổng nằm ở SERVER: bo vẫn gửi tiếng lên,
 * Whisper vẫn chép, nhưng chép xong mà không thấy tên thì bỏ lượt ngay
 * TRƯỚC khi gọi LLM và TTS — tức là chặn được đúng hai khoản đắt nhất.
 *
 * Đổi lại: vẫn tốn một lần Whisper cho mỗi câu nói trong phòng. Muốn
 * chặn luôn khoản đó thì phải có WakeNet, tính sau.
 *
 * ── LUẬT SỐ MỘT: PHẢI SO MỜ ──
 *
 * "Odin" là từ NGOẠI trong một bản ghi tiếng Việt, nên Whisper chép ra
 * đủ kiểu và không lần nào giống lần nào: "Odin", "Ô đin", "Ốt đin",
 * "Âu đin", "Ô-đanh", "Odinh". So bằng `===` thì cổng gần như không bao
 * giờ mở, và triệu chứng sẽ là "robot chết rồi" chứ không phải "robot
 * nghe sai" — loại lỗi khó lần nhất.
 *
 * Nên ở đây so theo BẢNG BIẾN THỂ, khớp ĐÚNG từng chữ:
 *   1. Trùng khít một biến thể (bảng dưới), sau khi bỏ dấu + bỏ cách.
 *   2. Từ chào dính liền + biến thể: "heyodin".
 *   3. Biến thể + ĐÚNG MỘT ký tự thừa ở đuôi: "odint", "odinn".
 *
 * ⛔ CỐ TÌNH KHÔNG DÙNG KHOẢNG CÁCH SỬA ĐỂ QUYẾT ĐỊNH. Bản đầu có, đặt
 * ngưỡng lệch 1-2 ký tự, và bộ thử bắt ngay 5 câu tiếng Việt đời thường
 * bị đánh thức oan:
 *
 *     "ổ đĩa cứng đầy rồi"      → odia   lệch 1 với odin
 *     "đình làng bên kia sông"  → dinh   lệch 1 với odinh
 *     "anh định làm gì đấy"     → anhdinh lệch 2 với audinh
 *     "điện thoại của tôi đâu"  → dien   lệch 1 với odien
 *     "cái đinh này cong rồi"   → caidinh lệch 2 với audinh
 *
 * Trong tiếng Việt bỏ dấu, bán kính một ký tự quanh một từ 4 chữ cái
 * chứa cả một rổ từ thật. Mà hai loại lỗi ở đây KHÔNG ngang giá: bỏ sót
 * thì người dùng gọi lại một câu (và nhìn mắt lim dim là biết vì sao),
 * còn bắt nhầm thì chính là cái phiền mà cả tính năng này sinh ra để
 * chữa. Nên chọn CHẶT.
 *
 * Khoảng cách sửa vẫn tính, nhưng chỉ để GHI LOG "suýt trúng" — xem
 * `suytTrung()`. Nghe hụt kiểu mới thì nó hiện trong Live Console, đọc
 * rồi thêm thẳng vào bảng. Bảng lớn dần bằng dữ liệu thật, không bằng
 * tôi ngồi đoán Whisper sẽ chép ra gì.
 *
 * ── LUẬT SỐ HAI: CHỈ NHẬN Ở ĐẦU CÂU ──
 *
 * "Con Odin này hay thật" là NÓI VỀ robot, không phải NÓI VỚI robot.
 * Quét cả câu thì mọi lần nhắc tên đều đánh thức. Chỉ soi 3 từ đầu.
 */

/** Số từ đầu câu được phép đứng trước tên. "à, Odin ơi" → tên ở vị trí 1. */
const TOI_DA_TU_DEM = 3;

/** Số từ tối đa gộp lại để so với tên — đủ cho "hey odin" tách rời. */
const TOI_DA_TU_GHEP = 3;

/**
 * Từ chào đứng trước tên. Có cũng được, không có cũng được.
 *
 * Cố tình KHÔNG bắt buộc. User gọi tính năng này là "Hey Odin", nhưng
 * bắt buộc cả hai tiếng là nhân đôi tỉ lệ trượt: Whisper hay nuốt "hey"
 * hoặc chép nó thành "hê"/"hây"/"hay"/"ê". Chỉ cần tên là đủ, vì "Odin"
 * không nằm trong vốn từ tiếng Việt hằng ngày — nó tự nó đã hiếm.
 */
const TU_CHAO = new Set([
  'hey', 'hay', 'hei', 'he', 'hi', 'ok', 'oke', 'okay',
  'nay', 'ne', 'e', 'a', 'alo', 'allo', 'oi', 'xin', 'chao',
]);

/** Từ gọi đuôi — "Odin ơi", "Odin à". Nuốt luôn cho khỏi lọt vào câu lệnh. */
const TU_DUOI = new Set(['oi', 'a', 'ah', 'ei', 'nhe', 'nha', 'nhi', 'ne']);

/**
 * Biến thể phiên âm đã biết, tra theo tên đã chuẩn hoá.
 *
 * ⚠️ Bảng này gắn với TỪNG cái tên. Đổi `wakeWord` sang tên khác thì
 * mất bảng, chỉ còn tầng 1 và tầng 3 — vẫn chạy, chỉ kém nhạy hơn. Đó
 * là đánh đổi có chủ ý: thà xuống cấp êm còn hơn đòi người dùng phải
 * biết phiên âm học để đổi tên robot.
 *
 * Danh sách này lấy từ cách Whisper thật sự chép từ ngoại trong câu
 * tiếng Việt: nó hay chèn phụ âm cuối ("t", "h"), hay tách nguyên âm
 * đầu ("âu", "ô"), và hay thêm "nh"/"ng" vào cuối.
 */
const PHIEN_AM_THEM: Record<string, string[]> = {
  odin: [
    'otdin', 'audin', 'aodin', 'oodin', 'ohdin', 'odinh', 'oding',
    'odim', 'othin', 'otdinh', 'audinh', 'odzin', 'oldin', 'odinn',
  ],
  // ⛔ ĐÃ BỎ `odien`: nó khớp đúng chữ với "ô điên", và quan trọng hơn
  // là nó kéo `odien` + 1 ký tự thừa (luật 3) tới sát "điện" — từ xuất
  // hiện dày đặc trong nhà. Không đáng đánh đổi, vì "Ô-điên" chưa bao
  // giờ là cách Whisper chép "Odin".
};

/**
 * Bỏ dấu tiếng Việt, hạ chữ thường, vứt mọi thứ không phải chữ/số.
 *
 * ⚠️ `đ` KHÔNG rụng dấu qua NFD — nó là một ký tự riêng trong Unicode,
 * không phải `d` + dấu gạch. Quên dòng đó thì "đin" ra "in" và mọi biến
 * thể có "đ" (tức là hầu hết) đều trượt.
 */
export function chuanHoaTu(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
}

/** Khoảng cách sửa Levenshtein, bản hai hàng cho gọn bộ nhớ. */
export function khoangCachSua(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let truoc = Array.from({ length: b.length + 1 }, (_, i) => i);
  let nay = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    nay[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const gia = a[i - 1] === b[j - 1] ? 0 : 1;
      nay[j] = Math.min(truoc[j] + 1, nay[j - 1] + 1, truoc[j - 1] + gia);
    }
    [truoc, nay] = [nay, truoc];
  }
  return truoc[b.length];
}

/**
 * Ứng viên này có phải là tên robot không. Ba luật ở đầu file.
 *
 * Trả về biến thể đã trúng (để ghi log), hoặc `null`.
 */
function khopBienThe(ungVien: string, bienThe: string[]): string | null {
  if (!ungVien) return null;

  for (const v of bienThe) {
    // Luật 1 — trùng khít.
    if (ungVien === v) return v;

    // Luật 2 — từ chào viết dính: Whisper hay trả "heyodin" một cục.
    // AN TOÀN vì bắt buộc phần đầu phải là một từ chào có trong bảng;
    // không có nó thì luật này thành "đuôi câu nào chứa tên cũng thức".
    if (ungVien.endsWith(v) && TU_CHAO.has(ungVien.slice(0, -v.length))) return v;

    // Luật 3 — thừa ĐÚNG MỘT ký tự ở đuôi ("odint", "odinh"). Đây là
    // kiểu chép hụt phổ biến nhất khi model đặt một từ ngoại vào âm
    // tiếng Việt: nó thêm phụ âm cuối cho giống tiếng Việt.
    //
    // Chỉ cho THÊM, không cho BỚT. Cho bớt thì "odin" hụt một ký tự ra
    // "odi", mà "ờ đi" là câu nói thật và nói suốt ngày.
    if (ungVien.length === v.length + 1 && ungVien.startsWith(v)) return v;
  }
  return null;
}

/**
 * Suýt trúng — CHỈ để ghi log, không bao giờ mở cổng.
 *
 * Đây là chỗ bảng biến thể lớn lên bằng dữ liệu thật: người dùng gọi mà
 * robot không dậy, mở Live Console thấy dòng "nghe thành 'ô ding' — suýt
 * trúng", chép chữ đó thêm vào `PHIEN_AM_THEM` là xong. Không có dòng
 * log này thì lỗi hiện ra dưới dạng "robot chết", và không ai biết
 * Whisper đã chép thành cái gì.
 */
export function suytTrung(ungVien: string, bienThe: string[]): string | null {
  for (const v of bienThe) {
    if (v.length >= 4 && khoangCachSua(ungVien, v) <= 2) return v;
  }
  return null;
}

/** Tập chữ được coi là "đúng tên", đã chuẩn hoá và bỏ khoảng trắng. */
export function bienTheTen(tuDanhThuc: string): string[] {
  const goc = chuanHoaTu(tuDanhThuc.replace(/\s+/g, ''));
  if (!goc) return [];
  const ra = new Set<string>([goc]);

  // Nếu từ đánh thức có nhiều tiếng ("hey odin") thì tiếng CUỐI thường
  // là tên thật — nhận riêng nó nữa, vì người ta hay bỏ tiếng chào.
  const tieng = tuDanhThuc.trim().split(/\s+/).map(chuanHoaTu).filter(Boolean);
  if (tieng.length > 1) ra.add(tieng[tieng.length - 1]);

  for (const t of [...ra]) for (const them of PHIEN_AM_THEM[t] ?? []) ra.add(them);
  return [...ra];
}

export interface KetQuaDanhThuc {
  /** Câu này có gọi tên robot không. */
  trung: boolean;
  /** Phần câu còn lại sau khi cắt tên — đây mới là câu lệnh thật. */
  conLai: string;
  /** Biến thể đã khớp, để ghi log mà lần ra vì sao trúng/trượt. */
  khop: string;
  /**
   * Không trúng, nhưng gần. Chuỗi Whisper đã chép ra — chép nó vào
   * `PHIEN_AM_THEM` là lần sau nhận được. Rỗng nếu không gần gì cả.
   */
  suyt: string;
}

/**
 * Tìm từ đánh thức ở đầu câu.
 *
 * Trả `conLai` cắt từ văn bản GỐC chứ không phải bản đã chuẩn hoá — LLM
 * phải nhận đúng tiếng Việt có dấu, đưa nó "di toi day coi" là bắt nó
 * đoán lại một câu ta vừa tự bóp méo.
 */
export function timDanhThuc(text: string, tuDanhThuc: string | null): KetQuaDanhThuc {
  const truot: KetQuaDanhThuc = { trung: false, conLai: '', khop: '', suyt: '' };
  if (!tuDanhThuc) return truot;

  const bienThe = bienTheTen(tuDanhThuc);
  if (!bienThe.length) return truot;

  const goc = text.trim().split(/\s+/).filter(Boolean);
  if (!goc.length) return truot;
  /** Ứng viên gần nhất chưa đủ trúng — chỉ dùng để ghi log. */
  let gan = '';
  // Chuẩn hoá TỪNG TỪ để hai mảng thẳng hàng 1:1. Chuẩn hoá cả câu rồi
  // tách lại thì dấu câu làm lệch số từ, và `conLai` cắt sai chỗ.
  const chuan = goc.map(chuanHoaTu);

  for (let dau = 0; dau < Math.min(TOI_DA_TU_DEM, goc.length); dau++) {
    // Mọi từ đứng trước tên phải là từ chào. "con Odin này" ⇒ "con"
    // không phải từ chào ⇒ không xét vị trí 1 ⇒ không đánh thức.
    if (dau > 0 && !TU_CHAO.has(chuan[dau - 1])) break;

    let ghep = '';
    for (let n = 0; n < TOI_DA_TU_GHEP && dau + n < goc.length; n++) {
      ghep += chuan[dau + n];
      if (!ghep) continue;

      const trung = khopBienThe(ghep, bienThe);
      if (!trung) {
        // Ghi lại ứng viên gần nhất để log. Chỉ lấy cái ĐẦU TIÊN gặp:
        // ứng viên ngắn nhất ở vị trí sớm nhất là thứ giống một lời gọi
        // hụt nhất; mấy chuỗi ghép dài sau đó chỉ là nhiễu.
        if (!gan && suytTrung(ghep, bienThe)) gan = ghep;
        continue;
      }

      // Nuốt nốt từ gọi đuôi ("ơi", "à") để nó không lọt vào câu lệnh.
      let sau = dau + n + 1;
      if (sau < goc.length && TU_DUOI.has(chuan[sau])) sau++;

      return {
        trung: true,
        // Bỏ dấu câu dính ở đầu phần còn lại: "Odin, đi tới" → "đi tới",
        // không phải ", đi tới".
        conLai: goc.slice(sau).join(' ').replace(/^[\s,.;:!?—–-]+/, '').trim(),
        khop: trung,
        suyt: '',
      };
    }
  }
  return { ...truot, suyt: gan };
}

// ════════════════════════════════════════════════════════════
// Trạng thái thức/ngủ theo từng con robot
// ════════════════════════════════════════════════════════════
//
// Để trong bộ nhớ tiến trình, KHÔNG ghi DB. Mất khi deploy là ĐÚNG cái
// ta muốn: mặc định an toàn là NGỦ. Ghi DB thì một con robot đang thức
// lúc deploy sẽ thức mãi cho tới khi hết giờ, mà không ai biết vì sao.

const _hetHan = new Map<number, number>();

/** Robot này đang trong khoảng thức không. */
export function dangThuc(deviceId: number): boolean {
  const h = _hetHan.get(deviceId);
  if (!h) return false;
  if (Date.now() >= h) {
    _hetHan.delete(deviceId);
    return false;
  }
  return true;
}

/** Mở/gia hạn cửa sổ thức. Gọi lại khi đang thức = đẩy hạn ra xa. */
export function moCong(deviceId: number, giay: number): void {
  _hetHan.set(deviceId, Date.now() + Math.max(5, giay) * 1000);
}

/** Đóng ngay, không đợi hết giờ. */
export function dongCong(deviceId: number): void {
  _hetHan.delete(deviceId);
}

/** Còn bao nhiêu giây nữa thì ngủ lại. 0 = đang ngủ. */
export function conLaiGiay(deviceId: number): number {
  const h = _hetHan.get(deviceId);
  if (!h) return 0;
  return Math.max(0, Math.round((h - Date.now()) / 1000));
}
