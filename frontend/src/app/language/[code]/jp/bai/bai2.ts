/**
 * KHOÁ JP · Bài 2 — Đồ vật quanh ta: これ・それ・あれ, この N, の (05/10/2026).
 *
 * Soạn theo ../SOAN-BAI.md. Tự viết 100% (hội thoại, ví dụ, bài nghe, bài đọc).
 * Giả định Bài 1 đã dạy: chào hỏi, はじめまして, わたし/あなた, N は N です /
 * じゃありません, か, も, の sở hữu cơ bản, nghề nghiệp & quốc tịch, số 0–10.
 *
 * Nhân vật & giọng: ラン (Lan, nữ, vai a) · たなかさん (Tanaka, nam, vai b) ·
 * やまだ先生 (Yamada-sensei, cô giáo, nữ, vai c) · マイクさん (Mike, nam, vai b) ·
 * キムさん (Kim, nữ — chỉ xuất hiện trong bài nghe/bài đọc, giọng ja-nu).
 */
import type { Lesson } from '@/components/sach-hoc/types';

/* ── Đáp án gõ tay ─────────────────────────────────────────────────────────
 * Bộ chấm bỏ dấu câu/khoảng trắng và đổi chữ/số toàn khổ về nửa khổ, nhưng
 * KHÔNG tự đổi chữ Hán ↔ kana. ans() nhận mẫu có furigana {漢字|かな} và sinh
 * mọi tổ hợp gõ Hán hoặc gõ kana cho từng chữ, cộng じゃ/では. Phần tử ĐẦU là
 * bản chữ Hán đầy đủ (trang hiện nó làm "Đáp án").
 */
const RUBY = /\{([^|}]+)\|([^}]+)\}/g;
function ans(...forms: string[]): string[] {
  const out = new Set<string>();
  for (const f of forms) {
    const n = [...f.matchAll(RUBY)].length;
    const bases: string[] = [];
    if (n <= 6) {
      for (let mask = 0; mask < 1 << n; mask++) {
        let i = 0;
        bases.push(f.replace(RUBY, (_m, k: string, r: string) => ((mask >> i++) & 1 ? r : k)));
      }
    } else {
      bases.push(f.replace(RUBY, '$1'), f.replace(RUBY, '$2'));
    }
    for (const b of bases) for (const x of [b, b.replace(/じゃありません/g, 'ではありません')]) out.add(x);
  }
  return [...out];
}

/* ══════════════════════════ 1. HỘI THOẠI ══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b2-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: これは何ですか — Hỏi đồ vật, hỏi của ai',
  goal: 'Hỏi "cái này là gì?", hỏi đồ vật là của ai, nói đồ của mình, tặng và nhận một món quà nhỏ.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 2 — hôm nay học gì',
      items: [
        'Chỉ vào đồ vật và gọi tên: **これ** (cái này — gần tôi), **それ** (cái đó — gần bạn), **あれ** (cái kia — xa cả hai).',
        'Hỏi **これは{何|なん}ですか** (cái này là gì?) và trả lời **そうです／ちがいます** (đúng / không phải).',
        'Gắn chỉ định vào danh từ: **この{本|ほん}** (quyển sách này), **そのかさ** (cái ô đó), **あの{車|くるま}** (chiếc xe kia).',
        'Dùng **の** để nói "của ai" (わたしのかぎ) và "về cái gì" ({日本語|にほんご}の{本|ほん} — sách tiếng Nhật).',
        'Hỏi chủ nhân: **だれの**ですか (của ai?), lịch sự hơn: **どなたの**ですか.',
      ],
    },
    { t: 'h', text: 'Học xong Bài 2 bạn nói được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Mẫu câu dùng'],
      rows: [
        ['1. Trong lớp học', 'Chỉ vào đồ vật lạ và hỏi tên nó; hỏi lại khi chưa chắc.', 'これ・それ・あれ, {何|なん}ですか, Nの N'],
        ['2. Đồ ai bỏ quên', 'Hỏi đồ vật là của ai; nói "không phải của tôi", "của tôi đấy".', 'この／その N, だれのですか, わたしのです'],
        ['3. Tặng quà quê nhà', 'Đưa quà, nói quà là gì, từ đâu; hỏi lựa chọn "A hay B?".', 'N1 ですか、N2 ですか, ベトナムの N'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học phần này: đọc **tình huống** (tiếng Việt) → bấm nghe cả đoạn → bấm từng câu và đọc to theo 3 lần → tắt furigana, tắt romaji rồi tự đọc lại. Để ý **người nói đứng ở đâu so với đồ vật** — đó là chìa khoá chọn これ, それ hay あれ.',
    },
    {
      t: 'table',
      caption: 'Nhân vật của khoá (dùng suốt từ Bài 1 tới N1)',
      head: ['Nhân vật', 'Đọc', 'Là ai'],
      rows: [
        ['ラン', 'Ran', 'Lan — sinh viên Việt Nam sang Tokyo học tiếng Nhật (vai chính)'],
        ['たなかさん', 'Tanaka-san', 'Bạn cùng lớp người Nhật (nam), hay giúp Lan'],
        ['やまだ{先生|せんせい}', 'Yamada-sensei', 'Cô giáo chủ nhiệm lớp tiếng Nhật'],
        ['マイクさん', 'Maiku-san', 'Mike — bạn cùng lớp người Mỹ (nam)'],
        ['キムさん', 'Kimu-san', 'Kim — bạn cùng lớp người Hàn Quốc (nữ)'],
      ],
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Trong lớp: これは何ですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Giờ giải lao, Lan ngồi cạnh bàn của Tanaka. Trên bàn có một quyển sách dày Lan chưa thấy bao giờ. Lan cầm nó lên (đồ ở **tay Lan** → Lan nói **これ**; với Tanaka thì nó ở phía người nghe → Tanaka nói **それ**).',
    },
    {
      t: 'dialogue',
      title: 'Cái này là gì?',
      lines: [
        { who: 'ラン', role: 'a', text: 'たなかさん、すみません。これは{何|なん}ですか。', ro: 'Tanaka-san, sumimasen. Kore wa nan desu ka.', vi: 'Anh Tanaka, cho mình hỏi. Cái này là gì vậy?' },
        { who: 'たなか', role: 'b', text: 'それはじしょです。{日本語|にほんご}のじしょです。', ro: 'Sore wa jisho desu. Nihongo no jisho desu.', vi: 'Đó là từ điển. Từ điển tiếng Nhật.' },
        { who: 'ラン', role: 'a', text: 'そうですか。じゃ、それは{何|なん}ですか。', ro: 'Sō desu ka. Ja, sore wa nan desu ka.', vi: 'Ra vậy. Thế còn cái đó (chỗ anh) là gì?' },
        { who: 'たなか', role: 'b', text: 'これですか。これはざっしです。{車|くるま}のざっしです。', ro: 'Kore desu ka. Kore wa zasshi desu. Kuruma no zasshi desu.', vi: 'Cái này à? Cái này là tạp chí. Tạp chí về ô tô.' },
        { who: 'ラン', role: 'a', text: 'あれも{車|くるま}のざっしですか。', ro: 'Are mo kuruma no zasshi desu ka.', vi: 'Cái kia cũng là tạp chí ô tô à?' },
        { who: 'たなか', role: 'b', text: 'いいえ、あれはざっしじゃありません。{新聞|しんぶん}です。', ro: 'Iie, are wa zasshi ja arimasen. Shinbun desu.', vi: 'Không, cái kia không phải tạp chí. Là báo.' },
        { who: 'ラン', role: 'a', text: '{日本|にほん}の{新聞|しんぶん}ですか。', ro: 'Nihon no shinbun desu ka.', vi: 'Báo Nhật à?' },
        { who: 'たなか', role: 'b', text: 'ええ、そうです。', ro: 'Ē, sō desu.', vi: 'Ừ, đúng rồi.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        'Lan cầm quyển sách → **これ**; Tanaka nhìn quyển sách ở tay Lan → **それ**. Cùng một đồ vật, hai người gọi khác nhau vì **đứng ở hai chỗ khác nhau**.',
        'Tanaka hỏi lại **これですか** (cái này á?) trước khi trả lời — câu rất tự nhiên khi muốn chắc mình hiểu đúng đồ vật.',
        '**{車|くるま}のざっし** = tạp chí VỀ ô tô (の chỉ nội dung), không phải "tạp chí CỦA ô tô".',
        '**ええ** = "vâng / ừ", mềm và thân hơn **はい** một chút; trong lớp, nói với thầy cô thì dùng はい.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: 'Cái này là gì?' },
        { en: 'それはじしょです。', ro: 'Sore wa jisho desu.', vi: 'Đó là từ điển.' },
        { en: '{日本語|にほんご}のじしょです。', ro: 'Nihongo no jisho desu.', vi: 'Là từ điển tiếng Nhật.' },
        { en: 'これですか。', ro: 'Kore desu ka.', vi: 'Cái này á? (hỏi lại cho chắc)' },
        { en: 'あれはざっしじゃありません。', ro: 'Are wa zasshi ja arimasen.', vi: 'Cái kia không phải tạp chí.' },
        { en: 'ええ、そうです。', ro: 'Ē, sō desu.', vi: 'Ừ, đúng vậy.' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Đồ ai bỏ quên: このかさはだれのですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Hết giờ học, cô Yamada thấy một cái ô và một chùm chìa khoá còn trong lớp. Cô **cầm cái ô** (→ cô nói **この**かさ) và hỏi cả lớp. Lan đứng ngay trước mặt cô (→ Lan nói **それ**, vì ô ở chỗ cô).',
    },
    {
      t: 'dialogue',
      title: 'Cái ô này của ai?',
      lines: [
        { who: 'やまだ先生', role: 'c', text: 'みなさん、このかさはだれのですか。', ro: 'Minasan, kono kasa wa dare no desu ka.', vi: 'Các em ơi, cái ô này của ai thế?' },
        { who: 'マイク', role: 'b', text: 'わたしのじゃありません。', ro: 'Watashi no ja arimasen.', vi: 'Không phải của em ạ.' },
        { who: 'やまだ先生', role: 'c', text: 'そうですか。じゃ、ランさんのですか。', ro: 'Sō desu ka. Ja, Ran-san no desu ka.', vi: 'Vậy à. Thế của Lan à?' },
        { who: 'ラン', role: 'a', text: 'あ、はい。それはわたしのです。', ro: 'A, hai. Sore wa watashi no desu.', vi: 'A, vâng. Cái đó là của em.' },
        { who: 'やまだ先生', role: 'c', text: 'はい、どうぞ。', ro: 'Hai, dōzo.', vi: 'Đây, của em này.' },
        { who: 'ラン', role: 'a', text: 'ありがとうございます。', ro: 'Arigatō gozaimasu.', vi: 'Em cảm ơn cô.' },
        { who: 'やまだ先生', role: 'c', text: 'このかぎもランさんのですか。', ro: 'Kono kagi mo Ran-san no desu ka.', vi: 'Chùm chìa khoá này cũng của Lan à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、ちがいます。わたしのはこれです。', ro: 'Iie, chigaimasu. Watashi no wa kore desu.', vi: 'Dạ không phải ạ. Của em là cái này.' },
        { who: 'やまだ先生', role: 'c', text: 'そうですか。じゃ、だれのですか。', ro: 'Sō desu ka. Ja, dare no desu ka.', vi: 'Vậy à. Thế của ai nhỉ?' },
        { who: 'マイク', role: 'b', text: 'あっ、そのかぎはわたしのです。すみません。', ro: 'A, sono kagi wa watashi no desu. Sumimasen.', vi: 'Á, chìa khoá đó là của em. Em xin lỗi ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**このかさ** (cái ô này) — cô đang cầm. Lan và Mike nói **それ／そのかぎ** — đồ ở **tay cô** (gần người nghe).',
        'Lan giơ chùm khoá của mình lên: **わたしのはこれです** = "cái của em là cái này". **わたしの** = "cái của tôi" — の đứng một mình thay cho đồ vật đã nói tới, khỏi lặp lại かぎ.',
        '**いいえ、ちがいます** = "không, không phải" — câu trả lời phủ định ngắn gọn cho câu hỏi "có phải là… không?".',
        '**はい、どうぞ** khi đưa đồ cho ai: "đây, mời / của bạn đây".',
        'Mike nói **すみません** vì để quên đồ làm phiền cô — すみません vừa là "xin lỗi" vừa là "cho hỏi" (Tình huống 1).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'このかさはだれのですか。', ro: 'Kono kasa wa dare no desu ka.', vi: 'Cái ô này của ai?' },
        { en: 'わたしのじゃありません。', ro: 'Watashi no ja arimasen.', vi: 'Không phải của tôi.' },
        { en: 'いいえ、ちがいます。', ro: 'Iie, chigaimasu.', vi: 'Không, không phải.' },
        { en: 'それはわたしのです。', ro: 'Sore wa watashi no desu.', vi: 'Cái đó là của tôi.' },
        { en: 'わたしのはこれです。', ro: 'Watashi no wa kore desu.', vi: 'Cái của tôi là cái này.' },
        { en: 'はい、どうぞ。', ro: 'Hai, dōzo.', vi: 'Đây, mời bạn / của bạn đây.' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Tặng quà quê nhà: コーヒーですか、おちゃですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Lan mang từ Việt Nam sang vài gói quà. Sáng nay Lan đưa cho Tanaka một gói. Tanaka chưa biết bên trong là gì nên hỏi kiểu lựa chọn: "cà phê hay trà?".',
    },
    {
      t: 'dialogue',
      title: 'Quà Việt Nam',
      lines: [
        { who: 'ラン', role: 'a', text: 'たなかさん、これ、どうぞ。', ro: 'Tanaka-san, kore, dōzo.', vi: 'Anh Tanaka, cái này, tặng anh.' },
        { who: 'たなか', role: 'b', text: 'え？{何|なん}ですか。', ro: 'E? Nan desu ka.', vi: 'Hả? Gì thế?' },
        { who: 'ラン', role: 'a', text: 'ベトナムのおみやげです。', ro: 'Betonamu no omiyage desu.', vi: 'Quà Việt Nam đấy.' },
        { who: 'たなか', role: 'b', text: 'ありがとうございます。これはコーヒーですか、おちゃですか。', ro: 'Arigatō gozaimasu. Kore wa kōhī desu ka, ocha desu ka.', vi: 'Cảm ơn Lan. Cái này là cà phê hay trà?' },
        { who: 'ラン', role: 'a', text: 'コーヒーです。ベトナムのコーヒーです。', ro: 'Kōhī desu. Betonamu no kōhī desu.', vi: 'Cà phê. Cà phê Việt Nam.' },
        { who: 'たなか', role: 'b', text: 'わあ、どうもありがとうございます。', ro: 'Wā, dōmo arigatō gozaimasu.', vi: 'Ồ, cảm ơn Lan nhiều lắm.' },
        { who: 'ラン', role: 'a', text: 'いいえ。', ro: 'Iie.', vi: 'Không có gì đâu.' },
        { who: 'たなか', role: 'b', text: 'あ、ランさん、それも{日本|にほん}のおかしですか。', ro: 'A, Ran-san, sore mo Nihon no okashi desu ka.', vi: 'À Lan, cái đó cũng là bánh kẹo Nhật à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、これはベトナムのチョコレートです。', ro: 'Iie, kore wa Betonamu no chokorēto desu.', vi: 'Không, cái này là sô-cô-la Việt Nam.' },
        { who: 'たなか', role: 'b', text: 'へえ、ベトナムのチョコレートですか。', ro: 'Hē, Betonamu no chokorēto desu ka.', vi: 'Ồ, sô-cô-la Việt Nam cơ à.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**これ、どうぞ** — đưa quà/đồ cho ai đó. Người Nhật hay bỏ は trong câu nói nhanh: これ、どうぞ.',
        '**コーヒーですか、おちゃですか** = "cà phê hay trà?" — câu hỏi LỰA CHỌN, trả lời bằng chính món đó (コーヒーです), **không** trả lời はい/いいえ.',
        '**ベトナムのコーヒー** — の chỉ **xuất xứ** (cà phê của Việt Nam = làm ở Việt Nam).',
        '**いいえ** ở cuối = "không có gì" khi được cảm ơn — một cách dùng khác của いいえ.',
        '**へえ** = "ồ, thế à" — tỏ ra ngạc nhiên, thú vị. Câu nhắc lại + ですか (ベトナムのチョコレートですか) cũng là cách tỏ ra mình đang nghe.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'これ、どうぞ。', ro: 'Kore, dōzo.', vi: 'Cái này, tặng bạn / mời bạn.' },
        { en: 'ベトナムのおみやげです。', ro: 'Betonamu no omiyage desu.', vi: 'Là quà Việt Nam.' },
        { en: 'これはコーヒーですか、おちゃですか。', ro: 'Kore wa kōhī desu ka, ocha desu ka.', vi: 'Cái này là cà phê hay trà?' },
        { en: 'コーヒーです。', ro: 'Kōhī desu.', vi: 'Là cà phê.' },
        { en: 'どうもありがとうございます。', ro: 'Dōmo arigatō gozaimasu.', vi: 'Cảm ơn rất nhiều.' },
        { en: 'いいえ。', ro: 'Iie.', vi: 'Không có gì.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp khi nói theo hội thoại',
      items: [
        'Cầm đồ trên tay mà nói ~~それは何ですか~~ → phải là **これは{何|なん}ですか** (đồ ở chỗ MÌNH là これ).',
        'Trả lời câu hỏi lựa chọn bằng ~~はい、コーヒーです~~ → chỉ cần **コーヒーです**.',
        'Đọc 何ですか là ~~なにですか~~ → trước です đọc **なん**ですか.',
        'Nói ~~わたしのかさのです~~ → hoặc **わたしのかさです**, hoặc gọn **わたしのです**, không ghép cả hai.',
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b2-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng: đồ vật quanh ta, hỏi "gì?", "của ai?"',
  goal: 'Nhớ 49 từ về đồ dùng học tập, đồ cá nhân, đồ trong phòng và các từ hỏi — đủ để gọi tên mọi thứ trên bàn học.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      items: [
        '6 nhóm từ: **chỉ định** (これ, この…), **đồ học tập**, **đồ cá nhân**, **đồ trong phòng & xe**, **ngôn ngữ & đồ ăn uống**, **hỏi – đáp**.',
        'Từ ngoại lai viết **katakana** (ノート, テレビ, パソコン…) — đọc gần tiếng Anh nhưng theo nhịp tiếng Nhật.',
        'Học trong câu: mỗi từ đều có câu ví dụ dùng mẫu của bài (これは N です, わたしの N…).',
        'Bấm **Che nghĩa / Che từ** để tự kiểm tra sau khi học xong mỗi nhóm.',
      ],
    },
    {
      t: 'p',
      text: 'Từ có chữ Hán thuộc N5 được viết bằng chữ Hán kèm furigana ({本|ほん}, {車|くるま}…). Từ có chữ Hán khó hơn N5 (じしょ, とけい, えき…) viết bằng hiragana — tới cấp sau sẽ học chữ Hán của chúng.',
    },

    { t: 'h', text: '1. Từ chỉ định — これ・それ・あれ, この・その・あの' },
    {
      t: 'vocab',
      items: [
        { w: 'これ', pos: 'đại từ chỉ định', ipa: 'kore', vi: 'cái này (gần người nói)', ex: 'これはわたしのかばんです。', exRo: 'Kore wa watashi no kaban desu.', exVi: 'Cái này là cặp của tôi.', more: 'これ đứng MỘT MÌNH, không có danh từ theo sau.' },
        { w: 'それ', pos: 'đại từ chỉ định', ipa: 'sore', vi: 'cái đó (gần người nghe)', ex: 'それは{何|なん}ですか。', exRo: 'Sore wa nan desu ka.', exVi: 'Cái đó là gì?', more: 'Cũng dùng để nói lại thứ người kia vừa nhắc tới.' },
        { w: 'あれ', pos: 'đại từ chỉ định', ipa: 'are', vi: 'cái kia (xa cả hai người)', ex: 'あれは{車|くるま}です。', exRo: 'Are wa kuruma desu.', exVi: 'Cái kia là ô tô.', more: '**あれ？** lên giọng còn là tiếng thốt "Ơ kìa?" khi ngạc nhiên.' },
        { w: 'どれ', pos: 'từ để hỏi', ipa: 'dore', vi: 'cái nào (trong 3 cái trở lên)', ex: 'ランさんのかさはどれですか。', exRo: 'Ran-san no kasa wa dore desu ka.', exVi: 'Ô của Lan là cái nào?', more: 'Bộ đủ: これ・それ・あれ・**どれ**.' },
        { w: 'この～', pos: 'từ chỉ định + danh từ', ipa: 'kono', vi: '… này', ex: 'この{本|ほん}はたなかさんのです。', exRo: 'Kono hon wa Tanaka-san no desu.', exVi: 'Quyển sách này là của Tanaka.', more: 'LUÔN có danh từ theo sau: ~~この です~~ là sai.' },
        { w: 'その～', pos: 'từ chỉ định + danh từ', ipa: 'sono', vi: '… đó', ex: 'そのボールペンはマイクさんのです。', exRo: 'Sono bōrupen wa Maiku-san no desu.', exVi: 'Cây bút bi đó là của Mike.' },
        { w: 'あの～', pos: 'từ chỉ định + danh từ', ipa: 'ano', vi: '… kia', ex: 'あの{車|くるま}は{日本|にほん}の{車|くるま}です。', exRo: 'Ano kuruma wa Nihon no kuruma desu.', exVi: 'Chiếc ô tô kia là xe Nhật.', more: 'Đừng nhầm với **あのう** (kéo dài) = "à… ờ…" dùng để mở lời.' },
      ],
    },

    { t: 'h', text: '2. Đồ dùng học tập' },
    {
      t: 'vocab',
      items: [
        { w: '{本|ほん}', pos: 'danh từ', ipa: 'hon', vi: 'sách', ex: 'これは{日本語|にほんご}の{本|ほん}です。', exRo: 'Kore wa nihongo no hon desu.', exVi: 'Đây là sách tiếng Nhật.', more: '本 Hán Việt **BẢN/BỔN**. Có trong {日本|にほん} (Nhật Bản).' },
        { w: 'じしょ', pos: 'danh từ', ipa: 'jisho', vi: 'từ điển', ex: 'それはだれのじしょですか。', exRo: 'Sore wa dare no jisho desu ka.', exVi: 'Đó là từ điển của ai?', more: 'Chữ Hán 辞書 (TỪ THƯ). Từ điển trên điện thoại cũng gọi là じしょ.' },
        { w: 'ざっし', pos: 'danh từ', ipa: 'zasshi', vi: 'tạp chí', ex: 'これは{車|くるま}のざっしです。', exRo: 'Kore wa kuruma no zasshi desu.', exVi: 'Đây là tạp chí ô tô.', more: 'Có っ: **za-s-shi**, ngắt một nhịp — không đọc "dasi".' },
        { w: '{新聞|しんぶん}', pos: 'danh từ', ipa: 'shinbun', vi: 'báo (giấy)', ex: 'あれは{日本|にほん}の{新聞|しんぶん}です。', exRo: 'Are wa Nihon no shinbun desu.', exVi: 'Kia là báo Nhật.', more: 'Hán Việt **TÂN VĂN** (tin mới nghe). Không có nghĩa là "tin tức nói chung".' },
        { w: 'ノート', pos: 'danh từ', ipa: 'nōto', vi: 'vở, sổ ghi', ex: 'このノートはキムさんのです。', exRo: 'Kono nōto wa Kimu-san no desu.', exVi: 'Quyển vở này là của Kim.', more: 'Từ tiếng Anh *notebook*. Máy tính xách tay gọi là ノートパソコン.' },
        { w: 'えんぴつ', pos: 'danh từ', ipa: 'enpitsu', vi: 'bút chì', ex: 'それはえんぴつですか。', exRo: 'Sore wa enpitsu desu ka.', exVi: 'Đó là bút chì à?' },
        { w: 'ボールペン', pos: 'danh từ', ipa: 'bōrupen', vi: 'bút bi', ex: 'これはわたしのボールペンです。', exRo: 'Kore wa watashi no bōrupen desu.', exVi: 'Đây là bút bi của tôi.', more: 'Ghép từ *ball* + *pen*. Trường âm ボー: kéo dài "bô-ô".' },
        { w: 'かばん', pos: 'danh từ', ipa: 'kaban', vi: 'cặp, túi xách', ex: 'あのかばんはやまだ{先生|せんせい}のです。', exRo: 'Ano kaban wa Yamada-sensei no desu.', exVi: 'Cái cặp kia là của cô Yamada.' },
      ],
    },

    { t: 'h', text: '3. Đồ cá nhân' },
    {
      t: 'vocab',
      items: [
        { w: 'かぎ', pos: 'danh từ', ipa: 'kagi', vi: 'chìa khoá', ex: 'このかぎはだれのですか。', exRo: 'Kono kagi wa dare no desu ka.', exVi: 'Chìa khoá này của ai?', more: 'Chìa khoá phòng: へやのかぎ; chìa khoá xe: {車|くるま}のかぎ.' },
        { w: 'とけい', pos: 'danh từ', ipa: 'tokei', vi: 'đồng hồ', ex: 'それはスイスのとけいですか。', exRo: 'Sore wa Suisu no tokei desu ka.', exVi: 'Đó là đồng hồ Thuỵ Sĩ à?', more: 'Cả đồng hồ đeo tay lẫn đồng hồ treo tường đều là とけい. Đọc **to-ke-i** (tokē).' },
        { w: 'かさ', pos: 'danh từ', ipa: 'kasa', vi: 'cái ô, dù', ex: 'わたしのかさはあれです。', exRo: 'Watashi no kasa wa are desu.', exVi: 'Ô của tôi là cái kia.' },
        { w: 'さいふ', pos: 'danh từ', ipa: 'saifu', vi: 'ví (đựng tiền)', ex: 'これはマイクさんのさいふですか。', exRo: 'Kore wa Maiku-san no saifu desu ka.', exVi: 'Đây có phải ví của Mike không?' },
        { w: 'めがね', pos: 'danh từ', ipa: 'megane', vi: 'kính (đeo mắt)', ex: 'そのめがねはたなかさんのです。', exRo: 'Sono megane wa Tanaka-san no desu.', exVi: 'Cái kính đó là của Tanaka.', more: 'Kính râm: サングラス.' },
        { w: 'スマホ', pos: 'danh từ', ipa: 'sumaho', vi: 'điện thoại thông minh', ex: 'これはわたしのスマホじゃありません。', exRo: 'Kore wa watashi no sumaho ja arimasen.', exVi: 'Đây không phải điện thoại của tôi.', more: 'Rút gọn của スマートフォン (*smartphone*). Người Nhật nói スマホ là chính.' },
        { w: '{電話|でんわ}', pos: 'danh từ', ipa: 'denwa', vi: 'điện thoại', ex: 'あれは{電話|でんわ}です。', exRo: 'Are wa denwa desu.', exVi: 'Kia là điện thoại.', more: 'Hán Việt **ĐIỆN THOẠI** — y như tiếng Việt! Số điện thoại: {電話|でんわ}ばんごう.' },
      ],
    },

    { t: 'h', text: '4. Đồ trong phòng & xe cộ' },
    {
      t: 'vocab',
      items: [
        { w: 'つくえ', pos: 'danh từ', ipa: 'tsukue', vi: 'bàn (học, làm việc)', ex: 'これはわたしのつくえです。', exRo: 'Kore wa watashi no tsukue desu.', exVi: 'Đây là bàn của tôi.', more: 'Bàn ăn thường gọi là テーブル.' },
        { w: 'いす', pos: 'danh từ', ipa: 'isu', vi: 'ghế', ex: 'そのいすはだれのですか。', exRo: 'Sono isu wa dare no desu ka.', exVi: 'Cái ghế đó của ai?' },
        { w: 'テレビ', pos: 'danh từ', ipa: 'terebi', vi: 'ti vi', ex: 'あれは{日本|にほん}のテレビです。', exRo: 'Are wa Nihon no terebi desu.', exVi: 'Kia là ti vi Nhật.' },
        { w: 'パソコン', pos: 'danh từ', ipa: 'pasokon', vi: 'máy tính cá nhân', ex: 'このパソコンはわたしのじゃありません。', exRo: 'Kono pasokon wa watashi no ja arimasen.', exVi: 'Máy tính này không phải của tôi.', more: 'Rút gọn của パーソナルコンピューター (*personal computer*).' },
        { w: '{電気|でんき}', pos: 'danh từ', ipa: 'denki', vi: 'đèn (điện); điện', ex: 'それは{電気|でんき}です。', exRo: 'Sore wa denki desu.', exVi: 'Đó là cái đèn.', more: 'Hán Việt **ĐIỆN KHÍ**. Trong nhà, 電気 thường chỉ cái đèn trần.' },
        { w: '{車|くるま}', pos: 'danh từ', ipa: 'kuruma', vi: 'ô tô, xe hơi', ex: 'あの{車|くるま}はだれのですか。', exRo: 'Ano kuruma wa dare no desu ka.', exVi: 'Chiếc ô tô kia của ai?', more: '車 Hán Việt **XA** (xe). Đọc riêng là くるま, trong từ ghép đọc しゃ: {電車|でんしゃ} (tàu điện).' },
        { w: 'じてんしゃ', pos: 'danh từ', ipa: 'jitensha', vi: 'xe đạp', ex: 'これはランさんのじてんしゃです。', exRo: 'Kore wa Ran-san no jitensha desu.', exVi: 'Đây là xe đạp của Lan.', more: 'Chữ Hán 自転車 (TỰ CHUYỂN XA — xe tự quay). Xe máy: バイク.' },
      ],
    },

    { t: 'h', text: '5. Ngôn ngữ, chủ đề & đồ ăn uống' },
    {
      t: 'vocab',
      items: [
        { w: '{日本語|にほんご}', pos: 'danh từ', ipa: 'nihongo', vi: 'tiếng Nhật', ex: 'これは{日本語|にほんご}の{新聞|しんぶん}です。', exRo: 'Kore wa nihongo no shinbun desu.', exVi: 'Đây là báo tiếng Nhật.', more: '語 Hán Việt **NGỮ**: tên nước + {語|ご} = tiếng nước đó.' },
        { w: 'ベトナム{語|ご}', pos: 'danh từ', ipa: 'betonamugo', vi: 'tiếng Việt', ex: 'それはベトナム{語|ご}のじしょですか。', exRo: 'Sore wa betonamugo no jisho desu ka.', exVi: 'Đó là từ điển tiếng Việt à?' },
        { w: 'えいご', pos: 'danh từ', ipa: 'eigo', vi: 'tiếng Anh', ex: 'あれはえいごのざっしです。', exRo: 'Are wa eigo no zasshi desu.', exVi: 'Kia là tạp chí tiếng Anh.', more: 'Chữ Hán 英語 (ANH NGỮ). Đọc **ē-go**, không phải "i-go".' },
        { w: 'コンピューター', pos: 'danh từ', ipa: 'konpyūtā', vi: 'máy tính (nói chung); tin học', ex: 'これはコンピューターの{本|ほん}です。', exRo: 'Kore wa konpyūtā no hon desu.', exVi: 'Đây là sách về máy tính.', more: 'コンピューターの{本|ほん} = sách VỀ máy tính (の chỉ nội dung).' },
        { w: 'コーヒー', pos: 'danh từ', ipa: 'kōhī', vi: 'cà phê', ex: 'これはベトナムのコーヒーです。', exRo: 'Kore wa Betonamu no kōhī desu.', exVi: 'Đây là cà phê Việt Nam.', more: 'Hai trường âm: **kō-hī**. Đọc ngắn "cô-hi" người Nhật khó nghe ra.' },
        { w: 'おちゃ', pos: 'danh từ', ipa: 'ocha', vi: 'trà (nhất là trà xanh)', ex: 'それはおちゃですか、コーヒーですか。', exRo: 'Sore wa ocha desu ka, kōhī desu ka.', exVi: 'Đó là trà hay cà phê?', more: 'お là tiếp đầu ngữ lịch sự; nói ちゃ trống không nghe cộc.' },
        { w: 'チョコレート', pos: 'danh từ', ipa: 'chokorēto', vi: 'sô-cô-la', ex: 'このチョコレートはベトナムのです。', exRo: 'Kono chokorēto wa Betonamu no desu.', exVi: 'Sô-cô-la này là của Việt Nam (làm ở Việt Nam).' },
        { w: 'おかし', pos: 'danh từ', ipa: 'okashi', vi: 'bánh kẹo', ex: 'これは{日本|にほん}のおかしです。', exRo: 'Kore wa Nihon no okashi desu.', exVi: 'Đây là bánh kẹo Nhật.' },
        { w: 'おみやげ', pos: 'danh từ', ipa: 'omiyage', vi: 'quà (mang về từ chuyến đi / quê nhà)', ex: 'これはベトナムのおみやげです。', exRo: 'Kore wa Betonamu no omiyage desu.', exVi: 'Đây là quà từ Việt Nam.', more: 'Văn hoá Nhật: đi xa về luôn mang おみやげ cho bạn bè, đồng nghiệp.' },
      ],
    },

    { t: 'h', text: '6. Hỏi – đáp và lời nói hằng ngày' },
    {
      t: 'vocab',
      items: [
        { w: '{何|なん}／{何|なに}', pos: 'từ để hỏi', ipa: 'nan / nani', vi: 'cái gì', ex: 'これは{何|なん}ですか。', exRo: 'Kore wa nan desu ka.', exVi: 'Cái này là gì?', more: 'Trước です, の, và từ đếm đọc **なん**; đứng riêng hoặc trước が/を đọc **なに**. Hán Việt **HÀ**.' },
        { w: 'だれ', pos: 'từ để hỏi', ipa: 'dare', vi: 'ai', ex: 'あの{人|ひと}はだれですか。', exRo: 'Ano hito wa dare desu ka.', exVi: 'Người kia là ai?', more: '**だれの** = của ai: だれのかさですか.' },
        { w: 'どなた', pos: 'từ để hỏi', ipa: 'donata', vi: 'vị nào, ai (lịch sự)', ex: 'このかばんはどなたのですか。', exRo: 'Kono kaban wa donata no desu ka.', exVi: 'Cái cặp này của vị nào ạ?', more: 'Dùng với người trên, khách hàng. Với bạn bè dùng だれ.' },
        { w: '{人|ひと}', pos: 'danh từ', ipa: 'hito', vi: 'người', ex: 'あの{人|ひと}はたなかさんです。', exRo: 'Ano hito wa Tanaka-san desu.', exVi: 'Người kia là anh Tanaka.', more: 'Lịch sự hơn: あの**かた** (vị kia).' },
        { w: '{友|とも}だち', pos: 'danh từ', ipa: 'tomodachi', vi: 'bạn bè', ex: 'これは{友|とも}だちのじてんしゃです。', exRo: 'Kore wa tomodachi no jitensha desu.', exVi: 'Đây là xe đạp của bạn tôi.', more: '友 Hán Việt **HỮU** (bằng hữu).' },
        { w: 'そうです', pos: 'cụm từ', ipa: 'sō desu', vi: 'đúng vậy', ex: 'はい、そうです。', exRo: 'Hai, sō desu.', exVi: 'Vâng, đúng vậy.', more: 'Chỉ dùng trả lời câu hỏi **N ですか** (có phải N không).' },
        { w: 'ちがいます', pos: 'cụm từ', ipa: 'chigaimasu', vi: 'không phải, sai rồi', ex: 'いいえ、ちがいます。', exRo: 'Iie, chigaimasu.', exVi: 'Không, không phải.', more: 'Nghĩa gốc: "khác". Nhẹ nhàng hơn: いいえ、N じゃありません.' },
        { w: 'そうですか', pos: 'cụm từ', ipa: 'sō desu ka', vi: 'ra vậy, thế à', ex: 'そうですか。わかりました。', exRo: 'Sō desu ka. Wakarimashita.', exVi: 'Ra vậy. Tôi hiểu rồi.', more: 'Đọc **xuống giọng** ở cuối: là lời đáp "à ra thế", không phải câu hỏi.' },
        { w: 'ええ', pos: 'thán từ', ipa: 'ē', vi: 'vâng, ừ', ex: 'ええ、{日本|にほん}の{車|くるま}です。', exRo: 'Ē, Nihon no kuruma desu.', exVi: 'Ừ, xe Nhật đấy.', more: 'Mềm hơn はい; với thầy cô, cấp trên vẫn nên dùng はい.' },
        { w: 'どうぞ', pos: 'phó từ', ipa: 'dōzo', vi: 'xin mời, của bạn đây', ex: 'これ、どうぞ。', exRo: 'Kore, dōzo.', exVi: 'Cái này, tặng bạn.', more: 'Đưa đồ, mời ngồi, mời vào, nhường đường đều dùng どうぞ.' },
        { w: 'どうもありがとうございます', pos: 'cụm từ', ipa: 'dōmo arigatō gozaimasu', vi: 'cảm ơn rất nhiều', ex: 'おみやげ、どうもありがとうございます。', exRo: 'Omiyage, dōmo arigatō gozaimasu.', exVi: 'Cảm ơn bạn nhiều vì món quà.', more: 'Ngắn dần: どうもありがとうございます > ありがとうございます > どうも.' },
      ],
    },

    {
      t: 'note',
      title: 'Người Việt hay nhầm khi học từ Bài 2',
      items: [
        '**この／その／あの** phải có danh từ đi sau; **これ／それ／あれ** thì không. ~~この は{本|ほん}です~~ → **これは{本|ほん}です** hoặc **この{本|ほん}は…**',
        '**{何|なん}** và **{何|なに}** là cùng một chữ — ở bài này (trước です) luôn đọc **なん**.',
        '**とけい**, **えいご** viết "ei" nhưng đọc kéo dài **ê** (tokē, ēgo).',
        'Từ katakana đọc **theo nhịp Nhật**: パソコン = pa-so-ko-n (4 nhịp), không đọc "pa-sô-côn" 3 tiếng.',
      ],
    },
    {
      t: 'mcq',
      id: 'b2-tv-nghia',
      title: 'Kiểm tra nghĩa từ — Bài 2',
      items: [
        { q: '**かさ** nghĩa là gì?', options: ['cái ô', 'cái cặp', 'chìa khoá', 'cái ghế'], correct: 0, why: 'かさ = cái ô (dù). Cặp = かばん, chìa khoá = かぎ, ghế = いす.' },
        { q: '**じしょ** nghĩa là gì?', options: ['tạp chí', 'từ điển', 'báo', 'vở'], correct: 1, why: 'じしょ (辞書) = từ điển. Tạp chí = ざっし, báo = 新聞, vở = ノート.' },
        { q: '"Đồng hồ" tiếng Nhật là gì?', options: ['とけい', 'てがみ', 'めがね', 'さいふ'], correct: 0, why: 'とけい = đồng hồ. めがね = kính, さいふ = ví.' },
        { q: '**{車|くるま}** là gì?', options: ['xe đạp', 'tàu điện', 'ô tô', 'xe máy'], correct: 2, why: '車 (くるま) = ô tô. Xe đạp = じてんしゃ, tàu điện = 電車 (でんしゃ), xe máy = バイク.' },
        { q: '"Ai" (lịch sự, dùng với khách, người trên) là từ nào?', options: ['だれ', 'どなた', 'どれ', 'なん'], correct: 1, why: 'どなた là cách lịch sự của だれ. どれ = cái nào; なん = cái gì.' },
        { q: '**おみやげ** là gì?', options: ['bánh kẹo', 'quà mang về từ chuyến đi / quê nhà', 'sô-cô-la', 'trà xanh'], correct: 1, why: 'おみやげ = quà đặc sản mang về cho người khác. Bánh kẹo = おかし.' },
        { q: '**ちがいます** dùng khi nào?', options: ['Khi cảm ơn', 'Khi muốn nói "không phải, sai rồi"', 'Khi đưa đồ cho ai', 'Khi hỏi "cái gì"'], correct: 1, why: 'ちがいます = không phải (nghĩa gốc: khác). Đưa đồ = どうぞ.' },
        { q: '"Tiếng Anh" là gì?', options: ['えいご', 'ベトナム語', 'にほんご', 'イギリス'], correct: 0, why: 'えいご (英語) = tiếng Anh. イギリス = nước Anh.' },
        { q: '**{電気|でんき}** trong nhà thường chỉ cái gì?', options: ['điện thoại', 'cái đèn', 'ti vi', 'máy tính'], correct: 1, why: '電気 = điện, và trong nhà thường là cái đèn. Điện thoại = 電話 (でんわ).' },
        { q: '"Cái nào" (trong nhiều cái) là từ nào?', options: ['どこ', 'どれ', 'どの', 'だれ'], correct: 1, why: 'どれ = cái nào (đứng một mình). どの phải đi với danh từ (どのかさ).' },
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b2-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp: これ・それ・あれ, この N, N の N, だれの',
  goal: 'Chọn đúng これ/それ/あれ theo vị trí, hỏi "cái gì?", trả lời đúng/không phải, hỏi lựa chọn, dùng この N và の chỉ chủ sở hữu, nội dung, xuất xứ.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      items: [
        '**7 điểm ngữ pháp**: ① これ・それ・あれ ② {何|なん}ですか ③ そうです／ちがいます ④ N1ですか、N2ですか ⑤ この・その・あの N ⑥ N1 の N2 và "N の" thay danh từ ⑦ だれの／どなたの.',
        'Bộ "ko-so-a-do" (こ・そ・あ・ど) là xương sống của tiếng Nhật: học bộ này một lần, Bài 3 dùng lại cho nơi chốn (ここ・そこ・あそこ・どこ).',
        'Mỗi điểm: công thức → giải thích → ví dụ → hỏi ↔ đáp → bảng thay thế → công thức 1 dòng → lỗi hay mắc.',
        'Ký hiệu: **N** = danh từ. Câu ví dụ chỉ dùng từ của Bài 1 và Bài 2.',
      ],
    },
    {
      t: 'p',
      text: 'Nhắc lại từ Bài 1: **N1 は N2 です** (N1 là N2), **N1 は N2 じゃありません** (N1 không phải là N2), thêm **か** cuối câu thành câu hỏi, **も** = "cũng". Bài này chỉ thay N1 bằng これ／それ／あれ và mở rộng danh từ bằng この và の.',
    },

    /* ── Điểm 1 ── */
    { t: 'h', text: '① これ・それ・あれ は N です — Cái này / cái đó / cái kia là N' },
    {
      t: 'p',
      text: 'Tiếng Việt chỉ có "này – đó – kia" và ta chọn khá tự do. Tiếng Nhật chọn theo **vị trí đồ vật so với HAI người đang nói chuyện**: gần người nói → **これ**; gần người nghe → **それ**; xa cả hai → **あれ**. Ba từ này là **đại từ** — tự chúng đã là "cái…", nên đứng một mình làm chủ đề câu với は.',
    },
    {
      t: 'table',
      caption: 'Chọn これ / それ / あれ theo chỗ đứng',
      head: ['Đồ vật ở đâu', 'Từ', 'Đọc', 'Nghĩa', 'Mẹo nhớ'],
      rows: [
        ['Trong tay / sát người NÓI', 'これ', 'kore', 'cái này', '**こ** = chỗ của tôi'],
        ['Trong tay / sát người NGHE', 'それ', 'sore', 'cái đó', '**そ** = chỗ của bạn'],
        ['Xa cả hai người', 'あれ', 'are', 'cái kia', '**あ** = ở đằng kia'],
        ['(hỏi) cái nào?', 'どれ', 'dore', 'cái nào', '**ど** = hỏi'],
      ],
    },
    {
      t: 'note',
      title: 'Khi hai người đứng CẠNH NHAU',
      items: [
        'Nếu hai người đứng sát nhau, nhìn cùng một hướng thì cả hai coi là "một phe": đồ gần hai người là **これ**, hơi xa là **それ**, rất xa là **あれ**.',
        'Ví dụ Lan và Tanaka đứng cạnh nhau ở sân trường: chiếc xe đạp ngay chân hai người là これ, chiếc xe đạp cách vài mét là それ, toà nhà bên kia đường là あれ.',
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'これ／それ／あれ は N です',
          vi: 'Cái này / đó / kia là N',
          examples: [
            { en: 'これは{本|ほん}です。', ro: 'Kore wa hon desu.', vi: 'Cái này là quyển sách.' },
            { en: 'それはかぎです。', ro: 'Sore wa kagi desu.', vi: 'Cái đó là chìa khoá.' },
            { en: 'あれはテレビです。', ro: 'Are wa terebi desu.', vi: 'Cái kia là ti vi.' },
            { en: 'これはわたしのかばんです。', ro: 'Kore wa watashi no kaban desu.', vi: 'Cái này là cặp của tôi.' },
            { en: 'それはベトナムのコーヒーです。', ro: 'Sore wa Betonamu no kōhī desu.', vi: 'Đó là cà phê Việt Nam.' },
          ],
        },
        {
          formula: 'これ／それ／あれ は N じゃありません',
          vi: 'Cái này / đó / kia không phải là N',
          examples: [
            { en: 'これはじしょじゃありません。', ro: 'Kore wa jisho ja arimasen.', vi: 'Cái này không phải từ điển.' },
            { en: 'それはボールペンじゃありません。えんぴつです。', ro: 'Sore wa bōrupen ja arimasen. Enpitsu desu.', vi: 'Cái đó không phải bút bi. Là bút chì.' },
            { en: 'あれは{車|くるま}じゃありません。', ro: 'Are wa kuruma ja arimasen.', vi: 'Cái kia không phải ô tô.' },
            { en: 'これはおちゃじゃありません。コーヒーです。', ro: 'Kore wa ocha ja arimasen. Kōhī desu.', vi: 'Cái này không phải trà. Là cà phê.' },
          ],
        },
        {
          formula: 'これ／それ／あれ は N ですか',
          vi: 'Cái này / đó / kia có phải là N không?',
          examples: [
            { en: 'それはざっしですか。', ro: 'Sore wa zasshi desu ka.', vi: 'Đó là tạp chí à?' },
            { en: 'あれは{新聞|しんぶん}ですか。', ro: 'Are wa shinbun desu ka.', vi: 'Kia là tờ báo à?' },
            { en: 'これもランさんのですか。', ro: 'Kore mo Ran-san no desu ka.', vi: 'Cái này cũng là của Lan à?' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: đồ vật ở tay người nghe',
      lines: [
        { who: 'ラン', role: 'a', text: 'それはボールペンですか。', ro: 'Sore wa bōrupen desu ka.', vi: 'Cái đó (anh đang cầm) là bút bi à?' },
        { who: 'たなか', role: 'b', text: 'はい、これはボールペンです。', ro: 'Hai, kore wa bōrupen desu.', vi: 'Ừ, cái này là bút bi.' },
        { who: 'ラン', role: 'a', text: 'じゃ、それもボールペンですか。', ro: 'Ja, sore mo bōrupen desu ka.', vi: 'Thế cái đó cũng là bút bi à?' },
        { who: 'たなか', role: 'b', text: 'いいえ、これはボールペンじゃありません。えんぴつです。', ro: 'Iie, kore wa bōrupen ja arimasen. Enpitsu desu.', vi: 'Không, cái này không phải bút bi. Là bút chì.' },
      ],
    },
    {
      t: 'note',
      title: 'Hỏi bằng それ thì trả lời bằng これ (và ngược lại)',
      items: [
        'Lan hỏi **それは**…? (đồ ở chỗ Tanaka) → Tanaka trả lời **これは**… (đồ ở chỗ mình).',
        'Lan hỏi **これは**…? (đồ ở chỗ Lan) → Tanaka trả lời **それは**…',
        'Hỏi **あれは**…? → trả lời vẫn là **あれは**… (vẫn xa cả hai).',
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: これは N です',
      head: ['Từ lắp vào', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['じしょ', 'これはじしょです。', 'Kore wa jisho desu.', 'Cái này là từ điển.'],
        ['{電話|でんわ}', 'これは{電話|でんわ}です。', 'Kore wa denwa desu.', 'Cái này là điện thoại.'],
        ['めがね', 'これはめがねです。', 'Kore wa megane desu.', 'Cái này là kính.'],
        ['さいふ', 'これはさいふです。', 'Kore wa saifu desu.', 'Cái này là ví.'],
        ['パソコン', 'これはパソコンです。', 'Kore wa pasokon desu.', 'Cái này là máy tính.'],
      ],
    },
    { t: 'rule', formula: 'これ／それ／あれ は N です（か）', vi: 'Gọi tên đồ vật theo vị trí: gần tôi – gần bạn – xa cả hai.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~これ{本|ほん}です~~ / ~~これの{本|ほん}~~ — これ không đứng ngay trước danh từ. Đúng: **これは{本|ほん}です**.',
        'Đồ ở tay người nghe mà nói ~~これ~~ — người Việt quen nói "cái này" cho mọi thứ trong tầm mắt. Nhìn xem đồ ở **phía ai**.',
        'Dùng これ／それ／あれ cho người: ~~あれはたなかさんです~~ nghe như gọi người ta là "cái kia" — bất lịch sự. Với người dùng **あの{人|ひと}** (điểm ⑤).',
      ],
    },

    /* ── Điểm 2 ── */
    { t: 'h', text: '② これは 何ですか — Cái này là gì?' },
    {
      t: 'p',
      text: 'Muốn hỏi tên một đồ vật, thay N bằng từ để hỏi **{何|なん}** (cái gì). Câu hỏi có từ để hỏi **giữ nguyên trật tự câu** — không đảo như tiếng Anh — và vẫn kết bằng **か**. Trả lời: thay {何|なん} bằng tên đồ vật, **không** bắt đầu bằng はい／いいえ.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'これ／それ／あれ は {何|なん} ですか',
          vi: 'Cái này / đó / kia là cái gì?',
          examples: [
            { en: 'これは{何|なん}ですか。——じしょです。', ro: 'Kore wa nan desu ka. — Jisho desu.', vi: 'Cái này là gì? — Là từ điển.' },
            { en: 'それは{何|なん}ですか。——これはかぎです。', ro: 'Sore wa nan desu ka. — Kore wa kagi desu.', vi: 'Cái đó là gì? — Cái này là chìa khoá.' },
            { en: 'あれは{何|なん}ですか。——あれは{電気|でんき}です。', ro: 'Are wa nan desu ka. — Are wa denki desu.', vi: 'Cái kia là gì? — Kia là cái đèn.' },
            { en: 'それは{何|なん}のざっしですか。——{車|くるま}のざっしです。', ro: 'Sore wa nan no zasshi desu ka. — Kuruma no zasshi desu.', vi: 'Đó là tạp chí gì (về cái gì)? — Tạp chí ô tô.' },
            { en: 'これは{何|なん}の{本|ほん}ですか。——コンピューターの{本|ほん}です。', ro: 'Kore wa nan no hon desu ka. — Konpyūtā no hon desu.', vi: 'Đây là sách gì? — Sách về máy tính.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'なん hay なに? (cùng chữ 何 — HÀ)',
      head: ['Đứng trước', 'Đọc', 'Ví dụ', 'Romaji'],
      rows: [
        ['です', 'なん', '{何|なん}ですか', 'nan desu ka'],
        ['の (hỏi "về cái gì")', 'なん', '{何|なん}の{本|ほん}ですか', 'nan no hon desu ka'],
        ['đứng một mình, hỏi lại', 'なに', '{何|なに}？', 'nani?'],
        ['が, を (học ở bài sau)', 'なに', '{何|なに}を…', 'nani o…'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: món đồ lạ',
      lines: [
        { who: 'マイク', role: 'b', text: 'ランさん、それは{何|なん}ですか。', ro: 'Ran-san, sore wa nan desu ka.', vi: 'Lan ơi, cái đó là gì vậy?' },
        { who: 'ラン', role: 'a', text: 'これですか。ベトナムのおかしです。', ro: 'Kore desu ka. Betonamu no okashi desu.', vi: 'Cái này á? Bánh kẹo Việt Nam đấy.' },
        { who: 'マイク', role: 'b', text: 'じゃ、あれは{何|なん}ですか。', ro: 'Ja, are wa nan desu ka.', vi: 'Thế cái kia là gì?' },
        { who: 'ラン', role: 'a', text: 'あれはベトナムのコーヒーです。', ro: 'Are wa Betonamu no kōhī desu.', vi: 'Kia là cà phê Việt Nam.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: それは 何ですか。—— これは N です。',
      head: ['Từ lắp vào', 'Câu trả lời', 'Romaji', 'Nghĩa'],
      rows: [
        ['かぎ', 'これはかぎです。', 'Kore wa kagi desu.', 'Cái này là chìa khoá.'],
        ['とけい', 'これはとけいです。', 'Kore wa tokei desu.', 'Cái này là đồng hồ.'],
        ['スマホ', 'これはスマホです。', 'Kore wa sumaho desu.', 'Cái này là điện thoại thông minh.'],
        ['おみやげ', 'これはおみやげです。', 'Kore wa omiyage desu.', 'Cái này là quà.'],
      ],
    },
    { t: 'rule', formula: '～は {何|なん} ですか → N です', vi: 'Hỏi "là cái gì": giữ nguyên câu, thay N bằng 何; trả lời thẳng tên đồ vật.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Đọc ~~なにですか~~ → **なんですか**.',
        'Trả lời câu có {何|なん} bằng ~~はい、じしょです~~ → bỏ はい: **じしょです**.',
        'Đảo từ để hỏi lên đầu như tiếng Anh: ~~{何|なん}はこれですか~~ → **これは{何|なん}ですか**.',
      ],
    },

    /* ── Điểm 3 ── */
    { t: 'h', text: '③ そうです／ちがいます — Đúng vậy / Không phải' },
    {
      t: 'p',
      text: 'Với câu hỏi có/không mà vị ngữ là **danh từ** (N ですか), tiếng Nhật có hai câu trả lời gọn: **はい、そうです** (vâng, đúng vậy) và **いいえ、ちがいます** (không, không phải). Cách đầy đủ vẫn dùng được: はい、N です／いいえ、N じゃありません. Thường nói thêm câu sau để đưa thông tin đúng.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N ですか → はい、そうです',
          vi: 'Khẳng định ngắn (chỉ dùng khi hỏi bằng danh từ + ですか)',
          examples: [
            { en: 'それはじしょですか。——はい、そうです。', ro: 'Sore wa jisho desu ka. — Hai, sō desu.', vi: 'Đó là từ điển à? — Vâng, đúng vậy.' },
            { en: 'あれはたなかさんの{車|くるま}ですか。——はい、そうです。', ro: 'Are wa Tanaka-san no kuruma desu ka. — Hai, sō desu.', vi: 'Kia là xe của Tanaka à? — Vâng, đúng vậy.' },
          ],
        },
        {
          formula: 'N ですか → いいえ、ちがいます',
          vi: 'Phủ định ngắn — thường nói tiếp câu đúng',
          examples: [
            { en: 'これはえいごの{本|ほん}ですか。——いいえ、ちがいます。{日本語|にほんご}の{本|ほん}です。', ro: 'Kore wa eigo no hon desu ka. — Iie, chigaimasu. Nihongo no hon desu.', vi: 'Đây là sách tiếng Anh à? — Không phải. Là sách tiếng Nhật.' },
            { en: 'それはマイクさんのかさですか。——いいえ、ちがいます。わたしのです。', ro: 'Sore wa Maiku-san no kasa desu ka. — Iie, chigaimasu. Watashi no desu.', vi: 'Đó là ô của Mike à? — Không phải. Của tôi.' },
            { en: 'あれは{電話|でんわ}ですか。——いいえ、ちがいます。テレビです。', ro: 'Are wa denwa desu ka. — Iie, chigaimasu. Terebi desu.', vi: 'Kia là điện thoại à? — Không phải. Là ti vi.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Ba cách trả lời câu "それは N ですか"',
      head: ['', 'Ngắn', 'Đầy đủ'],
      rows: [
        ['Có', 'はい、そうです。', 'はい、これは N です。'],
        ['Không', 'いいえ、ちがいます。', 'いいえ、これは N じゃありません。'],
        ['Không + sửa lại', 'いいえ、ちがいます。N2 です。', 'いいえ、N じゃありません。N2 です。'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: それは N ですか。—— いいえ、ちがいます。N2 です。',
      head: ['N (đoán sai)', 'N2 (đúng)', 'Câu trả lời', 'Nghĩa'],
      rows: [
        ['ノート', 'ざっし', 'いいえ、ちがいます。ざっしです。', 'Không phải. Là tạp chí.'],
        ['コーヒー', 'おちゃ', 'いいえ、ちがいます。おちゃです。', 'Không phải. Là trà.'],
        ['ボールペン', 'えんぴつ', 'いいえ、ちがいます。えんぴつです。', 'Không phải. Là bút chì.'],
        ['かばん', 'さいふ', 'いいえ、ちがいます。さいふです。', 'Không phải. Là cái ví.'],
      ],
    },
    { t: 'rule', formula: 'N ですか → はい、そうです ／ いいえ、ちがいます', vi: 'Trả lời nhanh câu hỏi "có phải là N không?".' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '**そうです／ちがいます** chỉ dùng cho câu hỏi về **danh từ**. Sau này gặp câu hỏi động từ, tính từ (Bài 5, Bài 8) thì không trả lời bằng そうです được.',
        'Trả lời ~~いいえ、そうじゃありません~~ là kiểu nói có thật nhưng nghe cứng; người mới học nên dùng **いいえ、ちがいます**.',
        '**そうですか** (xuống giọng) ≠ **そうです** — そうですか là "à ra thế", không phải câu trả lời "đúng".',
      ],
    },

    /* ── Điểm 4 ── */
    { t: 'h', text: '④ N1 ですか、N2 ですか — N1 hay N2?' },
    {
      t: 'p',
      text: 'Khi phân vân giữa hai khả năng, nói **hai câu hỏi liền nhau**: "…N1 ですか、N2 ですか". Tiếng Nhật không cần từ "hay" — chính hai lần ですか tạo ra nghĩa lựa chọn. Trả lời: nói thẳng **cái đúng** + です. **Không** dùng はい／いいえ.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '～は N1 ですか、N2 ですか',
          vi: '… là N1 hay N2?',
          examples: [
            { en: 'これはコーヒーですか、おちゃですか。——コーヒーです。', ro: 'Kore wa kōhī desu ka, ocha desu ka. — Kōhī desu.', vi: 'Đây là cà phê hay trà? — Là cà phê.' },
            { en: 'それはボールペンですか、えんぴつですか。——えんぴつです。', ro: 'Sore wa bōrupen desu ka, enpitsu desu ka. — Enpitsu desu.', vi: 'Đó là bút bi hay bút chì? — Bút chì.' },
            { en: 'あれは{日本|にほん}の{車|くるま}ですか、アメリカの{車|くるま}ですか。——{日本|にほん}の{車|くるま}です。', ro: 'Are wa Nihon no kuruma desu ka, Amerika no kuruma desu ka. — Nihon no kuruma desu.', vi: 'Kia là xe Nhật hay xe Mỹ? — Xe Nhật.' },
            { en: 'それは{日本語|にほんご}のじしょですか、えいごのじしょですか。——えいごのじしょです。', ro: 'Sore wa nihongo no jisho desu ka, eigo no jisho desu ka. — Eigo no jisho desu.', vi: 'Đó là từ điển tiếng Nhật hay tiếng Anh? — Từ điển tiếng Anh.' },
            { en: 'たなかさんは{学生|がくせい}ですか、{先生|せんせい}ですか。——{学生|がくせい}です。', ro: 'Tanaka-san wa gakusei desu ka, sensei desu ka. — Gakusei desu.', vi: 'Tanaka là sinh viên hay giáo viên? — Sinh viên.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: それは N1 ですか、N2 ですか。',
      head: ['N1', 'N2', 'Câu hỏi', 'Nghĩa'],
      rows: [
        ['ノート', 'ざっし', 'それはノートですか、ざっしですか。', 'Đó là vở hay tạp chí?'],
        ['かぎ', 'とけい', 'それはかぎですか、とけいですか。', 'Đó là chìa khoá hay đồng hồ?'],
        ['{新聞|しんぶん}', 'ざっし', 'それは{新聞|しんぶん}ですか、ざっしですか。', 'Đó là báo hay tạp chí?'],
        ['パソコン', 'テレビ', 'それはパソコンですか、テレビですか。', 'Đó là máy tính hay ti vi?'],
      ],
    },
    { t: 'rule', formula: 'N1 ですか、N2 ですか → N です', vi: 'Hỏi lựa chọn: lặp ですか hai lần; trả lời bằng chính cái đúng, không はい/いいえ.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Dịch từng chữ "hay" của tiếng Việt rồi bí vì không biết từ nào — tiếng Nhật không cần từ "hay": cứ **lặp lại ですか**. (Kiểu gọn コーヒーかおちゃ… sẽ học ở cấp sau.)',
        'Trả lời ~~はい、コーヒーです~~ → chỉ **コーヒーです**.',
        'Quên dấu phẩy khi viết: nên viết **ですか、** ở giữa để người đọc thấy rõ hai lựa chọn.',
      ],
    },

    /* ── Điểm 5 ── */
    { t: 'h', text: '⑤ この・その・あの + N — … này / … đó / … kia' },
    {
      t: 'p',
      text: '**この／その／あの** cũng chỉ vị trí như これ／それ／あれ, nhưng **luôn đứng ngay trước một danh từ** để nói rõ "cái N nào". Mẹo: đuôi **-re** (これ) đứng một mình, đuôi **-no** (この) phải "dắt" theo danh từ. Dùng **この／その／あの** cả cho người (あの{人|ひと} = người kia).',
    },
    {
      t: 'table',
      caption: 'Hai bộ chỉ định',
      head: ['Vị trí', 'Đứng một mình', 'Đi với danh từ', 'Ví dụ'],
      rows: [
        ['Gần người nói', 'これ', 'この N', 'この{本|ほん} — quyển sách này'],
        ['Gần người nghe', 'それ', 'その N', 'そのかさ — cái ô đó'],
        ['Xa cả hai', 'あれ', 'あの N', 'あの{車|くるま} — chiếc xe kia'],
        ['Hỏi', 'どれ', 'どの N', 'どのかさ — cái ô nào'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'この／その／あの N1 は N2 です',
          vi: 'N1 này / đó / kia là N2',
          examples: [
            { en: 'この{本|ほん}は{日本語|にほんご}の{本|ほん}です。', ro: 'Kono hon wa nihongo no hon desu.', vi: 'Quyển sách này là sách tiếng Nhật.' },
            { en: 'そのとけいはスイスのとけいです。', ro: 'Sono tokei wa Suisu no tokei desu.', vi: 'Cái đồng hồ đó là đồng hồ Thuỵ Sĩ.' },
            { en: 'あの{車|くるま}は{日本|にほん}の{車|くるま}です。', ro: 'Ano kuruma wa Nihon no kuruma desu.', vi: 'Chiếc ô tô kia là xe Nhật.' },
            { en: 'あの{人|ひと}はやまだ{先生|せんせい}です。', ro: 'Ano hito wa Yamada-sensei desu.', vi: 'Người kia là cô Yamada.' },
            { en: 'このいすはわたしのじゃありません。', ro: 'Kono isu wa watashi no ja arimasen.', vi: 'Cái ghế này không phải của tôi.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Khác nhau tinh tế: これ vs この N',
      head: ['Câu', 'Romaji', 'Nghĩa', 'Trả lời câu hỏi'],
      rows: [
        ['これはかさです。', 'Kore wa kasa desu.', 'Cái này là (một cái) ô.', '"Cái này là gì?"'],
        ['このかさはわたしのです。', 'Kono kasa wa watashi no desu.', 'Cái ô này là của tôi.', '"Cái ô này của ai?"'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: その N / この N',
      lines: [
        { who: 'たなか', role: 'b', text: 'そのかばんはランさんのですか。', ro: 'Sono kaban wa Ran-san no desu ka.', vi: 'Cái cặp đó là của Lan à?' },
        { who: 'ラン', role: 'a', text: 'はい、このかばんはわたしのです。', ro: 'Hai, kono kaban wa watashi no desu.', vi: 'Ừ, cái cặp này là của mình.' },
        { who: 'たなか', role: 'b', text: 'そのノートもランさんのですか。', ro: 'Sono nōto mo Ran-san no desu ka.', vi: 'Quyển vở đó cũng của Lan à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、このノートはわたしのじゃありません。マイクさんのです。', ro: 'Iie, kono nōto wa watashi no ja arimasen. Maiku-san no desu.', vi: 'Không, quyển vở này không phải của mình. Của Mike đấy.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: この N は わたしのです。',
      head: ['Từ lắp vào', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['かさ', 'このかさはわたしのです。', 'Kono kasa wa watashi no desu.', 'Cái ô này là của tôi.'],
        ['じてんしゃ', 'このじてんしゃはわたしのです。', 'Kono jitensha wa watashi no desu.', 'Chiếc xe đạp này là của tôi.'],
        ['めがね', 'このめがねはわたしのです。', 'Kono megane wa watashi no desu.', 'Cái kính này là của tôi.'],
        ['つくえ', 'このつくえはわたしのです。', 'Kono tsukue wa watashi no desu.', 'Cái bàn này là của tôi.'],
      ],
    },
    { t: 'rule', formula: 'この／その／あの + N', vi: 'Chỉ định đi kèm danh từ; これ/それ/あれ thì đứng một mình.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~このは{本|ほん}です~~ → **これは{本|ほん}です** (không có danh từ thì dùng これ).',
        '~~これ{本|ほん}は{日本語|にほんご}の{本|ほん}です~~ → **この{本|ほん}は**… (có danh từ thì dùng この).',
        'Hỏi ~~あれは だれですか~~ khi chỉ người → **あの{人|ひと}はだれですか** (lịch sự hơn: あのかたはどなたですか).',
      ],
    },

    /* ── Điểm 6 ── */
    { t: 'h', text: '⑥ N1 の N2 — của ai, về cái gì, ở đâu ra; và "N の" thay danh từ' },
    {
      t: 'p',
      text: 'Bài 1 đã có **わたしの{名前|なまえ}**, **{大学|だいがく}の{学生|がくせい}**. Trợ từ **の** nối hai danh từ, **N1 bổ nghĩa cho N2**. Chú ý thứ tự ngược tiếng Việt: tiếng Việt nói "sách **tiếng Nhật**", tiếng Nhật nói "**{日本語|にほんご}の**{本|ほん}" — **từ bổ nghĩa đứng TRƯỚC**. Ba nghĩa hay gặp:',
    },
    {
      t: 'table',
      caption: 'Ba nghĩa của の trong bài này',
      head: ['Nghĩa', 'N1 の N2', 'Romaji', 'Tiếng Việt'],
      rows: [
        ['Sở hữu — CỦA AI', 'わたしのかぎ', 'watashi no kagi', 'chìa khoá của tôi'],
        ['Sở hữu — CỦA AI', 'たなかさんの{車|くるま}', 'Tanaka-san no kuruma', 'xe của Tanaka'],
        ['Nội dung — VỀ CÁI GÌ / TIẾNG GÌ', '{日本語|にほんご}の{本|ほん}', 'nihongo no hon', 'sách tiếng Nhật'],
        ['Nội dung — VỀ CÁI GÌ', '{車|くるま}のざっし', 'kuruma no zasshi', 'tạp chí ô tô'],
        ['Xuất xứ — Ở ĐÂU RA', 'ベトナムのコーヒー', 'Betonamu no kōhī', 'cà phê Việt Nam'],
        ['Xuất xứ — Ở ĐÂU RA', '{日本|にほん}のとけい', 'Nihon no tokei', 'đồng hồ Nhật'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（người）の N2',
          vi: 'N2 của N1 — sở hữu',
          examples: [
            { en: 'これはランさんのじてんしゃです。', ro: 'Kore wa Ran-san no jitensha desu.', vi: 'Đây là xe đạp của Lan.' },
            { en: 'それはやまだ{先生|せんせい}のかばんです。', ro: 'Sore wa Yamada-sensei no kaban desu.', vi: 'Đó là cặp của cô Yamada.' },
            { en: 'あれは{友|とも}だちの{車|くるま}です。', ro: 'Are wa tomodachi no kuruma desu.', vi: 'Kia là xe của bạn tôi.' },
          ],
        },
        {
          formula: 'N1（chủ đề / thứ tiếng）の N2',
          vi: 'N2 về N1 / bằng tiếng N1 — nội dung',
          examples: [
            { en: 'これはコンピューターのざっしです。', ro: 'Kore wa konpyūtā no zasshi desu.', vi: 'Đây là tạp chí tin học.' },
            { en: 'それはベトナム{語|ご}の{新聞|しんぶん}ですか。', ro: 'Sore wa betonamugo no shinbun desu ka.', vi: 'Đó là báo tiếng Việt à?' },
            { en: 'わたしのじしょはえいごのじしょです。', ro: 'Watashi no jisho wa eigo no jisho desu.', vi: 'Từ điển của tôi là từ điển tiếng Anh.' },
          ],
        },
        {
          formula: 'N1（nước / nơi）の N2',
          vi: 'N2 của nước N1 — xuất xứ, nơi làm ra',
          examples: [
            { en: 'これは{日本|にほん}のおかしです。', ro: 'Kore wa Nihon no okashi desu.', vi: 'Đây là bánh kẹo Nhật.' },
            { en: 'そのチョコレートはベトナムのですか。', ro: 'Sono chokorēto wa Betonamu no desu ka.', vi: 'Sô-cô-la đó là của Việt Nam (làm ở VN) à?' },
          ],
        },
      ],
    },
    { t: 'h', text: '⑥b "N の" — bỏ danh từ đã biết: わたしのです' },
    {
      t: 'p',
      text: 'Khi hai người đều biết đang nói về món đồ nào, tiếng Nhật **bỏ N2** và để **の** đứng một mình — giống tiếng Việt "**của** tôi" thay cho "cái ô của tôi". わたしの = "cái của tôi", たなかさんの = "cái của Tanaka".',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '～は N の です',
          vi: '… là (cái) của N',
          examples: [
            { en: 'このかさはわたしのです。', ro: 'Kono kasa wa watashi no desu.', vi: 'Cái ô này là của tôi.' },
            { en: 'あのじてんしゃはたなかさんのです。', ro: 'Ano jitensha wa Tanaka-san no desu.', vi: 'Chiếc xe đạp kia là của Tanaka.' },
            { en: 'そのスマホはランさんのじゃありません。', ro: 'Sono sumaho wa Ran-san no ja arimasen.', vi: 'Cái điện thoại đó không phải của Lan.' },
            { en: 'わたしのはこれです。', ro: 'Watashi no wa kore desu.', vi: 'Cái của tôi là cái này.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: それは N のです。',
      head: ['Người lắp vào', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['わたし', 'それはわたしのです。', 'Sore wa watashi no desu.', 'Cái đó là của tôi.'],
        ['マイクさん', 'それはマイクさんのです。', 'Sore wa Maiku-san no desu.', 'Cái đó là của Mike.'],
        ['やまだ{先生|せんせい}', 'それはやまだ{先生|せんせい}のです。', 'Sore wa Yamada-sensei no desu.', 'Cái đó là của cô Yamada.'],
        ['{友|とも}だち', 'それは{友|とも}だちのです。', 'Sore wa tomodachi no desu.', 'Cái đó là của bạn tôi.'],
      ],
    },
    { t: 'rule', formula: 'N1 の N2 ／ N1 の（＝ N1 の N2）', vi: 'N1 đứng TRƯỚC bổ nghĩa cho N2: của ai, về cái gì, ở đâu ra; biết rồi thì bỏ N2.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Giữ trật tự tiếng Việt: ~~{本|ほん}の{日本語|にほんご}~~ (sách tiếng Nhật) → **{日本語|にほんご}の{本|ほん}**.',
        'Thừa の: ~~わたしのかさのです~~ → **わたしのかさです** hoặc **わたしのです**.',
        'Bỏ N2 khi N2 là **người**: ~~あの{人|ひと}は{会社|かいしゃ}のです~~ không được; phải nói đủ **{会社|かいしゃ}の{人|ひと}です**. "N の" chỉ thay cho **đồ vật**.',
        'Quên の giữa hai danh từ: ~~わたしかばん~~ → **わたしのかばん**.',
      ],
    },

    /* ── Điểm 7 ── */
    { t: 'h', text: '⑦ だれの N ですか／だれのですか — Của ai?' },
    {
      t: 'p',
      text: 'Thay người sở hữu bằng từ để hỏi **だれ** (ai) → **だれの** (của ai). Có hai cách hỏi: giữ danh từ (**だれのかさですか** — ô của ai?) hoặc đưa danh từ lên làm chủ đề (**このかさはだれのですか** — cái ô này của ai?). Với khách, thầy cô, người lạ: **どなたの**.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'これ／それ／あれ は だれの N ですか',
          vi: 'Cái này / đó / kia là N của ai?',
          examples: [
            { en: 'これはだれのかさですか。——たなかさんのです。', ro: 'Kore wa dare no kasa desu ka. — Tanaka-san no desu.', vi: 'Đây là ô của ai? — Của Tanaka.' },
            { en: 'それはだれのじしょですか。——マイクさんのじしょです。', ro: 'Sore wa dare no jisho desu ka. — Maiku-san no jisho desu.', vi: 'Đó là từ điển của ai? — Từ điển của Mike.' },
          ],
        },
        {
          formula: 'この／その／あの N は だれの ですか',
          vi: 'N này / đó / kia là của ai?',
          examples: [
            { en: 'このさいふはだれのですか。——わたしのです。', ro: 'Kono saifu wa dare no desu ka. — Watashi no desu.', vi: 'Cái ví này của ai? — Của tôi.' },
            { en: 'あの{車|くるま}はだれのですか。——やまだ{先生|せんせい}のです。', ro: 'Ano kuruma wa dare no desu ka. — Yamada-sensei no desu.', vi: 'Chiếc ô tô kia của ai? — Của cô Yamada.' },
            { en: 'そのかばんはどなたのですか。——わたしのです。', ro: 'Sono kaban wa donata no desu ka. — Watashi no desu.', vi: 'Cái cặp đó của vị nào ạ? — Của tôi.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: tìm chủ chiếc xe đạp',
      lines: [
        { who: 'ラン', role: 'a', text: 'たなかさん、あのじてんしゃはだれのですか。', ro: 'Tanaka-san, ano jitensha wa dare no desu ka.', vi: 'Anh Tanaka, chiếc xe đạp kia của ai thế?' },
        { who: 'たなか', role: 'b', text: 'あれですか。マイクさんのです。', ro: 'Are desu ka. Maiku-san no desu.', vi: 'Cái kia à? Của Mike đấy.' },
        { who: 'ラン', role: 'a', text: 'じゃ、あの{車|くるま}もマイクさんのですか。', ro: 'Ja, ano kuruma mo Maiku-san no desu ka.', vi: 'Thế chiếc ô tô kia cũng của Mike à?' },
        { who: 'たなか', role: 'b', text: 'いいえ、ちがいます。あれはやまだ{先生|せんせい}の{車|くるま}です。', ro: 'Iie, chigaimasu. Are wa Yamada-sensei no kuruma desu.', vi: 'Không phải. Kia là xe của cô Yamada.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: この N は だれのですか。—— N2 のです。',
      head: ['Đồ vật', 'Chủ', 'Hỏi ↔ đáp', 'Nghĩa'],
      rows: [
        ['かぎ', 'キムさん', 'このかぎはだれのですか。——キムさんのです。', 'Chìa khoá này của ai? — Của Kim.'],
        ['めがね', 'たなかさん', 'このめがねはだれのですか。——たなかさんのです。', 'Kính này của ai? — Của Tanaka.'],
        ['パソコン', '{先生|せんせい}', 'このパソコンはだれのですか。——{先生|せんせい}のです。', 'Máy tính này của ai? — Của cô giáo.'],
        ['ノート', 'わたし', 'このノートはだれのですか。——わたしのです。', 'Vở này của ai? — Của tôi.'],
      ],
    },
    { t: 'rule', formula: '～は だれの（N）ですか → N2 の（N）です', vi: 'Hỏi chủ sở hữu; lịch sự dùng どなたの.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Quên の: ~~このかさはだれですか~~ = "cái ô này là AI?" (vô lý) → **だれの**ですか.',
        'Hỏi khách hàng / người lớn tuổi bằng だれ nghe thiếu lịch sự → **どなたの**ですか.',
        'Trả lời ~~はい、わたしのです~~ cho câu だれの…? → bỏ はい: **わたしのです**.',
      ],
    },

    /* ── Luyện tổng hợp ── */
    { t: 'h', text: 'Luyện tổng hợp' },
    {
      t: 'build',
      id: 'b2-np-ghep',
      title: 'Ghép câu — Bài 2',
      items: [
        { vi: 'Cái này là từ điển tiếng Nhật.', chips: ['これは', '{日本語|にほんご}の', 'じしょです。', 'この'], answer: ['これは', '{日本語|にほんご}の', 'じしょです。'], ro: 'Kore wa nihongo no jisho desu.' },
        { vi: 'Cái đó là gì?', chips: ['それは', '{何|なん}', 'ですか。', 'だれ'], answer: ['それは', '{何|なん}', 'ですか。'], ro: 'Sore wa nan desu ka.' },
        { vi: 'Cái ô này là của tôi.', chips: ['この', 'かさは', 'わたしの', 'です。', 'これ'], answer: ['この', 'かさは', 'わたしの', 'です。'], ro: 'Kono kasa wa watashi no desu.' },
        { vi: 'Chiếc ô tô kia là xe Nhật.', chips: ['あの', '{車|くるま}は', '{日本|にほん}の', '{車|くるま}です。', 'あれ'], answer: ['あの', '{車|くるま}は', '{日本|にほん}の', '{車|くるま}です。'], ro: 'Ano kuruma wa Nihon no kuruma desu.' },
        { vi: 'Đây là cà phê hay trà?', chips: ['これは', 'コーヒーですか、', 'おちゃですか。', 'はい、'], answer: ['これは', 'コーヒーですか、', 'おちゃですか。'], ro: 'Kore wa kōhī desu ka, ocha desu ka.' },
        { vi: 'Cái cặp đó là của ai?', chips: ['その', 'かばんは', 'だれの', 'ですか。', 'だれ'], answer: ['その', 'かばんは', 'だれの', 'ですか。'], ro: 'Sono kaban wa dare no desu ka.' },
        { vi: 'Không, không phải. Là bút chì.', chips: ['いいえ、', 'ちがいます。', 'えんぴつです。', 'そうです。'], answer: ['いいえ、', 'ちがいます。', 'えんぴつです。'], ro: 'Iie, chigaimasu. Enpitsu desu.' },
        { vi: 'Đây là tạp chí về máy tính.', chips: ['これは', 'コンピューターの', 'ざっしです。', 'ざっしの'], answer: ['これは', 'コンピューターの', 'ざっしです。'], ro: 'Kore wa konpyūtā no zasshi desu.' },
        { vi: 'Người kia là cô Yamada.', chips: ['あの', '{人|ひと}は', 'やまだ{先生|せんせい}', 'です。', 'あれは'], answer: ['あの', '{人|ひと}は', 'やまだ{先生|せんせい}', 'です。'], ro: 'Ano hito wa Yamada-sensei desu.' },
        { vi: 'Cái của tôi là cái kia.', chips: ['わたしの', 'は', 'あれ', 'です。', 'あの'], answer: ['わたしの', 'は', 'あれ', 'です。'], ro: 'Watashi no wa are desu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b2-np-dien',
      title: 'Điền một từ còn thiếu (これ／この／の／何／だれ…)',
      kind: 'fill',
      items: [
        { q: '（Đồ trong tay mình）___は{本|ほん}です。', answers: ['これ'], hint: 'これ' },
        { q: '（Đồ trong tay mình）___{本|ほん}はわたしのです。', answers: ['この'] },
        { q: 'それは ___ ですか。——かぎです。', answers: ['何', 'なん', 'なに'] },
        { q: 'このかさは ___ のですか。——マイクさんのです。', answers: ['だれ', 'どなた', '誰'] },
        { q: 'これは{日本語|にほんご} ___ {本|ほん}です。', answers: ['の'] },
        { q: 'それはえいごのじしょですか。——いいえ、___。', answers: ['ちがいます', '違います'] },
        { q: 'あれはやまだ{先生|せんせい}の{車|くるま}ですか。——はい、___。', answers: ['そうです'] },
        { q: '（Đồ ở xa cả hai）___じてんしゃはだれのですか。', answers: ['あの'] },
        { q: 'このスマホはランさん ___ です。', answers: ['の'] },
        { q: 'これはコーヒーです ___、おちゃですか。', answers: ['か'] },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-np-chon',
      title: 'Chọn câu đúng',
      items: [
        { q: 'Tanaka đang cầm một quyển sách. Lan muốn hỏi nó là gì:', options: ['これは何ですか。', 'それは何ですか。', 'あれは何ですか。', 'どれは何ですか。'], correct: 1, why: 'Đồ ở tay người NGHE (Tanaka) → それ.' },
        { q: 'Chọn câu đúng ngữ pháp:', options: ['この は わたしの かさです。', 'これ かさは わたしのです。', 'この かさは わたしのです。', 'これの かさは わたしのです。'], correct: 2, why: 'この phải đi kèm danh từ: このかさは…' },
        { q: '"Sách tiếng Nhật" là:', options: ['本の日本語', '日本語の本', '日本語本', '本は日本語'], correct: 1, why: 'N1 bổ nghĩa đứng trước: 日本語の本.' },
        { q: 'それはコーヒーですか、おちゃですか。— Trả lời đúng là:', options: ['はい、コーヒーです。', 'いいえ、おちゃです。', 'コーヒーです。', 'そうです。'], correct: 2, why: 'Câu hỏi lựa chọn: trả lời thẳng món đúng, không はい/いいえ.' },
        { q: 'Hỏi lịch sự "Cái cặp này của vị nào ạ?":', options: ['このかばんはだれですか。', 'このかばんはどなたのですか。', 'このかばんはどれのですか。', 'このかばんは何のですか。'], correct: 1, why: 'Của ai (lịch sự) = どなたの. Thiếu の thì thành "là ai".' },
        { q: 'あれはたなかさんの{車|くるま}ですか。— Không phải. Trả lời:', options: ['いいえ、そうです。', 'いいえ、ちがいます。', 'はい、ちがいます。', 'いいえ、そうですか。'], correct: 1, why: 'Phủ định ngắn: いいえ、ちがいます.' },
        { q: 'Câu nào SAI?', options: ['わたしのはこれです。', 'このかさはわたしのです。', 'このかさはわたしのかさのです。', 'これはわたしのかさです。'], correct: 2, why: 'Thừa の: わたしのかさのです. Đúng: わたしのかさです hoặc わたしのです.' },
        { q: 'Chỉ một người đứng xa và hỏi "người kia là ai?":', options: ['あれはだれですか。', 'あの人はだれですか。', 'あの人は何ですか。', 'あれは何ですか。'], correct: 1, why: 'Với người dùng あの人 (không gọi người là あれ) và hỏi だれ.' },
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const KANJI: Lesson = {
  id: 'b2-kanji',
  kind: 'kanji',
  title: 'Chữ Hán: 何・本・車・電・話・語・友・気',
  goal: 'Đọc được 8 chữ Hán N5 của bài trong các từ 何, 本, 日本語, 車, 電話, 電気, 友だち; viết tay được 5 chữ ✍.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '8 chữ N5 gắn với đồ vật và câu hỏi của bài: **何** (gì) · **本** (sách) · **車** (xe) · **電** (điện) · **話** (nói) · **語** (tiếng) · **友** (bạn) · **気** (khí).',
        'Mỗi chữ có **âm On** (đọc kiểu Hán, dùng trong từ ghép: でん, ご, しゃ…) và **âm Kun** (đọc kiểu Nhật, đứng riêng: くるま, とも…).',
        '**Âm Hán Việt** là lợi thế lớn của người Việt: 電話 = ĐIỆN THOẠI, 電気 = ĐIỆN KHÍ — nghĩa gần như y hệt.',
        'Học chữ **theo từ**, không học âm rời: nhớ くるま = 車, でんわ = 電話.',
      ],
    },
    {
      t: 'table',
      caption: 'Chữ Hán Bài 2 (✍ = nên viết thuộc · 👁 = nhìn nhận ra là đủ)',
      head: ['Chữ', 'Hán Việt', 'On', 'Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['何', 'HÀ', 'カ', 'なに・なん', 'cái gì', '{何|なん}ですか · {何|なに}？', '✍'],
        ['本', 'BẢN (BỔN)', 'ホン', 'もと', 'sách; gốc', '{本|ほん} · {日本|にほん} · {日本語|にほんご}', '✍'],
        ['車', 'XA', 'シャ', 'くるま', 'xe', '{車|くるま} · {電車|でんしゃ} (tàu điện)', '✍'],
        ['電', 'ĐIỆN', 'デン', '—', 'điện', '{電話|でんわ} · {電気|でんき} · {電車|でんしゃ}', '👁'],
        ['話', 'THOẠI', 'ワ', 'はなし・はな(す)', 'nói, câu chuyện', '{電話|でんわ} · {話|はなし} (câu chuyện)', '👁'],
        ['語', 'NGỮ', 'ゴ', 'かた(る)', 'lời, tiếng', '{日本語|にほんご} · ベトナム{語|ご}', '✍'],
        ['友', 'HỮU', 'ユウ', 'とも', 'bạn', '{友|とも}だち', '✍'],
        ['気', 'KHÍ', 'キ・ケ', '—', 'khí; tinh thần', '{電気|でんき} · {天気|てんき} (thời tiết)', '👁'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ mặt chữ',
      items: [
        '**本**: chữ 木 (cây) thêm một gạch ngang ở **gốc** → "gốc cây" → gốc, nguồn gốc; sau thành "sách". 日本 = gốc của mặt trời = Nhật Bản.',
        '**車**: nhìn từ trên xuống là chiếc xe kéo — hai bánh (hai gạch ngang trên dưới) và trục xe (gạch dọc ở giữa).',
        '**語**: bộ 言 (lời nói) bên trái + 吾 (ta) → "lời của ta" = ngôn ngữ. **話** cũng có bộ 言 → liên quan tới nói.',
        '**電**: bộ 雨 (mưa) ở trên → tia chớp trong cơn mưa = điện.',
        '**友**: hai bàn tay nắm lấy nhau → bạn bè.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc nhầm hay gặp',
      items: [
        '**何ですか** đọc ~~なにですか~~ → **なんですか**.',
        '**車** đứng một mình đọc ~~しゃ~~ → **くるま**; しゃ chỉ dùng trong từ ghép (電車 でんしゃ).',
        '**日本語** đọc ~~にっぽんご~~ — người Nhật nói **にほんご**. (にっぽん chỉ gặp trong vài tên chính thức.)',
        '**電話** là でん**わ** — わ của 話, không phải ~~でんは~~.',
      ],
    },
    {
      t: 'readkanji',
      id: 'b2-kj-doc',
      title: 'Đọc to — câu có chữ Hán Bài 2',
      note: 'Che phần đọc, tự đọc cả câu, rồi bấm hiện để so. Chỗ dễ vấp: 何 (なん), 電話 (でんわ), 友だち (ともだち).',
      items: [
        { text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: 'Cái này là gì?' },
        { text: 'それは{本|ほん}です。', ro: 'Sore wa hon desu.', vi: 'Đó là quyển sách.' },
        { text: '{日本語|にほんご}の{本|ほん}です。', ro: 'Nihongo no hon desu.', vi: 'Là sách tiếng Nhật.' },
        { text: 'あの{車|くるま}は{日本|にほん}の{車|くるま}です。', ro: 'Ano kuruma wa Nihon no kuruma desu.', vi: 'Chiếc xe kia là xe Nhật.' },
        { text: 'これは{電話|でんわ}です。', ro: 'Kore wa denwa desu.', vi: 'Đây là điện thoại.' },
        { text: 'あれは{電気|でんき}です。', ro: 'Are wa denki desu.', vi: 'Kia là cái đèn.' },
        { text: '{友|とも}だちの{車|くるま}です。', ro: 'Tomodachi no kuruma desu.', vi: 'Là xe của bạn tôi.' },
        { text: 'ベトナム{語|ご}のじしょですか。', ro: 'Betonamugo no jisho desu ka.', vi: 'Là từ điển tiếng Việt à?' },
        { text: 'これは{何|なん}の{本|ほん}ですか。', ro: 'Kore wa nan no hon desu ka.', vi: 'Đây là sách gì?' },
        { text: '{電車|でんしゃ}の{本|ほん}です。', ro: 'Densha no hon desu.', vi: 'Là sách về tàu điện.' },
        { text: 'その{電話|でんわ}は{友|とも}だちのです。', ro: 'Sono denwa wa tomodachi no desu.', vi: 'Cái điện thoại đó là của bạn tôi.' },
        { text: '{日本|にほん}の{電気|でんき}の{本|ほん}です。', ro: 'Nihon no denki no hon desu.', vi: 'Là sách về điện của Nhật.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-kj-chon',
      title: 'Chọn cách đọc đúng',
      items: [
        { q: '**電話**', options: ['でんわ', 'でんは', 'てんわ', 'でんき'], correct: 0, why: '電 = でん, 話 = わ → でんわ (điện thoại).' },
        { q: '**車**（đứng một mình）', options: ['しゃ', 'くるま', 'くろま', 'じゃ'], correct: 1, why: 'Đứng riêng đọc âm Kun: くるま. しゃ là âm On trong từ ghép.' },
        { q: '**日本語**', options: ['にっぽんご', 'にほんご', 'にほんこ', 'ひほんご'], correct: 1, why: 'にほんご — tiếng Nhật.' },
        { q: '**友だち**', options: ['ともだち', 'ゆうだち', 'どもだち', 'ともたち'], correct: 0, why: '友 đọc Kun とも → ともだち.' },
        { q: '**何ですか**', options: ['なにですか', 'なんですか', 'かですか', 'なですか'], correct: 1, why: 'Trước です đọc なん.' },
        { q: '**電気**', options: ['でんき', 'でんけ', 'てんき', 'でんぎ'], correct: 0, why: '電 でん + 気 き → でんき. てんき (天気) là thời tiết.' },
        { q: '**電車**', options: ['でんくるま', 'でんしゃ', 'でんじゃ', 'てんしゃ'], correct: 1, why: 'Trong từ ghép, 車 đọc On しゃ → でんしゃ (tàu điện).' },
        { q: 'Chữ nào nghĩa là "sách"?', options: ['本', '車', '語', '友'], correct: 0, why: '本 (ほん) = sách. 車 = xe, 語 = tiếng, 友 = bạn.' },
      ],
    },
    {
      t: 'write',
      id: 'b2-kj-viet',
      title: 'Tập viết chữ Hán Bài 2',
      note: '5 chữ đầu là ✍ — viết thuộc. 3 chữ sau (電・話・気) là 👁: viết vài lượt cho nhớ mặt. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['何', '本', '車', '語', '友', '電', '話', '気'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b2-nghe',
  kind: 'listening',
  title: 'Nghe: đồ vật này là gì, của ai?',
  goal: 'Nghe hội thoại ngắn kiểu đề JLPT N5 và bắt được: đồ vật là gì, của ai, của nước nào; chọn câu nói phù hợp tình huống.',
  minutes: 25,
  blocks: [
    {
      t: 'recap',
      items: [
        '4 bài nghe theo dạng đề **JLPT N5 聴解**: ポイント理解 (nghe ý chính), 発話表現 (chọn câu nói hợp tình huống), 即時応答 (đáp ngay).',
        'Từ khoá cần bắt: **これ／それ／あれ**, **だれの**, **N の N**, **そうです／ちがいます**.',
        'Cách làm: đọc câu hỏi trước → nghe cả bài một lần (không xem lời) → trả lời → mở lời thoại nghe lại câu sai.',
      ],
    },
    {
      t: 'listen',
      id: 'b2-nghe-1',
      title: 'Bài nghe 1 — Cái ô của ai? (ポイント理解)',
      note: 'Dạng ポイント理解: đọc câu hỏi trước, nghe để tìm đúng một thông tin. Bẫy: câu "ちがいます" ở giữa bài.',
      lines: [
        { who: 'やまだ先生', voice: 'ja-nu', text: 'マイクさん、このかさはマイクさんのですか。', ro: 'Maiku-san, kono kasa wa Maiku-san no desu ka.', vi: 'Mike, cái ô này là của em à?' },
        { who: 'マイク', voice: 'ja-nam', text: 'いいえ、ちがいます。わたしのかさはあれです。', ro: 'Iie, chigaimasu. Watashi no kasa wa are desu.', vi: 'Dạ không. Ô của em là cái kia.' },
        { who: 'やまだ先生', voice: 'ja-nu', text: 'そうですか。じゃ、だれのですか。', ro: 'Sō desu ka. Ja, dare no desu ka.', vi: 'Vậy à. Thế của ai nhỉ?' },
        { who: 'マイク', voice: 'ja-nam', text: 'たぶん、キムさんのです。', ro: 'Tabun, Kimu-san no desu.', vi: 'Chắc là của Kim ạ.' },
        { who: 'キム', voice: 'ja-nu', text: 'はい、それはわたしのです。ありがとうございます。', ro: 'Hai, sore wa watashi no desu. Arigatō gozaimasu.', vi: 'Vâng, cái đó là của em. Em cảm ơn ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-1-cau',
      title: 'Câu hỏi bài nghe 1',
      items: [
        { q: 'Cái ô cô giáo cầm là của ai?', options: ['Của Mike', 'Của Kim', 'Của cô giáo', 'Của Lan'], correct: 1, why: 'Kim nói: それはわたしのです (cái đó là của em).' },
        { q: 'Ô của Mike ở đâu?', options: ['Trong tay cô giáo', 'Ở đằng kia (あれ)', 'Trong cặp của Kim', 'Mike không có ô'], correct: 1, why: 'Mike: わたしのかさはあれです — ô của em là cái kia.' },
        { q: 'Mike trả lời câu "このかさはマイクさんのですか" thế nào?', options: ['はい、そうです。', 'いいえ、ちがいます。', 'たぶん。', 'そうですか。'], correct: 1, why: 'Mike nói いいえ、ちがいます — không phải.' },
      ],
    },
    {
      t: 'listen',
      id: 'b2-nghe-2',
      title: 'Bài nghe 2 — Ở cửa hàng đồ cũ (ポイント理解)',
      note: 'Dạng ポイント理解: nghe để biết món đồ là gì và của nước nào. Để ý câu hỏi lựa chọn "…ですか、…ですか".',
      lines: [
        { who: 'ラン', voice: 'ja-nu', text: 'すみません、それは{何|なん}ですか。', ro: 'Sumimasen, sore wa nan desu ka.', vi: 'Xin lỗi, cái đó là gì ạ?' },
        { who: 'みせの{人|ひと}', voice: 'ja-nam', text: 'これですか。とけいです。', ro: 'Kore desu ka. Tokei desu.', vi: 'Cái này ạ? Là đồng hồ.' },
        { who: 'ラン', voice: 'ja-nu', text: '{日本|にほん}のとけいですか、スイスのとけいですか。', ro: 'Nihon no tokei desu ka, Suisu no tokei desu ka.', vi: 'Đồng hồ Nhật hay đồng hồ Thuỵ Sĩ ạ?' },
        { who: 'みせの{人|ひと}', voice: 'ja-nam', text: '{日本|にほん}のです。', ro: 'Nihon no desu.', vi: 'Của Nhật ạ.' },
        { who: 'ラン', voice: 'ja-nu', text: 'じゃ、あれも{日本|にほん}のですか。', ro: 'Ja, are mo Nihon no desu ka.', vi: 'Thế cái kia cũng của Nhật ạ?' },
        { who: 'みせの{人|ひと}', voice: 'ja-nam', text: 'いいえ、あれはドイツのです。', ro: 'Iie, are wa Doitsu no desu.', vi: 'Không, cái kia là của Đức.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-2-cau',
      title: 'Câu hỏi bài nghe 2',
      items: [
        { q: 'Món đồ trong tay người bán là gì?', options: ['Cái máy ảnh', 'Cái đồng hồ', 'Cái điện thoại', 'Cái cặp'], correct: 1, why: 'Người bán: これですか。とけいです。' },
        { q: 'Món đồ đó của nước nào?', options: ['Nhật', 'Thuỵ Sĩ', 'Đức', 'Mỹ'], correct: 0, why: '日本のです — của Nhật.' },
        { q: 'Món đồ ở đằng kia (あれ) của nước nào?', options: ['Nhật', 'Thuỵ Sĩ', 'Đức', 'Không rõ'], correct: 2, why: 'あれはドイツのです — của Đức.' },
        { q: 'Vì sao người bán nói これ còn Lan nói それ?', options: ['Vì đồ ở xa cả hai', 'Vì đồ ở trong tay người bán', 'Vì đồ ở trong tay Lan', 'Vì Lan nói sai'], correct: 1, why: 'Đồ ở tay người bán: với người bán là これ, với Lan (người nghe) là それ.' },
      ],
    },
    {
      t: 'listen',
      id: 'b2-nghe-3',
      title: 'Bài nghe 3 — Câu nào hợp tình huống? (発話表現)',
      note: 'Dạng 発話表現: nghe mô tả tình huống, chọn câu nói hợp nhất. Người dẫn đọc tình huống, sau đó là 3 lựa chọn 1, 2, 3.',
      lines: [
        { who: 'Người dẫn', voice: 'ja-nam', text: 'ともだちのつくえに{本|ほん}があります。{何|なん}の{本|ほん}か、ききたいです。{何|なん}といいますか。', ro: 'Tomodachi no tsukue ni hon ga arimasu. Nan no hon ka, kikitai desu. Nan to iimasu ka.', vi: 'Trên bàn của bạn có một quyển sách. Bạn muốn hỏi đó là sách gì. Bạn nói gì?' },
        { who: 'Người dẫn', voice: 'ja-nam', text: 'いち、それは{何|なん}の{本|ほん}ですか。', ro: 'Ichi, sore wa nan no hon desu ka.', vi: '1. Đó là sách gì vậy?' },
        { who: 'Người dẫn', voice: 'ja-nam', text: 'に、これはだれの{本|ほん}ですか。', ro: 'Ni, kore wa dare no hon desu ka.', vi: '2. Đây là sách của ai?' },
        { who: 'Người dẫn', voice: 'ja-nam', text: 'さん、あれは{本|ほん}ですか。', ro: 'San, are wa hon desu ka.', vi: '3. Kia là sách à?' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-3-cau',
      title: 'Câu hỏi bài nghe 3',
      items: [
        { q: 'Câu nào hợp nhất?', options: ['1', '2', '3'], correct: 0, why: 'Muốn biết sách VỀ cái gì, và sách ở chỗ người bạn (người nghe) → それは何の本ですか.' },
        { q: 'Vì sao lựa chọn 2 sai?', options: ['Vì hỏi "của ai" chứ không hỏi "sách gì", và dùng これ', 'Vì sai ngữ pháp', 'Vì quá lịch sự', 'Vì thiếu か'], correct: 0, why: 'Câu 2 hỏi chủ sở hữu (だれの) và gọi đồ ở chỗ bạn là これ.' },
        { q: '"何の本" nghĩa là gì?', options: ['Sách của ai', 'Sách về cái gì', 'Sách ở đâu', 'Bao nhiêu sách'], correct: 1, why: '何の + N = N về cái gì / N loại gì.' },
      ],
    },
    {
      t: 'listen',
      id: 'b2-nghe-4',
      title: 'Bài nghe 4 — Đáp ngay (即時応答)',
      note: 'Dạng 即時応答: nghe một câu ngắn, chọn câu đáp lại tự nhiên nhất. Có 3 câu hỏi nhỏ, mỗi câu 3 lựa chọn.',
      lines: [
        { who: 'Câu 1', voice: 'ja-nam', text: 'これ、ランさんのかさですか。', ro: 'Kore, Ran-san no kasa desu ka.', vi: 'Cái này là ô của Lan à?' },
        { who: 'Câu 2', voice: 'ja-nu', text: 'それはコーヒーですか、おちゃですか。', ro: 'Sore wa kōhī desu ka, ocha desu ka.', vi: 'Đó là cà phê hay trà?' },
        { who: 'Câu 3', voice: 'ja-nam', text: 'これ、ベトナムのおみやげです。どうぞ。', ro: 'Kore, Betonamu no omiyage desu. Dōzo.', vi: 'Cái này là quà Việt Nam. Tặng bạn.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-4-cau',
      title: 'Câu hỏi bài nghe 4 — chọn câu đáp',
      items: [
        { q: 'Câu 1: これ、ランさんのかさですか。', options: ['はい、そうです。わたしのです。', 'はい、ランさんです。', 'いいえ、かさです。'], correct: 0, why: 'Hỏi "có phải ô của Lan không" → はい、そうです。わたしのです.' },
        { q: 'Câu 2: それはコーヒーですか、おちゃですか。', options: ['はい、コーヒーです。', 'おちゃです。', 'いいえ、ちがいます。'], correct: 1, why: 'Câu hỏi lựa chọn: trả lời thẳng món đúng, không はい/いいえ.' },
        { q: 'Câu 3: これ、ベトナムのおみやげです。どうぞ。', options: ['どういたしまして。', 'ありがとうございます。', 'そうですか。'], correct: 1, why: 'Được tặng quà → ありがとうございます.' },
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b2-noi',
  kind: 'speaking',
  title: 'Nói: chỉ đồ vật, hỏi và nói "của ai"',
  goal: 'Đọc trôi chảy 10 câu mẫu của bài, rồi tự trả lời câu hỏi về đồ vật của mình bằng これ/この/の.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Luyện phát âm** 10 câu từ ngắn tới dài — đây cũng là danh sách câu khi bạn 📞 gọi **CuongMini** trong bài này.',
        'Nghe hội thoại mẫu "giám khảo ↔ thí sinh" về đồ vật trên bàn.',
        'Tự ghi âm trả lời 5 câu hỏi về đồ của bạn — dùng **これ／この N／わたしの**.',
      ],
    },
    {
      t: 'phatam',
      id: 'b2-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 10 câu Bài 2',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ đủ trường âm: **sō**, **dōzo**, **kōhī**; âm ngắt trong **zasshi**; ん trong **nan**, **hon** đọc trọn một nhịp.',
      items: [
        { text: 'これは{何|なん}ですか。', ipa: 'kore wa nan desu ka', vi: 'Cái này là gì?' },
        { text: 'それはじしょです。', ipa: 'sore wa jisho desu', vi: 'Đó là từ điển.' },
        { text: 'はい、そうです。', ipa: 'hai sō desu', vi: 'Vâng, đúng vậy.' },
        { text: 'いいえ、ちがいます。', ipa: 'iie chigaimasu', vi: 'Không, không phải.' },
        { text: 'これ、どうぞ。', ipa: 'kore dōzo', vi: 'Cái này, tặng bạn.' },
        { text: 'このかさはだれのですか。', ipa: 'kono kasa wa dare no desu ka', vi: 'Cái ô này của ai?' },
        { text: 'それはわたしのです。', ipa: 'sore wa watashi no desu', vi: 'Cái đó là của tôi.' },
        { text: 'あれは{車|くるま}のざっしです。', ipa: 'are wa kuruma no zasshi desu', vi: 'Kia là tạp chí ô tô.' },
        { text: 'これはコーヒーですか、おちゃですか。', ipa: 'kore wa kōhī desu ka ocha desu ka', vi: 'Đây là cà phê hay trà?' },
        { text: 'この{本|ほん}は{日本語|にほんご}の{本|ほん}です。', ipa: 'kono hon wa nihongo no hon desu', vi: 'Quyển sách này là sách tiếng Nhật.' },
      ],
    },
    {
      t: 'note',
      title: 'Ngữ điệu người Việt hay sai',
      items: [
        'Câu hỏi **…ですか** lên giọng nhẹ ở **か**; còn **そうですか** (à ra thế) thì **xuống giọng** — đọc lên giọng nghe như đang nghi ngờ.',
        '**ちがいます**: chi-ga-i-ma-su, âm **su** cuối gần như câm (nghe như "chigaimas").',
        'Đừng nhấn mạnh từng chữ như thanh sắc/nặng tiếng Việt — giữ các nhịp dài bằng nhau.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Mẫu: giám khảo hỏi về đồ vật trên bàn',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: '(Chỉ vào món đồ trước mặt thí sinh) Đây là gì?' },
        { who: 'Thí sinh', role: 'candidate', text: 'それはわたしのスマホです。', ro: 'Sore wa watashi no sumaho desu.', vi: 'Đó là điện thoại của em ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'そうですか。じゃ、それは{何|なん}ですか。', ro: 'Sō desu ka. Ja, sore wa nan desu ka.', vi: 'Vậy à. Thế cái đó (chỗ em) là gì?' },
        { who: 'Thí sinh', role: 'candidate', text: 'これはじしょです。ベトナム{語|ご}のじしょです。', ro: 'Kore wa jisho desu. Betonamugo no jisho desu.', vi: 'Đây là từ điển. Từ điển tiếng Việt ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'そのボールペンもあなたのですか。', ro: 'Sono bōrupen mo anata no desu ka.', vi: 'Cây bút bi đó cũng của em à?' },
        { who: 'Thí sinh', role: 'candidate', text: 'いいえ、ちがいます。これは{友|とも}だちのです。', ro: 'Iie, chigaimasu. Kore wa tomodachi no desu.', vi: 'Dạ không. Cái này là của bạn em ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'あなたのかばんは{日本|にほん}のですか、ベトナムのですか。', ro: 'Anata no kaban wa Nihon no desu ka, Betonamu no desu ka.', vi: 'Cặp của em là hàng Nhật hay hàng Việt Nam?' },
        { who: 'Thí sinh', role: 'candidate', text: 'ベトナムのです。', ro: 'Betonamu no desu.', vi: 'Hàng Việt Nam ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bí quyết trả lời',
      items: [
        'Giám khảo nói **これ** (đồ ở phía giám khảo chỉ) nhưng món đồ ở **trước mặt bạn** → bạn đáp **それは…** hoặc **これは…** tuỳ đồ đang ở tay ai. Đơn giản nhất: **cầm món đồ lên** rồi nói これは….',
        'Trả lời đủ câu (これは N です), đừng chỉ nói một từ — giám khảo chấm cả ngữ pháp.',
        'Không biết tên đồ vật? Nói: **すみません、わかりません** (xin lỗi, em không biết).',
      ],
    },
    {
      t: 'speak',
      id: 'b2-noi-ghi-am',
      part: '1',
      questions: [
        'それは なんですか。',
        'その かばんは あなたのですか。',
        'あなたの スマホは にほんの スマホですか。',
        'それは なんの ほんですか。',
        'あなたの じしょは なんの じしょですか。',
      ],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b2-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 2 — dịch, trợ từ, ghép câu, đọc hiểu',
  goal: 'Tự viết được câu tiếng Nhật về đồ vật và chủ sở hữu, chọn đúng これ/この/の, đọc hiểu một đoạn ngắn.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Dịch Việt → Nhật** 12 câu: gõ bằng kana hoặc chữ Hán đều được; không cần dấu câu.',
        '**Trắc nghiệm** 12 câu về これ/この, の, 何/だれ, câu trả lời.',
        '**Ghép câu** 6 câu và **đọc hiểu** một đoạn Lan viết về đồ trên bàn học.',
        'Sai câu nào → quay lại đúng điểm ngữ pháp ở mục Ngữ pháp (ghi trong 💡 Gợi ý).',
      ],
    },
    {
      t: 'quiz',
      id: 'b2-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'これ/それ/あれ は N です · この/その/あの N · N1 の N2 · だれの',
      items: [
        { q: 'Cái này là cái gì?', answers: ans('これは{何|なん}ですか。'), hint: 'これ, 何' },
        { q: 'Đó (chỗ bạn) là từ điển tiếng Nhật.', answers: ans('それは{日本語|にほんご}のじしょです。'), hint: 'それ, 日本語, じしょ' },
        { q: 'Cái kia không phải là ô tô.', answers: ans('あれは{車|くるま}じゃありません。'), hint: 'あれ, 車' },
        { q: 'Quyển sách này là của Tanaka.', answers: ans('この{本|ほん}はたなかさんのです。', 'この{本|ほん}はたなかさんの{本|ほん}です。'), hint: 'この, 本' },
        { q: 'Cái ô đó là của ai?', answers: ans('そのかさはだれのですか。', 'そのかさはどなたのですか。'), hint: 'その, かさ, だれ' },
        { q: 'Đây là cà phê hay trà?', answers: ans('これはコーヒーですか、おちゃですか。'), hint: 'コーヒー, おちゃ' },
        { q: 'Chiếc ô tô kia là xe Nhật.', answers: ans('あの{車|くるま}は{日本|にほん}の{車|くるま}です。', 'あの{車|くるま}は{日本|にほん}のです。'), hint: 'あの, 車, 日本' },
        { q: 'Vâng, đúng vậy.', answers: ans('はい、そうです。', 'ええ、そうです。'), hint: 'そうです' },
        { q: 'Không, không phải. Là tạp chí.', answers: ans('いいえ、ちがいます。ざっしです。'), hint: 'ちがいます, ざっし' },
        { q: 'Cái của tôi là cái này.', answers: ans('わたしのはこれです。'), hint: 'わたし, これ' },
        { q: 'Đây là sách gì (về cái gì)?', answers: ans('これは{何|なん}の{本|ほん}ですか。'), hint: '何, 本' },
        { q: 'Người kia là bạn tôi.', answers: ans('あの{人|ひと}はわたしの{友|とも}だちです。', 'あの{人|ひと}は{友|とも}だちです。'), hint: 'あの, 人, 友だち' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-bt-chon',
      title: 'Chọn từ đúng',
      items: [
        { q: '（Lan cầm cuốn vở）___はわたしのノートです。', options: ['これ', 'この', 'それ', 'あの'], correct: 0, why: 'Đồ ở tay người nói, không có danh từ theo sau → これ.' },
        { q: '___かばんはだれのですか。（cái cặp ở xa cả hai）', options: ['あれ', 'あの', 'その', 'どれ'], correct: 1, why: 'Có danh từ かばん theo sau và ở xa → あの.' },
        { q: 'これは{日本語|にほんご}___じしょです。', options: ['は', 'の', 'も', 'か'], correct: 1, why: 'Nối hai danh từ → の.' },
        { q: 'それは ___ ですか。——{電話|でんわ}です。', options: ['だれ', '何', 'どなた', 'どれ'], correct: 1, why: 'Hỏi "cái gì" → 何 (なん).' },
        { q: 'このかぎは ___ のですか。——マイクさんのです。', options: ['何', 'どれ', 'だれ', 'この'], correct: 2, why: 'Hỏi "của ai" → だれの.' },
        { q: 'あれもたなかさんの{車|くるま}ですか。——いいえ、___。', options: ['そうです', 'ちがいます', 'そうですか', 'どうぞ'], correct: 1, why: 'Phủ định ngắn → ちがいます.' },
        { q: 'これはえんぴつです。それ ___ えんぴつです。', options: ['は', 'の', 'も', 'か'], correct: 2, why: '"Cái đó CŨNG là bút chì" → も.' },
        { q: '"Cà phê Việt Nam" là:', options: ['コーヒーのベトナム', 'ベトナムのコーヒー', 'ベトナムコーヒーの', 'コーヒーはベトナム'], correct: 1, why: 'Xuất xứ đứng trước: ベトナムのコーヒー.' },
        { q: 'Hỏi khách lịch sự: "Cái ví này của quý khách nào ạ?"', options: ['このさいふはだれのですか。', 'このさいふはどなたのですか。', 'これさいふはどなたですか。', 'このさいふは何ですか。'], correct: 1, why: 'Lịch sự → どなたの.' },
        { q: 'Bạn nhận quà, người tặng nói "これ、どうぞ". Bạn đáp:', options: ['どうぞ。', 'ありがとうございます。', 'ちがいます。', 'そうです。'], correct: 1, why: 'Nhận quà → ありがとうございます.' },
        { q: 'それは ___ の{本|ほん}ですか。——コンピューターの{本|ほん}です。', options: ['だれ', '何', 'どれ', 'この'], correct: 1, why: 'Hỏi "sách VỀ cái gì" → 何の本.' },
        { q: 'Câu nào ĐÚNG?', options: ['あれはたなかさんです。', 'あの人はたなかさんです。', 'あの はたなかさんです。', 'あれの人はたなかさんです。'], correct: 1, why: 'Chỉ người dùng あの人; あれ cho người thiếu lịch sự.' },
      ],
    },
    {
      t: 'build',
      id: 'b2-bt-ghep',
      title: 'Ghép câu — hỏi và đáp',
      items: [
        { vi: 'Đây là đồng hồ Thuỵ Sĩ.', chips: ['これは', 'スイスの', 'とけいです。', 'とけいの'], answer: ['これは', 'スイスの', 'とけいです。'], ro: 'Kore wa Suisu no tokei desu.' },
        { vi: 'Chìa khoá kia là của cô Yamada.', chips: ['あの', 'かぎは', 'やまだ{先生|せんせい}の', 'です。', 'あれ'], answer: ['あの', 'かぎは', 'やまだ{先生|せんせい}の', 'です。'], ro: 'Ano kagi wa Yamada-sensei no desu.' },
        { vi: 'Đó là báo tiếng Anh à?', chips: ['それは', 'えいごの', '{新聞|しんぶん}', 'ですか。', 'ですか、'], answer: ['それは', 'えいごの', '{新聞|しんぶん}', 'ですか。'], ro: 'Sore wa eigo no shinbun desu ka.' },
        { vi: 'Cái máy tính này không phải của tôi.', chips: ['この', 'パソコンは', 'わたしの', 'じゃありません。', 'です。'], answer: ['この', 'パソコンは', 'わたしの', 'じゃありません。'], ro: 'Kono pasokon wa watashi no ja arimasen.' },
        { vi: 'Xe đạp của Lan là cái nào?', chips: ['ランさんの', 'じてんしゃは', 'どれ', 'ですか。', 'どの'], answer: ['ランさんの', 'じてんしゃは', 'どれ', 'ですか。'], ro: 'Ran-san no jitensha wa dore desu ka.' },
        { vi: 'Cái này cũng là quà Việt Nam.', chips: ['これも', 'ベトナムの', 'おみやげです。', 'これは'], answer: ['これも', 'ベトナムの', 'おみやげです。'], ro: 'Kore mo Betonamu no omiyage desu.' },
      ],
    },
    {
      t: 'passage',
      title: 'Đọc hiểu — わたしのつくえ (Lan viết về bàn học của mình)',
      intro: 'Đọc đoạn văn (bật/tắt furigana tuỳ sức), rồi trả lời câu hỏi bên dưới.',
      paras: [
        { text: 'これはわたしのつくえです。これはわたしのパソコンです。{日本|にほん}のパソコンじゃありません。アメリカのパソコンです。' },
        { text: 'これは{日本語|にほんご}の{本|ほん}です。この{本|ほん}はわたしのじゃありません。たなかさんのです。そのじしょもたなかさんのです。' },
        { text: 'あれはベトナムのコーヒーです。ベトナムのおみやげです。あのとけいはわたしの{友|とも}だちのです。キムさんのとけいです。' },
      ],
    },
    {
      t: 'note',
      title: 'Bản dịch (xem sau khi làm xong)',
      items: [
        'Đây là bàn học của tôi. Đây là máy tính của tôi. Không phải máy tính Nhật. Là máy tính Mỹ.',
        'Đây là sách tiếng Nhật. Quyển sách này không phải của tôi. Là của Tanaka. Quyển từ điển đó cũng là của Tanaka.',
        'Kia là cà phê Việt Nam. Là quà từ Việt Nam. Cái đồng hồ kia là của bạn tôi. Là đồng hồ của Kim.',
      ],
    },
    {
      t: 'mcq',
      id: 'b2-bt-doc',
      title: 'Câu hỏi đọc hiểu',
      items: [
        { q: 'Máy tính của Lan là của nước nào?', options: ['Nhật', 'Mỹ', 'Việt Nam', 'Hàn Quốc'], correct: 1, why: 'アメリカのパソコンです — máy tính Mỹ.' },
        { q: 'Quyển sách tiếng Nhật là của ai?', options: ['Của Lan', 'Của Tanaka', 'Của Kim', 'Của cô Yamada'], correct: 1, why: 'この本はわたしのじゃありません。たなかさんのです。' },
        { q: 'Từ điển là của ai?', options: ['Của Lan', 'Của Tanaka', 'Của Kim', 'Không rõ'], correct: 1, why: 'そのじしょもたなかさんのです — cũng (も) của Tanaka.' },
        { q: 'Cái đồng hồ là của ai?', options: ['Của Lan', 'Của Tanaka', 'Của Kim', 'Của Mike'], correct: 2, why: 'あのとけいはわたしの友だちのです。キムさんのとけいです。' },
        { q: 'Cà phê Việt Nam ở đâu so với Lan?', options: ['Trong tay Lan', 'Gần người đọc', 'Ở xa (あれ)', 'Không có'], correct: 2, why: 'Lan dùng あれ → ở xa.' },
      ],
    },
  ],
};

export const BAI_2: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
