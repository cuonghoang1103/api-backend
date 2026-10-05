/**
 * KHOÁ JP · Bài 4 — Giờ giấc & ngày tháng: 〜時〜分, 半, 午前・午後, 曜日, ngày/tháng,
 * から・まで, hỏi 何時・何曜日・何月何日 (05/10/2026).
 *
 * Soạn theo ../SOAN-BAI.md. Tự viết 100% (hội thoại, ví dụ, bài nghe, bài đọc).
 * Nối tiếp Bài 3 (số đếm tới hàng vạn, ～かい, いくら): giờ, phút, tháng, ngày đều là
 * SỐ + hậu tố, nên bài tập trung vào các số BIẾN ÂM (よじ, くじ, じゅっぷん, ついたち…).
 * Bài này CHƯA có động từ — mọi câu là N は ～ です; động từ ます bắt đầu ở Bài 5.
 *
 * Chữ viết: chữ Hán N5 có furigana ({時|じ}, {午後|ごご}, {7月|しちがつ}); từ có chữ
 * ngoài N5 viết kana (げつようび — 曜 ngoài N5; じゅぎょう, しけん, あした, あさ).
 *
 * Nhân vật & giọng: ラン (Lan, nữ, vai a) · たなかさん (Tanaka, nam, vai b) ·
 * すずきさん (Suzuki, cửa hàng trưởng konbini, nam, vai b) · マイクさん (Mike, nam, vai b) ·
 * やまだ先生 (nữ, vai c) · キムさん (nữ, chỉ trong bài nghe/đọc).
 */
import type { Lesson } from '@/components/sach-hoc/types';

/* ── Đáp án gõ tay ─────────────────────────────────────────────────────────
 * Bộ chấm bỏ dấu câu/khoảng trắng và đổi chữ/số toàn khổ về nửa khổ, nhưng
 * KHÔNG tự đổi chữ Hán ↔ kana. ans() nhận mẫu có furigana {漢字|かな} và sinh
 * mọi tổ hợp gõ Hán hoặc gõ kana cho từng cặp, cộng じゃ/では. Phần tử ĐẦU là
 * bản chữ Hán đầy đủ (trang hiện nó làm "Đáp án"). Giờ viết số Ả Rập thì
 * thêm tay một mẫu riêng (vd. '9じ').
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
  id: 'b4-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: いま なんじですか・なんじから なんじまでですか',
  goal: 'Hỏi và nói giờ, hỏi giờ học, giờ làm thêm, ngày nghỉ, ngày thi và ngày sinh nhật.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 4 — hôm nay học gì',
      items: [
        'Nói giờ: **{9時|くじ}** (9 giờ), **{9時半|くじはん}** (9 rưỡi), **{午後|ごご}{3時|さんじ}{10分|じゅっぷん}** (3 giờ 10 chiều). Hỏi: **{今|いま}{何時|なんじ}ですか**.',
        'Thứ trong tuần: **げつようび** (thứ Hai) … **にちようび** (Chủ nhật). Hỏi: **{今日|きょう}はなんようびですか**.',
        'Ngày tháng: **{7月|しちがつ}{15日|じゅうごにち}**, và 10 ngày đầu tháng đọc riêng: **ついたち, ふつか, みっか…**',
        'Từ… đến…: **じゅぎょうは{9時|くじ}から{12時|じゅうにじ}までです** (giờ học từ 9 đến 12 giờ).',
        'Bài này CHƯA có động từ — mọi câu vẫn là **N は ～ です** quen thuộc. Chỉ thêm giờ và ngày vào.',
      ],
    },
    { t: 'h', text: 'Học xong Bài 4 bạn nói được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Mẫu câu dùng'],
      rows: [
        ['1. Buổi sáng ở trường', 'Hỏi giờ, hỏi giờ học và giờ nghỉ trưa bắt đầu – kết thúc lúc mấy giờ.', '{今|いま}{何時|なんじ}ですか, ～から ～まで'],
        ['2. Lịch làm thêm ở konbini', 'Nói ngày làm, giờ làm, ngày nghỉ trong tuần.', 'なんようび, {午前|ごぜん}・{午後|ごご}, {休|やす}み'],
        ['3. Ngày thi và sinh nhật', 'Hỏi – nói ngày tháng, đọc đúng các ngày đặc biệt.', '{何月|なんがつ}{何日|なんにち}, ついたち・はつか…'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học: đọc **bối cảnh** → nghe cả đoạn → bấm từng câu, đọc to theo 3 lần → tắt furigana và romaji rồi đọc lại. Bài này có rất nhiều **con số** — mỗi lần gặp một giờ hay một ngày, **che romaji và tự đọc trước**, rồi mới nghe kiểm tra.',
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Buổi sáng ở trường: {今|いま}{何時|なんじ}ですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Sáng thứ Hai, Lan chạy vội tới trường và gặp Tanaka ở cổng. Đồng hồ của Lan để ở ký túc xá nên Lan phải hỏi giờ. Hai bạn nói về giờ học và giờ nghỉ trưa.',
    },
    {
      t: 'dialogue',
      title: 'Ở cổng trường',
      lines: [
        { who: 'ラン', role: 'a', text: 'たなかさん、おはようございます。', ro: 'Tanaka-san, ohayō gozaimasu.', vi: 'Chào buổi sáng, anh Tanaka.' },
        { who: 'たなか', role: 'b', text: 'おはようございます。', ro: 'Ohayō gozaimasu.', vi: 'Chào buổi sáng.' },
        { who: 'ラン', role: 'a', text: 'すみません、{今|いま}{何時|なんじ}ですか。', ro: 'Sumimasen, ima nanji desu ka.', vi: 'Cho mình hỏi, bây giờ là mấy giờ?' },
        { who: 'たなか', role: 'b', text: '{8時|はちじ}{50分|ごじゅっぷん}です。', ro: 'Hachiji gojuppun desu.', vi: '8 giờ 50.' },
        { who: 'ラン', role: 'a', text: 'えっ、じゅぎょうは{9時|くじ}からですね。', ro: 'E!? Jugyō wa kuji kara desu ne.', vi: 'Hả, giờ học bắt đầu từ 9 giờ nhỉ.' },
        { who: 'たなか', role: 'b', text: 'ええ、{9時|くじ}から{12時|じゅうにじ}までです。', ro: 'Ē, kuji kara jūniji made desu.', vi: 'Ừ, từ 9 giờ đến 12 giờ.' },
        { who: 'ラン', role: 'a', text: 'ひる{休|やす}みは{何時|なんじ}からですか。', ro: 'Hiruyasumi wa nanji kara desu ka.', vi: 'Nghỉ trưa từ mấy giờ?' },
        { who: 'たなか', role: 'b', text: '{12時|じゅうにじ}から{1時|いちじ}までです。{午後|ごご}のじゅぎょうは{1時|いちじ}からです。', ro: 'Jūniji kara ichiji made desu. Gogo no jugyō wa ichiji kara desu.', vi: 'Từ 12 giờ đến 1 giờ. Tiết buổi chiều bắt đầu từ 1 giờ.' },
        { who: 'ラン', role: 'a', text: 'そうですか。ありがとうございます。', ro: 'Sō desu ka. Arigatō gozaimasu.', vi: 'Vậy à. Cảm ơn anh.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**{今|いま}{何時|なんじ}ですか** = "bây giờ là mấy giờ?" — câu hỏi giờ chuẩn. Hỏi người lạ thì mở đầu bằng **すみません**.',
        '**{8時|はちじ}{50分|ごじゅっぷん}** — 50 phút đọc **ごじゅっぷん** (ぷん, không phải ~~ごじゅうふん~~). Luật ふん／ぷん ở mục Ngữ pháp.',
        '**～から** = từ (mốc bắt đầu), **～まで** = đến (mốc kết thúc). Đứng sau giờ/ngày, giống trợ từ — không có chữ "từ" đứng trước như tiếng Việt.',
        '**ね** cuối câu = "nhỉ / phải không" — Lan nhắc lại điều mình gần như đã biết để xác nhận.',
        '**{午後|ごご}のじゅぎょう** = tiết buổi chiều: の nối hai danh từ (Bài 1–2).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{今|いま}{何時|なんじ}ですか。', ro: 'Ima nanji desu ka.', vi: 'Bây giờ là mấy giờ?' },
        { en: '{8時|はちじ}{50分|ごじゅっぷん}です。', ro: 'Hachiji gojuppun desu.', vi: '8 giờ 50 phút.' },
        { en: 'じゅぎょうは{9時|くじ}からです。', ro: 'Jugyō wa kuji kara desu.', vi: 'Giờ học bắt đầu từ 9 giờ.' },
        { en: '{9時|くじ}から{12時|じゅうにじ}までです。', ro: 'Kuji kara jūniji made desu.', vi: 'Từ 9 giờ đến 12 giờ.' },
        { en: 'ひる{休|やす}みは{何時|なんじ}からですか。', ro: 'Hiruyasumi wa nanji kara desu ka.', vi: 'Nghỉ trưa từ mấy giờ?' },
        { en: '{午後|ごご}のじゅぎょうは{1時|いちじ}からです。', ro: 'Gogo no jugyō wa ichiji kara desu.', vi: 'Tiết chiều bắt đầu từ 1 giờ.' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Lịch làm thêm ở konbini: なんようびですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Lan vừa được nhận làm thêm ở cửa hàng tiện lợi gần ký túc xá. Anh Suzuki là **てんちょう** (cửa hàng trưởng). Hôm nay anh xếp lịch làm cho Lan. Cửa hàng mở 24 giờ nên anh nói rõ **{午前|ごぜん}** (buổi sáng) hay **{午後|ごご}** (buổi chiều).',
    },
    {
      t: 'dialogue',
      title: 'Ở phòng nhân viên cửa hàng',
      lines: [
        { who: 'すずき', role: 'b', text: 'ランさん、アルバイトはげつようびとすいようびときんようびです。', ro: 'Ran-san, arubaito wa getsuyōbi to suiyōbi to kin\'yōbi desu.', vi: 'Lan này, ca làm thêm của em là thứ Hai, thứ Tư và thứ Sáu.' },
        { who: 'ラン', role: 'a', text: 'はい。{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Hai. Nanji kara nanji made desu ka.', vi: 'Vâng. Từ mấy giờ đến mấy giờ ạ?' },
        { who: 'すずき', role: 'b', text: '{午後|ごご}{5時|ごじ}から{10時|じゅうじ}までです。', ro: 'Gogo goji kara jūji made desu.', vi: 'Từ 5 giờ chiều đến 10 giờ tối.' },
        { who: 'ラン', role: 'a', text: 'どようびは？', ro: 'Doyōbi wa?', vi: 'Thế thứ Bảy ạ?' },
        { who: 'すずき', role: 'b', text: 'どようびは{午前|ごぜん}です。{7時|しちじ}から{11時半|じゅういちじはん}までです。', ro: 'Doyōbi wa gozen desu. Shichiji kara jūichiji han made desu.', vi: 'Thứ Bảy là ca sáng. Từ 7 giờ đến 11 rưỡi.' },
        { who: 'ラン', role: 'a', text: 'わかりました。じゃ、{休|やす}みはかようびともくようびとにちようびですね。', ro: 'Wakarimashita. Ja, yasumi wa kayōbi to mokuyōbi to nichiyōbi desu ne.', vi: 'Em hiểu rồi. Vậy ngày nghỉ là thứ Ba, thứ Năm và Chủ nhật nhỉ.' },
        { who: 'すずき', role: 'b', text: 'そうです。おねがいします。', ro: 'Sō desu. Onegaishimasu.', vi: 'Đúng vậy. Nhờ em nhé.' },
        { who: 'ラン', role: 'a', text: 'よろしくおねがいします。', ro: 'Yoroshiku onegaishimasu.', vi: 'Mong anh giúp đỡ ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**げつようび・かようび・すいようび・もくようび・きんようび・どようび・にちようび** — 7 ngày trong tuần, tên lấy từ 7 "hành tinh": Mặt Trăng, Hoả, Thuỷ, Mộc, Kim, Thổ, Mặt Trời.',
        '**N1 と N2 と N3** = N1, N2 và N3 — liệt kê đủ các ngày (と nối danh từ, đã gặp ở Bài 3).',
        '**{何時|なんじ}から{何時|なんじ}までですか** = "từ mấy giờ đến mấy giờ?" — câu hỏi rất hay dùng: giờ mở cửa, giờ học, giờ làm.',
        '**{午後|ごご}{5時|ごじ}** — 午前／午後 đứng **TRƯỚC** giờ (ngược tiếng Việt "5 giờ chiều").',
        '**わかりました** = "tôi hiểu rồi / vâng ạ" — câu đáp khi nhận chỉ thị ở chỗ làm. Lịch sự hơn はい.',
        'Khi gõ romaji, **きんようび** viết **kin\'yōbi** — dấu \' tách ん với よ (đọc kin-yō, không phải "ki-nyō").',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'アルバイトはげつようびです。', ro: 'Arubaito wa getsuyōbi desu.', vi: 'Ca làm thêm là thứ Hai.' },
        { en: '{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Nanji kara nanji made desu ka.', vi: 'Từ mấy giờ đến mấy giờ?' },
        { en: '{午後|ごご}{5時|ごじ}から{10時|じゅうじ}までです。', ro: 'Gogo goji kara jūji made desu.', vi: 'Từ 5 giờ chiều đến 10 giờ.' },
        { en: 'どようびは{午前|ごぜん}です。', ro: 'Doyōbi wa gozen desu.', vi: 'Thứ Bảy là buổi sáng.' },
        { en: '{休|やす}みはにちようびです。', ro: 'Yasumi wa nichiyōbi desu.', vi: 'Ngày nghỉ là Chủ nhật.' },
        { en: 'わかりました。', ro: 'Wakarimashita.', vi: 'Tôi hiểu rồi / Vâng ạ.' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Ngày thi và sinh nhật: {何月|なんがつ}{何日|なんにち}ですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Cuối giờ học, Lan và Mike hỏi cô Yamada về ngày thi giữa kỳ. Sau đó Mike nhắc tới sinh nhật của mình — hoá ra là **ngày mai**.',
    },
    {
      t: 'dialogue',
      title: 'Cuối giờ học',
      lines: [
        { who: 'ラン', role: 'a', text: '{先生|せんせい}、しけんは{何月|なんがつ}{何日|なんにち}ですか。', ro: 'Sensei, shiken wa nangatsu nannichi desu ka.', vi: 'Thưa cô, kỳ thi là ngày mấy tháng mấy ạ?' },
        { who: 'やまだ先生', role: 'c', text: '{7月|しちがつ}{15日|じゅうごにち}です。', ro: 'Shichigatsu jūgonichi desu.', vi: 'Ngày 15 tháng 7.' },
        { who: 'マイク', role: 'b', text: 'なんようびですか。', ro: 'Nan\'yōbi desu ka.', vi: 'Thứ mấy ạ?' },
        { who: 'やまだ先生', role: 'c', text: 'かようびです。{午前|ごぜん}{10時|じゅうじ}からです。', ro: 'Kayōbi desu. Gozen jūji kara desu.', vi: 'Thứ Ba. Bắt đầu từ 10 giờ sáng.' },
        { who: 'ラン', role: 'a', text: 'わかりました。…マイクさん、{今日|きょう}は{何日|なんにち}ですか。', ro: 'Wakarimashita. … Maiku-san, kyō wa nannichi desu ka.', vi: 'Em hiểu rồi ạ. … Mike ơi, hôm nay là ngày mấy?' },
        { who: 'マイク', role: 'b', text: '{6月|ろくがつ}{19日|じゅうくにち}です。あしたはわたしのたんじょうびです。', ro: 'Rokugatsu jūkunichi desu. Ashita wa watashi no tanjōbi desu.', vi: 'Ngày 19 tháng 6. Mai là sinh nhật mình đấy.' },
        { who: 'ラン', role: 'a', text: 'えっ、{6月|ろくがつ}はつかですか。おめでとうございます！', ro: 'E!? Rokugatsu hatsuka desu ka. Omedetō gozaimasu!', vi: 'Ơ, ngày 20 tháng 6 à? Chúc mừng sinh nhật!' },
        { who: 'やまだ先生', role: 'c', text: 'おめでとう、マイクさん。', ro: 'Omedetō, Maiku-san.', vi: 'Chúc mừng em, Mike.' },
        { who: 'マイク', role: 'b', text: 'ありがとうございます。', ro: 'Arigatō gozaimasu.', vi: 'Em cảm ơn ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**{何月|なんがつ}{何日|なんにち}ですか** = "tháng mấy ngày mấy?" — tiếng Nhật nói **tháng trước, ngày sau** (ngược tiếng Việt "ngày 15 tháng 7").',
        '**ngày 20 = はつか** — một trong những ngày đọc ĐẶC BIỆT (không phải ~~にじゅうにち~~). Bảng đầy đủ ở mục Ngữ pháp.',
        '**19日 = じゅうくにち** (く, không phải きゅう) và **7月 = しちがつ** (しち, không phải なな).',
        '**{今日|きょう}** (hôm nay), **あした** (ngày mai) — hai từ chỉ thời gian quan trọng nhất của bài.',
        '**おめでとうございます** = chúc mừng (sinh nhật, đỗ thi, năm mới…). Cô giáo nói với học trò thì bỏ ございます: **おめでとう**.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'しけんは{何月|なんがつ}{何日|なんにち}ですか。', ro: 'Shiken wa nangatsu nannichi desu ka.', vi: 'Kỳ thi là ngày mấy tháng mấy?' },
        { en: '{7月|しちがつ}{15日|じゅうごにち}です。', ro: 'Shichigatsu jūgonichi desu.', vi: 'Ngày 15 tháng 7.' },
        { en: '{今日|きょう}は{何日|なんにち}ですか。', ro: 'Kyō wa nannichi desu ka.', vi: 'Hôm nay là ngày mấy?' },
        { en: 'しけんはかようびです。', ro: 'Shiken wa kayōbi desu.', vi: 'Kỳ thi vào thứ Ba.' },
        { en: 'あしたはわたしのたんじょうびです。', ro: 'Ashita wa watashi no tanjōbi desu.', vi: 'Ngày mai là sinh nhật tôi.' },
        { en: 'おめでとうございます。', ro: 'Omedetō gozaimasu.', vi: 'Chúc mừng!' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp khi nói theo hội thoại',
      items: [
        'Nói giờ theo kiểu Việt ~~{5時|ごじ}{午後|ごご}~~ ("5 giờ chiều") → **{午後|ごご}{5時|ごじ}**: 午前／午後 luôn đứng trước.',
        'Nói ngày theo kiểu Việt ~~{15日|じゅうごにち}{7月|しちがつ}~~ → **{7月|しちがつ}{15日|じゅうごにち}**: tháng trước, ngày sau (như năm → tháng → ngày).',
        'Đọc 4 giờ là ~~よんじ~~ → **よじ**; 9 giờ là ~~きゅうじ~~ → **くじ**; 7 giờ nói **しちじ** (ななじ cũng nghe thấy nhưng しちじ chuẩn hơn).',
        'Thêm "từ" vào trước: ~~から{9時|くじ}~~ → **{9時|くじ}から**. から／まで luôn đứng **sau** mốc thời gian.',
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b4-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng: giờ, buổi trong ngày, thứ, ngày tháng, lịch sinh hoạt',
  goal: 'Nhớ 47 từ về giờ phút, các buổi trong ngày, hôm qua – hôm nay – ngày mai, thứ trong tuần, tháng/ngày và các nơi có giờ mở cửa.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      items: [
        '6 nhóm: **giờ & phút**, **buổi trong ngày**, **hôm qua – hôm nay – ngày mai**, **thứ trong tuần**, **tháng & ngày**, **lịch sinh hoạt & nơi chốn có giờ mở cửa**.',
        'Mọi từ chỉ giờ/ngày đều là **số + hậu tố**: ～{時|じ} (giờ), ～{分|ふん} (phút), ～{月|がつ} (tháng), ～{日|にち} (ngày) — số thì đã học ở Bài 1 và Bài 3.',
        'Từ để hỏi đi theo một khuôn: **{何|なん} + hậu tố** → {何時|なんじ}, {何分|なんぷん}, なんようび, {何月|なんがつ}, {何日|なんにち}.',
        'Từ có chữ Hán ngoài N5 viết kana: **げつようび** (月曜日), **しけん** (試験), **あした** (明日).',
      ],
    },

    { t: 'h', text: '1. Giờ & phút' },
    {
      t: 'vocab',
      items: [
        { w: '{今|いま}', pos: 'danh từ (thời gian)', ipa: 'ima', vi: 'bây giờ', ex: '{今|いま}{何時|なんじ}ですか。', exRo: 'Ima nanji desu ka.', exVi: 'Bây giờ là mấy giờ?', more: '今 Hán Việt **KIM** (như "kim thời" = thời nay). Chữ này học viết ở Bài 5.' },
        { w: '～{時|じ}', pos: 'hậu tố (giờ)', ipa: '-ji', vi: '… giờ', ex: '{今|いま}{3時|さんじ}です。', exRo: 'Ima sanji desu.', exVi: 'Bây giờ là 3 giờ.', more: '時 Hán Việt **THỜI**. Biến âm: **よじ** (4), **しちじ** (7), **くじ** (9).' },
        { w: '～{分|ふん}／～{分|ぷん}', pos: 'hậu tố (phút)', ipa: '-fun / -pun', vi: '… phút', ex: '{今|いま}{2時|にじ}{5分|ごふん}です。', exRo: 'Ima niji gofun desu.', exVi: 'Bây giờ là 2 giờ 5 phút.', more: '分 Hán Việt **PHÂN**. Đọc **ぷん** sau 1, 3, 4, 6, 8, 10 (いっぷん, さんぷん, よんぷん, ろっぷん, はっぷん, じゅっぷん); còn lại **ふん**.' },
        { w: '{半|はん}', pos: 'danh từ', ipa: 'han', vi: 'rưỡi, một nửa (30 phút)', ex: '{今|いま}{4時半|よじはん}です。', exRo: 'Ima yoji han desu.', exVi: 'Bây giờ là 4 rưỡi.', more: '半 Hán Việt **BÁN** (như "bán cầu" = nửa cầu). {4時半|よじはん} = {4時|よじ}{30分|さんじゅっぷん}.' },
        { w: '{何時|なんじ}', pos: 'từ để hỏi', ipa: 'nanji', vi: 'mấy giờ', ex: 'じゅぎょうは{何時|なんじ}からですか。', exRo: 'Jugyō wa nanji kara desu ka.', exVi: 'Giờ học bắt đầu từ mấy giờ?', more: 'Đọc **なんじ**, không phải ~~なにじ~~.' },
        { w: '{何分|なんぷん}', pos: 'từ để hỏi', ipa: 'nanpun', vi: 'mấy phút', ex: '{今|いま}{何時|なんじ}{何分|なんぷん}ですか。', exRo: 'Ima nanji nanpun desu ka.', exVi: 'Bây giờ là mấy giờ mấy phút?', more: 'Đọc **なんぷん** (ぷん vì đứng sau ん).' },
        { w: '{午前|ごぜん}', pos: 'danh từ', ipa: 'gozen', vi: 'buổi sáng, trước 12 giờ trưa (AM)', ex: 'ぎんこうは{午前|ごぜん}{9時|くじ}からです。', exRo: 'Ginkō wa gozen kuji kara desu.', exVi: 'Ngân hàng mở từ 9 giờ sáng.', more: '午 (NGỌ = giữa trưa) + 前 (TIỀN = trước) → trước giờ Ngọ. Đứng **trước** giờ.' },
        { w: '{午後|ごご}', pos: 'danh từ', ipa: 'gogo', vi: 'buổi chiều, sau 12 giờ trưa (PM)', ex: 'アルバイトは{午後|ごご}{5時|ごじ}からです。', exRo: 'Arubaito wa gogo goji kara desu.', exVi: 'Ca làm thêm bắt đầu từ 5 giờ chiều.', more: '午 (NGỌ) + 後 (HẬU = sau) → sau giờ Ngọ. Dùng cho cả buổi tối: {午後|ごご}{10時|じゅうじ} = 10 giờ đêm.' },
        { w: '～ごろ', pos: 'hậu tố', ipa: '-goro', vi: 'khoảng (mốc giờ, ngày)', ex: 'たなかさんのうちは{10時|じゅうじ}ごろです。', exRo: 'Tanaka-san no uchi wa jūji goro desu.', exVi: '(Hẹn) ở nhà Tanaka khoảng 10 giờ.', more: 'Chỉ dùng cho **mốc thời gian**: {3時|さんじ}ごろ (khoảng 3 giờ). Bài 5 dùng nhiều với động từ.' },
      ],
    },

    { t: 'h', text: '2. Các buổi trong ngày' },
    {
      t: 'vocab',
      items: [
        { w: 'あさ', pos: 'danh từ (thời gian)', ipa: 'asa', vi: 'buổi sáng', ex: 'じゅぎょうはあさ{9時|くじ}からです。', exRo: 'Jugyō wa asa kuji kara desu.', exVi: 'Giờ học từ 9 giờ sáng.', more: 'Chữ Hán 朝 (TRIỀU) — ngoài N5. **あさ** là "sáng" nói thường; **{午前|ごぜん}** là "AM" kiểu lịch, giờ tàu.' },
        { w: 'ひる', pos: 'danh từ (thời gian)', ipa: 'hiru', vi: 'buổi trưa, ban ngày', ex: 'ひるは{12時|じゅうにじ}から{1時|いちじ}までです。', exRo: 'Hiru wa jūniji kara ichiji made desu.', exVi: 'Giờ trưa từ 12 giờ đến 1 giờ.', more: 'Chữ Hán 昼 (TRÚ). Còn có nghĩa "bữa trưa": ひるごはん.' },
        { w: 'ばん', pos: 'danh từ (thời gian)', ipa: 'ban', vi: 'buổi tối', ex: 'アルバイトはばん{10時|じゅうじ}までです。', exRo: 'Arubaito wa ban jūji made desu.', exVi: 'Ca làm thêm đến 10 giờ tối.', more: 'Chữ Hán 晩 (VÃN). **こんばんは** (chào buổi tối) = こん (今) + ばん (tối) + は.' },
        { w: 'よる', pos: 'danh từ (thời gian)', ipa: 'yoru', vi: 'ban đêm, buổi tối muộn', ex: 'コンビニのアルバイトはよる{11時|じゅういちじ}までです。', exRo: 'Konbini no arubaito wa yoru jūichiji made desu.', exVi: 'Ca làm thêm ở konbini đến 11 giờ đêm.', more: 'Chữ Hán 夜 (DẠ). ばん ≈ よる; よる thiên về "đêm" (lúc ngủ).' },
        { w: 'ひる{休|やす}み', pos: 'danh từ', ipa: 'hiruyasumi', vi: 'giờ nghỉ trưa', ex: 'ひる{休|やす}みは{何時|なんじ}までですか。', exRo: 'Hiruyasumi wa nanji made desu ka.', exVi: 'Nghỉ trưa đến mấy giờ?', more: 'ひる (trưa) + {休|やす}み (nghỉ). Ở Nhật nghỉ trưa thường chỉ **1 tiếng**, không ngủ trưa.' },
      ],
    },

    { t: 'h', text: '3. Hôm qua – hôm nay – ngày mai' },
    {
      t: 'vocab',
      items: [
        { w: 'きのう', pos: 'danh từ (thời gian)', ipa: 'kinō', vi: 'hôm qua', ex: 'これはきのうの{新聞|しんぶん}です。', exRo: 'Kore wa kinō no shinbun desu.', exVi: 'Đây là tờ báo hôm qua.', more: 'Chữ Hán 昨日 (TẠC NHẬT) — 昨 ngoài N5. Nói về hôm qua cần **quá khứ** (でした) — Bài 5 học.' },
        { w: '{今日|きょう}', pos: 'danh từ (thời gian)', ipa: 'kyō', vi: 'hôm nay', ex: '{今日|きょう}はかようびです。', exRo: 'Kyō wa kayōbi desu.', exVi: 'Hôm nay là thứ Ba.', more: '今日 đọc đặc biệt **きょう** (không phải ~~こんにち~~ trong nghĩa "hôm nay"). Trường âm: **kyō** — 2 nhịp.' },
        { w: 'あした', pos: 'danh từ (thời gian)', ipa: 'ashita', vi: 'ngày mai', ex: 'あしたはしけんです。', exRo: 'Ashita wa shiken desu.', exVi: 'Ngày mai là ngày thi.', more: 'Chữ Hán 明日 (MINH NHẬT) — 明 ngoài N5. Âm i trong **ashita** gần như câm: "ash-ta".' },
        { w: 'あさって', pos: 'danh từ (thời gian)', ipa: 'asatte', vi: 'ngày kia (sau ngày mai)', ex: 'あさってはどようびです。', exRo: 'Asatte wa doyōbi desu.', exVi: 'Ngày kia là thứ Bảy.', more: 'Có âm ngắt っ: a-sa-**t**-te. Đừng nhầm với **あさ** (buổi sáng).' },
        { w: '{毎日|まいにち}', pos: 'danh từ / phó từ', ipa: 'mainichi', vi: 'mỗi ngày, hằng ngày', ex: 'じゅぎょうは{毎日|まいにち}{9時|くじ}からです。', exRo: 'Jugyō wa mainichi kuji kara desu.', exVi: 'Ngày nào giờ học cũng từ 9 giờ.', more: '毎 (MỖI) + 日 (NHẬT). Chữ 毎 học viết ở Bài 5.' },
      ],
    },

    { t: 'h', text: '4. Thứ trong tuần' },
    {
      t: 'vocab',
      items: [
        { w: 'げつようび', pos: 'danh từ', ipa: 'getsuyōbi', vi: 'thứ Hai', ex: 'じゅぎょうはげつようびからです。', exRo: 'Jugyō wa getsuyōbi kara desu.', exVi: 'Lớp học bắt đầu từ thứ Hai.', more: 'Chữ Hán 月曜日 — 月 (NGUYỆT, Mặt Trăng). Lịch Nhật ghi tắt: **（月）**.' },
        { w: 'かようび', pos: 'danh từ', ipa: 'kayōbi', vi: 'thứ Ba', ex: 'しけんはかようびです。', exRo: 'Shiken wa kayōbi desu.', exVi: 'Kỳ thi vào thứ Ba.', more: '火曜日 — 火 (HOẢ, lửa). Ghi tắt **（火）**.' },
        { w: 'すいようび', pos: 'danh từ', ipa: 'suiyōbi', vi: 'thứ Tư', ex: 'アルバイトはすいようびです。', exRo: 'Arubaito wa suiyōbi desu.', exVi: 'Làm thêm vào thứ Tư.', more: '水曜日 — 水 (THUỶ, nước). Ghi tắt **（水）**.' },
        { w: 'もくようび', pos: 'danh từ', ipa: 'mokuyōbi', vi: 'thứ Năm', ex: 'もくようびは{休|やす}みです。', exRo: 'Mokuyōbi wa yasumi desu.', exVi: 'Thứ Năm là ngày nghỉ.', more: '木曜日 — 木 (MỘC, cây). Ghi tắt **（木）**.' },
        { w: 'きんようび', pos: 'danh từ', ipa: 'kin\'yōbi', vi: 'thứ Sáu', ex: 'かいぎはきんようびの{午後|ごご}です。', exRo: 'Kaigi wa kin\'yōbi no gogo desu.', exVi: 'Cuộc họp vào chiều thứ Sáu.', more: '金曜日 — 金 (KIM, vàng/kim loại). Ghi tắt **（金）**. Đọc ki-n-yō, đủ nhịp ん.' },
        { w: 'どようび', pos: 'danh từ', ipa: 'doyōbi', vi: 'thứ Bảy', ex: 'どようびの{午前|ごぜん}はアルバイトです。', exRo: 'Doyōbi no gozen wa arubaito desu.', exVi: 'Sáng thứ Bảy là ca làm thêm.', more: '土曜日 — 土 (THỔ, đất). Ghi tắt **（土）**.' },
        { w: 'にちようび', pos: 'danh từ', ipa: 'nichiyōbi', vi: 'Chủ nhật', ex: 'にちようびは{休|やす}みです。', exRo: 'Nichiyōbi wa yasumi desu.', exVi: 'Chủ nhật là ngày nghỉ.', more: '日曜日 — 日 (NHẬT, Mặt Trời). Ghi tắt **（日）**. Tuần ở lịch Nhật thường bắt đầu từ にちようび.' },
        { w: 'なんようび', pos: 'từ để hỏi', ipa: 'nan\'yōbi', vi: 'thứ mấy', ex: '{今日|きょう}はなんようびですか。', exRo: 'Kyō wa nan\'yōbi desu ka.', exVi: 'Hôm nay là thứ mấy?', more: 'Chữ Hán 何曜日. Đọc na-n-yō-bi (4 nhịp + bi).' },
        { w: 'しゅうまつ', pos: 'danh từ', ipa: 'shūmatsu', vi: 'cuối tuần', ex: 'しゅうまつはどようびとにちようびです。', exRo: 'Shūmatsu wa doyōbi to nichiyōbi desu.', exVi: 'Cuối tuần là thứ Bảy và Chủ nhật.', more: 'Chữ Hán 週末 (CHU MẠT). Trường âm ở しゅう: **shū**.' },
      ],
    },

    { t: 'h', text: '5. Tháng & ngày' },
    {
      t: 'vocab',
      items: [
        { w: '～{月|がつ}', pos: 'hậu tố (tháng)', ipa: '-gatsu', vi: 'tháng …', ex: '{今|いま}は{4月|しがつ}です。', exRo: 'Ima wa shigatsu desu.', exVi: 'Bây giờ là tháng 4.', more: '月 (NGUYỆT). Biến âm: **しがつ** (4), **しちがつ** (7), **くがつ** (9). Tên tháng = số + がつ, không có tên riêng như tiếng Anh.' },
        { w: '～{日|にち}', pos: 'hậu tố (ngày)', ipa: '-nichi', vi: 'ngày … (trong tháng)', ex: 'しけんは{15日|じゅうごにち}です。', exRo: 'Shiken wa jūgonichi desu.', exVi: 'Kỳ thi vào ngày 15.', more: 'Ngày 1–10, 14, 20, 24 đọc **riêng** (ついたち, ふつか…) — xem bảng ở mục Ngữ pháp.' },
        { w: '{何月|なんがつ}', pos: 'từ để hỏi', ipa: 'nangatsu', vi: 'tháng mấy', ex: 'たんじょうびは{何月|なんがつ}ですか。', exRo: 'Tanjōbi wa nangatsu desu ka.', exVi: 'Sinh nhật bạn tháng mấy?' },
        { w: '{何日|なんにち}', pos: 'từ để hỏi', ipa: 'nannichi', vi: 'ngày mấy', ex: '{今日|きょう}は{何日|なんにち}ですか。', exRo: 'Kyō wa nannichi desu ka.', exVi: 'Hôm nay ngày mấy?', more: 'Đọc **なんにち** (2 chữ ん liền: na-n-ni-chi).' },
        { w: 'ついたち', pos: 'danh từ', ipa: 'tsuitachi', vi: 'ngày mồng 1', ex: '{4月|しがつ}ついたちは{休|やす}みです。', exRo: 'Shigatsu tsuitachi wa yasumi desu.', exVi: 'Ngày 1 tháng 4 là ngày nghỉ.', more: 'Chữ Hán 1日 / 一日. **Không** đọc ~~いちにち~~ khi là ngày trong tháng (いちにち = "một ngày" — khoảng thời gian).' },
        { w: 'はつか', pos: 'danh từ', ipa: 'hatsuka', vi: 'ngày 20', ex: 'たんじょうびは{6月|ろくがつ}はつかです。', exRo: 'Tanjōbi wa rokugatsu hatsuka desu.', exVi: 'Sinh nhật là ngày 20 tháng 6.', more: 'Chữ Hán 20日 / 二十日. Không đọc ~~にじゅうにち~~.' },
        { w: 'たんじょうび', pos: 'danh từ', ipa: 'tanjōbi', vi: 'sinh nhật', ex: 'わたしのたんじょうびは{9月|くがつ}{3日|みっか}です。', exRo: 'Watashi no tanjōbi wa kugatsu mikka desu.', exVi: 'Sinh nhật tôi là ngày 3 tháng 9.', more: 'Chữ Hán 誕生日 (ĐẢN SINH NHẬT). Câu chúc: おたんじょうび、おめでとうございます。' },
        { w: '～から', pos: 'trợ từ', ipa: 'kara', vi: 'từ … (mốc bắt đầu)', ex: 'なつ{休|やす}みは{7月|しちがつ}{20日|はつか}からです。', exRo: 'Natsuyasumi wa shichigatsu hatsuka kara desu.', exVi: 'Kỳ nghỉ hè bắt đầu từ ngày 20 tháng 7.', more: 'Đứng **sau** mốc. Cùng chữ から trong "ベトナムから きました" (Bài 1) — đều là "từ".' },
        { w: '～まで', pos: 'trợ từ', ipa: 'made', vi: 'đến … (mốc kết thúc)', ex: 'ぎんこうは{3時|さんじ}までです。', exRo: 'Ginkō wa sanji made desu.', exVi: 'Ngân hàng mở đến 3 giờ.', more: '～から～まで = từ … đến …. Có thể dùng riêng từng cái.' },
      ],
    },

    { t: 'h', text: '6. Lịch sinh hoạt & nơi có giờ mở cửa' },
    {
      t: 'vocab',
      items: [
        { w: 'じゅぎょう', pos: 'danh từ', ipa: 'jugyō', vi: 'giờ học, tiết học, buổi học', ex: 'じゅぎょうは{12時|じゅうにじ}までです。', exRo: 'Jugyō wa jūniji made desu.', exVi: 'Giờ học kết thúc lúc 12 giờ.', more: 'Chữ Hán 授業 (THỤ NGHIỆP). Phân biệt **じゅ**ぎょう (ju — ngắn) với "じゅう" (10).' },
        { w: 'しけん', pos: 'danh từ', ipa: 'shiken', vi: 'kỳ thi, bài thi', ex: 'しけんは{何時|なんじ}からですか。', exRo: 'Shiken wa nanji kara desu ka.', exVi: 'Bài thi bắt đầu từ mấy giờ?', more: 'Chữ Hán 試験 (THÍ NGHIỆM). JLPT = {日本語|にほんご}のうりょくしけん.' },
        { w: 'かいぎ', pos: 'danh từ', ipa: 'kaigi', vi: 'cuộc họp', ex: 'かいぎは{午後|ごご}{2時|にじ}から{4時|よじ}までです。', exRo: 'Kaigi wa gogo niji kara yoji made desu.', exVi: 'Cuộc họp từ 2 giờ đến 4 giờ chiều.', more: 'Chữ Hán 会議 (HỘI NGHỊ).' },
        { w: '{休|やす}み', pos: 'danh từ', ipa: 'yasumi', vi: 'ngày nghỉ, kỳ nghỉ, giờ nghỉ', ex: 'ぎんこうの{休|やす}みはどようびとにちようびです。', exRo: 'Ginkō no yasumi wa doyōbi to nichiyōbi desu.', exVi: 'Ngân hàng nghỉ thứ Bảy và Chủ nhật.', more: '休 (HƯU = nghỉ, như "hưu trí"). Ghép: ひる{休|やす}み (nghỉ trưa), なつ{休|やす}み (nghỉ hè).' },
        { w: 'なつ{休|やす}み', pos: 'danh từ', ipa: 'natsuyasumi', vi: 'kỳ nghỉ hè', ex: 'なつ{休|やす}みは{8月|はちがつ}{31日|さんじゅういちにち}までです。', exRo: 'Natsuyasumi wa hachigatsu sanjūichinichi made desu.', exVi: 'Nghỉ hè đến ngày 31 tháng 8.', more: 'なつ (夏, mùa hè) + 休み.' },
        { w: 'ゆうびんきょく', pos: 'danh từ', ipa: 'yūbinkyoku', vi: 'bưu điện', ex: 'ゆうびんきょくは{午前|ごぜん}{9時|くじ}から{午後|ごご}{5時|ごじ}までです。', exRo: 'Yūbinkyoku wa gozen kuji kara gogo goji made desu.', exVi: 'Bưu điện mở từ 9 giờ sáng đến 5 giờ chiều.', more: 'Chữ Hán 郵便局 (BƯU TIỆN CỤC). Ký hiệu 〒 trên biển hiệu.' },
        { w: 'としょかん', pos: 'danh từ', ipa: 'toshokan', vi: 'thư viện', ex: 'としょかんは{何時|なんじ}までですか。', exRo: 'Toshokan wa nanji made desu ka.', exVi: 'Thư viện mở đến mấy giờ?', more: 'Chữ Hán 図書館 (ĐỒ THƯ QUÁN).' },
        { w: 'びょういん', pos: 'danh từ', ipa: 'byōin', vi: 'bệnh viện, phòng khám', ex: 'びょういんの{休|やす}みはにちようびです。', exRo: 'Byōin no yasumi wa nichiyōbi desu.', exVi: 'Bệnh viện nghỉ Chủ nhật.', more: 'Chữ Hán 病院 (BỆNH VIỆN). ⚠️ **びょういん** (bệnh viện, có ょ + う) ≠ **びよういん** (tiệm làm tóc, よ to).' },
        { w: 'ばんごう', pos: 'danh từ', ipa: 'bangō', vi: 'số (điện thoại, phòng…)', ex: '{電話|でんわ}ばんごうは{何|なん}ですか。', exRo: 'Denwa bangō wa nan desu ka.', exVi: 'Số điện thoại là bao nhiêu?', more: 'Chữ Hán 番号 (PHIÊN HIỆU). Hỏi số điện thoại dùng **なん**ですか, đọc từng chữ số; dấu gạch "-" đọc **の**.' },
        { w: 'そちら', pos: 'đại từ (lịch sự)', ipa: 'sochira', vi: 'bên đó, quý cơ sở (khi gọi điện)', ex: 'すみません、そちらは{何時|なんじ}までですか。', exRo: 'Sumimasen, sochira wa nanji made desu ka.', exVi: 'Xin lỗi, bên mình mở cửa đến mấy giờ ạ?', more: 'Bài 3 học そちら = "phía đó". Khi gọi điện, **そちら** = "phía bên anh/chị" (cửa hàng, ngân hàng…).' },
      ],
    },

    {
      t: 'note',
      title: 'Người Việt hay nhầm khi học từ Bài 4',
      items: [
        '**よじ** (4 giờ) nhưng **よんぷん** (4 phút) và **しがつ** (tháng 4) — cùng số 4, ba cách đọc. Học theo **cụm**, đừng học số rời.',
        '**くじ** (9 giờ), **くがつ** (tháng 9), **じゅうくにち** (ngày 19) — nhưng **きゅうふん** (9 phút).',
        '**{午後|ごご}** (chiều) ≠ **ごご** đọc nhầm thành ~~ごうご~~; **{午前|ごぜん}** ≠ ~~ごぜんい~~.',
        '**びょういん** (bệnh viện) ≠ **びよういん** (tiệm làm tóc): một chữ ょ nhỏ đổi cả nơi bạn tới!',
        '**あさ** (buổi sáng) ≠ **あさって** (ngày kia).',
      ],
    },
    {
      t: 'mcq',
      id: 'b4-tv-nghia',
      title: 'Kiểm tra nghĩa từ — Bài 4',
      items: [
        { q: '**{午後|ごご}** là gì?', options: ['buổi sáng (AM)', 'buổi chiều (PM)', 'nửa đêm', 'giờ nghỉ trưa'], correct: 1, why: '午後 = sau giờ Ngọ = buổi chiều/tối (PM). Buổi sáng (AM) = 午前.' },
        { q: '"Thứ Tư" là:', options: ['もくようび', 'かようび', 'すいようび', 'きんようび'], correct: 2, why: 'すいようび (水曜日) = thứ Tư. もく = thứ Năm, か = thứ Ba, きん = thứ Sáu.' },
        { q: '**あした** là gì?', options: ['hôm qua', 'hôm nay', 'ngày mai', 'ngày kia'], correct: 2, why: 'あした = ngày mai. Hôm qua = きのう, hôm nay = きょう, ngày kia = あさって.' },
        { q: '**{半|はん}** nghĩa là:', options: ['15 phút', 'rưỡi (30 phút)', 'khoảng', 'đúng giờ'], correct: 1, why: '半 = một nửa → 30 phút. 4時半 = 4 rưỡi.' },
        { q: '**ついたち** là ngày mấy?', options: ['ngày 1', 'ngày 2', 'ngày 10', 'ngày 20'], correct: 0, why: 'ついたち = mồng 1. Ngày 2 = ふつか, ngày 10 = とおか, ngày 20 = はつか.' },
        { q: '**しけん** là gì?', options: ['giờ học', 'cuộc họp', 'kỳ thi', 'kỳ nghỉ'], correct: 2, why: 'しけん (試験) = kỳ thi. Giờ học = じゅぎょう, cuộc họp = かいぎ, kỳ nghỉ = やすみ.' },
        { q: '"Bưu điện" là:', options: ['びょういん', 'ゆうびんきょく', 'としょかん', 'ぎんこう'], correct: 1, why: 'ゆうびんきょく = bưu điện. びょういん = bệnh viện, としょかん = thư viện, ぎんこう = ngân hàng.' },
        { q: '**～まで** nghĩa là:', options: ['từ …', 'đến …', 'khoảng …', 'mỗi …'], correct: 1, why: 'まで = đến (mốc kết thúc). から = từ, ごろ = khoảng, まい～ = mỗi.' },
        { q: '**しゅうまつ** là:', options: ['cuối tuần', 'cuối tháng', 'thứ Bảy', 'ngày nghỉ lễ'], correct: 0, why: 'しゅうまつ (週末) = cuối tuần.' },
        { q: '"Sinh nhật" là:', options: ['たんじょうび', 'にちようび', 'なつやすみ', 'おめでとう'], correct: 0, why: 'たんじょうび = sinh nhật. おめでとう = chúc mừng.' },
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b4-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp: ～時～分, 半, 午前・午後, 曜日, ～月～日, から・まで',
  goal: 'Nói và hỏi giờ chính xác tới phút, buổi sáng/chiều, thứ, ngày tháng, và nói một việc kéo dài từ lúc nào đến lúc nào.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      items: [
        '**6 điểm**: ① {今|いま} ～{時|じ}～{分|ふん}です ② {午前|ごぜん}・{午後|ごご}, あさ・ばん ③ ～ようび ④ ～{月|がつ}～{日|にち} ⑤ N は ～から ～まで です ⑥ bộ từ để hỏi {何|なん}＋hậu tố.',
        'Mọi câu vẫn là **N は X です** của Bài 1 — X bây giờ là giờ, thứ, ngày.',
        'Thứ tự thời gian **từ lớn tới nhỏ**: tháng → ngày → thứ → buổi → giờ → phút. Ngược tiếng Việt!',
        'Ba bảng phải thuộc: **giờ** (よじ・しちじ・くじ), **phút** (ふん／ぷん), **ngày** (ついたち… とおか, はつか).',
      ],
    },

    /* ── Điểm 1 ── */
    { t: 'h', text: '① {今|いま} ～{時|じ}～{分|ふん}です — Bây giờ là … giờ … phút' },
    {
      t: 'p',
      text: 'Nói giờ = **số + {時|じ}** (giờ) + **số + {分|ふん}／{分|ぷん}** (phút). Hỏi giờ thay số bằng **{何|なん}**: **{何時|なんじ}**, **{何分|なんぷん}**. Câu đầy đủ: **{今|いま}は{何時|なんじ}ですか** — nhưng người Nhật gần như luôn **bỏ は** sau {今|いま}: **{今|いま}{何時|なんじ}ですか**. 30 phút có cách nói ngắn: **{半|はん}** (rưỡi).',
    },
    {
      t: 'table',
      caption: 'Giờ: số + 時 — ba ô in đậm đọc KHÁC số đếm thường',
      head: ['Giờ', 'Đọc', 'Romaji', 'Ghi chú'],
      rows: [
        ['1時', 'いちじ', 'ichiji', ''],
        ['2時', 'にじ', 'niji', ''],
        ['3時', 'さんじ', 'sanji', ''],
        ['4時', '**よじ**', 'yoji', 'không phải ~~よんじ~~, ~~しじ~~'],
        ['5時', 'ごじ', 'goji', ''],
        ['6時', 'ろくじ', 'rokuji', ''],
        ['7時', '**しちじ**', 'shichiji', '(ななじ cũng nghe thấy, nhưng しちじ chuẩn)'],
        ['8時', 'はちじ', 'hachiji', ''],
        ['9時', '**くじ**', 'kuji', 'không phải ~~きゅうじ~~'],
        ['10時', 'じゅうじ', 'jūji', ''],
        ['11時', 'じゅういちじ', 'jūichiji', ''],
        ['12時', 'じゅうにじ', 'jūniji', ''],
        ['?', '{何時|なんじ}', 'nanji', 'mấy giờ'],
      ],
    },
    {
      t: 'table',
      caption: 'Phút: số + 分 — ふん hay ぷん? (ô in đậm = ぷん)',
      head: ['Phút', 'Đọc', 'Romaji', 'Phút', 'Đọc', 'Romaji'],
      rows: [
        ['1分', '**いっぷん**', 'ippun', '6分', '**ろっぷん**', 'roppun'],
        ['2分', 'にふん', 'nifun', '7分', 'ななふん', 'nanafun'],
        ['3分', '**さんぷん**', 'sanpun', '8分', '**はっぷん** (はちふん)', 'happun'],
        ['4分', '**よんぷん**', 'yonpun', '9分', 'きゅうふん', 'kyūfun'],
        ['5分', 'ごふん', 'gofun', '10分', '**じゅっぷん** (じっぷん)', 'juppun'],
        ['15分', 'じゅうごふん', 'jūgofun', '20分', '**にじゅっぷん**', 'nijuppun'],
        ['30分', '**さんじゅっぷん** ＝ {半|はん}', 'sanjuppun = han', '45分', 'よんじゅうごふん', 'yonjūgofun'],
        ['?', '**{何分|なんぷん}**', 'nanpun', '', '', ''],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ ふん／ぷん',
      items: [
        'Số tận cùng **1, 6, 8, 10** → nuốt âm thành **っぷん**: いっぷん, ろっぷん, はっぷん, じゅっぷん (và 20, 30, 40, 50 = にじゅっぷん, さんじゅっぷん…).',
        'Số tận cùng **3, 4** và **{何|なん}** → **ぷん** (không có っ): さんぷん, よんぷん, なんぷん.',
        'Số tận cùng **2, 5, 7, 9** → giữ **ふん**: にふん, ごふん, ななふん, きゅうふん.',
        'Không chắc? Nói **ふん** vẫn được hiểu — nhưng bài nghe JLPT đọc chuẩn, nên phải nhận ra **ぷん**.',
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '{今|いま} ～{時|じ}（～{分|ふん}）です',
          vi: 'Bây giờ là … giờ (… phút)',
          examples: [
            { en: '{今|いま}{4時|よじ}です。', ro: 'Ima yoji desu.', vi: 'Bây giờ là 4 giờ.' },
            { en: '{今|いま}{9時|くじ}{15分|じゅうごふん}です。', ro: 'Ima kuji jūgofun desu.', vi: 'Bây giờ là 9 giờ 15.' },
            { en: '{今|いま}{7時|しちじ}{半|はん}です。', ro: 'Ima shichiji han desu.', vi: 'Bây giờ là 7 rưỡi.' },
            { en: '{今|いま}{11時|じゅういちじ}{40分|よんじゅっぷん}です。', ro: 'Ima jūichiji yonjuppun desu.', vi: 'Bây giờ là 11 giờ 40.' },
            { en: '{今|いま}{1時|いちじ}{6分|ろっぷん}です。', ro: 'Ima ichiji roppun desu.', vi: 'Bây giờ là 1 giờ 6 phút.' },
          ],
        },
        {
          formula: '{今|いま} {何時|なんじ}（{何分|なんぷん}）ですか',
          vi: 'Bây giờ là mấy giờ (mấy phút)?',
          examples: [
            { en: 'すみません、{今|いま}{何時|なんじ}ですか。——{3時|さんじ}{半|はん}です。', ro: 'Sumimasen, ima nanji desu ka. — Sanji han desu.', vi: 'Xin lỗi, bây giờ là mấy giờ? — 3 rưỡi.' },
            { en: '{今|いま}{何時|なんじ}{何分|なんぷん}ですか。——{2時|にじ}{3分|さんぷん}です。', ro: 'Ima nanji nanpun desu ka. — Niji sanpun desu.', vi: 'Bây giờ là mấy giờ mấy phút? — 2 giờ 3 phút.' },
            { en: 'ハノイは{今|いま}{何時|なんじ}ですか。——{10時|じゅうじ}です。', ro: 'Hanoi wa ima nanji desu ka. — Jūji desu.', vi: 'Hà Nội bây giờ là mấy giờ? — 10 giờ.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: hỏi giờ ở Tokyo và Hà Nội',
      lines: [
        { who: 'ラン', role: 'a', text: 'たなかさん、{今|いま}{何時|なんじ}ですか。', ro: 'Tanaka-san, ima nanji desu ka.', vi: 'Anh Tanaka, bây giờ mấy giờ rồi?' },
        { who: 'たなか', role: 'b', text: '{12時|じゅうにじ}{10分|じゅっぷん}です。', ro: 'Jūniji juppun desu.', vi: '12 giờ 10.' },
        { who: 'ラン', role: 'a', text: 'じゃ、ハノイは{10時|じゅうじ}{10分|じゅっぷん}です。', ro: 'Ja, Hanoi wa jūji juppun desu.', vi: 'Vậy Hà Nội là 10 giờ 10.' },
        { who: 'たなか', role: 'b', text: 'えっ、{2時間|にじかん}ちがいますか。', ro: 'E!? Ni-jikan chigaimasu ka.', vi: 'Hả, lệch nhau 2 tiếng à?' },
        { who: 'ラン', role: 'a', text: 'ええ、{日本|にほん}は{2時間|にじかん}はやいです。', ro: 'Ē, Nihon wa ni-jikan hayai desu.', vi: 'Ừ, Nhật Bản sớm hơn 2 tiếng.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        '**～{時間|じかん}** = **… tiếng** (khoảng thời gian), khác **～{時|じ}** = **… giờ** (mốc trên đồng hồ). {2時|にじ} = 2 giờ; {2時間|にじかん} = 2 tiếng. Bài 11 học kỹ cách đếm khoảng thời gian.',
        '**ちがいます** (khác, Bài 1) và **はやい** (sớm, tính từ — Bài 8) ở đây chỉ cần nghe hiểu.',
        'Giờ Nhật Bản (JST) **nhanh hơn Việt Nam 2 tiếng** quanh năm (Nhật không đổi giờ mùa hè).',
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: {今|いま} ＿＿ です。',
      head: ['Đồng hồ', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['4:00', '{今|いま}{4時|よじ}です。', 'Ima yoji desu.', '4 giờ.'],
        ['9:30', '{今|いま}{9時半|くじはん}です。', 'Ima kuji han desu.', '9 rưỡi.'],
        ['7:10', '{今|いま}{7時|しちじ}{10分|じゅっぷん}です。', 'Ima shichiji juppun desu.', '7 giờ 10.'],
        ['6:08', '{今|いま}{6時|ろくじ}{8分|はっぷん}です。', 'Ima rokuji happun desu.', '6 giờ 8 phút.'],
        ['10:45', '{今|いま}{10時|じゅうじ}{45分|よんじゅうごふん}です。', 'Ima jūji yonjūgofun desu.', '10 giờ 45.'],
      ],
    },
    { t: 'rule', formula: '{今|いま} [số]{時|じ} [số]{分|ふん／ぷん} です ／ {今|いま}{何時|なんじ}ですか', vi: 'Nói và hỏi giờ; 30 phút nói gọn là 半.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~{今|いま}よんじです~~ → **よじ**. ~~きゅうじ~~ → **くじ**.',
        '~~さんじゅうふん~~ → **さんじゅっぷん** hoặc **{半|はん}**. ~~じゅうふん~~ → **じゅっぷん**.',
        'Nói "kém" kiểu Việt (9 giờ kém 5)? Người Nhật nói **{8時|はちじ}{55分|ごじゅうごふん}**; cách nói "kém" là **{9時|くじ}{5分前|ごふんまえ}** (5 phút trước 9 giờ) — biết để nghe hiểu.',
        '{半|はん} đứng **sau** giờ: **{4時半|よじはん}**, không phải ~~{半|はん}{4時|よじ}~~.',
      ],
    },

    /* ── Điểm 2 ── */
    { t: 'h', text: '② {午前|ごぜん}・{午後|ごご}, あさ・ひる・ばん + giờ' },
    {
      t: 'p',
      text: 'Đồng hồ Nhật dùng hệ 12 giờ khi nói chuyện, nên cần nói rõ sáng hay chiều. **{午前|ごぜん}** (AM) và **{午後|ごご}** (PM) đứng **TRƯỚC** giờ, giống chữ AM/PM của tiếng Anh viết sau nhưng đọc trước: **{午後|ごご}{3時|さんじ}** = 3 giờ chiều. Trong nói chuyện thân mật dùng **あさ** (sáng), **ひる** (trưa), **ばん／よる** (tối) cũng đứng trước giờ. Ở nhà ga, sân bay, lịch tàu xe dùng hệ **24 giờ**: {15時|じゅうごじ} = 3 giờ chiều.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '{午前|ごぜん}／{午後|ごご} ＋ ～{時|じ}～{分|ふん}',
          vi: '… giờ sáng / … giờ chiều',
          examples: [
            { en: 'じゅぎょうは{午前|ごぜん}{9時|くじ}からです。', ro: 'Jugyō wa gozen kuji kara desu.', vi: 'Giờ học từ 9 giờ sáng.' },
            { en: 'しけんは{午後|ごご}{1時半|いちじはん}からです。', ro: 'Shiken wa gogo ichiji han kara desu.', vi: 'Bài thi bắt đầu lúc 1 rưỡi chiều.' },
            { en: 'アルバイトは{午後|ごご}{10時|じゅうじ}までです。', ro: 'Arubaito wa gogo jūji made desu.', vi: 'Ca làm thêm đến 10 giờ tối.' },
            { en: 'ぎんこうは{午後|ごご}{3時|さんじ}までです。', ro: 'Ginkō wa gogo sanji made desu.', vi: 'Ngân hàng mở đến 3 giờ chiều.' },
          ],
        },
        {
          formula: 'あさ／ひる／ばん ＋ ～{時|じ}',
          vi: '… giờ sáng / trưa / tối (cách nói thường ngày)',
          examples: [
            { en: 'あさ{7時|しちじ}です。', ro: 'Asa shichiji desu.', vi: '7 giờ sáng.' },
            { en: 'ひる{12時|じゅうにじ}です。', ro: 'Hiru jūniji desu.', vi: '12 giờ trưa.' },
            { en: 'ばん{8時|はちじ}です。', ro: 'Ban hachiji desu.', vi: '8 giờ tối.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Hệ 12 giờ ↔ hệ 24 giờ (lịch tàu, vé máy bay, giờ mở cửa)',
      head: ['Nói chuyện', 'Romaji', 'Hệ 24 giờ', 'Romaji'],
      rows: [
        ['{午前|ごぜん}{8時|はちじ}', 'gozen hachiji', '{8時|はちじ}', 'hachiji'],
        ['{午後|ごご}{1時|いちじ}', 'gogo ichiji', '{13時|じゅうさんじ}', 'jūsanji'],
        ['{午後|ごご}{6時半|ろくじはん}', 'gogo rokuji han', '{18時|じゅうはちじ}{30分|さんじゅっぷん}', 'jūhachiji sanjuppun'],
        ['{午後|ごご}{11時|じゅういちじ}', 'gogo jūichiji', '{23時|にじゅうさんじ}', 'nijūsanji'],
      ],
    },
    { t: 'rule', formula: '{午前|ごぜん}／{午後|ごご}／あさ／ばん ＋ [giờ]', vi: 'Sáng/chiều đứng TRƯỚC giờ — ngược tiếng Việt.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~{3時|さんじ}{午後|ごご}~~ → **{午後|ごご}{3時|さんじ}**.',
        'Dùng cả hai: ~~{午後|ごご}{15時|じゅうごじ}~~ → hoặc **{午後|ごご}{3時|さんじ}**, hoặc **{15時|じゅうごじ}** (hệ 24 giờ không cần 午後).',
        '12 giờ trưa nói **ひる{12時|じゅうにじ}** hoặc **{午後|ごご}{0時|れいじ}** hiếm dùng; người học chỉ cần **ひる{12時|じゅうにじ}**.',
      ],
    },

    /* ── Điểm 3 ── */
    { t: 'h', text: '③ ～ようび — Thứ trong tuần: {今日|きょう}はなんようびですか' },
    {
      t: 'p',
      text: 'Thứ = **chữ của một "hành tinh" + ようび**. Hỏi thứ: **なんようび**. Mẫu câu y như Bài 1: **{今日|きょう}は かようびです** (hôm nay là thứ Ba), **しけんは もくようびです** (kỳ thi vào thứ Năm). Tiếng Việt cần chữ "vào", tiếng Nhật thì không — chỉ cần **N は X です**.',
    },
    {
      t: 'table',
      caption: '7 ngày trong tuần — mẹo nhớ theo Ngũ hành',
      head: ['Thứ', 'Đọc', 'Romaji', 'Chữ Hán', 'Hán Việt', 'Mẹo nhớ'],
      rows: [
        ['Thứ Hai', 'げつようび', 'getsuyōbi', '月曜日', 'NGUYỆT', 'Mặt Trăng'],
        ['Thứ Ba', 'かようび', 'kayōbi', '火曜日', 'HOẢ', 'Lửa — sao Hoả'],
        ['Thứ Tư', 'すいようび', 'suiyōbi', '水曜日', 'THUỶ', 'Nước — sao Thuỷ'],
        ['Thứ Năm', 'もくようび', 'mokuyōbi', '木曜日', 'MỘC', 'Cây — sao Mộc'],
        ['Thứ Sáu', 'きんようび', 'kin\'yōbi', '金曜日', 'KIM', 'Kim loại — sao Kim'],
        ['Thứ Bảy', 'どようび', 'doyōbi', '土曜日', 'THỔ', 'Đất — sao Thổ'],
        ['Chủ nhật', 'にちようび', 'nichiyōbi', '日曜日', 'NHẬT', 'Mặt Trời'],
        ['Thứ mấy?', 'なんようび', 'nan\'yōbi', '何曜日', '', ''],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は ～ようび です',
          vi: 'N (là / vào) thứ …',
          examples: [
            { en: '{今日|きょう}はもくようびです。', ro: 'Kyō wa mokuyōbi desu.', vi: 'Hôm nay là thứ Năm.' },
            { en: 'あしたはきんようびです。', ro: 'Ashita wa kin\'yōbi desu.', vi: 'Ngày mai là thứ Sáu.' },
            { en: 'しけんはすいようびです。', ro: 'Shiken wa suiyōbi desu.', vi: 'Kỳ thi vào thứ Tư.' },
            { en: 'デパートの{休|やす}みはかようびです。', ro: 'Depāto no yasumi wa kayōbi desu.', vi: 'Trung tâm thương mại nghỉ thứ Ba.' },
            { en: 'アルバイトはどようびじゃありません。', ro: 'Arubaito wa doyōbi ja arimasen.', vi: 'Làm thêm không phải thứ Bảy.' },
          ],
        },
        {
          formula: 'N は なんようび ですか',
          vi: 'N là / vào thứ mấy?',
          examples: [
            { en: '{今日|きょう}はなんようびですか。——げつようびです。', ro: 'Kyō wa nan\'yōbi desu ka. — Getsuyōbi desu.', vi: 'Hôm nay thứ mấy? — Thứ Hai.' },
            { en: 'かいぎはなんようびですか。——きんようびです。', ro: 'Kaigi wa nan\'yōbi desu ka. — Kin\'yōbi desu.', vi: 'Cuộc họp vào thứ mấy? — Thứ Sáu.' },
            { en: 'しけんはかようびですか。——いいえ、かようびじゃありません。もくようびです。', ro: 'Shiken wa kayōbi desu ka. — Iie, kayōbi ja arimasen. Mokuyōbi desu.', vi: 'Thi vào thứ Ba à? — Không, không phải thứ Ba. Thứ Năm.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: N は ～ようびです。',
      head: ['N', 'Thứ', 'Câu', 'Romaji'],
      rows: [
        ['としょかんの{休|やす}み', 'thứ Hai', 'としょかんの{休|やす}みはげつようびです。', 'Toshokan no yasumi wa getsuyōbi desu.'],
        ['にほんごのしけん', 'thứ Sáu', '{日本語|にほんご}のしけんはきんようびです。', 'Nihongo no shiken wa kin\'yōbi desu.'],
        ['あさって', 'Chủ nhật', 'あさってはにちようびです。', 'Asatte wa nichiyōbi desu.'],
        ['かいぎ', 'thứ Tư', 'かいぎはすいようびです。', 'Kaigi wa suiyōbi desu.'],
      ],
    },
    {
      t: 'p',
      text: '**Ghép thứ với buổi và giờ**: dùng **の** — **きんようびの{午後|ごご}** (chiều thứ Sáu), **どようびのあさ** (sáng thứ Bảy). Thứ tự luôn là **thứ → buổi → giờ**: **かようびの{午前|ごぜん}{10時|じゅうじ}** (10 giờ sáng thứ Ba).',
    },
    { t: 'rule', formula: 'N は ～ようび です ／ なんようび ですか', vi: 'Nói / hỏi thứ; ghép buổi bằng の: ～ようびの{午後|ごご}.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Đếm thứ theo số kiểu Việt (thứ Hai = "ngày 2"): ~~にようび~~ — tiếng Nhật **không đánh số thứ**, phải thuộc tên.',
        'Nhầm **かようび** (thứ Ba, 火) với **きんようび** (thứ Sáu, 金) vì cùng âm "k" — nhớ: **Hoả** đốt trước, **Kim** về sau.',
        'Quên の: ~~きんようび{午後|ごご}~~ → **きんようびの{午後|ごご}**.',
      ],
    },

    /* ── Điểm 4 ── */
    { t: 'h', text: '④ ～{月|がつ}～{日|にち} — Ngày tháng: {何月|なんがつ}{何日|なんにち}ですか' },
    {
      t: 'p',
      text: 'Tháng = **số + {月|がつ}** (không có tên riêng như January…). Ngày = **số + {日|にち}** — nhưng **ngày 1 → 10, 14, 20, 24** có cách đọc riêng (âm Nhật cổ), phải thuộc lòng. Thứ tự: **năm → tháng → ngày → thứ**, từ lớn tới nhỏ — ngược tiếng Việt. Người Nhật viết ngày tháng kèm thứ trong ngoặc: **{7月|しちがつ}{15日|じゅうごにち}（{火|か}）** = thứ Ba, 15/7.',
    },
    {
      t: 'table',
      caption: '12 tháng — ba ô in đậm đọc khác số thường',
      head: ['Tháng', 'Đọc', 'Romaji', 'Tháng', 'Đọc', 'Romaji'],
      rows: [
        ['1月', 'いちがつ', 'ichigatsu', '7月', '**しちがつ**', 'shichigatsu'],
        ['2月', 'にがつ', 'nigatsu', '8月', 'はちがつ', 'hachigatsu'],
        ['3月', 'さんがつ', 'sangatsu', '9月', '**くがつ**', 'kugatsu'],
        ['4月', '**しがつ**', 'shigatsu', '10月', 'じゅうがつ', 'jūgatsu'],
        ['5月', 'ごがつ', 'gogatsu', '11月', 'じゅういちがつ', 'jūichigatsu'],
        ['6月', 'ろくがつ', 'rokugatsu', '12月', 'じゅうにがつ', 'jūnigatsu'],
        ['?', '{何月|なんがつ}', 'nangatsu', '', '', ''],
      ],
    },
    {
      t: 'table',
      caption: 'Ngày trong tháng — các ô in đậm là cách đọc RIÊNG, phải thuộc',
      head: ['Ngày', 'Đọc', 'Romaji', 'Ngày', 'Đọc', 'Romaji'],
      rows: [
        ['1日', '**ついたち**', 'tsuitachi', '11日', 'じゅういちにち', 'jūichinichi'],
        ['2日', '**ふつか**', 'futsuka', '12日', 'じゅうににち', 'jūninichi'],
        ['3日', '**みっか**', 'mikka', '13日', 'じゅうさんにち', 'jūsannichi'],
        ['4日', '**よっか**', 'yokka', '14日', '**じゅうよっか**', 'jūyokka'],
        ['5日', '**いつか**', 'itsuka', '15日', 'じゅうごにち', 'jūgonichi'],
        ['6日', '**むいか**', 'muika', '17日', 'じゅうしちにち', 'jūshichinichi'],
        ['7日', '**なのか**', 'nanoka', '19日', 'じゅうくにち', 'jūkunichi'],
        ['8日', '**ようか**', 'yōka', '20日', '**はつか**', 'hatsuka'],
        ['9日', '**ここのか**', 'kokonoka', '24日', '**にじゅうよっか**', 'nijūyokka'],
        ['10日', '**とおか**', 'tōka', '30日 / 31日', 'さんじゅうにち / さんじゅういちにち', 'sanjūnichi / sanjūichinichi'],
        ['?', '{何日|なんにち}', 'nannichi', '', '', ''],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo thuộc 10 ngày đầu tháng',
      items: [
        'Từ 2 đến 10 đều kết thúc bằng **か** (ka): ふつ**か**, みっ**か**, よっ**か**, いつ**か**, むい**か**, なの**か**, よう**か**, ここの**か**, とお**か**. Riêng ngày 1 là **ついたち** (từ "trăng mới mọc").',
        'Thuộc theo **cặp gấp đôi**: **みっか (3) ↔ むいか (6)** (cùng âm m) · **よっか (4) ↔ ようか (8)** (cùng âm y) · **いつか (5) ↔ とおか (10)**.',
        '**よっか (4)** có っ — **ようか (8)** có trường âm う. Nghe nhầm hai ngày này là lỗi số 1 trong bài nghe JLPT.',
        'Từ 11 trở đi đọc **số + にち**, trừ **14 (じゅうよっか), 20 (はつか), 24 (にじゅうよっか)**. Ngày 17, 19 dùng しち, く: じゅうしちにち, じゅうくにち.',
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は ～{月|がつ}～{日|にち} です',
          vi: 'N (là / vào) ngày … tháng …',
          examples: [
            { en: '{今日|きょう}は{5月|ごがつ}{3日|みっか}です。', ro: 'Kyō wa gogatsu mikka desu.', vi: 'Hôm nay là ngày 3 tháng 5.' },
            { en: 'しけんは{12月|じゅうにがつ}{8日|ようか}です。', ro: 'Shiken wa jūnigatsu yōka desu.', vi: 'Kỳ thi vào ngày 8 tháng 12.' },
            { en: 'わたしのたんじょうびは{9月|くがつ}{4日|よっか}です。', ro: 'Watashi no tanjōbi wa kugatsu yokka desu.', vi: 'Sinh nhật tôi là ngày 4 tháng 9.' },
            { en: 'なつ{休|やす}みは{7月|しちがつ}{20日|はつか}からです。', ro: 'Natsuyasumi wa shichigatsu hatsuka kara desu.', vi: 'Nghỉ hè từ ngày 20 tháng 7.' },
            { en: '{1月|いちがつ}{1日|ついたち}は{休|やす}みです。', ro: 'Ichigatsu tsuitachi wa yasumi desu.', vi: 'Ngày 1 tháng 1 là ngày nghỉ.' },
          ],
        },
        {
          formula: 'N は {何月|なんがつ}{何日|なんにち} ですか',
          vi: 'N là ngày mấy tháng mấy?',
          examples: [
            { en: 'たんじょうびは{何月|なんがつ}{何日|なんにち}ですか。——{3月|さんがつ}{10日|とおか}です。', ro: 'Tanjōbi wa nangatsu nannichi desu ka. — Sangatsu tōka desu.', vi: 'Sinh nhật bạn ngày mấy tháng mấy? — Ngày 10 tháng 3.' },
            { en: '{今日|きょう}は{何日|なんにち}ですか。——{14日|じゅうよっか}です。', ro: 'Kyō wa nannichi desu ka. — Jūyokka desu.', vi: 'Hôm nay ngày mấy? — Ngày 14.' },
            { en: 'しけんは{何月|なんがつ}ですか。——{7月|しちがつ}です。', ro: 'Shiken wa nangatsu desu ka. — Shichigatsu desu.', vi: 'Kỳ thi vào tháng mấy? — Tháng 7.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: sinh nhật các bạn trong lớp',
      lines: [
        { who: 'ラン', role: 'a', text: 'たなかさんのたんじょうびは{何月|なんがつ}{何日|なんにち}ですか。', ro: 'Tanaka-san no tanjōbi wa nangatsu nannichi desu ka.', vi: 'Sinh nhật anh Tanaka là ngày mấy tháng mấy?' },
        { who: 'たなか', role: 'b', text: '{2月|にがつ}{9日|ここのか}です。ランさんは？', ro: 'Nigatsu kokonoka desu. Ran-san wa?', vi: 'Ngày 9 tháng 2. Còn Lan?' },
        { who: 'ラン', role: 'a', text: 'わたしは{10月|じゅうがつ}{6日|むいか}です。', ro: 'Watashi wa jūgatsu muika desu.', vi: 'Mình là ngày 6 tháng 10.' },
        { who: 'たなか', role: 'b', text: '{10月|じゅうがつ}{6日|むいか}…なんようびですか。', ro: 'Jūgatsu muika… nan\'yōbi desu ka.', vi: 'Ngày 6 tháng 10… là thứ mấy nhỉ?' },
        { who: 'ラン', role: 'a', text: 'きんようびです。', ro: 'Kin\'yōbi desu.', vi: 'Thứ Sáu.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: たんじょうびは ＿＿ です。',
      head: ['Ngày', 'Câu', 'Romaji'],
      rows: [
        ['1/4', 'たんじょうびは{4月|しがつ}{1日|ついたち}です。', 'Tanjōbi wa shigatsu tsuitachi desu.'],
        ['2/7', 'たんじょうびは{7月|しちがつ}{2日|ふつか}です。', 'Tanjōbi wa shichigatsu futsuka desu.'],
        ['5/5', 'たんじょうびは{5月|ごがつ}{5日|いつか}です。', 'Tanjōbi wa gogatsu itsuka desu.'],
        ['7/11', 'たんじょうびは{11月|じゅういちがつ}{7日|なのか}です。', 'Tanjōbi wa jūichigatsu nanoka desu.'],
        ['24/12', 'たんじょうびは{12月|じゅうにがつ}{24日|にじゅうよっか}です。', 'Tanjōbi wa jūnigatsu nijūyokka desu.'],
      ],
    },
    { t: 'rule', formula: '[số]{月|がつ} [số]{日|にち} ／ {何月|なんがつ}{何日|なんにち}ですか', vi: 'Tháng trước, ngày sau; thuộc lòng ngày 1–10, 14, 20, 24.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~{15日|じゅうごにち}{7月|しちがつ}~~ (ngày trước tháng như tiếng Việt) → **{7月|しちがつ}{15日|じゅうごにち}**.',
        '~~いちにち~~ cho mồng 1 → **ついたち**; ~~にじゅうにち~~ → **はつか**; ~~よんにち~~ → **よっか**.',
        '~~よんがつ~~ → **しがつ**; ~~ななかつ~~ → **しちがつ**; ~~きゅうがつ~~ → **くがつ**.',
        'Viết ngày kiểu Việt **15/7** — người Nhật đọc là **tháng 15**?! Ở Nhật viết **7/15** (tháng/ngày) hoặc **7月15日**.',
      ],
    },

    /* ── Điểm 5 ── */
    { t: 'h', text: '⑤ N は ～から ～まで です — N từ … đến …' },
    {
      t: 'p',
      text: '**から** đánh dấu **mốc bắt đầu**, **まで** đánh dấu **mốc kết thúc** — cả hai đứng **SAU** mốc (giờ, ngày, thứ…). Dùng được riêng lẻ (**{9時|くじ}からです** = bắt đầu từ 9 giờ) hoặc đi cặp (**{9時|くじ}から{5時|ごじ}までです**). Câu hỏi: **{何時|なんじ}から{何時|なんじ}までですか**. Đây là mẫu câu bạn dùng cả đời ở Nhật: giờ mở cửa, giờ học, ca làm, kỳ nghỉ.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は ～から ～まで です',
          vi: 'N từ … đến …',
          examples: [
            { en: 'ぎんこうは{9時|くじ}から{3時|さんじ}までです。', ro: 'Ginkō wa kuji kara sanji made desu.', vi: 'Ngân hàng mở từ 9 giờ đến 3 giờ.' },
            { en: 'じゅぎょうはげつようびからきんようびまでです。', ro: 'Jugyō wa getsuyōbi kara kin\'yōbi made desu.', vi: 'Lớp học từ thứ Hai đến thứ Sáu.' },
            { en: 'なつ{休|やす}みは{7月|しちがつ}{20日|はつか}から{8月|はちがつ}{31日|さんじゅういちにち}までです。', ro: 'Natsuyasumi wa shichigatsu hatsuka kara hachigatsu sanjūichinichi made desu.', vi: 'Nghỉ hè từ 20/7 đến 31/8.' },
            { en: 'しけんは{10時|じゅうじ}から{11時半|じゅういちじはん}までです。', ro: 'Shiken wa jūji kara jūichiji han made desu.', vi: 'Bài thi từ 10 giờ đến 11 rưỡi.' },
          ],
        },
        {
          formula: 'N は ～から です ／ N は ～まで です',
          vi: 'N bắt đầu từ … / N kéo dài đến …',
          examples: [
            { en: 'かいぎは{2時|にじ}からです。', ro: 'Kaigi wa niji kara desu.', vi: 'Cuộc họp bắt đầu từ 2 giờ.' },
            { en: 'としょかんは{8時|はちじ}までです。', ro: 'Toshokan wa hachiji made desu.', vi: 'Thư viện mở đến 8 giờ.' },
            { en: 'パーティーは{7時|しちじ}からです。', ro: 'Pātī wa shichiji kara desu.', vi: 'Bữa tiệc bắt đầu từ 7 giờ.' },
          ],
        },
        {
          formula: 'N は {何時|なんじ}から {何時|なんじ}まで ですか',
          vi: 'N từ mấy giờ đến mấy giờ?',
          examples: [
            { en: 'ゆうびんきょくは{何時|なんじ}から{何時|なんじ}までですか。——{9時|くじ}から{5時|ごじ}までです。', ro: 'Yūbinkyoku wa nanji kara nanji made desu ka. — Kuji kara goji made desu.', vi: 'Bưu điện mở từ mấy giờ đến mấy giờ? — Từ 9 đến 5 giờ.' },
            { en: 'デパートは{何時|なんじ}までですか。——{午後|ごご}{8時|はちじ}までです。', ro: 'Depāto wa nanji made desu ka. — Gogo hachiji made desu.', vi: 'Trung tâm thương mại mở đến mấy giờ? — Đến 8 giờ tối.' },
            { en: 'しけんはなんようびからですか。——すいようびからです。', ro: 'Shiken wa nan\'yōbi kara desu ka. — Suiyōbi kara desu.', vi: 'Kỳ thi bắt đầu từ thứ mấy? — Từ thứ Tư.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: gọi điện hỏi giờ mở cửa',
      lines: [
        { who: 'すずき', role: 'b', text: 'はい、さくらとしょかんです。', ro: 'Hai, Sakura toshokan desu.', vi: 'Vâng, thư viện Sakura xin nghe.' },
        { who: 'ラン', role: 'a', text: 'すみません、そちらは{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Sumimasen, sochira wa nanji kara nanji made desu ka.', vi: 'Xin lỗi, thư viện mở cửa từ mấy giờ đến mấy giờ ạ?' },
        { who: 'すずき', role: 'b', text: '{午前|ごぜん}{9時|くじ}から{午後|ごご}{7時|しちじ}までです。', ro: 'Gozen kuji kara gogo shichiji made desu.', vi: 'Từ 9 giờ sáng đến 7 giờ tối ạ.' },
        { who: 'ラン', role: 'a', text: '{休|やす}みはなんようびですか。', ro: 'Yasumi wa nan\'yōbi desu ka.', vi: 'Thư viện nghỉ thứ mấy ạ?' },
        { who: 'すずき', role: 'b', text: 'げつようびです。', ro: 'Getsuyōbi desu.', vi: 'Thứ Hai ạ.' },
        { who: 'ラン', role: 'a', text: 'げつようびですね。どうもありがとうございました。', ro: 'Getsuyōbi desu ne. Dōmo arigatō gozaimashita.', vi: 'Thứ Hai nhỉ. Cảm ơn anh nhiều ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: N は ～から ～までです。',
      head: ['N', 'Từ', 'Đến', 'Câu', 'Romaji'],
      rows: [
        ['ぎんこう', '9:00', '15:00', 'ぎんこうは{9時|くじ}から{3時|さんじ}までです。', 'Ginkō wa kuji kara sanji made desu.'],
        ['ひる{休|やす}み', '12:00', '13:00', 'ひる{休|やす}みは{12時|じゅうにじ}から{1時|いちじ}までです。', 'Hiruyasumi wa jūniji kara ichiji made desu.'],
        ['アルバイト', 'thứ Hai', 'thứ Tư', 'アルバイトはげつようびからすいようびまでです。', 'Arubaito wa getsuyōbi kara suiyōbi made desu.'],
        ['ふゆ{休|やす}み (nghỉ đông)', '28/12', '4/1', 'ふゆ{休|やす}みは{12月|じゅうにがつ}{28日|にじゅうはちにち}から{1月|いちがつ}{4日|よっか}までです。', 'Fuyuyasumi wa jūnigatsu nijūhachinichi kara ichigatsu yokka made desu.'],
      ],
    },
    { t: 'rule', formula: 'N は [mốc 1] から [mốc 2] まで です', vi: 'Khoảng thời gian của N: から = từ, まで = đến — cả hai đứng SAU mốc.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Đặt から trước mốc như tiếng Việt: ~~から{9時|くじ}まで{5時|ごじ}~~ → **{9時|くじ}から{5時|ごじ}まで**.',
        'Nhầm から (từ — thời gian/nơi bắt đầu) ở đây với から "vì" (Bài 9) — Bài 4 chỉ có nghĩa **từ**.',
        'Dùng まで cho mốc bắt đầu: ~~{9時|くじ}までです~~ (khi muốn nói "bắt đầu lúc 9 giờ") → **{9時|くじ}からです**.',
      ],
    },

    /* ── Điểm 6 ── */
    { t: 'h', text: '⑥ Bộ từ để hỏi thời gian — {何|なん} + hậu tố' },
    {
      t: 'p',
      text: 'Tất cả câu hỏi về thời gian trong bài đều làm theo một khuôn: **thay con số bằng {何|なん}**, giữ nguyên hậu tố. Câu hỏi vẫn là **N は ＿ ですか**, câu trả lời chỉ cần thay **{何|なん}** bằng số. Khi trả lời, có thể bỏ "N は" vì đã rõ.',
    },
    {
      t: 'table',
      caption: 'Hỏi gì — dùng từ nào',
      head: ['Muốn hỏi', 'Từ để hỏi', 'Romaji', 'Câu hỏi mẫu', 'Trả lời mẫu'],
      rows: [
        ['mấy giờ', '{何時|なんじ}', 'nanji', '{今|いま}{何時|なんじ}ですか。', '{3時|さんじ}です。'],
        ['mấy phút', '{何分|なんぷん}', 'nanpun', '{何時|なんじ}{何分|なんぷん}ですか。', '{3時|さんじ}{5分|ごふん}です。'],
        ['thứ mấy', 'なんようび', 'nan\'yōbi', '{今日|きょう}はなんようびですか。', 'かようびです。'],
        ['tháng mấy', '{何月|なんがつ}', 'nangatsu', 'しけんは{何月|なんがつ}ですか。', '{7月|しちがつ}です。'],
        ['ngày mấy', '{何日|なんにち}', 'nannichi', '{今日|きょう}は{何日|なんにち}ですか。', '{20日|はつか}です。'],
        ['từ…đến…', '{何時|なんじ}から{何時|なんじ}まで', 'nanji kara nanji made', 'ぎんこうは{何時|なんじ}から{何時|なんじ}までですか。', '{9時|くじ}から{3時|さんじ}までです。'],
        ['số điện thoại', '{何|なん}', 'nan', '{電話|でんわ}ばんごうは{何|なん}ですか。', '090-1234-5678です。'],
      ],
    },
    {
      t: 'p',
      text: '**Đọc số điện thoại**: từng chữ số một, số 0 đọc **ゼロ** hoặc **まる**, dấu gạch ngang "-" đọc **の**: 090-1234-5678 = **ゼロきゅうゼロ の いちにさんよん の ごろくななはち**. Số 4 đọc **よん**, 7 đọc **なな**, 9 đọc **きゅう** để khỏi nghe nhầm.',
    },
    { t: 'rule', formula: '{何|なん} ＋ {時|じ}／{分|ぷん}／ようび／{月|がつ}／{日|にち} ですか', vi: 'Thay số bằng 何, giữ nguyên hậu tố — trả lời chỉ cần đổi 何 thành số.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~なにじ~~ → **なんじ**; ~~なにようび~~ → **なんようび**; ~~なにがつ~~ → **なんがつ**.',
        'Hỏi giờ bằng ~~いくら~~ (Bài 3, chỉ hỏi tiền) → **{何時|なんじ}**.',
        '**{何日|なんにち}** còn có nghĩa "mấy ngày" (khoảng thời gian, Bài 11) — trong bài này luôn là **ngày mấy**.',
      ],
    },

    /* ── Luyện tổng hợp ── */
    { t: 'h', text: 'Luyện tổng hợp' },
    {
      t: 'build',
      id: 'b4-np-ghep',
      title: 'Ghép câu — Bài 4',
      items: [
        { vi: 'Bây giờ là mấy giờ?', chips: ['{今|いま}', '{何時|なんじ}', 'ですか。', 'いくら'], answer: ['{今|いま}', '{何時|なんじ}', 'ですか。'], ro: 'Ima nanji desu ka.' },
        { vi: 'Bây giờ là 4 rưỡi.', chips: ['{今|いま}', '{4時|よじ}', '{半|はん}', 'です。', 'まで'], answer: ['{今|いま}', '{4時|よじ}', '{半|はん}', 'です。'], ro: 'Ima yoji han desu.' },
        { vi: 'Giờ học từ 9 giờ đến 12 giờ.', chips: ['じゅぎょうは', '{9時|くじ}', 'から', '{12時|じゅうにじ}', 'まで', 'です。'], answer: ['じゅぎょうは', '{9時|くじ}', 'から', '{12時|じゅうにじ}', 'まで', 'です。'], ro: 'Jugyō wa kuji kara jūniji made desu.' },
        { vi: 'Ca làm thêm từ 5 giờ chiều.', chips: ['アルバイトは', '{午後|ごご}', '{5時|ごじ}', 'から', 'です。', 'まで'], answer: ['アルバイトは', '{午後|ごご}', '{5時|ごじ}', 'から', 'です。'], ro: 'Arubaito wa gogo goji kara desu.' },
        { vi: 'Hôm nay là thứ mấy?', chips: ['{今日|きょう}は', 'なんようび', 'ですか。', 'なんじ'], answer: ['{今日|きょう}は', 'なんようび', 'ですか。'], ro: 'Kyō wa nan\'yōbi desu ka.' },
        { vi: 'Kỳ thi vào ngày 15 tháng 7.', chips: ['しけんは', '{7月|しちがつ}', '{15日|じゅうごにち}', 'です。', 'から'], answer: ['しけんは', '{7月|しちがつ}', '{15日|じゅうごにち}', 'です。'], ro: 'Shiken wa shichigatsu jūgonichi desu.' },
        { vi: 'Sinh nhật của bạn là ngày mấy tháng mấy?', chips: ['たんじょうびは', '{何月|なんがつ}', '{何日|なんにち}', 'ですか。', 'なんようび'], answer: ['たんじょうびは', '{何月|なんがつ}', '{何日|なんにち}', 'ですか。'], ro: 'Tanjōbi wa nangatsu nannichi desu ka.' },
        { vi: 'Ngân hàng nghỉ thứ Bảy và Chủ nhật.', chips: ['ぎんこうの', '{休|やす}みは', 'どようびと', 'にちようび', 'です。', 'から'], answer: ['ぎんこうの', '{休|やす}みは', 'どようびと', 'にちようび', 'です。'], ro: 'Ginkō no yasumi wa doyōbi to nichiyōbi desu.' },
        { vi: 'Cuộc họp vào chiều thứ Sáu.', chips: ['かいぎは', 'きんようびの', '{午後|ごご}', 'です。', 'きんようび'], answer: ['かいぎは', 'きんようびの', '{午後|ごご}', 'です。'], ro: 'Kaigi wa kin\'yōbi no gogo desu.' },
        { vi: 'Thư viện mở đến mấy giờ?', chips: ['としょかんは', '{何時|なんじ}', 'まで', 'ですか。', 'から'], answer: ['としょかんは', '{何時|なんじ}', 'まで', 'ですか。'], ro: 'Toshokan wa nanji made desu ka.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b4-np-dien',
      title: 'Điền một từ (から／まで／の／なん…／cách đọc)',
      kind: 'fill',
      items: [
        { q: 'じゅぎょうは{9時|くじ} ___ です。（bắt đầu từ 9 giờ）', answers: ['から'] },
        { q: 'デパートは{午後|ごご}{8時|はちじ} ___ です。（mở đến 8 giờ tối）', answers: ['まで'] },
        { q: 'かいぎはきんようび ___ {午後|ごご}です。', answers: ['の'] },
        { q: '{今日|きょう}は ___ ようびですか。——すいようびです。', answers: ['なん', '何'] },
        { q: 'しけんは ___ {月|がつ}ですか。——{7月|しちがつ}です。', answers: ['なん', '何'] },
        { q: '4:00 = ___ じ（gõ kana）', answers: ['よ'] },
        { q: '9:00 = ___ じ（gõ kana）', answers: ['く'] },
        { q: '10分 = じゅっ ___（gõ kana）', answers: ['ぷん'] },
        { q: 'Ngày 20 = ___（gõ kana）', answers: ['はつか', '20日', '二十日'] },
        { q: 'Ngày 1 = ___（gõ kana）', answers: ['ついたち', '1日', '一日'] },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-np-chon',
      title: 'Chọn câu / cách đọc đúng',
      items: [
        { q: '"Bây giờ là 7 giờ 10 phút":', options: ['いま しちじ じゅうふんです。', 'いま しちじ じゅっぷんです。', 'いま じゅっぷん しちじです。', 'いま しちじ じゅっぷんですか。'], correct: 1, why: 'Giờ trước, phút sau; 10分 = じゅっぷん; câu trần thuật không có か.' },
        { q: '"3 giờ chiều":', options: ['{3時|さんじ}{午後|ごご}', '{午後|ごご}{3時|さんじ}', '{午前|ごぜん}{3時|さんじ}', '{3時|さんじ}の{午後|ごご}'], correct: 1, why: '午後 đứng TRƯỚC giờ: 午後3時.' },
        { q: 'Ngày 8 đọc là:', options: ['よっか', 'ようか', 'はちにち', 'はつか'], correct: 1, why: '8日 = ようか (trường âm). よっか là ngày 4, はつか là ngày 20.' },
        { q: '"Ngân hàng mở từ 9 giờ đến 3 giờ":', options: ['ぎんこうは{9時|くじ}まで{3時|さんじ}からです。', 'ぎんこうはから{9時|くじ}まで{3時|さんじ}です。', 'ぎんこうは{9時|くじ}から{3時|さんじ}までです。', 'ぎんこうは{9時|くじ}と{3時|さんじ}です。'], correct: 2, why: 'から/まで đứng SAU mốc: 9時から3時まで.' },
        { q: 'Tháng 4 đọc là:', options: ['よんがつ', 'しがつ', 'よがつ', 'しっがつ'], correct: 1, why: '4月 = しがつ.' },
        { q: 'Hỏi "Hôm nay thứ mấy?":', options: ['{今日|きょう}は{何日|なんにち}ですか。', '{今日|きょう}はなんようびですか。', '{今日|きょう}は{何時|なんじ}ですか。', '{今日|きょう}はいつですか。'], correct: 1, why: 'Thứ → なんようび. 何日 = ngày mấy, 何時 = mấy giờ.' },
        { q: '"6 phút" đọc là:', options: ['ろくふん', 'ろっぷん', 'ろくぷん', 'むっぷん'], correct: 1, why: 'Số 6 + 分 → ろっぷん (nuốt âm).' },
        { q: '"Chiều thứ Sáu":', options: ['きんようび{午後|ごご}', 'きんようびの{午後|ごご}', '{午後|ごご}のきんようび', '{午後|ごご}きんようび'], correct: 1, why: 'Thứ → の → buổi: きんようびの午後.' },
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const KANJI: Lesson = {
  id: 'b4-kanji',
  kind: 'kanji',
  title: 'Chữ Hán: 時・分・半・午・前・後・月・火・水・木・金・土',
  goal: 'Đọc được giờ (9時半, 午後3時10分), tháng (7月) và thứ viết tắt trên lịch (月・火・水…); viết tay 11 chữ ✍.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Chữ của đồng hồ**: 時 (giờ) · 分 (phút) · 半 (rưỡi) · 午 (giữa trưa) · 前 (trước) · 後 (sau) → **午前／午後**.',
        '**Chữ của lịch**: 月・火・水・木・金・土 (+ 日 đã gặp ở 日本) — 7 chữ đầu của 7 ngày trong tuần, lịch Nhật in tắt đúng 1 chữ: **（月）（火）…**',
        'Một chữ nhiều cách đọc theo từ: **月** = がつ (tháng, 7月) · げつ (げつようび) · つき (mặt trăng). Học **theo từ**.',
        'Chữ **曜** (DIỆU, trong 月曜日) ngoài N5 — khoá viết ようび bằng kana; chỉ cần **nhận mặt** khi gặp trên lịch.',
      ],
    },
    {
      t: 'table',
      caption: 'Chữ Hán Bài 4 (✍ = nên viết thuộc · 👁 = nhìn nhận ra là đủ)',
      head: ['Chữ', 'Hán Việt', 'On', 'Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['時', 'THỜI', 'ジ', 'とき', 'giờ; thời gian', '{9時|くじ} · {何時|なんじ} · {時間|じかん} (thời gian)', '✍'],
        ['分', 'PHÂN', 'フン・ブン', 'わ(かる)', 'phút; chia, phần', '{5分|ごふん} · {10分|じゅっぷん} · {半分|はんぶん} (một nửa)', '✍'],
        ['半', 'BÁN', 'ハン', 'なか(ば)', 'một nửa, rưỡi', '{半|はん} · {9時半|くじはん} · {半分|はんぶん}', '✍'],
        ['午', 'NGỌ', 'ゴ', '—', 'giờ Ngọ, giữa trưa', '{午前|ごぜん} · {午後|ごご}', '✍'],
        ['前', 'TIỀN', 'ゼン', 'まえ', 'trước', '{午前|ごぜん} · {名前|なまえ} (tên) · {前|まえ} (phía trước)', '✍'],
        ['後', 'HẬU', 'ゴ・コウ', 'あと・うし(ろ)', 'sau', '{午後|ごご} · {後|うし}ろ (phía sau, Bài 10)', '👁'],
        ['月', 'NGUYỆT', 'ゲツ・ガツ', 'つき', 'mặt trăng; tháng', '{7月|しちがつ} · げつようび (月曜日) · {月|つき}', '✍'],
        ['火', 'HOẢ', 'カ', 'ひ', 'lửa', 'かようび (火曜日) · {火|ひ} (lửa)', '✍'],
        ['水', 'THUỶ', 'スイ', 'みず', 'nước', 'すいようび (水曜日) · {水|みず}', '✍'],
        ['木', 'MỘC', 'モク・ボク', 'き', 'cây', 'もくようび (木曜日) · {木|き}', '✍'],
        ['金', 'KIM', 'キン・コン', 'かね', 'vàng; tiền', 'きんようび (金曜日) · お{金|かね} (tiền)', '✍'],
        ['土', 'THỔ', 'ド・ト', 'つち', 'đất', 'どようび (土曜日) · {土|つち}', '✍'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ mặt chữ',
      items: [
        '**時**: bộ 日 (mặt trời) bên trái + 寺 (chùa) → mặt trời đi qua mái chùa, chuông chùa điểm **giờ**.',
        '**分**: 八 (tách ra) ở trên + 刀 (con dao) ở dưới → lấy dao **chia** ra → phần, phút (một giờ chia 60 phần).',
        '**半**: một gạch dọc chẻ đôi hình ở giữa → **một nửa**.',
        '**午** ≠ **牛** (con bò): 午 nét dọc **không** nhô lên trên; 牛 có sừng nhô lên.',
        '**月** là vầng trăng khuyết · **火** là ngọn lửa có hai tia lửa bắn ra · **水** là dòng nước có bọt hai bên · **木** là cái cây có rễ · **土** là mầm cây nhú lên khỏi mặt đất · **金** là mái nhà che ánh kim lấp lánh dưới đất.',
        '**土** (đất) ≠ **士** (sĩ): 土 gạch **dưới dài**, 士 gạch **trên dài**.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc nhầm hay gặp',
      items: [
        '**4時** đọc ~~よんじ~~ → **よじ**; **9時** ~~きゅうじ~~ → **くじ**; **7時** → **しちじ**.',
        '**分** sau 1, 3, 4, 6, 8, 10 đọc **ぷん**: {1分|いっぷん}, {3分|さんぷん}, {4分|よんぷん}, {6分|ろっぷん}, {8分|はっぷん}, {10分|じゅっぷん}.',
        '**月** đọc **がつ** khi là tháng (7月 = しちがつ), **げつ** trong げつようび, **つき** khi đứng một mình (mặt trăng).',
        '**午後** đọc **ごご** — hai chữ khác nhau (午 + 後) nhưng cùng đọc ご.',
        '**前** trong **午前** đọc **ぜん**, đứng một mình đọc **まえ** (phía trước) — như trong {名前|なまえ} (tên) ở Bài 1.',
      ],
    },
    {
      t: 'table',
      caption: 'Đọc lịch Nhật: ngày + thứ viết tắt trong ngoặc',
      head: ['Lịch ghi', 'Đọc', 'Romaji', 'Nghĩa'],
      rows: [
        ['7月15日（火）', 'しちがつ じゅうごにち かようび', 'shichigatsu jūgonichi kayōbi', 'thứ Ba, 15/7'],
        ['4月1日（月）', 'しがつ ついたち げつようび', 'shigatsu tsuitachi getsuyōbi', 'thứ Hai, 1/4'],
        ['9月20日（金）', 'くがつ はつか きんようび', 'kugatsu hatsuka kin\'yōbi', 'thứ Sáu, 20/9'],
        ['営業時間 10:00〜20:00', '(えいぎょうじかん) じゅうじ から はちじ まで', 'eigyō jikan jūji kara hachiji made', 'giờ mở cửa 10:00–20:00'],
        ['定休日（水）', '(ていきゅうび) すいようび', 'teikyūbi suiyōbi', 'nghỉ định kỳ: thứ Tư'],
      ],
    },
    {
      t: 'note',
      title: 'Biển giờ mở cửa ở Nhật',
      items: [
        '**営業時間** (えいぎょうじかん) = giờ mở cửa · **定休日** (ていきゅうび) = ngày nghỉ cố định — hai cụm có chữ ngoài N5, chỉ cần **nhận mặt** vì gặp ở mọi cửa hàng.',
        'Dấu **〜** giữa hai giờ đọc là **から…まで**: 10:00〜20:00 = じゅうじからはちじまで.',
        'Cửa hàng ghi giờ theo **hệ 24 giờ**: 20:00 nói thành {午後|ごご}{8時|はちじ} hoặc {20時|にじゅうじ}.',
      ],
    },
    {
      t: 'readkanji',
      id: 'b4-kj-doc',
      title: 'Đọc to — giờ, tháng, thứ',
      note: 'Đọc cả câu không nhìn furigana. Chỗ vấp nhiều nhất: 9時 (くじ), 4時 (よじ), 10分 (じゅっぷん), 4月 (しがつ), 午後 (ごご). Hai câu cuối có chữ 曜 (ngoài N5) để làm quen mặt chữ trên lịch.',
      items: [
        { text: '{今|いま}{9時|くじ}{半|はん}です。', ro: 'Ima kuji han desu.', vi: 'Bây giờ là 9 rưỡi.' },
        { text: '{午後|ごご}{4時|よじ}{10分|じゅっぷん}です。', ro: 'Gogo yoji juppun desu.', vi: '4 giờ 10 chiều.' },
        { text: 'じゅぎょうは{午前|ごぜん}{8時|はちじ}{45分|よんじゅうごふん}からです。', ro: 'Jugyō wa gozen hachiji yonjūgofun kara desu.', vi: 'Giờ học từ 8 giờ 45 sáng.' },
        { text: 'しけんは{4月|しがつ}です。', ro: 'Shiken wa shigatsu desu.', vi: 'Kỳ thi vào tháng 4.' },
        { text: '{今日|きょう}は{9月|くがつ}{9日|ここのか}です。', ro: 'Kyō wa kugatsu kokonoka desu.', vi: 'Hôm nay là ngày 9 tháng 9.' },
        { text: 'たんじょうびは{7月|しちがつ}{7日|なのか}です。', ro: 'Tanjōbi wa shichigatsu nanoka desu.', vi: 'Sinh nhật là ngày 7 tháng 7.' },
        { text: '{今|いま}{7時|しちじ}{3分|さんぷん}です。', ro: 'Ima shichiji sanpun desu.', vi: 'Bây giờ là 7 giờ 3 phút.' },
        { text: 'ぎんこうは{午前|ごぜん}{9時|くじ}から{午後|ごご}{3時|さんじ}までです。', ro: 'Ginkō wa gozen kuji kara gogo sanji made desu.', vi: 'Ngân hàng mở từ 9 giờ sáng đến 3 giờ chiều.' },
        { text: 'これはわたしのお{金|かね}です。', ro: 'Kore wa watashi no o-kane desu.', vi: 'Đây là tiền của tôi.' },
        { text: '{水|みず}は{百円|ひゃくえん}です。', ro: 'Mizu wa hyaku en desu.', vi: 'Nước 100 yên.' },
        { text: '{火曜日|かようび}から{金曜日|きんようび}までです。', ro: 'Kayōbi kara kin\'yōbi made desu.', vi: 'Từ thứ Ba đến thứ Sáu.' },
        { text: 'アルバイトは{月曜日|げつようび}と{土曜日|どようび}です。', ro: 'Arubaito wa getsuyōbi to doyōbi desu.', vi: 'Làm thêm vào thứ Hai và thứ Bảy.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-kj-chon',
      title: 'Chọn cách đọc đúng',
      items: [
        { q: '**9時**', options: ['きゅうじ', 'くじ', 'きゅじ', 'くうじ'], correct: 1, why: '9 giờ = くじ.' },
        { q: '**午後**', options: ['ごご', 'ごうご', 'ごあと', 'ひるご'], correct: 0, why: '午後 = ごご (buổi chiều).' },
        { q: '**10分**', options: ['じゅうふん', 'じゅっぷん', 'とおふん', 'じゅうぶん'], correct: 1, why: '10 + 分 = じゅっぷん (hoặc じっぷん).' },
        { q: '**4月**', options: ['よんがつ', 'よがつ', 'しがつ', 'しげつ'], correct: 2, why: 'Tháng 4 = しがつ.' },
        { q: '**半**', options: ['はん', 'ばん', 'ぱん', 'なか'], correct: 0, why: '半 = はん (rưỡi).' },
        { q: '**午前**', options: ['ごまえ', 'ごぜん', 'ごせん', 'ごうぜん'], correct: 1, why: '午前 = ごぜん (buổi sáng).' },
        { q: 'Trên lịch, **（金）** là thứ mấy?', options: ['thứ Hai', 'thứ Tư', 'thứ Sáu', 'thứ Bảy'], correct: 2, why: '金 = きんようび = thứ Sáu.' },
        { q: 'Trên lịch, **（土）** là thứ mấy?', options: ['thứ Ba', 'thứ Năm', 'thứ Bảy', 'Chủ nhật'], correct: 2, why: '土 = どようび = thứ Bảy. Chủ nhật là （日）.' },
        { q: '**水** đứng một mình đọc là:', options: ['すい', 'みず', 'かわ', 'みつ'], correct: 1, why: 'Kun: みず (nước). すい chỉ dùng trong từ ghép như すいようび.' },
        { q: '**7時**', options: ['しちじ', 'しじ', 'ななつじ', 'ひちじ'], correct: 0, why: '7 giờ = しちじ (ななじ cũng nghe thấy).' },
      ],
    },
    {
      t: 'write',
      id: 'b4-kj-viet',
      title: 'Tập viết chữ Hán Bài 4',
      note: '11 chữ ✍ — đều ít nét và gặp mỗi ngày trên đồng hồ, lịch. 後 là 👁 (9 nét, khó) — viết thử nếu còn sức. Viết 月・火・水・木・金・土 theo đúng thứ tự ngày trong tuần để nhớ luôn tên thứ.',
      chars: ['時', '分', '半', '午', '前', '月', '火', '水', '木', '金', '土', '後'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b4-nghe',
  kind: 'listening',
  title: 'Nghe: mấy giờ, thứ mấy, ngày mấy?',
  goal: 'Nghe kiểu đề JLPT N5 và bắt đúng: giờ bắt đầu – kết thúc, ngày mở cửa, ngày tháng có cách đọc đặc biệt.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '5 bài theo dạng đề **JLPT N5 聴解**: ポイント理解 (bắt một thông tin), 課題理解 (nghe rồi quyết định), 発話表現 (chọn câu nên nói), 即時応答 (đáp ngay).',
        'Từ khoá phải bắt: **から／まで**, **{午前|ごぜん}／{午後|ごご}**, **～ようび**, **{半|はん}**, ngày đặc biệt (**よっか ↔ ようか**, **はつか**).',
        'Mẹo: khi nghe, ghi nháp **số trước, chữ sau**: "9–12", "T2, T4", "4/8"… rồi mới đọc câu hỏi.',
        'Bẫy quen thuộc của đề: nói **hai** giờ / hai ngày, rồi **sửa lại** ở cuối — luôn nghe tới câu cuối cùng.',
      ],
    },
    {
      t: 'listen',
      id: 'b4-nghe-1',
      title: 'Bài nghe 1 — Lịch thi ngày mai (ポイント理解)',
      note: 'Dạng ポイント理解. Cô giáo thông báo lịch thi. Câu hỏi chính: "Bài thi nghe bắt đầu lúc mấy giờ?". Ghi nháp từng mốc giờ. Từ mới: **ききとり** = nghe hiểu.',
      lines: [
        { who: 'やまだ先生', voice: 'ja-nu', text: 'みなさん、あしたはしけんです。{7月|しちがつ}{15日|じゅうごにち}、かようびです。', ro: 'Minasan, ashita wa shiken desu. Shichigatsu jūgonichi, kayōbi desu.', vi: 'Các em, ngày mai là ngày thi. Ngày 15 tháng 7, thứ Ba.' },
        { who: 'やまだ先生', voice: 'ja-nu', text: 'しけんは{9時|くじ}からです。{9時|くじ}から{10時|じゅうじ}まではかんじのしけんです。', ro: 'Shiken wa kuji kara desu. Kuji kara jūji made wa kanji no shiken desu.', vi: 'Thi bắt đầu từ 9 giờ. Từ 9 giờ đến 10 giờ là bài thi chữ Hán.' },
        { who: 'やまだ先生', voice: 'ja-nu', text: '{10時|じゅうじ}から{10時半|じゅうじはん}までは{休|やす}みです。', ro: 'Jūji kara jūji han made wa yasumi desu.', vi: 'Từ 10 giờ đến 10 rưỡi là giờ nghỉ.' },
        { who: 'やまだ先生', voice: 'ja-nu', text: 'ききとりのしけんは{10時半|じゅうじはん}から{11時半|じゅういちじはん}までです。', ro: 'Kikitori no shiken wa jūji han kara jūichiji han made desu.', vi: 'Bài thi nghe từ 10 rưỡi đến 11 rưỡi.' },
        { who: 'ラン', voice: 'ja-nu', text: '{先生|せんせい}、きょうしつは{何|なん}がいですか。', ro: 'Sensei, kyōshitsu wa nangai desu ka.', vi: 'Thưa cô, phòng thi ở tầng mấy ạ?' },
        { who: 'やまだ先生', voice: 'ja-nu', text: 'よんかいです。401きょうしつです。', ro: 'Yonkai desu. Yon-zero-ichi kyōshitsu desu.', vi: 'Tầng 4. Phòng 401.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-1-cau',
      title: 'Câu hỏi bài nghe 1',
      items: [
        { q: 'Bài thi nghe (ききとり) bắt đầu lúc mấy giờ?', options: ['9:00', '10:00', '10:30', '11:30'], correct: 2, why: 'ききとりのしけんは10時半から — 10 rưỡi. 9:00 là thi chữ Hán, 10:00 là giờ nghỉ.' },
        { q: 'Ngày thi là:', options: ['thứ Ba, 15/7', 'thứ Năm, 15/7', 'thứ Ba, 5/7', 'thứ Hai, 14/7'], correct: 0, why: '7月15日、かようび.' },
        { q: 'Giờ nghỉ dài bao lâu?', options: ['10 phút', '30 phút', '1 tiếng', 'không có'], correct: 1, why: '10時から10時半まで = 30 phút.' },
        { q: 'Phòng thi ở đâu?', options: ['Tầng 1, phòng 104', 'Tầng 4, phòng 401', 'Tầng 4, phòng 410', 'Tầng 3, phòng 401'], correct: 1, why: 'よんかい、401きょうしつ.' },
      ],
    },
    {
      t: 'listen',
      id: 'b4-nghe-2',
      title: 'Bài nghe 2 — Gọi điện cho bưu điện (課題理解)',
      note: 'Dạng 課題理解: nghe rồi quyết định. Lan muốn gửi đồ cho mẹ, chỉ rảnh cuối tuần. Câu hỏi: "Lan đi bưu điện lúc nào thì được?". Chú ý giờ mở cửa KHÁC NHAU giữa ngày thường và thứ Bảy.',
      lines: [
        { who: 'ゆうびんきょく', voice: 'ja-nam', text: 'はい、さくらゆうびんきょくです。', ro: 'Hai, Sakura yūbinkyoku desu.', vi: 'Vâng, bưu điện Sakura xin nghe.' },
        { who: 'ラン', voice: 'ja-nu', text: 'すみません、そちらは{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Sumimasen, sochira wa nanji kara nanji made desu ka.', vi: 'Xin lỗi, bưu điện mở cửa từ mấy giờ đến mấy giờ ạ?' },
        { who: 'ゆうびんきょく', voice: 'ja-nam', text: 'げつようびからきんようびまでは、{午前|ごぜん}{9時|くじ}から{午後|ごご}{5時|ごじ}までです。', ro: 'Getsuyōbi kara kin\'yōbi made wa, gozen kuji kara gogo goji made desu.', vi: 'Từ thứ Hai đến thứ Sáu thì mở từ 9 giờ sáng đến 5 giờ chiều.' },
        { who: 'ラン', voice: 'ja-nu', text: 'どようびとにちようびは？', ro: 'Doyōbi to nichiyōbi wa?', vi: 'Còn thứ Bảy và Chủ nhật ạ?' },
        { who: 'ゆうびんきょく', voice: 'ja-nam', text: 'どようびは{午前|ごぜん}{9時|くじ}から{12時|じゅうにじ}までです。にちようびは{休|やす}みです。', ro: 'Doyōbi wa gozen kuji kara jūniji made desu. Nichiyōbi wa yasumi desu.', vi: 'Thứ Bảy mở từ 9 giờ đến 12 giờ trưa. Chủ nhật nghỉ.' },
        { who: 'ラン', voice: 'ja-nu', text: 'どようびの{午前|ごぜん}ですね。わかりました。ありがとうございました。', ro: 'Doyōbi no gozen desu ne. Wakarimashita. Arigatō gozaimashita.', vi: 'Sáng thứ Bảy nhỉ. Em hiểu rồi. Cảm ơn anh.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-2-cau',
      title: 'Câu hỏi bài nghe 2',
      items: [
        { q: 'Lan chỉ rảnh cuối tuần. Lan đi bưu điện lúc nào thì được?', options: ['Thứ Bảy, 10 giờ sáng', 'Thứ Bảy, 2 giờ chiều', 'Chủ nhật, 10 giờ sáng', 'Chủ nhật, 2 giờ chiều'], correct: 0, why: 'Thứ Bảy chỉ mở 9:00–12:00; Chủ nhật nghỉ. → Sáng thứ Bảy.' },
        { q: 'Ngày thường bưu điện đóng cửa lúc mấy giờ?', options: ['12 giờ trưa', '3 giờ chiều', '5 giờ chiều', '9 giờ tối'], correct: 2, why: '午後5時まで.' },
        { q: '"そちら" trong câu hỏi của Lan nghĩa là gì?', options: ['chỗ kia', 'phía bên anh (bưu điện)', 'thứ Bảy', 'giờ mở cửa'], correct: 1, why: 'Khi gọi điện, そちら = phía bên người nghe — ở đây là bưu điện.' },
      ],
    },
    {
      t: 'listen',
      id: 'b4-nghe-3',
      title: 'Bài nghe 3 — Sinh nhật của Kim (ポイント理解)',
      note: 'Dạng ポイント理解. Câu hỏi: "Sinh nhật của Kim là ngày nào?". Bẫy kinh điển: **よっか (4)** và **ようか (8)** nghe rất giống — nghe kỹ âm ngắt っ và trường âm.',
      lines: [
        { who: 'たなか', voice: 'ja-nam', text: 'キムさん、たんじょうびは{何月|なんがつ}{何日|なんにち}ですか。', ro: 'Kimu-san, tanjōbi wa nangatsu nannichi desu ka.', vi: 'Kim ơi, sinh nhật bạn ngày mấy tháng mấy?' },
        { who: 'キム', voice: 'ja-nu', text: '{8月|はちがつ}{4日|よっか}です。', ro: 'Hachigatsu yokka desu.', vi: 'Ngày 4 tháng 8.' },
        { who: 'たなか', voice: 'ja-nam', text: '{8月|はちがつ}{8日|ようか}ですか。', ro: 'Hachigatsu yōka desu ka.', vi: 'Ngày 8 tháng 8 à?' },
        { who: 'キム', voice: 'ja-nu', text: 'いいえ、ようかじゃありません。よっかです。たなかさんは？', ro: 'Iie, yōka ja arimasen. Yokka desu. Tanaka-san wa?', vi: 'Không, không phải ngày 8. Ngày 4. Còn anh Tanaka?' },
        { who: 'たなか', voice: 'ja-nam', text: 'ぼくは{9月|くがつ}{20日|はつか}です。', ro: 'Boku wa kugatsu hatsuka desu.', vi: 'Mình là ngày 20 tháng 9.' },
        { who: 'キム', voice: 'ja-nu', text: 'じゃ、なつ{休|やす}みですね。', ro: 'Ja, natsuyasumi desu ne.', vi: 'Vậy là trong kỳ nghỉ hè nhỉ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-3-cau',
      title: 'Câu hỏi bài nghe 3',
      items: [
        { q: 'Sinh nhật của Kim là ngày nào?', options: ['4/8', '8/8', '8/4', '4/4'], correct: 0, why: 'はちがつよっか = ngày 4 tháng 8. Tanaka nghe nhầm thành ようか (8), Kim sửa lại.' },
        { q: 'Sinh nhật của Tanaka là ngày nào?', options: ['2/9', '20/9', '9/2', '20/8'], correct: 1, why: 'くがつはつか = ngày 20 tháng 9.' },
        { q: '"ぼく" là gì?', options: ['bạn (gọi người khác)', 'tôi (nam giới dùng, thân mật)', 'anh ấy', 'chúng tôi'], correct: 1, why: 'ぼく = "tôi", nam giới dùng khi nói chuyện thân mật. Lan (nữ) luôn dùng わたし.' },
      ],
    },
    {
      t: 'listen',
      id: 'b4-nghe-4',
      title: 'Bài nghe 4 — Nói gì bây giờ? (発話表現)',
      note: 'Dạng 発話表現: đề cho một tình huống, máy đọc 3 câu, chọn câu bạn nên nói. Tình huống: **Bạn ở ngân hàng, muốn hỏi nhân viên ngân hàng mở cửa đến mấy giờ.**',
      lines: [
        { who: '1', voice: 'ja-nu', text: 'ぎんこうは{何時|なんじ}までですか。', ro: 'Ginkō wa nanji made desu ka.', vi: 'Ngân hàng mở đến mấy giờ ạ?' },
        { who: '2', voice: 'ja-nu', text: 'ぎんこうは{何時|なんじ}ですか。', ro: 'Ginkō wa nanji desu ka.', vi: 'Ngân hàng là mấy giờ ạ? (câu lửng, không rõ ý)' },
        { who: '3', voice: 'ja-nu', text: 'ぎんこうはどこまでですか。', ro: 'Ginkō wa doko made desu ka.', vi: 'Ngân hàng đến chỗ nào ạ? (sai ý)' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-4-cau',
      title: 'Câu hỏi bài nghe 4',
      items: [
        { q: 'Bạn nên nói câu nào?', options: ['1', '2', '3'], correct: 0, why: 'Hỏi giờ đóng cửa → 何時までですか. Câu 3 dùng どこ (ở đâu) là sai.' },
      ],
    },
    {
      t: 'listen',
      id: 'b4-nghe-5',
      title: 'Bài nghe 5 — Đáp ngay (即時応答)',
      note: 'Dạng 即時応答: nghe một câu, chọn câu đáp tự nhiên nhất. 4 câu nhỏ.',
      lines: [
        { who: 'Câu 1', voice: 'ja-nam', text: 'すみません、{今|いま}{何時|なんじ}ですか。', ro: 'Sumimasen, ima nanji desu ka.', vi: 'Xin lỗi, bây giờ là mấy giờ?' },
        { who: 'Câu 2', voice: 'ja-nu', text: '{今日|きょう}はなんようびですか。', ro: 'Kyō wa nan\'yōbi desu ka.', vi: 'Hôm nay là thứ mấy?' },
        { who: 'Câu 3', voice: 'ja-nam', text: 'じゅぎょうは{何時|なんじ}からですか。', ro: 'Jugyō wa nanji kara desu ka.', vi: 'Giờ học bắt đầu từ mấy giờ?' },
        { who: 'Câu 4', voice: 'ja-nu', text: 'あしたはわたしのたんじょうびです。', ro: 'Ashita wa watashi no tanjōbi desu.', vi: 'Ngày mai là sinh nhật tôi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-5-cau',
      title: 'Câu hỏi bài nghe 5 — chọn câu đáp',
      items: [
        { q: 'Câu 1: すみません、今何時ですか。', options: ['3時半です。', 'すいようびです。', '3日です。'], correct: 0, why: 'Hỏi giờ → trả lời giờ.' },
        { q: 'Câu 2: 今日はなんようびですか。', options: ['10日です。', 'もくようびです。', 'ごごです。'], correct: 1, why: 'Hỏi thứ → ～ようび.' },
        { q: 'Câu 3: じゅぎょうは何時からですか。', options: ['12時までです。', '9時からです。', 'げつようびです。'], correct: 1, why: 'Hỏi "từ mấy giờ" → ～時からです. Câu a trả lời mốc kết thúc.' },
        { q: 'Câu 4: あしたはわたしのたんじょうびです。', options: ['そうですか。おめでとうございます。', 'いいえ、ちがいます。', 'どういたしまして。'], correct: 0, why: 'Nghe tin sinh nhật → chúc mừng: おめでとうございます.' },
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b4-noi',
  kind: 'speaking',
  title: 'Nói: hỏi giờ, nói lịch học, nói ngày sinh',
  goal: 'Đọc trôi 12 câu mẫu (giờ, thứ, ngày đặc biệt), rồi tự trả lời câu hỏi về giờ học, ngày nghỉ và sinh nhật của mình.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Luyện phát âm** 12 câu từ ngắn tới dài — cũng là danh sách câu khi 📞 gọi **CuongMini** trong bài này.',
        'Chú trọng: **くじ, よじ, しちじ** · **じゅっぷん, さんぷん** · trường âm trong **kyō, -yōbi, jūni** · âm ngắt trong **mikka, yokka**.',
        'Hội thoại mẫu "giám khảo ↔ thí sinh": lịch học, ngày nghỉ, sinh nhật.',
        'Ghi âm trả lời 5 câu hỏi về bản thân.',
      ],
    },
    {
      t: 'phatam',
      id: 'b4-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 12 câu Bài 4',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Trường âm (ō, ū) kéo đủ **2 nhịp**: きょ・う, よ・う・び. Âm ngắt っ là **một nhịp lặng**: みっ・か = mi-(lặng)-ka.',
      items: [
        { text: '{今|いま}{何時|なんじ}ですか。', ipa: 'ima nanji desu ka', vi: 'Bây giờ là mấy giờ?' },
        { text: '{9時半|くじはん}です。', ipa: 'kuji han desu', vi: '9 rưỡi.' },
        { text: '{午後|ごご}{4時|よじ}{10分|じゅっぷん}です。', ipa: 'gogo yoji juppun desu', vi: '4 giờ 10 chiều.' },
        { text: '{今日|きょう}はなんようびですか。', ipa: 'kyō wa nan\'yōbi desu ka', vi: 'Hôm nay là thứ mấy?' },
        { text: 'もくようびです。', ipa: 'mokuyōbi desu', vi: 'Thứ Năm.' },
        { text: 'じゅぎょうは{9時|くじ}から{12時|じゅうにじ}までです。', ipa: 'jugyō wa kuji kara jūniji made desu', vi: 'Giờ học từ 9 đến 12 giờ.' },
        { text: '{休|やす}みはどようびとにちようびです。', ipa: 'yasumi wa doyōbi to nichiyōbi desu', vi: 'Ngày nghỉ là thứ Bảy và Chủ nhật.' },
        { text: 'たんじょうびは{何月|なんがつ}{何日|なんにち}ですか。', ipa: 'tanjōbi wa nangatsu nannichi desu ka', vi: 'Sinh nhật bạn ngày mấy tháng mấy?' },
        { text: '{4月|しがつ}{1日|ついたち}です。', ipa: 'shigatsu tsuitachi desu', vi: 'Ngày 1 tháng 4.' },
        { text: 'しけんは{7月|しちがつ}{8日|ようか}です。', ipa: 'shiken wa shichigatsu yōka desu', vi: 'Kỳ thi vào ngày 8 tháng 7.' },
        { text: 'ぎんこうは{何時|なんじ}から{何時|なんじ}までですか。', ipa: 'ginkō wa nanji kara nanji made desu ka', vi: 'Ngân hàng mở từ mấy giờ đến mấy giờ?' },
        { text: 'アルバイトはげつようびの{午後|ごご}{5時|ごじ}からです。', ipa: 'arubaito wa getsuyōbi no gogo goji kara desu', vi: 'Ca làm thêm bắt đầu lúc 5 giờ chiều thứ Hai.' },
      ],
    },
    {
      t: 'note',
      title: 'Phát âm người Việt hay sai',
      items: [
        '**じゅう** (10, jū — dài) ≠ **じゅ** (ju — ngắn, trong じゅぎょう) ≠ **じゅっ** (juq — có âm ngắt, trong じゅっぷん). Ba âm khác nhau!',
        '**きょう** (hôm nay) đọc dính một âm "kyo" + kéo dài, không tách ~~ki-yo-u~~.',
        '**ようび** có trường âm: **yō**-bi. Đọc ngắn ~~yobi~~ nghe như "gọi" (よび).',
        '**ついたち**: âm **tsu** — đặt lưỡi như "t" rồi bật ra "s"; không đọc thành "chư" hay "tư".',
      ],
    },
    {
      t: 'dialogue',
      title: 'Mẫu: giám khảo hỏi về lịch học và sinh nhật',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: '{日本語|にほんご}のじゅぎょうは{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Nihongo no jugyō wa nanji kara nanji made desu ka.', vi: 'Giờ học tiếng Nhật của em từ mấy giờ đến mấy giờ?' },
        { who: 'Thí sinh', role: 'candidate', text: '{午前|ごぜん}{9時|くじ}から{12時|じゅうにじ}までです。', ro: 'Gozen kuji kara jūniji made desu.', vi: 'Từ 9 giờ sáng đến 12 giờ trưa ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'じゅぎょうはなんようびですか。', ro: 'Jugyō wa nan\'yōbi desu ka.', vi: 'Em học vào những thứ nào?' },
        { who: 'Thí sinh', role: 'candidate', text: 'げつようびからきんようびまでです。', ro: 'Getsuyōbi kara kin\'yōbi made desu.', vi: 'Từ thứ Hai đến thứ Sáu ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: '{休|やす}みは？', ro: 'Yasumi wa?', vi: 'Còn ngày nghỉ?' },
        { who: 'Thí sinh', role: 'candidate', text: 'どようびとにちようびです。', ro: 'Doyōbi to nichiyōbi desu.', vi: 'Thứ Bảy và Chủ nhật ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'たんじょうびは{何月|なんがつ}{何日|なんにち}ですか。', ro: 'Tanjōbi wa nangatsu nannichi desu ka.', vi: 'Sinh nhật em ngày mấy tháng mấy?' },
        { who: 'Thí sinh', role: 'candidate', text: '{11月|じゅういちがつ}{3日|みっか}です。', ro: 'Jūichigatsu mikka desu.', vi: 'Ngày 3 tháng 11 ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bí quyết trả lời',
      items: [
        'Trả lời **đúng loại thông tin**: hỏi なんようび → nói thứ; hỏi {何時|なんじ} → nói giờ. Lạc loại là lỗi bị trừ điểm nặng nhất.',
        'Chưa chắc ngày đặc biệt? Nói tháng trước cho chắc (**{11月|じゅういちがつ}…**), ngày sau — ngắt nhẹ để nghĩ không sao.',
        'Nói đủ **～から～までです** thay vì chỉ "9時、12時".',
        'Muốn nói "khoảng": **{9時|くじ}ごろです** (khoảng 9 giờ).',
      ],
    },
    {
      t: 'speak',
      id: 'b4-noi-ghi-am',
      part: '1',
      questions: [
        'いま なんじですか。',
        'きょうは なんようびですか。',
        'あなたの たんじょうびは なんがつ なんにちですか。',
        'がっこうの じゅぎょうは なんじから なんじまでですか。',
        'やすみは なんようびですか。',
      ],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b4-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 4 — dịch, chọn từ, ghép câu, đọc hiểu',
  goal: 'Tự viết câu hỏi – đáp về giờ, thứ, ngày tháng, giờ mở cửa; đọc hiểu một tấm thông báo giờ làm việc.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Dịch Việt → Nhật** 12 câu (gõ kana hay chữ Hán đều được; giờ, ngày gõ bằng chữ số hoặc kana).',
        '**Trắc nghiệm** 12 câu: cách đọc giờ/ngày, から・まで, từ để hỏi.',
        '**Ghép câu** 6 câu và **đọc hiểu** thông báo của thư viện + tin nhắn của Lan.',
      ],
    },
    {
      t: 'quiz',
      id: 'b4-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: '今～時～分です · 午前／午後 · N は ～ようびです · ～月～日 · N は ～から ～までです',
      items: [
        { q: 'Bây giờ là mấy giờ?', answers: ans('{今|いま}{何時|なんじ}ですか。', '{今|いま}は{何時|なんじ}ですか。'), hint: '今, 何時' },
        { q: 'Bây giờ là 9 rưỡi.', answers: [...ans('{今|いま}{9時半|くじはん}です。', '{今|いま}{9時|くじ}{30分|さんじゅっぷん}です。'), 'いま9じはんです。', 'いま9時半です。', 'いま9じ30ぷんです。'], hint: '今, 9時, 半' },
        { q: 'Bây giờ là 4 giờ 10 phút chiều.', answers: [...ans('{今|いま}{午後|ごご}{4時|よじ}{10分|じゅっぷん}です。'), 'いまごご4じ10ぷんです。', 'いま午後4じ10ぷんです。'], hint: '午後, 4時, 10分' },
        { q: 'Giờ học từ 9 giờ đến 12 giờ.', answers: [...ans('じゅぎょうは{9時|くじ}から{12時|じゅうにじ}までです。'), 'じゅぎょうは9じから12じまでです。'], hint: 'じゅぎょう, から, まで' },
        { q: 'Hôm nay là thứ mấy?', answers: ans('{今日|きょう}はなんようびですか。', '{今日|きょう}は{何曜日|なんようび}ですか。'), hint: '今日, なんようび' },
        { q: 'Ngày mai là thứ Sáu.', answers: ans('あしたはきんようびです。', 'あしたは{金曜日|きんようび}です。', '{明日|あした}はきんようびです。', '{明日|あした}は{金曜日|きんようび}です。'), hint: 'あした, きんようび' },
        { q: 'Kỳ thi vào ngày 8 tháng 7.', answers: [...ans('しけんは{7月|しちがつ}{8日|ようか}です。'), 'しけんは7がつようかです。', 'しけんは7月ようかです。'], hint: 'しけん, 7月, 8日 (ようか)' },
        { q: 'Sinh nhật của bạn là ngày mấy tháng mấy?', answers: ans('たんじょうびは{何月|なんがつ}{何日|なんにち}ですか。', 'おたんじょうびは{何月|なんがつ}{何日|なんにち}ですか。'), hint: 'たんじょうび, 何月, 何日' },
        { q: 'Sinh nhật tôi là ngày 1 tháng 4.', answers: [...ans('わたしのたんじょうびは{4月|しがつ}{1日|ついたち}です。', 'たんじょうびは{4月|しがつ}{1日|ついたち}です。'), 'わたしのたんじょうびは4がつついたちです。', 'わたしのたんじょうびは4月ついたちです。'], hint: 'たんじょうび, 4月, 1日 (ついたち)' },
        { q: 'Ngân hàng mở từ mấy giờ đến mấy giờ?', answers: ans('ぎんこうは{何時|なんじ}から{何時|なんじ}までですか。'), hint: 'ぎんこう, 何時, から, まで' },
        { q: 'Ngày nghỉ là Chủ nhật.', answers: ans('{休|やす}みはにちようびです。', '{休|やす}みは{日曜日|にちようび}です。'), hint: '休み, にちようび' },
        { q: 'Cuộc họp vào chiều thứ Tư.', answers: ans('かいぎはすいようびの{午後|ごご}です。', 'かいぎは{水曜日|すいようび}の{午後|ごご}です。'), hint: 'かいぎ, すいようび, の, 午後' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-bt-chon',
      title: 'Chọn từ / cách đọc đúng',
      items: [
        { q: 'じゅぎょうは{9時|くじ} ___ です。（bắt đầu từ 9 giờ）', options: ['まで', 'から', 'の', 'と'], correct: 1, why: 'Mốc bắt đầu → から.' },
        { q: 'としょかんは{午後|ごご}{7時|しちじ} ___ です。（mở đến 7 giờ tối）', options: ['から', 'まで', 'ごろ', 'の'], correct: 1, why: 'Mốc kết thúc → まで.' },
        { q: '{今日|きょう}は ___ ですか。——{15日|じゅうごにち}です。', options: ['{何時|なんじ}', 'なんようび', '{何日|なんにち}', '{何月|なんがつ}'], correct: 2, why: 'Trả lời là ngày → 何日.' },
        { q: 'しけんは ___ ですか。——かようびです。', options: ['なんようび', '{何日|なんにち}', '{何時|なんじ}', 'いくら'], correct: 0, why: 'Trả lời là thứ → なんようび.' },
        { q: '9:00 đọc là:', options: ['きゅうじ', 'くじ', 'きゅじ', 'ここのじ'], correct: 1, why: '9時 = くじ.' },
        { q: '4:30 đọc là:', options: ['よんじはん', 'よじはん', 'しじはん', 'よじさんじゅうふん'], correct: 1, why: '4時半 = よじはん. (Cách dài: よじさんじゅっぷん.)' },
        { q: '3 phút đọc là:', options: ['さんふん', 'さんぷん', 'さっぷん', 'みっぷん'], correct: 1, why: '3分 = さんぷん.' },
        { q: 'Ngày 3 đọc là:', options: ['さんにち', 'みっか', 'みか', 'みっつ'], correct: 1, why: '3日 = みっか.' },
        { q: 'Ngày 14 đọc là:', options: ['じゅうよんにち', 'じゅうよっか', 'じゅうしにち', 'じゅうようか'], correct: 1, why: '14日 = じゅうよっか (giống 4日 = よっか).' },
        { q: 'Tháng 9 đọc là:', options: ['きゅうがつ', 'くがつ', 'くげつ', 'ここのがつ'], correct: 1, why: '9月 = くがつ.' },
        { q: '"Sáng thứ Bảy":', options: ['どようびのあさ', 'あさのどようび', 'どようびあさ', 'あさどようびの'], correct: 0, why: 'Thứ → の → buổi: どようびのあさ.' },
        { q: '"10 giờ đêm" (cách nói thường ngày):', options: ['{午前|ごぜん}{10時|じゅうじ}', 'ばん{10時|じゅうじ}', '{10時|じゅうじ}ばん', 'あさ{10時|じゅうじ}'], correct: 1, why: 'Buổi đứng trước giờ: ばん10時 (hoặc 午後10時).' },
      ],
    },
    {
      t: 'build',
      id: 'b4-bt-ghep',
      title: 'Ghép câu — hỏi và đáp',
      items: [
        { vi: 'Bây giờ là 7 giờ 15 sáng.', chips: ['{今|いま}', '{午前|ごぜん}', '{7時|しちじ}', '{15分|じゅうごふん}', 'です。', '{午後|ごご}'], answer: ['{今|いま}', '{午前|ごぜん}', '{7時|しちじ}', '{15分|じゅうごふん}', 'です。'], ro: 'Ima gozen shichiji jūgofun desu.' },
        { vi: 'Bưu điện mở đến 5 giờ.', chips: ['ゆうびんきょくは', '{5時|ごじ}', 'まで', 'です。', 'から'], answer: ['ゆうびんきょくは', '{5時|ごじ}', 'まで', 'です。'], ro: 'Yūbinkyoku wa goji made desu.' },
        { vi: 'Lớp học từ thứ Hai đến thứ Sáu.', chips: ['じゅぎょうは', 'げつようび', 'から', 'きんようび', 'まで', 'です。'], answer: ['じゅぎょうは', 'げつようび', 'から', 'きんようび', 'まで', 'です。'], ro: 'Jugyō wa getsuyōbi kara kin\'yōbi made desu.' },
        { vi: 'Hôm nay là ngày 20 tháng 6.', chips: ['{今日|きょう}は', '{6月|ろくがつ}', 'はつか', 'です。', 'ふつか'], answer: ['{今日|きょう}は', '{6月|ろくがつ}', 'はつか', 'です。'], ro: 'Kyō wa rokugatsu hatsuka desu.' },
        { vi: 'Thư viện nghỉ thứ mấy?', chips: ['としょかんの', '{休|やす}みは', 'なんようび', 'ですか。', '{何時|なんじ}'], answer: ['としょかんの', '{休|やす}みは', 'なんようび', 'ですか。'], ro: 'Toshokan no yasumi wa nan\'yōbi desu ka.' },
        { vi: 'Ca làm thêm của tôi từ 6 giờ tối.', chips: ['わたしの', 'アルバイトは', 'ばん', '{6時|ろくじ}', 'から', 'です。'], answer: ['わたしの', 'アルバイトは', 'ばん', '{6時|ろくじ}', 'から', 'です。'], ro: 'Watashi no arubaito wa ban rokuji kara desu.' },
      ],
    },
    {
      t: 'passage',
      title: 'Đọc hiểu — さくらとしょかんのおしらせ (Thông báo của thư viện Sakura)',
      intro: 'Lan chụp tấm thông báo ở cửa thư viện và nhắn cho Kim. Đọc thông báo và tin nhắn, rồi trả lời câu hỏi.',
      paras: [
        { label: 'Thông báo', text: 'さくらとしょかん　げつようび〜きんようび：{午前|ごぜん}{9時|くじ}〜{午後|ごご}{8時|はちじ}　どようび・にちようび：{午前|ごぜん}{10時|じゅうじ}〜{午後|ごご}{5時|ごじ}　{休|やす}み：すいようび　＊{8月|はちがつ}{13日|じゅうさんにち}〜{8月|はちがつ}{16日|じゅうろくにち}は{休|やす}みです。' },
        { label: 'Tin nhắn', text: 'キムさん、さくらとしょかんのおしらせです。としょかんはげつようびからきんようびまで、{午後|ごご}{8時|はちじ}までです。でも、すいようびは{休|やす}みです。あしたはどようびです。{10時|じゅうじ}からです。{10時半|じゅうじはん}ごろ、としょかんの{前|まえ}でどうですか。' },
      ],
    },
    {
      t: 'note',
      title: 'Bản dịch & từ mới (xem sau khi làm)',
      items: [
        '**Thông báo**: Thư viện Sakura. Thứ Hai – thứ Sáu: 9:00 sáng – 8:00 tối. Thứ Bảy, Chủ nhật: 10:00 sáng – 5:00 chiều. Ngày nghỉ: thứ Tư. *Từ 13/8 đến 16/8 thư viện nghỉ.',
        '**Tin nhắn**: Kim ơi, đây là thông báo của thư viện Sakura. Thư viện từ thứ Hai đến thứ Sáu mở đến 8 giờ tối. Nhưng thứ Tư nghỉ. Mai là thứ Bảy. (Mở) từ 10 giờ. Khoảng 10 rưỡi, (gặp nhau) trước cửa thư viện được không?',
        'Từ mới: **おしらせ** = thông báo · **でも** = nhưng · **〜** đọc là から…まで · **{前|まえ}で** = ở phía trước (Bài 6, 10) · **どうですか** = thế nào? (rủ rê nhẹ nhàng).',
      ],
    },
    {
      t: 'mcq',
      id: 'b4-bt-doc',
      title: 'Câu hỏi đọc hiểu',
      items: [
        { q: 'Thứ Năm thư viện đóng cửa lúc mấy giờ?', options: ['5 giờ chiều', '8 giờ tối', '9 giờ sáng', 'Thứ Năm nghỉ'], correct: 1, why: 'げつようび〜きんようび：午前9時〜午後8時. Thứ Năm nằm trong khoảng đó.' },
        { q: 'Thư viện nghỉ vào thứ mấy?', options: ['thứ Hai', 'thứ Tư', 'thứ Bảy', 'Chủ nhật'], correct: 1, why: '休み：すいようび.' },
        { q: 'Chủ nhật thư viện mở từ mấy giờ?', options: ['9:00', '10:00', '10:30', '5:00'], correct: 1, why: 'どようび・にちようび：午前10時〜.' },
        { q: 'Ngày 15/8 (thứ Năm) thư viện có mở không?', options: ['Có, 9:00–20:00', 'Có, 10:00–17:00', 'Không, nghỉ', 'Chỉ mở buổi sáng'], correct: 2, why: '8月13日〜8月16日は休み — 15/8 nằm trong khoảng nghỉ.' },
        { q: 'Lan rủ Kim gặp nhau lúc mấy giờ, ở đâu?', options: ['10:00, trong thư viện', 'Khoảng 10:30, trước thư viện', '10:30, ở nhà ga', '8:00 tối, trước thư viện'], correct: 1, why: '10時半ごろ、としょかんの前で — khoảng 10 rưỡi, trước thư viện.' },
      ],
    },
  ],
};

export const BAI_4: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
