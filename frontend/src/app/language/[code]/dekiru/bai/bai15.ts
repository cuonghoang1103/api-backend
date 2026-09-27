/**
 * Bài 15 — テレビ・雑誌から (Từ ti vi, tạp chí) · できる日本語 初級 第15課, p.253–269 · JPD113/JPD123.
 * BÀI CUỐI của sách — bài tập cuối có mục "Ôn tập cả sách".
 *
 * Ngữ pháp: ポイント 119–124 (p.280–281): 普通形そうです (nghe nói) · ___たら、___ ·
 * ___ても、___ · Vテ形います (trạng thái còn lại sau khi việc đã xảy ra: 止まっています,
 * 並んでいます…) · 普通形と思います (đoán: きっと／たぶん) · Nで (nguyên nhân) + bảng
 * 自動詞／他動詞 (表 p.288) và bảng thể たら／ても (p.281).
 * Thứ tự xuất hiện trong sách: 119 → 124 (chủ đề 1) → 120, 121, 123 (chủ đề 2) → 122 (chủ đề 3).
 * Từ vựng: đủ 48 mục của trang ことば p.267 (27 + 14 + 7) — từ Bài 8 trở đi cô không phát
 * danh sách riêng nên trang ことば của sách là chuẩn — cộng 9 từ ở chân bài đọc 話読聞書
 * p.266 (スピーチコンテスト, ～位, 最後, ホール, 思い出, うなずきます, 緊張します,
 * 笑います, なんと) và 会場 (chân もう一度聞こう p.268) = 58 từ, tất cả có thẻ từ.
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Chỉ dùng lại tên nhân vật; tên quán, công viên, ban nhạc là tự đặt.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo bai1.ts): nữ = パク, アンナ, ワン, メアリー,
 * マリヤム, 木村 · nam = マルコ, カルロス, ダニエル, ナタポン, 西川. Hội thoại: role 'a'/'c' =
 * giọng nữ, 'b'/'examiner' = giọng nam. Nghe: voice 'ja-nu' = nữ, 'ja-nam' = nam.
 */
import type { Block, Lesson } from '@/components/sach-hoc/types';

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

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b15-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — テレビ・雑誌から Kể tin nghe được, rủ bạn đi, nói chuyện ngoài phố',
  goal: 'Kể lại cho bạn tin xem trên ti vi / tạp chí ("nghe nói …") rồi rủ bạn đi, bày tỏ cảm tưởng khi nghe tin; bàn kế hoạch với điều kiện "nếu … thì …", "dù … vẫn …", đoán "chắc là …"; ra phố thì tả được những gì đang thấy (tàu đang dừng, quán đóng cửa, người xếp hàng) và đề nghị cách khác.',
  minutes: 45,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 15 bạn làm được (できる)',
      items: [
        '**① これ、{知|し}ってる？** — thấy tin trên **ti vi, tạp chí** (sự kiện, cửa hàng mới, tai nạn, bão…) thì **kể lại cho bạn**: ～そうです ("nghe nói / báo nói là …"), **rủ bạn đi cùng**, và **nói cảm tưởng** về tin đó (怖いですね・心配ですね・よかったですね). Nói được **nguyên nhân** bằng **N で**: {事故|じこ}で{電車|でんしゃ}が{止|と}まりました.',
        '**② {雑誌|ざっし}を{見|み}て{町|まち}へ** — dựa vào thông tin trong tạp chí, **vừa tính các điều kiện vừa bàn kế hoạch** với bạn: "**nếu** có thời gian **thì** đi nhé" (～たら), "**dù** đông **vẫn** muốn đi" (～ても), "**chắc chắn / chắc là** sẽ đông" (きっと／たぶん～と思います).',
        '**③ {町|まち}を{歩|ある}いて** — ra phố, **tả ngắn gọn cảnh xung quanh**: cốc bẩn, tàu đang dừng, cửa hàng đóng, người xếp hàng dài, quán kín chỗ (**V て います** — trạng thái còn lại), rồi đề nghị cách khác (バスで{行|い}きませんか).',
        '**できる！** — làm **tờ báo / tạp chí của riêng mình**: viết tin về sự kiện ở thành phố, quán nên đến, tin mới xem gần đây, "3 tin lớn của tôi", rồi đọc và nói chuyện về nó.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — từ tin trên ti vi đến lúc ra phố',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['Kể tin trong tạp chí', '{週末|しゅうまつ}、{公園|こうえん}でフリーマーケットがあるそうですよ。', 'Shuumatsu, kouen de furii maaketto ga aru sou desu yo.', '119'],
        ['Rủ đi', '{一緒|いっしょ}に{行|い}きませんか。——いいですね。{行|い}きましょう。', 'Issho ni ikimasen ka. — Ii desu ne. Ikimashou.', '(48–49)'],
        ['Kể tin trên ti vi', '{台風|たいふう}で{電車|でんしゃ}が{止|と}まったそうです。——{本当|ほんとう}ですか。{大変|たいへん}ですね。', 'Taifuu de densha ga tomatta sou desu. — Hontou desu ka. Taihen desu ne.', '119, 124'],
        ['Đặt điều kiện', '{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。', 'Jikan ga attara, issho ni ikimasen ka.', '120'],
        ['Dù thế nào cũng…', '{雨|あめ}が{降|ふ}っても、{行|い}きたいです。', 'Ame ga futte mo, ikitai desu.', '121'],
        ['Đoán', 'きっと{安|やす}くていいものがあると{思|おも}います。', 'Kitto yasukute ii mono ga aru to omoimasu.', '123'],
        ['Tả cảnh ngoài phố', 'あっ、{電車|でんしゃ}が{止|と}まっています。——{本当|ほんとう}だ。', 'A, densha ga tomatte imasu. — Hontou da.', '122'],
        ['Báo nhân viên', 'あのう、コップが{汚|よご}れています。——あっ、すみません。', 'Anou, koppu ga yogorete imasu. — A, sumimasen.', '122'],
      ],
    },

    /* ── ① これ、知ってる？ ── */
    { t: 'h', text: '① これ、{知|し}ってる？ — Cái này bạn biết chưa?' },
    {
      t: 'p',
      text: 'Tình huống 1: ở **sảnh ký túc xá (寮のロビー)**, một bạn đang đọc **tạp chí**, thấy trang quảng cáo **chợ đồ cũ (フリーマーケット)** ở công viên — áo phông 150 yên, sách 50 yên — liền **kể lại** (～そうです) và **rủ** bạn kia đi cùng. Tình huống 2: bạn kể **tin xem trên thời sự** — một ca sĩ bị thương vì **tai nạn xe buýt**, buổi diễn tuần sau có lẽ bị **huỷ** — người nghe bày tỏ cảm tưởng. Tình huống 3: tin **động đất, bão** — nguyên nhân nói bằng **N で**.',
    },
    {
      t: 'dialogue',
      title: 'Ở sảnh ký túc xá — "Cuối tuần có chợ đồ cũ đấy!"',
      lines: [
        { who: 'マルコ', role: 'b', text: 'アンナさん、これ、{知|し}ってる？ {今度|こんど}の{土曜日|どようび}、さくら{公園|こうえん}でフリーマーケットがあるそうですよ。', ro: 'Anna-san, kore, shitteru? Kondo no doyoubi, Sakura kouen de furii maaketto ga aru sou desu yo.', vi: 'Anna, cái này cậu biết chưa? Nghe nói thứ Bảy tới ở công viên Sakura có chợ đồ cũ đấy.' },
        { who: 'アンナ', role: 'c', text: 'へえ。フリーマーケットですか。', ro: 'Hee. Furii maaketto desu ka.', vi: 'Ồ. Chợ đồ cũ à?' },
        { who: 'マルコ', role: 'b', text: 'ええ。この{雑誌|ざっし}を{見|み}てください。Tシャツは{150円|ひゃくごじゅうえん}、{本|ほん}は{50円|ごじゅうえん}だそうです。', ro: 'Ee. Kono zasshi o mite kudasai. Tii shatsu wa hyakugojuu en, hon wa gojuu en da sou desu.', vi: 'Ừ. Cậu xem tạp chí này đi. Nghe nói áo phông 150 yên, sách 50 yên thôi.' },
        { who: 'アンナ', role: 'c', text: '{安|やす}いですね。', ro: 'Yasui desu ne.', vi: 'Rẻ nhỉ.' },
        { who: 'マルコ', role: 'b', text: 'よかったら、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Yokattara, issho ni ikimasen ka.', vi: 'Nếu được thì đi cùng mình không?' },
        { who: 'アンナ', role: 'c', text: 'いいですね。{行|い}きましょう。ワンさんも{誘|さそ}いませんか。', ro: 'Ii desu ne. Ikimashou. Wan-san mo sasoimasen ka.', vi: 'Hay đấy. Đi thôi. Rủ cả Wang nữa nhé?' },
        { who: 'マルコ', role: 'b', text: 'そうですね。{電話|でんわ}します。', ro: 'Sou desu ne. Denwa shimasu.', vi: 'Ừ nhỉ. Để mình gọi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Gọi điện rủ thêm — và một tin "nghe nói"',
      lines: [
        { who: 'アンナ', role: 'c', text: 'もしもし、ワンさん？ {土曜日|どようび}、さくら{公園|こうえん}のフリーマーケットに{一緒|いっしょ}に{行|い}きませんか。', ro: 'Moshimoshi, Wan-san? Doyoubi, Sakura kouen no furii maaketto ni issho ni ikimasen ka.', vi: 'A lô, Wang à? Thứ Bảy đi chợ đồ cũ ở công viên Sakura với bọn mình không?' },
        { who: 'ワン', role: 'a', text: 'すみません。{土曜日|どようび}はちょっと……。{恋人|こいびと}とデートなんです。', ro: 'Sumimasen. Doyoubi wa chotto……. Koibito to deeto na n desu.', vi: 'Xin lỗi. Thứ Bảy thì hơi… Mình có hẹn với người yêu.' },
        { who: 'アンナ', role: 'c', text: 'そうですか。{残念|ざんねん}ですね。あ、{知|し}っていますか。マルコさんにも{恋人|こいびと}ができたそうですよ。', ro: 'Sou desu ka. Zannen desu ne. A, shitte imasu ka. Maruko-san ni mo koibito ga dekita sou desu yo.', vi: 'Vậy à. Tiếc nhỉ. À, cậu biết chưa? Nghe nói Marco cũng có người yêu rồi đấy.' },
        { who: 'ワン', role: 'a', text: 'えっ？ {本当|ほんとう}ですか。{知|し}りませんでした。', ro: 'E? Hontou desu ka. Shirimasen deshita.', vi: 'Hả? Thật à? Mình không biết đấy.' },
        { who: 'アンナ', role: 'c', text: '{同|おな}じクラスの{人|ひと}だそうです。', ro: 'Onaji kurasu no hito da sou desu.', vi: 'Nghe nói là người cùng lớp.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Tin trên thời sự — "Ca sĩ bị thương vì tai nạn xe buýt"',
      lines: [
        { who: 'パク', role: 'a', text: 'メアリーさん、{今朝|けさ}のニュースを{見|み}ましたか。', ro: 'Mearii-san, kesa no nyuusu o mimashita ka.', vi: 'Mary, cậu xem thời sự sáng nay chưa?' },
        { who: 'メアリー', role: 'c', text: 'いいえ、{見|み}ませんでした。どうしたんですか。', ro: 'Iie, mimasen deshita. Dou shita n desu ka.', vi: 'Chưa. Có chuyện gì thế?' },
        { who: 'パク', role: 'a', text: 'ハッピーズのケンがバスの{事故|じこ}でけがをしたそうです。', ro: 'Happiizu no Ken ga basu no jiko de kega o shita sou desu.', vi: 'Nghe nói Ken của nhóm Happies bị thương vì tai nạn xe buýt.' },
        { who: 'メアリー', role: 'c', text: 'えっ、{本当|ほんとう}ですか。{心配|しんぱい}ですね。{来週|らいしゅう}のコンサートはどうなりますか。', ro: 'E, hontou desu ka. Shinpai desu ne. Raishuu no konsaato wa dou narimasu ka.', vi: 'Hả, thật à? Lo quá nhỉ. Buổi hoà nhạc tuần sau thì sao?' },
        { who: 'パク', role: 'a', text: '{中止|ちゅうし}だそうです。でも、けがはあまりひどくないそうですよ。', ro: 'Chuushi da sou desu. Demo, kega wa amari hidoku nai sou desu yo.', vi: 'Nghe nói bị huỷ. Nhưng nghe nói vết thương không nặng lắm đâu.' },
        { who: 'メアリー', role: 'c', text: 'そうですか。よかった。', ro: 'Sou desu ka. Yokatta.', vi: 'Vậy à. May quá.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Tin động đất, bão — nguyên nhân với N で',
      lines: [
        { who: 'ナタポン', role: 'b', text: 'マリヤムさん、ニュースを{見|み}ましたか。{昨日|きのう}の{夜|よる}、{九州|きゅうしゅう}で{大|おお}きい{地震|じしん}があったそうです。', ro: 'Mariyamu-san, nyuusu o mimashita ka. Kinou no yoru, Kyuushuu de ookii jishin ga atta sou desu.', vi: 'Mariyam, cậu xem tin chưa? Nghe nói tối qua ở Kyushu có động đất lớn.' },
        { who: 'マリヤム', role: 'c', text: 'いいえ。{本当|ほんとう}ですか。', ro: 'Iie. Hontou desu ka.', vi: 'Chưa. Thật à?' },
        { who: 'ナタポン', role: 'b', text: 'ええ。{地震|じしん}で{古|ふる}いビルが{倒|たお}れたそうです。{窓|まど}ガラスもたくさん{割|わ}れたそうです。', ro: 'Ee. Jishin de furui biru ga taoreta sou desu. Mado garasu mo takusan wareta sou desu.', vi: 'Ừ. Nghe nói vì động đất mà một toà nhà cũ bị đổ. Kính cửa sổ cũng vỡ nhiều lắm.' },
        { who: 'マリヤム', role: 'c', text: '{怖|こわ}いですね。{死|し}んだ{人|ひと}はいますか。', ro: 'Kowai desu ne. Shinda hito wa imasu ka.', vi: 'Đáng sợ quá. Có ai chết không?' },
        { who: 'ナタポン', role: 'b', text: 'いいえ、{亡|な}くなった{人|ひと}はいないそうです。でも、{台風|たいふう}も{来|く}るそうですから、{心配|しんぱい}です。', ro: 'Iie, nakunatta hito wa inai sou desu. Demo, taifuu mo kuru sou desu kara, shinpai desu.', vi: 'Không, nghe nói không có ai thiệt mạng. Nhưng nghe nói bão cũng sắp đến nên mình lo lắm.' },
        { who: 'マリヤム', role: 'c', text: '{大変|たいへん}ですね。{家族|かぞく}の{人|ひと}たちは{大丈夫|だいじょうぶ}ですか。', ro: 'Taihen desu ne. Kazoku no hitotachi wa daijoubu desu ka.', vi: 'Vất vả quá. Gia đình người ta có sao không?' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{週末|しゅうまつ}、{公園|こうえん}でフリーマーケットがあるそうですよ。', ro: 'Shuumatsu, kouen de furii maaketto ga aru sou desu yo.', vi: 'Nghe nói cuối tuần ở công viên có chợ đồ cũ đấy. — ポイント 119 (V thể thường + そうです)' },
        { en: 'この{店|みせ}のラーメンはおいしいそうです。', ro: 'Kono mise no raamen wa oishii sou desu.', vi: 'Nghe nói mì ramen quán này ngon. — ポイント 119 (イA + そうです)' },
        { en: '{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}だそうです。', ro: 'Raigetsu, bijutsukan wa muryou da sou desu.', vi: 'Nghe nói tháng sau bảo tàng mỹ thuật miễn phí. — ポイント 119 (N + だそうです)' },
        { en: '{先週|せんしゅう}、{西川|にしかわ}さんが{入院|にゅういん}したそうですよ。——えっ？ {心配|しんぱい}ですね。', ro: 'Senshuu, Nishikawa-san ga nyuuin shita sou desu yo. — E? Shinpai desu ne.', vi: 'Nghe nói tuần trước anh Nishikawa nhập viện đấy. — Hả? Lo quá nhỉ.' },
        { en: '{地震|じしん}でビルが{倒|たお}れたそうです。——{本当|ほんとう}ですか。{怖|こわ}いですね。', ro: 'Jishin de biru ga taoreta sou desu. — Hontou desu ka. Kowai desu ne.', vi: 'Nghe nói vì động đất mà toà nhà bị đổ. — Thật à? Đáng sợ nhỉ. — ポイント 124 (N で = vì N)' },
        { en: '{台風|たいふう}で{電車|でんしゃ}が{止|と}まりました。', ro: 'Taifuu de densha ga tomarimashita.', vi: 'Vì bão nên tàu điện đã dừng chạy. — ポイント 124' },
        { en: 'カルロスさんのチームが{試合|しあい}に{勝|か}ったそうです。——よかったですね。', ro: 'Karurosu-san no chiimu ga shiai ni katta sou desu. — Yokatta desu ne.', vi: 'Nghe nói đội của Carlos thắng trận rồi. — Tốt quá nhỉ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Nghe tin xong nói gì? — câu cảm tưởng theo loại tin',
      head: ['Loại tin', 'Câu đáp', 'Romaji', 'Nghĩa'],
      rows: [
        ['Tin vui (thắng, kết hôn, khỏi bệnh)', 'よかったですね。／おめでとうございます。', 'Yokatta desu ne. / Omedetou gozaimasu.', 'Tốt quá nhỉ. / Chúc mừng.'],
        ['Tin lo (ốm, nhập viện, bị thương)', '{心配|しんぱい}ですね。／{大丈夫|だいじょうぶ}ですか。', 'Shinpai desu ne. / Daijoubu desu ka.', 'Lo quá nhỉ. / Có sao không?'],
        ['Tin sợ (động đất, tai nạn)', '{怖|こわ}いですね。', 'Kowai desu ne.', 'Đáng sợ nhỉ.'],
        ['Tin phiền (tàu dừng, bão)', '{大変|たいへん}ですね。／{困|こま}りましたね。', 'Taihen desu ne. / Komarimashita ne.', 'Vất vả / phiền nhỉ.'],
        ['Tin buồn (mất, huỷ)', '{残念|ざんねん}ですね。／{寂|さび}しいですね。', 'Zannen desu ne. / Sabishii desu ne.', 'Tiếc nhỉ. / Buồn nhỉ.'],
        ['Tin lạ, bất ngờ', 'えっ、{本当|ほんとう}ですか。／へえ、{知|し}りませんでした。', 'E, hontou desu ka. / Hee, shirimasen deshita.', 'Hả, thật à? / Ồ, tôi không biết.'],
        ['Tin hay (sự kiện, giảm giá)', 'へえ、いいですね。{行|い}きたいです。', 'Hee, ii desu ne. Ikitai desu.', 'Ồ, hay nhỉ. Tôi muốn đi.'],
      ],
    },

    /* ── ② 雑誌を見て町へ ── */
    { t: 'h', text: '② {雑誌|ざっし}を{見|み}て{町|まち}へ — Xem tạp chí rồi ra phố' },
    {
      t: 'p',
      text: 'Tình huống: vẫn ở sảnh ký túc xá, hai bạn **vừa xem tạp chí vừa bàn**: sở thú mới mở — **nếu đi 3 người thì được quà** (～たら); **nếu có thời gian** thì rủ cả Anna. Cảnh sau ở **quán cà phê**: cuối tuần có chợ đồ cũ — **đi hôm nào? nếu mưa thì sao?** — "**dù mưa** vẫn có" (～ても), "**chắc chắn** có đồ rẻ mà tốt" (きっと～と思います). Cảnh cuối: **lớp dạy nấu ăn** ở Trung tâm Sakura — ở đâu? có miễn phí không? "**Dù không miễn phí** vẫn muốn đi".',
    },
    {
      t: 'dialogue',
      title: 'Sở thú mới — "Nếu đi 3 người thì được quà"',
      lines: [
        { who: 'パク', role: 'a', text: 'ダニエルさん、{見|み}てください。{隣|となり}の{町|まち}に{新|あたら}しい{動物園|どうぶつえん}ができたそうですよ。', ro: 'Danieru-san, mite kudasai. Tonari no machi ni atarashii doubutsuen ga dekita sou desu yo.', vi: 'Daniel, xem này. Nghe nói ở thị trấn bên cạnh mới mở một sở thú đấy.' },
        { who: 'ダニエル', role: 'b', text: 'へえ、{本当|ほんとう}ですか。', ro: 'Hee, hontou desu ka.', vi: 'Ồ, thật à?' },
        { who: 'パク', role: 'a', text: 'ええ。{友達|ともだち}と{3人|さんにん}で{行|い}ったら、プレゼントをもらうことができるそうです。パンダのストラップです。', ro: 'Ee. Tomodachi to sannin de ittara, purezento o morau koto ga dekiru sou desu. Panda no sutorappu desu.', vi: 'Ừ. Nghe nói nếu đi 3 người với bạn thì được nhận quà. Móc đeo hình gấu trúc.' },
        { who: 'ダニエル', role: 'b', text: 'かわいいですね。じゃ、アンナさんも{誘|さそ}いましょう。', ro: 'Kawaii desu ne. Ja, Anna-san mo sasoimashou.', vi: 'Dễ thương nhỉ. Vậy rủ cả Anna đi.' },
        { who: 'パク', role: 'a', text: 'そうですね。アンナさんに{時間|じかん}があったら、{3人|さんにん}で{行|い}きましょう。', ro: 'Sou desu ne. Anna-san ni jikan ga attara, sannin de ikimashou.', vi: 'Ừ nhỉ. Nếu Anna có thời gian thì ba đứa mình đi nhé.' },
        { who: 'ダニエル', role: 'b', text: '{動物園|どうぶつえん}は{何時|なんじ}までですか。', ro: 'Doubutsuen wa nanji made desu ka.', vi: 'Sở thú mở đến mấy giờ?' },
        { who: 'パク', role: 'a', text: '{夕方|ゆうがた}{5時|ごじ}までだそうです。{授業|じゅぎょう}が{終|お}わったら、{急|いそ}いで{行|い}きましょう。', ro: 'Yuugata goji made da sou desu. Jugyou ga owattara, isoide ikimashou.', vi: 'Nghe nói đến 5 giờ chiều. Học xong thì mình đi nhanh nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ở quán cà phê — "Dù mưa vẫn có chứ?"',
      lines: [
        { who: 'アンナ', role: 'c', text: 'ワンさん、{週末|しゅうまつ}、みどり{公園|こうえん}でフリーマーケットがあるそうですよ。', ro: 'Wan-san, shuumatsu, Midori kouen de furii maaketto ga aru sou desu yo.', vi: 'Wang, nghe nói cuối tuần ở công viên Midori có chợ đồ cũ đấy.' },
        { who: 'ワン', role: 'a', text: 'へえ、いいですね。いつですか。', ro: 'Hee, ii desu ne. Itsu desu ka.', vi: 'Ồ, hay nhỉ. Hôm nào?' },
        { who: 'アンナ', role: 'c', text: '{土曜日|どようび}と{日曜日|にちようび}です。きっと{安|やす}くていいものがあると{思|おも}います。もしよかったら、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Doyoubi to nichiyoubi desu. Kitto yasukute ii mono ga aru to omoimasu. Moshi yokattara, issho ni ikimasen ka.', vi: 'Thứ Bảy và Chủ nhật. Mình nghĩ chắc chắn sẽ có đồ rẻ mà tốt. Nếu được thì đi cùng mình không?' },
        { who: 'ワン', role: 'a', text: 'いいですね。でも、{土曜日|どようび}は{雨|あめ}だそうですよ。{雨|あめ}が{降|ふ}っても、ありますか。', ro: 'Ii desu ne. Demo, doyoubi wa ame da sou desu yo. Ame ga futte mo, arimasu ka.', vi: 'Hay đấy. Nhưng nghe nói thứ Bảy trời mưa đấy. Dù mưa thì vẫn có chứ?' },
        { who: 'アンナ', role: 'c', text: 'いいえ、{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}だそうです。', ro: 'Iie, ame ga futtara, chuushi da sou desu.', vi: 'Không, nghe nói nếu mưa thì huỷ.' },
        { who: 'ワン', role: 'a', text: 'じゃ、{日曜日|にちようび}はどうですか。たぶん{晴|は}れると{思|おも}います。', ro: 'Ja, nichiyoubi wa dou desu ka. Tabun hareru to omoimasu.', vi: 'Vậy Chủ nhật thì sao? Mình nghĩ chắc là trời nắng.' },
        { who: 'アンナ', role: 'c', text: 'そうですね。でも、{日曜日|にちようび}は{人|ひと}が{多|おお}いと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。', ro: 'Sou desu ne. Demo, nichiyoubi wa hito ga ooi to omoimasu ga, daijoubu desu ka.', vi: 'Ừ nhỉ. Nhưng mình nghĩ Chủ nhật sẽ đông người, cậu có ổn không?' },
        { who: 'ワン', role: 'a', text: '{大丈夫|だいじょうぶ}です。{人|ひと}が{多|おお}くても、{行|い}きたいです。', ro: 'Daijoubu desu. Hito ga ookute mo, ikitai desu.', vi: 'Không sao. Dù đông người mình vẫn muốn đi.' },
        { who: 'アンナ', role: 'c', text: 'じゃ、{日曜日|にちようび}の{朝|あさ}、{早|はや}く{行|い}きましょう。', ro: 'Ja, nichiyoubi no asa, hayaku ikimashou.', vi: 'Vậy sáng Chủ nhật đi sớm nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Lớp nấu ăn — "Dù không miễn phí vẫn muốn đi"',
      lines: [
        { who: 'メアリー', role: 'c', text: 'パクさん、さくらセンターで{料理教室|りょうりきょうしつ}があるそうですよ。{日本料理|にほんりょうり}を{作|つく}るそうです。', ro: 'Paku-san, Sakura sentaa de ryouri kyoushitsu ga aru sou desu yo. Nihon ryouri o tsukuru sou desu.', vi: 'Park, nghe nói ở Trung tâm Sakura có lớp dạy nấu ăn đấy. Nghe nói nấu món Nhật.' },
        { who: 'パク', role: 'a', text: 'へえ。さくらセンターはどこにありますか。', ro: 'Hee. Sakura sentaa wa doko ni arimasu ka.', vi: 'Ồ. Trung tâm Sakura ở đâu?' },
        { who: 'メアリー', role: 'c', text: '{駅|えき}の{前|まえ}です。{駅|えき}から{歩|ある}いて{5分|ごふん}ぐらいだそうです。', ro: 'Eki no mae desu. Eki kara aruite gofun gurai da sou desu.', vi: 'Trước nhà ga. Nghe nói đi bộ từ ga khoảng 5 phút.' },
        { who: 'パク', role: 'a', text: '{無料|むりょう}ですか。', ro: 'Muryou desu ka.', vi: 'Có miễn phí không?' },
        { who: 'メアリー', role: 'c', text: 'いいえ、{無料|むりょう}じゃありません。{千円|せんえん}だそうです。でも、{学生|がくせい}だったら、{500円|ごひゃくえん}だそうですよ。', ro: 'Iie, muryou ja arimasen. Sen en da sou desu. Demo, gakusei dattara, gohyaku en da sou desu yo.', vi: 'Không, không miễn phí. Nghe nói 1.000 yên. Nhưng nếu là sinh viên thì nghe nói chỉ 500 yên đấy.' },
        { who: 'パク', role: 'a', text: '{無料|むりょう}じゃなくても、{行|い}きたいです。{日本料理|にほんりょうり}を{習|なら}いたかったんです。', ro: 'Muryou ja nakute mo, ikitai desu. Nihon ryouri o naraitakatta n desu.', vi: 'Dù không miễn phí mình vẫn muốn đi. Mình vẫn muốn học nấu món Nhật mà.' },
        { who: 'メアリー', role: 'c', text: 'じゃ、{予約|よやく}しましょう。たぶんすぐいっぱいになると{思|おも}いますから。', ro: 'Ja, yoyaku shimashou. Tabun sugu ippai ni naru to omoimasu kara.', vi: 'Vậy mình đặt chỗ đi. Vì mình nghĩ chắc là sẽ kín chỗ ngay.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Jikan ga attara, issho ni ikimasen ka.', vi: 'Nếu có thời gian thì đi cùng tôi không? — ポイント 120' },
        { en: '{1,000円|せんえん}{以上|いじょう}{買|か}ったら、プレゼントがあるそうです。', ro: 'Sen en ijou kattara, purezento ga aru sou desu.', vi: 'Nghe nói nếu mua từ 1.000 yên trở lên thì có quà. — ポイント 120 + 119' },
        { en: '{雨|あめ}だったら、{5|ご}パーセント{引|び}きだそうです。', ro: 'Ame dattara, go paasento biki da sou desu.', vi: 'Nghe nói nếu trời mưa thì giảm 5%. — ポイント 120 (N + だったら)' },
        { en: '{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。', ro: 'Ame ga futte mo, shiai wa arimasu.', vi: 'Dù mưa trận đấu vẫn diễn ra. — ポイント 121' },
        { en: '{人|ひと}が{多|おお}くても、{行|い}きたいです。', ro: 'Hito ga ookute mo, ikitai desu.', vi: 'Dù đông người tôi vẫn muốn đi. — ポイント 121 (イA‑くても)' },
        { en: 'きっとにぎやかで{楽|たの}しいと{思|おも}います。', ro: 'Kitto nigiyaka de tanoshii to omoimasu.', vi: 'Tôi nghĩ chắc chắn sẽ náo nhiệt và vui. — ポイント 123 (きっと = chắc chắn)' },
        { en: '{明日|あした}はたぶん{晴|は}れると{思|おも}います。', ro: 'Ashita wa tabun hareru to omoimasu.', vi: 'Tôi nghĩ ngày mai chắc là nắng. — ポイント 123 (たぶん = có lẽ)' },
        { en: 'もしよかったら、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Moshi yokattara, issho ni ikimasen ka.', vi: 'Nếu bạn thấy được thì đi cùng tôi không? (lời rủ lịch sự)' },
      ],
    },

    /* ── ③ 町を歩いて ── */
    { t: 'h', text: '③ {町|まち}を{歩|ある}いて — Đi dạo ngoài phố' },
    {
      t: 'p',
      text: 'Tình huống 1: ở **quán cà phê**, nhân viên mang nước ra — nhưng **cốc bị bẩn**, cốc kia **bị mẻ**, dĩa **rơi dưới sàn**. Gọi nhân viên và **nói tình trạng** bằng **V て います** (trạng thái đang còn: 汚れています, 割れています, 落ちています). Tình huống 2: **ra phố** — thấy **tàu đang dừng vì tai nạn**, quán **đóng cửa**, **người xếp hàng dài** trước tiệm bánh, **tháp Tokyo sáng đèn** — tả cho bạn nghe rồi **đề nghị cách khác**.',
    },
    {
      t: 'dialogue',
      title: 'Ở quán cà phê — "Cốc bị bẩn ạ"',
      lines: [
        { who: '{店員|てんいん}', role: 'examiner', text: 'いらっしゃいませ。お{水|みず}をどうぞ。メニューを{見|み}たら、{呼|よ}んでください。', ro: 'Irasshaimase. Omizu o douzo. Menyuu o mitara, yonde kudasai.', vi: 'Xin mời quý khách. Mời dùng nước. Xem thực đơn xong xin gọi tôi.' },
        { who: 'メアリー', role: 'c', text: 'あのう、すみません。このコップが{汚|よご}れています。', ro: 'Anou, sumimasen. Kono koppu ga yogorete imasu.', vi: 'Dạ, xin lỗi. Cái cốc này bị bẩn.' },
        { who: '{店員|てんいん}', role: 'examiner', text: 'あっ、すみません。すぐ{新|あたら}しいのを{持|も}ってきます。', ro: 'A, sumimasen. Sugu atarashii no o motte kimasu.', vi: 'Ôi, xin lỗi quý khách. Tôi mang cốc mới đến ngay.' },
        { who: 'ワン', role: 'a', text: 'あ、それから、{私|わたし}のコップも{割|わ}れています。', ro: 'A, sorekara, watashi no koppu mo warete imasu.', vi: 'À, còn nữa, cốc của tôi cũng bị mẻ.' },
        { who: '{店員|てんいん}', role: 'examiner', text: '{本当|ほんとう}にすみません。', ro: 'Hontou ni sumimasen.', vi: 'Thật sự xin lỗi quý khách.' },
        { who: 'メアリー', role: 'c', text: 'あと、{下|した}にフォークが{落|お}ちていますよ。', ro: 'Ato, shita ni fooku ga ochite imasu yo.', vi: 'Còn nữa, dưới sàn có cái dĩa rơi kìa.' },
        { who: '{店員|てんいん}', role: 'examiner', text: 'あっ、ありがとうございます。すぐ{新|あたら}しいフォークを{持|も}ってきます。', ro: 'A, arigatou gozaimasu. Sugu atarashii fooku o motte kimasu.', vi: 'Ôi, cảm ơn quý khách. Tôi mang dĩa mới đến ngay.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ra phố — "Tàu đang dừng kìa!"',
      lines: [
        { who: 'ワン', role: 'a', text: 'あっ、{電車|でんしゃ}が{止|と}まっています。', ro: 'A, densha ga tomatte imasu.', vi: 'Ơ, tàu đang dừng kìa.' },
        { who: 'メアリー', role: 'c', text: '{本当|ほんとう}だ。{事故|じこ}で{止|と}まっているそうですよ。', ro: 'Hontou da. Jiko de tomatte iru sou desu yo.', vi: 'Thật này. Nghe nói dừng vì có tai nạn đấy.' },
        { who: 'ワン', role: 'a', text: 'バスで{行|い}きませんか。', ro: 'Basu de ikimasen ka.', vi: 'Mình đi xe buýt không?' },
        { who: 'メアリー', role: 'c', text: 'そうですね。……あ、でも、バス{停|てい}に{人|ひと}がたくさん{並|なら}んでいますよ。', ro: 'Sou desu ne. …… A, demo, basutei ni hito ga takusan narande imasu yo.', vi: 'Ừ nhỉ. … À, nhưng ở bến xe buýt người xếp hàng đông lắm kìa.' },
        { who: 'ワン', role: 'a', text: 'じゃ、タクシーで{行|い}きましょう。{2人|ふたり}だったら、あまり{高|たか}くないと{思|おも}います。', ro: 'Ja, takushii de ikimashou. Futari dattara, amari takaku nai to omoimasu.', vi: 'Vậy đi taxi đi. Mình nghĩ nếu hai người thì cũng không đắt lắm.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Tối, gần tháp Tokyo — quán đóng cửa, nhà hàng kín chỗ',
      lines: [
        { who: 'メアリー', role: 'c', text: 'あれ？ あのカフェ、{閉|し}まっていますね。', ro: 'Are? Ano kafe, shimatte imasu ne.', vi: 'Ơ? Quán cà phê kia đóng cửa rồi nhỉ.' },
        { who: 'ワン', role: 'a', text: '{電気|でんき}も{消|き}えていますね。{今日|きょう}は{休|やす}みだと{思|おも}います。', ro: 'Denki mo kiete imasu ne. Kyou wa yasumi da to omoimasu.', vi: 'Đèn cũng tắt nhỉ. Mình nghĩ hôm nay họ nghỉ.' },
        { who: 'メアリー', role: 'c', text: 'じゃ、あのレストランはどうですか。', ro: 'Ja, ano resutoran wa dou desu ka.', vi: 'Vậy nhà hàng kia thì sao?' },
        { who: 'ワン', role: 'a', text: 'うーん、とても{混|こ}んでいますよ。{席|せき}が{全然|ぜんぜん}{空|あ}いていません。', ro: 'Uun, totemo konde imasu yo. Seki ga zenzen aite imasen.', vi: 'Ừm, đông lắm đấy. Chẳng còn chỗ trống nào.' },
        { who: 'メアリー', role: 'c', text: 'あっ、{見|み}てください。{東京|とうきょう}タワーの{電気|でんき}がついていますよ。きれいですね。', ro: 'A, mite kudasai. Toukyou tawaa no denki ga tsuite imasu yo. Kirei desu ne.', vi: 'A, nhìn kìa. Tháp Tokyo sáng đèn rồi. Đẹp quá.' },
        { who: 'ワン', role: 'a', text: '{本当|ほんとう}だ。{写真|しゃしん}を{撮|と}りませんか。{写真|しゃしん}を{撮|と}ったら、あそこの{店|みせ}で{食|た}べましょう。あそこはすいていると{思|おも}います。', ro: 'Hontou da. Shashin o torimasen ka. Shashin o tottara, asoko no mise de tabemashou. Asoko wa suite iru to omoimasu.', vi: 'Thật này. Chụp ảnh không? Chụp xong thì mình ăn ở quán đằng kia. Mình nghĩ quán đó vắng.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'あのう、コップが{汚|よご}れています。——あっ、すみません。', ro: 'Anou, koppu ga yogorete imasu. — A, sumimasen.', vi: 'Dạ, cốc bị bẩn ạ. — Ôi, xin lỗi. — ポイント 122' },
        { en: 'あっ、{電車|でんしゃ}が{止|と}まっています。——{本当|ほんとう}だ。', ro: 'A, densha ga tomatte imasu. — Hontou da.', vi: 'Ơ, tàu đang dừng kìa. — Thật này. — ポイント 122 (本当だ = thể thường, nói với bạn)' },
        { en: '{入|い}り{口|ぐち}に{人|ひと}がたくさん{並|なら}んでいます。', ro: 'Iriguchi ni hito ga takusan narande imasu.', vi: 'Ở cửa vào có rất nhiều người đang xếp hàng. — ポイント 122' },
        { en: 'あの{店|みせ}は{閉|し}まっています。ほかの{店|みせ}へ{行|い}きませんか。', ro: 'Ano mise wa shimatte imasu. Hoka no mise e ikimasen ka.', vi: 'Quán kia đóng cửa rồi. Mình sang quán khác không?' },
        { en: 'レストランが{混|こ}んでいますね。——じゃ、あそこの{店|みせ}はどうですか。すいていますよ。', ro: 'Resutoran ga konde imasu ne. — Ja, asoko no mise wa dou desu ka. Suite imasu yo.', vi: 'Nhà hàng đông nhỉ. — Vậy quán đằng kia thì sao? Vắng đấy.' },
        { en: '{事故|じこ}で{電車|でんしゃ}が{止|と}まっています。', ro: 'Jiko de densha ga tomatte imasu.', vi: 'Do tai nạn, tàu điện đang dừng. — ポイント 124 + 122 (câu của sách)' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {私|わたし}のニュース (Tin của tôi)' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): ダニエル kể **"tin lớn" của mình** — lần đầu dự **cuộc thi hát karaoke** của thành phố: hồi hộp, hát đến cuối, được **giải 2**; hội trường đông người, khán giả cười và gật gù. Hai câu hỏi bên lề của sách — **あなたのビッグニュースは{何|なん}ですか** và **どうでしたか** — chính là câu cô sẽ hỏi. Đọc to, rồi viết tin của bạn theo khung bên dưới.',
    },
    {
      t: 'passage',
      title: '{私|わたし}のニュース',
      paras: [
        { text: '{9月|くがつ}{20日|はつか}、{私|わたし}は{町|まち}のカラオケ{大会|たいかい}に{出|で}ました。{日本語|にほんご}の{歌|うた}を{歌|うた}いました。{大会|たいかい}の{日|ひ}、{会場|かいじょう}のホールには{人|ひと}がたくさん{集|あつ}まっていました。{私|わたし}はとても{緊張|きんちょう}して、{手|て}が{冷|つめ}たくなりました。でも、{最後|さいご}まで{歌|うた}うことができました。{歌|うた}っているとき、お{客|きゃく}さんは「うん、うん」とうなずいたり、{笑|わら}ったりしていました。そして、なんと{2位|にい}になりました！ プレゼントは{大|おお}きいケーキでした。{寮|りょう}の{友達|ともだち}とみんなで{食|た}べました。とてもいい{思|おも}い{出|で}になりました。{来年|らいねん}もまた{出|で}たいです。{皆|みな}さんも、もし{時間|じかん}があったら、{出|で}てください。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{町|まち}のカラオケ{大会|たいかい}に{出|で}ました。', ro: 'Watashi wa machi no karaoke taikai ni demashita.', vi: 'Tôi đã tham gia cuộc thi karaoke của thành phố. (～大会に出ます = dự cuộc thi)' },
        { en: '{会場|かいじょう}のホールには{人|ひと}がたくさん{集|あつ}まっていました。', ro: 'Kaijou no hooru ni wa hito ga takusan atsumatte imashita.', vi: 'Ở hội trường nơi tổ chức đã có rất nhiều người tụ tập. — ポイント 122 (quá khứ: ていました)' },
        { en: '{私|わたし}はとても{緊張|きんちょう}して、{手|て}が{冷|つめ}たくなりました。', ro: 'Watashi wa totemo kinchou shite, te ga tsumetaku narimashita.', vi: 'Tôi rất hồi hộp, tay lạnh ngắt. — ポイント 95 (くなりました)' },
        { en: 'でも、{最後|さいご}まで{歌|うた}うことができました。', ro: 'Demo, saigo made utau koto ga dekimashita.', vi: 'Nhưng tôi đã hát được đến cuối. — ポイント 82' },
        { en: 'お{客|きゃく}さんはうなずいたり、{笑|わら}ったりしていました。', ro: 'Okyakusan wa unazuitari, warattari shite imashita.', vi: 'Khán giả lúc thì gật gù, lúc thì cười. — ポイント 99' },
        { en: 'そして、なんと{2位|にい}になりました！', ro: 'Soshite, nanto ni i ni narimashita!', vi: 'Và thật không ngờ, tôi được giải nhì! (なんと = thật bất ngờ là)' },
        { en: 'とてもいい{思|おも}い{出|で}になりました。', ro: 'Totemo ii omoide ni narimashita.', vi: 'Đó đã trở thành một kỷ niệm rất đẹp.' },
      ],
    },
    {
      t: 'note',
      title: 'Viết "Tin của tôi" theo khung (trả lời 2 câu hỏi bên lề của sách)',
      items: [
        '**あなたのビッグニュースは{何|なん}ですか** → ＿{月|がつ}＿{日|にち}、{私|わたし}は＿に{出|で}ました／＿へ{行|い}きました／＿をしました。',
        '**Kể lúc đó thế nào** → {会場|かいじょう}には{人|ひと}がたくさん{集|あつ}まっていました (ポイント 122) · とても{緊張|きんちょう}しました · {最後|さいご}まで＿ことができました.',
        '**Kết quả** → なんと＿{位|い}になりました／{勝|か}ちました／{負|ま}けましたが、…',
        '**どうでしたか** → とても{楽|たの}しかったです · いい{思|おも}い{出|で}になりました.',
        'Từ ở chân bài đọc của sách (đều có trong mục Từ vựng · G): スピーチコンテスト, ～{位|い}, {最後|さいご}, ホール, {思|おも}い{出|で}, うなずきます, {緊張|きんちょう}します, {笑|わら}います, なんと.',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Làm tờ báo / tạp chí của riêng bạn' },
    {
      t: 'p',
      text: 'Nhiệm vụ như sách: ① cả nhóm **bàn xem muốn viết bài gì** (sự kiện ở thành phố bạn sống, quán bạn giới thiệu, tin gần đây xem được, **3 tin lớn** của bạn); ② **viết bài**; ③ **đọc tờ báo** đã làm xong và nói chuyện về nó. Dưới đây là câu hỏi gợi ý của sách viết thành câu hỏi – trả lời, và một **tờ báo mẫu** 3 bài ngắn — mỗi bài dùng điểm ngữ pháp của Bài 15.',
    },
    {
      t: 'table',
      caption: 'Câu hỏi gợi ý của sách → trả lời mẫu',
      head: ['Câu hỏi', 'Romaji', 'Trả lời mẫu'],
      rows: [
        ['あなたが{住|す}んでいる{町|まち}にはどんなイベントがありますか。', 'Anata ga sunde iru machi ni wa donna ibento ga arimasu ka.', '{8月|はちがつ}に{大|おお}きい{花火大会|はなびたいかい}があります。{雨|あめ}が{降|ふ}っても、{中止|ちゅうし}になりません。'],
        ['あなたのおすすめの{店|みせ}はどこですか。', 'Anata no osusume no mise wa doko desu ka.', '{駅|えき}の{前|まえ}のフォーの{店|みせ}です。{安|やす}くておいしいです。{昼|ひる}はいつも{混|こ}んでいます。'],
        ['{最近|さいきん}どんなニュースを{見|み}ましたか。', 'Saikin donna nyuusu o mimashita ka.', '{台風|たいふう}で{木|き}がたくさん{倒|たお}れたそうです。{怖|こわ}かったです。'],
        ['あなたの{3大|さんだい}ニュースは{何|なん}ですか。', 'Anata no sandai nyuusu wa nan desu ka.', '①{日本語|にほんご}の{勉強|べんきょう}を{始|はじ}めました ②{姉|あね}が{結婚|けっこん}しました ③サッカーの{試合|しあい}に{勝|か}ちました。'],
      ],
    },
    {
      t: 'passage',
      title: 'Tờ báo mẫu —「ミンの{新聞|しんぶん}」',
      intro: 'Ba bài ngắn của một bạn sinh viên Việt (ミン) — thay bằng tin thật của bạn.',
      paras: [
        { label: 'イベント', text: '{来週|らいしゅう}の{日曜日|にちようび}、ホアンキエム{湖|こ}の{周|まわ}りで{大|おお}きいお{祭|まつ}りがあるそうです。{夕方|ゆうがた}から{音楽|おんがく}のコンサートもあるそうです。{雨|あめ}が{降|ふ}っても、コンサートはあります。きっとにぎやかで{楽|たの}しいと{思|おも}います。{時間|じかん}があったら、ぜひ{行|い}ってください。' },
        { label: 'おすすめの店', text: '{学校|がっこう}の{近|ちか}くに{新|あたら}しいカフェができました。コーヒーがとてもおいしいです。{学生|がくせい}だったら、{10|じゅっ}パーセント{引|び}きです。{昼|ひる}はいつも{混|こ}んでいますから、{夕方|ゆうがた}に{行|い}ったほうがいいです。' },
        { label: 'ニュース', text: '{先週|せんしゅう}、{台風|たいふう}で{町|まち}の{木|き}がたくさん{倒|たお}れました。{電車|でんしゃ}も{半日|はんにち}{止|と}まっていました。でも、{亡|な}くなった{人|ひと}はいなかったそうです。よかったです。' },
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 48 mục của trang ことば p.267: chủ đề 1 (27) = A 13 + B 14 · chủ đề 2 (14) = C 14 ·
 * chủ đề 3 (7) = D 7 · + E 10 từ ở chân bài đọc / bài nghe (p.266, p.268). */

const TU_VUNG: Lesson = {
  id: 'b15-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 48 từ của trang ことば Bài 15 (+10 từ bài đọc, bài nghe)',
  goal: 'Thuộc đủ 48 từ của Bài 15 (tin tức, thời tiết, sự kiện, điều kiện, cảnh ngoài phố) cùng 10 từ của bài đọc – bài nghe, và dùng được mỗi từ trong một câu kể tin, rủ bạn hoặc tả cảnh.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **48 từ** trên trang ことば (p.267), giữ đúng 3 chủ đề của sách: **これ、{知|し}ってる？** (27 từ — nhóm A, B), **{雑誌|ざっし}を{見|み}て{町|まち}へ** (14 từ — nhóm C), **{町|まち}を{歩|ある}いて** (7 từ — nhóm D). Nhóm E là **10 từ ở chân bài đọc 「{私|わたし}のニュース」 và bài nghe cuối** — sách in riêng nhưng cô vẫn có thể hỏi, nên cũng có thẻ đầy đủ. Số **1 / 2 / 3** sau động từ = nhóm động từ. Câu ví dụ chỉ dùng từ Bài 1–15. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa, tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết theo đúng chữ kana: {台風|たいふう} → **taifuu**, {中止|ちゅうし} → chuushi, {本当|ほんとう} → **hontou**, {無料|むりょう} → muryou, {夕方|ゆうがた} → yuugata, {入院|にゅういん} → nyuuin, フリーマーケット → **furii maaketto**, パーセント → paasento.',
        'Âm ngắt っ viết đôi phụ âm: {結婚|けっこん} → **kekkon**, きっと → **kitto**, ストラップ → sutorappu, チーム → chiimu.',
        '**ん** trước nguyên âm hoặc y viết thêm dấu nháy để khỏi đọc nhầm: {店員|てんいん} → **ten\'in**, {金曜日|きんようび} → kin\'youbi; còn {心配|しんぱい} → shinpai, {緊張|きんちょう} → kinchou viết bình thường.',
        '**～そうです** viết tách: {来|く}るそうです → **kuru sou desu**; {中止|ちゅうし}だそうです → chuushi da sou desu.',
      ],
    },

    { t: 'h', text: 'A. Tin tức, thời tiết, sự kiện — danh từ (13 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: 'ガラス', pos: 'danh từ', ipa: 'garasu', vi: 'kính, thuỷ tinh (窓ガラス = kính cửa sổ)', ex: '{地震|じしん}で{窓|まど}ガラスが{割|わ}れました。', exRo: 'Jishin de mado garasu ga waremashita.', exVi: 'Vì động đất mà kính cửa sổ bị vỡ.' },
        { w: '{曇|くも}り', pos: 'danh từ', ipa: 'kumori', vi: 'trời nhiều mây, trời râm', ex: '{明日|あした}は{曇|くも}りだそうです。', exRo: 'Ashita wa kumori da sou desu.', exVi: 'Nghe nói ngày mai trời nhiều mây.' },
        { w: '{台風|たいふう}', pos: 'danh từ', ipa: 'taifuu', vi: 'bão (台風が来ます = bão đến)', ex: '{明日|あした}、{台風|たいふう}が{来|く}るそうです。', exRo: 'Ashita, taifuu ga kuru sou desu.', exVi: 'Nghe nói ngày mai bão đến. (câu của ポイント 119)' },
        { w: '{地震|じしん}', pos: 'danh từ', ipa: 'jishin', vi: 'động đất (地震があります = có động đất)', ex: '{昨日|きのう}の{夜|よる}、{大|おお}きい{地震|じしん}がありました。', exRo: 'Kinou no yoru, ookii jishin ga arimashita.', exVi: 'Tối qua có một trận động đất lớn.' },
        { w: '{事故|じこ}', pos: 'danh từ', ipa: 'jiko', vi: 'tai nạn, sự cố (事故で = vì tai nạn)', ex: '{事故|じこ}で{電車|でんしゃ}が{止|と}まっています。', exRo: 'Jiko de densha ga tomatte imasu.', exVi: 'Vì có sự cố nên tàu điện đang dừng. (câu của ポイント 124)' },
        { w: '～{大会|たいかい}', pos: 'hậu tố', ipa: '~taikai', vi: 'đại hội, cuộc thi, lễ hội lớn (花火大会 = lễ hội pháo hoa)', ex: '{横浜|よこはま}で{花火大会|はなびたいかい}があるそうですよ。', exRo: 'Yokohama de hanabi taikai ga aru sou desu yo.', exVi: 'Nghe nói ở Yokohama có lễ hội pháo hoa đấy.' },
        { w: 'チーム', pos: 'danh từ', ipa: 'chiimu', vi: 'đội (thể thao)', ex: '{私|わたし}の{大学|だいがく}のチームが{試合|しあい}に{勝|か}ちました。', exRo: 'Watashi no daigaku no chiimu ga shiai ni kachimashita.', exVi: 'Đội của trường đại học tôi đã thắng trận.' },
        { w: '{中止|ちゅうし}', pos: 'danh từ', ipa: 'chuushi', vi: 'huỷ bỏ, đình chỉ (中止です／中止になります)', ex: '{雨|あめ}だったら、{試合|しあい}は{中止|ちゅうし}です。', exRo: 'Ame dattara, shiai wa chuushi desu.', exVi: 'Nếu mưa thì trận đấu bị huỷ. (câu của ポイント 120)' },
        { w: 'フリーマーケット', pos: 'danh từ', ipa: 'furii maaketto', vi: 'chợ đồ cũ, chợ trời (flea market)', ex: 'フリーマーケットで{古|ふる}い{本|ほん}を{50円|ごじゅうえん}で{買|か}いました。', exRo: 'Furii maaketto de furui hon o gojuu en de kaimashita.', exVi: 'Tôi mua sách cũ ở chợ đồ cũ với giá 50 yên.' },
        { w: '{本当|ほんとう}', pos: 'danh từ / ナA', ipa: 'hontou', vi: 'sự thật, thật (本当ですか = thật à? · 本当だ = thật này — nói với bạn)', ex: 'えっ、{本当|ほんとう}ですか。{知|し}りませんでした。', exRo: 'E, hontou desu ka. Shirimasen deshita.', exVi: 'Hả, thật à? Tôi không biết đấy.' },
        { w: '{昔|むかし}', pos: 'danh từ', ipa: 'mukashi', vi: 'ngày xưa, hồi trước', ex: '{昔|むかし}、この{町|まち}には{大|おお}きいお{祭|まつ}りがあったそうです。', exRo: 'Mukashi, kono machi ni wa ookii omatsuri ga atta sou desu.', exVi: 'Nghe nói ngày xưa thị trấn này có một lễ hội lớn.' },
        { w: '{無料|むりょう}', pos: 'danh từ', ipa: 'muryou', vi: 'miễn phí', ex: '{来月|らいげつ}、ほしの{美術館|びじゅつかん}は{無料|むりょう}だそうです。', exRo: 'Raigetsu, Hoshino bijutsukan wa muryou da sou desu.', exVi: 'Nghe nói tháng sau bảo tàng mỹ thuật Hoshino miễn phí. (câu của ポイント 119)' },
        { w: '{夕方|ゆうがた}', pos: 'danh từ', ipa: 'yuugata', vi: 'chiều tối, lúc chạng vạng (khoảng 4–6 giờ chiều)', ex: '{夕方|ゆうがた}から{雨|あめ}が{降|ふ}るそうです。', exRo: 'Yuugata kara ame ga furu sou desu.', exVi: 'Nghe nói từ chiều tối trời sẽ mưa.' },
      ],
    },

    { t: 'h', text: 'B. Tin tức — động từ, tính từ (14 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{死|し}にます〔{死|し}ぬ〕1', pos: 'động từ nhóm 1', ipa: 'shinimasu (shinu)', vi: 'chết (nói về người: thẳng thắn; về động vật: bình thường)', ex: '{動物園|どうぶつえん}のゾウが{死|し}んだそうです。', exRo: 'Doubutsuen no zou ga shinda sou desu.', exVi: 'Nghe nói con voi ở sở thú đã chết.' },
        { w: '{亡|な}くなります〔{亡|な}くなる〕1', pos: 'động từ nhóm 1', ipa: 'nakunarimasu (nakunaru)', vi: 'qua đời, mất (cách nói lịch sự về người)', ex: '{有名|ゆうめい}な{歌手|かしゅ}が{亡|な}くなったそうです。', exRo: 'Yuumei na kashu ga nakunatta sou desu.', exVi: 'Nghe nói một ca sĩ nổi tiếng đã qua đời.' },
        { w: '{止|と}まります〔{止|と}まる〕1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'tomarimasu (tomaru)', vi: '(tàu, xe, máy) dừng lại — cặp với 止めます (dừng cái gì, Bài 14)', ex: '{台風|たいふう}で{電車|でんしゃ}が{止|と}まりました。', exRo: 'Taifuu de densha ga tomarimashita.', exVi: 'Vì bão nên tàu điện đã dừng.' },
        { w: '{始|はじ}まります〔{始|はじ}まる〕1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'hajimarimasu (hajimaru)', vi: '(việc gì đó) bắt đầu — cặp với 始めます (bắt đầu việc gì)', ex: 'あさってから{相撲|すもう}が{始|はじ}まります。', exRo: 'Asatte kara sumou ga hajimarimasu.', exVi: 'Từ ngày kia giải sumo bắt đầu.' },
        { w: '{降|ふ}ります〔{降|ふ}る〕1', pos: 'động từ nhóm 1', ipa: 'furimasu (furu)', vi: '(mưa, tuyết) rơi — ⚠ khác 降ります (おります, xuống xe, nhóm 2)', ex: '{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。', exRo: 'Ame ga futte mo, shiai wa arimasu.', exVi: 'Dù mưa trận đấu vẫn diễn ra. (câu của ポイント 121)' },
        { w: '{勝|か}ちます〔{勝|か}つ〕1', pos: 'động từ nhóm 1', ipa: 'kachimasu (katsu)', vi: 'thắng (N に勝ちます = thắng N)', ex: 'マルコさんのチームは{試合|しあい}に{勝|か}ったそうです。', exRo: 'Maruko-san no chiimu wa shiai ni katta sou desu.', exVi: 'Nghe nói đội của Marco đã thắng trận.' },
        { w: '{負|ま}けます〔{負|ま}ける〕2', pos: 'động từ nhóm 2', ipa: 'makemasu (makeru)', vi: 'thua (N に負けます = thua N)', ex: '{昨日|きのう}の{試合|しあい}は{1|いち}{対|たい}{2|に}で{負|ま}けました。', exRo: 'Kinou no shiai wa ichi tai ni de makemashita.', exVi: 'Trận hôm qua thua 1–2.' },
        { w: '{倒|たお}れます〔{倒|たお}れる〕2', pos: 'động từ nhóm 2', ipa: 'taoremasu (taoreru)', vi: '(nhà, cây) đổ, sập; (người) ngã quỵ', ex: '{地震|じしん}でビルが{倒|たお}れたそうです。', exRo: 'Jishin de biru ga taoreta sou desu.', exVi: 'Nghe nói vì động đất mà toà nhà bị sập.' },
        { w: 'できます〔できる〕2', pos: 'động từ nhóm 2', ipa: 'dekimasu (dekiru)', vi: '(được) xây xong, mở ra, hình thành (新しい店ができます) — nghĩa MỚI, khác "có thể" (Bài 9)', ex: '{駅|えき}の{前|まえ}に{新|あたら}しい{店|みせ}ができました。', exRo: 'Eki no mae ni atarashii mise ga dekimashita.', exVi: 'Trước ga mới mở một cửa hàng.' },
        { w: '{割|わ}れます〔{割|わ}れる〕2', pos: 'động từ nhóm 2 (tự động từ)', ipa: 'waremasu (wareru)', vi: '(cốc, kính, đĩa) vỡ, nứt', ex: 'このコップは{割|わ}れていますよ。', exRo: 'Kono koppu wa warete imasu yo.', exVi: 'Cái cốc này bị vỡ (nứt) rồi đấy.' },
        { w: '{結婚|けっこん}します〔{結婚|けっこん}する〕3', pos: 'động từ nhóm 3', ipa: 'kekkon shimasu (kekkon suru)', vi: 'kết hôn (N と結婚します)', ex: 'カルロスさんは{来月|らいげつ}{結婚|けっこん}するそうです。', exRo: 'Karurosu-san wa raigetsu kekkon suru sou desu.', exVi: 'Nghe nói tháng sau Carlos kết hôn.' },
        { w: '{入院|にゅういん}します〔{入院|にゅういん}する〕3', pos: 'động từ nhóm 3', ipa: 'nyuuin shimasu (nyuuin suru)', vi: 'nhập viện (↔ 退院します = ra viện)', ex: '{先週|せんしゅう}、{西川|にしかわ}さんが{入院|にゅういん}したそうです。', exRo: 'Senshuu, Nishikawa-san ga nyuuin shita sou desu.', exVi: 'Nghe nói tuần trước anh Nishikawa nhập viện.' },
        { w: '{怖|こわ}い', pos: 'tính từ đuôi い', ipa: 'kowai', vi: 'sợ, đáng sợ', ex: '{地震|じしん}は{怖|こわ}いですね。', exRo: 'Jishin wa kowai desu ne.', exVi: 'Động đất đáng sợ nhỉ.' },
        { w: '{心配|しんぱい}（な）', pos: 'tính từ đuôi な / danh từ', ipa: 'shinpai (na)', vi: 'lo lắng (心配です · 心配しないでください = đừng lo)', ex: 'えっ？ {入院|にゅういん}したんですか。{心配|しんぱい}ですね。', exRo: 'E? Nyuuin shita n desu ka. Shinpai desu ne.', exVi: 'Hả? Nhập viện à? Lo quá nhỉ.' },
      ],
    },

    { t: 'h', text: 'C. Xem tạp chí, bàn kế hoạch (14 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{風|かぜ}', pos: 'danh từ', ipa: 'kaze', vi: 'gió (風が強い = gió mạnh) — ⚠ khác {風邪|かぜ} (cảm, Bài 12), cùng đọc かぜ', ex: '{今日|きょう}は{風|かぜ}が{強|つよ}いですね。', exRo: 'Kyou wa kaze ga tsuyoi desu ne.', exVi: 'Hôm nay gió mạnh nhỉ.' },
        { w: 'ストラップ', pos: 'danh từ', ipa: 'sutorappu', vi: 'dây đeo, móc treo (điện thoại, túi)', ex: '{3人|さんにん}で{行|い}ったら、ストラップをもらうことができます。', exRo: 'Sannin de ittara, sutorappu o morau koto ga dekimasu.', exVi: 'Nếu đi 3 người thì được nhận móc đeo.' },
        { w: '{席|せき}', pos: 'danh từ', ipa: 'seki', vi: 'chỗ ngồi, ghế', ex: 'もういい{席|せき}がないと{思|おも}います。', exRo: 'Mou ii seki ga nai to omoimasu.', exVi: 'Tôi nghĩ không còn chỗ ngồi đẹp nữa đâu.' },
        { w: '{急|いそ}ぎます〔{急|いそ}ぐ〕1', pos: 'động từ nhóm 1', ipa: 'isogimasu (isogu)', vi: 'vội, gấp (急いでください = nhanh lên)', ex: 'まだ{時間|じかん}がありますから、{急|いそ}がなくてもいいですよ。', exRo: 'Mada jikan ga arimasu kara, isoganakute mo ii desu yo.', exVi: 'Vẫn còn thời gian nên không cần vội đâu.' },
        { w: '{混|こ}みます〔{混|こ}む〕1', pos: 'động từ nhóm 1', ipa: 'komimasu (komu)', vi: 'đông, chật (hay dùng 混んでいます = đang đông)', ex: '{週末|しゅうまつ}はレストランがとても{混|こ}んでいます。', exRo: 'Shuumatsu wa resutoran ga totemo konde imasu.', exVi: 'Cuối tuần nhà hàng rất đông.' },
        { w: '{間|ま}に{合|あ}います〔{間|ま}に{合|あ}う〕1', pos: 'động từ nhóm 1', ipa: 'ma ni aimasu (ma ni au)', vi: 'kịp (giờ) (N に間に合います = kịp N)', ex: '{急|いそ}いだら、{電車|でんしゃ}に{間|ま}に{合|あ}うと{思|おも}います。', exRo: 'Isoidara, densha ni ma ni au to omoimasu.', exVi: 'Tôi nghĩ nếu nhanh lên thì sẽ kịp tàu.' },
        { w: 'やみます〔やむ〕1', pos: 'động từ nhóm 1', ipa: 'yamimasu (yamu)', vi: '(mưa, gió) tạnh, ngừng', ex: '{雨|あめ}がやんだら、{出|で}かけましょう。', exRo: 'Ame ga yandara, dekakemashou.', exVi: 'Mưa tạnh thì mình ra ngoài nhé.' },
        { w: '{晴|は}れます〔{晴|は}れる〕2', pos: 'động từ nhóm 2', ipa: 'haremasu (hareru)', vi: '(trời) nắng, quang đãng', ex: '{明日|あした}はきっと{晴|は}れると{思|おも}います。', exRo: 'Ashita wa kitto hareru to omoimasu.', exVi: 'Tôi nghĩ mai chắc chắn trời nắng.' },
        { w: '～パーセント', pos: 'hậu tố (đếm)', ipa: '~paasento', vi: '～ phần trăm (%)', ex: '{学生|がくせい}は{10|じゅっ}パーセント{安|やす}くなります。', exRo: 'Gakusei wa juppaasento yasuku narimasu.', exVi: 'Sinh viên được rẻ hơn 10%.' },
        { w: '～{引|び}き', pos: 'hậu tố', ipa: '~biki', vi: 'giảm ～ (10パーセント引き = giảm 10%)', ex: '{雨|あめ}の{日|ひ}は{5|ご}パーセント{引|び}きだそうです。', exRo: 'Ame no hi wa go paasento biki da sou desu.', exVi: 'Nghe nói ngày mưa giảm 5%.' },
        { w: '{強|つよ}い', pos: 'tính từ đuôi い', ipa: 'tsuyoi', vi: 'mạnh (gió mạnh, đội mạnh) ↔ 弱い (yếu)', ex: '{風|かぜ}が{強|つよ}かったら、{花火大会|はなびたいかい}は{中止|ちゅうし}です。', exRo: 'Kaze ga tsuyokattara, hanabi taikai wa chuushi desu.', exVi: 'Nếu gió mạnh thì lễ hội pháo hoa bị huỷ.' },
        { w: 'きっと', pos: 'phó từ', ipa: 'kitto', vi: 'chắc chắn (người nói tin mạnh) — đi với ～と思います', ex: 'あの{店|みせ}のラーメンはきっとおいしいと{思|おも}います。', exRo: 'Ano mise no raamen wa kitto oishii to omoimasu.', exVi: 'Tôi nghĩ mì ramen quán đó chắc chắn ngon. (câu của ポイント 123)' },
        { w: 'たぶん', pos: 'phó từ', ipa: 'tabun', vi: 'có lẽ, chắc là (ít chắc hơn きっと)', ex: 'カルロスさんはたぶんパーティーに{来|こ}ないと{思|おも}います。', exRo: 'Karurosu-san wa tabun paatii ni konai to omoimasu.', exVi: 'Tôi nghĩ có lẽ Carlos không đến bữa tiệc. (câu của ポイント 123)' },
        { w: 'もし', pos: 'phó từ', ipa: 'moshi', vi: 'nếu (nhấn mạnh giả định, đi với ～たら)', ex: 'もし{雨|あめ}が{降|ふ}ったら、うちで{映画|えいが}を{見|み}ましょう。', exRo: 'Moshi ame ga futtara, uchi de eiga o mimashou.', exVi: 'Nếu trời mưa thì mình xem phim ở nhà nhé.' },
      ],
    },

    { t: 'h', text: 'D. Cảnh ngoài phố — tự động từ (7 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: '{集|あつ}まります〔{集|あつ}まる〕1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'atsumarimasu (atsumaru)', vi: '(người, vật) tập trung, tụ tập — cặp với 集めます (thu gom)', ex: '{駅|えき}の{前|まえ}に{人|ひと}がたくさん{集|あつ}まっています。', exRo: 'Eki no mae ni hito ga takusan atsumatte imasu.', exVi: 'Trước ga có rất nhiều người đang tụ tập.' },
        { w: '{閉|し}まります〔{閉|し}まる〕1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'shimarimasu (shimaru)', vi: '(cửa, cửa hàng) đóng — cặp với 閉めます (đóng cái gì)', ex: 'あの{店|みせ}は{閉|し}まっていますね。', exRo: 'Ano mise wa shimatte imasu ne.', exVi: 'Cửa hàng kia đang đóng cửa nhỉ.' },
        { w: 'すきます〔すく〕1', pos: 'động từ nhóm 1', ipa: 'sukimasu (suku)', vi: 'vắng, thưa (≠ 混みます) — hay dùng すいています; おなかがすきます = đói', ex: '{朝|あさ}は{電車|でんしゃ}がすいています。', exRo: 'Asa wa densha ga suite imasu.', exVi: 'Buổi sáng tàu vắng.' },
        { w: '{落|お}ちます〔{落|お}ちる〕2', pos: 'động từ nhóm 2', ipa: 'ochimasu (ochiru)', vi: 'rơi, rớt', ex: 'あっ、{財布|さいふ}が{落|お}ちていますよ。', exRo: 'A, saifu ga ochite imasu yo.', exVi: 'Ơ, có cái ví rơi kìa.' },
        { w: '{消|き}えます〔{消|き}える〕2', pos: 'động từ nhóm 2 (tự động từ)', ipa: 'kiemasu (kieru)', vi: '(đèn, lửa) tắt — cặp với 消します (tắt cái gì)', ex: '{部屋|へや}の{電気|でんき}が{消|き}えています。', exRo: 'Heya no denki ga kiete imasu.', exVi: 'Đèn phòng đang tắt.' },
        { w: '{壊|こわ}れます〔{壊|こわ}れる〕2', pos: 'động từ nhóm 2', ipa: 'kowaremasu (kowareru)', vi: '(máy, đồ vật) hỏng, vỡ', ex: 'このいすは{壊|こわ}れています。', exRo: 'Kono isu wa kowarete imasu.', exVi: 'Cái ghế này bị hỏng.' },
        { w: '{汚|よご}れます〔{汚|よご}れる〕2', pos: 'động từ nhóm 2', ipa: 'yogoremasu (yogoreru)', vi: 'bẩn, dơ', ex: 'あのう、コップが{汚|よご}れています。', exRo: 'Anou, koppu ga yogorete imasu.', exVi: 'Dạ, cái cốc bị bẩn ạ.' },
      ],
    },

    { t: 'h', text: 'E. Từ ở chân bài đọc 「{私|わたし}のニュース」 và bài nghe cuối (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'スピーチコンテスト', pos: 'danh từ', ipa: 'supiichi kontesuto', vi: 'cuộc thi hùng biện', ex: '{町|まち}のスピーチコンテストに{出|で}ました。', exRo: 'Machi no supiichi kontesuto ni demashita.', exVi: 'Tôi đã tham gia cuộc thi hùng biện của thành phố.' },
        { w: '～{位|い}', pos: 'hậu tố', ipa: '~i', vi: 'hạng ～, giải ～ (1位 = hạng nhất)', ex: 'なんと{3位|さんい}になりました。', exRo: 'Nanto san i ni narimashita.', exVi: 'Thật không ngờ, tôi được hạng ba.' },
        { w: '{最後|さいご}', pos: 'danh từ', ipa: 'saigo', vi: 'cuối cùng (最後まで = đến cuối)', ex: '{最後|さいご}まで{頑張|がんば}りました。', exRo: 'Saigo made ganbarimashita.', exVi: 'Tôi đã cố gắng đến cùng.' },
        { w: 'ホール', pos: 'danh từ', ipa: 'hooru', vi: 'hội trường', ex: 'ホールにはたくさんの{人|ひと}が{集|あつ}まっていました。', exRo: 'Hooru ni wa takusan no hito ga atsumatte imashita.', exVi: 'Ở hội trường có rất nhiều người đã tụ tập.' },
        { w: '{思|おも}い{出|で}', pos: 'danh từ', ipa: 'omoide', vi: 'kỷ niệm (いい思い出になりました)', ex: '{日本|にほん}の{旅行|りょこう}はいい{思|おも}い{出|で}になりました。', exRo: 'Nihon no ryokou wa ii omoide ni narimashita.', exVi: 'Chuyến du lịch Nhật đã thành một kỷ niệm đẹp.' },
        { w: 'うなずきます〔うなずく〕1', pos: 'động từ nhóm 1', ipa: 'unazukimasu (unazuku)', vi: 'gật đầu', ex: '{先生|せんせい}は「うん、うん」とうなずきました。', exRo: 'Sensei wa "un, un" to unazukimashita.', exVi: 'Thầy vừa "ừ, ừ" vừa gật đầu.' },
        { w: '{緊張|きんちょう}します〔{緊張|きんちょう}する〕3', pos: 'động từ nhóm 3', ipa: 'kinchou shimasu (kinchou suru)', vi: 'hồi hộp, căng thẳng', ex: '{試験|しけん}の{前|まえ}に、とても{緊張|きんちょう}しました。', exRo: 'Shiken no mae ni, totemo kinchou shimashita.', exVi: 'Trước kỳ thi tôi rất hồi hộp.' },
        { w: '{笑|わら}います〔{笑|わら}う〕1', pos: 'động từ nhóm 1', ipa: 'waraimasu (warau)', vi: 'cười', ex: 'みんなが{私|わたし}の{話|はなし}を{聞|き}いて、{笑|わら}いました。', exRo: 'Minna ga watashi no hanashi o kiite, waraimashita.', exVi: 'Mọi người nghe chuyện của tôi rồi cười.' },
        { w: 'なんと', pos: 'phó từ (cảm thán)', ipa: 'nanto', vi: 'thật không ngờ, vậy mà (dẫn tới điều bất ngờ)', ex: 'なんと{1位|いちい}になりました！', exRo: 'Nanto ichi i ni narimashita!', exVi: 'Thật không ngờ, tôi được hạng nhất!' },
        { w: '{会場|かいじょう}', pos: 'danh từ', ipa: 'kaijou', vi: 'địa điểm tổ chức, hội trường (chân bài nghe p.268)', ex: '{花火大会|はなびたいかい}の{会場|かいじょう}は{人|ひと}がとても{多|おお}いと{思|おも}います。', exRo: 'Hanabi taikai no kaijou wa hito ga totemo ooi to omoimasu.', exVi: 'Tôi nghĩ chỗ tổ chức lễ hội pháo hoa sẽ rất đông người.' },
      ],
    },

    {
      t: 'table',
      caption: 'Tự động từ (～が) ↔ tha động từ (～を) — bảng 自動詞と他動詞 của sách (表 p.288)',
      head: ['Tự động từ — vật TỰ thay đổi (～が)', 'Tha động từ — AI ĐÓ làm (～を)', 'Ví dụ tự động từ + ています'],
      rows: [
        ['{開|あ}きます (mở)', '{開|あ}けます (mở cái gì)', 'ドアが{開|あ}いています。— cửa đang mở'],
        ['{閉|し}まります (đóng)', '{閉|し}めます (đóng cái gì)', '{店|みせ}が{閉|し}まっています。— cửa hàng đang đóng'],
        ['つきます (đèn bật)', 'つけます (bật)', '{電気|でんき}がついています。— đèn đang bật'],
        ['{消|き}えます (tắt)', '{消|け}します (tắt cái gì)', '{電気|でんき}が{消|き}えています。— đèn đang tắt'],
        ['{入|はい}ります (vào)', '{入|い}れます (cho vào)', 'かばんに{本|ほん}が{入|はい}っています。— trong cặp có sách'],
        ['{出|で}ます (ra)', '{出|だ}します (đưa ra)', 'お{釣|つ}りが{出|で}ます。— tiền thừa chạy ra (Bài 14)'],
        ['{止|と}まります (dừng)', '{止|と}めます (dừng / đỗ cái gì)', '{電車|でんしゃ}が{止|と}まっています。— tàu đang dừng'],
        ['{始|はじ}まります (bắt đầu)', '{始|はじ}めます (bắt đầu việc gì)', '{授業|じゅぎょう}はもう{始|はじ}まっています。— giờ học đã bắt đầu'],
        ['{集|あつ}まります (tụ tập)', '{集|あつ}めます (thu gom)', '{人|ひと}が{集|あつ}まっています。— người đang tụ tập'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp',
      items: [
        '**{降|ふ}ります ↔ {降|お}ります**: cùng chữ 降. **ふります** (nhóm 1) = mưa / tuyết rơi: {雨|あめ}が{降|ふ}ります. **おります** (nhóm 2, Bài 9) = xuống xe: バスを{降|お}ります. Thể て: {降|ふ}って ↔ {降|お}りて.',
        '**{風|かぜ} (gió) ↔ {風邪|かぜ} (cảm)** — cùng đọc かぜ. {風|かぜ}が{強|つよ}い (gió mạnh) · {風邪|かぜ}をひく (bị cảm).',
        '**{死|し}にます ↔ {亡|な}くなります**: nói về **người** (nhất là người quen, người được kính trọng) dùng **亡くなります**; 死にます nghe thẳng, dùng cho động vật hoặc trong câu chung ("người chết trong tai nạn"). 死にます là động từ DUY NHẤT tận cùng ～にます: {死|し}んで, {死|し}んだ, {死|し}なない.',
        '**できます** có 3 nghĩa: có thể (Bài 9, ～ことができます) · (sân, bãi) có thể làm (Bài 10) · **mới mở / được xây xong** (Bài 15: {新|あたら}しい{店|みせ}ができました). Trợ từ: **N が できます**.',
        '**{混|こ}みます ↔ すきます** là cặp trái nghĩa, gần như luôn ở dạng **～ています**: {混|こ}んでいます (đang đông) / すいています (đang vắng). Không nói ~~混みです~~.',
        '**{勝|か}ちます／{負|ま}けます**: đối thủ hoặc trận đấu đi với **に**: {試合|しあい}**に**{勝|か}ちます, ベトナム**に**{負|ま}けました (thua Việt Nam). Không dùng ~~を~~.',
        '**きっと ↔ たぶん**: きっと = gần như chắc chắn (≈90%); たぶん = có lẽ (≈60–70%). Cả hai đứng đầu phần đoán, cuối câu là **～と{思|おも}います**.',
        '**{割|わ}れます ↔ {壊|こわ}れます**: 割れます = vỡ / nứt (cốc, kính, đĩa — đồ giòn); 壊れます = hỏng (máy, ghế, đồng hồ — không chạy nữa).',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có trong tranh, bài nghe, hội thoại — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['ニュース', 'nyuusu', 'Tin tức, thời sự (ニュースで見ました = xem trên thời sự)'],
        ['{天気予報|てんきよほう}', 'tenki yohou', 'Dự báo thời tiết (tranh p.253: きょうの天気予報)'],
        ['{情報|じょうほう}', 'jouhou', 'Thông tin (mục tiêu できる: テレビや雑誌などの情報)'],
        ['{情報誌|じょうほうし}', 'jouhoushi', 'Tạp chí thông tin (町の情報誌 — roleplay p.261)'],
        ['{記事|きじ}', 'kiji', 'Bài báo (できる！: 記事を書きましょう)'],
        ['{新聞|しんぶん}', 'shinbun', 'Tờ báo (Bài 3)'],
        ['イベント', 'ibento', 'Sự kiện'],
        ['セール', 'seeru', 'Đợt giảm giá'],
        ['オープン', 'oopun', 'Khai trương (オープンします)'],
        ['{交流会|こうりゅうかい}', 'kouryuukai', 'Buổi giao lưu (tranh p.256)'],
        ['{電器屋|でんきや}', 'denkiya', 'Cửa hàng điện máy (tranh p.260)'],
        ['{居酒屋|いざかや}', 'izakaya', 'Quán nhậu kiểu Nhật (tranh p.260)'],
        ['{花火|はなび}', 'hanabi', 'Pháo hoa'],
        ['お{祭|まつ}り', 'omatsuri', 'Lễ hội'],
        ['{恋人|こいびと}', 'koibito', 'Người yêu (Bài 5, tranh p.254)'],
        ['けが（をします）', 'kega (o shimasu)', 'Bị thương (Bài 12, tranh p.255)'],
        ['{以上|いじょう}', 'ijou', 'Trở lên (1,000円以上 — Bài 12)'],
        ['{他|ほか}の{店|みせ}', 'hoka no mise', 'Cửa hàng khác'],
        ['{料理教室|りょうりきょうしつ}', 'ryouri kyoushitsu', 'Lớp học nấu ăn'],
        ['{人気|にんき}がある', 'ninki ga aru', 'Được ưa chuộng (Bài 13)'],
        ['{予約|よやく}', 'yoyaku', 'Đặt trước (Bài 9)'],
        ['{並|なら}びます', 'narabimasu', 'Xếp hàng (Bài 14) — 並んでいます = đang xếp hàng'],
        ['{店員|てんいん}', 'ten\'in', 'Nhân viên cửa hàng'],
        ['{本当|ほんとう}だ', 'hontou da', 'Thật này! (thể thường của 本当です — nói với bạn)'],
        ['もしよかったら', 'moshi yokattara', 'Nếu bạn thấy được thì… (mở đầu lời rủ)'],
        ['{残念|ざんねん}ですね', 'zannen desu ne', 'Tiếc nhỉ'],
        ['{大丈夫|だいじょうぶ}ですか', 'daijoubu desu ka', 'Có ổn không? (hỏi người kia có chịu được không)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b15-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 119–124: ～そうです, N で, ～たら, ～ても, ～と思います (đoán), ～ています (trạng thái)',
  goal: 'Kể lại tin nghe được bằng thể thường + そうです, nói nguyên nhân bằng N で, đặt điều kiện "nếu … thì …" (～たら) và "dù … vẫn …" (～ても) với đủ 4 loại từ, đoán "chắc chắn / có lẽ …" bằng きっと／たぶん～と思います, và tả trạng thái trước mắt (電車が止まっています) — đủ để kể tin, bàn kế hoạch và tả cảnh ngoài phố.',
  minutes: 85,
  blocks: [
    {
      t: 'p',
      text: 'Bài 15 có **6 điểm ngữ pháp** (ポイント 119–124). Học theo **thứ tự của sách**: chủ đề ① dùng **119** (～そうです) và **124** (N で); chủ đề ② dùng **120** (～たら), **121** (～ても), **123** (～と{思|おも}います); chủ đề ③ dùng **122** (～ています). Bốn trong sáu điểm đứng sau **thể thường (普通形)** hoặc **thể た／て／ない** — nên trước hết ôn nhanh cách đổi (表 p.284). Mỗi điểm: công thức → ví dụ → cặp hỏi–đáp → bảng thay thế → lỗi hay mắc.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 6 điểm ngữ pháp',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['119', '{普通形|ふつうけい} ＋ そうです（ナA／N：～だそうです）', 'Nghe nói, người ta nói là… (truyền đạt tin)', '{明日|あした}、{台風|たいふう}が{来|く}るそうです。'],
        ['124', 'N で、___', 'Vì N (nguyên nhân: tai nạn, thiên tai, bệnh…)', '{事故|じこ}で{電車|でんしゃ}が{止|と}まっています。'],
        ['120', 'Vた／イA‑かった／ナA・N だった ＋ ら、___', 'Nếu … thì … (điều kiện); … xong thì …', '{時間|じかん}があったら、{映画|えいが}を{見|み}に{行|い}きませんか。'],
        ['121', 'Vて／イA‑くて／ナA・N で ＋ も、___', 'Dù … cũng / vẫn …', '{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。'],
        ['123', '{普通形|ふつうけい} ＋ と{思|おも}います（きっと／たぶん）', 'Tôi nghĩ (đoán) là …', 'カルロスさんはたぶん{来|こ}ないと{思|おも}います。'],
        ['122', 'N が V（tự động từ）て います', 'Trạng thái còn lại sau khi việc đã xảy ra', '{入|い}り{口|ぐち}に{人|ひと}がたくさん{並|なら}んでいます。'],
      ],
    },

    /* ── Ôn thể thường ── */
    { t: 'h', text: 'Trước tiên — Thể thường (普通形) đứng trước そうです／と思います (ôn Bài 11–14)' },
    {
      t: 'table',
      caption: 'Thể lịch sự ↔ thể thường — 4 loại từ (表 p.284)',
      head: ['Loại', 'Hiện tại khẳng định', 'Hiện tại phủ định', 'Quá khứ khẳng định', 'Quá khứ phủ định'],
      rows: [
        ['V', '{来|く}る', '{来|こ}ない', '{来|き}た', '{来|こ}なかった'],
        ['V (ある)', 'ある', '**ない**', 'あった', '**なかった**'],
        ['イA', '{怖|こわ}い', '{怖|こわ}くない', '{怖|こわ}かった', '{怖|こわ}くなかった'],
        ['イA (いい)', 'いい', '**よ**くない', '**よ**かった', '**よ**くなかった'],
        ['ナA', '{無料|むりょう}**だ**', '{無料|むりょう}じゃない', '{無料|むりょう}だった', '{無料|むりょう}じゃなかった'],
        ['N', '{雨|あめ}**だ**', '{雨|あめ}じゃない', '{雨|あめ}だった', '{雨|あめ}じゃなかった'],
      ],
    },
    {
      t: 'note',
      title: 'Ba mẫu cùng đứng sau thể thường — khác nhau chỗ ナA／N',
      items: [
        '**～んです** (Bài 12): ナA／N thêm **な** → {雨|あめ}**な**んです.',
        '**～そうです** (Bài 15, nghe nói): ナA／N giữ **だ** → {雨|あめ}**だ**そうです.',
        '**～と{思|おも}います** (Bài 14–15): ナA／N giữ **だ** → {雨|あめ}**だ**と{思|おも}います.',
        'Với V và イA thì cả ba giống nhau: {来|く}る**んです**／{来|く}る**そうです**／{来|く}る**と思います**; {怖|こわ}い**んです**／{怖|こわ}い**そうです**／{怖|こわ}い**と思います**.',
      ],
    },

    /* ── ポイント 119 ── */
    { t: 'h', text: 'ポイント 119 — 普通形 ＋ そうです (Nghe nói…, người ta nói là…)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V／イA thể thường ＋ そうです',
          vi: 'Truyền lại **thông tin nghe / đọc được** (từ ti vi, tạp chí, bạn bè) — **không phải ý của mình**. Thì và phủ định đổi ở phần thể thường; **そうです thì không đổi** (không có ~~そうでした~~, ~~そうじゃありません~~). Muốn nói nguồn tin: **ニュースで／{天気予報|てんきよほう}で／{雑誌|ざっし}で見ましたが、～そうです**.',
          examples: [
            { en: '{明日|あした}、{台風|たいふう}が{来|く}るそうです。', ro: 'Ashita, taifuu ga kuru sou desu.', vi: 'Nghe nói ngày mai bão đến. — câu mẫu của sách' },
            { en: '{週末|しゅうまつ}、{公園|こうえん}でフリーマーケットがあるそうですよ。', ro: 'Shuumatsu, kouen de furii maaketto ga aru sou desu yo.', vi: 'Nghe nói cuối tuần ở công viên có chợ đồ cũ đấy.' },
            { en: '{先週|せんしゅう}、{西川|にしかわ}さんが{入院|にゅういん}したそうです。', ro: 'Senshuu, Nishikawa-san ga nyuuin shita sou desu.', vi: 'Nghe nói tuần trước anh Nishikawa nhập viện. (quá khứ: した + そうです)' },
            { en: '{地震|じしん}で{亡|な}くなった{人|ひと}はいないそうです。', ro: 'Jishin de nakunatta hito wa inai sou desu.', vi: 'Nghe nói không có ai thiệt mạng vì động đất. (phủ định: いない + そうです)' },
            { en: 'あの{店|みせ}のラーメンはおいしいそうです。', ro: 'Ano mise no raamen wa oishii sou desu.', vi: 'Nghe nói mì ramen quán kia ngon. (イA + そうです)' },
            { en: '{昨日|きのう}の{試合|しあい}はおもしろかったそうです。', ro: 'Kinou no shiai wa omoshirokatta sou desu.', vi: 'Nghe nói trận hôm qua hay lắm. (イA quá khứ)' },
          ],
        },
        {
          formula: 'ナA／N ＋ だそうです',
          vi: 'ナA và danh từ: **giữ だ** rồi + そうです. Phủ định: ～じゃないそうです; quá khứ: ～だったそうです.',
          examples: [
            { en: '{来月|らいげつ}、ほしの{美術館|びじゅつかん}は{無料|むりょう}だそうです。', ro: 'Raigetsu, Hoshino bijutsukan wa muryou da sou desu.', vi: 'Nghe nói tháng sau bảo tàng mỹ thuật Hoshino miễn phí. — câu mẫu của sách' },
            { en: '{雨|あめ}が{降|ふ}ったら、{花火大会|はなびたいかい}は{中止|ちゅうし}だそうです。', ro: 'Ame ga futtara, hanabi taikai wa chuushi da sou desu.', vi: 'Nghe nói nếu mưa thì lễ hội pháo hoa bị huỷ.' },
            { en: '{明日|あした}は{曇|くも}りだそうです。', ro: 'Ashita wa kumori da sou desu.', vi: 'Nghe nói ngày mai trời nhiều mây.' },
            { en: 'この{料理教室|りょうりきょうしつ}は{無料|むりょう}じゃないそうです。', ro: 'Kono ryouri kyoushitsu wa muryou ja nai sou desu.', vi: 'Nghe nói lớp nấu ăn này không miễn phí.' },
            { en: '{昔|むかし}、ここは{有名|ゆうめい}な{店|みせ}だったそうです。', ro: 'Mukashi, koko wa yuumei na mise datta sou desu.', vi: 'Nghe nói ngày xưa đây là một cửa hàng nổi tiếng.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đổi tin → câu ～そうです (4 loại từ, đủ thì)',
      head: ['Tin gốc (lịch sự)', 'Thể thường', 'Câu ～そうです', 'Romaji'],
      rows: [
        ['{台風|たいふう}が{来|き}ます。', '{来|く}る', '{台風|たいふう}が{来|く}るそうです。', 'Taifuu ga kuru sou desu.'],
        ['{雨|あめ}は{降|ふ}りません。', '{降|ふ}らない', '{雨|あめ}は{降|ふ}らないそうです。', 'Ame wa furanai sou desu.'],
        ['ビルが{倒|たお}れました。', '{倒|たお}れた', 'ビルが{倒|たお}れたそうです。', 'Biru ga taoreta sou desu.'],
        ['けがをした{人|ひと}はいませんでした。', 'いなかった', 'けがをした{人|ひと}はいなかったそうです。', 'Kega o shita hito wa inakatta sou desu.'],
        ['あの{店|みせ}は{安|やす}いです。', '{安|やす}い', 'あの{店|みせ}は{安|やす}いそうです。', 'Ano mise wa yasui sou desu.'],
        ['{風|かぜ}が{強|つよ}かったです。', '{強|つよ}かった', '{風|かぜ}が{強|つよ}かったそうです。', 'Kaze ga tsuyokatta sou desu.'],
        ['{入場料|にゅうじょうりょう}は{無料|むりょう}です。', '{無料|むりょう}だ', '{入場料|にゅうじょうりょう}は{無料|むりょう}だそうです。', 'Nyuujouryou wa muryou da sou desu.'],
        ['{明日|あした}は{休|やす}みじゃありません。', '{休|やす}みじゃない', '{明日|あした}は{休|やす}みじゃないそうです。', 'Ashita wa yasumi ja nai sou desu.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp với ～そうです',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{知|し}っていますか。カルロスさんが{来月|らいげつ}{結婚|けっこん}するそうですよ。', ro: 'B-san, shitte imasu ka. Karurosu-san ga raigetsu kekkon suru sou desu yo.', vi: 'B, bạn biết chưa? Nghe nói tháng sau Carlos kết hôn đấy.' },
        { who: 'B', role: 'b', text: 'えっ、そうですか。よかったですね。', ro: 'E, sou desu ka. Yokatta desu ne.', vi: 'Hả, vậy à? Tốt quá nhỉ.' },
        { who: 'A', role: 'a', text: '{天気予報|てんきよほう}を{見|み}ましたか。{明日|あした}はどうですか。', ro: 'Tenki yohou o mimashita ka. Ashita wa dou desu ka.', vi: 'Bạn xem dự báo thời tiết chưa? Ngày mai thế nào?' },
        { who: 'B', role: 'b', text: '{午前|ごぜん}は{雨|あめ}ですが、{午後|ごご}はやむそうです。{夕方|ゆうがた}は{晴|は}れるそうですよ。', ro: 'Gozen wa ame desu ga, gogo wa yamu sou desu. Yuugata wa hareru sou desu yo.', vi: 'Buổi sáng mưa nhưng nghe nói chiều thì tạnh. Nghe nói chiều tối trời nắng đấy.' },
        { who: 'A', role: 'a', text: 'ニュースで{何|なに}か{見|み}ましたか。', ro: 'Nyuusu de nanika mimashita ka.', vi: 'Bạn có xem tin gì trên thời sự không?' },
        { who: 'B', role: 'b', text: 'ええ。{動物園|どうぶつえん}のゾウが{死|し}んだそうです。{寂|さび}しいですね。', ro: 'Ee. Doubutsuen no zou ga shinda sou desu. Sabishii desu ne.', vi: 'Có. Nghe nói con voi ở sở thú chết rồi. Buồn nhỉ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___そうですよ。——(cảm tưởng)',
      head: ['Tin (thể thường)', 'Câu kể', 'Người nghe đáp'],
      rows: [
        ['{駅|えき}の{前|まえ}にデパートができた', '{駅|えき}の{前|まえ}にデパートができたそうですよ。', 'へえ、{行|い}きたいですね。／へえ、いいですね。'],
        ['ニコニコビルで{今日|きょう}からセールがある', 'ニコニコビルで{今日|きょう}からセールがあるそうですよ。', 'いいですね。{一緒|いっしょ}に{行|い}きませんか。'],
        ['{山下|やました}{動物園|どうぶつえん}は{1週間|いっしゅうかん}{無料|むりょう}だ', '{山下|やました}{動物園|どうぶつえん}は{1週間|いっしゅうかん}{無料|むりょう}だそうですよ。', 'へえ、{知|し}りませんでした。'],
        ['マルコさんのチームが{勝|か}った', 'マルコさんのチームが{勝|か}ったそうですよ。', 'よかったですね。'],
        ['{事故|じこ}で{4人|よにん}けがをした', '{事故|じこ}で{4人|よにん}けがをしたそうですよ。', '{本当|ほんとう}ですか。{怖|こわ}いですね。'],
        ['{台風|たいふう}で{電車|でんしゃ}が{止|と}まった', '{台風|たいふう}で{電車|でんしゃ}が{止|と}まったそうですよ。', '{大変|たいへん}ですね。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ～そうです',
      items: [
        '~~{無料|むりょう}そうです~~, ~~{無料|むりょう}なそうです~~ → **{無料|むりょう}だそうです** (ナA／N phải có だ).',
        '~~{来|き}ますそうです~~ → **{来|く}るそうです** (phải đổi sang thể thường trước).',
        'Quá khứ đổi **trước そう**, không phải sau: ~~{倒|たお}れるそうでした~~ → **{倒|たお}れたそうです**.',
        '**Hai loại そうです khác nhau hoàn toàn**: {雨|あめ}が{降|ふ}**る**そうです (thể thường + そう = **nghe nói** trời sẽ mưa) ↔ {雨|あめ}が{降|ふ}**り**そうです (thể ます bỏ ます + そう = trông **như sắp** mưa). おいし**い**そうです (nghe nói ngon) ↔ おいし**そう**です (trông ngon). Bài 15 chỉ học loại "nghe nói".',
        'Không dùng ～そうです để nói **việc của chính mình** mình đã biết rõ: ~~{私|わたし}は{学生|がくせい}だそうです~~.',
      ],
    },

    /* ── ポイント 124 ── */
    { t: 'h', text: 'ポイント 124 — N で (Vì N — nguyên nhân)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（{事故|じこ}・{地震|じしん}・{台風|たいふう}・{雨|あめ}・{病気|びょうき}・{風邪|かぜ}…）＋ で、___',
          vi: 'Danh từ chỉ **sự kiện, hiện tượng** + で = **vì, do** N mà (kết quả thường là việc không mong muốn: dừng, đổ, hỏng, nghỉ, huỷ). Vế sau **không** dùng lời mời, nhờ vả, ý muốn — chỉ kể kết quả.',
          examples: [
            { en: '{事故|じこ}で{電車|でんしゃ}が{止|と}まっています。', ro: 'Jiko de densha ga tomatte imasu.', vi: 'Vì tai nạn nên tàu điện đang dừng. — câu mẫu của sách' },
            { en: '{地震|じしん}でビルが{倒|たお}れました。', ro: 'Jishin de biru ga taoremashita.', vi: 'Vì động đất mà toà nhà bị đổ.' },
            { en: '{台風|たいふう}で{試合|しあい}が{中止|ちゅうし}になりました。', ro: 'Taifuu de shiai ga chuushi ni narimashita.', vi: 'Vì bão mà trận đấu bị huỷ.' },
            { en: '{風|かぜ}で{窓|まど}ガラスが{割|わ}れました。', ro: 'Kaze de mado garasu ga waremashita.', vi: 'Vì gió mà kính cửa sổ bị vỡ.' },
            { en: '{風邪|かぜ}で{学校|がっこう}を{休|やす}みました。', ro: 'Kaze de gakkou o yasumimashita.', vi: 'Tôi nghỉ học vì cảm.' },
            { en: '{事故|じこ}で{3人|さんにん}{亡|な}くなったそうです。', ro: 'Jiko de sannin nakunatta sou desu.', vi: 'Nghe nói 3 người thiệt mạng vì tai nạn.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'で có nhiều nghĩa — phân biệt',
      head: ['Nghĩa', 'Bài', 'Ví dụ'],
      rows: [
        ['Nơi xảy ra hành động', 'B3 (ポイント 20)', '{公園|こうえん}**で**フリーマーケットがあります。'],
        ['Phương tiện, dụng cụ', 'B4, B7 (31, 71)', 'バス**で**{行|い}きます。はし**で**{食|た}べます。'],
        ['Ngôn ngữ', 'B2 (15)', '{日本語|にほんご}**で**{話|はな}します。'],
        ['Số người', 'B8 (80)', '{3人|さんにん}**で**{行|い}きます。'],
        ['**Nguyên nhân**', '**B15 (124)**', '{台風|たいふう}**で**{電車|でんしゃ}が{止|と}まりました。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — N で (nguyên nhân)',
      items: [
        'N で chỉ dùng với **danh từ**. Động từ / tính từ chỉ lý do thì dùng **～から** (Bài 5): {雨|あめ}が{降|ふ}っています**から**, {行|い}きません.',
        'Sau N で **không** mời / nhờ: ~~{雨|あめ}で、うちにいましょう~~ → **{雨|あめ}ですから**、うちにいましょう.',
        'Đừng nhầm với "ở": {事故|じこ}で = **vì** tai nạn (không phải "ở tai nạn"). Đọc cả câu để biết nghĩa nào.',
      ],
    },

    /* ── ポイント 120 ── */
    { t: 'h', text: 'ポイント 120 — ～たら、___ (Nếu … thì …)' },
    {
      t: 'table',
      caption: 'Cách lập thể たら (p.281): thể た ＋ ら — 4 loại từ',
      head: ['Loại', 'Khẳng định', 'Phủ định', 'Cách lập'],
      rows: [
        ['V', '{降|ふ}っ**たら**', '{降|ふ}らなかっ**たら**', 'Khẳng định: **thể た** + ら · Phủ định: **thể ない** → なかった + ら'],
        ['イA', '{暑|あつ}かっ**たら**', '{暑|あつ}くなかっ**たら**', '～い → ～かったら · ～くない → ～くなかったら'],
        ['ナA', '{大変|たいへん}だっ**たら**', '{大変|たいへん}じゃなかっ**たら**', '+ だったら / + じゃなかったら'],
        ['N', '{雨|あめ}だっ**たら**', '{雨|あめ}じゃなかっ**たら**', '+ だったら / + じゃなかったら'],
        ['(いい)', '**よ**かったら', '**よ**くなかったら', 'いい → よ… (よかったら = nếu được)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A たら、B',
          vi: '**Nếu A (xảy ra / đúng) thì B.** Vế sau B dùng được **mọi kiểu câu**: mời (～ませんか), rủ (～ましょう), muốn (～たいです), nhờ (～てください), kể sự thật. Thêm **もし** ở đầu câu để nhấn mạnh "giả sử".',
          examples: [
            { en: '{時間|じかん}があったら、{映画|えいが}を{見|み}に{行|い}きませんか。', ro: 'Jikan ga attara, eiga o mi ni ikimasen ka.', vi: 'Nếu có thời gian thì đi xem phim không? — câu mẫu của sách' },
            { en: '{安|やす}かったら、パソコンを{買|か}いたいです。', ro: 'Yasukattara, pasokon o kaitai desu.', vi: 'Nếu rẻ thì tôi muốn mua máy tính. — câu mẫu của sách' },
            { en: '{雨|あめ}だったら、{試合|しあい}は{中止|ちゅうし}です。', ro: 'Ame dattara, shiai wa chuushi desu.', vi: 'Nếu mưa thì trận đấu bị huỷ. — câu mẫu của sách' },
            { en: '{暇|ひま}だったら、{手伝|てつだ}ってください。', ro: 'Hima dattara, tetsudatte kudasai.', vi: 'Nếu rảnh thì giúp tôi với. (ナA)' },
            { en: 'もし{雨|あめ}が{降|ふ}らなかったら、{花火大会|はなびたいかい}へ{行|い}きましょう。', ro: 'Moshi ame ga furanakattara, hanabi taikai e ikimashou.', vi: 'Nếu trời không mưa thì mình đi lễ hội pháo hoa nhé. (phủ định)' },
            { en: '{高|たか}くなかったら、{買|か}います。', ro: 'Takaku nakattara, kaimasu.', vi: 'Nếu không đắt thì tôi mua. (イA phủ định)' },
          ],
        },
        {
          formula: 'Vたら、B（việc chắc chắn sẽ xảy ra）＝ "khi / sau khi V xong thì B"',
          vi: 'Khi A **chắc chắn sẽ xảy ra** (học xong, về đến nhà, đến 12 giờ), ～たら nghĩa là "**khi … xong thì**". Nghe rất tự nhiên trong lời hẹn.',
          examples: [
            { en: '{授業|じゅぎょう}が{終|お}わったら、{一緒|いっしょ}に{帰|かえ}りましょう。', ro: 'Jugyou ga owattara, issho ni kaerimashou.', vi: 'Học xong thì mình cùng về nhé.' },
            { en: 'うちに{着|つ}いたら、{電話|でんわ}してください。', ro: 'Uchi ni tsuitara, denwa shite kudasai.', vi: 'Về đến nhà thì gọi điện cho tôi nhé.' },
            { en: '{雨|あめ}がやんだら、{出|で}かけましょう。', ro: 'Ame ga yandara, dekakemashou.', vi: 'Mưa tạnh thì mình ra ngoài.' },
          ],
        },
        {
          formula: '（もし）よかったら、～ませんか。',
          vi: 'Câu cố định để **rủ / mời lịch sự**: "Nếu bạn thấy được thì…". Sách dùng ở p.260: もしよかったら、{一緒|いっしょ}に{行|い}きませんか.',
          examples: [
            { en: 'よかったら、このケーキ、{食|た}べてください。', ro: 'Yokattara, kono keeki, tabete kudasai.', vi: 'Nếu được thì bạn ăn bánh này nhé.' },
            { en: 'もしよかったら、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Moshi yokattara, issho ni ikimasen ka.', vi: 'Nếu bạn thấy được thì đi cùng tôi không?' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp với ～たら',
      lines: [
        { who: 'A', role: 'a', text: '{土曜日|どようび}、{雨|あめ}が{降|ふ}ったら、どうしますか。', ro: 'Doyoubi, ame ga futtara, dou shimasu ka.', vi: 'Thứ Bảy nếu mưa thì bạn làm gì?' },
        { who: 'B', role: 'b', text: '{雨|あめ}が{降|ふ}ったら、うちで{映画|えいが}を{見|み}ます。', ro: 'Ame ga futtara, uchi de eiga o mimasu.', vi: 'Nếu mưa thì tôi xem phim ở nhà.' },
        { who: 'A', role: 'a', text: 'お{金|かね}がたくさんあったら、{何|なに}をしたいですか。', ro: 'Okane ga takusan attara, nani o shitai desu ka.', vi: 'Nếu có nhiều tiền bạn muốn làm gì?' },
        { who: 'B', role: 'b', text: '{世界|せかい}を{旅行|りょこう}したいです。', ro: 'Sekai o ryokou shitai desu.', vi: 'Tôi muốn du lịch vòng quanh thế giới.' },
        { who: 'A', role: 'a', text: '{日本|にほん}へ{行|い}ったら、{何|なに}を{食|た}べたいですか。', ro: 'Nihon e ittara, nani o tabetai desu ka.', vi: 'Nếu (khi) sang Nhật bạn muốn ăn gì?' },
        { who: 'B', role: 'b', text: 'すしを{食|た}べたいです。{安|やす}かったら、{毎日|まいにち}{食|た}べたいです。', ro: 'Sushi o tabetai desu. Yasukattara, mainichi tabetai desu.', vi: 'Tôi muốn ăn sushi. Nếu rẻ thì ngày nào tôi cũng muốn ăn.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — (điều kiện)たら、(việc làm)',
      head: ['Điều kiện (thể ます / です)', 'Thể たら', 'Câu hoàn chỉnh'],
      rows: [
        ['{1,000円|せんえん}{以上|いじょう}{買|か}います', '{買|か}ったら', '{1,000円|せんえん}{以上|いじょう}{買|か}ったら、プレゼントがあります。'],
        ['{友達|ともだち}と{3人|さんにん}で{行|い}きます', '{行|い}ったら', '{3人|さんにん}で{行|い}ったら、ストラップをもらうことができます。'],
        ['{雨|あめ}です', '{雨|あめ}だったら', '{雨|あめ}だったら、{5|ご}パーセント{引|び}きです。'],
        ['{他|ほか}の{店|みせ}より{高|たか}いです', '{高|たか}かったら', '{他|ほか}の{店|みせ}より{高|たか}かったら、{安|やす}くなります。'],
        ['{風|かぜ}が{強|つよ}いです', '{強|つよ}かったら', '{風|かぜ}が{強|つよ}かったら、{中止|ちゅうし}です。'],
        ['{暇|ひま}です', '{暇|ひま}だったら', '{暇|ひま}だったら、{一緒|いっしょ}に{行|い}きませんか。'],
        ['{間|ま}に{合|あ}いません', '{間|ま}に{合|あ}わなかったら', '{間|ま}に{合|あ}わなかったら、{先|さき}に{行|い}ってください。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ～たら',
      items: [
        '~~{行|い}きたら~~ → **{行|い}ったら** (thể た của 行きます là 行った). ~~{降|ふ}りたら~~ (nếu nghĩa "mưa") → **{降|ふ}ったら**.',
        '~~いいだったら~~, ~~いいかったら~~ → **よかったら**. ~~{安|やす}いだったら~~ → **{安|やす}かったら**.',
        '~~{雨|あめ}たら~~, ~~{暇|ひま}たら~~ → **{雨|あめ}だったら, {暇|ひま}だったら**.',
        'Vế sau ～たら dùng thì **hiện tại / tương lai** khi nói về điều kiện chưa xảy ra: {時間|じかん}があったら、{行|い}き**ます** (không phải ~~行きました~~).',
      ],
    },

    /* ── ポイント 121 ── */
    { t: 'h', text: 'ポイント 121 — ～ても、___ (Dù … cũng / vẫn …)' },
    {
      t: 'table',
      caption: 'Cách lập thể ても (p.281): thể て ＋ も — 4 loại từ',
      head: ['Loại', 'Khẳng định', 'Phủ định', 'Cách lập'],
      rows: [
        ['V', '{降|ふ}って**も**', '{降|ふ}らなく**ても**', 'Khẳng định: **thể て** + も · Phủ định: **thể ない** → なくても'],
        ['イA', '{暑|あつ}く**ても**', '{暑|あつ}くなく**ても**', '～い → ～くても'],
        ['ナA', '{大変|たいへん}**でも**', '{大変|たいへん}じゃなく**ても**', '+ でも / + じゃなくても'],
        ['N', '{雨|あめ}**でも**', '{雨|あめ}じゃなく**ても**', '+ でも / + じゃなくても'],
        ['(いい)', '**よ**くても', '**よ**くなくても', 'いい → よくても'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A ても、B',
          vi: '**Dù A thì B vẫn xảy ra / vẫn làm** — kết quả B **ngược** với điều ta chờ đợi từ A. Hay đi với ý chí: ～ても、{行|い}きたいです／{行|い}きます.',
          examples: [
            { en: '{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。', ro: 'Ame ga futte mo, shiai wa arimasu.', vi: 'Dù mưa trận đấu vẫn có. — câu mẫu của sách' },
            { en: '{高|たか}くても、{新|あたら}しい{電子辞書|でんしじしょ}がほしいです。', ro: 'Takakute mo, atarashii denshi jisho ga hoshii desu.', vi: 'Dù đắt tôi vẫn muốn có kim từ điển mới. — câu mẫu của sách' },
            { en: '{大変|たいへん}でも、{富士山|ふじさん}に{登|のぼ}りたいです。', ro: 'Taihen demo, Fujisan ni noboritai desu.', vi: 'Dù vất vả tôi vẫn muốn leo núi Phú Sĩ. — câu mẫu của sách' },
            { en: '{人|ひと}が{多|おお}くても、{行|い}きたいです。', ro: 'Hito ga ookute mo, ikitai desu.', vi: 'Dù đông người tôi vẫn muốn đi.' },
            { en: '{無料|むりょう}じゃなくても、{行|い}きたいです。', ro: 'Muryou ja nakute mo, ikitai desu.', vi: 'Dù không miễn phí tôi vẫn muốn đi. (N/ナA phủ định)' },
            { en: '{長|なが}い{時間|じかん}{待|ま}っても、{食|た}べたいです。', ro: 'Nagai jikan matte mo, tabetai desu.', vi: 'Dù phải chờ lâu tôi vẫn muốn ăn.' },
            { en: '{急|いそ}いでも、{間|ま}に{合|あ}わないと{思|おも}います。', ro: 'Isoide mo, ma ni awanai to omoimasu.', vi: 'Tôi nghĩ dù có vội cũng không kịp đâu.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '～たら ↔ ～ても — cùng điều kiện, kết quả ngược nhau',
      head: ['～たら (nếu … thì)', '～ても (dù … vẫn)'],
      rows: [
        ['{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}です。(mưa → huỷ)', '{雨|あめ}が{降|ふ}っても、あります。(mưa → vẫn có)'],
        ['{高|たか}かったら、{買|か}いません。(đắt → không mua)', '{高|たか}くても、{買|か}います。(đắt → vẫn mua)'],
        ['{人|ひと}が{多|おお}かったら、{行|い}きません。', '{人|ひと}が{多|おお}くても、{行|い}きます。'],
        ['{大変|たいへん}だったら、やめます。', '{大変|たいへん}でも、やります。'],
        ['{無料|むりょう}じゃなかったら、{行|い}きません。', '{無料|むりょう}じゃなくても、{行|い}きます。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp với ～ても (言ってみよう p.261)',
      lines: [
        { who: 'A', role: 'a', text: '{駅|えき}の{前|まえ}のすし{屋|や}はおいしいそうですよ。', ro: 'Eki no mae no sushiya wa oishii sou desu yo.', vi: 'Nghe nói quán sushi trước ga ngon lắm đấy.' },
        { who: 'B', role: 'b', text: 'へえ、ぜひ{行|い}きたいです。', ro: 'Hee, zehi ikitai desu.', vi: 'Ồ, tôi rất muốn đi.' },
        { who: 'A', role: 'a', text: 'でも、{人気|にんき}がある{店|みせ}ですから、{長|なが}い{時間|じかん}{待|ま}つと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。', ro: 'Demo, ninki ga aru mise desu kara, nagai jikan matsu to omoimasu ga, daijoubu desu ka.', vi: 'Nhưng vì là quán được ưa chuộng nên chắc phải chờ lâu, bạn có ổn không?' },
        { who: 'B', role: 'b', text: 'うーん。{長|なが}い{時間|じかん}{待|ま}っても、{食|た}べたいです。', ro: 'Uun. Nagai jikan matte mo, tabetai desu.', vi: 'Ừm. Dù phải chờ lâu tôi vẫn muốn ăn.' },
        { who: 'A', role: 'a', text: '{雨|あめ}が{降|ふ}っても、{行|い}きますか。', ro: 'Ame ga futte mo, ikimasu ka.', vi: 'Dù mưa bạn vẫn đi à?' },
        { who: 'B', role: 'b', text: 'はい、{雨|あめ}でも{行|い}きます。', ro: 'Hai, ame demo ikimasu.', vi: 'Vâng, dù mưa tôi vẫn đi.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ～ても',
      items: [
        '~~{高|たか}いでも~~ → **{高|たか}くても** (イA: い → くても). ~~いいくても~~ → **よくても**.',
        '~~{雨|あめ}ても~~ → **{雨|あめ}でも** (N / ナA + でも).',
        'Phủ định: ~~{降|ふ}らないでも~~ → **{降|ふ}らなくても**. (Nhớ Bài 14: ～なくてもいいです = không cần.)',
        '**～ても ≠ ～て、も**: {雨|あめ}が{降|ふ}**っても** (dù mưa) là một khối — đừng tách thành 降って + も (cũng).',
      ],
    },

    /* ── ポイント 123 ── */
    { t: 'h', text: 'ポイント 123 — 普通形 ＋ と思います (Tôi đoán là …) — きっと／たぶん' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（きっと／たぶん）＋ 普通形 ＋ と{思|おも}います',
          vi: 'Bài 14 (ポイント 117) dùng ～と{思|おも}います để nói **ý kiến**. Bài 15 dùng để **đoán việc chưa biết chắc** (thời tiết, ai có đến không, quán có đông không). **きっと** = gần như chắc chắn; **たぶん** = có lẽ. ナA／N giữ **だ**: {無料|むりょう}**だ**と{思|おも}います.',
          examples: [
            { en: 'あの{店|みせ}のラーメンはきっとおいしいと{思|おも}います。', ro: 'Ano mise no raamen wa kitto oishii to omoimasu.', vi: 'Tôi nghĩ mì ramen quán đó chắc chắn ngon. — câu mẫu của sách' },
            { en: 'カルロスさんはたぶんパーティーに{来|こ}ないと{思|おも}います。', ro: 'Karurosu-san wa tabun paatii ni konai to omoimasu.', vi: 'Tôi nghĩ có lẽ Carlos không đến bữa tiệc. — câu mẫu của sách' },
            { en: '{明日|あした}はきっと{晴|は}れると{思|おも}います。', ro: 'Ashita wa kitto hareru to omoimasu.', vi: 'Tôi nghĩ mai chắc chắn trời nắng.' },
            { en: '{週末|しゅうまつ}ですから、たぶん{混|こ}んでいると{思|おも}います。', ro: 'Shuumatsu desu kara, tabun konde iru to omoimasu.', vi: 'Vì là cuối tuần nên tôi nghĩ có lẽ đang đông.' },
            { en: 'お{祭|まつ}りはきっとにぎやかだと{思|おも}います。', ro: 'Omatsuri wa kitto nigiyaka da to omoimasu.', vi: 'Tôi nghĩ lễ hội chắc chắn náo nhiệt. (ナA + だ)' },
            { en: 'もういい{席|せき}はないと{思|おも}います。', ro: 'Mou ii seki wa nai to omoimasu.', vi: 'Tôi nghĩ không còn chỗ tốt nữa. (ある → ない)' },
            { en: 'マルコさんはもう{家|いえ}に{帰|かえ}ったと{思|おも}います。', ro: 'Maruko-san wa mou ie ni kaetta to omoimasu.', vi: 'Tôi nghĩ Marco về nhà rồi. (quá khứ)' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp: đoán',
      lines: [
        { who: 'A', role: 'a', text: '{明日|あした}、{天気|てんき}はどうだと{思|おも}いますか。', ro: 'Ashita, tenki wa dou da to omoimasu ka.', vi: 'Bạn nghĩ ngày mai thời tiết thế nào?' },
        { who: 'B', role: 'b', text: 'たぶん{雨|あめ}だと{思|おも}います。{空|そら}が{暗|くら}いですから。', ro: 'Tabun ame da to omoimasu. Sora ga kurai desu kara.', vi: 'Tôi nghĩ có lẽ mưa. Vì trời tối sầm.' },
        { who: 'A', role: 'a', text: 'パクさんはパーティーに{来|き}ますか。', ro: 'Paku-san wa paatii ni kimasu ka.', vi: 'Park có đến bữa tiệc không?' },
        { who: 'B', role: 'b', text: 'きっと{来|く}ると{思|おも}います。パーティーが{好|す}きですから。', ro: 'Kitto kuru to omoimasu. Paatii ga suki desu kara.', vi: 'Tôi nghĩ chắc chắn đến. Vì bạn ấy thích tiệc.' },
        { who: 'A', role: 'a', text: '{今|いま}から{行|い}ったら、{映画|えいが}に{間|ま}に{合|あ}いますか。', ro: 'Ima kara ittara, eiga ni ma ni aimasu ka.', vi: 'Nếu đi từ bây giờ thì có kịp phim không?' },
        { who: 'B', role: 'b', text: 'うーん、たぶん{間|ま}に{合|あ}わないと{思|おも}います。', ro: 'Uun, tabun ma ni awanai to omoimasu.', vi: 'Ừm, tôi nghĩ có lẽ không kịp.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — きっと／たぶん ___と思います (言ってみよう p.260 số 2)',
      head: ['Thông tin', 'Đoán (thể thường)', 'Câu hoàn chỉnh'],
      rows: [
        ['{週末|しゅうまつ}、フリーマーケット', '{安|やす}くていいものがある', 'きっと{安|やす}くていいものがあると{思|おも}います。'],
        ['あさって、お{祭|まつ}り', 'にぎやかで{楽|たの}しい', 'きっとにぎやかで{楽|たの}しいと{思|おも}います。'],
        ['{土曜日|どようび}、サッカーの{試合|しあい}', 'おもしろい', 'きっとおもしろいと{思|おも}います。'],
        ['{横浜|よこはま}で{花火大会|はなびたいかい}', 'きれいだ', 'きっときれいだと{思|おも}います。'],
        ['{日曜日|にちようび}のデパート', '{混|こ}んでいる', 'たぶん{混|こ}んでいると{思|おも}います。'],
        ['{雨|あめ}の{日|ひ}の{遊園地|ゆうえんち}', 'すいている', 'たぶんすいていると{思|おも}います。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ～と思います (đoán)',
      items: [
        '~~きれいと{思|おも}います~~ → **きれいだと{思|おも}います** (ナA／N cần だ). ~~おいしいだと思います~~ → **おいしいと{思|おも}います** (イA không thêm だ).',
        'Đoán **phủ định**: người Nhật đặt phủ định **trong** câu đoán: **{来|こ}ないと{思|おも}います** (tự nhiên) — không nói ~~{来|く}ると{思|おも}いません~~ khi chỉ đoán.',
        'きっと／たぶん là **phó từ**, đứng đầu phần đoán; **không** thay được と{思|おも}います: ~~たぶん{雨|あめ}です~~ nghe cụt — nói **たぶん{雨|あめ}だと{思|おも}います**.',
        'Nói về **người khác** nghĩ gì thì dùng ～と{思|おも}っています (sẽ học sau); ở trình độ này chỉ dùng cho **ý của mình**.',
      ],
    },

    /* ── ポイント 122 ── */
    { t: 'h', text: 'ポイント 122 — N が V（tự động từ）て います (Trạng thái còn lại)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N が ＋ tự động từ thể て ＋ います',
          vi: 'Một việc **đã xảy ra** và **kết quả của nó còn nguyên trước mắt**: tàu dừng rồi (và vẫn đang đứng yên), cốc bẩn rồi (và vẫn bẩn), người đã xếp hàng (và vẫn đứng đó). Dùng khi **nhìn thấy cảnh** và tả lại. Động từ là **tự động từ** (N **が** + V, không có người làm): {止|と}まります, {閉|し}まります, {消|き}えます, {割|わ}れます, {壊|こわ}れます, {汚|よご}れます, {落|お}ちます, {集|あつ}まります, {混|こ}みます, すきます, {並|なら}びます…',
          examples: [
            { en: '{入|い}り{口|ぐち}に{人|ひと}がたくさん{並|なら}んでいます。', ro: 'Iriguchi ni hito ga takusan narande imasu.', vi: 'Ở cửa vào nhiều người đang xếp hàng. — câu mẫu của sách' },
            { en: 'あっ、{電車|でんしゃ}が{止|と}まっています。', ro: 'A, densha ga tomatte imasu.', vi: 'Ơ, tàu đang dừng kìa.' },
            { en: 'あのう、コップが{汚|よご}れています。', ro: 'Anou, koppu ga yogorete imasu.', vi: 'Dạ, cốc bị bẩn.' },
            { en: 'このお{皿|さら}は{割|わ}れています。', ro: 'Kono osara wa warete imasu.', vi: 'Cái đĩa này bị vỡ.' },
            { en: '{店|みせ}が{閉|し}まっています。', ro: 'Mise ga shimatte imasu.', vi: 'Cửa hàng đang đóng cửa.' },
            { en: 'トイレの{電気|でんき}が{消|き}えています。', ro: 'Toire no denki ga kiete imasu.', vi: 'Đèn nhà vệ sinh đang tắt.' },
            { en: 'エアコンが{壊|こわ}れています。', ro: 'Eakon ga kowarete imasu.', vi: 'Điều hoà bị hỏng.' },
            { en: '{下|した}にフォークが{落|お}ちていますよ。', ro: 'Shita ni fooku ga ochite imasu yo.', vi: 'Dưới sàn có cái dĩa rơi kìa.' },
            { en: 'この{電車|でんしゃ}はすいています。あの{電車|でんしゃ}は{混|こ}んでいます。', ro: 'Kono densha wa suite imasu. Ano densha wa konde imasu.', vi: 'Tàu này vắng. Tàu kia đông.' },
          ],
        },
        {
          formula: 'Tự động từ + ています (trạng thái) ↔ tha động từ + ています (đang làm)',
          vi: '**{窓|まど}が{閉|し}まっています** = cửa sổ đang đóng (trạng thái, không quan tâm ai đóng). **{窓|まど}を{閉|し}めています** = (ai đó) đang đóng cửa sổ (hành động đang diễn ra). Trợ từ **が ↔ を** là dấu hiệu.',
          examples: [
            { en: '{電気|でんき}が{消|き}えています。', ro: 'Denki ga kiete imasu.', vi: 'Đèn đang tắt. (trạng thái)' },
            { en: '{店員|てんいん}さんが{電気|でんき}を{消|け}しています。', ro: 'Ten\'in-san ga denki o keshite imasu.', vi: 'Nhân viên đang tắt đèn. (hành động)' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Tổng kết mọi cách dùng ～ています trong cả sách',
      head: ['Nghĩa', 'Bài (ポイント)', 'Ví dụ'],
      rows: [
        ['Đang làm (hành động đang diễn ra)', 'B7 (64), B10 (90)', '{今|いま}、{本|ほん}を{読|よ}んでいます。サルがバナナを{食|た}べています。'],
        ['Nơi ở, nghề nghiệp', 'B8 (72, 73)', '{東京|とうきょう}に{住|す}んでいます。{銀行|ぎんこう}で{働|はたら}いています。'],
        ['Chưa làm', 'B10 (91)', 'まだ{昼|ひる}ご{飯|はん}を{食|た}べていません。'],
        ['Thói quen', 'B11 (98)', '{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}んでいます。'],
        ['Đang mặc, đeo', 'B13 (110)', '{黄色|きいろ}いシャツを{着|き}ています。'],
        ['Biết', 'B13 (111)', '{知|し}っています／{知|し}りません'],
        ['**Trạng thái còn lại (tự động từ)**', '**B15 (122)**', '{電車|でんしゃ}が{止|と}まっています。{人|ひと}が{並|なら}んでいます。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp: tả cảnh rồi đề nghị (言ってみよう p.264)',
      lines: [
        { who: 'A', role: 'a', text: 'あっ、あの{店|みせ}、{閉|し}まっていますよ。', ro: 'A, ano mise, shimatte imasu yo.', vi: 'Ơ, quán kia đóng cửa rồi.' },
        { who: 'B', role: 'b', text: '{本当|ほんとう}だ。', ro: 'Hontou da.', vi: 'Thật này.' },
        { who: 'A', role: 'a', text: 'ほかの{店|みせ}へ{行|い}きませんか。', ro: 'Hoka no mise e ikimasen ka.', vi: 'Mình sang quán khác không?' },
        { who: 'B', role: 'b', text: 'そうですね。', ro: 'Sou desu ne.', vi: 'Ừ nhỉ.' },
        { who: 'A', role: 'a', text: 'バス{停|てい}に{人|ひと}がたくさん{並|なら}んでいますね。', ro: 'Basutei ni hito ga takusan narande imasu ne.', vi: 'Ở bến xe buýt người xếp hàng đông nhỉ.' },
        { who: 'B', role: 'b', text: 'じゃ、タクシーで{行|い}きませんか。', ro: 'Ja, takushii de ikimasen ka.', vi: 'Vậy đi taxi không?' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — あっ、___ています。——___ませんか。',
      head: ['Cảnh', 'Tả (ポイント 122)', 'Đề nghị'],
      rows: [
        ['Tàu dừng vì tai nạn', '{電車|でんしゃ}が{止|と}まっています。', 'バスで{行|い}きませんか。'],
        ['Cửa hàng đóng', '{店|みせ}が{閉|し}まっています。', 'ほかの{店|みせ}へ{行|い}きませんか。'],
        ['Hàng dài ở bến xe buýt', '{人|ひと}がたくさん{並|なら}んでいます。', 'タクシーで{行|い}きませんか。'],
        ['Đám đông tụ tập', '{人|ひと}がたくさん{集|あつ}まっています。', 'あっちへ{行|い}きませんか。'],
        ['Nhà hàng kín khách', 'レストランが{混|こ}んでいます。', 'ほかの{店|みせ}で{食|た}べませんか。'],
        ['Tháp sáng đèn', '{東京|とうきょう}タワーの{電気|でんき}がついています。', '{写真|しゃしん}を{撮|と}りませんか。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ～ています (trạng thái)',
      items: [
        '~~{電車|でんしゃ}を{止|と}まっています~~ → **{電車|でんしゃ}が{止|と}まっています** (tự động từ đi với が).',
        '~~コップが{汚|よご}れます~~ (khi đang nhìn cái cốc bẩn) → **{汚|よご}れています**. Thể ます = việc sẽ xảy ra / thói quen; thấy **trạng thái trước mắt** thì dùng ～ています.',
        '~~コップが{汚|きたな}いています~~ → tính từ không có ～ています: **コップが{汚|きたな}いです** hoặc **{汚|よご}れています**.',
        '**{混|こ}んでいます ↔ {混|こ}みます**: "Cuối tuần thường đông" (thói quen) = {週末|しゅうまつ}は{混|こ}みます; "Bây giờ đang đông" = {今|いま}、{混|こ}んでいます.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 15 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi / câu nói', 'Tình huống', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['ニュースを{見|み}ましたか。', 'Bạn hỏi có xem tin không', 'いいえ。——{台風|たいふう}で{電車|でんしゃ}が{止|と}まったそうです。', '119, 124'],
        ['{知|し}っていますか。～そうですよ。', 'Nghe tin', 'えっ、{本当|ほんとう}ですか。／{心配|しんぱい}ですね。／よかったですね。', '119'],
        ['{明日|あした}の{天気|てんき}はどうですか。', 'Hỏi thời tiết', '{天気予報|てんきよほう}で{見|み}ましたが、{雨|あめ}だそうです。', '119'],
        ['{雨|あめ}が{降|ふ}ったら、どうしますか。', 'Hỏi điều kiện', '{雨|あめ}が{降|ふ}ったら、うちにいます。', '120'],
        ['{雨|あめ}が{降|ふ}っても、{行|い}きますか。', 'Hỏi "dù … vẫn"', 'はい、{雨|あめ}が{降|ふ}っても、{行|い}きます。', '121'],
        ['{人|ひと}が{多|おお}いと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。', 'Bạn lo', '{人|ひと}が{多|おお}くても、{行|い}きたいです。', '121, 123'],
        ['どう{思|おも}いますか。', 'Hỏi đoán', 'きっと／たぶん～と{思|おも}います。', '123'],
        ['どうしたんですか。', 'Thấy chuyện lạ ngoài phố', '{電車|でんしゃ}が{止|と}まっているんです。', '122 (+104)'],
      ],
    },
    {
      t: 'build',
      id: 'b15-np-ghep',
      title: 'Ghép câu — dùng đủ 6 điểm ngữ pháp',
      items: [
        { vi: 'Nghe nói ngày mai bão đến.', chips: ['{明日|あした}、', '{台風|たいふう}が', '{来|く}る', 'そうです', '{来|き}ます', '{来|き}た'], answer: ['{明日|あした}、', '{台風|たいふう}が', '{来|く}る', 'そうです'], ro: 'Ashita, taifuu ga kuru sou desu.' },
        { vi: 'Nghe nói tháng sau bảo tàng miễn phí.', chips: ['{来月|らいげつ}、', '{美術館|びじゅつかん}は', '{無料|むりょう}', 'だそうです', 'なそうです', 'そうです'], answer: ['{来月|らいげつ}、', '{美術館|びじゅつかん}は', '{無料|むりょう}', 'だそうです'], ro: 'Raigetsu, bijutsukan wa muryou da sou desu.' },
        { vi: 'Vì động đất mà toà nhà bị đổ.', chips: ['{地震|じしん}で', 'ビルが', '{倒|たお}れました', '{地震|じしん}に', 'ビルを'], answer: ['{地震|じしん}で', 'ビルが', '{倒|たお}れました'], ro: 'Jishin de biru ga taoremashita.' },
        { vi: 'Nếu có thời gian thì đi cùng tôi không?', chips: ['{時間|じかん}が', 'あったら、', '{一緒|いっしょ}に', '{行|い}きませんか', 'あるたら、', 'あっても、'], answer: ['{時間|じかん}が', 'あったら、', '{一緒|いっしょ}に', '{行|い}きませんか'], ro: 'Jikan ga attara, issho ni ikimasen ka.' },
        { vi: 'Nếu rẻ thì tôi muốn mua máy tính.', chips: ['{安|やす}かったら、', 'パソコンを', '{買|か}いたいです', '{安|やす}いだったら、', '{安|やす}くても、'], answer: ['{安|やす}かったら、', 'パソコンを', '{買|か}いたいです'], ro: 'Yasukattara, pasokon o kaitai desu.' },
        { vi: 'Nếu mưa thì trận đấu bị huỷ.', chips: ['{雨|あめ}', 'だったら、', '{試合|しあい}は', '{中止|ちゅうし}です', 'でも、', 'たら、'], answer: ['{雨|あめ}', 'だったら、', '{試合|しあい}は', '{中止|ちゅうし}です'], ro: 'Ame dattara, shiai wa chuushi desu.' },
        { vi: 'Dù mưa trận đấu vẫn có.', chips: ['{雨|あめ}が', '{降|ふ}っても、', '{試合|しあい}は', 'あります', '{降|ふ}ったら、', '{降|ふ}りても、'], answer: ['{雨|あめ}が', '{降|ふ}っても、', '{試合|しあい}は', 'あります'], ro: 'Ame ga futte mo, shiai wa arimasu.' },
        { vi: 'Dù đắt tôi vẫn muốn có kim từ điển mới.', chips: ['{高|たか}くても、', '{新|あたら}しい', '{電子辞書|でんしじしょ}が', 'ほしいです', '{高|たか}いでも、', '{高|たか}かったら、'], answer: ['{高|たか}くても、', '{新|あたら}しい', '{電子辞書|でんしじしょ}が', 'ほしいです'], ro: 'Takakute mo, atarashii denshi jisho ga hoshii desu.' },
        { vi: 'Dù vất vả tôi vẫn muốn leo núi Phú Sĩ.', chips: ['{大変|たいへん}', 'でも、', '{富士山|ふじさん}に', '{登|のぼ}りたいです', 'くても、', '{富士山|ふじさん}を'], answer: ['{大変|たいへん}', 'でも、', '{富士山|ふじさん}に', '{登|のぼ}りたいです'], ro: 'Taihen demo, Fujisan ni noboritai desu.' },
        { vi: 'Tôi nghĩ mì ramen quán đó chắc chắn ngon.', chips: ['あの{店|みせ}の', 'ラーメンは', 'きっと', 'おいしいと', '{思|おも}います', 'おいしいだと'], answer: ['あの{店|みせ}の', 'ラーメンは', 'きっと', 'おいしいと', '{思|おも}います'], ro: 'Ano mise no raamen wa kitto oishii to omoimasu.' },
        { vi: 'Tôi nghĩ có lẽ Carlos không đến bữa tiệc.', chips: ['カルロスさんは', 'たぶん', 'パーティーに', '{来|こ}ないと', '{思|おも}います', '{来|く}ると', '{思|おも}いません'], answer: ['カルロスさんは', 'たぶん', 'パーティーに', '{来|こ}ないと', '{思|おも}います'], ro: 'Karurosu-san wa tabun paatii ni konai to omoimasu.' },
        { vi: 'Ở cửa vào nhiều người đang xếp hàng.', chips: ['{入|い}り{口|ぐち}に', '{人|ひと}が', 'たくさん', '{並|なら}んでいます', '{並|なら}びます', '{人|ひと}を'], answer: ['{入|い}り{口|ぐち}に', '{人|ひと}が', 'たくさん', '{並|なら}んでいます'], ro: 'Iriguchi ni hito ga takusan narande imasu.' },
        { vi: 'Vì tai nạn nên tàu đang dừng.', chips: ['{事故|じこ}で', '{電車|でんしゃ}が', '{止|と}まっています', '{電車|でんしゃ}を', '{止|と}めています'], answer: ['{事故|じこ}で', '{電車|でんしゃ}が', '{止|と}まっています'], ro: 'Jiko de densha ga tomatte imasu.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 15',
      items: [
        { q: '"Nghe nói ngày mai trời mưa" (N):', options: ['{明日|あした}は{雨|あめ}そうです。', '{明日|あした}は{雨|あめ}だそうです。', '{明日|あした}は{雨|あめ}なそうです。', '{明日|あした}は{雨|あめ}ですそうです。'], correct: 1, why: 'N + **だ**そうです (ポイント 119).' },
        { q: '"Nghe nói tuần trước anh Nishikawa nhập viện":', options: ['{入院|にゅういん}するそうでした。', '{入院|にゅういん}したそうです。', '{入院|にゅういん}しましたそうです。', '{入院|にゅういん}しそうです。'], correct: 1, why: 'Quá khứ ở phần thể thường: **した**そうです.' },
        { q: '「{雨|あめ}が{降|ふ}りそうです」 nghĩa là:', options: ['Nghe nói trời sẽ mưa', 'Trông như sắp mưa', 'Dù mưa', 'Nếu mưa'], correct: 1, why: 'ます bỏ ます + そう = **trông như sắp**. "Nghe nói" phải là **{降|ふ}る**そうです.' },
        { q: '「{台風|たいふう}＿{電車|でんしゃ}が{止|と}まりました。」', options: ['に', 'を', 'で', 'が'], correct: 2, why: 'Nguyên nhân: N **で** (ポイント 124).' },
        { q: 'Thể たら của {行|い}きます:', options: ['{行|い}きたら', '{行|い}ったら', '{行|い}くたら', '{行|い}いたら'], correct: 1, why: 'Thể た 行った + ら.' },
        { q: 'Thể たら của いい:', options: ['いいたら', 'いかったら', 'よかったら', 'いいだったら'], correct: 2, why: 'いい chia theo よ: **よかったら**.' },
        { q: '「＿、{一緒|いっしょ}に{行|い}きませんか。」 (nếu rảnh)', options: ['{暇|ひま}たら', '{暇|ひま}だったら', '{暇|ひま}かったら', '{暇|ひま}でも'], correct: 1, why: 'ナA + **だったら**.' },
        { q: '「{雨|あめ}が＿、{試合|しあい}はあります。」 (dù mưa vẫn có)', options: ['{降|ふ}ったら', '{降|ふ}っても', '{降|ふ}りても', '{降|ふ}るても'], correct: 1, why: 'Thể て 降って + **も** (ポイント 121).' },
        { q: '「＿、{新|あたら}しい{電子辞書|でんしじしょ}がほしいです。」 (dù đắt)', options: ['{高|たか}いでも', '{高|たか}くても', '{高|たか}かっても', '{高|たか}いても'], correct: 1, why: 'イA: い → **くても**.' },
        { q: '「{無料|むりょう}＿、{行|い}きたいです。」 (dù không miễn phí)', options: ['じゃなくても', 'じゃないでも', 'でなかったら', 'じゃなかったら'], correct: 0, why: 'N phủ định + ても: **じゃなくても**.' },
        { q: '"Tôi nghĩ lễ hội pháo hoa chắc chắn đẹp":', options: ['きっときれいと{思|おも}います。', 'きっときれいだと{思|おも}います。', 'きっときれいなと{思|おも}います。', 'きっときれいですと{思|おも}います。'], correct: 1, why: 'ナA + **だ** + と思います.' },
        { q: 'Đoán phủ định tự nhiên nhất: "Tôi nghĩ có lẽ anh ấy không đến"', options: ['たぶん{来|く}ると{思|おも}いません。', 'たぶん{来|こ}ないと{思|おも}います。', 'たぶん{来|き}ませんと{思|おも}います。', 'たぶん{来|こ}ないだと{思|おも}います。'], correct: 1, why: 'Phủ định đặt trong phần đoán: **来ない**と思います.' },
        { q: 'Nhìn thấy tàu đang đứng yên, bạn nói:', options: ['{電車|でんしゃ}が{止|と}まります。', '{電車|でんしゃ}が{止|と}まっています。', '{電車|でんしゃ}を{止|と}めています。', '{電車|でんしゃ}が{止|と}めます。'], correct: 1, why: 'Trạng thái trước mắt: tự động từ + **ています** (ポイント 122).' },
        { q: '「{窓|まど}＿{閉|し}まっています。」', options: ['を', 'が', 'で', 'に'], correct: 1, why: 'Tự động từ 閉まります đi với **が**.' },
        { q: '「きっと」 và 「たぶん」 — câu đúng:', options: ['きっと = có lẽ; たぶん = chắc chắn', 'きっと = chắc chắn; たぶん = có lẽ', 'Cả hai = nếu', 'Cả hai = dù'], correct: 1, why: 'きっと mạnh hơn たぶん.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b15-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 15',
  goal: 'Nhận mặt và đọc đúng mọi chữ Hán trong 58 từ của Bài 15 (tin tức, thời tiết, kế hoạch, cảnh ngoài phố), đọc được câu và đoạn văn không furigana như đề thi, và viết tay được các chữ ✍ hay gặp.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, KHÔNG furigana (12 điểm)** — đó là chỗ nhiều bạn mất điểm. Học theo **cả từ** ({台風|たいふう}, {無料|むりょう}) chứ đừng học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({昔|むかし}, {止|と}まります). Cột **Mức**: 👁 **nhận mặt** = đọc và hiểu là đủ (ưu tiên cho phần đọc); ✍ **nên viết** = ít nét, gặp rất nhiều, nên tập viết tay.',
    },
    {
      t: 'table',
      caption: '1. Tin tức, thời tiết, sự kiện — danh từ (chủ đề 1)',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['大', 'ダイ・タイ', 'おお(きい)', 'ĐẠI (to)', '～{大会|たいかい}', '✍'],
        ['会', 'カイ', 'あ(う)', 'HỘI (gặp)', '～{大会|たいかい} · {会場|かいじょう}', '✍'],
        ['中', 'チュウ', 'なか', 'TRUNG (giữa)', '{中止|ちゅうし}', '✍'],
        ['止', 'シ', 'と(まる)・と(める)', 'CHỈ (dừng)', '{中止|ちゅうし} · {止|と}まります', '✍'],
        ['本', 'ホン', 'もと', 'BẢN (gốc)', '{本当|ほんとう}', '✍'],
        ['夕', 'セキ', 'ゆう', 'TỊCH (chiều tối)', '{夕方|ゆうがた}', '✍'],
        ['方', 'ホウ', 'かた', 'PHƯƠNG (hướng)', '{夕方|ゆうがた} (がた)', '✍'],
        ['地', 'チ・ジ', '—', 'ĐỊA (đất)', '{地震|じしん} (ジ)', '✍'],
        ['曇', 'ドン', 'くも(る)', 'ĐÀM (mây)', '{曇|くも}り', '👁'],
        ['台', 'ダイ・タイ', '—', 'ĐÀI', '{台風|たいふう} (タイ)', '👁'],
        ['風', 'フウ・フ', 'かぜ', 'PHONG (gió)', '{台風|たいふう} · {風|かぜ}', '👁'],
        ['震', 'シン', 'ふる(える)', 'CHẤN (rung)', '{地震|じしん}', '👁'],
        ['事', 'ジ', 'こと', 'SỰ (việc)', '{事故|じこ}', '👁'],
        ['故', 'コ', 'ゆえ', 'CỐ (cớ, sự cố)', '{事故|じこ}', '👁'],
        ['当', 'トウ', 'あ(たる)', 'ĐƯƠNG', '{本当|ほんとう}', '👁'],
        ['昔', 'セキ', 'むかし', 'TÍCH (xưa)', '{昔|むかし}', '👁'],
        ['無', 'ム・ブ', 'な(い)', 'VÔ (không)', '{無料|むりょう}', '👁'],
        ['料', 'リョウ', '—', 'LIỆU (phí)', '{無料|むりょう}', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '2. Tin tức — động từ, tính từ (chủ đề 1)',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['入', 'ニュウ', 'はい(る)・い(れる)', 'NHẬP (vào)', '{入院|にゅういん}', '✍'],
        ['心', 'シン', 'こころ', 'TÂM (lòng)', '{心配|しんぱい}', '✍'],
        ['死', 'シ', 'し(ぬ)', 'TỬ (chết)', '{死|し}にます', '👁'],
        ['亡', 'ボウ', 'な(くなる)', 'VONG (mất)', '{亡|な}くなります', '👁'],
        ['始', 'シ', 'はじ(まる)・はじ(める)', 'THỦY (bắt đầu)', '{始|はじ}まります', '👁'],
        ['降', 'コウ', 'ふ(る)・お(りる)', 'GIÁNG (rơi, xuống)', '{降|ふ}ります', '👁'],
        ['勝', 'ショウ', 'か(つ)', 'THẮNG', '{勝|か}ちます', '👁'],
        ['負', 'フ', 'ま(ける)', 'PHỤ (thua)', '{負|ま}けます', '👁'],
        ['倒', 'トウ', 'たお(れる)', 'ĐẢO (đổ)', '{倒|たお}れます', '👁'],
        ['割', 'カツ', 'わ(れる)', 'CÁT (vỡ, chia)', '{割|わ}れます', '👁'],
        ['結', 'ケツ', 'むす(ぶ)', 'KẾT (buộc)', '{結婚|けっこん} (けっ)', '👁'],
        ['婚', 'コン', '—', 'HÔN (cưới)', '{結婚|けっこん}', '👁'],
        ['院', 'イン', '—', 'VIỆN', '{入院|にゅういん}', '👁'],
        ['怖', 'フ', 'こわ(い)', 'BỐ (sợ)', '{怖|こわ}い', '👁'],
        ['配', 'ハイ', 'くば(る)', 'PHỐI (phân phát)', '{心配|しんぱい} (ぱい)', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '3. Xem tạp chí, bàn kế hoạch (chủ đề 2)',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['間', 'カン', 'ま・あいだ', 'GIAN (khoảng)', '{間|ま}に{合|あ}います', '✍'],
        ['引', 'イン', 'ひ(く)', 'DẪN (kéo)', '～{引|び}き', '✍'],
        ['強', 'キョウ', 'つよ(い)', 'CƯỜNG (mạnh)', '{強|つよ}い', '✍'],
        ['席', 'セキ', '—', 'TỊCH (chỗ ngồi)', '{席|せき}', '👁'],
        ['急', 'キュウ', 'いそ(ぐ)', 'CẤP (gấp)', '{急|いそ}ぎます', '👁'],
        ['混', 'コン', 'こ(む)', 'HỖN (lẫn, đông)', '{混|こ}みます', '👁'],
        ['合', 'ゴウ', 'あ(う)', 'HỢP', '{間|ま}に{合|あ}います', '👁'],
        ['晴', 'セイ', 'は(れる)', 'TÌNH (nắng)', '{晴|は}れます', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '4. Cảnh ngoài phố (chủ đề 3) + bài đọc, bài nghe',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['出', 'シュツ', 'で(る)・だ(す)', 'XUẤT (ra)', '{思|おも}い{出|で}', '✍'],
        ['後', 'ゴ・コウ', 'うし(ろ)・あと', 'HẬU (sau)', '{最後|さいご}', '✍'],
        ['場', 'ジョウ', 'ば', 'TRƯỜNG (nơi)', '{会場|かいじょう}', '✍'],
        ['集', 'シュウ', 'あつ(まる)・あつ(める)', 'TẬP (tụ)', '{集|あつ}まります', '👁'],
        ['閉', 'ヘイ', 'し(まる)・し(める)', 'BẾ (đóng)', '{閉|し}まります', '👁'],
        ['落', 'ラク', 'お(ちる)', 'LẠC (rơi)', '{落|お}ちます', '👁'],
        ['消', 'ショウ', 'き(える)・け(す)', 'TIÊU (tắt)', '{消|き}えます', '👁'],
        ['壊', 'カイ', 'こわ(れる)', 'HOẠI (hỏng)', '{壊|こわ}れます', '👁'],
        ['汚', 'オ', 'よご(れる)・きたな(い)', 'Ô (bẩn)', '{汚|よご}れます', '👁'],
        ['位', 'イ', 'くらい', 'VỊ (thứ hạng)', '～{位|い}', '👁'],
        ['最', 'サイ', 'もっと(も)', 'TỐI (nhất)', '{最後|さいご}', '👁'],
        ['思', 'シ', 'おも(う)', 'TƯ (nghĩ)', '{思|おも}い{出|で}', '👁'],
        ['緊', 'キン', '—', 'KHẨN', '{緊張|きんちょう}', '👁'],
        ['張', 'チョウ', 'は(る)', 'TRƯƠNG (căng)', '{緊張|きんちょう}', '👁'],
        ['笑', 'ショウ', 'わら(う)', 'TIẾU (cười)', '{笑|わら}います', '👁'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 地震 = ĐỊA CHẤN (động đất), 事故 = SỰ CỐ (tai nạn), 中止 = TRUNG CHỈ (dừng giữa chừng = huỷ), 無料 = VÔ LIỆU (không phí = miễn phí), 入院 = NHẬP VIỆN, 結婚 = KẾT HÔN, 心配 = TÂM PHỐI (lo lắng), 大会 = ĐẠI HỘI, 最後 = TỐI HẬU (cuối cùng), 緊張 = KHẨN TRƯƠNG (hồi hộp), 会場 = HỘI TRƯỜNG.',
        '**Cặp trái nghĩa đi cùng nhau**: 勝 thắng ↔ 負 thua · 集 tụ ↔ (散 tán) · 始 bắt đầu ↔ (終 kết thúc) · 晴 nắng ↔ 曇 râm ↔ 雨 mưa.',
        '**曇** = 日 (mặt trời) + 雲 (mây): mặt trời bị mây che → trời râm. **晴** = 日 + 青 (xanh): trời xanh có nắng.',
        '**Đọc đặc biệt**: 夕方 ゆう**がた** (方 đục) · 結婚 **けっ**こん (âm ngắt) · 心配 しん**ぱい** (配 thành ぱ) · ～引き **び**き · 思い出 おもい**で** · 台風 **たい**ふう · 地震 **じ**しん (地 đọc ジ).',
        '**降 có hai âm Kun**: {雨|あめ}が**{降|ふ}**ります (mưa rơi) · バスを**{降|お}**ります (xuống xe). Đọc theo từ đi cùng.',
      ],
    },

    /* ── Đứng riêng hay đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Cùng một chữ Hán, **đứng riêng** (thường có đuôi kana) thì đọc âm **Kun**; **ghép với chữ Hán khác** thì thường đọc âm **On**. Bảng dưới lấy chữ của Bài 15, cột phải là những từ ghép bạn sẽ gặp rất sớm (nhiều từ đã học ở bài trước) — đọc hàng ngang để thấy cùng một chữ đổi âm thế nào.',
    },
    {
      t: 'table',
      caption: 'Kun khi đứng riêng ↔ On trong từ ghép',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)'],
      rows: [
        ['風', '{風|かぜ} — gió', '{台風|たいふう} — bão · お{風呂|ふろ} (フ)'],
        ['止', '{止|と}まります／{止|と}めます — dừng', '{中止|ちゅうし} — huỷ · {禁止|きんし} — cấm'],
        ['中', '{中|なか} — bên trong', '{中止|ちゅうし} · {中学生|ちゅうがくせい} — học sinh cấp 2'],
        ['大', '{大|おお}きい — to', '～{大会|たいかい} · {大学|だいがく} (ダイ) · {大切|たいせつ} (タイ)'],
        ['会', '{会|あ}います — gặp', '{大会|たいかい} · {会場|かいじょう} · {会社|かいしゃ}'],
        ['事', '{事|こと} — việc', '{事故|じこ} — tai nạn · {食事|しょくじ} — bữa ăn'],
        ['本', '{本|もと} — gốc (ít gặp)', '{本当|ほんとう} — thật · {日本|にほん} · {本|ほん} — sách (đứng riêng mà đọc On!)'],
        ['無', '{無|な}い — không có (thường viết ない)', '{無料|むりょう} — miễn phí · {無理|むり} — quá sức'],
        ['夕', '{夕|ゆう}べ — tối qua', '{夕方|ゆうがた} · {夕食|ゆうしょく} — bữa tối'],
        ['方', '{方|かた} — vị, người (lịch sự) · {使|つか}い{方|かた} — cách dùng', '{夕方|ゆうがた} (がた) · {方法|ほうほう} — phương pháp'],
        ['入', '{入|はい}ります — vào · {入|い}れます — cho vào', '{入院|にゅういん} — nhập viện · {入場料|にゅうじょうりょう} — vé vào cửa (B14)'],
        ['心', '{心|こころ} — trái tim, tấm lòng', '{心配|しんぱい} — lo lắng · {安心|あんしん} — yên tâm'],
        ['死', '{死|し}にます — chết (Kun し trùng âm On シ)', '{死亡|しぼう} — tử vong (tin tức)'],
        ['亡', '{亡|な}くなります — qua đời', '{死亡|しぼう} — tử vong'],
        ['始', '{始|はじ}まります — bắt đầu', '{開始|かいし} — khai mạc, bắt đầu (văn viết)'],
        ['降', '{降|ふ}ります — rơi · {降|お}ります — xuống xe', '{以降|いこう} — trở về sau'],
        ['勝', '{勝|か}ちます — thắng', '{優勝|ゆうしょう} — vô địch'],
        ['負', '{負|ま}けます — thua', '{勝負|しょうぶ} — thắng thua'],
        ['結', '{結|むす}びます — buộc, thắt', '{結婚|けっこん} (ケツ → けっ) · {結果|けっか} — kết quả'],
        ['急', '{急|いそ}ぎます — vội', '{急行|きゅうこう} — tàu nhanh · {特急|とっきゅう} — tàu tốc hành'],
        ['混', '{混|こ}みます — đông', '{混雑|こんざつ} — đông đúc, ùn tắc'],
        ['間', '{間|ま}に{合|あ}います · {間|あいだ} — ở giữa', '{時間|じかん} — thời gian · {1週間|いっしゅうかん} — 1 tuần'],
        ['合', '{合|あ}います — hợp · {間|ま}に{合|あ}います', '{試合|しあい} — trận đấu (あい: Kun!) · {集合|しゅうごう} — tập hợp'],
        ['晴', '{晴|は}れます — nắng', '{晴天|せいてん} — trời quang'],
        ['引', '{引|ひ}きます — kéo · ～{引|び}き — giảm', '{引退|いんたい} — giải nghệ'],
        ['強', '{強|つよ}い — mạnh', '{勉強|べんきょう} — học (キョウ)'],
        ['集', '{集|あつ}まります — tụ tập', '{集合|しゅうごう} — tập hợp · {特集|とくしゅう} — chuyên đề (tạp chí)'],
        ['閉', '{閉|し}まります／{閉|し}めます — đóng', '{閉店|へいてん} — đóng cửa hàng'],
        ['落', '{落|お}ちます — rơi', '{落語|らくご} — kể chuyện hài truyền thống'],
        ['消', '{消|き}えます — tắt · {消|け}します — tắt (cái gì)', '{消防車|しょうぼうしゃ} — xe cứu hoả · {消|け}しゴム (Kun)'],
        ['後', '{後|あと}で — lát nữa · {後|うし}ろ — phía sau', '{最後|さいご} — cuối cùng · {午後|ごご} — buổi chiều'],
        ['場', '{場所|ばしょ} — địa điểm (B13)', '{会場|かいじょう} · {駐車場|ちゅうしゃじょう} — bãi đỗ xe'],
        ['思', '{思|おも}います — nghĩ · {思|おも}い{出|で}', '{意思|いし} — ý chí'],
        ['笑', '{笑|わら}います — cười', '{笑顔|えがお} — khuôn mặt tươi cười (đặc biệt)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp trong bài (thuộc lòng)',
      items: [
        '**Âm đục khi ghép (連濁)**: {夕|ゆう} + {方|かた} → ゆう**が**た · ～{引|ひ}き → {10|じゅっ}パーセント**び**き · {思|おも}い + {出|で} → おもいで.',
        '**Âm ngắt っ**: {結|けつ} + {婚|こん} → **けっ**こん. **Âm đổi ハ → パ sau ン**: {心|しん} + {配|はい} → しん**ぱ**い.',
        '**Kun + Kun trong một từ**: {間|ま}に{合|あ}います (ま + あう), {試合|しあい} (し On + あい Kun), {思|おも}い{出|で} (おもい + で).',
        '**Cùng âm Kun khác chữ**: {壊|こわ}れます (hỏng) ↔ {怖|こわ}い (sợ) — cùng đọc こわ; {風|かぜ} (gió) ↔ {風邪|かぜ} (cảm).',
        '**Một chữ, hai đuôi → hai động từ**: {止|と}**まり**ます (tự) / {止|と}**め**ます (tha); {閉|し}**まり**ます / {閉|し}**め**ます; {消|き}**え**ます / {消|け}**し**ます (chữ 消 đổi âm き ↔ け!); {集|あつ}**まり**ます / {集|あつ}**め**ます.',
      ],
    },

    {
      t: 'mcq',
      id: 'b15-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '台風', options: ['だいふう', 'たいふう', 'たいかぜ', 'だいかぜ'], correct: 1, why: '台 タイ + 風 フウ = **たいふう**.' },
        { q: '地震', options: ['ちしん', 'じしん', 'じじん', 'ちじん'], correct: 1, why: '地 đọc **ジ** ở đây: じしん.' },
        { q: '事故', options: ['じこ', 'ことこ', 'じご', 'しこ'], correct: 0, why: '**じこ** — tai nạn.' },
        { q: '中止', options: ['なかし', 'ちゅうし', 'ちゅうじ', 'ちゅし'], correct: 1, why: '**ちゅうし** (trường âm).' },
        { q: '本当', options: ['ほんと', 'ほんとう', 'ほんどう', 'もととう'], correct: 1, why: '**ほんとう**.' },
        { q: '無料', options: ['むりょう', 'むりょ', 'ぶりょう', 'ないりょう'], correct: 0, why: '**むりょう** — miễn phí.' },
        { q: '夕方', options: ['ゆうかた', 'ゆうがた', 'ゆがた', 'せきほう'], correct: 1, why: '方 đục: ゆう**が**た.' },
        { q: '昔', options: ['むかし', 'せき', 'むか', 'ひかし'], correct: 0, why: '**むかし** — ngày xưa.' },
        { q: '曇り', options: ['くもり', 'どんり', 'くむり', 'はれり'], correct: 0, why: '**くもり** — trời râm.' },
        { q: '入院', options: ['にゅういん', 'にゅいん', 'はいいん', 'にゅうえん'], correct: 0, why: '**にゅういん**.' },
        { q: '結婚', options: ['けつこん', 'けっこん', 'けこん', 'けっごん'], correct: 1, why: 'Âm ngắt: **けっこん**.' },
        { q: '心配', options: ['しんはい', 'しんぱい', 'しんばい', 'こころくば'], correct: 1, why: 'Sau ん, は → **ぱ**: しんぱい.' },
        { q: '亡くなります', options: ['なくなります', 'しくなります', 'ぼうくなります', 'なぐなります'], correct: 0, why: '**なくなります** — qua đời.' },
        { q: '降ります（雨が）', options: ['おります', 'ふります', 'こうります', 'くだります'], correct: 1, why: 'Mưa rơi = **ふります**. (xuống xe = おります)' },
        { q: '勝ちます', options: ['まちます', 'かちます', 'しょうちます', 'かつます'], correct: 1, why: '**かちます** — thắng.' },
        { q: '負けます', options: ['まけます', 'ふけます', 'おけます', 'かけます'], correct: 0, why: '**まけます** — thua.' },
        { q: '倒れます', options: ['たおれます', 'とうれます', 'こわれます', 'たおします'], correct: 0, why: '**たおれます** — đổ.' },
        { q: '割れます', options: ['われます', 'かれます', 'はれます', 'さかれます'], correct: 0, why: '**われます** — vỡ.' },
        { q: '怖い', options: ['こわい', 'ふい', 'おそい', 'こいい'], correct: 0, why: '**こわい** — sợ.' },
        { q: '席', options: ['せき', 'しき', 'せつ', 'いす'], correct: 0, why: '**せき** — chỗ ngồi.' },
        { q: '混みます', options: ['こみます', 'こんみます', 'まみます', 'すみます'], correct: 0, why: '**こみます** — đông.' },
        { q: '間に合います', options: ['あいだにあいます', 'まにあいます', 'かんにあいます', 'まにごういます'], correct: 1, why: '**まにあいます** — kịp.' },
        { q: '晴れます', options: ['はれます', 'せいれます', 'ばれます', 'ひれます'], correct: 0, why: '**はれます** — nắng.' },
        { q: '強い', options: ['つよい', 'きょうい', 'よわい', 'つおい'], correct: 0, why: '**つよい** — mạnh.' },
        { q: '集まります', options: ['あつまります', 'しゅうまります', 'あつめます', 'たまります'], correct: 0, why: '**あつまります** — tụ tập (tự động từ).' },
        { q: '閉まります', options: ['しまります', 'とじまります', 'へいまります', 'しめます'], correct: 0, why: '**しまります** — đóng (tự động từ).' },
        { q: '消えます', options: ['けえます', 'きえます', 'しょうえます', 'けします'], correct: 1, why: 'Tự động từ **きえます**; tha động từ là けします.' },
        { q: '汚れます', options: ['よごれます', 'きたなれます', 'おれます', 'よごします'], correct: 0, why: '**よごれます** — bẩn.' },
        { q: '最後', options: ['さいご', 'さいこう', 'さいあと', 'もっとご'], correct: 0, why: '**さいご** — cuối cùng.' },
        { q: '緊張', options: ['きんちょう', 'きんちょ', 'けんちょう', 'きんじょう'], correct: 0, why: '**きんちょう** — hồi hộp.' },
        { q: '会場', options: ['かいじょう', 'かいば', 'あいば', 'かいしょう'], correct: 0, why: '**かいじょう** — nơi tổ chức.' },
        { q: '思い出', options: ['おもいで', 'おもいだ', 'しいで', 'おもいしゅつ'], correct: 0, why: '**おもいで** — kỷ niệm.' },
      ],
    },

    /* ── Đọc không furigana ── */
    { t: 'h', text: 'Từ chữ Hán hay gặp trong đề đọc — đọc KHÔNG furigana' },
    {
      t: 'p',
      text: 'Đề thi in chữ Hán **trần**, không có chữ nhỏ bên trên. Mỗi câu dưới đây hiện chữ Hán không furigana: đọc to cả câu → bấm hiện cách đọc + nghe → tự chấm. Chưa đọc được từ nào thì quay lại bảng chữ ở trên.',
    },
    {
      t: 'readkanji',
      id: 'b15-doc-kanji',
      title: 'Đọc to từng câu — chữ Hán Bài 15',
      note: 'Mỗi câu có ít nhất một từ chữ Hán của Bài 15. Chỗ hay sai: 地震 じしん, 夕方 ゆうがた, 結婚 けっこん, 心配 しんぱい, 降ります ふります, 消えます きえます, 間に合います まにあいます.',
      items: [
        { text: 'あした、{台風|たいふう}がくるそうです。', ro: 'Ashita, taifuu ga kuru sou desu.', vi: 'Nghe nói ngày mai bão đến.' },
        { text: 'きのうのよる、おおきい{地震|じしん}がありました。', ro: 'Kinou no yoru, ookii jishin ga arimashita.', vi: 'Tối qua có động đất lớn.' },
        { text: '{事故|じこ}ででんしゃが{止|と}まっています。', ro: 'Jiko de densha ga tomatte imasu.', vi: 'Vì tai nạn nên tàu đang dừng.' },
        { text: 'あめだったら、しあいは{中止|ちゅうし}です。', ro: 'Ame dattara, shiai wa chuushi desu.', vi: 'Nếu mưa thì trận đấu bị huỷ.' },
        { text: 'えっ、{本当|ほんとう}ですか。しりませんでした。', ro: 'E, hontou desu ka. Shirimasen deshita.', vi: 'Hả, thật à? Tôi không biết.' },
        { text: 'らいげつ、びじゅつかんは{無料|むりょう}だそうです。', ro: 'Raigetsu, bijutsukan wa muryou da sou desu.', vi: 'Nghe nói tháng sau bảo tàng miễn phí.' },
        { text: '{夕方|ゆうがた}から{雨|あめ}が{降|ふ}るそうです。', ro: 'Yuugata kara ame ga furu sou desu.', vi: 'Nghe nói từ chiều tối trời mưa.' },
        { text: 'あしたは{曇|くも}りですが、あさっては{晴|は}れるとおもいます。', ro: 'Ashita wa kumori desu ga, asatte wa hareru to omoimasu.', vi: 'Mai trời râm nhưng tôi nghĩ ngày kia sẽ nắng.' },
        { text: '{昔|むかし}、このまちにはおおきいおまつりがあったそうです。', ro: 'Mukashi, kono machi ni wa ookii omatsuri ga atta sou desu.', vi: 'Nghe nói ngày xưa thị trấn này có lễ hội lớn.' },
        { text: 'よこはまで{花火大会|はなびたいかい}があるそうですよ。', ro: 'Yokohama de hanabi taikai ga aru sou desu yo.', vi: 'Nghe nói ở Yokohama có lễ hội pháo hoa đấy.' },
        { text: 'せんしゅう、にしかわさんが{入院|にゅういん}したそうです。{心配|しんぱい}ですね。', ro: 'Senshuu, Nishikawa-san ga nyuuin shita sou desu. Shinpai desu ne.', vi: 'Nghe nói tuần trước anh Nishikawa nhập viện. Lo nhỉ.' },
        { text: 'カルロスさんはらいげつ{結婚|けっこん}するそうです。', ro: 'Karurosu-san wa raigetsu kekkon suru sou desu.', vi: 'Nghe nói tháng sau Carlos kết hôn.' },
        { text: 'じしんでビルが{倒|たお}れました。{怖|こわ}いですね。', ro: 'Jishin de biru ga taoremashita. Kowai desu ne.', vi: 'Vì động đất mà toà nhà đổ. Đáng sợ nhỉ.' },
        { text: 'ゆうめいなかしゅが{亡|な}くなったそうです。', ro: 'Yuumei na kashu ga nakunatta sou desu.', vi: 'Nghe nói một ca sĩ nổi tiếng đã qua đời.' },
        { text: 'わたしのチームはしあいに{勝|か}ちました。', ro: 'Watashi no chiimu wa shiai ni kachimashita.', vi: 'Đội tôi đã thắng trận.' },
        { text: 'きのうのしあいは{負|ま}けました。', ro: 'Kinou no shiai wa makemashita.', vi: 'Trận hôm qua thua rồi.' },
        { text: 'あさってからすもうが{始|はじ}まります。', ro: 'Asatte kara sumou ga hajimarimasu.', vi: 'Từ ngày kia giải sumo bắt đầu.' },
        { text: 'まどガラスが{割|わ}れています。', ro: 'Mado garasu ga warete imasu.', vi: 'Kính cửa sổ bị vỡ.' },
        { text: 'きょうは{風|かぜ}が{強|つよ}いですね。', ro: 'Kyou wa kaze ga tsuyoi desu ne.', vi: 'Hôm nay gió mạnh nhỉ.' },
        { text: 'もういい{席|せき}がないとおもいます。', ro: 'Mou ii seki ga nai to omoimasu.', vi: 'Tôi nghĩ không còn chỗ tốt nữa.' },
        { text: '{急|いそ}いだら、でんしゃに{間|ま}に{合|あ}うとおもいます。', ro: 'Isoidara, densha ni ma ni au to omoimasu.', vi: 'Tôi nghĩ nếu nhanh lên thì sẽ kịp tàu.' },
        { text: 'しゅうまつはレストランがとても{混|こ}んでいます。', ro: 'Shuumatsu wa resutoran ga totemo konde imasu.', vi: 'Cuối tuần nhà hàng rất đông.' },
        { text: 'あめのひは5パーセント{引|び}きだそうです。', ro: 'Ame no hi wa go paasento biki da sou desu.', vi: 'Nghe nói ngày mưa giảm 5%.' },
        { text: 'えきのまえにひとがたくさん{集|あつ}まっています。', ro: 'Eki no mae ni hito ga takusan atsumatte imasu.', vi: 'Trước ga có rất nhiều người tụ tập.' },
        { text: 'あのみせは{閉|し}まっていますね。でんきも{消|き}えています。', ro: 'Ano mise wa shimatte imasu ne. Denki mo kiete imasu.', vi: 'Quán kia đóng cửa nhỉ. Đèn cũng tắt.' },
        { text: 'あっ、さいふが{落|お}ちていますよ。', ro: 'A, saifu ga ochite imasu yo.', vi: 'Ơ, có cái ví rơi kìa.' },
        { text: 'このいすは{壊|こわ}れています。', ro: 'Kono isu wa kowarete imasu.', vi: 'Cái ghế này bị hỏng.' },
        { text: 'あのう、コップが{汚|よご}れています。', ro: 'Anou, koppu ga yogorete imasu.', vi: 'Dạ, cốc bị bẩn ạ.' },
        { text: 'とても{緊張|きんちょう}しましたが、{最後|さいご}までうたうことができました。', ro: 'Totemo kinchou shimashita ga, saigo made utau koto ga dekimashita.', vi: 'Tôi rất hồi hộp nhưng đã hát được đến cuối.' },
        { text: 'はなびたいかいの{会場|かいじょう}はひとがおおいとおもいます。', ro: 'Hanabi taikai no kaijou wa hito ga ooi to omoimasu.', vi: 'Tôi nghĩ nơi tổ chức lễ hội pháo hoa sẽ đông người.' },
        { text: 'みんながわたしのはなしをきいて、{笑|わら}いました。いい{思|おも}い{出|で}です。', ro: 'Minna ga watashi no hanashi o kiite, waraimashita. Ii omoide desu.', vi: 'Mọi người nghe chuyện của tôi rồi cười. Một kỷ niệm đẹp.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b15-doc-doan',
      title: 'Đọc to đoạn văn kiểu đề thi (30 giây chuẩn bị)',
      note: 'Mỗi đoạn ~100 chữ, khoảng 4 từ chữ Hán + vài từ katakana như đề thật. Đọc liền mạch, không dừng giữa từ.',
      items: [
        {
          text: 'けさ、テレビでニュースをみました。きのうのよる、{大|おお}きい{地震|じしん}があったそうです。{地震|じしん}でふるいビルが{倒|たお}れて、まどガラスもたくさん{割|わ}れたそうです。でも、{亡|な}くなったひとはいなかったそうです。よかったです。',
          ro: 'Kesa, terebi de nyuusu o mimashita. Kinou no yoru, ookii jishin ga atta sou desu. Jishin de furui biru ga taorete, mado garasu mo takusan wareta sou desu. Demo, nakunatta hito wa inakatta sou desu. Yokatta desu.',
          vi: 'Sáng nay tôi xem thời sự trên ti vi. Nghe nói tối qua có động đất lớn. Nghe nói vì động đất mà toà nhà cũ bị đổ, kính cửa sổ cũng vỡ nhiều. Nhưng nghe nói không có ai thiệt mạng. May quá.',
        },
        {
          text: 'しゅうまつ、こうえんでフリーマーケットがあるそうです。{雨|あめ}がふったら、{中止|ちゅうし}だそうです。でも、てんきよほうでは{晴|は}れるそうですから、きっとだいじょうぶだとおもいます。{時間|じかん}があったら、いっしょにいきませんか。',
          ro: 'Shuumatsu, kouen de furii maaketto ga aru sou desu. Ame ga futtara, chuushi da sou desu. Demo, tenki yohou de wa hareru sou desu kara, kitto daijoubu da to omoimasu. Jikan ga attara, issho ni ikimasen ka.',
          vi: 'Nghe nói cuối tuần ở công viên có chợ đồ cũ. Nghe nói nếu mưa thì huỷ. Nhưng dự báo thời tiết nói trời nắng nên tôi nghĩ chắc chắn không sao. Nếu có thời gian thì đi cùng tôi không?',
        },
        {
          text: 'えきのまえのラーメンやはとても{人気|にんき}があります。いつも{店|みせ}のまえにひとがたくさんならんでいます。ながいじかんまっても、たべたいです。がくせいだったら、10パーセント{引|び}きです。きっとおいしいと{思|おも}います。',
          ro: 'Eki no mae no raamen\'ya wa totemo ninki ga arimasu. Itsumo mise no mae ni hito ga takusan narande imasu. Nagai jikan matte mo, tabetai desu. Gakusei dattara, juppaasento biki desu. Kitto oishii to omoimasu.',
          vi: 'Quán ramen trước ga rất được ưa chuộng. Lúc nào trước quán cũng có nhiều người xếp hàng. Dù phải chờ lâu tôi vẫn muốn ăn. Nếu là sinh viên thì giảm 10%. Tôi nghĩ chắc chắn ngon.',
        },
        {
          text: 'ともだちとまちをあるきました。あっ、{事故|じこ}ででんしゃが{止|と}まっていました。バスていにはひとがたくさん{集|あつ}まっていました。カフェにはいりましたが、コップが{汚|よご}れていました。たいへんな{一日|いちにち}でしたが、いい{思|おも}い{出|で}です。',
          ro: 'Tomodachi to machi o arukimashita. A, jiko de densha ga tomatte imashita. Basutei ni wa hito ga takusan atsumatte imashita. Kafe ni hairimashita ga, koppu ga yogorete imashita. Taihen na ichinichi deshita ga, ii omoide desu.',
          vi: 'Tôi đi dạo phố với bạn. Ồ, vì tai nạn mà tàu đã dừng. Ở bến xe buýt rất nhiều người tụ tập. Chúng tôi vào quán cà phê nhưng cốc lại bẩn. Một ngày vất vả nhưng là kỷ niệm đẹp.',
        },
      ],
    },

    {
      t: 'write',
      id: 'b15-viet-kanji',
      title: 'Tập viết tay chữ Hán Bài 15 — ✍ trước, 👁 sau',
      note: '16 chữ đầu là nhóm ✍ nên viết (ít nét, gặp rất nhiều) — viết cho thạo. Phần còn lại là 👁 nhận mặt: viết thử một lượt để nhớ mặt chữ là đủ. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['大', '会', '中', '止', '本', '夕', '方', '地', '入', '心', '間', '引', '強', '出', '後', '場', '曇', '台', '風', '震', '事', '故', '当', '昔', '無', '料', '死', '亡', '始', '降', '勝', '負', '倒', '割', '結', '婚', '院', '怖', '配', '席', '急', '混', '合', '晴', '集', '閉', '落', '消', '壊', '汚', '位', '最', '思', '緊', '張', '笑'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b15-nghe',
  kind: 'listening',
  title: 'Luyện nghe — tin nghe được, kế hoạch có điều kiện, cảnh ngoài phố',
  goal: 'Nghe bạn bè kể tin (～そうです) để biết họ quyết định gì và vì sao, nghe kế hoạch có điều kiện (～たら／～ても) để biết đi đâu – có đi khi mưa không, nhận ra ai đang nói trong cảnh phố (～ています), và nghe hiểu bản tin ngắn: chuyện gì xảy ra, vì sao (N で).',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        '**Tin kể lại**: câu có **～そうです** là thông tin người nói **nghe được** — thường là đáp án "có gì / ở đâu / bao nhiêu". Câu có **～と{思|おも}います** là **ý đoán** của người nói.',
        '**Điều kiện**: nghe **～たら** (nếu … thì) ↔ **～ても** (dù … vẫn). Câu hỏi "{雨|あめ}でも{行|い}きますか" → tập trung vào vế sau: **{中止|ちゅうし}** (không đi) hay **あります／{行|い}きます** (vẫn đi).',
        '**Lý do**: câu trả lời thường nằm ở **～から**, **～んです** hoặc **N で** ({台風|たいふう}で, {事故|じこ}で).',
        '**Cảnh ngoài phố**: nghe động từ **～ています**: {止|と}まっています (xe/tàu), {並|なら}んでいます (hàng người), {閉|し}まっています (cửa hàng), {落|お}ちています (đồ rơi), {割|わ}れています (cốc vỡ).',
        'Bẫy: người nói **đổi ý** ("あ、でも…", "じゃ、…") — luôn lấy quyết định **cuối cùng**.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — Chọn ⓐ hay ⓑ, và vì sao? (やってみよう)' },
    {
      t: 'p',
      text: 'Năm đoạn hội thoại ngắn: một người kể tin trong tạp chí / ti vi, người kia quyết định. Nghe, chọn ⓐ hoặc ⓑ, rồi nhớ **lý do** (どうしてですか).',
    },
    {
      t: 'table',
      caption: 'Bảng điền (điền trong đầu rồi làm câu hỏi bên dưới)',
      head: ['', 'Câu hỏi', 'ⓐ', 'ⓑ', 'Vì sao?'],
      rows: [
        ['例', 'ナタポンさんはどうしますか', '{行|い}きます', '{行|い}きません', '？'],
        ['1', 'いつ{行|い}きますか', '{今週|こんしゅう}', '{来週|らいしゅう}', '？'],
        ['2', 'いつ{行|い}きますか', '{水曜日|すいようび}', '{金曜日|きんようび}', '？'],
        ['3', '{何|なに}をあげますか', '{絵|え}', 'お{皿|さら}', '？'],
        ['4', 'メアリーさんの{気持|きも}ちはどうですか', 'いいです', 'よくないです', '？'],
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-1-vd',
      title: '例 — Nattapong và chợ xe đạp cũ',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ナタポンさん、{日曜日|にちようび}、{駅|えき}の{前|まえ}で{自転車|じてんしゃ}のフリーマーケットがあるそうですよ。', ro: 'Natapon-san, nichiyoubi, eki no mae de jitensha no furii maaketto ga aru sou desu yo.', vi: 'Nattapong, nghe nói Chủ nhật trước ga có chợ xe đạp cũ đấy.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'へえ。{自転車|じてんしゃ}ですか。', ro: 'Hee. Jitensha desu ka.', vi: 'Ồ. Xe đạp à?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'ええ。{古|ふる}い{自転車|じてんしゃ}が{3,000円|さんぜんえん}ぐらいだそうです。', ro: 'Ee. Furui jitensha ga sanzen en gurai da sou desu.', vi: 'Ừ. Nghe nói xe cũ chỉ khoảng 3.000 yên.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{安|やす}いですね。{私|わたし}の{自転車|じてんしゃ}は{先週|せんしゅう}{壊|こわ}れたんです。{行|い}きます！', ro: 'Yasui desu ne. Watashi no jitensha wa senshuu kowareta n desu. Ikimasu!', vi: 'Rẻ nhỉ. Xe đạp của mình tuần trước bị hỏng rồi. Mình đi!' },
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-1-1',
      title: '1 — Đợt giảm giá ở trung tâm mua sắm',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'ダニエルさん、ニコニコビルでセールがあるそうですよ。{靴|くつ}が{30|さんじゅっ}パーセント{引|び}きだそうです。', ro: 'Danieru-san, Nikoniko biru de seeru ga aru sou desu yo. Kutsu ga sanjuppaasento biki da sou desu.', vi: 'Daniel, nghe nói ở toà nhà Nikoniko có đợt giảm giá đấy. Nghe nói giày giảm 30%.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'いいですね。セールは{今週|こんしゅう}ですか。', ro: 'Ii desu ne. Seeru wa konshuu desu ka.', vi: 'Hay đấy. Giảm giá tuần này à?' },
        { who: 'パク', voice: 'ja-nu', text: '{今週|こんしゅう}と{来週|らいしゅう}です。{一緒|いっしょ}に{今週|こんしゅう}の{土曜日|どようび}に{行|い}きませんか。', ro: 'Konshuu to raishuu desu. Issho ni konshuu no doyoubi ni ikimasen ka.', vi: 'Tuần này và tuần sau. Thứ Bảy tuần này đi cùng mình không?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'すみません、{今週|こんしゅう}は{試験|しけん}があるんです。{来週|らいしゅう}だったら、{大丈夫|だいじょうぶ}です。', ro: 'Sumimasen, konshuu wa shiken ga aru n desu. Raishuu dattara, daijoubu desu.', vi: 'Xin lỗi, tuần này mình có thi. Nếu tuần sau thì được.' },
        { who: 'パク', voice: 'ja-nu', text: 'じゃ、{来週|らいしゅう}{行|い}きましょう。', ro: 'Ja, raishuu ikimashou.', vi: 'Vậy tuần sau đi nhé.' },
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-1-2',
      title: '2 — Bảo tàng miễn phí',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'マルコさん、ほしの{美術館|びじゅつかん}は{水曜日|すいようび}と{金曜日|きんようび}、{学生|がくせい}は{無料|むりょう}だそうですよ。', ro: 'Maruko-san, Hoshino bijutsukan wa suiyoubi to kin\'youbi, gakusei wa muryou da sou desu yo.', vi: 'Marco, nghe nói bảo tàng mỹ thuật Hoshino thứ Tư và thứ Sáu miễn phí cho sinh viên đấy.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'へえ、{行|い}きたいです。{水曜日|すいようび}はどうですか。', ro: 'Hee, ikitai desu. Suiyoubi wa dou desu ka.', vi: 'Ồ, mình muốn đi. Thứ Tư thì sao?' },
        { who: 'ワン', voice: 'ja-nu', text: '{水曜日|すいようび}は{夕方|ゆうがた}までアルバイトなんです。{美術館|びじゅつかん}は{5時|ごじ}に{閉|し}まりますから、{間|ま}に{合|あ}わないと{思|おも}います。', ro: 'Suiyoubi wa yuugata made arubaito na n desu. Bijutsukan wa goji ni shimarimasu kara, ma ni awanai to omoimasu.', vi: 'Thứ Tư mình làm thêm đến chiều tối. Bảo tàng đóng cửa lúc 5 giờ nên mình nghĩ không kịp.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'じゃ、{金曜日|きんようび}にしましょう。', ro: 'Ja, kin\'youbi ni shimashou.', vi: 'Vậy chọn thứ Sáu nhé.' },
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-1-3',
      title: '3 — Quà cưới cho người bạn',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'カルロスさんが{来月|らいげつ}{結婚|けっこん}するそうですね。プレゼントは{何|なに}がいいと{思|おも}いますか。', ro: 'Karurosu-san ga raigetsu kekkon suru sou desu ne. Purezento wa nani ga ii to omoimasu ka.', vi: 'Nghe nói tháng sau Carlos kết hôn nhỉ. Cậu nghĩ quà gì thì hay?' },
        { who: 'パク', voice: 'ja-nu', text: '{絵|え}はどうですか。{新|あたら}しい{家|いえ}に{飾|かざ}ることができますよ。', ro: 'E wa dou desu ka. Atarashii ie ni kazaru koto ga dekimasu yo.', vi: 'Tranh thì sao? Có thể treo trong nhà mới đấy.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'うーん、カルロスさんの{家|いえ}は{狭|せま}いそうですよ。それに、{2人|ふたり}とも{料理|りょうり}が{好|す}きだそうです。', ro: 'Uun, Karurosu-san no ie wa semai sou desu yo. Sore ni, futari tomo ryouri ga suki da sou desu.', vi: 'Ừm, nghe nói nhà Carlos chật lắm. Hơn nữa, nghe nói cả hai đều thích nấu ăn.' },
        { who: 'パク', voice: 'ja-nu', text: 'そうですか。じゃ、きれいなお{皿|さら}がいいですね。', ro: 'Sou desu ka. Ja, kirei na osara ga ii desu ne.', vi: 'Vậy à. Vậy đĩa đẹp thì hay nhỉ.' },
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-1-4',
      title: '4 — Mary nghe tin trận đấu',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: 'メアリーさん、{昨日|きのう}のサッカーの{試合|しあい}、{見|み}ましたか。', ro: 'Mearii-san, kinou no sakkaa no shiai, mimashita ka.', vi: 'Mary, trận bóng đá hôm qua cậu xem chưa?' },
        { who: 'メアリー', voice: 'ja-nu', text: 'いいえ、アルバイトで{見|み}ることができなかったんです。どうでしたか。', ro: 'Iie, arubaito de miru koto ga dekinakatta n desu. Dou deshita ka.', vi: 'Chưa, vì làm thêm nên mình không xem được. Thế nào?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'イギリスのチームは{3|さん}{対|たい}{0|ゼロ}で{負|ま}けたそうです。', ro: 'Igirisu no chiimu wa san tai zero de maketa sou desu.', vi: 'Nghe nói đội Anh thua 0–3.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'えっ、{本当|ほんとう}ですか……。{私|わたし}の{国|くに}のチームですから……。{残念|ざんねん}です。', ro: 'E, hontou desu ka……. Watashi no kuni no chiimu desu kara……. Zannen desu.', vi: 'Hả, thật à… Đội của nước mình mà… Tiếc quá.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: '例 ナタポンさんはどうしますか。どうしてですか。', options: ['ⓐ {行|い}きます — {自転車|じてんしゃ}が{壊|こわ}れましたから', 'ⓑ {行|い}きません — {高|たか}いですから', 'ⓐ {行|い}きます — {新|あたら}しいスカートがほしいですから', 'ⓑ {行|い}きません — {日曜日|にちようび}は{忙|いそが}しいですから'], correct: 0, why: '{自転車|じてんしゃ}は{先週|せんしゅう}**{壊|こわ}れたんです** → **{行|い}きます**.' },
        { q: '1 いつ{行|い}きますか。どうしてですか。', options: ['ⓐ {今週|こんしゅう} — セールは{今週|こんしゅう}だけですから', 'ⓑ {来週|らいしゅう} — {今週|こんしゅう}は{試験|しけん}がありますから', 'ⓐ {今週|こんしゅう} — {土曜日|どようび}は{暇|ひま}ですから', 'ⓑ {来週|らいしゅう} — {靴|くつ}が{安|やす}くなりますから'], correct: 1, why: '{今週|こんしゅう}は**{試験|しけん}がある**んです。**{来週|らいしゅう}だったら**{大丈夫|だいじょうぶ} (ポイント 120).' },
        { q: '2 いつ{行|い}きますか。どうしてですか。', options: ['ⓐ {水曜日|すいようび} — {無料|むりょう}ですから', 'ⓑ {金曜日|きんようび} — {水曜日|すいようび}はアルバイトで、{間|ま}に{合|あ}いませんから', 'ⓑ {金曜日|きんようび} — {水曜日|すいようび}は{美術館|びじゅつかん}が{休|やす}みですから', 'ⓐ {水曜日|すいようび} — {金曜日|きんようび}は{混|こ}んでいますから'], correct: 1, why: 'Thứ Tư làm thêm đến chiều tối, bảo tàng đóng 5 giờ → **{間|ま}に{合|あ}わない** → thứ Sáu.' },
        { q: '3 {何|なに}をあげますか。どうしてですか。', options: ['ⓐ {絵|え} — {新|あたら}しい{家|いえ}に{飾|かざ}ることができますから', 'ⓑ お{皿|さら} — {2人|ふたり}とも{料理|りょうり}が{好|す}きですから', 'ⓑ お{皿|さら} — {安|やす}いですから', 'ⓐ {絵|え} — カルロスさんは{絵|え}が{好|す}きですから'], correct: 1, why: 'Nhà chật + **{料理|りょうり}が{好|す}きだそうです** → **お{皿|さら}**. (Tranh là ý đầu, bị đổi.)' },
        { q: '4 メアリーさんの{気持|きも}ちはどうですか。どうしてですか。', options: ['ⓐ いいです — {試合|しあい}を{見|み}ましたから', 'ⓑ よくないです — {自分|じぶん}の{国|くに}のチームが{負|ま}けましたから', 'ⓐ いいです — {3|さん}{対|たい}{0|ゼロ}で{勝|か}ちましたから', 'ⓑ よくないです — アルバイトが{忙|いそが}しいですから'], correct: 1, why: 'Đội nước mình **{負|ま}けたそうです** → {残念|ざんねん}です → **よくない**.' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — Đi đâu? Mưa có đi không? Làm gì? (やってみよう)' },
    {
      t: 'listen',
      id: 'b15-ng-2a',
      title: '① Chủ nhật đi đâu?',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'パクさん、{日曜日|にちようび}、{隣|となり}の{町|まち}でお{祭|まつ}りがあるそうですよ。', ro: 'Paku-san, nichiyoubi, tonari no machi de omatsuri ga aru sou desu yo.', vi: 'Park, nghe nói Chủ nhật ở thị trấn bên cạnh có lễ hội đấy.' },
        { who: 'パク', voice: 'ja-nu', text: 'いいですね。でも、{日曜日|にちようび}は{雨|あめ}だそうですよ。', ro: 'Ii desu ne. Demo, nichiyoubi wa ame da sou desu yo.', vi: 'Hay nhỉ. Nhưng nghe nói Chủ nhật mưa đấy.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'お{祭|まつ}りは{雨|あめ}が{降|ふ}っても、あるそうです。{神社|じんじゃ}の{中|なか}でしますから。', ro: 'Omatsuri wa ame ga futte mo, aru sou desu. Jinja no naka de shimasu kara.', vi: 'Nghe nói lễ hội dù mưa vẫn có. Vì tổ chức trong đền.' },
        { who: 'パク', voice: 'ja-nu', text: 'じゃ、{雨|あめ}でも{行|い}きましょう。{傘|かさ}を{持|も}って{行|い}きますね。', ro: 'Ja, ame demo ikimashou. Kasa o motte ikimasu ne.', vi: 'Vậy dù mưa cũng đi nhé. Mình sẽ mang ô.' },
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-2b',
      title: '② Nattapong ngày mai làm gì?',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'ナタポンさん、{明日|あした}、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。', ro: 'Natapon-san, ashita, issho ni eiga o mi ni ikimasen ka.', vi: 'Nattapong, mai đi xem phim với mình không?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'すみません。{明日|あした}は{町|まち}のスピーチコンテストに{出|で}るんです。', ro: 'Sumimasen. Ashita wa machi no supiichi kontesuto ni deru n desu.', vi: 'Xin lỗi. Mai mình tham gia cuộc thi hùng biện của thành phố.' },
        { who: 'ワン', voice: 'ja-nu', text: 'へえ、すごいですね。{緊張|きんちょう}しますか。', ro: 'Hee, sugoi desu ne. Kinchou shimasu ka.', vi: 'Ồ, giỏi quá. Cậu có hồi hộp không?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'ええ、とても。コンテストが{終|お}わったら、{映画|えいが}に{行|い}きたいです。{来週|らいしゅう}はどうですか。', ro: 'Ee, totemo. Kontesuto ga owattara, eiga ni ikitai desu. Raishuu wa dou desu ka.', vi: 'Ừ, rất hồi hộp. Thi xong thì mình muốn đi xem phim. Tuần sau thì sao?' },
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-2c',
      title: '③ Hai người làm gì bây giờ?',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ダニエルさん、{急|いそ}いでください。{花火大会|はなびたいかい}は{7時|しちじ}からですよ。', ro: 'Danieru-san, isoide kudasai. Hanabi taikai wa shichiji kara desu yo.', vi: 'Daniel, nhanh lên. Lễ hội pháo hoa bắt đầu từ 7 giờ đấy.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{大丈夫|だいじょうぶ}ですよ。さっき{電話|でんわ}で{聞|き}きましたが、{風|かぜ}が{強|つよ}いですから、{8時|はちじ}に{始|はじ}まるそうです。', ro: 'Daijoubu desu yo. Sakki denwa de kikimashita ga, kaze ga tsuyoi desu kara, hachiji ni hajimaru sou desu.', vi: 'Không sao đâu. Lúc nãy mình gọi điện hỏi rồi, vì gió mạnh nên nghe nói 8 giờ mới bắt đầu.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'そうですか。じゃ、{急|いそ}がなくてもいいですね。', ro: 'Sou desu ka. Ja, isoganakute mo ii desu ne.', vi: 'Vậy à. Vậy không cần vội nhỉ.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'ええ。{先|さき}にコンビニで{飲|の}み{物|もの}を{買|か}いましょう。{会場|かいじょう}の{店|みせ}はきっと{混|こ}んでいると{思|おも}いますから。', ro: 'Ee. Saki ni konbini de nomimono o kaimashou. Kaijou no mise wa kitto konde iru to omoimasu kara.', vi: 'Ừ. Mình mua đồ uống ở cửa hàng tiện lợi trước đi. Vì mình nghĩ các quán ở chỗ tổ chức chắc chắn đông.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-ng-2-q',
      title: 'Câu hỏi bài 2',
      items: [
        { q: '① 2{人|ふたり}は{日曜日|にちようび}、どこへ{行|い}きますか。', options: ['{映画館|えいがかん}', '{隣|となり}の{町|まち}のお{祭|まつ}り', 'フリーマーケット', '{神社|じんじゃ}の{近|ちか}くの{店|みせ}'], correct: 1, why: '{隣|となり}の{町|まち}で**お{祭|まつ}り**があるそうです.' },
        { q: '① {雨|あめ}でも{行|い}きますか。', options: ['はい、{行|い}きます', 'いいえ、{雨|あめ}だったら{中止|ちゅうし}です'], correct: 0, why: '{雨|あめ}が{降|ふ}っても、あるそうです → **{雨|あめ}でも{行|い}きましょう** (ポイント 121).' },
        { q: '② ナタポンさんは{明日|あした}、{何|なに}をしますか。', options: ['{映画|えいが}を{見|み}ます', 'スピーチコンテストに{出|で}ます', 'アルバイトをします', '{試験|しけん}を{受|う}けます'], correct: 1, why: '{町|まち}の**スピーチコンテストに{出|で}る**んです.' },
        { q: '③ 2{人|ふたり}はこれから{何|なに}をしますか。', options: ['{急|いそ}いで{会場|かいじょう}へ{行|い}きます', 'コンビニで{飲|の}み{物|もの}を{買|か}います', '{電話|でんわ}をします', 'うちへ{帰|かえ}ります'], correct: 1, why: '**{先|さき}にコンビニで{飲|の}み{物|もの}を{買|か}いましょう**.' },
        { q: '③ どうして{急|いそ}がなくてもいいですか。', options: ['{花火大会|はなびたいかい}が{中止|ちゅうし}になりましたから', '{風|かぜ}が{強|つよ}くて、{8時|はちじ}に{始|はじ}まりますから', '{会場|かいじょう}が{近|ちか}いですから', 'タクシーで{行|い}きますから'], correct: 1, why: '{風|かぜ}が{強|つよ}い → **{8時|はちじ}に{始|はじ}まるそうです**.' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — Hai người nào đang nói? (やってみよう)' },
    {
      t: 'p',
      text: 'Một con phố buổi chiều (tranh viết lại thành bảng). Nghe hai đoạn hội thoại và chọn **cặp người** đang nói trong số ⓐ–ⓕ.',
    },
    {
      t: 'table',
      caption: 'Cảnh con phố',
      head: ['Cặp', 'Đang ở đâu / thấy gì'],
      rows: [
        ['ⓐ', 'Ngồi trên xe buýt; phía trước một xe tải bị lật, hàng rơi đầy đường, xe cộ đứng im'],
        ['ⓑ', 'Đi ngang tiệm bánh "Sakura" — người xếp hàng dài trước cửa'],
        ['ⓒ', 'Đứng trên vỉa hè, dưới chân có cái ví và mấy đồng xu rơi'],
        ['ⓓ', 'Đứng trước quán cà phê "Green" — cửa cuốn kéo xuống, đèn tắt'],
        ['ⓔ', 'Đứng cạnh một đám đông đang reo lên nhìn một ảo thuật gia đường phố'],
        ['ⓕ', 'Ở gian chợ đồ cũ, một người cầm chiếc cốc bị mẻ'],
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-3a',
      title: 'Đoạn 1',
      lines: [
        { who: 'A', voice: 'ja-nu', text: 'あれ？ {電気|でんき}が{消|き}えていますね。', ro: 'Are? Denki ga kiete imasu ne.', vi: 'Ơ? Đèn tắt nhỉ.' },
        { who: 'B', voice: 'ja-nam', text: 'ええ、{閉|し}まっています。「{今日|きょう}はお{休|やす}みです」と{書|か}いた{紙|かみ}がありますよ。', ro: 'Ee, shimatte imasu. "Kyou wa oyasumi desu" to kaita kami ga arimasu yo.', vi: 'Ừ, đóng cửa rồi. Có tờ giấy ghi "Hôm nay nghỉ" kìa.' },
        { who: 'A', voice: 'ja-nu', text: '{残念|ざんねん}ですね。ここのコーヒー、おいしいそうですよ。', ro: 'Zannen desu ne. Koko no koohii, oishii sou desu yo.', vi: 'Tiếc nhỉ. Nghe nói cà phê ở đây ngon lắm.' },
        { who: 'B', voice: 'ja-nam', text: 'じゃ、{明日|あした}また{来|き}ましょう。', ro: 'Ja, ashita mata kimashou.', vi: 'Vậy mai mình lại đến nhé.' },
      ],
    },
    {
      t: 'listen',
      id: 'b15-ng-3b',
      title: 'Đoạn 2',
      lines: [
        { who: 'A', voice: 'ja-nam', text: 'ぜんぜん{動|うご}きませんね。', ro: 'Zenzen ugokimasen ne.', vi: 'Chẳng nhúc nhích gì cả nhỉ.' },
        { who: 'B', voice: 'ja-nu', text: 'ええ。{前|まえ}でトラックが{倒|たお}れていますよ。{事故|じこ}ですね。', ro: 'Ee. Mae de torakku ga taorete imasu yo. Jiko desu ne.', vi: 'Ừ. Phía trước có xe tải bị lật kìa. Tai nạn rồi.' },
        { who: 'A', voice: 'ja-nam', text: 'この{事故|じこ}で、たぶん{30分|さんじゅっぷん}ぐらい{止|と}まっていると{思|おも}います。', ro: 'Kono jiko de, tabun sanjuppun gurai tomatte iru to omoimasu.', vi: 'Vì vụ tai nạn này, mình nghĩ chắc phải dừng khoảng 30 phút.' },
        { who: 'B', voice: 'ja-nu', text: 'じゃ、ここで{降|お}りて、{歩|ある}きませんか。', ro: 'Ja, koko de orite, arukimasen ka.', vi: 'Vậy xuống ở đây rồi đi bộ không?' },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-ng-3-q',
      title: 'Câu hỏi bài 3',
      items: [
        { q: 'Đoạn 1 là cặp nào?', options: ['ⓑ', 'ⓒ', 'ⓓ', 'ⓕ'], correct: 2, why: '{電気|でんき}が{消|き}えています・{閉|し}まっています → quán cà phê đóng cửa = **ⓓ**.' },
        { q: 'Đoạn 2 là cặp nào?', options: ['ⓐ', 'ⓑ', 'ⓔ', 'ⓕ'], correct: 0, why: 'Xe không nhúc nhích, xe tải **{倒|たお}れています**, "xuống ở đây" (降りて) → đang trên xe buýt = **ⓐ**.' },
        { q: 'Đoạn 2: vì sao xe không đi?', options: ['{台風|たいふう}で', '{事故|じこ}で', '{雨|あめ}で', '{お祭|まつ}りで'], correct: 1, why: '**この{事故|じこ}で**、{止|と}まっている (ポイント 124).' },
      ],
    },

    /* ── Bài 4 ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: rủ đi xem pháo hoa → ngày lễ hội (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b15-ng-4',
      title: 'Lễ hội pháo hoa ở Yokohama',
      note: 'Nghe cả đoạn một lần, rồi trả lời câu hỏi. Nghe lại lần hai để kiểm tra. Từ mới trong đoạn: {会場|かいじょう} (nơi tổ chức), {浴衣|ゆかた} (Bài 13).',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'ダニエルさん、{土曜日|どようび}、{横浜|よこはま}で{花火大会|はなびたいかい}があるそうですよ。よかったら、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Danieru-san, doyoubi, Yokohama de hanabi taikai ga aru sou desu yo. Yokattara, issho ni ikimasen ka.', vi: 'Daniel, nghe nói thứ Bảy ở Yokohama có lễ hội pháo hoa đấy. Nếu được thì đi cùng mình không?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'いいですね。でも、{土曜日|どようび}は{台風|たいふう}が{来|く}るそうですよ。{台風|たいふう}でも、ありますか。', ro: 'Ii desu ne. Demo, doyoubi wa taifuu ga kuru sou desu yo. Taifuu demo, arimasu ka.', vi: 'Hay đấy. Nhưng nghe nói thứ Bảy bão đến đấy. Dù bão vẫn có à?' },
        { who: 'ワン', voice: 'ja-nu', text: '{少|すこ}し{雨|あめ}が{降|ふ}っても、あるそうです。でも、{風|かぜ}が{強|つよ}かったら、{日曜日|にちようび}になるそうです。', ro: 'Sukoshi ame ga futte mo, aru sou desu. Demo, kaze ga tsuyokattara, nichiyoubi ni naru sou desu.', vi: 'Nghe nói dù mưa nhỏ vẫn có. Nhưng nếu gió mạnh thì nghe nói dời sang Chủ nhật.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'そうですか。たぶん{台風|たいふう}は{金曜日|きんようび}の{夜|よる}に{行|い}くと{思|おも}います。きっと{大丈夫|だいじょうぶ}ですよ。', ro: 'Sou desu ka. Tabun taifuu wa kin\'youbi no yoru ni iku to omoimasu. Kitto daijoubu desu yo.', vi: 'Vậy à. Mình nghĩ có lẽ tối thứ Sáu bão đi qua rồi. Chắc chắn không sao đâu.' },
        { who: 'ワン', voice: 'ja-nu', text: '{会場|かいじょう}は{人|ひと}がとても{多|おお}いと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。', ro: 'Kaijou wa hito ga totemo ooi to omoimasu ga, daijoubu desu ka.', vi: 'Mình nghĩ chỗ tổ chức rất đông người, cậu có ổn không?' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{人|ひと}が{多|おお}くても、{見|み}たいです。{日本|にほん}の{花火|はなび}は{初|はじ}めてですから。', ro: 'Hito ga ookute mo, mitai desu. Nihon no hanabi wa hajimete desu kara.', vi: 'Dù đông mình vẫn muốn xem. Vì lần đầu xem pháo hoa Nhật.' },
        { who: 'ワン', voice: 'ja-nu', text: 'じゃ、{5時|ごじ}に{横浜駅|よこはまえき}で{会|あ}いましょう。{駅|えき}の{前|まえ}のパン{屋|や}でパンを{買|か}ってから、{会場|かいじょう}へ{行|い}きましょう。', ro: 'Ja, goji ni Yokohama eki de aimashou. Eki no mae no pan\'ya de pan o katte kara, kaijou e ikimashou.', vi: 'Vậy 5 giờ gặp ở ga Yokohama nhé. Mua bánh mì ở tiệm trước ga xong rồi đến chỗ tổ chức.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '（{土曜日|どようび}）ワンさん、こんばんは。{雨|あめ}、やみましたね。', ro: '(Doyoubi) Wan-san, konbanwa. Ame, yamimashita ne.', vi: '(Thứ Bảy) Wang, chào buổi tối. Mưa tạnh rồi nhỉ.' },
        { who: 'ワン', voice: 'ja-nu', text: 'ええ、よかったですね。あ、パン{屋|や}に{人|ひと}がたくさん{並|なら}んでいますよ。', ro: 'Ee, yokatta desu ne. A, pan\'ya ni hito ga takusan narande imasu yo.', vi: 'Ừ, may quá nhỉ. À, tiệm bánh có nhiều người xếp hàng kìa.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{本当|ほんとう}だ。じゃ、コンビニで{買|か}いましょう。……わあ、もう{人|ひと}がたくさん{集|あつ}まっていますね。', ro: 'Hontou da. Ja, konbini de kaimashou. …… Waa, mou hito ga takusan atsumatte imasu ne.', vi: 'Thật này. Vậy mua ở cửa hàng tiện lợi đi. … Oa, người tụ tập đông quá rồi.' },
        { who: 'ワン', voice: 'ja-nu', text: 'あ、{始|はじ}まりました！ きれいですね。', ro: 'A, hajimarimashita! Kirei desu ne.', vi: 'A, bắt đầu rồi! Đẹp quá.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: '{花火大会|はなびたいかい}はどこでありますか。', options: ['{浅草|あさくさ}', '{横浜|よこはま}', '{東京|とうきょう}タワー', 'みどり{公園|こうえん}'], correct: 1, why: '**{横浜|よこはま}**で{花火大会|はなびたいかい}があるそうです.' },
        { q: '{少|すこ}し{雨|あめ}が{降|ふ}ったら、{花火大会|はなびたいかい}はどうなりますか。', options: ['{中止|ちゅうし}です', 'あります', '{日曜日|にちようび}になります', '{8時|はちじ}に{始|はじ}まります'], correct: 1, why: '{少|すこ}し{雨|あめ}が{降|ふ}っ**ても**、あるそうです.' },
        { q: '{風|かぜ}が{強|つよ}かったら、どうなりますか。', options: ['{中止|ちゅうし}です', 'あります', '{日曜日|にちようび}になります', '{金曜日|きんようび}になります'], correct: 2, why: '{風|かぜ}が{強|つよ}かっ**たら**、**{日曜日|にちようび}になる**そうです.' },
        { q: 'ダニエルさんはどうして{人|ひと}が{多|おお}くても{行|い}きたいですか。', options: ['{花火|はなび}が{好|す}きですから', '{日本|にほん}の{花火|はなび}は{初|はじ}めてですから', 'ワンさんが{好|す}きですから', '{会場|かいじょう}が{近|ちか}いですから'], correct: 1, why: '**{日本|にほん}の{花火|はなび}は{初|はじ}めて**ですから.' },
        { q: '2{人|ふたり}は{何時|なんじ}に、どこで{会|あ}いますか。', options: ['{5時|ごじ}、{横浜駅|よこはまえき}', '{6時|ろくじ}、{会場|かいじょう}', '{5時|ごじ}、パン{屋|や}', '{7時|しちじ}、コンビニ'], correct: 0, why: '**{5時|ごじ}に{横浜駅|よこはまえき}**で{会|あ}いましょう.' },
        { q: '{土曜日|どようび}、2{人|ふたり}はどこで{食|た}べ{物|もの}を{買|か}いましたか。どうしてですか。', options: ['パン{屋|や} — おいしいですから', 'コンビニ — パン{屋|や}に{人|ひと}がたくさん{並|なら}んでいましたから', '{会場|かいじょう}の{店|みせ} — {安|やす}いですから', '{買|か}いませんでした'], correct: 1, why: 'パン{屋|や}に{人|ひと}がたくさん**{並|なら}んでいます** → **コンビニで{買|か}いましょう** (ポイント 122).' },
      ],
    },

    /* ── Bài 5 ── */
    { t: 'h', text: 'Bài 5 — Bản tin ngắn: chuyện gì? vì sao?' },
    {
      t: 'p',
      text: 'Bốn bản tin ngắn kiểu thời sự. Nghe và trả lời: **chuyện gì đã xảy ra** và **vì sao** (N で).',
    },
    {
      t: 'listen',
      id: 'b15-ng-5',
      title: 'Bốn bản tin',
      lines: [
        { who: '①', voice: 'ja-nu', text: '{今朝|けさ}、{大|おお}きい{台風|たいふう}で{新幹線|しんかんせん}が{3時間|さんじかん}{止|と}まりました。{今|いま}は{動|うご}いています。', ro: 'Kesa, ookii taifuu de shinkansen ga sanjikan tomarimashita. Ima wa ugoite imasu.', vi: 'Sáng nay vì bão lớn mà tàu Shinkansen dừng 3 tiếng. Bây giờ đã chạy lại.' },
        { who: '②', voice: 'ja-nam', text: '{昨日|きのう}の{夕方|ゆうがた}、{駅|えき}の{前|まえ}でバスの{事故|じこ}がありました。{事故|じこ}で{4人|よにん}がけがをしました。', ro: 'Kinou no yuugata, eki no mae de basu no jiko ga arimashita. Jiko de yonin ga kega o shimashita.', vi: 'Chiều tối qua trước ga xảy ra tai nạn xe buýt. Vì tai nạn mà 4 người bị thương.' },
        { who: '③', voice: 'ja-nu', text: '{山下|やました}{動物園|どうぶつえん}のゾウのハナコが{病気|びょうき}で{死|し}にました。{60歳|ろくじゅっさい}でした。', ro: 'Yamashita doubutsuen no zou no Hanako ga byouki de shinimashita. Rokujussai deshita.', vi: 'Voi Hanako của sở thú Yamashita đã chết vì bệnh. Nó 60 tuổi.' },
        { who: '④', voice: 'ja-nam', text: '{今夜|こんや}の{野球|やきゅう}の{試合|しあい}は{雨|あめ}で{中止|ちゅうし}になりました。{試合|しあい}は{明日|あした}の{夜|よる}です。', ro: 'Kon\'ya no yakyuu no shiai wa ame de chuushi ni narimashita. Shiai wa ashita no yoru desu.', vi: 'Trận bóng chày tối nay bị huỷ vì mưa. Trận đấu sẽ vào tối mai.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-ng-5-q',
      title: 'Câu hỏi bài 5',
      items: [
        { q: '① {何|なに}がありましたか。', options: ['{地震|じしん}で{新幹線|しんかんせん}が{止|と}まりました', '{台風|たいふう}で{新幹線|しんかんせん}が{止|と}まりました', '{事故|じこ}で{新幹線|しんかんせん}が{止|と}まっています', '{台風|たいふう}で{新幹線|しんかんせん}が{倒|たお}れました'], correct: 1, why: '**{台風|たいふう}で**{新幹線|しんかんせん}が{止|と}まりました. Bây giờ đã chạy (動いています).' },
        { q: '② {事故|じこ}で{何人|なんにん}けがをしましたか。', options: ['{3人|さんにん}', '{4人|よにん}', '{7人|ななにん}', 'いません'], correct: 1, why: '**{4人|よにん}**がけがをしました.' },
        { q: '③ ハナコはどうして{死|し}にましたか。', options: ['{事故|じこ}で', '{地震|じしん}で', '{病気|びょうき}で', '{台風|たいふう}で'], correct: 2, why: '**{病気|びょうき}で**{死|し}にました (ポイント 124).' },
        { q: '④ {野球|やきゅう}の{試合|しあい}はいつですか。', options: ['{今夜|こんや}', '{明日|あした}の{夜|よる}', 'あさって', '{来週|らいしゅう}'], correct: 1, why: '{今夜|こんや}は{雨|あめ}で{中止|ちゅうし} → **{明日|あした}の{夜|よる}**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b15-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về tin tức, điều kiện, dự đoán và cảnh ngoài phố',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 15 (最近どんなニュースを見ましたか, 雨が降ったら何をしますか, 雨が降っても～ますか, 明日の天気はどうだと思いますか, あなたの町にはどんなイベントがありますか), nhìn tranh bản tin / con phố / tờ quảng cáo mà trả lời, đóng vai rủ bạn theo tạp chí, và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 15 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 15 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể tin: {台風|たいふう}, {地震|じしん}, {事故|じこ}, {無料|むりょう}, フリーマーケット, ニュース…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (bản tin ti vi, con phố, tờ quảng cáo) trả lời 3 câu.', '{何|なに}があったそうですか · どうして{電車|でんしゃ}が{止|と}まっていますか · {何|なに}が{無料|むりょう}ですか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{雨|あめ}が{降|ふ}ったら、{何|なに}をしますか · お{金|かね}がたくさんあったら… · {最近|さいきん}どんなニュースを{見|み}ましたか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 15 soát kỹ: {台風|たいふう}**で**{電車|でんしゃ}**が**{止|と}まりました, {雨|あめ}**が**{降|ふ}ります, {試合|しあい}**に**{勝|か}ちます, {電車|でんしゃ}**に**{間|ま}に{合|あ}います, {人|ひと}**が**{並|なら}んでいます.',
        '**Câu có/không quên はい／いいえ**: bị trừ. 「{雨|あめ}が{降|ふ}っても、{学校|がっこう}へ{来|き}ますか」 → **はい、{雨|あめ}が{降|ふ}っても、{来|き}ます**.',
        '**Sai nội dung = mất trọn câu**: hỏi "nếu mưa thì làm gì" (～たら) mà trả lời "dù mưa vẫn đi" (～ても) là trả lời sai câu hỏi.',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします**.',
        'Luôn **nhắc lại vế điều kiện** của câu hỏi rồi mới trả lời: {雨|あめ}が{降|ふ}ったら、～ます. Câu dài, đúng mẫu → điểm cao.',
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Tin tức, ti vi, tạp chí' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: ニュース・テレビ・雑誌',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{最近|さいきん}、どんなニュースを{見|み}ましたか。', ro: 'Saikin, donna nyuusu o mimashita ka.', vi: 'Gần đây em xem tin gì?' },
        { who: 'Bạn', role: 'candidate', text: '{台風|たいふう}のニュースを{見|み}ました。{台風|たいふう}で{木|き}がたくさん{倒|たお}れたそうです。', ro: 'Taifuu no nyuusu o mimashita. Taifuu de ki ga takusan taoreta sou desu.', vi: 'Em xem tin bão. Nghe nói vì bão mà nhiều cây bị đổ.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎日|まいにち}ニュースを{見|み}ますか。', ro: 'Mainichi nyuusu o mimasu ka.', vi: 'Ngày nào em cũng xem thời sự à?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{見|み}ます。{毎朝|まいあさ}、{携帯|けいたい}でニュースを{見|み}ています。', ro: 'Hai, mimasu. Maiasa, keitai de nyuusu o mite imasu.', vi: 'Có ạ. Sáng nào em cũng xem tin trên điện thoại.' },
        { who: 'Giám thị', role: 'examiner', text: 'テレビでよく{何|なに}を{見|み}ますか。', ro: 'Terebi de yoku nani o mimasu ka.', vi: 'Em hay xem gì trên ti vi?' },
        { who: 'Bạn', role: 'candidate', text: 'サッカーの{試合|しあい}をよく{見|み}ます。{昨日|きのう}、ベトナムのチームが{勝|か}ちました。', ro: 'Sakkaa no shiai o yoku mimasu. Kinou, Betonamu no chiimu ga kachimashita.', vi: 'Em hay xem bóng đá ạ. Hôm qua đội Việt Nam đã thắng.' },
        { who: 'Giám thị', role: 'examiner', text: '{雑誌|ざっし}を{読|よ}みますか。', ro: 'Zasshi o yomimasu ka.', vi: 'Em có đọc tạp chí không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、あまり{読|よ}みません。でも、ときどき{料理|りょうり}の{雑誌|ざっし}を{見|み}ます。', ro: 'Iie, amari yomimasen. Demo, tokidoki ryouri no zasshi o mimasu.', vi: 'Không ạ, em không đọc mấy. Nhưng thỉnh thoảng em xem tạp chí nấu ăn.' },
        { who: 'Giám thị', role: 'examiner', text: '{明日|あした}の{天気|てんき}はどうですか。', ro: 'Ashita no tenki wa dou desu ka.', vi: 'Thời tiết ngày mai thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{天気予報|てんきよほう}で{見|み}ましたが、{明日|あした}は{雨|あめ}だそうです。', ro: 'Tenki yohou de mimashita ga, ashita wa ame da sou desu.', vi: 'Em xem dự báo thời tiết thì nghe nói mai mưa ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{週末|しゅうまつ}の{天気|てんき}はどうだと{思|おも}いますか。', ro: 'Shuumatsu no tenki wa dou da to omoimasu ka.', vi: 'Em nghĩ thời tiết cuối tuần thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'たぶん{晴|は}れると{思|おも}います。', ro: 'Tabun hareru to omoimasu.', vi: 'Em nghĩ có lẽ trời nắng ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        '"**{明日|あした}の{天気|てんき}はどうですか**" (hỏi thông tin) → trả lời bằng tin nghe được: **～そうです**. "**どうだと{思|おも}いますか**" (hỏi ý đoán) → **～と{思|おも}います**. Đừng lẫn.',
        'Kể tin mà không có ～そうです thì nghe như **mình tận mắt thấy** — với tin trên ti vi, luôn thêm そうです.',
        '"Ngày mai mưa" = {明日|あした}は{雨|あめ}**だ**そうです (không phải ~~雨そうです~~).',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Nếu … thì …, dù … vẫn …' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: ～たら・～ても',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{週末|しゅうまつ}、{雨|あめ}が{降|ふ}ったら、{何|なに}をしますか。', ro: 'Shuumatsu, ame ga futtara, nani o shimasu ka.', vi: 'Cuối tuần nếu mưa thì em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{雨|あめ}が{降|ふ}ったら、うちで{映画|えいが}を{見|み}ます。', ro: 'Ame ga futtara, uchi de eiga o mimasu.', vi: 'Nếu mưa thì em xem phim ở nhà ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'お{金|かね}がたくさんあったら、{何|なに}をしたいですか。', ro: 'Okane ga takusan attara, nani o shitai desu ka.', vi: 'Nếu có nhiều tiền em muốn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'お{金|かね}がたくさんあったら、{家族|かぞく}と{日本|にほん}へ{旅行|りょこう}したいです。', ro: 'Okane ga takusan attara, kazoku to Nihon e ryokou shitai desu.', vi: 'Nếu có nhiều tiền em muốn đi du lịch Nhật với gia đình.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}へ{行|い}ったら、どこへ{行|い}きたいですか。', ro: 'Nihon e ittara, doko e ikitai desu ka.', vi: 'Nếu sang Nhật em muốn đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}へ{行|い}ったら、{富士山|ふじさん}に{登|のぼ}りたいです。', ro: 'Nihon e ittara, Fujisan ni noboritai desu.', vi: 'Nếu sang Nhật em muốn leo núi Phú Sĩ.' },
        { who: 'Giám thị', role: 'examiner', text: '{時間|じかん}があったら、{何|なに}をしたいですか。', ro: 'Jikan ga attara, nani o shitai desu ka.', vi: 'Nếu có thời gian em muốn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{時間|じかん}があったら、{日本語|にほんご}の{本|ほん}をたくさん{読|よ}みたいです。', ro: 'Jikan ga attara, Nihongo no hon o takusan yomitai desu.', vi: 'Nếu có thời gian em muốn đọc nhiều sách tiếng Nhật.' },
        { who: 'Giám thị', role: 'examiner', text: '{雨|あめ}が{降|ふ}っても、{学校|がっこう}へ{来|き}ますか。', ro: 'Ame ga futte mo, gakkou e kimasu ka.', vi: 'Dù mưa em vẫn đến trường chứ?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{雨|あめ}が{降|ふ}っても、{学校|がっこう}へ{来|き}ます。', ro: 'Hai, ame ga futte mo, gakkou e kimasu.', vi: 'Vâng, dù mưa em vẫn đến trường.' },
        { who: 'Giám thị', role: 'examiner', text: '{忙|いそが}しくても、{毎日|まいにち}{日本語|にほんご}を{勉強|べんきょう}しますか。', ro: 'Isogashikute mo, mainichi Nihongo o benkyou shimasu ka.', vi: 'Dù bận em vẫn học tiếng Nhật mỗi ngày chứ?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{忙|いそが}しくても、{毎日|まいにち}{30分|さんじゅっぷん}{勉強|べんきょう}します。', ro: 'Hai, isogashikute mo, mainichi sanjuppun benkyou shimasu.', vi: 'Vâng, dù bận em vẫn học 30 phút mỗi ngày.' },
        { who: 'Giám thị', role: 'examiner', text: '{高|たか}くても、ほしいものは{何|なん}ですか。', ro: 'Takakute mo, hoshii mono wa nan desu ka.', vi: 'Thứ gì dù đắt em vẫn muốn có?' },
        { who: 'Bạn', role: 'candidate', text: '{高|たか}くても、{新|あたら}しいパソコンがほしいです。', ro: 'Takakute mo, atarashii pasokon ga hoshii desu.', vi: 'Dù đắt em vẫn muốn có máy tính mới.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Câu hỏi có **～たら** → trả lời **nhắc lại ～たら** + việc làm; câu hỏi có **～ても** → trả lời **nhắc lại ～ても** + việc vẫn làm. Không đổi mẫu.',
        '"～たら、{何|なに}をしたいですか" → cuối câu trả lời là **～たいです** (không phải ~~～ます~~ chỉ khi được hỏi "làm gì").',
        'Thể たら/ても của **いい, 行きます, 来ます** hay sai: **よかったら / {行|い}ったら / {来|き}たら** — **よくても / {行|い}っても / {来|き}ても**.',
      ],
    },

    /* ── Không tranh ③ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Thành phố của bạn, tin lớn của bạn (できる！)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: イベント・おすすめの店・ビッグニュース',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'あなたの{町|まち}にはどんなイベントがありますか。', ro: 'Anata no machi ni wa donna ibento ga arimasu ka.', vi: 'Thành phố của em có sự kiện gì?' },
        { who: 'Bạn', role: 'candidate', text: '{秋|あき}に{大|おお}きいお{祭|まつ}りがあります。とてもにぎやかです。', ro: 'Aki ni ookii omatsuri ga arimasu. Totemo nigiyaka desu.', vi: 'Mùa thu có một lễ hội lớn ạ. Rất náo nhiệt.' },
        { who: 'Giám thị', role: 'examiner', text: 'あなたのおすすめの{店|みせ}はどこですか。', ro: 'Anata no osusume no mise wa doko desu ka.', vi: 'Quán em giới thiệu là ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{学校|がっこう}の{近|ちか}くのフォーの{店|みせ}です。{安|やす}くておいしいです。でも、{昼|ひる}はいつも{混|こ}んでいます。', ro: 'Gakkou no chikaku no foo no mise desu. Yasukute oishii desu. Demo, hiru wa itsumo konde imasu.', vi: 'Quán phở gần trường ạ. Rẻ mà ngon. Nhưng buổi trưa lúc nào cũng đông.' },
        { who: 'Giám thị', role: 'examiner', text: 'あなたのビッグニュースは{何|なん}ですか。', ro: 'Anata no biggu nyuusu wa nan desu ka.', vi: 'Tin lớn của em là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{先月|せんげつ}、{大学|だいがく}のサッカー{大会|たいかい}に{出|で}ました。なんと{1位|いちい}になりました。', ro: 'Sengetsu, daigaku no sakkaa taikai ni demashita. Nanto ichi i ni narimashita.', vi: 'Tháng trước em tham gia giải bóng đá của trường. Thật không ngờ, bọn em được giải nhất.' },
        { who: 'Giám thị', role: 'examiner', text: 'どうでしたか。', ro: 'Dou deshita ka.', vi: 'Thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'とても{緊張|きんちょう}しましたが、{楽|たの}しかったです。いい{思|おも}い{出|で}になりました。', ro: 'Totemo kinchou shimashita ga, tanoshikatta desu. Ii omoide ni narimashita.', vi: 'Em rất hồi hộp nhưng vui lắm. Đã thành một kỷ niệm đẹp.' },
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — bản tin ti vi, con phố, tờ quảng cáo' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 15, giám thị hay hỏi: **{何|なに}があったそうですか · どうして～ましたか (N で) · {何|なに}が{無料|むりょう}ですか · {雨|あめ}だったら、どうなりますか · {店|みせ}はどうなっていますか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — bốn màn hình thời sự',
      head: ['Màn hình', 'Tranh vẽ'],
      rows: [
        ['①', 'Bản đồ Nhật có biểu tượng bão; đường ray, tàu đứng im'],
        ['②', 'Toà nhà cũ sập, kính vỡ; chữ "地震"'],
        ['③', 'Sân bóng: đội áo đỏ giơ cúp'],
        ['④', 'Ngã tư: hai ô tô va nhau, xe cứu thương; chữ "けが 2人"'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '①のニュースは{何|なん}ですか。', ro: 'Ichi no nyuusu wa nan desu ka.', vi: 'Tin ① là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{台風|たいふう}で{電車|でんしゃ}が{止|と}まったそうです。', ro: 'Taifuu de densha ga tomatta sou desu.', vi: 'Nghe nói vì bão mà tàu dừng chạy ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '②では{何|なに}があったそうですか。', ro: 'Ni de wa nani ga atta sou desu ka.', vi: 'Ở ② nghe nói đã xảy ra chuyện gì?' },
        { who: 'Bạn', role: 'candidate', text: '{地震|じしん}があったそうです。{地震|じしん}でビルが{倒|たお}れたそうです。', ro: 'Jishin ga atta sou desu. Jishin de biru ga taoreta sou desu.', vi: 'Nghe nói có động đất. Nghe nói vì động đất mà toà nhà bị đổ.' },
        { who: 'Giám thị', role: 'examiner', text: '③の{赤|あか}いチームはどうしましたか。', ro: 'San no akai chiimu wa dou shimashita ka.', vi: 'Đội đỏ ở ③ thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{試合|しあい}に{勝|か}ったそうです。', ro: 'Shiai ni katta sou desu.', vi: 'Nghe nói đã thắng trận ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '④の{事故|じこ}で{何人|なんにん}けがをしましたか。', ro: 'Yon no jiko de nannin kega o shimashita ka.', vi: 'Tai nạn ở ④ có mấy người bị thương?' },
        { who: 'Bạn', role: 'candidate', text: '{2人|ふたり}けがをしたそうです。', ro: 'Futari kega o shita sou desu.', vi: 'Nghe nói 2 người bị thương ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — một con phố',
      head: ['Chỗ', 'Tranh vẽ'],
      rows: [
        ['A', 'Hiệu sách: cửa cuốn kéo xuống, biển "CLOSED"'],
        ['B', 'Quán ramen: hàng người dài trước cửa'],
        ['C', 'Bến xe buýt: không có ai'],
        ['D', 'Vỉa hè: một chiếc ô bị gãy nằm dưới đất'],
        ['E', 'Cửa hàng tiện lợi: đèn biển hiệu tắt'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'Aの{本屋|ほんや}はどうですか。', ro: 'A no hon\'ya wa dou desu ka.', vi: 'Hiệu sách A thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{閉|し}まっています。', ro: 'Shimatte imasu.', vi: 'Đang đóng cửa ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'Bのラーメン{屋|や}の{前|まえ}に{何|なに}がありますか。', ro: 'B no raamen\'ya no mae ni nani ga arimasu ka.', vi: 'Trước quán ramen B có gì?' },
        { who: 'Bạn', role: 'candidate', text: '{人|ひと}がたくさん{並|なら}んでいます。きっとおいしいと{思|おも}います。', ro: 'Hito ga takusan narande imasu. Kitto oishii to omoimasu.', vi: 'Nhiều người đang xếp hàng ạ. Em nghĩ chắc chắn ngon.' },
        { who: 'Giám thị', role: 'examiner', text: 'Cのバス{停|てい}はどうですか。', ro: 'C no basutei wa dou desu ka.', vi: 'Bến xe buýt C thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'すいています。{誰|だれ}もいません。', ro: 'Suite imasu. Dare mo imasen.', vi: 'Vắng ạ. Không có ai.' },
        { who: 'Giám thị', role: 'examiner', text: 'Dに{何|なに}が{落|お}ちていますか。', ro: 'D ni nani ga ochite imasu ka.', vi: 'Ở D có gì rơi?' },
        { who: 'Bạn', role: 'candidate', text: '{傘|かさ}が{落|お}ちています。{壊|こわ}れています。', ro: 'Kasa ga ochite imasu. Kowarete imasu.', vi: 'Có cái ô rơi ạ. Nó bị hỏng.' },
        { who: 'Giám thị', role: 'examiner', text: 'Eのコンビニの{電気|でんき}はどうですか。', ro: 'E no konbini no denki wa dou desu ka.', vi: 'Đèn cửa hàng tiện lợi E thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{消|き}えています。', ro: 'Kiete imasu.', vi: 'Đang tắt ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — tờ quảng cáo trong tạp chí',
      head: ['Ô', 'Nội dung'],
      rows: [
        ['①', '"Sakura Center — lớp nấu ăn Nhật, thứ Bảy 10 giờ, 1.000 yên (sinh viên 500 yên)"'],
        ['②', '"Sở thú Yamashita — từ hôm nay 1 tuần MIỄN PHÍ"'],
        ['③', '"Siêu thị mới khai trương — mua từ 2.000 yên được quà"'],
        ['④', '"Lễ hội pháo hoa — 19 giờ, mưa thì huỷ"'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{料理教室|りょうりきょうしつ}はいくらですか。', ro: 'Ryouri kyoushitsu wa ikura desu ka.', vi: 'Lớp nấu ăn giá bao nhiêu?' },
        { who: 'Bạn', role: 'candidate', text: '{千円|せんえん}です。でも、{学生|がくせい}だったら、{500円|ごひゃくえん}です。', ro: 'Sen en desu. Demo, gakusei dattara, gohyaku en desu.', vi: '1.000 yên ạ. Nhưng nếu là sinh viên thì 500 yên.' },
        { who: 'Giám thị', role: 'examiner', text: '{何|なに}が{無料|むりょう}ですか。', ro: 'Nani ga muryou desu ka.', vi: 'Cái gì miễn phí?' },
        { who: 'Bạn', role: 'candidate', text: '{山下|やました}{動物園|どうぶつえん}です。{今日|きょう}から{1週間|いっしゅうかん}{無料|むりょう}だそうです。', ro: 'Yamashita doubutsuen desu. Kyou kara isshuukan muryou da sou desu.', vi: 'Sở thú Yamashita ạ. Nghe nói từ hôm nay miễn phí 1 tuần.' },
        { who: 'Giám thị', role: 'examiner', text: '{新|あたら}しいスーパーで、プレゼントをもらうことができますか。', ro: 'Atarashii suupaa de, purezento o morau koto ga dekimasu ka.', vi: 'Ở siêu thị mới có được nhận quà không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{2,000円|にせんえん}{以上|いじょう}{買|か}ったら、もらうことができます。', ro: 'Hai, nisen en ijou kattara, morau koto ga dekimasu.', vi: 'Có ạ, nếu mua từ 2.000 yên trở lên thì được nhận.' },
        { who: 'Giám thị', role: 'examiner', text: '{雨|あめ}が{降|ふ}ったら、{花火大会|はなびたいかい}はどうなりますか。', ro: 'Ame ga futtara, hanabi taikai wa dou narimasu ka.', vi: 'Nếu mưa thì lễ hội pháo hoa thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}です。', ro: 'Ame ga futtara, chuushi desu.', vi: 'Nếu mưa thì huỷ ạ.' },
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — rủ bạn theo tờ thông tin (ロールプレイ p.261)' },
    {
      t: 'p',
      text: 'Vai **A** đang xem tạp chí thông tin của thành phố: giới thiệu sự kiện / cửa hàng rồi rủ **B**. Vai **B** hỏi thật nhiều: khi nào, ở đâu, bao nhiêu tiền, nếu mưa thì sao, có đông không. Kịch bản mẫu dùng tờ quảng cáo "trận bóng chày ở sân vận động — người lớn 1.000 yên, từ 3 người trở lên mỗi người 800 yên".',
    },
    {
      t: 'dialogue',
      title: 'Kịch bản mẫu — A rủ, B hỏi',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{来週|らいしゅう}の{土曜日|どようび}、ドームで{野球|やきゅう}の{試合|しあい}があるそうですよ。', ro: 'B-san, raishuu no doyoubi, doomu de yakyuu no shiai ga aru sou desu yo.', vi: 'B, nghe nói thứ Bảy tuần sau ở sân vận động mái vòm có trận bóng chày đấy.' },
        { who: 'B', role: 'b', text: 'へえ。チケットはいくらですか。', ro: 'Hee. Chiketto wa ikura desu ka.', vi: 'Ồ. Vé bao nhiêu?' },
        { who: 'A', role: 'a', text: '{大人|おとな}は{千円|せんえん}ですが、{3人|さんにん}{以上|いじょう}で{行|い}ったら、{1人|ひとり}{800円|はっぴゃくえん}だそうです。', ro: 'Otona wa sen en desu ga, sannin ijou de ittara, hitori happyaku en da sou desu.', vi: 'Người lớn 1.000 yên, nhưng nghe nói nếu đi từ 3 người trở lên thì mỗi người 800 yên.' },
        { who: 'B', role: 'b', text: '{雨|あめ}が{降|ふ}ったら、どうなりますか。', ro: 'Ame ga futtara, dou narimasu ka.', vi: 'Nếu mưa thì sao?' },
        { who: 'A', role: 'a', text: 'ドームですから、{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。', ro: 'Doomu desu kara, ame ga futte mo, shiai wa arimasu.', vi: 'Vì là sân có mái nên dù mưa vẫn đấu.' },
        { who: 'B', role: 'b', text: '{人|ひと}は{多|おお}いですか。', ro: 'Hito wa ooi desu ka.', vi: 'Có đông người không?' },
        { who: 'A', role: 'a', text: '{土曜日|どようび}ですから、きっと{多|おお}いと{思|おも}います。でも、{早|はや}く{行|い}ったら、いい{席|せき}があると{思|おも}います。', ro: 'Doyoubi desu kara, kitto ooi to omoimasu. Demo, hayaku ittara, ii seki ga aru to omoimasu.', vi: 'Vì là thứ Bảy nên chắc chắn đông. Nhưng nếu đi sớm thì chắc có chỗ tốt.' },
        { who: 'B', role: 'b', text: 'じゃ、アンナさんも{誘|さそ}って、{3人|さんにん}で{行|い}きましょう。', ro: 'Ja, Anna-san mo sasotte, sannin de ikimashou.', vi: 'Vậy rủ cả Anna, đi 3 người nhé.' },
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–15. Tắt furigana khi đã quen (hoặc luyện ở **Chữ Hán · Đọc không furigana**).',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'きのう、テレビでニュースをみました。{台風|たいふう}でしんかんせんがとまったそうです。ホテルにとまったひともたくさんいたそうです。きょうは{本当|ほんとう}にいいてんきです。あしたはサッカーの{試合|しあい}があります。あしたもきっと{晴|は}れるとおもいます。',
          ro: 'Kinou, terebi de nyuusu o mimashita. Taifuu de shinkansen ga tomatta sou desu. Hoteru ni tomatta hito mo takusan ita sou desu. Kyou wa hontou ni ii tenki desu. Ashita wa sakkaa no shiai ga arimasu. Ashita mo kitto hareru to omoimasu.',
          vi: 'Hôm qua tôi xem thời sự trên ti vi. Nghe nói vì bão mà tàu Shinkansen dừng. Nghe nói cũng có nhiều người phải ngủ lại khách sạn. Hôm nay trời thật đẹp. Mai có trận bóng đá. Tôi nghĩ mai chắc chắn cũng nắng.',
        },
        {
          en: 'えきのまえに{新|あたら}しいデパートができたそうです。オープンのひは、1,000えんいじょうかったら、プレゼントがあります。{無料|むりょう}のコーヒーもあるそうです。ひとがおおくても、いきたいです。{夕方|ゆうがた}、ともだちといっしょにいきます。',
          ro: 'Eki no mae ni atarashii depaato ga dekita sou desu. Oopun no hi wa, sen en ijou kattara, purezento ga arimasu. Muryou no koohii mo aru sou desu. Hito ga ookute mo, ikitai desu. Yuugata, tomodachi to issho ni ikimasu.',
          vi: 'Nghe nói trước ga mới mở một cửa hàng bách hoá. Ngày khai trương, nếu mua từ 1.000 yên trở lên thì có quà. Nghe nói còn có cà phê miễn phí. Dù đông người tôi vẫn muốn đi. Chiều tối tôi đi cùng bạn.',
        },
        {
          en: 'せんしゅう、{地震|じしん}がありました。わたしのへやのまどガラスが{割|わ}れました。とても{怖|こわ}かったです。くにのかぞくは{心配|しんぱい}して、でんわをくれました。いまはだいじょうぶです。みなさんもきをつけてください。',
          ro: 'Senshuu, jishin ga arimashita. Watashi no heya no mado garasu ga waremashita. Totemo kowakatta desu. Kuni no kazoku wa shinpai shite, denwa o kuremashita. Ima wa daijoubu desu. Minasan mo ki o tsukete kudasai.',
          vi: 'Tuần trước có động đất. Kính cửa sổ phòng tôi bị vỡ. Tôi rất sợ. Gia đình ở quê lo lắng nên gọi điện cho tôi. Bây giờ thì không sao. Mọi người cũng cẩn thận nhé.',
        },
        {
          en: 'まちをあるきました。{事故|じこ}ででんしゃがとまっていました。バスていにはひとがたくさんならんでいました。カフェは{閉|し}まっていました。でも、あたらしいラーメンやはすいていました。きっとおいしいとおもいます。{最後|さいご}にそこでたべました。',
          ro: 'Machi o arukimashita. Jiko de densha ga tomatte imashita. Basutei ni wa hito ga takusan narande imashita. Kafe wa shimatte imashita. Demo, atarashii raamen\'ya wa suite imashita. Kitto oishii to omoimasu. Saigo ni soko de tabemashita.',
          vi: 'Tôi đi dạo phố. Vì tai nạn mà tàu đang dừng. Ở bến xe buýt nhiều người xếp hàng. Quán cà phê đóng cửa. Nhưng quán ramen mới thì vắng. Tôi nghĩ chắc chắn ngon. Cuối cùng tôi ăn ở đó.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**台風 たいふう**, **本当 ほんとう**, **試合 しあい**, **晴れる はれる**, **夕方 ゆうがた**, **無料 むりょう**, **地震 じしん**, **心配 しんぱい**, **事故 じこ**, **閉まって しまって**, **最後 さいご** — từ chữ Hán dạng đề thi.',
        'Katakana kéo dài / âm ngắt: ニュース, ホテル, サッカー **sakkaa**, デパート **depaato**, オープン **oopun**, プレゼント, コーヒー **koohii**, ガラス, カフェ, ラーメン **raamen**.',
        '～そうです đọc liền: とまったそうです (**tomatta sou desu**). ～たら／～ても: **kattara**, **ookute mo**.',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: きょう**は**, ニュース**を**, バスてい**に****は**.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b15-noi-ghi-am',
      part: '1',
      questions: [
        'さいきん、どんな ニュースを みましたか。',
        'まいにち ニュースを みますか。',
        'あしたの てんきは どうだと おもいますか。',
        'しゅうまつ、あめが ふったら、なにを しますか。',
        'おかねが たくさん あったら、なにを したいですか。',
        'にほんへ いったら、なにを したいですか。',
        'あめが ふっても、がっこうへ きますか。',
        'いそがしくても、まいにち にほんごを べんきょうしますか。',
        'あなたの まちには どんな イベントが ありますか。',
        'あなたの おすすめの みせは どこですか。',
        'あなたの ビッグニュースは なんですか。',
        'ともだちが「あしたは あめだそうですよ」と いいました。なんと こたえますか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b15-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 15 (có đáp án) + Ôn tập cả sách',
  goal: 'Tự chia thể たら / ても / thể thường, dịch, đổi dạng câu, chọn trợ từ – từ vựng – câu đáp và ghép câu Bài 15 không cần nhìn bài học; rồi biết mỗi hình thái động từ của cả sách học ở bài nào để ôn.',
  minutes: 55,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b15-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: '普通形 + そうです（ナA／N：だそうです）· N で (nguyên nhân) · ～たら · ～ても · きっと／たぶん + 普通形 + と思います · N が V(tự động từ)ています',
      items: [
        { q: 'Nghe nói ngày mai bão đến.', answers: V('{明日|あした}、{台風|たいふう}が{来|く}るそうです。', '{明日|あした}{台風|たいふう}が{来|く}るそうです。', '{明日|あした}は{台風|たいふう}が{来|く}るそうです。'), hint: '台風, 来る + そうです' },
        { q: 'Nghe nói tháng sau bảo tàng miễn phí.', answers: V('{来月|らいげつ}、{美術館|びじゅつかん}は{無料|むりょう}だそうです。', '{来月|らいげつ}{美術館|びじゅつかん}は{無料|むりょう}だそうです。'), hint: '美術館, 無料 + だそうです' },
        { q: 'Nghe nói tuần trước anh Nishikawa nhập viện.', answers: V('{先週|せんしゅう}、{西川|にしかわ}さんが{入院|にゅういん}したそうです。', '{先週|せんしゅう}{西川|にしかわ}さんが{入院|にゅういん}したそうです。', '{先週|せんしゅう}、{西川|にしかわ}さんは{入院|にゅういん}したそうです。'), hint: '入院した + そうです' },
        { q: 'Nghe nói mì ramen quán kia ngon.', answers: V('あの{店|みせ}のラーメンはおいしいそうです。'), hint: 'おいしい + そうです' },
        { q: 'Vì động đất mà toà nhà bị đổ.', answers: V('{地震|じしん}でビルが{倒|たお}れました。', '{地震|じしん}でビルが{倒|たお}れたそうです。'), hint: '地震で, 倒れます' },
        { q: 'Vì tai nạn nên tàu đang dừng.', answers: V('{事故|じこ}で{電車|でんしゃ}が{止|と}まっています。'), hint: '事故で, 止まっています' },
        { q: 'Nếu có thời gian thì đi cùng tôi không?', answers: V('{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。', '{時間|じかん}があったら{一緒|いっしょ}に{行|い}きませんか。'), hint: 'あった + ら, 一緒に行きませんか' },
        { q: 'Nếu rẻ thì tôi muốn mua máy tính.', answers: V('{安|やす}かったら、パソコンを{買|か}いたいです。', '{安|やす}かったらパソコンを{買|か}いたいです。'), hint: '安かった + ら' },
        { q: 'Nếu mưa thì trận đấu bị huỷ.', answers: V('{雨|あめ}だったら、{試合|しあい}は{中止|ちゅうし}です。', '{雨|あめ}が{降|ふ}ったら、{試合|しあい}は{中止|ちゅうし}です。'), hint: '雨だったら, 中止' },
        { q: 'Nếu bạn thấy được thì đi cùng tôi không? (lời rủ lịch sự)', answers: V('もしよかったら、{一緒|いっしょ}に{行|い}きませんか。', 'よかったら、{一緒|いっしょ}に{行|い}きませんか。'), hint: '(もし)よかったら' },
        { q: 'Dù mưa trận đấu vẫn có.', answers: V('{雨|あめ}が{降|ふ}っても、{試合|しあい}はあります。', '{雨|あめ}でも、{試合|しあい}はあります。'), hint: '降って + も' },
        { q: 'Dù đắt tôi vẫn muốn có kim từ điển mới.', answers: V('{高|たか}くても、{新|あたら}しい{電子辞書|でんしじしょ}がほしいです。'), hint: '高くても, 電子辞書がほしい' },
        { q: 'Dù đông người tôi vẫn muốn đi.', answers: V('{人|ひと}が{多|おお}くても、{行|い}きたいです。'), hint: '多くても' },
        { q: 'Dù không miễn phí tôi vẫn muốn đi.', answers: V('{無料|むりょう}じゃなくても、{行|い}きたいです。', '{無料|むりょう}でなくても、{行|い}きたいです。'), hint: '無料じゃなくても' },
        { q: 'Tôi nghĩ ngày mai chắc chắn trời nắng.', answers: V('{明日|あした}はきっと{晴|は}れると{思|おも}います。', 'きっと{明日|あした}は{晴|は}れると{思|おも}います。'), hint: 'きっと, 晴れる + と思います' },
        { q: 'Tôi nghĩ có lẽ Carlos không đến bữa tiệc.', answers: V('カルロスさんはたぶんパーティーに{来|こ}ないと{思|おも}います。', 'たぶんカルロスさんはパーティーに{来|こ}ないと{思|おも}います。'), hint: 'たぶん, 来ない + と思います' },
        { q: 'Tôi nghĩ lễ hội pháo hoa chắc chắn đẹp.', answers: V('{花火大会|はなびたいかい}はきっときれいだと{思|おも}います。', 'きっときれいだと{思|おも}います。'), hint: 'きれい + だ + と思います' },
        { q: 'Dạ, cái cốc bị bẩn ạ. (nói với nhân viên)', answers: V('あのう、コップが{汚|よご}れています。', 'すみません、コップが{汚|よご}れています。', 'コップが{汚|よご}れています。'), hint: '汚れています' },
        { q: 'Ở cửa vào nhiều người đang xếp hàng.', answers: V('{入|い}り{口|ぐち}に{人|ひと}がたくさん{並|なら}んでいます。'), hint: '入り口に, 並んでいます' },
        { q: 'Cửa hàng kia đóng cửa rồi. Mình sang cửa hàng khác không?', answers: V('あの{店|みせ}は{閉|し}まっています。ほかの{店|みせ}へ{行|い}きませんか。', 'あの{店|みせ}は{閉|し}まっています。ほかの{店|みせ}に{行|い}きませんか。', 'あの{店|みせ}が{閉|し}まっています。ほかの{店|みせ}へ{行|い}きませんか。'), hint: '閉まっています, ほかの店' },
      ],
    },
    {
      t: 'quiz',
      id: 'b15-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'たら = thể た + ら · ても = thể て + も · 普通形 + そうです (N／ナA: だそうです) · 普通形 + と思います',
      items: [
        { q: '{降|ふ}ります → thể たら', answers: V('{降|ふ}ったら') },
        { q: '{行|い}きます → thể たら', answers: V('{行|い}ったら') },
        { q: '{安|やす}い → thể たら', answers: V('{安|やす}かったら') },
        { q: 'いい → thể たら', answers: V('よかったら') },
        { q: '{暇|ひま}です → thể たら', answers: V('{暇|ひま}だったら') },
        { q: '{間|ま}に{合|あ}いません → thể たら (phủ định)', answers: V('{間|ま}に{合|あ}わなかったら') },
        { q: '{急|いそ}ぎます → thể ても', answers: V('{急|いそ}いでも') },
        { q: '{多|おお}い → thể ても', answers: V('{多|おお}くても') },
        { q: '{大変|たいへん}です → thể ても', answers: V('{大変|たいへん}でも') },
        { q: '{無料|むりょう}じゃありません → thể ても', answers: V('{無料|むりょう}じゃなくても', '{無料|むりょう}でなくても') },
        { q: '{台風|たいふう}が{来|き}ます → "nghe nói" (～そうです)', answers: V('{台風|たいふう}が{来|く}るそうです') },
        { q: '{試合|しあい}は{中止|ちゅうし}です → "nghe nói" (～そうです)', answers: V('{試合|しあい}は{中止|ちゅうし}だそうです') },
        { q: 'チームが{負|ま}けました → "nghe nói" (～そうです)', answers: V('チームが{負|ま}けたそうです') },
        { q: '{明日|あした}は{晴|は}れます → "tôi đoán chắc chắn" (きっと～と思います)', answers: V('{明日|あした}はきっと{晴|は}れると{思|おも}います', 'きっと{明日|あした}は{晴|は}れると{思|おも}います') },
        { q: '{電車|でんしゃ}が{止|と}まりました → tả trạng thái trước mắt (～ています)', answers: V('{電車|でんしゃ}が{止|と}まっています') },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-bt-tro-tu',
      title: 'Chọn trợ từ / từ nối đúng',
      items: [
        { q: '{事故|じこ}＿{電車|でんしゃ}が{止|と}まりました。', options: ['に', 'で', 'を', 'が'], correct: 1, why: 'Nguyên nhân → **で** (ポイント 124).' },
        { q: '{電車|でんしゃ}＿{止|と}まっています。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'Tự động từ → **が**.' },
        { q: '{雨|あめ}＿{降|ふ}っても、{行|い}きます。', options: ['を', 'に', 'が', 'で'], correct: 2, why: '雨**が**降ります.' },
        { q: '{試合|しあい}＿{勝|か}ちました。', options: ['を', 'に', 'が', 'で'], correct: 1, why: '試合**に**勝ちます.' },
        { q: '{電車|でんしゃ}＿{間|ま}に{合|あ}いました。', options: ['を', 'で', 'に', 'と'], correct: 2, why: 'Kịp N → N **に** 間に合います.' },
        { q: '{入|い}り{口|ぐち}＿{人|ひと}が{並|なら}んでいます。', options: ['に', 'を', 'で', 'へ'], correct: 0, why: 'Nơi tồn tại trạng thái → **に**.' },
        { q: 'カルロスさんは{来月|らいげつ}{結婚|けっこん}する＿です。 (nghe nói)', options: ['そう', 'よう', 'と', 'から'], correct: 0, why: '普通形 + **そう**です.' },
        { q: 'あの{店|みせ}はきっとおいしい＿{思|おも}います。', options: ['を', 'と', 'が', 'に'], correct: 1, why: '普通形 + **と**思います.' },
        { q: '{時間|じかん}があっ＿、{一緒|いっしょ}に{行|い}きませんか。', options: ['ても', 'たら', 'から', 'て'], correct: 1, why: 'Nếu → **たら**.' },
        { q: '{人|ひと}が{多|おお}く＿、{行|い}きたいです。', options: ['たら', 'ても', 'て', 'から'], correct: 1, why: 'Dù → **ても**.' },
        { q: '{友達|ともだち}と{3人|さんにん}＿{行|い}ったら、ストラップをもらうことができます。 (trợ từ số người)', options: ['で', 'に', 'と', 'を'], correct: 0, why: 'Số người → **で** (ポイント 80).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-bt-tu-vung',
      title: 'Chọn từ đúng',
      items: [
        { q: '{昨日|きのう}の{夜|よる}、{大|おお}きい＿がありました。ビルが{倒|たお}れました。', options: ['{台風|たいふう}', '{地震|じしん}', '{曇|くも}り', '{中止|ちゅうし}'], correct: 1, why: 'Làm đổ nhà → **{地震|じしん}** (động đất).' },
        { q: '{雨|あめ}だったら、{試合|しあい}は＿です。', options: ['{無料|むりょう}', '{中止|ちゅうし}', '{本当|ほんとう}', '{心配|しんぱい}'], correct: 1, why: 'Mưa thì **huỷ** (中止).' },
        { q: 'この{美術館|びじゅつかん}は{学生|がくせい}は＿です。お{金|かね}はいりません。', options: ['{無料|むりょう}', '{中止|ちゅうし}', '{昔|むかし}', '{夕方|ゆうがた}'], correct: 0, why: 'Không tốn tiền → **{無料|むりょう}**.' },
        { q: '{有名|ゆうめい}な{歌手|かしゅ}が＿そうです。 (qua đời, lịch sự)', options: ['{死|し}にました', '{亡|な}くなった', '{倒|たお}れた', '{負|ま}けた'], correct: 1, why: 'Người → **{亡|な}くなった** (lịch sự).' },
        { q: '{駅|えき}の{前|まえ}に{新|あたら}しいデパートが＿。', options: ['できました', 'ありました', 'しました', 'なりました'], correct: 0, why: 'Mới mở → **できました**.' },
        { q: '{急|いそ}いだら、{電車|でんしゃ}に＿と{思|おも}います。', options: ['{間|ま}に{合|あ}う', '{混|こ}む', 'すく', '{止|と}まる'], correct: 0, why: 'Kịp → **{間|ま}に{合|あ}う**.' },
        { q: '{雨|あめ}が＿たら、{出|で}かけましょう。 (tạnh)', options: ['{降|ふ}っ', 'やん', '{晴|は}れ', '{割|わ}れ'], correct: 1, why: 'Tạnh → **やむ** → やんだら.' },
        { q: '{週末|しゅうまつ}はレストランがとても＿います。', options: ['すいて', '{混|こ}んで', '{落|お}ちて', '{消|き}えて'], correct: 1, why: 'Đông → **{混|こ}んで**います.' },
        { q: '{部屋|へや}の{電気|でんき}が＿います。{誰|だれ}もいないと{思|おも}います。', options: ['{消|き}えて', '{消|け}して', 'ついて', '{集|あつ}まって'], correct: 0, why: 'Tự động từ **{消|き}えて**います (không có ai → đèn tắt).' },
        { q: 'このコップは＿います。{水|みず}を{入|い}れないでください。', options: ['{汚|よご}れて', '{割|わ}れて', '{閉|し}まって', '{混|こ}んで'], correct: 1, why: 'Cốc **vỡ** thì không đựng nước được → {割|わ}れて.' },
        { q: '{明日|あした}は＿{晴|は}れると{思|おも}います。 (gần như chắc chắn)', options: ['たぶん', 'きっと', 'もし', 'なんと'], correct: 1, why: 'Gần như chắc chắn → **きっと**.' },
        { q: '＿{雨|あめ}が{降|ふ}ったら、うちにいます。', options: ['きっと', 'もし', 'たぶん', 'なんと'], correct: 1, why: 'Giả định + たら → **もし**.' },
        { q: 'スピーチコンテストで、なんと{1|いち}＿になりました！', options: ['{位|い}', '{回|かい}', '{度|ど}', '{番|ばん}'], correct: 0, why: 'Hạng → **～{位|い}**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b15-bt-hoi-dap',
      title: 'Chọn câu đáp đúng',
      items: [
        { q: 'A：{先週|せんしゅう}、{西川|にしかわ}さんが{入院|にゅういん}したそうですよ。', options: ['えっ？ {心配|しんぱい}ですね。', 'よかったですね。', 'おめでとうございます。', 'いただきます。'], correct: 0, why: 'Tin lo → **{心配|しんぱい}ですね**.' },
        { q: 'A：{地震|じしん}でビルが{倒|たお}れたそうです。', options: ['{本当|ほんとう}ですか。{怖|こわ}いですね。', 'いいですね。{行|い}きましょう。', 'よかったですね。', 'はい、そうします。'], correct: 0, why: 'Tin sợ → **{怖|こわ}いですね**.' },
        { q: 'A：カルロスさんのチームが{勝|か}ったそうです。', options: ['{残念|ざんねん}ですね。', 'よかったですね。', '{怖|こわ}いですね。', '{大変|たいへん}ですね。'], correct: 1, why: 'Tin vui → **よかったですね**.' },
        { q: 'A：{週末|しゅうまつ}、フリーマーケットがあるそうですよ。{一緒|いっしょ}に{行|い}きませんか。', options: ['いいですね。{行|い}きましょう。', 'いいえ、{行|い}きませんでした。', 'それはいけませんね。', 'お{大事|だいじ}に。'], correct: 0, why: 'Nhận lời rủ: **いいですね。{行|い}きましょう**.' },
        { q: 'A：{人|ひと}が{多|おお}いと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。', options: ['{人|ひと}が{多|おお}かったら、{行|い}きたいです。', '{人|ひと}が{多|おお}くても、{行|い}きたいです。', '{人|ひと}が{多|おお}いそうです。', '{人|ひと}が{多|おお}いでも、{行|い}きたいです。'], correct: 1, why: 'Dù đông vẫn muốn → **{多|おお}くても**.' },
        { q: 'A：{雨|あめ}が{降|ふ}ったら、{花火大会|はなびたいかい}はありますか。', options: ['いいえ、{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}だそうです。', 'はい、{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}です。', 'いいえ、{雨|あめ}が{降|ふ}っても、あります。', 'はい、{雨|あめ}だそうです。'], correct: 0, why: 'Không có → **いいえ** + 中止. (はい + 中止 mâu thuẫn; いいえ + あります mâu thuẫn.)' },
        { q: 'A：あっ、{電車|でんしゃ}が{止|と}まっています。', options: ['{本当|ほんとう}だ。バスで{行|い}きませんか。', 'はい、{止|と}めてください。', '{電車|でんしゃ}を{止|と}めましょう。', 'おかげさまで。'], correct: 0, why: 'Xác nhận + đề nghị: **{本当|ほんとう}だ。バスで{行|い}きませんか**.' },
      ],
    },
    {
      t: 'build',
      id: 'b15-bt-ghep',
      title: 'Ghép câu — từ tin trên ti vi đến lúc ra phố',
      items: [
        { vi: 'Bạn xem thời sự chưa?', chips: ['ニュースを', '{見|み}ましたか', 'ニュースが', '{見|み}ますか'], answer: ['ニュースを', '{見|み}ましたか'], ro: 'Nyuusu o mimashita ka.' },
        { vi: 'Nghe nói vì bão mà tàu dừng chạy.', chips: ['{台風|たいふう}で', '{電車|でんしゃ}が', '{止|と}まった', 'そうです', '{台風|たいふう}に', '{止|と}めた'], answer: ['{台風|たいふう}で', '{電車|でんしゃ}が', '{止|と}まった', 'そうです'], ro: 'Taifuu de densha ga tomatta sou desu.' },
        { vi: 'Nghe nói trước ga mới mở một siêu thị.', chips: ['{駅|えき}の{前|まえ}に', '{新|あたら}しい', 'スーパーが', 'できた', 'そうです', 'しました'], answer: ['{駅|えき}の{前|まえ}に', '{新|あたら}しい', 'スーパーが', 'できた', 'そうです'], ro: 'Eki no mae ni atarashii suupaa ga dekita sou desu.' },
        { vi: 'Nếu mua từ 1.000 yên trở lên thì có quà.', chips: ['{1,000円|せんえん}{以上|いじょう}', '{買|か}ったら、', 'プレゼントが', 'あります', '{買|か}っても、', '{買|か}いたら、'], answer: ['{1,000円|せんえん}{以上|いじょう}', '{買|か}ったら、', 'プレゼントが', 'あります'], ro: 'Sen en ijou kattara, purezento ga arimasu.' },
        { vi: 'Nếu bạn thấy được thì đi cùng tôi không?', chips: ['もし', 'よかったら、', '{一緒|いっしょ}に', '{行|い}きませんか', 'いいだったら、', 'よくても、'], answer: ['もし', 'よかったら、', '{一緒|いっしょ}に', '{行|い}きませんか'], ro: 'Moshi yokattara, issho ni ikimasen ka.' },
        { vi: 'Dù phải chờ lâu tôi vẫn muốn ăn.', chips: ['{長|なが}い{時間|じかん}', '{待|ま}っても、', '{食|た}べたいです', '{待|ま}ったら、', '{待|ま}ちても、'], answer: ['{長|なが}い{時間|じかん}', '{待|ま}っても、', '{食|た}べたいです'], ro: 'Nagai jikan matte mo, tabetai desu.' },
        { vi: 'Tôi nghĩ chắc chắn sẽ náo nhiệt và vui.', chips: ['きっと', 'にぎやかで', '{楽|たの}しいと', '{思|おも}います', 'にぎやかだ', '{楽|たの}しいだと'], answer: ['きっと', 'にぎやかで', '{楽|たの}しいと', '{思|おも}います'], ro: 'Kitto nigiyaka de tanoshii to omoimasu.' },
        { vi: 'Dạ, cái cốc bị bẩn ạ.', chips: ['あのう、', 'コップが', '{汚|よご}れています', 'コップを', '{汚|よご}れます'], answer: ['あのう、', 'コップが', '{汚|よご}れています'], ro: 'Anou, koppu ga yogorete imasu.' },
        { vi: 'Ở bến xe buýt nhiều người đang xếp hàng. Mình đi taxi không?', chips: ['バス{停|てい}に', '{人|ひと}が', 'たくさん', '{並|なら}んでいます。', 'タクシーで', '{行|い}きませんか', 'タクシーに'], answer: ['バス{停|てい}に', '{人|ひと}が', 'たくさん', '{並|なら}んでいます。', 'タクシーで', '{行|い}きませんか'], ro: 'Basutei ni hito ga takusan narande imasu. Takushii de ikimasen ka.' },
        { vi: 'Quán kia đóng cửa rồi. Đèn cũng tắt.', chips: ['あの{店|みせ}は', '{閉|し}まっています。', '{電気|でんき}も', '{消|き}えています', '{消|け}しています', '{閉|し}めています。'], answer: ['あの{店|みせ}は', '{閉|し}まっています。', '{電気|でんき}も', '{消|き}えています'], ro: 'Ano mise wa shimatte imasu. Denki mo kiete imasu.' },
      ],
    },

    /* ── Ôn tập cả sách ── */
    { t: 'h', text: 'Ôn tập cả sách — Bài 15 là bài cuối' },
    {
      t: 'note',
      title: 'Ôn tập cả sách — mỗi hình thái động từ học ở đâu (quay lại đúng bài để ôn)',
      items: [
        '**Thể ます** ({食|た}べます／ません／ました／ませんでした) — **Bài 3** (ポイント 16) · quá khứ **Bài 5** (37) · ～たいです **Bài 5** (41) · ～ませんか／～ましょう **Bài 6** (48, 49) · ～ましょうか **Bài 7** (65).',
        '**Thể て** ({食|た}べて) — **Bài 7** (～てください 63, ～ています 64) · **Bài 8** (～ています nơi ở / nghề 72–73) · **Bài 9** (Vて、V 83) · **Bài 10** (～てもいいですか 89, ～ています 90, まだ～ていません 91, ～てきます 92) · **Bài 11** (thói quen 98) · **Bài 12** (～てから 107) · **Bài 13** (đang mặc 110) · **Bài 14** (～てはいけません 114) · **Bài 15** (～ても 121, trạng thái 122).',
        '**Thể từ điển** ({食|た}べる) — **Bài 9** (～こと 81, ～ことができます 82) · **Bài 10** (93) · **Bài 11** (～とき 101) · **Bài 12** (～前に 106) · **Bài 14** (～と、 113).',
        '**Thể ない** ({食|た}べない) — **Bài 10** (～ないでください 88) · **Bài 11** (～ないとき 101) · **Bài 12** (～ないほうがいいです 105) · **Bài 14** (～なければなりません 115, ～なくてもいいです 116) · **Bài 15** (～なくても 121, ～なかったら 120).',
        '**Thể た** ({食|た}べた) — **Bài 11** (～たり～たりします 99, ～たとき 101) · **Bài 12** (～たほうがいいです 105) · **Bài 13** (～たことがあります 108) · **Bài 15** (～たら 120).',
        '**Thể thường (普通形)** — **Bài 11** (nói với bạn thân 103, bảng 表 p.284) · **Bài 12** (～んです 104) · **Bài 13** (普通形 + N 109) · **Bài 14** (～と{思|おも}います 117, 「～」と{言|い}います 118) · **Bài 15** (～そうです 119, ～と{思|おも}います đoán 123).',
        '**Tính từ** — イA／ナA hiện tại **Bài 4** (24, 25) · quá khứ **Bài 5** (38) · ～くて／～で **Bài 8** (75) · ～くなります／～になります **Bài 10** (95). Ôn cả 4 thể một lượt bằng bảng **Ngữ pháp · Thể thường** ở trên và bảng 表 p.282–284 của sách.',
      ],
    },
  ],
};

export const BAI_15: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ═══════════════════ 📖 THEO SÁCH — Bài 15 (p.253–269) ═══════════════════
 * Cùng khuôn với ./sach2.ts: mỗi trang = tiêu đề (số trang + mục) → tả tranh bằng lời
 * của mình + mục tiêu できる → cô hỏi–bạn đáp → mẹo trả lời (chỉ tới ポイント và mục
 * trên web) → câu mẫu cho từng số của 言ってみよう. KHÔNG ghi đáp án CD やってみよう.
 * Người học mẫu: "ミン" (Minh), sinh viên Việt ở ĐH FPT, quê Hà Nội.
 */

type SLine = Extract<Block, { t: 'dialogue' }>['lines'][number];
type SEx = { en: string; ro: string; vi: string };

/** Cô giáo hỏi. */
const C = (text: string, ro: string, vi: string): SLine => ({ who: 'Cô giáo', role: 'examiner', text, ro, vi });
/** Bạn trả lời. */
const S = (text: string, ro: string, vi: string): SLine => ({ who: 'Bạn', role: 'candidate', text, ro, vi });
const E = (en: string, ro: string, vi: string): SEx => ({ en, ro, vi });

/** Một trang (hoặc một cặp trang): tiêu đề → tả tranh/mục đích → [khối thêm] → cô hỏi–bạn đáp → mẹo. */
function trang(h: string, p: string, lines: SLine[], meo: string[], extra: Block[] = []): Block[] {
  return [
    { t: 'h', text: h },
    { t: 'p', text: p },
    ...extra,
    { t: 'dialogue', title: 'Cô hỏi — bạn trả lời', lines },
    { t: 'note', title: 'Mẹo trả lời', items: meo },
  ];
}

/** Danh sách câu mẫu cho từng số / từng gợi ý của 言ってみよう. */
const mau = (items: SEx[]): Block => ({ t: 'examples', items });

const CACH_DUNG: Block = {
  t: 'note',
  title: 'Dùng phần này thế nào',
  items: [
    'Mở sách đúng trang ghi ở tiêu đề, nhìn tranh trước, rồi mới đọc phần tả tranh ở đây.',
    'Bấm nghe đoạn "Cô hỏi — bạn trả lời", đọc to phần của **Bạn** 3 lần, sau đó che đáp án và tự trả lời khi nghe câu hỏi.',
    'Luôn trả lời **đủ câu**, có です／ます ở cuối, câu hỏi có/không thì mở đầu bằng **はい／いいえ** (thi JPD113 trừ điểm nếu quên).',
    'Không nghe rõ câu cô hỏi: nói **もう{一度|いちど}お{願|ねが}いします** hoặc **ゆっくりお{願|ねが}いします**.',
    'Bài nghe やってみよう: ở đây KHÔNG ghi đáp án CD — chỉ ghi cần bắt từ nào. Nghe trên lớp rồi tự điền.',
    'Chỗ nào có tên ミン (Minh), ハノイ (Hà Nội), FPT{大学|だいがく}… là thông tin mẫu — thay bằng thông tin THẬT của bạn.',
    'Dòng dịch "VI" in dưới câu dẫn cảnh và mục tiêu ở p.254, 255, 258, 259, 262, 263 thực ra là **tiếng Hàn** (lỗi in / chung khuôn nhiều thứ tiếng) — bỏ qua, dùng phần tả bằng tiếng Việt ở đây.',
    'Vài tranh gợi ý của 言ってみよう chỉ có hình, không có chữ; chỗ nào tranh khó đoán, câu mẫu ở đây ghi "(tranh: …)" và đưa cách nói hợp lý nhất — nếu cô dùng từ khác thì theo cô.',
  ],
};

export const SACH_15: Lesson = {
  id: 'b15-sach',
  kind: 'review',
  title: 'Theo sách — Bài 15 (trang 253–269)',
  goal: 'Nhìn tranh ti vi, tạp chí, ký túc xá, quán cà phê, con phố trong sách là nói được: kể tin nghe được (～そうです), nguyên nhân (N で), rủ bạn với điều kiện (～たら), "dù … vẫn" (～ても), đoán (きっと／たぶん～と思います), tả cảnh trước mắt (～ています) — và biết sách kết thúc ở đâu để ôn cả cuốn.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 253 · 話してみよう・聞いてみよう — Mở bài テレビ・雑誌から',
      '**話してみよう** — 4 tranh không lời xếp 2×2: (1) bản đồ **dự báo thời tiết** hôm nay (きょうの天気予報) với biểu tượng nắng / mây khắp nước Nhật; (2) một người đàn ông cầm cốc đứng xem **ti vi** đang chiếu một **lễ hội truyền thống** (khiêng kiệu, đám đông); (3) một **hàng người rất dài** trước cửa một cửa hàng; (4) một **tạp chí / tờ rơi du lịch** mở ra, có bản đồ, ảnh và các ô thông tin nhỏ. Mục đích: nói về thông tin xem được trên ti vi, tạp chí. **聞いてみよう** (CD C55): nghe trước đoạn hội thoại dài của bài — chính là trang 268.',
      [
        C('（tranh 1）{明日|あした}の{天気|てんき}はどうですか。', '(e 1) Ashita no tenki wa dou desu ka.', '(tranh 1) Thời tiết ngày mai thế nào?'),
        S('{東京|とうきょう}は{晴|は}れだそうです。{北海道|ほっかいどう}は{曇|くも}りだそうです。', 'Toukyou wa hare da sou desu. Hokkaidou wa kumori da sou desu.', 'Nghe nói Tokyo nắng. Nghe nói Hokkaido trời râm ạ.'),
        C('（tranh 2）この{人|ひと}は{何|なに}をしていますか。', '(e 2) Kono hito wa nani o shite imasu ka.', '(tranh 2) Người này đang làm gì?'),
        S('テレビでお{祭|まつ}りを{見|み}ています。', 'Terebi de omatsuri o mite imasu.', 'Đang xem lễ hội trên ti vi ạ.'),
        C('（tranh 3）{店|みせ}の{前|まえ}はどうですか。', '(e 3) Mise no mae wa dou desu ka.', '(tranh 3) Trước cửa hàng thế nào?'),
        S('{人|ひと}がたくさん{並|なら}んでいます。きっと{人気|にんき}がある{店|みせ}だと{思|おも}います。', 'Hito ga takusan narande imasu. Kitto ninki ga aru mise da to omoimasu.', 'Rất nhiều người đang xếp hàng. Em nghĩ chắc chắn là quán được ưa chuộng.'),
        C('ミンさんはよく{雑誌|ざっし}を{読|よ}みますか。', 'Min-san wa yoku zasshi o yomimasu ka.', 'Minh có hay đọc tạp chí không?'),
        S('いいえ、あまり{読|よ}みません。ニュースは{携帯|けいたい}で{見|み}ます。', 'Iie, amari yomimasen. Nyuusu wa keitai de mimasu.', 'Không ạ, em không đọc mấy. Tin tức thì em xem trên điện thoại.'),
      ],
      [
        'Tả tranh thời tiết / ti vi → kể lại bằng **～そうです** (ポイント 119). Danh từ: {晴|は}れ**だ**そうです.',
        'Tranh hàng người → **{並|なら}んでいます** (ポイント 122) + đoán **きっと～と{思|おも}います** (123).',
        'Xem **Hội thoại · Bức tranh chung của bài**.',
      ],
    ),

    ...trang(
      'Trang 254–255 · チャレンジ! これ、{知|し}ってる？',
      'Trang 254: **sảnh ký túc xá**. Tranh lớn: một cô gái ngồi sofa cầm cốc cà phê, mỉm cười nhìn lên; một chàng trai đứng cạnh cầm **tạp chí** mở trang "フリーマーケット", chỉ vào đó. Ô 1-1: chữ "みどり公園", "フリーマーケット", hình áo phông ¥150 và cuốn sách ¥50, chữ "一緒に" — **kể tin chợ đồ cũ và rủ đi**. Ô 1-2: "日曜日・フリーマーケット" → hình cặp đôi "恋人" — một cô gái gọi điện, tia sét (bạn bận hẹn người yêu); ô bên phải "マルコさんの恋人" — hai cô gái **kể chuyện nghe được** về người yêu của Marco. Trang 255: **mục tiêu できる** — kể cho bạn thông tin trên ti vi, tạp chí để rủ bạn, và nói cảm tưởng về thông tin đó. Tranh lớn: ba người ngồi phòng khách nói chuyện, một cô cầm tạp chí. Ô 2: cô gái xem bản tin "SMILE 木村ユウト" + chữ "けが" + hiện trường tai nạn; ô bên phải "バスの事故・木村ユウト・来週?" và cảnh buổi diễn của nhóm SMILE — **kể tin ca sĩ bị thương vì tai nạn xe buýt, buổi diễn tuần sau thì sao?** ☞ ポイント 119, 124.',
      [
        C('ミンさん、{知|し}っていますか。{週末|しゅうまつ}、みどり{公園|こうえん}でフリーマーケットがあるそうですよ。', 'Min-san, shitte imasu ka. Shuumatsu, Midori kouen de furii maaketto ga aru sou desu yo.', 'Minh biết chưa? Nghe nói cuối tuần ở công viên Midori có chợ đồ cũ đấy.'),
        S('へえ、{知|し}りませんでした。{何|なに}が{安|やす}いですか。', 'Hee, shirimasen deshita. Nani ga yasui desu ka.', 'Ồ, em không biết ạ. Cái gì rẻ ạ?'),
        C('Tシャツは{150円|ひゃくごじゅうえん}、{本|ほん}は{50円|ごじゅうえん}だそうです。{一緒|いっしょ}に{行|い}きませんか。', 'Tii shatsu wa hyakugojuu en, hon wa gojuu en da sou desu. Issho ni ikimasen ka.', 'Nghe nói áo phông 150 yên, sách 50 yên. Đi cùng cô không?'),
        S('いいですね。{行|い}きましょう。', 'Ii desu ne. Ikimashou.', 'Hay quá ạ. Mình đi ạ.'),
        C('ニュースを{見|み}ましたか。{歌手|かしゅ}がバスの{事故|じこ}でけがをしたそうです。', 'Nyuusu o mimashita ka. Kashu ga basu no jiko de kega o shita sou desu.', 'Em xem tin chưa? Nghe nói ca sĩ bị thương vì tai nạn xe buýt.'),
        S('えっ、{本当|ほんとう}ですか。{心配|しんぱい}ですね。{来週|らいしゅう}のコンサートは{中止|ちゅうし}ですか。', 'E, hontou desu ka. Shinpai desu ne. Raishuu no konsaato wa chuushi desu ka.', 'Hả, thật ạ? Lo quá. Buổi diễn tuần sau bị huỷ ạ?'),
      ],
      [
        '**ポイント 119 ～そうです**: V／イA thể thường + そうです; N／ナA **だ**そうです ({50円|ごじゅうえん}**だ**そうです).',
        '**ポイント 124 N で** = vì N: バスの{事故|じこ}**で**けがをしました.',
        'Nghe tin xong luôn có **một câu cảm tưởng**: {心配|しんぱい}ですね／{怖|こわ}いですね／よかったですね.',
        'Xem **Hội thoại · ① これ、知ってる？** và **Ngữ pháp · ポイント 119, 124**.',
      ],
    ),

    ...trang(
      'Trang 256 · 言ってみよう (chủ đề 1) — Số 1-1: kể tin + rủ đi · Số 1-2: "Bạn biết chưa? Nghe nói …"',
      '**1-1:** "nghe nói có … đấy" → "ồ" → "đi cùng không?" → "hay quá, đi thôi". Sáu ô quảng cáo: 例 chợ đồ cũ ở công viên Midori; ① toà nhà mua sắm "ニコニコショッピングビル" — biển SALE, "từ hôm nay"; ② sở thú Yamashita — "từ hôm nay 1 tuần miễn phí"; ③ quán ramen "めん太" — "ngon"; ④ "trước ga mở cửa hàng bách hoá E&W"; ⑤ "buổi giao lưu ở Sakura Center, Chủ nhật 10/8, từ 13 giờ, mời mọi người đến". **1-2:** "B, bạn biết chưa? Nghe nói …" → "Hả? Vậy à. (cảm tưởng)": 例 anh Nishikawa — tuần trước (tranh giường bệnh) → nhập viện; ① Carlos — tháng sau (tranh đám cưới); ② Marco — tranh cầu thủ ăn mừng (đội thắng); ③ bảo tàng Hoshino — tháng này miễn phí.',
      [
        C('ミンさん、{駅|えき}の{前|まえ}に{新|あたら}しいデパートができたそうですよ。', 'Min-san, eki no mae ni atarashii depaato ga dekita sou desu yo.', 'Minh, nghe nói trước ga mới mở một cửa hàng bách hoá đấy.'),
        S('へえ。{一緒|いっしょ}に{行|い}きませんか。', 'Hee. Issho ni ikimasen ka.', 'Ồ. Cô đi cùng em không ạ?'),
        C('いいですね。{行|い}きましょう。', 'Ii desu ne. Ikimashou.', 'Hay đấy. Đi thôi.'),
        S('{先生|せんせい}、{知|し}っていますか。カルロスさんが{来月|らいげつ}{結婚|けっこん}するそうですよ。', 'Sensei, shitte imasu ka. Karurosu-san ga raigetsu kekkon suru sou desu yo.', 'Cô ơi, cô biết chưa ạ? Nghe nói tháng sau Carlos kết hôn đấy ạ.'),
        C('えっ？ そうですか。よかったですね。', 'E? Sou desu ka. Yokatta desu ne.', 'Hả? Vậy à. Tốt quá nhỉ.'),
      ],
      [
        '1-1: tin ở **tương lai / hiện tại** → V thể từ điển + そうです (あるそうです); tin **đã xảy ra** (mở cửa hàng) → thể た (できたそうです); tính từ / danh từ: おいしいそうです, {無料|むりょう}**だ**そうです.',
        '1-2: tin về người: {入院|にゅういん}**した**そうです · {結婚|けっこん}**する**そうです · {勝|か}**った**そうです. Cảm tưởng: {心配|しんぱい}ですね／よかったですね／おめでとうございます.',
        'Xem **Ngữ pháp · ポイント 119 — bảng thay thế**.',
      ],
      [
        mau([
          E('{週末|しゅうまつ}、みどり{公園|こうえん}でフリーマーケットがあるそうですよ。— へえ。— {一緒|いっしょ}に{行|い}きませんか。— いいですね。{行|い}きましょう。', 'Shuumatsu, Midori kouen de furii maaketto ga aru sou desu yo. — Hee. — Issho ni ikimasen ka. — Ii desu ne. Ikimashou.', '1-1 例.'),
          E('{今日|きょう}から、ニコニコショッピングビルでセールがあるそうですよ。— へえ。— {一緒|いっしょ}に{行|い}きませんか。— いいですね。', 'Kyou kara, Nikoniko shoppingu biru de seeru ga aru sou desu yo. — Hee. — Issho ni ikimasen ka. — Ii desu ne.', '1-1 ① — SALE từ hôm nay.'),
          E('{山下|やました}{動物園|どうぶつえん}は{今日|きょう}から{1週間|いっしゅうかん}{無料|むりょう}だそうですよ。— へえ。— {一緒|いっしょ}に{行|い}きませんか。', 'Yamashita doubutsuen wa kyou kara isshuukan muryou da sou desu yo. — Hee. — Issho ni ikimasen ka.', '1-1 ② — N + だそうです.'),
          E('めん{太|た}のラーメンはおいしいそうですよ。— へえ。— {一緒|いっしょ}に{行|い}きませんか。', 'Menta no raamen wa oishii sou desu yo. — Hee. — Issho ni ikimasen ka.', '1-1 ③ — イA + そうです.'),
          E('{駅|えき}の{前|まえ}にデパートができたそうですよ。— へえ。— {一緒|いっしょ}に{行|い}きませんか。', 'Eki no mae ni depaato ga dekita sou desu yo. — Hee. — Issho ni ikimasen ka.', '1-1 ④ — mới mở: できた.'),
          E('{8月|はちがつ}{10日|とおか}に、さくらセンターで{交流会|こうりゅうかい}があるそうですよ。— へえ。— {一緒|いっしょ}に{行|い}きませんか。', 'Hachigatsu tooka ni, Sakura sentaa de kouryuukai ga aru sou desu yo. — Hee. — Issho ni ikimasen ka.', '1-1 ⑤ — buổi giao lưu.'),
          E('Bさん、{知|し}っていますか。{先週|せんしゅう}、{西川|にしかわ}さんが{入院|にゅういん}したそうですよ。— えっ？ そうですか。{心配|しんぱい}ですね。', 'B-san, shitte imasu ka. Senshuu, Nishikawa-san ga nyuuin shita sou desu yo. — E? Sou desu ka. Shinpai desu ne.', '1-2 例.'),
          E('Bさん、{知|し}っていますか。{来月|らいげつ}、カルロスさんが{結婚|けっこん}するそうですよ。— えっ？ そうですか。よかったですね。', 'B-san, shitte imasu ka. Raigetsu, Karurosu-san ga kekkon suru sou desu yo. — E? Sou desu ka. Yokatta desu ne.', '1-2 ①.'),
          E('Bさん、{知|し}っていますか。マルコさんのチームが{試合|しあい}に{勝|か}ったそうですよ。— えっ？ そうですか。よかったですね。', 'B-san, shitte imasu ka. Maruko-san no chiimu ga shiai ni katta sou desu yo. — E? Sou desu ka. Yokatta desu ne.', '1-2 ② — (tranh: cầu thủ ăn mừng).'),
          E('Bさん、{知|し}っていますか。{今月|こんげつ}、ほしの{美術館|びじゅつかん}は{無料|むりょう}だそうですよ。— えっ？ そうですか。{行|い}きたいですね。', 'B-san, shitte imasu ka. Kongetsu, Hoshino bijutsukan wa muryou da sou desu yo. — E? Sou desu ka. Ikitai desu ne.', '1-2 ③.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 257 · 言ってみよう số 2 + やってみよう (chủ đề 1) — Tin thời sự',
      '**Số 2:** "B, bạn xem thời sự chưa?" → "chưa" → "nghe nói (vì …) mà …" → "thật à? (cảm tưởng)". Bốn màn hình ti vi: 例 động đất — toà nhà đổ; ① tai nạn — 4 người bị thương; ② "voi Haru, tạm biệt" (voi ở sở thú đã chết); ③ bão — tàu điện ngừng chạy. **Nghe (CD C59):** bảng 5 hàng — 例 + 1–4: (1) đi tuần này hay tuần sau? (2) thứ Tư hay thứ Sáu? (3) tặng tranh hay đĩa? (4) tâm trạng của Mary tốt hay không tốt? — chọn ⓐ/ⓑ rồi **viết lý do**. **■** Kể cho bạn cùng lớp điều bạn biết được qua ti vi, tạp chí hoặc nghe bạn bè kể.',
      [
        C('ミンさん、ニュースを{見|み}ましたか。', 'Min-san, nyuusu o mimashita ka.', 'Minh, em xem thời sự chưa?'),
        S('いいえ。', 'Iie.', 'Chưa ạ.'),
        C('{台風|たいふう}で{電車|でんしゃ}が{止|と}まったそうです。', 'Taifuu de densha ga tomatta sou desu.', 'Nghe nói vì bão mà tàu dừng chạy.'),
        S('{本当|ほんとう}ですか。{大変|たいへん}ですね。', 'Hontou desu ka. Taihen desu ne.', 'Thật ạ? Vất vả quá nhỉ.'),
        C('{最近|さいきん}、どんなニュースを{知|し}りましたか。', 'Saikin, donna nyuusu o shirimashita ka.', 'Gần đây em biết tin gì?'),
        S('{友達|ともだち}に{聞|き}きましたが、{学校|がっこう}の{近|ちか}くに{新|あたら}しいカフェができたそうです。', 'Tomodachi ni kikimashita ga, gakkou no chikaku ni atarashii kafe ga dekita sou desu.', 'Em nghe bạn kể là gần trường mới mở một quán cà phê ạ.'),
      ],
      [
        'Số 2: nguyên nhân + kết quả + そうです: **{地震|じしん}で**ビルが{倒|たお}れた**そうです** (ポイント 124 + 119).',
        'Tin động vật chết: **{死|し}んだ**そうです (động vật); với người dùng **{亡|な}くなった**.',
        'Nghe C59: bắt **quyết định cuối cùng** + câu **～から／～んです** (lý do). Không có đáp án CD ở đây — luyện: **Luyện nghe · Bài 1**.',
        '■ Kể tin: mở đầu **～で{見|み}ましたが／～に{聞|き}きましたが、～そうです**.',
      ],
      [
        mau([
          E('Bさん、ニュースを{見|み}ましたか。— いいえ。— {地震|じしん}でビルが{倒|たお}れたそうです。— {本当|ほんとう}ですか。{怖|こわ}いですね。', 'B-san, nyuusu o mimashita ka. — Iie. — Jishin de biru ga taoreta sou desu. — Hontou desu ka. Kowai desu ne.', 'Số 2 例.'),
          E('{事故|じこ}で{4人|よにん}けがをしたそうです。— {本当|ほんとう}ですか。{怖|こわ}いですね。', 'Jiko de yonin kega o shita sou desu. — Hontou desu ka. Kowai desu ne.', 'Số 2 ①.'),
          E('{動物園|どうぶつえん}のゾウのハルが{死|し}んだそうです。— {本当|ほんとう}ですか。{寂|さび}しいですね。', 'Doubutsuen no zou no Haru ga shinda sou desu. — Hontou desu ka. Sabishii desu ne.', 'Số 2 ② — (tranh: "tạm biệt voi Haru").'),
          E('{台風|たいふう}で{電車|でんしゃ}が{止|と}まったそうです。— {本当|ほんとう}ですか。{大変|たいへん}ですね。', 'Taifuu de densha ga tomatta sou desu. — Hontou desu ka. Taihen desu ne.', 'Số 2 ③.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 258–259 · チャレンジ! {雑誌|ざっし}を{見|み}て{町|まち}へ',
      'Trang 258: sảnh ký túc xá, **vừa xem tạp chí vừa nói chuyện**: một bạn bưng khay đồ uống, một cô đọc sách trên sofa, hai bạn nam đứng đưa tạp chí cho nhau. Ô 1: cô gái cầm tạp chí nói "新しい動物園" + ①②③ (3 người) + hộp quà → **sở thú mới, đi 3 người thì được quà**; ô bên phải "時間" + "アンナ" → **nếu Anna có thời gian thì rủ đi**. Trang 259: **mục tiêu できる** — dựa vào thông tin trong tạp chí, vừa cân nhắc các điều kiện vừa cùng bạn hành động. Tranh lớn: hai cô gái ở quán cà phê, một người chỉ vào tạp chí. Ô 2: "週末・みどり公園 フリーマーケット" + "安い・いい" → "いつ？" — "土曜日？" (bàn ngày đi). Ô 3: lớp học có cô giáo + "どこで？" → "さくらセンター 料理教室 ¥0?" (hỏi địa điểm, có miễn phí không). ☞ ポイント 120, 121, 123.',
      [
        C('ミンさん、{新|あたら}しい{動物園|どうぶつえん}ができたそうですよ。{3人|さんにん}で{行|い}ったら、プレゼントがあるそうです。', 'Min-san, atarashii doubutsuen ga dekita sou desu yo. Sannin de ittara, purezento ga aru sou desu.', 'Minh, nghe nói mới mở một sở thú. Nghe nói nếu đi 3 người thì có quà.'),
        S('いいですね。アンナさんに{時間|じかん}があったら、{3人|さんにん}で{行|い}きませんか。', 'Ii desu ne. Anna-san ni jikan ga attara, sannin de ikimasen ka.', 'Hay quá ạ. Nếu Anna có thời gian thì ba người mình đi không ạ?'),
        C('フリーマーケットはいつ{行|い}きますか。', 'Furii maaketto wa itsu ikimasu ka.', 'Chợ đồ cũ thì khi nào đi?'),
        S('{土曜日|どようび}はどうですか。きっと{安|やす}くていいものがあると{思|おも}います。', 'Doyoubi wa dou desu ka. Kitto yasukute ii mono ga aru to omoimasu.', 'Thứ Bảy thì sao ạ? Em nghĩ chắc chắn có đồ rẻ mà tốt.'),
        C('{料理教室|りょうりきょうしつ}は{無料|むりょう}じゃありませんよ。', 'Ryouri kyoushitsu wa muryou ja arimasen yo.', 'Lớp nấu ăn không miễn phí đâu.'),
        S('{無料|むりょう}じゃなくても、{行|い}きたいです。', 'Muryou ja nakute mo, ikitai desu.', 'Dù không miễn phí em vẫn muốn đi ạ.'),
      ],
      [
        '**ポイント 120 ～たら**: {3人|さんにん}で{行|い}っ**たら**, {時間|じかん}があっ**たら**. **ポイント 121 ～ても**: {無料|むりょう}じゃなく**ても**. **ポイント 123**: きっと～と{思|おも}います.',
        'Rủ lịch sự: **もしよかったら、～ませんか**.',
        'Xem **Hội thoại · ② 雑誌を見て町へ** và **Ngữ pháp · ポイント 120, 121, 123**.',
      ],
    ),

    ...trang(
      'Trang 260 · 言ってみよう số 1, 2 (chủ đề 2) — "Nếu … thì có …" · "Chắc chắn …, đi cùng không?"',
      '**Số 1:** "nghe nói ở … mới mở …" → "thật à?" → "nghe nói nếu … thì …" → "vậy à" → "nếu có thời gian thì đi cùng không?" → "đi thôi": 例 siêu thị mới ở thị trấn bên cạnh・mua từ 1.000 yên → có quà; ① cửa hàng điện máy ("オープン！")・nếu đắt hơn cửa hàng khác → sẽ rẻ đi (bán bằng giá); ② quán nhậu (biển 5%OFF)・nếu trời mưa → giảm 5%; ③ công viên giải trí (vòng đu quay, tàu lượn)・đi 3 người với bạn → được nhận móc đeo. **Số 2:** "nghe nói … có …" → "…?" → "chắc chắn …. Nếu được thì đi cùng không?" → "đi thôi": 例 cuối tuần, chợ đồ cũ / có đồ rẻ mà tốt; ① ngày kia, lễ hội / náo nhiệt, vui; ② thứ Bảy, trận bóng đá / hay; ③ lễ hội pháo hoa ở Yokohama / đẹp.',
      [
        C('ミンさん、{隣|となり}の{町|まち}に{新|あたら}しいスーパーができたそうですよ。', 'Min-san, tonari no machi ni atarashii suupaa ga dekita sou desu yo.', 'Minh, nghe nói ở thị trấn bên cạnh mới mở siêu thị.'),
        S('えっ？ {本当|ほんとう}ですか。', 'E? Hontou desu ka.', 'Hả? Thật ạ?'),
        C('ええ。{1,000円|せんえん}{以上|いじょう}{買|か}ったら、プレゼントがあるそうですよ。', 'Ee. Sen en ijou kattara, purezento ga aru sou desu yo.', 'Ừ. Nghe nói nếu mua từ 1.000 yên trở lên thì có quà.'),
        S('そうですか。{時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。', 'Sou desu ka. Jikan ga attara, issho ni ikimasen ka.', 'Vậy ạ. Nếu cô có thời gian thì đi cùng em không ạ?'),
        C('{横浜|よこはま}で{花火大会|はなびたいかい}があるそうですよ。', 'Yokohama de hanabi taikai ga aru sou desu yo.', 'Nghe nói ở Yokohama có lễ hội pháo hoa đấy.'),
        S('きっときれいだと{思|おも}います。もしよかったら、{一緒|いっしょ}に{行|い}きませんか。', 'Kitto kirei da to omoimasu. Moshi yokattara, issho ni ikimasen ka.', 'Em nghĩ chắc chắn đẹp. Nếu cô thấy được thì đi cùng em không ạ?'),
      ],
      [
        'Số 1: đổi gợi ý (thể ます / です) sang **たら**: {買|か}います → {買|か}っ**たら**; {高|たか}いです → {高|たか}かっ**たら**; {雨|あめ}です → {雨|あめ}だっ**たら**; {行|い}きます → {行|い}っ**たら**. Rồi + そうです.',
        'Số 2: **ナA + だ**と{思|おも}います (きれい**だ**と); イA: おもしろい**と**; nối hai tính từ: にぎやか**で**{楽|たの}しい (ポイント 75).',
        'Xem **Ngữ pháp · ポイント 120 — bảng thay thế** và **ポイント 123 — bảng thay thế**.',
      ],
      [
        mau([
          E('{隣|となり}の{町|まち}に{新|あたら}しいスーパーができたそうですよ。— えっ？ {本当|ほんとう}ですか。— ええ。{1,000円|せんえん}{以上|いじょう}{買|か}ったら、プレゼントがあるそうですよ。— そうですか。— {時間|じかん}があったら、{一緒|いっしょ}に{行|い}きませんか。— いいですね。{行|い}きましょう。', 'Tonari no machi ni atarashii suupaa ga dekita sou desu yo. — E? Hontou desu ka. — Ee. Sen en ijou kattara, purezento ga aru sou desu yo. — Sou desu ka. — Jikan ga attara, issho ni ikimasen ka. — Ii desu ne. Ikimashou.', 'Số 1 例.'),
          E('{新|あたら}しい{電器屋|でんきや}ができたそうですよ。……{他|ほか}の{店|みせ}より{高|たか}かったら、{安|やす}くなるそうですよ。', 'Atarashii denkiya ga dekita sou desu yo. …… Hoka no mise yori takakattara, yasuku naru sou desu yo.', 'Số 1 ① — nếu đắt hơn cửa hàng khác thì giảm cho bằng.'),
          E('{新|あたら}しい{居酒屋|いざかや}ができたそうですよ。……{雨|あめ}だったら、{5|ご}パーセント{引|び}きだそうですよ。', 'Atarashii izakaya ga dekita sou desu yo. …… Ame dattara, go paasento biki da sou desu yo.', 'Số 1 ② — N だったら + N だそうです.'),
          E('{新|あたら}しい{遊園地|ゆうえんち}ができたそうですよ。……{友達|ともだち}と{3人|さんにん}で{行|い}ったら、ストラップをもらうことができるそうですよ。', 'Atarashii yuuenchi ga dekita sou desu yo. …… Tomodachi to sannin de ittara, sutorappu o morau koto ga dekiru sou desu yo.', 'Số 1 ③.'),
          E('{週末|しゅうまつ}、フリーマーケットがあるそうですよ。— えっ？ フリーマーケット？ — はい。きっと{安|やす}くていいものがあると{思|おも}います。もしよかったら、{一緒|いっしょ}に{行|い}きませんか。— いいですね。{行|い}きましょう。', 'Shuumatsu, furii maaketto ga aru sou desu yo. — E? Furii maaketto? — Hai. Kitto yasukute ii mono ga aru to omoimasu. Moshi yokattara, issho ni ikimasen ka. — Ii desu ne. Ikimashou.', 'Số 2 例.'),
          E('あさって、お{祭|まつ}りがあるそうですよ。……きっとにぎやかで{楽|たの}しいと{思|おも}います。もしよかったら、{一緒|いっしょ}に{行|い}きませんか。', 'Asatte, omatsuri ga aru sou desu yo. …… Kitto nigiyaka de tanoshii to omoimasu. Moshi yokattara, issho ni ikimasen ka.', 'Số 2 ①.'),
          E('{土曜日|どようび}、サッカーの{試合|しあい}があるそうですよ。……きっとおもしろいと{思|おも}います。もしよかったら、{一緒|いっしょ}に{行|い}きませんか。', 'Doyoubi, sakkaa no shiai ga aru sou desu yo. …… Kitto omoshiroi to omoimasu. Moshi yokattara, issho ni ikimasen ka.', 'Số 2 ②.'),
          E('{横浜|よこはま}で{花火大会|はなびたいかい}があるそうですよ。……きっときれいだと{思|おも}います。もしよかったら、{一緒|いっしょ}に{行|い}きませんか。', 'Yokohama de hanabi taikai ga aru sou desu yo. …… Kitto kirei da to omoimasu. Moshi yokattara, issho ni ikimasen ka.', 'Số 2 ③ — ナA + だと思います.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 261 · 言ってみよう số 3 + やってみよう + ロールプレイ (chủ đề 2) — "Dù … vẫn muốn đi"',
      '**Số 3:** "nghe nói ở … có …" → "hay nhỉ, rất muốn đi" → "nhưng vì … nên chắc …, có ổn không?" → "ừm, dù … vẫn muốn đi" → "vậy đi thôi": 例 cửa hàng サンサン giảm giá / cuối tuần nên đông; ① lớp nấu ăn ở Sakura Center / không miễn phí; ② quán sushi trước ga ngon / quán được ưa chuộng nên phải chờ lâu; ③ từ ngày kia giải sumo bắt đầu / đặt vé đã mở từ 1 tháng trước nên không còn chỗ tốt. **Nghe (CD C63):** (1) Chủ nhật hai người đi đâu? mưa có đi không? (2) Nattapong ngày mai làm gì? (3) hai người bây giờ làm gì? vì sao không cần vội? **Đóng vai:** A xem tạp chí thông tin của thành phố (4 ô: quán mì "めん太郎" mới mở, ngon · trận bóng chày ở Tokyo Dome, người lớn 1.000 yên, từ 3 người trở lên mỗi người 800 yên · lễ hội từ 25/3 đến 8/4 (cây hoa) · công viên giải trí) — giới thiệu và rủ B; B hỏi A thật nhiều.',
      [
        C('サンサンでセールがあるそうですよ。', 'Sansan de seeru ga aru sou desu yo.', 'Nghe nói ở サンサン có giảm giá đấy.'),
        S('へえ、いいですね。ぜひ{行|い}きたいです。', 'Hee, ii desu ne. Zehi ikitai desu.', 'Ồ, hay quá ạ. Em rất muốn đi.'),
        C('でも、{週末|しゅうまつ}ですから、{人|ひと}が{多|おお}いと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。', 'Demo, shuumatsu desu kara, hito ga ooi to omoimasu ga, daijoubu desu ka.', 'Nhưng vì là cuối tuần nên chắc đông, em có ổn không?'),
        S('うーん。{人|ひと}が{多|おお}くても、{行|い}きたいです。', 'Uun. Hito ga ookute mo, ikitai desu.', 'Ừm. Dù đông em vẫn muốn đi ạ.'),
        C('（ロールプレイ）{野球|やきゅう}のチケットはいくらですか。', '(Rooru purei) Yakyuu no chiketto wa ikura desu ka.', '(Đóng vai) Vé bóng chày bao nhiêu?'),
        S('{大人|おとな}は{千円|せんえん}ですが、{3人|さんにん}{以上|いじょう}で{行|い}ったら、{1人|ひとり}{800円|はっぴゃくえん}です。', 'Otona wa sen en desu ga, sannin ijou de ittara, hitori happyaku en desu.', 'Người lớn 1.000 yên, nhưng nếu đi từ 3 người trở lên thì mỗi người 800 yên ạ.'),
      ],
      [
        'Số 3: đổi điều kiện sang **ても**: {多|おお}い → {多|おお}くても; {無料|むりょう}じゃありません → {無料|むりょう}じゃなくても; {長|なが}い{時間|じかん}{待|ま}ちます → {待|ま}っても; いい{席|せき}がありません → **ない** → なくても.',
        'Nghe C63: câu hỏi "雨でも行きますか" → nghe vế sau ～ても／～たら. Không có đáp án CD ở đây — luyện: **Luyện nghe · Bài 2**.',
        'Đóng vai: xem kịch bản đầy đủ ở **Luyện nói · Đóng vai**.',
      ],
      [
        mau([
          E('サンサンでセールがあるそうですよ。— へえ。いいですね。ぜひ{行|い}きたいです。— ああ、でも、{週末|しゅうまつ}ですから、{人|ひと}が{多|おお}いと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。— うーん。{人|ひと}が{多|おお}くても、{行|い}きたいです。— じゃ、{行|い}きましょう。', 'Sansan de seeru ga aru sou desu yo. — Hee. Ii desu ne. Zehi ikitai desu. — Aa, demo, shuumatsu desu kara, hito ga ooi to omoimasu ga, daijoubu desu ka. — Uun. Hito ga ookute mo, ikitai desu. — Ja, ikimashou.', 'Số 3 例.'),
          E('さくらセンターで{料理教室|りょうりきょうしつ}があるそうですよ。……でも、{無料|むりょう}じゃありませんが、{大丈夫|だいじょうぶ}ですか。— うーん。{無料|むりょう}じゃなくても、{行|い}きたいです。', 'Sakura sentaa de ryouri kyoushitsu ga aru sou desu yo. …… Demo, muryou ja arimasen ga, daijoubu desu ka. — Uun. Muryou ja nakute mo, ikitai desu.', 'Số 3 ①.'),
          E('{駅|えき}の{前|まえ}のすし{屋|や}はおいしいそうですよ。……でも、{人気|にんき}がある{店|みせ}ですから、{長|なが}い{時間|じかん}{待|ま}つと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。— うーん。{長|なが}い{時間|じかん}{待|ま}っても、{食|た}べたいです。', 'Eki no mae no sushiya wa oishii sou desu yo. …… Demo, ninki ga aru mise desu kara, nagai jikan matsu to omoimasu ga, daijoubu desu ka. — Uun. Nagai jikan matte mo, tabetai desu.', 'Số 3 ②.'),
          E('あさってから{相撲|すもう}が{始|はじ}まるそうですよ。……でも、チケットの{予約|よやく}は{1か月|いっかげつ}{前|まえ}に{始|はじ}まりましたから、もういい{席|せき}がないと{思|おも}いますが、{大丈夫|だいじょうぶ}ですか。— うーん。いい{席|せき}がなくても、{見|み}たいです。', 'Asatte kara sumou ga hajimaru sou desu yo. …… Demo, chiketto no yoyaku wa ikkagetsu mae ni hajimarimashita kara, mou ii seki ga nai to omoimasu ga, daijoubu desu ka. — Uun. Ii seki ga nakute mo, mitai desu.', 'Số 3 ③.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 262–263 · チャレンジ! {町|まち}を{歩|ある}いて',
      'Trang 262: **quán cà phê** (biển "KUPPA C"): nhân viên bưng khay hai cốc nước đến bàn hai khách nữ, một người đang xem thực đơn "Drinks / Foods". Ô 1-1: một cô gái giơ cốc nước lạnh lên sát mặt chàng trai đeo ba lô, anh giật mình — **có chuyện với cái cốc, gọi nhân viên**. Trang 263: **mục tiêu できる** — ra ngoài phố, nói đơn giản về tình hình xung quanh mình. Tranh lớn: ngoài phố, hai người phụ nữ đứng ở cửa, **chỉ tay về phía một toà tháp cao** (giống tháp Tokyo) giữa các toà nhà. Ô 1-2: buổi tối, một cô gái và một người phụ nữ đang **chụp ảnh tháp Tokyo sáng đèn**, phía sau hai đứa trẻ chơi. ☞ ポイント 122.',
      [
        C('（{店員|てんいん}）お{水|みず}をどうぞ。', '(Ten\'in) Omizu o douzo.', '(Nhân viên) Mời dùng nước.'),
        S('あのう、すみません。このコップが{汚|よご}れています。', 'Anou, sumimasen. Kono koppu ga yogorete imasu.', 'Dạ, xin lỗi. Cái cốc này bị bẩn ạ.'),
        C('あっ、すみません。', 'A, sumimasen.', 'Ôi, xin lỗi.'),
        C('（{外|そと}で）あっ、{見|み}てください。', '(Soto de) A, mite kudasai.', '(Ngoài phố) A, nhìn kìa.'),
        S('{東京|とうきょう}タワーの{電気|でんき}がついていますね。{写真|しゃしん}を{撮|と}りませんか。', 'Toukyou tawaa no denki ga tsuite imasu ne. Shashin o torimasen ka.', 'Tháp Tokyo sáng đèn rồi nhỉ. Mình chụp ảnh không ạ?'),
      ],
      [
        '**ポイント 122**: thấy trạng thái trước mắt → **tự động từ + ています**: {汚|よご}れています, {割|わ}れています, ついています.',
        'Gọi nhân viên: **あのう、すみません。** + tình trạng. Nhân viên đáp: あっ、すみません.',
        'Xem **Hội thoại · ③ 町を歩いて** và **Ngữ pháp · ポイント 122**.',
      ],
    ),

    ...trang(
      'Trang 264 · 言ってみよう số 1-1, 1-2 (chủ đề 3) — Báo nhân viên · Tả cảnh rồi đề nghị',
      '**1-1:** nhìn tranh một nhà hàng và **tự tìm vấn đề** ở 例, ①–④ rồi báo nhân viên ("あのう、…ています" → "あっ、すみません"): 例 (câu mẫu) cốc bị bẩn; ① một người đàn ông giơ điện thoại lên cạnh người phụ nữ; ② nhân viên cầm chiếc cốc bị mẻ, cúi đầu xin lỗi; ③ dưới sàn có vật bị rơi (dao / dĩa); ④ phía cửa nhà vệ sinh, một người phụ nữ chỉ tay, ngạc nhiên. **1-2:** "ơ, … đang …" → "thật này" → "(làm cách khác) không?" → "ừ nhỉ": 例 bảng thông báo ở ga "vì sự cố tàu điện…" → đi xe buýt; ① cửa hàng đóng cửa cuốn "close" → đi cửa hàng khác; ② một người chỉ về phía tháp Tokyo, bong bóng máy ảnh → chụp ảnh; ③ hàng người dài ở bến xe buýt → đi taxi; ④ đám đông tụ tập → sang chỗ khác; ⑤ nhà hàng kín khách → ăn ở quán khác.',
      [
        S('あのう、コップが{割|わ}れています。', 'Anou, koppu ga warete imasu.', 'Dạ, cốc bị mẻ ạ.'),
        C('あっ、すみません。', 'A, sumimasen.', 'Ôi, xin lỗi.'),
        C('あっ、{店|みせ}が{閉|し}まっています。', 'A, mise ga shimatte imasu.', 'Ơ, cửa hàng đóng cửa rồi.'),
        S('{本当|ほんとう}だ。ほかの{店|みせ}へ{行|い}きませんか。', 'Hontou da. Hoka no mise e ikimasen ka.', 'Thật này. Mình sang cửa hàng khác không ạ?'),
        C('そうですね。', 'Sou desu ne.', 'Ừ nhỉ.'),
      ],
      [
        '1-1: chủ ngữ + **が** + tự động từ ています. Dao / dĩa rơi: フォークが**{落|お}ちています**; cốc mẻ: コップが**{割|わ}れています**.',
        '1-2: **{本当|ほんとう}だ** là thể thường của {本当|ほんとう}です (nói với bạn). Đề nghị: **～で{行|い}きませんか／～へ{行|い}きませんか**.',
        'Xem **Ngữ pháp · ポイント 122 — bảng thay thế**.',
      ],
      [
        mau([
          E('あのう、コップが{汚|よご}れています。— あっ、すみません。', 'Anou, koppu ga yogorete imasu. — A, sumimasen.', '1-1 例.'),
          E('あのう、{電気|でんき}が{消|き}えています。— あっ、すみません。', 'Anou, denki ga kiete imasu. — A, sumimasen.', '1-1 ① — (tranh khó đoán: người giơ điện thoại — có thể chỗ ngồi tối / đồ điện không chạy; cũng có thể nói ～が{壊|こわ}れています).'),
          E('あのう、コップが{割|わ}れています。— あっ、すみません。', 'Anou, koppu ga warete imasu. — A, sumimasen.', '1-1 ② — cốc mẻ.'),
          E('あのう、フォークが{落|お}ちています。— あっ、すみません。', 'Anou, fooku ga ochite imasu. — A, sumimasen.', '1-1 ③ — đồ rơi dưới sàn (dao: ナイフ).'),
          E('あのう、トイレが{壊|こわ}れています。— あっ、すみません。', 'Anou, toire ga kowarete imasu. — A, sumimasen.', '1-1 ④ — (tranh: phía nhà vệ sinh, người phụ nữ ngạc nhiên).'),
          E('あっ、{電車|でんしゃ}が{止|と}まっています。— {本当|ほんとう}だ。— バスで{行|い}きませんか。— そうですね。', 'A, densha ga tomatte imasu. — Hontou da. — Basu de ikimasen ka. — Sou desu ne.', '1-2 例.'),
          E('あっ、{店|みせ}が{閉|し}まっています。— {本当|ほんとう}だ。— ほかの{店|みせ}へ{行|い}きませんか。— そうですね。', 'A, mise ga shimatte imasu. — Hontou da. — Hoka no mise e ikimasen ka. — Sou desu ne.', '1-2 ①.'),
          E('あっ、{東京|とうきょう}タワーの{電気|でんき}がついています。— {本当|ほんとう}だ。— {写真|しゃしん}を{撮|と}りませんか。— そうですね。', 'A, Toukyou tawaa no denki ga tsuite imasu. — Hontou da. — Shashin o torimasen ka. — Sou desu ne.', '1-2 ② — (cũng có thể nói 東京タワーが見えます, ポイント 94).'),
          E('あっ、{人|ひと}がたくさん{並|なら}んでいます。— {本当|ほんとう}だ。— タクシーで{行|い}きませんか。— そうですね。', 'A, hito ga takusan narande imasu. — Hontou da. — Takushii de ikimasen ka. — Sou desu ne.', '1-2 ③.'),
          E('あっ、{人|ひと}がたくさん{集|あつ}まっています。— {本当|ほんとう}だ。— あっちへ{行|い}きませんか。— そうですね。', 'A, hito ga takusan atsumatte imasu. — Hontou da. — Atchi e ikimasen ka. — Sou desu ne.', '1-2 ④.'),
          E('あっ、レストランが{混|こ}んでいます。— {本当|ほんとう}だ。— ほかの{店|みせ}で{食|た}べませんか。— そうですね。', 'A, resutoran ga konde imasu. — Hontou da. — Hoka no mise de tabemasen ka. — Sou desu ne.', '1-2 ⑤.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 265 · やってみよう + ペアで話しましょう (chủ đề 3) — Ai đang nói?',
      '**Nghe (CD C66):** tranh một con phố lớn có các cặp người ⓐ–ⓕ: trên cùng một **xe tải bị lật**, hàng đổ ra đường, ô tô và xe buýt kẹt phía sau (ⓐ ngồi trên xe buýt); tiệm bánh "Sakura Bakery" có **hàng người dài** (ⓑ đi ngang, một người xem điện thoại); ⓒ đứng cạnh **ví và đồng xu rơi**; quán "Cafe Green" **đóng cửa cuốn** (ⓓ đứng trước quán); ⓔ hai người gặp nhau cạnh một **đám đông** đang reo lên; ⓕ người đàn ông ngồi uống nước với **cái cốc mẻ**, bên cạnh gian **chợ đồ cũ**. Nghe 2 đoạn và chọn cặp. **■ Nói theo cặp:** nhập vai một cặp trong tranh và nói chuyện.',
      [
        C('（ⓒ）あっ、{財布|さいふ}が{落|お}ちていますよ。', '(C) A, saifu ga ochite imasu yo.', '(ⓒ) Ơ, có cái ví rơi kìa.'),
        S('{本当|ほんとう}だ。お{金|かね}も{落|お}ちています。{交番|こうばん}へ{持|も}って{行|い}きましょう。', 'Hontou da. Okane mo ochite imasu. Kouban e motte ikimashou.', 'Thật này. Tiền cũng rơi nữa. Mình mang đến đồn cảnh sát đi ạ.'),
        C('（ⓑ）パン{屋|や}に{人|ひと}がたくさん{並|なら}んでいますね。', '(B) Pan\'ya ni hito ga takusan narande imasu ne.', '(ⓑ) Tiệm bánh nhiều người xếp hàng nhỉ.'),
        S('きっとおいしいと{思|おも}います。{並|なら}んでも、{買|か}いたいです。', 'Kitto oishii to omoimasu. Narande mo, kaitai desu.', 'Em nghĩ chắc chắn ngon. Dù phải xếp hàng em vẫn muốn mua ạ.'),
      ],
      [
        'Nghe C66: bắt động từ **～ています** để biết người nói đang thấy gì. Không có đáp án CD ở đây — luyện: **Luyện nghe · Bài 3**.',
        'Nói theo cặp: tả cảnh (～ています) + đoán (～と{思|おも}います) + đề nghị (～ませんか) — ghép cả bài 15 trong 3 câu.',
      ],
    ),

    ...trang(
      'Trang 266 · できる! — Làm tờ báo / tạp chí của riêng bạn',
      'Nhiệm vụ ba bước: (1) **nói xem muốn viết bài gì** — 4 câu gợi ý: thành phố bạn sống có sự kiện gì? quán bạn giới thiệu là đâu? gần đây xem được tin gì? **3 tin lớn** của bạn là gì?; (2) **viết bài**; (3) **đọc tờ báo / tạp chí** đã làm xong và nói chuyện về nó.',
      [
        C('ミンさんが{住|す}んでいる{町|まち}にはどんなイベントがありますか。', 'Min-san ga sunde iru machi ni wa donna ibento ga arimasu ka.', 'Thành phố Minh sống có sự kiện gì?'),
        S('{秋|あき}にハノイで{大|おお}きいお{祭|まつ}りがあります。{雨|あめ}が{降|ふ}っても、{人|ひと}がたくさん{集|あつ}まります。', 'Aki ni Hanoi de ookii omatsuri ga arimasu. Ame ga futte mo, hito ga takusan atsumarimasu.', 'Mùa thu ở Hà Nội có lễ hội lớn ạ. Dù mưa người vẫn tụ tập rất đông.'),
        C('ミンさんのおすすめの{店|みせ}はどこですか。', 'Min-san no osusume no mise wa doko desu ka.', 'Quán Minh giới thiệu là đâu?'),
        S('{学校|がっこう}の{近|ちか}くのカフェです。{学生|がくせい}だったら、{10|じゅっ}パーセント{引|び}きです。', 'Gakkou no chikaku no kafe desu. Gakusei dattara, juppaasento biki desu.', 'Quán cà phê gần trường ạ. Nếu là sinh viên thì giảm 10%.'),
        C('{最近|さいきん}どんなニュースを{見|み}ましたか。', 'Saikin donna nyuusu o mimashita ka.', 'Gần đây em xem tin gì?'),
        S('{台風|たいふう}で{木|き}がたくさん{倒|たお}れたそうです。', 'Taifuu de ki ga takusan taoreta sou desu.', 'Nghe nói vì bão mà nhiều cây bị đổ ạ.'),
        C('ミンさんの{3大|さんだい}ニュースは{何|なん}ですか。', 'Min-san no sandai nyuusu wa nan desu ka.', '3 tin lớn của Minh là gì?'),
        S('{日本語|にほんご}の{勉強|べんきょう}を{始|はじ}めました。それから、{姉|あね}が{結婚|けっこん}しました。それから、{大学|だいがく}のチームが{試合|しあい}に{勝|か}ちました。', 'Nihongo no benkyou o hajimemashita. Sorekara, ane ga kekkon shimashita. Sorekara, daigaku no chiimu ga shiai ni kachimashita.', 'Em bắt đầu học tiếng Nhật. Rồi chị gái em kết hôn. Rồi đội của trường thắng trận ạ.'),
      ],
      [
        'Mỗi bài báo nên có ít nhất một mẫu của Bài 15: ～そうです (tin nghe được), ～たら／～ても (điều kiện), きっと～と{思|おも}います (đoán).',
        'Xem **Hội thoại · できる！** (tờ báo mẫu 3 bài).',
      ],
    ),

    ...trang(
      'Trang 266 · 話読聞書「{私|わたし}のニュース」 — Tin của tôi',
      'Ô 話読聞書 là một đoạn văn khoảng 9 câu: người viết kể **ngày 10/6 dự cuộc thi hùng biện** của thành phố — hồi hộp đến đau bụng nhưng **nói được đến cuối**, và thật không ngờ **được hạng 3**; hôm đó hội trường **đông người**, có cả nhiều du học sinh nước ngoài; người viết nói về **cuộc sống du học ở Nhật**; khán giả thỉnh thoảng **cười** và **gật gù** "ừ, ừ"; rất hồi hộp nhưng đã thành **một kỷ niệm đẹp**. Từ ở chân bài: スピーチコンテスト, ～位, 最後, ホール, 思い出, うなずきます, 緊張します, 笑います, なんと. Hai câu hỏi bên lề (cô sẽ hỏi đúng hai câu này): **あなたのビッグニュースは何ですか · どうでしたか**.',
      [
        C('ミンさんのビッグニュースは{何|なん}ですか。', 'Min-san no biggu nyuusu wa nan desu ka.', 'Tin lớn của Minh là gì?'),
        S('{先月|せんげつ}、{大学|だいがく}の{日本語|にほんご}スピーチコンテストに{出|で}ました。なんと{2位|にい}になりました。', 'Sengetsu, daigaku no Nihongo supiichi kontesuto ni demashita. Nanto ni i ni narimashita.', 'Tháng trước em dự cuộc thi hùng biện tiếng Nhật của trường. Thật không ngờ em được hạng nhì ạ.'),
        C('どうでしたか。', 'Dou deshita ka.', 'Thế nào?'),
        S('ホールに{人|ひと}がたくさん{集|あつ}まっていましたから、とても{緊張|きんちょう}しました。でも、{最後|さいご}まで{話|はな}すことができました。いい{思|おも}い{出|で}になりました。', 'Hooru ni hito ga takusan atsumatte imashita kara, totemo kinchou shimashita. Demo, saigo made hanasu koto ga dekimashita. Ii omoide ni narimashita.', 'Vì hội trường đông người nên em rất hồi hộp. Nhưng em đã nói được đến cuối. Nó đã thành một kỷ niệm đẹp ạ.'),
      ],
      [
        'Bài của bạn cần: **khi nào** (＿月＿日) · **làm gì** (～に{出|で}ました) · **lúc đó thế nào** (～ていました — ポイント 122 ở quá khứ) · **kết quả** (なんと～{位|い}になりました) · **cảm tưởng** (いい{思|おも}い{出|で}になりました).',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết — 私のニュース** (bài mẫu mới + khung viết) và **Từ vựng · E**.',
      ],
    ),

    { t: 'h', text: 'Trang 267 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê 48 từ theo 3 chủ đề: (1) これ、知ってる？ (27) — kính, trời râm, bão, động đất, tai nạn, ～đại hội (lễ hội pháo hoa), đội, huỷ, chợ đồ cũ, thật, ngày xưa, miễn phí, chiều tối, chết, qua đời, dừng, bắt đầu, (mưa) rơi, thắng, thua, đổ, mới mở (新しい店ができます), vỡ, kết hôn, nhập viện, sợ, lo lắng; (2) 雑誌を見て町へ (14) — gió, móc đeo, chỗ ngồi, vội, đông, kịp, tạnh, nắng, ～phần trăm, giảm ～ (10パーセント引き), mạnh, chắc chắn, có lẽ, nếu; (3) 町を歩いて (7) — tụ tập, đóng, vắng, rơi, tắt, hỏng, bẩn. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 15.',
    },
    {
      t: 'note',
      title: 'Mẹo',
      items: [
        'Cả 7 từ chủ đề 3 và nhiều từ chủ đề 1 là **tự động từ** — học luôn **cặp tha động từ** (表 p.288): 止まります／止めます · 始まります／始めます · 集まります／集めます · 閉まります／閉めます · 消えます／消します.',
        'Cô hay kiểm tra nhanh các cặp dễ lẫn: **降ります (ふ／お) · 風／風邪 · 死にます／亡くなります · 割れます／壊れます · きっと／たぶん · 混みます／すきます** — ôn ở **Từ vựng · Nhầm lẫn hay gặp**.',
        'Xem **Từ vựng · Bài 15** và **Chữ Hán · Bài 15**.',
      ],
    },

    ...trang(
      'Trang 268 · もう{一度|いちど}{聞|き}こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 253 (CD C55), hai cảnh. **Trước ngày lễ:** パク nói ngày mai ở **Asakusa** có **lễ hội pháo hoa lớn**, rủ メアリー; メアリー nghe nói **mai thời tiết xấu**, hỏi **dù mưa có tổ chức không** — パク: **nếu mưa thì huỷ**, nhưng chắc chắn sẽ nắng; chỗ tổ chức rất đông nên **các quán cũng đông** → quyết định **mua đồ ăn ở cửa hàng tiện lợi mang theo**; hẹn **6 giờ ở Asakusa**. **Ngày lễ hội:** trời **không mưa**; người **đã tụ tập rất đông**; sắp bắt đầu, đi nhanh thôi; …pháo hoa đẹp quá. Từ ở chân trang: 会場. Cô sẽ hỏi lại các chi tiết.',
      [
        C('{花火大会|はなびたいかい}はどこでありますか。', 'Hanabi taikai wa doko de arimasu ka.', 'Lễ hội pháo hoa ở đâu?'),
        S('{浅草|あさくさ}であるそうです。', 'Asakusa de aru sou desu.', 'Nghe nói ở Asakusa ạ.'),
        C('{雨|あめ}が{降|ふ}ったら、どうなりますか。', 'Ame ga futtara, dou narimasu ka.', 'Nếu mưa thì sao?'),
        S('{雨|あめ}が{降|ふ}ったら、{中止|ちゅうし}だそうです。', 'Ame ga futtara, chuushi da sou desu.', 'Nghe nói nếu mưa thì huỷ ạ.'),
        C('2{人|ふたり}は{食|た}べ{物|もの}をどうしますか。どうしてですか。', 'Futari wa tabemono o dou shimasu ka. Doushite desu ka.', 'Hai người làm gì với đồ ăn? Vì sao?'),
        S('コンビニで{買|か}って、{持|も}って{行|い}きます。{会場|かいじょう}の{店|みせ}はとても{混|こ}んでいると{思|おも}いますから。', 'Konbini de katte, motte ikimasu. Kaijou no mise wa totemo konde iru to omoimasu kara.', 'Mua ở cửa hàng tiện lợi mang theo ạ. Vì nghĩ các quán ở chỗ tổ chức sẽ rất đông.'),
        C('{何時|なんじ}に、どこで{会|あ}いますか。', 'Nanji ni, doko de aimasu ka.', 'Gặp mấy giờ, ở đâu?'),
        S('{6時|ろくじ}に{浅草|あさくさ}で{会|あ}います。', 'Rokuji ni Asakusa de aimasu.', '6 giờ ở Asakusa ạ.'),
        C('{花火大会|はなびたいかい}の{日|ひ}、{雨|あめ}は{降|ふ}りましたか。', 'Hanabi taikai no hi, ame wa furimashita ka.', 'Ngày lễ hội có mưa không?'),
        S('いいえ、{降|ふ}りませんでした。{人|ひと}がたくさん{集|あつ}まっていました。', 'Iie, furimasen deshita. Hito ga takusan atsumatte imashita.', 'Không ạ. Người tụ tập rất đông ạ.'),
      ],
      [
        'Bẫy chính: **～たら ↔ ～ても** — "dù mưa vẫn có" hay "nếu mưa thì huỷ"? Trong đoạn này là **nếu mưa thì huỷ**.',
        'Cô hỏi "vì sao" → trả lời bằng **～から** + ý đoán **～と{思|おも}います**.',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài** (kịch bản mới cùng tình huống).',
      ],
    ),

    { t: 'h', text: 'Trang 269 · 巻末資料 — Hết phần bài học, sang phụ lục' },
    {
      t: 'p',
      text: 'Trang 269 chỉ là **trang phân cách**: tiêu đề 巻末資料 (tài liệu cuối sách) và danh sách phụ lục — **ポイント一覧** (bảng tổng hợp mọi điểm ngữ pháp, p.270–281), **表** (các bảng chia động từ, tính từ, số đếm, lịch, tự/tha động từ… p.282–289), **索引** (tra từ), **シラバス一覧** (danh sách mục tiêu). Bài 15 kết thúc ở đây — **cũng là hết sách**. Ôn cả cuốn theo mục **Bài tập · Ôn tập cả sách**: mỗi hình thái động từ học ở bài nào.',
    },

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b15-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi ニュースを見ましたか → "Chưa ạ. — (bạn kể) Nghe nói vì bão mà tàu dừng."', chips: ['{台風|たいふう}で', '{電車|でんしゃ}が', '{止|と}まった', 'そうです。', '{止|と}めた', '{台風|たいふう}を'], answer: ['{台風|たいふう}で', '{電車|でんしゃ}が', '{止|と}まった', 'そうです。'], ro: 'Taifuu de densha ga tomatta sou desu.' },
        { vi: 'Kể tin: "Nghe nói tháng này bảo tàng Hoshino miễn phí đấy."', chips: ['{今月|こんげつ}、', 'ほしの{美術館|びじゅつかん}は', '{無料|むりょう}', 'だそうですよ。', 'なそうですよ。'], answer: ['{今月|こんげつ}、', 'ほしの{美術館|びじゅつかん}は', '{無料|むりょう}', 'だそうですよ。'], ro: 'Kongetsu, Hoshino bijutsukan wa muryou da sou desu yo.' },
        { vi: 'Nghe tin anh Nishikawa nhập viện → "Hả? Lo quá nhỉ."', chips: ['えっ？', '{心配|しんぱい}ですね。', 'よかったですね。', 'おめでとうございます。'], answer: ['えっ？', '{心配|しんぱい}ですね。'], ro: 'E? Shinpai desu ne.' },
        { vi: 'Rủ cô: "Nếu cô có thời gian thì đi cùng em không ạ?"', chips: ['{時間|じかん}が', 'あったら、', '{一緒|いっしょ}に', '{行|い}きませんか。', 'あっても、', 'ありたら、'], answer: ['{時間|じかん}が', 'あったら、', '{一緒|いっしょ}に', '{行|い}きませんか。'], ro: 'Jikan ga attara, issho ni ikimasen ka.' },
        { vi: 'Cô hỏi 人が多いと思いますが、大丈夫ですか → "Dù đông em vẫn muốn đi ạ."', chips: ['{人|ひと}が', '{多|おお}くても、', '{行|い}きたいです。', '{多|おお}かったら、', '{多|おお}いでも、'], answer: ['{人|ひと}が', '{多|おお}くても、', '{行|い}きたいです。'], ro: 'Hito ga ookute mo, ikitai desu.' },
        { vi: 'Đoán: "Em nghĩ lễ hội pháo hoa chắc chắn đẹp ạ."', chips: ['{花火大会|はなびたいかい}は', 'きっと', 'きれいだと', '{思|おも}います。', 'きれいと', 'たぶん'], answer: ['{花火大会|はなびたいかい}は', 'きっと', 'きれいだと', '{思|おも}います。'], ro: 'Hanabi taikai wa kitto kirei da to omoimasu.' },
        { vi: 'Báo nhân viên: "Dạ, cốc bị mẻ ạ."', chips: ['あのう、', 'コップが', '{割|わ}れています。', '{割|わ}ります。', 'コップを'], answer: ['あのう、', 'コップが', '{割|わ}れています。'], ro: 'Anou, koppu ga warete imasu.' },
        { vi: 'Ngoài phố: "Ơ, cửa hàng đóng cửa rồi. Mình sang cửa hàng khác không ạ?"', chips: ['あっ、', '{店|みせ}が', '{閉|し}まっています。', 'ほかの{店|みせ}へ', '{行|い}きませんか。', '{閉|し}めています。'], answer: ['あっ、', '{店|みせ}が', '{閉|し}まっています。', 'ほかの{店|みせ}へ', '{行|い}きませんか。'], ro: 'A, mise ga shimatte imasu. Hoka no mise e ikimasen ka.' },
        { vi: 'Cô hỏi ビッグニュースは何ですか → "Thật không ngờ, em được hạng nhì ạ."', chips: ['なんと', '{2位|にい}に', 'なりました。', '{2回|にかい}に', 'しました。'], answer: ['なんと', '{2位|にい}に', 'なりました。'], ro: 'Nanto ni i ni narimashita.' },
        { vi: 'Cô hỏi 雨が降ったら、どうなりますか → "Nghe nói nếu mưa thì huỷ ạ."', chips: ['{雨|あめ}が', '{降|ふ}ったら、', '{中止|ちゅうし}', 'だそうです。', '{降|ふ}っても、', 'そうです。'], answer: ['{雨|あめ}が', '{降|ふ}ったら、', '{中止|ちゅうし}', 'だそうです。'], ro: 'Ame ga futtara, chuushi da sou desu.' },
      ],
    },
  ],
};
