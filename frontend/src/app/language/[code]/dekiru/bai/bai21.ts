/**
 * Bài 21 — 目標 (Mục tiêu) · TIẾP SAU SÁCH, cấp N4 (xem ../SOAN-BAI.md mục 8). Bài ĐẦU chặng 21–25 (Bài 25 = thi thử N4).
 * Người học đã xong Bài 1–15 (ポイント 1–124 — trong đó ポイント 42 「Vます に 行きます」 đi để làm gì, ポイント 82 「V こと が
 * できます」, ポイント 95 「イA くなります／ナA・N になります」), Bài 16 (thể khả năng, thể ý chí, ～つもり, ～予定), Bài 17 (～ば,
 * ～なら, ～し, ～すぎる, ～やすい・にくい), Bài 18 (～てあげる・くれる・もらう, ～ておく, ～てある), Bài 19 (～てしまう, ～てみる,
 * ～ところ, ～のに — kể cả のに "dùng để") và Bài 20 (～そう, ～ようだ・みたい, ～らしい, ～かもしれない, ～はず). KHÔNG dạy lại —
 * chỉ dùng lại trong câu (ghi "ôn: Bài X").
 *
 * Ngữ pháp (N4) — nhóm "mục tiêu, thay đổi & quyết định": ① V辞書形／N の ＋ ために (để — mục đích có chủ ý; N のために = vì
 * lợi ích của N) · ② V辞書形 (khả năng / không chủ ý)／Vない ＋ ように (để — để có thể…, để khỏi…; ～ますように = cầu mong) +
 * BẢNG ために ↔ ように · ③ V辞書形／V可能形 ＋ ようになる (trở nên, bắt đầu — thay đổi năng lực / thói quen; phủ định
 * ～なくなる) · ④ V辞書形／Vない ＋ ようにする・ようにしている・ようにしてください (cố gắng, tạo thói quen) + BẢNG ようになる ↔
 * ようにする · ⑤ V辞書形／Vない ＋ ことにする・ことにした・ことにしている (tự quyết định, quy tắc tự đặt) · ⑥ ～ことになる・
 * ことになった・ことになっている (được quyết định, quy định) + BẢNG ことにする ↔ ことになる ↔ ことにしている ↔ ことになっている
 * (+ so với つもり, 予定 — Bài 16). ～ため (nguyên nhân) để Bài 27.
 * Từ vựng: 48 từ N4 (một số N3 có ghi cấp): mục tiêu & cố gắng, học tập & thi cử, sức khoẻ & thói quen, tiền bạc & thay đổi,
 * quyết định & công việc. Từ đã học ở Bài 1–20 (頑張る, 決める, 計画, 夢, 将来, 合格する, 試験, 受ける, 習慣, 運動する, 練習,
 * ジョギング, 規則, 貯める, 給料, 自信, 無理, 必ず, できるだけ, 一生懸命, 進学, 就職, 太る, やせる, 確認…) KHÔNG lặp lại —
 * gặp trong câu thì coi như ôn.
 * Chữ Hán mới (15): 標 努 健 康 貯 続 必 要 成 績 格 復 増 減 禁 (N3 theo các bảng tham khảo phổ biến; 続 có bảng xếp N4, 貯 có
 * bảng xếp N2 — JLPT không công bố danh sách chữ chính thức) — không trùng hanTu.ts, hanTu16–20.ts, hanLop.ts, bảng chữ
 * Bài 1–20. Thẻ chữ Hán: hanTu21.ts (HAN_TU_21).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木 ·
 * nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, 小林店長.
 * {小林|こばやし}{店長|てんちょう} (nam, role 'examiner' / ja-nam) — chủ quán ひまわり{食堂|しょくどう} nơi ナタポン làm thêm (Bài 16).
 * {本田先生|ほんだせんせい} (nam, role 'examiner' / ja-nam) — giáo viên tiếng Nhật của lớp.
 * Nối tiếp các bài trước: ワン định đi làm ở Nhật sau khi tốt nghiệp, マルコ định về nước làm giáo viên (Bài 16); quán sách mới
 * trước ga (Bài 20) làm khách của ひまわり食堂 tăng lên.
 * Người MỚI của bài này (không tên riêng):
 *  - {受付|うけつけ}の{人|ひと} ở trung tâm thể thao (nghe Bài 2) — nữ, ja-nu.
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
  id: 'b21-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 目標: ôn thi N3 ở thư viện, chạy bộ buổi sáng vì sức khoẻ, quán ひまわり食堂 mở cửa Chủ nhật',
  goal: 'Nói mục đích của việc mình làm bằng ～ために (N3を取るために, 健康のために) và ～ように (ニュースがわかるように, 忘れないように); kể mình đã thay đổi ra sao bằng ～ようになる (5キロ走れるようになった) và thói quen mình đang cố giữ bằng ～ようにしている; báo một quyết định của mình bằng ～ことにしました và một việc đã được quyết định bằng ～ことになりました, nói quy định bằng ～ことになっています — khi bàn chuyện ôn thi, chuyện sức khoẻ và chuyện ca làm ở quán.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 21 — chủ đề: mục tiêu, thay đổi, quyết định (cấp N4, bài đầu chặng 21–25)',
      items: [
        'Ai cũng có **mục tiêu**: đỗ N3, nói tiếng Nhật trôi chảy, giảm 5 cân, tiết kiệm tiền học. Để nói về mục tiêu, ta cần ba loại câu: **làm việc này ĐỂ làm gì** (ために・ように), **mình đã THAY ĐỔI thế nào / đang CỐ GẮNG giữ thói quen gì** (ようになる・ようにする), và **đã QUYẾT ĐỊNH gì** (ことにする・ことになる).',
        'Sáu mẫu N4: **～ために** (để — mục đích có chủ ý), **～ように** (để có thể… / để khỏi…), **～ようになる** (trở nên, bắt đầu), **～ようにする** (cố gắng làm, tạo thói quen), **～ことにする** (mình tự quyết định), **～ことになる** (được quyết định). Đề N4 rất thích bắt chọn giữa các cặp: **ために ↔ ように**, **ようになる ↔ ようにする**, **ことにする ↔ ことになる**.',
        'Ba tình huống: ① ワン và カルロス ôn thi N3 ở thư viện — mỗi người một cách học · ② マルコ chạy bộ mỗi sáng vì sức khoẻ, パク muốn bỏ thói thức khuya · ③ ở quán ひまわり食堂: anh 小林 quyết định mở cửa cả Chủ nhật, còn ナタポン có tin vui — sắp học lên cao học.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 21 bạn làm được (できる)',
      items: [
        '**① {勉強|べんきょう}の{目標|もくひょう}** — nói mục đích: **{日本|にほん}の{会社|かいしゃ}で{働|はたら}くために、N3を{取|と}りたい** · **ニュースがわかるように、{毎日|まいにち}ラジオを{聞|き}いています** · **{忘|わす}れないように、メモしておく** · **{二人|ふたり}とも{合格|ごうかく}できるように、{頑張|がんば}ろう**.',
        '**② {健康|けんこう}のために** — kể thói quen đang cố giữ: **{階段|かいだん}を{使|つか}うようにしています**, **{甘|あま}いものを{食|た}べないようにしています**; kể thay đổi: **5キロ{走|はし}れるようになりました**, **よく{眠|ねむ}れるようになった**.',
        '**③ {決|き}めたこと** — báo quyết định của mình: **{日曜日|にちようび}も{営業|えいぎょう}することにしました**; báo việc đã được quyết định: **{大学院|だいがくいん}に{進学|しんがく}することになりました**; nói quy định: **{週|しゅう}28{時間|じかん}{以内|いない}ということになっています**; nói quy tắc tự đặt: **{日曜日|にちようび}は{図書館|としょかん}で{勉強|べんきょう}することにしています**.',
        '**できる！** — nói 1 phút "Mục tiêu của tôi": mục tiêu là gì, ĐỂ đạt được thì mình làm gì (～ために／～ように), mình đã quyết định gì (～ことにしました), mình đã thay đổi ra sao (～ようになりました).',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — muốn nói gì, dùng mẫu nào',
      head: ['Bạn muốn nói…', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['Làm việc này để đạt mục tiêu (mình chủ động)', '{留学|りゅうがく}するために、{貯金|ちょきん}しています。', 'Ryuugaku suru tame ni, chokin shite imasu.', 'V辞書形 ＋ ために'],
        ['Làm việc này để có thể… / để khỏi…', '{忘|わす}れないように、メモします。', 'Wasurenai you ni, memo shimasu.', 'V可能・Vない ＋ ように'],
        ['Mình đã thay đổi (giờ làm được)', '{漢字|かんじ}が{読|よ}めるようになりました。', 'Kanji ga yomeru you ni narimashita.', 'V可能 ＋ ようになる'],
        ['Mình đang cố giữ một thói quen', '{毎日|まいにち}{歩|ある}くようにしています。', 'Mainichi aruku you ni shite imasu.', 'V辞書形 ＋ ようにしている'],
        ['Mình tự quyết định', 'たばこをやめることにしました。', 'Tabako o yameru koto ni shimashita.', 'V辞書形 ＋ ことにする'],
        ['Việc đã được quyết định (không do mình)', '{大阪|おおさか}に{転勤|てんきん}することになりました。', 'Oosaka ni tenkin suru koto ni narimashita.', 'V辞書形 ＋ ことになる'],
        ['Quy tắc tự đặt cho mình', '{夜|よる}は{食|た}べないことにしています。', 'Yoru wa tabenai koto ni shite imasu.', 'Vない ＋ ことにしている'],
        ['Quy định / lịch đã định sẵn', '{会議|かいぎ}は{九時|くじ}から{始|はじ}まることになっています。', 'Kaigi wa kuji kara hajimaru koto ni natte imasu.', 'V辞書形 ＋ ことになっている'],
      ],
    },

    /* ── ① 図書館で ── */
    { t: 'h', text: '① {図書館|としょかん}で — "Để đỗ N3, cậu học thế nào?"' },
    {
      t: 'canh',
      anh: ['woman-student', 'man-student', 'books', 'spiral-calendar', 'bullseye'],
      caption: 'Chiều thứ Tư đầu tháng 8 ở thư viện trường, còn bốn tháng nữa là kỳ thi JLPT tháng 12. ワン ngồi giữa một chồng sách bài tập N3; カルロス đi ngang qua và ngồi xuống bàn bên cạnh.',
    },
    {
      t: 'p',
      text: 'Tình huống: **ワン** muốn đi làm ở Nhật sau khi tốt nghiệp (Bài 16) nên đặt mục tiêu đỗ **N3** tháng 12. Khi nói **việc mình chủ động làm để đạt mục tiêu**, hai người dùng **～ために**: **そのために** (= để được làm ở công ty Nhật), **N3を{取|と}るために**. Khi mục tiêu là **một khả năng / một trạng thái** (hiểu được, đọc được, không quên), cô và **カルロス** dùng **～ように**: **ニュースがわかるように**, **{漢字|かんじ}が{読|よ}めるように**, **{忘|わす}れないように**. Câu cuối — **{二人|ふたり}とも{合格|ごうかく}できるように、{頑張|がんば}ろうね** — là câu người Nhật nói rất nhiều trước kỳ thi.',
    },
    DL('Ở thư viện — "Còn bốn tháng nữa!"', [
      ['カルロス', 'b', 'ワンさん、{最近|さいきん}{毎日|まいにち}{図書館|としょかん}にいるね。', 'Wan-san, saikin mainichi toshokan ni iru ne.', 'Vương, dạo này ngày nào cậu cũng ở thư viện nhỉ.'],
      ['ワン', 'a', 'うん。{卒業|そつぎょう}したら{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいから、そのために、まず12{月|がつ}の{試験|しけん}でN3を{取|と}りたいの。', 'Un. Sotsugyou shitara Nihon no kaisha de hatarakitai kara, sono tame ni, mazu juunigatsu no shiken de enu-san o toritai no.', 'Ừ. Tốt nghiệp xong mình muốn làm ở công ty Nhật, nên để làm được thế, trước hết mình muốn lấy N3 ở kỳ thi tháng 12.'],
      ['カルロス', 'b', 'すごいね。{僕|ぼく}も{受|う}けるよ。ワンさんは、N3を{取|と}るために、どんな{勉強|べんきょう}をしているの？', 'Sugoi ne. Boku mo ukeru yo. Wan-san wa, enu-san o toru tame ni, donna benkyou o shite iru no?', 'Giỏi thật. Mình cũng thi đấy. Để lấy N3, cậu học kiểu gì thế?'],
      ['ワン', 'a', '{朝|あさ}、{単語|たんご}を30ずつ{覚|おぼ}えて、{夜|よる}、{寝|ね}る{前|まえ}に{復習|ふくしゅう}してる。それから、{聴解|ちょうかい}が{苦手|にがて}だから、ニュースがわかるように、{毎日|まいにち}ラジオを{聞|き}いているよ。', 'Asa, tango o sanjuu zutsu oboete, yoru, neru mae ni fukushuu shiteru. Sorekara, choukai ga nigate da kara, nyuusu ga wakaru you ni, mainichi rajio o kiite iru yo.', 'Sáng mình học thuộc mỗi lần 30 từ, tối trước khi ngủ thì ôn lại. Rồi mình kém nghe, nên để hiểu được tin tức, ngày nào mình cũng nghe đài.'],
      ['カルロス', 'b', 'なるほど。{僕|ぼく}は{漢字|かんじ}が{読|よ}めるように、{新聞|しんぶん}を{少|すこ}しずつ{読|よ}んでいるんだ。でも、すぐ{忘|わす}れちゃう。', 'Naruhodo. Boku wa kanji ga yomeru you ni, shinbun o sukoshi zutsu yonde iru n da. Demo, sugu wasurechau.', 'Ra vậy. Còn mình thì để đọc được chữ Hán, mình đọc báo từng chút một. Nhưng quên nhanh lắm.'],
      ['ワン', 'a', '{忘|わす}れないように、{読|よ}めなかった{漢字|かんじ}をノートに{書|か}いて、{何回|なんかい}も{復習|ふくしゅう}するといいよ。', 'Wasurenai you ni, yomenakatta kanji o nooto ni kaite, nankai mo fukushuu suru to ii yo.', 'Để khỏi quên thì cậu chép những chữ không đọc được vào vở rồi ôn lại nhiều lần là được đấy.'],
      ['カルロス', 'b', 'そうだね。やってみる。……あ、ワンさん、{試験|しけん}の{申|もう}し{込|こ}みはもうした？', 'Sou da ne. Yatte miru. …… A, Wan-san, shiken no moushikomi wa mou shita?', 'Đúng nhỉ. Mình sẽ thử. … À Vương, cậu đăng ký thi chưa?'],
      ['ワン', 'a', 'うん、{先週|せんしゅう}した。{締|し}め{切|き}りに{遅|おく}れないように、{早|はや}めに{出|だ}したの。', 'Un, senshuu shita. Shimekiri ni okurenai you ni, hayame ni dashita no.', 'Ừ, tuần trước rồi. Để không trễ hạn, mình nộp sớm.'],
      ['カルロス', 'b', 'えっ、もう？{僕|ぼく}はまだなんだ。{締|し}め{切|き}りはいつ？', 'E, mou? Boku wa mada na n da. Shimekiri wa itsu?', 'Hả, rồi á? Mình vẫn chưa. Hạn chót là bao giờ?'],
      ['ワン', 'a', '{確|たし}か、{今月|こんげつ}の{終|お}わりまでのはずだよ。インターネットで{申|もう}し{込|こ}めるよ。', 'Tashika, kongetsu no owari made no hazu da yo. Intaanetto de moushikomeru yo.', 'Nếu mình nhớ không nhầm thì chắc là đến cuối tháng này. Đăng ký qua mạng được đấy.'],
      ['カルロス', 'b', 'わかった。{締|し}め{切|き}りを{忘|わす}れないように、スマホのカレンダーに{書|か}いておこう。', 'Wakatta. Shimekiri o wasurenai you ni, sumaho no karendaa ni kaite okou.', 'Hiểu rồi. Để khỏi quên hạn chót, mình ghi sẵn vào lịch trên điện thoại.'],
      ['ワン', 'a', 'じゃ、{二人|ふたり}とも{合格|ごうかく}できるように、{頑張|がんば}ろうね！', 'Ja, futari tomo goukaku dekiru you ni, ganbarou ne!', 'Vậy cố lên để cả hai cùng đỗ nhé!'],
      ['カルロス', 'b', 'うん。{合格|ごうかく}したら、お{祝|いわ}いにおいしいものを{食|た}べに{行|い}こう。', 'Un. Goukaku shitara, oiwai ni oishii mono o tabe ni ikou.', 'Ừ. Đỗ rồi thì đi ăn món gì ngon để ăn mừng nhé.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{日本|にほん}の{会社|かいしゃ}で{働|はたら}くために、N3を{取|と}りたいです。', 'Nihon no kaisha de hataraku tame ni, enu-san o toritai desu.', 'Để làm ở công ty Nhật, tôi muốn lấy N3. (mục đích có chủ ý)'),
        E('ニュースがわかるように、{毎日|まいにち}ラジオを{聞|き}いています。', 'Nyuusu ga wakaru you ni, mainichi rajio o kiite imasu.', 'Để hiểu được tin tức, ngày nào tôi cũng nghe đài.'),
        E('{漢字|かんじ}が{読|よ}めるように、{新聞|しんぶん}を{読|よ}んでいます。', 'Kanji ga yomeru you ni, shinbun o yonde imasu.', 'Để đọc được chữ Hán, tôi đọc báo.'),
        E('{忘|わす}れないように、ノートに{書|か}きます。', 'Wasurenai you ni, nooto ni kakimasu.', 'Để khỏi quên, tôi viết vào vở.'),
        E('{締|し}め{切|き}りに{遅|おく}れないように、{早|はや}めに{出|だ}しました。', 'Shimekiri ni okurenai you ni, hayame ni dashimashita.', 'Để không trễ hạn, tôi đã nộp sớm.'),
        E('{二人|ふたり}とも{合格|ごうかく}できるように、{頑張|がんば}りましょう。', 'Futari tomo goukaku dekiru you ni, ganbarimashou.', 'Cố gắng để cả hai cùng đỗ nhé.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**{働|はたら}くために／N3を{取|と}るために** — **V{辞書形|じしょけい} ＋ ために** = "**để** (làm V)": V là việc **người nói chủ động làm được**, và người làm hai vế là **một người**. **そのために** = "để làm được điều đó" (その thay cho cả câu trước). N3を{取|と}る = lấy (bằng) N3 — văn nói rất hay dùng.',
        '**ニュースがわかるように／{漢字|かんじ}が{読|よ}めるように** — **～ように** đứng sau động từ **không chủ ý**: わかる (hiểu), thể khả năng {読|よ}める (Bài 16), {見|み}える, {聞|き}こえる, なる — những thứ mình **không ra lệnh cho nó xảy ra được**, chỉ tạo điều kiện. Không nói ~~ニュースがわかるために~~.',
        '**{忘|わす}れないように／{遅|おく}れないように** — **Vない ＋ ように** = "**để khỏi**, để không…". Mục đích phủ định luôn dùng **ように**, không dùng ために. Rất hay gặp: {風邪|かぜ}をひかないように, {遅刻|ちこく}しないように, {間違|まちが}えないように.',
        '**{合格|ごうかく}できるように、{頑張|がんば}ろう** — câu "chúc nhau / tự nhủ" trước kỳ thi: đỗ hay không không hoàn toàn do mình quyết, nên dùng **thể khả năng + ように**. (Người Nhật vẫn nói {合格|ごうかく}するために{勉強|べんきょう}する — gặp thì hiểu; làm đề hãy theo luật: ために + V chủ ý, ように + V khả năng / không chủ ý.)',
        '**{少|すこ}しずつ** (từng chút một) · **30ずつ** (mỗi lần 30 — ずつ = đều mỗi phần) · **{早|はや}め**に (sớm hơn một chút) · **{確|たし}か、～のはずだよ** (nếu nhớ không nhầm thì chắc là — ôn Bài 20) · **{申|もう}し{込|こ}める** (thể khả năng — Bài 16) · **{書|か}いておこう** (～ておく + ý chí — ôn Bài 18, 16) · **{忘|わす}れちゃう** (ôn Bài 19).',
      ],
    },

    /* ── ② 健康のために ── */
    { t: 'h', text: '② {健康|けんこう}のために — "Giờ mình chạy được 5 km rồi!"' },
    {
      t: 'canh',
      anh: ['man-running', 'woman-walking', 'sunrise', 'alarm-clock', 'green-salad'],
      caption: '6 giờ 40 sáng thứ Bảy ở công viên gần ký túc xá: マルコ đang chạy vòng thứ ba thì gặp パク — cô mắt nhắm mắt mở đi mua bánh mì sau một đêm thức khuya.',
    },
    {
      t: 'p',
      text: 'Tình huống: nửa năm trước **マルコ** đi khám sức khoẻ và bị nhắc **{体重|たいじゅう}** hơi nhiều. Từ đó anh **cố giữ** vài thói quen — **～ようにしている**: **{毎朝|まいあさ}{走|はし}るようにしている**, **{階段|かいだん}を{使|つか}うようにしている**, **{甘|あま}いものはなるべく{食|た}べないようにしている**. Kết quả là **thay đổi** — **～ようになった**: lúc đầu 1 km cũng không chạy nổi, giờ **5キロ{走|はし}れるようになった**, và **よく{眠|ねむ}れるようになった**. **パク** hay **thức khuya** (夜ふかし) nên sáng không dậy nổi; cô quyết tâm **{今日|きょう}から11{時|じ}までに{寝|ね}るようにする**. Nghe kỹ: **ようにする** (mình cố) ↔ **ようになる** (đã thành).',
    },
    DL('Ở công viên — "Trông cậu khác hẳn!"', [
      ['パク', 'a', 'あれ、マルコさん？おはよう。こんなに{早|はや}く{走|はし}っているの？', 'Are, Maruko-san? Ohayou. Konna ni hayaku hashitte iru no?', 'Ơ, Marco à? Chào buổi sáng. Sớm thế này mà cậu đã chạy rồi à?'],
      ['マルコ', 'b', 'おはよう、パクさん。うん、{健康|けんこう}のために、{毎朝|まいあさ}{走|はし}るようにしているんだ。', 'Ohayou, Paku-san. Un, kenkou no tame ni, maiasa hashiru you ni shite iru n da.', 'Chào Park. Ừ, vì sức khoẻ nên mình cố sáng nào cũng chạy.'],
      ['パク', 'a', 'えっ、{前|まえ}は{運動|うんどう}が{嫌|きら}いだったよね？', 'E, mae wa undou ga kirai datta yo ne?', 'Hả, trước đây cậu ghét vận động lắm mà?'],
      ['マルコ', 'b', 'うん。でも{半年前|はんとしまえ}の{健康診断|けんこうしんだん}で、{医者|いしゃ}に「{体重|たいじゅう}が{多|おお}すぎますね。{運動不足|うんどうぶそく}ですよ」って{言|い}われて……。', 'Un. Demo hantoshi mae no kenkou shindan de, isha ni "Taijuu ga oosugimasu ne. Undou busoku desu yo" tte iwarete…….', 'Ừ. Nhưng ở đợt khám sức khoẻ nửa năm trước, bác sĩ bảo "Cân nặng nhiều quá. Cậu thiếu vận động đấy"…'],
      ['パク', 'a', 'それで{始|はじ}めたんだ。ほかにも{何|なに}かしている？', 'Sorede hajimeta n da. Hoka ni mo nani ka shite iru?', 'Thế là cậu bắt đầu. Ngoài ra cậu còn làm gì nữa không?'],
      ['マルコ', 'b', '{学校|がっこう}でも{駅|えき}でもエレベーターを{使|つか}わないで、{階段|かいだん}を{使|つか}うようにしている。{甘|あま}いものも、なるべく{食|た}べないようにしているよ。', 'Gakkou demo eki demo erebeetaa o tsukawanaide, kaidan o tsukau you ni shite iru. Amai mono mo, narubeku tabenai you ni shite iru yo.', 'Ở trường hay ở ga mình đều không đi thang máy mà cố đi cầu thang bộ. Đồ ngọt thì cũng cố hết mức không ăn.'],
      ['パク', 'a', 'だから、やせたんだね。{体重|たいじゅう}、{減|へ}った？', 'Dakara, yaseta n da ne. Taijuu, hetta?', 'Hèn gì cậu gầy đi. Cân nặng có giảm không?'],
      ['マルコ', 'b', '6キロ{減|へ}ったよ。{最初|さいしょ}は1キロも{走|はし}れなかったけど、{今|いま}は5キロ{走|はし}れるようになった。それに、{夜|よる}もよく{眠|ねむ}れるようになったんだ。', 'Roku-kiro hetta yo. Saisho wa ichi-kiro mo hashirenakatta kedo, ima wa go-kiro hashireru you ni natta. Sore ni, yoru mo yoku nemureru you ni natta n da.', 'Giảm 6 cân rồi. Lúc đầu 1 km mình cũng không chạy nổi, giờ thì chạy được 5 km. Hơn nữa, đêm mình cũng ngủ ngon hơn hẳn.'],
      ['パク', 'a', 'いいなあ。{私|わたし}は{夜|よ}ふかしばかりで、{朝|あさ}、{全然|ぜんぜん}{起|お}きられないの。{目覚|めざ}まし{時計|どけい}が{鳴|な}っても{聞|き}こえなくて……。', 'Ii naa. Watashi wa yofukashi bakari de, asa, zenzen okirarenai no. Mezamashi dokei ga nattemo kikoenakute…….', 'Thích thật. Mình toàn thức khuya, sáng chẳng dậy nổi. Đồng hồ báo thức kêu mà mình cũng không nghe thấy…'],
      ['マルコ', 'b', '{寝|ね}る{前|まえ}にスマホを{見|み}ないようにすれば、{早|はや}く{眠|ねむ}れるようになるよ。{僕|ぼく}もそうだったから。', 'Neru mae ni sumaho o minai you ni sureba, hayaku nemureru you ni naru yo. Boku mo sou datta kara.', 'Nếu cậu cố không xem điện thoại trước khi ngủ thì sẽ ngủ sớm được thôi. Mình cũng từng như thế mà.'],
      ['パク', 'a', 'そうなんだ。じゃ、{今日|きょう}から、11{時|じ}までに{寝|ね}るようにする！', 'Sou na n da. Ja, kyou kara, juuichiji made ni neru you ni suru!', 'Ra vậy. Thế thì từ hôm nay mình sẽ cố đi ngủ trước 11 giờ!'],
      ['マルコ', 'b', 'いいね。{早寝早起|はやねはやお}きができるようになったら、{一緒|いっしょ}に{走|はし}ろうよ。', 'Ii ne. Hayane hayaoki ga dekiru you ni nattara, issho ni hashirou yo.', 'Hay đấy. Khi nào cậu ngủ sớm dậy sớm được rồi thì cùng chạy nhé.'],
      ['パク', 'a', 'うん。{朝|あさ}6{時半|じはん}に{起|お}きられるように、{目覚|めざ}まし{時計|どけい}を{二|ふた}つかけておくね。', 'Un. Asa rokuji han ni okirareru you ni, mezamashi dokei o futatsu kakete oku ne.', 'Ừ. Để dậy được lúc 6 rưỡi, mình sẽ đặt sẵn hai cái đồng hồ báo thức.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{健康|けんこう}のために、{毎朝|まいあさ}{走|はし}るようにしています。', 'Kenkou no tame ni, maiasa hashiru you ni shite imasu.', 'Vì sức khoẻ, tôi cố sáng nào cũng chạy.'),
        E('エレベーターを{使|つか}わないで、{階段|かいだん}を{使|つか}うようにしています。', 'Erebeetaa o tsukawanaide, kaidan o tsukau you ni shite imasu.', 'Tôi cố không đi thang máy mà đi cầu thang bộ.'),
        E('{甘|あま}いものはなるべく{食|た}べないようにしています。', 'Amai mono wa narubeku tabenai you ni shite imasu.', 'Đồ ngọt thì tôi cố hết mức không ăn.'),
        E('{今|いま}は5キロ{走|はし}れるようになりました。', 'Ima wa go-kiro hashireru you ni narimashita.', 'Giờ tôi đã chạy được 5 km.'),
        E('よく{眠|ねむ}れるようになりました。', 'Yoku nemureru you ni narimashita.', 'Tôi đã ngủ ngon được rồi.'),
        E('{今日|きょう}から、11{時|じ}までに{寝|ね}るようにします。', 'Kyou kara, juuichiji made ni neru you ni shimasu.', 'Từ hôm nay tôi sẽ cố đi ngủ trước 11 giờ.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**{健康|けんこう}のために** — **N ＋ の ＋ ために** = "vì N, để có N": {健康|けんこう}のために (vì sức khoẻ), {試験|しけん}のために (để thi), {家族|かぞく}のために (vì gia đình). Danh từ nối bằng **の**.',
        '**{走|はし}るようにしている／{階段|かいだん}を{使|つか}うようにしている** — **V{辞書形|じしょけい} ＋ ようにしている** = "**cố gắng** (đều đặn) làm V" — một thói quen người nói **đang cố giữ**, không phải luật cứng. Phủ định: **{食|た}べないようにしている** (cố không ăn). **なるべく** (cố hết mức có thể) rất hay đi cùng.',
        '**{走|はし}れるようになった／{眠|ねむ}れるようになった** — **V{可能形|かのうけい} ＋ ようになる** = "**đã trở nên** làm được" — kết quả của một quá trình. ⚠ Không nói ~~5キロ{走|はし}れるになった~~ — động từ luôn cần **ように** trước なる (còn tính từ / danh từ thì {元気|げんき}になる, {暖|あたた}かくなる — ポイント 95).',
        '**{見|み}ないようにすれば** — ようにする + ～ば (ôn Bài 17): "nếu cố không xem". **{寝|ね}るようにする！** — ようにする ở thể hiện tại = **quyết tâm từ giờ sẽ cố**. **{起|お}きられるように** — ように + thể khả năng: mục đích (mẫu ① của hội thoại ①).',
        '**{医者|いしゃ}に…って{言|い}われて** — "bị bác sĩ nói là…" (thể bị động — Bài 22; ở đây chỉ cần hiểu). **{健康診断|けんこうしんだん}** = khám sức khoẻ định kỳ (N3) · **{夜|よ}ふかしばかり** = toàn thức khuya (～ばかり — Bài 22) · **{目覚|めざ}まし{時計|どけい}をかける** = đặt đồng hồ báo thức · **{鳴|な}っても** (ôn ポイント 121).',
      ],
    },

    /* ── ③ ひまわり食堂 ── */
    { t: 'h', text: '③ ひまわり{食堂|しょくどう} — "Anh quyết định mở cửa cả Chủ nhật"' },
    {
      t: 'canh',
      anh: ['man-cook', 'man-student', 'tear-off-calendar', 'graduation-cap', 'curry-rice'],
      caption: 'Ba giờ chiều, giờ nghỉ giữa ca ở quán ひまわり食堂. Từ khi hiệu sách trước ga mở cửa, khách đông hẳn lên. Anh 小林 gọi ナタポン ra nói chuyện — và ナタポン cũng có một tin muốn báo.',
    },
    {
      t: 'p',
      text: 'Tình huống: anh **小林** báo **quyết định của chính anh**: **{来月|らいげつ}から{日曜日|にちようび}も{営業|えいぎょう}することにしたんだ** (**～ことにする**). ナタポン báo một tin **không do mình quyết**: đã đỗ, **{来年|らいねん}の4{月|がつ}から{大学院|だいがくいん}に{進学|しんがく}することになりました** (**～ことになる**). Cậu kể **quy tắc tự đặt**: **{日曜日|にちようび}は{図書館|としょかん}で{勉強|べんきょう}することにしています** (**～ことにしている**), và **quy định của nhà nước** về giờ làm thêm của du học sinh: **{週|しゅう}28{時間|じかん}{以内|いない}ということになっています** (**～ことになっている**). Cuối cùng là một quyết định vui: món cà ri Thái của ナタポン **sẽ vào thực đơn**.',
    },
    DL('Ở quán ひまわり食堂 — "Anh có chuyện muốn bàn"', [
      ['{小林店長|こばやしてんちょう}', 'examiner', 'ナタポンくん、ちょっといい？{実|じつ}は、{来月|らいげつ}から{日曜日|にちようび}も{営業|えいぎょう}することにしたんだ。', 'Natapon-kun, chotto ii? Jitsu wa, raigetsu kara nichiyoubi mo eigyou suru koto ni shita n da.', 'Nattapon, em rảnh chút không? Chuyện là anh quyết định từ tháng sau mở cửa cả Chủ nhật.'],
      ['ナタポン', 'b', 'えっ、{日曜日|にちようび}もですか。', 'E, nichiyoubi mo desu ka.', 'Ơ, cả Chủ nhật ạ?'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'うん。{駅前|えきまえ}に{本屋|ほんや}ができてから、お{客|きゃく}さんがずいぶん{増|ふ}えたからね。それで、{日曜日|にちようび}に{入|はい}れる{人|ひと}を{探|さが}しているんだけど……。', 'Un. Ekimae ni hon\'ya ga dekite kara, okyaku-san ga zuibun fueta kara ne. Sorede, nichiyoubi ni haireru hito o sagashite iru n da kedo…….', 'Ừ. Từ khi trước ga có hiệu sách, khách tăng lên nhiều lắm. Nên anh đang tìm người làm được ca Chủ nhật…'],
      ['ナタポン', 'b', 'すみません、{日曜日|にちようび}はちょっと……。{実|じつ}は、{僕|ぼく}、{来年|らいねん}の4{月|がつ}から{大学院|だいがくいん}に{進学|しんがく}することになったんです。', 'Sumimasen, nichiyoubi wa chotto……. Jitsu wa, boku, rainen no shigatsu kara daigakuin ni shingaku suru koto ni natta n desu.', 'Em xin lỗi, Chủ nhật thì hơi khó ạ… Chuyện là từ tháng 4 năm sau em sẽ học lên cao học ạ.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'おお、{試験|しけん}に{受|う}かったんだね！おめでとう！', 'Oo, shiken ni ukatta n da ne! Omedetou!', 'Ồ, em thi đỗ rồi à! Chúc mừng em!'],
      ['ナタポン', 'b', 'ありがとうございます。それで、{研究|けんきゅう}の{準備|じゅんび}をするために、{日曜日|にちようび}は{一日中|いちにちじゅう}{図書館|としょかん}で{勉強|べんきょう}することにしているんです。', 'Arigatou gozaimasu. Sorede, kenkyuu no junbi o suru tame ni, nichiyoubi wa ichinichijuu toshokan de benkyou suru koto ni shite iru n desu.', 'Em cảm ơn anh. Vì thế, để chuẩn bị cho việc nghiên cứu, em đặt cho mình lệ là Chủ nhật học cả ngày ở thư viện.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'そうか。それは{大事|だいじ}だね。じゃ、{日曜日|にちようび}は{無理|むり}しなくていいよ。', 'Sou ka. Sore wa daiji da ne. Ja, nichiyoubi wa muri shinakute ii yo.', 'Vậy à. Việc đó quan trọng đấy. Thế Chủ nhật em không cần cố đâu.'],
      ['ナタポン', 'b', 'すみません。その{代|か}わり、{土曜日|どようび}は{朝|あさ}から{入|はい}れるようにします。', 'Sumimasen. Sono kawari, doyoubi wa asa kara haireru you ni shimasu.', 'Em xin lỗi. Bù lại, thứ Bảy em sẽ thu xếp để vào ca từ sáng ạ.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{助|たす}かるよ。……ところで、{大学院|だいがくいん}に{行|い}っても、アルバイトは{続|つづ}けるの？', 'Tasukaru yo. …… Tokoro de, daigakuin ni itte mo, arubaito wa tsuzukeru no?', 'Đỡ cho anh quá. … Mà này, lên cao học rồi em có tiếp tục làm thêm không?'],
      ['ナタポン', 'b', 'はい、{続|つづ}けたいです。でも、{留学生|りゅうがくせい}のアルバイトは{週|しゅう}28{時間|じかん}{以内|いない}ということになっていますから、{時間|じかん}は{今|いま}より{少|すく}なくなるかもしれません。', 'Hai, tsuzuketai desu. Demo, ryuugakusei no arubaito wa shuu nijuuhachi-jikan inai to iu koto ni natte imasu kara, jikan wa ima yori sukunaku naru kamoshiremasen.', 'Dạ, em muốn tiếp tục. Nhưng theo quy định, du học sinh làm thêm trong vòng 28 tiếng một tuần, nên giờ làm có khi ít hơn bây giờ ạ.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'そうだったね。じゃ、シフトは{一緒|いっしょ}に{相談|そうだん}して{決|き}めよう。それから、もう{一|ひと}つ。ナタポンくんのタイカレーを、{来月|らいげつ}からメニューに{入|い}れることにしたよ。', 'Sou datta ne. Ja, shifuto wa issho ni soudan shite kimeyou. Sorekara, mou hitotsu. Natapon-kun no tai karee o, raigetsu kara menyuu ni ireru koto ni shita yo.', 'Ừ nhỉ. Thế lịch ca mình cùng bàn rồi quyết. Còn một chuyện nữa. Anh quyết định từ tháng sau đưa món cà ri Thái của em vào thực đơn.'],
      ['ナタポン', 'b', 'えっ、{本当|ほんとう}ですか！うれしいです！', 'E, hontou desu ka! Ureshii desu!', 'Ơ, thật ạ! Em vui quá!'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'お{客|きゃく}さんに{人気|にんき}があるからね。{僕|ぼく}も{同|おな}じ{味|あじ}が{作|つく}れるように、{今度|こんど}{作|つく}り{方|かた}を{教|おし}えてくれる？', 'Okyaku-san ni ninki ga aru kara ne. Boku mo onaji aji ga tsukureru you ni, kondo tsukurikata o oshiete kureru?', 'Vì khách thích món đó mà. Để anh cũng nấu được đúng vị ấy, lần tới em chỉ anh cách nấu nhé?'],
      ['ナタポン', 'b', 'はい、もちろんです！', 'Hai, mochiron desu!', 'Dạ, tất nhiên rồi ạ!'],
    ]),
    DL('③′ Tối hôm đó — ナタポン gọi điện báo tin cho thầy 本田', [
      ['ナタポン', 'b', '{本田先生|ほんだせんせい}、こんばんは。ナタポンです。{今|いま}、{少|すこ}しよろしいですか。', 'Honda-sensei, konbanwa. Natapon desu. Ima, sukoshi yoroshii desu ka.', 'Thầy Honda, em chào thầy. Em là Nattapon. Bây giờ thầy có rảnh một chút không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'ああ、ナタポンさん。どうしましたか。', 'Aa, Natapon-san. Dou shimashita ka.', 'À, Nattapon. Có chuyện gì vậy em?'],
      ['ナタポン', 'b', '{実|じつ}は、{大学院|だいがくいん}の{試験|しけん}に{合格|ごうかく}して、4{月|がつ}から{進学|しんがく}することになりました。', 'Jitsu wa, daigakuin no shiken ni goukaku shite, shigatsu kara shingaku suru koto ni narimashita.', 'Chuyện là em đã đỗ kỳ thi cao học, và từ tháng 4 em sẽ học lên ạ.'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'おめでとうございます！{毎日|まいにち}{図書館|としょかん}で{頑張|がんば}っていましたからね。', 'Omedetou gozaimasu! Mainichi toshokan de ganbatte imashita kara ne.', 'Chúc mừng em! Em đã cố gắng ở thư viện mỗi ngày mà.'],
      ['ナタポン', 'b', 'ありがとうございます。{先生|せんせい}のアドバイスどおり、{毎晩|まいばん}{日本語|にほんご}で{研究|けんきゅう}のメモを{書|か}くようにしていました。それで、{面接|めんせつ}でも{自分|じぶん}の{考|かんが}えがちゃんと{話|はな}せるようになったんです。', 'Arigatou gozaimasu. Sensei no adobaisu doori, maiban nihongo de kenkyuu no memo o kaku you ni shite imashita. Sorede, mensetsu demo jibun no kangae ga chanto hanaseru you ni natta n desu.', 'Em cảm ơn thầy. Đúng như lời khuyên của thầy, tối nào em cũng cố viết ghi chú nghiên cứu bằng tiếng Nhật. Nhờ vậy, đến buổi phỏng vấn em cũng đã nói được rõ ràng suy nghĩ của mình.'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'それはよかった。{大学院|だいがくいん}では{日本語|にほんご}で{論文|ろんぶん}を{書|か}くことになりますから、{文法|ぶんぽう}の{復習|ふくしゅう}も{続|つづ}けるようにしてくださいね。', 'Sore wa yokatta. Daigakuin de wa nihongo de ronbun o kaku koto ni narimasu kara, bunpou no fukushuu mo tsuzukeru you ni shite kudasai ne.', 'Tốt quá. Lên cao học rồi sẽ phải viết luận văn bằng tiếng Nhật, nên em nhớ tiếp tục ôn ngữ pháp nhé.'],
      ['ナタポン', 'b', 'はい。{入学|にゅうがく}までに、N2の{文法|ぶんぽう}を{全部|ぜんぶ}{復習|ふくしゅう}することにしました。', 'Hai. Nyuugaku made ni, enu-ni no bunpou o zenbu fukushuu suru koto ni shimashita.', 'Dạ. Em đã quyết định ôn hết ngữ pháp N2 trước khi nhập học.'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'いい{目標|もくひょう}ですね。{困|こま}ったことがあったら、いつでも{相談|そうだん}してください。', 'Ii mokuhyou desu ne. Komatta koto ga attara, itsu demo soudan shite kudasai.', 'Mục tiêu hay đấy. Có gì khó khăn thì lúc nào em cũng cứ hỏi thầy nhé.'],
      ['ナタポン', 'b', 'ありがとうございます。これからもよろしくお{願|ねが}いします。', 'Arigatou gozaimasu. Korekara mo yoroshiku onegai shimasu.', 'Em cảm ơn thầy. Mong thầy tiếp tục giúp đỡ em ạ.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{来月|らいげつ}から{日曜日|にちようび}も{営業|えいぎょう}することにしました。', 'Raigetsu kara nichiyoubi mo eigyou suru koto ni shimashita.', 'Tôi đã quyết định từ tháng sau mở cửa cả Chủ nhật. (tự quyết)'),
        E('{来年|らいねん}の4{月|がつ}から{大学院|だいがくいん}に{進学|しんがく}することになりました。', 'Rainen no shigatsu kara daigakuin ni shingaku suru koto ni narimashita.', 'Từ tháng 4 năm sau tôi sẽ học lên cao học. (đã được quyết định / kết quả thi)'),
        E('{日曜日|にちようび}は{図書館|としょかん}で{勉強|べんきょう}することにしています。', 'Nichiyoubi wa toshokan de benkyou suru koto ni shite imasu.', 'Chủ nhật tôi đặt lệ học ở thư viện.'),
        E('{留学生|りゅうがくせい}のアルバイトは{週|しゅう}28{時間|じかん}{以内|いない}ということになっています。', 'Ryuugakusei no arubaito wa shuu nijuuhachi-jikan inai to iu koto ni natte imasu.', 'Theo quy định, du học sinh làm thêm trong vòng 28 tiếng một tuần.'),
        E('{土曜日|どようび}は{朝|あさ}から{入|はい}れるようにします。', 'Doyoubi wa asa kara haireru you ni shimasu.', 'Thứ Bảy tôi sẽ thu xếp để vào ca được từ sáng.'),
        E('タイカレーをメニューに{入|い}れることにしたよ。', 'Tai karee o menyuu ni ireru koto ni shita yo.', 'Anh quyết định đưa cà ri Thái vào thực đơn rồi.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{営業|えいぎょう}することにした／メニューに{入|い}れることにした** — **V{辞書形|じしょけい} ＋ ことにする** = "**quyết định** làm V" — quyết định **của chính người nói** (anh 小林 là chủ quán). Dạng hay dùng nhất là quá khứ **ことにした／ことにしました**: báo cho người khác biết điều mình vừa quyết.',
        '**{進学|しんがく}することになった** — **V{辞書形|じしょけい} ＋ ことになる** = "**(đã) được quyết định** là V" — kết quả **không hoàn toàn do mình** (trường duyệt, công ty phân công, hoàn cảnh đưa đẩy). Người Nhật còn dùng ことになりました để báo **cả tin của mình một cách khiêm tốn**: {結婚|けっこん}することになりました (không khoe "tôi quyết định").',
        '**{勉強|べんきょう}することにしている** — **ことにしている** = "**đặt lệ cho mình**": một quy tắc người nói tự đặt ra và đang giữ (cứng hơn ようにしている "cố gắng"). **ということになっている** — **ことになっている** = "**theo quy định / lịch đã định**": luật của tổ chức, nhà nước, kế hoạch chung. ～という thêm vào khi trước đó là danh từ / con số (28{時間|じかん}{以内|いない}).',
        '**{入|はい}れるようにします** — ようにする + thể khả năng: "sẽ **thu xếp sao cho** vào ca được". **{作|つく}れるように** — ように + thể khả năng = mục đích (để nấu được). **{少|すく}なくなるかもしれません** — ポイント 95 + Bài 20.',
        '**{営業|えいぎょう}する** = mở cửa kinh doanh (N3) · **{増|ふ}えた** (khách tăng — tự động từ) · **{受|う}かった** = đỗ (văn nói của {合格|ごうかく}した) · **その{代|か}わり** = bù lại · **シフト** = ca làm · **{研究|けんきゅう}** = nghiên cứu · **{無理|むり}しなくていい** (ôn ポイント 116).',
        '**③′ {論文|ろんぶん}を{書|か}くことになります** — ことになる thứ ba: **kết quả tự nhiên** của sự việc ("lên cao học thì sẽ thành ra phải viết luận văn"). **{書|か}くようにしていました → {話|はな}せるようになった** — cặp vàng: cố (する) → kết quả (なる). **アドバイスどおり** = đúng như lời khuyên (N + どおり — Bài 20). **{少|すこ}しよろしいですか** = bây giờ có tiện không ạ (câu mở đầu lịch sự khi gọi điện cho người trên).',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b21-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 48 từ N4: mục tiêu & cố gắng, học tập & thi cử, sức khoẻ & thói quen, tiền bạc & thay đổi, quyết định & công việc',
  goal: 'Thuộc 48 từ của chủ đề mục tiêu: mục tiêu và cố gắng (目標・立てる・努力する・続ける・続く・諦める・我慢する・チャレンジする・少しずつ・なるべく), học tập và thi cử (復習・予習・単語・文法・発音・成績・点・受かる・問題集・留学する), sức khoẻ và thói quen (健康・体重・ダイエット・早寝早起き・夜ふかし・目覚まし時計・禁煙・階段・運動不足・気をつける), tiền bạc và thay đổi (貯金・節約・無駄・必要・増える・増やす・減る・減らす・変わる・変える), quyết định và công việc (決まる・会議・転勤・出張・営業・結果・方法・以内) — và biết từ nào hay đi với mẫu nào (健康のために, 忘れないように, 続けられるように, 早寝早起きするようにする, 転勤することになる).',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: '**48 từ** chia 5 nhóm theo đúng các tình huống của bài: **A** mục tiêu & cố gắng (10) · **B** học tập & thi cử (10) · **C** sức khoẻ & thói quen (10) · **D** tiền bạc & thay đổi (10) · **E** quyết định & công việc (8). Từ đã học ở Bài 1–20 ({頑張|がんば}る, {決|き}める, {計画|けいかく}, {夢|ゆめ}, {将来|しょうらい}, {合格|ごうかく}する, {試験|しけん}を{受|う}ける, {習慣|しゅうかん}, {運動|うんどう}する, {練習|れんしゅう}, {規則|きそく}, {貯|た}める, {自信|じしん}, できるだけ, {一生懸命|いっしょうけんめい}, {進学|しんがく}, {太|ふと}る, やせる…) KHÔNG lặp lại — gặp trong câu ví dụ thì coi như ôn. Số **1 / 2 / 3** sau động từ = nhóm động từ. Có **bốn cặp tự động từ ↔ tha động từ** (続く↔続ける, 増える↔増やす, 減る↔減らす, 変わる↔変える) — học thành cặp, đề N4 rất hay hỏi trợ từ **が ↔ を** của chúng.',
    },
    {
      t: 'note',
      title: 'Cách học 48 từ trong 3 ngày',
      items: [
        '**Ngày 1** — nhóm A + B (20 từ): đọc to theo 🔊, che nghĩa tự nói; đọc to hội thoại ① — gần như cả nhóm B nằm trong đó. Tự nói 3 câu về cách mình học tiếng Nhật: {単語|たんご}を{毎日|まいにち}…, {文法|ぶんぽう}は…, {発音|はつおん}が….',
        '**Ngày 2** — nhóm C + D (20 từ): viết 4 cặp tự / tha động từ lên giấy (が{増|ふ}える ↔ を{増|ふ}やす…) và đặt mỗi cặp hai câu; kể thói quen sức khoẻ của mình bằng ～ようにしています.',
        '**Ngày 3** — nhóm E (8 từ) + thẻ hình + bảng "Từ dễ nhầm" + trắc nghiệm cuối mục + viết tay 10 từ hay vào đề.',
        'Romaji: trường âm viết đôi ({目標|もくひょう} → **mokuhyou**, {復習|ふくしゅう} → **fukushuu**, {体重|たいじゅう} → **taijuu**, {方法|ほうほう} → **houhou**); âm ngắt っ viết đôi phụ âm ({結果|けっか} → **kekka**, {出張|しゅっちょう} → **shucchou**); ん trước nguyên âm thêm dấu nháy ({禁煙|きんえん} → **kin\'en**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Mục tiêu & cố gắng (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{目標|もくひょう}', pos: 'danh từ', ipa: 'mokuhyou', vi: 'mục tiêu', ex: '{今年|ことし}の{目標|もくひょう}は、N3に{合格|ごうかく}することです。', exRo: 'Kotoshi no mokuhyou wa, enu-san ni goukaku suru koto desu.', exVi: 'Mục tiêu năm nay của tôi là đỗ N3.', more: '**{目標|もくひょう}を{立|た}てる** (đặt mục tiêu) · {目標|もくひょう}を{達成|たっせい}する (đạt mục tiêu — N2, đọc được là đủ) · {目標|もくひょう}は～ことです (mục tiêu là việc ~ — ôn ポイント 81). Khác {夢|ゆめ} (Bài 16): {夢|ゆめ} = ước mơ lớn, xa; {目標|もくひょう} = đích cụ thể, đo được. Chữ **標** là chữ Hán mới. N3.' },
        { w: '{立|た}てます［{立|た}てる］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'tatemasu [tateru]', vi: 'lập, đặt ra (kế hoạch, mục tiêu)', ex: '{夏休|なつやす}みの{前|まえ}に、{勉強|べんきょう}の{計画|けいかく}を{立|た}てました。', exRo: 'Natsuyasumi no mae ni, benkyou no keikaku o tatemashita.', exVi: 'Trước kỳ nghỉ hè, tôi đã lập kế hoạch học tập.', more: '+ て: {立|た}てて. **{計画|けいかく}／{目標|もくひょう}／{予定|よてい}を{立|た}てる** — cụm cố định, không nói ~~{計画|けいかく}を{作|つく}る~~ khi muốn nói "lập kế hoạch". Cặp: {立|た}つ (đứng — tự, ôn Bài 10) ↔ {立|た}てる (dựng, lập — tha).' },
        { w: '{努力|どりょく}します［{努力|どりょく}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'doryoku shimasu [doryoku suru]', vi: 'nỗ lực, cố gắng', ex: '{彼|かれ}は{毎日|まいにち}{努力|どりょく}して、{日本語|にほんご}が{上手|じょうず}になりました。', exRo: 'Kare wa mainichi doryoku shite, nihongo ga jouzu ni narimashita.', exVi: 'Anh ấy nỗ lực mỗi ngày và đã giỏi tiếng Nhật.', more: '**～ために{努力|どりょく}する** · {努力|どりょく}が{足|た}りない (chưa đủ cố gắng) · {努力|どりょく}の{結果|けっか} (thành quả của nỗ lực). Văn nói hằng ngày hay dùng {頑張|がんば}る (Bài 16); {努力|どりょく}する trang trọng hơn, hay gặp trong bài đọc, phỏng vấn. Chữ **努** là chữ Hán mới. N3.' },
        { w: '{続|つづ}けます［{続|つづ}ける］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'tsuzukemasu [tsuzukeru]', vi: 'tiếp tục (làm gì)', ex: '{毎日|まいにち}{少|すこ}しずつでも、{勉強|べんきょう}を{続|つづ}けることが{大切|たいせつ}です。', exRo: 'Mainichi sukoshi zutsu demo, benkyou o tsuzukeru koto ga taisetsu desu.', exVi: 'Dù mỗi ngày một ít, việc tiếp tục học là quan trọng.', more: '+ て: {続|つづ}けて. **N を{続|つづ}ける** · **Vます ＋ {続|つづ}ける** = làm V liên tục: {走|はし}り{続|つづ}ける (chạy mãi), {言|い}い{続|つづ}ける. Thể khả năng: {続|つづ}けられる (duy trì được) — rất hay đi với ように: {続|つづ}けられるように. Chữ **続** là chữ Hán mới.' },
        { w: '{続|つづ}きます［{続|つづ}く］1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'tsuzukimasu [tsuzuku]', vi: '(cái gì đó) tiếp diễn, kéo dài; duy trì được', ex: 'ダイエットを{始|はじ}めましたが、{三日|みっか}しか{続|つづ}きませんでした。', exRo: 'Daietto o hajimemashita ga, mikka shika tsuzukimasen deshita.', exVi: 'Tôi bắt đầu ăn kiêng nhưng chỉ duy trì được ba ngày.', more: '+ て: **{続|つづ}いて**. **N が{続|つづ}く**: {雨|あめ}が{続|つづ}く (mưa kéo dài), {会議|かいぎ}が{続|つづ}く. ⚠ Cặp: **が{続|つづ}く** (tự) ↔ **を{続|つづ}ける** (tha). Thành ngữ: {三日坊主|みっかぼうず} — "người làm gì cũng chỉ được ba ngày" (N2).' },
        { w: '{諦|あきら}めます［{諦|あきら}める］2', pos: 'động từ nhóm 2', ipa: 'akiramemasu [akirameru]', vi: 'từ bỏ, bỏ cuộc', ex: '{一度|いちど}{失敗|しっぱい}しても、{夢|ゆめ}を{諦|あきら}めないでください。', exRo: 'Ichido shippai shite mo, yume o akiramenaide kudasai.', exVi: 'Dù thất bại một lần, đừng từ bỏ ước mơ.', more: '+ て: {諦|あきら}めて. **N を{諦|あきら}める** · **{諦|あきら}めないで！** (đừng bỏ cuộc) · {途中|とちゅう}で{諦|あきら}める (bỏ giữa chừng — {途中|とちゅう} Bài 19). Khác やめる (Bài 16 — thôi, ngừng làm, có thể vì lý do bất kỳ): {諦|あきら}める = bỏ **vì thấy không đạt được** (có chút tiếc). Chữ 諦 cấp cao — đọc được là đủ. N3.' },
        { w: '{我慢|がまん}します［{我慢|がまん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'gaman shimasu [gaman suru]', vi: 'nhịn, chịu đựng', ex: 'ダイエット{中|ちゅう}なので、ケーキを{我慢|がまん}しています。', exRo: 'Daietto-chuu na node, keeki o gaman shite imasu.', exVi: 'Đang ăn kiêng nên tôi nhịn bánh ngọt.', more: '**N を{我慢|がまん}する** (nhịn cái gì) · {痛|いた}みを{我慢|がまん}する (chịu đau) · {我慢|がまん}できない (không chịu nổi — ôn thể khả năng Bài 16). Người Nhật coi {我慢|がまん} là một đức tính — gặp nhiều trong bài đọc. N3.' },
        { w: 'チャレンジします［チャレンジする］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'charenji shimasu [charenji suru]', vi: 'thử thách bản thân, thử làm (việc khó)', ex: '{来年|らいねん}は、N2にチャレンジするつもりです。', exRo: 'Rainen wa, enu-ni ni charenji suru tsumori desu.', exVi: 'Năm sau tôi định thử sức với N2.', more: '**N にチャレンジする** (thử sức với N — trợ từ **に**). Từ Hán tương đương: {挑戦|ちょうせん}する (N2 — gặp thì đọc được: ちょうせん). Khác ～てみる (Bài 19 — thử làm cho biết): チャレンジ = dám làm việc **khó**, có mục tiêu.' },
        { w: '{少|すこ}しずつ', pos: 'phó từ', ipa: 'sukoshi zutsu', vi: 'từng chút một, dần dần', ex: '{毎日|まいにち}{少|すこ}しずつ{練習|れんしゅう}して、{上手|じょうず}になりました。', exRo: 'Mainichi sukoshi zutsu renshuu shite, jouzu ni narimashita.', exVi: 'Mỗi ngày luyện từng chút một, tôi đã giỏi lên.', more: '**ずつ** = đều mỗi phần: {一人|ひとり}{一|ひと}つずつ (mỗi người một cái), {毎日|まいにち}30{分|ぷん}ずつ (mỗi ngày đều 30 phút). Rất hay đi với **～ようになる** (dần dần trở nên): {少|すこ}しずつ{話|はな}せるようになった. Gần nghĩa: だんだん (Bài 11).' },
        { w: 'なるべく', pos: 'phó từ', ipa: 'narubeku', vi: 'cố hết mức có thể, càng… càng tốt', ex: '{健康|けんこう}のために、なるべく{野菜|やさい}を{食|た}べるようにしています。', exRo: 'Kenkou no tame ni, narubeku yasai o taberu you ni shite imasu.', exVi: 'Vì sức khoẻ, tôi cố ăn rau nhiều nhất có thể.', more: '≈ **できるだけ** (Bài 12) — nghĩa gần như nhau; なるべく hơi nhẹ hơn, văn nói hay dùng. Cặp vàng: **なるべく～ようにする**／**なるべく～ないようにする**. なるべく{早|はや}く (càng sớm càng tốt).' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Học tập & thi cử (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{復習|ふくしゅう}します［{復習|ふくしゅう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'fukushuu shimasu [fukushuu suru]', vi: 'ôn tập, ôn lại (bài đã học)', ex: '{習|なら}ったことを{忘|わす}れないように、その{日|ひ}のうちに{復習|ふくしゅう}します。', exRo: 'Naratta koto o wasurenai you ni, sono hi no uchi ni fukushuu shimasu.', exVi: 'Để không quên điều đã học, tôi ôn lại ngay trong ngày.', more: 'Cặp: **{復習|ふくしゅう}** (ôn bài cũ — sau giờ học) ↔ **{予習|よしゅう}** (xem trước — trước giờ học). **N を{復習|ふくしゅう}する**. Chữ **復** là chữ Hán mới (習 — Bài 9).' },
        { w: '{予習|よしゅう}します［{予習|よしゅう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'yoshuu shimasu [yoshuu suru]', vi: 'chuẩn bị bài trước, xem trước', ex: '{授業|じゅぎょう}がよくわかるように、{新|あたら}しい{課|か}を{予習|よしゅう}しておきます。', exRo: 'Jugyou ga yoku wakaru you ni, atarashii ka o yoshuu shite okimasu.', exVi: 'Để hiểu rõ giờ học, tôi xem trước bài mới.', more: 'Rất hợp với **～ておく** (Bài 18): {予習|よしゅう}しておく. 予 (Bài 16 — {予定|よてい}) + 習. Câu của giáo viên: {明日|あした}までに{第|だい}22{課|か}を{予習|よしゅう}してきてください.' },
        { w: '{単語|たんご}', pos: 'danh từ', ipa: 'tango', vi: 'từ vựng, từ đơn', ex: '{毎朝|まいあさ}、{電車|でんしゃ}の{中|なか}で{単語|たんご}を{覚|おぼ}えています。', exRo: 'Maiasa, densha no naka de tango o oboete imasu.', exVi: 'Sáng nào tôi cũng học thuộc từ vựng trên tàu.', more: '**{単語|たんご}を{覚|おぼ}える** (học thuộc từ) · {単語帳|たんごちょう} (sổ / thẻ từ vựng) · {新|あたら}しい{単語|たんご}. Khác **{言葉|ことば}** (từ, lời nói nói chung — mềm hơn): {単語|たんご} là từ đơn lẻ dùng khi học ngôn ngữ.' },
        { w: '{文法|ぶんぽう}', pos: 'danh từ', ipa: 'bunpou', vi: 'ngữ pháp', ex: 'この{文法|ぶんぽう}は{難|むずか}しいので、{例文|れいぶん}をたくさん{読|よ}みました。', exRo: 'Kono bunpou wa muzukashii node, reibun o takusan yomimashita.', exVi: 'Ngữ pháp này khó nên tôi đã đọc rất nhiều câu ví dụ.', more: '⚠ Đọc **ぶんぽう** (bunpou) — 法 ホウ → **ぽう** sau ん. {文法|ぶんぽう}の{問題|もんだい} (câu hỏi ngữ pháp) · {例文|れいぶん} (câu ví dụ — N3).' },
        { w: '{発音|はつおん}', pos: 'danh từ / động từ nhóm 3 (発音する)', ipa: 'hatsuon', vi: 'phát âm', ex: '{日本人|にほんじん}の{友達|ともだち}に{発音|はつおん}を{直|なお}してもらいました。', exRo: 'Nihonjin no tomodachi ni hatsuon o naoshite moraimashita.', exVi: 'Tôi đã nhờ bạn người Nhật sửa phát âm cho.', more: '{発音|はつおん}がいい／きれい · {発音|はつおん}を{練習|れんしゅう}する · {直|なお}す (sửa — Bài 19) + ～てもらう (Bài 18). 発 (Bài 17) + 音.' },
        { w: '{成績|せいせき}', pos: 'danh từ', ipa: 'seiseki', vi: 'thành tích, điểm số, kết quả học tập', ex: '{毎日|まいにち}{復習|ふくしゅう}するようにしたら、{成績|せいせき}が{上|あ}がりました。', exRo: 'Mainichi fukushuu suru you ni shitara, seiseki ga agarimashita.', exVi: 'Từ khi cố ôn bài mỗi ngày, điểm số của tôi đã tăng.', more: '**{成績|せいせき}が{上|あ}がる／{下|さ}がる** (điểm lên / xuống — không nói ~~{成績|せいせき}が{増|ふ}える~~) · {成績|せいせき}がいい／{悪|わる}い. Chữ **成・績** là chữ Hán mới.' },
        { w: '{点|てん}', pos: 'danh từ', ipa: 'ten', vi: 'điểm (số điểm)', ex: '{漢字|かんじ}のテストで、80{点|てん}を{取|と}りました。', exRo: 'Kanji no tesuto de, hachijutten o torimashita.', exVi: 'Bài kiểm tra chữ Hán, tôi được 80 điểm.', more: '**～{点|てん}を{取|と}る** (được ~ điểm) · {満点|まんてん} (điểm tối đa — N3) · {何点|なんてん}でしたか. Đếm: 1{点|てん} いってん · 6{点|てん} ろくてん · 8{点|てん} はってん · 10{点|てん} じゅってん · 100{点|てん} ひゃくてん.' },
        { w: '{受|う}かります［{受|う}かる］1', pos: 'động từ nhóm 1', ipa: 'ukarimasu [ukaru]', vi: 'đỗ, thi đậu (văn nói)', ex: '{大学|だいがく}の{試験|しけん}に{受|う}かって、{家族|かぞく}みんなが{喜|よろこ}びました。', exRo: 'Daigaku no shiken ni ukatte, kazoku minna ga yorokobimashita.', exVi: 'Tôi thi đỗ đại học, cả nhà đều vui mừng.', more: '+ て: **{受|う}かって**. **N（{試験|しけん}）に{受|う}かる** = {合格|ごうかく}する (Bài 16 — trang trọng hơn). Đối: {落|お}ちる (trượt — ôn Bài 15). ⚠ {受|う}ける (dự thi — Bài 16) ≠ {受|う}かる (đỗ): {試験|しけん}を{受|う}けて、{受|う}かった. N3.' },
        { w: '{問題集|もんだいしゅう}', pos: 'danh từ', ipa: 'mondaishuu', vi: 'sách bài tập (tuyển tập đề)', ex: 'この{問題集|もんだいしゅう}を{最後|さいご}までやってしまうことにしました。', exRo: 'Kono mondaishuu o saigo made yatte shimau koto ni shimashita.', exVi: 'Tôi quyết định làm hết cuốn sách bài tập này.', more: '{問題|もんだい} (câu hỏi, bài tập) + {集|しゅう} (tập hợp — 集 Bài 9). Gần nghĩa: {参考書|さんこうしょ} (sách tham khảo — N3). Ví dụ có ～てしまう (Bài 19) + ことにする (mẫu ⑤).' },
        { w: '{留学|りゅうがく}します［{留学|りゅうがく}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'ryuugaku shimasu [ryuugaku suru]', vi: 'du học', ex: '{日本|にほん}に{留学|りゅうがく}するために、アルバイトをしてお{金|かね}を{貯|た}めました。', exRo: 'Nihon ni ryuugaku suru tame ni, arubaito o shite okane o tamemashita.', exVi: 'Để du học Nhật, tôi đã làm thêm tích tiền.', more: '**（{国|くに}）に{留学|りゅうがく}する** — trợ từ **に** (nơi đến). {留学生|りゅうがくせい} (du học sinh — Bài 3). Ví dụ là câu ～ために mẫu: V chủ ý + ために + việc làm.' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Sức khoẻ & thói quen (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{健康|けんこう}（な）', pos: 'danh từ / tính từ な', ipa: 'kenkou (na)', vi: 'sức khoẻ; khoẻ mạnh', ex: '{健康|けんこう}のために、{毎日|まいにち}{三十分|さんじゅっぷん}{歩|ある}くようにしています。', exRo: 'Kenkou no tame ni, mainichi sanjuppun aruku you ni shite imasu.', exVi: 'Vì sức khoẻ, mỗi ngày tôi cố đi bộ 30 phút.', more: '**{健康|けんこう}のために** (vì sức khoẻ — câu mở kinh điển của mẫu ①) · {健康|けんこう}にいい／{悪|わる}い (tốt / hại cho sức khoẻ) · {健康|けんこう}な{生活|せいかつ} · {健康診断|けんこうしんだん} (khám sức khoẻ định kỳ — N3). Chữ **健・康** là chữ Hán mới.' },
        { w: '{体重|たいじゅう}', pos: 'danh từ', ipa: 'taijuu', vi: 'cân nặng', ex: '{一か月|いっかげつ}で{体重|たいじゅう}が{二|に}キロ{減|へ}りました。', exRo: 'Ikkagetsu de taijuu ga ni-kiro herimashita.', exVi: 'Trong một tháng cân nặng giảm 2 kg.', more: '**{体重|たいじゅう}が{増|ふ}える／{減|へ}る** · {体重|たいじゅう}を{量|はか}る (cân — N3) · {体重計|たいじゅうけい} (cái cân). 体 (Bài 12) + 重 (Bài 17). ⚠ "Lên cân" về người thường nói {太|ふと}る (Bài 20); {体重|たいじゅう}が{増|ふ}える là cách nói trung tính, kiểu số liệu. N3.' },
        { w: 'ダイエットします［ダイエットする］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'daietto shimasu [daietto suru]', vi: 'ăn kiêng, giảm cân', ex: '{夏|なつ}までに{三|さん}キロやせるために、ダイエットしています。', exRo: 'Natsu made ni san-kiro yaseru tame ni, daietto shite imasu.', exVi: 'Để giảm 3 kg trước mùa hè, tôi đang ăn kiêng.', more: 'Tiếng Nhật dùng ダイエット cho cả **giảm cân nói chung** (cả tập thể dục), không chỉ ăn kiêng. ダイエット{中|ちゅう} (đang ăn kiêng). Hay đi với **{我慢|がまん}する**, **～ないようにする**.' },
        { w: '{早寝早起|はやねはやお}き', pos: 'danh từ / động từ nhóm 3 (早寝早起きする)', ipa: 'hayane hayaoki', vi: 'ngủ sớm dậy sớm', ex: '{試験|しけん}の{前|まえ}は、{早寝早起|はやねはやお}きするようにしています。', exRo: 'Shiken no mae wa, hayane hayaoki suru you ni shite imasu.', exVi: 'Trước kỳ thi, tôi cố ngủ sớm dậy sớm.', more: '{早寝|はやね} (ngủ sớm) + {早起|はやお}き (dậy sớm). Thành ngữ: {早起|はやお}きは{三文|さんもん}の{徳|とく} (dậy sớm có lợi — N2). Đối: {夜|よ}ふかし.' },
        { w: '{夜|よ}ふかしします［{夜|よ}ふかしする］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'yofukashi shimasu [yofukashi suru]', vi: 'thức khuya', ex: '{昨日|きのう}は{夜|よ}ふかしして、{今朝|けさ}{寝坊|ねぼう}してしまいました。', exRo: 'Kinou wa yofukashi shite, kesa nebou shite shimaimashita.', exVi: 'Hôm qua thức khuya nên sáng nay tôi lỡ ngủ quên.', more: '⚠ 夜 ở đây đọc **よ** (yo), không phải よる. Chữ đầy đủ {夜更|よふ}かし — chữ 更 cấp cao, thường viết {夜|よ}ふかし. {寝坊|ねぼう} (Bài 19) + ～てしまう (Bài 19). N3.' },
        { w: '{目覚|めざ}まし{時計|どけい}', pos: 'danh từ', ipa: 'mezamashi dokei', vi: 'đồng hồ báo thức', ex: '{朝|あさ}{起|お}きられるように、{目覚|めざ}まし{時計|どけい}を{六時|ろくじ}にかけました。', exRo: 'Asa okirareru you ni, mezamashi dokei o rokuji ni kakemashita.', exVi: 'Để sáng dậy được, tôi đã đặt đồng hồ báo thức lúc 6 giờ.', more: '**{目覚|めざ}まし{時計|どけい}をかける** (đặt báo thức) · {目覚|めざ}まし{時計|どけい}が{鳴|な}る (chuông kêu). ⚠ {時計|とけい} → **どけい** (đục) khi ghép. Văn nói: {目覚|めざ}まし／アラーム. Ví dụ: ように + thể khả năng ({起|お}きられる).' },
        { w: '{禁煙|きんえん}します［{禁煙|きんえん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'kin\'en shimasu [kin\'en suru]', vi: 'bỏ thuốc lá; (biển) cấm hút thuốc', ex: '{父|ちち}は{健康|けんこう}のために、{去年|きょねん}{禁煙|きんえん}することにしました。', exRo: 'Chichi wa kenkou no tame ni, kyonen kin\'en suru koto ni shimashita.', exVi: 'Vì sức khoẻ, năm ngoái bố tôi đã quyết định bỏ thuốc.', more: 'Hai nghĩa: (1) người **bỏ thuốc** — {禁煙|きんえん}する ≈ たばこをやめる; (2) biển **{禁煙|きんえん}** = cấm hút thuốc ({禁煙席|きんえんせき} — ghế không hút thuốc). {禁止|きんし} = cấm (N3). Chữ **禁** là chữ Hán mới; 煙 (khói) cấp cao — đọc được là đủ.' },
        { w: '{階段|かいだん}', pos: 'danh từ', ipa: 'kaidan', vi: 'cầu thang (bộ)', ex: '{運動|うんどう}のために、エレベーターではなく{階段|かいだん}を{使|つか}っています。', exRo: 'Undou no tame ni, erebeetaa de wa naku kaidan o tsukatte imasu.', exVi: 'Để vận động, tôi đi cầu thang bộ chứ không đi thang máy.', more: '**{階段|かいだん}を{上|あ}がる／{下|お}りる** (lên / xuống cầu thang) · {階段|かいだん}を{使|つか}う. 階 ({～階|かい} — tầng) + 段 (Bài 18). ～ではなく = "không phải… mà" (văn viết của じゃなくて).' },
        { w: '{運動不足|うんどうぶそく}', pos: 'danh từ', ipa: 'undou busoku', vi: 'thiếu vận động', ex: '{運動不足|うんどうぶそく}にならないように、{週末|しゅうまつ}はテニスをします。', exRo: 'Undou busoku ni naranai you ni, shuumatsu wa tenisu o shimasu.', exVi: 'Để không bị thiếu vận động, cuối tuần tôi chơi tennis.', more: '{運動|うんどう} (Bài 12) + **{不足|ふそく}** (thiếu — N3): {睡眠不足|すいみんぶそく} (thiếu ngủ), {練習不足|れんしゅうぶそく}. ⚠ 不足 đọc **ぶそく** khi ghép (đục). Ví dụ: **N にならないように** (để khỏi trở thành N).' },
        { w: '{気|き}をつけます［{気|き}をつける］2', pos: 'cụm động từ nhóm 2', ipa: 'ki o tsukemasu [ki o tsukeru]', vi: 'chú ý, cẩn thận, giữ gìn', ex: '{風邪|かぜ}をひかないように、{体|からだ}に{気|き}をつけてください。', exRo: 'Kaze o hikanai you ni, karada ni ki o tsukete kudasai.', exVi: 'Hãy giữ gìn sức khoẻ để không bị cảm.', more: '**N に{気|き}をつける** (chú ý N): {車|くるま}に{気|き}をつける · **{体|からだ}に{気|き}をつけて** (giữ sức khoẻ nhé — câu chào khi chia tay). **{食|た}べ{物|もの}に{気|き}をつけるようにしている** (cố chú ý ăn uống). Câu nhắc ngắn: {気|き}をつけて！ (Cẩn thận!).' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Tiền bạc & thay đổi (10 từ) — bốn cặp tự ↔ tha động từ' },
    {
      t: 'vocab',
      items: [
        { w: '{貯金|ちょきん}します［{貯金|ちょきん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'chokin shimasu [chokin suru]', vi: 'gửi tiết kiệm, để dành tiền; tiền tiết kiệm', ex: '{車|くるま}を{買|か}うために、{毎月|まいつき}{二万円|にまんえん}ずつ{貯金|ちょきん}しています。', exRo: 'Kuruma o kau tame ni, maitsuki niman\'en zutsu chokin shite imasu.', exVi: 'Để mua ô tô, mỗi tháng tôi để dành đều 20.000 yên.', more: '**～ために{貯金|ちょきん}する** · {貯金|ちょきん}がある／ない · {貯金箱|ちょきんばこ} (ống heo). Gần nghĩa: お{金|かね}を{貯|た}める (Bài 16 — văn nói). {毎月|まいつき} = mỗi tháng. Chữ **貯** là chữ Hán mới. N3.' },
        { w: '{節約|せつやく}します［{節約|せつやく}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'setsuyaku shimasu [setsuyaku suru]', vi: 'tiết kiệm (chi tiêu, điện, nước)', ex: 'お{金|かね}を{節約|せつやく}するために、{昼|ひる}ご{飯|はん}はお{弁当|べんとう}を{作|つく}ることにしました。', exRo: 'Okane o setsuyaku suru tame ni, hirugohan wa obentou o tsukuru koto ni shimashita.', exVi: 'Để tiết kiệm tiền, tôi quyết định tự làm cơm hộp ăn trưa.', more: '⚠ **{貯金|ちょきん}** (để dành tiền — tích luỹ) ↔ **{節約|せつやく}** (bớt tiêu — không lãng phí). {電気|でんき}／{水|みず}／{時間|じかん}を{節約|せつやく}する. Đối: {無駄|むだ}{遣|づか}い (tiêu hoang — N3). N3.' },
        { w: '{無駄|むだ}（な）', pos: 'tính từ な / danh từ', ipa: 'muda (na)', vi: 'lãng phí, vô ích', ex: '{使|つか}わない{物|もの}を{買|か}うのは、お{金|かね}の{無駄|むだ}です。', exRo: 'Tsukawanai mono o kau no wa, okane no muda desu.', exVi: 'Mua đồ không dùng là phí tiền.', more: '**{時間|じかん}／お{金|かね}の{無駄|むだ}** (phí thời gian / tiền) · {無駄|むだ}な{物|もの} · **{無駄|むだ}にする** (làm phí). {無駄|むだ}{遣|づか}い (tiêu hoang). Chữ 駄 cấp cao — đọc được là đủ. N3.' },
        { w: '{必要|ひつよう}（な）', pos: 'tính từ な / danh từ', ipa: 'hitsuyou (na)', vi: 'cần thiết, cần', ex: '{日本|にほん}の{会社|かいしゃ}で{働|はたら}くためには、N2が{必要|ひつよう}です。', exRo: 'Nihon no kaisha de hataraku tame ni wa, enu-ni ga hitsuyou desu.', exVi: 'Để làm ở công ty Nhật thì cần N2.', more: '**N が{必要|ひつよう}だ** · **～ためには、N が{必要|ひつよう}だ** (để ~ thì cần N — mẫu ① + は) · {必要|ひつよう}な{物|もの} · {必要|ひつよう}ない (không cần). Chữ **必・要** là chữ Hán mới.' },
        { w: '{増|ふ}えます［{増|ふ}える］2', pos: 'động từ nhóm 2 (tự động từ)', ipa: 'fuemasu [fueru]', vi: '(số lượng) tăng lên', ex: '{最近|さいきん}、{日本|にほん}で{働|はたら}く{外国人|がいこくじん}が{増|ふ}えています。', exRo: 'Saikin, Nihon de hataraku gaikokujin ga fuete imasu.', exVi: 'Gần đây người nước ngoài làm việc ở Nhật đang tăng lên.', more: '+ て: {増|ふ}えて. **N が{増|ふ}える** — tự động từ. Dùng cho **số lượng** (người, tiền, cân nặng); điểm / giá thì dùng {上|あ}がる. Chữ **増** là chữ Hán mới.' },
        { w: '{増|ふ}やします［{増|ふ}やす］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'fuyashimasu [fuyasu]', vi: 'làm tăng, tăng thêm', ex: '{会話|かいわ}が{上手|じょうず}になるように、{話|はな}す{時間|じかん}を{増|ふ}やしました。', exRo: 'Kaiwa ga jouzu ni naru you ni, hanasu jikan o fuyashimashita.', exVi: 'Để giỏi hội thoại, tôi đã tăng thời gian nói.', more: '+ て: **{増|ふ}やして**. **N を{増|ふ}やす** — tha động từ. ⚠ Cặp: **が{増|ふ}える** (tự) ↔ **を{増|ふ}やす** (tha). {貯金|ちょきん}を{増|ふ}やす · {練習|れんしゅう}を{増|ふ}やす.' },
        { w: '{減|へ}ります［{減|へ}る］1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'herimasu [heru]', vi: '(số lượng) giảm đi', ex: '{毎日|まいにち}{歩|ある}くようにしたら、{体重|たいじゅう}が{三|さん}キロ{減|へ}りました。', exRo: 'Mainichi aruku you ni shitara, taijuu ga san-kiro herimashita.', exVi: 'Từ khi cố đi bộ mỗi ngày, cân nặng của tôi giảm 3 kg.', more: '+ て: **{減|へ}って**. **N が{減|へ}る** · お{腹|なか}が{減|へ}る (đói bụng — văn nói của お{腹|なか}がすく). ⚠ {減|へ}る là nhóm 1 (へり・ます), dù đuôi る. Chữ **減** là chữ Hán mới.' },
        { w: '{減|へ}らします［{減|へ}らす］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'herashimasu [herasu]', vi: 'làm giảm, cắt giảm', ex: '{健康|けんこう}のために、お{酒|さけ}を{飲|の}む{日|ひ}を{減|へ}らすことにしました。', exRo: 'Kenkou no tame ni, osake o nomu hi o herasu koto ni shimashita.', exVi: 'Vì sức khoẻ, tôi quyết định giảm số ngày uống rượu.', more: '+ て: {減|へ}らして. **N を{減|へ}らす**. ⚠ Cặp: **が{減|へ}る** (tự) ↔ **を{減|へ}らす** (tha). {体重|たいじゅう}を{減|へ}らす · ゲームの{時間|じかん}を{減|へ}らす.' },
        { w: '{変|か}わります［{変|か}わる］1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'kawarimasu [kawaru]', vi: '(cái gì đó) thay đổi, đổi', ex: '{日本|にほん}に{来|き}てから、{生活|せいかつ}が{大|おお}きく{変|か}わりました。', exRo: 'Nihon ni kite kara, seikatsu ga ookiku kawarimashita.', exVi: 'Từ khi sang Nhật, cuộc sống của tôi đã thay đổi lớn.', more: '+ て: **{変|か}わって**. **N が{変|か}わる** · {会議|かいぎ}の{時間|じかん}が{変|か}わる · {考|かんが}え{方|かた}が{変|か}わる. Bài 30 sẽ học ～に{変|か}わって／{代|か}わって (thay cho) — khác chữ.' },
        { w: '{変|か}えます［{変|か}える］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'kaemasu [kaeru]', vi: 'thay đổi, đổi (cái gì)', ex: '{朝|あさ}{起|お}きられるように、{生活|せいかつ}のリズムを{変|か}えました。', exRo: 'Asa okirareru you ni, seikatsu no rizumu o kaemashita.', exVi: 'Để sáng dậy được, tôi đã thay đổi nhịp sinh hoạt.', more: '+ て: {変|か}えて. **N を{変|か}える**. ⚠ Cặp: **が{変|か}わる** (tự) ↔ **を{変|か}える** (tha). ⚠ Đồng âm: {帰|かえ}る (về), {替|か}える／{換|か}える (đổi, thay — N3). リズム = nhịp.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Quyết định & công việc (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{決|き}まります［{決|き}まる］1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'kimarimasu [kimaru]', vi: '(việc gì) được quyết định, đã định', ex: '{会議|かいぎ}で、{旅行|りょこう}の{日|ひ}が{決|き}まりました。', exRo: 'Kaigi de, ryokou no hi ga kimarimashita.', exVi: 'Trong cuộc họp, ngày đi du lịch đã được quyết định.', more: '+ て: **{決|き}まって**. ⚠ Cặp: **N を{決|き}める** (Bài 16 — mình quyết) ↔ **N が{決|き}まる** (được quyết). Đúng y như **ことにする ↔ ことになる** (mẫu ⑤ ⑥)! {就職|しゅうしょく}が{決|き}まる (có việc làm rồi) · {決|き}まっている (đương nhiên — N3).' },
        { w: '{会議|かいぎ}', pos: 'danh từ', ipa: 'kaigi', vi: 'cuộc họp', ex: '{会議|かいぎ}で、{来月|らいげつ}から{新|あたら}しいメニューを{出|だ}すことになりました。', exRo: 'Kaigi de, raigetsu kara atarashii menyuu o dasu koto ni narimashita.', exVi: 'Trong cuộc họp, đã quyết định từ tháng sau ra thực đơn mới.', more: '{会議|かいぎ}がある · {会議|かいぎ}に{出|で}る (dự họp) · {会議室|かいぎしつ} (phòng họp). Quyết định ở cuộc họp = quyết định **chung** → rất hay đi với **～ことになる**.' },
        { w: '{転勤|てんきん}します［{転勤|てんきん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'tenkin shimasu [tenkin suru]', vi: 'chuyển công tác (sang chi nhánh / nơi khác)', ex: '{父|ちち}が{大阪|おおさか}に{転勤|てんきん}することになって、{家族|かぞく}みんなで{引|ひ}っ{越|こ}しました。', exRo: 'Chichi ga Oosaka ni tenkin suru koto ni natte, kazoku minna de hikkoshimashita.', exVi: 'Bố tôi được điều chuyển công tác sang Osaka nên cả nhà đã chuyển đi.', more: '**（{場所|ばしょ}）に{転勤|てんきん}する**. Công ty phân công, không do mình chọn → gần như luôn **～ことになる**. Khác {転職|てんしょく} (đổi nghề, đổi công ty — N2). N3.' },
        { w: '{出張|しゅっちょう}します［{出張|しゅっちょう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'shucchou shimasu [shucchou suru]', vi: 'đi công tác', ex: '{来週|らいしゅう}、{部長|ぶちょう}と{一緒|いっしょ}に{北海道|ほっかいどう}へ{出張|しゅっちょう}することになりました。', exRo: 'Raishuu, buchou to issho ni Hokkaidou e shucchou suru koto ni narimashita.', exVi: 'Tuần sau tôi được cử đi công tác Hokkaido cùng trưởng phòng.', more: '**（{場所|ばしょ}）へ／に{出張|しゅっちょう}する** · {出張中|しゅっちょうちゅう} (đang đi công tác). ⚠ Romaji **shucchou** (っ trước ch → c). {転勤|てんきん}: chuyển hẳn sang nơi khác; {出張|しゅっちょう}: đi vài ngày rồi về.' },
        { w: '{営業|えいぎょう}します［{営業|えいぎょう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'eigyou shimasu [eigyou suru]', vi: '(cửa hàng) mở cửa kinh doanh; kinh doanh', ex: 'このスーパーは{夜|よる}{十一時|じゅういちじ}まで{営業|えいぎょう}しています。', exRo: 'Kono suupaa wa yoru juuichiji made eigyou shite imasu.', exVi: 'Siêu thị này mở cửa đến 11 giờ đêm.', more: 'Biển hay gặp: **{営業中|えいぎょうちゅう}** (đang mở cửa) · **{営業時間|えいぎょうじかん}** (giờ mở cửa). Ở công ty, {営業|えいぎょう} còn là **bộ phận kinh doanh / sales** ({営業部|えいぎょうぶ}). N3.' },
        { w: '{結果|けっか}', pos: 'danh từ', ipa: 'kekka', vi: 'kết quả', ex: '{試験|しけん}の{結果|けっか}は{来月|らいげつ}わかるそうです。', exRo: 'Shiken no kekka wa raigetsu wakaru sou desu.', exVi: 'Nghe nói tháng sau mới biết kết quả thi.', more: '**{結果|けっか}が{出|で}る** (có kết quả) · {結果|けっか}を{発表|はっぴょう}する (Bài 20) · {努力|どりょく}の{結果|けっか} (thành quả của nỗ lực). ⚠ Romaji **kekka** (結 ケツ → けっ). Ví dụ: ～そうです (nghe nói — ポイント 119).' },
        { w: '{方法|ほうほう}', pos: 'danh từ', ipa: 'houhou', vi: 'phương pháp, cách làm', ex: '{漢字|かんじ}を{早|はや}く{覚|おぼ}えるいい{方法|ほうほう}はありませんか。', exRo: 'Kanji o hayaku oboeru ii houhou wa arimasen ka.', exVi: 'Có cách nào hay để nhớ chữ Hán nhanh không?', more: '**～{方法|ほうほう}** (cách để ~): {勉強|べんきょう}の{方法|ほうほう}, やせる{方法|ほうほう}. Văn nói thường dùng **Vます＋{方|かた}** (cách làm — {作|つく}り{方|かた}, {使|つか}い{方|かた}). Trường âm đôi: **hou-hou**.' },
        { w: '{以内|いない}', pos: 'danh từ (hậu tố)', ipa: 'inai', vi: 'trong vòng, không quá', ex: 'レポートは{二千字|にせんじ}{以内|いない}で{書|か}くことになっています。', exRo: 'Repooto wa nisenji inai de kaku koto ni natte imasu.', exVi: 'Theo quy định, báo cáo viết trong vòng 2.000 chữ.', more: '**{数|すう}＋{以内|いない}**: 30{分|ぷん}{以内|いない} (trong vòng 30 phút), {一週間|いっしゅうかん}{以内|いない}に (trong vòng một tuần — có に khi chỉ thời hạn). Khác {以上|いじょう} (từ… trở lên — Bài 12), {以下|いか} (từ… trở xuống — N3).' },
      ],
    },

    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra từ (chạm thẻ để nghe)',
      items: [
        { anh: 'bullseye', w: '{目標|もくひょう}', ro: 'mokuhyou', vi: 'mục tiêu (hình: hồng tâm)' },
        { anh: 'flexed-biceps', w: '{努力|どりょく}します', ro: 'doryoku shimasu', vi: 'nỗ lực (hình: cánh tay gồng)' },
        { anh: 'spiral-notepad', w: '{計画|けいかく}を{立|た}てます', ro: 'keikaku o tatemasu', vi: 'lập kế hoạch (hình: sổ ghi)' },
        { anh: 'books', w: '{復習|ふくしゅう}します', ro: 'fukushuu shimasu', vi: 'ôn bài (hình: chồng sách)' },
        { anh: 'open-book', w: '{予習|よしゅう}します', ro: 'yoshuu shimasu', vi: 'xem bài trước' },
        { anh: 'hundred-points', w: '{点|てん}', ro: 'ten', vi: 'điểm (hình: 100 điểm)' },
        { anh: 'graduation-cap', w: '{受|う}かります', ro: 'ukarimasu', vi: 'thi đỗ (hình: mũ tốt nghiệp)' },
        { anh: 'airplane', w: '{留学|りゅうがく}します', ro: 'ryuugaku shimasu', vi: 'du học (hình: máy bay)' },
        { anh: 'man-running', w: '{健康|けんこう}のために{走|はし}ります', ro: 'kenkou no tame ni hashirimasu', vi: 'chạy bộ vì sức khoẻ' },
        { anh: 'balance-scale', w: '{体重|たいじゅう}', ro: 'taijuu', vi: 'cân nặng (hình: cái cân)' },
        { anh: 'green-salad', w: 'ダイエットします', ro: 'daietto shimasu', vi: 'ăn kiêng (hình: đĩa rau)' },
        { anh: 'sunrise', w: '{早寝早起|はやねはやお}き', ro: 'hayane hayaoki', vi: 'ngủ sớm dậy sớm (hình: bình minh)' },
        { anh: 'sleepy-face', w: '{夜|よ}ふかしします', ro: 'yofukashi shimasu', vi: 'thức khuya (hình: mặt buồn ngủ)' },
        { anh: 'alarm-clock', w: '{目覚|めざ}まし{時計|どけい}', ro: 'mezamashi dokei', vi: 'đồng hồ báo thức' },
        { anh: 'no-smoking', w: '{禁煙|きんえん}', ro: 'kin\'en', vi: 'cấm hút thuốc; bỏ thuốc' },
        { anh: 'person-walking', w: '{階段|かいだん}を{使|つか}います', ro: 'kaidan o tsukaimasu', vi: 'đi cầu thang bộ (hình: người đi bộ)' },
        { anh: 'money-bag', w: '{貯金|ちょきん}します', ro: 'chokin shimasu', vi: 'để dành tiền (hình: túi tiền)' },
        { anh: 'coin', w: '{節約|せつやく}します', ro: 'setsuyaku shimasu', vi: 'tiết kiệm chi tiêu (hình: đồng xu)' },
        { anh: 'chart-increasing', w: '{増|ふ}えます', ro: 'fuemasu', vi: 'tăng lên (hình: biểu đồ đi lên)' },
        { anh: 'chart-decreasing', w: '{減|へ}ります', ro: 'herimasu', vi: 'giảm đi (hình: biểu đồ đi xuống)' },
        { anh: 'briefcase', w: '{出張|しゅっちょう}します', ro: 'shucchou shimasu', vi: 'đi công tác (hình: cặp tài liệu)' },
        { anh: 'office-building', w: '{転勤|てんきん}します', ro: 'tenkin shimasu', vi: 'chuyển công tác (hình: toà văn phòng)' },
        { anh: 'tear-off-calendar', w: '{決|き}まります', ro: 'kimarimasu', vi: '(ngày, việc) được quyết định (hình: tờ lịch)' },
        { anh: 'clipboard', w: '{結果|けっか}', ro: 'kekka', vi: 'kết quả (hình: bảng kẹp giấy)' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ của bài + mẫu hay đi cùng — chuẩn bị cho Ngữ pháp',
      head: ['Từ', 'Ghép với mẫu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{健康|けんこう} (N)', '{健康|けんこう}**のために**', 'kenkou no tame ni', 'vì sức khoẻ (①)'],
        ['{留学|りゅうがく}する (V chủ ý)', '{留学|りゅうがく}する**ために**', 'ryuugaku suru tame ni', 'để du học (①)'],
        ['{受|う}かる (V không chủ ý)', '{受|う}かる**ように**', 'ukaru you ni', 'để đỗ (② — không dùng ために)'],
        ['{続|つづ}ける → {続|つづ}けられる', '{続|つづ}けられる**ように**', 'tsuzukerareru you ni', 'để duy trì được (②)'],
        ['{運動不足|うんどうぶそく} (N)', '{運動不足|うんどうぶそく}に**ならないように**', 'undou busoku ni naranai you ni', 'để khỏi thiếu vận động (②)'],
        ['{減|へ}る (tự) ／ {減|へ}らす (tha)', '{体重|たいじゅう}が{減|へ}る**ように** ／ {体重|たいじゅう}を{減|へ}らす**ために**', 'taijuu ga heru you ni / taijuu o herasu tame ni', 'tự ↔ tha quyết định ように ↔ ために'],
        ['{早寝早起|はやねはやお}き', '{早寝早起|はやねはやお}きする**ようにしている**', 'hayane hayaoki suru you ni shite iru', 'cố ngủ sớm dậy sớm (④)'],
        ['{夜|よ}ふかし', '{夜|よ}ふかし**しなくなった**', 'yofukashi shinaku natta', 'không thức khuya nữa (③)'],
        ['{禁煙|きんえん}する', '{禁煙|きんえん}する**ことにした**', 'kin\'en suru koto ni shita', 'quyết định bỏ thuốc (⑤)'],
        ['{転勤|てんきん}する／{出張|しゅっちょう}する', '{転勤|てんきん}する**ことになった**', 'tenkin suru koto ni natta', 'được điều chuyển (⑥ — công ty quyết)'],
        ['{営業|えいぎょう}する', '{日曜日|にちようび}も{営業|えいぎょう}する**ことにした**', 'nichiyoubi mo eigyou suru koto ni shita', 'quyết định mở cửa Chủ nhật (⑤ — chủ quán quyết)'],
        ['{以内|いない}', '{三日|みっか}{以内|いない}に{払|はら}う**ことになっている**', 'mikka inai ni harau koto ni natte iru', 'theo quy định trả trong vòng 3 ngày (⑥)'],
      ],
    },
    {
      t: 'table',
      caption: 'Bốn cặp tự động từ ↔ tha động từ của bài — が ↔ を',
      head: ['Tự động từ (N が ～)', 'Romaji', 'Tha động từ (N を ～)', 'Romaji', 'Ví dụ cặp'],
      rows: [
        ['{続|つづ}く (1)', 'tsuzuku', '{続|つづ}ける (2)', 'tsuzukeru', '{雨|あめ}が{続|つづ}く ／ {勉強|べんきょう}を{続|つづ}ける'],
        ['{増|ふ}える (2)', 'fueru', '{増|ふ}やす (1)', 'fuyasu', '{客|きゃく}が{増|ふ}える ／ {貯金|ちょきん}を{増|ふ}やす'],
        ['{減|へ}る (1)', 'heru', '{減|へ}らす (1)', 'herasu', '{体重|たいじゅう}が{減|へ}る ／ ゲームの{時間|じかん}を{減|へ}らす'],
        ['{変|か}わる (1)', 'kawaru', '{変|か}える (2)', 'kaeru', '{生活|せいかつ}が{変|か}わる ／ {生活|せいかつ}を{変|か}える'],
        ['{決|き}まる (1)', 'kimaru', '{決|き}める (2 — Bài 16)', 'kimeru', '{日|ひ}が{決|き}まる ／ {日|ひ}を{決|き}める'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo: cặp tự ↔ tha cũng là cặp ことになる ↔ ことにする',
      items: [
        '**Tha động từ (を)** = có người **chủ động** làm: {私|わたし}が{日|ひ}を**{決|き}める** → {私|わたし}が{行|い}く**ことにする**.',
        '**Tự động từ (が)** = việc **tự xảy ra**, không nói ai làm: {日|ひ}が**{決|き}まる** → {行|い}く**ことになる**.',
        'Cùng một logic: **ようにする** (mình cố — chủ động) ↔ **ようになる** (đã thành — kết quả). Học bốn cặp này kỹ là hiểu được cả nửa sau của ngữ pháp bài.',
      ],
    },
    {
      t: 'note',
      title: 'Từ dễ nhầm trong bài',
      items: [
        '**{目標|もくひょう} ↔ {夢|ゆめ} ↔ {計画|けいかく}** — {目標|もくひょう}: **đích cụ thể** cần đạt (N3, giảm 5 kg); {夢|ゆめ}: **ước mơ** lớn, xa (Bài 16); {計画|けいかく}: **kế hoạch** — các bước để đạt mục tiêu. Mục tiêu và kế hoạch đều **{立|た}てる**; ước mơ thì **{持|も}つ／かなえる**.',
        '**{貯金|ちょきん} ↔ {節約|せつやく}** — {貯金|ちょきん}: **để dành, tích** tiền (tiền vào); {節約|せつやく}: **bớt tiêu** (tiền ra ít). {節約|せつやく}して{貯金|ちょきん}する. {節約|せつやく} còn dùng cho điện, nước, thời gian; {貯金|ちょきん} chỉ cho tiền.',
        '**{受|う}ける ↔ {受|う}かる ↔ {合格|ごうかく}する** — {試験|しけん}**を{受|う}ける** (dự thi — Bài 16) → {試験|しけん}**に{受|う}かる** (đỗ — văn nói) = {試験|しけん}**に{合格|ごうかく}する** (trang trọng). Đối: {試験|しけん}に{落|お}ちる (trượt).',
        '**{諦|あきら}める ↔ やめる** — やめる: **thôi, ngừng** (vì bất kỳ lý do gì — たばこをやめる, バイトをやめる); {諦|あきら}める: **từ bỏ vì thấy không đạt được** (có tiếc nuối — {夢|ゆめ}を{諦|あきら}める). "Bỏ thuốc" = たばこを**やめる** ／ {禁煙|きんえん}する, không nói ~~たばこを{諦|あきら}める~~.',
        '**{増|ふ}える ↔ {上|あ}がる** — {増|ふ}える: **số lượng** tăng (người, tiền, cân nặng, số lần); {上|あ}がる: **mức** tăng (điểm, giá, nhiệt độ, trình độ). {成績|せいせき}が**{上|あ}がる** (không phải ~~{増|ふ}える~~), {給料|きゅうりょう}が{上|あ}がる; {貯金|ちょきん}が**{増|ふ}える**.',
        '**{転勤|てんきん} ↔ {出張|しゅっちょう}** — {転勤|てんきん}: chuyển **hẳn** sang làm ở nơi khác (thường kéo theo chuyển nhà); {出張|しゅっちょう}: đi **vài ngày** vì công việc rồi về.',
        '**{方法|ほうほう} ↔ Vます＋{方|かた}** — {方法|ほうほう}: phương pháp (trang trọng, có thể đứng sau cả câu: {早|はや}く{覚|おぼ}える{方法|ほうほう}); {方|かた}: cách làm một động tác cụ thể ({覚|おぼ}え{方|かた}, {作|つく}り{方|かた}) — văn nói.',
        '**なるべく ↔ できるだけ ↔ {必|かなら}ず** — なるべく ≈ できるだけ (cố hết mức có thể — mềm, có thể không làm được); {必|かなら}ず (Bài 16) = nhất định (100%). Cố gắng thói quen → **なるべく～ようにする**; quy tắc tuyệt đối → **{必|かなら}ず～ことにしている**.',
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '{目標|もくひょう}**を{立|た}てる** · {計画|けいかく}**を{立|た}てる** · {毎日|まいにち}**{努力|どりょく}する** · {勉強|べんきょう}**を{続|つづ}ける** · {雨|あめ}**が{続|つづ}く** · {夢|ゆめ}**を{諦|あきら}める** · **{途中|とちゅう}で**{諦|あきら}める · {甘|あま}いもの**を{我慢|がまん}する** · N2**にチャレンジする** · **{少|すこ}しずつ**{上手|じょうず}になる · **なるべく**～ようにする',
        '{習|なら}ったこと**を{復習|ふくしゅう}する** · {新|あたら}しい{課|か}**を{予習|よしゅう}しておく** · {単語|たんご}**を{覚|おぼ}える** · {文法|ぶんぽう}**の{問題|もんだい}** · {発音|はつおん}**を{直|なお}す** · {成績|せいせき}**が{上|あ}がる** · 80{点|てん}**を{取|と}る** · {試験|しけん}**に{受|う}かる** · {問題集|もんだいしゅう}**を{最後|さいご}までやる** · {日本|にほん}**に{留学|りゅうがく}する**',
        '{健康|けんこう}**のために** · {体重|たいじゅう}**が{減|へ}る／{増|ふ}える** · ダイエット**{中|ちゅう}** · {早寝早起|はやねはやお}き**する** · {夜|よ}ふかし**して{寝坊|ねぼう}する** · {目覚|めざ}まし{時計|どけい}**をかける** · たばこ**をやめる** ／ {禁煙|きんえん}**する** · {階段|かいだん}**を{上|あ}がる** · {運動不足|うんどうぶそく}**にならないように** · {体|からだ}**に{気|き}をつける**',
        '**{毎月|まいつき}～ずつ**{貯金|ちょきん}する · {電気|でんき}**を{節約|せつやく}する** · {時間|じかん}**の{無駄|むだ}** · N2**が{必要|ひつよう}だ** · {客|きゃく}**が{増|ふ}える** · {練習|れんしゅう}**を{増|ふ}やす** · {体重|たいじゅう}**が{減|へ}る** · お{酒|さけ}**を{減|へ}らす** · {生活|せいかつ}**が{変|か}わる** · リズム**を{変|か}える**',
        '{日|ひ}**が{決|き}まる** · {会議|かいぎ}**で{決|き}まる** · {大阪|おおさか}**に{転勤|てんきん}することになる** · {北海道|ほっかいどう}**へ{出張|しゅっちょう}する** · {夜|よる}11{時|じ}**まで{営業|えいぎょう}する** · {結果|けっか}**が{出|で}る** · いい{方法|ほうほう}**がある** · 30{分|ぷん}**{以内|いない}に**',
      ],
    },
    {
      t: 'write',
      id: 'b21-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['目標', '努力', '健康', '貯金', '続ける', '必要', '成績', '合格', '復習', '増える'],
      goi: {
        '目標': 'もくひょう · mục tiêu',
        '努力': 'どりょく · nỗ lực',
        '健康': 'けんこう · sức khoẻ',
        '貯金': 'ちょきん · để dành tiền',
        '続ける': 'つづける · tiếp tục',
        '必要': 'ひつよう · cần thiết',
        '成績': 'せいせき · thành tích, điểm',
        '合格': 'ごうかく · đỗ',
        '復習': 'ふくしゅう · ôn tập',
        '増える': 'ふえる · tăng lên',
      },
    },
    {
      t: 'mcq',
      id: 'b21-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 14 câu (dạng 文脈規定・言い換え類義・用法 của đề N4)',
      items: [
        { q: '{今年|ことし}の（　）は、{毎日|まいにち}{日本語|にほんご}の{日記|にっき}を{書|か}くことです。', options: ['{目標|もくひょう}', '{結果|けっか}', '{方法|ほうほう}', '{会議|かいぎ}'], correct: 0, why: 'Điều muốn đạt được trong năm = **{目標|もくひょう}**. 〔Kotoshi no mokuhyou wa…〕' },
        { q: '{夏休|なつやす}みの{前|まえ}に、{勉強|べんきょう}の{計画|けいかく}を（　）。', options: ['{立|た}てました', '{作|つく}りました', '{続|つづ}きました', '{決|き}まりました'], correct: 0, why: 'Lập kế hoạch = **{計画|けいかく}を{立|た}てる** (cụm cố định). {決|き}まる là tự động từ — không đi với を. 〔Keikaku o tatemashita.〕' },
        { q: 'ダイエットを{始|はじ}めましたが、{三日|みっか}しか（　）。', options: ['{続|つづ}けませんでした', '{続|つづ}きませんでした', '{諦|あきら}めませんでした', '{我慢|がまん}しませんでした'], correct: 1, why: 'Chủ ngữ là việc ăn kiêng (không có を) → tự động từ **{続|つづ}く**: chỉ duy trì được 3 ngày. 〔Mikka shika tsuzukimasen deshita.〕' },
        { q: '{毎日|まいにち}{復習|ふくしゅう}したので、{成績|せいせき}が（　）。', options: ['{増|ふ}えました', '{上|あ}がりました', '{増|ふ}やしました', '{変|か}えました'], correct: 1, why: 'Điểm số tăng = **{成績|せいせき}が{上|あ}がる**. {増|ふ}える dùng cho số lượng. 〔Seiseki ga agarimashita.〕' },
        { q: '{最近|さいきん}、この{町|まち}に{住|す}む{外国人|がいこくじん}が（　）います。', options: ['{増|ふ}やして', '{増|ふ}えて', '{上|あ}げて', '{変|か}えて'], correct: 1, why: 'Số người tăng, chủ ngữ + が → tự động từ **{増|ふ}える**. 〔Gaikokujin ga fuete imasu.〕' },
        { q: '{健康|けんこう}のために、たばこを（　）ことにしました。', options: ['{諦|あきら}める', 'やめる', '{減|へ}る', '{我慢|がまん}できる'], correct: 1, why: 'Bỏ thuốc = **たばこをやめる** (hoặc {禁煙|きんえん}する). {諦|あきら}める là "từ bỏ vì không đạt được". {減|へ}る là tự động từ — không đi với を. 〔Tabako o yameru koto ni shimashita.〕' },
        { q: '{車|くるま}を{買|か}うために、{毎月|まいつき}{三万円|さんまんえん}ずつ（　）しています。', options: ['{節約|せつやく}', '{貯金|ちょきん}', '{営業|えいぎょう}', '{出張|しゅっちょう}'], correct: 1, why: 'Để dành tiền mỗi tháng đều 30.000 yên = **{貯金|ちょきん}**. 〔Maitsuki sanman\'en zutsu chokin shite imasu.〕' },
        { q: '{父|ちち}は{来月|らいげつ}から{福岡|ふくおか}の{会社|かいしゃ}で{働|はたら}くことになりました。（　）するんです。', options: ['{出張|しゅっちょう}', '{転勤|てんきん}', '{留学|りゅうがく}', '{営業|えいぎょう}'], correct: 1, why: 'Chuyển hẳn sang làm ở nơi khác = **{転勤|てんきん}**. {出張|しゅっちょう} chỉ đi vài ngày. 〔Tenkin suru n desu.〕' },
        { q: 'あのスーパーは{夜|よる}{十時|じゅうじ}まで（　）しています。', options: ['{営業|えいぎょう}', '{努力|どりょく}', '{節約|せつやく}', '{転勤|てんきん}'], correct: 0, why: 'Cửa hàng mở cửa đến 10 giờ = **{営業|えいぎょう}する**. 〔Juuji made eigyou shite imasu.〕' },
        { q: '{答|こた}えは{百字|ひゃくじ}（　）で{書|か}いてください。', options: ['{以内|いない}', '{以上|いじょう}', 'ずつ', 'なるべく'], correct: 0, why: '"Trong vòng 100 chữ" = **{百字|ひゃくじ}{以内|いない}**. 〔Hyakuji inai de kaite kudasai.〕' },
        { q: '「なるべく{早|はや}く{来|き}てください。」と{意味|いみ}が{近|ちか}いのは？', options: ['{必|かなら}ず{早|はや}く{来|き}てください。', 'できるだけ{早|はや}く{来|き}てください。', 'ゆっくり{来|き}てください。', '{少|すこ}しずつ{来|き}てください。'], correct: 1, why: '**なるべく ≈ できるだけ** (cố hết mức có thể). {必|かなら}ず = nhất định (mạnh hơn). (dạng 言い換え類義)' },
        { q: '「{試験|しけん}に{受|う}かりました。」と{意味|いみ}が{近|ちか}いのは？', options: ['{試験|しけん}を{受|う}けました。', '{試験|しけん}に{合格|ごうかく}しました。', '{試験|しけん}に{落|お}ちました。', '{試験|しけん}の{勉強|べんきょう}をしました。'], correct: 1, why: '{受|う}かる = **{合格|ごうかく}する** (đỗ). {受|う}ける = dự thi — bẫy cùng chữ 受! (dạng 言い換え類義)' },
        { q: '「{我慢|がまん}する」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['ダイエット{中|ちゅう}なので、{甘|あま}いものを{我慢|がまん}しています。', '{明日|あした}、{友達|ともだち}と{我慢|がまん}します。', '{毎朝|まいあさ}、{単語|たんご}を{我慢|がまん}します。', 'お{金|かね}を{銀行|ぎんこう}に{我慢|がまん}しました。'], correct: 0, why: '**N を{我慢|がまん}する** = nhịn cái mình muốn (đồ ngọt khi ăn kiêng). (dạng 用法)' },
        { q: '「{決|き}まる」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{私|わたし}は{旅行|りょこう}の{日|ひ}を{決|き}まりました。', '{会議|かいぎ}で、{次|つぎ}のイベントの{場所|ばしょ}が{決|き}まりました。', '{明日|あした}、{友達|ともだち}を{決|き}まります。', '{目標|もくひょう}を{決|き}まってください。'], correct: 1, why: '{決|き}まる là **tự động từ: N が{決|き}まる** (được quyết định). Mình quyết → {決|き}める (を). (dạng 用法)' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b21-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N4 — ～ために, ～ように, ～ようになる, ～ようにする, ～ことにする, ～ことになる',
  goal: 'Nói mục đích bằng ～ために (V chủ ý, N の — cùng một người làm) và ～ように (V khả năng / không chủ ý, Vない — được khác chủ ngữ; ～ますように cầu mong); kể thay đổi bằng ～ようになる (phủ định ～なくなる) và nỗ lực, thói quen bằng ～ようにする・ようにしている・ようにしてください; báo quyết định của mình bằng ～ことにする・ことにした・ことにしている và việc được quyết định / quy định bằng ～ことになる・ことになった・ことになっている — phân biệt chắc ba cặp ために↔ように, ようになる↔ようにする, ことにする↔ことになる như đề N4 hay hỏi.',
  minutes: 120,
  blocks: [
    {
      t: 'p',
      text: 'Bài 21 có **ba cặp mẫu**, và đề N4 hầu như luôn hỏi theo **cặp**: cho hai lựa chọn gần giống nhau rồi bắt chọn một. Mỗi câu hãy tự hỏi: **(1) Câu nói về MỤC ĐÍCH, THAY ĐỔI hay QUYẾT ĐỊNH?** — mục đích → ために／ように; thay đổi, nỗ lực → ようになる／ようにする; quyết định → ことにする／ことになる. **(2) Ai làm chủ?** — người nói **chủ động** (ために, ようにする, ことにする) hay **tự xảy ra / người khác quyết** (ように, ようになる, ことになる). Mẹo vàng: mẫu có **する** = mình chủ động; mẫu có **なる** = tự thành, không do mình — y như cặp {決|き}める ↔ {決|き}まる ở mục Từ vựng.',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 21',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', 'V{辞書形|じしょけい}／N の ＋ ために', 'để (mục đích có chủ ý) · vì (lợi ích của) N', '{留学|りゅうがく}するために、{貯金|ちょきん}する。', 'N4'],
        ['②', 'V{辞書形|じしょけい}（khả năng・không chủ ý）／Vない ＋ ように', 'để có thể…, để khỏi…', '{忘|わす}れないように、メモする。', 'N4'],
        ['②′', 'Vます ＋ ように', 'cầu mong, cầu chúc', '{合格|ごうかく}できますように。', 'N4'],
        ['③', 'V{辞書形|じしょけい}／V{可能形|かのうけい} ＋ ようになる', 'trở nên (làm được), bắt đầu (có thói quen)', '{泳|およ}げるようになった。', 'N4'],
        ['④', 'V{辞書形|じしょけい}／Vない ＋ ようにする', 'cố gắng (làm / không làm), tạo thói quen', '{野菜|やさい}を{食|た}べるようにしている。', 'N4'],
        ['⑤', 'V{辞書形|じしょけい}／Vない ＋ ことにする', '(tự) quyết định · ことにしている: đặt lệ cho mình', 'たばこをやめることにした。', 'N4'],
        ['⑥', 'V{辞書形|じしょけい}／Vない ＋ ことになる', '(được) quyết định · ことになっている: theo quy định', '{転勤|てんきん}することになった。', 'N4'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG NỐI — cả bài chỉ dùng V{辞書形|じしょけい} và Vない (không dùng thể た, không dùng thể ます — trừ ②′)',
      head: ['Mẫu', 'V khẳng định', 'V phủ định', 'Danh từ'],
      rows: [
        ['① ために', '{行|い}く**ために** · {留学|りゅうがく}する**ために**', '✗ (mục đích phủ định → dùng ように)', '{健康|けんこう}**のために** · {家族|かぞく}**のために**'],
        ['② ように', '{話|はな}せる**ように** · わかる**ように** · {見|み}える**ように**', '{忘|わす}れない**ように** · {遅|おく}れない**ように**', '✗ (N のように = "như N" — Bài 20)'],
        ['③ ようになる', '{話|はな}せる**ようになる** · {飲|の}む**ようになる**', '{話|はな}せ**なくなる** · {飲|の}ま**なくなる**', '✗ → N **になる** (ポイント 95)'],
        ['④ ようにする', '{歩|ある}く**ようにする** · {入|はい}れる**ようにする**', '{食|た}べない**ようにする**', '✗'],
        ['⑤ ことにする', '{行|い}く**ことにする**', '{行|い}かない**ことにする**', '(N **にする** = chọn N: コーヒーにします)'],
        ['⑥ ことになる', '{行|い}く**ことになる**', '{行|い}かない**ことになる**', '(N **になる** = trở thành N)'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bảng nối',
      items: [
        '**Trước sáu mẫu luôn là V{辞書形|じしょけい} (thể từ điển) hoặc Vない** — {行|い}く・{行|い}かない, {食|た}べる・{食|た}べない, する・しない, {来|く}る・{来|こ}ない. Không bao giờ ~~{行|い}ったために~~, ~~{行|い}きますように~~ (trừ câu cầu mong ②′).',
        '**Thì của câu nằm ở CUỐI**: ～ことに**した** (đã quyết), ～ように**なった** (đã thay đổi), ～ように**している** (đang cố), ～ことに**なっている** (đang là quy định). Phần trước ために／ように／こと không đổi thì.',
        '**Chỉ ために nhận danh từ** (N **の**ために). Bốn mẫu ③–⑥ muốn dùng với danh từ thì đổi sang **N にする／N になる** (chọn N / trở thành N).',
        '**Mẫu có する = mình chủ động · mẫu có なる = tự thành / người khác quyết.** ために (chủ động) ↔ ように (tạo điều kiện); ようにする (cố) ↔ ようになる (đã thành); ことにする (mình quyết) ↔ ことになる (được quyết).',
      ],
    },

    /* ══════ ① ～ために ══════ */
    { t: 'h', text: '① V{辞書形|じしょけい}／N の ＋ ために — "để (đạt mục tiêu)" · "vì (lợi ích của) N"' },
    {
      t: 'p',
      text: '**～ために** nói **mục đích** của hành động ở vế sau: "làm B **để** đạt A". Hai điều kiện để dùng đúng: **(1)** vế trước là **việc người nói chủ động làm được** — {買|か}う, {行|い}く, {留学|りゅうがく}する, {働|はたら}く, {減|へ}らす, {続|つづ}ける (động từ **chủ ý** 意志動詞); **(2)** **cùng một người** làm cả hai vế ({私|わたし}が{留学|りゅうがく}する — {私|わたし}が{貯金|ちょきん}する). Với **danh từ**, ために còn có nghĩa thứ hai: **"vì (lợi ích của)"** — {家族|かぞく}のために{働|はたら}く (làm việc vì gia đình). ⚠ **ため** còn một nghĩa **nguyên nhân** ("vì… nên") — học ở Bài 27; ở Bài 21 chỉ học nghĩa **mục đích**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ために',
      head: ['Loại', 'Cách nối', 'Ví dụ', 'Romaji'],
      rows: [
        ['V (chủ ý)', 'V{辞書形|じしょけい} ＋ ために', '{買|か}う → {買|か}う**ために** · {留学|りゅうがく}する → {留学|りゅうがく}する**ために** · {続|つづ}ける → {続|つづ}ける**ために**', 'kau tame ni · ryuugaku suru tame ni · tsuzukeru tame ni'],
        ['N', 'N ＋ の ＋ ために', '{健康|けんこう} → {健康|けんこう}**のために** · {試験|しけん} → {試験|しけん}**のために** · {家族|かぞく} → {家族|かぞく}**のために**', 'kenkou no tame ni · shiken no tame ni · kazoku no tame ni'],
        ['Bổ nghĩa N', '～ための ＋ N', '{留学生|りゅうがくせい}**のための**{教室|きょうしつ} · {健康|けんこう}**のための**{運動|うんどう}', 'ryuugakusei no tame no kyoushitsu'],
        ['Nhấn mạnh điều kiện', '～ためには、N が{必要|ひつよう}だ／～ことが{大切|たいせつ}だ', '{大学院|だいがくいん}に{入|はい}る**ためには**、N2が{必要|ひつよう}です', 'daigakuin ni hairu tame ni wa, enu-ni ga hitsuyou desu'],
        ['✗', 'Vない ＋ ために (mục đích)', '~~{忘|わす}れないために~~ → {忘|わす}れない**ように** (mẫu ②)', '—'],
        ['✗', 'V khả năng / không chủ ý ＋ ために', '~~{話|はな}せるために~~ → {話|はな}せる**ように** (mẫu ②)', '—'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{辞書形|じしょけい} ＋ ために、～ — "để V, (tôi) làm ~"',
          vi: 'Mục tiêu (vế trước) + việc mình làm để đạt nó (vế sau). Vế trước là việc **mình quyết làm được**. Câu hỏi: **{何|なん}のために～んですか** — "Bạn ~ để làm gì?"',
          examples: [
            E('{日本|にほん}に{留学|りゅうがく}するために、{毎月|まいつき}{貯金|ちょきん}しています。', 'Nihon ni ryuugaku suru tame ni, maitsuki chokin shite imasu.', 'Để du học Nhật, tháng nào tôi cũng để dành tiền.'),
            E('{新|あたら}しいパソコンを{買|か}うために、アルバイトを{増|ふ}やしました。', 'Atarashii pasokon o kau tame ni, arubaito o fuyashimashita.', 'Để mua máy tính mới, tôi đã tăng giờ làm thêm.'),
            E('{日本|にほん}の{会社|かいしゃ}で{働|はたら}くために、ビジネスマナーを{勉強|べんきょう}しています。', 'Nihon no kaisha de hataraku tame ni, bijinesu manaa o benkyou shite imasu.', 'Để làm ở công ty Nhật, tôi đang học phép lịch sự trong kinh doanh.'),
            E('{体重|たいじゅう}を{減|へ}らすために、{毎晩|まいばん}{一時間|いちじかん}{歩|ある}いています。', 'Taijuu o herasu tame ni, maiban ichijikan aruite imasu.', 'Để giảm cân, tối nào tôi cũng đi bộ một tiếng.'),
            E('{将来|しょうらい}{国|くに}でレストランを{開|ひら}くために、{料理|りょうり}の{勉強|べんきょう}を{続|つづ}けています。', 'Shourai kuni de resutoran o hiraku tame ni, ryouri no benkyou o tsuzukete imasu.', 'Để sau này mở nhà hàng ở quê nhà, tôi đang tiếp tục học nấu ăn.'),
            E('{試験|しけん}の{申|もう}し{込|こ}みをするために、{写真|しゃしん}を{撮|と}りに{行|い}きました。', 'Shiken no moushikomi o suru tame ni, shashin o tori ni ikimashita.', 'Để đăng ký thi, tôi đã đi chụp ảnh. (～に{行|い}く — ôn ポイント 42)'),
            E('{友達|ともだち}の{誕生日|たんじょうび}パーティーをするために、{部屋|へや}を{片付|かたづ}けておきました。', 'Tomodachi no tanjoubi paatii o suru tame ni, heya o katazukete okimashita.', 'Để tổ chức tiệc sinh nhật cho bạn, tôi đã dọn phòng sẵn. (～ておく — ôn Bài 18)'),
          ],
        },
        {
          formula: 'N ＋ の ＋ ために — "vì N, cho N" (mục đích · lợi ích)',
          vi: 'Hai nghĩa: **mục đích** ({健康|けんこう}のために = để có sức khoẻ, {試験|しけん}のために = để thi) và **vì lợi ích của ai** ({家族|かぞく}のために = vì gia đình). Đứng trước danh từ: **N のための N** (dành cho N).',
          examples: [
            E('{健康|けんこう}のために、{野菜|やさい}をたくさん{食|た}べています。', 'Kenkou no tame ni, yasai o takusan tabete imasu.', 'Vì sức khoẻ, tôi ăn nhiều rau.'),
            E('{試験|しけん}のために、{毎晩|まいばん}{遅|おそ}くまで{勉強|べんきょう}しています。', 'Shiken no tame ni, maiban osoku made benkyou shite imasu.', 'Để thi, tối nào tôi cũng học đến khuya.'),
            E('{旅行|りょこう}のために、{新|あたら}しいかばんを{買|か}いました。', 'Ryokou no tame ni, atarashii kaban o kaimashita.', 'Để đi du lịch, tôi đã mua cái túi mới.'),
            E('{兄|あに}は{家族|かぞく}のために、{一生懸命|いっしょうけんめい}{働|はたら}いています。', 'Ani wa kazoku no tame ni, isshoukenmei hataraite imasu.', 'Anh tôi làm việc chăm chỉ vì gia đình.'),
            E('{子|こ}どもたちのために、{公園|こうえん}をきれいにしましょう。', 'Kodomotachi no tame ni, kouen o kirei ni shimashou.', 'Hãy làm sạch công viên vì bọn trẻ.'),
            E('これは{留学生|りゅうがくせい}のための{日本語|にほんご}{教室|きょうしつ}です。', 'Kore wa ryuugakusei no tame no nihongo kyoushitsu desu.', 'Đây là lớp tiếng Nhật dành cho du học sinh.'),
          ],
        },
        {
          formula: '～ためには、N が{必要|ひつよう}です／～ことが{大切|たいせつ}です — "muốn ~ thì cần…"',
          vi: '**ためには** (thêm は) nêu **điều kiện cần** để đạt mục tiêu: vế sau thường là **{必要|ひつよう}だ／{大切|たいせつ}だ／～なければならない／～たほうがいい**. Rất hay gặp trong bài đọc và khi xin lời khuyên.',
          examples: [
            E('{日本|にほん}の{大学院|だいがくいん}に{入|はい}るためには、N2が{必要|ひつよう}です。', 'Nihon no daigakuin ni hairu tame ni wa, enu-ni ga hitsuyou desu.', 'Muốn vào cao học ở Nhật thì cần N2.'),
            E('{毎日|まいにち}{続|つづ}けるためには、{楽|たの}しい{方法|ほうほう}を{見|み}つけることが{大切|たいせつ}です。', 'Mainichi tsuzukeru tame ni wa, tanoshii houhou o mitsukeru koto ga taisetsu desu.', 'Muốn duy trì mỗi ngày thì điều quan trọng là tìm được cách làm vui.'),
            E('ビザを{取|と}るためには、どんな{書類|しょるい}が{必要|ひつよう}ですか。', 'Biza o toru tame ni wa, donna shorui ga hitsuyou desu ka.', 'Muốn lấy visa thì cần giấy tờ gì?'),
            E('{朝|あさ}{六時|ろくじ}に{起|お}きるためには、{何時|なんじ}に{寝|ね}ればいいですか。', 'Asa rokuji ni okiru tame ni wa, nanji ni nereba ii desu ka.', 'Muốn dậy lúc 6 giờ sáng thì nên ngủ lúc mấy giờ? (～ばいい — ôn Bài 17)'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ために',
      lines: [
        { who: 'アンナ', role: 'a', text: 'ダニエルさん、{最近|さいきん}{毎日|まいにち}アルバイトしているね。{何|なん}のために、そんなに{働|はたら}いているの？', ro: 'Danieru-san, saikin mainichi arubaito shite iru ne. Nan no tame ni, sonna ni hataraite iru no?', vi: 'Daniel, dạo này ngày nào cậu cũng đi làm thêm nhỉ. Làm nhiều thế để làm gì vậy?' },
        { who: 'ダニエル', role: 'b', text: '{来年|らいねん}の{夏|なつ}、{北海道|ほっかいどう}を{自転車|じてんしゃ}で{旅行|りょこう}するために、お{金|かね}を{貯|た}めているんだ。', ro: 'Rainen no natsu, Hokkaidou o jitensha de ryokou suru tame ni, okane o tamete iru n da.', vi: 'Để hè năm sau đạp xe du lịch Hokkaido, mình đang tích tiền.' },
        { who: 'アンナ', role: 'a', text: 'すごい！じゃ、{体力|たいりょく}も{必要|ひつよう}だね。', ro: 'Sugoi! Ja, tairyoku mo hitsuyou da ne.', vi: 'Giỏi quá! Thế thì cũng cần thể lực nhỉ.' },
        { who: 'ダニエル', role: 'b', text: 'うん。だから、{体力|たいりょく}をつけるために、{週末|しゅうまつ}は{長|なが}い{距離|きょり}を{走|はし}っているよ。', ro: 'Un. Dakara, tairyoku o tsukeru tame ni, shuumatsu wa nagai kyori o hashitte iru yo.', vi: 'Ừ. Vì vậy, để tăng thể lực, cuối tuần mình chạy đường dài.' },
        { who: 'アンナ', role: 'a', text: '{北海道|ほっかいどう}を{走|はし}るためには、{自転車|じてんしゃ}も{新|あたら}しいのが{必要|ひつよう}？', ro: 'Hokkaidou o hashiru tame ni wa, jitensha mo atarashii no ga hitsuyou?', vi: 'Muốn đạp xe ở Hokkaido thì cũng cần xe mới à?' },
        { who: 'ダニエル', role: 'b', text: 'ううん、{今|いま}のでいい。その{代|か}わり、{旅行|りょこう}のために、いいテントを{買|か}うつもり。', ro: 'Uun, ima no de ii. Sono kawari, ryokou no tame ni, ii tento o kau tsumori.', vi: 'Không, xe bây giờ là được. Bù lại, mình định mua một cái lều tốt cho chuyến đi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mục tiêu ＋ ために ＋ việc làm',
      head: ['Mục tiêu (V chủ ý / N)', 'Việc làm', 'Câu', 'Romaji'],
      rows: [
        ['{車|くるま}を{買|か}う', '{貯金|ちょきん}する', '{車|くるま}を{買|か}うために、{貯金|ちょきん}しています。', 'Kuruma o kau tame ni, chokin shite imasu.'],
        ['{日本|にほん}で{働|はたら}く', 'N2を{受|う}ける', '{日本|にほん}で{働|はたら}くために、N2を{受|う}けます。', 'Nihon de hataraku tame ni, enu-ni o ukemasu.'],
        ['{健康|けんこう}', '{毎朝|まいあさ}{走|はし}る', '{健康|けんこう}のために、{毎朝|まいあさ}{走|はし}っています。', 'Kenkou no tame ni, maiasa hashitte imasu.'],
        ['{試験|しけん}', '{問題集|もんだいしゅう}をやる', '{試験|しけん}のために、{問題集|もんだいしゅう}をやっています。', 'Shiken no tame ni, mondaishuu o yatte imasu.'],
        ['{留学|りゅうがく}する', '{英語|えいご}も{勉強|べんきょう}する', '{留学|りゅうがく}するために、{英語|えいご}も{勉強|べんきょう}しています。', 'Ryuugaku suru tame ni, eigo mo benkyou shite imasu.'],
        ['{家族|かぞく}', '{一生懸命|いっしょうけんめい}{働|はたら}く', '{家族|かぞく}のために、{一生懸命|いっしょうけんめい}{働|はたら}きます。', 'Kazoku no tame ni, isshoukenmei hatarakimasu.'],
        ['{体重|たいじゅう}を{減|へ}らす', '{甘|あま}いものを{我慢|がまん}する', '{体重|たいじゅう}を{減|へ}らすために、{甘|あま}いものを{我慢|がまん}しています。', 'Taijuu o herasu tame ni, amai mono o gaman shite imasu.'],
        ['{店|みせ}を{開|ひら}く', '{料理|りょうり}を{習|なら}う', '{店|みせ}を{開|ひら}くために、{料理|りょうり}を{習|なら}っています。', 'Mise o hiraku tame ni, ryouri o naratte imasu.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ために (sai → đúng)',
      items: [
        '~~{日本語|にほんご}が{話|はな}せるために、{練習|れんしゅう}します~~ → **{話|はな}せるように** — thể khả năng không phải việc mình "ra lệnh" được → ように (mẫu ②).',
        '~~{忘|わす}れないために、メモします~~ → **{忘|わす}れないように** — mục đích phủ định dùng ように. (～ないために là **nguyên nhân** "vì không…" — Bài 27.)',
        '~~{健康|けんこう}ために~~ → **{健康|けんこう}のために** — danh từ phải có **の**.',
        '~~{子|こ}どもが{寝|ね}るために、{静|しず}かにします~~ → **{子|こ}どもが{寝|ね}られるように** — hai vế **khác chủ ngữ** (con ngủ, tôi giữ yên lặng) → ように.',
        '**ために ↔ のに (Bài 19)** — Vる**のに** chỉ đi với {使|つか}う, {便利|べんり}, {必要|ひつよう}, かかる, いい ("dùng để / để làm thì…"): この{箱|はこ}は{本|ほん}を{入|い}れるのに{便利|べんり}です. ために dùng được với **mọi việc làm**: {本|ほん}を{入|い}れるために、{箱|はこ}を{買|か}いました.',
        '**ために ↔ Vます＋に{行|い}く (ポイント 42)** — ～に{行|い}く／{来|く}る chỉ dùng với động từ di chuyển và mục đích **ngắn, ngay lúc đó** (パンを{買|か}いに{行|い}く). ために dùng cho mục tiêu **lớn, xa**: {留学|りゅうがく}するために{日本|にほん}へ{来|き}ました.',
        '**Động từ "nửa chủ ý"** — {合格|ごうかく}する, やせる, {上手|じょうず}になる: kết quả không hoàn toàn do mình. Người Nhật nói được cả {合格|ごうかく}するために／{合格|ごうかく}できるように. Khi làm đề, chọn theo luật: lựa chọn có **thể khả năng** → ように. Riêng **N (nghề nghiệp) になる** ({医者|いしゃ}になる, {先生|せんせい}になる) là mục tiêu mình chủ động theo đuổi → người Nhật nói **～になるために** rất tự nhiên ({医者|いしゃ}になるために{勉強|べんきょう}している); còn {元気|げんき}になる, {上手|じょうず}になる (không tự quyết được) → **～ように**.',
      ],
    },
    { t: 'rule', formula: 'V{辞書形|じしょけい}（chủ ý）／N の ＋ ために、～： để (đạt mục tiêu) · vì (lợi ích của) N', vi: 'Vế trước là việc người nói chủ động làm được, cùng một người làm hai vế. Không dùng với Vない, thể khả năng, わかる・見える・なる (→ ように). ～ためには + 必要／大切 = muốn… thì cần…' },

    /* ══════ ② ～ように ══════ */
    { t: 'h', text: '② V{辞書形|じしょけい}（khả năng・không chủ ý）／Vない ＋ ように — "để có thể…" · "để khỏi…"' },
    {
      t: 'p',
      text: '**～ように** cũng nói **mục đích**, nhưng mục đích là **một trạng thái / một khả năng** mà mình **không ra lệnh trực tiếp** được, chỉ **tạo điều kiện** cho nó xảy ra: **đọc được** ({読|よ}めるように), **hiểu được** (わかるように), **nghe thấy** ({聞|き}こえるように), **nhìn thấy** ({見|み}えるように), **trở nên** ({元気|げんき}になるように), và **không xảy ra** ({忘|わす}れないように, {遅|おく}れないように). Vì không cần "mình tự làm", **hai vế được khác chủ ngữ**: **{子|こ}どもにもわかるように、（{私|わたし}が）やさしく{説明|せつめい}する**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ように — mục đích',
      head: ['Loại V đứng trước', 'Ví dụ', 'Romaji', 'Nghĩa'],
      rows: [
        ['Thể khả năng (Bài 16)', '{読|よ}める**ように** · {話|はな}せる**ように** · {起|お}きられる**ように** · できる**ように**', 'yomeru you ni · hanaseru you ni · okirareru you ni · dekiru you ni', 'để đọc / nói / dậy / làm được'],
        ['Động từ "tự đến" (không chủ ý)', 'わかる**ように** · {見|み}える**ように** · {聞|き}こえる**ように** · なる**ように**', 'wakaru you ni · mieru you ni · kikoeru you ni · naru you ni', 'để hiểu / thấy / nghe thấy / trở nên'],
        ['Vない', '{忘|わす}れない**ように** · {遅|おく}れない**ように** · {風邪|かぜ}をひかない**ように**', 'wasurenai you ni · okurenai you ni · kaze o hikanai you ni', 'để khỏi quên / muộn / bị cảm'],
        ['Chủ ngữ khác', '{子|こ}ども**が**{寝|ね}られる**ように** · {後|うし}ろの{人|ひと}**にも**{聞|き}こえる**ように**', 'kodomo ga nerareru you ni · ushiro no hito ni mo kikoeru you ni', 'để con ngủ được · để người phía sau cũng nghe thấy'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{可能形|かのうけい}／わかる・{見|み}える・{聞|き}こえる・なる ＋ ように、～ — "để (có thể)…"',
          vi: 'Vế trước là **khả năng / trạng thái** muốn đạt; vế sau là việc làm để tạo điều kiện. Vế sau thường là việc **đang làm đều đặn** (～ています) hoặc **lời đề nghị** (～てください).',
          examples: [
            E('{日本語|にほんご}で{電話|でんわ}ができるように、{毎日|まいにち}{会話|かいわ}の{練習|れんしゅう}をしています。', 'Nihongo de denwa ga dekiru you ni, mainichi kaiwa no renshuu o shite imasu.', 'Để gọi điện được bằng tiếng Nhật, ngày nào tôi cũng luyện hội thoại.'),
            E('{後|うし}ろの{席|せき}の{人|ひと}にも{聞|き}こえるように、{大|おお}きい{声|こえ}で{話|はな}してください。', 'Ushiro no seki no hito ni mo kikoeru you ni, ookii koe de hanashite kudasai.', 'Hãy nói to để người ngồi phía sau cũng nghe thấy.'),
            E('{黒板|こくばん}の{字|じ}がよく{見|み}えるように、{前|まえ}の{席|せき}に{座|すわ}りました。', 'Kokuban no ji ga yoku mieru you ni, mae no seki ni suwarimashita.', 'Để nhìn rõ chữ trên bảng, tôi đã ngồi bàn trên.'),
            E('{子|こ}どもにもわかるように、やさしい{言葉|ことば}で{説明|せつめい}しました。', 'Kodomo ni mo wakaru you ni, yasashii kotoba de setsumei shimashita.', 'Tôi đã giải thích bằng từ ngữ dễ để cả trẻ con cũng hiểu.'),
            E('{朝|あさ}{早|はや}く{起|お}きられるように、{目覚|めざ}まし{時計|どけい}を{二|ふた}つかけました。', 'Asa hayaku okirareru you ni, mezamashi dokei o futatsu kakemashita.', 'Để sáng dậy sớm được, tôi đã đặt hai cái đồng hồ báo thức.'),
            E('{早|はや}く{元気|げんき}になるように、ゆっくり{休|やす}んでください。', 'Hayaku genki ni naru you ni, yukkuri yasunde kudasai.', 'Hãy nghỉ ngơi thong thả để mau khoẻ lại.'),
            E('{雨|あめ}の{日|ひ}でも{運動|うんどう}できるように、ジムに{入|はい}りました。', 'Ame no hi demo undou dekiru you ni, jimu ni hairimashita.', 'Để cả ngày mưa cũng vận động được, tôi đã vào làm hội viên phòng gym.'),
          ],
        },
        {
          formula: 'Vない ＋ ように、～ — "để khỏi…, để không…"',
          vi: 'Mục đích **phủ định** (tránh điều không muốn) — **chỉ dùng ように**. Rất hay gặp với {忘|わす}れる, {遅|おく}れる, {間違|まちが}える, {風邪|かぜ}をひく, {太|ふと}る, {迷|まよ}う.',
          examples: [
            E('{忘|わす}れないように、スマホにメモしておきます。', 'Wasurenai you ni, sumaho ni memo shite okimasu.', 'Để khỏi quên, tôi ghi sẵn vào điện thoại.'),
            E('{風邪|かぜ}をひかないように、{毎日|まいにち}{手|て}を{洗|あら}っています。', 'Kaze o hikanai you ni, mainichi te o aratte imasu.', 'Để khỏi bị cảm, ngày nào tôi cũng rửa tay.'),
            E('{遅刻|ちこく}しないように、{目覚|めざ}まし{時計|どけい}を{早|はや}めにかけました。', 'Chikoku shinai you ni, mezamashi dokei o hayame ni kakemashita.', 'Để không đến muộn, tôi đặt báo thức sớm hơn một chút.'),
            E('{太|ふと}らないように、{夜|よる}は{甘|あま}いものを{食|た}べません。', 'Futoranai you ni, yoru wa amai mono o tabemasen.', 'Để khỏi béo, buổi tối tôi không ăn đồ ngọt.'),
            E('{道|みち}に{迷|まよ}わないように、{地図|ちず}を{印刷|いんさつ}しておきました。', 'Michi ni mayowanai you ni, chizu o insatsu shite okimashita.', 'Để khỏi lạc đường, tôi đã in sẵn bản đồ.'),
            E('{赤|あか}ちゃんが{起|お}きないように、{静|しず}かにドアを{閉|し}めました。', 'Akachan ga okinai you ni, shizuka ni doa o shimemashita.', 'Để em bé không thức giấc, tôi đóng cửa thật khẽ. (khác chủ ngữ)'),
          ],
        },
      ],
    },
    { t: 'h', text: '②′ Vます ＋ ように — câu cầu mong, cầu chúc' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Vます ＋ ように。 — "mong sao…, cầu cho…"',
          vi: 'Đứng **một mình cuối câu**: lời cầu ở đền chùa, viết trên thẻ {絵馬|えま}, thiệp chúc, hoặc tự nhủ. Dùng **thể ます** (lịch sự với thần linh / người nhận). Đây là cách dùng **duy nhất** của bài có thể ます trước ように.',
          examples: [
            E('{試験|しけん}に{合格|ごうかく}できますように。', 'Shiken ni goukaku dekimasu you ni.', 'Mong sao thi đỗ.'),
            E('{明日|あした}、{晴|は}れますように。', 'Ashita, haremasu you ni.', 'Cầu cho ngày mai trời nắng.'),
            E('{来年|らいねん}もいい{年|とし}になりますように。', 'Rainen mo ii toshi ni narimasu you ni.', 'Chúc năm sau cũng là một năm tốt lành.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ように',
      lines: [
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'メアリーさん、{最近|さいきん}{漢字|かんじ}がよく{書|か}けていますね。{何|なに}かしていますか。', ro: 'Mearii-san, saikin kanji ga yoku kakete imasu ne. Nani ka shite imasu ka.', vi: 'Mary, dạo này em viết chữ Hán tốt quá. Em có làm gì đặc biệt không?' },
        { who: 'メアリー', role: 'a', text: 'はい。{習|なら}った{漢字|かんじ}を{忘|わす}れないように、{毎晩|まいばん}ノートに{五回|ごかい}ずつ{書|か}いています。', ro: 'Hai. Naratta kanji o wasurenai you ni, maiban nooto ni gokai zutsu kaite imasu.', vi: 'Dạ. Để không quên chữ đã học, tối nào em cũng chép vào vở mỗi chữ năm lần.' },
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'いいですね。{読|よ}む{練習|れんしゅう}は？', ro: 'Ii desu ne. Yomu renshuu wa?', vi: 'Hay lắm. Còn luyện đọc thì sao?' },
        { who: 'メアリー', role: 'a', text: 'ふりがながなくても{読|よ}めるように、{駅|えき}の{看板|かんばん}を{見|み}て{読|よ}んでみています。', ro: 'Furigana ga nakute mo yomeru you ni, eki no kanban o mite yonde mite imasu.', vi: 'Để không có furigana cũng đọc được, em nhìn biển hiệu ở ga rồi thử đọc.' },
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'それはいい{方法|ほうほう}ですね。{試験|しけん}の{日|ひ}、{寝坊|ねぼう}しないようにしてくださいね。', ro: 'Sore wa ii houhou desu ne. Shiken no hi, nebou shinai you ni shite kudasai ne.', vi: 'Cách đó hay đấy. Ngày thi nhớ đừng ngủ quên nhé.' },
        { who: 'メアリー', role: 'a', text: 'はい。{遅|おく}れないように、{前|まえ}の{日|ひ}は{早|はや}く{寝|ね}ます。', ro: 'Hai. Okurenai you ni, mae no hi wa hayaku nemasu.', vi: 'Dạ. Để không bị muộn, hôm trước em sẽ ngủ sớm.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — "để (không)…" ＋ ように ＋ việc làm',
      head: ['Muốn (không)…', 'Việc làm', 'Câu', 'Romaji'],
      rows: [
        ['{漢字|かんじ}が{読|よ}める', '{新聞|しんぶん}を{読|よ}む', '{漢字|かんじ}が{読|よ}めるように、{新聞|しんぶん}を{読|よ}んでいます。', 'Kanji ga yomeru you ni, shinbun o yonde imasu.'],
        ['ニュースがわかる', 'ラジオを{聞|き}く', 'ニュースがわかるように、ラジオを{聞|き}いています。', 'Nyuusu ga wakaru you ni, rajio o kiite imasu.'],
        ['{遠|とお}くからも{見|み}える', '{大|おお}きく{書|か}く', '{遠|とお}くからも{見|み}えるように、{大|おお}きく{書|か}いてください。', 'Tooku kara mo mieru you ni, ookiku kaite kudasai.'],
        ['{忘|わす}れない', 'メモする', '{忘|わす}れないように、メモします。', 'Wasurenai you ni, memo shimasu.'],
        ['{遅|おく}れない', '{早|はや}く{家|いえ}を{出|で}る', '{遅|おく}れないように、{早|はや}く{家|いえ}を{出|で}ます。', 'Okurenai you ni, hayaku ie o demasu.'],
        ['{風邪|かぜ}をひかない', 'コートを{着|き}る', '{風邪|かぜ}をひかないように、コートを{着|き}ていきます。', 'Kaze o hikanai you ni, kooto o kite ikimasu.'],
        ['{運動不足|うんどうぶそく}にならない', '{階段|かいだん}を{使|つか}う', '{運動不足|うんどうぶそく}にならないように、{階段|かいだん}を{使|つか}います。', 'Undou busoku ni naranai you ni, kaidan o tsukaimasu.'],
        ['{日本語|にほんご}が{上手|じょうず}になる', '{日本人|にほんじん}と{話|はな}す', '{日本語|にほんご}が{上手|じょうず}になるように、{日本人|にほんじん}とたくさん{話|はな}します。', 'Nihongo ga jouzu ni naru you ni, nihonjin to takusan hanashimasu.'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG PHÂN BIỆT ～ために ↔ ～ように (đề N4 hỏi nhiều nhất)',
      head: ['', '～ために', '～ように'],
      rows: [
        ['V đứng trước', 'V **chủ ý**: {買|か}う, {行|い}く, {留学|りゅうがく}する, {減|へ}らす, {続|つづ}ける', 'V **không chủ ý**: thể khả năng, わかる, {見|み}える, {聞|き}こえる, なる · và **Vない**'],
        ['Chủ ngữ hai vế', '**bắt buộc cùng một người**', '**được khác nhau** ({子|こ}どもがわかるように、{私|わたし}が{説明|せつめい}する)'],
        ['Phủ định', '✗ (~~{忘|わす}れないために~~)', '✓ {忘|わす}れない**ように**'],
        ['Danh từ', '✓ {健康|けんこう}**のために**', '✗ (N のように = "như N" — Bài 20)'],
        ['Sắc thái', 'mục tiêu rõ, mình **chủ động đạt tới**', '**tạo điều kiện** cho một trạng thái xảy ra / không xảy ra'],
        ['Cặp ví dụ', '{体重|たいじゅう}**を{減|へ}らす**ために、{運動|うんどう}する', '{体重|たいじゅう}**が{減|へ}る**ように、{運動|うんどう}する'],
        ['Cặp ví dụ', '{日本語|にほんご}を{勉強|べんきょう}するために、{日本|にほん}に{来|き}た', '{日本語|にほんご}が{話|はな}せるように、{毎日|まいにち}{練習|れんしゅう}する'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ように (sai → đúng)',
      items: [
        '~~{漢字|かんじ}を{読|よ}むように、{新聞|しんぶん}を{読|よ}みます~~ → **{漢字|かんじ}が{読|よ}めるように** — mục đích là **khả năng** → thể khả năng (và trợ từ thường đổi を → **が**).',
        '~~{忘|わす}れないで、メモします~~ (= "không quên mà ghi chép" — sai nghĩa) → **{忘|わす}れないように**、メモします.',
        '~~{合格|ごうかく}しますように、{勉強|べんきょう}します~~ → thể ます + ように chỉ dùng cho **câu cầu mong đứng riêng**. Mục đích: **{合格|ごうかく}できるように**、{勉強|べんきょう}します.',
        '**Ba ように khác nhau**: (1) **～ように** (mục đích — bài này); (2) **N のように／～ように見える** (như, giống — Bài 20); (3) **～ように{言|い}う** (bảo ai làm — Bài 23). Nhìn **V đứng trước** và **vế sau** để phân biệt.',
      ],
    },
    { t: 'rule', formula: 'V{可能形|かのうけい}・わかる・見える・聞こえる・なる／Vない ＋ ように、～： để (có thể)… ／ để khỏi…', vi: 'Tạo điều kiện cho một trạng thái mình không ra lệnh được; hai vế được khác chủ ngữ. Mục đích phủ định luôn dùng ように. Vます＋ように。 = câu cầu mong.' },

    /* ══════ ③ ～ようになる ══════ */
    { t: 'h', text: '③ V{辞書形|じしょけい}／V{可能形|かのうけい} ＋ ようになる — "(đã) trở nên…, bắt đầu…": nói sự THAY ĐỔI' },
    {
      t: 'p',
      text: '**～ようになる** nói một **thay đổi đã thành** sau một thời gian: trước không — **bây giờ có**. Hai kiểu thay đổi: **(a) năng lực** — với **thể khả năng**: {泳|およ}げるようになった (giờ bơi được), {漢字|かんじ}が{読|よ}めるようになった; **(b) thói quen, hành vi, tình hình** — với **V{辞書形|じしょけい}**: {毎朝|まいあさ}コーヒーを{飲|の}むようになった (giờ sáng nào cũng uống), {人|ひと}がたくさん{来|く}るようになった. Thay đổi theo chiều **ngược lại** (trước có — giờ không): **Vない → ～なくなる** ({飲|の}まなくなった, {泳|およ}げなくなった). Đây là "bản động từ" của ポイント 95 (イA くなる／ナA・N になる).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ようになる',
      head: ['Dạng', 'Cách nối', 'Ví dụ', 'Romaji'],
      rows: [
        ['Năng lực (khẳng định)', 'V{可能形|かのうけい} ＋ ようになる', '{話|はな}せる**ようになる** · {読|よ}める**ようになる** · できる**ようになる** · {見|み}える**ようになる**', 'hanaseru you ni naru · yomeru you ni naru · dekiru you ni naru'],
        ['Thói quen, hành vi (khẳng định)', 'V{辞書形|じしょけい} ＋ ようになる', '{飲|の}む**ようになる** · {来|く}る**ようになる** · {自分|じぶん}で{料理|りょうり}する**ようになる**', 'nomu you ni naru · kuru you ni naru'],
        ['Phủ định (mất đi)', 'Vない bỏ い ＋ くなる', '{飲|の}まない → {飲|の}ま**なくなる** · {話|はな}せない → {話|はな}せ**なくなる**', 'nomanaku naru · hanasenaku naru'],
        ['Quá khứ (dạng hay dùng nhất)', '～ようになりました／～なくなりました', '{泳|およ}げるようになりました · {吸|す}わなくなりました', 'oyogeru you ni narimashita · suwanaku narimashita'],
        ['Hỏi', '～ようになりましたか', '{日本語|にほんご}で{電話|でんわ}ができるようになりましたか', 'Nihongo de denwa ga dekiru you ni narimashita ka'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{可能形|かのうけい} ＋ ようになりました — "giờ đã (làm) được"',
          vi: 'Kết quả của luyện tập / thời gian. Hay đi với **{前|まえ}は～が、{今|いま}は～** (trước thì… nay thì…), **だんだん**, **{少|すこ}しずつ**, **やっと** (cuối cùng cũng).',
          examples: [
            E('{日本|にほん}に{来|き}て{一年|いちねん}で、{日本語|にほんご}で{電話|でんわ}ができるようになりました。', 'Nihon ni kite ichinen de, nihongo de denwa ga dekiru you ni narimashita.', 'Sang Nhật một năm, tôi đã gọi điện được bằng tiếng Nhật.'),
            E('{毎日|まいにち}{練習|れんしゅう}して、やっと{自転車|じてんしゃ}に{乗|の}れるようになりました。', 'Mainichi renshuu shite, yatto jitensha ni noreru you ni narimashita.', 'Luyện mỗi ngày, cuối cùng tôi đã đi được xe đạp.'),
            E('{漢字|かんじ}が{三百|さんびゃく}ぐらい{読|よ}めるようになりました。', 'Kanji ga sanbyaku gurai yomeru you ni narimashita.', 'Tôi đã đọc được khoảng 300 chữ Hán.'),
            E('{最近|さいきん}、{日本|にほん}のドラマが{少|すこ}しわかるようになりました。', 'Saikin, Nihon no dorama ga sukoshi wakaru you ni narimashita.', 'Gần đây tôi đã hiểu được phim truyền hình Nhật một chút.'),
            E('メガネをかけたら、{遠|とお}くの{字|じ}がよく{見|み}えるようになりました。', 'Megane o kaketara, tooku no ji ga yoku mieru you ni narimashita.', 'Đeo kính vào thì tôi đã nhìn rõ chữ ở xa.'),
            E('{一人|ひとり}で{料理|りょうり}が{作|つく}れるようになりました。', 'Hitori de ryouri ga tsukureru you ni narimashita.', 'Tôi đã tự nấu ăn được một mình.'),
            E('{弟|おとうと}の{子|こ}どもが{歩|ある}けるようになりました。', 'Otouto no kodomo ga arukeru you ni narimashita.', 'Con của em trai tôi đã biết đi.'),
          ],
        },
        {
          formula: 'V{辞書形|じしょけい} ＋ ようになりました — "(giờ) đã bắt đầu (làm đều đặn)"',
          vi: 'Thói quen hoặc tình hình **mới** — trước không làm, bây giờ thường làm. Không phải "bắt đầu một hành động" (đó là ～{始|はじ}める), mà là **một trạng thái mới đã hình thành**.',
          examples: [
            E('{日本|にほん}に{来|き}てから、{毎朝|まいあさ}コーヒーを{飲|の}むようになりました。', 'Nihon ni kite kara, maiasa koohii o nomu you ni narimashita.', 'Từ khi sang Nhật, sáng nào tôi cũng uống cà phê.'),
            E('{健康診断|けんこうしんだん}のあと、{父|ちち}は{野菜|やさい}をよく{食|た}べるようになりました。', 'Kenkou shindan no ato, chichi wa yasai o yoku taberu you ni narimashita.', 'Sau đợt khám sức khoẻ, bố tôi đã hay ăn rau.'),
            E('{子|こ}どもが{生|う}まれてから、{兄|あに}は{早|はや}く{家|いえ}に{帰|かえ}るようになりました。', 'Kodomo ga umarete kara, ani wa hayaku ie ni kaeru you ni narimashita.', 'Từ khi có con, anh tôi đã về nhà sớm.'),
            E('{駅前|えきまえ}に{本屋|ほんや}ができてから、たくさんの{人|ひと}がこの{道|みち}を{通|とお}るようになりました。', 'Ekimae ni hon\'ya ga dekite kara, takusan no hito ga kono michi o tooru you ni narimashita.', 'Từ khi trước ga có hiệu sách, rất nhiều người đã đi qua con đường này.'),
            E('{走|はし}るようになってから、よく{眠|ねむ}れるようになりました。', 'Hashiru you ni natte kara, yoku nemureru you ni narimashita.', 'Từ khi bắt đầu chạy bộ, tôi đã ngủ ngon được.'),
          ],
        },
        {
          formula: 'Vない → ～なくなりました — "(giờ) không… nữa"',
          vi: 'Thay đổi theo chiều **mất đi**. Dạng chuẩn là **～なくなる** (Vない bỏ い + くなる — giống tính từ い). Có người nói ～ないようになる, nhưng ～なくなる tự nhiên và phổ biến hơn nhiều — khi viết hãy dùng なくなる.',
          examples: [
            E('{前|まえ}はよく{夜|よ}ふかししていましたが、{最近|さいきん}はしなくなりました。', 'Mae wa yoku yofukashi shite imashita ga, saikin wa shinaku narimashita.', 'Trước đây tôi hay thức khuya, nhưng gần đây không còn thức nữa.'),
            E('{仕事|しごと}が{忙|いそが}しくなって、{運動|うんどう}しなくなりました。', 'Shigoto ga isogashiku natte, undou shinaku narimashita.', 'Công việc bận lên nên tôi không còn vận động nữa.'),
            E('{年|とし}をとって、{父|ちち}は{小|ちい}さい{字|じ}が{読|よ}めなくなりました。', 'Toshi o totte, chichi wa chiisai ji ga yomenaku narimashita.', 'Có tuổi rồi, bố tôi không đọc được chữ nhỏ nữa.'),
            E('スマホを{持|も}ってから、{手紙|てがみ}を{書|か}かなくなりました。', 'Sumaho o motte kara, tegami o kakanaku narimashita.', 'Từ khi có điện thoại thông minh, tôi không viết thư nữa.'),
            E('{日本|にほん}の{生活|せいかつ}に{慣|な}れて、{国|くに}の{料理|りょうり}をあまり{作|つく}らなくなりました。', 'Nihon no seikatsu ni narete, kuni no ryouri o amari tsukuranaku narimashita.', 'Quen cuộc sống ở Nhật rồi, tôi không còn hay nấu món quê nữa.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '"Trở nên" — chọn đúng theo loại từ (ôn ポイント 95 + mẫu mới)',
      head: ['Loại', 'Mẫu', 'Ví dụ', 'Romaji'],
      rows: [
        ['イA', 'bỏ い ＋ くなる', '{寒|さむ}**くなりました**', 'samuku narimashita'],
        ['ナA', '＋ になる', '{上手|じょうず}**になりました**', 'jouzu ni narimashita'],
        ['N', '＋ になる', '{先生|せんせい}**になりました**', 'sensei ni narimashita'],
        ['V (khẳng định)', '＋ **ようになる**', '{話|はな}せる**ようになりました**', 'hanaseru you ni narimashita'],
        ['V (phủ định)', 'Vない ＋ **くなる** (→ なくなる)', '{話|はな}せ**なくなりました**', 'hanasenaku narimashita'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ようになる',
      lines: [
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'ナタポンさん、{日本|にほん}に{来|き}て{二年|にねん}ですね。どんなことができるようになりましたか。', ro: 'Natapon-san, Nihon ni kite ninen desu ne. Donna koto ga dekiru you ni narimashita ka.', vi: 'Nattapon, em sang Nhật được hai năm rồi nhỉ. Em đã làm được những gì rồi?' },
        { who: 'ナタポン', role: 'b', text: '{来|き}たときは{全然|ぜんぜん}{話|はな}せませんでしたが、{今|いま}はアルバイトで{電話|でんわ}の{注文|ちゅうもん}が{受|う}けられるようになりました。', ro: 'Kita toki wa zenzen hanasemasen deshita ga, ima wa arubaito de denwa no chuumon ga ukerareru you ni narimashita.', vi: 'Lúc mới sang em hoàn toàn không nói được, nhưng giờ ở chỗ làm thêm em đã nhận được đơn đặt hàng qua điện thoại ạ.' },
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'すごいですね。{生活|せいかつ}はどう{変|か}わりましたか。', ro: 'Sugoi desu ne. Seikatsu wa dou kawarimashita ka.', vi: 'Giỏi quá. Cuộc sống của em thay đổi thế nào?' },
        { who: 'ナタポン', role: 'b', text: '{自分|じぶん}で{料理|りょうり}をするようになりました。それから、{前|まえ}は{辛|から}いものばかり{食|た}べていましたが、{今|いま}はあまり{食|た}べなくなりました。', ro: 'Jibun de ryouri o suru you ni narimashita. Sorekara, mae wa karai mono bakari tabete imashita ga, ima wa amari tabenaku narimashita.', vi: 'Em đã bắt đầu tự nấu ăn. Rồi trước đây em toàn ăn đồ cay, nhưng giờ không còn ăn nhiều nữa ạ.' },
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: '{漢字|かんじ}はどうですか。{新聞|しんぶん}が{読|よ}めるようになりましたか。', ro: 'Kanji wa dou desu ka. Shinbun ga yomeru you ni narimashita ka.', vi: 'Chữ Hán thì sao? Em đã đọc được báo chưa?' },
        { who: 'ナタポン', role: 'b', text: 'いいえ、まだ{読|よ}めません。でも、{見出|みだ}しは{少|すこ}しわかるようになりました。', ro: 'Iie, mada yomemasen. Demo, midashi wa sukoshi wakaru you ni narimashita.', vi: 'Dạ chưa, em vẫn chưa đọc được. Nhưng tít báo thì em đã hiểu được một chút ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — 前は… → 今は…ようになりました／なくなりました',
      head: ['Trước đây', 'Bây giờ', 'Câu', 'Romaji'],
      rows: [
        ['{泳|およ}げなかった', '{泳|およ}げる', '{前|まえ}は{泳|およ}げませんでしたが、{今|いま}は{泳|およ}げるようになりました。', 'Mae wa oyogemasen deshita ga, ima wa oyogeru you ni narimashita.'],
        ['{納豆|なっとう}が{食|た}べられなかった', '{食|た}べられる', '{納豆|なっとう}が{食|た}べられるようになりました。', 'Nattou ga taberareru you ni narimashita.'],
        ['{朝|あさ}{起|お}きられなかった', '6{時|じ}に{起|お}きられる', '6{時|じ}に{起|お}きられるようになりました。', 'Rokuji ni okirareru you ni narimashita.'],
        ['{運動|うんどう}しなかった', '{毎朝|まいあさ}{走|はし}る', '{毎朝|まいあさ}{走|はし}るようになりました。', 'Maiasa hashiru you ni narimashita.'],
        ['よくたばこを{吸|す}った', '{吸|す}わない', 'たばこを{吸|す}わなくなりました。', 'Tabako o suwanaku narimashita.'],
        ['よくゲームをした', 'しない', 'ゲームをしなくなりました。', 'Geemu o shinaku narimashita.'],
        ['{日本語|にほんご}のニュースがわからなかった', 'わかる', '{日本語|にほんご}のニュースがわかるようになりました。', 'Nihongo no nyuusu ga wakaru you ni narimashita.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ようになる (sai → đúng)',
      items: [
        '~~{日本語|にほんご}が{話|はな}せるになりました~~ → **{話|はな}せるようになりました** — động từ cần **ように** trước なる.',
        '~~{日本語|にほんご}が{上手|じょうず}ようになりました~~ → **{上手|じょうず}になりました** — tính từ / danh từ thì KHÔNG có ように (ポイント 95).',
        '~~{泳|およ}ぐようになりました~~ (khi muốn nói "đã biết bơi") → **{泳|およ}げるようになりました** — năng lực phải dùng **thể khả năng**. {泳|およ}ぐようになりました = "đã bắt đầu (có thói quen) đi bơi".',
        '~~{雨|あめ}が{降|ふ}るようになりました~~ (khi chỉ muốn nói "trời đổ mưa") → **{雨|あめ}が{降|ふ}り{出|だ}しました** (Bài 20). ようになる dùng cho thay đổi **kéo dài, thành nếp**: この{地域|ちいき}では{冬|ふゆ}に{雪|ゆき}がよく{降|ふ}るようになった.',
        '**ようになる ↔ Vます＋{始|はじ}める** — {始|はじ}める: một hành động **bắt đầu** ({食|た}べ{始|はじ}める = bắt đầu ăn); ようになる: **thói quen / khả năng mới đã có** sau một quá trình.',
      ],
    },
    { t: 'rule', formula: 'V{可能形|かのうけい}／V{辞書形|じしょけい} ＋ ようになる ／ Vない → ～なくなる： (đã) trở nên làm được · bắt đầu thành thói quen ／ không… nữa', vi: 'Nói kết quả của một thay đổi qua thời gian, thường ở thể quá khứ ようになりました. Năng lực → thể khả năng. Tính từ / danh từ → くなる・になる (ポイント 95).' },

    /* ══════ ④ ～ようにする ══════ */
    { t: 'h', text: '④ V{辞書形|じしょけい}／Vない ＋ ようにする・ようにしている — "cố gắng (để) …", "tạo thói quen …"' },
    {
      t: 'p',
      text: '**～ようにする** nói **nỗ lực có ý thức** để một việc trở thành nếp (hoặc để tránh một việc): "**cố gắng** làm V / cố **không** làm V". Ba dạng hay dùng: **(1) ～ようにしている** — một thói quen người nói **đang cố giữ** (không phải luật cứng, đôi khi không làm được): {毎朝|まいあさ}{野菜|やさい}ジュースを{飲|の}むようにしています; **(2) ～ようにします** — **quyết tâm từ giờ** sẽ cố: これからは{遅刻|ちこく}しないようにします; **(3) ～ようにしてください** — **nhắc / nhờ lịch sự** người khác giữ một nếp: {毎日|まいにち}{復習|ふくしゅう}するようにしてください. Với **thể khả năng**: ～られるようにする = **thu xếp sao cho** làm được ({土曜日|どようび}は{入|はい}れるようにします).',
    },
    {
      t: 'table',
      caption: 'Ba dạng của ～ようにする',
      head: ['Dạng', 'Nghĩa', 'Ví dụ', 'Romaji'],
      rows: [
        ['～ようにしています', 'đang cố giữ nếp (thói quen)', '{毎日|まいにち}30{分|ぷん}{歩|ある}く**ようにしています**', 'Mainichi sanjuppun aruku you ni shite imasu'],
        ['～ないようにしています', 'đang cố KHÔNG làm', '{夜|よる}は{甘|あま}いものを{食|た}べない**ようにしています**', 'Yoru wa amai mono o tabenai you ni shite imasu'],
        ['～ようにします', 'từ giờ sẽ cố (quyết tâm, hứa)', 'これからは{遅刻|ちこく}しない**ようにします**', 'Korekara wa chikoku shinai you ni shimasu'],
        ['～ようにしてください', 'nhắc lịch sự: nhớ… nhé', '{毎日|まいにち}{復習|ふくしゅう}する**ようにしてください**', 'Mainichi fukushuu suru you ni shite kudasai'],
        ['～ないようにしてください', 'nhắc lịch sự: nhớ đừng…', '{授業|じゅぎょう}に{遅|おく}れない**ようにしてください**', 'Jugyou ni okurenai you ni shite kudasai'],
        ['V{可能形|かのうけい} ＋ ようにする', 'thu xếp để có thể…', '{誰|だれ}でも{使|つか}える**ようにしました**', 'Dare demo tsukaeru you ni shimashita'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{辞書形|じしょけい}／Vない ＋ ようにしています — "tôi cố (không)…"',
          vi: 'Kể thói quen tốt mình đang giữ — câu trả lời rất hay dùng khi giám thị hỏi **{健康|けんこう}のために{何|なに}かしていますか**／**{日本語|にほんご}の{勉強|べんきょう}で{気|き}をつけていることは？** Hay đi với **なるべく／できるだけ**.',
          examples: [
            E('{健康|けんこう}のために、{毎日|まいにち}{野菜|やさい}を{食|た}べるようにしています。', 'Kenkou no tame ni, mainichi yasai o taberu you ni shite imasu.', 'Vì sức khoẻ, tôi cố ngày nào cũng ăn rau.'),
            E('{寝|ね}る{前|まえ}は、スマホを{見|み}ないようにしています。', 'Neru mae wa, sumaho o minai you ni shite imasu.', 'Trước khi ngủ tôi cố không xem điện thoại.'),
            E('アルバイトでも、なるべく{日本語|にほんご}だけで{話|はな}すようにしています。', 'Arubaito demo, narubeku nihongo dake de hanasu you ni shite imasu.', 'Cả ở chỗ làm thêm, tôi cũng cố hết mức chỉ nói tiếng Nhật.'),
            E('{約束|やくそく}の{十分前|じゅっぷんまえ}には{着|つ}くようにしています。', 'Yakusoku no juppun mae ni wa tsuku you ni shite imasu.', 'Tôi cố đến trước giờ hẹn 10 phút.'),
            E('お{金|かね}を{無駄|むだ}にしないように、{買|か}う{前|まえ}によく{考|かんが}えるようにしています。', 'Okane o muda ni shinai you ni, kau mae ni yoku kangaeru you ni shite imasu.', 'Để không phí tiền, tôi cố suy nghĩ kỹ trước khi mua.'),
            E('なるべくエレベーターを{使|つか}わないようにしています。', 'Narubeku erebeetaa o tsukawanai you ni shite imasu.', 'Tôi cố hết mức không đi thang máy.'),
          ],
        },
        {
          formula: '～ようにします — "(từ giờ) tôi sẽ cố…" · ～ようにしてください — "nhớ… nhé"',
          vi: '**ようにします**: lời **hứa / quyết tâm** (hay dùng khi xin lỗi: すみません、これからは～ないようにします). **ようにしてください**: lời **nhắc** của giáo viên, bác sĩ, cấp trên — mềm hơn ～てください (không bắt làm một lần, mà mong **giữ thành nếp**).',
          examples: [
            E('すみませんでした。これからは{遅刻|ちこく}しないようにします。', 'Sumimasen deshita. Korekara wa chikoku shinai you ni shimasu.', 'Em xin lỗi. Từ nay em sẽ cố không đến muộn nữa.'),
            E('{明日|あした}から、{毎朝|まいあさ}{単語|たんご}を{十|じゅう}{覚|おぼ}えるようにします。', 'Ashita kara, maiasa tango o juu oboeru you ni shimasu.', 'Từ mai, sáng nào tôi cũng sẽ cố thuộc 10 từ.'),
            E('{次|つぎ}は{間違|まちが}えないようにします。', 'Tsugi wa machigaenai you ni shimasu.', 'Lần sau tôi sẽ cố không nhầm nữa.'),
            E('{毎日|まいにち}{少|すこ}しずつ{復習|ふくしゅう}するようにしてください。', 'Mainichi sukoshi zutsu fukushuu suru you ni shite kudasai.', 'Các em nhớ ôn bài mỗi ngày một ít nhé.'),
            E('{教室|きょうしつ}では{日本語|にほんご}で{話|はな}すようにしてください。', 'Kyoushitsu de wa nihongo de hanasu you ni shite kudasai.', 'Trong lớp các em nhớ nói bằng tiếng Nhật nhé.'),
            E('この{薬|くすり}は{食事|しょくじ}のあとで{飲|の}むようにしてください。', 'Kono kusuri wa shokuji no ato de nomu you ni shite kudasai.', 'Thuốc này nhớ uống sau bữa ăn nhé.'),
            E('{無理|むり}をしないようにしてくださいね。', 'Muri o shinai you ni shite kudasai ne.', 'Nhớ đừng cố quá sức nhé.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG PHÂN BIỆT ～ようになる ↔ ～ようにする',
      head: ['', '～ようになる', '～ようにする（している）'],
      rows: [
        ['Nghĩa', '**đã thay đổi** — kết quả', '**cố gắng** — nỗ lực, thói quen đang giữ'],
        ['Ai làm chủ', 'tự thành sau một thời gian (không nói "cố")', 'người nói **chủ động**, có ý thức'],
        ['V đứng trước', 'hay là **thể khả năng** (năng lực) hoặc V{辞書形|じしょけい} (thói quen mới)', 'V **chủ ý** {辞書形|じしょけい} / **Vない**'],
        ['Thì hay gặp', '～ようになり**ました** (đã thành)', '～ようにして**います** (đang cố) · ～ようにし**ます** (sẽ cố)'],
        ['Cặp ví dụ', '{野菜|やさい}が{食|た}べられるようになった (giờ ăn được rau rồi)', '{野菜|やさい}を{食|た}べるようにしている (cố ăn rau)'],
        ['Cặp ví dụ', '6{時|じ}に{起|お}きられるようになった (giờ dậy được lúc 6h)', '6{時|じ}に{起|お}きるようにしている (cố dậy lúc 6h)'],
        ['Nối hai mẫu', '{早|はや}く{寝|ね}る**ようにしたら**、{早|はや}く{起|お}きられる**ようになった** — cố ngủ sớm (する) → kết quả: dậy sớm được (なる)', ''],
      ],
    },
    {
      t: 'note',
      title: 'ようにしている ↔ ことにしている (⑤) — "cố" hay "luật"?',
      items: [
        '**～ようにしている** = **cố gắng**, mềm, đôi khi không làm được: なるべく{野菜|やさい}を{食|た}べるようにしている. Hay đi với **なるべく／できるだけ**.',
        '**～ことにしている** = **luật mình tự đặt**, cứng, gần như luôn làm: {毎朝|まいあさ}{必|かなら}ず{走|はし}ることにしている. Hay đi với **{必|かなら}ず／{毎日|まいにち}／～たら（{必|かなら}ず）**.',
        'Mẹo đề N4: thấy **なるべく** → ようにしている; thấy **{必|かなら}ず** → ことにしている.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ようにする (ở phòng khám)',
      lines: [
        { who: '{医者|いしゃ}', role: 'examiner', text: '{西川|にしかわ}さん、{少|すこ}し{体重|たいじゅう}が{増|ふ}えましたね。{運動|うんどう}はしていますか。', ro: 'Nishikawa-san, sukoshi taijuu ga fuemashita ne. Undou wa shite imasu ka.', vi: 'Anh Nishikawa, cân nặng của anh tăng một chút rồi nhỉ. Anh có vận động không?' },
        { who: '{西川|にしかわ}', role: 'b', text: '{仕事|しごと}が{忙|いそが}しくて、あまり……。でも、{駅|えき}では{階段|かいだん}を{使|つか}うようにしています。', ro: 'Shigoto ga isogashikute, amari……. Demo, eki de wa kaidan o tsukau you ni shite imasu.', vi: 'Công việc bận nên cũng không nhiều lắm… Nhưng ở ga tôi cố đi cầu thang bộ.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'それはいいですね。{食事|しょくじ}はどうですか。', ro: 'Sore wa ii desu ne. Shokuji wa dou desu ka.', vi: 'Thế thì tốt. Còn ăn uống thì sao?' },
        { who: '{西川|にしかわ}', role: 'b', text: '{夜|よる}、{遅|おそ}く{食|た}べることが{多|おお}いです。', ro: 'Yoru, osoku taberu koto ga ooi desu.', vi: 'Tôi hay ăn tối muộn.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'では、{寝|ね}る{三時間前|さんじかんまえ}からは{食|た}べないようにしてください。それから、{週|しゅう}に{二回|にかい}ぐらい{歩|ある}くようにしてくださいね。', ro: 'Dewa, neru sanjikan mae kara wa tabenai you ni shite kudasai. Sorekara, shuu ni nikai gurai aruku you ni shite kudasai ne.', vi: 'Vậy anh nhớ đừng ăn trong vòng ba tiếng trước khi ngủ. Rồi mỗi tuần cố đi bộ khoảng hai lần nhé.' },
        { who: '{西川|にしかわ}', role: 'b', text: 'わかりました。{今日|きょう}から、そうするようにします。', ro: 'Wakarimashita. Kyou kara, sou suru you ni shimasu.', vi: 'Tôi hiểu rồi. Từ hôm nay tôi sẽ cố làm như vậy.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — lời khuyên của bác sĩ / giáo viên → ～ようにしてください',
      head: ['Vấn đề', 'Lời khuyên', 'Câu', 'Romaji'],
      rows: [
        ['thiếu ngủ', '{早|はや}く{寝|ね}る', '{早|はや}く{寝|ね}るようにしてください。', 'Hayaku neru you ni shite kudasai.'],
        ['ăn nhiều đồ ngọt', '{甘|あま}いものを{食|た}べない', '{甘|あま}いものを{食|た}べないようにしてください。', 'Amai mono o tabenai you ni shite kudasai.'],
        ['quên từ mới', '{毎日|まいにち}{復習|ふくしゅう}する', '{毎日|まいにち}{復習|ふくしゅう}するようにしてください。', 'Mainichi fukushuu suru you ni shite kudasai.'],
        ['hay đến muộn', '{遅|おく}れない', '{授業|じゅぎょう}に{遅|おく}れないようにしてください。', 'Jugyou ni okurenai you ni shite kudasai.'],
        ['thiếu vận động', 'もっと{歩|ある}く', 'もっと{歩|ある}くようにしてください。', 'Motto aruku you ni shite kudasai.'],
        ['phát âm sai', '{大|おお}きい{声|こえ}で{読|よ}む', '{大|おお}きい{声|こえ}で{読|よ}むようにしてください。', 'Ookii koe de yomu you ni shite kudasai.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ようにする (sai → đúng)',
      items: [
        '~~{毎日|まいにち}{野菜|やさい}を{食|た}べるようになっています~~ (khi muốn nói "tôi cố ăn rau") → **{食|た}べるようにしています** — "cố" là **する**, không phải なる.',
        '~~{日本語|にほんご}が{上手|じょうず}になるようにしています~~ → nghe gượng; nói việc **cụ thể** mình làm: {日本語|にほんご}が{上手|じょうず}になるように、{毎日|まいにち}{話|はな}す**ようにしています**.',
        '~~これからは{遅刻|ちこく}しないようになります~~ (hứa) → **しないようにします** — lời hứa là ý chí của mình → する.',
        '**ようにしてください ↔ てください** — {座|すわ}ってください (ngồi xuống — làm ngay một lần); {前|まえ}の{席|せき}に{座|すわ}るようにしてください (nhớ ngồi bàn trên — mỗi lần đều thế).',
      ],
    },
    { t: 'rule', formula: 'V{辞書形|じしょけい}／Vない ＋ ようにしている（đang cố）・ようにする（sẽ cố）・ようにしてください（nhớ… nhé）', vi: 'Nỗ lực có ý thức để giữ một nếp / tránh một việc. Cặp với ようになる: する = mình cố, なる = đã thành. なるべく ～ようにする.' },

    /* ══════ ⑤ ～ことにする ══════ */
    { t: 'h', text: '⑤ V{辞書形|じしょけい}／Vない ＋ ことにする・ことにした・ことにしている — "(tôi) quyết định…", "tôi đặt lệ…"' },
    {
      t: 'p',
      text: '**～ことにする** = **người nói tự quyết định** làm (hoặc không làm) một việc. **こと** biến cả cụm động từ thành danh từ ("việc V"), **にする** = "chọn" — giống hệt **N にする** khi gọi món ({私|わたし}はコーヒーにします = tôi chọn cà phê): **{留学|りゅうがく}することにする** = "chọn việc du học". Ba dạng: **ことにする** (quyết ngay lúc nói: じゃ、{明日|あした}{行|い}くことにしよう) · **ことにした／しました** (đã quyết — **báo tin**, dạng hay dùng nhất) · **ことにしている** (một **luật** mình tự đặt và đang giữ lâu dài).',
    },
    {
      t: 'table',
      caption: 'Các dạng của ～ことにする',
      head: ['Dạng', 'Nghĩa', 'Ví dụ', 'Romaji'],
      rows: [
        ['～ことにする／しよう', 'quyết ngay lúc nói', 'じゃ、タクシーで{行|い}く**ことにしよう**', 'Ja, takushii de iku koto ni shiyou'],
        ['～ことにしました', 'đã quyết (báo tin)', '{国|くに}へ{帰|かえ}らない**ことにしました**', 'Kuni e kaeranai koto ni shimashita'],
        ['～ことにしています', 'luật tự đặt, lâu dài', '{毎晩|まいばん}{日記|にっき}を{書|か}く**ことにしています**', 'Maiban nikki o kaku koto ni shite imasu'],
        ['Hỏi', '～ことにしたんですか', 'どうして{辞|や}める**ことにしたんですか**', 'Doushite yameru koto ni shita n desu ka'],
        ['Cùng nghĩa', '～ことに{決|き}めました', '{留学|りゅうがく}する**ことに{決|き}めました**', 'Ryuugaku suru koto ni kimemashita'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{辞書形|じしょけい}／Vない ＋ ことにしました — "tôi đã quyết định (không)…"',
          vi: 'Báo cho người nghe **một quyết định của chính mình**. Hay mở bằng **{色々|いろいろ}{考|かんが}えて** (suy nghĩ nhiều rồi), **{実|じつ}は** (Bài 20), **それで**.',
          examples: [
            E('{来年|らいねん}、{日本|にほん}の{大学院|だいがくいん}を{受|う}けることにしました。', 'Rainen, Nihon no daigakuin o ukeru koto ni shimashita.', 'Tôi đã quyết định năm sau thi vào cao học ở Nhật.'),
            E('{夏休|なつやす}みは{国|くに}へ{帰|かえ}らないで、{日本|にほん}でアルバイトすることにしました。', 'Natsuyasumi wa kuni e kaeranaide, Nihon de arubaito suru koto ni shimashita.', 'Nghỉ hè tôi quyết định không về nước mà ở Nhật làm thêm.'),
            E('{色々|いろいろ}{考|かんが}えて、{今|いま}の{会社|かいしゃ}を{辞|や}めることにしました。', 'Iroiro kangaete, ima no kaisha o yameru koto ni shimashita.', 'Suy nghĩ nhiều rồi, tôi quyết định nghỉ công ty hiện tại.'),
            E('{雨|あめ}なので、{今日|きょう}のピクニックは{中止|ちゅうし}することにしました。', 'Ame na node, kyou no pikunikku wa chuushi suru koto ni shimashita.', 'Vì trời mưa nên chúng tôi quyết định huỷ buổi dã ngoại hôm nay.'),
            E('{毎月|まいつき}{二万円|にまんえん}ずつ{貯金|ちょきん}することにしました。', 'Maitsuki niman\'en zutsu chokin suru koto ni shimashita.', 'Tôi quyết định mỗi tháng để dành đều 20.000 yên.'),
            E('{健康|けんこう}のために、もうたばこは{吸|す}わないことにしました。', 'Kenkou no tame ni, mou tabako wa suwanai koto ni shimashita.', 'Vì sức khoẻ, tôi quyết định không hút thuốc nữa.'),
            E('{試験|しけん}が{終|お}わるまで、ゲームはしないことにした。', 'Shiken ga owaru made, geemu wa shinai koto ni shita.', 'Mình quyết định không chơi game cho đến khi thi xong.'),
          ],
        },
        {
          formula: 'V{辞書形|じしょけい}／Vない ＋ ことにしています — "tôi đặt lệ là…"',
          vi: 'Một **quy tắc cá nhân** đã có từ trước và vẫn đang giữ — chắc chắn hơn ようにしている. Hay đi với **{必|かなら}ず**, **{毎日|まいにち}／{毎晩|まいばん}**, **～たら**.',
          examples: [
            E('{毎晩|まいばん}{寝|ね}る{前|まえ}に、{三十分|さんじゅっぷん}{本|ほん}を{読|よ}むことにしています。', 'Maiban neru mae ni, sanjuppun hon o yomu koto ni shite imasu.', 'Tối nào trước khi ngủ tôi cũng đặt lệ đọc sách 30 phút.'),
            E('{夜|よる}{九時|くじ}を{過|す}ぎたら、{何|なに}も{食|た}べないことにしています。', 'Yoru kuji o sugitara, nani mo tabenai koto ni shite imasu.', 'Tôi đặt lệ quá 9 giờ tối thì không ăn gì nữa.'),
            E('{日曜日|にちようび}は{仕事|しごと}のメールを{見|み}ないことにしています。', 'Nichiyoubi wa shigoto no meeru o minai koto ni shite imasu.', 'Chủ nhật tôi đặt lệ không xem email công việc.'),
            E('{父|ちち}は{毎朝|まいあさ}{六時|ろくじ}に{散歩|さんぽ}することにしています。', 'Chichi wa maiasa rokuji ni sanpo suru koto ni shite imasu.', 'Bố tôi đặt lệ sáng nào cũng đi dạo lúc 6 giờ.'),
            E('{給料|きゅうりょう}をもらったら、{必|かなら}ず{一万円|いちまんえん}{貯金|ちょきん}することにしています。', 'Kyuuryou o morattara, kanarazu ichiman\'en chokin suru koto ni shite imasu.', 'Nhận lương xong, tôi đặt lệ nhất định để dành 10.000 yên.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Nói về dự định & quyết định — mức độ chắc chắn (ôn Bài 16 + mẫu mới)',
      head: ['Mẫu', 'Sắc thái', 'Ví dụ', 'Romaji'],
      rows: [
        ['～（よ）うと{思|おも}っています (Bài 16)', 'đang tính, chưa chắc hẳn', '{留学|りゅうがく}しようと{思|おも}っています', 'ryuugaku shiyou to omotte imasu'],
        ['～つもりです (Bài 16)', 'đã có ý định rõ trong đầu', '{留学|りゅうがく}するつもりです', 'ryuugaku suru tsumori desu'],
        ['**～ことにしました**', '**vừa chốt** quyết định — báo cho người khác', '{留学|りゅうがく}することにしました', 'ryuugaku suru koto ni shimashita'],
        ['～{予定|よてい}です (Bài 16)', 'đã thành **lịch**, có ngày giờ', '4{月|がつ}に{留学|りゅうがく}する{予定|よてい}です', 'shigatsu ni ryuugaku suru yotei desu'],
        ['**～ことになりました** (⑥)', 'được quyết định (không chỉ do mình)', '{留学|りゅうがく}することになりました', 'ryuugaku suru koto ni narimashita'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ことにする',
      lines: [
        { who: 'リン', role: 'a', text: 'ダニエルさん、{冬休|ふゆやす}みはどうするか{決|き}めた？', ro: 'Danieru-san, fuyuyasumi wa dou suru ka kimeta?', vi: 'Daniel, cậu quyết định nghỉ đông làm gì chưa?' },
        { who: 'ダニエル', role: 'b', text: 'うん。{国|くに}へ{帰|かえ}らないで、スキー{場|じょう}でアルバイトすることにしたよ。', ro: 'Un. Kuni e kaeranaide, sukii-jou de arubaito suru koto ni shita yo.', vi: 'Rồi. Mình quyết định không về nước mà đi làm thêm ở khu trượt tuyết.' },
        { who: 'リン', role: 'a', text: 'えっ、どうしてそうすることにしたの？', ro: 'E, doushite sou suru koto ni shita no?', vi: 'Hả, sao cậu lại quyết định thế?' },
        { who: 'ダニエル', role: 'b', text: '{日本人|にほんじん}と{働|はたら}けば、{会話|かいわ}が{上手|じょうず}になるし、お{金|かね}も{貯|た}められるから。', ro: 'Nihonjin to hatarakeba, kaiwa ga jouzu ni naru shi, okane mo tamerareru kara.', vi: 'Làm cùng người Nhật thì vừa giỏi hội thoại hơn, vừa tích được tiền. (ôn ～ば, ～し — Bài 17)' },
        { who: 'リン', role: 'a', text: 'いいね。{私|わたし}は{毎年|まいとし}、お{正月|しょうがつ}は{家族|かぞく}と{過|す}ごすことにしているから、{帰|かえ}るよ。', ro: 'Ii ne. Watashi wa maitoshi, oshougatsu wa kazoku to sugosu koto ni shite iru kara, kaeru yo.', vi: 'Hay đấy. Còn mình năm nào cũng đặt lệ đón Tết với gia đình nên mình về.' },
        { who: 'ダニエル', role: 'b', text: 'そっか。じゃ、{休|やす}みの{前|まえ}に、みんなで{忘年会|ぼうねんかい}をすることにしようよ。', ro: 'Sokka. Ja, yasumi no mae ni, minna de bounenkai o suru koto ni shiyou yo.', vi: 'Vậy à. Thế trước kỳ nghỉ, mình quyết là cả nhóm làm tiệc tất niên nhé.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ことにする (sai → đúng)',
      items: [
        '~~{留学|りゅうがく}することをしました~~ → **{留学|りゅうがく}すること**に**しました** — trợ từ luôn là **に**.',
        '~~{留学|りゅうがく}したことにしました~~ → **{留学|りゅうがく}する**ことにしました — trước こと là **thể từ điển** (việc chưa làm). (～たことにする là nghĩa khác: "coi như đã…" — N2.)',
        '~~{部長|ぶちょう}は{私|わたし}を{大阪|おおさか}に{転勤|てんきん}することにしました~~ (kể việc mình bị điều đi) → **{私|わたし}は{大阪|おおさか}に{転勤|てんきん}することになりました** — việc do công ty quyết → ⑥.',
        '**Vたことがある (ポイント 108)** ≠ **Vることにする**: {行|い}ったことがあります (đã từng đi) ↔ {行|い}くことにしました (đã quyết định đi).',
      ],
    },
    { t: 'rule', formula: 'V{辞書形|じしょけい}／Vない ＋ ことにする（ことにした）： (tự) quyết định … ／ ～ことにしている： đặt lệ cho mình', vi: 'Quyết định của chính người nói. Báo tin: ～ことにしました. Luật cá nhân lâu dài: ～ことにしています (+ 必ず). Mạnh hơn つもり (đã chốt).' },

    /* ══════ ⑥ ～ことになる ══════ */
    { t: 'h', text: '⑥ V{辞書形|じしょけい}／Vない ＋ ことになる・ことになった・ことになっている — "(đã) được quyết định…", "theo quy định…"' },
    {
      t: 'p',
      text: '**～ことになる** = một việc **được quyết định** — bởi **người khác** (công ty, trường, cuộc họp), bởi **hoàn cảnh**, hoặc là **kết quả tự nhiên** của sự việc — người nói không phải người "chọn". Ba dạng: **ことになる** (sẽ thành ra là…) · **ことになった／なりました** (đã được quyết — **báo tin**) · **ことになっている** (đang là **quy định, luật, lịch** đã có sẵn). ⚠ Người Nhật hay dùng **ことになりました** để báo **cả tin vui của chính mình** ({結婚|けっこん}, {就職|しゅうしょく}, {帰国|きこく}) — nghe **khiêm tốn**, không nhấn "tôi quyết". Ở chỗ làm, đây là câu báo tin chuẩn.',
    },
    {
      t: 'table',
      caption: 'Các dạng của ～ことになる',
      head: ['Dạng', 'Nghĩa', 'Ví dụ', 'Romaji'],
      rows: [
        ['～ことになりました', 'đã được quyết (báo tin)', '{大阪|おおさか}に{転勤|てんきん}する**ことになりました**', 'Oosaka ni tenkin suru koto ni narimashita'],
        ['～ないことになりました', 'đã được quyết là không…', '{明日|あした}の{試合|しあい}はしない**ことになりました**', 'Ashita no shiai wa shinai koto ni narimashita'],
        ['～ことになっています', 'quy định, luật, lịch có sẵn', '{会議|かいぎ}は9{時|じ}に{始|はじ}まる**ことになっています**', 'Kaigi wa kuji ni hajimaru koto ni natte imasu'],
        ['～ないことになっています', 'quy định cấm', 'ここではたばこを{吸|す}わない**ことになっています**', 'Koko de wa tabako o suwanai koto ni natte imasu'],
        ['N／số + ということになっている', 'quy định là N', '{週|しゅう}28{時間|じかん}まで**ということになっています**', 'shuu nijuuhachi-jikan made to iu koto ni natte imasu'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{辞書形|じしょけい}／Vない ＋ ことになりました — "(đã) được quyết định là…"',
          vi: 'Việc do **tổ chức / người khác / hoàn cảnh** quyết. Hay đi với **{会議|かいぎ}で**, **{会社|かいしゃ}の{命令|めいれい}で**, **{台風|たいふう}が{来|く}るので**, **{転勤|てんきん}／{出張|しゅっちょう}／{入院|にゅういん}**.',
          examples: [
            E('{来月|らいげつ}から{大阪|おおさか}に{転勤|てんきん}することになりました。', 'Raigetsu kara Oosaka ni tenkin suru koto ni narimashita.', 'Từ tháng sau tôi được điều chuyển công tác sang Osaka.'),
            E('{会議|かいぎ}で、{新|あたら}しいメニューは{来月|らいげつ}から{出|だ}すことになりました。', 'Kaigi de, atarashii menyuu wa raigetsu kara dasu koto ni narimashita.', 'Cuộc họp đã quyết định từ tháng sau mới ra thực đơn mới.'),
            E('{台風|たいふう}が{来|く}るので、{明日|あした}の{試合|しあい}は{中止|ちゅうし}することになりました。', 'Taifuu ga kuru node, ashita no shiai wa chuushi suru koto ni narimashita.', 'Vì bão tới nên trận đấu ngày mai đã được quyết định huỷ.'),
            E('{来週|らいしゅう}、{部長|ぶちょう}と{北海道|ほっかいどう}へ{出張|しゅっちょう}することになった。', 'Raishuu, buchou to Hokkaidou e shucchou suru koto ni natta.', 'Tuần sau mình được cử đi công tác Hokkaido với trưởng phòng.'),
            E('{先生|せんせい}が{病気|びょうき}なので、{明日|あした}のテストはしないことになりました。', 'Sensei ga byouki na node, ashita no tesuto wa shinai koto ni narimashita.', 'Vì thầy ốm nên bài kiểm tra ngày mai sẽ không làm nữa.'),
            E('{来週|らいしゅう}から、{私|わたし}がこの{店|みせ}のリーダーをすることになりました。', 'Raishuu kara, watashi ga kono mise no riidaa o suru koto ni narimashita.', 'Từ tuần sau tôi được giao làm trưởng ca của cửa hàng này.'),
          ],
        },
        {
          formula: '～ことになりました — báo tin của chính mình một cách khiêm tốn',
          vi: 'Dù chính mình góp phần quyết (đi thi, nhận lời), người Nhật vẫn báo bằng **ことになりました** — vì kết quả còn do trường, công ty, gia đình, "duyên số". Câu này rất hay gặp trong **email, lời chào ở chỗ làm**.',
          examples: [
            E('{実|じつ}は、{来月|らいげつ}{結婚|けっこん}することになりました。', 'Jitsu wa, raigetsu kekkon suru koto ni narimashita.', 'Thật ra là tháng sau tôi sẽ kết hôn.'),
            E('3{月|がつ}で{国|くに}へ{帰|かえ}ることになりました。{今|いま}まで{本当|ほんとう}にありがとうございました。', 'Sangatsu de kuni e kaeru koto ni narimashita. Ima made hontou ni arigatou gozaimashita.', 'Hết tháng 3 tôi sẽ về nước. Cảm ơn mọi người rất nhiều vì thời gian qua.'),
            E('4{月|がつ}から{東京|とうきょう}の{会社|かいしゃ}で{働|はたら}くことになりました。', 'Shigatsu kara Toukyou no kaisha de hataraku koto ni narimashita.', 'Từ tháng 4 tôi sẽ làm việc ở một công ty tại Tokyo.'),
          ],
        },
        {
          formula: 'V{辞書形|じしょけい}／Vない ＋ ことになっています — "theo quy định / theo lịch là…"',
          vi: 'Nói **luật, nội quy, phong tục, lịch đã định** — thứ đã có từ trước, không phải quyết định mới. Hay gặp trong **thông báo, nội quy** (bài đọc N4!) và khi giải thích quy tắc cho người mới.',
          examples: [
            E('この{寮|りょう}では、{夜|よる}{十一時|じゅういちじ}までに{帰|かえ}ることになっています。', 'Kono ryou de wa, yoru juuichiji made ni kaeru koto ni natte imasu.', 'Ở ký túc xá này, theo nội quy phải về trước 11 giờ đêm.'),
            E('{日本|にほん}では、{二十歳|はたち}になるまでお{酒|さけ}を{飲|の}んではいけないことになっています。', 'Nihon de wa, hatachi ni naru made osake o nonde wa ikenai koto ni natte imasu.', 'Ở Nhật, theo luật chưa đủ 20 tuổi thì không được uống rượu.'),
            E('{会議|かいぎ}は{毎週|まいしゅう}{月曜日|げつようび}の{九時|くじ}から{始|はじ}まることになっています。', 'Kaigi wa maishuu getsuyoubi no kuji kara hajimaru koto ni natte imasu.', 'Theo lịch, cuộc họp bắt đầu lúc 9 giờ thứ Hai hằng tuần.'),
            E('{明日|あした}は{十時|じゅうじ}に{駅|えき}で{会|あ}うことになっています。', 'Ashita wa juuji ni eki de au koto ni natte imasu.', 'Theo như đã hẹn, mai 10 giờ gặp nhau ở ga.'),
            E('この{部屋|へや}では、{食|た}べたり{飲|の}んだりしてはいけないことになっています。', 'Kono heya de wa, tabetari nondari shite wa ikenai koto ni natte imasu.', 'Theo quy định, trong phòng này không được ăn uống.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG PHÂN BIỆT ～ことにする ↔ ～ことになる ↔ ～ことにしている ↔ ～ことになっている',
      head: ['Mẫu', 'Ai quyết?', 'Khi nào?', 'Ví dụ', 'Nghĩa'],
      rows: [
        ['**ことにする**', '**chính mình**', 'quyết ngay lúc nói', 'じゃ、{明日|あした}{行|い}くことにする。', 'Vậy mai đi (chốt luôn).'],
        ['**ことにした**', '**chính mình**', 'đã quyết (báo tin)', '{留学|りゅうがく}することにした。', 'Mình đã quyết định du học.'],
        ['**ことにしている**', '**chính mình**', 'luật cá nhân lâu dài', '{毎朝|まいあさ}{走|はし}ることにしている。', 'Mình đặt lệ sáng nào cũng chạy.'],
        ['**ことになる**', 'người khác / hoàn cảnh', 'sẽ thành ra là', 'このままだと、{遅|おく}れることになる。', 'Cứ thế này thì sẽ thành ra muộn mất.'],
        ['**ことになった**', 'người khác / hoàn cảnh (hoặc mình — khiêm tốn)', 'đã được quyết (báo tin)', '{転勤|てんきん}することになった。', 'Mình được điều chuyển công tác.'],
        ['**ことになっている**', 'tổ chức / xã hội', 'quy định, lịch có sẵn', '9{時|じ}に{始|はじ}まることになっている。', 'Theo quy định bắt đầu lúc 9 giờ.'],
      ],
    },
    {
      t: 'table',
      caption: 'Cùng một việc — đổi mẫu là đổi "ai quyết"',
      head: ['Câu', 'Romaji', 'Ý nghĩa'],
      rows: [
        ['{来月|らいげつ}、{東京|とうきょう}へ{引|ひ}っ{越|こ}す**ことにしました**。', 'Raigetsu, Toukyou e hikkosu koto ni shimashita.', 'Tôi **tự quyết** chuyển lên Tokyo (ví dụ: thích Tokyo).'],
        ['{来月|らいげつ}、{東京|とうきょう}へ{引|ひ}っ{越|こ}す**ことになりました**。', 'Raigetsu, Toukyou e hikkosu koto ni narimashita.', 'Việc chuyển **được quyết** (ví dụ: công ty điều đi) — hoặc báo tin khiêm tốn.'],
        ['{毎朝|まいあさ}{六時|ろくじ}に{起|お}きる**ことにしています**。', 'Maiasa rokuji ni okiru koto ni shite imasu.', 'Luật **tôi tự đặt**.'],
        ['{毎朝|まいあさ}{六時|ろくじ}に{起|お}きる**ことになっています**。', 'Maiasa rokuji ni okiru koto ni natte imasu.', 'Luật **của nơi đó** (ký túc xá, trại hè, chùa…).'],
        ['{毎朝|まいあさ}{六時|ろくじ}に{起|お}きる**ようにしています**。', 'Maiasa rokuji ni okiru you ni shite imasu.', 'Tôi **cố gắng** dậy 6 giờ (không phải luật cứng — mẫu ④).'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～ことになる (ở chỗ làm)',
      lines: [
        { who: '{山口|やまぐち}', role: 'a', text: '{西川|にしかわ}さん、{来月|らいげつ}から{福岡|ふくおか}に{行|い}くって{本当|ほんとう}ですか。', ro: 'Nishikawa-san, raigetsu kara Fukuoka ni iku tte hontou desu ka.', vi: 'Anh Nishikawa, nghe nói từ tháng sau anh đi Fukuoka có thật không?' },
        { who: '{西川|にしかわ}', role: 'b', text: 'ええ。{福岡|ふくおか}の{支店|してん}に{転勤|てんきん}することになったんです。', ro: 'Ee. Fukuoka no shiten ni tenkin suru koto ni natta n desu.', vi: 'Vâng. Tôi được điều chuyển sang chi nhánh Fukuoka.' },
        { who: '{山口|やまぐち}', role: 'a', text: 'そうですか。{寂|さび}しくなりますね。{家族|かぞく}も{一緒|いっしょ}に{行|い}くんですか。', ro: 'Sou desu ka. Sabishiku narimasu ne. Kazoku mo issho ni iku n desu ka.', vi: 'Vậy ạ. Rồi sẽ buồn đây. Gia đình anh cũng đi cùng chứ?' },
        { who: '{西川|にしかわ}', role: 'b', text: 'いいえ、{子|こ}どもの{学校|がっこう}があるので、{僕|ぼく}だけ{先|さき}に{行|い}くことにしました。', ro: 'Iie, kodomo no gakkou ga aru node, boku dake saki ni iku koto ni shimashita.', vi: 'Không, vì con còn đi học nên tôi quyết định đi trước một mình.' },
        { who: '{山口|やまぐち}', role: 'a', text: '{引|ひ}っ{越|こ}しの{費用|ひよう}は{会社|かいしゃ}が{払|はら}ってくれるんですか。', ro: 'Hikkoshi no hiyou wa kaisha ga haratte kureru n desu ka.', vi: 'Chi phí chuyển nhà công ty có trả cho anh không?' },
        { who: '{西川|にしかわ}', role: 'b', text: 'ええ、{転勤|てんきん}のときは、{会社|かいしゃ}が{払|はら}うことになっています。', ro: 'Ee, tenkin no toki wa, kaisha ga harau koto ni natte imasu.', vi: 'Có, theo quy định khi chuyển công tác thì công ty trả.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ことになる (sai → đúng)',
      items: [
        '~~{私|わたし}は{毎朝|まいあさ}{走|はし}ることになっています~~ (luật tự đặt) → **ことにしています** — luật của chính mình là **する**; ことになっている là luật **của tổ chức**.',
        '~~{会社|かいしゃ}が{決|き}めたので、{転勤|てんきん}することにしました~~ → **{転勤|てんきん}することになりました** — công ty quyết → なる.',
        '~~{転勤|てんきん}するのことになりました~~ → **{転勤|てんきん}すること**になりました — V không cần の trước こと.',
        '**ことになる ↔ ようになる** — ことになる: một **quyết định** (lịch, việc cụ thể); ようになる: một **thay đổi năng lực / thói quen** dần dần. {日本|にほん}で{働|はたら}くことになった (được nhận vào làm) ↔ {日本語|にほんご}で{働|はたら}けるようになった (giờ đã làm việc được bằng tiếng Nhật).',
      ],
    },
    { t: 'rule', formula: 'V{辞書形|じしょけい}／Vない ＋ ことになる（ことになった）： (được) quyết định … ／ ～ことになっている： theo quy định / lịch', vi: 'Quyết định không (chỉ) do người nói: công ty, cuộc họp, hoàn cảnh — hoặc báo tin của mình một cách khiêm tốn. ことになっている = nội quy, luật, lịch có sẵn. Cặp với ことにする (mình quyết).' },

    /* ══════ BẢNG CHIA TỔNG HỢP ══════ */
    { t: 'h', text: '⭐ Bảng chia tổng hợp — 8 động từ × 6 mẫu (học thuộc theo hàng ngang)' },
    {
      t: 'table',
      caption: 'Cùng một động từ, đổi mẫu — chú ý cột ②③ cần THỂ KHẢ NĂNG khi nói về năng lực',
      head: ['V', '① ために', '② ように (khả năng / ない)', '③ ようになる / なくなる', '④ ようにしている', '⑤ ことにした', '⑥ ことになった'],
      rows: [
        ['{行|い}く', '{行|い}くために', '{行|い}けるように · {行|い}かないように', '{行|い}けるようになった · {行|い}かなくなった', '{行|い}くようにしている', '{行|い}くことにした', '{行|い}くことになった'],
        ['{読|よ}む', '{読|よ}むために', '{読|よ}めるように · {読|よ}まないように', '{読|よ}めるようになった · {読|よ}まなくなった', '{読|よ}むようにしている', '{読|よ}むことにした', '{読|よ}むことになった'],
        ['{話|はな}す', '{話|はな}すために', '{話|はな}せるように · {話|はな}さないように', '{話|はな}せるようになった · {話|はな}さなくなった', '{話|はな}すようにしている', '{話|はな}すことにした', '{話|はな}すことになった'],
        ['{起|お}きる', '{起|お}きるために', '{起|お}きられるように · {起|お}きないように', '{起|お}きられるようになった · {起|お}きなくなった', '{起|お}きるようにしている', '{起|お}きることにした', '{起|お}きることになった'],
        ['{食|た}べる', '{食|た}べるために', '{食|た}べられるように · {食|た}べないように', '{食|た}べられるようになった · {食|た}べなくなった', '{食|た}べるようにしている', '{食|た}べることにした', '{食|た}べることになった'],
        ['{来|く}る', '{来|く}るために', '{来|こ}られるように · {来|こ}ないように', '{来|こ}られるようになった · {来|こ}なくなった', '{来|く}るようにしている', '{来|く}ることにした', '{来|く}ることになった'],
        ['{勉強|べんきょう}する', '{勉強|べんきょう}するために', '{勉強|べんきょう}できるように · {勉強|べんきょう}しないように', '{勉強|べんきょう}できるようになった · {勉強|べんきょう}しなくなった', '{勉強|べんきょう}するようにしている', '{勉強|べんきょう}することにした', '{勉強|べんきょう}することになった'],
        ['わかる (không chủ ý)', '✗', 'わかるように · わからないように', 'わかるようになった · わからなくなった', '✗ (không "cố hiểu" bằng ようにする)', '✗', '✗'],
      ],
    },
    {
      t: 'note',
      title: 'Đọc bảng thế nào',
      items: [
        '**Hàng わかる**: động từ không chủ ý (わかる, {見|み}える, {聞|き}こえる, {要|い}る…) **không đi với ために, ようにする, ことにする** — vì không ai "quyết định hiểu" được. Chỉ dùng **ように** (mục đích) và **ようになる** (thay đổi).',
        '**Cột ②③**: khi nói **năng lực** → thể khả năng ({読|よ}める, {起|お}きられる, できる). Thể từ điển ({読|よ}むように／{読|よ}むようになった) mang nghĩa **thói quen**, không phải "làm được".',
        '**{来|く}る** là chỗ hay sai nhất: {来|く}る (từ điển) → {来|こ}られる (khả năng) → {来|こ}ない (ない). **する → できる** (khả năng).',
      ],
    },
    {
      t: 'quiz',
      id: 'b21-np-sua',
      title: 'Sửa câu sai — gõ lại cả câu cho đúng (10 câu)',
      kind: 'translate',
      grammar: 'Mỗi câu có MỘT lỗi: sai mẫu (ために↔ように, ようになる↔ようにする, ことにする↔ことになる), sai cách nối, hoặc sai trợ từ',
      items: [
        { q: '~~{漢字|かんじ}が{読|よ}めるために~~、{毎日|まいにち}{新聞|しんぶん}を{読|よ}みます。', answers: V('{漢字|かんじ}が{読|よ}めるように、{毎日|まいにち}{新聞|しんぶん}を{読|よ}みます。'), hint: 'thể khả năng → ように' },
        { q: '~~{忘|わす}れないために~~、メモしておきます。', answers: V('{忘|わす}れないように、メモしておきます。'), hint: 'Vない → ように' },
        { q: '~~{健康|けんこう}ために~~、{毎朝|まいあさ}{歩|ある}いています。', answers: V('{健康|けんこう}のために、{毎朝|まいあさ}{歩|ある}いています。'), hint: 'N + の' },
        { q: '{日本語|にほんご}が~~{話|はな}せるになりました~~。', answers: V('{日本語|にほんご}が{話|はな}せるようになりました。'), hint: 'V + ように + なる' },
        { q: '{日本語|にほんご}が~~{上手|じょうず}ようになりました~~。', answers: V('{日本語|にほんご}が{上手|じょうず}になりました。'), hint: 'ナA + に + なる' },
        { q: 'すみません。これからは~~{遅刻|ちこく}しないようになります~~。', answers: V('すみません。これからは{遅刻|ちこく}しないようにします。'), hint: 'lời hứa → する' },
        { q: '{健康|けんこう}のために、なるべく{野菜|やさい}を~~{食|た}べるようになっています~~。', answers: V('{健康|けんこう}のために、なるべく{野菜|やさい}を{食|た}べるようにしています。'), hint: 'なるべく → ようにしている' },
        { q: '{来年|らいねん}{留学|りゅうがく}~~することをしました~~。', answers: V('{来年|らいねん}{留学|りゅうがく}することにしました。'), hint: 'こと + に' },
        { q: '{会社|かいしゃ}の{命令|めいれい}で、{大阪|おおさか}に~~{転勤|てんきん}することにしました~~。', answers: V('{会社|かいしゃ}の{命令|めいれい}で、{大阪|おおさか}に{転勤|てんきん}することになりました。'), hint: 'công ty quyết → なる' },
        { q: '{私|わたし}は{毎朝|まいあさ}{必|かなら}ず{走|はし}る~~ことになっています~~。', answers: V('{私|わたし}は{毎朝|まいあさ}{必|かなら}ず{走|はし}ることにしています。'), hint: 'luật của mình → している' },
      ],
    },

    { t: 'h', text: 'Một cuộc nói chuyện — đủ cả sáu mẫu (đọc to, đánh dấu từng mẫu)' },
    DL('Ở phòng sinh hoạt ký túc xá — "Kế hoạch năm mới của mọi người"', [
      ['アンナ', 'a', 'もうすぐ{新年|しんねん}だね。マルコさん、{来年|らいねん}の{目標|もくひょう}は{決|き}めた？', 'Mou sugu shinnen da ne. Maruko-san, rainen no mokuhyou wa kimeta?', 'Sắp sang năm mới rồi nhỉ. Marco, cậu đặt mục tiêu năm sau chưa?'],
      ['マルコ', 'b', 'うん。{国|くに}で{日本語|にほんご}の{先生|せんせい}になるために、{来年|らいねん}はN2を{受|う}けることにしたよ。', 'Un. Kuni de nihongo no sensei ni naru tame ni, rainen wa enu-ni o ukeru koto ni shita yo.', 'Rồi. Để về nước làm giáo viên tiếng Nhật, mình quyết định năm sau thi N2. (① ために + ⑤ ことにした)'],
      ['アンナ', 'a', 'すごい！{私|わたし}は、{日本語|にほんご}で{仕事|しごと}のメールが{書|か}けるように、{毎日|まいにち}{一通|いっつう}{書|か}く{練習|れんしゅう}をするつもり。', 'Sugoi! Watashi wa, nihongo de shigoto no meeru ga kakeru you ni, mainichi ittsuu kaku renshuu o suru tsumori.', 'Giỏi thế! Còn mình, để viết được email công việc bằng tiếng Nhật, mình định mỗi ngày luyện viết một bức. (② ように + つもり — Bài 16)'],
      ['マルコ', 'b', 'アンナさん、{最近|さいきん}{敬語|けいご}がすごく{上手|じょうず}になったよね。', 'Anna-san, saikin keigo ga sugoku jouzu ni natta yo ne.', 'Anna, dạo này kính ngữ của cậu giỏi hẳn lên nhỉ. (ポイント 95)'],
      ['アンナ', 'a', 'ありがとう。アルバイトで{毎日|まいにち}{使|つか}うようにしているから、{少|すこ}しずつ{自然|しぜん}に{話|はな}せるようになったの。', 'Arigatou. Arubaito de mainichi tsukau you ni shite iru kara, sukoshi zutsu shizen ni hanaseru you ni natta no.', 'Cảm ơn. Vì mình cố dùng mỗi ngày ở chỗ làm thêm, nên dần dần đã nói được tự nhiên. (④ ようにしている → ③ ようになった)'],
      ['マルコ', 'b', 'そういえば、{来月|らいげつ}から{寮|りょう}の{門限|もんげん}が{変|か}わるらしいよ。', 'Sou ieba, raigetsu kara ryou no mongen ga kawaru rashii yo.', 'Nói mới nhớ, nghe đâu từ tháng sau giờ đóng cổng ký túc xá thay đổi đấy. (らしい — Bài 20)'],
      ['アンナ', 'a', 'うん、{管理人|かんりにん}さんから{聞|き}いた。{今|いま}は11{時|じ}までに{帰|かえ}ることになっているけど、{来月|らいげつ}から10{時|じ}半になることになったんだって。', 'Un, kanrinin-san kara kiita. Ima wa juuichiji made ni kaeru koto ni natte iru kedo, raigetsu kara juuji han ni naru koto ni natta n datte.', 'Ừ, mình nghe bác quản lý nói rồi. Giờ theo nội quy là về trước 11 giờ, nhưng nghe bảo đã quyết từ tháng sau thành 10 rưỡi. (⑥ ことになっている + ことになった)'],
      ['マルコ', 'b', 'えっ、{早|はや}いなあ。じゃ、{遅|おく}れないように、アルバイトのシフトを{早|はや}めにしてもらおう。', 'E, hayai naa. Ja, okurenai you ni, arubaito no shifuto o hayame ni shite moraou.', 'Hả, sớm thế. Vậy để khỏi về muộn, mình sẽ nhờ xếp ca làm sớm hơn. (② ないように + ～てもらう — Bài 18)'],
      ['アンナ', 'a', '{私|わたし}も。{試験|しけん}のために、{夜|よる}は{早|はや}く{寝|ね}るようにしたいし、ちょうどいいかも。', 'Watashi mo. Shiken no tame ni, yoru wa hayaku neru you ni shitai shi, choudo ii kamo.', 'Mình cũng thế. Vì kỳ thi, mình cũng muốn cố ngủ sớm, nên có khi lại vừa hay. (① N のために + ④)'],
      ['マルコ', 'b', 'そうだね。じゃ、{来年|らいねん}は{二人|ふたり}とも{目標|もくひょう}が{達成|たっせい}できますように！', 'Sou da ne. Ja, rainen wa futari tomo mokuhyou ga tassei dekimasu you ni!', 'Đúng nhỉ. Vậy cầu cho năm sau cả hai đều đạt được mục tiêu! (②′ ますように)'],
    ]),
    {
      t: 'note',
      title: 'Soát lại cuộc nói chuyện',
      items: [
        '**① ために**: {先生|せんせい}になる**ために** (V — ở đây なる được dùng với ために vì "trở thành giáo viên" là mục tiêu nghề nghiệp mình chủ động theo đuổi; câu này rất tự nhiên), {試験|しけん}**のために**. **② ように**: {書|か}ける**ように**, {遅|おく}れない**ように**. **②′** {達成|たっせい}できます**ように**.',
        '**③ ようになった**: {話|はな}せる**ようになった**. **④ ようにしている**: {使|つか}う**ようにしている**, {寝|ね}る**ようにしたい** (ようにする + たい). **⑤ ことにした**: {受|う}ける**ことにした**. **⑥** {帰|かえ}る**ことになっている** (nội quy hiện tại) → 10{時|じ}{半|はん}になる**ことになった** (quy định mới vừa được quyết).',
        '**{門限|もんげん}** = giờ đóng cổng (N2 — gặp ở ký túc xá) · **～んだって** = nghe bảo là (văn nói của ～そうです) · **{敬語|けいご}** = kính ngữ (Bài 24) · **{一通|いっつう}** = một bức (thư) · **{達成|たっせい}** = đạt được (N2).',
      ],
    },

    /* ══════ TỔNG KẾT NHÓM ══════ */
    { t: 'h', text: 'Tổng kết — một mục tiêu, sáu cách nói (đề N4 rất hay hỏi)' },
    {
      t: 'table',
      caption: 'Mục tiêu của ワン: đỗ N3 tháng 12 — mỗi câu một mẫu',
      head: ['Muốn nói', 'Câu', 'Romaji'],
      rows: [
        ['Việc làm để đạt mục tiêu (chủ động)', '{日本|にほん}の{会社|かいしゃ}で{働|はたら}くために、N3を{受|う}けます。', 'Nihon no kaisha de hataraku tame ni, enu-san o ukemasu.'],
        ['Việc làm để có một khả năng', '{漢字|かんじ}が{読|よ}めるように、{毎日|まいにち}{新聞|しんぶん}を{読|よ}んでいます。', 'Kanji ga yomeru you ni, mainichi shinbun o yonde imasu.'],
        ['Thay đổi đã đạt được', '{新聞|しんぶん}の{見出|みだ}しが{読|よ}めるようになりました。', 'Shinbun no midashi ga yomeru you ni narimashita.'],
        ['Thói quen đang cố giữ', '{寝|ね}る{前|まえ}に{単語|たんご}を{復習|ふくしゅう}するようにしています。', 'Neru mae ni tango o fukushuu suru you ni shite imasu.'],
        ['Quyết định của mình', '{試験|しけん}まで、アルバイトを{減|へ}らすことにしました。', 'Shiken made, arubaito o herasu koto ni shimashita.'],
        ['Quy định / lịch có sẵn', '{受験票|じゅけんひょう}は{試験|しけん}の{前|まえ}に{郵便|ゆうびん}で{届|とど}くことになっています。', 'Jukenhyou wa shiken no mae ni yuubin de todoku koto ni natte imasu.'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng chọn nhanh khi làm đề',
      head: ['Dấu hiệu trong câu', 'Chọn', 'Ví dụ'],
      rows: [
        ['Mục đích + V chủ ý (買う・行く・留学する) / N の', '～ために', '{留学|りゅうがく}する**ために**{貯金|ちょきん}する'],
        ['Mục đích + thể khả năng / わかる・見える・聞こえる / Vない', '～ように', '{忘|わす}れない**ように**メモする'],
        ['{前|まえ}は～が、{今|いま}は～ · だんだん · やっと · {少|すこ}しずつ', '～ようになった／～なくなった', '{泳|およ}げる**ようになった**'],
        ['なるべく · できるだけ · {健康|けんこう}のために + thói quen', '～ようにしている', 'なるべく{歩|ある}く**ようにしている**'],
        ['Lời nhắc của giáo viên / bác sĩ', '～ようにしてください', '{遅|おく}れない**ようにしてください**'],
        ['{色々|いろいろ}{考|かんが}えて · {自分|じぶん}で{決|き}めた', '～ことにした', '{辞|や}める**ことにした**'],
        ['{必|かなら}ず + luật của mình', '～ことにしている', '{必|かなら}ず{貯金|ちょきん}する**ことにしている**'],
        ['{会社|かいしゃ}・{会議|かいぎ}・{学校|がっこう}が決めた · {転勤|てんきん}・{出張|しゅっちょう}', '～ことになった', '{転勤|てんきん}する**ことになった**'],
        ['{規則|きそく}・{法律|ほうりつ}・{寮|りょう}／{会社|かいしゃ}のルール · lịch đã định', '～ことになっている', '11{時|じ}までに{帰|かえ}る**ことになっている**'],
      ],
    },

    /* ══════ LUYỆN TỔNG HỢP ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, chia, điền, trắc nghiệm kiểu đề N4' },
    {
      t: 'build',
      id: 'b21-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Để du học Nhật, tôi đang để dành tiền.', chips: ['{日本|にほん}に', '{留学|りゅうがく}する', 'ために', '{貯金|ちょきん}しています', 'ように', '{留学|りゅうがく}できる'], answer: ['{日本|にほん}に', '{留学|りゅうがく}する', 'ために', '{貯金|ちょきん}しています'], ro: 'Nihon ni ryuugaku suru tame ni chokin shite imasu.' },
        { vi: 'Vì sức khoẻ, tôi đi bộ mỗi ngày.', chips: ['{健康|けんこう}の', 'ために', '{毎日|まいにち}', '{歩|ある}いています', '{健康|けんこう}な', 'ように'], answer: ['{健康|けんこう}の', 'ために', '{毎日|まいにち}', '{歩|ある}いています'], ro: 'Kenkou no tame ni mainichi aruite imasu.' },
        { vi: 'Để khỏi quên, tôi ghi vào sổ.', chips: ['{忘|わす}れない', 'ように', 'ノートに', '{書|か}きます', 'ために', '{忘|わす}れて'], answer: ['{忘|わす}れない', 'ように', 'ノートに', '{書|か}きます'], ro: 'Wasurenai you ni nooto ni kakimasu.' },
        { vi: 'Để đọc được chữ Hán, tôi đọc báo.', chips: ['{漢字|かんじ}が', '{読|よ}める', 'ように', '{新聞|しんぶん}を', '{読|よ}んでいます', 'ために', '{読|よ}む'], answer: ['{漢字|かんじ}が', '{読|よ}める', 'ように', '{新聞|しんぶん}を', '{読|よ}んでいます'], ro: 'Kanji ga yomeru you ni shinbun o yonde imasu.' },
        { vi: 'Hãy nói to để người phía sau cũng nghe thấy.', chips: ['{後|うし}ろの{人|ひと}にも', '{聞|き}こえる', 'ように', '{大|おお}きい{声|こえ}で', '{話|はな}してください', 'ために'], answer: ['{後|うし}ろの{人|ひと}にも', '{聞|き}こえる', 'ように', '{大|おお}きい{声|こえ}で', '{話|はな}してください'], ro: 'Ushiro no hito ni mo kikoeru you ni ookii koe de hanashite kudasai.' },
        { vi: 'Giờ tôi đã bơi được 1 km.', chips: ['{今|いま}は', '1キロ', '{泳|およ}げる', 'ように', 'なりました', 'しました', '{泳|およ}ぐ'], answer: ['{今|いま}は', '1キロ', '{泳|およ}げる', 'ように', 'なりました'], ro: 'Ima wa ichi-kiro oyogeru you ni narimashita.' },
        { vi: 'Tôi không còn thức khuya nữa.', chips: ['{夜|よ}ふかし', 'しなく', 'なりました', 'しない', 'ように', 'しました'], answer: ['{夜|よ}ふかし', 'しなく', 'なりました'], ro: 'Yofukashi shinaku narimashita.' },
        { vi: 'Tôi cố hết mức không ăn đồ ngọt.', chips: ['なるべく', '{甘|あま}いものを', '{食|た}べない', 'ように', 'しています', 'なっています', '{食|た}べる'], answer: ['なるべく', '{甘|あま}いものを', '{食|た}べない', 'ように', 'しています'], ro: 'Narubeku amai mono o tabenai you ni shite imasu.' },
        { vi: 'Các em nhớ ôn bài mỗi ngày nhé.', chips: ['{毎日|まいにち}', '{復習|ふくしゅう}する', 'ように', 'してください', 'なってください', 'ことに'], answer: ['{毎日|まいにち}', '{復習|ふくしゅう}する', 'ように', 'してください'], ro: 'Mainichi fukushuu suru you ni shite kudasai.' },
        { vi: 'Tôi đã quyết định không về nước kỳ nghỉ hè.', chips: ['{夏休|なつやす}みは', '{国|くに}へ', '{帰|かえ}らない', 'ことに', 'しました', 'なりました', 'ように'], answer: ['{夏休|なつやす}みは', '{国|くに}へ', '{帰|かえ}らない', 'ことに', 'しました'], ro: 'Natsuyasumi wa kuni e kaeranai koto ni shimashita.' },
        { vi: 'Từ tháng sau tôi được điều chuyển công tác sang Osaka.', chips: ['{来月|らいげつ}から', '{大阪|おおさか}に', '{転勤|てんきん}する', 'ことに', 'なりました', 'しました', 'ために'], answer: ['{来月|らいげつ}から', '{大阪|おおさか}に', '{転勤|てんきん}する', 'ことに', 'なりました'], ro: 'Raigetsu kara Oosaka ni tenkin suru koto ni narimashita.' },
        { vi: 'Theo nội quy ký túc xá, phải về trước 11 giờ.', chips: ['{寮|りょう}では', '11{時|じ}までに', '{帰|かえ}る', 'ことに', 'なっています', 'しています', 'ように'], answer: ['{寮|りょう}では', '11{時|じ}までに', '{帰|かえ}る', 'ことに', 'なっています'], ro: 'Ryou de wa juuichiji made ni kaeru koto ni natte imasu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-np-chia',
      title: 'Chia — gõ dạng được yêu cầu (14 câu)',
      kind: 'fill',
      grammar: 'V辞書形／Nの ＋ ために · V可能／Vない ＋ ように · V可能 ＋ ようになる／Vない → なくなる · V／Vない ＋ ようにする · V／Vない ＋ ことにする・ことになる',
      items: [
        { q: '{留学|りゅうがく}する → để (～ために)', answers: V('{留学|りゅうがく}するために'), hint: 'V辞書形 + ために' },
        { q: '{健康|けんこう} → vì (～ために)', answers: V('{健康|けんこう}のために'), hint: 'N + の + ために' },
        { q: '{忘|わす}れる → để khỏi (～ように)', answers: V('{忘|わす}れないように'), hint: 'Vない + ように' },
        { q: '{話|はな}す → để nói được (～ように)', answers: V('{話|はな}せるように'), hint: 'thể khả năng + ように' },
        { q: '{起|お}きる → để dậy được (～ように)', answers: V('{起|お}きられるように'), hint: 'thể khả năng nhóm 2: られる' },
        { q: '{泳|およ}ぐ → giờ đã bơi được (～ようになりました)', answers: V('{泳|およ}げるようになりました'), hint: 'thể khả năng + ようになりました' },
        { q: '{来|く}る → (người ta) đã bắt đầu đến (～ようになりました)', answers: V('{来|く}るようになりました'), hint: 'V辞書形 + ようになりました' },
        { q: '{吸|す}う → không hút nữa (～なくなりました)', answers: V('{吸|す}わなくなりました'), hint: 'Vない → なくなりました' },
        { q: '{歩|ある}く → tôi cố (～ようにしています)', answers: V('{歩|ある}くようにしています'), hint: 'V辞書形 + ようにしています' },
        { q: '{食|た}べる → nhớ đừng (～ようにしてください)', answers: V('{食|た}べないようにしてください'), hint: 'Vない + ようにしてください' },
        { q: '{辞|や}める → tôi đã quyết định (～ことにしました)', answers: V('{辞|や}めることにしました'), hint: 'V辞書形 + ことにしました' },
        { q: '{行|い}く → tôi quyết định KHÔNG (～ことにしました)', answers: V('{行|い}かないことにしました'), hint: 'Vない + ことにしました' },
        { q: '{転勤|てんきん}する → đã được quyết (～ことになりました)', answers: V('{転勤|てんきん}することになりました'), hint: 'V辞書形 + ことになりました' },
        { q: '{始|はじ}まる → theo quy định (～ことになっています)', answers: V('{始|はじ}まることになっています'), hint: 'V辞書形 + ことになっています' },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-np-dien',
      title: 'Điền vào chỗ trống — dùng đúng mẫu của bài (12 câu)',
      kind: 'fill',
      grammar: 'ために · ように · ようになる · ようにする · ことにする · ことになる',
      items: [
        { q: '{車|くるま}を{買|か}う（　）、{貯金|ちょきん}しています。', answers: ['ために'], hint: 'V chủ ý + mục đích' },
        { q: '{家族|かぞく}（　）ために、{働|はたら}いています。', answers: ['の'], hint: 'N + の + ために' },
        { q: '{風邪|かぜ}をひかない（　）、{手|て}をよく{洗|あら}います。', answers: ['ように'], hint: 'Vない + mục đích' },
        { q: '{日本語|にほんご}のニュースがわかる（　）、{毎日|まいにち}{聞|き}いています。', answers: ['ように'], hint: 'わかる (không chủ ý)' },
        { q: '{毎日|まいにち}{練習|れんしゅう}して、{自転車|じてんしゃ}に{乗|の}れるように（　）。', answers: ['なりました'], hint: 'kết quả thay đổi' },
        { q: 'スマホを{持|も}ってから、{手紙|てがみ}を{書|か}か（　）なりました。', answers: ['なく'], hint: 'Vない → なくなる' },
        { q: '{健康|けんこう}のために、なるべく{野菜|やさい}を{食|た}べるように（　）います。', answers: ['して'], hint: 'đang cố (なるべく)' },
        { q: '{授業|じゅぎょう}に{遅|おく}れないように（　）ください。', answers: ['して'], hint: 'lời nhắc lịch sự' },
        { q: '{色々|いろいろ}{考|かんが}えて、{来年|らいねん}{大学院|だいがくいん}を{受|う}けることに（　）。', answers: ['しました', 'した'], hint: 'mình tự quyết' },
        { q: '{会議|かいぎ}で、{旅行|りょこう}は{三月|さんがつ}に{行|い}くことに（　）。', answers: ['なりました', 'なった'], hint: 'cuộc họp quyết' },
        { q: '{私|わたし}は{毎晩|まいばん}{必|かなら}ず{日記|にっき}を{書|か}くことに（　）います。', answers: ['して'], hint: 'luật của mình (必ず)' },
        { q: 'この{寮|りょう}では、{夜|よる}{十一時|じゅういちじ}までに{帰|かえ}ることに（　）います。', answers: ['なって'], hint: 'nội quy' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-np-jlpt',
      title: 'Trắc nghiệm dạng đề JLPT N4 — 文法形式の判断 (10 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: '{来年|らいねん}{日本|にほん}に{留学|りゅうがく}する（　）、{毎月|まいつき}{貯金|ちょきん}しています。', options: ['ように', 'ために', 'ことに', 'のに'], correct: 1, why: 'V chủ ý ({留学|りゅうがく}する), cùng một người làm → **ために**. 〔Ryuugaku suru tame ni, maitsuki chokin shite imasu.〕' },
        { q: '{子|こ}どもにもわかる（　）、やさしい{言葉|ことば}で{話|はな}してください。', options: ['ために', 'ように', 'ことに', 'のに'], correct: 1, why: 'わかる là V không chủ ý, khác chủ ngữ (trẻ hiểu — bạn nói) → **ように**. 〔Kodomo ni mo wakaru you ni…〕' },
        { q: '{試験|しけん}の{日|ひ}を{忘|わす}れない（　）、カレンダーに{書|か}いておきました。', options: ['ように', 'ために', 'ことに', 'ようで'], correct: 0, why: 'Mục đích phủ định (Vない) → **ように**. 〔Wasurenai you ni, karendaa ni kaite okimashita.〕' },
        { q: '{日本|にほん}に{来|き}たときは{全然|ぜんぜん}{話|はな}せませんでしたが、{今|いま}は{少|すこ}し{話|はな}せる（　）。', options: ['ようにしました', 'ようになりました', 'ことにしました', 'ためになりました'], correct: 1, why: 'Trước không — giờ có (thay đổi năng lực) → **ようになりました**. 〔Ima wa sukoshi hanaseru you ni narimashita.〕' },
        { q: '{健康|けんこう}のために、なるべくエレベーターを{使|つか}わない（　）。', options: ['ようになっています', 'ようにしています', 'ことになっています', 'ために'], correct: 1, why: '**なるべく** + thói quen mình cố giữ → **ようにしています**. 〔Narubeku erebeetaa o tsukawanai you ni shite imasu.〕' },
        { q: 'A「{明日|あした}の{会議|かいぎ}、{何時|なんじ}からですか。」 B「{九時|くじ}から{始|はじ}まる（　）よ。」', options: ['ことにしています', 'ことになっています', 'ようにしています', 'ために'], correct: 1, why: 'Lịch / quy định đã có sẵn của công ty → **ことになっています**. 〔Kuji kara hajimaru koto ni natte imasu yo.〕' },
        { q: '{会社|かいしゃ}が{決|き}めたので、{父|ちち}は{来月|らいげつ}から{大阪|おおさか}の{支店|してん}で{働|はたら}く（　）。', options: ['ことにしました', 'ことになりました', 'ようにしました', 'ためにしました'], correct: 1, why: 'Công ty quyết, không phải bố chọn → **ことになりました**. 〔Oosaka no shiten de hataraku koto ni narimashita.〕' },
        { q: '{色々|いろいろ}{考|かんが}えて、{私|わたし}は{今|いま}のアルバイトを{辞|や}める（　）。', options: ['ことにしました', 'ことになりました', 'ようになりました', 'ようにしてください'], correct: 0, why: '**{色々|いろいろ}{考|かんが}えて** + quyết định của chính "{私|わたし}" → **ことにしました**. 〔Arubaito o yameru koto ni shimashita.〕' },
        { q: '{年|とし}をとって、{祖母|そぼ}は{小|ちい}さい{字|じ}が（　）なりました。', options: ['{読|よ}めないように', '{読|よ}めなく', '{読|よ}まない', '{読|よ}めることに'], correct: 1, why: 'Thay đổi theo chiều mất đi: Vない → **なくなる**: {読|よ}めなくなりました. 〔Chiisai ji ga yomenaku narimashita.〕' },
        { q: '{医者|いしゃ}「{寝|ね}る{前|まえ}は、{何|なに}も{食|た}べない（　）。」', options: ['ようにしてください', 'ようになってください', 'ことになってください', 'ためにしてください'], correct: 0, why: 'Lời nhắc của bác sĩ giữ thành nếp → **ないようにしてください**. 〔Nani mo tabenai you ni shite kudasai.〕' },
        { q: '★ {毎朝|まいあさ} ＿＿ ＿＿ ★ ＿＿ います。（{走|はし}る／ために／{健康|けんこう}の／ようにして）', options: ['{走|はし}る', 'ために', '{健康|けんこう}の', 'ようにして'], correct: 0, why: 'Câu đúng: {毎朝|まいあさ} **{健康|けんこう}の ために {走|はし}る ようにして** います. Ô ★ (thứ 3) = **{走|はし}る**. 〔Maiasa kenkou no tame ni hashiru you ni shite imasu.〕' },
        { q: '★ {日本|にほん}の{大学院|だいがくいん}に ＿＿ ＿＿ ★ ＿＿ です。（{必要|ひつよう}／ためには／N2が／{入|はい}る）', options: ['{必要|ひつよう}', 'ためには', 'N2が', '{入|はい}る'], correct: 2, why: 'Câu đúng: {日本|にほん}の{大学院|だいがくいん}に **{入|はい}る ためには N2が {必要|ひつよう}** です. Ô ★ (thứ 3) = **N2が**. 〔Daigakuin ni hairu tame ni wa enu-ni ga hitsuyou desu.〕' },
        { q: '★ {子|こ}どもが ＿＿ ＿＿ ★ ＿＿ しました。（ように／{静|しず}かに／{寝|ね}られる／ゆっくり）', options: ['ように', '{静|しず}かに', '{寝|ね}られる', 'ゆっくり'], correct: 0, why: 'Câu đúng: {子|こ}どもが **ゆっくり {寝|ね}られる ように {静|しず}かに** しました. Ô ★ (thứ 3) = **ように**. 〔Kodomo ga yukkuri nerareru you ni shizuka ni shimashita.〕' },
        { q: '★ {来月|らいげつ}から ＿＿ ＿＿ ★ ＿＿ なりました。（ことに／{転勤|てんきん}する／{大阪|おおさか}の／{支店|してん}に）', options: ['ことに', '{転勤|てんきん}する', '{大阪|おおさか}の', '{支店|してん}に'], correct: 1, why: 'Câu đúng: {来月|らいげつ}から **{大阪|おおさか}の {支店|してん}に {転勤|てんきん}する ことに** なりました. Ô ★ (thứ 3) = **{転勤|てんきん}する**. 〔Raigetsu kara Oosaka no shiten ni tenkin suru koto ni narimashita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b21-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 15 chữ: 標 努 健 康 貯 続 必 要 成 績 格 復 増 減 禁',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 15 chữ Hán mới của Bài 21 trong các từ hay gặp khi nói về mục tiêu, học tập, sức khoẻ và tiền bạc (目標・努力・健康・貯金・続く・続ける・必ず・必要・要る・成績・合格・性格・復習・往復・増える・減る・禁煙・禁止…), chọn đúng chữ khi đề cho hiragana, phân biệt chữ trông giống (標・票, 努・怒, 健・建, 貯・財, 続・読, 必・心, 要・票, 績・積, 格・絡, 復・複・腹, 増・贈, 減・感, 禁・林) và viết tay được các chữ ✍.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 21 là **15 chữ** đi theo đúng các từ của chủ đề **mục tiêu, học tập, sức khoẻ, tiền bạc**: 標 努 健 康 貯 続 必 要 成 績 格 復 増 減 禁 — phần lớn là **N3** theo các bảng tham khảo phổ biến ({続|つづ} có bảng xếp N4, {貯|ちょ} có bảng xếp N2; JLPT không công bố danh sách chữ chính thức). Cột **Mức**: ✍ = nên viết được, 👁 = nhận mặt (đọc + hiểu). Học **theo từ**: {目標|もくひょう} (mokuhyou), {健康|けんこう} (kenkou), {成績|せいせき} (seiseki), {合格|ごうかく} (goukaku) — đề 漢字読み và 表記 hỏi **cả từ**. Nhiều chữ ghép với chữ đã học: 目 (Bài 8) + 標 → {目標|もくひょう}; 合 + 格 → {合格|ごうかく}; 復 + 習 (Bài 9) → {復習|ふくしゅう}; 連 (Bài 18) + 続 → {連続|れんぞく}; 実 (Bài 20) + 績 → {実績|じっせき}.',
    },
    {
      t: 'table',
      caption: '15 chữ Hán mới của Bài 21',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['標', 'TIÊU', 'ヒョウ', '—', 'mốc, dấu hiệu; mục tiêu', '{目標|もくひょう} (mục tiêu) · {標準|ひょうじゅん} (tiêu chuẩn — N3) · {標識|ひょうしき} (biển báo — N2)', '👁 N3'],
        ['努', 'NỖ', 'ド', 'つと(める)', 'gắng sức', '{努力|どりょく} (nỗ lực) · {努|つと}める (cố gắng — N2, chỉ để biết âm kun)', '👁 N3'],
        ['健', 'KIỆN', 'ケン', 'すこ(やか)', 'khoẻ mạnh, vững', '{健康|けんこう} (sức khoẻ) · {健康的|けんこうてき} (lành mạnh — N3) · {保健室|ほけんしつ} (phòng y tế trường — N3)', '👁 N3'],
        ['康', 'KHANG', 'コウ', '—', 'yên ổn, khoẻ', '{健康|けんこう} (sức khoẻ) · {健康診断|けんこうしんだん} (khám sức khoẻ định kỳ)', '👁 N3'],
        ['貯', 'TRỮ', 'チョ', '(た・める — ngoài bảng thường dụng)', 'tích trữ, để dành', '{貯金|ちょきん} (tiền tiết kiệm) · {貯金箱|ちょきんばこ} (ống heo) · {貯|た}める (để dành — Bài 16)', '👁 N2–N3'],
        ['続', 'TỤC', 'ゾク', 'つづ(く)・つづ(ける)', 'tiếp tục, nối tiếp', '{続|つづ}く (tiếp diễn) · {続|つづ}ける (tiếp tục) · {続|つづ}き (phần tiếp theo) · {連続|れんぞく} (liên tục — N3) · {手続|てつづ}き (thủ tục — N3)', '✍ N4'],
        ['必', 'TẤT', 'ヒツ', 'かなら(ず)', 'tất yếu, nhất định', '{必|かなら}ず (nhất định — Bài 16) · {必要|ひつよう} (cần thiết)', '✍ N3'],
        ['要', 'YẾU', 'ヨウ', 'い(る)', 'cần; trọng yếu', '{必要|ひつよう} (cần thiết) · {要|い}る (cần) · {重要|じゅうよう} (quan trọng — N3; 重 Bài 17) · {不要|ふよう} (không cần — N2)', '✍ N3'],
        ['成', 'THÀNH', 'セイ・ジョウ', 'な(る)・な(す)', 'thành, làm nên', '{成績|せいせき} (thành tích, điểm) · {成功|せいこう} (thành công — N3) · {成長|せいちょう} (lớn lên, tăng trưởng — N3) · {成人|せいじん} (người trưởng thành)', '✍ N3'],
        ['績', 'TÍCH', 'セキ', '—', 'thành quả tích luỹ', '{成績|せいせき} (thành tích) · {実績|じっせき} (thành tích thực tế — N2)', '👁 N3'],
        ['格', 'CÁCH', 'カク・コウ', '—', 'khuôn, chuẩn; tư cách', '{合格|ごうかく} (đỗ — "đạt chuẩn") · {性格|せいかく} (tính cách — N3) · {資格|しかく} (chứng chỉ — N3) · {格好|かっこう} (dáng vẻ — N3)', '👁 N3'],
        ['復', 'PHỤC', 'フク', '—', 'trở lại, làm lại', '{復習|ふくしゅう} (ôn tập) · {往復|おうふく} (khứ hồi — N3) · {回復|かいふく} (hồi phục — N2)', '👁 N3'],
        ['増', 'TĂNG', 'ゾウ', 'ふ(える)・ふ(やす)・ま(す)', 'tăng thêm', '{増|ふ}える (tăng) · {増|ふ}やす (làm tăng) · {増加|ぞうか} (gia tăng — N2)', '✍ N3'],
        ['減', 'GIẢM', 'ゲン', 'へ(る)・へ(らす)', 'giảm bớt', '{減|へ}る (giảm) · {減|へ}らす (cắt giảm) · {減少|げんしょう} (sụt giảm — N2) · お{腹|なか}が{減|へ}る (đói bụng)', '✍ N3'],
        ['禁', 'CẤM', 'キン', '—', 'cấm', '{禁煙|きんえん} (cấm hút thuốc; bỏ thuốc) · {禁止|きんし} (cấm — N3) · {立入禁止|たちいりきんし} (cấm vào — biển báo)', '👁 N3'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**標** = 木 (cây, gỗ) + 票 (gợi âm ヒョウ): mẹo — cái cọc gỗ cắm làm **MỐC** để nhìn tới = TIÊU → {目標|もくひょう} (cái mốc mắt nhắm tới), {標識|ひょうしき} (biển báo).',
        '**努** = 奴 (gợi âm ド) + 力 (sức): dồn **hết sức** mà làm = NỖ (lực) → {努力|どりょく}. Khác 怒 (giận — Bài 19): dưới là 心, không phải 力.',
        '**健** = 亻 (người) + 建 (gợi âm ケン; dựng, xây — Bài 18): người đứng **vững** như toà nhà mới dựng = KHOẺ → {健康|けんこう}.',
        '**康** — gốc chữ là 庚 (gợi âm コウ) thêm nét chấm (vốn vẽ hạt thóc). Mẹo nhìn (không phải gốc): dưới mái nhà 广 có bàn tay (⺕) và nước (氺) — nhà có lương thực, nước uống thì **yên ổn, khoẻ** = KHANG → {健康|けんこう}.',
        '**貯** = 貝 (vỏ sò — tiền thời xưa) + 宁 (gợi âm チョ; vốn vẽ cái tủ cất đồ): cất tiền vào tủ = **TRỮ, để dành** → {貯金|ちょきん}. Cùng bộ 貝 với 財 ({財布|さいふ}).',
        '**続** = 糸 (sợi chỉ) + 売 (chữ cũ 續 = 糸 + 賣 — gợi âm): nối sợi chỉ cho dài thêm = **TIẾP TỤC** → {続|つづ}く, {続|つづ}ける. Khác 読 (đọc — trái là 言) và 売 (bán).',
        '**必** — mẹo nhìn (không phải gốc): một nét phẩy **cắt qua 心** (lòng) — đã quyết trong lòng thì **nhất định** làm = TẤT → {必|かなら}ず, {必要|ひつよう}. ⚠ Thứ tự nét của 必 đặc biệt — xem hoạt hình, đừng viết 心 trước rồi mới gạch.',
        '**要** = 襾 (phần trên) + 女: gốc vẽ người phụ nữ chống hai tay vào **eo** (腰) — eo là chỗ **trọng yếu** của thân = YẾU → {重要|じゅうよう}, {必要|ひつよう}, {要|い}る (cần).',
        '**成** = 戊 (cái rìu) + 丁 (gợi âm): cầm công cụ làm cho **xong** = THÀNH → {成績|せいせき}, {成功|せいこう}. Chữ 城 (thành trì — N3) = 土 + 成.',
        '**績** = 糸 (sợi) + 責 (gợi âm セキ): xe sợi từng chút, **tích dần** thành cuộn = TÍCH → thành quả tích luỹ: {成績|せいせき}. Khác 積 (chất đống — trái là 禾).',
        '**格** = 木 (gỗ) + 各 (gợi âm カク): cái khung gỗ — **khuôn, chuẩn** = CÁCH → {合格|ごうかく} = "hợp cách" = **đạt chuẩn** → đỗ. {性格|せいかく} = khuôn của tính tình.',
        '**復** = 彳 (bước đi) + 复 (đi rồi quay lại): đi **trở lại** con đường cũ = PHỤC → {復習|ふくしゅう} (học lại), {往復|おうふく} (đi và về). Khác 複 (phức — trái 衤 áo) và 腹 (bụng — trái 月).',
        '**増** = 土 (đất) + 曽 (gợi âm ゾウ; chồng lớp): đắp đất **chồng thêm lớp** = TĂNG → {増|ふ}える, {増|ふ}やす.',
        '**減** = 氵 (nước) + 咸 (gợi âm ゲン): nước **vơi đi** = GIẢM → {減|へ}る, {減|へ}らす. Khác 感 (cảm — {感想|かんそう}): 感 có 心 ở dưới, không có 氵.',
        '**禁** = 林 (rừng) + 示 (bàn thờ, thần linh): khu rừng thiêng có thần — **không được vào** = CẤM → {禁止|きんし}, {禁煙|きんえん}.',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['標', '—', '{目標|もくひょう} (ヒョウ)', 'もく**ひょう** — trường âm, không ~~もくひょ~~'],
        ['努', '({努|つと}める — N2)', '{努力|どりょく} (ド)', '**ど**りょく — ど ngắn, không ~~どうりょく~~'],
        ['健', '({健|すこ}やか — N1)', '{健康|けんこう} (ケン)', 'けん**こう** — không ~~けんごう~~'],
        ['康', '—', '{健康|けんこう} (コウ)', 'trường âm **kou**'],
        ['貯', '({貯|た}める)', '{貯金|ちょきん} (チョ)', '**ちょ**きん — ngắn, không ~~ちょうきん~~'],
        ['続', '{続|つづ}く, {続|つづ}ける', '{連続|れんぞく} (ゾク)', 'つ**づ**く — viết **づ**, không ~~つずく~~'],
        ['必', '{必|かなら}ず', '{必要|ひつよう} (ヒツ)', '**ひつ**よう — không ~~ひっよう~~'],
        ['要', '{要|い}る (cần)', '{必要|ひつよう}, {重要|じゅうよう} (ヨウ)', '{要|い}る (cần — nhóm 1) ≠ いる (có, ở — nhóm 2)!'],
        ['成', '({成|な}る — N1)', '{成績|せいせき} (セイ)', '**せい**せき'],
        ['績', '—', '{成績|せいせき} (セキ)', 'せい**せき** — không ~~せいせい~~'],
        ['格', '—', '{合格|ごうかく}, {性格|せいかく} (カク)', 'ごう**かく** — 合 đọc **ごう** trong từ này'],
        ['復', '—', '{復習|ふくしゅう}, {往復|おうふく} (フク)', '**ふく**しゅう — không ~~ふっしゅう~~'],
        ['増', '{増|ふ}える, {増|ふ}やす', '{増加|ぞうか} (ゾウ)', 'ふ**え**る (tự) ↔ ふ**や**す (tha)'],
        ['減', '{減|へ}る, {減|へ}らす', '{減少|げんしょう} (ゲン)', '{減|へ}る là **nhóm 1** (へります)'],
        ['禁', '—', '{禁煙|きんえん}, {禁止|きんし} (キン)', 'きん**えん** — romaji **kin\'en**'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['標 (mốc)', '票 (phiếu — {投票|とうひょう})', '標 = 木 + 票; thiếu 木 là 票'],
        ['努 (gắng sức)', '怒 (giận — Bài 19)', 'cùng 奴 ở trên; dưới 努 là 力, dưới 怒 là 心'],
        ['健 (khoẻ)', '建 (xây — Bài 18)', '健 = 亻 + 建'],
        ['貯 (để dành)', '財 ({財布|さいふ})', 'cùng 貝 bên trái; phải 貯 là 宁, phải 財 là 才'],
        ['続 (tiếp)', '読 (đọc)・売 (bán)', 'cùng 売; trái 続 là 糸, trái 読 là 言'],
        ['必 (nhất định)', '心 (lòng — Bài 15)', '必 có thêm một nét phẩy cắt qua'],
        ['要 (cần)', '票 (phiếu)', 'cùng 覀 ở trên; dưới 要 là 女, dưới 票 là 示'],
        ['績 (thành tích)', '積 (chất đống — {面積|めんせき})', 'cùng 責; trái 績 là 糸, trái 積 là 禾'],
        ['格 (chuẩn)', '絡 ({連絡|れんらく})', 'cùng 各; trái 格 là 木, trái 絡 là 糸'],
        ['復 (trở lại)', '複 (phức)・腹 (bụng — お{腹|なか})', 'trái: 復 là 彳, 複 là 衤, 腹 là 月'],
        ['増 (tăng)', '贈 (tặng — {贈|おく}り{物|もの})', 'cùng 曽; trái 増 là 土, trái 贈 là 貝'],
        ['減 (giảm)', '感 (cảm — {感想|かんそう})', '減 có 氵 bên trái; 感 có 心 ở dưới'],
        ['禁 (cấm)', '林 (rừng)・森 (rừng rậm)', '禁 = 林 + 示 ở dưới'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b21-doc-kanji',
      title: 'Đọc KHÔNG furigana — 20 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: '{今年|ことし}の{目標|もくひょう}は、N3に{合格|ごうかく}することです。', ro: 'Kotoshi no mokuhyou wa, enu-san ni goukaku suru koto desu.', vi: 'Mục tiêu năm nay là đỗ N3.' },
        { text: '{毎日|まいにち}{努力|どりょく}すれば、{必|かなら}ず{上手|じょうず}になります。', ro: 'Mainichi doryoku sureba, kanarazu jouzu ni narimasu.', vi: 'Nếu nỗ lực mỗi ngày thì nhất định sẽ giỏi.' },
        { text: '{健康|けんこう}のために、{毎朝|まいあさ}{歩|ある}いています。', ro: 'Kenkou no tame ni, maiasa aruite imasu.', vi: 'Vì sức khoẻ, sáng nào tôi cũng đi bộ.' },
        { text: '{先月|せんげつ}、{会社|かいしゃ}で{健康診断|けんこうしんだん}がありました。', ro: 'Sengetsu, kaisha de kenkou shindan ga arimashita.', vi: 'Tháng trước ở công ty có đợt khám sức khoẻ.' },
        { text: '{車|くるま}を{買|か}うために、{貯金|ちょきん}しています。', ro: 'Kuruma o kau tame ni, chokin shite imasu.', vi: 'Để mua ô tô, tôi đang để dành tiền.' },
        { text: '{雨|あめ}が{三日|みっか}も{続|つづ}いています。', ro: 'Ame ga mikka mo tsuzuite imasu.', vi: 'Mưa kéo dài đến ba ngày rồi.' },
        { text: '{少|すこ}しずつでも{勉強|べんきょう}を{続|つづ}けることが{大切|たいせつ}です。', ro: 'Sukoshi zutsu demo benkyou o tsuzukeru koto ga taisetsu desu.', vi: 'Dù từng chút một, tiếp tục học là điều quan trọng.' },
        { text: '{留学|りゅうがく}するためには、ビザが{必要|ひつよう}です。', ro: 'Ryuugaku suru tame ni wa, biza ga hitsuyou desu.', vi: 'Muốn du học thì cần visa.' },
        { text: '{今日|きょう}は{晴|は}れるから、{傘|かさ}は{要|い}りません。', ro: 'Kyou wa hareru kara, kasa wa irimasen.', vi: 'Hôm nay trời nắng nên không cần ô.' },
        { text: '{毎日|まいにち}{復習|ふくしゅう}したら、{成績|せいせき}が{上|あ}がりました。', ro: 'Mainichi fukushuu shitara, seiseki ga agarimashita.', vi: 'Ôn bài mỗi ngày thì điểm số đã tăng.' },
        { text: '{試験|しけん}に{合格|ごうかく}して、とてもうれしいです。', ro: 'Shiken ni goukaku shite, totemo ureshii desu.', vi: 'Thi đỗ nên tôi rất vui.' },
        { text: '{彼女|かのじょ}は{明|あか}るい{性格|せいかく}です。', ro: 'Kanojo wa akarui seikaku desu.', vi: 'Cô ấy có tính cách vui vẻ.' },
        { text: '{東京|とうきょう}まで{往復|おうふく}でいくらですか。', ro: 'Toukyou made oufuku de ikura desu ka.', vi: 'Đi Tokyo khứ hồi bao nhiêu tiền?' },
        { text: '{仕事|しごと}の{成功|せいこう}のために、{毎日|まいにち}{準備|じゅんび}しています。', ro: 'Shigoto no seikou no tame ni, mainichi junbi shite imasu.', vi: 'Để công việc thành công, ngày nào tôi cũng chuẩn bị.' },
        { text: '{最近|さいきん}、この{町|まち}に{住|す}む{外国人|がいこくじん}が{増|ふ}えています。', ro: 'Saikin, kono machi ni sumu gaikokujin ga fuete imasu.', vi: 'Gần đây người nước ngoài sống ở thị trấn này đang tăng.' },
        { text: '{貯金|ちょきん}を{増|ふ}やすために、{外食|がいしょく}を{減|へ}らしました。', ro: 'Chokin o fuyasu tame ni, gaishoku o herashimashita.', vi: 'Để tăng tiền tiết kiệm, tôi đã giảm ăn ngoài.' },
        { text: '{一か月|いっかげつ}で{体重|たいじゅう}が{三|さん}キロ{減|へ}りました。', ro: 'Ikkagetsu de taijuu ga san-kiro herimashita.', vi: 'Một tháng cân nặng giảm 3 kg.' },
        { text: 'ここは{禁煙|きんえん}です。たばこは{外|そと}でお{願|ねが}いします。', ro: 'Koko wa kin\'en desu. Tabako wa soto de onegai shimasu.', vi: 'Ở đây cấm hút thuốc. Xin hút ở bên ngoài.' },
        { text: '{美術館|びじゅつかん}の{中|なか}で{写真|しゃしん}を{撮|と}ることは{禁止|きんし}です。', ro: 'Bijutsukan no naka de shashin o toru koto wa kinshi desu.', vi: 'Trong bảo tàng mỹ thuật cấm chụp ảnh.' },
        { text: '{目標|もくひょう}を{立|た}てて、{毎日|まいにち}{努力|どりょく}を{続|つづ}けています。', ro: 'Mokuhyou o tatete, mainichi doryoku o tsuzukete imasu.', vi: 'Tôi đặt mục tiêu và tiếp tục nỗ lực mỗi ngày.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b21-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 40 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{私|わたし}の{今年|ことし}の{目標|もくひょう}は、N3に{合格|ごうかく}することです。そのために、{毎朝|まいあさ}{単語|たんご}を{覚|おぼ}えて、{夜|よる}は{必|かなら}ず{復習|ふくしゅう}することにしています。{最初|さいしょ}は{大変|たいへん}でしたが、{三|さん}か{月|げつ}{続|つづ}けて、{成績|せいせき}も{少|すこ}しずつ{上|あ}がってきました。', ro: 'Watashi no kotoshi no mokuhyou wa, enu-san ni goukaku suru koto desu. Sono tame ni, maiasa tango o oboete, yoru wa kanarazu fukushuu suru koto ni shite imasu. Saisho wa taihen deshita ga, sankagetsu tsuzukete, seiseki mo sukoshi zutsu agatte kimashita.', vi: 'Mục tiêu năm nay của tôi là đỗ N3. Vì vậy, sáng nào tôi cũng học thuộc từ, tối thì đặt lệ nhất định ôn bài. Lúc đầu vất vả, nhưng sau ba tháng duy trì, điểm số cũng dần dần tăng lên.' },
        { text: '{父|ちち}は{去年|きょねん}の{健康診断|けんこうしんだん}のあと、たばこをやめることにしました。{家|いえ}の{中|なか}も{禁煙|きんえん}になりました。{毎日|まいにち}{歩|ある}くようにしたら、{体重|たいじゅう}が{五|ご}キロ{減|へ}って、{前|まえ}より{元気|げんき}になりました。', ro: 'Chichi wa kyonen no kenkou shindan no ato, tabako o yameru koto ni shimashita. Ie no naka mo kin\'en ni narimashita. Mainichi aruku you ni shitara, taijuu ga go-kiro hette, mae yori genki ni narimashita.', vi: 'Sau đợt khám sức khoẻ năm ngoái, bố tôi quyết định bỏ thuốc. Trong nhà cũng thành cấm hút thuốc. Từ khi cố đi bộ mỗi ngày, cân nặng của bố giảm 5 kg và bố khoẻ hơn trước.' },
        { text: '{日本|にほん}の{大学院|だいがくいん}に{留学|りゅうがく}するために、{毎月|まいつき}{二万円|にまんえん}ずつ{貯金|ちょきん}しています。{必要|ひつよう}ない{物|もの}は{買|か}わないようにして、{外食|がいしょく}も{減|へ}らしました。{貯金|ちょきん}が{少|すこ}しずつ{増|ふ}えるのを{見|み}ると、もっと{頑張|がんば}ろうと{思|おも}います。', ro: 'Nihon no daigakuin ni ryuugaku suru tame ni, maitsuki niman\'en zutsu chokin shite imasu. Hitsuyou nai mono wa kawanai you ni shite, gaishoku mo herashimashita. Chokin ga sukoshi zutsu fueru no o miru to, motto ganbarou to omoimasu.', vi: 'Để du học cao học ở Nhật, mỗi tháng tôi để dành đều 20.000 yên. Tôi cố không mua đồ không cần thiết, và đã giảm ăn ngoài. Nhìn tiền tiết kiệm tăng dần, tôi lại muốn cố gắng hơn nữa.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (12 câu)',
      items: [
        { q: '{新|あたら}しい**目標**を{立|た}てました。', options: ['もくひょ', 'もくひょう', 'めひょう', 'もっひょう'], correct: 1, why: '**{目標|もくひょう}** (mokuhyou) — 標 đọc ヒョウ, có trường âm.' },
        { q: '{毎日|まいにち}**努力**しています。', options: ['どりょく', 'どうりょく', 'ぬりょく', 'どりき'], correct: 0, why: '**{努力|どりょく}** (doryoku) — ど ngắn.' },
        { q: '**健康**のために{野菜|やさい}を{食|た}べます。', options: ['けんごう', 'けいこう', 'けんこう', 'けんきょう'], correct: 2, why: '**{健康|けんこう}** (kenkou).' },
        { q: '{毎月|まいつき}**貯金**しています。', options: ['ちょうきん', 'たきん', 'ちょっきん', 'ちょきん'], correct: 3, why: '**{貯金|ちょきん}** (chokin) — ちょ ngắn.' },
        { q: '{雨|あめ}が**続**いています。', options: ['つづ', 'つず', 'ぞく', 'つぐ'], correct: 0, why: '**{続|つづ}いて** (tsuzuite) — viết bằng **づ**.' },
        { q: 'この{本|ほん}はもう**要**りません。', options: ['よう', 'い', 'かなめ', 'いる'], correct: 1, why: '**{要|い}りません** (irimasen) — 要 đọc い, đuôi りません là kana.' },
        { q: '{今学期|こんがっき}は**成績**がよかったです。', options: ['せいしゃく', 'じょうせき', 'せいせき', 'せいぜき'], correct: 2, why: '**{成績|せいせき}** (seiseki).' },
        { q: '{大学|だいがく}に**合格**しました。', options: ['あいかく', 'ごうかく', 'ごかく', 'ごうがく'], correct: 1, why: '**{合格|ごうかく}** (goukaku) — 合 đọc ごう.' },
        { q: '{習|なら}ったことを**復習**します。', options: ['ふっしゅう', 'ふくしゅ', 'ふくしゅく', 'ふくしゅう'], correct: 3, why: '**{復習|ふくしゅう}** (fukushuu).' },
        { q: '{体重|たいじゅう}が**増**えました。', options: ['ふ', 'ぞう', 'ま', 'ふや'], correct: 0, why: '**{増|ふ}えました** (fuemashita).' },
        { q: '{外食|がいしょく}を**減**らしました。', options: ['げん', 'へ', 'へら', 'さ'], correct: 1, why: '**{減|へ}らしました** (herashimashita) — 減 đọc へ, đuôi らしました là kana.' },
        { q: 'ここは**禁煙**です。', options: ['きんえん', 'きんけむ', 'ぎんえん', 'きえん'], correct: 0, why: '**{禁煙|きんえん}** (kin\'en).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (8 câu)',
      items: [
        { q: '{今年|ことし}の**もくひょう**は{何|なん}ですか。', options: ['目票', '目標', '木標', '目漂'], correct: 1, why: '**目標** — 標 = 木 + 票. Thiếu 木 là 票 (phiếu).' },
        { q: '{毎日|まいにち}**どりょく**しています。', options: ['怒力', '奴力', '努力', '努刀'], correct: 2, why: '**努力** — dưới là 力. 怒 (giận) dưới là 心.' },
        { q: '**けんこう**に{気|き}をつけてください。', options: ['健康', '建康', '健庫', '建庫'], correct: 0, why: '**健康** — 健 = 亻 + 建.' },
        { q: '{勉強|べんきょう}を**つづけて**います。', options: ['読けて', '売けて', '続けて', '統けて'], correct: 2, why: '**続ける** — 糸 + 売. 読 có 言.' },
        { q: '{旅行|りょこう}にはパスポートが**ひつよう**です。', options: ['必要', '心要', '必票', '必腰'], correct: 0, why: '**必要** — 必 có nét phẩy cắt qua 心; 要 dưới là 女.' },
        { q: '**せいせき**が{上|あ}がりました。', options: ['成積', '城績', '成責', '成績'], correct: 3, why: '**成績** — 績 trái là 糸. 積 trái là 禾.' },
        { q: '{毎晩|まいばん}**ふくしゅう**しています。', options: ['複習', '復習', '腹習', '復集'], correct: 1, why: '**復習** — 復 trái là 彳 (bước đi). 複 có 衤, 腹 có 月.' },
        { q: '{体重|たいじゅう}が**へりました**。', options: ['感りました', '減りました', '滅りました', '咸りました'], correct: 1, why: '**減る** — 氵 + 咸. 感 (cảm) có 心 dưới.' },
      ],
    },
    {
      t: 'write',
      id: 'b21-viet-kanji',
      title: 'Tập viết — 6 chữ ✍ và 8 từ',
      note: 'Viết 6 chữ ✍ trước (đúng thứ tự nét theo hoạt hình — chú ý chữ 必), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['続', '必', '要', '成', '増', '減', '目標', '努力', '健康', '貯金', '必要', '成績', '合格', '復習'],
      goi: {
        '目標': 'もくひょう · mục tiêu',
        '努力': 'どりょく · nỗ lực',
        '健康': 'けんこう · sức khoẻ',
        '貯金': 'ちょきん · để dành tiền',
        '必要': 'ひつよう · cần thiết',
        '成績': 'せいせき · thành tích, điểm',
        '合格': 'ごうかく · đỗ',
        '復習': 'ふくしゅう · ôn tập',
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
  id: 'b21-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N4 — 6 bài theo đủ 4 dạng đề: 課題理解 · ポイント理解 · 発話表現 · 即時応答',
  goal: 'Nghe hai người bàn chuyện đăng ký thi JLPT và một người đăng ký phòng tập để biết việc phải làm TRƯỚC giữa nhiều quy định "～ことになっています"; nghe để bắt đúng lý do một người quyết định bỏ thuốc (～ことにしました) và cách học đã giúp một người nói được tiếng Anh (～ようになりました); chọn câu nói đúng khi nhắc bạn, khi báo quyết định, khi hứa, khi kể thay đổi; đáp nhanh câu có ～ために, ～ように, ～ようになる, ～ようにする, ～ことにする, ～ことになる — đúng 4 dạng của phần 聴解 đề N4.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N4 — 4 dạng, 35 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó phải làm **trước / tiếp theo**.', 'Việc **đã làm rồi** (～てある, もう～た) và việc **người kia nhận làm** (～ておくよ) → loại. Quy định **～ことになっています** cho biết thứ tự bắt buộc. Câu chốt thường có **まず**.'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó.', 'Lý do bị **phủ định** (**それが理由じゃないんです**, **～けど、続きませんでした**) là bẫy. Lý do thật thường nằm sau **実は** hoặc **～ことにしたんです**.'],
        ['問題3', '発話表現 (nói gì trong tình huống)', 'Nghe mô tả tình huống, chọn câu nên nói.', 'Nhắc người khác → **～ないようにしてね**; báo quyết định của mình → **～ことにしました**; hứa → **～ようにします**; kể thay đổi → **～ようになりました**.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', 'Nghe kỹ **する ↔ なる** ở cuối: câu đáp lặp lại từ của câu hỏi nhưng đổi する/なる thường là câu sai.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        '**ために／ように** nghe gần giống nhau ở tốc độ thật: **ため・に** (ta-me-ni) ↔ **よう・に** (yo-o-ni). Mẹo: nghe động từ ĐỨNG TRƯỚC — có **thể khả năng** (～える／～られる) hay **ない** thì gần như chắc là ように.',
        '**ようにしている ↔ ようになった** — nghe phần cuối: **して・いる** (đang cố) ↔ **なっ・た** (đã thành). **ことにした ↔ ことになった** — nghe **し・た** ↔ **なっ・た**.',
        '**～ことになっています** (theo quy định) rất hay xuất hiện ở quầy lễ tân, văn phòng, ký túc xá — đó là thông tin **bắt buộc** người nghe phải làm theo.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: đăng ký kỳ thi JLPT' },
    NG('b21-ng-1', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — ảnh đã chụp sẵn (～てある), bản đồ người đàn ông nhận tìm; tiền phí trả SAU khi đăng ký. Chờ câu "まず…".', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Một người đàn ông và một người phụ nữ đang nói chuyện. Sau đây người phụ nữ trước tiên sẽ làm gì?'],
      ['ダニエル', 'ja-nam', 'アンナさん、12{月|がつ}の{試験|しけん}、もう{申|もう}し{込|こ}んだ？', 'Anna-san, juunigatsu no shiken, mou moushikonda?', 'Anna, kỳ thi tháng 12 cậu đăng ký chưa?'],
      ['アンナ', 'ja-nu', 'まだなの。{今日|きょう}しようと{思|おも}って。インターネットで{申|もう}し{込|こ}むんだよね？', 'Mada na no. Kyou shiyou to omotte. Intaanetto de moushikomu n da yo ne?', 'Chưa. Mình định hôm nay làm. Đăng ký qua mạng đúng không?'],
      ['ダニエル', 'ja-nam', 'うん。でも、{申|もう}し{込|こ}みには{顔|かお}の{写真|しゃしん}が{必要|ひつよう}だよ。', 'Un. Demo, moushikomi ni wa kao no shashin ga hitsuyou da yo.', 'Ừ. Nhưng đăng ký thì cần ảnh chân dung đấy.'],
      ['アンナ', 'ja-nu', '{写真|しゃしん}なら、{先週|せんしゅう}{撮|と}ってあるから{大丈夫|だいじょうぶ}。', 'Shashin nara, senshuu totte aru kara daijoubu.', 'Ảnh thì mình chụp sẵn từ tuần trước rồi nên không sao.'],
      ['ダニエル', 'ja-nam', 'そう。それから、{受験料|じゅけんりょう}はコンビニで{払|はら}うことになっているよ。{申|もう}し{込|こ}んでから{三日|みっか}{以内|いない}に{払|はら}わなければならないんだ。', 'Sou. Sorekara, jukenryou wa konbini de harau koto ni natte iru yo. Moushikonde kara mikka inai ni harawanakereba naranai n da.', 'Vậy à. Còn nữa, theo quy định lệ phí thi trả ở cửa hàng tiện lợi. Đăng ký xong phải trả trong vòng ba ngày.'],
      ['アンナ', 'ja-nu', '{三日|みっか}{以内|いない}ね。じゃ、{申|もう}し{込|こ}みが{終|お}わったら、すぐ{払|はら}いに{行|い}く。', 'Mikka inai ne. Ja, moushikomi ga owattara, sugu harai ni iku.', 'Trong vòng ba ngày nhỉ. Vậy đăng ký xong là mình đi trả luôn.'],
      ['ダニエル', 'ja-nam', '{会場|かいじょう}はたぶん{去年|きょねん}と{同|おな}じ{大学|だいがく}だと{思|おも}うけど、{地図|ちず}は{僕|ぼく}が{調|しら}べておくよ。', 'Kaijou wa tabun kyonen to onaji daigaku da to omou kedo, chizu wa boku ga shirabete oku yo.', 'Địa điểm thi chắc vẫn là trường đại học như năm ngoái, bản đồ thì để mình tìm sẵn cho.'],
      ['アンナ', 'ja-nu', 'ありがとう。じゃ、{締|し}め{切|き}りに{遅|おく}れないように、まずパソコンで{申|もう}し{込|こ}むね。', 'Arigatou. Ja, shimekiri ni okurenai you ni, mazu pasokon de moushikomu ne.', 'Cảm ơn. Vậy để không trễ hạn, trước tiên mình đăng ký trên máy tính đã.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b21-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{写真|しゃしん}を{撮|と}りに{行|い}く', 'インターネットで{申|もう}し{込|こ}む', 'コンビニで{受験料|じゅけんりょう}を{払|はら}う', '{会場|かいじょう}の{地図|ちず}を{調|しら}べる'], correct: 1, why: 'Ảnh → **{撮|と}ってある** (đã xong — bẫy ①); lệ phí → trả **sau khi đăng ký** (bẫy ②); bản đồ → **{僕|ぼく}が{調|しら}べておく** (người kia làm — bẫy ③). Câu chốt: **まずパソコンで{申|もう}し{込|こ}むね**. 〔Mazu pasokon de moushikomu ne.〕' },
        { q: '{受験料|じゅけんりょう}はいつまでに{払|はら}わなければなりませんか。', options: ['{試験|しけん}の{日|ひ}まで', '{申|もう}し{込|こ}む{前|まえ}', '{申|もう}し{込|こ}んでから{三日|みっか}{以内|いない}', '{今週|こんしゅう}の{金曜日|きんようび}まで'], correct: 2, why: '**{申|もう}し{込|こ}んでから{三日|みっか}{以内|いない}に{払|はら}わなければならない** — và **コンビニで{払|はら}うことになっている** (quy định). 〔Moushikonde kara mikka inai.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: lần đầu đến phòng tập' },
    NG('b21-ng-2', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — nhiều quy định "～ことになっています"; giày đã mang theo; buổi hướng dẫn 2 giờ còn chưa tới. Chờ câu "では、まず…".', [
      ['ナレーター', 'ja-nu', 'スポーツセンターの{受付|うけつけ}で、{男|おとこ}の{人|ひと}と{受付|うけつけ}の{人|ひと}が{話|はな}しています。{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Supootsu sentaa no uketsuke de, otoko no hito to uketsuke no hito ga hanashite imasu. Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Ở quầy lễ tân trung tâm thể thao, một người đàn ông và nhân viên lễ tân đang nói chuyện. Sau đây người đàn ông trước tiên sẽ làm gì?'],
      ['{受付|うけつけ}の{人|ひと}', 'ja-nu', 'こんにちは。トレーニングルームのご{利用|りよう}ですか。', 'Konnichiwa. Toreeningu ruumu no goriyou desu ka.', 'Xin chào. Anh muốn dùng phòng tập ạ?'],
      ['カルロス', 'ja-nam', 'はい。{初|はじ}めてなんですが……。', 'Hai. Hajimete na n desu ga…….', 'Vâng. Tôi đến lần đầu…'],
      ['{受付|うけつけ}の{人|ひと}', 'ja-nu', '{初|はじ}めての{方|かた}は、まず{機械|きかい}の{使|つか}い{方|かた}の{説明|せつめい}を{受|う}けることになっています。{説明|せつめい}は{毎日|まいにち}2{時|じ}と5{時|じ}からです。', 'Hajimete no kata wa, mazu kikai no tsukaikata no setsumei o ukeru koto ni natte imasu. Setsumei wa mainichi niji to goji kara desu.', 'Theo quy định, người đến lần đầu phải nghe hướng dẫn cách dùng máy trước. Buổi hướng dẫn hằng ngày bắt đầu lúc 2 giờ và 5 giờ.'],
      ['カルロス', 'ja-nam', '{今|いま}、1{時半|じはん}ですね。じゃ、2{時|じ}の{説明|せつめい}に{出|で}ます。', 'Ima, ichiji han desu ne. Ja, niji no setsumei ni demasu.', 'Bây giờ là 1 rưỡi nhỉ. Vậy tôi sẽ dự buổi hướng dẫn lúc 2 giờ.'],
      ['{受付|うけつけ}の{人|ひと}', 'ja-nu', 'その{前|まえ}に、こちらの{申込書|もうしこみしょ}にお{名前|なまえ}とご{住所|じゅうしょ}を{書|か}いてください。それから、{会員|かいいん}カードを{作|つく}るために、{写真|しゃしん}を{一枚|いちまい}{撮|と}ります。', 'Sono mae ni, kochira no moushikomisho ni onamae to gojuusho o kaite kudasai. Sorekara, kaiin kaado o tsukuru tame ni, shashin o ichimai torimasu.', 'Trước đó, anh hãy viết tên và địa chỉ vào tờ đơn này. Sau đó, để làm thẻ hội viên, chúng tôi sẽ chụp một tấm ảnh.'],
      ['カルロス', 'ja-nam', 'わかりました。あのう、{中|なか}で{使|つか}う{靴|くつ}が{必要|ひつよう}ですか。', 'Wakarimashita. Anou, naka de tsukau kutsu ga hitsuyou desu ka.', 'Tôi hiểu rồi. À, có cần giày đi trong nhà không ạ?'],
      ['{受付|うけつけ}の{人|ひと}', 'ja-nu', 'はい。でも、お{持|も}ちでなければ、ここで{借|か}りられますよ。', 'Hai. Demo, omochi de nakereba, koko de kariraremasu yo.', 'Có ạ. Nhưng nếu anh không có thì có thể mượn ở đây.'],
      ['カルロス', 'ja-nam', '{靴|くつ}は{持|も}ってきました。', 'Kutsu wa motte kimashita.', 'Giày thì tôi mang theo rồi.'],
      ['{受付|うけつけ}の{人|ひと}', 'ja-nu', 'では、まずこちらに{書|か}いてください。{写真|しゃしん}は{書|か}き{終|お}わってから{撮|と}りますね。', 'Dewa, mazu kochira ni kaite kudasai. Shashin wa kakiowatte kara torimasu ne.', 'Vậy trước tiên anh viết vào đây giúp tôi. Ảnh thì viết xong rồi mới chụp ạ.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người đàn ông trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b21-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{機械|きかい}の{説明|せつめい}を{聞|き}く', '{写真|しゃしん}を{撮|と}る', '{申込書|もうしこみしょ}に{名前|なまえ}と{住所|じゅうしょ}を{書|か}く', '{靴|くつ}を{借|か}りる'], correct: 2, why: 'Hướng dẫn lúc **2 giờ** (giờ mới 1 rưỡi — bẫy ①); ảnh chụp **sau khi viết xong** (bẫy ②); giày **đã mang theo** (bẫy ③). Câu chốt: **では、まずこちらに{書|か}いてください**. 〔Mazu kochira ni kaite kudasai.〕' },
        { q: '{初|はじ}めての{人|ひと}は、どうすることになっていますか。', options: ['{会員|かいいん}カードを{買|か}う', '{機械|きかい}の{使|つか}い{方|かた}の{説明|せつめい}を{受|う}ける', '{靴|くつ}を{必|かなら}ず{借|か}りる', '5{時|じ}{以降|いこう}に{来|く}る'], correct: 1, why: '**{初|はじ}めての{方|かた}は、まず{機械|きかい}の{使|つか}い{方|かた}の{説明|せつめい}を{受|う}けることになっています** (quy định của trung tâm). 〔Setsumei o ukeru koto ni natte imasu.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: vì sao anh ấy bỏ thuốc?' },
    NG('b21-ng-3', '{男|おとこ}の{人|ひと}はどうしてたばこをやめることにしましたか', 'Dạng ポイント理解 — nghe câu hỏi trước. Hai lý do bị phủ định (giá thuốc, kết quả khám); lý do thật nằm sau "実は".', [
      ['ナレーター', 'ja-nu', '{会社|かいしゃ}で{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。{男|おとこ}の{人|ひと}はどうしてたばこをやめることにしましたか。', 'Kaisha de onna no hito to otoko no hito ga hanashite imasu. Otoko no hito wa doushite tabako o yameru koto ni shimashita ka.', 'Ở công ty, một người phụ nữ và một người đàn ông đang nói chuyện. Vì sao người đàn ông quyết định bỏ thuốc?'],
      ['{山口|やまぐち}', 'ja-nu', '{西川|にしかわ}さん、{最近|さいきん}たばこを{吸|す}っていませんね。', 'Nishikawa-san, saikin tabako o sutte imasen ne.', 'Anh Nishikawa, dạo này anh không hút thuốc nhỉ.'],
      ['{西川|にしかわ}', 'ja-nam', 'ええ、{先月|せんげつ}やめることにしたんです。', 'Ee, sengetsu yameru koto ni shita n desu.', 'Vâng, tháng trước tôi quyết định bỏ rồi.'],
      ['{山口|やまぐち}', 'ja-nu', 'たばこの{値段|ねだん}が{上|あ}がったからですか。', 'Tabako no nedan ga agatta kara desu ka.', 'Vì giá thuốc lá tăng ạ?'],
      ['{西川|にしかわ}', 'ja-nam', 'それもありますけど、それが{理由|りゆう}じゃないんです。', 'Sore mo arimasu kedo, sore ga riyuu ja nai n desu.', 'Cũng có chuyện đó, nhưng đó không phải lý do.'],
      ['{山口|やまぐち}', 'ja-nu', 'じゃ、{健康診断|けんこうしんだん}の{結果|けっか}が{悪|わる}かったんですか。', 'Ja, kenkou shindan no kekka ga warukatta n desu ka.', 'Vậy là kết quả khám sức khoẻ không tốt ạ?'],
      ['{西川|にしかわ}', 'ja-nam', 'いいえ、{結果|けっか}は{問題|もんだい}ありませんでした。{実|じつ}は、{来年|らいねん}の{春|はる}、{子|こ}どもが{生|う}まれることになったんです。', 'Iie, kekka wa mondai arimasen deshita. Jitsu wa, rainen no haru, kodomo ga umareru koto ni natta n desu.', 'Không, kết quả không có vấn đề gì. Chuyện là mùa xuân năm sau tôi sẽ có con.'],
      ['{山口|やまぐち}', 'ja-nu', 'わあ、おめでとうございます！', 'Waa, omedetou gozaimasu!', 'Ôi, chúc mừng anh!'],
      ['{西川|にしかわ}', 'ja-nam', 'ありがとうございます。{子|こ}どものために、{家|いえ}ではもちろん、{外|そと}でも{吸|す}わないことにしました。', 'Arigatou gozaimasu. Kodomo no tame ni, ie de wa mochiron, soto demo suwanai koto ni shimashita.', 'Cảm ơn chị. Vì con, tôi quyết định không hút cả ở ngoài, chứ ở nhà thì đương nhiên rồi.'],
      ['{山口|やまぐち}', 'ja-nu', 'えらいですね。{私|わたし}も{応援|おうえん}します。', 'Erai desu ne. Watashi mo ouen shimasu.', 'Anh giỏi thật. Tôi cũng ủng hộ anh.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はどうしてたばこをやめることにしましたか。', 'Otoko no hito wa doushite tabako o yameru koto ni shimashita ka.', 'Vì sao người đàn ông quyết định bỏ thuốc?'],
    ]),
    {
      t: 'mcq',
      id: 'b21-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はどうしてたばこをやめることにしましたか。', options: ['たばこの{値段|ねだん}が{上|あ}がったから', '{健康診断|けんこうしんだん}の{結果|けっか}が{悪|わる}かったから', '{子|こ}どもが{生|う}まれるから', 'お{医者|いしゃ}さんがやめたほうがいいと{言|い}ったから'], correct: 2, why: 'Giá thuốc → **それが{理由|りゆう}じゃないんです** (bẫy ①); kết quả khám → **{問題|もんだい}ありませんでした** (bẫy ②). Sau **{実|じつ}は**: **{子|こ}どもが{生|う}まれることになったんです** + **{子|こ}どものために**. 〔Kodomo ga umareru koto ni natta n desu.〕' },
        { q: '{男|おとこ}の{人|ひと}はどこでたばこを{吸|す}わないことにしましたか。', options: ['{家|いえ}だけ', '{会社|かいしゃ}だけ', '{家|いえ}でも{外|そと}でも', '{子|こ}どもの{前|まえ}だけ'], correct: 2, why: '**{家|いえ}ではもちろん、{外|そと}でも{吸|す}わないことにしました** — ～はもちろん、～も = "… thì đương nhiên, cả … cũng". 〔Ie de wa mochiron, soto demo suwanai.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題2 ポイント理解: cách học giúp chị Suzuki nói được tiếng Anh' },
    NG('b21-ng-4', '{女|おんな}の{人|ひと}は、{何|なに}がいちばんよかったと{言|い}っていますか', 'Dạng ポイント理解 — hai cách học bị gạt đi (lớp học đắt, phim quá nhanh); cách thật sự hiệu quả đi với "～ことにしたんです" và "～ようになりました".', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}は、{英語|えいご}が{話|はな}せるようになるために、{何|なに}がいちばんよかったと{言|い}っていますか。', 'Otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa, eigo ga hanaseru you ni naru tame ni, nani ga ichiban yokatta to itte imasu ka.', 'Một người đàn ông và một người phụ nữ đang nói chuyện. Người phụ nữ nói điều gì đã giúp nhất để chị nói được tiếng Anh?'],
      ['カルロス', 'ja-nam', '{鈴木|すずき}さん、{英語|えいご}がとても{上手|じょうず}ですね。どうやって{勉強|べんきょう}したんですか。', 'Suzuki-san, eigo ga totemo jouzu desu ne. Dou yatte benkyou shita n desu ka.', 'Chị Suzuki, tiếng Anh của chị giỏi quá. Chị học bằng cách nào vậy?'],
      ['{鈴木|すずき}', 'ja-nu', '{最初|さいしょ}は{英会話|えいかいわ}の{教室|きょうしつ}に{通|かよ}ったんですけど、{高|たか}くて{半年|はんとし}しか{続|つづ}きませんでした。', 'Saisho wa eikaiwa no kyoushitsu ni kayotta n desu kedo, takakute hantoshi shika tsuzukimasen deshita.', 'Lúc đầu chị đi học lớp hội thoại tiếng Anh, nhưng đắt quá nên chỉ duy trì được nửa năm.'],
      ['カルロス', 'ja-nam', 'そうですか。じゃ、{映画|えいが}を{見|み}たりしましたか。', 'Sou desu ka. Ja, eiga o mitari shimashita ka.', 'Vậy ạ. Thế chị có xem phim hay gì không?'],
      ['{鈴木|すずき}', 'ja-nu', '{映画|えいが}も{見|み}てみたんですが、{話|はな}すのが{速|はや}くて、{全然|ぜんぜん}わかりませんでした。', 'Eiga mo mite mita n desu ga, hanasu no ga hayakute, zenzen wakarimasen deshita.', 'Chị cũng thử xem phim rồi, nhưng họ nói nhanh quá, chị chẳng hiểu gì.'],
      ['カルロス', 'ja-nam', 'じゃ、{何|なに}がよかったんですか。', 'Ja, nani ga yokatta n desu ka.', 'Vậy điều gì đã giúp chị?'],
      ['{鈴木|すずき}', 'ja-nu', '{毎晩|まいばん}、{寝|ね}る{前|まえ}に{英語|えいご}で{日記|にっき}を{書|か}くことにしたんです。{短|みじか}くてもいいから、{毎日|まいにち}。それを{一年|いちねん}{続|つづ}けたら、{言|い}いたいことがすぐ{英語|えいご}で{言|い}えるようになりました。', 'Maiban, neru mae ni eigo de nikki o kaku koto ni shita n desu. Mijikakute mo ii kara, mainichi. Sore o ichinen tsuzuketara, iitai koto ga sugu eigo de ieru you ni narimashita.', 'Chị quyết định tối nào trước khi ngủ cũng viết nhật ký bằng tiếng Anh. Ngắn cũng được, nhưng ngày nào cũng viết. Duy trì một năm như thế, chị đã nói ngay được bằng tiếng Anh điều mình muốn nói.'],
      ['カルロス', 'ja-nam', '{日記|にっき}ですか。いい{方法|ほうほう}ですね。{僕|ぼく}も{日本語|にほんご}でやってみます。', 'Nikki desu ka. Ii houhou desu ne. Boku mo nihongo de yatte mimasu.', 'Nhật ký ạ. Cách hay quá. Em cũng sẽ thử làm bằng tiếng Nhật.'],
      ['{鈴木|すずき}', 'ja-nu', '{書|か}いたら、{声|こえ}に{出|だ}して{読|よ}むようにするといいですよ。{発音|はつおん}の{練習|れんしゅう}にもなりますから。', 'Kaitara, koe ni dashite yomu you ni suru to ii desu yo. Hatsuon no renshuu ni mo narimasu kara.', 'Viết xong thì em nên tập thói quen đọc thành tiếng. Vì nó cũng thành bài luyện phát âm.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}は、{何|なに}がいちばんよかったと{言|い}っていますか。', 'Onna no hito wa, nani ga ichiban yokatta to itte imasu ka.', 'Người phụ nữ nói điều gì đã giúp nhất?'],
    ]),
    {
      t: 'mcq',
      id: 'b21-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}は、{何|なに}がいちばんよかったと{言|い}っていますか。', options: ['{英会話|えいかいわ}の{教室|きょうしつ}に{通|かよ}ったこと', '{英語|えいご}の{映画|えいが}を{見|み}たこと', '{毎晩|まいばん}{英語|えいご}で{日記|にっき}を{書|か}いたこと', '{外国人|がいこくじん}の{友達|ともだち}と{話|はな}したこと'], correct: 2, why: 'Lớp học → **{半年|はんとし}しか{続|つづ}きませんでした** (bẫy ①); phim → **{全然|ぜんぜん}わかりませんでした** (bẫy ②). Điều hiệu quả: **{英語|えいご}で{日記|にっき}を{書|か}くことにした** → **{言|い}えるようになりました**. 〔Eigo de nikki o kaku koto ni shita n desu.〕' },
        { q: '{女|おんな}の{人|ひと}は、{日記|にっき}を{書|か}いたあとで{何|なに}をするといいと{言|い}っていますか。', options: ['{友達|ともだち}に{見|み}せる', '{声|こえ}に{出|だ}して{読|よ}む', 'もう{一度|いちど}{書|か}く', '{先生|せんせい}に{直|なお}してもらう'], correct: 1, why: '**{声|こえ}に{出|だ}して{読|よ}むようにするといいですよ** — ～ようにする (tạo thói quen) + ～といい (nên). 〔Koe ni dashite yomu you ni suru to ii desu yo.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題3 発話表現: nói gì trong tình huống (4 câu)' },
    NG('b21-ng-5', '{何|なん}と{言|い}いますか（4{問|もん}）', 'Dạng 発話表現 — nghe mô tả tình huống, chọn 1 trong 3 câu. Cẩn thận する ↔ なる ở cuối câu.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。{友達|ともだち}がいつも{約束|やくそく}の{時間|じかん}に{遅|おく}れます。{何|なん}と{言|い}いますか。', 'Ichiban. Tomodachi ga itsumo yakusoku no jikan ni okuremasu. Nan to iimasu ka.', 'Câu 1. Bạn bạn lúc nào cũng đến muộn giờ hẹn. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{次|つぎ}は{遅|おく}れないようにしてね。 2、{次|つぎ}は{遅|おく}れるようになってね。 3、{次|つぎ}は{遅|おく}れないことになってね。', 'Ichi, tsugi wa okurenai you ni shite ne. Ni, tsugi wa okureru you ni natte ne. San, tsugi wa okurenai koto ni natte ne.', '1. Lần sau nhớ đừng muộn nhé. 2. Lần sau hãy trở nên đến muộn nhé. 3. Lần sau hãy được quyết định là không muộn nhé.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。{自分|じぶん}でよく{考|かんが}えて、{来月|らいげつ}アルバイトを{辞|や}めると{決|き}めました。{店長|てんちょう}に{何|なん}と{言|い}いますか。', 'Niban. Jibun de yoku kangaete, raigetsu arubaito o yameru to kimemashita. Tenchou ni nan to iimasu ka.', 'Câu 2. Bạn đã tự suy nghĩ kỹ và quyết định tháng sau nghỉ làm thêm. Bạn nói gì với quản lý?'],
      ['ナレーター', 'ja-nu', '1、{来月|らいげつ}でアルバイトを{辞|や}めるようになりました。 2、{来月|らいげつ}でアルバイトを{辞|や}めることにしました。 3、{来月|らいげつ}でアルバイトを{辞|や}めるためです。', 'Ichi, raigetsu de arubaito o yameru you ni narimashita. Ni, raigetsu de arubaito o yameru koto ni shimashita. San, raigetsu de arubaito o yameru tame desu.', '1. Tháng sau em đã trở nên nghỉ làm. 2. Em đã quyết định làm đến hết tháng sau thì nghỉ ạ. 3. Là để tháng sau nghỉ làm.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。{先生|せんせい}に{本|ほん}を{借|か}りました。{汚|よご}さないと{約束|やくそく}します。{何|なん}と{言|い}いますか。', 'Sanban. Sensei ni hon o karimashita. Yogosanai to yakusoku shimasu. Nan to iimasu ka.', 'Câu 3. Bạn mượn sách của thầy. Bạn hứa sẽ không làm bẩn. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{汚|よご}さないようにします。 2、{汚|よご}さないようになります。 3、{汚|よご}さないことになっています。', 'Ichi, yogosanai you ni shimasu. Ni, yogosanai you ni narimasu. San, yogosanai koto ni natte imasu.', '1. Em sẽ cố không làm bẩn ạ. 2. Em sẽ trở nên không làm bẩn. 3. Theo quy định thì không làm bẩn.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。{前|まえ}は{漢字|かんじ}が{読|よ}めませんでしたが、{今|いま}は{読|よ}めます。{友達|ともだち}に{何|なん}と{言|い}いますか。', 'Yonban. Mae wa kanji ga yomemasen deshita ga, ima wa yomemasu. Tomodachi ni nan to iimasu ka.', 'Câu 4. Trước đây bạn không đọc được chữ Hán, nhưng giờ thì đọc được. Bạn nói gì với bạn bè?'],
      ['ナレーター', 'ja-nu', '1、{最近|さいきん}、{漢字|かんじ}が{読|よ}めるようにしたよ。 2、{最近|さいきん}、{漢字|かんじ}が{読|よ}めるようになったよ。 3、{最近|さいきん}、{漢字|かんじ}を{読|よ}むことにしたよ。', 'Ichi, saikin, kanji ga yomeru you ni shita yo. Ni, saikin, kanji ga yomeru you ni natta yo. San, saikin, kanji o yomu koto ni shita yo.', '1. Gần đây mình đã thu xếp để đọc được chữ Hán. 2. Gần đây mình đã đọc được chữ Hán rồi. 3. Gần đây mình quyết định đọc chữ Hán.'],
    ]),
    {
      t: 'mcq',
      id: 'b21-ng-5-q',
      title: 'Bài 5 — chọn câu đúng',
      items: [
        { q: '{1番|いちばん} — {友達|ともだち}がいつも{遅|おく}れる', options: ['1', '2', '3'], correct: 0, why: 'Nhắc người khác giữ thành nếp → **{遅|おく}れないようにしてね**. 2 (ようになる) là "trở nên", 3 (ことになる) là "được quyết" — đều sai tình huống. 〔Tsugi wa okurenai you ni shite ne.〕' },
        { q: '{2番|にばん} — {自分|じぶん}で{辞|や}めると{決|き}めた', options: ['1', '2', '3'], correct: 1, why: 'Quyết định của chính mình → **{辞|や}めることにしました**. 〔Arubaito o yameru koto ni shimashita.〕' },
        { q: '{3番|さんばん} — {汚|よご}さないと{約束|やくそく}する', options: ['1', '2', '3'], correct: 0, why: 'Lời hứa / quyết tâm → **{汚|よご}さないようにします**. 〔Yogosanai you ni shimasu.〕' },
        { q: '{4番|よんばん} — {今|いま}は{漢字|かんじ}が{読|よ}める', options: ['1', '2', '3'], correct: 1, why: 'Thay đổi năng lực đã thành → **{読|よ}めるようになったよ**. 〔Kanji ga yomeru you ni natta yo.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題4 即時応答: đáp ngay (5 câu)' },
    NG('b21-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（5{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp. Câu đáp lặp lại từ của câu hỏi nhưng đổi する／なる thường là bẫy.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['マルコ', 'ja-nam', 'リンさん、{健康|けんこう}のために{何|なに}かしている？', 'Rin-san, kenkou no tame ni nani ka shite iru?', 'Lin ơi, cậu có làm gì vì sức khoẻ không?'],
      ['リン', 'ja-nu', '1、うん、{毎朝|まいあさ}{野菜|やさい}ジュースを{飲|の}むようにしているよ。 2、うん、{健康|けんこう}になったよ。 3、うん、{健康|けんこう}のためだよ。', 'Ichi, un, maiasa yasai juusu o nomu you ni shite iru yo. Ni, un, kenkou ni natta yo. San, un, kenkou no tame da yo.', '1. Có, sáng nào mình cũng cố uống nước ép rau. 2. Có, mình khoẻ rồi. 3. Có, là vì sức khoẻ.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。', 'Niban.', 'Câu 2.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', '{来週|らいしゅう}から、{授業|じゅぎょう}は{九時|くじ}に{始|はじ}まることになりました。', 'Raishuu kara, jugyou wa kuji ni hajimaru koto ni narimashita.', 'Từ tuần sau, giờ học sẽ bắt đầu lúc 9 giờ.'],
      ['アンナ', 'ja-nu', '1、はい、{九時|くじ}に{始|はじ}めることにします。 2、わかりました。{遅|おく}れないようにします。 3、いいですね。{始|はじ}まるようになりたいです。', 'Ichi, hai, kuji ni hajimeru koto ni shimasu. Ni, wakarimashita. Okurenai you ni shimasu. San, ii desu ne. Hajimaru you ni naritai desu.', '1. Vâng, em quyết định bắt đầu lúc 9 giờ. 2. Em hiểu rồi ạ. Em sẽ cố không đến muộn. 3. Hay quá. Em muốn trở nên bắt đầu.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['ワン', 'ja-nu', 'カルロスさん、{日本|にほん}に{来|き}て、どんなことができるようになった？', 'Karurosu-san, Nihon ni kite, donna koto ga dekiru you ni natta?', 'Carlos, sang Nhật rồi cậu làm được những gì?'],
      ['カルロス', 'ja-nam', '1、{一人|ひとり}で{料理|りょうり}が{作|つく}れるようになったよ。 2、{料理|りょうり}を{作|つく}るために{来|き}たよ。 3、{料理|りょうり}が{作|つく}れるようにしているよ。', 'Ichi, hitori de ryouri ga tsukureru you ni natta yo. Ni, ryouri o tsukuru tame ni kita yo. San, ryouri ga tsukureru you ni shite iru yo.', '1. Mình đã tự nấu ăn được rồi. 2. Mình sang để nấu ăn. 3. Mình đang thu xếp để nấu được.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', 'ナタポンくん、{来月|らいげつ}から{日曜日|にちようび}も{営業|えいぎょう}することにしたよ。', 'Natapon-kun, raigetsu kara nichiyoubi mo eigyou suru koto ni shita yo.', 'Nattapon, anh quyết định từ tháng sau mở cửa cả Chủ nhật rồi.'],
      ['ナタポン', 'ja-nam', '1、えっ、{日曜日|にちようび}もですか。お{客|きゃく}さんが{増|ふ}えたからですか。 2、はい、{日曜日|にちようび}は{休|やす}みということになっています。 3、{日曜日|にちようび}に{営業|えいぎょう}するようになりたいです。', 'Ichi, e, nichiyoubi mo desu ka. Okyaku-san ga fueta kara desu ka. Ni, hai, nichiyoubi wa yasumi to iu koto ni natte imasu. San, nichiyoubi ni eigyou suru you ni naritai desu.', '1. Ơ, cả Chủ nhật ạ? Vì khách tăng ạ? 2. Vâng, theo quy định Chủ nhật là ngày nghỉ ạ. 3. Em muốn trở nên mở cửa Chủ nhật.'],
      ['ナレーター', 'ja-nu', '{5番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['パク', 'ja-nu', 'ダニエルさん、{冬休|ふゆやす}みは{国|くに}へ{帰|かえ}るの？', 'Danieru-san, fuyuyasumi wa kuni e kaeru no?', 'Daniel, nghỉ đông cậu có về nước không?'],
      ['ダニエル', 'ja-nam', '1、ううん、{日本|にほん}でアルバイトすることにしたんだ。 2、ううん、{国|くに}へ{帰|かえ}るようになった。 3、うん、{帰|かえ}らないように。', 'Ichi, uun, Nihon de arubaito suru koto ni shita n da. Ni, uun, kuni e kaeru you ni natta. San, un, kaeranai you ni.', '1. Không, mình quyết định ở Nhật làm thêm. 2. Không, mình đã bắt đầu về nước. 3. Có, để không về.'],
    ]),
    {
      t: 'mcq',
      id: 'b21-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '{1番|いちばん} — 「{健康|けんこう}のために{何|なに}かしている？」', options: ['1', '2', '3'], correct: 0, why: 'Hỏi việc đang làm vì sức khoẻ → kể thói quen: **{飲|の}むようにしているよ**. 2, 3 chỉ lặp từ {健康|けんこう}. 〔Maiasa yasai juusu o nomu you ni shite iru yo.〕' },
        { q: '{2番|にばん} — 「{授業|じゅぎょう}は{九時|くじ}に{始|はじ}まることになりました。」', options: ['1', '2', '3'], correct: 1, why: 'Nghe thông báo lịch mới → **わかりました。{遅|おく}れないようにします** (hứa). 1 sai vì không phải học sinh quyết; 3 vô nghĩa. 〔Okurenai you ni shimasu.〕' },
        { q: '{3番|さんばん} — 「どんなことができるようになった？」', options: ['1', '2', '3'], correct: 0, why: 'Hỏi thay đổi năng lực → **{作|つく}れるようになったよ**. 3 (ようにしている) là "đang cố", không trả lời đúng câu hỏi. 〔Ryouri ga tsukureru you ni natta yo.〕' },
        { q: '{4番|よんばん} — 「{日曜日|にちようび}も{営業|えいぎょう}することにしたよ。」', options: ['1', '2', '3'], correct: 0, why: 'Nghe quyết định của quản lý → phản ứng ngạc nhiên + hỏi lý do: **{日曜日|にちようび}もですか。お{客|きゃく}さんが{増|ふ}えたからですか**. 〔E, nichiyoubi mo desu ka.〕' },
        { q: '{5番|ごばん} — 「{冬休|ふゆやす}みは{国|くに}へ{帰|かえ}るの？」', options: ['1', '2', '3'], correct: 0, why: 'Trả lời bằng quyết định của mình → **{日本|にほん}でアルバイトすることにしたんだ**. 〔Nihon de arubaito suru koto ni shita n da.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b21-doc',
  kind: 'reading',
  title: 'Đọc hiểu N4 — thông báo của trung tâm thể thao, bài viết "Mục tiêu của tôi", bảng các lớp tiếng Nhật (情報検索)',
  goal: 'Đọc thông báo ~200 chữ để biết điều gì thay đổi (～ことになりました) và người dùng cần làm gì (～ようにしてください); đọc bài viết ~450 chữ của マルコ để nắm mục tiêu, việc anh đã làm, thay đổi đạt được và ý chính; tra bảng bốn lớp tiếng Nhật theo nhiều điều kiện (giờ rảnh, nội dung, học phí — kể cả dòng ※) để chọn đúng lớp — đọc ra sự khác nhau giữa ～ことにした／～ことになった／～ようになった／～ようにしている trong văn viết.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N4',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '~100–200 chữ: email, tin nhắn, thông báo', 'Bài 1 — thông báo của phòng tập về quy định mới'],
        ['問題5', '内容理解（中文）', '~350–450 chữ: bài viết, nhật ký', 'Bài 2 — 「{私|わたし}の{目標|もくひょう}」 của マルコ'],
        ['問題6', '情報検索', '~400 chữ: bảng, tờ quảng cáo, lịch', 'Bài 3 — bảng bốn lớp tiếng Nhật trong thành phố'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá ({何|なに}が{変|か}わりますか・どうして・どれ・{何|なに}をしなければなりませんか), rồi mới đọc bài để tìm.',
        'Thông báo: điều **thay đổi** nằm sau **～ことになりました**; điều **người đọc phải làm** nằm ở **～ようにしてください／～てください／～ことになっています** gần cuối.',
        'Bài viết kể chuyện bản thân: **quyết định** của người viết = **～ことにしました**, **thay đổi** = **～ようになりました**, **thói quen đang cố** = **～ようにしています**, **mục đích** = **～ために／～ように**. Ý chính thường ở đoạn **cuối**, sau **{大切|たいせつ}なのは／～と{思|おも}います**.',
        '情報検索: lập **bảng điều kiện** (ngày rảnh, giờ, muốn học gì, tiền tối đa), rồi **loại** từng lựa chọn. Luôn đọc dòng **※** và chữ nhỏ ({別|べつ} = tính riêng, {無料|むりょう} = miễn phí).',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: thông báo của trung tâm thể thao' },
    {
      t: 'passage',
      title: 'トレーニングルームを{使|つか}うみなさんへ（みどり{市|し}スポーツセンター）',
      intro: 'Thông báo dán ở cửa phòng tập — nơi マルコ chạy máy mỗi tối thứ Tư. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'トレーニングルームを{使|つか}うみなさんへ' },
        { text: '{来月|らいげつ}から、トレーニングルームの{使|つか}い{方|かた}が{少|すこ}し{変|か}わることになりました。' },
        { text: 'これまでは{予約|よやく}しなくても{使|つか}えましたが、{来月|らいげつ}からは、インターネットで{予約|よやく}してから{使|つか}うことになります。{一回|いっかい}に{使|つか}える{時間|じかん}は{二時間|にじかん}{以内|いない}です。また、{毎週|まいしゅう}{月曜日|げつようび}は{機械|きかい}を{調|しら}べる{日|ひ}なので、お{休|やす}みです。' },
        { text: '{汗|あせ}をかいたら、{使|つか}った{機械|きかい}をタオルでふくようにしてください。ほかの{人|ひと}も{気持|きも}ちよく{使|つか}えるように、ご{協力|きょうりょく}をお{願|ねが}いします。' },
        { text: 'みどり{市|し}スポーツセンター' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-doc-1',
      title: 'Bài 1 — câu hỏi',
      items: [
        { q: '{来月|らいげつ}から、{何|なに}が{変|か}わりますか。', options: ['{毎日|まいにち}{二時間|にじかん}しか{開|あ}かなくなる', '{予約|よやく}してから{使|つか}うことになる', '{月曜日|げつようび}だけ{使|つか}えるようになる', 'タオルを{借|か}りられなくなる'], correct: 1, why: '**これまでは{予約|よやく}しなくても{使|つか}えましたが、{来月|らいげつ}からは、インターネットで{予約|よやく}してから{使|つか}うことになります**. "2 tiếng" là giới hạn MỖI LẦN dùng, không phải giờ mở cửa (bẫy ①); thứ Hai là ngày NGHỈ (bẫy ②). 〔Yoyaku shite kara tsukau koto ni narimasu.〕' },
        { q: 'このお{知|し}らせで、{使|つか}う{人|ひと}にお{願|ねが}いしていることは{何|なん}ですか。', options: ['{月曜日|げつようび}に{機械|きかい}を{調|しら}べること', '{使|つか}った{機械|きかい}をタオルでふくこと', '{二時間|にじかん}{以上|いじょう}{使|つか}うこと', 'タオルを{二枚|にまい}{持|も}ってくること'], correct: 1, why: '**{使|つか}った{機械|きかい}をタオルでふくようにしてください** — lời nhờ lịch sự ～ようにしてください, kèm mục đích **ほかの{人|ひと}も{気持|きも}ちよく{使|つか}えるように**. 〔Kikai o taoru de fuku you ni shite kudasai.〕' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{使|つか}い{方|かた}が{少|すこ}し{変|か}わることになりました。', 'Tsukaikata ga sukoshi kawaru koto ni narimashita.', 'Cách sử dụng đã được quyết định là sẽ thay đổi một chút. (trung tâm quyết)'),
        E('インターネットで{予約|よやく}してから{使|つか}うことになります。', 'Intaanetto de yoyaku shite kara tsukau koto ni narimasu.', 'Sẽ (theo quy định mới) đặt chỗ qua mạng rồi mới dùng.'),
        E('ほかの{人|ひと}も{気持|きも}ちよく{使|つか}えるように、ご{協力|きょうりょく}をお{願|ねが}いします。', 'Hoka no hito mo kimochi yoku tsukaeru you ni, gokyouryoku o onegai shimasu.', 'Để người khác cũng dùng thoải mái, mong mọi người hợp tác. (câu cố định của thông báo)'),
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: bài viết 「{私|わたし}の{目標|もくひょう}」' },
    {
      t: 'passage',
      title: '{私|わたし}の{目標|もくひょう}　　マルコ',
      intro: 'Bài マルコ viết cho tờ báo nhỏ của lớp tiếng Nhật, số đặc biệt "Mục tiêu năm mới". Đọc rồi trả lời câu hỏi.',
      paras: [
        { label: '①', text: '{私|わたし}は{日本|にほん}に{来|き}て{一年半|いちねんはん}になります。{来|き}たときは、ひらがなとカタカナしか{読|よ}めなくて、コンビニの{店員|てんいん}さんの{言葉|ことば}も{全然|ぜんぜん}わかりませんでした。そこで、{一年目|いちねんめ}の{目標|もくひょう}を「{毎日|まいにち}、{日本人|にほんじん}と{話|はな}すこと」にしました。' },
        { label: '②', text: 'そのために、{大学|だいがく}の{日本語|にほんご}サークルに{入|はい}りました。{寮|りょう}の{食堂|しょくどう}でも、なるべく{日本人|にほんじん}の{学生|がくせい}の{隣|となり}に{座|すわ}るようにしました。{最初|さいしょ}は{何|なに}を{話|はな}せばいいかわからなくて、とても{緊張|きんちょう}しました。でも、{半年|はんとし}ぐらい{続|つづ}けると、みんなの{話|はなし}が{少|すこ}しずつわかるようになりました。{今|いま}では、アルバイトの{面接|めんせつ}の{予約|よやく}も{電話|でんわ}でできるようになりました。' },
        { label: '③', text: '{二年目|にねんめ}の{目標|もくひょう}は、N3に{合格|ごうかく}することです。{私|わたし}は{将来|しょうらい}、{国|くに}で{日本語|にほんご}の{先生|せんせい}になりたいと{思|おも}っています。そのためには、{会話|かいわ}だけでなく、{文法|ぶんぽう}や{漢字|かんじ}もしっかり{勉強|べんきょう}しなければなりません。それで、{毎朝|まいあさ}{六時|ろくじ}に{起|お}きて、{一時間|いちじかん}{勉強|べんきょう}することにしました。{前|まえ}は{朝|あさ}{起|お}きるのが{苦手|にがて}でしたが、{夜|よる}{早|はや}く{寝|ね}るようにしたら、{起|お}きられるようになりました。' },
        { label: '④', text: '{目標|もくひょう}を{立|た}てるとき、{大切|たいせつ}なのは、{大|おお}きすぎない{目標|もくひょう}にすることだと{思|おも}います。{大|おお}きすぎる{目標|もくひょう}は{続|つづ}きません。{小|ちい}さい{目標|もくひょう}でも、{一|ひと}つできると{自信|じしん}がついて、{次|つぎ}の{目標|もくひょう}に{進|すす}めます。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-doc-2',
      title: 'Bài 2 — câu hỏi',
      items: [
        { q: '{一年目|いちねんめ}に、マルコさんがしたことはどれですか。', options: ['{毎朝|まいあさ}{六時|ろくじ}に{起|お}きて{勉強|べんきょう}した', 'コンビニでアルバイトを{始|はじ}めた', '{日本語|にほんご}サークルに{入|はい}って、{日本人|にほんじん}の{隣|となり}に{座|すわ}るようにした', 'N3に{合格|ごうかく}した'], correct: 2, why: 'Đoạn ②: **サークルに{入|はい}りました** + **なるべく{日本人|にほんじん}の{学生|がくせい}の{隣|となり}に{座|すわ}るようにしました**. Dậy 6 giờ là quyết định của **năm thứ hai** (bẫy). 〔Saakuru ni hairimashita.〕' },
        { q: 'マルコさんが{毎朝|まいあさ}{六時|ろくじ}に{起|お}きて{勉強|べんきょう}することにしたのは、どうしてですか。', options: ['{朝|あさ}{起|お}きるのが{好|す}きだから', 'アルバイトの{面接|めんせつ}があるから', '{国|くに}で{日本語|にほんご}の{先生|せんせい}になるために、N3に{合格|ごうかく}したいから', '{寮|りょう}の{規則|きそく}でそうすることになっているから'], correct: 2, why: 'Đoạn ③: mục tiêu **N3に{合格|ごうかく}すること** ← vì **{将来|しょうらい}、{国|くに}で{日本語|にほんご}の{先生|せんせい}になりたい** → **そのためには**… **それで**…**{勉強|べんきょう}することにしました** (tự quyết, không phải luật ký túc xá). 〔Kuni de nihongo no sensei ni naritai.〕' },
        { q: 'マルコさんがいちばん{言|い}いたいことは{何|なん}ですか。', options: ['{日本語|にほんご}は{会話|かいわ}がいちばん{大切|たいせつ}だ。', '{目標|もくひょう}は{大|おお}きすぎないほうが、{続|つづ}けられて{自信|じしん}もつく。', '{朝|あさ}{早|はや}く{起|お}きれば、{何|なん}でもできるようになる。', '{寮|りょう}の{食堂|しょくどう}で{日本人|にほんじん}と{話|はな}したほうがいい。'], correct: 1, why: 'Ý chính ở đoạn cuối (④): **{大切|たいせつ}なのは、{大|おお}きすぎない{目標|もくひょう}にすることだと{思|おも}います** · **{小|ちい}さい{目標|もくひょう}でも、{一|ひと}つできると{自信|じしん}がついて**. Các lựa chọn khác chỉ là chi tiết. 〔Ookisuginai mokuhyou ni suru koto.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Ngữ pháp trong bài đọc 2 — vì sao người viết chọn mẫu đó',
      items: [
        '**{目標|もくひょう}を「～こと」にしました** — **N にする** = chọn N (ở đây N là cả cụm 「{毎日|まいにち}{日本人|にほんじん}と{話|はな}すこと」) — cùng họ với ～ことにする. **そのために／そのためには** — "để đạt điều đó / muốn đạt điều đó thì".',
        '**{座|すわ}るようにしました** — ようにする ở quá khứ: "đã **cố** (làm thành nếp)". **わかるようになりました／できるようになりました／{起|お}きられるようになりました** — kết quả thay đổi. Cặp vàng trong một câu: **{寝|ね}るようにしたら、{起|お}きられるようになりました** (cố → kết quả).',
        '**{勉強|べんきょう}することにしました** — quyết định của chính người viết. **～だけでなく、～も** = "không chỉ… mà cả…" (N3 — đọc hiểu là đủ). **{大|おお}きすぎない** — ～すぎる phủ định (ôn Bài 17).',
        '**{緊張|きんちょう}する** = căng thẳng, hồi hộp (N3) · **{自信|じしん}がつく** = có thêm tự tin ({自信|じしん} — Bài 16) · **{進|すす}む** = tiến lên (N3) · **{一年目|いちねんめ}** = năm thứ nhất (～{目|め} = thứ…).',
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: bảng các lớp tiếng Nhật trong thành phố' },
    {
      t: 'passage',
      title: 'みどり{市|し}の{日本語教室|にほんごきょうしつ}（{外国人|がいこくじん}のみなさんへ）',
      intro: 'マリヤム muốn tìm một lớp để luyện hội thoại. Cô chỉ rảnh **buổi tối các ngày trong tuần** (sau 6 giờ), và mỗi tháng chỉ chi được **tối đa 3.000 yên** (kể cả tiền sách). Đọc bảng rồi trả lời câu hỏi.',
      paras: [
        { label: 'A', text: 'さくら{日本語教室|にほんごきょうしつ}　{毎週|まいしゅう}{土曜日|どようび} 10:00〜12:00　{会話|かいわ}が{中心|ちゅうしん}　{一か月|いっかげつ} 2,000{円|えん}' },
        { label: 'B', text: 'みどり{国際|こくさい}センター　{毎週|まいしゅう}{火曜日|かようび}・{木曜日|もくようび} 19:00〜20:30　{会話|かいわ}と{発音|はつおん}　{一か月|いっかげつ} 3,000{円|えん}　※{教科書|きょうかしょ}（500{円|えん}）は{別|べつ}です。' },
        { label: 'C', text: 'ひかり{語学|ごがく}スクール　{月曜日|げつようび}〜{金曜日|きんようび} 18:30〜20:00　{文法|ぶんぽう}と{漢字|かんじ}（JLPTのための{授業|じゅぎょう}）　{一か月|いっかげつ} 8,000{円|えん}' },
        { label: 'D', text: 'ボランティア{日本語|にほんご}の{会|かい}　{毎週|まいしゅう}{水曜日|すいようび} 19:00〜21:00　{会話|かいわ}の{練習|れんしゅう}　{無料|むりょう}　※{初|はじ}めての{方|かた}は、{前|まえ}の{週|しゅう}の{金曜日|きんようび}までに{電話|でんわ}で{申|もう}し{込|こ}むことになっています。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-doc-3',
      title: 'Bài 3 — câu hỏi',
      items: [
        { q: 'マリヤムさんに{合|あ}う{教室|きょうしつ}はどれですか。', options: ['A', 'B', 'C', 'D'], correct: 3, why: 'Lập bảng điều kiện: A — **thứ Bảy** (loại); C — ngữ pháp + chữ Hán, **8.000 yên** (loại); B — tối trong tuần, hội thoại, nhưng **3.000 + sách 500 = 3.500 yên** > 3.000 (dòng ※ — loại); D — **tối thứ Tư**, hội thoại, **miễn phí** → **D**. 〔Muryou.〕' },
        { q: 'マリヤムさんが{初|はじ}めてDに{行|い}く{前|まえ}に、しなければならないことは{何|なん}ですか。', options: ['{教科書|きょうかしょ}を{買|か}う', '{前|まえ}の{週|しゅう}の{金曜日|きんようび}までに{電話|でんわ}で{申|もう}し{込|こ}む', 'お{金|かね}を{払|はら}う', 'インターネットで{予約|よやく}する'], correct: 1, why: 'Dòng ※ của D: **{初|はじ}めての{方|かた}は、{前|まえ}の{週|しゅう}の{金曜日|きんようび}までに{電話|でんわ}で{申|もう}し{込|こ}むことになっています** (quy định). 〔Denwa de moushikomu koto ni natte imasu.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Từ trong bài đọc 3',
      items: [
        '**{中心|ちゅうしん}** = trọng tâm (N3) · **{国際|こくさい}** = quốc tế (N3) · **{語学|ごがく}** = ngoại ngữ, học ngôn ngữ (N3) · **{教科書|きょうかしょ}** = sách giáo khoa · **{別|べつ}** = tính riêng · **{無料|むりょう}** = miễn phí (N4) · **ボランティア** = tình nguyện.',
        '**JLPTのための{授業|じゅぎょう}** — N のための N (mẫu ①): "giờ học dành cho (kỳ thi) JLPT". **{申|もう}し{込|こ}むことになっています** — quy định của lớp (mẫu ⑥).',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b21-noi',
  kind: 'speaking',
  title: 'Luyện nói — nói mục tiêu & cách đạt được, kể mình đã thay đổi, báo quyết định, nói 1 phút "Mục tiêu của tôi", đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói về mục tiêu (今年の目標は何ですか・そのために何をしていますか) bằng ～ために／～ように／～ようにしています; kể thay đổi của bản thân bằng ～ようになりました／～なくなりました; báo quyết định bằng ～ことにしました và việc được quyết định bằng ～ことになりました; nói 1 phút "Mục tiêu của tôi" đủ bốn ý; đọc to đoạn ~100 chữ không vấp ở ために／ように／ことに.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) — chủ đề Bài 21 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 21 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100 chữ.', 'Đoạn kể mục tiêu / thói quen: ～ために, ～ように, ～ようになりました, ～ことにしました, ～ことになっています…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (người chạy bộ, người học thư viện, biển 禁煙, người cầm ống heo) trả lời.', 'この{人|ひと}は{何|なん}のために{走|はし}っていると{思|おも}いますか（→ {健康|けんこう}のために…）· ここで{何|なに}をしてはいけませんか（→ たばこを{吸|す}わないことになっています）'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{今年|ことし}の{目標|もくひょう}は{何|なん}ですか · {日本語|にほんご}で{何|なに}ができるようになりましたか · {健康|けんこう}のために{何|なに}かしていますか'],
        ['Presenting', '5', 'Chào khi vào/ra, thái độ.', 'Cuối giờ: ありがとうございました。これからも{頑張|がんば}るようにします — câu kết tự nhiên.'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 21',
      items: [
        '**"Mục tiêu của bạn là gì?"** → **{目標|もくひょう}は～ことです** (V{辞書形|じしょけい} + こと) hoặc **～ようになることです** (muốn trở nên làm được): {目標|もくひょう}は、{日本語|にほんご}で{仕事|しごと}の{電話|でんわ}ができるようになることです.',
        '**"Để đạt được, bạn làm gì?"** → **そのために、～ています** + một câu **～ように** cho chi tiết: そのために、{毎朝|まいあさ}ニュースを{聞|き}いています。{忘|わす}れないように、{新|あたら}しい{言葉|ことば}はメモしています.',
        '**"Bạn đã làm được gì?"** → **{前|まえ}は～が、{今|いま}は～ようになりました**. Câu trả lời 2 ý (trước — nay) luôn được điểm cao hơn câu 1 ý.',
        '**"Gần đây bạn quyết định gì?"** → **～ことにしました** + lý do bằng **～ために／～から**. Việc trường / công ty quyết → **～ことになりました**. Đừng nói ~~～ことにしています~~ khi giám thị hỏi về một quyết định MỚI.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — giám thị ↔ thí sinh',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{今年|ことし}の{目標|もくひょう}は{何|なん}ですか。', ro: 'Kotoshi no mokuhyou wa nan desu ka.', vi: 'Mục tiêu năm nay của em là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{今年|ことし}の{目標|もくひょう}は、12{月|がつ}の{試験|しけん}でN3に{合格|ごうかく}することです。{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいからです。', ro: 'Kotoshi no mokuhyou wa, juunigatsu no shiken de enu-san ni goukaku suru koto desu. Nihon no kaisha de hatarakitai kara desu.', vi: 'Mục tiêu năm nay của em là đỗ N3 ở kỳ thi tháng 12. Vì em muốn làm ở công ty Nhật.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'そのために、{何|なに}をしていますか。', ro: 'Sono tame ni, nani o shite imasu ka.', vi: 'Để làm được điều đó, em đang làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{毎朝|まいあさ}{単語|たんご}を20{覚|おぼ}えることにしました。それから、{忘|わす}れないように、{寝|ね}る{前|まえ}に{必|かなら}ず{復習|ふくしゅう}しています。', ro: 'Maiasa tango o nijuu oboeru koto ni shimashita. Sorekara, wasurenai you ni, neru mae ni kanarazu fukushuu shite imasu.', vi: 'Em đã quyết định sáng nào cũng học 20 từ. Rồi để khỏi quên, trước khi ngủ em nhất định ôn lại.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本語|にほんご}の{勉強|べんきょう}を{始|はじ}めて、どんなことができるようになりましたか。', ro: 'Nihongo no benkyou o hajimete, donna koto ga dekiru you ni narimashita ka.', vi: 'Từ khi bắt đầu học tiếng Nhật, em đã làm được những gì?' },
        { who: 'Bạn', role: 'candidate', text: '{前|まえ}はひらがなしか{読|よ}めませんでしたが、{今|いま}は{簡単|かんたん}な{漢字|かんじ}が{読|よ}めるようになりました。アニメも{少|すこ}しわかるようになりました。', ro: 'Mae wa hiragana shika yomemasen deshita ga, ima wa kantan na kanji ga yomeru you ni narimashita. Anime mo sukoshi wakaru you ni narimashita.', vi: 'Trước đây em chỉ đọc được hiragana, nhưng giờ em đã đọc được chữ Hán đơn giản. Phim hoạt hình em cũng đã hiểu được một chút.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'この{絵|え}を{見|み}てください。この{人|ひと}は{何|なん}のために{走|はし}っていると{思|おも}いますか。', ro: 'Kono e o mite kudasai. Kono hito wa nan no tame ni hashitte iru to omoimasu ka.', vi: 'Em xem bức tranh này. Em nghĩ người này chạy để làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{健康|けんこう}のために{走|はし}っていると{思|おも}います。もしかしたら、マラソンの{大会|たいかい}に{出|で}るために{練習|れんしゅう}しているのかもしれません。', ro: 'Kenkou no tame ni hashitte iru to omoimasu. Moshika shitara, marason no taikai ni deru tame ni renshuu shite iru no kamoshiremasen.', vi: 'Em nghĩ người đó chạy vì sức khoẻ. Biết đâu là đang luyện tập để tham gia giải marathon. (ôn ～かもしれない — Bài 20)' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{最近|さいきん}、{何|なに}か{決|き}めたことがありますか。', ro: 'Saikin, nani ka kimeta koto ga arimasu ka.', vi: 'Gần đây em có quyết định điều gì không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。お{金|かね}を{節約|せつやく}するために、{昼|ひる}ご{飯|はん}はお{弁当|べんとう}を{作|つく}ることにしました。{一か月|いっかげつ}で{五千円|ごせんえん}ぐらい{貯金|ちょきん}できるようになりました。', ro: 'Hai. Okane o setsuyaku suru tame ni, hirugohan wa obentou o tsukuru koto ni shimashita. Ikkagetsu de gosen\'en gurai chokin dekiru you ni narimashita.', vi: 'Có ạ. Để tiết kiệm tiền, em quyết định tự làm cơm hộp ăn trưa. Một tháng em đã để dành được khoảng 5.000 yên.' },
      ],
    },
    { t: 'h', text: 'Talking — có tranh: 3 tranh kiểu đề thi' },
    {
      t: 'canh',
      anh: ['no-smoking', 'money-bag', 'sleepy-face'],
      caption: 'Tranh 1: biển cấm hút thuốc ở cửa một quán. Tranh 2: một sinh viên bỏ tiền vào túi tiết kiệm, cạnh là tờ quảng cáo du học. Tranh 3: 2 giờ sáng, một người vẫn ngồi chơi điện thoại, mặt buồn ngủ.',
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — nhìn tranh trả lời (mỗi câu 2 ý)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{一番|いちばん}の{絵|え}を{見|み}てください。ここで{何|なに}をしてはいけませんか。', ro: 'Ichiban no e o mite kudasai. Koko de nani o shite wa ikemasen ka.', vi: 'Em xem tranh số 1. Ở đây không được làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'たばこを{吸|す}ってはいけません。この{店|みせ}は{禁煙|きんえん}ということになっていますから、{外|そと}で{吸|す}わなければなりません。', ro: 'Tabako o sutte wa ikemasen. Kono mise wa kin\'en to iu koto ni natte imasu kara, soto de suwanakereba narimasen.', vi: 'Không được hút thuốc ạ. Theo quy định quán này cấm hút thuốc, nên phải hút ở bên ngoài.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{二番|にばん}の{絵|え}を{見|み}てください。この{人|ひと}は{何|なん}のために{貯金|ちょきん}していると{思|おも}いますか。', ro: 'Niban no e o mite kudasai. Kono hito wa nan no tame ni chokin shite iru to omoimasu ka.', vi: 'Em xem tranh số 2. Em nghĩ người này để dành tiền để làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{外国|がいこく}に{留学|りゅうがく}するために{貯金|ちょきん}していると{思|おも}います。{留学|りゅうがく}するためには、たくさんお{金|かね}が{必要|ひつよう}ですから。', ro: 'Gaikoku ni ryuugaku suru tame ni chokin shite iru to omoimasu. Ryuugaku suru tame ni wa, takusan okane ga hitsuyou desu kara.', vi: 'Em nghĩ người đó để dành tiền để đi du học. Vì muốn du học thì cần nhiều tiền.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{三番|さんばん}の{絵|え}を{見|み}てください。この{人|ひと}は、これからどうしたほうがいいと{思|おも}いますか。', ro: 'Sanban no e o mite kudasai. Kono hito wa, korekara dou shita hou ga ii to omoimasu ka.', vi: 'Em xem tranh số 3. Em nghĩ từ giờ người này nên làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{夜|よ}ふかししないようにしたほうがいいと{思|おも}います。{寝|ね}る{前|まえ}はスマホを{見|み}ないようにすれば、{早|はや}く{寝|ね}られるようになると{思|おも}います。', ro: 'Yofukashi shinai you ni shita hou ga ii to omoimasu. Neru mae wa sumaho o minai you ni sureba, hayaku nerareru you ni naru to omoimasu.', vi: 'Em nghĩ người đó nên cố đừng thức khuya. Nếu cố không xem điện thoại trước khi ngủ thì em nghĩ sẽ ngủ sớm được.' },
      ],
    },
    {
      t: 'phatam',
      id: 'b21-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 21',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý: ため・に (ta-me-ni) ↔ よう・に (yo-o-ni — よう kéo dài); こと・に (ko-to-ni); なり・ました ↔ し・ました; もく・ひょう (mo-ku-hyo-o); ちょ・きん (cho-ki-n — ちょ ngắn); きん・えん (ki-n-e-n — ん tách khỏi え).',
      items: [
        { text: 'N3に{合格|ごうかく}するために、{毎日|まいにち}{勉強|べんきょう}しています。', ipa: 'enu-san ni goukaku suru tame ni mainichi benkyou shite imasu', vi: 'Để đỗ N3, ngày nào tôi cũng học.' },
        { text: '{忘|わす}れないように、メモしておきます。', ipa: 'wasurenai you ni memo shite okimasu', vi: 'Để khỏi quên, tôi ghi lại sẵn.' },
        { text: '{日本語|にほんご}のニュースがわかるようになりました。', ipa: 'nihongo no nyuusu ga wakaru you ni narimashita', vi: 'Tôi đã hiểu được tin tức tiếng Nhật.' },
        { text: '{健康|けんこう}のために、{毎朝|まいあさ}{走|はし}るようにしています。', ipa: 'kenkou no tame ni maiasa hashiru you ni shite imasu', vi: 'Vì sức khoẻ, tôi cố sáng nào cũng chạy.' },
        { text: '{甘|あま}いものは、なるべく{食|た}べないようにしています。', ipa: 'amai mono wa narubeku tabenai you ni shite imasu', vi: 'Đồ ngọt thì tôi cố hết mức không ăn.' },
        { text: '{授業|じゅぎょう}に{遅|おく}れないようにしてください。', ipa: 'jugyou ni okurenai you ni shite kudasai', vi: 'Nhớ đừng đến lớp muộn nhé.' },
        { text: 'たばこをやめることにしました。', ipa: 'tabako o yameru koto ni shimashita', vi: 'Tôi đã quyết định bỏ thuốc.' },
        { text: '{来月|らいげつ}から{大阪|おおさか}に{転勤|てんきん}することになりました。', ipa: 'raigetsu kara oosaka ni tenkin suru koto ni narimashita', vi: 'Từ tháng sau tôi được điều chuyển công tác sang Osaka.' },
        { text: '{寮|りょう}では、11{時|じ}までに{帰|かえ}ることになっています。', ipa: 'ryou de wa juuichiji made ni kaeru koto ni natte imasu', vi: 'Ở ký túc xá, theo nội quy phải về trước 11 giờ.' },
        { text: '{毎晩|まいばん}、{日本語|にほんご}で{日記|にっき}を{書|か}くことにしています。', ipa: 'maiban nihongo de nikki o kaku koto ni shite imasu', vi: 'Tối nào tôi cũng đặt lệ viết nhật ký bằng tiếng Nhật.' },
        { text: '{試験|しけん}に{合格|ごうかく}できますように。', ipa: 'shiken ni goukaku dekimasu you ni', vi: 'Mong sao thi đỗ.' },
        { text: '{今|いま}は5キロ{走|はし}れるようになりました。', ipa: 'ima wa go kiro hashireru you ni narimashita', vi: 'Giờ tôi đã chạy được 5 km.' },
        { text: '{目標|もくひょう}を{立|た}てて、{毎日|まいにち}{努力|どりょく}しています。', ipa: 'mokuhyou o tatete mainichi doryoku shite imasu', vi: 'Tôi đặt mục tiêu và nỗ lực mỗi ngày.' },
        { text: '{留学|りゅうがく}するためには、{貯金|ちょきん}が{必要|ひつよう}です。', ipa: 'ryuugaku suru tame ni wa chokin ga hitsuyou desu', vi: 'Muốn du học thì cần tiền tiết kiệm.' },
      ],
    },
    {
      t: 'note',
      title: 'Nói 1 phút (できる！) — dàn ý + bài mẫu "Mục tiêu của tôi"',
      items: [
        '**Dàn ý 4 câu chốt**: ① mục tiêu là gì + vì sao ({目標|もくひょう}は～ことです。～からです) → ② để đạt được thì mình làm gì (そのために～ことにしました／～ようにしています) → ③ mình đã thay đổi ra sao ({前|まえ}は～が、{今|いま}は～ようになりました) → ④ quyết tâm ({必|かなら}ず～できるように、{頑張|がんば}ります).',
        '{私|わたし}の{目標|もくひょう}は、{来年|らいねん}の{夏|なつ}までにN3に{合格|ごうかく}することです。{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいからです。そのために、{毎朝|まいあさ}{三十分|さんじゅっぷん}{早|はや}く{起|お}きて、{単語|たんご}を{覚|おぼ}えることにしました。それから、{習|なら}った{文法|ぶんぽう}を{忘|わす}れないように、{毎晩|まいばん}{寝|ね}る{前|まえ}に{復習|ふくしゅう}するようにしています。{前|まえ}は{日本語|にほんご}のニュースが{全然|ぜんぜん}わかりませんでしたが、{今|いま}は{少|すこ}しわかるようになりました。{必|かなら}ず{合格|ごうかく}できるように、これからも{毎日|まいにち}{続|つづ}けます。',
        'Romaji: Watashi no mokuhyou wa, rainen no natsu made ni enu-san ni goukaku suru koto desu. Nihon no kaisha de hatarakitai kara desu. Sono tame ni, maiasa sanjuppun hayaku okite, tango o oboeru koto ni shimashita. Sorekara, naratta bunpou o wasurenai you ni, maiban neru mae ni fukushuu suru you ni shite imasu. Mae wa nihongo no nyuusu ga zenzen wakarimasen deshita ga, ima wa sukoshi wakaru you ni narimashita. Kanarazu goukaku dekiru you ni, korekara mo mainichi tsuzukemasu.',
        'Nghĩa: Mục tiêu của tôi là đỗ N3 trước mùa hè năm sau. Vì tôi muốn làm ở công ty Nhật. Để đạt được, tôi đã quyết định sáng nào cũng dậy sớm 30 phút để học thuộc từ vựng. Rồi để không quên ngữ pháp đã học, tối nào trước khi ngủ tôi cũng cố ôn lại. Trước đây tôi hoàn toàn không hiểu tin tức tiếng Nhật, nhưng giờ đã hiểu được một chút. Để nhất định thi đỗ, từ nay tôi sẽ tiếp tục mỗi ngày.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 40 điểm) — đoạn mẫu 30 giây',
      items: [
        '{兄|あに}は{去年|きょねん}、{健康|けんこう}のためにたばこをやめることにしました。{最初|さいしょ}はとても{大変|たいへん}そうでしたが、{今|いま}は{吸|す}いたいと{思|おも}わなくなったそうです。{毎朝|まいあさ}{走|はし}るようにしたら、{体重|たいじゅう}も{減|へ}って、{階段|かいだん}を{上|あ}がっても{疲|つか}れなくなりました。{来月|らいげつ}、{兄|あに}は{会社|かいしゃ}のマラソン{大会|たいかい}に{出|で}ることになっています。',
        'Romaji: Ani wa kyonen, kenkou no tame ni tabako o yameru koto ni shimashita. Saisho wa totemo taihensou deshita ga, ima wa suitai to omowanaku natta sou desu. Maiasa hashiru you ni shitara, taijuu mo hette, kaidan o agattemo tsukarenaku narimashita. Raigetsu, ani wa kaisha no marason taikai ni deru koto ni natte imasu.',
        'Nghĩa: Năm ngoái, vì sức khoẻ anh tôi quyết định bỏ thuốc. Lúc đầu trông anh rất vất vả, nhưng nghe nói giờ anh không còn thèm hút nữa. Từ khi cố sáng nào cũng chạy, cân nặng của anh cũng giảm, leo cầu thang cũng không mệt nữa. Tháng sau, theo lịch anh sẽ tham gia giải marathon của công ty.',
        'Chỗ dễ vấp: **やめることにしました** (ya-me-ru-ko-to-ni — đừng nuốt こと), **{大変|たいへん}そうでした** (ôn Bài 20), **{思|おも}わなくなった** (o-mo-wa-na-ku-nat-ta — phủ định + なる), **{走|はし}るようにしたら** (yo-o-ni-shi-ta-ra), **{疲|つか}れなくなりました** (tsu-ka-re-na-ku), **{出|で}ることになっています** (de-ru-ko-to-ni-nat-te-i-ma-su — っ giữ một nhịp).',
      ],
    },
    {
      t: 'speak',
      id: 'b21-noi-ghi-am',
      part: '1',
      questions: [
        'ことしの もくひょうは なんですか。',
        'その もくひょうの ために、なにを して いますか。',
        'にほんごの べんきょうを はじめて、どんな ことが できるように なりましたか。',
        'けんこうの ために、なにか して いますか。',
        'さいきん、なにか きめた ことが ありますか。',
        'あなたの もくひょうに ついて、1ぷんで はなして ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b21-viet',
  kind: 'writing',
  title: 'Viết — bài văn "Mục tiêu của tôi" (150–200 chữ) và email báo tin cho thầy (～ことになりました)',
  goal: 'Viết bài văn 150–200 chữ về mục tiêu của mình: mục tiêu và lý do, những việc đã quyết định làm (～ことにしました) và đang cố giữ (～ようにしています), thay đổi đã đạt được (～ようになりました), lời quyết tâm (～ように頑張ります); viết email ngắn báo cho thầy một việc đã được quyết định (～ことになりました) và một quyết định của mình (～ことにしました) — tự chấm theo 5 tiêu chí.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **作文「{私|わたし}の{目標|もくひょう}」**, **150–200 chữ**, thể です／ます. Đề phụ: **email cho thầy {本田|ほんだ}** (~100 chữ) báo **một tin đã được quyết định** (～ことになりました — đỗ, được nhận vào làm, chuyển trường…) và **một quyết định của mình** sau đó (～ことにしました). Bài viết N4 chấm **đúng khuôn + dùng được mẫu vừa học**. Văn viết dùng **～ために／～ように** (không rút gọn), **～ようになりました** (không ~~ようになった~~ khi đang viết thể です／ます).',
    },
    {
      t: 'table',
      caption: 'Dàn ý bài văn 「{私|わたし}の{目標|もくひょう}」 — 4 đoạn',
      head: ['Đoạn', 'Nội dung', 'Mẫu nên dùng', 'Câu mở gợi ý'],
      rows: [
        ['① Mục tiêu', 'Mục tiêu là gì, vì sao', '{目標|もくひょう}は～ことです · ～ようになることです · ～からです', '{私|わたし}の{今年|ことし}の{目標|もくひょう}は、～ことです。'],
        ['② Việc làm', 'Đã quyết làm gì, đang cố giữ gì', 'そのために · ～ことにしました · ～ようにしています · ～ように／～ために', 'そのために、{三|みっ}つのことを{決|き}めました。'],
        ['③ Thay đổi', 'Đã làm được gì so với trước', '{前|まえ}は～が、{今|いま}は～ようになりました · ～なくなりました', '{始|はじ}めてから{三|さん}か{月|げつ}で、～ようになりました。'],
        ['④ Quyết tâm', 'Còn thiếu gì, sẽ cố thế nào', '～ように、{頑張|がんば}ります · {少|すこ}しずつ{続|つづ}けます', '{目標|もくひょう}まではまだ{遠|とお}いですが、～。'],
      ],
    },
    {
      t: 'note',
      title: 'Từ nối nên dùng',
      items: [
        '**まず** (trước hết) · **{次|つぎ}に** (tiếp theo) · **それから** (sau đó) · **そのために** (để làm được vậy) · **でも** (nhưng) · **{最初|さいしょ}は** (lúc đầu) · **{今|いま}では** (đến nay thì) · **これからも** (từ nay về sau cũng).',
        'Câu kết đẹp: **～できるように、これからも{毎日|まいにち}{少|すこ}しずつ{続|つづ}けたいと{思|おも}います** · **{必|かなら}ず{目標|もくひょう}を{達成|たっせい}できるように{頑張|がんば}ります** ({達成|たっせい} = đạt được — N2, dùng được trong văn viết).',
      ],
    },
    {
      t: 'passage',
      title: 'Bài mẫu — {私|わたし}の{目標|もくひょう}（{約|やく}200{字|じ}）',
      intro: 'Đọc to bài mẫu, gạch chân các mẫu ～ために／～ように／～ようになりました／～ようにしています／～ことにしました.',
      paras: [
        { text: '{今年|ことし}の{目標|もくひょう}は、{日本語|にほんご}で{仕事|しごと}の{電話|でんわ}ができるようになることです。{将来|しょうらい}、{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいからです。' },
        { text: 'そのために、{三|みっ}つのことを{決|き}めました。まず、{毎朝|まいあさ}ニュースを{聞|き}くことにしました。{次|つぎ}に、アルバイトでは{日本語|にほんご}だけで{話|はな}すようにしています。それから、{新|あたら}しい{言葉|ことば}を{忘|わす}れないように、ノートに{書|か}いて{復習|ふくしゅう}しています。' },
        { text: '{始|はじ}めてから{三|さん}か{月|げつ}で、ニュースが{少|すこ}しわかるようになりました。{毎日|まいにち}{少|すこ}しずつ{続|つづ}ければ、{必|かなら}ずできるようになると{思|おも}います。' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{件名|けんめい}：{来年|らいねん}からのこと', 'Kenmei: Rainen kara no koto', 'Tiêu đề: Về chuyện từ năm sau'),
        E('{本田先生|ほんだせんせい}、こんにちは。ナタポンです。', 'Honda-sensei, konnichiwa. Natapon desu.', 'Thưa thầy Honda, em chào thầy. Em là Nattapon.'),
        E('{実|じつ}は、{来年|らいねん}の4{月|がつ}から、みどり{大学|だいがく}の{大学院|だいがくいん}に{進学|しんがく}することになりました。', 'Jitsu wa, rainen no shigatsu kara, Midori daigaku no daigakuin ni shingaku suru koto ni narimashita.', 'Chuyện là từ tháng 4 năm sau, em sẽ học lên cao học ở Đại học Midori.'),
        E('{先生|せんせい}の{授業|じゅぎょう}で{日本語|にほんご}を{勉強|べんきょう}したことが、とても{役|やく}に{立|た}ちました。', 'Sensei no jugyou de nihongo o benkyou shita koto ga, totemo yaku ni tachimashita.', 'Việc học tiếng Nhật trong giờ của thầy đã giúp em rất nhiều.'),
        E('{大学院|だいがくいん}でも、{日本語|にほんご}の{勉強|べんきょう}を{続|つづ}けることにしました。', 'Daigakuin demo, nihongo no benkyou o tsuzukeru koto ni shimashita.', 'Lên cao học, em cũng quyết định tiếp tục học tiếng Nhật.'),
        E('これからもよろしくお{願|ねが}いいたします。', 'Korekara mo yoroshiku onegai itashimasu.', 'Mong thầy tiếp tục chỉ bảo em. (câu kết email lịch sự)'),
      ],
    },
    {
      t: 'quiz',
      id: 'b21-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (6 câu)',
      kind: 'translate',
      grammar: '～ことです · そのために · ～ことにしました · ～ようにしています · ～ように · ～ようになりました',
      items: [
        { q: 'Mục tiêu năm nay của tôi là đỗ N3.', answers: V('{私|わたし}の{今年|ことし}の{目標|もくひょう}は、N3に{合格|ごうかく}することです。', '{今年|ことし}の{目標|もくひょう}は、N3に{合格|ごうかく}することです。', '{今年|ことし}の{目標|もくひょう}はN3に{受|う}かることです。'), hint: 'もくひょうは … ことです' },
        { q: 'Để làm được điều đó, tôi đã quyết định sáng nào cũng học thuộc từ.', answers: V('そのために、{毎朝|まいあさ}{単語|たんご}を{覚|おぼ}えることにしました。', 'そのために、{毎朝|まいあさ}{単語|たんご}を{覚|おぼ}えることに{決|き}めました。'), hint: 'そのために · ことにしました' },
        { q: 'Tôi cố hết mức chỉ nói tiếng Nhật.', answers: V('なるべく{日本語|にほんご}だけで{話|はな}すようにしています。', 'できるだけ{日本語|にほんご}だけで{話|はな}すようにしています。', 'なるべく{日本語|にほんご}で{話|はな}すようにしています。'), hint: 'なるべく … ようにしています' },
        { q: 'Để khỏi quên, tôi ôn lại mỗi tối.', answers: V('{忘|わす}れないように、{毎晩|まいばん}{復習|ふくしゅう}しています。', '{忘|わす}れないように、{毎晩|まいばん}{復習|ふくしゅう}します。'), hint: 'わすれないように · ふくしゅう' },
        { q: 'Giờ tôi đã hiểu được tin tức một chút.', answers: V('{今|いま}はニュースが{少|すこ}しわかるようになりました。', 'ニュースが{少|すこ}しわかるようになりました。'), hint: 'わかるように なりました' },
        { q: 'Từ tháng 4 năm sau em sẽ học lên cao học. (báo tin cho thầy)', answers: V('{来年|らいねん}の4{月|がつ}から、{大学院|だいがくいん}に{進学|しんがく}することになりました。', '{来年|らいねん}の4{月|がつ}から{大学院|だいがくいん}に{入|はい}ることになりました。', '{来年|らいねん}の{四月|しがつ}から、{大学院|だいがくいん}に{進学|しんがく}することになりました。'), hint: 'しんがくする ことに なりました' },
      ],
    },
    {
      t: 'passage',
      title: 'Bài mẫu 2 — {健康|けんこう}の{目標|もくひょう}（{約|やく}200{字|じ}）',
      intro: 'Một bài viết khác cùng đề, chủ đề sức khoẻ — chú ý cặp ようにする (cố) → ようになる (kết quả) và câu ～ことにしました.',
      paras: [
        { text: '{私|わたし}の{目標|もくひょう}は、{今年|ことし}{中|じゅう}に{体重|たいじゅう}を{五|ご}キロ{減|へ}らすことです。{去年|きょねん}の{健康診断|けんこうしんだん}で、{医者|いしゃ}に{運動不足|うんどうぶそく}だと{言|い}われたからです。' },
        { text: 'そのために、まず{甘|あま}い{飲|の}み{物|もの}をやめることにしました。それから、{駅|えき}ではなるべく{階段|かいだん}を{使|つか}うようにしています。{週末|しゅうまつ}は{友達|ともだち}と{公園|こうえん}を{走|はし}ることにしています。' },
        { text: '{最初|さいしょ}は{一|いち}キロも{走|はし}れませんでしたが、{今|いま}は{三|さん}キロ{走|はし}れるようになりました。{体重|たいじゅう}もまだ{二|に}キロですが、{減|へ}りました。{目標|もくひょう}が{達成|たっせい}できるように、これからも{続|つづ}けたいと{思|おも}います。' },
      ],
    },
    {
      t: 'note',
      title: 'Đề luyện thêm — chọn 1 trong 3 (cùng khuôn 4 đoạn)',
      items: [
        '**「お{金|かね}の{目標|もくひょう}」** — để dành tiền cho việc gì ({留学|りゅうがく}するために・{旅行|りょこう}のために) · đã quyết định cắt chi tiêu gì (～ないことにしました) · đang cố giữ thói quen gì ({節約|せつやく}するようにしています) · sau mấy tháng thay đổi ra sao ({貯金|ちょきん}が{増|ふ}えました・～ようになりました).',
        '**「{仕事|しごと}の{目標|もくひょう}」** — muốn làm được gì ở chỗ làm thêm (～ようになることです) · để làm được thì làm gì (～ように、～ています) · quy định ở chỗ làm (～ことになっています) · đã thay đổi ra sao.',
        '**「{生活|せいかつ}の{目標|もくひょう}」** — {早寝早起|はやねはやお}き, bỏ thức khuya, bớt chơi game · {目覚|めざ}まし{時計|どけい}… {起|お}きられるように · ～しなくなりました · lời quyết tâm.',
        'Viết xong: đọc to một lần, đếm số chữ (150–200), gạch chân từng mẫu và đối chiếu với tiêu chí ② bên dưới.',
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Khuôn** — đủ 4 đoạn: mục tiêu + lý do → việc làm → thay đổi → quyết tâm.',
        '**② Mẫu của bài** — có ít nhất 4 trong 6: ～ために, ～ように, ～ようになる, ～ようにしている, ～ことにした, ～ことになった — và **đúng cặp** (V chủ ý → ために; khả năng / Vない → ように; cố → する; đã thành → なる; mình quyết → ことにする).',
        '**③ Nối đúng** — {健康|けんこう}**の**ために, {忘|わす}れ**ない**ように, {話|はな}**せる**ように, {話|はな}せるようになりました (không ~~{話|はな}せるになりました~~), {辞書形|じしょけい} trước こと.',
        '**④ Nội dung cụ thể** — có con số (mỗi ngày bao nhiêu phút / từ, sau bao lâu), có ít nhất một thay đổi thật của bản thân.',
        '**⑤ Độ dài & văn phong** — 150–200 chữ, toàn thể です／ます, chữ Hán mới viết bằng chữ Hán ({目標|もくひょう}, {努力|どりょく}, {健康|けんこう}, {貯金|ちょきん}, {続|つづ}ける, {必要|ひつよう}, {成績|せいせき}, {合格|ごうかく}, {復習|ふくしゅう}…).',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b21-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 21 — dịch, trắc nghiệm, ghép câu, đổi câu (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 21: dịch Việt → Nhật có ～ために, ～ように, ～ようになる (～なくなる), ～ようにする・ようにしている・ようにしてください, ～ことにする・ことにしている, ～ことになる・ことになっている; chọn đúng mẫu trong từng cặp (ために↔ように, ようになる↔ようにする, ことにする↔ことになる), ghép câu đúng trật tự và nối / đổi câu theo mẫu — mục tiêu ≥ 85% trước khi sang Bài 22.',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm sau khi xong 8 mục cốt lõi. Gõ đáp án bằng kana hoặc chữ Hán đều được; dấu câu và dấu cách không tính.',
        'Sai câu nào thì mở lại đúng mục: ～ために → Ngữ pháp ① (bảng cách nối + lỗi hay mắc); ～ように → ② (bảng ために ↔ ように); ～ようになる → ③ (bảng "trở nên" theo loại từ); ～ようにする → ④ (bảng ようになる ↔ ようにする); ～ことにする → ⑤ (bảng dự định & quyết định); ～ことになる → ⑥ (bảng bốn mẫu こと).',
        'Mục tiêu: **≥ 85%** trước khi sang Bài 22.',
      ],
    },
    {
      t: 'quiz',
      id: 'b21-bt-dich',
      title: 'I. Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: '～ために · ～ように · ～ようになりました／～なくなりました · ～ようにしています／～ようにしてください · ～ことにしました／～ことにしています · ～ことになりました／～ことになっています',
      items: [
        { q: 'Để mua máy tính mới, tôi đang làm thêm.', answers: V('{新|あたら}しいパソコンを{買|か}うために、アルバイトをしています。', '{新|あたら}しいパソコンを{買|か}うために、アルバイトしています。'), hint: 'かう ために' },
        { q: 'Vì sức khoẻ, tôi ăn nhiều rau.', answers: V('{健康|けんこう}のために、{野菜|やさい}をたくさん{食|た}べています。', '{健康|けんこう}のために、{野菜|やさい}をたくさん{食|た}べます。'), hint: 'けんこうの ために' },
        { q: 'Để khỏi quên, tôi ghi vào sổ.', answers: V('{忘|わす}れないように、ノートに{書|か}きます。', '{忘|わす}れないように、ノートに{書|か}いておきます。', '{忘|わす}れないように、メモします。'), hint: 'わすれないように' },
        { q: 'Để đọc được chữ Hán, ngày nào tôi cũng đọc báo.', answers: V('{漢字|かんじ}が{読|よ}めるように、{毎日|まいにち}{新聞|しんぶん}を{読|よ}んでいます。', '{漢字|かんじ}が{読|よ}めるように、{毎日|まいにち}{新聞|しんぶん}を{読|よ}みます。'), hint: 'よめる ように' },
        { q: 'Hãy nói to để người phía sau cũng nghe thấy.', answers: V('{後|うし}ろの{人|ひと}にも{聞|き}こえるように、{大|おお}きい{声|こえ}で{話|はな}してください。', '{後|うし}ろの{人|ひと}にも{聞|き}こえるように、{大|おお}きな{声|こえ}で{話|はな}してください。'), hint: 'きこえる ように' },
        { q: 'Giờ tôi đã bơi được.', answers: V('{泳|およ}げるようになりました。', '{今|いま}は{泳|およ}げるようになりました。'), hint: 'およげるように なりました' },
        { q: 'Từ khi sang Nhật, sáng nào tôi cũng uống cà phê.', answers: V('{日本|にほん}に{来|き}てから、{毎朝|まいあさ}コーヒーを{飲|の}むようになりました。'), hint: 'のむように なりました' },
        { q: 'Tôi không còn chơi game nữa.', answers: V('ゲームをしなくなりました。', 'もうゲームをしなくなりました。'), hint: 'しなく なりました' },
        { q: 'Tôi cố đi cầu thang bộ.', answers: V('{階段|かいだん}を{使|つか}うようにしています。', 'なるべく{階段|かいだん}を{使|つか}うようにしています。'), hint: 'つかう ようにしています' },
        { q: 'Các em nhớ đừng đến muộn nhé.', answers: V('{遅|おく}れないようにしてください。', '{授業|じゅぎょう}に{遅|おく}れないようにしてください。', '{遅刻|ちこく}しないようにしてください。'), hint: 'おくれない ようにしてください' },
        { q: 'Tôi đã quyết định bỏ thuốc.', answers: V('たばこをやめることにしました。', '{禁煙|きんえん}することにしました。'), hint: 'やめる ことにしました' },
        { q: 'Tháng sau tôi được điều chuyển công tác sang Osaka.', answers: V('{来月|らいげつ}、{大阪|おおさか}に{転勤|てんきん}することになりました。', '{来月|らいげつ}から{大阪|おおさか}に{転勤|てんきん}することになりました。'), hint: 'てんきんする ことになりました' },
        { q: 'Tối nào tôi cũng đặt lệ viết nhật ký.', answers: V('{毎晩|まいばん}{日記|にっき}を{書|か}くことにしています。', '{毎晩|まいばん}、{日記|にっき}を{書|か}くことにしています。'), hint: 'かく ことにしています' },
        { q: 'Theo nội quy, phải về ký túc xá trước 11 giờ.', answers: V('{寮|りょう}には11{時|じ}までに{帰|かえ}ることになっています。', '{寮|りょう}には{十一時|じゅういちじ}までに{帰|かえ}ることになっています。', '11{時|じ}までに{寮|りょう}に{帰|かえ}ることになっています。'), hint: 'かえる ことになっています' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-bt-chon',
      title: 'II. Chọn đáp án đúng (14 câu)',
      items: [
        { q: '{日本|にほん}の{大学|だいがく}に{入|はい}る（　）、{日本語|にほんご}を{勉強|べんきょう}しています。', options: ['ように', 'ために', 'ことに', 'ようで'], correct: 1, why: '{入|はい}る — V chủ ý, cùng một người → **ために**. 〔Daigaku ni hairu tame ni…〕' },
        { q: '{赤|あか}ちゃんが{起|お}きない（　）、{静|しず}かに{話|はな}してください。', options: ['ために', 'ように', 'ことに', 'ので'], correct: 1, why: 'Vない + khác chủ ngữ (em bé — người nói) → **ように**. 〔Akachan ga okinai you ni…〕' },
        { q: '{健康|けんこう}（　）ために、{毎日|まいにち}{歩|ある}きます。', options: ['な', 'に', 'の', 'が'], correct: 2, why: 'N + **の** + ために. 〔Kenkou no tame ni.〕' },
        { q: '{毎日|まいにち}{練習|れんしゅう}して、ギターが（　）ようになりました。', options: ['ひく', 'ひける', 'ひいて', 'ひかない'], correct: 1, why: 'Năng lực → **thể khả năng** ひける ({弾|ひ}ける) + ようになりました. 〔Gitaa ga hikeru you ni narimashita.〕' },
        { q: '{年|とし}をとって、{祖父|そふ}はあまり（　）なりました。', options: ['{歩|ある}かなく', '{歩|ある}かないように', '{歩|ある}けるように', '{歩|ある}く'], correct: 0, why: 'Thay đổi theo chiều mất đi: Vない → **なくなる**: {歩|ある}かなくなりました. 〔Amari arukanaku narimashita.〕' },
        { q: 'なるべく{毎日|まいにち}、{日本語|にほんご}で{日記|にっき}を{書|か}く（　）。', options: ['ようにしています', 'ようになっています', 'ためです', 'ことになっています'], correct: 0, why: '**なるべく** + thói quen mình cố giữ → **ようにしています**. 〔Nikki o kaku you ni shite imasu.〕' },
        { q: '{先生|せんせい}「{宿題|しゅくだい}は{必|かなら}ず{金曜日|きんようび}までに{出|だ}す（　）。」', options: ['ようにしてください', 'ようになってください', 'ことになってください', 'ためにしてください'], correct: 0, why: 'Lời nhắc của thầy → **ようにしてください**. ~~ようになってください~~ / ~~ことになってください~~ không dùng. 〔Kinyoubi made ni dasu you ni shite kudasai.〕' },
        { q: '{色々|いろいろ}{考|かんが}えて、{来年|らいねん}{留学|りゅうがく}する（　）。', options: ['ことにしました', 'ようになりました', 'ためです', 'ようにしてください'], correct: 0, why: '**{色々|いろいろ}{考|かんが}えて** = tự suy nghĩ rồi quyết → **ことにしました**. 〔Rainen ryuugaku suru koto ni shimashita.〕' },
        { q: '{会社|かいしゃ}の{命令|めいれい}で、{来月|らいげつ}から{北海道|ほっかいどう}で{働|はたら}く（　）。', options: ['ことにしました', 'ことになりました', 'ようにしました', 'ためにしました'], correct: 1, why: '**{会社|かいしゃ}の{命令|めいれい}で** (theo lệnh công ty) → không phải mình quyết → **ことになりました**. 〔Hokkaidou de hataraku koto ni narimashita.〕' },
        { q: 'この{寮|りょう}では、たばこを{吸|す}ってはいけない（　）。', options: ['ことになっています', 'ことにしています', 'ようになっています', 'ようにしています'], correct: 0, why: 'Nội quy của ký túc xá → **ことになっています**. 〔Tabako o sutte wa ikenai koto ni natte imasu.〕' },
        { q: '{私|わたし}は{毎朝|まいあさ}{必|かなら}ず{六時|ろくじ}に{起|お}きる（　）。', options: ['ことにしています', 'ようになりました', 'ためです', 'ことになりました'], correct: 0, why: '**{必|かなら}ず** + luật của chính mình → **ことにしています**. 〔Kanarazu rokuji ni okiru koto ni shite imasu.〕' },
        { q: '「{日本語|にほんご}が{話|はな}せるようになりました。」の{意味|いみ}は？', options: ['{前|まえ}も{今|いま}も{話|はな}せる。', '{前|まえ}は{話|はな}せなかったが、{今|いま}は{話|はな}せる。', '{話|はな}せるように{努力|どりょく}している。', '{話|はな}すことに{決|き}めた。'], correct: 1, why: '**ようになる** = thay đổi đã thành: trước không — nay có. 〔Mae wa hanasenakatta ga, ima wa hanaseru.〕' },
        { q: '「{毎日|まいにち}{運動|うんどう}するようにしています。」の{意味|いみ}は？', options: ['{毎日|まいにち}{運動|うんどう}できるようになった。', '{毎日|まいにち}{運動|うんどう}しようと{頑張|がんば}っている。', '{毎日|まいにち}{運動|うんどう}することになっている。', '{毎日|まいにち}{運動|うんどう}してはいけない。'], correct: 1, why: '**ようにしている** = đang cố gắng giữ nếp ≈ **しようと{頑張|がんば}っている**. 〔Shiyou to ganbatte iru.〕' },
        { q: '「{転勤|てんきん}することになりました。」の{意味|いみ}は？', options: ['{自分|じぶん}で{転勤|てんきん}したいと{思|おも}って{決|き}めた。', '{会社|かいしゃ}などが{決|き}めて、{転勤|てんきん}する。', '{転勤|てんきん}できるようになった。', '{転勤|てんきん}しないように{頑張|がんば}る。'], correct: 1, why: '**ことになる** = được quyết định (công ty…), không chỉ do mình. 〔Kaisha nado ga kimete, tenkin suru.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b21-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Để du học, tôi đang để dành tiền.', chips: ['{留学|りゅうがく}する', 'ために', '{貯金|ちょきん}しています', 'ように', '{留学|りゅうがく}できる'], answer: ['{留学|りゅうがく}する', 'ために', '{貯金|ちょきん}しています'], ro: 'Ryuugaku suru tame ni chokin shite imasu.' },
        { vi: 'Để khỏi bị cảm, tôi rửa tay.', chips: ['{風邪|かぜ}を', 'ひかない', 'ように', '{手|て}を', '{洗|あら}います', 'ために'], answer: ['{風邪|かぜ}を', 'ひかない', 'ように', '{手|て}を', '{洗|あら}います'], ro: 'Kaze o hikanai you ni te o araimasu.' },
        { vi: 'Tôi đã đọc được chữ Hán một chút.', chips: ['{漢字|かんじ}が', '{少|すこ}し', '{読|よ}める', 'ように', 'なりました', 'しました'], answer: ['{漢字|かんじ}が', '{少|すこ}し', '{読|よ}める', 'ように', 'なりました'], alt: [['{少|すこ}し', '{漢字|かんじ}が', '{読|よ}める', 'ように', 'なりました']], ro: 'Kanji ga sukoshi yomeru you ni narimashita.' },
        { vi: 'Tôi cố hết mức ngủ sớm.', chips: ['なるべく', '{早|はや}く', '{寝|ね}る', 'ように', 'しています', 'なっています'], answer: ['なるべく', '{早|はや}く', '{寝|ね}る', 'ように', 'しています'], ro: 'Narubeku hayaku neru you ni shite imasu.' },
        { vi: 'Tôi (chủ quán) đã quyết định từ tháng sau mở cửa cả Chủ nhật.', chips: ['{来月|らいげつ}から', '{日曜日|にちようび}も', '{営業|えいぎょう}する', 'ことに', 'しました', 'なりました'], answer: ['{来月|らいげつ}から', '{日曜日|にちようび}も', '{営業|えいぎょう}する', 'ことに', 'しました'], ro: 'Raigetsu kara nichiyoubi mo eigyou suru koto ni shimashita.' },
        { vi: 'Bố tôi được điều chuyển công tác sang Osaka.', chips: ['{父|ちち}は', '{大阪|おおさか}に', '{転勤|てんきん}する', 'ことに', 'なりました', 'しました'], answer: ['{父|ちち}は', '{大阪|おおさか}に', '{転勤|てんきん}する', 'ことに', 'なりました'], ro: 'Chichi wa Oosaka ni tenkin suru koto ni narimashita.' },
        { vi: 'Mong sao thi đỗ.', chips: ['{試験|しけん}に', '{合格|ごうかく}', 'できます', 'ように', 'ために'], answer: ['{試験|しけん}に', '{合格|ごうかく}', 'できます', 'ように'], ro: 'Shiken ni goukaku dekimasu you ni.' },
        { vi: 'Vì sức khoẻ, tôi đã quyết định bỏ thuốc.', chips: ['{健康|けんこう}の', 'ために', 'たばこを', 'やめる', 'ことに', 'しました', 'ように'], answer: ['{健康|けんこう}の', 'ために', 'たばこを', 'やめる', 'ことに', 'しました'], ro: 'Kenkou no tame ni tabako o yameru koto ni shimashita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-bt-doi',
      title: 'IV. Nối / đổi câu theo mẫu (10 câu)',
      kind: 'fill',
      grammar: 'Nối hai câu hoặc đổi câu gốc sang mẫu trong ngoặc — giữ nguyên nghĩa còn lại',
      items: [
        { q: '「{日本|にほん}へ{留学|りゅうがく}します」＋「{貯金|ちょきん}しています」→ (để …)', answers: V('{日本|にほん}へ{留学|りゅうがく}するために、{貯金|ちょきん}しています。', '{日本|にほん}に{留学|りゅうがく}するために、{貯金|ちょきん}しています。'), hint: 'りゅうがくする ために' },
        { q: '「{忘|わす}れません」＋「メモします」→ (để khỏi …)', answers: V('{忘|わす}れないように、メモします。'), hint: 'わすれない ように' },
        { q: '「{漢字|かんじ}が{読|よ}めます」＋「{新聞|しんぶん}を{読|よ}みます」→ (để …)', answers: V('{漢字|かんじ}が{読|よ}めるように、{新聞|しんぶん}を{読|よ}みます。'), hint: 'よめる ように' },
        { q: '{前|まえ}は{泳|およ}げませんでした。{今|いま}は{泳|およ}げます。→ (～ようになりました)', answers: V('{泳|およ}げるようになりました。', '{今|いま}は{泳|およ}げるようになりました。'), hint: 'およげるように なりました' },
        { q: '{前|まえ}はよくゲームをしました。{今|いま}はしません。→ (～なくなりました)', answers: V('ゲームをしなくなりました。', '{今|いま}はゲームをしなくなりました。'), hint: 'しなく なりました' },
        { q: '{毎日|まいにち}{野菜|やさい}を{食|た}べます。(cố gắng) → (～ようにしています)', answers: V('{毎日|まいにち}{野菜|やさい}を{食|た}べるようにしています。'), hint: 'たべる ようにしています' },
        { q: '{毎日|まいにち}{復習|ふくしゅう}してください。(nhắc giữ nếp) → (～ようにしてください)', answers: V('{毎日|まいにち}{復習|ふくしゅう}するようにしてください。'), hint: 'ふくしゅうする ようにしてください' },
        { q: 'たばこをやめます。(tôi tự quyết) → (～ことにしました)', answers: V('たばこをやめることにしました。'), hint: 'やめる ことにしました' },
        { q: '{大阪|おおさか}に{転勤|てんきん}します。(công ty quyết) → (～ことになりました)', answers: V('{大阪|おおさか}に{転勤|てんきん}することになりました。'), hint: 'てんきんする ことになりました' },
        { q: '{会議|かいぎ}は{九時|くじ}に{始|はじ}まります。(quy định) → (～ことになっています)', answers: V('{会議|かいぎ}は{九時|くじ}に{始|はじ}まることになっています。', '{会議|かいぎ}は9{時|じ}に{始|はじ}まることになっています。'), hint: 'はじまる ことになっています' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b21-buoi-1-tame-you',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 21: từ mới mục tiêu & học tập · ～ために · ～ように · ～ますように · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng ～に行きます (ポイント 42) và thể khả năng (Bài 16), học từ mục tiêu – cố gắng và từ học tập – thi cử, nói mục đích bằng ～ために (V chủ ý, N の — cả N のための N) và ～ように (thể khả năng, わかる・見える・聞こえる, Vない), câu cầu mong ～ますように, phân biệt chắc ために ↔ ように, đóng vai hội thoại ① (ôn thi N3 ở thư viện), rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn ポイント 42: パンを{買|か}いに{行|い}きます (đi để làm gì — mục đích ngắn). Câu hỏi mở đầu: "Còn mục tiêu LỚN như du học, đỗ N3 — nói «để» thế nào?"',
        '**Từ mới (10′)** — nhóm A (mục tiêu & cố gắng: {目標|もくひょう}, {立|た}てる, {努力|どりょく}, {続|つづ}ける・{続|つづ}く, {諦|あきら}める, {我慢|がまん}, なるべく…) + nhóm B (học tập & thi cử: {復習|ふくしゅう}, {予習|よしゅう}, {単語|たんご}, {文法|ぶんぽう}, {成績|せいせき}, {受|う}かる…).',
        '**Ngữ pháp (20′)** — ① ～ために (V chủ ý / N の) · ② ～ように (khả năng / không chủ ý / Vない) · ②′ ～ますように · bảng ために ↔ ように.',
        '**Hội thoại (10′)** — ① ở thư viện: ワン và カルロス ôn thi N3.',
        '**チャレンジ (5′)** — luyện cặp: A hỏi {何|なん}のために～ていますか ↔ B trả lời ～ために／～ように. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b21-b1-slides',
      title: 'Bài 21 目標 — Buổi 1: ～ために・～ように',
      slides: [
        {
          tieuDe: '{第21課|だいにじゅういっか} {目標|もくひょう}',
          anh: ['bullseye', 'books', 'man-running'],
          nhan: ['{目標|もくひょう}', '{勉強|べんきょう}', '{健康|けんこう}'],
          dong: ['Hôm nay: **～ために** và **～ように** — hai cách nói "để"'],
          ro: ['~tame ni · ~you ni'],
          ghi: 'Bài 21 là bài "mục tiêu": làm gì ĐỂ đạt mục tiêu (ために・ように), mình đã thay đổi ra sao (ようになる・ようにする), và đã quyết định gì (ことにする・ことになる). Hôm nay học phần đầu: hai cách nói "để".',
        },
        {
          tieuDe: 'できること — Học xong Bài 21 làm được gì?',
          anh: ['books', 'flexed-biceps', 'tear-off-calendar'],
          nhan: ['21-1 ために・ように', '21-2 ようになる・ようにする', '21-3 ことにする・ことになる'],
          dong: ['① Nói mục đích: để đỗ N3, để khỏi quên (～ために・～ように).', '② Kể thay đổi & thói quen: đã chạy được 5 km, cố đi cầu thang (～ようになる・～ようにする).', '③ Báo quyết định: đã quyết bỏ thuốc, được chuyển công tác (～ことにする・～ことになる).'],
          ro: ['~tame ni · ~you ni', '~you ni naru · ~you ni suru', '~koto ni suru · ~koto ni naru'],
          ghi: 'Ba buổi đi đúng ba cặp mẫu này. Đề N4 hầu như luôn hỏi theo CẶP — nên mỗi buổi đều có một bảng phân biệt. Cuối Bài 21 bạn nói được 1 phút "Mục tiêu của tôi".',
        },
        {
          tieuDe: 'Khởi động — "đi để làm gì" (ポイント 42)',
          anh: ['bread', 'convenience-store'],
          nhan: ['パン', 'コンビニ'],
          dong: ['コンビニへパンを{買|か}いに{行|い}きます。'],
          ro: ['Konbini e pan o kai ni ikimasu.'],
          hoi: 'Mẫu Vます＋に{行|い}く nói mục đích gì? Dùng được cho "sang Nhật để du học" không?',
          dap: 'Chỉ mục đích ngắn, ngay lúc di chuyển (đi mua bánh). Mục tiêu lớn, lâu dài → ために: {留学|りゅうがく}するために{日本|にほん}へ{来|き}ました.',
          ghi: 'Viết câu này lên góc bảng — cuối buổi so với ために. Nhắc lại thể khả năng (Bài 16): {読|よ}む → {読|よ}める, {起|お}きる → {起|お}きられる — hôm nay cần dùng nhiều.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Mục tiêu & cố gắng',
          anh: ['bullseye', 'flexed-biceps', 'spiral-notepad'],
          nhan: ['{目標|もくひょう}', '{努力|どりょく}する', '{計画|けいかく}を{立|た}てる'],
          dong: ['{今年|ことし}の{目標|もくひょう}は{何|なん}ですか。', '{毎日|まいにち}{少|すこ}しずつ{努力|どりょく}しています。'],
          ro: ['Kotoshi no mokuhyou wa nan desu ka.', 'Mainichi sukoshi zutsu doryoku shite imasu.'],
          hoi: '"Lập kế hoạch" — {計画|けいかく}を{作|つく}る hay {計画|けいかく}を{立|た}てる?',
          dap: '**{計画|けいかく}を{立|た}てる** (cũng {目標|もくひょう}を{立|た}てる) — cụm cố định.',
          ghi: 'Thêm: {続|つづ}ける (tha — を) ↔ {続|つづ}く (tự — が); {諦|あきら}める (bỏ cuộc vì thấy không đạt được); {我慢|がまん}する (nhịn); なるべく ≈ できるだけ; チャレンジする (N に).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Học tập & thi cử',
          anh: ['books', 'open-book', 'hundred-points', 'graduation-cap'],
          nhan: ['{復習|ふくしゅう}', '{予習|よしゅう}', '{点|てん}', '{受|う}かる'],
          dong: ['{習|なら}ったことを{復習|ふくしゅう}します。', '{試験|しけん}に{受|う}かりました。'],
          ro: ['Naratta koto o fukushuu shimasu.', 'Shiken ni ukarimashita.'],
          hoi: '{試験|しけん}を{受|う}ける và {試験|しけん}に{受|う}かる khác nhau thế nào?',
          dap: '{受|う}ける = dự thi (trợ từ を); {受|う}かる = đỗ (trợ từ に) = {合格|ごうかく}する.',
          ghi: 'Thêm: {単語|たんご} (từ vựng), {文法|ぶんぽう} (bunpou — ぽ!), {発音|はつおん}, {成績|せいせき}が{上|あ}がる (không phải ~~{増|ふ}える~~), {問題集|もんだいしゅう}, {留学|りゅうがく}する (に).',
        },
        {
          tieuDe: '① ～ために — "để (đạt mục tiêu)"',
          anh: ['airplane', 'money-bag'],
          nhan: ['{留学|りゅうがく}する', '{貯金|ちょきん}する'],
          dong: ['{留学|りゅうがく}するために、{貯金|ちょきん}しています。', '{健康|けんこう}のために、{毎朝|まいあさ}{走|はし}ります。'],
          ro: ['Ryuugaku suru tame ni, chokin shite imasu.', 'Kenkou no tame ni, maiasa hashirimasu.'],
          bang: { head: ['', 'Cách nối', 'Ví dụ'], rows: [['V chủ ý', 'V{辞書形|じしょけい} ＋ ために', '{買|か}うために'], ['N', 'N ＋ の ＋ ために', '{健康|けんこう}のために']] },
          hoi: '「{健康|けんこう}ために」 đúng không?',
          dap: 'Sai — danh từ cần **の**: {健康|けんこう}のために.',
          ghi: 'Hai điều kiện: (1) V trước là việc MÌNH CHỦ ĐỘNG làm được ({買|か}う, {行|い}く, {留学|りゅうがく}する, {減|へ}らす); (2) cùng một người làm cả hai vế. Câu hỏi: {何|なん}のために～んですか.',
        },
        {
          tieuDe: '①′ N のために — "vì (lợi ích của) N" · N のための N',
          anh: ['house', 'woman-student'],
          nhan: ['{家族|かぞく}', '{留学生|りゅうがくせい}'],
          dong: ['{家族|かぞく}のために{働|はたら}きます。', 'これは{留学生|りゅうがくせい}のための{教室|きょうしつ}です。'],
          ro: ['Kazoku no tame ni hatarakimasu.', 'Kore wa ryuugakusei no tame no kyoushitsu desu.'],
          hoi: '「N のための N」 nghĩa là gì? Cho một ví dụ.',
          dap: '"N dành cho N": {子|こ}どものための{本|ほん} (sách dành cho trẻ em), JLPTのための{授業|じゅぎょう}.',
          ghi: 'Thêm ～ためには + {必要|ひつよう}／{大切|たいせつ}: {大学院|だいがくいん}に{入|はい}るためには、N2が{必要|ひつよう}です (muốn… thì cần…). ⚠ ため còn nghĩa "vì (nguyên nhân)" — Bài 27.',
        },
        {
          tieuDe: '② ～ように — "để có thể…"',
          anh: ['newspaper', 'ear'],
          nhan: ['{読|よ}める', '{聞|き}こえる'],
          dong: ['{漢字|かんじ}が{読|よ}めるように、{新聞|しんぶん}を{読|よ}みます。', '{後|うし}ろの{人|ひと}にも{聞|き}こえるように、{大|おお}きい{声|こえ}で{話|はな}します。'],
          ro: ['Kanji ga yomeru you ni, shinbun o yomimasu.', 'Ushiro no hito ni mo kikoeru you ni, ookii koe de hanashimasu.'],
          bang: { head: ['V trước ように', 'Ví dụ'], rows: [['thể khả năng', '{読|よ}めるように · {話|はな}せるように'], ['わかる・{見|み}える・{聞|き}こえる・なる', 'わかるように · {元気|げんき}になるように'], ['Vない', '{忘|わす}れないように']] },
          hoi: 'Vì sao không nói 「{漢字|かんじ}が{読|よ}めるために」?',
          dap: '{読|よ}める là KHẢ NĂNG — không ra lệnh cho nó xảy ra được, chỉ tạo điều kiện → **ように**.',
          ghi: 'ように: mình tạo điều kiện cho một TRẠNG THÁI. Hai vế được khác chủ ngữ: {子|こ}どもにもわかるように、（{私|わたし}が）やさしく{説明|せつめい}する.',
        },
        {
          tieuDe: '② Vない ＋ ように — "để khỏi…"',
          anh: ['memo', 'face-with-thermometer', 'alarm-clock'],
          nhan: ['メモ', '{風邪|かぜ}', '{遅刻|ちこく}'],
          dong: ['{忘|わす}れないように、メモします。', '{風邪|かぜ}をひかないように、{手|て}を{洗|あら}います。'],
          ro: ['Wasurenai you ni, memo shimasu.', 'Kaze o hikanai you ni, te o araimasu.'],
          hoi: '「{忘|わす}れないために、メモします」 có được không?',
          dap: 'Không — mục đích PHỦ ĐỊNH luôn dùng **ように**. (～ないために là nguyên nhân "vì không…" — Bài 27.)',
          ghi: 'Hay gặp: {遅|おく}れないように, {間違|まちが}えないように, {太|ふと}らないように, {道|みち}に{迷|まよ}わないように, {運動不足|うんどうぶそく}にならないように.',
        },
        {
          tieuDe: '②′ ～ますように — câu cầu mong',
          anh: ['shinto-shrine', 'glowing-star'],
          nhan: ['{神社|じんじゃ}', 'お{願|ねが}い'],
          dong: ['{合格|ごうかく}できますように。', '{明日|あした}、{晴|は}れますように。'],
          ro: ['Goukaku dekimasu you ni.', 'Ashita, haremasu you ni.'],
          hoi: 'Câu cầu mong dùng thể nào trước ように?',
          dap: '**Thể ます** — {合格|ごうかく}できますように (cách duy nhất của bài dùng thể ます trước ように).',
          ghi: 'Người Nhật viết câu này lên thẻ gỗ {絵馬|えま} ở đền trước kỳ thi. Tháng 12 đi thi N3 — thử viết một câu ～ますように cho mình.',
        },
        {
          tieuDe: '⭐ ～ために ↔ ～ように',
          dong: ['{体重|たいじゅう}を{減|へ}らすために、{運動|うんどう}する。（{減|へ}らす: chủ ý）', '{体重|たいじゅう}が{減|へ}るように、{運動|うんどう}する。（{減|へ}る: tự xảy ra）'],
          ro: ['Taijuu o herasu tame ni, undou suru.', 'Taijuu ga heru you ni, undou suru.'],
          bang: { head: ['', 'ために', 'ように'], rows: [['V trước', 'chủ ý', 'khả năng · không chủ ý · Vない'], ['Chủ ngữ', 'cùng một người', 'được khác'], ['Phủ định', '✗', '✓ ～ないように'], ['N', 'N のために ✓', '✗']] },
          hoi: 'Chọn: {子|こ}どもにもわかる（ために／ように）、やさしく{説明|せつめい}します。',
          dap: '**ように** — わかる không chủ ý, và hai vế khác chủ ngữ (trẻ hiểu — tôi giải thích).',
          ghi: 'Mẹo nghe nhanh: thấy thể khả năng (～える／～られる) hoặc ない trước chỗ trống → gần như chắc là ように.',
        },
        {
          tieuDe: '{会話|かいわ}① — {図書館|としょかん}で',
          anh: ['woman-student', 'man-student', 'books'],
          nhan: ['ワン', 'カルロス', '{図書館|としょかん}'],
          dong: ['{日本|にほん}の{会社|かいしゃ}で{働|はたら}くために、N3を{取|と}りたいの。', 'ニュースがわかるように、{毎日|まいにち}ラジオを{聞|き}いているよ。', '{二人|ふたり}とも{合格|ごうかく}できるように、{頑張|がんば}ろうね！'],
          ro: ['Nihon no kaisha de hataraku tame ni, enu-san o toritai no.', 'Nyuusu ga wakaru you ni, mainichi rajio o kiite iru yo.', 'Futari tomo goukaku dekiru you ni, ganbarou ne!'],
          hoi: 'Trong hội thoại ①, vì sao ワン nói "{合格|ごうかく}できるように" chứ không phải "{合格|ごうかく}するために"?',
          dap: 'Đỗ hay không không hoàn toàn do mình quyết → dùng thể khả năng + ように (chúc nhau / tự nhủ).',
          ghi: 'Đọc to hội thoại ① theo cặp (ワン — カルロス). Đếm: có mấy câu ために, mấy câu ように? (ために 2 · ように 6).',
        },
        {
          tieuDe: 'チャレンジ — "Bạn ~ để làm gì?"',
          anh: ['books', 'money-bag', 'man-running', 'memo'],
          nhan: ['A', 'B', 'C', 'D'],
          dong: ['A：{何|なん}のために{日本語|にほんご}を{勉強|べんきょう}していますか。', 'B：{日本|にほん}の{会社|かいしゃ}で{働|はたら}くためです。'],
          ro: ['A: Nan no tame ni nihongo o benkyou shite imasu ka.', 'B: Nihon no kaisha de hataraku tame desu.'],
          hoi: 'Tranh B (túi tiền) và D (giấy ghi chú) — nói gì?',
          dap: 'B：{車|くるま}を{買|か}うために、{貯金|ちょきん}しています。D：{忘|わす}れないように、メモします。',
          ghi: 'Luyện cặp 3 phút, đổi vai. Trả lời ngắn được: ～ためです (là để…). Mỗi câu thêm một chi tiết (bao nhiêu, mỗi ngày…) để đủ điểm thi nói.',
        },
        {
          tieuDe: 'まとめ — Buổi 1',
          bang: {
            head: ['Mẫu', 'Trước mẫu', 'Ví dụ'],
            rows: [
              ['～ために', 'V chủ ý · N の', '{留学|りゅうがく}するために · {健康|けんこう}のために'],
              ['～ように', 'V khả năng · わかる / {見|み}える / {聞|き}こえる · Vない', '{話|はな}せるように · {忘|わす}れないように'],
              ['～ますように', 'Vます', '{合格|ごうかく}できますように'],
            ],
          },
          ghi: 'Bài về nhà: viết 3 câu ～ために và 3 câu ～ように về việc học tiếng Nhật của bạn. Buổi sau: ～ようになる (đã thay đổi) và ～ようにする (cố gắng giữ nếp).',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: "đi để" và thể khả năng' },
    {
      t: 'p',
      text: 'Giáo viên viết lên bảng câu của Bài 5: 「パンを{買|か}いに{行|い}きます」 rồi hỏi: "Còn **«Tôi sang Nhật ĐỂ du học»** thì sao? {留学|りゅうがく}しに{来|き}ました cũng được, nhưng khi nói **mục tiêu lớn, lâu dài**, người Nhật dùng một mẫu khác." Cả lớp đoán. Đáp án: **{留学|りゅうがく}するために、{日本|にほん}へ{来|き}ました** — hôm nay học ～ために và người anh em của nó, ～ように.',
    },
    {
      t: 'mcq',
      id: 'b21-b1-khoi-dong',
      title: 'Khởi động — ôn ～に行く, thể khả năng, thể ない (4 câu)',
      items: [
        { q: 'スーパーへ{野菜|やさい}を{買|か}い（　）{行|い}きます。', options: ['に', 'で', 'を', 'へ'], correct: 0, why: 'Vます + **に** + {行|い}く — đi để làm gì (ポイント 42). 〔Yasai o kai ni ikimasu.〕' },
        { q: '「{読|よ}む」の{可能形|かのうけい}は？', options: ['{読|よ}まれる', '{読|よ}める', '{読|よ}ませる', '{読|よ}めれる'], correct: 1, why: 'Nhóm 1: う → え + る: **{読|よ}める** (Bài 16) — hôm nay ghép với ように: {読|よ}めるように.' },
        { q: '「{起|お}きる」の{可能形|かのうけい}は？', options: ['{起|お}きける', '{起|お}こせる', '{起|お}きられる', '{起|お}きさせる'], correct: 2, why: 'Nhóm 2: bỏ る + られる: **{起|お}きられる** → {起|お}きられるように (để dậy được).' },
        { q: '「{忘|わす}れる」のない{形|けい}は？', options: ['{忘|わす}れない', '{忘|わす}らない', '{忘|わす}れなない', '{忘|わす}りない'], correct: 0, why: 'Nhóm 2: bỏ る + ない: **{忘|わす}れない** → {忘|わす}れないように (để khỏi quên).' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: bảng "kế hoạch ôn thi" của ワン' },
    {
      t: 'table',
      caption: 'Giáo viên dán lên bảng tờ kế hoạch ôn thi N3 của ワン — mỗi dòng là một từ mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['**{目標|もくひょう}**：12{月|がつ}にN3に**{受|う}かる**！', 'mokuhyou · ukaru', 'mục tiêu · đỗ'],
        ['**{計画|けいかく}を{立|た}てる** → {毎日|まいにち}**{少|すこ}しずつ**', 'keikaku o tateru · sukoshi zutsu', 'lập kế hoạch · từng chút một'],
        ['{朝|あさ}：**{単語|たんご}** 30 ／ {夜|よる}：**{復習|ふくしゅう}**', 'tango · fukushuu', 'từ vựng · ôn tập'],
        ['{授業|じゅぎょう}の{前|まえ}：**{予習|よしゅう}** ／ **{文法|ぶんぽう}**の{問題集|もんだいしゅう}', 'yoshuu · bunpou · mondaishuu', 'xem trước · ngữ pháp · sách bài tập'],
        ['{週末|しゅうまつ}：**{発音|はつおん}**の{練習|れんしゅう}', 'hatsuon', 'phát âm'],
        ['ゲームは**{我慢|がまん}**！ **{諦|あきら}めない**！', 'gaman · akiramenai', 'nhịn · không bỏ cuộc'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{今年|ことし}の{目標|もくひょう}は、N3に{受|う}かることです。', 'Kotoshi no mokuhyou wa, enu-san ni ukaru koto desu.', 'Mục tiêu năm nay là đỗ N3.'),
        E('{夏休|なつやす}みの{前|まえ}に、{計画|けいかく}を{立|た}てました。', 'Natsuyasumi no mae ni, keikaku o tatemashita.', 'Trước kỳ nghỉ hè tôi đã lập kế hoạch.'),
        E('{三日|みっか}しか{続|つづ}きませんでした。', 'Mikka shika tsuzukimasen deshita.', 'Chỉ duy trì được ba ngày.'),
        E('{一度|いちど}{失敗|しっぱい}しても、{諦|あきら}めないでください。', 'Ichido shippai shite mo, akiramenaide kudasai.', 'Dù thất bại một lần cũng đừng bỏ cuộc.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～ために・～ように: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b21-b1-chia',
      title: 'Luyện nhanh — ～ために／～ように (10 câu)',
      kind: 'fill',
      items: [
        { q: '{買|か}う → để (～ために)', answers: V('{買|か}うために') },
        { q: '{健康|けんこう} → vì (～ために)', answers: V('{健康|けんこう}のために') },
        { q: '{留学|りゅうがく}する → để (～ために)', answers: V('{留学|りゅうがく}するために') },
        { q: '{家族|かぞく} → vì (～ために)', answers: V('{家族|かぞく}のために') },
        { q: '{話|はな}す → để nói được (～ように)', answers: V('{話|はな}せるように') },
        { q: 'わかる → để hiểu (～ように)', answers: ['わかるように'] },
        { q: '{聞|き}こえる → để nghe thấy (～ように)', answers: V('{聞|き}こえるように') },
        { q: '{忘|わす}れる → để khỏi quên (～ように)', answers: V('{忘|わす}れないように') },
        { q: '{遅|おく}れる → để khỏi muộn (～ように)', answers: V('{遅|おく}れないように') },
        { q: '{合格|ごうかく}する → câu cầu mong (～ますように)', answers: V('{合格|ごうかく}できますように', '{合格|ごうかく}しますように') },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-b1-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～ために · ～のために · ～ように · ～ないように · ～ますように',
      items: [
        { q: 'Để đi du lịch Hokkaido, tôi đang để dành tiền.', answers: V('{北海道|ほっかいどう}を{旅行|りょこう}するために、{貯金|ちょきん}しています。', '{北海道|ほっかいどう}へ{旅行|りょこう}に{行|い}くために、{貯金|ちょきん}しています。', '{北海道|ほっかいどう}に{旅行|りょこう}するために、お{金|かね}を{貯|た}めています。'), hint: 'りょこうする ために' },
        { q: 'Vì gia đình, anh tôi làm việc chăm chỉ.', answers: V('{兄|あに}は{家族|かぞく}のために、{一生懸命|いっしょうけんめい}{働|はたら}いています。', '{家族|かぞく}のために、{兄|あに}は{一生懸命|いっしょうけんめい}{働|はたら}いています。'), hint: 'かぞくの ために' },
        { q: 'Để hiểu được tin tức, tôi nghe đài mỗi ngày.', answers: V('ニュースがわかるように、{毎日|まいにち}ラジオを{聞|き}いています。', 'ニュースがわかるように、{毎日|まいにち}ラジオを{聞|き}きます。'), hint: 'わかる ように' },
        { q: 'Để khỏi đến muộn, tôi ra khỏi nhà sớm.', answers: V('{遅|おく}れないように、{早|はや}く{家|いえ}を{出|で}ます。', '{遅刻|ちこく}しないように、{早|はや}く{家|いえ}を{出|で}ます。'), hint: 'おくれない ように' },
        { q: 'Để em bé ngủ được, hãy nói nhỏ thôi.', answers: V('{赤|あか}ちゃんが{寝|ね}られるように、{小|ちい}さい{声|こえ}で{話|はな}してください。', '{赤|あか}ちゃんが{寝|ね}られるように、{静|しず}かに{話|はな}してください。'), hint: 'ねられる ように' },
        { q: 'Mong sao ngày mai trời nắng.', answers: V('{明日|あした}、{晴|は}れますように。', '{明日|あした}は{晴|は}れますように。'), hint: 'はれます ように' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**ために = V chủ ý + cùng một người làm** ({留学|りゅうがく}する, {買|か}う, {減|へ}らす). Danh từ: **N のために**. Đứng trước N: **N のための N**.',
        '**ように = trạng thái mình chỉ tạo điều kiện**: thể khả năng, わかる・{見|み}える・{聞|き}こえる・なる, và **mọi mục đích phủ định (Vない)**. Hai vế được khác chủ ngữ.',
        '**～ますように** chỉ dùng cho câu cầu mong đứng riêng. Trong câu "để…", trước ように luôn là thể từ điển / ない.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: 'みなさんは{何|なん}のために{日本語|にほんご}を{勉強|べんきょう}していますか。', ro: 'Minasan wa nan no tame ni nihongo o benkyou shite imasu ka.', vi: 'Các em học tiếng Nhật để làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}の{会社|かいしゃ}で{働|はたら}くために{勉強|べんきょう}しています。', ro: 'Nihon no kaisha de hataraku tame ni benkyou shite imasu.', vi: 'Em học để làm việc ở công ty Nhật ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本語|にほんご}が{上手|じょうず}に{話|はな}せるように、{何|なに}をしていますか。', ro: 'Nihongo ga jouzu ni hanaseru you ni, nani o shite imasu ka.', vi: 'Để nói tiếng Nhật giỏi, em đang làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{毎日|まいにち}、{日本人|にほんじん}の{友達|ともだち}と{話|はな}すようにしています。それから、アニメを{日本語|にほんご}で{見|み}ています。', ro: 'Mainichi, nihonjin no tomodachi to hanasu you ni shite imasu. Sorekara, anime o nihongo de mite imasu.', vi: 'Ngày nào em cũng cố nói chuyện với bạn người Nhật. Rồi em xem anime bằng tiếng Nhật ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{新|あたら}しい{単語|たんご}を{忘|わす}れないように、どうしていますか。', ro: 'Atarashii tango o wasurenai you ni, dou shite imasu ka.', vi: 'Để không quên từ mới, em làm thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{単語|たんご}カードを{作|つく}って、{電車|でんしゃ}の{中|なか}で{復習|ふくしゅう}しています。', ro: 'Tango kaado o tsukutte, densha no naka de fukushuu shite imasu.', vi: 'Em làm thẻ từ rồi ôn trên tàu ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{読|よ}めるために」と「{読|よ}めるように」、どちらが{正|ただ}しいですか。どうしてですか。', ro: '"Yomeru tame ni" to "yomeru you ni", dochira ga tadashii desu ka. Doushite desu ka.', vi: '"Yomeru tame ni" và "yomeru you ni", cái nào đúng? Tại sao?' },
        { who: 'Bạn', role: 'candidate', text: '「{読|よ}めるように」です。「{読|よ}める」は{可能形|かのうけい}ですから、「ように」を{使|つか}います。', ro: '"Yomeru you ni" desu. "Yomeru" wa kanoukei desu kara, "you ni" o tsukaimasu.', vi: 'Là "yomeru you ni" ạ. Vì "yomeru" là thể khả năng nên dùng "you ni".' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{新|あたら}しいパソコンを{買|か}う（　）、アルバイトをしています。', options: ['ように', 'ために', 'のに', 'ことに'], correct: 1, why: '{買|か}う — V chủ ý → **ために**. 〔Pasokon o kau tame ni…〕' },
        { q: '{黒板|こくばん}の{字|じ}がよく{見|み}える（　）、{前|まえ}の{席|せき}に{座|すわ}りました。', options: ['ために', 'ように', 'ことに', 'から'], correct: 1, why: '{見|み}える — không chủ ý → **ように**. 〔Yoku mieru you ni…〕' },
        { q: '{試験|しけん}の{日|ひ}に{遅|おく}れない（　）、{早|はや}く{寝|ね}ます。', options: ['ように', 'ために', 'のに', 'そうに'], correct: 0, why: 'Vない → **ように**. 〔Okurenai you ni…〕' },
        { q: '（　）ために、{毎日|まいにち}{野菜|やさい}を{食|た}べています。', options: ['{健康|けんこう}', '{健康|けんこう}な', '{健康|けんこう}の', '{健康|けんこう}に'], correct: 2, why: 'N + **の** + ために. 〔Kenkou no tame ni.〕' },
        { q: '（{神社|じんじゃ}で）「{試験|しけん}に{合格|ごうかく}（　）ように。」', options: ['する', 'できる', 'できます', 'した'], correct: 2, why: 'Câu cầu mong đứng riêng: **Vます + ように** → {合格|ごうかく}できますように. 〔Goukaku dekimasu you ni.〕' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b21-buoi-2-you-ni-naru-suru',
  kind: 'review',
  title: 'Buổi 2 — Sức khoẻ & thói quen: từ mới sức khoẻ, tự ↔ tha động từ · ～ようになる · ～ようにする・ようにしている · hội thoại ②',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～ために／～ように, học từ sức khoẻ – thói quen và bốn cặp tự ↔ tha động từ (続く・続ける, 増える・増やす, 減る・減らす, 変わる・変える), kể thay đổi bằng ～ようになる (thể khả năng / V辞書形) và ～なくなる, kể thói quen đang cố giữ bằng ～ようにしている, hứa bằng ～ようにします, nhắc lịch sự bằng ～ようにしてください, phân biệt chắc ようになる ↔ ようにする, đóng vai hội thoại ② (chạy bộ buổi sáng), rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — 3 câu ために／ように. Câu hỏi mở đầu: "Trước khi sang Nhật bạn không làm được gì — bây giờ làm được gì?"',
        '**Từ mới (10′)** — nhóm C (sức khoẻ & thói quen: {健康|けんこう}, {体重|たいじゅう}, ダイエット, {早寝早起|はやねはやお}き, {夜|よ}ふかし, {目覚|めざ}まし{時計|どけい}, {禁煙|きんえん}, {階段|かいだん}, {運動不足|うんどうぶそく}, {気|き}をつける) + bốn cặp tự ↔ tha động từ.',
        '**Ngữ pháp (20′)** — ③ ～ようになる (năng lực / thói quen mới) · ～なくなる · ôn ポイント 95 · ④ ～ようにしている／～ようにします／～ようにしてください · bảng ようになる ↔ ようにする.',
        '**Hội thoại (10′)** — ② ở công viên: マルコ chạy được 5 km, パク quyết tâm bỏ thức khuya.',
        '**チャレンジ (5′)** — luyện cặp "{前|まえ}は… {今|いま}は…". Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b21-b2-slides',
      title: 'Bài 21 目標 — Buổi 2: ～ようになる・～ようにする',
      slides: [
        {
          tieuDe: 'Ôn Buổi 1 — ために／ように',
          anh: ['airplane', 'memo'],
          nhan: ['{留学|りゅうがく}するために', '{忘|わす}れないように'],
          dong: ['{留学|りゅうがく}するために、{貯金|ちょきん}しています。', '{忘|わす}れないように、メモします。'],
          ro: ['Ryuugaku suru tame ni, chokin shite imasu.', 'Wasurenai you ni, memo shimasu.'],
          hoi: '「{日本語|にほんご}が{話|はな}せる（　）、{毎日|まいにち}{練習|れんしゅう}します」 — ために hay ように?',
          dap: '**ように** — {話|はな}せる là thể khả năng.',
          ghi: 'Hôm nay ように đi tiếp với なる và する: ようになる (đã thành), ようにする (mình cố). Cùng chữ ように — khác hẳn nghĩa, nhìn chữ cuối câu.',
        },
        {
          tieuDe: '{新|あたら}しいことば ③ — Sức khoẻ & thói quen',
          anh: ['man-running', 'balance-scale', 'sunrise', 'sleepy-face'],
          nhan: ['{健康|けんこう}', '{体重|たいじゅう}', '{早寝早起|はやねはやお}き', '{夜|よ}ふかし'],
          dong: ['{健康|けんこう}のために{走|はし}っています。', '{昨日|きのう}は{夜|よ}ふかしして、{寝坊|ねぼう}しました。'],
          ro: ['Kenkou no tame ni hashitte imasu.', 'Kinou wa yofukashi shite, nebou shimashita.'],
          hoi: '{夜|よ}ふかし — 夜 đọc là gì?',
          dap: '**よ** (yofukashi) — không phải よる.',
          ghi: 'Thêm: ダイエットする, {目覚|めざ}まし{時計|どけい}をかける (どけい — đục!), {禁煙|きんえん}する (kin\'en), {階段|かいだん}を{使|つか}う, {運動不足|うんどうぶそく} (ぶそく — đục), {体|からだ}に{気|き}をつける.',
        },
        {
          tieuDe: '{新|あたら}しいことば ④ — Tự động từ ↔ tha động từ',
          anh: ['chart-increasing', 'chart-decreasing'],
          nhan: ['{増|ふ}える ↔ {増|ふ}やす', '{減|へ}る ↔ {減|へ}らす'],
          dong: ['{体重|たいじゅう}が{減|へ}りました。', 'ゲームの{時間|じかん}を{減|へ}らしました。'],
          ro: ['Taijuu ga herimashita.', 'Geemu no jikan o herashimashita.'],
          bang: { head: ['が (tự)', 'を (tha)'], rows: [['{続|つづ}く', '{続|つづ}ける'], ['{増|ふ}える', '{増|ふ}やす'], ['{減|へ}る', '{減|へ}らす'], ['{変|か}わる', '{変|か}える'], ['{決|き}まる', '{決|き}める']] },
          hoi: '「{成績|せいせき}が{増|ふ}えました」 có đúng không?',
          dap: 'Không — điểm số dùng **{上|あ}がる**: {成績|せいせき}が{上|あ}がりました. {増|ふ}える cho SỐ LƯỢNG (người, tiền, cân nặng).',
          ghi: 'Mẹo của cả bài: が (tự) = tự xảy ra ≈ なる; を (tha) = mình làm ≈ する. Nhớ cặp này là hiểu ようになる ↔ ようにする.',
        },
        {
          tieuDe: '③ ～ようになる — năng lực: "giờ đã làm được"',
          anh: ['person-swimming', 'bicycle'],
          nhan: ['{泳|およ}げる', '{乗|の}れる'],
          dong: ['{前|まえ}は{泳|およ}げませんでしたが、{今|いま}は{泳|およ}げるようになりました。', 'やっと{自転車|じてんしゃ}に{乗|の}れるようになりました。'],
          ro: ['Mae wa oyogemasen deshita ga, ima wa oyogeru you ni narimashita.', 'Yatto jitensha ni noreru you ni narimashita.'],
          bang: { head: ['', 'Cách nối'], rows: [['Năng lực', 'V{可能形|かのうけい} ＋ ようになる'], ['Thói quen mới', 'V{辞書形|じしょけい} ＋ ようになる'], ['Mất đi', 'Vない → ～なくなる']] },
          hoi: '"Tôi đã biết bơi" — {泳|およ}ぐようになりました hay {泳|およ}げるようになりました?',
          dap: '**{泳|およ}げるようになりました** — năng lực dùng thể khả năng. {泳|およ}ぐようになった = "bắt đầu (có thói quen) đi bơi".',
          ghi: 'Hay đi với: {前|まえ}は～が、{今|いま}は～ · やっと (cuối cùng cũng) · だんだん · {少|すこ}しずつ. Thì quá khứ ～ようになりました là dạng hay dùng nhất.',
        },
        {
          tieuDe: '③ ～ようになる — thói quen mới · ～なくなる',
          anh: ['hot-beverage', 'mobile-phone'],
          nhan: ['コーヒー', 'スマホ'],
          dong: ['{日本|にほん}に{来|き}てから、{毎朝|まいあさ}コーヒーを{飲|の}むようになりました。', 'スマホを{持|も}ってから、{手紙|てがみ}を{書|か}かなくなりました。'],
          ro: ['Nihon ni kite kara, maiasa koohii o nomu you ni narimashita.', 'Sumaho o motte kara, tegami o kakanaku narimashita.'],
          hoi: '"Tôi không chơi game nữa" — nói thế nào?',
          dap: 'ゲームを**しなくなりました** (Vない bỏ い + くなる).',
          ghi: '～ないようになる cũng có người nói, nhưng ～なくなる tự nhiên hơn nhiều — khi viết hãy dùng なくなる.',
        },
        {
          tieuDe: '"Trở nên" — chọn theo loại từ (ôn ポイント 95)',
          bang: { head: ['Loại', 'Mẫu', 'Ví dụ'], rows: [['イA', '～くなる', '{寒|さむ}くなった'], ['ナA', '～になる', '{上手|じょうず}になった'], ['N', '～になる', '{先生|せんせい}になった'], ['V', '～ようになる', '{話|はな}せるようになった'], ['V (phủ định)', '～なくなる', '{話|はな}せなくなった']] },
          dong: ['{日本語|にほんご}が{上手|じょうず}になりました。', '{日本語|にほんご}が{話|はな}せるようになりました。'],
          ro: ['Nihongo ga jouzu ni narimashita.', 'Nihongo ga hanaseru you ni narimashita.'],
          hoi: 'Câu nào sai: 「{上手|じょうず}ようになった」「{話|はな}せるになった」?',
          dap: '**Cả hai đều sai** → {上手|じょうず}**に**なった, {話|はな}せる**ように**なった.',
          ghi: 'Đây là lỗi số 1 của người Việt ở bài này. Tính từ / danh từ: không có ように. Động từ: bắt buộc có ように.',
        },
        {
          tieuDe: '④ ～ようにしている — "tôi cố (giữ nếp)…"',
          anh: ['green-salad', 'person-walking'],
          nhan: ['{野菜|やさい}', '{階段|かいだん}'],
          dong: ['{健康|けんこう}のために、{野菜|やさい}を{食|た}べるようにしています。', 'なるべくエレベーターを{使|つか}わないようにしています。'],
          ro: ['Kenkou no tame ni, yasai o taberu you ni shite imasu.', 'Narubeku erebeetaa o tsukawanai you ni shite imasu.'],
          hoi: 'ようにしている khác 「{毎日|まいにち}{野菜|やさい}を{食|た}べています」 thế nào?',
          dap: 'ようにしている thêm ý **mình CỐ GẮNG** (có ý thức, đôi khi không làm được). Câu kia chỉ kể sự thật.',
          ghi: 'Câu trả lời vàng cho câu hỏi thi nói "{健康|けんこう}のために{何|なに}かしていますか". Hay đi với なるべく／できるだけ.',
        },
        {
          tieuDe: '④ ～ようにします · ～ようにしてください',
          anh: ['man-teacher', 'alarm-clock'],
          nhan: ['{先生|せんせい}', '{遅刻|ちこく}'],
          dong: ['すみません。これからは{遅刻|ちこく}しないようにします。', '{毎日|まいにち}{復習|ふくしゅう}するようにしてください。'],
          ro: ['Sumimasen. Korekara wa chikoku shinai you ni shimasu.', 'Mainichi fukushuu suru you ni shite kudasai.'],
          hoi: 'Khi xin lỗi vì đến muộn, nên nói 「{遅刻|ちこく}しないようにします」 hay 「{遅刻|ちこく}しないようになります」?',
          dap: '**ようにします** — lời hứa là ý chí của mình → する.',
          ghi: 'ようにしてください = nhắc giữ thành NẾP (mỗi lần đều thế); ～てください = làm một lần ngay. Bác sĩ, giáo viên, cấp trên rất hay dùng.',
        },
        {
          tieuDe: '⭐ ～ようになる ↔ ～ようにする',
          dong: ['{早|はや}く{寝|ね}るようにしたら、{早|はや}く{起|お}きられるようになりました。'],
          ro: ['Hayaku neru you ni shitara, hayaku okirareru you ni narimashita.'],
          bang: { head: ['', 'ようになる', 'ようにする'], rows: [['Nghĩa', 'đã thay đổi (kết quả)', 'cố gắng (nỗ lực)'], ['Ai làm chủ', 'tự thành sau thời gian', 'người nói chủ động'], ['Thì hay gặp', '～ようになりました', '～ようにしています／～ようにします'], ['Ví dụ', '{野菜|やさい}が{食|た}べられるようになった', '{野菜|やさい}を{食|た}べるようにしている']] },
          hoi: 'Câu trên bảng có cả hai mẫu — phần nào là "cố", phần nào là "kết quả"?',
          dap: '{早|はや}く{寝|ね}るよう**にした** = cố (nguyên nhân) → {起|お}きられるよう**になった** = kết quả.',
          ghi: 'Mẫu có する = mình cố; mẫu có なる = đã thành. Giống cặp {減|へ}らす (mình làm giảm) ↔ {減|へ}る (tự giảm).',
        },
        {
          tieuDe: '{会話|かいわ}② — {公園|こうえん}で',
          anh: ['man-running', 'woman-walking', 'alarm-clock'],
          nhan: ['マルコ', 'パク', '{目覚|めざ}まし{時計|どけい}'],
          dong: ['{健康|けんこう}のために、{毎朝|まいあさ}{走|はし}るようにしているんだ。', '{今|いま}は5キロ{走|はし}れるようになった。', '{今日|きょう}から、11{時|じ}までに{寝|ね}るようにする！'],
          ro: ['Kenkou no tame ni, maiasa hashiru you ni shite iru n da.', 'Ima wa go-kiro hashireru you ni natta.', 'Kyou kara, juuichiji made ni neru you ni suru!'],
          hoi: 'Trong hội thoại ②, câu nào là "cố gắng", câu nào là "kết quả"?',
          dap: 'Cố: {走|はし}るようにしている, {階段|かいだん}を{使|つか}うようにしている, {寝|ね}るようにする. Kết quả: {走|はし}れるようになった, {眠|ねむ}れるようになった.',
          ghi: 'Đọc to hội thoại ② theo cặp (マルコ — パク). Chú ý パク nói ～ようにする ở thể hiện tại = quyết tâm TỪ GIỜ.',
        },
        {
          tieuDe: 'チャレンジ — "{前|まえ}は… {今|いま}は…"',
          anh: ['person-swimming', 'open-book', 'man-cook', 'mobile-phone'],
          nhan: ['A', 'B', 'C', 'D'],
          dong: ['A：{日本|にほん}に{来|き}て、どんなことができるようになりましたか。', 'B：{前|まえ}は{泳|およ}げませんでしたが、{今|いま}は{泳|およ}げるようになりました。'],
          ro: ['A: Nihon ni kite, donna koto ga dekiru you ni narimashita ka.', 'B: Mae wa oyogemasen deshita ga, ima wa oyogeru you ni narimashita.'],
          hoi: 'Tranh B (sách) và C (đầu bếp) — nói gì?',
          dap: 'B：{漢字|かんじ}が{読|よ}めるようになりました。C：{自分|じぶん}で{料理|りょうり}が{作|つく}れるようになりました。',
          ghi: 'Luyện cặp 3 phút. Hỏi thêm câu thứ hai: {健康|けんこう}のために{何|なに}かしていますか → ～ようにしています. Câu trả lời 2 ý (trước — nay) được điểm cao.',
        },
        {
          tieuDe: 'まとめ — Buổi 2',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Ví dụ'],
            rows: [
              ['V{可能形|かのうけい}／V ＋ ようになる', 'đã thay đổi', '{泳|およ}げるようになった'],
              ['Vない → なくなる', 'không… nữa', '{吸|す}わなくなった'],
              ['V／Vない ＋ ようにしている', 'đang cố giữ nếp', '{歩|ある}くようにしている'],
              ['～ようにします', 'từ giờ sẽ cố', '{遅刻|ちこく}しないようにします'],
              ['～ようにしてください', 'nhớ… nhé', '{復習|ふくしゅう}するようにしてください'],
            ],
          },
          ghi: 'Bài về nhà: viết 3 câu "{前|まえ}は～が、{今|いま}は～ようになりました" và 3 câu "{健康|けんこう}のために～ようにしています". Buổi sau: ～ことにする và ～ことになる — mình quyết hay được quyết?',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn bài cũ: ために／ように' },
    {
      t: 'mcq',
      id: 'b21-b2-on',
      title: 'Ôn Buổi 1 + ポイント 95 (4 câu)',
      items: [
        { q: '{日本|にほん}の{会社|かいしゃ}で{働|はたら}く（　）、ビジネスマナーを{習|なら}っています。', options: ['ように', 'ために', 'ことに', 'のに'], correct: 1, why: '{働|はたら}く — V chủ ý, cùng một người → **ために**. 〔Hataraku tame ni…〕' },
        { q: '{風邪|かぜ}をひかない（　）、マスクをしています。', options: ['ために', 'ように', 'ことに', 'ので'], correct: 1, why: 'Vない → **ように**. 〔Kaze o hikanai you ni…〕' },
        { q: '{冬|ふゆ}になって、{寒|さむ}（　）なりました。', options: ['い', 'く', 'に', 'ように'], correct: 1, why: 'イA: bỏ い + **く**なる (ポイント 95). 〔Samuku narimashita.〕' },
        { q: '{練習|れんしゅう}して、ピアノが{上手|じょうず}（　）なりました。', options: ['く', 'ように', 'に', 'な'], correct: 2, why: 'ナA + **に**なる — tính từ không có ように. 〔Jouzu ni narimashita.〕' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: "sổ sức khoẻ" của マルコ' },
    {
      t: 'table',
      caption: 'Giáo viên chiếu trang "sổ sức khoẻ" nửa năm của マルコ — mỗi dòng là một từ mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['{健康診断|けんこうしんだん}：**{体重|たいじゅう}**が{多|おお}い・**{運動不足|うんどうぶそく}**', 'taijuu · undou busoku', 'cân nặng · thiếu vận động'],
        ['**{早寝早起|はやねはやお}き**！ **{夜|よ}ふかし**はしない', 'hayane hayaoki · yofukashi', 'ngủ sớm dậy sớm · thức khuya'],
        ['エレベーター ✗ → **{階段|かいだん}** ○', 'kaidan', 'cầu thang bộ'],
        ['{甘|あま}いもの → **ダイエット{中|ちゅう}**、{我慢|がまん}！', 'daietto-chuu · gaman', 'đang ăn kiêng · nhịn'],
        ['{半年|はんとし}で{体重|たいじゅう}が6キロ**{減|へ}った** ／ {走|はし}る{距離|きょり}を**{増|ふ}やした**', 'hetta · fuyashita', 'giảm (tự) · tăng (tha)'],
        ['{父|ちち}：**{禁煙|きんえん}**3か{月|げつ}！ {体|からだ}に**{気|き}をつけて**', 'kin\'en · ki o tsukete', 'bỏ thuốc · giữ gìn'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{一か月|いっかげつ}で{体重|たいじゅう}が{二|に}キロ{減|へ}りました。', 'Ikkagetsu de taijuu ga ni-kiro herimashita.', 'Một tháng cân nặng giảm 2 kg.'),
        E('{運動不足|うんどうぶそく}にならないように、{階段|かいだん}を{使|つか}います。', 'Undou busoku ni naranai you ni, kaidan o tsukaimasu.', 'Để khỏi thiếu vận động, tôi đi cầu thang bộ.'),
        E('{目覚|めざ}まし{時計|どけい}を{六時|ろくじ}にかけました。', 'Mezamashi dokei o rokuji ni kakemashita.', 'Tôi đã đặt đồng hồ báo thức lúc 6 giờ.'),
        E('{体|からだ}に{気|き}をつけてくださいね。', 'Karada ni ki o tsukete kudasai ne.', 'Giữ gìn sức khoẻ nhé.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～ようになる・～ようにする: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b21-b2-chia',
      title: 'Luyện nhanh — ようになりました／なくなりました／ようにしています (10 câu)',
      kind: 'fill',
      items: [
        { q: '{泳|およ}ぐ → giờ đã bơi được (～ようになりました)', answers: V('{泳|およ}げるようになりました') },
        { q: '{読|よ}む → giờ đã đọc được (～ようになりました)', answers: V('{読|よ}めるようになりました') },
        { q: '{起|お}きる → giờ đã dậy được (～ようになりました)', answers: V('{起|お}きられるようになりました') },
        { q: '{飲|の}む → bắt đầu (thói quen) uống (～ようになりました)', answers: V('{飲|の}むようになりました') },
        { q: '{吸|す}う → không hút nữa (～なくなりました)', answers: V('{吸|す}わなくなりました') },
        { q: 'する → không làm nữa (～なくなりました)', answers: ['しなくなりました'] },
        { q: '{歩|ある}く → tôi cố (～ようにしています)', answers: V('{歩|ある}くようにしています') },
        { q: '{食|た}べる → tôi cố KHÔNG (～ようにしています)', answers: V('{食|た}べないようにしています') },
        { q: '{遅刻|ちこく}する → từ giờ sẽ cố không (～ようにします)', answers: V('{遅刻|ちこく}しないようにします') },
        { q: '{復習|ふくしゅう}する → nhớ… nhé (～ようにしてください)', answers: V('{復習|ふくしゅう}するようにしてください') },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-b2-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～ようになりました · ～なくなりました · ～ようにしています · ～ようにします · ～ようにしてください',
      items: [
        { q: 'Giờ tôi đã đọc được chữ Hán đơn giản.', answers: V('{今|いま}は{簡単|かんたん}な{漢字|かんじ}が{読|よ}めるようになりました。', '{簡単|かんたん}な{漢字|かんじ}が{読|よ}めるようになりました。'), hint: 'よめるように なりました' },
        { q: 'Từ khi sang Nhật, tôi đã bắt đầu tự nấu ăn.', answers: V('{日本|にほん}に{来|き}てから、{自分|じぶん}で{料理|りょうり}をするようになりました。', '{日本|にほん}に{来|き}てから、{自分|じぶん}で{料理|りょうり}を{作|つく}るようになりました。'), hint: 'する ように なりました' },
        { q: 'Bận quá nên tôi không còn chơi thể thao nữa.', answers: V('{忙|いそが}しくて、スポーツをしなくなりました。', '{忙|いそが}しいので、スポーツをしなくなりました。'), hint: 'しなく なりました' },
        { q: 'Tôi cố uống nhiều nước.', answers: V('{水|みず}をたくさん{飲|の}むようにしています。', 'なるべく{水|みず}をたくさん{飲|の}むようにしています。'), hint: 'のむ ようにしています' },
        { q: 'Từ nay tôi sẽ cố không quên bài tập.', answers: V('これからは{宿題|しゅくだい}を{忘|わす}れないようにします。', 'これから{宿題|しゅくだい}を{忘|わす}れないようにします。'), hint: 'わすれない ようにします' },
        { q: 'Nhớ đừng ăn quá nhiều nhé.', answers: V('{食|た}べすぎないようにしてください。', '{食|た}べすぎないようにしてくださいね。'), hint: 'たべすぎない ようにしてください' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Năng lực mới → thể khả năng + ようになる** ({泳|およ}げるようになった). Thói quen mới → V{辞書形|じしょけい} + ようになる. Mất đi → **～なくなる**.',
        '**Động từ + ように + なる; tính từ / danh từ KHÔNG có ように** ({上手|じょうず}になる, {寒|さむ}くなる). Hai lỗi kinh điển: ~~{話|はな}せるになった~~, ~~{上手|じょうず}ようになった~~.',
        '**する = mình cố, なる = đã thành**: ようにしている (đang cố) · ようにします (sẽ cố — hứa) · ようにしてください (nhắc giữ nếp) ↔ ようになりました (kết quả).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本|にほん}に{来|き}て、どんなことができるようになりましたか。', ro: 'Nihon ni kite, donna koto ga dekiru you ni narimashita ka.', vi: 'Sang Nhật rồi, em đã làm được những gì?' },
        { who: 'Bạn', role: 'candidate', text: '{一人|ひとり}で{電車|でんしゃ}に{乗|の}れるようになりました。それから、{簡単|かんたん}な{料理|りょうり}が{作|つく}れるようになりました。', ro: 'Hitori de densha ni noreru you ni narimashita. Sorekara, kantan na ryouri ga tsukureru you ni narimashita.', vi: 'Em đã tự đi tàu được một mình. Rồi em đã nấu được món đơn giản ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{健康|けんこう}のために、{何|なに}か{気|き}をつけていることはありますか。', ro: 'Kenkou no tame ni, nani ka ki o tsukete iru koto wa arimasu ka.', vi: 'Vì sức khoẻ, em có chú ý điều gì không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{毎日|まいにち}{三十分|さんじゅっぷん}{歩|ある}くようにしています。{夜|よる}は{甘|あま}いものを{食|た}べないようにしています。', ro: 'Hai. Mainichi sanjuppun aruku you ni shite imasu. Yoru wa amai mono o tabenai you ni shite imasu.', vi: 'Có ạ. Ngày nào em cũng cố đi bộ 30 phút. Buổi tối em cố không ăn đồ ngọt.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{前|まえ}はしていたけれど、{今|いま}はしなくなったことはありますか。', ro: 'Mae wa shite ita keredo, ima wa shinaku natta koto wa arimasu ka.', vi: 'Có việc gì trước em hay làm mà giờ không làm nữa không?' },
        { who: 'Bạn', role: 'candidate', text: '{前|まえ}は{毎晩|まいばん}ゲームをしていましたが、{試験|しけん}の{勉強|べんきょう}を{始|はじ}めてから、あまりしなくなりました。', ro: 'Mae wa maiban geemu o shite imashita ga, shiken no benkyou o hajimete kara, amari shinaku narimashita.', vi: 'Trước tối nào em cũng chơi game, nhưng từ khi bắt đầu ôn thi thì em không còn hay chơi nữa ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{今日|きょう}、{遅刻|ちこく}しましたね。{明日|あした}からどうしますか。', ro: 'Kyou, chikoku shimashita ne. Ashita kara dou shimasu ka.', vi: 'Hôm nay em đến muộn rồi nhỉ. Từ mai em sẽ làm thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'すみませんでした。{明日|あした}から{遅|おく}れないように、{目覚|めざ}まし{時計|どけい}を{早|はや}めにかけるようにします。', ro: 'Sumimasen deshita. Ashita kara okurenai you ni, mezamashi dokei o hayame ni kakeru you ni shimasu.', vi: 'Em xin lỗi ạ. Từ mai, để không muộn, em sẽ cố đặt đồng hồ báo thức sớm hơn.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{毎日|まいにち}{練習|れんしゅう}して、{日本語|にほんご}で{電話|でんわ}が（　）ようになりました。', options: ['する', 'できる', 'できて', 'しない'], correct: 1, why: 'Năng lực → thể khả năng **できる** + ようになりました. 〔Denwa ga dekiru you ni narimashita.〕' },
        { q: '{日本語|にほんご}が{上手|じょうず}（　）なりました。', options: ['ように', 'に', 'く', 'で'], correct: 1, why: 'ナA + **に**なる — không có ように. 〔Jouzu ni narimashita.〕' },
        { q: '{健康|けんこう}のために、なるべく{階段|かいだん}を{使|つか}う（　）。', options: ['ようになっています', 'ようにしています', 'ようになりました', 'ためです'], correct: 1, why: '**なるべく** + mình cố giữ nếp → **ようにしています**. 〔Kaidan o tsukau you ni shite imasu.〕' },
        { q: 'スマホを{持|も}ってから、{本|ほん}を（　）なりました。', options: ['{読|よ}まなく', '{読|よ}まないように', '{読|よ}めるように', '{読|よ}む'], correct: 0, why: 'Thay đổi mất đi: **{読|よ}まなく**なりました. 〔Hon o yomanaku narimashita.〕' },
        { q: '{医者|いしゃ}「{寝|ね}る{前|まえ}は、コーヒーを{飲|の}まない（　）。」', options: ['ようになってください', 'ようにしてください', 'ことになってください', 'ために'], correct: 1, why: 'Lời nhắc giữ nếp → **ないようにしてください**. 〔Koohii o nomanai you ni shite kudasai.〕' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b21-buoi-3-koto-ni',
  kind: 'review',
  title: 'Buổi 3 — Quyết định: từ mới tiền bạc & công việc · ～ことにする・ことにしている · ～ことになる・ことになっている · hội thoại ③',
  goal: 'Theo nhịp một buổi trên lớp: ôn ようになる／ようにする, học từ tiền bạc và công việc, báo quyết định của mình bằng ～ことにしました, nói quy tắc tự đặt bằng ～ことにしています, báo việc được quyết định bằng ～ことになりました (kể cả cách báo tin khiêm tốn), nói quy định bằng ～ことになっています, phân biệt bốn mẫu こと và so với つもり・予定 (Bài 16), ようにしている ↔ ことにしている, đóng vai hội thoại ③ (quán ひまわり食堂), rồi trả lời được câu giáo viên hay gọi và nói 1 phút "Mục tiêu của tôi".',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — 3 câu ようになる／ようにする. Câu hỏi mở đầu: "Gần đây bạn đã QUYẾT ĐỊNH điều gì? Có điều gì người khác quyết THAY bạn không?"',
        '**Từ mới (10′)** — nhóm D (tiền bạc & thay đổi: {貯金|ちょきん}, {節約|せつやく}, {無駄|むだ}, {必要|ひつよう}, {変|か}わる・{変|か}える) + nhóm E (quyết định & công việc: {決|き}まる, {会議|かいぎ}, {転勤|てんきん}, {出張|しゅっちょう}, {営業|えいぎょう}, {結果|けっか}, {方法|ほうほう}, {以内|いない}).',
        '**Ngữ pháp (20′)** — ⑤ ～ことにする・ことにした・ことにしている · ⑥ ～ことになる・ことになった・ことになっている · bảng bốn mẫu こと · ようにしている ↔ ことにしている.',
        '**Hội thoại (10′)** — ③ ở quán ひまわり食堂: anh 小林 quyết định mở cửa Chủ nhật, ナタポン sắp học cao học.',
        '**チャレンジ (5′)** — báo tin: mỗi người một tin "ことにしました" và một tin "ことになりました". Cuối buổi: 5 câu kiểm tra + nói 1 phút "Mục tiêu của tôi".',
      ],
    },
    {
      t: 'slides',
      id: 'b21-b3-slides',
      title: 'Bài 21 目標 — Buổi 3: ～ことにする・～ことになる',
      slides: [
        {
          tieuDe: 'Ôn Buổi 2 — ようになる／ようにする',
          anh: ['person-swimming', 'person-walking'],
          nhan: ['{泳|およ}げるようになった', '{歩|ある}くようにしている'],
          dong: ['{泳|およ}げるようになりました。', 'なるべく{歩|ある}くようにしています。'],
          ro: ['Oyogeru you ni narimashita.', 'Narubeku aruku you ni shite imasu.'],
          hoi: 'Câu nào là "đã thành", câu nào là "đang cố"?',
          dap: '{泳|およ}げるよう**になりました** = đã thành; {歩|ある}くよう**にしています** = đang cố.',
          ghi: 'Hôm nay cặp する ↔ なる thứ ba: ことにする (mình quyết) ↔ ことになる (được quyết). Cùng một logic: する = chủ động, なる = tự thành / người khác quyết.',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑤ — Tiền bạc',
          anh: ['money-bag', 'coin', 'shopping-bags'],
          nhan: ['{貯金|ちょきん}', '{節約|せつやく}', '{無駄|むだ}'],
          dong: ['{毎月|まいつき}{二万円|にまんえん}ずつ{貯金|ちょきん}しています。', '{使|つか}わない{物|もの}を{買|か}うのは、お{金|かね}の{無駄|むだ}です。'],
          ro: ['Maitsuki niman\'en zutsu chokin shite imasu.', 'Tsukawanai mono o kau no wa, okane no muda desu.'],
          hoi: '{貯金|ちょきん} và {節約|せつやく} khác nhau thế nào?',
          dap: '{貯金|ちょきん} = để dành, tích tiền (tiền VÀO); {節約|せつやく} = bớt tiêu (tiền RA ít). {節約|せつやく}して{貯金|ちょきん}する.',
          ghi: 'Thêm: {必要|ひつよう}（な）— N が{必要|ひつよう}だ; ～ためには N が{必要|ひつよう}だ. {変|か}わる (が — tự) ↔ {変|か}える (を — tha).',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑥ — Quyết định & công việc',
          anh: ['briefcase', 'office-building', 'tear-off-calendar', 'clipboard'],
          nhan: ['{出張|しゅっちょう}', '{転勤|てんきん}', '{決|き}まる', '{結果|けっか}'],
          dong: ['{会議|かいぎ}で、{旅行|りょこう}の{日|ひ}が{決|き}まりました。', '{父|ちち}が{大阪|おおさか}に{転勤|てんきん}します。'],
          ro: ['Kaigi de, ryokou no hi ga kimarimashita.', 'Chichi ga Oosaka ni tenkin shimasu.'],
          hoi: '{転勤|てんきん} và {出張|しゅっちょう} khác nhau thế nào?',
          dap: '{転勤|てんきん}: chuyển HẲN sang làm ở nơi khác; {出張|しゅっちょう}: đi vài ngày vì công việc rồi về.',
          ghi: 'Thêm: {営業|えいぎょう}する (mở cửa kinh doanh — {営業中|えいぎょうちゅう}), {方法|ほうほう} (phương pháp), {以内|いない} (trong vòng — 30{分|ぷん}{以内|いない}). {決|き}める (を) ↔ {決|き}まる (が) — y như ことにする ↔ ことになる!',
        },
        {
          tieuDe: '⑤ ～ことにする — "tôi (tự) quyết định…"',
          anh: ['no-smoking', 'thinking-face'],
          nhan: ['たばこをやめる', '{色々|いろいろ}{考|かんが}えて'],
          dong: ['{健康|けんこう}のために、たばこをやめることにしました。', '{夏休|なつやす}みは{国|くに}へ{帰|かえ}らないことにしました。'],
          ro: ['Kenkou no tame ni, tabako o yameru koto ni shimashita.', 'Natsuyasumi wa kuni e kaeranai koto ni shimashita.'],
          bang: { head: ['Dạng', 'Nghĩa'], rows: [['～ことにする／しよう', 'quyết ngay lúc nói'], ['～ことにしました', 'đã quyết (báo tin)'], ['～ないことにしました', 'quyết KHÔNG làm']] },
          hoi: 'Vì sao lại là "こと + に + する"?',
          dap: 'こと biến cụm động từ thành danh từ ("việc V"), **に する** = chọn — giống コーヒー**に**します. → "chọn việc V".',
          ghi: 'Trợ từ luôn là に: ~~ことをしました~~. Trước こと là thể từ điển / ない (việc CHƯA làm). Hỏi: どうして～ことにしたんですか.',
        },
        {
          tieuDe: '⑤ ～ことにしている — "tôi đặt lệ…"',
          anh: ['notebook', 'alarm-clock'],
          nhan: ['{日記|にっき}', '{毎朝|まいあさ}'],
          dong: ['{毎晩|まいばん}、{日本語|にほんご}で{日記|にっき}を{書|か}くことにしています。', '{給料|きゅうりょう}をもらったら、{必|かなら}ず{一万円|いちまんえん}{貯金|ちょきん}することにしています。'],
          ro: ['Maiban, nihongo de nikki o kaku koto ni shite imasu.', 'Kyuuryou o morattara, kanarazu ichiman\'en chokin suru koto ni shite imasu.'],
          hoi: '「{毎朝|まいあさ}{走|はし}ることにしています」 và 「{毎朝|まいあさ}{走|はし}るようにしています」 khác nhau thế nào?',
          dap: 'ことにしている = **luật** mình tự đặt (cứng, + {必|かなら}ず); ようにしている = **cố gắng** (mềm, + なるべく).',
          ghi: 'Mẹo đề N4: thấy {必|かなら}ず → ことにしている; thấy なるべく／できるだけ → ようにしている.',
        },
        {
          tieuDe: 'Dự định & quyết định — chắc đến đâu? (ôn Bài 16)',
          bang: { head: ['Mẫu', 'Sắc thái'], rows: [['～（よ）うと{思|おも}っています', 'đang tính'], ['～つもりです', 'có ý định rõ'], ['～ことにしました', 'vừa CHỐT — báo tin'], ['～{予定|よてい}です', 'đã thành lịch'], ['～ことになりました', 'được quyết (không chỉ do mình)']] },
          dong: ['{留学|りゅうがく}しようと{思|おも}っています → {留学|りゅうがく}するつもりです → {留学|りゅうがく}することにしました。'],
          ro: ['Ryuugaku shiyou to omotte imasu → ryuugaku suru tsumori desu → ryuugaku suru koto ni shimashita.'],
          hoi: 'Bạn vừa quyết xong, muốn báo cho thầy biết — dùng つもり hay ことにしました?',
          dap: '**ことにしました** — báo một quyết định vừa chốt. つもり chỉ là ý định trong đầu.',
          ghi: 'Ba mức chắc chắn tăng dần: と{思|おも}っている < つもり < ことにした. 予定 = có ngày giờ cụ thể.',
        },
        {
          tieuDe: '⑥ ～ことになる — "(đã) được quyết định…"',
          anh: ['office-building', 'airplane'],
          nhan: ['{会社|かいしゃ}', '{大阪|おおさか}へ'],
          dong: ['{来月|らいげつ}から{大阪|おおさか}に{転勤|てんきん}することになりました。', '{台風|たいふう}が{来|く}るので、{試合|しあい}は{中止|ちゅうし}することになりました。'],
          ro: ['Raigetsu kara Oosaka ni tenkin suru koto ni narimashita.', 'Taifuu ga kuru node, shiai wa chuushi suru koto ni narimashita.'],
          hoi: 'Ai quyết định việc chuyển công tác trong câu 1?',
          dap: '**Công ty** — không phải người nói → ことになりました.',
          ghi: 'Hay đi với: {会議|かいぎ}で, {会社|かいしゃ}の{命令|めいれい}で, {台風|たいふう}／{雨|あめ}なので, {転勤|てんきん}／{出張|しゅっちょう}／{入院|にゅういん}.',
        },
        {
          tieuDe: '⑥ ～ことになりました — báo tin của mình (khiêm tốn)',
          anh: ['wedding', 'graduation-cap'],
          nhan: ['{結婚|けっこん}', '{進学|しんがく}'],
          dong: ['{実|じつ}は、{来月|らいげつ}{結婚|けっこん}することになりました。', '{来年|らいねん}から{大学院|だいがくいん}に{進学|しんがく}することになりました。'],
          ro: ['Jitsu wa, raigetsu kekkon suru koto ni narimashita.', 'Rainen kara daigakuin ni shingaku suru koto ni narimashita.'],
          hoi: 'Kết hôn là mình quyết — sao lại dùng ことになりました?',
          dap: 'Để nghe **khiêm tốn**: không nhấn "tôi quyết", mà như "mọi chuyện đã thành ra thế". Câu báo tin chuẩn ở chỗ làm.',
          ghi: 'Ở công ty Nhật, khi báo nghỉ việc / chuyển đi / kết hôn: ～ことになりました。{今|いま}まで{本当|ほんとう}にありがとうございました.',
        },
        {
          tieuDe: '⑥ ～ことになっている — "theo quy định / theo lịch…"',
          anh: ['no-smoking', 'house'],
          nhan: ['{禁煙|きんえん}', '{寮|りょう}'],
          dong: ['{寮|りょう}では、11{時|じ}までに{帰|かえ}ることになっています。', 'ここではたばこを{吸|す}わないことになっています。'],
          ro: ['Ryou de wa, juuichiji made ni kaeru koto ni natte imasu.', 'Koko de wa tabako o suwanai koto ni natte imasu.'],
          hoi: '「{私|わたし}は{毎朝|まいあさ}{走|はし}ることになっています」 — đúng hay sai?',
          dap: 'Sai (nếu là luật tự đặt) → **ことにしています**. ことになっている là luật CỦA TỔ CHỨC / xã hội / lịch chung.',
          ghi: 'Gặp rất nhiều trong thông báo, nội quy (bài đọc N4). Danh từ / con số: ～ということになっている ({週|しゅう}28{時間|じかん}までということになっています).',
        },
        {
          tieuDe: '⭐ Bốn mẫu こと — ai quyết?',
          bang: { head: ['Mẫu', 'Ai quyết', 'Khi nào'], rows: [['ことにした', 'mình', 'vừa quyết'], ['ことにしている', 'mình', 'luật lâu dài'], ['ことになった', 'người khác / hoàn cảnh', 'vừa được quyết'], ['ことになっている', 'tổ chức / xã hội', 'quy định có sẵn']] },
          dong: ['{東京|とうきょう}へ{引|ひ}っ{越|こ}すことにしました。（{自分|じぶん}で）', '{東京|とうきょう}へ{引|ひ}っ{越|こ}すことになりました。（{会社|かいしゃ}が）'],
          ro: ['Toukyou e hikkosu koto ni shimashita. (jibun de)', 'Toukyou e hikkosu koto ni narimashita. (kaisha ga)'],
          hoi: 'Chọn: {会議|かいぎ}で、{新|あたら}しいメニューを{出|だ}す（ことにしました／ことになりました）。',
          dap: '**ことになりました** — cuộc họp (tập thể) quyết.',
          ghi: 'Cặp {決|き}める ↔ {決|き}まる: {日|ひ}を{決|き}める ≈ ～ことにする; {日|ひ}が{決|き}まる ≈ ～ことになる.',
        },
        {
          tieuDe: '{会話|かいわ}③ — ひまわり{食堂|しょくどう}で',
          anh: ['man-cook', 'man-student', 'curry-rice'],
          nhan: ['{小林店長|こばやしてんちょう}', 'ナタポン', 'タイカレー'],
          dong: ['{来月|らいげつ}から{日曜日|にちようび}も{営業|えいぎょう}することにしたんだ。', '{大学院|だいがくいん}に{進学|しんがく}することになったんです。', '{日曜日|にちようび}は{図書館|としょかん}で{勉強|べんきょう}することにしているんです。'],
          ro: ['Raigetsu kara nichiyoubi mo eigyou suru koto ni shita n da.', 'Daigakuin ni shingaku suru koto ni natta n desu.', 'Nichiyoubi wa toshokan de benkyou suru koto ni shite iru n desu.'],
          hoi: 'Trong hội thoại ③, câu "{週|しゅう}28{時間|じかん}{以内|いない}ということになっています" là quy định của ai?',
          dap: 'Của **nhà nước** (quy định giờ làm thêm của du học sinh) — không phải của quán, không phải của ナタポン.',
          ghi: 'Đọc to hội thoại ③ theo cặp (anh 小林 — ナタポン). Đánh dấu bốn mẫu こと bằng bốn màu.',
        },
        {
          tieuDe: 'チャレンジ — báo tin cho thầy, cho bạn',
          anh: ['graduation-cap', 'office-building', 'airplane', 'wedding'],
          nhan: ['A', 'B', 'C', 'D'],
          dong: ['A：{何|なに}かニュースがありますか。', 'B：はい。{来年|らいねん}、{日本|にほん}に{留学|りゅうがく}することにしました。'],
          ro: ['A: Nani ka nyuusu ga arimasu ka.', 'B: Hai. Rainen, Nihon ni ryuugaku suru koto ni shimashita.'],
          hoi: 'Tranh B (toà văn phòng — bố được điều đi Hà Nội) — nói gì?',
          dap: '{父|ちち}がハノイに{転勤|てんきん}することになりました。',
          ghi: 'Mỗi người nói 2 tin: một ことにしました (mình quyết) + một ことになりました (được quyết). Người nghe đáp: えっ、どうしてそうすることにしたんですか／おめでとうございます.',
        },
        {
          tieuDe: 'まとめ — cả Bài 21',
          bang: {
            head: ['Cặp', 'する (mình chủ động)', 'なる (tự thành / được quyết)'],
            rows: [
              ['Mục đích', 'ために (V chủ ý)', 'ように (khả năng · Vない)'],
              ['Thay đổi', 'ようにする (cố)', 'ようになる (đã thành)'],
              ['Quyết định', 'ことにする (mình quyết)', 'ことになる (được quyết)'],
              ['Quy tắc', 'ことにしている (luật mình)', 'ことになっている (luật chung)'],
            ],
          },
          ghi: 'Bài về nhà: nói 1 phút "{私|わたし}の{目標|もくひょう}" (mục Nói) và viết 作文 150–200 chữ (mục Viết). Rồi làm Bài tập + Luyện thêm. Bài 22: thể bị động và ～ばかり.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn bài cũ: ようになる／ようにする' },
    {
      t: 'mcq',
      id: 'b21-b3-on',
      title: 'Ôn Buổi 2 (4 câu)',
      items: [
        { q: '{前|まえ}は{納豆|なっとう}が{食|た}べられませんでしたが、{今|いま}は{食|た}べられる（　）。', options: ['ようにしました', 'ようになりました', 'ことにしました', 'ためです'], correct: 1, why: 'Trước không — nay có (năng lực) → **ようになりました**. 〔Taberareru you ni narimashita.〕' },
        { q: '{健康|けんこう}のために、なるべく{歩|ある}く（　）。', options: ['ようにしています', 'ようになっています', 'ことになっています', 'ように'], correct: 0, why: 'なるべく + cố giữ nếp → **ようにしています**. 〔Aruku you ni shite imasu.〕' },
        { q: '{仕事|しごと}が{忙|いそが}しくなって、{運動|うんどう}を（　）なりました。', options: ['しない', 'しなく', 'しないように', 'する'], correct: 1, why: 'Vない → **なくなる**: しなくなりました. 〔Undou o shinaku narimashita.〕' },
        { q: 'すみません。{次|つぎ}は{間違|まちが}えない（　）。', options: ['ようになります', 'ようにします', 'ことになります', 'ためです'], correct: 1, why: 'Lời hứa của mình → **ようにします**. 〔Machigaenai you ni shimasu.〕' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: bảng tin của quán ひまわり食堂' },
    {
      t: 'table',
      caption: 'Giáo viên dán lên bảng "bảng tin nội bộ" của quán ひまわり食堂 — mỗi dòng là một từ mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['{来月|らいげつ}から{日曜日|にちようび}も**{営業|えいぎょう}**します', 'eigyou', 'mở cửa kinh doanh'],
        ['**{会議|かいぎ}**で、{新|あたら}しいメニューが**{決|き}まりました**', 'kaigi · kimarimashita', 'cuộc họp · đã được quyết'],
        ['{店長|てんちょう}：{来週|らいしゅう}{大阪|おおさか}へ**{出張|しゅっちょう}**', 'shucchou', 'đi công tác'],
        ['{電気|でんき}・{水|みず}を**{節約|せつやく}**しましょう！ **{無駄|むだ}**な{電気|でんき}は{消|け}して', 'setsuyaku · muda', 'tiết kiệm · lãng phí'],
        ['アンケートの**{結果|けっか}**：タイカレーが1{位|い}', 'kekka', 'kết quả'],
        ['シフトの{変更|へんこう}は**{三日|みっか}{以内|いない}**に{連絡|れんらく}', 'mikka inai', 'trong vòng ba ngày'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{毎月|まいつき}{二万円|にまんえん}ずつ{貯金|ちょきん}しています。', 'Maitsuki niman\'en zutsu chokin shite imasu.', 'Mỗi tháng tôi để dành đều 20.000 yên.'),
        E('{会議|かいぎ}で、{来月|らいげつ}の{予定|よてい}が{決|き}まりました。', 'Kaigi de, raigetsu no yotei ga kimarimashita.', 'Lịch tháng sau đã được quyết trong cuộc họp.'),
        E('{父|ちち}は{来週|らいしゅう}、{北海道|ほっかいどう}へ{出張|しゅっちょう}します。', 'Chichi wa raishuu, Hokkaidou e shucchou shimasu.', 'Tuần sau bố tôi đi công tác Hokkaido.'),
        E('{漢字|かんじ}を{早|はや}く{覚|おぼ}えるいい{方法|ほうほう}はありませんか。', 'Kanji o hayaku oboeru ii houhou wa arimasen ka.', 'Có cách nào hay để nhớ chữ Hán nhanh không?'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～ことにする・～ことになる: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b21-b3-chia',
      title: 'Luyện nhanh — ことにしました／ことにしています／ことになりました／ことになっています (10 câu)',
      kind: 'fill',
      items: [
        { q: '{辞|や}める → tôi đã quyết định (～ことにしました)', answers: V('{辞|や}めることにしました') },
        { q: '{帰|かえ}る → tôi quyết định KHÔNG (～ことにしました)', answers: V('{帰|かえ}らないことにしました') },
        { q: '{貯金|ちょきん}する → tôi đã quyết định (～ことにしました)', answers: V('{貯金|ちょきん}することにしました') },
        { q: '{書|か}く → tôi đặt lệ (～ことにしています)', answers: V('{書|か}くことにしています') },
        { q: '{食|た}べる → tôi đặt lệ KHÔNG (～ことにしています)', answers: V('{食|た}べないことにしています') },
        { q: '{転勤|てんきん}する → đã được quyết (～ことになりました)', answers: V('{転勤|てんきん}することになりました') },
        { q: '{出張|しゅっちょう}する → đã được quyết (～ことになりました)', answers: V('{出張|しゅっちょう}することになりました') },
        { q: 'しない → đã được quyết là không (～ことになりました)', answers: ['しないことになりました'] },
        { q: '{始|はじ}まる → theo quy định (～ことになっています)', answers: V('{始|はじ}まることになっています') },
        { q: '{吸|す}う → theo quy định KHÔNG (～ことになっています)', answers: V('{吸|す}わないことになっています') },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-b3-phan-biet',
      title: 'Phân biệt — ことにする／ことになる／ようにする (6 câu)',
      items: [
        { q: '{父|ちち}は{会社|かいしゃ}の{命令|めいれい}で、{来月|らいげつ}から{福岡|ふくおか}で{働|はたら}く（　）。', options: ['ことにしました', 'ことになりました', 'ようにしました', 'ようになりました'], correct: 1, why: 'Lệnh công ty → **ことになりました**. 〔Fukuoka de hataraku koto ni narimashita.〕' },
        { q: '{色々|いろいろ}{考|かんが}えて、{私|わたし}は{会社|かいしゃ}を{辞|や}める（　）。', options: ['ことにしました', 'ことになりました', 'ようになりました', 'ことになっています'], correct: 0, why: 'Tự suy nghĩ rồi quyết → **ことにしました**. 〔Kaisha o yameru koto ni shimashita.〕' },
        { q: '{私|わたし}は{毎朝|まいあさ}{必|かなら}ず{新聞|しんぶん}を{読|よ}む（　）。', options: ['ことになっています', 'ことにしています', 'ようになりました', 'ためです'], correct: 1, why: '**{必|かなら}ず** + luật của chính mình → **ことにしています**. 〔Shinbun o yomu koto ni shite imasu.〕' },
        { q: 'この{図書館|としょかん}では、{食|た}べたり{飲|の}んだりしてはいけない（　）。', options: ['ことにしています', 'ことになっています', 'ようにしています', 'ようになっています'], correct: 1, why: 'Nội quy của thư viện → **ことになっています**. 〔Shite wa ikenai koto ni natte imasu.〕' },
        { q: 'なるべく{夜|よる}{遅|おそ}く{食|た}べない（　）。', options: ['ようにしています', 'ことになっています', 'ことになりました', 'ようになりました'], correct: 0, why: '**なるべく** = cố gắng → **ようにしています**. 〔Osoku tabenai you ni shite imasu.〕' },
        { q: 'A「{来週|らいしゅう}の{旅行|りょこう}、{雨|あめ}だったらどうする？」 B「じゃ、{雨|あめ}なら{映画|えいが}を{見|み}に{行|い}く（　）。」', options: ['ことにしよう', 'ことになろう', 'ようになろう', 'ことになっている'], correct: 0, why: 'Hai người tự quyết ngay lúc nói → **ことにしよう** (ことにする + ý chí — ôn Bài 16). ~~ことになろう~~ không dùng. 〔Eiga o mi ni iku koto ni shiyou.〕' },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-b3-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～ことにしました · ～ことにしています · ～ことになりました · ～ことになっています',
      items: [
        { q: 'Tôi đã quyết định từ tháng sau đi học tiếng Anh.', answers: V('{来月|らいげつ}から{英語|えいご}を{習|なら}うことにしました。', '{来月|らいげつ}から{英語|えいご}の{教室|きょうしつ}に{通|かよ}うことにしました。', '{来月|らいげつ}から{英語|えいご}を{勉強|べんきょう}することにしました。'), hint: 'ならう ことにしました' },
        { q: 'Tôi quyết định không mua đồ không cần thiết.', answers: V('{必要|ひつよう}ない{物|もの}は{買|か}わないことにしました。', '{必要|ひつよう}じゃない{物|もの}は{買|か}わないことにしました。'), hint: 'かわない ことにしました' },
        { q: 'Tôi đặt lệ mỗi tháng để dành 10.000 yên.', answers: V('{毎月|まいつき}{一万円|いちまんえん}{貯金|ちょきん}することにしています。', '{毎月|まいつき}{一万円|いちまんえん}ずつ{貯金|ちょきん}することにしています。'), hint: 'ちょきんする ことにしています' },
        { q: 'Tuần sau tôi được cử đi công tác Osaka.', answers: V('{来週|らいしゅう}、{大阪|おおさか}へ{出張|しゅっちょう}することになりました。', '{来週|らいしゅう}、{大阪|おおさか}に{出張|しゅっちょう}することになりました。'), hint: 'しゅっちょうする ことになりました' },
        { q: 'Thật ra là tháng 3 tôi sẽ về nước. (báo tin khiêm tốn)', answers: V('{実|じつ}は、3{月|がつ}に{国|くに}へ{帰|かえ}ることになりました。', '{実|じつ}は、{三月|さんがつ}に{国|くに}へ{帰|かえ}ることになりました。', '{実|じつ}は、3{月|がつ}で{国|くに}へ{帰|かえ}ることになりました。'), hint: 'かえる ことになりました' },
        { q: 'Theo quy định, trong thư viện không được nói chuyện điện thoại.', answers: V('{図書館|としょかん}では{電話|でんわ}で{話|はな}してはいけないことになっています。', '{図書館|としょかん}の{中|なか}では{電話|でんわ}で{話|はな}してはいけないことになっています。'), hint: '～てはいけない ことになっています' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**ことにする = mình quyết; ことになる = được quyết** (công ty, cuộc họp, hoàn cảnh) — hoặc báo tin của mình một cách khiêm tốn. Dạng báo tin: **～ことにしました／～ことになりました**.',
        '**ことにしている = luật của mình** (+ {必|かなら}ず); **ことになっている = luật chung** (nội quy, pháp luật, lịch). Đừng nhầm với **ようにしている** (cố gắng, + なるべく).',
        '**Cả bài là bốn cặp する ↔ なる**: ために↔ように · ようにする↔ようになる · ことにする↔ことになる · ことにしている↔ことになっている. Hỏi "ai làm chủ?" là chọn đúng.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{最近|さいきん}、{何|なに}か{決|き}めたことがありますか。', ro: 'Saikin, nani ka kimeta koto ga arimasu ka.', vi: 'Gần đây em có quyết định điều gì không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。お{金|かね}を{節約|せつやく}するために、{毎日|まいにち}お{弁当|べんとう}を{作|つく}ることにしました。', ro: 'Hai. Okane o setsuyaku suru tame ni, mainichi obentou o tsukuru koto ni shimashita.', vi: 'Có ạ. Để tiết kiệm tiền, em đã quyết định ngày nào cũng tự làm cơm hộp.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{毎日|まいにち}{必|かなら}ずしていることはありますか。', ro: 'Mainichi kanarazu shite iru koto wa arimasu ka.', vi: 'Có việc gì ngày nào em cũng nhất định làm không?' },
        { who: 'Bạn', role: 'candidate', text: '{寝|ね}る{前|まえ}に{必|かなら}ず{単語|たんご}を{十|じゅう}{覚|おぼ}えることにしています。', ro: 'Neru mae ni kanarazu tango o juu oboeru koto ni shite imasu.', vi: 'Trước khi ngủ em đặt lệ nhất định học thuộc 10 từ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'あなたの{寮|りょう}には、どんな{規則|きそく}がありますか。', ro: 'Anata no ryou ni wa, donna kisoku ga arimasu ka.', vi: 'Ký túc xá của em có những quy định gì?' },
        { who: 'Bạn', role: 'candidate', text: '{夜|よる}11{時|じ}までに{帰|かえ}ることになっています。それから、{部屋|へや}でたばこを{吸|す}ってはいけないことになっています。', ro: 'Yoru juuichiji made ni kaeru koto ni natte imasu. Sorekara, heya de tabako o sutte wa ikenai koto ni natte imasu.', vi: 'Theo quy định phải về trước 11 giờ đêm. Rồi trong phòng không được hút thuốc ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{転勤|てんきん}することにしました」と「{転勤|てんきん}することになりました」は、どう{違|ちが}いますか。', ro: '"Tenkin suru koto ni shimashita" to "tenkin suru koto ni narimashita" wa, dou chigaimasu ka.', vi: '"Tenkin suru koto ni shimashita" và "tenkin suru koto ni narimashita" khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「ことにしました」は{自分|じぶん}で{決|き}めたことで、「ことになりました」は{会社|かいしゃ}などが{決|き}めたことです。', ro: '"Koto ni shimashita" wa jibun de kimeta koto de, "koto ni narimashita" wa kaisha nado ga kimeta koto desu.', vi: '"Koto ni shimashita" là việc mình tự quyết, còn "koto ni narimashita" là việc công ty hay ai đó quyết ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{健康|けんこう}のために、{来月|らいげつ}からジムに{通|かよ}う（　）。', options: ['ことにしました', 'ようになりました', 'ことになっています', 'ためです'], correct: 0, why: 'Quyết định của chính mình (vì sức khoẻ) → **ことにしました**. 〔Jimu ni kayou koto ni shimashita.〕' },
        { q: '{会議|かいぎ}で、{次|つぎ}のイベントは{五月|ごがつ}にする（　）。', options: ['ことにしています', 'ことになりました', 'ようにしました', 'ようになりました'], correct: 1, why: 'Cuộc họp (tập thể) quyết → **ことになりました**. 〔Gogatsu ni suru koto ni narimashita.〕' },
        { q: 'この{会社|かいしゃ}では、{毎朝|まいあさ}{九時|くじ}に{会議|かいぎ}をする（　）。', options: ['ことになっています', 'ことにしています', 'ようにしています', 'ようになりました'], correct: 0, why: 'Lịch / quy định của công ty → **ことになっています**. 〔Kaigi o suru koto ni natte imasu.〕' },
        { q: '{私|わたし}は{毎晩|まいばん}{必|かなら}ず{家族|かぞく}に{電話|でんわ}する（　）。', options: ['ことになっています', 'ことにしています', 'ようになりました', 'ように'], correct: 1, why: '**{必|かなら}ず** + luật của mình → **ことにしています**. 〔Kazoku ni denwa suru koto ni shite imasu.〕' },
        { q: '{実|じつ}は、{三月|さんがつ}で{国|くに}へ{帰|かえ}る（　）。{今|いま}まで{本当|ほんとう}にありがとうございました。', options: ['ことになりました', 'ようになりました', 'ようにしました', 'ためです'], correct: 0, why: 'Câu báo tin khiêm tốn ở chỗ làm → **ことになりました**. ようになりました = "đã trở nên…" — sai nghĩa. 〔Kuni e kaeru koto ni narimashita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 48 từ của mục Từ vựng). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{目標|もくひょう}', 'mokuhyou', 'mục tiêu'],
  ['{立|た}てます', 'tatemasu', 'lập, đặt ra (kế hoạch, mục tiêu)'],
  ['{努力|どりょく}します', 'doryoku shimasu', 'nỗ lực'],
  ['{続|つづ}けます', 'tsuzukemasu', 'tiếp tục (làm gì)'],
  ['{続|つづ}きます', 'tsuzukimasu', '(việc gì) tiếp diễn, kéo dài'],
  ['{諦|あきら}めます', 'akiramemasu', 'từ bỏ, bỏ cuộc'],
  ['{我慢|がまん}します', 'gaman shimasu', 'nhịn, chịu đựng'],
  ['チャレンジします', 'charenji shimasu', 'thử sức (việc khó)'],
  ['{少|すこ}しずつ', 'sukoshi zutsu', 'từng chút một'],
  ['なるべく', 'narubeku', 'cố hết mức có thể'],
  ['{復習|ふくしゅう}します', 'fukushuu shimasu', 'ôn tập (bài cũ)'],
  ['{予習|よしゅう}します', 'yoshuu shimasu', 'xem bài trước'],
  ['{単語|たんご}', 'tango', 'từ vựng'],
  ['{文法|ぶんぽう}', 'bunpou', 'ngữ pháp'],
  ['{発音|はつおん}', 'hatsuon', 'phát âm'],
  ['{成績|せいせき}', 'seiseki', 'thành tích, điểm số'],
  ['{点|てん}', 'ten', 'điểm (số điểm)'],
  ['{受|う}かります', 'ukarimasu', 'thi đỗ'],
  ['{問題集|もんだいしゅう}', 'mondaishuu', 'sách bài tập'],
  ['{留学|りゅうがく}します', 'ryuugaku shimasu', 'du học'],
  ['{健康|けんこう}', 'kenkou', 'sức khoẻ'],
  ['{体重|たいじゅう}', 'taijuu', 'cân nặng'],
  ['ダイエットします', 'daietto shimasu', 'ăn kiêng, giảm cân'],
  ['{早寝早起|はやねはやお}き', 'hayane hayaoki', 'ngủ sớm dậy sớm'],
  ['{夜|よ}ふかしします', 'yofukashi shimasu', 'thức khuya'],
  ['{目覚|めざ}まし{時計|どけい}', 'mezamashi dokei', 'đồng hồ báo thức'],
  ['{禁煙|きんえん}します', 'kin\'en shimasu', 'bỏ thuốc lá'],
  ['{階段|かいだん}', 'kaidan', 'cầu thang bộ'],
  ['{運動不足|うんどうぶそく}', 'undou busoku', 'thiếu vận động'],
  ['{気|き}をつけます', 'ki o tsukemasu', 'chú ý, cẩn thận'],
  ['{貯金|ちょきん}します', 'chokin shimasu', 'để dành tiền'],
  ['{節約|せつやく}します', 'setsuyaku shimasu', 'tiết kiệm (chi tiêu)'],
  ['{無駄|むだ}', 'muda', 'lãng phí'],
  ['{必要|ひつよう}', 'hitsuyou', 'cần thiết'],
  ['{増|ふ}えます', 'fuemasu', '(số lượng) tăng lên'],
  ['{増|ふ}やします', 'fuyashimasu', 'làm tăng, tăng thêm'],
  ['{減|へ}ります', 'herimasu', '(số lượng) giảm đi'],
  ['{減|へ}らします', 'herashimasu', 'làm giảm, cắt giảm'],
  ['{変|か}わります', 'kawarimasu', '(cái gì) thay đổi'],
  ['{変|か}えます', 'kaemasu', 'thay đổi (cái gì)'],
  ['{決|き}まります', 'kimarimasu', '(việc gì) được quyết định'],
  ['{会議|かいぎ}', 'kaigi', 'cuộc họp'],
  ['{転勤|てんきん}します', 'tenkin shimasu', 'chuyển công tác'],
  ['{出張|しゅっちょう}します', 'shucchou shimasu', 'đi công tác'],
  ['{営業|えいぎょう}します', 'eigyou shimasu', '(cửa hàng) mở cửa kinh doanh'],
  ['{結果|けっか}', 'kekka', 'kết quả'],
  ['{方法|ほうほう}', 'houhou', 'phương pháp'],
  ['{以内|いない}', 'inai', 'trong vòng, không quá'],
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
  id: 'b21-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (40 câu)',
  goal: 'Nhớ chắc 48 từ của Bài 21 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp dễ nhầm (目標・夢・計画, 貯金・節約, 受ける・受かる, 諦める・やめる, 増える・上がる, 転勤・出張) và bốn cặp tự ↔ tha động từ (続く・続ける, 増える・増やす, 減る・減らす, 変わる・変える).',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 15 câu Nhật → Việt và 10 câu Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N4.',
        'Lỗi hay mắc: {計画|けいかく}を~~{作|つく}る~~ (→ {立|た}てる), {成績|せいせき}が~~{増|ふ}える~~ (→ {上|あ}がる), たばこを~~{諦|あきら}める~~ (→ やめる), {試験|しけん}を~~{受|う}かる~~ (→ に{受|う}かる／を{受|う}ける), nhầm が ↔ を trong cặp tự / tha.',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b21-lt1-nv', title: 'Nhật → Việt (15 câu)', items: MCQ_NV(0, 15) },
    { t: 'mcq', id: 'b21-lt1-vn', title: 'Việt → Nhật (10 câu)', items: MCQ_VN(22, 32) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b21-lt1-dien',
      title: 'Điền từ (15 câu)',
      items: [
        { q: '{来年|らいねん}の（　）は、{日本語|にほんご}で{会社|かいしゃ}の{面接|めんせつ}を{受|う}けることです。', options: ['{目標|もくひょう}', '{結果|けっか}', '{方法|ほうほう}', '{体重|たいじゅう}'], correct: 0, why: 'Điều muốn đạt được năm sau = **{目標|もくひょう}**. 〔Rainen no mokuhyou wa…〕' },
        { q: '{一度|いちど}{失敗|しっぱい}しても、{夢|ゆめ}を（　）ないでください。', options: ['{諦|あきら}め', '{続|つづ}け', '{我慢|がまん}し', '{立|た}て'], correct: 0, why: 'Đừng từ bỏ ước mơ = **{夢|ゆめ}を{諦|あきら}めないで**. 〔Yume o akiramenaide kudasai.〕' },
        { q: 'ダイエット{中|ちゅう}なので、ケーキを（　）しています。', options: ['{我慢|がまん}', '{努力|どりょく}', '{営業|えいぎょう}', '{予習|よしゅう}'], correct: 0, why: 'Nhịn bánh ngọt = **ケーキを{我慢|がまん}する**. 〔Keeki o gaman shite imasu.〕' },
        { q: '{来年|らいねん}はN2に（　）するつもりです。', options: ['チャレンジ', '{禁煙|きんえん}', '{節約|せつやく}', '{転勤|てんきん}'], correct: 0, why: 'Thử sức với N2 = **N2にチャレンジする**. 〔Enu-ni ni charenji suru tsumori desu.〕' },
        { q: '{授業|じゅぎょう}の{前|まえ}に、{新|あたら}しい{課|か}を（　）しておいてください。', options: ['{予習|よしゅう}', '{復習|ふくしゅう}', '{留学|りゅうがく}', '{出張|しゅっちょう}'], correct: 0, why: 'Trước giờ học → xem trước = **{予習|よしゅう}**. Sau giờ học mới là {復習|ふくしゅう}. 〔Atarashii ka o yoshuu shite oite kudasai.〕' },
        { q: 'この（　）を{最後|さいご}まで{全部|ぜんぶ}やりました。', options: ['{問題集|もんだいしゅう}', '{発音|はつおん}', '{会議|かいぎ}', '{健康|けんこう}'], correct: 0, why: 'Làm hết từ đầu đến cuối = **{問題集|もんだいしゅう}** (sách bài tập). 〔Kono mondaishuu o saigo made…〕' },
        { q: '{漢字|かんじ}のテストで、90（　）を{取|と}りました。', options: ['{点|てん}', '{成績|せいせき}', '{結果|けっか}', '{以内|いない}'], correct: 0, why: '90 điểm = **90{点|てん}** (きゅうじゅってん). 〔Kyuujutten o torimashita.〕' },
        { q: '{夜|よ}ふかしをして、{朝|あさ}（　）が{鳴|な}っても{起|お}きられませんでした。', options: ['{目覚|めざ}まし{時計|どけい}', '{階段|かいだん}', '{体重|たいじゅう}', '{会議|かいぎ}'], correct: 0, why: 'Thứ kêu buổi sáng = **{目覚|めざ}まし{時計|どけい}**. 〔Mezamashi dokei ga nattemo…〕' },
        { q: 'エレベーターが{止|と}まっているので、（　）で{五階|ごかい}まで{上|あ}がりました。', options: ['{階段|かいだん}', '{健康|けんこう}', '{運動不足|うんどうぶそく}', '{禁煙|きんえん}'], correct: 0, why: 'Thang máy dừng → đi **{階段|かいだん}** (cầu thang bộ). 〔Kaidan de gokai made agarimashita.〕' },
        { q: '{電気|でんき}をつけたまま{寝|ね}るのは、{電気|でんき}の（　）です。', options: ['{無駄|むだ}', '{必要|ひつよう}', '{貯金|ちょきん}', '{結果|けっか}'], correct: 0, why: 'Để đèn sáng khi ngủ = **{無駄|むだ}** (lãng phí). 〔Denki no muda desu.〕' },
        { q: '{東京|とうきょう}に{住|す}む{人|ひと}は、{毎年|まいとし}（　）います。', options: ['{増|ふ}えて', '{増|ふ}やして', '{上|あ}げて', '{変|か}えて'], correct: 0, why: 'Số người tăng, chủ ngữ + が (ẩn) → tự động từ **{増|ふ}える**. 〔Maitoshi fuete imasu.〕' },
        { q: '{健康|けんこう}のために、お{酒|さけ}を{飲|の}む{日|ひ}を（　）ことにしました。', options: ['{減|へ}る', '{減|へ}らす', '{増|ふ}える', '{変|か}わる'], correct: 1, why: 'N **を** + làm giảm → tha động từ **{減|へ}らす**. {減|へ}る không đi với を. 〔Nomu hi o herasu koto ni shimashita.〕' },
        { q: '{来月|らいげつ}から、{会議|かいぎ}の{時間|じかん}が{九時|くじ}に（　）。', options: ['{変|か}わります', '{変|か}えます', '{決|き}めます', '{立|た}てます'], correct: 0, why: 'Giờ họp (が) thay đổi → tự động từ **{変|か}わる**. 〔Kaigi no jikan ga kuji ni kawarimasu.〕' },
        { q: '{父|ちち}は{来週|らいしゅう}、{三日間|みっかかん}{大阪|おおさか}へ（　）します。', options: ['{出張|しゅっちょう}', '{転勤|てんきん}', '{留学|りゅうがく}', '{営業|えいぎょう}'], correct: 0, why: 'Đi 3 ngày vì công việc rồi về = **{出張|しゅっちょう}**. {転勤|てんきん} = chuyển hẳn. 〔Oosaka e shucchou shimasu.〕' },
        { q: '{申|もう}し{込|こ}みは、{一週間|いっしゅうかん}（　）にしてください。', options: ['{以内|いない}', 'ずつ', '{以上|いじょう}', 'なるべく'], correct: 0, why: '"Trong vòng một tuần" = **{一週間|いっしゅうかん}{以内|いない}に**. 〔Isshuukan inai ni shite kudasai.〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b21-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống, đồng âm (22 câu)',
  goal: 'Đọc và viết đúng 15 chữ Hán mới trong từ (kể cả từ ghép mở rộng: 標準・保健室・貯金箱・連続・手続き・重要・成功・性格・往復・禁止…), chọn chữ đúng cho từ viết kana, phân biệt chữ trông giống (標・票, 努・怒, 健・建, 続・読, 績・積, 格・絡, 復・複・腹, 減・感) và từ đồng âm (要る・いる, 受ける・受かる).',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢** 10 câu đọc từ (漢字読み) — có cả từ ghép mở rộng của 15 chữ. **🟡** 8 câu chọn chữ (表記). **🔴** 4 câu chữ trông giống / đồng âm.',
        'Sai câu nào → mở thẻ chữ đó (chạm vào chữ) xem hoạt hình nét và từ đi chung.',
      ],
    },
    {
      t: 'mcq',
      id: 'b21-lt2-doc',
      title: '🟢 漢字読み — cách đọc của từ in đậm (10 câu)',
      items: [
        { q: 'この{国|くに}の**標準**の{言葉|ことば}を{習|なら}いました。', options: ['ひょうじゅん', 'ひょうじゅ', 'ひょじゅん', 'しるべじゅん'], correct: 0, why: '**{標準|ひょうじゅん}** (hyoujun) — tiêu chuẩn. 標 ヒョウ + 準 ジュン (Bài 12).' },
        { q: '{具合|ぐあい}が{悪|わる}いときは、**保健室**へ{行|い}ってください。', options: ['ほけんしつ', 'ほうけんしつ', 'ほけんしち', 'ほごしつ'], correct: 0, why: '**{保健室|ほけんしつ}** (hokenshitsu) — phòng y tế trường học.' },
        { q: '**貯金箱**にお{金|かね}を{入|い}れました。', options: ['ちょきんはこ', 'ちょきんばこ', 'ちょうきんばこ', 'たきんばこ'], correct: 1, why: '**{貯金箱|ちょきんばこ}** (chokinbako) — 箱 はこ → **ばこ** (đục khi ghép, như {箱|はこ} Bài 18).' },
        { q: '{雨|あめ}の{日|ひ}が**連続**で{五日|いつか}{続|つづ}きました。', options: ['れんしょく', 'れんぞく', 'れんそく', 'れいぞく'], correct: 1, why: '**{連続|れんぞく}** (renzoku) — 続 ゾク; 連 (Bài 18).' },
        { q: 'ビザの**手続**きをしました。', options: ['てつづ', 'てぞく', 'しゅぞく', 'てづつ'], correct: 0, why: '**{手続|てつづ}き** (tetsuzuki) — thủ tục.' },
        { q: 'これはとても**重要**な{会議|かいぎ}です。', options: ['じゅうよう', 'ちょうよう', 'おもよう', 'じゅよう'], correct: 0, why: '**{重要|じゅうよう}** (juuyou) — quan trọng. 重 ジュウ (Bài 17) + 要 ヨウ.' },
        { q: '{新|あたら}しい{店|みせ}は**成功**しました。', options: ['せいこう', 'じょうこう', 'せいく', 'なりこう'], correct: 0, why: '**{成功|せいこう}** (seikou) — thành công.' },
        { q: '{兄|あに}はやさしい**性格**です。', options: ['せいかく', 'しょうかく', 'せいがく', 'せいこう'], correct: 0, why: '**{性格|せいかく}** (seikaku) — tính cách. 格 カク.' },
        { q: '{東京|とうきょう}まで**往復**で{一万円|いちまんえん}です。', options: ['おうふく', 'おふく', 'おうぶく', 'ゆきふく'], correct: 0, why: '**{往復|おうふく}** (oufuku) — khứ hồi.' },
        { q: 'ここでは{写真|しゃしん}は**禁止**です。', options: ['きんし', 'きんじ', 'ぎんし', 'きんと'], correct: 0, why: '**{禁止|きんし}** (kinshi) — cấm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-lt2-chon',
      title: '🟡 表記 — chọn chữ đúng (8 câu)',
      items: [
        { q: '{毎日|まいにち}の**どりょく**が{大切|たいせつ}です。', options: ['怒力', '努力', '奴力', '努刀'], correct: 1, why: '**努力** — 奴 + 力. 怒 (giận) có 心 dưới.' },
        { q: '**けんこう**のために{歩|ある}きます。', options: ['建康', '健康', '健庫', '建庫'], correct: 1, why: '**健康** — 健 = 亻 + 建.' },
        { q: '{雨|あめ}が**つづいて**います。', options: ['読いて', '続いて', '売いて', '統いて'], correct: 1, why: '**続く** — 糸 + 売. 読 có 言 bên trái.' },
        { q: '**ひつよう**な{物|もの}だけ{買|か}います。', options: ['必要', '心要', '必票', '必腰'], correct: 0, why: '**必要** — 必 có nét phẩy cắt qua 心; 要 dưới là 女.' },
        { q: '{試験|しけん}に**ごうかく**しました。', options: ['合格', '合各', '合絡', '会格'], correct: 0, why: '**合格** — 格 = 木 + 各. 絡 (連絡) trái là 糸.' },
        { q: '{習|なら}ったことを**ふくしゅう**します。', options: ['複習', '腹習', '復習', '復週'], correct: 2, why: '**復習** — 復 trái là 彳 (bước đi).' },
        { q: '{外国人|がいこくじん}の{観光客|かんこうきゃく}が**ふえて**います。', options: ['増えて', '贈えて', '層えて', '曽えて'], correct: 0, why: '**増える** — 土 + 曽. 贈 (tặng) trái là 貝.' },
        { q: 'ここは**きんえん**です。', options: ['禁煙', '林煙', '禁燃', '禁炎'], correct: 0, why: '**禁煙** — 禁 = 林 + 示; 煙 = khói (火 + 垔).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-lt2-bay',
      title: '🔴 Bẫy — chữ trông giống, đồng âm (4 câu)',
      items: [
        { q: '「{明日|あした}は{傘|かさ}が**いります**か。」— chữ đúng là？', options: ['居ります', '要ります', '入ります', '射ります'], correct: 1, why: '"Cần" = **要る** (いる — nhóm 1: いります). いる "có, ở" (người) viết kana; 入る đọc はいる. Đồng âm khác chữ!' },
        { q: '「{試験|しけん}に**うかりました**」— chữ đúng là？', options: ['受かりました', '浮かりました', '請かりました', '授かりました'], correct: 0, why: '**受かる** (đỗ) — cùng chữ 受 với **受ける** (dự thi). Đề hay hỏi: {試験|しけん}**を受ける** → {試験|しけん}**に受かる**.' },
        { q: '「せいせき」の{漢字|かんじ}は？', options: ['成積', '成績', '城績', '正績'], correct: 1, why: '**成績** — 績 trái là 糸 (sợi). 積 (chất đống — {面積|めんせき}) trái là 禾.' },
        { q: '「へります」の{漢字|かんじ}は？', options: ['減ります', '感ります', '滅ります', '経ります'], correct: 0, why: '**減る** — 氵 + 咸. 感 (cảm) có 心 dưới; 経 (経験 — Bài 14) đọc へる chỉ ở nghĩa "trải qua" (N1).' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b21-lt-3-noi-the',
  kind: 'homework',
  title: 'Luyện thêm 3 · Nối thể — ～ために, ～ように, ～ようになる・なくなる, ～ようにする, ～ことにする・ことになる (28 câu gõ)',
  goal: 'Nối nhanh và đúng từng mẫu với V辞書形 / thể khả năng / Vない / N, chia đúng các dạng ～ようになりました・～なくなりました・～ようにしています・～ようにしてください・～ことにしました・～ことにしています・～ことになりました・～ことになっています — nền tảng để không sai ở phần ngữ pháp.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**Trước sáu mẫu là V{辞書形|じしょけい} hoặc Vない** (riêng ために nhận thêm **N の**; ように／ようになる hay đi với **thể khả năng**). Thì nằm ở **cuối câu**: ～ように**なりました**, ～ことに**しています**.',
        'Gõ bằng kana hoặc chữ Hán đều được. Mỗi phần 7 câu; làm lại phần nào sai ≥ 2 câu.',
      ],
    },
    {
      t: 'quiz',
      id: 'b21-lt3-mucdich',
      title: '① Mục đích — ために／ように (7 câu)',
      kind: 'fill',
      grammar: 'V辞書形／Nの ＋ ために · V可能形／わかる・見える・聞こえる・なる／Vない ＋ ように',
      items: [
        { q: '{働|はたら}く → để (～ために)', answers: V('{働|はたら}くために'), hint: 'V chủ ý' },
        { q: '{試験|しけん} → để (～ために)', answers: V('{試験|しけん}のために'), hint: 'N + の' },
        { q: '{書|か}く → để viết được (～ように)', answers: V('{書|か}けるように'), hint: 'thể khả năng' },
        { q: '{見|み}える → để nhìn thấy (～ように)', answers: V('{見|み}えるように'), hint: 'không chủ ý' },
        { q: '{間違|まちが}える → để khỏi nhầm (～ように)', answers: V('{間違|まちが}えないように'), hint: 'Vない' },
        { q: '{太|ふと}る → để khỏi béo (～ように)', answers: V('{太|ふと}らないように'), hint: 'Vない (nhóm 1)' },
        { q: '{元気|げんき}になる → để mau khoẻ (～ように)', answers: V('{元気|げんき}になるように'), hint: 'なる (không chủ ý)' },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-lt3-naru',
      title: '② Thay đổi — ようになりました／なくなりました (7 câu)',
      kind: 'fill',
      grammar: 'V可能形 ＋ ようになりました (năng lực) · V辞書形 ＋ ようになりました (thói quen) · Vない → なくなりました',
      items: [
        { q: '{話|はな}す → giờ đã nói được', answers: V('{話|はな}せるようになりました'), hint: 'thể khả năng' },
        { q: '{来|く}る → giờ đã đến được', answers: V('{来|こ}られるようになりました'), hint: '来る → 来られる' },
        { q: 'する（{運転|うんてん}） → giờ đã lái được', answers: V('{運転|うんてん}できるようになりました'), hint: 'する → できる' },
        { q: '{乗|の}る（{自転車|じてんしゃ}に） → giờ đã đi được', answers: V('{自転車|じてんしゃ}に{乗|の}れるようになりました', '{乗|の}れるようになりました'), hint: '乗る → 乗れる' },
        { q: '{使|つか}う → (thói quen mới) bắt đầu dùng', answers: V('{使|つか}うようになりました'), hint: 'V辞書形' },
        { q: '{食|た}べる → không ăn nữa', answers: V('{食|た}べなくなりました'), hint: 'Vない → なくなりました' },
        { q: '{会|あ}う → không gặp nữa', answers: V('{会|あ}わなくなりました'), hint: 'あう → あわない' },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-lt3-suru',
      title: '③ Nỗ lực — ようにしています／ようにします／ようにしてください (7 câu)',
      kind: 'fill',
      grammar: 'V辞書形／Vない ＋ ようにしています (đang cố) · ようにします (sẽ cố) · ようにしてください (nhớ… nhé)',
      items: [
        { q: '{早|はや}く{寝|ね}る → tôi đang cố', answers: V('{早|はや}く{寝|ね}るようにしています'), hint: 'ようにしています' },
        { q: '{肉|にく}を{食|た}べすぎる → tôi đang cố KHÔNG', answers: V('{肉|にく}を{食|た}べすぎないようにしています'), hint: 'Vない + ようにしています' },
        { q: '{日本語|にほんご}で{話|はな}す → tôi đang cố', answers: V('{日本語|にほんご}で{話|はな}すようにしています'), hint: 'ようにしています' },
        { q: '{忘|わす}れ{物|もの}をする → từ giờ sẽ cố KHÔNG', answers: V('{忘|わす}れ{物|もの}をしないようにします'), hint: 'ようにします' },
        { q: '{毎日|まいにち}{練習|れんしゅう}する → từ giờ sẽ cố', answers: V('{毎日|まいにち}{練習|れんしゅう}するようにします'), hint: 'ようにします' },
        { q: '{水|みず}をたくさん{飲|の}む → nhớ… nhé', answers: V('{水|みず}をたくさん{飲|の}むようにしてください'), hint: 'ようにしてください' },
        { q: '{無理|むり}をする → nhớ đừng… nhé', answers: V('{無理|むり}をしないようにしてください', '{無理|むり}しないようにしてください'), hint: 'Vない + ようにしてください' },
      ],
    },
    {
      t: 'quiz',
      id: 'b21-lt3-koto',
      title: '④ Quyết định — ことにしました／ことにしています／ことになりました／ことになっています (7 câu)',
      kind: 'fill',
      grammar: 'V辞書形／Vない ＋ ことにしました (mình quyết) · ことにしています (luật mình) · ことになりました (được quyết) · ことになっています (quy định)',
      items: [
        { q: '{引|ひ}っ{越|こ}す → tôi đã quyết định', answers: V('{引|ひ}っ{越|こ}すことにしました'), hint: 'ことにしました' },
        { q: 'お{酒|さけ}を{飲|の}む → tôi quyết định KHÔNG', answers: V('お{酒|さけ}を{飲|の}まないことにしました'), hint: 'Vない + ことにしました' },
        { q: '{毎朝|まいあさ}{走|はし}る → tôi đặt lệ', answers: V('{毎朝|まいあさ}{走|はし}ることにしています'), hint: 'ことにしています' },
        { q: '{入院|にゅういん}する → đã được quyết (bác sĩ quyết)', answers: V('{入院|にゅういん}することになりました'), hint: 'ことになりました' },
        { q: '{結婚|けっこん}する → báo tin khiêm tốn', answers: V('{結婚|けっこん}することになりました'), hint: 'ことになりました' },
        { q: '{十時|じゅうじ}に{閉|し}まる → theo quy định', answers: V('{十時|じゅうじ}に{閉|し}まることになっています', '10{時|じ}に{閉|し}まることになっています'), hint: 'ことになっています' },
        { q: '{写真|しゃしん}を{撮|と}ってはいけない → theo quy định', answers: V('{写真|しゃしん}を{撮|と}ってはいけないことになっています'), hint: '～てはいけない + ことになっています' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b21-lt-4-phan-biet',
  kind: 'homework',
  title: 'Luyện thêm 4 · Ngữ pháp — 🟡 chọn trong từng cặp → 🔴 bẫy đề N4 (26 câu)',
  goal: 'Chọn đúng mẫu trong ba cặp hay bị hỏi (ために↔ように, ようになる↔ようにする, ことにする↔ことになる) và cặp ことにしている↔ことになっている↔ようにしている theo câu hỏi "ai làm chủ, mục đích hay kết quả hay quyết định"; nhận ra các bẫy kinh điển (～ないために, 話せるになる, 上手ようになる, ことをする, ようになってください, つもり ↔ ことにした) và sắp xếp câu dài có nhiều mẫu chồng nhau.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟡 Mức Vừa** — 12 câu: mỗi câu có dấu hiệu (V chủ ý / thể khả năng / なるべく / {必|かなら}ず / {会社|かいしゃ}が… / {規則|きそく}). Gạch chân dấu hiệu trước khi chọn.',
        '**🔴 Mức Khó** — 8 câu bẫy + 6 câu ghép (文の組み立て). Sai câu nào → mở "Bảng chọn nhanh khi làm đề" cuối mục Ngữ pháp.',
      ],
    },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn trong từng cặp' },
    {
      t: 'mcq',
      id: 'b21-lt4-cap',
      title: 'Chọn mẫu đúng (12 câu)',
      items: [
        { q: '{将来|しょうらい}{自分|じぶん}の{店|みせ}を{開|ひら}く（　）、{料理|りょうり}の{学校|がっこう}に{通|かよ}っています。', options: ['ために', 'ように', 'ことに', 'ようで'], correct: 0, why: '{開|ひら}く — V chủ ý, cùng một người → **ために**. 〔Mise o hiraku tame ni…〕' },
        { q: '{誰|だれ}でも{使|つか}える（　）、{説明|せつめい}を{英語|えいご}でも{書|か}きました。', options: ['ために', 'ように', 'ことに', 'のに'], correct: 1, why: '{使|つか}える — thể khả năng, khác chủ ngữ → **ように**. 〔Dare demo tsukaeru you ni…〕' },
        { q: '{家族|かぞく}の（　）、{毎日|まいにち}{遅|おそ}くまで{働|はたら}いています。', options: ['ように', 'ために', 'ことに', 'ようで'], correct: 1, why: 'N の + **ために** (vì lợi ích của). N のように = "như N" — sai nghĩa. 〔Kazoku no tame ni…〕' },
        { q: '{子|こ}どものころは{野菜|やさい}が{嫌|きら}いでしたが、{今|いま}は{好|す}きに（　）。', options: ['ようになりました', 'なりました', 'ようにしました', 'ことになりました'], correct: 1, why: '{好|す}き là ナA → **に + なりました** (ポイント 95) — không có ように. 〔Suki ni narimashita.〕' },
        { q: '{子|こ}どものころは{野菜|やさい}が{食|た}べられませんでしたが、{今|いま}は{食|た}べられる（　）。', options: ['ようになりました', 'になりました', 'ようにしました', 'ことにしました'], correct: 0, why: 'Động từ (thể khả năng) → **ようになりました**. So với câu trên: tính từ → になる, động từ → ようになる. 〔Taberareru you ni narimashita.〕' },
        { q: '{毎日|まいにち}、できるだけ{日本語|にほんご}のニュースを{聞|き}く（　）。', options: ['ようにしています', 'ようになっています', 'ことになっています', 'ためです'], correct: 0, why: '**できるだけ** + mình cố → **ようにしています**. 〔Nyuusu o kiku you ni shite imasu.〕' },
        { q: '{毎日|まいにち}ラジオを{聞|き}いていたら、ニュースがわかる（　）。', options: ['ようにしました', 'ようになりました', 'ことにしました', 'ためになりました'], correct: 1, why: 'Kết quả của việc nghe mỗi ngày → **ようになりました**. 〔Nyuusu ga wakaru you ni narimashita.〕' },
        { q: '{会議|かいぎ}で、{来年|らいねん}から{新|あたら}しい{店|みせ}を{出|だ}す（　）。', options: ['ことにしました', 'ことになりました', 'ようになりました', 'ようにしました'], correct: 1, why: 'Cuộc họp (tập thể) quyết → **ことになりました**. 〔Atarashii mise o dasu koto ni narimashita.〕' },
        { q: '{医者|いしゃ}に{相談|そうだん}して、{来月|らいげつ}{手術|しゅじゅつ}を{受|う}ける（　）。', options: ['ことになりました', 'ようになりました', 'ようにしてください', 'ためです'], correct: 0, why: 'Kế hoạch được quyết sau khi bàn với bác sĩ (không chỉ do mình) → **ことになりました**. 〔Shujutsu o ukeru koto ni narimashita.〕' },
        { q: '{雨|あめ}が{降|ふ}りそうだから、{今日|きょう}はタクシーで{帰|かえ}る（　）。', options: ['ことにしよう', 'ことになろう', 'ようになろう', 'ことになっている'], correct: 0, why: 'Tự quyết ngay lúc nói → **ことにしよう** (ことにする + ý chí). 〔Takushii de kaeru koto ni shiyou.〕' },
        { q: 'この{学校|がっこう}では、{授業|じゅぎょう}を{休|やす}むときは、{必|かなら}ず{電話|でんわ}で{連絡|れんらく}する（　）。', options: ['ことにしています', 'ことになっています', 'ようになりました', 'ようにします'], correct: 1, why: '**この{学校|がっこう}では** + {必|かなら}ず → luật của trường → **ことになっています**. 〔Denwa de renraku suru koto ni natte imasu.〕' },
        { q: '{私|わたし}は、{一日|いちにち}に{一回|いっかい}は{必|かなら}ず{母|はは}にメールする（　）。', options: ['ことにしています', 'ことになっています', 'ようになりました', 'ためです'], correct: 0, why: '**{私|わたし}は** + {必|かなら}ず → luật của chính mình → **ことにしています**. So với câu trên: chủ thể là "trường" hay "tôi". 〔Haha ni meeru suru koto ni shite imasu.〕' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Khó: bẫy kinh điển + 文の組み立て' },
    {
      t: 'mcq',
      id: 'b21-lt4-bay',
      title: 'Bẫy đề N4 (8 câu)',
      items: [
        { q: 'Câu nào ĐÚNG?', options: ['{忘|わす}れないために、メモします。', '{忘|わす}れないように、メモします。', '{忘|わす}れないことに、メモします。', '{忘|わす}れなくなって、メモします。'], correct: 1, why: 'Mục đích phủ định → **～ないように**. ~~～ないために~~ là nguyên nhân (Bài 27), không phải mục đích.' },
        { q: 'Câu nào ĐÚNG?', options: ['{日本語|にほんご}が{話|はな}せるになりました。', '{日本語|にほんご}が{上手|じょうず}ようになりました。', '{日本語|にほんご}が{話|はな}せるようになりました。', '{日本語|にほんご}が{話|はな}すようになれました。'], correct: 2, why: 'Động từ + **ように** + なる; tính từ thì không có ように ({上手|じょうず}になりました). ~~{話|はな}せるになりました~~, ~~{上手|じょうず}ようになりました~~ đều sai.' },
        { q: 'Câu nào ĐÚNG?', options: ['{来年|らいねん}{留学|りゅうがく}することをしました。', '{来年|らいねん}{留学|りゅうがく}したことにしました。', '{来年|らいねん}{留学|りゅうがく}することにしました。', '{来年|らいねん}{留学|りゅうがく}するのことにしました。'], correct: 2, why: '**V{辞書形|じしょけい} + こと + に + しました**. Trợ từ là に (không を); trước こと là thể từ điển (không thể た); không có の.' },
        { q: '{先生|せんせい}が{学生|がくせい}に：「{毎日|まいにち}{復習|ふくしゅう}する（　）。」', options: ['ようになってください', 'ようにしてください', 'ことになってください', 'ことにしてください'], correct: 1, why: 'Lời nhắc giữ nếp → **ようにしてください**. ~~ようになってください~~ / ~~ことになってください~~ không dùng.' },
        { q: '「{来年|らいねん}{結婚|けっこん}することになりました。」— câu nào ĐÚNG về câu này?', options: ['Người nói không muốn kết hôn.', 'Chỉ có thể là người khác ép người nói kết hôn.', 'Có thể là cách báo tin vui của chính mình một cách khiêm tốn.', 'Người nói đã kết hôn từ năm ngoái.'], correct: 2, why: '**～ことになりました** còn dùng để báo **tin của chính mình** một cách khiêm tốn (không nhấn "tôi quyết") — rất hay gặp ở chỗ làm.' },
        { q: 'A「{卒業|そつぎょう}したらどうするの？」 B「まだ{決|き}めていないけど、{国|くに}へ{帰|かえ}る（　）。」', options: ['ことにした', 'つもりだよ', 'ことになった', 'ようになった'], correct: 1, why: '**まだ{決|き}めていない** (chưa chốt) → chỉ là ý định: **つもり** (Bài 16). ことにした = đã chốt — mâu thuẫn.' },
        { q: '「{毎朝|まいあさ}{六時|ろくじ}に{起|お}きることになっています。」— ai đặt ra quy tắc này?', options: ['người nói tự đặt', 'nơi người nói ở / làm việc (ký túc xá, công ty…)', 'không ai cả — tự nhiên thành thói quen', 'bác sĩ vừa khuyên hôm qua'], correct: 1, why: '**ことになっている** = quy định **của tổ chức** / lịch chung. Luật tự đặt → ことにしている; tự thành thói quen → ようになった.' },
        { q: '{子|こ}どもが{寝|ね}られる（　）、テレビの{音|おと}を{小|ちい}さくしました。', options: ['ために', 'ように', 'ことに', 'から'], correct: 1, why: '{寝|ね}られる (thể khả năng) + khác chủ ngữ (con ngủ — tôi vặn nhỏ) → **ように**. 〔Kodomo ga nerareru you ni…〕' },
      ],
    },
    {
      t: 'build',
      id: 'b21-lt4-ghep',
      title: '文の組み立て — ghép câu dài (6 câu)',
      items: [
        { vi: 'Để đỗ N3, tôi đã quyết định sáng nào cũng học thuộc 30 từ.', chips: ['N3に', '{合格|ごうかく}できる', 'ように', '{毎朝|まいあさ}', '{単語|たんご}を30', '{覚|おぼ}える', 'ことにしました', 'ことになりました'], answer: ['N3に', '{合格|ごうかく}できる', 'ように', '{毎朝|まいあさ}', '{単語|たんご}を30', '{覚|おぼ}える', 'ことにしました'], ro: 'Enu-san ni goukaku dekiru you ni maiasa tango o sanjuu oboeru koto ni shimashita.' },
        { vi: 'Từ khi cố ngủ sớm, tôi đã dậy sớm được.', chips: ['{早|はや}く', '{寝|ね}る', 'ようにしてから', '{早|はや}く', '{起|お}きられる', 'ように', 'なりました', 'しました'], answer: ['{早|はや}く', '{寝|ね}る', 'ようにしてから', '{早|はや}く', '{起|お}きられる', 'ように', 'なりました'], ro: 'Hayaku neru you ni shite kara hayaku okirareru you ni narimashita.' },
        { vi: 'Vì sức khoẻ, tôi cố hết mức không đi thang máy.', chips: ['{健康|けんこう}の', 'ために', 'なるべく', 'エレベーターを', '{使|つか}わない', 'ように', 'しています', 'なっています'], answer: ['{健康|けんこう}の', 'ために', 'なるべく', 'エレベーターを', '{使|つか}わない', 'ように', 'しています'], ro: 'Kenkou no tame ni narubeku erebeetaa o tsukawanai you ni shite imasu.' },
        { vi: 'Bố tôi được điều chuyển công tác nên cả nhà quyết định chuyển lên Tokyo.', chips: ['{父|ちち}が', '{転勤|てんきん}する', 'ことになったので', '{家族|かぞく}で', '{東京|とうきょう}へ', '{引|ひ}っ{越|こ}す', 'ことにしました', 'ことにしたので'], answer: ['{父|ちち}が', '{転勤|てんきん}する', 'ことになったので', '{家族|かぞく}で', '{東京|とうきょう}へ', '{引|ひ}っ{越|こ}す', 'ことにしました'], ro: 'Chichi ga tenkin suru koto ni natta node kazoku de Toukyou e hikkosu koto ni shimashita.' },
        { vi: 'Theo nội quy ký túc xá, khách phải ra về trước 9 giờ.', chips: ['{寮|りょう}の', '{規則|きそく}では', 'お{客|きゃく}さんは', '9{時|じ}までに', '{帰|かえ}る', 'ことになっています', 'ことにしています'], answer: ['{寮|りょう}の', '{規則|きそく}では', 'お{客|きゃく}さんは', '9{時|じ}までに', '{帰|かえ}る', 'ことになっています'], ro: 'Ryou no kisoku de wa okyaku-san wa kuji made ni kaeru koto ni natte imasu.' },
        { vi: 'Muốn du học thì cần để dành ít nhất một triệu yên.', chips: ['{留学|りゅうがく}する', 'ためには', '{百万円|ひゃくまんえん}{以上|いじょう}', '{貯金|ちょきん}することが', '{必要|ひつよう}です', 'ようには'], answer: ['{留学|りゅうがく}する', 'ためには', '{百万円|ひゃくまんえん}{以上|いじょう}', '{貯金|ちょきん}することが', '{必要|ひつよう}です'], ro: 'Ryuugaku suru tame ni wa hyakuman\'en ijou chokin suru koto ga hitsuyou desu.' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b21-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp kiểu N4 — 文字・語彙 · 文法 · 読解 (17 câu, có thang điểm)',
  goal: 'Làm một đề mini đúng ba phần của JLPT N4 (chữ – từ, ngữ pháp, đọc) trên nội dung Bài 21, tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào — bước khởi động trước Bài 22 và kỳ thi thử N4 ở Bài 25.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm & thang điểm',
      items: [
        'Bấm giờ **25 phút**, không mở bài. ① 文字・語彙 6 câu · ② 文法 8 câu (6 chọn + 2 sắp xếp ★) · ③ 読解 3 câu.',
        'Mỗi câu 1 điểm, tổng **17**. **15–17**: rất tốt, sang Bài 22 · **12–14**: đạt, ôn lại mục mình sai · **≤ 11**: học lại Ngữ pháp ①–⑥ (ba bảng phân biệt) và làm Luyện thêm 3–4.',
        'Sai ① → Từ vựng + Chữ Hán · sai ② câu ために／ように → Ngữ pháp ① ② · sai câu ようになる／ようにする → ③ ④ · sai câu ことにする／ことになる → ⑤ ⑥ · sai ③ → Đọc hiểu.',
      ],
    },
    { t: 'h', text: '① 文字・語彙' },
    {
      t: 'mcq',
      id: 'b21-lt5-tu',
      title: '文字・語彙 (6 câu)',
      items: [
        { q: '**目標**を{立|た}てましょう。— {読|よ}み{方|かた}', options: ['もくひょう', 'もくひょ', 'めひょう', 'もくびょう'], correct: 0, why: '**{目標|もくひょう}** (mokuhyou).' },
        { q: '**健康**に{気|き}をつけています。— {読|よ}み{方|かた}', options: ['けんごう', 'けんこう', 'けいこう', 'けんこ'], correct: 1, why: '**{健康|けんこう}** (kenkou).' },
        { q: '**ちょきん**しています。— {漢字|かんじ}', options: ['財金', '貯金', '貯全', '宁金'], correct: 1, why: '**貯金** — 貝 + 宁.' },
        { q: '{毎日|まいにち}{歩|ある}いたら、{体重|たいじゅう}が（　）。', options: ['{減|へ}らしました', '{減|へ}りました', '{下|さ}げました', '{諦|あきら}めました'], correct: 1, why: '{体重|たいじゅう}が (tự) → **{減|へ}りました**.' },
        { q: '「なるべく{野菜|やさい}を{食|た}べています。」に{意味|いみ}がいちばん{近|ちか}いのは？', options: ['{必|かなら}ず{野菜|やさい}を{食|た}べています。', 'できるだけ{野菜|やさい}を{食|た}べています。', '{少|すこ}しだけ{野菜|やさい}を{食|た}べています。', '{野菜|やさい}を{我慢|がまん}しています。'], correct: 1, why: '**なるべく ≈ できるだけ**.' },
        { q: '「{続|つづ}く」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{毎日|まいにち}{勉強|べんきょう}を{続|つづ}きます。', '{雨|あめ}の{日|ひ}が{一週間|いっしゅうかん}{続|つづ}いています。', '{目標|もくひょう}を{続|つづ}いてください。', '{私|わたし}は{日記|にっき}を{続|つづ}きました。'], correct: 1, why: '{続|つづ}く là **tự động từ: N が{続|つづ}く**. Có を → phải là {続|つづ}ける.' },
      ],
    },
    { t: 'h', text: '② 文法' },
    {
      t: 'mcq',
      id: 'b21-lt5-np',
      title: '文法 — 文法形式の判断 (6 câu) + 文の組み立て ★ (2 câu)',
      items: [
        { q: '{日本|にほん}の{大学|だいがく}に{入|はい}る（　）、{毎日|まいにち}{勉強|べんきょう}しています。', options: ['ために', 'ように', 'ことに', 'のに'], correct: 0, why: 'V chủ ý ({入|はい}る), cùng một người → **ために**.' },
        { q: '{後|うし}ろの{人|ひと}にもよく{見|み}える（　）、{大|おお}きい{字|じ}で{書|か}いてください。', options: ['ために', 'ように', 'ことに', 'ようで'], correct: 1, why: '{見|み}える — không chủ ý → **ように**.' },
        { q: '{毎日|まいにち}{練習|れんしゅう}したので、{速|はや}く{走|はし}れる（　）。', options: ['ようにしました', 'ようになりました', 'ことにしました', 'ためでした'], correct: 1, why: 'Kết quả (năng lực) → **ようになりました**.' },
        { q: 'これからは、{約束|やくそく}の{時間|じかん}に{遅|おく}れない（　）。', options: ['ようになります', 'ようにします', 'ことになっています', 'ために'], correct: 1, why: 'Lời hứa → **ようにします**.' },
        { q: '{会社|かいしゃ}の{命令|めいれい}で、{来月|らいげつ}アメリカへ{出張|しゅっちょう}する（　）。', options: ['ことにしました', 'ことになりました', 'ようにしました', 'ようになりました'], correct: 1, why: 'Lệnh công ty → **ことになりました**.' },
        { q: '{私|わたし}は{夜|よる}{十時|じゅうじ}を{過|す}ぎたら、{何|なに}も{食|た}べない（　）。', options: ['ことにしています', 'ことになっています', 'ようになりました', 'ためです'], correct: 0, why: 'Luật của chính "{私|わたし}" → **ことにしています**.' },
        { q: '★ {子|こ}どもにも ＿＿ ＿＿ ★ ＿＿ しました。（ように／わかる／{説明|せつめい}／やさしい{言葉|ことば}で）', options: ['ように', 'わかる', '{説明|せつめい}', 'やさしい{言葉|ことば}で'], correct: 3, why: 'Câu đúng: {子|こ}どもにも **わかる ように やさしい{言葉|ことば}で {説明|せつめい}** しました. Ô ★ (thứ 3) = **やさしい{言葉|ことば}で**.' },
        { q: '★ {来年|らいねん}の ＿＿ ＿＿ ★ ＿＿ なりました。（ことに／{四月|しがつ}から／{働|はたら}く／{東京|とうきょう}で）', options: ['ことに', '{四月|しがつ}から', '{働|はたら}く', '{東京|とうきょう}で'], correct: 2, why: 'Câu đúng: {来年|らいねん}の **{四月|しがつ}から {東京|とうきょう}で {働|はたら}く ことに** なりました. Ô ★ (thứ 3) = **{働|はたら}く**.' },
      ],
    },
    { t: 'h', text: '③ 読解' },
    {
      t: 'passage',
      title: 'パクさんのメモ（{寮|りょう}の{部屋|へや}の{壁|かべ}に）',
      intro: 'パク dán mẩu ghi chú này lên tường phòng ký túc xá sau buổi sáng gặp マルコ ở công viên. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: '{私|わたし}の{目標|もくひょう}：{早寝早起|はやねはやお}き！' },
        { text: '{最近|さいきん}、{夜|よ}ふかしばかりで、{授業|じゅぎょう}に{二回|にかい}も{遅刻|ちこく}してしまった。だから、{今日|きょう}から{三|みっ}つのことを{決|き}めた。① {寝|ね}る{前|まえ}の{一時間|いちじかん}は、スマホを{見|み}ないようにする。② {夜|よる}11{時|じ}までに{寝|ね}ることにする。③ {朝|あさ}{起|お}きられるように、{目覚|めざ}まし{時計|どけい}をベッドから{遠|とお}いところに{置|お}く。' },
        { text: '{一か月|いっかげつ}{続|つづ}けられたら、マルコさんと{一緒|いっしょ}に{朝|あさ}{走|はし}ることになっている。{絶対|ぜったい}に{諦|あきら}めない！' },
      ],
    },
    {
      t: 'mcq',
      id: 'b21-lt5-doc',
      title: '読解 (3 câu)',
      items: [
        { q: 'パクさんはどうしてこのメモを{書|か}きましたか。', options: ['マルコさんに{言|い}われたから', '{夜|よ}ふかしで{授業|じゅぎょう}に{遅刻|ちこく}したから', '{目覚|めざ}まし{時計|どけい}が{壊|こわ}れたから', '{試験|しけん}があるから'], correct: 1, why: '**{夜|よ}ふかしばかりで、{授業|じゅぎょう}に{二回|にかい}も{遅刻|ちこく}してしまった。だから…** — lý do nằm ngay trước だから.' },
        { q: 'パクさんが{目覚|めざ}まし{時計|どけい}を{遠|とお}いところに{置|お}くのは、どうしてですか。', options: ['{音|おと}がうるさいから', '{朝|あさ}{起|お}きられるように', 'スマホを{見|み}ないように', '{部屋|へや}が{狭|せま}いから'], correct: 1, why: '**{朝|あさ}{起|お}きられるように、{目覚|めざ}まし{時計|どけい}を…{遠|とお}いところに{置|お}く** — ように + thể khả năng = mục đích (phải ra khỏi giường để tắt chuông).' },
        { q: 'メモの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['パクさんはもう{毎朝|まいあさ}マルコさんと{走|はし}っている。', '{一か月|いっかげつ}{続|つづ}けられたら、マルコさんと{走|はし}る{約束|やくそく}がある。', 'パクさんは{寝|ね}る{前|まえ}にスマホを{一時間|いちじかん}{見|み}ることにした。', 'パクさんは{早寝早起|はやねはやお}きを{諦|あきら}めた。'], correct: 1, why: '**{一か月|いっかげつ}{続|つづ}けられたら、マルコさんと{一緒|いっしょ}に{朝|あさ}{走|はし}ることになっている** — ことになっている = đã hẹn sẵn (lịch chung). Chưa chạy cùng (bẫy ①); スマホを{見|み}ない (bẫy ③).' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{寝|ね}る{前|まえ}の{一時間|いちじかん}は、スマホを{見|み}ないようにする。', 'Neru mae no ichijikan wa, sumaho o minai you ni suru.', 'Một tiếng trước khi ngủ sẽ cố không xem điện thoại.'),
        E('{夜|よる}11{時|じ}までに{寝|ね}ることにする。', 'Yoru juuichiji made ni neru koto ni suru.', 'Quyết định đi ngủ trước 11 giờ đêm.'),
        E('{朝|あさ}{起|お}きられるように、{目覚|めざ}まし{時計|どけい}を{遠|とお}いところに{置|お}く。', 'Asa okirareru you ni, mezamashi dokei o tooi tokoro ni oku.', 'Để sáng dậy được, đặt đồng hồ báo thức ở chỗ xa.'),
        E('マルコさんと{一緒|いっしょ}に{朝|あさ}{走|はし}ることになっている。', 'Maruko-san to issho ni asa hashiru koto ni natte iru.', 'Đã hẹn (theo kế hoạch) sẽ cùng Marco chạy buổi sáng.'),
      ],
    },
  ],
};

export const BAI_21: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
