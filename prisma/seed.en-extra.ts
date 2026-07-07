/* eslint-disable */
/**
 * Prisma seed — EXTRA English data for the "My Language" module.
 * Run with:  npx tsx prisma/seed.en-extra.ts
 *
 * Adds (additively, never deleting or overwriting anything):
 *  1. English alphabet & pronunciation system (5 alphabet groups):
 *     - Bảng chữ cái A–Z (26 letters, IPA letter names, Vietnamese reading tips)
 *     - Nguyên âm đơn (12 IPA monophthongs)
 *     - Nguyên âm đôi (8 IPA diphthongs)
 *     - Phụ âm (24 IPA consonants)
 *     - Quy tắc đọc & trọng âm (14 reading / stress rules)
 *  2. Full grammar ladder A1 → C1 (~78 points, beginner → IELTS 7.5),
 *     all explanations in Vietnamese.
 *
 * Fully idempotent & safe to re-run:
 *  - language 'en' is looked up by code (NEVER created here — it must already exist)
 *  - alphabet groups are find-before-create by (languageId, name)
 *  - alphabet items are find-before-create by (groupId, character)
 *  - grammar points are find-before-create by (languageId, title)
 *  - `order` values for new rows continue after the current max in the DB
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ============================ TYPES ============================
interface ExampleSeed {
  sentence: string;
  pronunciation?: string;
  meaningVi: string;
}
interface GrammarSeed {
  level: string;
  title: string;
  structure: string;
  explanation: string; // HTML string (stored into the Json column)
  examples: ExampleSeed[];
  commonMistakes: string | null;
  comparedWith: string | null;
}
interface AlphaItem {
  character: string;
  romanization: string;
  note?: string;
}
interface AlphaGroup {
  name: string;
  description: string;
  items: AlphaItem[];
}

// ============================ SUMMARY ============================
const summary = {
  alphabetGroups: { created: 0, skipped: 0 },
  alphabetItems: { created: 0, skipped: 0 },
  grammar: { created: 0, skipped: 0 },
};
const grammarByLevel: Record<string, { created: number; skipped: number }> = {};

// ============================ SEEDERS ============================
async function seedAlphabet(languageId: number, groups: AlphaGroup[]): Promise<void> {
  const agg = await prisma.langAlphabetGroup.aggregate({
    where: { languageId },
    _max: { order: true },
  });
  const orderBase = (agg._max.order ?? -1) + 1;

  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi];
    let group = await prisma.langAlphabetGroup.findFirst({
      where: { languageId, name: g.name },
    });
    if (group) {
      summary.alphabetGroups.skipped++;
    } else {
      group = await prisma.langAlphabetGroup.create({
        data: { languageId, name: g.name, description: g.description, order: orderBase + gi },
      });
      summary.alphabetGroups.created++;
    }
    for (let ii = 0; ii < g.items.length; ii++) {
      const it = g.items[ii];
      const existing = await prisma.langAlphabetItem.findFirst({
        where: { groupId: group.id, character: it.character },
      });
      if (existing) {
        summary.alphabetItems.skipped++;
        continue;
      }
      await prisma.langAlphabetItem.create({
        data: {
          groupId: group.id,
          character: it.character,
          romanization: it.romanization,
          note: it.note ?? null,
          order: ii,
        },
      });
      summary.alphabetItems.created++;
    }
  }
}

async function seedGrammar(languageId: number, points: GrammarSeed[]): Promise<void> {
  const agg = await prisma.langGrammarPoint.aggregate({
    where: { languageId },
    _max: { order: true },
  });
  const orderBase = (agg._max.order ?? -1) + 1;

  for (let i = 0; i < points.length; i++) {
    const g = points[i];
    if (!grammarByLevel[g.level]) grammarByLevel[g.level] = { created: 0, skipped: 0 };
    const existing = await prisma.langGrammarPoint.findFirst({
      where: { languageId, title: g.title },
    });
    if (existing) {
      summary.grammar.skipped++;
      grammarByLevel[g.level].skipped++;
      continue;
    }
    await prisma.langGrammarPoint.create({
      data: {
        languageId,
        level: g.level,
        title: g.title,
        structure: g.structure,
        explanation: g.explanation as Prisma.InputJsonValue,
        examples: g.examples as unknown as Prisma.InputJsonValue,
        commonMistakes: g.commonMistakes,
        comparedWith: g.comparedWith,
        order: orderBase + i,
      },
    });
    summary.grammar.created++;
    grammarByLevel[g.level].created++;
  }
}

// ============================ STATIC VALIDATION ============================
function validateData(groups: AlphaGroup[], grammar: GrammarSeed[]): void {
  const problems: string[] = [];
  const groupNames = new Set<string>();
  for (const g of groups) {
    if (groupNames.has(g.name)) problems.push(`duplicate alphabet group name: ${g.name}`);
    groupNames.add(g.name);
    const chars = new Set<string>();
    for (const it of g.items) {
      if (it.character.length > 32)
        problems.push(`character > 32 chars in "${g.name}": ${it.character}`);
      if (it.romanization.length > 64)
        problems.push(`romanization > 64 chars in "${g.name}": ${it.romanization}`);
      if (chars.has(it.character))
        problems.push(`duplicate character in "${g.name}": ${it.character}`);
      chars.add(it.character);
    }
  }
  const validLevels = new Set(['A1', 'A2', 'B1', 'B2', 'C1']);
  const titles = new Set<string>();
  for (const p of grammar) {
    if (!validLevels.has(p.level)) problems.push(`invalid level "${p.level}" on: ${p.title}`);
    if (p.title.length > 255) problems.push(`title > 255 chars: ${p.title}`);
    if (titles.has(p.title)) problems.push(`duplicate grammar title: ${p.title}`);
    titles.add(p.title);
    if (p.examples.length < 3 || p.examples.length > 5)
      problems.push(`examples must be 3-5 (got ${p.examples.length}): ${p.title}`);
  }
  if (problems.length) {
    console.error('❌ Data validation failed:');
    for (const pr of problems) console.error('  - ' + pr);
    process.exit(1);
  }
}

// ============================ DATA ============================
const EN_ALPHABET: AlphaGroup[] = [
  {
    name: "Bảng chữ cái A–Z",
    description:
      "26 chữ cái tiếng Anh với tên chữ theo IPA, cách đọc tiếng Việt gần đúng và từ ví dụ. Lưu ý: tên chữ cái (khi đánh vần) khác với âm mà chữ đó tạo ra trong từ.",
    items: [
      { character: "A a", romanization: "/eɪ/", note: "Đọc như 'ây' — apple, ant, animal" },
      { character: "B b", romanization: "/biː/", note: "Đọc như 'bi' kéo dài — book, big, banana" },
      { character: "C c", romanization: "/siː/", note: "Đọc như 'xi' kéo dài — cat, city, computer" },
      { character: "D d", romanization: "/diː/", note: "Đọc như 'đi' kéo dài — dog, door, dance" },
      { character: "E e", romanization: "/iː/", note: "Đọc như 'i' kéo dài — egg, elephant, email" },
      { character: "F f", romanization: "/ef/", note: "Đọc như 'ép' (răng trên chạm môi dưới ở âm cuối) — fish, family, fun" },
      { character: "G g", romanization: "/dʒiː/", note: "Đọc như 'chi' (âm 'j' rung, gần 'gi' tiếng Việt) — go, girl, game" },
      { character: "H h", romanization: "/eɪtʃ/", note: "Đọc như 'ây-ch' — hat, house, happy" },
      { character: "I i", romanization: "/aɪ/", note: "Đọc như 'ai' — ice, idea, island" },
      { character: "J j", romanization: "/dʒeɪ/", note: "Đọc như 'chây' (âm 'j' rung) — job, juice, jump" },
      { character: "K k", romanization: "/keɪ/", note: "Đọc như 'khây' (bật hơi) — key, king, kind" },
      { character: "L l", romanization: "/el/", note: "Đọc như 'eo' nhưng kết thúc bằng đầu lưỡi chạm lợi — love, lion, learn" },
      { character: "M m", romanization: "/em/", note: "Đọc như 'em' (mím môi ở cuối) — moon, mother, music" },
      { character: "N n", romanization: "/en/", note: "Đọc như 'en' (đầu lưỡi chạm lợi ở cuối) — name, night, new" },
      { character: "O o", romanization: "/əʊ/", note: "Đọc như 'âu' — orange, open, old" },
      { character: "P p", romanization: "/piː/", note: "Đọc như 'phi' nhưng bật hơi mạnh môi — pen, park, play" },
      { character: "Q q", romanization: "/kjuː/", note: "Đọc như 'khiu' — queen, question, quick (hầu như luôn đi với u: qu-)" },
      { character: "R r", romanization: "/ɑː(r)/", note: "Đọc như 'a' kéo dài, cuối cong nhẹ lưỡi (Anh-Mỹ) — red, run, rain" },
      { character: "S s", romanization: "/es/", note: "Đọc như 'ét-xờ' gọn — sun, school, smile" },
      { character: "T t", romanization: "/tiː/", note: "Đọc như 'thi' (bật hơi, KHÔNG phải 't' Việt) — tea, table, time" },
      { character: "U u", romanization: "/juː/", note: "Đọc như 'diu' — umbrella, uncle, use" },
      { character: "V v", romanization: "/viː/", note: "Đọc như 'vi' (răng trên chạm môi dưới, rung) — very, video, voice" },
      { character: "W w", romanization: "/ˈdʌb.əl.juː/", note: "Đọc như 'đắp-bờ-liu' — water, week, world" },
      { character: "X x", romanization: "/eks/", note: "Đọc như 'éc-xờ' — box, six, taxi (thường đọc /ks/ trong từ)" },
      { character: "Y y", romanization: "/waɪ/", note: "Đọc như 'oai' — yes, yellow, young" },
      { character: "Z z", romanization: "/zed/ (Anh) · /ziː/ (Mỹ)", note: "Anh-Anh đọc 'dét', Anh-Mỹ đọc 'di' (rung) — zoo, zero, zebra" },
    ],
  },
  {
    name: "Nguyên âm đơn (IPA)",
    description:
      "12 nguyên âm đơn (monophthongs) trong hệ IPA tiếng Anh. Chú ý cặp dài–ngắn (iː/ɪ, uː/ʊ, ɔː/ɒ, ɑː/ʌ): khác độ dài VÀ khác khẩu hình, không chỉ kéo dài ra là xong.",
    items: [
      { character: "/iː/", romanization: "sheep /ʃiːp/", note: "Nguyên âm DÀI, như 'i' nhưng kéo dài, miệng bành sang hai bên như đang cười — see, eat, need" },
      { character: "/ɪ/", romanization: "ship /ʃɪp/", note: "Nguyên âm NGẮN, giữa 'i' và 'ê', cơ miệng thả lỏng, dứt khoát — sit, big, gym" },
      { character: "/e/", romanization: "bed /bed/", note: "Nguyên âm ngắn, gần như 'e' tiếng Việt, miệng mở vừa — bed, head, many" },
      { character: "/æ/", romanization: "cat /kæt/", note: "Âm giữa 'a' và 'e', há miệng rộng, hàm dưới hạ thấp — cat, bad, apple. Người Việt hay đọc nhầm thành /e/" },
      { character: "/ɑː/", romanization: "car /kɑː/", note: "Nguyên âm DÀI, như 'a' kéo dài, mở họng, lưỡi hạ thấp — car, father, start" },
      { character: "/ɒ/", romanization: "hot /hɒt/", note: "Nguyên âm NGẮN (Anh-Anh), như 'o' ngắn, tròn môi nhẹ — hot, want, watch" },
      { character: "/ɔː/", romanization: "door /dɔː/", note: "Nguyên âm DÀI, như 'o' kéo dài, tròn môi rõ — door, more, walk" },
      { character: "/ʊ/", romanization: "book /bʊk/", note: "Nguyên âm NGẮN, như 'u' nhưng môi thả lỏng, không chu môi mạnh — book, good, put" },
      { character: "/uː/", romanization: "food /fuːd/", note: "Nguyên âm DÀI, như 'u' kéo dài, chu môi tròn — food, blue, school" },
      { character: "/ʌ/", romanization: "cup /kʌp/", note: "Nguyên âm ngắn, gần như 'ă' tiếng Việt, miệng mở tự nhiên — cup, love, money" },
      { character: "/ɜː/", romanization: "bird /bɜːd/", note: "Nguyên âm DÀI, như 'ơ' kéo dài, môi không tròn — bird, work, learn" },
      { character: "/ə/", romanization: "about /əˈbaʊt/", note: "Schwa — 'ơ' cực ngắn và nhẹ, CHỈ xuất hiện ở âm tiết KHÔNG nhấn; là nguyên âm phổ biến nhất tiếng Anh — about, teacher, banana" },
    ],
  },
  {
    name: "Nguyên âm đôi (IPA)",
    description:
      "8 nguyên âm đôi (diphthongs): trượt liền mạch từ nguyên âm thứ nhất sang nguyên âm thứ hai trong CÙNG một âm tiết; âm đầu rõ và dài hơn, âm sau lướt nhẹ.",
    items: [
      { character: "/eɪ/", romanization: "day /deɪ/", note: "Trượt từ /e/ sang /ɪ/, như 'ây' — day, name, wait. Đừng đọc thành 'ê' phẳng kiểu Việt" },
      { character: "/aɪ/", romanization: "my /maɪ/", note: "Trượt từ /a/ sang /ɪ/, như 'ai' — my, time, buy" },
      { character: "/ɔɪ/", romanization: "boy /bɔɪ/", note: "Trượt từ /ɔ/ sang /ɪ/, như 'oi' — boy, choice, enjoy" },
      { character: "/aʊ/", romanization: "now /naʊ/", note: "Trượt từ /a/ sang /ʊ/, như 'ao' — now, house, down" },
      { character: "/əʊ/", romanization: "go /gəʊ/", note: "Trượt từ /ə/ sang /ʊ/, như 'âu' (Anh-Mỹ: /oʊ/) — go, home, know. Đừng đọc thành 'ô' phẳng" },
      { character: "/ɪə/", romanization: "here /hɪə/", note: "Trượt từ /ɪ/ sang /ə/, như 'ia' — here, near, idea (phổ biến trong Anh-Anh)" },
      { character: "/eə/", romanization: "hair /heə/", note: "Trượt từ /e/ sang /ə/, như 'e-ơ' — hair, care, where" },
      { character: "/ʊə/", romanization: "tour /tʊə/", note: "Trượt từ /ʊ/ sang /ə/, như 'u-ơ' — tour, sure, pure (nhiều người bản xứ nay đọc thành /ɔː/)" },
    ],
  },
  {
    name: "Phụ âm (IPA)",
    description:
      "24 phụ âm IPA tiếng Anh. Nắm vững cặp VÔ THANH (không rung dây thanh) – HỮU THANH (rung dây thanh): p/b, t/d, k/g, tʃ/dʒ, f/v, θ/ð, s/z, ʃ/ʒ. Đặt tay lên cổ họng để kiểm tra độ rung.",
    items: [
      { character: "/p/", romanization: "pen /pen/", note: "VÔ THANH — như 'p' nhưng BẬT HƠI mạnh ở đầu từ (đặt tờ giấy trước miệng phải rung) — pen, park, happy" },
      { character: "/b/", romanization: "bag /bæg/", note: "HỮU THANH — cặp với /p/, như 'b' tiếng Việt — bag, big, table" },
      { character: "/t/", romanization: "tea /tiː/", note: "VÔ THANH — bật hơi, đầu lưỡi chạm LỢI (không chạm răng như 't' Việt) — tea, time, water" },
      { character: "/d/", romanization: "dog /dɒg/", note: "HỮU THANH — cặp với /t/, gần như 'đ' Việt nhưng lưỡi chạm lợi — dog, day, ready" },
      { character: "/k/", romanization: "key /kiː/", note: "VÔ THANH — bật hơi như 'kh' nhẹ, cuống lưỡi chạm ngạc mềm — key, car, school" },
      { character: "/g/", romanization: "go /gəʊ/", note: "HỮU THANH — cặp với /k/, như 'g' tiếng Việt — go, girl, bigger" },
      { character: "/tʃ/", romanization: "chair /tʃeə/", note: "VÔ THANH — như 'ch' Việt nhưng tròn môi và bật mạnh hơn — chair, watch, teacher" },
      { character: "/dʒ/", romanization: "job /dʒɒb/", note: "HỮU THANH — cặp với /tʃ/, gần như 'gi' Việt nhưng có độ rung và bật — job, age, bridge" },
      { character: "/f/", romanization: "fan /fæn/", note: "VÔ THANH — răng trên chạm nhẹ môi dưới rồi thổi hơi — fan, phone, laugh" },
      { character: "/v/", romanization: "van /væn/", note: "HỮU THANH — cặp với /f/, cùng khẩu hình nhưng RUNG dây thanh; người Việt hay đọc lệch thành /f/ hoặc 'd' — van, very, love" },
      { character: "/θ/", romanization: "think /θɪŋk/", note: "VÔ THANH — ĐẶT ĐẦU LƯỠI GIỮA HAI HÀM RĂNG rồi thổi hơi; KHÔNG phải 'th' Việt — think, three, month" },
      { character: "/ð/", romanization: "this /ðɪs/", note: "HỮU THANH — cặp với /θ/, cùng vị trí lưỡi giữa răng nhưng rung dây thanh — this, mother, weather" },
      { character: "/s/", romanization: "sun /sʌn/", note: "VÔ THANH — như 'x' Việt, hơi xì qua khe lưỡi–lợi — sun, city, nice" },
      { character: "/z/", romanization: "zoo /zuː/", note: "HỮU THANH — cặp với /s/, phải RUNG (như tiếng ong kêu); người Việt hay đọc thành /s/ hoặc 'd' — zoo, easy, dogs" },
      { character: "/ʃ/", romanization: "she /ʃiː/", note: "VÔ THANH — như 's' Việt (giọng Bắc) nặng hơn, tròn môi, kiểu suỵt im lặng — she, ship, station" },
      { character: "/ʒ/", romanization: "vision /ˈvɪʒ.ən/", note: "HỮU THANH — cặp với /ʃ/, hiếm gặp, như 'gi' kéo dài có rung — vision, usually, measure" },
      { character: "/h/", romanization: "hat /hæt/", note: "VÔ THANH — hơi bật nhẹ từ họng, nhẹ hơn 'h' Việt — hat, home, behind" },
      { character: "/m/", romanization: "man /mæn/", note: "HỮU THANH (âm mũi) — mím môi, như 'm' Việt — man, mother, summer" },
      { character: "/n/", romanization: "no /nəʊ/", note: "HỮU THANH (âm mũi) — đầu lưỡi chạm lợi, như 'n' Việt — no, name, dinner" },
      { character: "/ŋ/", romanization: "sing /sɪŋ/", note: "HỮU THANH (âm mũi) — như 'ng' Việt; ở cuối từ KHÔNG thêm /g/ hay /k/ — sing, long, thinking" },
      { character: "/l/", romanization: "leg /leg/", note: "HỮU THANH — đầu lưỡi chạm lợi; ở CUỐI từ là 'dark L' (feel, milk) — nhớ chạm lưỡi, đừng biến thành 'u'" },
      { character: "/r/", romanization: "red /red/", note: "HỮU THANH — cong lưỡi về sau, KHÔNG chạm lợi, KHÔNG rung lưỡi như 'r' Việt — red, run, sorry" },
      { character: "/w/", romanization: "we /wiː/", note: "HỮU THANH (bán nguyên âm) — chu tròn môi rồi mở ra, như 'qu-' lướt — we, water, one" },
      { character: "/j/", romanization: "yes /jes/", note: "HỮU THANH (bán nguyên âm) — như 'd/gi' nhẹ giọng Nam, lưỡi gần ngạc cứng — yes, you, music /ˈmjuː.zɪk/" },
    ],
  },
  {
    name: "Quy tắc đọc & trọng âm",
    description:
      "Các quy tắc phát âm, trọng âm và ngữ điệu quan trọng nhất. Đây là phần quyết định độ tự nhiên khi nói: đuôi -ed/-s, âm câm, trọng âm từ, nối âm, schwa và dạng yếu.",
    items: [
      { character: "-ed", romanization: "3 cách đọc: /t/ /d/ /ɪd/", note: "Sau âm VÔ THANH (p,k,f,s,ʃ,tʃ) → /t/: stopped, watched. Sau âm HỮU THANH/nguyên âm → /d/: played, loved. Sau /t/ hoặc /d/ → /ɪd/ (thêm âm tiết): wanted, needed. Lỗi phổ biến: đọc mọi -ed thành /ɪd/." },
      { character: "-s/-es", romanization: "3 cách đọc: /s/ /z/ /ɪz/", note: "Sau âm VÔ THANH → /s/: books, stops. Sau âm HỮU THANH/nguyên âm → /z/: dogs, plays. Sau /s,z,ʃ,ʒ,tʃ,dʒ/ → /ɪz/ (thêm âm tiết): buses, watches. Áp dụng cho cả danh từ số nhiều lẫn động từ ngôi 3 số ít." },
      { character: "Magic E", romanization: "a_e, i_e, o_e, u_e → tên chữ cái", note: "Chữ 'e' câm cuối từ làm nguyên âm trước đó đọc thành TÊN CHỮ CÁI: hat /hæt/ → hate /heɪt/, bit → bite /baɪt/, hop → hope /həʊp/, cub → cube /kjuːb/. Bản thân 'e' cuối KHÔNG được đọc." },
      { character: "c cứng / c mềm", romanization: "c+a,o,u = /k/ · c+e,i,y = /s/", note: "'c' đọc /k/ trước a, o, u: cat, coffee, cup. 'c' đọc /s/ trước e, i, y: city, center, cycle. Vì vậy 'circle' có cả hai: /ˈsɜː.kəl/." },
      { character: "g cứng / g mềm", romanization: "g+a,o,u = /g/ · g+e,i,y thường = /dʒ/", note: "'g' đọc /g/ trước a, o, u: game, go, gun. Trước e, i, y thường đọc /dʒ/: age, giant, gym — nhưng có ngoại lệ phổ biến: get, give, girl vẫn đọc /g/." },
      { character: "Âm câm", romanization: "kn-, wr-, -mb, gh, -alk...", note: "k câm trong kn-: know, knife. w câm trong wr-: write, wrong. b câm sau m: climb, comb. gh thường câm: night, thought (hoặc đọc /f/: laugh, enough). l câm trong -alk: walk, talk. t câm: listen, castle." },
      { character: "th", romanization: "/θ/ (vô thanh) hoặc /ð/ (hữu thanh)", note: "Từ nội dung thường /θ/: think, three, birthday. Từ chức năng và đại từ thường /ð/: the, this, that, they, mother. Cả hai đều đặt lưỡi giữa hai răng — KHÔNG đọc thành 't', 'd' hay 'ph' kiểu Việt." },
      { character: "Trọng âm 2 âm tiết", romanization: "Danh từ âm 1 · Động từ âm 2", note: "Từ 2 âm tiết vừa là danh từ vừa là động từ: DANH TỪ nhấn âm 1, ĐỘNG TỪ nhấn âm 2 — REcord (bản ghi) / reCORD (ghi lại), PREsent (món quà) / preSENT (trình bày), INcrease / inCREASE. Nói chung ~90% danh từ 2 âm tiết nhấn âm 1." },
      { character: "-tion/-sion", romanization: "Trọng âm rơi vào âm NGAY TRƯỚC hậu tố", note: "Các từ đuôi -tion/-sion luôn nhấn âm tiết đứng ngay trước: inforMAtion, deCIsion, apliCAtion → appliCAtion, disCUSsion. Nhờ đó khi từ đổi dạng, trọng âm dịch chuyển: EDucate → eduCAtion." },
      { character: "-ic/-ity/-ical", romanization: "Trọng âm rơi vào âm NGAY TRƯỚC hậu tố", note: "Giống -tion: ecoNOmic, elecTRIcity, ecoNOmical, aBIlity, fanTAStic. So sánh: ECOnomy (nhấn âm 2 /ɪˈkɒn.ə.mi/) nhưng ecoNOmic — hậu tố quyết định vị trí trọng âm." },
      { character: "Nối âm (linking)", romanization: "phụ âm cuối + nguyên âm đầu → nối liền", note: "Phụ âm cuối từ trước nối với nguyên âm đầu từ sau: turn_off → 'tơ-nóf', an_apple → 'ơ-na-pồl', not_at_all → 'no-tơ-tôl'. Người bản xứ hầu như không tách rời từng từ — luyện nối âm giúp cả nói lẫn NGHE." },
      { character: "Âm schwa /ə/", romanization: "âm tiết KHÔNG nhấn → giảm thành /ə/", note: "Trong từ nhiều âm tiết, các âm tiết không mang trọng âm thường bị giảm về schwa /ə/: banana /bəˈnɑː.nə/ (2 chữ a đọc /ə/), teacher /ˈtiː.tʃə/, support /səˈpɔːt/. Đọc rõ mọi nguyên âm như tiếng Việt sẽ nghe rất 'cứng'." },
      { character: "Dạng yếu (weak forms)", romanization: "từ chức năng đọc yếu trong câu", note: "Từ chức năng (a, an, the, of, to, and, can, was, for...) trong câu thường đọc dạng YẾU với /ə/: 'fish and chips' → /fɪʃ ən tʃɪps/, 'I can swim' → /aɪ kən swɪm/. Chỉ đọc dạng mạnh khi nhấn mạnh hoặc đứng cuối câu: 'Yes, I CAN /kæn/'." },
      { character: "Ngữ điệu (intonation)", romanization: "xuống: câu kể, Wh- · lên: Yes/No", note: "Giọng XUỐNG cuối câu kể, câu mệnh lệnh và câu hỏi Wh- (What, Where...). Giọng LÊN cuối câu hỏi Yes/No: 'Are you ready?↗'. Câu liệt kê: lên ở các phần tử đầu, xuống ở phần tử cuối: 'red↗, blue↗ and green↘'." },
    ],
  },
];

const EN_GRAMMAR_EXTRA: GrammarSeed[] = [
  // ==================== A1 (15) ====================
  {
    level: "A1",
    title: "Verb 'to be' (am/is/are) — Động từ 'to be'",
    structure: "S + am/is/are + danh từ / tính từ / cụm giới từ",
    explanation:
      "<p><strong>To be</strong> là động từ quan trọng nhất tiếng Anh, dùng để nói ai đó/cái gì <strong>là gì, như thế nào, ở đâu</strong>. Chia theo chủ ngữ: <strong>I am</strong>, <strong>he/she/it is</strong>, <strong>you/we/they are</strong>.</p><p>Phủ định thêm <strong>not</strong> (I am not, she isn't, they aren't). Câu hỏi đảo to be lên trước chủ ngữ: <strong>Are you...? Is she...?</strong></p><p>Khác tiếng Việt: tiếng Việt có thể nói 'Tôi mệt' (không cần 'là'), nhưng tiếng Anh BẮT BUỘC có to be trước tính từ: I <strong>am</strong> tired.</p>",
    examples: [
      { sentence: "I am a software developer.", meaningVi: "Tôi là một lập trình viên." },
      { sentence: "She is very friendly.", meaningVi: "Cô ấy rất thân thiện." },
      { sentence: "They are at the office now.", meaningVi: "Bây giờ họ đang ở văn phòng." },
      { sentence: "Is he your brother? — No, he isn't.", meaningVi: "Anh ấy là anh trai bạn à? — Không phải." },
    ],
    commonMistakes: "❌ She happy. ✅ She is happy. | ❌ I is a student. ✅ I am a student. | ❌ Are they is teachers? ✅ Are they teachers?",
    comparedWith: "Đừng nhầm với 'have': nói tuổi dùng to be (I am 25), KHÔNG dùng have như nhiều ngôn ngữ khác.",
  },
  {
    level: "A1",
    title: "Present Simple — Thì hiện tại đơn",
    structure: "S + V(s/es) | S + don't/doesn't + V | Do/Does + S + V?",
    explanation:
      "<p>Thì <strong>hiện tại đơn</strong> diễn tả <strong>thói quen, sự thật hiển nhiên, lịch trình cố định</strong>. Đây là thì được dùng nhiều nhất trong giao tiếp hằng ngày.</p><p>Điểm khó nhất với người Việt: ngôi thứ 3 số ít (he/she/it) phải <strong>thêm -s/-es</strong> vào động từ: She work<strong>s</strong>. Phủ định và câu hỏi dùng trợ động từ <strong>do/does</strong> — khi đã có does thì động từ chính trở về nguyên mẫu.</p><ul><li>Thói quen: I drink coffee every morning.</li><li>Sự thật: Water boils at 100°C.</li><li>Lịch trình: The train leaves at 7 a.m.</li></ul>",
    examples: [
      { sentence: "I check my email every morning.", meaningVi: "Tôi kiểm tra email mỗi sáng." },
      { sentence: "She works at a tech company.", meaningVi: "Cô ấy làm việc ở một công ty công nghệ." },
      { sentence: "He doesn't eat meat.", meaningVi: "Anh ấy không ăn thịt." },
      { sentence: "Do you play football? — Yes, I do.", meaningVi: "Bạn có chơi bóng đá không? — Có." },
    ],
    commonMistakes: "❌ She work here. ✅ She works here. | ❌ He doesn't works. ✅ He doesn't work. | ❌ Does she likes it? ✅ Does she like it?",
    comparedWith: "So với hiện tại tiếp diễn: hiện tại đơn = thói quen lặp lại (I work every day), tiếp diễn = đang xảy ra ngay lúc nói (I am working now).",
  },
  {
    level: "A1",
    title: "Present Continuous — Thì hiện tại tiếp diễn",
    structure: "S + am/is/are + V-ing",
    explanation:
      "<p>Thì <strong>hiện tại tiếp diễn</strong> diễn tả hành động <strong>đang xảy ra ngay lúc nói</strong> hoặc <strong>xu hướng tạm thời quanh thời điểm hiện tại</strong>. Dấu hiệu: now, right now, at the moment, Look!, Listen!</p><p>Cấu tạo: to be (chia theo chủ ngữ) + động từ thêm <strong>-ing</strong>. Chú ý biến đổi chính tả: run → run<strong>n</strong>ing (gấp đôi phụ âm), write → writing (bỏ e), lie → lying.</p><p>Một số động từ chỉ trạng thái (know, like, want, need, believe, understand) <strong>thường KHÔNG dùng</strong> ở thì tiếp diễn.</p>",
    examples: [
      { sentence: "I am writing an email right now.", meaningVi: "Tôi đang viết email ngay bây giờ." },
      { sentence: "She is learning English this year.", meaningVi: "Năm nay cô ấy đang học tiếng Anh." },
      { sentence: "Look! It is raining.", meaningVi: "Nhìn kìa! Trời đang mưa." },
      { sentence: "They aren't sleeping; they're watching TV.", meaningVi: "Họ không ngủ đâu; họ đang xem TV." },
    ],
    commonMistakes: "❌ I am knowing the answer. ✅ I know the answer. | ❌ She working now. ✅ She is working now.",
    comparedWith: "Hiện tại đơn (thói quen: I usually walk to work) ↔ hiện tại tiếp diễn (tạm thời: I'm taking the bus this week because my bike is broken).",
  },
  {
    level: "A1",
    title: "Articles 'a/an' — Mạo từ không xác định",
    structure: "a + phụ ÂM đầu | an + nguyên ÂM đầu (+ danh từ đếm được số ít)",
    explanation:
      "<p><strong>A/an</strong> đứng trước danh từ đếm được số ít khi nhắc đến <strong>lần đầu</strong> hoặc nói về <strong>một cái bất kỳ</strong> (không xác định). Chọn a hay an theo <strong>ÂM</strong> bắt đầu, không phải chữ cái: <strong>an</strong> hour (h câm), <strong>a</strong> university (/j/), <strong>a</strong> European country.</p><p>Dùng a/an khi: nói nghề nghiệp (She is <strong>a</strong> doctor), nói 'một' (I need <strong>a</strong> pen), phân loại (It's <strong>an</strong> animal).</p><p>Tiếng Việt không có mạo từ nên người Việt hay <strong>quên</strong> a/an — đây là lỗi phổ biến số một.</p>",
    examples: [
      { sentence: "She is an engineer.", meaningVi: "Cô ấy là một kỹ sư." },
      { sentence: "I bought a new laptop and an old keyboard.", meaningVi: "Tôi đã mua một laptop mới và một bàn phím cũ." },
      { sentence: "It takes an hour to get there.", meaningVi: "Mất một tiếng để đến đó." },
      { sentence: "He works at a university.", meaningVi: "Anh ấy làm việc ở một trường đại học." },
    ],
    commonMistakes: "❌ She is doctor. ✅ She is a doctor. | ❌ an university ✅ a university | ❌ a hour ✅ an hour",
    comparedWith: "'The' dùng khi cả người nói và người nghe đều biết đang nói về cái nào (xem bài mạo từ 'the' ở B1).",
  },
  {
    level: "A1",
    title: "Plural Nouns — Danh từ số nhiều",
    structure: "N + s/es | biến đổi đặc biệt: man→men, child→children...",
    explanation:
      "<p>Tiếng Anh <strong>bắt buộc</strong> đánh dấu số nhiều trên danh từ — khác tiếng Việt (nói 'hai quyển sách' nhưng tiếng Anh phải là two book<strong>s</strong>).</p><p>Quy tắc: thêm <strong>-s</strong> (books); thêm <strong>-es</strong> sau s, x, sh, ch (boxes, watches); phụ âm + y → <strong>-ies</strong> (city → cities); một số từ -f/-fe → <strong>-ves</strong> (knife → knives).</p><p>Bất quy tắc phải học thuộc: man → men, woman → women, child → children, person → people, foot → feet, tooth → teeth, mouse → mice; sheep/fish không đổi.</p>",
    examples: [
      { sentence: "I have two brothers and three sisters.", meaningVi: "Tôi có hai anh em trai và ba chị em gái." },
      { sentence: "The children are playing in the park.", meaningVi: "Bọn trẻ đang chơi trong công viên." },
      { sentence: "Many people learn English online.", meaningVi: "Nhiều người học tiếng Anh trực tuyến." },
      { sentence: "She bought two watches and some knives.", meaningVi: "Cô ấy mua hai chiếc đồng hồ và vài con dao." },
    ],
    commonMistakes: "❌ two book ✅ two books | ❌ childrens, peoples ✅ children, people (đã là số nhiều) | ❌ two womans ✅ two women",
    comparedWith: "Danh từ không đếm được (water, information, advice) KHÔNG có dạng số nhiều — xem bài đếm được/không đếm được ở A2.",
  },
  {
    level: "A1",
    title: "Personal Pronouns & Possessive Adjectives — Đại từ nhân xưng & tính từ sở hữu",
    structure: "I/you/he... (chủ ngữ) | me/you/him... (tân ngữ) | my/your/his... + N",
    explanation:
      "<p>Ba bộ cần phân biệt: <strong>đại từ chủ ngữ</strong> (I, you, he, she, it, we, they) đứng trước động từ; <strong>đại từ tân ngữ</strong> (me, you, him, her, it, us, them) đứng sau động từ/giới từ; <strong>tính từ sở hữu</strong> (my, your, his, her, its, our, their) luôn đi kèm danh từ.</p><p>Tiếng Anh dùng he/she theo giới tính, <strong>it</strong> cho đồ vật/con vật. Chú ý cặp dễ nhầm: <strong>its</strong> (của nó) ≠ <strong>it's</strong> (= it is); <strong>their</strong> (của họ) ≠ <strong>they're</strong> (= they are) ≠ <strong>there</strong> (ở đó).</p>",
    examples: [
      { sentence: "She loves him, but he doesn't love her.", meaningVi: "Cô ấy yêu anh ta, nhưng anh ta không yêu cô ấy." },
      { sentence: "This is my phone. Give it to me, please.", meaningVi: "Đây là điện thoại của tôi. Làm ơn đưa nó cho tôi." },
      { sentence: "Their house is near our school.", meaningVi: "Nhà của họ ở gần trường chúng tôi." },
      { sentence: "The dog is eating its food.", meaningVi: "Con chó đang ăn thức ăn của nó." },
    ],
    commonMistakes: "❌ Me and him are friends. ✅ He and I are friends. | ❌ Give the book to I. ✅ Give the book to me. | ❌ It's tail is long. ✅ Its tail is long.",
    comparedWith: "Đại từ sở hữu độc lập (mine, yours, his, hers, ours, theirs) đứng MỘT MÌNH không kèm danh từ: This book is mine (không nói 'my').",
  },
  {
    level: "A1",
    title: "This / That / These / Those — Từ chỉ định",
    structure: "this/these (gần) + N số ít/số nhiều | that/those (xa) + N số ít/số nhiều",
    explanation:
      "<p>Từ chỉ định kết hợp hai yếu tố: <strong>khoảng cách</strong> (this/these = gần người nói; that/those = xa người nói) và <strong>số lượng</strong> (this/that + số ít; these/those + số nhiều).</p><p>Chúng có thể đứng trước danh từ (this book) hoặc đứng một mình làm đại từ (This is my book). Trong hội thoại điện thoại: <em>This is Anna</em> (tôi là Anna), <em>Is that Tom?</em> (có phải Tom không?).</p><p>Cũng dùng cho thời gian: this week (tuần này), those days (những ngày đó).</p>",
    examples: [
      { sentence: "This laptop is mine, and that one is yours.", meaningVi: "Laptop này là của tôi, còn cái kia là của bạn." },
      { sentence: "These shoes are too small.", meaningVi: "Đôi giày này chật quá." },
      { sentence: "Who are those people over there?", meaningVi: "Những người đằng kia là ai vậy?" },
      { sentence: "Hello, this is Minh speaking.", meaningVi: "A lô, Minh đang nghe đây ạ." },
    ],
    commonMistakes: "❌ this books ✅ these books | ❌ These is my friend. ✅ This is my friend. | ❌ that ones ✅ those ones / those",
    comparedWith: "Khác mạo từ 'the': the chỉ xác định chung chung, còn this/that nhấn mạnh vị trí gần/xa so với người nói.",
  },
  {
    level: "A1",
    title: "There is / There are — Cấu trúc tồn tại 'có'",
    structure: "There is + N số ít/không đếm được | There are + N số nhiều",
    explanation:
      "<p><strong>There is/There are</strong> dùng để nói cái gì <strong>tồn tại/có</strong> ở đâu đó — tương đương 'có' trong tiếng Việt: <em>There is a cat in the garden</em> = Có một con mèo trong vườn.</p><p>Chọn is/are theo danh từ đứng NGAY SAU: There <strong>is</strong> a book (số ít), There <strong>are</strong> two books (số nhiều), There <strong>is</strong> some water (không đếm được). Phủ định: There isn't/aren't... Câu hỏi: Is there...? / Are there...?</p><p>Đừng dịch 'có' thành 'have': <em>Có nhiều người</em> → There are many people, KHÔNG phải 'Have many people'.</p>",
    examples: [
      { sentence: "There is a bug in this function.", meaningVi: "Có một lỗi trong hàm này." },
      { sentence: "There are 25 students in my class.", meaningVi: "Lớp tôi có 25 học sinh." },
      { sentence: "Is there a coffee shop near here? — Yes, there is.", meaningVi: "Gần đây có quán cà phê không? — Có." },
      { sentence: "There isn't any milk in the fridge.", meaningVi: "Trong tủ lạnh không còn tí sữa nào." },
    ],
    commonMistakes: "❌ Have many people in the room. ✅ There are many people in the room. | ❌ There is two chairs. ✅ There are two chairs.",
    comparedWith: "'It is' mô tả đặc điểm (It is cold today), còn 'There is' nói sự tồn tại (There is a problem). Đừng dùng lẫn.",
  },
  {
    level: "A1",
    title: "Have got / Has got — Diễn tả sở hữu",
    structure: "S + have/has got + N | S + haven't/hasn't got + N | Have/Has + S + got...?",
    explanation:
      "<p><strong>Have got</strong> (Anh-Anh, văn nói) và <strong>have</strong> (trung tính, Anh-Mỹ) đều diễn tả <strong>sở hữu, quan hệ, đặc điểm, bệnh tật</strong>: I've got a car = I have a car.</p><p>He/she/it dùng <strong>has got</strong>. Phủ định và câu hỏi của have got KHÔNG cần do/does: <em>Have you got a pen?</em> / <em>She hasn't got time</em>. Nhưng với have thường thì cần: <em>Do you have a pen?</em></p><p>Lưu ý: have got chỉ dùng ở HIỆN TẠI; quá khứ dùng had (không dùng 'had got').</p>",
    examples: [
      { sentence: "I have got two monitors at my desk.", meaningVi: "Bàn làm việc của tôi có hai màn hình." },
      { sentence: "She has got long black hair.", meaningVi: "Cô ấy có mái tóc đen dài." },
      { sentence: "Have you got a minute? I need your help.", meaningVi: "Bạn có rảnh một phút không? Tôi cần bạn giúp." },
      { sentence: "We haven't got any meetings today.", meaningVi: "Hôm nay chúng tôi không có cuộc họp nào." },
    ],
    commonMistakes: "❌ Do you have got a car? ✅ Have you got a car? / Do you have a car? | ❌ He have got... ✅ He has got...",
    comparedWith: "'Have' còn dùng trong cụm hành động (have breakfast, have a shower) — khi đó KHÔNG thay bằng have got được.",
  },
  {
    level: "A1",
    title: "Can / Can't — Khả năng & xin phép",
    structure: "S + can/can't + V(nguyên mẫu) | Can + S + V?",
    explanation:
      "<p><strong>Can</strong> là động từ khuyết thiếu diễn tả: <strong>khả năng</strong> (I can swim), <strong>sự cho phép</strong> (You can go now), <strong>lời đề nghị/yêu cầu</strong> (Can you help me?).</p><p>Ba quy tắc vàng của động từ khuyết thiếu: không thêm -s ở ngôi 3 (she can, KHÔNG 'she cans'); sau can là <strong>động từ nguyên mẫu không to</strong>; câu hỏi đảo can lên trước, không dùng do/does.</p><p>Phát âm: trong câu khẳng định can đọc yếu /kən/, còn can't đọc mạnh /kɑːnt/ — nghe kỹ để không nhầm nghĩa ngược nhau.</p>",
    examples: [
      { sentence: "She can speak three languages.", meaningVi: "Cô ấy nói được ba thứ tiếng." },
      { sentence: "I can't come to the party tonight.", meaningVi: "Tối nay tôi không đến bữa tiệc được." },
      { sentence: "Can I use your phone? — Sure, go ahead.", meaningVi: "Tôi dùng điện thoại của bạn được không? — Được chứ, cứ tự nhiên." },
      { sentence: "Can you send me the file, please?", meaningVi: "Bạn gửi cho tôi cái file được không?" },
    ],
    commonMistakes: "❌ She cans swim. ✅ She can swim. | ❌ I can to drive. ✅ I can drive. | ❌ Do you can help? ✅ Can you help?",
    comparedWith: "'Could' là dạng lịch sự hơn khi nhờ vả (Could you help me?) và là quá khứ của can (When I was young, I could run fast).",
  },
  {
    level: "A1",
    title: "Imperatives — Câu mệnh lệnh",
    structure: "V(nguyên mẫu)... | Don't + V... | Let's + V...",
    explanation:
      "<p>Câu mệnh lệnh dùng <strong>động từ nguyên mẫu không chủ ngữ</strong> để ra lệnh, hướng dẫn, mời, cảnh báo: <em>Open the door. Click the button. Be careful!</em></p><p>Phủ định thêm <strong>Don't</strong>: Don't touch that! Thêm <strong>please</strong> đầu hoặc cuối câu cho lịch sự. <strong>Let's + V</strong> là lời rủ cả nhóm cùng làm: Let's take a break.</p><p>Câu mệnh lệnh rất phổ biến trong tài liệu kỹ thuật và giao diện phần mềm: <em>Enter your password. Do not share this key.</em></p>",
    examples: [
      { sentence: "Please sit down and open your books.", meaningVi: "Mời ngồi xuống và mở sách ra." },
      { sentence: "Don't forget to save your work.", meaningVi: "Đừng quên lưu bài làm của bạn." },
      { sentence: "Let's start the meeting.", meaningVi: "Chúng ta bắt đầu cuộc họp nào." },
      { sentence: "Turn left at the traffic lights.", meaningVi: "Rẽ trái ở chỗ đèn giao thông." },
    ],
    commonMistakes: "❌ You open the door! (nghe cộc lốc/trách móc) ✅ Open the door, please. | ❌ Don't to go. ✅ Don't go. | ❌ Let's to eat. ✅ Let's eat.",
    comparedWith: "Muốn lịch sự hơn nữa dùng câu hỏi: Could you open the door? (xem bài Polite Requests ở A2).",
  },
  {
    level: "A1",
    title: "Prepositions of Time & Place: in/on/at — Giới từ thời gian & nơi chốn",
    structure: "at + giờ/điểm | on + ngày/bề mặt | in + tháng,năm/không gian kín",
    explanation:
      "<p>Quy tắc theo độ lớn, từ nhỏ đến lớn:</p><ul><li><strong>AT</strong> — điểm cụ thể: at 7 o'clock, at night, at the weekend (Anh-Anh); at the door, at work, at school.</li><li><strong>ON</strong> — ngày & bề mặt: on Monday, on 2nd May, on my birthday; on the table, on the wall, on the bus.</li><li><strong>IN</strong> — khoảng dài & không gian bao quanh: in June, in 2025, in the morning, in winter; in the room, in Hanoi, in a car.</li></ul><p>Học theo cụm cố định sẽ nhanh hơn học quy tắc: <em>in the morning</em> nhưng <em>at night</em>; <em>on the bus</em> nhưng <em>in a taxi</em>.</p>",
    examples: [
      { sentence: "The meeting starts at 9 a.m. on Monday.", meaningVi: "Cuộc họp bắt đầu lúc 9 giờ sáng thứ Hai." },
      { sentence: "I was born in 1998, in Da Nang.", meaningVi: "Tôi sinh năm 1998, ở Đà Nẵng." },
      { sentence: "Your keys are on the table.", meaningVi: "Chìa khóa của bạn ở trên bàn." },
      { sentence: "She is at work now; she'll be home in the evening.", meaningVi: "Bây giờ cô ấy đang ở chỗ làm; buổi tối cô ấy sẽ về nhà." },
    ],
    commonMistakes: "❌ in Monday ✅ on Monday | ❌ on the morning ✅ in the morning | ❌ at 2025 ✅ in 2025 | ❌ in night ✅ at night",
    comparedWith: "Với 'home' không dùng giới từ chuyển động: go home (KHÔNG 'go to home'), nhưng vẫn nói at home.",
  },
  {
    level: "A1",
    title: "Wh-questions — Câu hỏi với từ để hỏi",
    structure: "Wh-word + do/does/is/are... + S + V?",
    explanation:
      "<p>Từ để hỏi: <strong>What</strong> (gì), <strong>Where</strong> (đâu), <strong>When</strong> (khi nào), <strong>Who</strong> (ai), <strong>Why</strong> (tại sao), <strong>Which</strong> (cái nào), <strong>Whose</strong> (của ai), <strong>How</strong> (thế nào) + biến thể How much/many/old/often/long.</p><p>Trật tự chuẩn: <strong>Từ hỏi + trợ động từ + chủ ngữ + động từ</strong>: Where do you live? What is she doing? — khác hẳn tiếng Việt nên phải luyện phản xạ đảo trợ động từ.</p><p>Ngoại lệ: khi từ hỏi chính là CHỦ NGỮ thì không cần trợ động từ: <em>Who called you?</em> (không phải 'Who did call you?').</p>",
    examples: [
      { sentence: "Where do you work?", meaningVi: "Bạn làm việc ở đâu?" },
      { sentence: "Why is the app so slow today?", meaningVi: "Sao hôm nay cái app chậm thế?" },
      { sentence: "How often do you exercise?", meaningVi: "Bạn tập thể dục thường xuyên như thế nào?" },
      { sentence: "Who wrote this code?", meaningVi: "Ai đã viết đoạn code này?" },
    ],
    commonMistakes: "❌ Where you live? ✅ Where do you live? | ❌ What she is doing? ✅ What is she doing? | ❌ Who did call you? (khi who là chủ ngữ) ✅ Who called you?",
    comparedWith: "Câu hỏi Yes/No không có từ hỏi, chỉ đảo trợ động từ: Do you like coffee? — ngữ điệu lên ở cuối, còn câu hỏi Wh- xuống giọng.",
  },
  {
    level: "A1",
    title: "Past Simple — Thì quá khứ đơn",
    structure: "S + V-ed / V2 | S + didn't + V | Did + S + V?",
    explanation:
      "<p>Thì <strong>quá khứ đơn</strong> kể về hành động <strong>đã xảy ra và kết thúc</strong> tại thời điểm xác định trong quá khứ. Dấu hiệu: yesterday, last week, in 2020, two days ago.</p><p>Động từ có quy tắc thêm <strong>-ed</strong> (worked, played); động từ bất quy tắc phải học thuộc cột 2: go → went, have → had, see → saw, do → did, make → made, get → got...</p><p>Phủ định và câu hỏi dùng <strong>did</strong> — và khi có did, động từ chính trở về <strong>nguyên mẫu</strong>: I didn't <strong>go</strong> (không phải 'didn't went'). To be chia riêng: was/were.</p>",
    examples: [
      { sentence: "I finished the report yesterday.", meaningVi: "Tôi đã hoàn thành báo cáo hôm qua." },
      { sentence: "She went to Japan last summer.", meaningVi: "Cô ấy đã đi Nhật hè năm ngoái." },
      { sentence: "We didn't see the error message.", meaningVi: "Chúng tôi đã không nhìn thấy thông báo lỗi." },
      { sentence: "Did you watch the match last night? — Yes, I did.", meaningVi: "Tối qua bạn có xem trận đấu không? — Có." },
    ],
    commonMistakes: "❌ I didn't went. ✅ I didn't go. | ❌ Did she called you? ✅ Did she call you? | ❌ He goed home. ✅ He went home.",
    comparedWith: "Khác hiện tại hoàn thành: quá khứ đơn gắn với THỜI ĐIỂM cụ thể đã qua (I saw him yesterday), hiện tại hoàn thành không nêu thời điểm và còn liên hệ tới hiện tại (I have seen him — xem B1).",
  },
  {
    level: "A1",
    title: "Like / Love / Hate + V-ing — Diễn tả sở thích",
    structure: "S + like/love/enjoy/hate + V-ing (hoặc + danh từ)",
    explanation:
      "<p>Nói về <strong>sở thích và điều không thích</strong>, sau like, love, enjoy, hate, don't mind, can't stand ta dùng <strong>V-ing</strong> hoặc danh từ: I like read<strong>ing</strong>. She hates wait<strong>ing</strong>.</p><p>Thang mức độ tiện dùng: love ❤️ &gt; really like &gt; like &gt; don't mind (không phiền) &gt; don't like &gt; hate &gt; can't stand (không chịu nổi).</p><p>Lưu ý: like + to V cũng đúng (nhất là Anh-Mỹ) nhưng ở trình độ này cứ quen dùng V-ing cho an toàn; riêng <strong>enjoy</strong> và <strong>can't stand</strong> thì BẮT BUỘC V-ing.</p>",
    examples: [
      { sentence: "I love working from home.", meaningVi: "Tôi rất thích làm việc tại nhà." },
      { sentence: "She enjoys cooking on weekends.", meaningVi: "Cô ấy thích nấu ăn vào cuối tuần." },
      { sentence: "He hates being late.", meaningVi: "Anh ấy ghét bị trễ giờ." },
      { sentence: "I don't mind getting up early.", meaningVi: "Tôi không ngại dậy sớm." },
    ],
    commonMistakes: "❌ I enjoy to read. ✅ I enjoy reading. | ❌ She like swimming. ✅ She likes swimming. | ❌ I very like it. ✅ I really like it.",
    comparedWith: "'Would like' KHÁC 'like': would like = muốn (lịch sự, một lần cụ thể) — I'd like a coffee; like = thích (nói chung) — I like coffee.",
  },
  // ==================== A2 (15) ====================
  {
    level: "A2",
    title: "Past Continuous — Thì quá khứ tiếp diễn",
    structure: "S + was/were + V-ing",
    explanation:
      "<p>Thì <strong>quá khứ tiếp diễn</strong> diễn tả hành động <strong>đang diễn ra tại một thời điểm trong quá khứ</strong>, hoặc làm 'phông nền' cho một hành động khác xen vào.</p><p>Cấu trúc kinh điển với <strong>when/while</strong>: hành động dài dùng quá khứ tiếp diễn, hành động ngắn xen vào dùng quá khứ đơn: <em>I <strong>was cooking</strong> when the phone <strong>rang</strong>.</em></p><p>Hai hành động song song cùng lúc dùng while + hai vế tiếp diễn: <em>While I was coding, she was testing.</em></p>",
    examples: [
      { sentence: "At 8 p.m. last night, I was watching a movie.", meaningVi: "Lúc 8 giờ tối qua, tôi đang xem phim." },
      { sentence: "She was driving to work when it started to rain.", meaningVi: "Cô ấy đang lái xe đi làm thì trời bắt đầu mưa." },
      { sentence: "While we were testing, the server crashed.", meaningVi: "Trong lúc chúng tôi đang kiểm thử thì máy chủ sập." },
      { sentence: "They weren't listening when the teacher explained the rule.", meaningVi: "Họ đã không lắng nghe khi giáo viên giải thích quy tắc." },
    ],
    commonMistakes: "❌ I was cook dinner. ✅ I was cooking dinner. | ❌ When I was seeing him, I said hello. ✅ When I saw him, I said hello (hành động ngắn dùng quá khứ đơn).",
    comparedWith: "Quá khứ đơn = hành động trọn vẹn, nối tiếp nhau (I got up, had breakfast and left). Quá khứ tiếp diễn = cảnh nền đang dang dở.",
  },
  {
    level: "A2",
    title: "Present Perfect — Thì hiện tại hoàn thành (cơ bản)",
    structure: "S + have/has + V3 (past participle)",
    explanation:
      "<p>Thì <strong>hiện tại hoàn thành</strong> nối quá khứ với hiện tại. Ba cách dùng chính ở trình độ này:</p><ul><li><strong>Trải nghiệm</strong> (đã từng, không nói rõ khi nào): I <strong>have been</strong> to Singapore. Have you <strong>ever</strong> eaten sushi?</li><li><strong>Kết quả còn ảnh hưởng hiện tại</strong>: I <strong>have lost</strong> my keys (→ giờ vẫn chưa có chìa).</li><li><strong>Vừa mới xảy ra</strong> với just/already/yet: She <strong>has just</strong> arrived. I haven't finished <strong>yet</strong>.</li></ul><p>Quy tắc vàng: hiện tại hoàn thành <strong>KHÔNG đi với thời điểm quá khứ cụ thể</strong> (yesterday, last year, in 2020) — khi có mốc thời gian, chuyển sang quá khứ đơn.</p>",
    examples: [
      { sentence: "I have visited Japan twice.", meaningVi: "Tôi đã đến Nhật hai lần." },
      { sentence: "Have you ever tried Vietnamese coffee?", meaningVi: "Bạn đã bao giờ thử cà phê Việt Nam chưa?" },
      { sentence: "She has just finished the report.", meaningVi: "Cô ấy vừa mới hoàn thành báo cáo." },
      { sentence: "I haven't seen that movie yet.", meaningVi: "Tôi vẫn chưa xem bộ phim đó." },
    ],
    commonMistakes: "❌ I have seen him yesterday. ✅ I saw him yesterday. | ❌ Did you ever eat sushi? (nghĩa trải nghiệm) ✅ Have you ever eaten sushi? | ❌ She has went. ✅ She has gone.",
    comparedWith: "have gone to (đã đi và chưa về) ≠ have been to (đã từng đến và đã quay về): He has gone to Paris = anh ấy đang ở đó.",
  },
  {
    level: "A2",
    title: "Be going to — Dự định & dự đoán có căn cứ",
    structure: "S + am/is/are + going to + V",
    explanation:
      "<p><strong>Be going to</strong> có hai nghĩa chính:</p><ul><li><strong>Dự định đã quyết từ trước</strong>: I'm going to learn React next month (đã lên kế hoạch, không phải quyết ngay lúc nói).</li><li><strong>Dự đoán dựa trên dấu hiệu nhìn thấy</strong>: Look at those clouds — it's going to rain! (mây đen = căn cứ rõ ràng).</li></ul><p>Trong văn nói thân mật, going to thường đọc nhanh thành <em>gonna</em>. Hiện tại tiếp diễn cũng dùng cho kế hoạch đã <strong>chốt lịch cụ thể</strong>: I'm meeting Nam at 7 (đã hẹn).</p>",
    examples: [
      { sentence: "We are going to launch the new feature next week.", meaningVi: "Tuần sau chúng tôi sẽ ra mắt tính năng mới." },
      { sentence: "I'm going to study abroad after graduation.", meaningVi: "Tôi định đi du học sau khi tốt nghiệp." },
      { sentence: "Be careful! You're going to drop the glass!", meaningVi: "Cẩn thận! Bạn sắp làm rơi cái cốc kìa!" },
      { sentence: "She isn't going to accept that offer.", meaningVi: "Cô ấy sẽ không nhận lời đề nghị đó đâu." },
    ],
    commonMistakes: "❌ I going to call him. ✅ I am going to call him. | ❌ It will rain! (khi thấy mây đen — dấu hiệu rõ) ✅ It's going to rain!",
    comparedWith: "'Will' = quyết định ngay lúc nói hoặc dự đoán cảm tính; 'be going to' = dự định có sẵn hoặc dự đoán có bằng chứng (xem bài Will/Won't).",
  },
  {
    level: "A2",
    title: "Will / Won't — Thì tương lai đơn",
    structure: "S + will/won't + V(nguyên mẫu)",
    explanation:
      "<p><strong>Will</strong> dùng cho: <strong>quyết định tức thời</strong> ngay lúc nói (The phone is ringing — I'll get it!), <strong>lời hứa/đề nghị giúp đỡ</strong> (I'll help you), <strong>dự đoán cảm tính</strong> (I think it will be fine), và <strong>sự thật tương lai</strong> (I will be 30 next year).</p><p>Will dùng cho MỌI ngôi, không đổi dạng; phủ định là <strong>won't</strong> (= will not). Dạng rút gọn 'll rất phổ biến trong văn nói: I'll, she'll, we'll.</p><p>Với dự đoán, hay đi kèm: I think, probably, maybe, I'm sure.</p>",
    examples: [
      { sentence: "Don't worry, I will send you the document tonight.", meaningVi: "Đừng lo, tối nay tôi sẽ gửi bạn tài liệu." },
      { sentence: "It's heavy — I'll help you carry it.", meaningVi: "Nặng đấy — để tôi giúp bạn khiêng." },
      { sentence: "I think robots will do most of this work in the future.", meaningVi: "Tôi nghĩ trong tương lai robot sẽ làm phần lớn công việc này." },
      { sentence: "She won't agree with this plan.", meaningVi: "Cô ấy sẽ không đồng ý với kế hoạch này đâu." },
    ],
    commonMistakes: "❌ I will to go. ✅ I will go. | ❌ He wills come. ✅ He will come. | ❌ I'm going to answer it! (điện thoại vừa reo — quyết định tức thời) ✅ I'll answer it!",
    comparedWith: "will (quyết ngay lúc nói) ↔ be going to (đã định trước) ↔ hiện tại tiếp diễn (đã chốt lịch hẹn cụ thể). Xem tổng kết ở B1.",
  },
  {
    level: "A2",
    title: "Comparatives — So sánh hơn",
    structure: "adj ngắn + -er + than | more + adj dài + than",
    explanation:
      "<p><strong>So sánh hơn</strong> giữa hai đối tượng: tính từ <strong>ngắn</strong> (1 âm tiết) thêm <strong>-er</strong>: taller, faster; kết thúc phụ âm+nguyên âm+phụ âm thì gấp đôi: big → bi<strong>gg</strong>er; đuôi -y đổi thành -ier: happy → happ<strong>ier</strong>.</p><p>Tính từ <strong>dài</strong> (2+ âm tiết) dùng <strong>more</strong>: more expensive, more beautiful. Bất quy tắc: good → <strong>better</strong>, bad → <strong>worse</strong>, far → <strong>further</strong>.</p><p>Nhấn mạnh mức chênh: <strong>much/far/a lot</strong> + so sánh hơn (much better); chênh ít: <strong>a bit/slightly</strong> (a bit cheaper).</p>",
    examples: [
      { sentence: "This laptop is faster than my old one.", meaningVi: "Chiếc laptop này nhanh hơn cái cũ của tôi." },
      { sentence: "Living in the city is more expensive than in the countryside.", meaningVi: "Sống ở thành phố đắt đỏ hơn ở nông thôn." },
      { sentence: "Her English is much better than mine.", meaningVi: "Tiếng Anh của cô ấy tốt hơn của tôi nhiều." },
      { sentence: "The traffic today is worse than yesterday.", meaningVi: "Giao thông hôm nay tệ hơn hôm qua." },
    ],
    commonMistakes: "❌ more taller ✅ taller | ❌ gooder ✅ better | ❌ expensiver ✅ more expensive | ❌ better that mine ✅ better than mine",
    comparedWith: "So sánh bằng dùng as...as: This phone is as good as that one (xem bài as...as ở B1). So sánh nhất (the + -est) so trong nhóm từ 3 trở lên.",
  },
  {
    level: "A2",
    title: "Superlatives — So sánh nhất",
    structure: "the + adj ngắn + -est | the most + adj dài (+ in/of...)",
    explanation:
      "<p><strong>So sánh nhất</strong> chọn ra đối tượng đứng đầu trong nhóm từ 3 trở lên. Luôn có <strong>the</strong> phía trước: the tallest, the most important.</p><p>Quy tắc biến đổi giống so sánh hơn: -est cho tính từ ngắn (biggest, happiest), most cho tính từ dài. Bất quy tắc: good → the <strong>best</strong>, bad → the <strong>worst</strong>, far → the <strong>furthest</strong>.</p><p>Phạm vi so sánh dùng <strong>in</strong> + nơi chốn/nhóm (the best in the world, the youngest in the team) hoặc <strong>of</strong> + số lượng (the smartest of the three). Rất hay kết hợp hiện tại hoàn thành: <em>the best movie I have ever seen</em>.</p>",
    examples: [
      { sentence: "Ha Long Bay is one of the most beautiful places in Vietnam.", meaningVi: "Vịnh Hạ Long là một trong những nơi đẹp nhất Việt Nam." },
      { sentence: "This is the cheapest option available.", meaningVi: "Đây là lựa chọn rẻ nhất hiện có." },
      { sentence: "He is the most experienced developer on the team.", meaningVi: "Anh ấy là lập trình viên giàu kinh nghiệm nhất trong nhóm." },
      { sentence: "That was the worst decision I have ever made.", meaningVi: "Đó là quyết định tệ nhất tôi từng đưa ra." },
    ],
    commonMistakes: "❌ the most tallest ✅ the tallest | ❌ He is best player in the team. ✅ He is the best player in the team. | ❌ the best of the world ✅ the best in the world",
    comparedWith: "Hai đối tượng → so sánh hơn (the taller of the two), từ ba trở lên → so sánh nhất.",
  },
  {
    level: "A2",
    title: "Countable & Uncountable + some/any/much/many — Danh từ đếm được & không đếm được",
    structure: "many/a few + N đếm được | much/a little + N không đếm được | some/any/a lot of + cả hai",
    explanation:
      "<p>Danh từ <strong>đếm được</strong> có số ít/số nhiều (a book, two books). Danh từ <strong>không đếm được</strong> không có số nhiều và không đi với a/an: water, money, rice, <strong>information, advice, furniture, news</strong> (4 từ này người Việt rất hay nhầm là đếm được!).</p><p>Cách chọn từ chỉ lượng:</p><ul><li><strong>some</strong> — câu khẳng định & lời mời: some water, some apples.</li><li><strong>any</strong> — phủ định & câu hỏi: I don't have any money. Any questions?</li><li><strong>many/a few</strong> + đếm được; <strong>much/a little</strong> + không đếm được; <strong>a lot of</strong> + cả hai.</li></ul><p>Muốn đếm danh từ không đếm được thì thêm đơn vị: a <strong>piece of</strong> advice, a <strong>glass of</strong> water, a <strong>bit of</strong> luck.</p>",
    examples: [
      { sentence: "How much money do you need?", meaningVi: "Bạn cần bao nhiêu tiền?" },
      { sentence: "There aren't many bugs left in the code.", meaningVi: "Không còn nhiều lỗi trong code nữa." },
      { sentence: "Can you give me some advice?", meaningVi: "Bạn cho tôi vài lời khuyên được không?" },
      { sentence: "We have a little time and a few options.", meaningVi: "Chúng ta có một chút thời gian và một vài lựa chọn." },
    ],
    commonMistakes: "❌ an information, advices ✅ some information, some advice | ❌ How many money? ✅ How much money? | ❌ I don't have some money. ✅ I don't have any money.",
    comparedWith: "a few/a little (một ít — nghĩa tích cực, đủ dùng) ≠ few/little (rất ít — nghĩa tiêu cực, gần như không có): I have a little time ↔ I have little time.",
  },
  {
    level: "A2",
    title: "Adverbs of Frequency & Manner — Trạng từ tần suất & cách thức",
    structure: "S + always/often/never + V | S + be + always... | V + adj-ly",
    explanation:
      "<p><strong>Trạng từ tần suất</strong> theo thang: always (100%) &gt; usually &gt; often &gt; sometimes &gt; rarely/seldom &gt; never (0%). Vị trí: <strong>TRƯỚC động từ thường</strong> (I always get up early) nhưng <strong>SAU to be</strong> (She is always late).</p><p><strong>Trạng từ cách thức</strong> mô tả làm việc gì đó như thế nào, thường = tính từ + <strong>-ly</strong>: quick → quickly, careful → carefully. Bất quy tắc: good → <strong>well</strong>; fast, hard, late giữ nguyên (chú ý: <em>hardly</em> = hầu như không, KHÔNG phải 'chăm chỉ').</p><p>Trạng từ cách thức thường đứng sau động từ hoặc sau tân ngữ: She speaks English <strong>fluently</strong>.</p>",
    examples: [
      { sentence: "I usually have coffee before work.", meaningVi: "Tôi thường uống cà phê trước giờ làm." },
      { sentence: "He is never late for meetings.", meaningVi: "Anh ấy không bao giờ trễ họp." },
      { sentence: "She solved the problem quickly and carefully.", meaningVi: "Cô ấy giải quyết vấn đề nhanh chóng và cẩn thận." },
      { sentence: "My grandfather works hard and cooks very well.", meaningVi: "Ông tôi làm việc chăm chỉ và nấu ăn rất ngon." },
    ],
    commonMistakes: "❌ I get up always early. ✅ I always get up early. | ❌ She always is happy. ✅ She is always happy. | ❌ He drives very good. ✅ He drives very well. | ❌ He works hardly. ✅ He works hard.",
    comparedWith: "Tính từ mô tả DANH TỪ (a careful driver), trạng từ mô tả ĐỘNG TỪ (drive carefully) — sau động từ nối (be, look, sound, feel) vẫn dùng TÍNH TỪ: It sounds good.",
  },
  {
    level: "A2",
    title: "Must / Have to / Should — Nghĩa vụ & lời khuyên",
    structure: "S + must/have to + V (bắt buộc) | S + should/shouldn't + V (nên/không nên)",
    explanation:
      "<p>Ba mức độ:</p><ul><li><strong>must / have to</strong> — bắt buộc: must thiên về mệnh lệnh từ chính người nói (You must finish this today), have to thiên về quy định bên ngoài (I have to wear a uniform).</li><li><strong>should</strong> — lời khuyên: You should sleep more.</li><li><strong>don't have to</strong> — KHÔNG cần (không bắt buộc) ≠ <strong>mustn't</strong> — CẤM. Đây là cặp gây hiểu nhầm nguy hiểm nhất: You don't have to pay (không cần trả) ↔ You mustn't smoke here (cấm hút thuốc).</li></ul><p>Have to chia theo ngôi và thì (has to, had to); must không có dạng quá khứ — quá khứ dùng had to.</p>",
    examples: [
      { sentence: "You must wear a helmet when riding a motorbike.", meaningVi: "Bạn phải đội mũ bảo hiểm khi đi xe máy." },
      { sentence: "I have to submit the report by Friday.", meaningVi: "Tôi phải nộp báo cáo trước thứ Sáu." },
      { sentence: "You should review the code before merging it.", meaningVi: "Bạn nên xem lại code trước khi merge." },
      { sentence: "Tomorrow is a holiday, so you don't have to come to the office.", meaningVi: "Mai là ngày nghỉ nên bạn không cần đến văn phòng." },
    ],
    commonMistakes: "❌ You mustn't pay — it's free. (mustn't = CẤM) ✅ You don't have to pay — it's free. | ❌ He must to go. ✅ He must go. | ❌ She have to work. ✅ She has to work.",
    comparedWith: "'Must' còn dùng để phỏng đoán chắc chắn (You must be tired — chắc bạn mệt lắm) — xem bài Modals of Deduction ở B1.",
  },
  {
    level: "A2",
    title: "Zero & First Conditional — Câu điều kiện loại 0 & loại 1",
    structure: "Loại 0: If + hiện tại đơn, hiện tại đơn | Loại 1: If + hiện tại đơn, will + V",
    explanation:
      "<p><strong>Loại 0</strong> — chân lý, quy luật luôn đúng: <em>If you heat water to 100°C, it <strong>boils</strong>.</em> Cả hai vế đều hiện tại đơn; if có thể thay bằng when.</p><p><strong>Loại 1</strong> — điều kiện <strong>có thật ở tương lai</strong>: <em>If it rains tomorrow, I <strong>will stay</strong> home.</em> Vế if dùng hiện tại đơn (KHÔNG dùng will trong vế if!), vế chính dùng will/can/may hoặc câu mệnh lệnh.</p><p><strong>Unless</strong> = if not: <em>Unless you hurry, you'll miss the bus</em> = If you don't hurry... Hai vế đổi chỗ được; khi vế if đứng trước thì có dấu phẩy.</p>",
    examples: [
      { sentence: "If you press this button, the machine stops.", meaningVi: "Nếu bạn nhấn nút này, máy sẽ dừng." },
      { sentence: "If it rains tomorrow, we will cancel the trip.", meaningVi: "Nếu mai trời mưa, chúng tôi sẽ hủy chuyến đi." },
      { sentence: "You won't pass the exam unless you study harder.", meaningVi: "Bạn sẽ không qua kỳ thi trừ khi học chăm hơn." },
      { sentence: "If the test fails, check the logs first.", meaningVi: "Nếu test thất bại, hãy kiểm tra log trước tiên." },
    ],
    commonMistakes: "❌ If it will rain, I will stay home. ✅ If it rains, I will stay home. | ❌ Unless you don't hurry... ✅ Unless you hurry... (unless đã mang nghĩa phủ định)",
    comparedWith: "Loại 2 (If I had..., I would...) nói về điều KHÔNG có thật ở hiện tại — xem B1. Loại 1 = khả năng thật, loại 2 = giả định.",
  },
  {
    level: "A2",
    title: "Too / Enough — Quá... / Đủ...",
    structure: "too + adj (+ to V) | adj + enough (+ to V) | enough + N",
    explanation:
      "<p><strong>Too</strong> + tính từ/trạng từ = <strong>quá</strong> mức cần thiết, mang nghĩa TIÊU CỰC: too expensive (đắt quá → không mua được). Đừng nhầm với very (rất — trung tính): very hot chỉ là rất nóng, too hot là nóng đến mức không chịu được.</p><p><strong>Enough</strong> = đủ: đứng <strong>SAU tính từ</strong> (good <strong>enough</strong>, old enough) nhưng đứng <strong>TRƯỚC danh từ</strong> (enough <strong>money</strong>, enough time).</p><p>Cả hai thường đi với to V: <em>too tired <strong>to work</strong></em> (mệt quá không làm nổi), <em>old enough <strong>to vote</strong></em> (đủ tuổi bầu cử). Có thể thêm for + người: too spicy for me.</p>",
    examples: [
      { sentence: "This coffee is too hot to drink.", meaningVi: "Cà phê này nóng quá không uống được." },
      { sentence: "He isn't experienced enough to lead the project.", meaningVi: "Anh ấy chưa đủ kinh nghiệm để dẫn dắt dự án." },
      { sentence: "We don't have enough time to test everything.", meaningVi: "Chúng ta không có đủ thời gian để kiểm thử mọi thứ." },
      { sentence: "The music is too loud for me.", meaningVi: "Nhạc to quá đối với tôi." },
    ],
    commonMistakes: "❌ enough good ✅ good enough | ❌ money enough ✅ enough money | ❌ I'm too happy today! (too = tiêu cực) ✅ I'm very happy today!",
    comparedWith: "so + adj (rất, cảm thán: so beautiful!) ≠ too + adj (quá mức, tiêu cực) ≠ very + adj (rất, trung tính).",
  },
  {
    level: "A2",
    title: "Infinitive of Purpose — 'to V' chỉ mục đích",
    structure: "S + V... + to + V(nguyên mẫu) (để làm gì)",
    explanation:
      "<p>Muốn nói <strong>làm gì ĐỂ làm gì</strong>, tiếng Anh dùng <strong>to + động từ nguyên mẫu</strong>: <em>I went to the store <strong>to buy</strong> milk</em> = Tôi ra cửa hàng để mua sữa.</p><p>Lỗi kinh điển của người Việt là dịch 'để' thành <strong>for + V</strong>: ❌ I came here for study. Đúng phải là: ✅ I came here <strong>to study</strong>. Chỉ dùng for + <strong>danh từ</strong>: I came here for the interview.</p><p>Trang trọng hơn có thể dùng <strong>in order to</strong> / <strong>so as to</strong>: In order to improve performance, we cached the results. Phủ định: in order <strong>not</strong> to / so as <strong>not</strong> to + V.</p>",
    examples: [
      { sentence: "I'm learning English to get a better job.", meaningVi: "Tôi học tiếng Anh để kiếm công việc tốt hơn." },
      { sentence: "She called to ask about the schedule.", meaningVi: "Cô ấy gọi để hỏi về lịch trình." },
      { sentence: "We use Docker to keep environments consistent.", meaningVi: "Chúng tôi dùng Docker để giữ môi trường đồng nhất." },
      { sentence: "He left early so as not to miss the train.", meaningVi: "Anh ấy đi sớm để không lỡ chuyến tàu." },
    ],
    commonMistakes: "❌ I study English for get a job. ✅ I study English to get a job. | ❌ for to learn ✅ to learn | ❌ I went home for sleeping. ✅ I went home to sleep.",
    comparedWith: "so that + mệnh đề đầy đủ cũng chỉ mục đích: I spoke slowly so that everyone could understand (dùng khi hai chủ ngữ khác nhau).",
  },
  {
    level: "A2",
    title: "Possessive 's & of — Sở hữu cách",
    structure: "người/vật sống + 's + N | the N + of + vật/khái niệm",
    explanation:
      "<p>Với <strong>người và con vật</strong>, dùng <strong>'s</strong>: Nam<strong>'s</strong> car (xe của Nam), my mother<strong>'s</strong> job. Danh từ số nhiều tận cùng -s chỉ thêm dấu phẩy trên: my parents<strong>'</strong> house; số nhiều bất quy tắc vẫn 's: the children<strong>'s</strong> toys.</p><p>Với <strong>đồ vật, khái niệm</strong>, thường dùng <strong>of</strong>: the end <strong>of</strong> the movie, the name <strong>of</strong> the street, the back <strong>of</strong> the car.</p><p>Chú ý trật tự ngược tiếng Việt: 'xe của Nam' → <strong>Nam's car</strong> (người sở hữu đứng TRƯỚC). Thời gian cũng dùng 's: today's meeting, next week's plan.</p>",
    examples: [
      { sentence: "This is my sister's laptop.", meaningVi: "Đây là laptop của chị gái tôi." },
      { sentence: "The teacher checked the students' homework.", meaningVi: "Giáo viên kiểm tra bài tập về nhà của các học sinh." },
      { sentence: "I didn't understand the end of the story.", meaningVi: "Tôi không hiểu đoạn kết của câu chuyện." },
      { sentence: "Have you seen today's news?", meaningVi: "Bạn xem tin tức hôm nay chưa?" },
    ],
    commonMistakes: "❌ the car of Nam ✅ Nam's car | ❌ my parent's house (nếu là của cả bố mẹ) ✅ my parents' house | ❌ the table's leg ✅ the leg of the table",
    comparedWith: "Đừng nhầm 's sở hữu với 's rút gọn của is/has: Nam's car (của Nam) ↔ Nam's tired (= Nam is tired) ↔ Nam's finished (= Nam has finished).",
  },
  {
    level: "A2",
    title: "Indefinite Pronouns: something/anyone/nowhere... — Đại từ bất định",
    structure: "some-/any-/no-/every- + -thing/-one/-body/-where",
    explanation:
      "<p>Ghép quy tắc some/any với -thing (vật), -one/-body (người), -where (nơi chốn): <strong>something</strong> (cái gì đó), <strong>anyone</strong> (bất kỳ ai), <strong>nothing</strong> (không gì cả), <strong>everywhere</strong> (khắp nơi).</p><p>Phân bố giống some/any: <strong>some-</strong> trong câu khẳng định và lời mời (Would you like something to drink?); <strong>any-</strong> trong phủ định và câu hỏi (I didn't see anyone); <strong>no-</strong> tự mang nghĩa phủ định nên đi với động từ KHẲNG ĐỊNH: <em>Nobody <strong>knows</strong></em> (không phải 'Nobody doesn't know').</p><p>Các đại từ này là số ít về ngữ pháp: Everyone <strong>is</strong> here. Everything <strong>was</strong> fine.</p>",
    examples: [
      { sentence: "There is something wrong with the server.", meaningVi: "Có gì đó không ổn với máy chủ." },
      { sentence: "I didn't tell anyone about it.", meaningVi: "Tôi chưa kể cho ai về chuyện đó." },
      { sentence: "Nobody knows the answer.", meaningVi: "Không ai biết câu trả lời." },
      { sentence: "Everyone is waiting for you in the meeting room.", meaningVi: "Mọi người đang đợi bạn trong phòng họp." },
    ],
    commonMistakes: "❌ I didn't see nothing. ✅ I didn't see anything. / I saw nothing. | ❌ Everyone are here. ✅ Everyone is here. | ❌ Somebody didn't come? ✅ Didn't anybody come?",
    comparedWith: "Tiếng Anh chuẩn KHÔNG dùng phủ định kép: một câu chỉ một yếu tố phủ định (not + any- HOẶC no-), khác khẩu ngữ một số phương ngữ.",
  },
  {
    level: "A2",
    title: "Polite Requests: Could you...? / Would you mind...? — Yêu cầu lịch sự",
    structure: "Could/Can you + V...? | Would you mind + V-ing...? | Could I + V...?",
    explanation:
      "<p>Kỹ năng giao tiếp thiết yếu — nhờ vả và xin phép một cách lịch sự. Thang lịch sự tăng dần:</p><ul><li><strong>Can you...?</strong> — thân mật: Can you pass the salt?</li><li><strong>Could you...?</strong> — lịch sự, an toàn trong mọi tình huống: Could you send me the file?</li><li><strong>Would you mind + V-ing?</strong> — rất lịch sự: Would you mind closing the door?</li></ul><p>Chú ý trả lời <strong>Would you mind...?</strong>: vì mind = phiền, nên ĐỒNG Ý phải nói <em>No, not at all / Of course not</em> (không phiền gì) — trả lời 'Yes' nghĩa là TỪ CHỐI!</p><p>Xin phép cho bản thân: Could/May I...? (May I come in?). Thêm please để tăng độ lịch sự.</p>",
    examples: [
      { sentence: "Could you explain that again, please?", meaningVi: "Bạn có thể giải thích lại lần nữa được không?" },
      { sentence: "Would you mind turning down the music?", meaningVi: "Bạn có phiền vặn nhỏ nhạc xuống không?" },
      { sentence: "Could I leave a bit early today?", meaningVi: "Hôm nay tôi về sớm một chút được không?" },
      { sentence: "Would you mind if I opened the window?", meaningVi: "Bạn có phiền không nếu tôi mở cửa sổ?" },
    ],
    commonMistakes: "❌ Would you mind to close the door? ✅ Would you mind closing the door? | ❌ (đồng ý) Yes! ✅ No, not at all. / Sure, no problem. (với Could you...?)",
    comparedWith: "Câu mệnh lệnh + please (Open the door, please) vẫn kém lịch sự hơn câu hỏi Could you...; trong email công việc hãy ưu tiên Could you / Would you mind.",
  },
  // ==================== B1 (18) ====================
  {
    level: "B1",
    title: "Present Perfect vs Past Simple — Phân biệt hai thì quá khứ quan trọng nhất",
    structure: "have/has + V3 (không mốc thời gian) ↔ V2 (mốc thời gian xác định)",
    explanation:
      "<p>Cặp thì gây nhầm lẫn nhiều nhất. Nguyên tắc cốt lõi: <strong>quá khứ đơn</strong> = sự kiện đã đóng lại, gắn với thời điểm cụ thể (yesterday, in 2020, when I was a child); <strong>hiện tại hoàn thành</strong> = không nêu thời điểm, còn liên hệ với hiện tại (kinh nghiệm, kết quả, khoảng thời gian chưa kết thúc).</p><p>Dấu hiệu hiện tại hoàn thành: ever, never, just, already, yet, <strong>since + mốc</strong>, <strong>for + khoảng</strong>, so far, recently, this week (tuần chưa hết). Dấu hiệu quá khứ đơn: ago, yesterday, last..., in + năm đã qua, when...?</p><p>Mẹo: hễ trả lời được câu hỏi <em>Khi nào?</em> một cách cụ thể → quá khứ đơn. <em>When did you buy it?</em> (KHÔNG dùng when với hiện tại hoàn thành).</p>",
    examples: [
      { sentence: "I have worked here for three years.", meaningVi: "Tôi làm việc ở đây được ba năm rồi (và vẫn đang làm)." },
      { sentence: "I worked there for three years, then I quit.", meaningVi: "Tôi đã làm ở đó ba năm, rồi nghỉ việc (đã kết thúc)." },
      { sentence: "Have you finished the task? — Yes, I finished it an hour ago.", meaningVi: "Bạn xong việc chưa? — Rồi, tôi xong cách đây một tiếng." },
      { sentence: "She has lived in Hanoi since 2019.", meaningVi: "Cô ấy sống ở Hà Nội từ năm 2019 (đến giờ)." },
    ],
    commonMistakes: "❌ I have met him last week. ✅ I met him last week. | ❌ When have you arrived? ✅ When did you arrive? | ❌ I live here since 2020. ✅ I have lived here since 2020.",
    comparedWith: "since + MỐC thời gian (since Monday, since 2019) ↔ for + KHOẢNG thời gian (for two days, for a long time).",
  },
  {
    level: "B1",
    title: "Present Perfect Continuous — Hiện tại hoàn thành tiếp diễn",
    structure: "S + have/has been + V-ing (+ for/since...)",
    explanation:
      "<p>Nhấn mạnh <strong>quá trình kéo dài liên tục</strong> từ quá khứ đến hiện tại (và thường còn tiếp diễn), hoặc giải thích <strong>dấu vết nhìn thấy được</strong> ở hiện tại: <em>You're sweating — have you been running?</em></p><p>So với hiện tại hoàn thành thường: hoàn thành thường nhấn <strong>kết quả/số lượng</strong> (I have written <strong>five emails</strong>), hoàn thành tiếp diễn nhấn <strong>độ dài hoạt động</strong> (I have been writing emails <strong>all morning</strong>).</p><p>Động từ trạng thái (know, like, have sở hữu, believe) không dùng dạng tiếp diễn: I have <strong>known</strong> her for years (không phải 'have been knowing').</p>",
    examples: [
      { sentence: "I have been learning English for two years.", meaningVi: "Tôi đã học tiếng Anh được hai năm rồi." },
      { sentence: "She has been working on this feature all week.", meaningVi: "Cô ấy đã làm tính năng này cả tuần nay." },
      { sentence: "It has been raining since morning.", meaningVi: "Trời mưa từ sáng đến giờ." },
      { sentence: "Your eyes are red. Have you been crying?", meaningVi: "Mắt bạn đỏ kìa. Bạn vừa khóc à?" },
    ],
    commonMistakes: "❌ I have been knowing him for years. ✅ I have known him for years. | ❌ I am learning English for two years. ✅ I have been learning English for two years.",
    comparedWith: "How long...? thường đi với hoàn thành tiếp diễn (How long have you been waiting?); How many/much...? đi với hoàn thành thường (How many pages have you read?).",
  },
  {
    level: "B1",
    title: "Past Perfect — Thì quá khứ hoàn thành",
    structure: "S + had + V3 (trước một mốc/hành động quá khứ khác)",
    explanation:
      "<p><strong>Quá khứ hoàn thành</strong> = 'quá khứ của quá khứ': diễn tả hành động xảy ra <strong>TRƯỚC</strong> một hành động/mốc thời gian khác trong quá khứ. <em>When I arrived, the meeting <strong>had</strong> already <strong>started</strong></em> — cuộc họp bắt đầu trước khi tôi đến.</p><p>Từ nối thường gặp: after, before, by the time, when, already, just, never...until. Chỉ dùng khi cần làm rõ thứ tự — nếu kể chuyện theo trình tự tự nhiên (first... then...) thì chuỗi quá khứ đơn là đủ.</p><p>Cũng bắt buộc trong câu tường thuật (said that... had done) và câu điều kiện loại 3 (If I had known...).</p>",
    examples: [
      { sentence: "By the time we got to the station, the train had left.", meaningVi: "Khi chúng tôi tới ga thì tàu đã rời đi rồi." },
      { sentence: "She was upset because she had failed the test.", meaningVi: "Cô ấy buồn vì đã trượt bài kiểm tra (trước đó)." },
      { sentence: "I had never used Linux before I started this job.", meaningVi: "Tôi chưa từng dùng Linux trước khi bắt đầu công việc này." },
      { sentence: "After he had finished the report, he went home.", meaningVi: "Sau khi hoàn thành báo cáo, anh ấy về nhà." },
    ],
    commonMistakes: "❌ When I arrived, the meeting already started. (không rõ trước sau) ✅ ...the meeting had already started. | ❌ I had seen him yesterday. (chỉ một sự kiện đơn lẻ) ✅ I saw him yesterday.",
    comparedWith: "Quá khứ đơn kể các sự kiện NỐI TIẾP (came → saw → left); quá khứ hoàn thành nhảy NGƯỢC về trước một mốc quá khứ đã nêu.",
  },
  {
    level: "B1",
    title: "Future Forms Review: will vs going to vs Present Continuous — Tổng kết cách nói tương lai",
    structure: "will + V | be going to + V | am/is/are + V-ing (+ mốc hẹn)",
    explanation:
      "<p>Ba cách nói tương lai phổ biến nhất, chọn theo <strong>mức độ chắc chắn và thời điểm quyết định</strong>:</p><ul><li><strong>Hiện tại tiếp diễn</strong> — lịch hẹn ĐÃ CHỐT, thường có thời gian/địa điểm: I'm meeting the client at 2 p.m.</li><li><strong>Be going to</strong> — dự định đã quyết nhưng chưa chắc đã sắp xếp: We're going to redesign the website.</li><li><strong>Will</strong> — quyết định NGAY LÚC NÓI, lời hứa, dự đoán cảm tính: OK, I'll take care of it.</li></ul><p>Ngoài ra: hiện tại đơn cho lịch trình cố định của tàu xe/sự kiện (The flight leaves at 6 a.m.); dự đoán có bằng chứng nhìn thấy → going to (Look out! We're going to crash!).</p>",
    examples: [
      { sentence: "I'm having dinner with my manager tomorrow night.", meaningVi: "Tối mai tôi ăn tối với sếp (đã hẹn)." },
      { sentence: "We are going to migrate the database next sprint.", meaningVi: "Sprint tới chúng tôi sẽ chuyển đổi cơ sở dữ liệu (đã lên kế hoạch)." },
      { sentence: "The phone's ringing — I'll answer it.", meaningVi: "Điện thoại reo kìa — để tôi nghe (quyết ngay lúc nói)." },
      { sentence: "The conference starts at 9 a.m. on Saturday.", meaningVi: "Hội nghị bắt đầu lúc 9 giờ sáng thứ Bảy (lịch cố định)." },
    ],
    commonMistakes: "❌ I will meet Nam tomorrow. (đã hẹn trước) ✅ I'm meeting Nam tomorrow. | ❌ Look at the clouds — it will rain. ✅ ...it's going to rain.",
    comparedWith: "Sau khung thời gian when/before/after/until/as soon as, tương lai dùng HIỆN TẠI ĐƠN: I'll call you when I arrive (không phải 'when I will arrive').",
  },
  {
    level: "B1",
    title: "Second Conditional — Câu điều kiện loại 2",
    structure: "If + quá khứ đơn, S + would/could/might + V",
    explanation:
      "<p><strong>Loại 2</strong> giả định điều <strong>KHÔNG có thật hoặc rất khó xảy ra ở HIỆN TẠI/TƯƠNG LAI</strong>: <em>If I <strong>had</strong> more time, I <strong>would learn</strong> Japanese</em> — thực tế là tôi không có thời gian.</p><p>Vế if dùng <strong>quá khứ đơn</strong> (nhưng nghĩa hiện tại!), vế chính dùng <strong>would/could/might + V</strong>. Với to be, chuẩn mực dùng <strong>were</strong> cho mọi ngôi: <em>If I <strong>were</strong> you, I would apologize</em> — câu khuyên nhủ kinh điển.</p><p>So với loại 1: loại 1 = khả năng thật (If it rains, I'll stay home — trời có thể mưa thật); loại 2 = giả định trái thực tế (If I were rich... — tôi không giàu).</p>",
    examples: [
      { sentence: "If I won the lottery, I would travel around the world.", meaningVi: "Nếu trúng số, tôi sẽ đi du lịch vòng quanh thế giới." },
      { sentence: "If I were you, I would take that job offer.", meaningVi: "Nếu tôi là bạn, tôi sẽ nhận lời mời làm việc đó." },
      { sentence: "She would be happier if she worked closer to home.", meaningVi: "Cô ấy sẽ hạnh phúc hơn nếu làm việc gần nhà hơn." },
      { sentence: "What would you do if the server went down at midnight?", meaningVi: "Bạn sẽ làm gì nếu máy chủ sập lúc nửa đêm?" },
    ],
    commonMistakes: "❌ If I would have money, I would buy it. ✅ If I had money, I would buy it. | ❌ If I was you... (văn viết chuẩn) ✅ If I were you... | ❌ If I win the lottery, I would... ✅ thống nhất loại: If I won..., I would...",
    comparedWith: "Loại 1 (If it rains, I will...) = có thể xảy ra thật; loại 2 (If it rained, I would...) = giả định. Loại 3 nói về quá khứ đã lỡ — xem B2.",
  },
  {
    level: "B1",
    title: "Passive Voice: Present & Past Simple — Câu bị động cơ bản",
    structure: "S + am/is/are + V3 | S + was/were + V3 (+ by...)",
    explanation:
      "<p>Câu <strong>bị động</strong> dùng khi <strong>đối tượng chịu tác động</strong> quan trọng hơn người thực hiện, hoặc không biết/không cần nêu ai làm: <em>My bike <strong>was stolen</strong></em> (ai trộm không rõ).</p><p>Chuyển đổi: tân ngữ câu chủ động → chủ ngữ câu bị động; động từ → <strong>be + V3</strong> (be chia đúng thì); người thực hiện thêm <strong>by...</strong> nếu cần: <em>The report <strong>was written by</strong> Lan.</em></p><p>Bị động rất phổ biến trong văn viết kỹ thuật và trang trọng: <em>The data <strong>is stored</strong> in the cloud. English <strong>is spoken</strong> worldwide.</em> Đừng lạm dụng by me/by people — nếu không thêm thông tin thì lược bỏ.</p>",
    examples: [
      { sentence: "This app was developed by a small team in Da Nang.", meaningVi: "Ứng dụng này được phát triển bởi một nhóm nhỏ ở Đà Nẵng." },
      { sentence: "Rice is grown in the Mekong Delta.", meaningVi: "Lúa được trồng ở đồng bằng sông Cửu Long." },
      { sentence: "The meeting was cancelled at the last minute.", meaningVi: "Cuộc họp bị hủy vào phút chót." },
      { sentence: "Millions of emails are sent every day.", meaningVi: "Hàng triệu email được gửi đi mỗi ngày." },
    ],
    commonMistakes: "❌ The report was wrote by her. ✅ The report was written by her. | ❌ My phone stolen yesterday. ✅ My phone was stolen yesterday. | ❌ The problem was happened. (happen không có bị động) ✅ The problem happened.",
    comparedWith: "Nội động từ (happen, arrive, die, occur) KHÔNG có dạng bị động vì không có tân ngữ. Bị động đủ mọi thì xem ở B2.",
  },
  {
    level: "B1",
    title: "Defining Relative Clauses — Mệnh đề quan hệ xác định",
    structure: "N + who/which/that/whose/where + mệnh đề",
    explanation:
      "<p>Mệnh đề quan hệ <strong>xác định</strong> bổ nghĩa cho danh từ đứng trước, cho biết chính xác 'người nào/cái nào': <em>The man <strong>who lives next door</strong> is a doctor.</em> Không có dấu phẩy, và không bỏ được (bỏ đi câu mất nghĩa).</p><p>Đại từ quan hệ: <strong>who</strong> (người), <strong>which</strong> (vật), <strong>that</strong> (cả hai, thân mật), <strong>whose</strong> (sở hữu), <strong>where</strong> (nơi chốn = in which), <strong>when</strong> (thời gian).</p><p>Khi đại từ quan hệ làm <strong>TÂN NGỮ</strong> của mệnh đề, có thể lược bỏ: <em>The movie (that) we watched was great.</em> Khi làm CHỦ NGỮ thì không bỏ được: The movie that <strong>won</strong> the award...</p>",
    examples: [
      { sentence: "The developer who wrote this module has left the company.", meaningVi: "Lập trình viên viết module này đã nghỉ việc." },
      { sentence: "This is the book which changed my life.", meaningVi: "Đây là cuốn sách đã thay đổi cuộc đời tôi." },
      { sentence: "The hotel where we stayed was right on the beach.", meaningVi: "Khách sạn nơi chúng tôi ở nằm ngay trên bãi biển." },
      { sentence: "She is the person whose idea won the hackathon.", meaningVi: "Cô ấy là người có ý tưởng thắng cuộc thi hackathon." },
    ],
    commonMistakes: "❌ The man which lives here... ✅ The man who lives here... | ❌ The book that I read it was good. ✅ The book that I read was good. (không lặp lại tân ngữ) | ❌ The place which I was born ✅ The place where I was born",
    comparedWith: "Mệnh đề KHÔNG xác định (có dấu phẩy, chỉ thêm thông tin phụ, không dùng that): My father, who is 60, still works — xem B2.",
  },
  {
    level: "B1",
    title: "Reported Speech: Statements — Câu tường thuật (câu kể)",
    structure: "S + said (that) / told sb (that) + mệnh đề lùi thì",
    explanation:
      "<p>Khi thuật lại lời nói, <strong>lùi thì một bậc</strong>: hiện tại đơn → quá khứ đơn; hiện tại tiếp diễn → quá khứ tiếp diễn; quá khứ đơn/hiện tại hoàn thành → quá khứ hoàn thành; will → would; can → could; must → had to.</p><p>Đổi cả <strong>đại từ</strong> và <strong>trạng từ thời gian/nơi chốn</strong>: now → then, today → that day, yesterday → the day before, tomorrow → the next day, here → there, this → that.</p><p><strong>say</strong> không cần tân ngữ (He said that...), <strong>tell</strong> BẮT BUỘC có tân ngữ (He told <strong>me</strong> that...). Nếu sự thật vẫn đúng ở hiện tại, có thể giữ nguyên thì: She said the Earth <strong>goes</strong> around the Sun.</p>",
    examples: [
      { sentence: "'I am busy now.' → She said (that) she was busy then.", meaningVi: "'Giờ tôi đang bận.' → Cô ấy nói lúc đó cô ấy đang bận." },
      { sentence: "'I will call you tomorrow.' → He told me he would call me the next day.", meaningVi: "'Mai tôi sẽ gọi cho bạn.' → Anh ấy bảo tôi hôm sau anh ấy sẽ gọi." },
      { sentence: "'We have finished the project.' → They said they had finished the project.", meaningVi: "'Chúng tôi đã xong dự án.' → Họ nói họ đã hoàn thành dự án." },
      { sentence: "'I can't come to the party.' → She said she couldn't come to the party.", meaningVi: "'Tôi không đến bữa tiệc được.' → Cô ấy nói cô ấy không đến được." },
    ],
    commonMistakes: "❌ He said me that... ✅ He told me that... / He said that... | ❌ She said she is busy. (lời nói đã qua) ✅ She said she was busy. | ❌ He told that... ✅ He told US that...",
    comparedWith: "Tường thuật câu hỏi và mệnh lệnh có cấu trúc riêng (asked if/wh-, told sb to V) — xem B2.",
  },
  {
    level: "B1",
    title: "Gerund vs Infinitive — V-ing hay to V?",
    structure: "V1 + V-ing (enjoy, finish, avoid...) | V1 + to V (want, decide, hope...)",
    explanation:
      "<p>Sau một động từ, động từ thứ hai ở dạng <strong>V-ing</strong> hay <strong>to V</strong> tùy vào động từ thứ nhất — phần lớn phải học thuộc theo nhóm:</p><ul><li><strong>+ V-ing</strong>: enjoy, finish, avoid, mind, suggest, practise, keep, consider, miss, give up.</li><li><strong>+ to V</strong>: want, need, decide, hope, plan, promise, agree, refuse, learn, manage, afford.</li><li><strong>Cả hai, nghĩa gần như không đổi</strong>: like, love, hate, start, begin, continue.</li></ul><p>Ngoài ra: V-ing đứng đầu câu làm chủ ngữ (<em>Swimming is good for you</em>); sau GIỚI TỪ luôn là V-ing (<em>interested <strong>in learning</strong></em>, good <strong>at coding</strong>).</p>",
    examples: [
      { sentence: "I enjoy working with this team.", meaningVi: "Tôi thích làm việc với nhóm này." },
      { sentence: "We decided to rewrite the module.", meaningVi: "Chúng tôi quyết định viết lại module." },
      { sentence: "She suggested taking a short break.", meaningVi: "Cô ấy đề nghị nghỉ giải lao một chút." },
      { sentence: "Reading documentation is an important skill.", meaningVi: "Đọc tài liệu là một kỹ năng quan trọng." },
    ],
    commonMistakes: "❌ I want going home. ✅ I want to go home. | ❌ He avoided to answer. ✅ He avoided answering. | ❌ I'm looking forward to see you. ✅ I'm looking forward to seeing you (to ở đây là GIỚI TỪ).",
    comparedWith: "Một số động từ ĐỔI NGHĨA theo dạng theo sau (stop/remember/forget/try/regret) — xem bài riêng ở B2.",
  },
  {
    level: "B1",
    title: "Used to — Thói quen & trạng thái trong quá khứ",
    structure: "S + used to + V | S + didn't use to + V | Did + S + use to + V?",
    explanation:
      "<p><strong>Used to + V</strong> diễn tả thói quen hoặc trạng thái <strong>từng có trong quá khứ nhưng NAY KHÔNG CÒN</strong>: <em>I used to smoke</em> — trước kia hút thuốc, giờ đã bỏ. Chính cái ý 'giờ khác rồi' là linh hồn của cấu trúc.</p><p>Chỉ tồn tại ở quá khứ — không có 'use to' cho hiện tại (hiện tại dùng thì hiện tại đơn + usually). Phủ định/câu hỏi: didn't <strong>use</strong> to, Did you <strong>use</strong> to...? (bỏ -d sau did).</p><p>Với trạng thái (live, be, have, believe), used to tự nhiên hơn quá khứ đơn: <em>There used to be a cinema here</em> — trước đây ở đây từng có rạp phim.</p>",
    examples: [
      { sentence: "I used to play games all night when I was a student.", meaningVi: "Hồi sinh viên tôi từng chơi game thâu đêm." },
      { sentence: "She used to live in Saigon before moving to Hanoi.", meaningVi: "Cô ấy từng sống ở Sài Gòn trước khi chuyển ra Hà Nội." },
      { sentence: "There used to be rice fields here; now it's all apartments.", meaningVi: "Trước đây ở đây là đồng lúa; giờ toàn chung cư." },
      { sentence: "Did you use to like vegetables? — No, I didn't.", meaningVi: "Hồi trước bạn có thích ăn rau không? — Không." },
    ],
    commonMistakes: "❌ I use to play football every weekend. (hiện tại) ✅ I usually play football every weekend. | ❌ Did you used to...? ✅ Did you use to...? | ❌ I am used to get up early. (nhầm cấu trúc) ✅ I used to get up early. / I am used to getting up early (nghĩa khác!).",
    comparedWith: "used to + V (từng làm, nay không còn) ≠ be used to + V-ing (đã quen với) ≠ get used to + V-ing (dần quen với) — xem bài B2.",
  },
  {
    level: "B1",
    title: "Question Tags — Câu hỏi đuôi",
    structure: "Mệnh đề khẳng định + trợ động từ phủ định + đại từ? (và ngược lại)",
    explanation:
      "<p><strong>Câu hỏi đuôi</strong> là câu hỏi ngắn gắn cuối câu để xác nhận hoặc tìm sự đồng tình: <em>It's hot today, <strong>isn't it?</strong></em></p><p>Quy tắc: vế chính KHẲNG ĐỊNH → đuôi PHỦ ĐỊNH và ngược lại; đuôi dùng đúng <strong>trợ động từ</strong> của vế chính (is → isn't, can → can't, động từ thường → do/does/did) + <strong>đại từ</strong> chủ ngữ.</p><p>Trường hợp đặc biệt: <em>I am... , <strong>aren't I?</strong></em>; <em>Let's go, <strong>shall we?</strong></em>; câu mệnh lệnh + <strong>will you?</strong>; chủ ngữ everyone/nobody → đuôi <strong>they</strong>. Ngữ điệu: xuống giọng = chờ đồng tình, lên giọng = hỏi thật.</p>",
    examples: [
      { sentence: "You're coming to the party, aren't you?", meaningVi: "Bạn sẽ đến bữa tiệc, đúng không?" },
      { sentence: "She doesn't eat seafood, does she?", meaningVi: "Cô ấy không ăn hải sản, phải không?" },
      { sentence: "They finished the sprint on time, didn't they?", meaningVi: "Họ hoàn thành sprint đúng hạn, đúng chứ?" },
      { sentence: "Let's take a break, shall we?", meaningVi: "Mình nghỉ chút nhé?" },
    ],
    commonMistakes: "❌ You like coffee, don't you like? ✅ You like coffee, don't you? | ❌ He can swim, can he? ✅ He can swim, can't he? | ❌ I'm right, am not I? ✅ I'm right, aren't I?",
    comparedWith: "Trả lời theo SỰ THẬT chứ không theo dạng câu hỏi: 'You don't like it, do you?' — nếu thích thì vẫn trả lời 'Yes, I do'.",
  },
  {
    level: "B1",
    title: "Modals of Deduction: must / might / can't — Phỏng đoán ở hiện tại",
    structure: "S + must/may/might/could/can't + V (mức độ chắc chắn khác nhau)",
    explanation:
      "<p>Dùng động từ khuyết thiếu để <strong>suy luận</strong> dựa trên bằng chứng, xếp theo độ chắc chắn:</p><ul><li><strong>must</strong> — gần như chắc chắn ĐÚNG: The light is on — he <strong>must</strong> be home.</li><li><strong>may / might / could</strong> — có thể (50%): She <strong>might</strong> be in a meeting.</li><li><strong>can't</strong> — gần như chắc chắn SAI: That <strong>can't</strong> be true!</li></ul><p>Lưu ý quan trọng: phủ định của must (phỏng đoán) là <strong>can't</strong>, KHÔNG phải mustn't (mustn't = cấm). Với hành động đang diễn ra: must/might + <strong>be V-ing</strong>: They must be sleeping now.</p>",
    examples: [
      { sentence: "He isn't answering his phone — he must be driving.", meaningVi: "Anh ấy không nghe máy — chắc là đang lái xe." },
      { sentence: "This bill can't be right. We only ordered two dishes!", meaningVi: "Hóa đơn này không thể đúng được. Mình chỉ gọi hai món mà!" },
      { sentence: "She might know the answer — ask her.", meaningVi: "Có thể cô ấy biết câu trả lời — hỏi cô ấy xem." },
      { sentence: "The error could be related to the cache.", meaningVi: "Lỗi này có thể liên quan đến cache." },
    ],
    commonMistakes: "❌ He mustn't be home. (phỏng đoán sai) ✅ He can't be home. | ❌ It can be John at the door. (phỏng đoán một khả năng) ✅ It could/might be John.",
    comparedWith: "Phỏng đoán về QUÁ KHỨ dùng modal + have + V3 (He must have forgotten) — xem bài Past Modals ở B2.",
  },
  {
    level: "B1",
    title: "Phrasal Verbs: separable & inseparable — Ngữ pháp của cụm động từ",
    structure: "V + particle (+ object) | V + object + particle (tách được)",
    explanation:
      "<p><strong>Phrasal verb</strong> = động từ + tiểu từ (up, on, off, out...) mang nghĩa mới: give up (bỏ cuộc), turn on (bật), look after (chăm sóc). Về ngữ pháp có 3 nhóm:</p><ul><li><strong>Tách được</strong>: turn on the light = turn the light on. Nhưng với ĐẠI TỪ thì BẮT BUỘC tách: turn <strong>it</strong> on (❌ turn on it).</li><li><strong>Không tách được</strong>: look after the kids → look after <strong>them</strong> (tân ngữ luôn sau tiểu từ).</li><li><strong>Không cần tân ngữ</strong>: wake up, break down, show up.</li></ul><p>Mẹo học: học theo chủ đề và theo CÂU ví dụ, đừng học danh sách rời rạc; để ý nghĩa của tiểu từ (up thường = hoàn tất/tăng, out = ra ngoài/hết).</p>",
    examples: [
      { sentence: "Can you turn the volume down? / Can you turn it down?", meaningVi: "Bạn vặn nhỏ âm lượng xuống được không?" },
      { sentence: "I'm looking for my glasses — have you seen them?", meaningVi: "Tôi đang tìm kính — bạn có thấy không?" },
      { sentence: "She grew up in a small town.", meaningVi: "Cô ấy lớn lên ở một thị trấn nhỏ." },
      { sentence: "Don't give up! You're almost there.", meaningVi: "Đừng bỏ cuộc! Bạn sắp thành công rồi." },
    ],
    commonMistakes: "❌ Turn on it. ✅ Turn it on. | ❌ I will look my nephew after. ✅ I will look after my nephew. | ❌ Fill up it. ✅ Fill it up.",
    comparedWith: "Phrasal verb (thân mật: put off) thường có một động từ Latin trang trọng tương đương (postpone) — văn viết học thuật ưu tiên từ trang trọng.",
  },
  {
    level: "B1",
    title: "So / Neither + trợ động từ & So / Such — Đồng tình và nhấn mạnh",
    structure: "So + aux + S (tôi cũng vậy) | Neither + aux + S (tôi cũng không) | so + adj | such + (a/an) + adj + N",
    explanation:
      "<p><strong>Đồng tình ngắn</strong>: câu khẳng định → <em>So + trợ động từ + chủ ngữ</em>: 'I love pho.' — '<strong>So do I</strong>.' Câu phủ định → <em>Neither/Nor + trợ động từ + chủ ngữ</em>: 'I can't swim.' — '<strong>Neither can I</strong>.' Trợ động từ phải khớp với câu gốc (am/do/did/have/can...).</p><p><strong>So/Such nhấn mạnh</strong>: <strong>so</strong> + tính từ/trạng từ (so beautiful, so quickly); <strong>such</strong> + (a/an) + tính từ + DANH TỪ (such a beautiful day). Kết hợp that-clause chỉ kết quả: <em>It was <strong>so</strong> cold <strong>that</strong> we stayed inside. It was <strong>such a</strong> cold day <strong>that</strong>...</em></p>",
    examples: [
      { sentence: "I'm exhausted. — So am I.", meaningVi: "Tôi kiệt sức rồi. — Tôi cũng vậy." },
      { sentence: "She didn't like the ending. — Neither did I.", meaningVi: "Cô ấy không thích đoạn kết. — Tôi cũng không." },
      { sentence: "The demo went so well that the client signed immediately.", meaningVi: "Buổi demo tốt đến mức khách hàng ký hợp đồng ngay." },
      { sentence: "It was such an interesting talk that nobody left early.", meaningVi: "Bài nói thú vị đến mức không ai về sớm." },
    ],
    commonMistakes: "❌ 'I like it.' — 'So I do.' ✅ So do I. | ❌ Me too, khi câu gốc phủ định ✅ Me neither. | ❌ so beautiful day ✅ such a beautiful day | ❌ such quickly ✅ so quickly",
    comparedWith: "'Me too / Me neither' là cách nói thân mật tương đương So do I / Neither do I.",
  },
  {
    level: "B1",
    title: "as...as & the more...the more — So sánh bằng và so sánh kép",
    structure: "as + adj + as | not as/so + adj + as | The + so sánh hơn..., the + so sánh hơn...",
    explanation:
      "<p><strong>So sánh bằng</strong>: as + tính từ/trạng từ + as: <em>This phone is <strong>as good as</strong> that one.</em> Phủ định not as/so ... as = kém hơn: <em>It's <strong>not as expensive as</strong> I thought</em> (rẻ hơn tôi tưởng).</p><p><strong>So sánh kép</strong> 'càng... càng...': <em><strong>The more</strong> you practise, <strong>the better</strong> you get.</em> Cấu trúc: The + so sánh hơn + mệnh đề, the + so sánh hơn + mệnh đề. Dạng rút gọn quen thuộc: The sooner, the better (càng sớm càng tốt).</p><p>Biến thể tăng tiến: <em>more and more expensive</em> (ngày càng đắt), <em>better and better</em> (ngày càng tốt).</p>",
    examples: [
      { sentence: "Your English is as good as a native speaker's.", meaningVi: "Tiếng Anh của bạn tốt ngang người bản xứ." },
      { sentence: "The new office isn't as far as the old one.", meaningVi: "Văn phòng mới không xa như văn phòng cũ." },
      { sentence: "The more tests you write, the fewer bugs you ship.", meaningVi: "Bạn càng viết nhiều test thì càng ít lỗi ra sản phẩm." },
      { sentence: "Housing is getting more and more expensive.", meaningVi: "Nhà ở ngày càng đắt đỏ." },
    ],
    commonMistakes: "❌ as better as ✅ as good as (as...as dùng dạng NGUYÊN) | ❌ The more you study, you get better. ✅ The more you study, the better you get.",
    comparedWith: "twice/three times + as...as diễn tả gấp bội: This one is twice as fast as the old version.",
  },
  {
    level: "B1",
    title: "Articles: the & zero article — Mạo từ 'the' và không dùng mạo từ",
    structure: "the + N xác định | ∅ + N số nhiều/không đếm được nói chung",
    explanation:
      "<p><strong>The</strong> dùng khi cả hai bên đều biết đang nói về CÁI NÀO: đã nhắc lần hai (a dog... <strong>the</strong> dog), duy nhất (<strong>the</strong> sun, <strong>the</strong> internet), có cụm xác định theo sau (<strong>the</strong> manager of my team), so sánh nhất (<strong>the</strong> best).</p><p><strong>KHÔNG dùng mạo từ</strong> (zero article) khi nói chung chung với danh từ số nhiều/không đếm được: <em>∅ Dogs are loyal. ∅ Music helps me focus.</em> Cũng không dùng với: bữa ăn (have ∅ breakfast), môn học/môn thể thao (study ∅ maths, play ∅ football), hầu hết tên nước/thành phố (∅ Vietnam, ∅ Hanoi — nhưng <strong>the</strong> UK, <strong>the</strong> USA, <strong>the</strong> Philippines).</p><p>Cụm cố định: go to ∅ bed/school/work, at ∅ home, by ∅ bus.</p>",
    examples: [
      { sentence: "I bought a keyboard and a mouse. The keyboard was expensive.", meaningVi: "Tôi mua một bàn phím và một con chuột. Cái bàn phím thì đắt." },
      { sentence: "Coffee keeps me awake.", meaningVi: "Cà phê giúp tôi tỉnh táo (nói chung, không mạo từ)." },
      { sentence: "The internet has changed the way we work.", meaningVi: "Internet đã thay đổi cách chúng ta làm việc." },
      { sentence: "She goes to work by bus and comes home before dinner.", meaningVi: "Cô ấy đi làm bằng xe buýt và về nhà trước bữa tối." },
    ],
    commonMistakes: "❌ The life is hard. ✅ Life is hard. | ❌ I go to the bed at 11. ✅ I go to bed at 11. | ❌ He is in USA. ✅ He is in the USA. | ❌ I like the music. (nói chung) ✅ I like music.",
    comparedWith: "a/an = một cái bất kỳ, nhắc lần đầu; the = cái đã xác định. So sánh: I need a pen (bất kỳ) ↔ Where is the pen? (cái bút đó).",
  },
  {
    level: "B1",
    title: "Making Suggestions — Đưa ra đề xuất (Let's, Why don't we, How about...)",
    structure: "Let's + V | Why don't we + V? | How/What about + V-ing? | We could + V | Shall we + V?",
    explanation:
      "<p>Bộ cấu trúc <strong>đề xuất ý kiến</strong> dùng hằng ngày trong họp nhóm và trò chuyện:</p><ul><li><strong>Let's + V</strong>: Let's start with the easy tasks.</li><li><strong>Why don't we/you + V?</strong>: Why don't we split the work?</li><li><strong>How about / What about + V-ing (hoặc danh từ)?</strong>: How about ordering pizza?</li><li><strong>We could + V</strong> (nhẹ nhàng, gợi mở): We could try a different library.</li><li><strong>Shall we + V?</strong> (lịch sự, Anh-Anh): Shall we begin?</li></ul><p>Đáp lại: <em>Good idea! / Sounds good. / I'd rather... / I'm not sure about that.</em> Chú ý dạng động từ đi sau từng cấu trúc — lỗi phổ biến nhất là chia sai sau how about.</p>",
    examples: [
      { sentence: "Let's review the pull request together.", meaningVi: "Chúng ta cùng review pull request nhé." },
      { sentence: "Why don't we ask the customer for feedback first?", meaningVi: "Sao chúng ta không hỏi ý kiến khách hàng trước nhỉ?" },
      { sentence: "How about grabbing lunch at the new place?", meaningVi: "Hay là ăn trưa ở quán mới đi?" },
      { sentence: "We could postpone the release until Monday.", meaningVi: "Chúng ta có thể dời ngày phát hành sang thứ Hai." },
    ],
    commonMistakes: "❌ Let's to go. ✅ Let's go. | ❌ How about go to the cinema? ✅ How about going to the cinema? | ❌ Why don't we going...? ✅ Why don't we go...?",
    comparedWith: "suggest + V-ing hoặc suggest (that) S + V: She suggested taking a break (KHÔNG nói 'suggest to take').",
  },
  {
    level: "B1",
    title: "Agreeing & Disagreeing — Đồng ý và phản đối một cách tự nhiên",
    structure: "I (totally) agree... | I see your point, but... | I'm afraid I disagree...",
    explanation:
      "<p>Trong thảo luận, người bản xứ hiếm khi nói cụt lủn 'No, you're wrong'. Học theo ba mức:</p><ul><li><strong>Đồng ý</strong>: I agree (with you). Absolutely! That's exactly what I think. You're right.</li><li><strong>Đồng ý một phần</strong>: I see your point, but... / That's true, but... / Yes, but on the other hand...</li><li><strong>Phản đối lịch sự</strong>: I'm afraid I disagree. / I'm not sure about that. / I see it a bit differently.</li></ul><p>Chú ý ngữ pháp: agree là ĐỘNG TỪ — nói <em>I agree</em>, không phải 'I am agree'. Agree <strong>with</strong> người/ý kiến, agree <strong>on</strong> vấn đề, agree <strong>to</strong> đề nghị.</p>",
    examples: [
      { sentence: "I totally agree with your analysis.", meaningVi: "Tôi hoàn toàn đồng ý với phân tích của bạn." },
      { sentence: "I see your point, but I think we should test it more first.", meaningVi: "Tôi hiểu ý bạn, nhưng tôi nghĩ chúng ta nên kiểm thử kỹ hơn đã." },
      { sentence: "I'm afraid I disagree — the deadline is too tight.", meaningVi: "Tôi e là tôi không đồng ý — thời hạn quá gấp." },
      { sentence: "We all agreed on the new design in the end.", meaningVi: "Cuối cùng tất cả chúng tôi đã thống nhất về thiết kế mới." },
    ],
    commonMistakes: "❌ I am agree with you. ✅ I agree with you. | ❌ I agree your idea. ✅ I agree with your idea. | ❌ You are wrong! (thô lỗ trong công việc) ✅ I'm not sure I agree with that.",
    comparedWith: "Trong email trang trọng, phản đối càng cần rào đón: 'I understand your concern; however, ...' — xem bài Hedging ở C1.",
  },
  // ==================== B2 (18) ====================
  {
    level: "B2",
    title: "Third Conditional — Câu điều kiện loại 3",
    structure: "If + had + V3, S + would have + V3",
    explanation:
      "<p><strong>Loại 3</strong> nói về điều <strong>KHÔNG xảy ra trong QUÁ KHỨ</strong> và kết quả giả định của nó — thường mang sắc thái tiếc nuối hoặc trách móc: <em>If I <strong>had studied</strong> harder, I <strong>would have passed</strong> the exam</em> — thực tế là tôi đã không học chăm và đã trượt.</p><p>Vế if dùng <strong>quá khứ hoàn thành</strong>, vế chính dùng <strong>would/could/might + have + V3</strong>. Cả câu chỉ tồn tại trong tưởng tượng — sự thật đã ngược lại và không thay đổi được.</p><p>Trong văn nói, 'would have' thường rút thành <em>would've</em>, nghe như /ˈwʊdəv/ — cẩn thận đừng viết thành 'would of' (lỗi cả người bản xứ mắc).</p>",
    examples: [
      { sentence: "If we had tested more carefully, we would have caught the bug.", meaningVi: "Nếu chúng tôi kiểm thử kỹ hơn thì đã bắt được lỗi đó." },
      { sentence: "If you had told me earlier, I could have helped you.", meaningVi: "Nếu bạn nói với tôi sớm hơn thì tôi đã có thể giúp bạn." },
      { sentence: "She wouldn't have missed the flight if she had left on time.", meaningVi: "Cô ấy đã không lỡ chuyến bay nếu đi đúng giờ." },
      { sentence: "If I hadn't taken that course, I might never have become a developer.", meaningVi: "Nếu không học khóa đó, có lẽ tôi đã chẳng bao giờ thành lập trình viên." },
    ],
    commonMistakes: "❌ If I would have known, I would have come. ✅ If I had known, I would have come. | ❌ If I had money yesterday... ✅ If I had had money yesterday... | ❌ would of ✅ would have",
    comparedWith: "Loại 2 giả định về HIỆN TẠI (If I knew — bây giờ), loại 3 giả định về QUÁ KHỨ đã khép lại (If I had known — hồi đó).",
  },
  {
    level: "B2",
    title: "Mixed Conditionals — Câu điều kiện hỗn hợp",
    structure: "If + had + V3, S + would + V (quá khứ→hiện tại) | If + quá khứ đơn, S + would have + V3 (hiện tại→quá khứ)",
    explanation:
      "<p>Đời thực không chia gọn theo loại 2/3 — <strong>điều kiện hỗn hợp</strong> trộn hai mốc thời gian:</p><ul><li><strong>Quá khứ → hiện tại</strong> (phổ biến nhất): điều kiện quá khứ, hậu quả hiện tại: <em>If I <strong>had taken</strong> that job, I <strong>would be</strong> in Singapore now.</em></li><li><strong>Hiện tại → quá khứ</strong>: tính chất hiện tại (luôn đúng), kết quả quá khứ: <em>If she <strong>weren't</strong> so careful, she <strong>would have made</strong> that mistake too.</em></li></ul><p>Chìa khóa: xác định mỗi vế đang nói về THỜI ĐIỂM nào rồi chọn dạng tương ứng (had V3/quá khứ đơn cho vế if; would V/would have V3 cho vế chính). Trạng từ now/then/yesterday giúp người nghe định vị.</p>",
    examples: [
      { sentence: "If I had saved money in my twenties, I would own a house now.", meaningVi: "Nếu hồi đôi mươi tôi tiết kiệm thì giờ đã có nhà." },
      { sentence: "If he weren't so stubborn, he would have listened to our warning.", meaningVi: "Nếu anh ấy không cố chấp như vậy thì đã nghe lời cảnh báo của chúng tôi." },
      { sentence: "If we hadn't automated the tests, we would spend hours checking manually every day.", meaningVi: "Nếu không tự động hóa test, giờ ngày nào chúng tôi cũng mất hàng giờ kiểm tra thủ công." },
      { sentence: "If I spoke better English, I would have got that international position.", meaningVi: "Nếu tiếng Anh tôi tốt hơn thì tôi đã nhận được vị trí quốc tế đó." },
    ],
    commonMistakes: "❌ If I had taken that job, I would have been in Singapore now. (now → hiện tại) ✅ ...I would be in Singapore now. | ❌ Trộn thì tùy tiện không theo mốc thời gian thực của từng vế.",
    comparedWith: "Loại 3 thuần: cả hai vế đều quá khứ. Hỗn hợp: hai vế ở hai mốc thời gian khác nhau — nhìn trạng từ (now, today ↔ last year, then).",
  },
  {
    level: "B2",
    title: "Passive Voice: All Tenses & Modals — Bị động mọi thì và với động từ khuyết thiếu",
    structure: "be (chia thì) + V3 | modal + be + V3 | modal + have been + V3",
    explanation:
      "<p>Nắm chắc quy tắc duy nhất: <strong>giữ nguyên thì của be, thêm V3</strong>:</p><ul><li>Tiếp diễn: is/was <strong>being</strong> + V3 — The system <strong>is being upgraded</strong>.</li><li>Hoàn thành: has/had <strong>been</strong> + V3 — The invoice <strong>has been paid</strong>.</li><li>Tương lai: will <strong>be</strong> + V3 — The results <strong>will be announced</strong> tomorrow.</li><li>Khuyết thiếu: must/can/should + <strong>be</strong> + V3 — This form <strong>must be signed</strong>.</li><li>Khuyết thiếu quá khứ: should <strong>have been</strong> + V3 — The bug <strong>should have been fixed</strong> earlier.</li></ul><p>Động từ hai tân ngữ (give, send, offer) có hai cách bị động: <em>I was given a chance</em> / <em>A chance was given to me</em> — lấy NGƯỜI làm chủ ngữ thường tự nhiên hơn.</p>",
    examples: [
      { sentence: "The servers are being migrated to the new data center.", meaningVi: "Các máy chủ đang được chuyển sang trung tâm dữ liệu mới." },
      { sentence: "All passwords must be changed every 90 days.", meaningVi: "Tất cả mật khẩu phải được thay đổi mỗi 90 ngày." },
      { sentence: "By next month, the feature will have been released.", meaningVi: "Đến tháng sau, tính năng này sẽ đã được phát hành." },
      { sentence: "He was offered a promotion last week.", meaningVi: "Tuần trước anh ấy được đề nghị thăng chức." },
    ],
    commonMistakes: "❌ The house is building. ✅ The house is being built. | ❌ The report must been finished. ✅ The report must be finished. | ❌ It has being done. ✅ It has been done.",
    comparedWith: "Trong văn phong khoa học/kỹ thuật, bị động giúp giấu tác nhân và giữ giọng khách quan; trong văn nói thân mật, chủ động vẫn tự nhiên hơn.",
  },
  {
    level: "B2",
    title: "Passive Reporting: It is said that... — Bị động với động từ tường thuật",
    structure: "It + is said/believed/thought + that... | S + is said/believed + to V / to have V3",
    explanation:
      "<p>Cấu trúc trang trọng để truyền đạt thông tin <strong>theo nguồn chung, không rõ ai nói</strong> — đặc sản của báo chí và IELTS Writing:</p><ul><li><strong>It + bị động + that</strong>: It <strong>is said that</strong> the company is losing money.</li><li><strong>S + bị động + to V</strong> (cùng thời điểm): The company <strong>is said to be losing</strong> money.</li><li><strong>S + bị động + to have V3</strong> (xảy ra trước): He <strong>is believed to have left</strong> the country.</li></ul><p>Động từ thường dùng: say, believe, think, report, know, expect, claim, estimate. Cấu trúc thứ hai (S + to V) được đánh giá cao hơn trong văn viết học thuật vì gọn và mạch lạc.</p>",
    examples: [
      { sentence: "It is estimated that over a million people use this app daily.", meaningVi: "Người ta ước tính hơn một triệu người dùng ứng dụng này mỗi ngày." },
      { sentence: "The CEO is reported to be considering a merger.", meaningVi: "CEO được cho là đang cân nhắc một vụ sáp nhập." },
      { sentence: "The attackers are believed to have exploited an old vulnerability.", meaningVi: "Những kẻ tấn công được cho là đã khai thác một lỗ hổng cũ." },
      { sentence: "It is widely known that regular exercise improves focus.", meaningVi: "Ai cũng biết rằng tập thể dục đều đặn cải thiện sự tập trung." },
    ],
    commonMistakes: "❌ It is said he to be rich. ✅ He is said to be rich. / It is said that he is rich. | ❌ He is believed to leave yesterday. ✅ He is believed to have left yesterday.",
    comparedWith: "'People say that...' (trung tính, văn nói) → 'It is said that...' (trang trọng). Dùng dạng này thay 'Everybody knows...' trong IELTS.",
  },
  {
    level: "B2",
    title: "Reported Speech: Questions, Commands & Reporting Verbs — Tường thuật nâng cao",
    structure: "asked + if/whether/wh- + S + V | told/asked sb + (not) to V | advised/suggested/promised...",
    explanation:
      "<p><strong>Tường thuật câu hỏi</strong>: trật tự trở về CÂU KỂ (không đảo, không do/does/did): Yes/No → <strong>asked if/whether</strong>: <em>He asked <strong>if I was</strong> free</em>; câu hỏi Wh- giữ từ hỏi: <em>She asked <strong>where I lived</strong></em> (không phải 'where did I live').</p><p><strong>Tường thuật mệnh lệnh/yêu cầu</strong>: told/asked/ordered/warned + sb + <strong>(not) to V</strong>: <em>The doctor told me <strong>not to stay up</strong> late.</em></p><p><strong>Động từ tường thuật giàu nghĩa</strong> — thay said bằng động từ chính xác hơn: <strong>suggest + V-ing</strong>, <strong>promise/offer/refuse + to V</strong>, <strong>advise/remind/warn + sb + to V</strong>, <strong>apologize for + V-ing</strong>, <strong>admit/deny + V-ing</strong>. Chọn đúng động từ + đúng mẫu câu là kỹ năng ăn điểm ở B2.</p>",
    examples: [
      { sentence: "She asked me whether I had pushed the code.", meaningVi: "Cô ấy hỏi tôi đã push code chưa." },
      { sentence: "He asked where the meeting room was.", meaningVi: "Anh ấy hỏi phòng họp ở đâu." },
      { sentence: "The manager reminded us to back up the database.", meaningVi: "Quản lý nhắc chúng tôi sao lưu cơ sở dữ liệu." },
      { sentence: "She suggested splitting the task into smaller parts.", meaningVi: "Cô ấy đề xuất chia nhỏ công việc ra." },
      { sentence: "He denied breaking the build.", meaningVi: "Anh ấy phủ nhận việc làm hỏng bản build." },
    ],
    commonMistakes: "❌ She asked where did I live. ✅ She asked where I lived. | ❌ He said me to go. ✅ He told me to go. | ❌ She suggested me to apply. ✅ She suggested that I apply / suggested applying.",
    comparedWith: "Với câu kể đơn thuần dùng said/told + lùi thì (xem B1); bài này bổ sung câu hỏi, mệnh lệnh và hệ động từ tường thuật.",
  },
  {
    level: "B2",
    title: "Non-defining & Reduced Relative Clauses — Mệnh đề quan hệ không xác định & rút gọn",
    structure: ", who/which... , (không dùng that) | rút gọn: V-ing (chủ động) / V3 (bị động)",
    explanation:
      "<p><strong>Mệnh đề không xác định</strong> chỉ THÊM thông tin phụ về danh từ đã rõ, tách bằng <strong>dấu phẩy</strong>, KHÔNG dùng that, không lược bỏ đại từ: <em>My father, <strong>who is 60</strong>, still rides his motorbike.</em> <strong>Which</strong> còn thay cả mệnh đề trước: <em>He was late again, <strong>which annoyed everyone</strong>.</em></p><p><strong>Rút gọn mệnh đề quan hệ</strong> (cả hai loại):</p><ul><li>Chủ động → <strong>V-ing</strong>: The man <del>who is</del> <strong>standing</strong> there is my boss.</li><li>Bị động → <strong>V3</strong>: The framework <del>which was</del> <strong>written</strong> in Rust is fast.</li><li>To V sau first/last/only: She was the first person <strong>to arrive</strong>.</li></ul>",
    examples: [
      { sentence: "Da Lat, which is famous for its cool weather, attracts millions of tourists.", meaningVi: "Đà Lạt, nổi tiếng với khí hậu mát mẻ, thu hút hàng triệu du khách." },
      { sentence: "My colleague, whose desk is next to mine, is moving to Canada.", meaningVi: "Đồng nghiệp của tôi, người ngồi cạnh bàn tôi, sắp chuyển sang Canada." },
      { sentence: "Anyone using the old API should migrate before June.", meaningVi: "Ai đang dùng API cũ nên chuyển đổi trước tháng Sáu." },
      { sentence: "The features requested by the client were shipped last sprint.", meaningVi: "Các tính năng khách hàng yêu cầu đã được phát hành sprint trước." },
    ],
    commonMistakes: "❌ My mother that is a teacher... ✅ My mother, who is a teacher, ... | ❌ Thiếu dấu phẩy làm đổi nghĩa: My brother who lives in Hue (ngụ ý có nhiều anh) ↔ My brother, who lives in Hue (chỉ có một) | ❌ The man stood there is my boss. ✅ The man standing there is my boss.",
    comparedWith: "Mệnh đề xác định (không phẩy, được dùng that, bỏ được đại từ tân ngữ) — xem B1. Dấu phẩy chính là ranh giới ngữ nghĩa.",
  },
  {
    level: "B2",
    title: "Wish / If only — Câu ước",
    structure: "wish + quá khứ đơn (hiện tại) | wish + had V3 (quá khứ) | wish + would V (phàn nàn)",
    explanation:
      "<p>Ba khung thời gian của <strong>wish</strong> (if only = giống hệt nhưng cảm xúc mạnh hơn):</p><ul><li><strong>Ước về hiện tại</strong> — wish + QUÁ KHỨ ĐƠN: <em>I wish I <strong>knew</strong> the answer</em> (giờ không biết). Với be dùng were: I wish I <strong>were</strong> taller.</li><li><strong>Ước về quá khứ</strong> (tiếc nuối) — wish + <strong>had V3</strong>: <em>I wish I <strong>had studied</strong> abroad.</em></li><li><strong>Phàn nàn/muốn ai đó thay đổi</strong> — wish + <strong>would V</strong>: <em>I wish you <strong>would stop</strong> interrupting me.</em> (không dùng wish I would)</li></ul><p>Mẹo: lùi một thì so với thực tế — thực tế hiện tại → quá khứ đơn; thực tế quá khứ → quá khứ hoàn thành.</p>",
    examples: [
      { sentence: "I wish I had more time to read.", meaningVi: "Ước gì tôi có nhiều thời gian đọc sách hơn (hiện tại không có)." },
      { sentence: "If only I hadn't deleted that file!", meaningVi: "Giá như tôi đã không xóa cái file đó!" },
      { sentence: "She wishes she had accepted the offer last year.", meaningVi: "Cô ấy ước năm ngoái mình đã nhận lời đề nghị." },
      { sentence: "I wish the neighbors would turn down the music.", meaningVi: "Ước gì hàng xóm chịu vặn nhỏ nhạc xuống." },
    ],
    commonMistakes: "❌ I wish I know the answer. ✅ I wish I knew the answer. | ❌ I wish I didn't say that yesterday. ✅ I wish I hadn't said that yesterday. | ❌ I wish I would be rich. ✅ I wish I were rich.",
    comparedWith: "hope + hiện tại/will = mong điều CÓ THỂ xảy ra (I hope you pass); wish + lùi thì = ao ước điều TRÁI thực tế. Đừng dùng wish cho lời chúc dạng câu đầy đủ.",
  },
  {
    level: "B2",
    title: "Used to vs Be used to vs Get used to — Ba cấu trúc dễ lẫn",
    structure: "used to + V (quá khứ) | be used to + V-ing/N (đã quen) | get used to + V-ing/N (dần quen)",
    explanation:
      "<p>Ba cấu trúc nhìn giống nhau nhưng nghĩa hoàn toàn khác:</p><ul><li><strong>used to + V nguyên mẫu</strong> — thói quen QUÁ KHỨ nay không còn: <em>I used to work night shifts</em> (giờ không làm nữa).</li><li><strong>be used to + V-ing/danh từ</strong> — ĐÃ QUEN với điều gì (hiện tại): <em>I'm used to working night shifts</em> (làm quen rồi, thấy bình thường).</li><li><strong>get used to + V-ing/danh từ</strong> — quá trình DẦN THÍCH NGHI: <em>I'm getting used to the new codebase.</em></li></ul><p>Điểm mấu chốt: trong be/get used to, <strong>to là GIỚI TỪ</strong> nên sau nó là V-ing hoặc danh từ — không phải động từ nguyên mẫu. Be/get used to dùng được ở mọi thì: She'll get used to it.</p>",
    examples: [
      { sentence: "I used to drink five cups of coffee a day.", meaningVi: "Trước kia tôi từng uống năm cốc cà phê mỗi ngày." },
      { sentence: "He is used to speaking English in meetings.", meaningVi: "Anh ấy đã quen nói tiếng Anh trong các cuộc họp." },
      { sentence: "You'll get used to the traffic in Hanoi eventually.", meaningVi: "Rồi bạn sẽ quen dần với giao thông Hà Nội thôi." },
      { sentence: "She isn't used to getting up this early.", meaningVi: "Cô ấy chưa quen dậy sớm thế này." },
    ],
    commonMistakes: "❌ I'm used to work at night. ✅ I'm used to working at night. | ❌ I used to working there. ✅ I used to work there. | ❌ I get used to it already. ✅ I've got used to it / I'm used to it.",
    comparedWith: "used to chỉ tồn tại ở quá khứ và nói về SỰ THAY ĐỔI; be used to nói về TRẠNG THÁI quen thuộc, get used to nói về QUÁ TRÌNH.",
  },
  {
    level: "B2",
    title: "Causatives: have/get something done — Câu cầu khiến",
    structure: "have + object + V3 | get + object + V3 | have sb V / get sb to V",
    explanation:
      "<p><strong>Have/get something done</strong> = nhờ/thuê người khác làm việc gì cho mình — không tự làm: <em>I <strong>had my laptop repaired</strong></em> (mang đi sửa, không tự sửa). Get thân mật hơn have, nghĩa như nhau.</p><p>So sánh: <em>I cut my hair</em> (tự cắt!) ↔ <em>I <strong>had my hair cut</strong></em> (đi cắt tóc). Cấu trúc này cũng diễn tả sự cố ngoài ý muốn: <em>She <strong>had her phone stolen</strong></em> (bị trộm điện thoại).</p><p>Khi nêu NGƯỜI thực hiện: <strong>have + sb + V nguyên mẫu</strong> (I had the intern update the docs) nhưng <strong>get + sb + TO V</strong> (I got the intern to update the docs) — get cần to, have thì không.</p>",
    examples: [
      { sentence: "We're having the office repainted next week.", meaningVi: "Tuần sau chúng tôi cho sơn lại văn phòng." },
      { sentence: "I need to get my visa renewed before July.", meaningVi: "Tôi cần gia hạn visa trước tháng Bảy." },
      { sentence: "She had the designer redo the landing page.", meaningVi: "Cô ấy nhờ designer làm lại trang landing." },
      { sentence: "He got his brother to fix the wifi.", meaningVi: "Anh ấy nhờ em trai sửa wifi." },
    ],
    commonMistakes: "❌ I cut my hair yesterday. (ý là đi tiệm) ✅ I had my hair cut yesterday. | ❌ I had repaired my car. (thành quá khứ hoàn thành!) ✅ I had my car repaired. | ❌ I got him fix it. ✅ I got him to fix it.",
    comparedWith: "make sb V (ép buộc) / let sb V (cho phép) — xem bài Verb + Object + Infinitive; have/get sth done nhấn vào DỊCH VỤ được thực hiện.",
  },
  {
    level: "B2",
    title: "Past Modals: should have / must have / could have — Khuyết thiếu + have + V3",
    structure: "should/shouldn't have + V3 (trách) | must/can't have + V3 (suy luận) | could/might have + V3 (khả năng đã bỏ lỡ)",
    explanation:
      "<p><strong>Modal + have + V3</strong> nhìn về quá khứ với hai chức năng:</p><ul><li><strong>Đánh giá/trách móc</strong>: should have V3 = lẽ ra nên làm (mà không làm): <em>You <strong>should have backed up</strong> the data.</em> shouldn't have = lẽ ra không nên.</li><li><strong>Suy luận về quá khứ</strong>: must have V3 = chắc chắn đã (He <strong>must have forgotten</strong>); can't have V3 = không thể nào đã (She <strong>can't have seen</strong> us); may/might/could have V3 = có lẽ đã.</li></ul><p><strong>Could have V3</strong> còn nghĩa 'đã có thể nhưng không xảy ra' — cơ hội bị bỏ lỡ hoặc thoát nạn: <em>We <strong>could have won</strong></em> (đáng lẽ thắng được); <em>You <strong>could have been hurt</strong>!</em> (may mà không sao).</p>",
    examples: [
      { sentence: "I should have listened to your advice.", meaningVi: "Lẽ ra tôi nên nghe lời khuyên của bạn." },
      { sentence: "The build failed — someone must have pushed broken code.", meaningVi: "Bản build hỏng rồi — chắc chắn ai đó đã push code lỗi." },
      { sentence: "She can't have finished the whole report in an hour.", meaningVi: "Không thể nào cô ấy làm xong cả báo cáo trong một tiếng được." },
      { sentence: "We could have taken the earlier flight, but we overslept.", meaningVi: "Chúng tôi đã có thể bay chuyến sớm hơn, nhưng lại ngủ quên." },
    ],
    commonMistakes: "❌ You should had told me. ✅ You should have told me. | ❌ He must forgot. ✅ He must have forgotten. | ❌ mustn't have (suy luận phủ định) ✅ can't have + V3",
    comparedWith: "Suy luận HIỆN TẠI: must/might/can't + V (He must be tired) ↔ suy luận QUÁ KHỨ: must/might/can't + have V3 (He must have been tired).",
  },
  {
    level: "B2",
    title: "Future Perfect & Future Continuous — Tương lai hoàn thành & tương lai tiếp diễn",
    structure: "will have + V3 (by + mốc) | will be + V-ing (at + thời điểm)",
    explanation:
      "<p><strong>Tương lai hoàn thành</strong> — hành động sẽ <strong>ĐÃ xong trước một mốc tương lai</strong>, dấu hiệu <strong>by</strong>: <em>By 2030, we <strong>will have automated</strong> most of this process.</em> Nhìn từ mốc tương lai ngoảnh lại.</p><p><strong>Tương lai tiếp diễn</strong> — hành động <strong>đang diễn ra tại một thời điểm tương lai</strong>: <em>At 9 a.m. tomorrow, I <strong>will be flying</strong> to Bangkok.</em> Còn dùng để hỏi kế hoạch một cách lịch sự, không tạo áp lực: <em>Will you be using the meeting room this afternoon?</em></p><p>Kết hợp thường gặp: by the time + hiện tại đơn, ... will have V3: <em>By the time you arrive, we'll have finished dinner.</em></p>",
    examples: [
      { sentence: "By the end of this year, I will have worked here for five years.", meaningVi: "Đến cuối năm nay, tôi sẽ tròn năm năm làm việc ở đây." },
      { sentence: "Don't call at 8 — we will be having dinner then.", meaningVi: "Đừng gọi lúc 8 giờ — lúc đó chúng tôi đang ăn tối." },
      { sentence: "The migration will have been completed before the demo.", meaningVi: "Việc chuyển đổi sẽ được hoàn tất trước buổi demo." },
      { sentence: "This time next week, she will be lying on a beach in Nha Trang.", meaningVi: "Giờ này tuần sau, cô ấy sẽ đang nằm dài trên bãi biển Nha Trang." },
    ],
    commonMistakes: "❌ By 2030, we finish the project. ✅ By 2030, we will have finished the project. | ❌ I will have finished it yesterday. ✅ mốc phải ở TƯƠNG LAI. | ❌ will been doing ✅ will be doing",
    comparedWith: "will V = sự kiện tương lai đơn thuần; will be V-ing = đang dở tay tại thời điểm đó; will have V3 = đã xong trước mốc đó.",
  },
  {
    level: "B2",
    title: "Stop / Remember / Regret / Try + V-ing vs to V — Động từ đổi nghĩa theo dạng",
    structure: "V + V-ing (hướng về việc đã/đang làm) | V + to V (hướng về việc sắp làm)",
    explanation:
      "<p>Một nhóm động từ mang <strong>hai nghĩa khác nhau</strong> tùy theo sau là V-ing hay to V. Quy luật chung: <strong>V-ing = việc đã/đang xảy ra</strong>, <strong>to V = việc chưa/sắp xảy ra</strong>:</p><ul><li><strong>stop V-ing</strong> = bỏ hẳn việc gì (He stopped smoking) ↔ <strong>stop to V</strong> = dừng lại ĐỂ làm việc khác (He stopped to smoke).</li><li><strong>remember/forget V-ing</strong> = nhớ/quên việc ĐÃ làm (I remember locking the door) ↔ <strong>remember/forget to V</strong> = nhớ/quên PHẢI làm (Remember to lock the door!).</li><li><strong>regret V-ing</strong> = hối hận việc đã làm ↔ <strong>regret to V</strong> = rất tiếc phải thông báo (We regret to inform you...).</li><li><strong>try V-ing</strong> = thử xem sao ↔ <strong>try to V</strong> = cố gắng làm việc khó.</li></ul>",
    examples: [
      { sentence: "I stopped drinking coffee after lunch.", meaningVi: "Tôi đã bỏ thói quen uống cà phê sau bữa trưa." },
      { sentence: "Did you remember to send the invoice?", meaningVi: "Bạn có nhớ gửi hóa đơn không đấy?" },
      { sentence: "I'll never forget seeing Ha Long Bay for the first time.", meaningVi: "Tôi sẽ không bao giờ quên lần đầu nhìn thấy vịnh Hạ Long." },
      { sentence: "Try restarting the router — that usually fixes it.", meaningVi: "Thử khởi động lại router xem — thường là hết lỗi." },
      { sentence: "We regret to inform you that your application was unsuccessful.", meaningVi: "Chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn không được chọn." },
    ],
    commonMistakes: "❌ Remember locking the door tomorrow! ✅ Remember to lock the door tomorrow! | ❌ He stopped to smoke. (ý là bỏ thuốc) ✅ He stopped smoking.",
    comparedWith: "Nhóm like/start/continue + V-ing hoặc to V nghĩa KHÔNG đổi (xem B1) — nhóm này thì nghĩa ĐỔI HẲN, phải phân biệt theo ngữ cảnh.",
  },
  {
    level: "B2",
    title: "Verb + Object + Infinitive: want/make/let sb do — Cấu trúc sai khiến & mong muốn",
    structure: "want/ask/tell/expect + sb + to V | make/let + sb + V (không to) | help + sb + (to) V",
    explanation:
      "<p>Ba mẫu cần tách bạch:</p><ul><li><strong>V + sb + TO V</strong>: want, would like, ask, tell, expect, allow, encourage, remind, advise: <em>I want you <strong>to review</strong> this. She told me <strong>to wait</strong>.</em></li><li><strong>V + sb + V nguyên mẫu KHÔNG to</strong>: chỉ với <strong>make</strong> (bắt buộc) và <strong>let</strong> (cho phép): <em>My boss made me <strong>redo</strong> it. Let me <strong>help</strong> you.</em></li><li><strong>help + sb + (to) V</strong>: cả hai đều đúng: Help me (to) carry this.</li></ul><p>Lỗi nặng nhất của người Việt: dịch 'muốn ai làm gì' thành want + that-clause. Tiếng Anh KHÔNG nói 'I want that you go' — phải là <em>I want you to go</em>. Lưu ý bị động của make lại CÓ to: I was made <strong>to</strong> wait.</p>",
    examples: [
      { sentence: "The client wants us to deliver by Friday.", meaningVi: "Khách hàng muốn chúng tôi bàn giao trước thứ Sáu." },
      { sentence: "My parents didn't let me stay out late.", meaningVi: "Bố mẹ không cho tôi đi chơi về khuya." },
      { sentence: "The teacher made everyone rewrite the essay.", meaningVi: "Giáo viên bắt cả lớp viết lại bài luận." },
      { sentence: "She encouraged me to apply for the scholarship.", meaningVi: "Cô ấy động viên tôi nộp đơn xin học bổng." },
    ],
    commonMistakes: "❌ I want that you come. ✅ I want you to come. | ❌ She made me to cry. ✅ She made me cry. | ❌ Let him to go. ✅ Let him go.",
    comparedWith: "have sb V / get sb to V (nhờ vả — xem Causatives): make = ép, let = cho phép, have/get = nhờ/bố trí.",
  },
  {
    level: "B2",
    title: "Linking Devices: although / despite / however / therefore — Từ nối tương phản & nhân quả",
    structure: "although/though + mệnh đề | despite/in spite of + N/V-ing | However,/Therefore, + câu mới",
    explanation:
      "<p>Chọn từ nối theo <strong>cấu trúc theo sau</strong> — đây là điểm chấm ngữ pháp trong IELTS Writing:</p><ul><li><strong>although/though/even though + MỆNH ĐỀ</strong> (S + V): Although it was raining, we went out.</li><li><strong>despite/in spite of + DANH TỪ/V-ing</strong>: Despite the rain... / Despite being tired... Muốn theo mệnh đề phải thêm the fact that.</li><li><strong>However,</strong> đứng đầu CÂU MỚI, có dấu phẩy: It was risky. <strong>However,</strong> we tried.</li><li>Nhân quả: <strong>because + mệnh đề</strong>, <strong>because of + danh từ</strong>, <strong>therefore/as a result</strong> + câu mới.</li></ul><p>Không dùng đồng thời hai từ nối cho một quan hệ: ❌ Although..., but...</p>",
    examples: [
      { sentence: "Although the deadline was tight, the team delivered on time.", meaningVi: "Mặc dù thời hạn gấp, nhóm vẫn bàn giao đúng hẹn." },
      { sentence: "Despite having little experience, she performed excellently.", meaningVi: "Dù ít kinh nghiệm, cô ấy vẫn thể hiện xuất sắc." },
      { sentence: "The plan looked perfect. However, it failed in practice.", meaningVi: "Kế hoạch trông hoàn hảo. Tuy nhiên, thực tế nó đã thất bại." },
      { sentence: "The tests kept failing; therefore, we postponed the release.", meaningVi: "Các bài test liên tục thất bại; vì vậy chúng tôi hoãn phát hành." },
    ],
    commonMistakes: "❌ Although it rained, but we went out. ✅ Although it rained, we went out. | ❌ Despite it was late... ✅ Despite the late hour / Although it was late... | ❌ However she tried, ... (nghĩa 'dù thế nào') ≠ However, she tried.",
    comparedWith: "but nối trong MỘT câu (thân mật); however mở ĐẦU câu mới (trang trọng); although tạo mệnh đề phụ — ba cấp độ của cùng quan hệ tương phản.",
  },
  {
    level: "B2",
    title: "Participle Clauses — Mệnh đề phân từ (rút gọn trạng ngữ)",
    structure: "V-ing..., S + V (chủ động) | V3..., S + V (bị động) | Having V3..., S + V (xảy ra trước)",
    explanation:
      "<p><strong>Mệnh đề phân từ</strong> rút gọn mệnh đề trạng ngữ khi <strong>hai vế cùng chủ ngữ</strong>, giúp câu văn gọn và trang trọng:</p><ul><li><strong>V-ing</strong> (chủ động, đồng thời/nguyên nhân): <em><strong>Feeling</strong> tired, she went to bed early</em> (= Because she felt tired...).</li><li><strong>Having + V3</strong> (hành động xảy ra TRƯỚC): <em><strong>Having finished</strong> the tests, we deployed the app.</em></li><li><strong>V3</strong> (bị động): <em><strong>Built</strong> in 2010, the bridge is still solid</em> (= which was built...).</li></ul><p>Cạm bẫy lớn nhất — <strong>dangling participle</strong>: phân từ phải cùng chủ ngữ với mệnh đề chính. ❌ <em>Walking down the street, the trees looked beautiful</em> (cây không đi bộ!).</p>",
    examples: [
      { sentence: "Seeing the error logs, the engineer immediately rolled back the release.", meaningVi: "Nhìn thấy log lỗi, kỹ sư lập tức rollback bản phát hành." },
      { sentence: "Having reviewed all the options, we chose PostgreSQL.", meaningVi: "Sau khi cân nhắc mọi lựa chọn, chúng tôi chọn PostgreSQL." },
      { sentence: "Written in plain language, the guide is easy to follow.", meaningVi: "Được viết bằng ngôn ngữ dễ hiểu, cuốn hướng dẫn rất dễ làm theo." },
      { sentence: "Not knowing anyone at the party, he left early.", meaningVi: "Không quen ai ở bữa tiệc, anh ấy về sớm." },
    ],
    commonMistakes: "❌ Walking to work, the rain started. (chủ ngữ lệch) ✅ Walking to work, I got caught in the rain. | ❌ After finished the report... ✅ After finishing the report... / Having finished the report...",
    comparedWith: "Đây là dạng rút gọn của mệnh đề trạng ngữ (because/after/when...); còn rút gọn mệnh đề QUAN HỆ xem bài Reduced Relative Clauses.",
  },
  {
    level: "B2",
    title: "Cleft Sentences: It is... that / What... is — Câu chẻ nhấn mạnh",
    structure: "It is/was + X + that/who... | What + S + V + is/was + X",
    explanation:
      "<p><strong>Câu chẻ</strong> tách một câu thường thành hai phần để <strong>nhấn mạnh đúng thông tin cần nói</strong>:</p><ul><li><strong>It-cleft</strong>: It was <strong>Nam</strong> who broke the build (chính là Nam chứ không phải ai khác). Nhấn được chủ ngữ, tân ngữ, trạng ngữ: It was <strong>yesterday</strong> that we met.</li><li><strong>Wh-cleft</strong>: <strong>What I need is</strong> a long vacation (điều tôi cần là...). Biến thể: What happened was..., All I want is... (all = điều duy nhất).</li></ul><p>Rất đắt giá trong hội thoại để sửa thông tin sai: <em>It wasn't me who deleted it — it was the cron job!</em> và trong writing để dẫn dắt trọng tâm.</p>",
    examples: [
      { sentence: "It was the cache, not the database, that caused the slowdown.", meaningVi: "Chính cái cache, chứ không phải database, gây ra sự chậm trễ." },
      { sentence: "What impressed me most was her calmness under pressure.", meaningVi: "Điều gây ấn tượng với tôi nhất là sự bình tĩnh của cô ấy dưới áp lực." },
      { sentence: "It was only after the outage that we added monitoring.", meaningVi: "Chỉ sau sự cố sập hệ thống chúng tôi mới thêm giám sát." },
      { sentence: "All we need is one more week of testing.", meaningVi: "Tất cả những gì chúng tôi cần là thêm một tuần kiểm thử." },
    ],
    commonMistakes: "❌ It was Nam broke the build. ✅ It was Nam who/that broke the build. | ❌ What I need is go home. ✅ What I need is to go home. | ❌ That I want is... ✅ What I want is...",
    comparedWith: "Cùng mục đích nhấn mạnh còn có đảo ngữ (Never have I...) — xem C1; câu chẻ dễ dùng trong văn nói hơn đảo ngữ.",
  },
  {
    level: "B2",
    title: "Formal Email Phrases — Mẫu câu ngữ pháp trong email công việc",
    structure: "I am writing to + V | I would appreciate it if you could + V | Please find attached + N",
    explanation:
      "<p>Các mẫu câu email trang trọng là những <strong>khuôn ngữ pháp cố định</strong> — sai một chữ là mất tự nhiên:</p><ul><li>Mở bài: <strong>I am writing to</strong> + V (inquire about / follow up on / confirm...).</li><li>Yêu cầu lịch sự: <strong>I would appreciate it if you could</strong> + V (chú ý chữ <em>it</em>); <strong>Could you please</strong> + V; <strong>I was wondering if you could</strong> + V.</li><li>Đính kèm: <strong>Please find attached</strong> + danh từ (không 'find attached here in').</li><li>Nhờ phản hồi: <strong>I look forward to hearing from you</strong> (to + V-ing vì to là giới từ!).</li><li>Báo tin xấu: <strong>I regret to inform you that...</strong> / <strong>Unfortunately, ...</strong></li></ul><p>Nguyên tắc chung: câu hỏi gián tiếp + điều kiện (could/would) = độ lịch sự cao trong văn viết.</p>",
    examples: [
      { sentence: "I am writing to follow up on my previous email regarding the invoice.", meaningVi: "Tôi viết email này để hỏi tiếp về hóa đơn đã đề cập trong email trước." },
      { sentence: "I would appreciate it if you could send the report by Friday.", meaningVi: "Tôi sẽ rất cảm kích nếu anh/chị gửi báo cáo trước thứ Sáu." },
      { sentence: "Please find attached the updated proposal.", meaningVi: "Vui lòng xem bản đề xuất cập nhật trong tệp đính kèm." },
      { sentence: "I look forward to hearing from you soon.", meaningVi: "Tôi mong sớm nhận được phản hồi của anh/chị." },
    ],
    commonMistakes: "❌ I look forward to hear from you. ✅ I look forward to hearing from you. | ❌ I would appreciate if you could... ✅ I would appreciate it if you could... | ❌ Please find attach the file. ✅ Please find attached the file.",
    comparedWith: "Văn nói thân mật: 'Can you send it over?' ↔ email trang trọng: 'Could you please send it at your earliest convenience?' — cùng yêu cầu, hai thanh ghi khác nhau.",
  },
  {
    level: "B2",
    title: "Advanced Quantifiers: both / either / neither / a great deal of — Lượng từ nâng cao",
    structure: "both (of) + N số nhiều | either/neither + N số ít | a great deal of + N không đếm được",
    explanation:
      "<p>Nhóm lượng từ cho <strong>HAI đối tượng</strong>:</p><ul><li><strong>both</strong> (cả hai) + danh từ số nhiều: Both options work. Both of them...</li><li><strong>either</strong> (một trong hai / cái nào cũng được) + danh từ SỐ ÍT: Either day is fine.</li><li><strong>neither</strong> (không cái nào trong hai) + số ít, động từ khẳng định: Neither answer is correct.</li><li>Cặp tương liên: <strong>both A and B</strong>, <strong>either A or B</strong>, <strong>neither A nor B</strong> (động từ chia theo B).</li></ul><p>Lượng từ trang trọng cho lượng lớn: <strong>a great deal of / a large amount of</strong> + không đếm được (a great deal of time); <strong>a large number of</strong> + đếm được số nhiều; <strong>plenty of</strong> + cả hai (dư dả). Dùng chúng thay 'a lot of' trong văn viết học thuật.</p>",
    examples: [
      { sentence: "Both solutions have their trade-offs.", meaningVi: "Cả hai giải pháp đều có những đánh đổi riêng." },
      { sentence: "You can deploy on either server — they are identical.", meaningVi: "Bạn có thể triển khai trên máy chủ nào cũng được — chúng giống hệt nhau." },
      { sentence: "Neither of the candidates has enough experience.", meaningVi: "Không ứng viên nào trong hai người có đủ kinh nghiệm." },
      { sentence: "Optimizing this query saved a great deal of processing time.", meaningVi: "Tối ưu câu truy vấn này tiết kiệm được rất nhiều thời gian xử lý." },
    ],
    commonMistakes: "❌ Neither options are correct. ✅ Neither option is correct. | ❌ Both of they... ✅ Both of them... | ❌ Neither A or B ✅ Neither A nor B | ❌ a great deal of bugs ✅ a great number of bugs",
    comparedWith: "some/any/much/many (A2) đủ cho giao tiếp; nhóm này thêm sắc thái 'trong HAI' và thanh ghi trang trọng cho writing.",
  },
  // ==================== C1 (12) ====================
  {
    level: "C1",
    title: "Inversion — Đảo ngữ nhấn mạnh (Never have I...)",
    structure: "Trạng ngữ phủ định/giới hạn + trợ động từ + S + V",
    explanation:
      "<p><strong>Đảo ngữ</strong> đưa trạng ngữ phủ định/giới hạn lên đầu câu rồi <strong>đảo trợ động từ lên trước chủ ngữ</strong> (như câu hỏi) để nhấn mạnh — dấu ấn của band 7+ trong IELTS Speaking/Writing:</p><ul><li><strong>Never/Rarely/Seldom</strong>: Never <strong>have I seen</strong> such clean code.</li><li><strong>Not only... but also</strong>: Not only <strong>did she design</strong> the UI, but she also wrote the backend.</li><li><strong>Hardly... when / No sooner... than</strong>: Hardly <strong>had I sat</strong> down when the phone rang.</li><li><strong>Only + trạng ngữ</strong>: Only then <strong>did I understand</strong>. Only by testing <strong>can you be</strong> sure.</li><li><strong>Under no circumstances / At no time</strong>: Under no circumstances <strong>should you share</strong> your password.</li></ul><p>Nếu câu không có trợ động từ, mượn do/does/did. Dùng tiết chế — một, hai lần trong bài luận là đủ tạo điểm nhấn.</p>",
    examples: [
      { sentence: "Never have I worked with such a dedicated team.", meaningVi: "Chưa bao giờ tôi được làm việc với một đội tận tâm đến vậy." },
      { sentence: "Not only does the app sync faster, but it also uses less battery.", meaningVi: "Ứng dụng không những đồng bộ nhanh hơn mà còn tốn ít pin hơn." },
      { sentence: "No sooner had we deployed than the traffic spiked.", meaningVi: "Chúng tôi vừa triển khai xong thì lưu lượng truy cập tăng vọt." },
      { sentence: "Only after reading the logs did we find the root cause.", meaningVi: "Chỉ sau khi đọc log chúng tôi mới tìm ra nguyên nhân gốc." },
    ],
    commonMistakes: "❌ Never I have seen... ✅ Never have I seen... | ❌ Not only she is smart... ✅ Not only is she smart... | ❌ Only then I understood. ✅ Only then did I understand.",
    comparedWith: "Câu chẻ (It was... that) nhấn mạnh một THÀNH PHẦN; đảo ngữ nhấn mạnh cả MỆNH ĐỀ với giọng trang trọng, hùng biện hơn.",
  },
  {
    level: "C1",
    title: "Subjunctive — Thức giả định trang trọng (It is essential that he be...)",
    structure: "suggest/demand/insist/recommend + that + S + V(nguyên mẫu) | It is essential/vital that + S + V(nguyên mẫu)",
    explanation:
      "<p><strong>Thức giả định</strong> dùng <strong>động từ nguyên mẫu cho MỌI ngôi</strong> (không -s, không chia thì) trong mệnh đề that sau các động từ/tính từ mang tính yêu cầu, đề xuất: suggest, demand, insist, recommend, request, propose; it is essential/vital/important/imperative that...</p><p><em>The doctor insisted that she <strong>rest</strong></em> (không phải rests). Phủ định: that she <strong>not rest</strong>. Với to be: <em>It is essential that everyone <strong>be</strong> informed</em>.</p><p>Đây là phong cách Anh-Mỹ trang trọng; Anh-Anh thường dùng <strong>should + V</strong> thay thế: It is essential that everyone <strong>should be</strong> informed — cả hai đều đúng, nhưng nhận diện được subjunctive là bắt buộc khi đọc văn bản học thuật, hợp đồng.</p>",
    examples: [
      { sentence: "The committee recommended that the policy be reviewed annually.", meaningVi: "Ủy ban khuyến nghị chính sách này được rà soát hằng năm." },
      { sentence: "It is vital that every change go through code review.", meaningVi: "Điều thiết yếu là mọi thay đổi phải qua khâu review code." },
      { sentence: "She insisted that he not miss the deadline again.", meaningVi: "Cô ấy yêu cầu anh ta không được trễ hạn thêm lần nào nữa." },
      { sentence: "We propose that the meeting be postponed until Monday.", meaningVi: "Chúng tôi đề xuất hoãn cuộc họp đến thứ Hai." },
    ],
    commonMistakes: "❌ It is essential that he is on time. (văn trang trọng) ✅ It is essential that he be on time. | ❌ They demanded that she apologizes. ✅ They demanded that she apologize.",
    comparedWith: "suggest + V-ing (thân mật: She suggested taking a break) ↔ suggest + that + subjunctive (trang trọng: She suggested that we take a break).",
  },
  {
    level: "C1",
    title: "Advanced Conditionals: Had I known... / provided that / but for — Điều kiện nâng cao",
    structure: "Had + S + V3, ... | Should + S + V, ... | Were + S + to V, ... | provided (that) / unless / but for + N",
    explanation:
      "<p><strong>Đảo ngữ trong câu điều kiện</strong> — lược bỏ if, đảo trợ động từ, giọng văn trang trọng:</p><ul><li>Loại 3: If I had known → <strong>Had I known</strong>, I would have told you.</li><li>Loại 2 (were): If I were you → <strong>Were I</strong> you... / Were the company to fail...</li><li>Loại 1 (should — giảm khả năng): If you should need help → <strong>Should you need</strong> help, call me.</li></ul><p><strong>Từ nối điều kiện thay if</strong>: <strong>provided/providing (that)</strong>, <strong>as long as</strong> (miễn là), <strong>on condition that</strong> (với điều kiện), <strong>suppose/supposing</strong> (giả sử), <strong>otherwise</strong> (nếu không thì).</p><p><strong>But for + danh từ</strong> = nếu không nhờ: <em>But for your help, we would have missed the deadline</em> (= If it hadn't been for your help...).</p>",
    examples: [
      { sentence: "Had we monitored the metrics, we would have caught the leak sooner.", meaningVi: "Nếu chúng tôi theo dõi số liệu thì đã phát hiện rò rỉ sớm hơn." },
      { sentence: "Should you have any questions, please do not hesitate to contact us.", meaningVi: "Nếu quý vị có bất kỳ câu hỏi nào, xin đừng ngần ngại liên hệ chúng tôi." },
      { sentence: "You can work remotely provided that you attend the weekly meeting.", meaningVi: "Bạn có thể làm việc từ xa miễn là tham dự cuộc họp hằng tuần." },
      { sentence: "But for the backup, we would have lost everything.", meaningVi: "Nếu không nhờ bản sao lưu, chúng tôi đã mất tất cả." },
    ],
    commonMistakes: "❌ Had I have known... ✅ Had I known... | ❌ Hadn't I known... ✅ Had I not known... (phủ định KHÔNG rút gọn khi đảo) | ❌ Provided you will finish... ✅ Provided you finish...",
    comparedWith: "Nghĩa không đổi so với if-conditional tương ứng — chỉ đổi THANH GHI: đảo ngữ/provided that thuộc văn viết trang trọng, hợp đồng, email chính thức.",
  },
  {
    level: "C1",
    title: "Nominalisation — Danh hóa trong văn viết học thuật",
    structure: "động từ/tính từ → cụm danh từ: analyse → the analysis of...",
    explanation:
      "<p><strong>Danh hóa</strong> — biến động từ/tính từ thành danh từ trừu tượng — là đặc trưng số một của văn viết học thuật và IELTS Task 2 band cao: câu bớt 'kể lể', tăng mật độ thông tin và giọng khách quan.</p><p>So sánh: <em>Because people use smartphones more, they sleep worse</em> → <em><strong>The increased use</strong> of smartphones has led to <strong>a decline in sleep quality</strong>.</em></p><p>Các cặp cần thuộc: grow → growth, develop → development, improve → improvement, reduce → reduction, fail → failure, decide → decision, aware → awareness, able → ability. Kết hợp với động từ 'nhẹ': lead to, result in, contribute to, bring about + cụm danh từ.</p><p>Cảnh báo: lạm dụng danh hóa làm câu khó đọc — mỗi câu 1-2 cụm là đủ.</p>",
    examples: [
      { sentence: "The introduction of remote work has transformed urban traffic patterns.", meaningVi: "Việc áp dụng làm việc từ xa đã thay đổi mô hình giao thông đô thị." },
      { sentence: "There has been a significant reduction in production costs.", meaningVi: "Đã có sự cắt giảm đáng kể trong chi phí sản xuất." },
      { sentence: "Growing awareness of data privacy has influenced app design.", meaningVi: "Nhận thức ngày càng tăng về quyền riêng tư dữ liệu đã ảnh hưởng đến thiết kế ứng dụng." },
      { sentence: "The failure of the negotiations led to a prolonged strike.", meaningVi: "Sự đổ vỡ của các cuộc đàm phán dẫn đến một cuộc đình công kéo dài." },
    ],
    commonMistakes: "❌ The improve of technology... ✅ The improvement of technology... | ❌ People's awareness about... increases ✅ There is growing awareness of... | Lạm dụng: một câu 4-5 danh hóa chồng nhau → tối nghĩa.",
    comparedWith: "Văn nói ưu tiên động từ (Things got much better); văn học thuật ưu tiên cụm danh từ (There was a marked improvement) — chuyển đổi linh hoạt giữa hai thanh ghi là kỹ năng C1.",
  },
  {
    level: "C1",
    title: "Hedging — Rào đón trong văn học thuật (It could be argued that...)",
    structure: "It could be argued that... | tend to / appear to / seem to + V | may/might/could + V | arguably, presumably",
    explanation:
      "<p><strong>Hedging</strong> (rào đón) làm mềm khẳng định để tránh tuyệt đối hóa — bắt buộc trong văn học thuật và IELTS Task 2, nơi 'Technology is destroying society' bị coi là thiếu chín chắn so với 'Technology <strong>may be undermining</strong> some aspects of social life'.</p><p>Hộp công cụ rào đón:</p><ul><li>Động từ khuyết thiếu: may, might, could + V.</li><li>Động từ rào: <strong>tend to, appear to, seem to</strong> + V; <strong>suggest, indicate</strong> (thay prove).</li><li>Cấu trúc vô nhân xưng: <strong>It could be argued that..., It is generally believed that...</strong></li><li>Trạng từ/lượng từ: arguably, presumably, to some extent, in most cases, <strong>a majority of</strong> (thay all).</li></ul><p>Ngược lại với hedging là boosting (clearly, undoubtedly) — dùng khi bằng chứng thật sự mạnh.</p>",
    examples: [
      { sentence: "It could be argued that social media does more harm than good.", meaningVi: "Có thể lập luận rằng mạng xã hội gây hại nhiều hơn lợi." },
      { sentence: "Younger employees tend to adapt to new tools more quickly.", meaningVi: "Nhân viên trẻ có xu hướng thích nghi với công cụ mới nhanh hơn." },
      { sentence: "The data suggests that remote workers are, to some extent, more productive.", meaningVi: "Dữ liệu cho thấy người làm việc từ xa, ở một mức độ nào đó, làm việc hiệu quả hơn." },
      { sentence: "This approach appears to reduce memory usage in most cases.", meaningVi: "Cách tiếp cận này dường như giảm mức dùng bộ nhớ trong đa số trường hợp." },
    ],
    commonMistakes: "❌ This proves that... (khi chỉ có một khảo sát) ✅ This suggests that... | ❌ All young people are addicted to phones. ✅ Many young people appear to be overly dependent on phones. | Rào đón chồng chất: It might perhaps possibly be... → chọn MỘT lớp rào.",
    comparedWith: "Modals of deduction (B1) suy luận về sự việc cụ thể; hedging là chiến lược VĂN PHONG để trình bày quan điểm học thuật một cách thận trọng.",
  },
  {
    level: "C1",
    title: "Ellipsis & Substitution — Tỉnh lược và thay thế (do so, if so, one)",
    structure: "...and S + aux (lược V) | do so / do it | if so / if not | one/ones | so/not sau think, hope...",
    explanation:
      "<p>Người bản xứ tránh lặp lại bằng hai kỹ thuật:</p><ul><li><strong>Tỉnh lược (ellipsis)</strong> — cắt phần trùng, giữ trợ động từ: <em>She can code in Rust, and I can (code in Rust) too. He said he'd help, and he <strong>did</strong>.</em></li><li><strong>Thay thế (substitution)</strong>: <strong>do so</strong> thay cả cụm động từ trang trọng (Those who wish to unsubscribe may <strong>do so</strong> below); <strong>one/ones</strong> thay danh từ (I'll take the blue <strong>one</strong>); <strong>so/not</strong> thay mệnh đề sau think, hope, believe, be afraid: <em>Is it ready? — I think <strong>so</strong> / I'm afraid <strong>not</strong>.</em></li><li><strong>if so / if not</strong> thay cả câu điều kiện: <em>The test may fail. <strong>If so</strong>, rerun the pipeline.</em></li></ul><p>Nắm được các phép thay thế này giúp NGHE hiểu hội thoại nhanh và viết văn không lặp từ.</p>",
    examples: [
      { sentence: "I asked him to review the PR, and he did.", meaningVi: "Tôi nhờ anh ấy review PR, và anh ấy đã làm vậy." },
      { sentence: "Users who want to delete their account can do so in Settings.", meaningVi: "Người dùng muốn xóa tài khoản có thể thực hiện trong phần Cài đặt." },
      { sentence: "Will the release be on time? — I hope so, but I'm afraid not.", meaningVi: "Bản phát hành có đúng hẹn không? — Tôi hy vọng vậy, nhưng e là không." },
      { sentence: "The old servers are slower than the new ones.", meaningVi: "Các máy chủ cũ chậm hơn những cái mới." },
    ],
    commonMistakes: "❌ I think yes. ✅ I think so. | ❌ Those who want to leave can do it so. ✅ ...can do so. | ❌ I'll take the red it. ✅ I'll take the red one.",
    comparedWith: "So do I / Neither do I (B1) là một dạng tỉnh lược chuyên cho sự đồng tình; bài này mở rộng ra toàn bộ hệ thay thế của tiếng Anh.",
  },
  {
    level: "C1",
    title: "Advanced Discourse Markers: nevertheless / albeit / notwithstanding — Từ nối diễn ngôn cao cấp",
    structure: "Nevertheless,/Nonetheless, + câu | albeit + adj/adv/cụm | notwithstanding + N | Moreover,/Furthermore,/Hence, + câu",
    explanation:
      "<p>Bộ từ nối nâng thanh ghi trang trọng cho writing:</p><ul><li><strong>Nevertheless / Nonetheless</strong> (dù vậy — mạnh hơn however): The plan is risky. <strong>Nevertheless</strong>, we will proceed.</li><li><strong>albeit</strong> (dù là — chỉ đứng trước tính từ/trạng từ/cụm, KHÔNG trước mệnh đề đầy đủ): The upgrade was successful, <strong>albeit slow</strong>.</li><li><strong>notwithstanding + danh từ</strong> (bất chấp — rất trang trọng, pháp lý): <strong>Notwithstanding the objections</strong>, the board approved it.</li><li>Bổ sung: <strong>Moreover / Furthermore</strong> (hơn nữa); kết luận: <strong>Hence / Thus / Consequently</strong>.</li><li>Chuyển ý: <strong>With regard to / As for</strong> (về phần...); <strong>On balance</strong> (cân nhắc mọi mặt — đắt giá cho kết luận IELTS).</li></ul><p>Nguyên tắc: các trạng từ liên kết đứng đầu câu mới + dấu phẩy; không dùng chúng để NỐI hai mệnh đề bằng dấu phẩy đơn thuần (comma splice).</p>",
    examples: [
      { sentence: "The framework is old; nevertheless, it remains widely used.", meaningVi: "Framework này đã cũ; dù vậy, nó vẫn được dùng rộng rãi." },
      { sentence: "The feature shipped on time, albeit with limited functionality.", meaningVi: "Tính năng ra mắt đúng hạn, dù là với chức năng hạn chế." },
      { sentence: "Notwithstanding the budget cuts, the project was completed.", meaningVi: "Bất chấp việc cắt giảm ngân sách, dự án vẫn hoàn thành." },
      { sentence: "On balance, the benefits of automation outweigh its drawbacks.", meaningVi: "Cân nhắc mọi mặt, lợi ích của tự động hóa vượt trội so với hạn chế." },
    ],
    commonMistakes: "❌ Albeit it was slow, ... ✅ Albeit slow, ... / Although it was slow, ... | ❌ The plan failed, nevertheless we learned a lot. (comma splice) ✅ The plan failed. Nevertheless, we learned a lot. | ❌ Dùng 5-6 từ nối trang trọng trong một đoạn ngắn → gượng gạo.",
    comparedWith: "although/despite/however (B2) là bộ khung; nevertheless/albeit/notwithstanding là phiên bản thanh ghi cao — dùng chọn lọc để văn tự nhiên.",
  },
  {
    level: "C1",
    title: "Collocation Patterns — Khuôn kết hợp từ tự nhiên",
    structure: "V + N (make a decision) | adj + N (heavy rain) | adv + adj (highly unlikely) | V + adv (rise sharply)",
    explanation:
      "<p><strong>Collocation</strong> là những cặp từ 'đi với nhau' theo thói quen bản ngữ — đúng ngữ pháp nhưng sai collocation vẫn lộ ngay người học: ❌ do a decision → ✅ <strong>make</strong> a decision; ❌ strong rain → ✅ <strong>heavy</strong> rain.</p><p>Các khuôn cần gom từ vựng theo:</p><ul><li><strong>V + N</strong>: make a mistake/an effort; do research/damage; take responsibility/a risk; pay attention; catch a cold.</li><li><strong>Adj + N</strong>: heavy traffic/rain; strong coffee/accent; high demand/quality; bitter disappointment.</li><li><strong>Adv + Adj</strong>: highly unlikely/effective; deeply concerned; utterly ridiculous; fully aware.</li><li><strong>V + Adv</strong> (miêu tả biểu đồ IELTS): rise sharply, fall dramatically, remain stable, fluctuate wildly.</li></ul><p>Chiến lược: học từ mới luôn kèm 2-3 bạn đồng hành của nó; tra từ điển collocation thay vì dịch từng từ từ tiếng Việt.</p>",
    examples: [
      { sentence: "We need to make a decision and take full responsibility for it.", meaningVi: "Chúng ta cần đưa ra quyết định và chịu hoàn toàn trách nhiệm về nó." },
      { sentence: "Sales rose sharply in the first quarter.", meaningVi: "Doanh số tăng mạnh trong quý một." },
      { sentence: "It is highly unlikely that the schedule will change.", meaningVi: "Khả năng lịch trình thay đổi là cực kỳ thấp." },
      { sentence: "She has a strong accent but writes flawless English.", meaningVi: "Cô ấy nói giọng đặc sệt nhưng viết tiếng Anh hoàn hảo." },
    ],
    commonMistakes: "❌ do a mistake ✅ make a mistake | ❌ make homework ✅ do homework | ❌ very delicious ✅ absolutely delicious (tính từ cực cấp đi với absolutely/utterly) | ❌ open the light ✅ turn on the light",
    comparedWith: "Khác ngữ pháp thuần túy: collocation không có 'quy tắc' suy ra được — là tri thức thống kê về cách bản ngữ dùng từ, quyết định điểm Lexical Resource trong IELTS.",
  },
  {
    level: "C1",
    title: "Complex Noun Phrases — Cụm danh từ phức trong Writing",
    structure: "(mạo từ) + trạng từ + tính từ + N + cụm giới từ/mệnh đề rút gọn",
    explanation:
      "<p>Văn viết học thuật 'nén' thông tin vào <strong>cụm danh từ nhiều tầng</strong> thay vì rải ra nhiều mệnh đề: <em>a <strong>rapidly growing</strong> number of <strong>internet users in developing countries</strong></em> — một cụm danh từ chứa lượng thông tin của cả một câu.</p><p>Trật tự tính từ trước danh từ (OSASCOMP): ý kiến → kích thước → tuổi → hình dạng → màu → nguồn gốc → chất liệu → mục đích: <em>a beautiful old Vietnamese wooden coffee table.</em></p><p>Mở rộng sau danh từ: cụm giới từ (the impact <strong>of AI on employment</strong>), phân từ rút gọn (the measures <strong>taken by the government</strong>), to V (the ability <strong>to adapt</strong>). Kỹ năng này quyết định độ 'academic' của Task 1/Task 2 và giúp đọc hiểu văn bản khoa học dày đặc.</p>",
    examples: [
      { sentence: "The steady increase in the number of remote workers has reshaped city centers.", meaningVi: "Sự gia tăng đều đặn về số lượng người làm việc từ xa đã định hình lại các trung tâm thành phố." },
      { sentence: "Researchers highlighted the long-term effects of sleep deprivation on memory.", meaningVi: "Các nhà nghiên cứu nhấn mạnh tác động dài hạn của thiếu ngủ lên trí nhớ." },
      { sentence: "She bought a tiny old French ceramic teapot.", meaningVi: "Cô ấy mua một ấm trà gốm Pháp cổ nhỏ xíu." },
      { sentence: "The government's decision to raise fuel taxes sparked heated debate.", meaningVi: "Quyết định tăng thuế nhiên liệu của chính phủ làm dấy lên tranh luận gay gắt." },
    ],
    commonMistakes: "❌ a wooden beautiful table ✅ a beautiful wooden table (sai trật tự tính từ) | ❌ the increase number of users ✅ the increased/increasing number of users | ❌ Cụm quá dài 5-6 tầng → tách bớt thành mệnh đề.",
    comparedWith: "Nominalisation tạo ra DANH TỪ trừu tượng; complex noun phrase là nghệ thuật XẾP các thành tố quanh danh từ đó thành một khối thông tin đặc.",
  },
  {
    level: "C1",
    title: "Would rather / It's (high) time + past — Giả định sau would rather và it's time",
    structure: "would rather + V (tự làm) | would rather + S + quá khứ đơn (người khác làm) | It's (high) time + S + quá khứ đơn",
    explanation:
      "<p>Hai cấu trúc dùng <strong>thì quá khứ với nghĩa hiện tại</strong> (unreal past):</p><ul><li><strong>would rather + V nguyên mẫu</strong> khi chính mình làm: I'd rather <strong>stay</strong> home tonight. So sánh: would rather A <strong>than</strong> B.</li><li><strong>would rather + S + QUÁ KHỨ ĐƠN</strong> khi muốn NGƯỜI KHÁC làm: I'd rather you <strong>didn't tell</strong> anyone (= xin đừng nói với ai).</li><li><strong>It's time / It's high time + S + QUÁ KHỨ ĐƠN</strong>: đã đến lúc (mà lẽ ra phải làm rồi — có ý sốt ruột): It's high time we <strong>upgraded</strong> this legacy system.</li></ul><p>Về quá khứ thật sự: would rather + <strong>have V3</strong>: I'd rather have taken the train (giá mà hồi đó đi tàu).</p>",
    examples: [
      { sentence: "I would rather work from home than commute two hours a day.", meaningVi: "Tôi thà làm việc ở nhà còn hơn đi lại hai tiếng mỗi ngày." },
      { sentence: "I'd rather you didn't share this document yet.", meaningVi: "Tôi mong bạn khoan chia sẻ tài liệu này đã." },
      { sentence: "It's high time we automated these manual reports.", meaningVi: "Đã đến lúc chúng ta phải tự động hóa mấy báo cáo thủ công này rồi." },
      { sentence: "It's time the children went to bed.", meaningVi: "Đến giờ bọn trẻ phải đi ngủ rồi." },
    ],
    commonMistakes: "❌ I'd rather to stay home. ✅ I'd rather stay home. | ❌ I'd rather you don't smoke here. ✅ I'd rather you didn't smoke here. | ❌ It's time we upgrade. ✅ It's time we upgraded. / It's time to upgrade.",
    comparedWith: "Cùng họ 'unreal past' với wish và điều kiện loại 2: dạng quá khứ nhưng nói về hiện tại/mong muốn. It's time + to V (trung tính) ↔ It's time + S + past (kèm ý trách đã trễ).",
  },
  {
    level: "C1",
    title: "Concessive Clauses: Adj + as/though + S + V — Nhượng bộ đảo bậc cao",
    structure: "Adj/Adv + as/though + S + V, ... | much as + S + V | whatever/however + adj + S + V",
    explanation:
      "<p>Cấu trúc nhượng bộ trang trọng <strong>đảo tính từ/trạng từ lên trước as/though</strong>: <em><strong>Hard as</strong> he tried, he couldn't fix the bug</em> = Dù anh ấy cố gắng đến mấy... <em><strong>Strange though</strong> it may seem, the numbers are correct.</em></p><p>Họ hàng cùng thanh ghi:</p><ul><li><strong>much as + S + V</strong> (dù rất): Much as I admire her work, I disagree with this design.</li><li><strong>however + adj/adv + S + V</strong>: However carefully you plan, something will go wrong.</li><li><strong>whatever/whoever/wherever...</strong>: Whatever happens, stay calm. Whatever the cost, we must ship on time.</li><li><strong>no matter + wh-</strong>: No matter how hard it gets, don't give up.</li></ul><p>Các cấu trúc này thay although ở cấp độ tu từ — dùng trong writing, diễn thuyết, và nghe hiểu văn chương.</p>",
    examples: [
      { sentence: "Tired as she was, she stayed to finish the deployment.", meaningVi: "Dù mệt mỏi, cô ấy vẫn ở lại để hoàn tất việc triển khai." },
      { sentence: "Much as I would like to help, my hands are tied.", meaningVi: "Dù rất muốn giúp, tôi cũng đành bó tay." },
      { sentence: "However complex the problem is, break it into smaller steps.", meaningVi: "Dù vấn đề phức tạp đến đâu, hãy chia nhỏ nó ra từng bước." },
      { sentence: "No matter what they offer, he won't leave his team.", meaningVi: "Bất kể họ đề nghị gì, anh ấy sẽ không rời đội của mình." },
    ],
    commonMistakes: "❌ As hard he tried, ... ✅ Hard as he tried, ... | ❌ However it is complex, ... ✅ However complex it is, ... | ❌ No matter how it is hard ✅ No matter how hard it is",
    comparedWith: "although + mệnh đề là dạng trung tính (B2); các dạng đảo ở đây thêm sức nặng tu từ và độ trang trọng — nhận diện chúng là chìa khóa đọc hiểu C1.",
  },
  {
    level: "C1",
    title: "Workplace Softening: I was wondering if... — Làm mềm câu nói nơi công sở",
    structure: "I was wondering if you could + V | Would it be possible to + V? | You might want to + V | It might be worth + V-ing",
    explanation:
      "<p>Ở môi trường làm việc quốc tế, người bản xứ 'bọc đệm' yêu cầu và góp ý bằng <strong>thì quá khứ, tiếp diễn và khuyết thiếu</strong> — càng gián tiếp càng lịch sự:</p><ul><li>Nhờ vả cấp cao: <strong>I was wondering if you could</strong> review this by Friday. / <strong>Would it be possible to</strong> extend the deadline?</li><li>Góp ý không áp đặt: <strong>You might want to</strong> double-check the config. / <strong>It might be worth</strong> adding a test here.</li><li>Báo vấn đề nhẹ nhàng (understatement): There <strong>seems to be a slight</strong> issue with the login flow (thực tế có thể là lỗi to).</li><li>Từ chối mềm: <strong>I'm afraid</strong> that won't be possible. / That <strong>might be a bit</strong> tricky.</li></ul><p>Chú ý văn hóa: 'That's interesting. You might want to reconsider X' từ đồng nghiệp bản xứ thường nghĩa là 'X đang có vấn đề đấy'.</p>",
    examples: [
      { sentence: "I was wondering if you could share the meeting notes.", meaningVi: "Không biết anh/chị có thể chia sẻ biên bản cuộc họp được không." },
      { sentence: "Would it be possible to move our 1:1 to Thursday?", meaningVi: "Liệu có thể dời buổi họp 1:1 của chúng ta sang thứ Năm không?" },
      { sentence: "You might want to add error handling to this endpoint.", meaningVi: "Có lẽ bạn nên thêm xử lý lỗi cho endpoint này." },
      { sentence: "I'm afraid we won't be able to meet that deadline.", meaningVi: "Tôi e rằng chúng tôi không thể kịp thời hạn đó." },
    ],
    commonMistakes: "❌ I want you to review this now. (với đồng nghiệp/cấp trên) ✅ I was wondering if you could review this when you have a moment. | ❌ Your code is wrong. ✅ There seems to be an issue with this part. | ❌ It might be worth to add tests. ✅ It might be worth adding tests.",
    comparedWith: "Polite requests A2 (Could you...?) là nền; tầng C1 thêm quá khứ tiếp diễn (I was wondering), giả định (Would it be possible) và understatement — chuẩn giao tiếp email/Slack chuyên nghiệp.",
  },
];


// ============================ MAIN ============================
async function main(): Promise<void> {
  validateData(EN_ALPHABET, EN_GRAMMAR_EXTRA);

  const language = await prisma.language.findUnique({ where: { code: 'en' } });
  if (!language) {
    console.error("❌ Language 'en' not found — run seed.my-language.ts first.");
    process.exit(1);
  }

  console.log(`🌱 Seeding EXTRA English content (language id=${language.id})...`);
  await seedAlphabet(language.id, EN_ALPHABET);
  await seedGrammar(language.id, EN_GRAMMAR_EXTRA);

  console.log('✅ EN-extra seed complete:');
  console.log(`   alphabet groups: +${summary.alphabetGroups.created} (skipped ${summary.alphabetGroups.skipped})`);
  console.log(`   alphabet items:  +${summary.alphabetItems.created} (skipped ${summary.alphabetItems.skipped})`);
  console.log(`   grammar points:  +${summary.grammar.created} (skipped ${summary.grammar.skipped})`);
  for (const [level, s] of Object.entries(grammarByLevel)) {
    console.log(`     ${level}: +${s.created} (skipped ${s.skipped})`);
  }
}

main()
  .catch((err) => {
    console.error('❌ EN-extra seed failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
