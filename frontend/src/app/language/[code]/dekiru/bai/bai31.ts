/**
 * Bài 31 — 推理 (Suy luận) · TIẾP SAU SÁCH, cấp N3 (xem ../SOAN-BAI.md mục 8). Bài đầu của chặng 31–35
 * (Bài 35 = kiểm tra chặng).
 * Người học đã xong Bài 1–15 (ポイント 1–124), Bài 16–24 — trong đó Bài 20 dạy cả nhóm suy đoán N4: ～そう (様態),
 * ～ようだ／みたいだ, ～らしい, ～かもしれない, ～はずだ (+ ～はずなのに, ～ないはずだ; Bài 20 hẹn "～はずがない ở Bài 31"),
 * Bài 22 bị động, Bài 23 sai khiến; Bài 25 (ôn N4); Bài 26–30 (～うちに, ～間に, ～最中に, ～たとたん · ～せいで, ～おかげで,
 * ～によって, ～ため · ～くせに, ～ものの, ～にもかかわらず, ～に対して · ～ほど, ～くらい, ～ば～ほど, ～さえ～ば, ～うえに ·
 * ～って, ～とのことだ, ～ということだ, ～にとって, ～として). KHÔNG dạy lại — chỉ dùng lại trong câu (ghi "ôn: Bài X").
 *
 * Ngữ pháp (N3) — nhóm "SUY LUẬN & KẾT LUẬN" (推量・判断・わけ): ① ～に違いない "chắc chắn là" (tin chắc, chủ quan, văn viết) ·
 * ② ～はずがない／はずはない "không lẽ nào" (phủ định có căn cứ; ↔ ～ないはずだ Bài 20; そんなはずはない) · ③ ～わけがない
 * "làm gì có chuyện" (phủ định chủ quan, mạnh; ↔ わけない "dễ ợt") · ④ ～っぽい "có vẻ, ngả về, hay…" (Nっぽい · イAっぽい ·
 * Vますっぽい) · ⑤ ～わけだ "thảo nào / tức là" (道理で・だから・つまり～わけだ) · ⑥ ～わけではない／～わけでもない "không hẳn là"
 * (phủ định một phần) ↔ ～ないわけではない "không phải là không" · ⑦ ～わけにはいかない "không thể (vì lẽ phải)" ·
 * ～ないわけにはいかない "không thể không" · ⑧ BẢNG PHÂN BIỆT: thang chắc chắn に違いない ↔ はずだ ↔ だろう ↔ かもしれない;
 * はずがない ↔ わけがない; わけだ ↔ はずだ; わけではない ↔ ないわけではない; わけにはいかない ↔ Vられない ↔ ざるを得ない (N2,
 * chỉ nhận ra) + chỉ cần NHẬN RA: ～に相違ない (N1), ～っこない (N2).
 * Từ vựng: 67 từ (N3 là chính; vài từ N2/N1 của truyện trinh thám có ghi cấp): suy luận & phán đoán, vụ việc & trinh thám,
 * đồ thất lạc & trí nhớ, lý do & giải thích, tính chất (～っぽい) & mô tả — kèm bảng TỪ DỄ NHẦM (類義語) và KẾT HỢP TỪ
 * (コロケーション). Từ đã học ở Bài 1–30 (鍵, 財布, 落とし物, 忘れ物, 見つける・見つかる, 交番, 届ける, 秘密, 泥棒, 盗む, 犯人,
 * 逃げる, 確か, まさか, きっと, もしかしたら, 実は, 様子, 表情, 偶然, 当然, 言い訳, 疑う, 根拠, 結論, 判断, 立場, 必ずしも,
 * 引き出し, 棚, しまう, なくす, 断る, 信じる, 任せる, 夜中…) KHÔNG lặp lại — gặp trong câu là ôn.
 * Chữ Hán mới (20): 推 測 現 解 能 性 恐 隠 罪 容 像 細 詳 深 過 在 印 象 鍵 袋 (N3 theo các bảng tham khảo phổ biến; 推・測・隠・
 * 袋 có bảng xếp N2, 鍵 N2–N1 (thêm vào 常用 năm 2010) — JLPT không công bố danh sách chữ chính thức) — không trùng hanTu.ts,
 * hanTu16–27.ts, hanLop.ts, bảng chữ Hán Bài 1–27 và chữ của Bài 28 (賛 議 判 断 否 認 疑 得 納 責 任 態 協 述 示 個 的 満 感 比),
 * Bài 29 (程 首 退 呼 適 満 腹 煙 貧 抜 更 良 血 骨 胃 汗 検 査 栄 養 診 防). Thẻ chữ Hán: hanTu31.ts (HAN_TU_31).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木,
 * {佐藤先生|さとうせんせい} · nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, {小林店長|こばやしてんちょう}.
 * Nối tiếp Bài 26–30: リン (năm nhất khoa Kinh tế trường {みなと大学|みなとだいがく}, ở {国際寮|こくさいりょう}), ダニエル (cùng ký túc
 * xá — hay quên đồ), カルロス (cùng ゼミ của cô 佐藤), ナタポン (cao học, làm thêm ở ひまわり食堂 của anh 小林, sắp báo cáo giữa kỳ
 * luận văn). Trong câu đố của cô 佐藤 có nhắc 西川 (nam — nghiên cứu sinh) và 木村 (nữ — trợ giảng); 山口 (nữ) là khách quen của quán.
 * Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam (trang tự đổi sang giọng thứ hai khi có hai người cùng giới).
 * Nghe: 'ja-nu' = nữ, 'ja-nam' = nam. Người MỚI (chỉ ở phần nghe): {駅員|えきいん} (nam — ja-nam), {警察官|けいさつかん} ở
 * {交番|こうばん} (nữ — ja-nu), ラジオの{司会者|しかいしゃ} (nữ — ja-nu) và {作家|さっか} khách mời (nam — ja-nam).
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
  id: 'b31-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 推理: tìm chìa khoá bị mất ở ký túc xá, câu đố "Ai ăn chiếc bánh?" trong giờ ゼミ, chiếc ví khách để quên ở ひまわり食堂',
  goal: 'Suy luận thành lời bằng tiếng Nhật: nói điều mình TIN CHẮC bằng ～に違いない (落としたに違いない), bác bỏ một khả năng có căn cứ bằng ～はずがない (ポケットだから落ちるはずがない) và bằng giọng mạnh, chủ quan ～わけがない (鍵なんか盗むわけがない); mô tả thứ "trông giống / ngả màu / hay…" bằng ～っぽい (白っぽいジャケット, 忘れっぽい); chốt lại "thảo nào…" khi hiểu ra lý do bằng ～わけだ (だから見つからなかったわけだ); nói "không hẳn là…" bằng ～わけではない; và từ chối – nhận lời có lý do bằng ～わけにはいかない (断るわけにはいかない, 届けないわけにはいかない) — ở ký túc xá, trong giờ ゼミ và ở chỗ làm thêm.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 31 — chủ đề: suy luận, truyện trinh thám, tìm đồ thất lạc, giải thích lý do (cấp N3)',
      items: [
        'Bài 20 (N4) đã học **đoán**: そう・ようだ・らしい・かもしれない・はずだ. Bài 31 học **suy luận và kết luận** ở cấp N3: "**chắc chắn là** anh ấy" (に{違|ちが}いない), "**không lẽ nào** lại rơi" (はずがない), "**làm gì có chuyện** ai trộm chìa khoá" (わけがない), "**thảo nào** tìm mãi không thấy" (わけだ), "**không hẳn là** tôi ghét" (わけではない), "**không thể** từ chối được" (わけにはいかない).',
        'Mẫu N3 của bài: **～に違いない** · **～はずがない** · **～わけがない** · **～っぽい** · **～わけだ** · **～わけではない／～わけでもない** · **～わけにはいかない** — và **bảng phân biệt** đề N3 rất hay hỏi: thang chắc chắn に違いない ↔ はずだ ↔ だろう ↔ かもしれない; はずがない ↔ わけがない; わけだ ↔ はずだ; わけではない ↔ ないわけではない.',
        'Ba tình huống: ① {国際寮|こくさいりょう} — ダニエル lại làm mất chìa khoá phòng, リン giúp anh "phá án" · ② giờ ゼミ của cô {佐藤|さとう} — câu đố trinh thám "Ai đã ăn chiếc bánh trong phòng nghiên cứu?" · ③ ひまわり{食堂|しょくどう} — một chiếc ví bị bỏ quên, và anh {小林|こばやし} nhờ ナタポン làm thêm Chủ nhật.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo. Ở cấp N3, hãy thử **nghe trước một lần không nhìn chữ** và tự đoán: người nói đang **chắc chắn**, **phủ nhận** hay **vừa hiểu ra** điều gì?',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 31 bạn làm được (できる)',
      items: [
        '**① {寮|りょう}で{探|さが}し{物|もの}** — kể lại mình đã làm gì, rồi suy luận: **コンビニで{落|お}としたに{違|ちが}いない** · bác lại: **ポケットに{入|い}れていたから、{落|お}ちるはずがない** · **{鍵|かぎ}なんか{盗|ぬす}むわけがない** · tả đồ vật: **{白|しろ}っぽいジャケット** · chốt: **だから{見|み}つからなかったわけだ**.',
        '**② ゼミの{推理|すいり}クイズ** — đặt câu hỏi kiểu thám tử ({何時|なんじ}に？{誰|だれ}が？{証拠|しょうこ}は？), loại trừ nghi phạm: **{記録|きろく}が{残|のこ}っているなら、{犯人|はんにん}のはずがない** · **{甘|あま}い{物|もの}が{嫌|きら}いな{人|ひと}が{食|た}べるわけがない** · kết luận: **{犯人|はんにん}は{先生|せんせい}に{違|ちが}いありません** · và đáp: **{私|わたし}が{食|た}べたわけではありません**.',
        '**③ アルバイト** — xử lý đồ khách bỏ quên: **{交番|こうばん}に{届|とど}けないわけにはいかない** · từ chối khéo lời nhờ của người trên mà vẫn giữ lòng: **{働|はたら}きたくないわけではないんです** · **{断|ことわ}るわけにはいかないし……** · hiểu ra: **{道理|どうり}で{最近|さいきん}、{元気|げんき}がなかったわけだ**.',
        '**できる！** — trình bày 1 phút "Một lần tôi đoán sai / tìm lại được đồ bị mất": chuyện gì xảy ra, lúc đầu mình **tin chắc** điều gì (～に違いない), vì sao điều đó **không thể** đúng (～はずがない), sự thật là gì (**だから～わけだ**), và bài học rút ra.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — muốn nói gì, dùng mẫu nào',
      head: ['Bạn muốn nói…', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['CHẮC CHẮN LÀ … (tin chắc)', '{犯人|はんにん}はあの{人|ひと}に{違|ちが}いない。', 'Hannin wa ano hito ni chigainai.', '① ～に違いない'],
        ['KHÔNG LẼ NÀO … (có căn cứ)', '{鍵|かぎ}が{落|お}ちるはずがない。', 'Kagi ga ochiru hazu ga nai.', '② ～はずがない'],
        ['LÀM GÌ CÓ CHUYỆN … (phủ nhận mạnh)', 'そんなこと、できるわけがない。', 'Sonna koto, dekiru wake ga nai.', '③ ～わけがない'],
        ['TRÔNG GIỐNG / NGẢ / HAY …', '{白|しろ}っぽい{服|ふく} · {忘|わす}れっぽい{人|ひと}', 'shiroppoi fuku · wasureppoi hito', '④ ～っぽい'],
        ['THẢO NÀO … / TỨC LÀ …', 'だから{寒|さむ}いわけだ。', 'Dakara samui wake da.', '⑤ ～わけだ'],
        ['KHÔNG HẲN LÀ … (phủ định một phần)', '{嫌|きら}いなわけではありません。', 'Kirai na wake de wa arimasen.', '⑥ ～わけではない'],
        ['KHÔNG THỂ … (vì lẽ phải, bổn phận)', '{明日|あした}は{休|やす}むわけにはいかない。', 'Ashita wa yasumu wake ni wa ikanai.', '⑦ ～わけにはいかない'],
        ['KHÔNG THỂ KHÔNG … (buộc phải)', '{届|とど}けないわけにはいかない。', 'Todokenai wake ni wa ikanai.', '⑦ ～ないわけにはいかない'],
      ],
    },

    /* ── ① 寮で ── */
    { t: 'h', text: '① {国際寮|こくさいりょう}で — "Chắc chắn là rơi ở cửa hàng tiện lợi!" — "Không lẽ nào."' },
    {
      t: 'canh',
      anh: ['old-key', 'man-student', 'woman-student', 'magnifying-glass-tilted-left', 'coat'],
      caption: '6 giờ chiều ở hành lang ký túc xá quốc tế. ダニエル đứng trước cửa phòng mình, lục tung ba lô và các túi áo. リン vừa đi học về thì thấy anh.',
    },
    {
      t: 'p',
      text: 'Tình huống: **ダニエル** lại không tìm thấy chìa khoá phòng. Anh **tin chắc** đã đánh rơi ở cửa hàng tiện lợi (**{落|お}としたに{違|ちが}いない** — mẫu ①). **リン** bác lại có căn cứ: chìa khoá ở túi quần, ví ở ba lô — **{落|お}ちるはずがない** (mẫu ②); bị trộm ư? **{盗|ぬす}むわけがない** (mẫu ③). Rồi リン để ý: buổi sáng anh mặc chiếc áo khoác **{白|しろ}っぽい** (ngả trắng — mẫu ④), giờ lại mặc áo khác. Thì ra anh đã thay áo ở thư viện — **だから{見|み}つからなかったわけだ** (thảo nào — mẫu ⑤).',
    },
    DL('Ở hành lang ký túc xá — "Lại mất chìa khoá rồi!"', [
      ['ダニエル', 'b', 'あ、リンさん。{僕|ぼく}の{部屋|へや}の{鍵|かぎ}、{見|み}なかった？どこを{探|さが}しても、ないんだ。', 'A, Rin-san. Boku no heya no kagi, minakatta? Doko o sagashite mo, nai n da.', 'À, Linh. Em có thấy chìa khoá phòng anh không? Tìm đâu cũng không thấy.'],
      ['リン', 'c', 'えっ、また{鍵|かぎ}ですか。ダニエルさんは{本当|ほんとう}に{忘|わす}れっぽいですね。{最後|さいご}に{使|つか}ったのはいつですか。', 'E, mata kagi desu ka. Danieru-san wa hontou ni wasureppoi desu ne. Saigo ni tsukatta no wa itsu desu ka.', 'Hả, lại chìa khoá ạ? Anh Daniel đúng là hay quên thật. Lần cuối anh dùng là khi nào?'],
      ['ダニエル', 'b', '{今朝|けさ}、{部屋|へや}を{出|で}るときにドアを{閉|し}めたから……それからは{一度|いちど}も{使|つか}っていない。', 'Kesa, heya o deru toki ni doa o shimeta kara…… sorekara wa ichido mo tsukatte inai.', 'Sáng nay lúc ra khỏi phòng anh đã khoá cửa… từ đó đến giờ chưa dùng lần nào.'],
      ['リン', 'c', 'じゃ、{今朝|けさ}から{行|い}った{所|ところ}を{順番|じゅんばん}に{思|おも}い{出|だ}してみましょう。', 'Ja, kesa kara itta tokoro o junban ni omoidashite mimashou.', 'Vậy mình thử nhớ lại lần lượt những chỗ anh đã đi từ sáng nhé.'],
      ['ダニエル', 'b', '{大学|だいがく}の{食堂|しょくどう}と、{図書館|としょかん}と、{帰|かえ}りにコンビニ。……あ、コンビニで{財布|さいふ}を{出|だ}したとき、{落|お}としたに{違|ちが}いない！', 'Daigaku no shokudou to, toshokan to, kaeri ni konbini. …… A, konbini de saifu o dashita toki, otoshita ni chigainai!', 'Nhà ăn của trường, thư viện, và lúc về thì ghé cửa hàng tiện lợi. … À, chắc chắn là anh đánh rơi lúc lấy ví ra ở cửa hàng tiện lợi rồi!'],
      ['リン', 'c', 'でも、{鍵|かぎ}はいつもズボンのポケットに{入|い}れていますよね。{財布|さいふ}はリュックだから、そのときに{落|お}ちるはずがありませんよ。', 'Demo, kagi wa itsumo zubon no poketto ni irete imasu yo ne. Saifu wa ryukku da kara, sono toki ni ochiru hazu ga arimasen yo.', 'Nhưng chìa khoá anh lúc nào cũng để ở túi quần mà. Ví thì ở ba lô, nên không lẽ nào lúc đó chìa khoá lại rơi.'],
      ['ダニエル', 'b', 'そうか……。じゃ、{誰|だれ}かに{盗|ぬす}まれたのかな。', 'Sou ka……. Ja, dare ka ni nusumareta no ka na.', 'Ừ nhỉ… Thế thì bị ai lấy trộm chăng?'],
      ['リン', 'c', 'まさか。{部屋|へや}の{番号|ばんごう}も{書|か}いていない{鍵|かぎ}なんか、{誰|だれ}も{盗|ぬす}むわけがないですよ。', 'Masaka. Heya no bangou mo kaite inai kagi nanka, dare mo nusumu wake ga nai desu yo.', 'Làm gì có. Cái chìa khoá chẳng ghi cả số phòng, làm gì có ai lại đi trộm.'],
      ['ダニエル', 'b', '{確|たし}かに。……うーん、{謎|なぞ}だなあ。', 'Tashika ni. …… Uun, nazo da naa.', 'Cũng đúng. … Ừm, bí ẩn thật.'],
      ['リン', 'c', 'あれ？ダニエルさん、{朝|あさ}は{白|しろ}っぽいジャケットを{着|き}ていましたよね。どうして{今|いま}は{黒|くろ}いのを{着|き}ているんですか。', 'Are? Danieru-san, asa wa shiroppoi jaketto o kite imashita yo ne. Doushite ima wa kuroi no o kite iru n desu ka.', 'Ơ kìa? Anh Daniel, sáng nay anh mặc cái áo khoác ngả trắng mà. Sao bây giờ anh lại mặc cái màu đen?'],
      ['ダニエル', 'b', '{図書館|としょかん}が{寒|さむ}かったから、ロッカーに{入|い}れておいた{厚|あつ}い{上着|うわぎ}に{着替|きが}えたんだ。……あっ！', 'Toshokan ga samukatta kara, rokkaa ni irete oita atsui uwagi ni kigaeta n da. …… A!', 'Thư viện lạnh quá nên anh thay sang cái áo dày để sẵn trong tủ đồ. … Á!'],
      ['リン', 'c', '{朝|あさ}のジャケットのポケットに{入|はい}っているんじゃないですか。', 'Asa no jaketto no poketto ni haitte iru n ja nai desu ka.', 'Không phải nó đang nằm trong túi chiếc áo khoác buổi sáng sao?'],
      ['ダニエル', 'b', 'そうだ、ジャケットは{図書館|としょかん}のロッカーだ！だからいくらポケットを{探|さが}しても、{見|み}つからなかったわけだ。', 'Sou da, jaketto wa toshokan no rokkaa da! Dakara ikura poketto o sagashite mo, mitsukaranakatta wake da.', 'Đúng rồi, áo khoác để trong tủ đồ ở thư viện! Thảo nào lục túi mãi cũng không thấy.'],
      ['リン', 'c', '{推理|すいり}、{成功|せいこう}ですね。{図書館|としょかん}が{閉|し}まる{前|まえ}に、{急|いそ}いで{取|と}りに{行|い}きましょう。', 'Suiri, seikou desu ne. Toshokan ga shimaru mae ni, isoide tori ni ikimashou.', 'Suy luận thành công rồi nhé. Mình mau đi lấy trước khi thư viện đóng cửa thôi.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{本当|ほんとう}に{忘|わす}れっぽいですね。', 'Hontou ni wasureppoi desu ne.', 'Anh đúng là hay quên thật. (④ Vます ＋ っぽい = hay…)'),
        E('コンビニで{落|お}としたに{違|ちが}いない。', 'Konbini de otoshita ni chigainai.', 'Chắc chắn là đánh rơi ở cửa hàng tiện lợi. (① Vた ＋ に違いない)'),
        E('{鍵|かぎ}はポケットだから、{落|お}ちるはずがありません。', 'Kagi wa poketto da kara, ochiru hazu ga arimasen.', 'Chìa khoá ở túi quần nên không lẽ nào lại rơi. (② có căn cứ ＋ はずがない)'),
        E('{鍵|かぎ}なんか、{誰|だれ}も{盗|ぬす}むわけがない。', 'Kagi nanka, dare mo nusumu wake ga nai.', 'Chìa khoá thì làm gì có ai đi trộm. (③ わけがない — phủ nhận mạnh)'),
        E('{朝|あさ}は{白|しろ}っぽいジャケットを{着|き}ていました。', 'Asa wa shiroppoi jaketto o kite imashita.', 'Sáng nay anh mặc áo khoác ngả trắng. (④ màu ＋ っぽい)'),
        E('だから{見|み}つからなかったわけだ。', 'Dakara mitsukaranakatta wake da.', 'Thảo nào không tìm thấy. (⑤ だから～わけだ)'),
        E('{今朝|けさ}から{行|い}った{所|ところ}を{思|おも}い{出|だ}してみましょう。', 'Kesa kara itta tokoro o omoidashite mimashou.', 'Thử nhớ lại những chỗ đã đi từ sáng nhé. (từ mới 思い出す + ～てみる Bài 19)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**{落|お}としたに{違|ちが}いない** — **V{普通形|ふつうけい} ＋ に{違|ちが}いない** = "**chắc chắn là**…" — người nói **tin chắc** (khoảng 90%) dựa vào cảm giác, trí nhớ của mình. ダニエル nói rất tự tin — nhưng cuối cùng lại sai. Đó chính là "màu sắc" của に違いない: **chủ quan**, tin chắc mà chưa kiểm chứng.',
        '**{落|お}ちるはずがありません** — **V ＋ はずがない** = "**không lẽ nào**…". リン có **căn cứ** (chìa khoá ở túi quần, ví ở ba lô) nên dùng はずがない để **gạt bỏ** khả năng ダニエル vừa nói. Khác **{落|お}ちないはずだ** (Bài 20 — "chắc là không rơi"): はずがない phủ nhận **mạnh hơn nhiều**.',
        '**{鍵|かぎ}なんか、{盗|ぬす}むわけがない** — **～わけがない** = "**làm gì có chuyện**…", "**đời nào** lại…". Mạnh và **chủ quan** hơn はずがない, rất hay đi với **なんか** (cái thứ như…) và **まさか** (làm gì có — Bài 20). Ở đây thay bằng はずがない vẫn đúng, nhưng わけがない nghe tự nhiên hơn khi **gạt đi một ý vô lý**.',
        '**{忘|わす}れっぽい・{白|しろ}っぽい** — **～っぽい** chia như **tính từ い**: **Vます ＋ っぽい** = "**hay**…, dễ…" (tính cách: {忘|わす}れっぽい = hay quên) · **màu ＋ っぽい** = "**ngả**…, hơi…" ({白|しろ}っぽい = trăng trắng).',
        '**だから{見|み}つからなかったわけだ** — **だから／{道理|どうり}で ～わけだ** = "**thảo nào**…, hèn gì…" — dùng khi **vừa hiểu ra lý do** của một chuyện đã thấy trước đó. Chuyện "tìm mãi không thấy" có trước, lý do (áo để ở thư viện) đến sau → わけだ chốt lại.',
        '**どこを{探|さが}しても** (dù tìm ở đâu — ôn ～ても) · **{順番|じゅんばん}に** (lần lượt) · **{思|おも}い{出|だ}す** (nhớ ra — từ mới) · **リュック** (ba lô) · **～なんか** (cái thứ như… — xem nhẹ) · **{謎|なぞ}** (bí ẩn — từ mới) · **ロッカー** (tủ đồ có khoá) · **{上着|うわぎ}** (áo khoác ngoài) · **{着替|きが}える** (thay quần áo) · **{入|い}れておいた** (để sẵn — ôn ～ておく) · **いくら～ても** (dù bao nhiêu… cũng) · **{推理|すいり}** (suy luận — từ mới).',
      ],
    },

    /* ── ② ゼミの推理クイズ ── */
    { t: 'h', text: '② ゼミの{推理|すいり}クイズ — "Ai đã ăn chiếc bánh trong phòng nghiên cứu?"' },
    {
      t: 'canh',
      anh: ['woman-teacher', 'shortcake', 'detective', 'man-student', 'woman-student'],
      caption: 'Mười phút cuối giờ ゼミ của cô 佐藤. Để luyện "lập luận có căn cứ", cô bày một câu đố trinh thám nhỏ: chiếc bánh trong tủ lạnh phòng nghiên cứu đã biến mất. カルロス và リン đóng vai thám tử.',
    },
    {
      t: 'p',
      text: 'Tình huống: cô **{佐藤|さとう}** kể "vụ án": 4 giờ bánh còn, 5 giờ đã mất; trong phòng có ba người — nghiên cứu sinh **{西川|にしかわ}**, trợ giảng **{木村|きむら}** và chính cô. **カルロス** loại 西川: có ghi chép ở thư viện → **{犯人|はんにん}のはずがない** (mẫu ②). 木村 ghét đồ ngọt → **{食|た}べるわけがない** (mẫu ③) — nhưng **リン** nhắc: biết đâu là **うそ**, vẫn có **{可能性|かのうせい}**. カルロス kết luận: **{犯人|はんにん}は{先生|せんせい}に{違|ちが}いありません** (mẫu ①) — vì tay áo cô dính thứ **クリームっぽい** (trông như kem — mẫu ④). Cô cười: **{私|わたし}が{食|た}べたわけではありません** (mẫu ⑥) — cô chỉ chuyển bánh sang tủ khác. **だから{見|み}つからなかったわけですね** (mẫu ⑤).',
    },
    DL('Giờ ゼミ — "Thủ phạm chắc chắn là cô!"', [
      ['{佐藤先生|さとうせんせい}', 'a', '{今日|きょう}は{最後|さいご}に{推理|すいり}クイズをしましょう。{昨日|きのう}の{夕方|ゆうがた}、{研究室|けんきゅうしつ}の{冷蔵庫|れいぞうこ}から、ケーキが{一|ひと}つなくなりました。', 'Kyou wa saigo ni suiri kuizu o shimashou. Kinou no yuugata, kenkyuushitsu no reizouko kara, keeki ga hitotsu naku narimashita.', 'Hôm nay cuối giờ mình chơi câu đố suy luận nhé. Chiều tối hôm qua, một chiếc bánh kem đã biến mất khỏi tủ lạnh phòng nghiên cứu.'],
      ['カルロス', 'b', 'なくなった{時間|じかん}は{分|わ}かりますか。', 'Naku natta jikan wa wakarimasu ka.', 'Có biết bánh mất vào lúc nào không ạ?'],
      ['{佐藤先生|さとうせんせい}', 'a', '4{時|じ}にはありました。でも、5{時|じ}に{見|み}たときにはもうなかったんです。その{間|あいだ}、{研究室|けんきゅうしつ}にいたのは、{院生|いんせい}の{西川|にしかわ}さん、{助手|じょしゅ}の{木村|きむら}さん、それから{私|わたし}の{三人|さんにん}です。', 'Yoji ni wa arimashita. Demo, goji ni mita toki ni wa mou nakatta n desu. Sono aida, kenkyuushitsu ni ita no wa, insei no Nishikawa-san, joshu no Kimura-san, sorekara watashi no sannin desu.', 'Lúc 4 giờ bánh vẫn còn. Nhưng lúc 5 giờ nhìn lại thì đã không còn nữa. Trong khoảng đó, người có mặt ở phòng là nghiên cứu sinh Nishikawa, trợ giảng Kimura và tôi — ba người.'],
      ['リン', 'c', '{西川|にしかわ}さんは、その{時間|じかん}に{何|なに}をしていたんですか。', 'Nishikawa-san wa, sono jikan ni nani o shite ita n desu ka.', 'Anh Nishikawa lúc đó đang làm gì ạ?'],
      ['{佐藤先生|さとうせんせい}', 'a', '4{時|じ}から6{時|じ}まで、{図書館|としょかん}で{調|しら}べ{物|もの}をしていたそうです。{入館|にゅうかん}の{記録|きろく}も{残|のこ}っています。', 'Yoji kara rokuji made, toshokan de shirabemono o shite ita sou desu. Nyuukan no kiroku mo nokotte imasu.', 'Nghe nói từ 4 giờ đến 6 giờ anh ấy tra cứu ở thư viện. Ghi chép ra vào thư viện cũng còn lưu lại.'],
      ['カルロス', 'b', '{記録|きろく}が{残|のこ}っているなら、{西川|にしかわ}さんが{犯人|はんにん}のはずがありませんね。じゃ、{木村|きむら}さんは？', 'Kiroku ga nokotte iru nara, Nishikawa-san ga hannin no hazu ga arimasen ne. Ja, Kimura-san wa?', 'Nếu ghi chép còn lưu thì anh Nishikawa không thể nào là thủ phạm. Thế còn chị Kimura?'],
      ['{佐藤先生|さとうせんせい}', 'a', '{木村|きむら}さんは「{甘|あま}い{物|もの}は{大嫌|だいきら}いです」と{言|い}っています。', 'Kimura-san wa "Amai mono wa daikirai desu" to itte imasu.', 'Chị Kimura nói: "Tôi rất ghét đồ ngọt."'],
      ['カルロス', 'b', '{甘|あま}い{物|もの}が{嫌|きら}いな{人|ひと}が、ケーキなんか{食|た}べるわけがないですよね。', 'Amai mono ga kirai na hito ga, keeki nanka taberu wake ga nai desu yo ne.', 'Người ghét đồ ngọt thì làm gì có chuyện đi ăn bánh kem, đúng không ạ.'],
      ['リン', 'c', 'でも、{木村|きむら}さんがうそをついている{可能性|かのうせい}もありますよ。', 'Demo, Kimura-san ga uso o tsuite iru kanousei mo arimasu yo.', 'Nhưng cũng có khả năng chị Kimura đang nói dối mà.'],
      ['カルロス', 'b', 'うーん……。あっ、{分|わ}かりました！{犯人|はんにん}は{先生|せんせい}に{違|ちが}いありません。{先生|せんせい}の{袖|そで}に、クリームっぽい{白|しろ}いものが{付|つ}いています！', 'Uun……. A, wakarimashita! Hannin wa sensei ni chigai arimasen. Sensei no sode ni, kuriimuppoi shiroi mono ga tsuite imasu!', 'Ừm… À, em biết rồi! Thủ phạm chắc chắn là cô. Trên tay áo cô có dính thứ gì trắng trắng trông như kem!'],
      ['{佐藤先生|さとうせんせい}', 'a', 'ふふ、よく{気|き}がつきましたね。でも、{私|わたし}が{食|た}べたわけではありませんよ。{実|じつ}は、5{時|じ}の{少|すこ}し{前|まえ}に、{私|わたし}がケーキを{別|べつ}の{冷蔵庫|れいぞうこ}に{移|うつ}したんです。', 'Fufu, yoku ki ga tsukimashita ne. Demo, watashi ga tabeta wake de wa arimasen yo. Jitsu wa, goji no sukoshi mae ni, watashi ga keeki o betsu no reizouko ni utsushita n desu.', 'Hì, em để ý giỏi đấy. Nhưng không phải là tôi đã ăn đâu nhé. Thật ra, trước 5 giờ một chút, tôi đã chuyển chiếc bánh sang tủ lạnh khác.'],
      ['リン', 'c', 'えっ。だから{冷蔵庫|れいぞうこ}を{見|み}ても{見|み}つからなかったわけですね。', 'E. Dakara reizouko o mite mo mitsukaranakatta wake desu ne.', 'Ơ. Thảo nào nhìn trong tủ lạnh cũng không thấy.'],
      ['{佐藤先生|さとうせんせい}', 'a', 'そうです。{推理|すいり}では、{思|おも}い{込|こ}みで{決|き}めないで、{証拠|しょうこ}を{一|ひと}つずつ{確|たし}かめることが{大切|たいせつ}なんですよ。', 'Sou desu. Suiri de wa, omoikomi de kimenaide, shouko o hitotsu zutsu tashikameru koto ga taisetsu na n desu yo.', 'Đúng thế. Khi suy luận, quan trọng là đừng quyết định theo định kiến, mà phải kiểm tra từng chứng cứ một.'],
      ['カルロス', 'b', '{分|わ}かりました。……でも、ケーキはどこにあるんですか。{先生|せんせい}、もしかして……。', 'Wakarimashita. …… Demo, keeki wa doko ni aru n desu ka. Sensei, moshikashite…….', 'Em hiểu rồi ạ. … Nhưng chiếc bánh giờ ở đâu ạ? Cô ơi, không lẽ…'],
    ]),
    {
      t: 'examples',
      items: [
        E('{記録|きろく}が{残|のこ}っているなら、{犯人|はんにん}のはずがありません。', 'Kiroku ga nokotte iru nara, hannin no hazu ga arimasen.', 'Nếu ghi chép còn lưu thì không lẽ nào là thủ phạm. (② N の ＋ はずがない)'),
        E('{甘|あま}い{物|もの}が{嫌|きら}いな{人|ひと}が、ケーキを{食|た}べるわけがない。', 'Amai mono ga kirai na hito ga, keeki o taberu wake ga nai.', 'Người ghét đồ ngọt thì làm gì có chuyện ăn bánh kem. (③)'),
        E('うそをついている{可能性|かのうせい}もあります。', 'Uso o tsuite iru kanousei mo arimasu.', 'Cũng có khả năng đang nói dối. (từ mới 可能性・うそをつく)'),
        E('{犯人|はんにん}は{先生|せんせい}に{違|ちが}いありません。', 'Hannin wa sensei ni chigai arimasen.', 'Thủ phạm chắc chắn là cô. (① N ＋ に違いありません — lịch sự)'),
        E('{袖|そで}に、クリームっぽいものが{付|つ}いています。', 'Sode ni, kuriimuppoi mono ga tsuite imasu.', 'Trên tay áo có dính thứ trông như kem. (④ N ＋ っぽい = trông giống N)'),
        E('{私|わたし}が{食|た}べたわけではありません。', 'Watashi ga tabeta wake de wa arimasen.', 'Không phải là tôi đã ăn. (⑥ わけではない)'),
        E('だから{見|み}つからなかったわけですね。', 'Dakara mitsukaranakatta wake desu ne.', 'Thảo nào không tìm thấy. (⑤)'),
        E('{証拠|しょうこ}を{一|ひと}つずつ{確|たし}かめることが{大切|たいせつ}です。', 'Shouko o hitotsu zutsu tashikameru koto ga taisetsu desu.', 'Quan trọng là kiểm tra từng chứng cứ một. (từ mới 証拠)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**{犯人|はんにん}のはずがありません** — danh từ nối với はず bằng **の**: **N の ＋ はずがない** (như はずだ ở Bài 20: {休|やす}みのはずだ). Câu có **căn cứ khách quan** ({記録|きろく}が{残|のこ}っている) → はずがない là lựa chọn chuẩn nhất.',
        '**ケーキなんか{食|た}べるわけがない** — カルロス suy từ **tính cách** của người khác (ghét đồ ngọt) → **わけがない** (chủ quan, "theo lẽ thường thì đời nào"). Ngay sau đó リン chỉ ra lỗ hổng: **うそをついている{可能性|かのうせい}もある** — わけがない nghe rất chắc, nhưng không phải là chứng cứ.',
        '**{犯人|はんにん}は{先生|せんせい}に{違|ちが}いありません** — **N ＋ に{違|ちが}いない** — danh từ đứng **thẳng** trước に, KHÔNG có の, KHÔNG có だ: ~~{先生|せんせい}のに{違|ちが}いない~~, ~~{先生|せんせい}だに{違|ちが}いない~~. Lịch sự: **に{違|ちが}いありません**.',
        '**クリームっぽい{白|しろ}いもの** — **N ＋ っぽい** = "**trông giống** N, có vẻ là N" (mà chưa chắc là N thật). Đối với {白|しろ}っぽい ở hội thoại ① (màu "ngả trắng"), đây là nghĩa "**giống**".',
        '**{私|わたし}が{食|た}べたわけではありません** — **～わけではない** = "**không phải là**…" — cô 佐藤 phủ nhận **kết luận** mà カルロス suy ra (tay áo dính kem → cô ăn bánh), chứ không phủ nhận sự thật (tay áo đúng là dính kem). Đây là cách dùng điển hình: "không phải như bạn nghĩ đâu".',
        '**{推理|すいり}クイズ** (câu đố suy luận) · **{研究室|けんきゅうしつ}** (phòng nghiên cứu) · **{院生|いんせい}** (học viên cao học — viết tắt {大学院生|だいがくいんせい}) · **{助手|じょしゅ}** (trợ giảng) · **{調|しら}べ{物|もの}** (việc tra cứu) · **{入館|にゅうかん}の{記録|きろく}** (ghi chép vào thư viện) · **うそをつく** (nói dối) · **{袖|そで}** (tay áo) · **{気|き}がつく** (để ý thấy) · **{移|うつ}す** (chuyển chỗ) · **{思|おも}い{込|こ}み** (định kiến, cứ đinh ninh) · **もしかして** (không lẽ… — ôn もしかしたら Bài 20).',
      ],
    },

    /* ── ③ ひまわり食堂 ── */
    { t: 'h', text: '③ ひまわり{食堂|しょくどう} — "Không thể không mang lên đồn" · "Không phải là em không muốn làm…"' },
    {
      t: 'canh',
      anh: ['man-cook', 'purse', 'identification-card', 'police-officer', 'spiral-calendar'],
      caption: '9 giờ tối, quán ひまわり食堂 vừa đóng cửa. Lúc lau sàn, anh 小林 nhặt được một chiếc ví dưới gầm bàn cạnh cửa sổ. ナタポン đang xếp ghế.',
    },
    {
      t: 'p',
      text: 'Tình huống: chiếc ví **{黒|くろ}っぽい** (mẫu ④) dưới gầm bàn. **ナタポン** đoán là của vị khách cạnh cửa sổ (**に{違|ちが}いない** — mẫu ①); anh **小林** bác: người đó trả bằng thẻ và cất ví vào túi rồi — **その{人|ひと}のはずがない** (mẫu ②). Trong ví có thẻ sinh viên của **{山口|やまぐち}** — khách quen. Có tiền bên trong nên **{交番|こうばん}に{届|とど}けないわけにはいかない** (không thể không mang lên đồn — mẫu ⑦). Rồi anh 小林 nhờ ナタポン làm thêm Chủ nhật; ナタポン khó xử: **{働|はたら}きたくないわけではない** (mẫu ⑥) nhưng thứ Hai phải báo cáo luận văn. Anh chủ hiểu ra: **{道理|どうり}で{最近|さいきん}ぼーっとしていたわけだ** (mẫu ⑤).',
    },
    DL('Ở quán ひまわり食堂 sau giờ đóng cửa — "Của ai thế nhỉ?"', [
      ['{小林店長|こばやしてんちょう}', 'examiner', 'ナタポンくん、テーブルの{下|した}にこんな{財布|さいふ}が{落|お}ちていたよ。{黒|くろ}っぽい{革|かわ}の{財布|さいふ}だ。', 'Natapon-kun, teeburu no shita ni konna saifu ga ochite ita yo. Kuroppoi kawa no saifu da.', 'Nattapon này, dưới gầm bàn có cái ví này rơi. Ví da màu đen đen.'],
      ['ナタポン', 'b', 'あ、{窓際|まどぎわ}の{席|せき}の{男|おとこ}の{人|ひと}のに{違|ちが}いありません。{帰|かえ}るとき、ポケットを{何度|なんど}も{触|さわ}っていましたから。', 'A, madogiwa no seki no otoko no hito no ni chigai arimasen. Kaeru toki, poketto o nando mo sawatte imashita kara.', 'À, chắc chắn là của anh khách ngồi cạnh cửa sổ ạ. Lúc về anh ấy cứ sờ túi mãi.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'いや、あの{人|ひと}はカードで{払|はら}って、{財布|さいふ}をちゃんとかばんにしまっていたよ。あの{人|ひと}のはずがない。', 'Iya, ano hito wa kaado de haratte, saifu o chanto kaban ni shimatte ita yo. Ano hito no hazu ga nai.', 'Không, người đó trả bằng thẻ rồi cất ví vào cặp đàng hoàng mà. Không lẽ nào là của người đó.'],
      ['ナタポン', 'b', 'じゃ、{中|なか}を{少|すこ}し{見|み}てもいいですか。……あ、{学生証|がくせいしょう}が{入|はい}っています。みなと{大学|だいがく}の{山口|やまぐち}さん……。', 'Ja, naka o sukoshi mite mo ii desu ka. …… A, gakuseishou ga haitte imasu. Minato Daigaku no Yamaguchi-san…….', 'Vậy em xem bên trong một chút được không ạ? … À, có thẻ sinh viên. Bạn Yamaguchi trường Minato…'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{山口|やまぐち}さんか。{毎週|まいしゅう}{来|き}てくれる{常連|じょうれん}さんだね。{今日|きょう}はたしか、お{友達|ともだち}と{三人|さんにん}で{来|き}ていたよ。', 'Yamaguchi-san ka. Maishuu kite kureru jouren-san da ne. Kyou wa tashika, otomodachi to sannin de kite ita yo.', 'Bạn Yamaguchi à. Khách quen tuần nào cũng ghé đấy. Hôm nay hình như đi cùng bạn, ba người.'],
      ['ナタポン', 'b', 'お{金|かね}も{入|はい}っていますね。{店長|てんちょう}、どうしますか。{明日|あした}も{来|く}るかもしれませんけど……。', 'Okane mo haitte imasu ne. Tenchou, dou shimasu ka. Ashita mo kuru kamo shiremasen kedo…….', 'Có cả tiền bên trong nữa. Anh ơi, mình làm sao ạ? Có thể mai bạn ấy lại đến, nhưng…'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'でも、{必|かなら}ず{来|く}るわけじゃないからね。お{金|かね}が{入|はい}っている{以上|いじょう}、{交番|こうばん}に{届|とど}けないわけにはいかないよ。', 'Demo, kanarazu kuru wake ja nai kara ne. Okane ga haitte iru ijou, kouban ni todokenai wake ni wa ikanai yo.', 'Nhưng đâu phải chắc chắn bạn ấy sẽ đến. Đã có tiền ở trong thì không thể không mang lên đồn được.'],
      ['ナタポン', 'b', 'そうですね。{僕|ぼく}、{帰|かえ}りに{駅前|えきまえ}の{交番|こうばん}に{寄|よ}ります。', 'Sou desu ne. Boku, kaeri ni ekimae no kouban ni yorimasu.', 'Đúng ạ. Lúc về em sẽ ghé đồn cảnh sát trước ga.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{助|たす}かるよ。……それから、{来週|らいしゅう}の{日曜日|にちようび}なんだけど、お{昼|ひる}のシフトに{入|はい}ってもらえないかな。{一人|ひとり}{休|やす}むことになってね。', 'Tasukaru yo. …… Sorekara, raishuu no nichiyoubi na n da kedo, ohiru no shifuto ni haitte moraenai ka na. Hitori yasumu koto ni natte ne.', 'Đỡ cho anh quá. … Còn nữa, Chủ nhật tuần sau ấy, em vào ca trưa giúp anh được không? Có một người xin nghỉ.'],
      ['ナタポン', 'b', '{日曜日|にちようび}ですか……。{実|じつ}は{月曜日|げつようび}に、{論文|ろんぶん}の{中間発表|ちゅうかんはっぴょう}があるんです。でも、{働|はたら}きたくないわけではないんです。いつもお{世話|せわ}になっていますし、{店長|てんちょう}が{困|こま}っているのに、{断|ことわ}るわけにはいかないし……。', 'Nichiyoubi desu ka……. Jitsu wa getsuyoubi ni, ronbun no chuukan happyou ga aru n desu. Demo, hatarakitaku nai wake de wa nai n desu. Itsumo osewa ni natte imasu shi, tenchou ga komatte iru noni, kotowaru wake ni wa ikanai shi…….', 'Chủ nhật ạ… Thật ra thứ Hai em có buổi báo cáo giữa kỳ luận văn. Nhưng không phải là em không muốn làm đâu ạ. Anh lúc nào cũng giúp đỡ em, anh đang khó mà em lại từ chối thì cũng không được…'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'いやいや、{発表|はっぴょう}の{前|まえ}の{日|ひ}に{働|はたら}かせるわけにはいかないよ。ほかの{人|ひと}に{頼|たの}むから、{大丈夫|だいじょうぶ}。', 'Iya iya, happyou no mae no hi ni hatarakaseru wake ni wa ikanai yo. Hoka no hito ni tanomu kara, daijoubu.', 'Thôi thôi, anh không thể bắt em làm vào ngày trước buổi báo cáo được. Anh nhờ người khác, không sao đâu.'],
      ['ナタポン', 'b', 'すみません。{最近|さいきん}ずっと{発表|はっぴょう}の{準備|じゅんび}で、{夜|よる}もあまり{寝|ね}ていないんです。', 'Sumimasen. Saikin zutto happyou no junbi de, yoru mo amari nete inai n desu.', 'Em xin lỗi ạ. Dạo này em chuẩn bị báo cáo suốt, đêm cũng không ngủ được mấy.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'なるほど。{道理|どうり}で{最近|さいきん}、ぼーっとしていたわけだ。この{間|あいだ}もお{皿|さら}を{割|わ}ったしね。', 'Naruhodo. Douri de saikin, bootto shite ita wake da. Kono aida mo osara o watta shi ne.', 'Ra vậy. Thảo nào dạo này em cứ ngơ ngác. Hôm trước còn làm vỡ đĩa nữa.'],
      ['ナタポン', 'b', 'それは{言|い}わないでください……。', 'Sore wa iwanaide kudasai…….', 'Chuyện đó anh đừng nhắc nữa mà…'],
    ]),
    {
      t: 'examples',
      items: [
        E('{黒|くろ}っぽい{革|かわ}の{財布|さいふ}です。', 'Kuroppoi kawa no saifu desu.', 'Là chiếc ví da màu đen đen. (④ màu ＋ っぽい)'),
        E('{窓際|まどぎわ}の{席|せき}の{人|ひと}のに{違|ちが}いありません。', 'Madogiwa no seki no hito no ni chigai arimasen.', 'Chắc chắn là của người ngồi cạnh cửa sổ. (① 人の(=人の財布) ＋ に違いない)'),
        E('あの{人|ひと}のはずがない。', 'Ano hito no hazu ga nai.', 'Không lẽ nào là của người đó. (②)'),
        E('{必|かなら}ず{来|く}るわけじゃない。', 'Kanarazu kuru wake ja nai.', 'Đâu phải chắc chắn sẽ đến. (⑥ 必ず～わけではない — văn nói じゃない)'),
        E('{交番|こうばん}に{届|とど}けないわけにはいかない。', 'Kouban ni todokenai wake ni wa ikanai.', 'Không thể không mang lên đồn. (⑦ Vない ＋ わけにはいかない)'),
        E('{働|はたら}きたくないわけではないんです。', 'Hatarakitaku nai wake de wa nai n desu.', 'Không phải là em không muốn làm. (⑥)'),
        E('{店長|てんちょう}の{頼|たの}みを{断|ことわ}るわけにはいかない。', 'Tenchou no tanomi o kotowaru wake ni wa ikanai.', 'Không thể từ chối lời nhờ của anh chủ. (⑦ Vる ＋ わけにはいかない)'),
        E('{道理|どうり}で{最近|さいきん}、ぼーっとしていたわけだ。', 'Douri de saikin, bootto shite ita wake da.', 'Thảo nào dạo này cứ ngơ ngác. (⑤ 道理で～わけだ)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{男|おとこ}の{人|ひと}のに{違|ちが}いありません／あの{人|ひと}のはずがない** — **の** ở đây là "**cái của**" (= {人|ひと}の{財布|さいふ}), không phải の nối danh từ với はず. Đối chiếu: **N ＋ に{違|ちが}いない** (không có の) nhưng **{人|ひと}の ＋ に{違|ちが}いない** = "chắc chắn là **của** người đó". Cùng tình huống, hai người đưa ra hai suy luận — ナタポン dựa vào **ấn tượng** (sờ túi) → に違いない; anh chủ dựa vào **điều đã thấy** (cất ví vào cặp) → はずがない.',
        '**{必|かなら}ず{来|く}るわけじゃない** — **{必|かなら}ず／いつも／{全部|ぜんぶ} ＋ ～わけではない** = phủ định **một phần** ("không phải lúc nào cũng…, đâu phải chắc chắn…"). **じゃない** là dạng nói của **ではない**.',
        '**{届|とど}けないわけにはいかない** — **Vない ＋ わけにはいかない** = "**không thể KHÔNG** …" → **buộc phải** làm (vì đạo lý, quy định, trách nhiệm). **～{以上|いじょう}** = "một khi đã… thì" (N2 — Bài 47 học kỹ; ở đây chỉ cần hiểu). Ngược lại **{断|ことわ}るわけにはいかない** = "**không thể** từ chối" (về khả năng thì từ chối được, nhưng **tình nghĩa** không cho phép).',
        '**{働|はたら}きたくないわけではないんです** — phủ định của phủ định: "**không phải** là **không** muốn làm" = thật ra **có** muốn, nhưng có lý do khác. Câu này giúp **từ chối mềm**: nói trước "không phải tôi không muốn", rồi mới nêu lý do. Rất hay dùng với người trên.',
        '**{働|はたら}かせるわけにはいかない** — sai khiến ({働|はたら}かせる — Bài 23) ＋ わけにはいかない: anh chủ nói "anh không thể **bắt** em làm" — vì lẽ phải (hôm sau em báo cáo). **{道理|どうり}で～わけだ** = "**thảo nào**…" — {道理|どうり}で là từ mới đi đôi với わけだ.',
        '**{革|かわ}** (da thuộc) · **{窓際|まどぎわ}** (cạnh cửa sổ) · **{触|さわ}る** (sờ, chạm) · **しまう** (cất — Bài 18) · **{学生証|がくせいしょう}** (thẻ sinh viên — từ mới) · **{常連|じょうれん}** (khách quen — N2) · **{交番|こうばん}に{届|とど}ける** (mang nộp đồn cảnh sát — Bài 7, 22) · **シフトに{入|はい}る** (vào ca) · **～ことになる** (được quyết định là — Bài 21) · **{論文|ろんぶん}** (luận văn) · **{中間発表|ちゅうかんはっぴょう}** (báo cáo giữa kỳ) · **お{世話|せわ}になる** (được giúp đỡ) · **なるほど** (ra vậy — từ mới) · **ぼーっとする** (ngơ ngác, lơ đễnh).',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b31-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 67 từ N3: suy luận & phán đoán, vụ việc & trinh thám, đồ thất lạc & trí nhớ, lý do & giải thích, tính chất (～っぽい) & mô tả',
  goal: 'Thuộc 67 từ của chủ đề suy luận: suy luận & phán đoán (推理・推測・想像・可能性・恐らく・どうやら・もしかすると・明らか・証拠・手がかり・謎・解決・解く・気づく), vụ việc & trinh thám (探偵・推理小説・刑事・現場・犯罪・容疑者・隠す・隠れる・うそ・怪しい・足跡・映る・見かける・深夜・現在・過去), đồ thất lạc & trí nhớ (置き忘れる・探し回る・中身・特徴・目印・記憶・思い出す・見覚え・袋・定期券・学生証・持ち主), lý do & giải thích (わけ・事情・道理で・なるほど・つまり・要するに・当たり前・理解・勘違い・誤解・決して・別に・引き受ける), tính chất & mô tả (子どもっぽい・大人っぽい・忘れっぽい・怒りっぽい・飽きっぽい・安っぽい・白っぽい・熱っぽい・細かい・詳しい・恐ろしい・印象) — phân biệt được các cặp dễ nhầm (推理・推測・想像, 恐らく・たぶん・きっと, 隠す・隠れる, 映る・写る, 細かい・細い・詳しい, 勘違い・誤解, 恐ろしい・怖い, 置き忘れる・なくす・落とす, 子どもっぽい・子どもらしい, つまり・要するに・道理で…) và nói thành cụm (証拠が見つかる, 謎を解く, 事件が解決する, うそをつく, 防犯カメラに映る, 記憶にない, 目印にする, 事情がある, 仕事を引き受ける).',
  minutes: 60,
  blocks: [
    {
      t: 'p',
      text: '**67 từ** chia 5 nhóm theo đúng các việc của bài: **A** suy luận & phán đoán (14) · **B** vụ việc, trinh thám & thời điểm (16) · **C** đồ thất lạc & trí nhớ (12) · **D** lý do & giải thích (13) · **E** tính chất (～っぽい) & mô tả (12). Từ cấp **N3** chiếm phần lớn; vài từ N2/N1 hay gặp trong **truyện trinh thám, bản tin** ({探偵|たんてい}, {容疑者|ようぎしゃ}, {手|て}がかり, {謎|なぞ}) có ghi cấp ở dòng "more" — chỉ cần **nhận ra**. Nhóm E là từ **làm bằng mẫu ～っぽい** (ngữ pháp ④) — học từ là học luôn mẫu. Từ đã học ở Bài 1–30 ({鍵|かぎ}, {財布|さいふ}, {落|お}とし{物|もの}, {忘|わす}れ{物|もの}, {見|み}つける, {交番|こうばん}, {届|とど}ける, {秘密|ひみつ}, {泥棒|どろぼう}, {盗|ぬす}む, {犯人|はんにん}, {逃|に}げる, {確|たし}か, まさか, きっと, もしかしたら, {実|じつ}は, {様子|ようす}, {偶然|ぐうぜん}, {当然|とうぜん}, {言|い}い{訳|わけ}, {疑|うたが}う, {根拠|こんきょ}, {判断|はんだん}, {必|かなら}ずしも, {断|ことわ}る, {信|しん}じる, なくす…) KHÔNG lặp lại — gặp trong câu là ôn.',
    },
    {
      t: 'note',
      title: 'Cách học 67 từ N3 trong 4 ngày',
      items: [
        '**Ngày 1** — nhóm A (14 từ): đọc to theo 🔊, che nghĩa tự nói. Mỗi từ đặt **một câu về một bộ phim / truyện trinh thám** bạn từng xem ("コナンは{小|ちい}さな{手|て}がかりから{犯人|はんにん}を{推理|すいり}する"). Chú ý cặp **{推理|すいり}・{推測|すいそく}・{想像|そうぞう}** (bảng 類義語 bên dưới).',
        '**Ngày 2** — nhóm B + C (28 từ): đây là từ của **bản tin vụ việc** và **quầy đồ thất lạc** ({落|お}とし{物|もの}センター). Học thành cụm của bảng コロケーション: {防犯|ぼうはん}カメラに{映|うつ}る, {足跡|あしあと}が{残|のこ}る, {特徴|とくちょう}を{伝|つた}える, {目印|めじるし}にする, {記憶|きおく}にない.',
        '**Ngày 3** — nhóm D + E (25 từ): nhóm D đi đôi với **mẫu わけ** của bài — học kèm luôn: **{道理|どうり}で**～わけだ, **つまり**～わけだ, **{別|べつ}に**～わけではない, **{決|けっ}して**～ない, {一度|いちど}**{引|ひ}き{受|う}けたら**、やめるわけにはいかない. Nhóm E: tự tả 3 người quen bằng ～っぽい ({兄|あに}は{怒|おこ}りっぽい…).',
        '**Ngày 4** — thẻ hình + bảng **Từ dễ nhầm (類義語)** + bảng **Kết hợp từ (コロケーション)** + trắc nghiệm cuối mục (dạng 文脈規定・言い換え類義・用法 của đề N3) + viết tay 10 từ.',
        'Romaji: trường âm viết đôi ({推理|すいり} → **suiri**, {想像|そうぞう} → **souzou**, {証拠|しょうこ} → **shouko**, {特徴|とくちょう} → **tokuchou**); âm ngắt ({決|けっ}して → ke**ss**hite); ん trước nguyên âm / や thêm dấu nháy ({深夜|しんや} → **shin\'ya**); ～っぽい → **-ppoi** ({白|しろ}っぽい → shiro**pp**oi).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Suy luận & phán đoán (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{推理|すいり}します［{推理|すいり}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'suiri shimasu [suiri suru]', vi: 'suy luận (lập luận từ manh mối để tìm ra sự thật)', ex: '{少|すこ}しの{手|て}がかりから{犯人|はんにん}を{推理|すいり}するのが{好|す}きです。', exRo: 'Sukoshi no tegakari kara hannin o suiri suru no ga suki desu.', exVi: 'Tôi thích suy luận ra thủ phạm từ một chút manh mối.', more: '**{推理小説|すいりしょうせつ}** (truyện trinh thám — nhóm B) · **{推理|すいり}ドラマ／{推理|すいり}クイズ** · **{推理|すいり}が{当|あ}たる／{外|はず}れる** (suy luận đúng / trật). Tên bài: **{推理|すいり}**. N2.' },
        { w: '{推測|すいそく}します［{推測|すいそく}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'suisoku shimasu [suisoku suru]', vi: 'phỏng đoán (đoán dựa trên thông tin có được)', ex: '{話|はな}し{方|かた}から、{彼|かれ}は{関西|かんさい}の{人|ひと}だと{推測|すいそく}しました。', exRo: 'Hanashikata kara, kare wa Kansai no hito da to suisoku shimashita.', exVi: 'Từ cách nói chuyện, tôi đoán anh ấy là người vùng Kansai.', more: '**～と{推測|すいそく}する** · **{推測|すいそく}にすぎない** (chỉ là phỏng đoán — N2) · {推理|すいり} = lập luận chặt, nhiều bước; {推測|すいそく} = đoán nhanh, ít căn cứ hơn. N2.' },
        { w: '{想像|そうぞう}します［{想像|そうぞう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'souzou shimasu [souzou suru]', vi: 'tưởng tượng', ex: '{十年後|じゅうねんご}の{自分|じぶん}を{想像|そうぞう}してみてください。', exRo: 'Juunengo no jibun o souzou shite mite kudasai.', exVi: 'Hãy thử tưởng tượng bản thân mình 10 năm sau.', more: '**{想像|そうぞう}がつく** (hình dung được) · **{想像以上|そうぞういじょう}に** (hơn cả tưởng tượng) · **{想像力|そうぞうりょく}** (trí tưởng tượng) · chữ 想 — Bài 20. N3.' },
        { w: '{可能性|かのうせい}', pos: 'danh từ', ipa: 'kanousei', vi: 'khả năng (một việc có thể xảy ra)', ex: '{明日|あした}は{雪|ゆき}が{降|ふ}る{可能性|かのうせい}があります。', exRo: 'Ashita wa yuki ga furu kanousei ga arimasu.', exVi: 'Ngày mai có khả năng tuyết rơi.', more: '**～{可能性|かのうせい}がある／ない／{高|たか}い／{低|ひく}い** · ⚠ "khả năng làm được" (năng lực của người) là **{能力|のうりょく}**, không phải {可能性|かのうせい}: ~~{日本語|にほんご}の{可能性|かのうせい}が{高|たか}い~~. N3.' },
        { w: '{恐|おそ}らく', pos: 'phó từ', ipa: 'osoraku', vi: 'có lẽ, e rằng (văn viết, trang trọng)', ex: '{恐|おそ}らく、{犯人|はんにん}はもう{遠|とお}くへ{逃|に}げたでしょう。', exRo: 'Osoraku, hannin wa mou tooku e nigeta deshou.', exVi: 'E rằng thủ phạm đã trốn đi xa rồi.', more: '**{恐|おそ}らく～だろう／でしょう** (đi đôi) · ≈ **たぶん** (văn nói) · thường viết kana **おそらく** · độ chắc ~70% — KHÔNG đi với に{違|ちが}いない. N3.' },
        { w: 'どうやら', pos: 'phó từ', ipa: 'douyara', vi: 'hình như, có vẻ như (sau khi xem xét tình hình)', ex: 'どうやら、{道|みち}を{間違|まちが}えたようです。', exRo: 'Douyara, michi o machigaeta you desu.', exVi: 'Có vẻ như chúng ta đã đi nhầm đường.', more: '**どうやら～らしい／ようだ／みたいだ** (đi đôi — ôn Bài 20) · sắc thái: quan sát một lúc rồi mới đi đến nhận định (thường là chuyện không mong muốn). N3–N2.' },
        { w: 'もしかすると', pos: 'phó từ', ipa: 'moshika suru to', vi: 'biết đâu, có khi', ex: 'もしかすると、{財布|さいふ}は{車|くるま}の{中|なか}にあるかもしれません。', exRo: 'Moshika suru to, saifu wa kuruma no naka ni aru kamo shiremasen.', exVi: 'Biết đâu cái ví ở trong xe ô tô.', more: '**もしかすると／もしかしたら（Bài 20）～かもしれない** · **もしかして…？** = "không lẽ là…?" (hỏi khi chợt nghi) · độ chắc thấp (~30–50%). N3.' },
        { w: '{明|あき}らかな', pos: 'tính từ な', ipa: 'akiraka na', vi: 'rõ ràng, hiển nhiên', ex: 'これは{明|あき}らかに{私|わたし}のミスです。', exRo: 'Kore wa akiraka ni watashi no misu desu.', exVi: 'Đây rõ ràng là lỗi của tôi.', more: '**{明|あき}らかに** (phó từ) · **～ことは{明|あき}らかだ** · **{原因|げんいん}を{明|あき}らかにする** (làm rõ nguyên nhân — tin tức) · ≈ はっきり. N3.' },
        { w: '{証拠|しょうこ}', pos: 'danh từ', ipa: 'shouko', vi: 'chứng cứ, bằng chứng', ex: '{彼|かれ}が{犯人|はんにん}だという{証拠|しょうこ}はありません。', exRo: 'Kare ga hannin da to iu shouko wa arimasen.', exVi: 'Không có bằng chứng nào cho thấy anh ta là thủ phạm.', more: '**{証拠|しょうこ}がある／{見|み}つかる／{残|のこ}る** · **～という{証拠|しょうこ}** · {証|しょう} (chứng — {学生証|がくせいしょう}) · ≈ {根拠|こんきょ} (Bài 28 — căn cứ của một ý kiến). N3–N2.' },
        { w: '{手|て}がかり', pos: 'danh từ', ipa: 'tegakari', vi: 'manh mối', ex: '{現場|げんば}に{残|のこ}っていた{足跡|あしあと}が、{大切|たいせつ}な{手|て}がかりになりました。', exRo: 'Genba ni nokotte ita ashiato ga, taisetsu na tegakari ni narimashita.', exVi: 'Dấu chân còn lại ở hiện trường đã trở thành manh mối quan trọng.', more: '**{手|て}がかりがある／{見|み}つかる／つかむ** · ≈ ヒント (gợi ý — câu đố) · cũng viết {手掛|てが}かり. N2.' },
        { w: '{謎|なぞ}', pos: 'danh từ', ipa: 'nazo', vi: 'điều bí ẩn; câu đố', ex: 'この{事件|じけん}には、まだ{多|おお}くの{謎|なぞ}が{残|のこ}っています。', exRo: 'Kono jiken ni wa, mada ooku no nazo ga nokotte imasu.', exVi: 'Vụ việc này vẫn còn nhiều điều bí ẩn.', more: '**{謎|なぞ}を{解|と}く** (giải bí ẩn) · **{謎|なぞ}が{解|と}ける** · **{謎|なぞ}だ** (khó hiểu quá — văn nói) · chữ 謎 N1 — chỉ cần đọc. N2.' },
        { w: '{解決|かいけつ}します［{解決|かいけつ}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'kaiketsu shimasu [kaiketsu suru]', vi: 'giải quyết; phá (vụ án)', ex: '{話|はな}し{合|あ}いで{問題|もんだい}を{解決|かいけつ}しましょう。', exRo: 'Hanashiai de mondai o kaiketsu shimashou.', exVi: 'Hãy giải quyết vấn đề bằng cách nói chuyện với nhau.', more: '**{問題|もんだい}を{解決|かいけつ}する** · **{事件|じけん}が{解決|かいけつ}する** (vụ án được phá — dùng như tự động từ) · {解決策|かいけつさく} (cách giải quyết — N2). N3.' },
        { w: '{解|と}きます［{解|と}く］1', pos: 'động từ nhóm 1', ipa: 'tokimasu [toku]', vi: 'giải (bài tập, câu đố); tháo, gỡ', ex: 'この{問題|もんだい}は{難|むずか}しくて、{誰|だれ}も{解|と}けませんでした。', exRo: 'Kono mondai wa muzukashikute, dare mo tokemasen deshita.', exVi: 'Bài này khó quá, không ai giải được.', more: '**{問題|もんだい}／{謎|なぞ}を{解|と}く** · **{誤解|ごかい}を{解|と}く** (gỡ hiểu lầm) · {解|と}ける (được giải — tự động từ) · ⚠ {溶|と}く (hoà tan) cùng âm khác chữ. N3.' },
        { w: '{気|き}づきます［{気|き}づく］1', pos: 'động từ nhóm 1', ipa: 'kizukimasu [kizuku]', vi: 'nhận ra, để ý thấy', ex: '{家|いえ}に{帰|かえ}ってから、{傘|かさ}を{忘|わす}れたことに{気|き}づきました。', exRo: 'Ie ni kaette kara, kasa o wasureta koto ni kizukimashita.', exVi: 'Về đến nhà tôi mới nhận ra là đã quên ô.', more: '**N／～ことに{気|き}づく** (trợ từ **に**, ~~を{気|き}づく~~ sai) · ≈ **{気|き}がつく** (văn nói) · {間違|まちが}いに{気|き}づく. N3.' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Vụ việc, trinh thám & thời điểm (16 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{探偵|たんてい}', pos: 'danh từ', ipa: 'tantei', vi: 'thám tử', ex: '{子|こ}どものころ、{探偵|たんてい}になりたいと{思|おも}っていました。', exRo: 'Kodomo no koro, tantei ni naritai to omotte imashita.', exVi: 'Hồi nhỏ tôi đã muốn trở thành thám tử.', more: '**{名探偵|めいたんてい}** (thám tử lừng danh — {名探偵|めいたんてい}コナン) · {私立探偵|しりつたんてい} (thám tử tư) · chữ 偵 N1 — chỉ cần đọc. N1 (từ của truyện).' },
        { w: '{推理小説|すいりしょうせつ}', pos: 'danh từ', ipa: 'suiri shousetsu', vi: 'tiểu thuyết trinh thám', ex: '{寝|ね}る{前|まえ}に{推理小説|すいりしょうせつ}を{読|よ}むと、{止|と}まらなくなります。', exRo: 'Neru mae ni suiri shousetsu o yomu to, tomaranaku narimasu.', exVi: 'Đọc truyện trinh thám trước khi ngủ là không dừng lại được.', more: '≈ **ミステリー** (thể loại bí ẩn) · {小説|しょうせつ} (Bài 9) · **ネタバレ** (tiết lộ nội dung — tiếng lóng: ネタバレしないで！). N2.' },
        { w: '{刑事|けいじ}', pos: 'danh từ', ipa: 'keiji', vi: 'cảnh sát hình sự, điều tra viên', ex: '{刑事|けいじ}は{何度|なんど}も{現場|げんば}に{行|い}って、{手|て}がかりを{探|さが}しました。', exRo: 'Keiji wa nando mo genba ni itte, tegakari o sagashimashita.', exVi: 'Viên cảnh sát hình sự đã nhiều lần đến hiện trường tìm manh mối.', more: '**{刑事|けいじ}ドラマ** · ≈ {警察官|けいさつかん} (cảnh sát nói chung — ở {交番|こうばん}) · ⚠ đừng nhầm với {検事|けんじ} (công tố viên). N2.' },
        { w: '{現場|げんば}', pos: 'danh từ', ipa: 'genba', vi: 'hiện trường; nơi làm việc thực tế', ex: '{事件|じけん}の{現場|げんば}には、{警察|けいさつ}の{車|くるま}がたくさん{止|と}まっていました。', exRo: 'Jiken no genba ni wa, keisatsu no kuruma ga takusan tomatte imashita.', exVi: 'Ở hiện trường vụ việc có rất nhiều xe cảnh sát đỗ.', more: '**{事故|じこ}／{事件|じけん}の{現場|げんば}** · **{工事現場|こうじげんば}** (công trường) · **{現場|げんば}で{働|はたら}く** (làm ở nơi thực tế, không phải văn phòng). N3–N2.' },
        { w: '{犯罪|はんざい}', pos: 'danh từ', ipa: 'hanzai', vi: 'tội phạm (hành vi phạm tội)', ex: 'この{町|まち}では、{最近|さいきん}{犯罪|はんざい}が{減|へ}っています。', exRo: 'Kono machi de wa, saikin hanzai ga hette imasu.', exVi: 'Ở thị trấn này, dạo gần đây tội phạm đang giảm.', more: '**{犯罪|はんざい}を{防|ふせ}ぐ** · **{犯罪|はんざい}を{犯|おか}す** (phạm tội — N2) · ⚠ {犯罪|はんざい} = HÀNH VI; {犯人|はんにん} (Bài 22) = NGƯỜI làm · {罪|つみ} = tội. N3.' },
        { w: '{容疑者|ようぎしゃ}', pos: 'danh từ', ipa: 'yougisha', vi: 'nghi phạm', ex: '{警察|けいさつ}は、{三十代|さんじゅうだい}の{男|おとこ}を{容疑者|ようぎしゃ}として{調|しら}べています。', exRo: 'Keisatsu wa, sanjuudai no otoko o yougisha to shite shirabete imasu.', exVi: 'Cảnh sát đang điều tra một người đàn ông khoảng ba mươi tuổi với tư cách nghi phạm.', more: 'Từ của **bản tin** — chỉ cần nghe hiểu · {容疑|ようぎ} (sự tình nghi) · ～として (với tư cách — ôn Bài 30). N1.' },
        { w: '{隠|かく}します［{隠|かく}す］1', pos: 'động từ nhóm 1', ipa: 'kakushimasu [kakusu]', vi: 'giấu, che giấu', ex: '{弟|おとうと}はテストの{点|てん}が{悪|わる}くて、{答案|とうあん}を{引|ひ}き{出|だ}しの{奥|おく}に{隠|かく}しました。', exRo: 'Otouto wa tesuto no ten ga warukute, touan o hikidashi no oku ni kakushimashita.', exVi: 'Em trai tôi bị điểm kém nên giấu bài kiểm tra sâu trong ngăn kéo.', more: '**N を{隠|かく}す** (tha động từ) ↔ **N が{隠|かく}れる** (tự động từ) · **{本当|ほんとう}のことを{隠|かく}す** · {秘密|ひみつ}を{隠|かく}す. N3.' },
        { w: '{隠|かく}れます［{隠|かく}れる］2', pos: 'động từ nhóm 2', ipa: 'kakuremasu [kakureru]', vi: 'nấp, trốn; bị che khuất', ex: '{猫|ねこ}がベッドの{下|した}に{隠|かく}れていて、なかなか{出|で}てきません。', exRo: 'Neko ga beddo no shita ni kakurete ite, nakanaka dete kimasen.', exVi: 'Con mèo trốn dưới gầm giường, mãi không chịu ra.', more: '**かくれんぼ** (trò trốn tìm) · **{月|つき}が{雲|くも}に{隠|かく}れる** (trăng bị mây che) · ↔ {隠|かく}す. N3.' },
        { w: 'うそ（{嘘|うそ}）', pos: 'danh từ', ipa: 'uso', vi: 'lời nói dối; "không thể nào!"', ex: '{子|こ}どもにうそをついてはいけません。', exRo: 'Kodomo ni uso o tsuite wa ikemasen.', exVi: 'Không được nói dối trẻ con.', more: '**うそをつく** (nói dối — cách nói chuẩn với động từ つく) · **うそ！／うそでしょう？** (Không thể nào! — kêu khi ngạc nhiên) · **うそっぽい** (nghe như bịa — mẫu ④) · chữ 嘘 ngoài bảng thường dụng — viết kana. N3.' },
        { w: '{怪|あや}しい', pos: 'tính từ い', ipa: 'ayashii', vi: 'đáng ngờ, khả nghi', ex: '{夜中|よなか}に、{家|いえ}の{前|まえ}を{怪|あや}しい{人|ひと}が{歩|ある}いていました。', exRo: 'Yonaka ni, ie no mae o ayashii hito ga aruite imashita.', exVi: 'Nửa đêm có một người khả nghi đi lại trước nhà.', more: '**{怪|あや}しい{人|ひと}／{話|はなし}／メール** · **{天気|てんき}が{怪|あや}しい** (trời có vẻ sắp mưa) · chữ 怪 N2. N3.' },
        { w: '{足跡|あしあと}', pos: 'danh từ', ipa: 'ashiato', vi: 'dấu chân', ex: '{雪|ゆき}の{上|うえ}に、{猫|ねこ}の{小|ちい}さな{足跡|あしあと}が{続|つづ}いていました。', exRo: 'Yuki no ue ni, neko no chiisana ashiato ga tsuzuite imashita.', exVi: 'Trên tuyết có những dấu chân nhỏ của con mèo nối dài.', more: '**{足跡|あしあと}が{残|のこ}る／{付|つ}く** · nghĩa bóng: **{歴史|れきし}に{足跡|あしあと}を{残|のこ}す** (để lại dấu ấn trong lịch sử) · chữ 跡 N2. N2.' },
        { w: '{映|うつ}ります［{映|うつ}る］1', pos: 'động từ nhóm 1', ipa: 'utsurimasu [utsuru]', vi: 'hiện lên, được ghi lại (trong gương, camera, màn hình)', ex: '{防犯|ぼうはん}カメラに、{犯人|はんにん}の{顔|かお}がはっきり{映|うつ}っていました。', exRo: 'Bouhan kamera ni, hannin no kao ga hakkiri utsutte imashita.', exVi: 'Mặt thủ phạm hiện rõ trong camera an ninh.', more: '**{鏡|かがみ}／カメラ／テレビに{映|うつ}る** · **{防犯|ぼうはん}カメラ** (camera an ninh) · ↔ {映|うつ}す (chiếu, phản chiếu) · ⚠ **{写|うつ}る** = được chụp vào ẢNH ({写真|しゃしん}に{写|うつ}る). N3.' },
        { w: '{見|み}かけます［{見|み}かける］2', pos: 'động từ nhóm 2', ipa: 'mikakemasu [mikakeru]', vi: 'tình cờ thấy, bắt gặp', ex: '{昨日|きのう}、{駅|えき}でカルロスさんを{見|み}かけました。', exRo: 'Kinou, eki de Karurosu-san o mikakemashita.', exVi: 'Hôm qua tôi tình cờ thấy Carlos ở ga.', more: '≈ {見|み}る nhưng là **thấy thoáng qua, không định trước** · **よく{見|み}かける** (hay bắt gặp) · {見|み}かけ (vẻ bề ngoài — N2). N3.' },
        { w: '{深夜|しんや}', pos: 'danh từ', ipa: "shin'ya", vi: 'đêm khuya (khoảng 0–3 giờ sáng)', ex: '{事件|じけん}は{深夜|しんや}2{時|じ}ごろに{起|お}こりました。', exRo: "Jiken wa shin'ya niji goro ni okorimashita.", exVi: 'Vụ việc xảy ra vào khoảng 2 giờ đêm.', more: '**{深夜|しんや}バス／{深夜番組|しんやばんぐみ}** · ≈ {夜中|よなか} (văn nói — Bài 22) · {深夜|しんや} là văn viết, tin tức. N3–N2.' },
        { w: '{現在|げんざい}', pos: 'danh từ / phó từ', ipa: 'genzai', vi: 'hiện tại, hiện nay; tính đến (thời điểm)', ex: '{現在|げんざい}、{犯人|はんにん}はまだ{見|み}つかっていません。', exRo: 'Genzai, hannin wa mada mitsukatte imasen.', exVi: 'Hiện tại thủ phạm vẫn chưa được tìm thấy.', more: '**{午前|ごぜん}7{時|じ}{現在|げんざい}** (tính đến 7 giờ sáng — bảng thông báo) · ≈ {今|いま} (văn nói) · **{過去|かこ}・{現在|げんざい}・{未来|みらい}**. N3.' },
        { w: '{過去|かこ}', pos: 'danh từ', ipa: 'kako', vi: 'quá khứ', ex: '{過去|かこ}のことは、もう{気|き}にしないでください。', exRo: 'Kako no koto wa, mou ki ni shinaide kudasai.', exVi: 'Chuyện quá khứ thì đừng bận tâm nữa.', more: '**{過去|かこ}の{記録|きろく}** · **{過去最高|かこさいこう}** (cao nhất từ trước tới nay — tin tức) · {過|す}ぎる cùng chữ 過 (Bài 31 dạy chữ). N3.' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Đồ thất lạc & trí nhớ (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{置|お}き{忘|わす}れます［{置|お}き{忘|わす}れる］2', pos: 'động từ nhóm 2', ipa: 'okiwasuremasu [okiwasureru]', vi: 'để quên (đặt ở đâu đó rồi quên mang theo)', ex: '{電車|でんしゃ}の{棚|たな}に、{傘|かさ}を{置|お}き{忘|わす}れてしまいました。', exRo: 'Densha no tana ni, kasa o okiwasurete shimaimashita.', exVi: 'Tôi để quên ô trên giá hành lý của tàu mất rồi.', more: '≈ {忘|わす}れる nhưng nhấn **"đặt xuống rồi quên"**, luôn có **nơi chốn ＋ に** · {置|お}き{忘|わす}れ (danh từ — đồ để quên) · ôn ～てしまう (Bài 19). N2–N3.' },
        { w: '{探|さが}し{回|まわ}ります［{探|さが}し{回|まわ}る］1', pos: 'động từ nhóm 1', ipa: 'sagashimawarimasu [sagashimawaru]', vi: 'tìm khắp nơi, lùng sục', ex: '{一時間|いちじかん}も{部屋|へや}の{中|なか}を{探|さが}し{回|まわ}ったのに、{見|み}つかりませんでした。', exRo: 'Ichijikan mo heya no naka o sagashimawatta noni, mitsukarimasen deshita.', exVi: 'Lùng sục khắp phòng những một tiếng vậy mà không tìm thấy.', more: '**Vます ＋ {回|まわ}る** = làm khắp nơi: {走|はし}り{回|まわ}る (chạy khắp), {聞|き}き{回|まわ}る (đi hỏi khắp nơi) · ôn ～のに (Bài 19). N2.' },
        { w: '{中身|なかみ}', pos: 'danh từ', ipa: 'nakami', vi: 'đồ bên trong, ruột; nội dung', ex: 'かばんの{中身|なかみ}を{全部|ぜんぶ}{出|だ}して、{確|たし}かめました。', exRo: 'Kaban no nakami o zenbu dashite, tashikamemashita.', exVi: 'Tôi lấy hết đồ trong cặp ra để kiểm tra.', more: '**{財布|さいふ}／{箱|はこ}の{中身|なかみ}** · nghĩa bóng: **{話|はなし}の{中身|なかみ}** (nội dung câu chuyện) · ≈ {内容|ないよう} (văn viết). N3.' },
        { w: '{特徴|とくちょう}', pos: 'danh từ', ipa: 'tokuchou', vi: 'đặc điểm, nét riêng', ex: '{落|お}とした{傘|かさ}の{特徴|とくちょう}を{教|おし}えてください。', exRo: 'Otoshita kasa no tokuchou o oshiete kudasai.', exVi: 'Xin cho biết đặc điểm của chiếc ô bạn đánh rơi.', more: '**～の{特徴|とくちょう}は～ことだ** · **{特徴|とくちょう}がある** · ≈ {特色|とくしょく} (nét đặc sắc — N2) · chữ 徴 N1. N3.' },
        { w: '{目印|めじるし}', pos: 'danh từ', ipa: 'mejirushi', vi: 'dấu hiệu nhận biết, mốc', ex: '{鍵|かぎ}に{赤|あか}いリボンを{付|つ}けて、{目印|めじるし}にしています。', exRo: 'Kagi ni akai ribon o tsukete, mejirushi ni shite imasu.', exVi: 'Tôi buộc ruy băng đỏ vào chìa khoá để làm dấu nhận biết.', more: '**～を{目印|めじるし}にする** · **{駅|えき}の{前|まえ}の{大|おお}きな{木|き}が{目印|めじるし}です** (khi chỉ đường) · {印|しるし} = dấu. N2.' },
        { w: '{記憶|きおく}', pos: 'danh từ', ipa: 'kioku', vi: 'trí nhớ, ký ức', ex: '{昨日|きのう}の{夜|よる}のことは、{全然|ぜんぜん}{記憶|きおく}にありません。', exRo: 'Kinou no yoru no koto wa, zenzen kioku ni arimasen.', exVi: 'Chuyện tối qua tôi hoàn toàn không nhớ gì.', more: '**{記憶|きおく}にある／ない** · **{記憶|きおく}が{確|たし}かだ／あいまいだ** · **{記憶力|きおくりょく}** (khả năng ghi nhớ) · ≈ {思|おも}い{出|で} (kỷ niệm — Bài 15). N3.' },
        { w: '{思|おも}い{出|だ}します［{思|おも}い{出|だ}す］1', pos: 'động từ nhóm 1', ipa: 'omoidashimasu [omoidasu]', vi: 'nhớ ra, nhớ lại', ex: 'あの{人|ひと}の{名前|なまえ}が、どうしても{思|おも}い{出|だ}せません。', exRo: 'Ano hito no namae ga, doushite mo omoidasemasen.', exVi: 'Tên người đó tôi nghĩ mãi không nhớ ra.', more: '**N を{思|おも}い{出|だ}す** · ⚠ **{思|おも}い{出|で}** (danh từ — kỷ niệm, Bài 15) đọc **で**; **{思|おも}い{出|だ}す** (động từ) đọc **だ** · ≈ {覚|おぼ}えている (vẫn nhớ). N4 (lần đầu vào bảng từ).' },
        { w: '{見覚|みおぼ}え', pos: 'danh từ', ipa: 'mioboe', vi: 'sự trông quen, đã từng thấy', ex: 'この{傘|かさ}には{見覚|みおぼ}えがあります。{木村|きむら}さんのじゃないですか。', exRo: 'Kono kasa ni wa mioboe ga arimasu. Kimura-san no ja nai desu ka.', exVi: 'Cái ô này trông quen. Có phải của chị Kimura không?', more: '**～に{見覚|みおぼ}えがある／ない** · {聞|き}き{覚|おぼ}え (nghe quen) · {覚|おぼ}える (nhớ). N2.' },
        { w: '{袋|ふくろ}', pos: 'danh từ', ipa: 'fukuro', vi: 'túi, bao', ex: 'コンビニの{袋|ふくろ}に、{財布|さいふ}と{鍵|かぎ}を{入|い}れました。', exRo: 'Konbini no fukuro ni, saifu to kagi o iremashita.', exVi: 'Tôi bỏ ví và chìa khoá vào túi của cửa hàng tiện lợi.', more: '**{紙袋|かみぶくろ}** (túi giấy) · **ビニール{袋|ぶくろ}** (túi ni lông) · {手袋|てぶくろ} (găng tay) — đứng sau chữ khác đọc **ぶくろ**. N3.' },
        { w: '{定期券|ていきけん}', pos: 'danh từ', ipa: 'teikiken', vi: 'vé tháng (tàu, xe buýt)', ex: '{定期券|ていきけん}をなくしたので、{駅|えき}の{窓口|まどぐち}に{聞|き}きに{行|い}きました。', exRo: 'Teikiken o nakushita node, eki no madoguchi ni kiki ni ikimashita.', exVi: 'Vì làm mất vé tháng nên tôi đến quầy ở ga để hỏi.', more: 'Nói tắt: **{定期|ていき}** · **{定期券|ていきけん}を{買|か}う／{更新|こうしん}する** (gia hạn) · thường nạp trong thẻ IC. N3.' },
        { w: '{学生証|がくせいしょう}', pos: 'danh từ', ipa: 'gakuseishou', vi: 'thẻ sinh viên', ex: '{図書館|としょかん}に{入|はい}るときは、{学生証|がくせいしょう}が{必要|ひつよう}です。', exRo: 'Toshokan ni hairu toki wa, gakuseishou ga hitsuyou desu.', exVi: 'Khi vào thư viện cần thẻ sinh viên.', more: '～{証|しょう} = giấy chứng nhận: {保険証|ほけんしょう} (thẻ bảo hiểm), {免許証|めんきょしょう} (bằng lái), {社員証|しゃいんしょう} (thẻ nhân viên). N3.' },
        { w: '{持|も}ち{主|ぬし}', pos: 'danh từ', ipa: 'mochinushi', vi: 'chủ sở hữu, người chủ (của đồ vật)', ex: '{拾|ひろ}った{財布|さいふ}の{持|も}ち{主|ぬし}が、{無事|ぶじ}に{見|み}つかりました。', exRo: 'Hirotta saifu no mochinushi ga, buji ni mitsukarimashita.', exVi: 'Đã tìm được chủ của chiếc ví nhặt được.', more: '**{落|お}とし{物|もの}の{持|も}ち{主|ぬし}** · {車|くるま}の{持|も}ち{主|ぬし} · ≈ オーナー. N2.' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Lý do & giải thích (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'わけ（{訳|わけ}）', pos: 'danh từ', ipa: 'wake', vi: 'lý do, lẽ; ý nghĩa', ex: '{彼女|かのじょ}が{怒|おこ}っているわけを{知|し}っていますか。', exRo: 'Kanojo ga okotte iru wake o shitte imasu ka.', exVi: 'Bạn có biết lý do cô ấy giận không?', more: '**わけを{聞|き}く／{話|はな}す** · **わけが{分|わ}からない** (chẳng hiểu ra sao) · đây là gốc của cả nhóm mẫu **～わけだ・わけではない・わけがない・わけにはいかない** · {言|い}い{訳|わけ} (Bài 28) · {申|もう}し{訳|わけ}ない. N3.' },
        { w: '{事情|じじょう}', pos: 'danh từ', ipa: 'jijou', vi: 'hoàn cảnh, sự tình (lý do riêng)', ex: '{家族|かぞく}の{事情|じじょう}で、{国|くに}に{帰|かえ}ることになりました。', exRo: 'Kazoku no jijou de, kuni ni kaeru koto ni narimashita.', exVi: 'Vì hoàn cảnh gia đình, tôi phải về nước.', more: '**{事情|じじょう}がある** (có lý do riêng — nói khéo, không cần kể chi tiết) · **{事情|じじょう}を{説明|せつめい}する** · ≈ {理由|りゆう} (lý do rõ ràng). N3.' },
        { w: '{道理|どうり}で', pos: 'phó từ', ipa: 'douri de', vi: 'thảo nào, hèn chi', ex: '「{彼|かれ}、{昨日|きのう}{徹夜|てつや}したんだって。」「{道理|どうり}で{眠|ねむ}そうなわけだ。」', exRo: '"Kare, kinou tetsuya shita n datte." "Douri de nemusou na wake da."', exVi: '"Nghe nói hôm qua cậu ấy thức trắng." — "Thảo nào trông buồn ngủ thế."', more: '**{道理|どうり}で～わけだ／はずだ** (đi đôi — mẫu ⑤) · thường viết kana **どうりで** · {道理|どうり} = lẽ phải · {徹夜|てつや} (thức trắng đêm — N3). N2.' },
        { w: 'なるほど', pos: 'cảm thán từ', ipa: 'naruhodo', vi: 'ra vậy, quả đúng thế', ex: 'なるほど、そういうわけだったんですね。', exRo: 'Naruhodo, sou iu wake datta n desu ne.', exVi: 'Ra vậy, hoá ra là vì thế.', more: 'Đáp lại khi **hiểu ra / đồng ý** với lời giải thích · ⚠ nói với người trên nghe hơi "nhận xét từ trên xuống" — lịch sự hơn: **そうなんですね／よく{分|わ}かりました**. N3.' },
        { w: 'つまり', pos: 'liên từ', ipa: 'tsumari', vi: 'tức là, nói cách khác', ex: '{母|はは}の{姉|あね}の{娘|むすめ}、つまり{私|わたし}のいとこが{日本|にほん}に{来|き}ます。', exRo: 'Haha no ane no musume, tsumari watashi no itoko ga Nihon ni kimasu.', exVi: 'Con gái của chị gái mẹ tôi, tức là chị họ tôi, sẽ sang Nhật.', more: '**つまり～わけだ／ということだ** (đi đôi — mẫu ⑤) · ≈ **{要|よう}するに** (tóm lại — gọn hơn, có khi hơi sốt ruột). N3.' },
        { w: '{要|よう}するに', pos: 'phó từ', ipa: 'you suru ni', vi: 'tóm lại, nói gọn là', ex: '{要|よう}するに、{君|きみ}は{行|い}きたくないんだね。', exRo: 'You suru ni, kimi wa ikitaku nai n da ne.', exVi: 'Tóm lại là cậu không muốn đi chứ gì.', more: 'Tóm **ý chính** của một đoạn dài vừa nói · đi với **～ということだ／～わけだ** · ≈ つまり. N3.' },
        { w: '{当|あ}たり{前|まえ}', pos: 'danh từ / tính từ な', ipa: 'atarimae', vi: 'đương nhiên, chuyện thường tình', ex: '{約束|やくそく}の{時間|じかん}を{守|まも}るのは{当|あ}たり{前|まえ}です。', exRo: 'Yakusoku no jikan o mamoru no wa atarimae desu.', exVi: 'Giữ đúng giờ hẹn là chuyện đương nhiên.', more: '**～のは{当|あ}たり{前|まえ}だ** · **{当|あ}たり{前|まえ}のこと** (việc đương nhiên) · ≈ {当然|とうぜん} (Bài 28 — văn viết hơn). N3.' },
        { w: '{理解|りかい}します［{理解|りかい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'rikai shimasu [rikai suru]', vi: 'hiểu, lý giải', ex: '{先生|せんせい}の{説明|せつめい}で、やっと{文法|ぶんぽう}が{理解|りかい}できました。', exRo: 'Sensei no setsumei de, yatto bunpou ga rikai dekimashita.', exVi: 'Nhờ lời giải thích của thầy, cuối cùng tôi đã hiểu được ngữ pháp.', more: '**N を{理解|りかい}する／N が{理解|りかい}できる** · **{理解|りかい}がある** (thông cảm, hiểu cho người khác) · ≈ {分|わ}かる (văn nói). N3.' },
        { w: '{勘違|かんちが}いします［{勘違|かんちが}いする］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'kanchigai shimasu [kanchigai suru]', vi: 'nhầm tưởng, nghĩ sai (tự mình)', ex: '{授業|じゅぎょう}は{火曜日|かようび}だと{勘違|かんちが}いしていました。', exRo: 'Jugyou wa kayoubi da to kanchigai shite imashita.', exVi: 'Tôi cứ tưởng nhầm tiết học vào thứ Ba.', more: '**～と{勘違|かんちが}いする** · {勘違|かんちが}い = MÌNH nghĩ sai một sự việc; {誤解|ごかい} = hiểu sai Ý / CON NGƯỜI của người khác · chữ 勘 N1. N3.' },
        { w: '{誤解|ごかい}します［{誤解|ごかい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'gokai shimasu [gokai suru]', vi: 'hiểu lầm (ý, lời người khác)', ex: '{私|わたし}の{言|い}い{方|かた}が{悪|わる}くて、{友達|ともだち}に{誤解|ごかい}されてしまいました。', exRo: 'Watashi no iikata ga warukute, tomodachi ni gokai sarete shimaimashita.', exVi: 'Tại cách nói của tôi không tốt nên bị bạn hiểu lầm.', more: '**{誤解|ごかい}される／{誤解|ごかい}を{招|まね}く** (gây hiểu lầm — N2) · **{誤解|ごかい}を{解|と}く** (gỡ hiểu lầm) · {誤|ご} = sai. N3.' },
        { w: '{決|けっ}して～ない', pos: 'phó từ', ipa: 'kesshite ~ nai', vi: 'tuyệt đối không, không bao giờ', ex: 'このことは、{決|けっ}して{誰|だれ}にも{言|い}わないでください。', exRo: 'Kono koto wa, kesshite dare ni mo iwanaide kudasai.', exVi: 'Chuyện này tuyệt đối đừng nói với ai.', more: 'Luôn đi với **phủ định** · ≈ {絶対|ぜったい}に～ない (Bài 20 — văn nói hơn) · **{決|けっ}して{簡単|かんたん}ではない** (không hề dễ). N3.' },
        { w: '{別|べつ}に～ない', pos: 'phó từ', ipa: 'betsu ni ~ nai', vi: 'không hẳn, chẳng (có gì đặc biệt)', ex: '{別|べつ}に{怒|おこ}っているわけではありません。', exRo: 'Betsu ni okotte iru wake de wa arimasen.', exVi: 'Tôi chẳng phải đang giận gì đâu.', more: '**{別|べつ}に～わけではない** (đi đôi — mẫu ⑥) · trả lời cụt **「{別|べつ}に。」** = "chẳng có gì" (nghe lạnh lùng — cẩn thận với người trên). N3.' },
        { w: '{引|ひ}き{受|う}けます［{引|ひ}き{受|う}ける］2', pos: 'động từ nhóm 2', ipa: 'hikiukemasu [hikiukeru]', vi: 'nhận (làm), đảm nhận', ex: '{先輩|せんぱい}に{頼|たの}まれて、{発表会|はっぴょうかい}の{司会|しかい}を{引|ひ}き{受|う}けました。', exRo: 'Senpai ni tanomarete, happyoukai no shikai o hikiukemashita.', exVi: 'Được đàn anh nhờ, tôi đã nhận làm MC cho buổi báo cáo.', more: '**{仕事|しごと}／{役|やく}を{引|ひ}き{受|う}ける** · ↔ {断|ことわ}る (Bài 22) · **{一度|いちど}{引|ひ}き{受|う}けたら、{途中|とちゅう}でやめるわけにはいかない** (mẫu ⑦). N3.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Tính chất (～っぽい) & mô tả (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{子|こ}どもっぽい', pos: 'tính từ い', ipa: 'kodomoppoi', vi: 'trẻ con (tính nết, hành động — thường là chê)', ex: '{兄|あに}は{二十歳|はたち}なのに、{子|こ}どもっぽいことばかり{言|い}います。', exRo: 'Ani wa hatachi na noni, kodomoppoi koto bakari iimasu.', exVi: 'Anh tôi đã 20 tuổi vậy mà toàn nói những chuyện trẻ con.', more: 'N ＋ っぽい: người LỚN mà giống trẻ con → **chê** · ⚠ **{子|こ}どもらしい** = đúng chất trẻ con (khen một đứa trẻ hồn nhiên) · ↔ {大人|おとな}っぽい.' },
        { w: '{大人|おとな}っぽい', pos: 'tính từ い', ipa: 'otonappoi', vi: 'chững chạc, trông như người lớn', ex: '{妹|いもうと}は{中学生|ちゅうがくせい}ですが、{大人|おとな}っぽい{服|ふく}が{好|す}きです。', exRo: 'Imouto wa chuugakusei desu ga, otonappoi fuku ga suki desu.', exVi: 'Em gái tôi là học sinh cấp hai nhưng thích quần áo kiểu người lớn.', more: 'Dùng cho người **chưa lớn** mà trông / cư xử như người lớn (thường là khen) · ⚠ nói một người đã lớn là "{大人|おとな}っぽい" thì nghe lạ.' },
        { w: '{忘|わす}れっぽい', pos: 'tính từ い', ipa: 'wasureppoi', vi: 'hay quên', ex: '{最近|さいきん}{忘|わす}れっぽくて、{鍵|かぎ}をよくなくします。', exRo: 'Saikin wasureppokute, kagi o yoku nakushimasu.', exVi: 'Dạo này tôi hay quên, thường xuyên làm mất chìa khoá.', more: '**Vます ＋ っぽい** = **hay, dễ** (tính cách, thói quen) · chia như イA: {忘|わす}れっぽく**て**, {忘|わす}れっぽ**かった**, {忘|わす}れっぽく**ない**.' },
        { w: '{怒|おこ}りっぽい', pos: 'tính từ い', ipa: 'okorippoi', vi: 'dễ nổi nóng, nóng tính', ex: '{父|ちち}は{怒|おこ}りっぽいですが、すぐに{機嫌|きげん}が{直|なお}ります。', exRo: 'Chichi wa okorippoi desu ga, sugu ni kigen ga naorimasu.', exVi: 'Bố tôi dễ nổi nóng nhưng nguôi ngay.', more: '{怒|おこ}る ＋ っぽい · **{機嫌|きげん}が{直|なお}る** (tâm trạng vui trở lại — N2) · ≈ {短気|たんき} (nóng tính — N2).' },
        { w: '{飽|あ}きっぽい', pos: 'tính từ い', ipa: 'akippoi', vi: 'mau chán, cả thèm chóng chán', ex: '{私|わたし}は{飽|あ}きっぽくて、{趣味|しゅみ}が{長|なが}く{続|つづ}きません。', exRo: 'Watashi wa akippokute, shumi ga nagaku tsuzukimasen.', exVi: 'Tôi mau chán nên sở thích không kéo dài được.', more: '{飽|あ}きる (chán, ngán — N3) ＋ っぽい · **{飽|あ}きっぽい{性格|せいかく}** · chữ 飽 N1 — hay viết kana **あきっぽい**.' },
        { w: '{安|やす}っぽい', pos: 'tính từ い', ipa: 'yasuppoi', vi: 'trông rẻ tiền, kém sang', ex: 'このかばんは{高|たか}かったのに、{安|やす}っぽく{見|み}えます。', exRo: 'Kono kaban wa takakatta noni, yasuppoku miemasu.', exVi: 'Cái túi này đắt vậy mà trông rẻ tiền.', more: '**イA bỏ い ＋ っぽい** · **luôn mang nghĩa chê** · ⚠ khác {安|やす}い (rẻ thật): đồ đắt vẫn có thể {安|やす}っぽい.' },
        { w: '{白|しろ}っぽい', pos: 'tính từ い', ipa: 'shiroppoi', vi: 'trăng trắng, ngả trắng', ex: '{犯人|はんにん}は{白|しろ}っぽいコートを{着|き}ていたそうです。', exRo: 'Hannin wa shiroppoi kooto o kite ita sou desu.', exVi: 'Nghe nói thủ phạm mặc áo khoác ngả trắng.', more: '**màu ＋ っぽい** = **gần với màu đó** (không dám chắc chính xác): {黒|くろ}っぽい, {赤|あか}っぽい, {青|あお}っぽい · rất hay dùng khi **mô tả đồ thất lạc, người khả nghi**.' },
        { w: '{熱|ねつ}っぽい', pos: 'tính từ い', ipa: 'netsuppoi', vi: 'hơi sốt, gây gây sốt', ex: '{朝|あさ}から{熱|ねつ}っぽいので、{今日|きょう}は{早|はや}く{寝|ね}ます。', exRo: 'Asa kara netsuppoi node, kyou wa hayaku nemasu.', exVi: 'Từ sáng đã thấy gây gây sốt nên hôm nay tôi đi ngủ sớm.', more: '**N ＋ っぽい** = **có triệu chứng** · ≈ **{風邪|かぜ}っぽい** (hơi cảm) · ⚠ khác {熱|あつ}い (nóng — đồ vật).' },
        { w: '{細|こま}かい', pos: 'tính từ い', ipa: 'komakai', vi: 'nhỏ, vụn; chi tiết, tỉ mỉ', ex: '{探偵|たんてい}は、{細|こま}かいことにもよく{気|き}がつきます。', exRo: 'Tantei wa, komakai koto ni mo yoku ki ga tsukimasu.', exVi: 'Thám tử để ý cả những chuyện nhỏ nhặt.', more: '**{細|こま}かいお{金|かね}** (tiền lẻ) · **{細|こま}かく{説明|せつめい}する** (giải thích tỉ mỉ) · ⚠ **{細|ほそ}い** = mảnh, gầy (CÙNG chữ 細, khác cách đọc!). N3.' },
        { w: '{詳|くわ}しい', pos: 'tính từ い', ipa: 'kuwashii', vi: 'chi tiết, tường tận; thông thạo', ex: '{事件|じけん}のことを、もう{少|すこ}し{詳|くわ}しく{話|はな}してください。', exRo: 'Jiken no koto o, mou sukoshi kuwashiku hanashite kudasai.', exVi: 'Hãy kể chi tiết hơn một chút về vụ việc.', more: '**{詳|くわ}しく{説明|せつめい}する** · **N に{詳|くわ}しい** (thông thạo N: {彼|かれ}は{歴史|れきし}に{詳|くわ}しい) · {細|こま}かい = chi tiết NHỎ; {詳|くわ}しい = ĐẦY ĐỦ, tường tận. N3.' },
        { w: '{恐|おそ}ろしい', pos: 'tính từ い', ipa: 'osoroshii', vi: 'đáng sợ, kinh khủng', ex: 'ゆうべ、{恐|おそ}ろしい{夢|ゆめ}を{見|み}ました。', exRo: 'Yuube, osoroshii yume o mimashita.', exVi: 'Tối qua tôi mơ một giấc mơ đáng sợ.', more: '≈ {怖|こわ}い (Bài 15 — văn nói, cảm giác của mình) · {恐|おそ}ろしい (văn viết hơn, mức độ mạnh, nói về sự việc) · {恐|おそ}らく cùng chữ 恐. N3.' },
        { w: '{印象|いんしょう}', pos: 'danh từ', ipa: 'inshou', vi: 'ấn tượng', ex: '{初|はじ}めて{会|あ}ったとき、{西川|にしかわ}さんは{怖|こわ}そうな{印象|いんしょう}でした。', exRo: 'Hajimete atta toki, Nishikawa-san wa kowasou na inshou deshita.', exVi: 'Lần đầu gặp, anh Nishikawa cho tôi ấn tượng là trông có vẻ đáng sợ.', more: '**{印象|いんしょう}がいい／{悪|わる}い** · **{第一印象|だいいちいんしょう}** (ấn tượng đầu tiên) · **{印象|いんしょう}に{残|のこ}る** (đọng lại ấn tượng). N3.' },
      ],
    },
    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra từ (chạm thẻ để nghe)',
      items: [
        { anh: 'detective', w: '{探偵|たんてい}', ro: 'tantei', vi: 'thám tử (hình: thám tử)' },
        { anh: 'magnifying-glass-tilted-left', w: '{推理|すいり}する', ro: 'suiri suru', vi: 'suy luận (hình: kính lúp)' },
        { anh: 'thinking-face', w: '{推測|すいそく}する', ro: 'suisoku suru', vi: 'phỏng đoán (hình: mặt đang nghĩ)' },
        { anh: 'thought-balloon', w: '{想像|そうぞう}する', ro: 'souzou suru', vi: 'tưởng tượng (hình: bong bóng suy nghĩ)' },
        { anh: 'light-bulb', w: '{気|き}づく', ro: 'kizuku', vi: 'nhận ra (hình: bóng đèn bật sáng)' },
        { anh: 'red-question-mark', w: '{謎|なぞ}', ro: 'nazo', vi: 'điều bí ẩn (hình: dấu hỏi)' },
        { anh: 'puzzle-piece', w: '{手|て}がかり', ro: 'tegakari', vi: 'manh mối (hình: mảnh ghép)' },
        { anh: 'footprints', w: '{足跡|あしあと}', ro: 'ashiato', vi: 'dấu chân (hình: dấu chân)' },
        { anh: 'face-with-raised-eyebrow', w: '{怪|あや}しい', ro: 'ayashii', vi: 'đáng ngờ (hình: mặt nhướn mày)' },
        { anh: 'lying-face', w: 'うそ', ro: 'uso', vi: 'lời nói dối (hình: mũi dài)' },
        { anh: 'shushing-face', w: '{隠|かく}す', ro: 'kakusu', vi: 'giấu kín (hình: "suỵt")' },
        { anh: 'video-camera', w: '{映|うつ}る', ro: 'utsuru', vi: 'hiện trong camera (hình: máy quay)' },
        { anh: 'crescent-moon', w: '{深夜|しんや}', ro: "shin'ya", vi: 'đêm khuya (hình: trăng khuyết)' },
        { anh: 'closed-book', w: '{推理小説|すいりしょうせつ}', ro: 'suiri shousetsu', vi: 'truyện trinh thám (hình: cuốn sách)' },
        { anh: 'face-with-monocle', w: '{細|こま}かい', ro: 'komakai', vi: 'tỉ mỉ (hình: soi kỹ bằng kính một mắt)' },
        { anh: 'package', w: '{中身|なかみ}', ro: 'nakami', vi: 'đồ bên trong (hình: gói hàng)' },
        { anh: 'shopping-bags', w: '{袋|ふくろ}', ro: 'fukuro', vi: 'túi (hình: túi mua sắm)' },
        { anh: 'ticket', w: '{定期券|ていきけん}', ro: 'teikiken', vi: 'vé tháng (hình: tấm vé)' },
        { anh: 'identification-card', w: '{学生証|がくせいしょう}', ro: 'gakuseishou', vi: 'thẻ sinh viên (hình: thẻ có ảnh)' },
        { anh: 'label', w: '{目印|めじるし}', ro: 'mejirushi', vi: 'dấu nhận biết (hình: nhãn buộc)' },
        { anh: 'brain', w: '{記憶|きおく}', ro: 'kioku', vi: 'trí nhớ (hình: bộ não)' },
        { anh: 'angry-face', w: '{怒|おこ}りっぽい', ro: 'okorippoi', vi: 'dễ nổi nóng (hình: mặt giận)' },
        { anh: 'face-with-thermometer', w: '{熱|ねつ}っぽい', ro: 'netsuppoi', vi: 'hơi sốt (hình: ngậm nhiệt kế)' },
        { anh: 'ghost', w: '{恐|おそ}ろしい', ro: 'osoroshii', vi: 'đáng sợ (hình: con ma)' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ của bài + mẫu ngữ pháp của bài — học thành cụm để nói ngay',
      head: ['Từ', 'Cụm với mẫu của bài', 'Romaji', 'Nghĩa'],
      rows: [
        ['{証拠|しょうこ}', '{証拠|しょうこ}がある。{彼|かれ}が{犯人|はんにん}**に{違|ちが}いない**', 'shouko ga aru. kare ga hannin ni chigainai', 'có chứng cứ. chắc chắn anh ta là thủ phạm (①)'],
        ['{怪|あや}しい', 'あの{人|ひと}は{怪|あや}しい。うそをついている**に{違|ちが}いない**', 'ano hito wa ayashii. uso o tsuite iru ni chigainai', 'người đó khả nghi. chắc chắn đang nói dối (①)'],
        ['{記憶|きおく}', '{記憶|きおく}が{確|たし}かなら、{鍵|かぎ}を{落|お}とした**はずがない**', 'kioku ga tashika nara, kagi o otoshita hazu ga nai', 'nếu trí nhớ chính xác thì không lẽ nào đã đánh rơi chìa (②)'],
        ['{防犯|ぼうはん}カメラ・{映|うつ}る', 'カメラに{映|うつ}っていないから、ここを{通|とお}った**はずがない**', 'kamera ni utsutte inai kara, koko o tootta hazu ga nai', 'không có trong camera nên không lẽ nào đã qua đây (②)'],
        ['{当|あ}たり{前|まえ}', 'そんな{当|あ}たり{前|まえ}のこと、{忘|わす}れる**わけがない**', 'sonna atarimae no koto, wasureru wake ga nai', 'chuyện hiển nhiên thế làm gì có chuyện quên (③)'],
        ['{白|しろ}っぽい・{袋|ふくろ}', '**{白|しろ}っぽい**{紙袋|かみぶくろ}を{置|お}き{忘|わす}れた', 'shiroppoi kamibukuro o okiwasureta', 'để quên chiếc túi giấy ngả trắng (④)'],
        ['{忘|わす}れっぽい', '{私|わたし}は**{忘|わす}れっぽい**ので、{鍵|かぎ}に{目印|めじるし}を{付|つ}けている', 'watashi wa wasureppoi node, kagi ni mejirushi o tsukete iru', 'tôi hay quên nên gắn dấu vào chìa khoá (④)'],
        ['{道理|どうり}で', '{道理|どうり}で{見|み}つからない**わけだ**', 'douri de mitsukaranai wake da', 'thảo nào không tìm thấy (⑤)'],
        ['つまり', 'つまり、{犯人|はんにん}は{中|なか}にいた**わけだ**', 'tsumari, hannin wa naka ni ita wake da', 'tức là thủ phạm đã ở bên trong (⑤)'],
        ['{別|べつ}に', '{別|べつ}に{疑|うたが}っている**わけではない**', 'betsu ni utagatte iru wake de wa nai', 'chẳng phải là đang nghi ngờ gì (⑥)'],
        ['{理解|りかい}', '{理解|りかい}できない**わけではない**が、{賛成|さんせい}はできない', 'rikai dekinai wake de wa nai ga, sansei wa dekinai', 'không phải là không hiểu, nhưng không tán thành được (⑥)'],
        ['{引|ひ}き{受|う}ける', '{一度|いちど}{引|ひ}き{受|う}けたら、やめる**わけにはいかない**', 'ichido hikiuketara, yameru wake ni wa ikanai', 'đã nhận thì không thể bỏ ngang (⑦)'],
        ['{事情|じじょう}', '{事情|じじょう}があって、{行|い}かない**わけにはいかない**', 'jijou ga atte, ikanai wake ni wa ikanai', 'có lý do riêng, không thể không đi (⑦)'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ Từ dễ nhầm (類義語) — đề N3 phần 言い換え類義 và 用法 hay hỏi',
      head: ['Nhóm', 'Phân biệt', 'Ví dụ đúng', 'Romaji'],
      rows: [
        ['{推理|すいり} ↔ {推測|すいそく} ↔ {想像|そうぞう}', '{推理|すいり}: LẬP LUẬN từng bước từ manh mối đến kết luận (thám tử) · {推測|すいそく}: ĐOÁN từ thông tin có được, ít bước · {想像|そうぞう}: hình dung điều KHÔNG thấy / chưa có (không cần căn cứ)', '{犯人|はんにん}を{推理|すいり}する／{年齢|ねんれい}を{推測|すいそく}する／{未来|みらい}を{想像|そうぞう}する', 'hannin o suiri suru / nenrei o suisoku suru / mirai o souzou suru'],
        ['{恐|おそ}らく ↔ たぶん ↔ きっと ↔ {必|かなら}ず', '{恐|おそ}らく (văn viết) ≈ たぶん (văn nói): ~70%, đi với だろう · きっと (Bài 15): ~90%, cảm giác tin chắc, đi với に{違|ちが}いない／と{思|おも}う · {必|かなら}ず: 100%, sự thật / quy luật / lời hứa', '{恐|おそ}らく{雨|あめ}だろう／きっと{合格|ごうかく}するに{違|ちが}いない／{必|かなら}ず{行|い}きます', 'osoraku ame darou / kitto goukaku suru ni chigainai / kanarazu ikimasu'],
        ['どうやら ↔ もしかすると ↔ まさか', 'どうやら: xem xét rồi thấy "**có vẻ**" (+ らしい／ようだ) · もしかすると: "**biết đâu**" (+ かもしれない) · まさか (Bài 20): "**làm gì có**" (+ ないだろう／わけがない)', 'どうやら{道|みち}を{間違|まちが}えたらしい／まさか{彼|かれ}が{犯人|はんにん}のわけがない', 'douyara michi o machigaeta rashii / masaka kare ga hannin no wake ga nai'],
        ['{隠|かく}す ↔ {隠|かく}れる', '{隠|かく}す: (ai đó) GIẤU cái gì — を · {隠|かく}れる: (người / vật) TỰ NẤP, bị che — が／に', '{鍵|かぎ}を{隠|かく}す／{子|こ}どもが{木|き}の{後|うし}ろに{隠|かく}れる', 'kagi o kakusu / kodomo ga ki no ushiro ni kakureru'],
        ['{映|うつ}る ↔ {写|うつ}る', '{映|うつ}る: hiện trong GƯƠNG, MÀN HÌNH, CAMERA (hình động, phản chiếu) · {写|うつ}る: hiện trong ẢNH chụp', 'カメラに{映|うつ}る／{写真|しゃしん}に{写|うつ}る', 'kamera ni utsuru / shashin ni utsuru'],
        ['{細|こま}かい ↔ {細|ほそ}い ↔ {詳|くわ}しい', '{細|こま}かい: NHỎ, vụn; chi tiết nhỏ nhặt · {細|ほそ}い: MẢNH, hẹp, gầy (sợi, đường, ngón tay) · {詳|くわ}しい: ĐẦY ĐỦ, tường tận; thông thạo', '{細|こま}かいお{金|かね}／{細|ほそ}い{道|みち}／{詳|くわ}しい{説明|せつめい}', 'komakai okane / hosoi michi / kuwashii setsumei'],
        ['{勘違|かんちが}い ↔ {誤解|ごかい} ↔ {思|おも}い{込|こ}み', '{勘違|かんちが}い: MÌNH tưởng nhầm một sự việc (ngày, giờ, người) · {誤解|ごかい}: hiểu sai Ý / CON NGƯỜI người khác · {思|おも}い{込|こ}み: cứ ĐINH NINH, không chịu kiểm tra (N2)', '{日|ひ}にちを{勘違|かんちが}いした／{彼|かれ}を{誤解|ごかい}していた', 'hinichi o kanchigai shita / kare o gokai shite ita'],
        ['{恐|おそ}ろしい ↔ {怖|こわ}い', 'cùng "sợ"; {怖|こわ}い (Bài 15): cảm giác của MÌNH, văn nói · {恐|おそ}ろしい: mạnh hơn, văn viết, nói về SỰ VIỆC đáng sợ ({恐|おそ}ろしい{事件|じけん})', '{犬|いぬ}が{怖|こわ}い／{恐|おそ}ろしい{事件|じけん}が{起|お}きた', 'inu ga kowai / osoroshii jiken ga okita'],
        ['{現在|げんざい} ↔ {今|いま} · {深夜|しんや} ↔ {夜中|よなか}', '{現在|げんざい}・{深夜|しんや}: văn viết, bản tin, thông báo · {今|いま}・{夜中|よなか} (Bài 22): văn nói', '{午前|ごぜん}7{時|じ}{現在|げんざい}／{深夜|しんや}{番組|ばんぐみ}', 'gozen shichiji genzai / shin\'ya bangumi'],
        ['{落|お}とす ↔ なくす ↔ {忘|わす}れる ↔ {置|お}き{忘|わす}れる', '{落|お}とす: ĐÁNH RƠI · なくす (Bài 10): LÀM MẤT (không rõ ở đâu) · {忘|わす}れる: QUÊN (không mang) · {置|お}き{忘|わす}れる: ĐẶT XUỐNG ở một chỗ rồi quên', '{財布|さいふ}を{落|お}とした／{鍵|かぎ}をなくした／{電車|でんしゃ}に{傘|かさ}を{置|お}き{忘|わす}れた', 'saifu o otoshita / kagi o nakushita / densha ni kasa o okiwasureta'],
        ['{気|き}づく ↔ {気|き}がつく ↔ {分|わ}かる', '{気|き}づく ≈ {気|き}がつく: CHỢT nhận ra điều trước đó không để ý (に) · {分|わ}かる: hiểu, biết (kết quả của suy nghĩ)', 'ミスに{気|き}づいた／{答|こた}えが{分|わ}かった', 'misu ni kizuita / kotae ga wakatta'],
        ['{子|こ}どもっぽい ↔ {子|こ}どもらしい', '～っぽい: KHÔNG phải N mà GIỐNG N (thường chê: người lớn mà trẻ con) · ～らしい (N3 — nghĩa "đúng chất"): ĐÚNG là N, có đủ nét tốt của N (khen)', '{大人|おとな}なのに{子|こ}どもっぽい／{子|こ}どもらしい{笑顔|えがお}', 'otona na noni kodomoppoi / kodomorashii egao'],
        ['つまり ↔ {要|よう}するに ↔ {道理|どうり}で', 'つまり: NÓI LẠI bằng cách khác (tức là) · {要|よう}するに: TÓM GỌN ý chính · {道理|どうり}で: HIỂU RA lý do (thảo nào) — cả ba hay đi với ～わけだ', 'つまり{同|おな}じ{人|ひと}だ／{要|よう}するに{反対|はんたい}なんだ／{道理|どうり}で{寒|さむ}いわけだ', 'tsumari onaji hito da / you suru ni hantai na n da / douri de samui wake da'],
        ['{犯罪|はんざい} ↔ {犯人|はんにん} ↔ {容疑者|ようぎしゃ}', '{犯罪|はんざい}: HÀNH VI phạm tội · {犯人|はんにん} (Bài 22): NGƯỜI đã gây ra (đã xác định) · {容疑者|ようぎしゃ}: người BỊ NGHI (chưa kết luận — tin tức)', '{犯罪|はんざい}を{防|ふせ}ぐ／{犯人|はんにん}が{捕|つか}まった／{容疑者|ようぎしゃ}を{調|しら}べる', 'hanzai o fusegu / hannin ga tsukamatta / yougisha o shiraberu'],
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '**{推理|すいり}が{当|あ}たる／{外|はず}れる** · **～と{推測|すいそく}する** · **{想像|そうぞう}がつく** · **{可能性|かのうせい}が{高|たか}い／{低|ひく}い** · **{恐|おそ}らく～だろう** · **どうやら～らしい** · **もしかすると～かもしれない** · **{明|あき}らかにする** · **{証拠|しょうこ}が{見|み}つかる** · **{手|て}がかりをつかむ** · **{謎|なぞ}を{解|と}く** · **{問題|もんだい}を{解決|かいけつ}する** · **ミスに{気|き}づく**',
        '**{事件|じけん}が{解決|かいけつ}する** · **{現場|げんば}に{駆|か}けつける** (vội đến hiện trường — N2) · **{犯罪|はんざい}を{防|ふせ}ぐ** · **{本当|ほんとう}のことを{隠|かく}す** · **{物陰|ものかげ}に{隠|かく}れる** (nấp sau đồ vật — N2) · **うそをつく** · **{怪|あや}しい{人|ひと}を{見|み}かける** · **{足跡|あしあと}が{残|のこ}る** · **{防犯|ぼうはん}カメラに{映|うつ}る** · **{深夜|しんや}に{起|お}こる**',
        '**{電車|でんしゃ}に{傘|かさ}を{置|お}き{忘|わす}れる** · **{部屋中|へやじゅう}を{探|さが}し{回|まわ}る** · **{中身|なかみ}を{確|たし}かめる** · **{特徴|とくちょう}を{伝|つた}える** · **～を{目印|めじるし}にする** · **{記憶|きおく}にない／{記憶|きおく}が{確|たし}かだ** · **{名前|なまえ}を{思|おも}い{出|だ}す** · **{顔|かお}に{見覚|みおぼ}えがある** · **{紙袋|かみぶくろ}に{入|い}れる** · **{定期券|ていきけん}を{更新|こうしん}する** · **{学生証|がくせいしょう}を{見|み}せる** · **{持|も}ち{主|ぬし}に{返|かえ}す**',
        '**わけを{聞|き}く** · **{事情|じじょう}がある／{事情|じじょう}を{説明|せつめい}する** · **{道理|どうり}で～わけだ** · **つまり～ということだ** · **{要|よう}するに～わけだ** · **～のは{当|あ}たり{前|まえ}だ** · **{理解|りかい}がある** · **～と{勘違|かんちが}いする** · **{誤解|ごかい}を{解|と}く** · **{決|けっ}して～ない** · **{別|べつ}に～わけではない** · **{仕事|しごと}を{引|ひ}き{受|う}ける**',
        '**{子|こ}どもっぽい{服|ふく}** · **{大人|おとな}っぽい{話|はな}し{方|かた}** · **{忘|わす}れっぽい{性格|せいかく}** · **{安|やす}っぽく{見|み}える** · **{白|しろ}っぽい{色|いろ}** · **{熱|ねつ}っぽい{気|き}がする** · **{細|こま}かいことに{気|き}がつく** · **{詳|くわ}しく{話|はな}す／{歴史|れきし}に{詳|くわ}しい** · **{恐|おそ}ろしい{事件|じけん}** · **{印象|いんしょう}に{残|のこ}る／{第一印象|だいいちいんしょう}がいい**',
      ],
    },
    {
      t: 'write',
      id: 'b31-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['推理', '想像', '可能性', '現場', '犯罪', '理解', '細かい', '詳しい', '深夜', '印象'],
      goi: {
        '推理': 'すいり · suy luận',
        '想像': 'そうぞう · tưởng tượng',
        '可能性': 'かのうせい · khả năng',
        '現場': 'げんば · hiện trường',
        '犯罪': 'はんざい · tội phạm',
        '理解': 'りかい · hiểu',
        '細かい': 'こまかい · tỉ mỉ, nhỏ',
        '詳しい': 'くわしい · chi tiết',
        '深夜': 'しんや · đêm khuya',
        '印象': 'いんしょう · ấn tượng',
      },
    },
    {
      t: 'mcq',
      id: 'b31-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 15 câu (dạng 文脈規定・言い換え類義・用法 của đề N3)',
      items: [
        { q: '{犯人|はんにん}だという（　）がないので、{警察|けいさつ}は{彼|かれ}を{帰|かえ}しました。', options: ['{印象|いんしょう}', '{記憶|きおく}', '{証拠|しょうこ}', '{特徴|とくちょう}'], correct: 2, why: 'Không có BẰNG CHỨNG nên cảnh sát thả về → **{証拠|しょうこ}**. 〔Hannin da to iu shouko ga nai node…〕' },
        { q: 'この{傘|かさ}、{見|み}たことがあるような{気|き}がする。{誰|だれ}のだったかな……。どこかで（　）がある。', options: ['{手|て}がかり', '{見覚|みおぼ}え', '{目印|めじるし}', '{見|み}かけ'], correct: 1, why: 'Trông QUEN, từng thấy → **{見覚|みおぼ}えがある**. 〔Dokoka de mioboe ga aru.〕' },
        { q: '{駅|えき}の{近|ちか}くで、よくあの{猫|ねこ}を（　）。', options: ['{見覚|みおぼ}えます', '{気|き}づきます', '{映|うつ}ります', '{見|み}かけます'], correct: 3, why: 'Thường TÌNH CỜ THẤY → **{見|み}かける** (を). {映|うつ}る không nhận を. 〔Yoku ano neko o mikakemasu.〕' },
        { q: '{防犯|ぼうはん}カメラに、{白|しろ}い{車|くるま}が（　）いました。', options: ['{写|うつ}って', '{映|うつ}って', '{隠|かく}して', '{見|み}かけて'], correct: 1, why: 'Hiện trong CAMERA (hình động) → **{映|うつ}る**. {写|うつ}る dùng cho ảnh chụp. 〔Kamera ni shiroi kuruma ga utsutte imashita.〕' },
        { q: '{電車|でんしゃ}の{棚|たな}にかばんを（　）しまいました。', options: ['{落|お}として', '{置|お}き{忘|わす}れて', '{探|さが}し{回|まわ}って', '{隠|かく}れて'], correct: 1, why: 'ĐẶT lên giá rồi QUÊN → **{置|お}き{忘|わす}れる** (nơi chốn に). 〔Tana ni kaban o okiwasurete shimaimashita.〕' },
        { q: '{落|お}とした{財布|さいふ}の（　）を{教|おし}えてください。{色|いろ}や{形|かたち}など。', options: ['{中身|なかみ}', '{特徴|とくちょう}', '{持|も}ち{主|ぬし}', '{事情|じじょう}'], correct: 1, why: 'Màu, hình dạng = ĐẶC ĐIỂM → **{特徴|とくちょう}**. 〔Saifu no tokuchou o oshiete kudasai.〕' },
        { q: '「{彼|かれ}、{三年|さんねん}もアメリカに{住|す}んでいたんだって。」「（　）{英語|えいご}が{上手|じょうず}なわけだ。」', options: ['{決|けっ}して', '{恐|おそ}らく', '{道理|どうり}で', 'もしかすると'], correct: 2, why: 'Vừa biết lý do → "thảo nào" → **{道理|どうり}で～わけだ**. 〔Douri de eigo ga jouzu na wake da.〕' },
        { q: 'このことは、（　）{誰|だれ}にも{話|はな}さないでください。', options: ['どうやら', '{決|けっ}して', 'つまり', '{恐|おそ}らく'], correct: 1, why: '"Tuyệt đối đừng" → **{決|けっ}して～ない**. 〔Kesshite dare ni mo hanasanaide kudasai.〕' },
        { q: '「{明日|あした}の{会議|かいぎ}は{中止|ちゅうし}だと{勘違|かんちが}いしていた。」と{意味|いみ}が{近|ちか}いのは？', options: ['{会議|かいぎ}が{中止|ちゅうし}だと、{正|ただ}しく{知|し}っていた。', '{会議|かいぎ}が{中止|ちゅうし}だと、{間違|まちが}えて{思|おも}っていた。', '{会議|かいぎ}が{中止|ちゅうし}になることを{心配|しんぱい}していた。', '{会議|かいぎ}を{中止|ちゅうし}にしたかった。'], correct: 1, why: '{勘違|かんちが}い = **nghĩ sai, tưởng nhầm** → {間違|まちが}えて{思|おも}っていた. 〔Machigaete omotte ita.〕' },
        { q: '「どうやら{雨|あめ}がやんだらしい。」と{意味|いみ}が{近|ちか}いのは？', options: ['{絶対|ぜったい}に{雨|あめ}がやんだ。', '{雨|あめ}はやまないだろう。', 'どうも{雨|あめ}がやんだようだ。', '{雨|あめ}がやんだら{出|で}かけよう。'], correct: 2, why: 'どうやら～らしい = **có vẻ như** → どうも～ようだ. 〔Doumo ame ga yanda you da.〕' },
        { q: '「{要|よう}するに、{君|きみ}は{反対|はんたい}なんだね。」の「{要|よう}するに」と{意味|いみ}が{近|ちか}いのは？', options: ['{道理|どうり}で', 'つまり', 'もしかすると', '{決|けっ}して'], correct: 1, why: '{要|よう}するに ≈ **つまり** (tóm lại, tức là). 〔Tsumari, kimi wa hantai na n da ne.〕' },
        { q: '「{細|こま}かい」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['この{道|みち}は{細|こま}かいので、{車|くるま}は{通|とお}れません。', '{細|こま}かいお{金|かね}がないので、{一万円札|いちまんえんさつ}で{払|はら}います。', '{彼女|かのじょ}は{指|ゆび}が{細|こま}かくてきれいです。', 'この{部屋|へや}は{細|こま}かくて{明|あか}るいです。'], correct: 1, why: '**{細|こま}かいお{金|かね}** = tiền lẻ. Đường hẹp, ngón tay mảnh → **{細|ほそ}い**. 〔Komakai okane ga nai node…〕' },
        { q: '「{詳|くわ}しい」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['この{紙|かみ}は{詳|くわ}しいので、すぐ{破|やぶ}れます。', '{父|ちち}は{古|ふる}い{車|くるま}にとても{詳|くわ}しいです。', '{詳|くわ}しい{雨|あめ}が{降|ふ}っています。', '{彼|かれ}は{背|せ}が{詳|くわ}しいです。'], correct: 1, why: '**N に{詳|くわ}しい** = thông thạo N. Các câu khác dùng sai từ. 〔Chichi wa furui kuruma ni totemo kuwashii desu.〕' },
        { q: '「{引|ひ}き{受|う}ける」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{駅|えき}で{友達|ともだち}を{引|ひ}き{受|う}けました。', '{先輩|せんぱい}に{頼|たの}まれて、{通訳|つうやく}の{仕事|しごと}を{引|ひ}き{受|う}けました。', '{窓|まど}を{引|ひ}き{受|う}けて、{部屋|へや}に{風|かぜ}を{入|い}れました。', '{雨|あめ}を{引|ひ}き{受|う}けて、{服|ふく}が{濡|ぬ}れました。'], correct: 1, why: '**{仕事|しごと}を{引|ひ}き{受|う}ける** = nhận làm việc. Đón bạn → {迎|むか}える; mở cửa → {開|あ}ける. 〔Tsuuyaku no shigoto o hikiukemashita.〕' },
        { q: '「{気|き}づく」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{明日|あした}は{試験|しけん}に{気|き}づいてください。', 'バスを{降|お}りてから、{傘|かさ}がないことに{気|き}づきました。', '{毎朝|まいあさ}6{時|じ}に{気|き}づきます。', '{先生|せんせい}に{質問|しつもん}を{気|き}づきました。'], correct: 1, why: '**～ことに{気|き}づく** = nhận ra. "Chú ý thi" → {気|き}をつける; "thức dậy" → {起|お}きる. 〔Kasa ga nai koto ni kizukimashita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b31-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N3 — ～に違いない, ～はずがない, ～わけがない, ～っぽい, ～わけだ, ～わけではない・わけでもない, ～わけにはいかない + bảng phân biệt (thang chắc chắn, はずがない ↔ わけがない, わけだ ↔ はずだ, わけではない ↔ ないわけではない, わけにはいかない ↔ ざるを得ない)',
  goal: 'Nối đúng mọi loại từ vào bảy mẫu (chú ý: に違いない nhận ナA語幹 và N TRẦN — không な, không の; はず・わけ nhận ナAな・Nの; わけにはいかない chỉ nhận động từ; っぽい nhận N, イA bỏ い, Vます); dùng ～に違いない khi TIN CHẮC theo cảm giác, ～はずがない khi BÁC BỎ có căn cứ, ～わけがない khi PHỦ NHẬN mạnh và chủ quan; tả "trông giống / ngả màu / hay…" bằng ～っぽい và phân biệt với ～らしい・～みたい; nói "thảo nào / tức là" bằng ～わけだ và biết khi nào thay được bằng ～はずだ; phủ định một phần bằng ～わけではない／～わけでもない và hiểu đúng phủ định kép ～ないわけではない; nói "không thể (vì lẽ phải)" bằng ～わけにはいかない, "buộc phải" bằng ～ないわけにはいかない, phân biệt với Vられない (không có khả năng) và nhận ra ～ざるを得ない (N2); xếp đúng các mẫu trên thang chắc chắn に違いない ≈ はずだ > だろう > かもしれない > はずがない／わけがない trong câu đề N3.',
  minutes: 150,
  blocks: [
    {
      t: 'p',
      text: 'Bài 31 xoay quanh **một câu hỏi: người nói ĐÃ SUY RA điều gì, và CHẮC đến mức nào?** — **(1)** Tin chắc điều đó **đúng** → **～に{違|ちが}いない** ①. **(2)** Tin chắc điều đó **sai** — **có căn cứ** → **～はずがない** ②; theo **lẽ thường, cảm xúc** → **～わけがない** ③. **(3)** Thấy một thứ **giống** cái gì đó, **ngả** về màu gì, người nào **hay** làm gì → **～っぽい** ④. Rồi đến họ **わけ** (= lý do, lẽ): **(4)** Vừa **hiểu ra lý do** → "thảo nào" **～わけだ** ⑤. **(5)** Gạt đi một **kết luận** người nghe có thể nghĩ → "không hẳn là" **～わけではない** ⑥. **(6)** Có thể làm nhưng **lẽ phải không cho** → **～わけにはいかない** ⑦. Cuối bài là **bảng phân biệt** ⑧ — đề N3 phần 文法 năm nào cũng có ít nhất một câu わけ.',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 31',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', 'V{普通形|ふつうけい}・イA・ナA（ø）・N（ø）＋ に{違|ちが}いない', 'chắc chắn là (tin chắc — chủ quan)', '{犯人|はんにん}はあの{男|おとこ}に{違|ちが}いない。', 'N3'],
        ['②', 'V{普通形|ふつうけい}・イA・ナAな・Nの ＋ はずがない', 'không lẽ nào (bác bỏ có căn cứ)', '{彼|かれ}が{知|し}らないはずがない。', 'N3 (ôn はず Bài 20)'],
        ['③', 'V{普通形|ふつうけい}・イA・ナAな・Nの ＋ わけがない', 'làm gì có chuyện (phủ nhận mạnh)', 'こんな{問題|もんだい}、{解|と}けるわけがない。', 'N3'],
        ['④', 'N・イA（～い）・Vます ＋ っぽい', 'trông giống / ngả / hay…', '{子|こ}どもっぽい · {白|しろ}っぽい · {忘|わす}れっぽい', 'N3'],
        ['⑤', 'V{普通形|ふつうけい}・イA・ナAな・Nの（である）＋ わけだ', 'thảo nào… / tức là…', 'だから{寒|さむ}いわけだ。', 'N3'],
        ['⑥', 'V{普通形|ふつうけい}・イA・ナAな・Nの（である）＋ わけではない／わけでもない', 'không hẳn là… / cũng không phải là…', '{嫌|きら}いなわけではない。', 'N3'],
        ['⑦', 'Vる・Vない ＋ わけにはいかない', 'không thể (vì lẽ phải) / không thể không', '{休|やす}むわけにはいかない。', 'N3'],
        ['⑧', 'Bảng phân biệt + nhận ra ～ざるを{得|え}ない・～に{相違|そうい}ない・～っこない', 'thang chắc chắn · はずがない ↔ わけがない · わけだ ↔ はずだ…', '—', 'N3 (N2/N1: nhận ra)'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG NỐI TỪ TRỌN BÀI — loại từ nào đứng trước mẫu nào (○ dùng được · ✗ không dùng)',
      head: ['Đứng trước', 'に違いない', 'はずがない・わけ～ (②③⑤⑥)', 'わけにはいかない', 'っぽい'],
      rows: [
        ['V{普通形|ふつうけい} ({来|く}る・{来|き}た・{来|こ}ない・{来|き}ている)', '○ {来|く}るに{違|ちが}いない', '○ {来|く}るはずがない · {来|く}るわけだ', '○ CHỈ Vる／Vない／Vている: {来|こ}ないわけにはいかない', '✗ (→ Vます ＋ っぽい: {忘|わす}れっぽい)'],
        ['イA ({高|たか}い・{高|たか}かった)', '○ {高|たか}いに{違|ちが}いない', '○ {高|たか}いはずがない · {高|たか}いわけだ', '✗', '○ bỏ い: {安|やす}っぽい'],
        ['ナA ({静|しず}か・{静|しず}かだった)', '○ **{静|しず}か**に{違|ちが}いない (KHÔNG な)', '○ {静|しず}か**な**はずがない · {静|しず}か**な**わけだ', '✗', '△ ít dùng'],
        ['N ({犯人|はんにん}・{犯人|はんにん}だった)', '○ **{犯人|はんにん}**に{違|ちが}いない (KHÔNG の)', '○ {犯人|はんにん}**の**はずがない · {犯人|はんにん}**の／である**わけがない', '✗', '○ {子|こ}どもっぽい · うそっぽい'],
        ['Nghĩa / độ chắc', '~90% ĐÚNG (tin chắc)', 'はずがない・わけがない ≈ 0% · わけだ = kết luận · わけではない = phủ định một phần', 'không thể / buộc phải', 'giống, ngả, hay'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bảng nối — ba câu thần chú',
      items: [
        '**"に違いない ăn TRẦN"** — ナA và N đứng thẳng trước に, không な, không の, không だ: **{静|しず}かに{違|ちが}いない**, **{犯人|はんにん}に{違|ちが}いない**. Lý do: に{違|ちが}いない vốn là "**không có sai** (違い＋ない) **ở chỗ** (に)…", không phải danh từ nên không cần の／な.',
        '**"はず và わけ là DANH TỪ"** — nối như danh từ trong câu bổ nghĩa (ポイント 109): **Nの**, **ナAな**, **イA**, **V thể thường**. ~~{犯人|はんにん}だはずがない~~, ~~{静|しず}かわけだ~~ đều sai. Riêng わけ nhận cả **Nである** (văn viết): {学生|がくせい}であるわけがない.',
        '**"わけにはいかない chỉ ăn ĐỘNG TỪ"** — vì nó nói về **hành động** mình không thể làm / buộc phải làm: {行|い}く／{行|い}かないわけにはいかない. Muốn nói với danh từ thì thêm động từ: ~~{休|やす}みわけにはいかない~~ → **{休|やす}みにするわけにはいかない**.',
        '**"っぽい chia như TÍNH TỪ い"** — {子|こ}どもっぽ**くない**, {白|しろ}っぽ**かった**, {安|やす}っぽ**く**{見|み}える, {忘|わす}れっぽ**くて**. Romaji luôn có **pp**: kodomo**pp**oi.',
      ],
    },

    /* ══════ ① に違いない ══════ */
    { t: 'h', text: '① ～に違いない／～に違いありません — "chắc chắn là…, nhất định là… (người nói TIN CHẮC)"' },
    {
      t: 'p',
      text: 'Người nói **tin chắc** (khoảng 90%) điều mình **suy ra** — từ một dấu hiệu, một ấn tượng, trí nhớ, trực giác — tuy **chưa kiểm chứng**. Nghĩa đen: **{違|ちが}い** (sự sai) **＋ ない** (không có) = "**không thể sai được**". Sắc thái: **chủ quan**, giọng **văn viết** (tiểu thuyết, nhật ký, bài luận, độc thoại trong đầu). Trong hội thoại hằng ngày người Nhật hay nói mềm hơn: **きっと～と{思|おも}う**, **～はずだ** (Bài 20), **絶対～だよ**. Rất hay đi cùng **きっと**: **きっと～に{違|ちが}いない**. Lịch sự: **～に{違|ちが}いありません**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～に違いない — ナA và N đứng TRẦN',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ (thể thường)', 'V{辞書形|じしょけい}・Vた・Vない・Vている ＋ に{違|ちが}いない', '{来|く}る**に{違|ちが}いない** · {落|お}とした**に{違|ちが}いない** · {知|し}らない**に{違|ちが}いない** · {寝|ね}ている**に{違|ちが}いない**', 'kuru ni chigainai · otoshita ni chigainai · shiranai ni chigainai · nete iru ni chigainai'],
        ['Tính từ い', 'イA（～い／～かった）＋ に{違|ちが}いない', '{高|たか}い**に{違|ちが}いない** · {痛|いた}かった**に{違|ちが}いない**', 'takai ni chigainai · itakatta ni chigainai'],
        ['Tính từ な', 'ナA（語幹）／ナAだった ＋ に{違|ちが}いない', '{静|しず}か**に{違|ちが}いない** · {大変|たいへん}だった**に{違|ちが}いない**', 'shizuka ni chigainai · taihen datta ni chigainai'],
        ['Danh từ', 'N／Nだった ＋ に{違|ちが}いない', '{犯人|はんにん}**に{違|ちが}いない** · {学生|がくせい}だった**に{違|ちが}いない**', 'hannin ni chigainai · gakusei datta ni chigainai'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［dấu hiệu / căn cứ］から（ので）、［suy luận］に違いない',
          vi: '"**Chắc chắn là** …". Thường nêu **dấu hiệu** trước rồi mới kết luận. Vế kết luận là điều **chưa thấy tận mắt**.',
          examples: [
            E('{部屋|へや}の{電気|でんき}が{消|き}えているから、マリヤムさんはもう{寝|ね}ているに{違|ちが}いない。', 'Heya no denki ga kiete iru kara, Mariyamu-san wa mou nete iru ni chigainai.', 'Đèn phòng đã tắt nên chắc chắn chị Mariam ngủ rồi.'),
            E('あの{店|みせ}はいつも{行列|ぎょうれつ}ができているから、おいしいに{違|ちが}いない。', 'Ano mise wa itsumo gyouretsu ga dekite iru kara, oishii ni chigainai.', 'Quán đó lúc nào cũng có hàng người xếp nên chắc chắn là ngon.'),
            E('{顔|かお}が{真|ま}っ{赤|か}だ。{熱|ねつ}があるに{違|ちが}いない。', 'Kao ga makka da. Netsu ga aru ni chigainai.', 'Mặt đỏ bừng. Chắc chắn là bị sốt.'),
            E('この{字|じ}は{西川|にしかわ}さんの{字|じ}に{違|ちが}いありません。', 'Kono ji wa Nishikawa-san no ji ni chigai arimasen.', 'Nét chữ này chắc chắn là chữ của anh Nishikawa. (N trần ＋ に違いない)'),
            E('{夜中|よなか}の{図書館|としょかん}は{静|しず}かに{違|ちが}いない。', 'Yonaka no toshokan wa shizuka ni chigainai.', 'Thư viện lúc nửa đêm chắc chắn yên tĩnh. (ナA trần ＋ に違いない)'),
            E('{窓|まど}が{割|わ}れている。{誰|だれ}かが{入|はい}ったに{違|ちが}いない。', 'Mado ga warete iru. Dare ka ga haitta ni chigainai.', 'Cửa sổ bị vỡ. Chắc chắn đã có ai đó đột nhập.'),
            E('{一人|ひとり}で{国|くに}を{出|で}たとき、{彼女|かのじょ}は{不安|ふあん}だったに{違|ちが}いない。', 'Hitori de kuni o deta toki, kanojo wa fuan datta ni chigainai.', 'Lúc một mình rời quê hương, chắc hẳn cô ấy đã rất bất an. (quá khứ: ナAだった)'),
          ],
        },
        {
          formula: 'きっと ～に違いない · ～に違いないと思う · ～に違いありません',
          vi: '**きっと** làm câu chắc hơn; **～に{違|ちが}いないと{思|おも}う** mềm hơn một chút (dùng được trong hội thoại); **～に{違|ちが}いありません** là dạng lịch sự (bài phát biểu, thư).',
          examples: [
            E('リンさんはあんなに{勉強|べんきょう}しているから、きっと{合格|ごうかく}するに{違|ちが}いない。', 'Rin-san wa anna ni benkyou shite iru kara, kitto goukaku suru ni chigainai.', 'Linh học chăm như thế nên nhất định sẽ đỗ.'),
            E('この{雲|くも}を{見|み}ると、{午後|ごご}は{雨|あめ}になるに{違|ちが}いないと{思|おも}います。', 'Kono kumo o miru to, gogo wa ame ni naru ni chigainai to omoimasu.', 'Nhìn đám mây này, tôi nghĩ chắc chắn chiều nay trời sẽ mưa.'),
            E('{皆|みな}さんの{応援|おうえん}が、{選手|せんしゅ}たちの{力|ちから}になったに{違|ちが}いありません。', 'Minasan no ouen ga, senshutachi no chikara ni natta ni chigai arimasen.', 'Sự cổ vũ của mọi người chắc chắn đã tiếp thêm sức mạnh cho các tuyển thủ. (phát biểu)'),
            E('あの{二人|ふたり}は、きっと{何|なに}か{秘密|ひみつ}を{隠|かく}しているに{違|ちが}いない。', 'Ano futari wa, kitto nani ka himitsu o kakushite iru ni chigainai.', 'Hai người đó chắc chắn đang giấu bí mật gì đó.'),
            E('{犯人|はんにん}は、{現場|げんば}をよく{知|し}っている{人|ひと}に{違|ちが}いない。', 'Hannin wa, genba o yoku shitte iru hito ni chigainai.', 'Thủ phạm chắc chắn là người biết rõ hiện trường. (giọng thám tử)'),
          ],
        },
      ],
    },
    DL('Hỏi – đáp với ～に違いない', [
      ['リン', 'c', 'マリヤムさん、ドアの{前|まえ}にきれいな{箱|はこ}が{置|お}いてありますよ。', 'Mariyamu-san, doa no mae ni kirei na hako ga oite arimasu yo.', 'Chị Mariam ơi, trước cửa có đặt một cái hộp đẹp lắm.'],
      ['マリヤム', 'a', '{本当|ほんとう}だ。{今日|きょう}は{私|わたし}の{誕生日|たんじょうび}だから、きっとパクさんからに{違|ちが}いないわ。', 'Hontou da. Kyou wa watashi no tanjoubi da kara, kitto Paku-san kara ni chigainai wa.', 'Thật này. Hôm nay là sinh nhật chị nên chắc chắn là của Park gửi rồi.'],
      ['リン', 'c', 'どうしてパクさんだと{分|わ}かるんですか。', 'Doushite Paku-san da to wakaru n desu ka.', 'Sao chị biết là chị Park ạ?'],
      ['マリヤム', 'a', 'この{包|つつ}み{紙|がみ}、パクさんがいつも{行|い}くお{店|みせ}のものなの。それに、カードの{字|じ}もパクさんの{字|じ}に{違|ちが}いないわ。', 'Kono tsutsumigami, Paku-san ga itsumo iku omise no mono na no. Sore ni, kaado no ji mo Paku-san no ji ni chigainai wa.', 'Giấy gói này là của cửa hàng Park hay đến. Hơn nữa, chữ trên tấm thiệp chắc chắn cũng là chữ của Park.'],
      ['リン', 'c', 'さすが{名探偵|めいたんてい}ですね。', 'Sasuga meitantei desu ne.', 'Đúng là thám tử lừng danh.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — ［dấu hiệu］、［suy luận］に違いない',
      head: ['Dấu hiệu thấy được', 'Suy luận', 'Câu', 'Romaji'],
      rows: [
        ['{電気|でんき}が{消|き}えている', 'もう{寝|ね}ている', '{電気|でんき}が{消|き}えているから、もう{寝|ね}ているに{違|ちが}いない。', 'Denki ga kiete iru kara, mou nete iru ni chigainai.'],
        ['{毎日|まいにち}ピアノを{練習|れんしゅう}している', '{上手|じょうず} (ナA)', '{毎日|まいにち}{練習|れんしゅう}しているから、{上手|じょうず}に{違|ちが}いない。', 'Mainichi renshuu shite iru kara, jouzu ni chigainai.'],
        ['いつも{行列|ぎょうれつ}だ', 'おいしい (イA)', 'いつも{行列|ぎょうれつ}だから、おいしいに{違|ちが}いない。', 'Itsumo gyouretsu da kara, oishii ni chigainai.'],
        ['{現場|げんば}に{大|おお}きな{足跡|あしあと}がある', '{犯人|はんにん}は{男|おとこ}だ (N)', '{大|おお}きな{足跡|あしあと}があるから、{犯人|はんにん}は{男|おとこ}に{違|ちが}いない。', 'Ookina ashiato ga aru kara, hannin wa otoko ni chigainai.'],
        ['{机|つくえ}の{上|うえ}にお{弁当|べんとう}がある', '{忘|わす}れて{行|い}った', 'お{弁当|べんとう}があるから、{忘|わす}れて{行|い}ったに{違|ちが}いない。', 'Obentou ga aru kara, wasurete itta ni chigainai.'],
        ['{顔色|かおいろ}が{悪|わる}い', '{昨日|きのう}、{寝|ね}ていない', '{顔色|かおいろ}が{悪|わる}いから、{昨日|きのう}{寝|ね}ていないに{違|ちが}いない。', 'Kaoiro ga warui kara, kinou nete inai ni chigainai.'],
        ['{一人|ひとり}で{三年|さんねん}{留学|りゅうがく}した', '{大変|たいへん}だった (ナA quá khứ)', '{一人|ひとり}で{留学|りゅうがく}して、{大変|たいへん}だったに{違|ちが}いない。', 'Hitori de ryuugaku shite, taihen datta ni chigainai.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～に違いない (sai → đúng)',
      items: [
        '~~{静|しず}かなに{違|ちが}いない~~ / ~~{犯人|はんにん}のに{違|ちが}いない~~ / ~~{犯人|はんにん}だに{違|ちが}いない~~ → **{静|しず}かに{違|ちが}いない** / **{犯人|はんにん}に{違|ちが}いない** — ナA và N đứng TRẦN. (Riêng **{人|ひと}のに{違|ちが}いない** = "chắc chắn là CỦA người đó" — の ở đây là "cái của", như hội thoại ③.)',
        '~~(đang nhìn mưa rơi) {雨|あめ}が{降|ふ}っているに{違|ちが}いない~~ → **{雨|あめ}が{降|ふ}っている** — điều **tận mắt thấy** là sự thật, không cần suy luận. に違いない chỉ dùng cho điều **suy ra**.',
        '~~{明日|あした}、{私|わたし}は{図書館|としょかん}に{行|い}くに{違|ちが}いない~~ → **{行|い}くつもりです** — hành động **có ý chí** của chính mình không phải là suy luận. (Nhưng {私|わたし}は{疲|つか}れているに{違|ちが}いない — trạng thái của mình, đọc như nhật ký — thì được.)',
        '**{違|ちが}いない ≠ {違|ちが}わない**: {違|ちが}わない = "không khác" (động từ {違|ちが}う phủ định); **に{違|ちが}いない** = "chắc chắn là" — một cụm cố định. Đề N3 hay bẫy bằng lựa chọn ~~に{違|ちが}わない~~.',
        'Nói chuyện với **người trên** bằng に違いない nghe hơi **cứng, như phán xét**. Với thầy cô / sếp, mềm hơn: **きっと～と{思|おも}います**, **～のではないでしょうか**.',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナA(ø)・N(ø) ＋ に違いない（に違いありません）', vi: '"Chắc chắn là…" — người nói tin chắc theo dấu hiệu / cảm giác, chưa kiểm chứng. ナA, N không có な／の／だ. Văn viết; hội thoại mềm hơn: きっと～と思う. Nhận ra: ～に相違ない (N1, rất trang trọng) = に違いない.' },

    /* ══════ ② はずがない ══════ */
    { t: 'h', text: '② ～はずがない／～はずはない — "không lẽ nào…, không thể nào… (bác bỏ CÓ CĂN CỨ)"' },
    {
      t: 'p',
      text: 'Ở Bài 20 ⑤ ta học **～はずだ** = "theo căn cứ thì chắc chắn là…". Phủ định mạnh của nó là **～はずがない** = "theo căn cứ thì **không lẽ nào**…, **không thể có chuyện**…". Người nói dựa vào **sự thật, lịch trình, quy luật, tính chất đã biết** để **gạt bỏ hoàn toàn** một khả năng — thường là để **phản bác** điều người khác vừa nói. **～はずはない** (dùng は) nhấn mạnh hơn một chút. Lịch sự: **～はずがありません**. Câu cố định **そんなはずはない！** = "Không thể nào!" — khi thực tế **trái ngược** với điều mình tin chắc (ngạc nhiên, không tin nổi).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～はずがない — như はずだ ở Bài 20',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ (thể thường)', 'V{辞書形|じしょけい}・Vた・Vない・Vている ＋ はずがない', '{来|く}る**はずがない** · {忘|わす}れた**はずがない** · {知|し}らない**はずがない**', 'kuru hazu ga nai · wasureta hazu ga nai · shiranai hazu ga nai'],
        ['Tính từ い', 'イA ＋ はずがない', '{安|やす}い**はずがない** · {難|むずか}しかった**はずがない**', 'yasui hazu ga nai · muzukashikatta hazu ga nai'],
        ['Tính từ な', 'ナA な ＋ はずがない', '{暇|ひま}**な**はずがない · {簡単|かんたん}**な**はずがない', 'hima na hazu ga nai · kantan na hazu ga nai'],
        ['Danh từ', 'N の ＋ はずがない', '{休|やす}み**の**はずがない · {犯人|はんにん}**の**はずがない', 'yasumi no hazu ga nai · hannin no hazu ga nai'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ Ba câu dễ nhầm — ～ないはずだ ↔ ～はずがない ↔ ～ないはずがない',
      head: ['Câu', 'Nghĩa', 'Độ chắc', 'Khi nào dùng'],
      rows: [
        ['{彼|かれ}は{来|こ}ない**はずだ**。(Bài 20)', 'Chắc là anh ấy KHÔNG đến.', '~90% không đến', 'dự đoán bình thường, có căn cứ (lịch: hôm nay anh ấy đi công tác)'],
        ['{彼|かれ}が{来|く}る**はずがない**。', 'KHÔNG LẼ NÀO anh ấy lại đến.', '~100% không đến', 'BÁC BỎ mạnh một khả năng ai đó vừa nêu ("anh ấy đến à?" — "không thể nào")'],
        ['{彼|かれ}が{来|こ}ない**はずがない**。', 'Không lẽ nào anh ấy lại KHÔNG đến (= chắc chắn đến).', '~100% có đến', 'phủ định kép — nhấn mạnh khả năng CÓ (anh ấy là người tổ chức!)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［căn cứ］から／のに、～はずがない（はずはない）',
          vi: '"**Không lẽ nào** …". Căn cứ thường nêu ở vế trước. Hay xuất hiện khi **đáp lại** một câu hỏi / một nghi ngờ.',
          examples: [
            E('{鍵|かぎ}はちゃんとかけたから、{泥棒|どろぼう}が{入|はい}るはずがありません。', 'Kagi wa chanto kaketa kara, dorobou ga hairu hazu ga arimasen.', 'Tôi đã khoá cửa đàng hoàng rồi nên không lẽ nào trộm vào được.'),
            E('{彼|かれ}は{日本|にほん}に{十年|じゅうねん}も{住|す}んでいるんだから、この{言葉|ことば}を{知|し}らないはずがない。', 'Kare wa Nihon ni juunen mo sunde iru n da kara, kono kotoba o shiranai hazu ga nai.', 'Anh ấy sống ở Nhật những mười năm, không lẽ nào lại không biết từ này. (phủ định kép = chắc chắn biết)'),
            E('{今日|きょう}は{日曜日|にちようび}だから、{銀行|ぎんこう}が{開|あ}いているはずがない。', 'Kyou wa nichiyoubi da kara, ginkou ga aite iru hazu ga nai.', 'Hôm nay Chủ nhật nên không lẽ nào ngân hàng mở cửa.'),
            E('あんなに{練習|れんしゅう}したんだから、{簡単|かんたん}な{曲|きょく}を{間違|まちが}えるはずがない。', 'Anna ni renshuu shita n da kara, kantan na kyoku o machigaeru hazu ga nai.', 'Đã luyện nhiều như thế thì không lẽ nào lại đàn sai một bản nhạc dễ.'),
            E('{三月|さんがつ}の{北海道|ほっかいどう}が{暖|あたた}かいはずがないよ。コートを{持|も}って{行|い}きなさい。', 'Sangatsu no Hokkaidou ga atatakai hazu ga nai yo. Kooto o motte ikinasai.', 'Hokkaido tháng Ba thì làm sao mà ấm được. Mang áo khoác theo đi.'),
            E('{記録|きろく}が{残|のこ}っているので、その{日|ひ}、{彼|かれ}が{休|やす}みのはずはありません。', 'Kiroku ga nokotte iru node, sono hi, kare ga yasumi no hazu wa arimasen.', 'Vì ghi chép vẫn còn, không thể nào hôm đó anh ấy nghỉ. (N の ＋ はずはない)'),
          ],
        },
        {
          formula: 'そんなはずはない（ありません）！ · ～はずがないじゃないか',
          vi: '**そんなはずはない** — câu cảm thán khi **thực tế trái với căn cứ** ("Không thể nào!"). **～はずがないじゃない（か）** = "làm sao mà… được chứ!" (phản bác, văn nói).',
          examples: [
            E('「{会議室|かいぎしつ}に{誰|だれ}もいないよ。」「そんなはずはない。{三時|さんじ}から{会議|かいぎ}のはずだよ。」', '"Kaigishitsu ni dare mo inai yo." "Sonna hazu wa nai. Sanji kara kaigi no hazu da yo."', '"Phòng họp chẳng có ai cả." — "Không thể nào. Theo lịch thì 3 giờ có họp mà."'),
            E('「レジのお{金|かね}が{千円|せんえん}{足|た}りません。」「そんなはずはないよ。さっき{二回|にかい}{数|かぞ}えたんだから。」', '"Reji no okane ga sen\'en tarimasen." "Sonna hazu wa nai yo. Sakki nikai kazoeta n da kara."', '"Tiền trong quầy thiếu một nghìn yên ạ." — "Không thể nào. Lúc nãy anh đếm hai lần rồi mà."'),
            E('{初|はじ}めて{作|つく}った{料理|りょうり}が、そんなにおいしいはずがないじゃない。', 'Hajimete tsukutta ryouri ga, sonna ni oishii hazu ga nai ja nai.', 'Món nấu lần đầu thì làm sao mà ngon đến thế được chứ.'),
            E('{真面目|まじめ}な{木村|きむら}さんが、うそをつくはずがありません。', 'Majime na Kimura-san ga, uso o tsuku hazu ga arimasen.', 'Chị Kimura nghiêm túc như thế không lẽ nào lại nói dối.'),
          ],
        },
      ],
    },
    DL('Hỏi – đáp với ～はずがない (ở ひまわり食堂)', [
      ['ナタポン', 'b', '{店長|てんちょう}、レジのお{金|かね}が{千円|せんえん}{足|た}りないんですが……。', 'Tenchou, reji no okane ga sen\'en tarinai n desu ga…….', 'Anh ơi, tiền trong quầy thiếu một nghìn yên ạ…'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'そんなはずはないよ。{閉店|へいてん}の{前|まえ}に{二回|にかい}も{数|かぞ}えたんだから。', 'Sonna hazu wa nai yo. Heiten no mae ni nikai mo kazoeta n da kara.', 'Không thể nào. Trước khi đóng cửa anh đã đếm những hai lần mà.'],
      ['ナタポン', 'b', 'じゃ、{誰|だれ}かがお{釣|つ}りを{多|おお}く{渡|わた}したんでしょうか。', 'Ja, dare ka ga otsuri o ooku watashita n deshou ka.', 'Vậy có phải ai đó đã trả tiền thừa cho khách nhiều quá không ạ?'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{今日|きょう}レジに{立|た}ったのは{僕|ぼく}だけだし、{僕|ぼく}が{間違|まちが}えるはずがない……。あっ、ちょっと{待|ま}って。レジの{下|した}に{千円札|せんえんさつ}が{落|お}ちてる！', 'Kyou reji ni tatta no wa boku dake da shi, boku ga machigaeru hazu ga nai……. A, chotto matte. Reji no shita ni sen\'ensatsu ga ochiteru!', 'Hôm nay chỉ có anh đứng quầy, mà anh thì không thể nào nhầm được… À, khoan đã. Dưới quầy có tờ một nghìn yên rơi kìa!'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — ［căn cứ］から、～はずがない',
      head: ['Căn cứ', 'Khả năng bị bác bỏ', 'Câu', 'Romaji'],
      rows: [
        ['{鍵|かぎ}をかけた', '{泥棒|どろぼう}が{入|はい}る', '{鍵|かぎ}をかけたから、{泥棒|どろぼう}が{入|はい}るはずがない。', 'Kagi o kaketa kara, dorobou ga hairu hazu ga nai.'],
        ['{彼女|かのじょ}は{甘|あま}い{物|もの}が{嫌|きら}いだ', 'ケーキを{買|か}う', '{甘|あま}い{物|もの}が{嫌|きら}いだから、ケーキを{買|か}うはずがない。', 'Amai mono ga kirai da kara, keeki o kau hazu ga nai.'],
        ['{今|いま}は{試験|しけん}の{前|まえ}だ', '{学生|がくせい}が{暇|ひま}な (ナA)', '{試験|しけん}の{前|まえ}だから、{学生|がくせい}が{暇|ひま}なはずがない。', 'Shiken no mae da kara, gakusei ga hima na hazu ga nai.'],
        ['{記録|きろく}が{残|のこ}っている', '{西川|にしかわ}さんが{犯人|はんにん}だ (N)', '{記録|きろく}が{残|のこ}っているから、{西川|にしかわ}さんが{犯人|はんにん}のはずがない。', 'Kiroku ga nokotte iru kara, Nishikawa-san ga hannin no hazu ga nai.'],
        ['カメラに{映|うつ}っていない', 'ここを{通|とお}った', 'カメラに{映|うつ}っていないから、ここを{通|とお}ったはずがない。', 'Kamera ni utsutte inai kara, koko o tootta hazu ga nai.'],
        ['{高級|こうきゅう}ホテルだ', '{一泊|いっぱく}{三千円|さんぜんえん}で{安|やす}い (イA)', '{高級|こうきゅう}ホテルだから、そんなに{安|やす}いはずがない。', 'Koukyuu hoteru da kara, sonna ni yasui hazu ga nai.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～はずがない',
      items: [
        '~~{休|やす}みはずがない~~ / ~~{暇|ひま}はずがない~~ → **{休|やす}みのはずがない** / **{暇|ひま}なはずがない** — はず là danh từ: N **の**, ナA **な** (khác hẳn に違いない!).',
        'Nhầm **mức độ**: ~~(chỉ hơi nghi) たぶん{来|く}るはずがない~~ → **たぶん{来|こ}ないだろう** — はずがない là phủ nhận **gần 100%**, không đi với たぶん／もしかすると.',
        '~~{私|わたし}は{明日|あした}のパーティーに{行|い}くはずがない~~ (ý định của mình) → **{行|い}くつもりはない／{行|い}きません** — はずがない là **suy luận**, không phải **quyết định** của mình.',
        '**Không có căn cứ** thì はずがない nghe vô lý: ~~(không biết gì về anh ta) {彼|かれ}が{犯人|はんにん}のはずがない~~ → chỉ nói được **～と{思|おも}う** hoặc **～わけがない** (cảm tính — mẫu ③).',
        '~~{知|し}らないはずがない~~ hiểu thành "chắc là không biết" — SAI. **Vない＋はずがない** = "**không lẽ nào lại không**" = chắc chắn **CÓ** biết. Đọc phủ định kép thật chậm.',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナAな・Nの ＋ はずがない（はずはない／はずがありません） · そんなはずはない', vi: '"Không lẽ nào…" — bác bỏ gần 100% một khả năng, dựa trên căn cứ (sự thật, lịch, quy luật). ↔ ～ないはずだ (Bài 20, chỉ "chắc là không", mềm hơn). Vないはずがない = chắc chắn có.' },

    /* ══════ ③ わけがない ══════ */
    { t: 'h', text: '③ ～わけがない／～わけはない — "làm gì có chuyện…, đời nào… (phủ nhận MẠNH, chủ quan)"' },
    {
      t: 'p',
      text: '**わけ** = lý do, lẽ (từ mới nhóm D). **～わけがない** = "**không có lẽ nào / lý do nào** để…" → "**làm gì có chuyện**…", "**đời nào**…", "**sao mà…được**". Giống ② ở chỗ phủ nhận **gần 100%**, nhưng **chủ quan, cảm xúc hơn**: người nói dựa vào **lẽ thường, tính cách, cảm giác** của mình, giọng thường **ngạc nhiên, bực bội, khẳng định chắc nịch**. Dùng rất nhiều trong **văn nói** — thân mật còn rút gọn **～わけない（じゃん）**. Rất hay đi với **まさか** (làm gì có — Bài 20), **こんな／そんな／あんな**, **～なんか** (cái thứ như…). **～わけはない** (dùng は) nhấn mạnh hơn; lịch sự: **～わけがありません**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～わけがない — như はず (danh từ わけ)',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ (thể thường)', 'V{辞書形|じしょけい}・Vた・Vない・Vている ＋ わけがない', 'できる**わけがない** · {勝|か}った**わけがない** · {来|こ}ない**わけがない**', 'dekiru wake ga nai · katta wake ga nai · konai wake ga nai'],
        ['Tính từ い', 'イA ＋ わけがない', 'おいしい**わけがない** · {楽|たの}しかった**わけがない**', 'oishii wake ga nai · tanoshikatta wake ga nai'],
        ['Tính từ な', 'ナA な ＋ わけがない', '{好|す}き**な**わけがない · {暇|ひま}**な**わけがない', 'suki na wake ga nai · hima na wake ga nai'],
        ['Danh từ', 'N の／N である ＋ わけがない', '{子|こ}ども**の**わけがない · {本物|ほんもの}**である**わけがない (văn viết)', 'kodomo no wake ga nai · honmono de aru wake ga nai'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（まさか）こんな／そんな ～が ～わけがない',
          vi: '"**Làm gì có chuyện** …". Người nói gạt phắt một ý **vô lý theo lẽ thường**. Vế trước thường có **なんか／なんて** (xem nhẹ), **まさか**.',
          examples: [
            E('こんな{難|むずか}しい{問題|もんだい}、{一日|いちにち}で{解|と}けるわけがないよ。', 'Konna muzukashii mondai, ichinichi de tokeru wake ga nai yo.', 'Bài khó thế này thì làm gì có chuyện giải được trong một ngày.'),
            E('まさか、あの{優|やさ}しい{人|ひと}が{犯人|はんにん}のわけがない。', 'Masaka, ano yasashii hito ga hannin no wake ga nai.', 'Làm gì có chuyện người hiền như thế lại là thủ phạm. (N の ＋ わけがない)'),
            E('{三日|みっか}も{寝|ね}ていないんだから、{元気|げんき}なわけがないでしょう。', 'Mikka mo nete inai n da kara, genki na wake ga nai deshou.', 'Ba ngày không ngủ thì sao mà khoẻ được chứ. (ナA な)'),
            E('{料理|りょうり}が{苦手|にがて}な{兄|あに}が{作|つく}ったカレーが、おいしいわけがない。', 'Ryouri ga nigate na ani ga tsukutta karee ga, oishii wake ga nai.', 'Cà ri do ông anh vụng nấu ăn làm thì đời nào mà ngon. (イA)'),
            E('{鍵|かぎ}なんか、{誰|だれ}も{盗|ぬす}むわけがないですよ。', 'Kagi nanka, dare mo nusumu wake ga nai desu yo.', 'Cái chìa khoá thì làm gì có ai đi trộm. (hội thoại ①)'),
            E('{一度|いちど}も{練習|れんしゅう}していないのに、{試合|しあい}に{勝|か}てるわけがない。', 'Ichido mo renshuu shite inai noni, shiai ni kateru wake ga nai.', 'Chưa tập lần nào mà đòi thắng trận thì làm gì có chuyện.'),
          ],
        },
        {
          formula: 'Vないわけがない（= chắc chắn V） · ～わけないじゃない（văn nói）',
          vi: '**Vないわけがない** = "**đời nào lại không**…" → chắc chắn có (phủ định kép, giống ② Vないはずがない). Văn nói thân mật: **～わけない（じゃん／でしょ）**.',
          examples: [
            E('{子|こ}どもがお{菓子|かし}をもらって{喜|よろこ}ばないわけがない。', 'Kodomo ga okashi o moratte yorokobanai wake ga nai.', 'Trẻ con được cho bánh kẹo thì đời nào lại không vui. (= chắc chắn vui)'),
            E('{毎日|まいにち}{会|あ}っているのに、{気|き}づかないわけがない。', 'Mainichi atte iru noni, kizukanai wake ga nai.', 'Ngày nào cũng gặp nhau, đời nào lại không nhận ra.'),
            E('「{本当|ほんとう}に{一人|ひとり}で{行|い}けるの？」「{行|い}けないわけないじゃん。もう{大人|おとな}だよ。」', '"Hontou ni hitori de ikeru no?" "Ikenai wake nai jan. Mou otona da yo."', '"Thật sự đi một mình được không?" — "Sao lại không đi được chứ. Lớn rồi mà." (văn nói thân mật)'),
            E('そんなこと、{私|わたし}に{分|わ}かるわけないでしょう。', 'Sonna koto, watashi ni wakaru wake nai deshou.', 'Chuyện đó thì làm sao tôi biết được chứ.'),
          ],
        },
      ],
    },
    DL('Hỏi – đáp với ～わけがない (ở ký túc xá)', [
      ['ダニエル', 'b', 'リンさん、{僕|ぼく}、{明日|あした}から{毎朝|まいあさ}5{時|じ}に{起|お}きて、ジョギングすることにしたよ。', 'Rin-san, boku, ashita kara maiasa goji ni okite, jogingu suru koto ni shita yo.', 'Linh này, anh quyết định từ mai sáng nào cũng dậy lúc 5 giờ để chạy bộ.'],
      ['リン', 'c', 'えっ、ダニエルさんが？{毎朝|まいあさ}{遅刻|ちこく}しそうになっている{人|ひと}が、5{時|じ}に{起|お}きられるわけがないですよ。', 'E, Danieru-san ga? Maiasa chikoku shisou ni natte iru hito ga, goji ni okirareru wake ga nai desu yo.', 'Hả, anh Daniel á? Người sáng nào cũng suýt đi muộn thì làm gì có chuyện dậy được lúc 5 giờ.'],
      ['ダニエル', 'b', 'ひどいなあ。{目覚|めざ}まし{時計|どけい}を{三|みっ}つもかけるから、{起|お}きられないわけがないよ。', 'Hidoi naa. Mezamashi dokei o mittsu mo kakeru kara, okirarenai wake ga nai yo.', 'Ác thế. Anh đặt những ba cái đồng hồ báo thức, đời nào lại không dậy được.'],
      ['リン', 'c', 'じゃ、{一週間|いっしゅうかん}{続|つづ}いたら、ケーキをごちそうしますね。', 'Ja, isshuukan tsuzuitara, keeki o gochisou shimasu ne.', 'Vậy nếu anh duy trì được một tuần thì em mời anh ăn bánh nhé.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — ～が ～わけがない',
      head: ['Lẽ thường / tính cách', '＋ わけがない', 'Câu', 'Romaji'],
      rows: [
        ['{泳|およ}げない{彼|かれ}', '{海|うみ}で{泳|およ}ぐ', '{泳|およ}げない{彼|かれ}が、{海|うみ}で{泳|およ}ぐわけがない。', 'Oyogenai kare ga, umi de oyogu wake ga nai.'],
        ['{初|はじ}めて{作|つく}ったケーキ', 'おいしい (イA)', '{初|はじ}めて{作|つく}ったケーキが、おいしいわけがない。', 'Hajimete tsukutta keeki ga, oishii wake ga nai.'],
        ['{毎日|まいにち}アルバイトの{学生|がくせい}', '{暇|ひま} (ナA)', '{毎日|まいにち}アルバイトしている{学生|がくせい}が、{暇|ひま}なわけがない。', 'Mainichi arubaito shite iru gakusei ga, hima na wake ga nai.'],
        ['{千円|せんえん}の{指輪|ゆびわ}', '{本物|ほんもの}のダイヤ (N)', '{千円|せんえん}の{指輪|ゆびわ}が、{本物|ほんもの}のダイヤのわけがない。', 'Sen\'en no yubiwa ga, honmono no daiya no wake ga nai.'],
        ['あんなに{怒|おこ}りっぽい{人|ひと}', '{何|なに}も{言|い}わない', 'あんなに{怒|おこ}りっぽい{人|ひと}が、{何|なに}も{言|い}わないわけがない。', 'Anna ni okorippoi hito ga, nani mo iwanai wake ga nai.'],
        ['{一度|いちど}も{勉強|べんきょう}しなかった', '{合格|ごうかく}できる', '{一度|いちど}も{勉強|べんきょう}しなかったのに、{合格|ごうかく}できるわけがない。', 'Ichido mo benkyou shinakatta noni, goukaku dekiru wake ga nai.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～わけがない + một bẫy khác nghĩa',
      items: [
        '~~{暇|ひま}わけがない~~ / ~~{子|こ}どもわけがない~~ → **{暇|ひま}なわけがない** / **{子|こ}どものわけがない** — nối như danh từ. (Văn nói thân mật người Nhật cũng hay nói **Nなわけない**: うそなわけないじゃん — chỉ cần nhận ra; khi làm đề chọn **の／である**.)',
        '⚠ **わけない** (không có が, không có động từ trước) còn một nghĩa khác hẳn: **"dễ ợt, chẳng khó gì"** — **こんな{問題|もんだい}、わけないよ** = "Bài này dễ ợt". Phân biệt: **{解|と}けるわけない** (có động từ trước) = "làm sao giải được" ↔ **わけない** (đứng một mình, sau N は) = "dễ ợt". Đề N3 có thể hỏi đúng chỗ này.',
        'Dùng わけがない **với người trên** khi bác bỏ lời họ nghe **gay gắt**: ~~{先生|せんせい}、そんなわけがないです~~ → **そんなことはないと{思|おも}います** (mềm, lịch sự).',
        'わけがない **không cần căn cứ khách quan** — nhưng cũng vì thế mà dễ **sai** (hội thoại ②: ghét đồ ngọt thì "わけがない" ăn bánh — rồi リン chỉ ra có thể là nói dối). Khi viết báo cáo, bài luận cần khách quan → dùng **はずがない** hoặc **とは{考|かんが}えにくい** (khó có thể nghĩ là — N2).',
        'Nhận ra: **～っこない** (N2, rất thân mật) = わけがない: **できっこない** = できるわけがない · **{分|わ}かりっこない** = {分|わ}かるわけがない (Vます ＋ っこない).',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナAな・Nの（である）＋ わけがない（わけはない／わけない）', vi: '"Làm gì có chuyện…, đời nào…" — phủ nhận gần 100%, chủ quan, cảm xúc, văn nói. Vないわけがない = chắc chắn có. ⚠ わけない đứng một mình = "dễ ợt". Nhận ra: Vます＋っこない (N2).' },

    /* ══════ ④ っぽい ══════ */
    { t: 'h', text: '④ ～っぽい — "trông giống…, ngả…, hơi…, hay…" (tạo tính từ い)' },
    {
      t: 'p',
      text: '**～っぽい** gắn sau một từ để tạo ra **tính từ い** mới, nói rằng một thứ **có vẻ, có tính chất** của cái gì — theo **cảm nhận** của người nói. Ba kiểu chính: **(a) N ＋ っぽい** = "**trông giống** N, mang dáng dấp N" (mà thật ra không phải N, hoặc chưa chắc): {子|こ}どもっぽい, {男|おとこ}っぽい, {秋|あき}っぽい{天気|てんき}, プロっぽい, うそっぽい, クリームっぽい · **(b) màu / イA bỏ い ＋ っぽい** = "**ngả**, **hơi**…": {白|しろ}っぽい, {黒|くろ}っぽい, {安|やす}っぽい (trông rẻ tiền), {水|みず}っぽい (nhạt toẹt — N), {熱|ねつ}っぽい (gây sốt — N) · **(c) Vます ＋ っぽい** = "**hay**, **dễ**… (thói quen, tính cách)": {忘|わす}れっぽい, {怒|おこ}りっぽい, {飽|あ}きっぽい. Sắc thái chung: **văn nói**, thường hơi **chê** (nhất là kiểu a và c). Chia y như **tính từ い**.',
    },
    {
      t: 'table',
      caption: 'Cách tạo ～っぽい — ba kiểu',
      head: ['Kiểu', 'Khuôn', 'Ví dụ', 'Nghĩa', 'Romaji'],
      rows: [
        ['(a) Danh từ', 'N ＋ っぽい', '{子|こ}どもっぽい · {男|おとこ}っぽい · うそっぽい · プロっぽい', 'trông như trẻ con · như con trai · nghe như bịa · như dân chuyên nghiệp', 'kodomoppoi · otokoppoi · usoppoi · puroppoi'],
        ['(b) Màu / イA', 'イA bỏ い ＋ っぽい · màu ＋ っぽい', '{白|しろ}っぽい · {黒|くろ}っぽい · {安|やす}っぽい', 'ngả trắng · ngả đen · trông rẻ tiền', 'shiroppoi · kuroppoi · yasuppoi'],
        ['(b′) N chỉ trạng thái', 'N ＋ っぽい', '{熱|ねつ}っぽい · {風邪|かぜ}っぽい · {水|みず}っぽい', 'hơi sốt · hơi cảm · nhạt (nhiều nước)', 'netsuppoi · kazeppoi · mizuppoi'],
        ['(c) Động từ', 'Vます（bỏ ます）＋ っぽい', '{忘|わす}れっぽい · {怒|おこ}りっぽい · {飽|あ}きっぽい', 'hay quên · dễ nổi nóng · mau chán', 'wasureppoi · okorippoi · akippoi'],
        ['Chia (như イA)', 'っぽくない · っぽかった · っぽく · っぽくて', '{子|こ}どもっぽくない · {白|しろ}っぽかった · {安|やす}っぽく{見|み}える', 'không trẻ con · (đã) ngả trắng · trông rẻ tiền', 'kodomoppoku nai · shiroppokatta · yasuppoku mieru'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(a) N ＋ っぽい — "trông giống N (mà không phải / chưa chắc là N)"',
          vi: 'Nói về **ấn tượng bề ngoài**: người, vật, thời tiết, lời nói. Người lớn mà **giống trẻ con** → {子|こ}どもっぽい (chê).',
          examples: [
            E('{父|ちち}は{五十歳|ごじゅっさい}なのに、{子|こ}どもっぽいところがあります。', 'Chichi wa gojussai na noni, kodomoppoi tokoro ga arimasu.', 'Bố tôi đã năm mươi tuổi vậy mà vẫn có chỗ trẻ con.'),
            E('{今日|きょう}は{風|かぜ}が{涼|すず}しくて、{秋|あき}っぽい{天気|てんき}ですね。', 'Kyou wa kaze ga suzushikute, akippoi tenki desu ne.', 'Hôm nay gió mát, thời tiết như mùa thu nhỉ.'),
            E('その{話|はなし}、ちょっとうそっぽいね。', 'Sono hanashi, chotto usoppoi ne.', 'Chuyện đó nghe hơi giống bịa nhỉ.'),
            E('{彼|かれ}の{写真|しゃしん}は、プロっぽくてかっこいい。', 'Kare no shashin wa, puroppokute kakkoii.', 'Ảnh anh ấy chụp trông như dân chuyên nghiệp, đẹp quá.'),
            E('{袖|そで}に{白|しろ}いクリームっぽいものが{付|つ}いていた。', 'Sode ni shiroi kuriimuppoi mono ga tsuite ita.', 'Trên tay áo dính thứ gì trắng trông như kem. (hội thoại ②)'),
          ],
        },
        {
          formula: '(b) màu／イA（bỏ い）＋ っぽい — "ngả…, hơi…"',
          vi: 'Màu **không rõ ràng** ({白|しろ}っぽい = trăng trắng, gần trắng) — rất hay dùng khi **mô tả đồ thất lạc, người khả nghi**. **{安|やす}っぽい** = trông rẻ tiền (luôn là chê).',
          examples: [
            E('{犯人|はんにん}は{黒|くろ}っぽい{服|ふく}を{着|き}ていたそうです。', 'Hannin wa kuroppoi fuku o kite ita sou desu.', 'Nghe nói thủ phạm mặc quần áo màu đen đen.'),
            E('{落|お}としたのは、{青|あお}っぽい{小|ちい}さい{財布|さいふ}です。', 'Otoshita no wa, aoppoi chiisai saifu desu.', 'Cái tôi đánh rơi là chiếc ví nhỏ màu xanh xanh.'),
            E('このコートは{安|やす}っぽく{見|み}えるけど、{実|じつ}は{高|たか}かったんだ。', 'Kono kooto wa yasuppoku mieru kedo, jitsu wa takakatta n da.', 'Cái áo khoác này trông rẻ tiền nhưng thật ra đắt lắm đấy.'),
            E('{朝|あさ}から{熱|ねつ}っぽいので、{病院|びょういん}に{行|い}きます。', 'Asa kara netsuppoi node, byouin ni ikimasu.', 'Từ sáng đã thấy hơi sốt nên tôi đi bệnh viện. (N trạng thái ＋ っぽい)'),
          ],
        },
        {
          formula: '(c) Vます（bỏ ます）＋ っぽい — "hay…, dễ…"',
          vi: 'Nói **thói quen / tính cách** lặp lại (thường không tốt). Hay dùng: **{忘|わす}れっぽい・{怒|おこ}りっぽい・{飽|あ}きっぽい** — gần như cố định, không tự ghép với mọi động từ.',
          examples: [
            E('{祖母|そぼ}は{最近|さいきん}{忘|わす}れっぽくなりました。', 'Sobo wa saikin wasureppoku narimashita.', 'Dạo này bà tôi trở nên hay quên.'),
            E('{怒|おこ}りっぽい{人|ひと}とは、{一緒|いっしょ}に{働|はたら}きにくいです。', 'Okorippoi hito to wa, issho ni hatarakinikui desu.', 'Khó làm việc cùng người dễ nổi nóng.'),
            E('{飽|あ}きっぽい{私|わたし}が、{日本語|にほんご}だけは{三年|さんねん}も{続|つづ}いています。', 'Akippoi watashi ga, nihongo dake wa sannen mo tsuzuite imasu.', 'Tôi mau chán thế mà riêng tiếng Nhật thì đã theo được ba năm.'),
            E('ダニエルさんは{本当|ほんとう}に{忘|わす}れっぽいですね。', 'Danieru-san wa hontou ni wasureppoi desu ne.', 'Anh Daniel đúng là hay quên thật. (hội thoại ①)'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⭐ ～っぽい ↔ ～らしい ↔ ～のようだ／みたいだ — đề N3 hay hỏi',
      head: ['Câu', 'Nghĩa', 'Sắc thái', 'Romaji'],
      rows: [
        ['{彼|かれ}は{子|こ}ども**っぽい**。', 'anh ấy (người lớn) trẻ con', 'chê — không phải trẻ con mà GIỐNG trẻ con', 'Kare wa kodomoppoi.'],
        ['あの{子|こ}は{子|こ}ども**らしい**。', 'đứa bé đó đúng chất trẻ con (hồn nhiên)', 'khen — ĐÚNG là N, có đủ nét tiêu biểu (らしい nghĩa "đúng chất" — khác らしい "nghe đâu" Bài 20)', 'Ano ko wa kodomorashii.'],
        ['{彼|かれ}は{子|こ}どもの**ようだ／みたいだ**。', 'anh ấy như (một đứa) trẻ con', 'so sánh, ví von — trung tính hơn, nói khách quan', 'Kare wa kodomo no you da / mitai da.'],
        ['{彼女|かのじょ}は{男|おとこ}**っぽい**{服|ふく}が{好|す}きだ。', 'cô ấy thích đồ trông như con trai', 'tả phong cách (nữ mà giống nam) — không hẳn chê', 'Kanojo wa otokoppoi fuku ga suki da.'],
        ['{彼|かれ}は{男|おとこ}**らしい**。', 'anh ấy nam tính, ra dáng đàn ông', 'khen', 'Kare wa otokorashii.'],
        ['{雨|あめ}が{降|ふ}り**そう**だ。', 'trời sắp mưa (thấy mây đen)', 'そう (Bài 20) — dấu hiệu sắp xảy ra; っぽい không thay được', 'Ame ga furisou da.'],
      ],
    },
    DL('Hỏi – đáp với ～っぽい', [
      ['マリヤム', 'a', 'リンさん、{新|あたら}しいルームメイトはどんな{人|ひと}？', 'Rin-san, atarashii ruumumeito wa donna hito?', 'Linh ơi, bạn cùng phòng mới là người thế nào?'],
      ['リン', 'c', '{明|あか}るくて{優|やさ}しい{人|ひと}です。でも、ちょっと{忘|わす}れっぽくて、{毎朝|まいあさ}{鍵|かぎ}を{探|さが}しています。', 'Akarukute yasashii hito desu. Demo, chotto wasureppokute, maiasa kagi o sagashite imasu.', 'Bạn ấy vui vẻ và tốt bụng ạ. Nhưng hơi hay quên, sáng nào cũng đi tìm chìa khoá.'],
      ['マリヤム', 'a', 'ダニエルさんみたいね。{何歳|なんさい}ぐらいの{人|ひと}？', 'Danieru-san mitai ne. Nansai gurai no hito?', 'Giống anh Daniel nhỉ. Bạn ấy khoảng bao nhiêu tuổi?'],
      ['リン', 'c', '{十八歳|じゅうはっさい}ですけど、{話|はな}し{方|かた}が{落|お}ち{着|つ}いていて、{大人|おとな}っぽいんです。', 'Juuhassai desu kedo, hanashikata ga ochitsuite ite, otonappoi n desu.', 'Mười tám tuổi thôi nhưng cách nói chuyện điềm tĩnh, trông chững chạc lắm.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — tả người / vật bằng ～っぽい',
      head: ['Gốc', '＋ っぽい', 'Câu', 'Romaji'],
      rows: [
        ['{子|こ}ども (N)', '{子|こ}どもっぽい', '{兄|あに}は{子|こ}どもっぽいことばかり{言|い}う。', 'Ani wa kodomoppoi koto bakari iu.'],
        ['{大人|おとな} (N)', '{大人|おとな}っぽい', '{妹|いもうと}は{中学生|ちゅうがくせい}なのに{大人|おとな}っぽい。', 'Imouto wa chuugakusei na noni otonappoi.'],
        ['{黒|くろ}い (màu)', '{黒|くろ}っぽい', '{黒|くろ}っぽいかばんを{見|み}ませんでしたか。', 'Kuroppoi kaban o mimasen deshita ka.'],
        ['{安|やす}い (イA)', '{安|やす}っぽい', 'このドレスは{安|やす}っぽく{見|み}える。', 'Kono doresu wa yasuppoku mieru.'],
        ['{熱|ねつ} (N)', '{熱|ねつ}っぽい', '{熱|ねつ}っぽいので、{今日|きょう}は{休|やす}みます。', 'Netsuppoi node, kyou wa yasumimasu.'],
        ['{忘|わす}れます (V)', '{忘|わす}れっぽい', '{最近|さいきん}{忘|わす}れっぽくて{困|こま}っている。', 'Saikin wasureppokute komatte iru.'],
        ['{怒|おこ}ります (V)', '{怒|おこ}りっぽい', '{怒|おこ}りっぽい{店長|てんちょう}は{苦手|にがて}だ。', 'Okorippoi tenchou wa nigate da.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～っぽい',
      items: [
        '~~{安|やす}いっぽい~~ / ~~{忘|わす}れるっぽい~~ / ~~{忘|わす}れますっぽい~~ → **{安|やす}っぽい** (bỏ い) / **{忘|わす}れっぽい** (gốc ます).',
        '~~{子|こ}どもっぽいな{人|ひと}~~ → **{子|こ}どもっぽい{人|ひと}** — っぽい là **tính từ い**, không thêm な. Phủ định: **{子|こ}どもっぽくない** (không phải ~~{子|こ}どもっぽいじゃない~~).',
        'Nhầm **っぽい ↔ らしい**: khen một đứa bé hồn nhiên → **{子|こ}どもらしい**, không phải ~~{子|こ}どもっぽい~~ (nghe như chê). Nói "người lớn mà trẻ con" → **{子|こ}どもっぽい**.',
        '⚠ Nói **người trên** là "～っぽい" (kiểu a, c) dễ thành **chê**: ~~{先生|せんせい}は{子|こ}どもっぽいですね~~ = thất lễ. Còn {白|しろ}っぽい, {熱|ねつ}っぽい (tả vật, tả mình) thì dùng thoải mái.',
        'Văn nói của người trẻ: **{普通形|ふつうけい} ＋ っぽい** ≈ **みたい** ("có vẻ"): **{彼|かれ}、{今日|きょう}は{来|こ}ないっぽい** (hình như hôm nay cậu ấy không đến). Chỉ cần **nghe hiểu** — khi viết, khi thi dùng **ようだ／みたいだ／らしい** (Bài 20).',
      ],
    },
    { t: 'rule', formula: 'N ＋ っぽい · イA（い bỏ）・màu ＋ っぽい · Vます ＋ っぽい → chia như イA（っぽくない・っぽかった・っぽく）', vi: '"Trông giống… / ngả… / hay…" — cảm nhận của người nói, văn nói, thường hơi chê. ↔ らしい (đúng chất — khen) ↔ ようだ／みたいだ (so sánh).' },

    /* ══════ ⑤ わけだ ══════ */
    { t: 'h', text: '⑤ ～わけだ — "thảo nào…, hèn chi…" · "tức là…" · "là vì thế mà…" (kết luận tự nhiên)' },
    {
      t: 'p',
      text: '**～わけだ** (lịch sự **～わけです**) nói rằng một điều là **kết quả tự nhiên, đương nhiên** của một **sự thật / lý do đã biết**. Ba cách dùng: **(a) 納得 — "thảo nào, hèn chi"**: mình đã thấy chuyện X từ trước, nay biết được lý do → "à, vì thế mà X" — hay đi với **だから／{道理|どうり}で／それで** · **(b) 言い換え — "tức là, nói cách khác"**: diễn đạt lại một sự việc bằng hệ quả của nó (thường là tính toán) — hay đi với **つまり** · **(c) 説明 — "là vì thế mà…, nên mới…"**: người nói tự giải thích kết quả cho người nghe: **～ので、～わけです** / **～というわけだ** (vậy là, thế là). Câu hỏi **～わけですか** = "vậy là… phải không?" (xác nhận mình hiểu đúng).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～わけだ',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ', 'V{普通形|ふつうけい} ＋ わけだ', '{上手|じょうず}になった**わけだ** · {見|み}つからない**わけだ**', 'jouzu ni natta wake da · mitsukaranai wake da'],
        ['Tính từ い', 'イA ＋ わけだ', '{寒|さむ}い**わけだ** · {高|たか}かった**わけだ**', 'samui wake da · takakatta wake da'],
        ['Tính từ な', 'ナA な ＋ わけだ', '{上手|じょうず}**な**わけだ · {静|しず}か**な**わけだ', 'jouzu na wake da · shizuka na wake da'],
        ['Danh từ', 'N の／N である ＋ わけだ', '{休|やす}み**の**わけだ · {先輩|せんぱい}**である**わけだ', 'yasumi no wake da · senpai de aru wake da'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(a) だから／道理で／それで ～わけだ — "thảo nào…"',
          vi: 'Trình tự: **thấy kết quả trước** (lạ, khó hiểu) → **biết lý do sau** → わけだ. Lý do thường do **người khác nói cho** hoặc **chợt phát hiện**.',
          examples: [
            E('「{窓|まど}が{開|あ}いていたよ。」「だから{寒|さむ}いわけだ。」', '"Mado ga aite ita yo." "Dakara samui wake da."', '"Cửa sổ đang mở đấy." — "Thảo nào lạnh thế."'),
            E('{彼女|かのじょ}はアメリカで{育|そだ}ったそうだ。{道理|どうり}で{英語|えいご}の{発音|はつおん}がきれいなわけだ。', 'Kanojo wa Amerika de sodatta sou da. Douri de eigo no hatsuon ga kirei na wake da.', 'Nghe nói cô ấy lớn lên ở Mỹ. Thảo nào phát âm tiếng Anh hay thế. (ナA な)'),
            E('{今日|きょう}は{祝日|しゅくじつ}なんだ。それで{道|みち}がすいているわけだ。', 'Kyou wa shukujitsu na n da. Sorede michi ga suite iru wake da.', 'Hôm nay là ngày lễ à. Thảo nào đường vắng.'),
            E('ジャケットは{図書館|としょかん}のロッカーだ。だから{見|み}つからなかったわけだ。', 'Jaketto wa toshokan no rokkaa da. Dakara mitsukaranakatta wake da.', 'Áo khoác ở tủ đồ thư viện. Thảo nào không tìm thấy. (hội thoại ①)'),
            E('{毎晩|まいばん}{遅|おそ}くまでゲームをしているの？{道理|どうり}で{眠|ねむ}そうなわけだ。', 'Maiban osoku made geemu o shite iru no? Douri de nemusou na wake da.', 'Tối nào cũng chơi game tới khuya à? Thảo nào trông buồn ngủ thế.'),
          ],
        },
        {
          formula: '(b) つまり ～わけだ — "tức là…" (nói lại bằng hệ quả)',
          vi: 'Hai câu nói **cùng một sự việc** — câu sau rút ra **hệ quả** (con số, quan hệ) từ câu trước. Hay gặp trong **bài đọc, bài nghe** dạng giải thích.',
          examples: [
            E('{一日|いちにち}{二時間|にじかん}、{週|しゅう}に{五日|いつか}{練習|れんしゅう}する。つまり、{一週間|いっしゅうかん}に{十時間|じゅうじかん}{練習|れんしゅう}するわけだ。', 'Ichinichi nijikan, shuu ni itsuka renshuu suru. Tsumari, isshuukan ni juujikan renshuu suru wake da.', 'Mỗi ngày tập hai tiếng, tuần năm ngày. Tức là một tuần tập mười tiếng.'),
            E('{彼|かれ}は{私|わたし}の{父|ちち}の{弟|おとうと}の{息子|むすこ}です。つまり、いとこなわけです。', 'Kare wa watashi no chichi no otouto no musuko desu. Tsumari, itoko na wake desu.', 'Anh ấy là con trai của em trai bố tôi. Tức là anh họ của tôi. (N な — văn nói; viết: いとこであるわけです)'),
            E('{来月|らいげつ}から{家賃|やちん}が{一万円|いちまんえん}{上|あ}がる。{一年|いちねん}で{十二万円|じゅうにまんえん}も{多|おお}く{払|はら}うわけだ。', 'Raigetsu kara yachin ga ichiman\'en agaru. Ichinen de juuniman\'en mo ooku harau wake da.', 'Từ tháng sau tiền nhà tăng một vạn yên. Tức là một năm trả thêm những mười hai vạn yên.'),
            E('{犯人|はんにん}は{外|そと}から{入|はい}っていない。つまり、{中|なか}にいた{誰|だれ}かが{犯人|はんにん}なわけだ。', 'Hannin wa soto kara haitte inai. Tsumari, naka ni ita dare ka ga hannin na wake da.', 'Thủ phạm không vào từ bên ngoài. Tức là thủ phạm là một người đã ở bên trong.'),
          ],
        },
        {
          formula: '(c) ～ので、～わけです · ～というわけだ — "là vì thế mà… / vậy là…"',
          vi: 'Người nói **giải thích** kết quả của chính mình cho người nghe, chốt bằng わけです (giọng trình bày, phát biểu). **～というわけだ** = "thế là, vậy là" (tóm câu chuyện).',
          examples: [
            E('{父|ちち}が{日本|にほん}の{会社|かいしゃ}で{働|はたら}いていたので、{私|わたし}も{子|こ}どものころから{日本語|にほんご}に{興味|きょうみ}があったわけです。', 'Chichi ga Nihon no kaisha de hataraite ita node, watashi mo kodomo no koro kara nihongo ni kyoumi ga atta wake desu.', 'Bố tôi từng làm ở công ty Nhật nên tôi cũng quan tâm tới tiếng Nhật từ nhỏ — là vì thế đấy ạ.'),
            E('{電車|でんしゃ}が{止|と}まって、{一時間|いちじかん}{待|ま}って、それで{遅|おく}れたというわけです。', 'Densha ga tomatte, ichijikan matte, sorede okureta to iu wake desu.', 'Tàu dừng, tôi chờ một tiếng, thế là tôi đến muộn ạ.'),
            E('「{来週|らいしゅう}から{大阪|おおさか}に{転勤|てんきん}なんです。」「じゃ、{引|ひ}っ{越|こ}しするわけですか。」', '"Raishuu kara Oosaka ni tenkin na n desu." "Ja, hikkoshi suru wake desu ka."', '"Từ tuần sau tôi chuyển công tác xuống Osaka." — "Vậy là anh sẽ chuyển nhà phải không?" (xác nhận)'),
          ],
        },
      ],
    },
    DL('Hỏi – đáp với ～わけだ', [
      ['リン', 'c', 'カルロスさん、{最近|さいきん}{日本語|にほんご}がすごく{上手|じょうず}になりましたね。', 'Karurosu-san, saikin nihongo ga sugoku jouzu ni narimashita ne.', 'Anh Carlos, dạo này tiếng Nhật của anh giỏi lên hẳn nhỉ.'],
      ['カルロス', 'b', '{実|じつ}は、{先月|せんげつ}から{日本人|にほんじん}のルームメイトと{住|す}んでいて、{毎晩|まいばん}{二時間|にじかん}ぐらい{話|はな}しているんです。', 'Jitsu wa, sengetsu kara nihonjin no ruumumeito to sunde ite, maiban nijikan gurai hanashite iru n desu.', 'Thật ra từ tháng trước anh ở cùng một bạn người Nhật, tối nào cũng nói chuyện khoảng hai tiếng.'],
      ['リン', 'c', 'なるほど。だから{上手|じょうず}になったわけですね。{毎晩|まいばん}{二時間|にじかん}なら、{一か月|いっかげつ}で{六十時間|ろくじゅうじかん}も{話|はな}しているわけですから。', 'Naruhodo. Dakara jouzu ni natta wake desu ne. Maiban nijikan nara, ikkagetsu de rokujuujikan mo hanashite iru wake desu kara.', 'Ra vậy. Thảo nào anh giỏi lên. Mỗi tối hai tiếng thì tức là một tháng anh nói những sáu mươi tiếng còn gì.'],
      ['カルロス', 'b', 'そう{言|い}われると、すごいですね。でも、{話|はなし}の{半分|はんぶん}はゲームのことですよ。', 'Sou iwareru to, sugoi desu ne. Demo, hanashi no hanbun wa geemu no koto desu yo.', 'Nghe em nói thế thì thấy ghê thật. Nhưng một nửa là nói chuyện game đấy.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — ［lý do vừa biết］。だから／道理で ～わけだ',
      head: ['Điều đã thấy', 'Lý do vừa biết', 'Câu', 'Romaji'],
      rows: [
        ['{部屋|へや}が{寒|さむ}い', 'エアコンが{壊|こわ}れている', 'エアコンが{壊|こわ}れているのか。だから{寒|さむ}いわけだ。', 'Eakon ga kowarete iru no ka. Dakara samui wake da.'],
        ['{彼|かれ}は{料理|りょうり}が{上手|じょうず}だ', 'レストランで{働|はたら}いていた', 'レストランで{働|はたら}いていたのか。{道理|どうり}で{上手|じょうず}なわけだ。', 'Resutoran de hataraite ita no ka. Douri de jouzu na wake da.'],
        ['{店|みせ}が{閉|し}まっている', '{今日|きょう}は{定休日|ていきゅうび}だ', '{今日|きょう}は{定休日|ていきゅうび}か。それで{閉|し}まっているわけだ。', 'Kyou wa teikyuubi ka. Sorede shimatte iru wake da.'],
        ['{電話|でんわ}がつながらない', 'スマホの{電池|でんち}が{切|き}れていた', '{電池|でんち}が{切|き}れていたのか。だからつながらなかったわけだ。', 'Denchi ga kirete ita no ka. Dakara tsunagaranakatta wake da.'],
        ['{木村|きむら}さんは{元気|げんき}がない', '{試験|しけん}に{落|お}ちた', '{試験|しけん}に{落|お}ちたのか。{道理|どうり}で{元気|げんき}がないわけだ。', 'Shiken ni ochita no ka. Douri de genki ga nai wake da.'],
        ['ケーキがなかった', '{先生|せんせい}が{別|べつ}の{冷蔵庫|れいぞうこ}に{移|うつ}した', '{別|べつ}の{冷蔵庫|れいぞうこ}に{移|うつ}したのか。だからなかったわけだ。', 'Betsu no reizouko ni utsushita no ka. Dakara nakatta wake da.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～わけだ',
      items: [
        '~~{明日|あした}は{雨|あめ}が{降|ふ}るわけだ~~ (khi chỉ đoán) → **{降|ふ}るだろう／{降|ふ}るかもしれない** — わけだ là **kết luận từ sự thật / lý do đã biết**, không phải dự đoán.',
        '~~{寒|さむ}いなわけだ~~ / ~~{上手|じょうず}わけだ~~ → **{寒|さむ}いわけだ** / **{上手|じょうず}なわけだ** — nối như danh từ.',
        'Đặt わけだ **trước** khi có lý do: ~~だから{寒|さむ}いわけだ。{窓|まど}が{開|あ}いているかもしれない~~ — vô lý; phải biết lý do (窓が開いていた) **rồi** mới "thảo nào".',
        '**わけだ ↔ のだ（んだ）**: **{窓|まど}が{開|あ}いていたんだ** = giải thích / nêu lý do · **だから{寒|さむ}いわけだ** = chốt **kết luận** từ lý do đó. Hai câu thường đi liền nhau: "～んだ。だから～わけだ".',
        '**わけだ ↔ はずだ** (chi tiết ở ⑧): khi đã biết lý do, "thảo nào" dùng được **cả hai**: {道理|どうり}で{寒|さむ}いわけだ／{寒|さむ}いはずだ. Nhưng **dự đoán** (chưa biết) chỉ dùng はずだ; **tính toán "tức là"** chỉ dùng わけだ.',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナAな・Nの（である）＋ わけだ · だから／道理で／それで～わけだ · つまり～わけだ · ～というわけだ', vi: '"Thảo nào…" (hiểu ra lý do) · "tức là…" (hệ quả) · "là vì thế mà…" (giải thích) — kết luận tự nhiên từ sự thật đã biết. Không dùng cho dự đoán.' },

    /* ══════ ⑥ わけではない／わけでもない ══════ */
    { t: 'h', text: '⑥ ～わけではない／～わけでもない — "không hẳn là…, không phải là… / cũng không phải là…" · ～ないわけではない' },
    {
      t: 'p',
      text: '**～わけではない** (văn nói **～わけじゃない**, lịch sự **～わけではありません**) phủ định **một kết luận** mà người nghe **có thể nghĩ ra** từ tình huống — chứ không phủ định thẳng sự việc. "Tôi không ăn → chắc là ghét?" — **{嫌|きら}いなわけではない** (không phải là ghét — có lý do khác). Hai kiểu hay gặp: **(a) phủ định một phần** với **{全部|ぜんぶ}・みんな・いつも・{必|かなら}ずしも（Bài 28）・{特|とく}に・{別|べつ}に**: "không phải tất cả / lúc nào cũng…" · **(b) gạt đi một suy đoán**: "không phải là vì…". **～わけでもない** = "**cũng** không phải là…" — thêm **một phủ định nữa**, sau một phủ định trước hoặc khi gạt thêm một khả năng: **{嫌|きら}いなわけではないし、{忙|いそが}しいわけでもない**. **～というわけではない** mềm hơn ("không hẳn là kiểu…"). Ngược lại, **～ないわけではない** = "**không phải là không**…" → **có**, nhưng **ít / có điều kiện / miễn cưỡng**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～わけではない (giống ⑤)',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ', 'V{普通形|ふつうけい} ＋ わけではない', '{行|い}きたくない**わけではない** · {忘|わす}れた**わけではない**', 'ikitaku nai wake de wa nai · wasureta wake de wa nai'],
        ['Tính từ い', 'イA ＋ わけではない', 'おいしくない**わけではない** · {高|たか}い**わけではない**', 'oishiku nai wake de wa nai · takai wake de wa nai'],
        ['Tính từ な', 'ナA な ＋ わけではない', '{嫌|きら}い**な**わけではない · {暇|ひま}**な**わけではない', 'kirai na wake de wa nai · hima na wake de wa nai'],
        ['Danh từ', 'N という／N だという ＋ わけではない (N の — ít dùng)', '{初心者|しょしんしゃ}という**わけではない** · {全部|ぜんぶ}{本物|ほんもの}だという**わけではない**', 'shoshinsha to iu wake de wa nai · zenbu honmono da to iu wake de wa nai'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ Bốn câu về "thích sushi" — đọc thật chậm',
      head: ['Câu', 'Nghĩa thật', 'Romaji'],
      rows: [
        ['すしが{好|す}きだ。', 'THÍCH sushi.', 'Sushi ga suki da.'],
        ['すしが{好|す}きな**わけではない**。', 'Không hẳn là thích (có ăn, nhưng không phải vì thích).', 'Sushi ga suki na wake de wa nai.'],
        ['すしが{嫌|きら}いな**わけではない**。', 'Không phải là ghét (chỉ là hôm nay không ăn / không ăn nhiều).', 'Sushi ga kirai na wake de wa nai.'],
        ['すしが{食|た}べられない**わけではない**。', 'Không phải là không ăn được (ăn được — nhưng không thích lắm).', 'Sushi ga taberarenai wake de wa nai.'],
        ['すしが{好|す}きな**わけがない**。(③)', 'Làm gì có chuyện thích sushi (= chắc chắn KHÔNG thích).', 'Sushi ga suki na wake ga nai.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(a) 全部／いつも／必ずしも／特に ～わけではない — phủ định một phần',
          vi: '"Không phải **tất cả / lúc nào cũng / nhất thiết** …". Đề N3 rất hay ghép **{必|かなら}ずしも～わけではない**.',
          examples: [
            E('{日本人|にほんじん}が{全員|ぜんいん}、すしが{好|す}きなわけではありません。', 'Nihonjin ga zen\'in, sushi ga suki na wake de wa arimasen.', 'Không phải người Nhật nào cũng thích sushi.'),
            E('{高|たか}い{物|もの}が{必|かなら}ずしもいい{物|もの}だというわけではない。', 'Takai mono ga kanarazushimo ii mono da to iu wake de wa nai.', 'Đồ đắt không nhất thiết là đồ tốt.'),
            E('{毎日|まいにち}{自炊|じすい}しているわけではありません。{忙|いそが}しい{日|ひ}はコンビニです。', 'Mainichi jisui shite iru wake de wa arimasen. Isogashii hi wa konbini desu.', 'Không phải ngày nào tôi cũng tự nấu. Ngày bận thì ăn đồ cửa hàng tiện lợi.'),
            E('{日本|にほん}に{住|す}んでいるからといって、{日本語|にほんご}が{上手|じょうず}なわけではない。', 'Nihon ni sunde iru kara to itte, nihongo ga jouzu na wake de wa nai.', 'Không phải cứ sống ở Nhật là giỏi tiếng Nhật. (からといって = chỉ vì… — N2, nhận ra)'),
            E('{特|とく}に{用事|ようじ}があるわけではないんですが、{声|こえ}が{聞|き}きたくて{電話|でんわ}しました。', 'Toku ni youji ga aru wake de wa nai n desu ga, koe ga kikitakute denwa shimashita.', 'Không phải có việc gì đặc biệt đâu, chỉ là muốn nghe giọng nên gọi điện.'),
          ],
        },
        {
          formula: '(b) 別に ～わけではない · ～わけではないし、～わけでもない',
          vi: 'Gạt đi **suy đoán** của người nghe ("không phải vì…"), rồi có thể gạt thêm một khả năng nữa bằng **～わけでもない** ("cũng không phải…").',
          examples: [
            E('{別|べつ}に{怒|おこ}っているわけではありません。ちょっと{疲|つか}れているだけです。', 'Betsu ni okotte iru wake de wa arimasen. Chotto tsukarete iru dake desu.', 'Tôi chẳng phải đang giận gì đâu. Chỉ hơi mệt thôi.'),
            E('パーティーに{行|い}きたくないわけではないし、{忙|いそが}しいわけでもない。ただ、{知|し}らない{人|ひと}が{多|おお}いのが{苦手|にがて}なんだ。', 'Paatii ni ikitaku nai wake de wa nai shi, isogashii wake de mo nai. Tada, shiranai hito ga ooi no ga nigate na n da.', 'Không phải tôi không muốn đi tiệc, cũng không phải bận. Chỉ là tôi ngại chỗ đông người lạ.'),
            E('「{彼|かれ}のこと、{疑|うたが}ってるの？」「{疑|うたが}っているわけでもないけど、{少|すこ}し{気|き}になるんだ。」', '"Kare no koto, utagatteru no?" "Utagatte iru wake de mo nai kedo, sukoshi ki ni naru n da."', '"Cậu nghi anh ta à?" — "Cũng không hẳn là nghi, nhưng hơi bận tâm."'),
          ],
        },
        {
          formula: '(c) ～ないわけではない（ないわけでもない）— "không phải là không…" (= có, nhưng…)',
          vi: 'Phủ định kép → **có**, nhưng **ít, có điều kiện, không hào hứng**. Thường theo sau là **が／けど** + điều kiện / lý do.',
          examples: [
            E('お{酒|さけ}は{飲|の}めないわけではないんですが、あまり{好|す}きじゃないんです。', 'Osake wa nomenai wake de wa nai n desu ga, amari suki ja nai n desu.', 'Không phải là tôi không uống được rượu, nhưng không thích lắm.'),
            E('{時間|じかん}がないわけではないが、{今週|こんしゅう}は{少|すこ}し{厳|きび}しい。', 'Jikan ga nai wake de wa nai ga, konshuu wa sukoshi kibishii.', 'Không phải là không có thời gian, nhưng tuần này hơi căng.'),
            E('あなたの{気持|きも}ちも、{分|わ}からないわけではありません。', 'Anata no kimochi mo, wakaranai wake de wa arimasen.', 'Tôi cũng không phải là không hiểu cảm giác của bạn. (= tôi hiểu phần nào)'),
            E('{一人|ひとり}で{行|い}けないわけでもないけど、{一緒|いっしょ}に{来|き}てくれると{助|たす}かる。', 'Hitori de ikenai wake de mo nai kedo, issho ni kite kureru to tasukaru.', 'Cũng không phải là không đi một mình được, nhưng bạn đi cùng thì đỡ cho mình quá.'),
          ],
        },
      ],
    },
    DL('Hỏi – đáp với ～わけではない (tiệc ゼミ)', [
      ['{佐藤先生|さとうせんせい}', 'a', 'カルロスさん、お{刺身|さしみ}を{全然|ぜんぜん}{食|た}べていませんね。{嫌|きら}いなんですか。', 'Karurosu-san, osashimi o zenzen tabete imasen ne. Kirai na n desu ka.', 'Carlos, em chưa đụng miếng sashimi nào nhỉ. Em ghét à?'],
      ['カルロス', 'b', 'いいえ、{嫌|きら}いなわけではないんです。{生|なま}の{魚|さかな}をあまり{食|た}べたことがないので、ちょっと{緊張|きんちょう}して……。', 'Iie, kirai na wake de wa nai n desu. Nama no sakana o amari tabeta koto ga nai node, chotto kinchou shite…….', 'Dạ không, không phải là em ghét ạ. Em ít khi ăn cá sống nên hơi hồi hộp…'],
      ['{佐藤先生|さとうせんせい}', 'a', '{無理|むり}しなくていいですよ。{日本人|にほんじん}がみんな{刺身|さしみ}が{好|す}きなわけでもありませんから。', 'Muri shinakute ii desu yo. Nihonjin ga minna sashimi ga suki na wake de mo arimasen kara.', 'Không cần cố đâu. Cũng không phải người Nhật nào cũng thích sashimi mà.'],
      ['カルロス', 'b', 'じゃ、ひと{切|き}れだけ……。あ、{食|た}べられないわけじゃないです。おいしい！', 'Ja, hitokire dake……. A, taberarenai wake ja nai desu. Oishii!', 'Vậy em thử một miếng thôi… À, không phải là không ăn được ạ. Ngon quá!'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — ～わけではない（でもない）',
      head: ['Tình huống', 'Người nghe có thể nghĩ…', 'Câu gạt đi', 'Romaji'],
      rows: [
        ['{彼|かれ}はパーティーに{来|こ}なかった', 'ghét bạn bè', '{友達|ともだち}が{嫌|きら}いなわけではない。{用事|ようじ}があったんだ。', 'Tomodachi ga kirai na wake de wa nai. Youji ga atta n da.'],
        ['{私|わたし}は{毎朝|まいあさ}パンだ', 'ghét cơm', 'ご{飯|はん}が{嫌|きら}いなわけではありません。{時間|じかん}がないんです。', 'Gohan ga kirai na wake de wa arimasen. Jikan ga nai n desu.'],
        ['{日本|にほん}に{五年|ごねん}いる', 'biết hết kính ngữ', '{敬語|けいご}が{全部|ぜんぶ}{分|わ}かるわけではない。', 'Keigo ga zenbu wakaru wake de wa nai.'],
        ['{高|たか}いレストラン', 'chắc chắn ngon', '{高|たか}い{店|みせ}が{必|かなら}ずしもおいしいわけではない。', 'Takai mise ga kanarazushimo oishii wake de wa nai.'],
        ['{彼|かれ}は{何|なに}も{言|い}わない', 'đang giận / đang buồn', '{怒|おこ}っているわけでも、{悲|かな}しいわけでもない。{眠|ねむ}いだけだ。', 'Okotte iru wake de mo, kanashii wake de mo nai. Nemui dake da.'],
        ['お{酒|さけ}を{断|ことわ}った', 'không uống được', '{飲|の}めないわけではないが、{明日|あした}{運転|うんてん}するんです。', 'Nomenai wake de wa nai ga, ashita unten suru n desu.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～わけではない',
      items: [
        'Nhầm **わけではない ↔ わけがない**: **{嫌|きら}いなわけではない** = "không phải là ghét" (nhẹ) ↔ **{嫌|きら}いなわけがない** = "làm gì có chuyện ghét" (chắc chắn KHÔNG ghét, phủ nhận mạnh). Một chữ が／では đổi hẳn nghĩa.',
        '**～ないわけではない** hiểu thành "không" — SAI. Phủ định kép = **CÓ** (nhưng ít): {飲|の}めないわけではない = **uống được** (một chút).',
        '~~{全然|ぜんぜん}～わけではない~~ — {全然|ぜんぜん} đi với phủ định hoàn toàn (全然{分|わ}からない). Phủ định một phần dùng **{全部|ぜんぶ}／いつも／{必|かなら}ずしも／{特|とく}に**.',
        'Dùng わけではない cho câu **không có "kết luận ngầm"** nào để gạt → nghe vòng vo: hỏi "{明日|あした}{雨|あめ}？" mà trả lời ~~{雨|あめ}のわけではない~~ → **{雨|あめ}じゃないよ** là đủ.',
        '**わけではない ↔ わけでもない**: も = "cũng". ～わけでもない đứng **sau** một phủ định khác, hoặc khi gạt **thêm** một khả năng: {嫌|きら}いなわけではないし、{忙|いそが}しいわけでもない.',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナAな・Nの ＋ わけではない（わけじゃない／わけではありません） · ～わけでもない · ～ないわけではない', vi: '"Không hẳn là / không phải là…" — phủ định một phần hoặc gạt đi kết luận ngầm; でもない = "cũng không phải"; ないわけではない = "không phải là không" (= có, nhưng ít). ≠ わけがない (phủ nhận mạnh).' },

    /* ══════ ⑦ わけにはいかない ══════ */
    { t: 'h', text: '⑦ ～わけにはいかない — "không thể… (vì lẽ phải)" · ～ないわけにはいかない — "không thể không…"' },
    {
      t: 'p',
      text: '**Vる ＋ わけにはいかない** = "**không thể** làm V" — về **khả năng** thì làm được, nhưng **lẽ phải, trách nhiệm, đạo lý, quy định, tình nghĩa, hoàn cảnh** không cho phép. **Vない ＋ わけにはいかない** = "**không thể không** làm V" → **buộc phải** làm (dù không muốn). Chủ ngữ thường là **người nói** (hoặc người trong cuộc). Lịch sự: **～わけにはいきません**. **～わけにもいかない** = "**cũng** không thể…" (đã có một khó khăn trước đó). Đây là mẫu **rất hay dùng để từ chối khéo** hoặc **giải thích vì sao mình phải làm**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～わけにはいかない — chỉ ĐỘNG TỪ',
      head: ['Dạng', 'Khuôn', 'Ví dụ', 'Nghĩa', 'Romaji'],
      rows: [
        ['Khẳng định', 'Vる ＋ わけにはいかない', '{休|やす}む**わけにはいかない**', 'không thể nghỉ', 'yasumu wake ni wa ikanai'],
        ['Phủ định', 'Vない ＋ わけにはいかない', '{行|い}かない**わけにはいかない**', 'không thể không đi (= phải đi)', 'ikanai wake ni wa ikanai'],
        ['Tiếp diễn', 'Vている ＋ わけにはいかない', 'いつまでも{待|ま}っている**わけにはいかない**', 'không thể cứ chờ mãi', 'itsu made mo matte iru wake ni wa ikanai'],
        ['"Cũng"', 'Vる／Vない ＋ わけにもいかない', '{断|ことわ}る**わけにもいかない**', 'cũng không thể từ chối', 'kotowaru wake ni mo ikanai'],
        ['Lịch sự', '～わけにはいきません', 'お{金|かね}を{受|う}け{取|と}る**わけにはいきません**', 'tôi không thể nhận tiền', 'okane o uketoru wake ni wa ikimasen'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ "Không thể / phải" — sáu cách nói, sáu lý do khác nhau',
      head: ['Mẫu', 'Vì sao "không / phải"', 'Ví dụ', 'Romaji'],
      rows: [
        ['V{可能形|かのうけい}ない (Bài 16)', 'KHÔNG CÓ KHẢ NĂNG (sức, kỹ năng, điều kiện vật lý)', '{足|あし}が{痛|いた}くて{歩|ある}けない。', 'Ashi ga itakute arukenai.'],
        ['Vるわけにはいかない', 'LÀM ĐƯỢC nhưng LẼ PHẢI không cho', '{明日|あした}は{試験|しけん}だから、{遊|あそ}びに{行|い}くわけにはいかない。', 'Ashita wa shiken da kara, asobi ni iku wake ni wa ikanai.'],
        ['Vてはいけない', 'BỊ CẤM (quy định, người khác cấm)', 'ここでたばこを{吸|す}ってはいけない。', 'Koko de tabako o sutte wa ikenai.'],
        ['Vなければならない', 'NGHĨA VỤ chung (luật, lịch, quy tắc)', '{毎月|まいつき}{家賃|やちん}を{払|はら}わなければならない。', 'Maitsuki yachin o harawanakereba naranai.'],
        ['Vないわけにはいかない', 'TÌNH THẾ / ĐẠO LÝ buộc (không làm thì không phải)', '{先輩|せんぱい}の{結婚式|けっこんしき}だから、{行|い}かないわけにはいかない。', 'Senpai no kekkonshiki da kara, ikanai wake ni wa ikanai.'],
        ['Vざるを{得|え}ない (N2 — Bài 45)', 'KHÔNG CÒN CÁCH NÀO KHÁC, đành phải (không muốn) — văn viết', '{台風|たいふう}で、{旅行|りょこう}を{中止|ちゅうし}せざるを{得|え}なかった。', 'Taifuu de, ryokou o chuushi sezaru o enakatta.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［lý do / bổn phận］から、Vるわけにはいかない',
          vi: '"**Không thể** …" — vế trước nêu **lý do đạo lý / trách nhiệm**. Hay dùng để **từ chối khéo** lời mời, lời nhờ.',
          examples: [
            E('{熱|ねつ}っぽいけど、{今日|きょう}は{試験|しけん}だから{休|やす}むわけにはいかない。', 'Netsuppoi kedo, kyou wa shiken da kara yasumu wake ni wa ikanai.', 'Hơi sốt nhưng hôm nay thi nên không thể nghỉ.'),
            E('{明日|あした}は{朝|あさ}から{運転|うんてん}するので、お{酒|さけ}を{飲|の}むわけにはいきません。', 'Ashita wa asa kara unten suru node, osake o nomu wake ni wa ikimasen.', 'Mai tôi lái xe từ sáng nên không thể uống rượu được.'),
            E('これは{友達|ともだち}との{約束|やくそく}なので、{誰|だれ}にも{話|はな}すわけにはいかないんです。', 'Kore wa tomodachi to no yakusoku na node, dare ni mo hanasu wake ni wa ikanai n desu.', 'Đây là lời hứa với bạn nên tôi không thể kể với ai.'),
            E('{店長|てんちょう}が{困|こま}っているのに、{断|ことわ}るわけにはいかない。', 'Tenchou ga komatte iru noni, kotowaru wake ni wa ikanai.', 'Anh chủ đang khó khăn mà mình lại từ chối thì không được. (hội thoại ③)'),
            E('こんな{高|たか}い{物|もの}を、ただでもらうわけにはいきません。', 'Konna takai mono o, tada de morau wake ni wa ikimasen.', 'Món đắt thế này tôi không thể nhận không được.'),
          ],
        },
        {
          formula: 'Vないわけにはいかない — "không thể không…, buộc phải…"',
          vi: 'Phủ định kép → **phải làm**. Người nói thường **không thích lắm**, nhưng **tình nghĩa, trách nhiệm, phép lịch sự** bắt buộc.',
          examples: [
            E('{部長|ぶちょう}に{誘|さそ}われたら、{行|い}かないわけにはいかないよね。', 'Buchou ni sasowaretara, ikanai wake ni wa ikanai yo ne.', 'Được trưởng phòng mời thì không thể không đi nhỉ.'),
            E('お{金|かね}が{入|はい}っている{以上|いじょう}、{交番|こうばん}に{届|とど}けないわけにはいかない。', 'Okane ga haitte iru ijou, kouban ni todokenai wake ni wa ikanai.', 'Đã có tiền ở trong thì không thể không nộp đồn. (hội thoại ③)'),
            E('{自分|じぶん}のミスだから、{謝|あやま}らないわけにはいきません。', 'Jibun no misu da kara, ayamaranai wake ni wa ikimasen.', 'Là lỗi của mình nên không thể không xin lỗi.'),
            E('{子|こ}どもが{熱|ねつ}を{出|だ}したので、{会社|かいしゃ}を{休|やす}まないわけにはいかなかった。', 'Kodomo ga netsu o dashita node, kaisha o yasumanai wake ni wa ikanakatta.', 'Con bị sốt nên tôi đã buộc phải nghỉ làm. (quá khứ: いかなかった)'),
          ],
        },
        {
          formula: '～わけにもいかない — "cũng không thể…" (bế tắc)',
          vi: 'Đã có một khó khăn, và cách giải quyết thứ hai **cũng** không được → người nói **khó xử**. Thường đi theo cặp: "A cũng không được, B cũng không được".',
          examples: [
            E('{嫌|いや}な{仕事|しごと}だけど、{今更|いまさら}やめるわけにもいかない。', 'Iya na shigoto da kedo, imasara yameru wake ni mo ikanai.', 'Là việc mình không thích, nhưng đến giờ này cũng không thể bỏ. ({今更|いまさら} = đến nước này — N2)'),
            E('{先生|せんせい}に{聞|き}きたいけど、{夜|よる}の{十時|じゅうじ}に{電話|でんわ}するわけにもいかないし……。', 'Sensei ni kikitai kedo, yoru no juuji ni denwa suru wake ni mo ikanai shi…….', 'Muốn hỏi thầy, nhưng 10 giờ đêm cũng không thể gọi điện…'),
            E('{友達|ともだち}の{料理|りょうり}はまずかったが、{残|のこ}すわけにもいかず、{全部|ぜんぶ}{食|た}べた。', 'Tomodachi no ryouri wa mazukatta ga, nokosu wake ni mo ikazu, zenbu tabeta.', 'Món bạn nấu dở, nhưng cũng không thể để thừa, nên ăn hết. (～ず = ～ないで — văn viết)'),
          ],
        },
      ],
    },
    DL('Hỏi – đáp với ～わけにはいかない', [
      ['{本田先生|ほんだせんせい}', 'examiner', 'ダニエルさん、{顔|かお}が{赤|あか}いですよ。{大丈夫|だいじょうぶ}ですか。', 'Danieru-san, kao ga akai desu yo. Daijoubu desu ka.', 'Daniel, mặt em đỏ đấy. Em có sao không?'],
      ['ダニエル', 'b', '{朝|あさ}から{熱|ねつ}っぽいんです。でも、{今日|きょう}は{中間|ちゅうかん}テストなので、{休|やす}むわけにはいかないと{思|おも}って……。', 'Asa kara netsuppoi n desu. Demo, kyou wa chuukan tesuto na node, yasumu wake ni wa ikanai to omotte…….', 'Từ sáng em thấy hơi sốt ạ. Nhưng hôm nay là bài kiểm tra giữa kỳ nên em nghĩ không thể nghỉ được…'],
      ['{本田先生|ほんだせんせい}', 'examiner', '{熱|ねつ}がある{学生|がくせい}に、テストを{受|う}けさせるわけにはいきません。{後|あと}で{受|う}けられますから、{保健室|ほけんしつ}に{行|い}ってください。', 'Netsu ga aru gakusei ni, tesuto o ukesaseru wake ni wa ikimasen. Ato de ukeraremasu kara, hokenshitsu ni itte kudasai.', 'Tôi không thể để sinh viên đang sốt làm bài kiểm tra được. Em làm bù sau cũng được, hãy xuống phòng y tế đi.'],
      ['ダニエル', 'b', 'ありがとうございます。じゃ、{行|い}ってきます。', 'Arigatou gozaimasu. Ja, itte kimasu.', 'Em cảm ơn thầy. Vậy em đi đây ạ.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — ［lý do］から、～わけにはいかない',
      head: ['Lý do', 'Không thể / buộc phải', 'Câu', 'Romaji'],
      rows: [
        ['{明日|あした}{大事|だいじ}な{発表|はっぴょう}がある', '{遊|あそ}びに{行|い}く', '{大事|だいじ}な{発表|はっぴょう}があるから、{遊|あそ}びに{行|い}くわけにはいかない。', 'Daiji na happyou ga aru kara, asobi ni iku wake ni wa ikanai.'],
        ['{車|くるま}で{来|き}た', 'お{酒|さけ}を{飲|の}む', '{車|くるま}で{来|き}たから、お{酒|さけ}を{飲|の}むわけにはいかない。', 'Kuruma de kita kara, osake o nomu wake ni wa ikanai.'],
        ['{約束|やくそく}した', '{秘密|ひみつ}を{話|はな}す', '{約束|やくそく}したから、{秘密|ひみつ}を{話|はな}すわけにはいかない。', 'Yakusoku shita kara, himitsu o hanasu wake ni wa ikanai.'],
        ['{先生|せんせい}に{頼|たの}まれた', '{引|ひ}き{受|う}けない', '{先生|せんせい}に{頼|たの}まれたから、{引|ひ}き{受|う}けないわけにはいかない。', 'Sensei ni tanomareta kara, hikiukenai wake ni wa ikanai.'],
        ['{自分|じぶん}が{壊|こわ}した', '{弁償|べんしょう}しない', '{自分|じぶん}が{壊|こわ}したから、{弁償|べんしょう}しないわけにはいかない。', 'Jibun ga kowashita kara, benshou shinai wake ni wa ikanai.'],
        ['みんなが{待|ま}っている', 'これ{以上|いじょう}{遅|おく}れる', 'みんなが{待|ま}っているから、これ{以上|いじょう}{遅|おく}れるわけにはいかない。', 'Minna ga matte iru kara, kore ijou okureru wake ni wa ikanai.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～わけにはいかない',
      items: [
        '~~{足|あし}を{怪我|けが}して、{歩|ある}くわけにはいかない~~ → **{歩|ある}けない** — không có **khả năng** thể chất thì dùng thể khả năng. わけにはいかない chỉ dùng khi **làm được** nhưng **không nên / không được phép theo lẽ phải**.',
        '~~{休|やす}みのわけにはいかない~~ / ~~{簡単|かんたん}なわけにはいかない~~ → chỉ **động từ**: **{休|やす}むわけにはいかない** / **{休|やす}みにするわけにはいかない**.',
        'Hiểu nhầm **Vないわけにはいかない** thành "không thể làm" — SAI. Phủ định kép = **phải làm**: {行|い}かないわけにはいかない = **phải đi**.',
        'Dùng わけにはいかない cho **người khác** nghe như ra lệnh: ~~あなたは{休|やす}むわけにはいかない~~ → nói về người khác thì **～てはいけない／～ないでください**. (Trừ khi người nói là người có trách nhiệm: {先生|せんせい}が「{受|う}けさせるわけにはいきません」 — chủ ngữ vẫn là chính thầy.)',
        'Nhận ra **～ざるを{得|え}ない** (N2 — Bài 45 học kỹ): **Vない bỏ ない ＋ ざるを{得|え}ない**, **する → せざるを{得|え}ない**, **{行|い}く → {行|い}かざるを{得|え}ない**. Nghĩa gần **Vないわけにはいかない** nhưng nhấn "**đành**, không còn lựa chọn nào", giọng **văn viết, trang trọng**.',
      ],
    },
    { t: 'rule', formula: 'Vる ＋ わけにはいかない（không thể — vì lẽ phải） · Vない ＋ わけにはいかない（không thể không = phải） · ～わけにもいかない（cũng không thể）', vi: 'Về khả năng thì làm được, nhưng lẽ phải / trách nhiệm / tình nghĩa không cho phép (hoặc bắt buộc). ≠ Vられない (không có khả năng). Nhận ra: Vざるを得ない (N2) = đành phải.' },

    /* ══════ ⑧ BẢNG PHÂN BIỆT ══════ */
    { t: 'h', text: '⑧ Bảng phân biệt — thang chắc chắn · はずがない ↔ わけがない · わけだ ↔ はずだ · "nhà わけ" · わけにはいかない ↔ ざるを得ない' },
    {
      t: 'p',
      text: 'Đề N3 phần 文法 hỏi nhóm này theo hai kiểu: **(1) chọn mẫu theo ĐỘ CHẮC CHẮN** (có căn cứ không? tin chắc hay chỉ đoán? khẳng định hay phủ nhận?) và **(2) chọn đúng thành viên "nhà わけ"** — bốn mẫu わけ trông gần giống nhau nhưng nghĩa khác hẳn. Học thuộc năm bảng dưới đây, rồi làm phần luyện tổng hợp.',
    },
    {
      t: 'table',
      caption: '⭐ BẢNG 1 — Thang chắc chắn (cùng một câu hỏi: "Chìa khoá ở đâu?")',
      head: ['Độ chắc', 'Mẫu', 'Dựa vào', 'Phó từ hay đi kèm', 'Câu', 'Romaji'],
      rows: [
        ['~90% ĐÚNG', '～に{違|ちが}いない (①)', 'cảm giác, dấu hiệu — CHỦ QUAN', 'きっと', '{鍵|かぎ}はきっとかばんの{中|なか}にあるに{違|ちが}いない。', 'Kagi wa kitto kaban no naka ni aru ni chigainai.'],
        ['~90% ĐÚNG', '～はずだ (Bài 20)', 'căn cứ KHÁCH QUAN (lịch, quy luật, điều đã làm)', '～から／～なら', '{朝|あさ}{入|い}れたから、かばんの{中|なか}にあるはずだ。', 'Asa ireta kara, kaban no naka ni aru hazu da.'],
        ['~70%', '～だろう／でしょう', 'dự đoán chung', 'たぶん・{恐|おそ}らく', '{鍵|かぎ}はたぶんかばんの{中|なか}にあるだろう。', 'Kagi wa tabun kaban no naka ni aru darou.'],
        ['~60–70%', '～ようだ／みたいだ／らしい (Bài 20)', 'dấu hiệu mắt thấy / tin nghe được', 'どうやら・どうも', 'どうやら、かばんの{中|なか}にあるようだ。', 'Douyara, kaban no naka ni aru you da.'],
        ['~30–50%', '～かもしれない (Bài 20)', 'một khả năng, không căn cứ chắc', 'もしかすると・もしかしたら', 'もしかすると、かばんの{中|なか}にあるかもしれない。', 'Moshika suru to, kaban no naka ni aru kamo shirenai.'],
        ['~10%', '～ないだろう · ～ないはずだ', 'dự đoán phủ định', 'たぶん', 'かばんの{中|なか}にはないだろう。', 'Kaban no naka ni wa nai darou.'],
        ['~0%', '～はずがない (②)', 'căn cứ — BÁC BỎ', '（～から）', '{全部|ぜんぶ}{出|だ}して{見|み}たから、かばんの{中|なか}にあるはずがない。', 'Zenbu dashite mita kara, kaban no naka ni aru hazu ga nai.'],
        ['~0%', '～わけがない (③)', 'lẽ thường, cảm xúc — PHỦ NHẬN mạnh', 'まさか・こんな', 'まさか、そんな{所|ところ}にあるわけがない。', 'Masaka, sonna tokoro ni aru wake ga nai.'],
      ],
    },
    {
      t: 'note',
      title: 'Ba câu hỏi để chọn mẫu khi làm đề',
      items: [
        '**① Khẳng định hay phủ nhận?** — Phủ nhận gần 100% → **はずがない／わけがない**. Khẳng định → đi tiếp câu ②.',
        '**② Chắc đến mức nào?** — Tin chắc (~90%) → **に{違|ちが}いない／はずだ**. Chỉ đoán (~70%) → **だろう** (+ たぶん／{恐|おそ}らく). Có thể thôi (~50%) → **かもしれない** (+ もしかすると). Phó từ trong câu là **manh mối số 1**: きっと → に違いない; たぶん → だろう; もしかすると → かもしれない; まさか → わけがない.',
        '**③ Có căn cứ khách quan không?** — Có (lịch, quy luật, ghi chép, điều mình đã làm) → **はずだ／はずがない**. Không, chỉ cảm giác / lẽ thường → **に{違|ちが}いない／わけがない**. Câu văn viết, độc thoại, tiểu thuyết → に違いない rất tự nhiên.',
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG 2 — はずがない ↔ わけがない ↔ ないはずだ ↔ ないに違いない',
      head: ['Mẫu', 'Sắc thái', 'Nói / viết', 'Ví dụ', 'Romaji'],
      rows: [
        ['～はずがない', 'bác bỏ có CĂN CỨ — logic, khách quan', 'cả hai', '{今日|きょう}は{祝日|しゅくじつ}だから、{会議|かいぎ}があるはずがない。', 'Kyou wa shukujitsu da kara, kaigi ga aru hazu ga nai.'],
        ['～わけがない', 'phủ nhận CHỦ QUAN — lẽ thường, tính cách, cảm xúc mạnh (ngạc nhiên, bực)', 'văn nói nhiều (～わけない)', 'あんなに{真面目|まじめ}な{人|ひと}が、うそをつくわけがない。', 'Anna ni majime na hito ga, uso o tsuku wake ga nai.'],
        ['～ないはずだ (Bài 20)', 'dự đoán "chắc là không" — mềm, bình thường', 'cả hai', '{彼|かれ}は{出張中|しゅっちょうちゅう}だから、{来|こ}ないはずだ。', 'Kare wa shucchouchuu da kara, konai hazu da.'],
        ['～ないに{違|ちが}いない', 'tin chắc "không" — chủ quan', 'văn viết', '{彼|かれ}はこのことをまだ{知|し}らないに{違|ちが}いない。', 'Kare wa kono koto o mada shiranai ni chigainai.'],
        ['Thay được cho nhau?', 'Phần lớn câu dùng はずがない cũng nói được わけがない (và ngược lại). Chọn はずがない khi câu NÊU CĂN CỨ rõ; chọn わけがない khi có まさか／なんか／こんな… và giọng cảm xúc.', '', '', ''],
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG 3 — わけだ ↔ はずだ: khi nào thay được, khi nào không',
      head: ['Cách dùng', 'わけだ', 'はずだ', 'Ví dụ', 'Romaji'],
      rows: [
        ['"Thảo nào" — đã biết lý do', '○', '○', '{窓|まど}が{開|あ}いていた。{寒|さむ}い**わけだ**／{寒|さむ}い**はずだ**。', 'Mado ga aite ita. Samui wake da / samui hazu da.'],
        ['DỰ ĐOÁN (chưa xảy ra / chưa biết)', '✗', '○', '{九時|くじ}に{出|で}たから、もうすぐ{着|つ}く**はずだ**。(~~{着|つ}くわけだ~~)', 'Kuji ni deta kara, mou sugu tsuku hazu da.'],
        ['"Tức là" — tính toán, nói lại', '○', '✗', '{週|しゅう}に{三回|さんかい}、{四時間|よじかん}ずつ。つまり{十二時間|じゅうにじかん}{働|はたら}く**わけだ**。', 'Shuu ni sankai, yojikan zutsu. Tsumari juunijikan hataraku wake da.'],
        ['"Lẽ ra" — trái với thực tế', '✗', '○', '{来|く}る**はずだった**のに、{来|こ}なかった。(~~{来|く}るわけだったのに~~)', 'Kuru hazu datta noni, konakatta.'],
        ['Giải thích kết quả của mình', '○ (～わけです)', '✗', '{父|ちち}が{日本人|にほんじん}なので、{日本語|にほんご}が{話|はな}せる**わけです**。', 'Chichi ga nihonjin na node, nihongo ga hanaseru wake desu.'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG 4 — "Nhà わけ" (cùng từ わけ = lý do) — bốn người anh em, bốn nghĩa',
      head: ['Mẫu', 'Nghĩa gốc ("lý do…")', 'Nghĩa dùng', 'Ví dụ', 'Romaji'],
      rows: [
        ['～わけだ (⑤)', 'CÓ lý do để… → tự nhiên là', 'thảo nào / tức là', 'だから{上手|じょうず}な**わけだ**。', 'Dakara jouzu na wake da.'],
        ['～わけがない (③)', 'KHÔNG CÓ lý do nào để…', 'làm gì có chuyện (≈ 0%)', '{彼|かれ}が{上手|じょうず}な**わけがない**。', 'Kare ga jouzu na wake ga nai.'],
        ['～わけではない (⑥)', 'KHÔNG PHẢI (vì) lý do đó', 'không hẳn là (phủ định một phần)', '{上手|じょうず}な**わけではない**。', 'Jouzu na wake de wa nai.'],
        ['～ないわけではない (⑥)', 'không phải KHÔNG có', 'cũng có… (nhưng ít)', '{分|わ}からない**わけではない**。', 'Wakaranai wake de wa nai.'],
        ['～わけにはいかない (⑦)', 'không có "lẽ" nào cho phép làm', 'không thể (vì lẽ phải)', '{休|やす}む**わけにはいかない**。', 'Yasumu wake ni wa ikanai.'],
        ['～ないわけにはいかない (⑦)', 'không có "lẽ" nào cho phép KHÔNG làm', 'buộc phải', '{行|い}かない**わけにはいかない**。', 'Ikanai wake ni wa ikanai.'],
        ['わけない (đứng riêng)', '"không có khó khăn gì"', 'dễ ợt (khác hẳn!)', 'こんな{仕事|しごと}、**わけない**よ。', 'Konna shigoto, wake nai yo.'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{彼女|かのじょ}が{怒|おこ}るわけだ。{約束|やくそく}を{三回|さんかい}も{忘|わす}れたんだから。', 'Kanojo ga okoru wake da. Yakusoku o sankai mo wasureta n da kara.', 'Thảo nào cô ấy giận. Quên hẹn những ba lần cơ mà. (わけだ)'),
        E('あの{優|やさ}しい{彼女|かのじょ}が{怒|おこ}るわけがない。', 'Ano yasashii kanojo ga okoru wake ga nai.', 'Cô ấy hiền thế làm gì có chuyện giận. (わけがない)'),
        E('{怒|おこ}っているわけではない。{少|すこ}し{疲|つか}れているだけだ。', 'Okotte iru wake de wa nai. Sukoshi tsukarete iru dake da.', 'Không phải là đang giận. Chỉ hơi mệt thôi. (わけではない)'),
        E('{怒|おこ}らないわけではないが、めったに{怒|おこ}らない。', 'Okoranai wake de wa nai ga, metta ni okoranai.', 'Không phải là không bao giờ giận, nhưng hiếm khi giận. (ないわけではない)'),
        E('お{客|きゃく}さんの{前|まえ}で{怒|おこ}るわけにはいかない。', 'Okyaku-san no mae de okoru wake ni wa ikanai.', 'Không thể nổi giận trước mặt khách. (わけにはいかない)'),
        E('{子|こ}どもが{危|あぶ}ないことをしたら、{怒|おこ}らないわけにはいかない。', 'Kodomo ga abunai koto o shitara, okoranai wake ni wa ikanai.', 'Trẻ con làm điều nguy hiểm thì không thể không mắng. (ないわけにはいかない)'),
      ],
    },
    {
      t: 'table',
      caption: 'BẢNG 5 — Nhận ra (N2/N1): ～ざるを得ない · ～に相違ない · ～っこない',
      head: ['Mẫu', 'Cách nối', 'Nghĩa ≈ mẫu của bài', 'Ví dụ', 'Romaji'],
      rows: [
        ['～ざるを{得|え}ない (N2 — Bài 45)', 'Vない bỏ ない ＋ ざるを{得|え}ない · する → **せ**ざるを{得|え}ない · {来|く}る → **{来|こ}**ざるを{得|え}ない', '≈ Vないわけにはいかない — "đành phải" (không còn cách nào), văn viết', '{雨|あめ}がひどいので、{試合|しあい}は{中止|ちゅうし}せざるを{得|え}ない。', 'Ame ga hidoi node, shiai wa chuushi sezaru o enai.'],
        ['～に{相違|そうい}ない (N1)', 'như に{違|ちが}いない', '= に{違|ちが}いない, rất trang trọng (văn bản, phát biểu)', 'これは{彼|かれ}の{字|じ}に{相違|そうい}ない。', 'Kore wa kare no ji ni soui nai.'],
        ['～っこない (N2)', 'Vます ＋ っこない', '= わけがない, rất thân mật', 'そんなこと、できっこないよ。', 'Sonna koto, dekikkonai yo.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ ⑧ — bẫy đề hay gặp',
      items: [
        '**きっと ～かもしれない** ~~sai~~ — きっと (chắc) không đi với かもしれない (có thể). **たぶん ～に{違|ちが}いない** cũng lệch — chọn だろう. **まさか ～に{違|ちが}いない** sai — まさか đi với phủ định (わけがない／ないだろう).',
        '**{知|し}らないはずがない ／ {知|し}らないわけがない** = chắc chắn **CÓ** biết · **{知|し}らないわけではない** = **có** biết (một chút) · **{知|し}らないわけにはいかない** = **phải** biết. Ba câu phủ định kép, ba sắc thái — đọc từng chữ.',
        '**わけではない ↔ わけがない** — một bên "không hẳn" (nhẹ), một bên "làm gì có" (mạnh). Câu có **{必|かなら}ずしも／{全部|ぜんぶ}／いつも** → わけではない. Câu có **まさか／こんな** → わけがない.',
        '**わけにはいかない ↔ Vられない** — có khả năng mà không được làm → わけにはいかない; không có khả năng → Vられない. Đề hay cho "{熱|ねつ}があるが、{試験|しけん}だから{休|やす}む（　）" → わけにはいかない.',
      ],
    },

    /* ══════ LUYỆN TỔNG HỢP ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, điền dạng đúng, sửa câu, trắc nghiệm kiểu đề N3' },
    {
      t: 'build',
      id: 'b31-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Chắc chắn thủ phạm là người đàn ông đó.', chips: ['{犯人|はんにん}は', 'あの{男|おとこ}', 'に', '{違|ちが}いない', 'の', 'はずがない'], answer: ['{犯人|はんにん}は', 'あの{男|おとこ}', 'に', '{違|ちが}いない'], ro: 'Hannin wa ano otoko ni chigainai.' },
        { vi: 'Đèn đã tắt nên chắc chắn chị ấy ngủ rồi.', chips: ['{電気|でんき}が', '{消|き}えているから', 'もう{寝|ね}ている', 'に{違|ちが}いない', 'わけにはいかない', 'っぽい'], answer: ['{電気|でんき}が', '{消|き}えているから', 'もう{寝|ね}ている', 'に{違|ちが}いない'], ro: 'Denki ga kiete iru kara mou nete iru ni chigainai.' },
        { vi: 'Đã khoá cửa rồi nên không lẽ nào trộm vào được.', chips: ['{鍵|かぎ}を', 'かけたから', '{泥棒|どろぼう}が', '{入|はい}る', 'はずがない', 'わけだ'], answer: ['{鍵|かぎ}を', 'かけたから', '{泥棒|どろぼう}が', '{入|はい}る', 'はずがない'], ro: 'Kagi o kaketa kara dorobou ga hairu hazu ga nai.' },
        { vi: 'Không lẽ nào anh ấy là thủ phạm.', chips: ['{彼|かれ}が', '{犯人|はんにん}の', 'はずが', 'ない', '{犯人|はんにん}な', 'ある'], answer: ['{彼|かれ}が', '{犯人|はんにん}の', 'はずが', 'ない'], ro: 'Kare ga hannin no hazu ga nai.' },
        { vi: 'Bài khó thế này làm gì có chuyện giải được trong một ngày.', chips: ['こんな{難|むずか}しい{問題|もんだい}', '{一日|いちにち}で', '{解|と}ける', 'わけがない', 'わけだ', 'に{違|ちが}いない'], answer: ['こんな{難|むずか}しい{問題|もんだい}', '{一日|いちにち}で', '{解|と}ける', 'わけがない'], ro: 'Konna muzukashii mondai ichinichi de tokeru wake ga nai.' },
        { vi: 'Thủ phạm mặc áo khoác ngả trắng.', chips: ['{犯人|はんにん}は', '{白|しろ}っぽい', 'コートを', '{着|き}ていた', '{白|しろ}いっぽい', 'らしい'], answer: ['{犯人|はんにん}は', '{白|しろ}っぽい', 'コートを', '{着|き}ていた'], ro: 'Hannin wa shiroppoi kooto o kite ita.' },
        { vi: 'Dạo này tôi hay quên, thường làm mất chìa khoá.', chips: ['{最近|さいきん}', '{忘|わす}れっぽくて', '{鍵|かぎ}を', 'よくなくします', '{忘|わす}れるっぽくて'], answer: ['{最近|さいきん}', '{忘|わす}れっぽくて', '{鍵|かぎ}を', 'よくなくします'], ro: 'Saikin wasureppokute kagi o yoku nakushimasu.' },
        { vi: 'Cửa sổ đã mở. Thảo nào lạnh.', chips: ['{窓|まど}が', '{開|あ}いていた', 'だから', '{寒|さむ}い', 'わけだ', 'はずがない'], answer: ['{窓|まど}が', '{開|あ}いていた', 'だから', '{寒|さむ}い', 'わけだ'], ro: 'Mado ga aite ita. Dakara samui wake da.' },
        { vi: 'Tức là một tuần học mười tiếng.', chips: ['つまり', '{一週間|いっしゅうかん}に', '{十時間|じゅうじかん}', '{勉強|べんきょう}する', 'わけだ', 'わけではない'], answer: ['つまり', '{一週間|いっしゅうかん}に', '{十時間|じゅうじかん}', '{勉強|べんきょう}する', 'わけだ'], ro: 'Tsumari isshuukan ni juujikan benkyou suru wake da.' },
        { vi: 'Không phải là tôi ghét cá.', chips: ['{魚|さかな}が', '{嫌|きら}いな', 'わけでは', 'ありません', '{嫌|きら}い', 'わけが'], answer: ['{魚|さかな}が', '{嫌|きら}いな', 'わけでは', 'ありません'], ro: 'Sakana ga kirai na wake de wa arimasen.' },
        { vi: 'Đồ đắt không nhất thiết là đồ tốt.', chips: ['{高|たか}い{物|もの}が', '{必|かなら}ずしも', 'いい{物|もの}だ', 'という', 'わけではない', 'わけがない'], answer: ['{高|たか}い{物|もの}が', '{必|かなら}ずしも', 'いい{物|もの}だ', 'という', 'わけではない'], ro: 'Takai mono ga kanarazushimo ii mono da to iu wake de wa nai.' },
        { vi: 'Mai thi nên tối nay không thể đi chơi.', chips: ['{明日|あした}は{試験|しけん}だから', '{今夜|こんや}は', '{遊|あそ}びに{行|い}く', 'わけには', 'いかない', 'わけでは'], answer: ['{明日|あした}は{試験|しけん}だから', '{今夜|こんや}は', '{遊|あそ}びに{行|い}く', 'わけには', 'いかない'], ro: "Ashita wa shiken da kara kon'ya wa asobi ni iku wake ni wa ikanai." },
      ],
    },
    {
      t: 'quiz',
      id: 'b31-np-dien',
      title: 'Điền dạng đúng — chia từ trong ngoặc cho hợp mẫu (12 câu)',
      kind: 'fill',
      grammar: 'に違いない: ナA・N TRẦN · はず／わけ: ナAな・Nの · っぽい: N / イA bỏ い / Vます · わけにはいかない: chỉ Vる／Vない',
      items: [
        { q: '{犯人|はんにん}は（あの{男|おとこ}）に{違|ちが}いない。', answers: V('あの{男|おとこ}'), hint: 'N đứng trần — không の' },
        { q: '{夜|よる}の{図書館|としょかん}は（{静|しず}か）に{違|ちが}いない。', answers: V('{静|しず}か'), hint: 'ナA trần — không な' },
        { q: '{今日|きょう}は{月曜日|げつようび}だから、{銀行|ぎんこう}が（{休|やす}み）はずがない。', answers: V('{休|やす}みの'), hint: 'N ＋ の' },
        { q: '{試験|しけん}の{前|まえ}だから、{学生|がくせい}が（{暇|ひま}）はずがない。', answers: V('{暇|ひま}な'), hint: 'ナA ＋ な' },
        { q: '{三日|みっか}も{寝|ね}ていないのだから、（{元気|げんき}）わけがない。', answers: V('{元気|げんき}な'), hint: 'ナA ＋ な' },
        { q: 'このかばんは{高|たか}いのに、（{安|やす}い）っぽく{見|み}える。', answers: V('{安|やす}'), hint: 'イA bỏ い' },
        { q: '{祖母|そぼ}は{最近|さいきん}（{忘|わす}れる）っぽくなった。', answers: V('{忘|わす}れ'), hint: 'Vます bỏ ます' },
        { q: 'エアコンが{壊|こわ}れているのか。だから{部屋|へや}が（{寒|さむ}い）わけだ。', answers: V('{寒|さむ}い'), hint: 'イA giữ nguyên' },
        { q: 'アメリカで{育|そだ}ったのか。{道理|どうり}で{英語|えいご}が（{上手|じょうず}）わけだ。', answers: V('{上手|じょうず}な'), hint: 'ナA ＋ な' },
        { q: '{肉|にく}が（{嫌|きら}い）わけではないが、{今日|きょう}は{魚|さかな}にする。', answers: V('{嫌|きら}いな'), hint: 'ナA ＋ な' },
        { q: '{先輩|せんぱい}に{頼|たの}まれたから、（{手伝|てつだ}う→phủ định）わけにはいかない。', answers: V('{手伝|てつだ}わない'), hint: 'てつだわない (Vない)' },
        { q: '{子|こ}どもが{熱|ねつ}を{出|だ}したので、{会社|かいしゃ}を（{休|やす}む→phủ định）わけにはいかなかった。', answers: V('{休|やす}まない'), hint: 'やすまない (Vない)' },
      ],
    },
    {
      t: 'quiz',
      id: 'b31-np-sua',
      title: 'Sửa câu sai — viết lại câu đúng (8 câu)',
      kind: 'translate',
      grammar: 'Kiểm tra: nối (に違いない trần · はず／わけ: な／の) · っぽい là イA · わけにはいかない ≠ không có khả năng · わけだ ≠ dự đoán · わけではない ≠ わけがない',
      items: [
        { q: '✗ {彼|かれ}は{犯人|はんにん}のに{違|ちが}いない。', answers: V('{彼|かれ}は{犯人|はんにん}に{違|ちが}いない。', '{彼|かれ}が{犯人|はんにん}に{違|ちが}いない。'), hint: 'N trần ＋ に違いない' },
        { q: '✗ {夜|よる}の{公園|こうえん}は{静|しず}かなに{違|ちが}いない。', answers: V('{夜|よる}の{公園|こうえん}は{静|しず}かに{違|ちが}いない。'), hint: 'ナA trần' },
        { q: '✗ {今日|きょう}は{水曜日|すいようび}だから、{図書館|としょかん}が{休|やす}みはずがない。', answers: V('{今日|きょう}は{水曜日|すいようび}だから、{図書館|としょかん}が{休|やす}みのはずがない。'), hint: 'N ＋ の ＋ はず' },
        { q: '✗ このかばんは{安|やす}いっぽい。', answers: V('このかばんは{安|やす}っぽい。'), hint: 'イA bỏ い ＋ っぽい' },
        { q: '✗ {姉|あね}は{子|こ}どもっぽいな{服|ふく}が{好|す}きだ。', answers: V('{姉|あね}は{子|こ}どもっぽい{服|ふく}が{好|す}きだ。'), hint: 'っぽい là tính từ い — không な' },
        { q: '✗ {足|あし}をけがして、{歩|ある}くわけにはいかない。（không đi được vì đau）', answers: V('{足|あし}をけがして、{歩|ある}けない。', '{足|あし}をけがして、{歩|ある}けません。'), hint: 'không có khả năng → thể khả năng' },
        { q: '✗ （chỉ đoán）{明日|あした}は{雨|あめ}が{降|ふ}るわけだ。', answers: V('{明日|あした}は{雨|あめ}が{降|ふ}るだろう。', '{明日|あした}は{雨|あめ}が{降|ふ}るかもしれない。', '{明日|あした}は{雨|あめ}が{降|ふ}るでしょう。'), hint: 'dự đoán → だろう／かもしれない' },
        { q: '✗ （ý: không phải ngày nào cũng）{毎日|まいにち}{自炊|じすい}しているわけがない。{忙|いそが}しい{日|ひ}はコンビニで{買|か}う。', answers: V('{毎日|まいにち}{自炊|じすい}しているわけではない。{忙|いそが}しい{日|ひ}はコンビニで{買|か}う。', '{毎日|まいにち}{自炊|じすい}しているわけではありません。{忙|いそが}しい{日|ひ}はコンビニで{買|か}います。'), hint: 'phủ định một phần → わけではない' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-np-jlpt',
      title: '文法 — kiểu đề N3: 文法形式の判断 (12 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: '{部屋|へや}の{電気|でんき}がついているから、ルームメイトはもう{帰|かえ}ってきた（　）。', options: ['はずがない', 'わけにはいかない', 'に{違|ちが}いない', 'っぽい'], correct: 2, why: 'Dấu hiệu (đèn sáng) → tin chắc → **に{違|ちが}いない** (①). はずがない là bác bỏ — ngược nghĩa. 〔Mou kaette kita ni chigainai.〕' },
        { q: '{鍵|かぎ}はちゃんとかばんに{入|い}れたから、なくなる（　）。', options: ['わけだ', 'はずがない', 'に{違|ちが}いない', 'わけではない'], correct: 1, why: 'Có căn cứ (đã bỏ vào cặp) → bác bỏ "mất" → **はずがない** (②). 〔Naku naru hazu ga nai.〕' },
        { q: 'あの{静|しず}かな{木村|きむら}さんが、そんな{大声|おおごえ}で{怒|おこ}る（　）よ。', options: ['わけだ', 'に{違|ちが}いない', 'わけにはいかない', 'わけがない'], correct: 3, why: 'Theo tính cách (lẽ thường) → phủ nhận mạnh → **わけがない** (③). 〔Oogoe de okoru wake ga nai yo.〕' },
        { q: '{兄|あに}は{二十歳|はたち}なのに、{考|かんが}え{方|かた}が{子|こ}ども（　）。', options: ['っぽい', 'らしい', 'そうだ', 'はずだ'], correct: 0, why: 'Người lớn mà GIỐNG trẻ con (chê) → **っぽい** (④). {子|こ}どもらしい = đúng chất trẻ con (khen đứa bé) — sai với なのに. 〔Kangaekata ga kodomoppoi.〕' },
        { q: '「カルロスさん、{毎晩|まいばん}{日本人|にほんじん}のルームメイトと{話|はな}しているんだって。」「だから{日本語|にほんご}が{上手|じょうず}な（　）。」', options: ['はずがない', 'わけだ', 'わけではない', 'わけにはいかない'], correct: 1, why: 'Vừa biết lý do → "thảo nào" → **わけだ** (⑤). 〔Dakara nihongo ga jouzu na wake da.〕' },
        { q: '{一日|いちにち}{三時間|さんじかん}、{週|しゅう}に{四日|よっか}{働|はたら}く。つまり、{一週間|いっしゅうかん}に{十二時間|じゅうにじかん}{働|はたら}く（　）。', options: ['はずだ', 'わけではない', 'わけだ', 'に{違|ちが}いない'], correct: 2, why: '"Tức là" (tính toán, nói lại) → chỉ **わけだ** (⑤ — Bảng 3). はずだ không có nghĩa này. 〔Juunijikan hataraku wake da.〕' },
        { q: '{毎日|まいにち}{料理|りょうり}をしている（　）。{忙|いそが}しい{日|ひ}は{外|そと}で{食|た}べる。', options: ['わけがない', 'わけだ', 'に{違|ちが}いない', 'わけではない'], correct: 3, why: 'Phủ định một phần ("không phải ngày nào cũng") → **わけではない** (⑥). わけがない = làm gì có chuyện — quá mạnh, ngược ý câu sau. 〔Mainichi ryouri o shite iru wake de wa nai.〕' },
        { q: 'お{酒|さけ}は{飲|の}めない（　）が、{今日|きょう}は{車|くるま}なので{遠慮|えんりょ}します。', options: ['わけがない', 'わけではない', 'わけにはいかない', 'に{違|ちが}いない'], correct: 1, why: '"Không phải là không uống được" (có uống được) → **ないわけではない** (⑥). 〔Nomenai wake de wa nai ga…〕' },
        { q: '{明日|あした}は{大事|だいじ}な{試験|しけん}だから、{今夜|こんや}は{遊|あそ}びに{行|い}く（　）。', options: ['わけにはいかない', 'わけではない', 'わけだ', 'に{違|ちが}いない'], correct: 0, why: 'Làm được nhưng lẽ phải không cho → **わけにはいかない** (⑦). 〔Asobi ni iku wake ni wa ikanai.〕' },
        { q: '{夜|よる}の{公園|こうえん}は{静|しず}か（　）に{違|ちが}いない。', options: ['な', 'の', 'だ', '×（không thêm gì）'], correct: 3, why: 'に{違|ちが}いない nhận **ナA trần**: {静|しず}かに{違|ちが}いない (①). Đây là chỗ khác hẳn はず／わけ (ナAな). 〔Shizuka ni chigainai.〕' },
        { q: '{記録|きろく}が{残|のこ}っているので、{彼|かれ}が{犯人|はんにん}（　）はずがない。', options: ['な', 'だ', '×（không thêm gì）', 'の'], correct: 3, why: 'はず là danh từ → **N の** ＋ はずがない (②). 〔Kare ga hannin no hazu ga nai.〕' },
        { q: '「この{指輪|ゆびわ}、{千円|せんえん}だったよ。」「じゃ、{本物|ほんもの}のダイヤの（　）よ。」', options: ['わけにはいかない', 'わけだ', 'わけがない', 'に{違|ちが}いない'], correct: 2, why: 'Một nghìn yên → lẽ thường gạt phắt "kim cương thật" → **わけがない** (③). に{違|ちが}いない không nhận Nの. 〔Honmono no daiya no wake ga nai yo.〕' },
        { q: '★ この{傘|かさ}は ＿＿ ＿＿ ★ ＿＿。（{木村|きむら}さんの／に／{違|ちが}い／ありません）', options: ['{木村|きむら}さんの', 'に', '{違|ちが}い', 'ありません'], correct: 2, why: 'Câu đúng: この{傘|かさ}は **{木村|きむら}さんの に {違|ちが}い ありません** (chắc chắn là của chị Kimura — の = "của"). ★ (thứ 3) = **{違|ちが}い**. 〔Kono kasa wa Kimura-san no ni chigai arimasen.〕' },
        { q: '★ {日本|にほん}に{十年|じゅうねん}も{住|す}んでいる{彼|かれ}が、＿＿ ＿＿ ★ ＿＿。（こんな／{言葉|ことば}を／はずがない／{知|し}らない）', options: ['こんな', '{言葉|ことば}を', 'はずがない', '{知|し}らない'], correct: 3, why: 'Câu đúng: …{彼|かれ}が、**こんな {言葉|ことば}を {知|し}らない はずがない** (không lẽ nào không biết — phủ định kép). ★ (thứ 3) = **{知|し}らない**. 〔Konna kotoba o shiranai hazu ga nai.〕' },
        { q: '★ ジャケットを ＿＿ ★ ＿＿ ＿＿ わけだ。（ロッカーに／{見|み}つからなかった／{入|い}れていたから／{探|さが}しても）', options: ['ロッカーに', '{見|み}つからなかった', '{入|い}れていたから', '{探|さが}しても'], correct: 2, why: 'Câu đúng: ジャケットを **ロッカーに {入|い}れていたから {探|さが}しても {見|み}つからなかった** わけだ. ★ (thứ 2) = **{入|い}れていたから**. 〔Jaketto o rokkaa ni irete ita kara, sagashite mo mitsukaranakatta wake da.〕' },
        { q: '★ {明日|あした}は{大事|だいじ}な ＿＿ ＿＿ ★ ＿＿ いかない。（{休|やす}む／{発表|はっぴょう}があるので／わけには／{授業|じゅぎょう}を）', options: ['{発表|はっぴょう}があるので', 'わけには', '{休|やす}む', '{授業|じゅぎょう}を'], correct: 2, why: 'Câu đúng: {明日|あした}は{大事|だいじ}な **{発表|はっぴょう}があるので {授業|じゅぎょう}を {休|やす}む わけには** いかない. ★ (thứ 3) = **{休|やす}む**. 〔Daiji na happyou ga aru node, jugyou o yasumu wake ni wa ikanai.〕' },
      ],
    },
    {
      t: 'passage',
      title: '文章の文法 — đoạn văn có chỗ trống (kiểu 問題3 đề N3)',
      intro: 'Đọc bài viết ngắn của ナタポン trên {大学新聞|だいがくしんぶん} (báo của trường) rồi chọn từ đúng cho các chỗ (1)–(4) ở câu hỏi bên dưới.',
      paras: [
        { text: '{先週|せんしゅう}、アルバイト{先|さき}の{食堂|しょくどう}で、お{客|きゃく}さんの{財布|さいふ}を{拾|ひろ}いました。{最初|さいしょ}、{私|わたし}は{窓際|まどぎわ}の{席|せき}に{座|すわ}っていた{男性|だんせい}の{財布|さいふ}（1）と{思|おも}いました。{帰|かえ}るとき、ポケットを{何度|なんど}も{触|さわ}っていたからです。' },
        { text: 'しかし{店長|てんちょう}は、「あの{人|ひと}はカードで{払|はら}って、{財布|さいふ}をかばんにしまっていたから、あの{人|ひと}の（2）」と{言|い}いました。{中|なか}を{見|み}ると、{学生証|がくせいしょう}が{入|はい}っていて、{持|も}ち{主|ぬし}は{毎週|まいしゅう}{来|き}てくれる{女子学生|じょしがくせい}だと{分|わ}かりました。' },
        { text: 'お{金|かね}も{入|はい}っていたので、{交番|こうばん}に{届|とど}けない（3）。{次|つぎ}の{日|ひ}、その{学生|がくせい}が{店|みせ}に{来|き}て、「{交番|こうばん}から{連絡|れんらく}があって、すぐ{見|み}つかりました」とお{礼|れい}を{言|い}ってくれました。' },
        { text: 'この{経験|けいけん}から、{自分|じぶん}の{思|おも}い{込|こ}みが{必|かなら}ずしも{正|ただ}しい（4）ということを{学|まな}びました。{推理|すいり}をするときは、{証拠|しょうこ}を{一|ひと}つずつ{確|たし}かめることが{大切|たいせつ}です。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-np-bunsho',
      title: '文章の文法 — chọn từ cho (1)–(4)',
      items: [
        { q: '（1）', options: ['はずがない', 'わけにはいかない', 'に{違|ちが}いない', 'っぽい'], correct: 2, why: 'Người viết TIN CHẮC theo ấn tượng (sờ túi) → **に{違|ちが}いない** (①). Câu sau "からです" là dấu hiệu của niềm tin đó.' },
        { q: '（2）', options: ['わけだ', 'はずがない', 'に{違|ちが}いない', 'わけではない'], correct: 1, why: 'Anh chủ có CĂN CỨ (trả thẻ, cất ví) → bác bỏ → **はずがない** (②).' },
        { q: '（3）', options: ['わけではありませんでした', 'はずがありませんでした', 'わけでした', 'わけにはいきませんでした'], correct: 3, why: 'Có tiền ở trong → BUỘC phải nộp đồn → **Vないわけにはいかない** (⑦), quá khứ lịch sự: いきませんでした.' },
        { q: '（4）', options: ['わけではない', 'わけがない', 'に{違|ちが}いない', 'わけにはいかない'], correct: 0, why: 'Có **{必|かなら}ずしも** → phủ định một phần → **わけではない** (⑥): định kiến của mình không nhất thiết đúng.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b31-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 20 chữ: 推 測 現 解 能 性 恐 隠 罪 容 像 細 詳 深 過 在 印 象 鍵 袋',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 20 chữ Hán N3 của chủ đề suy luận: suy luận & hiểu (推理・推測・予測・理解・解決・誤解・解く・想像), khả năng & tính chất (可能性・能力・性格・女性), vụ việc (現場・犯罪・罪・内容・容疑者・隠す・隠れる・恐ろしい・恐らく), thời điểm (現在・過去・深夜・過ぎる・深い), mô tả & đồ vật (細かい・細い・詳しい・印象・目印・象・鍵・袋・紙袋); phân biệt chữ trông giống (推↔進↔唯, 測↔側↔則, 現↔規, 能↔熊, 性↔姓, 隠↔穏, 罪↔罰↔置, 容↔客, 像↔象, 細↔紙, 詳↔洋, 深↔探, 過↔週, 在↔存, 鍵↔健↔建, 袋↔貸) và đọc được đoạn văn kiểu đề N3 không furigana.',
  minutes: 55,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 31 là **20 chữ** đi theo đúng các từ của **truyện trinh thám và chuyện tìm đồ**: 推 測 現 解 能 性 恐 隠 罪 容 像 細 詳 深 過 在 印 象 鍵 袋. Nhiều chữ đi **thành cặp** trong một từ — học cặp là nhớ cả hai: **{推測|すいそく}** (推 + 測), **{現在|げんざい}** (現 + 在), **{印象|いんしょう}** (印 + 象), **{可能性|かのうせい}** (能 + 性). Phần lớn chỉ cần **👁 nhận mặt**. Chữ **✍ nên viết** là chữ ít nét, rất hay dùng: 現 性 細 深 在 印. Mẹo của bài: nhiều chữ là **chữ hình thanh** — một phần chỉ **nghĩa** (氵 nước, 扌 tay, 忄 lòng, 言 lời, 糸 sợi, 亻 người, 金 kim loại), một phần gợi **âm** (隹 → スイ, 則 → ソク, 生 → セイ, 羊 → ショウ, 建 → ケン, 代 → タイ).',
    },
    {
      t: 'table',
      caption: '20 chữ Hán mới của Bài 31',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['推', 'SUY', 'スイ', 'お(す)', 'đẩy; suy ra; tiến cử', '{推理|すいり} (suy luận) · {推測|すいそく} (phỏng đoán) · {推薦|すいせん} (tiến cử — N2) · {推|お}す (ủng hộ — N1)', '👁 N3–N2'],
        ['測', 'TRẮC', 'ソク', 'はか(る)', 'đo; ước đoán', '{推測|すいそく} · {予測|よそく} (dự đoán — N2) · {測|はか}る (đo — N2) · {観測|かんそく} (quan trắc — N1)', '👁 N2'],
        ['現', 'HIỆN', 'ゲン', 'あらわ(れる)・あらわ(す)', 'hiện ra; hiện tại, thực tế', '{現場|げんば} (hiện trường) · {現在|げんざい} (hiện tại) · {現金|げんきん} (tiền mặt) · {表現|ひょうげん} (biểu hiện — N3) · {現|あらわ}れる (xuất hiện — N3)', '✍ N3'],
        ['解', 'GIẢI', 'カイ・ゲ', 'と(く)・と(かす)・と(ける)', 'cởi, gỡ; giải, hiểu', '{解決|かいけつ} (giải quyết) · {理解|りかい} (hiểu) · {誤解|ごかい} (hiểu lầm) · {解|と}く (giải) · {解答|かいとう} (lời giải — N3)', '👁 N3'],
        ['能', 'NĂNG', 'ノウ', '—', 'tài năng; có thể', '{可能性|かのうせい} (khả năng) · {能力|のうりょく} (năng lực — N3) · {可能|かのう} (có thể) · {機能|きのう} (chức năng — N2)', '👁 N3'],
        ['性', 'TÍNH', 'セイ・ショウ', '—', 'tính chất, bản tính; giới', '{可能性|かのうせい} · {性格|せいかく} (tính cách) · {女性|じょせい} (nữ giới) · {男性|だんせい} (nam giới) · {相性|あいしょう} (sự hợp nhau — N2)', '✍ N3'],
        ['恐', 'KHỦNG', 'キョウ', 'おそ(れる)・おそ(ろしい)', 'sợ hãi', '{恐|おそ}ろしい (đáng sợ) · {恐|おそ}らく (có lẽ) · {恐|おそ}れる (sợ — N2) · {恐怖|きょうふ} (nỗi sợ — N1)', '👁 N3'],
        ['隠', 'ẨN', 'イン', 'かく(す)・かく(れる)', 'che giấu, ẩn nấp', '{隠|かく}す (giấu) · {隠|かく}れる (nấp) · {隠|かく}れんぼ (trốn tìm) · {隠居|いんきょ} (ở ẩn — N1)', '👁 N3–N2'],
        ['罪', 'TỘI', 'ザイ', 'つみ', 'tội', '{犯罪|はんざい} (tội phạm) · {罪|つみ} (tội) · {無罪|むざい} (vô tội — N1) · {謝罪|しゃざい} (tạ lỗi — N1)', '👁 N3'],
        ['容', 'DUNG', 'ヨウ', '—', 'chứa đựng; dáng vẻ', '{内容|ないよう} (nội dung — N3) · {容疑者|ようぎしゃ} (nghi phạm) · {美容院|びよういん} (tiệm làm tóc — N3) · {容器|ようき} (đồ đựng — N2)', '👁 N3'],
        ['像', 'TƯỢNG', 'ゾウ', '—', 'hình ảnh, pho tượng', '{想像|そうぞう} (tưởng tượng) · {画像|がぞう} (hình ảnh — N3) · {映像|えいぞう} (hình ảnh động — N2) · {銅像|どうぞう} (tượng đồng — N1)', '👁 N3'],
        ['細', 'TẾ', 'サイ', 'ほそ(い)・ほそ(る)・こま(か)・こま(かい)', 'nhỏ, mảnh; tỉ mỉ', '{細|こま}かい (nhỏ, tỉ mỉ) · {細|ほそ}い (mảnh, gầy) · {細長|ほそなが}い (dài mảnh) · {詳細|しょうさい} (chi tiết — N2)', '✍ N3'],
        ['詳', 'TƯỜNG', 'ショウ', 'くわ(しい)', 'tường tận, kỹ càng', '{詳|くわ}しい (chi tiết) · {詳|くわ}しく (một cách chi tiết) · {詳細|しょうさい} (chi tiết — N2)', '👁 N3'],
        ['深', 'THÂM', 'シン', 'ふか(い)・ふか(まる)・ふか(める)', 'sâu', '{深|ふか}い (sâu) · {深夜|しんや} (đêm khuya) · {深刻|しんこく} (nghiêm trọng — N2) · {興味深|きょうみぶか}い (rất thú vị — N2)', '✍ N3'],
        ['過', 'QUÁ', 'カ', 'す(ぎる)・す(ごす)・あやま(つ)・あやま(ち)', 'đi qua; quá; lỗi lầm', '{過去|かこ} (quá khứ) · {過|す}ぎる (qua, quá) · {過|す}ごす (trải qua — N3) · {通過|つうか} (đi qua — N2)', '👁 N3'],
        ['在', 'TẠI', 'ザイ', 'あ(る)', 'có mặt, ở', '{現在|げんざい} (hiện tại) · {存在|そんざい} (tồn tại — N2) · {滞在|たいざい} (lưu trú — N3) · {在留|ざいりゅう}カード (thẻ cư trú)', '✍ N3'],
        ['印', 'ẤN', 'イン', 'しるし', 'dấu, con dấu', '{印象|いんしょう} (ấn tượng) · {目印|めじるし} (dấu nhận biết) · {印|しるし} (dấu) · {印刷|いんさつ} (in ấn — N3)', '✍ N3'],
        ['象', 'TƯỢNG', 'ショウ・ゾウ', '—', 'con voi; hình tượng', '{印象|いんしょう} · {象|ぞう} (con voi) · {対象|たいしょう} (đối tượng — N2) · {現象|げんしょう} (hiện tượng — N2)', '👁 N3'],
        ['鍵', 'KIỆN', 'ケン', 'かぎ', 'chìa khoá', '{鍵|かぎ} (chìa khoá) · {合|あ}い{鍵|かぎ} (chìa khoá dự phòng — N2) · {鍵盤|けんばん} (bàn phím đàn — N1)', '👁 N2–N1 (常用 từ 2010)'],
        ['袋', 'ĐẠI', 'タイ', 'ふくろ', 'túi, bao', '{袋|ふくろ} (túi) · {紙袋|かみぶくろ} (túi giấy) · {手袋|てぶくろ} (găng tay) · {寝袋|ねぶくろ} (túi ngủ)', '👁 N3–N2'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**推** = 扌 (tay) + 隹 (chim đuôi ngắn — gợi âm スイ): dùng tay **ĐẨY** tới → đẩy lý lẽ đi từng bước tới kết luận = **SUY** luận → {推理|すいり}. ⚠ Khác **進** (tiến — 辶 + 隹) và **唯** (duy — 口 + 隹).',
        '**測** = 氵 (nước) + 則 (quy tắc — gợi âm ソク; {規則|きそく}): thả dây xuống **ĐO** độ sâu của nước theo một quy tắc → {測|はか}る, rồi "đo đoán" → {推測|すいそく}, {予測|よそく}. ⚠ Khác **側** (trắc — bên cạnh: 亻 + 則) và **則** (tắc) trần.',
        '**現** = 王 (vốn là 玉 — viên ngọc) + 見 (nhìn): viên ngọc mài xong, ánh sáng **HIỆN** ra cho người nhìn → {現|あらわ}れる, {現在|げんざい} (cái đang hiện ra trước mắt = hiện tại). ⚠ Khác **規** ({規則|きそく} — 夫 + 見).',
        '**解** = 角 (cái sừng) + 刀 (dao) + 牛 (con bò): dùng dao **xẻ** sừng con bò → mổ xẻ, **tách** ra, **GIẢI** gỡ → {解|と}く, {解決|かいけつ}, {理解|りかい} (mổ xẻ ra mới hiểu). 13 nét — viết 角 trước, 刀 rồi 牛.',
        '**能** — theo cách giải thích phổ biến, chữ cổ vẽ **con gấu** (ム là đầu, 月 là thân, hai 匕 là chân): gấu khoẻ, làm được nhiều việc → có **NĂNG** lực → {能力|のうりょく}, {可能|かのう}. Thêm 灬 (lửa) ở dưới → **熊** (くま — con gấu, N1).',
        '**性** = 忄 (tấm lòng) + 生 (sinh — gợi âm セイ): cái **lòng** người ta **sinh** ra đã có = bản **TÍNH** → {性格|せいかく}; nghĩa mở rộng "tính chất" → {可能性|かのうせい}, "giới tính" → {女性|じょせい}. ⚠ Khác **姓** (tính — họ: 女 + 生).',
        '**恐** = phần trên 巩 (hai tay ôm chặt — gợi âm キョウ) + 心 (tim): ôm chặt ngực, tim run vì **SỢ** → {恐|おそ}ろしい. Mẹo: **{恐|おそ}らく** (có lẽ) vốn là "e rằng" — người nói **sợ** điều mình đoán sẽ xảy ra.',
        '**隠** — theo cách giải thích phổ biến: 阝 bên trái (gò đất) + bên phải 爫 (bàn tay) + ヨ + 心 (lòng): nấp sau **gò đất**, tay che, lòng thấp thỏm → **ẨN**, giấu → {隠|かく}す, {隠|かく}れる. ⚠ Khác **穏** (ổn — {穏|おだ}やか, N2): 禾 thay cho 阝.',
        '**罪** = 罒 (cái lưới) + 非 (điều sai trái — {非常口|ひじょうぐち}): kẻ làm điều **sai trái** bị **lưới** pháp luật bắt → **TỘI** → {罪|つみ}, {犯罪|はんざい}. Cùng 罒 trên đầu: **罰** (phạt — N2), **置** ({置|お}く — đã học).',
        '**容** = 宀 (mái nhà) + 谷 (thung lũng): mái nhà rộng như **thung lũng**, **chứa** được nhiều thứ → **DUNG** nạp → {内容|ないよう} (cái chứa bên trong = nội dung). ⚠ Khác **客** (khách — 宀 + 各).',
        '**像** = 亻 (người) + 象 (con voi — gợi âm ゾウ): người xưa ở Trung Hoa chưa thấy voi thật, chỉ nhìn **xương voi** rồi **hình dung** ra con voi → **HÌNH TƯỢNG**, hình ảnh → {想像|そうぞう} (tưởng tượng), {画像|がぞう}. Câu chuyện này chính là nguồn gốc của từ {想像|そうぞう}.',
        '**細** = 糸 (sợi chỉ) + 田 (ở đây vốn là 囟 — cái thóp đầu em bé, chỉ sự nhỏ): sợi chỉ **mảnh** → **TẾ** (nhỏ) → {細|ほそ}い (mảnh), {細|こま}かい (nhỏ, vụn, tỉ mỉ). ⚠ Một chữ, hai cách đọc kun — {細|ほそ}い ≠ {細|こま}かい.',
        '**詳** = 言 (lời nói) + 羊 (con cừu — gợi âm ショウ, như 洋 ヨウ): mẹo — lời giải thích **kỹ như lông cừu**, từng sợi một → **TƯỜNG** tận → {詳|くわ}しい. ⚠ Khác **洋** (dương — 氵 + 羊: {洋服|ようふく}).',
        '**深** = 氵 (nước) + 罙 (cái hang sâu, có người thò tay vào): nước trong hang thì **SÂU** → {深|ふか}い. ⚠ Cùng phần phải với **探** ({探|さが}す — đã học): **tay** (扌) mò vào hang = **tìm**; **nước** (氵) trong hang = **sâu**.',
        '**過** = 辶 (bước đi) + 咼 (gợi âm カ): bước **ĐI QUA** → {過|す}ぎる (qua; quá mức), {過去|かこ} (cái đã đi qua = quá khứ), {過|す}ごす (trải qua thời gian). ⚠ Khác **週** ({毎週|まいしゅう} — 辶 + 周).',
        '**在** = 才 (mầm cây vừa nhú — gợi âm ザイ, viết lệch) + 土 (đất): mầm cây đứng trên đất = **có mặt**, **TỒN TẠI** → {現在|げんざい}, {存在|そんざい}. ⚠ Khác **存** (tồn — dưới là 子) và **有** (hữu — {有名|ゆうめい}).',
        '**印** — bên trái là một **bàn tay**, bên phải 卩 (người quỳ): tay **ấn** người quỳ xuống → **ẤN** (ấn, đóng dấu) → {印|しるし} (dấu), {目印|めじるし}, {印象|いんしょう} (hình ảnh "ấn" vào lòng = ấn tượng). 6 nét.',
        '**象** — chữ tượng hình **con voi**: phần trên là cái đầu có vòi, dưới là thân và chân → **TƯỢNG** (con voi: {象|ぞう}); nghĩa mở rộng "hình tượng, hình dáng" → {印象|いんしょう}, {現象|げんしょう}. Thêm 亻 → **像** (hình ảnh — chữ trên).',
        '**鍵** = 金 (kim loại) + 建 (xây dựng — gợi âm ケン): thanh **kim loại** "dựng" then cài cửa → **chìa KHOÁ** → {鍵|かぎ}. ⚠ Khác **健** ({健康|けんこう} — 亻 + 建) — cùng âm ケン. 17 nét — chỉ cần đọc.',
        '**袋** = 代 (thay thế — gợi âm タイ) + 衣 (áo, vải): miếng **vải** may lại để đựng **thay** cho tay → cái **TÚI** → {袋|ふくろ}, {手袋|てぶくろ}. ⚠ Khác **貸** ({貸|か}す — 代 + 貝 tiền).',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['推', '{推|お}す (ủng hộ, tiến cử — N1)', 'スイ: {推理|すいり}・{推測|すいそく}', 'すい ngắn — không phải ~~すうり~~'],
        ['測', '{測|はか}る (đo)', 'ソク: {推測|すいそく}・{予測|よそく}', '{測|はか}る／{計|はか}る／{量|はか}る cùng âm khác nghĩa'],
        ['現', '{現|あらわ}れる (xuất hiện)', 'ゲン: {現場|げんば}・{現在|げんざい}・{現金|げんきん}', '{表|あらわ}す (biểu lộ) cùng âm khác chữ'],
        ['解', '{解|と}く・{解|と}ける (giải, được giải)', 'カイ: {解決|かいけつ}・{理解|りかい}・{誤解|ごかい}', 'ゲ chỉ trong vài từ: {解熱剤|げねつざい} (thuốc hạ sốt)'],
        ['能', '(không có kun)', 'ノウ: {能力|のうりょく}・{可能性|かのうせい}', 'のう trường âm'],
        ['性', '(không có kun)', 'セイ: {性格|せいかく}・{女性|じょせい} · ショウ: {相性|あいしょう}', '{可能性|かのうせい} — せい (không ~~しょう~~)'],
        ['恐', '{恐|おそ}ろしい・{恐|おそ}れる', 'キョウ: {恐怖|きょうふ}', '{恐|おそ}らく — kun, không phải on'],
        ['隠', '{隠|かく}す・{隠|かく}れる', 'イン: {隠居|いんきょ} (N1)', 'gần như chỉ gặp kun'],
        ['罪', '{罪|つみ} (tội)', 'ザイ: {犯罪|はんざい}・{無罪|むざい}', 'ざい (đục), không ~~さい~~'],
        ['容', '(không có kun)', 'ヨウ: {内容|ないよう}・{容疑者|ようぎしゃ}・{美容院|びよういん}', 'よう trường âm'],
        ['像', '(không có kun)', 'ゾウ: {想像|そうぞう}・{画像|がぞう}', 'ぞう (đục) — giống {象|ぞう} (con voi)'],
        ['細', '{細|ほそ}い (mảnh) · {細|こま}かい (nhỏ, tỉ mỉ)', 'サイ: {詳細|しょうさい}', 'HAI kun khác nghĩa — đọc theo đuôi kana: ～い→ほそい, ～かい→こまかい'],
        ['詳', '{詳|くわ}しい', 'ショウ: {詳細|しょうさい}', '{詳細|しょうさい} = しょう + さい'],
        ['深', '{深|ふか}い', 'シン: {深夜|しんや}・{深刻|しんこく}', '{興味深|きょうみぶか}い — ふか → ぶか'],
        ['過', '{過|す}ぎる・{過|す}ごす', 'カ: {過去|かこ}・{通過|つうか}', '{過去|かこ} — か + こ, không ~~かきょ~~'],
        ['在', '(あ(る) — hầu như không dùng)', 'ザイ: {現在|げんざい}・{存在|そんざい}・{滞在|たいざい}', 'ざい (đục)'],
        ['印', '{印|しるし} (dấu) · {目印|めじるし}', 'イン: {印象|いんしょう}・{印刷|いんさつ}', '目 + 印 → めじるし (し → じ)'],
        ['象', '(không có kun)', 'ゾウ: {象|ぞう} (con voi) · ショウ: {印象|いんしょう}・{現象|げんしょう}', 'con voi đọc ぞう; trong từ ghép trừu tượng đọc しょう'],
        ['鍵', '{鍵|かぎ}', 'ケン: {鍵盤|けんばん} (N1)', 'gần như chỉ gặp kun かぎ'],
        ['袋', '{袋|ふくろ}', 'タイ (hiếm)', 'sau chữ khác → ぶくろ: {紙袋|かみぶくろ}・{手袋|てぶくろ}'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['推 (suy)', '進 (tiến) · 唯 (duy)', 'cùng 隹: 推 có 扌 · 進 có 辶 · 唯 có 口.'],
        ['測 (trắc)', '側 (trắc — bên) · 則 (tắc)', 'cùng 則: 測 có 氵 (đo nước) · 側 có 亻.'],
        ['現 (hiện)', '規 (quy) · 見 (kiến)', 'cùng 見: 現 có 王 · 規 có 夫.'],
        ['能 (năng)', '熊 (hùng — con gấu)', '熊 = 能 + 灬 (bốn chấm dưới).'],
        ['性 (tính)', '姓 (tính — họ) · 生', '忄 + 生 = 性 · 女 + 生 = 姓.'],
        ['恐 (khủng)', '怒 (nộ) · 思 (tư)', 'cùng 心 dưới: 恐 trên là 巩 · 怒 trên là 奴 · 思 trên là 田.'],
        ['隠 (ẩn)', '穏 (ổn)', 'bên trái: 隠 → 阝 · 穏 → 禾.'],
        ['罪 (tội)', '罰 (phạt) · 置 (trí)', 'cùng 罒: 罪 → 非 · 罰 → 言 + 刂 · 置 → 直.'],
        ['容 (dung)', '客 (khách)', 'cùng 宀: 容 → 谷 · 客 → 各.'],
        ['像 (tượng — hình)', '象 (tượng — voi)', '像 có thêm 亻: {想像|そうぞう}・{画像|がぞう}; 象: {印象|いんしょう}・{象|ぞう}.'],
        ['細 (tế)', '紙 (chỉ) · 組 (tổ)', 'cùng 糸: 細 → 田 · 紙 → 氏 · 組 → 且.'],
        ['詳 (tường)', '洋 (dương) · 様 (dạng)', 'cùng 羊: 詳 → 言 · 洋 → 氵.'],
        ['深 (thâm)', '探 (thám)', 'cùng 罙: 深 → 氵 (sâu) · 探 → 扌 (tìm).'],
        ['過 (quá)', '週 (chu) · 道 (đạo)', 'cùng 辶: 過 → 咼 · 週 → 周 · 道 → 首.'],
        ['在 (tại)', '存 (tồn) · 有 (hữu)', '才 + 土 = 在 · 才 + 子 = 存.'],
        ['鍵 (kiện)', '健 (kiện) · 建 (kiến)', 'cùng 建: 鍵 → 金 · 健 → 亻.'],
        ['袋 (đại)', '貸 (thải) · 代 (đại)', 'cùng 代 trên: 袋 → 衣 · 貸 → 貝.'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b31-doc-kanji',
      title: 'Đọc KHÔNG furigana — 22 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: '{警察|けいさつ}は{小|ちい}さな{手|て}がかりから{犯人|はんにん}を{推理|すいり}しました。', ro: 'Keisatsu wa chiisana tegakari kara hannin o suiri shimashita.', vi: 'Cảnh sát đã suy luận ra thủ phạm từ một manh mối nhỏ.' },
        { text: '{彼|かれ}の{話|はな}し{方|かた}から、{関西|かんさい}の{人|ひと}だと{推測|すいそく}しました。', ro: 'Kare no hanashikata kara, Kansai no hito da to suisoku shimashita.', vi: 'Từ cách nói chuyện, tôi đoán anh ấy là người Kansai.' },
        { text: '{明日|あした}の{天気|てんき}を{予測|よそく}するのは{難|むずか}しいです。', ro: 'Ashita no tenki o yosoku suru no wa muzukashii desu.', vi: 'Dự đoán thời tiết ngày mai thật khó.' },
        { text: '{事件|じけん}の{現場|げんば}には、{足|あし}あとが{残|のこ}っていました。', ro: 'Jiken no genba ni wa, ashiato ga nokotte imashita.', vi: 'Ở hiện trường vụ việc còn lại dấu chân.' },
        { text: '{現在|げんざい}、{午後|ごご}{三時|さんじ}です。', ro: 'Genzai, gogo sanji desu.', vi: 'Bây giờ là 3 giờ chiều.' },
        { text: '{急|きゅう}に{窓|まど}の{外|そと}に{猫|ねこ}が{現|あらわ}れました。', ro: 'Kyuu ni mado no soto ni neko ga arawaremashita.', vi: 'Đột nhiên một con mèo xuất hiện ngoài cửa sổ.' },
        { text: '{話|はな}し{合|あ}いで{問題|もんだい}を{解決|かいけつ}しました。', ro: 'Hanashiai de mondai o kaiketsu shimashita.', vi: 'Đã giải quyết vấn đề bằng cách nói chuyện với nhau.' },
        { text: '{先生|せんせい}の{説明|せつめい}で、やっと{理解|りかい}できました。', ro: 'Sensei no setsumei de, yatto rikai dekimashita.', vi: 'Nhờ lời giải thích của thầy, cuối cùng tôi đã hiểu.' },
        { text: 'この{問題|もんだい}は{難|むずか}しくて、{誰|だれ}も{解|と}けません。', ro: 'Kono mondai wa muzukashikute, dare mo tokemasen.', vi: 'Bài này khó quá, không ai giải được.' },
        { text: '{明日|あした}は{雪|ゆき}が{降|ふ}る{可能性|かのうせい}があります。', ro: 'Ashita wa yuki ga furu kanousei ga arimasu.', vi: 'Ngày mai có khả năng tuyết rơi.' },
        { text: '{彼女|かのじょ}は{明|あか}るい{性格|せいかく}で、みんなに{好|す}かれています。', ro: 'Kanojo wa akarui seikaku de, minna ni sukarete imasu.', vi: 'Cô ấy tính tình vui vẻ nên được mọi người yêu quý.' },
        { text: 'ゆうべ、{恐|おそ}ろしい{夢|ゆめ}を{見|み}ました。', ro: 'Yuube, osoroshii yume o mimashita.', vi: 'Tối qua tôi mơ một giấc mơ đáng sợ.' },
        { text: '{恐|おそ}らく、{犯人|はんにん}はもう{逃|に}げたでしょう。', ro: 'Osoraku, hannin wa mou nigeta deshou.', vi: 'E rằng thủ phạm đã trốn mất rồi.' },
        { text: '{弟|おとうと}はテストを{引|ひ}き{出|だ}しの{中|なか}に{隠|かく}しました。', ro: 'Otouto wa tesuto o hikidashi no naka ni kakushimashita.', vi: 'Em trai tôi đã giấu bài kiểm tra trong ngăn kéo.' },
        { text: 'この{町|まち}では、{犯罪|はんざい}が{少|すく}なくなりました。', ro: 'Kono machi de wa, hanzai ga sukunaku narimashita.', vi: 'Ở thị trấn này, tội phạm đã ít đi.' },
        { text: 'メールの{内容|ないよう}を、もう{一度|いちど}{確|たし}かめてください。', ro: 'Meeru no naiyou o, mou ichido tashikamete kudasai.', vi: 'Hãy kiểm tra lại nội dung email một lần nữa.' },
        { text: '{十年後|じゅうねんご}の{自分|じぶん}を{想像|そうぞう}してみましょう。', ro: 'Juunengo no jibun o souzou shite mimashou.', vi: 'Hãy thử tưởng tượng bản thân mười năm sau.' },
        { text: '{細|こま}かいお{金|かね}がないので、カードで{払|はら}います。', ro: 'Komakai okane ga nai node, kaado de haraimasu.', vi: 'Không có tiền lẻ nên tôi trả bằng thẻ.' },
        { text: 'もう{少|すこ}し{詳|くわ}しく{説明|せつめい}してください。', ro: 'Mou sukoshi kuwashiku setsumei shite kudasai.', vi: 'Hãy giải thích chi tiết hơn một chút.' },
        { text: 'この{川|かわ}は{深|ふか}いので、{泳|およ}がないでください。', ro: 'Kono kawa wa fukai node, oyoganaide kudasai.', vi: 'Con sông này sâu nên xin đừng bơi.' },
        { text: '{過去|かこ}のことは{忘|わす}れて、{前|まえ}を{見|み}ましょう。', ro: 'Kako no koto wa wasurete, mae o mimashou.', vi: 'Hãy quên chuyện quá khứ và nhìn về phía trước.' },
        { text: '{初|はじ}めて{会|あ}ったときの{印象|いんしょう}は、とてもよかったです。', ro: 'Hajimete atta toki no inshou wa, totemo yokatta desu.', vi: 'Ấn tượng lúc mới gặp lần đầu rất tốt.' },
        { text: '{鍵|かぎ}を{紙袋|かみぶくろ}の{中|なか}に{入|い}れたまま、{忘|わす}れていました。', ro: 'Kagi o kamibukuro no naka ni ireta mama, wasurete imashita.', vi: 'Tôi đã bỏ chìa khoá trong túi giấy rồi quên mất.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b31-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 50 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{昨日|きのう}の{深夜|しんや}、{駅|えき}の{近|ちか}くの{店|みせ}で{事件|じけん}がありました。{現在|げんざい}、{警察|けいさつ}が{現場|げんば}を{調|しら}べています。{防犯|ぼうはん}カメラに{映|うつ}っていた{男|おとこ}は、{黒|くろ}っぽい{服|ふく}を{着|き}ていたそうです。{恐|おそ}らく、{犯人|はんにん}はこの{町|まち}をよく{知|し}っている{人|ひと}でしょう。', ro: 'Kinou no shin\'ya, eki no chikaku no mise de jiken ga arimashita. Genzai, keisatsu ga genba o shirabete imasu. Bouhan kamera ni utsutte ita otoko wa, kuroppoi fuku o kite ita sou desu. Osoraku, hannin wa kono machi o yoku shitte iru hito deshou.', vi: 'Đêm khuya hôm qua, ở một cửa hàng gần ga đã xảy ra một vụ việc. Hiện cảnh sát đang khám xét hiện trường. Nghe nói người đàn ông xuất hiện trong camera an ninh mặc quần áo màu đen đen. E rằng thủ phạm là người biết rõ thị trấn này.' },
        { text: '{私|わたし}は{推理小説|すいりしょうせつ}が{大好|だいす}きです。{細|こま}かい{手|て}がかりから{犯人|はんにん}を{想像|そうぞう}するのが{楽|たの}しいからです。でも、{自分|じぶん}の{推理|すいり}が{当|あ}たる{可能性|かのうせい}は{低|ひく}いです。{最後|さいご}になぞが{解|と}けたとき、いつも「{道理|どうり}で！」と{思|おも}います。', ro: 'Watashi wa suiri shousetsu ga daisuki desu. Komakai tegakari kara hannin o souzou suru no ga tanoshii kara desu. Demo, jibun no suiri ga ataru kanousei wa hikui desu. Saigo ni nazo ga toketa toki, itsumo "Douri de!" to omoimasu.', vi: 'Tôi rất thích truyện trinh thám. Vì thích thú khi hình dung ra thủ phạm từ những manh mối nhỏ. Nhưng khả năng suy luận của tôi đúng thì thấp. Cuối truyện khi bí ẩn được giải, lần nào tôi cũng nghĩ "Thảo nào!".' },
        { text: '{電車|でんしゃ}の{中|なか}に、{白|しろ}っぽい{袋|ふくろ}を{置|お}き{忘|わす}れてしまいました。{中身|なかみ}は{大切|たいせつ}な{書類|しょるい}と{鍵|かぎ}です。{駅|えき}の{人|ひと}に{袋|ふくろ}の{特徴|とくちょう}を{詳|くわ}しく{話|はな}したら、{次|つぎ}の{日|ひ}に{見|み}つかったと{連絡|れんらく}がありました。{本当|ほんとう}に{助|たす}かりました。', ro: 'Densha no naka ni, shiroppoi fukuro o okiwasurete shimaimashita. Nakami wa taisetsu na shorui to kagi desu. Eki no hito ni fukuro no tokuchou o kuwashiku hanashitara, tsugi no hi ni mitsukatta to renraku ga arimashita. Hontou ni tasukarimashita.', vi: 'Tôi đã để quên một chiếc túi ngả trắng trên tàu. Bên trong là giấy tờ quan trọng và chìa khoá. Khi tôi kể chi tiết đặc điểm của chiếc túi cho nhân viên ga, hôm sau họ báo đã tìm thấy. Thật là may quá.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (14 câu)',
      items: [
        { q: '{犯人|はんにん}を**推理**するのは{楽|たの}しい。', options: ['すうり', 'ついり', 'すいり', 'すいりい'], correct: 2, why: '**推理** = すいり (推 スイ + 理 リ).' },
        { q: '{天気|てんき}を**予測**する。', options: ['よぞく', 'よそく', 'よさく', 'ようそく'], correct: 1, why: '**予測** = よそく (測 ソク).' },
        { q: '**現在**、{雨|あめ}は{降|ふ}っていません。', options: ['げんさい', 'けんざい', 'げんぜい', 'げんざい'], correct: 3, why: '**現在** = げんざい (在 ザイ — đục).' },
        { q: '{事故|じこ}の**現場**に{行|い}く。', options: ['げんば', 'げんじょう', 'けんば', 'げんぱ'], correct: 0, why: '**現場** = げんば (場 đọc kun ば).' },
        { q: '{問題|もんだい}を**解決**する。', options: ['かいげつ', 'かいけつ', 'げけつ', 'かいけい'], correct: 1, why: '**解決** = かいけつ (解 カイ).' },
        { q: '{雪|ゆき}が{降|ふ}る**可能性**がある。', options: ['かのうしょう', 'かのせい', 'かのうせい', 'がのうせい'], correct: 2, why: '**可能性** = かのうせい (性 セイ ở đây).' },
        { q: '**恐**ろしい{話|はなし}を{聞|き}いた。', options: ['こわ', 'おど', 'きょう', 'おそ'], correct: 3, why: '**恐**ろしい = おそろしい. ({怖|こわ}い là chữ khác.)' },
        { q: '{猫|ねこ}が{箱|はこ}の{中|なか}に**隠**れている。', options: ['かこ', 'かく', 'いん', 'はな'], correct: 1, why: '**隠**れる = かくれる.' },
        { q: 'この{町|まち}は**犯罪**が{少|すく}ない。', options: ['はんざい', 'はんさい', 'ばんざい', 'はんぜい'], correct: 0, why: '**犯罪** = はんざい (罪 ザイ — đục). ばんざい = vạn tuế!' },
        { q: '{手紙|てがみ}の**内容**を{読|よ}む。', options: ['うちよう', 'ないよ', 'ないよう', 'ないおう'], correct: 2, why: '**内容** = ないよう (容 ヨウ).' },
        { q: '**細**い{道|みち}を{歩|ある}く。', options: ['こま', 'さい', 'せま', 'ほそ'], correct: 3, why: '**細**い = ほそい (mảnh, hẹp). ～かい thì đọc こまかい. ({狭|せま}い là chữ khác.)' },
        { q: '**深夜**に{電話|でんわ}が{鳴|な}った。', options: ['ふかや', 'じんや', 'しんや', 'しんよ'], correct: 2, why: '**深夜** = しんや (深 シン).' },
        { q: '**過去**の{記録|きろく}を{調|しら}べる。', options: ['かきょ', 'かこ', 'すぎさ', 'かご'], correct: 1, why: '**過去** = かこ.' },
        { q: '{彼|かれ}の**印象**はとてもいい。', options: ['いんしょう', 'いんぞう', 'いんしょ', 'しるしょう'], correct: 0, why: '**印象** = いんしょう — 象 đọc ショウ trong từ ghép trừu tượng ({象|ぞう} = con voi).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (12 câu)',
      items: [
        { q: '{少|すこ}しの{手|て}がかりから**すいそく**する。', options: ['進測', '推側', '推測', '唯測'], correct: 2, why: '**推測** — 推 (扌) + 測 (氵).' },
        { q: '**げんざい**の{気温|きおん}は{二十度|にじゅうど}です。', options: ['現存', '現在', '見在', '規在'], correct: 1, why: '**現在** — 在 = 才 + 土 (存 có 子).' },
        { q: '{先生|せんせい}の{話|はなし}を**りかい**する。', options: ['理角', '利解', '理階', '理解'], correct: 3, why: '**理解** — 解 = 角 + 刀 + 牛.' },
        { q: 'あの{人|ひと}は**のうりょく**が{高|たか}い。', options: ['能力', '熊力', '態力', '脳力'], correct: 0, why: '**能力** — 熊 có thêm 灬; 態 có 心 dưới (Bài 28).' },
        { q: '{明|あか}るい**せいかく**の{人|ひと}です。', options: ['姓格', '性格', '生格', '正格'], correct: 1, why: '**性格** — 性 = 忄 + 生; 姓 = 女 + 生 (họ).' },
        { q: '{本当|ほんとう}のことを**かく**す。', options: ['穏す', '陰す', '隠す', '確す'], correct: 2, why: '**隠す** — 阝 bên trái; 穏 có 禾.' },
        { q: '{町|まち}の**はんざい**が{減|へ}った。', options: ['犯罰', '犯置', '範罪', '犯罪'], correct: 3, why: '**犯罪** — 罪 = 罒 + 非.' },
        { q: 'メールの**ないよう**を{確|たし}かめる。', options: ['内客', '内容', '内谷', '肉容'], correct: 1, why: '**内容** — 容 = 宀 + 谷; 客 = 宀 + 各.' },
        { q: '{将来|しょうらい}の{自分|じぶん}を**そうぞう**する。', options: ['想像', '想象', '相像', '想増'], correct: 0, why: '**想像** — 像 có 亻 (hình ảnh). 象 là con voi / hiện tượng.' },
        { q: 'もっと**くわ**しく{教|おし}えてください。', options: ['洋しく', '様しく', '詳しく', '評しく'], correct: 2, why: '**詳しく** — 詳 = 言 + 羊.' },
        { q: 'この{池|いけ}はとても**ふか**い。', options: ['探い', '浅い', '渋い', '深い'], correct: 3, why: '**深い** — 氵 + 罙; 探 (扌) = tìm; 浅い = nông (ngược nghĩa).' },
        { q: '**かぎ**を**ふくろ**に{入|い}れた。', options: ['健・貸', '建・代', '鍵・袋', '鍵・貸'], correct: 2, why: '**鍵** (金 + 建) · **袋** (代 + 衣). 貸 (代 + 貝) = cho mượn.' },
      ],
    },
    {
      t: 'write',
      id: 'b31-viet-kanji',
      title: 'Tập viết — 6 chữ ✍ và 8 từ',
      note: 'Viết 6 chữ ✍ trước (đúng thứ tự nét theo hoạt hình — chú ý 在 viết nét ngang rồi nét phẩy trước, 印 viết bên trái trước rồi 卩), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['現', '性', '細', '深', '在', '印', '推理', '解決', '可能性', '現在', '過去', '想像', '印象', '詳しい'],
      goi: {
        '推理': 'すいり · suy luận',
        '解決': 'かいけつ · giải quyết',
        '可能性': 'かのうせい · khả năng',
        '現在': 'げんざい · hiện tại',
        '過去': 'かこ · quá khứ',
        '想像': 'そうぞう · tưởng tượng',
        '印象': 'いんしょう · ấn tượng',
        '詳しい': 'くわしい · chi tiết',
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
  id: 'b31-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N3 — 7 bài theo đủ 5 dạng đề: 課題理解 · ポイント理解 · 概要理解 (radio) · 発話表現 · 即時応答',
  goal: 'Nghe hội thoại ở quầy đồ thất lạc của ga và khi chuẩn bị báo cáo ゼミ để biết việc phải làm TRƯỚC (～てから, ～わけにはいかない → làm ngay hôm nay); nghe để bắt đúng lý do thật sau hai lý do bị gạt đi bằng ～わけがない／違うと思う (→ もしかして… → 道理で～わけだ); nghe người mô tả đồ thất lạc (～っぽい, 目印, 中身, そんなはずは…) để chọn đúng đồ vật; nghe một cuộc trò chuyện trên radio ~1 phút để nắm ý chính của người nói (～が大切ではない、～が楽しいんです); chọn câu nói đúng (わけにはいかない ↔ わけではない ↔ はずがない ↔ わけだ) trong tình huống; đáp ngay câu có に違いない, そんなはずはない, わけじゃない, っこない.',
  minutes: 50,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N3 — 40 phút',
      head: ['Mondai', 'Dạng', 'Số câu', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 — việc phải làm', '6', 'Câu chốt thường là "その{前|まえ}に～" / "～てから{行|い}きます" / "～わけにはいかない" → việc làm TRƯỚC là việc được nhắc SAU CÙNG.'],
        ['問題2', 'ポイント理解 — lý do, điểm chính', '6', 'Hai lý do đầu bị gạt bằng "～わけがない／{違|ちが}うと{思|おも}う" → lý do thật đến sau "もしかして…" và được chốt bằng "{道理|どうり}で～わけだ".'],
        ['問題3', '概要理解 — ý chính (độc thoại / phỏng vấn)', '3', 'Người nói hay mở bằng ý của số đông ("{多|おお}くの{人|ひと}は～と{考|かんが}えます") rồi lật lại bằng "でも、{私|わたし}は～と{思|おも}います" → ý chính ở SAU でも.'],
        ['問題4', '発話表現 — nói gì trong tình huống', '4', 'Từ chối có lý do → ～わけにはいかない; gạt hiểu lầm → ～わけではない; bác bỏ có căn cứ → ～はずがない; hiểu ra → ～わけだ.'],
        ['問題5', '即時応答 — đáp ngay', '9', '"そんなはずはない" → đáp bằng bằng chứng ("でも、～よ"); "～わけじゃないんだって" → "{何|なに}か{事情|じじょう}があるのかな".'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật nghe các câu "suy luận" — cấp N3',
      items: [
        '**Nghe ĐUÔI câu** — tiếng Nhật đặt độ chắc ở cuối: **～に{違|ちが}いない** (chắc), **～はずだ** (chắc, có căn cứ), **～かもしれない** (có thể), **～はずがない／わけがない** (không thể). Một câu mở đầu "{犯人|はんにん}は{西川|にしかわ}さん…" có thể kết thúc bằng "…のはずがない" — đừng chọn đáp án khi chưa nghe hết câu.',
        '**Câu bị gạt đi = bẫy.** Trong 問題2, đáp án sai thường là những lý do người nói **đã nói ra rồi tự bác bỏ** ("{傘|かさ}ぐらいで{怒|おこ}るわけがない"). Đánh dấu ✗ ngay khi nghe ～わけがない／～はずがない／{違|ちが}う.',
        '**わけではない ≠ わけがない** khi nghe nhanh: **～わけじゃない** (văn nói) = "không hẳn là" — người nói chỉ **gạt một phần**; **～わけない** = "làm gì có" — gạt **hoàn toàn**. Nghe kỹ có **じゃ** hay không.',
        '**Mô tả đồ vật** (đồ thất lạc): ghi nhanh 4 ô — **màu** (～っぽい), **cỡ** ({小|ちい}さめ／{大|おお}きめ), **{目印|めじるし}** (キーホルダー, リボン…), **{中身|なかみ}**. Người nói hay **tự sửa** ("{黒|くろ}じゃなくて、こい{青|あお}だったかもしれません") — lấy thông tin SAU.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: quầy đồ thất lạc ở ga' },
    NG('b31-ng-1', '{女|おんな}の{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — túi đã được tìm thấy ở ga cuối, nhưng TRƯỚC khi đi lấy phải điền tên, số điện thoại, đồ bên trong vào phiếu (その前に). Khi nhận cần thẻ sinh viên — cô ấy đã mang theo.', [
      ['ナレーター', 'ja-nu', '{駅|えき}で、{女|おんな}の{留学生|りゅうがくせい}と{駅員|えきいん}が{話|はな}しています。{女|おんな}の{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか。', 'Eki de, onna no ryuugakusei to ekiin ga hanashite imasu. Onna no ryuugakusei wa kono ato mazu nani o shimasu ka.', 'Ở nhà ga, một nữ du học sinh và nhân viên nhà ga đang nói chuyện. Sau đây nữ du học sinh sẽ làm gì trước tiên?'],
      ['マリヤム', 'ja-nu', 'すみません。さっきの{電車|でんしゃ}に、{紙袋|かみぶくろ}を{置|お}き{忘|わす}れてしまったんですが……。', 'Sumimasen. Sakki no densha ni, kamibukuro o okiwasurete shimatta n desu ga…….', 'Xin lỗi anh. Tôi để quên một chiếc túi giấy trên chuyến tàu vừa rồi…'],
      ['{駅員|えきいん}', 'ja-nam', '{何時|なんじ}ごろの、どこ{行|ゆ}きの{電車|でんしゃ}ですか。', 'Nanji goro no, doko yuki no densha desu ka.', 'Chuyến tàu khoảng mấy giờ, đi đâu ạ?'],
      ['マリヤム', 'ja-nu', '10{時|じ}15{分|ふん}の、みなと{駅|えき}{行|ゆ}きです。{前|まえ}から3{両目|りょうめ}だったと{思|おも}います。', 'Juuji juugofun no, Minato-eki yuki desu. Mae kara sanryoume datta to omoimasu.', 'Chuyến 10 giờ 15 đi ga Minato ạ. Tôi nghĩ là toa thứ ba tính từ đầu.'],
      ['{駅員|えきいん}', 'ja-nam', '{袋|ふくろ}の{特徴|とくちょう}を{教|おし}えていただけますか。', 'Fukuro no tokuchou o oshiete itadakemasu ka.', 'Chị có thể cho biết đặc điểm của chiếc túi không ạ?'],
      ['マリヤム', 'ja-nu', '{白|しろ}っぽい{紙袋|かみぶくろ}で、{中身|なかみ}は{本|ほん}が2{冊|さつ}と、{青|あお}い{手袋|てぶくろ}です。', 'Shiroppoi kamibukuro de, nakami wa hon ga nisatsu to, aoi tebukuro desu.', 'Là túi giấy ngả trắng, bên trong có hai quyển sách và đôi găng tay màu xanh.'],
      ['{駅員|えきいん}', 'ja-nam', '{分|わ}かりました。{今|いま}、{終点|しゅうてん}のみなと{駅|えき}に{問|と}い{合|あ}わせますね。……あ、{白|しろ}っぽい{紙袋|かみぶくろ}が{一|ひと}つ{届|とど}いているそうです。ただ、{中身|なかみ}を{確認|かくにん}しないと、お{客様|きゃくさま}のものかどうか{分|わ}かりません。', 'Wakarimashita. Ima, shuuten no Minato-eki ni toiawasemasu ne. …… A, shiroppoi kamibukuro ga hitotsu todoite iru sou desu. Tada, nakami o kakunin shinai to, okyakusama no mono ka dou ka wakarimasen.', 'Tôi hiểu rồi. Giờ tôi hỏi ga cuối là ga Minato nhé. … À, nghe nói có một túi giấy ngả trắng được mang đến. Có điều phải kiểm tra đồ bên trong thì mới biết có phải của chị không.'],
      ['マリヤム', 'ja-nu', 'じゃ、{今|いま}からみなと{駅|えき}に{取|と}りに{行|い}けばいいですか。', 'Ja, ima kara Minato-eki ni tori ni ikeba ii desu ka.', 'Vậy bây giờ tôi đến ga Minato lấy là được ạ?'],
      ['{駅員|えきいん}', 'ja-nam', 'いえ、その{前|まえ}に、こちらの{用紙|ようし}にお{名前|なまえ}とお{電話番号|でんわばんごう}、それから{袋|ふくろ}の{中身|なかみ}を{書|か}いてください。みなと{駅|えき}に{送|おく}りますので。それから、{受|う}け{取|と}るときは、{学生証|がくせいしょう}など{身分|みぶん}の{分|わ}かるものが{必要|ひつよう}です。', 'Ie, sono mae ni, kochira no youshi ni onamae to odenwa bangou, sorekara fukuro no nakami o kaite kudasai. Minato-eki ni okurimasu node. Sorekara, uketoru toki wa, gakuseishou nado mibun no wakaru mono ga hitsuyou desu.', 'Không ạ, trước đó chị hãy viết tên, số điện thoại và đồ bên trong túi vào tờ phiếu này. Tôi sẽ gửi sang ga Minato. Ngoài ra, khi nhận cần giấy tờ tuỳ thân như thẻ sinh viên.'],
      ['マリヤム', 'ja-nu', '{学生証|がくせいしょう}なら、ここにあります。じゃ、これを{書|か}いてから{行|い}きます。', 'Gakuseishou nara, koko ni arimasu. Ja, kore o kaite kara ikimasu.', 'Thẻ sinh viên thì tôi có đây. Vậy tôi viết cái này xong rồi đi.'],
    ]),
    {
      t: 'mcq',
      id: 'b31-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか。', options: ['みなと{駅|えき}に{電話|でんわ}する', '{用紙|ようし}に{名前|なまえ}などを{書|か}く', 'みなと{駅|えき}に{袋|ふくろ}を{取|と}りに{行|い}く', '{学生証|がくせいしょう}を{取|と}りに{帰|かえ}る'], correct: 1, why: '**その{前|まえ}に、こちらの{用紙|ようし}に…{書|か}いてください** → **これを{書|か}いてから{行|い}きます**. Điện thoại cho ga Minato là việc nhân viên đã làm; thẻ sinh viên cô ấy đã mang theo. 〔Kore o kaite kara ikimasu.〕' },
        { q: '{袋|ふくろ}の{中|なか}に{何|なに}が{入|はい}っていますか。', options: ['{本|ほん}2{冊|さつ}と{青|あお}い{手袋|てぶくろ}', '{本|ほん}2{冊|さつ}と{学生証|がくせいしょう}', '{青|あお}い{手袋|てぶくろ}と{財布|さいふ}', '{白|しろ}い{手袋|てぶくろ}と{本|ほん}1{冊|さつ}'], correct: 0, why: '**{中身|なかみ}は{本|ほん}が2{冊|さつ}と、{青|あお}い{手袋|てぶくろ}です**. "{白|しろ}っぽい" là màu của TÚI, không phải găng tay. 〔Hon ga nisatsu to, aoi tebukuro desu.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: chuẩn bị báo cáo ゼミ' },
    NG('b31-ng-2', '{男|おとこ}の{学生|がくせい}は{今日|きょう}、{何|なに}をしなければなりませんか', 'Dạng 課題理解 — muốn sửa biểu đồ và gửi thứ Sáu, nhưng cô hẹn "trước thứ Tư" mà hôm nay là thứ Tư → 遅れるわけにはいかない → gửi tài liệu HÔM NAY. Tập thuyết trình: dời sang trưa mai (tối nay đi làm thêm).', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で、{男|おとこ}の{学生|がくせい}と{女|おんな}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}は{今日|きょう}、{何|なに}をしなければなりませんか。', 'Daigaku de, otoko no gakusei to onna no gakusei ga hanashite imasu. Otoko no gakusei wa kyou, nani o shinakereba narimasen ka.', 'Ở trường, một nam sinh và một nữ sinh đang nói chuyện. Hôm nay nam sinh phải làm gì?'],
      ['リン', 'ja-nu', 'カルロスさん、{来週|らいしゅう}の{発表|はっぴょう}の{資料|しりょう}、もう{先生|せんせい}に{送|おく}りましたか。', 'Karurosu-san, raishuu no happyou no shiryou, mou sensei ni okurimashita ka.', 'Anh Carlos, tài liệu cho buổi báo cáo tuần sau anh đã gửi cho cô chưa?'],
      ['カルロス', 'ja-nam', 'まだなんだ。グラフを{作|つく}り{直|なお}したいから、{金曜日|きんようび}に{送|おく}ろうと{思|おも}って。', 'Mada na n da. Gurafu o tsukurinaoshitai kara, kin\'youbi ni okurou to omotte.', 'Chưa. Anh muốn làm lại biểu đồ nên định thứ Sáu mới gửi.'],
      ['リン', 'ja-nu', 'え、でも{先生|せんせい}は「{水曜日|すいようび}までに{送|おく}ってください」っておっしゃっていましたよ。{今日|きょう}が{水曜日|すいようび}です。', 'E, demo sensei wa "Suiyoubi made ni okutte kudasai" tte osshatte imashita yo. Kyou ga suiyoubi desu.', 'Ơ, nhưng cô đã dặn "Gửi trước thứ Tư nhé" mà. Hôm nay là thứ Tư rồi.'],
      ['カルロス', 'ja-nam', 'そうか……。{先生|せんせい}との{約束|やくそく}だから、{遅|おく}れるわけにはいかないね。じゃ、グラフは{今|いま}のままで、{今日|きょう}{送|おく}るよ。', 'Sou ka……. Sensei to no yakusoku da kara, okureru wake ni wa ikanai ne. Ja, gurafu wa ima no mama de, kyou okuru yo.', 'Thế à… Đã hẹn với cô thì không thể trễ được. Vậy biểu đồ cứ để như hiện tại, anh gửi ngay hôm nay.'],
      ['リン', 'ja-nu', 'それから、{発表|はっぴょう}の{練習|れんしゅう}も{一回|いっかい}しませんか。', 'Sorekara, happyou no renshuu mo ikkai shimasen ka.', 'Còn nữa, mình tập thuyết trình một lần nhé?'],
      ['カルロス', 'ja-nam', '{練習|れんしゅう}はしたいけど、{今日|きょう}は{夜|よる}までアルバイトなんだ。{急|きゅう}に{休|やす}むわけにもいかないし……。{明日|あした}のお{昼|ひる}はどう？', 'Renshuu wa shitai kedo, kyou wa yoru made arubaito na n da. Kyuu ni yasumu wake ni mo ikanai shi……. Ashita no ohiru wa dou?', 'Anh cũng muốn tập, nhưng hôm nay anh làm thêm tới tối. Đột ngột xin nghỉ thì cũng không được… Trưa mai thì sao?'],
      ['リン', 'ja-nu', 'いいですよ。じゃ、{明日|あした}の{昼休|ひるやす}みに。', 'Ii desu yo. Ja, ashita no hiruyasumi ni.', 'Được ạ. Vậy hẹn giờ nghỉ trưa mai nhé.'],
    ]),
    {
      t: 'mcq',
      id: 'b31-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{学生|がくせい}は{今日|きょう}、{何|なに}をしなければなりませんか。', options: ['グラフを{作|つく}り{直|なお}す', '{発表|はっぴょう}の{練習|れんしゅう}をする', '{資料|しりょう}を{先生|せんせい}に{送|おく}る', 'アルバイトを{休|やす}む'], correct: 2, why: '**{遅|おく}れるわけにはいかない…{今日|きょう}{送|おく}るよ**. Biểu đồ "để như hiện tại"; tập thuyết trình dời sang trưa mai; làm thêm thì "không thể nghỉ". 〔Kyou okuru yo.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: vì sao マリヤム giận?' },
    NG('b31-ng-3', 'マリヤムさんはどうして{怒|おこ}っていますか', 'Dạng ポイント理解 — hai lý do ダニエル đoán (quên trả ô, ăn mất bánh) đều bị gạt (傘ぐらいで怒るわけがない / 誰が食べてもいいって言っていた). Lý do thật: mở loa nghe nhạc tới 2 giờ đêm, chị ấy phải dậy đi làm lúc 6 giờ → 道理で目が赤いわけだ.', [
      ['ナレーター', 'ja-nu', '{寮|りょう}で、{男|おとこ}の{留学生|りゅうがくせい}と{女|おんな}の{留学生|りゅうがくせい}が{話|はな}しています。マリヤムさんはどうして{怒|おこ}っていますか。', 'Ryou de, otoko no ryuugakusei to onna no ryuugakusei ga hanashite imasu. Mariyamu-san wa doushite okotte imasu ka.', 'Ở ký túc xá, một nam du học sinh và một nữ du học sinh đang nói chuyện. Vì sao chị Mariam đang giận?'],
      ['ダニエル', 'ja-nam', 'リンさん、マリヤムさん、{今朝|けさ}からずっと{怒|おこ}っているみたいなんだけど、{何|なに}か{知|し}らない？', 'Rin-san, Mariyamu-san, kesa kara zutto okotte iru mitai na n da kedo, nani ka shiranai?', 'Linh này, chị Mariam hình như giận từ sáng tới giờ, em có biết gì không?'],
      ['リン', 'ja-nu', 'え、ダニエルさん、{何|なに}かしたんですか。', 'E, Danieru-san, nani ka shita n desu ka.', 'Hả, anh Daniel đã làm gì à?'],
      ['ダニエル', 'ja-nam', '{昨日|きのう}、マリヤムさんに{借|か}りた{傘|かさ}を{返|かえ}すのを{忘|わす}れたんだ。それで{怒|おこ}っているに{違|ちが}いないよ。', 'Kinou, Mariyamu-san ni karita kasa o kaesu no o wasureta n da. Sorede okotte iru ni chigainai yo.', 'Hôm qua anh quên trả cái ô mượn của chị ấy. Chắc chắn là vì thế mà chị ấy giận.'],
      ['リン', 'ja-nu', 'うーん、マリヤムさんは{傘|かさ}ぐらいで{怒|おこ}るわけがないですよ。', 'Uun, Mariyamu-san wa kasa gurai de okoru wake ga nai desu yo.', 'Ừm, chị Mariam làm gì có chuyện giận chỉ vì cái ô.'],
      ['ダニエル', 'ja-nam', 'じゃ、{僕|ぼく}が{冷蔵庫|れいぞうこ}のケーキを{食|た}べちゃったからかな。', 'Ja, boku ga reizouko no keeki o tabechatta kara ka na.', 'Vậy là vì anh lỡ ăn chiếc bánh trong tủ lạnh chăng?'],
      ['リン', 'ja-nu', 'あれは、マリヤムさんが「{誰|だれ}が{食|た}べてもいいよ」って{言|い}っていましたから、{違|ちが}うと{思|おも}います。……あ、もしかして、{昨日|きのう}の{夜|よる}、{何時|なんじ}まで{音楽|おんがく}を{聞|き}いていましたか。', 'Are wa, Mariyamu-san ga "Dare ga tabete mo ii yo" tte itte imashita kara, chigau to omoimasu. …… A, moshikashite, kinou no yoru, nanji made ongaku o kiite imashita ka.', 'Cái đó chị Mariam bảo "Ai ăn cũng được" rồi nên em nghĩ không phải. … À, không lẽ… tối qua anh nghe nhạc đến mấy giờ?'],
      ['ダニエル', 'ja-nam', '2{時|じ}ごろまで……スピーカーで。', 'Niji goro made…… supiikaa de.', 'Tới khoảng 2 giờ… bằng loa.'],
      ['リン', 'ja-nu', 'それですよ。マリヤムさん、{今日|きょう}は{朝|あさ}6{時|じ}からアルバイトだったんです。{隣|となり}の{部屋|へや}がうるさくて{眠|ねむ}れなかったって{言|い}っていました。', 'Sore desu yo. Mariyamu-san, kyou wa asa rokuji kara arubaito datta n desu. Tonari no heya ga urusakute nemurenakatta tte itte imashita.', 'Chính là nó đấy. Hôm nay chị Mariam đi làm thêm từ 6 giờ sáng. Chị ấy kể phòng bên cạnh ồn quá nên không ngủ được.'],
      ['ダニエル', 'ja-nam', 'なるほど……。{道理|どうり}で{朝|あさ}から{目|め}が{赤|あか}いわけだ。すぐ{謝|あやま}ってくる。', 'Naruhodo……. Douri de asa kara me ga akai wake da. Sugu ayamatte kuru.', 'Ra vậy… Thảo nào từ sáng mắt chị ấy đỏ hoe. Anh đi xin lỗi ngay đây.'],
    ]),
    {
      t: 'mcq',
      id: 'b31-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: 'マリヤムさんはどうして{怒|おこ}っていますか。', options: ['{傘|かさ}を{返|かえ}してもらえなかったから', 'ケーキを{食|た}べられてしまったから', '{夜|よる}{遅|おそ}くまで{隣|となり}の{部屋|へや}がうるさかったから', 'アルバイトに{遅|おく}れてしまったから'], correct: 2, why: 'Hai lý do đầu bị gạt (**{怒|おこ}るわけがない**, **{違|ちが}うと{思|おも}います**). Lý do thật: **{隣|となり}の{部屋|へや}がうるさくて{眠|ねむ}れなかった** — ダニエル mở loa đến 2 giờ. 〔Tonari no heya ga urusakute nemurenakatta.〕' },
        { q: 'ダニエルさんは{最後|さいご}に{何|なに}が{分|わ}かりましたか。', options: ['マリヤムさんの{目|め}が{赤|あか}い{理由|りゆう}', 'マリヤムさんのアルバイトの{場所|ばしょ}', 'ケーキを{食|た}べてもいい{理由|りゆう}', '{傘|かさ}がどこにあるか'], correct: 0, why: '**{道理|どうり}で{朝|あさ}から{目|め}が{赤|あか}いわけだ** — わけだ: hiểu ra lý do của điều đã thấy (mắt đỏ = thiếu ngủ). 〔Douri de asa kara me ga akai wake da.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題3 概要理解: radio — "Cách thưởng thức truyện trinh thám"' },
    NG('b31-ng-4', '{作家|さっか}は{推理小説|すいりしょうせつ}について{何|なに}と{言|い}っていますか', 'Dạng 概要理解 — mở bằng ý số đông ("chắc chắn thủ phạm là người này") → でも → ý chính: đoán đúng hay sai KHÔNG quan trọng; vui nhất là tự tìm manh mối và tự nghĩ lý do. Câu tóm tắt của người dẫn ở cuối xác nhận ý chính.', [
      ['ナレーター', 'ja-nu', 'ラジオで、{司会者|しかいしゃ}と{作家|さっか}が{話|はな}しています。', 'Rajio de, shikaisha to sakka ga hanashite imasu.', 'Trên radio, người dẫn chương trình và một nhà văn đang trò chuyện.'],
      ['{司会者|しかいしゃ}', 'ja-nu', '{今日|きょう}は、{推理小説|すいりしょうせつ}を{書|か}いていらっしゃる{作家|さっか}の{先生|せんせい}にお{話|はなし}を{伺|うかが}います。{先生|せんせい}、{推理小説|すいりしょうせつ}を{楽|たの}しむコツはありますか。', 'Kyou wa, suiri shousetsu o kaite irassharu sakka no sensei ni ohanashi o ukagaimasu. Sensei, suiri shousetsu o tanoshimu kotsu wa arimasu ka.', 'Hôm nay chúng tôi xin được trò chuyện với một nhà văn viết truyện trinh thám. Thưa ông, có bí quyết nào để thưởng thức truyện trinh thám không ạ?'],
      ['{作家|さっか}', 'ja-nam', 'そうですね。{多|おお}くの{読者|どくしゃ}は、{最後|さいご}まで{読|よ}む{前|まえ}に「{犯人|はんにん}はこの{人|ひと}に{違|ちが}いない」と{考|かんが}えますよね。でも、{私|わたし}は、{推理|すいり}が{当|あ}たるかどうかは、それほど{大切|たいせつ}ではないと{思|おも}っています。', 'Sou desu ne. Ooku no dokusha wa, saigo made yomu mae ni "Hannin wa kono hito ni chigainai" to kangaemasu yo ne. Demo, watashi wa, suiri ga ataru ka dou ka wa, sorehodo taisetsu de wa nai to omotte imasu.', 'Vâng. Nhiều độc giả, trước khi đọc tới cuối, đã nghĩ "Thủ phạm chắc chắn là người này". Nhưng tôi cho rằng suy luận có đúng hay không thì không quan trọng đến thế.'],
      ['{作家|さっか}', 'ja-nam', '{推理小説|すいりしょうせつ}の{中|なか}には、{小|ちい}さな{手|て}がかりがたくさん{隠|かく}れています。それを{一|ひと}つずつ{見|み}つけて、「この{人|ひと}が{犯人|はんにん}のはずがない。なぜなら……」と、{自分|じぶん}で{理由|りゆう}を{考|かんが}える。その{時間|じかん}が、いちばん{楽|たの}しいんです。', 'Suiri shousetsu no naka ni wa, chiisana tegakari ga takusan kakurete imasu. Sore o hitotsu zutsu mitsukete, "Kono hito ga hannin no hazu ga nai. Nazenara……" to, jibun de riyuu o kangaeru. Sono jikan ga, ichiban tanoshii n desu.', 'Trong truyện trinh thám có rất nhiều manh mối nhỏ được giấu kín. Tìm ra từng cái một, rồi tự mình nghĩ ra lý do: "Người này không thể là thủ phạm. Vì…". Khoảng thời gian đó mới là vui nhất.'],
      ['{作家|さっか}', 'ja-nam', 'ですから、{推理|すいり}が{外|はず}れても、がっかりしなくていいんですよ。{最後|さいご}に{謎|なぞ}が{解|と}けたとき、「ああ、だからあの{人|ひと}はあんなことを{言|い}ったわけだ」と{分|わ}かる。それも{推理小説|すいりしょうせつ}の{楽|たの}しみの{一|ひと}つです。', 'Desu kara, suiri ga hazurete mo, gakkari shinakute ii n desu yo. Saigo ni nazo ga toketa toki, "Aa, dakara ano hito wa anna koto o itta wake da" to wakaru. Sore mo suiri shousetsu no tanoshimi no hitotsu desu.', 'Vì vậy, suy luận có trật thì cũng không cần thất vọng. Đến cuối khi bí ẩn được giải, ta hiểu ra "À, thảo nào người đó đã nói như vậy". Đó cũng là một niềm vui của truyện trinh thám.'],
      ['{司会者|しかいしゃ}', 'ja-nu', 'なるほど。{犯人|はんにん}を{当|あ}てることより、{自分|じぶん}で{考|かんが}える{時間|じかん}を{楽|たの}しむということですね。', 'Naruhodo. Hannin o ateru koto yori, jibun de kangaeru jikan o tanoshimu to iu koto desu ne.', 'Ra vậy. Tức là thưởng thức khoảng thời gian tự mình suy nghĩ hơn là đoán trúng thủ phạm, phải không ạ.'],
    ]),
    {
      t: 'mcq',
      id: 'b31-ng-4-q',
      title: 'Bài 4 — chọn đáp án (2 câu)',
      items: [
        { q: '{作家|さっか}は{推理小説|すいりしょうせつ}の{何|なに}がいちばん{楽|たの}しいと{言|い}っていますか。', options: ['{犯人|はんにん}を{早|はや}く{当|あ}てること', '{手|て}がかりを{見|み}つけて、{自分|じぶん}で{理由|りゆう}を{考|かんが}えること', '{最後|さいご}のページを{先|さき}に{読|よ}むこと', '{推理|すいり}が{当|あ}たって、{友達|ともだち}に{話|はな}すこと'], correct: 1, why: '**{一|ひと}つずつ{見|み}つけて…{自分|じぶん}で{理由|りゆう}を{考|かんが}える。その{時間|じかん}が、いちばん{楽|たの}しい**. Ý "đoán trúng" (選択肢1) đã bị gạt bằng "でも…{大切|たいせつ}ではない". 〔Jibun de riyuu o kangaeru. Sono jikan ga ichiban tanoshii.〕' },
        { q: '{作家|さっか}によると、{推理|すいり}が{外|はず}れたらどうすればいいですか。', options: ['もう{一度|いちど}{最初|さいしょ}から{読|よ}む', 'がっかりしなくていい', 'ほかの{読者|どくしゃ}と{話|はな}し{合|あ}う', '{作家|さっか}に{手紙|てがみ}を{書|か}く'], correct: 1, why: '**{推理|すいり}が{外|はず}れても、がっかりしなくていいんですよ**. 〔Hazurete mo, gakkari shinakute ii n desu yo.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題4 発話表現: nói gì trong tình huống (4 câu)' },
    NG('b31-ng-5', '{何|なん}と{言|い}いますか', 'Dạng 発話表現 — nghe tình huống, chọn câu nói phù hợp nhất. ① từ chối có lý do đạo lý → わけにはいかない · ② gạt hiểu lầm → わけではない · ③ hiểu ra lý do → わけだ · ④ bác bỏ có căn cứ → はずがない.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。{友達|ともだち}がテストの{答|こた}えを{見|み}せてほしいと{言|い}っています。{断|ことわ}ります。{何|なん}と{言|い}いますか。', 'Ichiban. Tomodachi ga tesuto no kotae o misete hoshii to itte imasu. Kotowarimasu. Nan to iimasu ka.', 'Câu 1. Bạn muốn bạn cho xem đáp án bài kiểm tra. Bạn từ chối. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。{先輩|せんぱい}に「パーティーに{来|こ}なかったのは、{僕|ぼく}のことが{嫌|きら}いだから？」と{聞|き}かれました。{違|ちが}うと{言|い}います。{何|なん}と{言|い}いますか。', 'Niban. Senpai ni "Paatii ni konakatta no wa, boku no koto ga kirai da kara?" to kikaremashita. Chigau to iimasu. Nan to iimasu ka.', 'Câu 2. Đàn anh hỏi: "Em không đến tiệc là vì ghét anh à?". Bạn nói là không phải. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。{友達|ともだち}がずっと{探|さが}していた{鍵|かぎ}が、かばんの{奥|おく}から{出|で}てきました。{何|なん}と{言|い}いますか。', 'Sanban. Tomodachi ga zutto sagashite ita kagi ga, kaban no oku kara dete kimashita. Nan to iimasu ka.', 'Câu 3. Chiếc chìa khoá bạn của bạn tìm mãi đã lòi ra từ đáy cặp. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '4{番|ばん}。{友達|ともだち}が{財布|さいふ}を{拾|ひろ}って「これ、{山口|やまぐち}さんのじゃない？」と{言|い}いました。{山口|やまぐち}さんは{今日|きょう}{休|やす}みです。{何|なん}と{言|い}いますか。', 'Yonban. Tomodachi ga saifu o hirotte "Kore, Yamaguchi-san no ja nai?" to iimashita. Yamaguchi-san wa kyou yasumi desu. Nan to iimasu ka.', 'Câu 4. Bạn nhặt được một chiếc ví và nói: "Cái này có phải của Yamaguchi không?". Hôm nay Yamaguchi nghỉ. Bạn nói gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b31-ng-5-q',
      title: 'Bài 5 — chọn câu đúng',
      items: [
        { q: '1{番|ばん}', options: ['ごめん、{見|み}せるわけだよ。', 'ごめん、{見|み}せるわけにはいかないよ。', 'ごめん、{見|み}せるに{違|ちが}いないよ。'], correct: 1, why: 'Có thể cho xem nhưng lẽ phải không cho → **わけにはいかない** (⑦). 〔Gomen, miseru wake ni wa ikanai yo.〕' },
        { q: '2{番|ばん}', options: ['{先輩|せんぱい}が{嫌|きら}いに{違|ちが}いないです。', '{先輩|せんぱい}が{嫌|きら}いなはずです。', '{先輩|せんぱい}が{嫌|きら}いなわけではないんです。{熱|ねつ}があったんです。'], correct: 2, why: 'Gạt đi kết luận đàn anh nghĩ + nêu lý do thật → **わけではないんです** (⑥). 〔Kirai na wake de wa nai n desu. Netsu ga atta n desu.〕' },
        { q: '3{番|ばん}', options: ['だから{見|み}つからなかったわけだね。', '{見|み}つかるはずがないね。', '{見|み}つからないわけにはいかないね。'], correct: 0, why: 'Vừa thấy lý do (ở đáy cặp) của chuyện "tìm mãi không thấy" → **だから～わけだ** (⑤). 〔Dakara mitsukaranakatta wake da ne.〕' },
        { q: '4{番|ばん}', options: ['{山口|やまぐち}さんのに{違|ちが}いないよ。', '{山口|やまぐち}さんは{今日|きょう}{休|やす}みだから、{山口|やまぐち}さんのはずがないよ。', '{山口|やまぐち}さんのわけだよ。'], correct: 1, why: 'Có căn cứ (hôm nay nghỉ) → bác bỏ → **はずがない** (②). 〔Yamaguchi-san no hazu ga nai yo.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題5 即時応答: đáp ngay (8 câu)' },
    NG('b31-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください', 'Dạng 即時応答 — nghe một câu, chọn câu đáp tự nhiên nhất. Chú ý: っこない (= わけがない), そんなはずはない (phản bác → đáp bằng bằng chứng), わけじゃないんだって (→ có lý do riêng).', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['{男|おとこ}の{人|ひと}', 'ja-nam', 'この{問題|もんだい}、{難|むずか}しすぎて、{一人|ひとり}じゃ{解|と}けっこないよ。', 'Kono mondai, muzukashisugite, hitori ja tokekkonai yo.', 'Bài này khó quá, một mình thì làm sao giải nổi.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['{女|おんな}の{人|ひと}', 'ja-nu', '{熱|ねつ}っぽいんだけど、{今日|きょう}のバイト、{休|やす}むわけにはいかないんだ。', 'Netsuppoi n da kedo, kyou no baito, yasumu wake ni wa ikanai n da.', 'Mình hơi sốt, nhưng ca làm hôm nay không thể nghỉ được.'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。', 'Sanban.', 'Câu 3.'],
      ['{男|おとこ}の{人|ひと}', 'ja-nam', '{西川|にしかわ}さん、よく{遅刻|ちこく}するけど、{別|べつ}に{怠|なま}けているわけじゃないんだって。', 'Nishikawa-san, yoku chikoku suru kedo, betsu ni namakete iru wake ja nai n datte.', 'Anh Nishikawa hay đến muộn, nhưng nghe nói không phải vì lười đâu.'],
      ['ナレーター', 'ja-nu', '4{番|ばん}。', 'Yonban.', 'Câu 4.'],
      ['{女|おんな}の{人|ひと}', 'ja-nu', 'え、あの{店|みせ}、{今日|きょう}{休|やす}み？そんなはずはないよ。', 'E, ano mise, kyou yasumi? Sonna hazu wa nai yo.', 'Hả, quán đó hôm nay nghỉ à? Không thể nào.'],
      ['ナレーター', 'ja-nu', '5{番|ばん}。', 'Goban.', 'Câu 5.'],
      ['{男|おとこ}の{人|ひと}', 'ja-nam', '{部屋|へや}の{電気|でんき}、{消|き}えてるね。リンさん、もう{寝|ね}てるに{違|ちが}いないよ。', 'Heya no denki, kieteru ne. Rin-san, mou neteru ni chigainai yo.', 'Đèn phòng tắt rồi nhỉ. Linh chắc chắn ngủ rồi.'],
      ['ナレーター', 'ja-nu', '6{番|ばん}。', 'Rokuban.', 'Câu 6.'],
      ['{女|おんな}の{人|ひと}', 'ja-nu', 'この{時計|とけい}、{安|やす}っぽく{見|み}えるけど、{実|じつ}はすごく{高|たか}いんだよ。', 'Kono tokei, yasuppoku mieru kedo, jitsu wa sugoku takai n da yo.', 'Cái đồng hồ này trông rẻ tiền, nhưng thật ra đắt lắm đấy.'],
      ['ナレーター', 'ja-nu', '7{番|ばん}。', 'Nanaban.', 'Câu 7.'],
      ['{男|おとこ}の{人|ひと}', 'ja-nam', '{教室|きょうしつ}の{窓|まど}、{全部|ぜんぶ}{開|あ}いてたよ。', 'Kyoushitsu no mado, zenbu aiteta yo.', 'Cửa sổ lớp học mở hết cả đấy.'],
      ['ナレーター', 'ja-nu', '8{番|ばん}。', 'Hachiban.', 'Câu 8.'],
      ['{女|おんな}の{人|ひと}', 'ja-nu', 'カルロスさんって、{料理|りょうり}が{嫌|きら}いなの？いつもコンビニのお{弁当|べんとう}だよね。', 'Karurosu-san tte, ryouri ga kirai na no? Itsumo konbini no obentou da yo ne.', 'Carlos ghét nấu ăn à? Lúc nào cũng ăn cơm hộp cửa hàng tiện lợi nhỉ.'],
    ]),
    {
      t: 'mcq',
      id: 'b31-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '1{番|ばん}', options: ['{解|と}けてよかったね。', 'じゃ、{一緒|いっしょ}に{考|かんが}えようか。', '{解|と}けるわけだね。'], correct: 1, why: '**{解|と}けっこない** = {解|と}けるわけがない (không giải nổi) → đề nghị giúp. 〔Ja, issho ni kangaeyou ka.〕' },
        { q: '2{番|ばん}', options: ['{無理|むり}しないで、{店長|てんちょう}に{相談|そうだん}したら？', '{熱|ねつ}がないわけだね。', 'じゃ、{休|やす}むんだね。'], correct: 0, why: 'Bạn nói "không thể nghỉ" dù sốt → khuyên đừng cố, hỏi ý chủ quán. 〔Muri shinaide, tenchou ni soudan shitara?〕' },
        { q: '3{番|ばん}', options: ['やっぱり{怠|なま}けているんだね。', '{遅刻|ちこく}するわけがないね。', 'へえ、{何|なに}か{事情|じじょう}があるのかな。'], correct: 2, why: '**{怠|なま}けているわけじゃない** = không phải vì lười → chắc có **{事情|じじょう}** (lý do riêng). 〔Nani ka jijou ga aru no ka na.〕' },
        { q: '4{番|ばん}', options: ['でも、シャッターが{閉|し}まってるよ。', 'うん、{休|やす}みのはずだね。', '{休|やす}みでよかったね。'], correct: 0, why: '**そんなはずはない** (không thể nghỉ) → đáp bằng **bằng chứng** ngược lại: cửa cuốn đang đóng. 〔Demo, shattaa ga shimatteru yo.〕' },
        { q: '5{番|ばん}', options: ['うん、{起|お}きているわけだね。', 'じゃ、{明日|あした}{話|はな}そう。', '{寝|ね}るわけにはいかないね。'], correct: 1, why: 'Chắc chắn ngủ rồi → để mai nói chuyện. 〔Ja, ashita hanasou.〕' },
        { q: '6{番|ばん}', options: ['{安|やす}いから{買|か}ったんだね。', 'へえ、そうは{見|み}えないね。', '{高|たか}く{見|み}えるね。'], correct: 1, why: '**{安|やす}っぽく{見|み}える** (trông rẻ tiền) nhưng thật ra đắt → "Ồ, trông không giống vậy nhỉ". 〔Hee, sou wa mienai ne.〕' },
        { q: '7{番|ばん}', options: ['{道理|どうり}で{寒|さむ}いわけだ。', '{寒|さむ}いはずがないね。', '{開|あ}けるわけにはいかないね。'], correct: 0, why: 'Biết lý do (cửa sổ mở) → **{道理|どうり}で{寒|さむ}いわけだ** (⑤). 〔Douri de samui wake da.〕' },
        { q: '8{番|ばん}', options: ['{嫌|きら}いに{違|ちが}いないよ。', '{嫌|きら}いなわけじゃないけど、{時間|じかん}がないんだって。', '{料理|りょうり}をするわけにはいかないよ。'], correct: 1, why: 'Gạt suy đoán "ghét nấu ăn" + lý do thật → **わけじゃない** (⑥). 〔Kirai na wake ja nai kedo, jikan ga nai n datte.〕' },
      ],
    },

    /* ── 7 ── */
    { t: 'h', text: 'Bài 7 — 問題2 ポイント理解: ở đồn cảnh sát — chiếc ba lô nào?' },
    NG('b31-ng-7', '{男|おとこ}の{留学生|りゅうがくせい}のリュックはどれですか', 'Dạng ポイント理解 — tự sửa màu ("黒っぽい… à không, xanh đậm"), cỡ nhỏ, móc khoá vàng làm dấu, hai túi trước (một cái hỏng khoá kéo nên trông như một). Ví KHÔNG ở trong ba lô (để ở túi quần).', [
      ['ナレーター', 'ja-nu', '{交番|こうばん}で、{警察官|けいさつかん}と{男|おとこ}の{留学生|りゅうがくせい}が{話|はな}しています。{男|おとこ}の{留学生|りゅうがくせい}のリュックはどれですか。', 'Kouban de, keisatsukan to otoko no ryuugakusei ga hanashite imasu. Otoko no ryuugakusei no ryukku wa dore desu ka.', 'Ở đồn cảnh sát, một nữ cảnh sát và một nam du học sinh đang nói chuyện. Ba lô của nam du học sinh là cái nào?'],
      ['ダニエル', 'ja-nam', 'すみません、リュックをなくしてしまったんですが……。', 'Sumimasen, ryukku o nakushite shimatta n desu ga…….', 'Xin lỗi chị, tôi làm mất ba lô…'],
      ['{警察官|けいさつかん}', 'ja-nu', 'どんなリュックですか。', 'Donna ryukku desu ka.', 'Ba lô như thế nào?'],
      ['ダニエル', 'ja-nam', '{黒|くろ}っぽいリュックです。あ、{黒|くろ}じゃなくて、こい{青|あお}だったかもしれません。', 'Kuroppoi ryukku desu. A, kuro ja nakute, koi ao datta kamo shiremasen.', 'Ba lô màu đen đen. À, không phải đen, có khi là xanh đậm.'],
      ['{警察官|けいさつかん}', 'ja-nu', '{大|おお}きさは？', 'Ookisa wa?', 'Kích cỡ thì sao?'],
      ['ダニエル', 'ja-nam', '{小|ちい}さめです。{前|まえ}にポケットが{二|ふた}つあって……。あ、{目印|めじるし}に、{黄色|きいろ}いキーホルダーを{付|つ}けています。', 'Chiisame desu. Mae ni poketto ga futatsu atte……. A, mejirushi ni, kiiroi kiihorudaa o tsukete imasu.', 'Cỡ hơi nhỏ. Phía trước có hai túi… À, tôi có gắn móc khoá màu vàng để làm dấu.'],
      ['{警察官|けいさつかん}', 'ja-nu', '{中身|なかみ}は{何|なん}ですか。', 'Nakami wa nan desu ka.', 'Bên trong có gì?'],
      ['ダニエル', 'ja-nam', 'ノートパソコンと、{学生証|がくせいしょう}です。{財布|さいふ}はズボンのポケットに{入|い}れていたので、{入|はい}っていません。', 'Nooto pasokon to, gakuseishou desu. Saifu wa zubon no poketto ni irete ita node, haitte imasen.', 'Máy tính xách tay và thẻ sinh viên. Ví thì tôi để ở túi quần nên không có trong đó.'],
      ['{警察官|けいさつかん}', 'ja-nu', '{少|すこ}し{待|ま}ってくださいね。……さっき、{公園|こうえん}で{拾|ひろ}われたリュックが{届|とど}いています。こい{青|あお}で、{黄色|きいろ}いキーホルダー……。でも、ポケットは{一|ひと}つですね。', 'Sukoshi matte kudasai ne. …… Sakki, kouen de hirowareta ryukku ga todoite imasu. Koi ao de, kiiroi kiihorudaa……. Demo, poketto wa hitotsu desu ne.', 'Anh đợi chút nhé. … Lúc nãy có một ba lô được nhặt ở công viên mang đến. Màu xanh đậm, móc khoá vàng… Nhưng túi chỉ có một cái thôi.'],
      ['ダニエル', 'ja-nam', 'え、そんなはずは……。あ、{一|ひと}つはファスナーが{壊|こわ}れていて、{閉|し}まらないんです。だから、ポケットに{見|み}えないかもしれません。', 'E, sonna hazu wa……. A, hitotsu wa fasunaa ga kowarete ite, shimaranai n desu. Dakara, poketto ni mienai kamo shiremasen.', 'Ơ, không thể nào… À, một cái bị hỏng khoá kéo, không kéo lại được. Nên có thể trông không ra là túi.'],
      ['{警察官|けいさつかん}', 'ja-nu', '{中|なか}に{学生証|がくせいしょう}が{入|はい}っていますね。……{写真|しゃしん}もご{本人|ほんにん}ですね。よかったです。', 'Naka ni gakuseishou ga haitte imasu ne. …… Shashin mo gohonnin desu ne. Yokatta desu.', 'Bên trong có thẻ sinh viên. … Ảnh cũng đúng là anh. May quá.'],
    ]),
    {
      t: 'mcq',
      id: 'b31-ng-7-q',
      title: 'Bài 7 — chọn đáp án (2 câu)',
      items: [
        { q: '{男|おとこ}の{留学生|りゅうがくせい}のリュックはどれですか。', options: ['{黒|くろ}くて{大|おお}きいリュック', '{黄色|きいろ}くて、ポケットが{一|ひと}つのリュック', 'こい{青|あお}で、{黄色|きいろ}いキーホルダーが{付|つ}いた{小|ちい}さめのリュック', '{青|あお}くて、{財布|さいふ}が{入|はい}っているリュック'], correct: 2, why: 'Tự sửa: **{黒|くろ}じゃなくて、こい{青|あお}** · **{小|ちい}さめ** · **{目印|めじるし}に、{黄色|きいろ}いキーホルダー**. Màu vàng là của MÓC KHOÁ, không phải ba lô. 〔Koi ao… chiisame… kiiroi kiihorudaa.〕' },
        { q: 'リュックについて、{話|はなし}と{合|あ}っているものはどれですか。', options: ['{財布|さいふ}は{入|はい}っていない', 'ノートパソコンは{入|はい}っていない', 'ポケットは{本当|ほんとう}に{一|ひと}つしかない', '{留学生|りゅうがくせい}が{自分|じぶん}で{公園|こうえん}で{見|み}つけた'], correct: 0, why: '**{財布|さいふ}はズボンのポケットに{入|い}れていたので、{入|はい}っていません**. Ba lô có HAI túi (một cái hỏng khoá kéo); người khác nhặt ở công viên rồi mang đến đồn. 〔Saifu wa… haitte imasen.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài nghe',
      items: [
        '**{駅員|えきいん}** (nhân viên nhà ga) · **～{行|ゆ}き** (chuyến đi… — みなと{駅|えき}{行|ゆ}き) · **～{両目|りょうめ}** (toa thứ…) · **{終点|しゅうてん}** (ga cuối) · **{問|と}い{合|あ}わせる** (hỏi, liên hệ — N3) · **{用紙|ようし}** (tờ phiếu, mẫu đơn) · **{身分|みぶん}の{分|わ}かるもの** (giấy tờ tuỳ thân).',
        '**{作|つく}り{直|なお}す** (làm lại — Vます＋{直|なお}す) · **おっしゃる** (nói — tôn kính, Bài 24) · **～ぐらいで** (chỉ vì… — xem nhẹ) · **スピーカー** (loa) · **{謝|あやま}る** (xin lỗi).',
        '**{司会者|しかいしゃ}** (người dẫn chương trình) · **{作家|さっか}** (nhà văn) · **{伺|うかが}う** (hỏi — khiêm nhường, Bài 24) · **コツ** (bí quyết) · **{読者|どくしゃ}** (độc giả) · **{当|あ}たる／{外|はず}れる** (trúng / trật) · **なぜなら** (bởi vì — N3) · **がっかりする** (thất vọng).',
        '**{解|と}けっこない** (= {解|と}けるわけがない — N2, rất thân mật) · **{怠|なま}ける** (lười — N3) · **シャッター** (cửa cuốn) · **{警察官|けいさつかん}** (cảnh sát) · **{小|ちい}さめ** (hơi nhỏ) · **こい** (đậm — {濃|こ}い, N2) · **キーホルダー** (móc khoá) · **ファスナー** (khoá kéo) · **ご{本人|ほんにん}** (chính chủ — kính ngữ).',
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b31-doc',
  kind: 'reading',
  title: 'Đọc hiểu N3 — thông báo đồ thất lạc của phòng công tác sinh viên (短文), bài văn "Bí ẩn chiếc ô đỏ" của リン (中文〜長文), danh sách đồ thất lạc (情報検索)',
  goal: 'Đọc thông báo ~300 chữ để biết quy trình, thời hạn và ngoại lệ (ただし・～場合は・～ではなく); đọc bài văn ~700 chữ có cấu trúc trinh thám — giả thuyết → bác bỏ (～に違いない → ～はずがない／～わけがない) → quan sát → sự thật (道理で～わけだ) — để trả lời câu hỏi lý do, câu hỏi suy ra (thông tin không nói thẳng) và ý chính của tác giả; tra danh sách đồ thất lạc theo nhiều điều kiện (đồ gì, màu, nơi, ngày) và đọc kỹ các dòng ※.',
  minutes: 55,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N3',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '150–200 chữ (có khi tới ~350)', 'Bài 1 — thông báo của phòng công tác sinh viên: quy trình, thời hạn, ngoại lệ (ただし)'],
        ['問題5', '内容理解（中文）', '~350 chữ', 'Bài 2 (đoạn 1–2) — hai giả thuyết và lý do bị bác bỏ'],
        ['問題6', '内容理解（長文）', '~550 chữ', 'Bài 2 (cả bài ~700 chữ) — thông tin suy ra, ý chính của tác giả'],
        ['問題7', '情報検索', '~600 chữ (bảng / danh sách)', 'Bài 3 — danh sách đồ thất lạc: lọc theo đồ – màu – nơi – ngày, đọc ※'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc N3 — bài có suy luận',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá. Câu hỏi "**～と{考|かんが}えたのはなぜか**" → tìm câu có **～から／～ので** NGAY TRƯỚC hoặc NGAY SAU chỗ người viết nêu suy nghĩ. Câu hỏi "**{合|あ}っているものはどれか**" → đáp án thường là thông tin **không nói thẳng**, phải suy ra từ một câu (ở bài 2: ai đã cho phép đặt ô?).',
        '**Theo dõi độ chắc của tác giả**: **～に{違|ちが}いないと{思|おも}った** = giả thuyết (chưa chắc đúng!) · **しかし…はずがない／わけがない** = giả thuyết bị **gạt bỏ** · **{道理|どうり}で～わけだ** = **sự thật** được xác nhận. Đáp án đúng KHÔNG BAO GIỜ là giả thuyết đã bị gạt.',
        '**Ý chính tác giả** ở đoạn cuối, sau câu chốt câu chuyện — thường có **～と{思|おも}った／～ことが{大切|たいせつ}だ／～わけにはいかない**. Đáp án sai hay là một **chi tiết đúng** của bài nhưng không phải ý chính.',
        '情報検索: lập **bảng điều kiện** (đồ gì? màu? ở đâu? ngày nào?) rồi **loại** từng dòng. Hai dòng gần giống nhau là bẫy — so **từng** cột. Luôn đọc dòng **※** (đồ quý giá đi đâu, cần mang gì).',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: thông báo về đồ thất lạc' },
    {
      t: 'passage',
      title: '【{学生課|がくせいか}からのお{知|し}らせ】{落|お}とし{物|もの}・{忘|わす}れ{物|もの}について',
      intro: 'Thông báo dán ở bảng tin của trường. Đọc rồi trả lời 2 câu hỏi.',
      paras: [
        { text: '{最近|さいきん}、{学内|がくない}での{落|お}とし{物|もの}が{増|ふ}えています。{先月|せんげつ}は、{傘|かさ}、{学生証|がくせいしょう}、{定期券|ていきけん}、ノートパソコンなど、{全部|ぜんぶ}で120{件|けん}の{落|お}とし{物|もの}が{届|とど}きました。' },
        { text: '{届|とど}いた{物|もの}は、{学生課|がくせいか}の{窓口|まどぐち}で1か{月|げつ}{間|かん}{保管|ほかん}します。1か{月|げつ}を{過|す}ぎても{持|も}ち{主|ぬし}が{見|み}つからない{場合|ばあい}は、{警察|けいさつ}に{届|とど}けます。ただし、{財布|さいふ}や{学生証|がくせいしょう}など{大切|たいせつ}な{物|もの}は、{届|とど}いた{次|つぎ}の{日|ひ}に{警察|けいさつ}に{届|とど}けますので、その{場合|ばあい}は{学生課|がくせいか}ではなく、{大学|だいがく}{前|まえ}の{交番|こうばん}にお{問|と}い{合|あ}わせください。' },
        { text: '{物|もの}をなくしたときは、{学生課|がくせいか}のホームページの「{落|お}とし{物|もの}リスト」で{確認|かくにん}できます。ただ、リストには{中身|なかみ}や{細|こま}かい{特徴|とくちょう}は{書|か}いてありません。{自分|じぶん}の{物|もの}かどうかを{確|たし}かめるために、{窓口|まどぐち}に{来|き}て、{物|もの}の{特徴|とくちょう}を{詳|くわ}しく{説明|せつめい}してください。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-doc-1',
      title: 'Bài 1 — câu hỏi (2 câu)',
      items: [
        { q: '{三日前|みっかまえ}に{学内|がくない}で{学生証|がくせいしょう}をなくした{人|ひと}は、どこに{問|と}い{合|あ}わせなければなりませんか。', options: ['{学生課|がくせいか}の{窓口|まどぐち}', '{学生課|がくせいか}のホームページ', '{大学|だいがく}{前|まえ}の{交番|こうばん}', '{大学|だいがく}の{図書館|としょかん}'], correct: 2, why: '**ただし、{財布|さいふ}や{学生証|がくせいしょう}など{大切|たいせつ}な{物|もの}は、{届|とど}いた{次|つぎ}の{日|ひ}に{警察|けいさつ}に{届|とど}けます…{学生課|がくせいか}ではなく、{大学|だいがく}{前|まえ}の{交番|こうばん}に** — ngoại lệ nằm sau ただし. 〔Daigaku mae no kouban ni otoiawase kudasai.〕' },
        { q: 'このお{知|し}らせの{内容|ないよう}と{合|あ}っているものはどれですか。', options: ['{傘|かさ}は、{届|とど}いた{次|つぎ}の{日|ひ}に{警察|けいさつ}に{届|とど}けられる。', 'ホームページを{見|み}れば、{自分|じぶん}の{物|もの}かどうか{必|かなら}ず{分|わ}かる。', '{傘|かさ}や{本|ほん}は、1か{月|げつ}{間|かん}{学生課|がくせいか}に{保管|ほかん}される。', '{落|お}とし{物|もの}は{先月|せんげつ}より{減|へ}っている。'], correct: 2, why: 'Đồ thường (ô, sách) → **1か{月|げつ}{間|かん}{保管|ほかん}します**. Ô không phải "đồ quý giá"; trang web **không ghi** đặc điểm chi tiết; đồ thất lạc đang **{増|ふ}えています**. 〔Ikkagetsukan hokan shimasu.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài 1',
      items: [
        '**{学生課|がくせいか}** (phòng công tác sinh viên) · **{学内|がくない}** (trong khuôn viên trường) · **～{件|けん}** (đếm vụ, món — Bài 27) · **{窓口|まどぐち}** (quầy giao dịch) · **{保管|ほかん}する** (bảo quản, giữ — N2) · **ただし** (tuy nhiên, nhưng — ngoại lệ, N3) · **～ではなく** (không phải… mà) · **お{問|と}い{合|あ}わせください** (xin hãy liên hệ — kính ngữ).',
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文〜長文）: bài văn "Bí ẩn chiếc ô đỏ" của リン' },
    {
      t: 'passage',
      title: '{赤|あか}い{傘|かさ}の{謎|なぞ}　{経済学部|けいざいがくぶ}1{年|ねん}　リン',
      intro: 'Bài văn リン viết cho tờ báo tường của ký túc xá. Đọc rồi trả lời 4 câu hỏi.',
      paras: [
        { label: '1', text: '{私|わたし}が{住|す}んでいる{寮|りょう}の{玄関|げんかん}には、{毎朝|まいあさ}{赤|あか}い{傘|かさ}が{一本|いっぽん}{置|お}いてある。{雨|あめ}が{降|ふ}っていない{日|ひ}もだ。ところが、{夕方|ゆうがた}{大学|だいがく}から{帰|かえ}ってくると、その{傘|かさ}はいつもなくなっている。{誰|だれ}が{置|お}いて、{誰|だれ}が{持|も}っていくのだろうか。{推理小説|すいりしょうせつ}が{好|す}きな{私|わたし}は、この{謎|なぞ}を{解|と}いてみることにした。' },
        { label: '2', text: '{最初|さいしょ}に{考|かんが}えたのは、{管理人|かんりにん}さんだ。{寮|りょう}のことを{一番|いちばん}よく{知|し}っている{人|ひと}だから、{管理人|かんりにん}さんの{傘|かさ}に{違|ちが}いないと{思|おも}った。しかし、{管理人|かんりにん}さんはいつも{黒|くろ}っぽい{大|おお}きな{傘|かさ}を{使|つか}っている。あんなに{小|ちい}さくてかわいい{赤|あか}い{傘|かさ}を{使|つか}うはずがない。{次|つぎ}に、{同|おな}じ{階|かい}のマリヤムさんを{疑|うたが}った。でも、マリヤムさんは{先週|せんしゅう}から{国|くに}に{帰|かえ}っている。{国|くに}にいる{人|ひと}が、{毎朝|まいあさ}{傘|かさ}を{置|お}けるわけがない。' },
        { label: '3', text: 'そこで、ある{朝|あさ}、{私|わたし}は{早|はや}く{起|お}きて、{玄関|げんかん}の{近|ちか}くで{待|ま}ってみた。7{時|じ}ごろ、{近所|きんじょ}に{住|す}んでいる{小学生|しょうがくせい}の{女|おんな}の{子|こ}が{走|はし}ってきて、{赤|あか}い{傘|かさ}を{置|お}くと、すぐに{学校|がっこう}へ{行|い}ってしまった。{次|つぎ}の{日|ひ}、{思|おも}い{切|き}ってわけを{聞|き}いてみると、{女|おんな}の{子|こ}はこう{答|こた}えた。' },
        { label: '4', text: '「おばあちゃんの{傘|かさ}なんです。おばあちゃんは{毎日|まいにち}{夕方|ゆうがた}、この{前|まえ}を{通|とお}って{散歩|さんぽ}するんですけど、{忘|わす}れっぽくて、よく{傘|かさ}を{持|も}たないで{出|で}かけるんです。だから、ここに{置|お}いておいて、{通|とお}るときに{持|も}っていってもらうんです。{管理人|かんりにん}さんにも、ちゃんとお{願|ねが}いしてあります。」' },
        { label: '5', text: '{道理|どうり}で、{夕方|ゆうがた}には{傘|かさ}がなくなっているわけだ。{私|わたし}の{推理|すいり}は{全然|ぜんぜん}{当|あ}たらなかったが、{本当|ほんとう}の{理由|りゆう}を{知|し}って、{温|あたた}かい{気持|きも}ちになった。{人|ひと}の{行動|こうどう}には、{外|そと}からは{見|み}えない{事情|じじょう}があることが{多|おお}い。{怪|あや}しいと{思|おも}っても、わけを{聞|き}かずに{決|き}めつけるわけにはいかない、と{思|おも}った。' },
      ],
    },
    {
      t: 'note',
      title: 'Đọc kỹ — các câu suy luận trong bài (gạch chân khi làm đề)',
      items: [
        '**Đoạn 2 — hai giả thuyết bị gạt**: {管理人|かんりにん}さんの{傘|かさ}**に{違|ちが}いない**（giả thuyết）→ しかし…**{使|つか}うはずがない**（bác bỏ — căn cứ: ô của bác ấy luôn màu đen đen, to）· マリヤムさんを{疑|うたが}った → **{置|お}けるわけがない**（bác bỏ — ở nước ngoài）.',
        '**Đoạn 3–4 — quan sát → sự thật**: そこで (vì thế) → {待|ま}ってみた (thử chờ) → lời cô bé. Câu "**{管理人|かんりにん}さんにも、ちゃんとお{願|ねが}いしてあります**" (～てある — đã nhờ sẵn) cho thấy **bác quản lý đã biết** từ trước — thông tin này không nói thẳng, đề hay hỏi.',
        '**Đoạn 5 — kết luận + ý chính**: **{道理|どうり}で～わけだ** (sự thật được xác nhận) → **{事情|じじょう}があることが{多|おお}い** → **わけを{聞|き}かずに{決|き}めつけるわけにはいかない** (ý chính — không thể kết luận khi chưa hỏi lý do). **{決|き}めつける** = quy chụp, kết luận vội (N2).',
        'Từ mới: **{玄関|げんかん}** (sảnh cửa vào) · **ところが** (thế nhưng — trái với dự đoán) · **～ことにした** (quyết định — Bài 21) · **{階|かい}** (tầng) · **そこで** (vì vậy, thế là) · **{近所|きんじょ}** (hàng xóm, gần nhà) · **{思|おも}い{切|き}って** (lấy hết can đảm — N3) · **～てもらう** (nhờ ai làm — Bài 18) · **お{願|ねが}いしてある** (đã nhờ sẵn — ～てある) · **{行動|こうどう}** (hành động) · **～ずに** (= ～ないで — văn viết).',
      ],
    },
    {
      t: 'mcq',
      id: 'b31-doc-2',
      title: 'Bài 2 — câu hỏi (4 câu)',
      items: [
        { q: '{筆者|ひっしゃ}が、{赤|あか}い{傘|かさ}は{管理人|かんりにん}さんの{物|もの}ではないと{考|かんが}えたのはなぜですか。', options: ['{管理人|かんりにん}さんは{寮|りょう}のことをよく{知|し}らないから', '{管理人|かんりにん}さんはいつも{黒|くろ}っぽい{大|おお}きな{傘|かさ}を{使|つか}っているから', '{管理人|かんりにん}さんは{先週|せんしゅう}から{国|くに}に{帰|かえ}っているから', '{管理人|かんりにん}さんは{傘|かさ}を{持|も}たないで{出|で}かけるから'], correct: 1, why: 'Đoạn 2: **しかし、{管理人|かんりにん}さんはいつも{黒|くろ}っぽい{大|おお}きな{傘|かさ}を{使|つか}っている** → {使|つか}うはずがない. "Về nước" là chuyện của マリヤム; "không mang ô" là chuyện của bà cụ. 〔Kuroppoi ookina kasa o tsukatte iru.〕' },
        { q: '{赤|あか}い{傘|かさ}が{夕方|ゆうがた}になくなっていたのはなぜですか。', options: ['{管理人|かんりにん}さんが{夕方|ゆうがた}に{片付|かたづ}けていたから', '{女|おんな}の{子|こ}が{学校|がっこう}の{帰|かえ}りに{持|も}って{帰|かえ}っていたから', '{女|おんな}の{子|こ}のおばあちゃんが、{散歩|さんぽ}で{通|とお}るときに{持|も}っていっていたから', 'マリヤムさんが{国|くに}から{帰|かえ}ってきて{使|つか}っていたから'], correct: 2, why: 'Đoạn 4: **ここに{置|お}いておいて、{通|とお}るときに{持|も}っていってもらうんです** — người lấy ô là **bà cụ** khi đi dạo qua. 〔Tooru toki ni motte itte morau n desu.〕' },
        { q: '{管理人|かんりにん}さんについて、{文章|ぶんしょう}から{分|わ}かることはどれですか。', options: ['{毎朝|まいあさ}、{赤|あか}い{傘|かさ}を{玄関|げんかん}に{置|お}いていた。', '{女|おんな}の{子|こ}が{傘|かさ}を{置|お}くことを{知|し}っていた。', '{筆者|ひっしゃ}に{謎|なぞ}を{解|と}くように{頼|たの}んだ。', '{黒|くろ}っぽい{傘|かさ}をなくしてしまった。'], correct: 1, why: 'Không nói thẳng — suy ra từ câu của cô bé: **{管理人|かんりにん}さんにも、ちゃんとお{願|ねが}いしてあります** → bác quản lý **đã biết** chuyện đặt ô. (～てある = việc đã làm sẵn.) 〔Kanrinin-san ni mo, chanto onegai shite arimasu.〕' },
        { q: 'この{文章|ぶんしょう}で{筆者|ひっしゃ}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', options: ['{推理小説|すいりしょうせつ}を{読|よ}むと、{推理|すいり}が{上手|じょうず}になる。', '{忘|わす}れっぽい{人|ひと}は、{傘|かさ}を{持|も}って{出|で}かけたほうがいい。', '{人|ひと}の{行動|こうどう}には{見|み}えない{事情|じじょう}があることが{多|おお}いので、{理由|りゆう}を{聞|き}かずに{決|き}めつけてはいけない。', '{怪|あや}しい{人|ひと}を{見|み}かけたら、すぐに{管理人|かんりにん}さんに{知|し}らせたほうがいい。'], correct: 2, why: 'Đoạn cuối: **{事情|じじょう}があることが{多|おお}い…わけを{聞|き}かずに{決|き}めつけるわけにはいかない**. Các lựa chọn khác là chi tiết hoặc không có trong bài. 〔Wake o kikazu ni kimetsukeru wake ni wa ikanai.〕' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: danh sách đồ thất lạc của trường' },
    {
      t: 'passage',
      title: 'みなと{大学|だいがく}　{落|お}とし{物|もの}リスト（11{月|がつ}10{日|か}{現在|げんざい}）',
      intro: 'Danh sách trên trang web của 学生課. Đọc rồi trả lời 2 câu hỏi.',
      paras: [
        { label: '1', text: '{傘|かさ}　／　{黒|くろ}・{長|なが}い{傘|かさ}　／　{拾|ひろ}った{場所|ばしょ}：{食堂|しょくどう}　／　11{月|がつ}5{日|か}' },
        { label: '2', text: '{手袋|てぶくろ}　／　{白|しろ}っぽい・{毛糸|けいと}・{両方|りょうほう}　／　{拾|ひろ}った{場所|ばしょ}：{体育館|たいいくかん}　／　11{月|がつ}7{日|か}' },
        { label: '3', text: '{手袋|てぶくろ}　／　{白|しろ}っぽい・{革|かわ}・{片方|かたほう}だけ　／　{拾|ひろ}った{場所|ばしょ}：{図書館|としょかん}3{階|がい}　／　11{月|がつ}8{日|か}' },
        { label: '4', text: '{定期券|ていきけん}（{青|あお}いケース{入|い}り）　／　{拾|ひろ}った{場所|ばしょ}：{正門|せいもん}　／　11{月|がつ}8{日|か}　→　11{月|がつ}9{日|か}に{交番|こうばん}へ{届|とど}けました' },
        { label: '5', text: '{紙袋|かみぶくろ}（{中身|なかみ}：ノート2{冊|さつ}）　／　{拾|ひろ}った{場所|ばしょ}：{図書館|としょかん}1{階|かい}　／　11{月|がつ}9{日|か}' },
        { label: '6', text: '{鍵|かぎ}（{黄色|きいろ}いキーホルダー{付|つ}き）　／　{拾|ひろ}った{場所|ばしょ}：{駐輪場|ちゅうりんじょう}　／　11{月|がつ}9{日|か}' },
        { label: '7', text: '{手袋|てぶくろ}　／　{黒|くろ}・{子|こ}ども{用|よう}　／　{拾|ひろ}った{場所|ばしょ}：{図書館|としょかん}2{階|かい}　／　11{月|がつ}9{日|か}' },
        { label: '8', text: '{水筒|すいとう}　／　{赤|あか}っぽい　／　{拾|ひろ}った{場所|ばしょ}：{講義室|こうぎしつ}A　／　11{月|がつ}10{日|か}' },
        { label: '※', text: '{受|う}け{取|と}り：{月|げつ}～{金|きん}　9:00～17:00（{学生課|がくせいか}の{窓口|まどぐち}）。{学生証|がくせいしょう}を{持|も}ってきてください。' },
        { label: '※', text: '{品物|しなもの}の{特徴|とくちょう}を{説明|せつめい}できない{場合|ばあい}は、お{渡|わた}しできません。' },
        { label: '※', text: '{定期券|ていきけん}・{財布|さいふ}・{学生証|がくせいしょう}などは、{届|とど}いた{次|つぎ}の{日|ひ}に{交番|こうばん}へ{届|とど}けます。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-doc-3',
      title: 'Bài 3 — câu hỏi (2 câu)',
      items: [
        { q: 'リンさんは11{月|がつ}8{日|か}に、{図書館|としょかん}で{白|しろ}っぽい{革|かわ}の{手袋|てぶくろ}を{片方|かたほう}なくしました。リンさんの{手袋|てぶくろ}は{何番|なんばん}ですか。', options: ['2{番|ばん}', '3{番|ばん}', '5{番|ばん}', '7{番|ばん}'], correct: 1, why: 'Lọc 4 điều kiện: găng tay · ngả trắng · **da** · **một chiếc** · thư viện · 8/11 → **3**. Số 2 là len, đủ đôi, ở nhà thể chất; số 7 màu đen, đồ trẻ em. 〔Shiroppoi, kawa, katahou dake, toshokan sangai.〕' },
        { q: 'ダニエルさんは11{月|がつ}8{日|か}に{正門|せいもん}の{近|ちか}くで{定期券|ていきけん}をなくしました。{今日|きょう}は11{月|がつ}10{日|か}です。どうすればいいですか。', options: ['{学生課|がくせいか}の{窓口|まどぐち}に{学生証|がくせいしょう}を{持|も}って{行|い}く', '{交番|こうばん}に{行|い}って{聞|き}く', '{駅|えき}の{窓口|まどぐち}に{電話|でんわ}する', '11{月|がつ}12{日|にち}まで{待|ま}つ'], correct: 1, why: 'Dòng 4: **11{月|がつ}9{日|か}に{交番|こうばん}へ{届|とど}けました** (và ※ cuối: vé tháng được chuyển lên đồn hôm sau). Hôm nay 10/11 → phải hỏi **{交番|こうばん}**. 〔Kouban e todokemashita.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài 3 — danh sách đồ thất lạc',
      items: [
        '**{毛糸|けいと}** (len) · **{両方|りょうほう}／{片方|かたほう}** (cả hai / một bên — N3) · **{体育館|たいいくかん}** (nhà thể chất) · **{正門|せいもん}** (cổng chính) · **ケース{入|い}り** (để trong vỏ) · **～{付|つ}き** (có kèm…) · **{駐輪場|ちゅうりんじょう}** (bãi để xe đạp) · **{子|こ}ども{用|よう}** (dành cho trẻ em) · **{水筒|すいとう}** (bình nước) · **{講義室|こうぎしつ}** (phòng học lớn) · **{品物|しなもの}** (món đồ) · **お{渡|わた}しできません** (không thể giao — khiêm nhường).',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b31-noi',
  kind: 'speaking',
  title: 'Luyện nói — suy luận thành lời bằng ～に違いない・～はずがない, tả người & đồ vật bằng ～っぽい, giải thích bằng ～わけだ・～わけではない, từ chối khéo bằng ～わけにはいかない, trình bày 1 phút "Một lần tôi đoán sai", đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói về đồ thất lạc, tính cách, lời nhờ, thói quen (最近なくした物は・あなたはどんな性格・頼まれて断れなかったことは・推理ドラマは好きか) bằng câu 2–3 ý có mẫu của bài; mô tả tranh có suy luận (窓が開いている → 寒いわけだ); trình bày 1 phút có mở – thân – kết theo cấu trúc "giả thuyết → bác bỏ → sự thật → bài học"; đọc to đoạn tin ~150 chữ đúng nhịp, đúng âm đục (ざい・ぞう) và trường âm.',
  minutes: 50,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) nâng lên N3 — chủ đề Bài 31 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 31 xuất hiện ở đâu'],
      rows: [
        ['Reading', '30', 'Chuẩn bị 30 giây, đọc to đoạn ~150 chữ.', 'Đoạn tin vụ việc: {深夜|しんや}, {現在|げんざい}, {防犯|ぼうはん}カメラに{映|うつ}る, {黒|くろ}っぽい, {可能性|かのうせい}…'],
        ['Talking — có tranh', '3 × 10', 'Nhìn tranh (cửa sổ mở → phòng lạnh, quầy đồ thất lạc, bạn rủ đi chơi trước hôm thi) trả lời 2 ý.', 'どうして{寒|さむ}いと{思|おも}いますか · どんな{袋|ふくろ}ですか · {行|い}きますか、どうしてですか'],
        ['Talking — không tranh', '2 × 10', 'Trả lời câu hỏi về bản thân, có lý do / ví dụ.', '{最近|さいきん}なくした{物|もの}はありますか · あなたはどんな{性格|せいかく}ですか · {頼|たの}まれて{断|ことわ}れなかったことは？'],
        ['Presenting (N3)', '20', 'Trình bày 1 phút một chủ đề cho sẵn, có mở – thân – kết.', '「{思|おも}い{込|こ}みで{失敗|しっぱい}した{話|はなし}」 — xem dàn ý bên dưới'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 31 (mỗi câu ít nhất 2 ý)',
      items: [
        '**"Gần đây bạn có làm mất đồ gì không?"** → kể **một** lần: **～に～を{置|お}き{忘|わす}れてしまいました** + **mô tả** ({白|しろ}っぽい／{特徴|とくちょう}は～) + **kết quả** (～たら、{見|み}つかりました／だから{見|み}つからなかったわけです).',
        '**"Bạn là người thế nào?"** → một nét tốt + một nét "っぽい": **{明|あか}るいと{言|い}われますが、ちょっと{忘|わす}れっぽいです** + **cách khắc phục** (だから、{鍵|かぎ}に{目印|めじるし}を{付|つ}けています).',
        '**"Có lần nào được nhờ mà không từ chối được?"** → **～に～を{頼|たの}まれました。{忙|いそが}しかったけど、～ので、{断|ことわ}るわけにはいきませんでした** + **kết quả / cảm nghĩ**. Đây là câu "ăn điểm" của bài.',
        '**"Bạn thích ~ không?"** mà câu trả lời không hẳn có / không → **{好|す}きなわけではないんですが、ときどき～** — trả lời thật, mềm mại, đúng N3.',
        '⚠ Hai lỗi bị trừ điểm nhiều nhất: nối sai **に{違|ちが}いない** (~~{犯人|はんにん}のに{違|ちが}いない~~, ~~{静|しず}かなに{違|ちが}いない~~) và nói **わけにはいかない** cho việc **không có khả năng** (~~{熱|ねつ}で{起|お}きるわけにはいかなかった~~ → {起|お}きられなかった).',
      ],
    },
    DL('Câu trả lời mẫu — giám thị ↔ thí sinh', [
      ['{先生|せんせい}', 'examiner', '{最近|さいきん}、{何|なに}かなくした{物|もの}はありますか。', 'Saikin, nani ka nakushita mono wa arimasu ka.', 'Dạo này em có làm mất gì không?'],
      ['Bạn', 'candidate', 'はい。{先月|せんげつ}、{電車|でんしゃ}に{傘|かさ}を{置|お}き{忘|わす}れてしまいました。{駅|えき}の{窓口|まどぐち}で{特徴|とくちょう}を{詳|くわ}しく{話|はな}したら、{次|つぎ}の{日|ひ}に{見|み}つかりました。', 'Hai. Sengetsu, densha ni kasa o okiwasurete shimaimashita. Eki no madoguchi de tokuchou o kuwashiku hanashitara, tsugi no hi ni mitsukarimashita.', 'Có ạ. Tháng trước em để quên ô trên tàu. Em kể chi tiết đặc điểm ở quầy của ga, hôm sau thì tìm thấy ạ.'],
      ['{先生|せんせい}', 'examiner', 'あなたはどんな{性格|せいかく}ですか。', 'Anata wa donna seikaku desu ka.', 'Em là người tính cách thế nào?'],
      ['Bạn', 'candidate', '{友達|ともだち}には{明|あか}るいと{言|い}われますが、ちょっと{忘|わす}れっぽいです。だから、{鍵|かぎ}に{赤|あか}いリボンを{付|つ}けて、{目印|めじるし}にしています。', 'Tomodachi ni wa akarui to iwaremasu ga, chotto wasureppoi desu. Dakara, kagi ni akai ribon o tsukete, mejirushi ni shite imasu.', 'Bạn bè bảo em vui vẻ, nhưng em hơi hay quên. Vì thế em buộc ruy băng đỏ vào chìa khoá làm dấu ạ.'],
      ['{先生|せんせい}', 'examiner', '{誰|だれ}かに{頼|たの}まれて、{断|ことわ}れなかったことはありますか。', 'Dare ka ni tanomarete, kotowarenakatta koto wa arimasu ka.', 'Có lần nào em được ai nhờ mà không từ chối được không?'],
      ['Bạn', 'candidate', 'はい。{先輩|せんぱい}に{発表会|はっぴょうかい}の{司会|しかい}を{頼|たの}まれました。{試験|しけん}の{前|まえ}で{忙|いそが}しかったですが、いつもお{世話|せわ}になっているので、{断|ことわ}るわけにはいきませんでした。', 'Hai. Senpai ni happyoukai no shikai o tanomaremashita. Shiken no mae de isogashikatta desu ga, itsumo osewa ni natte iru node, kotowaru wake ni wa ikimasen deshita.', 'Có ạ. Đàn anh nhờ em làm MC buổi báo cáo. Trước kỳ thi nên em bận, nhưng vì anh ấy luôn giúp đỡ em nên em không thể từ chối ạ.'],
      ['{先生|せんせい}', 'examiner', '{推理|すいり}ドラマや{推理小説|すいりしょうせつ}は{好|す}きですか。', 'Suiri dorama ya suiri shousetsu wa suki desu ka.', 'Em có thích phim hay truyện trinh thám không?'],
      ['Bạn', 'candidate', '{大好|だいす}きなわけではないんですが、ときどき{見|み}ます。{最後|さいご}に{犯人|はんにん}が{分|わ}かって、「だからあの{人|ひと}はうそをついたわけだ」と{分|わ}かるのが{楽|たの}しいです。', 'Daisuki na wake de wa nai n desu ga, tokidoki mimasu. Saigo ni hannin ga wakatte, "Dakara ano hito wa uso o tsuita wake da" to wakaru no ga tanoshii desu.', 'Không hẳn là rất thích, nhưng thỉnh thoảng em xem ạ. Cuối phim biết thủ phạm rồi hiểu ra "thảo nào người đó nói dối" — thấy vui ạ.'],
    ]),
    { t: 'h', text: 'Talking — có tranh: 3 tranh kiểu đề thi' },
    {
      t: 'canh',
      anh: ['window', 'cold-face', 'shopping-bags', 'station', 'party-popper', 'books'],
      caption: 'Tranh 1: lớp học, cửa sổ mở toang, gió thổi rèm bay, một sinh viên co ro run lập cập. Tranh 2: quầy đồ thất lạc ở ga — một cô gái chỉ vào chiếc túi giấy màu ngả trắng trên kệ. Tranh 3: bạn bè giơ tấm vé đi karaoke tối nay; trên bàn của bạn là chồng sách và tờ lịch ghi "明日 試験".',
    },
    DL('Câu trả lời mẫu — nhìn tranh trả lời (mỗi câu 2 ý)', [
      ['{先生|せんせい}', 'examiner', '{絵|え}1を{見|み}てください。この{学生|がくせい}はどうして{寒|さむ}いと{思|おも}いますか。', 'E ichi o mite kudasai. Kono gakusei wa doushite samui to omoimasu ka.', 'Em xem tranh 1. Em nghĩ vì sao sinh viên này lạnh?'],
      ['Bạn', 'candidate', '{窓|まど}が{全部|ぜんぶ}{開|あ}いていますね。だから{寒|さむ}いわけです。{誰|だれ}かが{掃除|そうじ}のときに{開|あ}けて、{閉|し}めるのを{忘|わす}れたに{違|ちが}いありません。', 'Mado ga zenbu aite imasu ne. Dakara samui wake desu. Dare ka ga souji no toki ni akete, shimeru no o wasureta ni chigai arimasen.', 'Cửa sổ mở hết cả. Vì thế mà lạnh ạ. Chắc chắn là ai đó mở lúc dọn dẹp rồi quên đóng.'],
      ['{先生|せんせい}', 'examiner', '{絵|え}2を{見|み}てください。{女|おんな}の{人|ひと}はどんな{物|もの}をなくしましたか。', 'E ni o mite kudasai. Onna no hito wa donna mono o nakushimashita ka.', 'Em xem tranh 2. Cô gái làm mất món đồ như thế nào?'],
      ['Bạn', 'candidate', '{白|しろ}っぽい{紙袋|かみぶくろ}をなくしたようです。{今|いま}、{駅員|えきいん}さんに{袋|ふくろ}の{特徴|とくちょう}や{中身|なかみ}を{説明|せつめい}しているところだと{思|おも}います。', 'Shiroppoi kamibukuro o nakushita you desu. Ima, ekiin-san ni fukuro no tokuchou ya nakami o setsumei shite iru tokoro da to omoimasu.', 'Hình như cô ấy làm mất chiếc túi giấy ngả trắng. Em nghĩ cô ấy đang giải thích đặc điểm và đồ bên trong cho nhân viên ga.'],
      ['{先生|せんせい}', 'examiner', '{絵|え}3を{見|み}てください。あなたなら、カラオケに{行|い}きますか。', 'E san o mite kudasai. Anata nara, karaoke ni ikimasu ka.', 'Em xem tranh 3. Nếu là em, em có đi karaoke không?'],
      ['Bạn', 'candidate', '{行|い}きたいですが、{明日|あした}は{試験|しけん}なので、{今夜|こんや}は{遊|あそ}びに{行|い}くわけにはいきません。{試験|しけん}が{終|お}わったら、みんなで{行|い}きたいです。', "Ikitai desu ga, ashita wa shiken na node, kon'ya wa asobi ni iku wake ni wa ikimasen. Shiken ga owattara, minna de ikitai desu.", 'Em muốn đi, nhưng mai thi nên tối nay em không thể đi chơi được. Thi xong em muốn đi cùng mọi người.'],
    ]),
    {
      t: 'phatam',
      id: 'b31-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 31',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý âm đục và trường âm: げ・ん・ざ・い (không ~~げんさい~~), そ・う・ぞ・う, は・ん・ざ・い, い・ん・しょ・う; âm ngắt: け・っ・し・て, っ・ぽ・い (ngắt rõ trước ぽ); ち・が・い・な・い (bốn mora rõ, không nuốt い).',
      items: [
        { text: '{犯人|はんにん}はあの{人|ひと}に{違|ちが}いありません。', ipa: 'hannin wa ano hito ni chigai arimasen', vi: 'Thủ phạm chắc chắn là người đó.' },
        { text: 'コンビニで{落|お}としたに{違|ちが}いない。', ipa: 'konbini de otoshita ni chigainai', vi: 'Chắc chắn là đánh rơi ở cửa hàng tiện lợi.' },
        { text: '{鍵|かぎ}をかけたから、{泥棒|どろぼう}が{入|はい}るはずがありません。', ipa: 'kagi o kaketa kara dorobou ga hairu hazu ga arimasen', vi: 'Đã khoá cửa nên không lẽ nào trộm vào được.' },
        { text: 'そんなはずはありません。', ipa: 'sonna hazu wa arimasen', vi: 'Không thể nào.' },
        { text: 'こんな{難|むずか}しい{問題|もんだい}、{解|と}けるわけがないよ。', ipa: 'konna muzukashii mondai tokeru wake ga nai yo', vi: 'Bài khó thế này làm sao giải được.' },
        { text: '{最近|さいきん}、{忘|わす}れっぽくて{困|こま}っています。', ipa: 'saikin wasureppokute komatte imasu', vi: 'Dạo này tôi hay quên, khổ quá.' },
        { text: '{白|しろ}っぽい{紙袋|かみぶくろ}を{置|お}き{忘|わす}れました。', ipa: 'shiroppoi kamibukuro o okiwasuremashita', vi: 'Tôi để quên chiếc túi giấy ngả trắng.' },
        { text: '{道理|どうり}で{寒|さむ}いわけだ。', ipa: 'douri de samui wake da', vi: 'Thảo nào lạnh thế.' },
        { text: 'つまり、{一週間|いっしゅうかん}に{十時間|じゅうじかん}{働|はたら}くわけです。', ipa: 'tsumari isshuukan ni juujikan hataraku wake desu', vi: 'Tức là một tuần làm mười tiếng.' },
        { text: '{別|べつ}に{怒|おこ}っているわけではありません。', ipa: 'betsu ni okotte iru wake de wa arimasen', vi: 'Tôi chẳng phải đang giận gì đâu.' },
        { text: 'お{酒|さけ}は{飲|の}めないわけではないんですが……。', ipa: 'osake wa nomenai wake de wa nai n desu ga', vi: 'Không phải là tôi không uống được rượu, nhưng…' },
        { text: '{明日|あした}は{試験|しけん}なので、{休|やす}むわけにはいきません。', ipa: 'ashita wa shiken na node yasumu wake ni wa ikimasen', vi: 'Mai thi nên tôi không thể nghỉ.' },
        { text: '{交番|こうばん}に{届|とど}けないわけにはいかないね。', ipa: 'kouban ni todokenai wake ni wa ikanai ne', vi: 'Không thể không nộp lên đồn nhỉ.' },
        { text: '{証拠|しょうこ}を{一|ひと}つずつ{確|たし}かめることが{大切|たいせつ}です。', ipa: 'shouko o hitotsu zutsu tashikameru koto ga taisetsu desu', vi: 'Quan trọng là kiểm tra từng chứng cứ một.' },
      ],
    },
    {
      t: 'note',
      title: 'Trình bày 1 phút (できる！) — dàn ý + bài mẫu "Một lần tôi đoán sai vì định kiến"',
      items: [
        '**Dàn ý 4 phần (≈ 7–8 câu, 250–300 chữ nói)**: ① **Mở** — chuyện gì, khi nào (～とき、～ことがありました) → ② **Giả thuyết ban đầu** (きっと～に{違|ちが}いないと{思|おも}いました) → ③ **Sự thật** (でも、{実|じつ}は～。だから～わけです／～わけではありませんでした) → ④ **Bài học** (それから、～ようにしています · ～わけにはいかないと{思|おも}いました).',
        '{先月|せんげつ}、{寮|りょう}の{冷蔵庫|れいぞうこ}に{入|い}れておいた{私|わたし}のプリンがなくなりました。{私|わたし}は、きっと{隣|となり}の{部屋|へや}のダニエルさんが{食|た}べたに{違|ちが}いないと{思|おも}いました。ダニエルさんは{甘|あま}い{物|もの}が{大好|だいす}きだからです。でも、{聞|き}いてみると、ダニエルさんはその{日|ひ}、{一日中|いちにちじゅう}アルバイトで{寮|りょう}にいなかったんです。{寮|りょう}にいなかった{人|ひと}が、{食|た}べられるはずがありません。{実|じつ}は、{私|わたし}が{自分|じぶん}で{別|べつ}の{棚|たな}に{入|い}れて、{忘|わす}れていたんです。{私|わたし}は{忘|わす}れっぽいので、{自分|じぶん}のミスだとは{全然|ぜんぜん}{考|かんが}えませんでした。この{経験|けいけん}から、{証拠|しょうこ}もないのに{人|ひと}を{疑|うたが}うわけにはいかないと{思|おも}いました。',
        'Romaji: Sengetsu, ryou no reizouko ni irete oita watashi no purin ga naku narimashita. Watashi wa, kitto tonari no heya no Danieru-san ga tabeta ni chigainai to omoimashita. Danieru-san wa amai mono ga daisuki da kara desu. Demo, kiite miru to, Danieru-san wa sono hi, ichinichijuu arubaito de ryou ni inakatta n desu. Ryou ni inakatta hito ga, taberareru hazu ga arimasen. Jitsu wa, watashi ga jibun de betsu no tana ni irete, wasurete ita n desu. Watashi wa wasureppoi node, jibun no misu da to wa zenzen kangaemasen deshita. Kono keiken kara, shouko mo nai noni hito o utagau wake ni wa ikanai to omoimashita.',
        'Nghĩa: Tháng trước, hộp pudding tôi để trong tủ lạnh ký túc xá biến mất. Tôi nghĩ chắc chắn anh Daniel phòng bên đã ăn. Vì anh ấy rất thích đồ ngọt. Nhưng hỏi ra thì hôm đó anh Daniel đi làm thêm cả ngày, không có ở ký túc xá. Người không có ở ký túc xá thì không lẽ nào ăn được. Thật ra là chính tôi đã cất nó vào một ngăn khác rồi quên mất. Vì tôi hay quên nên chẳng hề nghĩ đó là lỗi của mình. Từ chuyện này, tôi nghĩ mình không thể nghi ngờ người khác khi không có bằng chứng.',
        'Chỗ dễ vấp khi nói: **{食|た}べたに{違|ちが}いない** (ta-be-ta-ni-chi-ga-i-na-i — đừng nuốt い) · **{食|た}べられるはずがありません** (ha-zu-ga — が không phải は) · **{忘|わす}れっぽい** (wa-su-re-p-po-i — ngắt trước ぽ) · **{疑|うたが}うわけにはいかない** (u-ta-ga-u — bốn mora) · **{一日中|いちにちじゅう}** (i-chi-ni-chi-juu).',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 30 điểm) — đoạn mẫu 40 giây',
      items: [
        '{昨日|きのう}の{深夜|しんや}、みなと{駅|えき}の{近|ちか}くの{店|みせ}で、{窓|まど}ガラスが{割|わ}られる{事件|じけん}がありました。{現在|げんざい}、{警察|けいさつ}が{詳|くわ}しく{調|しら}べています。{防犯|ぼうはん}カメラには、{黒|くろ}っぽい{服|ふく}を{着|き}た{男|おとこ}が{映|うつ}っていました。{店|みせ}の{人|ひと}によると、お{金|かね}は{盗|ぬす}まれていないということです。{警察|けいさつ}は、{店|みせ}の{中|なか}をよく{知|し}っている{人|ひと}の{可能性|かのうせい}もあると{見|み}て、{調|しら}べを{進|すす}めています。',
        'Romaji: Kinou no shin\'ya, Minato-eki no chikaku no mise de, madogarasu ga warareru jiken ga arimashita. Genzai, keisatsu ga kuwashiku shirabete imasu. Bouhan kamera ni wa, kuroppoi fuku o kita otoko ga utsutte imashita. Mise no hito ni yoru to, okane wa nusumarete inai to iu koto desu. Keisatsu wa, mise no naka o yoku shitte iru hito no kanousei mo aru to mite, shirabe o susumete imasu.',
        'Nghĩa: Đêm khuya hôm qua, ở một cửa hàng gần ga Minato đã xảy ra vụ đập vỡ kính cửa sổ. Hiện cảnh sát đang điều tra chi tiết. Trong camera an ninh có một người đàn ông mặc quần áo màu đen đen. Theo người của cửa hàng thì tiền không bị lấy trộm. Cảnh sát cho rằng cũng có khả năng là người biết rõ bên trong cửa hàng, và đang tiếp tục điều tra.',
        'Chỗ dễ vấp: **{深夜|しんや}** (shi-n-ya — ん rồi や, không thành ~~しにゃ~~) · **{割|わ}られる** (bị động — wa-ra-re-ru) · **{現在|げんざい}** (ge-n-za-i — ざ đục) · **{黒|くろ}っぽい** (ku-ro-p-po-i) · **ということです** (giọng bản tin — nghe nói, ôn Bài 30) · **{調|しら}べを{進|すす}める** (tiếp tục điều tra).',
      ],
    },
    {
      t: 'speak',
      id: 'b31-noi-ghi-am',
      part: '1',
      questions: [
        'さいきん、 なにか なくした ものは ありますか。 どうやって みつけましたか。',
        'あなたは どんな せいかくですか。 「〜っぽい」を つかって はなして ください。',
        'だれかに たのまれて、 ことわれなかった ことは ありますか。',
        'すいり ドラマや すいり しょうせつは すきですか。 どうしてですか。',
        'ともだちを ごかいした ことは ありますか。 どうして ごかいしましたか。',
        'おもいこみで しっぱいした はなしを、 1ぷんで はなして ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b31-viet',
  kind: 'writing',
  title: 'Viết — bài văn N3 "Chuyện tôi đã đoán sai vì định kiến" (khoảng 300 chữ) và email hỏi phòng công tác sinh viên về đồ thất lạc',
  goal: 'Viết bài văn ~300 chữ thể thường (だ／である) có 4 đoạn theo cấu trúc trinh thám (sự việc → giả thuyết ～に違いない → bác bỏ ～はずがない／sự thật だから～わけだ → bài học ～わけではない／～わけにはいかない), dùng đúng ít nhất 5 mẫu của bài; viết email ngắn cho 学生課 mô tả đồ thất lạc (～っぽい, 特徴, 目印, 中身) và xin hẹn nhận, đúng khuôn email Nhật.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **作文「{思|おも}い{込|こ}みで{失敗|しっぱい}した{話|はなし}」**, **khoảng 300 chữ**, thể thường (だ／である) — đúng giọng bài văn của đề N3 và của báo tường. (Viết です／ます cũng được, miễn **thống nhất cả bài**.) Đề phụ: **email cho 学生課** (~150 chữ) — bạn làm mất một món đồ trong trường, mô tả đặc điểm và xin hẹn đến nhận. Viết xong tự chấm theo 5 tiêu chí cuối mục.',
    },
    {
      t: 'table',
      caption: 'Dàn ý bài văn 「{思|おも}い{込|こ}みで{失敗|しっぱい}した{話|はなし}」 — 4 đoạn, ~300 chữ',
      head: ['Đoạn', 'Nội dung', 'Mẫu nên dùng', 'Câu mở gợi ý'],
      rows: [
        ['1 · sự việc (~70 chữ)', 'Chuyện gì xảy ra, khi nào, ở đâu', '～間に (Bài 26) · ～ていた · ～のだ', '{先週|せんしゅう}、～で、{私|わたし}の～がなくなった。'],
        ['2 · giả thuyết (~60 chữ)', 'Lúc đầu mình TIN CHẮC điều gì, vì sao', 'きっと～に{違|ちが}いないと{思|おも}った · ～からだ', '{私|わたし}は、きっと～に{違|ちが}いないと{思|おも}った。'],
        ['3 · bác bỏ & sự thật (~100 chữ)', 'Vì sao giả thuyết sai; sự thật là gì', 'しかし、～はずがない · {実|じつ}は～ · ～ということだった (Bài 30) · だから／{道理|どうり}で～わけだ', 'しかし、よく{考|かんが}えると、～はずがない。'],
        ['4 · bài học (~70 chữ)', 'Rút ra điều gì; từ nay sẽ làm gì', '～が{必|かなら}ずしも～わけではない · ～わけにはいかない · ～ようにしたい', 'この{経験|けいけん}から、～わけではないと{分|わ}かった。'],
      ],
    },
    {
      t: 'note',
      title: 'Từ nối và câu "đinh" cấp N3',
      items: [
        '**Mở đầu sự việc**: {先日|せんじつ} (hôm trước — N3) · ある{日|ひ} · ～ていたときのことだ (đó là chuyện khi…) · ～間に (trong lúc — Bài 26).',
        '**Chuyển ý của truyện trinh thám**: **しかし** (nhưng) · **ところが** (thế nhưng — trái dự đoán) · **よく{考|かんが}えると** (nghĩ kỹ thì) · **そこで** (vì thế, thế là — dẫn tới hành động) · **{実|じつ}は** (thật ra).',
        '**Câu "đinh" của bài**: **～に{違|ちが}いないと{思|おも}った。しかし、～はずがない。** — hai câu này đứng cạnh nhau là người chấm thấy ngay bạn **nắm được độ chắc chắn**. Rồi chốt bằng **{道理|どうり}で～わけだ**.',
        '**Kết bài**: **～が{必|かなら}ずしも{正|ただ}しいわけではない** · **{証拠|しょうこ}もないのに、～わけにはいかない** · **これからは～ようにしたい** · **～ことが{大切|たいせつ}だと{思|おも}う**.',
        '**Thể thường trong bài văn**: {思|おも}った (không ~~{思|おも}いました~~ lẫn vào) · ～のだ／～のである (giải thích) · ～ということだった (truyền đạt lời người khác). **Đừng trộn** です／ます với だ trong cùng một bài.',
      ],
    },
    { t: 'h', text: 'Bài mẫu (≈ 300 chữ) — 「{思|おも}い{込|こ}みで{失敗|しっぱい}した{話|はなし}」' },
    {
      t: 'passage',
      title: '{思|おも}い{込|こ}みで{失敗|しっぱい}した{話|はなし}',
      intro: 'Đọc to bài mẫu, gạch chân các mẫu của Bài 31, rồi viết bài của bạn theo cùng dàn ý.',
      paras: [
        { text: '{先週|せんしゅう}、{大学|だいがく}の{図書館|としょかん}で、{私|わたし}のノートがなくなった。{机|つくえ}の{上|うえ}に{置|お}いて、トイレに{行|い}っている{間|あいだ}に{消|き}えていたのだ。' },
        { text: '{隣|となり}の{席|せき}には、いつも{同|おな}じ{場所|ばしょ}に{座|すわ}っている{男子学生|だんしがくせい}がいた。{私|わたし}は、きっとあの{人|ひと}が{持|も}っていったに{違|ちが}いないと{思|おも}った。{私|わたし}のノートを{何度|なんど}も{見|み}ていたからだ。' },
        { text: 'しかし、よく{考|かんが}えると、{私|わたし}が{戻|もど}ったとき、その{人|ひと}は{自分|じぶん}の{本|ほん}を{静|しず}かに{読|よ}んでいた。{人|ひと}の{物|もの}を{持|も}っていった{人|ひと}が、あんなに{落|お}ち{着|つ}いているはずがない。そこで、カウンターに{行|い}ってみると、{私|わたし}のノートが{届|とど}いていた。{職員|しょくいん}の{人|ひと}によると、{掃除|そうじ}の{人|ひと}が{忘|わす}れ{物|もの}だと{思|おも}って{届|とど}けてくれたということだった。{道理|どうり}で、{机|つくえ}の{上|うえ}に{何|なに}もなかったわけだ。' },
        { text: 'この{経験|けいけん}から、{自分|じぶん}の{考|かんが}えが{必|かなら}ずしも{正|ただ}しいわけではないと{分|わ}かった。{証拠|しょうこ}もないのに、{人|ひと}を{疑|うたが}うわけにはいかない。これからは、{決|き}めつける{前|まえ}に、まず{確|たし}かめるようにしたい。' },
      ],
    },
    {
      t: 'note',
      title: 'Bài mẫu — romaji, nghĩa và từ mới',
      items: [
        'Romaji: Senshuu, daigaku no toshokan de, watashi no nooto ga naku natta. Tsukue no ue ni oite, toire ni itte iru aida ni kiete ita no da. Tonari no seki ni wa, itsumo onaji basho ni suwatte iru danshi gakusei ga ita. Watashi wa, kitto ano hito ga motte itta ni chigainai to omotta. Watashi no nooto o nando mo mite ita kara da. Shikashi, yoku kangaeru to, watashi ga modotta toki, sono hito wa jibun no hon o shizuka ni yonde ita. Hito no mono o motte itta hito ga, anna ni ochitsuite iru hazu ga nai. Soko de, kauntaa ni itte miru to, watashi no nooto ga todoite ita. Shokuin no hito ni yoru to, souji no hito ga wasuremono da to omotte todokete kureta to iu koto datta. Douri de, tsukue no ue ni nani mo nakatta wake da. Kono keiken kara, jibun no kangae ga kanarazushimo tadashii wake de wa nai to wakatta. Shouko mo nai noni, hito o utagau wake ni wa ikanai. Kore kara wa, kimetsukeru mae ni, mazu tashikameru you ni shitai.',
        'Nghĩa: Tuần trước, ở thư viện trường, cuốn vở của tôi biến mất. Tôi để nó trên bàn, rồi trong lúc đi vệ sinh thì nó đã không còn. Ở ghế bên cạnh có một nam sinh lúc nào cũng ngồi đúng chỗ đó. Tôi đã nghĩ chắc chắn người đó đã lấy đi. Vì anh ta cứ nhìn cuốn vở của tôi mãi. Nhưng nghĩ kỹ thì lúc tôi quay lại, người đó đang lặng lẽ đọc sách của mình. Người vừa lấy đồ của người khác thì không lẽ nào lại bình thản như thế. Thế là tôi thử đến quầy, thì cuốn vở của tôi đã được mang tới đó. Theo nhân viên, người dọn vệ sinh tưởng là đồ bỏ quên nên đã mang nộp giúp. Thảo nào trên bàn chẳng còn gì. Từ chuyện này, tôi hiểu rằng suy nghĩ của mình không nhất thiết là đúng. Không có bằng chứng thì không thể nghi ngờ người khác. Từ nay, trước khi kết luận vội, tôi muốn kiểm tra trước đã.',
        'Mẫu của Bài 31 trong bài: **～に{違|ちが}いないと{思|おも}った** · **～はずがない** · **{道理|どうり}で～わけだ** · **{必|かなら}ずしも～わけではない** · **～わけにはいかない** — 5 mẫu + ôn **～{間|あいだ}に** (Bài 26), **～ということだった** (Bài 30), **～てくれた** (Bài 18).',
        'Từ mới: **{男子学生|だんしがくせい}** (nam sinh) · **{戻|もど}る** (quay lại) · **カウンター** (quầy) · **{職員|しょくいん}** (nhân viên — N3) · **{掃除|そうじ}の{人|ひと}** (người dọn vệ sinh) · **{決|き}めつける** (quy chụp, kết luận vội — N2) · **～ようにしたい** (muốn cố gắng — Bài 21).',
      ],
    },
    { t: 'h', text: 'Email mẫu — hỏi 学生課 về đồ thất lạc (~150 chữ)' },
    {
      t: 'examples',
      items: [
        E('{件名|けんめい}：{落|お}とし{物|もの}について（{経済学部|けいざいがくぶ}1{年|ねん}　リン）', 'Kenmei: Otoshimono ni tsuite (Keizai gakubu ichinen Rin)', 'Tiêu đề: Về đồ thất lạc (Linh — năm nhất khoa Kinh tế)'),
        E('{学生課|がくせいか}　ご{担当|たんとう}の{方|かた}　いつもお{世話|せわ}になっております。{経済学部|けいざいがくぶ}1{年|ねん}のリンと{申|もう}します。', 'Gakuseika gotantou no kata. Itsumo osewa ni natte orimasu. Keizai gakubu ichinen no Rin to moushimasu.', 'Kính gửi cán bộ phụ trách phòng công tác sinh viên. Cảm ơn quý phòng luôn giúp đỡ. Em là Linh, năm nhất khoa Kinh tế.'),
        E('11{月|がつ}8{日|か}の{午後|ごご}、{図書館|としょかん}3{階|がい}で{手袋|てぶくろ}を{片方|かたほう}なくしてしまいました。', 'Juuichigatsu youka no gogo, toshokan sangai de tebukuro o katahou nakushite shimaimashita.', 'Chiều ngày 8/11, em đã làm mất một chiếc găng tay ở tầng 3 thư viện.'),
        E('{白|しろ}っぽい{革|かわ}の{手袋|てぶくろ}で、{右手|みぎて}のほうです。{目印|めじるし}に、{小|ちい}さい{赤|あか}いリボンを{付|つ}けています。', 'Shiroppoi kawa no tebukuro de, migite no hou desu. Mejirushi ni, chiisai akai ribon o tsukete imasu.', 'Đó là găng tay da màu ngả trắng, chiếc tay phải. Em có buộc một ruy băng đỏ nhỏ để làm dấu.'),
        E('ホームページのリストの3{番|ばん}が、{私|わたし}の{手袋|てぶくろ}ではないかと{思|おも}います。', 'Hoomupeeji no risuto no sanban ga, watashi no tebukuro de wa nai ka to omoimasu.', 'Em nghĩ có lẽ số 3 trong danh sách trên trang web là găng tay của em.'),
        E('{明日|あした}の12{時|じ}ごろ、{学生証|がくせいしょう}を{持|も}って{窓口|まどぐち}に{伺|うかが}ってもよろしいでしょうか。', 'Ashita no juuniji goro, gakuseishou o motte madoguchi ni ukagatte mo yoroshii deshou ka.', 'Khoảng 12 giờ ngày mai, em mang thẻ sinh viên đến quầy có được không ạ?'),
        E('お{忙|いそが}しいところ{恐|おそ}れ{入|い}りますが、よろしくお{願|ねが}いいたします。', 'Oisogashii tokoro osoreirimasu ga, yoroshiku onegai itashimasu.', 'Xin lỗi đã làm phiền lúc quý phòng đang bận, kính mong được giúp đỡ.'),
      ],
    },
    {
      t: 'note',
      title: 'Khuôn email hỏi đồ thất lạc (Nhật) — 5 phần',
      items: [
        '**① {件名|けんめい}** — việc + tên + khoa, năm: {落|お}とし{物|もの}について（{学部|がくぶ}・{学年|がくねん}・{名前|なまえ}）.',
        '**② Chào + giới thiệu**: **ご{担当|たんとう}の{方|かた}** (gửi người phụ trách — không biết tên) · **いつもお{世話|せわ}になっております** · **～と{申|もう}します** (khiêm nhường — Bài 24).',
        '**③ Khi nào – ở đâu – đồ gì**: **～{日|にち}の{午後|ごご}、～で、～をなくしてしまいました**.',
        '**④ Mô tả 3 thứ**: **màu** (～っぽい) · **chất liệu / cỡ** ({革|かわ}・{小|ちい}さめ) · **{目印|めじるし}／{中身|なかみ}** — rồi đoán nhẹ: **～ではないかと{思|おも}います** (có lẽ là… — lịch sự, KHÔNG viết ~~～に{違|ちが}いありません~~: quá chắc, nghe như ép).',
        '**⑤ Xin hẹn + kết**: **～に{伺|うかが}ってもよろしいでしょうか** · **お{忙|いそが}しいところ{恐|おそ}れ{入|い}りますが** (xin lỗi vì làm phiền — câu cố định; chữ 恐 của bài!) · **よろしくお{願|ねが}いいたします**.',
      ],
    },
    {
      t: 'quiz',
      id: 'b31-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (8 câu)',
      kind: 'translate',
      grammar: '～に違いないと思った · ～はずがない · ～ということだった · 道理で～わけだ · ～わけではない · ～わけにはいかない (thể thường)',
      items: [
        { q: 'Tuần trước, chiếc ô của tôi biến mất ở nhà ăn của trường.', answers: V('{先週|せんしゅう}、{大学|だいがく}の{食堂|しょくどう}で、{私|わたし}の{傘|かさ}がなくなった。', '{先週|せんしゅう}、{大学|だいがく}の{食堂|しょくどう}で{私|わたし}の{傘|かさ}がなくなりました。'), hint: 'せんしゅう、だいがくの しょくどうで、わたしの かさが なくなった' },
        { q: 'Tôi đã nghĩ chắc chắn ai đó đã cầm nhầm.', answers: V('きっと{誰|だれ}かが{間違|まちが}えて{持|も}っていったに{違|ちが}いないと{思|おも}った。', '{誰|だれ}かが{間違|まちが}えて{持|も}っていったに{違|ちが}いないと{思|おも}った。', 'きっと{誰|だれ}かが{間違|まちが}えて{持|も}っていったに{違|ちが}いないと{思|おも}いました。'), hint: 'まちがえて もって いった に ちがいない と おもった' },
        { q: 'Nhưng nghĩ kỹ thì, hôm đó trời không mưa nên không lẽ nào có người cầm nhầm ô.', answers: V('しかし、よく{考|かんが}えると、その{日|ひ}は{雨|あめ}が{降|ふ}っていなかったから、{傘|かさ}を{間違|まちが}えるはずがない。', 'しかし、よく{考|かんが}えると、その{日|ひ}は{雨|あめ}が{降|ふ}っていなかったので、{傘|かさ}を{間違|まちが}えるはずがない。'), hint: 'あめが ふって いなかったから、かさを まちがえる はずがない' },
        { q: 'Theo nhân viên, người dọn vệ sinh đã mang nộp giúp.', answers: V('{職員|しょくいん}の{人|ひと}によると、{掃除|そうじ}の{人|ひと}が{届|とど}けてくれたということだった。', '{職員|しょくいん}の{人|ひと}によると、{掃除|そうじ}の{人|ひと}が{届|とど}けてくれたそうだ。'), hint: 'しょくいんの ひとに よると、…とどけて くれた ということだった' },
        { q: 'Thảo nào ở chỗ để ô chẳng còn gì.', answers: V('{道理|どうり}で{傘立|かさた}てに{何|なに}もなかったわけだ。', 'どうりで{傘立|かさた}てに{何|なに}もなかったわけだ。', '{道理|どうり}で、{傘立|かさた}てに{何|なに}もなかったわけです。'), hint: 'どうりで かさたてに なにも なかった わけだ' },
        { q: 'Suy nghĩ của mình không nhất thiết là đúng.', answers: V('{自分|じぶん}の{考|かんが}えが{必|かなら}ずしも{正|ただ}しいわけではない。', '{自分|じぶん}の{考|かんが}えは{必|かなら}ずしも{正|ただ}しいわけではない。', '{自分|じぶん}の{考|かんが}えが{必|かなら}ずしも{正|ただ}しいわけではありません。'), hint: 'かならずしも ただしい わけではない' },
        { q: 'Không có bằng chứng thì không thể nghi ngờ người khác.', answers: V('{証拠|しょうこ}もないのに、{人|ひと}を{疑|うたが}うわけにはいかない。', '{証拠|しょうこ}がないのに、{人|ひと}を{疑|うたが}うわけにはいかない。', '{証拠|しょうこ}もないのに、{人|ひと}を{疑|うたが}うわけにはいきません。'), hint: 'しょうこも ないのに、ひとを うたがう わけには いかない' },
        { q: 'Từ nay, tôi muốn kiểm tra trước khi kết luận.', answers: V('これからは、{決|き}める{前|まえ}に{確|たし}かめるようにしたい。', 'これからは、{決|き}めつける{前|まえ}に、まず{確|たし}かめるようにしたい。', 'これからは、{決|き}める{前|まえ}に{確|たし}かめるようにしたいです。'), hint: 'きめる まえに たしかめる ように したい' },
      ],
    },
    { t: 'h', text: 'Mô tả đồ thất lạc — khuôn 4 ô (dùng cho email, quầy ga, đồn cảnh sát)' },
    {
      t: 'note',
      title: 'Khuôn mô tả đồ vật — 4 ô',
      items: [
        '**Ô 1 · màu**: **～っぽい** khi không chắc ({黒|くろ}っぽい・{白|しろ}っぽい) · **こい／うすい ～** (đậm / nhạt) · **～と～のしま** (kẻ sọc… — N2).',
        '**Ô 2 · chất liệu & cỡ**: **{革|かわ}の** (da) · **{布|ぬの}の** (vải) · **プラスチックの** · **{小|ちい}さめ／{大|おお}きめ** (hơi nhỏ / hơi to) · **{長|なが}い／{折|お}りたたみの{傘|かさ}** (ô gấp).',
        '**Ô 3 · {目印|めじるし}**: **～が{付|つ}いています** (キーホルダー・リボン・シール) · **{名前|なまえ}が{書|か}いてあります** · **～が{少|すこ}し{壊|こわ}れています**.',
        '**Ô 4 · {中身|なかみ}**: **{中|なか}に～が{入|はい}っています** · **～は{入|はい}っていません** (nói cả điều KHÔNG có — giúp loại trừ, như ダニエル ở bài nghe 7).',
      ],
    },
    {
      t: 'quiz',
      id: 'b31-viet-mota',
      title: 'Viết câu mô tả — dịch Việt → Nhật (4 câu)',
      kind: 'translate',
      grammar: '～っぽい · ～が付いています · 中に～が入っています · ～ではないかと思います',
      items: [
        { q: 'Đó là chiếc túi giấy ngả trắng, hơi to.', answers: V('{白|しろ}っぽい{大|おお}きめの{紙袋|かみぶくろ}です。', '{白|しろ}っぽくて{大|おお}きめの{紙袋|かみぶくろ}です。'), hint: 'しろっぽい おおきめの かみぶくろ' },
        { q: 'Có gắn móc khoá màu vàng để làm dấu.', answers: V('{目印|めじるし}に{黄色|きいろ}いキーホルダーが{付|つ}いています。', '{目印|めじるし}に、{黄色|きいろ}いキーホルダーを{付|つ}けています。'), hint: 'めじるしに きいろい キーホルダーが ついて います' },
        { q: 'Bên trong có hai quyển vở và một cái bút.', answers: V('{中|なか}にノートが2{冊|さつ}とペンが1{本|ぽん}{入|はい}っています。', '{中|なか}にノート2{冊|さつ}とペン1{本|ぽん}が{入|はい}っています。'), hint: 'なかに ノートが 2さつと ペンが 1ぽん はいって います' },
        { q: 'Tôi nghĩ có lẽ số 5 trong danh sách là của tôi.', answers: V('リストの5{番|ばん}が{私|わたし}のではないかと{思|おも}います。', 'リストの5{番|ばん}は{私|わたし}の{物|もの}ではないかと{思|おも}います。'), hint: '…ではないかと おもいます (lịch sự — không dùng に違いない)' },
      ],
    },
    {
      t: 'note',
      title: 'Đề luyện thêm — chọn 1 trong 3 (cùng khuôn 4 đoạn, ~300 chữ)',
      items: [
        '**{作文|さくぶん}①「なくした{物|もの}が{見|み}つかった{話|はなし}」** — đồ gì, mất ở đâu; lúc đầu nghĩ **～に{違|ちが}いない**; tìm cách nào (～ことによって — Bài 27); khi thấy thì **だから～わけだ**; bài học (～ようにしている).',
        '**{作文|さくぶん}②「{友達|ともだち}を{誤解|ごかい}した{話|はなし}」** — bạn làm gì khiến mình nghĩ sai; mình nghĩ **きっと～に{違|ちが}いない**; sự thật: **{別|べつ}に～わけではなかった** / **～には{事情|じじょう}があった**; bài học.',
        '**{作文|さくぶん}③「{断|ことわ}れなかった{頼|たの}み{事|ごと}」** — ai nhờ gì; vì sao **{断|ことわ}るわけにはいかなかった**; làm rồi kết quả ra sao; lần sau sẽ thế nào (**{嫌|いや}なわけではないが、～**).',
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Nội dung đủ 4 đoạn** (sự việc · giả thuyết · bác bỏ & sự thật · bài học), mỗi đoạn có ý rõ ràng — 2đ.',
        '**② Dùng đúng ≥ 5 mẫu của Bài 31** — đặc biệt cặp **に{違|ちが}いない → はずがない** và câu chốt **わけだ** — 2đ.',
        '**③ Nối đúng**: に{違|ちが}いない với ナA／N **trần**; はず／わけ với **ナAな・Nの**; わけにはいかない chỉ sau **động từ** — 2đ.',
        '**④ Thống nhất thể văn** (toàn だ／である hoặc toàn です／ます), từ nối đúng chỗ (しかし／そこで／{実|じつ}は／{道理|どうり}で) — 2đ.',
        '**⑤ Chữ Hán của bài** viết đúng ít nhất 6 chữ (推 現 解 能 性 細 詳 深 過 在 印 象…), độ dài 270–330 chữ — 2đ.',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b31-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 31 — dịch, trắc nghiệm, ghép câu, đổi câu, suy luận từ tình huống (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 31 sau khi học: dịch câu Việt → Nhật có ～に違いない・～はずがない・～わけがない・～っぽい・～わけだ・～わけではない・～わけにはいかない; chọn mẫu đúng theo độ chắc chắn; ghép câu đúng trật tự; đổi câu sang mẫu tương đương; đọc một tình huống ngắn và chọn kết luận đúng như một thám tử.',
  minutes: 45,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm **không nhìn bài học**, rồi mới so đáp án. Câu gõ tay: máy chấm nhận chữ Hán hoặc kana, có hay không có dấu câu.',
        'Sai câu nào thì đọc lại **mục ngữ pháp** có số tương ứng (①～⑧) và **bảng phân biệt ⑧** — phần lớn lỗi của bài này nằm ở **nối từ** (に違いない trần ↔ はず／わけ の・な) và **phủ định kép** (ないはずがない・ないわけではない・ないわけにはいかない).',
        'Mục V (suy luận) không có trong bài học — đây là phần **vận dụng**: đọc tình huống như thám tử, chọn câu kết luận **vừa đúng logic vừa đúng mẫu**.',
      ],
    },
    {
      t: 'quiz',
      id: 'b31-bt-dich',
      title: 'I. Dịch Việt → Nhật (12 câu)',
      kind: 'translate',
      grammar: '①～に違いない ②～はずがない ③～わけがない ④～っぽい ⑤～わけだ ⑥～わけではない ⑦～わけにはいかない',
      items: [
        { q: 'Đèn phòng đã tắt nên chắc chắn anh ấy ngủ rồi.', answers: V('{部屋|へや}の{電気|でんき}が{消|き}えているから、{彼|かれ}はもう{寝|ね}ているに{違|ちが}いない。', '{部屋|へや}の{電気|でんき}が{消|き}えているから、もう{寝|ね}ているに{違|ちが}いない。', '{電気|でんき}が{消|き}えているから、{彼|かれ}はもう{寝|ね}ているに{違|ちが}いありません。'), hint: 'でんきが きえて いるから、もう ねて いる に ちがいない' },
        { q: 'Thủ phạm chắc chắn là người biết rõ căn phòng này.', answers: V('{犯人|はんにん}はこの{部屋|へや}をよく{知|し}っている{人|ひと}に{違|ちが}いない。', '{犯人|はんにん}は、この{部屋|へや}をよく{知|し}っている{人|ひと}に{違|ちが}いありません。'), hint: '…よく しって いる ひと に ちがいない (N trần)' },
        { q: 'Hôm nay là thứ Hai nên không lẽ nào ngân hàng nghỉ.', answers: V('{今日|きょう}は{月曜日|げつようび}だから、{銀行|ぎんこう}が{休|やす}みのはずがない。', '{今日|きょう}は{月曜日|げつようび}なので、{銀行|ぎんこう}が{休|やす}みのはずがありません。'), hint: 'ぎんこうが やすみ の はずがない' },
        { q: 'Anh ấy sống ở Nhật 10 năm, không lẽ nào lại không biết từ này.', answers: V('{彼|かれ}は{日本|にほん}に{十年|じゅうねん}{住|す}んでいるから、この{言葉|ことば}を{知|し}らないはずがない。', '{彼|かれ}は{日本|にほん}に{十年|じゅうねん}も{住|す}んでいるのだから、この{言葉|ことば}を{知|し}らないはずがない。', '{彼|かれ}は{日本|にほん}に{十年|じゅうねん}{住|す}んでいるので、この{言葉|ことば}を{知|し}らないはずがありません。'), hint: 'しらない はずがない (phủ định kép)' },
        { q: 'Bài khó thế này làm gì có chuyện giải được.', answers: V('こんな{難|むずか}しい{問題|もんだい}、{解|と}けるわけがない。', 'こんなに{難|むずか}しい{問題|もんだい}が{解|と}けるわけがない。', 'こんな{難|むずか}しい{問題|もんだい}が{解|と}けるわけがありません。'), hint: 'とける わけがない' },
        { q: 'Anh trai tôi đã 25 tuổi mà vẫn trẻ con.', answers: V('{兄|あに}は二十五{歳|さい}なのに、まだ{子|こ}どもっぽい。', '{兄|あに}は25{歳|さい}なのに、まだ{子|こ}どもっぽい。', '{兄|あに}は25{歳|さい}なのに、まだ{子|こ}どもっぽいです。', '{兄|あに}は二十五{歳|さい}なのに{子|こ}どもっぽい。'), hint: 'こどもっぽい' },
        { q: 'Dạo này tôi hay quên.', answers: V('{最近|さいきん}、{忘|わす}れっぽくなった。', '{最近|さいきん}{忘|わす}れっぽいです。', '{最近|さいきん}、{忘|わす}れっぽくなりました。', '{最近|さいきん}、{忘|わす}れっぽい。'), hint: 'わすれっぽい' },
        { q: '"Hôm qua cô ấy thức trắng đêm." — "Thảo nào trông buồn ngủ thế."', answers: V('「{彼女|かのじょ}は{昨日|きのう}{徹夜|てつや}したんだって。」「{道理|どうり}で{眠|ねむ}そうなわけだ。」', '「{昨日|きのう}{徹夜|てつや}したそうです。」「{道理|どうり}で{眠|ねむ}そうなわけですね。」', '{道理|どうり}で{眠|ねむ}そうなわけだ。'), hint: 'どうりで ねむそうな わけだ (ナA な)' },
        { q: 'Không phải người Nhật nào cũng thích sushi.', answers: V('{日本人|にほんじん}がみんなすしが{好|す}きなわけではない。', '{日本人|にほんじん}が{全員|ぜんいん}すしが{好|す}きなわけではありません。', '{日本人|にほんじん}がみんな、すしが{好|す}きなわけではありません。'), hint: 'みんな… すきな わけではない' },
        { q: 'Không phải là tôi không uống được rượu, nhưng hôm nay tôi lái xe.', answers: V('お{酒|さけ}が{飲|の}めないわけではないが、{今日|きょう}は{運転|うんてん}する。', 'お{酒|さけ}は{飲|の}めないわけではないんですが、{今日|きょう}は{車|くるま}です。', 'お{酒|さけ}が{飲|の}めないわけではないけど、{今日|きょう}は{運転|うんてん}します。'), hint: 'のめない わけではない が' },
        { q: 'Mai thi quan trọng nên tối nay không thể đi chơi.', answers: V('{明日|あした}は{大事|だいじ}な{試験|しけん}だから、{今夜|こんや}は{遊|あそ}びに{行|い}くわけにはいかない。', '{明日|あした}は{大切|たいせつ}な{試験|しけん}なので、{今夜|こんや}は{遊|あそ}びに{行|い}くわけにはいきません。'), hint: 'あそびに いく わけには いかない' },
        { q: 'Được thầy nhờ nên không thể không nhận.', answers: V('{先生|せんせい}に{頼|たの}まれたから、{引|ひ}き{受|う}けないわけにはいかない。', '{先生|せんせい}に{頼|たの}まれたので、{引|ひ}き{受|う}けないわけにはいきません。'), hint: 'ひきうけない わけには いかない' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-bt-chon',
      title: 'II. Chọn đáp án đúng (12 câu)',
      items: [
        { q: 'あの{店|みせ}はいつも{行列|ぎょうれつ}ができているから、おいしい（　）。', options: ['わけがない', 'に{違|ちが}いない', 'わけにはいかない', 'っぽい'], correct: 1, why: 'Dấu hiệu (luôn xếp hàng) → tin chắc → **に{違|ちが}いない** (①).' },
        { q: '{彼|かれ}は{今|いま}、{海外|かいがい}に{出張中|しゅっちょうちゅう}だから、{会議|かいぎ}に{来|く}る（　）。', options: ['に{違|ちが}いない', 'はずがない', 'わけだ', 'っぽい'], correct: 1, why: 'Căn cứ (đang công tác nước ngoài) → bác bỏ → **はずがない** (②).' },
        { q: 'まさか、あの{真面目|まじめ}な{人|ひと}がうそをつく（　）。', options: ['わけだ', 'わけではない', 'わけがない', 'に{違|ちが}いない'], correct: 2, why: '**まさか** + phủ nhận mạnh → **わけがない** (③).' },
        { q: '{犯人|はんにん}は{黒|くろ}（　）{服|ふく}を{着|き}ていたそうです。', options: ['っぽいな', 'っぽい', 'そうな', 'みたい'], correct: 1, why: 'Màu không rõ → **{黒|くろ}っぽい** (④) ＋ N. っぽい là tính từ い — không thêm な; {黒|くろ}そうな／{黒|くろ}みたい{服|ふく} sai cấu trúc.' },
        { q: 'エアコンが{壊|こわ}れていたのか。だから{暑|あつ}い（　）。', options: ['はずがない', 'わけだ', 'わけではない', 'わけにはいかない'], correct: 1, why: 'Biết lý do → "thảo nào" → **わけだ** (⑤).' },
        { q: '{高|たか}い{薬|くすり}が{必|かなら}ずしもよく{効|き}く（　）。', options: ['わけだ', 'わけではない', 'に{違|ちが}いない', 'はずだ'], correct: 1, why: '**{必|かなら}ずしも** → phủ định một phần → **わけではない** (⑥).' },
        { q: '{自分|じぶん}が{壊|こわ}したのだから、{謝|あやま}らない（　）。', options: ['わけではない', 'はずがない', 'わけがない', 'わけにはいかない'], correct: 3, why: 'Lỗi của mình → buộc phải xin lỗi → **Vないわけにはいかない** (⑦).' },
        { q: '{足|あし}が{痛|いた}くて、{全然|ぜんぜん}（　）。', options: ['{歩|ある}くわけにはいかない', '{歩|ある}けない', '{歩|ある}くわけがない', '{歩|ある}くはずがない'], correct: 1, why: 'Không có KHẢ NĂNG (đau chân) → **{歩|ある}けない**. わけにはいかない chỉ dùng khi làm được mà lẽ phải không cho (⑦, Bảng "6 cách").' },
        { q: '{彼女|かのじょ}が{来|こ}ない（　）。{彼女|かのじょ}が{主役|しゅやく}のパーティーなんだから。', options: ['はずがない', 'はずだ', 'わけだ', 'に{違|ちが}いない'], correct: 0, why: 'Cô ấy là nhân vật chính → **{来|こ}ないはずがない** = chắc chắn đến (phủ định kép ②). {主役|しゅやく} = vai chính.' },
        { q: '{夜|よる}の{海|うみ}は{静|しず}か（　）。', options: ['なに{違|ちが}いない', 'に{違|ちが}いない', 'のに{違|ちが}いない', 'だに{違|ちが}いない'], correct: 1, why: 'ナA **trần** ＋ に{違|ちが}いない (①).' },
        { q: '「{肉|にく}、{嫌|きら}いなの？」「{嫌|きら}いな（　）けど、{今日|きょう}はあまり{食|た}べたくないんだ。」', options: ['わけがない', 'わけじゃない', 'わけだ', 'はずがない'], correct: 1, why: 'Gạt suy đoán + lý do khác → **わけじゃない** (văn nói của わけではない — ⑥).' },
        { q: '「この{問題|もんだい}、{簡単|かんたん}だよ。」「うん、こんなの（　）よ。」', options: ['わけがない', 'わけにはいかない', 'わけない', 'わけではない'], correct: 2, why: '**わけない** đứng riêng = **dễ ợt** (⑧ Bảng 4). Đồng tình "dễ" → わけない.' },
      ],
    },
    {
      t: 'build',
      id: 'b31-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Chắc chắn là cô ấy đã quên hẹn.', chips: ['{彼女|かのじょ}は', '{約束|やくそく}を', '{忘|わす}れた', 'に{違|ちが}いない', 'はずがない'], answer: ['{彼女|かのじょ}は', '{約束|やくそく}を', '{忘|わす}れた', 'に{違|ちが}いない'], ro: 'Kanojo wa yakusoku o wasureta ni chigainai.' },
        { vi: 'Không lẽ nào chuyện đó lại đúng.', chips: ['そんな', '{話|はなし}が', '{本当|ほんとう}の', 'はずがない', '{本当|ほんとう}な'], answer: ['そんな', '{話|はなし}が', '{本当|ほんとう}の', 'はずがない'], ro: 'Sonna hanashi ga hontou no hazu ga nai.' },
        { vi: 'Món cà ri anh tôi nấu thì làm gì có chuyện ngon.', chips: ['{兄|あに}が', '{作|つく}った', 'カレーが', 'おいしい', 'わけがない', 'わけだ'], answer: ['{兄|あに}が', '{作|つく}った', 'カレーが', 'おいしい', 'わけがない'], ro: 'Ani ga tsukutta karee ga oishii wake ga nai.' },
        { vi: 'Bố tôi dễ nổi nóng nhưng hiền.', chips: ['{父|ちち}は', '{怒|おこ}りっぽい', 'けど', '{優|やさ}しい', '{怒|おこ}るっぽい'], answer: ['{父|ちち}は', '{怒|おこ}りっぽい', 'けど', '{優|やさ}しい'], ro: 'Chichi wa okorippoi kedo yasashii.' },
        { vi: 'Thảo nào cô ấy giỏi tiếng Anh.', chips: ['{道理|どうり}で', '{彼女|かのじょ}は', '{英語|えいご}が', '{上手|じょうず}な', 'わけだ', '{上手|じょうず}'], answer: ['{道理|どうり}で', '{彼女|かのじょ}は', '{英語|えいご}が', '{上手|じょうず}な', 'わけだ'], ro: 'Douri de kanojo wa eigo ga jouzu na wake da.' },
        { vi: 'Không phải ngày nào tôi cũng tập thể dục.', chips: ['{毎日|まいにち}', '{運動|うんどう}して', 'いる', 'わけでは', 'ありません', 'わけが'], answer: ['{毎日|まいにち}', '{運動|うんどう}して', 'いる', 'わけでは', 'ありません'], ro: 'Mainichi undou shite iru wake de wa arimasen.' },
        { vi: 'Tôi không thể nói bí mật của bạn.', chips: ['{友達|ともだち}の', '{秘密|ひみつ}を', '{話|はな}す', 'わけには', 'いかない', 'わけでも'], answer: ['{友達|ともだち}の', '{秘密|ひみつ}を', '{話|はな}す', 'わけには', 'いかない'], ro: 'Tomodachi no himitsu o hanasu wake ni wa ikanai.' },
        { vi: 'Đã có tiền ở trong thì không thể không nộp đồn.', chips: ['お{金|かね}が', '{入|はい}っているから', '{交番|こうばん}に', '{届|とど}けない', 'わけにはいかない', '{届|とど}ける'], answer: ['お{金|かね}が', '{入|はい}っているから', '{交番|こうばん}に', '{届|とど}けない', 'わけにはいかない'], ro: 'Okane ga haitte iru kara kouban ni todokenai wake ni wa ikanai.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b31-bt-doi',
      title: 'IV. Đổi câu — viết lại bằng mẫu trong ngoặc (8 câu)',
      kind: 'translate',
      grammar: 'Giữ nguyên nghĩa, chỉ đổi mẫu. Chú ý cách nối của mẫu mới.',
      items: [
        { q: 'きっと{彼|かれ}が{犯人|はんにん}だと{思|おも}う。（→ に{違|ちが}いない）', answers: V('{彼|かれ}が{犯人|はんにん}に{違|ちが}いない。', 'きっと{彼|かれ}が{犯人|はんにん}に{違|ちが}いない。', '{彼|かれ}は{犯人|はんにん}に{違|ちが}いない。'), hint: 'N trần ＋ に違いない' },
        { q: '{彼女|かのじょ}が{来|く}ることは{絶対|ぜったい}にない。{入院中|にゅういんちゅう}だから。（→ はずがない）', answers: V('{入院中|にゅういんちゅう}だから、{彼女|かのじょ}が{来|く}るはずがない。', '{彼女|かのじょ}は{入院中|にゅういんちゅう}だから、{来|く}るはずがない。'), hint: '…だから、くる はずがない' },
        { q: 'こんな{安|やす}い{時計|とけい}が{本物|ほんもの}だということは{絶対|ぜったい}にない。（→ わけがない）', answers: V('こんな{安|やす}い{時計|とけい}が{本物|ほんもの}のわけがない。', 'こんな{安|やす}い{時計|とけい}が{本物|ほんもの}であるわけがない。'), hint: 'N の／である ＋ わけがない' },
        { q: '{彼|かれ}はよく{物|もの}を{忘|わす}れる。（→ っぽい）', answers: V('{彼|かれ}は{忘|わす}れっぽい。', '{彼|かれ}は{忘|わす}れっぽいです。'), hint: 'Vます ＋ っぽい' },
        { q: '{窓|まど}が{開|あ}いていた。それが{寒|さむ}い{理由|りゆう}だ。（→ だから～わけだ）', answers: V('{窓|まど}が{開|あ}いていた。だから{寒|さむ}いわけだ。', '{窓|まど}が{開|あ}いていたから、{寒|さむ}いわけだ。', '{窓|まど}が{開|あ}いていた。だから{寒|さむ}かったわけだ。'), hint: 'だから さむい わけだ' },
        { q: '{嫌|きら}いだから{食|た}べないのではない。{今|いま}、お{腹|なか}がいっぱいなだけだ。（→ わけではない）', answers: V('{嫌|きら}いなわけではない。{今|いま}、お{腹|なか}がいっぱいなだけだ。', '{嫌|きら}いだから{食|た}べないわけではない。{今|いま}、お{腹|なか}がいっぱいなだけだ。'), hint: 'きらいな わけではない' },
        { q: '{時間|じかん}は{少|すこ}しある。でも、{今日|きょう}は{手伝|てつだ}えない。（→ ないわけではない）', answers: V('{時間|じかん}がないわけではないが、{今日|きょう}は{手伝|てつだ}えない。', '{時間|じかん}がないわけではないけど、{今日|きょう}は{手伝|てつだ}えない。'), hint: 'じかんが ない わけではないが' },
        { q: '{明日|あした}は{試験|しけん}だから、{休|やす}むことはできない。（→ わけにはいかない）', answers: V('{明日|あした}は{試験|しけん}だから、{休|やす}むわけにはいかない。', '{明日|あした}は{試験|しけん}なので、{休|やす}むわけにはいかない。'), hint: 'やすむ わけには いかない' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-bt-suy',
      title: 'V. Suy luận như thám tử — đọc tình huống, chọn kết luận đúng (8 câu)',
      items: [
        { q: '{玄関|げんかん}に{濡|ぬ}れた{傘|かさ}がある。{今朝|けさ}は{晴|は}れていた。……{何|なに}が{言|い}えますか。', options: ['{雨|あめ}が{降|ふ}ったはずがない。', '{傘|かさ}を{使|つか}ったわけではない。', '{誰|だれ}かが{雨|あめ}の{中|なか}を{帰|かえ}ってきたに{違|ちが}いない。', '{雨|あめ}が{降|ふ}るわけにはいかない。'], correct: 2, why: 'Dấu hiệu (ô ướt) → suy ra có người đi mưa về → **に{違|ちが}いない**. "Không thể mưa" trái với dấu hiệu.' },
        { q: 'ダニエルさんは{昨日|きのう}から{国|くに}に{帰|かえ}っている。{今朝|けさ}、{寮|りょう}の{食堂|しょくどう}で「ダニエルさんを{見|み}た」という{人|ひと}がいる。……', options: ['ダニエルさんが{寮|りょう}にいるに{違|ちが}いない。', 'ダニエルさんが{寮|りょう}にいるはずがない。{見間違|みまちが}いだろう。', 'ダニエルさんが{寮|りょう}にいるわけだ。', 'ダニエルさんが{寮|りょう}にいるわけにはいかない。'], correct: 1, why: 'Căn cứ (đã về nước từ hôm qua) → bác bỏ → **はずがない** + chắc là nhìn nhầm ({見間違|みまちが}い).' },
        { q: '「{山口|やまぐち}さん、{最近|さいきん}{毎日|まいにち}{図書館|としょかん}で{夜|よる}9{時|じ}まで{勉強|べんきょう}しているよ。」「（　）」', options: ['{勉強|べんきょう}しているわけがないよ。', '{勉強|べんきょう}するわけにはいかないね。', '{勉強|べんきょう}が{嫌|きら}いに{違|ちが}いない。', 'ああ、{来月|らいげつ}N2の{試験|しけん}だから、それで{頑張|がんば}っているわけだ。'], correct: 3, why: 'Biết lý do (sắp thi N2) → **それで～わけだ** (⑤).' },
        { q: '{机|つくえ}の{上|うえ}の{時計|とけい}が{止|と}まっている。{電池|でんち}を{替|か}えたのは{三年前|さんねんまえ}だ。……', options: ['{電池|でんち}が{切|き}れたに{違|ちが}いない。', '{電池|でんち}が{切|き}れるはずがない。', '{時計|とけい}が{止|と}まるわけにはいかない。', '{時計|とけい}が{止|と}まったわけではない。'], correct: 0, why: 'Ba năm không thay pin + đồng hồ dừng → **{電池|でんち}が{切|き}れたに{違|ちが}いない**.' },
        { q: '{西川|にしかわ}さんは{毎日|まいにち}お{弁当|べんとう}を{持|も}ってくる。「{料理|りょうり}が{好|す}きなんですか」と{聞|き}くと……', options: ['「{好|す}きなわけがありません。」', '「{好|す}きなわけじゃないんです。{節約|せつやく}のためです。」', '「{好|す}きに{違|ちが}いありません。」', '「{好|す}きなわけにはいきません。」'], correct: 1, why: 'Gạt suy đoán của người hỏi + lý do khác → **わけじゃない** (⑥). わけがない là phủ nhận quá gay gắt.' },
        { q: '{友達|ともだち}の{結婚式|けっこんしき}でスピーチを{頼|たの}まれた。{人前|ひとまえ}で{話|はな}すのは{苦手|にがて}だが、{一番|いちばん}の{友達|ともだち}だ。……', options: ['{引|ひ}き{受|う}けるはずがない。', '{引|ひ}き{受|う}けたに{違|ちが}いない。', '{引|ひ}き{受|う}けないわけにはいかない。', '{引|ひ}き{受|う}けるわけだ。'], correct: 2, why: 'Không thích nhưng tình bạn buộc → **Vないわけにはいかない** (⑦).' },
        { q: '「この{財布|さいふ}、{千円|せんえん}で{買|か}ったんだ。」「えっ、{革|かわ}に{見|み}えるけど……」……{革|かわ}の{財布|さいふ}は{普通|ふつう}{一万円|いちまんえん}{以上|いじょう}する。', options: ['{本物|ほんもの}の{革|かわ}に{違|ちが}いない。', '{本物|ほんもの}の{革|かわ}のわけにはいかない。', '{革|かわ}っぽいわけではない。', '{千円|せんえん}の{財布|さいふ}が{本物|ほんもの}の{革|かわ}のわけがない。'], correct: 3, why: 'Lẽ thường (da thật thì đắt) → phủ nhận mạnh → **わけがない** (③). (Câu nói đúng ý: nó **{革|かわ}っぽい** — trông giống da — nhưng không phải da thật.)' },
        { q: '{部屋|へや}が{暗|くら}い。カーテンが{閉|し}まっている。{電気|でんき}もついていない。{今|いま}は{昼|ひる}の12{時|じ}だ。……{部屋|へや}が{暗|くら}い{理由|りゆう}を{言|い}うと？', options: ['{昼|ひる}だから、{暗|くら}いはずがない。', 'カーテンが{閉|し}まっているから、{暗|くら}いわけだ。', '{暗|くら}いわけにはいかない。', '{暗|くら}いに{違|ちが}いない。'], correct: 1, why: 'Thấy lý do rõ ràng (rèm đóng) → **～から、{暗|くら}いわけだ** (⑤). "Trưa thì không thể tối" trái với điều đang thấy.' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b31-buoi-1-chigainai-hazu',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 31 (N3): từ mới suy luận & trinh thám · ～に違いない chắc chắn là · ～はずがない không lẽ nào · ～わけがない làm gì có chuyện · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng ～はずだ (Bài 20), học từ nhóm suy luận & phán đoán và vụ việc & trinh thám, nắm ba mẫu "độ chắc chắn" — に違いない (tin chắc ĐÚNG), はずがない (bác bỏ CÓ CĂN CỨ), わけがない (phủ nhận MẠNH, chủ quan) — và cách nối khác nhau của chúng, đọc hội thoại ① ở ký túc xá, luyện cặp "Nó ở đâu nhỉ?" và trả lời 5 câu kiểm tra cuối buổi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn **～はずだ** (Bài 20 ⑤: {九時|くじ}の{電車|でんしゃ}に{乗|の}ったから、{十時|じゅうじ}に{着|つ}くはずです) và **～ないはずだ**. Câu hỏi mở đầu: "Muốn nói **không lẽ nào** — mạnh hơn ないはずだ — thì nói sao?"',
        '**Từ mới (12′)** — nhóm A (suy luận: {推理|すいり}, {推測|すいそく}, {想像|そうぞう}, {可能性|かのうせい}, {恐|おそ}らく, どうやら, もしかすると, {明|あき}らか, {証拠|しょうこ}, {手|て}がかり, {謎|なぞ}, {解決|かいけつ}, {解|と}く, {気|き}づく) + nhóm B (trinh thám: {探偵|たんてい}, {刑事|けいじ}, {現場|げんば}, {犯罪|はんざい}, {隠|かく}す, {隠|かく}れる, うそ, {怪|あや}しい, {足跡|あしあと}, {映|うつ}る, {深夜|しんや}, {現在|げんざい}…).',
        '**Ngữ pháp (20′)** — ① **～に{違|ちが}いない** "chắc chắn là" (ナA／N **trần**) · ② **～はずがない** "không lẽ nào" (+ そんなはずはない, phủ định kép ないはずがない) · ③ **～わけがない** "làm gì có chuyện" (+ bẫy わけない = dễ ợt).',
        '**Hội thoại (8′)** — ① hành lang ký túc xá: ダニエル lại mất chìa khoá.',
        '**チャレンジ (5′)** — luyện cặp: A 「{私|わたし}の～、どこだろう？」 ↔ B suy luận bằng に{違|ちが}いない／はずがない. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b31-b1-slides',
      title: 'Bài 31 推理 — Buổi 1: ～に違いない・～はずがない・～わけがない',
      slides: [
        {
          tieuDe: '{第|だい}31{課|か} {推理|すいり}',
          anh: ['detective', 'magnifying-glass-tilted-left', 'old-key'],
          nhan: ['{探偵|たんてい}', '{推理|すいり}', '{鍵|かぎ}'],
          dong: ['Hôm nay: **～に{違|ちが}いない** (chắc chắn là) · **～はずがない** (không lẽ nào) · **～わけがない** (làm gì có chuyện)'],
          ro: ['~ni chigainai · ~hazu ga nai · ~wake ga nai'],
          ghi: 'Bài 31 là bài "thám tử": nói mình chắc đến đâu, bác bỏ thế nào, kết luận ra sao. Buổi 1: ba mẫu độ chắc chắn. Buổi 2: ～っぽい (tả) và ～わけだ (thảo nào). Buổi 3: ～わけではない, ～わけにはいかない + bảng phân biệt.',
        },
        {
          tieuDe: 'できること — Học xong Bài 31 làm được gì?',
          anh: ['old-key', 'shortcake', 'purse'],
          nhan: ['31-1 {寮|りょう}で', '31-2 ゼミで', '31-3 アルバイト'],
          dong: ['① Suy luận: コンビニで{落|お}としたに{違|ちが}いない。／{落|お}ちるはずがない。', '② Đố trinh thám: {犯人|はんにん}は{先生|せんせい}に{違|ちが}いありません！', '③ Từ chối khéo: {断|ことわ}るわけにはいかないし……。'],
          ro: ['Konbini de otoshita ni chigainai. / Ochiru hazu ga nai.', 'Hannin wa sensei ni chigai arimasen!', 'Kotowaru wake ni wa ikanai shi…….'],
          ghi: 'Cuối Bài 31 bạn trình bày được 1 phút "Một lần tôi đoán sai vì định kiến" — dạng Presenting của thi nói N3.',
        },
        {
          tieuDe: 'Khởi động — ôn ～はずだ (Bài 20)',
          anh: ['train', 'alarm-clock'],
          nhan: ['{九時|くじ}の{電車|でんしゃ}', '{十時|じゅうじ}'],
          dong: ['{九時|くじ}の{電車|でんしゃ}に{乗|の}ったから、{十時|じゅうじ}に{着|つ}くはずです。', '{今日|きょう}は{出張|しゅっちょう}だから、{彼|かれ}は{来|こ}ないはずです。'],
          ro: ['Kuji no densha ni notta kara, juuji ni tsuku hazu desu.', 'Kyou wa shucchou da kara, kare wa konai hazu desu.'],
          hoi: '「{来|こ}ないはずです」はどのくらい{確|たし}かですか。',
          dap: 'Khoảng 90% — **chắc là không đến**, có căn cứ (đi công tác). Hôm nay học cách nói **mạnh hơn**: {来|く}るはずがない = **không lẽ nào** đến.',
          ghi: 'Vẽ lên bảng một "thước đo" 0% → 100%. Đặt はずだ ở 90%. Cả buổi sẽ đặt thêm mẫu mới lên thước này.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — {推理|すいり}する',
          anh: ['magnifying-glass-tilted-left', 'thinking-face', 'thought-balloon', 'puzzle-piece'],
          nhan: ['{推理|すいり}', '{推測|すいそく}', '{想像|そうぞう}', '{手|て}がかり'],
          dong: ['{小|ちい}さな{手|て}がかりから{犯人|はんにん}を{推理|すいり}する。', '{十年後|じゅうねんご}の{自分|じぶん}を{想像|そうぞう}する。'],
          ro: ['Chiisana tegakari kara hannin o suiri suru.', 'Juunengo no jibun o souzou suru.'],
          hoi: '「{推理|すいり}」と「{想像|そうぞう}」はどう{違|ちが}いますか。',
          dap: '{推理|すいり}: lập luận TỪ MANH MỐI tới kết luận. {想像|そうぞう}: hình dung điều chưa thấy — không cần căn cứ.',
          ghi: 'Thêm: {可能性|かのうせい} (khả năng xảy ra), {恐|おそ}らく～だろう, どうやら～らしい, もしかすると～かもしれない, {明|あき}らか, {証拠|しょうこ}, {謎|なぞ}を{解|と}く, {解決|かいけつ}する, ミスに{気|き}づく.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {事件|じけん}の{現場|げんば}',
          anh: ['footprints', 'video-camera', 'face-with-raised-eyebrow', 'lying-face'],
          nhan: ['{足跡|あしあと}', '{映|うつ}る', '{怪|あや}しい', 'うそ'],
          dong: ['{現場|げんば}に{足跡|あしあと}が{残|のこ}っていました。', '{防犯|ぼうはん}カメラに{怪|あや}しい{男|おとこ}が{映|うつ}っていました。'],
          ro: ['Genba ni ashiato ga nokotte imashita.', 'Bouhan kamera ni ayashii otoko ga utsutte imashita.'],
          hoi: '「カメラに{映|うつ}る」と「{写真|しゃしん}に{写|うつ}る」はどう{違|ちが}いますか。',
          dap: '{映|うつ}る: hiện trong gương, màn hình, camera. {写|うつ}る: hiện trong ẢNH chụp.',
          ghi: 'Thêm: {探偵|たんてい}, {推理小説|すいりしょうせつ}, {刑事|けいじ}, {犯罪|はんざい} (hành vi) ≠ {犯人|はんにん} (người), {容疑者|ようぎしゃ} (tin tức), {隠|かく}す ↔ {隠|かく}れる, うそをつく, {見|み}かける, {深夜|しんや}, {現在|げんざい}, {過去|かこ}.',
        },
        {
          tieuDe: '① ～に{違|ちが}いない — "chắc chắn là…"',
          anh: ['detective', 'light-bulb'],
          nhan: ['{探偵|たんてい}', 'ひらめき'],
          dong: ['{電気|でんき}が{消|き}えているから、もう{寝|ね}ているに{違|ちが}いない。', '{犯人|はんにん}はあの{男|おとこ}に{違|ちが}いありません。'],
          ro: ['Denki ga kiete iru kara, mou nete iru ni chigainai.', 'Hannin wa ano otoko ni chigai arimasen.'],
          bang: { head: ['Loại từ', '＋ に違いない'], rows: [['V', '{寝|ね}ている**に{違|ちが}いない**'], ['イA', 'おいしい**に{違|ちが}いない**'], ['ナA', '{静|しず}か**に{違|ちが}いない** (không な)'], ['N', '{犯人|はんにん}**に{違|ちが}いない** (không の)']] },
          ghi: 'Đặt lên thước: に{違|ちが}いない ≈ 90%, CHỦ QUAN (cảm giác, dấu hiệu). Văn viết, tiểu thuyết. Nói chuyện thường: きっと～と{思|おも}う.',
        },
        {
          tieuDe: '① Lỗi hay gặp — ナA, N đứng TRẦN',
          anh: ['cross-mark', 'check-mark-button'],
          nhan: ['✗', '○'],
          dong: ['✗ {静|しず}かなに{違|ちが}いない　→　○ {静|しず}かに{違|ちが}いない', '✗ {犯人|はんにん}のに{違|ちが}いない　→　○ {犯人|はんにん}に{違|ちが}いない'],
          ro: ['shizuka na ni chigainai → shizuka ni chigainai', 'hannin no ni chigainai → hannin ni chigainai'],
          hoi: '「この{傘|かさ}は{木村|きむら}さんのに{違|ちが}いない」は{正|ただ}しいですか。',
          dap: '**Đúng** — の ở đây là "**của**" ({木村|きむら}さんの{傘|かさ}). Chỉ sai khi の dùng để nối N với に{違|ちが}いない.',
          ghi: 'Bẫy đề: lựa chọn ~~に{違|ちが}わない~~ ({違|ちが}う phủ định = không khác) — không phải mẫu này.',
        },
        {
          tieuDe: '② ～はずがない — "không lẽ nào…"',
          anh: ['locked', 'old-key'],
          nhan: ['{鍵|かぎ}をかけた', '{泥棒|どろぼう}？'],
          dong: ['{鍵|かぎ}をかけたから、{泥棒|どろぼう}が{入|はい}るはずがない。', '{記録|きろく}があるから、{彼|かれ}が{犯人|はんにん}のはずがない。'],
          ro: ['Kagi o kaketa kara, dorobou ga hairu hazu ga nai.', 'Kiroku ga aru kara, kare ga hannin no hazu ga nai.'],
          bang: { head: ['Câu', 'Nghĩa'], rows: [['{来|こ}ないはずだ', 'chắc là không đến (~10%)'], ['{来|く}るはずがない', 'KHÔNG LẼ NÀO đến (~0%)'], ['{来|こ}ないはずがない', 'không lẽ nào không đến = CHẮC CHẮN đến']] },
          ghi: 'はず là danh từ → **Nの・ナAな** (khác に{違|ちが}いない!). Có CĂN CỨ khách quan ở vế trước (～から).',
        },
        {
          tieuDe: '② そんなはずはない！',
          anh: ['astonished-face', 'yen-banknote'],
          nhan: ['えっ！', '{千円|せんえん}{足|た}りない'],
          dong: ['「レジのお{金|かね}が{千円|せんえん}{足|た}りません。」', '「そんなはずはないよ。{二回|にかい}{数|かぞ}えたんだから。」'],
          ro: ['"Reji no okane ga sen\'en tarimasen."', '"Sonna hazu wa nai yo. Nikai kazoeta n da kara."'],
          hoi: '「そんなはずはない」はどんなときに{言|い}いますか。',
          dap: 'Khi **thực tế trái với điều mình tin chắc** (có căn cứ) — ngạc nhiên, không tin nổi: "Không thể nào!".',
          ghi: 'Đối đáp tự nhiên: A「そんなはずはない」 → B đưa bằng chứng: 「でも、ほら、～よ」.',
        },
        {
          tieuDe: '③ ～わけがない — "làm gì có chuyện…"',
          anh: ['face-with-rolling-eyes', 'shortcake'],
          nhan: ['まさか', 'ケーキ'],
          dong: ['{甘|あま}い{物|もの}が{嫌|きら}いな{人|ひと}が、ケーキなんか{食|た}べるわけがない。', 'まさか、あの{優|やさ}しい{人|ひと}が{犯人|はんにん}のわけがない。'],
          ro: ['Amai mono ga kirai na hito ga, keeki nanka taberu wake ga nai.', 'Masaka, ano yasashii hito ga hannin no wake ga nai.'],
          hoi: '「こんな{問題|もんだい}、わけないよ」はどんな{意味|いみ}ですか。',
          dap: '**わけない** (đứng riêng) = **dễ ợt**! Khác với {解|と}けるわけない (làm sao giải được).',
          ghi: 'わけ = lý do → "không có lý do nào để…". Chủ quan, cảm xúc, văn nói (～わけないじゃん). Đi với まさか・なんか・こんな.',
        },
        {
          tieuDe: '② はずがない ↔ ③ わけがない',
          anh: ['balance-scale'],
          nhan: ['どっち？'],
          bang: { head: ['', 'はずがない', 'わけがない'], rows: [['Dựa vào', 'căn cứ khách quan (lịch, ghi chép)', 'lẽ thường, tính cách, cảm xúc'], ['Giọng', 'bình tĩnh, logic', 'mạnh, ngạc nhiên, bực'], ['Đi với', '～から、～なら', 'まさか、なんか、こんな'], ['Nối', 'Nの・ナAな', 'Nの／である・ナAな']] },
          hoi: '「{今日|きょう}は{日曜日|にちようび}だから、{銀行|ぎんこう}が{開|あ}いている（　）」— はずがない？わけがない？',
          dap: 'Cả hai đều đúng; **はずがない** tự nhiên hơn vì căn cứ là **lịch** (khách quan).',
          ghi: 'Đặt cả hai lên thước ở 0%. Đề N3 phần lớn chấp nhận cả hai — câu hỏi thật thường là chọn giữa nhóm "0%" và nhóm "90%".',
        },
        {
          tieuDe: '{会話|かいわ}① — {寮|りょう}のろうかで',
          anh: ['old-key', 'man-student', 'coat'],
          nhan: ['{鍵|かぎ}', 'ダニエル', 'ジャケット'],
          dong: ['コンビニで{落|お}としたに{違|ちが}いない！', '{財布|さいふ}はリュックだから、{落|お}ちるはずがありませんよ。', '{鍵|かぎ}なんか、{誰|だれ}も{盗|ぬす}むわけがないですよ。'],
          ro: ['Konbini de otoshita ni chigainai!', 'Saifu wa ryukku da kara, ochiru hazu ga arimasen yo.', 'Kagi nanka, dare mo nusumu wake ga nai desu yo.'],
          hoi: 'リンさんはどうして「{落|お}ちるはずがない」と{言|い}いましたか。',
          dap: '{鍵|かぎ}はズボンのポケットで、{財布|さいふ}はリュックだからです。（căn cứ khách quan → はずがない）',
          ghi: 'Đọc to theo vai (ダニエル — リン). Gạch chân: に{違|ちが}いない (ダニエル — sai!), はずがない, わけがない, っぽい, わけだ (buổi 2 học kỹ).',
        },
        {
          tieuDe: 'チャレンジ — {話|はな}してみよう',
          anh: ['person-raising-hand', 'magnifying-glass-tilted-left'],
          nhan: ['A', 'B（{探偵|たんてい}）'],
          dong: ['A：{私|わたし}の～、どこだろう？　{見|み}つからないんだ。', 'B：～から、～に{違|ちが}いないよ。', 'A：でも、～から、～はずがないよ。', 'B：じゃ、もしかすると～かもしれない。'],
          ro: ['A: Watashi no ~, doko darou? Mitsukaranai n da.', 'B: ~ kara, ~ ni chigainai yo.', 'A: Demo, ~ kara, ~ hazu ga nai yo.', 'B: Ja, moshika suru to ~ kamo shirenai.'],
          ghi: 'Đổi vai 2 lần. Đồ bị mất: {鍵|かぎ}・{傘|かさ}・{学生証|がくせいしょう}・イヤホン. Mỗi người phải dùng đủ 3 mức: に{違|ちが}いない → はずがない → かもしれない. Giáo viên đi quanh nghe phần nối (ナA／N trần với に{違|ちが}いない).',
        },
        {
          tieuDe: 'まとめ — Buổi 1',
          bang: {
            head: ['Mẫu', 'Độ chắc', 'Dựa vào', 'Nối ナA / N', 'Ví dụ'],
            rows: [
              ['～に{違|ちが}いない', '~90% đúng', 'cảm giác, dấu hiệu', '{静|しず}か／{犯人|はんにん}（trần）', '{寝|ね}ているに{違|ちが}いない'],
              ['～はずだ（Bài 20）', '~90% đúng', 'căn cứ khách quan', '{静|しず}かな／{犯人|はんにん}の', '{着|つ}くはずだ'],
              ['～はずがない', '~0%', 'căn cứ khách quan', '{静|しず}かな／{犯人|はんにん}の', '{入|はい}るはずがない'],
              ['～わけがない', '~0%', 'lẽ thường, cảm xúc', '{静|しず}かな／{犯人|はんにん}の', '{盗|ぬす}むわけがない'],
            ],
          },
          ghi: 'Bài về nhà: viết 3 câu に{違|ちが}いない và 3 câu はずがない／わけがない về một "vụ án" nhỏ trong ký túc xá của bạn. Buổi sau: ～っぽい và ～わけだ.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: ôn ～はずだ (Bài 20)' },
    {
      t: 'p',
      text: 'Giáo viên hỏi: "Anh Nishikawa đã lên tàu 9 giờ, đi mất một tiếng — mấy giờ anh ấy tới?" Cả lớp: {十時|じゅうじ}に{着|つ}くはずです (Bài 20). Giáo viên: "Đúng. Còn nếu có người bảo **anh ấy đã tới lúc 8 giờ** — các em không tin nổi — thì nói **{八時|はちじ}に{着|つ}くはずがない**: không lẽ nào. Hôm nay ta học cả **chiếc thước đo độ chắc chắn**."',
    },
    {
      t: 'mcq',
      id: 'b31-b1-khoi-dong',
      title: 'Khởi động — ôn ～はずだ・～かもしれない (4 câu)',
      items: [
        { q: '{九時|くじ}の{電車|でんしゃ}に{乗|の}ったから、{十時|じゅうじ}には{着|つ}く（　）です。', options: ['つもり', 'よう', 'はず', 'そう'], correct: 2, why: 'Căn cứ (giờ tàu) → **はずです** (Bài 20). 〔Juuji ni wa tsuku hazu desu.〕' },
        { q: '{今日|きょう}は{日曜日|にちようび}だから、{銀行|ぎんこう}は{休|やす}み（　）はずです。', options: ['な', 'の', 'だ', '×'], correct: 1, why: 'N ＋ **の** ＋ はず (Bài 20). Hôm nay cũng dùng cách nối này cho はずがない.' },
        { q: '{空|そら}が{暗|くら}くなってきた。{雨|あめ}が{降|ふ}る（　）。', options: ['つもりだ', 'ことにした', 'ところだ', 'かもしれない'], correct: 3, why: 'Chỉ là khả năng → **かもしれない** (Bài 20). 〔Ame ga furu kamo shirenai.〕' },
        { q: '「{彼|かれ}は{来|こ}ないはずです」の{意味|いみ}は？', options: ['Chắc là anh ấy không đến.', 'Không lẽ nào anh ấy đến.', 'Anh ấy không muốn đến.', 'Anh ấy không được đến.'], correct: 0, why: '**ないはずだ** = "chắc là không" (~10%, mềm). "Không lẽ nào" là **はずがない** — học hôm nay.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: truyện trinh thám' },
    {
      t: 'p',
      text: 'Giáo viên đọc một đoạn "truyện trinh thám" ngắn (tự viết) — mỗi câu có một từ mới của nhóm A và B. Cả lớp đọc to theo từng câu.',
    },
    {
      t: 'examples',
      items: [
        E('{深夜|しんや}2{時|じ}ごろ、{駅前|えきまえ}の{店|みせ}で{事件|じけん}が{起|お}こりました。', "Shin'ya niji goro, ekimae no mise de jiken ga okorimashita.", 'Khoảng 2 giờ đêm, ở cửa hàng trước ga đã xảy ra một vụ việc.'),
        E('{現場|げんば}には、{大|おお}きな{足跡|あしあと}が{残|のこ}っていました。', 'Genba ni wa, ookina ashiato ga nokotte imashita.', 'Ở hiện trường còn lại một dấu chân lớn.'),
        E('{防犯|ぼうはん}カメラに、{怪|あや}しい{男|おとこ}が{映|うつ}っていました。', 'Bouhan kamera ni, ayashii otoko ga utsutte imashita.', 'Trong camera an ninh có một người đàn ông khả nghi.'),
        E('{探偵|たんてい}は{小|ちい}さな{手|て}がかりから{犯人|はんにん}を{推理|すいり}しました。', 'Tantei wa chiisana tegakari kara hannin o suiri shimashita.', 'Thám tử suy luận ra thủ phạm từ một manh mối nhỏ.'),
        E('{恐|おそ}らく、{犯人|はんにん}は{何|なに}かを{隠|かく}しているでしょう。', 'Osoraku, hannin wa nani ka o kakushite iru deshou.', 'E rằng thủ phạm đang che giấu điều gì đó.'),
        E('{現在|げんざい}、この{謎|なぞ}はまだ{解|と}けていません。', 'Genzai, kono nazo wa mada tokete imasen.', 'Hiện tại, bí ẩn này vẫn chưa được giải.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — に違いない・はずがない・わけがない: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b31-b1-noi-tu',
      title: 'Luyện nhanh — nối từ trong ngoặc với mẫu (8 câu)',
      kind: 'fill',
      items: [
        { q: '{犯人|はんにん}は（あの{人|ひと}）に{違|ちが}いない。', answers: V('あの{人|ひと}'), hint: 'N trần' },
        { q: '{図書館|としょかん}の3{階|がい}は（{静|しず}か）に{違|ちが}いない。', answers: V('{静|しず}か'), hint: 'ナA trần' },
        { q: 'あの{店|みせ}はいつも{満席|まんせき}だから、（おいしい）に{違|ちが}いない。', answers: V('おいしい'), hint: 'イA giữ nguyên' },
        { q: '{顔|かお}が{赤|あか}いから、{熱|ねつ}が（ある）に{違|ちが}いない。', answers: V('ある'), hint: 'V thể thường' },
        { q: '{今日|きょう}は{平日|へいじつ}だから、{銀行|ぎんこう}が（{休|やす}み）はずがない。', answers: V('{休|やす}みの'), hint: 'N ＋ の' },
        { q: '{試験|しけん}の{前|まえ}だから、{学生|がくせい}が（{暇|ひま}）はずがない。', answers: V('{暇|ひま}な'), hint: 'ナA ＋ な' },
        { q: '{彼|かれ}は{日本|にほん}に{十年|じゅうねん}いるから、この{言葉|ことば}を（{知|し}る→phủ định）はずがない。', answers: V('{知|し}らない'), hint: 'しらない (phủ định kép = chắc chắn biết)' },
        { q: 'まさか、あの{子|こ}が（うそ）わけがない。', answers: V('うそをつく', 'うそを つく'), hint: 'うそを つく (động từ)' },
      ],
    },
    {
      t: 'quiz',
      id: 'b31-b1-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～に違いない · ～はずがない · ～わけがない',
      items: [
        { q: 'Chắc chắn là tôi đánh rơi ở ga.', answers: V('{駅|えき}で{落|お}としたに{違|ちが}いない。', '{駅|えき}で{落|お}としたに{違|ちが}いありません。'), hint: 'えきで おとした に ちがいない' },
        { q: 'Quán đó lúc nào cũng có hàng người xếp nên chắc chắn là ngon.', answers: V('あの{店|みせ}はいつも{行列|ぎょうれつ}ができているから、おいしいに{違|ちが}いない。', 'あの{店|みせ}はいつも{行列|ぎょうれつ}だから、おいしいに{違|ちが}いない。'), hint: '…から、おいしい に ちがいない' },
        { q: 'Đã khoá cửa nên không lẽ nào trộm vào được.', answers: V('{鍵|かぎ}をかけたから、{泥棒|どろぼう}が{入|はい}るはずがない。', '{鍵|かぎ}をかけたので、{泥棒|どろぼう}が{入|はい}るはずがありません。'), hint: 'かぎを かけたから、…はいる はずがない' },
        { q: 'Không thể nào! (thực tế trái với điều mình tin)', answers: V('そんなはずはない。', 'そんなはずはありません。', 'そんなはずがない。'), hint: 'そんな はずは ない' },
        { q: 'Làm gì có chuyện một mình làm xong việc này trong một ngày.', answers: V('この{仕事|しごと}を{一日|いちにち}で{一人|ひとり}で{終|お}わらせるわけがない。', '{一人|ひとり}でこの{仕事|しごと}が{一日|いちにち}で{終|お}わるわけがない。', 'この{仕事|しごと}が{一日|いちにち}で{終|お}わるわけがない。'), hint: '…おわる わけがない' },
        { q: 'Làm gì có chuyện người hiền như thế lại nói dối.', answers: V('あんなに{優|やさ}しい{人|ひと}がうそをつくわけがない。', 'あの{優|やさ}しい{人|ひと}がうそをつくわけがない。', 'まさか、あの{優|やさ}しい{人|ひと}がうそをつくわけがない。'), hint: 'うそを つく わけがない' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Nối khác nhau**: に{違|ちが}いない — ナA／N **trần** ({静|しず}かに・{犯人|はんにん}に); はずがない・わけがない — **ナAな・Nの** ({静|しず}かな・{犯人|はんにん}の). Đây là chỗ đề N3 bắt lỗi nhiều nhất.',
        '**Thước đo**: に{違|ちが}いない ≈ はずだ (~90%) > だろう (~70%) > かもしれない (~50%) > はずがない ≈ わけがない (~0%). Phó từ đi kèm là manh mối: きっと／{恐|おそ}らく／もしかすると／まさか.',
        '**Phủ định kép**: {知|し}らないはずがない = {知|し}らないわけがない = **chắc chắn biết**. Đọc chậm, đừng dịch "không biết".',
      ],
    },
    DL('Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)', [
      ['{先生|せんせい}', 'examiner', '「{静|しず}か」と「に{違|ちが}いない」をつないでください。', '"Shizuka" to "ni chigainai" o tsunaide kudasai.', 'Em nối "shizuka" với "ni chigainai" đi.'],
      ['Bạn', 'candidate', '「{静|しず}かに{違|ちが}いない」です。な は{要|い}りません。{夜|よる}の{図書館|としょかん}は{静|しず}かに{違|ちが}いない。', '"Shizuka ni chigainai" desu. Na wa irimasen. Yoru no toshokan wa shizuka ni chigainai.', 'Là "shizuka ni chigainai" ạ. Không cần な. Thư viện ban đêm chắc chắn yên tĩnh.'],
      ['{先生|せんせい}', 'examiner', '{窓|まど}の{外|そと}が{白|しろ}いですね。{何|なに}があったと{思|おも}いますか。', 'Mado no soto ga shiroi desu ne. Nani ga atta to omoimasu ka.', 'Ngoài cửa sổ trắng xoá nhỉ. Em nghĩ đã có chuyện gì?'],
      ['Bạn', 'candidate', '{夜|よる}の{間|あいだ}に{雪|ゆき}が{降|ふ}ったに{違|ちが}いありません。', 'Yoru no aida ni yuki ga futta ni chigai arimasen.', 'Chắc chắn là trong đêm tuyết đã rơi ạ.'],
      ['{先生|せんせい}', 'examiner', '「{彼|かれ}が{来|こ}ないはずだ」と「{彼|かれ}が{来|く}るはずがない」はどう{違|ちが}いますか。', '"Kare ga konai hazu da" to "Kare ga kuru hazu ga nai" wa dou chigaimasu ka.', '"Kare ga konai hazu da" và "kare ga kuru hazu ga nai" khác nhau thế nào?'],
      ['Bạn', 'candidate', '「{来|こ}ないはずだ」は「たぶん{来|こ}ない」で、「{来|く}るはずがない」は「{絶対|ぜったい}{来|こ}ない」という{意味|いみ}です。', '"Konai hazu da" wa "tabun konai" de, "kuru hazu ga nai" wa "zettai konai" to iu imi desu.', '"Konai hazu da" là "chắc là không đến", còn "kuru hazu ga nai" nghĩa là "nhất định không đến" ạ.'],
      ['{先生|せんせい}', 'examiner', '「こんな{問題|もんだい}、わけないよ」はどんな{意味|いみ}ですか。', '"Konna mondai, wake nai yo" wa donna imi desu ka.', '"Konna mondai, wake nai yo" nghĩa là gì?'],
      ['Bạn', 'candidate', '「とても{簡単|かんたん}だ」という{意味|いみ}です。「{解|と}けるわけがない」とは{違|ちが}います。', '"Totemo kantan da" to iu imi desu. "Tokeru wake ga nai" to wa chigaimasu.', 'Nghĩa là "rất dễ" ạ. Khác với "tokeru wake ga nai".'],
    ]),
    {
      t: 'mcq',
      id: 'b31-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{彼|かれ}はプロの{料理人|りょうりにん}だから、{料理|りょうり}が{上手|じょうず}（　）に{違|ちが}いない。', options: ['な', 'の', 'だ', '×（không thêm gì）'], correct: 3, why: 'ナA **trần** ＋ に{違|ちが}いない. 〔Jouzu ni chigainai.〕' },
        { q: '{記録|きろく}が{残|のこ}っているから、{彼|かれ}がそこにいた（　）。', options: ['はずがない', 'に{違|ちが}いない', 'わけがない', 'かもしれない'], correct: 1, why: 'Có ghi chép → khẳng định chắc chắn → **に{違|ちが}いない**. はずがない／わけがない là phủ nhận — ngược nghĩa.' },
        { q: '{今|いま}{国|くに}にいるマリヤムさんが、{寮|りょう}の{食堂|しょくどう}にいる（　）。', options: ['に{違|ちが}いない', 'はずがない', 'はずだ', 'わけだ'], correct: 1, why: 'Căn cứ (đang ở nước ngoài) → bác bỏ → **はずがない**.' },
        { q: '{彼|かれ}が{犯人|はんにん}（　）わけがない。', options: ['の', 'な', 'だ', 'に'], correct: 0, why: 'わけ là danh từ → **N の** ＋ わけがない.' },
        { q: '「{日本|にほん}に{十年|じゅうねん}{住|す}んでいる{彼|かれ}が、この{漢字|かんじ}を{読|よ}めないはずがない。」の{意味|いみ}は？', options: ['Anh ấy chắc chắn không đọc được chữ Hán này.', 'Anh ấy chắc chắn đọc được chữ Hán này.', 'Anh ấy có thể đọc được.', 'Anh ấy không muốn đọc.'], correct: 1, why: 'Phủ định kép **Vないはずがない** = **chắc chắn có thể** đọc.' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b31-buoi-2-ppoi-wakeda',
  kind: 'review',
  title: 'Buổi 2 — Tả & kết luận: từ mới đồ thất lạc & tính chất · ～っぽい trông giống / ngả / hay · ～わけだ thảo nào / tức là · ～わけだ ↔ ～はずだ · hội thoại ②',
  goal: 'Theo nhịp một buổi trên lớp: ôn ba mẫu độ chắc chắn của Buổi 1, học từ nhóm đồ thất lạc & trí nhớ và nhóm tính chất (～っぽい), nắm ba kiểu ～っぽい (Nっぽい giống, màu／イAっぽい ngả, Vますっぽい hay) và phân biệt với ～らしい, nắm ba cách dùng ～わけだ (thảo nào · tức là · giải thích) và biết khi nào thay được bằng ～はずだ, đọc hội thoại ② (câu đố "Ai ăn chiếc bánh?"), luyện cặp mô tả đồ thất lạc và trả lời 5 câu kiểm tra cuối buổi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — thước đo: に{違|ちが}いない (~90%) · はずがない／わけがない (~0%) · cách nối (ナA／N **trần** với に{違|ちが}いない). Câu hỏi mở đầu: "Mất ví — đến quầy đồ thất lạc, tả cái ví thế nào khi không nhớ rõ màu?"',
        '**Từ mới (12′)** — nhóm C (đồ thất lạc: {置|お}き{忘|わす}れる, {探|さが}し{回|まわ}る, {中身|なかみ}, {特徴|とくちょう}, {目印|めじるし}, {記憶|きおく}, {思|おも}い{出|だ}す, {見覚|みおぼ}え, {袋|ふくろ}, {定期券|ていきけん}, {学生証|がくせいしょう}, {持|も}ち{主|ぬし}) + nhóm E (tính chất: {子|こ}どもっぽい, {大人|おとな}っぽい, {忘|わす}れっぽい, {怒|おこ}りっぽい, {飽|あ}きっぽい, {安|やす}っぽい, {白|しろ}っぽい, {熱|ねつ}っぽい, {細|こま}かい, {詳|くわ}しい, {恐|おそ}ろしい, {印象|いんしょう}).',
        '**Ngữ pháp (20′)** — ④ **～っぽい** (3 kiểu + ↔ らしい) · ⑤ **～わけだ** (thảo nào · つまり tức là · ～というわけだ) + **わけだ ↔ はずだ**.',
        '**Hội thoại (8′)** — ② giờ ゼミ: câu đố trinh thám của cô 佐藤.',
        '**チャレンジ (5′)** — luyện cặp ở "quầy đồ thất lạc": A mô tả đồ bằng ～っぽい + {目印|めじるし} + {中身|なかみ}, B tìm trong danh sách rồi chốt "だから～わけですね". Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b31-b2-slides',
      title: 'Bài 31 推理 — Buổi 2: ～っぽい・～わけだ',
      slides: [
        {
          tieuDe: 'Ôn bài cũ — {確|たし}かさのものさし',
          anh: ['detective', 'locked'],
          nhan: ['90%', '0%'],
          dong: ['{電気|でんき}が{消|き}えているから、{寝|ね}ているに{違|ちが}いない。', '{鍵|かぎ}をかけたから、{泥棒|どろぼう}が{入|はい}るはずがない。'],
          ro: ['Denki ga kiete iru kara, nete iru ni chigainai.', 'Kagi o kaketa kara, dorobou ga hairu hazu ga nai.'],
          hoi: '「{犯人|はんにん}（　）に{違|ちが}いない」— の が{要|い}りますか。',
          dap: 'Không. **{犯人|はんにん}に{違|ちが}いない** (N trần). Nhưng **{犯人|はんにん}のはずがない** (はず cần の).',
          ghi: 'Gọi 3–4 bạn đặt câu nhanh với thước đo. Rồi chuyển: "Hôm nay ta học cách TẢ (っぽい) và cách CHỐT kết luận (わけだ)."',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — {忘|わす}れ{物|もの}センター',
          anh: ['shopping-bags', 'package', 'label', 'ticket'],
          nhan: ['{袋|ふくろ}', '{中身|なかみ}', '{目印|めじるし}', '{定期券|ていきけん}'],
          dong: ['{電車|でんしゃ}に{紙袋|かみぶくろ}を{置|お}き{忘|わす}れました。', '{袋|ふくろ}の{特徴|とくちょう}と{中身|なかみ}を{教|おし}えてください。'],
          ro: ['Densha ni kamibukuro o okiwasuremashita.', 'Fukuro no tokuchou to nakami o oshiete kudasai.'],
          hoi: '「{落|お}とす」と「{置|お}き{忘|わす}れる」はどう{違|ちが}いますか。',
          dap: '{落|お}とす: đánh RƠI. {置|お}き{忘|わす}れる: ĐẶT xuống một chỗ rồi QUÊN (luôn có nơi chốn ＋ に).',
          ghi: 'Thêm: {探|さが}し{回|まわ}る (lùng sục), {記憶|きおく}にない, {名前|なまえ}を{思|おも}い{出|だ}す (だ — khác {思|おも}い{出|で}), {見覚|みおぼ}えがある, {学生証|がくせいしょう}, {持|も}ち{主|ぬし}. {袋|ふくろ}: sau chữ khác đọc ぶくろ ({紙袋|かみぶくろ}・{手袋|てぶくろ}).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — どんな{人|ひと}？',
          anh: ['baby', 'angry-face', 'face-with-thermometer', 'face-with-monocle'],
          nhan: ['{子|こ}どもっぽい', '{怒|おこ}りっぽい', '{熱|ねつ}っぽい', '{細|こま}かい'],
          dong: ['{兄|あに}は{二十歳|はたち}なのに、{子|こ}どもっぽい。', '{探偵|たんてい}は{細|こま}かいことにもよく{気|き}がつく。'],
          ro: ['Ani wa hatachi na noni, kodomoppoi.', 'Tantei wa komakai koto ni mo yoku ki ga tsuku.'],
          hoi: '「{細|こま}かいお{金|かね}」と「{細|ほそ}い{道|みち}」— {細|こま}かい と {細|ほそ}い はどう{違|ちが}いますか。',
          dap: '{細|こま}かい: nhỏ, vụn (tiền lẻ); chi tiết. {細|ほそ}い: mảnh, hẹp (đường, sợi). Cùng chữ 細!',
          ghi: 'Thêm: {大人|おとな}っぽい, {忘|わす}れっぽい, {飽|あ}きっぽい, {安|やす}っぽい, {白|しろ}っぽい, {詳|くわ}しい ({歴史|れきし}に{詳|くわ}しい = thông thạo), {恐|おそ}ろしい, {印象|いんしょう}がいい.',
        },
        {
          tieuDe: '④ ～っぽい — ba kiểu',
          anh: ['baby', 'coat', 'old-key'],
          nhan: ['N ＋ っぽい', 'màu ＋ っぽい', 'Vます ＋ っぽい'],
          bang: { head: ['Kiểu', 'Ví dụ', 'Nghĩa'], rows: [['N ＋ っぽい', '{子|こ}どもっぽい・うそっぽい', 'trông GIỐNG N'], ['màu／イA bỏ い', '{白|しろ}っぽい・{安|やす}っぽい', 'NGẢ…, hơi…'], ['N trạng thái', '{熱|ねつ}っぽい・{風邪|かぜ}っぽい', 'có triệu chứng'], ['Vます ＋ っぽい', '{忘|わす}れっぽい・{怒|おこ}りっぽい', 'HAY…, dễ…']] },
          ghi: 'Chia như **イA**: っぽくない・っぽかった・っぽく{見|み}える. Văn nói, hay hơi chê. Romaji luôn có **pp**.',
        },
        {
          tieuDe: '④ ～っぽい ↔ ～らしい',
          anh: ['baby', 'man-office-worker'],
          nhan: ['{子|こ}どもらしい', '{子|こ}どもっぽい'],
          dong: ['あの{子|こ}は{子|こ}どもらしい{笑顔|えがお}をしている。', '{部長|ぶちょう}は{子|こ}どもっぽいところがある。'],
          ro: ['Ano ko wa kodomorashii egao o shite iru.', 'Buchou wa kodomoppoi tokoro ga aru.'],
          hoi: '{五歳|ごさい}の{子|こ}どもを{見|み}て「{子|こ}どもっぽいね」と{言|い}うのは{自然|しぜん}ですか。',
          dap: 'Không tự nhiên. Đứa bé ĐÚNG LÀ trẻ con → **{子|こ}どもらしい** (khen). っぽい dùng khi KHÔNG phải N mà giống N.',
          ghi: 'らしい ở đây là nghĩa "đúng chất" (khác らしい "nghe đâu" Bài 20). Còn ようだ／みたいだ = so sánh trung tính.',
        },
        {
          tieuDe: '⑤ ～わけだ (1) — "thảo nào…"',
          anh: ['window', 'cold-face'],
          nhan: ['{窓|まど}が{開|あ}いていた', '{寒|さむ}い'],
          dong: ['「{窓|まど}が{開|あ}いていたよ。」', '「だから{寒|さむ}いわけだ。」'],
          ro: ['"Mado ga aite ita yo."', '"Dakara samui wake da."'],
          bang: { head: ['Loại từ', '＋ わけだ'], rows: [['V', '{見|み}つからない**わけだ**'], ['イA', '{寒|さむ}い**わけだ**'], ['ナA', '{上手|じょうず}**な**わけだ'], ['N', '{休|やす}み**の**わけだ']] },
          ghi: 'Trình tự: THẤY kết quả trước (lạnh) → BIẾT lý do sau (cửa sổ mở) → わけだ. Hay đi với だから・{道理|どうり}で・それで.',
        },
        {
          tieuDe: '⑤ ～わけだ (2) — "tức là…"',
          anh: ['abacus', 'spiral-calendar'],
          nhan: ['{計算|けいさん}', '{一週間|いっしゅうかん}'],
          dong: ['{一日|いちにち}{二時間|にじかん}、{週|しゅう}に{五日|いつか}。', 'つまり、{一週間|いっしゅうかん}に{十時間|じゅうじかん}{練習|れんしゅう}するわけだ。'],
          ro: ['Ichinichi nijikan, shuu ni itsuka.', 'Tsumari, isshuukan ni juujikan renshuu suru wake da.'],
          hoi: '{家賃|やちん}が{毎月|まいつき}{一万円|いちまんえん}{上|あ}がります。{一年|いちねん}では？',
          dap: '{一年|いちねん}で{十二万円|じゅうにまんえん}も{多|おお}く{払|はら}うわけです。',
          ghi: 'つまり～わけだ = nói lại bằng hệ quả. Dạng này hay có trong bài đọc, bài nghe giải thích. はずだ KHÔNG có nghĩa này.',
        },
        {
          tieuDe: '⑤ ～わけです (3) — giải thích · ～というわけだ',
          anh: ['person-raising-hand', 'speech-balloon'],
          nhan: ['{説明|せつめい}', 'というわけ'],
          dong: ['{父|ちち}が{日本|にほん}で{働|はたら}いていたので、{日本語|にほんご}に{興味|きょうみ}があったわけです。', '{電車|でんしゃ}が{止|と}まって、それで{遅|おく}れたというわけです。'],
          ro: ['Chichi ga Nihon de hataraite ita node, nihongo ni kyoumi ga atta wake desu.', 'Densha ga tomatte, sorede okureta to iu wake desu.'],
          hoi: '「{来週|らいしゅう}{大阪|おおさか}に{転勤|てんきん}です。」— {確認|かくにん}するとき{何|なん}と{言|い}いますか。',
          dap: '「じゃ、{引|ひ}っ{越|こ}しするわけですか。」（vậy là… phải không?）',
          ghi: 'Giọng trình bày, phát biểu, phỏng vấn: kết bằng わけです nghe mạch lạc, có logic.',
        },
        {
          tieuDe: '⑤ わけだ ↔ はずだ',
          anh: ['balance-scale'],
          nhan: ['どっち？'],
          bang: { head: ['Cách dùng', 'わけだ', 'はずだ'], rows: [['thảo nào (đã biết lý do)', '○', '○'], ['dự đoán (chưa biết)', '✗', '○'], ['tức là (tính toán)', '○', '✗'], ['lẽ ra (～はずだったのに)', '✗', '○']] },
          hoi: '「{九時|くじ}に{出|で}たから、もうすぐ{着|つ}く（　）」— わけだ？はずだ？',
          dap: '**はずだ** — đây là DỰ ĐOÁN (chưa tới). わけだ chỉ chốt điều đã biết.',
          ghi: 'Mẹo: わけだ nhìn về điều ĐÃ là sự thật; はずだ nhìn về điều CHƯA kiểm chứng (dự đoán) — trừ "thảo nào" thì cả hai đều được.',
        },
        {
          tieuDe: '{会話|かいわ}② — ゼミの{推理|すいり}クイズ',
          anh: ['woman-teacher', 'shortcake', 'detective'],
          nhan: ['{佐藤先生|さとうせんせい}', 'ケーキ', 'カルロス'],
          dong: ['{記録|きろく}が{残|のこ}っているなら、{犯人|はんにん}のはずがありませんね。', '{先生|せんせい}の{袖|そで}に、クリームっぽい{白|しろ}いものが{付|つ}いています！', 'だから{見|み}つからなかったわけですね。'],
          ro: ['Kiroku ga nokotte iru nara, hannin no hazu ga arimasen ne.', 'Sensei no sode ni, kuriimuppoi shiroi mono ga tsuite imasu!', 'Dakara mitsukaranakatta wake desu ne.'],
          hoi: '{佐藤先生|さとうせんせい}は{本当|ほんとう}にケーキを{食|た}べましたか。',
          dap: 'いいえ。「{私|わたし}が{食|た}べたわけではありません」— {別|べつ}の{冷蔵庫|れいぞうこ}に{移|うつ}しただけです。',
          ghi: 'Đọc to theo vai (佐藤先生 — カルロス — リン). Cho cả lớp đoán thủ phạm TRƯỚC khi đọc đoạn cuối. Gạch chân: はずがない, わけがない, に{違|ちが}いありません, っぽい, わけではない, わけだ.',
        },
        {
          tieuDe: 'チャレンジ — {忘|わす}れ{物|もの}センターで',
          anh: ['person-raising-hand', 'shopping-bags'],
          nhan: ['A（{客|きゃく}）', 'B（{駅員|えきいん}）'],
          dong: ['A：すみません、～を{置|お}き{忘|わす}れてしまったんですが……。', 'B：どんな～ですか。', 'A：～っぽくて、{目印|めじるし}に～が{付|つ}いています。{中|なか}に～が{入|はい}っています。', 'B：あ、これですね。～に{届|とど}いていました。だから～わけですね。'],
          ro: ['A: Sumimasen, ~ o okiwasurete shimatta n desu ga…….', 'B: Donna ~ desu ka.', 'A: ~ppokute, mejirushi ni ~ ga tsuite imasu. Naka ni ~ ga haitte imasu.', 'B: A, kore desu ne. ~ ni todoite imashita. Dakara ~ wake desu ne.'],
          ghi: 'Đổi vai 2 lần. Đồ vật: {傘|かさ}・{紙袋|かみぶくろ}・{財布|さいふ}・{手袋|てぶくろ}・{定期券|ていきけん}. B phải chốt bằng một câu わけだ (ví dụ: {終点|しゅうてん}まで{行|い}ってしまったから、{見|み}つからなかったわけですね).',
        },
        {
          tieuDe: 'まとめ — Buổi 2',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Nối', 'Ví dụ'],
            rows: [
              ['～っぽい', 'giống / ngả / hay', 'N・イA bỏ い・Vます', '{子|こ}どもっぽい・{白|しろ}っぽい・{忘|わす}れっぽい'],
              ['～らしい', 'đúng chất (khen)', 'N', '{子|こ}どもらしい'],
              ['～わけだ', 'thảo nào / tức là', 'V・イA・ナAな・Nの', 'だから{寒|さむ}いわけだ'],
              ['～はずだ', 'dự đoán / thảo nào', 'V・イA・ナAな・Nの', 'もうすぐ{着|つ}くはずだ'],
            ],
          },
          ghi: 'Bài về nhà: tả 3 người quen bằng ～っぽい (1 câu khen, 2 câu "chê nhẹ") và viết 2 câu "だから～わけだ" về chuyện trong tuần. Buổi sau: ～わけではない, ～わけにはいかない và bảng phân biệt cả bài.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn bài cũ: thước đo độ chắc chắn' },
    {
      t: 'p',
      text: 'Giáo viên vẽ lại thước đo 0% → 100% và gọi từng bạn: "Chìa khoá của ダニエル ở đâu?" — bạn thứ nhất nói câu 90% (に{違|ちが}いない), bạn thứ hai bác bỏ (はずがない), bạn thứ ba đưa khả năng khác (かもしれない). Rồi chuyển sang câu hỏi mới: "Đến quầy đồ thất lạc, nhân viên hỏi chiếc ví **màu gì** — nhưng bạn không nhớ chắc. Nói sao?" → {黒|くろ}**っぽい**{財布|さいふ}です.',
    },
    {
      t: 'mcq',
      id: 'b31-b2-khoi-dong',
      title: 'Ôn bài cũ + khởi động (4 câu)',
      items: [
        { q: '{部屋|へや}が{暗|くら}い。もう{寝|ね}ている（　）。', options: ['はずがない', 'わけがない', 'に{違|ちが}いない', 'ことにする'], correct: 2, why: 'Dấu hiệu → tin chắc → **に{違|ちが}いない** (Buổi 1).' },
        { q: '{彼女|かのじょ}は{甘|あま}い{物|もの}が{嫌|きら}いだから、ケーキを{買|か}う（　）。', options: ['に{違|ちが}いない', 'わけがない', 'わけだ', 'はずだ'], correct: 1, why: 'Lẽ thường (ghét đồ ngọt) → phủ nhận → **わけがない** (Buổi 1).' },
        { q: '{犯人|はんにん}は{静|しず}か（　）{人|ひと}だったそうだ。', options: ['の', 'に', 'だ', 'な'], correct: 3, why: 'ナA bổ nghĩa danh từ → **な** (ôn cơ bản).' },
        { q: '{財布|さいふ}の{色|いろ}がはっきり{分|わ}からないとき、{何|なん}と{言|い}いますか。', options: ['{黒|くろ}っぽい{財布|さいふ}です。', '{黒|くろ}らしい{財布|さいふ}です。', '{黒|くろ}に{違|ちが}いない{財布|さいふ}です。', '{黒|くろ}のはずの{財布|さいふ}です。'], correct: 0, why: 'Màu không chắc → **{黒|くろ}っぽい** (học hôm nay).' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: ở quầy đồ thất lạc' },
    {
      t: 'p',
      text: 'Giáo viên đóng vai nhân viên ga, cả lớp đóng vai khách — mỗi câu có một từ mới của nhóm C và E. Đọc to theo từng câu.',
    },
    {
      t: 'examples',
      items: [
        E('{電車|でんしゃ}の{棚|たな}に{紙袋|かみぶくろ}を{置|お}き{忘|わす}れてしまいました。', 'Densha no tana ni kamibukuro o okiwasurete shimaimashita.', 'Tôi để quên chiếc túi giấy trên giá hành lý của tàu.'),
        E('{白|しろ}っぽい{袋|ふくろ}で、{中身|なかみ}は{本|ほん}と{手袋|てぶくろ}です。', 'Shiroppoi fukuro de, nakami wa hon to tebukuro desu.', 'Là túi ngả trắng, bên trong có sách và găng tay.'),
        E('{目印|めじるし}に、{赤|あか}いリボンを{付|つ}けています。', 'Mejirushi ni, akai ribon o tsukete imasu.', 'Tôi buộc ruy băng đỏ làm dấu.'),
        E('{何両目|なんりょうめ}だったか、{記憶|きおく}がはっきりしません。', 'Nanryoume datta ka, kioku ga hakkiri shimasen.', 'Toa thứ mấy thì tôi không nhớ rõ.'),
        E('この{傘|かさ}に{見覚|みおぼ}えはありますか。', 'Kono kasa ni mioboe wa arimasu ka.', 'Chiếc ô này trông có quen không ạ?'),
        E('{持|も}ち{主|ぬし}の{方|かた}は、{学生証|がくせいしょう}を{見|み}せてください。', 'Mochinushi no kata wa, gakuseishou o misete kudasai.', 'Người chủ đồ xin cho xem thẻ sinh viên.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — っぽい: nghĩa nào? · わけだ: luyện nhanh' },
    {
      t: 'mcq',
      id: 'b31-b2-chon',
      title: 'Phân loại — ～っぽい trong câu là "GIỐNG", "NGẢ (màu / mức)", "CÓ TRIỆU CHỨNG" hay "HAY (thói quen)"? (8 câu)',
      items: [
        { q: '{彼|かれ}は{三十歳|さんじゅっさい}なのに、{子|こ}どもっぽい。', options: ['giống', 'ngả', 'có triệu chứng', 'hay (thói quen)'], correct: 0, why: 'N ＋ っぽい: người lớn mà **giống** trẻ con.' },
        { q: '{白|しろ}っぽいシャツを{着|き}ている{人|ひと}。', options: ['giống', 'ngả', 'có triệu chứng', 'hay (thói quen)'], correct: 1, why: 'Màu ＋ っぽい = **ngả** trắng.' },
        { q: '{最近|さいきん}{忘|わす}れっぽくて{困|こま}る。', options: ['giống', 'ngả', 'có triệu chứng', 'hay (thói quen)'], correct: 3, why: 'Vます ＋ っぽい = **hay** quên.' },
        { q: '{朝|あさ}から{熱|ねつ}っぽい。', options: ['giống', 'ngả', 'có triệu chứng', 'hay (thói quen)'], correct: 2, why: 'N trạng thái ＋ っぽい = có **triệu chứng** (hơi sốt).' },
        { q: 'その{話|はなし}、うそっぽいね。', options: ['giống', 'ngả', 'có triệu chứng', 'hay (thói quen)'], correct: 0, why: 'N ＋ っぽい: nghe **giống** bịa.' },
        { q: '{父|ちち}は{怒|おこ}りっぽい。', options: ['giống', 'ngả', 'có triệu chứng', 'hay (thói quen)'], correct: 3, why: 'Vます ＋ っぽい = **dễ** nổi nóng.' },
        { q: 'このドレスは{安|やす}っぽい。', options: ['giống', 'ngả', 'có triệu chứng', 'hay (thói quen)'], correct: 1, why: 'イA bỏ い ＋ っぽい = **trông** rẻ tiền (ngả về "rẻ").' },
        { q: '{少|すこ}し{風邪|かぜ}っぽいので、マスクをします。', options: ['giống', 'ngả', 'có triệu chứng', 'hay (thói quen)'], correct: 2, why: 'N trạng thái ＋ っぽい = **có triệu chứng** cảm.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b31-b2-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～っぽい · だから／道理で～わけだ · つまり～わけだ',
      items: [
        { q: 'Em gái tôi mới 15 tuổi mà trông chững chạc.', answers: V('{妹|いもうと}はまだ十五{歳|さい}なのに、{大人|おとな}っぽい。', '{妹|いもうと}はまだ15{歳|さい}なのに、{大人|おとな}っぽい。', '{妹|いもうと}は十五{歳|さい}なのに{大人|おとな}っぽいです。', '{妹|いもうと}は15{歳|さい}なのに{大人|おとな}っぽいです。'), hint: 'おとなっぽい' },
        { q: 'Đó là chiếc ô màu xanh xanh.', answers: V('{青|あお}っぽい{傘|かさ}です。', '{青|あお}っぽい{傘|かさ}だ。'), hint: 'あおっぽい かさ' },
        { q: 'Tôi mau chán nên sở thích không bền.', answers: V('{私|わたし}は{飽|あ}きっぽいので、{趣味|しゅみ}が{続|つづ}きません。', '{飽|あ}きっぽいから、{趣味|しゅみ}が{続|つづ}かない。', '{私|わたし}は{飽|あ}きっぽくて、{趣味|しゅみ}が{続|つづ}きません。'), hint: 'あきっぽい' },
        { q: '"Cô ấy từng sống ở Mỹ đấy." — "Thảo nào giỏi tiếng Anh."', answers: V('{道理|どうり}で{英語|えいご}が{上手|じょうず}なわけだ。', 'だから{英語|えいご}が{上手|じょうず}なわけだ。', '{道理|どうり}で{英語|えいご}が{上手|じょうず}なわけですね。'), hint: 'どうりで… じょうずな わけだ' },
        { q: 'Hôm nay là ngày lễ à. Thảo nào đường vắng.', answers: V('{今日|きょう}は{祝日|しゅくじつ}なんだ。それで{道|みち}がすいているわけだ。', '{今日|きょう}は{祝日|しゅくじつ}か。だから{道|みち}がすいているわけだ。', '{今日|きょう}は{祝日|しゅくじつ}なんですね。だから{道|みち}がすいているわけですね。'), hint: 'それで みちが すいて いる わけだ' },
        { q: 'Mỗi ngày 3 tiếng, tuần 4 ngày. Tức là một tuần làm 12 tiếng.', answers: V('{一日|いちにち}{三時間|さんじかん}、{週|しゅう}に{四日|よっか}。つまり、{一週間|いっしゅうかん}に{十二時間|じゅうにじかん}{働|はたら}くわけだ。', '{一日|いちにち}3{時間|じかん}、{週|しゅう}に4{日|か}。つまり、{一週間|いっしゅうかん}に12{時間|じかん}{働|はたら}くわけです。', 'つまり、{一週間|いっしゅうかん}に{十二時間|じゅうにじかん}{働|はたら}くわけだ。'), hint: 'つまり… はたらく わけだ' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**っぽい là tính từ い**: {子|こ}どもっぽ**くない** (không ~~っぽいじゃない~~), {白|しろ}っぽ**い**{服|ふく} (không ~~っぽいな~~). Và nối: {安|やす}**っぽい** (bỏ い), {忘|わす}れ**っぽい** (gốc ます).',
        '**っぽい ↔ らしい**: khen đứa bé hồn nhiên → **らしい**; nói người lớn mà trẻ con → **っぽい**. Đừng nói người trên "っぽい" (dễ thành chê).',
        '**わけだ cần sự thật đã biết**: "thảo nào" (biết lý do rồi) hoặc "tức là" (tính ra). Dự đoán chưa biết → **はずだ**, không phải わけだ.',
      ],
    },
    DL('Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)', [
      ['{先生|せんせい}', 'examiner', 'あなたの{友達|ともだち}は、どんな{人|ひと}ですか。「っぽい」を{使|つか}ってください。', 'Anata no tomodachi wa, donna hito desu ka. "Ppoi" o tsukatte kudasai.', 'Bạn của em là người thế nào? Hãy dùng "ppoi".'],
      ['Bạn', 'candidate', 'ルームメイトは{優|やさ}しいですが、ちょっと{忘|わす}れっぽいです。よく{鍵|かぎ}をなくします。', 'Ruumumeito wa yasashii desu ga, chotto wasureppoi desu. Yoku kagi o nakushimasu.', 'Bạn cùng phòng em tốt bụng nhưng hơi hay quên. Hay làm mất chìa khoá ạ.'],
      ['{先生|せんせい}', 'examiner', '{五歳|ごさい}の{子|こ}どもが{元気|げんき}に{遊|あそ}んでいます。{子|こ}どもっぽいですか、{子|こ}どもらしいですか。', 'Gosai no kodomo ga genki ni asonde imasu. Kodomoppoi desu ka, kodomorashii desu ka.', 'Một đứa trẻ năm tuổi đang chơi đùa vui vẻ. Là kodomoppoi hay kodomorashii?'],
      ['Bạn', 'candidate', '{子|こ}どもらしいです。{本当|ほんとう}に{子|こ}どもですから。「っぽい」は{大人|おとな}が{子|こ}どものようなときに{使|つか}います。', 'Kodomorashii desu. Hontou ni kodomo desu kara. "Ppoi" wa otona ga kodomo no you na toki ni tsukaimasu.', 'Là kodomorashii ạ. Vì nó đúng là trẻ con. "Ppoi" dùng khi người lớn mà giống trẻ con ạ.'],
      ['{先生|せんせい}', 'examiner', '{教室|きょうしつ}が{寒|さむ}いですね。……あ、エアコンが{壊|こわ}れているそうです。', 'Kyoushitsu ga samui desu ne. …… A, eakon ga kowarete iru sou desu.', 'Lớp học lạnh nhỉ. … À, nghe nói điều hoà bị hỏng.'],
      ['Bạn', 'candidate', 'そうですか。だから{寒|さむ}いわけですね。', 'Sou desu ka. Dakara samui wake desu ne.', 'Vậy ạ. Thảo nào lạnh thế ạ.'],
      ['{先生|せんせい}', 'examiner', '「{九時|くじ}に{家|いえ}を{出|で}たから、もうすぐ{着|つ}くわけだ」は{正|ただ}しいですか。', '"Kuji ni ie o deta kara, mou sugu tsuku wake da" wa tadashii desu ka.', '"Kuji ni ie o deta kara, mou sugu tsuku wake da" có đúng không?'],
      ['Bạn', 'candidate', 'いいえ。まだ{着|つ}いていないので、{予想|よそう}です。「{着|つ}くはずだ」が{正|ただ}しいです。', 'Iie. Mada tsuite inai node, yosou desu. "Tsuku hazu da" ga tadashii desu.', 'Không ạ. Vì chưa tới nên đó là dự đoán. "Tsuku hazu da" mới đúng ạ.'],
    ]),
    {
      t: 'mcq',
      id: 'b31-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{犯人|はんにん}は{黒|くろ}（　）コートを{着|き}ていた。', options: ['っぽいな', 'らしいの', 'っぽい', 'みたい'], correct: 2, why: 'Màu ＋ **っぽい** ＋ N (tính từ い, không な). {黒|くろ}みたい cần な trước N.' },
        { q: '{兄|あに}は{大学生|だいがくせい}なのに、{考|かんが}え{方|かた}が（　）。', options: ['{子|こ}どもらしい', '{子|こ}どもっぽい', '{子|こ}どものはずだ', '{子|こ}どもに{違|ちが}いない'], correct: 1, why: 'Người lớn mà giống trẻ con (chê) → **{子|こ}どもっぽい**.' },
        { q: '「{西川|にしかわ}さん、{毎晩|まいばん}{三時|さんじ}まで{勉強|べんきょう}しているんだって。」「（　）{眠|ねむ}そうなわけだ。」', options: ['{決|けっ}して', 'もしかすると', '{別|べつ}に', '{道理|どうり}で'], correct: 3, why: '**{道理|どうり}で～わけだ** = thảo nào.' },
        { q: '{一日|いちにち}に{五十|ごじゅう}ページ{読|よ}む。つまり、{十日|とおか}で{五百|ごひゃく}ページ{読|よ}む（　）。', options: ['わけだ', 'はずがない', 'っぽい', 'わけがない'], correct: 0, why: '"Tức là" (tính toán) → **わけだ**.' },
        { q: '{会議|かいぎ}は{三時|さんじ}からだから、{部長|ぶちょう}はもうすぐ{来|く}る（　）。', options: ['わけだ', 'はずだ', 'っぽい', 'わけではない'], correct: 1, why: 'Dự đoán (chưa tới) → **はずだ**. わけだ không dùng cho dự đoán.' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b31-buoi-3-wake',
  kind: 'review',
  title: 'Buổi 3 — "Nhà わけ": từ mới lý do & giải thích · ～わけではない／わけでもない không hẳn là · ～ないわけではない · ～わけにはいかない không thể (vì lẽ phải) · bảng phân biệt cả bài · hội thoại ③',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～わけだ và ～っぽい của Buổi 2, học từ nhóm lý do & giải thích, nắm ～わけではない (phủ định một phần, gạt kết luận ngầm), ～わけでもない, phủ định kép ～ないわけではない, ～わけにはいかない (không thể vì lẽ phải) và ～ないわけにはいかない (buộc phải) — phân biệt với Vられない và nhận ra ～ざるを得ない; tổng kết "nhà わけ" và thang chắc chắn của cả bài; đọc hội thoại ③ ở ひまわり食堂, luyện cặp từ chối khéo và trả lời 5 câu kiểm tra cuối buổi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — **だから／{道理|どうり}で～わけだ** (thảo nào), **つまり～わけだ** (tức là), **～っぽい**. Câu hỏi mở đầu: "Bạn không ăn sashimi — người Nhật hỏi “ghét à?”. Không phải ghét. Nói sao cho lịch sự?"',
        '**Từ mới (10′)** — nhóm D (lý do & giải thích: わけ, {事情|じじょう}, {道理|どうり}で, なるほど, つまり, {要|よう}するに, {当|あ}たり{前|まえ}, {理解|りかい}する, {勘違|かんちが}いする, {誤解|ごかい}する, {決|けっ}して～ない, {別|べつ}に～ない, {引|ひ}き{受|う}ける).',
        '**Ngữ pháp (22′)** — ⑥ **～わけではない／わけでもない** + **～ないわけではない** · ⑦ **～わけにはいかない** + **～ないわけにはいかない** (↔ Vられない ↔ ざるを{得|え}ない) · ⑧ **"nhà わけ"** + **thang chắc chắn** cả bài.',
        '**Hội thoại (8′)** — ③ ひまわり食堂: chiếc ví bị bỏ quên và lời nhờ làm thêm Chủ nhật.',
        '**チャレンジ (5′)** — luyện cặp từ chối khéo: A nhờ / rủ ↔ B 「～たくないわけではないんですが、～ので、～わけにはいかないんです」. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b31-b3-slides',
      title: 'Bài 31 推理 — Buổi 3: ～わけではない・～わけにはいかない',
      slides: [
        {
          tieuDe: 'Ôn bài cũ — ～わけだ・～っぽい',
          anh: ['window', 'cold-face'],
          nhan: ['{窓|まど}が{開|あ}いていた', '{寒|さむ}い'],
          dong: ['{窓|まど}が{開|あ}いていた。だから{寒|さむ}いわけだ。', '{兄|あに}は{二十歳|はたち}なのに{子|こ}どもっぽい。'],
          ro: ['Mado ga aite ita. Dakara samui wake da.', 'Ani wa hatachi na noni kodomoppoi.'],
          hoi: '「{九時|くじ}に{出|で}たから、もうすぐ{着|つ}く（　）」— わけだ？はずだ？',
          dap: '**はずだ** (dự đoán). わけだ chỉ dùng cho sự thật đã biết.',
          ghi: 'Hôm qua: わけだ. Hôm nay: thêm ba "người anh em" của わけ — わけではない, わけにはいかない, và tổng kết わけがない (Buổi 1). Cuối buổi vẽ "cây gia phả nhà わけ".',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — わけ・{事情|じじょう}',
          anh: ['red-question-mark', 'speech-balloon', 'light-bulb'],
          nhan: ['わけ', '{事情|じじょう}', 'なるほど'],
          dong: ['{彼女|かのじょ}が{怒|おこ}っているわけを{知|し}っていますか。', '{家族|かぞく}の{事情|じじょう}で、{国|くに}に{帰|かえ}ることになりました。'],
          ro: ['Kanojo ga okotte iru wake o shitte imasu ka.', 'Kazoku no jijou de, kuni ni kaeru koto ni narimashita.'],
          hoi: '「{事情|じじょう}があって……」と{言|い}うのは、どんなときですか。',
          dap: 'Khi có **lý do riêng** mà không muốn / không cần kể chi tiết — nói khéo.',
          ghi: 'Thêm: {道理|どうり}で (thảo nào — đi với わけだ), つまり (tức là), {要|よう}するに (tóm lại), {当|あ}たり{前|まえ} (đương nhiên), {理解|りかい}する.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {勘違|かんちが}い・{誤解|ごかい}',
          anh: ['woman-shrugging', 'handshake'],
          nhan: ['{勘違|かんちが}い', '{引|ひ}き{受|う}ける'],
          dong: ['{授業|じゅぎょう}は{火曜日|かようび}だと{勘違|かんちが}いしていました。', '{先輩|せんぱい}に{頼|たの}まれて、{司会|しかい}を{引|ひ}き{受|う}けました。'],
          ro: ['Jugyou wa kayoubi da to kanchigai shite imashita.', 'Senpai ni tanomarete, shikai o hikiukemashita.'],
          hoi: '「{勘違|かんちが}い」と「{誤解|ごかい}」はどう{違|ちが}いますか。',
          dap: '{勘違|かんちが}い: MÌNH tưởng nhầm một sự việc. {誤解|ごかい}: hiểu sai Ý / CON NGƯỜI của người khác.',
          ghi: 'Thêm: {決|けっ}して～ない (tuyệt đối không), {別|べつ}に～ない (chẳng… gì) — {別|べつ}に hay đi với わけではない.',
        },
        {
          tieuDe: '⑥ ～わけではない — "không hẳn là…"',
          anh: ['sushi', 'man-gesturing-no'],
          nhan: ['お{刺身|さしみ}', 'ちょっと……'],
          dong: ['{嫌|きら}いなわけではないんです。{生|なま}の{魚|さかな}に{慣|な}れていないだけです。', '{日本人|にほんじん}がみんなすしが{好|す}きなわけではない。'],
          ro: ['Kirai na wake de wa nai n desu. Nama no sakana ni narete inai dake desu.', 'Nihonjin ga minna sushi ga suki na wake de wa nai.'],
          bang: { head: ['Đi với', 'Ví dụ'], rows: [['{全部|ぜんぶ}／みんな', 'みんな～わけではない'], ['いつも／{毎日|まいにち}', '{毎日|まいにち}～わけではない'], ['{必|かなら}ずしも', '{必|かなら}ずしも～わけではない'], ['{別|べつ}に／{特|とく}に', '{別|べつ}に～わけではない']] },
          ghi: 'Gạt đi một KẾT LUẬN người nghe có thể nghĩ ("không ăn → chắc ghét"). Văn nói: ～わけじゃない. Nối như わけだ (ナAな・Nの).',
        },
        {
          tieuDe: '⑥ Bốn câu về "thích sushi"',
          anh: ['sushi'],
          nhan: ['すし'],
          bang: { head: ['Câu', 'Nghĩa thật'], rows: [['{好|す}きなわけではない', 'không hẳn là thích'], ['{嫌|きら}いなわけではない', 'không phải là ghét'], ['{食|た}べられないわけではない', 'không phải không ăn được (= ăn được)'], ['{好|す}きなわけがない', 'làm gì có chuyện thích (= ghét)']] },
          hoi: '「お{酒|さけ}が{飲|の}めないわけではない」— この{人|ひと}はお{酒|さけ}が{飲|の}めますか。',
          dap: '**Có**, uống được — nhưng chắc không thích lắm / hôm nay có lý do không uống. (phủ định kép)',
          ghi: 'Đọc chậm từng câu. **わけではない** (nhẹ) ↔ **わけがない** (mạnh) — chỉ khác では／が mà nghĩa khác hẳn.',
        },
        {
          tieuDe: '⑥ ～わけでもない — "cũng không phải là…"',
          anh: ['woman-shrugging', 'party-popper'],
          nhan: ['{行|い}かない', 'パーティー'],
          dong: ['{行|い}きたくないわけではないし、{忙|いそが}しいわけでもない。', 'ただ、{知|し}らない{人|ひと}が{多|おお}いのが{苦手|にがて}なんだ。'],
          ro: ['Ikitaku nai wake de wa nai shi, isogashii wake de mo nai.', 'Tada, shiranai hito ga ooi no ga nigate na n da.'],
          hoi: '「わけではない」と「わけでもない」はどう{違|ちが}いますか。',
          dap: 'わけでもない = "**cũng** không phải là" — gạt **thêm** một khả năng nữa (も = cũng).',
          ghi: 'Khuôn rất hay để giải thích thật lòng: ～わけではないし、～わけでもない。ただ、～んです。',
        },
        {
          tieuDe: '⑦ ～わけにはいかない — "không thể… (vì lẽ phải)"',
          anh: ['face-with-thermometer', 'books'],
          nhan: ['{熱|ねつ}っぽい', '{試験|しけん}'],
          dong: ['{熱|ねつ}っぽいけど、{今日|きょう}は{試験|しけん}だから{休|やす}むわけにはいかない。', '{店長|てんちょう}が{困|こま}っているのに、{断|ことわ}るわけにはいかない。'],
          ro: ['Netsuppoi kedo, kyou wa shiken da kara yasumu wake ni wa ikanai.', 'Tenchou ga komatte iru noni, kotowaru wake ni wa ikanai.'],
          hoi: '「{足|あし}が{痛|いた}くて、{歩|ある}くわけにはいかない」は{正|ただ}しいですか。',
          dap: 'Không. Không có KHẢ NĂNG → **{歩|ある}けない**. わけにはいかない = làm được, nhưng lẽ phải không cho.',
          ghi: 'Chỉ sau ĐỘNG TỪ (Vる／Vない／Vている). Lịch sự: ～わけにはいきません. "Cũng không thể": ～わけにもいかない.',
        },
        {
          tieuDe: '⑦ ～ないわけにはいかない — "không thể không…"',
          anh: ['purse', 'police-officer'],
          nhan: ['{財布|さいふ}', '{交番|こうばん}'],
          dong: ['お{金|かね}が{入|はい}っているから、{交番|こうばん}に{届|とど}けないわけにはいかない。', '{先輩|せんぱい}の{結婚式|けっこんしき}だから、{行|い}かないわけにはいかない。'],
          ro: ['Okane ga haitte iru kara, kouban ni todokenai wake ni wa ikanai.', 'Senpai no kekkonshiki da kara, ikanai wake ni wa ikanai.'],
          hoi: '「{行|い}かないわけにはいかない」— この{人|ひと}は{行|い}きますか。',
          dap: '**Có, phải đi** (phủ định kép = buộc phải). Thường là không muốn lắm nhưng tình nghĩa bắt buộc.',
          ghi: 'Nhận ra (N2 — Bài 45): **{行|い}かざるを{得|え}ない** ≈ {行|い}かないわけにはいかない ("đành phải", văn viết). する → **せ**ざるを{得|え}ない.',
        },
        {
          tieuDe: '⑦ "Không thể / phải" — chọn mẫu nào?',
          anh: ['balance-scale'],
          nhan: ['どっち？'],
          bang: { head: ['Mẫu', 'Vì sao'], rows: [['Vられない', 'không có khả năng'], ['Vるわけにはいかない', 'làm được, lẽ phải không cho'], ['Vてはいけない', 'bị cấm'], ['Vなければならない', 'nghĩa vụ chung'], ['Vないわけにはいかない', 'tình thế / đạo lý buộc'], ['Vざるを{得|え}ない (N2)', 'đành phải, không còn cách']] },
          hoi: '「{明日|あした}は{運転|うんてん}するから、お{酒|さけ}を（　）」— {飲|の}めない？{飲|の}むわけにはいかない？',
          dap: '**{飲|の}むわけにはいかない** tự nhiên hơn — uống ĐƯỢC, nhưng vì lái xe (trách nhiệm) nên không thể.',
          ghi: 'Đề N3 hay cho tình huống "có thể nhưng không nên" — đó là tín hiệu của わけにはいかない.',
        },
        {
          tieuDe: '⑧ "Nhà わけ" — cây gia phả',
          anh: ['red-question-mark'],
          nhan: ['わけ ＝ lý do'],
          bang: { head: ['Mẫu', 'Nghĩa'], rows: [['～わけだ', 'thảo nào / tức là'], ['～わけがない', 'làm gì có chuyện (~0%)'], ['～わけではない', 'không hẳn là'], ['～ないわけではない', 'không phải là không (= có, ít)'], ['～わけにはいかない', 'không thể (lẽ phải)'], ['～ないわけにはいかない', 'buộc phải'], ['わけない (riêng)', 'dễ ợt']] },
          ghi: 'Vẽ cây: gốc "わけ = lý do". Mỗi nhánh một câu ví dụ do cả lớp đặt. Bảng 4 ở mục Ngữ pháp ⑧ là bản đầy đủ.',
        },
        {
          tieuDe: '⑧ Thang chắc chắn — cả bài',
          anh: ['detective', 'thinking-face', 'locked'],
          nhan: ['90%', '50%', '0%'],
          bang: { head: ['%', 'Mẫu', 'Phó từ'], rows: [['~90%', 'に{違|ちが}いない・はずだ', 'きっと'], ['~70%', 'だろう', 'たぶん・{恐|おそ}らく'], ['~60%', 'ようだ・らしい', 'どうやら'], ['~50%', 'かもしれない', 'もしかすると'], ['~0%', 'はずがない・わけがない', 'まさか']] },
          hoi: '「まさか、{彼|かれ}が{犯人|はんにん}（　）」— に{違|ちが}いない？わけがない？',
          dap: '**わけがない** — まさか luôn đi với phủ định.',
          ghi: 'Phó từ là manh mối số 1 khi làm đề. Cho cả lớp đọc to thang từ trên xuống.',
        },
        {
          tieuDe: '{会話|かいわ}③ — ひまわり{食堂|しょくどう}',
          anh: ['man-cook', 'purse', 'spiral-calendar'],
          nhan: ['{小林店長|こばやしてんちょう}', '{財布|さいふ}', '{日曜日|にちようび}'],
          dong: ['{交番|こうばん}に{届|とど}けないわけにはいかないよ。', '{働|はたら}きたくないわけではないんです。', '{道理|どうり}で{最近|さいきん}、ぼーっとしていたわけだ。'],
          ro: ['Kouban ni todokenai wake ni wa ikanai yo.', 'Hatarakitaku nai wake de wa nai n desu.', 'Douri de saikin, bootto shite ita wake da.'],
          hoi: 'ナタポンさんはどうして{日曜日|にちようび}に{働|はたら}けないのですか。',
          dap: '{月曜日|げつようび}に{論文|ろんぶん}の{中間発表|ちゅうかんはっぴょう}があるからです。（{働|はたら}きたくないわけではありません）',
          ghi: 'Đọc to theo vai (小林店長 — ナタポン). Gạch chân cả 7 mẫu của bài trong hội thoại ③ — có đủ っぽい, に違いない, はずがない, わけではない, わけにはいかない, わけだ.',
        },
        {
          tieuDe: 'チャレンジ — {上手|じょうず}に{断|ことわ}ろう',
          anh: ['person-raising-hand', 'person-bowing'],
          nhan: ['A（{頼|たの}む）', 'B（{断|ことわ}る）'],
          dong: ['A：{今週|こんしゅう}の{土曜日|どようび}、～てくれない？', 'B：～たくないわけではないんですが……。', 'B：{実|じつ}は～ので、～わけにはいかないんです。', 'B：{来週|らいしゅう}なら、～ことができます。'],
          ro: ['A: Konshuu no doyoubi, ~te kurenai?', 'B: ~taku nai wake de wa nai n desu ga…….', 'B: Jitsu wa ~ node, ~ wake ni wa ikanai n desu.', 'B: Raishuu nara, ~ koto ga dekimasu.'],
          ghi: 'Đổi vai 2 lần. Lời nhờ: {引|ひ}っ{越|こ}しの{手伝|てつだ}い・バイトの{代|か}わり・{発表|はっぴょう}の{司会|しかい}. B phải có đủ 3 bước: không phải không muốn → lý do + わけにはいかない → đề nghị khác.',
        },
        {
          tieuDe: 'まとめ — Buổi 3',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Nối', 'Ví dụ'],
            rows: [
              ['～わけではない', 'không hẳn là', 'V・イA・ナAな・Nの', '{嫌|きら}いなわけではない'],
              ['～わけでもない', 'cũng không phải là', 'như trên', '{忙|いそが}しいわけでもない'],
              ['～ないわけではない', 'không phải là không', 'Vない・イAくない…', '{飲|の}めないわけではない'],
              ['～わけにはいかない', 'không thể (lẽ phải)', 'Vる', '{休|やす}むわけにはいかない'],
              ['～ないわけにはいかない', 'buộc phải', 'Vない', '{行|い}かないわけにはいかない'],
            ],
          },
          ghi: 'Bài về nhà: làm "Luyện thêm 1–5" và viết bài văn 「{思|おも}い{込|こ}みで{失敗|しっぱい}した{話|はなし}」 (mục Viết). Buổi sau: Bài 32 — 昔と今.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn bài cũ: わけだ・っぽい' },
    {
      t: 'p',
      text: 'Giáo viên hỏi nhanh: "Phòng lạnh — biết là cửa sổ mở — nói sao?" (だから{寒|さむ}いわけだ). "Một tuần làm 3 buổi, mỗi buổi 4 tiếng — tức là?" (つまり{十二時間|じゅうにじかん}{働|はたら}くわけだ). Rồi chuyển: "Hôm nay đi tiệc, các em không ăn sashimi, người Nhật hỏi “{嫌|きら}いなんですか”. Các em **không ghét** — chỉ chưa quen. Nói sao cho khéo?" → **{嫌|きら}いなわけではないんです**.',
    },
    {
      t: 'mcq',
      id: 'b31-b3-khoi-dong',
      title: 'Ôn bài cũ (4 câu)',
      items: [
        { q: '「{彼|かれ}、アメリカに{五年|ごねん}いたんだって。」「だから{英語|えいご}が{上手|じょうず}な（　）。」', options: ['はずがない', 'に{違|ちが}いない', 'わけだ', 'っぽい'], correct: 2, why: 'Biết lý do → **わけだ** (Buổi 2).' },
        { q: '{父|ちち}は{五十歳|ごじゅっさい}なのに、{子|こ}ども（　）ところがある。', options: ['らしい', 'っぽい', 'みたい', 'はずの'], correct: 1, why: 'Người lớn mà giống trẻ con → **っぽい** (Buổi 2). みたい cần な trước N.' },
        { q: '{記録|きろく}があるから、{彼|かれ}が{犯人|はんにん}の（　）。', options: ['に{違|ちが}いない', 'わけだ', 'っぽい', 'はずがない'], correct: 3, why: 'Căn cứ → bác bỏ → **はずがない** (Buổi 1). (に{違|ちが}いない không nhận Nの.)' },
        { q: '「{一日|いちにち}{二時間|にじかん}、{毎日|まいにち}。」「つまり、{一週間|いっしゅうかん}で{十四時間|じゅうよじかん}になる（　）。」', options: ['わけだ', 'はずだ', 'わけがない', 'わけにはいかない'], correct: 0, why: '"Tức là" → **わけだ** (Buổi 2). はずだ không có nghĩa này.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: lý do & giải thích' },
    {
      t: 'p',
      text: 'Giáo viên kể một chuyện nhỏ ở chỗ làm thêm — mỗi câu có một từ mới của nhóm D. Cả lớp đọc to theo từng câu.',
    },
    {
      t: 'examples',
      items: [
        E('ナタポンさんが{最近|さいきん}{元気|げんき}がないわけを、{店長|てんちょう}は{知|し}りませんでした。', 'Natapon-san ga saikin genki ga nai wake o, tenchou wa shirimasen deshita.', 'Anh chủ không biết lý do dạo này Nattapon không khoẻ.'),
        E('{実|じつ}は、{大学|だいがく}の{事情|じじょう}で{忙|いそが}しかったんです。', 'Jitsu wa, daigaku no jijou de isogashikatta n desu.', 'Thật ra là vì chuyện ở trường mà cậu ấy bận.'),
        E('{店長|てんちょう}は「なるほど、{道理|どうり}で」と{言|い}いました。', 'Tenchou wa "Naruhodo, douri de" to iimashita.', 'Anh chủ nói: "Ra vậy, thảo nào."'),
        E('{怒|おこ}っていると{誤解|ごかい}されましたが、{別|べつ}に{怒|おこ}っていたわけではありません。', 'Okotte iru to gokai saremashita ga, betsu ni okotte ita wake de wa arimasen.', 'Cậu ấy bị hiểu lầm là đang giận, nhưng chẳng phải giận gì.'),
        E('{要|よう}するに、{少|すこ}し{疲|つか}れていただけなんです。', 'You suru ni, sukoshi tsukarete ita dake na n desu.', 'Tóm lại là chỉ hơi mệt thôi.'),
        E('{頼|たの}まれた{仕事|しごと}は、{一度|いちど}{引|ひ}き{受|う}けたら{決|けっ}して{途中|とちゅう}でやめません。', 'Tanomareta shigoto wa, ichido hikiuketara kesshite tochuu de yamemasen.', 'Việc được nhờ, một khi đã nhận thì tuyệt đối không bỏ dở.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — "Nhà わけ": nghĩa nào?' },
    {
      t: 'mcq',
      id: 'b31-b3-imi',
      title: 'Nhận ra nghĩa của từng "わけ" (8 câu)',
      items: [
        { q: '{窓|まど}が{開|あ}いていたのか。{寒|さむ}いわけだ。', options: ['thảo nào', 'làm gì có chuyện', 'không hẳn là', 'không thể'], correct: 0, why: '**わけだ** = thảo nào.' },
        { q: '{彼|かれ}が{犯人|はんにん}のわけがない。', options: ['thảo nào', 'làm gì có chuyện', 'không hẳn là', 'không thể'], correct: 1, why: '**わけがない** = làm gì có chuyện.' },
        { q: '{肉|にく}が{嫌|きら}いなわけではない。', options: ['thảo nào', 'làm gì có chuyện', 'không hẳn là', 'không thể'], correct: 2, why: '**わけではない** = không hẳn là (không phải ghét).' },
        { q: '{明日|あした}は{試験|しけん}だから、{遊|あそ}ぶわけにはいかない。', options: ['thảo nào', 'làm gì có chuyện', 'không hẳn là', 'không thể (vì lẽ phải)'], correct: 3, why: '**わけにはいかない** = không thể (vì lẽ phải).' },
        { q: '{英語|えいご}が{話|はな}せないわけではない。', options: ['nói được (một chút)', 'hoàn toàn không nói được', 'làm gì có chuyện nói được', 'phải nói'], correct: 0, why: '**ないわけではない** (phủ định kép) = có nói được, nhưng ít / không giỏi.' },
        { q: '{上司|じょうし}に{誘|さそ}われたから、{行|い}かないわけにはいかない。', options: ['không đi', 'phải đi', 'có thể đi', 'làm gì có chuyện đi'], correct: 1, why: '**ないわけにはいかない** = buộc phải đi.' },
        { q: 'こんな{問題|もんだい}、わけないよ。', options: ['rất khó', 'dễ ợt', 'không hiểu', 'không có lý do'], correct: 1, why: '**わけない** đứng riêng = **dễ ợt** (bẫy!).' },
        { q: 'つまり、{一年|いちねん}で{十二万円|じゅうにまんえん}{多|おお}く{払|はら}うわけです。', options: ['tức là', 'không hẳn là', 'không thể', 'làm gì có chuyện'], correct: 0, why: '**つまり～わけです** = tức là.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b31-b3-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～わけではない · ～わけでもない · ～ないわけではない · ～わけにはいかない · ～ないわけにはいかない',
      items: [
        { q: 'Không phải là tôi ghét anh ấy.', answers: V('{彼|かれ}が{嫌|きら}いなわけではありません。', '{彼|かれ}が{嫌|きら}いなわけではない。', '{彼|かれ}のことが{嫌|きら}いなわけではありません。', '{彼|かれ}のことが{嫌|きら}いなわけじゃない。'), hint: 'きらいな わけではない' },
        { q: 'Không phải ngày nào tôi cũng tự nấu ăn.', answers: V('{毎日|まいにち}{自炊|じすい}しているわけではありません。', '{毎日|まいにち}{料理|りょうり}をしているわけではない。', '{毎日|まいにち}{自炊|じすい}しているわけではない。'), hint: 'まいにち… して いる わけではない' },
        { q: 'Không phải là không có thời gian, nhưng hôm nay tôi mệt.', answers: V('{時間|じかん}がないわけではないが、{今日|きょう}は{疲|つか}れている。', '{時間|じかん}がないわけではないんですが、{今日|きょう}は{疲|つか}れています。', '{時間|じかん}がないわけではないけど、{今日|きょう}は{疲|つか}れている。'), hint: 'じかんが ない わけではないが' },
        { q: 'Mai lái xe nên tôi không thể uống rượu.', answers: V('{明日|あした}{運転|うんてん}するので、お{酒|さけ}を{飲|の}むわけにはいきません。', '{明日|あした}は{運転|うんてん}するから、お{酒|さけ}を{飲|の}むわけにはいかない。'), hint: 'のむ わけには いかない' },
        { q: 'Là lỗi của mình nên không thể không xin lỗi.', answers: V('{自分|じぶん}のミスだから、{謝|あやま}らないわけにはいかない。', '{自分|じぶん}のミスなので、{謝|あやま}らないわけにはいきません。'), hint: 'あやまらない わけには いかない' },
        { q: 'Không phải là tôi không muốn đi, nhưng tối nay phải làm thêm.', answers: V('{行|い}きたくないわけではないんですが、{今夜|こんや}はアルバイトがあるんです。', '{行|い}きたくないわけではないが、{今夜|こんや}はアルバイトだ。', '{行|い}きたくないわけじゃないけど、{今夜|こんや}はバイトなんだ。'), hint: 'いきたくない わけではないんですが' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**では ↔ が**: **わけではない** (không hẳn — nhẹ, phủ định một phần) ↔ **わけがない** (làm gì có — mạnh, ~0%). Nghe / đọc kỹ một chữ này.',
        '**Phủ định kép = CÓ**: **ないわけではない** = có (nhưng ít) · **ないわけにはいかない** = phải làm · **ないはずがない／ないわけがない** = chắc chắn có. Dịch sang tiếng Việt bằng câu KHẲNG ĐỊNH để không nhầm.',
        '**わけにはいかない ≠ Vられない**: làm được nhưng lẽ phải không cho → わけにはいかない; không có khả năng → Vられない. Từ chối khéo: **～たくないわけではないんですが、～ので、～わけにはいかないんです**.',
      ],
    },
    DL('Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)', [
      ['{先生|せんせい}', 'examiner', 'お{刺身|さしみ}、{食|た}べませんね。{嫌|きら}いなんですか。', 'Osashimi, tabemasen ne. Kirai na n desu ka.', 'Em không ăn sashimi nhỉ. Em ghét à?'],
      ['Bạn', 'candidate', 'いいえ、{嫌|きら}いなわけではないんです。{生|なま}の{魚|さかな}にまだ{慣|な}れていないだけです。', 'Iie, kirai na wake de wa nai n desu. Nama no sakana ni mada narete inai dake desu.', 'Dạ không, không phải em ghét ạ. Chỉ là em chưa quen cá sống thôi ạ.'],
      ['{先生|せんせい}', 'examiner', '{明日|あした}のパーティー、{来|き}られますか。', 'Ashita no paatii, koraremasu ka.', 'Tiệc ngày mai em đến được không?'],
      ['Bạn', 'candidate', '{行|い}きたいんですが、{明後日|あさって}{大事|だいじ}な{試験|しけん}があるので、{遅|おそ}くまで{遊|あそ}ぶわけにはいかないんです。{少|すこ}しだけ{参加|さんか}してもいいですか。', 'Ikitai n desu ga, asatte daiji na shiken ga aru node, osoku made asobu wake ni wa ikanai n desu. Sukoshi dake sanka shite mo ii desu ka.', 'Em muốn đi ạ, nhưng ngày kia em có bài thi quan trọng nên không thể chơi khuya được. Em tham gia một chút thôi có được không ạ?'],
      ['{先生|せんせい}', 'examiner', '「{行|い}かないわけにはいかない」は、{行|い}きますか、{行|い}きませんか。', '"Ikanai wake ni wa ikanai" wa, ikimasu ka, ikimasen ka.', '"Ikanai wake ni wa ikanai" là có đi hay không đi?'],
      ['Bạn', 'candidate', '{行|い}きます。{本当|ほんとう}はあまり{行|い}きたくないけど、{行|い}かなければならない、という{意味|いみ}です。', 'Ikimasu. Hontou wa amari ikitaku nai kedo, ikanakereba naranai, to iu imi desu.', 'Có đi ạ. Nghĩa là thật ra không muốn lắm nhưng phải đi ạ.'],
      ['{先生|せんせい}', 'examiner', '「{日本語|にほんご}が{話|はな}せないわけではない」と「{日本語|にほんご}が{話|はな}せるわけがない」はどう{違|ちが}いますか。', '"Nihongo ga hanasenai wake de wa nai" to "Nihongo ga hanaseru wake ga nai" wa dou chigaimasu ka.', '"Nihongo ga hanasenai wake de wa nai" và "nihongo ga hanaseru wake ga nai" khác nhau thế nào?'],
      ['Bạn', 'candidate', '{前|まえ}のは「{少|すこ}し{話|はな}せる」で、{後|あと}のは「{全然|ぜんぜん}{話|はな}せない、{話|はな}せるはずがない」という{意味|いみ}です。', 'Mae no wa "sukoshi hanaseru" de, ato no wa "zenzen hanasenai, hanaseru hazu ga nai" to iu imi desu.', 'Câu trước là "nói được một chút", câu sau nghĩa là "hoàn toàn không nói được, không thể nào nói được" ạ.'],
    ]),
    {
      t: 'mcq',
      id: 'b31-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{高|たか}い{物|もの}が{必|かなら}ずしもいい{物|もの}だという（　）。', options: ['わけがない', 'わけだ', 'わけではない', 'わけにはいかない'], correct: 2, why: '**{必|かなら}ずしも～わけではない** = không nhất thiết là.' },
        { q: '{私|わたし}が{壊|こわ}したのだから、{弁償|べんしょう}しない（　）。', options: ['わけではない', 'わけにはいかない', 'はずがない', 'わけだ'], correct: 1, why: 'Lỗi của mình → buộc phải đền → **Vないわけにはいかない**. {弁償|べんしょう}する = đền bù.' },
        { q: '{足|あし}を{骨折|こっせつ}して、{一週間|いっしゅうかん}（　）。', options: ['{歩|ある}くわけにはいかなかった', '{歩|ある}くわけではなかった', '{歩|ある}くわけがなかった', '{歩|ある}けなかった'], correct: 3, why: 'Gãy chân → không có KHẢ NĂNG → **{歩|ある}けなかった**. {骨折|こっせつ} = gãy xương.' },
        { q: 'パーティーに{行|い}きたくない（　）、{今日|きょう}は{本当|ほんとう}に{疲|つか}れているんです。', options: ['わけではないんですが', 'わけがないんですが', 'わけにはいかないんですが', 'に{違|ちが}いないんですが'], correct: 0, why: 'Từ chối khéo: **～たくないわけではないんですが** + lý do.' },
        { q: '「お{酒|さけ}、{飲|の}めないの？」「{飲|の}めない（　）けど、あまり{好|す}きじゃないんだ。」', options: ['わけがない', 'わけじゃない', 'わけにはいかない', 'はずがない'], correct: 1, why: '**ないわけじゃない** = không phải không uống được (uống được nhưng không thích).' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 67 từ của mục Từ vựng; nghĩa không trùng nhau). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{推理|すいり}します', 'suiri shimasu', 'suy luận'],
  ['{推測|すいそく}します', 'suisoku shimasu', 'phỏng đoán'],
  ['{想像|そうぞう}します', 'souzou shimasu', 'tưởng tượng'],
  ['{可能性|かのうせい}', 'kanousei', 'khả năng (xảy ra)'],
  ['{恐|おそ}らく', 'osoraku', 'e rằng, có lẽ (văn viết)'],
  ['どうやら', 'douyara', 'có vẻ như (sau khi xem xét)'],
  ['もしかすると', 'moshika suru to', 'biết đâu, có khi'],
  ['{明|あき}らかな', 'akiraka na', 'rõ ràng, hiển nhiên'],
  ['{証拠|しょうこ}', 'shouko', 'chứng cứ'],
  ['{手|て}がかり', 'tegakari', 'manh mối'],
  ['{謎|なぞ}', 'nazo', 'điều bí ẩn'],
  ['{解決|かいけつ}します', 'kaiketsu shimasu', 'giải quyết'],
  ['{解|と}きます', 'tokimasu', 'giải (bài, câu đố)'],
  ['{気|き}づきます', 'kizukimasu', 'nhận ra'],
  ['{探偵|たんてい}', 'tantei', 'thám tử'],
  ['{推理小説|すいりしょうせつ}', 'suiri shousetsu', 'truyện trinh thám'],
  ['{刑事|けいじ}', 'keiji', 'cảnh sát hình sự'],
  ['{現場|げんば}', 'genba', 'hiện trường'],
  ['{犯罪|はんざい}', 'hanzai', 'tội phạm (hành vi)'],
  ['{容疑者|ようぎしゃ}', 'yougisha', 'nghi phạm'],
  ['{隠|かく}します', 'kakushimasu', 'giấu, che giấu'],
  ['{隠|かく}れます', 'kakuremasu', 'nấp, trốn'],
  ['うそ', 'uso', 'lời nói dối'],
  ['{怪|あや}しい', 'ayashii', 'đáng ngờ, khả nghi'],
  ['{足跡|あしあと}', 'ashiato', 'dấu chân'],
  ['{映|うつ}ります', 'utsurimasu', 'hiện lên (trong camera, gương)'],
  ['{見|み}かけます', 'mikakemasu', 'tình cờ thấy'],
  ['{深夜|しんや}', "shin'ya", 'đêm khuya'],
  ['{現在|げんざい}', 'genzai', 'hiện tại'],
  ['{過去|かこ}', 'kako', 'quá khứ'],
  ['{置|お}き{忘|わす}れます', 'okiwasuremasu', 'để quên (đặt rồi quên)'],
  ['{探|さが}し{回|まわ}ります', 'sagashimawarimasu', 'tìm khắp nơi'],
  ['{中身|なかみ}', 'nakami', 'đồ bên trong'],
  ['{特徴|とくちょう}', 'tokuchou', 'đặc điểm'],
  ['{目印|めじるし}', 'mejirushi', 'dấu nhận biết'],
  ['{記憶|きおく}', 'kioku', 'trí nhớ, ký ức'],
  ['{思|おも}い{出|だ}します', 'omoidashimasu', 'nhớ ra'],
  ['{見覚|みおぼ}え', 'mioboe', 'sự trông quen'],
  ['{袋|ふくろ}', 'fukuro', 'túi, bao'],
  ['{定期券|ていきけん}', 'teikiken', 'vé tháng'],
  ['{学生証|がくせいしょう}', 'gakuseishou', 'thẻ sinh viên'],
  ['{持|も}ち{主|ぬし}', 'mochinushi', 'chủ (của đồ vật)'],
  ['わけ', 'wake', 'lý do, lẽ'],
  ['{事情|じじょう}', 'jijou', 'hoàn cảnh, sự tình'],
  ['{道理|どうり}で', 'douri de', 'thảo nào, hèn chi'],
  ['なるほど', 'naruhodo', 'ra vậy'],
  ['つまり', 'tsumari', 'tức là'],
  ['{要|よう}するに', 'you suru ni', 'tóm lại'],
  ['{当|あ}たり{前|まえ}', 'atarimae', 'đương nhiên'],
  ['{理解|りかい}します', 'rikai shimasu', 'hiểu, lý giải'],
  ['{勘違|かんちが}いします', 'kanchigai shimasu', 'nhầm tưởng'],
  ['{誤解|ごかい}します', 'gokai shimasu', 'hiểu lầm (ý người khác)'],
  ['{決|けっ}して～ない', 'kesshite ~ nai', 'tuyệt đối không'],
  ['{別|べつ}に～ない', 'betsu ni ~ nai', 'chẳng (có gì đặc biệt)'],
  ['{引|ひ}き{受|う}けます', 'hikiukemasu', 'nhận làm, đảm nhận'],
  ['{子|こ}どもっぽい', 'kodomoppoi', 'trẻ con (người lớn mà như trẻ con)'],
  ['{大人|おとな}っぽい', 'otonappoi', 'chững chạc như người lớn'],
  ['{忘|わす}れっぽい', 'wasureppoi', 'hay quên'],
  ['{怒|おこ}りっぽい', 'okorippoi', 'dễ nổi nóng'],
  ['{飽|あ}きっぽい', 'akippoi', 'mau chán'],
  ['{安|やす}っぽい', 'yasuppoi', 'trông rẻ tiền'],
  ['{白|しろ}っぽい', 'shiroppoi', 'ngả trắng, trăng trắng'],
  ['{熱|ねつ}っぽい', 'netsuppoi', 'hơi sốt'],
  ['{細|こま}かい', 'komakai', 'nhỏ, vụn; tỉ mỉ'],
  ['{詳|くわ}しい', 'kuwashii', 'chi tiết, tường tận'],
  ['{恐|おそ}ろしい', 'osoroshii', 'đáng sợ'],
  ['{印象|いんしょう}', 'inshou', 'ấn tượng'],
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
  id: 'b31-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (50 câu)',
  goal: 'Nhớ chắc 67 từ N3 của Bài 31 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp dễ nhầm (推理・推測・想像, 隠す・隠れる, 映る・写る, 細かい・細い, 勘違い・誤解, 置き忘れる・落とす, 見覚え・記憶, 中身・特徴, 子どもっぽい・子どもらしい).',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 20 câu Nhật → Việt và 15 câu Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N3 (4 lựa chọn cùng loại từ — phải hiểu cả câu mới chọn được).',
        'Lỗi hay mắc: {鍵|かぎ}を~~{隠|かく}れた~~ (→ {隠|かく}した), {防犯|ぼうはん}カメラに~~{写|うつ}った~~ (→ {映|うつ}った), {細|こま}かい{道|みち} (→ {細|ほそ}い{道|みち}), {日|ひ}にちを~~{誤解|ごかい}した~~ (→ {勘違|かんちが}いした), この{顔|かお}に~~{記憶|きおく}がある~~ (→ {見覚|みおぼ}えがある), {元気|げんき}な{子|こ}どもを~~{子|こ}どもっぽい~~と{言|い}う (→ {子|こ}どもらしい).',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b31-lt1-nv', title: 'Nhật → Việt (20 câu)', items: MCQ_NV(0, 20) },
    { t: 'mcq', id: 'b31-lt1-vn', title: 'Việt → Nhật (15 câu)', items: MCQ_VN(40, 55) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b31-lt1-dien',
      title: 'Điền từ vào câu (15 câu)',
      items: [
        { q: '{犯人|はんにん}を{見|み}つけるための（　）は、{現場|げんば}に{残|のこ}っていた{足跡|あしあと}だけだった。', options: ['{印象|いんしょう}', '{手|て}がかり', '{記憶|きおく}', '{過去|かこ}'], correct: 1, why: 'Thứ giúp tìm ra thủ phạm = **manh mối** → **{手|て}がかり**.' },
        { q: '{警察|けいさつ}は{事件|じけん}の（　）に{行|い}って、{詳|くわ}しく{調|しら}べた。', options: ['{現在|げんざい}', '{中身|なかみ}', '{現場|げんば}', '{事情|じじょう}'], correct: 2, why: 'Nơi xảy ra vụ việc → **{現場|げんば}**. ({現在|げんざい} = hiện tại — cùng chữ 現!)' },
        { q: '{彼|かれ}が{犯人|はんにん}だという（　）は{何|なに}もない。', options: ['{謎|なぞ}', '{目印|めじるし}', '{見覚|みおぼ}え', '{証拠|しょうこ}'], correct: 3, why: 'Không có **bằng chứng** → **{証拠|しょうこ}**.' },
        { q: '{電車|でんしゃ}の{棚|たな}に{傘|かさ}を（　）しまった。', options: ['{置|お}き{忘|わす}れて', '{探|さが}し{回|まわ}って', '{見|み}かけて', '{隠|かく}れて'], correct: 0, why: 'Đặt lên giá rồi quên → **{置|お}き{忘|わす}れる**.' },
        { q: '{財布|さいふ}の（　）は、{現金|げんきん}とカードと{学生証|がくせいしょう}です。', options: ['{特徴|とくちょう}', '{中身|なかみ}', '{持|も}ち{主|ぬし}', '{目印|めじるし}'], correct: 1, why: 'Đồ BÊN TRONG → **{中身|なかみ}**. {特徴|とくちょう} là màu, hình dạng…' },
        { q: 'この{人|ひと}の{顔|かお}には（　）がある。どこかで{会|あ}ったような{気|き}がする。', options: ['{記憶|きおく}', '{印象|いんしょう}', '{見覚|みおぼ}え', '{想像|そうぞう}'], correct: 2, why: 'Trông quen → **{見覚|みおぼ}えがある** (cụm cố định).' },
        { q: '{拾|ひろ}った{財布|さいふ}を{交番|こうばん}に{届|とど}けたら、すぐに（　）が{見|み}つかった。', options: ['{容疑者|ようぎしゃ}', '{探偵|たんてい}', '{刑事|けいじ}', '{持|も}ち{主|ぬし}'], correct: 3, why: 'Người chủ của chiếc ví → **{持|も}ち{主|ぬし}**.' },
        { q: '{昨日|きのう}の{夜|よる}のことは、{全然|ぜんぜん}（　）にない。', options: ['{記憶|きおく}', '{見覚|みおぼ}え', '{印象|いんしょう}', '{過去|かこ}'], correct: 0, why: '**{記憶|きおく}にない** = không còn nhớ.' },
        { q: 'メールを{送|おく}ってから、{名前|なまえ}の{間違|まちが}いに（　）。', options: ['{解|と}いた', '{気|き}づいた', '{隠|かく}した', '{映|うつ}った'], correct: 1, why: '**～に{気|き}づく** = nhận ra.' },
        { q: '{猫|ねこ}がベッドの{下|した}に（　）いて、なかなか{出|で}てこない。', options: ['{隠|かく}して', '{映|うつ}って', '{隠|かく}れて', '{見|み}かけて'], correct: 2, why: 'Con mèo TỰ nấp → **{隠|かく}れる** (tự động từ, が／に).' },
        { q: '{防犯|ぼうはん}カメラに、{怪|あや}しい{男|おとこ}が（　）いた。', options: ['{写|うつ}って', '{隠|かく}して', '{見|み}かけて', '{映|うつ}って'], correct: 3, why: 'Hiện trong CAMERA → **{映|うつ}る**. {写|うつ}る dùng cho ảnh chụp.' },
        { q: '{明日|あした}は{雪|ゆき}が{降|ふ}る（　）が{高|たか}いそうだ。', options: ['{可能性|かのうせい}', '{証拠|しょうこ}', '{手|て}がかり', '{想像|そうぞう}'], correct: 0, why: '**～{可能性|かのうせい}が{高|たか}い** = khả năng cao.' },
        { q: '{授業|じゅぎょう}が{休|やす}みだと（　）して、{一日中|いちにちじゅう}{家|いえ}で{寝|ね}ていた。', options: ['{誤解|ごかい}', '{勘違|かんちが}い', '{理解|りかい}', '{推理|すいり}'], correct: 1, why: 'MÌNH tưởng nhầm một sự việc → **{勘違|かんちが}い**. {誤解|ごかい} dùng cho ý / con người của người khác.' },
        { q: '{先輩|せんぱい}に{頼|たの}まれて、{発表会|はっぴょうかい}の{司会|しかい}を（　）。', options: ['{見|み}かけた', '{置|お}き{忘|わす}れた', '{引|ひ}き{受|う}けた', '{探|さが}し{回|まわ}った'], correct: 2, why: 'Nhận làm việc → **{引|ひ}き{受|う}ける**.' },
        { q: 'このかばんは{高|たか}かったのに、（　）{見|み}える。', options: ['{白|しろ}っぽく', '{熱|ねつ}っぽく', '{忘|わす}れっぽく', '{安|やす}っぽく'], correct: 3, why: 'Đắt mà TRÔNG rẻ tiền → **{安|やす}っぽく{見|み}える**.' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b31-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống & hai cách đọc (28 câu)',
  goal: 'Đọc đúng và viết đúng (chọn chữ) các từ có 20 chữ Hán mới của Bài 31 — kể cả từ ngoài bài học (表現・能力・女性・美容院・画像・過ごす・滞在・印刷・手袋) — và tránh bẫy chữ giống (像↔象, 深↔探, 在↔存, 測↔側, 鍵↔健) và chữ có hai cách đọc kun (細い↔細かい) của đề N3.',
  minutes: 25,
  blocks: [
    { t: 'h', text: '🟢 Mức 1 — Dễ: đọc từ in đậm (漢字読み)' },
    {
      t: 'mcq',
      id: 'b31-lt2-doc',
      title: 'Chọn cách đọc (12 câu)',
      items: [
        { q: '{気持|きも}ちを**表現**するのは{難|むずか}しい。', options: ['ひょうげん', 'ひょうけん', 'ひょげん', 'ほうげん'], correct: 0, why: '**表現** = ひょうげん (現 ゲン).' },
        { q: '{彼|かれ}は**能力**が{高|たか}い。', options: ['のりょく', 'のうりょく', 'のうりき', 'のうりょう'], correct: 1, why: '**能力** = のうりょく (能 ノウ — trường âm).' },
        { q: 'この{会社|かいしゃ}は**女性**の{社員|しゃいん}が{多|おお}い。', options: ['じょしょう', 'おんなせい', 'じょせい', 'にょせい'], correct: 2, why: '**女性** = じょせい (性 セイ).' },
        { q: '{週末|しゅうまつ}に**美容院**に{行|い}く。', options: ['びよういん', 'びよいん', 'みよういん', 'びようえん'], correct: 0, why: '**美容院** = びよういん (容 ヨウ).' },
        { q: 'スマホで**画像**を{送|おく}る。', options: ['がしょう', 'かぞう', 'がぞ', 'がぞう'], correct: 3, why: '**画像** = がぞう (像 ゾウ — đục).' },
        { q: '**細**い{道|みち}を{通|とお}る。', options: ['こま', 'ほそ', 'さい', 'せま'], correct: 1, why: '**細**い = ほそい (mảnh, hẹp). ～かい → こまかい.' },
        { q: '{夏休|なつやす}みは{国|くに}で**過**ごした。', options: ['す', 'か', 'すぎ', 'おく'], correct: 0, why: '**過**ごす = すごす (trải qua).' },
        { q: '{日本|にほん}に**滞在**する{期間|きかん}。', options: ['たいさい', 'だいざい', 'たいざい', 'たいぜい'], correct: 2, why: '**滞在** = たいざい (在 ザイ — đục).' },
        { q: 'ポスターを**印刷**する。', options: ['いんさつ', 'いんざつ', 'しるさつ', 'いんしゅつ'], correct: 0, why: '**印刷** = いんさつ (印 イン).' },
        { q: '{動物園|どうぶつえん}で**象**を{見|み}た。', options: ['しょう', 'ぞう', 'ぞ', 'そう'], correct: 1, why: '**象** (con voi) = ぞう. Trong từ ghép trừu tượng đọc しょう ({印象|いんしょう}).' },
        { q: '{冬|ふゆ}は**手袋**が{必要|ひつよう}だ。', options: ['てふくろ', 'しゅたい', 'てぶくろ', 'てぶくら'], correct: 2, why: '**手袋** = てぶくろ (ふ → ぶ).' },
        { q: '{犯人|はんにん}は{自分|じぶん}の**罪**を{認|みと}めた。', options: ['ざい', 'ばつ', 'つみ', 'さい'], correct: 2, why: '**罪** (đứng riêng) = つみ (kun). Trong từ ghép: ザイ ({犯罪|はんざい}).' },
      ],
    },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn chữ Hán đúng (表記)' },
    {
      t: 'mcq',
      id: 'b31-lt2-chon',
      title: 'Chọn chữ (10 câu)',
      items: [
        { q: '{明日|あした}の{天気|てんき}を**よそく**する。', options: ['予側', '予測', '予則', '与測'], correct: 1, why: '**予測** — 測 có 氵 (đo).' },
        { q: '{問題|もんだい}を**かいけつ**した。', options: ['解決', '角決', '解快', '階決'], correct: 0, why: '**解決** — 解 = 角 + 刀 + 牛.' },
        { q: 'どんな**せいかく**の{人|ひと}ですか。', options: ['姓格', '生格', '正格', '性格'], correct: 3, why: '**性格** — 忄 + 生.' },
        { q: 'あの{人|ひと}は{何|なに}かを**かく**している。', options: ['穏', '確', '隠', '陰'], correct: 2, why: '**隠**している — 阝 bên trái.' },
        { q: 'メールの**ないよう**を{確認|かくにん}する。', options: ['内容', '内客', '内谷', '肉容'], correct: 0, why: '**内容** — 宀 + 谷.' },
        { q: '{将来|しょうらい}の{自分|じぶん}を**そうぞう**する。', options: ['想象', '想像', '相像', '想増'], correct: 1, why: '**想像** — 像 có 亻.' },
        { q: '**こま**かいお{金|かね}がない。', options: ['組', '紙', '綿', '細'], correct: 3, why: '**細**かい — 糸 + 田.' },
        { q: '{夜|よる}**おそ**く、**しんや**{番組|ばんぐみ}を{見|み}た。', options: ['探夜', '深夜', '進夜', '新夜'], correct: 1, why: '**深夜** — 氵 + 罙 (sâu). 探 = 扌 (tìm).' },
        { q: '{東京|とうきょう}に**げんざい**{住|す}んでいる。', options: ['現存', '見在', '現在', '規在'], correct: 2, why: '**現在** — 在 (才 + 土).' },
        { q: '{初|はじ}めて{会|あ}ったときの**いんしょう**。', options: ['印象', '印像', '因象', '員象'], correct: 0, why: '**印象** — 象 (không có 亻).' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Khó: chữ giống & hai cách đọc trong câu' },
    {
      t: 'mcq',
      id: 'b31-lt2-bay',
      title: 'Bẫy chữ giống / hai cách đọc (6 câu)',
      items: [
        { q: 'Câu nào viết ĐÚNG?', options: ['{動物園|どうぶつえん}で{大|おお}きな像を{見|み}た。', '{彼|かれ}の{第一|だいいち}印像はよかった。', '{子|こ}どものころの自分を想像した。', 'この象は{画|が}像です。'], correct: 2, why: '**想像** (亻). Con voi là **象** ({象|ぞう}); ấn tượng là **{印象|いんしょう}** (象); hình ảnh là **{画像|がぞう}** (像).' },
        { q: '「{細|ほそ}い」と「{細|こま}かい」— đúng cả hai ở câu nào?', options: ['{細|ほそ}いお{金|かね}がない・{細|こま}かい{道|みち}', '{細|こま}かいお{金|かね}がない・{細|ほそ}い{道|みち}', '{細|ほそ}いお{金|かね}・{細|ほそ}い{道|みち}', '{細|こま}かいお{金|かね}・{細|こま}かい{道|みち}'], correct: 1, why: 'Tiền LẺ → **{細|こま}かい**; đường HẸP → **{細|ほそ}い**. Cùng chữ 細, đọc theo đuôi kana.' },
        { q: 'Câu nào viết ĐÚNG?', options: ['{財布|さいふ}を深している。', '{池|いけ}が探い。', 'なくした{鍵|かぎ}を探している。', 'なくした{鍵|かぎ}を深している。'], correct: 2, why: 'Tìm → **探す** (扌); sâu → **深い** (氵).' },
        { q: 'Câu nào viết ĐÚNG?', options: ['{部屋|へや}の健をかけた。', '{部屋|へや}の鍵をかけた。', '{部屋|へや}の建をかけた。', '{部屋|へや}の鉄をかけた。'], correct: 1, why: 'Chìa khoá → **鍵** (金 + 建). Sức khoẻ → {健康|けんこう} (亻 + 建).' },
        { q: 'げん**ざい**（hiện tại）・そん**ざい**（tồn tại）— chữ đúng cho **ざい**:', options: ['存', '在', '材', '財'], correct: 1, why: '現**在**・存**在** đều dùng **在** (才 + 土). 存 (才 + 子) là chữ ĐẦU của そんざい; 材・財 cũng đọc ざい nhưng nghĩa khác (vật liệu · của cải).' },
        { q: '{犯人|はんにん}の{年齢|ねんれい}を**すいそく**する。— chữ đúng:', options: ['推側', '推則', '推測', '准測'], correct: 2, why: '**推測** — 推 (扌 + 隹) · 測 (氵 + 則). 側 = bên cạnh (亻).' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b31-lt-3-noi-cau',
  kind: 'homework',
  title: 'Luyện thêm 3 · Ngữ pháp — nối đúng dạng & viết lại câu (22 câu)',
  goal: 'Nối đúng mọi loại từ vào bảy mẫu của Bài 31 (chú ý に違いない nhận ナA／N trần; はず・わけ nhận ナAな・Nの; っぽい nhận N・イA bỏ い・Vます; わけにはいかない chỉ nhận động từ) và viết lại câu sang mẫu tương đương mà giữ nguyên nghĩa, kể cả các câu phủ định kép.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Nhắc nhanh — bảng nối',
      items: [
        '**に{違|ちが}いない**: V／イA thể thường · **ナA trần** ({静|しず}か) · **N trần** ({犯人|はんにん}).',
        '**はずがない・わけだ・わけがない・わけではない**: V／イA thể thường · **ナAな** · **Nの** (わけ còn nhận **Nである**).',
        '**っぽい**: **N** ({子|こ}ども) · **イA bỏ い** ({安|やす}) · **Vます bỏ ます** ({忘|わす}れ) → chia như イA.',
        '**わけにはいかない**: chỉ **Vる／Vない／Vている**.',
      ],
    },
    {
      t: 'quiz',
      id: 'b31-lt3-noi',
      title: '🟡 Nối đúng dạng — viết cả cụm (12 câu)',
      kind: 'fill',
      grammar: 'Viết từ trong ngoặc ở dạng đúng + mẫu (cả cụm).',
      items: [
        { q: '（{上手|じょうず}）＋ に{違|ちが}いない', answers: V('{上手|じょうず}に{違|ちが}いない'), hint: 'ナA trần' },
        { q: '（{学生|がくせい}）＋ に{違|ちが}いない', answers: V('{学生|がくせい}に{違|ちが}いない'), hint: 'N trần' },
        { q: '（{忘|わす}れる → quá khứ）＋ に{違|ちが}いない', answers: V('{忘|わす}れたに{違|ちが}いない'), hint: 'Vた' },
        { q: '（{暇|ひま}）＋ はずがない', answers: V('{暇|ひま}なはずがない'), hint: 'ナA ＋ な' },
        { q: '（{休|やす}み）＋ はずがない', answers: V('{休|やす}みのはずがない'), hint: 'N ＋ の' },
        { q: '（{本物|ほんもの}）＋ わけがない', answers: V('{本物|ほんもの}のわけがない', '{本物|ほんもの}であるわけがない'), hint: 'N ＋ の／である' },
        { q: '（{安|やす}い）＋ っぽい', answers: V('{安|やす}っぽい'), hint: 'イA bỏ い' },
        { q: '（{飽|あ}きる）＋ っぽい', answers: V('{飽|あ}きっぽい', 'あきっぽい'), hint: 'Vます bỏ ます' },
        { q: '（{静|しず}か）＋ わけだ', answers: V('{静|しず}かなわけだ'), hint: 'ナA ＋ な' },
        { q: '（{嫌|きら}い）＋ わけではない', answers: V('{嫌|きら}いなわけではない'), hint: 'ナA ＋ な' },
        { q: '（{行|い}く → phủ định）＋ わけにはいかない', answers: V('{行|い}かないわけにはいかない'), hint: 'Vない' },
        { q: '（{待|ま}っている）＋ わけにもいかない', answers: V('{待|ま}っているわけにもいかない'), hint: 'Vている giữ nguyên' },
      ],
    },
    {
      t: 'quiz',
      id: 'b31-lt3-viet',
      title: '🔴 Viết lại câu (10 câu)',
      kind: 'translate',
      grammar: 'Giữ nguyên nghĩa. Chú ý phủ định kép: ないはずがない／ないわけではない／ないわけにはいかない.',
      items: [
        { q: 'きっとあの{人|ひと}がうそをついていると{思|おも}う。（→ に{違|ちが}いない）', answers: V('あの{人|ひと}はうそをついているに{違|ちが}いない。', 'あの{人|ひと}がうそをついているに{違|ちが}いない。', 'きっとあの{人|ひと}はうそをついているに{違|ちが}いない。'), hint: '…ついている に ちがいない' },
        { q: '{彼|かれ}は{絶対|ぜったい}に{知|し}っている。（→ ないはずがない）', answers: V('{彼|かれ}が{知|し}らないはずがない。', '{彼|かれ}は{知|し}らないはずがない。'), hint: 'しらない はずがない' },
        { q: 'こんな{安|やす}い{値段|ねだん}でダイヤが{買|か}えるなんて、ありえない。（→ わけがない）', answers: V('こんな{安|やす}い{値段|ねだん}でダイヤが{買|か}えるわけがない。', 'こんなに{安|やす}い{値段|ねだん}でダイヤが{買|か}えるわけがない。'), hint: 'かえる わけがない (ありえない = không thể có — N2)' },
        { q: '{彼女|かのじょ}はよく{怒|おこ}る。（→ っぽい）', answers: V('{彼女|かのじょ}は{怒|おこ}りっぽい。', '{彼女|かのじょ}は{怒|おこ}りっぽいです。'), hint: 'おこりっぽい' },
        { q: 'このシャツは{白|しろ}に{近|ちか}い{色|いろ}だ。（→ っぽい）', answers: V('このシャツは{白|しろ}っぽい。', 'このシャツは{白|しろ}っぽい{色|いろ}だ。', 'このシャツは{白|しろ}っぽいです。'), hint: 'しろっぽい' },
        { q: '{雪|ゆき}が{降|ふ}っている。それで{電車|でんしゃ}が{遅|おく}れているのだと{分|わ}かった。（→ だから～わけだ）', answers: V('{雪|ゆき}が{降|ふ}っている。だから{電車|でんしゃ}が{遅|おく}れているわけだ。', '{雪|ゆき}が{降|ふ}っているから、{電車|でんしゃ}が{遅|おく}れているわけだ。'), hint: 'だから… おくれて いる わけだ' },
        { q: '{毎日|まいにち}{三十分|さんじゅっぷん}ずつ、{二週間|にしゅうかん}{歩|ある}いた。{全部|ぜんぶ}で{七時間|しちじかん}{歩|ある}いたことになる。（→ つまり～わけだ）', answers: V('つまり、{全部|ぜんぶ}で{七時間|しちじかん}{歩|ある}いたわけだ。', 'つまり、{七時間|しちじかん}{歩|ある}いたわけだ。', 'つまり、{全部|ぜんぶ}で7{時間|じかん}{歩|ある}いたわけだ。'), hint: 'つまり… あるいた わけだ' },
        { q: '{高|たか}いレストランがいつもおいしいとは{限|かぎ}らない。（→ 必ずしも～わけではない）', answers: V('{高|たか}いレストランが{必|かなら}ずしもおいしいわけではない。', '{高|たか}いレストランは{必|かなら}ずしもおいしいわけではない。'), hint: 'かならずしも おいしい わけではない' },
        { q: '{少|すこ}しは{泳|およ}げる。でも、{上手|じょうず}ではない。（→ ないわけではない）', answers: V('{泳|およ}げないわけではないが、{上手|じょうず}ではない。', '{泳|およ}げないわけではないけど、{上手|じょうず}じゃない。', '{泳|およ}げないわけではないが、{上手|じょうず}ではありません。'), hint: 'およげない わけではないが' },
        { q: '{約束|やくそく}したから、{絶対|ぜったい}に{行|い}かなければならない。（→ ないわけにはいかない）', answers: V('{約束|やくそく}したから、{行|い}かないわけにはいかない。', '{約束|やくそく}したので、{行|い}かないわけにはいかない。'), hint: 'いかない わけには いかない' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b31-lt-4-phan-biet',
  kind: 'homework',
  title: 'Luyện thêm 4 · Phân biệt — に違いない・はずだ・だろう・かもしれない・はずがない・わけがない・わけだ・わけではない・わけにはいかない (22 câu)',
  goal: 'Chọn đúng mẫu theo độ chắc chắn và theo nghĩa trong các cặp đề N3 hay bẫy: に違いない ↔ はずだ ↔ だろう ↔ かもしれない (+ phó từ きっと・恐らく・もしかすると・まさか), はずがない ↔ わけがない, わけだ ↔ はずだ, わけではない ↔ わけがない, ないわけではない ↔ ないわけにはいかない, わけにはいかない ↔ Vられない, っぽい ↔ らしい.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Nhắc nhanh — 4 câu hỏi để chọn',
      items: [
        '**① Khẳng định hay phủ nhận?** — phủ nhận ~0% → はずがない／わけがない.',
        '**② Chắc mấy phần?** — きっと → に{違|ちが}いない · たぶん／{恐|おそ}らく → だろう · もしかすると → かもしれない · まさか → わけがない.',
        '**③ Đã biết sự thật hay chỉ đoán?** — đã biết, "thảo nào / tức là" → わけだ; còn đoán → はずだ／だろう.',
        '**④ Không làm vì KHÔNG THỂ hay vì KHÔNG NÊN?** — không thể → Vられない; không nên (lẽ phải) → わけにはいかない; buộc phải → ないわけにはいかない.',
      ],
    },
    {
      t: 'mcq',
      id: 'b31-lt4-cap',
      title: '🟡 Chọn mẫu đúng (14 câu)',
      items: [
        { q: 'あんなに{練習|れんしゅう}したのだから、きっと{勝|か}つ（　）。', options: ['かもしれない', 'に{違|ちが}いない', 'はずがない', 'わけではない'], correct: 1, why: '**きっと** → **に{違|ちが}いない** (~90%).' },
        { q: '{恐|おそ}らく、{明日|あした}も{雨|あめ}（　）。', options: ['だろう', 'に{違|ちが}いない', 'のはずがない', 'のわけだ'], correct: 0, why: '**{恐|おそ}らく** → **だろう** (~70%).' },
        { q: 'もしかすると、{財布|さいふ}は{会社|かいしゃ}にある（　）。', options: ['に{違|ちが}いない', 'わけだ', 'かもしれない', 'はずがない'], correct: 2, why: '**もしかすると** → **かもしれない** (~50%).' },
        { q: 'まさか、{彼|かれ}がそんなことをする（　）。', options: ['わけだ', 'に{違|ちが}いない', 'はずだ', 'わけがない'], correct: 3, why: '**まさか** → phủ định mạnh → **わけがない**.' },
        { q: '{会議|かいぎ}は{三時|さんじ}からだから、{部長|ぶちょう}はもうすぐ{来|く}る（　）。', options: ['はずだ', 'わけだ', 'わけがない', 'っぽい'], correct: 0, why: 'Dự đoán có căn cứ (lịch) → **はずだ**. わけだ không dùng cho dự đoán.' },
        { q: '「{今日|きょう}は{祝日|しゅくじつ}だよ。」「あ、だから{電車|でんしゃ}がすいている（　）。」', options: ['はずがない', 'わけだ', 'かもしれない', 'わけにはいかない'], correct: 1, why: 'Vừa biết lý do → **わけだ** (thảo nào). (はずだ cũng được nhưng không có trong lựa chọn.)' },
        { q: '{彼|かれ}は{今|いま}{入院|にゅういん}しているから、パーティーに{来|く}る（　）。', options: ['わけだ', 'に{違|ちが}いない', 'はずがない', 'っぽい'], correct: 2, why: 'Căn cứ (đang nằm viện) → bác bỏ → **はずがない**.' },
        { q: '{日本人|にほんじん}だからといって、{敬語|けいご}が{完璧|かんぺき}な（　）。', options: ['わけがない', 'に{違|ちが}いない', 'わけだ', 'わけではない'], correct: 3, why: '"Không phải cứ là người Nhật thì…" → phủ định một phần → **わけではない**. ({完璧|かんぺき} = hoàn hảo — N2.)' },
        { q: '{肉|にく}は{食|た}べられない（　）が、{魚|さかな}のほうが{好|す}きだ。', options: ['わけではない', 'わけにはいかない', 'はずがない', 'に{違|ちが}いない'], correct: 0, why: '"Không phải không ăn được thịt" → **ないわけではない**.' },
        { q: '{上司|じょうし}に{頼|たの}まれたら、{断|ことわ}る（　）。', options: ['わけではない', 'わけにはいかない', 'わけがない', 'はずだ'], correct: 1, why: 'Lẽ phải / tình thế → **{断|ことわ}るわけにはいかない** (không thể từ chối).' },
        { q: '{風邪|かぜ}で{声|こえ}が{出|で}なくて、{電話|でんわ}に（　）。', options: ['{出|で}るわけにはいかなかった', '{出|で}られなかった', '{出|で}ないわけにはいかなかった', '{出|で}るわけだった'], correct: 1, why: 'Mất giọng → không có KHẢ NĂNG → **{出|で}られなかった**.' },
        { q: 'あの{子|こ}は{五歳|ごさい}で、とても（　）{笑顔|えがお}をしている。', options: ['{子|こ}どもっぽい', '{子|こ}どもに{違|ちが}いない', '{子|こ}どもらしい', '{子|こ}どものわけの'], correct: 2, why: 'Đứa bé ĐÚNG chất trẻ con (khen) → **{子|こ}どもらしい**.' },
        { q: '{犯人|はんにん}は（　）{服|ふく}を{着|き}ていたが、{色|いろ}ははっきり{覚|おぼ}えていない。', options: ['{黒|くろ}そうな', '{黒|くろ}に{違|ちが}いない', '{黒|くろ}のはずの', '{黒|くろ}っぽい'], correct: 3, why: 'Màu không chắc → **{黒|くろ}っぽい**.' },
        { q: '{一日|いちにち}に{千円|せんえん}{使|つか}う。つまり、{一か月|いっかげつ}で{三万円|さんまんえん}{使|つか}う（　）。', options: ['わけだ', 'はずがない', 'わけではない', 'っぽい'], correct: 0, why: '"Tức là" → **わけだ**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-lt4-bay',
      title: '🔴 Bẫy — câu nào ĐÚNG? (8 câu)',
      items: [
        { q: 'Câu nào ĐÚNG?', options: ['{彼|かれ}は{犯人|はんにん}のに{違|ちが}いない。', '{彼|かれ}は{犯人|はんにん}に{違|ちが}いない。', '{彼|かれ}は{犯人|はんにん}だに{違|ちが}いない。', '{彼|かれ}は{犯人|はんにん}なに{違|ちが}いない。'], correct: 1, why: 'N **trần** ＋ に{違|ちが}いない.' },
        { q: 'Câu nào ĐÚNG?', options: ['{今日|きょう}は{休|やす}みはずがない。', '{今日|きょう}は{休|やす}みなはずがない。', '{今日|きょう}は{休|やす}みのはずがない。', '{今日|きょう}は{休|やす}みにはずがない。'], correct: 2, why: 'N ＋ **の** ＋ はずがない.' },
        { q: 'Câu nào ĐÚNG?', options: ['（{雨|あめ}が{降|ふ}っているのを{見|み}ながら）{雨|あめ}が{降|ふ}っているに{違|ちが}いない。', '{明日|あした}、{私|わたし}は{図書館|としょかん}に{行|い}くに{違|ちが}いない。', 'きっと{明日|あした}は{晴|は}れるかもしれない。', '{道|みち}が{濡|ぬ}れている。{夜中|よなか}に{雨|あめ}が{降|ふ}ったに{違|ちが}いない。'], correct: 3, why: 'Suy ra từ dấu hiệu (đường ướt) → に{違|ちが}いない đúng. (1) đang thấy tận mắt; (2) ý định của mình; (3) きっと không đi với かもしれない.' },
        { q: 'Câu nào ĐÚNG?', options: ['{足|あし}をけがして、{走|はし}るわけにはいかない。', '{明日|あした}は{試験|しけん}だから、{今夜|こんや}は{遊|あそ}ぶわけにはいかない。', '{日本語|にほんご}が{下手|へた}で、{話|はな}すわけにはいかない。', '{雨|あめ}だから、{天気|てんき}がいいわけにはいかない。'], correct: 1, why: 'Làm được mà lẽ phải không cho → わけにはいかない. (1)(3) là không có KHẢ NĂNG → Vられない; (4) vô nghĩa.' },
        { q: '「お{酒|さけ}が{飲|の}めないわけではない」の{意味|いみ}は？', options: ['Hoàn toàn không uống được.', 'Uống được (nhưng có lẽ không thích / hôm nay không uống).', 'Phải uống.', 'Làm gì có chuyện uống được.'], correct: 1, why: 'Phủ định kép **ないわけではない** = **có** uống được.' },
        { q: '「{先輩|せんぱい}の{頼|たの}みだから、{引|ひ}き{受|う}けないわけにはいかない」の{意味|いみ}は？', options: ['Không nhận.', 'Không thể nhận.', 'Phải nhận.', 'Có thể nhận hoặc không.'], correct: 2, why: '**ないわけにはいかない** = buộc phải nhận.' },
        { q: 'Câu nào ĐÚNG?', options: ['{九時|くじ}に{出|で}たから、もうすぐ{着|つ}くわけだ。', '{窓|まど}が{開|あ}いていた。{道理|どうり}で{寒|さむ}いはずがない。', 'エアコンが{壊|こわ}れていたのか。{道理|どうり}で{暑|あつ}いわけだ。', '{道理|どうり}で{明日|あした}は{雨|あめ}が{降|ふ}るわけだ。'], correct: 2, why: 'Biết lý do → **{道理|どうり}で～わけだ**. (1) dự đoán → はずだ; (2) {道理|どうり}で không đi với はずがない; (4) dự đoán, không có lý do.' },
        { q: 'Câu nào ĐÚNG?', options: ['{五歳|ごさい}の{娘|むすめ}は{本当|ほんとう}に{子|こ}どもっぽい{笑顔|えがお}だ。', '{父|ちち}は{五十歳|ごじゅっさい}なのに{子|こ}どもらしいところがある。', 'その{話|はなし}はちょっとうそっぽいね。', 'この{服|ふく}は{安|やす}いっぽい。'], correct: 2, why: '**うそっぽい** (nghe như bịa) đúng. (1) đứa bé → らしい; (2) người lớn → っぽい; (4) → {安|やす}っぽい.' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b31-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp kiểu N3 — 文字・語彙 · 文法 · 読解 (18 câu, có thang điểm)',
  goal: 'Làm một đề mini theo đúng ba phần của JLPT N3 trên nội dung Bài 31 trong 25 phút, tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Thang điểm & cách ôn',
      items: [
        '**Thời gian**: 25 phút cho cả 18 câu (文字・語彙 5′ · 文法 8′ · 読解 12′). Mỗi câu 1 điểm — **đạt** ≥ 12/18, **tốt** ≥ 15/18.',
        'Sai ở **文字・語彙** → ôn mục Từ vựng (bảng 類義語) và mục Chữ Hán (bảng chữ trông giống).',
        'Sai ở **文法** → ôn Ngữ pháp ⑧ (thang chắc chắn + "nhà わけ") và Luyện thêm 4.',
        'Sai ở **読解** → đọc lại Đọc hiểu Bài 2 (cách theo dõi giả thuyết → bác bỏ → sự thật).',
      ],
    },
    {
      t: 'mcq',
      id: 'b31-lt5-moji',
      title: '文字・語彙 (6 câu)',
      items: [
        { q: '{事件|じけん}の**現場**には、まだ{警察|けいさつ}がいる。', options: ['げんじょう', 'げんば', 'けんば', 'げんぱ'], correct: 1, why: '**現場** = げんば.' },
        { q: '{彼|かれ}の**説明**はいつも**くわしい**。', options: ['詳しい', '洋しい', '評しい', '細しい'], correct: 0, why: '**詳しい** — 言 + 羊.' },
        { q: '{電車|でんしゃ}に{傘|かさ}を（　）しまい、{駅|えき}に{問|と}い{合|あ}わせた。', options: ['{見|み}かけて', '{隠|かく}れて', '{置|お}き{忘|わす}れて', '{気|き}づいて'], correct: 2, why: '**{置|お}き{忘|わす}れる** (đặt rồi quên).' },
        { q: '「{今|いま}、{何|なん}と{言|い}った？」「{別|べつ}に。」の「{別|べつ}に」に{近|ちか}いのは？', options: ['{特|とく}に{何|なに}も{言|い}っていない', 'もう{一度|いちど}{言|い}う', 'とても{怒|おこ}っている', '{絶対|ぜったい}に{言|い}わない'], correct: 0, why: '**{別|べつ}に** (cụt) = chẳng có gì (đặc biệt).' },
        { q: '「{手|て}がかり」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{手|て}がかりを{洗|あら}ってから{食|た}べる。', '{犯人|はんにん}を{探|さが}す{手|て}がかりが{見|み}つかった。', '{手|て}がかりで{荷物|にもつ}を{運|はこ}ぶ。', '{明日|あした}は{手|て}がかりな{日|ひ}だ。'], correct: 1, why: '**{手|て}がかりが{見|み}つかる** = tìm thấy manh mối.' },
        { q: '「{勘違|かんちが}い」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{先生|せんせい}の{説明|せつめい}を{勘違|かんちが}いして、よく{分|わ}かった。', '{試験|しけん}は{明日|あした}だと{勘違|かんちが}いして、{準備|じゅんび}していなかった。', '{友達|ともだち}を{勘違|かんちが}いに{誘|さそ}った。', '{勘違|かんちが}いな{天気|てんき}だ。'], correct: 1, why: 'Tưởng nhầm (ngày thi) → **{勘違|かんちが}いする**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-lt5-bunpou',
      title: '文法 (8 câu — 6 câu điền + 2 câu ★)',
      items: [
        { q: '{机|つくえ}の{上|うえ}にケーキの{箱|はこ}がある。{誰|だれ}かが{買|か}ってきた（　）。', options: ['はずがない', 'わけにはいかない', 'に{違|ちが}いない', 'わけではない'], correct: 2, why: 'Dấu hiệu → tin chắc → **に{違|ちが}いない**.' },
        { q: '{真面目|まじめ}な{彼|かれ}が、{授業|じゅぎょう}を{休|やす}んで{遊|あそ}びに{行|い}く（　）。', options: ['わけだ', 'わけがない', 'わけではない', 'に{違|ちが}いない'], correct: 1, why: 'Lẽ thường (người nghiêm túc) → phủ nhận → **わけがない**.' },
        { q: 'この{時計|とけい}は{高|たか}かったのに、{安|やす}（　）{見|み}える。', options: ['っぽく', 'みたいに', 'らしく', 'のように'], correct: 0, why: '{安|やす} (イA bỏ い) ＋ **っぽく** ＋ {見|み}える. Ba lựa chọn kia không gắn được vào gốc {安|やす}.' },
        { q: '「{西川|にしかわ}さん、{毎朝|まいあさ}{五時|ごじ}に{起|お}きているんだって。」「{道理|どうり}でいつも{早|はや}く{来|く}る（　）。」', options: ['はずがない', 'わけにはいかない', 'に{違|ちが}いない', 'わけだ'], correct: 3, why: 'Biết lý do → **{道理|どうり}で～わけだ**.' },
        { q: '{旅行|りょこう}が{嫌|きら}いな（　）が、{今年|ことし}はお{金|かね}がないので{行|い}かない。', options: ['わけではない', 'わけがない', 'はずがない', 'わけにはいかない'], correct: 0, why: 'Gạt suy đoán "ghét du lịch" → **わけではない**.' },
        { q: '{子|こ}どもが{熱|ねつ}を{出|だ}したので、{仕事|しごと}を{休|やす}まない（　）。', options: ['わけではなかった', 'わけにはいかなかった', 'はずがなかった', 'わけだった'], correct: 1, why: 'Buộc phải nghỉ → **Vないわけにはいかなかった**.' },
        { q: '★ {僕|ぼく}が ＿＿ ＿＿ ★ ＿＿。（{怒|おこ}っている／{約束|やくそく}を{忘|わす}れた／わけだ／から、{彼女|かのじょ}が）', options: ['{怒|おこ}っている', '{約束|やくそく}を{忘|わす}れた', 'わけだ', 'から、{彼女|かのじょ}が'], correct: 0, why: 'Câu đúng: {僕|ぼく}が **{約束|やくそく}を{忘|わす}れた から、{彼女|かのじょ}が {怒|おこ}っている わけだ** (thảo nào cô ấy giận). ★ (thứ 3) = **{怒|おこ}っている**. 〔Boku ga yakusoku o wasureta kara, kanojo ga okotte iru wake da.〕' },
        { q: '★ {高|たか}い{物|もの}が ＿＿ ＿＿ ★ ＿＿ ではない。（いい{物|もの}だ／という／{必|かなら}ずしも／わけ）', options: ['いい{物|もの}だ', 'という', '{必|かなら}ずしも', 'わけ'], correct: 1, why: 'Câu đúng: {高|たか}い{物|もの}が **{必|かなら}ずしも いい{物|もの}だ という わけ** ではない. ★ (thứ 3) = **という**. 〔Kanarazushimo ii mono da to iu wake de wa nai.〕' },
      ],
    },
    {
      t: 'passage',
      title: '読解 — {寮|りょう}の{掲示板|けいじばん}から（ダニエル）',
      intro: 'Đọc bài viết ngắn ダニエル dán trên bảng tin ký túc xá rồi trả lời 4 câu hỏi.',
      paras: [
        { text: '{先週|せんしゅう}の{月曜日|げつようび}、{共同|きょうどう}キッチンの{冷蔵庫|れいぞうこ}に{入|い}れておいた{僕|ぼく}の{牛乳|ぎゅうにゅう}が、{半分|はんぶん}に{減|へ}っていた。{僕|ぼく}は、きっと{誰|だれ}かが{勝手|かって}に{飲|の}んだに{違|ちが}いないと{思|おも}って、{掲示板|けいじばん}に「{人|ひと}の{物|もの}を{飲|の}まないでください」と{書|か}いた。' },
        { text: 'ところが、{次|つぎ}の{日|ひ}、{管理人|かんりにん}さんから「{冷蔵庫|れいぞうこ}が{壊|こわ}れていたので、{中|なか}の{物|もの}を{一度|いちど}{全部|ぜんぶ}{出|だ}して、{別|べつ}の{冷蔵庫|れいぞうこ}に{移|うつ}しました。そのとき、{牛乳|ぎゅうにゅう}のパックが{倒|たお}れて、{半分|はんぶん}こぼれてしまいました。すみません」という{手紙|てがみ}をもらった。' },
        { text: '{道理|どうり}で、{冷蔵庫|れいぞうこ}の{中|なか}の{物|もの}の{場所|ばしょ}が{変|か}わっていたわけだ。{誰|だれ}かが{飲|の}んだわけではなかったのだ。{僕|ぼく}は{掲示板|けいじばん}に「{疑|うたが}ってごめんなさい」と{書|か}き{直|なお}した。{証拠|しょうこ}もないのに、{寮|りょう}の{仲間|なかま}を{疑|うたが}うわけにはいかない。これからは、{書|か}く{前|まえ}にまず{管理人|かんりにん}さんに{聞|き}くことにした。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b31-lt5-doc',
      title: '読解 (4 câu)',
      items: [
        { q: 'ダニエルさんが{最初|さいしょ}に{考|かんが}えたことは{何|なん}ですか。', options: ['{冷蔵庫|れいぞうこ}が{壊|こわ}れていた。', '{誰|だれ}かが{牛乳|ぎゅうにゅう}を{勝手|かって}に{飲|の}んだ。', '{管理人|かんりにん}さんが{牛乳|ぎゅうにゅう}を{移|うつ}した。', '{自分|じぶん}で{飲|の}んで{忘|わす}れていた。'], correct: 1, why: 'Đoạn 1: **きっと{誰|だれ}かが{勝手|かって}に{飲|の}んだに{違|ちが}いないと{思|おも}って** — giả thuyết ban đầu (sau đó bị bác bỏ).' },
        { q: '{牛乳|ぎゅうにゅう}が{減|へ}っていたのはなぜですか。', options: ['{寮|りょう}の{仲間|なかま}が{飲|の}んだから', '{管理人|かんりにん}さんが{飲|の}んだから', '{冷蔵庫|れいぞうこ}を{移|うつ}すときにパックが{倒|たお}れて、こぼれたから', '{冷蔵庫|れいぞうこ}が{壊|こわ}れて、{牛乳|ぎゅうにゅう}が{悪|わる}くなったから'], correct: 2, why: 'Đoạn 2 (thư của quản lý): **パックが{倒|たお}れて、{半分|はんぶん}こぼれてしまいました**.' },
        { q: '「{道理|どうり}で、～わけだ」とありますが、ダニエルさんは{何|なに}が{分|わ}かりましたか。', options: ['{冷蔵庫|れいぞうこ}の{中|なか}の{物|もの}の{場所|ばしょ}が{変|か}わっていた{理由|りゆう}', '{牛乳|ぎゅうにゅう}を{飲|の}んだ{人|ひと}の{名前|なまえ}', '{掲示板|けいじばん}の{使|つか}い{方|かた}', '{新|あたら}しい{冷蔵庫|れいぞうこ}の{場所|ばしょ}'], correct: 0, why: '**{道理|どうり}で、{冷蔵庫|れいぞうこ}の{中|なか}の{物|もの}の{場所|ばしょ}が{変|か}わっていたわけだ** — hiểu ra lý do (đồ đã bị chuyển ra rồi cất lại).' },
        { q: 'ダニエルさんはこれから{何|なに}をすることにしましたか。', options: ['{牛乳|ぎゅうにゅう}を{自分|じぶん}の{部屋|へや}に{置|お}く。', '{掲示板|けいじばん}に{名前|なまえ}を{書|か}く。', '{冷蔵庫|れいぞうこ}を{新|あたら}しく{買|か}う。', '{掲示板|けいじばん}に{書|か}く{前|まえ}に、{管理人|かんりにん}さんに{聞|き}く。'], correct: 3, why: 'Câu cuối: **これからは、{書|か}く{前|まえ}にまず{管理人|かんりにん}さんに{聞|き}くことにした**.' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{誰|だれ}かが{飲|の}んだに{違|ちが}いないと{思|おも}いました。', 'Dare ka ga nonda ni chigainai to omoimashita.', 'Tôi đã nghĩ chắc chắn có ai đó đã uống. (①)'),
        E('{道理|どうり}で、{物|もの}の{場所|ばしょ}が{変|か}わっていたわけだ。', 'Douri de, mono no basho ga kawatte ita wake da.', 'Thảo nào chỗ để đồ đã thay đổi. (⑤)'),
        E('{誰|だれ}かが{飲|の}んだわけではなかったのだ。', 'Dare ka ga nonda wake de wa nakatta no da.', 'Hoá ra không phải là có ai uống. (⑥)'),
        E('{証拠|しょうこ}もないのに、{仲間|なかま}を{疑|うたが}うわけにはいかない。', 'Shouko mo nai noni, nakama o utagau wake ni wa ikanai.', 'Không có bằng chứng thì không thể nghi ngờ bạn bè. (⑦)'),
      ],
    },
  ],
};

export const BAI_31: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
