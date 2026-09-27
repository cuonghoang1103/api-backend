/**
 * Bài 1 — はじめまして (できる日本語 初級 第1課, p.15–30; ポイント 1–6, p.270).
 *
 * Soạn theo ../SOAN-BAI.md: đủ 6 ポイント, đủ 52 mục từ trong danh sách từ mới
 * cô phát ("Từ vựng JPD123 — Bài 1-7 (sổ tra)", mục 1–52), mọi mẫu 言ってみよう.
 * Hội thoại, câu ví dụ, kịch bản nghe đều VIẾT MỚI (chỉ dùng lại tên nhân vật).
 * Phần luyện nói dùng ngân hàng thi JPD113 (Hướng dẫn ôn thi, file "Luyện nói"
 * của cô, on-thi-jpd113/data/speaking.ts + personalQA.ts).
 *
 * Nhân vật (giới tính quyết định giọng đọc): nữ = パク, ワン, アンナ, マリヤム,
 * メアリー, 木村, 山口 · nam = カルロス, ダニエル, マルコ, ナタポン, 西川, 本田先生.
 * Trong hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam.
 */
import type { Lesson } from '@/components/sach-hoc/types';

/* ── Đáp án gõ tay ─────────────────────────────────────────────────────────
 * Bộ chấm chỉ so chuỗi (bỏ hoa/thường, gộp khoảng trắng, bỏ . ? ! cuối), nên
 * một câu tiếng Nhật phải liệt kê sẵn mọi cách gõ hợp lệ. ans() nhận mẫu có
 * furigana {漢字|かな} và sinh: mỗi chữ Hán gõ bằng Hán hoặc bằng kana · có/không
 * 。 cuối (hoặc ？) · có/không 、 · có/không dấu cách · じゃ/では · số thường/số
 * toàn góc. Phần tử ĐẦU là bản chữ Hán đầy đủ (trang hiện nó làm "Đáp án").
 */
const RUBY = /\{([^|}]+)\|([^}]+)\}/g;
function ans(...forms: string[]): string[] {
  const out = new Set<string>();
  for (const f of forms) {
    const n = [...f.matchAll(RUBY)].length;
    const bases: string[] = [];
    if (n <= 5) {
      for (let mask = 0; mask < 1 << n; mask++) {
        let i = 0;
        bases.push(f.replace(RUBY, (_m, k: string, r: string) => ((mask >> i++) & 1 ? r : k)));
      }
    } else {
      bases.push(f.replace(RUBY, '$1'), f.replace(RUBY, '$2'));
    }
    for (const b of bases)
      for (const x of [b, b.replace(/じゃありません/g, 'ではありません')])
        for (const y of [x, x.replace(/、/g, '')])
          for (const z of [y, y.replace(/\s+/g, '')])
            for (const w of [z, z.replace(/。$/, ''), z.replace(/。$/, '？')])
              for (const d of [w, w.replace(/[0-9]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xfee0))]) out.add(d);
  }
  return [...out];
}

/* ══════════════════════════ 1. HỘI THOẠI ══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b1-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: はじめまして — Làm quen',
  goal: 'Chào người mới gặp, nói và hỏi được tên, nước, công việc, tuổi, ngày sinh, sở thích.',
  minutes: 35,
  blocks: [
    { t: 'h', text: 'Học xong Bài 1 bạn làm được gì (できる)' },
    {
      t: 'table',
      head: ['Chủ đề nhỏ', 'Bạn làm được', 'Ngữ pháp dùng'],
      rows: [
        ['1. {私|わたし}の{名前|なまえ}・{国|くに}・{仕事|しごと} — Tên, nước, công việc', 'Nói tên, nước, công việc của mình; hỏi người khác những điều đó.', 'ポイント 1, 2, 3, 4'],
        ['2. {私|わたし}の{誕生日|たんじょうび} — Ngày sinh', 'Nói tuổi của mình. Nói và hỏi ngày sinh.', 'ポイント 1, 3'],
        ['3. {私|わたし}の{趣味|しゅみ} — Sở thích', 'Nói và hỏi sở thích; nói "tôi cũng vậy".', 'ポイント 3, 5, 6'],
        ['できる！ (tổng hợp)', 'Hỏi nhiều người về nước, việc, sở thích để kết bạn, rồi giới thiệu người đó cho người khác.', 'ポイント 1–6'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học phần này: đọc **tình huống** (tiếng Việt) → bấm nghe cả đoạn hội thoại → bấm từng câu, đọc to theo 3 lần → tắt furigana và romaji, tự đọc lại. Các câu ở đây đều dùng lại trong bài thi nói.',
    },
    {
      t: 'table',
      caption: 'Nhân vật dùng trong khoá (sách có 13 nhân vật; khoá gán cho mỗi người một nước cố định để dễ nhớ)',
      head: ['Nhân vật', 'Đọc', 'Nước', 'Công việc'],
      rows: [
        ['パク (nữ)', 'Paku', '{韓国|かんこく} — Hàn Quốc', 'Học sinh trường tiếng Nhật あおぞら'],
        ['カルロス (nam)', 'Karurosu', 'ブラジル — Brazil', 'Nhân viên công ty ABE'],
        ['ワン (nữ)', 'Wan', '{中国|ちゅうごく} — Trung Quốc', 'Học sinh trường tiếng Nhật あおぞら'],
        ['ダニエル (nam)', 'Danieru', 'オーストラリア — Úc', 'Nhân viên văn phòng'],
        ['マルコ (nam)', 'Maruko', 'イタリア — Ý', 'Sinh viên ĐH ふじみ'],
        ['アンナ (nữ)', 'Anna', 'ロシア — Nga', 'Sinh viên ĐH ふじみ'],
        ['ナタポン (nam)', 'Natapon', 'タイ — Thái Lan', 'Nhân viên công ty ABE'],
        ['メアリー (nữ)', 'Mearī', 'アメリカ — Mỹ', 'Giáo viên trường tiếng Nhật あおぞら'],
        ['{木村|きむら} (nữ)', 'Kimura', '{日本|にほん} — Nhật', 'Sinh viên ĐH ふじみ'],
        ['{西川|にしかわ} (nam)', 'Nishikawa', '{日本|にほん} — Nhật', 'Giáo viên trường THPT さくら'],
      ],
    },

    /* ── Chủ đề nhỏ 1 ── */
    { t: 'h', text: '1. 私の名前・国・仕事 — Tên, nước, công việc' },
    { t: 'p', text: '**Tình huống 1-1.** Ngày đầu tiên ở trường, bạn gặp người lạ và tự giới thiệu tên. Người kia đáp lại và cũng nói tên mình.' },
    {
      t: 'dialogue',
      title: 'Hai người đều nói tên',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'はじめまして。{私|わたし}はダニエルです。どうぞよろしくお{願|ねが}いします。', ro: 'Hajimemashite. Watashi wa Danieru desu. Dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp bạn. Tôi là Daniel. Rất mong được giúp đỡ.' },
        { who: 'ワン', role: 'a', text: 'はじめまして。ワンです。こちらこそ、よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Wan desu. Kochira koso, yoroshiku onegaishimasu.', vi: 'Rất vui được gặp bạn. Tôi là Wan. Chính tôi mới mong được bạn giúp đỡ.' },
      ],
    },
    { t: 'p', text: '**Tình huống 1-2.** Người kia chỉ chào lại mà quên nói tên — bạn lịch sự hỏi tên họ.' },
    {
      t: 'dialogue',
      title: 'Hỏi tên người kia',
      lines: [
        { who: 'マルコ', role: 'b', text: 'はじめまして。マルコです。よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Maruko desu. Yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Marco. Mong được giúp đỡ.' },
        { who: 'アンナ', role: 'a', text: 'はじめまして。こちらこそ、よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Kochira koso, yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi cũng mong được giúp đỡ.' },
        { who: 'マルコ', role: 'b', text: 'あのう、すみません。お{名前|なまえ}は？', ro: 'Anō, sumimasen. O-namae wa?', vi: 'À… xin lỗi, tên bạn là gì ạ?' },
        { who: 'アンナ', role: 'a', text: 'アンナです。よろしくお{願|ねが}いします。', ro: 'Anna desu. Yoroshiku onegaishimasu.', vi: 'Tôi là Anna. Mong được giúp đỡ.' },
      ],
    },
    { t: 'p', text: '**Tình huống 1-3.** Tự giới thiệu tên kèm quốc tịch (người nước nào) trước cả lớp.' },
    {
      t: 'dialogue',
      title: 'Giới thiệu tên + quốc tịch',
      lines: [
        { who: 'ナタポン', role: 'b', text: 'はじめまして。ナタポンです。タイ{人|じん}です。よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Natapon desu. Tai-jin desu. Yoroshiku onegaishimasu.', vi: 'Rất vui được gặp mọi người. Tôi là Natapon. Tôi là người Thái. Mong được giúp đỡ.' },
        { who: 'メアリー', role: 'a', text: 'はじめまして。メアリーです。アメリカ{人|じん}です。どうぞよろしくお{願|ねが}いします。', ro: 'Hajimemashite. Mearī desu. Amerika-jin desu. Dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp mọi người. Tôi là Mary. Tôi là người Mỹ. Rất mong được giúp đỡ.' },
      ],
    },
    { t: 'p', text: '**Tình huống 1-4.** Ở ký túc xá, nói chuyện với người mới quen: hỏi người ấy từ nước nào tới.' },
    {
      t: 'dialogue',
      title: 'Hỏi nước (お国はどちらですか)',
      lines: [
        { who: 'カルロス', role: 'b', text: 'はじめまして。カルロスです。よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Karurosu desu. Yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Carlos. Mong được giúp đỡ.' },
        { who: 'マリヤム', role: 'a', text: 'カルロスさん、お{国|くに}はどちらですか。', ro: 'Karurosu-san, o-kuni wa dochira desu ka.', vi: 'Anh Carlos, anh đến từ nước nào ạ?' },
        { who: 'カルロス', role: 'b', text: 'ブラジルです。', ro: 'Burajiru desu.', vi: 'Brazil.' },
        { who: 'マリヤム', role: 'a', text: 'そうですか。', ro: 'Sō desu ka.', vi: 'Ồ, vậy à.' },
      ],
    },
    { t: 'p', text: '**Tình huống 1-5.** Hỏi công việc; hỏi "bạn là sinh viên à?" và trả lời có/không.' },
    {
      t: 'dialogue',
      title: 'Hỏi công việc — trả lời "có"',
      lines: [
        { who: 'ワン', role: 'a', text: 'ダニエルさん、お{仕事|しごと}は？', ro: 'Danieru-san, o-shigoto wa?', vi: 'Anh Daniel làm nghề gì ạ?' },
        { who: 'ダニエル', role: 'b', text: '{私|わたし}は{会社員|かいしゃいん}です。', ro: 'Watashi wa kaishain desu.', vi: 'Tôi là nhân viên văn phòng.' },
        { who: 'ワン', role: 'a', text: 'そうですか。', ro: 'Sō desu ka.', vi: 'Vậy à.' },
        { who: 'ダニエル', role: 'b', text: 'ワンさんは{学生|がくせい}ですか。', ro: 'Wan-san wa gakusei desu ka.', vi: 'Wan là học sinh à?' },
        { who: 'ワン', role: 'a', text: 'はい、{学生|がくせい}です。あおぞら{日本語学校|にほんごがっこう}の{学生|がくせい}です。', ro: 'Hai, gakusei desu. Aozora nihongo gakkō no gakusei desu.', vi: 'Vâng, tôi là học sinh. Học sinh trường tiếng Nhật Aozora.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi công việc — trả lời "không"',
      lines: [
        { who: 'パク', role: 'a', text: '{西川|にしかわ}さんは{学生|がくせい}ですか。', ro: 'Nishikawa-san wa gakusei desu ka.', vi: 'Anh Nishikawa là sinh viên à?' },
        { who: '西川', role: 'b', text: 'いいえ、{学生|がくせい}じゃありません。{教師|きょうし}です。さくら{高校|こうこう}の{教師|きょうし}です。', ro: 'Iie, gakusei ja arimasen. Kyōshi desu. Sakura kōkō no kyōshi desu.', vi: 'Không, tôi không phải sinh viên. Tôi là giáo viên. Giáo viên trường THPT Sakura.' },
        { who: 'パク', role: 'a', text: 'そうですか。', ro: 'Sō desu ka.', vi: 'Ồ, vậy à.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'はじめまして。', ro: 'Hajimemashite.', vi: 'Rất vui được gặp (chỉ nói ở LẦN ĐẦU gặp).' },
        { en: '（どうぞ）よろしくお{願|ねが}いします。', ro: '(Dōzo) yoroshiku onegaishimasu.', vi: 'Rất mong được giúp đỡ (câu kết khi tự giới thiệu; thêm どうぞ thì lịch sự hơn).' },
        { en: 'こちらこそ（よろしくお{願|ねが}いします）。', ro: 'Kochira koso (yoroshiku onegaishimasu).', vi: 'Chính tôi mới là người mong (đáp lại よろしく).' },
        { en: 'あのう、すみません。お{名前|なまえ}は？', ro: 'Anō, sumimasen. O-namae wa?', vi: 'À… xin lỗi, tên bạn là gì?' },
        { en: 'お{国|くに}はどちらですか。', ro: 'O-kuni wa dochira desu ka.', vi: 'Bạn đến từ nước nào?' },
        { en: 'お{仕事|しごと}は？', ro: 'O-shigoto wa?', vi: 'Bạn làm nghề gì?' },
        { en: 'そうですか。', ro: 'Sō desu ka.', vi: 'Vậy à. (xuống giọng — tỏ ý đã nghe hiểu)' },
      ],
    },

    /* ── Chủ đề nhỏ 2 ── */
    { t: 'h', text: '2. 私の誕生日 — Tuổi và ngày sinh' },
    { t: 'p', text: '**Tình huống 2-1.** Tiệc chào mừng ở ký túc xá ({歓迎会|かんげいかい}): bạn đứng lên tự giới thiệu, lần này thêm trường và **tuổi**.' },
    {
      t: 'dialogue',
      title: 'Tự giới thiệu có tuổi',
      lines: [
        { who: 'アンナ', role: 'a', text: 'はじめまして。{私|わたし}はアンナです。ロシア{人|じん}です。ふじみ{大学|だいがく}の{学生|がくせい}です。{19歳|じゅうきゅうさい}です。どうぞよろしくお{願|ねが}いします。', ro: 'Hajimemashite. Watashi wa Anna desu. Roshia-jin desu. Fujimi daigaku no gakusei desu. Jūkyū-sai desu. Dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp mọi người. Tôi là Anna. Tôi là người Nga. Tôi là sinh viên ĐH Fujimi. Tôi 19 tuổi. Rất mong được giúp đỡ.' },
      ],
    },
    { t: 'p', text: '**Tình huống 2-2.** Vẫn ở bữa tiệc, bạn hỏi một người ở ký túc xá sinh ngày nào — rồi người đó hỏi lại bạn.' },
    {
      t: 'dialogue',
      title: 'Hỏi ngày sinh',
      lines: [
        { who: '木村', role: 'a', text: 'ナタポンさんの{誕生日|たんじょうび}はいつですか。', ro: 'Natapon-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật của anh Natapon là khi nào?' },
        { who: 'ナタポン', role: 'b', text: '{7月|しちがつ}{20日|はつか}です。{木村|きむら}さんは？', ro: 'Shichigatsu hatsuka desu. Kimura-san wa?', vi: 'Ngày 20 tháng 7. Còn chị Kimura?' },
        { who: '木村', role: 'a', text: '{私|わたし}は{4月|しがつ}{1日|ついたち}です。', ro: 'Watashi wa shigatsu tsuitachi desu.', vi: 'Tôi là ngày 1 tháng 4.' },
        { who: 'ナタポン', role: 'b', text: 'そうですか。', ro: 'Sō desu ka.', vi: 'Vậy à.' },
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: ngày và tháng đọc bất quy tắc',
      items: [
        'Tháng 4 = **しがつ**, tháng 7 = **しちがつ**, tháng 9 = **くがつ** (không nói ~~よんがつ~~, ~~きゅうがつ~~).',
        'Ngày 1–10, 14, 20, 24 đọc riêng: ついたち, ふつか, みっか, よっか, いつか, むいか, なのか, ようか, ここのか, とおか, じゅうよっか, **はつか**, にじゅうよっか. Bảng đầy đủ ở bài **Từ vựng**.',
        '20 tuổi = **はたち** (cách nói đặc biệt).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{26歳|にじゅうろくさい}です。', ro: 'Watashi wa nijūroku-sai desu.', vi: 'Tôi 26 tuổi.' },
        { en: '〜さんの{誕生日|たんじょうび}はいつですか。', ro: '~san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật của ~ là khi nào?' },
        { en: '{10月|じゅうがつ}{4日|よっか}です。', ro: 'Jūgatsu yokka desu.', vi: 'Ngày 4 tháng 10.' },
        { en: '〜さんは？', ro: '~san wa?', vi: 'Còn ~ thì sao? (hỏi ngược lại, lên giọng)' },
      ],
    },

    /* ── Chủ đề nhỏ 3 ── */
    { t: 'h', text: '3. 私の趣味 — Sở thích' },
    { t: 'p', text: '**Tình huống 3-1.** Trong lớp học, bạn nói chuyện với bạn cùng lớp về sở thích.' },
    {
      t: 'dialogue',
      title: 'Hỏi sở thích',
      lines: [
        { who: 'メアリー', role: 'a', text: 'マルコさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Maruko-san no shumi wa nan desu ka.', vi: 'Sở thích của Marco là gì?' },
        { who: 'マルコ', role: 'b', text: 'サッカーです。メアリーさんは？', ro: 'Sakkā desu. Mearī-san wa?', vi: 'Bóng đá. Còn Mary?' },
        { who: 'メアリー', role: 'a', text: '{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}と{映画|えいが}です。', ro: 'Watashi no shumi wa ongaku to eiga desu.', vi: 'Sở thích của tôi là âm nhạc và phim.' },
        { who: 'マルコ', role: 'b', text: 'そうですか。', ro: 'Sō desu ka.', vi: 'Vậy à.' },
      ],
    },
    { t: 'p', text: '**Tình huống 3-2.** Người kia có cùng sở thích với bạn — bạn reo lên "tôi cũng vậy!".' },
    {
      t: 'dialogue',
      title: 'Cùng sở thích (も)',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'パクさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Paku-san no shumi wa nan desu ka.', vi: 'Sở thích của Park là gì?' },
        { who: 'パク', role: 'a', text: '{水泳|すいえい}です。', ro: 'Suiei desu.', vi: 'Bơi lội.' },
        { who: 'ダニエル', role: 'b', text: 'あっ、{私|わたし}の{趣味|しゅみ}も{水泳|すいえい}です。', ro: 'A!, watashi no shumi mo suiei desu.', vi: 'Á, sở thích của tôi cũng là bơi lội.' },
        { who: 'パク', role: 'a', text: 'わあ、{同|おな}じですね。', ro: 'Wā, onaji desu ne.', vi: 'Oa, giống nhau nhỉ!' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{趣味|しゅみ}は{何|なん}ですか。', ro: 'Shumi wa nan desu ka.', vi: 'Sở thích (của bạn) là gì?' },
        { en: '{読書|どくしょ}と{旅行|りょこう}です。', ro: 'Dokusho to ryokō desu.', vi: 'Đọc sách và du lịch.' },
        { en: 'あっ、{私|わたし}の{趣味|しゅみ}もテニスです。', ro: 'A!, watashi no shumi mo tenisu desu.', vi: 'Á, sở thích của tôi cũng là tennis.' },
        { en: 'わあ、{同|おな}じですね。', ro: 'Wā, onaji desu ne.', vi: 'Oa, giống nhau nhỉ.' },
      ],
    },

    /* ── Tổng hợp ── */
    { t: 'h', text: '4. Hội thoại tổng hợp — nghe lại cả bài' },
    { t: 'p', text: 'Phòng sinh hoạt chung của ký túc xá. Wan gặp Marco lần đầu. Đoạn này gom **mọi mẫu câu của Bài 1** — học thuộc được đoạn này là đủ phần hỏi–đáp không tranh của đề thi.' },
    {
      t: 'dialogue',
      title: 'ワンさんとマルコさん',
      lines: [
        { who: 'ワン', role: 'a', text: 'こんにちは。', ro: 'Konnichiwa.', vi: 'Xin chào.' },
        { who: 'マルコ', role: 'b', text: 'あ、こんにちは。', ro: 'A, konnichiwa.', vi: 'À, xin chào.' },
        { who: 'ワン', role: 'a', text: 'はじめまして。ワンです。{中国人|ちゅうごくじん}です。よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Wan desu. Chūgokujin desu. Yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Wan. Tôi là người Trung Quốc. Mong được giúp đỡ.' },
        { who: 'マルコ', role: 'b', text: 'マルコです。こちらこそ、よろしくお{願|ねが}いします。', ro: 'Maruko desu. Kochira koso, yoroshiku onegaishimasu.', vi: 'Tôi là Marco. Tôi cũng mong được giúp đỡ.' },
        { who: 'ワン', role: 'a', text: 'マルコさん、お{国|くに}はどちらですか。', ro: 'Maruko-san, o-kuni wa dochira desu ka.', vi: 'Marco đến từ nước nào?' },
        { who: 'マルコ', role: 'b', text: 'イタリアです。', ro: 'Itaria desu.', vi: 'Ý.' },
        { who: 'ワン', role: 'a', text: 'そうですか。マルコさんは{会社員|かいしゃいん}ですか。', ro: 'Sō desu ka. Maruko-san wa kaishain desu ka.', vi: 'Vậy à. Marco là nhân viên văn phòng à?' },
        { who: 'マルコ', role: 'b', text: 'いいえ、{会社員|かいしゃいん}じゃありません。ふじみ{大学|だいがく}の{学生|がくせい}です。ワンさんも{学生|がくせい}ですか。', ro: 'Iie, kaishain ja arimasen. Fujimi daigaku no gakusei desu. Wan-san mo gakusei desu ka.', vi: 'Không, tôi không phải nhân viên văn phòng. Tôi là sinh viên ĐH Fujimi. Wan cũng là học sinh à?' },
        { who: 'ワン', role: 'a', text: 'はい。あおぞら{日本語学校|にほんごがっこう}の{学生|がくせい}です。', ro: 'Hai. Aozora nihongo gakkō no gakusei desu.', vi: 'Vâng. Tôi là học sinh trường tiếng Nhật Aozora.' },
        { who: 'マルコ', role: 'b', text: 'ワンさんの{誕生日|たんじょうび}はいつですか。', ro: 'Wan-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật của Wan là khi nào?' },
        { who: 'ワン', role: 'a', text: '{9月|くがつ}{9日|ここのか}です。', ro: 'Kugatsu kokonoka desu.', vi: 'Ngày 9 tháng 9.' },
        { who: 'マルコ', role: 'b', text: 'そうですか。{趣味|しゅみ}は{何|なん}ですか。', ro: 'Sō desu ka. Shumi wa nan desu ka.', vi: 'Vậy à. Sở thích của bạn là gì?' },
        { who: 'ワン', role: 'a', text: '{料理|りょうり}と{読書|どくしょ}です。', ro: 'Ryōri to dokusho desu.', vi: 'Nấu ăn và đọc sách.' },
        { who: 'マルコ', role: 'b', text: 'あっ、{私|わたし}の{趣味|しゅみ}も{料理|りょうり}です。', ro: 'A!, watashi no shumi mo ryōri desu.', vi: 'Á, sở thích của tôi cũng là nấu ăn.' },
        { who: 'ワン', role: 'a', text: 'わあ、{同|おな}じですね。', ro: 'Wā, onaji desu ne.', vi: 'Oa, giống nhau nhỉ!' },
      ],
    },
    { t: 'h', text: 'できる！ — Kết bạn và giới thiệu bạn mới' },
    {
      t: 'p',
      text: 'Nhiệm vụ cuối bài: hỏi ít nhất 3 bạn cùng lớp về **nước, công việc, sở thích** (và ngày sinh nếu muốn), ghi lại, rồi giới thiệu một người cho người khác. Giới thiệu người khác = nói về **ngôi thứ ba**: bắt đầu bằng tên + さん + は.',
    },
    {
      t: 'examples',
      items: [
        { en: 'ダニエルさんはオーストラリア{人|じん}です。', ro: 'Danieru-san wa Ōsutoraria-jin desu.', vi: 'Anh Daniel là người Úc.' },
        { en: '{会社員|かいしゃいん}です。', ro: 'Kaishain desu.', vi: 'Anh ấy là nhân viên văn phòng.' },
        { en: 'ダニエルさんの{趣味|しゅみ}はテニスと{水泳|すいえい}です。', ro: 'Danieru-san no shumi wa tenisu to suiei desu.', vi: 'Sở thích của Daniel là tennis và bơi lội.' },
        { en: '{誕生日|たんじょうび}は{11月|じゅういちがつ}{3日|みっか}です。', ro: 'Tanjōbi wa jūichigatsu mikka desu.', vi: 'Sinh nhật (anh ấy) là ngày 3 tháng 11.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo giao tiếp kiểu Nhật',
      items: [
        'Khi nói はじめまして và よろしくお願いします, cúi đầu nhẹ (khoảng 15–30°). Trong phòng thi, việc này được tính vào điểm **tác phong**.',
        'Người Nhật hay bỏ chủ ngữ khi đã rõ: nói {私|わたし}は một lần ở câu đầu, các câu sau chỉ cần "{学生|がくせい}です。" "{19歳|じゅうきゅうさい}です。"',
        'Khi người khác nói xong, đáp một câu ngắn "そうですか。" để cho thấy bạn đang nghe — đừng im lặng.',
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b1-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng Bài 1 (52 từ theo danh sách của cô)',
  goal: 'Đọc, nghe hiểu và dùng được đủ 52 mục từ của Bài 1, cộng bảng tháng, ngày, tuổi.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **52 mục** trong danh sách từ mới của cô (đúng thứ tự số 1–52, chia theo 3 chủ đề nhỏ). Mỗi từ: bấm 🔊 nghe → đọc to → đọc câu ví dụ. Cột chữ nhỏ cạnh từ là **romaji** (cách đọc bằng chữ Latin).',
    },
    {
      t: 'note',
      title: 'Ghi nhớ trước khi học',
      items: [
        '**（お）** trước danh từ = cách nói kính trọng khi nói về **người khác**: お{名前|なまえ}, お{国|くに}, お{仕事|しごと}. Nói về **mình** thì bỏ お: {私|わたし}の{名前|なまえ}.',
        '**〜さん** gắn sau tên người khác (anh/chị/bạn…). **Không** gắn sau tên mình.',
        '**〜{人|じん}** gắn sau tên nước = người nước đó: {日本|にほん} → {日本人|にほんじん}.',
        'Từ viết bằng **katakana** (アメリカ, テニス…) là từ vay mượn / tên nước ngoài — không có chữ Hán nên không có furigana.',
      ],
    },

    { t: 'h', text: 'Chủ đề 1a — Tôi, tên, đất nước (1–11, 21–24)' },
    {
      t: 'vocab',
      items: [
        { w: '{私|わたし}', pos: 'đại từ', ipa: 'watashi', vi: 'tôi', ex: '{私|わたし}はワンです。', exRo: 'Watashi wa Wan desu.', exVi: 'Tôi là Wan.' },
        { w: '（お）{名前|なまえ}', pos: 'danh từ', ipa: '(o)namae', vi: 'tên (お{名前|なまえ} = tên của bạn — lịch sự)', ex: 'あのう、お{名前|なまえ}は？', exRo: 'Anō, o-namae wa?', exVi: 'À… tên bạn là gì ạ?' },
        { w: '（お）{国|くに}', pos: 'danh từ', ipa: '(o)kuni', vi: 'đất nước (お{国|くに} = nước của bạn)', ex: 'カルロスさんのお{国|くに}はブラジルです。', exRo: 'Karurosu-san no o-kuni wa Burajiru desu.', exVi: 'Nước của anh Carlos là Brazil.' },
        { w: '{日本|にほん}', pos: 'danh từ (tên nước)', ipa: 'Nihon', vi: 'Nhật Bản', ex: '{木村|きむら}さんのお{国|くに}は{日本|にほん}です。', exRo: 'Kimura-san no o-kuni wa Nihon desu.', exVi: 'Nước của chị Kimura là Nhật Bản.' },
        { w: 'アメリカ', pos: 'danh từ (tên nước)', ipa: 'Amerika', vi: 'Mỹ', ex: 'メアリーさんはアメリカ{人|じん}です。', exRo: 'Mearī-san wa Amerika-jin desu.', exVi: 'Mary là người Mỹ.' },
        { w: 'イタリア', pos: 'danh từ (tên nước)', ipa: 'Itaria', vi: 'Ý (Italy)', ex: 'マルコさんのお{国|くに}はイタリアです。', exRo: 'Maruko-san no o-kuni wa Itaria desu.', exVi: 'Nước của Marco là Ý.' },
        { w: 'オーストラリア', pos: 'danh từ (tên nước)', ipa: 'Ōsutoraria', vi: 'Úc (Australia)', ex: 'ダニエルさんはオーストラリア{人|じん}です。', exRo: 'Danieru-san wa Ōsutoraria-jin desu.', exVi: 'Daniel là người Úc.' },
        { w: '{韓国|かんこく}', pos: 'danh từ (tên nước)', ipa: 'Kankoku', vi: 'Hàn Quốc', ex: 'パクさんは{韓国人|かんこくじん}です。', exRo: 'Paku-san wa Kankokujin desu.', exVi: 'Park là người Hàn Quốc.' },
        { w: 'タイ', pos: 'danh từ (tên nước)', ipa: 'Tai', vi: 'Thái Lan', ex: 'ナタポンさんはタイ{人|じん}です。', exRo: 'Natapon-san wa Tai-jin desu.', exVi: 'Natapon là người Thái.' },
        { w: '{中国|ちゅうごく}', pos: 'danh từ (tên nước)', ipa: 'Chūgoku', vi: 'Trung Quốc', ex: 'ワンさんのお{国|くに}は{中国|ちゅうごく}です。', exRo: 'Wan-san no o-kuni wa Chūgoku desu.', exVi: 'Nước của Wan là Trung Quốc.' },
        { w: 'ロシア', pos: 'danh từ (tên nước)', ipa: 'Roshia', vi: 'Nga', ex: 'アンナさんはロシア{人|じん}です。', exRo: 'Anna-san wa Roshia-jin desu.', exVi: 'Anna là người Nga.' },
        { w: '〜さん', pos: 'hậu tố', ipa: '~san', vi: 'anh / chị / ông / bà / bạn ~ (gọi người khác, không dùng cho mình)', ex: 'ワンさんは{学生|がくせい}です。', exRo: 'Wan-san wa gakusei desu.', exVi: 'Bạn Wan là học sinh.' },
        { w: '〜{人|じん}', pos: 'hậu tố', ipa: '~jin', vi: 'người (nước ~)', ex: '{私|わたし}は{日本人|にほんじん}じゃありません。{中国人|ちゅうごくじん}です。', exRo: 'Watashi wa Nihonjin ja arimasen. Chūgokujin desu.', exVi: 'Tôi không phải người Nhật. Tôi là người Trung Quốc.' },
        { w: 'どちら', pos: 'từ để hỏi', ipa: 'dochira', vi: 'ở đâu / phía nào (lịch sự)', ex: 'マリヤムさん、お{国|くに}はどちらですか。', exRo: 'Mariyamu-san, o-kuni wa dochira desu ka.', exVi: 'Mariyam ơi, bạn đến từ nước nào?' },
        { w: 'お{国|くに}はどちらですか。', pos: 'câu', ipa: 'o-kuni wa dochira desu ka', vi: 'Đất nước của bạn là nước nào? (Bạn đến từ đâu?)', ex: 'お{国|くに}はどちらですか。——タイです。', exRo: 'O-kuni wa dochira desu ka. — Tai desu.', exVi: 'Bạn đến từ nước nào? — Thái Lan.' },
      ],
    },

    { t: 'h', text: 'Chủ đề 1b — Trường học và công việc (12–20)' },
    {
      t: 'vocab',
      items: [
        { w: '{高校|こうこう}', pos: 'danh từ', ipa: 'kōkō', vi: 'trường trung học phổ thông (cấp 3)', ex: '{西川|にしかわ}さんはさくら{高校|こうこう}の{教師|きょうし}です。', exRo: 'Nishikawa-san wa Sakura kōkō no kyōshi desu.', exVi: 'Anh Nishikawa là giáo viên trường THPT Sakura.' },
        { w: '{大学|だいがく}', pos: 'danh từ', ipa: 'daigaku', vi: 'trường đại học', ex: 'マルコさんはふじみ{大学|だいがく}の{学生|がくせい}です。', exRo: 'Maruko-san wa Fujimi daigaku no gakusei desu.', exVi: 'Marco là sinh viên ĐH Fujimi.' },
        { w: '{日本語学校|にほんごがっこう}', pos: 'danh từ', ipa: 'nihongo gakkō', vi: 'trường tiếng Nhật', ex: 'パクさんはあおぞら{日本語学校|にほんごがっこう}の{学生|がくせい}です。', exRo: 'Paku-san wa Aozora nihongo gakkō no gakusei desu.', exVi: 'Park là học sinh trường tiếng Nhật Aozora.' },
        { w: '（お）{仕事|しごと}', pos: 'danh từ', ipa: '(o)shigoto', vi: 'công việc (お{仕事|しごと} = công việc của bạn)', ex: 'お{仕事|しごと}は？——{会社員|かいしゃいん}です。', exRo: 'O-shigoto wa? — Kaishain desu.', exVi: 'Bạn làm nghề gì? — Nhân viên văn phòng.' },
        { w: '{学生|がくせい}', pos: 'danh từ', ipa: 'gakusei', vi: 'học sinh, sinh viên', ex: '{木村|きむら}さんは{学生|がくせい}ですか。——はい、{学生|がくせい}です。', exRo: 'Kimura-san wa gakusei desu ka. — Hai, gakusei desu.', exVi: 'Chị Kimura là sinh viên à? — Vâng, là sinh viên.' },
        { w: '{先生|せんせい}', pos: 'danh từ', ipa: 'sensei', vi: 'thầy / cô giáo (dùng để GỌI hoặc nói về giáo viên khác, không tự xưng)', ex: '{本田|ほんだ}{先生|せんせい}は{日本人|にほんじん}です。', exRo: 'Honda-sensei wa Nihonjin desu.', exVi: 'Thầy Honda là người Nhật.' },
        { w: '{教師|きょうし}', pos: 'danh từ', ipa: 'kyōshi', vi: 'giáo viên (tên NGHỀ — dùng khi nói nghề của mình)', ex: '{私|わたし}はさくら{高校|こうこう}の{教師|きょうし}です。', exRo: 'Watashi wa Sakura kōkō no kyōshi desu.', exVi: 'Tôi là giáo viên trường THPT Sakura.' },
        { w: '{会社員|かいしゃいん}', pos: 'danh từ', ipa: 'kaishain', vi: 'nhân viên văn phòng / nhân viên công ty (nói chung)', ex: 'カルロスさんは{会社員|かいしゃいん}です。', exRo: 'Karurosu-san wa kaishain desu.', exVi: 'Anh Carlos là nhân viên công ty.' },
        { w: '{社員|しゃいん}', pos: 'danh từ', ipa: 'shain', vi: 'nhân viên (của công ty CỤ THỂ — đi với tên công ty)', ex: 'カルロスさんはABEの{社員|しゃいん}です。', exRo: 'Karurosu-san wa ĒBĪĪ no shain desu.', exVi: 'Anh Carlos là nhân viên công ty ABE.' },
      ],
    },

    { t: 'h', text: 'Chủ đề 1c — Chào hỏi và đáp lời (25–33)' },
    {
      t: 'vocab',
      items: [
        { w: 'はじめまして', pos: 'câu chào', ipa: 'hajimemashite', vi: 'Rất vui được gặp (chào lần đầu gặp mặt)', ex: 'はじめまして。パクです。', exRo: 'Hajimemashite. Paku desu.', exVi: 'Rất vui được gặp. Tôi là Park.' },
        { w: '（どうぞ）よろしくお{願|ねが}いします', pos: 'câu chào', ipa: '(dōzo) yoroshiku onegaishimasu', vi: 'Rất mong nhận được sự giúp đỡ (câu kết khi tự giới thiệu)', ex: 'ダニエルです。どうぞよろしくお{願|ねが}いします。', exRo: 'Danieru desu. Dōzo yoroshiku onegaishimasu.', exVi: 'Tôi là Daniel. Rất mong được giúp đỡ.' },
        { w: 'こちらこそ', pos: 'câu đáp', ipa: 'kochira koso', vi: 'Tôi cũng vậy / Chính tôi mới phải (đáp lại よろしく)', ex: 'こちらこそ、よろしくお{願|ねが}いします。', exRo: 'Kochira koso, yoroshiku onegaishimasu.', exVi: 'Chính tôi mới mong được giúp đỡ.' },
        { w: 'あのう', pos: 'thán từ', ipa: 'anō', vi: 'À… / Anh (chị) ơi… (mở lời ngập ngừng, lịch sự)', ex: 'あのう、お{仕事|しごと}は？', exRo: 'Anō, o-shigoto wa?', exVi: 'À… bạn làm nghề gì?' },
        { w: 'すみません', pos: 'câu', ipa: 'sumimasen', vi: 'Xin lỗi… / Cho tôi hỏi… (gọi người, xin lỗi)', ex: 'すみません。お{名前|なまえ}は？', exRo: 'Sumimasen. O-namae wa?', exVi: 'Xin lỗi, tên bạn là gì?' },
        { w: 'あのう、すみません。', pos: 'câu', ipa: 'anō, sumimasen', vi: 'Anh/chị ơi, xin lỗi cho tôi hỏi một chút…', ex: 'あのう、すみません。{学生|がくせい}ですか。', exRo: 'Anō, sumimasen. Gakusei desu ka.', exVi: 'Xin lỗi cho hỏi, bạn là sinh viên à?' },
        { w: 'そうですか', pos: 'câu đáp', ipa: 'sō desu ka', vi: 'Thế à! / Vậy à (xuống giọng: đã nghe hiểu)', ex: 'ブラジルです。——そうですか。', exRo: 'Burajiru desu. — Sō desu ka.', exVi: 'Brazil. — Vậy à.' },
        { w: 'はい', pos: 'từ trả lời', ipa: 'hai', vi: 'Dạ, vâng, có', ex: 'はい、{会社員|かいしゃいん}です。', exRo: 'Hai, kaishain desu.', exVi: 'Vâng, tôi là nhân viên công ty.' },
        { w: 'いいえ', pos: 'từ trả lời', ipa: 'iie', vi: 'Không, không phải', ex: 'いいえ、{学生|がくせい}じゃありません。', exRo: 'Iie, gakusei ja arimasen.', exVi: 'Không, tôi không phải sinh viên.' },
      ],
    },

    { t: 'h', text: 'Chủ đề 2 — Ngày sinh và tuổi (34–39)' },
    {
      t: 'vocab',
      items: [
        { w: '{誕生日|たんじょうび}', pos: 'danh từ', ipa: 'tanjōbi', vi: 'ngày sinh, sinh nhật', ex: 'アンナさんの{誕生日|たんじょうび}は{5月|ごがつ}{5日|いつか}です。', exRo: 'Anna-san no tanjōbi wa gogatsu itsuka desu.', exVi: 'Sinh nhật của Anna là ngày 5 tháng 5.' },
        { w: 'ブラジル', pos: 'danh từ (tên nước)', ipa: 'Burajiru', vi: 'Brazil', ex: 'カルロスさんはブラジル{人|じん}です。', exRo: 'Karurosu-san wa Burajiru-jin desu.', exVi: 'Carlos là người Brazil.' },
        { w: '〜{月|がつ}', pos: 'hậu tố', ipa: '~gatsu', vi: 'tháng ~', ex: '{私|わたし}の{誕生日|たんじょうび}は{12月|じゅうにがつ}です。', exRo: 'Watashi no tanjōbi wa jūnigatsu desu.', exVi: 'Sinh nhật tôi vào tháng 12.' },
        { w: '〜{日|にち}', pos: 'hậu tố', ipa: '~nichi / ~ka', vi: 'ngày (mùng) ~ (ngày 1–10, 14, 20, 24 đọc riêng — xem bảng)', ex: '{6月|ろくがつ}{15日|じゅうごにち}です。', exRo: 'Rokugatsu jūgo-nichi desu.', exVi: 'Ngày 15 tháng 6.' },
        { w: '〜{歳|さい}', pos: 'hậu tố', ipa: '~sai', vi: '~ tuổi', ex: '{私|わたし}は{18歳|じゅうはっさい}です。', exRo: 'Watashi wa jūhassai desu.', exVi: 'Tôi 18 tuổi.' },
        { w: 'いつ', pos: 'từ để hỏi', ipa: 'itsu', vi: 'khi nào, lúc nào', ex: '{誕生日|たんじょうび}はいつですか。', exRo: 'Tanjōbi wa itsu desu ka.', exVi: 'Sinh nhật bạn là khi nào?' },
      ],
    },
    {
      t: 'table',
      caption: 'Tháng (〜月) — ⚠ ba tháng 4, 7, 9 đọc đặc biệt',
      head: ['Tháng', 'Đọc', 'Romaji', 'Tháng', 'Đọc', 'Romaji'],
      rows: [
        ['1月', 'いちがつ', 'ichigatsu', '7月', '**しちがつ** ⚠', 'shichigatsu'],
        ['2月', 'にがつ', 'nigatsu', '8月', 'はちがつ', 'hachigatsu'],
        ['3月', 'さんがつ', 'sangatsu', '9月', '**くがつ** ⚠', 'kugatsu'],
        ['4月', '**しがつ** ⚠', 'shigatsu', '10月', 'じゅうがつ', 'jūgatsu'],
        ['5月', 'ごがつ', 'gogatsu', '11月', 'じゅういちがつ', 'jūichigatsu'],
        ['6月', 'ろくがつ', 'rokugatsu', '12月', 'じゅうにがつ', 'jūnigatsu'],
        ['何月', 'なんがつ', 'nangatsu', '', '', ''],
      ],
    },
    {
      t: 'table',
      caption: 'Ngày (〜日) — ngày 1–10 đọc bằng âm Nhật cổ; từ 11 trở đi = số + にち, trừ 14, 20, 24',
      head: ['Ngày', 'Đọc', 'Ngày', 'Đọc', 'Ngày', 'Đọc'],
      rows: [
        ['1日', '**ついたち**', '11日', 'じゅういちにち', '21日', 'にじゅういちにち'],
        ['2日', '**ふつか**', '12日', 'じゅうににち', '22日', 'にじゅうににち'],
        ['3日', '**みっか**', '13日', 'じゅうさんにち', '23日', 'にじゅうさんにち'],
        ['4日', '**よっか**', '14日', '**じゅうよっか**', '24日', '**にじゅうよっか**'],
        ['5日', '**いつか**', '15日', 'じゅうごにち', '25日', 'にじゅうごにち'],
        ['6日', '**むいか**', '16日', 'じゅうろくにち', '26日', 'にじゅうろくにち'],
        ['7日', '**なのか**', '17日', 'じゅうしちにち', '27日', 'にじゅうしちにち'],
        ['8日', '**ようか**', '18日', 'じゅうはちにち', '28日', 'にじゅうはちにち'],
        ['9日', '**ここのか**', '19日', 'じゅうくにち', '29日', 'にじゅうくにち'],
        ['10日', '**とおか**', '20日', '**はつか**', '30日', 'さんじゅうにち'],
        ['何日', 'なんにち', '', '', '31日', 'さんじゅういちにち'],
      ],
    },
    {
      t: 'table',
      caption: 'Tuổi (〜歳) — số 1, 8, 10 đổi âm (có っ); 20 tuổi = はたち',
      head: ['Tuổi', 'Đọc', 'Tuổi', 'Đọc'],
      rows: [
        ['1歳', '**いっさい**', '11歳', 'じゅういっさい'],
        ['2歳', 'にさい', '18歳', '**じゅうはっさい**'],
        ['3歳', 'さんさい', '19歳', 'じゅうきゅうさい'],
        ['4歳', 'よんさい', '20歳', '**はたち** (hoặc にじゅっさい)'],
        ['5歳', 'ごさい', '21歳', 'にじゅういっさい'],
        ['6歳', 'ろくさい', '26歳', 'にじゅうろくさい'],
        ['7歳', 'ななさい', '30歳', 'さんじゅっさい'],
        ['8歳', '**はっさい**', '31歳', 'さんじゅういっさい'],
        ['9歳', 'きゅうさい', '48歳', 'よんじゅうはっさい'],
        ['10歳', '**じゅっさい**', '何歳', 'なんさい (lịch sự hơn: おいくつ)'],
      ],
    },

    { t: 'h', text: 'Chủ đề 3 — Sở thích (40–52)' },
    {
      t: 'vocab',
      items: [
        { w: '{趣味|しゅみ}', pos: 'danh từ', ipa: 'shumi', vi: 'sở thích', ex: '{趣味|しゅみ}は{何|なん}ですか。', exRo: 'Shumi wa nan desu ka.', exVi: 'Sở thích của bạn là gì?' },
        { w: 'スポーツ', pos: 'danh từ', ipa: 'supōtsu', vi: 'thể thao', ex: '{西川|にしかわ}さんの{趣味|しゅみ}はスポーツです。', exRo: 'Nishikawa-san no shumi wa supōtsu desu.', exVi: 'Sở thích của anh Nishikawa là thể thao.' },
        { w: 'サッカー', pos: 'danh từ', ipa: 'sakkā', vi: 'bóng đá', ex: 'マルコさんの{趣味|しゅみ}はサッカーです。', exRo: 'Maruko-san no shumi wa sakkā desu.', exVi: 'Sở thích của Marco là bóng đá.' },
        { w: 'テニス', pos: 'danh từ', ipa: 'tenisu', vi: 'tennis (quần vợt)', ex: '{私|わたし}の{趣味|しゅみ}はテニスです。', exRo: 'Watashi no shumi wa tenisu desu.', exVi: 'Sở thích của tôi là tennis.' },
        { w: '{水泳|すいえい}', pos: 'danh từ', ipa: 'suiei', vi: 'bơi lội', ex: 'パクさんの{趣味|しゅみ}は{水泳|すいえい}です。', exRo: 'Paku-san no shumi wa suiei desu.', exVi: 'Sở thích của Park là bơi lội.' },
        { w: '{映画|えいが}', pos: 'danh từ', ipa: 'eiga', vi: 'phim, điện ảnh', ex: '{趣味|しゅみ}は{映画|えいが}です。', exRo: 'Shumi wa eiga desu.', exVi: 'Sở thích (của tôi) là xem phim.' },
        { w: '{音楽|おんがく}', pos: 'danh từ', ipa: 'ongaku', vi: 'âm nhạc', ex: 'メアリーさんの{趣味|しゅみ}は{音楽|おんがく}です。', exRo: 'Mearī-san no shumi wa ongaku desu.', exVi: 'Sở thích của Mary là âm nhạc.' },
        { w: '{読書|どくしょ}', pos: 'danh từ', ipa: 'dokusho', vi: 'đọc sách', ex: 'ワンさんの{趣味|しゅみ}は{読書|どくしょ}です。', exRo: 'Wan-san no shumi wa dokusho desu.', exVi: 'Sở thích của Wan là đọc sách.' },
        { w: '{旅行|りょこう}', pos: 'danh từ', ipa: 'ryokō', vi: 'du lịch', ex: '{私|わたし}の{趣味|しゅみ}は{旅行|りょこう}と{映画|えいが}です。', exRo: 'Watashi no shumi wa ryokō to eiga desu.', exVi: 'Sở thích của tôi là du lịch và phim.' },
        { w: '{料理|りょうり}', pos: 'danh từ', ipa: 'ryōri', vi: 'nấu ăn; món ăn', ex: 'ナタポンさんの{趣味|しゅみ}は{料理|りょうり}です。', exRo: 'Natapon-san no shumi wa ryōri desu.', exVi: 'Sở thích của Natapon là nấu ăn.' },
        { w: '{私|わたし}の{趣味|しゅみ}は{料理|りょうり}です。', pos: 'câu', ipa: 'watashi no shumi wa ryōri desu', vi: 'Sở thích của tôi là nấu ăn.', ex: '{私|わたし}の{趣味|しゅみ}は{料理|りょうり}です。ワンさんは？', exRo: 'Watashi no shumi wa ryōri desu. Wan-san wa?', exVi: 'Sở thích của tôi là nấu ăn. Còn Wan?' },
        { w: '{何|なん}', pos: 'từ để hỏi', ipa: 'nan (nani)', vi: 'cái gì (trước です đọc なん)', ex: 'アンナさんの{趣味|しゅみ}は{何|なん}ですか。', exRo: 'Anna-san no shumi wa nan desu ka.', exVi: 'Sở thích của Anna là gì?' },
        { w: 'あ（っ）', pos: 'thán từ', ipa: 'a(!)', vi: 'A! Á! (ngạc nhiên, chợt nhận ra)', ex: 'あっ、{私|わたし}の{趣味|しゅみ}もサッカーです。', exRo: 'A!, watashi no shumi mo sakkā desu.', exVi: 'Á, sở thích của tôi cũng là bóng đá.' },
      ],
    },

    { t: 'h', text: 'Thêm để nói về mình (ngoài danh sách của cô)' },
    { t: 'p', text: 'Không có trong danh sách từ mới, nhưng bạn **cần** để tự giới thiệu và để hiểu hội thoại / đề thi.' },
    {
      t: 'vocab',
      items: [
        { w: 'ベトナム', pos: 'danh từ (tên nước)', ipa: 'Betonamu', vi: 'Việt Nam', ex: '{私|わたし}はベトナム{人|じん}です。', exRo: 'Watashi wa Betonamu-jin desu.', exVi: 'Tôi là người Việt Nam.' },
        { w: 'こんにちは', pos: 'câu chào', ipa: 'konnichiwa', vi: 'Xin chào (ban ngày)', ex: 'こんにちは。はじめまして。', exRo: 'Konnichiwa. Hajimemashite.', exVi: 'Xin chào. Rất vui được gặp.' },
        { w: '{何歳|なんさい}', pos: 'từ để hỏi', ipa: 'nansai', vi: 'mấy tuổi (lịch sự hơn: おいくつ)', ex: 'マリヤムさんは{何歳|なんさい}ですか。', exRo: 'Mariyamu-san wa nansai desu ka.', exVi: 'Mariyam bao nhiêu tuổi?' },
        { w: '{二十歳|はたち}', pos: 'danh từ', ipa: 'hatachi', vi: '20 tuổi (cách đọc đặc biệt)', ex: '{私|わたし}は{二十歳|はたち}です。', exRo: 'Watashi wa hatachi desu.', exVi: 'Tôi 20 tuổi.' },
        { w: 'わあ', pos: 'thán từ', ipa: 'wā', vi: 'Oa! (vui, ngạc nhiên)', ex: 'わあ、{同|おな}じですね。', exRo: 'Wā, onaji desu ne.', exVi: 'Oa, giống nhau nhỉ.' },
        { w: '{同|おな}じですね', pos: 'câu', ipa: 'onaji desu ne', vi: 'Giống nhau nhỉ!', ex: '{私|わたし}の{趣味|しゅみ}も{映画|えいが}です。——{同|おな}じですね。', exRo: 'Watashi no shumi mo eiga desu. — Onaji desu ne.', exVi: 'Sở thích của tôi cũng là phim. — Giống nhau nhỉ.' },
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b1-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp Bài 1 — ポイント 1–6',
  goal: 'Dùng đúng は・です・ですか・じゃありません・どちら/いつ/何・の・と・も để nói và hỏi về một người.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Bài 1 có **6 điểm ngữ pháp** (ポイント 1–6). Mọi câu ví dụ chỉ dùng từ của Bài 1, nên học xong mỗi điểm bạn **hỏi và trả lời được ngay**. Ký hiệu: **N** = danh từ (người, vật, nơi chốn, số…).',
    },

    /* ── ポイント 1 ── */
    { t: 'h', text: 'ポイント 1 — N1 は N2 です (N1 là N2)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2 です',
          vi: 'N1 là N2 (câu khẳng định, lịch sự)',
          examples: [
            { en: '{私|わたし}は{学生|がくせい}です。', ro: 'Watashi wa gakusei desu.', vi: 'Tôi là sinh viên.' },
            { en: 'ワンさんは{中国人|ちゅうごくじん}です。', ro: 'Wan-san wa Chūgokujin desu.', vi: 'Wan là người Trung Quốc.' },
            { en: 'カルロスさんは{会社員|かいしゃいん}です。', ro: 'Karurosu-san wa kaishain desu.', vi: 'Carlos là nhân viên công ty.' },
            { en: '{私|わたし}は{19歳|じゅうきゅうさい}です。', ro: 'Watashi wa jūkyū-sai desu.', vi: 'Tôi 19 tuổi.' },
          ],
        },
        {
          formula: '（N1 は）N2 です',
          vi: 'Bỏ N1 khi người nghe đã biết đang nói về ai',
          examples: [
            { en: 'パクです。{韓国人|かんこくじん}です。', ro: 'Paku desu. Kankokujin desu.', vi: '(Tôi) là Park. (Tôi) là người Hàn.' },
            { en: '{教師|きょうし}です。', ro: 'Kyōshi desu.', vi: '(Tôi) là giáo viên.' },
          ],
        },
        {
          formula: 'N は？',
          vi: 'Hỏi rút gọn "N thì sao?" — lên giọng ở cuối',
          examples: [
            { en: 'お{名前|なまえ}は？——アンナです。', ro: 'O-namae wa? — Anna desu.', vi: 'Tên bạn? — Là Anna.' },
            { en: 'お{仕事|しごと}は？——{会社員|かいしゃいん}です。', ro: 'O-shigoto wa? — Kaishain desu.', vi: 'Công việc của bạn? — Nhân viên công ty.' },
            { en: '{木村|きむら}さんは？——{私|わたし}も{学生|がくせい}です。', ro: 'Kimura-san wa? — Watashi mo gakusei desu.', vi: 'Còn Kimura? — Tôi cũng là sinh viên.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**は** là trợ từ chủ đề: nó đánh dấu "câu này nói về cái gì". Viết bằng chữ は nhưng **đọc là "wa"**. **です** đặt cuối câu, nghĩa "là", làm câu lịch sự. です **không đổi** theo ngôi (tôi/bạn/anh ấy), số (một/nhiều người) hay giới tính — tiếng Nhật không chia động từ theo chủ ngữ như tiếng Anh.',
    },
    {
      t: 'table',
      caption: 'Tách câu 私は学生です thành từng mảnh',
      head: ['Mảnh', 'Đọc', 'Vai trò', 'Nghĩa'],
      rows: [
        ['{私|わたし}', 'watashi', 'N1 — chủ đề', 'tôi'],
        ['は', '**wa** (không đọc "ha")', 'trợ từ chủ đề', '(nói về) …'],
        ['{学生|がくせい}', 'gakusei', 'N2 — thông tin', 'sinh viên'],
        ['です', 'desu (u gần như câm: "des")', 'kết câu lịch sự', 'là'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — chọn một người ở cột 1, nói [người] は [một ô cùng hàng] です. Mỗi hàng nói được 3 câu.',
      head: ['N1 (ai?)', 'N2: người nước nào', 'N2: làm gì', 'N2: mấy tuổi'],
      rows: [
        ['パクさん', '{韓国人|かんこくじん}', '{学生|がくせい}', '{26歳|にじゅうろくさい}'],
        ['カルロスさん', 'ブラジル{人|じん}', '{会社員|かいしゃいん}', '{31歳|さんじゅういっさい}'],
        ['メアリーさん', 'アメリカ{人|じん}', '{教師|きょうし}', '{45歳|よんじゅうごさい}'],
        ['{木村|きむら}さん', '{日本人|にほんじん}', '{学生|がくせい}', '{二十歳|はたち}'],
        ['ダニエルさん', 'オーストラリア{人|じん}', '{会社員|かいしゃいん}', '{28歳|にじゅうはっさい}'],
        ['{私|わたし}', '(nước của bạn)+{人|じん}', '{学生|がくせい}', '(tuổi của bạn)'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Đọc trợ từ は thành "ha": ~~watashi ha~~ → **watashi wa**. Chỉ khi は là trợ từ mới đọc "wa"; trong từ はじめまして thì vẫn đọc "ha".',
        'Gắn さん cho chính mình: ~~{私|わたし}はワンさんです。~~ → **{私|わたし}はワンです。** さん chỉ để gọi người khác.',
        'Bỏ です: ~~{私|わたし}は{学生|がくせい}。~~ Trong lớp và trong phòng thi, câu lịch sự luôn kết bằng **です**.',
        'Nhầm "người nước" với "nước": ~~ワンさんは{中国|ちゅうごく}です。~~ → **ワンさんは{中国人|ちゅうごくじん}です。** (Wan là người TQ). Nói về nước thì dùng お{国|くに}: ワンさんのお{国|くに}は{中国|ちゅうごく}です。',
        'Lặp 私は ở mọi câu nghe rất cứng: nói {私|わたし}は một lần, các câu sau bỏ đi.',
        'Tự nói nghề mình là giáo viên: nên dùng **{教師|きょうし}** (tên nghề); **{先生|せんせい}** là từ để gọi/nói về thầy cô khác.',
      ],
    },

    /* ── ポイント 2 ── */
    { t: 'h', text: 'ポイント 2 — N1 は N2 ですか ／ はい・いいえ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2 ですか',
          vi: 'Câu hỏi có/không: thêm か sau です',
          examples: [
            { en: 'ワンさんは{学生|がくせい}ですか。', ro: 'Wan-san wa gakusei desu ka.', vi: 'Wan là học sinh phải không?' },
            { en: 'カルロスさんは{日本人|にほんじん}ですか。', ro: 'Karurosu-san wa Nihonjin desu ka.', vi: 'Carlos là người Nhật à?' },
          ],
        },
        {
          formula: 'はい、（N1 は）N2 です',
          vi: 'Trả lời CÓ: はい + nhắc lại câu',
          examples: [
            { en: 'はい、{学生|がくせい}です。', ro: 'Hai, gakusei desu.', vi: 'Vâng, là học sinh.' },
            { en: 'はい、{私|わたし}は{学生|がくせい}です。', ro: 'Hai, watashi wa gakusei desu.', vi: 'Vâng, tôi là học sinh.' },
          ],
        },
        {
          formula: 'いいえ、N2 じゃありません',
          vi: 'Trả lời KHÔNG: いいえ + N2 じゃありません (+ nói thông tin đúng)',
          examples: [
            { en: 'いいえ、{日本人|にほんじん}じゃありません。ブラジル{人|じん}です。', ro: 'Iie, Nihonjin ja arimasen. Burajiru-jin desu.', vi: 'Không, tôi không phải người Nhật. Tôi là người Brazil.' },
            { en: 'いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。', ro: 'Iie, gakusei ja arimasen. Kaishain desu.', vi: 'Không, không phải sinh viên. Là nhân viên công ty.' },
          ],
        },
        {
          formula: 'N2 ではありません',
          vi: 'Cùng nghĩa với じゃありません nhưng trang trọng hơn (hay gặp trong văn viết, bài đọc)',
          examples: [
            { en: '{私|わたし}は{教師|きょうし}ではありません。', ro: 'Watashi wa kyōshi de wa arimasen.', vi: 'Tôi không phải giáo viên.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**か** ở cuối câu biến câu khẳng định thành câu hỏi — giống "…không?", "…à?" của tiếng Việt. Vì đã có か nên sách viết dấu **。** chứ không cần **？**; khi nói thì **lên giọng** ở か. Trả lời: nói **はい** hoặc **いいえ** trước, rồi nhắc lại câu. Phủ định của です là **じゃありません** (thay hẳn です, không giữ です). Sau いいえ nên nói luôn thông tin đúng — người Nhật (và giám thị) chờ câu đó.',
    },
    {
      t: 'table',
      caption: 'Ba dạng của một câu',
      head: ['Dạng', 'Đuôi câu', 'Ví dụ'],
      rows: [
        ['Khẳng định', '〜です', '{会社員|かいしゃいん}です。 — Là nhân viên công ty.'],
        ['Phủ định', '〜じゃありません', '{会社員|かいしゃいん}じゃありません。 — Không phải nhân viên công ty.'],
        ['Câu hỏi', '〜ですか', '{会社員|かいしゃいん}ですか。 — Là nhân viên công ty à?'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp (có và không)',
      lines: [
        { who: '木村', role: 'a', text: 'ダニエルさんは{学生|がくせい}ですか。', ro: 'Danieru-san wa gakusei desu ka.', vi: 'Daniel là sinh viên à?' },
        { who: 'ダニエル', role: 'b', text: 'いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。', ro: 'Iie, gakusei ja arimasen. Kaishain desu.', vi: 'Không, tôi không phải sinh viên. Tôi là nhân viên công ty.' },
        { who: '木村', role: 'a', text: 'そうですか。', ro: 'Sō desu ka.', vi: 'Vậy à.' },
        { who: 'ダニエル', role: 'b', text: '{木村|きむら}さんは{学生|がくせい}ですか。', ro: 'Kimura-san wa gakusei desu ka.', vi: 'Kimura là sinh viên à?' },
        { who: '木村', role: 'a', text: 'はい、{学生|がくせい}です。ふじみ{大学|だいがく}の{学生|がくせい}です。', ro: 'Hai, gakusei desu. Fujimi daigaku no gakusei desu.', vi: 'Vâng, là sinh viên. Sinh viên ĐH Fujimi.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'パクさんは{韓国人|かんこくじん}ですか。——はい、{韓国人|かんこくじん}です。', ro: 'Paku-san wa Kankokujin desu ka. — Hai, Kankokujin desu.', vi: 'Park là người Hàn à? — Vâng, là người Hàn.' },
        { en: 'マルコさんはロシア{人|じん}ですか。——いいえ、ロシア{人|じん}じゃありません。イタリア{人|じん}です。', ro: 'Maruko-san wa Roshia-jin desu ka. — Iie, Roshia-jin ja arimasen. Itaria-jin desu.', vi: 'Marco là người Nga à? — Không, không phải người Nga. Là người Ý.' },
        { en: '{本田先生|ほんだせんせい}は{日本人|にほんじん}ですか。——はい、{日本人|にほんじん}です。', ro: 'Honda-sensei wa Nihonjin desu ka. — Hai, Nihonjin desu.', vi: 'Thầy Honda là người Nhật à? — Vâng, là người Nhật.' },
        { en: 'ナタポンさんは{教師|きょうし}ですか。——いいえ、{教師|きょうし}じゃありません。{会社員|かいしゃいん}です。', ro: 'Natapon-san wa kyōshi desu ka. — Iie, kyōshi ja arimasen. Kaishain desu.', vi: 'Natapon là giáo viên à? — Không, không phải giáo viên. Là nhân viên công ty.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — đổi từ ở cột 1 và nói đủ ba câu',
      head: ['Câu hỏi: 〜さんは ___ ですか', 'はい、___ です', 'いいえ、___ じゃありません'],
      rows: [
        ['{学生|がくせい}ですか', 'はい、{学生|がくせい}です', 'いいえ、{学生|がくせい}じゃありません'],
        ['{会社員|かいしゃいん}ですか', 'はい、{会社員|かいしゃいん}です', 'いいえ、{会社員|かいしゃいん}じゃありません'],
        ['{教師|きょうし}ですか', 'はい、{教師|きょうし}です', 'いいえ、{教師|きょうし}じゃありません'],
        ['{日本人|にほんじん}ですか', 'はい、{日本人|にほんじん}です', 'いいえ、{日本人|にほんじん}じゃありません'],
        ['{中国人|ちゅうごくじん}ですか', 'はい、{中国人|ちゅうごくじん}です', 'いいえ、{中国人|ちゅうごくじん}じゃありません'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Chỉ đáp "はい" hoặc "いいえ" rồi thôi. Trong phòng thi, trả lời cụt mất điểm; **quên はい／いいえ cũng bị trừ**. Luôn: はい／いいえ + cả câu.',
        '~~いいえ、{学生|がくせい}です。~~ khi ý là "không phải sinh viên" → **いいえ、{学生|がくせい}じゃありません。**',
        '~~{学生|がくせい}じゃありませんです。~~ — じゃありません đã thay chỗ です, không thêm です nữa.',
        '~~{学生|がくせい}です？~~ (chỉ lên giọng, không có か) là kiểu nói suồng sã. Câu hỏi lịch sự: **ですか**.',
        '**そうですか** không phải câu hỏi: nói xuống giọng = "à, vậy à". Nếu lên giọng lại thành "thật à?" (nghi ngờ).',
      ],
    },

    /* ── ポイント 3 ── */
    { t: 'h', text: 'ポイント 3 — N は どちら／いつ／何 ですか' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は どちら ですか',
          vi: 'Hỏi NƠI CHỐN / NƯỚC (lịch sự)',
          examples: [
            { en: 'お{国|くに}はどちらですか。——{中国|ちゅうごく}です。', ro: 'O-kuni wa dochira desu ka. — Chūgoku desu.', vi: 'Bạn đến từ nước nào? — Trung Quốc.' },
          ],
        },
        {
          formula: 'N は いつ ですか',
          vi: 'Hỏi THỜI ĐIỂM (khi nào)',
          examples: [
            { en: '{誕生日|たんじょうび}はいつですか。——{3月|さんがつ}{3日|みっか}です。', ro: 'Tanjōbi wa itsu desu ka. — Sangatsu mikka desu.', vi: 'Sinh nhật bạn khi nào? — Ngày 3 tháng 3.' },
          ],
        },
        {
          formula: 'N は なん ですか',
          vi: 'Hỏi CÁI GÌ (何 trước です đọc なん)',
          examples: [
            { en: '{趣味|しゅみ}は{何|なん}ですか。——テニスです。', ro: 'Shumi wa nan desu ka. — Tenisu desu.', vi: 'Sở thích của bạn là gì? — Tennis.' },
          ],
        },
        {
          formula: '（N は）なんさい ですか',
          vi: 'Hỏi TUỔI: 何 + 歳 (lịch sự hơn: おいくつですか)',
          examples: [
            { en: 'マリヤムさんは{何歳|なんさい}ですか。——{26歳|にじゅうろくさい}です。', ro: 'Mariyamu-san wa nansai desu ka. — Nijūroku-sai desu.', vi: 'Mariyam bao nhiêu tuổi? — 26 tuổi.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Quy tắc vàng: **hỏi chỗ nào — đáp chỗ đó**. Câu hỏi và câu trả lời có cùng một khuôn "N は ___ です"; từ để hỏi (どちら, いつ, 何) đứng đúng chỗ của thông tin, **không** đưa lên đầu câu như tiếng Anh. Khi trả lời, chỉ cần thay từ để hỏi bằng thông tin và bỏ か. Các câu hỏi rút gọn お{名前|なまえ}は？ お{仕事|しごと}は？ (ポイント 1) cũng trả lời theo đúng cách này.',
    },
    {
      t: 'table',
      caption: 'Hỏi chỗ nào — đáp chỗ đó',
      head: ['Câu hỏi', 'Câu trả lời', 'Nghĩa'],
      rows: [
        ['お{国|くに}は **どちら** ですか。', '**ブラジル** です。', 'Nước bạn? — Brazil.'],
        ['{誕生日|たんじょうび}は **いつ** ですか。', '**{5月|ごがつ}{4日|よっか}** です。', 'Sinh nhật? — Ngày 4/5.'],
        ['{趣味|しゅみ}は **{何|なん}** ですか。', '**{読書|どくしょ}** です。', 'Sở thích? — Đọc sách.'],
        ['**{何歳|なんさい}** ですか。', '**{21歳|にじゅういっさい}** です。', 'Mấy tuổi? — 21 tuổi.'],
        ['お{名前|なまえ}は？', '**アンナ** です。', 'Tên? — Anna.'],
        ['お{仕事|しごと}は？', '**{会社員|かいしゃいん}** です。', 'Nghề? — Nhân viên công ty.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Phỏng vấn làm quen (dùng đủ どちら・いつ・何)',
      lines: [
        { who: '本田先生', role: 'b', text: 'メアリーさん、お{国|くに}はどちらですか。', ro: 'Mearī-san, o-kuni wa dochira desu ka.', vi: 'Mary, em đến từ nước nào?' },
        { who: 'メアリー', role: 'a', text: 'アメリカです。', ro: 'Amerika desu.', vi: 'Mỹ ạ.' },
        { who: '本田先生', role: 'b', text: '{誕生日|たんじょうび}はいつですか。', ro: 'Tanjōbi wa itsu desu ka.', vi: 'Sinh nhật em khi nào?' },
        { who: 'メアリー', role: 'a', text: '{12月|じゅうにがつ}{24日|にじゅうよっか}です。', ro: 'Jūnigatsu nijūyokka desu.', vi: 'Ngày 24 tháng 12 ạ.' },
        { who: '本田先生', role: 'b', text: '{趣味|しゅみ}は{何|なん}ですか。', ro: 'Shumi wa nan desu ka.', vi: 'Sở thích của em là gì?' },
        { who: 'メアリー', role: 'a', text: '{旅行|りょこう}です。', ro: 'Ryokō desu.', vi: 'Du lịch ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — chọn một câu hỏi, trả lời bằng một ô ở cột phải',
      head: ['Câu hỏi', 'Khuôn trả lời', 'Từ lắp vào'],
      rows: [
        ['お{国|くに}はどちらですか。', '___ です。', '{日本|にほん}・{韓国|かんこく}・{中国|ちゅうごく}・タイ・アメリカ・イタリア・オーストラリア・ロシア・ブラジル'],
        ['{誕生日|たんじょうび}はいつですか。', '___{月|がつ} ___{日|にち} です。', '{1月|いちがつ}{1日|ついたち}・{4月|しがつ}{20日|はつか}・{7月|しちがつ}{7日|なのか}・{9月|くがつ}{14日|じゅうよっか}'],
        ['{趣味|しゅみ}は{何|なん}ですか。', '___ です。', 'スポーツ・サッカー・テニス・{水泳|すいえい}・{映画|えいが}・{音楽|おんがく}・{読書|どくしょ}・{旅行|りょこう}・{料理|りょうり}'],
        ['{何歳|なんさい}ですか。', '___{歳|さい} です。', '{18歳|じゅうはっさい}・{19歳|じゅうきゅうさい}・{二十歳|はたち}・{21歳|にじゅういっさい}'],
        ['お{仕事|しごと}は？', '___ です。', '{学生|がくせい}・{会社員|かいしゃいん}・{教師|きょうし}'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Đọc 何ですか thành ~~nani desu ka~~ → **nan desu ka**. Trước です, 何 luôn đọc **なん**.',
        'Đưa từ để hỏi lên đầu như tiếng Anh: ~~どちらはお{国|くに}ですか。~~ → **お{国|くに}はどちらですか。**',
        'Hỏi お{国|くに}は？ (nước nào) thì đáp **tên nước**: ベトナムです. Chỉ khi hỏi {何人|なにじん}ですか (người nước nào) mới đáp ベトナム{人|じん}です.',
        'Tự nói về mình mà thêm お: ~~{私|わたし}のお{名前|なまえ}は…~~ → **{私|わたし}の{名前|なまえ}は…**',
        'Đọc sai ngày tháng: ~~よんがつ~~ → しがつ · ~~きゅうがつ~~ → くがつ · ~~よんにち~~ → よっか · ~~にじゅうにち~~ → はつか · ~~いちにち~~ (ngày 1) → ついたち.',
        'Trả lời いつ không cần thêm gì: ~~{5月|ごがつ}{4日|よっか}にです~~ → **{5月|ごがつ}{4日|よっか}です**.',
      ],
    },

    /* ── ポイント 4 ── */
    { t: 'h', text: 'ポイント 4 — N1 の N2' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 (trường/công ty) の N2 (người)',
          vi: 'N2 thuộc về tổ chức N1: "sinh viên trường…", "nhân viên công ty…"',
          examples: [
            { en: '{私|わたし}はふじみ{大学|だいがく}の{学生|がくせい}です。', ro: 'Watashi wa Fujimi daigaku no gakusei desu.', vi: 'Tôi là sinh viên ĐH Fujimi.' },
            { en: 'カルロスさんはABEの{社員|しゃいん}です。', ro: 'Karurosu-san wa ĒBĪĪ no shain desu.', vi: 'Carlos là nhân viên công ty ABE.' },
            { en: '{西川|にしかわ}さんはさくら{高校|こうこう}の{教師|きょうし}です。', ro: 'Nishikawa-san wa Sakura kōkō no kyōshi desu.', vi: 'Nishikawa là giáo viên trường THPT Sakura.' },
          ],
        },
        {
          formula: 'N1 (người) の N2 (điều/vật)',
          vi: 'N2 của N1: "tên của tôi", "sở thích của Wan"',
          examples: [
            { en: '{私|わたし}の{名前|なまえ}はアンナです。', ro: 'Watashi no namae wa Anna desu.', vi: 'Tên tôi là Anna.' },
            { en: 'ワンさんの{趣味|しゅみ}は{料理|りょうり}です。', ro: 'Wan-san no shumi wa ryōri desu.', vi: 'Sở thích của Wan là nấu ăn.' },
            { en: 'カルロスさんの{誕生日|たんじょうび}は{4月|しがつ}{17日|じゅうしちにち}です。', ro: 'Karurosu-san no tanjōbi wa shigatsu jūshichi-nichi desu.', vi: 'Sinh nhật của Carlos là ngày 17 tháng 4.' },
          ],
        },
        {
          formula: 'N1 の N2 は なん／いつ ですか',
          vi: 'Hỏi về N2 của một người',
          examples: [
            { en: 'パクさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Paku-san no shumi wa nan desu ka.', vi: 'Sở thích của Park là gì?' },
            { en: 'マルコさんの{誕生日|たんじょうび}はいつですか。', ro: 'Maruko-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật của Marco là khi nào?' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**の** nối hai danh từ. Danh từ **đứng sau** (N2) là cái chính; danh từ **đứng trước** (N1) bổ nghĩa cho nó. Thứ tự này **ngược với tiếng Việt**: "sinh viên | trường ĐH Fujimi" → ふじみ{大学|だいがく} **の** {学生|がくせい}. Mẹo: dịch câu tiếng Nhật thì đọc cụm の **từ phải sang trái**; nói tiếng Nhật thì đặt "của ai / của đâu" lên trước.',
    },
    {
      t: 'note',
      title: 'Ghi nhớ: 会社員 và 社員',
      items: [
        '**{会社員|かいしゃいん}** = nhân viên công ty nói chung (nghề). Dùng một mình: {私|わたし}は{会社員|かいしゃいん}です。',
        '**{社員|しゃいん}** = nhân viên CỦA một công ty cụ thể → luôn đi với tên công ty + の: ABEの{社員|しゃいん}です。',
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp dùng の (câu thi hay gặp)',
      lines: [
        { who: '木村', role: 'a', text: '{西川|にしかわ}さんは{教師|きょうし}ですか。', ro: 'Nishikawa-san wa kyōshi desu ka.', vi: 'Anh Nishikawa là giáo viên à?' },
        { who: '西川', role: 'b', text: 'はい、さくら{高校|こうこう}の{教師|きょうし}です。', ro: 'Hai, Sakura kōkō no kyōshi desu.', vi: 'Vâng, giáo viên trường THPT Sakura.' },
        { who: '西川', role: 'b', text: '{木村|きむら}さんは？', ro: 'Kimura-san wa?', vi: 'Còn Kimura?' },
        { who: '木村', role: 'a', text: '{私|わたし}はふじみ{大学|だいがく}の{学生|がくせい}です。', ro: 'Watashi wa Fujimi daigaku no gakusei desu.', vi: 'Tôi là sinh viên ĐH Fujimi.' },
      ],
    },
    {
      t: 'note',
      title: 'Câu thi hay gặp (mượn từ どこ của Bài 2)',
      items: [
        'Đề mẫu Lesson 1 có câu: **〜さんは どこの {教師|きょうし}ですか。** (~ là giáo viên trường nào?) → đáp: **さくら{高校|こうこう}の{教師|きょうし}です。**',
        'Tương tự: **どこの {学生|がくせい}ですか。** → **FPT{大学|だいがく}の{学生|がくせい}です。** (どこ = ở đâu; どこの = của nơi nào).',
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ghép một ô cột 1 + の + một ô cột 2',
      head: ['N1 (của đâu / của ai)', 'の', 'N2'],
      rows: [
        ['ふじみ{大学|だいがく}／あおぞら{日本語学校|にほんごがっこう}', 'の', '{学生|がくせい}'],
        ['さくら{高校|こうこう}／あおぞら{日本語学校|にほんごがっこう}', 'の', '{教師|きょうし}／{先生|せんせい}'],
        ['ABE', 'の', '{社員|しゃいん}'],
        ['{私|わたし}／ワンさん／カルロスさん', 'の', '{名前|なまえ}／{誕生日|たんじょうび}／{趣味|しゅみ}／{仕事|しごと}'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Giữ thứ tự tiếng Việt: ~~{学生|がくせい}のふじみ{大学|だいがく}~~ → **ふじみ{大学|だいがく}の{学生|がくせい}**.',
        'Quên の: ~~{私|わたし}{名前|なまえ}はアンナです~~ → **{私|わたし}の{名前|なまえ}は…**',
        '~~ABEの{会社員|かいしゃいん}~~ → **ABEの{社員|しゃいん}**.',
        'Tên trường là một khối, không chèn の vào giữa: ~~FPTの{大学|だいがく}の{学生|がくせい}~~ → **FPT{大学|だいがく}の{学生|がくせい}**.',
      ],
    },

    /* ── ポイント 5 ── */
    { t: 'h', text: 'ポイント 5 — N1 と N2 (N1 và N2)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 と N2',
          vi: 'N1 và N2 — chỉ nối DANH TỪ, liệt kê đủ',
          examples: [
            { en: 'パクさんの{趣味|しゅみ}は{旅行|りょこう}と{映画|えいが}です。', ro: 'Paku-san no shumi wa ryokō to eiga desu.', vi: 'Sở thích của Park là du lịch và phim.' },
            { en: 'ワンさんとパクさんは{学生|がくせい}です。', ro: 'Wan-san to Paku-san wa gakusei desu.', vi: 'Wan và Park là học sinh.' },
          ],
        },
        {
          formula: 'N1 と N2 と N3',
          vi: 'Ba thứ trở lên: đặt と giữa mỗi cặp, KHÔNG đặt sau cái cuối',
          examples: [
            { en: '{趣味|しゅみ}はサッカーとテニスと{水泳|すいえい}です。', ro: 'Shumi wa sakkā to tenisu to suiei desu.', vi: 'Sở thích là bóng đá, tennis và bơi lội.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**と** giống "và" — nhưng **chỉ** đặt giữa hai danh từ. Không dùng と để nối hai câu hay hai mệnh đề ("tôi là sinh viên **và** 19 tuổi" → tách thành hai câu: {学生|がくせい}です。{19歳|じゅうきゅうさい}です。).',
    },
    {
      t: 'examples',
      items: [
        { en: 'アンナさんの{趣味|しゅみ}は{何|なん}ですか。——{音楽|おんがく}と{読書|どくしょ}です。', ro: 'Anna-san no shumi wa nan desu ka. — Ongaku to dokusho desu.', vi: 'Sở thích của Anna là gì? — Âm nhạc và đọc sách.' },
        { en: 'しゅみはサッカーと{水泳|すいえい}ですか。——はい、サッカーと{水泳|すいえい}です。', ro: 'Shumi wa sakkā to suiei desu ka. — Hai, sakkā to suiei desu.', vi: 'Sở thích của bạn là bóng đá và bơi lội à? — Vâng, bóng đá và bơi lội.' },
        { en: 'しゅみはサッカーと{水泳|すいえい}ですか。——いいえ、テニスと{料理|りょうり}です。', ro: 'Shumi wa sakkā to suiei desu ka. — Iie, tenisu to ryōri desu.', vi: 'Sở thích là bóng đá và bơi à? — Không, là tennis và nấu ăn.' },
        { en: 'ダニエルさんとナタポンさんは{会社員|かいしゃいん}です。', ro: 'Danieru-san to Natapon-san wa kaishain desu.', vi: 'Daniel và Natapon là nhân viên công ty.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — {趣味|しゅみ}は [A] と [B] です。',
      head: ['A', 'と', 'B'],
      rows: [
        ['サッカー／テニス／{水泳|すいえい}', 'と', '{映画|えいが}／{音楽|おんがく}／{読書|どくしょ}'],
        ['{旅行|りょこう}／{料理|りょうり}／スポーツ', 'と', '{映画|えいが}／{音楽|おんがく}／{読書|どくしょ}'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dùng と nối câu: ~~{学生|がくせい}です と {19歳|じゅうきゅうさい}です。~~ → tách hai câu: **{学生|がくせい}です。{19歳|じゅうきゅうさい}です。**',
        'Đặt と sau món cuối: ~~テニスと{水泳|すいえい}とです~~ → **テニスと{水泳|すいえい}です**.',
      ],
    },

    /* ── ポイント 6 ── */
    { t: 'h', text: 'ポイント 6 — N も (N cũng…)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2 です。N3 も N2 です。',
          vi: 'N3 cũng là N2 — も THAY CHỖ của は',
          examples: [
            { en: 'ワンさんは{学生|がくせい}です。マルコさんも{学生|がくせい}です。', ro: 'Wan-san wa gakusei desu. Maruko-san mo gakusei desu.', vi: 'Wan là học sinh. Marco cũng là học sinh.' },
            { en: 'ワンさんの{趣味|しゅみ}は{料理|りょうり}です。ナタポンさんの{趣味|しゅみ}も{料理|りょうり}です。', ro: 'Wan-san no shumi wa ryōri desu. Natapon-san no shumi mo ryōri desu.', vi: 'Sở thích của Wan là nấu ăn. Sở thích của Natapon cũng là nấu ăn.' },
          ],
        },
        {
          formula: 'N も N2 じゃありません',
          vi: 'N cũng KHÔNG phải N2',
          examples: [
            { en: 'カルロスさんは{日本人|にほんじん}じゃありません。{私|わたし}も{日本人|にほんじん}じゃありません。', ro: 'Karurosu-san wa Nihonjin ja arimasen. Watashi mo Nihonjin ja arimasen.', vi: 'Carlos không phải người Nhật. Tôi cũng không phải người Nhật.' },
          ],
        },
        {
          formula: 'N も N2 ですか',
          vi: 'N cũng là N2 phải không?',
          examples: [
            { en: 'アンナさんも{学生|がくせい}ですか。——はい、{私|わたし}も{学生|がくせい}です。', ro: 'Anna-san mo gakusei desu ka. — Hai, watashi mo gakusei desu.', vi: 'Anna cũng là sinh viên à? — Vâng, tôi cũng là sinh viên.' },
            { en: 'アンナさんも{学生|がくせい}ですか。——いいえ、{私|わたし}は{会社員|かいしゃいん}です。', ro: 'Anna-san mo gakusei desu ka. — Iie, watashi wa kaishain desu.', vi: 'Anna cũng là sinh viên à? — Không, tôi là nhân viên công ty.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**も** = "cũng". Nó đứng ngay sau từ mà "cũng" áp vào, và **thế chỗ は** (hoặc の…は → の…も). Không bao giờ viết は và も liền nhau. Khi trả lời "không" cho câu hỏi có も, quay về **は** vì bạn không còn "cũng" giống người kia nữa.',
    },
    {
      t: 'dialogue',
      title: 'Cùng sở thích',
      lines: [
        { who: 'ナタポン', role: 'b', text: '{木村|きむら}さんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Kimura-san no shumi wa nan desu ka.', vi: 'Sở thích của Kimura là gì?' },
        { who: '木村', role: 'a', text: '{私|わたし}の{趣味|しゅみ}は{映画|えいが}です。', ro: 'Watashi no shumi wa eiga desu.', vi: 'Sở thích của tôi là xem phim.' },
        { who: 'ナタポン', role: 'b', text: 'あっ、{私|わたし}の{趣味|しゅみ}も{映画|えいが}です。', ro: 'A!, watashi no shumi mo eiga desu.', vi: 'Á, sở thích của tôi cũng là phim.' },
        { who: '木村', role: 'a', text: 'わあ、{同|おな}じですね。', ro: 'Wā, onaji desu ne.', vi: 'Oa, giống nhau nhỉ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — câu 1 dùng は, câu 2 dùng も',
      head: ['Câu 1 (は)', 'Câu 2 (も)'],
      rows: [
        ['パクさんは{韓国人|かんこくじん}です。', '{私|わたし}も{韓国人|かんこくじん}です。'],
        ['マルコさんは{学生|がくせい}です。', 'アンナさんも{学生|がくせい}です。'],
        ['{私|わたし}の{趣味|しゅみ}はテニスです。', 'ダニエルさんの{趣味|しゅみ}もテニスです。'],
        ['カルロスさんは{学生|がくせい}じゃありません。', 'ナタポンさんも{学生|がくせい}じゃありません。'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Để cả は lẫn も: ~~{私|わたし}はも{学生|がくせい}です~~ → **{私|わたし}も{学生|がくせい}です**.',
        'Đặt も theo trật tự tiếng Việt "tôi cũng là" → も phải đứng ngay sau {私|わたし}, không đứng trước です: ~~{私|わたし}は{学生|がくせい}もです~~.',
        'Trả lời "không" mà vẫn giữ も: người hỏi "Aさんも{学生|がくせい}ですか" (người trước là sinh viên, bạn thì không) → **いいえ、{私|わたし}は{学生|がくせい}じゃありません。**',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết 6 điểm ngữ pháp' },
    {
      t: 'table',
      head: ['ポイント', 'Công thức', 'Ví dụ', 'Dùng khi'],
      rows: [
        ['1', 'N1 は N2 です', '{私|わたし}は{学生|がくせい}です。', 'Nói tên, nước, việc, tuổi'],
        ['2', 'N1 は N2 ですか／はい・いいえ、じゃありません', 'ワンさんは{学生|がくせい}ですか。——いいえ、{学生|がくせい}じゃありません。', 'Hỏi và trả lời có/không'],
        ['3', 'N は どちら／いつ／{何|なん} ですか', 'お{国|くに}はどちらですか。', 'Hỏi nước, ngày sinh, sở thích'],
        ['4', 'N1 の N2', 'ふじみ{大学|だいがく}の{学生|がくせい}です。', 'Nói nơi học/làm; "của ai"'],
        ['5', 'N1 と N2', '{趣味|しゅみ}は{映画|えいが}と{音楽|おんがく}です。', 'Kể hai thứ trở lên'],
        ['6', 'N も', '{私|わたし}も{学生|がくせい}です。', 'Nói "cũng"'],
      ],
    },
    {
      t: 'build',
      id: 'b1-np-ghep',
      title: 'Ghép câu — Bài 1',
      items: [
        { vi: 'Tôi là sinh viên Đại học Fujimi.', chips: ['{私|わたし}は', 'ふじみ{大学|だいがく}の', '{学生|がくせい}です。', '{先生|せんせい}の'], answer: ['{私|わたし}は', 'ふじみ{大学|だいがく}の', '{学生|がくせい}です。'], ro: 'Watashi wa Fujimi daigaku no gakusei desu.' },
        { vi: 'Anh Carlos không phải sinh viên. Là nhân viên công ty.', chips: ['カルロスさんは', '{学生|がくせい}', 'じゃありません。', '{会社員|かいしゃいん}です。', 'も'], answer: ['カルロスさんは', '{学生|がくせい}', 'じゃありません。', '{会社員|かいしゃいん}です。'], ro: 'Karurosu-san wa gakusei ja arimasen. Kaishain desu.' },
        { vi: 'Nước của Wan là nước nào?', chips: ['ワンさんの', 'お{国|くに}は', 'どちらですか。', 'いつですか。'], answer: ['ワンさんの', 'お{国|くに}は', 'どちらですか。'], ro: 'Wan-san no o-kuni wa dochira desu ka.' },
        { vi: 'Sinh nhật của Anna là ngày 1 tháng 4.', chips: ['アンナさんの', '{誕生日|たんじょうび}は', '{4月|しがつ}', '{1日|ついたち}です。', '{4日|よっか}です。'], answer: ['アンナさんの', '{誕生日|たんじょうび}は', '{4月|しがつ}', '{1日|ついたち}です。'], ro: 'Anna-san no tanjōbi wa shigatsu tsuitachi desu.' },
        { vi: 'Sở thích của tôi là đọc sách và âm nhạc.', chips: ['{私|わたし}の', '{趣味|しゅみ}は', '{読書|どくしょ}と', '{音楽|おんがく}です。', 'も'], answer: ['{私|わたし}の', '{趣味|しゅみ}は', '{読書|どくしょ}と', '{音楽|おんがく}です。'], ro: 'Watashi no shumi wa dokusho to ongaku desu.' },
        { vi: 'Sở thích của tôi cũng là tennis.', chips: ['{私|わたし}の', '{趣味|しゅみ}も', 'テニスです。', '{趣味|しゅみ}は'], answer: ['{私|わたし}の', '{趣味|しゅみ}も', 'テニスです。'], ro: 'Watashi no shumi mo tenisu desu.' },
        { vi: 'Park có phải người Hàn Quốc không?', chips: ['パクさんは', '{韓国人|かんこくじん}', 'ですか。', 'の'], answer: ['パクさんは', '{韓国人|かんこくじん}', 'ですか。'], ro: 'Paku-san wa Kankokujin desu ka.' },
        { vi: 'Anh Nishikawa là giáo viên trường THPT Sakura.', chips: ['{西川|にしかわ}さんは', 'さくら{高校|こうこう}の', '{教師|きょうし}です。', '{学生|がくせい}の'], answer: ['{西川|にしかわ}さんは', 'さくら{高校|こうこう}の', '{教師|きょうし}です。'], ro: 'Nishikawa-san wa Sakura kōkō no kyōshi desu.' },
        { vi: 'Daniel và Natapon là nhân viên công ty.', chips: ['ダニエルさんと', 'ナタポンさんは', '{会社員|かいしゃいん}です。', 'も'], answer: ['ダニエルさんと', 'ナタポンさんは', '{会社員|かいしゃいん}です。'], ro: 'Danieru-san to Natapon-san wa kaishain desu.' },
        { vi: 'À… xin lỗi, tên bạn là gì ạ?', chips: ['あのう、', 'すみません。', 'お{名前|なまえ}は？'], answer: ['あのう、', 'すみません。', 'お{名前|なまえ}は？'], ro: 'Anō, sumimasen. O-namae wa?' },
        { vi: 'Mariyam bao nhiêu tuổi?', chips: ['マリヤムさんは', '{何歳|なんさい}', 'ですか。', 'いつ'], answer: ['マリヤムさんは', '{何歳|なんさい}', 'ですか。'], ro: 'Mariyamu-san wa nansai desu ka.' },
        { vi: 'Anh Carlos là nhân viên công ty ABE.', chips: ['カルロスさんは', 'ABEの', '{社員|しゃいん}です。', '{会社員|かいしゃいん}です。'], answer: ['カルロスさんは', 'ABEの', '{社員|しゃいん}です。'], ro: 'Karurosu-san wa ĒBĪĪ no shain desu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b1-np-tro-tu',
      title: 'Điền trợ từ / đuôi câu vào （　）',
      kind: 'fill',
      items: [
        { q: '{私|わたし}（　）アンナです。', answers: ['は', 'wa'], hint: 'Tôi là Anna' },
        { q: 'アンナさんはロシア{人|じん}です。{私|わたし}（　）ロシア{人|じん}です。', answers: ['も', 'mo'], hint: 'Tôi CŨNG là người Nga' },
        { q: 'ワンさんは{学生|がくせい}です（　）。', answers: ['か', 'ka'], hint: 'Wan là học sinh phải không?' },
        { q: 'ふじみ{大学|だいがく}（　）{学生|がくせい}です。', answers: ['の', 'no'], hint: 'sinh viên ĐH Fujimi' },
        { q: '{趣味|しゅみ}はサッカー（　）テニスです。', answers: ['と', 'to'], hint: 'bóng đá VÀ tennis' },
        { q: 'カルロスさんは{学生|がくせい}（　）ありません。', answers: ['じゃ', 'では', 'ja', 'dewa', 'de wa'], hint: 'không phải sinh viên' },
        { q: 'マルコさん（　）{誕生日|たんじょうび}はいつですか。', answers: ['の', 'no'], hint: 'sinh nhật CỦA Marco' },
        { q: 'パクさん（　）ワンさんは{学生|がくせい}です。', answers: ['と', 'to'], hint: 'Park VÀ Wan' },
        { q: 'あっ、{私|わたし}の{趣味|しゅみ}（　）{水泳|すいえい}です。', answers: ['も', 'mo'], hint: 'sở thích của tôi CŨNG là bơi' },
        { q: 'お{名前|なまえ}（　）？', answers: ['は', 'wa'], hint: 'Tên bạn thì…?' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-np-trac-nghiem',
      title: 'Trắc nghiệm ngữ pháp Bài 1',
      items: [
        { q: '"Tôi không phải người Nhật." là câu nào?', options: ['{私|わたし}は{日本人|にほんじん}です。', '{私|わたし}は{日本人|にほんじん}じゃありません。', '{私|わたし}は{日本人|にほんじん}ですか。', '{私|わたし}も{日本人|にほんじん}です。'], correct: 1, why: 'Phủ định của です là **じゃありません** (ポイント 2).' },
        { q: 'お{国|くに}はどちらですか。— Trả lời đúng nhất?', options: ['ベトナム{人|じん}です。', 'ベトナムです。', 'はい、ベトナムです。', 'ベトナムのです。'], correct: 1, why: 'Hỏi NƯỚC (お国) thì đáp tên nước. Câu hỏi có từ để hỏi thì không đáp はい／いいえ (ポイント 3).' },
        { q: '"Sinh viên trường ĐH Fujimi" là:', options: ['{学生|がくせい}のふじみ{大学|だいがく}', 'ふじみ{大学|だいがく}の{学生|がくせい}', 'ふじみ{大学|だいがく}と{学生|がくせい}', 'ふじみ{大学|だいがく}も{学生|がくせい}'], correct: 1, why: 'N1 の N2: cái chính (学生) đứng SAU (ポイント 4).' },
        { q: 'ワンさんは{学生|がくせい}です。パクさん（　）{学生|がくせい}です。 (Park cũng là học sinh)', options: ['は', 'も', 'の', 'と'], correct: 1, why: 'も = cũng, thế chỗ は (ポイント 6).' },
        { q: '{趣味|しゅみ}は{何|なん}ですか。— 何 ở đây đọc là:', options: ['なに', 'なん', 'いつ', 'どちら'], correct: 1, why: 'Trước です, 何 đọc **なん**.' },
        { q: 'カルロスさんは{学生|がくせい}ですか。— Carlos là nhân viên công ty. Trả lời đúng:', options: ['はい、{会社員|かいしゃいん}です。', 'いいえ、{学生|がくせい}です。', 'いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。', '{学生|がくせい}じゃありませんです。'], correct: 2, why: 'いいえ + じゃありません + thông tin đúng (ポイント 2).' },
        { q: '"Sở thích của tôi là bóng đá và bơi lội."', options: ['{私|わたし}の{趣味|しゅみ}はサッカーも{水泳|すいえい}です。', '{私|わたし}の{趣味|しゅみ}はサッカーと{水泳|すいえい}です。', '{私|わたし}は{趣味|しゅみ}のサッカーと{水泳|すいえい}です。', '{私|わたし}の{趣味|しゅみ}はサッカーです と {水泳|すいえい}です。'], correct: 1, why: 'と nối hai danh từ (ポイント 5); の nối 私 và 趣味 (ポイント 4).' },
        { q: 'Câu nào dùng SAI?', options: ['{私|わたし}はパクです。', 'パクさんは{韓国人|かんこくじん}です。', '{私|わたし}はパクさんです。', 'はじめまして。パクです。'], correct: 2, why: 'Không gắn さん cho chính mình.' },
        { q: '{誕生日|たんじょうび}（　）ですか。 — Hỏi "khi nào?"', options: ['はいつ', 'はどちら', 'は{何|なん}', 'のいつ'], correct: 0, why: 'いつ = khi nào (ポイント 3): {誕生日|たんじょうび}はいつですか。' },
        { q: '"Công ty ABE" + "nhân viên": câu đúng là', options: ['ABEの{会社員|かいしゃいん}です。', 'ABEの{社員|しゃいん}です。', '{社員|しゃいん}のABEです。', 'ABEと{社員|しゃいん}です。'], correct: 1, why: '社員 đi với tên công ty; 会社員 dùng một mình.' },
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const KANJI: Lesson = {
  id: 'b1-kanji',
  kind: 'kanji',
  title: 'Chữ Hán trong từ vựng Bài 1 (42 chữ)',
  goal: 'Đọc được mọi từ chữ Hán của Bài 1 — phần "đọc chữ Hán" chiếm 12/40 điểm Reading.',
  minutes: 30,
  blocks: [
    {
      t: 'p',
      text: 'Mỗi chữ Hán (kanji) thường có hai kiểu đọc: **âm On** (âm Hán, mượn từ tiếng Trung — viết bằng katakana trong bảng) và **âm Kun** (âm thuần Nhật — viết bằng hiragana; phần trong ngoặc là đuôi hiragana đi kèm). Cột **Hán Việt** giúp người Việt nhớ nghĩa rất nhanh: 学生 = HỌC SINH, 旅行 = LỮ HÀNH, 音楽 = ÂM NHẠC.',
    },
    {
      t: 'note',
      title: 'Cột Mức: 👁 nhận mặt · ✍ nên viết — và học chữ Hán THEO TỪ',
      items: [
        '👁 **nhận mặt** = gặp trong câu thì **đọc được và hiểu nghĩa** là đủ — phần lớn chữ trong bài; đây là thứ phần Đọc của đề (không furigana) kiểm tra.',
        '✍ **nên viết** = chữ ít nét, gặp rất nhiều (số, 日 月 火 水 木 金 土, 人 山 川 大 小 上 下 中…) — tập viết tay cho thuộc. Bài này có 19 chữ ✍, xếp đầu phần tập viết.',
        '**Học chữ Hán THEO TỪ**: nhớ {学生|がくせい} = gakusei, {先生|せんせい} = sensei như một khối âm, không bắt thuộc âm On/Kun của từng chữ rời. Cột âm On/Kun chỉ để tra và để đoán khi gặp từ mới; đề thi luôn hỏi cách đọc CẢ TỪ.',
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ khi thi Reading',
      items: [
        'Đề đọc có **4 từ chữ Hán gạch chân** (không có furigana) = 12 điểm. Từ chữ Hán hay xuất hiện: {私|わたし}, {学生|がくせい}, {大学|だいがく}, {先生|せんせい}, {日本|にほん}, {会社|かいしゃ}, {趣味|しゅみ}, {映画|えいが}, {音楽|おんがく}, {読書|どくしょ}.',
        'Luyện: tắt furigana (nút trên trang) và đọc lại cả bảng cột "Từ trong bài".',
      ],
    },
    { t: 'h', text: 'Nhóm 1 — Người và đất nước' },
    {
      t: 'table',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Nghĩa', 'Từ trong bài'],
      rows: [
        ['私', '✍', 'シ', 'わたし', 'TƯ', 'riêng tư; tôi', '{私|わたし} tôi'],
        ['名', '✍', 'メイ・ミョウ', 'な', 'DANH', 'tên', '{名前|なまえ} tên'],
        ['前', '✍', 'ゼン', 'まえ', 'TIỀN', 'trước', '{名前|なまえ} tên'],
        ['国', '✍', 'コク', 'くに', 'QUỐC', 'nước', 'お{国|くに}・{韓国|かんこく}・{中国|ちゅうごく}'],
        ['日', '✍', 'ニチ・ジツ', 'ひ・か', 'NHẬT', 'ngày; mặt trời', '{日本|にほん}・{誕生日|たんじょうび}・{4日|よっか}'],
        ['本', '✍', 'ホン', 'もと', 'BẢN', 'gốc; sách', '{日本|にほん} Nhật Bản'],
        ['韓', '👁', 'カン', '—', 'HÀN', 'nước Hàn', '{韓国|かんこく} Hàn Quốc'],
        ['中', '✍', 'チュウ', 'なか', 'TRUNG', 'giữa, trong', '{中国|ちゅうごく} Trung Quốc'],
        ['人', '✍', 'ジン・ニン', 'ひと', 'NHÂN', 'người', '{日本人|にほんじん}・{中国人|ちゅうごくじん}'],
        ['何', '✍', 'カ', 'なに・なん', 'HÀ', 'cái gì', '{何|なん}ですか・{何歳|なんさい}'],
      ],
    },
    { t: 'h', text: 'Nhóm 2 — Trường học và công việc' },
    {
      t: 'table',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Nghĩa', 'Từ trong bài'],
      rows: [
        ['高', '✍', 'コウ', 'たか(い)', 'CAO', 'cao', '{高校|こうこう} THPT'],
        ['校', '✍', 'コウ', '—', 'HIỆU', 'trường học', '{高校|こうこう}・{学校|がっこう}'],
        ['大', '✍', 'ダイ・タイ', 'おお(きい)', 'ĐẠI', 'lớn', '{大学|だいがく} đại học'],
        ['学', '✍', 'ガク', 'まな(ぶ)', 'HỌC', 'học', '{大学|だいがく}・{学生|がくせい}・{学校|がっこう}'],
        ['語', '👁', 'ゴ', 'かた(る)', 'NGỮ', 'ngôn ngữ', '{日本語|にほんご} tiếng Nhật'],
        ['仕', '👁', 'シ', 'つか(える)', 'SĨ', 'làm việc, phục vụ', '{仕事|しごと} công việc'],
        ['事', '👁', 'ジ', 'こと', 'SỰ', 'việc', '{仕事|しごと} công việc'],
        ['生', '✍', 'セイ・ショウ', 'い(きる)・う(まれる)', 'SINH', 'sống; sinh ra', '{学生|がくせい}・{先生|せんせい}・{誕生日|たんじょうび}'],
        ['先', '✍', 'セン', 'さき', 'TIÊN', 'trước', '{先生|せんせい} thầy cô'],
        ['教', '👁', 'キョウ', 'おし(える)', 'GIÁO', 'dạy', '{教師|きょうし} giáo viên'],
        ['師', '👁', 'シ', '—', 'SƯ', 'thầy', '{教師|きょうし} giáo viên'],
        ['会', '✍', 'カイ', 'あ(う)', 'HỘI', 'gặp; hội', '{会社員|かいしゃいん}'],
        ['社', '👁', 'シャ', 'やしろ', 'XÃ', 'công ty; đền', '{会社員|かいしゃいん}・{社員|しゃいん}'],
        ['員', '👁', 'イン', '—', 'VIÊN', 'thành viên', '{会社員|かいしゃいん}・{社員|しゃいん}'],
      ],
    },
    { t: 'h', text: 'Nhóm 3 — Ngày sinh và sở thích' },
    {
      t: 'table',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Nghĩa', 'Từ trong bài'],
      rows: [
        ['誕', '👁', 'タン', '—', 'ĐẢN', 'sinh ra', '{誕生日|たんじょうび} sinh nhật'],
        ['月', '✍', 'ゲツ・ガツ', 'つき', 'NGUYỆT', 'tháng; mặt trăng', '{5月|ごがつ} tháng 5'],
        ['歳', '👁', 'サイ・セイ', '—', 'TUẾ', 'tuổi', '{26歳|にじゅうろくさい}'],
        ['趣', '👁', 'シュ', 'おもむき', 'THÚ', 'thú vị', '{趣味|しゅみ} sở thích'],
        ['味', '👁', 'ミ', 'あじ', 'VỊ', 'vị', '{趣味|しゅみ} sở thích'],
        ['水', '✍', 'スイ', 'みず', 'THỦY', 'nước', '{水泳|すいえい} bơi lội'],
        ['泳', '👁', 'エイ', 'およ(ぐ)', 'VỊNH', 'bơi', '{水泳|すいえい} bơi lội'],
        ['映', '👁', 'エイ', 'うつ(る)', 'ÁNH', 'chiếu', '{映画|えいが} phim'],
        ['画', '👁', 'ガ・カク', '—', 'HỌA', 'tranh, hình', '{映画|えいが} phim'],
        ['音', '👁', 'オン', 'おと', 'ÂM', 'âm thanh', '{音楽|おんがく} âm nhạc'],
        ['楽', '👁', 'ガク・ラク', 'たの(しい)', 'NHẠC・LẠC', 'nhạc; vui', '{音楽|おんがく} âm nhạc'],
        ['読', '👁', 'ドク', 'よ(む)', 'ĐỘC', 'đọc', '{読書|どくしょ} đọc sách'],
        ['書', '👁', 'ショ', 'か(く)', 'THƯ', 'viết; sách', '{読書|どくしょ} đọc sách'],
        ['旅', '👁', 'リョ', 'たび', 'LỮ', 'chuyến đi', '{旅行|りょこう} du lịch'],
        ['行', '✍', 'コウ・ギョウ', 'い(く)', 'HÀNH', 'đi', '{旅行|りょこう} du lịch'],
        ['料', '👁', 'リョウ', '—', 'LIỆU', 'nguyên liệu; phí', '{料理|りょうり} nấu ăn'],
        ['理', '👁', 'リ', '—', 'LÝ', 'lý, lẽ', '{料理|りょうり} nấu ăn'],
        ['願', '👁', 'ガン', 'ねが(う)', 'NGUYỆN', 'mong, cầu', 'お{願|ねが}いします'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: âm đổi khi ghép',
      items: [
        '学 + 校 = **がっこう** (không đọc ~~がくこう~~) — âm く biến thành っ.',
        '仕 + 事 = **しごと** (こと → ごと).',
        '人: sau tên nước đọc **じん** ({日本人|にほんじん}); đứng một mình đọc **ひと**.',
        '日 có nhiều cách đọc: {日本|にほん} (に), {誕生日|たんじょうび} (び), {4日|よっか} (か), {15日|じゅうごにち} (にち), {1日|ついたち} (cả cụm đọc riêng).',
        '何: trước です / 歳 đọc **なん**; ở chỗ khác (bài sau) thường đọc **なに**.',
      ],
    },
    {
      t: 'mcq',
      id: 'b1-kanji-doc',
      title: 'Chọn cách đọc đúng',
      items: [
        { q: '**学生**', options: ['がっせい', 'がくせい', 'がくしょう', 'がくじん'], correct: 1, why: '学 ガク + 生 セイ = がくせい (học sinh).' },
        { q: '**先生**', options: ['せんせい', 'せんしょう', 'さきせい', 'せいせん'], correct: 0, why: '先 セン + 生 セイ.' },
        { q: '**会社員**', options: ['かいしゃいん', 'かいじゃいん', 'がいしゃいん', 'かいしゃにん'], correct: 0, why: '会 カイ + 社 シャ + 員 イン.' },
        { q: '**日本語学校**', options: ['にっぽんごがくこう', 'にほんごがっこう', 'にほんごがくこう', 'にちほんごがっこう'], correct: 1, why: '学校 = がっこう (く → っ).' },
        { q: '**誕生日**', options: ['たんじょうひ', 'たんせいび', 'たんじょうび', 'だんじょうび'], correct: 2, why: '誕 タン + 生 ジョウ + 日 び.' },
        { q: '**趣味**', options: ['しゅうみ', 'しゅみ', 'すみ', 'しゅあじ'], correct: 1, why: '趣 シュ (ngắn) + 味 ミ.' },
        { q: '**映画**', options: ['えいが', 'えが', 'えいかく', 'ええが'], correct: 0, why: '映 エイ + 画 ガ.' },
        { q: '**音楽**', options: ['おんらく', 'おとがく', 'おんがく', 'いんがく'], correct: 2, why: '楽 trong 音楽 đọc ガク.' },
        { q: '**読書**', options: ['よみしょ', 'どくしょ', 'どくしょう', 'とくしょ'], correct: 1, why: '読 ドク + 書 ショ (ngắn).' },
        { q: '**旅行**', options: ['りょうこう', 'りょこう', 'りょぎょう', 'たびこう'], correct: 1, why: '旅 リョ (ngắn) + 行 コウ. Đừng nhầm với 料理 りょうり (dài).' },
        { q: '**料理**', options: ['りょうり', 'りょり', 'りょうに', 'りょおり'], correct: 0, why: '料 リョウ (dài) + 理 リ.' },
        { q: '**韓国**', options: ['かんこく', 'かんごく', 'はんこく', 'かんくに'], correct: 0, why: '韓 カン + 国 コク.' },
        { q: '**仕事**', options: ['しこと', 'しごと', 'じごと', 'しじ'], correct: 1, why: 'こと → ごと khi ghép.' },
        { q: '**高校**', options: ['こうこう', 'こうごう', 'たかこう', 'こうきょう'], correct: 0, why: '高 コウ + 校 コウ — hai âm dài.' },
        { q: '**教師**', options: ['きょうし', 'きょし', 'きょうじ', 'こうし'], correct: 0, why: '教 キョウ + 師 シ.' },
        { q: '**水泳**', options: ['みずえい', 'すいえい', 'すいよう', 'すえい'], correct: 1, why: '水 スイ + 泳 エイ.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b1-kanji-go',
      title: 'Gõ cách đọc bằng hiragana',
      kind: 'fill',
      items: [
        { q: '私', answers: ['わたし'] },
        { q: '名前', answers: ['なまえ'] },
        { q: '大学', answers: ['だいがく'] },
        { q: '中国人', answers: ['ちゅうごくじん'] },
        { q: '日本', answers: ['にほん', 'にっぽん'] },
        { q: '社員', answers: ['しゃいん'] },
        { q: '何歳', answers: ['なんさい'] },
        { q: '4月', answers: ['しがつ'], hint: 'tháng 4' },
        { q: '9月', answers: ['くがつ'], hint: 'tháng 9' },
        { q: '20日', answers: ['はつか'], hint: 'ngày 20' },
      ],
    },

    /* ── Đứng riêng / đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Quy tắc gần đúng: **chữ đứng một mình / có đuôi kana → âm Kun** (âm Nhật); **hai chữ Hán ghép với nhau → âm On** (âm Hán). Bảng dưới là các chữ Bài 1 có cả hai cách đọc — đọc hàng ngang để thấy cùng một chữ đổi âm thế nào. Từ ghi "(Bài x)" là từ của bài khác; "(sẽ gặp)" là từ của bài sau — chỉ cần nhận mặt.',
    },
    {
      t: 'table',
      caption: 'Chữ Bài 1 — đứng riêng (Kun) ↔ trong từ ghép (On)',
      head: ['Chữ', 'Đứng riêng (Kun) — từ, nghĩa', 'Trong từ ghép (On) — từ, nghĩa'],
      rows: [
        ['人', '{人|ひと} hito — người', '{日本人|にほんじん} nihonjin — người Nhật · {韓国人|かんこくじん} kankokujin — người Hàn (じん = người nước…)'],
        ['国', 'お{国|くに} okuni — đất nước (của bạn)', '{韓国|かんこく} Kankoku — Hàn Quốc · {中国|ちゅうごく} Chuugoku — Trung Quốc'],
        ['日', '{日|ひ} hi — ngày, mặt trời (Bài 4)', '{日本|にほん} Nihon — Nhật Bản · {日本語|にほんご} nihongo · {誕生日|たんじょうび} tanjoubi (び)'],
        ['月', '{月|つき} tsuki — mặt trăng', '{5月|ごがつ} gogatsu — tháng 5 · {月曜日|げつようび} getsuyoubi — thứ Hai (Bài 3)'],
        ['中', '{中|なか} naka — bên trong · {真|ま}ん{中|なか} (Bài 4)', '{中国|ちゅうごく} Chuugoku · {中国人|ちゅうごくじん} chuugokujin'],
        ['大', '{大|おお}きい ookii — to (Bài 4)', '{大学|だいがく} daigaku — đại học'],
        ['高', '{高|たか}い takai — cao, đắt (Bài 4)', '{高校|こうこう} koukou — trường THPT'],
        ['学', '{学|まな}ぶ manabu — học (văn viết, ít gặp)', '{大学|だいがく} daigaku · {学生|がくせい} gakusei · {学校|がっこう} gakkou'],
        ['生', '{生|う}まれる umareru — được sinh ra (sẽ gặp)', '{学生|がくせい} gakusei · {先生|せんせい} sensei · {誕生日|たんじょうび} tanjoubi (じょう)'],
        ['先', '{先|さき} saki — phía trước (sẽ gặp)', '{先生|せんせい} sensei — thầy cô'],
        ['名', '{名前|なまえ} namae — tên (な: Kun dù ghép)', '{有名|ゆうめい} yuumei — nổi tiếng (Bài 4)'],
        ['前', '{前|まえ} mae — phía trước (Bài 6)', '{午前|ごぜん} gozen — buổi sáng (Bài 3)'],
        ['事', '{事|こと} koto — việc', '{仕事|しごと} shigoto (ごと: Kun, ngoại lệ) · {食事|しょくじ} shokuji — bữa ăn (Bài 5)'],
        ['会', '{会|あ}います aimasu — gặp (Bài 5)', '{会社員|かいしゃいん} kaishain · {会社|かいしゃ} kaisha — công ty (Bài 3)'],
        ['教', '{教|おし}えます oshiemasu — dạy (sẽ gặp)', '{教師|きょうし} kyoushi — giáo viên'],
        ['水', '{水|みず} mizu — nước (Bài 2)', '{水泳|すいえい} suiei — bơi lội · {水曜日|すいようび} (Bài 3)'],
        ['泳', '{泳|およ}ぎます oyogimasu — bơi (Bài 9)', '{水泳|すいえい} suiei'],
        ['音', '{音|おと} oto — âm thanh', '{音楽|おんがく} ongaku — âm nhạc'],
        ['楽', '{楽|たの}しい tanoshii — vui (Bài 5)', '{音楽|おんがく} ongaku (がく)'],
        ['読', '{読|よ}みます yomimasu — đọc (Bài 3)', '{読書|どくしょ} dokusho — đọc sách'],
        ['書', '{書|か}きます kakimasu — viết (Bài 9)', '{読書|どくしょ} dokusho · {辞書|じしょ} jisho — từ điển (Bài 2)'],
        ['旅', '{旅|たび} tabi — chuyến đi', '{旅行|りょこう} ryokou — du lịch'],
        ['行', '{行|い}きます ikimasu — đi (Bài 3)', '{旅行|りょこう} ryokou · {銀行|ぎんこう} ginkou — ngân hàng (Bài 3)'],
        ['味', '{味|あじ} aji — vị', '{趣味|しゅみ} shumi — sở thích'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp trong bài (thuộc lòng)',
      items: [
        '**{一人|ひとり}** hitori (1 người) · **{二人|ふたり}** futari (2 người) — từ 3 trở đi mới đọc đều: {三人|さんにん} sannin, {四人|よにん} yonin.',
        '**{二十歳|はたち}** hatachi = 20 tuổi — cả cụm đọc riêng; tuổi khác đọc đều: {19歳|じゅうきゅうさい}, {21歳|にじゅういっさい}.',
        '**Ngày**: {1日|ついたち} (mùng 1) · {2日|ふつか} · {3日|みっか} · {4日|よっか} · {5日|いつか} · {6日|むいか} · {7日|なのか} · {8日|ようか} · {9日|ここのか} · {10日|とおか} · {14日|じゅうよっか} · {20日|はつか} · {24日|にじゅうよっか}. Ngày khác: số + にち. ({1日|いちにち} = "một ngày" khoảng thời gian — Bài 9.)',
        '**Tháng**: {4月|しがつ} (không ~~よんがつ~~) · {7月|しちがつ} · {9月|くがつ} (không ~~きゅうがつ~~).',
        '**{今日|きょう}** kyou (hôm nay — Bài 5): cả từ đọc riêng, không ghép ~~こんにち~~.',
        '**{学校|がっこう}** gakkou (がく → がっ) · **{仕事|しごと}** shigoto (こと → ごと) · **{誕生日|たんじょうび}** (ひ → び).',
      ],
    },

    /* ── Đọc không furigana ── */
    { t: 'h', text: 'Từ chữ Hán hay gặp trong đề đọc — đọc KHÔNG furigana' },
    {
      t: 'p',
      text: 'Đề Reading in chữ Hán **không có furigana**. Luyện: nhìn câu (chữ Hán để trần), **đọc to** trước, rồi mới bấm hiện cách đọc + nghe máy đọc, tự chấm đúng/sai. Câu ngắn trước, đoạn dài sau.',
    },
    {
      t: 'readkanji',
      id: 'b1-doc-kanji',
      title: 'Đọc to từng câu — từ chữ Hán Bài 1',
      note: 'Đọc hết cả câu một hơi. Chỗ vấp nhiều nhất: 学校 (がっこう), 誕生日 (たんじょうび), 二十歳 (はたち), 趣味 (しゅみ, không しゅうみ).',
      items: [
        { text: '{私|わたし}は{学生|がくせい}です。', ro: 'Watashi wa gakusei desu.', vi: 'Tôi là sinh viên.' },
        { text: '{私|わたし}の{名前|なまえ}はミンです。', ro: 'Watashi no namae wa Min desu.', vi: 'Tên tôi là Minh.' },
        { text: '{私|わたし}はベトナム{人|じん}です。', ro: 'Watashi wa Betonamujin desu.', vi: 'Tôi là người Việt Nam.' },
        { text: 'お{国|くに}はどちらですか。', ro: 'Okuni wa dochira desu ka.', vi: 'Bạn đến từ nước nào?' },
        { text: 'キムさんは{韓国人|かんこくじん}です。', ro: 'Kimu-san wa kankokujin desu.', vi: 'Anh Kim là người Hàn Quốc.' },
        { text: 'ワンさんは{中国|ちゅうごく}の{大学|だいがく}の{学生|がくせい}です。', ro: 'Wan-san wa Chuugoku no daigaku no gakusei desu.', vi: 'Anh Vương là sinh viên đại học ở Trung Quốc.' },
        { text: 'リンさんは{日本語学校|にほんごがっこう}の{学生|がくせい}です。', ro: 'Rin-san wa nihongo gakkou no gakusei desu.', vi: 'Linh là học viên trường tiếng Nhật.' },
        { text: '{先生|せんせい}は{日本人|にほんじん}です。', ro: 'Sensei wa nihonjin desu.', vi: 'Cô giáo là người Nhật.' },
        { text: 'お{仕事|しごと}は{何|なん}ですか。', ro: 'Oshigoto wa nan desu ka.', vi: 'Bạn làm nghề gì?' },
        { text: 'アンさんは{会社員|かいしゃいん}です。', ro: 'An-san wa kaishain desu.', vi: 'Chị An là nhân viên công ty.' },
        { text: '{私|わたし}は{高校|こうこう}の{教師|きょうし}です。', ro: 'Watashi wa koukou no kyoushi desu.', vi: 'Tôi là giáo viên trường cấp 3.' },
        { text: '{私|わたし}は{会社員|かいしゃいん}じゃありません。{学生|がくせい}です。', ro: 'Watashi wa kaishain ja arimasen. Gakusei desu.', vi: 'Tôi không phải nhân viên công ty. Tôi là sinh viên.' },
        { text: '{誕生日|たんじょうび}はいつですか。', ro: 'Tanjoubi wa itsu desu ka.', vi: 'Sinh nhật bạn là khi nào?' },
        { text: '{誕生日|たんじょうび}は{5月|ごがつ}{4日|よっか}です。', ro: 'Tanjoubi wa gogatsu yokka desu.', vi: 'Sinh nhật tôi là ngày 4 tháng 5.' },
        { text: '{何歳|なんさい}ですか。— {二十歳|はたち}です。', ro: 'Nansai desu ka. — Hatachi desu.', vi: 'Bạn bao nhiêu tuổi? — 20 tuổi.' },
        { text: '{趣味|しゅみ}は{映画|えいが}と{音楽|おんがく}です。', ro: 'Shumi wa eiga to ongaku desu.', vi: 'Sở thích của tôi là phim và âm nhạc.' },
        { text: '{私|わたし}の{趣味|しゅみ}も{読書|どくしょ}です。', ro: 'Watashi no shumi mo dokusho desu.', vi: 'Sở thích của tôi cũng là đọc sách.' },
        { text: 'マイさんの{趣味|しゅみ}は{水泳|すいえい}と{旅行|りょこう}です。', ro: 'Mai-san no shumi wa suiei to ryokou desu.', vi: 'Sở thích của Mai là bơi và du lịch.' },
        { text: '{料理|りょうり}は{私|わたし}の{趣味|しゅみ}です。', ro: 'Ryouri wa watashi no shumi desu.', vi: 'Nấu ăn là sở thích của tôi.' },
        { text: 'どうぞよろしくお{願|ねが}いします。', ro: 'Douzo yoroshiku onegai shimasu.', vi: 'Rất mong được giúp đỡ.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b1-doc-doan',
      title: 'Đọc to cả đoạn — khuôn đề Reading',
      note: 'Như đề thật: đoạn ngắn, vài từ chữ Hán không furigana. 30 giây nhìn trước, rồi đọc to một lượt không dừng; xong mới bấm hiện cách đọc để tự chấm.',
      items: [
        { text: 'はじめまして。{私|わたし}はグエン・ミンです。ベトナム{人|じん}です。FPT{大学|だいがく}の{学生|がくせい}です。{趣味|しゅみ}は{音楽|おんがく}と{旅行|りょこう}です。{誕生日|たんじょうび}は{9月|くがつ}{20日|はつか}です。どうぞよろしくお{願|ねが}いします。', ro: 'Hajimemashite. Watashi wa Guen Min desu. Betonamujin desu. FPT daigaku no gakusei desu. Shumi wa ongaku to ryokou desu. Tanjoubi wa kugatsu hatsuka desu. Douzo yoroshiku onegai shimasu.', vi: 'Rất vui được gặp. Tôi là Nguyễn Minh. Tôi là người Việt Nam. Tôi là sinh viên Đại học FPT. Sở thích là âm nhạc và du lịch. Sinh nhật tôi là 20 tháng 9. Rất mong được giúp đỡ.' },
        { text: 'こちらはキムさんです。キムさんは{韓国人|かんこくじん}です。{会社員|かいしゃいん}です。{日本語学校|にほんごがっこう}の{学生|がくせい}じゃありません。キムさんの{趣味|しゅみ}は{料理|りょうり}です。{私|わたし}の{趣味|しゅみ}も{料理|りょうり}です。', ro: 'Kochira wa Kimu-san desu. Kimu-san wa kankokujin desu. Kaishain desu. Nihongo gakkou no gakusei ja arimasen. Kimu-san no shumi wa ryouri desu. Watashi no shumi mo ryouri desu.', vi: 'Đây là anh Kim. Anh Kim là người Hàn Quốc. Anh ấy là nhân viên công ty, không phải học viên trường tiếng Nhật. Sở thích của anh Kim là nấu ăn. Sở thích của tôi cũng là nấu ăn.' },
        { text: '{私|わたし}の{先生|せんせい}は{日本人|にほんじん}です。{高校|こうこう}の{教師|きょうし}じゃありません。{大学|だいがく}の{先生|せんせい}です。{先生|せんせい}の{趣味|しゅみ}は{読書|どくしょ}と{映画|えいが}です。{誕生日|たんじょうび}は{4月|しがつ}{1日|ついたち}です。', ro: 'Watashi no sensei wa nihonjin desu. Koukou no kyoushi ja arimasen. Daigaku no sensei desu. Sensei no shumi wa dokusho to eiga desu. Tanjoubi wa shigatsu tsuitachi desu.', vi: 'Cô giáo của tôi là người Nhật. Cô không phải giáo viên cấp 3 mà là giảng viên đại học. Sở thích của cô là đọc sách và xem phim. Sinh nhật cô là mùng 1 tháng 4.' },
        { text: '「お{国|くに}はどちらですか。」「{中国|ちゅうごく}です。」「お{仕事|しごと}は{何|なん}ですか。」「{学生|がくせい}です。」「{何歳|なんさい}ですか。」「{二十歳|はたち}です。」「わあ、{私|わたし}も{二十歳|はたち}です。{同|おな}じですね。」', ro: 'Okuni wa dochira desu ka. Chuugoku desu. Oshigoto wa nan desu ka. Gakusei desu. Nansai desu ka. Hatachi desu. Waa, watashi mo hatachi desu. Onaji desu ne.', vi: '"Bạn đến từ nước nào?" "Trung Quốc." "Bạn làm nghề gì?" "Sinh viên." "Bạn bao nhiêu tuổi?" "20 tuổi." "Ồ, tôi cũng 20 tuổi. Giống nhau nhỉ."' },
      ],
    },
    {
      t: 'write',
      id: 'b1-viet-kanji',
      title: 'Tập viết tay 42 chữ Hán của Bài 1 — ✍ chữ nên viết trước',
      note: '19 chữ đầu là ✍ (ít nét, gặp rất nhiều) — ưu tiên viết thuộc. 23 chữ sau là 👁: tập vài lượt cho nhớ mặt chữ là đủ. Mỗi nhóm 10 chữ (bấm dải chữ để chuyển nhóm). Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['私', '名', '前', '国', '日', '本', '中', '人', '何', '高', '校', '大', '学', '生', '先', '会', '月', '水', '行', '韓', '語', '仕', '事', '教', '師', '社', '員', '誕', '歳', '趣', '味', '泳', '映', '画', '音', '楽', '読', '書', '旅', '料', '理', '願'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b1-nghe',
  kind: 'listening',
  title: 'Luyện nghe Bài 1',
  goal: 'Nghe và ghi lại được tên, nước, công việc, tuổi, ngày sinh, sở thích của người nói.',
  minutes: 30,
  blocks: [
    {
      t: 'p',
      text: 'Cách làm: bấm **nghe cả bài** 2 lần (lần đầu chỉ nghe, lần hai ghi chú) → làm câu hỏi → rồi mới mở **lời thoại** để kiểm tra. Nghe chưa kịp thì bấm từng câu.',
    },
    {
      t: 'note',
      title: 'Mẹo nghe',
      items: [
        'Nghe **từ khoá** trước です: tên nước (アメリカ…), nghề ({学生|がくせい}, {会社員|かいしゃいん}, {教師|きょうし}), số + {歳|さい}, số + {月|がつ} + {日|にち}.',
        'Nghe **いいえ** và **じゃありません**: thông tin ĐÚNG đứng ngay sau đó.',
        'Nghe **も**: người sau có cùng thông tin với người trước.',
      ],
    },

    { t: 'h', text: 'Bài nghe 1 — Tên, nước, công việc' },
    {
      t: 'listen',
      id: 'b1-nghe-1',
      title: 'Hội thoại 1: メアリー と ダニエル',
      lines: [
        { who: 'メアリー', voice: 'ja-nu', text: 'はじめまして。メアリーです。よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Mearī desu. Yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Mary. Mong được giúp đỡ.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'ダニエルです。こちらこそ、よろしくお{願|ねが}いします。メアリーさん、お{国|くに}はどちらですか。', ro: 'Danieru desu. Kochira koso, yoroshiku onegaishimasu. Mearī-san, o-kuni wa dochira desu ka.', vi: 'Tôi là Daniel. Tôi cũng mong được giúp đỡ. Mary đến từ nước nào?' },
        { who: 'メアリー', voice: 'ja-nu', text: 'アメリカです。ダニエルさんは？', ro: 'Amerika desu. Danieru-san wa?', vi: 'Mỹ. Còn Daniel?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'オーストラリアです。', ro: 'Ōsutoraria desu.', vi: 'Úc.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'そうですか。ダニエルさんは{学生|がくせい}ですか。', ro: 'Sō desu ka. Danieru-san wa gakusei desu ka.', vi: 'Vậy à. Daniel là sinh viên à?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。メアリーさんは？', ro: 'Iie, gakusei ja arimasen. Kaishain desu. Mearī-san wa?', vi: 'Không, không phải sinh viên. Tôi là nhân viên công ty. Còn Mary?' },
        { who: 'メアリー', voice: 'ja-nu', text: '{私|わたし}は{教師|きょうし}です。あおぞら{日本語学校|にほんごがっこう}の{教師|きょうし}です。', ro: 'Watashi wa kyōshi desu. Aozora nihongo gakkō no kyōshi desu.', vi: 'Tôi là giáo viên. Giáo viên trường tiếng Nhật Aozora.' },
      ],
    },
    {
      t: 'listen',
      id: 'b1-nghe-2',
      title: 'Hội thoại 2: 山口 と ナタポン',
      lines: [
        { who: '山口', voice: 'ja-nu', text: 'あのう、すみません。お{名前|なまえ}は？', ro: 'Anō, sumimasen. O-namae wa?', vi: 'À… xin lỗi, tên anh là gì ạ?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'ナタポンです。タイ{人|じん}です。', ro: 'Natapon desu. Tai-jin desu.', vi: 'Tôi là Natapon. Người Thái.' },
        { who: '山口', voice: 'ja-nu', text: 'ナタポンさんは{学生|がくせい}ですか。', ro: 'Natapon-san wa gakusei desu ka.', vi: 'Natapon là sinh viên à?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'いいえ、{会社員|かいしゃいん}です。ABEの{社員|しゃいん}です。{山口|やまぐち}さんは{学生|がくせい}ですか。', ro: 'Iie, kaishain desu. ĒBĪĪ no shain desu. Yamaguchi-san wa gakusei desu ka.', vi: 'Không, tôi là nhân viên công ty. Nhân viên công ty ABE. Chị Yamaguchi là sinh viên à?' },
        { who: '山口', voice: 'ja-nu', text: 'いいえ、{私|わたし}も{会社員|かいしゃいん}です。', ro: 'Iie, watashi mo kaishain desu.', vi: 'Không, tôi cũng là nhân viên công ty.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q1',
      title: 'Câu hỏi bài nghe 1',
      items: [
        { q: 'メアリーさんのお{国|くに}は？', options: ['オーストラリア', 'アメリカ', '{中国|ちゅうごく}'], correct: 1, why: 'メアリー: アメリカです。' },
        { q: 'ダニエルさんのお{仕事|しごと}は？', options: ['{学生|がくせい}', '{会社員|かいしゃいん}', '{教師|きょうし}'], correct: 1, why: 'いいえ、学生じゃありません。会社員です。' },
        { q: 'メアリーさんのお{仕事|しごと}は？', options: ['{日本語学校|にほんごがっこう}の{学生|がくせい}', '{高校|こうこう}の{教師|きょうし}', '{日本語学校|にほんごがっこう}の{教師|きょうし}'], correct: 2, why: 'あおぞら日本語学校の教師です。' },
        { q: 'ナタポンさんは{何人|なにじん}ですか。', options: ['タイ{人|じん}', '{韓国人|かんこくじん}', 'ロシア{人|じん}'], correct: 0, why: 'ナタポンです。タイ人です。' },
        { q: 'ナタポンさんのお{仕事|しごと}は？', options: ['ABEの{社員|しゃいん}', 'ふじみ{大学|だいがく}の{学生|がくせい}', '{教師|きょうし}'], correct: 0, why: '会社員です。ABEの社員です。' },
        { q: '{山口|やまぐち}さんは{学生|がくせい}ですか。', options: ['はい、{学生|がくせい}です。', 'いいえ、{会社員|かいしゃいん}です。', 'いいえ、{教師|きょうし}です。'], correct: 1, why: 'いいえ、私**も**会社員です — cũng là nhân viên công ty như Natapon.' },
      ],
    },

    { t: 'h', text: 'Bài nghe 2 — Tự giới thiệu: nước, việc, tuổi' },
    {
      t: 'listen',
      id: 'b1-nghe-3',
      title: 'Ba người tự giới thiệu ở tiệc chào mừng',
      lines: [
        { who: 'マリヤム', voice: 'ja-nu', text: 'はじめまして。マリヤムです。イタリア{人|じん}です。ふじみ{大学|だいがく}の{学生|がくせい}です。{26歳|にじゅうろくさい}です。よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Mariyamu desu. Itaria-jin desu. Fujimi daigaku no gakusei desu. Nijūroku-sai desu. Yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Mariyam. Người Ý. Sinh viên ĐH Fujimi. 26 tuổi. Mong được giúp đỡ.' },
        { who: '西川', voice: 'ja-nam', text: 'はじめまして。{西川|にしかわ}です。{日本人|にほんじん}です。さくら{高校|こうこう}の{教師|きょうし}です。{35歳|さんじゅうごさい}です。どうぞよろしくお{願|ねが}いします。', ro: 'Hajimemashite. Nishikawa desu. Nihonjin desu. Sakura kōkō no kyōshi desu. Sanjūgo-sai desu. Dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Nishikawa. Người Nhật. Giáo viên trường THPT Sakura. 35 tuổi. Rất mong được giúp đỡ.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'はじめまして。アンナです。ロシア{人|じん}です。{学生|がくせい}じゃありません。ABEの{社員|しゃいん}です。{28歳|にじゅうはっさい}です。よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Anna desu. Roshia-jin desu. Gakusei ja arimasen. ĒBĪĪ no shain desu. Nijūhassai desu. Yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Anna. Người Nga. Tôi không phải sinh viên. Nhân viên công ty ABE. 28 tuổi. Mong được giúp đỡ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q2',
      title: 'Câu hỏi bài nghe 2',
      items: [
        { q: 'マリヤムさんのお{国|くに}は？', options: ['ロシア', 'イタリア', 'ブラジル'], correct: 1, why: 'イタリア人です。' },
        { q: 'マリヤムさんは{何歳|なんさい}ですか。', options: ['{16歳|じゅうろくさい}', '{26歳|にじゅうろくさい}', '{28歳|にじゅうはっさい}'], correct: 1, why: 'にじゅうろくさい = 26.' },
        { q: '{西川|にしかわ}さんのお{仕事|しごと}は？', options: ['{高校|こうこう}の{教師|きょうし}', '{大学|だいがく}の{学生|がくせい}', '{会社員|かいしゃいん}'], correct: 0, why: 'さくら高校の教師です。' },
        { q: '{西川|にしかわ}さんは{何歳|なんさい}ですか。', options: ['{25歳|にじゅうごさい}', '{35歳|さんじゅうごさい}', '{45歳|よんじゅうごさい}'], correct: 1, why: 'さんじゅうごさい = 35.' },
        { q: 'アンナさんは{学生|がくせい}ですか。', options: ['はい、ふじみ{大学|だいがく}の{学生|がくせい}です。', 'いいえ、ABEの{社員|しゃいん}です。', 'いいえ、{教師|きょうし}です。'], correct: 1, why: '学生じゃありません。ABEの社員です。' },
        { q: 'アンナさんは{何歳|なんさい}ですか。', options: ['{18歳|じゅうはっさい}', '{28歳|にじゅうはっさい}', '{8歳|はっさい}'], correct: 1, why: 'にじゅうはっさい = 28 (8 + 歳 → はっさい).' },
      ],
    },

    { t: 'h', text: 'Bài nghe 3 — Ngày sinh' },
    {
      t: 'listen',
      id: 'b1-nghe-4',
      title: 'Bốn đoạn hỏi ngày sinh',
      note: 'Chú ý các ngày dễ nhầm: よっか (4) — じゅうよっか (14) — にじゅうよっか (24); ついたち (1) — なのか (7); はつか (20).',
      lines: [
        { who: '木村', voice: 'ja-nu', text: '① カルロスさんの{誕生日|たんじょうび}はいつですか。', ro: 'Karurosu-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật của Carlos là khi nào?' },
        { who: 'カルロス', voice: 'ja-nam', text: '{4月|しがつ}{17日|じゅうしちにち}です。', ro: 'Shigatsu jūshichi-nichi desu.', vi: 'Ngày 17 tháng 4.' },
        { who: 'カルロス', voice: 'ja-nam', text: '② ワンさんの{誕生日|たんじょうび}はいつですか。', ro: 'Wan-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật của Wan là khi nào?' },
        { who: 'ワン', voice: 'ja-nu', text: '{1月|いちがつ}{20日|はつか}です。', ro: 'Ichigatsu hatsuka desu.', vi: 'Ngày 20 tháng 1.' },
        { who: 'ワン', voice: 'ja-nu', text: '③ ダニエルさんは？', ro: 'Danieru-san wa?', vi: 'Còn Daniel?' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{私|わたし}は{7月|しちがつ}{1日|ついたち}です。', ro: 'Watashi wa shichigatsu tsuitachi desu.', vi: 'Tôi là ngày 1 tháng 7.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '④ パクさんの{誕生日|たんじょうび}はいつですか。', ro: 'Paku-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật của Park là khi nào?' },
        { who: 'パク', voice: 'ja-nu', text: '{10月|じゅうがつ}{14日|じゅうよっか}です。', ro: 'Jūgatsu jūyokka desu.', vi: 'Ngày 14 tháng 10.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q3',
      title: 'Câu hỏi bài nghe 3 — sinh nhật mỗi người',
      items: [
        { q: '① カルロス', options: ['7/4', '4/17', '4/7'], correct: 1, why: 'しがつ じゅうしちにち = 17/4.' },
        { q: '② ワン', options: ['1/20', '1/2', '7/20'], correct: 0, why: 'いちがつ はつか = 20/1.' },
        { q: '③ ダニエル', options: ['7/7', '4/1', '7/1'], correct: 2, why: 'しちがつ ついたち = 1/7.' },
        { q: '④ パク', options: ['10/4', '10/14', '10/24'], correct: 1, why: 'じゅうがつ じゅうよっか = 14/10.' },
      ],
    },

    { t: 'h', text: 'Bài nghe 4 — Sở thích' },
    {
      t: 'listen',
      id: 'b1-nghe-5',
      title: 'Hai cặp nói về sở thích',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'マルコさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Maruko-san no shumi wa nan desu ka.', vi: 'Sở thích của Marco là gì?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'サッカーとテニスです。アンナさんは？', ro: 'Sakkā to tenisu desu. Anna-san wa?', vi: 'Bóng đá và tennis. Còn Anna?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}です。', ro: 'Watashi no shumi wa ongaku desu.', vi: 'Sở thích của tôi là âm nhạc.' },
        { who: 'パク', voice: 'ja-nu', text: 'ナタポンさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Natapon-san no shumi wa nan desu ka.', vi: 'Sở thích của Natapon là gì?' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{料理|りょうり}です。', ro: 'Ryōri desu.', vi: 'Nấu ăn.' },
        { who: 'パク', voice: 'ja-nu', text: 'あっ、{私|わたし}の{趣味|しゅみ}も{料理|りょうり}です。{料理|りょうり}と{旅行|りょこう}です。', ro: 'A!, watashi no shumi mo ryōri desu. Ryōri to ryokō desu.', vi: 'Á, sở thích của tôi cũng là nấu ăn. Nấu ăn và du lịch.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'わあ、{同|おな}じですね。', ro: 'Wā, onaji desu ne.', vi: 'Oa, giống nhau nhỉ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q4',
      title: 'Câu hỏi bài nghe 4',
      items: [
        { q: 'マルコさんの{趣味|しゅみ}は？', options: ['サッカーと{水泳|すいえい}', 'サッカーとテニス', '{音楽|おんがく}'], correct: 1, why: 'サッカーとテニスです。' },
        { q: 'アンナさんの{趣味|しゅみ}は？', options: ['{音楽|おんがく}', '{映画|えいが}', '{読書|どくしょ}'], correct: 0, why: '私の趣味は音楽です。' },
        { q: 'ナタポンさんの{趣味|しゅみ}は？', options: ['{旅行|りょこう}', '{料理|りょうり}', 'スポーツ'], correct: 1, why: '料理です。' },
        { q: 'パクさんの{趣味|しゅみ}は？', options: ['{読書|どくしょ}', '{料理|りょうり}と{旅行|りょこう}', '{旅行|りょこう}と{映画|えいが}'], correct: 1, why: 'Park: 私の趣味も料理です。料理と旅行です。' },
        { q: 'Ai có CÙNG sở thích?', options: ['マルコ と アンナ', 'パク と ナタポン', 'アンナ と パク'], correct: 1, why: '私の趣味**も**料理です — Park và Natapon cùng thích nấu ăn.' },
      ],
    },

    { t: 'h', text: 'Bài nghe 5 — Hội thoại dài (nghe lại cả bài)' },
    {
      t: 'listen',
      id: 'b1-nghe-6',
      title: '西川さん と メアリーさん',
      lines: [
        { who: '西川', voice: 'ja-nam', text: 'こんにちは。', ro: 'Konnichiwa.', vi: 'Xin chào.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'あ、こんにちは。', ro: 'A, konnichiwa.', vi: 'À, xin chào.' },
        { who: '西川', voice: 'ja-nam', text: 'はじめまして。{西川|にしかわ}です。どうぞよろしくお{願|ねが}いします。', ro: 'Hajimemashite. Nishikawa desu. Dōzo yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Nishikawa. Rất mong được giúp đỡ.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'メアリーです。こちらこそ、どうぞよろしくお{願|ねが}いします。', ro: 'Mearī desu. Kochira koso, dōzo yoroshiku onegaishimasu.', vi: 'Tôi là Mary. Tôi cũng rất mong được giúp đỡ.' },
        { who: '西川', voice: 'ja-nam', text: 'メアリーさん、お{国|くに}はどちらですか。', ro: 'Mearī-san, o-kuni wa dochira desu ka.', vi: 'Mary đến từ nước nào?' },
        { who: 'メアリー', voice: 'ja-nu', text: 'アメリカです。{西川|にしかわ}さんは{日本人|にほんじん}ですか。', ro: 'Amerika desu. Nishikawa-san wa Nihonjin desu ka.', vi: 'Mỹ. Anh Nishikawa là người Nhật à?' },
        { who: '西川', voice: 'ja-nam', text: 'はい、{日本人|にほんじん}です。', ro: 'Hai, Nihonjin desu.', vi: 'Vâng, người Nhật.' },
        { who: 'メアリー', voice: 'ja-nu', text: '{西川|にしかわ}さんは{学生|がくせい}ですか。', ro: 'Nishikawa-san wa gakusei desu ka.', vi: 'Anh Nishikawa là sinh viên à?' },
        { who: '西川', voice: 'ja-nam', text: 'いいえ、{学生|がくせい}じゃありません。さくら{高校|こうこう}の{教師|きょうし}です。', ro: 'Iie, gakusei ja arimasen. Sakura kōkō no kyōshi desu.', vi: 'Không, không phải sinh viên. Giáo viên trường THPT Sakura.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'そうですか。{私|わたし}も{教師|きょうし}です。あおぞら{日本語学校|にほんごがっこう}の{教師|きょうし}です。', ro: 'Sō desu ka. Watashi mo kyōshi desu. Aozora nihongo gakkō no kyōshi desu.', vi: 'Vậy à. Tôi cũng là giáo viên. Giáo viên trường tiếng Nhật Aozora.' },
        { who: '西川', voice: 'ja-nam', text: 'メアリーさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Mearī-san no shumi wa nan desu ka.', vi: 'Sở thích của Mary là gì?' },
        { who: 'メアリー', voice: 'ja-nu', text: '{旅行|りょこう}と{読書|どくしょ}です。{西川|にしかわ}さんは？', ro: 'Ryokō to dokusho desu. Nishikawa-san wa?', vi: 'Du lịch và đọc sách. Còn anh Nishikawa?' },
        { who: '西川', voice: 'ja-nam', text: '{私|わたし}の{趣味|しゅみ}は{水泳|すいえい}です。', ro: 'Watashi no shumi wa suiei desu.', vi: 'Sở thích của tôi là bơi lội.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q5',
      title: 'Câu hỏi bài nghe 5',
      items: [
        { q: 'メアリーさんのお{国|くに}は？', options: ['{日本|にほん}', 'アメリカ', 'オーストラリア'], correct: 1, why: 'アメリカです。' },
        { q: '{西川|にしかわ}さんは{学生|がくせい}ですか。', options: ['はい、{学生|がくせい}です。', 'いいえ、{会社員|かいしゃいん}です。', 'いいえ、{教師|きょうし}です。'], correct: 2, why: '学生じゃありません。さくら高校の教師です。' },
        { q: 'メアリーさんのお{仕事|しごと}は？', options: ['さくら{高校|こうこう}の{教師|きょうし}', 'あおぞら{日本語学校|にほんごがっこう}の{教師|きょうし}', 'あおぞら{日本語学校|にほんごがっこう}の{学生|がくせい}'], correct: 1, why: '私も教師です。あおぞら日本語学校の教師です。' },
        { q: 'メアリーさんの{趣味|しゅみ}は？', options: ['{旅行|りょこう}と{読書|どくしょ}', '{水泳|すいえい}', '{旅行|りょこう}と{映画|えいが}'], correct: 0, why: '旅行と読書です。' },
        { q: '{西川|にしかわ}さんの{趣味|しゅみ}は？', options: ['{読書|どくしょ}', '{水泳|すいえい}', 'テニス'], correct: 1, why: '私の趣味は水泳です。' },
      ],
    },

    { t: 'h', text: 'Nghe và chọn câu đáp đúng' },
    {
      t: 'mcq',
      id: 'b1-nghe-q6',
      title: 'Người kia nói câu này — bạn đáp thế nào?',
      items: [
        { q: 'はじめまして。ワンです。よろしくお{願|ねが}いします。', options: ['そうですか。', 'はじめまして。こちらこそよろしくお{願|ねが}いします。', 'はい、ワンです。'], correct: 1, why: 'Đáp lại lời chào lần đầu: はじめまして + こちらこそ…' },
        { q: 'お{国|くに}はどちらですか。', options: ['はい、ベトナムです。', 'ベトナムです。', 'ベトナム{人|じん}じゃありません。'], correct: 1, why: 'Có từ để hỏi (どちら) thì không dùng はい; đáp thẳng tên nước.' },
        { q: '{学生|がくせい}ですか。 (bạn là sinh viên)', options: ['はい、{学生|がくせい}です。', '{学生|がくせい}。', 'いいえ、{学生|がくせい}です。'], correct: 0, why: 'はい + câu đầy đủ.' },
        { q: '{私|わたし}の{趣味|しゅみ}はテニスです。 (bạn cũng thích tennis)', options: ['あっ、{私|わたし}の{趣味|しゅみ}もテニスです。', '{私|わたし}の{趣味|しゅみ}はもテニスです。', 'テニスですか。いいえ。'], correct: 0, why: 'も thay chỗ は.' },
        { q: 'ブラジルです。 (bạn vừa nghe câu trả lời)', options: ['こちらこそ。', 'そうですか。', 'はじめまして。'], correct: 1, why: 'そうですか (xuống giọng) = "vậy à", cho thấy bạn đã nghe.' },
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI (dạng thi JPD113) ══════════════════════════ */

const NOI: Lesson = {
  id: 'b1-noi',
  kind: 'speaking',
  title: 'Luyện nói theo đề thi JPD113 — Bài 1',
  goal: 'Tự giới thiệu trôi chảy, trả lời đủ câu mọi câu hỏi Bài 1 (có tranh + không tranh) và đọc to đoạn văn tự giới thiệu.',
  minutes: 45,
  blocks: [
    { t: 'h', text: 'Đề thi nói JPD113 gồm gì' },
    {
      t: 'table',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 1 dùng ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 ký tự', 'Đoạn tự giới thiệu (tên, nước, trường, tuổi, sở thích)'],
        ['Talking — có tranh', '3 × 15', 'Giám thị chỉ tranh/thẻ nhân vật, hỏi 3 câu', 'Thẻ thông tin: tên, tuổi, nghề, nước, sinh nhật, sở thích'],
        ['Talking — không tranh', '1 × 10', 'Giám thị hỏi 1 câu về bạn', 'Tên, nước, nghề, tuổi, sinh nhật, sở thích'],
        ['Presenting', '5', 'Chào khi vào và trước khi ra khỏi phòng', 'はじめまして・よろしくお願いします'],
      ],
    },
    {
      t: 'note',
      title: 'Cách chấm — lỗi hay mất điểm',
      items: [
        'Sai **trợ từ**: trừ 2 điểm mỗi lỗi (は／の／と／も — đúng 4 trợ từ của Bài 1).',
        'Trả lời có/không mà **quên はい／いいえ**: trừ tới 5 điểm.',
        'Đúng ngữ pháp nhưng **dùng sai từ** (ví dụ nói 会社員 thay vì 教師): tối đa còn 3 điểm.',
        'Sai làm **đổi nghĩa** cả câu (ví dụ nghe 何歳 mà trả lời ngày sinh): mất trọn câu.',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần mà không bị trừ**: もういちど おねがいします。',
        'Đọc sai **một ký tự** hiragana ở phần Reading: trừ 0,2 điểm.',
      ],
    },

    { t: 'h', text: 'Vào và ra phòng thi (Presenting 5 điểm)' },
    {
      t: 'dialogue',
      title: 'Chào khi vào phòng',
      lines: [
        { who: 'Bạn', role: 'candidate', text: 'しつれいします。', ro: 'Shitsurei shimasu.', vi: 'Em xin phép ạ. (gõ cửa, bước vào)' },
        { who: 'Giám thị', role: 'examiner', text: 'どうぞ。', ro: 'Dōzo.', vi: 'Mời em.' },
        { who: 'Bạn', role: 'candidate', text: 'こんにちは。はじめまして。クオンです。よろしくお{願|ねが}いします。', ro: 'Konnichiwa. Hajimemashite. Kuon desu. Yoroshiku onegaishimasu.', vi: 'Em chào thầy/cô. Em là Cường. Mong thầy/cô giúp đỡ ạ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Chào khi ra về',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'はい、おわりです。', ro: 'Hai, owari desu.', vi: 'Được rồi, xong rồi.' },
        { who: 'Bạn', role: 'candidate', text: 'ありがとうございました。しつれいします。', ro: 'Arigatō gozaimashita. Shitsurei shimasu.', vi: 'Em cảm ơn ạ. Em xin phép ra ạ.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'もういちど おねがいします。', ro: 'Mō ichido onegaishimasu.', vi: 'Xin nhắc lại một lần nữa ạ. (không bị trừ điểm, tối đa 2 lần)' },
        { en: 'ゆっくり おねがいします。', ro: 'Yukkuri onegaishimasu.', vi: 'Xin nói chậm lại ạ.' },
        { en: 'すみません、わかりません。', ro: 'Sumimasen, wakarimasen.', vi: 'Xin lỗi, em không hiểu ạ. (vẫn hơn im lặng)' },
      ],
    },

    { t: 'h', text: '自己紹介 — Bài tự giới thiệu mẫu' },
    { t: 'p', text: 'Học thuộc khung này, thay thông tin của bạn. 8 câu, mỗi câu dùng một mẫu của Bài 1 — nói trôi được là đã có sẵn câu trả lời cho gần hết câu hỏi không tranh.' },
    {
      t: 'examples',
      items: [
        { en: 'はじめまして。', ro: 'Hajimemashite.', vi: 'Rất vui được gặp thầy/cô.' },
        { en: '{私|わたし}はクオンです。', ro: 'Watashi wa Kuon desu.', vi: 'Em là Cường. (ポイント 1)' },
        { en: 'ベトナム{人|じん}です。', ro: 'Betonamu-jin desu.', vi: 'Em là người Việt Nam.' },
        { en: 'FPT{大学|だいがく}の{学生|がくせい}です。', ro: 'Efu-pī-tī daigaku no gakusei desu.', vi: 'Em là sinh viên Đại học FPT. (ポイント 4)' },
        { en: '{二十歳|はたち}です。', ro: 'Hatachi desu.', vi: 'Em 20 tuổi.' },
        { en: '{誕生日|たんじょうび}は{8月|はちがつ}{4日|よっか}です。', ro: 'Tanjōbi wa hachigatsu yokka desu.', vi: 'Sinh nhật em là ngày 4 tháng 8.' },
        { en: '{趣味|しゅみ}は{音楽|おんがく}と{読書|どくしょ}です。', ro: 'Shumi wa ongaku to dokusho desu.', vi: 'Sở thích của em là âm nhạc và đọc sách. (ポイント 5)' },
        { en: 'どうぞよろしくお{願|ねが}いします。', ro: 'Dōzo yoroshiku onegaishimasu.', vi: 'Rất mong được giúp đỡ ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Thay thông tin của bạn',
      head: ['Câu', 'Khung', 'Bạn điền'],
      rows: [
        ['Tên', '{私|わたし}は ___ です。', 'Tên bằng katakana (bảng dưới)'],
        ['Quốc tịch', '___{人|じん}です。', 'ベトナム'],
        ['Trường / việc', '___ の{学生|がくせい}です。', 'FPT{大学|だいがく} (エフピーティーだいがく)'],
        ['Tuổi', '___{歳|さい}です。', '{18歳|じゅうはっさい}・{19歳|じゅうきゅうさい}・{二十歳|はたち}・{21歳|にじゅういっさい}・{22歳|にじゅうにさい}'],
        ['Sinh nhật', '{誕生日|たんじょうび}は ___{月|がつ} ___{日|にち}です。', 'Xem bảng ngày tháng ở bài Từ vựng'],
        ['Sở thích', '{趣味|しゅみ}は ___ と ___ です。', 'サッカー・テニス・{水泳|すいえい}・{映画|えいが}・{音楽|おんがく}・{読書|どくしょ}・{旅行|りょこう}・{料理|りょうり}・スポーツ'],
      ],
    },
    {
      t: 'table',
      caption: 'Tên Việt viết bằng katakana (ví dụ)',
      head: ['Tên', 'Katakana', 'Tên', 'Katakana'],
      rows: [
        ['Cường', 'クオン', 'Hoa', 'ホア'],
        ['Nam', 'ナム', 'Linh', 'リン'],
        ['Minh', 'ミン', 'Hương', 'フオン'],
        ['Tuấn', 'トゥアン', 'An', 'アン'],
      ],
    },

    { t: 'h', text: 'Câu hỏi không tranh (10 điểm) — ngân hàng Bài 1' },
    { t: 'p', text: 'Đây là đủ các câu hỏi về bản thân mà đề mẫu Lesson 1 và bộ "Luyện nói" của cô đưa ra. Câu trả lời mẫu dùng hồ sơ: Cường, người Việt, sinh viên FPT, 20 tuổi, sinh 4/8, thích âm nhạc và đọc sách.' },
    {
      t: 'dialogue',
      title: 'Hỏi–đáp 1: tên, nước, nghề',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'お{名前|なまえ}は？', ro: 'O-namae wa?', vi: 'Tên em là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{名前|なまえ}はクオンです。', ro: 'Watashi no namae wa Kuon desu.', vi: 'Tên em là Cường.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんのお{国|くに}はどちらですか。', ro: 'Kuon-san no o-kuni wa dochira desu ka.', vi: 'Em đến từ nước nào?' },
        { who: 'Bạn', role: 'candidate', text: 'ベトナムです。', ro: 'Betonamu desu.', vi: 'Việt Nam ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんはベトナム{人|じん}ですか。', ro: 'Kuon-san wa Betonamu-jin desu ka.', vi: 'Em là người Việt Nam à?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、ベトナム{人|じん}です。', ro: 'Hai, Betonamu-jin desu.', vi: 'Vâng, em là người Việt Nam.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんは{日本人|にほんじん}ですか。', ro: 'Kuon-san wa Nihonjin desu ka.', vi: 'Em là người Nhật à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{日本人|にほんじん}じゃありません。ベトナム{人|じん}です。', ro: 'Iie, Nihonjin ja arimasen. Betonamu-jin desu.', vi: 'Không, em không phải người Nhật. Em là người Việt Nam.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんのお{仕事|しごと}は？', ro: 'Kuon-san no o-shigoto wa?', vi: 'Công việc của em là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{学生|がくせい}です。FPT{大学|だいがく}の{学生|がくせい}です。', ro: 'Gakusei desu. Efu-pī-tī daigaku no gakusei desu.', vi: 'Em là sinh viên. Sinh viên Đại học FPT.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんは{学生|がくせい}ですか。', ro: 'Kuon-san wa gakusei desu ka.', vi: 'Em là sinh viên à?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{学生|がくせい}です。', ro: 'Hai, gakusei desu.', vi: 'Vâng, em là sinh viên.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんは{会社員|かいしゃいん}ですか。', ro: 'Kuon-san wa kaishain desu ka.', vi: 'Em là nhân viên công ty à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{会社員|かいしゃいん}じゃありません。{学生|がくせい}です。', ro: 'Iie, kaishain ja arimasen. Gakusei desu.', vi: 'Không, em không phải nhân viên công ty. Em là sinh viên.' },
        { who: 'Giám thị', role: 'examiner', text: 'どこの{学生|がくせい}ですか。', ro: 'Doko no gakusei desu ka.', vi: 'Em là sinh viên trường nào?' },
        { who: 'Bạn', role: 'candidate', text: 'FPT{大学|だいがく}の{学生|がくせい}です。', ro: 'Efu-pī-tī daigaku no gakusei desu.', vi: 'Em là sinh viên Đại học FPT.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi–đáp 2: tuổi, sinh nhật, sở thích',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんは{何歳|なんさい}ですか。', ro: 'Kuon-san wa nansai desu ka.', vi: 'Em bao nhiêu tuổi?' },
        { who: 'Bạn', role: 'candidate', text: '{二十歳|はたち}です。', ro: 'Hatachi desu.', vi: 'Em 20 tuổi.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんの{誕生日|たんじょうび}はいつですか。', ro: 'Kuon-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật em khi nào?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{誕生日|たんじょうび}は{8月|はちがつ}{4日|よっか}です。', ro: 'Watashi no tanjōbi wa hachigatsu yokka desu.', vi: 'Sinh nhật em là ngày 4 tháng 8.' },
        { who: 'Giám thị', role: 'examiner', text: '{誕生日|たんじょうび}は{何月|なんがつ}{何日|なんにち}ですか。', ro: 'Tanjōbi wa nangatsu nannichi desu ka.', vi: 'Sinh nhật em ngày mấy tháng mấy?' },
        { who: 'Bạn', role: 'candidate', text: '{8月|はちがつ}{4日|よっか}です。', ro: 'Hachigatsu yokka desu.', vi: 'Ngày 4 tháng 8 ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Kuon-san no shumi wa nan desu ka.', vi: 'Sở thích của em là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}と{読書|どくしょ}です。', ro: 'Watashi no shumi wa ongaku to dokusho desu.', vi: 'Sở thích của em là âm nhạc và đọc sách.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんの{趣味|しゅみ}はサッカーと{水泳|すいえい}ですか。', ro: 'Kuon-san no shumi wa sakkā to suiei desu ka.', vi: 'Sở thích của em là bóng đá và bơi lội à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、サッカーと{水泳|すいえい}じゃありません。{音楽|おんがく}と{読書|どくしょ}です。', ro: 'Iie, sakkā to suiei ja arimasen. Ongaku to dokusho desu.', vi: 'Không, không phải bóng đá và bơi lội. Là âm nhạc và đọc sách.' },
        { who: 'Giám thị', role: 'examiner', text: 'クオンさんの{趣味|しゅみ}はテニスですか。', ro: 'Kuon-san no shumi wa tenisu desu ka.', vi: 'Sở thích của em là tennis à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、テニスじゃありません。{音楽|おんがく}です。', ro: 'Iie, tenisu ja arimasen. Ongaku desu.', vi: 'Không, không phải tennis. Là âm nhạc.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy hay sai ở phần không tranh',
      items: [
        'お{国|くに}は？ → **ベトナムです** (tên nước). {何人|なにじん}ですか → **ベトナム{人|じん}です** (người nước).',
        '{何歳|なんさい}／おいくつ = hỏi **tuổi**; {誕生日|たんじょうび}はいつ = hỏi **ngày sinh**. Nghe kỹ từ để hỏi trước khi đáp — đáp nhầm là mất trọn câu.',
        '20 tuổi: **はたち** (にじゅっさい cũng hiểu được, nhưng はたち là cách chuẩn). 21 = にじゅう**いっ**さい.',
        'Không nói ~~クオンさんです~~ về mình. Không thêm お vào đồ của mình: ~~{私|わたし}のお{名前|なまえ}~~.',
        'Câu hỏi có/không: **はい／いいえ + nhắc lại cả câu**. Câu hỏi có どちら／いつ／何: KHÔNG dùng はい.',
      ],
    },

    { t: 'h', text: 'Câu hỏi có tranh (15 điểm mỗi câu) — thẻ nhân vật' },
    {
      t: 'p',
      text: 'Giám thị đưa một thẻ thông tin của **người khác** và hỏi về người đó. Trả lời ở **ngôi thứ ba**: [tên]さん**は** … です. Nhắc lại danh từ của câu hỏi, luôn kết bằng です. Trả lời theo **TRANH**, không theo sách (trong tranh thi, カルロス là giáo viên chứ không phải nhân viên công ty).',
    },
    {
      t: 'table',
      caption: 'Các thẻ nhân vật trong ngân hàng đề Bài 1',
      head: ['Thẻ', 'Nước', 'Tuổi', 'Sinh nhật', 'Nghề', 'Sở thích'],
      rows: [
        ['すずき', '{日本|にほん} (người Nhật)', '30 — さんじゅっさい', '20/10 — {10月|じゅうがつ}{20日|はつか}', '{会社員|かいしゃいん}', '{水泳|すいえい}と{旅行|りょこう}'],
        ['カルロス', 'ブラジル', '41 — よんじゅういっさい', '17/4 — {4月|しがつ}{17日|じゅうしちにち}', '{教師|きょうし}', 'スポーツと{料理|りょうり}'],
        ['マリヤム', 'イタリア', '26 — にじゅうろくさい', '—', '{学生|がくせい}', '—'],
        ['カリナ／アンナ', '—', 'カリナ 20 — はたち · アンナ 31 — さんじゅういっさい', '—', '—', '—'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Thẻ すずき',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'すずきさんのお{国|くに}はどちらですか。', ro: 'Suzuki-san no o-kuni wa dochira desu ka.', vi: 'Suzuki đến từ nước nào?' },
        { who: 'Bạn', role: 'candidate', text: 'すずきさんのお{国|くに}は{日本|にほん}です。', ro: 'Suzuki-san no o-kuni wa Nihon desu.', vi: 'Nước của Suzuki là Nhật Bản.' },
        { who: 'Giám thị', role: 'examiner', text: 'すずきさんは{何歳|なんさい}ですか。', ro: 'Suzuki-san wa nansai desu ka.', vi: 'Suzuki bao nhiêu tuổi?' },
        { who: 'Bạn', role: 'candidate', text: 'すずきさんは{30歳|さんじゅっさい}です。', ro: 'Suzuki-san wa sanjussai desu.', vi: 'Suzuki 30 tuổi.' },
        { who: 'Giám thị', role: 'examiner', text: 'すずきさんの{誕生日|たんじょうび}はいつですか。', ro: 'Suzuki-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật Suzuki là khi nào?' },
        { who: 'Bạn', role: 'candidate', text: 'すずきさんの{誕生日|たんじょうび}は{10月|じゅうがつ}{20日|はつか}です。', ro: 'Suzuki-san no tanjōbi wa jūgatsu hatsuka desu.', vi: 'Sinh nhật Suzuki là ngày 20 tháng 10.' },
        { who: 'Giám thị', role: 'examiner', text: 'すずきさんは{学生|がくせい}ですか。', ro: 'Suzuki-san wa gakusei desu ka.', vi: 'Suzuki là sinh viên à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、すずきさんは{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。', ro: 'Iie, Suzuki-san wa gakusei ja arimasen. Kaishain desu.', vi: 'Không, Suzuki không phải sinh viên. Là nhân viên công ty.' },
        { who: 'Giám thị', role: 'examiner', text: 'すずきさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Suzuki-san no shumi wa nan desu ka.', vi: 'Sở thích của Suzuki là gì?' },
        { who: 'Bạn', role: 'candidate', text: 'すずきさんの{趣味|しゅみ}は{水泳|すいえい}と{旅行|りょこう}です。', ro: 'Suzuki-san no shumi wa suiei to ryokō desu.', vi: 'Sở thích của Suzuki là bơi lội và du lịch.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Thẻ カルロス',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'カルロスさんはブラジル{人|じん}ですか。', ro: 'Karurosu-san wa Burajiru-jin desu ka.', vi: 'Carlos là người Brazil à?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、カルロスさんはブラジル{人|じん}です。', ro: 'Hai, Karurosu-san wa Burajiru-jin desu.', vi: 'Vâng, Carlos là người Brazil.' },
        { who: 'Giám thị', role: 'examiner', text: 'カルロスさんは{何歳|なんさい}ですか。', ro: 'Karurosu-san wa nansai desu ka.', vi: 'Carlos bao nhiêu tuổi?' },
        { who: 'Bạn', role: 'candidate', text: 'カルロスさんは{41歳|よんじゅういっさい}です。', ro: 'Karurosu-san wa yonjūissai desu.', vi: 'Carlos 41 tuổi.' },
        { who: 'Giám thị', role: 'examiner', text: 'カルロスさんのお{仕事|しごと}は{何|なん}ですか。', ro: 'Karurosu-san no o-shigoto wa nan desu ka.', vi: 'Công việc của Carlos là gì?' },
        { who: 'Bạn', role: 'candidate', text: 'カルロスさんは{教師|きょうし}です。', ro: 'Karurosu-san wa kyōshi desu.', vi: 'Carlos là giáo viên.' },
        { who: 'Giám thị', role: 'examiner', text: 'カルロスさんの{誕生日|たんじょうび}はいつですか。', ro: 'Karurosu-san no tanjōbi wa itsu desu ka.', vi: 'Sinh nhật Carlos là khi nào?' },
        { who: 'Bạn', role: 'candidate', text: 'カルロスさんの{誕生日|たんじょうび}は{4月|しがつ}{17日|じゅうしちにち}です。', ro: 'Karurosu-san no tanjōbi wa shigatsu jūshichi-nichi desu.', vi: 'Sinh nhật Carlos là ngày 17 tháng 4.' },
        { who: 'Giám thị', role: 'examiner', text: 'カルロスさんの{趣味|しゅみ}はテニスですか。', ro: 'Karurosu-san no shumi wa tenisu desu ka.', vi: 'Sở thích của Carlos là tennis à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、テニスじゃありません。カルロスさんの{趣味|しゅみ}はスポーツと{料理|りょうり}です。', ro: 'Iie, tenisu ja arimasen. Karurosu-san no shumi wa supōtsu to ryōri desu.', vi: 'Không, không phải tennis. Sở thích của Carlos là thể thao và nấu ăn.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Thẻ マリヤム và đề mẫu カリナ／アンナ',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'この{人|ひと}の{名前|なまえ}は？', ro: 'Kono hito no namae wa?', vi: 'Tên người này là gì?' },
        { who: 'Bạn', role: 'candidate', text: 'マリヤムさんです。', ro: 'Mariyamu-san desu.', vi: 'Là Mariyam.' },
        { who: 'Giám thị', role: 'examiner', text: 'マリヤムさんのお{国|くに}はどちらですか。', ro: 'Mariyamu-san no o-kuni wa dochira desu ka.', vi: 'Mariyam đến từ nước nào?' },
        { who: 'Bạn', role: 'candidate', text: 'マリヤムさんのお{国|くに}はイタリアです。', ro: 'Mariyamu-san no o-kuni wa Itaria desu.', vi: 'Nước của Mariyam là Ý.' },
        { who: 'Giám thị', role: 'examiner', text: 'マリヤムさんは{学生|がくせい}ですか。', ro: 'Mariyamu-san wa gakusei desu ka.', vi: 'Mariyam là sinh viên à?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、マリヤムさんは{学生|がくせい}です。', ro: 'Hai, Mariyamu-san wa gakusei desu.', vi: 'Vâng, Mariyam là sinh viên.' },
        { who: 'Giám thị', role: 'examiner', text: 'アンナさんは{何歳|なんさい}ですか。', ro: 'Anna-san wa nansai desu ka.', vi: 'Anna bao nhiêu tuổi?' },
        { who: 'Bạn', role: 'candidate', text: 'アンナさんは{31歳|さんじゅういっさい}です。', ro: 'Anna-san wa sanjūissai desu.', vi: 'Anna 31 tuổi.' },
        { who: 'Giám thị', role: 'examiner', text: 'カリナさんは{20歳|はたち}ですか。', ro: 'Karina-san wa hatachi desu ka.', vi: 'Karina 20 tuổi phải không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、カリナさんは{二十歳|はたち}です。', ro: 'Hai, Karina-san wa hatachi desu.', vi: 'Vâng, Karina 20 tuổi.' },
      ],
    },
    {
      t: 'note',
      title: 'Quy tắc vàng phần tranh',
      items: [
        'LUÔN trả lời **câu đầy đủ** kết bằng です, nhắc lại tên người trong tranh: **すずきさんは{会社員|かいしゃいん}です。** hơn "{会社員|かいしゃいん}".',
        'Giám thị đang chấm việc bạn **dựng được câu**, không phải việc bạn nhìn ra đáp án.',
        'この{人|ひと} = "người này" (giám thị chỉ vào tranh). Đáp bằng tên + さん.',
      ],
    },

    { t: 'h', text: 'Đọc to (Reading 40 điểm) — đoạn tự giới thiệu' },
    {
      t: 'p',
      text: 'Đề đọc ~100–110 ký tự: **4 từ chữ Hán gạch chân** (12 điểm, không furigana), **4 từ katakana** (12 điểm), **70–80 chữ hiragana** (16 điểm, sai một chữ trừ 0,2). Bạn có **30 giây** chuẩn bị: dùng nó để khoanh các con số và chữ Hán, đọc thầm chúng trước. Các đoạn dưới lấy từ bộ "Luyện nói" của cô và ngân hàng đề — bấm nghe, đọc theo, rồi tắt furigana và đọc lại.',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'はじめまして。{私|わたし}はアンナです。ちゅうごくじんです。シャンハイ{大学|だいがく}の{学生|がくせい}です。20さいです。{趣味|しゅみ}は{読書|どくしょ}と{映画|えいが}です。どうぞよろしくお{願|ねが}いします。',
          ro: 'Hajimemashite. Watashi wa Anna desu. Chūgokujin desu. Shanhai daigaku no gakusei desu. Hatachi desu. Shumi wa dokusho to eiga desu. Dōzo yoroshiku onegaishimasu.',
          vi: 'Rất vui được gặp. Tôi là Anna. Tôi là người Trung Quốc. Tôi là sinh viên ĐH Thượng Hải. Tôi 20 tuổi. Sở thích là đọc sách và phim. Rất mong được giúp đỡ. — Chú ý: 20さい đọc はたち (hoặc にじゅっさい).',
        },
        {
          en: 'はじめまして。{私|わたし}はカルロスです。アメリカじんです。{東京|とうきょう}{会社|かいしゃ}のしゃいんです。31さいです。{趣味|しゅみ}はテニスです。どうぞよろしくお{願|ねが}いします。',
          ro: 'Hajimemashite. Watashi wa Karurosu desu. Amerika-jin desu. Tōkyō kaisha no shain desu. Sanjūissai desu. Shumi wa tenisu desu. Dōzo yoroshiku onegaishimasu.',
          vi: 'Rất vui được gặp. Tôi là Carlos. Người Mỹ. Nhân viên Công ty Tokyo. 31 tuổi. Sở thích là tennis. Rất mong được giúp đỡ. — Chú ý: 31 = さんじゅう**いっ**さい; {東京|とうきょう} hai âm dài.',
        },
        {
          en: 'はじめまして。{私|わたし}はメイです。タイじんです。さくら{高校|こうこう}のきょうしです。48さいです。{趣味|しゅみ}はスポーツと{音楽|おんがく}です。どうぞよろしくお{願|ねが}いします。',
          ro: 'Hajimemashite. Watashi wa Mei desu. Tai-jin desu. Sakura kōkō no kyōshi desu. Yonjūhassai desu. Shumi wa supōtsu to ongaku desu. Dōzo yoroshiku onegaishimasu.',
          vi: 'Rất vui được gặp. Tôi là Mei. Người Thái. Giáo viên trường THPT Sakura. 48 tuổi. Sở thích là thể thao và âm nhạc. Rất mong được giúp đỡ. — Chú ý: 48 = よんじゅう**はっ**さい.',
        },
        {
          en: 'はじめまして、{私|わたし}はアンナです。オーストラリア{人|じん}です。さくら{日本語学校|にほんごがっこう}の{学生|がくせい}です。ことし、{二十歳|はたち}です。{私|わたし}のしゅみはおんがくとどくしょです。よろしくおねがいします。',
          ro: 'Hajimemashite, watashi wa Anna desu. Ōsutoraria-jin desu. Sakura nihongo gakkō no gakusei desu. Kotoshi, hatachi desu. Watashi no shumi wa ongaku to dokusho desu. Yoroshiku onegaishimasu.',
          vi: 'Rất vui được gặp, tôi là Anna. Tôi là người Úc. Học sinh trường Nhật ngữ Sakura. Năm nay 20 tuổi. Sở thích của tôi là âm nhạc và đọc sách. Mong được giúp đỡ. — (ことし = năm nay)',
        },
        {
          en: 'ワットさんはアメリカ{人|じん}です。おおさか{大学|だいがく}の{先生|せんせい}です。61さいです。ワットさんのしゅみはおんがくとスポーツです。きむらさんのしゅみもスポーツです。',
          ro: 'Watto-san wa Amerika-jin desu. Ōsaka daigaku no sensei desu. Rokujūissai desu. Watto-san no shumi wa ongaku to supōtsu desu. Kimura-san no shumi mo supōtsu desu.',
          vi: 'Ông Watt là người Mỹ. Ông là giáo viên ĐH Osaka. 61 tuổi. Sở thích của ông Watt là âm nhạc và thể thao. Sở thích của ông Kimura cũng là thể thao. — Chú ý: 61 = ろくじゅう**いっ**さい; しゅみ**も**.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo đọc to',
      items: [
        'Đọc trợ từ **は = wa** (わたし**は** → watashi wa). Đây là lỗi mất điểm nhiều nhất ở phần đọc.',
        'Âm dài (こうこう, とうきょう, オーストラリア) phải kéo đủ hai nhịp; âm ngắt (いっさい, はっさい) ngắt một nhịp.',
        'Ngắt hơi ở dấu 。 và 、, đọc đều — ngập ngừng bị trừ tối đa 5% mỗi phần.',
      ],
    },

    { t: 'h', text: 'Ghi âm và cho AI chấm' },
    {
      t: 'speak',
      id: 'b1-noi-ghi-am',
      part: '1',
      questions: [
        'じこしょうかいを してください。',
        'おなまえは？',
        'おくには どちらですか。',
        'おしごとは なんですか。',
        'がくせいですか。',
        'かいしゃいんですか。',
        'ベトナムじんですか。',
        'にほんじんですか。',
        'なんさいですか。',
        'たんじょうびは いつですか。',
        'しゅみは なんですか。',
        'しゅみは サッカーと すいえいですか。',
      ],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const G_ALL = 'ポイント 1–6: N1はN2です · ですか／はい・いいえ、じゃありません · Nはどちら／いつ／何ですか · N1のN2 · N1とN2 · Nも';

const BAI_TAP: Lesson = {
  id: 'b1-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 1',
  goal: 'Tự viết, tự ghép và tự kiểm tra được mọi mẫu câu của Bài 1.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ Japanese (hiragana) trên máy. Chữ Hán **không bắt buộc**: gõ toàn hiragana (がくせいです) cũng được chấm đúng. Dấu 。 cuối câu có hay không đều được.',
    },
    {
      t: 'quiz',
      id: 'b1-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: G_ALL,
      items: [
        { q: 'Tôi là người Trung Quốc.', answers: ans('{私|わたし}は{中国人|ちゅうごくじん}です。', '{中国人|ちゅうごくじん}です。'), hint: '私 (watashi · tôi), 中国人 (chūgokujin · người Trung Quốc)' },
        { q: 'Anh Carlos là nhân viên công ty.', answers: ans('カルロスさんは{会社員|かいしゃいん}です。'), hint: 'カルロスさん, 会社員 (kaishain · nhân viên công ty)' },
        { q: 'Chị Park có phải là học sinh không?', answers: ans('パクさんは{学生|がくせい}ですか。'), hint: 'パクさん, 学生 (gakusei · học sinh)' },
        { q: 'Không, tôi không phải là giáo viên.', answers: ans('いいえ、{教師|きょうし}じゃありません。', 'いいえ、{私|わたし}は{教師|きょうし}じゃありません。', 'いいえ、{先生|せんせい}じゃありません。', 'いいえ、{私|わたし}は{先生|せんせい}じゃありません。'), hint: 'いいえ (iie · không), 教師 (kyōshi · giáo viên)' },
        { q: 'Bạn đến từ nước nào? (hỏi lịch sự)', answers: ans('お{国|くに}はどちらですか。'), hint: 'お国 (okuni · nước của bạn), どちら (dochira · ở đâu)' },
        { q: 'Sinh nhật của Mary là khi nào?', answers: ans('メアリーさんの{誕生日|たんじょうび}はいつですか。'), hint: 'メアリーさん, 誕生日 (tanjōbi · sinh nhật), いつ (itsu · khi nào)' },
        { q: 'Sở thích của bạn là gì?', answers: ans('{趣味|しゅみ}は{何|なん}ですか。', 'ご{趣味|しゅみ}は{何|なん}ですか。'), hint: '趣味 (shumi · sở thích), 何 (nan · cái gì)' },
        { q: 'Tôi là sinh viên Đại học Fujimi.', answers: ans('{私|わたし}はふじみ{大学|だいがく}の{学生|がくせい}です。', 'ふじみ{大学|だいがく}の{学生|がくせい}です。'), hint: 'ふじみ大学 (Fujimi daigaku), の, 学生' },
        { q: 'Sở thích của tôi là bóng đá và bơi lội.', answers: ans('{私|わたし}の{趣味|しゅみ}はサッカーと{水泳|すいえい}です。', '{趣味|しゅみ}はサッカーと{水泳|すいえい}です。'), hint: 'サッカー (sakkā · bóng đá), と (to · và), 水泳 (suiei · bơi lội)' },
        { q: 'Sở thích của tôi cũng là du lịch.', answers: ans('{私|わたし}の{趣味|しゅみ}も{旅行|りょこう}です。'), hint: 'も (mo · cũng), 旅行 (ryokō · du lịch)' },
        { q: 'Sinh nhật của tôi là ngày 4 tháng 8.', answers: ans('{私|わたし}の{誕生日|たんじょうび}は{8月|はちがつ}{4日|よっか}です。', '{誕生日|たんじょうび}は{8月|はちがつ}{4日|よっか}です。'), hint: '8月 (hachigatsu · tháng 8), 4日 (yokka · ngày 4)' },
        { q: 'Tôi 20 tuổi.', answers: ans('{私|わたし}は{二十歳|はたち}です。', '{二十歳|はたち}です。', '{私|わたし}は{20歳|はたち}です。', '{20歳|はたち}です。', '{私|わたし}は{20歳|にじゅっさい}です。', '{20歳|にじゅっさい}です。', '{私|わたし}は20さいです。', '20さいです。'), hint: '二十歳 (hatachi · 20 tuổi)' },
        { q: 'Anh Nishikawa là giáo viên trường THPT Sakura.', answers: ans('{西川|にしかわ}さんはさくら{高校|こうこう}の{教師|きょうし}です。', '{西川|にしかわ}さんはさくら{高校|こうこう}の{先生|せんせい}です。'), hint: '西川さん (Nishikawa-san), さくら高校 (Sakura kōkō), 教師' },
        { q: 'Bạn Anna cũng là người Nga.', answers: ans('アンナさんもロシア{人|じん}です。'), hint: 'アンナさん, も, ロシア人 (Roshia-jin · người Nga)' },
        { q: 'Rất vui được gặp. Tôi là Marco. Rất mong được giúp đỡ.', answers: ans('はじめまして。マルコです。よろしくお{願|ねが}いします。', 'はじめまして。{私|わたし}はマルコです。よろしくお{願|ねが}いします。', 'はじめまして。マルコです。どうぞよろしくお{願|ねが}いします。', 'はじめまして。{私|わたし}はマルコです。どうぞよろしくお{願|ねが}いします。'), hint: 'はじめまして (hajimemashite), よろしくお願いします (yoroshiku onegaishimasu)' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: 'ダニエルさん（　）オーストラリア{人|じん}です。', options: ['は', 'の', 'と', 'か'], correct: 0, why: 'Chủ đề của câu: は (ポイント 1).' },
        { q: 'あおぞら{日本語学校|にほんごがっこう}（　）{学生|がくせい}です。', options: ['は', 'の', 'も', 'と'], correct: 1, why: 'Học sinh CỦA trường: の (ポイント 4).' },
        { q: '{趣味|しゅみ}は{映画|えいが}（　）{音楽|おんがく}です。', options: ['の', 'も', 'と', 'か'], correct: 2, why: 'Phim VÀ âm nhạc: と (ポイント 5).' },
        { q: 'ワンさんは{中国人|ちゅうごくじん}です。{私|わたし}（　）{中国人|ちゅうごくじん}です。', options: ['は', 'も', 'の', 'と'], correct: 1, why: 'Tôi CŨNG là người TQ: も (ポイント 6).' },
        { q: 'マルコさんは{学生|がくせい}です（　）。', options: ['か', 'の', 'も', 'は'], correct: 0, why: 'Câu hỏi: か (ポイント 2).' },
        { q: '{私|わたし}（　）{名前|なまえ}はナタポンです。', options: ['は', 'の', 'と', 'も'], correct: 1, why: 'Tên CỦA tôi: 私の名前 (ポイント 4).' },
        { q: 'カルロスさん（　）ナタポンさんは{会社員|かいしゃいん}です。', options: ['の', 'も', 'と', 'か'], correct: 2, why: 'Carlos VÀ Natapon: と.' },
        { q: '{木村|きむら}さんの{誕生日|たんじょうび}（　）いつですか。', options: ['は', 'の', 'も', 'と'], correct: 0, why: 'N は いつですか (ポイント 3).' },
        { q: 'パクさんの{趣味|しゅみ}は{旅行|りょこう}です。ダニエルさんの{趣味|しゅみ}（　）{旅行|りょこう}です。', options: ['は', 'と', 'の', 'も'], correct: 3, why: 'Sở thích của Daniel CŨNG là du lịch: も thay は.' },
        { q: '{西川|にしかわ}さんは{学生|がくせい}（　）ありません。', options: ['じゃ', 'の', 'も', 'か'], correct: 0, why: 'Phủ định: じゃありません (ポイント 2).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-bt-tu-vung',
      title: 'Từ vựng và cách đáp',
      items: [
        { q: 'Người ta nói "よろしくお{願|ねが}いします". Bạn đáp:', options: ['そうですか。', 'こちらこそ、よろしくお{願|ねが}いします。', 'すみません。', 'いいえ。'], correct: 1, why: 'こちらこそ = chính tôi mới là người mong.' },
        { q: 'Muốn gọi một người lạ để hỏi, bạn mở lời:', options: ['あのう、すみません。', 'こちらこそ。', 'はじめまして。', 'そうですか。'], correct: 0, why: 'あのう、すみません = À, xin lỗi cho hỏi.' },
        { q: 'Tự nói nghề của mình là giáo viên:', options: ['{私|わたし}は{先生|せんせい}さんです。', '{私|わたし}は{教師|きょうし}です。', '{私|わたし}は{学生|がくせい}です。', '{私|わたし}は{社員|しゃいん}です。'], correct: 1, why: '教師 = tên nghề; 先生 dùng để gọi người khác.' },
        { q: '"{読書|どくしょ}" nghĩa là:', options: ['du lịch', 'đọc sách', 'âm nhạc', 'nấu ăn'], correct: 1, why: '読 ĐỘC + 書 THƯ.' },
        { q: '"{水泳|すいえい}" nghĩa là:', options: ['bơi lội', 'bóng đá', 'thể thao', 'phim'], correct: 0, why: '水 THỦY + 泳 VỊNH.' },
        { q: 'Ngày 1 tháng 1 đọc là:', options: ['いちがつ いちにち', 'いちがつ ついたち', 'いちがつ ひとつ', 'いっがつ ついたち'], correct: 1, why: 'Ngày 1 = ついたち.' },
        { q: 'Tháng 9 đọc là:', options: ['きゅうがつ', 'くがつ', 'くうがつ', 'ここのがつ'], correct: 1, why: '9月 = くがつ.' },
        { q: '"Thế à!" (đã nghe hiểu) là:', options: ['そうですか。', 'はい。', 'どちらですか。', 'いつですか。'], correct: 0, why: 'そうですか (xuống giọng).' },
        { q: 'Từ nào là tên nước?', options: ['テニス', 'スポーツ', 'ロシア', 'サッカー'], correct: 2, why: 'ロシア = Nga.' },
        { q: '"{高校|こうこう}" là:', options: ['trường đại học', 'trường THPT (cấp 3)', 'trường tiếng Nhật', 'công ty'], correct: 1, why: '高 CAO + 校 HIỆU = trường cấp 3.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b1-bt-doc-so',
      title: 'Viết cách đọc bằng hiragana (ngày tháng, tuổi)',
      kind: 'fill',
      items: [
        { q: '4月1日', answers: ans('しがつ ついたち'), hint: 'tháng 4 + ngày 1' },
        { q: '7月20日', answers: ans('しちがつ はつか'), hint: 'tháng 7 + ngày 20' },
        { q: '9月9日', answers: ans('くがつ ここのか'), hint: 'tháng 9 + ngày 9' },
        { q: '10月14日', answers: ans('じゅうがつ じゅうよっか'), hint: 'tháng 10 + ngày 14' },
        { q: '1月24日', answers: ans('いちがつ にじゅうよっか'), hint: 'tháng 1 + ngày 24' },
        { q: '6月6日', answers: ans('ろくがつ むいか'), hint: 'tháng 6 + ngày 6' },
        { q: '8月8日', answers: ans('はちがつ ようか'), hint: 'tháng 8 + ngày 8' },
        { q: '20歳', answers: ans('はたち', 'にじゅっさい', 'にじっさい'), hint: '20 tuổi' },
        { q: '18歳', answers: ans('じゅうはっさい'), hint: '18 tuổi' },
        { q: '31歳', answers: ans('さんじゅういっさい'), hint: '31 tuổi' },
      ],
    },
    {
      t: 'quiz',
      id: 'b1-bt-dat-cau-hoi',
      title: 'Đặt câu hỏi cho câu trả lời (hỏi chỗ nào — đáp chỗ đó)',
      kind: 'fill',
      items: [
        { q: 'A: ___ — B: ブラジルです。', answers: ans('お{国|くに}はどちらですか。', 'お{国|くに}は？'), hint: 'hỏi nước' },
        { q: 'A: ___ — B: {12月|じゅうにがつ}{3日|みっか}です。', answers: ans('{誕生日|たんじょうび}はいつですか。', 'お{誕生日|たんじょうび}はいつですか。'), hint: 'hỏi sinh nhật' },
        { q: 'A: ___ — B: {料理|りょうり}です。', answers: ans('{趣味|しゅみ}は{何|なん}ですか。', 'ご{趣味|しゅみ}は{何|なん}ですか。', '{趣味|しゅみ}は？'), hint: 'hỏi sở thích' },
        { q: 'A: ___ — B: {会社員|かいしゃいん}です。', answers: ans('お{仕事|しごと}は？', 'お{仕事|しごと}は{何|なん}ですか。'), hint: 'hỏi công việc' },
        { q: 'A: ___ — B: {19歳|じゅうきゅうさい}です。', answers: ans('{何歳|なんさい}ですか。', 'おいくつですか。'), hint: 'hỏi tuổi' },
        { q: 'A: ___ — B: ナタポンです。', answers: ans('お{名前|なまえ}は？', 'お{名前|なまえ}は{何|なん}ですか。'), hint: 'hỏi tên' },
      ],
    },
    {
      t: 'build',
      id: 'b1-bt-ghep',
      title: 'Ghép câu — hỏi và đáp',
      items: [
        { vi: 'Sinh nhật của bạn Wan là ngày 20 tháng 1.', chips: ['ワンさんの', '{誕生日|たんじょうび}は', '{1月|いちがつ}', '{20日|はつか}です。', '{2日|ふつか}です。'], answer: ['ワンさんの', '{誕生日|たんじょうび}は', '{1月|いちがつ}', '{20日|はつか}です。'], ro: 'Wan-san no tanjōbi wa ichigatsu hatsuka desu.' },
        { vi: 'Không, tôi không phải người Nhật. Tôi là người Hàn.', chips: ['いいえ、', '{日本人|にほんじん}', 'じゃありません。', '{韓国人|かんこくじん}です。', 'はい、'], answer: ['いいえ、', '{日本人|にほんじん}', 'じゃありません。', '{韓国人|かんこくじん}です。'], ro: 'Iie, Nihonjin ja arimasen. Kankokujin desu.' },
        { vi: 'Anna cũng là sinh viên à?', chips: ['アンナさん', 'も', '{学生|がくせい}', 'ですか。', 'は'], answer: ['アンナさん', 'も', '{学生|がくせい}', 'ですか。'], ro: 'Anna-san mo gakusei desu ka.' },
        { vi: 'Sở thích của Marco là bóng đá và tennis.', chips: ['マルコさんの', '{趣味|しゅみ}は', 'サッカーと', 'テニスです。', 'も'], answer: ['マルコさんの', '{趣味|しゅみ}は', 'サッカーと', 'テニスです。'], ro: 'Maruko-san no shumi wa sakkā to tenisu desu.' },
        { vi: 'Tôi là Park. Tôi là học sinh trường tiếng Nhật Aozora.', chips: ['パクです。', 'あおぞら', '{日本語学校|にほんごがっこう}の', '{学生|がくせい}です。'], answer: ['パクです。', 'あおぞら', '{日本語学校|にほんごがっこう}の', '{学生|がくせい}です。'], ro: 'Paku desu. Aozora nihongo gakkō no gakusei desu.' },
        { vi: 'Anh Daniel, anh đến từ nước nào?', chips: ['ダニエルさん、', 'お{国|くに}は', 'どちら', 'ですか。', 'いつ'], answer: ['ダニエルさん、', 'お{国|くに}は', 'どちら', 'ですか。'], ro: 'Danieru-san, o-kuni wa dochira desu ka.' },
        { vi: 'Rất vui được gặp. Tôi cũng mong được giúp đỡ.', chips: ['はじめまして。', 'こちらこそ、', 'よろしく', 'お{願|ねが}いします。'], answer: ['はじめまして。', 'こちらこそ、', 'よろしく', 'お{願|ねが}いします。'], ro: 'Hajimemashite. Kochira koso, yoroshiku onegaishimasu.' },
        { vi: 'Tôi 26 tuổi.', chips: ['{私|わたし}は', '{26歳|にじゅうろくさい}', 'です。', 'の'], answer: ['{私|わたし}は', '{26歳|にじゅうろくさい}', 'です。'], ro: 'Watashi wa nijūroku-sai desu.' },
      ],
    },
    {
      t: 'note',
      title: 'Tự kiểm tra trước khi sang Bài 2',
      items: [
        'Nói được bài 自己紹介 8 câu **không nhìn**, dưới 30 giây.',
        'Trả lời được 12 câu ở phần **Ghi âm** của bài Luyện nói, câu nào cũng đủ câu và kết bằng です.',
        'Đọc đúng mọi ngày 1–10, 14, 20, 24 và tháng 4, 7, 9.',
      ],
    },
  ],
};

export const BAI_1: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
