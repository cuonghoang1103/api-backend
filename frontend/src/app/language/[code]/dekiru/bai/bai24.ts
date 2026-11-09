/**
 * Bài 24 — 会社訪問 (Thăm công ty) · TIẾP SAU SÁCH, cấp N4 (xem ../SOAN-BAI.md mục 8). Bài thứ tư của chặng 21–25
 * (Bài 25 = thi thử N4).
 * Người học đã xong Bài 1–15 (ポイント 1–124), Bài 16 (thể khả năng, thể ý chí, ～つもり, ～予定; từ 敬語 — "học bài bản ở Bài
 * 24"), Bài 17 (～ば, ～なら, ～し, ～すぎる, ～やすい・にくい), Bài 18 (～てあげる・くれる・もらう, ～ていただけませんか, ～ておく,
 * ～てある — ～てさしあげる / ～てくださる để Bài 24), Bài 19 (～てしまう, ～てみる, ～ところ, ～のに), Bài 20 (～そう, ～ようだ・
 * みたい, ～らしい, ～かもしれない, ～はず), Bài 21 (～ために, ～ように, ～ようになる・する, ～ことにする・なる), Bài 22 (thể bị
 * động 受身形, ～ばかり — "kính ngữ dạng られる để Bài 24") và Bài 23 (thể sai khiến, ～させていただけませんか, mệnh lệnh,
 * ～ように言う). KHÔNG dạy lại — chỉ dùng lại trong câu (ghi "ôn: Bài X").
 *
 * Ngữ pháp (N4) — "nói với người trên, với khách, với công ty": ① KÍNH NGỮ là gì — 3 loại (尊敬語・謙譲語・丁寧語), bảng
 * "AI làm → dùng loại nào", うち・そと (nói về sếp mình với khách) · ② 尊敬語: お＋Vます＋になる ／ ご＋N＋になる · ③ 尊敬語
 * động từ ĐẶC BIỆT (いらっしゃる・おいでになる・おっしゃる・召し上がる・ご覧になる・なさる・くださる・ご存じだ・お休みになる)
 * + bẫy chia ます (いらっしゃいます, không ～ります) · ④ 尊敬語 V(ら)れる (cùng hình bị động — ôn Bài 22) · ⑤ お～ください ／
 * ご～ください (lời mời, chỉ dẫn lịch sự) · ⑥ 謙譲語: お＋Vます＋する／いたす ／ ご＋N＋する／いたす · ⑦ 謙譲語 động từ ĐẶC
 * BIỆT (参る・申す・申し上げる・いたす・伺う・拝見する・いただく・おる・存じる・お目にかかる・差し上げる) + ～てさしあげる,
 * ～てくださる + ～させていただく (NHẬN RA — ôn Bài 23) · ⑧ 丁寧語 mức cao: でございます・ございます + bảng từ lịch sự (よろしい・
 * 少々・ただいま・先ほど・後ほど・本日・どちら様…) + お／ご (美化語) · ⑨ câu hỏi LỒNG: 疑問詞 ＋ 普通形 ＋ か · ⑩ ～かどうか.
 * Có BẢNG TỔNG HỢP 3 loại kính ngữ, BẢNG động từ đặc biệt đủ, BẢNG "ai làm → dùng loại nào", bảng lỗi người Việt hay mắc
 * (dùng tôn kính cho bản thân, いらっしゃります, お見になる, 二重敬語, gọi sếp mình là 森課長 với khách…).
 * Từ vựng: 48 từ N4 (một số N3 có ghi cấp): công ty & con người, động từ tôn kính đặc biệt, động từ khiêm nhường đặc biệt, gọi
 * điện & tiếp khách, từ lịch sự & phỏng vấn. Từ đã học ở Bài 1–23 (受付, 部長, 担当する, 面接, 履歴書, 敬語, お客様, 就職する,
 * 応募する, 連絡する, 予約する, 都合, 案内する, 戻る, 掛ける, 出張する, 会議, 相談する, 上司, 部下, 申し訳ありません,
 * いらっしゃいませ…) KHÔNG lặp lại — gặp trong câu thì coi như ôn.
 * Chữ Hán mới (15): 訪 敬 尊 存 伺 拝 召 課 係 担 談 職 紹 介 応 (N3 theo các bảng tham khảo phổ biến; 伺・拝・召 có bảng xếp
 * N2, 課 có bảng xếp N4 — JLPT không công bố danh sách chữ chính thức) — không trùng hanTu.ts, hanTu16–23.ts, hanLop.ts, bảng
 * chữ Bài 1–23. Thẻ chữ Hán: hanTu24.ts (HAN_TU_24).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木 ·
 * nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, 小林店長.
 * {本田先生|ほんだせんせい} (nam, role 'examiner' / ja-nam) — giáo viên tiếng Nhật của lớp.
 * {鈴木|すずき} (nữ, role 'c' / ja-nu) — chị khoá trên từng làm thêm cùng ワン (Bài 16: "sang năm đi làm"); từ tháng 4 năm
 * nay là nhân viên mới của công ty phần mềm さくらシステム.
 * Nối tiếp các bài trước: ワン định đi làm ở Nhật sau khi tốt nghiệp (Bài 16) — nay xin thực tập; マルコ định về nước làm giáo
 * viên tiếng Nhật (Bài 16) — nay chuẩn bị thi hùng biện.
 * Người MỚI của bài này:
 *  - {森課長|もりかちょう} — trưởng phòng (課長) thuộc phòng nhân sự (人事部) của さくらシステム — nam, role 'examiner' / ja-nam.
 *  - {受付|うけつけ}の{人|ひと} của さくらシステム (hội thoại ①, ②) — nữ, role 'c' / ja-nu.
 *  - {田村|たむら} — nhân viên công ty khách hàng 東京商事 (hội thoại ③′) — nam, role 'b' / ja-nam.
 *  - {社長|しゃちょう} (nghe Bài 4) — nam, ja-nam · {係|かかり}の{人|ひと} ở hội chợ việc làm (nghe Bài 2) — nữ, ja-nu.
 * Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam. Nghe: 'ja-nu' = nữ, 'ja-nam' = nam.
 * Hình: tên trong scripts/hinh/fluent-catalog.json (Fluent Emoji).
 */
import type { Block, Ex, Lesson } from '@/components/sach-hoc/types';

const E = (en: string, ro: string, vi: string): Ex => ({ en, ro, vi });

/**
 * Đáp án gõ tay: viết một lần bằng {漢字|かな}, hàm sinh đủ cách viết chữ Hán / kana
 * (máy chấm đã tự bỏ dấu câu, dấu cách và đổi chữ số toàn khổ). Phần tử đầu = dạng
 * toàn chữ Hán, là đáp án hiển thị.
 */
const V = (...xs: string[]): string[] => {
  const out = new Set<string>();
  for (const x of xs) {
    const slots = x
      .split(/(\{[^|}]+\|[^}]+\})/)
      .filter(Boolean)
      .map((p) => {
        const m = /^\{([^|}]+)\|([^}]+)\}$/.exec(p);
        return m ? [m[1], m[2]] : [p];
      });
    const n = slots.filter((s) => s.length > 1).length;
    if (n <= 8) {
      let acc = [''];
      for (const s of slots) acc = acc.flatMap((a) => s.map((c) => a + c));
      acc.forEach((a) => out.add(a));
    } else {
      out.add(slots.map((s) => s[0]).join(''));
      out.add(slots.map((s) => s[s.length - 1]).join(''));
      slots.forEach((s, i) => {
        if (s.length > 1) out.add(slots.map((t, j) => (j === i ? t[1] : t[0])).join(''));
      });
    }
  }
  return [...out];
};

type Line = [who: string, role: 'a' | 'b' | 'c' | 'examiner' | 'candidate', text: string, ro: string, vi: string];
const DL = (title: string, lines: Line[]): Block => ({
  t: 'dialogue',
  title,
  lines: lines.map(([who, role, text, ro, vi]) => ({ who, role, text, ro, vi })),
});

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b24-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 会社訪問: gọi điện hẹn lịch với công ty, đến công ty gặp phòng nhân sự, nhờ thầy xem bài ở phòng giáo viên, nghe điện thoại ngày đầu thực tập',
  goal: 'Gọi điện đến công ty, tự giới thiệu và xin gặp người phụ trách bằng khiêm nhường ngữ (〜と申します・お電話いたしました・伺いたいんですが); hiểu câu lễ tân nói bằng thể lịch sự cao (さくらシステムでございます・少々お待ちください・ただいま席を外しております); đến công ty, theo lời mời (お掛けください・召し上がってください) và trả lời phỏng vấn ngắn; nhờ thầy giáo bằng tôn kính ngữ (いらっしゃいますか・見ていただけないでしょうか); hỏi điều mình chưa biết bằng câu hỏi lồng (〜か・〜かどうか); và — khi nghe điện thoại ở công ty — nói về sếp của mình với khách đúng kiểu "うち・そと" (森はただいま外出しております).',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 24 — chủ đề: thăm công ty, gọi điện, nói với người trên (cấp N4, bài thứ tư của chặng 21–25)',
      items: [
        'Đến Nhật đủ lâu, bạn sẽ phải **gọi điện cho công ty**, **đi phỏng vấn thực tập**, **nhờ thầy cô** việc gì đó. Lúc ấy です・ます thôi là chưa đủ: người Nhật dùng **KÍNH NGỮ (敬語)** — một bộ cách nói riêng để **nâng người kia lên** hoặc **hạ mình xuống**.',
        'Ba loại: **尊敬語 (tôn kính ngữ)** — nâng hành động của NGƯỜI TRÊN / KHÁCH: {先生|せんせい}が**いらっしゃいます**, **お{待|ま}ちになります**, **{召|め}し{上|あ}がって**ください · **謙譲語 (khiêm nhường ngữ)** — hạ hành động của MÌNH: {私|わたし}が**{参|まい}ります**, **{拝見|はいけん}します**, **お{持|も}ちします** · **丁寧語 (lịch sự)** — nói trang trọng với người nghe: さくらシステム**でございます**, **{少々|しょうしょう}**お{待|ま}ちください.',
        'Thêm **câu hỏi lồng**: {何時|なんじ}に{来|く}る**か**{教|おし}えてください · {行|い}ける**かどうか**わかりません.',
        'Bốn tình huống: ① ワン gọi điện xin thực tập ở công ty さくらシステム · ② ワン đến công ty gặp anh 森 phòng nhân sự · ③ マルコ nhờ thầy 本田 xem bài hùng biện · ③′ ngày đầu thực tập, ワン nghe điện thoại của khách.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 24 bạn làm được (できる)',
      items: [
        '**① {電話|でんわ}をかける** — gọi điện đến công ty: **わたくし、{留学生|りゅうがくせい}のワンと{申|もう}します** · **インターンシップのことでお{電話|でんわ}いたしました** · **{人事部|じんじぶ}の{森課長|もりかちょう}はいらっしゃいますか** · **{何時|なんじ}ごろお{戻|もど}りになりますか**; hiểu lễ tân: **{少々|しょうしょう}お{待|ま}ちください**, **{森|もり}はただいま{席|せき}を{外|はず}しております**, **{折|お}り{返|かえ}しお{電話|でんわ}いたします**.',
        '**② {会社|かいしゃ}を{訪|たず}ねる** — ở quầy lễ tân và phòng khách: **2{時|じ}にお{約束|やくそく}しております** · **{失礼|しつれい}いたします** · **{本日|ほんじつ}はお{時間|じかん}をいただき、ありがとうございます**; hiểu lời mời: **お{掛|か}けください**, **{召|め}し{上|あ}がってください**, **{履歴書|りれきしょ}を{拝見|はいけん}します**; hỏi lại: **{週|しゅう}に{何日|なんにち}{来|く}ればいいか、{教|おし}えていただけませんか**.',
        '**③ {先生|せんせい}にお{願|ねが}いする** — với thầy cô: **{先生|せんせい}、{今|いま}お{時間|じかん}よろしいでしょうか** · **{見|み}ていただけないでしょうか** · **{大会|たいかい}の{日|ひ}、いらっしゃいますか**; sửa lỗi kinh điển: ~~{私|わたし}は{社長|しゃちょう}にお{会|あ}いになりました~~ → **お{目|め}にかかりました**.',
        '**③′ うち・そと** — nghe điện thoại ở công ty: **はい、さくらシステムでございます** · **{森|もり}はただいま{外出|がいしゅつ}しております** (KHÔNG nói ~~{森課長|もりかちょう}はいらっしゃいません~~) · **{伝言|でんごん}を{伝|つた}えておきます** · **{承知|しょうち}いたしました**.',
        '**できる！** — đóng vai 3 phút: gọi điện hẹn lịch thăm công ty + đến quầy lễ tân tự giới thiệu + trả lời 3 câu hỏi phỏng vấn, dùng đúng loại kính ngữ cho từng người.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — muốn nói gì, dùng mẫu nào',
      head: ['Bạn muốn nói…', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['Người trên ĐANG Ở / ĐẾN / ĐI', '{森課長|もりかちょう}はいらっしゃいますか。', 'Mori-kachou wa irasshaimasu ka.', '尊敬語 đặc biệt'],
        ['Người trên làm gì (động từ thường)', '{何時|なんじ}ごろお{戻|もど}りになりますか。', 'Nanji goro omodori ni narimasu ka.', 'お＋Vます＋になる'],
        ['Người trên làm gì (nhẹ hơn)', '{先生|せんせい}は{何時|なんじ}に{来|こ}られますか。', 'Sensei wa nanji ni koraremasu ka.', 'V(ら)れる'],
        ['Mời / chỉ dẫn khách lịch sự', 'どうぞ、お{掛|か}けください。', 'Douzo, okake kudasai.', 'お＋Vます＋ください'],
        ['MÌNH làm gì cho người trên', '{駅|えき}までお{送|おく}りします。', 'Eki made ookuri shimasu.', 'お＋Vます＋する'],
        ['MÌNH đi / nói / xem (hạ mình)', 'ワンと{申|もう}します。{明日|あした}{伺|うかが}います。', 'Wan to moushimasu. Ashita ukagaimasu.', '謙譲語 đặc biệt'],
        ['Nói trang trọng với khách', 'さくらシステムでございます。', 'Sakura Shisutemu de gozaimasu.', 'でございます'],
        ['Hỏi điều mình chưa biết (có từ để hỏi)', '{何時|なんじ}に{来|く}ればいいか、{教|おし}えてください。', 'Nanji ni kureba ii ka, oshiete kudasai.', '疑問詞 ～か'],
        ['Hỏi "có… hay không" (không có từ để hỏi)', '{行|い}けるかどうか、わかりません。', 'Ikeru ka dou ka, wakarimasen.', '～かどうか'],
      ],
    },

    /* ── ① 電話で ── */
    { t: 'h', text: '① {電話|でんわ}で — "Cho tôi xin gặp anh Mori phòng nhân sự"' },
    {
      t: 'canh',
      anh: ['woman-student', 'telephone-receiver', 'office-building', 'memo', 'calendar'],
      caption: 'Thứ Hai, 10 giờ sáng. ワン thấy tin tuyển thực tập (インターンシップ) của công ty phần mềm さくらシステム — nơi chị 鈴木 vừa vào làm từ tháng 4. Cô viết sẵn mấy câu cần nói ra giấy, hít một hơi thật sâu rồi gọi điện.',
    },
    {
      t: 'p',
      text: 'Tình huống: **ワン** gọi đến công ty. Người nghe máy đầu tiên là **lễ tân (受付)** — chị ấy nói bằng **thể lịch sự cao**: **さくらシステムでございます** (でございます = です, trang trọng hơn). ワン **hạ mình** khi nói về mình: **ワンと{申|もう}します** (= {言|い}います), **お{電話|でんわ}いたしました** (= しました), và **nâng** người mình muốn gặp: **{森課長|もりかちょう}はいらっしゃいますか** (= いますか). Nghe kỹ: lễ tân nói về sếp của chính công ty mình thì **không có さん, không có 課長**: **{森|もり}**はただいま{席|せき}を{外|はず}して**おります** (= いません) — vì đang nói với người ngoài.',
    },
    DL('Gọi điện đến công ty — "Tôi là Vương, xin gặp anh Mori"', [
      ['{受付|うけつけ}', 'c', 'はい、さくらシステムでございます。', 'Hai, Sakura Shisutemu de gozaimasu.', 'Vâng, công ty Sakura System xin nghe ạ.'],
      ['ワン', 'a', 'お{忙|いそが}しいところ{恐|おそ}れ{入|い}ります。わたくし、{留学生|りゅうがくせい}のワンと{申|もう}します。', 'Oisogashii tokoro osoreirimasu. Watakushi, ryuugakusei no Wan to moushimasu.', 'Xin lỗi đã làm phiền lúc chị đang bận. Tôi là Vương, du học sinh.'],
      ['ワン', 'a', 'インターンシップのことでお{電話|でんわ}いたしました。{人事部|じんじぶ}の{森課長|もりかちょう}はいらっしゃいますか。', 'Intaanshippu no koto de odenwa itashimashita. Jinjibu no Mori-kachou wa irasshaimasu ka.', 'Tôi gọi điện về việc thực tập. Anh Mori, trưởng phòng bên nhân sự có ở đó không ạ?'],
      ['{受付|うけつけ}', 'c', '{人事部|じんじぶ}の{森|もり}でございますね。{少々|しょうしょう}お{待|ま}ちください。', 'Jinjibu no Mori de gozaimasu ne. Shoushou omachi kudasai.', 'Anh Mori phòng nhân sự phải không ạ. Xin chị chờ một chút.'],
      ['{受付|うけつけ}', 'c', 'お{待|ま}たせいたしました。{申|もう}し{訳|わけ}ございません。{森|もり}はただいま{席|せき}を{外|はず}しております。', 'Omatase itashimashita. Moushiwake gozaimasen. Mori wa tadaima seki o hazushite orimasu.', 'Xin lỗi đã để chị chờ. Thật xin lỗi, anh Mori hiện không có ở chỗ ngồi ạ.'],
      ['ワン', 'a', 'そうですか。{何時|なんじ}ごろお{戻|もど}りになりますか。', 'Sou desu ka. Nanji goro omodori ni narimasu ka.', 'Vậy ạ. Khoảng mấy giờ anh ấy quay lại ạ?'],
      ['{受付|うけつけ}', 'c', '11{時|じ}ごろには{戻|もど}ると{思|おも}います。{戻|もど}りましたら、こちらから{折|お}り{返|かえ}しお{電話|でんわ}いたしましょうか。', 'Juuichiji goro ni wa modoru to omoimasu. Modorimashitara, kochira kara orikaeshi odenwa itashimashou ka.', 'Tôi nghĩ khoảng 11 giờ anh ấy sẽ về. Khi anh ấy về, để bên tôi gọi lại cho chị nhé?'],
      ['ワン', 'a', 'ありがとうございます。では、お{願|ねが}いいたします。{電話番号|でんわばんごう}は、090-1234-5678です。', 'Arigatou gozaimasu. Dewa, onegai itashimasu. Denwa bangou wa, zero-kyuu-zero no ichi-ni-san-yon no go-roku-nana-hachi desu.', 'Cảm ơn chị. Vậy nhờ chị ạ. Số điện thoại của tôi là 090-1234-5678.'],
      ['{受付|うけつけ}', 'c', '{確認|かくにん}いたします。090-1234-5678、ワン{様|さま}でございますね。', 'Kakunin itashimasu. Zero-kyuu-zero no ichi-ni-san-yon no go-roku-nana-hachi, Wan-sama de gozaimasu ne.', 'Tôi xin nhắc lại: 090-1234-5678, chị Vương phải không ạ.'],
      ['ワン', 'a', 'はい、そうです。よろしくお{願|ねが}いいたします。{失礼|しつれい}いたします。', 'Hai, sou desu. Yoroshiku onegai itashimasu. Shitsurei itashimasu.', 'Vâng, đúng ạ. Nhờ chị giúp. Xin phép chị ạ.'],
      ['{受付|うけつけ}', 'c', '{失礼|しつれい}いたします。', 'Shitsurei itashimasu.', 'Chào chị ạ.'],
    ]),
    DL('①′ 11 giờ — anh 森 gọi lại', [
      ['ワン', 'a', 'はい、ワンです。', 'Hai, Wan desu.', 'Vâng, Vương nghe ạ.'],
      ['{森課長|もりかちょう}', 'examiner', 'さくらシステム{人事部|じんじぶ}の{森|もり}です。{先|さき}ほどはお{電話|でんわ}をいただいたそうで、{失礼|しつれい}しました。', 'Sakura Shisutemu jinjibu no Mori desu. Sakihodo wa odenwa o itadaita sou de, shitsurei shimashita.', 'Tôi là Mori, phòng nhân sự công ty Sakura System. Nghe nói lúc nãy chị có gọi điện, xin lỗi vì đã không nghe máy được.'],
      ['ワン', 'a', 'こちらこそ、お{忙|いそが}しいところ、ありがとうございます。インターンシップについて{伺|うかが}いたいことがあって、お{電話|でんわ}いたしました。', 'Kochira koso, oisogashii tokoro, arigatou gozaimasu. Intaanshippu ni tsuite ukagaitai koto ga atte, odenwa itashimashita.', 'Chính tôi mới phải cảm ơn anh đã gọi lại lúc đang bận. Tôi có điều muốn hỏi về chương trình thực tập nên đã gọi điện ạ.'],
      ['{森課長|もりかちょう}', 'examiner', 'はい、どうぞ。', 'Hai, douzo.', 'Vâng, chị cứ hỏi.'],
      ['ワン', 'a', '{留学生|りゅうがくせい}でも{応募|おうぼ}できるかどうか、{教|おし}えていただけませんか。', 'Ryuugakusei demo oubo dekiru ka dou ka, oshiete itadakemasen ka.', 'Anh có thể cho tôi biết du học sinh có ứng tuyển được hay không ạ?'],
      ['{森課長|もりかちょう}', 'examiner', 'もちろんできますよ。{一度|いちど}お{会|あ}いして、お{話|はなし}を{伺|うかが}いたいので、{会社|かいしゃ}に{来|き}ていただけますか。', 'Mochiron dekimasu yo. Ichido oai shite, ohanashi o ukagaitai node, kaisha ni kite itadakemasu ka.', 'Tất nhiên là được. Tôi muốn gặp và nghe chị nói chuyện một lần, chị đến công ty được không?'],
      ['ワン', 'a', 'はい、ぜひ{伺|うかが}いたいです。いつがよろしいでしょうか。', 'Hai, zehi ukagaitai desu. Itsu ga yoroshii deshou ka.', 'Vâng, tôi rất muốn đến ạ. Khi nào thì tiện cho anh ạ?'],
      ['{森課長|もりかちょう}', 'examiner', 'そうですね。{来週|らいしゅう}の{水曜日|すいようび}の{午後|ごご}2{時|じ}は、ご{都合|つごう}いかがですか。', 'Sou desu ne. Raishuu no suiyoubi no gogo niji wa, gotsugou ikaga desu ka.', 'Để xem. 2 giờ chiều thứ Tư tuần sau, chị thấy có tiện không?'],
      ['ワン', 'a', '{大丈夫|だいじょうぶ}です。{水曜日|すいようび}の2{時|じ}に{伺|うかが}います。{何|なに}を{持|も}っていけばよろしいでしょうか。', 'Daijoubu desu. Suiyoubi no niji ni ukagaimasu. Nani o motte ikeba yoroshii deshou ka.', 'Được ạ. Tôi sẽ đến lúc 2 giờ thứ Tư. Tôi nên mang theo những gì ạ?'],
      ['{森課長|もりかちょう}', 'examiner', '{履歴書|りれきしょ}を{一部|いちぶ}お{持|も}ちください。{受付|うけつけ}で{私|わたし}の{名前|なまえ}をおっしゃってください。', 'Rirekisho o ichibu omochi kudasai. Uketsuke de watashi no namae o osshatte kudasai.', 'Chị mang theo một bản sơ yếu lý lịch. Ở quầy lễ tân, chị cứ nói tên tôi.'],
      ['ワン', 'a', 'かしこまりました。では、{来週|らいしゅう}の{水曜日|すいようび}、よろしくお{願|ねが}いいたします。', 'Kashikomarimashita. Dewa, raishuu no suiyoubi, yoroshiku onegai itashimasu.', 'Tôi rõ rồi ạ. Vậy thứ Tư tuần sau, mong anh giúp đỡ.'],
      ['{森課長|もりかちょう}', 'examiner', 'はい、お{待|ま}ちしております。', 'Hai, omachi shite orimasu.', 'Vâng, tôi sẽ chờ chị.'],
    ]),
    {
      t: 'examples',
      items: [
        E('わたくし、{留学生|りゅうがくせい}のワンと{申|もう}します。', 'Watakushi, ryuugakusei no Wan to moushimasu.', 'Tôi là Vương, du học sinh. (申す — khiêm nhường của 言う)'),
        E('{人事部|じんじぶ}の{森課長|もりかちょう}はいらっしゃいますか。', 'Jinjibu no Mori-kachou wa irasshaimasu ka.', 'Anh Mori phòng nhân sự có ở đó không ạ? (いらっしゃる — tôn kính của いる)'),
        E('{少々|しょうしょう}お{待|ま}ちください。', 'Shoushou omachi kudasai.', 'Xin vui lòng chờ một chút. (お～ください)'),
        E('{森|もり}はただいま{席|せき}を{外|はず}しております。', 'Mori wa tadaima seki o hazushite orimasu.', 'Anh Mori hiện không có ở chỗ ngồi. (おる — khiêm nhường của いる; nói về người công ty mình)'),
        E('{何時|なんじ}ごろお{戻|もど}りになりますか。', 'Nanji goro omodori ni narimasu ka.', 'Khoảng mấy giờ anh ấy quay lại? (お～になる)'),
        E('{戻|もど}りましたら、{折|お}り{返|かえ}しお{電話|でんわ}いたします。', 'Modorimashitara, orikaeshi odenwa itashimasu.', 'Khi anh ấy về, chúng tôi sẽ gọi lại. (お～いたす)'),
        E('{留学生|りゅうがくせい}でも{応募|おうぼ}できるかどうか、{教|おし}えていただけませんか。', 'Ryuugakusei demo oubo dekiru ka dou ka, oshiete itadakemasen ka.', 'Anh cho tôi biết du học sinh có ứng tuyển được không ạ? (～かどうか)'),
        E('{水曜日|すいようび}の2{時|じ}に{伺|うかが}います。', 'Suiyoubi no niji ni ukagaimasu.', 'Tôi sẽ đến (chỗ anh) lúc 2 giờ thứ Tư. (伺う — khiêm nhường của 行く／訪ねる)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ① và ①′',
      items: [
        '**さくらシステムでございます** — **でございます** = です ở mức lịch sự cao nhất; câu chuẩn khi nhấc máy ở công ty, khách sạn, cửa hàng (ôn: Bài 17 có さくらホテルでございます). Khách gọi đến thì mở đầu: **お{忙|いそが}しいところ{恐|おそ}れ{入|い}ります** ("xin lỗi đã làm phiền lúc anh/chị đang bận").',
        '**わたくし** — cách xưng "tôi" trang trọng (cùng chữ {私|わたし}). **～と{申|もう}します** = ～と{言|い}います (khiêm nhường). Gọi điện / phỏng vấn / gặp khách: luôn **わたくし、～と{申|もう}します**.',
        '**お{電話|でんわ}いたしました** — **いたす** = する (khiêm nhường) → **お{電話|でんわ}いたします／いたしました**. {電話|でんわ} là từ Hán nhưng đi với **お** (ngoại lệ — không phải ~~ご{電話|でんわ}~~).',
        '**{森課長|もりかちょう}はいらっしゃいますか** — ワン là người NGOÀI nên nâng anh 森: tên + chức vụ (森課長 — không thêm さん sau chức vụ) + **いらっしゃる** (いる・{行|い}く・{来|く}る tôn kính). ⚠ Lễ tân thì nói **{森|もり}でございますね**, **{森|もり}はただいま…おります** — chị ấy là người TRONG công ty, đang nói với người ngoài, nên **hạ** sếp mình xuống: không さん, không 課長, dùng khiêm nhường **おる**. Đây là quy tắc **うち・そと** — học ở Ngữ pháp ①.',
        '**{席|せき}を{外|はず}しております** — {席|せき}を{外|はず}す = rời khỏi chỗ ngồi (một lúc, vẫn trong công ty). Khác **{外出|がいしゅつ}しております** = đi ra ngoài công ty. **{折|お}り{返|かえ}しお{電話|でんわ}いたします** = sẽ gọi lại ngay (gọi ngược lại cho người vừa gọi).',
        '**お{戻|もど}りになりますか** — {戻|もど}る → **お{戻|もど}り**(ます bỏ ます)**になる** = tôn kính "quay lại". ワン nói về anh 森 (người ngoài nhóm mình, người trên) nên dùng tôn kính. **{伺|うかが}う** — khiêm nhường của "hỏi" ({伺|うかが}いたいこと = điều muốn hỏi) và của "đến chỗ người trên" ({水曜日|すいようび}に{伺|うかが}います).',
        '**ご{都合|つごう}いかがですか** — {都合|つごう} (Bài 16) + ご (美化語) + いかが (= どう, lịch sự). **よろしいでしょうか** = いいですか, lịch sự cao. **かしこまりました** = わかりました (khi nhận lời khách / người trên). **お{待|ま}ちしております** = {待|ま}っています (khiêm nhường お～する + おる).',
      ],
    },

    /* ── ② 会社で ── */
    { t: 'h', text: '② {会社|かいしゃ}で — "Hôm nay cảm ơn anh đã dành thời gian"' },
    {
      t: 'canh',
      anh: ['office-building', 'woman-tipping-hand', 'elevator', 'couch-and-lamp', 'teacup-without-handle'],
      caption: 'Thứ Tư tuần sau, 1 giờ 50 chiều. ワン mặc vest, cầm tập hồ sơ, bước vào sảnh toà nhà của さくらシステム. Quầy lễ tân ở ngay bên trái thang máy.',
    },
    {
      t: 'p',
      text: 'Tình huống: ワン đến sớm 10 phút (đúng phép lịch sự Nhật: không muộn, cũng không quá sớm). Lễ tân **dẫn đường** bằng khiêm nhường **ご{案内|あんない}いたします**, **mời** bằng **お～ください** (お{書|か}きください, お{待|ま}ちください). Ở **phòng tiếp khách (応接室)**, anh **森** và chị **鈴木** — chị khoá trên của ワン, nay là nhân viên mới của công ty — tiếp cô. Nghe kỹ những câu anh 森 nâng ワン là khách: **お{掛|か}けください**, **{召|め}し{上|あ}がってください** (= {食|た}べて／{飲|の}んでください), **{日本|にほん}に{来|こ}られて** (tôn kính dạng られる), **{選|えら}ばれた** — và câu ワン hạ mình: **{失礼|しつれい}いたします**, **いただきます**, **{伺|うかが}ってもよろしいでしょうか**.',
    },
    DL('Ở quầy lễ tân', [
      ['ワン', 'a', 'すみません。{人事部|じんじぶ}の{森課長|もりかちょう}と2{時|じ}にお{約束|やくそく}しております、ワンと{申|もう}します。', 'Sumimasen. Jinjibu no Mori-kachou to niji ni oyakusoku shite orimasu, Wan to moushimasu.', 'Xin lỗi. Tôi là Vương, có hẹn với anh Mori phòng nhân sự lúc 2 giờ ạ.'],
      ['{受付|うけつけ}', 'c', 'ワン{様|さま}ですね。お{待|ま}ちしておりました。こちらにお{名前|なまえ}をお{書|か}きください。', 'Wan-sama desu ne. Omachi shite orimashita. Kochira ni onamae o okaki kudasai.', 'Chị Vương phải không ạ. Chúng tôi đang chờ chị. Xin chị viết tên vào đây ạ.'],
      ['ワン', 'a', 'はい。……これでよろしいでしょうか。', 'Hai. …… Kore de yoroshii deshou ka.', 'Vâng. … Thế này được chưa ạ?'],
      ['{受付|うけつけ}', 'c', 'はい、ありがとうございます。では、5{階|かい}の{応接室|おうせつしつ}にご{案内|あんない}いたします。エレベーターはこちらでございます。', 'Hai, arigatou gozaimasu. Dewa, gokai no ousetsushitsu ni goannai itashimasu. Erebeetaa wa kochira de gozaimasu.', 'Vâng, cảm ơn chị. Vậy tôi xin dẫn chị lên phòng tiếp khách tầng 5. Thang máy ở lối này ạ.'],
      ['{受付|うけつけ}', 'c', 'どうぞ、こちらでお{待|ま}ちください。{森|もり}はすぐに{参|まい}ります。', 'Douzo, kochira de omachi kudasai. Mori wa sugu ni mairimasu.', 'Mời chị ngồi chờ ở đây. Anh Mori sẽ đến ngay ạ.'],
      ['ワン', 'a', 'ありがとうございます。', 'Arigatou gozaimasu.', 'Cảm ơn chị ạ.'],
    ]),
    DL('②′ Trong phòng tiếp khách', [
      ['{森課長|もりかちょう}', 'examiner', 'ワンさん、お{待|ま}たせしました。{人事部|じんじぶ}の{森|もり}です。どうぞ、お{掛|か}けください。', 'Wan-san, omatase shimashita. Jinjibu no Mori desu. Douzo, okake kudasai.', 'Chị Vương, xin lỗi đã để chị chờ. Tôi là Mori phòng nhân sự. Mời chị ngồi.'],
      ['ワン', 'a', '{失礼|しつれい}いたします。{本日|ほんじつ}はお{忙|いそが}しいところ、お{時間|じかん}をいただき、ありがとうございます。', 'Shitsurei itashimasu. Honjitsu wa oisogashii tokoro, ojikan o itadaki, arigatou gozaimasu.', 'Tôi xin phép ạ. Hôm nay cảm ơn anh đã dành thời gian cho tôi dù đang bận.'],
      ['{鈴木|すずき}', 'c', 'ワンさん、ようこそ。お{茶|ちゃ}をどうぞ。', 'Wan-san, youkoso. Ocha o douzo.', 'Vương, chào mừng em. Mời em dùng trà.'],
      ['ワン', 'a', 'あ、{鈴木|すずき}さん！ありがとうございます。', 'A, Suzuki-san! Arigatou gozaimasu.', 'Ôi, chị Suzuki! Em cảm ơn chị.'],
      ['{森課長|もりかちょう}', 'examiner', '{鈴木|すずき}さんから、お{話|はなし}は{聞|き}いていますよ。どうぞ、{召|め}し{上|あ}がってください。', 'Suzuki-san kara, ohanashi wa kiite imasu yo. Douzo, meshiagatte kudasai.', 'Tôi đã nghe chị Suzuki kể về chị rồi. Mời chị dùng trà.'],
      ['ワン', 'a', 'では、いただきます。……あのう、こちらが{履歴書|りれきしょ}です。', 'Dewa, itadakimasu. …… Anou, kochira ga rirekisho desu.', 'Vậy tôi xin phép ạ. … À, đây là sơ yếu lý lịch của tôi.'],
      ['{森課長|もりかちょう}', 'examiner', 'ありがとうございます。{拝見|はいけん}します。……ワンさんは、{日本|にほん}に{来|こ}られて{何年|なんねん}になりますか。', 'Arigatou gozaimasu. Haiken shimasu. …… Wan-san wa, Nihon ni korarete nannen ni narimasu ka.', 'Cảm ơn chị. Tôi xin phép xem. … Chị Vương sang Nhật được mấy năm rồi?'],
      ['ワン', 'a', '3{年|ねん}になります。', 'Sannen ni narimasu.', 'Được 3 năm rồi ạ.'],
      ['{森課長|もりかちょう}', 'examiner', 'そうですか。どうしてうちの{会社|かいしゃ}を{選|えら}ばれたんですか。', 'Sou desu ka. Doushite uchi no kaisha o erabareta n desu ka.', 'Vậy à. Vì sao chị chọn công ty chúng tôi?'],
      ['ワン', 'a', '{鈴木|すずき}さんに、こちらの{会社|かいしゃ}のアプリを{紹介|しょうかい}していただいて、とても{使|つか}いやすいと{思|おも}ったからです。わたくしも、こういうアプリを{作|つく}る{仕事|しごと}がしたいです。', 'Suzuki-san ni, kochira no kaisha no apuri o shoukai shite itadaite, totemo tsukaiyasui to omotta kara desu. Watakushi mo, kou iu apuri o tsukuru shigoto ga shitai desu.', 'Vì tôi được chị Suzuki giới thiệu ứng dụng của quý công ty và thấy rất dễ dùng. Tôi cũng muốn làm công việc tạo ra những ứng dụng như vậy.'],
      ['{森課長|もりかちょう}', 'examiner', 'ありがとうございます。では、インターンシップでどんな{仕事|しごと}をするか、{簡単|かんたん}にご{説明|せつめい}しますね。', 'Arigatou gozaimasu. Dewa, intaanshippu de donna shigoto o suru ka, kantan ni gosetsumei shimasu ne.', 'Cảm ơn chị. Vậy tôi xin giải thích ngắn gọn khi thực tập chị sẽ làm những việc gì nhé.'],
      ['ワン', 'a', 'お{願|ねが}いします。……あのう、{一|ひと}つ{伺|うかが}ってもよろしいでしょうか。', 'Onegai shimasu. …… Anou, hitotsu ukagatte mo yoroshii deshou ka.', 'Nhờ anh ạ. … À, tôi xin phép hỏi một điều được không ạ?'],
      ['{森課長|もりかちょう}', 'examiner', 'はい、どうぞ。', 'Hai, douzo.', 'Vâng, chị cứ hỏi.'],
      ['ワン', 'a', '{大学|だいがく}の{授業|じゅぎょう}があるので、{週|しゅう}に{何日|なんにち}{来|く}ればいいか、{教|おし}えていただけませんか。', 'Daigaku no jugyou ga aru node, shuu ni nannichi kureba ii ka, oshiete itadakemasen ka.', 'Vì tôi còn giờ học ở trường, anh cho tôi biết một tuần nên đến mấy ngày được không ạ?'],
      ['{森課長|もりかちょう}', 'examiner', '{週|しゅう}3{日|みっか}で{大丈夫|だいじょうぶ}ですよ。{合格|ごうかく}かどうかは、{来週|らいしゅう}メールでお{知|し}らせします。', 'Shuu mikka de daijoubu desu yo. Goukaku ka dou ka wa, raishuu meeru de oshirase shimasu.', 'Một tuần 3 ngày là được. Chị có đạt hay không thì tuần sau tôi sẽ báo qua email.'],
      ['ワン', 'a', 'わかりました。{本日|ほんじつ}は、ありがとうございました。{失礼|しつれい}いたします。', 'Wakarimashita. Honjitsu wa, arigatou gozaimashita. Shitsurei itashimasu.', 'Tôi hiểu rồi ạ. Hôm nay cảm ơn anh rất nhiều. Tôi xin phép ạ.'],
    ]),
    {
      t: 'examples',
      items: [
        E('2{時|じ}にお{約束|やくそく}しております、ワンと{申|もう}します。', 'Niji ni oyakusoku shite orimasu, Wan to moushimasu.', 'Tôi là Vương, có hẹn lúc 2 giờ ạ. (お～する + おる)'),
        E('こちらにお{名前|なまえ}をお{書|か}きください。', 'Kochira ni onamae o okaki kudasai.', 'Xin vui lòng viết tên vào đây. (お～ください)'),
        E('5{階|かい}の{応接室|おうせつしつ}にご{案内|あんない}いたします。', 'Gokai no ousetsushitsu ni goannai itashimasu.', 'Tôi xin dẫn anh/chị lên phòng tiếp khách tầng 5. (ご～いたす)'),
        E('どうぞ、お{掛|か}けください。', 'Douzo, okake kudasai.', 'Mời anh/chị ngồi.'),
        E('どうぞ、{召|め}し{上|あ}がってください。', 'Douzo, meshiagatte kudasai.', 'Mời anh/chị dùng (ăn / uống). (召し上がる)'),
        E('{履歴書|りれきしょ}を{拝見|はいけん}します。', 'Rirekisho o haiken shimasu.', 'Tôi xin phép xem sơ yếu lý lịch. (拝見する — khiêm nhường của 見る)'),
        E('どうしてうちの{会社|かいしゃ}を{選|えら}ばれたんですか。', 'Doushite uchi no kaisha o erabareta n desu ka.', 'Vì sao anh/chị chọn công ty chúng tôi? (V(ら)れる tôn kính)'),
        E('{合格|ごうかく}かどうかは、メールでお{知|し}らせします。', 'Goukaku ka dou ka wa, meeru de oshirase shimasu.', 'Đỗ hay không, chúng tôi sẽ báo qua email. (N ＋ かどうか)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ② và ②′',
      items: [
        '**お{約束|やくそく}しております** — {約束|やくそく}する → khiêm nhường **お{約束|やくそく}する** (vì là hẹn VỚI anh 森 — việc của mình hướng tới người trên) + ～ている → **～ておる** (khiêm nhường). Câu chuẩn ở quầy lễ tân: **(người) と (giờ) にお{約束|やくそく}しております、(tên) と{申|もう}します**.',
        '**お{名前|なまえ}をお{書|か}きください** — hai chữ お khác nhau: お{名前|なまえ} là **美化語** (làm đẹp danh từ, tên của khách); お{書|か}き**ください** là **お～ください** — mời khách làm gì, lịch sự hơn {書|か}いてください.',
        '**ご{案内|あんない}いたします** — {案内|あんない}する (Bài 17) → **ご{案内|あんない}する／いたす** (khiêm nhường: mình dẫn đường cho khách). Từ Hán (漢語) đi với **ご**: ご{案内|あんない}, ご{説明|せつめい}, ご{連絡|れんらく}; từ thuần Nhật đi với **お**: お{持|も}ち, お{待|ま}ち, お{送|おく}り.',
        '**{森|もり}はすぐに{参|まい}ります** — lễ tân dùng **{参|まい}る** (khiêm nhường của {来|く}る) cho sếp mình, vì đang nói với khách. Nếu ワン nói về anh 森 thì phải là **{森課長|もりかちょう}はすぐにいらっしゃいます**.',
        '**{召|め}し{上|あ}がってください** — {召|め}し{上|あ}がる = tôn kính của **{食|た}べる・{飲|の}む**. Mời khách ăn uống: **どうぞ、{召|め}し{上|あ}がってください**. Khách đáp: **では、いただきます** (いただく — khiêm nhường của {食|た}べる・{飲|の}む・もらう).',
        '**{来|こ}られて／{選|えら}ばれた** — **V(ら)れる** dùng làm **tôn kính** (cùng hình với bị động Bài 22, cùng hình với khả năng nhóm 2). Ở đây chủ ngữ là ワン, không có "bị ai" → là tôn kính. Mức lịch sự nhẹ hơn お～になる — người phỏng vấn hay dùng với ứng viên.',
        '**{伺|うかが}ってもよろしいでしょうか** — {聞|き}いてもいいですか (Bài 15 ～てもいいですか) nâng lên mức cao nhất: **{伺|うかが}う** (hỏi — khiêm nhường) + **よろしいでしょうか** (= いいですか, lịch sự cao). **{週|しゅう}に{何日|なんにち}{来|く}ればいいか** — câu hỏi lồng (Ngữ pháp ⑨). **{合格|ごうかく}かどうか** — N + かどうか (Ngữ pháp ⑩).',
      ],
    },

    /* ── ③ 職員室で ── */
    { t: 'h', text: '③ {職員室|しょくいんしつ}で — "Thầy xem giúp em được không ạ?"' },
    {
      t: 'canh',
      anh: ['door', 'man-student', 'man-teacher', 'page-facing-up', 'studio-microphone'],
      caption: 'Giờ nghỉ trưa. マルコ cầm bản thảo bài hùng biện tiếng Nhật (スピーチ大会) tháng sau, đứng trước cửa phòng giáo viên (職員室), gõ cửa hai lần.',
    },
    {
      t: 'p',
      text: 'Tình huống: **マルコ** nhờ **thầy 本田** xem bản thảo (**{原稿|げんこう}**) bài hùng biện. Với thầy, マルコ dùng **tôn kính** cho việc của thầy (**いらっしゃいますか**, **{見|み}ていただけないでしょうか**) và **khiêm nhường** cho việc của mình. Thầy chỉ ra hai lỗi kính ngữ trong bài: viết ~~{社長|しゃちょう}が{私|わたし}の{話|はなし}を{聞|き}きました~~ (phải nâng giám đốc: **お{聞|き}きになりました**), và ~~{私|わたし}は{社長|しゃちょう}にお{会|あ}いになりました~~ — **dùng tôn kính cho chính mình**, lỗi người Việt mắc nhiều nhất. Cuối cùng マルコ hỏi thầy có đến xem được không — thầy chưa biết **{行|い}けるかどうか**.',
    },
    DL('Ở phòng giáo viên — "Thầy có thời gian không ạ?"', [
      ['マルコ', 'b', '{失礼|しつれい}します。{本田先生|ほんだせんせい}はいらっしゃいますか。', 'Shitsurei shimasu. Honda-sensei wa irasshaimasu ka.', 'Em xin phép ạ. Thầy Honda có ở đây không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'はい、マルコさん。どうしましたか。', 'Hai, Maruko-san. Dou shimashita ka.', 'Ừ, Marco. Có chuyện gì vậy?'],
      ['マルコ', 'b', '{先生|せんせい}、{今|いま}、お{時間|じかん}よろしいでしょうか。', 'Sensei, ima, ojikan yoroshii deshou ka.', 'Thầy ơi, bây giờ thầy có chút thời gian không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'ええ、いいですよ。', 'Ee, ii desu yo.', 'Ừ, được chứ.'],
      ['マルコ', 'b', '{来月|らいげつ}のスピーチ{大会|たいかい}の{原稿|げんこう}を{書|か}いたんですが、{先生|せんせい}に{見|み}ていただけないでしょうか。', 'Raigetsu no supiichi taikai no genkou o kaita n desu ga, sensei ni mite itadakenai deshou ka.', 'Em đã viết bản thảo cho cuộc thi hùng biện tháng sau, thầy có thể xem giúp em được không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'いいですよ。……うん、よく{書|か}けていますね。でも、ここ、「{社長|しゃちょう}が{私|わたし}の{話|はなし}を{聞|き}きました」は、{敬語|けいご}にしたほうがいいですね。', 'Ii desu yo. …… Un, yoku kakete imasu ne. Demo, koko, "shachou ga watashi no hanashi o kikimashita" wa, keigo ni shita hou ga ii desu ne.', 'Được thôi. … Ừm, viết tốt đấy. Nhưng chỗ này, "giám đốc đã nghe tôi nói", nên chuyển sang kính ngữ.'],
      ['マルコ', 'b', 'あ、「お{聞|き}きになりました」ですか。', 'A, "okiki ni narimashita" desu ka.', 'À, là "okiki ni narimashita" phải không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'そうです。それから、「{私|わたし}は{社長|しゃちょう}にお{会|あ}いになりました」は{間違|まちが}いですよ。', 'Sou desu. Sorekara, "watashi wa shachou ni oai ni narimashita" wa machigai desu yo.', 'Đúng rồi. Còn câu "tôi đã gặp giám đốc" viết "oai ni narimashita" là sai đấy.'],
      ['マルコ', 'b', 'えっ、どうしてですか。', 'E, doushite desu ka.', 'Ơ, sao vậy ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', '{会|あ}ったのはマルコさんでしょう？{自分|じぶん}のことには{尊敬語|そんけいご}は{使|つか}いません。「お{目|め}にかかりました」か「お{会|あ}いしました」です。', 'Atta no wa Maruko-san deshou? Jibun no koto ni wa sonkeigo wa tsukaimasen. "Ome ni kakarimashita" ka "oai shimashita" desu.', 'Người gặp là Marco mà, đúng không? Việc của chính mình thì không dùng tôn kính ngữ. Phải là "ome ni kakarimashita" hoặc "oai shimashita".'],
      ['マルコ', 'b', 'そうか……。{自分|じぶん}を{高|たか}くしてしまったんですね。{気|き}をつけます。', 'Sou ka……. Jibun o takaku shite shimatta n desu ne. Ki o tsukemasu.', 'Ra vậy… Em lỡ tự nâng mình lên rồi. Em sẽ chú ý ạ.'],
      ['マルコ', 'b', 'あのう、{先生|せんせい}は{大会|たいかい}の{日|ひ}、いらっしゃいますか。', 'Anou, sensei wa taikai no hi, irasshaimasu ka.', 'À… hôm thi thầy có đến không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', '{行|い}きたいんですが、その{日|ひ}は{会議|かいぎ}があるので、{行|い}けるかどうか、まだわからないんです。', 'Ikitai n desu ga, sono hi wa kaigi ga aru node, ikeru ka dou ka, mada wakaranai n desu.', 'Thầy muốn đi lắm, nhưng hôm đó có cuộc họp nên chưa biết có đi được hay không.'],
      ['マルコ', 'b', 'そうですか。もしお{時間|じかん}があったら、ぜひいらっしゃってください。', 'Sou desu ka. Moshi ojikan ga attara, zehi irasshatte kudasai.', 'Vậy ạ. Nếu thầy có thời gian thì nhất định thầy đến nhé ạ.'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'ありがとう。{行|い}けるかどうか、{来週|らいしゅう}までに{知|し}らせますね。', 'Arigatou. Ikeru ka dou ka, raishuu made ni shirasemasu ne.', 'Cảm ơn em. Đi được hay không, trước tuần sau thầy sẽ báo nhé.'],
      ['マルコ', 'b', 'はい。お{忙|いそが}しいところ、ありがとうございました。{失礼|しつれい}します。', 'Hai. Oisogashii tokoro, arigatou gozaimashita. Shitsurei shimasu.', 'Vâng. Cảm ơn thầy đã giúp em lúc đang bận. Em xin phép ạ.'],
    ]),
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{失礼|しつれい}します** — câu khi **bước vào** và khi **ra khỏi** phòng của người trên (gõ cửa 2–3 tiếng, mở cửa, nói {失礼|しつれい}します, cúi chào). Ra về sau khi được giúp: **お{忙|いそが}しいところ、ありがとうございました。{失礼|しつれい}します**.',
        '**{見|み}ていただけないでしょうか** — bậc thang nhờ vả (ôn Bài 18): {見|み}てくれる？ → {見|み}てください → {見|み}ていただけませんか → **{見|み}ていただけないでしょうか** (mềm nhất — dạng phủ định + でしょうか). Với thầy cô, cấp trên khi nhờ việc tốn thời gian: dùng bậc cao nhất.',
        '**お{聞|き}きになりました** — {聞|き}く → **お{聞|き}きになる** (tôn kính, chủ ngữ là giám đốc). **お{目|め}にかかりました／お{会|あ}いしました** — {会|あ}う khiêm nhường (chủ ngữ là mình). ⚠ ~~お{会|あ}いになりました~~ cho chính mình là **tự nâng mình** — nghe rất kỳ, như "tôi ngự giá đến gặp".',
        '**いらっしゃいますか** — マルコ hỏi thầy có ở phòng không (いる) và hỏi thầy có đến không ({来|く}る): cả hai đều là **いらっしゃる**. Thầy trả lời về chính mình bằng thể thường lịch sự ({行|い}きたいんですが) — người trên **không** dùng khiêm nhường với học trò.',
        '**{行|い}けるかどうか、まだわからない** — **V(普通形) ＋ かどうか** = "có … hay không" (Ngữ pháp ⑩). **ぜひいらっしゃってください** — mời người trên đến: いらっしゃる + て + ください (văn nói hay rút thành いらしてください).',
        '**{原稿|げんこう}** = bản thảo (N2 — chỉ cần hiểu) · **スピーチ{大会|たいかい}** = cuộc thi hùng biện · **{職員室|しょくいんしつ}** = phòng giáo viên (chữ 職 là chữ Hán mới của bài) · **{自分|じぶん}** = bản thân.',
      ],
    },

    {
      t: 'examples',
      items: [
        E('{失礼|しつれい}します。{本田先生|ほんだせんせい}はいらっしゃいますか。', 'Shitsurei shimasu. Honda-sensei wa irasshaimasu ka.', 'Em xin phép ạ. Thầy Honda có ở đây không ạ? (vào phòng người trên)'),
        E('{先生|せんせい}、{今|いま}、お{時間|じかん}よろしいでしょうか。', 'Sensei, ima, ojikan yoroshii deshou ka.', 'Thầy ơi, bây giờ thầy có chút thời gian không ạ? (よろしい — lịch sự của いい)'),
        E('{先生|せんせい}に{見|み}ていただけないでしょうか。', 'Sensei ni mite itadakenai deshou ka.', 'Thầy có thể xem giúp em được không ạ? (nhờ — bậc cao nhất)'),
        E('{社長|しゃちょう}が{私|わたし}の{話|はなし}をお{聞|き}きになりました。', 'Shachou ga watashi no hanashi o okiki ni narimashita.', 'Giám đốc đã nghe tôi nói. (người trên làm → お～になる)'),
        E('{社長|しゃちょう}にお{目|め}にかかりました。', 'Shachou ni ome ni kakarimashita.', 'Tôi đã được gặp giám đốc. (mình làm → khiêm nhường)'),
        E('{行|い}けるかどうか、{来週|らいしゅう}までに{知|し}らせます。', 'Ikeru ka dou ka, raishuu made ni shirasemasu.', 'Đi được hay không, trước tuần sau thầy sẽ báo. (～かどうか)'),
      ],
    },

    /* ── ③′ インターンシップ初日 ── */
    { t: 'h', text: '③′ インターンシップの{初日|しょにち} — "Anh Mori hiện đang ra ngoài ạ"' },
    {
      t: 'canh',
      anh: ['woman-office-worker', 'woman-technologist', 'telephone', 'man-office-worker', 'memo'],
      caption: 'Hai tuần sau, ワン đỗ thực tập. Ngày đầu tiên, chị 鈴木 ngồi cạnh dạy cô cách nghe điện thoại của công ty. Anh 森 vừa ra ngoài gặp khách, 3 giờ mới về.',
    },
    DL('Ngày đầu thực tập — chị 鈴木 dạy cách nghe điện thoại', [
      ['{鈴木|すずき}', 'c', 'ワンさん、{電話|でんわ}に{出|で}るときは、まず「はい、さくらシステムでございます」って{言|い}ってね。', 'Wan-san, denwa ni deru toki wa, mazu "Hai, Sakura Shisutemu de gozaimasu" tte itte ne.', 'Vương này, khi nghe điện thoại thì trước tiên em nói "Hai, Sakura Shisutemu de gozaimasu" nhé.'],
      ['ワン', 'a', 'はい。……あのう、{森課長|もりかちょう}がいないとき、「{森課長|もりかちょう}はいらっしゃいません」と{言|い}ってもいいですか。', 'Hai. …… Anou, Mori-kachou ga inai toki, "Mori-kachou wa irasshaimasen" to itte mo ii desu ka.', 'Vâng ạ. … À, khi anh Mori không có ở đây, em nói "Mori-kachou wa irasshaimasen" có được không ạ?'],
      ['{鈴木|すずき}', 'c', 'ううん、それはだめ。{会社|かいしゃ}の{外|そと}の{人|ひと}には、{自分|じぶん}の{会社|かいしゃ}の{人|ひと}を{高|たか}くしないの。「{森|もり}はただいま{外出|がいしゅつ}しております」って{言|い}うのよ。', 'Uun, sore wa dame. Kaisha no soto no hito ni wa, jibun no kaisha no hito o takaku shinai no. "Mori wa tadaima gaishutsu shite orimasu" tte iu no yo.', 'Không, thế là sai. Với người ngoài công ty, mình không nâng người trong công ty mình lên. Phải nói "Mori wa tadaima gaishutsu shite orimasu".'],
      ['ワン', 'a', '{課長|かちょう}でも「{森|もり}」ですか。「さん」も{付|つ}けないんですか。', 'Kachou demo "Mori" desu ka. "San" mo tsukenai n desu ka.', 'Là trưởng phòng mà cũng chỉ gọi "Mori" thôi ạ? Không thêm cả "san" ạ?'],
      ['{鈴木|すずき}', 'c', 'そう。それが「うち」と「そと」の{考|かんが}え{方|かた}。……あ、{電話|でんわ}。ワンさん、{出|で}てみて。', 'Sou. Sore ga "uchi" to "soto" no kangaekata. …… A, denwa. Wan-san, dete mite.', 'Đúng vậy. Đó là cách nghĩ "trong" và "ngoài". … Ơ, điện thoại kìa. Vương, em thử nghe xem.'],
      ['ワン', 'a', 'はい、さくらシステムでございます。', 'Hai, Sakura Shisutemu de gozaimasu.', 'Vâng, công ty Sakura System xin nghe ạ.'],
      ['{田村|たむら}', 'b', '{東京商事|とうきょうしょうじ}の{田村|たむら}と{申|もう}します。いつもお{世話|せわ}になっております。{森課長|もりかちょう}はいらっしゃいますか。', 'Toukyou Shouji no Tamura to moushimasu. Itsumo osewa ni natte orimasu. Mori-kachou wa irasshaimasu ka.', 'Tôi là Tamura ở công ty Tokyo Shoji. Cảm ơn quý công ty đã luôn giúp đỡ. Anh Mori có ở đó không ạ?'],
      ['ワン', 'a', 'いつもお{世話|せわ}になっております。{申|もう}し{訳|わけ}ございません。{森|もり}はただいま{外出|がいしゅつ}しております。3{時|じ}に{戻|もど}る{予定|よてい}です。', 'Itsumo osewa ni natte orimasu. Moushiwake gozaimasen. Mori wa tadaima gaishutsu shite orimasu. Sanji ni modoru yotei desu.', 'Cảm ơn anh đã luôn giúp đỡ. Thật xin lỗi, anh Mori hiện đang ra ngoài ạ. Dự kiến 3 giờ anh ấy về.'],
      ['{田村|たむら}', 'b', 'そうですか。では、{伝言|でんごん}をお{願|ねが}いできますか。', 'Sou desu ka. Dewa, dengon o onegai dekimasu ka.', 'Vậy à. Thế cho tôi nhờ nhắn lại được không?'],
      ['ワン', 'a', 'はい、どうぞ。', 'Hai, douzo.', 'Vâng, mời anh.'],
      ['{田村|たむら}', 'b', '{明日|あした}の{会議|かいぎ}の{資料|しりょう}を、{今日|きょう}{中|じゅう}にメールでお{送|おく}りします、とお{伝|つた}えください。', 'Ashita no kaigi no shiryou o, kyoujuu ni meeru de ookuri shimasu, to otsutae kudasai.', 'Nhờ chị nhắn giúp là tôi sẽ gửi tài liệu cho cuộc họp ngày mai qua email trong hôm nay.'],
      ['ワン', 'a', '{承知|しょうち}いたしました。{明日|あした}の{会議|かいぎ}の{資料|しりょう}を、{今日|きょう}{中|じゅう}にメールで{送|おく}っていただけるということですね。{森|もり}に{伝|つた}えておきます。', 'Shouchi itashimashita. Ashita no kaigi no shiryou o, kyoujuu ni meeru de okutte itadakeru to iu koto desu ne. Mori ni tsutaete okimasu.', 'Tôi đã rõ. Tức là anh sẽ gửi tài liệu cuộc họp ngày mai qua email trong hôm nay ạ. Tôi sẽ chuyển lời cho anh Mori.'],
      ['{田村|たむら}', 'b', 'よろしくお{願|ねが}いします。{失礼|しつれい}します。', 'Yoroshiku onegai shimasu. Shitsurei shimasu.', 'Nhờ chị nhé. Chào chị.'],
      ['ワン', 'a', '{東京商事|とうきょうしょうじ}の{田村様|たむらさま}ですね。{失礼|しつれい}いたします。', 'Toukyou Shouji no Tamura-sama desu ne. Shitsurei itashimasu.', 'Anh Tamura công ty Tokyo Shoji ạ. Chào anh ạ.'],
      ['{鈴木|すずき}', 'c', 'すごい！{初|はじ}めてなのに、とても{上手|じょうず}だったよ。', 'Sugoi! Hajimete na noni, totemo jouzu datta yo.', 'Giỏi quá! Lần đầu mà làm tốt lắm đấy.'],
    ]),
    {
      t: 'examples',
      items: [
        E('はい、さくらシステムでございます。', 'Hai, Sakura Shisutemu de gozaimasu.', 'Vâng, công ty Sakura System xin nghe. (でございます)'),
        E('{森|もり}はただいま{外出|がいしゅつ}しております。', 'Mori wa tadaima gaishutsu shite orimasu.', 'Anh Mori hiện đang ra ngoài. (nói với KHÁCH về sếp mình — không さん, dùng おる)'),
        E('3{時|じ}に{戻|もど}る{予定|よてい}です。', 'Sanji ni modoru yotei desu.', 'Dự kiến 3 giờ anh ấy về.'),
        E('{伝言|でんごん}をお{願|ねが}いできますか。', 'Dengon o onegai dekimasu ka.', 'Tôi nhờ nhắn lại được không?'),
        E('{承知|しょうち}いたしました。{森|もり}に{伝|つた}えておきます。', 'Shouchi itashimashita. Mori ni tsutaete okimasu.', 'Tôi đã rõ. Tôi sẽ chuyển lời cho anh Mori. (ôn: ～ておく Bài 18)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③′ — うち・そと trong công ty',
      items: [
        '**うち (trong) ↔ そと (ngoài)**: khi nói chuyện với **người ngoài công ty** (khách, đối tác), mọi người trong công ty mình — kể cả giám đốc — là "**người nhà**" ⇒ **không nâng**: gọi trống tên **{森|もり}** (không さん, không 課長), dùng **khiêm nhường** cho hành động của họ: **{森|もり}はただいま{外出|がいしゅつ}しております**, **{森|もり}がそう{申|もう}しておりました**.',
        'Khi nói **trong nội bộ** (với anh 森 hay đồng nghiệp), lại nâng sếp: **{森課長|もりかちょう}、{東京商事|とうきょうしょうじ}の{田村様|たむらさま}からお{電話|でんわ}がありました** · **{課長|かちょう}、{資料|しりょう}をご{覧|らん}になりましたか**.',
        '**いつもお{世話|せわ}になっております** — câu chào cố định giữa hai công ty (kể cả khi chưa từng gặp). Ai nói trước, người kia nói lại y nguyên. **{承知|しょうち}いたしました** ≈ かしこまりました (nhận lời — lịch sự cao, dùng nhiều trong công ty).',
        '**～ということですね** = "tức là … phải không ạ" — lặp lại lời nhắn để xác nhận, rất hay dùng khi nhận điện thoại. **{今日|きょう}{中|じゅう}に** = trong hôm nay (～{中|じゅう} — ôn {世界中|せかいじゅう} Bài 22). **{予定|よてい}です** = dự kiến (ôn Bài 16).',
      ],
    },
    {
      t: 'table',
      caption: 'Câu "cứu cánh" khi gọi điện / đến công ty — học thuộc lòng',
      head: ['Lúc nào', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['Nhấc máy ở công ty', 'はい、～でございます。', 'Hai, ~ de gozaimasu.', 'Vâng, công ty ~ xin nghe.'],
        ['Mở đầu khi gọi', 'お{忙|いそが}しいところ{恐|おそ}れ{入|い}ります。', 'Oisogashii tokoro osoreirimasu.', 'Xin lỗi đã làm phiền lúc anh/chị bận.'],
        ['Tự giới thiệu', 'わたくし、～と{申|もう}します。', 'Watakushi, ~ to moushimasu.', 'Tôi tên là ~.'],
        ['Xin gặp người', '～{様|さま}／～{課長|かちょう}はいらっしゃいますか。', '~-sama / ~-kachou wa irasshaimasu ka.', '~ có ở đó không ạ?'],
        ['Bảo chờ', '{少々|しょうしょう}お{待|ま}ちください。', 'Shoushou omachi kudasai.', 'Xin chờ một chút.'],
        ['Người đó vắng (nói về người công ty mình)', '～はただいま{席|せき}を{外|はず}して／{外出|がいしゅつ}しております。', '~ wa tadaima seki o hazushite / gaishutsu shite orimasu.', '~ hiện không có ở chỗ / đang ra ngoài.'],
        ['Hứa gọi lại', '{戻|もど}りましたら、{折|お}り{返|かえ}しお{電話|でんわ}いたします。', 'Modorimashitara, orikaeshi odenwa itashimasu.', 'Khi anh ấy về, chúng tôi sẽ gọi lại.'],
        ['Nhận lời', 'かしこまりました。／{承知|しょうち}いたしました。', 'Kashikomarimashita. / Shouchi itashimashita.', 'Tôi rõ rồi ạ.'],
        ['Đến quầy lễ tân', '～{様|さま}と～{時|じ}にお{約束|やくそく}しております、～と{申|もう}します。', '~-sama to ~ji ni oyakusoku shite orimasu, ~ to moushimasu.', 'Tôi là ~, có hẹn với anh/chị ~ lúc ~ giờ.'],
        ['Vào phòng / ra về', '{失礼|しつれい}いたします。', 'Shitsurei itashimasu.', 'Tôi xin phép (vào / về).'],
        ['Cảm ơn khi ra về', '{本日|ほんじつ}はありがとうございました。', 'Honjitsu wa arigatou gozaimashita.', 'Hôm nay cảm ơn anh/chị rất nhiều.'],
        ['Không nghe rõ', '{恐|おそ}れ{入|い}りますが、もう{一度|いちど}おっしゃっていただけますか。', 'Osoreirimasu ga, mou ichido osshatte itadakemasu ka.', 'Xin lỗi, anh/chị nói lại một lần nữa được không ạ?'],
      ],
    },
    {
      t: 'note',
      title: 'チャレンジ — luyện cặp sau khi đọc hội thoại',
      items: [
        '**Cặp 1 (gọi điện)** — A là lễ tân công ty ABC, B là sinh viên muốn gặp anh 田中 phòng nhân sự. A trả lời: anh 田中 đang họp ({会議中|かいぎちゅう}でございます), 4 giờ xong. B hỏi giờ về (お{戻|もど}りになりますか) và nhờ gọi lại. Đổi vai.',
        '**Cặp 2 (quầy lễ tân)** — B đến công ty, tự giới thiệu và nói có hẹn; A mời viết tên (お{書|か}きください), dẫn lên phòng (ご{案内|あんない}いたします), mời ngồi và mời trà ({召|め}し{上|あ}がってください). B đáp {失礼|しつれい}いたします / いただきます.',
        '**Cặp 3 (thầy cô)** — B nhờ A (thầy) xem bài: {今|いま}お{時間|じかん}よろしいでしょうか → ～ていただけないでしょうか; rồi hỏi thầy có đến lễ hội của trường không (いらっしゃいますか). A trả lời bằng ～かどうか、まだわかりません.',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b24-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 48 từ N4: công ty & con người, động từ tôn kính đặc biệt, động từ khiêm nhường đặc biệt, gọi điện & tiếp khách, từ lịch sự & phỏng vấn',
  goal: 'Thuộc 48 từ của chủ đề thăm công ty: công ty & con người (会社訪問・訪ねる・社長・課長・人事部・係・名刺・応接室・会議室・インターンシップ), động từ TÔN KÍNH đặc biệt (いらっしゃる・おっしゃる・召し上がる・ご覧になる・なさる・くださる・ご存じだ), động từ KHIÊM NHƯỜNG đặc biệt (参る・申す・いたす・伺う・拝見する・いただく・おる・存じる・お目にかかる・差し上げる), gọi điện & tiếp khách (少々・ただいま・席を外す・外出する・折り返し・伝言・用件・かしこまりました・承知する・恐れ入ります), từ lịch sự & phỏng vấn (よろしい・先ほど・後ほど・どちら様・結構です・本日・資料・自己紹介・長所・尊敬する・遠慮する) — và biết mỗi động từ thường có dạng tôn kính / khiêm nhường nào.',
  minutes: 60,
  blocks: [
    {
      t: 'p',
      text: '**48 từ** chia 5 nhóm: **A** công ty & con người (10) · **B** động từ **tôn kính** đặc biệt — việc của NGƯỜI TRÊN (7) · **C** động từ **khiêm nhường** đặc biệt — việc của MÌNH (10) · **D** gọi điện & tiếp khách (10) · **E** từ lịch sự & phỏng vấn (11). Từ đã học ở Bài 1–23 ({受付|うけつけ}, {部長|ぶちょう}, {担当|たんとう}する, {面接|めんせつ}, {履歴書|りれきしょ}, {敬語|けいご}, お{客様|きゃくさま}, {就職|しゅうしょく}する, {応募|おうぼ}する, {連絡|れんらく}する, {都合|つごう}, {案内|あんない}する, {戻|もど}る, {掛|か}ける, {出張|しゅっちょう}する, {会議|かいぎ}, {相談|そうだん}する, {上司|じょうし}, {申|もう}し{訳|わけ}ありません, いらっしゃいませ…) KHÔNG lặp lại — gặp trong câu ví dụ thì coi như ôn. Nhóm **B** và **C** là "xương sống" của cả bài: học **theo cặp** (いらっしゃる ↔ {参|まい}る, {召|め}し{上|あ}がる ↔ いただく, ご{覧|らん}になる ↔ {拝見|はいけん}する…).',
    },
    {
      t: 'note',
      title: 'Cách học 48 từ trong 3 ngày',
      items: [
        '**Ngày 1** — nhóm A + D (20 từ): đọc to theo 🔊, che nghĩa tự nói. Đọc to hội thoại ① và ③′ — gần như cả nhóm D nằm trong đó. Tập nói liền mạch câu lễ tân: {少々|しょうしょう}お{待|ま}ちください → ただいま{席|せき}を{外|はず}しております → {折|お}り{返|かえ}しお{電話|でんわ}いたします.',
        '**Ngày 2** — nhóm B + C (17 từ): viết bảng 3 cột "động từ thường | tôn kính | khiêm nhường" ra giấy (bảng ở dưới), che hai cột phải rồi tự điền. Mỗi động từ nói 2 câu: một câu về **thầy / sếp**, một câu về **mình**.',
        '**Ngày 3** — nhóm E (11 từ) + thẻ hình + bảng "Từ dễ nhầm" + bài đổi sang kính ngữ + trắc nghiệm cuối mục + viết tay 10 từ.',
        'Romaji: trường âm viết đôi ({社長|しゃちょう} → **shachou**, {少々|しょうしょう} → **shoushou**, {承知|しょうち} → **shouchi**, インターン → **intaan**); âm ngắt っ viết đôi phụ âm (おっしゃる → **ossharu**, いらっしゃる → **irassharu**, {結構|けっこう} → **kekkou**); tách trợ từ: ご{覧|らん}になる → **goran ni naru**, お{目|め}にかかる → **ome ni kakaru**.',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Công ty & con người (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{会社訪問|かいしゃほうもん}', pos: 'danh từ', ipa: 'kaisha houmon', vi: 'thăm công ty (sinh viên đến tìm hiểu, gặp nhân sự)', ex: '{来週|らいしゅう}、{先輩|せんぱい}と{一緒|いっしょ}に{会社訪問|かいしゃほうもん}をします。', exRo: 'Raishuu, senpai to issho ni kaisha houmon o shimasu.', exVi: 'Tuần sau tôi đi thăm công ty cùng đàn anh.', more: '**{訪問|ほうもん}する** = thăm (trang trọng, N3): お{客様|きゃくさま}の{会社|かいしゃ}を{訪問|ほうもん}する. {家庭訪問|かていほうもん} = giáo viên đến thăm nhà học sinh. Chữ **訪** là chữ Hán mới. N3.' },
        { w: '{訪|たず}ねます［{訪|たず}ねる］2', pos: 'động từ nhóm 2', ipa: 'tazunemasu [tazuneru]', vi: 'thăm, đến thăm (người, nơi)', ex: '{夏休|なつやす}みに、{高校|こうこう}の{先生|せんせい}のお{宅|たく}を{訪|たず}ねました。', exRo: 'Natsuyasumi ni, koukou no sensei no otaku o tazunemashita.', exVi: 'Nghỉ hè, tôi đến thăm nhà thầy giáo cấp ba.', more: '+ て: {訪|たず}ねて. **(người / nơi) を{訪|たず}ねる**. Khiêm nhường khi đến chỗ người trên: **{伺|うかが}う** (nhóm C). Đồng âm khác chữ: {尋|たず}ねる (hỏi — N3). お{宅|たく} = nhà (của người khác — lịch sự; chữ 宅 Bài 18). N4.' },
        { w: '{社長|しゃちょう}', pos: 'danh từ', ipa: 'shachou', vi: 'giám đốc, chủ tịch công ty', ex: '{社長|しゃちょう}は{毎朝|まいあさ}7{時|じ}に{会社|かいしゃ}にいらっしゃいます。', exRo: 'Shachou wa maiasa shichiji ni kaisha ni irasshaimasu.', exVi: 'Giám đốc sáng nào cũng đến công ty lúc 7 giờ.', more: 'Chức vụ đã là cách gọi tôn trọng: gọi thẳng **{社長|しゃちょう}**, không thêm さん (~~{社長|しゃちょう}さん~~ — trong công ty). Với khách bên ngoài: **{社長|しゃちょう}の{山本|やまもと}は…** (うち・そと). Thứ bậc: {社長|しゃちょう} > {部長|ぶちょう} (Bài 23) > {課長|かちょう}. N4.' },
        { w: '{課長|かちょう}', pos: 'danh từ', ipa: 'kachou', vi: 'trưởng phòng, trưởng bộ phận (dưới 部長)', ex: '{課長|かちょう}、この{資料|しりょう}をご{覧|らん}になりましたか。', exRo: 'Kachou, kono shiryou o goran ni narimashita ka.', exVi: 'Thưa trưởng phòng, anh đã xem tài liệu này chưa ạ?', more: 'Tên + chức vụ: **{森課長|もりかちょう}** (= trưởng phòng Mori) — không thêm さん (~~{森課長|もりかちょう}さん~~). 課 = phòng, ban (đơn vị nhỏ trong 部); còn là "bài": {第|だい}24{課|か} (bài 24). Chữ **課** là chữ Hán mới. N4.' },
        { w: '{人事部|じんじぶ}', pos: 'danh từ', ipa: 'jinjibu', vi: 'phòng nhân sự', ex: '{人事部|じんじぶ}の{方|かた}に{履歴書|りれきしょ}を{送|おく}りました。', exRo: 'Jinjibu no kata ni rirekisho o okurimashita.', exVi: 'Tôi đã gửi sơ yếu lý lịch cho người bên phòng nhân sự.', more: '～{部|ぶ} = phòng, ban: {営業部|えいぎょうぶ} (kinh doanh), {開発部|かいはつぶ} (phát triển). {人事|じんじ} = nhân sự. **{方|かた}** = người (lịch sự của {人|ひと} — Ngữ pháp ⑧). N3.' },
        { w: '{係|かかり}', pos: 'danh từ', ipa: 'kakari', vi: 'người phụ trách, bộ phận phụ trách (một việc)', ex: 'わからないことは、{係|かかり}の{人|ひと}に{聞|き}いてください。', exRo: 'Wakaranai koto wa, kakari no hito ni kiite kudasai.', exVi: 'Điều gì không rõ thì hãy hỏi người phụ trách.', more: '**{係|かかり}の{人|ひと}** (người phụ trách) · khiêm nhường khi nói về người bên mình: **{係|かかり}の{者|もの}**. Đứng sau danh từ đọc **がかり**: {案内係|あんないがかり} (người hướng dẫn). {係員|かかりいん} = nhân viên phụ trách. Chữ **係** là chữ Hán mới. N4.' },
        { w: '{名刺|めいし}', pos: 'danh từ', ipa: 'meishi', vi: 'danh thiếp', ex: '{初|はじ}めて{会|あ}った{方|かた}と{名刺|めいし}を{交換|こうかん}しました。', exRo: 'Hajimete atta kata to meishi o koukan shimashita.', exVi: 'Tôi trao đổi danh thiếp với người lần đầu gặp.', more: '**{名刺|めいし}を{渡|わた}す／いただく**. Phép lịch sự: nhận **bằng hai tay**, đọc tên người đó rồi mới cất; ngồi họp thì đặt trên bàn. {交換|こうかん}する = trao đổi (N3). N3.' },
        { w: '{応接室|おうせつしつ}', pos: 'danh từ', ipa: 'ousetsushitsu', vi: 'phòng tiếp khách', ex: 'お{客様|きゃくさま}を{応接室|おうせつしつ}にご{案内|あんない}しました。', exRo: 'Okyakusama o ousetsushitsu ni goannai shimashita.', exVi: 'Tôi đã dẫn khách vào phòng tiếp khách.', more: '{応接|おうせつ} = tiếp đón (N2). ～{室|しつ} = phòng: {会議室|かいぎしつ}, {教室|きょうしつ}, {職員室|しょくいんしつ}. Chữ **応** là chữ Hán mới (cùng chữ trong {応募|おうぼ} — Bài 16). N3.' },
        { w: '{会議室|かいぎしつ}', pos: 'danh từ', ipa: 'kaigishitsu', vi: 'phòng họp', ex: '3{時|じ}から2{階|かい}の{会議室|かいぎしつ}で{会議|かいぎ}があります。', exRo: 'Sanji kara nikai no kaigishitsu de kaigi ga arimasu.', exVi: 'Từ 3 giờ có cuộc họp ở phòng họp tầng 2.', more: '{会議|かいぎ} (Bài 21) + {室|しつ}. **{会議中|かいぎちゅう}** = đang họp — câu điện thoại: ～はただいま{会議中|かいぎちゅう}でございます. N4.' },
        { w: 'インターンシップ', pos: 'danh từ', ipa: 'intaanshippu', vi: 'thực tập (ở công ty khi còn là sinh viên)', ex: '{夏休|なつやす}みに、ソフトの{会社|かいしゃ}でインターンシップをするつもりです。', exRo: 'Natsuyasumi ni, sofuto no kaisha de intaanshippu o suru tsumori desu.', exVi: 'Kỳ nghỉ hè tôi định đi thực tập ở một công ty phần mềm.', more: 'Nói gọn: **インターン**. インターンシップに{応募|おうぼ}する／{参加|さんか}する. Ở Nhật, sinh viên năm 3 thường đi インターンシップ trước khi tìm việc ({就職活動|しゅうしょくかつどう} — N2). N3.' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Động từ TÔN KÍNH đặc biệt — việc của người trên, của khách (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'いらっしゃいます［いらっしゃる］1', pos: 'động từ nhóm 1 đặc biệt (tôn kính của いる・行く・来る)', ipa: 'irasshaimasu [irassharu]', vi: '(người trên) có ở; đi; đến', ex: '{社長|しゃちょう}は{今|いま}、{会議室|かいぎしつ}にいらっしゃいます。', exRo: 'Shachou wa ima, kaigishitsu ni irasshaimasu.', exVi: 'Giám đốc hiện đang ở phòng họp.', more: '⚠ Thể ます là **いらっしゃいます** (る → **い**), KHÔNG phải ~~いらっしゃります~~. て: **いらっしゃって** (văn nói: いらして). Ba nghĩa, xem ngữ cảnh: {明日|あした}{大阪|おおさか}へいらっしゃいます (đi) · {先生|せんせい}がいらっしゃいました (đến) · {部屋|へや}にいらっしゃいます (có ở). Trang trọng hơn nữa: おいでになる. N4.' },
        { w: 'おっしゃいます［おっしゃる］1', pos: 'động từ nhóm 1 đặc biệt (tôn kính của 言う)', ipa: 'osshaimasu [ossharu]', vi: '(người trên) nói', ex: '{先生|せんせい}は「{明日|あした}テストをします」とおっしゃいました。', exRo: 'Sensei wa "Ashita tesuto o shimasu" to osshaimashita.', exVi: 'Thầy nói "Ngày mai kiểm tra".', more: '⚠ ます: おっしゃ**い**ます (không ~~おっしゃります~~). て: **おっしゃって**. Không nghe rõ: **もう{一度|いちど}おっしゃっていただけますか**. Khiêm nhường đối ứng: **{申|もう}す**. N4.' },
        { w: '{召|め}し{上|あ}がります［{召|め}し{上|あ}がる］1', pos: 'động từ nhóm 1 (tôn kính của 食べる・飲む)', ipa: 'meshiagarimasu [meshiagaru]', vi: '(người trên) ăn, uống, dùng', ex: '{先生|せんせい}、コーヒーを{召|め}し{上|あ}がりますか。', exRo: 'Sensei, koohii o meshiagarimasu ka.', exVi: 'Thầy có dùng cà phê không ạ?', more: '+ て: {召|め}し{上|あ}がって. Mời: **どうぞ{召|め}し{上|あ}がってください** (cửa hàng hay viết お{召|め}し{上|あ}がりください — cách nói quen dùng, chấp nhận được). Khiêm nhường đối ứng: **いただく**. Chữ **召** là chữ Hán mới. N4.' },
        { w: 'ご{覧|らん}になります［ご{覧|らん}になる］1', pos: 'cụm động từ (tôn kính của 見る)', ipa: 'goran ni narimasu [goran ni naru]', vi: '(người trên) xem, nhìn', ex: '{部長|ぶちょう}、{昨日|きのう}のメールをご{覧|らん}になりましたか。', exRo: 'Buchou, kinou no meeru o goran ni narimashita ka.', exVi: 'Thưa trưởng ban, anh đã xem email hôm qua chưa ạ?', more: 'Mời xem: **こちらをご{覧|らん}ください**. Khiêm nhường đối ứng: **{拝見|はいけん}する**. ⚠ Không nói ~~ご{覧|らん}になられる~~ (thừa kính ngữ). Chữ 覧 (LÃM) cấp cao — đọc được là đủ. N4.' },
        { w: 'なさいます［なさる］1', pos: 'động từ nhóm 1 đặc biệt (tôn kính của する)', ipa: 'nasaimasu [nasaru]', vi: '(người trên) làm', ex: '{週末|しゅうまつ}は{何|なに}をなさいますか。', exRo: 'Shuumatsu wa nani o nasaimasu ka.', exVi: 'Cuối tuần anh/chị làm gì ạ?', more: '⚠ ます: なさ**い**ます. Với động từ する: ゴルフをなさる, {運動|うんどう}なさる. Mệnh lệnh mềm ～なさい (Bài 23) sinh ra từ chính động từ này. Khiêm nhường đối ứng: **いたす**. N4.' },
        { w: 'くださいます［くださる］1', pos: 'động từ nhóm 1 đặc biệt (tôn kính của くれる)', ipa: 'kudasaimasu [kudasaru]', vi: '(người trên) cho (tôi)', ex: '{先生|せんせい}が{辞書|じしょ}をくださいました。', exRo: 'Sensei ga jisho o kudasaimashita.', exVi: 'Thầy đã cho tôi quyển từ điển.', more: '⚠ ます: くださ**い**ます. **～てくださる** = (người trên) làm cho tôi (ôn ～てくれる Bài 18): {先生|せんせい}が{教|おし}えてくださいました. Cảm ơn: **～てくださって、ありがとうございます**. Câu ～てください chính là thể mệnh lệnh của くださる. N4.' },
        { w: 'ご{存|ぞん}じです［ご{存|ぞん}じだ］', pos: 'danh từ + です (tôn kính của 知っている)', ipa: 'gozonji desu [gozonji da]', vi: '(người trên) biết', ex: '{先生|せんせい}は{森|もり}さんの{電話番号|でんわばんごう}をご{存|ぞん}じですか。', exRo: 'Sensei wa Mori-san no denwa bangou o gozonji desu ka.', exVi: 'Thầy có biết số điện thoại của anh Mori không ạ?', more: 'Phủ định: **ご{存|ぞん}じない／ご{存|ぞん}じありません**. ⚠ Không có ~~ご{存|ぞん}じます~~. Khiêm nhường đối ứng: **{存|ぞん}じております** (biết) / **{存|ぞん}じません** (không biết). Câu quen: ご{存|ぞん}じのとおり (như anh/chị đã biết). Chữ **存** là chữ Hán mới. N4.' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Động từ KHIÊM NHƯỜNG đặc biệt — việc của mình (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{参|まい}ります［{参|まい}る］1', pos: 'động từ nhóm 1 (khiêm nhường của 行く・来る)', ipa: 'mairimasu [mairu]', vi: '(tôi) đi, đến', ex: '{明日|あした}10{時|じ}にそちらへ{参|まい}ります。', exRo: 'Ashita juuji ni sochira e mairimasu.', exVi: 'Ngày mai 10 giờ tôi sẽ đến chỗ anh/chị.', more: '+ て: {参|まい}って. Lịch sự với **người nghe**, dùng được cả khi nơi đến không có người trên: {来月|らいげつ}{国|くに}へ{帰|かえ}って{参|まい}ります. Loa nhà ga: {電車|でんしゃ}が{参|まい}ります. Đối ứng tôn kính: **いらっしゃる**. Chữ 参 đã học ở Bài 9 ({参加|さんか}). N4.' },
        { w: '{申|もう}します［{申|もう}す］1', pos: 'động từ nhóm 1 (khiêm nhường của 言う)', ipa: 'moushimasu [mousu]', vi: '(tôi) nói; (tôi) tên là', ex: 'はじめまして。ワンと{申|もう}します。', exRo: 'Hajimemashite. Wan to moushimasu.', exVi: 'Rất hân hạnh. Tôi tên là Vương.', more: '+ て: {申|もう}して. **～と{申|もう}します** = câu tự giới thiệu trang trọng nhất. Nói lời của mình **lên người trên**: **{申|もう}し{上|あ}げる** (お{礼|れい}を{申|もう}し{上|あ}げます — xin gửi lời cảm ơn). Đối ứng tôn kính: **おっしゃる**. Chữ 申 đã học ở Bài 9. N4.' },
        { w: 'いたします［いたす］1', pos: 'động từ nhóm 1 (khiêm nhường của する)', ipa: 'itashimasu [itasu]', vi: '(tôi) làm', ex: '{資料|しりょう}のコピーは、わたくしがいたします。', exRo: 'Shiryou no kopii wa, watakushi ga itashimasu.', exVi: 'Việc photo tài liệu để tôi làm ạ.', more: '+ て: いたして. Thay する trong mọi động từ nhóm 3: {失礼|しつれい}いたします, お{願|ねが}いいたします, ご{連絡|れんらく}いたします. Chữ 致す ít dùng — viết **いたす** bằng kana. Đối ứng tôn kính: **なさる**. N4.' },
        { w: '{伺|うかが}います［{伺|うかが}う］1', pos: 'động từ nhóm 1 (khiêm nhường của 聞く・訪ねる・行く)', ipa: 'ukagaimasu [ukagau]', vi: '(tôi) hỏi, nghe; (tôi) đến thăm (chỗ người trên)', ex: '{明日|あした}の{午後|ごご}、{先生|せんせい}のお{宅|たく}に{伺|うかが}います。', exRo: 'Ashita no gogo, sensei no otaku ni ukagaimasu.', exVi: 'Chiều mai tôi xin đến thăm nhà thầy.', more: '+ て: **{伺|うかが}って**. Hai nghĩa: ① hỏi / nghe: **ちょっと{伺|うかが}いますが**… (xin hỏi một chút) · お{話|はなし}を{伺|うかが}う; ② đến chỗ người trên: そちらに{伺|うかが}います. Khác {参|まい}る: {伺|うかが}う luôn **hướng tới một người được tôn trọng**. Chữ **伺** là chữ Hán mới. N4.' },
        { w: '{拝見|はいけん}します［{拝見|はいけん}する］3', pos: 'động từ nhóm 3 (khiêm nhường của 見る)', ipa: 'haiken shimasu [haiken suru]', vi: '(tôi) xem (đồ của người trên)', ex: 'お{手紙|てがみ}を{拝見|はいけん}しました。', exRo: 'Otegami o haiken shimashita.', exVi: 'Tôi đã đọc thư của anh/chị rồi ạ.', more: 'Hay gặp: **{拝見|はいけん}します** (khi nhận hồ sơ, vé, giấy tờ của người khác để xem). ⚠ Không dùng để mời: ~~{拝見|はいけん}してください~~ → **ご{覧|らん}ください**. Đối ứng tôn kính: **ご{覧|らん}になる**. Chữ **拝** là chữ Hán mới. N4.' },
        { w: 'いただきます［いただく］1', pos: 'động từ nhóm 1 (khiêm nhường của もらう・食べる・飲む)', ipa: 'itadakimasu [itadaku]', vi: '(tôi) nhận; (tôi) ăn, uống', ex: '{先生|せんせい}にお{土産|みやげ}をいただきました。', exRo: 'Sensei ni omiyage o itadakimashita.', exVi: 'Tôi được thầy cho quà.', more: '+ て: いただいて. Ba việc: nhận (= もらう — Bài 18) · ăn, uống (では、いただきます) · **～ていただく** (được người trên làm cho): {先生|せんせい}に{見|み}ていただきました. Đối ứng tôn kính: **くださる** (cho) / **{召|め}し{上|あ}がる** (ăn uống). Viết kana khi là trợ động từ (～ていただく). N4.' },
        { w: 'おります［おる］1', pos: 'động từ nhóm 1 (khiêm nhường của いる)', ipa: 'orimasu [oru]', vi: '(tôi) có ở; ～ております = (tôi) đang…', ex: '{父|ちち}は{今|いま}、{大阪|おおさか}に{住|す}んでおります。', exRo: 'Chichi wa ima, Oosaka ni sunde orimasu.', exVi: 'Bố tôi hiện đang sống ở Osaka.', more: '**～ている → ～ております**: {待|ま}っております, {勉強|べんきょう}しております, お{世話|せわ}になっております. Nói về người nhà mình, người công ty mình với khách: {父|ちち}は{出|で}かけております. Đối ứng tôn kính: **いらっしゃる**. N4.' },
        { w: '{存|ぞん}じます［{存|ぞん}じる］2', pos: 'động từ nhóm 2 (khiêm nhường của 知る・思う)', ipa: 'zonjimasu [zonjiru]', vi: '(tôi) biết; (tôi) nghĩ', ex: 'その{話|はなし}は{存|ぞん}じております。', exRo: 'Sono hanashi wa zonjite orimasu.', exVi: 'Chuyện đó tôi có biết ạ.', more: '**{知|し}っている → {存|ぞん}じております** · **{知|し}らない → {存|ぞん}じません** (không ~~{存|ぞん}じていません~~). Nghĩa "nghĩ" ở văn thư từ: うれしく{存|ぞん}じます (N2). Đối ứng tôn kính: **ご{存|ぞん}じだ**. N3.' },
        { w: 'お{目|め}にかかります［お{目|め}にかかる］1', pos: 'cụm động từ (khiêm nhường của 会う)', ipa: 'ome ni kakarimasu [ome ni kakaru]', vi: '(tôi) gặp (người trên)', ex: '{社長|しゃちょう}にお{目|め}にかかるのは{初|はじ}めてです。', exRo: 'Shachou ni ome ni kakaru no wa hajimete desu.', exVi: 'Đây là lần đầu tôi được gặp giám đốc.', more: 'Mức cao hơn **お{会|あ}いする** (Ngữ pháp ⑥). Thư, email: お{目|め}にかかれるのを{楽|たの}しみにしております (rất mong được gặp anh/chị). ⚠ Không dùng cho người trên gặp ai: {社長|しゃちょう}が{会|あ}う → お{会|あ}いになる. N3.' },
        { w: '{差|さ}し{上|あ}げます［{差|さ}し{上|あ}げる］2', pos: 'động từ nhóm 2 (khiêm nhường của あげる)', ipa: 'sashiagemasu [sashiageru]', vi: '(tôi) biếu, tặng (người trên)', ex: '{先生|せんせい}に{国|くに}のお{茶|ちゃ}を{差|さ}し{上|あ}げました。', exRo: 'Sensei ni kuni no ocha o sashiagemashita.', exVi: 'Tôi đã biếu thầy trà của nước tôi.', more: '+ て: {差|さ}し{上|あ}げて. Ôn Bài 18: あげる (ngang hàng) → {差|さ}し{上|あ}げる (người trên). ⚠ **～てさしあげる** (làm giúp người trên) nghe như "kể ơn" — nói trực tiếp với người đó thì dùng **お～しましょうか**: ~~{持|も}ってさしあげましょうか~~ → **お{持|も}ちしましょうか**. N4.' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Gọi điện & tiếp khách (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{少々|しょうしょう}', pos: 'phó từ', ipa: 'shoushou', vi: 'một chút, một lát (lịch sự của ちょっと)', ex: '{少々|しょうしょう}お{待|ま}ちください。', exRo: 'Shoushou omachi kudasai.', exVi: 'Xin vui lòng chờ một chút.', more: '々 là ký hiệu **lặp lại chữ trước** ({少々|しょうしょう} = 少少, {人々|ひとびと}, {色々|いろいろ}). {少々|しょうしょう}お{時間|じかん}をいただけますか (cho tôi xin chút thời gian). N3.' },
        { w: 'ただいま', pos: 'danh từ / phó từ', ipa: 'tadaima', vi: 'hiện giờ, ngay bây giờ (lịch sự của 今)', ex: 'ただいま、{担当|たんとう}の{者|もの}が{参|まい}ります。', exRo: 'Tadaima, tantou no mono ga mairimasu.', exVi: 'Người phụ trách sẽ đến ngay bây giờ ạ.', more: 'Cùng âm với câu chào **ただいま** (con về rồi — Bài 3), khác nghĩa. Điện thoại: **～はただいま{席|せき}を{外|はず}しております**. **{者|もの}** = người (khiêm nhường — người bên mình): {担当|たんとう}の{者|もの}, {係|かかり}の{者|もの}. N3.' },
        { w: '{席|せき}を{外|はず}します［{席|せき}を{外|はず}す］1', pos: 'cụm động từ', ipa: 'seki o hazushimasu [seki o hazusu]', vi: 'rời chỗ ngồi, tạm vắng mặt (vẫn trong toà nhà)', ex: '{課長|かちょう}は{今|いま}、ちょっと{席|せき}を{外|はず}しています。', exRo: 'Kachou wa ima, chotto seki o hazushite imasu.', exVi: 'Trưởng phòng bây giờ đang tạm vắng.', more: '+ て: **{外|はず}して**. {外|はず}す = tháo ra, rời ra: {眼鏡|めがね}を{外|はず}す (tháo kính). Câu điện thoại chuẩn: **ただいま{席|せき}を{外|はず}しております**. {席|せき} — Bài 15. N3.' },
        { w: '{外出|がいしゅつ}します［{外出|がいしゅつ}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'gaishutsu shimasu [gaishutsu suru]', vi: 'ra ngoài (rời công ty đi việc)', ex: '{部長|ぶちょう}は{午後|ごご}から{外出|がいしゅつ}しています。', exRo: 'Buchou wa gogo kara gaishutsu shite imasu.', exVi: 'Trưởng ban ra ngoài từ buổi chiều.', more: '**{外出中|がいしゅつちゅう}** = đang ra ngoài. Ba mức vắng: **{席|せき}を{外|はず}す** (vẫn trong công ty) · **{外出|がいしゅつ}する** (ra khỏi công ty, trong ngày về) · **{出張|しゅっちょう}する** (đi công tác xa — Bài 21). N3.' },
        { w: '{折|お}り{返|かえ}し', pos: 'phó từ / danh từ', ipa: 'orikaeshi', vi: '(gọi) lại ngay cho người vừa gọi', ex: '{戻|もど}りましたら、{折|お}り{返|かえ}しお{電話|でんわ}いたします。', exRo: 'Modorimashitara, orikaeshi odenwa itashimasu.', exVi: 'Khi anh ấy về, chúng tôi sẽ gọi lại cho anh/chị.', more: 'Gần như chỉ dùng trong cụm **{折|お}り{返|かえ}し(お){電話|でんわ}する** (gọi lại). **{折|お}り{返|かえ}しお{電話|でんわ}をいただけますか** = anh/chị gọi lại cho tôi được không. Chữ 折 Bài 19, 返 Bài 18. N3.' },
        { w: '{伝言|でんごん}', pos: 'danh từ', ipa: 'dengon', vi: 'lời nhắn', ex: '{伝言|でんごん}をお{願|ねが}いできますか。', exRo: 'Dengon o onegai dekimasu ka.', exVi: 'Tôi nhờ nhắn lại được không?', more: '**{伝言|でんごん}を{残|のこ}す** (để lại lời nhắn) · **{伝言|でんごん}を{伝|つた}える** (chuyển lời). Lễ tân hỏi: **ご{伝言|でんごん}はございますか** (anh/chị có muốn nhắn gì không). N3.' },
        { w: '{用件|ようけん}', pos: 'danh từ', ipa: 'youken', vi: 'việc cần nói, nội dung công việc', ex: 'どのようなご{用件|ようけん}でしょうか。', exRo: 'Dono you na goyouken deshou ka.', exVi: 'Anh/chị có việc gì ạ?', more: 'Lễ tân hay hỏi: **ご{用件|ようけん}を{伺|うかが}ってもよろしいでしょうか**. Khác **{用事|ようじ}** (Bài 6 — việc bận riêng: {用事|ようじ}があるので{帰|かえ}ります). どのような = どんな (lịch sự). N3.' },
        { w: 'かしこまりました', pos: 'câu cố định', ipa: 'kashikomarimashita', vi: 'Tôi rõ rồi ạ / Vâng ạ (nhận lời khách, người trên)', ex: 'A：コーヒーを{二|ふた}つお{願|ねが}いします。 B：かしこまりました。', exRo: 'A: Koohii o futatsu onegai shimasu. B: Kashikomarimashita.', exVi: 'A: Cho tôi hai cà phê. B: Vâng ạ.', more: '= わかりました ở mức **cao nhất** — nhân viên nói với khách, cấp dưới với cấp trên. ⚠ Không nói với bạn bè. Ít dùng thể khác (かしこまる). N4.' },
        { w: '{承知|しょうち}しました［{承知|しょうち}する］3', pos: 'động từ nhóm 3', ipa: 'shouchi shimashita [shouchi suru]', vi: 'đã rõ, xin vâng (nhận việc)', ex: 'A：{明日|あした}は9{時|じ}に{来|き}てください。 B：{承知|しょうち}しました。', exRo: 'A: Ashita wa kuji ni kite kudasai. B: Shouchi shimashita.', exVi: 'A: Ngày mai em đến lúc 9 giờ nhé. B: Vâng, em rõ rồi ạ.', more: '= わかりました, dùng nhiều trong công ty, email; **{承知|しょうち}いたしました** càng lịch sự. ⚠ Với cấp trên, câu ~~{了解|りょうかい}です~~ dễ bị coi là thiếu lễ — dùng {承知|しょうち}しました. N3.' },
        { w: '{恐|おそ}れ{入|い}ります', pos: 'câu cố định', ipa: 'osoreirimasu', vi: 'xin lỗi (vì làm phiền); xin cảm ơn (rất lịch sự)', ex: '{恐|おそ}れ{入|い}りますが、お{名前|なまえ}をもう{一度|いちど}お{願|ねが}いします。', exRo: 'Osoreirimasu ga, onamae o mou ichido onegai shimasu.', exVi: 'Xin lỗi, anh/chị nói lại tên một lần nữa được không ạ.', more: '≈ すみません ở mức cao: mở đầu lời nhờ (**{恐|おそ}れ{入|い}りますが、～**), mở đầu cuộc gọi (お{忙|いそが}しいところ{恐|おそ}れ{入|い}ります), đáp khi được khen / được giúp. 恐 = sợ ({恐|おそ}ろしい — N3). N3.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Từ lịch sự & phỏng vấn (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'よろしい', pos: 'tính từ い', ipa: 'yoroshii', vi: 'tốt, được (lịch sự của いい)', ex: 'こちらに{座|すわ}ってもよろしいでしょうか。', exRo: 'Kochira ni suwatte mo yoroshii deshou ka.', exVi: 'Tôi ngồi đây có được không ạ?', more: 'Thay いい khi lịch sự: **よろしいですか → よろしいでしょうか** (mềm hơn). お{時間|じかん}よろしいでしょうか (anh/chị có thời gian không ạ). **よろしければ** = nếu anh/chị thấy được. よろしくお{願|ねが}いします cùng gốc. N4.' },
        { w: '{先|さき}ほど', pos: 'danh từ / phó từ', ipa: 'sakihodo', vi: 'lúc nãy, vừa rồi (lịch sự của さっき)', ex: '{先|さき}ほどはお{電話|でんわ}ありがとうございました。', exRo: 'Sakihodo wa odenwa arigatou gozaimashita.', exVi: 'Cảm ơn anh/chị về cuộc gọi lúc nãy.', more: 'Cặp: **{先|さき}ほど** (lúc nãy) ↔ **{後|のち}ほど** (lát nữa). Đọc **さきほど** — không phải せんほど. N3.' },
        { w: '{後|のち}ほど', pos: 'phó từ', ipa: 'nochihodo', vi: 'lát nữa, sau (lịch sự của あとで)', ex: 'では、{後|のち}ほどまたお{電話|でんわ}いたします。', exRo: 'Dewa, nochihodo mata odenwa itashimasu.', exVi: 'Vậy lát nữa tôi sẽ gọi lại.', more: 'Chữ 後 đọc **のち** trong từ này (không phải あと／ご／うしろ). {後|のち}ほどご{連絡|れんらく}いたします (lát nữa tôi sẽ liên lạc). N3.' },
        { w: 'どちら{様|さま}', pos: 'danh từ nghi vấn', ipa: 'dochira-sama', vi: 'vị nào, ai ạ (lịch sự nhất của だれ)', ex: '{失礼|しつれい}ですが、どちら{様|さま}でしょうか。', exRo: 'Shitsurei desu ga, dochira-sama deshou ka.', exVi: 'Xin lỗi, anh/chị là ai ạ?', more: 'Bậc thang: だれ → どなた → **どちら{様|さま}**. Hỏi tên người gọi điện / khách lạ ở quầy. Trả lời: ～と{申|もう}します. N4.' },
        { w: '{結構|けっこう}です', pos: 'tính từ な + です', ipa: 'kekkou desu', vi: 'được rồi, ổn; thôi, không cần ạ (từ chối lịch sự)', ex: 'A：もう{一杯|いっぱい}いかがですか。 B：いいえ、もう{結構|けっこう}です。', exRo: 'A: Mou ippai ikaga desu ka. B: Iie, mou kekkou desu.', exVi: 'A: Anh dùng thêm một chén nữa nhé? B: Dạ thôi, đủ rồi ạ.', more: 'Hai nghĩa — xem ngữ cảnh: ① **được, ổn**: {印鑑|いんかん}がなければ、サインで{結構|けっこう}です (không có con dấu thì ký cũng được); ② **thôi, không cần** (từ chối): いいえ、{結構|けっこう}です. Phó từ {結構|けっこう} = khá ({結構|けっこう}{難|むずか}しい). N4.' },
        { w: '{本日|ほんじつ}', pos: 'danh từ', ipa: 'honjitsu', vi: 'hôm nay (trang trọng)', ex: '{本日|ほんじつ}はありがとうございました。', exRo: 'Honjitsu wa arigatou gozaimashita.', exVi: 'Hôm nay xin cảm ơn anh/chị rất nhiều.', more: 'Bảng ngày trang trọng: {今日|きょう} → **{本日|ほんじつ}** · {明日|あした} → **{明日|あす}／{明日|みょうにち}** · {昨日|きのう} → **{昨日|さくじつ}**. Biển cửa hàng: {本日|ほんじつ}{休業|きゅうぎょう} (hôm nay nghỉ). N3.' },
        { w: '{資料|しりょう}', pos: 'danh từ', ipa: 'shiryou', vi: 'tài liệu', ex: '{会議|かいぎ}の{資料|しりょう}を10{部|ぶ}コピーしてください。', exRo: 'Kaigi no shiryou o juubu kopii shite kudasai.', exVi: 'Hãy photo 10 bản tài liệu cuộc họp.', more: '～{部|ぶ} = đếm bản tài liệu: {一部|いちぶ}, {二部|にぶ}, 10{部|ぶ}. **{資料|しりょう}を{作|つく}る／{送|おく}る／お{渡|わた}しする**. N4.' },
        { w: '{自己紹介|じこしょうかい}', pos: 'danh từ', ipa: 'jiko shoukai', vi: 'tự giới thiệu', ex: '{面接|めんせつ}の{最初|さいしょ}に、{一分|いっぷん}で{自己紹介|じこしょうかい}をしてください。', exRo: 'Mensetsu no saisho ni, ippun de jiko shoukai o shite kudasai.', exVi: 'Đầu buổi phỏng vấn, hãy tự giới thiệu trong một phút.', more: '{自己紹介|じこしょうかい}をする. Câu mở phỏng vấn: **{簡単|かんたん}に{自己紹介|じこしょうかい}をお{願|ねが}いします**. {紹介|しょうかい} — Bài 22; chữ **紹**, **介** là chữ Hán mới. N4.' },
        { w: '{長所|ちょうしょ}', pos: 'danh từ', ipa: 'chousho', vi: 'điểm mạnh, sở trường', ex: '{私|わたし}の{長所|ちょうしょ}は、{最後|さいご}までがんばるところです。', exRo: 'Watashi no chousho wa, saigo made ganbaru tokoro desu.', exVi: 'Điểm mạnh của tôi là cố gắng đến cùng.', more: 'Trái: **{短所|たんしょ}** (điểm yếu). Câu hỏi phỏng vấn kinh điển: **あなたの{長所|ちょうしょ}と{短所|たんしょ}を{教|おし}えてください**. Trả lời: ～ところです (điểm… là ở chỗ). N3.' },
        { w: '{尊敬|そんけい}します［{尊敬|そんけい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'sonkei shimasu [sonkei suru]', vi: 'kính trọng, ngưỡng mộ', ex: '{私|わたし}は{父|ちち}を{尊敬|そんけい}しています。', exRo: 'Watashi wa chichi o sonkei shite imasu.', exVi: 'Tôi kính trọng bố tôi.', more: '**N を{尊敬|そんけい}する**. Câu hỏi phỏng vấn: {尊敬|そんけい}する{人|ひと}は{誰|だれ}ですか. **{尊敬語|そんけいご}** = tôn kính ngữ (Ngữ pháp ②–④). Chữ **尊**, **敬** là chữ Hán mới. N3.' },
        { w: '{遠慮|えんりょ}します［{遠慮|えんりょ}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'enryo shimasu [enryo suru]', vi: 'ngại, giữ ý; xin phép không (từ chối khéo)', ex: 'ご{遠慮|えんりょ}なく、たくさん{召|め}し{上|あ}がってください。', exRo: 'Goenryo naku, takusan meshiagatte kudasai.', exVi: 'Đừng ngại, anh/chị cứ dùng thật nhiều nhé.', more: '**ご{遠慮|えんりょ}なく** = đừng ngại. Biển báo: **おたばこはご{遠慮|えんりょ}ください** (xin vui lòng không hút thuốc — cấm nhẹ nhàng). Từ chối: {今日|きょう}は{遠慮|えんりょ}しておきます. N3.' },
      ],
    },

    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra câu kính ngữ (chạm thẻ để nghe)',
      items: [
        { anh: 'office-building', w: '{会社|かいしゃ}を{訪問|ほうもん}します', ro: 'kaisha o houmon shimasu', vi: 'thăm công ty (hình: toà nhà văn phòng)' },
        { anh: 'man-office-worker', w: '{課長|かちょう}', ro: 'kachou', vi: 'trưởng phòng (hình: nhân viên văn phòng)' },
        { anh: 'woman-tipping-hand', w: '{受付|うけつけ}の{係|かかり}', ro: 'uketsuke no kakari', vi: 'người phụ trách lễ tân' },
        { anh: 'identification-card', w: '{名刺|めいし}', ro: 'meishi', vi: 'danh thiếp (hình: thẻ có tên)' },
        { anh: 'couch-and-lamp', w: '{応接室|おうせつしつ}', ro: 'ousetsushitsu', vi: 'phòng tiếp khách' },
        { anh: 'briefcase', w: 'インターンシップ', ro: 'intaanshippu', vi: 'thực tập (hình: cặp công sở)' },
        { anh: 'man-teacher', w: '{先生|せんせい}がいらっしゃいます', ro: 'sensei ga irasshaimasu', vi: 'thầy đến / thầy có ở đây' },
        { anh: 'speech-balloon', w: '{先生|せんせい}がおっしゃいます', ro: 'sensei ga osshaimasu', vi: 'thầy nói' },
        { anh: 'teacup-without-handle', w: 'お{茶|ちゃ}を{召|め}し{上|あ}がります', ro: 'ocha o meshiagarimasu', vi: '(người trên) dùng trà' },
        { anh: 'eyes', w: 'ご{覧|らん}になります', ro: 'goran ni narimasu', vi: '(người trên) xem (hình: đôi mắt)' },
        { anh: 'thinking-face', w: 'ご{存|ぞん}じですか', ro: 'gozonji desu ka', vi: 'anh/chị có biết không ạ' },
        { anh: 'man-bowing', w: 'ワンと{申|もう}します', ro: 'Wan to moushimasu', vi: 'tôi tên là Vương (hình: cúi chào)' },
        { anh: 'page-facing-up', w: '{履歴書|りれきしょ}を{拝見|はいけん}します', ro: 'rirekisho o haiken shimasu', vi: 'tôi xin xem sơ yếu lý lịch' },
        { anh: 'cooked-rice', w: 'いただきます', ro: 'itadakimasu', vi: '(tôi) xin phép ăn / nhận' },
        { anh: 'handshake', w: 'お{目|め}にかかります', ro: 'ome ni kakarimasu', vi: '(tôi) được gặp (người trên)' },
        { anh: 'wrapped-gift', w: '{差|さ}し{上|あ}げます', ro: 'sashiagemasu', vi: '(tôi) biếu tặng' },
        { anh: 'ten-oclock', w: '{少々|しょうしょう}お{待|ま}ちください', ro: 'shoushou omachi kudasai', vi: 'xin chờ một chút (hình: đồng hồ)' },
        { anh: 'man-walking', w: 'ただいま{外出|がいしゅつ}しております', ro: 'tadaima gaishutsu shite orimasu', vi: 'hiện đang ra ngoài' },
        { anh: 'telephone-receiver', w: '{折|お}り{返|かえ}しお{電話|でんわ}いたします', ro: 'orikaeshi odenwa itashimasu', vi: 'chúng tôi sẽ gọi lại' },
        { anh: 'memo', w: '{伝言|でんごん}', ro: 'dengon', vi: 'lời nhắn (hình: tờ ghi chú)' },
        { anh: 'chair', w: 'お{掛|か}けください', ro: 'okake kudasai', vi: 'mời ngồi (hình: ghế)' },
        { anh: 'clipboard', w: '{資料|しりょう}', ro: 'shiryou', vi: 'tài liệu' },
        { anh: 'calendar', w: '{本日|ほんじつ}', ro: 'honjitsu', vi: 'hôm nay (hình: tờ lịch)' },
        { anh: 'person-bowing', w: '{恐|おそ}れ{入|い}ります', ro: 'osoreirimasu', vi: 'xin lỗi đã làm phiền (hình: cúi người)' },
      ],
    },
    {
      t: 'table',
      caption: 'Động từ thường → TÔN KÍNH (việc người trên) ↔ KHIÊM NHƯỜNG (việc của mình) — chuẩn bị cho Ngữ pháp',
      head: ['Động từ thường', 'Tôn kính (尊敬語)', 'Khiêm nhường (謙譲語)', 'Romaji (tôn kính · khiêm nhường)'],
      rows: [
        ['いる', 'いらっしゃる・おいでになる', 'おる', 'irassharu · oru'],
        ['{行|い}く', 'いらっしゃる・おいでになる', '{参|まい}る・{伺|うかが}う (đến chỗ người trên)', 'irassharu · mairu, ukagau'],
        ['{来|く}る', 'いらっしゃる・おいでになる・{見|み}える', '{参|まい}る', 'irassharu · mairu'],
        ['{言|い}う', 'おっしゃる', '{申|もう}す・{申|もう}し{上|あ}げる', 'ossharu · mousu, moushiageru'],
        ['{食|た}べる・{飲|の}む', '{召|め}し{上|あ}がる', 'いただく', 'meshiagaru · itadaku'],
        ['{見|み}る', 'ご{覧|らん}になる', '{拝見|はいけん}する', 'goran ni naru · haiken suru'],
        ['する', 'なさる', 'いたす', 'nasaru · itasu'],
        ['くれる', 'くださる', '—', 'kudasaru'],
        ['あげる', '—', '{差|さ}し{上|あ}げる', 'sashiageru'],
        ['もらう', '—', 'いただく', 'itadaku'],
        ['{知|し}っている', 'ご{存|ぞん}じだ', '{存|ぞん}じている・{存|ぞん}じておる', 'gozonji da · zonjite oru'],
        ['{会|あ}う', 'お{会|あ}いになる', 'お{目|め}にかかる・お{会|あ}いする', 'oai ni naru · ome ni kakaru'],
        ['{聞|き}く (hỏi)', 'お{聞|き}きになる', '{伺|うかが}う・お{聞|き}きする', 'okiki ni naru · ukagau'],
        ['{寝|ね}る', 'お{休|やす}みになる', '—', 'oyasumi ni naru'],
      ],
    },
    {
      t: 'table',
      caption: 'Từ dễ nhầm của bài — cùng nghĩa, khác người làm',
      head: ['Từ', 'Romaji', 'Ai làm', 'Từ dễ nhầm', 'Phân biệt'],
      rows: [
        ['いらっしゃる', 'irassharu', 'người trên', '{参|まい}る (mình)', '{先生|せんせい}がいらっしゃいます ／ {私|わたし}が{参|まい}ります'],
        ['{召|め}し{上|あ}がる', 'meshiagaru', 'người trên', 'いただく (mình)', 'どうぞ{召|め}し{上|あ}がってください ／ では、いただきます'],
        ['ご{覧|らん}になる', 'goran ni naru', 'người trên', '{拝見|はいけん}する (mình)', 'ご{覧|らん}ください ／ {拝見|はいけん}します'],
        ['おっしゃる', 'ossharu', 'người trên', '{申|もう}す (mình)', '{先生|せんせい}がおっしゃった ／ {私|わたし}が{申|もう}しました'],
        ['{伺|うかが}う', 'ukagau', 'mình (tới người trên)', '{参|まい}る (mình, nơi bất kỳ)', '{先生|せんせい}のお{宅|たく}に{伺|うかが}う ／ {駅|えき}に{参|まい}ります'],
        ['{席|せき}を{外|はず}す', 'seki o hazusu', 'vắng chốc lát', '{外出|がいしゅつ}する', 'vẫn trong công ty ／ đã ra khỏi công ty'],
        ['{先|さき}ほど', 'sakihodo', 'thời gian', '{後|のち}ほど', 'lúc nãy (quá khứ) ／ lát nữa (tương lai)'],
        ['かしこまりました', 'kashikomarimashita', 'nhân viên → khách', '{承知|しょうち}しました', 'cửa hàng, khách sạn ／ công ty, email (cả hai = わかりました)'],
      ],
    },
    {
      t: 'note',
      title: 'Từ dễ nhầm trong bài',
      items: [
        '**Cặp tôn kính ↔ khiêm nhường KHÔNG thay cho nhau được.** Câu hỏi đầu tiên luôn là: **AI làm?** Người trên / khách làm → tôn kính (いらっしゃる, {召|め}し{上|あ}がる, ご{覧|らん}になる, おっしゃる, なさる). Mình (hoặc người nhà mình) làm → khiêm nhường ({参|まい}る, いただく, {拝見|はいけん}する, {申|もう}す, いたす).',
        '**{伺|うかが}う ↔ {参|まい}る** — cả hai = "tôi đi / đến". **{伺|うかが}う** chỉ dùng khi đến **chỗ của người mình tôn trọng** (nâng người đó): {先生|せんせい}の{研究室|けんきゅうしつ}に{伺|うかが}います. **{参|まい}る** chỉ lịch sự với **người đang nghe**, nơi đến là đâu cũng được: {明日|あした}{京都|きょうと}へ{参|まい}ります. ~~{明日|あした}{京都|きょうと}に{伺|うかが}います~~ nghe lạ (Kyoto không phải người).',
        '**いただく ↔ くださる** — cùng một việc (người trên cho mình), hai hướng nhìn: {先生|せんせい}**が**{辞書|じしょ}を**くださいました** (chủ ngữ = thầy) ↔ {先生|せんせい}**に**{辞書|じしょ}を**いただきました** (chủ ngữ = mình). Ôn Bài 18: くれる ↔ もらう.',
        '**かしこまりました ↔ {承知|しょうち}しました ↔ わかりました** — cùng "tôi hiểu". かしこまりました: nhân viên với khách (cửa hàng, khách sạn). {承知|しょうち}しました／いたしました: trong công ty, email. わかりました: lịch sự thường (thầy cô, người lớn tuổi quen) — với khách thì hơi thiếu.',
        '**{結構|けっこう}です** — hai nghĩa ngược nhau: "được, ổn" (これで{結構|けっこう}です) và "thôi, không cần" (いいえ、{結構|けっこう}です — từ chối). Có いいえ／もう đi trước gần như chắc chắn là **từ chối**.',
        '**ただいま (bây giờ) ↔ ただいま (con về rồi)** — cùng âm. Trong công ty, điện thoại: ただいま = **今** (lịch sự). **{先|さき}ほど ↔ {後|のち}ほど** — ngược nhau: lúc nãy ↔ lát nữa.',
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '**{会社訪問|かいしゃほうもん}をする** · {先生|せんせい}のお{宅|たく}**を{訪|たず}ねる** · **{社長|しゃちょう}の～は** (nói với khách) · **{森課長|もりかちょう}** · **{人事部|じんじぶ}の{方|かた}** · **{係|かかり}の{人|ひと}／{係|かかり}の{者|もの}** · **{名刺|めいし}を{交換|こうかん}する** · **{応接室|おうせつしつ}にご{案内|あんない}する** · **{会議中|かいぎちゅう}でございます** · **インターンシップに{応募|おうぼ}する**',
        '**{会議室|かいぎしつ}にいらっしゃる** · **{先生|せんせい}がおっしゃったとおり** · **どうぞ{召|め}し{上|あ}がってください** · **こちらをご{覧|らん}ください** · **{何|なに}をなさいますか** · **～てくださって、ありがとうございます** · **ご{存|ぞん}じですか／ご{存|ぞん}じのとおり**',
        '**そちらへ{参|まい}ります** · **～と{申|もう}します** · **お{礼|れい}を{申|もう}し{上|あ}げます** · **{失礼|しつれい}いたします** · **ちょっと{伺|うかが}いますが** · **お{手紙|てがみ}を{拝見|はいけん}しました** · **では、いただきます** · **～ております** · **{存|ぞん}じております／{存|ぞん}じません** · **お{目|め}にかかれてうれしいです** · **お{茶|ちゃ}を{差|さ}し{上|あ}げる**',
        '**{少々|しょうしょう}お{待|ま}ちください** · **ただいま{席|せき}を{外|はず}しております** · **{午後|ごご}から{外出|がいしゅつ}しております** · **{折|お}り{返|かえ}しお{電話|でんわ}いたします** · **{伝言|でんごん}をお{願|ねが}いできますか** · **ご{用件|ようけん}は** · **かしこまりました** · **{承知|しょうち}いたしました** · **{恐|おそ}れ{入|い}りますが**',
        '**よろしいでしょうか** · **{先|さき}ほどは** ありがとうございました · **{後|のち}ほどご{連絡|れんらく}いたします** · **どちら{様|さま}でしょうか** · **いいえ、{結構|けっこう}です** · **{本日|ほんじつ}は**ありがとうございました · **{資料|しりょう}を{一部|いちぶ}** · **{簡単|かんたん}に{自己紹介|じこしょうかい}をお{願|ねが}いします** · **{長所|ちょうしょ}と{短所|たんしょ}** · **{尊敬|そんけい}する{人|ひと}** · **ご{遠慮|えんりょ}なく／ご{遠慮|えんりょ}ください**',
      ],
    },
    {
      t: 'table',
      caption: 'Họ từ mở rộng — gặp trong bài đọc, email công ty (đọc hiểu là đủ, ghi cấp)',
      head: ['Từ của bài', 'Từ mở rộng', 'Romaji', 'Nghĩa', 'Cấp'],
      rows: [
        ['{会社訪問|かいしゃほうもん}', '{訪問|ほうもん}する · {訪|おとず}れる', 'houmon suru · otozureru', 'thăm (trang trọng) · ghé thăm (văn viết)', 'N3 · N2'],
        ['{社長|しゃちょう}', '{会長|かいちょう} · {社員|しゃいん} · {新入社員|しんにゅうしゃいん}', 'kaichou · shain · shinnyuu shain', 'chủ tịch HĐQT · nhân viên · nhân viên mới', 'N3'],
        ['{課長|かちょう}', '{課題|かだい} · {日課|にっか}', 'kadai · nikka', 'bài tập, vấn đề · việc hằng ngày', 'N2'],
        ['{係|かかり}', '{関係|かんけい} · {係員|かかりいん}', 'kankei · kakariin', 'quan hệ · nhân viên phụ trách', 'N3'],
        ['{応接室|おうせつしつ}', '{対応|たいおう} · {反応|はんのう}', 'taiou · hannou', 'ứng phó, tiếp nhận · phản ứng', 'N2'],
        ['{伝言|でんごん}', '{留守番電話|るすばんでんわ}', 'rusuban denwa', 'máy nhắn tin thoại', 'N3'],
        ['{用件|ようけん}', '{件名|けんめい}', 'kenmei', 'tiêu đề email', 'N2'],
        ['{長所|ちょうしょ}', '{短所|たんしょ}', 'tansho', 'điểm yếu', 'N3'],
        ['{尊敬|そんけい}する', '{尊敬語|そんけいご} · {謙譲語|けんじょうご} · {丁寧語|ていねいご}', 'sonkeigo · kenjougo · teineigo', 'tôn kính ngữ · khiêm nhường ngữ · từ lịch sự', 'N3'],
        ['{遠慮|えんりょ}する', 'ご{遠慮|えんりょ}ください', 'goenryo kudasai', 'xin đừng (biển báo)', 'N3'],
        ['{自己紹介|じこしょうかい}', '{紹介状|しょうかいじょう}', 'shoukaijou', 'thư giới thiệu', 'N2'],
        ['{存|ぞん}じる', '{保存|ほぞん}する', 'hozon suru', 'lưu (file), bảo quản', 'N2'],
      ],
    },
    {
      t: 'write',
      id: 'b24-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['訪問', '課長', '係', '名刺', '会議室', '資料', '本日', '自己紹介', '尊敬', '伝言'],
      goi: {
        '訪問': 'ほうもん · thăm',
        '課長': 'かちょう · trưởng phòng',
        '係': 'かかり · người phụ trách',
        '名刺': 'めいし · danh thiếp',
        '会議室': 'かいぎしつ · phòng họp',
        '資料': 'しりょう · tài liệu',
        '本日': 'ほんじつ · hôm nay',
        '自己紹介': 'じこしょうかい · tự giới thiệu',
        '尊敬': 'そんけい · kính trọng',
        '伝言': 'でんごん · lời nhắn',
      },
    },
    {
      t: 'quiz',
      id: 'b24-tv-doi',
      title: 'Gõ dạng kính ngữ đặc biệt (12 câu) — chuẩn bị cho Ngữ pháp',
      kind: 'fill',
      grammar: 'Tôn kính (người trên làm): いらっしゃる・おっしゃる・召し上がる・ご覧になる・なさる・くださる · Khiêm nhường (mình làm): 参る・申す・いたす・伺う・拝見する・いただく・おる',
      items: [
        { q: '{先生|せんせい}が{来|く}る → tôn kính, thể ます', answers: V('いらっしゃいます', 'おいでになります'), hint: 'không phải いらっしゃります' },
        { q: '{先生|せんせい}が{言|い}う → tôn kính, thể ました', answers: V('おっしゃいました'), hint: 'おっしゃ＋い＋ました' },
        { q: '{社長|しゃちょう}が{食|た}べる → tôn kính, thể ます', answers: V('{召|め}し{上|あ}がります'), hint: 'めしあがる' },
        { q: '{部長|ぶちょう}が{見|み}る → tôn kính, thể ました', answers: V('ご{覧|らん}になりました'), hint: 'ごらん に なる' },
        { q: 'お{客様|きゃくさま}がする → tôn kính, thể ます', answers: V('なさいます'), hint: 'なさ＋い＋ます' },
        { q: '{先生|せんせい}がくれる → tôn kính, thể ました', answers: V('くださいました'), hint: 'くださ＋い＋ました' },
        { q: '{私|わたし}が{行|い}く → khiêm nhường, thể ます', answers: V('{参|まい}ります', '{伺|うかが}います'), hint: 'まいります' },
        { q: '{私|わたし}が{言|い}う → khiêm nhường, thể ます', answers: V('{申|もう}します'), hint: 'もうします' },
        { q: '{私|わたし}がする → khiêm nhường, thể ます', answers: V('いたします'), hint: 'いたす' },
        { q: '{私|わたし}が{見|み}る → khiêm nhường, thể ます', answers: V('{拝見|はいけん}します'), hint: 'はいけん します' },
        { q: '{私|わたし}がもらう → khiêm nhường, thể ました', answers: V('いただきました'), hint: 'いただく' },
        { q: '{私|わたし}が{家|いえ}にいる → khiêm nhường, thể ます', answers: V('おります', '{家|いえ}におります'), hint: 'おる' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 14 câu (dạng 文脈規定・言い換え類義・用法 của đề N4)',
      items: [
        { q: '{電話|でんわ}で：「{森|もり}は ただいま{席|せき}を（　）おります。」', options: ['{外|はず}して', '{出|だ}して', '{外出|がいしゅつ}して', '{離|はな}して'], correct: 0, why: 'Cụm cố định **{席|せき}を{外|はず}す** = tạm vắng khỏi chỗ ngồi. {外出|がいしゅつ} không đi với {席|せき}を. 〔Seki o hazushite orimasu.〕' },
        { q: '{課長|かちょう}は{戻|もど}りましたら、（　）お{電話|でんわ}いたします。', options: ['{先|さき}ほど', '{折|お}り{返|かえ}し', 'ただいま', '{結構|けっこう}'], correct: 1, why: 'Gọi lại cho người vừa gọi = **{折|お}り{返|かえ}しお{電話|でんわ}する**. 〔Orikaeshi odenwa itashimasu.〕' },
        { q: '{森|もり}が{留守|るす}なので、（　）をお{願|ねが}いできますか。', options: ['{名刺|めいし}', '{伝言|でんごん}', '{長所|ちょうしょ}', '{用件|ようけん}'], correct: 1, why: 'Người cần gặp vắng → **nhờ nhắn lại**: {伝言|でんごん}をお{願|ねが}いする. 〔Dengon o onegai dekimasu ka.〕' },
        { q: '{初|はじ}めて{会|あ}った{方|かた}と（　）を{交換|こうかん}しました。', options: ['{名刺|めいし}', '{資料|しりょう}', '{伝言|でんごん}', '{会議室|かいぎしつ}'], correct: 0, why: 'Trao đổi **danh thiếp** = {名刺|めいし}を{交換|こうかん}する. 〔Meishi o koukan shimashita.〕' },
        { q: 'お{客様|きゃくさま}を5{階|かい}の（　）にご{案内|あんない}しました。', options: ['{人事部|じんじぶ}', '{応接室|おうせつしつ}', '{外出|がいしゅつ}', '{本日|ほんじつ}'], correct: 1, why: 'Dẫn khách vào **phòng tiếp khách**: {応接室|おうせつしつ}. 〔Ousetsushitsu ni goannai shimashita.〕' },
        { q: '{面接|めんせつ}で「あなたの（　）は{何|なん}ですか」と{聞|き}かれました。', options: ['{長所|ちょうしょ}', '{伝言|でんごん}', '{少々|しょうしょう}', '{用件|ようけん}'], correct: 0, why: 'Câu hỏi phỏng vấn kinh điển: **{長所|ちょうしょ}** (điểm mạnh). 〔Anata no chousho wa nan desu ka.〕' },
        { q: '「{少々|しょうしょう}お{待|ま}ちください」と{意味|いみ}が{近|ちか}いのは？', options: ['ちょっと{待|ま}ってください', 'ずっと{待|ま}ってください', 'もう{待|ま}たないでください', 'あとで{来|き}てください'], correct: 0, why: '**{少々|しょうしょう}** = ちょっと (lịch sự). (dạng 言い換え類義)' },
        { q: '「{先|さき}ほど{電話|でんわ}がありました」と{意味|いみ}が{近|ちか}いのは？', options: ['あとで{電話|でんわ}があります', 'さっき{電話|でんわ}がありました', '{明日|あした}{電話|でんわ}があります', 'ずっと{電話|でんわ}がありません'], correct: 1, why: '**{先|さき}ほど** = さっき (lúc nãy). {後|のち}ほど mới là "lát nữa". (dạng 言い換え類義)' },
        { q: '「{本日|ほんじつ}は{休|やす}みです」と{意味|いみ}が{近|ちか}いのは？', options: ['{明日|あした}は{休|やす}みです', '{今日|きょう}は{休|やす}みです', '{毎日|まいにち}{休|やす}みです', '{昨日|きのう}は{休|やす}みでした'], correct: 1, why: '**{本日|ほんじつ}** = {今日|きょう} (trang trọng). (dạng 言い換え類義)' },
        { q: 'A「コーヒーのおかわりはいかがですか。」 B「いいえ、もう（　）。」', options: ['{結構|けっこう}です', 'かしこまりました', '{恐|おそ}れ{入|い}ります', '{承知|しょうち}しました'], correct: 0, why: '**いいえ、もう{結構|けっこう}です** = thôi, đủ rồi ạ (từ chối lịch sự). 〔Iie, mou kekkou desu.〕' },
        { q: '{店員|てんいん}：「ご{注文|ちゅうもん}は{以上|いじょう}でよろしいですか。」 {客|きゃく}：「はい。」 {店員|てんいん}：「（　）。」', options: ['{結構|けっこう}です', 'かしこまりました', 'いただきます', 'お{目|め}にかかります'], correct: 1, why: 'Nhân viên nhận lời khách → **かしこまりました**. 〔Kashikomarimashita.〕' },
        { q: '「{伺|うかが}う」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{先生|せんせい}が{私|わたし}の{家|いえ}に{伺|うかが}いました。', '{明日|あした}、{先生|せんせい}のお{宅|たく}に{伺|うかが}います。', '{先生|せんせい}、どうぞ{伺|うかが}ってください。', '{犬|いぬ}が{公園|こうえん}に{伺|うかが}いました。'], correct: 1, why: '**{伺|うかが}う** = mình đến chỗ người trên (khiêm nhường). Thầy là chủ ngữ thì không dùng. (dạng 用法)' },
        { q: '「{遠慮|えんりょ}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['ここでは、おたばこはご{遠慮|えんりょ}ください。', '{遠慮|えんりょ}なので、{早|はや}く{来|き}てください。', '{明日|あした}は{遠慮|えんりょ}な{天気|てんき}です。', '{先生|せんせい}を{遠慮|えんりょ}しています。'], correct: 0, why: '**ご{遠慮|えんりょ}ください** = xin đừng (cấm nhẹ nhàng — biển báo). (dạng 用法)' },
        { q: '「{尊敬|そんけい}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{私|わたし}は{自分|じぶん}を{尊敬|そんけい}しました。', '{私|わたし}は{母|はは}を{尊敬|そんけい}しています。', 'このケーキを{尊敬|そんけい}してください。', '{尊敬|そんけい}な{部屋|へや}ですね。'], correct: 1, why: '**(người) を{尊敬|そんけい}する** = kính trọng ai. Không dùng cho đồ vật, không phải tính từ な. (dạng 用法)' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b24-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N4 — kính ngữ: tôn kính ngữ (お〜になる · động từ đặc biệt · 〜られる · お〜ください), khiêm nhường ngữ (お〜する · động từ đặc biệt · 〜させていただく), thể lịch sự cao (でございます), câu hỏi lồng 〜か · 〜かどうか',
  goal: 'Biết AI làm thì dùng loại kính ngữ nào (người trên / khách → 尊敬語; mình và người nhà mình → 謙譲語; nói trang trọng với người nghe → 丁寧語) và quy tắc うち・そと; tạo đúng tôn kính ngữ お＋Vます＋になる／ご＋N＋になる, dùng đủ động từ tôn kính đặc biệt (いらっしゃる・おっしゃる・召し上がる・ご覧になる・なさる・くださる・ご存じだ — chia いらっしゃいます, không いらっしゃります), dùng V(ら)れる làm tôn kính và phân biệt với bị động / khả năng; mời bằng お〜ください／ご〜ください; tạo khiêm nhường ngữ お＋Vます＋する／いたす, ご＋N＋する／いたす, dùng đủ động từ khiêm nhường đặc biệt (参る・申す・いたす・伺う・拝見する・いただく・おる・存じる・お目にかかる・差し上げる), nhận ra 〜させていただく; nói trang trọng bằng でございます・ございます và bảng từ lịch sự; hỏi gián tiếp bằng 疑問詞〜か và 〜かどうか — và tránh các lỗi người Việt hay mắc (tôn kính cho bản thân, お見になる, 二重敬語, gọi sếp mình là 森課長 với khách).',
  minutes: 150,
  blocks: [
    {
      t: 'p',
      text: 'Bài 24 là bài **kính ngữ (敬語)** — phần nhiều người học tiếng Nhật thấy "đáng sợ" nhất. Thật ra nó chỉ có **một câu hỏi** phải trả lời trước mỗi động từ: **AI làm việc đó?** · Người trên / khách / người ngoài làm → **nâng họ lên** = **tôn kính ngữ (尊敬語)**: {先生|せんせい}が**いらっしゃいます** · Mình (hoặc người nhà mình) làm → **hạ mình xuống** = **khiêm nhường ngữ (謙譲語)**: {私|わたし}が**{参|まい}ります** · Không nâng không hạ ai, chỉ **nói trang trọng với người nghe** → **từ lịch sự (丁寧語)**: です・ます, **でございます**. Phần còn lại là học thuộc **cách tạo** (お～になる, お～する…) và **khoảng 15 động từ đặc biệt**. Cuối bài thêm **câu hỏi lồng** (～か, ～かどうか) — thứ bạn cần ngay khi hỏi lịch sự: "{何時|なんじ}に{来|く}ればいい**か**、{教|おし}えていただけませんか".',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 24',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', '尊敬語 · 謙譲語 · 丁寧語 · うち／そと', 'ba loại kính ngữ; ai làm → loại nào', '{先生|せんせい}が{来|く}る → いらっしゃる', 'N4'],
        ['②', 'お＋Vます＋になる ／ ご＋N＋になる', 'tôn kính (động từ thường)', 'お{待|ま}ちになる · ご{利用|りよう}になる', 'N4'],
        ['③', 'いらっしゃる・おっしゃる・{召|め}し{上|あ}がる・ご{覧|らん}になる・なさる・くださる・ご{存|ぞん}じだ', 'tôn kính đặc biệt', '{社長|しゃちょう}がおっしゃいました', 'N4'],
        ['④', 'V(ら)れる', 'tôn kính nhẹ (cùng hình bị động)', '{先生|せんせい}が{来|こ}られる', 'N4'],
        ['⑤', 'お＋Vます＋ください ／ ご＋N＋ください', 'mời, chỉ dẫn lịch sự', 'お{掛|か}けください · ご{覧|らん}ください', 'N4'],
        ['⑥', 'お＋Vます＋する(いたす) ／ ご＋N＋する(いたす)', 'khiêm nhường (việc mình làm cho người trên)', 'お{持|も}ちします · ご{案内|あんない}いたします', 'N4'],
        ['⑦', '{参|まい}る・{申|もう}す・いたす・{伺|うかが}う・{拝見|はいけん}する・いただく・おる・{存|ぞん}じる… ／ ～させていただく', 'khiêm nhường đặc biệt; (nhận ra) xin phép làm', 'ワンと{申|もう}します · {説明|せつめい}させていただきます', 'N4'],
        ['⑧', 'でございます・ございます · よろしい・{少々|しょうしょう}・ただいま… · お／ご', 'lịch sự cao', 'こちらでございます', 'N4'],
        ['⑨', '疑問詞 ＋ 普通形 ＋ か', 'câu hỏi lồng (có từ để hỏi)', '{何時|なんじ}に{始|はじ}まるか{教|おし}えてください', 'N4'],
        ['⑩', '普通形 ＋ かどうか', '"có … hay không"', '{行|い}けるかどうかわかりません', 'N4'],
      ],
    },
    {
      t: 'note',
      title: 'Ba điều phải nhớ trước khi học',
      items: [
        '**Kính ngữ đi theo NGƯỜI LÀM, không theo người nghe.** Cùng nói với thầy: "Thầy đi" → {先生|せんせい}が**いらっしゃる** (tôn kính); "Em đi" → {私|わたし}が**{参|まい}る** (khiêm nhường). Dùng tôn kính cho chính mình là **lỗi nặng nhất** — nghe như tự xưng "trẫm".',
        '**Câu kính ngữ vẫn kết thúc bằng です・ます.** Tôn kính / khiêm nhường đổi **động từ**; です・ます (丁寧語) giữ ở cuối: お{待|ま}ちになり**ます**, {参|まい}り**ます**. Thể thường của kính ngữ (いらっしゃる, {参|まい}る) chỉ gặp trong văn viết, trong mệnh đề phụ ({先生|せんせい}がいらっしゃる{日|ひ}).',
        '**Không cần dùng kính ngữ ở mọi câu.** Ở mức N4, đủ để: tự giới thiệu, nói chuyện với thầy cô, gọi điện, đến công ty, làm thêm ở cửa hàng. Một câu です・ます đúng tốt hơn một câu kính ngữ sai. Dùng **quá nhiều tầng** (~~おっしゃられる~~) cũng là lỗi.',
      ],
    },

    /* ══════ ① BA LOẠI KÍNH NGỮ ══════ */
    { t: 'h', text: '① Kính ngữ (敬語) là gì — 3 loại, "AI làm → dùng loại nào", うち・そと' },
    {
      t: 'p',
      text: 'Tiếng Việt thể hiện lễ phép chủ yếu bằng **cách xưng hô** (thưa thầy, ạ, dạ). Tiếng Nhật thì **đổi cả động từ**. Hãy hình dung một cái **thang**: người được tôn trọng đứng trên, mình đứng dưới. **尊敬語** đẩy hành động của người kia **lên**; **謙譲語** kéo hành động của mình **xuống** (khoảng cách cũng lớn ra — kết quả giống nhau: người kia cao hơn); **丁寧語** không đổi vị trí ai, chỉ là **giọng nói trang trọng** với người nghe. Ba loại thường **đi cùng nhau** trong một câu: {先生|せんせい}が**おっしゃった**ことを、{私|わたし}が**{申|もう}し{上|あ}げ**ます (điều thầy nói, em xin nói lại).',
    },
    {
      t: 'table',
      caption: '⭐ BẢNG TỔNG HỢP 3 LOẠI KÍNH NGỮ',
      head: ['Loại', 'Làm gì', 'Chủ ngữ của động từ', 'Dạng chính', 'Ví dụ', 'Romaji'],
      rows: [
        ['**尊敬語** (tôn kính ngữ)', 'NÂNG người làm lên', 'người trên, khách, người ngoài', 'お～になる · ご～になる · V(ら)れる · động từ đặc biệt · お～ください', '{社長|しゃちょう}がお{帰|かえ}りになりました。', 'Shachou ga okaeri ni narimashita.'],
        ['**謙譲語** (khiêm nhường ngữ)', 'HẠ mình (và người nhà mình) xuống', 'tôi, người nhà / người công ty mình', 'お～する · ご～する · お～いたす · động từ đặc biệt · ～させていただく', '{私|わたし}がお{持|も}ちします。', 'Watashi ga omochi shimasu.'],
        ['**丁寧語** (từ lịch sự)', 'nói TRANG TRỌNG với người nghe', 'bất kỳ', 'です・ます · でございます · ございます · từ lịch sự (よろしい・{少々|しょうしょう}…) · お／ご', 'こちらが{会議室|かいぎしつ}でございます。', 'Kochira ga kaigishitsu de gozaimasu.'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ AI LÀM → DÙNG LOẠI NÀO (quyết định trong 2 giây)',
      head: ['Ai làm việc đó?', 'Đang nói với ai?', 'Dùng', 'Ví dụ', 'Romaji'],
      rows: [
        ['Thầy cô, cấp trên, khách hàng, người lớn tuổi không thân', 'chính họ hoặc người khác', '**尊敬語**', '{先生|せんせい}は{何時|なんじ}にいらっしゃいますか。', 'Sensei wa nanji ni irasshaimasu ka.'],
        ['Tôi (làm cho / liên quan đến người trên)', 'người trên, khách', '**謙譲語**', '{明日|あした}、{資料|しりょう}をお{送|おく}りします。', 'Ashita, shiryou o ookuri shimasu.'],
        ['Tôi (việc riêng, không liên quan người trên)', 'người trên, khách', '**丁寧語** (+ {参|まい}る・おる・いたす nếu muốn trang trọng)', '{週末|しゅうまつ}は{国|くに}へ{帰|かえ}ります／{帰|かえ}って{参|まい}ります。', 'Shuumatsu wa kuni e kaerimasu / kaette mairimasu.'],
        ['Người nhà / người cùng công ty mình — **kể cả sếp mình**', 'người NGOÀI (khách, công ty khác)', '**謙譲語** (うち・そと)', '{森|もり}はただいま{外出|がいしゅつ}しております。', 'Mori wa tadaima gaishutsu shite orimasu.'],
        ['Sếp mình', 'người TRONG công ty', '**尊敬語**', '{森課長|もりかちょう}はもうお{帰|かえ}りになりました。', 'Mori-kachou wa mou okaeri ni narimashita.'],
        ['Không ai cụ thể (thông báo, đồ vật, sự kiện)', 'khách, đám đông', '**丁寧語** (でございます・ございます)', 'お{手洗|てあら}いは2{階|かい}にございます。', 'Otearai wa nikai ni gozaimasu.'],
        ['Bạn bè, gia đình, người dưới', 'bạn bè, người thân', '**thể thường** — không dùng kính ngữ', '{明日|あした}{行|い}く？', 'Ashita iku?'],
      ],
    },
    {
      t: 'table',
      caption: 'うち・そと — cùng một người (anh 森, trưởng phòng của ワン), nói với ai thì đổi cách nói',
      head: ['ワン nói với…', 'Câu', 'Romaji', 'Vì sao'],
      rows: [
        ['chính anh 森', '{課長|かちょう}、{田村様|たむらさま}からお{電話|でんわ}がありました。', 'Kachou, Tamura-sama kara odenwa ga arimashita.', 'người trong công ty: nâng sếp (gọi bằng chức vụ)'],
        ['đồng nghiệp (chị 鈴木)', '{森課長|もりかちょう}はもうお{帰|かえ}りになりましたか。', 'Mori-kachou wa mou okaeri ni narimashita ka.', 'vẫn là chuyện nội bộ: tôn kính sếp'],
        ['khách của công ty khác', '{森|もり}はもう{帰|かえ}りました／{失礼|しつれい}いたしました。', 'Mori wa mou kaerimashita / shitsurei itashimashita.', 'người ngoài: sếp mình là "người nhà" → bỏ chức vụ, không tôn kính'],
        ['khách — sếp mình vắng', '{森|もり}はただいま{席|せき}を{外|はず}しております。', 'Mori wa tadaima seki o hazushite orimasu.', 'khiêm nhường おる cho người nhà mình'],
        ['khách — nói về người của khách', '{田村様|たむらさま}はいらっしゃいますか。', 'Tamura-sama wa irasshaimasu ka.', 'người ngoài nhóm mình: luôn tôn kính + 様'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{先生|せんせい}は{今|いま}、{職員室|しょくいんしつ}にいらっしゃいます。', 'Sensei wa ima, shokuinshitsu ni irasshaimasu.', 'Thầy bây giờ đang ở phòng giáo viên. (người trên làm → 尊敬語)'),
        E('{明日|あした}、わたくしがそちらへ{参|まい}ります。', 'Ashita, watakushi ga sochira e mairimasu.', 'Ngày mai tôi sẽ đến chỗ anh/chị. (mình làm → 謙譲語)'),
        E('こちらが{会議室|かいぎしつ}でございます。', 'Kochira ga kaigishitsu de gozaimasu.', 'Đây là phòng họp ạ. (丁寧語)'),
        E('{父|ちち}は{銀行|ぎんこう}で{働|はたら}いております。', 'Chichi wa ginkou de hataraite orimasu.', 'Bố tôi làm việc ở ngân hàng. (người nhà mình → 謙譲語, nói với người trên)'),
        E('{社長|しゃちょう}の{山本|やまもと}は、ただいま{会議中|かいぎちゅう}でございます。', 'Shachou no Yamamoto wa, tadaima kaigichuu de gozaimasu.', 'Giám đốc Yamamoto của chúng tôi hiện đang họp. (nói với khách: うち・そと)'),
        E('{田村様|たむらさま}のお{父様|とうさま}はお{元気|げんき}でいらっしゃいますか。', 'Tamura-sama no otousama wa ogenki de irasshaimasu ka.', 'Bố của anh Tamura vẫn khoẻ chứ ạ? (người nhà của người khác → nâng; でいらっしゃる = です tôn kính — nhận ra)'),
      ],
    },
    {
      t: 'note',
      title: '⚠ Lỗi hay mắc ở bước ①',
      items: [
        '**Dùng tôn kính cho bản thân**: ~~{私|わたし}は{明日|あした}いらっしゃいます~~ → **{参|まい}ります**; ~~{私|わたし}もお{茶|ちゃ}を{召|め}し{上|あ}がります~~ → **いただきます**; ~~{私|わたし}がおっしゃった~~ → **{申|もう}しました**. Người Việt hay nghĩ "nói với thầy thì phải dùng từ trang trọng nhất" — nhưng kính ngữ đi theo **người làm**.',
        '**Dùng khiêm nhường cho người trên**: ~~{先生|せんせい}が{拝見|はいけん}しました~~ → **ご{覧|らん}になりました**; ~~{社長|しゃちょう}が{参|まい}りました~~ (nói với người trong công ty) → **いらっしゃいました**; ~~お{客様|きゃくさま}、いただいてください~~ → **{召|め}し{上|あ}がってください**.',
        '**Nâng sếp mình trước mặt khách**: ~~{森課長|もりかちょう}はいらっしゃいません~~ (nói với khách) → **{森|もり}はおりません／{席|せき}を{外|はず}しております**. Ngược lại, gọi trống tên người của công ty khách (~~{田村|たむら}はいますか~~) là rất thất lễ → **{田村様|たむらさま}はいらっしゃいますか**.',
        '**Gọi người nhà mình bằng từ tôn kính**: ~~{私|わたし}のお{母|かあ}さんは～~~ (nói với người ngoài) → **{母|はは}は～** (ôn Bài 8: {母|はは} ↔ お{母|かあ}さん).',
      ],
    },
    { t: 'rule', formula: 'Người trên / khách làm → 尊敬語 ／ Mình & người nhà mình làm → 謙譲語 ／ Nói trang trọng → 丁寧語 (です・ます・でございます)', vi: 'Trước mỗi động từ hỏi: AI làm? Nói với người ngoài thì người cùng công ty / gia đình mình tính là "mình" (うち) → không nâng.' },

    /* ══════ ② お〜になる ══════ */
    { t: 'h', text: '② お＋Vます＋になる ／ ご＋N＋になる — tôn kính ngữ (cách tạo chung)' },
    {
      t: 'p',
      text: 'Cách tạo tôn kính cho **phần lớn động từ**: lấy **thân ます** (bỏ ます: {待|ま}ち・{帰|かえ}り・{書|か}き), kẹp giữa **お … になる**: **お{待|ま}ちになる**, **お{帰|かえ}りになる**, **お{書|か}きになる**. Với **động từ する gốc Hán** ({利用|りよう}する, {出席|しゅっせき}する), dùng **ご ＋ danh từ ＋ になる**: **ご{利用|りよう}になる**, **ご{出席|しゅっせき}になる**. Kết thúc câu vẫn là ます: お{待|ま}ちに**なります**／お{待|ま}ちに**なりました**／お{待|ま}ちに**なっています**. Nghĩa không đổi — chỉ thêm sự tôn trọng **người làm**.',
    },
    {
      t: 'table',
      caption: 'Cách tạo お～になる ／ ご～になる',
      head: ['Động từ', 'Thân ます', 'Tôn kính', 'Romaji', 'Ví dụ'],
      rows: [
        ['{待|ま}つ', '{待|ま}ち', '**お{待|ま}ちになる**', 'omachi ni naru', '{先生|せんせい}はロビーでお{待|ま}ちになっています。'],
        ['{帰|かえ}る', '{帰|かえ}り', '**お{帰|かえ}りになる**', 'okaeri ni naru', '{社長|しゃちょう}はもうお{帰|かえ}りになりました。'],
        ['{書|か}く', '{書|か}き', '**お{書|か}きになる**', 'okaki ni naru', 'この{本|ほん}は{先生|せんせい}がお{書|か}きになりました。'],
        ['{読|よ}む', '{読|よ}み', '**お{読|よ}みになる**', 'oyomi ni naru', '{今朝|けさ}の{新聞|しんぶん}をお{読|よ}みになりましたか。'],
        ['{使|つか}う', '{使|つか}い', '**お{使|つか}いになる**', 'otsukai ni naru', 'このパソコンをお{使|つか}いになりますか。'],
        ['{聞|き}く', '{聞|き}き', '**お{聞|き}きになる**', 'okiki ni naru', 'もうこのニュースをお{聞|き}きになりましたか。'],
        ['{会|あ}う', '{会|あ}い', '**お{会|あ}いになる**', 'oai ni naru', '{社長|しゃちょう}は{午後|ごご}、お{客様|きゃくさま}にお{会|あ}いになります。'],
        ['{出|で}かける', '{出|で}かけ', '**お{出|で}かけになる**', 'odekake ni naru', '{部長|ぶちょう}は10{時|じ}にお{出|で}かけになりました。'],
        ['{戻|もど}る', '{戻|もど}り', '**お{戻|もど}りになる**', 'omodori ni naru', '{何時|なんじ}ごろお{戻|もど}りになりますか。'],
        ['{生|う}まれる', '{生|う}まれ', '**お{生|う}まれになる**', 'oumare ni naru', '{先生|せんせい}はどちらでお{生|う}まれになりましたか。'],
        ['{利用|りよう}する', '—', '**ご{利用|りよう}になる**', 'goriyou ni naru', 'このカードはどこでもご{利用|りよう}になれます。'],
        ['{出席|しゅっせき}する', '—', '**ご{出席|しゅっせき}になる**', 'goshusseki ni naru', '{社長|しゃちょう}もパーティーにご{出席|しゅっせき}になります。'],
        ['{心配|しんぱい}する', '—', '**ご{心配|しんぱい}になる**', 'goshinpai ni naru', 'ご{心配|しんぱい}にならないでください。'],
      ],
    },
    {
      t: 'note',
      title: '⚠ Khi nào KHÔNG dùng お～になる',
      items: [
        '**Thân ます chỉ có 1 âm** → không ghép được: ~~お{見|み}になる~~ ({見|み}ます), ~~お{寝|ね}になる~~ ({寝|ね}ます), ~~おいになる~~ (います), ~~お{来|き}になる~~ ({来|き}ます), ~~おしになる~~ (します). Dùng **động từ đặc biệt** (③): ご{覧|らん}になる, お{休|やす}みになる, いらっしゃる, なさる.',
        '**Động từ đã có dạng đặc biệt** → ưu tiên dạng đặc biệt: {言|い}う → **おっしゃる** (không ~~お{言|い}いになる~~), {食|た}べる → **{召|め}し{上|あ}がる** (~~お{食|た}べになる~~ nghe vụng), {行|い}く → **いらっしゃる** (~~お{行|い}きになる~~ không dùng), する → **なさる**.',
        '**Từ ngoại lai (katakana) và nhiều động từ する** không ghép お／ご: ~~おコピーになる~~ → **コピーなさる**／**コピーされる** (④). Không chắc thì dùng **V(ら)れる** (④) — an toàn nhất.',
        '**お hay ご?** Từ thuần Nhật (和語 — thân ます): **お**; từ Hán (漢語 — {利用|りよう}, {出席|しゅっせき}, {説明|せつめい}): **ご**. Ngoại lệ hay gặp: お{電話|でんわ}, お{時間|じかん}, お{食事|しょくじ}, お{元気|げんき} (từ Hán nhưng đi với お).',
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(người trên) は お＋Vます＋に なります ／ ご＋N＋に なります',
          vi: 'Người trên làm việc gì. Câu hỏi: **お～になりますか** — "anh/chị/thầy có … không ạ?". Trả lời về chính mình thì **không** lặp lại お～になる.',
          examples: [
            E('{部長|ぶちょう}はもうお{帰|かえ}りになりました。', 'Buchou wa mou okaeri ni narimashita.', 'Trưởng ban đã về rồi ạ.'),
            E('{先生|せんせい}は{毎朝|まいあさ}、{新聞|しんぶん}をお{読|よ}みになります。', 'Sensei wa maiasa, shinbun o oyomi ni narimasu.', 'Thầy sáng nào cũng đọc báo.'),
            E('{社長|しゃちょう}は{今|いま}、お{客様|きゃくさま}とお{話|はな}しになっています。', 'Shachou wa ima, okyakusama to ohanashi ni natte imasu.', 'Giám đốc hiện đang nói chuyện với khách.'),
            E('この{絵|え}は{先生|せんせい}がお{描|か}きになったそうです。', 'Kono e wa sensei ga okaki ni natta sou desu.', 'Nghe nói bức tranh này do thầy vẽ.'),
            E('{田中様|たなかさま}は{何時|なんじ}の{新幹線|しんかんせん}にお{乗|の}りになりますか。', 'Tanaka-sama wa nanji no shinkansen ni onori ni narimasu ka.', 'Anh Tanaka sẽ đi chuyến tàu cao tốc mấy giờ ạ?'),
            E('ご{利用|りよう}になる{方|かた}は、{受付|うけつけ}にお{名前|なまえ}をお{書|か}きください。', 'Goriyou ni naru kata wa, uketsuke ni onamae o okaki kudasai.', 'Quý khách sử dụng xin vui lòng ghi tên ở quầy lễ tân.'),
          ],
        },
      ],
    },
    DL('Hỏi ↔ đáp — người hỏi dùng お～になる, người trả lời nói về mình bằng です・ます／khiêm nhường', [
      ['ワン', 'a', '{課長|かちょう}、{今日|きょう}は{何時|なんじ}ごろお{帰|かえ}りになりますか。', 'Kachou, kyou wa nanji goro okaeri ni narimasu ka.', 'Thưa trưởng phòng, hôm nay khoảng mấy giờ anh về ạ?'],
      ['{森課長|もりかちょう}', 'examiner', '7{時|じ}ごろかな。{会議|かいぎ}があるから。', 'Shichiji goro ka na. Kaigi ga aru kara.', 'Chắc khoảng 7 giờ. Vì có cuộc họp.'],
      ['ワン', 'a', 'あのう、この{資料|しりょう}、もうお{読|よ}みになりましたか。', 'Anou, kono shiryou, mou oyomi ni narimashita ka.', 'À… tài liệu này anh đã đọc chưa ạ?'],
      ['{森課長|もりかちょう}', 'examiner', 'うん、{読|よ}んだよ。よく{書|か}けていたね。', 'Un, yonda yo. Yoku kakete ita ne.', 'Ừ, đọc rồi. Viết tốt đấy.'],
      ['ワン', 'a', 'ありがとうございます。{課長|かちょう}はどちらでお{生|う}まれになったんですか。', 'Arigatou gozaimasu. Kachou wa dochira de oumare ni natta n desu ka.', 'Em cảm ơn ạ. Anh sinh ra ở đâu vậy ạ?'],
      ['{森課長|もりかちょう}', 'examiner', '{北海道|ほっかいどう}だよ。ワンさんは？', 'Hokkaidou da yo. Wan-san wa?', 'Hokkaido. Còn Vương?'],
      ['ワン', 'a', 'わたくしは{上海|シャンハイ}で{生|う}まれました。', 'Watakushi wa Shanhai de umaremashita.', 'Em sinh ra ở Thượng Hải ạ.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — "(người trên) có … không ạ?" → お～になりますか',
      head: ['Động từ', 'Câu hỏi', 'Romaji', 'Nghĩa'],
      rows: [
        ['{待|ま}つ', 'こちらでお{待|ま}ちになりますか。', 'Kochira de omachi ni narimasu ka.', 'Anh/chị chờ ở đây chứ ạ?'],
        ['{使|つか}う', 'このペンをお{使|つか}いになりますか。', 'Kono pen o otsukai ni narimasu ka.', 'Anh/chị có dùng cây bút này không ạ?'],
        ['{乗|の}る', 'タクシーにお{乗|の}りになりますか。', 'Takushii ni onori ni narimasu ka.', 'Anh/chị có đi taxi không ạ?'],
        ['{決|き}める', 'もうお{決|き}めになりましたか。', 'Mou okime ni narimashita ka.', 'Anh/chị đã quyết định chưa ạ? (nhân viên hỏi khách gọi món)'],
        ['{休|やす}む', '{昨夜|ゆうべ}はよくお{休|やす}みになれましたか。', 'Yuube wa yoku oyasumi ni naremashita ka.', 'Tối qua anh/chị ngủ ngon không ạ? (お休みになる = ngủ, nghỉ)'],
        ['{利用|りよう}する', '{駐車場|ちゅうしゃじょう}をご{利用|りよう}になりますか。', 'Chuushajou o goriyou ni narimasu ka.', 'Quý khách có dùng bãi đỗ xe không ạ?'],
      ],
    },
    { t: 'rule', formula: '(người trên) が／は お＋Vます＋になる ・ ご＋N(する)＋になる', vi: 'Tôn kính cho động từ thường. Không dùng với thân ます 1 âm (見・寝・い・来・し) và động từ đã có dạng đặc biệt (言う・食べる・行く・する) — dùng ③.' },

    /* ══════ ③ ĐỘNG TỪ TÔN KÍNH ĐẶC BIỆT ══════ */
    { t: 'h', text: '③ Động từ tôn kính ĐẶC BIỆT — いらっしゃる・おっしゃる・召し上がる・ご覧になる・なさる・くださる・ご存じだ' },
    {
      t: 'p',
      text: 'Những động từ **dùng nhiều nhất** lại **không** theo công thức ② — chúng có từ riêng. Phải thuộc như từ vựng. Tin vui: chỉ có khoảng **9 từ**, và năm từ hay gặp nhất (いらっしゃる, おっしゃる, なさる, くださる, ござる) cùng **một bẫy chia** duy nhất: thể ます đổi **る → い**: いらっしゃ**い**ます, おっしゃ**い**ます, なさ**い**ます, くださ**い**ます (không ~~いらっしゃります~~). {召|め}し{上|あ}がる và ご{覧|らん}になる thì chia bình thường: {召|め}し{上|あ}が**り**ます, ご{覧|らん}にな**り**ます.',
    },
    {
      t: 'table',
      caption: '⭐ BẢNG ĐỘNG TỪ TÔN KÍNH ĐẶC BIỆT — đủ',
      head: ['Động từ thường', 'Tôn kính', 'Thể ます', 'Thể て', 'Ví dụ', 'Romaji (ví dụ)'],
      rows: [
        ['いる', '**いらっしゃる** ／ おいでになる', 'いらっしゃいます', 'いらっしゃって (いらして)', '{先生|せんせい}は{研究室|けんきゅうしつ}にいらっしゃいます。', 'Sensei wa kenkyuushitsu ni irasshaimasu.'],
        ['{行|い}く', '**いらっしゃる** ／ おいでになる', 'いらっしゃいます', 'いらっしゃって', '{部長|ぶちょう}は{明日|あした}{大阪|おおさか}へいらっしゃいます。', 'Buchou wa ashita Oosaka e irasshaimasu.'],
        ['{来|く}る', '**いらっしゃる** ／ おいでになる ／ {見|み}える', 'いらっしゃいます', 'いらっしゃって', 'お{客様|きゃくさま}がいらっしゃいました。', 'Okyakusama ga irasshaimashita.'],
        ['{言|い}う', '**おっしゃる**', 'おっしゃいます', 'おっしゃって', '{先生|せんせい}が「{休|やす}みましょう」とおっしゃいました。', 'Sensei ga "Yasumimashou" to osshaimashita.'],
        ['{食|た}べる・{飲|の}む', '**{召|め}し{上|あ}がる**', '{召|め}し{上|あ}がります', '{召|め}し{上|あ}がって', '{社長|しゃちょう}はお{酒|さけ}を{召|め}し{上|あ}がりません。', 'Shachou wa osake o meshiagarimasen.'],
        ['{見|み}る', '**ご{覧|らん}になる**', 'ご{覧|らん}になります', 'ご{覧|らん}になって', 'この{写真|しゃしん}をご{覧|らん}になりましたか。', 'Kono shashin o goran ni narimashita ka.'],
        ['する', '**なさる**', 'なさいます', 'なさって', '{週末|しゅうまつ}は{何|なに}をなさいますか。', 'Shuumatsu wa nani o nasaimasu ka.'],
        ['くれる', '**くださる**', 'くださいます', 'くださって', '{先生|せんせい}が{本|ほん}をくださいました。', 'Sensei ga hon o kudasaimashita.'],
        ['{知|し}っている', '**ご{存|ぞん}じだ**', 'ご{存|ぞん}じです', '—', '{社長|しゃちょう}はこの{話|はなし}をご{存|ぞん}じですか。', 'Shachou wa kono hanashi o gozonji desu ka.'],
        ['{寝|ね}る', '**お{休|やす}みになる**', 'お{休|やす}みになります', 'お{休|やす}みになって', '{先生|せんせい}はもうお{休|やす}みになりました。', 'Sensei wa mou oyasumi ni narimashita.'],
        ['～ている', '**～ていらっしゃる**', '～ていらっしゃいます', '—', '{先生|せんせい}は{今|いま}、{電話|でんわ}をしていらっしゃいます。', 'Sensei wa ima, denwa o shite irasshaimasu.'],
        ['～てくれる', '**～てくださる**', '～てくださいます', '～てくださって', '{先生|せんせい}が{教|おし}えてくださいました。', 'Sensei ga oshiete kudasaimashita.'],
      ],
    },
    {
      t: 'table',
      caption: '⚠ Bẫy chia ます — bốn động từ đổi る → い',
      head: ['Thể từ điển', 'Đúng', 'SAI', 'Mệnh lệnh / mời (để so)'],
      rows: [
        ['いらっしゃる', '**いらっしゃいます**', '~~いらっしゃります~~', 'いらっしゃい (mời vào — cửa hàng: いらっしゃいませ)'],
        ['おっしゃる', '**おっしゃいます**', '~~おっしゃります~~', '—'],
        ['なさる', '**なさいます**', '~~なさります~~', 'なさい (Bài 23: {早|はや}く{寝|ね}なさい)'],
        ['くださる', '**くださいます**', '~~くださります~~', 'ください (～てください chính là từ này)'],
        ['{召|め}し{上|あ}がる (so sánh)', '{召|め}し{上|あ}が**り**ます', '~~{召|め}し{上|あ}がいます~~', 'bình thường — nhóm 1 chia như {上|あ}がる'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(người trên) は いらっしゃいます ／ おっしゃいます ／ {召|め}し{上|あ}がります ／ ご{覧|らん}になります ／ なさいます',
          vi: 'Năm động từ phải phản xạ được khi nói với / về thầy cô, cấp trên, khách. Câu hỏi lịch sự kiểu phỏng vấn: **{何|なに}をなさっていますか** (anh/chị đang làm nghề gì), **{何|なに}を{召|め}し{上|あ}がりますか** (anh/chị dùng gì ạ).',
          examples: [
            E('{本田先生|ほんだせんせい}はいらっしゃいますか。', 'Honda-sensei wa irasshaimasu ka.', 'Thầy Honda có ở đây không ạ?'),
            E('{先生|せんせい}は{来週|らいしゅう}{京都|きょうと}へいらっしゃるそうです。', 'Sensei wa raishuu Kyouto e irassharu sou desu.', 'Nghe nói tuần sau thầy đi Kyoto.'),
            E('すみません、もう{一度|いちど}おっしゃっていただけますか。', 'Sumimasen, mou ichido osshatte itadakemasu ka.', 'Xin lỗi, anh/chị nói lại một lần nữa được không ạ?'),
            E('お{昼|ひる}は{何|なに}を{召|め}し{上|あ}がりますか。', 'Ohiru wa nani o meshiagarimasu ka.', 'Bữa trưa anh/chị dùng gì ạ?'),
            E('{昨日|きのう}のニュースをご{覧|らん}になりましたか。', 'Kinou no nyuusu o goran ni narimashita ka.', 'Anh/chị đã xem tin tức hôm qua chưa ạ?'),
            E('お{父様|とうさま}はどんなお{仕事|しごと}をなさっていますか。', 'Otousama wa donna oshigoto o nasatte imasu ka.', 'Bố của anh/chị làm nghề gì ạ?'),
            E('{先生|せんせい}が{駅|えき}まで{送|おく}ってくださいました。', 'Sensei ga eki made okutte kudasaimashita.', 'Thầy đã đưa tôi ra tận ga.'),
            E('{部長|ぶちょう}、{田村|たむら}さんの{電話番号|でんわばんごう}をご{存|ぞん}じですか。', 'Buchou, Tamura-san no denwa bangou o gozonji desu ka.', 'Thưa trưởng ban, anh có biết số điện thoại của anh Tamura không ạ?'),
          ],
        },
      ],
    },
    DL('Hỏi ↔ đáp — sinh viên ↔ thầy (thầy trả lời bằng thể thường / です・ます)', [
      ['パク', 'a', '{先生|せんせい}、{夏休|なつやす}みはどちらへいらっしゃいますか。', 'Sensei, natsuyasumi wa dochira e irasshaimasu ka.', 'Thầy ơi, nghỉ hè thầy đi đâu ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', '{家族|かぞく}と{沖縄|おきなわ}へ{行|い}きます。', 'Kazoku to Okinawa e ikimasu.', 'Thầy đi Okinawa với gia đình.'],
      ['パク', 'a', 'いいですね。{沖縄|おきなわ}の{料理|りょうり}を{召|め}し{上|あ}がったことがありますか。', 'Ii desu ne. Okinawa no ryouri o meshiagatta koto ga arimasu ka.', 'Thích quá. Thầy đã từng ăn món Okinawa chưa ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'ええ、ゴーヤチャンプルーが{好|す}きですよ。', 'Ee, gooya chanpuruu ga suki desu yo.', 'Rồi, thầy thích món mướp đắng xào.'],
      ['パク', 'a', '{先生|せんせい}は{沖縄|おきなわ}の{言葉|ことば}もご{存|ぞん}じですか。', 'Sensei wa Okinawa no kotoba mo gozonji desu ka.', 'Thầy có biết cả tiếng địa phương Okinawa không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'いいえ、{少|すこ}ししか{知|し}りません。', 'Iie, sukoshi shika shirimasen.', 'Không, thầy chỉ biết chút ít thôi.'],
      ['パク', 'a', 'そうですか。{先生|せんせい}が{前|まえ}に「{旅行|りょこう}は{言葉|ことば}を{覚|おぼ}えるいいチャンスだ」とおっしゃったので、{私|わたし}も{行|い}ってみたくなりました。', 'Sou desu ka. Sensei ga mae ni "Ryokou wa kotoba o oboeru ii chansu da" to osshatta node, watashi mo itte mitaku narimashita.', 'Vậy ạ. Vì trước đây thầy nói "Du lịch là cơ hội tốt để học ngôn ngữ", nên em cũng muốn đi thử ạ.'],
    ]),
    {
      t: 'note',
      title: 'Ghi chú ③',
      items: [
        '**いらっしゃる có ba nghĩa** (いる・{行|い}く・{来|く}る) — đoán bằng trợ từ và ngữ cảnh: **に**いらっしゃる (ở / đến nơi nào), **へ**いらっしゃる (đi), **が**いらっしゃった (đến). **おいでになる** cùng ba nghĩa, trang trọng hơn (văn viết, thông báo). **{見|み}える** (= {来|く}る tôn kính): {先生|せんせい}が{見|み}えました — nhận ra là đủ.',
        '**～ていらっしゃる** = ～ている tôn kính: {先生|せんせい}は{今|いま}{何|なに}をしていらっしゃいますか. **～てくださる** = ～てくれる tôn kính (ôn Bài 18): ～てくださって、ありがとうございます — câu cảm ơn chuẩn với người trên.',
        '**ご{存|ぞん}じ** là danh từ — đi với **です**: ご{存|ぞん}じです・ご{存|ぞん}じでした・ご{存|ぞん}じない. ⚠ ~~ご{存|ぞん}じます~~, ~~ご{存|ぞん}じしています~~ đều sai.',
        '**Đừng chồng thêm tầng**: ~~おっしゃられる~~, ~~ご{覧|らん}になられる~~, ~~お{召|め}し{上|あ}がりになる~~ = **二重敬語** (kính ngữ hai lần). Một từ tôn kính là đủ.',
      ],
    },
    { t: 'rule', formula: 'いる・行く・来る → いらっしゃる ／ 言う → おっしゃる ／ 食べる・飲む → 召し上がる ／ 見る → ご覧になる ／ する → なさる ／ くれる → くださる ／ 知っている → ご存じだ', vi: 'Chỉ dùng cho việc của người trên / khách. いらっしゃる・おっしゃる・なさる・くださる → ～います (る đổi thành い).' },

    /* ══════ ④ V(ら)れる ══════ */
    { t: 'h', text: '④ V(ら)れる — tôn kính ngữ dạng られる (cùng hình bị động, mức nhẹ hơn)' },
    {
      t: 'p',
      text: 'Cách tạo tôn kính **dễ nhất**: dùng đúng **thể bị động** đã học ở Bài 22 — {書|か}く → **{書|か}かれる**, {帰|かえ}る → **{帰|かえ}られる**, {来|く}る → **{来|こ}られる**, する → **される**. Khi chủ ngữ là **người trên** và **không có "bị ai"**, câu là **tôn kính**: {先生|せんせい}は{何時|なんじ}に{来|こ}られますか (thầy mấy giờ đến ạ). Mức lịch sự **thấp hơn** お～になる và động từ đặc biệt, nhưng **dùng được cho hầu hết động từ** (cả katakana: コピーされる, チェックされる) — người Nhật dùng rất nhiều trong công ty, tin tức, trường học.',
    },
    {
      t: 'table',
      caption: 'Cách tạo — y như bị động (ôn Bài 22)',
      head: ['Nhóm', 'Động từ', 'Tôn kính V(ら)れる', 'Romaji', 'Ví dụ'],
      rows: [
        ['1', '{書|か}く · {行|い}く · {読|よ}む', '{書|か}**かれる** · {行|い}**かれる** · {読|よ}**まれる**', 'kakareru · ikareru · yomareru', '{先生|せんせい}は{夏休|なつやす}みにどこへ{行|い}かれますか。'],
        ['1', '{帰|かえ}る · {乗|の}る · {作|つく}る', '{帰|かえ}**られる** · {乗|の}**られる** · {作|つく}**られる**', 'kaerareru · norareru · tsukurareru', '{部長|ぶちょう}はもう{帰|かえ}られました。'],
        ['1', '{会|あ}う · {使|つか}う', '{会|あ}**われる** · {使|つか}**われる**', 'awareru · tsukawareru', '{社長|しゃちょう}は{明日|あした}{大臣|だいじん}に{会|あ}われます。'],
        ['2', '{出|で}かける · {決|き}める · {始|はじ}める', '{出|で}かけ**られる** · {決|き}め**られる** · {始|はじ}め**られる**', 'dekakerareru · kimerareru · hajimerareru', '{先生|せんせい}は{何時|なんじ}に{出|で}かけられましたか。'],
        ['3', 'する · {来|く}る', '**される** · **{来|こ}られる**', 'sareru · korareru', '{先生|せんせい}は{毎朝|まいあさ}{運動|うんどう}されるそうです。'],
      ],
    },
    {
      t: 'table',
      caption: '⚠ Một hình — ba nghĩa: {来|こ}られる／{食|た}べられる',
      head: ['Nghĩa', 'Câu', 'Romaji', 'Dấu hiệu'],
      rows: [
        ['bị động (Bài 22)', '{友達|ともだち}に{来|こ}られて、{勉強|べんきょう}できなかった。', 'Tomodachi ni korarete, benkyou dekinakatta.', 'có **(người) に** + mình chịu phiền'],
        ['khả năng (Bài 16)', '{明日|あした}は9{時|じ}に{来|こ}られますか。', 'Ashita wa kuji ni koraremasu ka.', 'hỏi "có thể … không" (chủ ngữ ngang hàng / người dưới)'],
        ['tôn kính (bài này)', '{先生|せんせい}は9{時|じ}に{来|こ}られます。', 'Sensei wa kuji ni koraremasu.', 'chủ ngữ là **người trên**, không có に người làm'],
      ],
    },
    {
      t: 'table',
      caption: 'Ba mức tôn kính của cùng một câu — "Thầy có đọc không ạ?"',
      head: ['Mức', 'Câu', 'Romaji', 'Dùng khi'],
      rows: [
        ['です・ます', '{先生|せんせい}は{読|よ}みますか。', 'Sensei wa yomimasu ka.', 'lịch sự thường — đúng, nhưng chưa tôn kính'],
        ['V(ら)れる', '{先生|せんせい}は{読|よ}まれますか。', 'Sensei wa yomaremasu ka.', 'tôn kính nhẹ — đồng nghiệp lớn tuổi, thầy cô trong trường'],
        ['お～になる', '{先生|せんせい}はお{読|よ}みになりますか。', 'Sensei wa oyomi ni narimasu ka.', 'tôn kính chuẩn — khách, cấp trên xa, phỏng vấn'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(người trên) は V(ら)れます',
          vi: 'Tôn kính nhẹ, dùng được với gần như mọi động từ. ⚠ Không ghép với động từ đã là kính ngữ (~~おっしゃられる~~, ~~いらっしゃられる~~) và nên tránh khi câu có thể hiểu lầm thành khả năng.',
          examples: [
            E('{先生|せんせい}は{何時|なんじ}ごろ{来|こ}られますか。', 'Sensei wa nanji goro koraremasu ka.', 'Thầy khoảng mấy giờ đến ạ?'),
            E('{部長|ぶちょう}はもう{帰|かえ}られました。', 'Buchou wa mou kaeraremashita.', 'Trưởng ban đã về rồi.'),
            E('{社長|しゃちょう}は{来月|らいげつ}アメリカへ{行|い}かれます。', 'Shachou wa raigetsu Amerika e ikaremasu.', 'Tháng sau giám đốc đi Mỹ.'),
            E('この{本|ほん}を{書|か}かれたのは{本田先生|ほんだせんせい}です。', 'Kono hon o kakareta no wa Honda-sensei desu.', 'Người viết cuốn sách này là thầy Honda.'),
            E('{課長|かちょう}は{毎日|まいにち}{自転車|じてんしゃ}で{会社|かいしゃ}に{来|こ}られます。', 'Kachou wa mainichi jitensha de kaisha ni koraremasu.', 'Trưởng phòng ngày nào cũng đến công ty bằng xe đạp.'),
            E('{先生|せんせい}は{去年|きょねん}{結婚|けっこん}されました。', 'Sensei wa kyonen kekkon saremashita.', 'Thầy đã kết hôn năm ngoái.'),
          ],
        },
      ],
    },
    { t: 'rule', formula: '(người trên) が V(ら)れる ＝ tôn kính (nhẹ)', vi: 'Hình giống bị động / khả năng; là tôn kính khi chủ ngữ là người trên và không có "bị ai". Mức: Vます < V(ら)れる < お〜になる／động từ đặc biệt.' },

    /* ══════ ⑤ お〜ください ══════ */
    { t: 'h', text: '⑤ お＋Vます＋ください ／ ご＋N＋ください — mời, chỉ dẫn lịch sự' },
    {
      t: 'p',
      text: '**～てください** (Bài 7) là "hãy …" — với khách hàng, cấp trên thì hơi giống ra lệnh. Lịch sự hơn: **お＋thân ます＋ください** (お{待|ま}ちください, お{入|はい}りください) hoặc **ご＋danh từ Hán＋ください** (ご{利用|りよう}ください, ご{注意|ちゅうい}ください). Đây là câu bạn **nghe hằng ngày** ở ga, cửa hàng, bệnh viện, thông báo. Động từ có dạng tôn kính đặc biệt thì dùng dạng đó: {見|み}る → **ご{覧|らん}ください**, {来|く}る → **いらっしゃってください／おいでください**, {食|た}べる → **{召|め}し{上|あ}がってください**.',
    },
    {
      t: 'table',
      caption: '～てください → お～ください ／ ご～ください',
      head: ['～てください', 'Lịch sự', 'Romaji', 'Gặp ở đâu'],
      rows: [
        ['{待|ま}ってください', '**お{待|ま}ちください**', 'omachi kudasai', 'quầy lễ tân, điện thoại'],
        ['{入|はい}ってください', '**お{入|はい}りください**', 'ohairi kudasai', 'mời vào phòng'],
        ['{座|すわ}ってください／{掛|か}けてください', '**お{掛|か}けください**', 'okake kudasai', 'mời ngồi'],
        ['{書|か}いてください', '**お{書|か}きください**', 'okaki kudasai', 'quầy, biểu mẫu'],
        ['{使|つか}ってください', '**お{使|つか}いください**', 'otsukai kudasai', 'mời dùng đồ'],
        ['{持|も}ってください', '**お{持|も}ちください**', 'omochi kudasai', 'mang theo (hồ sơ, vé)'],
        ['{気|き}をつけてください', '**お{気|き}をつけください**', 'oki o tsuke kudasai', 'chào khách về'],
        ['{利用|りよう}してください', '**ご{利用|りよう}ください**', 'goriyou kudasai', 'thông báo, biển'],
        ['{注意|ちゅうい}してください', '**ご{注意|ちゅうい}ください**', 'gochuui kudasai', 'loa ga: {足元|あしもと}にご{注意|ちゅうい}ください'],
        ['{連絡|れんらく}してください', '**ご{連絡|れんらく}ください**', 'gorenraku kudasai', 'email, thư'],
        ['{見|み}てください', '**ご{覧|らん}ください**', 'goran kudasai', 'giới thiệu, thuyết trình'],
        ['{来|き}てください', '**いらっしゃってください**／**おいでください**', 'irasshatte kudasai / oide kudasai', 'mời đến'],
        ['{食|た}べて／{飲|の}んでください', '**{召|め}し{上|あ}がってください**', 'meshiagatte kudasai', 'mời ăn uống'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'お＋Vます＋ください ／ ご＋N＋ください',
          vi: 'Mời, hướng dẫn khách / người trên làm gì. Đi kèm hay gặp: **どうぞ**お～ください, **{恐|おそ}れ{入|い}りますが**、お～ください (nhờ — lịch sự hơn nữa).',
          examples: [
            E('どうぞ、お{入|はい}りください。', 'Douzo, ohairi kudasai.', 'Mời anh/chị vào.'),
            E('{恐|おそ}れ{入|い}りますが、こちらでお{待|ま}ちください。', 'Osoreirimasu ga, kochira de omachi kudasai.', 'Phiền anh/chị chờ ở đây ạ.'),
            E('{電車|でんしゃ}とホームの{間|あいだ}が{広|ひろ}いので、{足元|あしもと}にご{注意|ちゅうい}ください。', 'Densha to hoomu no aida ga hiroi node, ashimoto ni gochuui kudasai.', 'Khe giữa tàu và sân ga rộng, xin chú ý dưới chân.'),
            E('{詳|くわ}しくは、ホームページをご{覧|らん}ください。', 'Kuwashiku wa, hoomupeeji o goran kudasai.', 'Chi tiết xin xem trên trang web.'),
            E('わからないことがあったら、いつでもご{連絡|れんらく}ください。', 'Wakaranai koto ga attara, itsudemo gorenraku kudasai.', 'Có gì chưa rõ xin cứ liên lạc bất cứ lúc nào.'),
            E('{雨|あめ}が{降|ふ}っていますから、お{気|き}をつけてお{帰|かえ}りください。', 'Ame ga futte imasu kara, oki o tsukete okaeri kudasai.', 'Trời đang mưa, anh/chị về cẩn thận nhé.'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: '⚠ Lỗi hay mắc ở ⑤',
      items: [
        '~~{拝見|はいけん}してください~~ / ~~{参|まい}ってください~~ / ~~いただいてください~~ — **khiêm nhường KHÔNG dùng để mời người khác** (vì người làm là họ). → **ご{覧|らん}ください · いらっしゃってください · {召|め}し{上|あ}がってください**.',
        '~~お{見|み}ください~~, ~~お{来|き}ください~~ — thân ます 1 âm không ghép お được (giống ②). → ご{覧|らん}ください, おいでください.',
        '~~お{待|ま}ってください~~ — trộn hai mẫu. Hoặc {待|ま}ってください, hoặc **お{待|ま}ちください**. Tương tự: ~~ご{利用|りよう}してください~~ → **ご{利用|りよう}ください**.',
        'Cấm lịch sự (phủ định) không dùng お～ないでください; biển báo dùng **～ないでください** ({押|お}さないでください) hoặc **ご{遠慮|えんりょ}ください** (おたばこはご{遠慮|えんりょ}ください).',
      ],
    },
    { t: 'rule', formula: 'お＋Vます＋ください ・ ご＋N(する)＋ください', vi: 'Lời mời / chỉ dẫn lịch sự hơn ～てください. 見る → ご覧ください, 来る → いらっしゃってください・おいでください, 食べる → 召し上がってください.' },

    /* ══════ ⑥ お〜する ══════ */
    { t: 'h', text: '⑥ お＋Vます＋する（いたす） ／ ご＋N＋する（いたす） — khiêm nhường ngữ (việc mình làm cho người trên)' },
    {
      t: 'p',
      text: 'Khi **mình làm một việc hướng tới người trên / khách** (mang đồ cho họ, gửi cho họ, chờ họ, dẫn đường cho họ), hạ hành động của mình xuống: **お＋thân ます＋する** (お{持|も}ちする, お{送|おく}りする, お{待|ま}ちする) hoặc **ご＋danh từ Hán＋する** (ご{案内|あんない}する, ご{説明|せつめい}する, ご{連絡|れんらく}する). Thay する bằng **いたす** thì khiêm nhường hơn nữa: お{待|ま}ち**いたします**, ご{案内|あんない}**いたします**. Đề nghị giúp: **お～しましょうか** ("để tôi … nhé?") — câu bạn dùng ngay khi đi làm thêm.',
    },
    {
      t: 'table',
      caption: 'Cách tạo お～する ／ ご～する',
      head: ['Động từ', 'Khiêm nhường', 'Romaji', 'Ví dụ', 'Nghĩa ví dụ'],
      rows: [
        ['{持|も}つ', '**お{持|も}ちする**', 'omochi suru', 'お{荷物|にもつ}をお{持|も}ちしましょうか。', 'Để tôi xách hành lý giúp nhé?'],
        ['{送|おく}る', '**お{送|おく}りする**', 'ookuri suru', '{資料|しりょう}はメールでお{送|おく}りします。', 'Tài liệu tôi sẽ gửi qua email.'],
        ['{待|ま}つ', '**お{待|ま}ちする**', 'omachi suru', '{駅|えき}の{前|まえ}でお{待|ま}ちしています。', 'Tôi sẽ chờ anh/chị trước ga.'],
        ['{知|し}らせる', '**お{知|し}らせする**', 'oshirase suru', '{結果|けっか}は{来週|らいしゅう}お{知|し}らせします。', 'Kết quả tuần sau tôi sẽ báo.'],
        ['{貸|か}す', '**お{貸|か}しする**', 'okashi suru', 'よろしければ、{傘|かさ}をお{貸|か}しします。', 'Nếu anh/chị cần, tôi cho mượn ô.'],
        ['{借|か}りる', '**お{借|か}りする**', 'okari suru', 'このペン、ちょっとお{借|か}りしてもいいですか。', 'Tôi mượn cây bút này một chút được không?'],
        ['{手伝|てつだ}う', '**お{手伝|てつだ}いする**', 'otetsudai suru', '{何|なに}かお{手伝|てつだ}いしましょうか。', 'Tôi giúp gì được không ạ?'],
        ['{呼|よ}ぶ', '**お{呼|よ}びする**', 'oyobi suru', 'タクシーをお{呼|よ}びしましょうか。', 'Tôi gọi taxi giúp nhé?'],
        ['{会|あ}う', '**お{会|あ}いする**', 'oai suru', '{明日|あした}、{社長|しゃちょう}にお{会|あ}いします。', 'Ngày mai tôi gặp giám đốc.'],
        ['{電話|でんわ}する', '**お{電話|でんわ}する**', 'odenwa suru', '{後|のち}ほどお{電話|でんわ}します。', 'Lát nữa tôi sẽ gọi điện.'],
        ['{案内|あんない}する', '**ご{案内|あんない}する**', 'goannai suru', '{会議室|かいぎしつ}までご{案内|あんない}します。', 'Tôi xin dẫn anh/chị đến phòng họp.'],
        ['{説明|せつめい}する', '**ご{説明|せつめい}する**', 'gosetsumei suru', '{使|つか}い{方|かた}をご{説明|せつめい}します。', 'Tôi xin giải thích cách dùng.'],
        ['{連絡|れんらく}する', '**ご{連絡|れんらく}する**', 'gorenraku suru', '{決|き}まったら、すぐご{連絡|れんらく}します。', 'Quyết xong tôi sẽ liên lạc ngay.'],
        ['{紹介|しょうかい}する', '**ご{紹介|しょうかい}する**', 'goshoukai suru', '{新|あたら}しいメンバーをご{紹介|しょうかい}します。', 'Tôi xin giới thiệu thành viên mới.'],
        ['{相談|そうだん}する', '**ご{相談|そうだん}する**', 'gosoudan suru', '{少|すこ}しご{相談|そうだん}したいことがあるんですが。', 'Tôi có chút việc muốn xin ý kiến ạ.'],
      ],
    },
    {
      t: 'note',
      title: '⚠ Ba điều kiện của お～する',
      items: [
        '**Người làm là MÌNH** (hoặc người nhà mình). ~~{先生|せんせい}がお{持|も}ちしました~~ → {先生|せんせい}がお{持|も}ちになりました (tôn kính).',
        '**Việc phải HƯỚNG TỚI một người được tôn trọng** (làm cho họ, làm cùng họ, liên quan tới họ). Việc riêng của mình không dùng: ~~{私|わたし}は{毎朝|まいあさ}パンをお{食|た}べします~~, ~~{一人|ひとり}でお{歩|ある}きします~~ → {食|た}べます, {歩|ある}きます (hoặc いただきます cho việc ăn).',
        '**Thân ます 1 âm không ghép được**: ~~お{見|み}する~~, ~~おしする~~ → {拝見|はいけん}する, いたす (⑦). Động từ có khiêm nhường đặc biệt thì ưu tiên dạng đó: {言|い}う → {申|もう}す (không ~~お{言|い}いする~~), {行|い}く → {参|まい}る／{伺|うかが}う.',
      ],
    },
    {
      t: 'table',
      caption: 'Ba mức của cùng một việc — "Tôi sẽ gửi tài liệu"',
      head: ['Mức', 'Câu', 'Romaji', 'Dùng khi'],
      rows: [
        ['です・ます', '{資料|しりょう}を{送|おく}ります。', 'Shiryou o okurimasu.', 'đồng nghiệp ngang hàng, thầy cô thân'],
        ['お～する', '{資料|しりょう}をお{送|おく}りします。', 'Shiryou o ookuri shimasu.', 'cấp trên, khách quen'],
        ['お～いたす', '{資料|しりょう}をお{送|おく}りいたします。', 'Shiryou o ookuri itashimasu.', 'khách hàng, email trang trọng, điện thoại'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(わたくし が) お＋Vます＋します／いたします ・ ご＋N＋します／いたします ・ お～しましょうか',
          vi: 'Việc mình làm cho / liên quan đến người trên. **お～しましょうか** = đề nghị giúp. Người trên đáp: お{願|ねが}いします／ありがとう (hoặc từ chối: {大丈夫|だいじょうぶ}です).',
          examples: [
            E('{重|おも}そうですね。お{持|も}ちしましょうか。', 'Omosou desu ne. Omochi shimashou ka.', 'Trông nặng quá. Để em xách giúp nhé?'),
            E('{明日|あした}の{会議|かいぎ}の{時間|じかん}は、メールでお{知|し}らせします。', 'Ashita no kaigi no jikan wa, meeru de oshirase shimasu.', 'Giờ họp ngày mai tôi sẽ báo qua email.'),
            E('{受付|うけつけ}の{前|まえ}でお{待|ま}ちしております。', 'Uketsuke no mae de omachi shite orimasu.', 'Tôi sẽ chờ anh/chị trước quầy lễ tân.'),
            E('では、{工場|こうじょう}の{中|なか}をご{案内|あんない}いたします。', 'Dewa, koujou no naka o goannai itashimasu.', 'Vậy tôi xin dẫn quý vị đi xem bên trong nhà máy.'),
            E('{新|あたら}しい{商品|しょうひん}について、{簡単|かんたん}にご{説明|せつめい}いたします。', 'Atarashii shouhin ni tsuite, kantan ni gosetsumei itashimasu.', 'Tôi xin giải thích ngắn gọn về sản phẩm mới.'),
            E('{先生|せんせい}、{少|すこ}しご{相談|そうだん}したいことがあるんですが……。', 'Sensei, sukoshi gosoudan shitai koto ga aru n desu ga…….', 'Thưa thầy, em có chút việc muốn xin ý kiến thầy ạ…'),
          ],
        },
      ],
    },
    DL('Hỏi ↔ đáp — nhân viên làm thêm ↔ khách (ナタポン ở quán ひまわり食堂)', [
      ['ナタポン', 'b', 'いらっしゃいませ。お{荷物|にもつ}、お{預|あず}かりしましょうか。', 'Irasshaimase. Onimotsu, oazukari shimashou ka.', 'Kính chào quý khách. Để em giữ hành lý giúp quý khách nhé?'],
      ['{客|きゃく}', 'c', 'あ、お{願|ねが}いします。', 'A, onegai shimasu.', 'À, nhờ em.'],
      ['ナタポン', 'b', 'こちらのお{席|せき}へご{案内|あんない}いたします。メニューをお{持|も}ちしますので、{少々|しょうしょう}お{待|ま}ちください。', 'Kochira no oseki e goannai itashimasu. Menyuu o omochi shimasu node, shoushou omachi kudasai.', 'Em xin dẫn quý khách đến bàn này. Em sẽ mang thực đơn ra, xin chờ một chút ạ.'],
      ['{客|きゃく}', 'c', 'すみません、{駅|えき}までの{地図|ちず}はありますか。', 'Sumimasen, eki made no chizu wa arimasu ka.', 'Xin lỗi, ở đây có bản đồ đến ga không?'],
      ['ナタポン', 'b', 'はい、ございます。お{帰|かえ}りのときにお{渡|わた}しします。', 'Hai, gozaimasu. Okaeri no toki ni owatashi shimasu.', 'Dạ có ạ. Khi quý khách về em sẽ đưa ạ.'],
    ]),
    { t: 'rule', formula: '(わたくし) お＋Vます＋する／いたす ・ ご＋N＋する／いたす', vi: 'Khiêm nhường cho việc MÌNH làm hướng tới người trên. いたす lịch sự hơn する. Không dùng cho việc riêng, cho người trên, cho thân ます 1 âm.' },

    /* ══════ ⑦ ĐỘNG TỪ KHIÊM NHƯỜNG ĐẶC BIỆT ══════ */
    { t: 'h', text: '⑦ Động từ khiêm nhường ĐẶC BIỆT — 参る・申す・いたす・伺う・拝見する・いただく・おる・存じる・お目にかかる・差し上げる (+ ～させていただく)' },
    {
      t: 'p',
      text: 'Giống ③, những động từ hay dùng nhất có **từ khiêm nhường riêng**. Đặt bảng ③ và bảng này cạnh nhau: mỗi động từ thường có một "**cặp**" — người trên làm thì dùng cột tôn kính, mình làm thì dùng cột khiêm nhường. Đặc biệt **～ている → ～ております** (おる) và **～てもらう → ～ていただく** dùng **cực nhiều** trong điện thoại, email, phỏng vấn.',
    },
    {
      t: 'table',
      caption: '⭐ BẢNG ĐỘNG TỪ KHIÊM NHƯỜNG ĐẶC BIỆT — đủ',
      head: ['Động từ thường', 'Khiêm nhường', 'Thể ます', 'Ví dụ', 'Romaji (ví dụ)', 'Đối ứng tôn kính'],
      rows: [
        ['いる', '**おる**', 'おります', '{明日|あした}は{一日中|いちにちじゅう}{家|いえ}におります。', 'Ashita wa ichinichijuu ie ni orimasu.', 'いらっしゃる'],
        ['{行|い}く・{来|く}る', '**{参|まい}る**', '{参|まい}ります', '{明日|あした}9{時|じ}に{参|まい}ります。', 'Ashita kuji ni mairimasu.', 'いらっしゃる'],
        ['{行|い}く・{訪|たず}ねる (chỗ người trên)', '**{伺|うかが}う**', '{伺|うかが}います', '{午後|ごご}、{先生|せんせい}の{研究室|けんきゅうしつ}に{伺|うかが}います。', 'Gogo, sensei no kenkyuushitsu ni ukagaimasu.', 'いらっしゃる'],
        ['{聞|き}く (hỏi, nghe)', '**{伺|うかが}う**', '{伺|うかが}います', 'ちょっと{伺|うかが}いたいことがあります。', 'Chotto ukagaitai koto ga arimasu.', 'お{聞|き}きになる'],
        ['{言|い}う', '**{申|もう}す**／**{申|もう}し{上|あ}げる**', '{申|もう}します', 'ワンと{申|もう}します。', 'Wan to moushimasu.', 'おっしゃる'],
        ['する', '**いたす**', 'いたします', 'すぐに{準備|じゅんび}いたします。', 'Sugu ni junbi itashimasu.', 'なさる'],
        ['{見|み}る', '**{拝見|はいけん}する**', '{拝見|はいけん}します', 'お{手紙|てがみ}、{拝見|はいけん}しました。', 'Otegami, haiken shimashita.', 'ご{覧|らん}になる'],
        ['{食|た}べる・{飲|の}む', '**いただく**', 'いただきます', 'では、いただきます。', 'Dewa, itadakimasu.', '{召|め}し{上|あ}がる'],
        ['もらう', '**いただく**', 'いただきます', '{社長|しゃちょう}からお{手紙|てがみ}をいただきました。', 'Shachou kara otegami o itadakimashita.', '(くださる — người cho)'],
        ['あげる', '**{差|さ}し{上|あ}げる**', '{差|さ}し{上|あ}げます', '{先生|せんせい}に{花|はな}を{差|さ}し{上|あ}げました。', 'Sensei ni hana o sashiagemashita.', '—'],
        ['{知|し}っている', '**{存|ぞん}じておる**', '{存|ぞん}じております', 'お{名前|なまえ}は{存|ぞん}じております。', 'Onamae wa zonjite orimasu.', 'ご{存|ぞん}じだ'],
        ['{知|し}らない', '**{存|ぞん}じない**', '{存|ぞん}じません', '{申|もう}し{訳|わけ}ありません、{存|ぞん}じません。', 'Moushiwake arimasen, zonjimasen.', 'ご{存|ぞん}じない'],
        ['{思|おも}う', '**{存|ぞん}じる**', '{存|ぞん}じます', 'うれしく{存|ぞん}じます。(văn thư — N2)', 'Ureshiku zonjimasu.', '—'],
        ['{会|あ}う', '**お{目|め}にかかる**', 'お{目|め}にかかります', '{明日|あした}、{社長|しゃちょう}にお{目|め}にかかります。', 'Ashita, shachou ni ome ni kakarimasu.', 'お{会|あ}いになる'],
        ['～ている', '**～ておる**', '～ております', 'お{待|ま}ちしております。', 'Omachi shite orimasu.', '～ていらっしゃる'],
        ['～てもらう', '**～ていただく**', '～ていただきます', '{先生|せんせい}に{見|み}ていただきました。', 'Sensei ni mite itadakimashita.', '(～てくださる)'],
        ['～てあげる', '**～てさしあげる**', '～てさしあげます', '(hạn chế — xem ghi chú)', '—', '—'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(わたくし) は {参|まい}ります ／ {申|もう}します ／ いたします ／ {伺|うかが}います ／ {拝見|はいけん}します ／ いただきます ／ おります',
          vi: 'Bảy động từ khiêm nhường phải phản xạ khi nói với thầy cô, cấp trên, khách. Phỏng vấn, điện thoại, email gần như câu nào cũng có ít nhất một.',
          examples: [
            E('はじめまして。ベトナムから{参|まい}りましたグエンと{申|もう}します。', 'Hajimemashite. Betonamu kara mairimashita Guen to moushimasu.', 'Rất hân hạnh. Tôi là Nguyễn, đến từ Việt Nam.'),
            E('{明日|あした}、{午後|ごご}3{時|じ}にそちらへ{伺|うかが}います。', 'Ashita, gogo sanji ni sochira e ukagaimasu.', 'Ngày mai 3 giờ chiều tôi xin đến chỗ anh/chị.'),
            E('{先生|せんせい}のご{本|ほん}、{拝見|はいけん}しました。', 'Sensei no gohon, haiken shimashita.', 'Em đã đọc cuốn sách của thầy rồi ạ.'),
            E('{先生|せんせい}にいただいた{辞書|じしょ}を、{今|いま}も{使|つか}っております。', 'Sensei ni itadaita jisho o, ima mo tsukatte orimasu.', 'Cuốn từ điển thầy cho, em đến giờ vẫn dùng ạ.'),
            E('その{件|けん}は、わたくしが{担当|たんとう}いたします。', 'Sono ken wa, watakushi ga tantou itashimasu.', 'Việc đó để tôi phụ trách ạ.'),
            E('お{目|め}にかかれて、うれしいです。', 'Ome ni kakarete, ureshii desu.', 'Được gặp anh/chị, tôi rất vui.'),
            E('{申|もう}し{訳|わけ}ございません。その{方|かた}のことは{存|ぞん}じません。', 'Moushiwake gozaimasen. Sono kata no koto wa zonjimasen.', 'Thật xin lỗi, tôi không biết người đó ạ.'),
            E('{面接|めんせつ}の{前|まえ}に、{先輩|せんぱい}に{履歴書|りれきしょ}を{見|み}ていただきました。', 'Mensetsu no mae ni, senpai ni rirekisho o mite itadakimashita.', 'Trước buổi phỏng vấn, tôi được đàn anh xem giúp sơ yếu lý lịch.'),
          ],
        },
      ],
    },
    DL('Phỏng vấn — người phỏng vấn dùng tôn kính, ứng viên dùng khiêm nhường', [
      ['{森課長|もりかちょう}', 'examiner', '{日本|にほん}にはいつ{来|こ}られましたか。', 'Nihon ni wa itsu koraremashita ka.', 'Anh sang Nhật khi nào?'],
      ['ダニエル', 'b', '3{年前|ねんまえ}に{参|まい}りました。', 'Sannen mae ni mairimashita.', 'Tôi sang Nhật 3 năm trước ạ.'],
      ['{森課長|もりかちょう}', 'examiner', 'うちの{会社|かいしゃ}のことは、どこでお{知|し}りになりましたか。', 'Uchi no kaisha no koto wa, doko de oshiri ni narimashita ka.', 'Anh biết đến công ty chúng tôi ở đâu?'],
      ['ダニエル', 'b', '{大学|だいがく}の{説明会|せつめいかい}で、{森様|もりさま}のお{話|はなし}を{伺|うかが}いました。', 'Daigaku no setsumeikai de, Mori-sama no ohanashi o ukagaimashita.', 'Tôi được nghe anh nói chuyện ở buổi giới thiệu tại trường ạ.'],
      ['{森課長|もりかちょう}', 'examiner', 'ああ、そうでしたか。{今|いま}、アルバイトはなさっていますか。', 'Aa, sou deshita ka. Ima, arubaito wa nasatte imasu ka.', 'À, ra vậy. Hiện anh có làm thêm không?'],
      ['ダニエル', 'b', 'はい。{駅前|えきまえ}のホテルで、{受付|うけつけ}の{仕事|しごと}をしております。', 'Hai. Ekimae no hoteru de, uketsuke no shigoto o shite orimasu.', 'Có ạ. Tôi đang làm lễ tân ở khách sạn trước ga ạ.'],
      ['{森課長|もりかちょう}', 'examiner', 'それはいい{経験|けいけん}ですね。{何|なに}か{質問|しつもん}はありますか。', 'Sore wa ii keiken desu ne. Nani ka shitsumon wa arimasu ka.', 'Đó là kinh nghiệm tốt đấy. Anh có câu hỏi gì không?'],
      ['ダニエル', 'b', 'はい、{一|ひと}つ{伺|うかが}ってもよろしいでしょうか。', 'Hai, hitotsu ukagatte mo yoroshii deshou ka.', 'Dạ, tôi xin phép hỏi một câu được không ạ?'],
    ]),
    {
      t: 'note',
      title: 'Ghi chú ⑦ — các điểm tinh',
      items: [
        '**{参|まい}る ↔ {伺|うかが}う** — cả hai = "tôi đi / đến". **{伺|うかが}う nâng NGƯỜI Ở NƠI ĐẾN** (chỉ dùng khi đến chỗ người được tôn trọng: {先生|せんせい}のお{宅|たく}に{伺|うかが}う). **{参|まい}る chỉ lịch sự với NGƯỜI NGHE** (nơi đến là đâu cũng được: {明日|あした}{大阪|おおさか}へ{参|まい}ります — nói với khách). Mình đến chỗ của chính người đang nghe thì dùng cả hai được: そちらに{参|まい}ります／{伺|うかが}います.',
        '**{申|もう}す ↔ {申|もう}し{上|あ}げる** — {申|もう}す: nói (lịch sự với người nghe — ～と{申|もう}します); {申|もう}し{上|あ}げる: nói **lên người trên** (お{礼|れい}を{申|もう}し{上|あ}げます, お{願|ねが}い{申|もう}し{上|あ}げます — thư từ, phát biểu).',
        '**～ていただく ↔ ～てくださる** — cùng việc "người trên làm cho tôi": {先生|せんせい}**に**{教|おし}えて**いただいた** (chủ ngữ tôi) = {先生|せんせい}**が**{教|おし}えて**くださった** (chủ ngữ thầy). Câu nhờ lịch sự nhất (ôn Bài 18): ～ていただけませんか → **～ていただけないでしょうか**.',
        '**～てさしあげる** — về hình thức là khiêm nhường của ～てあげる, nhưng vẫn mang ý "**tôi làm ơn cho**" ⇒ **không nói thẳng với người đó**: ~~{先生|せんせい}、{荷物|にもつ}を{持|も}ってさしあげましょうか~~ → **お{持|も}ちしましょうか**. Chỉ dùng khi kể chuyện về người thứ ba: {祖母|そぼ}に{本|ほん}を{読|よ}んであげた (với người nhà thì あげる là đủ).',
        '**{存|ぞん}じません ≠ ~~{存|ぞん}じていません~~** — "tôi không biết" (khiêm nhường) là **{存|ぞん}じません**, giống {知|し}りません (không ~~{知|し}っていません~~ — ôn ポイント 111).',
      ],
    },
    { t: 'h', text: '⑦′ ～させていただく — "xin phép được (làm)" (NHẬN RA, dùng vài câu cố định)' },
    {
      t: 'p',
      text: 'Bài 23 đã học **～させていただけませんか** (xin phép được làm — câu hỏi). Bỏ phần hỏi đi, ta có **～させていただきます** = "tôi xin phép (được) làm" — nghe như **được người kia cho phép** rồi mới làm, nên rất khiêm tốn. Cách chia: **thể sai khiến (Bài 23) ＋ ていただく**: {説明|せつめい}する → {説明|せつめい}させる → **{説明|せつめい}させていただきます**; {休|やす}む → {休|やす}ませる → **{休|やす}ませていただきます**. Ở N4 chỉ cần **nhận ra** và dùng đúng vài câu cố định; đừng gắn vào mọi câu (người Nhật cũng chê dùng thừa).',
    },
    {
      t: 'table',
      caption: '～させていただく — các câu cố định nên thuộc',
      head: ['Câu', 'Romaji', 'Nghĩa', 'Dùng khi'],
      rows: [
        ['{自己紹介|じこしょうかい}させていただきます。', 'Jiko shoukai sasete itadakimasu.', 'Tôi xin phép tự giới thiệu.', 'mở đầu phỏng vấn, họp'],
        ['{説明|せつめい}させていただきます。', 'Setsumei sasete itadakimasu.', 'Tôi xin phép trình bày.', 'thuyết trình'],
        ['{明日|あした}は{休|やす}ませていただきます。', 'Ashita wa yasumasete itadakimasu.', 'Ngày mai tôi xin phép nghỉ.', 'báo nghỉ với cấp trên'],
        ['こちらの{部屋|へや}を{使|つか}わせていただいてもよろしいでしょうか。', 'Kochira no heya o tsukawasete itadaite mo yoroshii deshou ka.', 'Tôi xin phép dùng phòng này được không ạ?', 'xin phép (câu hỏi)'],
        ['{本日|ほんじつ}は{早|はや}めに{帰|かえ}らせていただきます。', 'Honjitsu wa hayame ni kaerasete itadakimasu.', 'Hôm nay tôi xin phép về sớm.', 'xin về sớm'],
        ['{考|かんが}えさせていただけませんか。', 'Kangaesasete itadakemasen ka.', 'Cho tôi xin thời gian suy nghĩ được không ạ? (ôn Bài 23)', 'từ chối khéo / hoãn trả lời'],
      ],
    },
    {
      t: 'note',
      title: '⚠ ～させていただく — chú ý',
      items: [
        'Chia đúng **thể sai khiến** trước: {帰|かえ}る (nhóm 1) → {帰|かえ}**らせて**いただく (không ~~{帰|かえ}させていただく~~ — lỗi rất hay gặp, gọi là さ入れ言葉); {使|つか}う → {使|つか}**わせて**いただく; {読|よ}む → {読|よ}**ませて**いただく; する → **させて**いただく.',
        'Chỉ dùng khi việc **cần sự cho phép / ảnh hưởng tới người kia** (nghỉ, dùng đồ, trình bày). Câu ~~{私|わたし}は{大学|だいがく}を{卒業|そつぎょう}させていただきました~~ (không ai cho phép mình tốt nghiệp) nghe thừa → {卒業|そつぎょう}いたしました.',
      ],
    },
    { t: 'rule', formula: 'いる → おる ／ 行く・来る → 参る・伺う ／ 言う → 申す ／ する → いたす ／ 見る → 拝見する ／ 食べる・飲む・もらう → いただく ／ あげる → 差し上げる ／ 知っている → 存じておる ／ 会う → お目にかかる', vi: 'Chỉ dùng cho việc của MÌNH (và người nhà mình khi nói với người ngoài). Nhận ra: Vさせていただきます = tôi xin phép làm.' },

    /* ══════ ⑧ 丁寧語 ══════ */
    { t: 'h', text: '⑧ 丁寧語 mức cao — でございます・ございます, bảng từ lịch sự, お／ご (美化語)' },
    {
      t: 'p',
      text: 'Loại thứ ba không nâng ai, không hạ ai — chỉ làm **giọng nói trang trọng** với người nghe. Ba công cụ: **(1) でございます** (= です) và **ございます** (= あります) — nhân viên cửa hàng, khách sạn, lễ tân dùng suốt: {受付|うけつけ}はこちら**でございます**, お{手洗|てあら}いは2{階|かい}に**ございます**. **(2) Từ lịch sự thay từ thường**: いい → **よろしい**, ちょっと → **{少々|しょうしょう}**, {今|いま} → **ただいま**, さっき → **{先|さき}ほど**… **(3) お／ご trước danh từ** (美化語): お{茶|ちゃ}, お{名前|なまえ}, ご{家族|かぞく}, ご{住所|じゅうしょ}.',
    },
    {
      t: 'table',
      caption: '⭐ Từ thường → từ lịch sự cao (gặp ở điện thoại, cửa hàng, công ty)',
      head: ['Thường', 'Lịch sự cao', 'Romaji', 'Ví dụ'],
      rows: [
        ['です', '**でございます**', 'de gozaimasu', 'こちらが{会議室|かいぎしつ}でございます。'],
        ['あります', '**ございます**', 'gozaimasu', 'お{手洗|てあら}いは2{階|かい}にございます。'],
        ['いいです', '**よろしいです**／**よろしいでしょうか**', 'yoroshii desu / yoroshii deshou ka', 'こちらでよろしいでしょうか。'],
        ['どうですか', '**いかがですか**', 'ikaga desu ka', 'コーヒーはいかがですか。'],
        ['ちょっと', '**{少々|しょうしょう}**', 'shoushou', '{少々|しょうしょう}お{待|ま}ちください。'],
        ['{今|いま}', '**ただいま**', 'tadaima', 'ただいま{参|まい}ります。'],
        ['さっき', '**{先|さき}ほど**', 'sakihodo', '{先|さき}ほどはありがとうございました。'],
        ['あとで', '**{後|のち}ほど**', 'nochihodo', '{後|のち}ほどご{連絡|れんらく}いたします。'],
        ['{今日|きょう}', '**{本日|ほんじつ}**', 'honjitsu', '{本日|ほんじつ}はお{休|やす}みです。'],
        ['{明日|あした}', '**{明日|あす}**／**{明日|みょうにち}**', 'asu / myounichi', '{明日|みょうにち}お{届|とど}けします。'],
        ['{昨日|きのう}', '**{昨日|さくじつ}**', 'sakujitsu', '{昨日|さくじつ}はありがとうございました。'],
        ['こっち・そっち・あっち・どっち／どこ', '**こちら・そちら・あちら・どちら**', 'kochira · sochira · achira · dochira', 'お{国|くに}はどちらですか。'],
        ['だれ', '**どなた**／**どちら{様|さま}**', 'donata / dochira-sama', '{失礼|しつれい}ですが、どちら{様|さま}ですか。'],
        ['{人|ひと}', '**{方|かた}**', 'kata', 'あの{方|かた}はどなたですか。'],
        ['すみません (xin lỗi)', '**{申|もう}し{訳|わけ}ございません**', 'moushiwake gozaimasen', 'お{待|ま}たせして、{申|もう}し{訳|わけ}ございません。'],
        ['すみません (làm phiền)', '**{恐|おそ}れ{入|い}ります**', 'osoreirimasu', '{恐|おそ}れ{入|い}りますが、もう{一度|いちど}お{願|ねが}いします。'],
        ['わかりました', '**かしこまりました**／**{承知|しょうち}しました**', 'kashikomarimashita / shouchi shimashita', 'はい、かしこまりました。'],
        ['～てもいいですか', '**～てもよろしいでしょうか**', '~te mo yoroshii deshou ka', '{写真|しゃしん}を{撮|と}ってもよろしいでしょうか。'],
      ],
    },
    {
      t: 'table',
      caption: 'お hay ご — 美化語 (làm đẹp danh từ)',
      head: ['Loại', 'Quy tắc', 'Ví dụ', 'Romaji'],
      rows: [
        ['Từ thuần Nhật (和語)', '**お**', 'お{茶|ちゃ} · お{名前|なまえ} · お{国|くに} · お{手紙|てがみ} · お{仕事|しごと}', 'ocha · onamae · okuni · otegami · oshigoto'],
        ['Từ Hán (漢語)', '**ご**', 'ご{家族|かぞく} · ご{住所|じゅうしょ} · ご{連絡|れんらく} · ご{両親|りょうしん} · ご{意見|いけん}', 'gokazoku · gojuusho · gorenraku · goryoushin · goiken'],
        ['Ngoại lệ hay gặp', '**お** + từ Hán', 'お{電話|でんわ} · お{時間|じかん} · お{食事|しょくじ} · お{元気|げんき} · お{料理|りょうり}', 'odenwa · ojikan · oshokuji · ogenki · oryouri'],
        ['Không gắn', 'từ katakana, từ xấu', '~~おコーヒー~~ → コーヒー · ~~おビール~~ (cửa hàng có khi dùng)', '—'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N ＋ でございます ／ (nơi) に ＋ N が ＋ ございます',
          vi: 'でございます = です (sau danh từ / tính từ な); ございます = あります (đồ vật, sự việc). Nói về **người** được tôn trọng thì không dùng でございます mà dùng **でいらっしゃいます** (tôn kính của です — nhận ra): {田中様|たなかさま}でいらっしゃいますか.',
          examples: [
            E('お{電話|でんわ}ありがとうございます。さくらホテルでございます。', 'Odenwa arigatou gozaimasu. Sakura hoteru de gozaimasu.', 'Cảm ơn quý khách đã gọi. Khách sạn Sakura xin nghe.'),
            E('お{手洗|てあら}いはエレベーターの{横|よこ}にございます。', 'Otearai wa erebeetaa no yoko ni gozaimasu.', 'Nhà vệ sinh ở cạnh thang máy ạ.'),
            E('こちらのシャツは、Mサイズもございます。', 'Kochira no shatsu wa, emu saizu mo gozaimasu.', 'Chiếc áo này cũng có cỡ M ạ.'),
            E('{申|もう}し{訳|わけ}ございません。{本日|ほんじつ}の{席|せき}はもうございません。', 'Moushiwake gozaimasen. Honjitsu no seki wa mou gozaimasen.', 'Thật xin lỗi, hôm nay đã hết chỗ ạ.'),
            E('{失礼|しつれい}ですが、{田中様|たなかさま}でいらっしゃいますか。', 'Shitsurei desu ga, Tanaka-sama de irasshaimasu ka.', 'Xin lỗi, có phải anh Tanaka không ạ?'),
            E('ご{家族|かぞく}はお{元気|げんき}ですか。', 'Gokazoku wa ogenki desu ka.', 'Gia đình anh/chị vẫn khoẻ chứ ạ?'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: '⚠ Lỗi hay mắc ở ⑧',
      items: [
        '~~{私|わたし}はワンでございます~~ — tự giới thiệu dùng **ワンと{申|もう}します** (hoặc ワンです). でございます cho bản thân nghe như nhân viên khách sạn tự báo tên — chỉ dùng khi nhấc máy: はい、{人事部|じんじぶ}の{森|もり}でございます (người công ty nói, lịch sự với khách).',
        '~~お{客様|きゃくさま}はどちら{様|さま}でございますか~~ → **どちら{様|さま}でしょうか** (hỏi tên); nói về khách thì dùng でいらっしゃいます, không でございます.',
        '**ございます** chỉ thay **あります** (vật, sự việc). Người thì dùng **いらっしゃいます** (người trên) / **おります** (mình): ~~{社長|しゃちょう}がございます~~ → {社長|しゃちょう}がいらっしゃいます.',
      ],
    },
    { t: 'rule', formula: 'です → でございます ／ あります → ございます ／ いい → よろしい ／ ちょっと → 少々 ／ 今 → ただいま ／ さっき → 先ほど ／ あとで → 後ほど ／ 今日 → 本日 ／ 誰 → どちら様', vi: '丁寧語 không nâng hạ ai, chỉ làm câu trang trọng với người nghe. お + từ thuần Nhật, ご + từ Hán (ngoại lệ: お電話, お時間…).' },

    {
      t: 'table',
      caption: 'Kính ngữ CỐ ĐỊNH nghe hằng ngày — cửa hàng, ga, khách sạn, chỗ làm thêm (nghe hiểu + nói được)',
      head: ['Câu', 'Romaji', 'Nghĩa', 'Ở đâu / loại'],
      rows: [
        ['いらっしゃいませ。', 'Irasshaimase.', 'Kính chào quý khách.', 'cửa hàng — mệnh lệnh của いらっしゃる'],
        ['{何名様|なんめいさま}でいらっしゃいますか。', 'Nanmei-sama de irasshaimasu ka.', 'Quý khách đi mấy người ạ?', 'nhà hàng — でいらっしゃる (tôn kính)'],
        ['お{決|き}まりになりましたら、お{呼|よ}びください。', 'Okimari ni narimashitara, oyobi kudasai.', 'Khi đã chọn xong món, xin gọi tôi.', 'nhà hàng — お～になる + お～ください'],
        ['ご{注文|ちゅうもん}は{以上|いじょう}でよろしいでしょうか。', 'Gochuumon wa ijou de yoroshii deshou ka.', 'Quý khách gọi chừng này thôi ạ?', 'nhà hàng — よろしい'],
        ['{少々|しょうしょう}お{待|ま}ちくださいませ。', 'Shoushou omachi kudasaimase.', 'Xin quý khách chờ một chút ạ.', 'mọi nơi — ～くださいませ (mềm hơn)'],
        ['お{待|ま}たせいたしました。', 'Omatase itashimashita.', 'Xin lỗi đã để quý khách chờ.', 'mọi nơi — お～いたす'],
        ['ポイントカードはお{持|も}ちですか。', 'Pointo kaado wa omochi desu ka.', 'Quý khách có thẻ tích điểm không ạ?', 'konbini — お＋Vます＋です (tôn kính)'],
        ['レジ{袋|ぶくろ}はご{利用|りよう}になりますか。', 'Reji-bukuro wa goriyou ni narimasu ka.', 'Quý khách có lấy túi không ạ?', 'konbini — ご～になる'],
        ['こちら、お{返|かえ}しいたします。', 'Kochira, okaeshi itashimasu.', 'Xin gửi lại quý khách (thẻ, tiền thừa).', 'quầy thu ngân — お～いたす'],
        ['またお{越|こ}しくださいませ。', 'Mata okoshi kudasaimase.', 'Mong quý khách lại ghé.', 'cửa hàng — お越し = tôn kính của 来る (N2)'],
        ['まもなく{電車|でんしゃ}が{参|まい}ります。', 'Mamonaku densha ga mairimasu.', 'Tàu sắp đến.', 'ga — 参る (lịch sự với hành khách)'],
        ['{黄色|きいろ}い{線|せん}の{内側|うちがわ}までお{下|さ}がりください。', 'Kiiroi sen no uchigawa made osagari kudasai.', 'Xin lùi vào phía trong vạch vàng.', 'ga — お～ください'],
        ['おたばこはご{遠慮|えんりょ}ください。', 'Otabako wa goenryo kudasai.', 'Xin vui lòng không hút thuốc.', 'biển báo — ご遠慮ください'],
        ['お{部屋|へや}はこちらでございます。', 'Oheya wa kochira de gozaimasu.', 'Phòng của quý khách ở đây ạ.', 'khách sạn — でございます'],
        ['ご{予約|よやく}のお{名前|なまえ}を{伺|うかが}ってもよろしいでしょうか。', 'Goyoyaku no onamae o ukagatte mo yoroshii deshou ka.', 'Cho tôi xin tên người đặt chỗ được không ạ?', 'khách sạn, nhà hàng — 伺う'],
        ['ご{利用|りよう}ありがとうございました。', 'Goriyou arigatou gozaimashita.', 'Cảm ơn quý khách đã sử dụng dịch vụ.', 'mọi nơi — ご＋N'],
      ],
    },
    {
      t: 'note',
      title: 'Nhận ra là đủ (N3–N2) — dạng kính ngữ bạn sẽ NGHE nhưng chưa cần nói',
      items: [
        '**Tôn kính**: お{越|こ}しになる／お{見|み}えになる (= {来|く}る) · お{召|め}しになる (= {着|き}る — mặc) · ～でいらっしゃる (= ～です cho người: {田中様|たなかさま}でいらっしゃいますか) · お～です (= ～ている: ポイントカードをお{持|も}ちですか, {先生|せんせい}がお{待|ま}ちです).',
        '**Khiêm nhường**: {承|うけたまわ}る (= {聞|き}く・{受|う}ける — nhận yêu cầu: ご{注文|ちゅうもん}を{承|うけたまわ}ります) · {存|ぞん}じ{上|あ}げる (= {知|し}っている, đối với người: お{名前|なまえ}は{存|ぞん}じ{上|あ}げております) · お{目|め}にかける／ご{覧|らん}に{入|い}れる (= {見|み}せる) · {拝借|はいしゃく}する (= {借|か}りる).',
        '**Lịch sự cao**: ～でございます cho tính từ い (おいしゅうございます — cổ, rất hiếm) · {誠|まこと}に (= {本当|ほんとう}に): {誠|まこと}に{申|もう}し{訳|わけ}ございません · ～くださいませ (= ～ください, mềm hơn — nhân viên bán hàng).',
        'Đề N4 **không** bắt bạn dùng những dạng này, nhưng bài nghe / bài đọc có thể có — gặp thì nhận ra **gốc động từ** (お{越|こ}し → {来|く}る) là hiểu.',
      ],
    },
    /* ══════ ⑨ CÂU HỎI LỒNG ══════ */
    { t: 'h', text: '⑨ 疑問詞 ＋ 普通形 ＋ か — câu hỏi LỒNG trong câu ("… ở đâu / khi nào / ai …")' },
    {
      t: 'p',
      text: 'Muốn đặt một **câu hỏi có từ để hỏi** ({何|なに}・どこ・いつ・だれ・{何時|なんじ}・どう・どんな・どれ…) **vào bên trong** một câu khác — "cho tôi biết **mấy giờ bắt đầu**", "tôi không biết **ai sẽ đến**" — chỉ cần: **câu hỏi đó ở 普通形 ＋ か**, rồi nối động từ chính: **{教|おし}えてください・わかりません・{知|し}っていますか・{覚|おぼ}えていません・{聞|き}いてみます・{考|かんが}えています**. Đây là cách hỏi **gián tiếp, lịch sự** rất hay dùng với kính ngữ: **{何時|なんじ}に{伺|うかが}えばよろしいか、{教|おし}えていただけませんか**.',
    },
    {
      t: 'table',
      caption: 'Cách nối — 普通形 ＋ か (ナA, N bỏ だ)',
      head: ['Loại', 'Câu hỏi gốc', 'Lồng vào câu', 'Romaji'],
      rows: [
        ['V', '{会議|かいぎ}は{何時|なんじ}に{始|はじ}まりますか。', '{会議|かいぎ}が{何時|なんじ}に{始|はじ}まる**か**、{教|おし}えてください。', 'Kaigi ga nanji ni hajimaru ka, oshiete kudasai.'],
        ['V (quá khứ)', '{誰|だれ}が{来|き}ましたか。', '{誰|だれ}が{来|き}た**か**、わかりません。', 'Dare ga kita ka, wakarimasen.'],
        ['イA', 'どれがいいですか。', 'どれがいい**か**、{選|えら}んでください。', 'Dore ga ii ka, erande kudasai.'],
        ['ナA', 'どこが{便利|べんり}ですか。', 'どこが{便利|べんり}**か**、{調|しら}べてみます。', 'Doko ga benri ka, shirabete mimasu.'],
        ['N', '{担当|たんとう}は{誰|だれ}ですか。', '{担当|たんとう}が{誰|だれ}**か**、{知|し}っていますか。', 'Tantou ga dare ka, shitte imasu ka.'],
        ['N (quá khứ)', '{試験|しけん}はいつでしたか。', '{試験|しけん}がいつだった**か**、{覚|おぼ}えていません。', 'Shiken ga itsu datta ka, oboete imasen.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '疑問詞 ＋ 普通形 ＋ か、～（{教|おし}えてください／わかりません／{知|し}っていますか…）',
          vi: 'ナA và N **bỏ だ** trước か ({便利|べんり}か, {誰|だれ}か) — nhưng giữ だった ở quá khứ. Trong câu lồng, chủ ngữ hay đổi は → **が** ({会議|かいぎ}**が**{何時|なんじ}に{始|はじ}まるか). Trợ từ を／が sau か thường lược.',
          examples: [
            E('{面接|めんせつ}で{何|なに}を{聞|き}かれるか、{心配|しんぱい}です。', 'Mensetsu de nani o kikareru ka, shinpai desu.', 'Tôi lo không biết sẽ bị hỏi gì trong buổi phỏng vấn.'),
            E('{会社|かいしゃ}までどうやって{行|い}けばいいか、{教|おし}えていただけませんか。', 'Kaisha made douyatte ikeba ii ka, oshiete itadakemasen ka.', 'Anh/chị chỉ cho tôi nên đi đến công ty bằng cách nào được không ạ?'),
            E('{森課長|もりかちょう}が{何時|なんじ}にお{戻|もど}りになるか、ご{存|ぞん}じですか。', 'Mori-kachou ga nanji ni omodori ni naru ka, gozonji desu ka.', 'Anh/chị có biết mấy giờ trưởng phòng Mori quay lại không ạ?'),
            E('どの{会社|かいしゃ}に{応募|おうぼ}するか、まだ{決|き}めていません。', 'Dono kaisha ni oubo suru ka, mada kimete imasen.', 'Tôi vẫn chưa quyết định sẽ ứng tuyển vào công ty nào.'),
            E('{昨日|きのう}{何|なに}を{食|た}べたか、{覚|おぼ}えていますか。', 'Kinou nani o tabeta ka, oboete imasu ka.', 'Bạn có nhớ hôm qua đã ăn gì không?'),
            E('{新|あたら}しい{上司|じょうし}がどんな{人|ひと}か、{楽|たの}しみです。', 'Atarashii joushi ga donna hito ka, tanoshimi desu.', 'Tôi háo hức không biết sếp mới là người thế nào.'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: '⚠ Lỗi hay mắc ở ⑨',
      items: [
        '**Giữ だ trước か**: ~~どこが{静|しず}かだか~~, ~~{誰|だれ}だか~~ (văn nói thân mật có gặp, nhưng chuẩn là bỏ) → **{静|しず}かか**, **{誰|だれ}か**.',
        '**Để nguyên thể です・ます trong câu lồng**: ~~{何時|なんじ}に{始|はじ}まりますか、{教|おし}えてください~~ (thành hai câu rời) → **{何時|なんじ}に{始|はじ}まるか**、{教|おし}えてください.',
        '**Quên か**: ~~どこにある{教|おし}えてください~~ → どこにある**か**、{教|おし}えてください. Và đừng nhầm với **～かどうか** (⑩): có từ để hỏi thì **không** dùng かどうか: ~~{何時|なんじ}に{始|はじ}まるかどうか~~.',
      ],
    },
    { t: 'rule', formula: '疑問詞 ＋ 普通形(ナA・N bỏ だ) ＋ か、V（教えてください・わかりません・知っています…）', vi: 'Câu hỏi có từ để hỏi nằm trong câu lớn. Dùng để hỏi lịch sự, gián tiếp.' },

    /* ══════ ⑩ 〜かどうか ══════ */
    { t: 'h', text: '⑩ 普通形 ＋ かどうか — "có … hay không"' },
    {
      t: 'p',
      text: 'Khi câu hỏi **không có từ để hỏi** — câu hỏi "có / không" (はい／いいえ) — muốn lồng vào câu lớn thì dùng **～かどうか**: {明日|あした}{行|い}けますか → {明日|あした}{行|い}ける**かどうか**、わかりません ("tôi không biết ngày mai có đi được hay không"). Cách nối giống ⑨: **普通形 ＋ かどうか**, ナA / N **bỏ だ**: {本当|ほんとう}かどうか, {静|しず}かかどうか, {合格|ごうかく}かどうか. Rất hay đi với: わかりません・{確認|かくにん}します・{聞|き}いてみます・{教|おし}えてください・{考|かんが}えています・{心配|しんぱい}です.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～かどうか',
      head: ['Loại', 'Câu hỏi có/không', 'Lồng vào câu', 'Romaji'],
      rows: [
        ['V', '{来週|らいしゅう}{来|こ}られますか。', '{来週|らいしゅう}{来|こ}られる**かどうか**、まだわかりません。', 'Raishuu korareru ka dou ka, mada wakarimasen.'],
        ['V (quá khứ)', 'メールは{届|とど}きましたか。', 'メールが{届|とど}いた**かどうか**、{確認|かくにん}していただけますか。', 'Meeru ga todoita ka dou ka, kakunin shite itadakemasu ka.'],
        ['イA', 'この{店|みせ}はおいしいですか。', 'この{店|みせ}がおいしい**かどうか**、{食|た}べてみないとわかりません。', 'Kono mise ga oishii ka dou ka, tabete minai to wakarimasen.'],
        ['ナA', 'その{部屋|へや}は{静|しず}かですか。', 'その{部屋|へや}が{静|しず}か**かどうか**、{見|み}に{行|い}きます。', 'Sono heya ga shizuka ka dou ka, mi ni ikimasu.'],
        ['N', 'その{話|はなし}は{本当|ほんとう}ですか。', 'その{話|はなし}が{本当|ほんとう}**かどうか**、{誰|だれ}も{知|し}りません。', 'Sono hanashi ga hontou ka dou ka, dare mo shirimasen.'],
      ],
    },
    {
      t: 'table',
      caption: '⑨ ～か ↔ ⑩ ～かどうか — chọn thế nào',
      head: ['Câu hỏi gốc', 'Có từ để hỏi?', 'Lồng vào', 'Ví dụ'],
      rows: [
        ['{何時|なんじ}に{来|き}ますか。', 'có ({何時|なんじ})', '**～か**', '{何時|なんじ}に{来|く}るか{教|おし}えてください。'],
        ['{明日|あした}{来|き}ますか。', 'không', '**～かどうか**', '{明日|あした}{来|く}るかどうか{教|おし}えてください。'],
        ['どの{会社|かいしゃ}がいいですか。', 'có (どの)', '**～か**', 'どの{会社|かいしゃ}がいいかわかりません。'],
        ['この{会社|かいしゃ}はいいですか。', 'không', '**～かどうか**', 'この{会社|かいしゃ}がいいかどうかわかりません。'],
        ['A ですか、B ですか。', 'lựa chọn', '**～か～か**', '{行|い}くか{行|い}かないか、{決|き}めてください。 (= {行|い}くかどうか)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '普通形 ＋ かどうか、～（わかりません／{確認|かくにん}します／{教|おし}えてください…）',
          vi: '= "có … hay không". Cách nói tương đương: **～か～ないか** ({行|い}くか{行|い}かないか). ⚠ Không ghép かどうか với từ để hỏi.',
          examples: [
            E('{留学生|りゅうがくせい}でも{応募|おうぼ}できるかどうか、{教|おし}えていただけませんか。', 'Ryuugakusei demo oubo dekiru ka dou ka, oshiete itadakemasen ka.', 'Anh/chị cho tôi biết du học sinh có ứng tuyển được hay không ạ?'),
            E('{先生|せんせい}が{大会|たいかい}にいらっしゃるかどうか、まだわかりません。', 'Sensei ga taikai ni irassharu ka dou ka, mada wakarimasen.', 'Vẫn chưa biết thầy có đến cuộc thi hay không.'),
            E('{履歴書|りれきしょ}が{届|とど}いたかどうか、{電話|でんわ}で{確認|かくにん}しました。', 'Rirekisho ga todoita ka dou ka, denwa de kakunin shimashita.', 'Tôi đã gọi điện xác nhận xem sơ yếu lý lịch đã đến chưa.'),
            E('{合格|ごうかく}かどうかは、{来週|らいしゅう}わかります。', 'Goukaku ka dou ka wa, raishuu wakarimasu.', 'Đỗ hay không thì tuần sau sẽ biết.'),
            E('この{服|ふく}で{面接|めんせつ}に{行|い}ってもいいかどうか、{先輩|せんぱい}に{聞|き}いてみます。', 'Kono fuku de mensetsu ni itte mo ii ka dou ka, senpai ni kiite mimasu.', 'Tôi sẽ thử hỏi đàn anh xem mặc bộ này đi phỏng vấn có được không.'),
            E('{日本|にほん}で{働|はたら}くかどうか、{家族|かぞく}と{相談|そうだん}しています。', 'Nihon de hataraku ka dou ka, kazoku to soudan shite imasu.', 'Tôi đang bàn với gia đình xem có làm việc ở Nhật hay không.'),
          ],
        },
      ],
    },
    DL('Hỏi ↔ đáp — gọi điện xác nhận (～か・～かどうか + kính ngữ)', [
      ['リン', 'c', 'お{忙|いそが}しいところ{恐|おそ}れ{入|い}ります。{先週|せんしゅう}{履歴書|りれきしょ}をお{送|おく}りしたリンと{申|もう}します。', 'Oisogashii tokoro osoreirimasu. Senshuu rirekisho o ookuri shita Rin to moushimasu.', 'Xin lỗi đã làm phiền lúc anh đang bận. Tôi là Linh, người đã gửi sơ yếu lý lịch tuần trước ạ.'],
      ['{人事部|じんじぶ}の{人|ひと}', 'examiner', 'はい、リンさんですね。', 'Hai, Rin-san desu ne.', 'Vâng, chị Linh phải không.'],
      ['リン', 'c', '{履歴書|りれきしょ}がそちらに{届|とど}いたかどうか、{確認|かくにん}していただけないでしょうか。', 'Rirekisho ga sochira ni todoita ka dou ka, kakunin shite itadakenai deshou ka.', 'Anh có thể kiểm tra giúp tôi xem sơ yếu lý lịch đã đến chỗ anh chưa ạ?'],
      ['{人事部|じんじぶ}の{人|ひと}', 'examiner', '{少々|しょうしょう}お{待|ま}ちください。……はい、{届|とど}いております。', 'Shoushou omachi kudasai. …… Hai, todoite orimasu.', 'Xin chờ một chút. … Vâng, đã đến rồi ạ.'],
      ['リン', 'c', 'よかったです。それから、{面接|めんせつ}がいつになるか、もう{決|き}まっていますか。', 'Yokatta desu. Sorekara, mensetsu ga itsu ni naru ka, mou kimatte imasu ka.', 'May quá ạ. Còn nữa, buổi phỏng vấn vào khi nào đã được quyết định chưa ạ?'],
      ['{人事部|じんじぶ}の{人|ひと}', 'examiner', '{来週|らいしゅう}の{月曜日|げつようび}に、メールでお{知|し}らせする{予定|よてい}です。', 'Raishuu no getsuyoubi ni, meeru de oshirase suru yotei desu.', 'Dự kiến thứ Hai tuần sau chúng tôi sẽ báo qua email.'],
      ['リン', 'c', 'かしこまりました。ありがとうございました。{失礼|しつれい}いたします。', 'Kashikomarimashita. Arigatou gozaimashita. Shitsurei itashimasu.', 'Tôi rõ rồi ạ. Cảm ơn anh. Chào anh ạ.'],
    ]),
    {
      t: 'note',
      title: '⚠ Lỗi hay mắc ở ⑩',
      items: [
        '~~{行|い}けますかどうか~~ (giữ ます) → **{行|い}けるかどうか** (普通形).',
        '~~{本当|ほんとう}だかどうか~~ → **{本当|ほんとう}かどうか** (N / ナA bỏ だ).',
        '~~いつ{来|く}るかどうか~~ → có từ để hỏi いつ ⇒ **いつ{来|く}るか** (⑨).',
        'Người Việt hay dịch "có … không" thành ~~～か、ないか~~ lủng củng. Nhớ khuôn: **[câu thường] ＋ かどうか ＋ [わかりません／{確認|かくにん}します]**.',
      ],
    },
    { t: 'rule', formula: '普通形(ナA・N bỏ だ) ＋ かどうか ＝ "có … hay không"', vi: 'Dùng cho câu hỏi có/không lồng vào câu lớn. Có từ để hỏi → dùng ～か (⑨), không dùng かどうか.' },

    {
      t: 'table',
      caption: 'Bảng thay thế ⑨ ⑩ — câu hỏi lồng + động từ chính hay đi kèm',
      head: ['Câu hỏi lồng', 'Động từ chính', 'Câu', 'Romaji'],
      rows: [
        ['{何時|なんじ}に{始|はじ}まるか', '{教|おし}えていただけませんか', '{説明会|せつめいかい}が{何時|なんじ}に{始|はじ}まるか、{教|おし}えていただけませんか。', 'Setsumeikai ga nanji ni hajimaru ka, oshiete itadakemasen ka.'],
        ['どこで{待|ま}てばいいか', '{伺|うかが}ってもよろしいでしょうか', 'どこで{待|ま}てばいいか、{伺|うかが}ってもよろしいでしょうか。', 'Doko de mateba ii ka, ukagatte mo yoroshii deshou ka.'],
        ['{誰|だれ}が{担当|たんとう}か', 'ご{存|ぞん}じですか', 'この{件|けん}は{誰|だれ}が{担当|たんとう}か、ご{存|ぞん}じですか。', 'Kono ken wa dare ga tantou ka, gozonji desu ka.'],
        ['{何|なに}を{持|も}っていけばいいか', '{確認|かくにん}します', '{何|なに}を{持|も}っていけばいいか、{確認|かくにん}します。', 'Nani o motte ikeba ii ka, kakunin shimasu.'],
        ['{合格|ごうかく}かどうか', 'メールでお{知|し}らせします', '{合格|ごうかく}かどうか、メールでお{知|し}らせします。', 'Goukaku ka dou ka, meeru de oshirase shimasu.'],
        ['{資料|しりょう}が{届|とど}いたかどうか', '{確認|かくにん}していただけますか', '{資料|しりょう}が{届|とど}いたかどうか、{確認|かくにん}していただけますか。', 'Shiryou ga todoita ka dou ka, kakunin shite itadakemasu ka.'],
        ['{先生|せんせい}がいらっしゃるかどうか', '{聞|き}いてみます', '{先生|せんせい}がいらっしゃるかどうか、{聞|き}いてみます。', 'Sensei ga irassharu ka dou ka, kiite mimasu.'],
        ['{日本|にほん}で{働|はたら}くかどうか', '{迷|まよ}っています', '{日本|にほん}で{働|はたら}くかどうか、{迷|まよ}っています。', 'Nihon de hataraku ka dou ka, mayotte imasu.'],
      ],
    },

    /* ══════ TỔNG HỢP ══════ */
    { t: 'h', text: 'Tổng hợp — lỗi người Việt hay mắc nhất với kính ngữ (đọc trước khi làm bài)' },
    {
      t: 'table',
      caption: '⭐ 12 lỗi kinh điển — sai → đúng → vì sao',
      head: ['#', 'SAI', 'ĐÚNG', 'Vì sao'],
      rows: [
        ['1', '~~{私|わたし}は{明日|あした}いらっしゃいます~~', '{私|わたし}は{明日|あした}{参|まい}ります', 'tôn kính cho bản thân — mình làm thì khiêm nhường'],
        ['2', '~~{私|わたし}もお{茶|ちゃ}を{召|め}し{上|あ}がります~~', '{私|わたし}もお{茶|ちゃ}をいただきます', 'như trên'],
        ['3', '~~{先生|せんせい}が{私|わたし}の{作文|さくぶん}を{拝見|はいけん}しました~~', '{先生|せんせい}が{私|わたし}の{作文|さくぶん}をご{覧|らん}になりました', 'khiêm nhường cho người trên — phải tôn kính'],
        ['4', '~~{社長|しゃちょう}はいらっしゃります~~', '{社長|しゃちょう}はいらっしゃいます', 'bẫy chia: いらっしゃる・おっしゃる・なさる・くださる → ～います'],
        ['5', '~~{先生|せんせい}がお{見|み}になりました~~', '{先生|せんせい}がご{覧|らん}になりました', 'thân ます 1 âm không ghép お～になる'],
        ['6', '~~{先生|せんせい}がおっしゃられました~~', '{先生|せんせい}がおっしゃいました', '二重敬語 — kính ngữ chồng hai lần'],
        ['7', '(với khách) ~~{森課長|もりかちょう}はいらっしゃいません~~', '{森|もり}はただいま{席|せき}を{外|はず}しております', 'うち・そと: sếp mình là người nhà khi nói với khách'],
        ['8', '~~どうぞ、{拝見|はいけん}してください~~', 'どうぞ、ご{覧|らん}ください', 'khiêm nhường không dùng để mời'],
        ['9', '~~お{待|ま}ってください~~ ／ ~~ご{利用|りよう}してください~~', 'お{待|ま}ちください ／ ご{利用|りよう}ください', 'trộn hai mẫu'],
        ['10', '~~ご{電話|でんわ}します~~ ／ ~~お{連絡|れんらく}します~~', 'お{電話|でんわ}します ／ ご{連絡|れんらく}します', 'お／ご: 電話 là ngoại lệ đi với お; 連絡 đi với ご'],
        ['11', '~~{先生|せんせい}、{荷物|にもつ}を{持|も}ってさしあげましょうか~~', '{先生|せんせい}、お{荷物|にもつ}をお{持|も}ちしましょうか', '～てさしあげる nghe như kể ơn'],
        ['12', '~~{明日|あした}{来|こ}られますかどうか~~ ／ ~~{本当|ほんとう}だかどうか~~', '{明日|あした}{来|こ}られるかどうか ／ {本当|ほんとう}かどうか', 'かどうか đi sau 普通形, N／ナA bỏ だ'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — cùng một ý, ba người làm',
      head: ['Ý', 'Thầy / sếp / khách làm (尊敬語)', 'Mình làm (謙譲語)', 'Bạn bè (普通形)'],
      rows: [
        ['đến (công ty)', '{社長|しゃちょう}が{会社|かいしゃ}にいらっしゃいました。', '{私|わたし}が{会社|かいしゃ}に{参|まい}りました。', '{会社|かいしゃ}に{来|き}たよ。'],
        ['nói', '{先生|せんせい}が「がんばって」とおっしゃいました。', '{私|わたし}が「がんばります」と{申|もう}しました。', '「がんばる」って{言|い}った。'],
        ['ăn trưa', '{部長|ぶちょう}はもうお{昼|ひる}を{召|め}し{上|あ}がりました。', '{私|わたし}はもうお{昼|ひる}をいただきました。', 'もう{昼|ひる}ご{飯|はん}{食|た}べた。'],
        ['xem tài liệu', '{課長|かちょう}が{資料|しりょう}をご{覧|らん}になりました。', '{私|わたし}が{資料|しりょう}を{拝見|はいけん}しました。', '{資料|しりょう}、{見|み}た。'],
        ['gửi email', '{田村様|たむらさま}がメールをお{送|おく}りになりました。', '{私|わたし}がメールをお{送|おく}りしました。', 'メール{送|おく}ったよ。'],
        ['biết', '{先生|せんせい}はこのことをご{存|ぞん}じです。', '{私|わたし}はこのことを{存|ぞん}じております。', 'このこと、{知|し}ってる。'],
      ],
    },

    /* ══════ LUYỆN TỔNG HỢP ══════ */
    { t: 'h', text: 'Luyện tổng hợp — sửa câu, ghép câu, đổi sang kính ngữ, điền, trắc nghiệm kiểu đề N4' },
    {
      t: 'quiz',
      id: 'b24-np-sua',
      title: 'Sửa câu sai — gõ lại cả câu cho đúng (10 câu)',
      kind: 'translate',
      grammar: 'Mỗi câu có MỘT lỗi: sai loại kính ngữ (tôn kính ↔ khiêm nhường), sai cách chia, sai うち・そと, sai お／ご, hoặc sai cách nối ～か・～かどうか',
      items: [
        { q: '{私|わたし}は{明日|あした}{会社|かいしゃ}に~~いらっしゃいます~~。', answers: V('{私|わたし}は{明日|あした}{会社|かいしゃ}に{参|まい}ります。', '{私|わたし}は{明日|あした}{会社|かいしゃ}に{伺|うかが}います。'), hint: 'mình làm → khiêm nhường' },
        { q: '{先生|せんせい}は{今|いま}、{職員室|しょくいんしつ}に~~いらっしゃります~~。', answers: V('{先生|せんせい}は{今|いま}、{職員室|しょくいんしつ}にいらっしゃいます。'), hint: 'いらっしゃる → ～います' },
        { q: '{社長|しゃちょう}が{私|わたし}の{資料|しりょう}を~~{拝見|はいけん}しました~~。', answers: V('{社長|しゃちょう}が{私|わたし}の{資料|しりょう}をご{覧|らん}になりました。'), hint: 'người trên xem → ご覧になる' },
        { q: 'どうぞ、こちらで~~お{待|ま}ってください~~。', answers: V('どうぞ、こちらでお{待|ま}ちください。'), hint: 'お＋Vます＋ください' },
        { q: '{部長|ぶちょう}が~~お{見|み}になりました~~。', answers: V('{部長|ぶちょう}がご{覧|らん}になりました。'), hint: '見る → ご覧になる' },
        { q: '{先生|せんせい}が「{明日|あした}{休|やす}みです」と~~おっしゃられました~~。', answers: V('{先生|せんせい}が「{明日|あした}{休|やす}みです」とおっしゃいました。'), hint: 'không chồng られる' },
        { q: '(nói với khách) ~~{森課長|もりかちょう}は~~ただいま{外出|がいしゅつ}しております。', answers: V('{森|もり}はただいま{外出|がいしゅつ}しております。'), hint: 'うち・そと: bỏ 課長' },
        { q: 'あとで~~ご{電話|でんわ}~~します。', answers: V('あとでお{電話|でんわ}します。', '{後|のち}ほどお{電話|でんわ}します。', '{後|のち}ほどお{電話|でんわ}いたします。'), hint: '電話 → お' },
        { q: '{会議|かいぎ}が{何時|なんじ}に~~{始|はじ}まりますか~~、{教|おし}えてください。', answers: V('{会議|かいぎ}が{何時|なんじ}に{始|はじ}まるか、{教|おし}えてください。', '{会議|かいぎ}は{何時|なんじ}に{始|はじ}まるか、{教|おし}えてください。'), hint: '普通形 ＋ か' },
        { q: 'その{話|はなし}が~~{本当|ほんとう}だかどうか~~、わかりません。', answers: V('その{話|はなし}が{本当|ほんとう}かどうか、わかりません。', 'その{話|はなし}は{本当|ほんとう}かどうか、わかりません。'), hint: 'N ＋ かどうか (bỏ だ)' },
      ],
    },
    {
      t: 'build',
      id: 'b24-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Thầy Honda có ở đây không ạ?', chips: ['{本田先生|ほんだせんせい}は', 'いらっしゃいますか', '{参|まい}りますか', 'おりますか'], answer: ['{本田先生|ほんだせんせい}は', 'いらっしゃいますか'], ro: 'Honda-sensei wa irasshaimasu ka.' },
        { vi: 'Tôi tên là Vương, du học sinh.', chips: ['わたくし、', '{留学生|りゅうがくせい}の', 'ワンと', '{申|もう}します', 'おっしゃいます'], answer: ['わたくし、', '{留学生|りゅうがくせい}の', 'ワンと', '{申|もう}します'], ro: 'Watakushi, ryuugakusei no Wan to moushimasu.' },
        { vi: 'Xin vui lòng chờ một chút.', chips: ['{少々|しょうしょう}', 'お{待|ま}ち', 'ください', 'お{待|ま}って', 'します'], answer: ['{少々|しょうしょう}', 'お{待|ま}ち', 'ください'], ro: 'Shoushou omachi kudasai.' },
        { vi: 'Giám đốc đã về rồi ạ.', chips: ['{社長|しゃちょう}は', 'もう', 'お{帰|かえ}りに', 'なりました', 'お{帰|かえ}り', 'しました'], answer: ['{社長|しゃちょう}は', 'もう', 'お{帰|かえ}りに', 'なりました'], ro: 'Shachou wa mou okaeri ni narimashita.' },
        { vi: 'Để tôi xách hành lý giúp nhé?', chips: ['お{荷物|にもつ}を', 'お{持|も}ち', 'しましょうか', 'になりましょうか', '{持|も}って'], answer: ['お{荷物|にもつ}を', 'お{持|も}ち', 'しましょうか'], ro: 'Onimotsu o omochi shimashou ka.' },
        { vi: 'Tôi xin dẫn anh/chị lên phòng tiếp khách.', chips: ['{応接室|おうせつしつ}に', 'ご{案内|あんない}', 'いたします', 'なさいます', 'ください'], answer: ['{応接室|おうせつしつ}に', 'ご{案内|あんない}', 'いたします'], ro: 'Ousetsushitsu ni goannai itashimasu.' },
        { vi: 'Mời anh/chị dùng trà.', chips: ['どうぞ、', 'お{茶|ちゃ}を', '{召|め}し{上|あ}がって', 'ください', 'いただいて'], answer: ['どうぞ、', 'お{茶|ちゃ}を', '{召|め}し{上|あ}がって', 'ください'], ro: 'Douzo, ocha o meshiagatte kudasai.' },
        { vi: 'Tôi đã được thầy xem giúp bài văn.', chips: ['{先生|せんせい}に', '{作文|さくぶん}を', '{見|み}て', 'いただきました', 'くださいました', '{先生|せんせい}が'], answer: ['{先生|せんせい}に', '{作文|さくぶん}を', '{見|み}て', 'いただきました'], alt: [['{作文|さくぶん}を', '{先生|せんせい}に', '{見|み}て', 'いただきました']], ro: 'Sensei ni sakubun o mite itadakimashita.' },
        { vi: 'Anh Mori hiện không có ở chỗ ngồi. (nói với khách)', chips: ['{森|もり}は', 'ただいま', '{席|せき}を', '{外|はず}しております', '{森課長|もりかちょう}は', 'いらっしゃいません'], answer: ['{森|もり}は', 'ただいま', '{席|せき}を', '{外|はず}しております'], ro: 'Mori wa tadaima seki o hazushite orimasu.' },
        { vi: 'Nhà vệ sinh ở tầng 2 ạ.', chips: ['お{手洗|てあら}いは', '2{階|かい}に', 'ございます', 'でございます', 'いらっしゃいます'], answer: ['お{手洗|てあら}いは', '2{階|かい}に', 'ございます'], ro: 'Otearai wa nikai ni gozaimasu.' },
        { vi: 'Cho tôi biết mấy giờ thì bắt đầu.', chips: ['{何時|なんじ}に', '{始|はじ}まるか', '{教|おし}えて', 'ください', '{始|はじ}まるかどうか', '{始|はじ}まりますか'], answer: ['{何時|なんじ}に', '{始|はじ}まるか', '{教|おし}えて', 'ください'], ro: 'Nanji ni hajimaru ka oshiete kudasai.' },
        { vi: 'Tôi chưa biết có đi được hay không.', chips: ['{行|い}ける', 'かどうか', 'まだ', 'わかりません', 'か', '{行|い}けます'], answer: ['{行|い}ける', 'かどうか', 'まだ', 'わかりません'], alt: [['まだ', '{行|い}ける', 'かどうか', 'わかりません']], ro: 'Ikeru ka dou ka mada wakarimasen.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b24-np-chia',
      title: 'Đổi sang kính ngữ — gõ dạng được yêu cầu (14 câu)',
      kind: 'fill',
      grammar: 'Tôn kính: お＋Vます＋になる · ご＋N＋になる · V(ら)れる · động từ đặc biệt · お～ください ／ Khiêm nhường: お＋Vます＋する · ご＋N＋する · động từ đặc biệt',
      items: [
        { q: '{待|ま}つ → tôn kính お～になる (thể ます)', answers: V('お{待|ま}ちになります'), hint: 'お＋まち＋になります' },
        { q: '{帰|かえ}る → tôn kính お～になる (thể ました)', answers: V('お{帰|かえ}りになりました'), hint: 'お＋かえり＋になりました' },
        { q: '{利用|りよう}する → tôn kính ご～になる (thể ます)', answers: V('ご{利用|りよう}になります'), hint: 'ご＋りよう＋になります' },
        { q: '{書|か}く → tôn kính V(ら)れる (thể ます)', answers: V('{書|か}かれます'), hint: 'く → か＋れる' },
        { q: '{来|く}る → tôn kính V(ら)れる (thể ます)', answers: V('{来|こ}られます'), hint: 'こられる' },
        { q: '{言|い}う (người trên) → thể ました', answers: V('おっしゃいました'), hint: 'đặc biệt' },
        { q: '{見|み}る (người trên) → thể ました', answers: V('ご{覧|らん}になりました'), hint: 'đặc biệt' },
        { q: '{入|はい}ってください → お～ください', answers: V('お{入|はい}りください'), hint: 'お＋はいり＋ください' },
        { q: '{見|み}てください → (lịch sự)', answers: V('ご{覧|らん}ください'), hint: 'ごらん ください' },
        { q: '{持|も}つ (mình, cho người trên) → お～する (thể ます)', answers: V('お{持|も}ちします', 'お{持|も}ちいたします'), hint: 'お＋もち＋します' },
        { q: '{案内|あんない}する (mình) → ご～いたす (thể ます)', answers: V('ご{案内|あんない}いたします'), hint: 'ご＋あんない＋いたします' },
        { q: '{会|あ}う (mình gặp người trên) → đặc biệt (thể ます)', answers: V('お{目|め}にかかります', 'お{会|あ}いします'), hint: 'おめに かかる' },
        { q: '{知|し}っている (mình) → khiêm nhường (thể ます)', answers: V('{存|ぞん}じております'), hint: 'ぞんじて おります' },
        { q: '{休|やす}む (mình xin phép) → ～させていただきます', answers: V('{休|やす}ませていただきます'), hint: 'やすませて いただきます' },
      ],
    },
    {
      t: 'quiz',
      id: 'b24-np-dien',
      title: 'Điền vào chỗ trống — một từ (12 câu)',
      kind: 'fill',
      grammar: 'になる・する・ください · いらっしゃる・参る · おる・ござる · か・かどうか',
      items: [
        { q: '{社長|しゃちょう}はもうお{帰|かえ}りに（　）ました。', answers: ['なり'], hint: 'お～になる' },
        { q: '{資料|しりょう}はメールでお{送|おく}り（　）ます。', answers: ['し', 'いたし'], hint: 'お～する (mình làm)' },
        { q: 'どうぞ、お{掛|か}け（　）。', answers: ['ください'], hint: 'お～ください' },
        { q: '{先生|せんせい}は{今|いま}、{研究室|けんきゅうしつ}に（　）。', answers: ['いらっしゃいます', 'おいでになります'], hint: 'いる (người trên)' },
        { q: '{明日|あした}、わたくしがそちらへ（　）。', answers: V('{参|まい}ります', '{伺|うかが}います'), hint: '行く (mình)' },
        { q: '{父|ちち}は{今|いま}、{家|いえ}に（　）。 (nói với thầy)', answers: ['おります'], hint: 'いる (người nhà mình)' },
        { q: 'お{手洗|てあら}いは2{階|かい}に（　）。', answers: ['ございます'], hint: 'あります → lịch sự cao' },
        { q: 'こちらが{会議室|かいぎしつ}で（　）。', answers: ['ございます'], hint: 'です → lịch sự cao' },
        { q: '{会議|かいぎ}が{何時|なんじ}に{終|お}わる（　）、わかりません。', answers: ['か'], hint: 'có từ để hỏi' },
        { q: '{明日|あした}{雨|あめ}が{降|ふ}る（　）、わかりません。', answers: ['かどうか'], hint: 'không có từ để hỏi' },
        { q: '{先生|せんせい}に{作文|さくぶん}を{直|なお}して（　）ました。 (tôi được thầy sửa cho)', answers: ['いただき'], hint: '～てもらう → khiêm nhường' },
        { q: '{先生|せんせい}が{作文|さくぶん}を{直|なお}して（　）ました。 (thầy sửa cho tôi)', answers: ['ください'], hint: '～てくれる → tôn kính' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-np-jlpt',
      title: 'Trắc nghiệm dạng đề JLPT N4 — 文法形式の判断 (10 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: '{先生|せんせい}、{明日|あした}のパーティーに（　）か。', options: ['{参|まい}ります', 'いらっしゃいます', 'おります', '{伺|うかが}います'], correct: 1, why: 'Hỏi việc của **thầy** → tôn kính **いらっしゃいます**. {参|まい}る・{伺|うかが}う・おる là khiêm nhường (cho mình). 〔Ashita no paatii ni irasshaimasu ka.〕' },
        { q: '{初|はじ}めまして。わたくし、ワンと（　）。', options: ['おっしゃいます', '{申|もう}します', '{申|もう}し{上|あ}げてください', 'いらっしゃいます'], correct: 1, why: 'Tự giới thiệu (mình nói) → **～と{申|もう}します**. 〔Wan to moushimasu.〕' },
        { q: '{部長|ぶちょう}はもうお{昼|ひる}ご{飯|はん}を（　）か。', options: ['いただきました', '{召|め}し{上|あ}がりました', '{拝見|はいけん}しました', 'お{食|た}べしました'], correct: 1, why: 'Trưởng ban ăn → tôn kính **{召|め}し{上|あ}がりました**. いただく là khiêm nhường. 〔Ohirugohan o meshiagarimashita ka.〕' },
        { q: '{先生|せんせい}、この{本|ほん}をもう（　）か。', options: ['ご{覧|らん}になりました', '{拝見|はいけん}しました', 'お{見|み}になりました', '{見|み}られました'], correct: 0, why: 'Thầy xem → **ご{覧|らん}になりました**. ~~お{見|み}になる~~ không có; {見|み}られる dễ hiểu lầm thành bị động / khả năng. 〔Mou goran ni narimashita ka.〕' },
        { q: '{重|おも}そうですね。その{荷物|にもつ}、（　）。', options: ['お{持|も}ちになりましょうか', 'お{持|も}ちしましょうか', '{持|も}っていらっしゃいましょうか', 'お{持|も}ちください'], correct: 1, why: 'Mình đề nghị giúp người trên → khiêm nhường **お{持|も}ちしましょうか**. 〔Omochi shimashou ka.〕' },
        { q: '（{電話|でんわ}で、お{客様|きゃくさま}に）「{申|もう}し{訳|わけ}ございません。{森|もり}はただいま（　）。」', options: ['いらっしゃいません', '{外出|がいしゅつ}なさっています', '{外出|がいしゅつ}しております', 'お{出|で}かけになっています'], correct: 2, why: 'Nói với **khách** về sếp mình (うち) → khiêm nhường **{外出|がいしゅつ}しております**. 〔Mori wa tadaima gaishutsu shite orimasu.〕' },
        { q: 'どうぞ、こちらに（　）。', options: ['お{座|すわ}りになります', 'お{掛|か}けください', 'お{掛|か}けします', '{座|すわ}らせていただきます'], correct: 1, why: 'Mời khách ngồi → **お{掛|か}けください** (お～ください). 〔Kochira ni okake kudasai.〕' },
        { q: '{先生|せんせい}が{駅|えき}まで{車|くるま}で{送|おく}って（　）。', options: ['いただきました', 'くださいました', 'さしあげました', 'まいりました'], correct: 1, why: 'Chủ ngữ **{先生|せんせい}が** → ～て**くださいました** (tôn kính của くれる). Nếu chủ ngữ là mình: {先生|せんせい}**に**～ていただきました. 〔Okutte kudasaimashita.〕' },
        { q: '{明日|あした}の{会議|かいぎ}に{出|で}られる（　）、{後|のち}ほどお{知|し}らせします。', options: ['か', 'かどうか', 'と', 'ので'], correct: 1, why: 'Câu hỏi có/không (không có từ để hỏi) → **かどうか**. 〔Derareru ka dou ka, nochihodo oshirase shimasu.〕' },
        { q: '{面接|めんせつ}が{何時|なんじ}から（　）、{教|おし}えていただけませんか。', options: ['ですか', 'か', 'かどうか', 'だか'], correct: 1, why: 'Có từ để hỏi {何時|なんじ} + N → **{何時|なんじ}からか** (bỏ だ). 〔Mensetsu ga nanji kara ka, oshiete itadakemasen ka.〕' },
        { q: '★ {先生|せんせい}は ＿＿ ＿＿ ★ ＿＿ か。（ご{存|ぞん}じです／{森|もり}さんが／{来|く}るか／{何時|なんじ}に）', options: ['ご{存|ぞん}じです', '{森|もり}さんが', '{来|く}るか', '{何時|なんじ}に'], correct: 2, why: 'Câu đúng: {先生|せんせい}は **{森|もり}さんが {何時|なんじ}に {来|く}るか ご{存|ぞん}じです** か. Ô ★ (thứ 3) = **{来|く}るか**. 〔Mori-san ga nanji ni kuru ka gozonji desu ka.〕' },
        { q: '★ {本日|ほんじつ}は ＿＿ ＿＿ ★ ＿＿ ございます。（お{時間|じかん}を／ありがとう／お{忙|いそが}しいところ／いただき）', options: ['お{時間|じかん}を', 'ありがとう', 'お{忙|いそが}しいところ', 'いただき'], correct: 3, why: 'Câu đúng: {本日|ほんじつ}は **お{忙|いそが}しいところ お{時間|じかん}を いただき ありがとう** ございます. Ô ★ (thứ 3) = **いただき**. 〔Oisogashii tokoro ojikan o itadaki arigatou gozaimasu.〕' },
        { q: '★ {資料|しりょう}を ＿＿ ＿＿ ★ ＿＿ ください。（ご{連絡|れんらく}／かどうか／{届|とど}いた／お{送|おく}りしましたが）', options: ['ご{連絡|れんらく}', 'かどうか', '{届|とど}いた', 'お{送|おく}りしましたが'], correct: 1, why: 'Câu đúng: {資料|しりょう}を **お{送|おく}りしましたが {届|とど}いた かどうか ご{連絡|れんらく}** ください. Ô ★ (thứ 3) = **かどうか**. 〔Okuri shimashita ga, todoita ka dou ka gorenraku kudasai.〕' },
        { q: '★ わたくしが ＿＿ ＿＿ ★ ＿＿ いたします。（{会議室|かいぎしつ}まで／お{客様|きゃくさま}を／ご{案内|あんない}／{受付|うけつけ}から）', options: ['{会議室|かいぎしつ}まで', 'お{客様|きゃくさま}を', 'ご{案内|あんない}', '{受付|うけつけ}から'], correct: 0, why: 'Câu đúng: わたくしが **お{客様|きゃくさま}を {受付|うけつけ}から {会議室|かいぎしつ}まで ご{案内|あんない}** いたします. Ô ★ (thứ 3) = **{会議室|かいぎしつ}まで**. 〔Okyakusama o uketsuke kara kaigishitsu made goannai itashimasu.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b24-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 15 chữ: 訪 敬 尊 存 伺 拝 召 課 係 担 談 職 紹 介 応',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 15 chữ Hán mới của Bài 24 trong các từ hay gặp khi đến công ty, gọi điện, dùng kính ngữ (訪問・訪ねる・敬語・尊敬・ご存じ・伺う・拝見・召し上がる・課長・係・担当・相談・就職・職員室・紹介・応接室…), chọn đúng chữ khi đề cho hiragana, phân biệt chữ trông giống (訪・話, 敬・警・驚, 尊・導, 存・在, 伺・何・司, 召・招・紹, 課・果, 係・系・孫, 担・但, 談・淡, 職・識・織, 介・今, 応・広), viết tay được các chữ ✍.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 24 là **15 chữ** đi theo đúng các từ của chủ đề **thăm công ty, gọi điện, kính ngữ**: 訪 敬 尊 存 伺 拝 召 課 係 担 談 職 紹 介 応 — phần lớn là **N3** theo các bảng tham khảo phổ biến (伺・拝・召 có bảng xếp N2, 課 có bảng xếp N4; JLPT không công bố danh sách chữ chính thức). Cột **Mức**: ✍ = nên viết được, 👁 = nhận mặt (đọc + hiểu). Nhiều chữ là chữ của **từ đã học** — nay mới học mặt chữ: {相談|そうだん} (Bài 17), {就職|しゅうしょく} (Bài 16), {担当|たんとう} (Bài 23), {敬語|けいご} (Bài 16), {紹介|しょうかい} (Bài 22), {応募|おうぼ} (Bài 16). Ba chữ **伺 拝 召** gần như chỉ gặp trong **kính ngữ** ({伺|うかが}う, {拝見|はいけん}, {召|め}し{上|あ}がる) — đọc được là đủ. Học **theo từ**: {訪問|ほうもん} (houmon), {尊敬|そんけい} (sonkei), {課長|かちょう} (kachou), {担当|たんとう} (tantou), {紹介|しょうかい} (shoukai).',
    },
    {
      t: 'table',
      caption: '15 chữ Hán mới của Bài 24',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['訪', 'PHỎNG', 'ホウ', 'たず(ねる)・おとず(れる)', 'thăm, hỏi thăm', '{訪問|ほうもん} (thăm) · {会社訪問|かいしゃほうもん} · {訪|たず}ねる (đến thăm) · {訪|おとず}れる (ghé thăm — N2)', '✍ N3'],
        ['敬', 'KÍNH', 'ケイ', 'うやま(う)', 'kính trọng', '{敬語|けいご} (kính ngữ — Bài 16) · {尊敬|そんけい} (kính trọng) · {敬|うやま}う (kính — N1)', '👁 N3'],
        ['尊', 'TÔN', 'ソン', 'たっと(い)・とうと(い)・たっと(ぶ)・とうと(ぶ)', 'tôn quý, tôn kính', '{尊敬|そんけい} · {尊敬語|そんけいご} (tôn kính ngữ) · {尊重|そんちょう} (tôn trọng — N2)', '👁 N3'],
        ['存', 'TỒN', 'ソン・ゾン', '—', 'tồn tại; biết (trong kính ngữ)', 'ご{存|ぞん}じ (người trên biết) · {存|ぞん}じる (tôi biết) · {保存|ほぞん} (lưu, bảo quản — N2)', '👁 N3'],
        ['伺', 'TỨ', 'シ', 'うかが(う)', 'hỏi thăm, hầu (khiêm nhường)', '{伺|うかが}う (hỏi; đến thăm — khiêm nhường) · {伺|うかが}いたいこと (điều muốn hỏi)', '👁 N2–N3'],
        ['拝', 'BÁI', 'ハイ', 'おが(む)', 'vái lạy, kính cẩn', '{拝見|はいけん} (xem — khiêm nhường) · {拝|おが}む (chắp tay vái) · {参拝|さんぱい} (viếng đền chùa — N2)', '👁 N2–N3'],
        ['召', 'TRIỆU', 'ショウ', 'め(す)', 'gọi đến, vời (kính)', '{召|め}し{上|あ}がる (dùng bữa — tôn kính) · {召|め}す (mặc, gọi — tôn kính, N1)', '👁 N2–N3'],
        ['課', 'KHOÁ', 'カ', '—', 'bài; phòng, ban', '{課長|かちょう} (trưởng phòng) · {第|だい}24{課|か} (bài 24) · {課題|かだい} (bài tập, vấn đề — N2) · {日課|にっか} (việc hằng ngày)', '✍ N4–N3'],
        ['係', 'HỆ', 'ケイ', 'かか(る)・かかり', 'liên quan; người phụ trách', '{係|かかり} (người phụ trách) · {係員|かかりいん} (nhân viên phụ trách) · {関係|かんけい} (quan hệ — N3)', '✍ N3'],
        ['担', 'ĐẢM', 'タン', 'かつ(ぐ)・にな(う)', 'gánh vác, đảm nhận', '{担当|たんとう} (phụ trách — Bài 23) · {担任|たんにん} (giáo viên chủ nhiệm — N2) · {負担|ふたん} (gánh nặng — N2)', '👁 N3'],
        ['談', 'ĐÀM', 'ダン', '—', 'nói chuyện, bàn bạc', '{相談|そうだん} (bàn bạc, xin ý kiến — Bài 17) · {面談|めんだん} (gặp trao đổi — N2) · {冗談|じょうだん} (đùa — N3)', '👁 N3'],
        ['職', 'CHỨC', 'ショク', '—', 'chức vụ, nghề nghiệp', '{就職|しゅうしょく} (đi làm — Bài 16) · {職員室|しょくいんしつ} (phòng giáo viên) · {職業|しょくぎょう} (nghề nghiệp — N3) · {職場|しょくば} (nơi làm việc — N3)', '✍ N3'],
        ['紹', 'THIỆU', 'ショウ', '—', 'nối, giới thiệu', '{紹介|しょうかい} (giới thiệu) · {自己紹介|じこしょうかい} (tự giới thiệu) · {紹介状|しょうかいじょう} (thư giới thiệu — N2)', '👁 N3'],
        ['介', 'GIỚI', 'カイ', '—', 'ở giữa, làm trung gian', '{紹介|しょうかい} · {介護|かいご} (chăm sóc người già, người bệnh — N2)', '✍ N3'],
        ['応', 'ỨNG', 'オウ', 'こた(える)', 'đáp lại, ứng', '{応接室|おうせつしつ} (phòng tiếp khách) · {応募|おうぼ} (ứng tuyển — Bài 16) · {対応|たいおう} (ứng phó — N2) · {反応|はんのう} (phản ứng — N2)', '👁 N3'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**訪** = 言 (lời nói) + 方 (phương — gợi âm ホウ): mang lời đi đến các phương để **hỏi thăm** = PHỎNG → {訪問|ほうもん}, {訪|たず}ねる. Đọc ホウ giống 方.',
        '**敬** = 苟 (cẩn trọng — phần trái) + 攵 (bàn tay cầm roi = hành động): luôn giữ mình **cẩn trọng** trước người trên = KÍNH → {敬語|けいご}, {尊敬|そんけい}. Chính 敬 nằm trong 警 ({警察|けいさつ} — Bài 19, thêm 言) và 驚 ({驚|おどろ}く — Bài 22, thêm 馬).',
        '**尊** = 酋 (bình rượu ngon) + 寸 (bàn tay): **hai tay nâng bình rượu dâng lên** người trên = TÔN → {尊敬|そんけい}. Cùng 寸 với 導 (dẫn — {指導|しどう}, N2).',
        '**存** — phần trên là biến thể của 才 (gợi âm), dưới là 子 (con): con cái được **gìn giữ**, còn mãi = TỒN → {保存|ほぞん}; trong kính ngữ: ご{存|ぞん}じ (biết). Khác 在 ({現在|げんざい} — "tồn tại" kiểu khác): dưới là 土 (đất).',
        '**伺** = 亻 (người) + 司 (quan coi việc — gợi âm シ): người **hầu bên cạnh** chờ hỏi ý chủ = TỨ (hầu, hỏi thăm) → {伺|うかが}う. Khác 何 (gì — Bài 1): bên phải 何 là 可; khác 司 (không có 亻).',
        '**拝** = 扌 (tay) + phần phải gợi hình hai bàn tay chắp: **chắp tay vái** = BÁI → {拝|おが}む, {拝見|はいけん} ("cúi đầu mà xem" — khiêm nhường).',
        '**召** = 刀 (gợi âm) + 口 (miệng): **dùng miệng gọi** người đến = TRIỆU → {召|め}し{上|あ}がる. 召 nằm trong 招 ({招待|しょうたい} — Bài 22: 扌 vẫy tay gọi) và 紹 (chữ mới của bài này: 糸 nối sợi chỉ). Ba chữ cùng đọc **ショウ**.',
        '**課** = 言 (lời) + 果 (quả, kết quả — gợi âm カ): **lời giao việc** để có kết quả = phần việc, BÀI ({第|だい}1{課|か}), rồi thành **phòng ban** nhận phần việc đó → {課長|かちょう}.',
        '**係** = 亻 (người) + 系 (sợi tơ nối — hệ): **người được nối với một việc** = HỆ (liên quan), người phụ trách → {係|かかり}, {関係|かんけい}. Khác 孫 (cháu — 子 + 系).',
        '**担** = 扌 (tay) + 旦 (bình minh — gợi âm タン): dùng **tay / vai gánh** = ĐẢM (gánh vác) → {担当|たんとう} (gánh phần việc), {負担|ふたん}. Khác 但 (nhưng — 亻 + 旦).',
        '**談** = 言 (lời) + 炎 (hai chữ 火 — lửa, gợi âm): **ngồi bên bếp lửa trò chuyện** = ĐÀM → {相談|そうだん}, {冗談|じょうだん}. Khác 淡 (nhạt — 氵 + 炎).',
        '**職** = 耳 (tai) + 音 (âm thanh) + 戈 (cây mác) — mẹo nhìn: **tai nghe hiệu lệnh, tay cầm mác làm nhiệm vụ** = CHỨC vụ → {就職|しゅうしょく}, {職場|しょくば}. Khác 識 (thức — {知識|ちしき}: trái là 言) và 織 (dệt: trái là 糸).',
        '**紹** = 糸 (sợi chỉ) + 召 (gọi): **nối sợi chỉ** gọi người này đến với người kia = THIỆU (giới thiệu) → {紹介|しょうかい}. Khác 招 (Bài 22): trái là 扌.',
        '**介** = 人 (người, mái che ở trên) + hai nét đứng hai bên: **người đứng giữa** hai bên = GIỚI (trung gian) → {紹介|しょうかい}, {介護|かいご}. Khác 今 (bây giờ): dưới 今 là 一 + ㇇.',
        '**応** = 广 (mái nhà) + 心 (tim): trong nhà, **lòng sẵn sàng đáp lại** = ỨNG → {応接室|おうせつしつ}, {応募|おうぼ}, {反応|はんのう}. Khác 広 ({広|ひろ}い — Bài 4): dưới 広 là ム.',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — đọc Kun hay On?',
      head: ['Chữ', 'Kun (đứng riêng + kana)', 'On (trong từ ghép)', 'Chú ý khi đọc'],
      rows: [
        ['訪', '{訪|たず}ねる · {訪|おとず}れる', '{訪問|ほうもん} (ホウ)', 'ほう**もん** — trường âm ほう'],
        ['敬', '({敬|うやま}う — N1)', '{敬語|けいご} · {尊敬|そんけい} (ケイ)', 'そん**けい** — けい viết けい, đọc kê dài'],
        ['尊', '(とうとい — văn viết)', '{尊敬|そんけい} · {尊重|そんちょう} (ソン)', '**そん**けい — không ~~ぞんけい~~'],
        ['存', '—', 'ご{存|ぞん}じ · {存|ぞん}じる (ゾン) · {保存|ほぞん} (ゾン)', 'kính ngữ đọc **ぞん** (đục) — ご**ぞん**じ'],
        ['伺', '{伺|うかが}う', '— (On シ rất hiếm)', 'う**か**がう — không ~~うがかう~~'],
        ['拝', '{拝|おが}む', '{拝見|はいけん} · {参拝|さんぱい} (ハイ／パイ)', 'はい**けん** · さん**ぱい** (ん + は → ぱ)'],
        ['召', '{召|め}し{上|あ}がる', '— (On ショウ hiếm ở N3)', '**め**しあがる — chữ 召 đọc め'],
        ['課', '—', '{課長|かちょう} · {第|だい}～{課|か} (カ)', '**か**ちょう — không ~~かいちょう~~ ({会長|かいちょう} là chủ tịch)'],
        ['係', '{係|かかり} · ～{係|がかり}', '{関係|かんけい} · {係員|かかりいん}(kun)', '{案内係|あんないがかり} — đứng sau đọc đục **がかり**'],
        ['担', '({担|かつ}ぐ — N2)', '{担当|たんとう} · {担任|たんにん} (タン)', 'たん**とう** — trường âm'],
        ['談', '—', '{相談|そうだん} · {冗談|じょうだん} (ダン)', 'そう**だん** — đục だ'],
        ['職', '—', '{就職|しゅうしょく} · {職場|しょくば} (ショク)', '**しょく** — không ~~しょっく~~'],
        ['紹', '—', '{紹介|しょうかい} (ショウ)', '**しょう**かい — trường âm しょう'],
        ['介', '—', '{紹介|しょうかい} · {介護|かいご} (カイ)', 'しょう**かい** — không ~~しょうがい~~ ({障害|しょうがい} là khuyết tật)'],
        ['応', '({応|こた}える — N1)', '{応接室|おうせつしつ} · {応募|おうぼ} (オウ)', '**おう**せつしつ — trường âm おう'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['訪 (thăm)', '話 ({話|はな}す)・方 (phương)', 'trái đều 言; phải 訪 là 方, phải 話 là 舌'],
        ['敬 (kính)', '警 ({警察|けいさつ})・驚 ({驚|おどろ}く)', '警 = 敬 + 言; 驚 = 敬 + 馬; 敬 đứng một mình'],
        ['尊 (tôn)', '導 (dẫn — {指導|しどう})・寺 (chùa)', 'cùng 寸 ở dưới; trên 尊 là 酋, trên 導 là 道'],
        ['存 (tồn)', '在 ({現在|げんざい})', 'dưới 存 là 子, dưới 在 là 土'],
        ['伺 (hầu, hỏi)', '何 (gì)・司 (ty)', '何 = 亻 + 可; 伺 = 亻 + 司'],
        ['召 (gọi)', '招 ({招待|しょうたい})・紹 ({紹介|しょうかい})', '召 đứng riêng; 招 thêm 扌; 紹 thêm 糸'],
        ['課 (bài, phòng)', '果 (quả)・菓 ({お菓子|おかし})', '課 = 言 + 果; 菓 = 艹 + 果'],
        ['係 (phụ trách)', '系 (hệ)・孫 (cháu)', '係 = 亻 + 系; 孫 = 子 + 系'],
        ['担 (gánh)', '但 (nhưng)・旦 (bình minh)', 'cùng 旦; trái 担 là 扌, trái 但 là 亻'],
        ['談 (đàm)', '淡 (nhạt)・炎 (lửa)', 'cùng 炎; trái 談 là 言, trái 淡 là 氵'],
        ['職 (chức)', '識 (thức)・織 (dệt)', 'cùng phần phải; trái 職 là 耳, 識 là 言, 織 là 糸'],
        ['紹 (thiệu)', '招 (chiêu — Bài 22)', 'cùng 召, cùng đọc ショウ; trái 紹 là 糸, trái 招 là 扌'],
        ['介 (giới)', '今 (bây giờ)・会 (hội)', 'cùng 人 ở trên; dưới 介 là hai nét đứng'],
        ['応 (ứng)', '広 ({広|ひろ}い)・心 (tim)', 'cùng 广; dưới 応 là 心, dưới 広 là ム'],
      ],
    },
    {
      t: 'table',
      caption: 'Ghép chữ mới với chữ đã học — đọc được cả từ',
      head: ['Ghép', 'Từ', 'Romaji', 'Nghĩa', 'Chữ đã học ở'],
      rows: [
        ['訪 + 問', '{訪問|ほうもん}', 'houmon', 'thăm', '問 (Bài 16)'],
        ['尊 + 敬', '{尊敬|そんけい}', 'sonkei', 'kính trọng', 'cả hai là chữ mới'],
        ['敬 + 語', '{敬語|けいご}', 'keigo', 'kính ngữ', '語 (Bài 1)'],
        ['拝 + 見', '{拝見|はいけん}', 'haiken', 'xem (khiêm nhường)', '見 (Bài 5)'],
        ['課 + 長', '{課長|かちょう}', 'kachou', 'trưởng phòng', '長 (Bài 8)'],
        ['係 + 員', '{係員|かかりいん}', 'kakariin', 'nhân viên phụ trách', '員 (Bài 1)'],
        ['担 + 当', '{担当|たんとう}', 'tantou', 'phụ trách', '当 (đã học)'],
        ['相 + 談', '{相談|そうだん}', 'soudan', 'bàn bạc, xin ý kiến', '相 (Bài 13)'],
        ['職 + 員 + 室', '{職員室|しょくいんしつ}', 'shokuinshitsu', 'phòng giáo viên', '員 (Bài 1)'],
        ['職 + 場', '{職場|しょくば}', 'shokuba', 'nơi làm việc', '場 (Bài 13)'],
        ['紹 + 介', '{紹介|しょうかい}', 'shoukai', 'giới thiệu', 'cả hai là chữ mới'],
        ['応 + 接 + 室', '{応接室|おうせつしつ}', 'ousetsushitsu', 'phòng tiếp khách', '接 (Bài 16)'],
        ['関 + 係', '{関係|かんけい}', 'kankei', 'quan hệ', '関 (N3 — học ở bài sau; đọc được cả từ)'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b24-doc-kanji',
      title: 'Đọc KHÔNG furigana — 20 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: '{来週|らいしゅう}、{先輩|せんぱい}と{会社訪問|かいしゃほうもん}をします。', ro: 'Raishuu, senpai to kaisha houmon o shimasu.', vi: 'Tuần sau tôi đi thăm công ty cùng đàn anh.' },
        { text: '{夏休|なつやす}みに{高校|こうこう}の{先生|せんせい}を{訪|たず}ねました。', ro: 'Natsuyasumi ni koukou no sensei o tazunemashita.', vi: 'Nghỉ hè tôi đến thăm thầy giáo cấp ba.' },
        { text: '{日本|にほん}の{会社|かいしゃ}で{働|はたら}くには、{敬語|けいご}が{大切|たいせつ}です。', ro: 'Nihon no kaisha de hataraku ni wa, keigo ga taisetsu desu.', vi: 'Để làm việc ở công ty Nhật, kính ngữ rất quan trọng.' },
        { text: '{私|わたし}が{一番|いちばん}{尊敬|そんけい}している{人|ひと}は{母|はは}です。', ro: 'Watashi ga ichiban sonkei shite iru hito wa haha desu.', vi: 'Người tôi kính trọng nhất là mẹ.' },
        { text: '{先生|せんせい}はこのことをご{存|ぞん}じですか。', ro: 'Sensei wa kono koto o gozonji desu ka.', vi: 'Thầy có biết chuyện này không ạ?' },
        { text: 'お{名前|なまえ}はよく{存|ぞん}じております。', ro: 'Onamae wa yoku zonjite orimasu.', vi: 'Tên của anh/chị thì tôi biết rõ ạ.' },
        { text: '{明日|あした}の{午後|ごご}、{研究室|けんきゅうしつ}に{伺|うかが}います。', ro: 'Ashita no gogo, kenkyuushitsu ni ukagaimasu.', vi: 'Chiều mai em xin đến phòng nghiên cứu ạ.' },
        { text: 'ちょっと{伺|うかが}いたいことがあるんですが。', ro: 'Chotto ukagaitai koto ga aru n desu ga.', vi: 'Tôi có chút việc muốn hỏi ạ.' },
        { text: 'お{手紙|てがみ}、{拝見|はいけん}しました。', ro: 'Otegami, haiken shimashita.', vi: 'Tôi đã đọc thư của anh/chị rồi ạ.' },
        { text: 'どうぞ、たくさん{召|め}し{上|あ}がってください。', ro: 'Douzo, takusan meshiagatte kudasai.', vi: 'Mời anh/chị dùng thật nhiều nhé.' },
        { text: '{課長|かちょう}は{今|いま}、{会議室|かいぎしつ}にいらっしゃいます。', ro: 'Kachou wa ima, kaigishitsu ni irasshaimasu.', vi: 'Trưởng phòng hiện đang ở phòng họp.' },
        { text: '{今日|きょう}は{第|だい}24{課|か}を{勉強|べんきょう}します。', ro: 'Kyou wa dai nijuuyon-ka o benkyou shimasu.', vi: 'Hôm nay chúng ta học bài 24.' },
        { text: 'わからないことは{係|かかり}の{人|ひと}に{聞|き}いてください。', ro: 'Wakaranai koto wa kakari no hito ni kiite kudasai.', vi: 'Điều gì không rõ hãy hỏi người phụ trách.' },
        { text: 'この{仕事|しごと}は{私|わたし}が{担当|たんとう}しています。', ro: 'Kono shigoto wa watashi ga tantou shite imasu.', vi: 'Công việc này do tôi phụ trách.' },
        { text: '{進学|しんがく}のことで、{先生|せんせい}に{相談|そうだん}しました。', ro: 'Shingaku no koto de, sensei ni soudan shimashita.', vi: 'Tôi đã xin ý kiến thầy về chuyện học lên.' },
        { text: '{卒業|そつぎょう}したら、{日本|にほん}で{就職|しゅうしょく}したいです。', ro: 'Sotsugyou shitara, Nihon de shuushoku shitai desu.', vi: 'Tốt nghiệp xong tôi muốn đi làm ở Nhật.' },
        { text: '{昼休|ひるやす}みに{職員室|しょくいんしつ}へ{行|い}きました。', ro: 'Hiruyasumi ni shokuinshitsu e ikimashita.', vi: 'Giờ nghỉ trưa tôi đã đến phòng giáo viên.' },
        { text: '{友達|ともだち}にいいアルバイトを{紹介|しょうかい}してもらいました。', ro: 'Tomodachi ni ii arubaito o shoukai shite moraimashita.', vi: 'Tôi được bạn giới thiệu cho một chỗ làm thêm tốt.' },
        { text: '{面接|めんせつ}の{最初|さいしょ}に{自己紹介|じこしょうかい}をしました。', ro: 'Mensetsu no saisho ni jiko shoukai o shimashita.', vi: 'Đầu buổi phỏng vấn tôi đã tự giới thiệu.' },
        { text: 'お{客様|きゃくさま}を{応接室|おうせつしつ}にご{案内|あんない}しました。', ro: 'Okyakusama o ousetsushitsu ni goannai shimashita.', vi: 'Tôi đã dẫn khách vào phòng tiếp khách.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b24-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 40 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{来週|らいしゅう}の{水曜日|すいようび}に、{会社訪問|かいしゃほうもん}をすることになりました。{人事部|じんじぶ}の{課長|かちょう}が{会社|かいしゃ}の{中|なか}を{案内|あんない}してくださるそうです。{敬語|けいご}がまだ{上手|じょうず}ではないので、{今|いま}、{先輩|せんぱい}に{相談|そうだん}しながら{練習|れんしゅう}しています。', ro: 'Raishuu no suiyoubi ni, kaisha houmon o suru koto ni narimashita. Jinjibu no kachou ga kaisha no naka o annai shite kudasaru sou desu. Keigo ga mada jouzu de wa nai node, ima, senpai ni soudan shinagara renshuu shite imasu.', vi: 'Tôi sẽ đi thăm công ty vào thứ Tư tuần sau. Nghe nói trưởng phòng nhân sự sẽ dẫn tôi đi xem bên trong công ty. Vì kính ngữ của tôi chưa giỏi, nên bây giờ tôi đang vừa hỏi ý đàn anh vừa luyện tập.' },
        { text: '{私|わたし}は{今|いま}、ホテルの{受付|うけつけ}を{担当|たんとう}しております。お{客様|きゃくさま}に「{駅|えき}までの{道|みち}を{教|おし}えてください」と{言|い}われたら、{地図|ちず}をお{渡|わた}しして、ご{説明|せつめい}します。{一番|いちばん}{尊敬|そんけい}している{先輩|せんぱい}は、どんなお{客様|きゃくさま}にも{笑顔|えがお}で{対応|たいおう}します。', ro: 'Watashi wa ima, hoteru no uketsuke o tantou shite orimasu. Okyakusama ni "Eki made no michi o oshiete kudasai" to iwaretara, chizu o owatashi shite, gosetsumei shimasu. Ichiban sonkei shite iru senpai wa, donna okyakusama ni mo egao de taiou shimasu.', vi: 'Hiện tôi đang phụ trách quầy lễ tân ở khách sạn. Khi được khách nhờ "Chỉ đường đến ga giúp tôi", tôi đưa bản đồ và giải thích. Người đàn anh tôi kính trọng nhất luôn tiếp mọi vị khách với nụ cười.' },
        { text: '{先日|せんじつ}、{先生|せんせい}のお{宅|たく}に{伺|うかが}いました。{奥様|おくさま}が{作|つく}ってくださった{料理|りょうり}をいただきながら、{就職|しゅうしょく}について{相談|そうだん}しました。{先生|せんせい}は、{私|わたし}に{合|あ}いそうな{会社|かいしゃ}を{紹介|しょうかい}してくださいました。', ro: 'Senjitsu, sensei no otaku ni ukagaimashita. Okusama ga tsukutte kudasatta ryouri o itadakinagara, shuushoku ni tsuite soudan shimashita. Sensei wa, watashi ni aisou na kaisha o shoukai shite kudasaimashita.', vi: 'Hôm trước tôi đến thăm nhà thầy. Vừa dùng món ăn phu nhân của thầy nấu, tôi vừa xin ý kiến thầy về chuyện tìm việc. Thầy đã giới thiệu cho tôi một công ty có vẻ hợp với tôi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (13 câu)',
      items: [
        { q: '{来週|らいしゅう}、**訪問**します。', options: ['ほうもん', 'ぼうもん', 'ほもん', 'ほうぶん'], correct: 0, why: '**{訪問|ほうもん}** (houmon) — ほう trường âm, もん.' },
        { q: '{先生|せんせい}を**尊敬**しています。', options: ['そんけ', 'ぞんけい', 'そんけい', 'そんきょう'], correct: 2, why: '**{尊敬|そんけい}** (sonkei) — そ không đục.' },
        { q: '{日本|にほん}の**敬語**は{難|むずか}しいです。', options: ['けいご', 'けご', 'きょうご', 'けいこ'], correct: 0, why: '**{敬語|けいご}** (keigo).' },
        { q: '{先生|せんせい}はご**存**じですか。', options: ['そん', 'ぞん', 'ざい', 'しん'], correct: 1, why: 'ご**{存|ぞん}**じ (gozonji) — trong kính ngữ đọc **ぞん** (đục).' },
        { q: '{明日|あした}、そちらに**伺**います。', options: ['うががい', 'うかがい', 'たずね', 'まいり'], correct: 1, why: '**{伺|うかが}**います (ukagaimasu) — う・か・が.' },
        { q: '{資料|しりょう}を**拝見**しました。', options: ['はいけん', 'ばいけん', 'はいみ', 'はっけん'], correct: 0, why: '**{拝見|はいけん}** (haiken).' },
        { q: 'どうぞ**召**し{上|あ}がってください。', options: ['しょう', 'め', 'よ', 'まね'], correct: 1, why: '**{召|め}**し{上|あ}がって (meshiagatte) — 召 đọc **め**.' },
        { q: '**課長**はいらっしゃいますか。', options: ['かいちょう', 'かちょう', 'かっちょう', 'がちょう'], correct: 1, why: '**{課長|かちょう}** (kachou). {会長|かいちょう} là chủ tịch hội đồng.' },
        { q: '**係**の{人|ひと}に{聞|き}いてください。', options: ['けい', 'かかり', 'かがり', 'かかわり'], correct: 1, why: '**{係|かかり}** (kakari) — đứng riêng đọc かかり; đứng sau danh từ mới đục: {案内係|あんないがかり}.' },
        { q: 'この{仕事|しごと}の**担当**は{誰|だれ}ですか。', options: ['たんど', 'だんとう', 'たんとう', 'たんどう'], correct: 2, why: '**{担当|たんとう}** (tantou).' },
        { q: '{先生|せんせい}に**相談**しました。', options: ['そうだん', 'そうたん', 'そだん', 'しょうだん'], correct: 0, why: '**{相談|そうだん}** (soudan) — だ đục.' },
        { q: '{日本|にほん}で**就職**したいです。', options: ['しゅうしょく', 'しゅしょく', 'じゅうしょく', 'しゅうしき'], correct: 0, why: '**{就職|しゅうしょく}** (shuushoku).' },
        { q: '**応接室**でお{待|ま}ちください。', options: ['おせつしつ', 'おうせつしつ', 'おうせっしつ', 'のうせつしつ'], correct: 1, why: '**{応接室|おうせつしつ}** (ousetsushitsu) — おう trường âm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (9 câu)',
      items: [
        { q: '{来週|らいしゅう}、{会社|かいしゃ}を**ほうもん**します。', options: ['話問', '訪問', '方問', '訪門'], correct: 1, why: '**訪問** — 訪 = 言 + 方; 問 (hỏi) ≠ 門 (cổng).' },
        { q: '{父|ちち}を**そんけい**しています。', options: ['尊警', '尊敬', '導敬', '存敬'], correct: 1, why: '**尊敬** — 敬 không có 言 bên dưới (警 là của {警察|けいさつ}).' },
        { q: '{先生|せんせい}はご**ぞん**じですか。', options: ['在', '存', '尊', '孫'], correct: 1, why: 'ご**存**じ — dưới là 子. 在 (dưới là 土) là "tại".' },
        { q: '**かちょう**に{資料|しりょう}を{渡|わた}しました。', options: ['果長', '課長', '会長', '菓長'], correct: 1, why: '**課長** — 言 + 果.' },
        { q: '**かかり**の{人|ひと}に{聞|き}いてください。', options: ['系', '孫', '係', '掛'], correct: 2, why: '**係** — 亻 + 系. 掛 (掛ける) là chữ khác.' },
        { q: 'この{仕事|しごと}を**たんとう**しています。', options: ['但当', '担当', '旦当', '担頭'], correct: 1, why: '**担当** — 扌 (tay gánh) + 旦.' },
        { q: '{先輩|せんぱい}に**そうだん**しました。', options: ['相淡', '想談', '相談', '相炎'], correct: 2, why: '**相談** — 談 có 言 (lời); 淡 có 氵 là "nhạt".' },
        { q: '{友達|ともだち}を**しょうかい**します。', options: ['招介', '紹介', '紹今', '召介'], correct: 1, why: '**紹介** — 紹 có 糸; 招 (扌) là của {招待|しょうたい}.' },
        { q: '{日本|にほん}で**しゅうしょく**したいです。', options: ['就識', '就織', '就職', '収職'], correct: 2, why: '**就職** — 職 có 耳 bên trái; 識 (言) là "thức", 織 (糸) là "dệt".' },
      ],
    },
    {
      t: 'write',
      id: 'b24-viet-kanji',
      title: 'Tập viết — 5 chữ ✍ và 8 từ',
      note: 'Viết 5 chữ ✍ trước (đúng thứ tự nét theo hoạt hình — chú ý chữ 職 có 18 nét: viết 耳 trước, rồi 音, cuối cùng 戈), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['訪', '課', '係', '職', '介', '訪問', '課長', '係員', '担当', '相談', '就職', '紹介', '尊敬', '応接室'],
      goi: {
        '訪問': 'ほうもん · thăm',
        '課長': 'かちょう · trưởng phòng',
        '係員': 'かかりいん · nhân viên phụ trách',
        '担当': 'たんとう · phụ trách',
        '相談': 'そうだん · bàn bạc',
        '就職': 'しゅうしょく · đi làm',
        '紹介': 'しょうかい · giới thiệu',
        '尊敬': 'そんけい · kính trọng',
        '応接室': 'おうせつしつ · phòng tiếp khách',
      },
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

type LL = [who: string, voice: 'ja-nu' | 'ja-nam', text: string, ro: string, vi: string];
const NG = (id: string, title: string, note: string, lines: LL[]): Block => ({
  t: 'listen',
  id,
  title,
  note,
  lines: lines.map(([who, voice, text, ro, vi]) => ({ who, voice, text, ro, vi })),
});

const NGHE: Lesson = {
  id: 'b24-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N4 — 6 bài theo đủ 4 dạng đề: 課題理解 · ポイント理解 · 発話表現 · 即時応答',
  goal: 'Nghe cuộc gọi đến công ty và lời trưởng phòng giao việc để biết việc phải làm TRƯỚC (loại việc người khác đã làm, việc để sau); nghe để bắt đúng lý do một người không nghe máy được và điều một công ty coi trọng nhất trong lời chào của giám đốc; chọn câu nói đúng loại kính ngữ khi gặp thầy cô, khách, khi nghe điện thoại thay sếp; đáp nhanh câu nói có kính ngữ, ～か, ～かどうか — đúng 4 dạng của phần 聴解 đề N4.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N4 — 4 dạng, 35 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó phải làm **trước / tiếp theo**.', 'Kính ngữ làm câu **dài** nhưng ý không đổi: お{送|おく}りにならなくて{結構|けっこう}です = không cần gửi. Việc **người khác đã làm** (～がしてくれた／もうしてあります) và việc **để sau** (～てから) → loại.'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó.', 'Lý do bị **phủ định** (会議ではありません・～ではなくて) là bẫy. Bài nói trang trọng: ý chính hay đứng sau **一番{大切|たいせつ}にしているのは／{何|なに}よりも**.'],
        ['問題3', '発話表現 (nói gì trong tình huống)', 'Nghe mô tả tình huống, chọn câu nên nói.', 'Hỏi **AI làm**: người trên làm → tôn kính (いらっしゃる・{召|め}し{上|あ}がる); mình làm → khiêm nhường ({参|まい}る・お～する). Ba câu thường chỉ khác **loại kính ngữ**.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', 'Người kia **mời** (お～ください, {召|め}し{上|あ}がってください) → đáp いただきます／ありがとうございます; người kia **hỏi** bằng tôn kính → đáp về mình bằng khiêm nhường, **không lặp lại tôn kính**.'],
      ],
    },
    {
      t: 'table',
      caption: 'Từ cần biết trước khi nghe (ngoài 48 từ của bài)',
      head: ['Từ', 'Romaji', 'Nghĩa', 'Gặp ở'],
      rows: [
        ['{会社説明会|かいしゃせつめいかい}', 'kaisha setsumeikai', 'buổi giới thiệu công ty (cho sinh viên)', 'Bài 1, 4'],
        ['{申|もう}し{込|こ}み', 'moushikomi', 'đăng ký (Bài 9: 申し込む)', 'Bài 1'],
        ['{準備|じゅんび}', 'junbi', 'chuẩn bị (Bài 12)', 'Bài 2'],
        ['お{茶|ちゃ}を{出|だ}す', 'ocha o dasu', 'mời trà, mang trà ra', 'Bài 2'],
        ['{予約|よやく}を{取|と}る', 'yoyaku o toru', 'đặt chỗ, giữ chỗ trước', 'Bài 2'],
        ['{会議中|かいぎちゅう}', 'kaigichuu', 'đang họp', 'Bài 3'],
        ['わたくしども', 'watakushidomo', 'chúng tôi (khiêm nhường — công ty chúng tôi)', 'Bài 4'],
        ['{技術|ぎじゅつ}', 'gijutsu', 'kỹ thuật, công nghệ (N3)', 'Bài 4'],
        ['お{客様|きゃくさま}の{声|こえ}', 'okyakusama no koe', 'ý kiến của khách hàng', 'Bài 4'],
        ['お{集|あつ}まりいただく', 'oatsumari itadaku', '(quý vị) đã tập trung đến (khiêm nhường của 集まってもらう)', 'Bài 4'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        '**Kính ngữ dài nhưng gốc động từ vẫn ở đó**: お{送|おく}**り**にならなくて = {送|おく}らなくて; ご{案内|あんない}いたします = {案内|あんない}します; お{待|ま}ち**ください** = {待|ま}ってください. Bắt **gốc động từ** + **phủ định hay khẳng định** là đủ hiểu ý.',
        '**Nghe đuôi để biết AI làm**: ～**になります**／いらっしゃいます／おっしゃいます → người được nói tới là **người trên** (thường không phải người nói); ～**いたします**／{参|まい}ります／{申|もう}します／おります → **người nói** (hoặc người cùng nhóm với người nói).',
        '**Tên không có さん trong lời nhân viên công ty** ({山本|やまもと}は…, {森|もり}が…) = người **của chính công ty đó** (うち). Nghe tên có **様** ({田村様|たむらさま}) = **khách**.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: gọi điện hỏi về buổi giới thiệu công ty' },
    NG('b24-ng-1', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — hồ sơ thì mang theo vào ngày đó (không gửi bây giờ); đăng ký trên trang web. Chờ câu cuối "じゃ、さっそく…".', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}が{会社|かいしゃ}に{電話|でんわ}をしています。{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito ga kaisha ni denwa o shite imasu. Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Một người đàn ông đang gọi điện đến công ty. Sau đây người đàn ông trước tiên sẽ làm gì?'],
      ['ダニエル', 'ja-nam', 'お{忙|いそが}しいところ{恐|おそ}れ{入|い}ります。{留学生|りゅうがくせい}のダニエルと{申|もう}します。{来月|らいげつ}の{会社説明会|かいしゃせつめいかい}のことで{伺|うかが}いたいんですが。', 'Oisogashii tokoro osoreirimasu. Ryuugakusei no Danieru to moushimasu. Raigetsu no kaisha setsumeikai no koto de ukagaitai n desu ga.', 'Xin lỗi đã làm phiền lúc chị đang bận. Tôi là Daniel, du học sinh. Tôi muốn hỏi về buổi giới thiệu công ty tháng sau ạ.'],
      ['{人事部|じんじぶ}の{人|ひと}', 'ja-nu', 'はい、どうぞ。', 'Hai, douzo.', 'Vâng, mời anh.'],
      ['ダニエル', 'ja-nam', '{説明会|せつめいかい}に{参加|さんか}したいんですが、どうすればよろしいでしょうか。', 'Setsumeikai ni sanka shitai n desu ga, dou sureba yoroshii deshou ka.', 'Tôi muốn tham gia buổi giới thiệu, tôi nên làm thế nào ạ?'],
      ['{人事部|じんじぶ}の{人|ひと}', 'ja-nu', 'ホームページに{申|もう}し{込|こ}みのページがございますので、そちらからお{申|もう}し{込|こ}みください。', 'Hoomupeeji ni moushikomi no peeji ga gozaimasu node, sochira kara omoushikomi kudasai.', 'Trên trang web có trang đăng ký, anh vui lòng đăng ký ở đó.'],
      ['ダニエル', 'ja-nam', 'わかりました。{履歴書|りれきしょ}も{先|さき}にお{送|おく}りしたほうがよろしいでしょうか。', 'Wakarimashita. Rirekisho mo saki ni ookuri shita hou ga yoroshii deshou ka.', 'Tôi hiểu rồi. Tôi có nên gửi trước cả sơ yếu lý lịch không ạ?'],
      ['{人事部|じんじぶ}の{人|ひと}', 'ja-nu', '{履歴書|りれきしょ}は、{説明会|せつめいかい}の{日|ひ}にお{持|も}ちください。{今|いま}はお{送|おく}りにならなくて{結構|けっこう}です。', 'Rirekisho wa, setsumeikai no hi ni omochi kudasai. Ima wa ookuri ni naranakute kekkou desu.', 'Sơ yếu lý lịch anh mang theo vào ngày buổi giới thiệu. Bây giờ anh không cần gửi đâu ạ.'],
      ['ダニエル', 'ja-nam', 'そうですか。あのう、{留学生|りゅうがくせい}も{参加|さんか}できるかどうか、{確認|かくにん}してもよろしいですか。', 'Sou desu ka. Anou, ryuugakusei mo sanka dekiru ka dou ka, kakunin shite mo yoroshii desu ka.', 'Vậy ạ. À, cho tôi xác nhận lại là du học sinh có tham gia được không ạ?'],
      ['{人事部|じんじぶ}の{人|ひと}', 'ja-nu', 'はい、{留学生|りゅうがくせい}の{方|かた}もたくさんいらっしゃいますよ。', 'Hai, ryuugakusei no kata mo takusan irasshaimasu yo.', 'Vâng, có rất nhiều bạn du học sinh đến đấy ạ.'],
      ['ダニエル', 'ja-nam', 'ありがとうございます。じゃ、さっそくホームページから{申|もう}し{込|こ}みます。', 'Arigatou gozaimasu. Ja, sassoku hoomupeeji kara moushikomimasu.', 'Cảm ơn chị. Vậy tôi sẽ đăng ký trên trang web ngay.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người đàn ông trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b24-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{履歴書|りれきしょ}をメールで{送|おく}る', 'もう{一度|いちど}{電話|でんわ}をかける', 'ホームページから{申|もう}し{込|こ}む', '{説明会|せつめいかい}の{会場|かいじょう}に{行|い}く'], correct: 2, why: 'Hồ sơ: **{今|いま}はお{送|おく}りにならなくて{結構|けっこう}です** (không cần gửi bây giờ — bẫy); câu chốt: **さっそくホームページから{申|もう}し{込|こ}みます**. 〔Sassoku hoomupeeji kara moushikomimasu.〕' },
        { q: '{履歴書|りれきしょ}はいつ{渡|わた}しますか。', options: ['{今日|きょう}', '{説明会|せつめいかい}の{日|ひ}', '{申|もう}し{込|こ}みのとき', '{説明会|せつめいかい}のあとでメールで'], correct: 1, why: '**{履歴書|りれきしょ}は、{説明会|せつめいかい}の{日|ひ}にお{持|も}ちください** — お～ください = hãy mang theo. 〔Setsumeikai no hi ni omochi kudasai.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: trưởng phòng giao việc chuẩn bị đón khách' },
    NG('b24-ng-2', 'ワンさんはこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — photo tài liệu: chị 鈴木 đã làm rồi; trà: mang ra SAU khi khách đến. Chờ câu "では、すぐに…".', [
      ['ナレーター', 'ja-nu', '{会社|かいしゃ}で、{課長|かちょう}とワンさんが{話|はな}しています。ワンさんはこのあとまず{何|なに}をしますか。', 'Kaisha de, kachou to Wan-san ga hanashite imasu. Wan-san wa kono ato mazu nani o shimasu ka.', 'Ở công ty, trưởng phòng và Vương đang nói chuyện. Sau đây Vương trước tiên sẽ làm gì?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ワンさん、{明日|あした}の3{時|じ}に{東京商事|とうきょうしょうじ}の{田村様|たむらさま}がいらっしゃるんだけど、{準備|じゅんび}をお{願|ねが}いできるかな。', 'Wan-san, ashita no sanji ni Toukyou Shouji no Tamura-sama ga irassharu n da kedo, junbi o onegai dekiru ka na.', 'Vương này, 3 giờ chiều mai anh Tamura bên Tokyo Shoji sẽ đến, em chuẩn bị giúp anh được không?'],
      ['ワン', 'ja-nu', 'はい。{何|なに}をいたしましょうか。', 'Hai. Nani o itashimashou ka.', 'Vâng. Em nên làm gì ạ?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'まず、{資料|しりょう}のコピーが10{部|ぶ}{要|い}るんだけど……あ、それは{鈴木|すずき}さんがもうしてくれたんだった。', 'Mazu, shiryou no kopii ga juubu iru n da kedo…… a, sore wa Suzuki-san ga mou shite kureta n datta.', 'Trước hết cần 10 bản photo tài liệu… À, cái đó chị Suzuki làm giúp rồi.'],
      ['ワン', 'ja-nu', 'そうですか。では、{会議室|かいぎしつ}の{予約|よやく}はもうなさいましたか。', 'Sou desu ka. Dewa, kaigishitsu no yoyaku wa mou nasaimashita ka.', 'Vậy ạ. Thế anh đã đặt phòng họp chưa ạ?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'いや、まだなんだ。{明日|あした}は{会議室|かいぎしつ}を{使|つか}う{人|ひと}が{多|おお}いから、{早|はや}く{取|と}っておいたほうがいいね。', 'Iya, mada na n da. Ashita wa kaigishitsu o tsukau hito ga ooi kara, hayaku totte oita hou ga ii ne.', 'Chưa, anh chưa đặt. Mai nhiều người dùng phòng họp lắm, nên giữ chỗ sớm thì hơn.'],
      ['ワン', 'ja-nu', 'かしこまりました。お{茶|ちゃ}はどういたしましょうか。', 'Kashikomarimashita. Ocha wa dou itashimashou ka.', 'Em rõ rồi ạ. Còn trà thì em làm thế nào ạ?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'お{茶|ちゃ}は、{田村様|たむらさま}がいらっしゃってから、お{出|だ}しして。', 'Ocha wa, Tamura-sama ga irasshatte kara, odashi shite.', 'Trà thì khi anh Tamura đến rồi hãy mang ra.'],
      ['ワン', 'ja-nu', 'はい。では、すぐに{会議室|かいぎしつ}を{予約|よやく}いたします。', 'Hai. Dewa, sugu ni kaigishitsu o yoyaku itashimasu.', 'Vâng. Vậy em sẽ đặt phòng họp ngay ạ.'],
      ['ナレーター', 'ja-nu', 'ワンさんはこのあとまず{何|なに}をしますか。', 'Wan-san wa kono ato mazu nani o shimasu ka.', 'Sau đây Vương trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b24-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: 'ワンさんはこのあとまず{何|なに}をしますか。', options: ['{資料|しりょう}を10{部|ぶ}コピーする', 'お{茶|ちゃ}を{用意|ようい}する', '{田村様|たむらさま}に{電話|でんわ}する', '{会議室|かいぎしつ}を{予約|よやく}する'], correct: 3, why: 'Photo: **{鈴木|すずき}さんがもうしてくれた** (đã xong — bẫy ①); trà: **いらっしゃってから** (sau khi khách đến — bẫy ②). Câu chốt: **すぐに{会議室|かいぎしつ}を{予約|よやく}いたします**. 〔Sugu ni kaigishitsu o yoyaku itashimasu.〕' },
        { q: '「{田村様|たむらさま}がいらっしゃる」の{意味|いみ}は？', options: ['{田村様|たむらさま}が{来|く}る', '{田村様|たむらさま}が{会社|かいしゃ}にいない', '{田村様|たむらさま}が{帰|かえ}る', '{田村様|たむらさま}が{電話|でんわ}する'], correct: 0, why: 'いらっしゃる = tôn kính của **{来|く}る** (ở đây: 3 giờ mai khách **đến**). 〔Tamura-sama ga irassharu.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: vì sao trưởng ban không nghe máy được?' },
    NG('b24-ng-3', '{山本部長|やまもとぶちょう}はどうして{電話|でんわ}に{出|で}られませんか', 'Dạng ポイント理解 — "cuộc họp" là chuyện hôm qua (bẫy). Nghe chữ đứng trước しております.', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}が{会社|かいしゃ}に{電話|でんわ}をしています。{山本部長|やまもとぶちょう}はどうして{電話|でんわ}に{出|で}られませんか。', 'Onna no hito ga kaisha ni denwa o shite imasu. Yamamoto-buchou wa doushite denwa ni deraremasen ka.', 'Một người phụ nữ đang gọi điện đến công ty. Vì sao trưởng ban Yamamoto không nghe máy được?'],
      ['メアリー', 'ja-nu', 'もしもし、さくら{旅行|りょこう}のメアリーと{申|もう}します。いつもお{世話|せわ}になっております。{山本部長|やまもとぶちょう}はいらっしゃいますか。', 'Moshimoshi, Sakura Ryokou no Mearii to moushimasu. Itsumo osewa ni natte orimasu. Yamamoto-buchou wa irasshaimasu ka.', 'A lô, tôi là Mary ở công ty du lịch Sakura. Cảm ơn quý công ty đã luôn giúp đỡ. Trưởng ban Yamamoto có ở đó không ạ?'],
      ['{会社|かいしゃ}の{人|ひと}', 'ja-nam', 'いつもお{世話|せわ}になっております。{申|もう}し{訳|わけ}ございません。{山本|やまもと}は{今日|きょう}は{朝|あさ}から{大阪|おおさか}に{出張|しゅっちょう}しております。', 'Itsumo osewa ni natte orimasu. Moushiwake gozaimasen. Yamamoto wa kyou wa asa kara Oosaka ni shucchou shite orimasu.', 'Cảm ơn chị đã luôn giúp đỡ. Thật xin lỗi, ông Yamamoto hôm nay đi công tác Osaka từ sáng ạ.'],
      ['メアリー', 'ja-nu', 'そうですか。{今日|きょう}は{会議|かいぎ}だと{伺|うかが}っていましたが……。', 'Sou desu ka. Kyou wa kaigi da to ukagatte imashita ga…….', 'Vậy ạ. Tôi cứ nghe nói hôm nay ông ấy họp…'],
      ['{会社|かいしゃ}の{人|ひと}', 'ja-nam', '{会議|かいぎ}は{昨日|きのう}でございました。{明日|あした}の{午後|ごご}には{戻|もど}る{予定|よてい}でございます。{折|お}り{返|かえ}しお{電話|でんわ}いたしましょうか。', 'Kaigi wa kinou de gozaimashita. Ashita no gogo ni wa modoru yotei de gozaimasu. Orikaeshi odenwa itashimashou ka.', 'Cuộc họp là hôm qua ạ. Dự kiến chiều mai ông ấy về. Để chúng tôi gọi lại cho chị nhé?'],
      ['メアリー', 'ja-nu', 'いえ、{結構|けっこう}です。{明日|あした}の{夕方|ゆうがた}、こちらからもう{一度|いちど}お{電話|でんわ}いたします。', 'Ie, kekkou desu. Ashita no yuugata, kochira kara mou ichido odenwa itashimasu.', 'Dạ thôi, không cần ạ. Chiều tối mai tôi sẽ gọi lại lần nữa.'],
      ['{会社|かいしゃ}の{人|ひと}', 'ja-nam', 'かしこまりました。お{電話|でんわ}があったことを、{山本|やまもと}に{伝|つた}えておきます。', 'Kashikomarimashita. Odenwa ga atta koto o, Yamamoto ni tsutaete okimasu.', 'Tôi rõ rồi ạ. Tôi sẽ báo lại với ông Yamamoto là chị đã gọi.'],
      ['ナレーター', 'ja-nu', '{山本部長|やまもとぶちょう}はどうして{電話|でんわ}に{出|で}られませんか。', 'Yamamoto-buchou wa doushite denwa ni deraremasen ka.', 'Vì sao trưởng ban Yamamoto không nghe máy được?'],
    ]),
    {
      t: 'mcq',
      id: 'b24-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{山本部長|やまもとぶちょう}はどうして{電話|でんわ}に{出|で}られませんか。', options: ['{会議中|かいぎちゅう}だから', '{大阪|おおさか}に{出張|しゅっちょう}しているから', '{席|せき}を{外|はず}しているから', '{今日|きょう}は{休|やす}みだから'], correct: 1, why: '**{朝|あさ}から{大阪|おおさか}に{出張|しゅっちょう}しております**. Cuộc họp: **{会議|かいぎ}は{昨日|きのう}でございました** (bẫy). 〔Oosaka ni shucchou shite orimasu.〕' },
        { q: 'メアリーさんはこのあとどうしますか。', options: ['{会社|かいしゃ}からの{電話|でんわ}を{待|ま}つ', '{明日|あした}の{夕方|ゆうがた}、もう{一度|いちど}{電話|でんわ}する', '{今日|きょう}の{午後|ごご}、{大阪|おおさか}に{行|い}く', '{伝言|でんごん}をメールで{送|おく}る'], correct: 1, why: 'Người kia đề nghị gọi lại — メアリー từ chối: **いえ、{結構|けっこう}です** (thôi, không cần — bẫy), rồi **{明日|あした}の{夕方|ゆうがた}、…もう{一度|いちど}お{電話|でんわ}いたします**. 〔Ashita no yuugata, mou ichido odenwa itashimasu.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題2 ポイント理解: lời chào của giám đốc ở buổi giới thiệu công ty' },
    NG('b24-ng-4', 'この{会社|かいしゃ}が{一番|いちばん}{大切|たいせつ}にしていることは{何|なん}ですか', 'Dạng ポイント理解 — bài nói trang trọng (khiêm nhường: でございます・おります・いただく). Ý chính đứng sau "一番大切にしているのは…"; "công nghệ mới" là bẫy (～ではありません).', [
      ['ナレーター', 'ja-nu', '{会社説明会|かいしゃせつめいかい}で、{社長|しゃちょう}が{話|はな}しています。この{会社|かいしゃ}が{一番|いちばん}{大切|たいせつ}にしていることは{何|なん}ですか。', 'Kaisha setsumeikai de, shachou ga hanashite imasu. Kono kaisha ga ichiban taisetsu ni shite iru koto wa nan desu ka.', 'Ở buổi giới thiệu công ty, giám đốc đang phát biểu. Điều công ty này coi trọng nhất là gì?'],
      ['{社長|しゃちょう}', 'ja-nam', '{皆様|みなさま}、{本日|ほんじつ}はお{忙|いそが}しいところ、お{集|あつ}まりいただき、ありがとうございます。{社長|しゃちょう}の{小川|おがわ}でございます。', 'Minasama, honjitsu wa oisogashii tokoro, oatsumari itadaki, arigatou gozaimasu. Shachou no Ogawa de gozaimasu.', 'Thưa quý vị, hôm nay cảm ơn quý vị đã dành thời gian đến đây dù đang bận. Tôi là Ogawa, giám đốc công ty.'],
      ['{社長|しゃちょう}', 'ja-nam', 'わたくしどもの{会社|かいしゃ}は、30{年前|ねんまえ}に{小|ちい}さな{部屋|へや}で{始|はじ}まりました。{今|いま}は300{人|にん}の{社員|しゃいん}が{働|はたら}いております。', 'Watakushidomo no kaisha wa, sanjuunen mae ni chiisana heya de hajimarimashita. Ima wa sanbyakunin no shain ga hataraite orimasu.', 'Công ty chúng tôi bắt đầu từ một căn phòng nhỏ 30 năm trước. Hiện nay có 300 nhân viên đang làm việc.'],
      ['{社長|しゃちょう}', 'ja-nam', 'よく「{新|あたら}しい{技術|ぎじゅつ}が{一番|いちばん}{大切|たいせつ}ですか」と{聞|き}かれますが、そうではありません。わたくしどもが{一番|いちばん}{大切|たいせつ}にしているのは、お{客様|きゃくさま}のお{話|はなし}をよく{伺|うかが}うことです。', 'Yoku "Atarashii gijutsu ga ichiban taisetsu desu ka" to kikaremasu ga, sou de wa arimasen. Watakushidomo ga ichiban taisetsu ni shite iru no wa, okyakusama no ohanashi o yoku ukagau koto desu.', 'Chúng tôi hay được hỏi "Công nghệ mới có phải quan trọng nhất không?", nhưng không phải vậy. Điều chúng tôi coi trọng nhất là lắng nghe kỹ lời khách hàng.'],
      ['{社長|しゃちょう}', 'ja-nam', 'インターンシップでは、{皆様|みなさま}にも{社員|しゃいん}と{一緒|いっしょ}にお{客様|きゃくさま}の{会社|かいしゃ}を{訪問|ほうもん}していただきます。{敬語|けいご}が{心配|しんぱい}な{方|かた}も、どうぞご{安心|あんしん}ください。{先輩|せんぱい}がていねいにお{教|おし}えします。', 'Intaanshippu de wa, minasama ni mo shain to issho ni okyakusama no kaisha o houmon shite itadakimasu. Keigo ga shinpai na kata mo, douzo goanshin kudasai. Senpai ga teinei ni ooshie shimasu.', 'Trong kỳ thực tập, quý vị cũng sẽ cùng nhân viên đến thăm công ty khách hàng. Những ai lo về kính ngữ xin cứ yên tâm. Các anh chị đi trước sẽ hướng dẫn tận tình.'],
      ['ナレーター', 'ja-nu', 'この{会社|かいしゃ}が{一番|いちばん}{大切|たいせつ}にしていることは{何|なん}ですか。', 'Kono kaisha ga ichiban taisetsu ni shite iru koto wa nan desu ka.', 'Điều công ty này coi trọng nhất là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b24-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: 'この{会社|かいしゃ}が{一番|いちばん}{大切|たいせつ}にしていることは{何|なん}ですか。', options: ['{新|あたら}しい{技術|ぎじゅつ}', 'お{客様|きゃくさま}の{話|はなし}をよく{聞|き}くこと', '{社員|しゃいん}を{増|ふ}やすこと', '{敬語|けいご}を{正|ただ}しく{使|つか}うこと'], correct: 1, why: '"Công nghệ mới?" — **そうではありません** (bẫy). Ý chính: **お{客様|きゃくさま}のお{話|はなし}をよく{伺|うかが}うこと** ({伺|うかが}う = {聞|き}く khiêm nhường). 〔Okyakusama no ohanashi o yoku ukagau koto desu.〕' },
        { q: 'インターンシップでは{何|なに}をしますか。', options: ['{社長|しゃちょう}と{話|はな}す', 'お{客様|きゃくさま}の{会社|かいしゃ}を{訪問|ほうもん}する', '{敬語|けいご}のテストを{受|う}ける', '{新|あたら}しい{会社|かいしゃ}を{作|つく}る'], correct: 1, why: '**{社員|しゃいん}と{一緒|いっしょ}にお{客様|きゃくさま}の{会社|かいしゃ}を{訪問|ほうもん}していただきます** — ～ていただく: (quý vị) sẽ làm (cho chúng tôi). 〔Okyakusama no kaisha o houmon shite itadakimasu.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題3 発話表現: nói gì trong tình huống (4 câu)' },
    NG('b24-ng-5', '{何|なん}と{言|い}いますか（4{問|もん}）', 'Dạng 発話表現 — nghe mô tả tình huống, chọn 1 trong 3 câu. Ba câu thường chỉ khác loại kính ngữ: hỏi "AI làm?".', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。{先生|せんせい}が{職員室|しょくいんしつ}にいるかどうか、{知|し}りたいです。{何|なん}と{言|い}いますか。', 'Ichiban. Sensei ga shokuinshitsu ni iru ka dou ka, shiritai desu. Nan to iimasu ka.', 'Câu 1. Bạn muốn biết thầy có ở phòng giáo viên không. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{本田先生|ほんだせんせい}はおりますか。 2、{本田先生|ほんだせんせい}はいらっしゃいますか。 3、{本田先生|ほんだせんせい}は{参|まい}りますか。', 'Ichi, Honda-sensei wa orimasu ka. Ni, Honda-sensei wa irasshaimasu ka. San, Honda-sensei wa mairimasu ka.', '1. (sai: おる là khiêm nhường) 2. Thầy Honda có ở đây không ạ? 3. (sai: 参る là khiêm nhường)'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。{会社|かいしゃ}で、お{客様|きゃくさま}に{飲|の}み{物|もの}を{勧|すす}めます。{何|なん}と{言|い}いますか。', 'Niban. Kaisha de, okyakusama ni nomimono o susumemasu. Nan to iimasu ka.', 'Câu 2. Ở công ty, bạn mời khách đồ uống. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、どうぞ、いただいてください。 2、どうぞ、お{飲|の}みしてください。 3、どうぞ、{召|め}し{上|あ}がってください。', 'Ichi, douzo, itadaite kudasai. Ni, douzo, onomi shite kudasai. San, douzo, meshiagatte kudasai.', '1. (sai: いただく là khiêm nhường) 2. (sai: お～する là khiêm nhường) 3. Mời anh/chị dùng ạ.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。{先生|せんせい}の{荷物|にもつ}がとても{重|おも}そうです。{何|なん}と{言|い}いますか。', 'Sanban. Sensei no nimotsu ga totemo omosou desu. Nan to iimasu ka.', 'Câu 3. Hành lý của thầy trông rất nặng. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{先生|せんせい}、お{持|も}ちしましょうか。 2、{先生|せんせい}、お{持|も}ちになりましょうか。 3、{先生|せんせい}、{持|も}ってくださいましょうか。', 'Ichi, sensei, omochi shimashou ka. Ni, sensei, omochi ni narimashou ka. San, sensei, motte kudasaimashou ka.', '1. Thầy ơi, để em xách giúp thầy nhé? 2. (sai: お～になる cho việc của mình) 3. (sai)'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。アルバイトの{会社|かいしゃ}で{電話|でんわ}を{取|と}りました。お{客様|きゃくさま}が{加藤課長|かとうかちょう}と{話|はな}したいと{言|い}っていますが、{加藤課長|かとうかちょう}は{会議中|かいぎちゅう}です。{何|なん}と{言|い}いますか。', 'Yonban. Arubaito no kaisha de denwa o torimashita. Okyakusama ga Katou-kachou to hanashitai to itte imasu ga, Katou-kachou wa kaigichuu desu. Nan to iimasu ka.', 'Câu 4. Bạn nghe điện thoại ở công ty nơi làm thêm. Khách muốn nói chuyện với trưởng phòng Kato, nhưng anh ấy đang họp. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{加藤課長|かとうかちょう}はただいま{会議中|かいぎちゅう}でいらっしゃいます。 2、{加藤|かとう}はただいま{会議中|かいぎちゅう}でございます。 3、{加藤課長|かとうかちょう}さんは{会議|かいぎ}をなさっています。', 'Ichi, Katou-kachou wa tadaima kaigichuu de irasshaimasu. Ni, Katou wa tadaima kaigichuu de gozaimasu. San, Katou-kachou-san wa kaigi o nasatte imasu.', '1. (sai: nâng sếp mình với khách) 2. Anh Kato hiện đang họp ạ. 3. (sai: 課長さん + tôn kính)'],
    ]),
    {
      t: 'mcq',
      id: 'b24-ng-5-q',
      title: 'Bài 5 — chọn câu đúng',
      items: [
        { q: '{1番|いちばん} — {先生|せんせい}が{職員室|しょくいんしつ}にいるか{聞|き}く', options: ['1', '2', '3'], correct: 1, why: 'Thầy "có ở" → tôn kính **いらっしゃいますか**. おる・{参|まい}る là khiêm nhường — chỉ dùng cho mình. 〔Honda-sensei wa irasshaimasu ka.〕' },
        { q: '{2番|にばん} — お{客様|きゃくさま}に{飲|の}み{物|もの}を{勧|すす}める', options: ['1', '2', '3'], correct: 2, why: 'Khách uống → tôn kính **{召|め}し{上|あ}がってください**. いただく và お～する là khiêm nhường. 〔Douzo, meshiagatte kudasai.〕' },
        { q: '{3番|さんばん} — {先生|せんせい}の{荷物|にもつ}を{持|も}ってあげたい', options: ['1', '2', '3'], correct: 0, why: 'Mình làm cho thầy → khiêm nhường **お{持|も}ちしましょうか**. 〔Sensei, omochi shimashou ka.〕' },
        { q: '{4番|よんばん} — {課長|かちょう}は{会議中|かいぎちゅう}（お{客様|きゃくさま}に）', options: ['1', '2', '3'], correct: 1, why: 'うち・そと: nói với khách về sếp mình → bỏ chức vụ, không tôn kính: **{加藤|かとう}はただいま{会議中|かいぎちゅう}でございます**. 〔Katou wa tadaima kaigichuu de gozaimasu.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題4 即時応答: đáp ngay (6 câu)' },
    NG('b24-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（6{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp. Người trên hỏi bằng tôn kính → mình đáp về mình bằng khiêm nhường / です・ます.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'どうぞ、こちらにお{掛|か}けください。', 'Douzo, kochira ni okake kudasai.', 'Mời chị ngồi đây.'],
      ['ワン', 'ja-nu', '1、はい、お{掛|か}けになります。 2、{失礼|しつれい}いたします。 3、どうぞ、お{掛|か}けください。', 'Ichi, hai, okake ni narimasu. Ni, shitsurei itashimasu. San, douzo, okake kudasai.', '1. Vâng, (người trên) ngồi. 2. Tôi xin phép ạ. 3. Mời anh ngồi.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。', 'Niban.', 'Câu 2.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', 'パクさんは、{週末|しゅうまつ}、{何|なに}をなさいましたか。', 'Paku-san wa, shuumatsu, nani o nasaimashita ka.', 'Park, cuối tuần em đã làm gì?'],
      ['パク', 'ja-nu', '1、{友達|ともだち}と{映画|えいが}を{見|み}に{行|い}きました。 2、{映画|えいが}をご{覧|らん}になりました。 3、{映画|えいが}をなさいました。', 'Ichi, tomodachi to eiga o mi ni ikimashita. Ni, eiga o goran ni narimashita. San, eiga o nasaimashita.', '1. Em đi xem phim với bạn ạ. 2. (người trên) đã xem phim. 3. (sai)'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['{鈴木|すずき}', 'ja-nu', 'ワンさん、{課長|かちょう}が{何時|なんじ}に{戻|もど}られるか、{知|し}ってる？', 'Wan-san, kachou ga nanji ni modorareru ka, shitteru?', 'Vương ơi, em có biết mấy giờ trưởng phòng quay lại không?'],
      ['ワン', 'ja-nu', '1、はい、{戻|もど}られます。 2、4{時|じ}ごろだとおっしゃっていました。 3、4{時|じ}ごろだと{申|もう}していました。', 'Ichi, hai, modoraremasu. Ni, yoji goro da to osshatte imashita. San, yoji goro da to moushite imashita.', '1. Vâng, anh ấy quay lại. 2. Anh ấy nói là khoảng 4 giờ ạ. 3. (sai: nói về sếp với đồng nghiệp mà dùng khiêm nhường)'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['{受付|うけつけ}', 'ja-nu', '{失礼|しつれい}ですが、どちら{様|さま}でしょうか。', 'Shitsurei desu ga, dochira-sama deshou ka.', 'Xin lỗi, anh là ai ạ?'],
      ['ダニエル', 'ja-nam', '1、ダニエルと{申|もう}します。 2、ダニエル{様|さま}でございます。 3、ダニエルとおっしゃいます。', 'Ichi, Danieru to moushimasu. Ni, Danieru-sama de gozaimasu. San, Danieru to osshaimasu.', '1. Tôi tên là Daniel. 2. (sai: tự gọi mình là 様) 3. (sai: tôn kính cho mình)'],
      ['ナレーター', 'ja-nu', '{5番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', '{明日|あした}の{説明会|せつめいかい}、{行|い}けるかどうか、もう{決|き}めた？', 'Ashita no setsumeikai, ikeru ka dou ka, mou kimeta?', 'Buổi giới thiệu ngày mai, em đã quyết có đi được hay không chưa?'],
      ['マルコ', 'ja-nam', '1、はい、{参|まい}ります。 2、はい、いらっしゃいます。 3、はい、{行|い}けるかどうかです。', 'Ichi, hai, mairimasu. Ni, hai, irasshaimasu. San, hai, ikeru ka dou ka desu.', '1. Vâng, em sẽ đi ạ. 2. (sai: tôn kính cho mình) 3. (sai — lặp lại câu hỏi)'],
      ['ナレーター', 'ja-nu', '{6番|ろくばん}。', 'Rokuban.', 'Câu 6.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ケーキがありますから、ご{遠慮|えんりょ}なく{召|め}し{上|あ}がってください。', 'Keeki ga arimasu kara, goenryo naku meshiagatte kudasai.', 'Có bánh đấy, em đừng ngại, cứ dùng nhé.'],
      ['ワン', 'ja-nu', '1、ありがとうございます。では、いただきます。 2、はい、{召|め}し{上|あ}がります。 3、いいえ、{遠慮|えんりょ}なくいただいてください。', 'Ichi, arigatou gozaimasu. Dewa, itadakimasu. Ni, hai, meshiagarimasu. San, iie, enryo naku itadaite kudasai.', '1. Em cảm ơn ạ. Vậy em xin phép ạ. 2. (sai: tôn kính cho mình) 3. (sai)'],
    ]),
    {
      t: 'mcq',
      id: 'b24-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '{1番|いちばん} — 「どうぞ、こちらにお{掛|か}けください。」', options: ['1', '2', '3'], correct: 1, why: 'Được mời ngồi → **{失礼|しつれい}いたします** rồi ngồi. 1 dùng tôn kính cho mình; 3 lặp lời mời. 〔Shitsurei itashimasu.〕' },
        { q: '{2番|にばん} — 「{週末|しゅうまつ}、{何|なに}をなさいましたか。」', options: ['1', '2', '3'], correct: 0, why: 'Thầy hỏi bằng なさる (tôn kính) — trả lời về **mình** bằng です・ます thường: **{見|み}に{行|い}きました**. Không lặp lại ご{覧|らん}になる／なさる. 〔Eiga o mi ni ikimashita.〕' },
        { q: '{3番|さんばん} — 「{課長|かちょう}が{何時|なんじ}に{戻|もど}られるか、{知|し}ってる？」', options: ['1', '2', '3'], correct: 1, why: 'Đồng nghiệp hỏi (trong công ty) → vẫn nâng sếp: **4{時|じ}ごろだとおっしゃっていました**. 3 dùng {申|もう}す — chỉ đúng khi nói với KHÁCH. 〔Yoji goro da to osshatte imashita.〕' },
        { q: '{4番|よんばん} — 「どちら{様|さま}でしょうか。」', options: ['1', '2', '3'], correct: 0, why: 'Bị hỏi tên → **～と{申|もう}します**. Không tự gọi mình là ～{様|さま}, không dùng おっしゃる cho mình. 〔Danieru to moushimasu.〕' },
        { q: '{5番|ごばん} — 「{行|い}けるかどうか、もう{決|き}めた？」', options: ['1', '2', '3'], correct: 0, why: 'Trả lời việc của mình với thầy → khiêm nhường **はい、{参|まい}ります**. 〔Hai, mairimasu.〕' },
        { q: '{6番|ろくばん} — 「ご{遠慮|えんりょ}なく{召|め}し{上|あ}がってください。」', options: ['1', '2', '3'], correct: 0, why: 'Được mời ăn → **ありがとうございます。では、いただきます**. 2 tôn kính cho mình; 3 vô nghĩa. 〔Dewa, itadakimasu.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b24-doc',
  kind: 'reading',
  title: 'Đọc hiểu N4 — email báo kết quả của công ty, bài văn "Kính ngữ có khó không?", lịch các buổi giới thiệu công ty (情報検索)',
  goal: 'Đọc email ~250 chữ viết bằng kính ngữ để biết kết quả và việc phải làm trước ngày đầu (お～ください, ～ていただけますか, ご～ください); đọc bài văn ~500 chữ của ワン để nắm những lỗi kính ngữ cô từng mắc, ai đã giúp, cô hiểu ra điều gì; tra bảng lịch buổi giới thiệu công ty theo nhiều điều kiện (ngày, đối tượng, có cần đăng ký, mang gì, dòng ※) để chọn đúng — và đọc ra AI làm việc gì nhờ loại kính ngữ.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N4',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '~100–200 chữ: email, tin nhắn, thông báo', 'Bài 1 — email của phòng nhân sự gửi ワン'],
        ['問題5', '内容理解（中文）', '~350–450 chữ: bài viết, nhật ký', 'Bài 2 — 「{敬語|けいご}は{難|むずか}しい？」 của ワン'],
        ['問題6', '情報検索', '~400 chữ: bảng, tờ quảng cáo, lịch', 'Bài 3 — lịch "{会社説明会|かいしゃせつめいかい}" tháng 6'],
      ],
    },
    {
      t: 'table',
      caption: 'Từ mới trong ba bài đọc (ngoài 48 từ của bài)',
      head: ['Từ', 'Romaji', 'Nghĩa', 'Bài đọc'],
      rows: [
        ['{件名|けんめい}', 'kenmei', 'tiêu đề (email)', 'Bài 1'],
        ['{結果|けっか}', 'kekka', 'kết quả (N3)', 'Bài 1'],
        ['{初日|しょにち}', 'shonichi', 'ngày đầu tiên', 'Bài 1'],
        ['{当日|とうじつ}', 'toujitsu', 'chính ngày hôm đó (N3)', 'Bài 1, 3'],
        ['{以下|いか}', 'ika', 'dưới đây; từ … trở xuống', 'Bài 1'],
        ['{間違|まちが}い', 'machigai', 'lỗi, chỗ sai', 'Bài 2'],
        ['{気持|きも}ち', 'kimochi', 'tâm trạng, tấm lòng', 'Bài 2'],
        ['{覚|おぼ}える', 'oboeru', 'nhớ, thuộc', 'Bài 2'],
        ['{対象|たいしょう}', 'taishou', 'đối tượng (N2)', 'Bài 3'],
        ['{要予約|ようよやく}', 'you yoyaku', 'cần đặt trước', 'Bài 3'],
        ['{不要|ふよう}', 'fuyou', 'không cần', 'Bài 3'],
        ['オンライン', 'onrain', 'trực tuyến', 'Bài 3'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá ({何|なに}をしなければなりませんか・どうして・{誰|だれ}が・どれ), rồi mới đọc bài để tìm.',
        '**Email kính ngữ**: việc **người đọc phải làm** nằm ở **お～ください／ご～ください／～ていただけますか／～ていただきますようお{願|ねが}いします**; việc **công ty sẽ làm** nằm ở **お～します／ご～いたします**. Đánh dấu hai loại bằng hai màu.',
        '**Bài văn**: tìm **ai làm** nhờ loại kính ngữ — tôn kính → người trên làm; khiêm nhường → người viết làm. Ý chính thường ở đoạn cuối (～と{思|おも}います・～とわかりました).',
        '**情報検索**: lập **bảng điều kiện** (ngày rảnh, là du học sinh, đã có hồ sơ chưa, có đăng ký được không), rồi **loại** từng lựa chọn. Luôn đọc dòng **※**.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: email báo kết quả thực tập' },
    {
      t: 'passage',
      title: '{件名|けんめい}：インターンシップの{結果|けっか}について（さくらシステム {人事部|じんじぶ}）',
      intro: 'Email phòng nhân sự công ty さくらシステム gửi cho ワン sau buổi gặp ở công ty. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'ワン{様|さま}' },
        { text: 'さくらシステム{人事部|じんじぶ}の{森|もり}です。{先日|せんじつ}はお{忙|いそが}しいところ、{会社|かいしゃ}までお{越|こ}しいただき、ありがとうございました。' },
        { text: 'インターンシップの{結果|けっか}ですが、ワン{様|さま}に{来月|らいげつ}から{来|き}ていただくことになりました。{初日|しょにち}は6{月|がつ}3{日|みっか}（{月|げつ}）{午前|ごぜん}9{時|じ}です。{当日|とうじつ}は、{1階|いっかい}の{受付|うけつけ}でお{名前|なまえ}をおっしゃってください。{担当|たんとう}の{鈴木|すずき}がお{迎|むか}えに{参|まい}ります。' },
        { text: 'その{前|まえ}に、{以下|いか}の{書類|しょるい}を5{月|がつ}28{日|にち}までにメールでお{送|おく}りください。①{学生証|がくせいしょう}のコピー　②{銀行|ぎんこう}の{口座|こうざ}の{情報|じょうほう}　なお、パソコンはこちらでご{用意|ようい}いたしますので、お{持|も}ちにならなくて{結構|けっこう}です。' },
        { text: 'ご{不明|ふめい}な{点|てん}がございましたら、いつでもご{連絡|れんらく}ください。どうぞよろしくお{願|ねが}いいたします。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-doc-1',
      title: 'Bài 1 — câu hỏi',
      items: [
        { q: 'ワンさんは6{月|がつ}3{日|みっか}より{前|まえ}に{何|なに}をしなければなりませんか。', options: ['パソコンを{用意|ようい}する', '{書類|しょるい}をメールで{送|おく}る', '{受付|うけつけ}に{名前|なまえ}を{言|い}いに{行|い}く', '{鈴木|すずき}さんを{迎|むか}えに{行|い}く'], correct: 1, why: '**{以下|いか}の{書類|しょるい}を5{月|がつ}28{日|にち}までにメールでお{送|おく}りください** — お～ください = việc người đọc phải làm. Nói tên ở quầy là việc của **ngày đầu**; パソコンは **お{持|も}ちにならなくて{結構|けっこう}です** (không cần — bẫy). 〔Shorui o meeru de ookuri kudasai.〕' },
        { q: '{初日|しょにち}、{受付|うけつけ}に{来|く}るのは{誰|だれ}ですか。', options: ['{森|もり}さん', '{鈴木|すずき}さん', '{受付|うけつけ}の{人|ひと}', '{人事部|じんじぶ}の{部長|ぶちょう}'], correct: 1, why: '**{担当|たんとう}の{鈴木|すずき}がお{迎|むか}えに{参|まい}ります** — {鈴木|すずき} không có さん, dùng {参|まい}る (khiêm nhường) vì là người của công ty viết thư (うち). 〔Tantou no Suzuki ga omukae ni mairimasu.〕' },
        { q: '「お{持|も}ちにならなくて{結構|けっこう}です」の{意味|いみ}は？', options: ['{持|も}ってきてください', '{持|も}ってこなくてもいいです', '{持|も}ってきてはいけません', '{持|も}っているかどうか{教|おし}えてください'], correct: 1, why: 'お{持|も}ちになる (tôn kính của {持|も}つ) + ～なくて{結構|けっこう}です (= ～なくてもいいです, lịch sự) = **không cần mang theo**. 〔Omochi ni naranakute kekkou desu.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích ngôn ngữ bài 1',
      items: [
        '**お{越|こ}しいただき** = {来|き}てもらって (đã đến) — お{越|こ}し là tôn kính của {来|く}る／{行|い}く (N2, chỉ cần nhận ra). **～ていただくことになりました** = quyết định là (anh/chị) sẽ … (ôn ことになる — Bài 21).',
        '**ご{不明|ふめい}な{点|てん}** = điểm chưa rõ (N2). **なお** = ngoài ra (văn viết). **{口座|こうざ}** = tài khoản (N2). Không hiểu hết từ vẫn trả lời được câu hỏi — đề N4 hay cố ý đặt từ khó ở chỗ không hỏi.',
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: bài văn 「{敬語|けいご}は{難|むずか}しい？」' },
    {
      t: 'passage',
      title: '{敬語|けいご}は{難|むずか}しい？（ワン）',
      intro: 'Bài văn ワン viết cho tờ báo nhỏ của lớp tiếng Nhật sau một tháng thực tập. Đọc rồi trả lời câu hỏi.',
      paras: [
        { label: '①', text: '{先月|せんげつ}から、ソフトの{会社|かいしゃ}でインターンシップをしています。{日本語|にほんご}の{勉強|べんきょう}は{三年|さんねん}{続|つづ}けてきましたが、{会社|かいしゃ}に{入|はい}って、{一番|いちばん}{困|こま}ったのは{敬語|けいご}でした。' },
        { label: '②', text: '{最初|さいしょ}の{週|しゅう}、{私|わたし}はたくさん{間違|まちが}えました。{課長|かちょう}に「{明日|あした}{何時|なんじ}に{来|き}ますか」と{聞|き}かれて、「9{時|じ}にいらっしゃいます」と{答|こた}えてしまいました。{課長|かちょう}は{笑|わら}って、「ワンさんは{偉|えら}いんですね」とおっしゃいました。{自分|じぶん}に{尊敬語|そんけいご}を{使|つか}ってしまったのです。' },
        { label: '③', text: 'もっと{大変|たいへん}だったのは{電話|でんわ}です。お{客様|きゃくさま}に「{森課長|もりかちょう}は{今|いま}いらっしゃいません」と{言|い}ったあとで、{先輩|せんぱい}の{鈴木|すずき}さんに{注意|ちゅうい}されました。{会社|かいしゃ}の{外|そと}の{人|ひと}と{話|はな}すときは、{自分|じぶん}の{会社|かいしゃ}の{人|ひと}を{高|たか}くしないそうです。{国|くに}では、{上|うえ}の{人|ひと}はいつでも{上|うえ}なので、とても{驚|おどろ}きました。' },
        { label: '④', text: 'それから{毎晩|まいばん}、{鈴木|すずき}さんにいただいたノートで{練習|れんしゅう}しました。ノートには、「{誰|だれ}がするか、{誰|だれ}と{話|はな}しているかをまず{考|かんが}えて」と{書|か}いてありました。{言葉|ことば}を{覚|おぼ}えるより、この{二|ふた}つを{考|かんが}えることが{大切|たいせつ}だとわかりました。' },
        { label: '⑤', text: '{今|いま}でも{間違|まちが}えることはありますが、{前|まえ}ほど{怖|こわ}くありません。{敬語|けいご}は、{相手|あいて}を{大切|たいせつ}に{思|おも}う{気持|きも}ちを{言葉|ことば}にしたものだと{思|おも}います。{完全|かんぜん}でなくても、その{気持|きも}ちがあれば、きっと{伝|つた}わるはずです。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-doc-2',
      title: 'Bài 2 — câu hỏi',
      items: [
        { q: '{課長|かちょう}はどうして「ワンさんは{偉|えら}いんですね」と{言|い}いましたか。', options: ['ワンさんが{早|はや}く{会社|かいしゃ}に{来|き}たから', 'ワンさんが{自分|じぶん}のことに{尊敬語|そんけいご}を{使|つか}ったから', 'ワンさんの{日本語|にほんご}がとても{上手|じょうず}だったから', 'ワンさんが{課長|かちょう}に{敬語|けいご}を{使|つか}わなかったから'], correct: 1, why: 'ワン trả lời về mình bằng **いらっしゃいます** (tôn kính) — "tự nâng mình" ⇒ trưởng phòng đùa "em oai quá nhỉ". Câu giải thích ngay sau: **{自分|じぶん}に{尊敬語|そんけいご}を{使|つか}ってしまったのです**. 〔Jibun ni sonkeigo o tsukatte shimatta no desu.〕' },
        { q: 'ワンさんは{電話|でんわ}で、{何|なん}と{言|い}えばよかったですか。', options: ['{森課長|もりかちょう}はいらっしゃいません。', '{森|もり}はただいま{席|せき}を{外|はず}しております。', '{森課長|もりかちょう}さんはおりません。', '{森様|もりさま}はお{出|で}かけになりました。'], correct: 1, why: 'Với khách bên ngoài, người công ty mình **không được nâng**: bỏ chức vụ, dùng khiêm nhường おる → **{森|もり}はただいま{席|せき}を{外|はず}しております**. 〔Mori wa tadaima seki o hazushite orimasu.〕' },
        { q: '{鈴木|すずき}さんのノートに{書|か}いてあったことは{何|なん}ですか。', options: ['{敬語|けいご}の{言葉|ことば}をたくさん{覚|おぼ}えること', '{誰|だれ}がするか、{誰|だれ}と{話|はな}しているかを{考|かんが}えること', '{毎晩|まいばん}{電話|でんわ}で{練習|れんしゅう}すること', '{間違|まちが}えたらすぐ{謝|あやま}ること'], correct: 1, why: '**「{誰|だれ}がするか、{誰|だれ}と{話|はな}しているかをまず{考|かんが}えて」** — chính là hai câu hỏi: AI làm? và nói với AI? (うち・そと). 〔Dare ga suru ka, dare to hanashite iru ka o mazu kangaete.〕' },
        { q: 'ワンさんが{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', options: ['{敬語|けいご}は{完全|かんぜん}に{覚|おぼ}えなければならない。', '{敬語|けいご}は{相手|あいて}を{大切|たいせつ}に{思|おも}う{気持|きも}ちを{表|あらわ}すものだ。', '{会社|かいしゃ}では{敬語|けいご}を{使|つか}わないほうがいい。', '{日本|にほん}と{国|くに}の{敬語|けいご}は{同|おな}じだ。'], correct: 1, why: 'Ý chính ở đoạn cuối: **{敬語|けいご}は、{相手|あいて}を{大切|たいせつ}に{思|おも}う{気持|きも}ちを{言葉|ことば}にしたものだ** — và **{完全|かんぜん}でなくても…{伝|つた}わるはず** (đáp án 1 bị phủ định).' },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích ngôn ngữ bài 2',
      items: [
        '**{偉|えら}い** = giỏi, oai, chức cao (N3) — {課長|かちょう} nói đùa. **～てしまったのです** = "chuyện là tôi đã lỡ…" (ôn てしまう Bài 19 + のです giải thích).',
        '**{自分|じぶん}の{会社|かいしゃ}の{人|ひと}を{高|たか}くしないそうです** — ～そうです nghe nói (ôn ポイント 119). **{前|まえ}ほど{怖|こわ}くありません** = không còn sợ như trước (N ほど～ない — N3, sẽ học ở Bài 29). **はず** — ôn Bài 20.',
        'Đếm kính ngữ trong bài: tôn kính **おっしゃいました** (trưởng phòng nói), **いらっしゃいません** (lỗi của ワン), khiêm nhường **いただいた** (nhận sổ từ chị 鈴木). Đọc ra AI làm nhờ loại kính ngữ là kỹ năng đề N4 hay kiểm tra.',
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: lịch các buổi giới thiệu công ty tháng 6' },
    {
      t: 'passage',
      title: '6{月|がつ}の{会社説明会|かいしゃせつめいかい}（{大学|だいがく}キャリアセンター）',
      intro: 'Tờ thông báo dán ở trung tâm hướng nghiệp của trường. Đọc bảng rồi trả lời câu hỏi.',
      paras: [
        { text: '{留学生|りゅうがくせい}の{皆様|みなさま}へ　6{月|がつ}に{学内|がくない}で{行|おこな}われる{会社説明会|かいしゃせつめいかい}をご{案内|あんない}します。{参加|さんか}をご{希望|きぼう}の{方|かた}は、{予約|よやく}が{必要|ひつよう}かどうか{確認|かくにん}してから、{当日|とうじつ}{会場|かいじょう}にいらっしゃってください。' },
        { label: 'A', text: 'さくらシステム（IT）　6{月|がつ}7{日|なのか}（{金|きん}）14:00～16:00　{教室|きょうしつ}301　{対象|たいしょう}：3・4{年生|ねんせい}　{予約|よやく}：{要予約|ようよやく}（ホームページから）　{持|も}ち{物|もの}：{履歴書|りれきしょ}' },
        { label: 'B', text: 'みどり{旅行|りょこう}（{旅行|りょこう}）　6{月|がつ}8{日|ようか}（{土|ど}）10:00～11:30　{教室|きょうしつ}205　{対象|たいしょう}：{全学年|ぜんがくねん}　{予約|よやく}：{不要|ふよう}　{持|も}ち{物|もの}：なし' },
        { label: 'C', text: '{東京商事|とうきょうしょうじ}（{貿易|ぼうえき}）　6{月|がつ}8{日|ようか}（{土|ど}）13:00～15:00　{教室|きょうしつ}301　{対象|たいしょう}：4{年生|ねんせい}のみ　{予約|よやく}：{要予約|ようよやく}（メールで）　{持|も}ち{物|もの}：{履歴書|りれきしょ}・{学生証|がくせいしょう}' },
        { label: 'D', text: 'ひかり{電気|でんき}（メーカー）　6{月|がつ}15{日|にち}（{土|ど}）10:00～12:00　オンライン　{対象|たいしょう}：{全学年|ぜんがくねん}　{予約|よやく}：{要予約|ようよやく}（ホームページから）　{持|も}ち{物|もの}：なし' },
        { text: '※{予約|よやく}が{必要|ひつよう}な{説明会|せつめいかい}は、{前|まえ}の{日|ひ}の{午後|ごご}5{時|じ}までにお{申|もう}し{込|こ}みください。※{日本語|にほんご}で{行|おこな}われます。{通訳|つうやく}はございません。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-doc-3',
      title: 'Bài 3 — câu hỏi',
      items: [
        { q: 'ダニエルさんは3{年生|ねんせい}です。{土曜日|どようび}しか{時間|じかん}がありません。まだ{履歴書|りれきしょ}がありません。{予約|よやく}をしないで{行|い}ける{説明会|せつめいかい}はどれですか。', options: ['A', 'B', 'C', 'D'], correct: 1, why: 'Thứ Bảy: B, C, D. C chỉ dành cho **4{年生|ねんせい}のみ** + cần hồ sơ ✗. D **{要予約|ようよやく}** ✗. Còn **B**: {全学年|ぜんがくねん}, **{予約|よやく}：{不要|ふよう}**, không cần mang gì.' },
        { q: 'リンさんは4{年生|ねんせい}です。6{月|がつ}8{日|ようか}の{東京商事|とうきょうしょうじ}の{説明会|せつめいかい}に{行|い}きたいです。いつまでに、どうやって{申|もう}し{込|こ}みますか。', options: ['6{月|がつ}7{日|なのか}{午後|ごご}5{時|じ}までに、メールで', '6{月|がつ}7{日|なのか}{午後|ごご}5{時|じ}までに、ホームページから', '6{月|がつ}8{日|ようか}の{朝|あさ}、{会場|かいじょう}で', '{申|もう}し{込|こ}まなくてもいい'], correct: 0, why: 'C: **{要予約|ようよやく}（メールで）** + dòng ※: **{前|まえ}の{日|ひ}の{午後|ごご}5{時|じ}までに** ⇒ 7/6, 17:00, qua email.' },
        { q: 'この{紙|かみ}の{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['{説明会|せつめいかい}は{全部|ぜんぶ}{教室|きょうしつ}で{行|おこな}われる。', '{英語|えいご}の{通訳|つうやく}がある{説明会|せつめいかい}もある。', 'さくらシステムの{説明会|せつめいかい}には{履歴書|りれきしょ}を{持|も}っていく。', 'みどり{旅行|りょこう}の{説明会|せつめいかい}は{予約|よやく}が{必要|ひつよう}だ。'], correct: 2, why: 'A: **{持|も}ち{物|もの}：{履歴書|りれきしょ}** ✓. D là **オンライン** (không phải tất cả ở lớp); ※ **{通訳|つうやく}はございません**; B **{不要|ふよう}**.' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{当日|とうじつ}は、{受付|うけつけ}でお{名前|なまえ}をおっしゃってください。', 'Toujitsu wa, uketsuke de onamae o osshatte kudasai.', 'Hôm đó xin anh/chị nói tên ở quầy lễ tân. (tôn kính — việc người đọc làm)'),
        E('{担当|たんとう}の{鈴木|すずき}がお{迎|むか}えに{参|まい}ります。', 'Tantou no Suzuki ga omukae ni mairimasu.', 'Chị Suzuki phụ trách sẽ ra đón. (khiêm nhường — người của công ty)'),
        E('パソコンはこちらでご{用意|ようい}いたします。', 'Pasokon wa kochira de goyoui itashimasu.', 'Máy tính chúng tôi sẽ chuẩn bị. (ご～いたす)'),
        E('{予約|よやく}が{必要|ひつよう}かどうか{確認|かくにん}してください。', 'Yoyaku ga hitsuyou ka dou ka kakunin shite kudasai.', 'Hãy kiểm tra xem có cần đặt trước hay không. (～かどうか)'),
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b24-noi',
  kind: 'speaking',
  title: 'Luyện nói — tự giới thiệu kiểu phỏng vấn, trả lời câu hỏi về người mình kính trọng, nói với thầy cô, nhập vai gọi điện hẹn lịch, nói 1 phút, đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói về chủ đề công ty, phỏng vấn, người trên (自己紹介をしてください・あなたの長所は何ですか・尊敬している人はだれですか・先生と話すとき何に気をつけますか) bằng khiêm nhường ngữ cho việc của mình (申します・参りました・おります) và tôn kính ngữ khi nhắc tới người trên; nhìn tranh nói đúng câu của lễ tân, của nhân viên nghe điện thoại; nhập vai gọi điện xin hẹn gặp; nói 1 phút "tự giới thiệu ở buổi phỏng vấn"; đọc to đoạn ~100 chữ không vấp ở いらっしゃいます, 召し上がって, 申し訳ございません.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) — chủ đề Bài 24 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 24 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100 chữ.', 'Đoạn có kính ngữ: いらっしゃいました · {召|め}し{上|あ}がって · {申|もう}し{訳|わけ}ございません · {拝見|はいけん}しました'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (quầy lễ tân, gõ cửa phòng thầy, nghe điện thoại) trả lời.', 'この{人|ひと}は{何|なん}と{言|い}いますか（→ {少々|しょうしょう}お{待|ま}ちください／{失礼|しつれい}します）'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{自己紹介|じこしょうかい}をしてください · あなたの{長所|ちょうしょ}は{何|なん}ですか · {尊敬|そんけい}している{人|ひと}はだれですか'],
        ['Presenting', '5', 'Chào khi vào/ra, thái độ.', 'Vào: **{失礼|しつれい}します** (gõ cửa) · Ra: **ありがとうございました。{失礼|しつれい}します** — chính là kỹ năng của bài này.'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 24',
      items: [
        '**Nói về MÌNH với giám thị → khiêm nhường, không bao giờ tôn kính**: ~~{私|わたし}はベトナムからいらっしゃいました~~ → **ベトナムから{参|まい}りました**; ~~{私|わたし}はグエンとおっしゃいます~~ → **グエンと{申|もう}します**. Lỗi này mất điểm ngay câu đầu.',
        '**Nói về người mình kính trọng (bố mẹ, thầy cô)**: bố mẹ mình = **người nhà** → không tôn kính khi nói với giám thị: {父|ちち}は{教師|きょうし}を**しております**. Thầy cô (người ngoài gia đình) → tôn kính: {高校|こうこう}の{先生|せんせい}がいつも「～」と**おっしゃっていました**.',
        '**Câu trả lời 2 ý**: trả lời + lý do / ví dụ. {私|わたし}の{長所|ちょうしょ}は{最後|さいご}までがんばるところです。アルバイトでも、{仕事|しごと}を{覚|おぼ}えるまで{毎日|まいにち}{練習|れんしゅう}しました. Một câu cụt chỉ được nửa điểm.',
        '**Không chắc kính ngữ thì dùng です・ます chuẩn** — sai loại kính ngữ còn tệ hơn không dùng. Mức an toàn cho N4: **～と{申|もう}します · {参|まい}りました · ～ております · いただきます · {失礼|しつれい}します**, và với người trên: **いらっしゃいます · おっしゃいました**.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — giám thị ↔ thí sinh',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{自己紹介|じこしょうかい}をしてください。', ro: 'Jiko shoukai o shite kudasai.', vi: 'Em hãy tự giới thiệu.' },
        { who: 'Bạn', role: 'candidate', text: 'はじめまして。ベトナムから{参|まい}りましたグエンと{申|もう}します。{今|いま}、FPT{大学|だいがく}で{情報|じょうほう}を{勉強|べんきょう}しております。どうぞよろしくお{願|ねが}いいたします。', ro: 'Hajimemashite. Betonamu kara mairimashita Guen to moushimasu. Ima, efu-pii-tii daigaku de jouhou o benkyou shite orimasu. Douzo yoroshiku onegai itashimasu.', vi: 'Rất hân hạnh. Em là Nguyễn, đến từ Việt Nam. Hiện em đang học công nghệ thông tin ở Đại học FPT. Rất mong được giúp đỡ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'あなたの{長所|ちょうしょ}は{何|なん}ですか。', ro: 'Anata no chousho wa nan desu ka.', vi: 'Điểm mạnh của em là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{長所|ちょうしょ}は、{最後|さいご}までがんばるところです。アルバイトでも、{仕事|しごと}を{覚|おぼ}えるまで{毎日|まいにち}{練習|れんしゅう}しました。', ro: 'Watashi no chousho wa, saigo made ganbaru tokoro desu. Arubaito demo, shigoto o oboeru made mainichi renshuu shimashita.', vi: 'Điểm mạnh của em là cố gắng đến cùng. Ở chỗ làm thêm, em cũng luyện tập mỗi ngày cho đến khi thạo việc.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{尊敬|そんけい}している{人|ひと}はだれですか。', ro: 'Sonkei shite iru hito wa dare desu ka.', vi: 'Người em kính trọng là ai?' },
        { who: 'Bạn', role: 'candidate', text: '{高校|こうこう}の{先生|せんせい}です。{先生|せんせい}はいつも「{失敗|しっぱい}してもいいから、やってみなさい」とおっしゃっていました。その{言葉|ことば}のおかげで、{日本|にほん}に{来|く}ることができました。', ro: 'Koukou no sensei desu. Sensei wa itsumo "Shippai shite mo ii kara, yatte minasai" to osshatte imashita. Sono kotoba no okage de, Nihon ni kuru koto ga dekimashita.', vi: 'Là thầy giáo cấp ba của em. Thầy luôn nói "Thất bại cũng không sao, cứ thử làm đi". Nhờ câu nói đó mà em đã sang được Nhật.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{先生|せんせい}や{先輩|せんぱい}と{話|はな}すとき、{何|なに}に{気|き}をつけていますか。', ro: 'Sensei ya senpai to hanasu toki, nani ni ki o tsukete imasu ka.', vi: 'Khi nói chuyện với thầy cô hay đàn anh, em chú ý điều gì?' },
        { who: 'Bạn', role: 'candidate', text: '{誰|だれ}がするかを{考|かんが}えてから、{敬語|けいご}を{使|つか}うようにしています。{自分|じぶん}のことには{尊敬語|そんけいご}を{使|つか}わないように{気|き}をつけています。', ro: 'Dare ga suru ka o kangaete kara, keigo o tsukau you ni shite imasu. Jibun no koto ni wa sonkeigo o tsukawanai you ni ki o tsukete imasu.', vi: 'Em cố gắng nghĩ xem ai làm rồi mới dùng kính ngữ. Em chú ý không dùng tôn kính ngữ cho việc của mình.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいですか。', ro: 'Nihon no kaisha de hatarakitai desu ka.', vi: 'Em có muốn làm việc ở công ty Nhật không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{働|はたら}きたいです。でも、{日本|にほん}で{働|はたら}くかどうかは、まだ{家族|かぞく}と{相談|そうだん}しているところです。', ro: 'Hai, hatarakitai desu. Demo, Nihon de hataraku ka dou ka wa, mada kazoku to soudan shite iru tokoro desu.', vi: 'Có ạ, em muốn làm. Nhưng có làm ở Nhật hay không thì em vẫn đang bàn với gia đình ạ.' },
      ],
    },
    { t: 'h', text: 'Talking — có tranh: 3 tranh kiểu đề thi' },
    {
      t: 'canh',
      anh: ['woman-tipping-hand', 'door', 'telephone-receiver'],
      caption: 'Tranh 1: ở quầy lễ tân công ty, một khách nam mặc vest vừa nói tên; nhân viên lễ tân đang đứng lên, tay chỉ về ghế chờ. Tranh 2: một sinh viên đứng trước cửa "職員室", tay đang gõ cửa. Tranh 3: một nhân viên trẻ cầm điện thoại, bàn bên cạnh trống — trên ghế có tờ giấy "外出中 15:00 戻り".',
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — nhìn tranh trả lời (mỗi câu 2 ý)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{一番|いちばん}の{絵|え}を{見|み}てください。{受付|うけつけ}の{人|ひと}は{何|なん}と{言|い}いますか。', ro: 'Ichiban no e o mite kudasai. Uketsuke no hito wa nan to iimasu ka.', vi: 'Em xem tranh số 1. Nhân viên lễ tân nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「お{待|ま}ちしておりました。こちらで{少々|しょうしょう}お{待|ま}ちください」と{言|い}います。そのあと、{担当|たんとう}の{人|ひと}を{呼|よ}ぶと{思|おも}います。', ro: '"Omachi shite orimashita. Kochira de shoushou omachi kudasai" to iimasu. Sono ato, tantou no hito o yobu to omoimasu.', vi: 'Chị ấy nói "Chúng tôi đang chờ anh. Xin anh chờ ở đây một chút". Sau đó em nghĩ chị ấy sẽ gọi người phụ trách.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{二番|にばん}の{絵|え}を{見|み}てください。この{学生|がくせい}は、ドアを{開|あ}けたら{何|なん}と{言|い}いますか。', ro: 'Niban no e o mite kudasai. Kono gakusei wa, doa o aketara nan to iimasu ka.', vi: 'Em xem tranh số 2. Mở cửa ra thì sinh viên này nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{失礼|しつれい}します。{本田先生|ほんだせんせい}はいらっしゃいますか」と{言|い}います。{先生|せんせい}がいらっしゃったら、「{今|いま}、お{時間|じかん}よろしいでしょうか」と{聞|き}きます。', ro: '"Shitsurei shimasu. Honda-sensei wa irasshaimasu ka" to iimasu. Sensei ga irasshattara, "Ima, ojikan yoroshii deshou ka" to kikimasu.', vi: 'Bạn ấy nói "Em xin phép ạ. Thầy Honda có ở đây không ạ?". Nếu thầy có ở đó thì hỏi "Bây giờ thầy có thời gian không ạ?".' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{三番|さんばん}の{絵|え}を{見|み}てください。お{客様|きゃくさま}から{課長|かちょう}に{電話|でんわ}がありました。この{人|ひと}は{何|なん}と{言|い}いますか。', ro: 'Sanban no e o mite kudasai. Okyakusama kara kachou ni denwa ga arimashita. Kono hito wa nan to iimasu ka.', vi: 'Em xem tranh số 3. Khách gọi điện tìm trưởng phòng. Người này nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{申|もう}し{訳|わけ}ございません。{課長|かちょう}の{森|もり}はただいま{外出|がいしゅつ}しております。3{時|じ}に{戻|もど}る{予定|よてい}です」と{言|い}います。{伝言|でんごん}があるかどうかも{聞|き}きます。', ro: '"Moushiwake gozaimasen. Kachou no Mori wa tadaima gaishutsu shite orimasu. Sanji ni modoru yotei desu" to iimasu. Dengon ga aru ka dou ka mo kikimasu.', vi: 'Anh ấy nói "Thật xin lỗi, trưởng phòng Mori hiện đang ra ngoài. Dự kiến 3 giờ anh ấy về". Và hỏi xem khách có muốn nhắn gì không.' },
      ],
    },
    {
      t: 'phatam',
      id: 'b24-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 24',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý: いらっしゃいます (i-ras-sha-i-ma-su — っ ngắt rõ, không ~~irashaimasu~~); おっしゃいました (os-sha-i — っ ngắt); めしあがって (me-shi-a-gat-te); しょうしょう (shoo-shoo — hai trường âm); もうしわけございません (moo-shi-wa-ke go-za-i-ma-sen); しょうち (shoo-chi).',
      items: [
        { text: 'わたくし、ワンと{申|もう}します。', ipa: 'watakushi wan to moushimasu', vi: 'Tôi tên là Vương.' },
        { text: '{森課長|もりかちょう}はいらっしゃいますか。', ipa: 'mori kachou wa irasshaimasu ka', vi: 'Trưởng phòng Mori có ở đó không ạ?' },
        { text: '{少々|しょうしょう}お{待|ま}ちください。', ipa: 'shoushou omachi kudasai', vi: 'Xin chờ một chút.' },
        { text: '{森|もり}はただいま{席|せき}を{外|はず}しております。', ipa: 'mori wa tadaima seki o hazushite orimasu', vi: 'Anh Mori hiện không có ở chỗ ngồi.' },
        { text: '{戻|もど}りましたら、{折|お}り{返|かえ}しお{電話|でんわ}いたします。', ipa: 'modorimashitara orikaeshi odenwa itashimasu', vi: 'Khi anh ấy về, chúng tôi sẽ gọi lại.' },
        { text: '{申|もう}し{訳|わけ}ございません。', ipa: 'moushiwake gozaimasen', vi: 'Thật xin lỗi.' },
        { text: '{失礼|しつれい}いたします。', ipa: 'shitsurei itashimasu', vi: 'Tôi xin phép.' },
        { text: 'どうぞ、お{掛|か}けください。', ipa: 'douzo okake kudasai', vi: 'Mời anh/chị ngồi.' },
        { text: 'どうぞ、{召|め}し{上|あ}がってください。', ipa: 'douzo meshiagatte kudasai', vi: 'Mời anh/chị dùng.' },
        { text: '{履歴書|りれきしょ}を{拝見|はいけん}します。', ipa: 'rirekisho o haiken shimasu', vi: 'Tôi xin xem sơ yếu lý lịch.' },
        { text: '{先生|せんせい}が「がんばって」とおっしゃいました。', ipa: 'sensei ga ganbatte to osshaimashita', vi: 'Thầy nói "Cố lên nhé".' },
        { text: 'お{荷物|にもつ}をお{持|も}ちしましょうか。', ipa: 'onimotsu o omochi shimashou ka', vi: 'Để tôi xách hành lý giúp nhé?' },
        { text: '{何時|なんじ}に{伺|うかが}えばよろしいでしょうか。', ipa: 'nanji ni ukagaeba yoroshii deshou ka', vi: 'Tôi nên đến lúc mấy giờ ạ?' },
        { text: '{行|い}けるかどうか、まだわかりません。', ipa: 'ikeru ka dou ka mada wakarimasen', vi: 'Tôi chưa biết có đi được hay không.' },
      ],
    },
    {
      t: 'note',
      title: 'Nói 1 phút — "Tự giới thiệu ở buổi phỏng vấn thực tập" (khiêm nhường ngữ)',
      items: [
        '**Dàn ý**: ① chào + tên + đến từ đâu ({参|まい}りました・{申|もう}します) → ② đang học gì, ở đâu (～ております) → ③ vì sao muốn vào công ty này (～と{伺|うかが}って／～を{拝見|はいけん}して) → ④ điểm mạnh + ví dụ → ⑤ kết (よろしくお{願|ねが}いいたします).',
        '{本日|ほんじつ}はお{時間|じかん}をいただき、ありがとうございます。ベトナムから{参|まい}りましたグエンと{申|もう}します。{今|いま}、{大学|だいがく}でソフトの{作|つく}り{方|かた}を{勉強|べんきょう}しております。{先輩|せんぱい}から、こちらの{会社|かいしゃ}ではお{客様|きゃくさま}の{話|はなし}をとても{大切|たいせつ}にしていると{伺|うかが}いました。ホームページで{皆様|みなさま}のお{仕事|しごと}を{拝見|はいけん}して、{私|わたし}もここで{働|はたら}きたいと{思|おも}いました。{私|わたし}の{長所|ちょうしょ}は、{最後|さいご}までがんばるところです。{日本語|にほんご}も、{毎日|まいにち}{一時間|いちじかん}{勉強|べんきょう}を{続|つづ}けております。どうぞよろしくお{願|ねが}いいたします。',
        'Romaji: Honjitsu wa ojikan o itadaki, arigatou gozaimasu. Betonamu kara mairimashita Guen to moushimasu. Ima, daigaku de sofuto no tsukurikata o benkyou shite orimasu. Senpai kara, kochira no kaisha de wa okyakusama no hanashi o totemo taisetsu ni shite iru to ukagaimashita. Hoomupeeji de minasama no oshigoto o haiken shite, watashi mo koko de hatarakitai to omoimashita. Watashi no chousho wa, saigo made ganbaru tokoro desu. Nihongo mo, mainichi ichijikan benkyou o tsuzukete orimasu. Douzo yoroshiku onegai itashimasu.',
        'Nghĩa: Hôm nay cảm ơn anh/chị đã dành thời gian cho tôi. Tôi là Nguyễn, đến từ Việt Nam. Hiện tôi đang học cách làm phần mềm ở trường đại học. Tôi được đàn anh kể rằng công ty mình rất coi trọng lời khách hàng. Xem công việc của mọi người trên trang web, tôi cũng muốn được làm việc ở đây. Điểm mạnh của tôi là cố gắng đến cùng. Tiếng Nhật tôi cũng đang duy trì học mỗi ngày một tiếng. Rất mong được anh/chị giúp đỡ.',
        'Đếm mẫu: khiêm nhường **{参|まい}りました · {申|もう}します · ～ております ×2 · {伺|うかが}いました · {拝見|はいけん}して · いただき · お{願|ねが}いいたします**; mỹ hoá **お{仕事|しごと} · {皆様|みなさま}**. Không có một chữ tôn kính nào cho bản thân — đúng chuẩn phỏng vấn.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 40 điểm) — đoạn mẫu 30 giây',
      items: [
        '{先週|せんしゅう}、{会社訪問|かいしゃほうもん}に{行|い}きました。{受付|うけつけ}で{名前|なまえ}を{言|い}うと、{応接室|おうせつしつ}に{案内|あんない}されました。{課長|かちょう}がいらっしゃって、「どうぞ、{召|め}し{上|あ}がってください」とお{茶|ちゃ}を{勧|すす}めてくださいました。{緊張|きんちょう}して、「{申|もう}し{訳|わけ}ございません」と{何度|なんど}も{言|い}ってしまいましたが、{課長|かちょう}は{笑|わら}って{話|はなし}を{聞|き}いてくださいました。',
        'Romaji: Senshuu, kaisha houmon ni ikimashita. Uketsuke de namae o iu to, ousetsushitsu ni annai saremashita. Kachou ga irasshatte, "Douzo, meshiagatte kudasai" to ocha o susumete kudasaimashita. Kinchou shite, "Moushiwake gozaimasen" to nando mo itte shimaimashita ga, kachou wa waratte hanashi o kiite kudasaimashita.',
        'Nghĩa: Tuần trước tôi đi thăm công ty. Nói tên ở quầy lễ tân xong, tôi được dẫn vào phòng tiếp khách. Trưởng phòng đến và mời tôi trà: "Mời em dùng". Vì hồi hộp, tôi lỡ nói "Thật xin lỗi" mấy lần, nhưng trưởng phòng vẫn cười và lắng nghe tôi nói.',
        'Chỗ dễ vấp: **いらっしゃって** (i-ras-shat-te — hai chỗ っ), **{召|め}し{上|あ}がって** (me-shi-a-gat-te), **{勧|すす}めてくださいました** (su-su-me-te ku-da-sa-i-ma-shi-ta — đừng đọc ~~くださりました~~), **{申|もう}し{訳|わけ}ございません** (go-za-i-ma-sen — đọc liền một hơi).',
      ],
    },
    { t: 'h', text: 'Nhập vai — gọi điện xin hẹn gặp (ロールプレイ)' },
    {
      t: 'p',
      text: 'Đề nhập vai kiểu thi nói: bạn muốn **đến thăm công ty** để hỏi về chương trình thực tập. Giám thị đóng vai **nhân viên nhân sự**. Phải nói được: **chào + tự giới thiệu** (お{忙|いそが}しいところ{恐|おそ}れ{入|い}ります・～と{申|もう}します), **mục đích cuộc gọi** (～のことでお{電話|でんわ}いたしました), **xin hẹn** ({伺|うかが}いたいんですが), **hỏi điều chưa biết** bằng ～か／～かどうか, **xác nhận + chào** (かしこまりました・{失礼|しつれい}いたします).',
    },
    {
      t: 'dialogue',
      title: 'Nhập vai mẫu — giám thị (nhân viên nhân sự) ↔ thí sinh',
      lines: [
        { who: '{人事部|じんじぶ}の{人|ひと}', role: 'examiner', text: 'はい、ひかり{電気|でんき}{人事部|じんじぶ}でございます。', ro: 'Hai, Hikari Denki jinjibu de gozaimasu.', vi: 'Vâng, phòng nhân sự công ty Hikari Denki xin nghe.' },
        { who: 'Bạn', role: 'candidate', text: 'お{忙|いそが}しいところ{恐|おそ}れ{入|い}ります。{留学生|りゅうがくせい}のグエンと{申|もう}します。インターンシップのことでお{電話|でんわ}いたしました。', ro: 'Oisogashii tokoro osoreirimasu. Ryuugakusei no Guen to moushimasu. Intaanshippu no koto de odenwa itashimashita.', vi: 'Xin lỗi đã làm phiền lúc anh đang bận. Tôi là Nguyễn, du học sinh. Tôi gọi về việc thực tập ạ.' },
        { who: '{人事部|じんじぶ}の{人|ひと}', role: 'examiner', text: 'はい、どのようなご{用件|ようけん}でしょうか。', ro: 'Hai, dono you na goyouken deshou ka.', vi: 'Vâng, anh cần gì ạ?' },
        { who: 'Bạn', role: 'candidate', text: '{一度|いちど}{会社|かいしゃ}に{伺|うかが}って、お{話|はなし}を{伺|うかが}いたいんですが、よろしいでしょうか。', ro: 'Ichido kaisha ni ukagatte, ohanashi o ukagaitai n desu ga, yoroshii deshou ka.', vi: 'Tôi muốn đến công ty một lần để nghe giới thiệu, có được không ạ?' },
        { who: '{人事部|じんじぶ}の{人|ひと}', role: 'examiner', text: 'はい、{来週|らいしゅう}の{火曜日|かようび}か{木曜日|もくようび}の{午後|ごご}はいかがですか。', ro: 'Hai, raishuu no kayoubi ka mokuyoubi no gogo wa ikaga desu ka.', vi: 'Vâng, chiều thứ Ba hoặc thứ Năm tuần sau anh thấy thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'では、{木曜日|もくようび}の{午後|ごご}2{時|じ}に{伺|うかが}います。{何|なに}を{持|も}っていけばよろしいか、{教|おし}えていただけませんか。', ro: 'Dewa, mokuyoubi no gogo niji ni ukagaimasu. Nani o motte ikeba yoroshii ka, oshiete itadakemasen ka.', vi: 'Vậy tôi xin đến lúc 2 giờ chiều thứ Năm. Anh có thể cho tôi biết nên mang theo gì không ạ?' },
        { who: '{人事部|じんじぶ}の{人|ひと}', role: 'examiner', text: '{学生証|がくせいしょう}をお{持|も}ちください。{受付|うけつけ}で{人事部|じんじぶ}の{山田|やまだ}とおっしゃってください。', ro: 'Gakuseishou o omochi kudasai. Uketsuke de jinjibu no Yamada to osshatte kudasai.', vi: 'Anh mang theo thẻ sinh viên. Ở quầy lễ tân, anh nói tìm Yamada phòng nhân sự.' },
        { who: 'Bạn', role: 'candidate', text: 'かしこまりました。{木曜日|もくようび}の2{時|じ}、{山田様|やまださま}ですね。よろしくお{願|ねが}いいたします。{失礼|しつれい}いたします。', ro: 'Kashikomarimashita. Mokuyoubi no niji, Yamada-sama desu ne. Yoroshiku onegai itashimasu. Shitsurei itashimasu.', vi: 'Tôi rõ rồi ạ. 2 giờ thứ Năm, gặp anh Yamada ạ. Mong anh giúp đỡ. Xin chào anh ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhập vai',
      items: [
        '**Câu đầu phải có tên + mục đích**: ～と{申|もう}します。～のことでお{電話|でんわ}いたしました. Giám thị chấm "đi thẳng vào việc".',
        '**Lặp lại để xác nhận** (giờ, tên người cần gặp): {木曜日|もくようび}の2{時|じ}、{山田様|やまださま}ですね — người nghe máy là người ngoài nên tên họ có **様**, dù họ tự gọi mình là {山田|やまだ}.',
        '**Không nghe rõ**: {恐|おそ}れ{入|い}りますが、もう{一度|いちど}おっしゃっていただけますか. Cứu được cả cuộc hội thoại — đừng im lặng.',
      ],
    },
    { t: 'h', text: 'Nhập vai 2 — ở quầy lễ tân và vào phòng phỏng vấn (ロールプレイ)' },
    {
      t: 'dialogue',
      title: 'Nhập vai mẫu — giám thị (lễ tân → người phỏng vấn) ↔ thí sinh',
      lines: [
        { who: '{受付|うけつけ}', role: 'examiner', text: 'いらっしゃいませ。{失礼|しつれい}ですが、どちら{様|さま}でしょうか。', ro: 'Irasshaimase. Shitsurei desu ga, dochira-sama deshou ka.', vi: 'Kính chào anh. Xin lỗi, anh là ai ạ?' },
        { who: 'Bạn', role: 'candidate', text: 'グエンと{申|もう}します。{人事部|じんじぶ}の{山田様|やまださま}と2{時|じ}にお{約束|やくそく}しております。', ro: 'Guen to moushimasu. Jinjibu no Yamada-sama to niji ni oyakusoku shite orimasu.', vi: 'Tôi là Nguyễn. Tôi có hẹn với anh Yamada phòng nhân sự lúc 2 giờ ạ.' },
        { who: '{受付|うけつけ}', role: 'examiner', text: 'グエン{様|さま}ですね。お{待|ま}ちしておりました。{会議室|かいぎしつ}にご{案内|あんない}いたします。', ro: 'Guen-sama desu ne. Omachi shite orimashita. Kaigishitsu ni goannai itashimasu.', vi: 'Anh Nguyễn phải không ạ. Chúng tôi đang chờ anh. Tôi xin dẫn anh đến phòng họp.' },
        { who: 'Bạn', role: 'candidate', text: '（ノックを{3回|さんかい}して）{失礼|しつれい}いたします。', ro: '(Nokku o sankai shite) Shitsurei itashimasu.', vi: '(Gõ cửa 3 tiếng) Tôi xin phép ạ.' },
        { who: '{面接官|めんせつかん}', role: 'examiner', text: 'どうぞ、お{掛|か}けください。{今日|きょう}はどうやって{来|こ}られましたか。', ro: 'Douzo, okake kudasai. Kyou wa douyatte koraremashita ka.', vi: 'Mời anh ngồi. Hôm nay anh đến bằng gì?' },
        { who: 'Bạn', role: 'candidate', text: '{失礼|しつれい}いたします。{電車|でんしゃ}で{参|まい}りました。{駅|えき}から{近|ちか}くて、すぐにわかりました。', ro: 'Shitsurei itashimasu. Densha de mairimashita. Eki kara chikakute, sugu ni wakarimashita.', vi: 'Tôi xin phép ạ. Tôi đi tàu đến ạ. Gần ga nên tôi tìm thấy ngay.' },
        { who: '{面接官|めんせつかん}', role: 'examiner', text: 'それはよかったです。では、{簡単|かんたん}に{自己紹介|じこしょうかい}をお{願|ねが}いします。', ro: 'Sore wa yokatta desu. Dewa, kantan ni jiko shoukai o onegai shimasu.', vi: 'Vậy thì tốt. Mời anh tự giới thiệu ngắn gọn.' },
        { who: 'Bạn', role: 'candidate', text: 'はい。ベトナムから{参|まい}りましたグエンと{申|もう}します。{大学|だいがく}で{情報|じょうほう}を{勉強|べんきょう}しております。{本日|ほんじつ}はどうぞよろしくお{願|ねが}いいたします。', ro: 'Hai. Betonamu kara mairimashita Guen to moushimasu. Daigaku de jouhou o benkyou shite orimasu. Honjitsu wa douzo yoroshiku onegai itashimasu.', vi: 'Vâng. Tôi là Nguyễn, đến từ Việt Nam. Tôi đang học công nghệ thông tin ở trường đại học. Hôm nay rất mong được anh giúp đỡ.' },
      ],
    },
    {
      t: 'note',
      title: 'Phép tắc phỏng vấn kiểu Nhật (giám thị JPD cũng chấm phần Presenting)',
      items: [
        '**Gõ cửa 3 tiếng** (2 tiếng là gõ cửa nhà vệ sinh), nghe どうぞ rồi mới mở; vào phòng nói **{失礼|しつれい}いたします**, quay lại đóng cửa, cúi chào.',
        '**Chỉ ngồi khi được mời** (お{掛|か}けください → {失礼|しつれい}いたします). Ra về: đứng dậy, **{本日|ほんじつ}はありがとうございました**, đến cửa quay lại cúi chào **{失礼|しつれい}いたします**.',
        'Bị hỏi về chính mình ({来|こ}られましたか) → trả lời bằng **khiêm nhường** ({参|まい}りました) — **không** lặp lại dạng tôn kính của câu hỏi.',
      ],
    },
    {
      t: 'speak',
      id: 'b24-noi-ghi-am',
      part: '1',
      questions: [
        'じこしょうかいを して ください。',
        'あなたの ちょうしょは なんですか。',
        'そんけいして いる ひとは だれですか。どうしてですか。',
        'せんせいや せんぱいと はなす とき、なにに きを つけて いますか。',
        'にほんの かいしゃで はたらきたいですか。',
        'インターンシップの めんせつだと おもって、1ぷんで じこしょうかいを して ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b24-viet',
  kind: 'writing',
  title: 'Viết — email cảm ơn sau khi thăm công ty (150–200 chữ) và bài văn "Người tôi kính trọng"',
  goal: 'Viết email cảm ơn sau buổi thăm công ty / phỏng vấn đúng khuôn email công việc Nhật (gửi ai – tự giới thiệu – cảm ơn cụ thể – điều học được – lời chào cuối), dùng đúng khiêm nhường ngữ cho việc của mình (伺いました・拝見しました・いただき・申し上げます) và tôn kính ngữ cho việc của người nhận (ご説明くださり・おっしゃった); viết bài văn 150–200 chữ về người mình kính trọng (người nhà → không tôn kính khi kể với người ngoài; thầy cô → tôn kính) — tự chấm theo 5 tiêu chí.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **お{礼|れい}のメール — email cảm ơn sau khi thăm công ty**, **150–200 chữ**. Ở Nhật, gửi email cảm ơn **trong ngày** sau buổi gặp / phỏng vấn là phép lịch sự gần như bắt buộc — và là chỗ nhà tuyển dụng nhìn thấy bạn dùng kính ngữ có đúng không. Đề phụ: **作文「{私|わたし}が{尊敬|そんけい}する{人|ひと}」** (150–200 chữ). Bài viết N4 chấm **đúng khuôn + đúng loại kính ngữ**: mỗi động từ trong email hãy hỏi "**ai làm?**" trước khi viết.',
    },
    {
      t: 'table',
      caption: 'Khuôn email cảm ơn — 5 phần',
      head: ['Phần', 'Nội dung', 'Mẫu nên dùng', 'Câu gợi ý'],
      rows: [
        ['① Gửi ai', 'tên công ty + phòng + tên người + 様', '～{株式会社|かぶしきがいしゃ} ～{部|ぶ} ～{様|さま}', 'さくらシステム {人事部|じんじぶ} {森|もり}{様|さま}'],
        ['② Tự giới thiệu', 'mình là ai, gặp hôm nào', '～と{申|もう}します · ～に{伺|うかが}いました', '{本日|ほんじつ}、{会社訪問|かいしゃほうもん}で{伺|うかが}いましたワンと{申|もう}します。'],
        ['③ Cảm ơn cụ thể', 'cảm ơn việc gì người đó đã làm', 'お～いただき · ご～くださり · ～ていただき', 'お{忙|いそが}しいところ、ていねいにご{説明|せつめい}いただき、ありがとうございました。'],
        ['④ Điều học được / mong muốn', 'ấn tượng, quyết tâm', '～を{拝見|はいけん}して · ～と{思|おも}いました · ～たいと{思|おも}っております', 'お{客様|きゃくさま}を{大切|たいせつ}にするお{話|はなし}が{心|こころ}に{残|のこ}りました。'],
        ['⑤ Kết', 'lời chào cố định + tên', 'どうぞよろしくお{願|ねが}い{申|もう}し{上|あ}げます', '{今後|こんご}とも、どうぞよろしくお{願|ねが}い{申|もう}し{上|あ}げます。'],
      ],
    },
    {
      t: 'note',
      title: 'Từ nối & mẫu câu nên dùng',
      items: [
        '**Mở**: ～{様|さま} · {突然|とつぜん}のメールで{失礼|しつれい}いたします (thư đầu tiên) · {本日|ほんじつ}はありがとうございました · {先日|せんじつ}は～ (hôm trước).',
        '**Cảm ơn việc người kia làm** (tôn kính / ていただく): お{時間|じかん}をいただき · ご{説明|せつめい}いただき · {会社|かいしゃ}の{中|なか}をご{案内|あんない}くださり · {質問|しつもん}にていねいに{答|こた}えてくださり.',
        '**Việc của mình** (khiêm nhường): お{話|はなし}を{伺|うかが}って · {資料|しりょう}を{拝見|はいけん}して · {改|あらた}めてご{連絡|れんらく}いたします · {勉強|べんきょう}を{続|つづ}けてまいります (tiếp tục cố gắng — văn viết).',
        '**Kết**: {今後|こんご}ともよろしくお{願|ねが}いいたします · どうぞよろしくお{願|ねが}い{申|もう}し{上|あ}げます · ～より (ký tên cuối thư: ワンより — thân mật hơn, dùng cho thầy cô).',
        '**Bài văn "Người tôi kính trọng"**: {私|わたし}が{一番|いちばん}{尊敬|そんけい}している{人|ひと}は～です · ～は{私|わたし}に「～」と{言|い}ってくれました（{家族|かぞく}）／おっしゃいました（{先生|せんせい}） · そのおかげで～ · {私|わたし}も～のような{人|ひと}になりたいです.',
      ],
    },
    {
      t: 'note',
      title: 'Bài mẫu — email cảm ơn sau khi thăm công ty (~190 chữ)',
      items: [
        'さくらシステム{株式会社|かぶしきがいしゃ}　{人事部|じんじぶ}　{森|もり}{様|さま}　{本日|ほんじつ}、{会社訪問|かいしゃほうもん}で{伺|うかが}いましたワンと{申|もう}します。お{忙|いそが}しいところ、お{時間|じかん}をいただき、{本当|ほんとう}にありがとうございました。インターンシップの{仕事|しごと}について、ていねいにご{説明|せつめい}いただき、よくわかりました。{森様|もりさま}が「お{客様|きゃくさま}の{話|はなし}を{聞|き}くことが{一番|いちばん}{大切|たいせつ}だ」とおっしゃったことが、{特|とく}に{心|こころ}に{残|のこ}っております。{私|わたし}もそのような{仕事|しごと}ができるように、{日本語|にほんご}と{敬語|けいご}の{勉強|べんきょう}を{続|つづ}けてまいります。どうぞよろしくお{願|ねが}い{申|もう}し{上|あ}げます。　ワン',
        'Romaji: Sakura Shisutemu kabushikigaisha, jinjibu, Mori-sama. Honjitsu, kaisha houmon de ukagaimashita Wan to moushimasu. Oisogashii tokoro, ojikan o itadaki, hontou ni arigatou gozaimashita. Intaanshippu no shigoto ni tsuite, teinei ni gosetsumei itadaki, yoku wakarimashita. Mori-sama ga "Okyakusama no hanashi o kiku koto ga ichiban taisetsu da" to osshatta koto ga, toku ni kokoro ni nokotte orimasu. Watashi mo sono you na shigoto ga dekiru you ni, nihongo to keigo no benkyou o tsuzukete mairimasu. Douzo yoroshiku onegai moushiagemasu. Wan',
        'Nghĩa: Kính gửi anh Mori, phòng nhân sự công ty cổ phần Sakura System. Tôi là Vương, người đã đến thăm công ty hôm nay. Cảm ơn anh rất nhiều đã dành thời gian cho tôi dù đang bận. Nhờ anh giải thích tận tình về công việc thực tập, tôi đã hiểu rõ. Câu anh nói "Lắng nghe khách hàng là quan trọng nhất" đặc biệt đọng lại trong tôi. Để có thể làm được công việc như vậy, tôi sẽ tiếp tục học tiếng Nhật và kính ngữ. Kính mong anh giúp đỡ. Vương',
        'Đếm mẫu: khiêm nhường **{伺|うかが}いました · {申|もう}します · いただき ×2 · ～ております · ～てまいります · お{願|ねが}い{申|もう}し{上|あ}げます**; tôn kính **おっしゃった** (việc của anh 森); 様 cho người nhận. {株式会社|かぶしきがいしゃ} = công ty cổ phần (viết đủ tên công ty trong thư). Đủ 5 phần theo khuôn.',
      ],
    },
    {
      t: 'note',
      title: 'Bài mẫu thứ hai — 作文「{私|わたし}が{尊敬|そんけい}する{人|ひと}」 (~180 chữ)',
      items: [
        '{私|わたし}が{一番|いちばん}{尊敬|そんけい}している{人|ひと}は、{高校|こうこう}の{先生|せんせい}です。{先生|せんせい}は{日本|にほん}に{留学|りゅうがく}したことがあって、{授業|じゅぎょう}のあとでよく{日本|にほん}の{話|はなし}をしてくださいました。{私|わたし}が{留学|りゅうがく}するかどうか{迷|まよ}っていたとき、{先生|せんせい}は「{失敗|しっぱい}してもいいから、やってみなさい」とおっしゃいました。その{言葉|ことば}のおかげで、{今|いま}{私|わたし}は{日本|にほん}にいます。{去年|きょねん}の{夏|なつ}、{国|くに}に{帰|かえ}ったとき、{先生|せんせい}のお{宅|たく}に{伺|うかが}って、{日本|にほん}のお{菓子|かし}を{差|さ}し{上|あ}げました。{先生|せんせい}はとても{喜|よろこ}んでくださいました。{私|わたし}も{先生|せんせい}のような{人|ひと}になりたいです。',
        'Romaji: Watashi ga ichiban sonkei shite iru hito wa, koukou no sensei desu. Sensei wa Nihon ni ryuugaku shita koto ga atte, jugyou no ato de yoku Nihon no hanashi o shite kudasaimashita. Watashi ga ryuugaku suru ka dou ka mayotte ita toki, sensei wa "Shippai shite mo ii kara, yatte minasai" to osshaimashita. Sono kotoba no okage de, ima watashi wa Nihon ni imasu. Kyonen no natsu, kuni ni kaetta toki, sensei no otaku ni ukagatte, Nihon no okashi o sashiagemashita. Sensei wa totemo yorokonde kudasaimashita. Watashi mo sensei no you na hito ni naritai desu.',
        'Nghĩa: Người tôi kính trọng nhất là thầy giáo cấp ba. Thầy từng du học Nhật và sau giờ học hay kể chuyện Nhật cho chúng tôi nghe. Khi tôi còn phân vân có đi du học hay không, thầy nói "Thất bại cũng không sao, cứ thử làm đi". Nhờ câu nói ấy mà bây giờ tôi đang ở Nhật. Hè năm ngoái về nước, tôi đến thăm nhà thầy và biếu thầy bánh kẹo Nhật. Thầy đã rất vui. Tôi cũng muốn trở thành người như thầy.',
        'Đếm mẫu: tôn kính **～てくださいました ×2 · おっしゃいました** (việc của thầy) · khiêm nhường **{伺|うかが}って · {差|さ}し{上|あ}げました** (việc của mình hướng tới thầy) · **～かどうか{迷|まよ}っていた** (⑩). ⚠ Nếu người kính trọng là **bố mẹ mình**, viết **{父|ちち}は～と{言|い}いました／{言|い}ってくれました** — không dùng おっしゃる cho người nhà khi kể với người ngoài.',
      ],
    },
    {
      t: 'quiz',
      id: 'b24-viet-cau',
      title: 'Chuẩn bị câu cho bài viết — dịch Việt → Nhật (8 câu)',
      kind: 'translate',
      grammar: 'Khiêm nhường cho việc của mình (伺う・申す・いただく・拝見する・お～する) · tôn kính cho việc của người nhận (おっしゃる・～てくださる) · ～かどうか',
      items: [
        { q: 'Tôi là Vương, người đã đến thăm công ty hôm nay.', answers: V('{本日|ほんじつ}、{会社訪問|かいしゃほうもん}で{伺|うかが}いましたワンと{申|もう}します。', '{今日|きょう}、{会社|かいしゃ}に{伺|うかが}ったワンと{申|もう}します。', '{本日|ほんじつ}{伺|うかが}ったワンと{申|もう}します。'), hint: 'うかがいました ＋ と もうします' },
        { q: 'Cảm ơn anh đã dành thời gian cho tôi.', answers: V('お{時間|じかん}をいただき、ありがとうございました。', 'お{時間|じかん}をいただいて、ありがとうございました。', 'お{時間|じかん}をいただき、ありがとうございます。'), hint: 'おじかんを いただき' },
        { q: 'Cảm ơn anh đã giải thích tận tình.', answers: V('ていねいにご{説明|せつめい}いただき、ありがとうございました。', 'ていねいにご{説明|せつめい}くださり、ありがとうございました。', 'ていねいに{説明|せつめい}していただき、ありがとうございました。', 'ていねいに{説明|せつめい}してくださって、ありがとうございました。'), hint: 'ごせつめい いただき／くださり' },
        { q: 'Tôi đã xem tài liệu của quý công ty.', answers: V('{会社|かいしゃ}の{資料|しりょう}を{拝見|はいけん}しました。', 'こちらの{会社|かいしゃ}の{資料|しりょう}を{拝見|はいけん}しました。', '{資料|しりょう}を{拝見|はいけん}しました。'), hint: 'はいけん しました' },
        { q: 'Câu anh Mori nói đọng lại trong lòng tôi.', answers: V('{森様|もりさま}がおっしゃったことが{心|こころ}に{残|のこ}っております。', '{森様|もりさま}がおっしゃったことが{心|こころ}に{残|のこ}っています。', '{森|もり}さんがおっしゃったことが{心|こころ}に{残|のこ}っています。'), hint: 'おっしゃったこと' },
        { q: 'Tôi sẽ liên lạc lại sau.', answers: V('{後|のち}ほどご{連絡|れんらく}いたします。', 'また{後|のち}ほどご{連絡|れんらく}いたします。', 'あとでご{連絡|れんらく}します。', '{後|のち}ほどご{連絡|れんらく}します。'), hint: 'のちほど ごれんらく いたします' },
        { q: 'Thầy đã kể cho chúng tôi nghe chuyện về Nhật.', answers: V('{先生|せんせい}は{日本|にほん}の{話|はなし}をしてくださいました。', '{先生|せんせい}が{日本|にほん}の{話|はなし}をしてくださいました。', '{先生|せんせい}は{私|わたし}たちに{日本|にほん}の{話|はなし}をしてくださいました。'), hint: 'してくださいました' },
        { q: 'Khi tôi còn phân vân có đi du học hay không…', answers: V('{留学|りゅうがく}するかどうか{迷|まよ}っていたとき、', '{私|わたし}が{留学|りゅうがく}するかどうか{迷|まよ}っていたとき', '{留学|りゅうがく}するかどうか{迷|まよ}っていたとき'), hint: 'りゅうがく するかどうか まよっていた' },
      ],
    },
    {
      t: 'table',
      caption: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      head: ['Tiêu chí', '2 điểm', '1 điểm', '0 điểm'],
      rows: [
        ['① Đủ khuôn', 'Email đủ 5 phần (gửi ai – tự giới thiệu – cảm ơn – điều học được – kết) / bài văn đủ mở – kể – kết', 'Thiếu 1 phần', 'Thiếu ≥ 2 phần'],
        ['② Khiêm nhường cho mình', '≥ 3 động từ khiêm nhường đúng (申す・伺う・拝見する・いただく・お～する・～ております)', '1–2 động từ', 'Không có, hoặc dùng tôn kính cho mình'],
        ['③ Tôn kính cho người trên', 'Việc của người nhận / thầy cô dùng tôn kính đúng (おっしゃる・～てくださる・ご～になる)', 'Có nhưng 1 lỗi chia (くださります…)', 'Dùng khiêm nhường cho người trên'],
        ['④ うち・そと, お／ご', 'Người nhà mình không tôn kính; 様 cho người nhận; お／ご đúng', '1 lỗi', '≥ 2 lỗi'],
        ['⑤ Độ dài & thể', '150–200 chữ, thống nhất です／ます', 'Lệch ±30 chữ hoặc lẫn thể thường', 'Dưới 100 chữ'],
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b24-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 24 — dịch, trắc nghiệm, ghép câu, đổi câu thường → kính ngữ, nói lại theo người nghe (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 24: dịch Việt → Nhật có tôn kính ngữ (お～になる, いらっしゃる, おっしゃる, 召し上がる, ご覧になる, V(ら)れる, お～ください), khiêm nhường ngữ (お～する／いたす, 参る, 申す, 伺う, 拝見する, いただく, おる), でございます, ～か, ～かどうか; chọn đúng loại kính ngữ theo người làm; nói về sếp mình với khách đúng うち・そと — mục tiêu ≥ 85% trước khi sang Bài 25 (ôn tập & thi thử N4).',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm sau khi xong 8 mục cốt lõi. Gõ đáp án bằng kana hoặc chữ Hán đều được; dấu câu và dấu cách không tính.',
        'Sai câu nào thì mở lại đúng mục: chọn loại kính ngữ → Ngữ pháp ① (bảng "ai làm"); お～になる → ②; động từ đặc biệt → ③ và ⑦ (hai bảng đặt cạnh nhau); られる → ④; お～ください → ⑤; お～する → ⑥; でございます → ⑧; ～か／～かどうか → ⑨ ⑩.',
        'Mục tiêu: **≥ 85%** trước khi sang Bài 25 — bài ôn tập & thi thử N4, kính ngữ chiếm cả phần 文法 lẫn 聴解.',
      ],
    },
    {
      t: 'quiz',
      id: 'b24-bt-dich',
      title: 'I. Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: '尊敬語: お～になる・いらっしゃる・おっしゃる・召し上がる・ご覧になる・V(ら)れる・お～ください ／ 謙譲語: お～する・参る・申す・伺う・拝見する・いただく・おる ／ でございます ／ ～か・～かどうか',
      items: [
        { q: 'Thầy Honda có ở đây không ạ?', answers: V('{本田先生|ほんだせんせい}はいらっしゃいますか。', '{本田先生|ほんだせんせい}、いらっしゃいますか。'), hint: 'いらっしゃいますか' },
        { q: 'Tôi tên là Nguyễn, đến từ Việt Nam.', answers: V('ベトナムから{参|まい}りましたグエンと{申|もう}します。', 'ベトナムから{来|き}ましたグエンと{申|もう}します。', 'ベトナムのグエンと{申|もう}します。'), hint: 'まいりました ＋ と もうします' },
        { q: 'Giám đốc đã về rồi ạ.', answers: V('{社長|しゃちょう}はもうお{帰|かえ}りになりました。', '{社長|しゃちょう}はもう{帰|かえ}られました。'), hint: 'おかえりに なりました' },
        { q: 'Mời anh/chị dùng trà.', answers: V('どうぞ、お{茶|ちゃ}を{召|め}し{上|あ}がってください。', 'お{茶|ちゃ}を{召|め}し{上|あ}がってください。', 'お{茶|ちゃ}をどうぞ{召|め}し{上|あ}がってください。'), hint: 'めしあがって ください' },
        { q: 'Thầy đã xem bài văn của em chưa ạ?', answers: V('{先生|せんせい}、{私|わたし}の{作文|さくぶん}をご{覧|らん}になりましたか。', '{私|わたし}の{作文|さくぶん}をご{覧|らん}になりましたか。', '{先生|せんせい}は{私|わたし}の{作文|さくぶん}をもうご{覧|らん}になりましたか。'), hint: 'ごらんに なりましたか' },
        { q: 'Thầy đã nói "Ngày mai kiểm tra".', answers: V('{先生|せんせい}は「{明日|あした}テストをします」とおっしゃいました。', '{先生|せんせい}が「{明日|あした}テストをします」とおっしゃいました。', '{先生|せんせい}が「{明日|あした}テストです」とおっしゃいました。'), hint: 'おっしゃいました' },
        { q: 'Xin vui lòng chờ ở đây một chút.', answers: V('こちらで{少々|しょうしょう}お{待|ま}ちください。', '{少々|しょうしょう}こちらでお{待|ま}ちください。', 'ここで{少々|しょうしょう}お{待|ま}ちください。'), hint: 'しょうしょう おまちください' },
        { q: 'Để tôi xách hành lý giúp nhé?', answers: V('お{荷物|にもつ}をお{持|も}ちしましょうか。', '{荷物|にもつ}をお{持|も}ちしましょうか。'), hint: 'おもち しましょうか' },
        { q: 'Tôi xin dẫn anh/chị đến phòng họp.', answers: V('{会議室|かいぎしつ}までご{案内|あんない}いたします。', '{会議室|かいぎしつ}にご{案内|あんない}いたします。', '{会議室|かいぎしつ}までご{案内|あんない}します。', '{会議室|かいぎしつ}にご{案内|あんない}します。'), hint: 'ごあんない いたします' },
        { q: 'Chiều mai tôi xin đến nhà thầy.', answers: V('{明日|あした}の{午後|ごご}、{先生|せんせい}のお{宅|たく}に{伺|うかが}います。', '{明日|あした}の{午後|ごご}、{先生|せんせい}のお{宅|たく}へ{伺|うかが}います。'), hint: 'おたくに うかがいます' },
        { q: '(nói với khách) Anh Mori hiện đang ra ngoài.', answers: V('{森|もり}はただいま{外出|がいしゅつ}しております。', '{森|もり}は{今|いま}{外出|がいしゅつ}しております。', '{森|もり}はただいま{出|で}かけております。'), hint: 'もりは … がいしゅつ して おります' },
        { q: 'Nhà vệ sinh ở tầng 2 ạ.', answers: V('お{手洗|てあら}いは2{階|かい}にございます。', 'トイレは2{階|かい}にございます。'), hint: 'にかいに ございます' },
        { q: 'Cho tôi biết mấy giờ thì đến được không ạ?', answers: V('{何時|なんじ}に{来|く}ればいいか、{教|おし}えていただけませんか。', '{何時|なんじ}に{伺|うかが}えばよろしいか、{教|おし}えていただけませんか。', '{何時|なんじ}に{行|い}けばいいか、{教|おし}えていただけませんか。', '{何時|なんじ}に{伺|うかが}えばいいか、{教|おし}えていただけませんか。'), hint: 'なんじに … か、おしえて いただけませんか' },
        { q: 'Tôi chưa biết có đi được hay không.', answers: V('{行|い}けるかどうか、まだわかりません。', 'まだ{行|い}けるかどうかわかりません。', '{参|まい}れるかどうか、まだわかりません。'), hint: 'いけるかどうか' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-bt-chon',
      title: 'II. Chọn đáp án đúng (14 câu)',
      items: [
        { q: '「いらっしゃる」の「ます{形|けい}」は？', options: ['いらっしゃります', 'いらっしゃいます', 'いらっしゃれます', 'いらっしゃします'], correct: 1, why: 'いらっしゃる・おっしゃる・なさる・くださる → る đổi thành **い**: いらっしゃ**い**ます. 〔Irasshaimasu.〕' },
        { q: '「{見|み}る」の{尊敬語|そんけいご}は？', options: ['{拝見|はいけん}する', 'お{見|み}になる', 'ご{覧|らん}になる', '{見|み}させる'], correct: 2, why: '**ご{覧|らん}になる**. {拝見|はいけん}する là khiêm nhường; ~~お{見|み}になる~~ không có (thân ます 1 âm). 〔Goran ni naru.〕' },
        { q: '「{言|い}う」の{謙譲語|けんじょうご}は？', options: ['おっしゃる', '{申|もう}す', 'お{言|い}いになる', '{伺|うかが}う'], correct: 1, why: 'Mình nói → **{申|もう}す** (～と{申|もう}します). おっしゃる là tôn kính. 〔Mousu.〕' },
        { q: '「{食|た}べる」の{尊敬語|そんけいご}は？', options: ['いただく', '{召|め}し{上|あ}がる', 'お{食|た}べする', '{参|まい}る'], correct: 1, why: '**{召|め}し{上|あ}がる** (người trên ăn / uống). いただく là khiêm nhường. 〔Meshiagaru.〕' },
        { q: '{先生|せんせい}が{私|わたし}に{本|ほん}を（　）。', options: ['いただきました', 'くださいました', '{差|さ}し{上|あ}げました', 'もらいました'], correct: 1, why: 'Chủ ngữ **{先生|せんせい}が**, cho **{私|わたし}に** → tôn kính của くれる: **くださいました**. 〔Hon o kudasaimashita.〕' },
        { q: '{私|わたし}は{先生|せんせい}に{本|ほん}を（　）。', options: ['いただきました', 'くださいました', 'お{渡|わた}しになりました', 'あげました'], correct: 0, why: 'Chủ ngữ **{私|わたし}は**, nhận từ **{先生|せんせい}に** → khiêm nhường của もらう: **いただきました**. 〔Hon o itadakimashita.〕' },
        { q: '{先生|せんせい}、{明日|あした}{何時|なんじ}に{学校|がっこう}へ（　）か。', options: ['{参|まい}ります', 'いらっしゃいます', '{伺|うかが}います', 'おります'], correct: 1, why: 'Việc của **thầy** → tôn kính **いらっしゃいます**. 〔Nanji ni gakkou e irasshaimasu ka.〕' },
        { q: '{明日|あした}、わたくしが{駅|えき}まで{車|くるま}でお{迎|むか}えに（　）。', options: ['いらっしゃいます', '{参|まい}ります', 'なさいます', 'おいでになります'], correct: 1, why: 'Việc của **mình** → khiêm nhường **{参|まい}ります**. 〔Omukae ni mairimasu.〕' },
        { q: 'こちらにお{名前|なまえ}をお{書|か}き（　）。', options: ['します', 'になります', 'ください', 'いたします'], correct: 2, why: 'Mời khách viết → **お～ください**. 〔Onamae o okaki kudasai.〕' },
        { q: '{資料|しりょう}は{明日|あした}メールでお{送|おく}り（　）。', options: ['いたします', 'になります', 'ください', 'なさいます'], correct: 0, why: 'Mình gửi cho khách → khiêm nhường **お～いたします**. 〔Ookuri itashimasu.〕' },
        { q: '（お{客様|きゃくさま}に）「{課長|かちょう}の{山田|やまだ}は、ただいま（　）。」', options: ['{会議中|かいぎちゅう}でいらっしゃいます', '{会議|かいぎ}をなさっています', '{会議中|かいぎちゅう}でございます', '{会議|かいぎ}にいらっしゃいます'], correct: 2, why: 'うち・そと: sếp mình khi nói với khách → không tôn kính: **{会議中|かいぎちゅう}でございます**. 〔Kaigichuu de gozaimasu.〕' },
        { q: 'ご{注文|ちゅうもん}は（　）でしょうか。', options: ['いい', 'よろしい', 'けっこう', 'ございます'], correct: 1, why: 'いいですか → lịch sự cao: **よろしいでしょうか**. 〔Gochuumon wa yoroshii deshou ka.〕' },
        { q: 'この{電車|でんしゃ}が{新宿|しんじゅく}に{止|と}まる（　）、{駅員|えきいん}に{聞|き}いてみます。', options: ['か', 'かどうか', 'ですか', 'だか'], correct: 1, why: 'Không có từ để hỏi (có dừng hay không) → **かどうか**. 〔Tomaru ka dou ka, ekiin ni kiite mimasu.〕' },
        { q: '{会場|かいじょう}が（　）、{地図|ちず}で{調|しら}べてください。', options: ['どこか', 'どこだか', 'どこかどうか', 'どこですか'], correct: 0, why: 'Có từ để hỏi + N → bỏ だ: **どこか**. 〔Kaijou ga doko ka, chizu de shirabete kudasai.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b24-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Bố của anh/chị làm nghề gì ạ?', chips: ['お{父様|とうさま}は', 'どんなお{仕事|しごと}を', 'なさって', 'いますか', 'いたして', 'おりますか'], answer: ['お{父様|とうさま}は', 'どんなお{仕事|しごと}を', 'なさって', 'いますか'], ro: 'Otousama wa donna oshigoto o nasatte imasu ka.' },
        { vi: 'Bố tôi làm việc ở ngân hàng. (nói với người trên)', chips: ['{父|ちち}は', '{銀行|ぎんこう}で', '{働|はたら}いて', 'おります', 'いらっしゃいます', 'お{父様|とうさま}は'], answer: ['{父|ちち}は', '{銀行|ぎんこう}で', '{働|はたら}いて', 'おります'], ro: 'Chichi wa ginkou de hataraite orimasu.' },
        { vi: 'Tôi được thầy giới thiệu một công ty tốt.', chips: ['{先生|せんせい}に', 'いい{会社|かいしゃ}を', '{紹介|しょうかい}して', 'いただきました', 'くださいました', '{先生|せんせい}が'], answer: ['{先生|せんせい}に', 'いい{会社|かいしゃ}を', '{紹介|しょうかい}して', 'いただきました'], ro: 'Sensei ni ii kaisha o shoukai shite itadakimashita.' },
        { vi: 'Thầy đã giới thiệu cho tôi một công ty tốt.', chips: ['{先生|せんせい}が', 'いい{会社|かいしゃ}を', '{紹介|しょうかい}して', 'くださいました', 'いただきました', '{先生|せんせい}に'], answer: ['{先生|せんせい}が', 'いい{会社|かいしゃ}を', '{紹介|しょうかい}して', 'くださいました'], ro: 'Sensei ga ii kaisha o shoukai shite kudasaimashita.' },
        { vi: 'Lát nữa tôi sẽ gọi điện lại.', chips: ['{後|のち}ほど', 'また', 'お{電話|でんわ}', 'いたします', 'ご{電話|でんわ}', 'なさいます'], answer: ['{後|のち}ほど', 'また', 'お{電話|でんわ}', 'いたします'], alt: [['また', '{後|のち}ほど', 'お{電話|でんわ}', 'いたします']], ro: 'Nochihodo mata odenwa itashimasu.' },
        { vi: 'Xin hãy xem trang này.', chips: ['こちらの', 'ページを', 'ご{覧|らん}', 'ください', '{拝見|はいけん}して', 'お{見|み}'], answer: ['こちらの', 'ページを', 'ご{覧|らん}', 'ください'], ro: 'Kochira no peeji o goran kudasai.' },
        { vi: 'Tôi không biết ai là người phụ trách.', chips: ['{担当|たんとう}が', '{誰|だれ}か', 'わかりません', '{誰|だれ}だか', 'かどうか'], answer: ['{担当|たんとう}が', '{誰|だれ}か', 'わかりません'], ro: 'Tantou ga dare ka wakarimasen.' },
        { vi: 'Tôi sẽ thử hỏi xem có đặt chỗ được không.', chips: ['{予約|よやく}が', 'できるか', 'どうか', '{聞|き}いてみます', 'できますか', '{何|なに}が'], answer: ['{予約|よやく}が', 'できるか', 'どうか', '{聞|き}いてみます'], ro: 'Yoyaku ga dekiru ka dou ka kiite mimasu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b24-bt-doi',
      title: 'IV. Đổi câu thường → kính ngữ (10 câu)',
      kind: 'fill',
      grammar: 'Người trên làm → tôn kính; mình làm → khiêm nhường; です／あります → でございます／ございます',
      items: [
        { q: '{先生|せんせい}は{研究室|けんきゅうしつ}にいます。→ (tôn kính)', answers: V('{先生|せんせい}は{研究室|けんきゅうしつ}にいらっしゃいます。'), hint: 'いらっしゃいます' },
        { q: '{社長|しゃちょう}は{何|なに}を{飲|の}みますか。→ (tôn kính)', answers: V('{社長|しゃちょう}は{何|なに}を{召|め}し{上|あ}がりますか。'), hint: 'めしあがりますか' },
        { q: '{部長|ぶちょう}はもう{帰|かえ}りました。→ (お～になる)', answers: V('{部長|ぶちょう}はもうお{帰|かえ}りになりました。'), hint: 'おかえりに なりました' },
        { q: '{課長|かちょう}が{言|い}いました。→ (tôn kính)', answers: V('{課長|かちょう}がおっしゃいました。'), hint: 'おっしゃいました' },
        { q: 'ここで{待|ま}ってください。→ (お～ください)', answers: V('ここでお{待|ま}ちください。', 'こちらでお{待|ま}ちください。'), hint: 'おまち ください' },
        { q: '{私|わたし}は{明日|あした}そちらへ{行|い}きます。→ (khiêm nhường)', answers: V('{私|わたし}は{明日|あした}そちらへ{参|まい}ります。', '{私|わたし}は{明日|あした}そちらへ{伺|うかが}います。', 'わたくしは{明日|あした}そちらへ{参|まい}ります。'), hint: 'まいります／うかがいます' },
        { q: '{私|わたし}が{荷物|にもつ}を{持|も}ちます。→ (お～する)', answers: V('{私|わたし}がお{荷物|にもつ}をお{持|も}ちします。', '{私|わたし}が{荷物|にもつ}をお{持|も}ちします。', 'わたくしがお{荷物|にもつ}をお{持|も}ちします。'), hint: 'おもち します' },
        { q: '{先生|せんせい}の{写真|しゃしん}を{見|み}ました。→ (khiêm nhường)', answers: V('{先生|せんせい}の{写真|しゃしん}を{拝見|はいけん}しました。', '{先生|せんせい}のお{写真|しゃしん}を{拝見|はいけん}しました。'), hint: 'はいけん しました' },
        { q: 'トイレはあちらです。→ (でございます)', answers: V('トイレはあちらでございます。', 'お{手洗|てあら}いはあちらでございます。'), hint: 'でございます' },
        { q: '{父|ちち}は{今|いま}、{家|いえ}にいます。→ (nói với thầy — khiêm nhường)', answers: V('{父|ちち}は{今|いま}、{家|いえ}におります。', '{父|ちち}はただいま{家|いえ}におります。'), hint: 'おります' },
      ],
    },
    {
      t: 'quiz',
      id: 'b24-bt-ke',
      title: 'V. Nói lại theo người nghe — うち・そと (8 câu)',
      kind: 'translate',
      grammar: 'Câu gốc nói trong nội bộ công ty; viết lại câu nói với KHÁCH bên ngoài (sếp mình = người nhà: bỏ chức vụ, khiêm nhường) — hoặc ngược lại',
      items: [
        { q: '(nội bộ) {森課長|もりかちょう}はいらっしゃいません。→ (nói với khách)', answers: V('{森|もり}はおりません。', '{森|もり}はただいまおりません。', '{森|もり}はただいま{席|せき}を{外|はず}しております。'), hint: 'もりは おりません' },
        { q: '(nội bộ) {課長|かちょう}は3{時|じ}にお{戻|もど}りになります。→ (nói với khách)', answers: V('{課長|かちょう}の{森|もり}は3{時|じ}に{戻|もど}ります。', '{森|もり}は3{時|じ}に{戻|もど}ります。', '{森|もり}は3{時|じ}に{戻|もど}る{予定|よてい}です。', '{森|もり}は3{時|じ}に{戻|もど}る{予定|よてい}でございます。'), hint: 'もりは 3じに もどります' },
        { q: '(nội bộ) {社長|しゃちょう}がそうおっしゃいました。→ (nói với khách)', answers: V('{社長|しゃちょう}の{山本|やまもと}がそう{申|もう}しておりました。', '{山本|やまもと}がそう{申|もう}しておりました。', '{社長|しゃちょう}の{山本|やまもと}がそう{申|もう}しました。', '{山本|やまもと}がそう{申|もう}しました。'), hint: 'もうして おりました (tên giám đốc: 山本)' },
        { q: '(nội bộ) {部長|ぶちょう}は{大阪|おおさか}へいらっしゃっています。→ (nói với khách; tên trưởng ban: 田中)', answers: V('{田中|たなか}は{大阪|おおさか}へ{出張|しゅっちょう}しております。', '{田中|たなか}は{大阪|おおさか}に{参|まい}っております。', '{部長|ぶちょう}の{田中|たなか}は{大阪|おおさか}へ{出張|しゅっちょう}しております。', '{田中|たなか}は{大阪|おおさか}へ{参|まい}っております。'), hint: 'たなかは … しゅっちょう して おります' },
        { q: '(với khách) Anh Tamura (người của công ty khách) đã nói như vậy.', answers: V('{田村様|たむらさま}がおっしゃいました。', '{田村様|たむらさま}はそうおっしゃいました。', '{田村様|たむらさま}がそうおっしゃいました。'), hint: 'người của khách → tôn kính: おっしゃいました' },
        { q: '(với khách) Xin lỗi, trưởng phòng Mori đang họp. (người của công ty mình)', answers: V('{申|もう}し{訳|わけ}ございません。{森|もり}はただいま{会議中|かいぎちゅう}でございます。', '{申|もう}し{訳|わけ}ございません。{森|もり}は{会議中|かいぎちゅう}でございます。', '{申|もう}し{訳|わけ}ありません。{森|もり}はただいま{会議中|かいぎちゅう}です。'), hint: 'もりは かいぎちゅう でございます' },
        { q: '(với khách) Tôi sẽ nhắn lại cho anh Mori.', answers: V('{森|もり}に{伝|つた}えておきます。', '{森|もり}に{申|もう}し{伝|つた}えます。', '{森|もり}に{伝|つた}えます。'), hint: 'もりに つたえて おきます' },
        { q: '(nội bộ, với chính trưởng phòng) Anh Tamura bên Tokyo Shoji đã gọi điện ạ.', answers: V('{東京商事|とうきょうしょうじ}の{田村様|たむらさま}からお{電話|でんわ}がありました。', '{課長|かちょう}、{東京商事|とうきょうしょうじ}の{田村様|たむらさま}からお{電話|でんわ}がありました。', '{東京商事|とうきょうしょうじ}の{田村様|たむらさま}からお{電話|でんわ}がございました。'), hint: 'たむらさまから おでんわが ありました' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b24-buoi-1-sonkeigo',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 24: kính ngữ là gì · từ mới "công ty & con người" & động từ tôn kính · お〜になる · いらっしゃる・おっしゃる・召し上がる… · 〜られる · お〜ください · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng ～ていただけませんか (Bài 18) và cách chia bị động (Bài 22), hiểu 3 loại kính ngữ và câu hỏi "AI làm?", học từ nhóm A (会社訪問・社長・課長・人事部・係・名刺・応接室…) và nhóm B (いらっしゃる・おっしゃる・召し上がる・ご覧になる・なさる・くださる・ご存じだ), tạo tôn kính お〜になる／ご〜になる, chia đúng động từ đặc biệt (いらっしゃいます), dùng V(ら)れる làm tôn kính, mời khách bằng お〜ください, đóng vai hội thoại ① (gọi điện đến công ty).',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn bậc thang nhờ vả (Bài 18): {教|おし}えてくれる？ → ～てください → ～ていただけませんか; ôn chia bị động (Bài 22): {書|か}かれる, {来|こ}られる. Câu hỏi mở đầu: "Gọi điện cho công ty Nhật, câu đầu tiên bạn nói là gì?"',
        '**Kính ngữ là gì (5′)** — 3 loại: 尊敬語 (nâng người trên) · 謙譲語 (hạ mình) · 丁寧語 (trang trọng). Một câu hỏi duy nhất: **AI làm?**',
        '**Từ mới (10′)** — nhóm A (công ty & con người) + nhóm B (7 động từ tôn kính đặc biệt).',
        '**Ngữ pháp (20′)** — ② お～になる／ご～になる · ③ động từ tôn kính đặc biệt + bẫy いらっしゃいます · ④ V(ら)れる · ⑤ お～ください.',
        '**Hội thoại + チャレンジ (10′)** — ① ワン gọi điện xin gặp anh 森; luyện cặp hỏi thầy cô bằng tôn kính. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b24-b1-slides',
      title: 'Bài 24 会社訪問 — Buổi 1: tôn kính ngữ (尊敬語)',
      slides: [
        {
          tieuDe: '{第|だい}24{課|か} {会社訪問|かいしゃほうもん}',
          anh: ['office-building', 'telephone-receiver', 'man-bowing'],
          nhan: ['{会社|かいしゃ}', '{電話|でんわ}', 'お{辞儀|じぎ}'],
          dong: ['Hôm nay: **kính ngữ (敬語)** — いらっしゃいます・おっしゃいます・お{待|ま}ちください'],
          ro: ['irasshaimasu · osshaimasu · omachi kudasai'],
          ghi: 'Bài 24 là bài kính ngữ — nói với thầy cô, cấp trên, khách, công ty. Buổi 1: tôn kính ngữ (nâng người trên). Buổi 2: khiêm nhường ngữ + lịch sự cao. Buổi 3: ～か, ～かどうか + tổng hợp.',
        },
        {
          tieuDe: 'できること — Học xong Bài 24 làm được gì?',
          anh: ['telephone-receiver', 'office-building', 'man-teacher'],
          nhan: ['24-1 gọi điện', '24-2 đến công ty', '24-3 nói với thầy cô'],
          dong: ['① Gọi điện đến công ty, tự giới thiệu, xin gặp người phụ trách.', '② Đến quầy lễ tân, vào phòng khách, trả lời phỏng vấn ngắn.', '③ Nhờ thầy cô; nói về sếp mình với khách đúng うち・そと.'],
          ro: ['~ to moushimasu · ~ wa irasshaimasu ka', 'shitsurei itashimasu · meshiagatte kudasai', '~te itadakenai deshou ka'],
          ghi: 'Ba buổi đi đúng ba nhóm này. Cuối Bài 24 bạn đóng vai được 3 phút: gọi điện hẹn lịch + đến công ty + trả lời 3 câu phỏng vấn.',
        },
        {
          tieuDe: 'Khởi động — nhờ vả 4 bậc (ôn Bài 18)',
          bang: {
            head: ['Mức', 'Câu'],
            rows: [
              ['bạn thân', '{教|おし}えてくれる？'],
              ['lịch sự', '{教|おし}えてください'],
              ['lịch sự hơn', '{教|おし}えてもらえませんか'],
              ['cao nhất', '{教|おし}えて**いただけ**ませんか'],
            ],
          },
          hoi: 'いただく là kính ngữ loại gì — nâng người kia hay hạ mình?',
          dap: '**Hạ mình** (khiêm nhường của もらう). Hôm nay học loại ngược lại: **nâng người kia**.',
          ghi: 'Học sinh đã dùng kính ngữ từ Bài 18 mà không biết. Hôm nay gọi tên và hệ thống lại.',
        },
        {
          tieuDe: '{敬語|けいご}って{何|なん}ですか — 3 loại',
          anh: ['man-teacher', 'woman-student', 'woman-tipping-hand'],
          nhan: ['{尊敬語|そんけいご}', '{謙譲語|けんじょうご}', '{丁寧語|ていねいご}'],
          bang: {
            head: ['Loại', 'Làm gì', 'Ví dụ'],
            rows: [
              ['{尊敬語|そんけいご}', 'NÂNG người trên', '{先生|せんせい}が**いらっしゃいます**'],
              ['{謙譲語|けんじょうご}', 'HẠ mình', '{私|わたし}が**{参|まい}ります**'],
              ['{丁寧語|ていねいご}', 'nói TRANG TRỌNG', 'こちら**でございます**'],
            ],
          },
          ghi: 'Vẽ cái thang lên bảng: thầy ở trên, mình ở dưới. Tôn kính đẩy thầy lên; khiêm nhường kéo mình xuống; lịch sự là giọng nói trang trọng.',
        },
        {
          tieuDe: 'Câu hỏi duy nhất: だれがしますか (AI làm?)',
          anh: ['man-teacher', 'woman-student'],
          nhan: ['{先生|せんせい}が{来|く}る', '{私|わたし}が{行|い}く'],
          dong: ['{先生|せんせい}が{来|く}る → {先生|せんせい}が**いらっしゃいます**', '{私|わたし}が{行|い}く → {私|わたし}が**{参|まい}ります**'],
          ro: ['Sensei ga irasshaimasu.', 'Watashi ga mairimasu.'],
          hoi: '「{私|わたし}は{明日|あした}いらっしゃいます」は{正|ただ}しいですか。',
          dap: '**Sai** — tôn kính cho bản thân. Đúng: {私|わたし}は{明日|あした}**{参|まい}ります**.',
          ghi: 'Lỗi số 1 của người Việt: nghĩ "nói với thầy thì dùng từ sang nhất". Kính ngữ đi theo NGƯỜI LÀM, không theo người nghe.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — {会社|かいしゃ}と{人|ひと}',
          anh: ['office-building', 'man-office-worker', 'identification-card', 'couch-and-lamp'],
          nhan: ['{会社訪問|かいしゃほうもん}', '{課長|かちょう}', '{名刺|めいし}', '{応接室|おうせつしつ}'],
          dong: ['{来週|らいしゅう}、{会社訪問|かいしゃほうもん}をします。', '{人事部|じんじぶ}の{森課長|もりかちょう}に{名刺|めいし}をいただきました。'],
          ro: ['Raishuu, kaisha houmon o shimasu.', 'Jinjibu no Mori-kachou ni meishi o itadakimashita.'],
          hoi: '「{森課長|もりかちょう}さん」は{正|ただ}しいですか。',
          dap: 'Không — chức vụ đã là kính xưng: **{森課長|もりかちょう}** (không thêm さん).',
          ghi: 'Thêm: {社長|しゃちょう} > {部長|ぶちょう} (Bài 23) > {課長|かちょう}; {係|かかり} (người phụ trách), {会議室|かいぎしつ}, インターンシップ, {訪|たず}ねる.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {尊敬|そんけい}の{特別|とくべつ}な{言葉|ことば}',
          anh: ['speech-balloon', 'teacup-without-handle', 'eyes', 'thinking-face'],
          nhan: ['おっしゃる', '{召|め}し{上|あ}がる', 'ご{覧|らん}になる', 'ご{存|ぞん}じ'],
          bang: {
            head: ['Thường', 'Tôn kính'],
            rows: [
              ['いる・{行|い}く・{来|く}る', 'いらっしゃる'],
              ['{言|い}う', 'おっしゃる'],
              ['{食|た}べる・{飲|の}む', '{召|め}し{上|あ}がる'],
              ['{見|み}る', 'ご{覧|らん}になる'],
              ['する · くれる', 'なさる · くださる'],
              ['{知|し}っている', 'ご{存|ぞん}じだ'],
            ],
          },
          ghi: 'Cho học sinh đọc to cột phải 3 lần, rồi che cột phải, giáo viên đọc cột trái — cả lớp đáp.',
        },
        {
          tieuDe: 'お＋Vます＋になる',
          bang: {
            head: ['Động từ', 'Tôn kính'],
            rows: [
              ['{待|ま}ちます', 'お{待|ま}ちになります'],
              ['{帰|かえ}ります', 'お{帰|かえ}りになります'],
              ['{書|か}きます', 'お{書|か}きになります'],
              ['{利用|りよう}します', 'ご{利用|りよう}になります'],
            ],
          },
          hoi: '「{読|よ}みます」「{使|つか}います」は？',
          dap: '**お{読|よ}みになります · お{使|つか}いになります**.',
          ghi: 'Công thức: bỏ ます, kẹp giữa お … になります. Từ Hán (利用, 出席) dùng ご.',
        },
        {
          tieuDe: '⚠ お～になる が{使|つか}えない{言葉|ことば}',
          bang: {
            head: ['SAI', 'ĐÚNG'],
            rows: [
              ['~~お{見|み}になる~~', 'ご{覧|らん}になる'],
              ['~~お{来|き}になる~~', 'いらっしゃる'],
              ['~~お{言|い}いになる~~', 'おっしゃる'],
              ['~~お{寝|ね}になる~~', 'お{休|やす}みになる'],
            ],
          },
          ghi: 'Thân ます 1 âm (見・来・寝・い・し) không ghép お～になる. Động từ có dạng đặc biệt thì dùng dạng đặc biệt.',
        },
        {
          tieuDe: '⚠ いらっしゃ**い**ます — bẫy chia',
          dong: ['いらっしゃる → いらっしゃ**い**ます', 'おっしゃる → おっしゃ**い**ます', 'なさる → なさ**い**ます · くださる → くださ**い**ます'],
          ro: ['irassharu → irasshaimasu', 'ossharu → osshaimasu', 'nasaru → nasaimasu · kudasaru → kudasaimasu'],
          hoi: '「いらっしゃります」は{正|ただ}しいですか。',
          dap: 'Sai — **いらっしゃいます**. (召し上がる thì bình thường: 召し上がります.)',
          ghi: 'Cho cả lớp vỗ tay theo nhịp i-ras-sha-i-ma-su. Lỗi này đề N4 rất hay gài.',
        },
        {
          tieuDe: 'V(ら)れる — {尊敬|そんけい}にもなる',
          bang: {
            head: ['Câu', 'Nghĩa'],
            rows: [
              ['{友達|ともだち}に{来|こ}られて{困|こま}った', 'bị động (Bài 22)'],
              ['{明日|あした}{来|こ}られますか', 'khả năng (Bài 16)'],
              ['{先生|せんせい}が{来|こ}られました', 'TÔN KÍNH (hôm nay)'],
            ],
          },
          hoi: '「{部長|ぶちょう}はもう{帰|かえ}られました」の{意味|いみ}は？',
          dap: 'Trưởng ban đã về rồi (tôn kính nhẹ — không phải bị động).',
          ghi: 'Mức: {帰|かえ}りました < {帰|かえ}られました < お{帰|かえ}りになりました. られる dễ nhất vì dùng được cho gần như mọi động từ.',
        },
        {
          tieuDe: 'お～ください — mời khách',
          anh: ['chair', 'door', 'ten-oclock', 'teacup-without-handle'],
          nhan: ['お{掛|か}けください', 'お{入|はい}りください', 'お{待|ま}ちください', '{召|め}し{上|あ}がってください'],
          dong: ['どうぞ、お{掛|か}けください。', 'こちらをご{覧|らん}ください。'],
          ro: ['Douzo, okake kudasai.', 'Kochira o goran kudasai.'],
          hoi: '「{拝見|はいけん}してください」は？',
          dap: 'Sai — {拝見|はいけん} là khiêm nhường. Mời xem: **ご{覧|らん}ください**.',
          ghi: 'Đây là câu nghe hằng ngày ở ga, cửa hàng. Học sinh làm thêm ở konbini sẽ dùng ngay.',
        },
        {
          tieuDe: '{会話|かいわ} ① — {電話|でんわ}で',
          anh: ['woman-student', 'telephone-receiver', 'woman-tipping-hand'],
          dong: ['ワン：{人事部|じんじぶ}の{森課長|もりかちょう}は**いらっしゃいますか**。', '{受付|うけつけ}：{少々|しょうしょう}**お{待|ま}ちください**。', 'ワン：{何時|なんじ}ごろ**お{戻|もど}りになりますか**。'],
          ro: ['Wan: Jinjibu no Mori-kachou wa irasshaimasu ka.', 'Uketsuke: Shoushou omachi kudasai.', 'Wan: Nanji goro omodori ni narimasu ka.'],
          hoi: 'Tại sao lễ tân nói 「{森|もり}は{席|せき}を{外|はず}しております」 mà không nói 「{森課長|もりかちょう}は」?',
          dap: 'Vì đang nói với người NGOÀI — sếp của mình là "người nhà" (うち・そと, học kỹ ở Buổi 2).',
          ghi: 'Đọc to theo cặp 2 lần, đổi vai. Gạch chân các động từ tôn kính trong lời ワン.',
        },
        {
          tieuDe: 'チャレンジ — {先生|せんせい}に{聞|き}いてみよう',
          anh: ['speech-balloon', 'man-teacher'],
          dong: ['A：{先生|せんせい}は{週末|しゅうまつ}、{何|なに}をなさいますか。', 'B：{家族|かぞく}と{買|か}い{物|もの}に{行|い}きます。'],
          ro: ['A: Sensei wa shuumatsu, nani o nasaimasu ka.', 'B: Kazoku to kaimono ni ikimasu.'],
          hoi: 'Luyện cặp: hỏi "thầy" 3 câu bằng なさる／召し上がる／いらっしゃる.',
          dap: 'Ví dụ: お{昼|ひる}は{何|なに}を{召|め}し{上|あ}がりますか · {夏休|なつやす}みはどちらへいらっしゃいますか.',
          ghi: 'B đóng vai thầy trả lời bằng です・ます thường — người trên không dùng kính ngữ cho mình.',
        },
        {
          tieuDe: 'まとめ — Buổi 1',
          bang: {
            head: ['Mẫu', 'Công thức', 'Ví dụ'],
            rows: [
              ['② tôn kính', 'お＋Vます＋になる ／ ご＋N＋になる', 'お{帰|かえ}りになる'],
              ['③ đặc biệt', 'いらっしゃる・おっしゃる・{召|め}し{上|あ}がる…', 'いらっしゃいます'],
              ['④ られる', 'V(ら)れる', '{来|こ}られる'],
              ['⑤ mời', 'お＋Vます＋ください', 'お{待|ま}ちください'],
            ],
          },
          ghi: 'Bài về nhà: viết 6 câu hỏi thầy cô bằng tôn kính (mỗi động từ đặc biệt một câu). Buổi sau: khiêm nhường ngữ (参る・申す・お～する) và うち・そと.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: nhờ vả 4 bậc và bị động' },
    {
      t: 'p',
      text: 'Giáo viên giả vờ gọi điện: "もしもし、{本田|ほんだ}です。{社長|しゃちょう}いる？" — cả lớp cười. Rồi hỏi: "Gọi cho công ty mà nói vậy thì sao?" Đáp án: thiếu lễ — phải nói **{社長|しゃちょう}はいらっしゃいますか**. Hôm nay học cách **nâng người khác lên**. Trước đó ôn nhanh ～ていただけませんか (đã là kính ngữ!) và cách chia bị động (sẽ dùng lại làm tôn kính).',
    },
    {
      t: 'mcq',
      id: 'b24-b1-khoi-dong',
      title: 'Khởi động — ôn nhờ vả, bị động (4 câu)',
      items: [
        { q: '{先生|せんせい}に：「この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えて（　）。」 (lịch sự nhất)', options: ['くれる？', 'ください', 'いただけませんか', 'あげませんか'], correct: 2, why: '**～ていただけませんか** — bậc cao nhất của câu nhờ (Bài 18); いただく là khiêm nhường của もらう.' },
        { q: '「{書|か}く」の{受身形|うけみけい}は？', options: ['{書|か}かれる', '{書|か}けられる', '{書|か}きられる', '{書|か}かせる'], correct: 0, why: 'く → か ＋ れる: **{書|か}かれる** (Bài 22). Hôm nay dạng này còn là **tôn kính**.' },
        { q: '「{来|く}る」の{受身形|うけみけい}は？', options: ['{来|く}られる', '{来|き}られる', '{来|こ}られる', '{来|こ}させる'], correct: 2, why: '**{来|こ}られる**. Hôm nay: {先生|せんせい}が{来|こ}られる = thầy đến (tôn kính).' },
        { q: '{友達|ともだち}にノートを{貸|か}して（　）、{助|たす}かりました。', options: ['あげて', 'もらって', 'されて', 'くれて'], correct: 1, why: '**B に V てもらう** (được B làm cho — Bài 18). Kính ngữ của もらう là いただく.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: sơ đồ một công ty Nhật' },
    {
      t: 'table',
      caption: 'Giáo viên vẽ sơ đồ công ty lên bảng — mỗi ô là một từ mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['**{社長|しゃちょう}** → {部長|ぶちょう} → **{課長|かちょう}** → {社員|しゃいん}', 'shachou · buchou · kachou · shain', 'giám đốc → trưởng ban → trưởng phòng → nhân viên'],
        ['**{人事部|じんじぶ}**：**{係|かかり}**の{人|ひと}', 'jinjibu · kakari no hito', 'phòng nhân sự · người phụ trách'],
        ['1{階|かい} {受付|うけつけ} → 5{階|かい} **{応接室|おうせつしつ}** · **{会議室|かいぎしつ}**', 'ousetsushitsu · kaigishitsu', 'phòng tiếp khách · phòng họp'],
        ['**{名刺|めいし}**を{交換|こうかん}する', 'meishi o koukan suru', 'trao danh thiếp'],
        ['**{会社訪問|かいしゃほうもん}** · **インターンシップ** · **{訪|たず}ねる**', 'kaisha houmon · intaanshippu · tazuneru', 'thăm công ty · thực tập · đến thăm'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{社長|しゃちょう}は{毎朝|まいあさ}7{時|じ}に{会社|かいしゃ}にいらっしゃいます。', 'Shachou wa maiasa shichiji ni kaisha ni irasshaimasu.', 'Giám đốc sáng nào cũng đến công ty lúc 7 giờ.'),
        E('{課長|かちょう}、この{資料|しりょう}をご{覧|らん}になりましたか。', 'Kachou, kono shiryou o goran ni narimashita ka.', 'Thưa trưởng phòng, anh đã xem tài liệu này chưa ạ?'),
        E('{先生|せんせい}はもうお{昼|ひる}を{召|め}し{上|あ}がりましたか。', 'Sensei wa mou ohiru o meshiagarimashita ka.', 'Thầy đã dùng bữa trưa chưa ạ?'),
        E('{部長|ぶちょう}は{何|なん}とおっしゃいましたか。', 'Buchou wa nan to osshaimashita ka.', 'Trưởng ban đã nói gì ạ?'),
      ],
    },
    { t: 'h', text: 'Slide 3 — Đổi sang tôn kính & nói thành câu: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b24-b1-chia',
      title: 'Luyện nhanh — đổi sang tôn kính (10 câu)',
      kind: 'fill',
      items: [
        { q: '{待|ま}つ → お～になる (ます)', answers: V('お{待|ま}ちになります') },
        { q: '{帰|かえ}る → お～になる (ました)', answers: V('お{帰|かえ}りになりました') },
        { q: '{使|つか}う → お～になる (ます)', answers: V('お{使|つか}いになります') },
        { q: 'いる (người trên) → (ます)', answers: V('いらっしゃいます') },
        { q: '{言|い}う (người trên) → (ました)', answers: V('おっしゃいました') },
        { q: '{食|た}べる (người trên) → (ます)', answers: V('{召|め}し{上|あ}がります') },
        { q: '{見|み}る (người trên) → (ます)', answers: V('ご{覧|らん}になります') },
        { q: 'する (người trên) → (ます)', answers: V('なさいます') },
        { q: '{来|く}る → V(ら)れる (ました)', answers: V('{来|こ}られました') },
        { q: '{待|ま}ってください → お～ください', answers: V('お{待|ま}ちください') },
      ],
    },
    {
      t: 'quiz',
      id: 'b24-b1-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: 'お～になる · いらっしゃる・おっしゃる・召し上がる・なさる · お～ください',
      items: [
        { q: 'Trưởng phòng Mori có ở đó không ạ?', answers: V('{森課長|もりかちょう}はいらっしゃいますか。'), hint: 'いらっしゃいますか' },
        { q: 'Mấy giờ anh ấy quay lại ạ?', answers: V('{何時|なんじ}にお{戻|もど}りになりますか。', '{何時|なんじ}ごろお{戻|もど}りになりますか。'), hint: 'おもどりに なりますか' },
        { q: 'Thầy dùng cà phê không ạ?', answers: V('{先生|せんせい}、コーヒーを{召|め}し{上|あ}がりますか。', 'コーヒーを{召|め}し{上|あ}がりますか。'), hint: 'めしあがりますか' },
        { q: 'Cuối tuần thầy làm gì ạ?', answers: V('{週末|しゅうまつ}は{何|なに}をなさいますか。', '{先生|せんせい}は{週末|しゅうまつ}{何|なに}をなさいますか。', '{先生|せんせい}、{週末|しゅうまつ}は{何|なに}をなさいますか。'), hint: 'なにを なさいますか' },
        { q: 'Mời anh/chị vào.', answers: V('どうぞ、お{入|はい}りください。', 'お{入|はい}りください。'), hint: 'おはいり ください' },
        { q: 'Mời anh/chị xem cái này.', answers: V('こちらをご{覧|らん}ください。', 'これをご{覧|らん}ください。', 'どうぞ、こちらをご{覧|らん}ください。'), hint: 'ごらん ください' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Kính ngữ đi theo người LÀM.** Thầy / sếp / khách làm → tôn kính. Mình làm → KHÔNG BAO GIỜ tôn kính.',
        '**Tôn kính có 3 cách tạo + 1 nhóm đặc biệt**: お～になる (chuẩn) · V(ら)れる (nhẹ, dễ) · お～ください (mời) · và いらっしゃる・おっしゃる・{召|め}し{上|あ}がる・ご{覧|らん}になる・なさる・くださる・ご{存|ぞん}じ (thuộc lòng).',
        '**Bẫy chia**: いらっしゃ**い**ます · おっしゃ**い**ます · なさ**い**ます · くださ**い**ます. Không ~~お{見|み}になる~~, không ~~おっしゃられる~~.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{先生|せんせい}が{来|き}ました」を{尊敬語|そんけいご}にしてください。', ro: '"Sensei ga kimashita" o sonkeigo ni shite kudasai.', vi: 'Em đổi câu "Thầy đã đến" sang tôn kính ngữ.' },
        { who: 'Bạn', role: 'candidate', text: '「{先生|せんせい}がいらっしゃいました」です。「{来|こ}られました」も{使|つか}えます。', ro: '"Sensei ga irasshaimashita" desu. "Koraremashita" mo tsukaemasu.', vi: 'Là "Sensei ga irasshaimashita" ạ. "Koraremashita" cũng dùng được ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'どうして「お{見|み}になる」と{言|い}いませんか。', ro: 'Doushite "omi ni naru" to iimasen ka.', vi: 'Vì sao không nói "omi ni naru"?' },
        { who: 'Bạn', role: 'candidate', text: '「{見|み}ます」は{短|みじか}いので、お～になるが{使|つか}えません。「ご{覧|らん}になる」を{使|つか}います。', ro: '"Mimasu" wa mijikai node, o~ni naru ga tsukaemasen. "Goran ni naru" o tsukaimasu.', vi: 'Vì "mimasu" ngắn quá nên không dùng お～になる được. Phải dùng "goran ni naru" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{先生|せんせい}は{昨日|きのう}、{何|なに}を{召|め}し{上|あ}がったと{思|おも}いますか。', ro: 'Sensei wa kinou, nani o meshiagatta to omoimasu ka.', vi: 'Em đoán hôm qua thầy đã dùng món gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ラーメンを{召|め}し{上|あ}がったと{思|おも}います。', ro: 'Raamen o meshiagatta to omoimasu.', vi: 'Em đoán thầy đã dùng mì ramen ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'お{客様|きゃくさま}に{椅子|いす}を{勧|すす}めるとき、{何|なん}と{言|い}いますか。', ro: 'Okyakusama ni isu o susumeru toki, nan to iimasu ka.', vi: 'Khi mời khách ngồi, em nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「どうぞ、お{掛|か}けください」と{言|い}います。', ro: '"Douzo, okake kudasai" to iimasu.', vi: 'Em nói "Douzo, okake kudasai" ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '「おっしゃる」のます{形|けい}は？', options: ['おっしゃります', 'おっしゃいます', 'おっしゃれます', 'おっしゃします'], correct: 1, why: 'る → い: **おっしゃいます**.' },
        { q: '{社長|しゃちょう}はもうお{帰|かえ}りに（　）。', options: ['しました', 'なりました', 'いたしました', 'ください'], correct: 1, why: 'Tôn kính **お～になる**: お{帰|かえ}りになりました.' },
        { q: '「{見|み}る」の{尊敬語|そんけいご}は？', options: ['お{見|み}になる', '{拝見|はいけん}する', 'ご{覧|らん}になる', '{見|み}させる'], correct: 2, why: '**ご{覧|らん}になる** — thân ます 1 âm không ghép お～になる.' },
        { q: '{私|わたし}は{明日|あした}{会社|かいしゃ}に（　）。', options: ['いらっしゃいます', 'お{行|い}きになります', '{参|まい}ります', '{行|い}かれます'], correct: 2, why: 'Mình làm → không tôn kính. **{参|まい}ります** (khiêm nhường — học kỹ ở Buổi 2).' },
        { q: 'どうぞ、こちらにお{掛|か}け（　）。', options: ['します', 'になります', 'ください', 'いたします'], correct: 2, why: 'Mời khách → **お～ください**.' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b24-buoi-2-kenjougo',
  kind: 'review',
  title: 'Buổi 2 — Khiêm nhường ngữ (お〜する・参る・申す・伺う・拝見する・いただく・おる…) · 〜させていただく · でございます · うち・そと · hội thoại ② và ③′',
  goal: 'Theo nhịp một buổi trên lớp: ôn tôn kính ngữ, học từ nhóm C (参る・申す・いたす・伺う・拝見する・いただく・おる・存じる・お目にかかる・差し上げる) và nhóm D (少々・ただいま・席を外す・外出する・折り返し・伝言・用件・かしこまりました・承知する・恐れ入ります), tạo khiêm nhường お〜する／ご〜いたす, dùng đúng động từ khiêm nhường đặc biệt, nhận ra 〜させていただく, nói trang trọng bằng でございます・ございます, nói về sếp mình với khách theo うち・そと, đóng vai hội thoại ② (đến công ty) và ③′ (nghe điện thoại).',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — đổi nhanh sang tôn kính: {来|く}る・{言|い}う・{食|た}べる・{見|み}る・する → いらっしゃる・おっしゃる・{召|め}し{上|あ}がる・ご{覧|らん}になる・なさる.',
        '**Từ mới (10′)** — nhóm C (10 động từ khiêm nhường đặc biệt) + nhóm D (gọi điện & tiếp khách).',
        '**Ngữ pháp (20′)** — ⑥ お～する／ご～いたす · ⑦ động từ khiêm nhường đặc biệt + ～させていただく · ⑧ でございます・ございます, bảng từ lịch sự · うち・そと.',
        '**Hội thoại (10′)** — ② ワン ở quầy lễ tân và phòng khách · ③′ ワン nghe điện thoại thay anh 森.',
        '**チャレンジ (5′)** — đóng vai lễ tân ↔ khách. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b24-b2-slides',
      title: 'Bài 24 会社訪問 — Buổi 2: khiêm nhường ngữ (謙譲語) · lịch sự cao · うち・そと',
      slides: [
        {
          tieuDe: '{前|まえ}の{授業|じゅぎょう} — {尊敬語|そんけいご}',
          bang: {
            head: ['Thường', 'Tôn kính'],
            rows: [
              ['{来|く}る', 'いらっしゃる'],
              ['{言|い}う', 'おっしゃる'],
              ['{食|た}べる', '{召|め}し{上|あ}がる'],
              ['{見|み}る', 'ご{覧|らん}になる'],
              ['{待|ま}つ', 'お{待|ま}ちになる'],
            ],
          },
          hoi: 'Hôm nay ngược lại: MÌNH đi, MÌNH nói thì sao?',
          dap: '{参|まい}ります · {申|もう}します — khiêm nhường ngữ.',
          ghi: 'Gọi 5 bạn, mỗi bạn đổi một động từ. Rồi đặt câu hỏi dẫn vào bài mới.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — {謙譲|けんじょう}の{特別|とくべつ}な{言葉|ことば}',
          anh: ['man-bowing', 'page-facing-up', 'cooked-rice', 'handshake'],
          nhan: ['{申|もう}す', '{拝見|はいけん}する', 'いただく', 'お{目|め}にかかる'],
          bang: {
            head: ['Thường', 'Khiêm nhường'],
            rows: [
              ['{行|い}く・{来|く}る', '{参|まい}る・{伺|うかが}う'],
              ['いる', 'おる'],
              ['{言|い}う · する', '{申|もう}す · いたす'],
              ['{見|み}る · {聞|き}く', '{拝見|はいけん}する · {伺|うかが}う'],
              ['{食|た}べる・もらう', 'いただく'],
              ['{会|あ}う · あげる', 'お{目|め}にかかる · {差|さ}し{上|あ}げる'],
              ['{知|し}っている', '{存|ぞん}じております'],
            ],
          },
          ghi: 'Đặt bảng này cạnh bảng tôn kính của Buổi 1 — học theo CẶP: いらっしゃる ↔ {参|まい}る, {召|め}し{上|あ}がる ↔ いただく, ご{覧|らん}になる ↔ {拝見|はいけん}する, おっしゃる ↔ {申|もう}す.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {電話|でんわ}と{受付|うけつけ}',
          anh: ['ten-oclock', 'man-walking', 'telephone-receiver', 'memo'],
          nhan: ['{少々|しょうしょう}', '{外出|がいしゅつ}', '{折|お}り{返|かえ}し', '{伝言|でんごん}'],
          dong: ['{少々|しょうしょう}お{待|ま}ちください。', 'ただいま{席|せき}を{外|はず}しております。', '{折|お}り{返|かえ}しお{電話|でんわ}いたします。'],
          ro: ['Shoushou omachi kudasai.', 'Tadaima seki o hazushite orimasu.', 'Orikaeshi odenwa itashimasu.'],
          hoi: '{席|せき}を{外|はず}す と {外出|がいしゅつ}する — khác nhau thế nào?',
          dap: '{席|せき}を{外|はず}す: vắng chỗ ngồi, vẫn trong công ty. {外出|がいしゅつ}する: đã ra khỏi công ty.',
          ghi: 'Thêm: {用件|ようけん}, かしこまりました, {承知|しょうち}しました, {恐|おそ}れ{入|い}ります.',
        },
        {
          tieuDe: 'お＋Vます＋する／いたす',
          bang: {
            head: ['Động từ', 'Khiêm nhường'],
            rows: [
              ['{持|も}ちます', 'お{持|も}ちします'],
              ['{送|おく}ります', 'お{送|おく}りします'],
              ['{待|ま}ちます', 'お{待|ま}ちしております'],
              ['{案内|あんない}します', 'ご{案内|あんない}いたします'],
              ['{説明|せつめい}します', 'ご{説明|せつめい}いたします'],
            ],
          },
          hoi: 'Thầy xách túi nặng — em nói gì?',
          dap: '**{先生|せんせい}、お{持|も}ちしましょうか**.',
          ghi: 'Điều kiện: MÌNH làm, và việc HƯỚNG TỚI người trên. ~~お{食|た}べします~~ (ăn của mình) là sai.',
        },
        {
          tieuDe: 'お～になる ↔ お～する — đừng nhầm!',
          anh: ['man-teacher', 'woman-student'],
          nhan: ['{先生|せんせい}が{持|も}つ', '{私|わたし}が{持|も}つ'],
          dong: ['{先生|せんせい}が**お{持|も}ちになります**。(tôn kính)', '{私|わたし}が**お{持|も}ちします**。(khiêm nhường)'],
          ro: ['Sensei ga omochi ni narimasu.', 'Watashi ga omochi shimasu.'],
          hoi: '「{私|わたし}がお{持|も}ちになります」は？',
          dap: 'Sai — tôn kính cho bản thân. Đúng: **{私|わたし}がお{持|も}ちします**.',
          ghi: 'Cùng お + thân ます, chỉ khác đuôi: になる (nâng người khác) / する (hạ mình). Viết hai câu song song lên bảng, gạch chân đuôi.',
        },
        {
          tieuDe: '{参|まい}る と {伺|うかが}う',
          dong: ['{明日|あした}、{大阪|おおさか}へ**{参|まい}ります**。(nơi bình thường)', '{明日|あした}、{先生|せんせい}のお{宅|たく}に**{伺|うかが}います**。(chỗ người trên)'],
          ro: ['Ashita, Oosaka e mairimasu.', 'Ashita, sensei no otaku ni ukagaimasu.'],
          hoi: '「{明日|あした}{京都|きょうと}に{伺|うかが}います」は{自然|しぜん}ですか。',
          dap: 'Không tự nhiên — 伺う nâng NGƯỜI ở nơi đến; Kyoto không phải người. Dùng **{参|まい}ります**.',
          ghi: '伺う còn nghĩa "hỏi": ちょっと{伺|うかが}いますが… · お{話|はなし}を{伺|うかが}う.',
        },
        {
          tieuDe: '～させていただきます — xin phép (nhận ra)',
          dong: ['{自己紹介|じこしょうかい}させていただきます。', '{明日|あした}は{休|やす}ませていただきます。'],
          ro: ['Jiko shoukai sasete itadakimasu.', 'Ashita wa yasumasete itadakimasu.'],
          hoi: '「{帰|かえ}る」→ ～させていただきます は？',
          dap: '**{帰|かえ}らせていただきます** (nhóm 1: る → らせる; không ~~{帰|かえ}させて~~).',
          ghi: 'Ôn thể sai khiến Bài 23. Ở N4 chỉ cần dùng đúng vài câu cố định: tự giới thiệu, xin nghỉ, xin về sớm, xin dùng đồ.',
        },
        {
          tieuDe: 'でございます・ございます',
          anh: ['woman-tipping-hand', 'information'],
          nhan: ['{受付|うけつけ}', '{案内|あんない}'],
          bang: {
            head: ['Thường', 'Lịch sự cao'],
            rows: [
              ['です', 'でございます'],
              ['あります', 'ございます'],
              ['いいですか', 'よろしいでしょうか'],
              ['ちょっと · {今|いま}', '{少々|しょうしょう} · ただいま'],
              ['さっき · あとで', '{先|さき}ほど · {後|のち}ほど'],
              ['だれ · {今日|きょう}', 'どちら{様|さま} · {本日|ほんじつ}'],
            ],
          },
          hoi: '「トイレは2{階|かい}にあります」を{丁寧|ていねい}に。',
          dap: '**お{手洗|てあら}いは2{階|かい}にございます**.',
          ghi: 'Đây là giọng của lễ tân, nhân viên bán hàng. Học sinh làm thêm ở khách sạn, cửa hàng dùng mỗi ngày.',
        },
        {
          tieuDe: 'うち・そと — {社長|しゃちょう}でも「{山本|やまもと}」',
          anh: ['office-building', 'telephone-receiver'],
          nhan: ['うち（{会社|かいしゃ}の{中|なか}）', 'そと（お{客様|きゃくさま}）'],
          bang: {
            head: ['Nói với…', 'Câu'],
            rows: [
              ['đồng nghiệp (うち)', '{山本社長|やまもとしゃちょう}はいらっしゃいません。'],
              ['khách (そと)', '{社長|しゃちょう}の{山本|やまもと}はおりません。'],
            ],
          },
          hoi: 'Khách gọi tìm 森課長 đang ra ngoài — em nói gì?',
          dap: '**{申|もう}し{訳|わけ}ございません。{森|もり}はただいま{外出|がいしゅつ}しております**.',
          ghi: 'Người Việt thấy "kỳ": sếp mà gọi trống tên? Giải thích: với người ngoài, cả công ty là "chúng tôi" — tự nâng "chúng tôi" là thất lễ.',
        },
        {
          tieuDe: '{会話|かいわ} ② — {受付|うけつけ}で',
          anh: ['woman-student', 'woman-tipping-hand', 'elevator'],
          dong: ['ワン：2{時|じ}にお{約束|やくそく}しております、ワンと{申|もう}します。', '{受付|うけつけ}：お{待|ま}ちしておりました。5{階|かい}にご{案内|あんない}いたします。'],
          ro: ['Wan: Niji ni oyakusoku shite orimasu, Wan to moushimasu.', 'Uketsuke: Omachi shite orimashita. Gokai ni goannai itashimasu.'],
          hoi: 'Đếm: trong 2 câu có mấy động từ khiêm nhường?',
          dap: '5: お{約束|やくそく}して · おります · {申|もう}します · お{待|ま}ちしておりました (お～する + おる) · ご{案内|あんない}いたします.',
          ghi: 'Đọc to theo cặp, đổi vai. Rồi đọc tiếp phần ②′ trong phòng khách: お{掛|か}けください／{失礼|しつれい}いたします／{召|め}し{上|あ}がって／いただきます／{拝見|はいけん}します.',
        },
        {
          tieuDe: '{会話|かいわ} ③′ — {電話|でんわ}に{出|で}る',
          anh: ['woman-office-worker', 'telephone', 'memo'],
          dong: ['はい、さくらシステムでございます。', '{森|もり}はただいま{外出|がいしゅつ}しております。', '{承知|しょうち}いたしました。{森|もり}に{伝|つた}えておきます。'],
          ro: ['Hai, Sakura Shisutemu de gozaimasu.', 'Mori wa tadaima gaishutsu shite orimasu.', 'Shouchi itashimashita. Mori ni tsutaete okimasu.'],
          hoi: 'Khách xưng tên 「{田村|たむら}です」. Khi nhắc lại, em gọi khách thế nào?',
          dap: '**{田村様|たむらさま}** — người ngoài luôn có 様, dù họ tự gọi mình trống tên.',
          ghi: 'Luyện 3 lượt, mỗi lượt đổi lý do vắng: {席|せき}を{外|はず}して／{外出|がいしゅつ}して／{会議中|かいぎちゅう}でございます.',
        },
        {
          tieuDe: 'チャレンジ — {受付|うけつけ}ごっこ',
          anh: ['speech-balloon', 'woman-tipping-hand'],
          dong: ['A（{受付|うけつけ}）：いらっしゃいませ。どちら{様|さま}でしょうか。', 'B（{客|きゃく}）：～と{申|もう}します。～{様|さま}と～{時|じ}にお{約束|やくそく}しております。'],
          ro: ['A (uketsuke): Irasshaimase. Dochira-sama deshou ka.', 'B (kyaku): ~ to moushimasu. ~-sama to ~ji ni oyakusoku shite orimasu.'],
          hoi: 'Luyện cặp 3 phút: A mời viết tên, dẫn lên phòng, mời ngồi, mời trà.',
          dap: 'A dùng: お{書|か}きください · ご{案内|あんない}いたします · お{掛|か}けください · {召|め}し{上|あ}がってください. B đáp: {失礼|しつれい}いたします · いただきます.',
          ghi: 'Đi quanh lớp nghe từng cặp; sửa lỗi hay gặp: B nói ~~いらっしゃいました~~ về mình, A nói ~~{森課長|もりかちょう}さん~~ với khách.',
        },
        {
          tieuDe: 'まとめ — Buổi 2',
          bang: {
            head: ['Mẫu', 'Công thức', 'Ví dụ'],
            rows: [
              ['⑥ khiêm nhường', 'お＋Vます＋する／いたす', 'お{持|も}ちします'],
              ['⑦ đặc biệt', '{参|まい}る・{申|もう}す・{伺|うかが}う・{拝見|はいけん}する・いただく・おる', 'ワンと{申|もう}します'],
              ['⑦′ nhận ra', 'Vさせていただきます', '{休|やす}ませていただきます'],
              ['⑧ lịch sự cao', 'でございます・ございます', '2{階|かい}にございます'],
              ['うち・そと', 'sếp mình với khách: tên trống + khiêm nhường', '{森|もり}はおります'],
            ],
          },
          ghi: 'Bài về nhà: viết đoạn hội thoại 8 câu "nghe điện thoại thay sếp" (khách gọi, sếp vắng, nhận lời nhắn). Buổi sau: ～か, ～かどうか + tổng hợp + nhập vai.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn bài cũ: tôn kính ngữ' },
    {
      t: 'mcq',
      id: 'b24-b2-on',
      title: 'Ôn nhanh Buổi 1 (4 câu)',
      items: [
        { q: '{先生|せんせい}は{今|いま}、{研究室|けんきゅうしつ}に（　）。', options: ['おります', 'いらっしゃいます', '{参|まい}ります', 'いらっしゃります'], correct: 1, why: 'Thầy "có ở" → **いらっしゃいます** (không ~~いらっしゃります~~).' },
        { q: '{部長|ぶちょう}はもうお{昼|ひる}を（　）か。', options: ['いただきました', '{召|め}し{上|あ}がりました', 'お{食|た}べしました', '{食|た}べさせました'], correct: 1, why: 'Người trên ăn → **{召|め}し{上|あ}がりました**.' },
        { q: '{先生|せんせい}は{何|なん}と（　）か。', options: ['{申|もう}しました', 'おっしゃいました', 'お{言|い}いしました', '{言|い}わされました'], correct: 1, why: 'Thầy nói → **おっしゃいました**.' },
        { q: 'こちらに（　）ください。', options: ['お{座|すわ}って', 'お{座|すわ}りに', 'お{座|すわ}り', '{座|すわ}りして'], correct: 2, why: '**お＋Vます＋ください**: お{座|すわ}りください (= お{掛|か}けください).' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: "kịch bản" nghe điện thoại dán cạnh máy' },
    {
      t: 'table',
      caption: 'Giáo viên dán tờ "kịch bản nghe điện thoại" của công ty lên bảng — mỗi dòng là một từ / mẫu mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['はい、～**でございます**', 'hai, ~ de gozaimasu', 'vâng, công ty ~ xin nghe'],
        ['**{少々|しょうしょう}**お{待|ま}ちください', 'shoushou omachi kudasai', 'xin chờ một chút'],
        ['～は**ただいま{席|せき}を{外|はず}して**／**{外出|がいしゅつ}して**おります', 'tadaima seki o hazushite / gaishutsu shite orimasu', 'hiện vắng chỗ / đang ra ngoài'],
        ['**{折|お}り{返|かえ}し**お{電話|でんわ}いたしましょうか', 'orikaeshi odenwa itashimashou ka', 'để chúng tôi gọi lại nhé?'],
        ['ご**{伝言|でんごん}**はございますか · ご**{用件|ようけん}**は', 'godengon · goyouken', 'lời nhắn · việc cần'],
        ['**かしこまりました** · **{承知|しょうち}いたしました** · **{恐|おそ}れ{入|い}ります**', 'kashikomarimashita · shouchi itashimashita · osoreirimasu', 'vâng ạ · tôi đã rõ · xin lỗi đã làm phiền'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('わたくし、{人事部|じんじぶ}の{森|もり}と{申|もう}します。', 'Watakushi, jinjibu no Mori to moushimasu.', 'Tôi là Mori phòng nhân sự.'),
        E('{明日|あした}の10{時|じ}にそちらへ{伺|うかが}います。', 'Ashita no juuji ni sochira e ukagaimasu.', '10 giờ mai tôi xin đến chỗ anh/chị.'),
        E('お{手紙|てがみ}、{拝見|はいけん}しました。', 'Otegami, haiken shimashita.', 'Tôi đã đọc thư của anh/chị.'),
        E('{父|ちち}は{銀行|ぎんこう}で{働|はたら}いております。', 'Chichi wa ginkou de hataraite orimasu.', 'Bố tôi làm ở ngân hàng.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — Đổi sang khiêm nhường & nói thành câu: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b24-b2-chia',
      title: 'Luyện nhanh — đổi sang khiêm nhường / lịch sự cao (10 câu)',
      kind: 'fill',
      items: [
        { q: '{私|わたし}が{行|い}く → (ます)', answers: V('{参|まい}ります', '{伺|うかが}います') },
        { q: '{私|わたし}が{言|い}う → (ます)', answers: V('{申|もう}します') },
        { q: '{私|わたし}がする → (ます)', answers: V('いたします') },
        { q: '{私|わたし}が{見|み}る → (ました)', answers: V('{拝見|はいけん}しました') },
        { q: '{私|わたし}がもらう → (ました)', answers: V('いただきました') },
        { q: '{私|わたし}がいる → (ます)', answers: V('おります') },
        { q: '{私|わたし}が{持|も}つ (cho người trên) → お～する (ます)', answers: V('お{持|も}ちします', 'お{持|も}ちいたします') },
        { q: '{私|わたし}が{説明|せつめい}する → ご～いたす (ます)', answers: V('ご{説明|せつめい}いたします') },
        { q: 'あります → (lịch sự cao)', answers: V('ございます') },
        { q: 'です → (lịch sự cao)', answers: V('でございます') },
      ],
    },
    {
      t: 'quiz',
      id: 'b24-b2-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: 'お～する／いたす · 参る・申す・伺う・拝見する・いただく・おる · でございます · うち・そと',
      items: [
        { q: 'Tôi tên là Linh.', answers: V('リンと{申|もう}します。', 'わたくし、リンと{申|もう}します。'), hint: 'と もうします' },
        { q: 'Tài liệu tôi sẽ gửi qua email.', answers: V('{資料|しりょう}はメールでお{送|おく}りします。', '{資料|しりょう}はメールでお{送|おく}りいたします。'), hint: 'おおくり します' },
        { q: 'Tôi xin dẫn anh/chị lên tầng 5.', answers: V('5{階|かい}へご{案内|あんない}いたします。', '5{階|かい}にご{案内|あんない}いたします。', '5{階|かい}へご{案内|あんない}します。'), hint: 'ごあんない いたします' },
        { q: '(nói với khách) Anh Mori đang họp ạ.', answers: V('{森|もり}は{会議中|かいぎちゅう}でございます。', '{森|もり}はただいま{会議中|かいぎちゅう}でございます。'), hint: 'もりは … でございます' },
        { q: 'Để chúng tôi gọi lại nhé?', answers: V('{折|お}り{返|かえ}しお{電話|でんわ}いたしましょうか。', '{折|お}り{返|かえ}しお{電話|でんわ}しましょうか。'), hint: 'おりかえし おでんわ いたしましょうか' },
        { q: 'Ngày mai tôi xin phép nghỉ.', answers: V('{明日|あした}は{休|やす}ませていただきます。', '{明日|あした}、{休|やす}ませていただきます。'), hint: 'やすませて いただきます' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**お～になる (nâng người khác) ↔ お～する (hạ mình)** — cùng お + thân ます, khác đuôi. Đọc đuôi là biết AI làm.',
        '**Học động từ theo cặp**: いらっしゃる ↔ {参|まい}る／おる · おっしゃる ↔ {申|もう}す · {召|め}し{上|あ}がる ↔ いただく · ご{覧|らん}になる ↔ {拝見|はいけん}する · なさる ↔ いたす · くださる ↔ いただく · ご{存|ぞん}じだ ↔ {存|ぞん}じております.',
        '**うち・そと**: nói với khách, sếp mình = người nhà → tên trống + khiêm nhường ({森|もり}はおります). Nói trong nội bộ → tôn kính sếp ({森課長|もりかちょう}はいらっしゃいません).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{自己紹介|じこしょうかい}を{敬語|けいご}でしてください。', ro: 'Jiko shoukai o keigo de shite kudasai.', vi: 'Em hãy tự giới thiệu bằng kính ngữ.' },
        { who: 'Bạn', role: 'candidate', text: 'はじめまして。ベトナムから{参|まい}りましたグエンと{申|もう}します。どうぞよろしくお{願|ねが}いいたします。', ro: 'Hajimemashite. Betonamu kara mairimashita Guen to moushimasu. Douzo yoroshiku onegai itashimasu.', vi: 'Rất hân hạnh. Em là Nguyễn, đến từ Việt Nam. Rất mong được giúp đỡ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{先生|せんせい}の{荷物|にもつ}が{重|おも}そうです。{何|なん}と{言|い}いますか。', ro: 'Sensei no nimotsu ga omosou desu. Nan to iimasu ka.', vi: 'Đồ của thầy trông nặng. Em nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{先生|せんせい}、お{持|も}ちしましょうか」と{言|い}います。', ro: '"Sensei, omochi shimashou ka" to iimasu.', vi: 'Em nói "Thầy ơi, để em xách giúp nhé" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'お{客様|きゃくさま}から{電話|でんわ}です。{課長|かちょう}は{会議中|かいぎちゅう}です。{何|なん}と{言|い}いますか。', ro: 'Okyakusama kara denwa desu. Kachou wa kaigichuu desu. Nan to iimasu ka.', vi: 'Khách gọi điện. Trưởng phòng đang họp. Em nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{申|もう}し{訳|わけ}ございません。{森|もり}はただいま{会議中|かいぎちゅう}でございます。{折|お}り{返|かえ}しお{電話|でんわ}いたしましょうか」と{言|い}います。', ro: '"Moushiwake gozaimasen. Mori wa tadaima kaigichuu de gozaimasu. Orikaeshi odenwa itashimashou ka" to iimasu.', vi: 'Em nói "Thật xin lỗi, anh Mori hiện đang họp. Để chúng tôi gọi lại nhé?" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'どうして「{森課長|もりかちょう}」と{言|い}いませんか。', ro: 'Doushite "Mori-kachou" to iimasen ka.', vi: 'Vì sao em không nói "Mori-kachou"?' },
        { who: 'Bạn', role: 'candidate', text: '{会社|かいしゃ}の{外|そと}の{人|ひと}と{話|はな}しているので、{自分|じぶん}の{会社|かいしゃ}の{人|ひと}を{高|たか}くしないからです。', ro: 'Kaisha no soto no hito to hanashite iru node, jibun no kaisha no hito o takaku shinai kara desu.', vi: 'Vì em đang nói chuyện với người ngoài công ty nên không nâng người trong công ty mình lên ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: 'はじめまして。ワンと（　）。', options: ['おっしゃいます', '{申|もう}します', 'いらっしゃいます', 'ございます'], correct: 1, why: 'Tự giới thiệu → **～と{申|もう}します**.' },
        { q: '{先生|せんせい}、そのかばん、（　）しましょうか。', options: ['お{持|も}ち', 'お{持|も}ちに', '{持|も}って', 'お{持|も}って'], correct: 0, why: 'Khiêm nhường **お{持|も}ちしましょうか**.' },
        { q: '{先生|せんせい}のお{手紙|てがみ}を（　）。', options: ['ご{覧|らん}になりました', '{拝見|はいけん}しました', 'お{見|み}しました', '{見|み}られました'], correct: 1, why: 'Mình xem → **{拝見|はいけん}しました**.' },
        { q: '（お{客様|きゃくさま}に）「{課長|かちょう}の{森|もり}は、ただいま（　）。」', options: ['いらっしゃいません', 'おりません', 'お{出|で}かけになっています', 'ございません'], correct: 1, why: 'うち・そと: sếp mình với khách → khiêm nhường **おりません**. (ございません chỉ dùng cho vật.)' },
        { q: 'エレベーターはこちら（　）。', options: ['でございます', 'でいらっしゃいます', 'におります', 'でいたします'], correct: 0, why: 'Vật / nơi chốn + です → lịch sự cao **でございます**.' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b24-buoi-3-ka-dou-ka',
  kind: 'review',
  title: 'Buổi 3 — Câu hỏi lồng 〜か · 〜かどうか · từ lịch sự & phỏng vấn · tổng hợp "ai làm → loại nào" + lỗi hay mắc · hội thoại ③ · nhập vai gọi điện – đến công ty',
  goal: 'Theo nhịp một buổi trên lớp: ôn khiêm nhường ngữ và うち・そと, học từ nhóm E (よろしい・先ほど・後ほど・どちら様・結構です・本日・資料・自己紹介・長所・尊敬する・遠慮する), hỏi gián tiếp bằng 疑問詞〜か và 〜かどうか (ナA・N bỏ だ), tổng hợp ba loại kính ngữ theo bảng "ai làm → dùng loại nào", sửa 10 lỗi kinh điển, đóng vai hội thoại ③ (nhờ thầy xem bài) và nhập vai trọn: gọi điện hẹn lịch → đến công ty → trả lời phỏng vấn.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — cặp tôn kính ↔ khiêm nhường; うち・そと (nghe điện thoại thay sếp).',
        '**Từ mới (5′)** — nhóm E: từ lịch sự (よろしい・{先|さき}ほど・{後|のち}ほど・どちら{様|さま}・{結構|けっこう}です・{本日|ほんじつ}) + từ phỏng vấn ({資料|しりょう}・{自己紹介|じこしょうかい}・{長所|ちょうしょ}・{尊敬|そんけい}する・{遠慮|えんりょ}する).',
        '**Ngữ pháp (15′)** — ⑨ 疑問詞 ～か · ⑩ ～かどうか · bảng phân biệt.',
        '**Tổng hợp (10′)** — bảng "ai làm → loại nào", 10 lỗi kinh điển, nói một ý ở ba mức.',
        '**Hội thoại + nhập vai (15′)** — ③ マルコ ở phòng giáo viên; nhập vai trọn bộ gọi điện → quầy lễ tân → phỏng vấn. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b24-b3-slides',
      title: 'Bài 24 会社訪問 — Buổi 3: 〜か・〜かどうか · tổng hợp kính ngữ',
      slides: [
        {
          tieuDe: '{前|まえ}の{授業|じゅぎょう} — {尊敬語|そんけいご} ↔ {謙譲語|けんじょうご}',
          bang: {
            head: ['Người trên làm', 'Mình làm'],
            rows: [
              ['いらっしゃる', '{参|まい}る・おる'],
              ['おっしゃる', '{申|もう}す'],
              ['{召|め}し{上|あ}がる', 'いただく'],
              ['ご{覧|らん}になる', '{拝見|はいけん}する'],
              ['お{待|ま}ちになる', 'お{待|ま}ちする'],
            ],
          },
          hoi: 'Che một cột — cả lớp đọc cột còn lại.',
          dap: 'Đọc theo cặp: いらっしゃる – {参|まい}る, おっしゃる – {申|もう}す…',
          ghi: 'Ôn 3 phút bằng trò "giáo viên nói động từ thường + người làm, học sinh nói kính ngữ".',
        },
        {
          tieuDe: '{新|あたら}しいことば — {丁寧|ていねい}な{言葉|ことば}',
          anh: ['ok-hand', 'calendar', 'red-question-mark', 'raised-hand'],
          nhan: ['よろしい', '{本日|ほんじつ}', 'どちら{様|さま}', '{結構|けっこう}です'],
          bang: {
            head: ['Thường', 'Lịch sự'],
            rows: [
              ['いい', 'よろしい'],
              ['さっき · あとで', '{先|さき}ほど · {後|のち}ほど'],
              ['だれ', 'どちら{様|さま}'],
              ['{今日|きょう}', '{本日|ほんじつ}'],
              ['いいえ、いいです', 'いいえ、{結構|けっこう}です'],
            ],
          },
          ghi: '{結構|けっこう}です có hai nghĩa ngược nhau: "được rồi" và "thôi, không cần". Có いいえ đi trước là từ chối.',
        },
        {
          tieuDe: '{新|あたら}しいことば — {面接|めんせつ}',
          anh: ['clipboard', 'man-raising-hand', 'trophy', 'man-teacher'],
          nhan: ['{資料|しりょう}', '{自己紹介|じこしょうかい}', '{長所|ちょうしょ}', '{尊敬|そんけい}する'],
          dong: ['{簡単|かんたん}に{自己紹介|じこしょうかい}をお{願|ねが}いします。', 'あなたの{長所|ちょうしょ}は{何|なん}ですか。', '{尊敬|そんけい}している{人|ひと}はだれですか。'],
          ro: ['Kantan ni jiko shoukai o onegai shimasu.', 'Anata no chousho wa nan desu ka.', 'Sonkei shite iru hito wa dare desu ka.'],
          hoi: 'Ba câu này hay gặp ở đâu?',
          dap: 'Phỏng vấn — và thi nói JPD.',
          ghi: 'Thêm: ご{遠慮|えんりょ}なく (đừng ngại), おたばこはご{遠慮|えんりょ}ください (xin đừng hút thuốc).',
        },
        {
          tieuDe: '{疑問詞|ぎもんし} ＋ {普通形|ふつうけい} ＋ か',
          dong: ['{会議|かいぎ}は{何時|なんじ}に{始|はじ}まりますか。', '→ {会議|かいぎ}が{何時|なんじ}に{始|はじ}まる**か**、{教|おし}えてください。'],
          ro: ['Kaigi wa nanji ni hajimarimasu ka.', '→ Kaigi ga nanji ni hajimaru ka, oshiete kudasai.'],
          hoi: '「{担当|たんとう}は{誰|だれ}ですか」を「わかりません」の{前|まえ}に{入|い}れてください。',
          dap: '**{担当|たんとう}が{誰|だれ}か、わかりません** (N bỏ だ).',
          ghi: 'Ba bước: đổi về thể thường → bỏ だ (ナA, N) → thêm か. Chủ ngữ は thường đổi thành が.',
        },
        {
          tieuDe: '～かどうか — "có … hay không"',
          dong: ['{明日|あした}{来|こ}られますか。', '→ {明日|あした}{来|こ}られる**かどうか**、まだわかりません。'],
          ro: ['Ashita koraremasu ka.', '→ Ashita korareru ka dou ka, mada wakarimasen.'],
          hoi: '「その{話|はなし}は{本当|ほんとう}ですか」→ ～かどうか は？',
          dap: '**その{話|はなし}が{本当|ほんとう}かどうか** (bỏ だ).',
          ghi: 'Không có từ để hỏi → かどうか. Có từ để hỏi → か. Viết hai câu song song lên bảng.',
        },
        {
          tieuDe: '～か と ～かどうか — chọn thế nào?',
          bang: {
            head: ['Câu hỏi gốc', 'Lồng vào'],
            rows: [
              ['いつ{来|き}ますか', 'いつ{来|く}る**か**'],
              ['{明日|あした}{来|き}ますか', '{明日|あした}{来|く}る**かどうか**'],
              ['どこが{静|しず}かですか', 'どこが{静|しず}か**か**'],
              ['ここは{静|しず}かですか', 'ここが{静|しず}か**かどうか**'],
            ],
          },
          hoi: '「いつ{来|く}るかどうか」は{正|ただ}しいですか。',
          dap: 'Sai — có いつ (từ để hỏi) thì chỉ dùng **か**.',
          ghi: 'Câu kiểm tra nhanh: câu hỏi gốc trả lời được bằng はい／いいえ không? Được → かどうか.',
        },
        {
          tieuDe: '{敬語|けいご}と いっしょに',
          anh: ['telephone-receiver', 'woman-student'],
          dong: ['{何時|なんじ}に{伺|うかが}えばよろしい**か**、{教|おし}えていただけませんか。', '{留学生|りゅうがくせい}でも{応募|おうぼ}できる**かどうか**、{教|おし}えていただけませんか。'],
          ro: ['Nanji ni ukagaeba yoroshii ka, oshiete itadakemasen ka.', 'Ryuugakusei demo oubo dekiru ka dou ka, oshiete itadakemasen ka.'],
          hoi: 'Vì sao câu hỏi lồng nghe lịch sự hơn câu hỏi thẳng?',
          dap: 'Vì không hỏi thẳng mà "nhờ cho biết" — người nghe không bị ép trả lời.',
          ghi: 'Đây là khuôn hỏi chuẩn khi gọi điện cho công ty, nhà trường.',
        },
        {
          tieuDe: 'だれがする？ → どの{敬語|けいご}？',
          anh: ['man-teacher', 'woman-student', 'office-building'],
          nhan: ['{先生|せんせい}・お{客様|きゃくさま}', '{私|わたし}', '{会社|かいしゃ}の{人|ひと}（そと）'],
          bang: {
            head: ['Ai làm', 'Loại', 'Ví dụ'],
            rows: [
              ['thầy, khách, người ngoài', '{尊敬語|そんけいご}', 'いらっしゃいます'],
              ['tôi', '{謙譲語|けんじょうご}', '{参|まい}ります'],
              ['sếp mình (nói với khách)', '{謙譲語|けんじょうご}', '{森|もり}はおります'],
              ['đồ vật, nơi chốn', '{丁寧語|ていねいご}', 'こちらでございます'],
            ],
          },
          ghi: 'Bảng quan trọng nhất của Bài 24 — chép vào vở, dán lên bàn học.',
        },
        {
          tieuDe: '⚠ {間違|まちが}いやすい{敬語|けいご}',
          bang: {
            head: ['SAI', 'ĐÚNG'],
            rows: [
              ['~~{私|わたし}がいらっしゃいます~~', '{私|わたし}が{参|まい}ります'],
              ['~~{先生|せんせい}が{拝見|はいけん}しました~~', '{先生|せんせい}がご{覧|らん}になりました'],
              ['~~いらっしゃります~~', 'いらっしゃいます'],
              ['~~おっしゃられました~~', 'おっしゃいました'],
              ['~~お{待|ま}ってください~~', 'お{待|ま}ちください'],
              ['~~ご{電話|でんわ}します~~', 'お{電話|でんわ}します'],
            ],
          },
          hoi: 'Lỗi nào em hay mắc nhất?',
          dap: '(học sinh tự trả lời) — phần lớn người Việt mắc dòng 1.',
          ghi: 'Đọc từng dòng, cả lớp nói "SAI — vì sao". Bảng 12 lỗi đầy đủ ở cuối mục Ngữ pháp.',
        },
        {
          tieuDe: '{会話|かいわ} ③ — {職員室|しょくいんしつ}で',
          anh: ['door', 'man-student', 'man-teacher'],
          dong: ['マルコ：{失礼|しつれい}します。{本田先生|ほんだせんせい}はいらっしゃいますか。', 'マルコ：{先生|せんせい}に{見|み}ていただけないでしょうか。', '{先生|せんせい}：{行|い}けるかどうか、まだわからないんです。'],
          ro: ['Maruko: Shitsurei shimasu. Honda-sensei wa irasshaimasu ka.', 'Maruko: Sensei ni mite itadakenai deshou ka.', 'Sensei: Ikeru ka dou ka, mada wakaranai n desu.'],
          hoi: 'Lỗi trong bài hùng biện của マルコ là gì?',
          dap: '「{私|わたし}は{社長|しゃちょう}にお{会|あ}いになりました」— tôn kính cho bản thân. Đúng: **お{目|め}にかかりました**.',
          ghi: 'Đọc to theo cặp; người đóng thầy trả lời bằng です・ます thường (thầy không dùng kính ngữ cho mình).',
        },
        {
          tieuDe: 'ロールプレイ — {電話|でんわ} → {受付|うけつけ} → {面接|めんせつ}',
          anh: ['telephone-receiver', 'woman-tipping-hand', 'man-office-worker'],
          nhan: ['① {電話|でんわ}', '② {受付|うけつけ}', '③ {面接|めんせつ}'],
          dong: ['① ～と{申|もう}します。～のことでお{電話|でんわ}いたしました。', '② ～{様|さま}と～{時|じ}にお{約束|やくそく}しております。', '③ {本日|ほんじつ}はお{時間|じかん}をいただき、ありがとうございます。'],
          ro: ['~ to moushimasu. ~ no koto de odenwa itashimashita.', '~-sama to ~ji ni oyakusoku shite orimasu.', 'Honjitsu wa ojikan o itadaki, arigatou gozaimasu.'],
          hoi: 'Nhóm 3 người: sinh viên · lễ tân · người phỏng vấn. Diễn trọn 3 cảnh trong 5 phút.',
          dap: 'Người phỏng vấn hỏi 3 câu: {自己紹介|じこしょうかい} · {長所|ちょうしょ} · {尊敬|そんけい}する{人|ひと}.',
          ghi: 'Chấm theo bảng: AI làm → đúng loại kính ngữ; うち・そと; có ít nhất một câu ～か／～かどうか.',
        },
        {
          tieuDe: 'まとめ — Bài 24',
          bang: {
            head: ['Mẫu', 'Nhớ một câu'],
            rows: [
              ['{尊敬語|そんけいご}', '{先生|せんせい}はいらっしゃいますか。'],
              ['{謙譲語|けんじょうご}', 'ワンと{申|もう}します。{明日|あした}{伺|うかが}います。'],
              ['{丁寧語|ていねいご}', 'こちらでございます。'],
              ['うち・そと', '{森|もり}はただいま{外出|がいしゅつ}しております。'],
              ['～か／～かどうか', '{行|い}けるかどうか、わかりません。'],
            ],
          },
          ghi: 'Bài về nhà: viết email cảm ơn (mục 8 Viết), làm mục 9 Bài tập + Luyện thêm. Bài 25: ôn tập & thi thử N4 — kính ngữ chắc chắn có trong đề.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn bài cũ: khiêm nhường ngữ, うち・そと' },
    {
      t: 'mcq',
      id: 'b24-b3-on',
      title: 'Ôn nhanh Buổi 2 (4 câu)',
      items: [
        { q: '{明日|あした}、{先生|せんせい}の{研究室|けんきゅうしつ}に（　）。', options: ['いらっしゃいます', '{伺|うかが}います', 'お{行|い}きになります', 'おいでになります'], correct: 1, why: 'Mình đến chỗ thầy → **{伺|うかが}います**.' },
        { q: '{資料|しりょう}はわたくしがお{送|おく}り（　）。', options: ['になります', 'いたします', 'ください', 'なさいます'], correct: 1, why: 'Mình làm → **お～いたします**.' },
        { q: '（お{客様|きゃくさま}に）「{社長|しゃちょう}の{山本|やまもと}がそう（　）。」', options: ['おっしゃいました', '{申|もう}しておりました', 'お{話|はな}しになりました', '{言|い}われました'], correct: 1, why: 'うち・そと: nói với khách về giám đốc mình → **{申|もう}しておりました**.' },
        { q: 'お{手洗|てあら}いはあちらに（　）。', options: ['ございます', 'いらっしゃいます', 'おります', 'なさいます'], correct: 0, why: 'Vật / nơi chốn + あります → **ございます**.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: "phiếu hỏi đáp" của buổi phỏng vấn' },
    {
      t: 'table',
      caption: 'Giáo viên phát "phiếu phỏng vấn mẫu" — các từ in đậm là từ mới',
      head: ['Trên phiếu', 'Đọc', 'Nghĩa'],
      rows: [
        ['**{本日|ほんじつ}**はよろしくお{願|ねが}いします', 'honjitsu wa yoroshiku onegai shimasu', 'hôm nay rất mong được giúp đỡ'],
        ['{簡単|かんたん}に**{自己紹介|じこしょうかい}**をお{願|ねが}いします', 'kantan ni jiko shoukai o onegai shimasu', 'xin hãy tự giới thiệu ngắn gọn'],
        ['あなたの**{長所|ちょうしょ}**と{短所|たんしょ}は？', 'anata no chousho to tansho wa', 'điểm mạnh và điểm yếu của bạn?'],
        ['**{尊敬|そんけい}**している{人|ひと}は？', 'sonkei shite iru hito wa', 'người bạn kính trọng?'],
        ['**{資料|しりょう}**をご{覧|らん}ください · ご**{遠慮|えんりょ}**なくどうぞ', 'shiryou o goran kudasai · goenryo naku douzo', 'mời xem tài liệu · đừng ngại'],
        ['**{先|さき}ほど**の{質問|しつもん} · **{後|のち}ほど**ご{連絡|れんらく}します · これで**よろしい**ですか', 'sakihodo · nochihodo · yoroshii', 'câu hỏi lúc nãy · lát nữa sẽ liên lạc · thế này được chưa'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{先|さき}ほどはお{電話|でんわ}ありがとうございました。', 'Sakihodo wa odenwa arigatou gozaimashita.', 'Cảm ơn anh/chị về cuộc gọi lúc nãy.'),
        E('{失礼|しつれい}ですが、どちら{様|さま}でしょうか。', 'Shitsurei desu ga, dochira-sama deshou ka.', 'Xin lỗi, anh/chị là ai ạ?'),
        E('いいえ、もう{結構|けっこう}です。', 'Iie, mou kekkou desu.', 'Dạ thôi, đủ rồi ạ.'),
        E('{私|わたし}が{尊敬|そんけい}している{人|ひと}は{祖母|そぼ}です。', 'Watashi ga sonkei shite iru hito wa sobo desu.', 'Người tôi kính trọng là bà tôi.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～か・～かどうか: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b24-b3-chia',
      title: 'Luyện nhanh — lồng câu hỏi vào câu (10 câu)',
      kind: 'fill',
      grammar: 'Có từ để hỏi → 普通形 ＋ か · Không có → 普通形 ＋ かどうか · ナA／N bỏ だ',
      items: [
        { q: '{何時|なんじ}に{始|はじ}まりますか → ～、{教|おし}えてください', answers: V('{何時|なんじ}に{始|はじ}まるか、{教|おし}えてください', '{何時|なんじ}に{始|はじ}まるか{教|おし}えてください') },
        { q: '{明日|あした}{雨|あめ}が{降|ふ}りますか → ～、わかりません', answers: V('{明日|あした}{雨|あめ}が{降|ふ}るかどうか、わかりません', '{明日|あした}{雨|あめ}が{降|ふ}るかどうかわかりません') },
        { q: '{誰|だれ}が{来|き}ましたか → ～、{知|し}っていますか', answers: V('{誰|だれ}が{来|き}たか、{知|し}っていますか', '{誰|だれ}が{来|き}たか{知|し}っていますか') },
        { q: 'あの{店|みせ}はおいしいですか → ～、{食|た}べてみます', answers: V('あの{店|みせ}がおいしいかどうか、{食|た}べてみます', 'あの{店|みせ}はおいしいかどうか、{食|た}べてみます', 'あの{店|みせ}がおいしいかどうか{食|た}べてみます') },
        { q: 'どこが{便利|べんり}ですか → ～、{調|しら}べます', answers: V('どこが{便利|べんり}か、{調|しら}べます', 'どこが{便利|べんり}か{調|しら}べます') },
        { q: 'その{話|はなし}は{本当|ほんとう}ですか → ～、わかりません', answers: V('その{話|はなし}が{本当|ほんとう}かどうか、わかりません', 'その{話|はなし}は{本当|ほんとう}かどうか、わかりません', 'その{話|はなし}が{本当|ほんとう}かどうかわかりません') },
        { q: '{担当|たんとう}は{誰|だれ}ですか → ～、{教|おし}えていただけませんか', answers: V('{担当|たんとう}が{誰|だれ}か、{教|おし}えていただけませんか', '{担当|たんとう}は{誰|だれ}か、{教|おし}えていただけませんか', '{担当|たんとう}が{誰|だれ}か{教|おし}えていただけませんか') },
        { q: 'メールは{届|とど}きましたか → ～、{確認|かくにん}します', answers: V('メールが{届|とど}いたかどうか、{確認|かくにん}します', 'メールが{届|とど}いたかどうか{確認|かくにん}します', 'メールは{届|とど}いたかどうか、{確認|かくにん}します') },
        { q: 'どれがいいですか → ～、{選|えら}んでください', answers: V('どれがいいか、{選|えら}んでください', 'どれがいいか{選|えら}んでください') },
        { q: '{先生|せんせい}はいらっしゃいますか → ～、{聞|き}いてみます', answers: V('{先生|せんせい}がいらっしゃるかどうか、{聞|き}いてみます', '{先生|せんせい}がいらっしゃるかどうか{聞|き}いてみます', '{先生|せんせい}はいらっしゃるかどうか、{聞|き}いてみます') },
      ],
    },
    {
      t: 'quiz',
      id: 'b24-b3-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～か・～かどうか + kính ngữ',
      items: [
        { q: 'Cho tôi biết phòng họp ở đâu được không ạ?', answers: V('{会議室|かいぎしつ}がどこか、{教|おし}えていただけませんか。', '{会議室|かいぎしつ}はどこか、{教|おし}えていただけませんか。', '{会議室|かいぎしつ}がどこにあるか、{教|おし}えていただけませんか。'), hint: 'どこか、おしえて いただけませんか' },
        { q: 'Tôi chưa biết có đi được hay không.', answers: V('{行|い}けるかどうか、まだわかりません。', 'まだ{行|い}けるかどうかわかりません。'), hint: 'いけるかどうか' },
        { q: 'Tôi không nhớ thầy đã nói gì.', answers: V('{先生|せんせい}が{何|なん}とおっしゃったか、{覚|おぼ}えていません。', '{先生|せんせい}が{何|なに}をおっしゃったか、{覚|おぼ}えていません。'), hint: 'なんと おっしゃったか' },
        { q: 'Tôi sẽ kiểm tra xem tài liệu đã đến chưa.', answers: V('{資料|しりょう}が{届|とど}いたかどうか、{確認|かくにん}します。', '{資料|しりょう}が{届|とど}いたかどうか、{確認|かくにん}いたします。'), hint: 'とどいたかどうか' },
        { q: 'Xin lỗi, anh/chị là ai ạ?', answers: V('{失礼|しつれい}ですが、どちら{様|さま}でしょうか。', '{失礼|しつれい}ですが、どちら{様|さま}ですか。'), hint: 'どちらさま でしょうか' },
        { q: 'Dạ thôi, đủ rồi ạ. (từ chối)', answers: V('いいえ、もう{結構|けっこう}です。', 'いいえ、{結構|けっこう}です。'), hint: 'けっこう です' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-b3-phan-biet',
      title: 'Phân biệt nhanh — tôn kính / khiêm nhường / lịch sự / か・かどうか (6 câu)',
      items: [
        { q: '{先生|せんせい}が{私|わたし}の{作文|さくぶん}を（　）。', options: ['{拝見|はいけん}しました', 'ご{覧|らん}になりました', 'お{見|み}しました', 'ご{覧|らん}しました'], correct: 1, why: 'Thầy xem → tôn kính **ご{覧|らん}になりました**.' },
        { q: '{私|わたし}が{先生|せんせい}の{作文|さくぶん}を（　）。', options: ['{拝見|はいけん}しました', 'ご{覧|らん}になりました', 'お{見|み}になりました', '{見|み}られました'], correct: 0, why: 'Mình xem đồ của thầy → khiêm nhường **{拝見|はいけん}しました**.' },
        { q: '{会議室|かいぎしつ}はこちら（　）。', options: ['でいらっしゃいます', 'でございます', 'でおります', 'でいたします'], correct: 1, why: 'Nơi chốn → **でございます**.' },
        { q: '{面接|めんせつ}が{何曜日|なんようび}（　）、まだ{決|き}まっていません。', options: ['か', 'かどうか', 'だか', 'ですか'], correct: 0, why: 'Có từ để hỏi {何曜日|なんようび} + N (bỏ だ) → **{何曜日|なんようび}か**.' },
        { q: '{面接|めんせつ}が{月曜日|げつようび}（　）、まだわかりません。', options: ['か', 'かどうか', 'だかどうか', 'ですか'], correct: 1, why: 'Không có từ để hỏi → **{月曜日|げつようび}かどうか**.' },
        { q: 'A「コーヒー、もう{一杯|いっぱい}いかがですか。」 B「いいえ、もう（　）。」', options: ['{結構|けっこう}です', 'よろしいです', 'かしこまりました', '{恐|おそ}れ{入|い}ります'], correct: 0, why: 'Từ chối lịch sự → **いいえ、もう{結構|けっこう}です**.' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**～か ↔ ～かどうか**: câu hỏi gốc có từ để hỏi → か; trả lời được bằng はい／いいえ → かどうか. Cả hai đi sau **普通形**, ナA／N **bỏ だ**.',
        '**Câu hỏi lồng + ～ていただけませんか** = khuôn hỏi lịch sự nhất khi gọi điện: {何時|なんじ}に{伺|うかが}えばよろしいか、{教|おし}えていただけませんか.',
        '**Trước mỗi động từ hỏi AI làm, nói với AI.** Thuộc bảng "ai làm → loại nào" và 10 lỗi kinh điển — Bài 25 (thi thử N4) chắc chắn hỏi.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{会議|かいぎ}が{何時|なんじ}に{終|お}わるか、{知|し}っていますか。', ro: 'Kaigi ga nanji ni owaru ka, shitte imasu ka.', vi: 'Em có biết cuộc họp mấy giờ kết thúc không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{何時|なんじ}に{終|お}わるか{存|ぞん}じません。{確認|かくにん}してまいります。', ro: 'Iie, nanji ni owaru ka zonjimasen. Kakunin shite mairimasu.', vi: 'Dạ không, em không biết mấy giờ kết thúc. Em sẽ đi kiểm tra ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{来週|らいしゅう}の{見学|けんがく}、{行|い}けるかどうか、もう{決|き}めましたか。', ro: 'Raishuu no kengaku, ikeru ka dou ka, mou kimemashita ka.', vi: 'Buổi tham quan tuần sau, em đã quyết có đi được hay không chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'アルバイトがあるので、{行|い}けるかどうか、まだわかりません。{明日|あした}までにお{知|し}らせします。', ro: 'Arubaito ga aru node, ikeru ka dou ka, mada wakarimasen. Ashita made ni oshirase shimasu.', vi: 'Vì em có ca làm thêm nên chưa biết có đi được không. Trước ngày mai em sẽ báo thầy ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'あなたが{尊敬|そんけい}している{人|ひと}はだれですか。', ro: 'Anata ga sonkei shite iru hito wa dare desu ka.', vi: 'Người em kính trọng là ai?' },
        { who: 'Bạn', role: 'candidate', text: '{母|はは}です。{母|はは}は{毎日|まいにち}{働|はたら}きながら、{私|わたし}を{育|そだ}ててくれました。', ro: 'Haha desu. Haha wa mainichi hatarakinagara, watashi o sodatete kuremashita.', vi: 'Là mẹ em ạ. Mẹ vừa đi làm mỗi ngày vừa nuôi em lớn.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'どうして「{母|はは}がおっしゃいました」と{言|い}わないんですか。', ro: 'Doushite "haha ga osshaimashita" to iwanai n desu ka.', vi: 'Vì sao em không nói "haha ga osshaimashita"?' },
        { who: 'Bạn', role: 'candidate', text: '{母|はは}は{私|わたし}の{家族|かぞく}なので、ほかの{人|ひと}と{話|はな}すときは{尊敬語|そんけいご}を{使|つか}いません。', ro: 'Haha wa watashi no kazoku na node, hoka no hito to hanasu toki wa sonkeigo o tsukaimasen.', vi: 'Vì mẹ là người nhà em, nên khi nói với người khác em không dùng tôn kính ngữ ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: 'どこで{説明会|せつめいかい}がある（　）、{教|おし}えていただけませんか。', options: ['か', 'かどうか', 'ですか', 'だか'], correct: 0, why: 'Có どこ → **か**.' },
        { q: 'この{会社|かいしゃ}に{留学生|りゅうがくせい}がいる（　）、わかりません。', options: ['か', 'かどうか', 'ので', 'でしょう'], correct: 1, why: 'Không có từ để hỏi → **かどうか**.' },
        { q: '{本日|ほんじつ}はお{忙|いそが}しいところ、お{時間|じかん}を（　）、ありがとうございます。', options: ['いただき', '{差|さ}し{上|あ}げ', 'いたし', '{申|もう}し'], correct: 0, why: 'Câu chào cố định: お{時間|じかん}を**いただき**、ありがとうございます — mình **nhận** thời gian của người trên (いただく = khiêm nhường của もらう). (お{時間|じかん}をくださり cũng đúng nhưng không có trong lựa chọn.)' },
        { q: '{課長|かちょう}、お{客様|きゃくさま}が（　）。', options: ['{参|まい}りました', 'いらっしゃいました', 'おりました', '{伺|うかが}いました'], correct: 1, why: 'Khách (người ngoài) đến → tôn kính **いらっしゃいました**.' },
        { q: '{失礼|しつれい}ですが、（　）でしょうか。', options: ['だれ', 'どちら{様|さま}', 'どなた{様|さま}です', 'どこ'], correct: 1, why: 'Hỏi tên lịch sự nhất → **どちら{様|さま}でしょうか**.' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 48 từ của mục Từ vựng). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{会社訪問|かいしゃほうもん}', 'kaisha houmon', 'thăm công ty'],
  ['{訪|たず}ねます', 'tazunemasu', 'đến thăm'],
  ['{社長|しゃちょう}', 'shachou', 'giám đốc'],
  ['{課長|かちょう}', 'kachou', 'trưởng phòng'],
  ['{人事部|じんじぶ}', 'jinjibu', 'phòng nhân sự'],
  ['{係|かかり}', 'kakari', 'người phụ trách'],
  ['{名刺|めいし}', 'meishi', 'danh thiếp'],
  ['{応接室|おうせつしつ}', 'ousetsushitsu', 'phòng tiếp khách'],
  ['{会議室|かいぎしつ}', 'kaigishitsu', 'phòng họp'],
  ['インターンシップ', 'intaanshippu', 'thực tập (ở công ty)'],
  ['いらっしゃいます', 'irasshaimasu', '(người trên) có ở / đi / đến'],
  ['おっしゃいます', 'osshaimasu', '(người trên) nói'],
  ['{召|め}し{上|あ}がります', 'meshiagarimasu', '(người trên) ăn, uống'],
  ['ご{覧|らん}になります', 'goran ni narimasu', '(người trên) xem'],
  ['なさいます', 'nasaimasu', '(người trên) làm'],
  ['くださいます', 'kudasaimasu', '(người trên) cho tôi'],
  ['ご{存|ぞん}じです', 'gozonji desu', '(người trên) biết'],
  ['{参|まい}ります', 'mairimasu', '(tôi) đi, đến'],
  ['{申|もう}します', 'moushimasu', '(tôi) nói; tên tôi là'],
  ['いたします', 'itashimasu', '(tôi) làm'],
  ['{伺|うかが}います', 'ukagaimasu', '(tôi) hỏi; đến thăm'],
  ['{拝見|はいけん}します', 'haiken shimasu', '(tôi) xem'],
  ['いただきます', 'itadakimasu', '(tôi) nhận; ăn, uống'],
  ['おります', 'orimasu', '(tôi) có ở'],
  ['{存|ぞん}じます', 'zonjimasu', '(tôi) biết; nghĩ'],
  ['お{目|め}にかかります', 'ome ni kakarimasu', '(tôi) gặp (người trên)'],
  ['{差|さ}し{上|あ}げます', 'sashiagemasu', '(tôi) biếu, tặng'],
  ['{少々|しょうしょう}', 'shoushou', 'một chút (lịch sự)'],
  ['ただいま', 'tadaima', 'hiện giờ (lịch sự của 今)'],
  ['{席|せき}を{外|はず}します', 'seki o hazushimasu', 'tạm rời chỗ ngồi'],
  ['{外出|がいしゅつ}します', 'gaishutsu shimasu', 'ra ngoài (rời công ty)'],
  ['{折|お}り{返|かえ}し', 'orikaeshi', '(gọi) lại ngay'],
  ['{伝言|でんごん}', 'dengon', 'lời nhắn'],
  ['{用件|ようけん}', 'youken', 'việc cần nói'],
  ['かしこまりました', 'kashikomarimashita', 'tôi rõ rồi ạ (với khách)'],
  ['{承知|しょうち}しました', 'shouchi shimashita', 'đã rõ, xin vâng'],
  ['{恐|おそ}れ{入|い}ります', 'osoreirimasu', 'xin lỗi đã làm phiền'],
  ['よろしい', 'yoroshii', 'tốt, được (lịch sự)'],
  ['{先|さき}ほど', 'sakihodo', 'lúc nãy'],
  ['{後|のち}ほど', 'nochihodo', 'lát nữa'],
  ['どちら{様|さま}', 'dochira-sama', 'vị nào, ai ạ'],
  ['{結構|けっこう}です', 'kekkou desu', 'được rồi; thôi, không cần'],
  ['{本日|ほんじつ}', 'honjitsu', 'hôm nay (trang trọng)'],
  ['{資料|しりょう}', 'shiryou', 'tài liệu'],
  ['{自己紹介|じこしょうかい}', 'jiko shoukai', 'tự giới thiệu'],
  ['{長所|ちょうしょ}', 'chousho', 'điểm mạnh'],
  ['{尊敬|そんけい}します', 'sonkei shimasu', 'kính trọng'],
  ['{遠慮|えんりょ}します', 'enryo shimasu', 'ngại, giữ ý; từ chối khéo'],
];

/** Xếp đáp án đúng vào vị trí (i % 4) — cố định, không ngẫu nhiên, để tiến độ lưu theo câu không đổi. */
const xep = (dung: string, sai: string[], i: number): { options: string[]; correct: number } => {
  const k = i % 4;
  const options = [...sai.slice(0, k), dung, ...sai.slice(k, 3)];
  return { options, correct: k };
};
const MCQ_NV = (from: number, to: number): Mcq[] =>
  TU_LT.slice(from, to).map(([w, ro, vi], j) => {
    const i = from + j;
    const n = TU_LT.length;
    const sai = [7, 19, 31].map((d) => TU_LT[(i + d) % n][2]);
    return { q: `「${w}」〔${ro}〕 nghĩa là gì?`, ...xep(vi, sai, i), why: `**${w}** (${ro}) = ${vi}.` };
  });
const MCQ_VN = (from: number, to: number): Mcq[] =>
  TU_LT.slice(from, to).map(([w, ro, vi], j) => {
    const i = from + j;
    const n = TU_LT.length;
    const sai = [5, 17, 29].map((d) => TU_LT[(i + d) % n][0]);
    return { q: `"${vi}" tiếng Nhật là gì?`, ...xep(w, sai, i + 1), why: `**${w}** (${ro}) = ${vi}.` };
  });

const LT_1: Lesson = {
  id: 'b24-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (40 câu)',
  goal: 'Nhớ chắc 48 từ của Bài 24 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp dễ nhầm (いらっしゃる・参る, 召し上がる・いただく, ご覧になる・拝見する, おっしゃる・申す, 伺う・訪ねる, 席を外す・外出する, 先ほど・後ほど, かしこまりました・結構です).',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 15 câu Nhật → Việt và 10 câu Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi) và nói luôn **cặp** của nó (いらっしゃる ↔ {参|まい}る…).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N4.',
        'Lỗi hay mắc: dùng từ khiêm nhường cho thầy (~~{先生|せんせい}が{参|まい}りました~~ → いらっしゃいました), {席|せき}を~~{外出|がいしゅつ}~~ (→ {席|せき}を{外|はず}す), ~~{先|さき}ほど~~ cho tương lai (→ {後|のち}ほど).',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b24-lt1-nv', title: 'Nhật → Việt (15 câu)', items: MCQ_NV(10, 25) },
    { t: 'mcq', id: 'b24-lt1-vn', title: 'Việt → Nhật (10 câu)', items: MCQ_VN(27, 37) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b24-lt1-dien',
      title: 'Điền từ (15 câu)',
      items: [
        { q: '{来週|らいしゅう}、{先輩|せんぱい}が{働|はたら}いている{会社|かいしゃ}を（　）します。', options: ['{訪問|ほうもん}', '{外出|がいしゅつ}', '{伝言|でんごん}', '{遠慮|えんりょ}'], correct: 0, why: 'Đến thăm công ty = **{訪問|ほうもん}する**. 〔Kaisha o houmon shimasu.〕' },
        { q: '{初|はじ}めて{会|あ}った{方|かた}と（　）を{交換|こうかん}しました。', options: ['{資料|しりょう}', '{伝言|でんごん}', '{名刺|めいし}', '{用件|ようけん}'], correct: 2, why: 'Trao **danh thiếp** = {名刺|めいし}を{交換|こうかん}する. 〔Meishi o koukan shimashita.〕' },
        { q: 'わからないことは、{受付|うけつけ}の（　）の{人|ひと}に{聞|き}いてください。', options: ['{係|かかり}', '{課長|かちょう}', '{社長|しゃちょう}', '{本日|ほんじつ}'], correct: 0, why: '**{係|かかり}の{人|ひと}** = người phụ trách. 〔Kakari no hito ni kiite kudasai.〕' },
        { q: '{先生|せんせい}、もうお{昼|ひる}ご{飯|はん}を（　）か。', options: ['いただきました', '{召|め}し{上|あ}がりました', '{拝見|はいけん}しました', '{参|まい}りました'], correct: 1, why: 'Thầy ăn → **{召|め}し{上|あ}がりました**. 〔Mou ohirugohan o meshiagarimashita ka.〕' },
        { q: '{部長|ぶちょう}、{昨日|きのう}のメールをご{覧|らん}に（　）か。', options: ['しました', 'いたしました', 'なりました', 'くださいました'], correct: 2, why: '**ご{覧|らん}になる** → ご{覧|らん}になりました. 〔Goran ni narimashita ka.〕' },
        { q: '{先生|せんせい}は{森|もり}さんの{住所|じゅうしょ}をご（　）ですか。', options: ['{存|ぞん}じ', '{覧|らん}', '{遠慮|えんりょ}', '{用件|ようけん}'], correct: 0, why: '**ご{存|ぞん}じですか** = (người trên) có biết không. 〔Gozonji desu ka.〕' },
        { q: 'はじめまして。{留学生|りゅうがくせい}のパクと（　）。', options: ['おっしゃいます', '{申|もう}します', 'なさいます', 'くださいます'], correct: 1, why: 'Tự giới thiệu → **～と{申|もう}します**. 〔Paku to moushimasu.〕' },
        { q: '{明日|あした}の{午後|ごご}、{先生|せんせい}のお{宅|たく}に（　）。', options: ['いらっしゃいます', '{伺|うかが}います', 'ご{覧|らん}になります', 'おいでになります'], correct: 1, why: 'Mình đến nhà thầy → **{伺|うかが}います**. 〔Otaku ni ukagaimasu.〕' },
        { q: '{電話|でんわ}で：「{課長|かちょう}の{森|もり}は、ただいま{席|せき}を（　）おります。」', options: ['{外出|がいしゅつ}して', '{外|はず}して', '{出|で}して', '{離|はな}れて'], correct: 1, why: 'Cụm cố định **{席|せき}を{外|はず}す**. 〔Seki o hazushite orimasu.〕' },
        { q: '{森|もり}は{午後|ごご}から（　）しております。{夕方|ゆうがた}{戻|もど}ります。', options: ['{外出|がいしゅつ}', '{訪問|ほうもん}', '{遠慮|えんりょ}', '{承知|しょうち}'], correct: 0, why: 'Ra ngoài, chiều tối về = **{外出|がいしゅつ}**. 〔Gogo kara gaishutsu shite orimasu.〕' },
        { q: '{戻|もど}りましたら、（　）お{電話|でんわ}いたします。', options: ['{先|さき}ほど', '{本日|ほんじつ}', '{折|お}り{返|かえ}し', 'ただいま'], correct: 2, why: 'Gọi lại cho người vừa gọi = **{折|お}り{返|かえ}し**. 〔Orikaeshi odenwa itashimasu.〕' },
        { q: '（　）はお{電話|でんわ}ありがとうございました。', options: ['{後|のち}ほど', '{先|さき}ほど', '{少々|しょうしょう}', '{結構|けっこう}'], correct: 1, why: 'Cuộc gọi đã qua = **{先|さき}ほど** (lúc nãy). 〔Sakihodo wa odenwa arigatou gozaimashita.〕' },
        { q: '{失礼|しつれい}ですが、（　）でしょうか。', options: ['どちら{様|さま}', 'ただいま', '{本日|ほんじつ}', 'よろしい'], correct: 0, why: 'Hỏi tên lịch sự = **どちら{様|さま}でしょうか**. 〔Dochira-sama deshou ka.〕' },
        { q: '{面接|めんせつ}で：「では、{簡単|かんたん}に（　）をお{願|ねが}いします。」', options: ['{長所|ちょうしょ}', '{自己紹介|じこしょうかい}', '{伝言|でんごん}', '{名刺|めいし}'], correct: 1, why: 'Mở đầu phỏng vấn = **{自己紹介|じこしょうかい}**. 〔Kantan ni jiko shoukai o onegai shimasu.〕' },
        { q: 'ご（　）なく、たくさん{召|め}し{上|あ}がってください。', options: ['{遠慮|えんりょ}', '{存|ぞん}じ', '{覧|らん}', '{承知|しょうち}'], correct: 0, why: '**ご{遠慮|えんりょ}なく** = đừng ngại. 〔Goenryo naku…〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b24-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống (24 câu)',
  goal: 'Đọc và viết đúng 15 chữ Hán mới trong từ (kể cả từ ghép mở rộng: 訪問・敬語・尊敬・ご存じ・伺う・拝見・召し上がる・課長・関係・担当・相談・職場・紹介・応接室・応募…), chọn chữ đúng cho từ viết kana, phân biệt chữ trông giống (訪・話, 敬・警・驚, 存・在, 伺・何, 召・招・紹, 係・系・孫, 担・但, 談・淡, 職・識・織, 介・今, 応・広).',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢** đọc từ (漢字読み) — 10 câu · **🟡** chọn chữ đúng (表記) — 8 câu · **🔴** chữ trông giống — 6 câu.',
        'Sai câu nào: mở thẻ chữ Hán (chạm vào chữ) xem cách nhớ + thứ tự nét, viết lại cả từ 3 lần.',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: đọc từ (漢字読み)' },
    {
      t: 'mcq',
      id: 'b24-lt2-doc',
      title: 'Chọn cách đọc (10 câu)',
      items: [
        { q: '**訪ねる**', options: ['たずねる', 'ほうねる', 'おとねる', 'まねる'], correct: 0, why: '**{訪|たず}ねる** (tazuneru) — đến thăm.' },
        { q: '**敬語**', options: ['けご', 'けいご', 'きょうご', 'けいこ'], correct: 1, why: '**{敬語|けいご}** (keigo).' },
        { q: 'ご**存**じ', options: ['そん', 'ざい', 'ぞん', 'すん'], correct: 2, why: 'ご**{存|ぞん}**じ (gozonji) — đục.' },
        { q: '**拝見**', options: ['はいけん', 'ばいけん', 'ぱいけん', 'はいみ'], correct: 0, why: '**{拝見|はいけん}** (haiken).' },
        { q: '**召**し上がる', options: ['しょう', 'め', 'まね', 'よ'], correct: 1, why: '**{召|め}**し{上|あ}がる (meshiagaru).' },
        { q: '**係員**', options: ['けいいん', 'かかりいん', 'かがりいん', 'けいえん'], correct: 1, why: '**{係員|かかりいん}** (kakariin) — nhân viên phụ trách (kun + on).' },
        { q: '**関係**', options: ['かんけい', 'かんかかり', 'がんけい', 'かんげい'], correct: 0, why: '**{関係|かんけい}** (kankei) — quan hệ. ({歓迎|かんげい} là "hoan nghênh".)' },
        { q: '**職場**', options: ['しょくじょう', 'しょっば', 'しょくば', 'しきば'], correct: 2, why: '**{職場|しょくば}** (shokuba) — nơi làm việc.' },
        { q: '**冗談**', options: ['じょだん', 'じょうだん', 'じょうたん', 'しょうだん'], correct: 1, why: '**{冗談|じょうだん}** (joudan) — chuyện đùa; 談 đục だん.' },
        { q: '**応募**', options: ['おうぼ', 'おぼ', 'のうぼ', 'おうぼう'], correct: 0, why: '**{応募|おうぼ}** (oubo) — ứng tuyển (Bài 16).' },
      ],
    },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn chữ đúng (表記)' },
    {
      t: 'mcq',
      id: 'b24-lt2-chon',
      title: 'Chọn chữ Hán (8 câu)',
      items: [
        { q: '{会社|かいしゃ}を**たずねます**。', options: ['話ねます', '訪ねます', '方ねます', '尋ねます'], correct: 1, why: 'Đến thăm → **訪ねる** (言 + 方). 尋ねる (hỏi) đồng âm khác chữ.' },
        { q: '**けいご**を{勉強|べんきょう}します。', options: ['警語', '驚語', '敬語', '経語'], correct: 2, why: '**敬語** — 敬 đứng một mình (không 言, không 馬 ở dưới).' },
        { q: '{先生|せんせい}はご**ぞん**じです。', options: ['在', '存', '孫', '尊'], correct: 1, why: 'ご**存**じ — dưới là 子.' },
        { q: '{明日|あした}そちらに**うかが**います。', options: ['何', '伺', '司', '詞'], correct: 1, why: '**伺** = 亻 + 司. 何 (gì) bên phải là 可.' },
        { q: '{資料|しりょう}を**はいけん**しました。', options: ['拝見', '排見', '杯見', '拝間'], correct: 0, why: '**拝見** — 扌 + phần chắp tay; 見 (xem).' },
        { q: 'この{仕事|しごと}の**たんとう**は{私|わたし}です。', options: ['但当', '担当', '胆当', '担灯'], correct: 1, why: '**担当** — 扌 (tay gánh).' },
        { q: '{会議|かいぎ}の{前|まえ}に**そうだん**しましょう。', options: ['相淡', '想談', '相談', '相炎'], correct: 2, why: '**相談** — 談 = 言 + 炎.' },
        { q: '**おうせつしつ**でお{待|ま}ちください。', options: ['広接室', '応接室', '応按室', '心接室'], correct: 1, why: '**応接室** — 応 = 广 + 心; 接 (Bài 16).' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Khó: chữ trông giống' },
    {
      t: 'mcq',
      id: 'b24-lt2-bay',
      title: 'Chữ nào đúng trong câu? (6 câu)',
      items: [
        { q: '{友達|ともだち}を{家族|かぞく}に（　）{介|かい}しました。', options: ['招', '紹', '召', '昭'], correct: 1, why: '**紹介** — 紹 có 糸 (nối). 招 (扌) là của {招待|しょうたい}.' },
        { q: '（　）{察|さつ}に{電話|でんわ}しました。', options: ['敬', '警', '驚', '驕'], correct: 1, why: '**警察** — 警 = 敬 + 言 (Bài 19).' },
        { q: '{父|ちち}を（　）{敬|けい}しています。', options: ['尊', '導', '噂', '樽'], correct: 0, why: '**尊敬** — 尊 = 酋 + 寸.' },
        { q: '{会社|かいしゃ}の（　）{員|いん}はやさしいです。 (nhân viên phụ trách)', options: ['系', '係', '孫', '糸'], correct: 1, why: '**係員** — 係 = 亻 + 系. 孫 (cháu) = 子 + 系.' },
        { q: '{大学|だいがく}で{知|ち}（　）を{身|み}につけます。 (tri thức)', options: ['職', '識', '織', '戦'], correct: 1, why: '**知識** — trái là 言 (thức). 職 (耳) là chức; 織 (糸) là dệt.' },
        { q: '{日本|にほん}で{就|しゅう}（　）したいです。', options: ['識', '織', '職', '色'], correct: 2, why: '**就職** — 職 có 耳 bên trái.' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b24-lt-3-doi-kinh-ngu',
  kind: 'homework',
  title: 'Luyện thêm 3 · Đổi sang kính ngữ — 🟢 chọn → 🟡 gõ → 🔴 nhận ra ai làm (42 câu)',
  goal: 'Đổi thành phản xạ mọi động từ của bài sang tôn kính / khiêm nhường / lịch sự cao: chọn đúng dạng, gõ được お〜になる・お〜する・ご〜いたす・お〜ください・động từ đặc biệt・〜させていただく, đổi câu thường thành câu kính ngữ theo người làm, và đọc một câu kính ngữ mà biết ngay AI làm.',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢** chọn dạng đúng — 12 câu · **🟡** gõ dạng được yêu cầu — 14 câu + đổi cả câu — 8 câu · **🔴** đọc câu kính ngữ, đoán AI làm — 8 câu.',
        'Bảng tra nhanh khi làm: Ngữ pháp ③ (tôn kính đặc biệt) và ⑦ (khiêm nhường đặc biệt) đặt cạnh nhau.',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: chọn dạng kính ngữ' },
    {
      t: 'mcq',
      id: 'b24-lt3-chon',
      title: 'Chọn dạng đúng (12 câu)',
      items: [
        { q: '「{来|く}る」の{尊敬語|そんけいご}', options: ['{参|まい}る', 'いらっしゃる', '{伺|うかが}う', 'おる'], correct: 1, why: '**いらっしゃる** (cũng: おいでになる, {見|み}える).' },
        { q: '「いる」の{謙譲語|けんじょうご}', options: ['おる', 'いらっしゃる', 'ござる', 'おいでになる'], correct: 0, why: '**おる** → おります.' },
        { q: '「する」の{尊敬語|そんけいご}（{特別|とくべつ}な{言葉|ことば}）', options: ['いたす', 'なさる', 'させる', 'しられる'], correct: 1, why: '**なさる** → なさいます. (Dạng られる của する là される — cũng tôn kính nhưng nhẹ hơn; ~~しられる~~ không có.)' },
        { q: '「する」の{謙譲語|けんじょうご}', options: ['なさる', 'いたす', 'くださる', 'おっしゃる'], correct: 1, why: '**いたす** → いたします.' },
        { q: '「くれる」の{尊敬語|そんけいご}', options: ['いただく', 'くださる', '{差|さ}し{上|あ}げる', 'もらわれる'], correct: 1, why: '**くださる** → くださいます.' },
        { q: '「あげる」の{謙譲語|けんじょうご}', options: ['くださる', '{差|さ}し{上|あ}げる', 'いただく', 'お{上|あ}げになる'], correct: 1, why: '**{差|さ}し{上|あ}げる**.' },
        { q: '「{知|し}っている」の{尊敬語|そんけいご}', options: ['{存|ぞん}じている', 'ご{存|ぞん}じだ', 'お{知|し}りする', '{知|し}らせる'], correct: 1, why: '**ご{存|ぞん}じだ** → ご{存|ぞん}じです.' },
        { q: '「{会|あ}う」の{謙譲語|けんじょうご}', options: ['お{会|あ}いになる', 'お{目|め}にかかる', 'ご{覧|らん}になる', '{会|あ}われる'], correct: 1, why: '**お{目|め}にかかる** (hoặc お{会|あ}いする).' },
        { q: '「{聞|き}く（{質問|しつもん}する）」の{謙譲語|けんじょうご}', options: ['{伺|うかが}う', 'お{聞|き}きになる', 'おっしゃる', '{拝見|はいけん}する'], correct: 0, why: '**{伺|うかが}う** (hỏi — khiêm nhường).' },
        { q: '「{寝|ね}る」の{尊敬語|そんけいご}', options: ['お{寝|ね}になる', 'お{休|やす}みになる', 'お{休|やす}みする', '{寝|ね}させる'], correct: 1, why: '**お{休|やす}みになる** — ~~お{寝|ね}になる~~ không có.' },
        { q: '「{待|ま}ってください」を{丁寧|ていねい}に', options: ['お{待|ま}ちしてください', 'お{待|ま}ちください', 'お{待|ま}ってください', 'お{待|ま}ちになってください'], correct: 1, why: '**お{待|ま}ちください** (お＋Vます＋ください).' },
        { q: '「{利用|りよう}してください」を{丁寧|ていねい}に', options: ['ご{利用|りよう}ください', 'お{利用|りよう}ください', 'ご{利用|りよう}してください', 'ご{利用|りよう}いたしてください'], correct: 0, why: '**ご{利用|りよう}ください** (từ Hán → ご).' },
      ],
    },
    { t: 'h', text: '🟡 Mức 2 — Vừa: gõ dạng kính ngữ' },
    {
      t: 'quiz',
      id: 'b24-lt3-go',
      title: 'Gõ dạng được yêu cầu (14 câu)',
      kind: 'fill',
      grammar: 'お〜になる · ご〜になる · V(ら)れる · お〜する／いたす · ご〜いたす · お〜ください · động từ đặc biệt · 〜させていただく',
      items: [
        { q: '{読|よ}む → お～になる (ます)', answers: V('お{読|よ}みになります'), hint: 'およみに なります' },
        { q: '{出|で}かける → お～になる (ました)', answers: V('お{出|で}かけになりました'), hint: 'おでかけに なりました' },
        { q: '{出席|しゅっせき}する → ご～になる (ます)', answers: V('ご{出席|しゅっせき}になります'), hint: 'ごしゅっせきに なります' },
        { q: '{帰|かえ}る → V(ら)れる (ました)', answers: V('{帰|かえ}られました'), hint: 'かえられました' },
        { q: 'する → V(ら)れる (ます)', answers: V('されます'), hint: 'される' },
        { q: '{送|おく}る (mình) → お～する (ます)', answers: V('お{送|おく}りします', 'お{送|おく}りいたします'), hint: 'おおくり します' },
        { q: '{知|し}らせる (mình) → お～する (ます)', answers: V('お{知|し}らせします', 'お{知|し}らせいたします'), hint: 'おしらせ します' },
        { q: '{連絡|れんらく}する (mình) → ご～いたす (ます)', answers: V('ご{連絡|れんらく}いたします'), hint: 'ごれんらく いたします' },
        { q: '{紹介|しょうかい}する (mình) → ご～いたす (ます)', answers: V('ご{紹介|しょうかい}いたします'), hint: 'ごしょうかい いたします' },
        { q: '{書|か}いてください → お～ください', answers: V('お{書|か}きください'), hint: 'おかき ください' },
        { q: '{来|き}てください → (lịch sự, động từ đặc biệt)', answers: V('いらっしゃってください', 'おいでください', 'いらしてください'), hint: 'いらっしゃって ください' },
        { q: '{説明|せつめい}する (xin phép) → ～させていただきます', answers: V('{説明|せつめい}させていただきます'), hint: 'せつめい させて いただきます' },
        { q: '{使|つか}う (xin phép) → ～させていただきます', answers: V('{使|つか}わせていただきます'), hint: 'つかわせて いただきます' },
        { q: '{待|ま}っている (mình) → (khiêm nhường)', answers: V('お{待|ま}ちしております', '{待|ま}っております'), hint: 'おまち して おります' },
      ],
    },
    {
      t: 'quiz',
      id: 'b24-lt3-doi',
      title: 'Đổi cả câu sang kính ngữ (8 câu)',
      kind: 'translate',
      grammar: 'Người trên làm → tôn kính · mình làm → khiêm nhường · vật → でございます／ございます',
      items: [
        { q: '{先生|せんせい}は{明日|あした}{大阪|おおさか}へ{行|い}きます。', answers: V('{先生|せんせい}は{明日|あした}{大阪|おおさか}へいらっしゃいます。', '{先生|せんせい}は{明日|あした}{大阪|おおさか}へ{行|い}かれます。', '{先生|せんせい}は{明日|あした}{大阪|おおさか}へおいでになります。'), hint: 'いらっしゃいます' },
        { q: '{社長|しゃちょう}はこの{本|ほん}を{読|よ}みました。', answers: V('{社長|しゃちょう}はこの{本|ほん}をお{読|よ}みになりました。', '{社長|しゃちょう}はこの{本|ほん}を{読|よ}まれました。'), hint: 'およみに なりました' },
        { q: '{課長|かちょう}は{何|なん}と{言|い}いましたか。', answers: V('{課長|かちょう}は{何|なん}とおっしゃいましたか。'), hint: 'おっしゃいましたか' },
        { q: '{私|わたし}は{先生|せんせい}の{写真|しゃしん}を{見|み}ました。', answers: V('{私|わたし}は{先生|せんせい}の{写真|しゃしん}を{拝見|はいけん}しました。', '{私|わたし}は{先生|せんせい}のお{写真|しゃしん}を{拝見|はいけん}しました。'), hint: 'はいけん しました' },
        { q: '{私|わたし}が{駅|えき}まで{送|おく}ります。', answers: V('{私|わたし}が{駅|えき}までお{送|おく}りします。', 'わたくしが{駅|えき}までお{送|おく}りします。', '{私|わたし}が{駅|えき}までお{送|おく}りいたします。'), hint: 'おおくり します' },
        { q: '{私|わたし}は{先生|せんせい}に{辞書|じしょ}をもらいました。', answers: V('{私|わたし}は{先生|せんせい}に{辞書|じしょ}をいただきました。'), hint: 'いただきました' },
        { q: '{先生|せんせい}が{私|わたし}に{辞書|じしょ}をくれました。', answers: V('{先生|せんせい}が{私|わたし}に{辞書|じしょ}をくださいました。'), hint: 'くださいました' },
        { q: '{会議室|かいぎしつ}は3{階|かい}にあります。', answers: V('{会議室|かいぎしつ}は3{階|かい}にございます。'), hint: 'ございます' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Khó: đọc câu kính ngữ, đoán AI làm' },
    {
      t: 'mcq',
      id: 'b24-lt3-ai-lam',
      title: 'Ai làm? (8 câu)',
      items: [
        { q: '（{会社|かいしゃ}で、{社員|しゃいん}が{客|きゃく}に）「{明日|あした}、{資料|しりょう}をお{届|とど}けします。」 → {資料|しりょう}を{届|とど}けるのは{誰|だれ}？', options: ['{社員|しゃいん}', '{客|きゃく}', '{社長|しゃちょう}', 'わからない'], correct: 0, why: '**お～します** = khiêm nhường ⇒ người nói (nhân viên) làm.' },
        { q: '「{社長|しゃちょう}が{資料|しりょう}をお{届|とど}けになりました。」 → {届|とど}けたのは{誰|だれ}？', options: ['{話|はな}している{人|ひと}', '{社長|しゃちょう}', '{客|きゃく}', '{社員|しゃいん}'], correct: 1, why: '**お～になりました** = tôn kính ⇒ giám đốc (người được nâng) làm.' },
        { q: '（{電話|でんわ}で）「{田中|たなか}はただいま{外出|がいしゅつ}しております。」 → {田中|たなか}さんは{誰|だれ}？', options: ['{電話|でんわ}をかけた{人|ひと}', '{電話|でんわ}を{受|う}けた{人|ひと}の{会社|かいしゃ}の{人|ひと}', 'お{客様|きゃくさま}の{会社|かいしゃ}の{人|ひと}', '{田中|たなか}さんの{家族|かぞく}'], correct: 1, why: 'Tên trống + **おる** (khiêm nhường) ⇒ người **cùng công ty** với người đang nghe máy (うち).' },
        { q: '「{先生|せんせい}がおっしゃったとおりにしました。」 → {言|い}ったのは？', options: ['{私|わたし}', '{先生|せんせい}', '{友達|ともだち}', '{両親|りょうしん}'], correct: 1, why: '**おっしゃった** (tôn kính) ⇒ thầy nói.' },
        { q: '「{明日|あした}そちらへ{伺|うかが}います。」 → {行|い}くのは？', options: ['{話|はな}している{人|ひと}', '{聞|き}いている{人|ひと}', '{二人|ふたり}とも', '{先生|せんせい}'], correct: 0, why: '**{伺|うかが}う** (khiêm nhường) ⇒ người nói đến chỗ người nghe.' },
        { q: '「どうぞ、{召|め}し{上|あ}がってください。」 → {食|た}べるのは？', options: ['{話|はな}している{人|ひと}', '{聞|き}いている{人|ひと}', '{店員|てんいん}', '{子|こ}ども'], correct: 1, why: '**{召|め}し{上|あ}がる** (tôn kính) + ください ⇒ người nghe (khách) ăn.' },
        { q: '「{先生|せんせい}に{作文|さくぶん}を{見|み}ていただきました。」 → {作文|さくぶん}を{見|み}たのは？', options: ['{私|わたし}', '{先生|せんせい}', '{友達|ともだち}', 'わからない'], correct: 1, why: '**(người) に ～ていただく** ⇒ người đứng trước に (thầy) làm, mình nhận ơn.' },
        { q: '「{父|ちち}がよろしくと{申|もう}しておりました。」 → {言|い}ったのは？', options: ['{話|はな}している{人|ひと}の{父|ちち}', '{聞|き}いている{人|ひと}の{父|ちち}', '{先生|せんせい}', '{社長|しゃちょう}'], correct: 0, why: '{父|ちち} (không お{父|とう}さん) + **{申|もう}す** (khiêm nhường) ⇒ bố của **người nói** (người nhà — うち).' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b24-lt-4-phan-biet',
  kind: 'homework',
  title: 'Luyện thêm 4 · Phân biệt & bẫy — 🟡 chọn trong cặp → 🔴 bẫy kinh điển + 文の組み立て (30 câu)',
  goal: 'Phân biệt chắc: お〜になる ↔ お〜する, いらっしゃる ↔ 参る, 召し上がる ↔ いただく, ご覧になる ↔ 拝見する, くださる ↔ いただく, 伺う ↔ 参る, でございます ↔ でいらっしゃいます, 〜か ↔ 〜かどうか; tránh bẫy いらっしゃります, お見になる, 二重敬語, お待ってください, ご電話, うち・そと; ghép câu kính ngữ đúng trật tự.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟡** 14 câu — mỗi câu chỉ có hai lựa chọn "cặp" (tôn kính ↔ khiêm nhường…): hỏi AI làm rồi chọn.',
        '**🔴** 10 câu bẫy kinh điển + 6 câu ghép (文の組み立て). Sai bẫy nào: đọc lại bảng 12 lỗi cuối mục Ngữ pháp.',
      ],
    },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn trong từng cặp' },
    {
      t: 'mcq',
      id: 'b24-lt4-cap',
      title: 'Chọn trong cặp (14 câu)',
      items: [
        { q: '{先生|せんせい}は{今|いま}、{会議室|かいぎしつ}に（　）。', options: ['いらっしゃいます', 'おります'], correct: 0, why: 'Thầy → tôn kính **いらっしゃいます**.' },
        { q: '{私|わたし}は{明日|あした}{一日中|いちにちじゅう}{家|いえ}に（　）。', options: ['いらっしゃいます', 'おります'], correct: 1, why: 'Mình → khiêm nhường **おります**.' },
        { q: 'お{客様|きゃくさま}、どうぞ（　）ください。', options: ['{召|め}し{上|あ}がって', 'いただいて'], correct: 0, why: 'Khách ăn → **{召|め}し{上|あ}がって**ください.' },
        { q: 'では、（　）。', options: ['{召|め}し{上|あ}がります', 'いただきます'], correct: 1, why: 'Mình ăn → **いただきます**.' },
        { q: '{部長|ぶちょう}がこの{書類|しょるい}を（　）。', options: ['ご{覧|らん}になりました', '{拝見|はいけん}しました'], correct: 0, why: 'Trưởng ban xem → **ご{覧|らん}になりました**.' },
        { q: '{部長|ぶちょう}の{書類|しょるい}を（　）。', options: ['ご{覧|らん}になりました', '{拝見|はいけん}しました'], correct: 1, why: 'Mình xem đồ của trưởng ban → **{拝見|はいけん}しました**.' },
        { q: '{先生|せんせい}が{駅|えき}まで{送|おく}って（　）。', options: ['くださいました', 'いただきました'], correct: 0, why: 'Chủ ngữ {先生|せんせい}**が** → **くださいました**.' },
        { q: '{先生|せんせい}に{駅|えき}まで{送|おく}って（　）。', options: ['くださいました', 'いただきました'], correct: 1, why: '{先生|せんせい}**に** (mình là chủ ngữ ẩn) → **いただきました**.' },
        { q: '{社長|しゃちょう}はタクシーでお{帰|かえ}り（　）。', options: ['になりました', 'しました'], correct: 0, why: 'Giám đốc làm → **お～になりました**.' },
        { q: '{社長|しゃちょう}のかばんは{私|わたし}がお{持|も}ち（　）。', options: ['になります', 'します'], correct: 1, why: 'Mình làm cho giám đốc → **お～します**.' },
        { q: '{先生|せんせい}、ちょっと（　）たいことがあるんですが。', options: ['{伺|うかが}い', '{参|まい}り'], correct: 0, why: 'Muốn HỎI → **{伺|うかが}い**たい ({伺|うかが}う = khiêm nhường của {聞|き}く). {参|まい}る chỉ có nghĩa đi / đến.' },
        { q: '{来週|らいしゅう}、{出張|しゅっちょう}で{大阪|おおさか}へ（　）。 (nói với khách)', options: ['{伺|うかが}います', '{参|まい}ります'], correct: 1, why: 'Nơi đến không phải người → **{参|まい}ります**.' },
        { q: 'こちらが{会議室|かいぎしつ}（　）。', options: ['でございます', 'でいらっしゃいます'], correct: 0, why: 'Nơi chốn → **でございます**. (でいらっしゃいます chỉ cho người được tôn trọng.)' },
        { q: '{失礼|しつれい}ですが、{田村様|たむらさま}（　）か。', options: ['でございます', 'でいらっしゃいます'], correct: 1, why: 'Hỏi người khác (tôn kính) → **でいらっしゃいますか**.' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Khó: bẫy kinh điển + 文の組み立て' },
    {
      t: 'mcq',
      id: 'b24-lt4-bay',
      title: 'Câu nào ĐÚNG? (10 câu)',
      items: [
        { q: 'Chọn câu đúng.', options: ['{社長|しゃちょう}はもうお{帰|かえ}りになりました。', '{社長|しゃちょう}はもうお{帰|かえ}りしました。', '{社長|しゃちょう}はもう{帰|かえ}りになりました。', '{社長|しゃちょう}はもうお{帰|かえ}りにしました。'], correct: 0, why: 'Tôn kính đủ khuôn **お＋Vます＋になる**.' },
        { q: 'Chọn câu đúng.', options: ['{先生|せんせい}はいらっしゃります。', '{先生|せんせい}はいらっしゃいます。', '{先生|せんせい}はいらっしゃられます。', '{先生|せんせい}はおいでになられます。'], correct: 1, why: '**いらっしゃいます** (る → い); không chồng られる.' },
        { q: 'Chọn câu đúng.', options: ['{部長|ぶちょう}がお{見|み}になりました。', '{部長|ぶちょう}がご{覧|らん}になりました。', '{部長|ぶちょう}がご{覧|らん}になられました。', '{部長|ぶちょう}が{拝見|はいけん}されました。'], correct: 1, why: '**ご{覧|らん}になりました** — không お{見|み}, không chồng られる, không khiêm nhường cho người trên.' },
        { q: 'Chọn câu đúng.', options: ['こちらでお{待|ま}ってください。', 'こちらでお{待|ま}ちしてください。', 'こちらでお{待|ま}ちください。', 'こちらで{待|ま}ちください。'], correct: 2, why: '**お{待|ま}ちください**.' },
        { q: 'Chọn câu đúng.', options: ['{後|のち}ほどご{電話|でんわ}いたします。', '{後|のち}ほどお{電話|でんわ}いたします。', '{後|のち}ほどお{電話|でんわ}になります。', '{後|のち}ほどご{電話|でんわ}になります。'], correct: 1, why: '**お{電話|でんわ}** (ngoại lệ đi với お) + いたします (mình làm).' },
        { q: '(nói với khách) Chọn câu đúng.', options: ['{森課長|もりかちょう}はいらっしゃいません。', '{森|もり}はおりません。', '{森課長|もりかちょう}さんはおりません。', '{森様|もりさま}はいらっしゃいません。'], correct: 1, why: 'うち・そと: **{森|もり}はおりません**.' },
        { q: 'Chọn câu đúng.', options: ['{私|わたし}はベトナムからいらっしゃいました。', '{私|わたし}はベトナムから{参|まい}りました。', '{私|わたし}はベトナムからおいでになりました。', '{私|わたし}はベトナムから{来|こ}られました。'], correct: 1, why: 'Mình đến → **{参|まい}りました**.' },
        { q: 'Chọn câu đúng.', options: ['{先生|せんせい}、どうぞ{拝見|はいけん}してください。', '{先生|せんせい}、どうぞご{覧|らん}ください。', '{先生|せんせい}、どうぞお{見|み}ください。', '{先生|せんせい}、どうぞご{覧|らん}してください。'], correct: 1, why: 'Mời xem → **ご{覧|らん}ください**.' },
        { q: 'Chọn câu đúng.', options: ['{明日|あした}{来|こ}られるかどうか、わかりません。', '{明日|あした}{来|こ}られますかどうか、わかりません。', '{明日|あした}{来|こ}られるかどうかか、わかりません。', '{明日|あした}いつ{来|こ}られるかどうか、わかりません。'], correct: 0, why: '普通形 ＋ かどうか; có いつ thì không dùng かどうか.' },
        { q: 'Chọn câu đúng.', options: ['{先生|せんせい}、お{荷物|にもつ}を{持|も}ってさしあげましょうか。', '{先生|せんせい}、お{荷物|にもつ}をお{持|も}ちしましょうか。', '{先生|せんせい}、お{荷物|にもつ}をお{持|も}ちになりましょうか。', '{先生|せんせい}、お{荷物|にもつ}を{持|も}たれましょうか。'], correct: 1, why: 'Đề nghị giúp người trên → **お{持|も}ちしましょうか** (～てさしあげる nghe như kể ơn).' },
      ],
    },
    {
      t: 'build',
      id: 'b24-lt4-ghep',
      title: '文の組み立て — ghép câu kính ngữ (6 câu)',
      items: [
        { vi: 'Thầy đã về nhà rồi ạ.', chips: ['{先生|せんせい}は', 'もう', 'お{宅|たく}に', 'お{帰|かえ}りに', 'なりました', '{参|まい}りました'], answer: ['{先生|せんせい}は', 'もう', 'お{宅|たく}に', 'お{帰|かえ}りに', 'なりました'], ro: 'Sensei wa mou otaku ni okaeri ni narimashita.' },
        { vi: 'Tôi đã được thầy cho cuốn sách này.', chips: ['この{本|ほん}は', '{先生|せんせい}に', 'いただきました', 'くださいました', '{先生|せんせい}が'], answer: ['この{本|ほん}は', '{先生|せんせい}に', 'いただきました'], ro: 'Kono hon wa sensei ni itadakimashita.' },
        { vi: 'Anh/chị biết công ty nào tốt không ạ?', chips: ['どの{会社|かいしゃ}が', 'いいか', 'ご{存|ぞん}じ', 'ですか', 'かどうか', '{存|ぞん}じて'], answer: ['どの{会社|かいしゃ}が', 'いいか', 'ご{存|ぞん}じ', 'ですか'], ro: 'Dono kaisha ga ii ka gozonji desu ka.' },
        { vi: 'Tôi xin phép giải thích ngắn gọn.', chips: ['{簡単|かんたん}に', 'ご{説明|せつめい}', 'いたします', 'なさいます', 'ください'], answer: ['{簡単|かんたん}に', 'ご{説明|せつめい}', 'いたします'], ro: 'Kantan ni gosetsumei itashimasu.' },
        { vi: '(với khách) Giám đốc Yamamoto của chúng tôi hiện đang đi công tác.', chips: ['{社長|しゃちょう}の', '{山本|やまもと}は', 'ただいま', '{出張|しゅっちょう}しております', '{山本社長|やまもとしゃちょう}は', 'いらっしゃいます'], answer: ['{社長|しゃちょう}の', '{山本|やまもと}は', 'ただいま', '{出張|しゅっちょう}しております'], ro: 'Shachou no Yamamoto wa tadaima shucchou shite orimasu.' },
        { vi: 'Hôm nay xin phép cho tôi về sớm.', chips: ['{本日|ほんじつ}は', '{早|はや}めに', '{帰|かえ}らせて', 'いただきます', '{帰|かえ}させて', 'くださいます'], answer: ['{本日|ほんじつ}は', '{早|はや}めに', '{帰|かえ}らせて', 'いただきます'], ro: 'Honjitsu wa hayame ni kaerasete itadakimasu.' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b24-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp kiểu JLPT N4 — 文字・語彙 · 文法 · 読解 (21 câu, có thang điểm)',
  goal: 'Làm một đề nhỏ trong 25 phút như đề thật: 8 câu từ vựng – chữ Hán, 10 câu ngữ pháp (kính ngữ, ～か, ～かどうか), 1 bài đọc email kính ngữ với 3 câu hỏi; tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'table',
      caption: 'Thang điểm & "sai câu nào ôn mục nào"',
      head: ['Phần', 'Số câu', 'Điểm / câu', 'Sai thì ôn'],
      rows: [
        ['① 文字・語彙', '8', '3', 'Từ vựng (bảng từ dễ nhầm) · Chữ Hán (bảng chữ trông giống)'],
        ['② 文法', '10', '5', 'Ngữ pháp ① (ai làm) · ③ ⑦ (động từ đặc biệt) · ② ⑥ (お～になる／お～する) · ⑨ ⑩'],
        ['③ 読解', '3', '8', 'Đọc hiểu Bài 1 (email kính ngữ) · chiến thuật "お～ください = việc của người đọc"'],
        ['Tổng', '21', '100', '≥ 80: sang Bài 25 · 60–79: làm lại Luyện thêm 3–4 · < 60: học lại 3 buổi'],
      ],
    },
    { t: 'h', text: '① 文字・語彙' },
    {
      t: 'mcq',
      id: 'b24-lt5-tu',
      title: '文字・語彙 (8 câu)',
      items: [
        { q: '{来週|らいしゅう}、**訪問**する{会社|かいしゃ}は{東京|とうきょう}にあります。', options: ['ぼうもん', 'ほうもん', 'ほもん', 'ほうぶん'], correct: 1, why: '**{訪問|ほうもん}** (houmon).' },
        { q: '**課長**に{資料|しりょう}を{渡|わた}しました。', options: ['かちょう', 'かいちょう', 'がちょう', 'かっちょう'], correct: 0, why: '**{課長|かちょう}** (kachou).' },
        { q: '{友達|ともだち}を**しょうかい**します。', options: ['招介', '紹介', '紹今', '召会'], correct: 1, why: '**紹介** — 紹 (糸) + 介.' },
        { q: '{先生|せんせい}に**そうだん**しました。', options: ['相談', '相淡', '想談', '送談'], correct: 0, why: '**相談**.' },
        { q: '{森|もり}はただいま（　）しております。{夕方|ゆうがた}{戻|もど}ります。', options: ['{外出|がいしゅつ}', '{訪問|ほうもん}', '{遠慮|えんりょ}', '{尊敬|そんけい}'], correct: 0, why: '**{外出|がいしゅつ}** (ra ngoài, trong ngày về).' },
        { q: '「{後|のち}ほどお{電話|でんわ}します」と{意味|いみ}が{近|ちか}いのは？', options: ['さっき{電話|でんわ}しました', 'あとで{電話|でんわ}します', 'すぐ{電話|でんわ}してください', '{電話|でんわ}しません'], correct: 1, why: '**{後|のち}ほど** = あとで.' },
        { q: '「{結構|けっこう}です」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['A「お{茶|ちゃ}、もう{一杯|いっぱい}いかがですか。」B「いいえ、{結構|けっこう}です。」', '{結構|けっこう}ですから、{早|はや}く{来|き}てください。', '{私|わたし}は{結構|けっこう}です{学生|がくせい}です。', '{先生|せんせい}は{結構|けっこう}ですか。'], correct: 0, why: '**いいえ、{結構|けっこう}です** = từ chối lịch sự.' },
        { q: '「どちら{様|さま}ですか」と{意味|いみ}が{近|ちか}いのは？', options: ['どこですか', 'だれですか', 'どれですか', 'いつですか'], correct: 1, why: '**どちら{様|さま}** = だれ (lịch sự nhất).' },
      ],
    },
    { t: 'h', text: '② 文法' },
    {
      t: 'mcq',
      id: 'b24-lt5-np',
      title: '文法 (10 câu)',
      items: [
        { q: '{先生|せんせい}は{何|なん}と（　）か。', options: ['{申|もう}しました', 'おっしゃいました', 'お{言|い}いしました', '{言|い}わせました'], correct: 1, why: 'Thầy nói → **おっしゃいました**.' },
        { q: 'はじめまして。キムと（　）。', options: ['おっしゃいます', '{申|もう}します', 'いらっしゃいます', 'でございます'], correct: 1, why: 'Tự giới thiệu → **{申|もう}します**.' },
        { q: '{部長|ぶちょう}はもう（　）か。', options: ['お{帰|かえ}りしました', 'お{帰|かえ}りになりました', '{帰|かえ}らせていただきました', '{参|まい}りました'], correct: 1, why: 'Trưởng ban → **お{帰|かえ}りになりました**.' },
        { q: '{重|おも}そうですね。お{手伝|てつだ}い（　）。', options: ['しましょうか', 'になりましょうか', 'ください', 'なさいましょうか'], correct: 0, why: 'Mình đề nghị giúp → **お{手伝|てつだ}いしましょうか**.' },
        { q: 'お{客様|きゃくさま}、こちらでお{待|ま}ち（　）。', options: ['します', 'いたします', 'ください', 'になります'], correct: 2, why: 'Mời khách → **お～ください**.' },
        { q: '{先生|せんせい}が{日本|にほん}のお{菓子|かし}を（　）。', options: ['いただきました', 'くださいました', '{差|さ}し{上|あ}げました', 'もらいました'], correct: 1, why: 'Chủ ngữ {先生|せんせい}**が** cho mình → **くださいました**.' },
        { q: '（お{客様|きゃくさま}に）「{課長|かちょう}の{森|もり}は、ただいま（　）。」', options: ['{会議中|かいぎちゅう}でいらっしゃいます', '{会議中|かいぎちゅう}でございます', '{会議|かいぎ}をなさっています', '{会議|かいぎ}にいらっしゃいます'], correct: 1, why: 'うち・そと → **{会議中|かいぎちゅう}でございます**.' },
        { q: '{明日|あした}の{会議|かいぎ}が{何時|なんじ}に{始|はじ}まる（　）、ご{存|ぞん}じですか。', options: ['か', 'かどうか', 'ことを', 'のを'], correct: 0, why: 'Có {何時|なんじ} → **か**.' },
        { q: '{山田|やまだ}さんがパーティーに{来|く}る（　）、{聞|き}いてみます。', options: ['か', 'かどうか', 'ことか', 'だか'], correct: 1, why: 'Không có từ để hỏi → **かどうか**.' },
        { q: '★ {資料|しりょう}は ＿＿ ＿＿ ★ ＿＿ いたします。（メールで／{後|のち}ほど／お{送|おく}り／{皆様|みなさま}に）', options: ['メールで', '{後|のち}ほど', 'お{送|おく}り', '{皆様|みなさま}に'], correct: 0, why: 'Câu đúng: {資料|しりょう}は **{後|のち}ほど {皆様|みなさま}に メールで お{送|おく}り** いたします. Ô ★ (thứ 3) = **メールで**.' },
      ],
    },
    { t: 'h', text: '③ 読解' },
    {
      t: 'passage',
      title: '{件名|けんめい}：{面接|めんせつ}の{日|ひ}について（ひかり{電気|でんき} {人事部|じんじぶ}）',
      intro: 'Email gửi cho カルロス. Đọc rồi trả lời 3 câu hỏi.',
      paras: [
        { text: 'カルロス{様|さま}　ひかり{電気|でんき}{人事部|じんじぶ}の{山田|やまだ}でございます。{先日|せんじつ}は{説明会|せつめいかい}にご{参加|さんか}いただき、ありがとうございました。' },
        { text: '{面接|めんせつ}は、{来週|らいしゅう}の{水曜日|すいようび}か{金曜日|きんようび}の{午後|ごご}に{行|おこな}います。ご{都合|つごう}のよろしい{日|ひ}を、{今週|こんしゅう}の{金曜日|きんようび}までにメールでお{知|し}らせください。{当日|とうじつ}は、{履歴書|りれきしょ}をお{持|も}ちください。{会社|かいしゃ}の{地図|ちず}は、{後|のち}ほどお{送|おく}りいたします。' },
        { text: 'なお、{面接|めんせつ}に{来|こ}られるかどうか{決|き}まっていない{場合|ばあい}も、{一度|いちど}ご{連絡|れんらく}ください。よろしくお{願|ねが}いいたします。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b24-lt5-doc',
      title: '読解 (3 câu)',
      items: [
        { q: 'カルロスさんは{今週|こんしゅう}の{金曜日|きんようび}までに{何|なに}をしなければなりませんか。', options: ['{履歴書|りれきしょ}を{送|おく}る', '{面接|めんせつ}に{行|い}く', '{都合|つごう}のいい{日|ひ}をメールで{知|し}らせる', '{地図|ちず}を{送|おく}る'], correct: 2, why: '**ご{都合|つごう}のよろしい{日|ひ}を、{今週|こんしゅう}の{金曜日|きんようび}までにメールでお{知|し}らせください** — お～ください = việc người đọc làm. Hồ sơ: mang vào **ngày phỏng vấn**; bản đồ: **công ty** gửi (お{送|おく}りいたします).' },
        { q: '{地図|ちず}を{送|おく}るのは{誰|だれ}ですか。', options: ['カルロスさん', '{山田|やまだ}さん（{会社|かいしゃ}）', 'カルロスさんの{先生|せんせい}', '{説明会|せつめいかい}の{係|かかり}の{人|ひと}'], correct: 1, why: '**お{送|おく}りいたします** = khiêm nhường ⇒ người viết (anh 山田 — công ty) gửi.' },
        { q: 'まだ{面接|めんせつ}に{行|い}けるかどうかわからない{場合|ばあい}、どうしますか。', options: ['{連絡|れんらく}しなくてもいい', '{一度|いちど}{連絡|れんらく}する', '{金曜日|きんようび}に{会社|かいしゃ}へ{行|い}く', '{説明会|せつめいかい}にもう{一度|いちど}{参加|さんか}する'], correct: 1, why: '**{来|こ}られるかどうか{決|き}まっていない{場合|ばあい}も、{一度|いちど}ご{連絡|れんらく}ください**. {場合|ばあい} = trường hợp (N3).' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('ご{都合|つごう}のよろしい{日|ひ}をお{知|し}らせください。', 'Gotsugou no yoroshii hi o oshirase kudasai.', 'Xin vui lòng báo ngày thuận tiện cho anh/chị. (お～ください — việc của người đọc)'),
        E('{地図|ちず}は{後|のち}ほどお{送|おく}りいたします。', 'Chizu wa nochihodo ookuri itashimasu.', 'Bản đồ chúng tôi sẽ gửi sau. (お～いたす — việc của người viết)'),
        E('{面接|めんせつ}に{来|こ}られるかどうか{決|き}まっていない{場合|ばあい}も、ご{連絡|れんらく}ください。', 'Mensetsu ni korareru ka dou ka kimatte inai baai mo, gorenraku kudasai.', 'Kể cả khi chưa quyết được có đến phỏng vấn hay không, xin cũng liên lạc. (～かどうか)'),
        E('{説明会|せつめいかい}にご{参加|さんか}いただき、ありがとうございました。', 'Setsumeikai ni gosanka itadaki, arigatou gozaimashita.', 'Cảm ơn anh/chị đã tham gia buổi giới thiệu. (ご～いただく — nhận ra)'),
      ],
    },
  ],
};

export const BAI_24: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
