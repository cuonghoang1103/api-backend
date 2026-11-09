/**
 * Bài 23 — 子どもの頃 (Thời thơ ấu) · TIẾP SAU SÁCH, cấp N4 (xem ../SOAN-BAI.md mục 8). Bài thứ ba của chặng 21–25
 * (Bài 25 = thi thử N4).
 * Người học đã xong Bài 1–15 (ポイント 1–124 — trong đó ～てもいいですか xin phép, ～なければならない, ～てはいけません), Bài 16
 * (thể khả năng, thể ý chí, ～つもり, ～予定), Bài 17 (～ば, ～なら, ～し, ～すぎる, ～やすい・にくい), Bài 18 (～てあげる・くれる・もらう,
 * ～ておく, ～てある), Bài 19 (～てしまう, ～てみる, ～ところ, ～のに), Bài 20 (～そう, ～ようだ・みたい, ～らしい, ～かもしれない,
 * ～はず), Bài 21 (～ために, ～ように, ～ようになる・する, ～ことにする・なる) và Bài 22 (thể bị động 受身形 — 先生に褒められる,
 * 雨に降られる, ～ばかり). KHÔNG dạy lại — chỉ dùng lại trong câu (ghi "ôn: Bài X").
 *
 * Ngữ pháp (N4) — nhóm "bắt / cho làm · xin được làm · ra lệnh · nói lại lời dặn": ① cách chia THỂ SAI KHIẾN (使役形) đủ 3 nhóm
 * + bẫy (言う → 言わせる, 待つ → 待たせる, 話す → 話させる, 帰る → 帰らせる, 来る → 来させる; 知らせる・見せる・寝かせる là từ
 * riêng) · ② sai khiến "BẮT làm": A は B を V(さ)せる (tự động từ) · A は B に N を V(さ)せる (tha động từ) — luật を／に ·
 * ③ sai khiến "CHO / ĐỂ làm" + gây cảm xúc (心配させる・待たせる・笑わせる) + ～させてくれる／～させてもらう (ôn Bài 18) ·
 * ④ ～させてください · ～させてもらえませんか · ～させていただけませんか (xin phép được làm) + BẢNG so với ～てもいいですか ·
 * ⑤ THỂ MỆNH LỆNH (命令形) đủ 3 nhóm + bẫy (くれる → くれ, 来る → 来い, する → しろ; trùng hình với thể khả năng ở nhóm 1) ·
 * ⑥ CẤM: V辞書形 ＋ な (行くな, 触るな) — bẫy 食べるな ↔ 食べな ↔ いいなあ · ⑦ Vます ＋ なさい · BẢNG mức độ ra lệnh ·
 * ⑧ NÓI LẠI lời dặn: ～ように言う・頼む・注意する・伝える／～ように言われる (bị động — Bài 22) + BẢNG trích trực tiếp ↔ gián tiếp ·
 * ⑨ (giới thiệu — N3, chỉ cần NHẬN RA) thể SAI KHIẾN BỊ ĐỘNG 使役受身 ～させられる／～される (bị bắt làm).
 * Từ vựng: 49 từ N4 (một số N3 có ghi cấp): thời thơ ấu & gia đình, việc nhà & việc của trẻ, trẻ nghịch & dạy dỗ, mệnh lệnh –
 * cho phép – thể thao, chỗ làm & xin phép. Từ đã học ở Bài 1–22 (両親, 子ども, 手伝う, 片付ける, 宿題, 掃除する, 洗濯する, 通う,
 * 散歩する, ペット, えさ, 留守, 許す, 拾う, 謝る, 泣く, 怒る, しかる, 褒める, 飼う, 注意する, 上司 (Bài 22), 自由, 思い出, 昔, 田舎, 先輩・後輩, 練習, 試合,
 * 勝つ・負ける, 頼む, 伝える, 発表する, 我慢する, 規則…) KHÔNG lặp lại — gặp trong câu thì coi như ôn.
 * Chữ Hán mới (15): 頃 幼 供 命 令 許 可 飼 拾 投 逃 片 厳 虫 反 (N3 theo các bảng tham khảo phổ biến; 虫 có bảng xếp N4, 厳・飼
 * có bảng xếp N2 — JLPT không công bố danh sách chữ chính thức) — không trùng hanTu.ts, hanTu16–22.ts, hanLop.ts, bảng chữ
 * Bài 1–22. Thẻ chữ Hán: hanTu23.ts (HAN_TU_23).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木 ·
 * nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, 小林店長.
 * {小林店長|こばやしてんちょう} (nam, role 'examiner' / ja-nam) — chủ quán ひまわり{食堂|しょくどう} nơi ナタポン làm thêm (Bài 16).
 * {本田先生|ほんだせんせい} (nam, role 'examiner' / ja-nam) — giáo viên tiếng Nhật của lớp.
 * Nối tiếp các bài trước: ナタポン sắp học lên cao học, món cà ri Thái vào thực đơn (Bài 21); カルロス chơi bóng đá (Bài 6).
 * Người MỚI của bài này (không tên riêng / tên trẻ em):
 *  - さくら (bé gái 9 tuổi trong lớp bóng đá thiếu nhi của カルロス, hội thoại ②) — nữ, role 'c' / ja-nu.
 *  - {部長|ぶちょう} (nghe Bài 1) — nam, ja-nam · {幼稚園|ようちえん}の{先生|せんせい} (nghe Bài 2) — nữ, ja-nu · ゆうとくんのお{父|とう}さん
 *    (nghe Bài 2) — nam, ja-nam · {警備員|けいびいん} (nghe Bài 6) — nam, ja-nam.
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
  id: 'b23-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 子どもの頃: ảnh thời thơ ấu, lớp bóng đá thiếu nhi của カルロス, xin phép ở quán ひまわり食堂',
  goal: 'Kể bố mẹ đã BẮT mình làm gì và CHO mình làm gì hồi nhỏ bằng thể sai khiến (ピアノを練習させた・外で遊ばせてくれた・犬を飼わせてもらえなかった) và nhận ra câu "bị bắt" ～させられた; nghe và dùng đúng chỗ thể mệnh lệnh (走れ！止まるな！頑張れ！) và ～なさい; xin phép được làm một việc bằng ～させてください／～させてもらえませんか／～させていただけませんか; nói lại lời dặn của người khác bằng ～ように言う・伝える／～ように言われている — khi xem ảnh cũ, khi ở sân bóng và khi đi làm thêm.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 23 — chủ đề: thời thơ ấu, bắt — cho — xin — ra lệnh (cấp N4, bài thứ ba của chặng 21–25)',
      items: [
        'Nhớ lại **hồi nhỏ**: bố mẹ **bắt** mình học piano, **không cho** chơi game, **cho** nuôi chó; thầy cô bảo "**{早|はや}く{寝|ね}なさい！**", huấn luyện viên hét "**{走|はし}れ！**". Để kể những chuyện đó, tiếng Nhật có một bộ thể riêng: **thể sai khiến** ～させる (bắt / cho ai làm), **thể mệnh lệnh** {走|はし}れ・{食|た}べろ・しろ・{来|こ}い, **cấm** ～な, **～なさい**, và cách **nói lại lời dặn** ～ように{言|い}う.',
        'Mẫu N4 của bài: **thể sai khiến** (bảng chia 3 nhóm) · **A は B を／に V(さ)せる** (bắt / cho làm) · **～させてくれる／～させてもらう** (được cho làm) · **～させてください／～させてもらえませんか／～させていただけませんか** (xin được làm) · **thể mệnh lệnh** · **V{辞書形|じしょけい}＋な** (cấm) · **Vます＋なさい** · **～ように{言|い}う／～ように{言|い}われる**. Thêm một mẫu N3 chỉ cần **nhận ra**: **～させられる** (bị bắt làm).',
        'Ba tình huống: ① マリヤム xem ảnh hồi nhỏ mẹ gửi sang, kể với ダニエル — một nhà nghiêm, một nhà thoải mái · ② カルロス dạy lớp bóng đá thiếu nhi ở công viên, パク đứng xem — tiếng hô "{走|はし}れ！{止|と}まるな！" · ③ ở quán ひまわり{食堂|しょくどう}: ナタポン xin anh 小林 cho về sớm, rồi kèm bạn mới リン — "店長が…ようにって{言|い}っていたよ".',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 23 bạn làm được (できる)',
      items: [
        '**① {子|こ}どもの{頃|ころ}** — kể bố mẹ bắt / cho mình làm gì: **{母|はは}は{毎日|まいにち}ピアノを{練習|れんしゅう}させました** · **{両親|りょうしん}は{外|そと}で{自由|じゆう}に{遊|あそ}ばせてくれました** · **{犬|いぬ}を{飼|か}わせてもらえませんでした**; nhận ra câu than "bị bắt": **{皿洗|さらあら}いをさせられた**.',
        '**② サッカー{教室|きょうしつ}** — hiểu và dùng đúng chỗ mệnh lệnh: **{走|はし}れ！{止|と}まるな！ボールをよく{見|み}ろ！{頑張|がんば}れ！**; câu của bố mẹ, thầy cô: **{暗|くら}くなる{前|まえ}に{帰|かえ}りなさい** — và biết vì sao **người học nước ngoài gần như không nên tự dùng** thể mệnh lệnh với người khác.',
        '**③ ひまわり{食堂|しょくどう}** — xin phép lịch sự: **{金曜日|きんようび}、5{時|じ}に{帰|かえ}らせていただけませんか** · **{僕|ぼく}にやらせてください** · **お{皿洗|さらあら}いをやらせてもらえませんか**; nói lại lời dặn: **{店長|てんちょう}が、10{時|じ}に{来|く}るように{言|い}っていました** · **{手|て}を{洗|あら}うように{言|い}われています**.',
        '**できる！** — nói 1 phút "Hồi nhỏ của tôi": bố mẹ thế nào (nghiêm / thoải mái), đã bắt mình làm gì (～させました), cho mình làm gì (～させてくれました), hay dặn gì (～ように{言|い}われました), và sau này mình muốn cho con làm gì (～させたいです).',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — muốn nói gì, dùng mẫu nào',
      head: ['Bạn muốn nói…', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['Ai đó BẮT người khác làm (tự động từ)', '{先生|せんせい}は{学生|がくせい}を{立|た}たせました。', 'Sensei wa gakusei o tatasemashita.', 'A は B を V(さ)せる'],
        ['Ai đó BẮT người khác làm việc có tân ngữ', '{母|はは}は{弟|おとうと}に{野菜|やさい}を{食|た}べさせました。', 'Haha wa otouto ni yasai o tabesasemashita.', 'A は B に N を V(さ)せる'],
        ['Được (bố mẹ…) CHO làm — biết ơn', '{父|ちち}は{私|わたし}を{留学|りゅうがく}させてくれました。', 'Chichi wa watashi o ryuugaku sasete kuremashita.', '～させてくれる'],
        ['Làm ai đó lo, chờ, cười…', 'お{待|ま}たせしました。／{親|おや}を{心配|しんぱい}させた。', 'Omatase shimashita. / Oya o shinpai saseta.', 'B を V(さ)せる (cảm xúc)'],
        ['XIN được (mình) làm', '{明日|あした}、{休|やす}ませていただけませんか。', 'Ashita, yasumasete itadakemasen ka.', '～させてください／もらえませんか／いただけませんか'],
        ['Ra lệnh mạnh (huấn luyện viên, lúc nguy hiểm, biển báo)', '{走|はし}れ！ {逃|に}げろ！ {止|と}まれ', 'Hashire! Nigero! Tomare', 'thể mệnh lệnh'],
        ['Cấm mạnh', '{触|さわ}るな！', 'Sawaru na!', 'V{辞書形|じしょけい} ＋ な'],
        ['Bố mẹ, thầy cô bảo trẻ', '{早|はや}く{寝|ね}なさい。', 'Hayaku nenasai.', 'Vます ＋ なさい'],
        ['Nói lại lời dặn của người khác', '{先生|せんせい}に{毎日|まいにち}{復習|ふくしゅう}するように{言|い}われました。', 'Sensei ni mainichi fukushuu suru you ni iwaremashita.', '～ように{言|い}う／{言|い}われる'],
        ['Bị bắt làm (than phiền) — chỉ cần nhận ra', '{子|こ}どもの{頃|ころ}、{野菜|やさい}を{食|た}べさせられました。', 'Kodomo no koro, yasai o tabesaseraremashita.', '～させられる (N3)'],
      ],
    },

    /* ── ① 子どもの頃の写真 ── */
    { t: 'h', text: '① {子|こ}どもの{頃|ころ}の{写真|しゃしん} — "Mẹ mình bắt tập piano mỗi ngày"' },
    {
      t: 'canh',
      anh: ['framed-picture', 'musical-keyboard', 'dog', 'girl', 'boy'],
      caption: 'Tối Chủ nhật ở phòng sinh hoạt chung của ký túc xá. マリヤム vừa nhận thùng đồ mẹ gửi sang — trong đó có cả một tập ảnh hồi nhỏ. ダニエル đi ngang qua, thấy cô đang cười một mình.',
    },
    {
      t: 'p',
      text: 'Tình huống: mẹ **マリヤム** rất **{厳|きび}しい** (nghiêm): **bắt** cô tập piano mỗi ngày, **cho đi** học thêm ({塾|じゅく}) — câu **A は B に N を V(さ)せる** / **B を V(さ)せる**. Bố mẹ **ダニエル** thì ngược lại: **{外|そと}で{自由|じゆう}に{遊|あそ}ばせてくれた** (cho chơi ngoài trời thoả thích — **～させてくれる** = được cho làm, có ý biết ơn). Hai người cũng kể chuyện **không được cho**: **{見|み}させてくれなかった**, **{飼|か}わせてもらえなかった**. Có một câu "than" của ダニエル: **{皿洗|さらあら}いをさせられた** — "bị bắt rửa bát" (**～させられる** — mẫu ⑨, chỉ cần hiểu).',
    },
    DL('Ở phòng sinh hoạt chung — "Cái này là cậu à?"', [
      ['ダニエル', 'b', 'マリヤムさん、{何|なに}を{見|み}ているの？{楽|たの}しそうだね。', 'Mariyamu-san, nani o mite iru no? Tanoshisou da ne.', 'Mariam, cậu đang xem gì thế? Trông vui nhỉ.'],
      ['マリヤム', 'a', '{母|はは}が{送|おく}ってくれた{写真|しゃしん}。{子|こ}どもの{頃|ころ}の{写真|しゃしん}なの。{懐|なつ}かしいなあ。', 'Haha ga okutte kureta shashin. Kodomo no koro no shashin na no. Natsukashii naa.', 'Ảnh mẹ mình gửi sang. Ảnh hồi nhỏ đấy. Nhớ quá đi.'],
      ['ダニエル', 'b', 'わあ、かわいい！このピアノを{弾|ひ}いている{女|おんな}の{子|こ}、マリヤムさん？', 'Waa, kawaii! Kono piano o hiite iru onna no ko, Mariyamu-san?', 'Ôi, đáng yêu quá! Cô bé đang chơi piano này là cậu à?'],
      ['マリヤム', 'a', 'うん、{六歳|ろくさい}の{頃|ころ}。{母|はは}は{厳|きび}しくて、{毎日|まいにち}{一時間|いちじかん}ピアノを{練習|れんしゅう}させたの。それに、{週|しゅう}に{三回|さんかい}{塾|じゅく}にも{行|い}かせたんだよ。', 'Un, rokusai no koro. Haha wa kibishikute, mainichi ichijikan piano o renshuu saseta no. Sore ni, shuu ni sankai juku ni mo ikaseta n da yo.', 'Ừ, hồi sáu tuổi. Mẹ mình nghiêm lắm, bắt mình tập piano mỗi ngày một tiếng. Lại còn cho đi học thêm ở trung tâm mỗi tuần ba buổi nữa.'],
      ['ダニエル', 'b', '{大変|たいへん}だったね。{遊|あそ}ぶ{時間|じかん}はあったの？', 'Taihen datta ne. Asobu jikan wa atta no?', 'Vất vả nhỉ. Thế cậu có thời gian chơi không?'],
      ['マリヤム', 'a', 'あまりなかった。テレビも{一日|いちにち}30{分|ぷん}しか{見|み}させてくれなかったし、ゲームは{全然|ぜんぜん}させてもらえなかったの。', 'Amari nakatta. Terebi mo ichinichi sanjuppun shika misasete kurenakatta shi, geemu wa zenzen sasete moraenakatta no.', 'Không nhiều lắm. Ti vi thì mẹ chỉ cho xem 30 phút một ngày, còn game thì mình hoàn toàn không được chơi.'],
      ['ダニエル', 'b', 'へえ。{僕|ぼく}の{両親|りょうしん}は{全然|ぜんぜん}{違|ちが}ったよ。{暗|くら}くなるまで、{外|そと}で{自由|じゆう}に{遊|あそ}ばせてくれたんだ。', 'Hee. Boku no ryoushin wa zenzen chigatta yo. Kuraku naru made, soto de jiyuu ni asobasete kureta n da.', 'Ồ. Bố mẹ mình thì khác hẳn. Cho mình chơi ngoài trời thoải mái đến tận lúc trời tối.'],
      ['マリヤム', 'a', 'いいなあ。じゃ、お{手伝|てつだ}いは{何|なに}もしなかったの？', 'Ii naa. Ja, otetsudai wa nani mo shinakatta no?', 'Thích thế. Vậy cậu không phải giúp việc nhà gì à?'],
      ['ダニエル', 'b', 'ううん、{毎晩|まいばん}{皿洗|さらあら}いをさせられたよ。それに、うちは{犬|いぬ}を{飼|か}っていたから、{散歩|さんぽ}と{世話|せわ}は{僕|ぼく}の{仕事|しごと}だったんだ。', 'Uun, maiban saraarai o saserareta yo. Sore ni, uchi wa inu o katte ita kara, sanpo to sewa wa boku no shigoto datta n da.', 'Không đâu, tối nào mình cũng bị bắt rửa bát. Với lại nhà mình nuôi chó, nên dắt đi dạo và chăm nó là việc của mình.'],
      ['マリヤム', 'a', '{犬|いぬ}！{私|わたし}もずっと{飼|か}いたかったけど、{母|はは}に「ちゃんと{世話|せわ}ができないでしょう」と{言|い}われて、{飼|か}わせてもらえなかったの。', 'Inu! Watashi mo zutto kaitakatta kedo, haha ni "Chanto sewa ga dekinai deshou" to iwarete, kawasete moraenakatta no.', 'Chó á! Mình cũng muốn nuôi từ lâu lắm, nhưng bị mẹ bảo "Con có chăm được tử tế đâu", nên không được nuôi.'],
      ['ダニエル', 'b', 'そうか。でも、ピアノは{今|いま}も{続|つづ}けているんでしょう？', 'Sou ka. Demo, piano wa ima mo tsuzukete iru n deshou?', 'Vậy à. Nhưng piano thì giờ cậu vẫn tiếp tục chơi đúng không?'],
      ['マリヤム', 'a', 'うん。{練習|れんしゅう}は{嫌|いや}だったけど、{今|いま}は{続|つづ}けてよかったと{思|おも}っている。{自分|じぶん}の{子|こ}どもにも、ピアノを{習|なら}わせたいな。', 'Un. Renshuu wa iya datta kedo, ima wa tsuzukete yokatta to omotte iru. Jibun no kodomo ni mo, piano o narawasetai na.', 'Ừ. Hồi đó ghét tập lắm, nhưng giờ mình nghĩ may mà đã theo tiếp. Sau này mình cũng muốn cho con mình học piano.'],
      ['ダニエル', 'b', '{僕|ぼく}は{子|こ}どもが{生|う}まれたら、{好|す}きなことを{自由|じゆう}にさせたいな。……でも、{皿洗|さらあら}いはさせるよ。', 'Boku wa kodomo ga umaretara, suki na koto o jiyuu ni sasetai na. …… Demo, saraarai wa saseru yo.', 'Mình thì khi có con, mình muốn cho nó tự do làm điều nó thích. … Nhưng rửa bát thì vẫn bắt làm đấy.'],
      ['マリヤム', 'a', 'ふふ、ダニエルさんのお{母|かあ}さんと{同|おな}じだね。', 'Fufu, Danieru-san no okaasan to onaji da ne.', 'Hì hì, giống y mẹ cậu nhỉ.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{母|はは}は{毎日|まいにち}{一時間|いちじかん}ピアノを{練習|れんしゅう}させました。', 'Haha wa mainichi ichijikan piano o renshuu sasemashita.', 'Mẹ tôi bắt tập piano mỗi ngày một tiếng.'),
        E('{母|はは}は{私|わたし}を{週|しゅう}に{三回|さんかい}{塾|じゅく}に{行|い}かせました。', 'Haha wa watashi o shuu ni sankai juku ni ikasemashita.', 'Mẹ cho (bắt) tôi đi học thêm mỗi tuần ba buổi.'),
        E('{両親|りょうしん}は{外|そと}で{自由|じゆう}に{遊|あそ}ばせてくれました。', 'Ryoushin wa soto de jiyuu ni asobasete kuremashita.', 'Bố mẹ cho tôi chơi ngoài trời thoải mái. (biết ơn)'),
        E('テレビは{一日|いちにち}30{分|ぷん}しか{見|み}させてくれませんでした。', 'Terebi wa ichinichi sanjuppun shika misasete kuremasen deshita.', 'Ti vi thì (mẹ) chỉ cho xem 30 phút một ngày.'),
        E('{犬|いぬ}を{飼|か}わせてもらえませんでした。', 'Inu o kawasete moraemasen deshita.', 'Tôi đã không được (bố mẹ) cho nuôi chó.'),
        E('{子|こ}どもにピアノを{習|なら}わせたいです。', 'Kodomo ni piano o narawasetai desu.', 'Tôi muốn cho con học piano.'),
        E('{毎晩|まいばん}{皿洗|さらあら}いをさせられました。', 'Maiban saraarai o saseraremashita.', 'Tối nào tôi cũng bị bắt rửa bát. (～させられる — chỉ cần hiểu)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**{練習|れんしゅう}させた／{行|い}かせた** — **thể sai khiến** (使役形): {練習|れんしゅう}する → {練習|れんしゅう}**させる**, {行|い}く → {行|い}**かせる**. Người ra lệnh / cho phép đứng làm chủ ngữ ({母|はは}は), người phải làm đi với **を** hoặc **に**: **{私|わたし}を{塾|じゅく}に{行|い}かせた** (行く không có tân ngữ → người làm đi với を); **{私|わたし}にピアノを{練習|れんしゅう}させた** (đã có "ピアノを" → người làm đi với に, không dùng hai を).',
        '**{遊|あそ}ばせてくれた／{見|み}させてくれなかった** — **V(さ)せて ＋ くれる** (ôn Bài 18) = "**(ai đó) cho mình** làm" — giọng **biết ơn**. Phủ định ～させてくれなかった = không cho mình làm. Khác hẳn ～させた (bắt): cùng một thể sai khiến, **くれる** quyết định nghĩa là "**cho phép**".',
        '**{飼|か}わせてもらえなかった／させてもらえなかった** — **V(さ)せて ＋ もらう** = "**được** (ai) cho làm"; thêm thể khả năng もらえる (Bài 16) → もらえなかった = **không được cho** làm. Câu người Nhật rất hay dùng khi kể hồi nhỏ: ゲームをさせてもらえなかった (không được cho chơi game).',
        '**{皿洗|さらあら}いをさせられた** — **thể sai khiến bị động** ～させられる (= sai khiến + bị động Bài 22): "**bị bắt** làm" — người nói **không muốn** mà vẫn phải làm. Cấp **N3** — Bài 23 chỉ cần **nghe ra**: thấy **させられ** hoặc ～**かされ**／～**まされ** là "bị bắt".',
        '**{習|なら}わせたい／{自由|じゆう}にさせたい** — thể sai khiến chia như **động từ nhóm 2**, nên ghép được với **～たい**: {習|なら}わせ**たい** (muốn cho học), させ**たい**. ⚠ Nói về con của **mình**; nói với cấp trên về việc bắt người khác làm thì phải tránh (xem mẫu ③).',
        '**{懐|なつ}かしい** (nhớ, bồi hồi — với thứ của quá khứ) · **{弾|ひ}く** (chơi đàn — ôn Bài 7) · **{厳|きび}しくて** (thể て của tính từ — ôn ポイント 75) · **{世話|せわ}** (việc chăm sóc) · **「～」と{言|い}われて** (bị nói là — bị động, ôn Bài 22) · **{続|つづ}けてよかった** (may mà đã tiếp tục — ～てよかった).',
      ],
    },

    /* ── ② サッカー教室 ── */
    { t: 'h', text: '② サッカー{教室|きょうしつ} — "Chạy đi! Đừng dừng lại!"' },
    {
      t: 'canh',
      anh: ['soccer-ball', 'goal-net', 'girl', 'man-running', 'woman-student'],
      caption: 'Chiều thứ Bảy ở công viên gần trường. カルロス làm huấn luyện viên tình nguyện cho một lớp bóng đá thiếu nhi. パク tới xem, ngồi ở băng ghế cạnh sân. Cô bé さくら (9 tuổi) giơ tay xin bắt gôn.',
    },
    {
      t: 'p',
      text: 'Tình huống: trên sân bóng, huấn luyện viên Nhật hô **thể mệnh lệnh** — ngắn, mạnh, không kính ngữ: **{集|あつ}まれ！** (tập trung!), **{立|た}て！**, **よく{見|み}ろ！**, **シュートしろ！**, **{走|はし}れ！**, và **cấm** bằng **V{辞書形|じしょけい} ＋ な**: **{止|と}まるな！**, **{怖|こわ}がるな！**. Cô bé さくら **xin** bằng **～させてください**: **{私|わたし}にキーパーをやらせてください！** Lúc nghỉ, カルロス giải thích cho パク vì sao trên sân người ta nói vậy. Cuối cùng là câu của mẹ さくら mà cô bé thuật lại: **{暗|くら}くなる{前|まえ}に{帰|かえ}りなさい** (～なさい) — kiểu câu bố mẹ, thầy cô nói với trẻ.',
    },
    DL('Ở sân bóng công viên — "Cô bé muốn bắt gôn"', [
      ['カルロス', 'b', 'みんな、{集|あつ}まれ！{今日|きょう}はシュートの{練習|れんしゅう}をするぞ。', 'Minna, atsumare! Kyou wa shuuto no renshuu o suru zo.', 'Cả đội, tập trung! Hôm nay ta tập sút bóng.'],
      ['さくら', 'c', 'コーチ、{今日|きょう}は{私|わたし}にキーパーをやらせてください！', 'Koochi, kyou wa watashi ni kiipaa o yarasete kudasai!', 'Thầy ơi, hôm nay cho con bắt gôn với ạ!'],
      ['カルロス', 'b', 'よし、さくら、{頼|たの}むぞ。ゴールの{前|まえ}に{立|た}て！ボールをよく{見|み}ろ！', 'Yoshi, Sakura, tanomu zo. Gooru no mae ni tate! Booru o yoku miro!', 'Được, Sakura, trông vào con đấy. Đứng trước khung thành! Nhìn kỹ bóng!'],
      ['カルロス', 'b', 'ほかのみんなは、どんどんシュートしろ！……そう、いいぞ！{止|と}まるな、もっと{走|はし}れ！', 'Hoka no minna wa, dondon shuuto shiro! …… Sou, ii zo! Tomaru na, motto hashire!', 'Các bạn còn lại, sút liên tục vào! … Đúng rồi, tốt lắm! Đừng đứng lại, chạy nữa đi!'],
      ['さくら', 'c', 'コーチ、ボールが{速|はや}すぎて、{取|と}れません！', 'Koochi, booru ga hayasugite, toremasen!', 'Thầy ơi, bóng nhanh quá, con không bắt được!'],
      ['カルロス', 'b', '{怖|こわ}がるな！{手|て}を{前|まえ}に{出|だ}せ！……ナイス！よく{取|と}ったな！', 'Kowagaru na! Te o mae ni dase! …… Naisu! Yoku totta na!', 'Đừng sợ! Đưa tay ra phía trước! … Hay lắm! Bắt giỏi lắm!'],
      ['パク', 'a', 'カルロスさん、お{疲|つか}れさま。{大|おお}きい{声|こえ}で「{走|はし}れ！」「{止|と}まるな！」って{言|い}っていたね。ちょっとびっくりした。', 'Karurosu-san, otsukaresama. Ookii koe de "Hashire!" "Tomaru na!" tte itte ita ne. Chotto bikkuri shita.', 'Carlos, vất vả rồi. Cậu hô to "Chạy đi!", "Đừng dừng!" nhỉ. Mình hơi giật mình đấy.'],
      ['カルロス', 'b', 'ありがとう。サッカーの{練習|れんしゅう}では、{短|みじか}く{命令形|めいれいけい}で{言|い}うんだ。「{走|はし}ってください」じゃ、{間|ま}に{合|あ}わないからね。', 'Arigatou. Sakkaa no renshuu de wa, mijikaku meireikei de iu n da. "Hashitte kudasai" ja, ma ni awanai kara ne.', 'Cảm ơn. Lúc tập bóng đá người ta nói ngắn bằng thể mệnh lệnh. Nói "xin hãy chạy" thì không kịp mà.'],
      ['パク', 'a', 'なるほど。でも、{子|こ}どもたちは{怖|こわ}くないのかな。', 'Naruhodo. Demo, kodomotachi wa kowakunai no ka na.', 'Ra vậy. Nhưng bọn trẻ không sợ à?'],
      ['カルロス', 'b', '{大丈夫|だいじょうぶ}。{試合|しあい}のときは、「{頑張|がんば}れ！」「{負|ま}けるな！」って{応援|おうえん}にも{使|つか}うから。{僕|ぼく}も{子|こ}どもの{頃|ころ}、コーチにいつもそう{言|い}われていたよ。', 'Daijoubu. Shiai no toki wa, "Ganbare!" "Makeru na!" tte ouen ni mo tsukau kara. Boku mo kodomo no koro, koochi ni itsumo sou iwarete ita yo.', 'Không sao đâu. Lúc thi đấu thì "Cố lên!", "Đừng thua!" còn dùng để cổ vũ nữa. Hồi nhỏ mình cũng toàn bị huấn luyện viên nói như thế.'],
      ['さくら', 'c', 'コーチ、さようなら！ママに「{暗|くら}くなる{前|まえ}に{帰|かえ}りなさい」って{言|い}われているの。', 'Koochi, sayounara! Mama ni "Kuraku naru mae ni kaerinasai" tte iwarete iru no.', 'Con chào thầy! Mẹ con dặn "Về nhà trước khi trời tối đấy".'],
      ['カルロス', 'b', 'おう、{気|き}をつけて{帰|かえ}れよ！{来週|らいしゅう}も{遅|おく}れるなよ！', 'Ou, ki o tsukete kaere yo! Raishuu mo okureru na yo!', 'Ừ, về cẩn thận nhé! Tuần sau cũng đừng đến muộn đấy!'],
      ['パク', 'a', '「{帰|かえ}りなさい」かあ。{私|わたし}の{母|はは}も{毎日|まいにち}「{早|はや}く{寝|ね}なさい」「{宿題|しゅくだい}をしなさい」って{言|い}っていたなあ。', '"Kaerinasai" kaa. Watashi no haha mo mainichi "Hayaku nenasai" "Shukudai o shinasai" tte itte ita naa.', '"Về nhà đi" à. Mẹ mình ngày nào cũng nói "Ngủ sớm đi", "Làm bài tập đi" đấy.'],
      ['カルロス', 'b', 'どこの{国|くに}のお{母|かあ}さんも{同|おな}じだね。', 'Doko no kuni no okaasan mo onaji da ne.', 'Mẹ nước nào cũng giống nhau nhỉ.'],
    ]),
    {
      t: 'examples',
      items: [
        E('みんな、{集|あつ}まれ！', 'Minna, atsumare!', 'Mọi người, tập trung! (集まる → 集まれ)'),
        E('ボールをよく{見|み}ろ！', 'Booru o yoku miro!', 'Nhìn kỹ bóng! (見る → 見ろ)'),
        E('どんどんシュートしろ！', 'Dondon shuuto shiro!', 'Sút liên tục vào! (する → しろ)'),
        E('{止|と}まるな！もっと{走|はし}れ！', 'Tomaru na! Motto hashire!', 'Đừng dừng! Chạy nữa đi! (cấm ～な · 走る → 走れ)'),
        E('{私|わたし}にキーパーをやらせてください。', 'Watashi ni kiipaa o yarasete kudasai.', 'Cho em / con được bắt gôn ạ. (xin được làm)'),
        E('{暗|くら}くなる{前|まえ}に{帰|かえ}りなさい。', 'Kuraku naru mae ni kaerinasai.', 'Về nhà trước khi trời tối nhé. (bố mẹ nói với con)'),
        E('{頑張|がんば}れ！{負|ま}けるな！', 'Ganbare! Makeru na!', 'Cố lên! Đừng thua! (cổ vũ)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**{集|あつ}まれ・{立|た}て・{走|はし}れ・{出|だ}せ** — **thể mệnh lệnh nhóm 1**: đổi âm cuối **う段 → え段**: {集|あつ}ま**る** → {集|あつ}ま**れ**, {立|た}**つ** → {立|た}**て**, {出|だ}**す** → {出|だ}**せ**. **{見|み}ろ** — nhóm 2: **る → ろ**. **シュートしろ** — nhóm 3: する → **しろ**. (Bảng đủ ở mục Ngữ pháp ⑤.)',
        '**{止|と}まるな・{怖|こわ}がるな・{負|ま}けるな・{遅|おく}れるな** — **V{辞書形|じしょけい} ＋ な** = **CẤM** ("đừng…!", rất mạnh). Đứng sau **thể từ điển** — khác **～なさい** (sau thể ます) và khác **な(あ)** cảm thán (いいなあ).',
        '**Ai nói được thể mệnh lệnh?** — huấn luyện viên trên sân, người hô lúc **nguy hiểm** ({逃|に}げろ！), lời **cổ vũ** ({頑張|がんば}れ！), **biển báo** ({止|と}まれ), và **nam giới** nói với bạn thân / người dưới. Người học nước ngoài nói với thầy, sếp, người lạ → **tuyệt đối không**; dùng **～てください**.',
        '**{私|わたし}にキーパーをやらせてください** — **～させてください** = "**xin cho tôi được** làm" — người nói muốn **chính mình** làm việc đó và xin phép (mẫu ④). やる (làm — văn nói của する, Bài 10) → やら**せる**. **{私|わたし}に** — người được cho làm đi với **に** vì đã có "キーパーを".',
        '**{帰|かえ}りなさい・{寝|ね}なさい・しなさい** — **Vます ＋ なさい** = câu bảo của **bố mẹ, thầy cô với trẻ** (và lời dặn trong đề thi: {正|ただ}しいものを{選|えら}びなさい). Mềm hơn thể mệnh lệnh nhưng vẫn là lời **người trên nói với người dưới**.',
        '**{頼|たの}むぞ／いいぞ／するぞ** — **ぞ** cuối câu: nhấn mạnh kiểu nam giới (thân, mạnh). **{気|き}をつけて{帰|かえ}れよ** — mệnh lệnh + **よ** nghe thân hơn. **「～」って{言|い}われている** — ～って = ～と (văn nói); {言|い}われている = đã được dặn (bị động, ôn Bài 22). **{速|はや}すぎて** (ôn Bài 17) · **{怖|こわ}がる** (sợ — nói về người khác / trẻ con, N3).',
      ],
    },

    /* ── ③ ひまわり食堂 ── */
    { t: 'h', text: '③ ひまわり{食堂|しょくどう} — "Anh cho em về lúc 5 giờ được không ạ?"' },
    {
      t: 'canh',
      anh: ['man-cook', 'man-student', 'woman-student', 'fork-and-knife-with-plate', 'tear-off-calendar'],
      caption: 'Thứ Hai, trước giờ mở cửa ở quán ひまわり食堂. ナタポン có việc muốn xin anh 小林. Tuần sau, quán có người làm thêm mới — リン — và ナタポン được giao kèm cô.',
    },
    {
      t: 'p',
      text: 'Tình huống: **ナタポン** cần dự buổi giới thiệu của trường cao học vào tối thứ Sáu, nên **xin phép** chủ quán bằng mẫu lịch sự nhất của bài: **{帰|かえ}らせていただけませんか** (～させていただけませんか). Để bù, cậu **xin được làm** việc khác: **{僕|ぼく}にやらせてください**. Anh **小林** giao cho ナタポン **dặn lại** bạn mới **リン** vài điều — **～ように{言|い}っておいて／～ように{伝|つた}えて** (nói lại lời dặn, mẫu ⑧). Tuần sau, ナタポン **thuật lại**: **{店長|てんちょう}が、…ようにって{言|い}っていたよ**, và リン cũng **xin được làm** việc mình giỏi: **お{皿洗|さらあら}いをやらせてもらえませんか**.',
    },
    DL('Ở quán ひまわり食堂 — "Em có chuyện muốn xin anh"', [
      ['ナタポン', 'b', '{店長|てんちょう}、ちょっとお{願|ねが}いがあるんですが……。', 'Tenchou, chotto onegai ga aru n desu ga…….', 'Anh ơi, em có chút việc muốn nhờ ạ…'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'うん、{何|なに}？', 'Un, nani?', 'Ừ, gì thế?'],
      ['ナタポン', 'b', '{来週|らいしゅう}の{金曜日|きんようび}、{大学院|だいがくいん}の{説明会|せつめいかい}があるので、5{時|じ}に{帰|かえ}らせていただけませんか。', 'Raishuu no kin\'youbi, daigakuin no setsumeikai ga aru node, goji ni kaerasete itadakemasen ka.', 'Thứ Sáu tuần sau trường cao học có buổi giới thiệu, nên anh cho em về lúc 5 giờ được không ạ?'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{金曜日|きんようび}か……。{夜|よる}は{忙|いそが}しいけど、{大事|だいじ}な{説明会|せつめいかい}だからね。いいよ。', 'Kin\'youbi ka……. Yoru wa isogashii kedo, daiji na setsumeikai da kara ne. Ii yo.', 'Thứ Sáu à… Buổi tối thì bận đấy, nhưng là buổi giới thiệu quan trọng mà. Được.'],
      ['ナタポン', 'b', 'ありがとうございます。その{代|か}わり、{土曜日|どようび}の{朝|あさ}の{準備|じゅんび}は{僕|ぼく}にやらせてください。', 'Arigatou gozaimasu. Sono kawari, doyoubi no asa no junbi wa boku ni yarasete kudasai.', 'Em cảm ơn anh. Bù lại, việc chuẩn bị sáng thứ Bảy anh để em làm ạ.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{助|たす}かるよ。……あ、そうだ。{来週|らいしゅう}から{新|あたら}しいアルバイトのリンさんが{来|く}るんだ。ナタポンくんが{仕事|しごと}を{教|おし}えてくれる？', 'Tasukaru yo. …… A, sou da. Raishuu kara atarashii arubaito no Rin-san ga kuru n da. Natapon-kun ga shigoto o oshiete kureru?', 'Đỡ cho anh quá. … À đúng rồi. Từ tuần sau có bạn làm thêm mới là Linh đến. Em dạy việc cho bạn ấy được không?'],
      ['ナタポン', 'b', 'はい、{任|まか}せてください。', 'Hai, makasete kudasai.', 'Vâng, anh cứ giao cho em.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'じゃ、リンさんに、{最初|さいしょ}の{日|ひ}は10{時|じ}に{来|く}るように{言|い}っておいて。それから、{料理|りょうり}を{運|はこ}ぶ{前|まえ}に、{必|かなら}ず{手|て}を{洗|あら}うように{伝|つた}えてね。', 'Ja, Rin-san ni, saisho no hi wa juuji ni kuru you ni itte oite. Sorekara, ryouri o hakobu mae ni, kanarazu te o arau you ni tsutaete ne.', 'Vậy em dặn Linh là ngày đầu đến lúc 10 giờ nhé. Rồi nhắn bạn ấy là trước khi bưng món nhất định phải rửa tay.'],
      ['ナタポン', 'b', 'わかりました。ほかに{何|なに}か{言|い}っておくことはありますか。', 'Wakarimashita. Hoka ni nani ka itte oku koto wa arimasu ka.', 'Em hiểu rồi. Còn gì cần dặn trước nữa không ạ?'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'お{客|きゃく}さんの{前|まえ}では、スマホを{使|つか}わないように{注意|ちゅうい}しておいてくれる？{前|まえ}のアルバイトの{人|ひと}が、よく{使|つか}っていたからね。', 'Okyaku-san no mae de wa, sumaho o tsukawanai you ni chuui shite oite kureru? Mae no arubaito no hito ga, yoku tsukatte ita kara ne.', 'Em nhắc trước giúp anh là đừng dùng điện thoại trước mặt khách nhé? Bạn làm thêm trước hay dùng lắm.'],
    ]),
    DL('③′ Tuần sau — ナタポン kèm bạn mới リン', [
      ['リン', 'a', 'おはようございます。{今日|きょう}からお{世話|せわ}になります、リンです。', 'Ohayou gozaimasu. Kyou kara osewa ni narimasu, Rin desu.', 'Chào anh ạ. Từ hôm nay em xin được anh giúp đỡ, em là Linh.'],
      ['ナタポン', 'b', 'おはよう。ナタポンです。{店長|てんちょう}に、リンさんに{仕事|しごと}を{教|おし}えるように{言|い}われているんだ。よろしくね。', 'Ohayou. Natapon desu. Tenchou ni, Rin-san ni shigoto o oshieru you ni iwarete iru n da. Yoroshiku ne.', 'Chào em. Anh là Nattapon. Anh được anh chủ dặn là dạy việc cho em. Mong được làm cùng nhé.'],
      ['リン', 'a', 'よろしくお{願|ねが}いします。あのう、まず{何|なに}をすればいいですか。', 'Yoroshiku onegai shimasu. Anou, mazu nani o sureba ii desu ka.', 'Mong anh chỉ bảo ạ. À, trước tiên em nên làm gì ạ?'],
      ['ナタポン', 'b', 'まず、{手|て}を{洗|あら}って。{料理|りょうり}を{運|はこ}ぶ{前|まえ}は{必|かなら}ず{手|て}を{洗|あら}うようにって、{店長|てんちょう}が{言|い}っていたよ。それから、お{客|きゃく}さんの{前|まえ}では、スマホを{使|つか}わないようにね。', 'Mazu, te o aratte. Ryouri o hakobu mae wa kanarazu te o arau you ni tte, tenchou ga itte ita yo. Sorekara, okyaku-san no mae de wa, sumaho o tsukawanai you ni ne.', 'Trước tiên em rửa tay đi. Anh chủ dặn là trước khi bưng món nhất định phải rửa tay đấy. Với lại, trước mặt khách thì đừng dùng điện thoại nhé.'],
      ['リン', 'a', 'はい、わかりました。……あのう、お{皿洗|さらあら}いをやらせてもらえませんか。{家|いえ}でも{毎日|まいにち}やっていたので、{得意|とくい}なんです。', 'Hai, wakarimashita. …… Anou, osaraarai o yarasete moraemasen ka. Ie demo mainichi yatte ita node, tokui na n desu.', 'Vâng, em hiểu rồi. … À, anh cho em làm phần rửa bát được không ạ? Ở nhà ngày nào em cũng làm nên em quen tay lắm.'],
      ['ナタポン', 'b', 'いいよ、{助|たす}かる。じゃ、お{願|ねが}い。{店長|てんちょう}には{僕|ぼく}から{報告|ほうこく}しておくね。', 'Ii yo, tasukaru. Ja, onegai. Tenchou ni wa boku kara houkoku shite oku ne.', 'Được chứ, đỡ cho anh quá. Vậy nhờ em nhé. Anh sẽ báo lại với anh chủ.'],
      ['リン', 'a', 'ありがとうございます。わからないことがあったら、また{質問|しつもん}させてください。', 'Arigatou gozaimasu. Wakaranai koto ga attara, mata shitsumon sasete kudasai.', 'Em cảm ơn anh. Có gì không hiểu, anh cho em hỏi tiếp nhé.'],
      ['ナタポン', 'b', 'うん、いつでも{聞|き}いて。{遠慮|えんりょ}しないでね。', 'Un, itsu demo kiite. Enryo shinaide ne.', 'Ừ, lúc nào cũng cứ hỏi. Đừng ngại nhé.'],
    ]),
    {
      t: 'examples',
      items: [
        E('5{時|じ}に{帰|かえ}らせていただけませんか。', 'Goji ni kaerasete itadakemasen ka.', 'Anh / chị cho tôi về lúc 5 giờ được không ạ? (lịch sự nhất)'),
        E('{土曜日|どようび}の{準備|じゅんび}は{僕|ぼく}にやらせてください。', 'Doyoubi no junbi wa boku ni yarasete kudasai.', 'Việc chuẩn bị thứ Bảy xin để tôi làm.'),
        E('お{皿洗|さらあら}いをやらせてもらえませんか。', 'Osaraarai o yarasete moraemasen ka.', 'Cho tôi làm phần rửa bát được không ạ?'),
        E('リンさんに、10{時|じ}に{来|く}るように{言|い}っておいて。', 'Rin-san ni, juuji ni kuru you ni itte oite.', 'Dặn Linh là đến lúc 10 giờ nhé.'),
        E('スマホを{使|つか}わないように{注意|ちゅうい}してください。', 'Sumaho o tsukawanai you ni chuui shite kudasai.', 'Hãy nhắc (bạn ấy) đừng dùng điện thoại.'),
        E('{店長|てんちょう}に、{仕事|しごと}を{教|おし}えるように{言|い}われています。', 'Tenchou ni, shigoto o oshieru you ni iwarete imasu.', 'Tôi được anh chủ dặn là dạy việc (cho bạn).'),
        E('わからないことがあったら、{質問|しつもん}させてください。', 'Wakaranai koto ga attara, shitsumon sasete kudasai.', 'Có gì không hiểu, cho tôi hỏi nhé.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{帰|かえ}らせていただけませんか** — **V(さ)せて ＋ いただけませんか** = "**xin (ngài) cho tôi được** làm…" — mức **lịch sự nhất** của bài, dùng với **chủ, sếp, thầy cô**. {帰|かえ}る là **nhóm 1 ngoại lệ** (trông như nhóm 2) → {帰|かえ}**ら**せる, không phải ~~{帰|かえ}させる~~.',
        '**{僕|ぼく}にやらせてください／やらせてもらえませんか** — ba mức xin phép: **～させてください** (xin thẳng, thân vừa) → **～させてもらえませんか** (mềm hơn) → **～させていただけませんか** (kính trọng nhất). Cả ba đều là **xin cho CHÍNH MÌNH làm**. Hay dùng để **xung phong**: {僕|ぼく}にやらせてください (để tôi làm cho).',
        '**10{時|じ}に{来|く}るように{言|い}っておいて／{手|て}を{洗|あら}うように{伝|つた}えて** — **V{辞書形|じしょけい}／Vない ＋ ように ＋ {言|い}う・{伝|つた}える・{注意|ちゅうい}する・{頼|たの}む** = **nói lại một lời dặn / yêu cầu** (không trích nguyên văn). Người được dặn đi với **に**: **リンさんに**～ように{言|い}う. ～ておいて (ôn Bài 18) = làm sẵn giúp.',
        '**{教|おし}えるように{言|い}われている** — ～ように{言|い}われる = "**được (ai) dặn** làm…" (bị động — Bài 22): người dặn đi với **に** ({店長|てんちょう}に). ～ている = lời dặn **vẫn còn hiệu lực**. **～ようにって{言|い}っていた** — văn nói: って = と; ナタポン thuật lại lời anh chủ.',
        '**{質問|しつもん}させてください** — xin phép được hỏi (lịch sự, rất hay dùng ở chỗ làm, lớp học). Cùng loại: {説明|せつめい}させてください (cho tôi trình bày), {考|かんが}えさせてください (cho tôi suy nghĩ đã — cách từ chối khéo!), {自己紹介|じこしょうかい}させてください (cho tôi tự giới thiệu).',
        '**{任|まか}せてください** (cứ giao cho tôi) · **お{世話|せわ}になります** (câu chào khi bắt đầu làm ở chỗ mới — Bài 18) · **{得意|とくい}** (giỏi, sở trường) · **{報告|ほうこく}しておく** (báo cáo sẵn) · **{遠慮|えんりょ}しないで** (đừng ngại) · **{説明会|せつめいかい}** = buổi giới thiệu (N3).',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b23-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 49 từ N4: thời thơ ấu & gia đình, việc nhà & việc của trẻ, trẻ nghịch & dạy dỗ, mệnh lệnh – cho phép – thể thao, chỗ làm & xin phép',
  goal: 'Thuộc 49 từ của chủ đề thời thơ ấu: thời thơ ấu & gia đình (頃・幼い・幼稚園・大人・育てる・育つ・親・厳しい・甘やかす・懐かしい・おもちゃ), việc nhà & việc của trẻ (お使い・留守番・習い事・塾・世話をする・皿洗い・干す・畳む・着替える・虫), trẻ nghịch & dạy dỗ (いたずら・反省する・嫌がる・わがまま・好き嫌い・残す・泣き虫・言うことを聞く・素直), mệnh lệnh – cho phép – thể thao (命令・許可・反対する・賛成する・投げる・逃げる・大声・応援する・部活), chỗ làm & xin phép (部下・部長・課長・早退する・担当する・～の代わりに・意見・任せる・報告する・指示) — và biết từ nào hay đi với mẫu nào (塾に行かせる, 犬を飼わせてくれる, 早退させていただけませんか, 報告するように言われる, 逃げろ！, 残さないで食べなさい).',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: '**49 từ** chia 5 nhóm theo đúng các tình huống của bài: **A** thời thơ ấu & gia đình (11) · **B** việc nhà & việc của trẻ (10) · **C** trẻ nghịch & dạy dỗ (9) · **D** mệnh lệnh – cho phép – thể thao (9) · **E** chỗ làm & xin phép (10). Từ đã học ở Bài 1–22 ({両親|りょうしん}, {子|こ}ども, {手伝|てつだ}う, {片付|かたづ}ける, {宿題|しゅくだい}, {掃除|そうじ}する, {洗濯|せんたく}する, {通|かよ}う, {散歩|さんぽ}する, ペット, えさ, {留守|るす}, {許|ゆる}す, {拾|ひろ}う, {謝|あやま}る, {泣|な}く, {怒|おこ}る, しかる, {褒|ほ}める, {飼|か}う, {注意|ちゅうい}する, {上司|じょうし}, {自由|じゆう}, {思|おも}い{出|で}, {昔|むかし}, {田舎|いなか}, {先輩|せんぱい}, {練習|れんしゅう}, {試合|しあい}, {頼|たの}む, {伝|つた}える, {我慢|がまん}する…) KHÔNG lặp lại — gặp trong câu ví dụ thì coi như ôn. Số **1 / 2 / 3** sau động từ = nhóm động từ — **bài này rất cần**, vì cách chia thể sai khiến và thể mệnh lệnh phụ thuộc hoàn toàn vào nhóm.',
    },
    {
      t: 'note',
      title: 'Cách học 49 từ trong 3 ngày',
      items: [
        '**Ngày 1** — nhóm A + B (21 từ): đọc to theo 🔊, che nghĩa tự nói; kể 3 câu về hồi nhỏ của mình: {子|こ}どもの{頃|ころ}、{私|わたし}は…, {親|おや}は…, {習|なら}い{事|ごと}は…. Đọc to hội thoại ① — gần như cả nhóm A nằm trong đó.',
        '**Ngày 2** — nhóm C + D (18 từ): với mỗi động từ, tự chia luôn **thể sai khiến** và **thể mệnh lệnh** (sau khi học mẫu ①, ⑤): {投|な}げる → {投|な}げさせる → {投|な}げろ; {逃|に}げる → {逃|に}げさせる → {逃|に}げろ. Viết 2 cặp tự ↔ tha: {育|そだ}つ ↔ {育|そだ}てる, {残|のこ}る ↔ {残|のこ}す.',
        '**Ngày 3** — nhóm E (10 từ) + thẻ hình + bảng "Từ dễ nhầm" + trắc nghiệm cuối mục + viết tay 10 từ hay vào đề. Đóng vai xin phép sếp bằng {早退|そうたい}・{担当|たんとう}・{報告|ほうこく} + ～させていただけませんか.',
        'Romaji: trường âm viết đôi ({幼稚園|ようちえん} → **youchien**, {報告|ほうこく} → **houkoku**, {応援|おうえん} → **ouen**, {大声|おおごえ} → **oogoe**, {上司|じょうし} → **joushi**); âm đục trong từ ghép ({習|なら}い{事|ごと} → narai**g**oto, {大声|おおごえ} → oo**g**oe); ん trước nguyên âm thêm dấu nháy ({金曜日|きんようび} → **kin\'youbi**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Thời thơ ấu & gia đình (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{頃|ころ}', pos: 'danh từ', ipa: 'koro', vi: 'hồi, thuở, khoảng thời gian', ex: '{子|こ}どもの{頃|ころ}、{夏|なつ}はよく{川|かわ}で{泳|およ}ぎました。', exRo: 'Kodomo no koro, natsu wa yoku kawa de oyogimashita.', exVi: 'Hồi nhỏ, mùa hè tôi hay bơi ở sông.', more: '**N の{頃|ころ}** ({子|こ}どもの{頃|ころ}, {小学生|しょうがくせい}の{頃|ころ}) · **イA ＋ {頃|ころ}** ({小|ちい}さい{頃|ころ}, {若|わか}い{頃|ころ}) · **Vた ＋ {頃|ころ}** ({日本|にほん}に{来|き}た{頃|ころ}). Sau số giờ / ngày đọc **ごろ**: 3{時|じ}ごろ (khoảng 3 giờ). Chữ **頃** là chữ Hán mới. N3.' },
        { w: '{幼|おさな}い', pos: 'tính từ đuôi い', ipa: 'osanai', vi: 'còn nhỏ, thơ ấu; non nớt', ex: '{幼|おさな}い{頃|ころ}、{祖母|そぼ}の{家|いえ}によく{泊|と}まりました。', exRo: 'Osanai koro, sobo no ie ni yoku tomarimashita.', exVi: 'Hồi còn bé, tôi hay ngủ lại nhà bà.', more: '{幼|おさな}い{頃|ころ} ≈ {小|ちい}さい{頃|ころ} ({幼|おさな}い trang trọng, văn viết hơn) · {幼|おさな}い{子|こ}ども (trẻ còn nhỏ) · nói tính cách: {考|かんが}え{方|かた}が{幼|おさな}い (suy nghĩ non nớt). Chữ **幼** là chữ Hán mới. N3.' },
        { w: '{幼稚園|ようちえん}', pos: 'danh từ', ipa: 'youchien', vi: 'trường mẫu giáo', ex: '{弟|おとうと}は{毎朝|まいあさ}、{母|はは}に{幼稚園|ようちえん}まで{送|おく}ってもらいます。', exRo: 'Otouto wa maiasa, haha ni youchien made okutte moraimasu.', exVi: 'Sáng nào em trai tôi cũng được mẹ đưa đến trường mẫu giáo.', more: '{幼稚園|ようちえん}に{通|かよ}う · {幼稚園|ようちえん}の{先生|せんせい}. Ở Nhật: {幼稚園|ようちえん} (3–6 tuổi, thuộc ngành giáo dục) khác {保育園|ほいくえん} (nhà trẻ — trông trẻ cho bố mẹ đi làm, N3). Chữ 稚 cấp cao — chỉ cần đọc. ～てもらう — ôn Bài 18. N3.' },
        { w: '{大人|おとな}', pos: 'danh từ', ipa: 'otona', vi: 'người lớn', ex: '{大人|おとな}になったら、{何|なに}になりたいですか。', exRo: 'Otona ni nattara, nani ni naritai desu ka.', exVi: 'Lớn lên bạn muốn làm nghề gì?', more: '⚠ Cách đọc đặc biệt **おとな** (không đọc theo từng chữ). Đối: {子|こ}ども. Vé: {大人|おとな}{二枚|にまい}、{子|こ}ども{一枚|いちまい} · {大人|おとな}っぽい (trông chững chạc). Câu bố mẹ: もう{大人|おとな}なんだから、{自分|じぶん}で{決|き}めなさい. N4.' },
        { w: '{育|そだ}てます［{育|そだ}てる］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'sodatemasu [sodateru]', vi: 'nuôi dạy, nuôi lớn; trồng (cây)', ex: '{祖母|そぼ}は{一人|ひとり}で{五人|ごにん}の{子|こ}どもを{育|そだ}てました。', exRo: 'Sobo wa hitori de gonin no kodomo o sodatemashita.', exVi: 'Bà tôi một mình nuôi lớn năm người con.', more: '+ て: {育|そだ}てて. **N を{育|そだ}てる**: {子|こ}どもを{育|そだ}てる, {野菜|やさい}／{花|はな}を{育|そだ}てる (trồng). **{厳|きび}しく{育|そだ}てる** (nuôi dạy nghiêm) ↔ {自由|じゆう}に{育|そだ}てる. {子育|こそだ}て = việc nuôi con (N3). ⚠ Con vật nuôi thì dùng **{飼|か}う**. N4.' },
        { w: '{育|そだ}ちます［{育|そだ}つ］1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'sodachimasu [sodatsu]', vi: 'lớn lên, trưởng thành', ex: '{私|わたし}は{田舎|いなか}で{生|う}まれて、{田舎|いなか}で{育|そだ}ちました。', exRo: 'Watashi wa inaka de umarete, inaka de sodachimashita.', exVi: 'Tôi sinh ra ở quê và lớn lên ở quê.', more: '+ て: **{育|そだ}って**. Cặp **N が{育|そだ}つ** (tự) ↔ **N を{育|そだ}てる** (tha) — như các cặp của Bài 21. Câu tự giới thiệu: {生|う}まれも{育|そだ}ちもハノイです (sinh ra và lớn lên đều ở Hà Nội). N3.' },
        { w: '{親|おや}', pos: 'danh từ', ipa: 'oya', vi: 'bố mẹ (bố hoặc mẹ / bố mẹ nói chung)', ex: '{子|こ}どもの{頃|ころ}、{親|おや}によく{本|ほん}を{読|よ}んでもらいました。', exRo: 'Kodomo no koro, oya ni yoku hon o yonde moraimashita.', exVi: 'Hồi nhỏ tôi hay được bố mẹ đọc sách cho nghe.', more: '{親|おや} = bố hoặc mẹ, hay "bố mẹ" nói chung (không kính ngữ) · {両親|りょうしん} (Bài 8) = cả hai bố mẹ · bố mẹ người khác: ご{両親|りょうしん}. Cụm: **{親|おや}に{心配|しんぱい}させる** (làm bố mẹ lo — sai khiến cảm xúc) · {親|おや}の{言|い}うことを{聞|き}く (nghe lời bố mẹ). N3.' },
        { w: '{厳|きび}しい', pos: 'tính từ đuôi い', ipa: 'kibishii', vi: 'nghiêm khắc, khắt khe; gay gắt', ex: '{父|ちち}は{厳|きび}しくて、{夜|よる}9{時|じ}からはテレビを{見|み}させてくれませんでした。', exRo: 'Chichi wa kibishikute, yoru kuji kara wa terebi o misasete kuremasen deshita.', exVi: 'Bố tôi nghiêm lắm, từ 9 giờ tối là không cho xem ti vi.', more: '**N に{厳|きび}しい** ({子|こ}どもに{厳|きび}しい — nghiêm với con) · {厳|きび}しい{先生|せんせい}／{規則|きそく} · {暑|あつ}さが{厳|きび}しい (nắng gắt — N3) · trạng từ: {厳|きび}しく{育|そだ}てる. Ví dụ có ～させてくれない (mẫu ③). Chữ **厳** là chữ Hán mới. N4.' },
        { w: '{甘|あま}やかします［{甘|あま}やかす］1', pos: 'động từ nhóm 1', ipa: 'amayakashimasu [amayakasu]', vi: 'nuông chiều', ex: '{祖父|そふ}は{孫|まご}を{甘|あま}やかして、お{菓子|かし}をたくさん{食|た}べさせます。', exRo: 'Sofu wa mago o amayakashite, okashi o takusan tabesasemasu.', exVi: 'Ông tôi chiều cháu, cho ăn rất nhiều bánh kẹo.', more: '**N を{甘|あま}やかす** — gốc {甘|あま}い (ngọt — Bài 4; nói về người: dễ dãi): **{子|こ}どもに{甘|あま}い{親|おや}** (bố mẹ dễ dãi với con) ↔ {厳|きび}しい{親|おや}. {孫|まご} = cháu (của ông bà, N3). Ví dụ có {食|た}べさせる (cho ăn — mẫu ③). N3.' },
        { w: '{懐|なつ}かしい', pos: 'tính từ đuôi い', ipa: 'natsukashii', vi: 'nhớ (thứ của ngày xưa), gợi nhớ, bồi hồi', ex: 'この{歌|うた}を{聞|き}くと、{子|こ}どもの{頃|ころ}を{思|おも}い{出|だ}して、{懐|なつ}かしくなります。', exRo: 'Kono uta o kiku to, kodomo no koro o omoidashite, natsukashiku narimasu.', exVi: 'Nghe bài hát này là tôi nhớ lại hồi nhỏ, thấy bồi hồi.', more: 'Cảm giác **gặp lại thứ của quá khứ** (ảnh cũ, bài hát cũ, món ăn quê, bạn cũ): {懐|なつ}かしい！ ⚠ "Nhớ người đang ở xa" (nhớ mẹ) → **{寂|さび}しい／{会|あ}いたい** (Bài 11), không dùng {懐|なつ}かしい. ～と (ôn ポイント 113). Chữ 懐 cấp cao — đọc được là đủ. N3.' },
        { w: 'おもちゃ', pos: 'danh từ', ipa: 'omocha', vi: 'đồ chơi', ex: '{遊|あそ}んだあとは、おもちゃを{片付|かたづ}けなさい。', exRo: 'Asonda ato wa, omocha o katazukenasai.', exVi: 'Chơi xong thì dọn đồ chơi đi.', more: 'おもちゃで{遊|あそ}ぶ · おもちゃを{片付|かたづ}ける (Bài 16) · おもちゃ{屋|や} (cửa hàng đồ chơi) · おもちゃの{車|くるま} (ô tô đồ chơi). Ví dụ là câu ～なさい (mẫu ⑦) — câu bố mẹ Nhật nói hằng ngày. N4.' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Việc nhà & việc của trẻ (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'お{使|つか}い', pos: 'danh từ', ipa: 'otsukai', vi: 'việc vặt được sai đi (thường là đi mua đồ giúp)', ex: '{母|はは}は{私|わたし}をよく{近|ちか}くの{店|みせ}へお{使|つか}いに{行|い}かせました。', exRo: 'Haha wa watashi o yoku chikaku no mise e otsukai ni ikasemashita.', exVi: 'Mẹ tôi hay sai tôi đi mua đồ ở cửa hàng gần nhà.', more: '**お{使|つか}いに{行|い}く** (đi mua giúp). Gốc {使|つか}う (Bài 7). Chương trình truyền hình Nhật nổi tiếng 「{初|はじ}めてのお{使|つか}い」 — trẻ 3–4 tuổi lần đầu tự đi mua đồ. Ví dụ là câu sai khiến mẫu ② (B を {行|い}かせる). N3.' },
        { w: '{留守番|るすばん}', pos: 'danh từ / động từ nhóm 3 (留守番する)', ipa: 'rusuban', vi: 'việc trông nhà (khi người nhà đi vắng)', ex: '{両親|りょうしん}が{出|で}かけている{間|あいだ}、{一人|ひとり}で{留守番|るすばん}をしました。', exRo: 'Ryoushin ga dekakete iru aida, hitori de rusuban o shimashita.', exVi: 'Trong lúc bố mẹ đi vắng, tôi ở nhà trông nhà một mình.', more: '**{留守番|るすばん}をする** · {子|こ}どもに{留守番|るすばん}をさせる (để con ở nhà trông nhà). {留守|るす} (vắng nhà — Bài 18) + {番|ばん} (lượt, canh). {留守番電話|るすばんでんわ} = hộp thư thoại (N3). N3.' },
        { w: '{習|なら}い{事|ごと}', pos: 'danh từ', ipa: 'naraigoto', vi: 'môn học thêm năng khiếu (đàn, bơi, thư pháp…)', ex: '{小学生|しょうがくせい}の{頃|ころ}、{習|なら}い{事|ごと}を{三|みっ}つもしていました。', exRo: 'Shougakusei no koro, naraigoto o mittsu mo shite imashita.', exVi: 'Hồi tiểu học, tôi học thêm đến ba môn năng khiếu.', more: '{習|なら}う (Bài 9) + {事|こと} → đọc **ごと**. **{習|なら}い{事|ごと}をする／{習|なら}い{事|ごと}に{通|かよ}う**. Câu hay gặp: {子|こ}どもに{習|なら}い{事|ごと}をさせる. Môn phổ biến ở Nhật: {水泳|すいえい}, ピアノ, {書道|しょどう}, {英会話|えいかいわ}, そろばん. ～も sau số lượng = nhấn mạnh "đến tận". N3.' },
        { w: '{塾|じゅく}', pos: 'danh từ', ipa: 'juku', vi: 'lớp học thêm, trung tâm luyện thi (sau giờ học)', ex: '{中学生|ちゅうがくせい}の{頃|ころ}、{週|しゅう}に{四回|よんかい}{塾|じゅく}に{通|かよ}っていました。', exRo: 'Chuugakusei no koro, shuu ni yonkai juku ni kayotte imashita.', exVi: 'Hồi cấp 2, tôi đi học thêm ở trung tâm mỗi tuần bốn buổi.', more: '**{塾|じゅく}に{通|かよ}う／{行|い}く** · {塾|じゅく}の{先生|せんせい}. {塾|じゅく} = học thêm môn văn hoá / luyện thi; {習|なら}い{事|ごと} = năng khiếu; {部活|ぶかつ} = câu lạc bộ trong trường. Chữ 塾 cấp cao — đọc được là đủ. N3.' },
        { w: '{世話|せわ}します［{世話|せわ}をする］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'sewa shimasu [sewa o suru]', vi: 'chăm sóc, trông nom', ex: '{毎日|まいにち}{犬|いぬ}の{世話|せわ}をするのは、{弟|おとうと}の{仕事|しごと}です。', exRo: 'Mainichi inu no sewa o suru no wa, otouto no shigoto desu.', exVi: 'Chăm con chó mỗi ngày là việc của em trai tôi.', more: '**N の{世話|せわ}をする** (chăm N: {犬|いぬ}, {赤|あか}ちゃん, {花|はな}, おばあさん). Bài 18 có câu chào **お{世話|せわ}になります** (được giúp đỡ) — cùng gốc 世話. {世話|せわ}が{大変|たいへん}だ. ～のは～です = nhấn mạnh. N3.' },
        { w: '{皿洗|さらあら}い', pos: 'danh từ', ipa: 'saraarai', vi: 'việc rửa bát đĩa', ex: '{子|こ}どもの{頃|ころ}、{夕食|ゆうしょく}のあとの{皿洗|さらあら}いは{私|わたし}の{仕事|しごと}でした。', exRo: 'Kodomo no koro, yuushoku no ato no saraarai wa watashi no shigoto deshita.', exVi: 'Hồi nhỏ, rửa bát sau bữa tối là việc của tôi.', more: '{皿|さら} (Bài 7) + {洗|あら}う → **さらあらい** (danh từ lấy từ thân thể ます: {洗|あら}い). **{皿洗|さらあら}いをする** · {子|こ}どもに{皿洗|さらあら}いをさせる (mẫu ②) · ở quán ăn: {皿洗|さらあら}いのアルバイト. (Nuôi con vật — {飼|か}う — đã học ở Bài 22; Bài 23 học chữ Hán **飼**.) N3.' },
        { w: '{干|ほ}します［{干|ほ}す］1', pos: 'động từ nhóm 1', ipa: 'hoshimasu [hosu]', vi: 'phơi (quần áo, chăn…)', ex: '{天気|てんき}がいいので、{洗濯物|せんたくもの}を{外|そと}に{干|ほ}しましょう。', exRo: 'Tenki ga ii node, sentakumono o soto ni hoshimashou.', exVi: 'Trời đẹp nên mình phơi đồ ra ngoài đi.', more: '**{洗濯物|せんたくもの}／{布団|ふとん}を{干|ほ}す**. {洗濯|せんたく} (Bài 5) + {物|もの} = đồ giặt; {布団|ふとん} — Bài 14. Thể sai khiến: {干|ほ}させる (す → さ + せる) — {子|こ}どもに{洗濯物|せんたくもの}を{干|ほ}させる. N3.' },
        { w: '{畳|たた}みます［{畳|たた}む］1', pos: 'động từ nhóm 1', ipa: 'tatamimasu [tatamu]', vi: 'gấp (quần áo, chăn, ô)', ex: '{子|こ}どもの{頃|ころ}、{洗濯物|せんたくもの}を{畳|たた}むのは{私|わたし}の{仕事|しごと}でした。', exRo: 'Kodomo no koro, sentakumono o tatamu no wa watashi no shigoto deshita.', exVi: 'Hồi nhỏ, gấp quần áo là việc của tôi.', more: '**{服|ふく}／{洗濯物|せんたくもの}／{布団|ふとん}／{傘|かさ}を{畳|たた}む** · {畳|たた}み{方|かた} (cách gấp). Cùng chữ: **{畳|たたみ}** (chiếu tatami) và đơn vị đo phòng {六畳|ろくじょう}. N3.' },
        { w: '{着替|きが}えます［{着替|きが}える］2', pos: 'động từ nhóm 2', ipa: 'kigaemasu [kigaeru]', vi: 'thay quần áo', ex: '{服|ふく}が{汚|よご}れたので、すぐ{着替|きが}えなさいと{言|い}われました。', exRo: 'Fuku ga yogoreta node, sugu kigaenasai to iwaremashita.', exVi: 'Quần áo bẩn nên tôi bị bảo là thay ngay đi.', more: '{着|き}る (mặc) + {替|か}える (thay) → **きがえる**. {着替|きが}え (bộ đồ để thay). {子|こ}どもを{着替|きが}えさせる (thay đồ cho con). {汚|よご}れる — Bài 15. Ví dụ có ～なさい (mẫu ⑦) và bị động {言|い}われる (Bài 22). N3.' },
        { w: '{虫|むし}', pos: 'danh từ', ipa: 'mushi', vi: 'sâu bọ, côn trùng', ex: '{夏休|なつやす}みは、{毎日|まいにち}{兄|あに}と{山|やま}へ{虫|むし}を{取|と}りに{行|い}きました。', exRo: 'Natsuyasumi wa, mainichi ani to yama e mushi o tori ni ikimashita.', exVi: 'Kỳ nghỉ hè ngày nào tôi cũng cùng anh lên núi bắt côn trùng.', more: '**{虫|むし}を{取|と}る** (bắt côn trùng — trò chơi mùa hè của trẻ Nhật; {虫取|むしと}り) · {虫|むし}に{刺|さ}される (bị muỗi / côn trùng đốt — bị động Bài 22) · {虫歯|むしば} (răng sâu) · {弱虫|よわむし} (đồ nhát gan). ～に{行|い}く — ôn ポイント 42. Chữ **虫** là chữ Hán mới. N3.' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Trẻ nghịch & dạy dỗ (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'いたずら', pos: 'danh từ / động từ nhóm 3 (いたずらする)', ipa: 'itazura', vi: 'trò nghịch ngợm, quậy phá', ex: '{子|こ}どもの{頃|ころ}、いたずらをして、よく{先生|せんせい}にしかられました。', exRo: 'Kodomo no koro, itazura o shite, yoku sensei ni shikararemashita.', exVi: 'Hồi nhỏ tôi hay nghịch nên thường bị thầy cô mắng.', more: '**いたずらをする** · いたずら{好|ず}き (hay nghịch) · いたずら{電話|でんわ} (điện thoại quấy rối). しかられる — bị động của しかる (Bài 19, 22). Mệnh lệnh cấm: いたずらするな！ N3.' },
        { w: '{反省|はんせい}します［{反省|はんせい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'hansei shimasu [hansei suru]', vi: 'tự kiểm điểm, hối lỗi, rút kinh nghiệm', ex: '{母|はは}に「よく{反省|はんせい}しなさい」と{言|い}われて、{部屋|へや}で{一時間|いちじかん}{考|かんが}えました。', exRo: 'Haha ni "Yoku hansei shinasai" to iwarete, heya de ichijikan kangaemashita.', exVi: 'Bị mẹ bảo "Tự kiểm điểm cho kỹ đi", tôi ngồi trong phòng nghĩ suốt một tiếng.', more: '**N を{反省|はんせい}する** · {反省|はんせい}しています (tôi đang hối lỗi — dùng khi xin lỗi). Ở công ty Nhật: **{反省会|はんせいかい}** = họp rút kinh nghiệm sau một dự án. Chữ **反** là chữ Hán mới. N3.' },
        { w: '{嫌|いや}がります［{嫌|いや}がる］1', pos: 'động từ nhóm 1', ipa: 'iyagarimasu [iyagaru]', vi: 'tỏ ra không thích, ghét (nói về NGƯỜI KHÁC)', ex: '{弟|おとうと}は{歯医者|はいしゃ}に{行|い}くのを{嫌|いや}がって、{泣|な}きました。', exRo: 'Otouto wa haisha ni iku no o iyagatte, nakimashita.', exVi: 'Em trai tôi không chịu đi nha sĩ, khóc ầm lên.', more: '{嫌|いや}（な） (không thích, ghét) + **がる** → nói cảm xúc của **người khác** (nhìn qua thái độ). Mình thì nói {嫌|いや}です. Cùng kiểu: {怖|こわ}がる (sợ), ほしがる (muốn có). **N／V の を{嫌|いや}がる**. Sai khiến: {子|こ}どもが{嫌|いや}がることを{無理|むり}にさせない. N3.' },
        { w: 'わがまま', pos: 'tính từ đuôi な / danh từ', ipa: 'wagamama', vi: 'ích kỷ, đòi hỏi, ương bướng (chỉ theo ý mình)', ex: 'わがままを{言|い}わないで、{野菜|やさい}も{食|た}べなさい。', exRo: 'Wagamama o iwanaide, yasai mo tabenasai.', exVi: 'Đừng có đòi hỏi, ăn cả rau nữa đi.', more: '**わがままを{言|い}う** (đòi vô lý) · わがままな{子|こ}ども. Trong tiếng Nhật đây là lời **phê bình khá mạnh**, không mang nghĩa tốt "có cá tính". Ví dụ có ～ないで + ～なさい (mẫu ⑦). N3.' },
        { w: '{好|す}き{嫌|きら}い', pos: 'danh từ', ipa: 'sukikirai', vi: 'sự kén (ăn); thích và ghét', ex: '{子|こ}どもの{頃|ころ}は{好|す}き{嫌|きら}いが{多|おお}くて、よく{母|はは}を{困|こま}らせました。', exRo: 'Kodomo no koro wa sukikirai ga ookute, yoku haha o komarasemashita.', exVi: 'Hồi nhỏ tôi kén ăn lắm, hay làm mẹ khổ sở.', more: '**{好|す}き{嫌|きら}いが{多|おお}い／ない** · **{好|す}き{嫌|きら}いをする** (kén ăn). {困|こま}らせる = làm (ai) khó xử — sai khiến **cảm xúc** (mẫu ③). Câu bố mẹ: {好|す}き{嫌|きら}いをしないで{全部|ぜんぶ}{食|た}べなさい. N3.' },
        { w: '{残|のこ}します［{残|のこ}す］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'nokoshimasu [nokosu]', vi: 'để thừa, bỏ lại; để lại', ex: '{出|だ}されたものは{残|のこ}さないで{食|た}べなさい。', exRo: 'Dasareta mono wa nokosanaide tabenasai.', exVi: 'Món được dọn ra thì ăn hết, đừng để thừa.', more: '+ て: {残|のこ}して. Cặp **N を{残|のこ}す** (tha) ↔ **N が{残|のこ}る** (còn lại — tự, N4). {残念|ざんねん} (Bài 6) cùng chữ. {出|だ}された — bị động Bài 22. Sai khiến: {残|のこ}させる (để ai ở lại): {先生|せんせい}は{私|わたし}を{放課後|ほうかご}{教室|きょうしつ}に{残|のこ}らせた (bắt ở lại — 残る). N4.' },
        { w: '{泣|な}き{虫|むし}', pos: 'danh từ', ipa: 'nakimushi', vi: 'đứa hay khóc nhè, mít ướt', ex: '{小|ちい}さい{頃|ころ}の{私|わたし}は{泣|な}き{虫|むし}で、すぐ{泣|な}いて{母|はは}を{困|こま}らせました。', exRo: 'Chiisai koro no watashi wa nakimushi de, sugu naite haha o komarasemashita.', exVi: 'Hồi bé tôi mít ướt lắm, động tí là khóc làm mẹ khổ sở.', more: '{泣|な}く (Bài 19) + {虫|むし} (chữ mới) — người Nhật hay ghép {虫|むし} để gọi tính cách: **{弱虫|よわむし}** (đồ nhát gan), **{泣|な}き{虫|むし}** (mít ướt). Câu bố mẹ hay nói: {泣|な}くな！ Ví dụ có {困|こま}らせる (gây cảm xúc — mẫu ③). ({注意|ちゅうい}する — nhắc nhở — đã học ở Bài 22, dùng nhiều ở mẫu ⑧.) N3.' },
        { w: '{言|い}うことを{聞|き}きます［{言|い}うことを{聞|き}く］1', pos: 'cụm động từ (nhóm 1)', ipa: 'iu koto o kikimasu [iu koto o kiku]', vi: 'vâng lời, nghe lời', ex: '{弟|おとうと}は{全然|ぜんぜん}{親|おや}の{言|い}うことを{聞|き}きません。', exRo: 'Otouto wa zenzen oya no iu koto o kikimasen.', exVi: 'Em trai tôi chẳng nghe lời bố mẹ chút nào.', more: '**（ai）の{言|い}うことを{聞|き}く** — nghĩa đen "nghe điều (ai) nói". {言|い}うことを{聞|き}かない = bướng, không vâng lời. Câu bố mẹ: **{言|い}うことを{聞|き}きなさい！** Sai khiến: {親|おや}は{子|こ}どもに{言|い}うことを{聞|き}かせる (bắt con nghe lời). N3.' },
        { w: '{素直|すなお}', pos: 'tính từ đuôi な', ipa: 'sunao', vi: 'ngoan, ngoan ngoãn; thật thà, dễ tiếp thu', ex: '{小|ちい}さい{頃|ころ}の{兄|あに}は{素直|すなお}で、{親|おや}の{言|い}うことをよく{聞|き}く{子|こ}どもでした。', exRo: 'Chiisai koro no ani wa sunao de, oya no iu koto o yoku kiku kodomo deshita.', exVi: 'Hồi bé anh tôi ngoan, là đứa trẻ rất nghe lời bố mẹ.', more: '**{素直|すなお}な{子|こ}ども** · {素直|すなお}に{謝|あやま}る (thành thật xin lỗi — Bài 19) · アドバイスを{素直|すなお}に{聞|き}く (chịu nghe lời khuyên). Gần đối nghĩa: わがまま. N3.' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Mệnh lệnh – cho phép – thể thao (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{命令|めいれい}', pos: 'danh từ / động từ nhóm 3 (命令する)', ipa: 'meirei', vi: 'mệnh lệnh; ra lệnh', ex: '{社長|しゃちょう}の{命令|めいれい}で、{来月|らいげつ}から{大阪|おおさか}で{働|はたら}くことになりました。', exRo: 'Shachou no meirei de, raigetsu kara Oosaka de hataraku koto ni narimashita.', exVi: 'Theo lệnh của giám đốc, từ tháng sau tôi sẽ làm việc ở Osaka.', more: '**{命令|めいれい}する／{命令|めいれい}を{出|だ}す** · {命令形|めいれいけい} = thể mệnh lệnh (tên của mẫu ⑤). Từ này nghe **rất cứng** (quân đội, công ty, máy tính); đời thường nói {頼|たの}む／{言|い}う. ～ことになる — ôn Bài 21. Chữ **命・令** là chữ Hán mới. N3.' },
        { w: '{許可|きょか}', pos: 'danh từ / động từ nhóm 3 (許可する)', ipa: 'kyoka', vi: 'sự cho phép, giấy phép', ex: '{会議室|かいぎしつ}を{使|つか}うときは、{部長|ぶちょう}の{許可|きょか}が{必要|ひつよう}です。', exRo: 'Kaigishitsu o tsukau toki wa, buchou no kyoka ga hitsuyou desu.', exVi: 'Khi dùng phòng họp cần có sự cho phép của trưởng phòng.', more: '**{許可|きょか}を{取|と}る／もらう** (xin được phép) · {許可|きょか}が{出|で}る · biển: {許可|きょか}なく{入|はい}らないでください. {許|ゆる}す (Bài 19) cùng chữ 許. Liên hệ mẫu ④: {許可|きょか}をもらう ≈ ～させてもらう. Chữ **許・可** là chữ Hán mới. N3.' },
        { w: '{反対|はんたい}します［{反対|はんたい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'hantai shimasu [hantai suru]', vi: 'phản đối; (danh từ) điều ngược lại', ex: '{留学|りゅうがく}したいと{言|い}ったら、{最初|さいしょ}は{父|ちち}に{反対|はんたい}されました。', exRo: 'Ryuugaku shitai to ittara, saisho wa chichi ni hantai saremashita.', exVi: 'Khi tôi nói muốn đi du học, lúc đầu bị bố phản đối.', more: '**N に{反対|はんたい}する** (phản đối N — trợ từ **に**) · {反対|はんたい}の{意見|いけん} · danh từ: {反対|はんたい}{側|がわ} (phía đối diện — 側 Bài 17), {意味|いみ}が{反対|はんたい} (nghĩa ngược). Đối: {賛成|さんせい}する. Chữ **反** là chữ Hán mới. N4.' },
        { w: '{賛成|さんせい}します［{賛成|さんせい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'sansei shimasu [sansei suru]', vi: 'tán thành, đồng ý', ex: '{母|はは}は{私|わたし}の{留学|りゅうがく}に{賛成|さんせい}してくれました。', exRo: 'Haha wa watashi no ryuugaku ni sansei shite kuremashita.', exVi: 'Mẹ đã ủng hộ (tán thành) việc tôi đi du học.', more: '**N に{賛成|さんせい}する** (trợ từ **に**, như {反対|はんたい}) · trong họp, thảo luận: **{賛成|さんせい}です／{反対|はんたい}です** · {賛成|さんせい}{意見|いけん}. ～てくれる — ôn Bài 18. N4.' },
        { w: '{投|な}げます［{投|な}げる］2', pos: 'động từ nhóm 2', ipa: 'nagemasu [nageru]', vi: 'ném, quăng', ex: '{公園|こうえん}で{父|ちち}とボールを{投|な}げて{遊|あそ}びました。', exRo: 'Kouen de chichi to booru o nagete asobimashita.', exVi: 'Tôi chơi ném bóng với bố ở công viên.', more: '+ て: {投|な}げて. **N を{投|な}げる** · mệnh lệnh: **{投|な}げろ！** · cấm: **{石|いし}を{投|な}げるな！** · biển công viên viết lịch sự hơn: ボール{遊|あそ}びは{禁止|きんし}です. Chữ **投** là chữ Hán mới. N3.' },
        { w: '{逃|に}げます［{逃|に}げる］2', pos: 'động từ nhóm 2', ipa: 'nigemasu [nigeru]', vi: 'chạy trốn, bỏ chạy; tránh né', ex: '{地震|じしん}のときは、{慌|あわ}てないで{安全|あんぜん}な{場所|ばしょ}へ{逃|に}げてください。', exRo: 'Jishin no toki wa, awatenaide anzen na basho e nigete kudasai.', exVi: 'Khi động đất, đừng hoảng, hãy chạy đến nơi an toàn.', more: '**（nơi）へ／に{逃|に}げる** · **N から{逃|に}げる** (trốn khỏi N) · mệnh lệnh khẩn cấp: **{逃|に}げろ！** (chạy mau!) · tha: {逃|に}がす (thả ra, để xổng). {慌|あわ}てる (hoảng hốt — N3). Chữ **逃** là chữ Hán mới. N3.' },
        { w: '{大声|おおごえ}', pos: 'danh từ', ipa: 'oogoe', vi: 'tiếng to, giọng to', ex: '「{図書館|としょかん}で{大声|おおごえ}を{出|だ}すな」と{父|ちち}によく{言|い}われました。', exRo: '"Toshokan de oogoe o dasu na" to chichi ni yoku iwaremashita.', exVi: 'Tôi hay bị bố nói "Đừng có to tiếng ở thư viện".', more: '**{大声|おおごえ}を{出|だ}す** (to tiếng) · **{大声|おおごえ}で**{話|はな}す／{笑|わら}う／{呼|よ}ぶ. ⚠ Đọc おお**ご**え (âm đục), không ~~おおこえ~~. Ví dụ là câu cấm V{辞書形|じしょけい}＋な (mẫu ⑥) được trích lại. N3.' },
        { w: '{応援|おうえん}します［{応援|おうえん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'ouen shimasu [ouen suru]', vi: 'cổ vũ, ủng hộ', ex: '{日曜日|にちようび}は、{家族|かぞく}みんなで{弟|おとうと}のサッカーの{試合|しあい}を{応援|おうえん}しに{行|い}きます。', exRo: 'Nichiyoubi wa, kazoku minna de otouto no sakkaa no shiai o ouen shi ni ikimasu.', exVi: 'Chủ nhật cả nhà đi cổ vũ trận bóng đá của em trai.', more: '**N を{応援|おうえん}する** (cổ vũ N — trợ từ **を**, khác {賛成|さんせい}／{反対|はんたい} đi với に) · **{応援|おうえん}しています！** (mình luôn ủng hộ bạn — câu động viên) · lời cổ vũ thường là mệnh lệnh: **{頑張|がんば}れ！{負|ま}けるな！** N3.' },
        { w: '{部活|ぶかつ}', pos: 'danh từ', ipa: 'bukatsu', vi: 'hoạt động câu lạc bộ ở trường', ex: '{高校|こうこう}の{部活|ぶかつ}では、{毎朝|まいあさ}6{時|じ}から{練習|れんしゅう}させられました。', exRo: 'Koukou no bukatsu de wa, maiasa rokuji kara renshuu saseraremashita.', exVi: 'Ở câu lạc bộ hồi cấp 3, sáng nào tôi cũng bị bắt tập từ 6 giờ.', more: 'Viết tắt của {部活動|ぶかつどう}. **{部活|ぶかつ}に{入|はい}る** · サッカー{部|ぶ} (CLB bóng đá) · {部活|ぶかつ}の{先輩|せんぱい} (Bài 8) — quan hệ trên dưới rất chặt. Ví dụ có **～させられる** (bị bắt — mẫu ⑨, chỉ cần hiểu). N3.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Chỗ làm & xin phép (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{課長|かちょう}', pos: 'danh từ', ipa: 'kachou', vi: 'trưởng ban, trưởng nhóm (dưới trưởng phòng)', ex: '{課長|かちょう}に、{明日|あした}の{会議|かいぎ}の{資料|しりょう}を{作|つく}るように{言|い}われました。', exRo: 'Kachou ni, ashita no kaigi no shiryou o tsukuru you ni iwaremashita.', exVi: 'Tôi được trưởng ban dặn làm tài liệu cho cuộc họp ngày mai.', more: 'Chức danh — dùng như cách gọi: **{課長|かちょう}、～** (không thêm さん). Thứ bậc: {社長|しゃちょう} > {部長|ぶちょう} > **{課長|かちょう}** > {社員|しゃいん}. Kể với người khác thì gọi chung là **{上司|じょうし}** (cấp trên — Bài 22), không gọi thẳng ~~{上司|じょうし}さん~~. Ví dụ là mẫu ⑧ (～ように{言|い}われる). N4.' },
        { w: '{部下|ぶか}', pos: 'danh từ', ipa: 'buka', vi: 'cấp dưới, nhân viên dưới quyền', ex: '{部長|ぶちょう}は{部下|ぶか}に{新|あたら}しい{仕事|しごと}を{担当|たんとう}させました。', exRo: 'Buchou wa buka ni atarashii shigoto o tantou sasemashita.', exVi: 'Trưởng phòng giao cho cấp dưới phụ trách công việc mới.', more: '{上司|じょうし} ↔ {部下|ぶか}. Câu sai khiến chuẩn ở công ty: **{上司|じょうし}が{部下|ぶか}に～させる** (sếp cho / bắt cấp dưới làm). Ngược lại (cấp dưới → sếp) **không** dùng sai khiến. N3.' },
        { w: '{部長|ぶちょう}', pos: 'danh từ', ipa: 'buchou', vi: 'trưởng phòng, trưởng bộ phận', ex: '{部長|ぶちょう}、{明日|あした}の{会議|かいぎ}で{発表|はっぴょう}させていただけませんか。', exRo: 'Buchou, ashita no kaigi de happyou sasete itadakemasen ka.', exVi: 'Thưa trưởng phòng, ngày mai anh cho em được trình bày ở cuộc họp được không ạ?', more: 'Chức danh dùng như cách gọi: **{部長|ぶちょう}、～** (không thêm さん). Thứ bậc hay gặp: {社長|しゃちょう} (giám đốc) > {部長|ぶちょう} > {課長|かちょう} (trưởng ban) > {社員|しゃいん}. {発表|はっぴょう}する — Bài 20. Ví dụ là mẫu ④. N4.' },
        { w: '{早退|そうたい}します［{早退|そうたい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'soutai shimasu [soutai suru]', vi: 'về sớm (trước giờ tan làm / tan học)', ex: '{熱|ねつ}があったので、{先生|せんせい}に{言|い}って{早退|そうたい}させてもらいました。', exRo: 'Netsu ga atta node, sensei ni itte soutai sasete moraimashita.', exVi: 'Tôi bị sốt nên đã xin thầy cho về sớm.', more: '{早|はや}い + {退|たい} (rút ra) = về sớm. Đối: {遅刻|ちこく} (Bài 16 — đến muộn). Xin phép: **{今日|きょう}は{早退|そうたい}させていただけませんか**. ～させてもらう = được cho làm (mẫu ③). N3.' },
        { w: '{担当|たんとう}します［{担当|たんとう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'tantou shimasu [tantou suru]', vi: 'phụ trách, đảm nhận', ex: 'この{仕事|しごと}は、{私|わたし}に{担当|たんとう}させてください。', exRo: 'Kono shigoto wa, watashi ni tantou sasete kudasai.', exVi: 'Việc này xin để tôi phụ trách.', more: '**N を{担当|たんとう}する** · {担当者|たんとうしゃ} (người phụ trách) · {担当|たんとう}の{先生|せんせい} (giáo viên phụ trách). Câu xung phong: ～は{私|わたし}に{担当|たんとう}させてください. N3.' },
        { w: '～の{代|か}わりに', pos: 'cụm từ', ipa: '~ no kawari ni', vi: 'thay cho ~, thay vì ~', ex: '{今日|きょう}は{母|はは}の{代|か}わりに、{私|わたし}が{弟|おとうと}を{迎|むか}えに{行|い}きます。', exRo: 'Kyou wa haha no kawari ni, watashi ga otouto o mukae ni ikimasu.', exVi: 'Hôm nay tôi đi đón em trai thay cho mẹ.', more: '**N の{代|か}わりに** (thay cho N) · **その{代|か}わり（に）** đầu câu = bù lại (hội thoại ③) · **V{辞書形|じしょけい}{代|か}わりに** = thay vì / đổi lại (N3). {迎|むか}えに{行|い}く — Bài 7. Chữ 代 — Bài 16. N4.' },
        { w: '{意見|いけん}', pos: 'danh từ', ipa: 'iken', vi: 'ý kiến', ex: '{私|わたし}にも{意見|いけん}を{言|い}わせてください。', exRo: 'Watashi ni mo iken o iwasete kudasai.', exVi: 'Xin cho tôi cũng được nêu ý kiến.', more: '**{意見|いけん}を{言|い}う** (nêu ý kiến) · {意見|いけん}が{合|あ}う／{違|ちが}う · {反対|はんたい}{意見|いけん}. Câu xin nói trong cuộc họp: **{一言|ひとこと}{言|い}わせてください** (cho tôi nói một câu). {言|い}う → {言|い}**わ**せる (う → わ). Chữ 意 — Bài 16. N4.' },
        { w: '{任|まか}せます［{任|まか}せる］2', pos: 'động từ nhóm 2', ipa: 'makasemasu [makaseru]', vi: 'giao phó, để (ai) lo', ex: '{料理|りょうり}は{僕|ぼく}に{任|まか}せてください。', exRo: 'Ryouri wa boku ni makasete kudasai.', exVi: 'Nấu ăn cứ để tôi lo.', more: '**N を（ai）に{任|まか}せる** · **{任|まか}せてください** (cứ để tôi lo — tự tin nhận việc). ⚠ Trông giống thể sai khiến (～せる) nhưng là **động từ riêng** — không phải sai khiến của động từ nào. So sánh: {僕|ぼく}にやらせてください (xin được làm) ≈ {僕|ぼく}に{任|まか}せてください (cứ giao cho tôi). N3.' },
        { w: '{報告|ほうこく}します［{報告|ほうこく}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'houkoku shimasu [houkoku suru]', vi: 'báo cáo', ex: '{仕事|しごと}が{終|お}わったら、すぐ{上司|じょうし}に{報告|ほうこく}するように{言|い}われています。', exRo: 'Shigoto ga owattara, sugu joushi ni houkoku suru you ni iwarete imasu.', exVi: 'Tôi được dặn là xong việc thì báo cáo ngay với sếp.', more: '**（ai）に N を{報告|ほうこく}する** · {報告書|ほうこくしょ} (bản báo cáo). Công ty Nhật dạy nhân viên mới **ホウレンソウ** = {報告|ほうこく}・{連絡|れんらく}・{相談|そうだん} (báo cáo – liên lạc – bàn bạc). Chữ 報 — Bài 20. N3.' },
        { w: '{指示|しじ}', pos: 'danh từ / động từ nhóm 3 (指示する)', ipa: 'shiji', vi: 'chỉ thị, hướng dẫn (của cấp trên)', ex: '{部長|ぶちょう}の{指示|しじ}どおりに、{資料|しりょう}を{作|つく}りました。', exRo: 'Buchou no shiji doori ni, shiryou o tsukurimashita.', exVi: 'Tôi đã làm tài liệu đúng theo chỉ thị của trưởng phòng.', more: '**{指示|しじ}を{出|だ}す／{受|う}ける** · **～の{指示|しじ}どおりに** (đúng theo chỉ thị — どおり Bài 20). Khi thuật lại chỉ thị: {部長|ぶちょう}に～ように{言|い}われました (mẫu ⑧). {資料|しりょう} = tài liệu (N3). Chữ 指 — Bài 17. N3.' },
      ],
    },

    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra từ (chạm thẻ để nghe)',
      items: [
        { anh: 'teddy-bear', w: 'おもちゃ', ro: 'omocha', vi: 'đồ chơi (hình: gấu bông)' },
        { anh: 'school', w: '{幼稚園|ようちえん}', ro: 'youchien', vi: 'trường mẫu giáo (hình: trường học)' },
        { anh: 'shopping-bags', w: 'お{使|つか}い', ro: 'otsukai', vi: 'đi mua đồ giúp (hình: túi đồ)' },
        { anh: 'house', w: '{留守番|るすばん}', ro: 'rusuban', vi: 'trông nhà (hình: ngôi nhà)' },
        { anh: 'musical-keyboard', w: '{習|なら}い{事|ごと}', ro: 'naraigoto', vi: 'môn học năng khiếu (hình: đàn phím)' },
        { anh: 'notebook', w: '{塾|じゅく}', ro: 'juku', vi: 'lớp học thêm (hình: vở)' },
        { anh: 'sponge', w: '{皿洗|さらあら}い', ro: 'saraarai', vi: 'rửa bát (hình: miếng bọt biển)' },
        { anh: 't-shirt', w: '{洗濯物|せんたくもの}を{干|ほ}す', ro: 'sentakumono o hosu', vi: 'phơi đồ (hình: áo phông)' },
        { anh: 'basket', w: '{洗濯物|せんたくもの}を{畳|たた}む', ro: 'sentakumono o tatamu', vi: 'gấp quần áo (hình: giỏ đồ)' },
        { anh: 'dress', w: '{着替|きが}える', ro: 'kigaeru', vi: 'thay quần áo (hình: váy)' },
        { anh: 'lady-beetle', w: '{虫|むし}', ro: 'mushi', vi: 'côn trùng (hình: bọ rùa)' },
        { anh: 'face-with-tongue', w: 'いたずら', ro: 'itazura', vi: 'trò nghịch (hình: mặt lè lưỡi)' },
        { anh: 'person-bowing', w: '{反省|はんせい}する', ro: 'hansei suru', vi: 'hối lỗi (hình: cúi đầu)' },
        { anh: 'pouting-face', w: 'わがまま', ro: 'wagamama', vi: 'đòi hỏi, ương bướng (hình: mặt dỗi)' },
        { anh: 'broccoli', w: '{好|す}き{嫌|きら}い', ro: 'sukikirai', vi: 'kén ăn (hình: bông cải trẻ con hay chê)' },
        { anh: 'megaphone', w: '{命令|めいれい}', ro: 'meirei', vi: 'mệnh lệnh (hình: loa)' },
        { anh: 'baseball', w: '{投|な}げる', ro: 'nageru', vi: 'ném (hình: bóng chày)' },
        { anh: 'person-running', w: '{逃|に}げる', ro: 'nigeru', vi: 'chạy trốn (hình: người chạy)' },
        { anh: 'loudspeaker', w: '{大声|おおごえ}', ro: 'oogoe', vi: 'tiếng to (hình: loa phát)' },
        { anh: 'clapping-hands', w: '{応援|おうえん}する', ro: 'ouen suru', vi: 'cổ vũ (hình: vỗ tay)' },
        { anh: 'soccer-ball', w: '{部活|ぶかつ}', ro: 'bukatsu', vi: 'câu lạc bộ ở trường (hình: bóng đá)' },
        { anh: 'man-office-worker', w: '{課長|かちょう}', ro: 'kachou', vi: 'trưởng ban (hình: nhân viên văn phòng)' },
        { anh: 'loudly-crying-face', w: '{泣|な}き{虫|むし}', ro: 'nakimushi', vi: 'mít ướt (hình: mặt khóc to)' },
        { anh: 'clipboard', w: '{報告|ほうこく}する', ro: 'houkoku suru', vi: 'báo cáo (hình: bảng kẹp giấy)' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ của bài + mẫu ngữ pháp của bài — học thành cụm để nói ngay',
      head: ['Từ', 'Cụm với mẫu của bài', 'Romaji', 'Nghĩa'],
      rows: [
        ['{塾|じゅく}', '{子|こ}どもを{塾|じゅく}に{行|い}か**せる**', 'kodomo o juku ni ikaseru', 'cho / bắt con đi học thêm (②)'],
        ['{習|なら}い{事|ごと}', '{子|こ}どもに{習|なら}い{事|ごと}を**させる**', 'kodomo ni naraigoto o saseru', 'cho con học năng khiếu (②)'],
        ['{飼|か}う (Bài 22)', '{犬|いぬ}を{飼|か}わ**せてくれた**', 'inu o kawasete kureta', '(bố mẹ) đã cho tôi nuôi chó (③)'],
        ['{留守番|るすばん}', '{子|こ}どもに{留守番|るすばん}を**させる**', 'kodomo ni rusuban o saseru', 'để con ở nhà trông nhà (②)'],
        ['{親|おや}', '{親|おや}を{心配|しんぱい}**させる**', 'oya o shinpai saseru', 'làm bố mẹ lo (③ — cảm xúc)'],
        ['{早退|そうたい}する', '{早退|そうたい}**させていただけませんか**', 'soutai sasete itadakemasen ka', 'cho tôi về sớm được không ạ (④)'],
        ['{担当|たんとう}する', '{私|わたし}に{担当|たんとう}**させてください**', 'watashi ni tantou sasete kudasai', 'xin để tôi phụ trách (④)'],
        ['{逃|に}げる', '{逃|に}げ**ろ**！', 'nigero!', 'chạy mau! (⑤)'],
        ['{投|な}げる', '{石|いし}を{投|な}げる**な**！', 'ishi o nageru na!', 'đừng ném đá! (⑥)'],
        ['{残|のこ}す', '{残|のこ}さないで{食|た}べ**なさい**', 'nokosanaide tabenasai', 'ăn hết đi, đừng để thừa (⑦)'],
        ['{報告|ほうこく}する', 'すぐ{報告|ほうこく}する**ように{言|い}われた**', 'sugu houkoku suru you ni iwareta', 'được dặn báo cáo ngay (⑧)'],
        ['{注意|ちゅうい}する (Bài 22)', '{遅|おく}れない**ように{注意|ちゅうい}した**', 'okurenai you ni chuui shita', 'đã nhắc (ai) đừng đến muộn (⑧)'],
        ['{部活|ぶかつ}', '{毎朝|まいあさ}{練習|れんしゅう}**させられた**', 'maiasa renshuu saserareta', 'sáng nào cũng bị bắt tập (⑨)'],
      ],
    },
    {
      t: 'table',
      caption: 'Hai cặp tự động từ ↔ tha động từ của bài — が ↔ を',
      head: ['Tự động từ (N が ～)', 'Romaji', 'Tha động từ (N を ～)', 'Romaji', 'Ví dụ cặp'],
      rows: [
        ['{育|そだ}つ (1)', 'sodatsu', '{育|そだ}てる (2)', 'sodateru', '{子|こ}どもが{育|そだ}つ ／ {子|こ}どもを{育|そだ}てる'],
        ['{残|のこ}る (1)', 'nokoru', '{残|のこ}す (1)', 'nokosu', 'ご{飯|はん}が{残|のこ}る ／ ご{飯|はん}を{残|のこ}す'],
        ['{逃|に}げる (2)', 'nigeru', '{逃|に}がす (1 — N3)', 'nigasu', '{犬|いぬ}が{逃|に}げる ／ {虫|むし}を{逃|に}がす'],
      ],
    },
    {
      t: 'note',
      title: '⚠ Bốn động từ trông như thể sai khiến nhưng là TỪ RIÊNG',
      items: [
        '**{任|まか}せる** (giao phó — từ của bài) · **{見|み}せる** (cho xem — đã học) · **{知|し}らせる** (báo cho biết — N3) · **{寝|ね}かせる** (cho ngủ, ru ngủ — N3). Bốn từ này kết thúc bằng ～せる nhưng **tra từ điển như từ riêng**.',
        '{写真|しゃしん}を**{見|み}せて**ください (cho tôi xem ảnh) — khác **{見|み}させて**ください (cho tôi được xem — xin phép xem). {結果|けっか}を**{知|し}らせます** (tôi sẽ báo kết quả). {赤|あか}ちゃんを**{寝|ね}かせる** (ru con ngủ) — {寝|ね}させる nghĩa là "để / bắt (ai) đi ngủ".',
        'Mẹo: thể sai khiến **luôn có gốc là một động từ khác** ({行|い}かせる ← {行|い}く). {任|まか}せる không có ~~{任|まか}す~~ nào thường dùng làm gốc ở cấp N4 → coi như từ riêng.',
      ],
    },
    {
      t: 'note',
      title: 'Từ dễ nhầm trong bài',
      items: [
        '**{頃|ころ} ↔ ごろ ↔ とき** — **{子|こ}どもの{頃|ころ}** = thuở / hồi (một giai đoạn dài); **3{時|じ}ごろ** = khoảng (sau số — đọc ごろ); **{子|こ}どものとき** (ポイント 101) ≈ {子|こ}どもの{頃|ころ} — nhưng **とき** còn dùng cho một **lúc cụ thể** ({駅|えき}に{着|つ}いたとき), còn {頃|ころ} chỉ dùng cho **giai đoạn**, thời điểm ước chừng.',
        '**{親|おや} ↔ {両親|りょうしん} ↔ ご{両親|りょうしん}** — {親|おや}: bố hoặc mẹ / bố mẹ nói chung ({親|おや}の{気持|きも}ち); {両親|りょうしん}: cả bố lẫn mẹ (của mình); ご{両親|りょうしん}: bố mẹ của người nghe / người khác (kính trọng).',
        '**{厳|きび}しい ↔ {怖|こわ}い ↔ うるさい** (bố mẹ "khó") — {厳|きび}しい: **nghiêm**, quy tắc chặt (đánh giá trung tính, có khi khen); {怖|こわ}い: **đáng sợ**; うるさい: **hay càm ràm** (văn nói, chê). {母|はは}は{厳|きび}しかったけど、{優|やさ}しかった — được; ~~{母|はは}は{怖|こわ}かったけど{優|やさ}しかった~~ nghe lạ.',
        '**{注意|ちゅうい}する ↔ しかる ↔ {怒|おこ}る** — {注意|ちゅうい}する: **nhắc** (nhẹ nhất); しかる (Bài 19): **mắng để dạy** (người trên → người dưới); {怒|おこ}る (Bài 19): **nổi giận** (cảm xúc, ai cũng có thể). {先生|せんせい}に{注意|ちゅうい}された < しかられた; {友達|ともだち}が{怒|おこ}った (không nói ~~{友達|ともだち}がしかった~~).',
        '**{塾|じゅく} ↔ {習|なら}い{事|ごと} ↔ {部活|ぶかつ}** — {塾|じゅく}: học thêm **môn văn hoá / luyện thi** ngoài trường; {習|なら}い{事|ごと}: học **năng khiếu** (đàn, bơi, thư pháp) ngoài trường; {部活|ぶかつ}: **câu lạc bộ trong trường** (thể thao, âm nhạc).',
        '**{飼|か}う ↔ {育|そだ}てる** — {飼|か}う: nuôi **con vật** (chó, mèo, cá); {育|そだ}てる: nuôi dạy **con người**, trồng **cây**. ~~{子|こ}どもを{飼|か}う~~ là sai nặng. Và nhớ {飼|か}う ≠ {買|か}う (mua) — cùng âm かう.',
        '**{賛成|さんせい}する／{反対|はんたい}する ↔ {応援|おうえん}する** — {賛成|さんせい}／{反対|はんたい}: **N に**～ (tán thành / phản đối một ý kiến, kế hoạch); {応援|おうえん}: **N を**～ (cổ vũ một người, một đội). {彼|かれ}の{意見|いけん}**に**{賛成|さんせい}する · チーム**を**{応援|おうえん}する.',
        '**{許可|きょか} ↔ {許|ゆる}す** — {許可|きょか}: sự cho phép **chính thức** (có thủ tục, của tổ chức, cấp trên): {許可|きょか}を{取|と}る; {許|ゆる}す (Bài 19): **tha thứ**, và cho phép trong đời thường: {父|ちち}は{一人旅|ひとりたび}を{許|ゆる}してくれなかった.',
        '**{上司|じょうし} ↔ {部長|ぶちょう}** — {上司|じょうし}: từ chỉ quan hệ "cấp trên của tôi" (kể cho người khác nghe); {部長|ぶちょう}: **chức danh**, dùng được để gọi trực tiếp: {部長|ぶちょう}、お{願|ねが}いがあるんですが…',
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '**{子|こ}どもの{頃|ころ}**／**{小|ちい}さい{頃|ころ}**／**{幼|おさな}い{頃|ころ}** · {幼稚園|ようちえん}**に{通|かよ}う** · **{大人|おとな}になる** · {子|こ}ども**を{厳|きび}しく{育|そだ}てる** · {田舎|いなか}**で{育|そだ}つ** · {親|おや}**の{言|い}うことを{聞|き}く** · {子|こ}ども**に{厳|きび}しい**／**{甘|あま}い** · {孫|まご}**を{甘|あま}やかす** · {昔|むかし}の{写真|しゃしん}**が{懐|なつ}かしい** · おもちゃ**で{遊|あそ}ぶ**',
        '**お{使|つか}いに{行|い}く** · **{留守番|るすばん}をする** · {習|なら}い{事|ごと}**をする** · {塾|じゅく}**に{通|かよ}う** · {犬|いぬ}**の{世話|せわ}をする** · ペット**を{飼|か}う** · {洗濯物|せんたくもの}**を{干|ほ}す**／**{畳|たた}む** · {布団|ふとん}**を{干|ほ}す** · **パジャマに{着替|きが}える** · {虫|むし}**を{取|と}る**／**に{刺|さ}される**',
        '**いたずらをする** · {自分|じぶん}のしたこと**を{反省|はんせい}する** · {歯医者|はいしゃ}に{行|い}くの**を{嫌|いや}がる** · **わがままを{言|い}う** · **{好|す}き{嫌|きら}いが{多|おお}い**／**をする** · ご{飯|はん}**を{残|のこ}す** · {先生|せんせい}**に{注意|ちゅうい}される** · {車|くるま}**に{注意|ちゅうい}する** · **{素直|すなお}に{謝|あやま}る**',
        '**{命令|めいれい}を{出|だ}す** · **{許可|きょか}を{取|と}る**／**もらう** · {計画|けいかく}**に{反対|はんたい}する**／**{賛成|さんせい}する** · ボール**を{投|な}げる** · **{安全|あんぜん}な{場所|ばしょ}へ{逃|に}げる** · **{大声|おおごえ}を{出|だ}す** · チーム**を{応援|おうえん}する** · **{部活|ぶかつ}に{入|はい}る**',
        '**{上司|じょうし}に{報告|ほうこく}する** · {部下|ぶか}**に{仕事|しごと}を{任|まか}せる** · {仕事|しごと}**を{担当|たんとう}する** · **{早退|そうたい}させてもらう** · {母|はは}**の{代|か}わりに** · **{意見|いけん}を{言|い}う** · **{指示|しじ}を{出|だ}す**／**{受|う}ける** · {部長|ぶちょう}**の{指示|しじ}どおりに**',
      ],
    },
    {
      t: 'write',
      id: 'b23-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['子どもの頃', '幼い', '大人', '厳しい', '皿洗い', '泣き虫', '命令', '許可', '反対', '投げる'],
      goi: {
        '子どもの頃': 'こどものころ · hồi nhỏ',
        '幼い': 'おさない · còn nhỏ, thơ ấu',
        '大人': 'おとな · người lớn',
        '厳しい': 'きびしい · nghiêm khắc',
        '皿洗い': 'さらあらい · rửa bát',
        '泣き虫': 'なきむし · mít ướt',
        '命令': 'めいれい · mệnh lệnh',
        '許可': 'きょか · sự cho phép',
        '反対': 'はんたい · phản đối',
        '投げる': 'なげる · ném',
      },
    },
    {
      t: 'mcq',
      id: 'b23-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 14 câu (dạng 文脈規定・言い換え類義・用法 của đề N4)',
      items: [
        { q: '{子|こ}どもの（　）、よく{川|かわ}で{泳|およ}ぎました。', options: ['{頃|ころ}', 'ごろ', '{間|あいだ}', '{前|まえ}'], correct: 0, why: 'Thuở / hồi nhỏ = **{子|こ}どもの{頃|ころ}**. ごろ chỉ đứng sau số (3{時|じ}ごろ). 〔Kodomo no koro, yoku kawa de oyogimashita.〕' },
        { q: 'うちの{父|ちち}はとても（　）、{夜|よる}9{時|じ}からはテレビを{見|み}させてくれませんでした。', options: ['{素直|すなお}で', '{厳|きび}しくて', '{懐|なつ}かしくて', '{幼|おさな}くて'], correct: 1, why: 'Không cho xem ti vi = bố **nghiêm khắc**: **{厳|きび}しくて**. 〔Chichi wa totemo kibishikute…〕' },
        { q: '{両親|りょうしん}が{旅行|りょこう}に{行|い}っている{間|あいだ}、{一人|ひとり}で（　）をしました。', options: ['お{使|つか}い', '{留守番|るすばん}', '{世話|せわ}', '{命令|めいれい}'], correct: 1, why: 'Bố mẹ đi vắng, mình ở nhà một mình = **{留守番|るすばん}**. 〔Hitori de rusuban o shimashita.〕' },
        { q: 'このマンションでは、ペットを（　）はいけないことになっています。', options: ['{買|か}って', '{育|そだ}てて', '{飼|か}って', '{干|ほ}して'], correct: 2, why: 'Nuôi thú cưng = **ペットを{飼|か}う**. {買|か}う (mua) cùng âm — bẫy! {育|そだ}てる dùng cho người, cây. 〔Petto o katte wa ikenai…〕' },
        { q: '{雨|あめ}が{降|ふ}りそうなので、{洗濯物|せんたくもの}を{外|そと}に（　）のはやめましょう。', options: ['{畳|たた}む', '{着替|きが}える', '{干|ほ}す', '{残|のこ}す'], correct: 2, why: 'Phơi đồ ngoài trời = **{洗濯物|せんたくもの}を{干|ほ}す**. 〔Sentakumono o soto ni hosu no wa yamemashou.〕' },
        { q: '{弟|おとうと}は{注射|ちゅうしゃ}を（　）、{大|おお}きい{声|こえ}で{泣|な}きました。', options: ['{嫌|いや}がって', '{嫌|きら}いで', '{反省|はんせい}して', '{応援|おうえん}して'], correct: 0, why: 'Nói thái độ của **người khác** (em trai) → **{嫌|いや}がる**. 〔Chuusha o iyagatte…〕' },
        { q: '{出|だ}された{料理|りょうり}は{全部|ぜんぶ}{食|た}べなさい。{残|のこ}しては{駄目|だめ}よ。（　）をしないで。', options: ['わがまま', '{好|す}き{嫌|きら}い', 'いたずら', '{意見|いけん}'], correct: 1, why: 'Không ăn hết vì chê món = **{好|す}き{嫌|きら}いをする** (kén ăn). 〔Sukikirai o shinaide.〕' },
        { q: '{授業中|じゅぎょうちゅう}にスマホを{見|み}ていたら、{先生|せんせい}に（　）されました。', options: ['{注意|ちゅうい}', '{賛成|さんせい}', '{応援|おうえん}', '{担当|たんとう}'], correct: 0, why: 'Bị thầy nhắc = **{注意|ちゅうい}される**. 〔Sensei ni chuui saremashita.〕' },
        { q: 'サッカーの{試合|しあい}で、{家族|かぞく}みんなで{兄|あに}のチームを（　）しました。', options: ['{反対|はんたい}', '{賛成|さんせい}', '{応援|おうえん}', '{報告|ほうこく}'], correct: 2, why: 'Cổ vũ đội = **チームを{応援|おうえん}する** (trợ từ を). 〔Chiimu o ouen shimashita.〕' },
        { q: '{熱|ねつ}があったので、{会社|かいしゃ}を（　）させてもらいました。', options: ['{遅刻|ちこく}', '{早退|そうたい}', '{担当|たんとう}', '{反省|はんせい}'], correct: 1, why: 'Bị sốt → xin **về sớm** = **{早退|そうたい}**. 〔Kaisha o soutai sasete moraimashita.〕' },
        { q: '「{父|ちち}は{私|わたし}の{留学|りゅうがく}に{反対|はんたい}しました。」と{意味|いみ}が{近|ちか}いのは？', options: ['{父|ちち}は{留学|りゅうがく}してもいいと{言|い}いました。', '{父|ちち}は{留学|りゅうがく}しないほうがいいと{言|い}いました。', '{父|ちち}も{留学|りゅうがく}したいと{言|い}いました。', '{父|ちち}は{私|わたし}の{留学|りゅうがく}を{応援|おうえん}しました。'], correct: 1, why: '{反対|はんたい}する = không đồng ý → **しないほうがいいと{言|い}った**. Lựa chọn ① và ④ là {賛成|さんせい}. (dạng 言い換え類義)' },
        { q: '「この{仕事|しごと}は{私|わたし}に{任|まか}せてください。」と{意味|いみ}が{近|ちか}いのは？', options: ['この{仕事|しごと}は{私|わたし}にやらせてください。', 'この{仕事|しごと}を{手伝|てつだ}ってください。', 'この{仕事|しごと}はやりたくないです。', 'この{仕事|しごと}を{教|おし}えてください。'], correct: 0, why: '{任|まか}せてください (cứ giao cho tôi) ≈ **やらせてください** (xin để tôi làm). (dạng 言い換え類義)' },
        { q: '「{懐|なつ}かしい」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{明日|あした}の{試験|しけん}が{懐|なつ}かしいです。', '{国|くに}にいる{母|はは}が{懐|なつ}かしくて、{毎日|まいにち}{電話|でんわ}します。', '{小学校|しょうがっこう}の{写真|しゃしん}を{見|み}て、とても{懐|なつ}かしくなりました。', 'この{料理|りょうり}は{懐|なつ}かしいので、{初|はじ}めて{食|た}べます。'], correct: 2, why: '{懐|なつ}かしい = bồi hồi khi gặp lại thứ của **quá khứ** (ảnh hồi tiểu học). Nhớ người đang xa → {会|あ}いたい／{寂|さび}しい. (dạng 用法)' },
        { q: '「{育|そだ}つ」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{私|わたし}は{子|こ}どもを{三人|さんにん}{育|そだ}ちました。', '{私|わたし}は{北海道|ほっかいどう}で{生|う}まれて、{東京|とうきょう}で{育|そだ}ちました。', '{毎朝|まいあさ}{犬|いぬ}を{育|そだ}ちます。', '{庭|にわ}でトマトを{育|そだ}ちています。'], correct: 1, why: '{育|そだ}つ là **tự động từ** (lớn lên) — không đi với を. Nuôi con / trồng cây → {育|そだ}てる. (dạng 用法)' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b23-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N4 — thể sai khiến ～させる (bắt / cho: を・に), ～させてください, thể mệnh lệnh, cấm ～な, ～なさい, ～ように言う',
  goal: 'Chia đúng thể sai khiến của mọi động từ (3 nhóm + bẫy 言わせる・待たせる・話させる・帰らせる・来させる, không "さ thừa" ~~休まさせる~~); dùng A は B を V(さ)せる (tự động từ) và A は B に N を V(さ)せる (tha động từ) để nói BẮT làm, cùng thể đó để nói CHO làm (～させてくれる・～させてもらう) và GÂY cảm xúc (心配させる・待たせる); xin được làm bằng ～させてください／～させてもらえませんか／～させていただけませんか; chia và hiểu thể mệnh lệnh (行け・食べろ・しろ・来い・くれ), câu cấm V辞書形＋な, câu bảo Vます＋なさい — biết ai được nói, nói lúc nào; nói lại lời dặn bằng ～ように言う・頼む・注意する・伝える／～ように言われる; và nhận ra thể sai khiến bị động ～させられる (bị bắt làm — N3).',
  minutes: 130,
  blocks: [
    {
      t: 'p',
      text: 'Bài 23 xoay quanh **một câu hỏi: AI MUỐN việc này xảy ra, và AI LÀM?** — **(1)** Người A muốn, **người B làm** → **thể sai khiến**: A が B に～**させる** ("A bắt / cho B làm"). **(2)** Người nói muốn **chính mình** được làm, xin người khác đồng ý → **～させてください**. **(3)** Người nói muốn **người nghe** làm, và nói **thẳng, mạnh** → **thể mệnh lệnh** ({走|はし}れ), **cấm** ({走|はし}るな), **～なさい**. **(4)** Kể lại cho người thứ ba rằng **ai đó đã muốn mình / người khác làm gì** → **～ように{言|い}う／{言|い}われる**. Và khi **chính mình là B bị bắt làm** điều không muốn → **～させられる** (N3 — chỉ nhận ra). Học kỹ **bảng chia** đầu tiên — đề N4 hỏi cách chia nhiều nhất ở bài này.',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 23',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', 'Thể sai khiến V(さ)せる', 'cách chia 3 nhóm', '{行|い}く → {行|い}かせる · {食|た}べる → {食|た}べさせる', 'N4'],
        ['②', 'A は B を V(さ)せる ／ A は B に N を V(さ)せる', 'A BẮT B làm', '{母|はは}は{弟|おとうと}に{野菜|やさい}を{食|た}べさせた。', 'N4'],
        ['③', 'A は B に（を） V(さ)せる · ～させてくれる／もらう · B を {心配|しんぱい}させる', 'A CHO / ĐỂ B làm · làm B (lo, chờ, cười…)', '{父|ちち}は{留学|りゅうがく}させてくれた。', 'N4'],
        ['④', 'V(さ)せてください ／ もらえませんか ／ いただけませんか', 'xin (cho tôi) được làm', '{早|はや}く{帰|かえ}らせていただけませんか。', 'N4'],
        ['⑤', 'Thể mệnh lệnh', 'làm đi! (mạnh)', '{走|はし}れ！ {食|た}べろ！ しろ！ {来|こ}い！', 'N4'],
        ['⑥', 'V{辞書形|じしょけい} ＋ な', 'cấm — đừng…!', '{触|さわ}るな！', 'N4'],
        ['⑦', 'Vます ＋ なさい', 'hãy… (bố mẹ, thầy cô → trẻ)', '{早|はや}く{寝|ね}なさい。', 'N4'],
        ['⑧', 'V{辞書形|じしょけい}／Vない ＋ ように{言|い}う・{頼|たの}む・{注意|ちゅうい}する', 'nói lại lời dặn, yêu cầu', '{先生|せんせい}に{遅|おく}れないように{言|い}われた。', 'N4'],
        ['⑨', 'V(さ)せられる ／ ～される', 'bị bắt làm (nhận ra)', '{野菜|やさい}を{食|た}べさせられた。', 'N3'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG CHIA TRỌN BÀI — 4 thể mới đặt cạnh thể khả năng (Bài 16) và thể bị động (Bài 22)',
      head: ['Thể từ điển', 'Nhóm', 'Khả năng (Bài 16)', 'Bị động (Bài 22)', 'Sai khiến ①', 'Sai khiến bị động ⑨', 'Mệnh lệnh ⑤', 'Cấm ⑥'],
      rows: [
        ['{書|か}く', '1', '{書|か}ける', '{書|か}かれる', '{書|か}か**せる**', '{書|か}か**される**', '{書|か}**け**', '{書|か}く**な**'],
        ['{行|い}く', '1', '{行|い}ける', '{行|い}かれる', '{行|い}か**せる**', '{行|い}か**される**', '{行|い}**け**', '{行|い}く**な**'],
        ['{飲|の}む', '1', '{飲|の}める', '{飲|の}まれる', '{飲|の}ま**せる**', '{飲|の}ま**される**', '{飲|の}**め**', '{飲|の}む**な**'],
        ['{待|ま}つ', '1', '{待|ま}てる', '{待|ま}たれる', '{待|ま}た**せる**', '{待|ま}た**される**', '{待|ま}**て**', '{待|ま}つ**な**'],
        ['{言|い}う', '1', '{言|い}える', '{言|い}われる', '{言|い}わ**せる**', '{言|い}わ**される**', '{言|い}**え**', '{言|い}う**な**'],
        ['{話|はな}す', '1', '{話|はな}せる', '{話|はな}される', '{話|はな}さ**せる**', '{話|はな}さ**せられる** (không rút gọn)', '{話|はな}**せ**', '{話|はな}す**な**'],
        ['{帰|かえ}る', '1 (ngoại lệ)', '{帰|かえ}れる', '{帰|かえ}られる', '{帰|かえ}ら**せる**', '{帰|かえ}ら**される**', '{帰|かえ}**れ**', '{帰|かえ}る**な**'],
        ['{食|た}べる', '2', '{食|た}べられる', '{食|た}べられる', '{食|た}べ**させる**', '{食|た}べ**させられる**', '{食|た}べ**ろ**', '{食|た}べる**な**'],
        ['{見|み}る', '2', '{見|み}られる', '{見|み}られる', '{見|み}**させる**', '{見|み}**させられる**', '{見|み}**ろ**', '{見|み}る**な**'],
        ['する', '3', 'できる', 'される', '**させる**', '**させられる**', '**しろ**', 'する**な**'],
        ['{来|く}る', '3', '{来|こ}られる', '{来|こ}られる', '{来|こ}**させる** (こさせる)', '{来|こ}**させられる**', '**{来|こ}い** (こい)', '{来|く}る**な** (くるな)'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bảng chia — ba "con đường" của nhóm 1',
      items: [
        '**Nhóm 1 đi qua ba hàng của bảng kana**: thể khả năng & mệnh lệnh dùng hàng **え** ({書|か}**け**る, {書|か}**け**); bị động & sai khiến dùng hàng **あ** ({書|か}**か**れる, {書|か}**か**せる); cấm dùng **thể từ điển** ({書|か}**く**な). Với **う** cuối → hàng あ là **わ**: {言|い}**わ**せる, {買|か}**わ**せる, {習|なら}**わ**せる (không phải ~~{言|い}あせる~~).',
        '**Nhóm 2 chỉ cần bỏ る**: + **させる** (sai khiến), + **ろ** (mệnh lệnh), + **られる** (khả năng = bị động — trùng nhau). **Nhóm 3 học thuộc**: させる・しろ・させられる; {来|こ}させる・{来|こ}い・{来|こ}させられる.',
        '**Thể sai khiến chia như một động từ nhóm 2**: {行|い}かせ**ます**, {行|い}かせ**ない**, {行|い}かせ**て**, {行|い}かせ**た**, {行|い}かせ**たい**, {行|い}かせ**てください**. Vì vậy ～させてください, ～させてくれる, ～させたい đều chia rất đều.',
        '⚠ **Bẫy hình dạng giống nhau**: {書|か}**け** (mệnh lệnh) ↔ {書|か}**ける** (khả năng); {帰|かえ}**れ** ↔ {帰|かえ}**れる**; {話|はな}**せ** ↔ {話|はな}**せる** ↔ {話|はな}**させる** (ba từ khác nhau!). Nhóm 2: {食|た}べ**られる** vừa là khả năng vừa là bị động — xem ngữ cảnh.',
      ],
    },

    /* ══════ ① THỂ SAI KHIẾN — CÁCH CHIA ══════ */
    { t: 'h', text: '① Thể sai khiến V(さ)せる (使役形) — cách chia đủ 3 nhóm' },
    {
      t: 'p',
      text: '**Thể sai khiến** (使役形 しえきけい) biến "B làm V" thành "**A cho / bắt B làm V**". Một thể — hai nghĩa đối lập (**bắt** hay **cho**) — ngữ cảnh và các từ đi kèm (～てくれる, ～てもらう, ～てください) sẽ quyết định (mẫu ②, ③). Trước hết là **cách chia**: nhóm 1 đổi **う段 → あ段 ＋ せる**; nhóm 2 **bỏ る ＋ させる**; nhóm 3 **する → させる, {来|く}る → {来|こ}させる**. Sau đó, thể sai khiến **chia tiếp như động từ nhóm 2** (～せます, ～せない, ～せて, ～せた).',
    },
    {
      t: 'table',
      caption: 'Nhóm 1 — đổi âm cuối sang hàng あ ＋ せる (う → わ)',
      head: ['Đuôi', 'Thể từ điển', 'Sai khiến', 'Romaji', 'Thể ます của sai khiến'],
      rows: [
        ['～う → ～わせる', '{言|い}う · {買|か}う · {習|なら}う · {手伝|てつだ}う · {使|つか}う', '{言|い}**わせる** · {買|か}**わせる** · {習|なら}**わせる** · {手伝|てつだ}**わせる** · {使|つか}**わせる**', 'iwaseru · kawaseru · narawaseru · tetsudawaseru · tsukawaseru', '{言|い}わせます · {習|なら}わせます'],
        ['～く → ～かせる', '{行|い}く · {書|か}く · {聞|き}く · {働|はたら}く', '{行|い}**かせる** · {書|か}**かせる** · {聞|き}**かせる** · {働|はたら}**かせる**', 'ikaseru · kakaseru · kikaseru · hatarakaseru', '{行|い}かせます'],
        ['～ぐ → ～がせる', '{泳|およ}ぐ · {急|いそ}ぐ', '{泳|およ}**がせる** · {急|いそ}**がせる**', 'oyogaseru · isogaseru', '{泳|およ}がせます'],
        ['～す → ～させる', '{話|はな}す · {出|だ}す · {干|ほ}す · {残|のこ}す', '{話|はな}**させる** · {出|だ}**させる** · {干|ほ}**させる** · {残|のこ}**させる**', 'hanasaseru · dasaseru · hosaseru · nokosaseru', '{話|はな}させます'],
        ['～つ → ～たせる', '{待|ま}つ · {立|た}つ · {持|も}つ', '{待|ま}**たせる** · {立|た}**たせる** · {持|も}**たせる**', 'mataseru · tataseru · motaseru', '{待|ま}たせます'],
        ['～ぶ → ～ばせる', '{遊|あそ}ぶ · {呼|よ}ぶ · {選|えら}ぶ · {喜|よろこ}ぶ', '{遊|あそ}**ばせる** · {呼|よ}**ばせる** · {選|えら}**ばせる** · {喜|よろこ}**ばせる**', 'asobaseru · yobaseru · erabaseru · yorokobaseru', '{遊|あそ}ばせます'],
        ['～む → ～ませる', '{飲|の}む · {読|よ}む · {休|やす}む · {畳|たた}む', '{飲|の}**ませる** · {読|よ}**ませる** · {休|やす}**ませる** · {畳|たた}**ませる**', 'nomaseru · yomaseru · yasumaseru · tatamaseru', '{休|やす}ませます'],
        ['～る → ～らせる', '{作|つく}る · {座|すわ}る · {走|はし}る · {帰|かえ}る · {入|はい}る', '{作|つく}**らせる** · {座|すわ}**らせる** · {走|はし}**らせる** · {帰|かえ}**らせる** · {入|はい}**らせる**', 'tsukuraseru · suwaraseru · hashiraseru · kaeraseru · hairaseru', '{帰|かえ}らせます'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 2 và nhóm 3',
      head: ['Nhóm', 'Thể từ điển', 'Sai khiến', 'Romaji'],
      rows: [
        ['2 (bỏ る ＋ させる)', '{食|た}べる · {見|み}る · {起|お}きる · {寝|ね}る · {着替|きが}える · {投|な}げる · {覚|おぼ}える', '{食|た}べ**させる** · {見|み}**させる** · {起|お}き**させる** · {寝|ね}**させる** · {着替|きが}え**させる** · {投|な}げ**させる** · {覚|おぼ}え**させる**', 'tabesaseru · misaseru · okisaseru · nesaseru · kigaesaseru · nagesaseru · oboesaseru'],
        ['3 — する', 'する · {勉強|べんきょう}する · {練習|れんしゅう}する · {留学|りゅうがく}する · {心配|しんぱい}する', '**させる** · {勉強|べんきょう}**させる** · {練習|れんしゅう}**させる** · {留学|りゅうがく}**させる** · {心配|しんぱい}**させる**', 'saseru · benkyou saseru · renshuu saseru · ryuugaku saseru · shinpai saseru'],
        ['3 — {来|く}る', '{来|く}る · {持|も}ってくる · {連|つ}れてくる', '**{来|こ}させる** · {持|も}って**こさせる** · {連|つ}れて**こさせる**', 'kosaseru · motte kosaseru · tsurete kosaseru'],
      ],
    },
    {
      t: 'table',
      caption: 'Thể sai khiến chia tiếp như động từ nhóm 2 — ví dụ với {行|い}かせる và {食|た}べさせる',
      head: ['Dạng', '{行|い}かせる', 'Romaji', '{食|た}べさせる', 'Romaji'],
      rows: [
        ['ます', '{行|い}かせます', 'ikasemasu', '{食|た}べさせます', 'tabesasemasu'],
        ['ない', '{行|い}かせない', 'ikasenai', '{食|た}べさせない', 'tabesasenai'],
        ['て', '{行|い}かせて', 'ikasete', '{食|た}べさせて', 'tabesasete'],
        ['た', '{行|い}かせた', 'ikaseta', '{食|た}べさせた', 'tabesaseta'],
        ['たい', '{行|い}かせたい', 'ikasetai', '{食|た}べさせたい', 'tabesasetai'],
        ['てください (④)', '{行|い}かせてください', 'ikasete kudasai', '{食|た}べさせてください', 'tabesasete kudasai'],
        ['てくれる (③)', '{行|い}かせてくれる', 'ikasete kureru', '{食|た}べさせてくれる', 'tabesasete kureru'],
      ],
    },
    {
      t: 'table',
      caption: '⚠ Bẫy cách chia sai khiến — đề N4 hay cài',
      head: ['Động từ', 'Sai', 'Đúng', 'Vì sao'],
      rows: [
        ['{言|い}う', '~~{言|い}あせる~~', '{言|い}**わ**せる', 'う → **わ** (như thể ない: {言|い}わない)'],
        ['{休|やす}む', '~~{休|やす}まさせる~~', '{休|やす}**ま**せる', 'nhóm 1 **không có さ** thừa ("さ入れ言葉" — người Nhật cũng hay nói sai)'],
        ['{帰|かえ}る', '~~{帰|かえ}させる~~', '{帰|かえ}**ら**せる', '{帰|かえ}る là nhóm 1 ngoại lệ (cùng {入|はい}る, {走|はし}る, {知|し}る, {切|き}る)'],
        ['{話|はな}す', '~~{話|はな}せる~~ (đó là khả năng)', '{話|はな}**さ**せる', 'す → **さ** ＋ せる'],
        ['{待|ま}つ', '~~{待|ま}ちせる~~', '{待|ま}**た**せる', 'つ → **た**'],
        ['{来|く}る', '~~{来|き}させる~~ / ~~{来|く}させる~~', '**{来|こ}**させる (こさせる)', 'nhóm 3: đọc **こ**'],
        ['{見|み}る', '~~{見|み}せる~~ (đó là "cho xem" — từ riêng)', '{見|み}**さ**せる', 'nhóm 2 + させる; {見|み}せる là động từ khác'],
        ['{寝|ね}る', '(ru con ngủ) {寝|ね}させる', '{寝|ね}**かせる** (ru ngủ — từ riêng)', '{寝|ね}させる = để / bắt đi ngủ; {寝|ね}かせる = đặt cho nằm ngủ'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{母|はは}は{弟|おとうと}を{買|か}い{物|もの}に{行|い}かせました。', 'Haha wa otouto o kaimono ni ikasemashita.', 'Mẹ bảo (sai) em trai đi mua đồ.'),
        E('{先生|せんせい}は{学生|がくせい}に{作文|さくぶん}を{書|か}かせました。', 'Sensei wa gakusei ni sakubun o kakasemashita.', 'Thầy cho (bắt) học sinh viết bài văn.'),
        E('{父|ちち}は{私|わたし}に{毎朝|まいあさ}{新聞|しんぶん}を{読|よ}ませました。', 'Chichi wa watashi ni maiasa shinbun o yomasemashita.', 'Bố bắt tôi đọc báo mỗi sáng.'),
        E('{部長|ぶちょう}は{西川|にしかわ}さんを{大阪|おおさか}へ{出張|しゅっちょう}させました。', 'Buchou wa Nishikawa-san o Oosaka e shucchou sasemashita.', 'Trưởng phòng cử anh Nishikawa đi công tác Osaka.'),
        E('すみません、{長|なが}い{時間|じかん}{待|ま}たせてしまいました。', 'Sumimasen, nagai jikan matasete shimaimashita.', 'Xin lỗi, tôi đã để anh / chị chờ lâu. (～てしまう — Bài 19)'),
        E('{母|はは}は{妹|いもうと}にピアノを{習|なら}わせています。', 'Haha wa imouto ni piano o narawasete imasu.', 'Mẹ đang cho em gái học piano.'),
        E('{先生|せんせい}は{遅|おく}れた{学生|がくせい}を{職員室|しょくいんしつ}に{来|こ}させました。', 'Sensei wa okureta gakusei o shokuinshitsu ni kosasemashita.', 'Thầy bắt học sinh đến muộn lên phòng giáo viên. ({来|く}る → {来|こ}させる)'),
      ],
    },
    { t: 'rule', formula: 'Nhóm 1: う段 → あ段 ＋ せる（う → わ）· Nhóm 2: bỏ る ＋ させる · する → させる · 来る → 来させる（こさせる）', vi: 'Sau đó chia như động từ nhóm 2: ～せます・～せない・～せて・～せた. Không chèn さ vào nhóm 1 (~~休まさせる~~). 見せる・知らせる・寝かせる・任せる là từ riêng.' },

    /* ══════ ② BẮT LÀM ══════ */
    { t: 'h', text: '② A は B を V(さ)せる ／ A は B に N を V(さ)せる — "A BẮT (bảo, cho) B làm"' },
    {
      t: 'p',
      text: '**A** (người có quyền: bố mẹ, thầy cô, sếp, huấn luyện viên) **muốn** và **B** (người dưới: con, học sinh, nhân viên) **làm**. Trợ từ của **B** phụ thuộc động từ: **(1) Tự động từ** — động từ **không có tân ngữ を** ({行|い}く, {来|く}る, {帰|かえ}る, {走|はし}る, {立|た}つ, {座|すわ}る, {休|やす}む, {留学|りゅうがく}する…) → **B を** V(さ)せる: {先生|せんせい}は{学生|がくせい}**を**{立|た}たせた. **(2) Tha động từ có "N を"** ({食|た}べる, {書|か}く, {読|よ}む, {習|なら}う, {掃除|そうじ}する…) → **B に N を** V(さ)せる: {母|はは}は{子|こ}ども**に**{野菜|やさい}**を**{食|た}べさせた — **một câu không có hai を**. ⚠ **Chỉ người TRÊN** mới "sai khiến" người **dưới** (hoặc ngang hàng, thân). Không nói ~~{社長|しゃちょう}に{説明|せつめい}させました~~ về sếp mình.',
    },
    {
      t: 'table',
      caption: 'Luật trợ từ を／に của người phải làm (B)',
      head: ['Loại động từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Tự động từ (không có N を)', 'A は **B を** V(さ)せる', '{先生|せんせい}は{遅|おく}れてきた{学生|がくせい}**を**{立|た}たせました。', 'Sensei wa okurete kita gakusei o tatasemashita.'],
        ['Tự động từ + nơi chốn', 'A は **B を**（nơi）に／へ V(さ)せる', '{母|はは}は{私|わたし}**を**{塾|じゅく}**に**{行|い}かせました。', 'Haha wa watashi o juku ni ikasemashita.'],
        ['Tha động từ (có N を)', 'A は **B に N を** V(さ)せる', '{母|はは}は{弟|おとうと}**に**{野菜|やさい}**を**{食|た}べさせました。', 'Haha wa otouto ni yasai o tabesasemashita.'],
        ['する-động từ có N を', 'A は **B に N を** させる', '{先生|せんせい}は{私|わたし}**に**{部屋|へや}の{掃除|そうじ}**を**させました。', 'Sensei wa watashi ni heya no souji o sasemashita.'],
        ['✗ Hai を trong một câu', '~~B を N を V(さ)せる~~', '~~{弟|おとうと}を{野菜|やさい}を{食|た}べさせた~~ → {弟|おとうと}**に**', '—'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A は B を V（tự động từ）(さ)せる — "A bắt / bảo B (đi, đứng, chạy…)"',
          vi: 'B là người **thực hiện** động tác không có tân ngữ. Câu hỏi: **{誰|だれ}を～させたんですか**. Với tự động từ, đề N4 gần như luôn dùng **を**.',
          examples: [
            E('{先生|せんせい}は{遅刻|ちこく}した{学生|がくせい}を{教室|きょうしつ}の{後|うし}ろに{立|た}たせました。', 'Sensei wa chikoku shita gakusei o kyoushitsu no ushiro ni tatasemashita.', 'Thầy bắt học sinh đến muộn đứng ở cuối lớp.'),
            E('コーチは{選手|せんしゅ}たちを{毎朝|まいあさ}10キロ{走|はし}らせます。', 'Koochi wa senshutachi o maiasa jukkiro hashirasemasu.', 'Huấn luyện viên bắt các cầu thủ chạy 10 km mỗi sáng.'),
            E('{母|はは}は{熱|ねつ}がある{弟|おとうと}を{学校|がっこう}に{行|い}かせないで、{家|いえ}で{休|やす}ませました。', 'Haha wa netsu ga aru otouto o gakkou ni ikasenaide, ie de yasumasemashita.', 'Mẹ không cho em trai đang sốt đi học, cho em nghỉ ở nhà.'),
            E('{部長|ぶちょう}は{西川|にしかわ}さんを{一人|ひとり}で{客|きゃく}の{会社|かいしゃ}へ{行|い}かせました。', 'Buchou wa Nishikawa-san o hitori de kyaku no kaisha e ikasemashita.', 'Trưởng phòng cử anh Nishikawa một mình đến công ty khách hàng.'),
            E('{子|こ}どもを{夜|よる}{遅|おそ}くまで{外|そと}で{遊|あそ}ばせてはいけません。', 'Kodomo o yoru osoku made soto de asobasete wa ikemasen.', 'Không được để trẻ chơi ngoài đường đến khuya. (ポイント 114)'),
            E('{先生|せんせい}は{教室|きょうしつ}で{騒|さわ}いだ{学生|がくせい}を{放課後|ほうかご}{残|のこ}らせました。', 'Sensei wa kyoushitsu de sawaida gakusei o houkago nokorasemashita.', 'Thầy bắt học sinh làm ồn trong lớp ở lại sau giờ học. ({残|のこ}る → {残|のこ}らせる)'),
          ],
        },
        {
          formula: 'A は B に N を V（tha động từ）(さ)せる — "A bắt / bảo B làm N"',
          vi: 'Câu đã có **N を** (việc cụ thể) nên **B** đổi sang **に**. Rất hay dùng cho việc nhà, bài tập, việc ở công ty: {皿洗|さらあら}いをさせる, {作文|さくぶん}を{書|か}かせる, {資料|しりょう}を{作|つく}らせる.',
          examples: [
            E('{母|はは}は{私|わたし}に{毎晩|まいばん}{皿洗|さらあら}いをさせました。', 'Haha wa watashi ni maiban saraarai o sasemashita.', 'Tối nào mẹ cũng bắt tôi rửa bát.'),
            E('{先生|せんせい}は{学生|がくせい}に{教科書|きょうかしょ}を{声|こえ}に{出|だ}して{読|よ}ませました。', 'Sensei wa gakusei ni kyoukasho o koe ni dashite yomasemashita.', 'Thầy cho học sinh đọc to sách giáo khoa.'),
            E('{父|ちち}は{弟|おとうと}に{部屋|へや}を{片付|かたづ}けさせました。', 'Chichi wa otouto ni heya o katazukesasemashita.', 'Bố bắt em trai dọn phòng.'),
            E('{部長|ぶちょう}は{新|あたら}しい{社員|しゃいん}に{会議|かいぎ}の{資料|しりょう}を{作|つく}らせました。', 'Buchou wa atarashii shain ni kaigi no shiryou o tsukurasemashita.', 'Trưởng phòng giao cho nhân viên mới làm tài liệu họp.'),
            E('{店長|てんちょう}はアルバイトの{人|ひと}に{店|みせ}の{前|まえ}を{掃除|そうじ}させます。', 'Tenchou wa arubaito no hito ni mise no mae o souji sasemasu.', 'Chủ quán cho người làm thêm quét trước cửa hàng.'),
            E('{祖母|そぼ}は{私|わたし}に{洗濯物|せんたくもの}を{畳|たた}ませました。', 'Sobo wa watashi ni sentakumono o tatamasemashita.', 'Bà bảo tôi gấp quần áo.'),
            E('コーチは{子|こ}どもたちにボールを{遠|とお}くまで{投|な}げさせました。', 'Koochi wa kodomotachi ni booru o tooku made nagesasemashita.', 'Huấn luyện viên cho bọn trẻ ném bóng thật xa.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với thể sai khiến "bắt làm"',
      lines: [
        { who: 'アンナ', role: 'a', text: 'カルロスさん、{子|こ}どもの{頃|ころ}、ご{両親|りょうしん}は{厳|きび}しかった？', ro: 'Karurosu-san, kodomo no koro, goryoushin wa kibishikatta?', vi: 'Carlos, hồi nhỏ bố mẹ cậu có nghiêm không?' },
        { who: 'カルロス', role: 'b', text: '{父|ちち}はすごく{厳|きび}しかったよ。{毎朝|まいあさ}6{時|じ}に{起|お}きさせて、{犬|いぬ}の{散歩|さんぽ}に{行|い}かせたんだ。', ro: 'Chichi wa sugoku kibishikatta yo. Maiasa rokuji ni okisasete, inu no sanpo ni ikaseta n da.', vi: 'Bố mình nghiêm lắm. Sáng nào cũng bắt dậy lúc 6 giờ rồi cho đi dắt chó dạo.' },
        { who: 'アンナ', role: 'a', text: '{毎朝|まいあさ}？{大変|たいへん}だったね。お{母|かあ}さんは？', ro: 'Maiasa? Taihen datta ne. Okaasan wa?', vi: 'Sáng nào cũng thế á? Vất vả nhỉ. Còn mẹ cậu?' },
        { who: 'カルロス', role: 'b', text: '{母|はは}は{勉強|べんきょう}に{厳|きび}しくて、{毎晩|まいばん}{僕|ぼく}に{本|ほん}を{三十分|さんじゅっぷん}{読|よ}ませたよ。', ro: 'Haha wa benkyou ni kibishikute, maiban boku ni hon o sanjuppun yomaseta yo.', vi: 'Mẹ mình nghiêm chuyện học, tối nào cũng bắt mình đọc sách 30 phút.' },
        { who: 'アンナ', role: 'a', text: 'だから{今|いま}も{本|ほん}が{好|す}きなんだね。{家|いえ}のお{手伝|てつだ}いは？', ro: 'Dakara ima mo hon ga suki na n da ne. Ie no otetsudai wa?', vi: 'Hèn gì giờ cậu vẫn thích đọc sách. Còn việc nhà thì sao?' },
        { who: 'カルロス', role: 'b', text: '{日曜日|にちようび}は、{兄|あに}と{僕|ぼく}に{車|くるま}を{洗|あら}わせたよ。アンナさんの{家|いえ}は？', ro: 'Nichiyoubi wa, ani to boku ni kuruma o arawaseta yo. Anna-san no ie wa?', vi: 'Chủ nhật thì bắt anh mình và mình rửa xe. Nhà Anna thì sao?' },
        { who: 'アンナ', role: 'a', text: 'うちは{母|はは}が{私|わたし}に{料理|りょうり}を{手伝|てつだ}わせたの。おかげで、{今|いま}は{一人|ひとり}で{何|なん}でも{作|つく}れるよ。', ro: 'Uchi wa haha ga watashi ni ryouri o tetsudawaseta no. Okage de, ima wa hitori de nan demo tsukureru yo.', vi: 'Nhà mình thì mẹ bắt mình phụ nấu ăn. Nhờ vậy giờ mình tự nấu được đủ món.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — A は B に／を ～させる',
      head: ['A (người trên)', 'B', 'Việc', 'Câu', 'Romaji'],
      rows: [
        ['{母|はは}', '{弟|おとうと}', '{野菜|やさい}を{食|た}べる', '{母|はは}は{弟|おとうと}に{野菜|やさい}を{食|た}べさせました。', 'Haha wa otouto ni yasai o tabesasemashita.'],
        ['{先生|せんせい}', '{学生|がくせい}', '{作文|さくぶん}を{書|か}く', '{先生|せんせい}は{学生|がくせい}に{作文|さくぶん}を{書|か}かせました。', 'Sensei wa gakusei ni sakubun o kakasemashita.'],
        ['{父|ちち}', '{私|わたし}', '{塾|じゅく}に{行|い}く', '{父|ちち}は{私|わたし}を{塾|じゅく}に{行|い}かせました。', 'Chichi wa watashi o juku ni ikasemashita.'],
        ['コーチ', '{選手|せんしゅ}', '{走|はし}る', 'コーチは{選手|せんしゅ}を{走|はし}らせました。', 'Koochi wa senshu o hashirasemashita.'],
        ['{部長|ぶちょう}', '{部下|ぶか}', '{報告書|ほうこくしょ}を{書|か}く', '{部長|ぶちょう}は{部下|ぶか}に{報告書|ほうこくしょ}を{書|か}かせました。', 'Buchou wa buka ni houkokusho o kakasemashita.'],
        ['{母|はは}', '{妹|いもうと}', '{留守番|るすばん}をする', '{母|はは}は{妹|いもうと}に{留守番|るすばん}をさせました。', 'Haha wa imouto ni rusuban o sasemashita.'],
        ['{先生|せんせい}', '{学生|がくせい}', '{立|た}つ', '{先生|せんせい}は{学生|がくせい}を{立|た}たせました。', 'Sensei wa gakusei o tatasemashita.'],
        ['{店長|てんちょう}', 'アルバイト', '{皿|さら}を{洗|あら}う', '{店長|てんちょう}はアルバイトに{皿|さら}を{洗|あら}わせました。', 'Tenchou wa arubaito ni sara o arawasemashita.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với thể sai khiến "bắt làm" (sai → đúng)',
      items: [
        '~~{母|はは}は{弟|おとうと}を{野菜|やさい}を{食|た}べさせた~~ → **{弟|おとうと}に{野菜|やさい}を** — một câu không có hai を; đã có tân ngữ thì B đi với **に**.',
        '~~{私|わたし}は{部長|ぶちょう}に{資料|しりょう}を{見|み}させました~~ → **{部長|ぶちょう}に{資料|しりょう}を{見|み}ていただきました** — không "sai khiến" người trên. Với người trên dùng **～ていただく／～てもらう** (Bài 18).',
        '~~{母|はは}は{私|わたし}に{塾|じゅく}に{行|い}きさせた~~ → **{行|い}かせた** — thể sai khiến đi từ **thể từ điển**, không từ thể ます.',
        '~~{先生|せんせい}は{学生|がくせい}が{作文|さくぶん}を{書|か}かせた~~ → **{学生|がくせい}に** — người bị bắt làm không bao giờ đi với が trong câu sai khiến (が/は là người RA LỆNH).',
        '**Ai là chủ ngữ?** Câu {母|はは}は{私|わたし}に{皿|さら}を{洗|あら}わせた — người **rửa** là **{私|わたし}**, người **muốn** là {母|はは}. Đề N4 hay hỏi "{誰|だれ}が{皿|さら}を{洗|あら}いましたか" — trả lời: người đi với **に／を**.',
      ],
    },
    { t: 'rule', formula: 'A は B を V(さ)せる（tự động từ）／ A は B に N を V(さ)せる（tha động từ）', vi: 'A (người trên) muốn, B làm. Một câu không có hai を. Không dùng để nói về việc của người trên mình — khi đó dùng ～ていただく／～てもらう.' },

    /* ══════ ③ CHO LÀM · GÂY CẢM XÚC · させてくれる／もらう ══════ */
    { t: 'h', text: '③ A は B に V(さ)せる (cho phép) · B を {心配|しんぱい}させる (gây cảm xúc) · ～させてくれる／～させてもらう' },
    {
      t: 'p',
      text: 'Cùng một thể sai khiến còn có hai nghĩa nữa. **(1) CHO PHÉP / ĐỂ MẶC** — B **muốn** làm, A **đồng ý** hoặc **không ngăn**: {子|こ}どもに{好|す}きなことを**させる** (cho con làm điều nó thích), {外|そと}で{自由|じゆう}に{遊|あそ}ば**せる**. Nghĩa "cho phép" rõ nhất khi thêm **～てくれる** (A cho tôi — biết ơn) hoặc **～てもらう** (tôi được A cho): {父|ちち}は{私|わたし}を{留学|りゅうがく}させて**くれた** · {先生|せんせい}に{辞書|じしょ}を{使|つか}わせて**もらった**. Phủ định: ～させて**くれなかった**／～させて**もらえなかった** = **không được cho** làm. **(2) GÂY CẢM XÚC / TRẠNG THÁI** — A làm cho B **lo, vui, buồn, chờ, cười, khóc, ngạc nhiên**: {親|おや}**を**{心配|しんぱい}させる, {友達|ともだち}**を**{待|ま}たせる, {妹|いもうと}**を**{泣|な}かせる. Ở nghĩa này B luôn đi với **を**, và A **không cố ý** cũng được (lỡ làm ai lo).',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A は B に（を）V(さ)せる — "A cho / để B làm (theo ý B)"',
          vi: 'Thường đi với các từ **{自由|じゆう}に, {好|す}きなだけ, {好|す}きなことを, {一人|ひとり}で** hoặc khi B **xin** trước. Với tự động từ, dùng **に** thay cho を làm câu nghe "tôn trọng ý muốn của B" hơn — sắc thái N3; đề N4 chủ yếu hỏi nghĩa qua ngữ cảnh.',
          examples: [
            E('{母|はは}は{子|こ}どもたちに{好|す}きなだけアイスを{食|た}べさせました。', 'Haha wa kodomotachi ni suki na dake aisu o tabesasemashita.', 'Mẹ cho bọn trẻ ăn kem thoả thích.'),
            E('{日曜日|にちようび}は、{子|こ}どもに{好|す}きなことをさせています。', 'Nichiyoubi wa, kodomo ni suki na koto o sasete imasu.', 'Chủ nhật tôi cho con làm điều nó thích.'),
            E('{娘|むすめ}が{行|い}きたいと{言|い}ったので、{一人|ひとり}でキャンプに{行|い}かせました。', 'Musume ga ikitai to itta node, hitori de kyanpu ni ikasemashita.', 'Con gái nói muốn đi nên tôi cho nó đi cắm trại một mình.'),
            E('{疲|つか}れているようだったので、{部下|ぶか}を{早|はや}く{帰|かえ}らせました。', 'Tsukarete iru you datta node, buka o hayaku kaerasemashita.', 'Thấy cấp dưới có vẻ mệt nên tôi cho về sớm. (ようだ — Bài 20)'),
            E('{子|こ}どもが{嫌|いや}がることは、{無理|むり}にさせないほうがいいです。', 'Kodomo ga iyagaru koto wa, muri ni sasenai hou ga ii desu.', 'Việc trẻ không thích thì không nên ép nó làm. (ポイント 105)'),
          ],
        },
        {
          formula: 'A は B を V(さ)せる (cảm xúc) — "A làm B (lo, vui, chờ, cười…)"',
          vi: 'Động từ cảm xúc / trạng thái: **{心配|しんぱい}する, {喜|よろこ}ぶ, {泣|な}く, {笑|わら}う, {怒|おこ}る, {困|こま}る, びっくりする, がっかりする, {待|ま}つ, {安心|あんしん}する**. B luôn đi với **を**. Câu xin lỗi cố định: **お{待|ま}たせしました** (xin lỗi đã để quý khách chờ — nhân viên nói hằng ngày).',
          examples: [
            E('{子|こ}どもの{頃|ころ}、よくけがをして{親|おや}を{心配|しんぱい}させました。', 'Kodomo no koro, yoku kega o shite oya o shinpai sasemashita.', 'Hồi nhỏ tôi hay bị thương, làm bố mẹ lo lắng.'),
            E('{弟|おとうと}はいつも{面白|おもしろ}いことを{言|い}って、みんなを{笑|わら}わせます。', 'Otouto wa itsumo omoshiroi koto o itte, minna o warawasemasu.', 'Em trai tôi lúc nào cũng nói chuyện vui làm mọi người cười.'),
            E('{試験|しけん}に{合格|ごうかく}して、{両親|りょうしん}を{喜|よろこ}ばせたいです。', 'Shiken ni goukaku shite, ryoushin o yorokobasetai desu.', 'Tôi muốn thi đỗ để bố mẹ vui.'),
            E('{小|ちい}さい{頃|ころ}、{妹|いもうと}のおもちゃを{取|と}って、{泣|な}かせてしまいました。', 'Chiisai koro, imouto no omocha o totte, nakasete shimaimashita.', 'Hồi bé tôi giật đồ chơi của em gái, làm nó khóc.'),
            E('お{待|ま}たせしました。コーヒーとケーキです。', 'Omatase shimashita. Koohii to keeki desu.', 'Xin lỗi đã để quý khách chờ. Cà phê và bánh đây ạ.'),
            E('{遅|おそ}くなるときは{電話|でんわ}して。{親|おや}を{困|こま}らせないでね。', 'Osoku naru toki wa denwa shite. Oya o komarasenaide ne.', 'Khi về muộn thì gọi điện nhé. Đừng làm bố mẹ khổ.'),
          ],
        },
        {
          formula: 'A は（私を／私に）V(さ)せてくれる ／ 私は A に V(さ)せてもらう — "(A) cho tôi làm" · "tôi được (A) cho làm"',
          vi: 'Ôn Bài 18: **くれる** (người khác làm cho mình) · **もらう** (mình nhận từ người khác). Ghép với sai khiến → chắc chắn nghĩa **CHO PHÉP + biết ơn**. Phủ định: **～させてくれなかった** (A không cho) · **～させてもらえなかった** (tôi không được cho — dùng thể khả năng もらえる).',
          examples: [
            E('{父|ちち}は{私|わたし}を{日本|にほん}へ{留学|りゅうがく}させてくれました。', 'Chichi wa watashi o Nihon e ryuugaku sasete kuremashita.', 'Bố đã cho tôi sang Nhật du học.'),
            E('{店長|てんちょう}は{熱|ねつ}がある{日|ひ}、{早|はや}く{帰|かえ}らせてくれました。', 'Tenchou wa netsu ga aru hi, hayaku kaerasete kuremashita.', 'Hôm tôi bị sốt, anh chủ cho tôi về sớm.'),
            E('{試験|しけん}のとき、{先生|せんせい}に{辞書|じしょ}を{使|つか}わせてもらいました。', 'Shiken no toki, sensei ni jisho o tsukawasete moraimashita.', 'Lúc thi tôi được thầy cho dùng từ điển.'),
            E('{子|こ}どもの{頃|ころ}、ゲームを{全然|ぜんぜん}させてもらえませんでした。', 'Kodomo no koro, geemu o zenzen sasete moraemasen deshita.', 'Hồi nhỏ tôi hoàn toàn không được cho chơi game.'),
            E('{母|はは}は{夜|よる}{一人|ひとり}で{出|で}かけさせてくれませんでした。', 'Haha wa yoru hitori de dekakesasete kuremasen deshita.', 'Mẹ không cho tôi ra ngoài một mình buổi tối.'),
            E('{自分|じぶん}の{子|こ}どもには、{好|す}きなことをさせてあげたいです。', 'Jibun no kodomo ni wa, suki na koto o sasete agetai desu.', 'Với con mình, tôi muốn cho nó làm điều nó thích. (～てあげる — Bài 18)'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: "Hồi nhỏ, bố mẹ có cho bạn…?"',
      lines: [
        { who: 'メアリー', role: 'a', text: 'ナタポンさんは{子|こ}どもの{頃|ころ}、ペットを{飼|か}っていましたか。', ro: 'Natapon-san wa kodomo no koro, petto o katte imashita ka.', vi: 'Nattapon, hồi nhỏ anh có nuôi thú cưng không?' },
        { who: 'ナタポン', role: 'b', text: 'はい。{猫|ねこ}が{欲|ほ}しいと{言|い}ったら、{両親|りょうしん}が{飼|か}わせてくれました。メアリーさんは？', ro: 'Hai. Neko ga hoshii to ittara, ryoushin ga kawasete kuremashita. Mearii-san wa?', vi: 'Có. Tôi nói muốn có mèo thì bố mẹ cho nuôi. Còn chị Mary?' },
        { who: 'メアリー', role: 'a', text: '{私|わたし}は{飼|か}わせてもらえませんでした。{兄|あに}が{猫|ねこ}のアレルギーだったんです。', ro: 'Watashi wa kawasete moraemasen deshita. Ani ga neko no arerugii datta n desu.', vi: 'Tôi không được cho nuôi. Anh trai tôi bị dị ứng mèo.' },
        { who: 'ナタポン', role: 'b', text: 'そうですか。じゃ、{夜|よる}、{友達|ともだち}と{出|で}かけるのは{大丈夫|だいじょうぶ}でしたか。', ro: 'Sou desu ka. Ja, yoru, tomodachi to dekakeru no wa daijoubu deshita ka.', vi: 'Vậy à. Thế buổi tối đi chơi với bạn có được không?' },
        { who: 'メアリー', role: 'a', text: '{高校生|こうこうせい}になってからは、{十時|じゅうじ}まで{出|で}かけさせてくれました。でも、{遅|おく}れると{親|おや}を{心配|しんぱい}させるので、{必|かなら}ず{電話|でんわ}しました。', ro: 'Koukousei ni natte kara wa, juuji made dekakesasete kuremashita. Demo, okureru to oya o shinpai saseru node, kanarazu denwa shimashita.', vi: 'Từ khi lên cấp 3 thì bố mẹ cho đi đến 10 giờ. Nhưng về muộn là làm bố mẹ lo, nên tôi luôn gọi điện.' },
        { who: 'ナタポン', role: 'b', text: 'えらいですね。{僕|ぼく}はよく{遅|おそ}くなって、{母|はは}を{怒|おこ}らせました。', ro: 'Erai desu ne. Boku wa yoku osoku natte, haha o okorasemashita.', vi: 'Chị ngoan thật. Tôi thì hay về muộn làm mẹ nổi giận.' },
      ],
    },
    {
      t: 'table',
      caption: '⭐ Bắt hay cho? — đọc từ đi kèm để biết nghĩa',
      head: ['Câu', 'Nghĩa', 'Dấu hiệu'],
      rows: [
        ['{母|はは}は{私|わたし}にピアノを{練習|れんしゅう}**させた**。', 'BẮT (có lẽ tôi không muốn)', 'không có từ đi kèm, người trên + việc học / việc nhà'],
        ['{母|はは}は{私|わたし}に{好|す}きなことを**させた**。', 'CHO (theo ý tôi)', '{好|す}きなこと／{自由|じゆう}に／{好|す}きなだけ'],
        ['{父|ちち}は{私|わたし}を{留学|りゅうがく}**させてくれた**。', 'CHO + biết ơn', '～てくれる'],
        ['{先生|せんせい}に{辞書|じしょ}を{使|つか}わ**せてもらった**。', 'ĐƯỢC CHO', '～てもらう'],
        ['ゲームを**させてもらえなかった**。', 'KHÔNG ĐƯỢC CHO', '～てもらえない'],
        ['{皿洗|さらあら}いを**させられた**。', 'BỊ BẮT (than)', '～させられる (⑨)'],
        ['{親|おや}を{心配|しんぱい}**させた**。', 'LÀM (ai) lo', 'động từ cảm xúc + を'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với nghĩa "cho phép" và "cảm xúc" (sai → đúng)',
      items: [
        '~~{父|ちち}は{私|わたし}に{留学|りゅうがく}してくれました~~ (nghĩa: bố du học hộ tôi!) → **{留学|りゅうがく}させてくれました** — muốn nói "bố CHO tôi du học" phải có **thể sai khiến** + くれる.',
        '~~{両親|りょうしん}に{心配|しんぱい}させました~~ → **{両親|りょうしん}を{心配|しんぱい}させました** — nghĩa cảm xúc: B đi với **を**.',
        '~~ゲームをさせてもらいませんでした~~ → **させてもらえませんでした** — "không ĐƯỢC cho" cần thể khả năng **もらえる**; させてもらいませんでした nghe như "tôi đã không nhờ được cho" — lạ.',
        '**Xin lỗi vì để chờ**: nói **お{待|ま}たせしました**／**{待|ま}たせてすみません**, KHÔNG nói ~~{待|ま}ってすみません~~ (nghĩa: xin lỗi vì TÔI đã chờ).',
        '**{見|み}させてくれる ↔ {見|み}せてくれる** — {見|み}させてくれた = cho tôi **được xem** (cho phép: テレビを{見|み}させてくれた); {見|み}せてくれた = **đưa cho tôi xem** ({写真|しゃしん}を{見|み}せてくれた). Hai câu khác hẳn nhau.',
      ],
    },
    { t: 'rule', formula: 'A は B に V(さ)せる（cho làm）· B を V(さ)せる（gây cảm xúc）· V(さ)せてくれる／V(さ)せてもらう（được cho làm）', vi: 'Thể sai khiến + くれる／もらう = chắc chắn nghĩa CHO PHÉP, có ý biết ơn; phủ định ～させてくれなかった／～させてもらえなかった = không được cho. Động từ cảm xúc (心配・喜ぶ・泣く・待つ…) + させる: người chịu cảm xúc đi với を.' },

    /* ══════ ④ XIN ĐƯỢC LÀM ══════ */
    { t: 'h', text: '④ V(さ)せてください ／ V(さ)せてもらえませんか ／ V(さ)せていただけませんか — "xin cho tôi được làm"' },
    {
      t: 'p',
      text: 'Ghép thể sai khiến với **～てください** (ポイント 63) → **～させてください** = "hãy **cho tôi** làm…" — người nói xin phép **chính mình** được làm, hoặc **xung phong** làm. Thêm **もらえませんか / いただけませんか** (ôn Bài 18) để mềm và kính trọng hơn. Ba mức: **～させてください** (thẳng, dùng với người quen, đồng nghiệp, cũng dùng với cấp trên khi xung phong) → **～させてもらえませんか** (lịch sự, mềm) → **～させていただけませんか** (kính trọng nhất — với sếp, thầy cô, khách). Người được làm (chính mình) đi với **に** khi cần nói rõ: **{私|わたし}に**やらせてください.',
    },
    {
      t: 'table',
      caption: 'Ba mức xin được làm — từ thẳng đến kính trọng',
      head: ['Mức', 'Khuôn', 'Ví dụ', 'Romaji', 'Dùng với'],
      rows: [
        ['1 · thẳng', 'V(さ)せてください', '{私|わたし}にやらせてください。', 'Watashi ni yarasete kudasai.', 'bạn bè, đồng nghiệp; xung phong với cấp trên'],
        ['2 · lịch sự', 'V(さ)せてもらえませんか', 'この{電話|でんわ}を{使|つか}わせてもらえませんか。', 'Kono denwa o tsukawasete moraemasen ka.', 'người quen trên mình, chủ quán, người lạ'],
        ['3 · kính trọng', 'V(さ)せていただけませんか', '{明日|あした}、{休|やす}ませていただけませんか。', 'Ashita, yasumasete itadakemasen ka.', 'sếp, thầy cô, khách hàng'],
        ['(nhận ra) tuyên bố khiêm nhường', 'V(さ)せていただきます', 'では、{説明|せつめい}させていただきます。', 'Dewa, setsumei sasete itadakimasu.', 'mở đầu phát biểu, email công việc (Bài 24)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（私に）V(さ)せてください — "cho tôi được V" · "để tôi V"',
          vi: 'Ba tình huống rất hay gặp: **xin về / nghỉ** ({帰|かえ}らせてください, {休|やす}ませてください); **xung phong** ({私|わたし}にやらせてください); **xin thời gian / lượt nói** ({考|かんが}えさせてください, {一言|ひとこと}{言|い}わせてください, {自己紹介|じこしょうかい}させてください).',
          examples: [
            E('{頭|あたま}が{痛|いた}いので、{今日|きょう}は{早|はや}く{帰|かえ}らせてください。', 'Atama ga itai node, kyou wa hayaku kaerasete kudasai.', 'Tôi đau đầu nên hôm nay cho tôi về sớm.'),
            E('その{仕事|しごと}、{私|わたし}にやらせてください。', 'Sono shigoto, watashi ni yarasete kudasai.', 'Việc đó để tôi làm cho.'),
            E('すみません、{少|すこ}し{考|かんが}えさせてください。', 'Sumimasen, sukoshi kangaesasete kudasai.', 'Xin lỗi, cho tôi suy nghĩ một chút. (cách từ chối khéo)'),
            E('はじめまして。{自己紹介|じこしょうかい}させてください。', 'Hajimemashite. Jikoshoukai sasete kudasai.', 'Xin chào. Cho phép tôi tự giới thiệu.'),
            E('{一言|ひとこと}{言|い}わせてください。', 'Hitokoto iwasete kudasai.', 'Cho tôi nói một câu.'),
            E('この{写真|しゃしん}、{一枚|いちまい}{撮|と}らせてください。', 'Kono shashin, ichimai torasete kudasai.', 'Cho tôi chụp một tấm ảnh này nhé.'),
          ],
        },
        {
          formula: 'V(さ)せてもらえませんか ／ V(さ)せていただけませんか — "(anh / chị) cho tôi V được không ạ?"',
          vi: 'Câu hỏi = mềm hơn câu ～てください. **いただけませんか** là mức của email xin nghỉ, xin phép thầy, nói với sếp. Thường mở đầu bằng **lý do + ので** và kết bằng câu cảm ơn.',
          examples: [
            E('すみません、この{電話|でんわ}を{使|つか}わせてもらえませんか。', 'Sumimasen, kono denwa o tsukawasete moraemasen ka.', 'Xin lỗi, cho tôi dùng nhờ điện thoại này được không?'),
            E('{来週|らいしゅう}の{月曜日|げつようび}、{国|くに}から{母|はは}が{来|く}るので、{休|やす}ませていただけませんか。', 'Raishuu no getsuyoubi, kuni kara haha ga kuru node, yasumasete itadakemasen ka.', 'Thứ Hai tuần sau mẹ tôi từ quê sang, anh / chị cho tôi nghỉ được không ạ?'),
            E('{先生|せんせい}、{研究室|けんきゅうしつ}を{見学|けんがく}させていただけませんか。', 'Sensei, kenkyuushitsu o kengaku sasete itadakemasen ka.', 'Thưa thầy, thầy cho em tham quan phòng nghiên cứu được không ạ?'),
            E('{部長|ぶちょう}、{次|つぎ}のプロジェクトを{担当|たんとう}させていただけませんか。', 'Buchou, tsugi no purojekuto o tantou sasete itadakemasen ka.', 'Thưa trưởng phòng, anh cho em phụ trách dự án tới được không ạ?'),
            E('{体調|たいちょう}が{悪|わる}いので、{早退|そうたい}させてもらえませんか。', 'Taichou ga warui node, soutai sasete moraemasen ka.', 'Tôi không khoẻ, cho tôi về sớm được không?'),
            E('お{皿洗|さらあら}いをやらせてもらえませんか。{得意|とくい}なんです。', 'Osaraarai o yarasete moraemasen ka. Tokui na n desu.', 'Cho tôi làm phần rửa bát được không? Tôi quen tay lắm.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: xin phép trên lớp và ở công ty',
      lines: [
        { who: 'ワン', role: 'a', text: '{本田先生|ほんだせんせい}、{今日|きょう}の{授業|じゅぎょう}を{録音|ろくおん}させていただけませんか。{家|いえ}で{復習|ふくしゅう}したいんです。', ro: 'Honda-sensei, kyou no jugyou o rokuon sasete itadakemasen ka. Ie de fukushuu shitai n desu.', vi: 'Thưa thầy Honda, thầy cho em ghi âm buổi học hôm nay được không ạ? Em muốn ôn lại ở nhà.' },
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'いいですよ。でも、インターネットには{出|だ}さないでくださいね。', ro: 'Ii desu yo. Demo, intaanetto ni wa dasanaide kudasai ne.', vi: 'Được thôi. Nhưng đừng đưa lên mạng nhé.' },
        { who: 'ワン', role: 'a', text: 'はい、わかりました。それから、{来週|らいしゅう}の{発表|はっぴょう}、{最初|さいしょ}に{私|わたし}にやらせてください。', ro: 'Hai, wakarimashita. Sorekara, raishuu no happyou, saisho ni watashi ni yarasete kudasai.', vi: 'Vâng, em hiểu rồi ạ. Còn nữa, bài thuyết trình tuần sau, thầy cho em làm đầu tiên ạ.' },
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'お、{積極的|せっきょくてき}ですね。じゃ、ワンさんからにしましょう。', ro: 'O, sekkyokuteki desu ne. Ja, Wan-san kara ni shimashou.', vi: 'Ồ, tích cực nhỉ. Vậy mình bắt đầu từ em nhé.' },
        { who: '{山口|やまぐち}', role: 'c', text: '{西川|にしかわ}さん、すみません。{会議|かいぎ}の{前|まえ}に、{資料|しりょう}を{少|すこ}し{見|み}させてもらえませんか。', ro: 'Nishikawa-san, sumimasen. Kaigi no mae ni, shiryou o sukoshi misasete moraemasen ka.', vi: 'Anh Nishikawa, xin lỗi. Trước cuộc họp anh cho tôi xem qua tài liệu được không?' },
        { who: '{西川|にしかわ}', role: 'b', text: 'どうぞ。あ、{山口|やまぐち}さん、{英語|えいご}が{得意|とくい}でしたよね。この{部分|ぶぶん}の{説明|せつめい}、お{願|ねが}いできますか。', ro: 'Douzo. A, Yamaguchi-san, eigo ga tokui deshita yo ne. Kono bubun no setsumei, onegai dekimasu ka.', vi: 'Mời chị. À, chị Yamaguchi giỏi tiếng Anh nhỉ. Phần này chị giải thích giúp được không?' },
        { who: '{山口|やまぐち}', role: 'c', text: 'はい、ぜひやらせてください。', ro: 'Hai, zehi yarasete kudasai.', vi: 'Vâng, nhất định để tôi làm.' },
      ],
    },
    {
      t: 'table',
      caption: '⭐ ～させてください ↔ ～てもいいですか (ポイント 89) ↔ ～てください (ポイント 63)',
      head: ['Câu', 'Ai làm?', 'Sắc thái', 'Ví dụ'],
      rows: [
        ['V**てください**', 'NGƯỜI NGHE', 'nhờ / bảo người nghe làm', '{窓|まど}を{開|あ}けてください。(anh hãy mở cửa sổ)'],
        ['V**てもいいですか**', 'TÔI', 'hỏi xin phép — trung tính, mọi tình huống', '{窓|まど}を{開|あ}けてもいいですか。(tôi mở được không?)'],
        ['V(さ)**せてください**', 'TÔI', 'xin phép + mong muốn mạnh / xung phong; khiêm tốn hơn', '{私|わたし}に{開|あ}けさせてください。(để tôi mở cho)'],
        ['V(さ)**せていただけませんか**', 'TÔI', 'xin phép kính trọng nhất (sếp, thầy, khách)', '{明日|あした}{休|やす}ませていただけませんか。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc khi xin được làm (sai → đúng)',
      items: [
        '~~{休|やす}まさせてください~~ / ~~{帰|かえ}らさせてください~~ / ~~{読|よ}まさせてください~~ → **{休|やす}ませて／{帰|かえ}らせて／{読|よ}ませて** — nhóm 1 **không có さ**. ("さ入れ言葉" — người Nhật trẻ cũng hay nói sai, nhưng trong đề và khi viết là SAI.)',
        '~~{先生|せんせい}、{帰|かえ}ってください~~ (nghĩa: "thầy về đi!") → **{帰|かえ}らせてください** (cho em về) — muốn mình được làm thì phải có thể sai khiến.',
        '~~{部長|ぶちょう}、{休|やす}ませてくれませんか~~ → **{休|やす}ませていただけませんか** — với sếp dùng いただけませんか; くれませんか chỉ cho người ngang hàng, thân.',
        '**Trả lời** khi người khác xin: いいですよ／どうぞ／ぜひお{願|ねが}いします (đồng ý) · すみません、ちょっと…／それはちょっと… (từ chối khéo). Khi người khác **xung phong** ({私|わたし}にやらせてください): じゃ、お{願|ねが}いします／{助|たす}かります.',
        '**～させていただきます** (tuyên bố khiêm nhường: {説明|せつめい}させていただきます, {本日|ほんじつ}は{休|やす}ませていただきます) — gặp rất nhiều ở công ty, biển thông báo cửa hàng; dạng kính ngữ đầy đủ học ở Bài 24.',
      ],
    },
    { t: 'rule', formula: '（私に）V(さ)せてください → V(さ)せてもらえませんか → V(さ)せていただけませんか', vi: 'Xin cho CHÍNH MÌNH được làm (hoặc xung phong), lịch sự tăng dần. Với sếp / thầy: ～させていただけませんか. Nhóm 1 không chèn さ: 休ませて, 帰らせて, 読ませて.' },

    /* ══════ ⑤ THỂ MỆNH LỆNH ══════ */
    { t: 'h', text: '⑤ Thể mệnh lệnh (命令形) — {行|い}け・{食|た}べろ・しろ・{来|こ}い' },
    {
      t: 'p',
      text: '**Thể mệnh lệnh** (命令形 めいれいけい) là cách ra lệnh **mạnh nhất, ngắn nhất**: "Làm đi!". Cách chia: nhóm 1 đổi âm cuối **う段 → え段** ({行|い}**く** → {行|い}**け**); nhóm 2 **bỏ る ＋ ろ** ({食|た}べ**る** → {食|た}べ**ろ**); nhóm 3 **する → しろ**, **{来|く}る → {来|こ}い**. Người học nước ngoài cần **HIỂU** thể này (rất hay nghe trong phim, thể thao, lúc khẩn cấp, biển báo, và trong câu **trích lời**), nhưng **gần như không nên tự dùng** với người khác — nghe thô, có thể bị coi là xúc phạm. Ai dùng được: **(1)** huấn luyện viên, chỉ huy trong lúc tập, thi đấu; **(2)** lúc **nguy hiểm, khẩn cấp** ({逃|に}げろ！{危|あぶ}ない、{止|と}まれ！); **(3)** lời **cổ vũ** ({頑張|がんば}れ！); **(4)** **biển báo, khẩu hiệu** ({止|と}まれ); **(5)** **nam giới** nói với bạn rất thân / người dưới, khi tức giận; **(6)** khi **trích lại** lời người khác: 「{早|はや}く{来|こ}い」と{言|い}われた. Nữ giới hầu như không dùng — thay bằng ～て／～なさい.',
    },
    {
      t: 'table',
      caption: 'Cách chia thể mệnh lệnh — đủ 3 nhóm',
      head: ['Nhóm', 'Luật', 'Ví dụ', 'Romaji'],
      rows: [
        ['1', 'う段 → **え段**', '{行|い}く → {行|い}**け** · {急|いそ}ぐ → {急|いそ}**げ** · {話|はな}す → {話|はな}**せ** · {待|ま}つ → {待|ま}**て** · {遊|あそ}ぶ → {遊|あそ}**べ** · {飲|の}む → {飲|の}**め** · {走|はし}る → {走|はし}**れ** · {言|い}う → {言|い}**え**', 'ike · isoge · hanase · mate · asobe · nome · hashire · ie'],
        ['1 (hay gặp)', '', '{止|と}まる → {止|と}ま**れ** · {頑張|がんば}る → {頑張|がんば}**れ** · {集|あつ}まる → {集|あつ}ま**れ** · {立|た}つ → {立|た}**て** · {座|すわ}る → {座|すわ}**れ** · {帰|かえ}る → {帰|かえ}**れ** · {出|だ}す → {出|だ}**せ**', 'tomare · ganbare · atsumare · tate · suware · kaere · dase'],
        ['2', 'bỏ る ＋ **ろ**', '{食|た}べる → {食|た}べ**ろ** · {見|み}る → {見|み}**ろ** · {起|お}きる → {起|お}き**ろ** · {寝|ね}る → {寝|ね}**ろ** · {逃|に}げる → {逃|に}げ**ろ** · {投|な}げる → {投|な}げ**ろ** · やめる → やめ**ろ**', 'tabero · miro · okiro · nero · nigero · nagero · yamero'],
        ['3', 'する → **しろ** · {来|く}る → **{来|こ}い**', 'する → **しろ** · {勉強|べんきょう}する → {勉強|べんきょう}**しろ** · {来|く}る → **{来|こ}い** · {持|も}ってくる → {持|も}って**こい**', 'shiro · benkyou shiro · koi · motte koi'],
        ['Đặc biệt', 'くれる → **くれ**', '{手伝|てつだ}って**くれ**（～てくれ = "làm giúp tao / anh đi" — nam, thân）', 'tetsudatte kure'],
        ['Văn viết (nhận ra)', 'する → **せよ** · nhóm 2 → ～**よ**', '{注意|ちゅうい}**せよ** · {答|こた}え**よ** (đề thi kiểu cũ, khẩu hiệu — N2)', 'chuui seyo · kotaeyo'],
      ],
    },
    {
      t: 'table',
      caption: '⚠ Bẫy: thể mệnh lệnh nhóm 1 trông giống thể khả năng (Bài 16)',
      head: ['Mệnh lệnh', 'Nghĩa', 'Thể khả năng', 'Nghĩa'],
      rows: [
        ['{帰|かえ}**れ**！', 'Về đi!', '{帰|かえ}**れる**', 'về được'],
        ['{書|か}**け**！', 'Viết đi!', '{書|か}**ける**', 'viết được'],
        ['{話|はな}**せ**！', 'Nói đi!', '{話|はな}**せる**', 'nói được'],
        ['{走|はし}**れ**！', 'Chạy đi!', '{走|はし}**れる**', 'chạy được'],
        ['{見|み}**ろ**！', 'Nhìn đi!', '{見|み}**られる**', 'xem được'],
        ['{来|こ}**い**！', 'Lại đây!', '{来|こ}**られる**', 'đến được'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Thể mệnh lệnh ở đúng chỗ của nó — sân tập, lúc nguy hiểm, cổ vũ, biển báo',
          vi: 'Câu thường **rất ngắn**, đứng một mình, hay kèm **よ** (mềm, thân hơn — nam) hoặc **ぞ**. Đọc to, dứt khoát.',
          examples: [
            E('{危|あぶ}ない！{止|と}まれ！', 'Abunai! Tomare!', 'Nguy hiểm! Dừng lại!'),
            E('{火事|かじ}だ！{早|はや}く{逃|に}げろ！', 'Kaji da! Hayaku nigero!', 'Cháy rồi! Chạy mau!'),
            E('{頑張|がんば}れ！あと{少|すこ}しだ！', 'Ganbare! Ato sukoshi da!', 'Cố lên! Chỉ còn chút nữa thôi!'),
            E('ボールをよく{見|み}ろ！', 'Booru o yoku miro!', 'Nhìn kỹ bóng vào!'),
            E('みんな、{集|あつ}まれ！', 'Minna, atsumare!', 'Mọi người, tập trung!'),
            E('（{道路|どうろ}の{字|じ}）{止|と}まれ', '(Douro no ji) Tomare', '(Chữ trên mặt đường) Dừng lại'),
            E('{早|はや}く{起|お}きろよ。{遅刻|ちこく}するぞ。', 'Hayaku okiro yo. Chikoku suru zo.', 'Dậy mau đi. Muộn bây giờ. (anh trai nói với em trai)'),
          ],
        },
        {
          formula: '「（mệnh lệnh）」と{言|い}われた ／ {言|い}った — trích lại mệnh lệnh của người khác',
          vi: 'Đây là chỗ người học **gặp thể mệnh lệnh nhiều nhất**: kể lại lời người khác (ポイント 118 「～」と{言|い}います + bị động Bài 22). Kể gián tiếp (mềm hơn) thì dùng mẫu ⑧ ～ように{言|い}われた.',
          examples: [
            E('{父|ちち}に「もっと{勉強|べんきょう}しろ」と{言|い}われました。', 'Chichi ni "Motto benkyou shiro" to iwaremashita.', 'Tôi bị bố bảo "Học thêm vào".'),
            E('コーチに「{最後|さいご}まで{走|はし}れ」と{言|い}われました。', 'Koochi ni "Saigo made hashire" to iwaremashita.', 'Tôi được huấn luyện viên dặn "Chạy đến cùng".'),
            E('{兄|あに}に「{早|はや}く{来|こ}い」と{言|い}われて、{急|いそ}いで{行|い}きました。', 'Ani ni "Hayaku koi" to iwarete, isoide ikimashita.', 'Bị anh trai bảo "Lại đây nhanh", tôi vội chạy tới.'),
            E('{先輩|せんぱい}に「{諦|あきら}めるな、{頑張|がんば}れ」と{言|い}われて、{元気|げんき}が{出|で}ました。', 'Senpai ni "Akirameru na, ganbare" to iwarete, genki ga demashita.', 'Được đàn anh bảo "Đừng bỏ cuộc, cố lên", tôi thấy có sức trở lại.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: "Câu đó là thể gì vậy?"',
      lines: [
        { who: 'リン', role: 'a', text: 'マルコさん、{昨日|きのう}アニメを{見|み}ていたら、「{逃|に}げろ！」って{言|い}っていました。{逃|に}げろって{何|なん}ですか。', ro: 'Maruko-san, kinou anime o mite itara, "Nigero!" tte itte imashita. Nigero tte nan desu ka.', vi: 'Marco ơi, hôm qua tôi xem anime thấy có câu "Nigero!". "Nigero" là gì vậy?' },
        { who: 'マルコ', role: 'b', text: '{逃|に}げるの{命令形|めいれいけい}だよ。「{早|はや}く{逃|に}げて！」という{意味|いみ}。{危|あぶ}ないときに{使|つか}うんだ。', ro: 'Nigeru no meireikei da yo. "Hayaku nigete!" to iu imi. Abunai toki ni tsukau n da.', vi: 'Là thể mệnh lệnh của nigeru đấy. Nghĩa là "Chạy mau!". Dùng lúc nguy hiểm.' },
        { who: 'リン', role: 'a', text: 'じゃ、{友達|ともだち}に「{来|こ}い」って{言|い}ってもいいですか。', ro: 'Ja, tomodachi ni "Koi" tte itte mo ii desu ka.', vi: 'Vậy tôi nói với bạn "Koi" được không?' },
        { who: 'マルコ', role: 'b', text: 'うーん、{男|おとこ}の{人|ひと}{同士|どうし}ならたまに{使|つか}うけど、{女|おんな}の{人|ひと}はあまり{使|つか}わないね。「{来|き}て」のほうがいいよ。', ro: 'Uun, otoko no hito doushi nara tama ni tsukau kedo, onna no hito wa amari tsukawanai ne. "Kite" no hou ga ii yo.', vi: 'Ừm, giữa con trai với nhau thì thỉnh thoảng có dùng, nhưng con gái thì ít dùng lắm. Nói "Kite" thì hơn.' },
        { who: 'リン', role: 'a', text: 'わかりました。じゃ、{道|みち}に{書|か}いてある「{止|と}まれ」も{命令形|めいれいけい}ですね。', ro: 'Wakarimashita. Ja, michi ni kaite aru "Tomare" mo meireikei desu ne.', vi: 'Tôi hiểu rồi. Vậy chữ "Tomare" viết trên đường cũng là thể mệnh lệnh nhỉ.' },
        { who: 'マルコ', role: 'b', text: 'そう。{交通|こうつう}のルールや{試合|しあい}の{応援|おうえん}では、{誰|だれ}でも{使|つか}うよ。{頑張|がんば}れ！とかね。', ro: 'Sou. Koutsuu no ruuru ya shiai no ouen de wa, dare demo tsukau yo. Ganbare! toka ne.', vi: 'Đúng. Luật giao thông hay cổ vũ trận đấu thì ai cũng dùng. Kiểu "Ganbare!" ấy.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với thể mệnh lệnh (sai → đúng)',
      items: [
        '~~{来|く}れ~~／~~{来|き}ろ~~ → **{来|こ}い** (こい); ~~すれ~~ → **しろ**. Nhóm 3 phải học thuộc.',
        '~~{食|た}べれ~~ → **{食|た}べろ** — nhóm 2 dùng **ろ** (một số vùng ở Nhật nói 食べれ — tiếng địa phương, không dùng trong đề). ~~{見|み}れ~~ → **{見|み}ろ**.',
        '~~くれろ~~ → **くれ** (～てくれ) — くれる là ngoại lệ duy nhất của nhóm 2 cần nhớ.',
        '**Đừng ra lệnh với thầy, sếp, người lạ, khách** — câu {先生|せんせい}、{来|こ}い là thô lỗ nghiêm trọng. Với người khác dùng **～てください** (ポイント 63), **～てくれませんか／～ていただけませんか** (Bài 18).',
        '**{頑張|がんば}れ ↔ {頑張|がんば}って** — cả hai là cổ vũ; {頑張|がんば}れ (mạnh, hô to, đám đông, nam) · {頑張|がんば}って (mềm, ai cũng dùng, nói với một người). Nói với người trên: {頑張|がんば}ってください.',
      ],
    },
    { t: 'rule', formula: 'Nhóm 1: う段 → え段（行け）· Nhóm 2: bỏ る ＋ ろ（食べろ）· する → しろ · 来る → 来い（こい）· くれる → くれ', vi: 'Lệnh mạnh, ngắn: sân tập, nguy hiểm, cổ vũ, biển báo, nam giới thân / người dưới, và trong câu trích lời. Người học: hiểu là chính, tự nói với người khác thì dùng ～てください.' },

    /* ══════ ⑥ CẤM ～な ══════ */
    { t: 'h', text: '⑥ V{辞書形|じしょけい} ＋ な — cấm: "Đừng…!"' },
    {
      t: 'p',
      text: '**Cấm** ở mức mạnh nhất: **V{辞書形|じしょけい} ＋ な** ({行|い}く**な**, {食|た}べる**な**, する**な**, {来|く}る**な**). Đây là "anh em" của thể mệnh lệnh — cùng người dùng, cùng hoàn cảnh: huấn luyện viên, lúc nguy hiểm ({触|さわ}るな！), biển báo, khẩu hiệu ({飛|と}び{出|だ}すな — đừng lao ra đường), nam giới với người dưới, và trong câu trích lời. Mềm hơn, ai cũng dùng được: **～ないで** (thân) → **～ないでください** (ポイント 88) → **～てはいけません** (ポイント 114 — quy định).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～な (chỉ một luật: thể từ điển + な)',
      head: ['Nhóm', 'Thể từ điển', 'Cấm', 'Romaji', 'Nghĩa'],
      rows: [
        ['1', '{触|さわ}る · {押|お}す · {走|はし}る', '{触|さわ}る**な** · {押|お}す**な** · {走|はし}る**な**', 'sawaru na · osu na · hashiru na', 'đừng chạm · đừng đẩy · đừng chạy'],
        ['2', '{忘|わす}れる · {負|ま}ける · {逃|に}げる · {諦|あきら}める', '{忘|わす}れる**な** · {負|ま}ける**な** · {逃|に}げる**な** · {諦|あきら}める**な**', 'wasureru na · makeru na · nigeru na · akirameru na', 'đừng quên · đừng thua · đừng trốn · đừng bỏ cuộc'],
        ['3', 'する · {心配|しんぱい}する · {来|く}る', 'する**な** · {心配|しんぱい}する**な** · {来|く}る**な**', 'suru na · shinpai suru na · kuru na', 'đừng làm · đừng lo · đừng đến'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{危|あぶ}ない！それに{触|さわ}るな！', 'Abunai! Sore ni sawaru na!', 'Nguy hiểm! Đừng chạm vào cái đó!'),
        E('{押|お}すな！{順番|じゅんばん}に{並|なら}べ！', 'Osu na! Junban ni narabe!', 'Đừng chen! Xếp hàng theo thứ tự!'),
        E('{最後|さいご}まで{諦|あきら}めるな！', 'Saigo made akirameru na!', 'Đừng bỏ cuộc cho đến cùng!'),
        E('{心配|しんぱい}するな。{大丈夫|だいじょうぶ}だよ。', 'Shinpai suru na. Daijoubu da yo.', 'Đừng lo. Không sao đâu. (bố nói với con trai)'),
        E('{明日|あした}の{約束|やくそく}、{忘|わす}れるなよ。', 'Ashita no yakusoku, wasureru na yo.', 'Đừng quên hẹn ngày mai đấy nhé.'),
        E('{父|ちち}に「{夜|よる}は{一人|ひとり}で{出|で}かけるな」と{言|い}われていました。', 'Chichi ni "Yoru wa hitori de dekakeru na" to iwarete imashita.', 'Tôi từng bị bố dặn "Tối không được ra ngoài một mình".'),
      ],
    },
    {
      t: 'table',
      caption: '⚠ Bốn chữ "な" dễ nhầm — nhìn thứ đứng TRƯỚC な',
      head: ['Câu', 'Trước な là…', 'Nghĩa', 'Loại'],
      rows: [
        ['{食|た}べる**な**', 'thể từ điển', 'Đừng ăn!', 'cấm (mẫu ⑥)'],
        ['{食|た}べ**な**', 'thân động từ (Vます bỏ ます)', 'Ăn đi! (văn nói thân, cắt từ {食|た}べなさい)', 'mệnh lệnh mềm'],
        ['{食|た}べ**なさい**', 'Vます bỏ ます', 'Ăn đi! (bố mẹ → con)', '～なさい (mẫu ⑦)'],
        ['いい**なあ**／{食|た}べたい**な**', 'tính từ / ～たい / câu hoàn chỉnh', 'Thích nhỉ / Muốn ăn quá', 'cảm thán, tự nói'],
      ],
    },
    { t: 'rule', formula: 'V{辞書形|じしょけい} ＋ な（行くな・食べるな・するな・来るな）', vi: 'Cấm mạnh — cùng hoàn cảnh với thể mệnh lệnh. Ai cũng dùng được: ～ないで（ください）. Phân biệt 食べるな (đừng ăn) ↔ 食べな (ăn đi) ↔ いいなあ (thích nhỉ).' },

    /* ══════ ⑦ ～なさい ══════ */
    { t: 'h', text: '⑦ Vます ＋ なさい — "Hãy… / …đi" (bố mẹ, thầy cô nói với trẻ)' },
    {
      t: 'p',
      text: '**Vます bỏ ます ＋ なさい**: {食|た}べ**なさい**, {寝|ね}**なさい**, {勉強|べんきょう}し**なさい**, {来|き}**なさい**. Là mệnh lệnh của **người trên nói với người dưới một cách "dạy bảo"**: bố mẹ → con, thầy cô → học sinh, và **lời dặn trong bài tập, đề kiểm tra ở trường** ({正|ただ}しいものを{選|えら}びなさい — Chọn đáp án đúng; đề JLPT thật thì viết えらんでください). Nghe **mềm và lịch hơn thể mệnh lệnh** (nữ cũng dùng), nhưng **không bao giờ** nói với người trên hoặc người ngang hàng. Không có dạng phủ định ~~～なさいな~~ — muốn cấm thì dùng ～ないで（ください）／～てはいけません.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～なさい',
      head: ['Nhóm', 'Thể ます', '～なさい', 'Romaji'],
      rows: [
        ['1', '{書|か}きます · {帰|かえ}ります · {急|いそ}ぎます', '{書|か}き**なさい** · {帰|かえ}り**なさい** · {急|いそ}ぎ**なさい**', 'kakinasai · kaerinasai · isoginasai'],
        ['2', '{食|た}べます · {寝|ね}ます · {起|お}きます · {片付|かたづ}けます', '{食|た}べ**なさい** · {寝|ね}**なさい** · {起|お}き**なさい** · {片付|かたづ}け**なさい**', 'tabenasai · nenasai · okinasai · katazukenasai'],
        ['3', 'します · {勉強|べんきょう}します · {来|き}ます', 'し**なさい** · {勉強|べんきょう}し**なさい** · {来|き}**なさい** (きなさい)', 'shinasai · benkyou shinasai · kinasai'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('もう{十時|じゅうじ}よ。{早|はや}く{寝|ね}なさい。', 'Mou juuji yo. Hayaku nenasai.', 'Mười giờ rồi đấy. Đi ngủ sớm đi.'),
        E('ご{飯|はん}の{前|まえ}に、{手|て}を{洗|あら}いなさい。', 'Gohan no mae ni, te o arainasai.', 'Trước bữa ăn thì rửa tay đi.'),
        E('{遊|あそ}んだら、おもちゃを{片付|かたづ}けなさい。', 'Asondara, omocha o katazukenasai.', 'Chơi xong thì dọn đồ chơi đi.'),
        E('{宿題|しゅくだい}をしてから、テレビを{見|み}なさい。', 'Shukudai o shite kara, terebi o minasai.', 'Làm bài tập xong rồi mới xem ti vi. (ポイント 107)'),
        E('{先生|せんせい}の{話|はなし}をよく{聞|き}きなさい。', 'Sensei no hanashi o yoku kikinasai.', 'Nghe kỹ lời thầy cô nói đi.'),
        E('{次|つぎ}の{文|ぶん}を{読|よ}んで、{質問|しつもん}に{答|こた}えなさい。', 'Tsugi no bun o yonde, shitsumon ni kotaenasai.', 'Đọc đoạn sau và trả lời câu hỏi. (lời dặn trong bài kiểm tra)'),
      ],
    },
    {
      t: 'table',
      caption: '⭐ Thang ra lệnh / nhờ — từ mạnh nhất đến lịch sự nhất',
      head: ['Mức', 'Làm', 'Đừng làm', 'Ai nói với ai'],
      rows: [
        ['1 · mệnh lệnh', '{待|ま}て！', '{行|い}くな！', 'huấn luyện viên, khẩn cấp, biển báo, nam (thân / người dưới)'],
        ['2 · ～なさい', '{待|ま}ちなさい。', '(～ないで)', 'bố mẹ → con, thầy cô → học sinh, lời dặn trong bài tập'],
        ['3 · ～て', '{待|ま}って。', '{行|い}かないで。', 'gia đình, bạn bè (ai cũng dùng)'],
        ['4 · ～てください', '{待|ま}ってください。', '{行|い}かないでください。', 'lịch sự thường ngày (cũng là "bảo", với người trên tránh dùng nhiều)'],
        ['5 · ～てくれませんか', '{待|ま}ってくれませんか。', '{行|い}かないでくれませんか。', 'nhờ người ngang hàng, mềm (Bài 18)'],
        ['6 · ～ていただけませんか', '{待|ま}っていただけませんか。', '—', 'nhờ người trên, khách — lịch sự nhất'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～なさい (sai → đúng)',
      items: [
        '~~{食|た}べるなさい~~ → **{食|た}べなさい** — trước なさい là **thân động từ thể ます** (bỏ ます), không phải thể từ điển.',
        '~~{来|く}なさい~~ / ~~{来|こ}なさい~~ → **{来|き}なさい** (きなさい) — vì thể ます là {来|き}ます.',
        '~~{部長|ぶちょう}、{座|すわ}りなさい~~ → **お{座|すわ}りください**／**{座|すわ}ってください** — なさい là lời "dạy bảo" từ trên xuống; với người trên là vô lễ.',
        '**おやすみなさい** (chúc ngủ ngon) — vốn từ {休|やす}みなさい, nay là câu chào cố định, ai cũng nói được với ai.',
      ],
    },
    { t: 'rule', formula: 'Vます（bỏ ます）＋ なさい（食べなさい・しなさい・来なさい）', vi: 'Lời bảo của bố mẹ, thầy cô với trẻ, và lời dặn trong bài kiểm tra ở trường. Mềm hơn thể mệnh lệnh, nữ cũng dùng; không dùng với người trên / ngang hàng.' },

    /* ══════ ⑧ ～ように言う ══════ */
    { t: 'h', text: '⑧ V{辞書形|じしょけい}／Vない ＋ ように{言|い}う・{頼|たの}む・{注意|ちゅうい}する・{伝|つた}える — nói lại lời dặn, yêu cầu' },
    {
      t: 'p',
      text: 'Khi **kể lại** rằng ai đó đã **bảo / nhờ / nhắc** (một người) làm gì — mà **không trích nguyên văn** — tiếng Nhật dùng **～ように ＋ {言|い}う／{頼|たの}む／{注意|ちゅうい}する／{伝|つた}える**: {先生|せんせい}は{学生|がくせい}に{毎日|まいにち}{復習|ふくしゅう}する**ように{言|い}いました** (thầy dặn học sinh ôn bài mỗi ngày). Trước ように là **V{辞書形|じしょけい}** (bảo làm) hoặc **Vない** (bảo đừng làm). Người **được dặn** đi với **に**. Khi **chính mình là người được dặn**, dùng bị động (Bài 22): **{先生|せんせい}に～ように{言|い}われました**. Một lời dặn trực tiếp ở bất kỳ mức nào — 「{寝|ね}ろ」「{寝|ね}なさい」「{寝|ね}てください」「{寝|ね}てくれませんか」 — khi kể lại đều có thể gom thành **{寝|ね}るように{言|い}われた**. Cách này **lịch sự, gọn**, và rất hay dùng ở công ty: {部長|ぶちょう}に、{報告書|ほうこくしょ}を{金曜日|きんようび}までに{出|だ}すように{言|い}われました.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ように ＋ động từ nói',
      head: ['Lời dặn', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['bảo làm', 'A は B に V{辞書形|じしょけい} ように{言|い}う', '{母|はは}は{弟|おとうと}に{早|はや}く{寝|ね}るように{言|い}いました。', 'Haha wa otouto ni hayaku neru you ni iimashita.'],
        ['bảo đừng làm', 'A は B に Vない ように{言|い}う', '{医者|いしゃ}は{父|ちち}にお{酒|さけ}を{飲|の}まないように{言|い}いました。', 'Isha wa chichi ni osake o nomanai you ni iimashita.'],
        ['nhờ', '～ように{頼|たの}む', '{友達|ともだち}にノートを{見|み}せてくれるように{頼|たの}みました。', 'Tomodachi ni nooto o misete kureru you ni tanomimashita.'],
        ['nhắc nhở', '～ように{注意|ちゅうい}する', '{弟|おとうと}に{道|みち}で{走|はし}らないように{注意|ちゅうい}しました。', 'Otouto ni michi de hashiranai you ni chuui shimashita.'],
        ['nhắn lại', '～ように{伝|つた}えてください', '{山口|やまぐち}さんに{会議室|かいぎしつ}に{来|く}るように{伝|つた}えてください。', 'Yamaguchi-san ni kaigishitsu ni kuru you ni tsutaete kudasai.'],
        ['mình được dặn (bị động)', '（私は）A に ～ように{言|い}われる', '{部長|ぶちょう}に{資料|しりょう}をコピーするように{言|い}われました。', 'Buchou ni shiryou o kopii suru you ni iwaremashita.'],
        ['ghi trên giấy / biển', '～ように{書|か}いてある', 'ここに{自転車|じてんしゃ}を{止|と}めないように{書|か}いてあります。', 'Koko ni jitensha o tomenai you ni kaite arimasu.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A は B に ～ように{言|い}う・{頼|たの}む・{注意|ちゅうい}する — "A dặn / nhờ / nhắc B (đừng) làm…"',
          vi: 'Kể lại lời dặn của người khác. Thì của câu nằm ở **cuối** ({言|い}いました, {言|い}っています); trước ように luôn là **thể từ điển / ない**.',
          examples: [
            E('{先生|せんせい}は{学生|がくせい}に{毎日|まいにち}{漢字|かんじ}を{五|いつ}つ{覚|おぼ}えるように{言|い}いました。', 'Sensei wa gakusei ni mainichi kanji o itsutsu oboeru you ni iimashita.', 'Thầy dặn học sinh mỗi ngày nhớ năm chữ Hán.'),
            E('{母|はは}は{私|わたし}に{知|し}らない{人|ひと}について{行|い}かないように{言|い}いました。', 'Haha wa watashi ni shiranai hito ni tsuite ikanai you ni iimashita.', 'Mẹ dặn tôi đừng đi theo người lạ.'),
            E('{隣|となり}の{人|ひと}に、{夜|よる}は{静|しず}かにしてくれるように{頼|たの}みました。', 'Tonari no hito ni, yoru wa shizuka ni shite kureru you ni tanomimashita.', 'Tôi nhờ người hàng xóm buổi tối giữ yên lặng giúp.'),
            E('{店長|てんちょう}はアルバイトの{人|ひと}たちに{遅|おく}れないように{注意|ちゅうい}しました。', 'Tenchou wa arubaito no hitotachi ni okurenai you ni chuui shimashita.', 'Chủ quán nhắc những người làm thêm đừng đến muộn.'),
            E('{弟|おとうと}に、{帰|かえ}りにパンを{買|か}ってくるように{伝|つた}えてください。', 'Otouto ni, kaeri ni pan o katte kuru you ni tsutaete kudasai.', 'Nhắn em trai giúp tôi là trên đường về thì mua bánh mì nhé.'),
            E('{子|こ}どもたちに、{公園|こうえん}でボールを{投|な}げないように{言|い}ってください。', 'Kodomotachi ni, kouen de booru o nagenai you ni itte kudasai.', 'Hãy dặn bọn trẻ đừng ném bóng trong công viên.'),
          ],
        },
        {
          formula: '（私は）A に ～ように{言|い}われる — "tôi được / bị A dặn…"',
          vi: 'Bị động của {言|い}う (Bài 22): **người dặn đi với に**. ～ように{言|い}われている = lời dặn **đang còn hiệu lực** (quy định mình phải theo). Rất hay dùng để **giải thích lý do** ở chỗ làm: {部長|ぶちょう}に～ように{言|い}われているので….',
          examples: [
            E('{医者|いしゃ}に{甘|あま}いものを{食|た}べないように{言|い}われました。', 'Isha ni amai mono o tabenai you ni iwaremashita.', 'Tôi bị bác sĩ dặn đừng ăn đồ ngọt.'),
            E('{子|こ}どもの{頃|ころ}、{祖母|そぼ}にご{飯|はん}を{残|のこ}さないように{言|い}われました。', 'Kodomo no koro, sobo ni gohan o nokosanai you ni iwaremashita.', 'Hồi nhỏ tôi được bà dặn đừng để thừa cơm.'),
            E('{部長|ぶちょう}に、{報告書|ほうこくしょ}を{金曜日|きんようび}までに{出|だ}すように{言|い}われています。', 'Buchou ni, houkokusho o kin\'youbi made ni dasu you ni iwarete imasu.', 'Tôi được trưởng phòng dặn nộp báo cáo trước thứ Sáu.'),
            E('コーチに、{試合|しあい}の{前|まえ}の{日|ひ}は{早|はや}く{寝|ね}るように{言|い}われました。', 'Koochi ni, shiai no mae no hi wa hayaku neru you ni iwaremashita.', 'Tôi được huấn luyện viên dặn ngày trước trận đấu phải ngủ sớm.'),
            E('{大家|おおや}さんに、ごみは{朝|あさ}{八時|はちじ}までに{出|だ}すように{言|い}われています。', 'Ooya-san ni, gomi wa asa hachiji made ni dasu you ni iwarete imasu.', 'Tôi được chủ nhà dặn rác phải đổ trước 8 giờ sáng.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⭐ Trích nguyên văn 「～」と{言|い}われた ↔ kể lại ～ように{言|い}われた',
      head: ['Lời gốc', 'Trích nguyên văn (ポイント 118)', 'Kể lại bằng ように', 'Romaji (ように)'],
      rows: [
        ['{早|はや}く{寝|ね}なさい。', '「{早|はや}く{寝|ね}なさい」と{言|い}われた。', '{早|はや}く{寝|ね}る**ように{言|い}われた**。', 'Hayaku neru you ni iwareta.'],
        ['{走|はし}れ！', '「{走|はし}れ」と{言|い}われた。', '{走|はし}る**ように{言|い}われた**。', 'Hashiru you ni iwareta.'],
        ['ここに{入|はい}るな。', '「ここに{入|はい}るな」と{言|い}われた。', 'ここに{入|はい}らない**ように{言|い}われた**。', 'Koko ni hairanai you ni iwareta.'],
        ['{手伝|てつだ}ってください。', '「{手伝|てつだ}ってください」と{頼|たの}まれた。', '{手伝|てつだ}う**ように{頼|たの}まれた**。', 'Tetsudau you ni tanomareta.'],
        ['{遅|おく}れないでください。', '「{遅|おく}れないでください」と{言|い}われた。', '{遅|おく}れない**ように{言|い}われた**。', 'Okurenai you ni iwareta.'],
        ['{窓|まど}を{閉|し}めてくれませんか。', '「{窓|まど}を{閉|し}めてくれませんか」と{頼|たの}まれた。', '{窓|まど}を{閉|し}める**ように{頼|たの}まれた**。', 'Mado o shimeru you ni tanomareta.'],
        ['すぐ{報告|ほうこく}しろ。', '「すぐ{報告|ほうこく}しろ」と{言|い}われた。', 'すぐ{報告|ほうこく}する**ように{言|い}われた**。', 'Sugu houkoku suru you ni iwareta.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: "Thầy dặn gì thế?"',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'パクさん、{昨日|きのう}{授業|じゅぎょう}を{休|やす}んだんだけど、{本田先生|ほんだせんせい}は{何|なに}か{言|い}っていた？', ro: 'Paku-san, kinou jugyou o yasunda n da kedo, Honda-sensei wa nani ka itte ita?', vi: 'Park ơi, hôm qua mình nghỉ học, thầy Honda có dặn gì không?' },
        { who: 'パク', role: 'a', text: 'うん。{来週|らいしゅう}の{月曜日|げつようび}までに、{作文|さくぶん}を{書|か}いてくるように{言|い}っていたよ。', ro: 'Un. Raishuu no getsuyoubi made ni, sakubun o kaite kuru you ni itte ita yo.', vi: 'Có. Thầy dặn trước thứ Hai tuần sau phải viết bài văn mang đến.' },
        { who: 'ダニエル', role: 'b', text: 'テーマは？', ro: 'Teema wa?', vi: 'Chủ đề là gì?' },
        { who: 'パク', role: 'a', text: '「{子|こ}どもの{頃|ころ}の{思|おも}い{出|で}」。それから、{辞書|じしょ}を{使|つか}わないで{書|か}くように{言|い}われたよ。', ro: '"Kodomo no koro no omoide". Sorekara, jisho o tsukawanaide kaku you ni iwareta yo.', vi: '"Kỷ niệm thời thơ ấu". Còn nữa, mình được dặn là viết mà không dùng từ điển.' },
        { who: 'ダニエル', role: 'b', text: 'えっ、{辞書|じしょ}なしで？{大変|たいへん}だなあ。ほかには？', ro: 'E, jisho nashi de? Taihen da naa. Hoka ni wa?', vi: 'Hả, không có từ điển á? Khó nhỉ. Còn gì nữa không?' },
        { who: 'パク', role: 'a', text: '{休|やす}んだ{人|ひと}には、{先生|せんせい}の{研究室|けんきゅうしつ}にプリントを{取|と}りに{来|く}るように{伝|つた}えてって{頼|たの}まれたの。だから、{今|いま}{伝|つた}えたよ。', ro: 'Yasunda hito ni wa, sensei no kenkyuushitsu ni purinto o tori ni kuru you ni tsutaete tte tanomareta no. Dakara, ima tsutaeta yo.', vi: 'Mình được thầy nhờ nhắn những ai nghỉ là đến phòng thầy lấy tài liệu. Nên giờ mình nhắn cậu đây.' },
        { who: 'ダニエル', role: 'b', text: 'ありがとう。じゃ、{今|いま}から{取|と}りに{行|い}ってくる。', ro: 'Arigatou. Ja, ima kara tori ni itte kuru.', vi: 'Cảm ơn nhé. Vậy giờ mình đi lấy luôn đây.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ように言う (sai → đúng)',
      items: [
        '**Chỉ dùng cho lời BẢO / NHỜ / CẤM.** Câu kể, câu hỏi, lời rủ thì không dùng ように: ~~{田中|たなか}さんは{明日|あした}{雨|あめ}が{降|ふ}るように{言|い}った~~ → **{雨|あめ}が{降|ふ}ると{言|い}った** (ポイント 118) · ~~{一緒|いっしょ}に{行|い}くように{言|い}われた~~ (nếu là lời RỦ 「{一緒|いっしょ}に{行|い}きませんか」) → **{一緒|いっしょ}に{行|い}こうと{誘|さそ}われた**.',
        '~~{早|はや}く{寝|ね}なさいように{言|い}われた~~ / ~~{寝|ね}ますように~~ → **{寝|ね}るように** — trước ように chỉ là **thể từ điển / ない**; ～ますように là câu **cầu mong** (Bài 21).',
        '~~{先生|せんせい}が{私|わたし}に{言|い}われた~~ → **{私|わたし}は{先生|せんせい}に{言|い}われた** — trong câu bị động, người dặn đi với **に**, người nhận đi với は／が.',
        '~~{部長|ぶちょう}に{会議室|かいぎしつ}に{来|く}るように{伝|つた}えてください~~ (bảo trưởng phòng phải đến!) → **{部長|ぶちょう}に、{山口|やまぐち}さんがお{待|ま}ちしていると{伝|つた}えてください** — ～ように{伝|つた}える／{言|い}う là **lời bảo**, nên người nhận lời dặn thường là **người ngang hàng hoặc dưới**. Muốn nhờ chuyển lời tới cấp trên thì phải dùng kính ngữ (Bài 24) — ở N4, cách an toàn là chỉ nhắn **thông tin** (～と{伝|つた}えてください).',
        '**ように (mục đích — Bài 21) ↔ ように{言|い}う (lời dặn)** — {忘|わす}れないように、メモする (ĐỂ khỏi quên) · {忘|わす}れないように{言|い}う (DẶN đừng quên). Nhìn động từ **ngay sau ように**: là {言|い}う・{頼|たの}む・{注意|ちゅうい}する・{伝|つた}える → lời dặn.',
      ],
    },
    { t: 'rule', formula: 'A は B に V{辞書形|じしょけい}／Vない ＋ ように{言|い}う・{頼|たの}む・{注意|ちゅうい}する・{伝|つた}える ／ （私は）A に ～ように{言|い}われる', vi: 'Kể lại lời bảo / nhờ / cấm (không trích nguyên văn). Người được dặn đi với に. Không dùng cho câu kể, câu hỏi, lời rủ (→ と言う). Người nhận lời dặn phải là ngang hàng / dưới.' },

    /* ══════ ⑨ ～させられる (nhận ra) ══════ */
    { t: 'h', text: '⑨ (Giới thiệu — N3) V(さ)せられる ／ ～される — thể sai khiến bị động: "bị bắt làm"' },
    {
      t: 'p',
      text: '**Thể sai khiến bị động** (使役受身形) = sai khiến ①　＋ bị động (Bài 22): {食|た}べ**させ** ＋ **られる** → {食|た}べ**させられる**. Nghĩa: người nói (B) **bị (A) bắt làm** một việc mình **không muốn**: {子|こ}どもの{頃|ころ}、{母|はは}に{野菜|やさい}を{食|た}べさせられた (hồi nhỏ tôi bị mẹ bắt ăn rau). Người **bắt** đi với **に**. Đây là ngữ pháp **N3** — ở Bài 23 bạn chỉ cần **NGHE RA và HIỂU** khi gặp trong bài đọc, bài nghe (rất hay xuất hiện trong chủ đề "hồi nhỏ", "câu lạc bộ", "công ty"). Nhóm 1 thường **rút gọn**: ～せられる → **～される** ({行|い}かせられる → {行|い}か**される**), trừ động từ đuôi **す** ({話|はな}させられる — không rút gọn).',
    },
    {
      t: 'table',
      caption: 'Nhận ra thể sai khiến bị động',
      head: ['Nhóm', 'Thể từ điển', 'Sai khiến', 'Sai khiến bị động', 'Romaji', 'Nghĩa'],
      rows: [
        ['1', '{行|い}く', '{行|い}かせる', '{行|い}か**される** (= {行|い}かせられる)', 'ikasareru', 'bị bắt đi'],
        ['1', '{飲|の}む', '{飲|の}ませる', '{飲|の}ま**される**', 'nomasareru', 'bị bắt uống'],
        ['1', '{待|ま}つ', '{待|ま}たせる', '{待|ま}た**される**', 'matasareru', 'bị bắt chờ (phải chờ lâu)'],
        ['1', '{習|なら}う', '{習|なら}わせる', '{習|なら}わ**される**', 'narawasareru', 'bị bắt học'],
        ['1 (đuôi す)', '{話|はな}す', '{話|はな}させる', '{話|はな}さ**せられる** (không rút gọn)', 'hanasaserareru', 'bị bắt nói'],
        ['2', '{食|た}べる', '{食|た}べさせる', '{食|た}べ**させられる**', 'tabesaserareru', 'bị bắt ăn'],
        ['3', 'する', 'させる', '**させられる**', 'saserareru', 'bị bắt làm'],
        ['3', '{来|く}る', '{来|こ}させる', '{来|こ}**させられる**', 'kosaserareru', 'bị bắt đến'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{子|こ}どもの{頃|ころ}、{毎日|まいにち}ピアノを{練習|れんしゅう}させられました。', 'Kodomo no koro, mainichi piano o renshuu saseraremashita.', 'Hồi nhỏ ngày nào tôi cũng bị bắt tập piano.'),
        E('{母|はは}に{嫌|きら}いな{野菜|やさい}を{食|た}べさせられました。', 'Haha ni kirai na yasai o tabesaseraremashita.', 'Tôi bị mẹ bắt ăn rau mình ghét.'),
        E('{駅|えき}で{友達|ともだち}に{一時間|いちじかん}も{待|ま}たされました。', 'Eki de tomodachi ni ichijikan mo matasaremashita.', 'Tôi bị bạn bắt chờ ở ga đến cả tiếng.'),
        E('{部活|ぶかつ}の{先輩|せんぱい}に{毎日|まいにち}グラウンドを{走|はし}らされました。', 'Bukatsu no senpai ni mainichi guraundo o hashirasaremashita.', 'Ngày nào tôi cũng bị đàn anh câu lạc bộ bắt chạy quanh sân.'),
        E('{飲|の}み{会|かい}で、{部長|ぶちょう}に{歌|うた}を{歌|うた}わされました。', 'Nomikai de, buchou ni uta o utawasaremashita.', 'Ở buổi nhậu, tôi bị trưởng phòng bắt hát.'),
        E('{授業|じゅぎょう}で{先生|せんせい}に{前|まえ}に{出|で}て{話|はな}させられて、{恥|は}ずかしかったです。', 'Jugyou de sensei ni mae ni dete hanasaserarete, hazukashikatta desu.', 'Trong giờ học tôi bị thầy bắt lên trước lớp nói, ngượng quá.'),
      ],
    },
    {
      t: 'table',
      caption: '⭐ Bốn thể có "れる／られる／せる" — phân biệt bằng nghĩa (với {書|か}く và {食|た}べる)',
      head: ['Thể', '{書|か}く', '{食|た}べる', 'Ai làm? Ai muốn?', 'Câu mẫu'],
      rows: [
        ['Khả năng (Bài 16)', '{書|か}ける', '{食|た}べられる', 'tôi làm được', '{漢字|かんじ}が{書|か}けます。'],
        ['Bị động (Bài 22)', '{書|か}かれる', '{食|た}べられる', 'người khác làm, tôi chịu', '{弟|おとうと}にケーキを{食|た}べられた。'],
        ['Sai khiến ①', '{書|か}かせる', '{食|た}べさせる', 'A muốn, B làm', '{母|はは}は{弟|おとうと}に{野菜|やさい}を{食|た}べさせた。'],
        ['Sai khiến bị động ⑨', '{書|か}かされる', '{食|た}べさせられる', 'A muốn, TÔI bị bắt làm', '{母|はは}に{野菜|やさい}を{食|た}べさせられた。'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe ra ～させられる trong bài nghe / bài đọc',
      items: [
        'Thấy **させられ** (nhóm 2, 3, đuôi す) hoặc **～かされ・～まされ・～たされ・～らされ・～わされ** (nhóm 1 rút gọn) → **"bị bắt"**. Người bắt đi với **に**.',
        'Câu "bị bắt" thường đi kèm cảm xúc **{嫌|いや}だった, {大変|たいへん}だった, {恥|は}ずかしかった** — nhưng cũng có khi người nói **biết ơn sau này**: {毎日|まいにち}{練習|れんしゅう}させられたけど、{今|いま}は{感謝|かんしゃ}している.',
        'Đừng nhầm **{待|ま}たされた** (bị bắt chờ — phải chờ lâu, do người kia trễ) với **{待|ま}たせた** (mình làm người khác chờ — mẫu ③). Đề N4 có thể cho cả hai trong bài nghe.',
        'Ở Bài 23 bạn **không cần tự chia** ～させられる cho đúng mọi động từ — chỉ cần chọn đúng nghĩa khi gặp. Bảng chia đầy đủ và cách dùng học ở N3.',
      ],
    },
    { t: 'rule', formula: '（私は）A に（N を）V(さ)せられる ／ 行かされる・飲まされる・待たされる', vi: 'Bị (A) bắt làm việc mình không muốn — N3, Bài 23 chỉ cần nhận ra. Nhóm 1 rút gọn ～せられる → ～される (trừ đuôi す: 話させられる).' },

    /* ══════ TÓM TẮT CHỌN MẪU ══════ */
    {
      t: 'table',
      caption: '⭐ Chọn nhanh — đọc tình huống, chọn mẫu',
      head: ['Tình huống / từ khoá', 'Mẫu', 'Ví dụ'],
      rows: [
        ['bố mẹ / thầy / sếp + việc của người dưới', '～させる (②)', '{母|はは}は{私|わたし}に{掃除|そうじ}をさせた'],
        ['～てくれた／～てもらった + sai khiến', '～させてくれる／もらう (③)', '{父|ちち}は{留学|りゅうがく}させてくれた'],
        ['{心配|しんぱい}・{待|ま}つ・{笑|わら}う・{泣|な}く・{喜|よろこ}ぶ', 'B を ～させる (③)', '{親|おや}を{心配|しんぱい}させた'],
        ['mình xin được làm / xung phong', '～させてください／いただけませんか (④)', '{私|わたし}にやらせてください'],
        ['sân bóng · khẩn cấp · cổ vũ · biển báo', 'mệnh lệnh (⑤) / ～な (⑥)', '{走|はし}れ！{止|と}まるな！'],
        ['bố mẹ, thầy cô → trẻ', '～なさい (⑦)', '{早|はや}く{寝|ね}なさい'],
        ['kể lại lời bảo / nhờ / cấm', '～ように{言|い}う／{言|い}われる (⑧)', '{来|く}るように{言|い}われた'],
        ['bị bắt làm (than)', '～させられる (⑨)', '{練習|れんしゅう}させられた'],
      ],
    },

    /* ══════ LUYỆN TỔNG HỢP ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, chia, điền, sửa câu, trắc nghiệm kiểu đề N4' },
    {
      t: 'build',
      id: 'b23-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (13 câu)',
      items: [
        { vi: 'Mẹ bắt em trai ăn rau.', chips: ['{母|はは}は', '{弟|おとうと}に', '{野菜|やさい}を', '{食|た}べさせました', '{弟|おとうと}を', '{食|た}べられました'], answer: ['{母|はは}は', '{弟|おとうと}に', '{野菜|やさい}を', '{食|た}べさせました'], ro: 'Haha wa otouto ni yasai o tabesasemashita.' },
        { vi: 'Thầy bắt học sinh đứng.', chips: ['{先生|せんせい}は', '{学生|がくせい}を', '{立|た}たせました', '{学生|がくせい}が', '{立|た}てました'], answer: ['{先生|せんせい}は', '{学生|がくせい}を', '{立|た}たせました'], ro: 'Sensei wa gakusei o tatasemashita.' },
        { vi: 'Bố đã cho tôi đi du học.', chips: ['{父|ちち}は', '{私|わたし}を', '{留学|りゅうがく}', 'させてくれました', 'させてもらいました', '{私|わたし}が'], answer: ['{父|ちち}は', '{私|わたし}を', '{留学|りゅうがく}', 'させてくれました'], ro: 'Chichi wa watashi o ryuugaku sasete kuremashita.' },
        { vi: 'Hồi nhỏ tôi không được cho chơi game.', chips: ['{子|こ}どもの{頃|ころ}', 'ゲームを', 'させて', 'もらえませんでした', 'くれました', 'させられて'], answer: ['{子|こ}どもの{頃|ころ}', 'ゲームを', 'させて', 'もらえませんでした'], ro: 'Kodomo no koro geemu o sasete moraemasen deshita.' },
        { vi: 'Xin lỗi đã để anh chờ lâu.', chips: ['{長|なが}い{時間|じかん}', '{待|ま}たせて', 'すみません', '{待|ま}って', '{待|ま}たされて'], answer: ['{長|なが}い{時間|じかん}', '{待|ま}たせて', 'すみません'], ro: 'Nagai jikan matasete sumimasen.' },
        { vi: 'Hôm nay cho tôi về sớm ạ.', chips: ['{今日|きょう}は', '{早|はや}く', '{帰|かえ}らせて', 'ください', '{帰|かえ}って', '{帰|かえ}らさせて'], answer: ['{今日|きょう}は', '{早|はや}く', '{帰|かえ}らせて', 'ください'], ro: 'Kyou wa hayaku kaerasete kudasai.' },
        { vi: 'Thưa trưởng phòng, anh cho em phụ trách việc này được không ạ?', chips: ['{部長|ぶちょう}、', 'この{仕事|しごと}を', '{担当|たんとう}', 'させて', 'いただけませんか', 'くれませんか'], answer: ['{部長|ぶちょう}、', 'この{仕事|しごと}を', '{担当|たんとう}', 'させて', 'いただけませんか'], ro: 'Buchou, kono shigoto o tantou sasete itadakemasen ka.' },
        { vi: 'Nguy hiểm! Chạy mau!', chips: ['{危|あぶ}ない！', '{早|はや}く', '{逃|に}げろ！', '{逃|に}げるな！'], answer: ['{危|あぶ}ない！', '{早|はや}く', '{逃|に}げろ！'], ro: 'Abunai! Hayaku nigero!' },
        { vi: 'Đừng chạm vào cái đó!', chips: ['それに', '{触|さわ}るな！', '{触|さわ}りな！', 'それを'], answer: ['それに', '{触|さわ}るな！'], ro: 'Sore ni sawaru na!' },
        { vi: 'Dọn đồ chơi đi. (mẹ nói với con)', chips: ['おもちゃを', '{片付|かたづ}け', 'なさい', '{片付|かたづ}ける', 'な'], answer: ['おもちゃを', '{片付|かたづ}け', 'なさい'], ro: 'Omocha o katazukenasai.' },
        { vi: 'Thầy dặn học sinh ôn bài mỗi ngày.', chips: ['{先生|せんせい}は', '{学生|がくせい}に', '{毎日|まいにち}', '{復習|ふくしゅう}する', 'ように', '{言|い}いました', 'ために'], answer: ['{先生|せんせい}は', '{学生|がくせい}に', '{毎日|まいにち}', '{復習|ふくしゅう}する', 'ように', '{言|い}いました'], ro: 'Sensei wa gakusei ni mainichi fukushuu suru you ni iimashita.' },
        { vi: 'Tôi bị bác sĩ dặn đừng uống rượu.', chips: ['{医者|いしゃ}に', 'お{酒|さけ}を', '{飲|の}まない', 'ように', '{言|い}われました', '{言|い}いました', '{医者|いしゃ}が'], answer: ['{医者|いしゃ}に', 'お{酒|さけ}を', '{飲|の}まない', 'ように', '{言|い}われました'], ro: 'Isha ni osake o nomanai you ni iwaremashita.' },
        { vi: 'Hồi nhỏ ngày nào tôi cũng bị bắt tập piano.', chips: ['{子|こ}どもの{頃|ころ}', '{毎日|まいにち}', 'ピアノを', '{練習|れんしゅう}', 'させられました', 'させました'], answer: ['{子|こ}どもの{頃|ころ}', '{毎日|まいにち}', 'ピアノを', '{練習|れんしゅう}', 'させられました'], ro: 'Kodomo no koro mainichi piano o renshuu saseraremashita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b23-np-chia',
      title: 'Chia — gõ dạng được yêu cầu (18 câu)',
      kind: 'fill',
      grammar: 'Sai khiến: nhóm 1 あ段＋せる · nhóm 2 ＋させる · させる／来させる · Mệnh lệnh: え段 · ろ · しろ · 来い · Cấm: V辞書形＋な · Vます＋なさい',
      items: [
        { q: '{行|い}く → thể sai khiến', answers: V('{行|い}かせる'), hint: 'く → か ＋ せる' },
        { q: '{言|い}う → thể sai khiến', answers: V('{言|い}わせる'), hint: 'う → わ ＋ せる' },
        { q: '{待|ま}つ → thể sai khiến', answers: V('{待|ま}たせる'), hint: 'つ → た ＋ せる' },
        { q: '{話|はな}す → thể sai khiến', answers: V('{話|はな}させる'), hint: 'す → さ ＋ せる' },
        { q: '{休|やす}む → thể sai khiến, dạng ます', answers: V('{休|やす}ませます'), hint: 'không có さ thừa' },
        { q: '{帰|かえ}る → thể sai khiến', answers: V('{帰|かえ}らせる'), hint: 'nhóm 1 ngoại lệ' },
        { q: '{食|た}べる → thể sai khiến', answers: V('{食|た}べさせる'), hint: 'nhóm 2' },
        { q: '{来|く}る → thể sai khiến', answers: V('{来|こ}させる'), hint: 'こさせる' },
        { q: '{勉強|べんきょう}する → thể sai khiến', answers: V('{勉強|べんきょう}させる'), hint: 'する → させる' },
        { q: '{書|か}く → thể mệnh lệnh', answers: V('{書|か}け'), hint: 'う段 → え段' },
        { q: '{走|はし}る → thể mệnh lệnh', answers: V('{走|はし}れ'), hint: 'る → れ (nhóm 1)' },
        { q: '{起|お}きる → thể mệnh lệnh', answers: V('{起|お}きろ'), hint: 'nhóm 2: ろ' },
        { q: 'する → thể mệnh lệnh', answers: ['しろ', 'せよ'], hint: 'nhóm 3' },
        { q: '{来|く}る → thể mệnh lệnh', answers: V('{来|こ}い'), hint: 'こい' },
        { q: '{触|さわ}る → câu cấm (～な)', answers: V('{触|さわ}るな'), hint: 'thể từ điển ＋ な' },
        { q: '{寝|ね}る → ～なさい', answers: V('{寝|ね}なさい'), hint: 'Vます bỏ ます ＋ なさい' },
        { q: '{来|く}る → ～なさい', answers: V('{来|き}なさい'), hint: 'きます → きなさい' },
        { q: '{飲|の}む → sai khiến bị động (dạng rút gọn)', answers: V('{飲|の}まされる', '{飲|の}ませられる'), hint: 'ま ＋ される' },
      ],
    },
    {
      t: 'quiz',
      id: 'b23-np-dien',
      title: 'Điền vào chỗ trống — trợ từ hoặc đuôi đúng (12 câu)',
      kind: 'fill',
      grammar: 'を／に của người làm · ～させてくれる · ～させてください／いただけませんか · mệnh lệnh · ～な · ～なさい · ～ように言う・言われる · ～させられる',
      items: [
        { q: '{母|はは}は{弟|おとうと}（　）{野菜|やさい}を{食|た}べさせました。', answers: ['に'], hint: 'đã có を → người làm đi với…' },
        { q: '{先生|せんせい}は{遅|おく}れてきた{学生|がくせい}（　）{立|た}たせました。', answers: ['を'], hint: 'tự động từ' },
        { q: '{子|こ}どもの{頃|ころ}、よくけがをして{親|おや}（　）{心配|しんぱい}させました。', answers: ['を'], hint: 'động từ cảm xúc' },
        { q: '{父|ちち}は{私|わたし}を{留学|りゅうがく}させて（　）。（cảm ơn bố）', answers: ['くれました', 'くれた'], hint: 'người khác làm cho mình' },
        { q: '{熱|ねつ}があるので、{今日|きょう}は{休|やす}ま（　）ください。', answers: ['せて'], hint: 'xin được nghỉ' },
        { q: '{部長|ぶちょう}、{明日|あした}{早退|そうたい}させて（　）。（lịch sự nhất）', answers: ['いただけませんか', 'いただけないでしょうか'], hint: 'với sếp' },
        { q: '{危|あぶ}ない！{止|と}ま（　）！', answers: ['れ'], hint: 'mệnh lệnh nhóm 1' },
        { q: '{最後|さいご}まで{諦|あきら}める（　）！', answers: ['な'], hint: 'cấm' },
        { q: '（{母|はは}が{子|こ}どもに）{早|はや}く{宿題|しゅくだい}をし（　）。', answers: ['なさい'], hint: 'bố mẹ → con' },
        { q: '{先生|せんせい}は{私|わたし}たちに{遅|おく}れない（　）{言|い}いました。', answers: ['ように'], hint: 'kể lại lời dặn' },
        { q: '{医者|いしゃ}に{甘|あま}いものを{食|た}べないように{言|い}（　）ました。', answers: ['われ'], hint: 'mình được dặn — bị động' },
        { q: '{子|こ}どもの{頃|ころ}、{母|はは}に{毎日|まいにち}{勉強|べんきょう}さ（　）ました。（bị bắt）', answers: ['せられ'], hint: 'sai khiến bị động' },
      ],
    },
    {
      t: 'quiz',
      id: 'b23-np-sua',
      title: 'Sửa câu sai — gõ lại cả câu cho đúng (10 câu)',
      kind: 'translate',
      grammar: 'Mỗi câu có MỘT lỗi: hai を, さ thừa, trợ từ cảm xúc, もらえない, mệnh lệnh nhóm 3, な ↔ なさい, ように, 待つ ↔ 待たせる',
      items: [
        { q: '~~{母|はは}は{弟|おとうと}を{野菜|やさい}を{食|た}べさせました。~~', answers: V('{母|はは}は{弟|おとうと}に{野菜|やさい}を{食|た}べさせました。'), hint: 'hai を → người làm đi với に' },
        { q: '~~{今日|きょう}は{早|はや}く{帰|かえ}らさせてください。~~', answers: V('{今日|きょう}は{早|はや}く{帰|かえ}らせてください。'), hint: 'nhóm 1 không có さ' },
        { q: '~~{明日|あした}、{休|やす}まさせていただけませんか。~~', answers: V('{明日|あした}、{休|やす}ませていただけませんか。'), hint: 'やすま ＋ せて' },
        { q: '~~{両親|りょうしん}に{心配|しんぱい}させました。~~', answers: V('{両親|りょうしん}を{心配|しんぱい}させました。'), hint: 'cảm xúc → を' },
        { q: '~~{子|こ}どもの{頃|ころ}、ゲームをさせてもらいませんでした。~~', answers: V('{子|こ}どもの{頃|ころ}、ゲームをさせてもらえませんでした。'), hint: 'không ĐƯỢC cho → もらえない' },
        { q: '~~みんな、{早|はや}く{来|く}れ！~~', answers: V('みんな、{早|はや}く{来|こ}い！'), hint: '来る → こい' },
        { q: '~~{危|あぶ}ない！それに{触|さわ}りな！~~ (muốn nói: đừng chạm)', answers: V('{危|あぶ}ない！それに{触|さわ}るな！'), hint: 'cấm = thể từ điển ＋ な' },
        { q: '~~{早|はや}く{寝|ね}るなさい。~~', answers: V('{早|はや}く{寝|ね}なさい。'), hint: 'Vます bỏ ます ＋ なさい' },
        { q: '~~{先生|せんせい}に{毎日|まいにち}{復習|ふくしゅう}しますように{言|い}われました。~~', answers: V('{先生|せんせい}に{毎日|まいにち}{復習|ふくしゅう}するように{言|い}われました。'), hint: 'trước ように: thể từ điển' },
        { q: '~~{長|なが}い{時間|じかん}{待|ま}ってすみません。~~ (mình đến muộn, bạn phải chờ)', answers: V('{長|なが}い{時間|じかん}{待|ま}たせてすみません。', '{長|なが}い{時間|じかん}{待|ま}たせてしまってすみません。'), hint: 'làm người khác chờ → 待たせる' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-np-jlpt',
      title: 'Trắc nghiệm dạng đề JLPT N4 — 文法形式の判断 (12 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: '{母|はは}は{妹|いもうと}（　）ピアノを{習|なら}わせています。', options: ['を', 'に', 'が', 'で'], correct: 1, why: 'Đã có **ピアノを** → người phải làm đi với **に**. 〔Haha wa imouto ni piano o narawasete imasu.〕' },
        { q: 'コーチは{選手|せんしゅ}（　）{毎朝|まいあさ}{走|はし}らせます。', options: ['を', 'で', 'が', 'と'], correct: 0, why: '{走|はし}る là tự động từ, câu không có N を khác → người làm đi với **を**. 〔Senshu o hashirasemasu.〕' },
        { q: '{熱|ねつ}があったので、{先生|せんせい}は{私|わたし}を{早|はや}く{帰|かえ}（　）くれました。', options: ['らせて', 'させて', 'られて', 'って'], correct: 0, why: '{帰|かえ}る nhóm 1 → **{帰|かえ}らせる**; + てくれる = thầy CHO tôi về. 〔Hayaku kaerasete kuremashita.〕' },
        { q: 'すみません、この{電話|でんわ}を{使|つか}（　）もらえませんか。', options: ['わせて', 'わさせて', 'われて', 'って'], correct: 0, why: 'Xin cho MÌNH dùng → **{使|つか}わせてもらえませんか**. {使|つか}ってもらえませんか = nhờ NGƯỜI KHÁC dùng (sai nghĩa); わさせて có さ thừa. 〔Tsukawasete moraemasen ka.〕' },
        { q: '{子|こ}どもの{頃|ころ}、{母|はは}は{私|わたし}にテレビを{一日|いちにち}{一時間|いちじかん}しか（　）。', options: ['{見|み}させてくれませんでした', '{見|み}せてくれませんでした', '{見|み}られませんでした', '{見|み}させられました'], correct: 0, why: 'Mẹ chỉ CHO tôi xem 1 tiếng → **{見|み}させてくれなかった**. {見|み}せる = đưa cho xem (từ riêng). 〔Ichijikan shika misasete kuremasen deshita.〕' },
        { q: '{試合|しあい}の{前|まえ}、コーチは「{最後|さいご}まで（　）！」と{言|い}いました。', options: ['{走|はし}れ', '{走|はし}れる', '{走|はし}ろ', '{走|はし}るの'], correct: 0, why: 'Mệnh lệnh nhóm 1: る → **れ** — **{走|はし}れ**. {走|はし}れる là thể khả năng; ろ chỉ cho nhóm 2. 〔Saigo made hashire!〕' },
        { q: '（{火事|かじ}で）「{危|あぶ}ない！{早|はや}く（　）！」', options: ['{逃|に}げろ', '{逃|に}げれ', '{逃|に}げるな', '{逃|に}げられ'], correct: 0, why: '{逃|に}げる nhóm 2 → **{逃|に}げろ**. {逃|に}げるな = đừng chạy (ngược nghĩa). 〔Hayaku nigero!〕' },
        { q: 'ここは{危|あぶ}ないから、{中|なか}に（　）。', options: ['{入|はい}るな', '{入|はい}りな', '{入|はい}れな', '{入|はい}らな'], correct: 0, why: 'Cấm = **thể từ điển + な**: **{入|はい}るな**. {入|はい}りな (cắt từ 入りなさい) = "vào đi" — ngược nghĩa. 〔Naka ni hairu na.〕' },
        { q: '（{母|はは}が{子|こ}どもに）「もう{遅|おそ}いから、{早|はや}く（　）。」', options: ['{寝|ね}なさい', '{寝|ね}るなさい', '{寝|ね}ろなさい', '{寝|ね}てなさい'], correct: 0, why: '**Vます bỏ ます + なさい**: {寝|ね}ます → **{寝|ね}なさい**. 〔Hayaku nenasai.〕' },
        { q: '{先生|せんせい}は{学生|がくせい}に、{教室|きょうしつ}で{物|もの}を{食|た}べない（　）{言|い}いました。', options: ['ように', 'ために', 'ことに', 'そうに'], correct: 0, why: 'Kể lại lời cấm của thầy → **Vない + ように{言|い}う**. 〔Tabenai you ni iimashita.〕' },
        { q: '{私|わたし}は{部長|ぶちょう}に、{資料|しりょう}を{明日|あした}までに{作|つく}るように（　）。', options: ['{言|い}われました', '{言|い}いました', '{言|い}わせました', '{言|い}えました'], correct: 0, why: 'Chủ ngữ {私|わたし}, người dặn {部長|ぶちょう}**に** → bị động **{言|い}われました**. 〔Tsukuru you ni iwaremashita.〕' },
        { q: '{子|こ}どもの{頃|ころ}、{嫌|きら}いなにんじんを{母|はは}に{毎日|まいにち}（　）、とても{嫌|いや}でした。', options: ['{食|た}べさせられて', '{食|た}べさせて', '{食|た}べられて', '{食|た}べさせてもらって'], correct: 0, why: 'Tôi BỊ mẹ bắt ăn, rất ghét → **{食|た}べさせられて** (⑨). 〔Haha ni mainichi tabesaserarete…〕' },
        { q: '★ {母|はは}は ＿＿ ＿＿ ★ ＿＿ ました。（{弟|おとうと}に／{片付|かたづ}け／させ／{部屋|へや}を）', options: ['{弟|おとうと}に', '{片付|かたづ}け', 'させ', '{部屋|へや}を'], correct: 1, why: 'Câu đúng: {母|はは}は **{弟|おとうと}に {部屋|へや}を {片付|かたづ}け させ** ました. Ô ★ (thứ 3) = **{片付|かたづ}け**. 〔Haha wa otouto ni heya o katazukesasemashita.〕' },
        { q: '★ {部長|ぶちょう}、＿＿ ＿＿ ★ ＿＿ か。（いただけません／{休|やす}ませて／{来週|らいしゅう}の／{金曜日|きんようび}）', options: ['いただけません', '{休|やす}ませて', '{来週|らいしゅう}の', '{金曜日|きんようび}'], correct: 1, why: 'Câu đúng: {部長|ぶちょう}、**{来週|らいしゅう}の {金曜日|きんようび} {休|やす}ませて いただけません** か. Ô ★ (thứ 3) = **{休|やす}ませて**. 〔Raishuu no kin\'youbi yasumasete itadakemasen ka.〕' },
        { q: '★ {医者|いしゃ}に ＿＿ ＿＿ ★ ＿＿ ました。（ように／{飲|の}まない／{言|い}われ／お{酒|さけ}を）', options: ['ように', '{飲|の}まない', '{言|い}われ', 'お{酒|さけ}を'], correct: 0, why: 'Câu đúng: {医者|いしゃ}に **お{酒|さけ}を {飲|の}まない ように {言|い}われ** ました. Ô ★ (thứ 3) = **ように**. 〔Isha ni osake o nomanai you ni iwaremashita.〕' },
        { q: '★ {子|こ}どもの{頃|ころ}、＿＿ ＿＿ ★ ＿＿ でした。（{犬|いぬ}を／もらえません／{飼|か}わせて／{親|おや}に）', options: ['{犬|いぬ}を', 'もらえません', '{飼|か}わせて', '{親|おや}に'], correct: 2, why: 'Câu đúng: {子|こ}どもの{頃|ころ}、**{親|おや}に {犬|いぬ}を {飼|か}わせて もらえません** でした. Ô ★ (thứ 3) = **{飼|か}わせて**. 〔Oya ni inu o kawasete moraemasen deshita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b23-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 15 chữ: 頃 幼 供 命 令 許 可 飼 拾 投 逃 片 厳 虫 反',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 15 chữ Hán mới của Bài 23 trong các từ hay gặp khi kể chuyện hồi nhỏ, nói về mệnh lệnh – cho phép và việc của trẻ (子どもの頃・幼い・幼稚園・子供・命令・命令形・命・許す・許可・可能・飼う・拾う・投げる・逃げる・片付ける・片道・厳しい・虫・虫歯・反対・反省…), chọn đúng chữ khi đề cho hiragana, phân biệt chữ trông giống (頃・項, 幼・幻, 供・共, 令・冷・今, 許・話・計, 可・何, 飼・飲, 拾・捨, 投・役, 逃・挑, 片・版, 虫・中, 反・友・返) và viết đúng 6 chữ ✍.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 23 là **15 chữ** đi theo đúng các từ của chủ đề **thời thơ ấu, mệnh lệnh – cho phép, việc của trẻ**: 頃 幼 供 命 令 許 可 飼 拾 投 逃 片 厳 虫 反 — phần lớn là **N3** theo các bảng tham khảo phổ biến ({虫|むし} có bảng xếp N4; {厳|きび}しい・{飼|か}う có bảng xếp N2; JLPT không công bố danh sách chữ chính thức). Cột **Mức**: **✍** = nên tập viết (ít nét, hay dùng: 虫 片 反 可 命 投), **👁** = chỉ cần nhận mặt và đọc đúng. Học **theo từ** ({命令|めいれい} = meirei, {許可|きょか} = kyoka), không cần thuộc âm từng chữ rời. Hai cặp nên học chung: **命 + 令 = {命令|めいれい}** và **許 + 可 = {許可|きょか}** — học một từ là nhớ hai chữ.',
    },
    {
      t: 'table',
      caption: '15 chữ Hán mới của Bài 23',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['頃', 'KHOẢNH', '— (ケイ ngoài bảng)', 'ころ', 'thuở, hồi; khoảng (thời gian)', '{子|こ}どもの{頃|ころ} (hồi nhỏ) · {小|ちい}さい{頃|ころ} · {若|わか}い{頃|ころ} (thời trẻ) · 3{時頃|じごろ} (khoảng 3 giờ) · {日頃|ひごろ} (thường ngày — N2)', '👁 N3'],
        ['幼', 'ẤU', 'ヨウ', 'おさな(い)', 'nhỏ, thơ ấu', '{幼|おさな}い (còn nhỏ) · {幼稚園|ようちえん} (mẫu giáo) · {幼児|ようじ} (trẻ nhỏ — N2)', '👁 N3'],
        ['供', 'CUNG', 'キョウ・ク', 'とも・そな(える)', 'dâng, cung cấp; đi theo', '{子供|こども} (trẻ con = 子ども) · お{供|とも} (người đi theo — N2) · {提供|ていきょう} (cung cấp — N2)', '👁 N3'],
        ['命', 'MỆNH', 'メイ・ミョウ', 'いのち', 'mệnh lệnh; sinh mệnh', '{命令|めいれい} (mệnh lệnh) · {命|いのち} (mạng sống — N3) · {一生懸命|いっしょうけんめい} (hết sức) · {生命|せいめい} (sinh mệnh — N2)', '✍ N3'],
        ['令', 'LỆNH', 'レイ', '—', 'lệnh', '{命令|めいれい} · {命令形|めいれいけい} (thể mệnh lệnh) · {令和|れいわ} (niên hiệu Reiwa)', '👁 N3'],
        ['許', 'HỨA', 'キョ', 'ゆる(す)', 'cho phép, tha thứ', '{許|ゆる}す (tha, cho phép — Bài 19) · {許可|きょか} (sự cho phép) · {免許|めんきょ} (giấy phép lái xe — N3)', '👁 N3'],
        ['可', 'KHẢ', 'カ', '—', 'có thể, được', '{許可|きょか} · {可能|かのう} (có thể — N3) · {可能形|かのうけい} (thể khả năng) · {可能性|かのうせい} (khả năng xảy ra — N3)', '✍ N3'],
        ['飼', 'TỰ', 'シ', 'か(う)', 'nuôi (con vật)', '{飼|か}う (nuôi) · {飼|か}い{主|ぬし} (chủ nuôi — N2)', '👁 N2–N3'],
        ['拾', 'THẬP', 'シュウ・ジュウ', 'ひろ(う)', 'nhặt', '{拾|ひろ}う (nhặt — Bài 19) · ごみ{拾|ひろ}い (nhặt rác)', '👁 N3'],
        ['投', 'ĐẦU', 'トウ', 'な(げる)', 'ném', '{投|な}げる (ném) · {投手|とうしゅ} (cầu thủ ném bóng — N2) · {投票|とうひょう} (bỏ phiếu — N2)', '✍ N3'],
        ['逃', 'ĐÀO', 'トウ', 'に(げる)・に(がす)・のが(す)', 'trốn, chạy trốn', '{逃|に}げる (chạy trốn) · {逃|に}がす (thả ra — N3) · {見逃|みのが}す (bỏ lỡ — N2)', '👁 N3'],
        ['片', 'PHIẾN', 'ヘン', 'かた', 'mảnh; một phía', '{片付|かたづ}ける (dọn dẹp — Bài 16) · {片道|かたみち} (một chiều — N3) · {片手|かたて} (một tay)', '✍ N3'],
        ['厳', 'NGHIÊM', 'ゲン・ゴン', 'きび(しい)・おごそ(か)', 'nghiêm khắc', '{厳|きび}しい (nghiêm khắc) · {厳|きび}しく{育|そだ}てる (nuôi dạy nghiêm) · {厳重|げんじゅう} (nghiêm ngặt — N1)', '👁 N2–N3'],
        ['虫', 'TRÙNG', 'チュウ', 'むし', 'sâu bọ, côn trùng', '{虫|むし} (côn trùng) · {虫歯|むしば} (răng sâu — N3) · {弱虫|よわむし} (đồ nhát gan) · {昆虫|こんちゅう} (côn trùng — N2)', '✍ N3–N4'],
        ['反', 'PHẢN', 'ハン・ホン・タン', 'そ(る)・そ(らす)', 'ngược lại, chống lại', '{反対|はんたい} (phản đối) · {反省|はんせい} (tự kiểm điểm) · {違反|いはん} (vi phạm — N2)', '✍ N3'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**頃** = 匕 (người ngả nghiêng) + 頁 (cái đầu): gốc là "đầu nghiêng", mượn để chỉ **khoảng thời gian**. Mẹo nhìn (không phải gốc): cái đầu nghiêng ngả nhớ lại **thuở** xưa → {子|こ}どもの{頃|ころ}. Sau số giờ đọc **ごろ**.',
        '**幼** = 幺 (sợi tơ mảnh — nhỏ bé) + 力 (sức): sức còn **nhỏ yếu** = ẤU → {幼|おさな}い, {幼稚園|ようちえん}. Khác 幻 (ảo) — không có 力.',
        '**供** = 亻 (người) + 共 (gợi âm キョウ; hai tay cùng nâng): người **dâng** đồ lên = CUNG → {提供|ていきょう}. Trong {子供|こども} chỉ là mượn âm.',
        '**命** = 口 (miệng) + 令 (lệnh): miệng **ban lệnh** = MỆNH; điều trời "ra lệnh" cho mỗi người là **sinh mệnh** (いのち). Học cặp {命令|めいれい}.',
        '**令** = 亼 (mái che) + 卩 (người quỳ): người **quỳ** dưới mái nhà **nghe lệnh** = LỆNH. Thêm 口 → 命; thêm 冫 (băng) → 冷 (lạnh).',
        '**許** = 言 (lời nói) + 午 (gợi âm キョ): lời **đồng ý** = cho phép, tha thứ → {許|ゆる}す, {許可|きょか}.',
        '**可** — một cách giải thích gốc: 口 (miệng) + 丁 (hơi thở bật ra): tiếng "**được!**" thốt ra = KHẢ → {可能|かのう}, {許可|きょか}. Thêm 亻 → 何 (gì).',
        '**飼** = 飠 (ăn) + 司 (gợi âm シ; trông coi): cho **ăn** và **trông coi** con vật = NUÔI → {飼|か}う. Đừng nhầm với {買|か}う (mua) — cùng âm.',
        '**拾** = 扌 (tay) + 合 (hợp lại, gom lại): dùng **tay gom** lên = NHẶT → {拾|ひろ}う. Đối: 捨 (vứt — {捨|す}てる) cũng có 扌.',
        '**投** = 扌 (tay) + 殳 (tay cầm gậy vung): **tay vung** ra = NÉM → {投|な}げる. Cùng 殳 với 役 (役に立つ) — nhưng trái 役 là 彳.',
        '**逃** = 辶 (bước đi) + 兆 (gợi âm; vết nứt toác hai bên): **bỏ đi** tản ra = TRỐN → {逃|に}げる (mình trốn), {逃|に}がす (thả cho chạy).',
        '**片** — tượng hình: **nửa bên phải** khúc gỗ 木 bị bổ đôi = MẢNH, MỘT PHÍA → {片道|かたみち}, {片手|かたて}, {片付|かたづ}ける.',
        '**厳** — chữ cũ 嚴 = 吅 (hai miệng) + 厂 (vách đá) + 敢 (dám). Mẹo nhìn (không phải gốc): dưới **vách đá** dựng đứng, hai cái miệng quát không khoan nhượng = NGHIÊM → {厳|きび}しい. 17 nét — chỉ cần đọc.',
        '**虫** — tượng hình: con **rắn / con sâu** ngóc đầu = TRÙNG. Là bộ thủ của nhiều chữ chỉ côn trùng (蚊 muỗi, 蝶 bướm — N1).',
        '**反** = 厂 (vách) + 又 (bàn tay): bàn tay **lật ngược** = PHẢN → {反対|はんたい}, {反省|はんせい}. Có mặt trong 返 (trả lại — Bài 18), 坂 (dốc), 板 (tấm ván).',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['頃', '{頃|ころ} (～の{頃|ころ})', '— (sau số: ～{頃|ごろ})', '{子|こ}どもの**ころ** — không ~~ごろ~~; 3{時|じ}**ごろ**'],
        ['幼', '{幼|おさな}い', '{幼稚園|ようちえん} (ヨウ)', 'おさ**な**い — không ~~おさあい~~; **よう**ちえん trường âm'],
        ['供', '(お{供|とも})', '{子供|こども} (ども — đặc biệt), {提供|ていきょう} (キョウ)', 'こ**ども** — 供 đọc ども trong từ này'],
        ['命', '{命|いのち}', '{命令|めいれい} (メイ)', '**めい**れい — không ~~めいりょう~~'],
        ['令', '—', '{命令|めいれい} (レイ)', 'めい**れい** — trường âm ei'],
        ['許', '{許|ゆる}す', '{許可|きょか} (キョ)', '**きょ**か — ngắn, không ~~きょうか~~ (強化 = tăng cường)'],
        ['可', '—', '{許可|きょか}, {可能|かのう} (カ)', 'きょ**か** — không ~~きょが~~'],
        ['飼', '{飼|か}う', '(飼育 しいく — N1)', '{飼|か}**って** — thể て nhóm 1 (う → って)'],
        ['拾', '{拾|ひろ}う', '— (N4 chỉ dùng kun)', '{拾|ひろ}**って** — không ~~ひろうて~~'],
        ['投', '{投|な}げる', '{投手|とうしゅ} (トウ)', '{投|な}げる là **nhóm 2** (なげます)'],
        ['逃', '{逃|に}げる, {逃|に}がす', '(逃走 とうそう — N1)', '{逃|に}**げ**る (tự) ↔ {逃|に}**が**す (tha)'],
        ['片', '{片|かた}～', '(破片 はへん — N1)', 'かた**づ**ける — viết **づ**, không ~~かたずける~~'],
        ['厳', '{厳|きび}しい', '(厳重 げんじゅう — N1)', '**きび**しい — không ~~きぴしい~~'],
        ['虫', '{虫|むし}', '{昆虫|こんちゅう} (チュウ)', '{虫歯|むし**ば**} — âm đục'],
        ['反', '—', '{反対|はんたい}, {反省|はんせい} (ハン)', 'はん**せい** — không ~~はんしょう~~; はん**たい** — không ~~はんだい~~'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['頃 (thuở)', '項 (hạng mục — {事項|じこう}, N1)', 'cùng 頁 bên phải; trái 頃 là 匕, trái 項 là 工'],
        ['幼 (thơ ấu)', '幻 (ảo — {幻|まぼろし})', '幼 có 力 bên phải; 幻 không có'],
        ['供 (cung)', '共 (cộng — {共通|きょうつう})', '供 = 亻 + 共'],
        ['令 (lệnh)', '冷 (lạnh — {冷|つめ}たい)・今 (bây giờ)', '冷 = 冫 + 令; 今 dưới là nét gập, không phải 卩'],
        ['許 (cho phép)', '話 (nói)・計 (tính — {時計|とけい})', 'cùng 言 bên trái; phải 許 là 午, 話 là 舌, 計 là 十'],
        ['可 (được)', '何 (gì)・河 (sông)', '何 = 亻 + 可; 河 = 氵 + 可'],
        ['飼 (nuôi)', '飲 (uống)・飯 (cơm — ご{飯|はん})', 'cùng 飠; phải 飼 là 司, 飲 là 欠, 飯 là 反'],
        ['拾 (nhặt)', '捨 (vứt — {捨|す}てる)', 'cùng 扌; phải 拾 là 合, 捨 là 舎 — nghĩa NGƯỢC nhau!'],
        ['投 (ném)', '役 (dịch — {役|やく}に{立|た}つ)', 'cùng 殳; trái 投 là 扌, trái 役 là 彳'],
        ['逃 (trốn)', '挑 (khiêu — {挑戦|ちょうせん}, N2)・桃 (đào — {桃|もも})', 'cùng 兆; 逃 có 辶, 挑 có 扌, 桃 có 木'],
        ['片 (mảnh)', '版 (bản — {出版|しゅっぱん}, N2)', '版 = 片 + 反 (cả hai đều là chữ của bài này!)'],
        ['虫 (côn trùng)', '中 (trong)', '虫 có thêm nét dưới chéo lên (ム-like) — không phải chữ 中'],
        ['反 (ngược)', '友 (bạn)・返 (trả — Bài 18)', '反 = 厂 + 又; 友 = ナ + 又; 返 = 辶 + 反'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b23-doc-kanji',
      title: 'Đọc KHÔNG furigana — 22 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: '{子|こ}どもの{頃|ころ}、よく{川|かわ}で{泳|およ}ぎました。', ro: 'Kodomo no koro, yoku kawa de oyogimashita.', vi: 'Hồi nhỏ tôi hay bơi ở sông.' },
        { text: '{幼|おさな}い{頃|ころ}の{写真|しゃしん}を{見|み}ると、{懐|なつ}かしくなります。', ro: 'Osanai koro no shashin o miru to, natsukashiku narimasu.', vi: 'Nhìn ảnh hồi còn bé là thấy bồi hồi.' },
        { text: '{弟|おとうと}は{毎朝|まいあさ}{幼稚園|ようちえん}に{通|かよ}っています。', ro: 'Otouto wa maiasa youchien ni kayotte imasu.', vi: 'Sáng nào em trai tôi cũng đi mẫu giáo.' },
        { text: 'この{公園|こうえん}では、{子供|こども}たちがたくさん{遊|あそ}んでいます。', ro: 'Kono kouen de wa, kodomotachi ga takusan asonde imasu.', vi: 'Ở công viên này có rất nhiều trẻ em đang chơi.' },
        { text: '{社長|しゃちょう}の{命令|めいれい}で、{大阪|おおさか}に{行|い}くことになりました。', ro: 'Shachou no meirei de, Oosaka ni iku koto ni narimashita.', vi: 'Theo lệnh của giám đốc, tôi sẽ đi Osaka.' },
        { text: '「{走|はし}れ」は「{走|はし}る」の{命令形|めいれいけい}です。', ro: '"Hashire" wa "hashiru" no meireikei desu.', vi: '"Hashire" là thể mệnh lệnh của "hashiru".' },
        { text: '{命|いのち}は{一|ひと}つしかありません。{大切|たいせつ}にしてください。', ro: 'Inochi wa hitotsu shika arimasen. Taisetsu ni shite kudasai.', vi: 'Mạng sống chỉ có một. Hãy trân trọng nó.' },
        { text: '{母|はは}は{私|わたし}の{一人旅|ひとりたび}を{許|ゆる}してくれませんでした。', ro: 'Haha wa watashi no hitoritabi o yurushite kuremasen deshita.', vi: 'Mẹ đã không cho phép tôi đi du lịch một mình.' },
        { text: 'この{部屋|へや}を{使|つか}うには、{先生|せんせい}の{許可|きょか}が{必要|ひつよう}です。', ro: 'Kono heya o tsukau ni wa, sensei no kyoka ga hitsuyou desu.', vi: 'Muốn dùng phòng này cần sự cho phép của thầy.' },
        { text: '{明日|あした}{雨|あめ}が{降|ふ}る{可能性|かのうせい}は{低|ひく}いです。', ro: 'Ashita ame ga furu kanousei wa hikui desu.', vi: 'Khả năng ngày mai mưa là thấp.' },
        { text: '{子|こ}どもの{頃|ころ}、ずっと{犬|いぬ}を{飼|か}いたかったです。', ro: 'Kodomo no koro, zutto inu o kaitakatta desu.', vi: 'Hồi nhỏ tôi luôn muốn nuôi chó.' },
        { text: '{道|みち}で{財布|さいふ}を{拾|ひろ}って、{交番|こうばん}に{届|とど}けました。', ro: 'Michi de saifu o hirotte, kouban ni todokemashita.', vi: 'Tôi nhặt được cái ví ngoài đường và mang nộp đồn cảnh sát.' },
        { text: '{公園|こうえん}で{石|いし}を{投|な}げてはいけません。', ro: 'Kouen de ishi o nagete wa ikemasen.', vi: 'Không được ném đá ở công viên.' },
        { text: '{地震|じしん}のときは、{安全|あんぜん}な{場所|ばしょ}へ{逃|に}げてください。', ro: 'Jishin no toki wa, anzen na basho e nigete kudasai.', vi: 'Khi động đất hãy chạy đến nơi an toàn.' },
        { text: '{捕|つか}まえた{虫|むし}は、{森|もり}に{逃|に}がしてあげました。', ro: 'Tsukamaeta mushi wa, mori ni nigashite agemashita.', vi: 'Con côn trùng bắt được, tôi đã thả về rừng.' },
        { text: '{遊|あそ}んだあとは、おもちゃを{片付|かたづ}けなさい。', ro: 'Asonda ato wa, omocha o katazukenasai.', vi: 'Chơi xong thì dọn đồ chơi đi.' },
        { text: '{東京|とうきょう}まで{片道|かたみち}いくらですか。', ro: 'Toukyou made katamichi ikura desu ka.', vi: 'Đi Tokyo một chiều bao nhiêu tiền?' },
        { text: '{父|ちち}はとても{厳|きび}しい{人|ひと}でした。', ro: 'Chichi wa totemo kibishii hito deshita.', vi: 'Bố tôi là người rất nghiêm khắc.' },
        { text: '{夏|なつ}の{夜|よる}は{虫|むし}がたくさん{出|で}ます。', ro: 'Natsu no yoru wa mushi ga takusan demasu.', vi: 'Đêm mùa hè có rất nhiều côn trùng.' },
        { text: '{甘|あま}いものを{食|た}べすぎて、{虫歯|むしば}になりました。', ro: 'Amai mono o tabesugite, mushiba ni narimashita.', vi: 'Ăn đồ ngọt nhiều quá nên bị sâu răng.' },
        { text: '{父|ちち}は{私|わたし}の{留学|りゅうがく}に{反対|はんたい}しました。', ro: 'Chichi wa watashi no ryuugaku ni hantai shimashita.', vi: 'Bố đã phản đối việc tôi đi du học.' },
        { text: '{悪|わる}いことをしたら、ちゃんと{反省|はんせい}しなさい。', ro: 'Warui koto o shitara, chanto hansei shinasai.', vi: 'Làm điều sai thì phải tự kiểm điểm cho đàng hoàng.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b23-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 40 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{私|わたし}は{幼|おさな}い{頃|ころ}、{田舎|いなか}で{育|そだ}ちました。{夏|なつ}は{毎日|まいにち}{兄|あに}と{山|やま}へ{虫|むし}を{取|と}りに{行|い}きました。{捕|つか}まえた{虫|むし}を{家|いえ}で{飼|か}いたかったのですが、{母|はは}に「{逃|に}がしてあげなさい」と{言|い}われて、いつも{森|もり}に{返|かえ}しました。', ro: 'Watashi wa osanai koro, inaka de sodachimashita. Natsu wa mainichi ani to yama e mushi o tori ni ikimashita. Tsukamaeta mushi o ie de kaitakatta no desu ga, haha ni "Nigashite agenasai" to iwarete, itsumo mori ni kaeshimashita.', vi: 'Hồi còn bé tôi lớn lên ở quê. Mùa hè ngày nào tôi cũng cùng anh lên núi bắt côn trùng. Tôi muốn nuôi chúng ở nhà nhưng bị mẹ bảo "Thả chúng đi", nên lần nào tôi cũng trả chúng về rừng.' },
        { text: '{父|ちち}は{厳|きび}しい{人|ひと}で、{私|わたし}が{悪|わる}いことをすると、{必|かなら}ず{反省|はんせい}させました。でも、{私|わたし}が{留学|りゅうがく}したいと{言|い}ったとき、{母|はは}は{反対|はんたい}しましたが、{父|ちち}は「{自分|じぶん}で{決|き}めなさい」と{言|い}って、{許|ゆる}してくれました。', ro: 'Chichi wa kibishii hito de, watashi ga warui koto o suru to, kanarazu hansei sasemashita. Demo, watashi ga ryuugaku shitai to itta toki, haha wa hantai shimashita ga, chichi wa "Jibun de kiminasai" to itte, yurushite kuremashita.', vi: 'Bố tôi là người nghiêm khắc, hễ tôi làm điều sai là nhất định bắt tôi tự kiểm điểm. Nhưng khi tôi nói muốn đi du học, mẹ phản đối, còn bố nói "Con tự quyết đi" và đã cho phép tôi.' },
        { text: 'このアパートでは、{犬|いぬ}や{猫|ねこ}を{飼|か}うには{大家|おおや}さんの{許可|きょか}が{必要|ひつよう}です。ごみは{朝|あさ}{八時|はちじ}までに{出|だ}して、{道|みち}に{落|お}ちているごみは{拾|ひろ}うように{言|い}われています。{大家|おおや}さんは{子供|こども}たちにも、{駐車場|ちゅうしゃじょう}でボールを{投|な}げないように{注意|ちゅうい}しています。', ro: 'Kono apaato de wa, inu ya neko o kau ni wa ooya-san no kyoka ga hitsuyou desu. Gomi wa asa hachiji made ni dashite, michi ni ochite iru gomi wa hirou you ni iwarete imasu. Ooya-san wa kodomotachi ni mo, chuushajou de booru o nagenai you ni chuui shite imasu.', vi: 'Ở căn hộ này, muốn nuôi chó hay mèo cần sự cho phép của chủ nhà. Chúng tôi được dặn đổ rác trước 8 giờ sáng và nhặt rác rơi ngoài đường. Chủ nhà cũng nhắc bọn trẻ đừng ném bóng ở bãi đỗ xe.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (13 câu)',
      items: [
        { q: '**子どもの頃**、よく{泳|およ}ぎました。', options: ['こどものごろ', 'こどものころ', 'こどものとき', 'こどものじき'], correct: 1, why: '**{子|こ}どもの{頃|ころ}** (kodomo no koro) — sau danh từ + の đọc **ころ**; ごろ chỉ sau số.' },
        { q: '**幼い**{頃|ころ}の{写真|しゃしん}です。', options: ['ようい', 'おさない', 'おさいない', 'よわい'], correct: 1, why: '**{幼|おさな}い** (osanai).' },
        { q: '**命令**{形|けい}を{覚|おぼ}えましょう。', options: ['めいれい', 'めいりょう', 'いのちれい', 'めいれ'], correct: 0, why: '**{命令|めいれい}** (meirei) — trường âm ei ở cả hai chữ.' },
        { q: '{先生|せんせい}の**許可**をもらいました。', options: ['きょうか', 'きょか', 'ゆるか', 'ぎょか'], correct: 1, why: '**{許可|きょか}** (kyoka) — きょ ngắn. きょうか là 強化 (tăng cường).' },
        { q: '{犬|いぬ}を**飼**っています。', options: ['か', 'し', 'かい', 'つか'], correct: 0, why: '**{飼|か}って** (katte) — 飼 đọc か, đuôi って là kana.' },
        { q: '{財布|さいふ}を**拾**いました。', options: ['すて', 'ひろ', 'しゅう', 'ひらい'], correct: 1, why: '**{拾|ひろ}いました** (hiroimashita). すて là của 捨 (vứt) — nghĩa ngược!' },
        { q: 'ボールを**投**げました。', options: ['な', 'とう', 'あ', 'ほう'], correct: 0, why: '**{投|な}げました** (nagemashita).' },
        { q: '{猫|ねこ}が**逃**げました。', options: ['に', 'と', 'のが', 'にが'], correct: 0, why: '**{逃|に}げました** (nigemashita). にが là của 逃がす (thả ra).' },
        { q: '{部屋|へや}を**片付**けました。', options: ['かたづ', 'へんつ', 'かたつ', 'かたず'], correct: 0, why: '**{片付|かたづ}けました** (katazukemashita) — viết **づ**.' },
        { q: '{父|ちち}は**厳**しい{人|ひと}でした。', options: ['きび', 'げん', 'きぶ', 'かな'], correct: 0, why: '**{厳|きび}しい** (kibishii).' },
        { q: '**虫**が{苦手|にがて}です。', options: ['ちゅう', 'むし', 'もし', 'むす'], correct: 1, why: '**{虫|むし}** (mushi) — đứng riêng đọc kun.' },
        { q: '{留学|りゅうがく}に**反対**しました。', options: ['はんたい', 'はんだい', 'ほんたい', 'はんつい'], correct: 0, why: '**{反対|はんたい}** (hantai) — たい không đục.' },
        { q: 'よく**反省**しなさい。', options: ['はんしょう', 'はんせい', 'へんせい', 'はんぜい'], correct: 1, why: '**{反省|はんせい}** (hansei) — 省 đọc せい trong từ này (しょう trong {省|しょう}: bộ — N2).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (10 câu)',
      items: [
        { q: '**こども**のころ、よく{遊|あそ}びました。', options: ['子供', '子共', '字供', '子洪'], correct: 0, why: '**子供** — 供 = 亻 + 共. (Khoá này hay viết 子ども — cùng một từ.)' },
        { q: '{弟|おとうと}は**ようちえん**に{通|かよ}っています。', options: ['幻稚園', '幼稚園', '幼椎園', '幼稚円'], correct: 1, why: '**幼稚園** — 幼 có 力; 幻 (ảo) không có.' },
        { q: '{社長|しゃちょう}の**めいれい**です。', options: ['命冷', '令命', '命令', '命鈴'], correct: 2, why: '**命令** — 命 trước, 令 sau. 冷 (lạnh) có 冫.' },
        { q: '{先生|せんせい}の**きょか**をもらいました。', options: ['許可', '計可', '話可', '許何'], correct: 0, why: '**許可** — 許 = 言 + 午; 可 không có 亻 (có 亻 là 何).' },
        { q: '{犬|いぬ}を**かって**います。(nuôi)', options: ['買って', '飼って', '飯って', '飲って'], correct: 1, why: '**飼う** = nuôi (飠 + 司). 買う = mua — cùng âm, khác nghĩa.' },
        { q: 'ごみを**ひろって**ください。', options: ['捨って', '拾って', '招って', '持って'], correct: 1, why: '**拾う** (nhặt) — 扌 + 合. 捨 (vứt) là bẫy nghĩa ngược.' },
        { q: 'ボールを**なげて**ください。', options: ['役げて', '投げて', '技げて', '設げて'], correct: 1, why: '**投げる** — 扌 + 殳. 役 trái là 彳.' },
        { q: '{早|はや}く**にげて**！', options: ['挑げて', '逃げて', '桃げて', '跳げて'], correct: 1, why: '**逃げる** — 辶 + 兆. 挑 có 扌, 桃 có 木.' },
        { q: '**かたみち**の{切符|きっぷ}をください。', options: ['片道', '方道', '版道', '片導'], correct: 0, why: '**片道** (một chiều) — 片 = mảnh, một phía.' },
        { q: '{父|ちち}は**はんたい**しました。', options: ['友対', '反対', '返対', '反待'], correct: 1, why: '**反対** — 反 = 厂 + 又. 友 (bạn) = ナ + 又; 返 có 辶.' },
      ],
    },
    {
      t: 'write',
      id: 'b23-viet-kanji',
      title: 'Tập viết — 6 chữ ✍ và 8 từ',
      note: 'Viết 6 chữ ✍ trước (đúng thứ tự nét theo hoạt hình — chú ý 虫 và 反), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['虫', '片', '反', '可', '命', '投', '子供', '命令', '許可', '飼う', '拾う', '逃げる', '厳しい', '反対'],
      goi: {
        '子供': 'こども · trẻ con',
        '命令': 'めいれい · mệnh lệnh',
        '許可': 'きょか · sự cho phép',
        '飼う': 'かう · nuôi (con vật)',
        '拾う': 'ひろう · nhặt',
        '逃げる': 'にげる · chạy trốn',
        '厳しい': 'きびしい · nghiêm khắc',
        '反対': 'はんたい · phản đối',
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
  id: 'b23-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N4 — 6 bài theo đủ 4 dạng đề: 課題理解 · ポイント理解 · 発話表現 · 即時応答',
  goal: 'Nghe trưởng phòng giao việc và cô giáo mẫu giáo dặn phụ huynh để biết việc phải làm TRƯỚC / thứ phải cho con mang theo (～ように言う, ～させてください, ～ておく); nghe để bắt đúng lý do một người mẹ bắt con học bơi (～させた・～させられた) và lời dặn của thầy về bài văn (～ように言っていた); chọn câu nói đúng khi xin về sớm, xin làm giúp, khi nguy hiểm, khi để khách chờ; đáp nhanh câu có ～させてください, ～させられる, ～ように言う, mệnh lệnh và cấm.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N4 — 4 dạng, 35 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó phải làm **trước / tiếp theo**, hoặc thứ phải mang.', 'Việc **đã xong** (もう～ておきました, ～てあります) và việc **để sau / người khác làm** (～てからでいい, ～にさせてもいい) → loại. Câu chốt có **まず／じゃ、先に**.'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó.', 'Lý do bị **phủ định** (**そうじゃないんだ**, **それが理由じゃない**) là bẫy. Lời dặn được kể lại bằng **～ように{言|い}っていた／{言|い}われた**.'],
        ['問題3', '発話表現 (nói gì trong tình huống)', 'Nghe mô tả tình huống, chọn câu nên nói.', 'Mình xin được làm → **～させて（ください／いただけませんか）**; nhờ người khác làm → **～て（ください）**; để người khác chờ → **お{待|ま}たせしました**.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', 'Phân biệt **させた** (mình bắt người khác) ↔ **させられた** (mình bị bắt) ↔ **させてくれた** (được cho). Câu đáp chỉ lặp lại động từ của câu hỏi thường là bẫy.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        '**させる ↔ させられる ↔ される** nghe gần nhau ở tốc độ thật: **させ・る** (bắt / cho) — **させ・られ・る** (bị bắt) — **さ・れ・る** (bị động / bị bắt rút gọn). Mẹo: nghe **người đi với に** — nếu đó là bố mẹ / thầy và người nói là chủ ngữ, câu gần như chắc là "bị bắt".',
        '**～させてください** (xin cho MÌNH làm) ↔ **～てください** (bảo NGƯỜI NGHE làm): {帰|かえ}**らせて**ください ≠ {帰|かえ}**って**ください. Nghe kỹ có **せ** hay không.',
        '**Thể mệnh lệnh** trong bài nghe N4 hầu như chỉ xuất hiện trong câu **trích lời** (「{走|はし}れ」と{言|い}われた), lúc **nguy hiểm** hoặc **biển báo**. Thấy {止|と}まれ／{逃|に}げろ／{触|さわ}るな → hiểu ngay là lệnh.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: chuẩn bị cuộc họp' },
    NG('b23-ng-1', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — bản thảo tài liệu anh 西川 còn đang sửa (photo để sau, có thể giao cho bạn làm thêm); việc nhắn lễ tân đã làm xong sáng nay. Chờ câu "じゃ、先に…".', [
      ['ナレーター', 'ja-nu', '{会社|かいしゃ}で、{部長|ぶちょう}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Kaisha de, buchou to onna no hito ga hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Ở công ty, trưởng phòng và một người phụ nữ đang nói chuyện. Sau đây người phụ nữ trước tiên sẽ làm gì?'],
      ['{部長|ぶちょう}', 'ja-nam', '{山口|やまぐち}さん、{明日|あした}の{会議|かいぎ}のことなんだけど、ちょっといいかな。', 'Yamaguchi-san, ashita no kaigi no koto na n da kedo, chotto ii ka na.', 'Chị Yamaguchi, về cuộc họp ngày mai, chị rảnh chút không?'],
      ['{山口|やまぐち}', 'ja-nu', 'はい、{部長|ぶちょう}。', 'Hai, buchou.', 'Vâng, thưa trưởng phòng.'],
      ['{部長|ぶちょう}', 'ja-nam', '{会議|かいぎ}の{資料|しりょう}を10{部|ぶ}コピーしておいてくれる？それから、{会議室|かいぎしつ}のプロジェクターも、{一度|いちど}つけてみてほしいんだ。{先週|せんしゅう}、{調子|ちょうし}が{悪|わる}かったから。', 'Kaigi no shiryou o juubu kopii shite oite kureru? Sorekara, kaigishitsu no purojekutaa mo, ichido tsukete mite hoshii n da. Senshuu, choushi ga warukatta kara.', 'Chị photo sẵn 10 bản tài liệu họp giúp tôi nhé? Rồi máy chiếu ở phòng họp, tôi muốn chị bật thử một lần. Tuần trước nó trục trặc.'],
      ['{山口|やまぐち}', 'ja-nu', 'わかりました。ただ、{資料|しりょう}は{西川|にしかわ}さんがまだ{直|なお}しているので、コピーは{西川|にしかわ}さんが{終|お}わってからになります。', 'Wakarimashita. Tada, shiryou wa Nishikawa-san ga mada naoshite iru node, kopii wa Nishikawa-san ga owatte kara ni narimasu.', 'Tôi hiểu rồi. Có điều tài liệu anh Nishikawa vẫn đang sửa, nên photo phải đợi anh ấy xong đã.'],
      ['{部長|ぶちょう}', 'ja-nam', 'そうか。コピーは{新|あたら}しいアルバイトの{人|ひと}にさせてもいいよ。それから、お{客|きゃく}さんにお{茶|ちゃ}を{出|だ}すように、{受付|うけつけ}に{伝|つた}えておいてくれる？', 'Sou ka. Kopii wa atarashii arubaito no hito ni sasete mo ii yo. Sorekara, okyaku-san ni ocha o dasu you ni, uketsuke ni tsutaete oite kureru?', 'Vậy à. Photo thì có thể để bạn làm thêm mới làm cũng được. Còn nữa, chị nhắn trước lễ tân là mời khách uống trà nhé?'],
      ['{山口|やまぐち}', 'ja-nu', 'お{茶|ちゃ}のことは、{今朝|けさ}もう{受付|うけつけ}に{伝|つた}えておきました。', 'Ocha no koto wa, kesa mou uketsuke ni tsutaete okimashita.', 'Chuyện trà thì sáng nay tôi đã nhắn lễ tân rồi ạ.'],
      ['{部長|ぶちょう}', 'ja-nam', 'さすがだね。じゃ、{先|さき}にプロジェクターを{見|み}ておいて。', 'Sasuga da ne. Ja, saki ni purojekutaa o mite oite.', 'Giỏi quá. Vậy chị xem máy chiếu trước nhé.'],
      ['{山口|やまぐち}', 'ja-nu', 'はい。じゃ、{今|いま}からすぐ{会議室|かいぎしつ}に{行|い}ってきます。', 'Hai. Ja, ima kara sugu kaigishitsu ni itte kimasu.', 'Vâng. Vậy tôi lên phòng họp ngay bây giờ.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b23-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{資料|しりょう}を10{部|ぶ}コピーする', '{会議室|かいぎしつ}のプロジェクターをつけてみる', '{受付|うけつけ}にお{茶|ちゃ}のことを{伝|つた}える', '{西川|にしかわ}さんに{資料|しりょう}を{直|なお}すように{言|い}う'], correct: 1, why: 'Photo → phải đợi anh 西川 sửa xong, và có thể **アルバイトの{人|ひと}にさせてもいい** (bẫy ①); nhắn lễ tân → **{今朝|けさ}もう{伝|つた}えておきました** (đã xong — bẫy ②); 西川 vẫn đang tự sửa (bẫy ③). Câu chốt: **じゃ、{先|さき}にプロジェクターを{見|み}ておいて**. 〔Saki ni purojekutaa o mite oite.〕' },
        { q: '{部長|ぶちょう}はコピーについて{何|なに}と{言|い}いましたか。', options: ['{山口|やまぐち}さんが{今|いま}すぐするように{言|い}った', 'アルバイトの{人|ひと}にさせてもいいと{言|い}った', '{西川|にしかわ}さんにさせるように{言|い}った', 'コピーはしなくてもいいと{言|い}った'], correct: 1, why: '**コピーは{新|あたら}しいアルバイトの{人|ひと}にさせてもいいよ** — sai khiến (cho người dưới làm) + ～てもいい. 〔Arubaito no hito ni sasete mo ii yo.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: chuẩn bị đi dã ngoại ở trường mẫu giáo' },
    NG('b23-ng-2', 'お{父|とう}さんは{明日|あした}、{子|こ}どもに{何|なに}を{持|も}たせますか', 'Dạng 課題理解 — nghe cô dặn "～を持たせてください／持たせないでください"; khăn trường lo; mũ là ĐỘI đi, không phải mang theo; không mang ô mà mang áo mưa.', [
      ['ナレーター', 'ja-nu', '{幼稚園|ようちえん}で、{先生|せんせい}とお{父|とう}さんが{話|はな}しています。お{父|とう}さんは{明日|あした}、{子|こ}どもに{何|なに}を{持|も}たせますか。', 'Youchien de, sensei to otousan ga hanashite imasu. Otousan wa ashita, kodomo ni nani o motasemasu ka.', 'Ở trường mẫu giáo, cô giáo và một ông bố đang nói chuyện. Ngày mai ông bố sẽ cho con mang theo những gì?'],
      ['{先生|せんせい}', 'ja-nu', 'ゆうとくんのお{父|とう}さん、{明日|あした}の{遠足|えんそく}のことなんですが……。', 'Yuuto-kun no otousan, ashita no ensoku no koto na n desu ga…….', 'Bố của Yuuto ơi, về chuyến dã ngoại ngày mai ạ…'],
      ['お{父|とう}さん', 'ja-nam', 'はい。{何|なに}を{持|も}っていけばいいですか。', 'Hai. Nani o motte ikeba ii desu ka.', 'Vâng. Cháu nên mang theo gì ạ?'],
      ['{先生|せんせい}', 'ja-nu', 'お{弁当|べんとう}と{水筒|すいとう}を{持|も}たせてください。お{菓子|かし}は{持|も}たせないでくださいね。{子|こ}どもたちがけんかしますから。', 'Obentou to suitou o motasete kudasai. Okashi wa motasenaide kudasai ne. Kodomotachi ga kenka shimasu kara.', 'Anh cho cháu mang cơm hộp và bình nước nhé. Bánh kẹo thì đừng cho mang ạ. Bọn trẻ sẽ tranh nhau.'],
      ['お{父|とう}さん', 'ja-nam', 'お{菓子|かし}はだめなんですね。タオルはどうですか。', 'Okashi wa dame na n desu ne. Taoru wa dou desu ka.', 'Bánh kẹo không được nhỉ. Còn khăn thì sao?'],
      ['{先生|せんせい}', 'ja-nu', 'タオルは{幼稚園|ようちえん}で{用意|ようい}しますから、{大丈夫|だいじょうぶ}です。それから、{雨|あめ}が{降|ふ}るかもしれないので、{傘|かさ}ではなくて、レインコートを{持|も}たせてください。', 'Taoru wa youchien de youi shimasu kara, daijoubu desu. Sorekara, ame ga furu kamoshirenai node, kasa de wa nakute, reinkooto o motasete kudasai.', 'Khăn thì trường chuẩn bị nên không cần ạ. Rồi có thể trời mưa, nên anh cho cháu mang áo mưa chứ đừng mang ô nhé.'],
      ['お{父|とう}さん', 'ja-nam', '{傘|かさ}じゃなくて、レインコートですね。', 'Kasa ja nakute, reinkooto desu ne.', 'Không phải ô mà là áo mưa nhỉ.'],
      ['{先生|せんせい}', 'ja-nu', 'はい。{帽子|ぼうし}は、{朝|あさ}、かぶらせてきてください。', 'Hai. Boushi wa, asa, kaburasete kite kudasai.', 'Vâng. Mũ thì buổi sáng anh cho cháu đội đến luôn ạ.'],
      ['お{父|とう}さん', 'ja-nam', 'わかりました。{今夜|こんや}、{準備|じゅんび}しておきます。', 'Wakarimashita. Kon\'ya, junbi shite okimasu.', 'Tôi hiểu rồi. Tối nay tôi sẽ chuẩn bị sẵn.'],
      ['ナレーター', 'ja-nu', 'お{父|とう}さんは{明日|あした}、{子|こ}どもに{何|なに}を{持|も}たせますか。', 'Otousan wa ashita, kodomo ni nani o motasemasu ka.', 'Ngày mai ông bố sẽ cho con mang theo những gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b23-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: 'お{父|とう}さんは{明日|あした}、{子|こ}どもに{何|なに}を{持|も}たせますか。', options: ['お{弁当|べんとう}・{水筒|すいとう}・レインコート', 'お{弁当|べんとう}・{水筒|すいとう}・お{菓子|かし}・{傘|かさ}', 'お{弁当|べんとう}・タオル・レインコート', 'お{弁当|べんとう}・{水筒|すいとう}・タオル・{帽子|ぼうし}'], correct: 0, why: 'Bánh kẹo → **{持|も}たせないでください** (bẫy ①); ô → **{傘|かさ}ではなくて、レインコート** (bẫy ②); khăn → **{幼稚園|ようちえん}で{用意|ようい}します** (bẫy ③); mũ → **かぶらせてきて** = đội đi, không phải mang theo (bẫy ④). 〔Obentou to suitou o motasete kudasai.〕' },
        { q: '{先生|せんせい}はどうしてお{菓子|かし}を{持|も}たせないように{言|い}いましたか。', options: ['{体|からだ}に{悪|わる}いから', '{子|こ}どもたちがけんかするから', 'お{弁当|べんとう}が{食|た}べられなくなるから', '{雨|あめ}が{降|ふ}るから'], correct: 1, why: '**{子|こ}どもたちがけんかしますから** — lý do nói ngay sau lời cấm. 〔Kodomotachi ga kenka shimasu kara.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: vì sao mẹ bắt anh ấy học bơi?' },
    NG('b23-ng-3', 'お{母|かあ}さんはどうして{男|おとこ}の{人|ひと}に{水泳|すいえい}を{習|なら}わせましたか', 'Dạng ポイント理解 — nghe câu hỏi trước. Hai lý do bị phủ định (muốn thành vận động viên, vì cơ thể yếu); lý do thật nằm sau "実は".', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。お{母|かあ}さんはどうして{男|おとこ}の{人|ひと}に{水泳|すいえい}を{習|なら}わせましたか。', 'Onna no hito to otoko no hito ga hanashite imasu. Okaasan wa doushite otoko no hito ni suiei o narawasemashita ka.', 'Một người phụ nữ và một người đàn ông đang nói chuyện. Vì sao mẹ của người đàn ông cho anh học bơi?'],
      ['アンナ', 'ja-nu', 'マルコさん、{泳|およ}ぐのがすごく{上手|じょうず}だね。', 'Maruko-san, oyogu no ga sugoku jouzu da ne.', 'Marco, cậu bơi giỏi thật đấy.'],
      ['マルコ', 'ja-nam', 'ありがとう。{子|こ}どもの{頃|ころ}、{母|はは}に{毎日|まいにち}プールに{行|い}かされたんだ。', 'Arigatou. Kodomo no koro, haha ni mainichi puuru ni ikasareta n da.', 'Cảm ơn. Hồi nhỏ ngày nào mình cũng bị mẹ bắt đi bể bơi.'],
      ['アンナ', 'ja-nu', '{毎日|まいにち}？お{母|かあ}さんはマルコさんを{水泳|すいえい}の{選手|せんしゅ}にしたかったの？', 'Mainichi? Okaasan wa Maruko-san o suiei no senshu ni shitakatta no?', 'Ngày nào cũng thế á? Mẹ cậu muốn cậu thành vận động viên bơi à?'],
      ['マルコ', 'ja-nam', 'ううん、そうじゃないんだ。{選手|せんしゅ}になるのは{無理|むり}だって、{母|はは}もわかっていたよ。', 'Uun, sou ja nai n da. Senshu ni naru no wa muri da tte, haha mo wakatte ita yo.', 'Không, không phải vậy. Mẹ mình cũng biết là mình không thể thành vận động viên.'],
      ['アンナ', 'ja-nu', 'じゃ、{体|からだ}が{弱|よわ}かったから？', 'Ja, karada ga yowakatta kara?', 'Vậy là vì cậu yếu người à?'],
      ['マルコ', 'ja-nam', 'それもよく{聞|き}かれるけど、{僕|ぼく}は{子|こ}どもの{頃|ころ}から{丈夫|じょうぶ}だったよ。{実|じつ}は、うちは{海|うみ}のすぐ{近|ちか}くにあったんだ。{母|はは}は、{海|うみ}で{事故|じこ}にあわないように、{早|はや}く{泳|およ}げるようにさせたかったんだって。', 'Sore mo yoku kikareru kedo, boku wa kodomo no koro kara joubu datta yo. Jitsu wa, uchi wa umi no sugu chikaku ni atta n da. Haha wa, umi de jiko ni awanai you ni, hayaku oyogeru you ni sasetakatta n datte.', 'Câu đó cũng hay bị hỏi lắm, nhưng mình khoẻ từ bé. Chuyện là nhà mình ở ngay sát biển. Mẹ bảo là muốn cho mình sớm bơi được để khỏi gặp tai nạn dưới biển.'],
      ['アンナ', 'ja-nu', 'なるほど。{優|やさ}しいお{母|かあ}さんだね。', 'Naruhodo. Yasashii okaasan da ne.', 'Ra vậy. Mẹ cậu chu đáo thật.'],
      ['マルコ', 'ja-nam', 'そのときは{嫌|いや}だったけど、{今|いま}は{感謝|かんしゃ}しているよ。', 'Sono toki wa iya datta kedo, ima wa kansha shite iru yo.', 'Hồi đó thì ghét lắm, nhưng giờ mình biết ơn mẹ.'],
      ['ナレーター', 'ja-nu', 'お{母|かあ}さんはどうして{男|おとこ}の{人|ひと}に{水泳|すいえい}を{習|なら}わせましたか。', 'Okaasan wa doushite otoko no hito ni suiei o narawasemashita ka.', 'Vì sao mẹ của người đàn ông cho anh học bơi?'],
    ]),
    {
      t: 'mcq',
      id: 'b23-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: 'お{母|かあ}さんはどうして{男|おとこ}の{人|ひと}に{水泳|すいえい}を{習|なら}わせましたか。', options: ['{水泳|すいえい}の{選手|せんしゅ}にしたかったから', '{体|からだ}が{弱|よわ}かったから', '{海|うみ}で{事故|じこ}にあわないように', 'お{母|かあ}さんが{水泳|すいえい}の{先生|せんせい}だったから'], correct: 2, why: 'Vận động viên → **そうじゃないんだ** (bẫy ①); yếu người → **{丈夫|じょうぶ}だった** (bẫy ②). Sau **{実|じつ}は**: **{海|うみ}で{事故|じこ}にあわないように、{早|はや}く{泳|およ}げるようにさせたかった**. 〔Umi de jiko ni awanai you ni.〕' },
        { q: '{男|おとこ}の{人|ひと}は{子|こ}どもの{頃|ころ}、{水泳|すいえい}についてどう{思|おも}っていましたか。', options: ['とても{楽|たの}しかった', '{嫌|いや}だった', '{選手|せんしゅ}になりたかった', '{何|なに}も{思|おも}わなかった'], correct: 1, why: '**そのときは{嫌|いや}だったけど、{今|いま}は{感謝|かんしゃ}している** — hồi đó ghét (khớp với {行|い}かされた = bị bắt đi). 〔Sono toki wa iya datta.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題2 ポイント理解: thầy dặn gì về bài văn?' },
    NG('b23-ng-4', '{先生|せんせい}は{作文|さくぶん}をどうするように{言|い}いましたか', 'Dạng ポイント理解 — một bạn thuật lại lời thầy bằng "～ように言っていた". Nghe kỹ phần phủ định "～ないように" và con số.', [
      ['ナレーター', 'ja-nu', '{学校|がっこう}で、{男|おとこ}の{学生|がくせい}と{女|おんな}の{学生|がくせい}が{話|はな}しています。{先生|せんせい}は{作文|さくぶん}をどうするように{言|い}いましたか。', 'Gakkou de, otoko no gakusei to onna no gakusei ga hanashite imasu. Sensei wa sakubun o dou suru you ni iimashita ka.', 'Ở trường, một nam sinh và một nữ sinh đang nói chuyện. Thầy đã dặn làm bài văn thế nào?'],
      ['ワン', 'ja-nu', 'ダニエルさん、{昨日|きのう}{休|やす}んじゃったんだけど、{本田先生|ほんだせんせい}、{作文|さくぶん}のこと{何|なに}か{言|い}ってた？', 'Danieru-san, kinou yasunjatta n da kedo, Honda-sensei, sakubun no koto nani ka itteta?', 'Daniel, hôm qua mình lỡ nghỉ, thầy Honda có nói gì về bài văn không?'],
      ['ダニエル', 'ja-nam', 'うん。テーマは「{子|こ}どもの{頃|ころ}の{思|おも}い{出|で}」で、{来週|らいしゅう}の{月曜日|げつようび}に{出|だ}すように{言|い}ってたよ。', 'Un. Teema wa "Kodomo no koro no omoide" de, raishuu no getsuyoubi ni dasu you ni itteta yo.', 'Có. Chủ đề là "Kỷ niệm thời thơ ấu", thầy dặn nộp vào thứ Hai tuần sau.'],
      ['ワン', 'ja-nu', '{月曜日|げつようび}ね。パソコンで{書|か}いてもいいの？', 'Getsuyoubi ne. Pasokon de kaite mo ii no?', 'Thứ Hai nhỉ. Viết bằng máy tính có được không?'],
      ['ダニエル', 'ja-nam', 'ううん、{漢字|かんじ}の{練習|れんしゅう}になるから、パソコンは{使|つか}わないで、{手|て}で{書|か}くように{言|い}ってた。', 'Uun, kanji no renshuu ni naru kara, pasokon wa tsukawanaide, te de kaku you ni itteta.', 'Không, thầy dặn đừng dùng máy tính mà viết tay, vì như thế để luyện chữ Hán.'],
      ['ワン', 'ja-nu', 'そうなんだ。{何字|なんじ}ぐらい？', 'Sou na n da. Nanji gurai?', 'Ra vậy. Khoảng bao nhiêu chữ?'],
      ['ダニエル', 'ja-nam', '400{字|じ}から600{字|じ}ぐらい。800{字|じ}を{超|こ}えないようにって。{長|なが}すぎると{読|よ}むのが{大変|たいへん}だからって{笑|わら}ってたよ。', 'Yonhyakuji kara roppyakuji gurai. Happyakuji o koenai you ni tte. Nagasugiru to yomu no ga taihen da kara tte waratteta yo.', 'Khoảng 400 đến 600 chữ. Thầy dặn đừng vượt quá 800 chữ. Thầy cười bảo viết dài quá thì thầy đọc mệt.'],
      ['ワン', 'ja-nu', 'ありがとう。じゃ、{今週|こんしゅう}の{週末|しゅうまつ}に{書|か}いちゃおう。', 'Arigatou. Ja, konshuu no shuumatsu ni kaichaou.', 'Cảm ơn nhé. Vậy cuối tuần này mình viết luôn cho xong.'],
      ['ナレーター', 'ja-nu', '{先生|せんせい}は{作文|さくぶん}をどうするように{言|い}いましたか。', 'Sensei wa sakubun o dou suru you ni iimashita ka.', 'Thầy đã dặn làm bài văn thế nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b23-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: '{先生|せんせい}は{作文|さくぶん}をどうするように{言|い}いましたか。', options: ['パソコンで{書|か}いて、{金曜日|きんようび}に{出|だ}す', '{手|て}で{書|か}いて、{月曜日|げつようび}に{出|だ}す', '800{字|じ}{以上|いじょう}{書|か}いて、{月曜日|げつようび}に{出|だ}す', '{手|て}で{書|か}いて、{週末|しゅうまつ}に{出|だ}す'], correct: 1, why: '**パソコンは{使|つか}わないで、{手|て}で{書|か}くように** + **{月曜日|げつようび}に{出|だ}すように**. 800 chữ là mức **không được vượt** (～{超|こ}えないように), cuối tuần là lúc ワン định viết. 〔Te de kaku you ni itteta.〕' },
        { q: '{先生|せんせい}はどうして{手|て}で{書|か}くように{言|い}いましたか。', options: ['パソコンがないから', '{漢字|かんじ}の{練習|れんしゅう}になるから', '{長|なが}い{作文|さくぶん}は{読|よ}むのが{大変|たいへん}だから', '{字|じ}がきれいになるから'], correct: 1, why: '**{漢字|かんじ}の{練習|れんしゅう}になるから** — lý do đứng trước lời dặn. "Đọc mệt" là lý do của giới hạn 800 chữ. 〔Kanji no renshuu ni naru kara.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題3 発話表現: nói gì trong tình huống (4 câu)' },
    NG('b23-ng-5', '{何|なん}と{言|い}いますか（4{問|もん}）', 'Dạng 発話表現 — nghe mô tả tình huống, chọn 1 trong 3 câu. Cẩn thận ～させて (mình làm) ↔ ～て (người khác làm).', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。{熱|ねつ}があるので、{会社|かいしゃ}を{早|はや}く{帰|かえ}りたいです。{部長|ぶちょう}に{何|なん}と{言|い}いますか。', 'Ichiban. Netsu ga aru node, kaisha o hayaku kaeritai desu. Buchou ni nan to iimasu ka.', 'Câu 1. Bạn bị sốt nên muốn về sớm. Bạn nói gì với trưởng phòng?'],
      ['ナレーター', 'ja-nu', '1、すみません、{早退|そうたい}していただけませんか。 2、すみません、{早退|そうたい}させていただけませんか。 3、すみません、{早退|そうたい}させられませんか。', 'Ichi, sumimasen, soutai shite itadakemasen ka. Ni, sumimasen, soutai sasete itadakemasen ka. San, sumimasen, soutai saseraremasen ka.', '1. Xin lỗi, anh về sớm giúp tôi được không? 2. Xin lỗi, anh cho tôi về sớm được không ạ? 3. Xin lỗi, tôi có bị bắt về sớm không?'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。{友達|ともだち}が{重|おも}い{荷物|にもつ}を{持|も}っています。{手伝|てつだ}いたいです。{何|なん}と{言|い}いますか。', 'Niban. Tomodachi ga omoi nimotsu o motte imasu. Tetsudaitai desu. Nan to iimasu ka.', 'Câu 2. Bạn bạn đang xách đồ nặng. Bạn muốn giúp. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、それ、{持|も}たせて。 2、それ、{持|も}って。 3、それ、{持|も}たされて。', 'Ichi, sore, motasete. Ni, sore, motte. San, sore, motasarete.', '1. Đưa đây mình xách cho. 2. Cậu xách cái đó đi. 3. (vô nghĩa — "bị bắt xách")'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。{子|こ}どもが{道|みち}を{走|はし}っています。{車|くるま}が{来|き}ました。お{母|かあ}さんは{何|なん}と{言|い}いますか。', 'Sanban. Kodomo ga michi o hashitte imasu. Kuruma ga kimashita. Okaasan wa nan to iimasu ka.', 'Câu 3. Đứa trẻ đang chạy trên đường. Có xe ô tô tới. Người mẹ nói gì?'],
      ['ナレーター', 'ja-nu', '1、{危|あぶ}ない！{走|はし}りなさい！ 2、{危|あぶ}ない！{止|と}まって！ 3、{危|あぶ}ない！{止|と}まらせて！', 'Ichi, abunai! Hashirinasai! Ni, abunai! Tomatte! San, abunai! Tomarasete!', '1. Nguy hiểm! Chạy đi! 2. Nguy hiểm! Dừng lại! 3. Nguy hiểm! Cho dừng!'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。{店|みせ}で、お{客|きゃく}さんを{長|なが}い{時間|じかん}{待|ま}たせました。{店員|てんいん}は{何|なん}と{言|い}いますか。', 'Yonban. Mise de, okyaku-san o nagai jikan matasemashita. Ten\'in wa nan to iimasu ka.', 'Câu 4. Ở cửa hàng, nhân viên đã để khách chờ lâu. Nhân viên nói gì?'],
      ['ナレーター', 'ja-nu', '1、お{待|ま}ちしました。 2、お{待|ま}たせしました。 3、お{待|ま}たされました。', 'Ichi, omachi shimashita. Ni, omatase shimashita. San, omatasaremashita.', '1. Tôi đã chờ. 2. Xin lỗi đã để quý khách chờ. 3. (vô nghĩa — "đã bị bắt chờ")'],
    ]),
    {
      t: 'mcq',
      id: 'b23-ng-5-q',
      title: 'Bài 5 — chọn câu đúng',
      items: [
        { q: '{1番|いちばん} — {部長|ぶちょう}に{早|はや}く{帰|かえ}りたいと{言|い}う', options: ['1', '2', '3'], correct: 1, why: 'Xin cho MÌNH về sớm, với sếp → **{早退|そうたい}させていただけませんか**. 1 là nhờ sếp về sớm; 3 là sai khiến bị động. 〔Soutai sasete itadakemasen ka.〕' },
        { q: '{2番|にばん} — {友達|ともだち}の{荷物|にもつ}を{持|も}ってあげたい', options: ['1', '2', '3'], correct: 0, why: 'Xung phong làm giúp → **{持|も}たせて** (để mình xách). 2 là bảo bạn xách. 〔Sore, motasete.〕' },
        { q: '{3番|さんばん} — {車|くるま}が{来|き}た', options: ['1', '2', '3'], correct: 1, why: 'Nguy hiểm → bảo con **dừng lại**: **{止|と}まって！** 1 bảo con chạy (ngược); 3 vô nghĩa. 〔Abunai! Tomatte!〕' },
        { q: '{4番|よんばん} — お{客|きゃく}さんを{待|ま}たせた', options: ['1', '2', '3'], correct: 1, why: 'Câu cố định: **お{待|ま}たせしました** (sai khiến cảm xúc + khiêm nhường). 〔Omatase shimashita.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題4 即時応答: đáp ngay (6 câu)' },
    NG('b23-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（6{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp. Phân biệt させた ↔ させられた ↔ させてくれた.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['{西川|にしかわ}', 'ja-nam', 'その{仕事|しごと}、{僕|ぼく}にやらせてください。', 'Sono shigoto, boku ni yarasete kudasai.', 'Việc đó để tôi làm cho.'],
      ['{山口|やまぐち}', 'ja-nu', '1、じゃ、お{願|ねが}いします。{助|たす}かります。 2、はい、やらせました。 3、どういたしまして。', 'Ichi, ja, onegai shimasu. Tasukarimasu. Ni, hai, yarasemashita. San, dou itashimashite.', '1. Vậy nhờ anh nhé. Đỡ cho tôi quá. 2. Vâng, tôi đã bắt làm rồi. 3. Không có gì.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。', 'Niban.', 'Câu 2.'],
      ['アンナ', 'ja-nu', 'マルコさん、{子|こ}どもの{頃|ころ}、ご{両親|りょうしん}は{厳|きび}しかった？', 'Maruko-san, kodomo no koro, goryoushin wa kibishikatta?', 'Marco, hồi nhỏ bố mẹ cậu có nghiêm không?'],
      ['マルコ', 'ja-nam', '1、うん、{毎日|まいにち}{勉強|べんきょう}させられたよ。 2、うん、{毎日|まいにち}{勉強|べんきょう}させたよ。 3、うん、{厳|きび}しくさせてね。', 'Ichi, un, mainichi benkyou saserareta yo. Ni, un, mainichi benkyou saseta yo. San, un, kibishiku sasete ne.', '1. Có, ngày nào mình cũng bị bắt học. 2. Có, ngày nào mình cũng bắt (ai đó) học. 3. (lạc đề)'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['ナタポン', 'ja-nam', '{先生|せんせい}、ちょっと{質問|しつもん}させていただけませんか。', 'Sensei, chotto shitsumon sasete itadakemasen ka.', 'Thưa thầy, cho em hỏi một chút được không ạ?'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', '1、ええ、どうぞ。{何|なん}ですか。 2、はい、{質問|しつもん}してあげます。 3、いいえ、{質問|しつもん}させられます。', 'Ichi, ee, douzo. Nan desu ka. Ni, hai, shitsumon shite agemasu. San, iie, shitsumon saseraremasu.', '1. Được, em hỏi đi. Chuyện gì thế? 2. Vâng, tôi sẽ hỏi giúp em. 3. Không, tôi bị bắt hỏi.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['リン', 'ja-nu', 'ナタポンさん、{店長|てんちょう}は{何|なん}て{言|い}ってた？', 'Natapon-san, tenchou wa nan te itteta?', 'Anh Nattapon, anh chủ đã nói gì thế?'],
      ['ナタポン', 'ja-nam', '1、{明日|あした}は10{時|じ}に{来|く}るように{言|い}ってたよ。 2、{店長|てんちょう}に{言|い}ったよ。 3、10{時|じ}に{来|こ}させてください。', 'Ichi, ashita wa juuji ni kuru you ni itteta yo. Ni, tenchou ni itta yo. San, juuji ni kosasete kudasai.', '1. Anh ấy dặn mai đến lúc 10 giờ đấy. 2. Anh đã nói với anh chủ rồi. 3. Cho tôi đến lúc 10 giờ.'],
      ['ナレーター', 'ja-nu', '{5番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['パク', 'ja-nu', 'お{待|ま}たせ！ごめんね、{遅|おそ}くなって。', 'Omatase! Gomen ne, osoku natte.', 'Xin lỗi để cậu chờ! Mình đến muộn.'],
      ['カルロス', 'ja-nam', '1、ううん、{今|いま}{来|き}たところだよ。 2、うん、{待|ま}たせたよ。 3、{待|ま}ってください。', 'Ichi, uun, ima kita tokoro da yo. Ni, un, mataseta yo. San, matte kudasai.', '1. Không sao, mình cũng vừa mới đến. 2. Ừ, mình đã để cậu chờ. 3. Xin hãy chờ.'],
      ['ナレーター', 'ja-nu', '{6番|ろくばん}。', 'Rokuban.', 'Câu 6.'],
      ['{警備員|けいびいん}', 'ja-nam', 'おい！そこは{危|あぶ}ないから{入|はい}るな！', 'Oi! Soko wa abunai kara hairu na!', 'Này! Chỗ đó nguy hiểm, không được vào!'],
      ['ダニエル', 'ja-nam', '1、あ、すみません。すぐ{出|で}ます。 2、はい、{入|はい}ります。 3、{入|はい}らせてください。', 'Ichi, a, sumimasen. Sugu demasu. Ni, hai, hairimasu. San, hairasete kudasai.', '1. À, xin lỗi. Tôi ra ngay. 2. Vâng, tôi vào. 3. Cho tôi vào với.'],
    ]),
    {
      t: 'mcq',
      id: 'b23-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '{1番|いちばん} — 「その{仕事|しごと}、{僕|ぼく}にやらせてください。」', options: ['1', '2', '3'], correct: 0, why: 'Người khác xung phong làm giúp → **じゃ、お{願|ねが}いします。{助|たす}かります**. 2 lặp động từ nhưng sai nghĩa (mình bắt người khác). 〔Ja, onegai shimasu.〕' },
        { q: '{2番|にばん} — 「ご{両親|りょうしん}は{厳|きび}しかった？」', options: ['1', '2', '3'], correct: 0, why: 'Kể mình bị bố mẹ bắt học → **{勉強|べんきょう}させられたよ** (⑨). させた = mình bắt người khác — không hợp. 〔Mainichi benkyou saserareta yo.〕' },
        { q: '{3番|さんばん} — 「{質問|しつもん}させていただけませんか。」', options: ['1', '2', '3'], correct: 0, why: 'Học sinh xin phép hỏi → thầy đồng ý: **ええ、どうぞ**. 〔Ee, douzo. Nan desu ka.〕' },
        { q: '{4番|よんばん} — 「{店長|てんちょう}は{何|なん}て{言|い}ってた？」', options: ['1', '2', '3'], correct: 0, why: 'Hỏi lời dặn của anh chủ → thuật lại: **10{時|じ}に{来|く}るように{言|い}ってたよ** (⑧). 〔Juuji ni kuru you ni itteta yo.〕' },
        { q: '{5番|ごばん} — 「お{待|ま}たせ！」', options: ['1', '2', '3'], correct: 0, why: 'Bạn xin lỗi vì để mình chờ → đáp cho bạn yên tâm: **ううん、{今|いま}{来|き}たところだよ** (～たところ — Bài 19). 〔Ima kita tokoro da yo.〕' },
        { q: '{6番|ろくばん} — 「{入|はい}るな！」', options: ['1', '2', '3'], correct: 0, why: 'Bị cấm vào (～な) → xin lỗi và ra ngay: **すみません。すぐ{出|で}ます**. 〔A, sumimasen. Sugu demasu.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b23-doc',
  kind: 'reading',
  title: 'Đọc hiểu N4 — tờ dặn việc của anh chủ quán, bài văn "Kỷ niệm thời thơ ấu", bảng các lớp năng khiếu cho trẻ (情報検索)',
  goal: 'Đọc tờ dặn việc ~250 chữ để biết việc phải làm trước và điều bị cấm (～てください／～ないでください／～ように言ってあります); đọc bài văn ~500 chữ của マリヤム để nắm điều mẹ đã bắt / không cho làm (～させました・～させてもらえませんでした), bước ngoặt của câu chuyện và ý chính; tra bảng năm lớp năng khiếu theo nhiều điều kiện (tuổi, ngày rảnh, học phí, môn muốn học) và đọc chữ nhỏ ※.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N4',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '100–200 chữ', 'Bài 1 — tờ dặn việc: việc làm trước, điều cấm, ai giúp khi cần'],
        ['問題5', '内容理解（中文）', '~450 chữ', 'Bài 2 — bài văn kể chuyện hồi nhỏ: lý do, diễn biến, ý chính'],
        ['問題6', '情報検索', '~400 chữ (bảng)', 'Bài 3 — bảng lớp năng khiếu: lọc theo điều kiện, tính tiền, đọc ※'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá (まず{何|なに}を・どうして・{何|なん}と{言|い}いましたか・どれ・いくら), rồi mới đọc bài để tìm.',
        'Tờ dặn việc / thông báo: việc **phải làm** ở **～てください／～ように**; việc **cấm** ở **～ないでください／～てはいけません**; ai sẽ giúp nằm ở **～ように{言|い}ってあります** (đã dặn sẵn người đó).',
        'Bài kể chuyện hồi nhỏ: **người bắt / cho** đi với **は／が**, người **bị bắt / được cho** đi với **に／を**: {母|はは}は{私|わたし}に～させました. Câu **～させられました／～させてもらえませんでした** = cảm xúc tiêu cực lúc đó; ý chính (đã hiểu ra, biết ơn) thường ở **đoạn cuối**, sau **{今|いま}は／～と{思|おも}います**.',
        '情報検索: lập **bảng điều kiện** (tuổi, ngày, giờ, tiền tối đa, môn muốn học) rồi **loại** từng lựa chọn. Luôn đọc dòng **※** ({別|べつ} = tính riêng, {無料|むりょう} = miễn phí, ～までに = trước hạn).',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: tờ dặn việc của anh chủ quán' },
    {
      t: 'passage',
      title: 'リンさんへ（ひまわり{食堂|しょくどう}）',
      intro: 'Tờ giấy anh 小林 để trên bàn trong bếp cho リン — từ ngày mai cô sẽ một mình chuẩn bị buổi sáng. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'リンさんへ' },
        { text: '{明日|あした}から、{朝|あさ}の{準備|じゅんび}を{一人|ひとり}でしてもらうことになりました。{次|つぎ}のことに{気|き}をつけてください。' },
        { text: '・{店|みせ}に{来|き}たら、まず{手|て}を{洗|あら}って、エプロンに{着替|きが}えてください。' },
        { text: '・テーブルをふいてから、いすを{並|なら}べてください。' },
        { text: '・{野菜|やさい}は{冷蔵庫|れいぞうこ}の{右側|みぎがわ}に{入|い}れてあります。{使|つか}う{前|まえ}に、{必|かなら}ず{日付|ひづけ}を{見|み}てください。' },
        { text: '・お{客|きゃく}さんの{前|まえ}では、スマホを{使|つか}わないでください。{休|やす}み{時間|じかん}に{裏|うら}で{使|つか}うのは{大丈夫|だいじょうぶ}です。' },
        { text: 'わからないことがあったら、ナタポンくんに{電話|でんわ}してください。ナタポンくんには、リンさんから{電話|でんわ}があったら{教|おし}えてあげるように{言|い}ってあります。{遠慮|えんりょ}しないでくださいね。' },
        { text: '{小林|こばやし}' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-doc-1',
      title: 'Bài 1 — câu hỏi (2 câu)',
      items: [
        { q: 'リンさんは{店|みせ}に{来|き}たら、まず{何|なに}をしますか。', options: ['テーブルをふく', '{手|て}を{洗|あら}う', '{野菜|やさい}の{日付|ひづけ}を{見|み}る', 'ナタポンくんに{電話|でんわ}する'], correct: 1, why: '**{店|みせ}に{来|き}たら、まず{手|て}を{洗|あら}って…** — "まず" cho biết việc đầu tiên. Lau bàn là sau đó (～てから); xem hạn rau là "trước khi dùng".' },
        { q: 'このメモの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['リンさんは{店|みせ}でスマホを{全然|ぜんぜん}{使|つか}ってはいけない。', '{野菜|やさい}は{冷蔵庫|れいぞうこ}の{左側|ひだりがわ}に{入|はい}っている。', 'リンさんは{困|こま}ったら、ナタポンくんに{電話|でんわ}すればいい。', 'ナタポンくんは{明日|あした}の{朝|あさ}、リンさんと{一緒|いっしょ}に{準備|じゅんび}をする。'], correct: 2, why: '**わからないことがあったら、ナタポンくんに{電話|でんわ}してください** + anh chủ **đã dặn sẵn** ナタポン (～ように{言|い}ってあります). Điện thoại chỉ cấm **trước mặt khách** (bẫy ①); rau ở **bên phải** (bẫy ②); リン làm **một mình** (bẫy ④).' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{明日|あした}から、{朝|あさ}の{準備|じゅんび}を{一人|ひとり}でしてもらうことになりました。', 'Ashita kara, asa no junbi o hitori de shite morau koto ni narimashita.', 'Từ mai, (anh) quyết định nhờ em một mình lo việc chuẩn bị buổi sáng. (ことになる — Bài 21)'),
        E('{野菜|やさい}は{冷蔵庫|れいぞうこ}の{右側|みぎがわ}に{入|い}れてあります。', 'Yasai wa reizouko no migigawa ni irete arimasu.', 'Rau đã được để sẵn ở bên phải tủ lạnh. (～てある — Bài 18)'),
        E('{電話|でんわ}があったら{教|おし}えてあげるように{言|い}ってあります。', 'Denwa ga attara oshiete ageru you ni itte arimasu.', 'Anh đã dặn sẵn (cậu ấy) là nếu em gọi thì chỉ cho em. (～ように{言|い}う + ～てある)'),
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: bài văn "Kỷ niệm thời thơ ấu"' },
    {
      t: 'passage',
      title: '{子|こ}どもの{頃|ころ}の{思|おも}い{出|で}（マリヤム）',
      intro: 'Bài văn マリヤム viết cho lớp của thầy 本田 — thứ Hai tuần sau phải nộp. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: '{私|わたし}の{母|はは}はとても{厳|きび}しい{人|ひと}でした。{私|わたし}が{小学生|しょうがくせい}の{頃|ころ}、{母|はは}は{私|わたし}に{毎日|まいにち}{一時間|いちじかん}ピアノを{練習|れんしゅう}させました。{友達|ともだち}が{外|そと}で{遊|あそ}んでいるとき、{私|わたし}は{一人|ひとり}で{家|いえ}でピアノを{弾|ひ}かなければなりませんでした。テレビも{一日|いちにち}{三十分|さんじゅっぷん}しか{見|み}させてもらえませんでした。その{頃|ころ}は、そんな{母|はは}がとても{嫌|いや}でした。' },
        { text: '{十二歳|じゅうにさい}のとき、ピアノの{発表会|はっぴょうかい}がありました。{私|わたし}はとても{緊張|きんちょう}して、{途中|とちゅう}で{何回|なんかい}も{間違|まちが}えてしまいました。{弾|ひ}き{終|お}わってから、{私|わたし}は{泣|な}きながら「もうピアノはやめたい」と{母|はは}に{言|い}いました。{母|はは}は{何|なに}も{言|い}わないで、{私|わたし}を{家|いえ}の{近|ちか}くの{公園|こうえん}に{連|つ}れて{行|い}きました。そして、「{間違|まちが}えても、{最後|さいご}まで{弾|ひ}いたでしょう。お{母|かあ}さんはそれがうれしかったよ」と{言|い}いました。その{日|ひ}、{私|わたし}は{初|はじ}めて{母|はは}が{私|わたし}のピアノのことで{笑|わら}うのを{見|み}ました。' },
        { text: '{今|いま}、{私|わたし}は{日本|にほん}で{一人|ひとり}で{生活|せいかつ}しています。{大変|たいへん}なこともありますが、{諦|あきら}めないで{続|つづ}けられるのは、あのとき{母|はは}が{最後|さいご}まで{頑張|がんば}らせてくれたからだと{思|おも}います。{将来|しょうらい}、{自分|じぶん}に{子|こ}どもができたら、{私|わたし}も{何|なに}か{一|ひと}つ、{長|なが}く{続|つづ}けられることをさせたいです。でも、テレビはもう{少|すこ}し{見|み}させてあげるつもりです。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-doc-2',
      title: 'Bài 2 — câu hỏi (3 câu)',
      items: [
        { q: '{小学生|しょうがくせい}の{頃|ころ}、マリヤムさんはどうしてお{母|かあ}さんが{嫌|いや}でしたか。', options: ['お{母|かあ}さんがピアノを{弾|ひ}かせてくれなかったから', '{毎日|まいにち}ピアノを{練習|れんしゅう}させられて、テレビもあまり{見|み}られなかったから', 'お{母|かあ}さんが{毎日|まいにち}{外|そと}で{遊|あそ}んでいたから', '{友達|ともだち}と{一緒|いっしょ}にピアノを{習|なら}わされたから'], correct: 1, why: 'Đoạn 1: **{毎日|まいにち}{一時間|いちじかん}ピアノを{練習|れんしゅう}させました** + **テレビも…しか{見|み}させてもらえませんでした** → **その{頃|ころ}は、そんな{母|はは}がとても{嫌|いや}でした**.' },
        { q: '{発表会|はっぴょうかい}のあと、お{母|かあ}さんは{何|なに}がうれしかったと{言|い}いましたか。', options: ['マリヤムさんが{一回|いっかい}も{間違|まちが}えなかったこと', 'マリヤムさんが「やめたい」と{言|い}ったこと', 'マリヤムさんが{間違|まちが}えても{最後|さいご}まで{弾|ひ}いたこと', 'マリヤムさんが{公園|こうえん}で{泣|な}かなかったこと'], correct: 2, why: '**{間違|まちが}えても、{最後|さいご}まで{弾|ひ}いたでしょう。お{母|かあ}さんはそれがうれしかった** — それ = việc chơi đến cuối dù sai. Cô **có sai nhiều lần** (bẫy ①).' },
        { q: 'この{文章|ぶんしょう}でマリヤムさんがいちばん{言|い}いたいことは{何|なん}ですか。', options: ['ピアノの{練習|れんしゅう}は{子|こ}どもにさせないほうがいい。', 'お{母|かあ}さんが{最後|さいご}まで{頑張|がんば}らせてくれたので、{今|いま}も{諦|あきら}めないで{続|つづ}けられる。', '{日本|にほん}での{生活|せいかつ}は{大変|たいへん}なので、{国|くに}へ{帰|かえ}りたい。', '{子|こ}どもにはテレビをたくさん{見|み}させたほうがいい。'], correct: 1, why: 'Đoạn cuối: **{諦|あきら}めないで{続|つづ}けられるのは、あのとき{母|はは}が{最後|さいご}まで{頑張|がんば}らせてくれたからだと{思|おも}います** — ý chính đứng trước **～と{思|おも}います**. Câu về ti vi chỉ là câu đùa kết bài.' },
      ],
    },
    {
      t: 'note',
      title: 'Soi lại ngữ pháp trong bài 2',
      items: [
        '**{母|はは}は{私|わたし}に{毎日|まいにち}{一時間|いちじかん}ピアノを{練習|れんしゅう}させました** — sai khiến "bắt" (②): có ピアノを → {私|わたし}**に**.',
        '**{見|み}させてもらえませんでした** — không được cho xem (③). **{頑張|がんば}らせてくれた** — mẹ đã "cho / giúp" mình cố gắng đến cùng (③, nghĩa tích cực, biết ơn). **{見|み}させてあげるつもり** — sẽ cho con xem (～てあげる + つもり — Bài 18, 16).',
        '**{泣|な}きながら** — vừa khóc vừa (Vます＋ながら = vừa… vừa…, N4) · **{連|つ}れて{行|い}きました** (dẫn đi) · **{母|はは}が{笑|わら}うのを{見|み}ました** (nhìn thấy mẹ cười — ～のを{見|み}る) · **{続|つづ}けられるのは、～からだと{思|おも}います** (sở dĩ… là vì… — cấu trúc nhấn lý do).',
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: các lớp năng khiếu cho trẻ' },
    {
      t: 'passage',
      title: 'みどり{市|し}こどもセンター　{習|なら}い{事|ごと}{教室|きょうしつ}のご{案内|あんない}（4{月|がつ}から）',
      intro: 'Chị 田中 muốn cho con trai 8 tuổi học bơi hoặc tiếng Anh. Con chỉ rảnh chiều thứ Tư và chiều thứ Bảy; học phí mỗi tháng tối đa 6.000 yên. Đọc bảng rồi trả lời câu hỏi.',
      paras: [
        { label: '①', text: '{水泳|すいえい}A　{対象|たいしょう}：5～8{歳|さい}　{水曜日|すいようび} 16:00～17:00　{月謝|げっしゃ}：5,000{円|えん}' },
        { label: '②', text: '{水泳|すいえい}B　{対象|たいしょう}：9～12{歳|さい}　{土曜日|どようび} 10:00～11:00　{月謝|げっしゃ}：5,000{円|えん}' },
        { label: '③', text: '{英会話|えいかいわ}　{対象|たいしょう}：6～10{歳|さい}　{土曜日|どようび} 14:00～15:00　{月謝|げっしゃ}：6,500{円|えん}' },
        { label: '④', text: '{書道|しょどう}　{対象|たいしょう}：6～12{歳|さい}　{水曜日|すいようび} 17:00～18:00　{月謝|げっしゃ}：4,000{円|えん}' },
        { label: '⑤', text: 'サッカー　{対象|たいしょう}：7～10{歳|さい}　{土曜日|どようび} 15:00～17:00　{月謝|げっしゃ}：3,000{円|えん}（※ユニフォーム{代|だい}5,000{円|えん}は{別|べつ}。{最初|さいしょ}の{月|つき}に{払|はら}ってください。）' },
        { text: '※{初|はじ}めての{方|かた}は、{一回|いっかい}{無料|むりょう}で{体験|たいけん}できます。{体験|たいけん}したい{日|ひ}の{三日前|みっかまえ}までに、{電話|でんわ}で{申|もう}し{込|こ}んでください。' },
        { text: '※{教室|きょうしつ}を{休|やす}むときは、{必|かなら}ず{前|まえ}の{日|ひ}までに{連絡|れんらく}してください。' },
        { text: '※{教室|きょうしつ}の{中|なか}では、{保護者|ほごしゃ}の{方|かた}は{写真|しゃしん}を{撮|と}らないようにお{願|ねが}いします。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-doc-3',
      title: 'Bài 3 — câu hỏi (3 câu)',
      items: [
        { q: '{田中|たなか}さんの{息子|むすこ}さんに{合|あ}う{教室|きょうしつ}はどれですか。', options: ['①', '②', '③', '⑤'], correct: 0, why: 'Điều kiện: 8 tuổi · bơi hoặc tiếng Anh · chiều thứ Tư / thứ Bảy · ≤ 6.000 yên. ② dành cho 9–12 tuổi và là **sáng** thứ Bảy (loại); ③ 6.500 yên (vượt); ⑤ là bóng đá (không phải môn muốn học). Còn **①** (5–8 tuổi, thứ Tư 16:00, 5.000 yên).' },
        { q: '{体験|たいけん}したい{人|ひと}は、どうしなければなりませんか。', options: ['{教室|きょうしつ}の{日|ひ}に{直接|ちょくせつ}{行|い}く', '{前|まえ}の{日|ひ}までにメールを{送|おく}る', '{体験|たいけん}の{三日前|みっかまえ}までに{電話|でんわ}で{申|もう}し{込|こ}む', '5,000{円|えん}{払|はら}う'], correct: 2, why: '**{体験|たいけん}したい{日|ひ}の{三日前|みっかまえ}までに、{電話|でんわ}で{申|もう}し{込|こ}んでください** — và thử là **{無料|むりょう}** (bẫy ④). "{前|まえ}の{日|ひ}まで" là quy định khi **nghỉ học** (bẫy ②).' },
        { q: 'サッカー{教室|きょうしつ}に{入|はい}ると、{最初|さいしょ}の{月|つき}はいくら{払|はら}いますか。', options: ['3,000{円|えん}', '5,000{円|えん}', '8,000{円|えん}', '6,500{円|えん}'], correct: 2, why: 'Học phí 3.000 yên + **ユニフォーム{代|だい}5,000{円|えん}は{別|べつ}。{最初|さいしょ}の{月|つき}に{払|はら}って** → 8.000 yên. Dòng ※ trong ngoặc là chỗ đề hay giấu thông tin.' },
      ],
    },
    {
      t: 'note',
      title: 'Từ của bảng (đọc được là đủ)',
      items: [
        '**{対象|たいしょう}** (đối tượng — N3) · **{月謝|げっしゃ}** (học phí hằng tháng cho lớp năng khiếu — N2) · **{体験|たいけん}** (học thử, trải nghiệm — N3) · **{無料|むりょう}** (miễn phí) · **{別|べつ}** (tính riêng) · **{保護者|ほごしゃ}** (phụ huynh — N2) · **～{代|だい}** (tiền ~: ユニフォーム{代|だい}, {電気代|でんきだい}).',
        '**{写真|しゃしん}を{撮|と}らないようにお{願|ねが}いします** — "xin vui lòng không chụp ảnh": ～ないようにお{願|ねが}いします là câu nhờ / cấm lịch sự hay thấy trên thông báo (cùng gốc với ～ように{言|い}う, mẫu ⑧).',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b23-noi',
  kind: 'speaking',
  title: 'Luyện nói — kể bố mẹ đã bắt / cho mình làm gì hồi nhỏ, xin phép lịch sự, kể lại lời dặn, nói 1 phút "Hồi nhỏ của tôi", đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói về thời thơ ấu (子どもの頃、ご両親は厳しかったですか・どんな習い事をしましたか・親によく何と言われましたか) bằng ～させました／～させてくれました／～させてもらえませんでした／～ように言われました; mô tả tranh có người bắt / cho / cấm làm; xin phép lịch sự bằng ～させていただけませんか; nói 1 phút "Hồi nhỏ của tôi" và đọc to đoạn ~100 chữ không vấp ở させる・させられる.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) — chủ đề Bài 23 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 23 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100 chữ.', 'Đoạn kể chuyện hồi nhỏ: ～させました, ～させてくれました, ～させてもらえませんでした, ～ように言われました, ～なさい…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (mẹ cho con tập đàn, biển cấm vào, nhân viên bị sốt nói với sếp) trả lời.', 'お{母|かあ}さんは{子|こ}どもに{何|なに}をさせていますか（→ ピアノを{練習|れんしゅう}させています）· ここに{何|なん}と{書|か}いてありますか（→ {入|はい}らないようにと{書|か}いてあります）· この{人|ひと}は{部長|ぶちょう}に{何|なん}と{言|い}いますか（→ {早退|そうたい}させていただけませんか）'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{子|こ}どもの{頃|ころ}、どんな{習|なら}い{事|ごと}をしましたか · ご{両親|りょうしん}は{厳|きび}しかったですか · {将来|しょうらい}、{子|こ}どもにどんなことをさせたいですか'],
        ['Presenting', '5', 'Chào khi vào/ra, thái độ.', 'Vào phòng: {失礼|しつれい}します · ra: ありがとうございました。{失礼|しつれい}します · nghe không rõ câu hỏi: すみません、もう{一度|いちど}{聞|き}かせていただけませんか (cho em nghe lại một lần nữa được không ạ).'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 23',
      items: [
        '**"Hồi nhỏ, bố mẹ có nghiêm không?"** → **はい／いいえ + 1 câu sai khiến + 1 chi tiết**: はい、{厳|きび}しかったです。{母|はは}は{毎日|まいにち}{私|わたし}に{一時間|いちじかん}{勉強|べんきょう}させました。テレビは{夜|よる}9{時|じ}までしか{見|み}させてくれませんでした.',
        '**"Bạn được làm / không được làm gì?"** → **～させてくれました／～させてもらえませんでした** (giọng biết ơn / tiếc). Kể chuyện "bị bắt" thì có thể dùng **～させられました** — được điểm cao nếu nói đúng, nhưng nếu không chắc thì dùng **{母|はは}は{私|わたし}に～させました** cho an toàn.',
        '**"Bố mẹ hay dặn bạn gì?"** → **{母|はは}によく「～なさい」と{言|い}われました** hoặc **～ように{言|い}われました**. Câu 2 ý: dặn gì + bây giờ mình nghĩ sao (～と{思|おも}います).',
        '**"Sau này bạn muốn cho con làm gì?"** → **{子|こ}どもに～させたいです** + lý do ～から. Đừng dùng thể mệnh lệnh ({走|はし}れ) khi kể — nếu trích lời, đặt trong 「」 + と{言|い}われました.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — giám thị ↔ thí sinh',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{子|こ}どもの{頃|ころ}、ご{両親|りょうしん}は{厳|きび}しかったですか。', ro: 'Kodomo no koro, goryoushin wa kibishikatta desu ka.', vi: 'Hồi nhỏ bố mẹ em có nghiêm không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{父|ちち}はとても{厳|きび}しかったです。{毎朝|まいあさ}6{時|じ}に{起|お}きさせて、{家|いえ}の{前|まえ}を{掃除|そうじ}させました。', ro: 'Hai, chichi wa totemo kibishikatta desu. Maiasa rokuji ni okisasete, ie no mae o souji sasemashita.', vi: 'Dạ có, bố em rất nghiêm. Sáng nào cũng bắt em dậy lúc 6 giờ và quét trước cửa nhà.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'お{母|かあ}さんはどうでしたか。', ro: 'Okaasan wa dou deshita ka.', vi: 'Còn mẹ em thì sao?' },
        { who: 'Bạn', role: 'candidate', text: '{母|はは}は{優|やさ}しくて、{週末|しゅうまつ}は{友達|ともだち}と{自由|じゆう}に{遊|あそ}ばせてくれました。でも、ゲームはあまりさせてもらえませんでした。', ro: 'Haha wa yasashikute, shuumatsu wa tomodachi to jiyuu ni asobasete kuremashita. Demo, geemu wa amari sasete moraemasen deshita.', vi: 'Mẹ em hiền, cuối tuần cho em chơi thoải mái với bạn. Nhưng game thì em không được chơi nhiều.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{子|こ}どもの{頃|ころ}、{何|なに}か{習|なら}い{事|ごと}をしましたか。', ro: 'Kodomo no koro, nani ka naraigoto o shimashita ka.', vi: 'Hồi nhỏ em có học thêm môn năng khiếu nào không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{水泳|すいえい}を{習|なら}いました。{母|はは}が「{水|みず}の{事故|じこ}にあわないように」と{言|い}って、{習|なら}わせてくれたんです。{今|いま}は{泳|およ}ぐのが{大好|だいす}きです。', ro: 'Hai, suiei o naraimashita. Haha ga "Mizu no jiko ni awanai you ni" to itte, narawasete kureta n desu. Ima wa oyogu no ga daisuki desu.', vi: 'Dạ, em học bơi. Mẹ nói "để khỏi bị tai nạn dưới nước" nên cho em đi học. Giờ em rất thích bơi.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'ご{両親|りょうしん}によく{何|なん}と{言|い}われましたか。', ro: 'Goryoushin ni yoku nan to iwaremashita ka.', vi: 'Em hay bị bố mẹ nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{早|はや}く{宿題|しゅくだい}をしなさい」とよく{言|い}われました。それから、{父|ちち}に{嘘|うそ}をつかないように{言|い}われていました。', ro: '"Hayaku shukudai o shinasai" to yoku iwaremashita. Sorekara, chichi ni uso o tsukanai you ni iwarete imashita.', vi: 'Em hay bị nói "Làm bài tập nhanh lên". Còn bố thì luôn dặn em đừng nói dối.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{将来|しょうらい}、{自分|じぶん}の{子|こ}どもにどんなことをさせたいですか。', ro: 'Shourai, jibun no kodomo ni donna koto o sasetai desu ka.', vi: 'Sau này em muốn cho con mình làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'いろいろな{国|くに}へ{旅行|りょこう}させたいです。{世界|せかい}のことを{自分|じぶん}の{目|め}で{見|み}てほしいからです。', ro: 'Iroiro na kuni e ryokou sasetai desu. Sekai no koto o jibun no me de mite hoshii kara desu.', vi: 'Em muốn cho con đi du lịch nhiều nước. Vì em muốn con tận mắt nhìn thế giới.' },
      ],
    },
    { t: 'h', text: 'Talking — có tranh: 3 tranh kiểu đề thi' },
    {
      t: 'canh',
      anh: ['musical-keyboard', 'construction', 'face-with-thermometer'],
      caption: 'Tranh 1: một bé gái ngồi trước đàn phím, mẹ đứng cạnh chỉ vào bản nhạc. Tranh 2: hàng rào công trường có tấm biển ghi chữ đỏ "立入禁止" (cấm vào). Tranh 3: một nhân viên văn phòng mặt đỏ, cầm nhiệt kế, đứng trước bàn trưởng phòng.',
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — nhìn tranh trả lời (mỗi câu 2 ý)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{絵|え}1を{見|み}てください。お{母|かあ}さんは{子|こ}どもに{何|なに}をさせていますか。', ro: 'E ichi o mite kudasai. Okaasan wa kodomo ni nani o sasete imasu ka.', vi: 'Em xem tranh 1. Người mẹ đang bắt / cho con làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ピアノを{練習|れんしゅう}させています。{子|こ}どもはあまり{楽|たの}しくなさそうです。', ro: 'Piano o renshuu sasete imasu. Kodomo wa amari tanoshiku nasasou desu.', vi: 'Mẹ đang cho bé tập piano. Bé trông không vui lắm. (～なさそう — Bài 20)' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{絵|え}2を{見|み}てください。ここに{何|なん}と{書|か}いてありますか。', ro: 'E ni o mite kudasai. Koko ni nan to kaite arimasu ka.', vi: 'Em xem tranh 2. Ở đây viết gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{立入禁止|たちいりきんし}」と{書|か}いてあります。{危|あぶ}ないので、{中|なか}に{入|はい}らないようにという{意味|いみ}です。', ro: '"Tachiiri kinshi" to kaite arimasu. Abunai node, naka ni hairanai you ni to iu imi desu.', vi: 'Viết là "Cấm vào". Nghĩa là vì nguy hiểm nên đừng vào trong.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{絵|え}3を{見|み}てください。この{人|ひと}は{部長|ぶちょう}に{何|なん}と{言|い}いますか。', ro: 'E san o mite kudasai. Kono hito wa buchou ni nan to iimasu ka.', vi: 'Em xem tranh 3. Người này sẽ nói gì với trưởng phòng?' },
        { who: 'Bạn', role: 'candidate', text: '「{熱|ねつ}があるので、{今日|きょう}は{早退|そうたい}させていただけませんか」と{言|い}うと{思|おも}います。', ro: '"Netsu ga aru node, kyou wa soutai sasete itadakemasen ka" to iu to omoimasu.', vi: 'Em nghĩ người đó sẽ nói "Tôi bị sốt, hôm nay anh cho tôi về sớm được không ạ".' },
      ],
    },
    {
      t: 'phatam',
      id: 'b23-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 23',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý: さ・せ・る (sa-se-ru) ↔ さ・せ・ら・れ・る (sa-se-ra-re-ru); か・え・ら・せ・て (đừng chèn さ: ~~kaerasasete~~); ま・た・せ・し・ま・し・た; こ・さ・せ・る (来させる đọc こ); め・い・れ・い (trường âm ei); きょ・か (きょ ngắn).',
      items: [
        { text: '{子|こ}どもの{頃|ころ}、{母|はは}は{毎日|まいにち}ピアノを{練習|れんしゅう}させました。', ipa: 'kodomo no koro haha wa mainichi piano o renshuu sasemashita', vi: 'Hồi nhỏ, mẹ bắt tôi tập piano mỗi ngày.' },
        { text: '{両親|りょうしん}は{外|そと}で{自由|じゆう}に{遊|あそ}ばせてくれました。', ipa: 'ryoushin wa soto de jiyuu ni asobasete kuremashita', vi: 'Bố mẹ cho tôi chơi ngoài trời thoải mái.' },
        { text: '{犬|いぬ}を{飼|か}わせてもらえませんでした。', ipa: 'inu o kawasete moraemasen deshita', vi: 'Tôi không được cho nuôi chó.' },
        { text: 'よくけがをして、{親|おや}を{心配|しんぱい}させました。', ipa: 'yoku kega o shite oya o shinpai sasemashita', vi: 'Tôi hay bị thương làm bố mẹ lo.' },
        { text: 'お{待|ま}たせしました。', ipa: 'omatase shimashita', vi: 'Xin lỗi đã để anh / chị chờ.' },
        { text: '{今日|きょう}は{早|はや}く{帰|かえ}らせてください。', ipa: 'kyou wa hayaku kaerasete kudasai', vi: 'Hôm nay cho tôi về sớm ạ.' },
        { text: 'その{仕事|しごと}、{私|わたし}にやらせてください。', ipa: 'sono shigoto watashi ni yarasete kudasai', vi: 'Việc đó để tôi làm.' },
        { text: '{明日|あした}、{休|やす}ませていただけませんか。', ipa: 'ashita yasumasete itadakemasen ka', vi: 'Ngày mai cho tôi nghỉ được không ạ?' },
        { text: '{少|すこ}し{考|かんが}えさせてください。', ipa: 'sukoshi kangaesasete kudasai', vi: 'Cho tôi suy nghĩ một chút.' },
        { text: '{早|はや}く{寝|ね}なさいとよく{言|い}われました。', ipa: 'hayaku nenasai to yoku iwaremashita', vi: 'Tôi hay bị bảo "đi ngủ sớm đi".' },
        { text: '{先生|せんせい}に{毎日|まいにち}{復習|ふくしゅう}するように{言|い}われました。', ipa: 'sensei ni mainichi fukushuu suru you ni iwaremashita', vi: 'Tôi được thầy dặn ôn bài mỗi ngày.' },
        { text: 'リンさんに、10{時|じ}に{来|く}るように{伝|つた}えてください。', ipa: 'rin san ni juuji ni kuru you ni tsutaete kudasai', vi: 'Hãy nhắn Linh là đến lúc 10 giờ.' },
        { text: '{頑張|がんば}れ！{最後|さいご}まで{諦|あきら}めるな！', ipa: 'ganbare saigo made akirameru na', vi: 'Cố lên! Đừng bỏ cuộc cho đến cùng!' },
        { text: '{毎日|まいにち}{塾|じゅく}に{行|い}かされて、{大変|たいへん}でした。', ipa: 'mainichi juku ni ikasarete taihen deshita', vi: 'Ngày nào cũng bị bắt đi học thêm, vất vả lắm.' },
      ],
    },
    {
      t: 'note',
      title: 'Nói 1 phút (できる！) — dàn ý + bài mẫu "Hồi nhỏ của tôi"',
      items: [
        '**Dàn ý 4 câu chốt**: ① mình lớn lên ở đâu, bố mẹ thế nào ({私|わたし}は～で{育|そだ}ちました。{両親|りょうしん}は～でした) → ② bố mẹ bắt / cho mình làm gì (～させました／～させてくれました／～させてもらえませんでした) → ③ bố mẹ hay dặn gì (よく～ように{言|い}われました) → ④ bây giờ mình nghĩ sao + sau này muốn cho con làm gì (～させたいです).',
        '{私|わたし}はハノイで{生|う}まれて、ハノイで{育|そだ}ちました。{両親|りょうしん}は{優|やさ}しかったですが、{勉強|べんきょう}には{厳|きび}しくて、{毎晩|まいばん}{二時間|にじかん}{勉強|べんきょう}させました。でも、{週末|しゅうまつ}は{友達|ともだち}と{自由|じゆう}に{遊|あそ}ばせてくれました。{母|はは}にはよく「ご{飯|はん}を{残|のこ}さないで{食|た}べなさい」と{言|い}われました。その{頃|ころ}は{嫌|いや}でしたが、{今|いま}は{何|なん}でも{食|た}べられるので、{母|はは}に{感謝|かんしゃ}しています。{将来|しょうらい}、{自分|じぶん}の{子|こ}どもにも、{好|す}き{嫌|きら}いをしないように{言|い}いたいです。',
        'Romaji: Watashi wa Hanoi de umarete, Hanoi de sodachimashita. Ryoushin wa yasashikatta desu ga, benkyou ni wa kibishikute, maiban nijikan benkyou sasemashita. Demo, shuumatsu wa tomodachi to jiyuu ni asobasete kuremashita. Haha ni wa yoku "Gohan o nokosanaide tabenasai" to iwaremashita. Sono koro wa iya deshita ga, ima wa nan demo taberareru node, haha ni kansha shite imasu. Shourai, jibun no kodomo ni mo, sukikirai o shinai you ni iitai desu.',
        'Nghĩa: Tôi sinh ra và lớn lên ở Hà Nội. Bố mẹ tôi hiền, nhưng nghiêm chuyện học, tối nào cũng bắt tôi học hai tiếng. Nhưng cuối tuần thì cho tôi chơi thoải mái với bạn. Tôi hay bị mẹ bảo "Ăn hết cơm, đừng để thừa". Hồi đó tôi ghét lắm, nhưng giờ tôi ăn được mọi thứ nên rất biết ơn mẹ. Sau này tôi cũng muốn dặn con mình đừng kén ăn.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 40 điểm) — đoạn mẫu 30 giây',
      items: [
        '{兄|あに}は{子|こ}どもの{頃|ころ}、サッカー{部|ぶ}に{入|はい}っていました。コーチはとても{厳|きび}しくて、{毎朝|まいあさ}{選手|せんしゅ}たちを{十|じゅっ}キロ{走|はし}らせたそうです。{兄|あに}は{何度|なんど}も「もうやめたい」と{思|おも}いましたが、コーチに「{諦|あきら}めるな」と{言|い}われて、{最後|さいご}まで{続|つづ}けました。{今|いま}、{兄|あに}は{小学校|しょうがっこう}の{先生|せんせい}になって、{子|こ}どもたちにサッカーを{教|おし}えています。',
        'Romaji: Ani wa kodomo no koro, sakkaa-bu ni haitte imashita. Koochi wa totemo kibishikute, maiasa senshutachi o jukkiro hashiraseta sou desu. Ani wa nando mo "Mou yametai" to omoimashita ga, koochi ni "Akirameru na" to iwarete, saigo made tsuzukemashita. Ima, ani wa shougakkou no sensei ni natte, kodomotachi ni sakkaa o oshiete imasu.',
        'Nghĩa: Hồi nhỏ anh tôi ở trong đội bóng đá của trường. Nghe nói huấn luyện viên rất nghiêm, sáng nào cũng bắt các cầu thủ chạy 10 km. Anh tôi nhiều lần nghĩ "Thôi, muốn bỏ", nhưng được huấn luyện viên bảo "Đừng bỏ cuộc" nên đã theo đến cùng. Bây giờ anh tôi thành giáo viên tiểu học và dạy bóng đá cho bọn trẻ.',
        'Chỗ dễ vấp: **{走|はし}らせたそうです** (ha-shi-ra-se-ta-so-o-de-su — sai khiến + そうだ nghe nói, ôn ポイント 119), **{十|じゅっ}キロ** (jukkiro — っ), **「{諦|あきら}めるな」と{言|い}われて** (a-ki-ra-me-ru-na-to — な cấm, đừng kéo dài), **{続|つづ}けました** (tsu-zu-ke — づ), **{小学校|しょうがっこう}** (sho-o-gak-ko-o).',
      ],
    },
    {
      t: 'speak',
      id: 'b23-noi-ghi-am',
      part: '1',
      questions: [
        'こどもの ころ、ごりょうしんは きびしかったですか。',
        'こどもの ころ、どんな ならいごとを しましたか。',
        'こどもの ころ、りょうしんに どんな ことを させて もらえませんでしたか。',
        'ごりょうしんに よく なんと いわれましたか。',
        'しょうらい、じぶんの こどもに どんな ことを させたいですか。',
        'あなたの こどもの ころに ついて、1ぷんで はなして ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b23-viet',
  kind: 'writing',
  title: 'Viết — bài văn "Kỷ niệm thời thơ ấu" (150–200 chữ) và email xin phép (～させていただけませんか)',
  goal: 'Viết bài văn 150–200 chữ về thời thơ ấu: lớn lên ở đâu, bố mẹ thế nào, đã bắt / cho mình làm gì (～させました／～させてくれました／～させてもらえませんでした), hay dặn gì (～ように言われました／「～なさい」と言われました), bây giờ mình nghĩ sao; viết email ngắn ~100 chữ xin phép thầy / chủ quán (～ので、～させていただけませんか) và nhắn lại lời dặn (～ように言われました).',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **作文「{子|こ}どもの{頃|ころ}の{思|おも}い{出|で}」**, **150–200 chữ**, thể です／ます. Đề phụ: **email cho anh {小林店長|こばやしてんちょう} hoặc thầy {本田|ほんだ}** (~100 chữ) **xin phép** một việc (về sớm, nghỉ một buổi, đổi ca, dùng phòng…) bằng **～ので、～させていただけませんか**, kèm câu **xung phong bù lại** (～は{私|わたし}にやらせてください) và câu cảm ơn. Viết xong, tự chấm theo 5 tiêu chí ở cuối mục.',
    },
    {
      t: 'table',
      caption: 'Dàn ý bài văn 「{子|こ}どもの{頃|ころ}の{思|おも}い{出|で}」 — 4 đoạn',
      head: ['Đoạn', 'Nội dung', 'Mẫu nên dùng', 'Câu mở gợi ý'],
      rows: [
        ['1 · bối cảnh', 'Lớn lên ở đâu, gia đình thế nào', '～で{育|そだ}ちました · ～は{厳|きび}しい／{優|やさ}しい{人|ひと}でした', '{私|わたし}は{小|ちい}さい{頃|ころ}、～で{育|そだ}ちました。'],
        ['2 · bắt & cho', 'Bố mẹ bắt / cho / không cho làm gì', '～させました · ～させてくれました · ～させてもらえませんでした · ～させられました', '{母|はは}は{私|わたし}に{毎日|まいにち}～させました。'],
        ['3 · một kỷ niệm', 'Một chuyện cụ thể + lời bố mẹ dặn', '「～なさい」と{言|い}われました · ～ように{言|い}われました · ～てしまいました', 'ある{日|ひ}、～。そのとき、{父|ちち}に～と{言|い}われました。'],
        ['4 · bây giờ', 'Bây giờ mình nghĩ sao + mong muốn', '{今|いま}は～と{思|おも}います · {子|こ}どもに～させたいです', 'その{頃|ころ}は{嫌|いや}でしたが、{今|いま}は～。'],
      ],
    },
    {
      t: 'note',
      title: 'Từ nối nên dùng',
      items: [
        '**{小|ちい}さい{頃|ころ}／{子|こ}どもの{頃|ころ}** (hồi nhỏ) · **その{頃|ころ}は** (hồi đó thì) · **ある{日|ひ}** (một hôm) · **そのとき** (lúc đó) · **それから** (sau đó) · **でも** (nhưng) · **{今|いま}は** (bây giờ thì) · **{将来|しょうらい}** (sau này).',
        'Đối chiếu quá khứ ↔ hiện tại: **その{頃|ころ}は～でしたが、{今|いま}は～** — câu "đinh" của mọi bài văn kể kỷ niệm, giám khảo rất thích.',
        'Kết bài: **～と{思|おも}います** (ý kiến) · **～たいです** (mong muốn) · **{両親|りょうしん}に{感謝|かんしゃ}しています** (biết ơn bố mẹ).',
      ],
    },
    {
      t: 'passage',
      title: 'Bài mẫu — {子|こ}どもの{頃|ころ}の{思|おも}い{出|で}（{約|やく}200{字|じ}）',
      intro: 'Đọc to bài mẫu, gạch chân các mẫu ～させました／～させてくれませんでした／～ように言われました／～られるようになりました.',
      paras: [
        { text: '{私|わたし}は{小|ちい}さい{頃|ころ}、ハノイで{育|そだ}ちました。{両親|りょうしん}は{二人|ふたり}とも{働|はたら}いていたので、{学校|がっこう}のあとはいつも{祖母|そぼ}の{家|いえ}で{過|す}ごしました。' },
        { text: '{祖母|そぼ}は{優|やさ}しい{人|ひと}でしたが、ご{飯|はん}のことには{厳|きび}しくて、{野菜|やさい}を{残|のこ}すと、{全部|ぜんぶ}{食|た}べるまで{遊|あそ}ばせてくれませんでした。また、{毎日|まいにち}{私|わたし}に{家|いえ}の{前|まえ}の{道|みち}を{掃除|そうじ}させました。' },
        { text: 'その{頃|ころ}は{嫌|いや}でしたが、{今|いま}は{何|なん}でも{食|た}べられるようになりました。{日本|にほん}で{一人|ひとり}で{生活|せいかつ}していて、{祖母|そぼ}が{教|おし}えてくれたことがとても{役|やく}に{立|た}っています。{将来|しょうらい}、{自分|じぶん}の{子|こ}どもにも、{好|す}き{嫌|きら}いをしないように{言|い}いたいです。' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{件名|けんめい}：{金曜日|きんようび}のシフトについて', 'Kenmei: Kin\'youbi no shifuto ni tsuite', 'Tiêu đề: Về ca làm thứ Sáu'),
        E('{小林店長|こばやしてんちょう}、お{疲|つか}れさまです。リンです。', 'Kobayashi tenchou, otsukaresama desu. Rin desu.', 'Anh Kobayashi, anh vất vả rồi ạ. Em là Linh.'),
        E('{実|じつ}は、{来週|らいしゅう}の{金曜日|きんようび}に{学校|がっこう}の{試験|しけん}があるので、その{日|ひ}は{休|やす}ませていただけませんか。', 'Jitsu wa, raishuu no kin\'youbi ni gakkou no shiken ga aru node, sono hi wa yasumasete itadakemasen ka.', 'Chuyện là thứ Sáu tuần sau trường em có bài thi, nên hôm đó anh cho em nghỉ được không ạ?'),
        E('その{代|か}わり、{土曜日|どようび}の{朝|あさ}のシフトは{私|わたし}にやらせてください。', 'Sono kawari, doyoubi no asa no shifuto wa watashi ni yarasete kudasai.', 'Bù lại, ca sáng thứ Bảy anh để em làm ạ.'),
        E('ナタポンさんに、{休|やす}むときは{早|はや}めに{連絡|れんらく}するように{言|い}われたので、{今日|きょう}ご{連絡|れんらく}しました。', 'Natapon-san ni, yasumu toki wa hayame ni renraku suru you ni iwareta node, kyou gorenraku shimashita.', 'Anh Nattapon dặn em là khi nghỉ thì phải báo sớm, nên hôm nay em báo anh ạ.'),
        E('お{忙|いそが}しいところすみませんが、よろしくお{願|ねが}いいたします。', 'Oisogashii tokoro sumimasen ga, yoroshiku onegai itashimasu.', 'Xin lỗi đã làm phiền lúc anh bận, mong anh giúp em. (câu kết email lịch sự)'),
      ],
    },
    {
      t: 'quiz',
      id: 'b23-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (6 câu)',
      kind: 'translate',
      grammar: '～で育ちました · ～させました · ～させてくれました · ～させてもらえませんでした · ～ように言われました · その頃は～が、今は～',
      items: [
        { q: 'Tôi lớn lên ở một thị trấn nhỏ gần biển.', answers: V('{私|わたし}は{海|うみ}の{近|ちか}くの{小|ちい}さい{町|まち}で{育|そだ}ちました。', '{海|うみ}の{近|ちか}くの{小|ちい}さい{町|まち}で{育|そだ}ちました。'), hint: 'まちで そだちました' },
        { q: 'Mẹ tôi bắt tôi học tiếng Anh mỗi ngày.', answers: V('{母|はは}は{私|わたし}に{毎日|まいにち}{英語|えいご}を{勉強|べんきょう}させました。', '{母|はは}は{毎日|まいにち}{私|わたし}に{英語|えいご}を{勉強|べんきょう}させました。'), hint: 'わたしに … べんきょうさせました' },
        { q: 'Bố cho tôi nuôi một con mèo.', answers: V('{父|ちち}は{猫|ねこ}を{飼|か}わせてくれました。', '{父|ちち}は{私|わたし}に{猫|ねこ}を{飼|か}わせてくれました。'), hint: 'かわせて くれました' },
        { q: 'Tôi không được cho đi chơi buổi tối.', answers: V('{夜|よる}は{遊|あそ}びに{行|い}かせてもらえませんでした。', '{夜|よる}は{出|で}かけさせてもらえませんでした。'), hint: 'いかせて もらえませんでした' },
        { q: 'Tôi hay bị bà dặn đừng để thừa cơm.', answers: V('{祖母|そぼ}によくご{飯|はん}を{残|のこ}さないように{言|い}われました。', 'よく{祖母|そぼ}にご{飯|はん}を{残|のこ}さないように{言|い}われました。'), hint: 'のこさない ように いわれました' },
        { q: 'Hồi đó tôi ghét lắm, nhưng bây giờ tôi biết ơn.', answers: V('その{頃|ころ}は{嫌|いや}でしたが、{今|いま}は{感謝|かんしゃ}しています。', 'その{頃|ころ}はとても{嫌|いや}でしたが、{今|いま}は{感謝|かんしゃ}しています。'), hint: 'そのころは … が、いまは …' },
      ],
    },
    {
      t: 'passage',
      title: 'Bài mẫu 2 — {習|なら}い{事|ごと}の{思|おも}い{出|で}（{約|やく}200{字|じ}）',
      intro: 'Một bài khác cùng đề — chú ý cặp ～させられました (lúc đó: bị bắt) → ～させてくれた (bây giờ: hiểu là được cho) và câu trích lệnh 「～」と言われました.',
      paras: [
        { text: '{私|わたし}は{七歳|ななさい}から{十二歳|じゅうにさい}まで、{書道|しょどう}を{習|なら}っていました。{母|はは}が{字|じ}のきれいな{人|ひと}になってほしいと{思|おも}って、{習|なら}わせたのです。' },
        { text: '{教室|きょうしつ}の{先生|せんせい}はとても{厳|きび}しくて、{同|おな}じ{字|じ}を{何十回|なんじっかい}も{書|か}かされました。{遊|あそ}びたいとき、「{集中|しゅうちゅう}しなさい」と{言|い}われて、{泣|な}いたこともあります。' },
        { text: 'でも、{今|いま}は{日本語|にほんご}の{漢字|かんじ}をきれいに{書|か}けるので、{先生|せんせい}によく{褒|ほ}められます。{母|はは}が{続|つづ}けさせてくれたおかげだと{思|おも}います。{将来|しょうらい}、{子|こ}どもにも{何|なに}か{一|ひと}つ、{長|なが}く{続|つづ}けることをさせたいです。' },
      ],
    },
    {
      t: 'note',
      title: 'Đề luyện thêm — chọn 1 trong 3 (cùng khuôn 4 đoạn)',
      items: [
        '**{両親|りょうしん}が{私|わたし}にさせたこと** — bố mẹ đã bắt / cho bạn làm gì, việc nào bạn thấy có ích nhất bây giờ.',
        '**{忘|わす}れられない{先生|せんせい}** — một thầy cô hồi nhỏ: thầy bắt làm gì, hay dặn gì (～ように{言|い}われました), câu nào bạn còn nhớ (「～」と{言|い}われました).',
        '**{子|こ}どもにさせたいこと・させたくないこと** — sau này bạn muốn cho con làm gì / không cho làm gì, vì sao (～させたいです／～させたくないです + ～から).',
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Đủ 4 đoạn, 150–200 chữ** (đếm cả kana; dưới 120 chữ → 0 điểm tiêu chí này).',
        '**② Có ít nhất 3 câu sai khiến đúng** (～させました／～させてくれました／～させてもらえませんでした), trợ từ **に／を** đúng.',
        '**③ Có ít nhất 1 câu kể lại lời dặn** (～ように{言|い}われました hoặc 「～なさい」と{言|い}われました) và không dùng thể mệnh lệnh ngoài 「」.',
        '**④ Có câu đối chiếu** その{頃|ころ}は～が、{今|いま}は～ và câu kết ～と{思|おも}います／～たいです.',
        '**⑤ Không lỗi chia**: không ~~{帰|かえ}らさせ~~, ~~{休|やす}まさせ~~, ~~{来|く}させ~~; thể です／ます thống nhất; chữ Hán của bài viết đúng (子供・厳しい・許可・飼う…).',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b23-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 23 — dịch, trắc nghiệm, ghép câu, đổi câu (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 23: dịch Việt → Nhật có thể sai khiến (bắt / cho / gây cảm xúc), ～させてくれる・もらう, ～させてください・いただけませんか, thể mệnh lệnh, ～な, ～なさい, ～ように言う・言われる; chọn đúng trợ từ を／に, đúng dạng chia (không さ thừa), đúng mức lịch sự; ghép câu đúng thứ tự; đổi câu trực tiếp ↔ gián tiếp và câu thường → sai khiến / sai khiến bị động.',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm lần lượt I → IV, không nhìn mục Ngữ pháp. Câu gõ tay nhận cả chữ Hán lẫn kana, có hoặc không dấu câu.',
        'Sai câu nào: đọc lại đúng mẫu (① chia sai khiến · ② を／に · ③ cho phép / cảm xúc · ④ xin được làm · ⑤–⑦ mệnh lệnh, cấm, なさい · ⑧ ように{言|い}う · ⑨ させられる) rồi làm lại câu đó sau 1 ngày.',
        'Mục tiêu: ≥ 40/46 câu. Dưới 30 → làm lại 3 buổi trên lớp (② Theo buổi) trước khi sang Bài 24.',
      ],
    },
    {
      t: 'quiz',
      id: 'b23-bt-dich',
      title: 'I. Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: '～させる (を／に) · ～させてくれる／もらう · B を～させる (cảm xúc) · ～させてください／いただけませんか · mệnh lệnh · ～な · ～なさい · ～ように言う／言われる · ～させられる',
      items: [
        { q: 'Thầy bắt học sinh đọc to bài văn.', answers: V('{先生|せんせい}は{学生|がくせい}に{作文|さくぶん}を{読|よ}ませました。', '{先生|せんせい}は{学生|がくせい}に{作文|さくぶん}を{声|こえ}に{出|だ}して{読|よ}ませました。', '{先生|せんせい}は{学生|がくせい}に{大|おお}きい{声|こえ}で{作文|さくぶん}を{読|よ}ませました。'), hint: 'がくせいに … よませました' },
        { q: 'Mẹ cho em gái đi học thêm.', answers: V('{母|はは}は{妹|いもうと}を{塾|じゅく}に{行|い}かせました。', '{母|はは}は{妹|いもうと}を{塾|じゅく}に{通|かよ}わせています。', '{母|はは}は{妹|いもうと}を{塾|じゅく}に{行|い}かせています。'), hint: 'いもうとを じゅくに いかせました' },
        { q: 'Bố đã cho tôi đi du học Nhật.', answers: V('{父|ちち}は{私|わたし}を{日本|にほん}へ{留学|りゅうがく}させてくれました。', '{父|ちち}は{私|わたし}を{日本|にほん}に{留学|りゅうがく}させてくれました。'), hint: 'りゅうがく させて くれました' },
        { q: 'Hồi nhỏ tôi không được cho xem ti vi.', answers: V('{子|こ}どもの{頃|ころ}、テレビを{見|み}させてもらえませんでした。', '{子|こ}どもの{頃|ころ}は、テレビを{見|み}させてもらえませんでした。'), hint: 'みさせて もらえませんでした' },
        { q: 'Tôi đã làm bố mẹ lo lắng.', answers: V('{両親|りょうしん}を{心配|しんぱい}させてしまいました。', '{両親|りょうしん}を{心配|しんぱい}させました。', '{親|おや}を{心配|しんぱい}させました。'), hint: 'りょうしんを しんぱいさせました' },
        { q: 'Xin lỗi đã để anh chờ lâu.', answers: V('{長|なが}い{時間|じかん}{待|ま}たせてすみません。', '{長|なが}い{間|あいだ}お{待|ま}たせしてすみません。', '{長|なが}い{時間|じかん}{待|ま}たせてしまってすみません。'), hint: 'またせて すみません' },
        { q: 'Hôm nay tôi đau đầu, cho tôi về sớm ạ.', answers: V('{今日|きょう}は{頭|あたま}が{痛|いた}いので、{早|はや}く{帰|かえ}らせてください。', '{頭|あたま}が{痛|いた}いので、{今日|きょう}は{早|はや}く{帰|かえ}らせてください。'), hint: 'かえらせて ください' },
        { q: 'Thưa thầy, cho em dùng phòng này được không ạ? (lịch sự nhất)', answers: V('{先生|せんせい}、この{部屋|へや}を{使|つか}わせていただけませんか。', '{先生|せんせい}、この{部屋|へや}を{使|つか}わせていただけないでしょうか。'), hint: 'つかわせて いただけませんか' },
        { q: 'Việc này để tôi làm.', answers: V('この{仕事|しごと}は{私|わたし}にやらせてください。', 'これは{私|わたし}にやらせてください。', 'この{仕事|しごと}、{私|わたし}にやらせてください。'), hint: 'わたしに やらせて ください' },
        { q: '(Huấn luyện viên) Chạy nữa đi! Đừng dừng lại!', answers: V('もっと{走|はし}れ！{止|と}まるな！'), hint: 'はしれ · とまるな' },
        { q: '(Mẹ nói với con) Dọn phòng đi.', answers: V('{部屋|へや}を{片付|かたづ}けなさい。', '{部屋|へや}を{掃除|そうじ}しなさい。'), hint: 'かたづけなさい' },
        { q: 'Thầy dặn chúng tôi đừng dùng từ điển.', answers: V('{先生|せんせい}は{私|わたし}たちに{辞書|じしょ}を{使|つか}わないように{言|い}いました。', '{先生|せんせい}は{辞書|じしょ}を{使|つか}わないように{言|い}いました。'), hint: 'つかわない ように いいました' },
        { q: 'Tôi được trưởng phòng dặn nộp báo cáo trước thứ Sáu.', answers: V('{部長|ぶちょう}に{報告書|ほうこくしょ}を{金曜日|きんようび}までに{出|だ}すように{言|い}われました。', '{部長|ぶちょう}に、{金曜日|きんようび}までに{報告書|ほうこくしょ}を{出|だ}すように{言|い}われました。'), hint: 'だす ように いわれました' },
        { q: 'Hồi nhỏ ngày nào tôi cũng bị mẹ bắt tập piano.', answers: V('{子|こ}どもの{頃|ころ}、{毎日|まいにち}{母|はは}にピアノを{練習|れんしゅう}させられました。', '{子|こ}どもの{頃|ころ}、{母|はは}に{毎日|まいにち}ピアノを{練習|れんしゅう}させられました。'), hint: 'ははに … れんしゅう させられました' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-bt-chon',
      title: 'II. Chọn đáp án đúng (14 câu)',
      items: [
        { q: '{先生|せんせい}は{学生|がくせい}（　）{教室|きょうしつ}を{掃除|そうじ}させました。', options: ['を', 'に', 'が', 'で'], correct: 1, why: 'Đã có **{教室|きょうしつ}を** → người làm đi với **に**. 〔Gakusei ni kyoushitsu o souji sasemashita.〕' },
        { q: '{母|はは}は{熱|ねつ}がある{弟|おとうと}（　）{家|いえ}で{休|やす}ませました。', options: ['を', 'で', 'へ', 'と'], correct: 0, why: '{休|やす}む (nghỉ ngơi) là tự động từ, câu không có N を khác → người làm đi với **を**. ⚠ Nếu câu là {学校|がっこう}**を**{休|やす}む (nghỉ học) thì đã có を → {弟|おとうと}**に**{学校|がっこう}を{休|やす}ませた (không dùng hai を). 〔Otouto o ie de yasumasemashita.〕' },
        { q: '「{言|い}う」の{使役形|しえきけい}は？', options: ['{言|い}あせる', '{言|い}わせる', '{言|い}させる', '{言|い}えさせる'], correct: 1, why: 'う → **わ** + せる: **{言|い}わせる**. 〔iwaseru〕' },
        { q: '「{来|く}る」の{使役形|しえきけい}は？', options: ['{来|き}させる', '{来|く}させる', '{来|こ}させる', '{来|こ}られる'], correct: 2, why: '**{来|こ}させる** (こさせる). {来|こ}られる là khả năng / bị động. 〔kosaseru〕' },
        { q: 'すみません、{明日|あした}{休|やす}（　）いただけませんか。', options: ['ませて', 'まさせて', 'んで', 'まれて'], correct: 0, why: 'Nhóm 1: **{休|やす}ませて** — không có さ thừa. {休|やす}んでいただけませんか = nhờ NGƯỜI KHÁC nghỉ (sai nghĩa). 〔Yasumasete itadakemasen ka.〕' },
        { q: '{子|こ}どもの{頃|ころ}、{両親|りょうしん}は{私|わたし}に{好|す}きなことを{自由|じゆう}に（　）。', options: ['させてくれました', 'させられました', 'してくれました', 'させてもらいました'], correct: 0, why: 'Chủ ngữ {両親|りょうしん} (người cho), {私|わたし}に (người được cho) → **させてくれました**. させてもらう phải có chủ ngữ là {私|わたし}. 〔Jiyuu ni sasete kuremashita.〕' },
        { q: '{遅|おく}れてごめんなさい。（　）。', options: ['お{待|ま}ちしました', 'お{待|ま}たせしました', '{待|ま}たされました', '{待|ま}ってください'], correct: 1, why: 'Mình làm người khác chờ → **お{待|ま}たせしました**. 〔Omatase shimashita.〕' },
        { q: '{試合|しあい}で{友達|ともだち}を{応援|おうえん}するとき、{何|なん}と{言|い}いますか。', options: ['{頑張|がんば}れ！', '{頑張|がんば}るな！', '{頑張|がんば}らせて！', '{頑張|がんば}られた！'], correct: 0, why: 'Cổ vũ = mệnh lệnh **{頑張|がんば}れ！** (hoặc {頑張|がんば}って！). 〔Ganbare!〕' },
        { q: '「{見|み}る」の{命令形|めいれいけい}は？', options: ['{見|み}れ', '{見|み}ろ', '{見|み}え', '{見|み}よう'], correct: 1, why: 'Nhóm 2: る → **ろ**: **{見|み}ろ**. {見|み}よう là thể ý chí (Bài 16). 〔miro〕' },
        { q: '「する」の{命令形|めいれいけい}は？', options: ['すれ', 'しろ', 'しな', 'させ'], correct: 1, why: 'Nhóm 3: **しろ** (văn viết: せよ). 〔shiro〕' },
        { q: '{電車|でんしゃ}の{中|なか}で{大声|おおごえ}を（　）！', options: ['{出|だ}すな', '{出|だ}しな', '{出|だ}せな', '{出|だ}さな'], correct: 0, why: 'Cấm = thể từ điển + な: **{出|だ}すな**. {出|だ}しな = "đưa ra đi" (ngược nghĩa). 〔Oogoe o dasu na!〕' },
        { q: '（{先生|せんせい}が{学生|がくせい}に）「{次|つぎ}の{質問|しつもん}に（　）。」', options: ['{答|こた}えなさい', '{答|こた}えるなさい', '{答|こた}えろなさい', '{答|こた}えてなさい'], correct: 0, why: 'Vます bỏ ます + なさい: **{答|こた}えなさい**. 〔Kotaenasai.〕' },
        { q: '{医者|いしゃ}は{父|ちち}にたばこを（　）ように{言|い}いました。', options: ['{吸|す}わない', '{吸|す}いません', '{吸|す}うな', '{吸|す}わなくて'], correct: 0, why: 'Trước ように là **Vない**: **{吸|す}わないように{言|い}いました**. 〔Suwanai you ni iimashita.〕' },
        { q: '{子|こ}どもの{頃|ころ}、{兄|あに}によく{重|おも}い{荷物|にもつ}を（　）。', options: ['{持|も}たされました', '{持|も}たせました', '{持|も}たれました', '{持|も}ってくれました'], correct: 0, why: 'Tôi BỊ anh bắt xách (than) → sai khiến bị động **{持|も}たされました** (= {持|も}たせられました). 〔Omoi nimotsu o motasaremashita.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b23-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Bố bắt anh trai rửa xe.', chips: ['{父|ちち}は', '{兄|あに}に', '{車|くるま}を', '{洗|あら}わせました', '{兄|あに}を', '{洗|あら}われました'], answer: ['{父|ちち}は', '{兄|あに}に', '{車|くるま}を', '{洗|あら}わせました'], ro: 'Chichi wa ani ni kuruma o arawasemashita.' },
        { vi: 'Hồi nhỏ, bố mẹ cho tôi nuôi chó.', chips: ['{子|こ}どもの{頃|ころ}', '{両親|りょうしん}は', '{犬|いぬ}を', '{飼|か}わせて', 'くれました', 'もらえませんでした'], answer: ['{子|こ}どもの{頃|ころ}', '{両親|りょうしん}は', '{犬|いぬ}を', '{飼|か}わせて', 'くれました'], ro: 'Kodomo no koro ryoushin wa inu o kawasete kuremashita.' },
        { vi: 'Em trai tôi lúc nào cũng làm mọi người cười.', chips: ['{弟|おとうと}は', 'いつも', 'みんなを', '{笑|わら}わせます', 'みんなに', '{笑|わら}われます'], answer: ['{弟|おとうと}は', 'いつも', 'みんなを', '{笑|わら}わせます'], ro: 'Otouto wa itsumo minna o warawasemasu.' },
        { vi: 'Thưa trưởng phòng, cho em trình bày ở cuộc họp được không ạ?', chips: ['{部長|ぶちょう}、', '{会議|かいぎ}で', '{発表|はっぴょう}', 'させて', 'いただけませんか', 'して'], answer: ['{部長|ぶちょう}、', '{会議|かいぎ}で', '{発表|はっぴょう}', 'させて', 'いただけませんか'], ro: 'Buchou, kaigi de happyou sasete itadakemasen ka.' },
        { vi: 'Cháy rồi! Chạy mau!', chips: ['{火事|かじ}だ！', '{早|はや}く', '{逃|に}げろ！', '{逃|に}げるな！', '{逃|に}がせ！'], answer: ['{火事|かじ}だ！', '{早|はや}く', '{逃|に}げろ！'], ro: 'Kaji da! Hayaku nigero!' },
        { vi: 'Rửa tay trước bữa ăn đi.', chips: ['ご{飯|はん}の', '{前|まえ}に', '{手|て}を', '{洗|あら}いなさい', '{洗|あら}うなさい'], answer: ['ご{飯|はん}の', '{前|まえ}に', '{手|て}を', '{洗|あら}いなさい'], ro: 'Gohan no mae ni te o arainasai.' },
        { vi: 'Tôi nhờ bạn cho mượn vở.', chips: ['{友達|ともだち}に', 'ノートを', '{貸|か}して', 'くれる', 'ように', '{頼|たの}みました', 'ために'], answer: ['{友達|ともだち}に', 'ノートを', '{貸|か}して', 'くれる', 'ように', '{頼|たの}みました'], ro: 'Tomodachi ni nooto o kashite kureru you ni tanomimashita.' },
        { vi: 'Ở ga tôi bị bạn bắt chờ một tiếng.', chips: ['{駅|えき}で', '{友達|ともだち}に', '{一時間|いちじかん}', '{待|ま}たされました', '{待|ま}たせました', '{友達|ともだち}を'], answer: ['{駅|えき}で', '{友達|ともだち}に', '{一時間|いちじかん}', '{待|ま}たされました'], ro: 'Eki de tomodachi ni ichijikan matasaremashita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b23-bt-doi',
      title: 'IV. Đổi câu theo mẫu (10 câu)',
      kind: 'fill',
      grammar: 'Đổi câu gốc sang dạng trong ngoặc — giữ nguyên nghĩa còn lại',
      items: [
        { q: '{弟|おとうと}が{野菜|やさい}を{食|た}べました。→ (mẹ bắt: {母|はは}は…)', answers: V('{母|はは}は{弟|おとうと}に{野菜|やさい}を{食|た}べさせました。'), hint: 'おとうとに … たべさせました' },
        { q: '{学生|がくせい}が{立|た}ちました。→ (thầy bắt: {先生|せんせい}は…)', answers: V('{先生|せんせい}は{学生|がくせい}を{立|た}たせました。'), hint: 'がくせいを たたせました' },
        { q: '{私|わたし}は{留学|りゅうがく}しました。→ (bố cho, biết ơn: {父|ちち}は…)', answers: V('{父|ちち}は{私|わたし}を{留学|りゅうがく}させてくれました。'), hint: 'りゅうがくさせて くれました' },
        { q: '{帰|かえ}ってもいいですか。→ (xin lịch sự nhất: ～させていただけませんか)', answers: V('{帰|かえ}らせていただけませんか。'), hint: 'かえらせて いただけませんか' },
        { q: '{写真|しゃしん}を{撮|と}ってもいいですか。→ (～させてください)', answers: V('{写真|しゃしん}を{撮|と}らせてください。'), hint: 'とらせて ください' },
        { q: '「{早|はや}く{寝|ね}なさい」と{母|はは}に{言|い}われました。→ (～ように)', answers: V('{母|はは}に{早|はや}く{寝|ね}るように{言|い}われました。', '{早|はや}く{寝|ね}るように{母|はは}に{言|い}われました。'), hint: 'ねる ように いわれました' },
        { q: '「ここに{入|はい}るな」と{言|い}われました。→ (～ように)', answers: V('ここに{入|はい}らないように{言|い}われました。'), hint: 'はいらない ように' },
        { q: '「{手伝|てつだ}ってください」と{友達|ともだち}に{頼|たの}まれました。→ (～ように)', answers: V('{友達|ともだち}に{手伝|てつだ}うように{頼|たの}まれました。'), hint: 'てつだう ように たのまれました' },
        { q: '{手|て}を{洗|あら}ってください。→ (mẹ nói với con: ～なさい)', answers: V('{手|て}を{洗|あら}いなさい。'), hint: 'あらいなさい' },
        { q: '{母|はは}は{私|わたし}に{毎日|まいにち}{勉強|べんきょう}させました。→ (tôi bị bắt: {私|わたし}は{母|はは}に…)', answers: V('{私|わたし}は{母|はは}に{毎日|まいにち}{勉強|べんきょう}させられました。', '{私|わたし}は{毎日|まいにち}{母|はは}に{勉強|べんきょう}させられました。'), hint: 'べんきょう させられました' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b23-buoi-1-shieki',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 23: từ mới thời thơ ấu & việc nhà · chia thể sai khiến · bắt làm (を／に) · cho làm, gây cảm xúc, ～させてくれる · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng thể ない (Bài 10) và bị động (Bài 22), học từ thời thơ ấu – gia đình và việc nhà – việc của trẻ, chia thể sai khiến đủ 3 nhóm, nói "A bắt B làm" với đúng trợ từ を／に, "A cho B làm" bằng ～させてくれる／～させてもらう và "làm ai lo, chờ, cười" bằng B を～させる, đóng vai hội thoại ① (xem ảnh hồi nhỏ), rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn thể ない ({行|い}かない, {飲|の}まない, {言|い}わない) và bị động Bài 22 ({言|い}われる). Câu hỏi mở đầu: "Hồi nhỏ bố mẹ có BẮT các em làm gì không? Nói «bắt» bằng tiếng Nhật thế nào?"',
        '**Từ mới (10′)** — nhóm A (thời thơ ấu & gia đình: {頃|ころ}, {幼|おさな}い, {幼稚園|ようちえん}, {大人|おとな}, {育|そだ}てる・{育|そだ}つ, {親|おや}, {厳|きび}しい, {甘|あま}やかす, {懐|なつ}かしい, おもちゃ) + nhóm B (việc nhà & việc của trẻ: お{使|つか}い, {留守番|るすばん}, {習|なら}い{事|ごと}, {塾|じゅく}, {世話|せわ}, {皿洗|さらあら}い, {干|ほ}す, {畳|たた}む, {着替|きが}える, {虫|むし}).',
        '**Ngữ pháp (20′)** — ① chia thể sai khiến · ② A は B を／に ～させる (bắt) · ③ cho làm, B を～させる (cảm xúc), ～させてくれる／～させてもらう.',
        '**Hội thoại (10′)** — ① マリヤム xem ảnh hồi nhỏ với ダニエル.',
        '**チャレンジ (5′)** — luyện cặp: A hỏi 「{子|こ}どもの{頃|ころ}、ご{両親|りょうしん}は{何|なに}をさせましたか」 ↔ B trả lời 2 ý. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b23-b1-slides',
      title: 'Bài 23 子どもの頃 — Buổi 1: thể sai khiến ～させる',
      slides: [
        {
          tieuDe: '{第23課|だいにじゅうさんか} {子|こ}どもの{頃|ころ}',
          anh: ['child', 'framed-picture', 'teddy-bear'],
          nhan: ['{子|こ}ども', '{写真|しゃしん}', 'おもちゃ'],
          dong: ['Hôm nay: **thể sai khiến ～させる** — "bắt / cho ai làm"'],
          ro: ['~saseru'],
          ghi: 'Bài 23 là bài "hồi nhỏ": bố mẹ BẮT mình làm gì, CHO mình làm gì (～させる), mình XIN được làm gì (～させてください), người lớn RA LỆNH thế nào (走れ・～なさい), và kể lại LỜI DẶN (～ように言われた). Hôm nay học phần nền: thể sai khiến.',
        },
        {
          tieuDe: 'できること — Học xong Bài 23 làm được gì?',
          anh: ['framed-picture', 'soccer-ball', 'man-cook'],
          nhan: ['23-1 させる', '23-2 させてください・命令形', '23-3 ように言う'],
          dong: ['① Kể bố mẹ bắt / cho mình làm gì (～させました・～させてくれました).', '② Xin được làm (～させていただけませんか), hiểu mệnh lệnh ({走|はし}れ！{止|と}まるな！).', '③ Kể lại lời dặn (～ように{言|い}われました).'],
          ro: ['~sasemashita · ~sasete kuremashita', '~sasete itadakemasen ka · hashire! tomaru na!', '~you ni iwaremashita'],
          ghi: 'Ba buổi đi đúng ba phần này. Cuối Bài 23 bạn nói được 1 phút "Hồi nhỏ của tôi".',
        },
        {
          tieuDe: 'Khởi động — thể ない & bị động',
          anh: ['person-gesturing-no', 'speech-balloon'],
          nhan: ['ない', '{言|い}われる'],
          dong: ['{行|い}く → {行|い}**か**ない ・ {言|い}う → {言|い}**わ**ない', '{母|はは}に「{早|はや}く{寝|ね}なさい」と{言|い}われました。'],
          ro: ['iku → ikanai · iu → iwanai', 'Haha ni "Hayaku nenasai" to iwaremashita.'],
          hoi: 'Thể ない của {待|ま}つ, {話|はな}す là gì?',
          dap: '{待|ま}**た**ない, {話|はな}**さ**ない — âm hàng あ. Hôm nay thể sai khiến dùng ĐÚNG âm này: {待|ま}たせる, {話|はな}させる.',
          ghi: 'Viết lên góc bảng: 行か・言わ・待た・話さ — "con đường hàng あ" của nhóm 1. Thể sai khiến chỉ cần thêm せる vào đó.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Thời thơ ấu & gia đình',
          anh: ['baby', 'school', 'man', 'old-woman'],
          nhan: ['{幼|おさな}い', '{幼稚園|ようちえん}', '{大人|おとな}', '{育|そだ}てる'],
          dong: ['{子|こ}どもの{頃|ころ}、{田舎|いなか}で{育|そだ}ちました。', '{父|ちち}は{厳|きび}しかったです。'],
          ro: ['Kodomo no koro, inaka de sodachimashita.', 'Chichi wa kibishikatta desu.'],
          hoi: '{子|こ}どもの「ころ」と 3{時|じ}「ごろ」 khác nhau thế nào?',
          dap: '{頃|ころ} = thuở, hồi (sau N の, イA, Vた); ごろ = khoảng (sau số).',
          ghi: 'Thêm: {親|おや} (bố mẹ nói chung), {甘|あま}やかす (nuông chiều), {懐|なつ}かしい (bồi hồi nhớ thứ cũ), おもちゃ. Cặp {育|そだ}つ (tự — が) ↔ {育|そだ}てる (tha — を).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Việc nhà & việc của trẻ',
          anh: ['shopping-bags', 'house', 'musical-keyboard', 'dog'],
          nhan: ['お{使|つか}い', '{留守番|るすばん}', '{習|なら}い{事|ごと}', '{飼|か}う'],
          dong: ['{一人|ひとり}で{留守番|るすばん}をしました。', '{犬|いぬ}を{飼|か}っていました。'],
          ro: ['Hitori de rusuban o shimashita.', 'Inu o katte imashita.'],
          hoi: '{犬|いぬ}を「かう」 (ôn Bài 22) — viết chữ Hán nào? Vì sao phải cẩn thận?',
          dap: '**{飼|か}う** (nuôi). {買|か}う (mua) cùng âm — {犬|いぬ}を{買|か}う là "mua chó".',
          ghi: 'Thêm: {塾|じゅく} (học thêm luyện thi), {世話|せわ}をする (chăm sóc), {洗濯物|せんたくもの}を{干|ほ}す／{畳|たた}む (phơi / gấp đồ), {着替|きが}える (thay đồ), {虫|むし} (côn trùng).',
        },
        {
          tieuDe: '① Thể sai khiến — nhóm 1',
          anh: ['writing-hand', 'person-walking'],
          nhan: ['{書|か}かせる', '{行|い}かせる'],
          dong: ['{書|か}く → {書|か}**かせる** ・ {行|い}く → {行|い}**かせる**', '{言|い}う → {言|い}**わせる** ・ {待|ま}つ → {待|ま}**たせる**'],
          ro: ['kaku → kakaseru · iku → ikaseru', 'iu → iwaseru · matsu → mataseru'],
          bang: { head: ['う段', '→ あ段 ＋ せる'], rows: [['く・ぐ・す', 'かせる・がせる・させる'], ['つ・ぶ・む', 'たせる・ばせる・ませる'], ['る・う', 'らせる・わせる']] },
          hoi: '{帰|かえ}る → ? ／ {休|やす}む → ?',
          dap: '{帰|かえ}**ら**せる (nhóm 1 ngoại lệ); {休|やす}**ま**せる — không ~~{休|やす}まさせる~~.',
          ghi: 'Mẹo: lấy thể ない bỏ ない, thêm せる: {行|い}か(ない) → {行|い}かせる. Nhóm 1 không bao giờ có "さ" chen giữa (trừ đuôi す: {話|はな}さ・せる — さ ở đây là âm của す).',
        },
        {
          tieuDe: '① Thể sai khiến — nhóm 2 & 3',
          anh: ['bento-box', 'books'],
          nhan: ['{食|た}べさせる', '{勉強|べんきょう}させる'],
          dong: ['{食|た}べる → {食|た}べ**させる** ・ {見|み}る → {見|み}**させる**', 'する → **させる** ・ {来|く}る → **{来|こ}させる**'],
          ro: ['taberu → tabesaseru · miru → misaseru', 'suru → saseru · kuru → kosaseru'],
          hoi: 'Thể sai khiến chia tiếp thế nào? ({行|い}かせる → thể ます, thể て, thể た)',
          dap: 'Như động từ nhóm 2: {行|い}かせます, {行|い}かせて, {行|い}かせた, {行|い}かせない.',
          ghi: '⚠ {見|み}せる (cho xem), {知|し}らせる (báo), {寝|ね}かせる (ru ngủ), {任|まか}せる (giao phó) là TỪ RIÊNG — đừng nhầm với sai khiến.',
        },
        {
          tieuDe: '② BẮT làm — tự động từ: B を',
          anh: ['man-teacher', 'person-standing'],
          nhan: ['{先生|せんせい}', '{立|た}つ'],
          dong: ['{先生|せんせい}は{学生|がくせい}**を**{立|た}たせました。', '{母|はは}は{私|わたし}**を**{塾|じゅく}に{行|い}かせました。'],
          ro: ['Sensei wa gakusei o tatasemashita.', 'Haha wa watashi o juku ni ikasemashita.'],
          hoi: 'Trong câu {先生|せんせい}は{学生|がくせい}を{立|た}たせました, AI đứng?',
          dap: '{学生|がくせい} đứng (người đi với を). {先生|せんせい} là người muốn / ra lệnh.',
          ghi: 'Tự động từ = không có N を: {行|い}く, {来|く}る, {帰|かえ}る, {走|はし}る, {立|た}つ, {座|すわ}る, {休|やす}む, {留学|りゅうがく}する… → người làm đi với を.',
        },
        {
          tieuDe: '② BẮT làm — tha động từ: B に N を',
          anh: ['woman', 'broccoli'],
          nhan: ['{母|はは}', '{野菜|やさい}'],
          dong: ['{母|はは}は{弟|おとうと}**に**{野菜|やさい}**を**{食|た}べさせました。', '{父|ちち}は{私|わたし}**に**{皿洗|さらあら}い**を**させました。'],
          ro: ['Haha wa otouto ni yasai o tabesasemashita.', 'Chichi wa watashi ni saraarai o sasemashita.'],
          bang: { head: ['Động từ', 'Người làm'], rows: [['không có N を', 'B を'], ['có N を', 'B に (không hai を)']] },
          hoi: '「{母|はは}は{弟|おとうと}を{野菜|やさい}を{食|た}べさせた」 sai ở đâu?',
          dap: 'Hai を — đã có {野菜|やさい}を thì {弟|おとうと} phải đi với **に**.',
          ghi: 'Chỉ người TRÊN mới sai khiến người DƯỚI. Không nói ~~{私|わたし}は{部長|ぶちょう}に{資料|しりょう}を{見|み}させた~~ → {見|み}ていただいた.',
        },
        {
          tieuDe: '③ CHO làm — ～させてくれる／～させてもらう',
          anh: ['airplane', 'dog'],
          nhan: ['{留学|りゅうがく}', '{飼|か}う'],
          dong: ['{父|ちち}は{私|わたし}を{留学|りゅうがく}させてくれました。', '{犬|いぬ}を{飼|か}わせてもらえませんでした。'],
          ro: ['Chichi wa watashi o ryuugaku sasete kuremashita.', 'Inu o kawasete moraemasen deshita.'],
          hoi: '～させてくれた và ～させた khác nhau thế nào?',
          dap: '～させた: bắt (hoặc cho) — trung tính; ～させてくれた: chắc chắn là CHO, có ý biết ơn.',
          ghi: 'Phủ định "không được cho": ～させてくれなかった (A không cho) / ～させてもらえなかった (tôi không được cho — dùng もらえる). Câu kể hồi nhỏ rất hay dùng.',
        },
        {
          tieuDe: '③ Gây cảm xúc — B を ～させる',
          anh: ['worried-face', 'face-with-tears-of-joy', 'hourglass-done'],
          nhan: ['{心配|しんぱい}', '{笑|わら}う', '{待|ま}つ'],
          dong: ['{親|おや}**を**{心配|しんぱい}させました。', 'お{待|ま}たせしました。'],
          ro: ['Oya o shinpai sasemashita.', 'Omatase shimashita.'],
          hoi: 'Đến muộn, xin lỗi bạn — nói 「{待|ま}ってすみません」 được không?',
          dap: 'Không — đó là "xin lỗi vì TÔI đã chờ". Đúng: **{待|ま}たせてすみません**／お{待|ま}たせしました.',
          ghi: 'Động từ cảm xúc: {心配|しんぱい}する, {喜|よろこ}ぶ, {泣|な}く, {笑|わら}う, {困|こま}る, びっくりする, {待|ま}つ. Người chịu cảm xúc luôn đi với を.',
        },
        {
          tieuDe: '{会話|かいわ}① — {子|こ}どもの{頃|ころ}の{写真|しゃしん}',
          anh: ['girl', 'boy', 'framed-picture'],
          nhan: ['マリヤム', 'ダニエル', '{写真|しゃしん}'],
          dong: ['{母|はは}は{毎日|まいにち}{一時間|いちじかん}ピアノを{練習|れんしゅう}させたの。', '{外|そと}で{自由|じゆう}に{遊|あそ}ばせてくれたんだ。', '{犬|いぬ}を{飼|か}わせてもらえなかったの。'],
          ro: ['Haha wa mainichi ichijikan piano o renshuu saseta no.', 'Soto de jiyuu ni asobasete kureta n da.', 'Inu o kawasete moraenakatta no.'],
          hoi: 'Trong hội thoại ①, ダニエル nói 「{皿洗|さらあら}いをさせられた」 — nghĩa là gì?',
          dap: '"Mình bị bắt rửa bát" — ～させられる (sai khiến bị động, Buổi 3 sẽ học kỹ — hôm nay chỉ cần hiểu).',
          ghi: 'Đọc to hội thoại ① theo cặp. Đếm: mấy câu "bắt" (～させた), mấy câu "cho / không cho" (～させてくれた／もらえなかった)?',
        },
        {
          tieuDe: 'チャレンジ — "Hồi nhỏ, bố mẹ bắt / cho bạn làm gì?"',
          anh: ['musical-keyboard', 'house', 'video-game', 'dog'],
          nhan: ['A', 'B', 'C', 'D'],
          dong: ['A：{子|こ}どもの{頃|ころ}、ご{両親|りょうしん}は{何|なに}をさせましたか。', 'B：{母|はは}は{私|わたし}にピアノを{習|なら}わせました。'],
          ro: ['A: Kodomo no koro, goryoushin wa nani o sasemashita ka.', 'B: Haha wa watashi ni piano o narawasemashita.'],
          hoi: 'Tranh C (game) và D (chó) — nói gì?',
          dap: 'C：ゲームはあまりさせてもらえませんでした。D：{両親|りょうしん}は{犬|いぬ}を{飼|か}わせてくれました。',
          ghi: 'Luyện cặp 3 phút, đổi vai. Mỗi câu thêm một chi tiết (mấy tiếng, mấy lần một tuần) để đủ điểm thi nói.',
        },
        {
          tieuDe: 'まとめ — Buổi 1',
          bang: {
            head: ['Mẫu', 'Khuôn', 'Ví dụ'],
            rows: [
              ['Chia', 'nhóm 1 あ段＋せる · nhóm 2 ＋させる · させる · {来|こ}させる', '{行|い}かせる · {食|た}べさせる'],
              ['Bắt (tự động từ)', 'A は B を V(さ)せる', '{学生|がくせい}を{立|た}たせる'],
              ['Bắt (tha động từ)', 'A は B に N を V(さ)せる', '{弟|おとうと}に{野菜|やさい}を{食|た}べさせる'],
              ['Cho', '～させてくれる／～させてもらう', '{留学|りゅうがく}させてくれた'],
              ['Cảm xúc', 'B を V(さ)せる', '{親|おや}を{心配|しんぱい}させる'],
            ],
          },
          ghi: 'Bài về nhà: viết 3 câu "bố mẹ bắt mình làm" và 3 câu "bố mẹ cho / không cho mình làm". Buổi sau: xin được làm (～させてください) và thể mệnh lệnh.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: thể ない, bị động, ～てくれる' },
    {
      t: 'p',
      text: 'Giáo viên hỏi cả lớp: "Hồi nhỏ, mẹ có hay bảo các em **ăn rau** không?" Ai đó trả lời {母|はは}に「{野菜|やさい}を{食|た}べなさい」と{言|い}われました (bị động — Bài 22). Giáo viên: "Đúng. Còn nếu muốn kể từ phía **mẹ** — **mẹ BẮT em ăn rau** — thì sao?" Đáp án hôm nay: **{母|はは}は{私|わたし}に{野菜|やさい}を{食|た}べさせました**. Trước khi học, ôn nhanh ba thứ cần dùng: thể ない (hàng あ), bị động, ～てくれる.',
    },
    {
      t: 'mcq',
      id: 'b23-b1-khoi-dong',
      title: 'Khởi động — ôn thể ない, bị động, ～てくれる (4 câu)',
      items: [
        { q: '「{待|ま}つ」のない{形|けい}は？', options: ['{待|ま}ちない', '{待|ま}たない', '{待|ま}てない', '{待|ま}つない'], correct: 1, why: 'Nhóm 1: つ → **た** + ない: **{待|ま}たない**. Hôm nay: {待|ま}た**せる**.' },
        { q: '「{言|い}う」のない{形|けい}は？', options: ['{言|い}あない', '{言|い}わない', '{言|い}えない', '{言|い}いない'], correct: 1, why: 'う → **わ**: **{言|い}わない** → sai khiến {言|い}**わ**せる.' },
        { q: '{先生|せんせい}に{褒|ほ}め（　）、うれしかったです。', options: ['られて', 'させて', 'て', 'ろ'], correct: 0, why: 'Bị động (Bài 22): {褒|ほ}め**られる** — được thầy khen. 〔Sensei ni homerarete…〕' },
        { q: '{友達|ともだち}が{駅|えき}まで{送|おく}って（　）。（cảm ơn bạn）', options: ['くれました', 'あげました', 'もらいました', 'させました'], correct: 0, why: 'Người khác làm cho mình → **～てくれる** (Bài 18). Hôm nay ghép: ～させて**くれる** = cho mình làm.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: tập ảnh hồi nhỏ của マリヤム' },
    {
      t: 'table',
      caption: 'Giáo viên chiếu sáu tấm ảnh trong tập ảnh của マリヤム — mỗi tấm một từ mới',
      head: ['Ảnh', 'Câu trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['① ba tuổi, ôm gấu bông', '**{幼|おさな}い{頃|ころ}**、**おもちゃ**が{大好|だいす}きでした。', 'osanai koro · omocha', 'hồi còn bé · đồ chơi'],
        ['② trước cổng trường mẫu giáo', '**{幼稚園|ようちえん}**の{入園式|にゅうえんしき}です。', 'youchien', 'trường mẫu giáo'],
        ['③ ngồi trước đàn piano', '**{習|なら}い{事|ごと}**はピアノでした。{母|はは}は**{厳|きび}しかった**です。', 'naraigoto · kibishikatta', 'môn năng khiếu · nghiêm khắc'],
        ['④ ở nhà một mình, vẫy tay', '{一人|ひとり}で**{留守番|るすばん}**をしました。', 'rusuban', 'trông nhà'],
        ['⑤ cầm túi đồ ở cửa hàng', '{初|はじ}めての**お{使|つか}い**！', 'otsukai', 'lần đầu đi mua đồ giúp'],
        ['⑥ cạnh ông, ông cho kẹo', '{祖父|そふ}は{私|わたし}を**{甘|あま}やかし**ました。', 'amayakashimashita', 'đã nuông chiều'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{子|こ}どもの{頃|ころ}の{写真|しゃしん}を{見|み}ると、{懐|なつ}かしいです。', 'Kodomo no koro no shashin o miru to, natsukashii desu.', 'Nhìn ảnh hồi nhỏ thấy bồi hồi.'),
        E('{私|わたし}は{田舎|いなか}で{生|う}まれて、{東京|とうきょう}で{育|そだ}ちました。', 'Watashi wa inaka de umarete, Toukyou de sodachimashita.', 'Tôi sinh ở quê, lớn lên ở Tokyo.'),
        E('{弟|おとうと}は{毎日|まいにち}{犬|いぬ}の{世話|せわ}をしています。', 'Otouto wa mainichi inu no sewa o shite imasu.', 'Ngày nào em trai tôi cũng chăm con chó.'),
        E('{雨|あめ}の{日|ひ}は、{洗濯物|せんたくもの}を{部屋|へや}の{中|なか}に{干|ほ}します。', 'Ame no hi wa, sentakumono o heya no naka ni hoshimasu.', 'Ngày mưa thì phơi đồ trong phòng.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — Thể sai khiến: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b23-b1-chia',
      title: 'Luyện nhanh — chia thể sai khiến (10 câu)',
      kind: 'fill',
      items: [
        { q: '{書|か}く → sai khiến', answers: V('{書|か}かせる') },
        { q: '{飲|の}む → sai khiến', answers: V('{飲|の}ませる') },
        { q: '{習|なら}う → sai khiến', answers: V('{習|なら}わせる') },
        { q: '{遊|あそ}ぶ → sai khiến', answers: V('{遊|あそ}ばせる') },
        { q: '{立|た}つ → sai khiến', answers: V('{立|た}たせる') },
        { q: '{帰|かえ}る → sai khiến', answers: V('{帰|かえ}らせる') },
        { q: '{起|お}きる → sai khiến', answers: V('{起|お}きさせる') },
        { q: '{片付|かたづ}ける → sai khiến', answers: V('{片付|かたづ}けさせる') },
        { q: '{掃除|そうじ}する → sai khiến', answers: V('{掃除|そうじ}させる') },
        { q: '{持|も}ってくる → sai khiến', answers: V('{持|も}って{来|こ}させる', '{持|も}ってこさせる') },
      ],
    },
    {
      t: 'quiz',
      id: 'b23-b1-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: 'A は B を V(さ)せる · A は B に N を V(さ)せる · ～させてくれる · ～させてもらえなかった · B を～させる',
      items: [
        { q: 'Mẹ bắt tôi dọn phòng.', answers: V('{母|はは}は{私|わたし}に{部屋|へや}を{片付|かたづ}けさせました。', '{母|はは}は{私|わたし}に{部屋|へや}を{掃除|そうじ}させました。'), hint: 'わたしに へやを …させました' },
        { q: 'Thầy bắt học sinh đi về nhà.', answers: V('{先生|せんせい}は{学生|がくせい}を{家|いえ}に{帰|かえ}らせました。', '{先生|せんせい}は{学生|がくせい}を{帰|かえ}らせました。'), hint: 'がくせいを かえらせました' },
        { q: 'Bố cho tôi học piano.', answers: V('{父|ちち}は{私|わたし}にピアノを{習|なら}わせてくれました。', '{父|ちち}はピアノを{習|なら}わせてくれました。'), hint: 'ならわせて くれました' },
        { q: 'Tôi không được cho nuôi mèo.', answers: V('{猫|ねこ}を{飼|か}わせてもらえませんでした。'), hint: 'かわせて もらえませんでした' },
        { q: 'Tôi đã làm mẹ khóc.', answers: V('{母|はは}を{泣|な}かせてしまいました。', '{母|はは}を{泣|な}かせました。'), hint: 'ははを なかせました' },
        { q: 'Xin lỗi đã để bạn chờ.', answers: V('{待|ま}たせてごめんね。', '{待|ま}たせてすみません。', 'お{待|ま}たせしました。'), hint: 'またせて …' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Chia: nhóm 1 = hàng あ (như thể ない) + せる**; nhóm 2 + させる; する → させる; {来|く}る → {来|こ}させる. **Không chèn さ** vào nhóm 1: {休|やす}ませる, {帰|かえ}らせる.',
        '**Trợ từ của người làm: có N を → に; không có N を → を.** Một câu không có hai を.',
        '**～させてくれる／～させてもらう = CHO PHÉP + biết ơn.** Phủ định: ～させてくれなかった／～させてもらえなかった. Gây cảm xúc: **B を**{心配|しんぱい}させる, お{待|ま}たせしました.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{飲|の}む」の{使役形|しえきけい}は{何|なん}ですか。', ro: '"Nomu" no shiekikei wa nan desu ka.', vi: 'Thể sai khiến của "nomu" là gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{飲|の}ませる」です。', ro: '"Nomaseru" desu.', vi: 'Là "nomaseru" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{子|こ}どもの{頃|ころ}、ご{両親|りょうしん}はあなたに{何|なに}をさせましたか。', ro: 'Kodomo no koro, goryoushin wa anata ni nani o sasemashita ka.', vi: 'Hồi nhỏ bố mẹ em bắt em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{母|はは}は{私|わたし}に{毎晩|まいばん}{皿洗|さらあら}いをさせました。それから、{日曜日|にちようび}は{部屋|へや}を{掃除|そうじ}させました。', ro: 'Haha wa watashi ni maiban saraarai o sasemashita. Sorekara, nichiyoubi wa heya o souji sasemashita.', vi: 'Mẹ bắt em rửa bát mỗi tối. Rồi Chủ nhật thì bắt dọn phòng ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'ご{両親|りょうしん}は、どんなことをさせてくれましたか。', ro: 'Goryoushin wa, donna koto o sasete kuremashita ka.', vi: 'Bố mẹ đã cho em làm những gì?' },
        { who: 'Bạn', role: 'candidate', text: '{夏休|なつやす}みは、{友達|ともだち}と{海|うみ}へ{旅行|りょこう}に{行|い}かせてくれました。', ro: 'Natsuyasumi wa, tomodachi to umi e ryokou ni ikasete kuremashita.', vi: 'Nghỉ hè bố mẹ cho em đi du lịch biển với bạn ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{弟|おとうと}を{野菜|やさい}を{食|た}べさせた」は{正|ただ}しいですか。', ro: '"Otouto o yasai o tabesaseta" wa tadashii desu ka.', vi: '"Otouto o yasai o tabesaseta" có đúng không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ。「を」が{二|ふた}つありますから、「{弟|おとうと}に{野菜|やさい}を{食|た}べさせた」です。', ro: 'Iie. "O" ga futatsu arimasu kara, "otouto ni yasai o tabesaseta" desu.', vi: 'Không ạ. Có hai chữ "o", nên phải là "otouto ni yasai o tabesaseta".' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '「{待|ま}つ」の{使役形|しえきけい}は？', options: ['{待|ま}ちさせる', '{待|ま}たせる', '{待|ま}てさせる', '{待|ま}たさせる'], correct: 1, why: 'つ → た + せる: **{待|ま}たせる**. 〔mataseru〕' },
        { q: '{父|ちち}は{弟|おとうと}（　）{車|くるま}を{洗|あら}わせました。', options: ['を', 'に', 'が', 'と'], correct: 1, why: 'Có **{車|くるま}を** → người làm đi với **に**. 〔Otouto ni kuruma o arawasemashita.〕' },
        { q: '{先生|せんせい}は{遅|おく}れてきた{学生|がくせい}（　）{教室|きょうしつ}の{前|まえ}に{立|た}たせました。', options: ['を', 'で', 'へ', 'の'], correct: 0, why: '{立|た}つ là tự động từ, {教室|きょうしつ}の{前|まえ}**に** chỉ nơi, câu không có N を khác → người làm đi với **を**. ⚠ Nếu câu có を chỉ đường đi (グラウンドを{走|はし}る) thì người làm phải đổi sang に: {選手|せんしゅ}**に**グラウンドを{走|はし}らせる (không hai を). 〔Gakusei o kyoushitsu no mae ni tatasemashita.〕' },
        { q: '{母|はは}は{私|わたし}を{一人|ひとり}で{旅行|りょこう}に（　）。（mẹ đã cho, tôi biết ơn）', options: ['{行|い}かせてくれました', '{行|い}ってくれました', '{行|い}かれました', '{行|い}かせられました'], correct: 0, why: 'CHO làm + biết ơn → **{行|い}かせてくれました**. {行|い}ってくれました = mẹ đi giúp tôi (sai nghĩa). 〔Ikasete kuremashita.〕' },
        { q: '{遅|おく}れて、{友達|ともだち}を{一時間|いちじかん}も（　）。', options: ['{待|ま}たせてしまいました', '{待|ま}ってしまいました', '{待|ま}たれてしまいました', '{待|ま}たさせてしまいました'], correct: 0, why: 'Mình làm bạn chờ → **{待|ま}たせる**; ～てしまう = lỡ (Bài 19). たさせる có さ thừa. 〔Tomodachi o ichijikan mo matasete shimaimashita.〕' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b23-buoi-2-sasete-meirei',
  kind: 'review',
  title: 'Buổi 2 — Xin được làm & ra lệnh: từ mới trẻ nghịch – dạy dỗ – thể thao · ～させてください／いただけませんか · thể mệnh lệnh · cấm ～な · ～なさい · hội thoại ②',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng ～てもいいですか (ポイント 89) và ～てください (ポイント 63), học từ trẻ nghịch – dạy dỗ và mệnh lệnh – cho phép – thể thao, xin được làm ở ba mức (～させてください → ～させてもらえませんか → ～させていただけませんか), chia và hiểu thể mệnh lệnh, câu cấm V辞書形＋な, câu bảo Vます＋なさい, xếp được thang ra lệnh từ mạnh đến lịch sự, đóng vai hội thoại ② (lớp bóng đá thiếu nhi), rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn ～てもいいですか (xin phép) và ～てください (nhờ). Câu hỏi mở đầu: "Bị sốt, muốn xin sếp về sớm — nói {帰|かえ}ってもいいですか có đủ lịch sự không?"',
        '**Từ mới (8′)** — nhóm C (trẻ nghịch & dạy dỗ: いたずら, {反省|はんせい}, {嫌|いや}がる, わがまま, {好|す}き{嫌|きら}い, {残|のこ}す, {泣|な}き{虫|むし}, {言|い}うことを{聞|き}く, {素直|すなお}) + nhóm D (mệnh lệnh – cho phép – thể thao: {命令|めいれい}, {許可|きょか}, {反対|はんたい}・{賛成|さんせい}, {投|な}げる, {逃|に}げる, {大声|おおごえ}, {応援|おうえん}, {部活|ぶかつ}).',
        '**Ngữ pháp (22′)** — ④ ～させてください／もらえませんか／いただけませんか · ⑤ thể mệnh lệnh · ⑥ V{辞書形|じしょけい}＋な · ⑦ Vます＋なさい · thang ra lệnh.',
        '**Hội thoại (10′)** — ② カルロス dạy lớp bóng đá thiếu nhi, パク đứng xem.',
        '**チャレンジ (5′)** — đóng vai: A là huấn luyện viên hô lệnh, B là cầu thủ xin được làm; rồi A là sếp, B xin phép lịch sự. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b23-b2-slides',
      title: 'Bài 23 子どもの頃 — Buổi 2: ～させてください・命令形・～な・～なさい',
      slides: [
        {
          tieuDe: '{第23課|だいにじゅうさんか} Buổi 2 — xin được làm & ra lệnh',
          anh: ['person-raising-hand', 'megaphone', 'soccer-ball'],
          nhan: ['させてください', '{命令形|めいれいけい}', 'サッカー'],
          dong: ['{私|わたし}にやらせてください！ ／ {走|はし}れ！ ／ {早|はや}く{寝|ね}なさい。'],
          ro: ['Watashi ni yarasete kudasai! / Hashire! / Hayaku nenasai.'],
          ghi: 'Buổi 1: A bắt / cho B làm. Buổi 2: MÌNH xin được làm (～させてください) và người trên RA LỆNH (thể mệnh lệnh, ～な, ～なさい). Cả hai đều dùng nhiều trong phim, thể thao, chỗ làm.',
        },
        {
          tieuDe: 'Khởi động — ～てもいいですか ／ ～てください',
          anh: ['woman-raising-hand', 'man-office-worker'],
          nhan: ['{質問|しつもん}', '{部長|ぶちょう}'],
          dong: ['{質問|しつもん}してもいいですか。(ポイント 89)', '{窓|まど}を{開|あ}けてください。(ポイント 63)'],
          ro: ['Shitsumon shite mo ii desu ka.', 'Mado o akete kudasai.'],
          hoi: 'Hai câu trên: câu nào MÌNH làm, câu nào NGƯỜI NGHE làm?',
          dap: '～てもいいですか: mình làm (xin phép); ～てください: người nghe làm (nhờ).',
          ghi: 'Hôm nay thêm một cách xin phép khiêm tốn hơn: ～させてください — "cho tôi được làm". Ghép thể sai khiến (Buổi 1) với ～てください.',
        },
        {
          tieuDe: '{新|あたら}しいことば ③ — Trẻ nghịch & dạy dỗ',
          anh: ['face-with-tongue', 'person-bowing', 'pouting-face', 'broccoli'],
          nhan: ['いたずら', '{反省|はんせい}', 'わがまま', '{好|す}き{嫌|きら}い'],
          dong: ['いたずらをして、{先生|せんせい}に{注意|ちゅうい}されました。', '{好|す}き{嫌|きら}いをしないで、{残|のこ}さないで{食|た}べなさい。'],
          ro: ['Itazura o shite, sensei ni chuui saremashita.', 'Sukikirai o shinaide, nokosanaide tabenasai.'],
          hoi: '{注意|ちゅうい}する・しかる・{怒|おこ}る — cái nào nhẹ nhất?',
          dap: '**{注意|ちゅうい}する** (nhắc nhở) < しかる (mắng để dạy) < {怒|おこ}る (nổi giận).',
          ghi: 'Thêm: {嫌|いや}がる (tỏ ra không thích — nói người khác), {言|い}うことを{聞|き}く (vâng lời), {素直|すなお} (ngoan, thật thà).',
        },
        {
          tieuDe: '{新|あたら}しいことば ④ — Mệnh lệnh, cho phép, thể thao',
          anh: ['megaphone', 'baseball', 'person-running', 'clapping-hands'],
          nhan: ['{命令|めいれい}', '{投|な}げる', '{逃|に}げる', '{応援|おうえん}'],
          dong: ['{部長|ぶちょう}の{許可|きょか}をもらいました。', '{家族|かぞく}みんなでチームを{応援|おうえん}しました。'],
          ro: ['Buchou no kyoka o moraimashita.', 'Kazoku minna de chiimu o ouen shimashita.'],
          hoi: '{反対|はんたい}する và {応援|おうえん}する đi với trợ từ gì?',
          dap: 'N **に** {反対|はんたい}／{賛成|さんせい}する; N **を** {応援|おうえん}する.',
          ghi: 'Thêm: {大声|おおごえ}を{出|だ}す (to tiếng — đọc ご đục), {部活|ぶかつ} (CLB ở trường). {投|な}げる・{逃|に}げる là nhóm 2 → mệnh lệnh {投|な}げろ・{逃|に}げろ.',
        },
        {
          tieuDe: '④ ～させてください — "cho tôi được…"',
          anh: ['person-raising-hand', 'goal-net'],
          nhan: ['{私|わたし}に', 'キーパー'],
          dong: ['{私|わたし}にキーパーをやらせてください。', '{今日|きょう}は{早|はや}く{帰|かえ}らせてください。'],
          ro: ['Watashi ni kiipaa o yarasete kudasai.', 'Kyou wa hayaku kaerasete kudasai.'],
          hoi: '「{帰|かえ}ってください」 và 「{帰|かえ}らせてください」 khác nhau thế nào?',
          dap: '{帰|かえ}ってください = (bạn) hãy về đi; {帰|かえ}らせてください = cho TÔI về.',
          ghi: 'Ba tình huống: xin về / nghỉ · xung phong ({私|わたし}にやらせてください) · xin thời gian ({考|かんが}えさせてください — từ chối khéo).',
        },
        {
          tieuDe: '④ Ba mức lịch sự',
          anh: ['man-student', 'man-cook', 'man-office-worker'],
          nhan: ['{友達|ともだち}', '{店長|てんちょう}', '{部長|ぶちょう}'],
          dong: ['{使|つか}わせてください。', '{使|つか}わせてもらえませんか。', '{使|つか}わせていただけませんか。'],
          ro: ['Tsukawasete kudasai.', 'Tsukawasete moraemasen ka.', 'Tsukawasete itadakemasen ka.'],
          bang: { head: ['Mức', 'Dùng với'], rows: [['～させてください', 'bạn, đồng nghiệp; xung phong'], ['～させてもらえませんか', 'người trên quen, người lạ'], ['～させていただけませんか', 'sếp, thầy, khách']] },
          hoi: 'Xin trưởng phòng cho nghỉ thứ Sáu — nói thế nào?',
          dap: '{金曜日|きんようび}、{休|やす}ませていただけませんか。',
          ghi: '⚠ ~~{休|やす}まさせて~~, ~~{帰|かえ}らさせて~~ — nhóm 1 không có さ. Đây là lỗi người Nhật trẻ cũng mắc, nhưng trong đề là SAI.',
        },
        {
          tieuDe: '⑤ Thể mệnh lệnh — nhóm 1: う段 → え段',
          anh: ['person-running', 'stop-sign'],
          nhan: ['{走|はし}れ', '{止|と}まれ'],
          dong: ['{走|はし}る → {走|はし}**れ** ・ {止|と}まる → {止|と}ま**れ**', '{行|い}く → {行|い}**け** ・ {待|ま}つ → {待|ま}**て** ・ {急|いそ}ぐ → {急|いそ}**げ**'],
          ro: ['hashiru → hashire · tomaru → tomare', 'iku → ike · matsu → mate · isogu → isoge'],
          hoi: '{頑張|がんば}る → ? {言|い}う → ?',
          dap: '{頑張|がんば}**れ**, {言|い}**え**.',
          ghi: '⚠ {帰|かえ}れ (về đi!) trông giống {帰|かえ}れる (về được). Nhìn đuôi: mệnh lệnh dừng ở え段, khả năng có thêm る.',
        },
        {
          tieuDe: '⑤ Nhóm 2 & 3 — ろ・しろ・{来|こ}い',
          anh: ['person-running', 'bento-box'],
          nhan: ['{逃|に}げろ', '{食|た}べろ'],
          dong: ['{逃|に}げる → {逃|に}げ**ろ** ・ {見|み}る → {見|み}**ろ** ・ {起|お}きる → {起|お}き**ろ**', 'する → **しろ** ・ {来|く}る → **{来|こ}い** ・ くれる → **くれ**'],
          ro: ['nigeru → nigero · miru → miro · okiru → okiro', 'suru → shiro · kuru → koi · kureru → kure'],
          hoi: 'Mệnh lệnh của {勉強|べんきょう}する và {持|も}ってくる?',
          dap: '{勉強|べんきょう}**しろ**, {持|も}って**こい**.',
          ghi: 'Văn viết / khẩu hiệu: {注意|ちゅうい}せよ, {答|こた}えよ (chỉ cần nhận ra). ~~{来|く}れ~~, ~~{食|た}べれ~~ là sai.',
        },
        {
          tieuDe: '⑤ Ai nói thể mệnh lệnh? Khi nào?',
          anh: ['soccer-ball', 'fire-engine', 'stop-sign', 'clapping-hands'],
          nhan: ['sân tập', 'khẩn cấp', 'biển báo', 'cổ vũ'],
          dong: ['{集|あつ}まれ！ ／ {逃|に}げろ！ ／ {止|と}まれ ／ {頑張|がんば}れ！'],
          ro: ['Atsumare! / Nigero! / Tomare / Ganbare!'],
          hoi: 'Có nên nói với thầy giáo 「{先生|せんせい}、{来|こ}い」 không?',
          dap: 'Tuyệt đối không — rất thô lỗ. Nói {先生|せんせい}、{来|き}てください／{来|き}ていただけませんか.',
          ghi: 'Ai cũng dùng: lúc nguy hiểm, cổ vũ, biển báo, khi trích lời 「～」と{言|い}われた. Nam giới với bạn rất thân / người dưới. Nữ hầu như không dùng.',
        },
        {
          tieuDe: '⑥ Cấm: V{辞書形|じしょけい} ＋ な',
          anh: ['no-entry', 'prohibited'],
          nhan: ['{入|はい}るな', '{触|さわ}るな'],
          dong: ['{危|あぶ}ない！{触|さわ}るな！', '{最後|さいご}まで{諦|あきら}めるな！'],
          ro: ['Abunai! Sawaru na!', 'Saigo made akirameru na!'],
          bang: { head: ['Câu', 'Nghĩa'], rows: [['{食|た}べる**な**', 'Đừng ăn! (cấm)'], ['{食|た}べ**な**', 'Ăn đi! (văn nói, = 食べなさい)'], ['いい**なあ**', 'Thích nhỉ (cảm thán)']] },
          hoi: '「{入|はい}るな」 và 「{入|はい}りな」 nghĩa ngược nhau thế nào?',
          dap: '{入|はい}るな = đừng vào; {入|はい}りな = vào đi (thân).',
          ghi: 'Mềm hơn, ai cũng dùng: ～ないで → ～ないでください (ポイント 88) → ～てはいけません (ポイント 114).',
        },
        {
          tieuDe: '⑦ Vます ＋ なさい',
          anh: ['woman', 'bed', 'books'],
          nhan: ['お{母|かあ}さん', '{寝|ね}なさい', '{勉強|べんきょう}しなさい'],
          dong: ['もう{十時|じゅうじ}よ。{早|はや}く{寝|ね}なさい。', '{遊|あそ}んだら、おもちゃを{片付|かたづ}けなさい。'],
          ro: ['Mou juuji yo. Hayaku nenasai.', 'Asondara, omocha o katazukenasai.'],
          hoi: '{来|く}る + なさい → ?',
          dap: '**{来|き}なさい** (vì thể ます là {来|き}ます).',
          ghi: 'Bố mẹ → con, thầy cô → học sinh, lời dặn trong bài kiểm tra ({正|ただ}しいものを{選|えら}びなさい). Không nói với người trên. Câu chào おやすみなさい là câu cố định.',
        },
        {
          tieuDe: '⭐ Thang ra lệnh — từ mạnh đến lịch sự',
          bang: {
            head: ['Mức', 'Câu', 'Ai nói'],
            rows: [
              ['1', '{待|ま}て！／{行|い}くな！', 'HLV, khẩn cấp, biển báo'],
              ['2', '{待|ま}ちなさい。', 'bố mẹ, thầy cô → trẻ'],
              ['3', '{待|ま}って。／{行|い}かないで。', 'gia đình, bạn bè'],
              ['4', '{待|ま}ってください。', 'lịch sự thường ngày'],
              ['5', '{待|ま}っていただけませんか。', 'nhờ sếp, khách'],
            ],
          },
          hoi: 'Bạn là nhân viên, khách đi nhầm vào khu cấm. Nói 「{入|はい}るな！」 được không?',
          dap: 'Không. Nói: すみません、ここには{入|はい}らないでください.',
          ghi: 'Người học nước ngoài: HIỂU mức 1–2, tự NÓI mức 3–5. Mức 1 chỉ dùng khi trích lời hoặc lúc thật sự nguy hiểm.',
        },
        {
          tieuDe: '{会話|かいわ}② — サッカー{教室|きょうしつ}',
          anh: ['man-running', 'girl', 'soccer-ball'],
          nhan: ['カルロス', 'さくら', 'サッカー'],
          dong: ['みんな、{集|あつ}まれ！', '{今日|きょう}は{私|わたし}にキーパーをやらせてください！', '{止|と}まるな、もっと{走|はし}れ！'],
          ro: ['Minna, atsumare!', 'Kyou wa watashi ni kiipaa o yarasete kudasai!', 'Tomaru na, motto hashire!'],
          hoi: 'Vì sao カルロス nói 「{走|はし}れ」 chứ không phải 「{走|はし}ってください」?',
          dap: 'Trên sân phải nói ngắn, mạnh, kịp thời — 「{走|はし}ってください」じゃ、{間|ま}に{合|あ}わない.',
          ghi: 'Đọc to hội thoại ② theo nhóm ba (カルロス — さくら — パク). Tìm: 4 câu mệnh lệnh, 3 câu cấm ～な, 1 câu ～させてください, 3 câu ～なさい.',
        },
        {
          tieuDe: 'チャレンジ — huấn luyện viên & cầu thủ, sếp & nhân viên',
          anh: ['megaphone', 'person-raising-hand', 'man-office-worker', 'face-with-thermometer'],
          nhan: ['A', 'B', 'C', 'D'],
          dong: ['A（コーチ）：もっと{速|はや}く{走|はし}れ！', 'B（{選手|せんしゅ}）：コーチ、{次|つぎ}は{僕|ぼく}にシュートさせてください！'],
          ro: ['A (koochi): Motto hayaku hashire!', 'B (senshu): Koochi, tsugi wa boku ni shuuto sasete kudasai!'],
          hoi: 'Tranh C–D: bạn bị sốt, nói với trưởng phòng thế nào?',
          dap: '{部長|ぶちょう}、{熱|ねつ}があるので、{早退|そうたい}させていただけませんか。',
          ghi: 'Luyện cặp 4 phút: 2 phút sân bóng (mệnh lệnh + xin được làm), 2 phút văn phòng (chỉ dùng ～させていただけませんか). Đổi vai.',
        },
        {
          tieuDe: 'まとめ — Buổi 2',
          bang: {
            head: ['Mẫu', 'Khuôn', 'Ví dụ'],
            rows: [
              ['Xin được làm', 'V(さ)せてください／もらえませんか／いただけませんか', '{休|やす}ませていただけませんか'],
              ['Mệnh lệnh', 'え段 · ろ · しろ · {来|こ}い', '{走|はし}れ · {逃|に}げろ'],
              ['Cấm', 'V{辞書形|じしょけい} ＋ な', '{触|さわ}るな'],
              ['Bảo (trên → dưới)', 'Vます ＋ なさい', '{寝|ね}なさい'],
            ],
          },
          ghi: 'Bài về nhà: viết 3 câu xin phép (mỗi mức một câu) và 5 câu bố mẹ / huấn luyện viên hay nói (mệnh lệnh, ～な, ～なさい). Buổi sau: kể lại lời dặn ～ように言う／言われる và ～させられる.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: xin phép và nhờ' },
    {
      t: 'p',
      text: 'Giáo viên đóng vai trưởng phòng ngồi sau bàn. Một học sinh xin về sớm: 「{部長|ぶちょう}、{帰|かえ}ってもいいですか」. Giáo viên: "Được, nhưng nghe hơi thẳng. Người Nhật ở công ty sẽ nói **{早退|そうたい}させていただけませんか** — dùng thể sai khiến của Buổi 1 + ～ていただけませんか của Bài 18." Rồi giáo viên đột ngột hô: 「{立|た}て！」 — cả lớp giật mình đứng dậy: "Đó là **thể mệnh lệnh** — hôm nay học luôn."',
    },
    {
      t: 'mcq',
      id: 'b23-b2-khoi-dong',
      title: 'Khởi động — ôn ～てもいいですか, ～てください, ～ていただけませんか (4 câu)',
      items: [
        { q: '（{自分|じぶん}が{窓|まど}を{開|あ}けたい）「{窓|まど}を（　）。」', options: ['{開|あ}けてもいいですか', '{開|あ}けてください', '{開|あ}けていただけませんか', '{開|あ}けなさい'], correct: 0, why: 'Mình muốn làm → xin phép: **{開|あ}けてもいいですか** (ポイント 89). Hôm nay thêm: {開|あ}けさせてください.' },
        { q: '（{友達|ともだち}に{窓|まど}を{開|あ}けてほしい）「{窓|まど}を（　）。」', options: ['{開|あ}けてもいいですか', '{開|あ}けてくれる？', '{開|あ}けさせて', '{開|あ}けるな'], correct: 1, why: 'Nhờ bạn làm → **{開|あ}けてくれる？** (Bài 18).' },
        { q: '{先生|せんせい}、この{本|ほん}を（　）いただけませんか。（{先生|せんせい}に{貸|か}してほしい）', options: ['{貸|か}して', '{貸|か}させて', '{借|か}りさせて', '{貸|か}さないで'], correct: 0, why: 'Nhờ thầy CHO MƯỢN → **{貸|か}していただけませんか**. Muốn chính mình được mượn thì {借|か}りさせていただけませんか.' },
        { q: '「{休|やす}む」の{使役形|しえきけい}は？', options: ['{休|やす}まさせる', '{休|やす}ませる', '{休|やす}めさせる', '{休|やす}みさせる'], correct: 1, why: 'Buổi 1: **{休|やす}ませる** — không chèn さ. Hôm nay: {休|やす}ませてください.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: "Sổ liên lạc" của cô giáo gửi phụ huynh' },
    {
      t: 'table',
      caption: 'Giáo viên dán lên bảng trang sổ liên lạc ({連絡帳|れんらくちょう}) của một bé lớp 2 — mỗi dòng là một từ mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['{今日|きょう}、{授業中|じゅぎょうちゅう}に**いたずら**をしたので、**{注意|ちゅうい}しました**。', 'itazura · chuui shimashita', 'trò nghịch · đã nhắc nhở'],
        ['{本人|ほんにん}もよく**{反省|はんせい}して**、{友達|ともだち}に{謝|あやま}りました。**{素直|すなお}**ですね。', 'hansei shite · sunao', 'tự kiểm điểm · ngoan, thật thà'],
        ['{給食|きゅうしょく}の{野菜|やさい}を**{嫌|いや}がって**、{少|すこ}し**{残|のこ}しました**。', 'iyagatte · nokoshimashita', 'không chịu · để thừa'],
        ['{家|いえ}でも**{好|す}き{嫌|きら}い**をしないように{話|はな}してください。', 'sukikirai', 'kén ăn'],
        ['{運動会|うんどうかい}の{練習|れんしゅう}：ボールを{遠|とお}くまで**{投|な}げられる**ようになりました！', 'nagerareru', 'ném được'],
        ['{当日|とうじつ}はご{家族|かぞく}で**{応援|おうえん}**をお{願|ねが}いします。**{大声|おおごえ}**は{大丈夫|だいじょうぶ}です！', 'ouen · oogoe', 'cổ vũ · tiếng to'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{弟|おとうと}はわがままで、{親|おや}の{言|い}うことを{聞|き}きません。', 'Otouto wa wagamama de, oya no iu koto o kikimasen.', 'Em trai tôi bướng, không nghe lời bố mẹ.'),
        E('{父|ちち}は{私|わたし}の{一人暮|ひとりぐ}らしに{反対|はんたい}しました。', 'Chichi wa watashi no hitorigurashi ni hantai shimashita.', 'Bố phản đối việc tôi sống một mình.'),
        E('{地震|じしん}のときは、{慌|あわ}てないで{逃|に}げてください。', 'Jishin no toki wa, awatenaide nigete kudasai.', 'Khi động đất, đừng hoảng, hãy chạy thoát.'),
        E('{高校|こうこう}では{毎日|まいにち}{部活|ぶかつ}の{練習|れんしゅう}がありました。', 'Koukou de wa mainichi bukatsu no renshuu ga arimashita.', 'Hồi cấp 3 ngày nào cũng có buổi tập câu lạc bộ.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — Mệnh lệnh, cấm, なさい: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b23-b2-chia',
      title: 'Luyện nhanh — mệnh lệnh / cấm / なさい (12 câu)',
      kind: 'fill',
      items: [
        { q: '{急|いそ}ぐ → mệnh lệnh', answers: V('{急|いそ}げ') },
        { q: '{待|ま}つ → mệnh lệnh', answers: V('{待|ま}て') },
        { q: '{頑張|がんば}る → mệnh lệnh', answers: V('{頑張|がんば}れ') },
        { q: '{集|あつ}まる → mệnh lệnh', answers: V('{集|あつ}まれ') },
        { q: '{逃|に}げる → mệnh lệnh', answers: V('{逃|に}げろ') },
        { q: '{起|お}きる → mệnh lệnh', answers: V('{起|お}きろ') },
        { q: '{勉強|べんきょう}する → mệnh lệnh', answers: V('{勉強|べんきょう}しろ') },
        { q: '{来|く}る → mệnh lệnh', answers: V('{来|こ}い') },
        { q: '{押|お}す → cấm (～な)', answers: V('{押|お}すな') },
        { q: '{忘|わす}れる → cấm (～な)', answers: V('{忘|わす}れるな') },
        { q: '{食|た}べる → ～なさい', answers: V('{食|た}べなさい') },
        { q: '{来|く}る → ～なさい', answers: V('{来|き}なさい') },
      ],
    },
    {
      t: 'quiz',
      id: 'b23-b2-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～させてください · ～させていただけませんか · mệnh lệnh · ～な · ～なさい',
      items: [
        { q: 'Việc đó để tôi làm cho.', answers: V('それは{私|わたし}にやらせてください。', 'それ、{私|わたし}にやらせてください。', 'その{仕事|しごと}は{私|わたし}にやらせてください。'), hint: 'わたしに やらせて ください' },
        { q: 'Cho tôi suy nghĩ một chút.', answers: V('{少|すこ}し{考|かんが}えさせてください。', 'ちょっと{考|かんが}えさせてください。'), hint: 'かんがえさせて ください' },
        { q: '(Với sếp) Thứ Hai anh cho em nghỉ được không ạ?', answers: V('{月曜日|げつようび}、{休|やす}ませていただけませんか。', '{月曜日|げつようび}は{休|やす}ませていただけませんか。', '{月曜日|げつようび}に{休|やす}ませていただけませんか。'), hint: 'やすませて いただけませんか' },
        { q: 'Nguy hiểm! Dừng lại! (biển báo / khẩn cấp)', answers: V('{危|あぶ}ない！{止|と}まれ！'), hint: 'とまれ' },
        { q: 'Đừng bỏ cuộc!', answers: V('{諦|あきら}めるな！'), hint: 'あきらめるな' },
        { q: '(Mẹ nói với con) Ăn hết rau đi.', answers: V('{野菜|やさい}も{全部|ぜんぶ}{食|た}べなさい。', '{野菜|やさい}を{全部|ぜんぶ}{食|た}べなさい。', '{野菜|やさい}を{残|のこ}さないで{食|た}べなさい。'), hint: 'たべなさい' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**～させてください = xin cho CHÍNH MÌNH làm.** Ba mức: ください → もらえませんか → いただけませんか. Với sếp, thầy: **いただけませんか**. Nhóm 1 không chèn さ.',
        '**Thể mệnh lệnh: nhóm 1 え段, nhóm 2 ろ, しろ, {来|こ}い, くれ.** Người học: HIỂU là chính; tự nói chỉ khi cổ vũ, khẩn cấp, hoặc trích lời.',
        '**～な (cấm) sau thể từ điển · ～なさい sau thân thể ます.** {入|はい}るな (đừng vào) ≠ {入|はい}りな (vào đi) ≠ {入|はい}りなさい (vào đi — bố mẹ nói).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{熱|ねつ}があって、{会社|かいしゃ}を{早|はや}く{帰|かえ}りたいとき、{部長|ぶちょう}に{何|なん}と{言|い}いますか。', ro: 'Netsu ga atte, kaisha o hayaku kaeritai toki, buchou ni nan to iimasu ka.', vi: 'Khi bị sốt muốn về sớm, em nói gì với trưởng phòng?' },
        { who: 'Bạn', role: 'candidate', text: '「{熱|ねつ}があるので、{早退|そうたい}させていただけませんか」と{言|い}います。', ro: '"Netsu ga aru node, soutai sasete itadakemasen ka" to iimasu.', vi: 'Em nói "Tôi bị sốt, anh cho tôi về sớm được không ạ".' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{走|はし}る」の{命令形|めいれいけい}は{何|なん}ですか。どんなときに{使|つか}いますか。', ro: '"Hashiru" no meireikei wa nan desu ka. Donna toki ni tsukaimasu ka.', vi: 'Thể mệnh lệnh của "hashiru" là gì? Dùng khi nào?' },
        { who: 'Bạn', role: 'candidate', text: '「{走|はし}れ」です。スポーツの{練習|れんしゅう}や、{試合|しあい}の{応援|おうえん}のときに{使|つか}います。', ro: '"Hashire" desu. Supootsu no renshuu ya, shiai no ouen no toki ni tsukaimasu.', vi: 'Là "hashire" ạ. Dùng khi tập thể thao hoặc cổ vũ trận đấu.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{子|こ}どもの{頃|ころ}、お{母|かあ}さんによく{何|なん}と{言|い}われましたか。', ro: 'Kodomo no koro, okaasan ni yoku nan to iwaremashita ka.', vi: 'Hồi nhỏ em hay bị mẹ nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{早|はや}く{起|お}きなさい」と「ゲームはやめなさい」です。{毎日|まいにち}{言|い}われました。', ro: '"Hayaku okinasai" to "Geemu wa yamenasai" desu. Mainichi iwaremashita.', vi: '"Dậy nhanh lên" và "Thôi chơi game đi" ạ. Ngày nào cũng bị nói.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{触|さわ}るな」と「{触|さわ}らないでください」は、どう{違|ちが}いますか。', ro: '"Sawaru na" to "sawaranaide kudasai" wa, dou chigaimasu ka.', vi: '"Sawaru na" và "sawaranaide kudasai" khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「{触|さわ}るな」は{強|つよ}い{命令|めいれい}で、{危|あぶ}ないときや{看板|かんばん}に{使|つか}います。「{触|さわ}らないでください」は{丁寧|ていねい}です。', ro: '"Sawaru na" wa tsuyoi meirei de, abunai toki ya kanban ni tsukaimasu. "Sawaranaide kudasai" wa teinei desu.', vi: '"Sawaru na" là lệnh mạnh, dùng lúc nguy hiểm hoặc trên biển báo. "Sawaranaide kudasai" thì lịch sự ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{先生|せんせい}、{明日|あした}の{発表|はっぴょう}は{私|わたし}に（　）。', options: ['やらせてください', 'やってください', 'やられてください', 'やりなさい'], correct: 0, why: 'Xin cho MÌNH làm (xung phong) → **やらせてください**. 〔Watashi ni yarasete kudasai.〕' },
        { q: '{部長|ぶちょう}、{来週|らいしゅう}の{会議|かいぎ}に（　）いただけませんか。', options: ['{出|で}させて', '{出|で}て', '{出|で}られて', '{出|だ}させて'], correct: 0, why: 'Xin được dự họp → **{出|で}させていただけませんか** ({出|で}る nhóm 2 → {出|で}させる). {出|で}ていただけませんか = nhờ sếp dự (sai nghĩa). 〔Kaigi ni desasete itadakemasen ka.〕' },
        { q: '「{来|く}る」の{命令形|めいれいけい}は？', options: ['{来|く}れ', '{来|こ}い', '{来|き}ろ', '{来|こ}よ'], correct: 1, why: '**{来|こ}い** (こい). 〔koi〕' },
        { q: '（{火事|かじ}で）「エレベーターを（　）！{階段|かいだん}を{使|つか}え！」', options: ['{使|つか}うな', '{使|つか}いな', '{使|つか}え', '{使|つか}わせろ'], correct: 0, why: 'Cấm dùng thang máy → **{使|つか}うな**; {使|つか}え = dùng đi (lệnh cho cầu thang). 〔Erebeetaa o tsukau na! Kaidan o tsukae!〕' },
        { q: '（{先生|せんせい}が{子|こ}どもたちに）「{静|しず}かに（　）。」', options: ['しなさい', 'するなさい', 'させなさい', 'しろなさい'], correct: 0, why: 'します → **しなさい**. 〔Shizuka ni shinasai.〕' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b23-buoi-3-you-ni-iu',
  kind: 'review',
  title: 'Buổi 3 — Kể lại lời dặn: từ mới chỗ làm & xin phép · ～ように言う・頼む・注意する・伝える · ～ように言われる · nhận ra ～させられる · hội thoại ③ · nói 1 phút',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng 「～」と言われた (ポイント 118 + bị động Bài 22), học từ chỗ làm & xin phép (部下・部長・課長・早退・担当・～の代わりに・意見・任せる・報告・指示), kể lại lời bảo / nhờ / cấm bằng ～ように言う・頼む・注意する・伝える và khi mình là người được dặn bằng ～ように言われる, đổi qua lại câu trích nguyên văn ↔ câu ように, nhận ra ～させられる (bị bắt làm) và phân biệt bốn thể れる・られる・せる, đóng vai hội thoại ③ (ひまわり食堂), rồi nói được 1 phút "Hồi nhỏ của tôi".',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — trò "truyền lời": giáo viên thì thầm 「{明日|あした}{辞書|じしょ}を{持|も}ってきてください」 với bạn đầu bàn, bạn đó kể lại cho cả lớp. Câu hỏi: "Kể lại lời dặn thế nào cho gọn, không cần nhắc nguyên câu?"',
        '**Từ mới (8′)** — nhóm E (chỗ làm & xin phép: {部下|ぶか}, {部長|ぶちょう}, {課長|かちょう}, {早退|そうたい}, {担当|たんとう}, ～の{代|か}わりに, {意見|いけん}, {任|まか}せる, {報告|ほうこく}, {指示|しじ}).',
        '**Ngữ pháp (20′)** — ⑧ ～ように{言|い}う・{頼|たの}む・{注意|ちゅうい}する・{伝|つた}える · ～ように{言|い}われる · trích nguyên văn ↔ ように · ⑨ nhận ra ～させられる · bảng bốn thể.',
        '**Hội thoại (10′)** — ③ ナタポン xin anh 小林 về sớm, rồi kèm bạn mới リン.',
        '**チャレンジ + できる！ (7′)** — "truyền lời" theo cặp; nói 1 phút "Hồi nhỏ của tôi". Cuối buổi: 5 câu kiểm tra cả Bài 23.',
      ],
    },
    {
      t: 'slides',
      id: 'b23-b3-slides',
      title: 'Bài 23 子どもの頃 — Buổi 3: ～ように言う・～させられる',
      slides: [
        {
          tieuDe: '{第23課|だいにじゅうさんか} Buổi 3 — kể lại lời dặn',
          anh: ['speech-balloon', 'man-office-worker', 'memo'],
          nhan: ['{言|い}う', '{部長|ぶちょう}', 'メモ'],
          dong: ['{部長|ぶちょう}に{報告書|ほうこくしょ}を{出|だ}すように{言|い}われました。'],
          ro: ['Buchou ni houkokusho o dasu you ni iwaremashita.'],
          ghi: 'Buổi 1: bắt / cho (～させる). Buổi 2: xin được làm, ra lệnh. Buổi 3: KỂ LẠI các lời bảo đó cho người thứ ba — ～ように{言|い}う／{言|い}われる — và nhận ra câu "bị bắt" ～させられる.',
        },
        {
          tieuDe: 'Khởi động — 「～」と{言|い}われました',
          anh: ['woman', 'speech-balloon'],
          nhan: ['{母|はは}', '「～」'],
          dong: ['{母|はは}に「{早|はや}く{寝|ね}なさい」と{言|い}われました。', 'コーチに「{走|はし}れ」と{言|い}われました。'],
          ro: ['Haha ni "Hayaku nenasai" to iwaremashita.', 'Koochi ni "Hashire" to iwaremashita.'],
          hoi: 'Người dặn đi với trợ từ gì trong câu bị động?',
          dap: '**に** ({母|はは}に, コーチに) — ôn Bài 22.',
          ghi: 'Trích nguyên văn thì phải nhớ đúng câu gốc (mệnh lệnh, なさい, てください…). Hôm nay học cách kể GỌN hơn: ～ように{言|い}われました.',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑤ — Ở công ty',
          anh: ['man-office-worker', 'woman-office-worker', 'clipboard'],
          nhan: ['{上司|じょうし}', '{部下|ぶか}', '{報告|ほうこく}'],
          dong: ['{仕事|しごと}が{終|お}わったら、{上司|じょうし}に{報告|ほうこく}します。', '{部長|ぶちょう}の{指示|しじ}どおりに{資料|しりょう}を{作|つく}りました。'],
          ro: ['Shigoto ga owattara, joushi ni houkoku shimasu.', 'Buchou no shiji doori ni shiryou o tsukurimashita.'],
          hoi: 'Gọi trực tiếp sếp: 「{上司|じょうし}さん」 hay 「{部長|ぶちょう}」?',
          dap: '**{部長|ぶちょう}** (chức danh). {上司|じょうし} chỉ dùng khi kể cho người khác.',
          ghi: 'Thêm: {担当|たんとう}する (phụ trách), ホウレンソウ = {報告|ほうこく}・{連絡|れんらく}・{相談|そうだん} — ba việc nhân viên mới ở Nhật phải nhớ.',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑥ — Xin phép & thay thế',
          anh: ['face-with-thermometer', 'handshake', 'person-raising-hand'],
          nhan: ['{早退|そうたい}', '{任|まか}せる', '{意見|いけん}'],
          dong: ['{母|はは}の{代|か}わりに、{私|わたし}が{行|い}きます。', 'この{仕事|しごと}は{私|わたし}に{任|まか}せてください。'],
          ro: ['Haha no kawari ni, watashi ga ikimasu.', 'Kono shigoto wa watashi ni makasete kudasai.'],
          hoi: '{任|まか}せる có phải thể sai khiến của động từ nào không?',
          dap: 'Không — **từ riêng** (giao phó). {任|まか}せてください ≈ やらせてください.',
          ghi: '{早退|そうたい} (về sớm) ↔ {遅刻|ちこく} (đến muộn — Bài 16). {意見|いけん}を{言|い}う → {一言|ひとこと}{言|い}わせてください (xin nói một câu).',
        },
        {
          tieuDe: '⑧ ～ように{言|い}う — kể lại lời BẢO làm',
          anh: ['man-teacher', 'books'],
          nhan: ['{先生|せんせい}', '{復習|ふくしゅう}'],
          dong: ['{先生|せんせい}は{学生|がくせい}に{毎日|まいにち}{復習|ふくしゅう}するように{言|い}いました。', '{母|はは}は{弟|おとうと}に{早|はや}く{寝|ね}るように{言|い}いました。'],
          ro: ['Sensei wa gakusei ni mainichi fukushuu suru you ni iimashita.', 'Haha wa otouto ni hayaku neru you ni iimashita.'],
          bang: { head: ['', 'Khuôn'], rows: [['bảo làm', 'A は B に V{辞書形|じしょけい} ように{言|い}う'], ['bảo đừng làm', 'A は B に Vない ように{言|い}う']] },
          hoi: 'Người được dặn đi với trợ từ gì?',
          dap: '**に** ({学生|がくせい}に, {弟|おとうと}に).',
          ghi: 'Trước ように chỉ có thể từ điển hoặc ない — không có ~~寝なさいように~~, ~~寝ますように~~.',
        },
        {
          tieuDe: '⑧ ～ないように · {頼|たの}む · {注意|ちゅうい}する · {伝|つた}える',
          anh: ['person-running', 'folded-hands', 'telephone-receiver'],
          nhan: ['{注意|ちゅうい}', '{頼|たの}む', '{伝|つた}える'],
          dong: ['{弟|おとうと}に{道|みち}で{走|はし}らないように{注意|ちゅうい}しました。', '{友達|ともだち}にノートを{見|み}せてくれるように{頼|たの}みました。', 'リンさんに10{時|じ}に{来|く}るように{伝|つた}えてください。'],
          ro: ['Otouto ni michi de hashiranai you ni chuui shimashita.', 'Tomodachi ni nooto o misete kureru you ni tanomimashita.', 'Rin-san ni juuji ni kuru you ni tsutaete kudasai.'],
          hoi: 'Nhờ bạn cho mượn bút — kể lại bằng ように thế nào?',
          dap: '{友達|ともだち}にペンを{貸|か}してくれるように{頼|たの}みました.',
          ghi: 'Bốn động từ đi sau ように: {言|い}う (bảo) · {頼|たの}む (nhờ) · {注意|ちゅうい}する (nhắc) · {伝|つた}える (nhắn lại). Người nhận lời dặn: ngang hàng hoặc dưới.',
        },
        {
          tieuDe: '⑧ ～ように{言|い}われる — MÌNH được dặn',
          anh: ['health-worker', 'shortcake'],
          nhan: ['{医者|いしゃ}', '{甘|あま}いもの'],
          dong: ['{医者|いしゃ}に{甘|あま}いものを{食|た}べないように{言|い}われました。', '{店長|てんちょう}に、{仕事|しごと}を{教|おし}えるように{言|い}われています。'],
          ro: ['Isha ni amai mono o tabenai you ni iwaremashita.', 'Tenchou ni, shigoto o oshieru you ni iwarete imasu.'],
          hoi: '～ように{言|い}われ**ている** khác ～ように{言|い}われ**た** thế nào?',
          dap: '～ている: lời dặn vẫn còn hiệu lực, mình đang phải theo; ～た: kể việc đã bị dặn.',
          ghi: 'Rất hay dùng để giải thích ở chỗ làm: {部長|ぶちょう}に～ように{言|い}われているので、～ (vì được sếp dặn nên…).',
        },
        {
          tieuDe: '⭐ Trích nguyên văn ↔ ように',
          bang: {
            head: ['「～」と{言|い}われた', '～ように{言|い}われた'],
            rows: [
              ['「{早|はや}く{寝|ね}なさい」', '{早|はや}く{寝|ね}るように'],
              ['「{走|はし}れ」', '{走|はし}るように'],
              ['「{入|はい}るな」', '{入|はい}らないように'],
              ['「{手伝|てつだ}ってください」（{頼|たの}まれた）', '{手伝|てつだ}うように{頼|たの}まれた'],
            ],
          },
          hoi: '「{遅|おく}れないでください」と{言|い}われた → ように?',
          dap: '{遅|おく}れないように{言|い}われた.',
          ghi: 'Mọi mức ra lệnh (mệnh lệnh, なさい, てください, てくれませんか) khi kể lại đều gom về thể từ điển / ない + ように. Đó là lý do mẫu này "lịch sự" — không phải nhắc lại câu thô.',
        },
        {
          tieuDe: '⚠ Hai bẫy của ～ように',
          dong: ['{忘|わす}れないように、メモします。(Bài 21 — mục đích)', '{忘|わす}れないように{言|い}いました。(Bài 23 — lời dặn)'],
          ro: ['Wasurenai you ni, memo shimasu.', 'Wasurenai you ni iimashita.'],
          hoi: '「{明日|あした}{雨|あめ}が{降|ふ}るように{言|い}いました」 đúng không?',
          dap: 'Sai — câu kể / dự báo dùng **と**: {雨|あめ}が{降|ふ}ると{言|い}いました. ように chỉ cho lời BẢO / NHỜ / CẤM.',
          ghi: 'Nhìn động từ ngay sau ように: {言|い}う・{頼|たの}む・{注意|ちゅうい}する・{伝|つた}える → lời dặn; động từ khác (メモする, {練習|れんしゅう}する) → mục đích.',
        },
        {
          tieuDe: '⑨ ～させられる — "bị bắt làm" (chỉ cần nhận ra)',
          anh: ['musical-keyboard', 'weary-face'],
          nhan: ['ピアノ', '{嫌|いや}だった'],
          dong: ['{子|こ}どもの{頃|ころ}、{母|はは}に{毎日|まいにち}ピアノを{練習|れんしゅう}させられました。', '{駅|えき}で{友達|ともだち}に{一時間|いちじかん}も{待|ま}たされました。'],
          ro: ['Kodomo no koro, haha ni mainichi piano o renshuu saseraremashita.', 'Eki de tomodachi ni ichijikan mo matasaremashita.'],
          hoi: 'Ai bắt? Ai bị bắt?',
          dap: 'Người đi với **に** ({母|はは}に, {友達|ともだち}に) là người bắt; chủ ngữ (tôi) bị bắt.',
          ghi: 'Sai khiến ① + bị động (Bài 22). Cấp N3 — Bài 23 chỉ cần NGHE / ĐỌC ra nghĩa "bị bắt (không muốn)".',
        },
        {
          tieuDe: '⑨ Nhận ra hình dạng',
          bang: {
            head: ['Nhóm', 'Sai khiến bị động'],
            rows: [
              ['1', '{行|い}かされる · {飲|の}まされる · {待|ま}たされる · {習|なら}わされる'],
              ['1 (đuôi す)', '{話|はな}させられる (không rút gọn)'],
              ['2', '{食|た}べさせられる'],
              ['3', 'させられる · {来|こ}させられる'],
            ],
          },
          hoi: 'Thấy 「～かされ」「～まされ」「させられ」 trong bài nghe → nghĩ ngay gì?',
          dap: '"Bị bắt làm" — người nói than phiền (hoặc sau này biết ơn).',
          ghi: 'Đừng nhầm {待|ま}たされた (mình bị bắt chờ) ↔ {待|ま}たせた (mình làm người khác chờ).',
        },
        {
          tieuDe: '⭐ Bốn thể có れる・られる・せる',
          bang: {
            head: ['Thể', '{書|か}く', '{食|た}べる', 'Nghĩa'],
            rows: [
              ['Khả năng', '{書|か}ける', '{食|た}べられる', 'làm được'],
              ['Bị động', '{書|か}かれる', '{食|た}べられる', 'bị / được (ai) làm'],
              ['Sai khiến', '{書|か}かせる', '{食|た}べさせる', 'bắt / cho làm'],
              ['Sai khiến bị động', '{書|か}かされる', '{食|た}べさせられる', 'bị bắt làm'],
            ],
          },
          hoi: '{食|た}べられる có mấy nghĩa?',
          dap: 'Hai: ăn được (khả năng) và bị ăn (bị động) — nhóm 2 trùng hình. Xem ngữ cảnh.',
          ghi: 'Chép bảng này vào vở — đây là bảng đề N4 / N3 hay cài bẫy nhất của cả chặng 21–25.',
        },
        {
          tieuDe: '{会話|かいわ}③ — ひまわり{食堂|しょくどう}',
          anh: ['man-cook', 'man-student', 'woman-student'],
          nhan: ['{小林店長|こばやしてんちょう}', 'ナタポン', 'リン'],
          dong: ['5{時|じ}に{帰|かえ}らせていただけませんか。', 'リンさんに、10{時|じ}に{来|く}るように{言|い}っておいて。', '{手|て}を{洗|あら}うようにって、{店長|てんちょう}が{言|い}っていたよ。'],
          ro: ['Goji ni kaerasete itadakemasen ka.', 'Rin-san ni, juuji ni kuru you ni itte oite.', 'Te o arau you ni tte, tenchou ga itte ita yo.'],
          hoi: 'リン xin làm việc gì? Nói thế nào?',
          dap: 'Rửa bát: お{皿洗|さらあら}いをやらせてもらえませんか.',
          ghi: 'Đọc to hội thoại ③ theo nhóm ba. Đánh dấu: câu xin phép (④), câu dặn (⑧ ～ように{言|い}っておいて／{伝|つた}えて), câu thuật lại (～ようにって{言|い}っていた).',
        },
        {
          tieuDe: 'チャレンジ — 伝言ゲーム (truyền lời)',
          anh: ['speech-balloon', 'ear', 'memo'],
          nhan: ['A', 'B', 'C'],
          dong: ['A → B：「{明日|あした}、{辞書|じしょ}を{持|も}ってきてください」', 'B → C：{先生|せんせい}が、{明日|あした}{辞書|じしょ}を{持|も}ってくるように{言|い}っていたよ。'],
          ro: ['A → B: "Ashita, jisho o motte kite kudasai"', 'B → C: Sensei ga, ashita jisho o motte kuru you ni itte ita yo.'],
          hoi: 'A nói 「{遅|おく}れるな」 — B kể lại cho C thế nào?',
          dap: '{遅|おく}れないように{言|い}っていたよ.',
          ghi: 'Nhóm 3 người, mỗi người nghĩ 2 lời dặn (1 làm, 1 đừng làm). Kể lại bằng ように — ai trích nguyên văn bị trừ điểm!',
        },
        {
          tieuDe: 'できる！ — nói 1 phút "Hồi nhỏ của tôi"',
          anh: ['child', 'framed-picture', 'house-with-garden'],
          nhan: ['{子|こ}ども', '{思|おも}い{出|で}', '{家|いえ}'],
          dong: ['① {私|わたし}は～で{育|そだ}ちました。{両親|りょうしん}は～でした。', '② {母|はは}は{私|わたし}に～させました。～させてくれました。', '③ よく～ように{言|い}われました。', '④ その{頃|ころ}は～が、{今|いま}は～。{子|こ}どもに～させたいです。'],
          ro: ['Watashi wa ~ de sodachimashita. Ryoushin wa ~ deshita.', 'Haha wa watashi ni ~ sasemashita. ~ sasete kuremashita.', 'Yoku ~ you ni iwaremashita.', 'Sono koro wa ~ ga, ima wa ~. Kodomo ni ~ sasetai desu.'],
          hoi: 'Bấm giờ 1 phút — nói đủ 4 ý chưa?',
          dap: 'Bài mẫu ở mục 7 (Luyện nói) — đọc lại nếu chưa đủ.',
          ghi: 'Mỗi ý ít nhất 1 mẫu của Bài 23. Giám khảo chấm: đủ ý, đúng chia sai khiến (không さ thừa), có câu ように, giọng tự nhiên.',
        },
        {
          tieuDe: 'まとめ — cả Bài 23',
          bang: {
            head: ['#', 'Mẫu', 'Ví dụ'],
            rows: [
              ['①②', 'B を／に V(さ)せる (bắt)', '{弟|おとうと}に{野菜|やさい}を{食|た}べさせた'],
              ['③', '～させてくれる／もらう · B を{心配|しんぱい}させる', '{留学|りゅうがく}させてくれた'],
              ['④', '～させてください／いただけませんか', '{休|やす}ませていただけませんか'],
              ['⑤⑥⑦', '{走|はし}れ · {触|さわ}るな · {寝|ね}なさい', 'HLV · biển báo · bố mẹ'],
              ['⑧', '～ように{言|い}う／{言|い}われる', '{来|く}るように{言|い}われた'],
              ['⑨', '～させられる (nhận ra)', '{練習|れんしゅう}させられた'],
            ],
          },
          ghi: 'Bài về nhà: viết bài văn 「{子|こ}どもの{頃|ころ}の{思|おも}い{出|で}」 (mục 8) và làm mục 9 Bài tập + Luyện thêm. Bài 24: kính ngữ, khiêm nhường ngữ, ～かどうか — ～させていただきます sẽ học trọn ở đó.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: trò "truyền lời"' },
    {
      t: 'p',
      text: 'Giáo viên thì thầm với bạn ngồi đầu bàn: 「{明日|あした}、{辞書|じしょ}を{持|も}ってきてください。それから、{遅|おく}れないでください。」 Bạn đó đứng lên kể lại cho cả lớp. Lần đầu, hầu hết đều trích nguyên văn: 先生は「辞書を持ってきてください」と言いました. Giáo viên: "Đúng, nhưng dài. Người Nhật kể gọn hơn: **{先生|せんせい}が、{辞書|じしょ}を{持|も}ってくるように、{遅|おく}れないように{言|い}っていました**." Cả lớp viết hai câu lên vở — đó là mẫu ⑧ của hôm nay.',
    },
    {
      t: 'mcq',
      id: 'b23-b3-khoi-dong',
      title: 'Khởi động — ôn 「～」と言われた, ～ないで, bị động (4 câu)',
      items: [
        { q: '{母|はは}（　）「{早|はや}く{起|お}きなさい」と{言|い}われました。', options: ['に', 'を', 'が', 'で'], correct: 0, why: 'Bị động: người nói đi với **に** (Bài 22). 〔Haha ni "Hayaku okinasai" to iwaremashita.〕' },
        { q: '{先生|せんせい}は「ここでは{写真|しゃしん}を（　）でください」と{言|い}いました。', options: ['{撮|と}らない', '{撮|と}らなく', '{撮|と}るな', '{撮|と}らせない'], correct: 0, why: '**Vない + でください** (ポイント 88): {撮|と}らないでください. 〔Shashin o toranaide kudasai.〕' },
        { q: '{弟|おとうと}にケーキを（　）、{悲|かな}しかったです。', options: ['{食|た}べられて', '{食|た}べさせて', '{食|た}べて', '{食|た}べられるように'], correct: 0, why: 'Bị động phiền (Bài 22): **{食|た}べられて** — bị em ăn mất bánh. 〔Otouto ni keeki o taberarete…〕' },
        { q: '{本田先生|ほんだせんせい}は「{来週|らいしゅう}テストをします」と（　）。', options: ['{言|い}いました', '{言|い}わせました', '{言|い}うようにしました', '{言|い}われるように'], correct: 0, why: 'Câu kể (thông báo) → **「～」と{言|い}いました** (ポイント 118). Không dùng ように với câu kể.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: bảng phân công ở văn phòng' },
    {
      t: 'table',
      caption: 'Giáo viên vẽ bảng phân công công việc ở phòng của trưởng phòng 田中 — mỗi dòng là một từ mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['**{部長|ぶちょう}**：{田中|たなか} → **{部下|ぶか}**：{西川|にしかわ}・{山口|やまぐち}', 'buchou · buka', 'trưởng phòng · cấp dưới'],
        ['{会議|かいぎ}の{資料|しりょう}：{西川|にしかわ}さんが**{担当|たんとう}**', 'tantou', 'phụ trách'],
        ['{終|お}わったら、すぐ**{上司|じょうし}**に**{報告|ほうこく}**すること', 'joushi · houkoku', 'cấp trên · báo cáo'],
        ['{部長|ぶちょう}の**{指示|しじ}**どおりに{作|つく}る', 'shiji', 'chỉ thị'],
        ['{金曜日|きんようび}：{山口|やまぐち}さん**{早退|そうたい}** → {西川|にしかわ}さんが{山口|やまぐち}さんの**{代|か}わりに**{電話|でんわ}{番|ばん}', 'soutai · kawari ni', 'về sớm · thay cho'],
        ['{会議|かいぎ}：みんな**{意見|いけん}**を{言|い}うこと！ {進行|しんこう}は{山口|やまぐち}さんに**{任|まか}せる**', 'iken · makaseru', 'ý kiến · giao phó'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{部長|ぶちょう}は{西川|にしかわ}さんに{会議|かいぎ}の{資料|しりょう}を{担当|たんとう}させました。', 'Buchou wa Nishikawa-san ni kaigi no shiryou o tantou sasemashita.', 'Trưởng phòng giao cho anh Nishikawa phụ trách tài liệu họp.'),
        E('{仕事|しごと}が{終|お}わったら、すぐ{上司|じょうし}に{報告|ほうこく}するように{言|い}われています。', 'Shigoto ga owattara, sugu joushi ni houkoku suru you ni iwarete imasu.', 'Tôi được dặn là xong việc thì báo ngay cho sếp.'),
        E('{山口|やまぐち}さんの{代|か}わりに、{私|わたし}が{電話|でんわ}に{出|で}ます。', 'Yamaguchi-san no kawari ni, watashi ga denwa ni demasu.', 'Tôi sẽ nghe điện thoại thay chị Yamaguchi.'),
        E('{会議|かいぎ}で{私|わたし}にも{意見|いけん}を{言|い}わせてください。', 'Kaigi de watashi ni mo iken o iwasete kudasai.', 'Ở cuộc họp xin cho tôi cũng được nêu ý kiến.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～ように言う: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b23-b3-doi',
      title: 'Luyện nhanh — đổi câu trích nguyên văn sang ように (8 câu)',
      kind: 'fill',
      grammar: '「Vなさい／Vろ／Vてください」→ V辞書形 ように · 「Vるな／Vないでください」→ Vない ように',
      items: [
        { q: '「{早|はや}く{寝|ね}なさい」と{言|い}われた → {早|はや}く＿＿{言|い}われた', answers: V('{寝|ね}るように') },
        { q: '「{急|いそ}げ」と{言|い}われた → ＿＿{言|い}われた', answers: V('{急|いそ}ぐように') },
        { q: '「ここに{座|すわ}ってください」と{言|い}われた → ここに＿＿{言|い}われた', answers: V('{座|すわ}るように') },
        { q: '「{遅|おく}れるな」と{言|い}われた → ＿＿{言|い}われた', answers: V('{遅|おく}れないように') },
        { q: '「{触|さわ}らないでください」と{言|い}われた → ＿＿{言|い}われた', answers: V('{触|さわ}らないように') },
        { q: '「{手伝|てつだ}って」と{頼|たの}まれた → ＿＿{頼|たの}まれた', answers: V('{手伝|てつだ}うように') },
        { q: '「{明日|あした}{来|き}なさい」と{言|い}われた → {明日|あした}＿＿{言|い}われた', answers: V('{来|く}るように') },
        { q: '「すぐ{報告|ほうこく}しろ」と{言|い}われた → すぐ＿＿{言|い}われた', answers: V('{報告|ほうこく}するように') },
      ],
    },
    {
      t: 'quiz',
      id: 'b23-b3-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～ように言う・頼む・注意する・伝える · ～ように言われる · ～させられる',
      items: [
        { q: 'Mẹ dặn em trai đừng chơi game đến khuya.', answers: V('{母|はは}は{弟|おとうと}に{夜|よる}{遅|おそ}くまでゲームをしないように{言|い}いました。'), hint: 'しない ように いいました' },
        { q: 'Tôi nhờ bạn chụp ảnh giúp.', answers: V('{友達|ともだち}に{写真|しゃしん}を{撮|と}ってくれるように{頼|たの}みました。', '{友達|ともだち}に{写真|しゃしん}を{撮|と}るように{頼|たの}みました。'), hint: 'とって くれる ように たのみました' },
        { q: 'Hãy nhắn Linh là ngày mai đến lúc 9 giờ.', answers: V('リンさんに{明日|あした}9{時|じ}に{来|く}るように{伝|つた}えてください。', 'リンさんに、{明日|あした}は9{時|じ}に{来|く}るように{伝|つた}えてください。'), hint: 'くる ように つたえて ください' },
        { q: 'Tôi được bác sĩ dặn ngủ sớm.', answers: V('{医者|いしゃ}に{早|はや}く{寝|ね}るように{言|い}われました。'), hint: 'ねる ように いわれました' },
        { q: 'Tôi đã nhắc em gái đừng nói to trong thư viện.', answers: V('{妹|いもうと}に{図書館|としょかん}で{大|おお}きい{声|こえ}で{話|はな}さないように{注意|ちゅうい}しました。', '{妹|いもうと}に{図書館|としょかん}で{大声|おおごえ}を{出|だ}さないように{注意|ちゅうい}しました。'), hint: 'はなさない ように ちゅういしました' },
        { q: 'Hồi nhỏ tôi bị bố bắt chạy mỗi sáng.', answers: V('{子|こ}どもの{頃|ころ}、{父|ちち}に{毎朝|まいあさ}{走|はし}らされました。', '{子|こ}どもの{頃|ころ}、{毎朝|まいあさ}{父|ちち}に{走|はし}らされました。', '{子|こ}どもの{頃|ころ}、{父|ちち}に{毎朝|まいあさ}{走|はし}らせられました。'), hint: 'ちちに はしらされました' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**～ように{言|い}う／{頼|たの}む／{注意|ちゅうい}する／{伝|つた}える: trước ように chỉ là thể từ điển / ない; người được dặn đi với に.** Mình là người được dặn → ～ように{言|い}われる (người dặn đi với に).',
        '**ように chỉ dùng cho lời BẢO / NHỜ / CẤM.** Câu kể, câu hỏi, lời rủ → と{言|い}う／と{聞|き}く／と{誘|さそ}う. Và nhớ phân biệt ように (mục đích — Bài 21) bằng động từ đứng sau.',
        '**～させられる = bị bắt làm (N3 — nhận ra).** Nhóm 1 rút gọn ～される ({行|い}かされる); đuôi す không rút gọn ({話|はな}させられる). {待|ま}たされた ≠ {待|ま}たせた.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{昨日|きのう}、{私|わたし}は{何|なに}をするように{言|い}いましたか。', ro: 'Kinou, watashi wa nani o suru you ni iimashita ka.', vi: 'Hôm qua thầy đã dặn các em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{作文|さくぶん}を{手|て}で{書|か}いて、{月曜日|げつようび}に{出|だ}すように{言|い}いました。', ro: 'Sakubun o te de kaite, getsuyoubi ni dasu you ni iimashita.', vi: 'Thầy dặn viết bài văn bằng tay và nộp vào thứ Hai ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'ご{両親|りょうしん}に、よくどんなことを{言|い}われましたか。「ように」を{使|つか}ってください。', ro: 'Goryoushin ni, yoku donna koto o iwaremashita ka. "You ni" o tsukatte kudasai.', vi: 'Em hay được bố mẹ dặn gì? Dùng "you ni" nhé.' },
        { who: 'Bạn', role: 'candidate', text: '{父|ちち}に、{嘘|うそ}をつかないように{言|い}われました。{母|はは}には、{寝|ね}る{前|まえ}に{歯|は}を{磨|みが}くように{言|い}われました。', ro: 'Chichi ni, uso o tsukanai you ni iwaremashita. Haha ni wa, neru mae ni ha o migaku you ni iwaremashita.', vi: 'Bố dặn em đừng nói dối. Còn mẹ thì dặn đánh răng trước khi ngủ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{待|ま}たせた」と「{待|ま}たされた」はどう{違|ちが}いますか。', ro: '"Mataseta" to "matasareta" wa dou chigaimasu ka.', vi: '"Mataseta" và "matasareta" khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「{待|ま}たせた」は{私|わたし}がほかの{人|ひと}を{待|ま}たせました。「{待|ま}たされた」は{私|わたし}がほかの{人|ひと}に{待|ま}たされました。', ro: '"Mataseta" wa watashi ga hoka no hito o matasemashita. "Matasareta" wa watashi ga hoka no hito ni matasaremashita.', vi: '"Mataseta" là em làm người khác chờ. "Matasareta" là em bị người khác bắt chờ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'では、{子|こ}どもの{頃|ころ}のことを{一分|いっぷん}で{話|はな}してください。', ro: 'Dewa, kodomo no koro no koto o ippun de hanashite kudasai.', vi: 'Vậy em hãy kể về hồi nhỏ của mình trong 1 phút.' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}はダナンで{育|そだ}ちました。{両親|りょうしん}は{厳|きび}しくて、{毎日|まいにち}{英語|えいご}を{勉強|べんきょう}させました。でも、{夏|なつ}は{海|うみ}で{自由|じゆう}に{遊|あそ}ばせてくれました。{今|いま}は{両親|りょうしん}に{感謝|かんしゃ}しています。', ro: 'Watashi wa Danan de sodachimashita. Ryoushin wa kibishikute, mainichi eigo o benkyou sasemashita. Demo, natsu wa umi de jiyuu ni asobasete kuremashita. Ima wa ryoushin ni kansha shite imasu.', vi: 'Em lớn lên ở Đà Nẵng. Bố mẹ nghiêm, bắt em học tiếng Anh mỗi ngày. Nhưng mùa hè thì cho em chơi thoải mái ở biển. Giờ em rất biết ơn bố mẹ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi — cả Bài 23 (5 câu)',
      items: [
        { q: '{先生|せんせい}は{学生|がくせい}に、{教室|きょうしつ}でスマホを{使|つか}わない（　）{言|い}いました。', options: ['ように', 'ために', 'ことに', 'のに'], correct: 0, why: 'Kể lại lời cấm → **Vない + ように{言|い}う**. 〔Tsukawanai you ni iimashita.〕' },
        { q: '{私|わたし}は{部長|ぶちょう}に、{明日|あした}までに{資料|しりょう}を{作|つく}るように（　）。', options: ['{言|い}われました', '{言|い}いました', '{言|い}わせました', '{言|い}えました'], correct: 0, why: 'Mình được dặn, người dặn đi với に → **{言|い}われました**. 〔Shiryou o tsukuru you ni iwaremashita.〕' },
        { q: '{子|こ}どもの{頃|ころ}、{兄|あに}に{毎日|まいにち}{宿題|しゅくだい}を（　）。', options: ['{手伝|てつだ}わされました', '{手伝|てつだ}わせました', '{手伝|てつだ}われました', '{手伝|てつだ}ってくれました'], correct: 0, why: 'Tôi BỊ anh bắt giúp bài tập → **{手伝|てつだ}わされました** (⑨). 〔Ani ni shukudai o tetsudawasaremashita.〕' },
        { q: '{父|ちち}は{私|わたし}を{一人|ひとり}で{外国|がいこく}へ（　）くれました。', options: ['{旅行|りょこう}させて', '{旅行|りょこう}して', '{旅行|りょこう}されて', '{旅行|りょこう}させられて'], correct: 0, why: 'Bố CHO tôi đi → **{旅行|りょこう}させてくれました** (③). 〔Hitori de gaikoku e ryokou sasete kuremashita.〕' },
        { q: '{部長|ぶちょう}、すみません。{今日|きょう}は{早|はや}く（　）いただけませんか。', options: ['{帰|かえ}らせて', '{帰|かえ}らさせて', '{帰|かえ}って', '{帰|かえ}られて'], correct: 0, why: 'Xin cho MÌNH về → **{帰|かえ}らせていただけませんか** — không さ thừa. 〔Hayaku kaerasete itadakemasen ka.〕' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 49 từ của mục Từ vựng). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{頃|ころ}', 'koro', 'hồi, thuở'],
  ['{幼|おさな}い', 'osanai', 'còn nhỏ, thơ ấu'],
  ['{幼稚園|ようちえん}', 'youchien', 'trường mẫu giáo'],
  ['{大人|おとな}', 'otona', 'người lớn'],
  ['{育|そだ}てます', 'sodatemasu', 'nuôi dạy, nuôi lớn'],
  ['{育|そだ}ちます', 'sodachimasu', 'lớn lên'],
  ['{親|おや}', 'oya', 'bố mẹ (nói chung)'],
  ['{厳|きび}しい', 'kibishii', 'nghiêm khắc'],
  ['{甘|あま}やかします', 'amayakashimasu', 'nuông chiều'],
  ['{懐|なつ}かしい', 'natsukashii', 'bồi hồi nhớ (thứ ngày xưa)'],
  ['おもちゃ', 'omocha', 'đồ chơi'],
  ['お{使|つか}い', 'otsukai', 'việc đi mua đồ giúp'],
  ['{留守番|るすばん}', 'rusuban', 'việc trông nhà'],
  ['{習|なら}い{事|ごと}', 'naraigoto', 'môn học năng khiếu'],
  ['{塾|じゅく}', 'juku', 'lớp học thêm, luyện thi'],
  ['{世話|せわ}をします', 'sewa o shimasu', 'chăm sóc'],
  ['{皿洗|さらあら}い', 'saraarai', 'việc rửa bát đĩa'],
  ['{干|ほ}します', 'hoshimasu', 'phơi'],
  ['{畳|たた}みます', 'tatamimasu', 'gấp (quần áo)'],
  ['{着替|きが}えます', 'kigaemasu', 'thay quần áo'],
  ['{虫|むし}', 'mushi', 'côn trùng'],
  ['いたずら', 'itazura', 'trò nghịch ngợm'],
  ['{反省|はんせい}します', 'hansei shimasu', 'tự kiểm điểm, hối lỗi'],
  ['{嫌|いや}がります', 'iyagarimasu', 'tỏ ra không thích'],
  ['わがまま', 'wagamama', 'ích kỷ, đòi hỏi'],
  ['{好|す}き{嫌|きら}い', 'sukikirai', 'sự kén chọn (ăn)'],
  ['{残|のこ}します', 'nokoshimasu', 'để thừa, bỏ lại'],
  ['{泣|な}き{虫|むし}', 'nakimushi', 'đứa hay khóc nhè'],
  ['{言|い}うことを{聞|き}きます', 'iu koto o kikimasu', 'vâng lời'],
  ['{素直|すなお}', 'sunao', 'ngoan, thật thà'],
  ['{命令|めいれい}', 'meirei', 'mệnh lệnh'],
  ['{許可|きょか}', 'kyoka', 'sự cho phép'],
  ['{反対|はんたい}します', 'hantai shimasu', 'phản đối'],
  ['{賛成|さんせい}します', 'sansei shimasu', 'tán thành'],
  ['{投|な}げます', 'nagemasu', 'ném'],
  ['{逃|に}げます', 'nigemasu', 'chạy trốn'],
  ['{大声|おおごえ}', 'oogoe', 'tiếng to'],
  ['{応援|おうえん}します', 'ouen shimasu', 'cổ vũ, ủng hộ'],
  ['{部活|ぶかつ}', 'bukatsu', 'câu lạc bộ ở trường'],
  ['{課長|かちょう}', 'kachou', 'trưởng ban'],
  ['{部下|ぶか}', 'buka', 'cấp dưới'],
  ['{部長|ぶちょう}', 'buchou', 'trưởng phòng'],
  ['{早退|そうたい}します', 'soutai shimasu', 'về sớm'],
  ['{担当|たんとう}します', 'tantou shimasu', 'phụ trách'],
  ['～の{代|か}わりに', '~ no kawari ni', 'thay cho ~'],
  ['{意見|いけん}', 'iken', 'ý kiến'],
  ['{任|まか}せます', 'makasemasu', 'giao phó'],
  ['{報告|ほうこく}します', 'houkoku shimasu', 'báo cáo'],
  ['{指示|しじ}', 'shiji', 'chỉ thị'],
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
  id: 'b23-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (40 câu)',
  goal: 'Nhớ chắc 49 từ của Bài 23 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp dễ nhầm (頃・ごろ, 親・両親, 厳しい・怖い, 注意する・しかる・怒る, 塾・習い事・部活, 飼う・育てる・買う, 賛成・反対 (に) ↔ 応援 (を), 許可・許す, 上司・部長) và cặp tự ↔ tha (育つ・育てる, 残る・残す, 逃げる・逃がす).',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 15 câu Nhật → Việt và 10 câu Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N4.',
        'Lỗi hay mắc: {子|こ}どもの~~ごろ~~ (→ {頃|ころ}), {子|こ}どもを~~{飼|か}う~~ (→ {育|そだ}てる), {意見|いけん}~~を~~{賛成|さんせい}する (→ に), チーム~~に~~{応援|おうえん}する (→ を), ~~{上司|じょうし}さん~~ (→ {部長|ぶちょう}), {先生|せんせい}に~~{怒|おこ}られた~~ khi chỉ bị nhắc nhẹ (→ {注意|ちゅうい}された).',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b23-lt1-nv', title: 'Nhật → Việt (15 câu)', items: MCQ_NV(0, 15) },
    { t: 'mcq', id: 'b23-lt1-vn', title: 'Việt → Nhật (10 câu)', items: MCQ_VN(25, 35) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b23-lt1-dien',
      title: 'Điền từ (15 câu)',
      items: [
        { q: '{小学生|しょうがくせい}の（　）、{毎日|まいにち}{友達|ともだち}と{公園|こうえん}で{遊|あそ}びました。', options: ['{頃|ころ}', 'ごろ', '{前|まえ}', '{間|あいだ}に'], correct: 0, why: '**{小学生|しょうがくせい}の{頃|ころ}** = hồi tiểu học. ごろ chỉ sau số. 〔Shougakusei no koro…〕' },
        { q: '{二十歳|はたち}になったら、もう（　）です。', options: ['{大人|おとな}', '{親|おや}', '{部下|ぶか}', '{上司|じょうし}'], correct: 0, why: '20 tuổi = **{大人|おとな}** (người lớn). 〔Mou otona desu.〕' },
        { q: '{祖母|そぼ}は{一人|ひとり}で{三人|さんにん}の{子|こ}どもを（　）。', options: ['{育|そだ}てました', '{育|そだ}ちました', '{飼|か}いました', '{甘|あま}やかしました'], correct: 0, why: 'Nuôi con (を) → tha động từ **{育|そだ}てる**. {飼|か}う chỉ cho con vật. 〔Kodomo o sodatemashita.〕' },
        { q: '{昔|むかし}の{友達|ともだち}に{会|あ}って、とても（　）なりました。', options: ['{懐|なつ}かしく', '{厳|きび}しく', '{幼|おさな}く', '{素直|すなお}に'], correct: 0, why: 'Gặp bạn cũ → bồi hồi: **{懐|なつ}かしく**なる. 〔Natsukashiku narimashita.〕' },
        { q: '{母|はは}に{頼|たの}まれて、スーパーへ（　）に{行|い}きました。', options: ['お{使|つか}い', '{留守番|るすばん}', '{世話|せわ}', '{部活|ぶかつ}'], correct: 0, why: 'Được mẹ nhờ đi mua đồ = **お{使|つか}いに{行|い}く**. 〔Otsukai ni ikimashita.〕' },
        { q: '{中学生|ちゅうがくせい}のとき、{高校|こうこう}の{試験|しけん}のために{毎晩|まいばん}（　）に{通|かよ}っていました。', options: ['{塾|じゅく}', '{習|なら}い{事|ごと}', '{幼稚園|ようちえん}', '{部活|ぶかつ}'], correct: 0, why: 'Luyện thi ngoài trường = **{塾|じゅく}**. {習|なら}い{事|ごと} là năng khiếu. 〔Juku ni kayotte imashita.〕' },
        { q: '{雨|あめ}がやんだので、{布団|ふとん}を{外|そと}に（　）。', options: ['{干|ほ}しました', '{畳|たた}みました', '{着替|きが}えました', '{残|のこ}しました'], correct: 0, why: 'Trời tạnh → mang chăn ra **phơi**: **{干|ほ}す**. 〔Futon o soto ni hoshimashita.〕' },
        { q: '{夏|なつ}の{夜|よる}は、{窓|まど}を{開|あ}けると（　）が{入|はい}ってきます。', options: ['{虫|むし}', 'おもちゃ', '{大声|おおごえ}', '{指示|しじ}'], correct: 0, why: 'Mở cửa sổ ban đêm → **{虫|むし}** bay vào. 〔Mushi ga haitte kimasu.〕' },
        { q: '{弟|おとうと}は{親|おや}の（　）を{全然|ぜんぜん}{聞|き}きません。', options: ['{言|い}うこと', '{命令|めいれい}', '{意見|いけん}', '{報告|ほうこく}'], correct: 0, why: 'Cụm cố định **{親|おや}の{言|い}うことを{聞|き}く** (vâng lời bố mẹ). 〔Oya no iu koto o kikimasen.〕' },
        { q: '{子|こ}どもの{頃|ころ}は（　）が{多|おお}くて、{野菜|やさい}を{全然|ぜんぜん}{食|た}べませんでした。', options: ['{好|す}き{嫌|きら}い', 'いたずら', 'わがまま', '{反省|はんせい}'], correct: 0, why: 'Không ăn rau = **{好|す}き{嫌|きら}いが{多|おお}い** (kén ăn). 〔Sukikirai ga ookute…〕' },
        { q: '{会議|かいぎ}で、{私|わたし}は{田中|たなか}さんの{意見|いけん}に（　）しました。', options: ['{賛成|さんせい}', '{応援|おうえん}', '{命令|めいれい}', '{担当|たんとう}'], correct: 0, why: '**{意見|いけん}に{賛成|さんせい}する** (tán thành ý kiến — trợ từ に). {応援|おうえん} đi với を. 〔Iken ni sansei shimashita.〕' },
        { q: 'ここで{写真|しゃしん}を{撮|と}るときは、{係|かかり}の{人|ひと}の（　）が{必要|ひつよう}です。', options: ['{許可|きょか}', '{命令|めいれい}', '{指示|しじ}', '{意見|いけん}'], correct: 0, why: 'Chụp ảnh cần **sự cho phép** = **{許可|きょか}**. 〔Kakari no hito no kyoka ga hitsuyou desu.〕' },
        { q: '{犬|いぬ}が{家|いえ}から（　）しまったので、みんなで{探|さが}しています。', options: ['{逃|に}げて', '{投|な}げて', '{拾|ひろ}って', '{育|そだ}って'], correct: 0, why: 'Con chó chạy mất = **{逃|に}げてしまった**. 〔Inu ga ie kara nigete shimatta.〕' },
        { q: 'この{仕事|しごと}は{西川|にしかわ}さんが（　）しています。わからないことは{西川|にしかわ}さんに{聞|き}いてください。', options: ['{担当|たんとう}', '{早退|そうたい}', '{反対|はんたい}', '{応援|おうえん}'], correct: 0, why: 'Người **phụ trách** việc = **{担当|たんとう}する**. 〔Nishikawa-san ga tantou shite imasu.〕' },
        { q: '{今日|きょう}は{課長|かちょう}が{休|やす}みなので、{私|わたし}が{課長|かちょう}の（　）{会議|かいぎ}に{出|で}ます。', options: ['{代|か}わりに', 'ために', 'ように', '{指示|しじ}で'], correct: 0, why: 'Dự họp **thay cho** trưởng ban = **～の{代|か}わりに**. 〔Kachou no kawari ni kaigi ni demasu.〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b23-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống, đồng âm (22 câu)',
  goal: 'Đọc đúng và chọn đúng 15 chữ Hán mới của Bài 23 trong từ (子どもの頃・幼稚園・子供・命令・命・許可・可能・飼う・拾う・投げる・逃げる・片付ける・片道・厳しい・虫・虫歯・反対・反省), phân biệt chữ trông giống (拾・捨, 投・役, 逃・挑, 令・冷, 反・友・返, 可・何, 幼・幻) và từ đồng âm (飼う・買う, 片道・方道).',
  minutes: 25,
  blocks: [
    { t: 'h', text: '🟢 Mức 1 — Dễ: đọc từ in đậm' },
    {
      t: 'mcq',
      id: 'b23-lt2-doc',
      title: '漢字読み (10 câu)',
      items: [
        { q: '**若い頃**、{日本|にほん}に{住|す}んでいました。', options: ['わかいころ', 'わかいごろ', 'じゃくいころ', 'わかいとき'], correct: 0, why: '**{若|わか}い{頃|ころ}** (wakai koro) — sau tính từ đọc ころ.' },
        { q: '**幼稚園**の{先生|せんせい}になりたいです。', options: ['よちえん', 'ようちえん', 'ようじえん', 'おさちえん'], correct: 1, why: '**{幼稚園|ようちえん}** (youchien) — よう trường âm.' },
        { q: '**命**を{大切|たいせつ}にしてください。', options: ['めい', 'いのち', 'みょう', 'いき'], correct: 1, why: '**{命|いのち}** (inochi) — đứng riêng đọc kun.' },
        { q: 'その{日|ひ}は{雨|あめ}の**可能性**があります。', options: ['かのうせい', 'かのせい', 'がのうせい', 'かのうしょう'], correct: 0, why: '**{可能性|かのうせい}** (kanousei).' },
        { q: '{道|みち}でお{金|かね}を**拾**いました。', options: ['ひろ', 'す', 'しゅう', 'ひら'], correct: 0, why: '**{拾|ひろ}いました** (hiroimashita).' },
        { q: '{石|いし}を**投**げないでください。', options: ['な', 'とう', 'う', 'ほ'], correct: 0, why: '**{投|な}げないで** (nagenaide).' },
        { q: '{東京|とうきょう}まで**片道**{二時間|にじかん}です。', options: ['へんどう', 'かたみち', 'かたどう', 'ほうみち'], correct: 1, why: '**{片道|かたみち}** (katamichi) — kun + kun.' },
        { q: '{甘|あま}いものを{食|た}べすぎて**虫歯**になった。', options: ['むしば', 'ちゅうし', 'むしは', 'ちゅうば'], correct: 0, why: '**{虫歯|むしば}** (mushiba) — は → ば.' },
        { q: '{先生|せんせい}は{私|わたし}たちに**厳**しかった。', options: ['きび', 'げん', 'おごそ', 'けわ'], correct: 0, why: '**{厳|きび}しかった** (kibishikatta).' },
        { q: '{自分|じぶん}のしたことを**反省**しています。', options: ['はんしょう', 'はんせい', 'へんせい', 'ほんせい'], correct: 1, why: '**{反省|はんせい}** (hansei).' },
      ],
    },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn chữ đúng (表記)' },
    {
      t: 'mcq',
      id: 'b23-lt2-chon',
      title: '表記 (8 câu)',
      items: [
        { q: '{子|こ}どもの**ころ**の{写真|しゃしん}', options: ['頃', '項', '傾', '頂'], correct: 0, why: '**頃** = 匕 + 頁. 項 (hạng mục) trái là 工.' },
        { q: '**おさない**{子|こ}ども', options: ['幻い', '幼い', '幽い', '効い'], correct: 1, why: '**幼い** — 幺 + 力.' },
        { q: '{部長|ぶちょう}の**めいれい**', options: ['命冷', '名令', '命令', '明令'], correct: 2, why: '**命令** — 命 (口 + 令) + 令.' },
        { q: '{会社|かいしゃ}の**きょか**', options: ['許可', '許河', '計可', '許何'], correct: 0, why: '**許可** — 可 không có 氵, không có 亻.' },
        { q: '{猫|ねこ}を**かって**いる。(nuôi)', options: ['買って', '飼って', '飲って', '飾って'], correct: 1, why: '**飼う** = nuôi. 買う = mua.' },
        { q: '**にげろ**！', options: ['逃げろ', '桃げろ', '跳げろ', '兆げろ'], correct: 0, why: '**逃げろ** — 辶 + 兆.' },
        { q: 'おもちゃを**かたづけて**ください。', options: ['方付けて', '片付けて', '版付けて', '片附けて'], correct: 1, why: '**片付ける** (viết chuẩn ngày nay; 片附ける là cách viết cũ).' },
        { q: '{両親|りょうしん}は{留学|りゅうがく}に**はんたい**した。', options: ['反対', '友対', '返対', '坂対'], correct: 0, why: '**反対** — 厂 + 又.' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Khó: chữ giống & đồng âm' },
    {
      t: 'mcq',
      id: 'b23-lt2-bay',
      title: 'Bẫy chữ giống, đồng âm (4 câu)',
      items: [
        { q: 'ごみを（　）てはいけません。でも、{落|お}ちているごみは（　）ましょう。', options: ['捨／拾', '拾／捨', '捨／捨', '拾／拾'], correct: 0, why: '**{捨|す}てて**はいけません (đừng vứt) · **{拾|ひろ}い**ましょう (hãy nhặt). Hai chữ cùng 扌 nhưng nghĩa ngược.' },
        { q: '「{役|やく}に{立|た}つ」の「やく」と、「{投|な}げる」の「な」— 二つの{漢字|かんじ}の{違|ちが}いは？', options: ['左が彳と扌', '右が殳と又', '上が人と入', '同じ字'], correct: 0, why: '役 = **彳** + 殳; 投 = **扌** + 殳. Cùng phải 殳, khác trái.' },
        { q: '「つめたい」の{漢字|かんじ}は？', options: ['冷たい', '令たい', '命たい', '今たい'], correct: 0, why: '**冷** = 冫 (băng) + 令. 令 một mình không có âm つめ.' },
        { q: '「{友|とも}」「{反|はん}」「{返|かえ}す」— đúng hay sai: "cả ba có 又"?', options: ['Đúng', 'Sai'], correct: 0, why: 'Đúng: 友 = ナ + **又**; 反 = 厂 + **又**; 返 = 辶 + 反 (có 又 trong 反).' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b23-lt-3-chia',
  kind: 'homework',
  title: 'Luyện thêm 3 · Chia & nối — sai khiến, xin được làm, mệnh lệnh, cấm, なさい, ように, させられる (30 câu gõ)',
  goal: 'Gõ đúng dạng của từng động từ (3 nhóm + ngoại lệ) ở bảy thể của Bài 23 và nối thành câu: sai khiến, sai khiến + くれる／もらう, ～させてください／いただけませんか, mệnh lệnh, cấm, ～なさい, ～ように言う／言われる, ～させられる.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Gõ bằng kana hoặc chữ Hán đều được. Câu nào sai: mở lại **⭐ BẢNG CHIA TRỌN BÀI** ở mục Ngữ pháp, tìm đúng hàng của động từ đó.',
        'Ba bẫy chiếm nửa số lỗi: **さ thừa** ở nhóm 1 (~~{休|やす}まさせる~~), **{来|く}る** (こさせる・こい・きなさい), **nhóm 1 ngoại lệ** {帰|かえ}る・{入|はい}る・{走|はし}る (らせる・れ).',
      ],
    },
    {
      t: 'quiz',
      id: 'b23-lt3-chia',
      title: '🟢 Chia một động từ (16 câu)',
      kind: 'fill',
      grammar: 'sai khiến · mệnh lệnh · cấm · なさい · sai khiến bị động',
      items: [
        { q: '{洗|あら}う → sai khiến', answers: V('{洗|あら}わせる'), hint: 'う → わ' },
        { q: '{急|いそ}ぐ → sai khiến', answers: V('{急|いそ}がせる'), hint: 'ぐ → が' },
        { q: '{呼|よ}ぶ → sai khiến', answers: V('{呼|よ}ばせる'), hint: 'ぶ → ば' },
        { q: '{入|はい}る → sai khiến', answers: V('{入|はい}らせる'), hint: 'nhóm 1 ngoại lệ' },
        { q: '{着替|きが}える → sai khiến', answers: V('{着替|きが}えさせる'), hint: 'nhóm 2' },
        { q: '{心配|しんぱい}する → sai khiến', answers: V('{心配|しんぱい}させる'), hint: 'する → させる' },
        { q: '{連|つ}れてくる → sai khiến', answers: V('{連|つ}れて{来|こ}させる', '{連|つ}れてこさせる'), hint: 'くる → こさせる' },
        { q: '{言|い}う → mệnh lệnh', answers: V('{言|い}え'), hint: 'う → え' },
        { q: '{座|すわ}る → mệnh lệnh', answers: V('{座|すわ}れ'), hint: 'る → れ (nhóm 1)' },
        { q: '{投|な}げる → mệnh lệnh', answers: V('{投|な}げろ'), hint: 'nhóm 2' },
        { q: 'くれる → mệnh lệnh', answers: ['くれ'], hint: 'ngoại lệ' },
        { q: '{持|も}ってくる → mệnh lệnh', answers: V('{持|も}って{来|こ}い', '{持|も}ってこい'), hint: 'こい' },
        { q: '{来|く}る → cấm (～な)', answers: V('{来|く}るな'), hint: 'くるな' },
        { q: '{起|お}きる → ～なさい', answers: V('{起|お}きなさい'), hint: 'おきます → おきなさい' },
        { q: '{待|ま}つ → sai khiến bị động (rút gọn)', answers: V('{待|ま}たされる', '{待|ま}たせられる'), hint: 'た ＋ される' },
        { q: '{話|はな}す → sai khiến bị động', answers: V('{話|はな}させられる'), hint: 'đuôi す: không rút gọn' },
      ],
    },
    {
      t: 'quiz',
      id: 'b23-lt3-noi',
      title: '🟡 Nối thành câu (14 câu)',
      kind: 'fill',
      grammar: 'Gõ phần còn thiếu theo gợi ý trong ngoặc',
      items: [
        { q: '{母|はは}は{私|わたし}に{毎日|まいにち}{日記|にっき}を＿＿。（{書|か}く — bắt, quá khứ）', answers: V('{書|か}かせました', '{書|か}かせた'), hint: 'かかせました' },
        { q: '{先生|せんせい}は{私|わたし}たちを{教室|きょうしつ}に＿＿。（{残|のこ}る — bắt, quá khứ）', answers: V('{残|のこ}らせました', '{残|のこ}らせた'), hint: 'のこらせました' },
        { q: '{父|ちち}は{私|わたし}に{車|くるま}を＿＿。（{運転|うんてん}する — cho, biết ơn, quá khứ）', answers: V('{運転|うんてん}させてくれました', '{運転|うんてん}させてくれた'), hint: 'させて くれました' },
        { q: '{子|こ}どもの{頃|ころ}、{漫画|まんが}を＿＿。（{読|よ}む — không được cho, quá khứ）', answers: V('{読|よ}ませてもらえませんでした', '{読|よ}ませてもらえなかった'), hint: 'よませて もらえませんでした' },
        { q: '{弟|おとうと}はいつも{母|はは}を＿＿。（{困|こま}る — gây cảm xúc）', answers: V('{困|こま}らせます', '{困|こま}らせています', '{困|こま}らせる'), hint: 'こまらせます' },
        { q: '{先生|せんせい}、その{荷物|にもつ}、{私|わたし}に＿＿。（{持|も}つ — xung phong）', answers: V('{持|も}たせてください'), hint: 'もたせて ください' },
        { q: '{部長|ぶちょう}、{来週|らいしゅう}{一日|いちにち}＿＿。（{休|やす}む — xin lịch sự nhất）', answers: V('{休|やす}ませていただけませんか'), hint: 'やすませて いただけませんか' },
        { q: 'すみません、ちょっとこのパソコンを＿＿。（{使|つか}う — xin, mềm）', answers: V('{使|つか}わせてもらえませんか'), hint: 'つかわせて もらえませんか' },
        { q: '（{試合|しあい}で）＿＿！（{負|ま}ける — cấm）', answers: V('{負|ま}けるな'), hint: 'まけるな' },
        { q: '（{火事|かじ}で）{早|はや}く＿＿！（{逃|に}げる — mệnh lệnh）', answers: V('{逃|に}げろ'), hint: 'にげろ' },
        { q: '（{母|はは}が{子|こ}に）{早|はや}く{服|ふく}を＿＿。（{着替|きが}える — なさい）', answers: V('{着替|きが}えなさい'), hint: 'きがえなさい' },
        { q: '{先生|せんせい}は{学生|がくせい}に{辞書|じしょ}を{持|も}って＿＿{言|い}いました。（{来|く}る — ように）', answers: V('{来|く}るように', 'くるように'), hint: 'くる ように' },
        { q: '{医者|いしゃ}にお{酒|さけ}を＿＿{言|い}われました。（{飲|の}む — đừng, ように）', answers: V('{飲|の}まないように'), hint: 'のまない ように' },
        { q: '{子|こ}どもの{頃|ころ}、{母|はは}に{毎日|まいにち}{塾|じゅく}に＿＿。（{行|い}く — bị bắt, quá khứ）', answers: V('{行|い}かされました', '{行|い}かせられました', '{行|い}かされた'), hint: 'いかされました' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b23-lt-4-phan-biet',
  kind: 'homework',
  title: 'Luyện thêm 4 · Ngữ pháp — 🟡 chọn trong từng cặp → 🔴 bẫy đề N4 (26 câu)',
  goal: 'Chọn đúng trong các cặp đề N4 hay hỏi của Bài 23: を ↔ に của người làm, ～させた ↔ ～させられた ↔ ～させてくれた, ～させてください ↔ ～てください, mệnh lệnh ↔ khả năng, ～な ↔ ～なさい ↔ ～な(あ), ～ように言う ↔ ～と言う, ように (mục đích) ↔ ように言う, 待たせる ↔ 待たされる, và các bẫy chia (さ thừa, 来る, nhóm 1 ngoại lệ).',
  minutes: 30,
  blocks: [
    { t: 'h', text: '🟡 Mức 2 — Chọn trong từng cặp (14 câu)' },
    {
      t: 'mcq',
      id: 'b23-lt4-cap',
      title: 'Cặp dễ nhầm',
      items: [
        { q: '{先生|せんせい}は{学生|がくせい}（　）{漢字|かんじ}を{書|か}かせました。', options: ['を', 'に'], correct: 1, why: 'Có **{漢字|かんじ}を** → người làm đi với **に**.' },
        { q: '{母|はは}は{妹|いもうと}（　）{買|か}い{物|もの}に{行|い}かせました。', options: ['を', 'に'], correct: 0, why: '{行|い}く là tự động từ, câu không có N を khác → **を**. (に dùng được với sắc thái "để em tự đi theo ý em" — N3; đề N4 chọn を.)' },
        { q: '{子|こ}どもの{頃|ころ}、{私|わたし}は{父|ちち}に{毎朝|まいあさ}{走|はし}ら（　）。', options: ['せました', 'されました'], correct: 1, why: 'Chủ ngữ {私|わたし}, {父|ちち}**に** = người bắt → **{走|はし}らされました** (bị bắt chạy).' },
        { q: '{父|ちち}は{毎朝|まいあさ}{私|わたし}を{走|はし}ら（　）。', options: ['せました', 'されました'], correct: 0, why: 'Chủ ngữ {父|ちち} (người bắt), {私|わたし}を → **{走|はし}らせました**.' },
        { q: '{両親|りょうしん}は{私|わたし}を{留学|りゅうがく}させて（　）。', options: ['くれました', 'もらいました'], correct: 0, why: 'Chủ ngữ là {両親|りょうしん} (người cho) → **くれました**. もらう cần chủ ngữ {私|わたし}: {私|わたし}は{両親|りょうしん}に{留学|りゅうがく}させてもらいました.' },
        { q: '（{自分|じぶん}が{帰|かえ}りたい）{店長|てんちょう}、{今日|きょう}は{早|はや}く（　）ください。', options: ['{帰|かえ}って', '{帰|かえ}らせて'], correct: 1, why: 'MÌNH muốn về → **{帰|かえ}らせてください**. {帰|かえ}ってください = bảo anh chủ về.' },
        { q: '（コーチが）「もっと{速|はや}く（　）！」', options: ['{走|はし}れ', '{走|はし}れる'], correct: 0, why: 'Mệnh lệnh = **{走|はし}れ**. {走|はし}れる là khả năng.' },
        { q: '（{看板|かんばん}）「ここで{泳|およ}ぐ（　）」', options: ['な', 'なさい'], correct: 0, why: 'Thể từ điển + **な** = cấm. なさい đi sau thân thể ます ({泳|およ}ぎなさい).' },
        { q: '（{母|はは}が）「{早|はや}く{宿題|しゅくだい}をし（　）。」', options: ['なさい', 'るな'], correct: 0, why: 'し(ます) + **なさい** = làm bài tập đi. ～るな không gắn sau し.' },
        { q: '{本田先生|ほんだせんせい}は「{明日|あした}は{休講|きゅうこう}です」（　）。', options: ['と{言|い}いました', 'ように{言|い}いました'], correct: 0, why: 'Thông báo (câu kể) → **と{言|い}いました**. ように chỉ cho lời bảo / nhờ / cấm.' },
        { q: '{本田先生|ほんだせんせい}は{私|わたし}たちに{明日|あした}{休|やす}まない（　）。', options: ['と{言|い}いました', 'ように{言|い}いました'], correct: 1, why: 'Lời dặn "đừng nghỉ" → **ように{言|い}いました**.' },
        { q: '{忘|わす}れない（　）、メモします。', options: ['ように', 'ように{言|い}って'], correct: 0, why: 'Mục đích (Bài 21): **{忘|わす}れないように**、メモする — để khỏi quên.' },
        { q: '{遅|おく}れて、{友達|ともだち}を{三十分|さんじゅっぷん}も（　）。', options: ['{待|ま}たせました', '{待|ま}たされました'], correct: 0, why: 'Mình làm bạn chờ → **{待|ま}たせました**.' },
        { q: '{友達|ともだち}が{遅|おく}れて、{三十分|さんじゅっぷん}も（　）。', options: ['{待|ま}たせました', '{待|ま}たされました'], correct: 1, why: 'Bạn đến muộn, mình phải chờ → **{待|ま}たされました** (bị bắt chờ).' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Bẫy đề N4 (12 câu)' },
    {
      t: 'mcq',
      id: 'b23-lt4-bay',
      title: 'Bẫy cách chia và cách dùng',
      items: [
        { q: '「{読|よ}む」の{使役形|しえきけい}は？', options: ['{読|よ}まさせる', '{読|よ}ませる', '{読|よ}めさせる', '{読|よ}みさせる'], correct: 1, why: '**{読|よ}ませる** — không さ thừa.' },
        { q: '「{走|はし}る」の{使役形|しえきけい}は？', options: ['{走|はし}させる', '{走|はし}らせる', '{走|はし}れさせる', '{走|はし}りさせる'], correct: 1, why: '{走|はし}る là nhóm 1 ngoại lệ → **{走|はし}らせる**.' },
        { q: '「{来|く}る」＋ なさい は？', options: ['{来|く}なさい', '{来|こ}なさい', '{来|き}なさい', '{来|く}るなさい'], correct: 2, why: '{来|き}ます → **{来|き}なさい** (きなさい).' },
        { q: '「くれる」の{命令形|めいれいけい}は？', options: ['くれろ', 'くれ', 'くれよ', 'くれい'], correct: 1, why: 'Ngoại lệ: **くれ** (～てくれ).' },
        { q: '{試験|しけん}の{結果|けっか}がわかったら、すぐ（　）ください。', options: ['{知|し}らせて', '{知|し}って', '{知|し}られて', '{知|し}らさせて'], correct: 0, why: '**{知|し}らせる** = báo cho biết — trông như sai khiến của {知|し}る nhưng là từ dùng riêng (như {見|み}せる, {寝|ね}かせる, {任|まか}せる). {知|し}らさせて có さ thừa. 〔Sugu shirasete kudasai.〕' },
        { q: '{子|こ}どもを（　）とき、{母|はは}は{歌|うた}を{歌|うた}います。（ru con ngủ）', options: ['{寝|ね}させる', '{寝|ね}かせる', '{寝|ね}られる', '{寝|ね}ろ'], correct: 1, why: 'Ru / đặt con ngủ → **{寝|ね}かせる** (từ riêng). {寝|ね}させる = bảo / để ai đi ngủ.' },
        { q: '{私|わたし}は{部長|ぶちょう}に{資料|しりょう}を（　）。（{部長|ぶちょう}が{見|み}てくれた — lịch sự）', options: ['{見|み}させました', '{見|み}ていただきました', '{見|み}せられました', '{見|み}させてくれました'], correct: 1, why: 'Không "sai khiến" sếp → **{見|み}ていただきました** (Bài 18).' },
        { q: '{父|ちち}は{私|わたし}（　）{好|す}きな{大学|だいがく}を{選|えら}ばせてくれました。', options: ['に', 'を', 'が', 'で'], correct: 0, why: 'Có **{大学|だいがく}を** → người được cho làm đi với **に**.' },
        { q: '「{入|はい}るな」と{言|い}われました ＝ {入|はい}ら（　）{言|い}われました。', options: ['ないように', 'ように', 'ないで', 'なさいと'], correct: 0, why: 'Cấm → **Vない + ように**: {入|はい}らないように{言|い}われました.' },
        { q: '{先生|せんせい}に「{一緒|いっしょ}に{昼|ひる}ご{飯|はん}を{食|た}べませんか」と（　）。', options: ['{誘|さそ}われました', '{食|た}べるように{言|い}われました', '{食|た}べさせられました', '{食|た}べろと{言|い}われました'], correct: 0, why: 'Lời RỦ (～ませんか) → **{誘|さそ}われました** (được mời — Bài 22). Không dùng ように cho lời rủ.' },
        { q: '{弟|おとうと}に{部屋|へや}を{掃除|そうじ}（　）、{母|はは}に{怒|おこ}られました。', options: ['させないで', 'されて', 'させられて', 'させて'], correct: 3, why: 'Mình **bắt em** dọn phòng (～させて) nên bị mẹ mắng. させられて = mình bị em bắt (vô lý ở đây).' },
        { q: 'お{客|きゃく}さんに「お（　）しました」と{言|い}います。', options: ['{待|ま}ち', '{待|ま}たせ', '{待|ま}たされ', '{待|ま}って'], correct: 1, why: 'Câu cố định **お{待|ま}たせしました**.' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b23-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp kiểu N4 — 文字・語彙 · 文法 · 読解 (18 câu, có thang điểm)',
  goal: 'Làm một đề nhỏ kiểu JLPT N4 trộn từ vựng, chữ Hán, ngữ pháp và đọc hiểu của Bài 23 trong 30 phút; tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Thang điểm & cách ôn',
      items: [
        '**文字・語彙** 6 câu × 1 điểm · **文法** 8 câu × 1,5 điểm (12) · **読解** 4 câu × 2 điểm (8). Tổng **26 điểm**. ≥ 20: vững Bài 23 · 14–19: ôn lại phần sai · < 14: làm lại 3 buổi trên lớp.',
        'Sai câu 文字・語彙 → mục 2 Từ vựng + mục 4 Chữ Hán. Sai 文法 1–3 → mẫu ①②③ · 4–5 → ④⑤⑥⑦ · 6–8 → ⑧⑨. Sai 読解 → đọc lại mục 6 "Chiến thuật đọc".',
        'Làm trong **30 phút**, không xem lời giải trước khi xong cả đề.',
      ],
    },
    {
      t: 'mcq',
      id: 'b23-lt5-moji',
      title: '文字・語彙 (6 câu)',
      items: [
        { q: '{子|こ}どもの**頃**、よく{山|やま}へ{虫|むし}を{取|と}りに{行|い}きました。（{読|よ}み）', options: ['ごろ', 'ころ', 'とき', 'じ'], correct: 1, why: '**{頃|ころ}** sau N の đọc ころ.' },
        { q: '{会議室|かいぎしつ}を{使|つか}うには、**きょか**がいります。（{表記|ひょうき}）', options: ['許化', '許可', '計可', '許加'], correct: 1, why: '**許可**.' },
        { q: '{父|ちち}は{私|わたし}の{留学|りゅうがく}に（　）しましたが、{母|はは}は{賛成|さんせい}してくれました。', options: ['{反対|はんたい}', '{応援|おうえん}', '{反省|はんせい}', '{担当|たんとう}'], correct: 0, why: 'Đối với {賛成|さんせい} → **{反対|はんたい}**.' },
        { q: '{弟|おとうと}は{毎日|まいにち}{犬|いぬ}の（　）をしています。', options: ['{世話|せわ}', '{留守番|るすばん}', 'お{使|つか}い', '{習|なら}い{事|ごと}'], correct: 0, why: '**{犬|いぬ}の{世話|せわ}をする** (chăm chó).' },
        { q: '「{祖父|そふ}は{孫|まご}を{甘|あま}やかします。」と{意味|いみ}が{近|ちか}いのは？', options: ['{祖父|そふ}は{孫|まご}にとても{厳|きび}しいです。', '{祖父|そふ}は{孫|まご}に{何|なん}でもさせてあげます。', '{祖父|そふ}は{孫|まご}を{育|そだ}てています。', '{祖父|そふ}は{孫|まご}によく{注意|ちゅうい}します。'], correct: 1, why: '{甘|あま}やかす = nuông chiều ≈ **{何|なん}でもさせてあげる** (cho làm mọi thứ).' },
        { q: '「{素直|すなお}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{今日|きょう}は{天気|てんき}が{素直|すなお}です。', '{彼|かれ}は{素直|すなお}に{自分|じぶん}の{間違|まちが}いを{認|みと}めました。', 'この{料理|りょうり}は{素直|すなお}な{味|あじ}です。', '{素直|すなお}な{道|みち}を{歩|ある}きます。'], correct: 1, why: '{素直|すなお} dùng cho **thái độ của người** — thành thật nhận lỗi. ({認|みと}める = thừa nhận — N3.)' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-lt5-bunpou',
      title: '文法 (8 câu — 6 câu điền + 2 câu ★)',
      items: [
        { q: '{母|はは}は{私|わたし}（　）{毎晩|まいばん}{皿|さら}を{洗|あら}わせました。', options: ['を', 'に', 'が', 'と'], correct: 1, why: 'Có **{皿|さら}を** → **に**.' },
        { q: '{高校生|こうこうせい}のとき、{父|ちち}はアルバイトを（　）。', options: ['させてくれませんでした', 'させられませんでした', 'してくれませんでした', 'させていただきませんでした'], correct: 0, why: 'Bố không CHO đi làm thêm → **させてくれませんでした**.' },
        { q: '{遅|おく}れてごめん。{長|なが}い{時間|じかん}（　）ね。', options: ['{待|ま}たせた', '{待|ま}たされた', '{待|ま}った', '{待|ま}たれた'], correct: 0, why: 'Mình làm bạn chờ → **{待|ま}たせた**.' },
        { q: '{先生|せんせい}、{明日|あした}の{授業|じゅぎょう}を{見学|けんがく}（　）いただけませんか。', options: ['させて', 'して', 'されて', 'させられて'], correct: 0, why: 'Xin cho mình được dự giờ → **{見学|けんがく}させていただけませんか**.' },
        { q: '（{道|みち}で）「{危|あぶ}ない！{車|くるま}が{来|く}るぞ！（　）！」', options: ['{止|と}まれ', '{止|と}まるな', '{止|と}められ', '{止|と}まらせ'], correct: 0, why: 'Khẩn cấp → mệnh lệnh **{止|と}まれ**.' },
        { q: '{医者|いしゃ}に、{毎日|まいにち}{三十分|さんじゅっぷん}{歩|ある}く（　）{言|い}われました。', options: ['ように', 'ために', 'ことに', 'そうに'], correct: 0, why: 'Lời dặn → **ように{言|い}われました**.' },
        { q: '★ {部長|ぶちょう}に ＿＿ ＿＿ ★ ＿＿ います。（{言|い}われて／{来|く}る／ように／{八時|はちじ}に）', options: ['{言|い}われて', '{来|く}る', 'ように', '{八時|はちじ}に'], correct: 2, why: 'Câu đúng: {部長|ぶちょう}に **{八時|はちじ}に {来|く}る ように {言|い}われて** います. Ô ★ (thứ 3) = **ように**.' },
        { q: '★ {子|こ}どもの{頃|ころ}、＿＿ ＿＿ ★ ＿＿ ました。（{母|はは}に／{練習|れんしゅう}／させられ／ピアノを）', options: ['{母|はは}に', '{練習|れんしゅう}', 'させられ', 'ピアノを'], correct: 1, why: 'Câu đúng: {子|こ}どもの{頃|ころ}、**{母|はは}に ピアノを {練習|れんしゅう} させられ** ました. Ô ★ (thứ 3) = **{練習|れんしゅう}**.' },
      ],
    },
    {
      t: 'passage',
      title: '読解 — {父|ちち}の{言葉|ことば}（パク）',
      intro: 'Đọc đoạn văn rồi trả lời 4 câu hỏi.',
      paras: [
        { text: '{私|わたし}の{父|ちち}は{料理|りょうり}が{上手|じょうず}で、{子|こ}どもの{頃|ころ}、{週末|しゅうまつ}はいつも{私|わたし}に{料理|りょうり}を{手伝|てつだ}わせました。{最初|さいしょ}は{野菜|やさい}を{洗|あら}うことしかさせてくれませんでしたが、{十歳|じゅっさい}のとき、{初|はじ}めて{包丁|ほうちょう}を{使|つか}わせてくれました。{父|ちち}は「{指|ゆび}を{切|き}らないように、ゆっくり{切|き}りなさい」と{何度|なんど}も{言|い}いました。' },
        { text: '{中学生|ちゅうがくせい}になると、{私|わたし}は{部活|ぶかつ}が{忙|いそが}しくなって、{料理|りょうり}を{手伝|てつだ}わなくなりました。でも{父|ちち}は{怒|おこ}らないで、「{好|す}きなことを{一生懸命|いっしょうけんめい}やりなさい」と{言|い}ってくれました。' },
        { text: '{今|いま}、{私|わたし}は{日本|にほん}で{一人|ひとり}で{生活|せいかつ}しています。{毎日|まいにち}{自分|じぶん}で{料理|りょうり}を{作|つく}ると、{父|ちち}と{一緒|いっしょ}に{台所|だいどころ}に{立|た}った{週末|しゅうまつ}を{思|おも}い{出|だ}します。{来月|らいげつ}{国|くに}へ{帰|かえ}ったら、{今度|こんど}は{私|わたし}が{父|ちち}に{日本|にほん}の{料理|りょうり}を{作|つく}ってあげるつもりです。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b23-lt5-doc',
      title: '読解 (4 câu)',
      items: [
        { q: '{十歳|じゅっさい}になる{前|まえ}、パクさんは{料理|りょうり}の{何|なに}を{手伝|てつだ}いましたか。', options: ['{野菜|やさい}を{切|き}ること', '{野菜|やさい}を{洗|あら}うこと', '{料理|りょうり}を{全部|ぜんぶ}{作|つく}ること', '{何|なに}も{手伝|てつだ}わなかった'], correct: 1, why: '**{最初|さいしょ}は{野菜|やさい}を{洗|あら}うことしかさせてくれませんでした** — ～しか…ない = chỉ.' },
        { q: '{父|ちち}は{包丁|ほうちょう}を{使|つか}うとき、{何|なん}と{言|い}いましたか。', options: ['{早|はや}く{切|き}るように', '{指|ゆび}を{切|き}らないように、ゆっくり{切|き}るように', '{包丁|ほうちょう}を{使|つか}わないように', '{一人|ひとり}で{切|き}るように'], correct: 1, why: '「{指|ゆび}を{切|き}らないように、ゆっくり{切|き}りなさい」 → kể lại: **ゆっくり{切|き}るように{言|い}った**.' },
        { q: 'パクさんが{料理|りょうり}を{手伝|てつだ}わなくなったとき、{父|ちち}はどうしましたか。', options: ['とても{怒|おこ}った', '{部活|ぶかつ}をやめさせた', '{好|す}きなことを{頑張|がんば}るように{言|い}った', '{料理|りょうり}を{手伝|てつだ}わせた'], correct: 2, why: '**{怒|おこ}らないで、「{好|す}きなことを{一生懸命|いっしょうけんめい}やりなさい」と{言|い}ってくれました**.' },
        { q: 'この{文章|ぶんしょう}の{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['パクさんは{今|いま}、{父|ちち}と{一緒|いっしょ}に{料理|りょうり}を{作|つく}っている。', 'パクさんは{国|くに}へ{帰|かえ}ったら、{父|ちち}に{料理|りょうり}を{作|つく}るつもりだ。', 'パクさんの{父|ちち}は{料理|りょうり}が{苦手|にがて}だった。', 'パクさんは{中学生|ちゅうがくせい}のとき、{父|ちち}に{怒|おこ}られた。'], correct: 1, why: 'Đoạn cuối: **{今度|こんど}は{私|わたし}が{父|ちち}に{日本|にほん}の{料理|りょうり}を{作|つく}ってあげるつもりです**. Bố nấu giỏi (bẫy ③); bố không giận (bẫy ④).' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{週末|しゅうまつ}はいつも{私|わたし}に{料理|りょうり}を{手伝|てつだ}わせました。', 'Shuumatsu wa itsumo watashi ni ryouri o tetsudawasemashita.', 'Cuối tuần bố luôn cho / bắt tôi phụ nấu ăn.'),
        E('{初|はじ}めて{包丁|ほうちょう}を{使|つか}わせてくれました。', 'Hajimete houchou o tsukawasete kuremashita.', 'Lần đầu tiên bố cho tôi dùng dao.'),
        E('{指|ゆび}を{切|き}らないように、ゆっくり{切|き}りなさい。', 'Yubi o kiranai you ni, yukkuri kirinasai.', 'Thái từ từ thôi kẻo đứt tay.'),
        E('{好|す}きなことを{一生懸命|いっしょうけんめい}やりなさい。', 'Suki na koto o isshoukenmei yarinasai.', 'Hãy hết sức làm điều con thích.'),
      ],
    },
  ],
};

export const BAI_23: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
