/**
 * KHOÁ JP — Bài 1: N5 · Chào hỏi & giới thiệu — N は N です.
 *
 * Soạn theo ../SOAN-BAI.md: hội thoại → từ vựng → ngữ pháp → chữ Hán (vài chữ cơ bản)
 * → nghe (dạng đề JLPT N5) → nói (phatam cho CuongMini) → bài tập.
 * Mọi hội thoại, câu ví dụ, kịch bản nghe, bài tập đều tự viết.
 *
 * Phạm vi ngữ pháp: N1 は N2 です · じゃありません／ではありません · ですか, はい・いいえ,
 * そうです・ちがいます · N も · từ để hỏi だれ／どなた, なん, なにじん, なんさい／おいくつ ·
 * khung tự giới thiệu (〜から きました chỉ dùng như cụm cố định). CHƯA dùng の (Bài 2),
 * これ/ここ/どこ (Bài 2–3). Chữ Hán ngoài N5 viết hiragana (わたし, かいしゃいん, 〜さい…).
 *
 * Romaji: Hepburn có gạch trên (ō, ū, ā, ē; ii, ei giữ nguyên), tên riêng viết hoa,
 * đầu câu viết thường. Nhân vật: Lan (ラン, nữ, vai a), Tanaka (たなか, nam, vai b),
 * cô Yamada (vai c / examiner "Cô Yamada"), Kim (キム, nữ, vai c), Mike (マイク, nam, vai b),
 * anh Suzuki (すずき, nam — cửa hàng trưởng konbini).
 */
import type { Lesson } from '@/components/sach-hoc/types';

type McqItem = { q: string; options: string[]; correct: number; why: string };
const m = (q: string, options: string[], correct: number, why: string): McqItem => ({ q, options, correct, why });

/* ── Đáp án gõ tay ─────────────────────────────────────────────────────────
 * Bộ chấm bỏ khoảng trắng và 。、？ khi so câu tiếng Nhật, nhưng KHÔNG đổi chữ Hán
 * ↔ kana. ans() nhận mẫu có furigana {漢字|かな} và sinh mọi cách gõ: mỗi chữ Hán
 * gõ bằng Hán hoặc bằng kana · じゃありません ↔ ではありません. Phần tử ĐẦU là
 * bản chữ Hán đầy đủ (trang hiện nó làm "Đáp án").
 */
const RUBY = /\{([^|}]+)\|([^}]+)\}/g;
function ans(...forms: string[]): string[] {
  const out = new Set<string>();
  for (const f of forms) {
    const n = [...f.matchAll(RUBY)].length;
    for (let mask = 0; mask < 1 << Math.min(n, 6); mask++) {
      let i = 0;
      const b = f.replace(RUBY, (_m, k: string, r: string) => ((mask >> i++) & 1 ? r : k));
      out.add(b);
      out.add(b.replace(/じゃありません/g, 'ではありません'));
    }
  }
  return [...out];
}

/* ══════════════════════════ 1. HỘI THOẠI ══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b1-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: はじめまして — Lần đầu gặp mặt',
  goal: 'Chào người mới gặp, nói tên – nước – công việc – tuổi của mình, hỏi lại người kia, và đáp "không phải" một cách lịch sự.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Học xong Bài 1 bạn nói được',
      items: [
        '**Tự giới thiệu** 4–5 câu: はじめまして → tên → nước → công việc → tuổi → よろしく おねがいします.',
        '**Hỏi người khác**: ～さんは がくせいですか · なにじんですか · しつれいですが、おいくつですか.',
        '**Trả lời có / không**: はい、そうです · いいえ、ちがいます · いいえ、～じゃありません.',
        'Nói **"cũng"**: わたしも りゅうがくせいです.',
        'Mẫu câu gốc của cả bài: **N1 は N2 です** — "N1 là N2".',
      ],
    },
    {
      t: 'table',
      caption: 'Nhân vật của khoá — gặp lại ở mọi bài',
      head: ['Nhân vật', 'Đọc', 'Là ai'],
      rows: [
        ['ランさん', 'Ran-san', '**Lan** — nhân vật chính. Người Việt, 20 tuổi, du học sinh trường tiếng Nhật Sakura ở Tokyo, làm thêm ở konbini.'],
        ['キムさん', 'Kimu-san', '**Kim** — bạn cùng lớp người Hàn Quốc, 22 tuổi.'],
        ['マイクさん', 'Maiku-san', '**Mike** — bạn cùng lớp người Mỹ, kỹ sư, học tiếng Nhật buổi tối.'],
        ['たなかさん', 'Tanaka-san', '**Tanaka** — sinh viên Đại học Sakura người Nhật, 21 tuổi, ở cùng ký túc xá, hay luyện nói với Lan.'],
        ['やまだ{先生|せんせい}', 'Yamada-sensei', '**Cô Yamada** — cô giáo tiếng Nhật của lớp.'],
        ['すずきさん', 'Suzuki-san', '**Anh Suzuki** — cửa hàng trưởng konbini nơi Lan làm thêm.'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học phần này: đọc **tình huống** bằng tiếng Việt → bấm **nghe cả đoạn** → bấm **từng câu** và đọc to theo 3 lần → tắt furigana và romaji, tự đọc lại. Đừng lo chưa hiểu hết ngữ pháp: phần **Ngữ pháp** sẽ giải thích từng mẫu xuất hiện ở đây.',
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Ngày đầu ở trường tiếng' },
    { t: 'p', text: 'Sáng thứ Hai, Lan đứng đợi trước cửa lớp. Một bạn nữ cũng đang đợi — đó là Kim. Hai người chưa quen nhau.' },
    {
      t: 'dialogue',
      title: 'Lan làm quen với Kim',
      lines: [
        { who: 'ラン', role: 'a', text: 'はじめまして。ランです。', ro: 'hajimemashite. Ran desu.', vi: 'Rất vui được gặp bạn. Mình là Lan.' },
        { who: 'キム', role: 'c', text: 'はじめまして。キムです。どうぞ よろしく おねがいします。', ro: 'hajimemashite. Kimu desu. dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp bạn. Mình là Kim. Rất mong được bạn giúp đỡ.' },
        { who: 'ラン', role: 'a', text: 'こちらこそ、よろしく おねがいします。', ro: 'kochira koso, yoroshiku onegaishimasu.', vi: 'Mình cũng vậy, mong được bạn giúp đỡ.' },
        { who: 'キム', role: 'c', text: 'ランさんは {中国人|ちゅうごくじん}ですか。', ro: 'Ran-san wa Chūgokujin desu ka.', vi: 'Lan là người Trung Quốc à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、{中国人|ちゅうごくじん}じゃありません。ベトナム{人|じん}です。キムさんは？', ro: 'iie, Chūgokujin ja arimasen. Betonamujin desu. Kimu-san wa?', vi: 'Không, mình không phải người Trung Quốc. Mình là người Việt Nam. Còn Kim?' },
        { who: 'キム', role: 'c', text: 'わたしは かんこく{人|じん}です。ソウルから きました。', ro: 'watashi wa Kankokujin desu. Sōru kara kimashita.', vi: 'Mình là người Hàn Quốc. Mình đến từ Seoul.' },
        { who: 'ラン', role: 'a', text: 'そうですか。わたしは ハノイから きました。', ro: 'sō desu ka. watashi wa Hanoi kara kimashita.', vi: 'Thế à. Mình đến từ Hà Nội.' },
        { who: 'キム', role: 'c', text: 'ランさんも りゅうがくせいですか。', ro: 'Ran-san mo ryūgakusei desu ka.', vi: 'Lan cũng là du học sinh à?' },
        { who: 'ラン', role: 'a', text: 'はい、そうです。', ro: 'hai, sō desu.', vi: 'Ừ, đúng vậy.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'はじめまして。', ro: 'hajimemashite.', vi: 'Rất vui được gặp (chỉ nói ở **lần đầu** gặp ai đó).' },
        { en: 'どうぞ よろしく おねがいします。', ro: 'dōzo yoroshiku onegaishimasu.', vi: 'Rất mong được giúp đỡ (câu kết khi tự giới thiệu). Bỏ どうぞ thì bớt trang trọng.' },
        { en: 'こちらこそ、よろしく おねがいします。', ro: 'kochira koso, yoroshiku onegaishimasu.', vi: 'Chính tôi mới mong được giúp đỡ (đáp lại よろしく).' },
        { en: 'ランさんは？', ro: 'Ran-san wa?', vi: 'Còn Lan thì sao? (hỏi lại đúng điều vừa nói, lên giọng ở cuối)' },
        { en: 'ハノイから きました。', ro: 'Hanoi kara kimashita.', vi: 'Tôi đến từ Hà Nội. (cụm cố định — から sẽ học kỹ ở Bài 4)' },
        { en: 'そうですか。', ro: 'sō desu ka.', vi: 'Thế à / Vậy à. (xuống giọng: tỏ ý đã nghe và hiểu)' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Tự giới thiệu trước lớp' },
    { t: 'p', text: 'Giờ học đầu tiên. Cô Yamada chào cả lớp rồi mời từng người tự giới thiệu (じこしょうかい). Mike nói trước, rồi tới Lan.' },
    {
      t: 'dialogue',
      title: 'じこしょうかい — giới thiệu bản thân',
      lines: [
        { who: 'Cô Yamada', role: 'c', text: 'みなさん、はじめまして。やまだです。どうぞ よろしく おねがいします。', ro: 'minasan, hajimemashite. Yamada desu. dōzo yoroshiku onegaishimasu.', vi: 'Chào cả lớp, rất vui được gặp các em. Cô là Yamada. Rất mong được các em giúp đỡ.' },
        { who: 'Cô Yamada', role: 'c', text: 'じゃ、じこしょうかいを おねがいします。マイクさん、どうぞ。', ro: 'ja, jikoshōkai o onegaishimasu. Maiku-san, dōzo.', vi: 'Nào, mời các em tự giới thiệu. Mike, mời em.' },
        { who: 'マイク', role: 'b', text: 'はじめまして。マイクです。アメリカから きました。エンジニアです。どうぞ よろしく おねがいします。', ro: 'hajimemashite. Maiku desu. Amerika kara kimashita. enjinia desu. dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp mọi người. Tôi là Mike. Tôi đến từ Mỹ. Tôi là kỹ sư. Rất mong được giúp đỡ.' },
        { who: 'Cô Yamada', role: 'c', text: 'マイクさんは {学生|がくせい}ですか。', ro: 'Maiku-san wa gakusei desu ka.', vi: 'Mike là sinh viên à?' },
        { who: 'マイク', role: 'b', text: 'いいえ、{学生|がくせい}じゃありません。かいしゃいんです。', ro: 'iie, gakusei ja arimasen. kaishain desu.', vi: 'Không ạ, em không phải sinh viên. Em là nhân viên công ty.' },
        { who: 'Cô Yamada', role: 'c', text: 'そうですか。じゃ、ランさん、どうぞ。', ro: 'sō desu ka. ja, Ran-san, dōzo.', vi: 'Thế à. Tiếp theo, Lan, mời em.' },
        { who: 'ラン', role: 'a', text: 'はじめまして。ランです。ベトナムから きました。{学生|がくせい}です。はたちです。どうぞ よろしく おねがいします。', ro: 'hajimemashite. Ran desu. Betonamu kara kimashita. gakusei desu. hatachi desu. dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp mọi người. Em là Lan. Em đến từ Việt Nam. Em là sinh viên. Em 20 tuổi. Rất mong được giúp đỡ.' },
        { who: 'Cô Yamada', role: 'c', text: 'ランさん、よろしく おねがいします。', ro: 'Ran-san, yoroshiku onegaishimasu.', vi: 'Lan, cô cũng mong được em giúp đỡ.' },
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: trả lời "không" xong phải nói điều đúng',
      items: [
        'Mike không dừng ở "không phải sinh viên" mà nói luôn **かいしゃいんです** (là nhân viên công ty). Người Nhật — và giám khảo khi thi nói — luôn chờ câu thông tin đúng này.',
        '~~いいえ。~~ (cụt lủn) nghe thiếu lịch sự. Nói đủ: **いいえ、～じゃありません。＋ thông tin đúng**.',
        'Mike vừa nói エンジニア vừa nói かいしゃいん — không mâu thuẫn: エンジニア là **nghề**, かいしゃいん là **vị trí** (làm thuê cho công ty). Người Nhật hay dùng かいしゃいん khi giới thiệu chung chung.',
      ],
    },
    {
      t: 'table',
      caption: 'Khung tự giới thiệu 6 câu — học thuộc khung, chỉ thay phần in đậm',
      head: ['Thứ tự', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['1. Chào', 'はじめまして。', 'hajimemashite.', 'Rất vui được gặp.'],
        ['2. Tên', '**ラン**です。', '**Ran** desu.', 'Tôi là **Lan**.'],
        ['3. Từ đâu tới', '**ベトナム**から きました。', '**Betonamu** kara kimashita.', 'Tôi đến từ **Việt Nam**.'],
        ['4. Công việc', '**{学生|がくせい}**です。', '**gakusei** desu.', 'Tôi là **sinh viên**.'],
        ['5. Tuổi (nếu muốn)', '**はたち**です。', '**hatachi** desu.', 'Tôi **20 tuổi**.'],
        ['6. Kết', 'どうぞ よろしく おねがいします。', 'dōzo yoroshiku onegaishimasu.', 'Rất mong được giúp đỡ.'],
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Gặp bạn người Nhật ở ký túc xá' },
    { t: 'p', text: 'Buổi tối, Lan xuống phòng sinh hoạt chung của ký túc xá. Một anh sinh viên người Nhật đang ngồi đọc sách — đó là Tanaka.' },
    {
      t: 'dialogue',
      title: 'Lan và Tanaka',
      lines: [
        { who: 'たなか', role: 'b', text: 'こんばんは。はじめまして。たなかです。', ro: 'konbanwa. hajimemashite. Tanaka desu.', vi: 'Chào buổi tối. Rất vui được gặp bạn. Mình là Tanaka.' },
        { who: 'ラン', role: 'a', text: 'はじめまして。ランです。よろしく おねがいします。', ro: 'hajimemashite. Ran desu. yoroshiku onegaishimasu.', vi: 'Rất vui được gặp anh. Em là Lan. Mong anh giúp đỡ.' },
        { who: 'たなか', role: 'b', text: 'こちらこそ。ランさんは りゅうがくせいですか。', ro: 'kochira koso. Ran-san wa ryūgakusei desu ka.', vi: 'Mình cũng vậy. Lan là du học sinh à?' },
        { who: 'ラン', role: 'a', text: 'はい、そうです。たなかさんも {学生|がくせい}ですか。', ro: 'hai, sō desu. Tanaka-san mo gakusei desu ka.', vi: 'Vâng, đúng ạ. Anh Tanaka cũng là sinh viên ạ?' },
        { who: 'たなか', role: 'b', text: 'はい、{大学生|だいがくせい}です。{大学|だいがく}は さくら{大学|だいがく}です。', ro: 'hai, daigakusei desu. daigaku wa Sakura daigaku desu.', vi: 'Ừ, mình là sinh viên đại học. Trường mình là Đại học Sakura.' },
        { who: 'ラン', role: 'a', text: 'そうですか。あのう、しつれいですが、おいくつですか。', ro: 'sō desu ka. anō, shitsurei desu ga, oikutsu desu ka.', vi: 'Thế ạ. À… xin lỗi cho em hỏi, anh bao nhiêu tuổi ạ?' },
        { who: 'たなか', role: 'b', text: 'にじゅういっさいです。ランさんは？', ro: 'nijūissai desu. Ran-san wa?', vi: 'Mình 21 tuổi. Còn Lan?' },
        { who: 'ラン', role: 'a', text: 'わたしは はたちです。', ro: 'watashi wa hatachi desu.', vi: 'Em 20 tuổi.' },
        { who: 'たなか', role: 'b', text: 'あ、あの {人|ひと}は だれですか。', ro: 'a, ano hito wa dare desu ka.', vi: 'À, người kia là ai thế?' },
        { who: 'ラン', role: 'a', text: 'マイクさんです。アメリカ{人|じん}です。エンジニアです。', ro: 'Maiku-san desu. Amerikajin desu. enjinia desu.', vi: 'Đó là anh Mike. Anh ấy là người Mỹ. Anh ấy là kỹ sư.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'しつれいですが、おいくつですか。', ro: 'shitsurei desu ga, oikutsu desu ka.', vi: 'Xin lỗi cho tôi hỏi, anh/chị bao nhiêu tuổi? (lịch sự)' },
        { en: '{大学|だいがく}は さくら{大学|だいがく}です。', ro: 'daigaku wa Sakura daigaku desu.', vi: 'Trường đại học (của tôi) là Đại học Sakura.' },
        { en: 'たなかさんも {学生|がくせい}ですか。', ro: 'Tanaka-san mo gakusei desu ka.', vi: 'Anh Tanaka **cũng** là sinh viên à?' },
        { en: 'あの {人|ひと}は だれですか。', ro: 'ano hito wa dare desu ka.', vi: 'Người kia là ai? (あの = "kia" — học kỹ ở Bài 2)' },
        { en: 'あのう…', ro: 'anō…', vi: 'À… / Ờ… (tiếng đệm trước khi hỏi, cho câu hỏi bớt đột ngột)' },
      ],
    },
    {
      t: 'note',
      title: 'Phép lịch sự khi làm quen ở Nhật',
      items: [
        'Người Nhật **cúi chào nhẹ** (khoảng 15°) khi nói はじめまして và よろしく おねがいします. Bắt tay không phổ biến bằng.',
        'Hỏi tuổi người mới gặp là hơi tò mò — nên mở đầu bằng **しつれいですが** (xin thất lễ…) và dùng **おいくつですか** (lịch sự hơn なんさいですか). **Không hỏi tuổi thầy cô, khách hàng.**',
        'Gọi người khác bằng **họ + さん** (たなかさん). Với người nước ngoài, gọi bằng tên như họ tự giới thiệu (ランさん, マイクさん).',
        'Tự giới thiệu trong lớp hoặc khi đi làm thêm, nói tên **không kèm さん**: ~~ランさんです~~ → **ランです**.',
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b1-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng Bài 1 — người, nghề, nước, tuổi, câu làm quen',
  goal: 'Đọc, nghe hiểu và dùng được 45 từ để giới thiệu bản thân và hỏi về người khác, cộng cách nói tuổi từ 1 đến 99.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Hôm nay học gì',
      items: [
        '**45 từ** chia 6 nhóm: người – nghề – nước – trường – hỏi đáp – câu làm quen.',
        '**Hậu tố** gắn sau từ khác: ～さん (anh/chị…), ～{人|じん} (người nước…), ～{語|ご} (tiếng…), ～さい (… tuổi).',
        'Đếm **11–99** và nói **tuổi** — chú ý cách đọc đặc biệt: いっさい, はっさい, じゅっさい, **はたち** (20 tuổi).',
        'Mỗi từ: bấm 🔊 nghe → đọc to → đọc câu ví dụ. Dùng nút **Che nghĩa / Che từ** để tự kiểm tra.',
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ trước khi học',
      items: [
        '**お** trước một số danh từ (お{名前|なまえ}, お{国|くに}, おしごと) = cách nói **kính trọng** khi hỏi về **người khác**. Nói về mình thì **bỏ お**.',
        '**～さん** chỉ gắn sau tên **người khác**, không gắn sau tên mình. Thầy cô thì gọi **họ + {先生|せんせい}** (やまだ{先生|せんせい}), không gọi ~~やまださん先生~~.',
        'Từ viết bằng **katakana** (ベトナム, エンジニア…) là từ mượn hoặc tên nước ngoài — không có chữ Hán nên không có furigana.',
        'Cột **âm Hán Việt** (trong dòng "more") giúp nhớ nghĩa chữ Hán: {学生|がくせい} = HỌC SINH, {先生|せんせい} = TIÊN SINH.',
      ],
    },

    { t: 'h', text: 'Nhóm 1 — Người và cách xưng hô' },
    {
      t: 'vocab',
      items: [
        { w: 'わたし', pos: 'đại từ', ipa: 'watashi', vi: 'tôi (dùng được cho cả nam và nữ, mọi hoàn cảnh)', ex: 'わたしは ランです。', exRo: 'watashi wa Ran desu.', exVi: 'Tôi là Lan.', more: 'Chữ Hán 私 (TƯ) thuộc cấp N4 — khoá viết わたし bằng hiragana. Trong hội thoại thường **bỏ わたしは** khi đã rõ đang nói về mình.' },
        { w: 'あなた', pos: 'đại từ', ipa: 'anata', vi: 'bạn, anh, chị (ngôi thứ hai)', ex: 'あなたは {学生|がくせい}ですか。', exRo: 'anata wa gakusei desu ka.', exVi: 'Bạn là sinh viên à?', more: '⚠️ Người Nhật **ít dùng** あなた — nghe xa cách, có khi bất lịch sự. Gọi **tên + さん**: ランさんは {学生|がくせい}ですか。' },
        { w: '〜さん', pos: 'hậu tố', ipa: '~san', vi: 'anh / chị / ông / bà / bạn ~ (gắn sau tên người khác)', ex: 'たなかさんは {日本人|にほんじん}です。', exRo: 'Tanaka-san wa Nihonjin desu.', exVi: 'Anh Tanaka là người Nhật.', more: 'Dùng cho cả nam, nữ, mọi tuổi. **Không** gắn sau tên mình: ~~ランさんです~~ → ランです.' },
        { w: '{先生|せんせい}', pos: 'danh từ', ipa: 'sensei', vi: 'thầy giáo, cô giáo; (gọi) thầy, cô', ex: 'やまだ{先生|せんせい}は {日本人|にほんじん}です。', exRo: 'Yamada-sensei wa Nihonjin desu.', exVi: 'Cô Yamada là người Nhật.', more: 'Hán Việt: TIÊN SINH. Cũng dùng gọi bác sĩ, luật sư. Là từ **gọi người khác** — không tự xưng わたしは {先生|せんせい}です khi giới thiệu nghề (dùng きょうし, học ở bài sau).' },
        { w: '{学生|がくせい}', pos: 'danh từ', ipa: 'gakusei', vi: 'học sinh, sinh viên', ex: 'ランさんは {学生|がくせい}です。', exRo: 'Ran-san wa gakusei desu.', exVi: 'Lan là sinh viên.', more: 'Hán Việt: HỌC SINH. Ở Nhật, 学生 thường chỉ sinh viên (đại học, cao đẳng, trường tiếng).' },
        { w: '{大学生|だいがくせい}', pos: 'danh từ', ipa: 'daigakusei', vi: 'sinh viên đại học', ex: 'たなかさんは {大学生|だいがくせい}です。', exRo: 'Tanaka-san wa daigakusei desu.', exVi: 'Anh Tanaka là sinh viên đại học.', more: 'Hán Việt: ĐẠI HỌC SINH = {大学|だいがく} (đại học) + {生|せい} (sinh).' },
        { w: 'りゅうがくせい', pos: 'danh từ', ipa: 'ryūgakusei', vi: 'du học sinh', ex: 'キムさんも りゅうがくせいです。', exRo: 'Kimu-san mo ryūgakusei desu.', exVi: 'Kim cũng là du học sinh.', more: 'Chữ Hán: 留学生 (LƯU HỌC SINH). Chữ 留 ngoài N5 nên viết hiragana. Đọc kỹ: りゅう (ryū, kéo dài) — が — く — せい.' },
        { w: '{友|とも}だち', pos: 'danh từ', ipa: 'tomodachi', vi: 'bạn bè, bạn', ex: 'キムさんは {友|とも}だちです。', exRo: 'Kimu-san wa tomodachi desu.', exVi: 'Kim là bạn (của tôi).', more: 'Hán Việt: 友 HỮU (bạn hữu). Chỉ một người cũng dùng {友|とも}だち.' },
      ],
    },

    { t: 'h', text: 'Nhóm 2 — Nghề nghiệp, công việc' },
    {
      t: 'vocab',
      items: [
        { w: 'かいしゃいん', pos: 'danh từ', ipa: 'kaishain', vi: 'nhân viên công ty', ex: 'マイクさんは かいしゃいんです。', exRo: 'Maiku-san wa kaishain desu.', exVi: 'Mike là nhân viên công ty.', more: 'Chữ Hán: 会社員 (HỘI XÃ VIÊN). = かいしゃ (công ty) + いん (nhân viên).' },
        { w: 'いしゃ', pos: 'danh từ', ipa: 'isha', vi: 'bác sĩ', ex: 'わたしは いしゃじゃありません。', exRo: 'watashi wa isha ja arimasen.', exVi: 'Tôi không phải bác sĩ.', more: 'Chữ Hán: 医者 (Y GIẢ). Gọi bác sĩ thì dùng {先生|せんせい}. Phân biệt いしゃ (2 nhịp, しゃ nhỏ) với いしや (3 nhịp).' },
        { w: 'エンジニア', pos: 'danh từ', ipa: 'enjinia', vi: 'kỹ sư (engineer)', ex: 'マイクさんは エンジニアです。', exRo: 'Maiku-san wa enjinia desu.', exVi: 'Mike là kỹ sư.', more: 'Từ mượn tiếng Anh. Kỹ sư IT thường nói **ITエンジニア** (アイティー エンジニア).' },
        { w: 'てんいん', pos: 'danh từ', ipa: "ten'in", vi: 'nhân viên cửa hàng', ex: 'ランさんは てんいんです。', exRo: "Ran-san wa ten'in desu.", exVi: 'Lan là nhân viên cửa hàng.', more: "Chữ Hán: 店員 (ĐIẾM VIÊN). Đọc て・ん・い・ん (4 nhịp) — romaji ten'in, không đọc dính \"te-nin\"." },
        { w: 'てんちょう', pos: 'danh từ', ipa: 'tenchō', vi: 'cửa hàng trưởng, quản lý cửa hàng', ex: 'すずきさんは てんちょうです。', exRo: 'Suzuki-san wa tenchō desu.', exVi: 'Anh Suzuki là cửa hàng trưởng.', more: 'Chữ Hán: 店長 (ĐIẾM TRƯỞNG). Nhân viên thường gọi thẳng là てんちょう thay cho tên.' },
        { w: 'アルバイト', pos: 'danh từ', ipa: 'arubaito', vi: 'việc làm thêm; người làm thêm', ex: 'ランさんは アルバイトです。', exRo: 'Ran-san wa arubaito desu.', exVi: 'Lan là nhân viên làm thêm.', more: 'Gốc tiếng Đức "Arbeit". Nói tắt: バイト. Du học sinh ở Nhật được làm thêm tối đa 28 giờ/tuần (khi có giấy phép).' },
        { w: 'おしごと', pos: 'danh từ', ipa: 'oshigoto', vi: 'công việc (của người khác — lịch sự)', ex: 'おしごとは？——エンジニアです。', exRo: 'oshigoto wa? — enjinia desu.', exVi: 'Anh làm nghề gì? — Tôi là kỹ sư.', more: 'Chữ Hán: お仕事 (SĨ SỰ). Nói về mình bỏ お: しごと.' },
      ],
    },

    { t: 'h', text: 'Nhóm 3 — Nước, người nước nào, tiếng nước nào' },
    {
      t: 'vocab',
      items: [
        { w: '{日本|にほん}', pos: 'danh từ (tên nước)', ipa: 'Nihon', vi: 'Nhật Bản', ex: 'お{国|くに}は {日本|にほん}ですか。——はい、{日本|にほん}です。', exRo: 'okuni wa Nihon desu ka. — hai, Nihon desu.', exVi: 'Nước của anh là Nhật Bản à? — Vâng, Nhật Bản.', more: 'Hán Việt: NHẬT BẢN ("gốc của mặt trời"). Cũng đọc にっぽん (Nippon) — trên tiền giấy, tem, đội tuyển thể thao.' },
        { w: 'ベトナム', pos: 'danh từ (tên nước)', ipa: 'Betonamu', vi: 'Việt Nam', ex: 'ベトナムから きました。', exRo: 'Betonamu kara kimashita.', exVi: 'Tôi đến từ Việt Nam.', more: 'Người Việt: ベトナム{人|じん}. Tiếng Việt: ベトナム{語|ご}.' },
        { w: '{中国|ちゅうごく}', pos: 'danh từ (tên nước)', ipa: 'Chūgoku', vi: 'Trung Quốc', ex: 'わたしは {中国人|ちゅうごくじん}じゃありません。', exRo: 'watashi wa Chūgokujin ja arimasen.', exVi: 'Tôi không phải người Trung Quốc.', more: 'Hán Việt: TRUNG QUỐC. Đọc ちゅう kéo dài: chu-u-go-ku (4 nhịp).' },
        { w: 'かんこく', pos: 'danh từ (tên nước)', ipa: 'Kankoku', vi: 'Hàn Quốc', ex: 'キムさんは かんこく{人|じん}です。', exRo: 'Kimu-san wa Kankokujin desu.', exVi: 'Kim là người Hàn Quốc.', more: 'Chữ Hán: 韓国 (HÀN QUỐC). Chữ 韓 ngoài N5 nên viết hiragana.' },
        { w: 'アメリカ', pos: 'danh từ (tên nước)', ipa: 'Amerika', vi: 'Mỹ', ex: 'マイクさんは アメリカ{人|じん}です。', exRo: 'Maiku-san wa Amerikajin desu.', exVi: 'Mike là người Mỹ.', more: 'Các nước khác viết katakana tương tự: イギリス (Anh), フランス (Pháp), タイ (Thái Lan).' },
        { w: '〜{人|じん}', pos: 'hậu tố', ipa: '~jin', vi: 'người (nước ~)', ex: 'ランさんは ベトナム{人|じん}です。', exRo: 'Ran-san wa Betonamujin desu.', exVi: 'Lan là người Việt Nam.', more: 'Hán Việt: NHÂN. Tên nước + {人|じん}: {日本人|にほんじん}, かんこく{人|じん}. Đứng một mình đọc {人|ひと} (người).' },
        { w: '〜{語|ご}', pos: 'hậu tố', ipa: '~go', vi: 'tiếng (nước ~), ngôn ngữ', ex: '「はじめまして」は {日本語|にほんご}です。「xin chào」は ベトナム{語|ご}です。', exRo: '"hajimemashite" wa nihongo desu. "xin chào" wa Betonamugo desu.', exVi: '"Hajimemashite" là tiếng Nhật. "Xin chào" là tiếng Việt.', more: 'Hán Việt: NGỮ. {日本語|にほんご} (tiếng Nhật), ベトナム{語|ご} (tiếng Việt). Riêng tiếng Anh là **えいご**, không phải ~~アメリカ語~~.' },
        { w: '（お）{国|くに}', pos: 'danh từ', ipa: '(o)kuni', vi: 'đất nước (お{国|くに} = nước của bạn — lịch sự)', ex: 'お{国|くに}は？——ベトナムです。', exRo: 'okuni wa? — Betonamu desu.', exVi: 'Bạn đến từ nước nào? — Việt Nam.', more: 'Hán Việt: QUỐC. Nói về nước mình bỏ お: わたしの {国|くに} (の học ở Bài 2).' },
      ],
    },

    { t: 'h', text: 'Nhóm 4 — Trường học, công ty' },
    {
      t: 'vocab',
      items: [
        { w: '{学校|がっこう}', pos: 'danh từ', ipa: 'gakkō', vi: 'trường học', ex: '{学校|がっこう}は さくら{日本語学校|にほんごがっこう}です。', exRo: 'gakkō wa Sakura nihongo gakkō desu.', exVi: 'Trường (của tôi) là trường tiếng Nhật Sakura.', more: 'Hán Việt: HỌC HIỆU. Có âm ngắt っ: が・っ・こ・う (4 nhịp).' },
        { w: '{大学|だいがく}', pos: 'danh từ', ipa: 'daigaku', vi: 'trường đại học', ex: '{大学|だいがく}は さくら{大学|だいがく}です。', exRo: 'daigaku wa Sakura daigaku desu.', exVi: 'Trường đại học (của tôi) là Đại học Sakura.', more: 'Hán Việt: ĐẠI HỌC. Tên trường + {大学|だいがく}: とうきょう{大学|だいがく} (ĐH Tokyo).' },
        { w: '{日本語学校|にほんごがっこう}', pos: 'danh từ', ipa: 'nihongo gakkō', vi: 'trường tiếng Nhật, trường Nhật ngữ', ex: 'さくら{日本語学校|にほんごがっこう}は とうきょうです。', exRo: 'Sakura nihongo gakkō wa Tōkyō desu.', exVi: 'Trường Nhật ngữ Sakura ở Tokyo.', more: '= {日本語|にほんご} (tiếng Nhật) + {学校|がっこう} (trường). Phần lớn du học sinh Việt học ở đây 1–2 năm trước khi vào đại học, cao đẳng.' },
        { w: 'かいしゃ', pos: 'danh từ', ipa: 'kaisha', vi: 'công ty', ex: 'かいしゃは ABCです。', exRo: 'kaisha wa ēbīshī desu.', exVi: 'Công ty (của tôi) là ABC.', more: 'Chữ Hán: 会社 (HỘI XÃ). かいしゃ + いん (viên) = かいしゃいん (nhân viên công ty).' },
      ],
    },

    { t: 'h', text: 'Nhóm 5 — Hỏi và đáp' },
    {
      t: 'vocab',
      items: [
        { w: '（お）{名前|なまえ}', pos: 'danh từ', ipa: '(o)namae', vi: 'tên (お{名前|なまえ} = tên của bạn — lịch sự)', ex: 'お{名前|なまえ}は？——ランです。', exRo: 'onamae wa? — Ran desu.', exVi: 'Tên bạn là gì? — Tôi là Lan.', more: 'Hán Việt: DANH TIỀN. Trên giấy tờ, ô "お名前" = ô ghi họ tên.' },
        { w: 'だれ', pos: 'từ để hỏi', ipa: 'dare', vi: 'ai', ex: 'あの {人|ひと}は だれですか。', exRo: 'ano hito wa dare desu ka.', exVi: 'Người kia là ai?', more: 'Chữ Hán 誰 ngoài N5 → viết だれ. Trả lời **không** dùng はい／いいえ: …マイクさんです。' },
        { w: 'どなた', pos: 'từ để hỏi', ipa: 'donata', vi: 'vị nào, ai (lịch sự của だれ)', ex: 'すみません、どなたですか。', exRo: 'sumimasen, donata desu ka.', exVi: 'Xin lỗi, (anh/chị) là ai ạ?', more: 'Dùng khi hỏi về người lớn tuổi, khách, hoặc nghe chuông cửa / điện thoại mà không biết ai.' },
        { w: '{何|なん}／{何|なに}', pos: 'từ để hỏi', ipa: 'nan / nani', vi: 'cái gì', ex: 'おしごとは {何|なん}ですか。', exRo: 'oshigoto wa nan desu ka.', exVi: 'Công việc của anh là gì?', more: 'Hán Việt: HÀ. Trước です và trước từ đếm (さい…) đọc **なん**: {何|なん}ですか, {何|なん}さい. Ghép với じん thì đọc **なに**: なにじん.' },
        { w: 'なにじん', pos: 'từ để hỏi', ipa: 'nanijin', vi: 'người nước nào', ex: 'キムさんは なにじんですか。——かんこく{人|じん}です。', exRo: 'Kimu-san wa nanijin desu ka. — Kankokujin desu.', exVi: 'Kim là người nước nào? — Người Hàn Quốc.', more: 'Chữ Hán viết 何人 — nhưng 何人 cũng đọc なんにん (bao nhiêu người, Bài 11). Hỏi lịch sự hơn: お{国|くに}は？' },
        { w: '〜さい', pos: 'hậu tố', ipa: '~sai', vi: '… tuổi', ex: 'マイクさんは にじゅうごさいです。', exRo: 'Maiku-san wa nijūgosai desu.', exVi: 'Mike 25 tuổi.', more: 'Chữ Hán: 歳 (TUẾ) — ngoài N5. Chú ý cách đọc biến âm: いっさい, はっさい, じゅっさい; 20 tuổi = **はたち**.' },
        { w: '{何|なん}さい', pos: 'từ để hỏi', ipa: 'nansai', vi: 'mấy tuổi', ex: 'たなかさんは {何|なん}さいですか。', exRo: 'Tanaka-san wa nansai desu ka.', exVi: 'Anh Tanaka mấy tuổi?', more: 'Dùng với bạn bè, người ít tuổi hơn, trẻ em. Với người trên dùng **おいくつ**.' },
        { w: 'おいくつ', pos: 'từ để hỏi', ipa: 'oikutsu', vi: 'bao nhiêu tuổi (lịch sự)', ex: 'しつれいですが、おいくつですか。', exRo: 'shitsurei desu ga, oikutsu desu ka.', exVi: 'Xin lỗi, anh/chị bao nhiêu tuổi ạ?', more: 'Mở đầu bằng しつれいですが cho mềm. Không hỏi tuổi thầy cô, khách hàng.' },
        { w: 'はい', pos: 'thán từ', ipa: 'hai', vi: 'vâng, dạ, có', ex: 'はい、{学生|がくせい}です。', exRo: 'hai, gakusei desu.', exVi: 'Vâng, tôi là sinh viên.', more: 'Cũng dùng khi được gọi tên (điểm danh): ランさん。——はい。' },
        { w: 'いいえ', pos: 'thán từ', ipa: 'iie', vi: 'không', ex: 'いいえ、{学生|がくせい}じゃありません。', exRo: 'iie, gakusei ja arimasen.', exVi: 'Không, tôi không phải sinh viên.', more: 'Có trường âm: い・い・え (3 nhịp). Đọc thiếu thành いえ (ie) là "ngôi nhà". Nói chuyện thường người Nhật hay dùng いえ / いや nhẹ nhàng hơn.' },
        { w: 'そうです', pos: 'cụm từ', ipa: 'sō desu', vi: 'đúng vậy, đúng thế', ex: 'ランさんは りゅうがくせいですか。——はい、そうです。', exRo: 'Ran-san wa ryūgakusei desu ka. — hai, sō desu.', exVi: 'Lan là du học sinh à? — Vâng, đúng vậy.', more: 'Hỏi lại "そうですか" (xuống giọng) = "thế à". Lên giọng = "thật vậy sao?".' },
        { w: 'ちがいます', pos: 'động từ (cụm cố định)', ipa: 'chigaimasu', vi: 'không phải, sai rồi, khác', ex: 'キムさんは {中国人|ちゅうごくじん}ですか。——いいえ、ちがいます。', exRo: 'Kimu-san wa Chūgokujin desu ka. — iie, chigaimasu.', exVi: 'Kim là người Trung Quốc à? — Không, không phải.', more: 'Câu trả lời "không" gọn nhất. Nói xong nên thêm thông tin đúng: かんこく{人|じん}です。' },
      ],
    },

    { t: 'h', text: 'Nhóm 6 — Câu nói khi làm quen' },
    {
      t: 'vocab',
      items: [
        { w: 'はじめまして', pos: 'câu chào', ipa: 'hajimemashite', vi: 'rất vui được gặp (lần đầu)', ex: 'はじめまして。マイクです。', exRo: 'hajimemashite. Maiku desu.', exVi: 'Rất vui được gặp. Tôi là Mike.', more: 'Nghĩa gốc: "lần đầu tiên". **Chỉ nói một lần** — gặp lại hôm sau thì chào おはようございます, こんにちは.' },
        { w: 'どうぞ よろしく おねがいします', pos: 'câu chào', ipa: 'dōzo yoroshiku onegaishimasu', vi: 'rất mong được giúp đỡ, rất mong được làm quen', ex: 'ランです。どうぞ よろしく おねがいします。', exRo: 'Ran desu. dōzo yoroshiku onegaishimasu.', exVi: 'Tôi là Lan. Rất mong được giúp đỡ.', more: 'Bỏ どうぞ: bớt trang trọng. Với bạn bè: よろしく. Câu này dùng cả khi nhờ việc, bắt đầu làm chung.' },
        { w: 'こちらこそ', pos: 'cụm từ', ipa: 'kochira koso', vi: 'chính tôi mới (là người phải nói vậy)', ex: 'こちらこそ、よろしく おねがいします。', exRo: 'kochira koso, yoroshiku onegaishimasu.', exVi: 'Tôi cũng vậy, rất mong được giúp đỡ.', more: 'Đáp lại よろしく おねがいします. Cũng dùng đáp lại ありがとう: こちらこそ (tôi mới phải cảm ơn).' },
        { w: 'しつれいですが', pos: 'cụm từ', ipa: 'shitsurei desu ga', vi: 'xin thất lễ, xin lỗi cho hỏi…', ex: 'しつれいですが、お{名前|なまえ}は？', exRo: 'shitsurei desu ga, onamae wa?', exVi: 'Xin lỗi, tên anh/chị là gì ạ?', more: 'Chữ Hán: 失礼 (THẤT LỄ). Đặt trước câu hỏi riêng tư (tên, tuổi) cho lịch sự.' },
        { w: 'じこしょうかい', pos: 'danh từ', ipa: 'jikoshōkai', vi: 'sự tự giới thiệu', ex: 'じこしょうかいを おねがいします。', exRo: 'jikoshōkai o onegaishimasu.', exVi: 'Mời (bạn) tự giới thiệu.', more: 'Chữ Hán: 自己紹介 (TỰ KỶ THIỆU GIỚI). Phỏng vấn xin việc, ngày đầu đi học, đi làm thêm đều bắt đầu bằng じこしょうかい.' },
        { w: '〜から きました', pos: 'cụm cố định', ipa: '~ kara kimashita', vi: 'tôi đến từ ~', ex: 'わたしは ハノイから きました。', exRo: 'watashi wa Hanoi kara kimashita.', exVi: 'Tôi đến từ Hà Nội.', more: 'Ở Bài 1 học **như một cụm**: tên nước / thành phố + から きました. から (từ) và きます (đến) sẽ học ở Bài 4–5.' },
      ],
    },
    { t: 'h', text: 'Số 11–99 và cách nói tuổi' },
    {
      t: 'p',
      text: 'Số tiếng Nhật ghép **giống hệt tiếng Việt**: 11 = mười + một = **じゅう + いち**; 20 = hai + mười = **に + じゅう**; 35 = ba mươi lăm = **さん + じゅう + ご**. Chỉ cần thuộc 1–10 (đã học ở Bài 0) là đếm được tới 99. Tuổi = số + **さい**, nhưng vài số **biến âm** khi ghép với さい.',
    },
    {
      t: 'table',
      caption: 'Ghép số 11–99',
      head: ['Số', 'Đọc', 'Romaji', 'Cách ghép'],
      rows: [
        ['11', 'じゅういち', 'jūichi', 'じゅう (10) + いち (1)'],
        ['14', 'じゅうよん', 'jūyon', 'じゅう + よん'],
        ['17', 'じゅうなな', 'jūnana', 'じゅう + なな'],
        ['19', 'じゅうきゅう', 'jūkyū', 'じゅう + きゅう'],
        ['20', 'にじゅう', 'nijū', 'に (2) + じゅう (10)'],
        ['30', 'さんじゅう', 'sanjū', 'さん + じゅう'],
        ['40', 'よんじゅう', 'yonjū', 'よん + じゅう (không dùng しじゅう)'],
        ['55', 'ごじゅうご', 'gojūgo', 'ご + じゅう + ご'],
        ['70', 'ななじゅう', 'nanajū', 'なな + じゅう'],
        ['99', 'きゅうじゅうきゅう', 'kyūjūkyū', 'きゅう + じゅう + きゅう'],
      ],
    },
    {
      t: 'table',
      caption: 'Nói tuổi: số + さい — chú ý các ô in đậm (biến âm)',
      head: ['Tuổi', 'Đọc', 'Romaji', 'Ghi chú'],
      rows: [
        ['1', '**いっさい**', 'issai', 'いち + さい → いっさい (có っ)'],
        ['2 / 3', 'にさい / さんさい', 'nisai / sansai', ''],
        ['4', 'よんさい', 'yonsai', 'Không nói ~~しさい~~'],
        ['5 / 6 / 7', 'ごさい / ろくさい / ななさい', 'gosai / rokusai / nanasai', ''],
        ['8', '**はっさい**', 'hassai', 'はち + さい → はっさい'],
        ['9', 'きゅうさい', 'kyūsai', ''],
        ['10', '**じゅっさい** (じっさい)', 'jussai (jissai)', 'Hai cách đều đúng; じゅっさい phổ biến hơn trong hội thoại'],
        ['18', '**じゅうはっさい**', 'jūhassai', 'Số tận cùng 8 → はっさい'],
        ['20', '**はたち**', 'hatachi', 'Cách nói **riêng** cho 20 tuổi — tuổi trưởng thành ở Nhật'],
        ['21', '**にじゅういっさい**', 'nijūissai', 'Số tận cùng 1 → いっさい'],
        ['25', 'にじゅうごさい', 'nijūgosai', ''],
        ['30', '**さんじゅっさい**', 'sanjussai', 'Số tận cùng 0 (từ 30) → じゅっさい'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'ランさんは はたちです。', ro: 'Ran-san wa hatachi desu.', vi: 'Lan 20 tuổi.' },
        { en: 'たなかさんは にじゅういっさいです。', ro: 'Tanaka-san wa nijūissai desu.', vi: 'Anh Tanaka 21 tuổi.' },
        { en: 'キムさんは にじゅうにさいです。', ro: 'Kimu-san wa nijūnisai desu.', vi: 'Kim 22 tuổi.' },
        { en: 'すずきさんは さんじゅうはっさいです。', ro: 'Suzuki-san wa sanjūhassai desu.', vi: 'Anh Suzuki 38 tuổi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-tv-mcq',
      title: 'Từ vựng — chọn nghĩa đúng',
      items: [
        m('**りゅうがくせい** nghĩa là gì?', ['sinh viên đại học', 'du học sinh', 'giáo viên', 'nhân viên công ty'], 1, 'りゅうがくせい (留学生 LƯU HỌC SINH) = **du học sinh**.'),
        m('**かいしゃいん** nghĩa là gì?', ['công ty', 'nhân viên công ty', 'nhân viên cửa hàng', 'kỹ sư'], 1, 'かいしゃ (công ty) + いん (viên) = **nhân viên công ty**.'),
        m('**てんちょう** nghĩa là gì?', ['nhân viên cửa hàng', 'cửa hàng trưởng', 'bác sĩ', 'việc làm thêm'], 1, 'てんちょう (店長 ĐIẾM TRƯỞNG) = **cửa hàng trưởng**.'),
        m('**だれ** nghĩa là gì?', ['cái gì', 'ai', 'mấy tuổi', 'nước nào'], 1, 'だれ = **ai**. Lịch sự hơn: どなた.'),
        m('**おいくつ** dùng để hỏi gì?', ['tên', 'nước', 'tuổi (lịch sự)', 'nghề'], 2, 'おいくつですか = anh/chị **bao nhiêu tuổi** (lịch sự hơn なんさい).'),
        m('20 tuổi nói thế nào?', ['にじゅっさい (không bao giờ dùng)', 'はたち', 'にさい', 'じゅうにさい'], 1, '20 tuổi = **はたち** (cách nói riêng). にじゅっさい cũng gặp trong văn viết, nhưng nói chuyện hằng ngày dùng はたち.'),
        m('8 tuổi đọc là gì?', ['はちさい', 'はっさい', 'やっさい', 'はつさい'], 1, 'はち + さい → **はっさい** (biến âm, có っ).'),
        m('**ちがいます** dùng khi nào?', ['đồng ý', 'nói "không phải"', 'chào hỏi', 'cảm ơn'], 1, 'ちがいます = **không phải, sai rồi**.'),
        m('**こちらこそ** dùng để đáp lại câu nào?', ['いってきます', 'よろしく おねがいします', 'おやすみなさい', 'すみません'], 1, 'こちらこそ (chính tôi mới…) đáp lại **よろしく おねがいします** hoặc ありがとう.'),
        m('Tiếng Anh trong tiếng Nhật là gì?', ['アメリカ{語|ご}', 'イギリス{語|ご}', 'えいご', 'エングリッシュ'], 2, 'Tiếng Anh = **えいご** (英語). Không có ~~アメリカ語~~.'),
        m('Người Hàn Quốc là:', ['かんこく{語|ご}', 'かんこく{人|じん}', 'かんこく', 'かんこくさん'], 1, 'Tên nước + {人|じん} = người nước đó: **かんこく{人|じん}**.'),
        m('Từ nào **không nên** dùng để gọi người đang nói chuyện với mình?', ['ランさん', 'たなかさん', 'あなた', 'やまだ{先生|せんせい}'], 2, '**あなた** nghe xa cách; người Nhật gọi bằng **tên + さん** hoặc chức danh.'),
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b1-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp Bài 1 — N は N です, じゃありません, ですか, も, từ để hỏi',
  goal: 'Nói câu "N1 là N2" ở ba dạng khẳng định – phủ định – nghi vấn, trả lời có/không đúng phép, dùng も (cũng) và hỏi ai, người nước nào, mấy tuổi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Sáu điểm ngữ pháp của Bài 1',
      items: [
        '**① N1 は N2 です** — N1 là N2.',
        '**② N1 は N2 じゃありません** — N1 không phải là N2.',
        '**③ N1 は N2 ですか** — N1 là N2 phải không? → はい、そうです／いいえ、ちがいます.',
        '**④ N1 も N2 です** — N1 cũng là N2.',
        '**⑤ Từ để hỏi**: だれ／どなた (ai) · なん (gì) · なにじん (người nước nào) · なんさい／おいくつ (mấy tuổi).',
        '**⑥ Khung tự giới thiệu**: はじめまして → tên → 〜から きました → nghề → tuổi → よろしく おねがいします.',
      ],
    },
    {
      t: 'p',
      text: 'Ký hiệu dùng trong khoá: **N** = danh từ (người, vật, nơi chốn, số tuổi…). Tiếng Nhật xếp câu theo kiểu **chủ đề trước — thông tin sau — động từ/です cuối câu**. Khác tiếng Việt và tiếng Anh: **động từ luôn đứng cuối**, và các **trợ từ** (は, も, か…) đứng **sau** từ mà nó đánh dấu, giống cái "nhãn" dán sau từ.',
    },

    /* ── Mẫu 1 ── */
    { t: 'h', text: '① N1 は N2 です — "N1 là N2"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2 です',
          vi: 'N1 là N2 (câu khẳng định, lịch sự)',
          examples: [
            { en: 'わたしは ランです。', ro: 'watashi wa Ran desu.', vi: 'Tôi là Lan.' },
            { en: 'ランさんは ベトナム{人|じん}です。', ro: 'Ran-san wa Betonamujin desu.', vi: 'Lan là người Việt Nam.' },
            { en: 'たなかさんは {大学生|だいがくせい}です。', ro: 'Tanaka-san wa daigakusei desu.', vi: 'Anh Tanaka là sinh viên đại học.' },
            { en: 'マイクさんは エンジニアです。', ro: 'Maiku-san wa enjinia desu.', vi: 'Mike là kỹ sư.' },
            { en: 'キムさんは にじゅうにさいです。', ro: 'Kimu-san wa nijūnisai desu.', vi: 'Kim 22 tuổi.' },
            { en: 'すずきさんは てんちょうです。', ro: 'Suzuki-san wa tenchō desu.', vi: 'Anh Suzuki là cửa hàng trưởng.' },
          ],
        },
        {
          formula: '（N1 は）N2 です',
          vi: 'Bỏ "N1 は" khi người nghe đã biết đang nói về ai',
          examples: [
            { en: 'ランです。{学生|がくせい}です。', ro: 'Ran desu. gakusei desu.', vi: '(Tôi) là Lan. (Tôi) là sinh viên.' },
            { en: 'はたちです。', ro: 'hatachi desu.', vi: '(Tôi) 20 tuổi.' },
          ],
        },
        {
          formula: 'N1 は？',
          vi: 'Hỏi lại rút gọn: "Còn N1 thì sao?" — lên giọng ở cuối',
          examples: [
            { en: 'わたしは ベトナム{人|じん}です。キムさんは？', ro: 'watashi wa Betonamujin desu. Kimu-san wa?', vi: 'Mình là người Việt Nam. Còn Kim?' },
            { en: 'お{名前|なまえ}は？——マイクです。', ro: 'onamae wa? — Maiku desu.', vi: 'Tên anh là gì? — Tôi là Mike.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**は** là **trợ từ chủ đề**: nó dán sau N1 để báo "câu này đang nói về N1". Viết bằng chữ は nhưng **đọc là "wa"** (đã học ở Bài 0). **です** đứng cuối câu, nghĩa là "là", đồng thời làm câu **lịch sự** — dùng với người mới quen, thầy cô, khách, đồng nghiệp. です **không đổi** theo người nói (tôi/bạn/anh ấy), số lượng (một người/nhiều người) hay giới tính. Tiếng Nhật cũng **không có số nhiều** cho danh từ: {学生|がくせい} vừa là "một sinh viên" vừa là "các sinh viên".',
    },
    {
      t: 'table',
      caption: 'Tách câu わたしは ランです thành từng mảnh',
      head: ['Mảnh', 'Đọc', 'Vai trò', 'Nghĩa'],
      rows: [
        ['わたし', 'watashi', 'N1 — chủ đề', 'tôi'],
        ['は', '**wa** (không đọc "ha")', 'trợ từ chủ đề', '(nói về) …'],
        ['ラン', 'Ran', 'N2 — thông tin', 'Lan'],
        ['です', 'desu (う gần như câm: "đét-x")', 'kết câu lịch sự', 'là'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Lan giới thiệu Kim với Tanaka',
      lines: [
        { who: 'ラン', role: 'a', text: 'たなかさん、キムさんです。', ro: 'Tanaka-san, Kimu-san desu.', vi: 'Anh Tanaka, đây là Kim.' },
        { who: 'ラン', role: 'a', text: 'キムさんは かんこく{人|じん}です。りゅうがくせいです。', ro: 'Kimu-san wa Kankokujin desu. ryūgakusei desu.', vi: 'Kim là người Hàn Quốc. Bạn ấy là du học sinh.' },
        { who: 'たなか', role: 'b', text: 'はじめまして。たなかです。{大学生|だいがくせい}です。', ro: 'hajimemashite. Tanaka desu. daigakusei desu.', vi: 'Rất vui được gặp bạn. Mình là Tanaka. Mình là sinh viên đại học.' },
        { who: 'キム', role: 'c', text: 'はじめまして。キムです。{大学生|だいがくせい}じゃありません。りゅうがくせいです。', ro: 'hajimemashite. Kimu desu. daigakusei ja arimasen. ryūgakusei desu.', vi: 'Rất vui được gặp anh. Em là Kim. Em không phải sinh viên đại học. Em là du học sinh.' },
        { who: 'たなか', role: 'b', text: 'そうですか。よろしく おねがいします。', ro: 'sō desu ka. yoroshiku onegaishimasu.', vi: 'Thế à. Mong được làm quen.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế ① — chọn một người ở cột 1, ghép với một ô cùng hàng: [người] は [ô] です。 Mỗi hàng nói được 3 câu.',
      head: ['N1 (ai?)', 'Người nước nào', 'Làm gì', 'Mấy tuổi'],
      rows: [
        ['ランさん', 'ベトナム{人|じん}', 'りゅうがくせい', 'はたち'],
        ['キムさん', 'かんこく{人|じん}', '{学生|がくせい}', 'にじゅうにさい'],
        ['マイクさん', 'アメリカ{人|じん}', 'エンジニア', 'にじゅうごさい'],
        ['たなかさん', '{日本人|にほんじん}', '{大学生|だいがくせい}', 'にじゅういっさい'],
        ['すずきさん', '{日本人|にほんじん}', 'てんちょう', 'さんじゅうはっさい'],
        ['わたし', '(nước của bạn)＋{人|じん}', '(việc của bạn)', '(tuổi của bạn)'],
      ],
    },
    { t: 'rule', formula: 'N1 は N2 です', vi: 'Nói "N1 **là** N2" một cách lịch sự. は đọc **wa**; です luôn ở **cuối câu** và không đổi theo người.' },
    {
      t: 'note',
      title: 'Người Việt hay sai ở mẫu ①',
      items: [
        'Đọc trợ từ は thành "ha": ~~watashi ha~~ → **watashi wa**.',
        'Gắn さん cho chính mình: ~~わたしは ランさんです。~~ → **わたしは ランです。**',
        'Bỏ です vì tiếng Việt không cần "là": ~~わたしは {学生|がくせい}。~~ — thiếu です nghe cộc lốc (đó là thể thân mật, học ở Bài 20). Với người mới quen luôn kết bằng **です**.',
        'Nhầm **nước** với **người nước đó**: ~~キムさんは かんこくです。~~ → **キムさんは かんこく{人|じん}です。** (Kim là **người** Hàn).',
        'Lặp わたしは ở mọi câu: ~~わたしは ランです。わたしは {学生|がくせい}です。わたしは はたちです。~~ Nói わたしは **một lần**, các câu sau bỏ đi.',
        'Đặt です ở giữa câu theo trật tự tiếng Việt: ~~わたしは です ラン。~~ — です luôn ở **cuối**.',
      ],
    },

    /* ── Mẫu 2 ── */
    { t: 'h', text: '② N1 は N2 じゃありません — "N1 không phải là N2"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2 じゃありません',
          vi: 'N1 không phải (là) N2 — phủ định, dùng khi nói',
          examples: [
            { en: 'わたしは {中国人|ちゅうごくじん}じゃありません。', ro: 'watashi wa Chūgokujin ja arimasen.', vi: 'Tôi không phải người Trung Quốc.' },
            { en: 'マイクさんは {学生|がくせい}じゃありません。', ro: 'Maiku-san wa gakusei ja arimasen.', vi: 'Mike không phải sinh viên.' },
            { en: 'すずきさんは てんいんじゃありません。てんちょうです。', ro: 'Suzuki-san wa ten\'in ja arimasen. tenchō desu.', vi: 'Anh Suzuki không phải nhân viên. Anh ấy là cửa hàng trưởng.' },
            { en: 'たなかさんは にじゅっさいじゃありません。にじゅういっさいです。', ro: 'Tanaka-san wa nijussai ja arimasen. nijūissai desu.', vi: 'Anh Tanaka không phải 20 tuổi. Anh ấy 21 tuổi.' },
          ],
        },
        {
          formula: 'N1 は N2 ではありません',
          vi: 'Cùng nghĩa, trang trọng hơn — hay gặp trong văn viết, bài đọc, thông báo',
          examples: [
            { en: 'わたしは いしゃではありません。', ro: 'watashi wa isha de wa arimasen.', vi: 'Tôi không phải bác sĩ.' },
            { en: 'キムさんは {日本人|にほんじん}ではありません。', ro: 'Kimu-san wa Nihonjin de wa arimasen.', vi: 'Kim không phải người Nhật.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Phủ định của です là **じゃありません**: nó **thay hẳn** です, không giữ です lại. **じゃ** chính là **では** nói nhanh (では trong ではありません đọc "de wa" — は lại là trợ từ nên đọc wa). Khi nói chuyện dùng **じゃありません**; khi viết hoặc phát biểu trang trọng dùng **ではありません**. Ngoài đời bạn còn nghe **じゃないです** — cùng nghĩa, mềm hơn; khoá sẽ học dạng ない ở Bài 17.',
    },
    {
      t: 'table',
      caption: 'Khẳng định ↔ phủ định',
      head: ['Khẳng định', 'Phủ định (nói)', 'Phủ định (viết, trang trọng)'],
      rows: [
        ['{学生|がくせい}です', '{学生|がくせい}じゃありません', '{学生|がくせい}ではありません'],
        ['{日本人|にほんじん}です', '{日本人|にほんじん}じゃありません', '{日本人|にほんじん}ではありません'],
        ['エンジニアです', 'エンジニアじゃありません', 'エンジニアではありません'],
        ['はたちです', 'はたちじゃありません', 'はたちではありません'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Sửa lại khi người khác nói nhầm',
      lines: [
        { who: 'たなか', role: 'b', text: 'キムさんは {中国人|ちゅうごくじん}です。', ro: 'Kimu-san wa Chūgokujin desu.', vi: 'Kim là người Trung Quốc.' },
        { who: 'ラン', role: 'a', text: 'いいえ、キムさんは {中国人|ちゅうごくじん}じゃありません。かんこく{人|じん}です。', ro: 'iie, Kimu-san wa Chūgokujin ja arimasen. Kankokujin desu.', vi: 'Không, Kim không phải người Trung Quốc. Bạn ấy là người Hàn Quốc.' },
        { who: 'たなか', role: 'b', text: 'あ、すみません。', ro: 'a, sumimasen.', vi: 'À, xin lỗi.' },
        { who: 'たなか', role: 'b', text: 'ランさんは {大学生|だいがくせい}です。', ro: 'Ran-san wa daigakusei desu.', vi: 'Lan là sinh viên đại học.' },
        { who: 'ラン', role: 'a', text: 'いいえ、{大学生|だいがくせい}じゃありません。りゅうがくせいです。{学校|がっこう}は さくら{日本語学校|にほんごがっこう}です。', ro: 'iie, daigakusei ja arimasen. ryūgakusei desu. gakkō wa Sakura nihongo gakkō desu.', vi: 'Không, em không phải sinh viên đại học. Em là du học sinh. Trường em là trường tiếng Nhật Sakura.' },
        { who: 'たなか', role: 'b', text: 'そうですか。', ro: 'sō desu ka.', vi: 'Ra vậy.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế ② — đọc câu sai ở cột 1, sửa lại bằng じゃありません + câu đúng',
      head: ['Câu nhầm', 'Bạn sửa: …じゃありません', 'Câu đúng: …です'],
      rows: [
        ['マイクさんは イギリス{人|じん}です。', 'イギリス{人|じん}じゃありません。', 'アメリカ{人|じん}です。'],
        ['たなかさんは かいしゃいんです。', 'かいしゃいんじゃありません。', '{大学生|だいがくせい}です。'],
        ['ランさんは にじゅういっさいです。', 'にじゅういっさいじゃありません。', 'はたちです。'],
        ['やまだ{先生|せんせい}は かんこく{人|じん}です。', 'かんこく{人|じん}じゃありません。', '{日本人|にほんじん}です。'],
        ['すずきさんは {学生|がくせい}です。', '{学生|がくせい}じゃありません。', 'てんちょうです。'],
      ],
    },
    { t: 'rule', formula: 'N1 は N2 じゃありません（ではありません）', vi: '"N1 **không phải** là N2". じゃありません **thay** です; viết trang trọng dùng ではありません.' },
    {
      t: 'note',
      title: 'Người Việt hay sai ở mẫu ②',
      items: [
        'Giữ lại です: ~~{学生|がくせい}です じゃありません。~~ hoặc ~~{学生|がくせい}じゃありませんです。~~ → **{学生|がくせい}じゃありません。**',
        'Đặt "không" lên trước như tiếng Việt: ~~わたしは じゃありません {学生|がくせい}。~~ — phủ định luôn ở **cuối câu**.',
        'Đọc ではありません thành "de ha arimasen". は ở đây vẫn là trợ từ → **de wa arimasen**.',
        'Phủ định xong im lặng. Nói thêm câu đúng (…です) cho người nghe khỏi phải hỏi lại.',
      ],
    },

    /* ── Mẫu 3 ── */
    { t: 'h', text: '③ N1 は N2 ですか — câu hỏi có/không' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2 ですか',
          vi: 'N1 là N2 phải không? — thêm か sau です, lên giọng ở か',
          examples: [
            { en: 'ランさんは りゅうがくせいですか。', ro: 'Ran-san wa ryūgakusei desu ka.', vi: 'Lan là du học sinh à?' },
            { en: 'マイクさんは アメリカ{人|じん}ですか。', ro: 'Maiku-san wa Amerikajin desu ka.', vi: 'Mike là người Mỹ phải không?' },
            { en: 'すずきさんは てんちょうですか。', ro: 'Suzuki-san wa tenchō desu ka.', vi: 'Anh Suzuki là cửa hàng trưởng à?' },
            { en: 'キムさんは にじゅっさいですか。', ro: 'Kimu-san wa nijussai desu ka.', vi: 'Kim 20 tuổi à?' },
          ],
        },
        {
          formula: 'はい、そうです ／ はい、N2 です',
          vi: 'Trả lời CÓ: はい + そうです (đúng vậy) hoặc nhắc lại N2',
          examples: [
            { en: 'はい、そうです。', ro: 'hai, sō desu.', vi: 'Vâng, đúng vậy.' },
            { en: 'はい、アメリカ{人|じん}です。', ro: 'hai, Amerikajin desu.', vi: 'Vâng, (anh ấy) là người Mỹ.' },
          ],
        },
        {
          formula: 'いいえ、ちがいます ／ いいえ、N2 じゃありません',
          vi: 'Trả lời KHÔNG: いいえ + ちがいます (không phải) hoặc phủ định N2 — rồi nói thông tin đúng',
          examples: [
            { en: 'いいえ、ちがいます。にじゅうにさいです。', ro: 'iie, chigaimasu. nijūnisai desu.', vi: 'Không, không phải. (Bạn ấy) 22 tuổi.' },
            { en: 'いいえ、にじゅっさいじゃありません。にじゅうにさいです。', ro: 'iie, nijussai ja arimasen. nijūnisai desu.', vi: 'Không, không phải 20 tuổi. 22 tuổi.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**か** ở cuối câu biến câu kể thành **câu hỏi** — giống "…à?", "…phải không?" của tiếng Việt. Vì đã có か nên văn viết chuẩn dùng dấu **。**, không cần **？** (nhưng ngoài đời nhiều người vẫn viết ？). Khi nói, **lên giọng nhẹ** ở か. Trả lời: nói **はい** hoặc **いいえ** trước, rồi tới câu đầy đủ. **そうです / ちがいます** là cách trả lời gọn cho câu hỏi có dạng **N ですか** — không phải lặp lại danh từ.',
    },
    {
      t: 'table',
      caption: 'Bốn cách trả lời câu "マイクさんは エンジニアですか"',
      head: ['Trả lời', 'Romaji', 'Sắc thái'],
      rows: [
        ['はい、そうです。', 'hai, sō desu.', 'Có — gọn, tự nhiên nhất'],
        ['はい、エンジニアです。', 'hai, enjinia desu.', 'Có — nhắc lại thông tin, rõ ràng (tốt khi thi nói)'],
        ['いいえ、ちがいます。かいしゃいんです。', 'iie, chigaimasu. kaishain desu.', 'Không — gọn, rồi nói thông tin đúng'],
        ['いいえ、エンジニアじゃありません。かいしゃいんです。', 'iie, enjinia ja arimasen. kaishain desu.', 'Không — đầy đủ nhất'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: có và không',
      lines: [
        { who: 'すずき', role: 'b', text: 'ランさんは ベトナム{人|じん}ですか。', ro: 'Ran-san wa Betonamujin desu ka.', vi: 'Lan là người Việt Nam à?' },
        { who: 'ラン', role: 'a', text: 'はい、そうです。', ro: 'hai, sō desu.', vi: 'Vâng, đúng ạ.' },
        { who: 'すずき', role: 'b', text: '{大学生|だいがくせい}ですか。', ro: 'daigakusei desu ka.', vi: 'Em là sinh viên đại học à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、ちがいます。りゅうがくせいです。{学校|がっこう}は さくら{日本語学校|にほんごがっこう}です。', ro: 'iie, chigaimasu. ryūgakusei desu. gakkō wa Sakura nihongo gakkō desu.', vi: 'Dạ không ạ. Em là du học sinh. Trường em là trường tiếng Nhật Sakura.' },
        { who: 'ラン', role: 'a', text: 'すずきさんは てんちょうですか。', ro: 'Suzuki-san wa tenchō desu ka.', vi: 'Anh Suzuki là cửa hàng trưởng ạ?' },
        { who: 'すずき', role: 'b', text: 'はい、てんちょうです。よろしく。', ro: 'hai, tenchō desu. yoroshiku.', vi: 'Ừ, anh là cửa hàng trưởng. Mong được làm việc cùng em.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế ③ — hỏi bạn bên cạnh bằng cột 1, bạn trả lời bằng cột 2 hoặc 3 tuỳ sự thật',
      head: ['Hỏi: ～さんは ___ ですか', 'Có: はい、そうです／はい、___ です', 'Không: いいえ、___ じゃありません'],
      rows: [
        ['{学生|がくせい}ですか', 'はい、{学生|がくせい}です', 'いいえ、{学生|がくせい}じゃありません'],
        ['ベトナム{人|じん}ですか', 'はい、ベトナム{人|じん}です', 'いいえ、ベトナム{人|じん}じゃありません'],
        ['かいしゃいんですか', 'はい、かいしゃいんです', 'いいえ、かいしゃいんじゃありません'],
        ['はたちですか', 'はい、はたちです', 'いいえ、はたちじゃありません'],
        ['りゅうがくせいですか', 'はい、そうです', 'いいえ、ちがいます'],
      ],
    },
    { t: 'rule', formula: 'N1 は N2 ですか → はい、そうです ／ いいえ、ちがいます', vi: 'Thêm **か** cuối câu để hỏi. Trả lời bằng **はい / いいえ** trước, rồi nói đủ câu.' },
    {
      t: 'note',
      title: 'Người Việt hay sai ở mẫu ③',
      items: [
        'Chỉ đáp "はい" hoặc "いいえ" rồi thôi — nghe cộc. Luôn **はい／いいえ + câu đầy đủ**.',
        '~~いいえ、{学生|がくせい}です。~~ khi ý là "không phải sinh viên" → **いいえ、{学生|がくせい}じゃありません。**',
        'Hỏi bằng cách chỉ lên giọng, bỏ か: ~~{学生|がくせい}です？~~ — đó là kiểu nói thân mật. Câu hỏi lịch sự: **ですか**.',
        '**そうですか** (xuống giọng) không phải câu hỏi mà là "à, ra vậy". Đừng trả lời はい cho nó.',
        'Dùng ちがいます một mình nghe hơi gắt với người trên; nói mềm hơn: **いいえ、ちがいます。＋ thông tin đúng**.',
      ],
    },

    /* ── Mẫu 4 ── */
    { t: 'h', text: '④ N1 も N2 です — "N1 cũng là N2"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 も N2 です',
          vi: 'N1 CŨNG là N2 (giống thông tin vừa nói về người trước)',
          examples: [
            { en: 'キムさんは りゅうがくせいです。ランさんも りゅうがくせいです。', ro: 'Kimu-san wa ryūgakusei desu. Ran-san mo ryūgakusei desu.', vi: 'Kim là du học sinh. Lan cũng là du học sinh.' },
            { en: 'たなかさんは {日本人|にほんじん}です。すずきさんも {日本人|にほんじん}です。', ro: 'Tanaka-san wa Nihonjin desu. Suzuki-san mo Nihonjin desu.', vi: 'Anh Tanaka là người Nhật. Anh Suzuki cũng là người Nhật.' },
            { en: 'わたしも はたちです。', ro: 'watashi mo hatachi desu.', vi: 'Mình cũng 20 tuổi.' },
            { en: 'わたしも {学生|がくせい}です。', ro: 'watashi mo gakusei desu.', vi: 'Tôi cũng là sinh viên.' },
          ],
        },
        {
          formula: 'N1 も N2 じゃありません',
          vi: 'N1 CŨNG KHÔNG phải N2',
          examples: [
            { en: 'ランさんは {日本人|にほんじん}じゃありません。キムさんも {日本人|にほんじん}じゃありません。', ro: 'Ran-san wa Nihonjin ja arimasen. Kimu-san mo Nihonjin ja arimasen.', vi: 'Lan không phải người Nhật. Kim cũng không phải người Nhật.' },
          ],
        },
        {
          formula: 'N1 も N2 ですか',
          vi: 'N1 CŨNG là N2 à?',
          examples: [
            { en: 'マイクさんも りゅうがくせいですか。——いいえ、ちがいます。', ro: 'Maiku-san mo ryūgakusei desu ka. — iie, chigaimasu.', vi: 'Mike cũng là du học sinh à? — Không, không phải.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**も** là trợ từ "**cũng**". Nó đứng **đúng chỗ của は** — tức là **thay** は chứ không đi cùng: ~~ランさんはも~~ là sai. Chỉ dùng も khi thông tin **giống hệt** điều vừa nói về người trước. Nếu thông tin khác thì quay lại dùng は. Trong tiếng Việt "cũng" đứng sau chủ ngữ ("Lan **cũng** là…") — tiếng Nhật cũng thế: N1 **も** …',
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp với も (có và không)',
      lines: [
        { who: 'キム', role: 'c', text: 'わたしは りゅうがくせいです。ランさんも りゅうがくせいですか。', ro: 'watashi wa ryūgakusei desu. Ran-san mo ryūgakusei desu ka.', vi: 'Mình là du học sinh. Lan cũng là du học sinh à?' },
        { who: 'ラン', role: 'a', text: 'はい、わたしも りゅうがくせいです。', ro: 'hai, watashi mo ryūgakusei desu.', vi: 'Ừ, mình cũng là du học sinh.' },
        { who: 'キム', role: 'c', text: 'マイクさんも りゅうがくせいですか。', ro: 'Maiku-san mo ryūgakusei desu ka.', vi: 'Mike cũng là du học sinh à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、マイクさんは りゅうがくせいじゃありません。エンジニアです。', ro: 'iie, Maiku-san wa ryūgakusei ja arimasen. enjinia desu.', vi: 'Không, Mike không phải du học sinh. Anh ấy là kỹ sư.' },
        { who: 'キム', role: 'c', text: 'そうですか。わたしは にじゅうにさいです。ランさんも にじゅうにさいですか。', ro: 'sō desu ka. watashi wa nijūnisai desu. Ran-san mo nijūnisai desu ka.', vi: 'Thế à. Mình 22 tuổi. Lan cũng 22 tuổi à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、わたしは はたちです。', ro: 'iie, watashi wa hatachi desu.', vi: 'Không, mình 20 tuổi.' },
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: vì sao câu trả lời "không" quay lại dùng は',
      items: [
        'Kim hỏi "Mike **cũng** là du học sinh à?" — thông tin của Mike **khác** nên Lan trả lời bằng **は**: マイクさんは りゅうがくせいじゃありません.',
        'Lan 20 tuổi, khác Kim (22) → わたし**は** はたちです, không nói ~~わたしも はたちです~~.',
        'Quy tắc nhớ nhanh: **giống → も; khác → は**.',
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế ④ — câu 1 có sẵn, bạn nói câu 2 bằng も (thông tin giống) hoặc は (thông tin khác)',
      head: ['Câu 1', 'Người thứ hai', 'Câu 2'],
      rows: [
        ['ランさんは {学生|がくせい}です。', 'キムさん (sinh viên)', 'キムさんも {学生|がくせい}です。'],
        ['たなかさんは {日本人|にほんじん}です。', 'やまだ{先生|せんせい} (người Nhật)', 'やまだ{先生|せんせい}も {日本人|にほんじん}です。'],
        ['ランさんは はたちです。', 'わたし (20 tuổi)', 'わたしも はたちです。'],
        ['マイクさんは {学生|がくせい}じゃありません。', 'すずきさん (không phải SV)', 'すずきさんも {学生|がくせい}じゃありません。'],
        ['キムさんは かんこく{人|じん}です。', 'ランさん (người Việt)', 'ランさんは ベトナム{人|じん}です。(khác → は)'],
      ],
    },
    { t: 'rule', formula: 'N1 も N2 です ／ N1 も N2 じゃありません', vi: '**も** = "cũng", đứng **thay** は. Thông tin giống người trước → も; khác → は.' },
    {
      t: 'note',
      title: 'Người Việt hay sai ở mẫu ④',
      items: [
        'Ghép cả hai trợ từ: ~~わたしはも {学生|がくせい}です。~~ → **わたしも {学生|がくせい}です。**',
        'Đặt も ở cuối như "nữa": ~~わたしは {学生|がくせい}です も。~~ → も đứng **ngay sau N1**.',
        'Dùng も khi thông tin khác: ~~キムさんは かんこく{人|じん}です。ランさんも ベトナム{人|じん}です。~~ → ランさん**は** ベトナム{人|じん}です。',
      ],
    },

    /* ── Mẫu 5 ── */
    { t: 'h', text: '⑤ Từ để hỏi: だれ・どなた・なん・なにじん・なんさい・おいくつ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は だれ ですか ／ どなた ですか',
          vi: 'N là AI? (どなた lịch sự hơn)',
          examples: [
            { en: 'あの {人|ひと}は だれですか。——マイクさんです。', ro: 'ano hito wa dare desu ka. — Maiku-san desu.', vi: 'Người kia là ai? — Là anh Mike.' },
            { en: 'すみません、どなたですか。——すずきです。', ro: 'sumimasen, donata desu ka. — Suzuki desu.', vi: 'Xin lỗi, ai đấy ạ? — Tôi là Suzuki.' },
          ],
        },
        {
          formula: 'N は なにじん ですか',
          vi: 'N là người NƯỚC NÀO?',
          examples: [
            { en: 'キムさんは なにじんですか。——かんこく{人|じん}です。', ro: 'Kimu-san wa nanijin desu ka. — Kankokujin desu.', vi: 'Kim là người nước nào? — Người Hàn Quốc.' },
            { en: 'マイクさんは なにじんですか。——アメリカ{人|じん}です。', ro: 'Maiku-san wa nanijin desu ka. — Amerikajin desu.', vi: 'Mike là người nước nào? — Người Mỹ.' },
          ],
        },
        {
          formula: 'N は {何|なん}さい ですか ／ おいくつ ですか',
          vi: 'N MẤY TUỔI? (おいくつ lịch sự hơn)',
          examples: [
            { en: 'たなかさんは {何|なん}さいですか。——にじゅういっさいです。', ro: 'Tanaka-san wa nansai desu ka. — nijūissai desu.', vi: 'Anh Tanaka mấy tuổi? — 21 tuổi.' },
            { en: 'しつれいですが、おいくつですか。——さんじゅうはっさいです。', ro: 'shitsurei desu ga, oikutsu desu ka. — sanjūhassai desu.', vi: 'Xin lỗi, anh bao nhiêu tuổi ạ? — 38 tuổi.' },
          ],
        },
        {
          formula: 'N は {何|なん} ですか',
          vi: 'N là GÌ?',
          examples: [
            { en: 'おしごとは {何|なん}ですか。——てんいんです。', ro: 'oshigoto wa nan desu ka. — ten\'in desu.', vi: 'Công việc của bạn là gì? — Tôi là nhân viên cửa hàng.' },
            { en: '「さくら」は {何|なん}ですか。——はなです。', ro: '"sakura" wa nan desu ka. — hana desu.', vi: '"Sakura" là gì? — Là (một loài) hoa.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Cách đặt câu hỏi có từ để hỏi **rất dễ**: lấy câu trả lời, **thay phần thông tin** bằng từ để hỏi, thêm **か**. Ví dụ: キムさんは **かんこく{人|じん}**です → キムさんは **なにじん**ですか. Trật tự câu **không đổi** — khác tiếng Anh phải đảo từ để hỏi lên đầu. Câu hỏi có từ để hỏi **không trả lời bằng はい／いいえ** — trả lời thẳng thông tin.',
    },
    {
      t: 'table',
      caption: 'Muốn hỏi gì — dùng từ nào',
      head: ['Muốn biết', 'Từ để hỏi', 'Câu hỏi', 'Trả lời mẫu'],
      rows: [
        ['Tên', 'お{名前|なまえ}は？ (rút gọn)', 'お{名前|なまえ}は？', 'ランです。'],
        ['Là ai', 'だれ ／ どなた', 'あの {人|ひと}は だれですか。', 'たなかさんです。'],
        ['Người nước nào', 'なにじん (hoặc お{国|くに}は？)', 'キムさんは なにじんですか。', 'かんこく{人|じん}です。'],
        ['Làm nghề gì', '{何|なん}', 'おしごとは {何|なん}ですか。', 'エンジニアです。'],
        ['Mấy tuổi', '{何|なん}さい ／ おいくつ', 'おいくつですか。', 'にじゅうごさいです。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi thông tin người mới',
      lines: [
        { who: 'たなか', role: 'b', text: 'ランさん、あの {人|ひと}は だれですか。', ro: 'Ran-san, ano hito wa dare desu ka.', vi: 'Lan ơi, người kia là ai thế?' },
        { who: 'ラン', role: 'a', text: 'キムさんです。', ro: 'Kimu-san desu.', vi: 'Là Kim.' },
        { who: 'たなか', role: 'b', text: 'キムさんは なにじんですか。', ro: 'Kimu-san wa nanijin desu ka.', vi: 'Kim là người nước nào?' },
        { who: 'ラン', role: 'a', text: 'かんこく{人|じん}です。', ro: 'Kankokujin desu.', vi: 'Người Hàn Quốc.' },
        { who: 'たなか', role: 'b', text: '{何|なん}さいですか。', ro: 'nansai desu ka.', vi: 'Bạn ấy mấy tuổi?' },
        { who: 'ラン', role: 'a', text: 'にじゅうにさいです。', ro: 'nijūnisai desu.', vi: '22 tuổi.' },
        { who: 'たなか', role: 'b', text: 'キムさんも {大学生|だいがくせい}ですか。', ro: 'Kimu-san mo daigakusei desu ka.', vi: 'Kim cũng là sinh viên đại học à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、{大学生|だいがくせい}じゃありません。りゅうがくせいです。', ro: 'iie, daigakusei ja arimasen. ryūgakusei desu.', vi: 'Không, không phải sinh viên đại học. Là du học sinh.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế ⑤ — biến câu kể thành câu hỏi: thay phần in đậm bằng từ để hỏi',
      head: ['Câu kể', 'Câu hỏi'],
      rows: [
        ['あの {人|ひと}は **たなかさん**です。', 'あの {人|ひと}は **だれ**ですか。'],
        ['マイクさんは **アメリカ{人|じん}**です。', 'マイクさんは **なにじん**ですか。'],
        ['キムさんは **にじゅうにさい**です。', 'キムさんは **{何|なん}さい**ですか。'],
        ['すずきさんは **さんじゅうはっさい**です。', 'すずきさんは **おいくつ**ですか。(lịch sự)'],
        ['おしごとは **エンジニア**です。', 'おしごとは **{何|なん}**ですか。'],
      ],
    },
    { t: 'rule', formula: 'N は [だれ／なにじん／なんさい／なん] ですか', vi: 'Thay thông tin cần hỏi bằng từ để hỏi, giữ nguyên trật tự, thêm **か**. Trả lời thẳng — **không** dùng はい／いいえ.' },
    {
      t: 'note',
      title: 'Người Việt hay sai ở mẫu ⑤',
      items: [
        'Trả lời はい cho câu có từ để hỏi: なにじんですか —— ~~はい、ベトナム{人|じん}です~~ → **ベトナム{人|じん}です**.',
        'Đưa từ để hỏi lên đầu như tiếng Anh: ~~だれは あの {人|ひと}ですか~~ → **あの {人|ひと}は だれですか**.',
        'Hỏi tuổi thầy cô, khách hàng bằng なんさい — **thất lễ**. Với người trên dùng おいくつ, và tốt nhất là không hỏi.',
        'Đọc {何|なん}さい thành "nanisai": trước さい đọc **なん** → nansai.',
        'Quên か: ~~キムさんは なにじんです。~~ — thiếu か thì không thành câu hỏi.',
      ],
    },

    /* ── Mẫu 6 ── */
    { t: 'h', text: '⑥ Ghép lại: khung tự giới thiệu' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'はじめまして。＋ [tên] です。',
          vi: 'Mở đầu: chào lần đầu + tên (không kèm さん)',
          examples: [
            { en: 'はじめまして。ランです。', ro: 'hajimemashite. Ran desu.', vi: 'Rất vui được gặp. Tôi là Lan.' },
            { en: 'はじめまして。たなかです。', ro: 'hajimemashite. Tanaka desu.', vi: 'Rất vui được gặp. Tôi là Tanaka.' },
          ],
        },
        {
          formula: '[nước/thành phố] から きました。',
          vi: 'Tôi đến từ … (cụm cố định)',
          examples: [
            { en: 'ベトナムから きました。', ro: 'Betonamu kara kimashita.', vi: 'Tôi đến từ Việt Nam.' },
            { en: 'ハノイから きました。', ro: 'Hanoi kara kimashita.', vi: 'Tôi đến từ Hà Nội.' },
          ],
        },
        {
          formula: '[nghề] です。[tuổi] です。',
          vi: 'Thông tin thêm — mỗi câu một ý, bỏ わたしは',
          examples: [
            { en: 'りゅうがくせいです。はたちです。', ro: 'ryūgakusei desu. hatachi desu.', vi: 'Tôi là du học sinh. Tôi 20 tuổi.' },
            { en: 'エンジニアです。にじゅうごさいです。', ro: 'enjinia desu. nijūgosai desu.', vi: 'Tôi là kỹ sư. Tôi 25 tuổi.' },
          ],
        },
        {
          formula: 'どうぞ よろしく おねがいします。',
          vi: 'Kết: mong được giúp đỡ (cúi chào nhẹ)',
          examples: [
            { en: 'どうぞ よろしく おねがいします。', ro: 'dōzo yoroshiku onegaishimasu.', vi: 'Rất mong được giúp đỡ.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Một bài tự giới thiệu chuẩn chỉ cần **4–6 câu ngắn**, mỗi câu kết bằng です hoặc ました. Người Nhật đánh giá cao **ngắn gọn và đúng phép** hơn là dài. Thứ tự hay dùng: **chào → tên → từ đâu đến → nghề / trường → (tuổi) → kết**. Ở Bài 2 bạn sẽ học の để nói "sinh viên **của** trường Sakura", "nhân viên **của** công ty ABC".',
    },
    {
      t: 'examples',
      items: [
        { en: 'はじめまして。キムです。かんこくから きました。りゅうがくせいです。どうぞ よろしく おねがいします。', ro: 'hajimemashite. Kimu desu. Kankoku kara kimashita. ryūgakusei desu. dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Kim. Tôi đến từ Hàn Quốc. Tôi là du học sinh. Rất mong được giúp đỡ.' },
        { en: 'はじめまして。すずきです。てんちょうです。よろしく おねがいします。', ro: 'hajimemashite. Suzuki desu. tenchō desu. yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Suzuki. Tôi là cửa hàng trưởng. Mong được làm việc cùng.' },
      ],
    },
    { t: 'rule', formula: 'はじめまして。→ ～です。→ ～から きました。→ ～です。→ よろしく おねがいします。', vi: 'Khung tự giới thiệu 5 bước — thay phần ～ bằng thông tin của bạn.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc khi tự giới thiệu',
      items: [
        'Nói tên mình kèm さん: ~~ランさんです~~ → **ランです**.',
        'Nói はじめまして với người đã gặp hôm qua — chỉ dùng **lần đầu**.',
        'Đọc một mạch không ngắt. Ngắt nhẹ ở mỗi dấu 。, cúi chào nhẹ ở câu cuối.',
        'Kể quá dài, quá nhiều chi tiết. 4–6 câu là đủ.',
      ],
    },

    /* ── Tổng kết + luyện tập ── */
    { t: 'h', text: 'Tổng kết ngữ pháp Bài 1' },
    {
      t: 'table',
      head: ['Mẫu', 'Công thức', 'Ví dụ', 'Dùng khi'],
      rows: [
        ['①', 'N1 は N2 です', 'わたしは ランです。', 'Nói "N1 là N2"'],
        ['②', 'N1 は N2 じゃありません', 'わたしは {日本人|にほんじん}じゃありません。', 'Nói "không phải"'],
        ['③', 'N1 は N2 ですか', 'ランさんは {学生|がくせい}ですか。——はい、そうです。', 'Hỏi có/không'],
        ['④', 'N1 も N2 です', 'わたしも {学生|がくせい}です。', 'Nói "cũng"'],
        ['⑤', 'N は だれ／なにじん／{何|なん}さい ですか', 'キムさんは なにじんですか。', 'Hỏi thông tin'],
        ['⑥', 'はじめまして → … → よろしく', 'はじめまして。ランです。…', 'Tự giới thiệu'],
      ],
    },
    {
      t: 'build',
      id: 'b1-np-ghep',
      title: 'Ghép câu — bấm các mảnh theo đúng thứ tự',
      items: [
        { vi: 'Tôi là Lan.', chips: ['わたしは', 'ランです。', 'ランさんです。', 'も'], answer: ['わたしは', 'ランです。'], ro: 'watashi wa Ran desu.' },
        { vi: 'Lan là người Việt Nam.', chips: ['ベトナム{人|じん}', 'ランさんは', 'です。', 'ベトナム'], answer: ['ランさんは', 'ベトナム{人|じん}', 'です。'], ro: 'Ran-san wa Betonamujin desu.' },
        { vi: 'Mike không phải sinh viên.', chips: ['{学生|がくせい}', 'マイクさんは', 'じゃありません。', 'です。'], answer: ['マイクさんは', '{学生|がくせい}', 'じゃありません。'], ro: 'Maiku-san wa gakusei ja arimasen.' },
        { vi: 'Anh Tanaka là sinh viên đại học à?', chips: ['ですか。', 'たなかさんは', '{大学生|だいがくせい}', 'だれ'], answer: ['たなかさんは', '{大学生|だいがくせい}', 'ですか。'], ro: 'Tanaka-san wa daigakusei desu ka.' },
        { vi: 'Kim cũng là du học sinh.', chips: ['キムさん', 'も', 'は', 'りゅうがくせいです。'], answer: ['キムさん', 'も', 'りゅうがくせいです。'], ro: 'Kimu-san mo ryūgakusei desu.' },
        { vi: 'Người kia là ai?', chips: ['だれですか。', 'あの {人|ひと}は', 'なにじんですか。', 'も'], answer: ['あの {人|ひと}は', 'だれですか。'], ro: 'ano hito wa dare desu ka.' },
        { vi: 'Mike là người nước nào?', chips: ['マイクさんは', 'なにじん', 'ですか。', '{何|なん}さい'], answer: ['マイクさんは', 'なにじん', 'ですか。'], ro: 'Maiku-san wa nanijin desu ka.' },
        { vi: 'Không, không phải. Tôi là kỹ sư.', chips: ['いいえ、', 'ちがいます。', 'エンジニアです。', 'はい、', 'そうです。'], answer: ['いいえ、', 'ちがいます。', 'エンジニアです。'], ro: 'iie, chigaimasu. enjinia desu.' },
        { vi: 'Xin lỗi, anh bao nhiêu tuổi ạ?', chips: ['しつれいですが、', 'おいくつ', 'ですか。', 'だれ'], answer: ['しつれいですが、', 'おいくつ', 'ですか。'], ro: 'shitsurei desu ga, oikutsu desu ka.' },
        { vi: 'Tôi đến từ Việt Nam.', chips: ['ベトナム', 'から', 'きました。', 'です。'], answer: ['ベトナム', 'から', 'きました。'], ro: 'Betonamu kara kimashita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b1-np-dien',
      title: 'Điền trợ từ hoặc đuôi câu vào chỗ trống',
      kind: 'fill',
      grammar: 'は (chủ đề) · も (cũng) · です／じゃありません／ですか',
      items: [
        { q: 'わたし ___ ランです。', hint: 'trợ từ chủ đề', answers: ['は', 'wa'] },
        { q: 'キムさんは {学生|がくせい}です。ランさん ___ {学生|がくせい}です。(cũng)', hint: 'cũng', answers: ['も', 'mo'] },
        { q: 'マイクさんは {日本人|にほんじん} ___。(không phải)', hint: 'phủ định của です', answers: ['じゃありません', 'ではありません', 'ja arimasen', 'de wa arimasen'] },
        { q: 'たなかさんは {大学生|だいがくせい} ___。(câu hỏi)', hint: 'です + trợ từ hỏi', answers: ['ですか', 'desu ka'] },
        { q: 'ランさんは ベトナム{人|じん}ですか。——はい、___ です。', hint: 'đúng vậy', answers: ['そう', 'sō', 'sou'] },
        { q: 'キムさんは {中国人|ちゅうごくじん}ですか。——いいえ、___。', hint: 'không phải', answers: ['ちがいます', 'chigaimasu'] },
        { q: 'あの {人|ひと}は ___ ですか。——たなかさんです。', hint: 'ai', answers: ['だれ', 'どなた', 'dare', 'donata'] },
        { q: 'マイクさんは ___ ですか。——アメリカ{人|じん}です。', hint: 'người nước nào', answers: ['なにじん', '何人', 'nanijin'] },
        { q: 'たなかさんは ___ ですか。——にじゅういっさいです。', hint: 'mấy tuổi', answers: ['なんさい', '何さい', '何歳', 'おいくつ', 'nansai', 'oikutsu'] },
        { q: 'ベトナム ___ きました。', hint: 'cụm "đến từ"', answers: ['から', 'kara'] },
        { q: '20 tuổi = ___', hint: 'cách nói riêng', answers: ['はたち', 'hatachi', '二十歳'] },
        { q: '8 tuổi = ___', hint: 'số + さい, có biến âm', answers: ['はっさい', 'hassai'] },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-np-mcq',
      title: 'Chọn câu đúng',
      items: [
        m('Câu nào **đúng**?', ['わたしは ランさんです。', 'わたしは ランです。', 'わたしも は ランです。', 'ランです わたしは。'], 1, 'Không gắn さん cho tên mình; は đứng sau わたし; です cuối câu.'),
        m('"Tôi không phải người Nhật." là:', ['わたしは {日本人|にほんじん}です。', 'わたしは {日本人|にほんじん}じゃありません。', 'わたしは {日本人|にほんじん}じゃありませんです。', 'わたしは じゃありません {日本人|にほんじん}。'], 1, 'じゃありません **thay** です và đứng cuối câu.'),
        m('キムさんは かんこく{人|じん}ですか。Trả lời **có**:', ['いいえ、そうです。', 'はい、そうです。', 'はい、ちがいます。', 'そうですか。'], 1, 'Có → **はい、そうです**.'),
        m('マイクさんは {学生|がくせい}ですか。Mike là kỹ sư. Trả lời:', ['はい、{学生|がくせい}です。', 'いいえ、{学生|がくせい}です。', 'いいえ、{学生|がくせい}じゃありません。エンジニアです。', 'はい、エンジニアです。'], 2, 'Không → **いいえ、～じゃありません** + thông tin đúng.'),
        m('Kim là du học sinh. Lan **cũng** là du học sinh. Câu về Lan:', ['ランさんは りゅうがくせいです。', 'ランさんも りゅうがくせいです。', 'ランさんはも りゅうがくせいです。', 'ランさんも りゅうがくせいじゃありません。'], 1, 'Thông tin giống → **も** (thay は, không ghép はも).'),
        m('キムさんは なにじんですか。Câu trả lời đúng:', ['はい、かんこく{人|じん}です。', 'かんこく{人|じん}です。', 'いいえ、かんこく{人|じん}です。', 'そうです。'], 1, 'Câu có từ để hỏi → trả lời **thẳng thông tin**, không dùng はい／いいえ.'),
        m('Hỏi tuổi anh Suzuki (người lớn hơn) một cách lịch sự:', ['すずきさんは {何|なん}さいですか。', 'しつれいですが、おいくつですか。', 'すずきさんは だれですか。', 'すずきさんは なにじんですか。'], 1, 'Với người trên: **しつれいですが、おいくつですか**.'),
        m('Câu "ランさんは？" nghĩa là gì?', ['Lan là ai?', 'Còn Lan thì sao?', 'Lan có phải không?', 'Lan ở đâu?'], 1, 'N は？ (lên giọng) = **còn N thì sao?** — hỏi lại đúng điều vừa nói.'),
        m('Câu nào **sai**?', ['わたしも はたちです。', 'あの {人|ひと}は だれですか。', 'だれは あの {人|ひと}ですか。', 'たなかさんは {日本人|にほんじん}です。'], 2, 'Từ để hỏi đứng đúng chỗ thông tin, **không** đưa lên đầu: あの {人|ひと}は だれですか.'),
        m('Trong ではありません, chữ は đọc là gì?', ['ha', 'wa', 'ba'], 1, 'Vẫn là trợ từ → **de wa arimasen**.'),
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const KANJI: Lesson = {
  id: 'b1-kanji',
  kind: 'kanji',
  title: 'Chữ Hán Bài 1 — 人 日 本 学 生 先 名 国',
  goal: 'Nhận ra và đọc đúng 8 chữ Hán cơ bản xuất hiện khi tự giới thiệu, viết tay được 6 chữ (人 日 本 学 生 先), biết thế nào là âm On, âm Kun và âm Hán Việt.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Hôm nay học gì',
      items: [
        'Mỗi chữ Hán có **nghĩa** và thường có **hai kiểu đọc**: âm **On** (âm gốc Hán, gần âm Hán Việt) và âm **Kun** (từ thuần Nhật).',
        'Người Việt có lợi thế lớn: **âm Hán Việt** giúp đoán nghĩa — {学生|がくせい} = HỌC SINH, {先生|せんせい} = TIÊN SINH.',
        '8 chữ của bài: **人 日 本 学 生 先** (học viết) · **名 国** (chỉ cần nhận ra).',
        'Học chữ **theo từ** ({学生|がくせい}, {日本人|にほんじん}), không học âm rời từng chữ.',
      ],
    },
    { t: 'h', text: '1. Âm On, âm Kun và âm Hán Việt' },
    {
      t: 'p',
      text: 'Chữ Hán vào Nhật từ Trung Quốc khoảng 1.500 năm trước. Người Nhật vừa **mượn luôn cách đọc** của người Hoa thời đó — gọi là **âm On** (音読み おんよみ), vừa **gán chữ đó cho từ tiếng Nhật sẵn có** cùng nghĩa — gọi là **âm Kun** (訓読み くんよみ). Tiếng Việt cũng mượn chữ Hán theo cách tương tự, tạo ra **âm Hán Việt**. Vì cùng gốc, âm On và âm Hán Việt **nhiều khi nghe gần nhau**: 学 ガク ↔ HỌC, 国 コク ↔ QUỐC, 先 セン ↔ TIÊN.',
    },
    {
      t: 'table',
      caption: 'Hai kiểu đọc — nhìn vào từ để biết đọc kiểu nào',
      head: ['Kiểu đọc', 'Thường gặp khi', 'Ví dụ với chữ 人'],
      rows: [
        ['Âm On (sách in katakana)', 'Chữ đứng **ghép** với chữ Hán khác', '{日本人|にほんじん} (ジン) — người Nhật'],
        ['Âm Kun (sách in hiragana)', 'Chữ đứng **một mình**, hoặc có đuôi hiragana', '{人|ひと} — người'],
      ],
    },
    { t: 'h', text: '2. Tám chữ của Bài 1' },
    {
      t: 'table',
      caption: 'Mức: ✍ = học viết tay · 👁 = chỉ cần nhìn ra và đọc được',
      head: ['Chữ', 'Hán Việt', 'On', 'Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['人', 'NHÂN', 'ジン・ニン', 'ひと', 'người', '{日本人|にほんじん} người Nhật · {人|ひと} người', '✍'],
        ['日', 'NHẬT', 'ニチ・ジツ', 'ひ・か', 'mặt trời, ngày', '{日本|にほん} Nhật Bản', '✍'],
        ['本', 'BẢN (BỔN)', 'ホン', 'もと', 'gốc; sách', '{日本|にほん} Nhật Bản · {本|ほん} quyển sách', '✍'],
        ['学', 'HỌC', 'ガク', 'まな(ぶ)', 'học', '{学生|がくせい} sinh viên · {大学|だいがく} đại học · {学校|がっこう} trường học', '✍'],
        ['生', 'SINH', 'セイ・ショウ', 'い(きる)・う(まれる)', 'sống, sinh ra', '{学生|がくせい} sinh viên · {先生|せんせい} giáo viên', '✍'],
        ['先', 'TIÊN', 'セン', 'さき', 'trước', '{先生|せんせい} thầy, cô giáo', '✍'],
        ['名', 'DANH', 'メイ・ミョウ', 'な', 'tên', 'お{名前|なまえ} tên (của bạn)', '👁'],
        ['国', 'QUỐC', 'コク', 'くに', 'đất nước', 'お{国|くに} nước (của bạn) · {中国|ちゅうごく} Trung Quốc', '👁'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bằng hình',
      items: [
        '**人** — một người đứng dang **hai chân**.',
        '**日** — **mặt trời** vẽ trong khung, nét ngang giữa là tia sáng. Mặt trời mọc lên mỗi **ngày**.',
        '**本** — cây **木** thêm một vạch ngang ở **gốc** → "gốc, nguồn". Sách là "gốc" của tri thức → {本|ほん} = quyển sách. {日本|にほん} = "gốc của mặt trời" — nước ở phía mặt trời mọc.',
        '**学** — đứa trẻ **子** ngồi dưới **mái nhà** 冖, phía trên là ánh đèn → trẻ con ngồi trong nhà **học**.',
        '**生** — mầm cây nhú lên khỏi **mặt đất** (nét ngang dưới cùng) → **sống, sinh ra**.',
        '**先** — phần dưới 儿 là **đôi chân** đang bước, đi lên **trước** → {先生|せんせい} = người "sinh ra trước", người đi trước dẫn đường.',
        '**名** — **夕** (buổi tối) + **口** (cái miệng): tối trời không nhìn rõ mặt, phải **gọi tên** nhau.',
        '**国** — viên ngọc **玉** (của vua) nằm trong **khung biên giới** 囗 → **đất nước**.',
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận — đọc nhầm chữ quen',
      items: [
        '{日本|にほん}: chữ 日 ở đây đọc **に** (rút từ ニチ), không đọc ~~にちほん~~. Đây là từ đặc biệt — cứ nhớ cả từ.',
        '{学校|がっこう}: ガク + コウ → **がっこう** (ク biến thành っ). Không đọc ~~がくこう~~.',
        '{人|ひと} / ～{人|じん} / ～{人|にん}: đứng một mình đọc **ひと**; sau tên nước đọc **じん**; khi đếm người (Bài 11) đọc **にん**.',
        '{先生|せんせい}: 生 ở đây đọc **せい** (kéo dài), không đọc ~~せんせ~~ ngắn.',
      ],
    },
    { t: 'h', text: '3. Đọc chữ Hán không có furigana' },
    {
      t: 'readkanji',
      id: 'b1-kanji-doc',
      title: 'Đọc to từng câu — rồi bấm hiện cách đọc để tự chấm',
      note: 'Câu hiện chữ Hán trần như đề thi. Đọc to cả câu, nhớ は đọc wa. Sai chữ nào thì xem lại bảng ở trên.',
      items: [
        { text: '{日本|にほん}', ro: 'Nihon', vi: 'Nhật Bản' },
        { text: '{日本人|にほんじん}です。', ro: 'Nihonjin desu.', vi: 'Là người Nhật.' },
        { text: 'わたしは {学生|がくせい}です。', ro: 'watashi wa gakusei desu.', vi: 'Tôi là sinh viên.' },
        { text: 'やまだ{先生|せんせい}は {日本人|にほんじん}です。', ro: 'Yamada-sensei wa Nihonjin desu.', vi: 'Cô Yamada là người Nhật.' },
        { text: 'たなかさんは {大学生|だいがくせい}です。', ro: 'Tanaka-san wa daigakusei desu.', vi: 'Anh Tanaka là sinh viên đại học.' },
        { text: '{大学|だいがく}は さくら{大学|だいがく}です。', ro: 'daigaku wa Sakura daigaku desu.', vi: 'Trường đại học là Đại học Sakura.' },
        { text: 'お{名前|なまえ}は？', ro: 'onamae wa?', vi: 'Tên bạn là gì?' },
        { text: 'お{国|くに}は？', ro: 'okuni wa?', vi: 'Bạn đến từ nước nào?' },
        { text: 'キムさんは {中国人|ちゅうごくじん}じゃありません。', ro: 'Kimu-san wa Chūgokujin ja arimasen.', vi: 'Kim không phải người Trung Quốc.' },
        { text: 'あの {人|ひと}は だれですか。', ro: 'ano hito wa dare desu ka.', vi: 'Người kia là ai?' },
        { text: '{学校|がっこう}は さくら{日本語学校|にほんごがっこう}です。', ro: 'gakkō wa Sakura nihongo gakkō desu.', vi: 'Trường là trường tiếng Nhật Sakura.' },
        { text: '{先生|せんせい}も {日本人|にほんじん}です。', ro: 'sensei mo Nihonjin desu.', vi: 'Cô giáo cũng là người Nhật.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-kanji-mcq',
      title: 'Chọn cách đọc đúng của từ gạch chân (dạng đề JLPT 漢字読み)',
      items: [
        m('**{学生|がくせい}**', ['がくせ', 'がくせい', 'がっせい', 'かくせい'], 1, '学 ガク + 生 セイ → **がくせい** (sinh viên).'),
        m('**{先生|せんせい}**', ['せんせ', 'せんせい', 'さきせい', 'せいせん'], 1, '先 セン + 生 セイ → **せんせい**.'),
        m('**{日本|にほん}**', ['にちほん', 'ひほん', 'にほん', 'にっぽんじん'], 2, '{日本|にほん} — chữ 日 ở đây đọc **に**.'),
        m('**{人|ひと}** (đứng một mình)', ['じん', 'にん', 'ひと', 'ひど'], 2, 'Đứng một mình → âm Kun **ひと**.'),
        m('**{大学|だいがく}**', ['だいがく', 'たいがく', 'だいかく', 'おおがく'], 0, '大 ダイ + 学 ガク → **だいがく**.'),
        m('**{学校|がっこう}**', ['がくこう', 'がっこう', 'がこう', 'がっこ'], 1, 'ガク + コウ → **がっこう** (ク thành っ).'),
        m('**お{名前|なまえ}**', ['おなまえ', 'おめいまえ', 'おなまい', 'おなめ'], 0, '名 な + 前 まえ → お**なまえ**.'),
        m('**{中国|ちゅうごく}**', ['ちゅうこく', 'ちゅうごく', 'なかくに', 'ちゅごく'], 1, '中 チュウ + 国 コク → **ちゅうごく** (コ thành ゴ khi ghép).'),
      ],
    },
    { t: 'h', text: '4. Tập viết tay' },
    {
      t: 'p',
      text: 'Bấm **▶ Thứ tự nét** xem từng nét, tô theo chữ mờ rồi tự viết. Chữ Hán viết **vuông vức**, mọi chữ to bằng nhau. Quy tắc: **trên → dưới, trái → phải, ngang trước dọc sau**; nét bao ngoài (như khung của 日) viết trước, nét đóng đáy viết sau cùng.',
    },
    { t: 'write', id: 'b1-kanji-viet', title: 'Viết 6 chữ ✍ của Bài 1', chars: ['人', '日', '本', '学', '生', '先'], note: '人 2 nét · 日 4 nét · 本 5 nét · 学 8 nét · 生 5 nét · 先 6 nét. Đếm nét khi viết để không thiếu.' },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b1-nghe',
  kind: 'listening',
  title: 'Luyện nghe Bài 1 — dạng đề JLPT N5',
  goal: 'Nghe và bắt được tên, nước, công việc, tuổi trong hội thoại tự giới thiệu; chọn đúng câu nói và câu đáp lại trong các tình huống làm quen.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách làm bài nghe',
      items: [
        'Đọc **câu hỏi trước** khi nghe — biết mình cần bắt thông tin gì.',
        'Bấm **nghe cả bài** 2 lần: lần 1 chỉ nghe, lần 2 vừa nghe vừa ghi chú.',
        'Làm câu hỏi xong mới mở **lời thoại** để kiểm tra; câu nào sai thì nghe lại đúng dòng đó.',
        'Bẫy hay gặp: người nói **đoán sai rồi được sửa** (いいえ、ちがいます…) — đáp án là thông tin **sau** いいえ.',
      ],
    },
    {
      t: 'table',
      caption: 'Bốn dạng đề nghe JLPT N5 (聴解) — Bài 1 luyện ba dạng; dạng かだいりかい cần động từ nên bắt đầu từ các bài sau',
      head: ['Dạng', 'Tên Nhật', 'Làm gì', 'Bài nghe'],
      rows: [
        ['Hiểu vấn đề', 'かだいりかい (課題理解)', 'Nghe hội thoại, chọn việc người nói sẽ làm tiếp', 'từ Bài 5'],
        ['Hiểu điểm chính', 'ポイントりかい', 'Nghe và bắt đúng một chi tiết (ai, nước nào, mấy tuổi)', 'Bài 1, 2'],
        ['Chọn câu nói', 'はつわひょうげん (発話表現)', 'Nghe tình huống, chọn câu nên nói', 'Bài 3'],
        ['Đáp ngay', 'そくじおうとう (即時応答)', 'Nghe một câu, chọn câu đáp lại phù hợp', 'Bài 4'],
      ],
    },

    { t: 'h', text: 'Bài nghe 1 — ポイントりかい: Kim là ai?' },
    {
      t: 'listen',
      id: 'b1-nghe-1',
      title: 'Tanaka hỏi Kim',
      note: 'Dạng ポイントりかい. Tanaka đoán thông tin của Kim và bị sửa lại hai lần. Nghe để biết thông tin ĐÚNG của Kim.',
      lines: [
        { who: 'たなか', voice: 'ja-nam', text: 'はじめまして。たなかです。', ro: 'hajimemashite. Tanaka desu.', vi: 'Rất vui được gặp. Tôi là Tanaka.' },
        { who: 'キム', voice: 'ja-nu', text: 'はじめまして。キムです。よろしく おねがいします。', ro: 'hajimemashite. Kimu desu. yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Kim. Mong được giúp đỡ.' },
        { who: 'たなか', voice: 'ja-nam', text: 'キムさんは {中国人|ちゅうごくじん}ですか。', ro: 'Kimu-san wa Chūgokujin desu ka.', vi: 'Kim là người Trung Quốc à?' },
        { who: 'キム', voice: 'ja-nu', text: 'いいえ、ちがいます。かんこく{人|じん}です。', ro: 'iie, chigaimasu. Kankokujin desu.', vi: 'Không, không phải. Tôi là người Hàn Quốc.' },
        { who: 'たなか', voice: 'ja-nam', text: 'そうですか。{大学生|だいがくせい}ですか。', ro: 'sō desu ka. daigakusei desu ka.', vi: 'Thế à. Bạn là sinh viên đại học à?' },
        { who: 'キム', voice: 'ja-nu', text: 'いいえ、りゅうがくせいです。{学校|がっこう}は さくら{日本語学校|にほんごがっこう}です。', ro: 'iie, ryūgakusei desu. gakkō wa Sakura nihongo gakkō desu.', vi: 'Không, tôi là du học sinh. Trường tôi là trường tiếng Nhật Sakura.' },
        { who: 'たなか', voice: 'ja-nam', text: 'あ、ランさんも さくら{日本語学校|にほんごがっこう}です。', ro: 'a, Ran-san mo Sakura nihongo gakkō desu.', vi: 'À, Lan cũng học trường Sakura đấy.' },
        { who: 'キム', voice: 'ja-nu', text: 'はい。ランさんは {友|とも}だちです。', ro: 'hai. Ran-san wa tomodachi desu.', vi: 'Vâng. Lan là bạn tôi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-1-q',
      title: 'Câu hỏi bài nghe 1',
      items: [
        m('Kim là người nước nào?', ['Trung Quốc', 'Hàn Quốc', 'Nhật Bản', 'Việt Nam'], 1, 'Tanaka đoán {中国人|ちゅうごくじん}; Kim sửa: いいえ、ちがいます。**かんこく{人|じん}**です。'),
        m('Kim là ai?', ['sinh viên đại học', 'du học sinh trường tiếng', 'nhân viên công ty', 'giáo viên'], 1, 'いいえ、**りゅうがくせい**です。{学校|がっこう}は さくら{日本語学校|にほんごがっこう}です。'),
        m('Kim và Lan là gì của nhau?', ['chị em', 'bạn bè', 'cô và trò', 'đồng nghiệp ở konbini'], 1, 'ランさんは **{友|とも}だち**です。'),
      ],
    },

    { t: 'h', text: 'Bài nghe 2 — ポイントりかい: Người kia là ai?' },
    {
      t: 'listen',
      id: 'b1-nghe-2',
      title: 'Ở konbini — anh Suzuki hỏi Lan',
      note: 'Dạng ポイントりかい. Hai người khách quen đang đứng ngoài cửa hàng. Nghe để biết ai làm nghề gì, người nước nào.',
      lines: [
        { who: 'すずき', voice: 'ja-nam', text: 'ランさん、あの {人|ひと}は だれですか。', ro: 'Ran-san, ano hito wa dare desu ka.', vi: 'Lan này, người kia là ai thế?' },
        { who: 'ラン', voice: 'ja-nu', text: 'マイクさんです。{友|とも}だちです。', ro: 'Maiku-san desu. tomodachi desu.', vi: 'Là anh Mike ạ. Bạn em.' },
        { who: 'すずき', voice: 'ja-nam', text: 'マイクさんも りゅうがくせいですか。', ro: 'Maiku-san mo ryūgakusei desu ka.', vi: 'Mike cũng là du học sinh à?' },
        { who: 'ラン', voice: 'ja-nu', text: 'いいえ、りゅうがくせいじゃありません。エンジニアです。', ro: 'iie, ryūgakusei ja arimasen. enjinia desu.', vi: 'Không ạ, anh ấy không phải du học sinh. Anh ấy là kỹ sư.' },
        { who: 'すずき', voice: 'ja-nam', text: 'そうですか。イギリス{人|じん}ですか。', ro: 'sō desu ka. Igirisujin desu ka.', vi: 'Thế à. Người Anh à?' },
        { who: 'ラン', voice: 'ja-nu', text: 'いいえ、アメリカ{人|じん}です。', ro: 'iie, Amerikajin desu.', vi: 'Không, người Mỹ ạ.' },
        { who: 'すずき', voice: 'ja-nam', text: 'じゃ、あの {人|ひと}は？', ro: 'ja, ano hito wa?', vi: 'Thế còn người kia?' },
        { who: 'ラン', voice: 'ja-nu', text: 'たなかさんです。{日本人|にほんじん}です。{大学生|だいがくせい}です。', ro: 'Tanaka-san desu. Nihonjin desu. daigakusei desu.', vi: 'Là anh Tanaka. Người Nhật. Sinh viên đại học.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-2-q',
      title: 'Câu hỏi bài nghe 2',
      items: [
        m('Mike làm nghề gì?', ['du học sinh', 'kỹ sư', 'sinh viên đại học', 'nhân viên cửa hàng'], 1, 'いいえ、りゅうがくせいじゃありません。**エンジニア**です。'),
        m('Mike là người nước nào?', ['Anh', 'Mỹ', 'Úc', 'Nhật'], 1, 'Suzuki đoán イギリス{人|じん} (người Anh); Lan sửa: いいえ、**アメリカ{人|じん}**です。'),
        m('Tanaka là ai?', ['người Nhật, sinh viên đại học', 'người Nhật, kỹ sư', 'người Mỹ, sinh viên', 'người Hàn, du học sinh'], 0, 'たなかさんです。**{日本人|にほんじん}**です。**{大学生|だいがくせい}**です。'),
        m('Ai là người đặt câu hỏi trong bài?', ['Lan', 'anh Suzuki', 'Mike', 'Tanaka'], 1, 'Anh **Suzuki** (すずき) hỏi: あの {人|ひと}は だれですか。'),
      ],
    },

    { t: 'h', text: 'Bài nghe 3 — はつわひょうげん: Nói câu gì?' },
    {
      t: 'listen',
      id: 'b1-nghe-3',
      title: 'Ba tình huống — chọn câu 1, 2 hay 3',
      note: 'Dạng はつわひょうげん. Mỗi tình huống: người dẫn (giọng nam) mô tả, rồi ba câu 1–2–3 (giọng nữ). Chọn câu bạn nên nói. Lời dẫn dùng ngữ pháp các bài sau — đọc nghĩa tiếng Việt nếu chưa hiểu.',
      lines: [
        { who: 'Tình huống 1', voice: 'ja-nam', text: 'はじめて あう {人|ひと}です。なんと いいますか。', ro: 'hajimete au hito desu. nan to iimasu ka.', vi: 'Đây là người bạn gặp lần đầu. Bạn nói gì?' },
        { who: '1', voice: 'ja-nu', text: 'はじめまして。', ro: 'hajimemashite.', vi: 'Rất vui được gặp.' },
        { who: '2', voice: 'ja-nu', text: 'おやすみなさい。', ro: 'oyasuminasai.', vi: 'Chúc ngủ ngon.' },
        { who: '3', voice: 'ja-nu', text: 'いってきます。', ro: 'itte kimasu.', vi: 'Tôi đi đây.' },
        { who: 'Tình huống 2', voice: 'ja-nam', text: 'ていねいに としを ききます。なんと いいますか。', ro: 'teinei ni toshi o kikimasu. nan to iimasu ka.', vi: 'Bạn hỏi tuổi một cách lịch sự. Bạn nói gì?' },
        { who: '1', voice: 'ja-nu', text: 'あの {人|ひと}は だれですか。', ro: 'ano hito wa dare desu ka.', vi: 'Người kia là ai?' },
        { who: '2', voice: 'ja-nu', text: 'しつれいですが、おいくつですか。', ro: 'shitsurei desu ga, oikutsu desu ka.', vi: 'Xin lỗi, anh/chị bao nhiêu tuổi ạ?' },
        { who: '3', voice: 'ja-nu', text: 'なにじんですか。', ro: 'nanijin desu ka.', vi: 'Bạn là người nước nào?' },
        { who: 'Tình huống 3', voice: 'ja-nam', text: 'じこしょうかいの さいごです。なんと いいますか。', ro: 'jikoshōkai no saigo desu. nan to iimasu ka.', vi: 'Đây là cuối phần tự giới thiệu. Bạn nói gì?' },
        { who: '1', voice: 'ja-nu', text: 'そうですか。', ro: 'sō desu ka.', vi: 'Thế à.' },
        { who: '2', voice: 'ja-nu', text: 'こちらこそ。', ro: 'kochira koso.', vi: 'Tôi cũng vậy.' },
        { who: '3', voice: 'ja-nu', text: 'どうぞ よろしく おねがいします。', ro: 'dōzo yoroshiku onegaishimasu.', vi: 'Rất mong được giúp đỡ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-3-q',
      title: 'Câu hỏi bài nghe 3',
      items: [
        m('Tình huống 1 — gặp người lần đầu', ['1', '2', '3'], 0, '**1. はじめまして** — chỉ dùng ở lần gặp đầu tiên.'),
        m('Tình huống 2 — hỏi tuổi lịch sự', ['1', '2', '3'], 1, '**2. しつれいですが、おいくつですか**. Câu 1 hỏi "ai", câu 3 hỏi "người nước nào".'),
        m('Tình huống 3 — câu kết khi tự giới thiệu', ['1', '2', '3'], 2, '**3. どうぞ よろしく おねがいします**. こちらこそ là câu **đáp lại** người khác.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 4 — そくじおうとう: Đáp lại thế nào?' },
    {
      t: 'listen',
      id: 'b1-nghe-4',
      title: 'Năm câu — mỗi câu ba cách đáp',
      note: 'Dạng そくじおうとう. Giọng nam nói một câu, giọng nữ đọc ba câu đáp 1–2–3. Chọn câu đáp tự nhiên nhất.',
      lines: [
        { who: 'Câu 1', voice: 'ja-nam', text: 'はじめまして。たなかです。', ro: 'hajimemashite. Tanaka desu.', vi: 'Rất vui được gặp. Tôi là Tanaka.' },
        { who: '1', voice: 'ja-nu', text: 'おかえりなさい。', ro: 'okaerinasai.', vi: 'Về rồi à.' },
        { who: '2', voice: 'ja-nu', text: 'はじめまして。ランです。', ro: 'hajimemashite. Ran desu.', vi: 'Rất vui được gặp. Tôi là Lan.' },
        { who: '3', voice: 'ja-nu', text: 'はい、そうです。', ro: 'hai, sō desu.', vi: 'Vâng, đúng vậy.' },
        { who: 'Câu 2', voice: 'ja-nam', text: 'ランさんは {学生|がくせい}ですか。', ro: 'Ran-san wa gakusei desu ka.', vi: 'Lan là sinh viên à?' },
        { who: '1', voice: 'ja-nu', text: 'はい、そうです。', ro: 'hai, sō desu.', vi: 'Vâng, đúng vậy.' },
        { who: '2', voice: 'ja-nu', text: 'はい、ちがいます。', ro: 'hai, chigaimasu.', vi: '(Vâng, không phải — mâu thuẫn)' },
        { who: '3', voice: 'ja-nu', text: 'ランさんです。', ro: 'Ran-san desu.', vi: 'Là Lan.' },
        { who: 'Câu 3', voice: 'ja-nam', text: 'よろしく おねがいします。', ro: 'yoroshiku onegaishimasu.', vi: 'Mong được giúp đỡ.' },
        { who: '1', voice: 'ja-nu', text: 'どういたしまして。', ro: 'dō itashimashite.', vi: 'Không có gì.' },
        { who: '2', voice: 'ja-nu', text: 'いってらっしゃい。', ro: 'itte rasshai.', vi: 'Đi nhé.' },
        { who: '3', voice: 'ja-nu', text: 'こちらこそ、よろしく おねがいします。', ro: 'kochira koso, yoroshiku onegaishimasu.', vi: 'Tôi cũng vậy, mong được giúp đỡ.' },
        { who: 'Câu 4', voice: 'ja-nam', text: 'あの {人|ひと}は だれですか。', ro: 'ano hito wa dare desu ka.', vi: 'Người kia là ai?' },
        { who: '1', voice: 'ja-nu', text: 'アメリカ{人|じん}です。', ro: 'Amerikajin desu.', vi: 'Là người Mỹ.' },
        { who: '2', voice: 'ja-nu', text: 'マイクさんです。', ro: 'Maiku-san desu.', vi: 'Là anh Mike.' },
        { who: '3', voice: 'ja-nu', text: 'はい、そうです。', ro: 'hai, sō desu.', vi: 'Vâng, đúng vậy.' },
        { who: 'Câu 5', voice: 'ja-nam', text: 'お{国|くに}は？', ro: 'okuni wa?', vi: 'Bạn đến từ nước nào?' },
        { who: '1', voice: 'ja-nu', text: 'はたちです。', ro: 'hatachi desu.', vi: 'Tôi 20 tuổi.' },
        { who: '2', voice: 'ja-nu', text: '{学生|がくせい}です。', ro: 'gakusei desu.', vi: 'Tôi là sinh viên.' },
        { who: '3', voice: 'ja-nu', text: 'ベトナムです。', ro: 'Betonamu desu.', vi: 'Việt Nam.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-4-q',
      title: 'Câu hỏi bài nghe 4',
      items: [
        m('Câu 1 — はじめまして。たなかです。', ['1', '2', '3'], 1, 'Đáp lại lời chào lần đầu bằng **はじめまして + tên mình**.'),
        m('Câu 2 — ランさんは {学生|がくせい}ですか。', ['1', '2', '3'], 0, '**はい、そうです**. "はい、ちがいます" tự mâu thuẫn; "ランさんです" không trả lời câu hỏi.'),
        m('Câu 3 — よろしく おねがいします。', ['1', '2', '3'], 2, 'Đáp lại よろしく bằng **こちらこそ、よろしく おねがいします**.'),
        m('Câu 4 — あの {人|ひと}は だれですか。', ['1', '2', '3'], 1, 'だれ hỏi **ai** → trả lời tên: **マイクさんです**. Không dùng はい cho câu có từ để hỏi.'),
        m('Câu 5 — お{国|くに}は？', ['1', '2', '3'], 2, 'お{国|くに} = nước → **ベトナムです**.'),
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b1-noi',
  kind: 'speaking',
  title: 'Luyện nói Bài 1 — tự giới thiệu và hỏi người mới quen',
  goal: 'Đọc đúng nhịp 12 câu mẫu, tự giới thiệu trôi chảy trong 20 giây và trả lời đủ câu các câu hỏi về tên, nước, công việc, tuổi.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Hôm nay luyện gì',
      items: [
        '**12 câu mẫu** từ ngắn tới dài — máy chấm phát âm từng âm. Đây cũng là danh sách câu khi bạn 📞 **gọi CuongMini** trong Bài 1.',
        'Xem **hội thoại mẫu** "phỏng vấn làm quen" giữa cô Yamada và Lan.',
        '**Ghi âm** câu trả lời 5 câu hỏi về bản thân, nhờ AI chấm.',
      ],
    },
    {
      t: 'table',
      caption: 'Bốn điểm phát âm của Bài 1',
      head: ['Điểm', 'Đọc đúng', 'Hay đọc sai'],
      rows: [
        ['です, ます cuối câu', '"đét-x", "mát-x" — う gần như **câm**', 'đọc rõ "đê-xư" từng chữ'],
        ['りゅうがくせい', 'ryu-u-ga-ku-se-e: りゅう **kéo dài**, せい = "xê" kéo dài', 'rút ngắn thành "ryugakuse"'],
        ['しつれいですが', '"shtsu-rê" — し gần như câm (shitsurei → "shtsurei")', 'đọc rõ "si-tsư-rê-i"'],
        ['はたち, ～さい', 'đọc đều nhịp, không lên giọng cuối', 'đọc lên xuống như tiếng Việt'],
      ],
    },
    {
      t: 'phatam',
      id: 'b1-phatam',
      title: 'Đọc to — máy chấm từng âm (12 câu, ngắn → dài)',
      note: 'Bấm 🔊 nghe mẫu → đọc theo → bấm ghi âm. Câu nào dưới 80 điểm thì đọc chậm lại, vỗ tay theo nhịp rồi thử lại. Khi gọi CuongMini, gia sư sẽ dùng đúng 12 câu này.',
      items: [
        { text: 'はじめまして。', ipa: 'hajimemashite', vi: 'Rất vui được gặp.' },
        { text: 'ランです。', ipa: 'Ran desu', vi: 'Tôi là Lan.' },
        { text: '{学生|がくせい}です。', ipa: 'gakusei desu', vi: 'Tôi là sinh viên.' },
        { text: 'はたちです。', ipa: 'hatachi desu', vi: 'Tôi 20 tuổi.' },
        { text: 'ベトナム{人|じん}です。', ipa: 'Betonamujin desu', vi: 'Tôi là người Việt Nam.' },
        { text: 'ベトナムから きました。', ipa: 'Betonamu kara kimashita', vi: 'Tôi đến từ Việt Nam.' },
        { text: 'わたしも りゅうがくせいです。', ipa: 'watashi mo ryūgakusei desu', vi: 'Tôi cũng là du học sinh.' },
        { text: 'いいえ、{学生|がくせい}じゃありません。', ipa: 'iie gakusei ja arimasen', vi: 'Không, tôi không phải sinh viên.' },
        { text: 'キムさんは なにじんですか。', ipa: 'Kimu san wa nanijin desu ka', vi: 'Kim là người nước nào?' },
        { text: 'しつれいですが、おいくつですか。', ipa: 'shitsurei desu ga oikutsu desu ka', vi: 'Xin lỗi, anh/chị bao nhiêu tuổi ạ?' },
        { text: 'こちらこそ、よろしく おねがいします。', ipa: 'kochira koso yoroshiku onegaishimasu', vi: 'Tôi cũng vậy, mong được giúp đỡ.' },
        { text: 'はじめまして。ランです。どうぞ よろしく おねがいします。', ipa: 'hajimemashite Ran desu dōzo yoroshiku onegaishimasu', vi: 'Rất vui được gặp. Tôi là Lan. Rất mong được giúp đỡ.' },
      ],
    },
    { t: 'h', text: 'Hội thoại mẫu — cô Yamada phỏng vấn làm quen' },
    {
      t: 'p',
      text: 'Ngày đầu nhập học, cô Yamada gặp riêng từng học viên vài phút để làm quen. Đây cũng là kiểu câu hỏi trong phần thi nói đầu vào của nhiều trường tiếng Nhật. Nghe cả đoạn, rồi **che lời Lan** và tự trả lời bằng thông tin của bạn.',
    },
    {
      t: 'dialogue',
      title: 'めんだん — buổi gặp làm quen',
      lines: [
        { who: 'Cô Yamada', role: 'examiner', text: 'こんにちは。お{名前|なまえ}は？', ro: 'konnichiwa. onamae wa?', vi: 'Chào em. Em tên là gì?' },
        { who: 'ラン', role: 'candidate', text: 'ランです。よろしく おねがいします。', ro: 'Ran desu. yoroshiku onegaishimasu.', vi: 'Em là Lan. Mong cô giúp đỡ ạ.' },
        { who: 'Cô Yamada', role: 'examiner', text: 'ランさん、お{国|くに}は？', ro: 'Ran-san, okuni wa?', vi: 'Lan, em đến từ nước nào?' },
        { who: 'ラン', role: 'candidate', text: 'ベトナムです。ハノイから きました。', ro: 'Betonamu desu. Hanoi kara kimashita.', vi: 'Việt Nam ạ. Em đến từ Hà Nội.' },
        { who: 'Cô Yamada', role: 'examiner', text: 'ランさんは {大学生|だいがくせい}ですか。', ro: 'Ran-san wa daigakusei desu ka.', vi: 'Em là sinh viên đại học à?' },
        { who: 'ラン', role: 'candidate', text: 'いいえ、{大学生|だいがくせい}じゃありません。りゅうがくせいです。', ro: 'iie, daigakusei ja arimasen. ryūgakusei desu.', vi: 'Dạ không, em không phải sinh viên đại học. Em là du học sinh.' },
        { who: 'Cô Yamada', role: 'examiner', text: 'しつれいですが、おいくつですか。', ro: 'shitsurei desu ga, oikutsu desu ka.', vi: 'Cô hỏi hơi riêng một chút, em bao nhiêu tuổi?' },
        { who: 'ラン', role: 'candidate', text: 'はたちです。', ro: 'hatachi desu.', vi: 'Em 20 tuổi ạ.' },
        { who: 'Cô Yamada', role: 'examiner', text: 'そうですか。キムさんも はたちですか。', ro: 'sō desu ka. Kimu-san mo hatachi desu ka.', vi: 'Thế à. Kim cũng 20 tuổi à?' },
        { who: 'ラン', role: 'candidate', text: 'いいえ、キムさんは にじゅうにさいです。', ro: 'iie, Kimu-san wa nijūnisai desu.', vi: 'Dạ không, Kim 22 tuổi ạ.' },
        { who: 'Cô Yamada', role: 'examiner', text: 'わかりました。ありがとう。', ro: 'wakarimashita. arigatō.', vi: 'Cô hiểu rồi. Cảm ơn em.' },
        { who: 'ラン', role: 'candidate', text: 'ありがとうございました。', ro: 'arigatō gozaimashita.', vi: 'Em cảm ơn cô ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo trả lời khi được hỏi',
      items: [
        'Trả lời **đủ câu**, kết bằng です: hỏi お{国|くに}は？ → **ベトナムです**, không chỉ "ベトナム".',
        'Câu hỏi có/không: **はい／いいえ trước**, rồi câu đầy đủ. Nói "không" thì thêm luôn thông tin đúng.',
        'Câu có từ để hỏi (だれ, なにじん, おいくつ): **trả lời thẳng**, không nói はい.',
        'Chưa nghe rõ: **すみません、もう いちど おねがいします** (đã học ở Bài 0) — không bị trừ điểm khi thi.',
        'Thêm **một thông tin nhỏ** cho câu trả lời sinh động: ベトナムです。**ハノイから きました。**',
      ],
    },
    {
      t: 'speak',
      id: 'b1-noi-ghi-am',
      part: '1',
      questions: [
        'じこしょうかいを おねがいします。',
        'お名前は？',
        'お国は？',
        'がくせいですか。',
        'しつれいですが、おいくつですか。',
        'ともだちは なにじんですか。',
      ],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const G_ALL = 'N1は N2です · N1は N2じゃありません · N1は N2ですか (はい、そうです／いいえ、ちがいます) · N1も N2です · だれ／なにじん／なんさい／おいくつ';

const BAI_TAP: Lesson = {
  id: 'b1-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 1',
  goal: 'Tự dịch, tự ghép và tự kiểm tra được mọi mẫu câu của Bài 1; đọc hiểu một đoạn giới thiệu bạn bè ngắn.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách làm',
      items: [
        'Gõ tiếng Nhật bằng bộ gõ **Japanese (Hiragana)**. Chữ Hán **không bắt buộc**: gõ toàn hiragana (がくせいです) cũng được chấm đúng.',
        'Khoảng trắng và dấu 。、？ có hay không đều được.',
        'Mỗi câu dịch có ô 💡 **Gợi ý** — từ cần dùng và mẫu câu. Dịch khác đáp án mà vẫn đúng thì bấm "Nhờ gia sư chấm".',
        'Đúng dưới **70%** phần nào thì quay lại mục Ngữ pháp, mẫu tương ứng.',
      ],
    },
    {
      t: 'quiz',
      id: 'b1-bt-dich',
      title: 'Phần 1 — Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: G_ALL,
      items: [
        { q: 'Tôi là Lan.', hint: 'わたし', answers: ans('わたしは ランです。', 'ランです。') },
        { q: 'Tôi là người Việt Nam.', hint: 'わたし, ベトナム, 〜人', answers: ans('わたしは ベトナム{人|じん}です。', 'ベトナム{人|じん}です。') },
        { q: 'Anh Tanaka là sinh viên đại học.', hint: '大学生', answers: ans('たなかさんは {大学生|だいがくせい}です。') },
        { q: 'Mike không phải sinh viên.', hint: '学生', answers: ans('マイクさんは {学生|がくせい}じゃありません。') },
        { q: 'Kim là du học sinh à?', hint: 'りゅうがくせい', answers: ans('キムさんは りゅうがくせいですか。') },
        { q: '(Trả lời câu trên) Vâng, đúng vậy.', hint: 'はい, そうです', answers: ans('はい、そうです。', 'はい、りゅうがくせいです。') },
        { q: 'Không, không phải. Tôi là kỹ sư.', hint: 'いいえ, ちがいます, エンジニア', answers: ans('いいえ、ちがいます。エンジニアです。', 'いいえ、ちがいます。わたしは エンジニアです。') },
        { q: 'Tôi cũng là sinh viên.', hint: 'わたし, 学生', answers: ans('わたしも {学生|がくせい}です。') },
        { q: 'Người kia là ai?', hint: 'だれ', answers: ans('あの {人|ひと}は だれですか。', 'あの {人|ひと}は どなたですか。') },
        { q: 'Anh Suzuki là cửa hàng trưởng.', hint: 'てんちょう', answers: ans('すずきさんは てんちょうです。') },
        { q: 'Mike là người nước nào?', hint: 'なにじん', answers: ans('マイクさんは なにじんですか。', 'マイクさんは {何人|なにじん}ですか。') },
        { q: 'Tôi 20 tuổi.', hint: '〜さい', answers: ans('はたちです。', 'わたしは はたちです。', 'にじゅっさいです。', 'わたしは にじゅっさいです。', '{二十歳|はたち}です。', 'わたしは {二十歳|はたち}です。') },
        { q: 'Tôi đến từ Hà Nội.', hint: '〜から きました', answers: ans('ハノイから きました。', 'わたしは ハノイから きました。') },
        { q: 'Xin lỗi, anh bao nhiêu tuổi ạ?', hint: 'しつれいですが, おいくつ', answers: ans('しつれいですが、おいくつですか。') },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-bt-mcq',
      title: 'Phần 2 — Chọn trợ từ, từ đúng',
      items: [
        m('わたし（　）ランです。', ['は', 'も', 'か', 'を'], 0, 'Trợ từ chủ đề **は** (đọc wa).'),
        m('キムさんは {学生|がくせい}です。わたし（　）{学生|がくせい}です。', ['は', 'も', 'か', 'じゃ'], 1, 'Thông tin giống → **も** (cũng).'),
        m('マイクさんは {日本人|にほんじん}です（　）。', ['は', 'も', 'か', 'ね'], 2, 'Thêm **か** để hỏi: {日本人|にほんじん}ですか.'),
        m('たなかさんは かいしゃいん（　）。たなかさんは {大学生|だいがくせい}です。', ['です', 'じゃありません', 'ですか', 'も'], 1, 'Câu sau nói Tanaka là sinh viên → câu trước phủ định: **じゃありません**.'),
        m('あの {人|ひと}は（　）ですか。——キムさんです。', ['なに', 'だれ', 'なにじん', 'おいくつ'], 1, 'Trả lời là tên người → hỏi **だれ**.'),
        m('マイクさんは（　）ですか。——アメリカ{人|じん}です。', ['だれ', 'なんさい', 'なにじん', 'なん'], 2, 'Trả lời là "người Mỹ" → hỏi **なにじん**.'),
        m('すずきさんは（　）ですか。——さんじゅうはっさいです。', ['おいくつ', 'だれ', 'なにじん', 'どなた'], 0, 'Trả lời là tuổi → **おいくつ** (lịch sự, vì Suzuki lớn tuổi hơn).'),
        m('Lan **20 tuổi**. Câu nào đúng?', ['ランさんは にさいです。', 'ランさんは はたちです。', 'ランさんは じゅうにさいです。', 'ランさんは にじゅうはっさいです。'], 1, '20 tuổi = **はたち**.'),
        m('Anh Tanaka **21 tuổi**. Đọc là:', ['にじゅういちさい', 'にじゅういっさい', 'にいっさい', 'にじゅうさい'], 1, 'Tận cùng 1 + さい → **いっさい**: にじゅういっさい.'),
        m('Ai là **cửa hàng trưởng**?', ['てんいん', 'てんちょう', 'かいしゃいん', 'いしゃ'], 1, '**てんちょう** = cửa hàng trưởng. てんいん = nhân viên cửa hàng.'),
        m('Tự giới thiệu, câu nào **sai**?', ['はじめまして。', 'ランさんです。', 'ベトナムから きました。', 'どうぞ よろしく おねがいします。'], 1, 'Không gắn さん cho tên mình → **ランです**.'),
        m('Đáp lại "よろしく おねがいします" bằng:', ['そうですか。', 'こちらこそ、よろしく おねがいします。', 'どういたしまして。', 'ちがいます。'], 1, '**こちらこそ** = chính tôi mới mong được giúp đỡ.'),
      ],
    },
    {
      t: 'build',
      id: 'b1-bt-ghep',
      title: 'Phần 3 — Ghép câu',
      items: [
        { vi: 'Anh Suzuki là người Nhật.', chips: ['すずきさんは', '{日本人|にほんじん}', 'です。', '{日本|にほん}', 'も'], answer: ['すずきさんは', '{日本人|にほんじん}', 'です。'], ro: 'Suzuki-san wa Nihonjin desu.' },
        { vi: 'Tôi không phải người Trung Quốc.', chips: ['わたしは', '{中国人|ちゅうごくじん}', 'じゃありません。', 'ですか。', 'も'], answer: ['わたしは', '{中国人|ちゅうごくじん}', 'じゃありません。'], ro: 'watashi wa Chūgokujin ja arimasen.' },
        { vi: 'Cô Yamada cũng là người Nhật.', chips: ['やまだ{先生|せんせい}', 'も', '{日本人|にほんじん}です。', 'は', 'さん'], answer: ['やまだ{先生|せんせい}', 'も', '{日本人|にほんじん}です。'], ro: 'Yamada-sensei mo Nihonjin desu.' },
        { vi: 'Kim mấy tuổi?', chips: ['キムさんは', '{何|なん}さい', 'ですか。', 'だれ', 'です。'], answer: ['キムさんは', '{何|なん}さい', 'ですか。'], ro: 'Kimu-san wa nansai desu ka.' },
        { vi: 'Không, Mike không phải du học sinh. Anh ấy là kỹ sư.', chips: ['いいえ、', 'マイクさんは', 'りゅうがくせい', 'じゃありません。', 'エンジニアです。', 'も'], answer: ['いいえ、', 'マイクさんは', 'りゅうがくせい', 'じゃありません。', 'エンジニアです。'], ro: 'iie, Maiku-san wa ryūgakusei ja arimasen. enjinia desu.' },
        { vi: 'Rất vui được gặp. Tôi là Lan. Tôi đến từ Việt Nam.', chips: ['はじめまして。', 'ランです。', 'ベトナムから', 'きました。', 'ランさんです。'], answer: ['はじめまして。', 'ランです。', 'ベトナムから', 'きました。'], ro: 'hajimemashite. Ran desu. Betonamu kara kimashita.' },
        { vi: 'Trường (của tôi) là trường tiếng Nhật Sakura.', chips: ['{学校|がっこう}は', 'さくら', '{日本語学校|にほんごがっこう}', 'です。', '{大学|だいがく}'], answer: ['{学校|がっこう}は', 'さくら', '{日本語学校|にほんごがっこう}', 'です。'], ro: 'gakkō wa Sakura nihongo gakkō desu.' },
      ],
    },
    {
      t: 'passage',
      title: 'Phần 4 — Đọc hiểu: "Bạn bè của tôi" (Lan viết cho bảng tin của lớp)',
      intro: 'Đọc to cả đoạn, rồi trả lời câu hỏi. Mọi câu đều dùng ngữ pháp Bài 1.',
      paras: [
        { label: '1', text: 'はじめまして。わたしは ランです。ベトナム{人|じん}です。ハノイから きました。{学校|がっこう}は さくら{日本語学校|にほんごがっこう}です。はたちです。' },
        { label: '2', text: 'キムさんは {友|とも}だちです。かんこく{人|じん}です。キムさんも りゅうがくせいです。にじゅうにさいです。' },
        { label: '3', text: 'マイクさんも {友|とも}だちです。アメリカ{人|じん}です。マイクさんは りゅうがくせいじゃありません。エンジニアです。' },
        { label: '4', text: 'たなかさんは {日本人|にほんじん}です。{大学生|だいがくせい}です。{大学|だいがく}は さくら{大学|だいがく}です。にじゅういっさいです。どうぞ よろしく おねがいします。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-bt-doc',
      title: 'Câu hỏi đọc hiểu',
      items: [
        m('Ai **cũng là du học sinh** giống Lan?', ['Mike', 'Kim', 'Tanaka', 'Không có ai'], 1, 'Đoạn 2: キムさん**も** りゅうがくせいです。'),
        m('Mike làm nghề gì?', ['du học sinh', 'sinh viên đại học', 'kỹ sư', 'nhân viên cửa hàng'], 2, 'Đoạn 3: りゅうがくせいじゃありません。**エンジニア**です。'),
        m('Ai là người Nhật?', ['Lan', 'Kim', 'Mike', 'Tanaka'], 3, 'Đoạn 4: **たなかさん**は {日本人|にほんじん}です。'),
        m('Ai nhiều tuổi nhất trong ba người Lan, Kim, Tanaka?', ['Lan (20)', 'Kim (22)', 'Tanaka (21)'], 1, 'Lan はたち (20), Kim にじゅうにさい (22), Tanaka にじゅういっさい (21) → **Kim**.'),
        m('Trường của Lan là:', ['Đại học Sakura', 'Trường tiếng Nhật Sakura', 'Đại học Hà Nội', 'Không nói'], 1, 'Đoạn 1: {学校|がっこう}は **さくら{日本語学校|にほんごがっこう}**です。Đại học Sakura là trường của Tanaka.'),
      ],
    },
    {
      t: 'table',
      caption: 'Tự đánh giá Bài 1 — tích đủ thì sang Bài 2',
      head: ['Tôi làm được…', 'Chưa được thì ôn'],
      rows: [
        ['Tự giới thiệu 5 câu không nhìn sách, dưới 20 giây', 'Hội thoại tình huống 2 + Ngữ pháp ⑥'],
        ['Nói "không phải" và sửa lại thông tin đúng', 'Ngữ pháp ② ③'],
        ['Dùng も đúng chỗ, không viết はも', 'Ngữ pháp ④'],
        ['Hỏi ai, người nước nào, mấy tuổi — và trả lời không dùng はい', 'Ngữ pháp ⑤'],
        ['Nói tuổi của mình và của bạn bè (kể cả はたち, いっさい, はっさい)', 'Từ vựng — bảng tuổi'],
        ['Đọc được 人 日 本 学 生 先 名 国 trong từ', 'Chữ Hán'],
      ],
    },
  ],
};

export const BAI_1: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
