/**
 * Bài 3 — スケジュール (Lịch trình) · できる日本語 初級, môn JPD113/JPD123.
 *
 * Soạn theo ../SOAN-BAI.md: đủ ポイント 16–23, đủ 80 từ trong danh sách từ mới
 * của cô (bài 3), romaji ở mọi câu, furigana dạng {漢字|かな}. Hội thoại, câu ví
 * dụ, bài đọc và kịch bản nghe đều VIẾT MỚI theo đúng tình huống của sách.
 *
 * Vai trong hội thoại (giọng tự chọn theo vai): a / c = giọng nữ,
 * b / examiner = giọng nam. アンナ (a), パク (c) — nữ; ダニエル, ナタポン (b),
 * {本田|ほんだ}{先生|せんせい} (examiner) — nam.
 */
import type { Lesson } from '@/components/sach-hoc/types';

/**
 * Đáp án gõ tay: chấp nhận có/không dấu 、 và có/không dấu 。 ở cuối
 * (bộ so đáp án chỉ bỏ . ? ! cuối câu, không bỏ dấu câu tiếng Nhật).
 */
const A = (...xs: string[]): string[] => {
  const out = new Set<string>();
  for (const x of xs) {
    for (const y of [x, x.replace(/、/g, '')]) {
      for (const z of [y, y.replace(/\s+/g, '')]) {
        const base = z.replace(/。$/, '');
        out.add(base);
        out.add(`${base}。`);
      }
    }
  }
  return [...out];
};

/* ══════════════════════════ 1. HỘI THOẠI ══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b3-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — スケジュール (Lịch trình)',
  goal: 'Hỏi được giờ mở cửa và ngày nghỉ, hỏi–nói về lịch trình cả năm của trường, và kể được một ngày, một tuần của mình.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 3 bạn làm được (できる)',
      items: [
        '**① {何時|なんじ}までですか** — gọi điện / hỏi trực tiếp một nơi công cộng (thư viện, ngân hàng, bưu điện, bệnh viện, nhà thi đấu): **mở từ mấy giờ đến mấy giờ, nghỉ ngày nào**.',
        '**② {私|わたし}のスケジュール** — hỏi lịch cả năm của trường (bao giờ đi dã ngoại, bao giờ nghỉ hè…) và **nói kế hoạch** của mình: đi đâu, làm gì.',
        '**③ どんな{毎日|まいにち}？** — kể và hỏi về **sinh hoạt hằng ngày**: mấy giờ dậy, ăn gì, học từ mấy giờ đến mấy giờ, chiều nay đi đâu.',
        'Đây cũng chính là nhóm câu hỏi **Lesson 3** trong đề thi nói JPD113 (xem bài Luyện nói).',
      ],
    },

    /* ── ① 何時までですか ── */
    { t: 'h', text: '① {何時|なんじ}までですか — Mở đến mấy giờ?' },
    {
      t: 'p',
      text: 'Tình huống: bạn đang ở ký túc xá, muốn đi tập thể thao nên **gọi điện cho nhà thi đấu** để hỏi giờ mở cửa và ngày nghỉ. Trước đó, bạn hỏi giờ một bạn cùng lớp.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi giờ bạn cùng lớp',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'すみません。{今|いま}、{何時|なんじ}ですか。', ro: 'Sumimasen. Ima, nanji desu ka.', vi: 'Xin lỗi, bây giờ là mấy giờ ạ?' },
        { who: 'アンナ', role: 'a', text: '{10時|じゅうじ}{15分|じゅうごふん}です。', ro: 'Jūji jūgofun desu.', vi: '10 giờ 15 phút.' },
        { who: 'ダニエル', role: 'b', text: 'ありがとうございます。', ro: 'Arigatō gozaimasu.', vi: 'Cảm ơn bạn.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Gọi điện cho nhà thi đấu',
      lines: [
        { who: '{受付|うけつけ}', role: 'b', text: 'はい、ひまわり{体育館|たいいくかん}です。', ro: 'Hai, Himawari taiikukan desu.', vi: 'Vâng, nhà thi đấu Himawari xin nghe.' },
        { who: 'パク', role: 'c', text: 'あのう、すみません。そちらは{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Anō, sumimasen. Sochira wa nanji kara nanji made desu ka.', vi: 'Dạ, xin lỗi. Bên mình mở cửa từ mấy giờ đến mấy giờ ạ?' },
        { who: '{受付|うけつけ}', role: 'b', text: '{午前|ごぜん}{7時|しちじ}から{午後|ごご}{10時|じゅうじ}までです。', ro: 'Gozen shichiji kara gogo jūji made desu.', vi: 'Từ 7 giờ sáng đến 10 giờ tối.' },
        { who: 'パク', role: 'c', text: '{午後|ごご}{10時|じゅうじ}までですか。{休|やす}みはいつですか。', ro: 'Gogo jūji made desu ka. Yasumi wa itsu desu ka.', vi: 'Đến 10 giờ tối ạ. Ngày nghỉ là khi nào ạ?' },
        { who: '{受付|うけつけ}', role: 'b', text: '{火曜日|かようび}です。', ro: 'Kayōbi desu.', vi: 'Thứ Ba.' },
        { who: 'パク', role: 'c', text: '{火曜日|かようび}ですか。ありがとうございます。', ro: 'Kayōbi desu ka. Arigatō gozaimasu.', vi: 'Thứ Ba ạ. Cảm ơn anh.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ở quầy ngân hàng',
      lines: [
        { who: 'アンナ', role: 'a', text: 'すみません。{銀行|ぎんこう}は{何曜日|なんようび}から{何曜日|なんようび}までですか。', ro: 'Sumimasen. Ginkō wa nan\'yōbi kara nan\'yōbi made desu ka.', vi: 'Xin lỗi, ngân hàng làm việc từ thứ mấy đến thứ mấy ạ?' },
        { who: '{銀行|ぎんこう}の{人|ひと}', role: 'b', text: '{月曜日|げつようび}から{金曜日|きんようび}までです。{土曜日|どようび}と{日曜日|にちようび}は{休|やす}みです。', ro: 'Getsuyōbi kara kin\'yōbi made desu. Doyōbi to nichiyōbi wa yasumi desu.', vi: 'Từ thứ Hai đến thứ Sáu. Thứ Bảy và Chủ Nhật nghỉ.' },
        { who: 'アンナ', role: 'a', text: '{時間|じかん}は{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Jikan wa nanji kara nanji made desu ka.', vi: 'Giờ làm việc từ mấy giờ đến mấy giờ ạ?' },
        { who: '{銀行|ぎんこう}の{人|ひと}', role: 'b', text: '{9時|くじ}から{3時|さんじ}までです。', ro: 'Kuji kara sanji made desu.', vi: 'Từ 9 giờ đến 3 giờ.' },
        { who: 'アンナ', role: 'a', text: 'そうですか。ありがとうございます。', ro: 'Sō desu ka. Arigatō gozaimasu.', vi: 'Vậy ạ. Cảm ơn anh.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{今|いま}、{何時|なんじ}ですか。', ro: 'Ima, nanji desu ka.', vi: 'Bây giờ là mấy giờ?' },
        { en: 'そちらは{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Sochira wa nanji kara nanji made desu ka.', vi: 'Bên anh/chị (nơi đó) mở từ mấy giờ đến mấy giờ? — そちら = "phía bên đó", câu lịch sự khi gọi điện.' },
        { en: '{休|やす}みはいつですか。／{何曜日|なんようび}ですか。', ro: 'Yasumi wa itsu desu ka. / Nan\'yōbi desu ka.', vi: 'Ngày nghỉ là khi nào? / Là thứ mấy?' },
        { en: '{火曜日|かようび}ですか。ありがとうございます。', ro: 'Kayōbi desu ka. Arigatō gozaimasu.', vi: 'Thứ Ba à. Cảm ơn. — Nhắc lại thông tin vừa nghe để xác nhận, rất tự nhiên khi gọi điện.' },
      ],
    },

    /* ── ② 私のスケジュール ── */
    { t: 'h', text: '② {私|わたし}のスケジュール — Lịch trình của tôi' },
    {
      t: 'p',
      text: 'Tình huống: đầu năm học, thầy {本田|ほんだ} giới thiệu **lịch cả năm của trường** trên bảng. Các bạn hỏi thêm, rồi nói chuyện với nhau về kế hoạch nghỉ hè.',
    },
    {
      t: 'table',
      caption: 'Bảng lịch trên lớp (ví dụ mới)',
      head: ['Ngày', 'Sự kiện', 'Làm gì'],
      rows: [
        ['{4月|しがつ}{3日|みっか}', 'お{花見|はなみ} (ngắm hoa)', '{公園|こうえん}で{桜|さくら}を{見|み}ます。'],
        ['{5月|ごがつ}{20日|はつか}', 'バス{旅行|りょこう} (đi chơi bằng xe buýt)', '{富士山|ふじさん}へ{行|い}きます。'],
        ['{6月|ろくがつ}{9日|ここのか}', '{留学生|りゅうがくせい}パーティー', '{学校|がっこう}でおすしを{食|た}べます。'],
        ['{7月|しちがつ}{25日|にじゅうごにち}〜{8月|はちがつ}{31日|さんじゅういちにち}', '{夏休|なつやす}み (nghỉ hè)', '—'],
        ['{12月|じゅうにがつ}{14日|じゅうよっか}・{15日|じゅうごにち}', 'テスト', '—'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Trên lớp — thầy giới thiệu lịch',
      lines: [
        { who: '{本田|ほんだ}{先生|せんせい}', role: 'examiner', text: 'これは{学校|がっこう}の{1年|いちねん}のスケジュールです。{5月|ごがつ}{20日|はつか}はバス{旅行|りょこう}です。', ro: 'Kore wa gakkō no ichinen no sukejūru desu. Gogatsu hatsuka wa basu ryokō desu.', vi: 'Đây là lịch cả năm của trường. Ngày 20 tháng 5 là chuyến đi chơi bằng xe buýt.' },
        { who: 'アンナ', role: 'a', text: 'えっ、バス{旅行|りょこう}？どこへ{行|い}きますか。', ro: 'E\', basu ryokō? Doko e ikimasu ka.', vi: 'Ơ, đi xe buýt ạ? Đi đâu ạ?' },
        { who: '{本田|ほんだ}{先生|せんせい}', role: 'examiner', text: '{富士山|ふじさん}へ{行|い}きます。{公園|こうえん}でバーベキューをします。', ro: 'Fujisan e ikimasu. Kōen de bābekyū o shimasu.', vi: 'Đi núi Phú Sĩ. Sẽ nướng BBQ ở công viên.' },
        { who: 'アンナ', role: 'a', text: 'へえ。{夏休|なつやす}みはいつからいつまでですか。', ro: 'Hē. Natsuyasumi wa itsu kara itsu made desu ka.', vi: 'Ồ. Nghỉ hè từ bao giờ đến bao giờ ạ?' },
        { who: '{本田|ほんだ}{先生|せんせい}', role: 'examiner', text: '{7月|しちがつ}{25日|にじゅうごにち}から{8月|はちがつ}{31日|さんじゅういちにち}までです。', ro: 'Shichigatsu nijūgonichi kara hachigatsu sanjūichinichi made desu.', vi: 'Từ 25 tháng 7 đến 31 tháng 8.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Giờ ra chơi — nghỉ hè làm gì?',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'アンナさん、{夏休|なつやす}み、{国|くに}へ{帰|かえ}りますか。', ro: 'Anna-san, natsuyasumi, kuni e kaerimasu ka.', vi: 'Anna ơi, nghỉ hè bạn có về nước không?' },
        { who: 'アンナ', role: 'a', text: 'いいえ、{帰|かえ}りません。{北海道|ほっかいどう}へ{行|い}きます。{北海道|ほっかいどう}でホームステイをします。', ro: 'Iie, kaerimasen. Hokkaidō e ikimasu. Hokkaidō de hōmusutei o shimasu.', vi: 'Không, mình không về. Mình đi Hokkaido. Mình ở homestay ở Hokkaido.' },
        { who: 'ダニエル', role: 'b', text: 'いいですね。', ro: 'Ii desu ne.', vi: 'Hay quá nhỉ.' },
        { who: 'アンナ', role: 'a', text: 'ダニエルさんは？', ro: 'Danieru-san wa?', vi: 'Còn Daniel?' },
        { who: 'ダニエル', role: 'b', text: '{私|わたし}は{国|くに}へ{帰|かえ}ります。{国|くに}でアルバイトをします。', ro: 'Watashi wa kuni e kaerimasu. Kuni de arubaito o shimasu.', vi: 'Mình về nước. Mình làm thêm ở bên đó.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Đi ngắm hoa thì làm gì?',
      lines: [
        { who: 'パク', role: 'c', text: '{4月|しがつ}{3日|みっか}はお{花見|はなみ}です。', ro: 'Shigatsu mikka wa ohanami desu.', vi: 'Ngày 3 tháng 4 là buổi ngắm hoa.' },
        { who: 'ナタポン', role: 'b', text: 'えっ、お{花見|はなみ}？{何|なに}をしますか。', ro: 'E\', ohanami? Nani o shimasu ka.', vi: 'Hả, ngắm hoa? Làm gì vậy?' },
        { who: 'パク', role: 'c', text: '{公園|こうえん}で{桜|さくら}を{見|み}ます。お{弁当|べんとう}を{食|た}べます。', ro: 'Kōen de sakura o mimasu. Obentō o tabemasu.', vi: 'Ngắm hoa anh đào ở công viên. Ăn cơm hộp.' },
        { who: 'ナタポン', role: 'b', text: 'お{酒|さけ}も{飲|の}みますか。', ro: 'Osake mo nomimasu ka.', vi: 'Có uống rượu nữa không?' },
        { who: 'パク', role: 'c', text: 'はい、{飲|の}みます。ジュースも{飲|の}みます。', ro: 'Hai, nomimasu. Jūsu mo nomimasu.', vi: 'Có, có uống. Cũng uống cả nước ép.' },
        { who: 'ナタポン', role: 'b', text: 'へえ、いいですね。', ro: 'Hē, ii desu ne.', vi: 'Ồ, hay nhỉ.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{5月|ごがつ}{20日|はつか}はバス{旅行|りょこう}です。', ro: 'Gogatsu hatsuka wa basu ryokō desu.', vi: 'Ngày 20/5 là chuyến đi xe buýt. — [ngày] は [sự kiện] です.' },
        { en: 'どこへ{行|い}きますか。／{何|なに}をしますか。', ro: 'Doko e ikimasu ka. / Nani o shimasu ka.', vi: 'Đi đâu? / Làm gì?' },
        { en: '{冬休|ふゆやす}み、{国|くに}へ{帰|かえ}りますか。——はい、{帰|かえ}ります。／いいえ、{帰|かえ}りません。', ro: 'Fuyuyasumi, kuni e kaerimasu ka. — Hai, kaerimasu. / Iie, kaerimasen.', vi: 'Nghỉ đông bạn có về nước không? — Có, tôi về. / Không, tôi không về.' },
        { en: 'ゴールデンウイーク、{何|なに}をしますか。——{海|うみ}へ{行|い}きます。', ro: 'Gōruden uīku, nani o shimasu ka. — Umi e ikimasu.', vi: 'Tuần lễ Vàng bạn làm gì? — Tôi đi biển.' },
        { en: '{夏休|なつやす}みはいつからいつまでですか。', ro: 'Natsuyasumi wa itsu kara itsu made desu ka.', vi: 'Nghỉ hè từ bao giờ đến bao giờ?' },
        { en: 'いいですね。／えっ。／へえ。', ro: 'Ii desu ne. / E\'. / Hē.', vi: 'Hay nhỉ (khen, tán thành) / Ơ, hả (bất ngờ) / Ồ, thế à (ngạc nhiên nhẹ, thích thú).' },
      ],
    },

    /* ── ③ どんな毎日？ ── */
    { t: 'h', text: '③ どんな{毎日|まいにち}？ — Mỗi ngày của bạn thế nào?' },
    {
      t: 'p',
      text: 'Tình huống: giờ nghỉ giữa tiết, các bạn trong lớp hỏi nhau ăn sáng gì, mấy giờ dậy, học từ mấy giờ; tan học thì hỏi nhau chiều nay đi đâu.',
    },
    {
      t: 'dialogue',
      title: 'Bữa sáng',
      lines: [
        { who: 'アンナ', role: 'a', text: 'ナタポンさん、{毎朝|まいあさ}、{朝|あさ}ご{飯|はん}を{食|た}べますか。', ro: 'Natapon-san, maiasa, asagohan o tabemasu ka.', vi: 'Nattapon ơi, sáng nào bạn cũng ăn sáng à?' },
        { who: 'ナタポン', role: 'b', text: 'はい、{食|た}べます。', ro: 'Hai, tabemasu.', vi: 'Ừ, mình có ăn.' },
        { who: 'アンナ', role: 'a', text: '{何|なに}を{食|た}べますか。', ro: 'Nani o tabemasu ka.', vi: 'Bạn ăn gì?' },
        { who: 'ナタポン', role: 'b', text: 'パンや{果物|くだもの}などを{食|た}べます。', ro: 'Pan ya kudamono nado o tabemasu.', vi: 'Mình ăn bánh mì, hoa quả, v.v.' },
        { who: 'アンナ', role: 'a', text: '{何|なに}を{飲|の}みますか。', ro: 'Nani o nomimasu ka.', vi: 'Bạn uống gì?' },
        { who: 'ナタポン', role: 'b', text: '{牛乳|ぎゅうにゅう}を{飲|の}みます。アンナさんは？', ro: 'Gyūnyū o nomimasu. Anna-san wa?', vi: 'Mình uống sữa. Còn Anna?' },
        { who: 'アンナ', role: 'a', text: '{私|わたし}は{朝|あさ}、{何|なに}も{食|た}べません。コーヒーを{飲|の}みます。', ro: 'Watashi wa asa, nanimo tabemasen. Kōhī o nomimasu.', vi: 'Buổi sáng mình không ăn gì cả. Mình uống cà phê.' },
        { who: 'ナタポン', role: 'b', text: 'えっ、そうですか。', ro: 'E\', sō desu ka.', vi: 'Ơ, thế à.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Mấy giờ dậy, mấy giờ ngủ?',
      lines: [
        { who: 'パク', role: 'c', text: 'ダニエルさんは{毎朝|まいあさ}、{何時|なんじ}に{起|お}きますか。', ro: 'Danieru-san wa maiasa, nanji ni okimasu ka.', vi: 'Daniel sáng nào cũng dậy lúc mấy giờ?' },
        { who: 'ダニエル', role: 'b', text: '{6時半|ろくじはん}に{起|お}きます。', ro: 'Rokuji han ni okimasu.', vi: 'Mình dậy lúc 6 rưỡi.' },
        { who: 'パク', role: 'c', text: 'へえ。{毎晩|まいばん}、{何時|なんじ}に{寝|ね}ますか。', ro: 'Hē. Maiban, nanji ni nemasu ka.', vi: 'Ồ. Tối nào cũng ngủ lúc mấy giờ?' },
        { who: 'ダニエル', role: 'b', text: '{11時|じゅういちじ}に{寝|ね}ます。', ro: 'Jūichiji ni nemasu.', vi: 'Mình ngủ lúc 11 giờ.' },
        { who: 'パク', role: 'c', text: '{毎日|まいにち}、{何時|なんじ}から{何時|なんじ}まで{勉強|べんきょう}しますか。', ro: 'Mainichi, nanji kara nanji made benkyō shimasu ka.', vi: 'Hằng ngày bạn học từ mấy giờ đến mấy giờ?' },
        { who: 'ダニエル', role: 'b', text: '{夜|よる}{8時|はちじ}から{10時|じゅうじ}まで{勉強|べんきょう}します。', ro: 'Yoru hachiji kara jūji made benkyō shimasu.', vi: 'Mình học từ 8 giờ đến 10 giờ tối.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Tan học — chiều nay đi đâu?',
      lines: [
        { who: 'アンナ', role: 'a', text: 'ナタポンさんは{午後|ごご}、どこへ{行|い}きますか。', ro: 'Natapon-san wa gogo, doko e ikimasu ka.', vi: 'Nattapon chiều nay đi đâu?' },
        { who: 'ナタポン', role: 'b', text: 'どこへも{行|い}きません。うちでインターネットをします。アンナさんは？', ro: 'Doko e mo ikimasen. Uchi de intānetto o shimasu. Anna-san wa?', vi: 'Mình không đi đâu cả. Mình lên mạng ở nhà. Còn Anna?' },
        { who: 'アンナ', role: 'a', text: '{私|わたし}はコンビニへ{行|い}きます。コンビニでアルバイトをします。', ro: 'Watashi wa konbini e ikimasu. Konbini de arubaito o shimasu.', vi: 'Mình đi cửa hàng tiện lợi. Mình làm thêm ở đó.' },
        { who: 'ナタポン', role: 'b', text: '{何時|なんじ}から{何時|なんじ}まで{働|はたら}きますか。', ro: 'Nanji kara nanji made hatarakimasu ka.', vi: 'Bạn làm từ mấy giờ đến mấy giờ?' },
        { who: 'アンナ', role: 'a', text: '{4時|よじ}から{9時|くじ}まで{働|はたら}きます。', ro: 'Yoji kara kuji made hatarakimasu.', vi: 'Mình làm từ 4 giờ đến 9 giờ.' },
        { who: 'ナタポン', role: 'b', text: 'そうですか。', ro: 'Sō desu ka.', vi: 'Vậy à.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{毎日|まいにち}、インターネットをしますか。——はい、します。', ro: 'Mainichi, intānetto o shimasu ka. — Hai, shimasu.', vi: 'Hằng ngày bạn có lên mạng không? — Có.' },
        { en: '{毎朝|まいあさ}、{何時|なんじ}に{学校|がっこう}へ{来|き}ますか。——{8時|はちじ}に{来|き}ます。', ro: 'Maiasa, nanji ni gakkō e kimasu ka. — Hachiji ni kimasu.', vi: 'Sáng nào bạn đến trường lúc mấy giờ? — Tôi đến lúc 8 giờ.' },
        { en: '{朝|あさ}、{何|なに}も{食|た}べません。', ro: 'Asa, nanimo tabemasen.', vi: 'Buổi sáng tôi không ăn gì cả.' },
        { en: 'どこへも{行|い}きません。', ro: 'Doko e mo ikimasen.', vi: 'Tôi không đi đâu cả.' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {私|わたし}の{1週間|いっしゅうかん} (Một tuần của tôi)' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới) — đọc to từng câu, rồi viết một đoạn **y hệt khung này** về tuần của bạn. Đây cũng là dạng bài đọc 100–110 chữ của phần Reading trong đề thi.',
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{大学|だいがく}の{留学生|りゅうがくせい}です。', ro: 'Watashi wa daigaku no ryūgakusei desu.', vi: 'Tôi là du học sinh của trường đại học.' },
        { en: '{月曜日|げつようび}から{金曜日|きんようび}まで、{大学|だいがく}へ{行|い}きます。', ro: 'Getsuyōbi kara kin\'yōbi made, daigaku e ikimasu.', vi: 'Từ thứ Hai đến thứ Sáu tôi đi học ở trường.' },
        { en: '{授業|じゅぎょう}は{午前|ごぜん}{9時|くじ}から{午後|ごご}{3時|さんじ}までです。', ro: 'Jugyō wa gozen kuji kara gogo sanji made desu.', vi: 'Giờ học từ 9 giờ sáng đến 3 giờ chiều.' },
        { en: '{毎朝|まいあさ}、{7時|しちじ}に{起|お}きます。パンや{果物|くだもの}などを{食|た}べます。', ro: 'Maiasa, shichiji ni okimasu. Pan ya kudamono nado o tabemasu.', vi: 'Sáng nào tôi cũng dậy lúc 7 giờ. Tôi ăn bánh mì, hoa quả, v.v.' },
        { en: '{火曜日|かようび}と{木曜日|もくようび}、{郵便局|ゆうびんきょく}でアルバイトをします。', ro: 'Kayōbi to mokuyōbi, yūbinkyoku de arubaito o shimasu.', vi: 'Thứ Ba và thứ Năm tôi làm thêm ở bưu điện.' },
        { en: '{5時|ごじ}から{8時|はちじ}まで{働|はたら}きます。', ro: 'Goji kara hachiji made hatarakimasu.', vi: 'Tôi làm từ 5 giờ đến 8 giờ.' },
        { en: '{土曜日|どようび}、{図書館|としょかん}で{本|ほん}を{読|よ}みます。', ro: 'Doyōbi, toshokan de hon o yomimasu.', vi: 'Thứ Bảy tôi đọc sách ở thư viện.' },
        { en: '{日曜日|にちようび}はどこへも{行|い}きません。うちでテレビを{見|み}ます。', ro: 'Nichiyōbi wa doko e mo ikimasen. Uchi de terebi o mimasu.', vi: 'Chủ Nhật tôi không đi đâu cả. Tôi xem TV ở nhà.' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Một tuần của tôi" theo khung',
      items: [
        '**Câu 1 — giới thiệu:** {私|わたし}は ___ の{学生|がくせい}です。',
        '**Câu 2 — ngày đi học:** ___{曜日|ようび}から ___{曜日|ようび}まで、___へ{行|い}きます。',
        '**Câu 3 — giờ:** ___{時|じ}から ___{時|じ}まで ___で ___を{勉強|べんきょう}します。',
        '**Câu 4 — cuối tuần ({週末|しゅうまつ}):** {週末|しゅうまつ}、___へ{行|い}きます。___で ___を ___ます。',
        '**Câu 5 — làm thêm / thói quen:** ___{曜日|ようび}、___でアルバイトをします。／{毎晩|まいばん}、___{時|じ}に{寝|ね}ます。',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Hỏi lịch trường / công ty của bạn' },
    {
      t: 'p',
      text: 'Nhiệm vụ: hỏi thầy cô (hoặc người ở chỗ làm) để điền **giờ** các hoạt động trong ngày và **ngày** các sự kiện trong năm. Dùng đúng những câu dưới đây.',
    },
    {
      t: 'table',
      head: ['Muốn biết', 'Hỏi thế này', 'Trả lời mẫu'],
      rows: [
        ['Giờ học', '{授業|じゅぎょう}は{何時|なんじ}から{何時|なんじ}までですか。 (Jugyō wa nanji kara nanji made desu ka.)', '{7時|しちじ}{30分|さんじゅっぷん}から{11時|じゅういちじ}までです。'],
        ['Nghỉ trưa', '{昼|ひる}{休|やす}みは{何時|なんじ}から{何時|なんじ}までですか。 (Hiruyasumi wa nanji kara nanji made desu ka.)', '{12時|じゅうにじ}から{1時|いちじ}までです。'],
        ['Ngày thi', 'テストはいつですか。 (Tesuto wa itsu desu ka.)', '{3月|さんがつ}{10日|とおか}です。'],
        ['Kỳ nghỉ', '{冬休|ふゆやす}みはいつからいつまでですか。 (Fuyuyasumi wa itsu kara itsu made desu ka.)', '{1月|いちがつ}{20日|はつか}から{2月|にがつ}{4日|よっか}までです。'],
        ['Ngày làm việc', '{会社|かいしゃ}は{何曜日|なんようび}から{何曜日|なんようび}までですか。 (Kaisha wa nan\'yōbi kara nan\'yōbi made desu ka.)', '{月曜日|げつようび}から{土曜日|どようび}までです。'],
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */
/* Đủ 80 mục trong "Từ mới bài 3" của cô (17 + 33 + 30), chia 8 nhóm. */

const TU_VUNG: Lesson = {
  id: 'b3-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 80 từ của bài 3',
  goal: 'Đọc, hiểu và dùng được đủ 80 từ trong danh sách từ mới bài 3 của cô: giờ giấc, nơi chốn, sự kiện, đồ ăn, 14 động từ.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **80 từ** trong danh sách "Từ mới bài 3" cô phát, chia thành 8 nhóm để dễ nhớ. Mỗi câu ví dụ chỉ dùng từ của bài 1–3, nên bạn đọc là hiểu và **nói lại được ngay**. Mẹo: học nhóm **G (14 động từ)** thật kỹ — cả bài ngữ pháp xoay quanh chúng.',
    },

    { t: 'h', text: 'A. Thời gian (15 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{今|いま}', pos: 'danh từ', ipa: 'ima', vi: 'bây giờ', ex: '{今|いま}、{何時|なんじ}ですか。', exRo: 'Ima, nanji desu ka.', exVi: 'Bây giờ là mấy giờ?' },
        { w: '{午前|ごぜん}', pos: 'danh từ', ipa: 'gozen', vi: 'buổi sáng, sáng (AM — trước 12 giờ trưa)', ex: '{銀行|ぎんこう}は{午前|ごぜん}{9時|くじ}からです。', exRo: 'Ginkō wa gozen kuji kara desu.', exVi: 'Ngân hàng mở từ 9 giờ sáng.' },
        { w: '{午後|ごご}', pos: 'danh từ', ipa: 'gogo', vi: 'buổi chiều, chiều/tối (PM — sau 12 giờ trưa)', ex: '{午後|ごご}、{図書館|としょかん}へ{行|い}きます。', exRo: 'Gogo, toshokan e ikimasu.', exVi: 'Buổi chiều tôi đi thư viện.' },
        { w: '{昼|ひる}', pos: 'danh từ', ipa: 'hiru', vi: 'buổi trưa, ban ngày', ex: '{昼|ひる}、お{弁当|べんとう}を{食|た}べます。', exRo: 'Hiru, obentō o tabemasu.', exVi: 'Buổi trưa tôi ăn cơm hộp.' },
        { w: '{時間|じかん}', pos: 'danh từ', ipa: 'jikan', vi: 'thời gian, giờ giấc (giờ mở cửa)', ex: '{図書館|としょかん}の{時間|じかん}は{9時|くじ}から{7時|しちじ}までです。', exRo: 'Toshokan no jikan wa kuji kara shichiji made desu.', exVi: 'Giờ mở cửa của thư viện là từ 9 giờ đến 7 giờ.' },
        { w: '～{時|じ}', pos: 'hậu tố đếm', ipa: '~ji', vi: '~ giờ (chú ý: {4時|よじ}, {7時|しちじ}, {9時|くじ})', ex: '{今|いま}、{4時|よじ}です。', exRo: 'Ima, yoji desu.', exVi: 'Bây giờ là 4 giờ.' },
        { w: '～{分|ふん}', pos: 'hậu tố đếm', ipa: '~fun / ~pun', vi: '~ phút (có lúc đọc ぷん: {1分|いっぷん}, {10分|じゅっぷん}…)', ex: '{今|いま}、{9時|くじ}{20分|にじゅっぷん}です。', exRo: 'Ima, kuji nijuppun desu.', exVi: 'Bây giờ là 9 giờ 20 phút.' },
        { w: '～{時半|じはん}', pos: 'hậu tố', ipa: '~ji han', vi: '~ giờ rưỡi', ex: '{毎朝|まいあさ}、{7時半|しちじはん}に{起|お}きます。', exRo: 'Maiasa, shichiji han ni okimasu.', exVi: 'Sáng nào tôi cũng dậy lúc 7 giờ rưỡi.' },
        { w: '～{曜日|ようび}', pos: 'hậu tố', ipa: '~yōbi', vi: 'thứ ~ (trong tuần)', ex: '{休|やす}みは{何曜日|なんようび}ですか。', exRo: 'Yasumi wa nan\'yōbi desu ka.', exVi: 'Ngày nghỉ là thứ mấy?' },
        { w: '{朝|あさ}', pos: 'danh từ', ipa: 'asa', vi: 'buổi sáng', ex: '{朝|あさ}、コーヒーを{飲|の}みます。', exRo: 'Asa, kōhī o nomimasu.', exVi: 'Buổi sáng tôi uống cà phê.' },
        { w: '{夜|よる}', pos: 'danh từ', ipa: 'yoru', vi: 'buổi tối, ban đêm', ex: '{夜|よる}、テレビを{見|み}ます。', exRo: 'Yoru, terebi o mimasu.', exVi: 'Buổi tối tôi xem TV.' },
        { w: '{毎日|まいにち}', pos: 'danh từ / trạng từ', ipa: 'mainichi', vi: 'hằng ngày, mỗi ngày', ex: '{毎日|まいにち}、{日本語|にほんご}を{勉強|べんきょう}します。', exRo: 'Mainichi, nihongo o benkyō shimasu.', exVi: 'Hằng ngày tôi học tiếng Nhật.' },
        { w: '{毎朝|まいあさ}', pos: 'danh từ / trạng từ', ipa: 'maiasa', vi: 'mỗi sáng, sáng nào cũng', ex: '{毎朝|まいあさ}、{新聞|しんぶん}を{読|よ}みます。', exRo: 'Maiasa, shinbun o yomimasu.', exVi: 'Sáng nào tôi cũng đọc báo.' },
        { w: '{毎晩|まいばん}', pos: 'danh từ / trạng từ', ipa: 'maiban', vi: 'mỗi tối, tối nào cũng', ex: '{毎晩|まいばん}、{11時|じゅういちじ}に{寝|ね}ます。', exRo: 'Maiban, jūichiji ni nemasu.', exVi: 'Tối nào tôi cũng ngủ lúc 11 giờ.' },
        { w: '{1年|いちねん}', pos: 'danh từ', ipa: 'ichinen', vi: 'một năm', ex: 'これは{学校|がっこう}の{1年|いちねん}のスケジュールです。', exRo: 'Kore wa gakkō no ichinen no sukejūru desu.', exVi: 'Đây là lịch cả năm của trường.' },
      ],
    },

    { t: 'h', text: 'B. Nơi chốn (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{銀行|ぎんこう}', pos: 'danh từ', ipa: 'ginkō', vi: 'ngân hàng', ex: '{銀行|ぎんこう}は{3時|さんじ}までです。', exRo: 'Ginkō wa sanji made desu.', exVi: 'Ngân hàng làm đến 3 giờ.' },
        { w: '{体育館|たいいくかん}', pos: 'danh từ', ipa: 'taiikukan', vi: 'nhà thi đấu, nhà tập thể dục', ex: '{体育館|たいいくかん}の{休|やす}みは{月曜日|げつようび}です。', exRo: 'Taiikukan no yasumi wa getsuyōbi desu.', exVi: 'Nhà thi đấu nghỉ vào thứ Hai.' },
        { w: '{図書館|としょかん}', pos: 'danh từ', ipa: 'toshokan', vi: 'thư viện', ex: '{図書館|としょかん}で{本|ほん}を{読|よ}みます。', exRo: 'Toshokan de hon o yomimasu.', exVi: 'Tôi đọc sách ở thư viện.' },
        { w: '{病院|びょういん}', pos: 'danh từ', ipa: 'byōin', vi: 'bệnh viện', ex: '{病院|びょういん}は{何時|なんじ}からですか。', exRo: 'Byōin wa nanji kara desu ka.', exVi: 'Bệnh viện mở từ mấy giờ?' },
        { w: '{郵便局|ゆうびんきょく}', pos: 'danh từ', ipa: 'yūbinkyoku', vi: 'bưu điện', ex: '{郵便局|ゆうびんきょく}の{休|やす}みは{土曜日|どようび}と{日曜日|にちようび}です。', exRo: 'Yūbinkyoku no yasumi wa doyōbi to nichiyōbi desu.', exVi: 'Bưu điện nghỉ thứ Bảy và Chủ Nhật.' },
        { w: '{海|うみ}', pos: 'danh từ', ipa: 'umi', vi: 'biển', ex: '{夏休|なつやす}み、{海|うみ}へ{行|い}きます。', exRo: 'Natsuyasumi, umi e ikimasu.', exVi: 'Nghỉ hè tôi đi biển.' },
        { w: '{公園|こうえん}', pos: 'danh từ', ipa: 'kōen', vi: 'công viên', ex: '{公園|こうえん}でバーベキューをします。', exRo: 'Kōen de bābekyū o shimasu.', exVi: 'Tôi nướng BBQ ở công viên.' },
        { w: '{家|うち}', pos: 'danh từ', ipa: 'uchi', vi: 'nhà, nhà mình (thường viết うち)', ex: 'うちでDVDを{見|み}ます。', exRo: 'Uchi de dībuidī o mimasu.', exVi: 'Tôi xem DVD ở nhà.' },
        { w: '{会社|かいしゃ}', pos: 'danh từ', ipa: 'kaisha', vi: 'công ty', ex: '{9時|くじ}に{会社|かいしゃ}へ{行|い}きます。', exRo: 'Kuji ni kaisha e ikimasu.', exVi: 'Tôi đến công ty lúc 9 giờ.' },
        { w: '{学校|がっこう}', pos: 'danh từ', ipa: 'gakkō', vi: 'trường học', ex: '{毎朝|まいあさ}、{8時|はちじ}に{学校|がっこう}へ{来|き}ます。', exRo: 'Maiasa, hachiji ni gakkō e kimasu.', exVi: 'Sáng nào tôi cũng đến trường lúc 8 giờ.' },
        { w: 'コンビニ', pos: 'danh từ', ipa: 'konbini', vi: 'cửa hàng tiện lợi', ex: 'コンビニで{牛乳|ぎゅうにゅう}を{買|か}います。', exRo: 'Konbini de gyūnyū o kaimasu.', exVi: 'Tôi mua sữa ở cửa hàng tiện lợi.' },
      ],
    },

    { t: 'h', text: 'C. Trường học & lịch (6 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{授業|じゅぎょう}', pos: 'danh từ', ipa: 'jugyō', vi: 'giờ học, tiết học', ex: '{授業|じゅぎょう}は{9時|くじ}から{12時|じゅうにじ}までです。', exRo: 'Jugyō wa kuji kara jūniji made desu.', exVi: 'Giờ học từ 9 giờ đến 12 giờ.' },
        { w: 'テスト', pos: 'danh từ', ipa: 'tesuto', vi: 'bài kiểm tra, kỳ thi', ex: '{6月|ろくがつ}{2日|ふつか}はテストです。', exRo: 'Rokugatsu futsuka wa tesuto desu.', exVi: 'Ngày 2 tháng 6 là bài kiểm tra.' },
        { w: '{休|やす}み', pos: 'danh từ', ipa: 'yasumi', vi: 'nghỉ, ngày nghỉ, kỳ nghỉ', ex: '{休|やす}みはいつですか。', exRo: 'Yasumi wa itsu desu ka.', exVi: 'Ngày nghỉ là khi nào?' },
        { w: 'スケジュール', pos: 'danh từ', ipa: 'sukejūru', vi: 'lịch trình, kế hoạch, lịch', ex: '{学校|がっこう}のスケジュールを{見|み}ます。', exRo: 'Gakkō no sukejūru o mimasu.', exVi: 'Tôi xem lịch của trường.' },
        { w: 'アルバイト', pos: 'danh từ', ipa: 'arubaito', vi: 'việc làm thêm', ex: '{土曜日|どようび}、コンビニでアルバイトをします。', exRo: 'Doyōbi, konbini de arubaito o shimasu.', exVi: 'Thứ Bảy tôi làm thêm ở cửa hàng tiện lợi.' },
        { w: '{留学生|りゅうがくせい}', pos: 'danh từ', ipa: 'ryūgakusei', vi: 'du học sinh, lưu học sinh', ex: '{5月|ごがつ}{10日|とおか}は{留学生|りゅうがくせい}パーティーです。', exRo: 'Gogatsu tōka wa ryūgakusei pātī desu.', exVi: 'Ngày 10 tháng 5 là tiệc du học sinh.' },
      ],
    },

    { t: 'h', text: 'D. Sự kiện, mùa, đi chơi (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'スキー', pos: 'danh từ', ipa: 'sukī', vi: 'trượt tuyết (スキーをします = chơi trượt tuyết)', ex: '{北海道|ほっかいどう}でスキーをします。', exRo: 'Hokkaidō de sukī o shimasu.', exVi: 'Tôi trượt tuyết ở Hokkaido.' },
        { w: 'パーティー', pos: 'danh từ', ipa: 'pātī', vi: 'bữa tiệc', ex: 'パーティーでおすしを{食|た}べます。', exRo: 'Pātī de osushi o tabemasu.', exVi: 'Ở bữa tiệc tôi ăn sushi.' },
        { w: 'バーベキュー', pos: 'danh từ', ipa: 'bābekyū', vi: 'tiệc nướng ngoài trời (BBQ)', ex: '{日曜日|にちようび}、バーベキューをします。', exRo: 'Nichiyōbi, bābekyū o shimasu.', exVi: 'Chủ Nhật tôi nướng BBQ.' },
        { w: '{花火|はなび}', pos: 'danh từ', ipa: 'hanabi', vi: 'pháo hoa', ex: '{夏|なつ}、{花火|はなび}を{見|み}ます。', exRo: 'Natsu, hanabi o mimasu.', exVi: 'Mùa hè tôi xem pháo hoa.' },
        { w: '（お）{花見|はなみ}', pos: 'danh từ', ipa: '(o)hanami', vi: 'ngắm hoa (anh đào)', ex: '{4月|しがつ}{5日|いつか}はお{花見|はなみ}です。', exRo: 'Shigatsu itsuka wa ohanami desu.', exVi: 'Ngày 5 tháng 4 là buổi ngắm hoa.' },
        { w: 'ホームステイ', pos: 'danh từ', ipa: 'hōmusutei', vi: 'ở cùng gia đình người bản địa (homestay)', ex: '{8月|はちがつ}、{京都|きょうと}でホームステイをします。', exRo: 'Hachigatsu, Kyōto de hōmusutei o shimasu.', exVi: 'Tháng 8 tôi ở homestay tại Kyoto.' },
        { w: '（お）{祭|まつ}り', pos: 'danh từ', ipa: '(o)matsuri', vi: 'lễ hội', ex: '{10月|じゅうがつ}、お{祭|まつ}りを{見|み}ます。', exRo: 'Jūgatsu, omatsuri o mimasu.', exVi: 'Tháng 10 tôi xem lễ hội.' },
        { w: '{桜|さくら}', pos: 'danh từ', ipa: 'sakura', vi: 'hoa anh đào', ex: '{公園|こうえん}で{桜|さくら}を{見|み}ます。', exRo: 'Kōen de sakura o mimasu.', exVi: 'Tôi ngắm hoa anh đào ở công viên.' },
        { w: 'バス', pos: 'danh từ', ipa: 'basu', vi: 'xe buýt', ex: '{5月|ごがつ}{15日|じゅうごにち}はバス{旅行|りょこう}です。', exRo: 'Gogatsu jūgonichi wa basu ryokō desu.', exVi: 'Ngày 15 tháng 5 là chuyến đi chơi bằng xe buýt.' },
        { w: '{春|はる}', pos: 'danh từ', ipa: 'haru', vi: 'mùa xuân', ex: '{春休|はるやす}み、{国|くに}へ{帰|かえ}ります。', exRo: 'Haruyasumi, kuni e kaerimasu.', exVi: 'Nghỉ xuân tôi về nước.' },
        { w: '{夏|なつ}', pos: 'danh từ', ipa: 'natsu', vi: 'mùa hè', ex: '{夏休|なつやす}みは{8月|はちがつ}からです。', exRo: 'Natsuyasumi wa hachigatsu kara desu.', exVi: 'Nghỉ hè bắt đầu từ tháng 8.' },
        { w: '{秋|あき}', pos: 'danh từ', ipa: 'aki', vi: 'mùa thu', ex: '{秋休|あきやす}み、アルバイトをします。', exRo: 'Akiyasumi, arubaito o shimasu.', exVi: 'Nghỉ thu tôi đi làm thêm.' },
        { w: '{冬|ふゆ}', pos: 'danh từ', ipa: 'fuyu', vi: 'mùa đông', ex: '{冬休|ふゆやす}みはいつからいつまでですか。', exRo: 'Fuyuyasumi wa itsu kara itsu made desu ka.', exVi: 'Nghỉ đông từ bao giờ đến bao giờ?' },
        { w: 'ゴールデンウイーク', pos: 'danh từ', ipa: 'gōruden uīku', vi: 'Tuần lễ Vàng (chuỗi ngày nghỉ cuối tháng 4 – đầu tháng 5 ở Nhật)', ex: 'ゴールデンウイーク、{何|なに}をしますか。', exRo: 'Gōruden uīku, nani o shimasu ka.', exVi: 'Tuần lễ Vàng bạn làm gì?' },
      ],
    },

    { t: 'h', text: 'E. Ăn uống & giải trí (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '（お）{酒|さけ}', pos: 'danh từ', ipa: '(o)sake', vi: 'rượu (rượu Nhật; cũng là rượu nói chung)', ex: '{夜|よる}、お{酒|さけ}を{飲|の}みます。', exRo: 'Yoru, osake o nomimasu.', exVi: 'Buổi tối tôi uống rượu.' },
        { w: '（お）すし', pos: 'danh từ', ipa: '(o)sushi', vi: 'món sushi', ex: '{土曜日|どようび}、おすしを{食|た}べます。', exRo: 'Doyōbi, osushi o tabemasu.', exVi: 'Thứ Bảy tôi ăn sushi.' },
        { w: '（お）{弁当|べんとう}', pos: 'danh từ', ipa: '(o)bentō', vi: 'cơm hộp', ex: 'コンビニでお{弁当|べんとう}を{買|か}います。', exRo: 'Konbini de obentō o kaimasu.', exVi: 'Tôi mua cơm hộp ở cửa hàng tiện lợi.' },
        { w: '{朝|あさ}ご{飯|はん}', pos: 'danh từ', ipa: 'asagohan', vi: 'bữa sáng', ex: '{毎朝|まいあさ}、{朝|あさ}ご{飯|はん}を{食|た}べますか。', exRo: 'Maiasa, asagohan o tabemasu ka.', exVi: 'Sáng nào bạn cũng ăn sáng à?' },
        { w: '{昼|ひる}ごはん', pos: 'danh từ', ipa: 'hirugohan', vi: 'bữa trưa', ex: '{昼|ひる}ごはんは{学校|がっこう}で{食|た}べます。', exRo: 'Hirugohan wa gakkō de tabemasu.', exVi: 'Bữa trưa tôi ăn ở trường.' },
        { w: '{牛乳|ぎゅうにゅう}', pos: 'danh từ', ipa: 'gyūnyū', vi: 'sữa bò', ex: '{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}みます。', exRo: 'Maiasa, gyūnyū o nomimasu.', exVi: 'Sáng nào tôi cũng uống sữa.' },
        { w: '{果物|くだもの}', pos: 'danh từ', ipa: 'kudamono', vi: 'hoa quả, trái cây', ex: '{朝|あさ}、{果物|くだもの}を{食|た}べます。', exRo: 'Asa, kudamono o tabemasu.', exVi: 'Buổi sáng tôi ăn hoa quả.' },
        { w: 'サラダ', pos: 'danh từ', ipa: 'sarada', vi: 'món salad', ex: 'パンやサラダなどを{食|た}べます。', exRo: 'Pan ya sarada nado o tabemasu.', exVi: 'Tôi ăn bánh mì, salad, v.v.' },
        { w: 'チーズ', pos: 'danh từ', ipa: 'chīzu', vi: 'phô mai', ex: 'スーパーでチーズを{買|か}います。', exRo: 'Sūpā de chīzu o kaimasu.', exVi: 'Tôi mua phô mai ở siêu thị.' },
        { w: 'インターネット', pos: 'danh từ', ipa: 'intānetto', vi: 'mạng internet (インターネットをします = lên mạng)', ex: '{毎晩|まいばん}、インターネットをします。', exRo: 'Maiban, intānetto o shimasu.', exVi: 'Tối nào tôi cũng lên mạng.' },
        { w: '{新聞|しんぶん}', pos: 'danh từ', ipa: 'shinbun', vi: 'báo, tờ báo', ex: '{新聞|しんぶん}を{読|よ}みますか。', exRo: 'Shinbun o yomimasu ka.', exVi: 'Bạn có đọc báo không?' },
        { w: 'テレビ', pos: 'danh từ', ipa: 'terebi', vi: 'ti vi', ex: 'うちでテレビを{見|み}ます。', exRo: 'Uchi de terebi o mimasu.', exVi: 'Tôi xem TV ở nhà.' },
        { w: 'CD', pos: 'danh từ', ipa: 'shīdī', vi: 'đĩa CD', ex: '{夜|よる}、CDを{聞|き}きます。', exRo: 'Yoru, shīdī o kikimasu.', exVi: 'Buổi tối tôi nghe CD.' },
        { w: 'DVD', pos: 'danh từ', ipa: 'dībuidī', vi: 'đĩa DVD', ex: '{日曜日|にちようび}、DVDを{見|み}ます。', exRo: 'Nichiyōbi, dībuidī o mimasu.', exVi: 'Chủ Nhật tôi xem DVD.' },
      ],
    },

    { t: 'h', text: 'F. Từ hỏi & phủ định hoàn toàn (3 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{何|なに}', pos: 'từ để hỏi', ipa: 'nani', vi: 'cái gì (trước を đọc なに; trước です/の/giờ đọc なん: {何時|なんじ})', ex: '{何|なに}を{飲|の}みますか。', exRo: 'Nani o nomimasu ka.', exVi: 'Bạn uống gì?' },
        { w: '{何|なに}も', pos: 'phó từ (đi với ません)', ipa: 'nanimo', vi: '(không) … gì cả', ex: '{朝|あさ}、{何|なに}も{食|た}べません。', exRo: 'Asa, nanimo tabemasen.', exVi: 'Buổi sáng tôi không ăn gì cả.' },
        { w: 'どこ（へ）も', pos: 'phó từ (đi với ません)', ipa: 'doko (e) mo', vi: '(không đi) đâu cả', ex: '{日曜日|にちようび}、どこへも{行|い}きません。', exRo: 'Nichiyōbi, doko e mo ikimasen.', exVi: 'Chủ Nhật tôi không đi đâu cả.' },
      ],
    },

    { t: 'h', text: 'G. 14 động từ (thể ます) — trọng tâm của bài' },
    {
      t: 'p',
      text: 'Trong ngoặc ［ ］ là **thể từ điển** (dạng gốc tra từ điển, học kỹ ở bài 9), số 1/2/3 là **nhóm động từ**. Bây giờ bạn chỉ cần dùng dạng **～ます**.',
    },
    {
      t: 'vocab',
      items: [
        { w: '{行|い}きます［{行|い}く］', pos: 'động từ nhóm 1', ipa: 'ikimasu [iku]', vi: 'đi', ex: '{図書館|としょかん}へ{行|い}きます。', exRo: 'Toshokan e ikimasu.', exVi: 'Tôi đi thư viện.' },
        { w: '{帰|かえ}ります［{帰|かえ}る］', pos: 'động từ nhóm 1', ipa: 'kaerimasu [kaeru]', vi: 'về, trở về (nhà, nước mình)', ex: '{6時|ろくじ}にうちへ{帰|かえ}ります。', exRo: 'Rokuji ni uchi e kaerimasu.', exVi: 'Tôi về nhà lúc 6 giờ.' },
        { w: '{飲|の}みます［{飲|の}む］', pos: 'động từ nhóm 1', ipa: 'nomimasu [nomu]', vi: 'uống', ex: 'お{茶|ちゃ}を{飲|の}みます。', exRo: 'Ocha o nomimasu.', exVi: 'Tôi uống trà.' },
        { w: '{食|た}べます［{食|た}べる］', pos: 'động từ nhóm 2', ipa: 'tabemasu [taberu]', vi: 'ăn', ex: 'パーティーでおすしを{食|た}べます。', exRo: 'Pātī de osushi o tabemasu.', exVi: 'Tôi ăn sushi ở bữa tiệc.' },
        { w: '{見|み}ます［{見|み}る］', pos: 'động từ nhóm 2', ipa: 'mimasu [miru]', vi: 'xem, nhìn, ngắm', ex: '{花火|はなび}を{見|み}ます。', exRo: 'Hanabi o mimasu.', exVi: 'Tôi xem pháo hoa.' },
        { w: 'します［する］', pos: 'động từ nhóm 3', ipa: 'shimasu [suru]', vi: 'làm, chơi', ex: 'スキーをします。', exRo: 'Sukī o shimasu.', exVi: 'Chơi trượt tuyết.' },
        { w: '{買|か}います［{買|か}う］', pos: 'động từ nhóm 1', ipa: 'kaimasu [kau]', vi: 'mua', ex: 'コンビニでお{弁当|べんとう}を{買|か}います。', exRo: 'Konbini de obentō o kaimasu.', exVi: 'Tôi mua cơm hộp ở cửa hàng tiện lợi.' },
        { w: '{聞|き}きます［{聞|き}く］', pos: 'động từ nhóm 1', ipa: 'kikimasu [kiku]', vi: 'nghe; hỏi', ex: 'CDを{聞|き}きます。', exRo: 'Shīdī o kikimasu.', exVi: 'Tôi nghe CD.' },
        { w: '{働|はたら}きます［{働|はたら}く］', pos: 'động từ nhóm 1', ipa: 'hatarakimasu [hataraku]', vi: 'làm việc, lao động', ex: '{会社|かいしゃ}で{働|はたら}きます。', exRo: 'Kaisha de hatarakimasu.', exVi: 'Tôi làm việc ở công ty.' },
        { w: '{読|よ}みます［{読|よ}む］', pos: 'động từ nhóm 1', ipa: 'yomimasu [yomu]', vi: 'đọc', ex: '{新聞|しんぶん}を{読|よ}みます。', exRo: 'Shinbun o yomimasu.', exVi: 'Tôi đọc báo.' },
        { w: '{起|お}きます［{起|お}きる］', pos: 'động từ nhóm 2', ipa: 'okimasu [okiru]', vi: 'thức dậy', ex: '{毎朝|まいあさ}、{6時|ろくじ}に{起|お}きます。', exRo: 'Maiasa, rokuji ni okimasu.', exVi: 'Sáng nào tôi cũng dậy lúc 6 giờ.' },
        { w: '{寝|ね}ます［{寝|ね}る］', pos: 'động từ nhóm 2', ipa: 'nemasu [neru]', vi: 'ngủ, đi ngủ', ex: '{12時|じゅうにじ}に{寝|ね}ます。', exRo: 'Jūniji ni nemasu.', exVi: 'Tôi ngủ lúc 12 giờ.' },
        { w: '{勉強|べんきょう}します［{勉強|べんきょう}する］', pos: 'động từ nhóm 3', ipa: 'benkyō shimasu [benkyō suru]', vi: 'học, học bài, học tập', ex: '{図書館|としょかん}で{勉強|べんきょう}します。', exRo: 'Toshokan de benkyō shimasu.', exVi: 'Tôi học ở thư viện.' },
        { w: '{来|き}ます［{来|く}る］', pos: 'động từ nhóm 3', ipa: 'kimasu [kuru]', vi: 'đến, tới (về phía người nói)', ex: '{8時|はちじ}に{学校|がっこう}へ{来|き}ます。', exRo: 'Hachiji ni gakkō e kimasu.', exVi: 'Tôi đến trường lúc 8 giờ.' },
      ],
    },

    { t: 'h', text: 'H. Câu cảm thán (3 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'いいですね', pos: 'câu cảm thán', ipa: 'ii desu ne', vi: 'hay quá nhỉ!, tốt quá nhỉ!', ex: 'A：{夏休|なつやす}み、{北海道|ほっかいどう}へ{行|い}きます。 B：いいですね。', exRo: 'A: Natsuyasumi, Hokkaidō e ikimasu. B: Ii desu ne.', exVi: 'A: Nghỉ hè tôi đi Hokkaido. B: Hay quá nhỉ!' },
        { w: 'えっ', pos: 'thán từ', ipa: 'e\'', vi: 'Ơ!, Hả! (bất ngờ, không tin)', ex: 'えっ、{毎晩|まいばん}{2時|にじ}に{寝|ね}ますか。', exRo: 'E\', maiban niji ni nemasu ka.', exVi: 'Hả, tối nào bạn cũng ngủ lúc 2 giờ á?' },
        { w: 'へえ', pos: 'thán từ', ipa: 'hē', vi: 'Chà!, Ồ! (ngạc nhiên nhẹ, thấy thú vị)', ex: 'へえ、そうですか。', exRo: 'Hē, sō desu ka.', exVi: 'Ồ, thế à.' },
      ],
    },

    {
      t: 'note',
      title: 'Nhầm hay gặp',
      items: [
        '{家|うち} trong danh sách của cô đọc là **うち** (nhà mình). Chữ này còn đọc いえ (ngôi nhà) — trong bài 3 luôn nói **うちへ{帰|かえ}ります**, **うちで**…',
        '{来|き}ます (đến) và {聞|き}きます (nghe) đều bắt đầu bằng き — {来|き}ます chỉ có **2 chữ** き・ます, {聞|き}きます có **3 chữ** き・き・ます.',
        '{昼|ひる} là buổi trưa, **{昼|ひる}ごはん** là bữa trưa; {朝|あさ} là buổi sáng, **{朝|あさ}ご{飯|はん}** là bữa sáng. Đừng nói ~~{朝|あさ}を{食|た}べます~~.',
        'Thể thao, internet, làm thêm, homestay… đều đi với **します**: スキーをします, インターネットをします, アルバイトをします, ホームステイをします.',
      ],
    },
    {
      t: 'table',
      caption: 'Từ bổ sung (không có trong danh sách của cô nhưng xuất hiện trong bài và đề thi)',
      head: ['Từ', 'Romaji', 'Nghĩa'],
      rows: [
        ['{週末|しゅうまつ}', 'shūmatsu', 'cuối tuần'],
        ['{夏休|なつやす}み・{冬休|ふゆやす}み・{春休|はるやす}み・{秋休|あきやす}み', 'natsuyasumi · fuyuyasumi · haruyasumi · akiyasumi', 'nghỉ hè · nghỉ đông · nghỉ xuân · nghỉ thu'],
        ['{休|やす}みの{日|ひ}', 'yasumi no hi', 'ngày nghỉ (câu hỏi thi rất hay gặp)'],
        ['{昼休|ひるやす}み', 'hiruyasumi', 'nghỉ trưa'],
        ['{何時|なんじ}・{何分|なんぷん}・{何曜日|なんようび}・{何月|なんがつ}・{何日|なんにち}', 'nanji · nanpun · nan\'yōbi · nangatsu · nannichi', 'mấy giờ · mấy phút · thứ mấy · tháng mấy · ngày mấy'],
        ['いつ (bài 1)', 'itsu', 'khi nào'],
        ['{旅行|りょこう} (bài 1)', 'ryokō', 'du lịch, chuyến đi chơi'],
        ['そちら', 'sochira', 'phía đó, chỗ anh/chị (lịch sự, khi gọi điện)'],
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */
/* ポイント 16–23 + bảng đọc giờ/ngày (表 p.286) + bảng chia động từ (表 p.282–283). */

const NGU_PHAP: Lesson = {
  id: 'b3-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 16–23',
  goal: 'Đọc đúng giờ, thứ, ngày tháng; chia động từ ます／ません; dùng đúng 6 trợ từ へ・を・に・で・から〜まで・や〜など và câu phủ định 何も／どこへも.',
  minutes: 60,
  blocks: [
    {
      t: 'p',
      text: 'Bài 3 là bài **động từ đầu tiên**. Từ đây câu tiếng Nhật có khung: **[Ai] は [khi nào] [ở đâu] [cái gì] + động từ**. Mỗi chỗ trống có một **trợ từ** riêng đi theo — học 8 điểm ngữ pháp này là học 8 "cái móc" để treo từ vào câu. Trước hết phải đọc được **giờ và ngày**, vì câu nào của bài 3 cũng có nó.',
    },

    /* ── Chuẩn bị: giờ ── */
    { t: 'h', text: 'Chuẩn bị ① — Đọc giờ: ～{時|じ}・～{分|ふん}・～{時半|じはん}・{午前|ごぜん}／{午後|ごご}' },
    {
      t: 'table',
      caption: '～{時|じ} (giờ) — ô tô sáng là cách đọc BẤT QUY TẮC',
      head: ['Giờ', 'Đọc', 'Romaji', 'Giờ', 'Đọc', 'Romaji'],
      rows: [
        ['1{時|じ}', 'いちじ', 'ichiji', '7{時|じ}', '==しちじ==', 'shichiji'],
        ['2{時|じ}', 'にじ', 'niji', '8{時|じ}', 'はちじ', 'hachiji'],
        ['3{時|じ}', 'さんじ', 'sanji', '9{時|じ}', '==くじ==', 'kuji'],
        ['4{時|じ}', '==よじ==', 'yoji', '10{時|じ}', 'じゅうじ', 'jūji'],
        ['5{時|じ}', 'ごじ', 'goji', '11{時|じ}', 'じゅういちじ', 'jūichiji'],
        ['6{時|じ}', 'ろくじ', 'rokuji', '12{時|じ}', 'じゅうにじ', 'jūniji'],
        ['', '', '', '{何時|なんじ}', 'なんじ', 'nanji (mấy giờ?)'],
      ],
    },
    {
      t: 'table',
      caption: '～{分|ふん} (phút) — có số đọc ふん, có số đọc ぷん',
      head: ['Phút', 'Đọc', 'Romaji', 'Phút', 'Đọc', 'Romaji'],
      rows: [
        ['1{分|ふん}', '==いっぷん==', 'ippun', '9{分|ふん}', 'きゅうふん', 'kyūfun'],
        ['2{分|ふん}', 'にふん', 'nifun', '10{分|ふん}', '==じゅっぷん== (じっぷん)', 'juppun (jippun)'],
        ['3{分|ふん}', '==さんぷん==', 'sanpun', '15{分|ふん}', 'じゅうごふん', 'jūgofun'],
        ['4{分|ふん}', '==よんぷん==', 'yonpun', '20{分|ふん}', '==にじゅっぷん==', 'nijuppun'],
        ['5{分|ふん}', 'ごふん', 'gofun', '30{分|ふん}', '==さんじゅっぷん== ＝ {半|はん}', 'sanjuppun = han'],
        ['6{分|ふん}', '==ろっぷん==', 'roppun', '40{分|ふん}', '==よんじゅっぷん==', 'yonjuppun'],
        ['7{分|ふん}', 'ななふん', 'nanafun', '45{分|ふん}', 'よんじゅうごふん', 'yonjūgofun'],
        ['8{分|ふん}', '==はっぷん== (はちふん)', 'happun (hachifun)', '{何分|なんぷん}', '==なんぷん==', 'nanpun (mấy phút?)'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ ふん／ぷん',
      items: [
        'Số tận cùng **2, 5, 7, 9** → **ふん**: にふん, ごふん, ななふん, きゅうふん, じゅうごふん…',
        'Số tận cùng **1, 3, 4, 6, 8, 0** → **ぷん**: いっぷん, さんぷん, よんぷん, ろっぷん, はっぷん, じゅっぷん, にじゅっぷん…',
        '**30 phút** nói gọn là **{半|はん}** (rưỡi): {7時半|しちじはん} = 7 giờ rưỡi.',
        '**{午前|ごぜん}** (sáng, trước 12 giờ trưa) / **{午後|ごご}** (chiều–tối, sau 12 giờ trưa) đứng **TRƯỚC** giờ: {午後|ごご}{3時|さんじ} = 3 giờ chiều. Người Nhật hay nói giờ theo 12 tiếng + 午前/午後.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{今|いま}、{何時|なんじ}ですか。——{4時|よじ}{5分|ごふん}です。', ro: 'Ima, nanji desu ka. — Yoji gofun desu.', vi: 'Bây giờ mấy giờ? — 4 giờ 5 phút.' },
        { en: '{7時半|しちじはん}です。', ro: 'Shichiji han desu.', vi: '7 giờ rưỡi.' },
        { en: '{9時|くじ}{10分|じゅっぷん}です。', ro: 'Kuji juppun desu.', vi: '9 giờ 10 phút.' },
        { en: '{午前|ごぜん}{8時|はちじ}{45分|よんじゅうごふん}です。', ro: 'Gozen hachiji yonjūgofun desu.', vi: '8 giờ 45 sáng.' },
        { en: '{午後|ごご}{1時|いちじ}{20分|にじゅっぷん}です。', ro: 'Gogo ichiji nijuppun desu.', vi: '1 giờ 20 chiều.' },
        { en: '{午後|ごご}{6時|ろくじ}{6分|ろっぷん}です。', ro: 'Gogo rokuji roppun desu.', vi: '6 giờ 6 phút chiều.' },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay đọc sai giờ',
      items: [
        '4 giờ: ~~よんじ~~ → **よじ**. (4 phút lại là **よんぷん** — đừng lẫn.)',
        '9 giờ: ~~きゅうじ~~ → **くじ**. (9 phút lại là **きゅうふん**.)',
        '7 giờ: **しちじ** (sách dùng しちじ; ななじ đôi khi nghe ngoài đời nhưng khi thi hãy nói しちじ).',
        '10 phút: ~~じゅうふん~~ → **じゅっぷん**; 6 phút: ~~ろくふん~~ → **ろっぷん**.',
        'Giám thị hỏi {今|いま}{何時|なんじ}ですか thì trả lời **câu đầy đủ**: {今|いま}、{3時|さんじ}{10分|じゅっぷん}です — không chỉ nói số.',
      ],
    },

    /* ── Chuẩn bị: thứ, tháng, ngày ── */
    { t: 'h', text: 'Chuẩn bị ② — Thứ trong tuần, tháng, ngày (カレンダー)' },
    {
      t: 'table',
      caption: '～{曜日|ようび} — mỗi thứ mang tên một "hành" (mặt trăng, mặt trời, ngũ hành)',
      head: ['Chữ', 'Đọc', 'Romaji', 'Nghĩa', 'Mẹo nhớ'],
      rows: [
        ['{月曜日|げつようび}', 'げつようび', 'getsuyōbi', 'Thứ Hai', '月 = mặt trăng (Monday = Moon day)'],
        ['{火曜日|かようび}', 'かようび', 'kayōbi', 'Thứ Ba', '火 = lửa (Hoả)'],
        ['{水曜日|すいようび}', 'すいようび', 'suiyōbi', 'Thứ Tư', '水 = nước (Thuỷ)'],
        ['{木曜日|もくようび}', 'もくようび', 'mokuyōbi', 'Thứ Năm', '木 = cây (Mộc)'],
        ['{金曜日|きんようび}', 'きんようび', 'kin\'yōbi', 'Thứ Sáu', '金 = kim loại, vàng (Kim)'],
        ['{土曜日|どようび}', 'どようび', 'doyōbi', 'Thứ Bảy', '土 = đất (Thổ)'],
        ['{日曜日|にちようび}', 'にちようび', 'nichiyōbi', 'Chủ Nhật', '日 = mặt trời (Sunday = Sun day)'],
        ['{何曜日|なんようび}', 'なんようび', 'nan\'yōbi', 'thứ mấy?', ''],
      ],
    },
    {
      t: 'table',
      caption: '～{月|がつ} (tháng) — chỉ cần số + がつ, trừ 3 tháng tô sáng',
      head: ['Tháng', 'Đọc', 'Romaji', 'Tháng', 'Đọc', 'Romaji'],
      rows: [
        ['1{月|がつ}', 'いちがつ', 'ichigatsu', '7{月|がつ}', '==しちがつ==', 'shichigatsu'],
        ['2{月|がつ}', 'にがつ', 'nigatsu', '8{月|がつ}', 'はちがつ', 'hachigatsu'],
        ['3{月|がつ}', 'さんがつ', 'sangatsu', '9{月|がつ}', '==くがつ==', 'kugatsu'],
        ['4{月|がつ}', '==しがつ==', 'shigatsu', '10{月|がつ}', 'じゅうがつ', 'jūgatsu'],
        ['5{月|がつ}', 'ごがつ', 'gogatsu', '11{月|がつ}', 'じゅういちがつ', 'jūichigatsu'],
        ['6{月|がつ}', 'ろくがつ', 'rokugatsu', '12{月|がつ}', 'じゅうにがつ', 'jūnigatsu'],
        ['', '', '', '{何月|なんがつ}', 'なんがつ', 'nangatsu (tháng mấy?)'],
      ],
    },
    {
      t: 'table',
      caption: '～{日|か／にち} (ngày trong tháng) — ngày 1–10, 14, 20, 24 là BẤT QUY TẮC (tô sáng), phải học thuộc',
      head: ['Ngày', 'Đọc (romaji)', 'Ngày', 'Đọc (romaji)'],
      rows: [
        ['1{日|にち}', '==ついたち== (tsuitachi)', '17{日|にち}', 'じゅうしちにち (jūshichinichi)'],
        ['2{日|か}', '==ふつか== (futsuka)', '18{日|にち}', 'じゅうはちにち (jūhachinichi)'],
        ['3{日|か}', '==みっか== (mikka)', '19{日|にち}', 'じゅうくにち (jūkunichi)'],
        ['4{日|か}', '==よっか== (yokka)', '20{日|か}', '==はつか== (hatsuka)'],
        ['5{日|か}', '==いつか== (itsuka)', '21{日|にち}', 'にじゅういちにち (nijūichinichi)'],
        ['6{日|か}', '==むいか== (muika)', '22{日|にち}', 'にじゅうににち (nijūninichi)'],
        ['7{日|か}', '==なのか== (nanoka)', '23{日|にち}', 'にじゅうさんにち (nijūsannichi)'],
        ['8{日|か}', '==ようか== (yōka)', '24{日|か}', '==にじゅうよっか== (nijūyokka)'],
        ['9{日|か}', '==ここのか== (kokonoka)', '25{日|にち}', 'にじゅうごにち (nijūgonichi)'],
        ['10{日|か}', '==とおか== (tōka)', '26{日|にち}', 'にじゅうろくにち (nijūrokunichi)'],
        ['11{日|にち}', 'じゅういちにち (jūichinichi)', '27{日|にち}', 'にじゅうしちにち (nijūshichinichi)'],
        ['12{日|にち}', 'じゅうににち (jūninichi)', '28{日|にち}', 'にじゅうはちにち (nijūhachinichi)'],
        ['13{日|にち}', 'じゅうさんにち (jūsannichi)', '29{日|にち}', 'にじゅうくにち (nijūkunichi)'],
        ['14{日|か}', '==じゅうよっか== (jūyokka)', '30{日|にち}', 'さんじゅうにち (sanjūnichi)'],
        ['15{日|にち}', 'じゅうごにち (jūgonichi)', '31{日|にち}', 'さんじゅういちにち (sanjūichinichi)'],
        ['16{日|にち}', 'じゅうろくにち (jūrokunichi)', '{何日|なんにち}', 'なんにち (nannichi — ngày mấy?)'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo học ngày bất quy tắc',
      items: [
        'Ngày 2–10 là **số đếm kiểu Nhật cổ + か**: ふつ-か (2), みっ-か (3), よっ-か (4), いつ-か (5), むい-か (6), なの-か (7), よう-か (8), ここの-か (9), とお-か (10). Học như học một bài hát.',
        '**14, 24** mượn よっか của ngày 4 → じゅうよっか, にじゅうよっか. **20** = はつか (riêng hoàn toàn). **1** = ついたち (đầu tháng).',
        '17, 27 đọc **しち**; 19, 29 đọc **く** (じゅうくにち, にじゅうくにち) — giống 7 giờ và 9 giờ.',
        'Hỏi ngày: **{何月何日|なんがつなんにち}ですか** (tháng mấy ngày mấy?) hoặc **いつですか** (khi nào?). Nói ngày tháng: **tháng trước, ngày sau**: {5月|ごがつ}{20日|はつか} = ngày 20 tháng 5.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{休|やす}みは{何曜日|なんようび}ですか。——{水曜日|すいようび}です。', ro: 'Yasumi wa nan\'yōbi desu ka. — Suiyōbi desu.', vi: 'Ngày nghỉ là thứ mấy? — Thứ Tư.' },
        { en: 'お{花見|はなみ}は{何月何日|なんがつなんにち}ですか。——{4月|しがつ}{8日|ようか}です。', ro: 'Ohanami wa nangatsu nannichi desu ka. — Shigatsu yōka desu.', vi: 'Buổi ngắm hoa là ngày mấy tháng mấy? — Ngày 8 tháng 4.' },
        { en: 'テストはいつですか。——{9月|くがつ}{14日|じゅうよっか}です。', ro: 'Tesuto wa itsu desu ka. — Kugatsu jūyokka desu.', vi: 'Bài kiểm tra khi nào? — Ngày 14 tháng 9.' },
        { en: '{7月|しちがつ}{1日|ついたち}はパーティーです。', ro: 'Shichigatsu tsuitachi wa pātī desu.', vi: 'Ngày 1 tháng 7 có tiệc.' },
      ],
    },

    /* ── ポイント16 ── */
    { t: 'h', text: 'ポイント 16 — Vます／Vません (động từ lịch sự: làm / không làm)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は V ます。',
          vi: 'N làm V (thói quen, hoặc việc sẽ làm)',
          examples: [
            { en: '{私|わたし}は{毎朝|まいあさ}、{朝|あさ}ご{飯|はん}を{食|た}べます。', ro: 'Watashi wa maiasa, asagohan o tabemasu.', vi: 'Sáng nào tôi cũng ăn sáng.' },
            { en: '{私|わたし}は{夏休|なつやす}み、{国|くに}へ{帰|かえ}ります。', ro: 'Watashi wa natsuyasumi, kuni e kaerimasu.', vi: 'Nghỉ hè tôi (sẽ) về nước.' },
          ],
        },
        {
          formula: 'N は V ません。',
          vi: 'N không làm V',
          examples: [
            { en: '{私|わたし}は{新聞|しんぶん}を{読|よ}みません。', ro: 'Watashi wa shinbun o yomimasen.', vi: 'Tôi không đọc báo.' },
          ],
        },
        {
          formula: 'N は V ますか。 —— はい、V ます。／いいえ、V ません。',
          vi: 'Câu hỏi Có/Không: thêm か. Trả lời bằng CHÍNH động từ đó.',
          examples: [
            { en: 'アンナさんは{毎日|まいにち}、{朝|あさ}ご{飯|はん}を{食|た}べますか。——はい、{食|た}べます。／いいえ、{食|た}べません。', ro: 'Anna-san wa mainichi, asagohan o tabemasu ka. — Hai, tabemasu. / Iie, tabemasen.', vi: 'Anna hằng ngày có ăn sáng không? — Có, tôi có ăn. / Không, tôi không ăn.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**～ます** là đuôi động từ **lịch sự**, dùng với thầy cô, người mới quen, và **trong phòng thi**. Thể ます ở hiện tại diễn tả **(1) thói quen** ({毎日|まいにち}{勉強|べんきょう}します — ngày nào cũng học) và **(2) việc sẽ làm** ({夏休|なつやす}み、{国|くに}へ{帰|かえ}ります — nghỉ hè sẽ về nước). Động từ **không đổi theo ngôi** (tôi/anh/chị đều là {食|た}べます) và luôn đứng **cuối câu**.',
    },
    {
      t: 'table',
      caption: 'Bảng chia 14 động từ của bài (表 動詞). Bài 3 dùng 2 cột đầu; 2 cột quá khứ là ポイント 37 (Bài 5) — xem trước cho biết.',
      head: ['Nhóm', 'Khẳng định (hiện tại/tương lai)', 'Phủ định', 'Quá khứ khẳng định', 'Quá khứ phủ định'],
      rows: [
        ['1', '{行|い}きます (ikimasu) — đi', '{行|い}きません (ikimasen)', '{行|い}きました (ikimashita)', '{行|い}きませんでした (ikimasen deshita)'],
        ['1', '{帰|かえ}ります (kaerimasu) — về', '{帰|かえ}りません (kaerimasen)', '{帰|かえ}りました (kaerimashita)', '{帰|かえ}りませんでした (kaerimasen deshita)'],
        ['1', '{飲|の}みます (nomimasu) — uống', '{飲|の}みません (nomimasen)', '{飲|の}みました (nomimashita)', '{飲|の}みませんでした (nomimasen deshita)'],
        ['1', '{買|か}います (kaimasu) — mua', '{買|か}いません (kaimasen)', '{買|か}いました (kaimashita)', '{買|か}いませんでした (kaimasen deshita)'],
        ['1', '{聞|き}きます (kikimasu) — nghe', '{聞|き}きません (kikimasen)', '{聞|き}きました (kikimashita)', '{聞|き}きませんでした (kikimasen deshita)'],
        ['1', '{働|はたら}きます (hatarakimasu) — làm việc', '{働|はたら}きません (hatarakimasen)', '{働|はたら}きました (hatarakimashita)', '{働|はたら}きませんでした (hatarakimasen deshita)'],
        ['1', '{読|よ}みます (yomimasu) — đọc', '{読|よ}みません (yomimasen)', '{読|よ}みました (yomimashita)', '{読|よ}みませんでした (yomimasen deshita)'],
        ['2', '{食|た}べます (tabemasu) — ăn', '{食|た}べません (tabemasen)', '{食|た}べました (tabemashita)', '{食|た}べませんでした (tabemasen deshita)'],
        ['2', '{見|み}ます (mimasu) — xem', '{見|み}ません (mimasen)', '{見|み}ました (mimashita)', '{見|み}ませんでした (mimasen deshita)'],
        ['2', '{起|お}きます (okimasu) — dậy', '{起|お}きません (okimasen)', '{起|お}きました (okimashita)', '{起|お}きませんでした (okimasen deshita)'],
        ['2', '{寝|ね}ます (nemasu) — ngủ', '{寝|ね}ません (nemasen)', '{寝|ね}ました (nemashita)', '{寝|ね}ませんでした (nemasen deshita)'],
        ['3', 'します (shimasu) — làm', 'しません (shimasen)', 'しました (shimashita)', 'しませんでした (shimasen deshita)'],
        ['3', '{勉強|べんきょう}します (benkyō shimasu) — học', '{勉強|べんきょう}しません (benkyō shimasen)', '{勉強|べんきょう}しました (benkyō shimashita)', '{勉強|べんきょう}しませんでした (benkyō shimasen deshita)'],
        ['3', '{来|き}ます (kimasu) — đến', '{来|き}ません (kimasen)', '{来|き}ました (kimashita)', '{来|き}ませんでした (kimasen deshita)'],
      ],
    },
    {
      t: 'note',
      title: 'Quy tắc chia — chỉ đổi đuôi',
      items: [
        '**～ます → ～ません** (không làm): {食|た}べ**ます** → {食|た}べ**ません**. Phần trước ます giữ nguyên, với MỌI động từ.',
        '**～ます → ～ました** (đã làm), **～ません → ～ませんでした** (đã không làm) — dùng từ Bài 5.',
        '**Nhóm 1**: âm trước ます thuộc hàng **い** (き・り・み・い): いき・かえり・のみ・かい・きき・はたらき・よみ + ます.',
        '**Nhóm 2**: phần lớn âm trước ます thuộc hàng **え** (たべ・ね), và một số động từ hàng い phải học thuộc (み・おき). **Nhóm 3**: chỉ có **します**, **{来|き}ます** và **danh từ + します** ({勉強|べんきょう}します).',
        '{帰|かえ}ります là nhóm 1 (thể từ điển {帰|かえ}る trông giống nhóm 2 nhưng không phải) — bài 3 chưa cần, nhưng sau này sẽ gặp lại.',
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — tự nói câu hỏi–đáp mới',
      head: ['Khi nào', 'Cái gì を', 'Hỏi: ～ますか', 'Có', 'Không'],
      rows: [
        ['{毎日|まいにち}', '{日本語|にほんご}を', '{勉強|べんきょう}しますか', 'はい、{勉強|べんきょう}します', 'いいえ、{勉強|べんきょう}しません'],
        ['{毎朝|まいあさ}', '{新聞|しんぶん}を', '{読|よ}みますか', 'はい、{読|よ}みます', 'いいえ、{読|よ}みません'],
        ['{毎朝|まいあさ}', '{牛乳|ぎゅうにゅう}を', '{飲|の}みますか', 'はい、{飲|の}みます', 'いいえ、{飲|の}みません'],
        ['{毎晩|まいばん}', 'テレビを', '{見|み}ますか', 'はい、{見|み}ます', 'いいえ、{見|み}ません'],
        ['{毎日|まいにち}', 'インターネットを', 'しますか', 'はい、します', 'いいえ、しません'],
        ['{夜|よる}', 'CDを', '{聞|き}きますか', 'はい、{聞|き}きます', 'いいえ、{聞|き}きません'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Hỏi bằng động từ thì trả lời bằng động từ: ~~はい、そうです。~~ → **はい、{飲|の}みます。** (はい、そうです chỉ dùng cho câu ～は N ですか).',
        'Quên はい／いいえ: đề thi JPD113 **trừ điểm** nếu câu Có/Không không có はい／いいえ ở đầu.',
        'Trả lời cụt ~~{飲|の}みません。~~ vẫn đúng, nhưng khi thi nên nói đủ: **いいえ、{飲|の}みません。お{茶|ちゃ}を{飲|の}みます。** — thêm một câu cho thấy bạn nói được.',
      ],
    },

    /* ── ポイント17 ── */
    { t: 'h', text: 'ポイント 17 — N（nơi chốn）へ {行|い}きます／{来|き}ます／{帰|かえ}ります' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（nơi）へ いきます／きます／かえります。',
          vi: 'Đi / đến / về (hướng tới) N. へ chỉ HƯỚNG di chuyển, đọc là "e".',
          examples: [
            { en: '{私|わたし}は{日曜日|にちようび}、{図書館|としょかん}へ{行|い}きます。', ro: 'Watashi wa nichiyōbi, toshokan e ikimasu.', vi: 'Chủ Nhật tôi đi thư viện.' },
            { en: '{私|わたし}は{冬休|ふゆやす}み、{国|くに}へ{帰|かえ}ります。', ro: 'Watashi wa fuyuyasumi, kuni e kaerimasu.', vi: 'Nghỉ đông tôi về nước.' },
            { en: 'パクさんは{8時|はちじ}に{学校|がっこう}へ{来|き}ます。', ro: 'Paku-san wa hachiji ni gakkō e kimasu.', vi: 'Park đến trường lúc 8 giờ.' },
          ],
        },
        {
          formula: 'どこへ いきますか。 —— N へ いきます。',
          vi: 'Hỏi nơi đến: どこ (đâu) + へ.',
          examples: [
            { en: 'ゴールデンウイーク、どこへ{行|い}きますか。——{海|うみ}へ{行|い}きます。', ro: 'Gōruden uīku, doko e ikimasu ka. — Umi e ikimasu.', vi: 'Tuần lễ Vàng bạn đi đâu? — Tôi đi biển.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '{行|い}きます・{来|き}ます・{帰|かえ}ります khác nhau thế nào',
      head: ['Động từ', 'Nghĩa', 'Dùng khi', 'Ví dụ'],
      rows: [
        ['{行|い}きます (ikimasu)', 'đi', 'rời chỗ mình đang ở, đến nơi khác', '{銀行|ぎんこう}へ{行|い}きます。'],
        ['{来|き}ます (kimasu)', 'đến', 'đến CHỖ người nói đang ở (đang ở trường thì nói {学校|がっこう}へ{来|き}ます)', '{毎朝|まいあさ}{8時|はちじ}に{学校|がっこう}へ{来|き}ます。'],
        ['{帰|かえ}ります (kaerimasu)', 'về', 'về NHÀ mình, về NƯỚC mình', 'うちへ{帰|かえ}ります。{国|くに}へ{帰|かえ}ります。'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — [nơi] へ [động từ]',
      head: ['Khi nào', 'Nơi へ', 'Động từ'],
      rows: [
        ['{午後|ごご}、', '{銀行|ぎんこう}・{郵便局|ゆうびんきょく}・{病院|びょういん}・{図書館|としょかん}へ', '{行|い}きます (ikimasu)'],
        ['{日曜日|にちようび}、', '{公園|こうえん}・{体育館|たいいくかん}・コンビニへ', '{行|い}きます'],
        ['{夏休|なつやす}み、', '{海|うみ}・{北海道|ほっかいどう}・{京都|きょうと}へ', '{行|い}きます'],
        ['{毎朝|まいあさ}、', '{学校|がっこう}・{会社|かいしゃ}へ', '{来|き}ます／{行|い}きます'],
        ['{6時|ろくじ}に', 'うちへ', '{帰|かえ}ります (kaerimasu)'],
        ['{春休|はるやす}み、', '{国|くに}へ', '{帰|かえ}ります'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'へ viết là chữ へ (he) nhưng **đọc là え (e)** khi làm trợ từ: {学校|がっこう}へ = gakkō **e**. Đọc "he" là sai phát âm — phần Reading của đề thi trừ điểm.',
        'Nhầm trợ từ: ~~{図書館|としょかん}を{行|い}きます~~, ~~{図書館|としょかん}で{行|い}きます~~ → **{図書館|としょかん}へ{行|い}きます**.',
        'Về nhà mình dùng {帰|かえ}ります: ~~うちへ{行|い}きます~~ → **うちへ{帰|かえ}ります**.',
        'Đề thi hay hỏi **どこに{行|い}きますか** (dùng に thay へ — cũng đúng). Bạn trả lời **～へ{行|い}きます** hay **～に{行|い}きます** đều được.',
      ],
    },

    /* ── ポイント18 ── */
    { t: 'h', text: 'ポイント 18 — N を V ます (tân ngữ: ăn CÁI GÌ, xem CÁI GÌ)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N を V ます。',
          vi: 'を đánh dấu vật chịu tác động của động từ. Đọc là "o".',
          examples: [
            { en: '{私|わたし}は{毎朝|まいあさ}、コーヒーを{飲|の}みます。', ro: 'Watashi wa maiasa, kōhī o nomimasu.', vi: 'Sáng nào tôi cũng uống cà phê.' },
            { en: '{夜|よる}、DVDを{見|み}ます。', ro: 'Yoru, dībuidī o mimasu.', vi: 'Buổi tối tôi xem DVD.' },
          ],
        },
        {
          formula: 'なにを V ますか。 —— N を V ます。',
          vi: 'Hỏi "làm cái gì": {何|なに} (nani) + を.',
          examples: [
            { en: '{何|なに}を{飲|の}みますか。——{牛乳|ぎゅうにゅう}を{飲|の}みます。', ro: 'Nani o nomimasu ka. — Gyūnyū o nomimasu.', vi: 'Bạn uống gì? — Tôi uống sữa.' },
            { en: '{休|やす}みの{日|ひ}、{何|なに}をしますか。——テニスをします。', ro: 'Yasumi no hi, nani o shimasu ka. — Tenisu o shimasu.', vi: 'Ngày nghỉ bạn làm gì? — Tôi chơi tennis.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — động từ nào đi với tân ngữ nào',
      head: ['Động từ', 'Những thứ đặt trước を'],
      rows: [
        ['{食|た}べます (tabemasu) — ăn', 'パン・{果物|くだもの}・サラダ・チーズ・おすし・お{弁当|べんとう}・{朝|あさ}ご{飯|はん}・{昼|ひる}ごはん'],
        ['{飲|の}みます (nomimasu) — uống', 'コーヒー・{牛乳|ぎゅうにゅう}・お{酒|さけ}・お{茶|ちゃ}・ジュース'],
        ['{見|み}ます (mimasu) — xem', 'テレビ・DVD・{花火|はなび}・{桜|さくら}・お{祭|まつ}り・スケジュール'],
        ['{読|よ}みます (yomimasu) — đọc', '{新聞|しんぶん}・{本|ほん}'],
        ['{聞|き}きます (kikimasu) — nghe', 'CD・{音楽|おんがく}'],
        ['{買|か}います (kaimasu) — mua', 'お{弁当|べんとう}・{牛乳|ぎゅうにゅう}・チーズ・{新聞|しんぶん}'],
        ['します (shimasu) — làm, chơi', 'スキー・テニス・アルバイト・インターネット・バーベキュー・ホームステイ・パーティー'],
        ['{勉強|べんきょう}します — học', '{日本語|にほんご}・{英語|えいご}'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'を viết là を (wo) nhưng **đọc là お (o)**: コーヒー**を** = kōhī **o**.',
        '{行|い}きます／{来|き}ます／{帰|かえ}ります / {起|お}きます／{寝|ね}ます / {働|はたら}きます **không có を** (không có "vật" chịu tác động): ~~{学校|がっこう}を{行|い}きます~~.',
        '**{勉強|べんきょう}します** = "học"; muốn nói học CÁI GÌ thì thêm N を: **{日本語|にほんご}を{勉強|べんきょう}します**. Không nói ~~{日本語|にほんご}を{勉強|べんきょう}をします~~ (hai を trong một câu).',
        'Người Việt hay bỏ を vì tiếng Việt không có: ~~テレビ{見|み}ます~~ → **テレビを{見|み}ます** (thi nói bỏ trợ từ = trừ 2 điểm).',
      ],
    },

    /* ── ポイント19 ── */
    { t: 'h', text: 'ポイント 19 — N（thời điểm）に V ます (làm lúc mấy giờ, ngày nào)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（giờ / ngày）に V ます。',
          vi: 'に đánh dấu MỐC thời gian hành động xảy ra.',
          examples: [
            { en: '{私|わたし}は{8時|はちじ}に{起|お}きます。', ro: 'Watashi wa hachiji ni okimasu.', vi: 'Tôi dậy lúc 8 giờ.' },
            { en: '{毎晩|まいばん}、{12時|じゅうにじ}に{寝|ね}ます。', ro: 'Maiban, jūniji ni nemasu.', vi: 'Tối nào tôi cũng ngủ lúc 12 giờ.' },
            { en: '{8月|はちがつ}{6日|むいか}に{京都|きょうと}へ{行|い}きます。', ro: 'Hachigatsu muika ni Kyōto e ikimasu.', vi: 'Ngày 6 tháng 8 tôi đi Kyoto.' },
          ],
        },
        {
          formula: 'なんじに V ますか。 —— ～じに V ます。',
          vi: 'Hỏi "lúc mấy giờ".',
          examples: [
            { en: '{毎朝|まいあさ}、{何時|なんじ}に{起|お}きますか。——{6時半|ろくじはん}に{起|お}きます。', ro: 'Maiasa, nanji ni okimasu ka. — Rokuji han ni okimasu.', vi: 'Sáng nào bạn cũng dậy lúc mấy giờ? — Tôi dậy lúc 6 rưỡi.' },
            { en: '{何時|なんじ}にうちへ{帰|かえ}りますか。——{5時|ごじ}に{帰|かえ}ります。', ro: 'Nanji ni uchi e kaerimasu ka. — Goji ni kaerimasu.', vi: 'Mấy giờ bạn về nhà? — 5 giờ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Khi nào dùng に? (hộp tham khảo của sách, p.271)',
      head: ['Loại từ thời gian', 'に', 'Ví dụ'],
      rows: [
        ['Giờ, phút, ngày tháng có SỐ', '**bắt buộc** に', '{7時|しちじ}**に**{起|お}きます。{4月|しがつ}{3日|みっか}**に**{国|くに}へ{帰|かえ}ります。'],
        ['Thứ, kỳ nghỉ, cuối tuần: ～{曜日|ようび}・{夏休|なつやす}み・{週末|しゅうまつ}・ゴールデンウイーク', '**tuỳ** — có hay không đều được', '{日曜日|にちようび}（に）{公園|こうえん}へ{行|い}きます。{夏休|なつやす}み（に）{北海道|ほっかいどう}へ{行|い}きます。'],
        ['Từ tương đối, lặp lại: {今|いま}・{毎日|まいにち}・{毎朝|まいあさ}・{毎晩|まいばん}・{朝|あさ}・{昼|ひる}・{夜|よる}・{午前|ごぜん}・{午後|ごご}・いつ', '**KHÔNG** dùng に', '{毎日|まいにち}{学校|がっこう}へ{行|い}きます。~~{毎日|まいにち}に~~'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~{私|わたし}は{毎日|まいにち}に{学校|がっこう}へ{行|い}きます。~~ → **{私|わたし}は{毎日|まいにち}{学校|がっこう}へ{行|い}きます。** ({毎日|まいにち} không có に — sách ghi đúng ví dụ sai này ở p.271).',
        '~~いつに{行|い}きますか~~ → **いつ{行|い}きますか**.',
        'Nhưng **{何時|なんじ}に** thì PHẢI có に: ~~{何時|なんじ}{起|お}きますか~~ → **{何時|なんじ}に{起|お}きますか**.',
        'Kết hợp được: **{毎朝|まいあさ}{7時|しちじ}に{起|お}きます** ({毎朝|まいあさ} không に, {7時|しちじ} có に).',
      ],
    },

    /* ── ポイント20 ── */
    { t: 'h', text: 'ポイント 20 — N（nơi chốn）で V ます (làm việc gì Ở ĐÂU)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（nơi）で V ます。',
          vi: 'で đánh dấu NƠI hành động diễn ra.',
          examples: [
            { en: '{私|わたし}は{北海道|ほっかいどう}でスキーをします。', ro: 'Watashi wa Hokkaidō de sukī o shimasu.', vi: 'Tôi trượt tuyết ở Hokkaido.' },
            { en: 'コンビニでお{弁当|べんとう}を{買|か}います。', ro: 'Konbini de obentō o kaimasu.', vi: 'Tôi mua cơm hộp ở cửa hàng tiện lợi.' },
            { en: '{会社|かいしゃ}で{働|はたら}きます。', ro: 'Kaisha de hatarakimasu.', vi: 'Tôi làm việc ở công ty.' },
          ],
        },
        {
          formula: 'どこで V ますか。 —— N で V ます。',
          vi: 'Hỏi "làm ở đâu": どこ + で.',
          examples: [
            { en: 'どこで{勉強|べんきょう}しますか。——{図書館|としょかん}で{勉強|べんきょう}します。', ro: 'Doko de benkyō shimasu ka. — Toshokan de benkyō shimasu.', vi: 'Bạn học ở đâu? — Tôi học ở thư viện.' },
            { en: '{図書館|としょかん}で{何|なに}をしますか。——{本|ほん}を{読|よ}みます。', ro: 'Toshokan de nani o shimasu ka. — Hon o yomimasu.', vi: 'Bạn làm gì ở thư viện? — Tôi đọc sách.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'へ hay で? — đi TỚI một nơi vs. LÀM gì Ở một nơi',
      head: ['', 'へ (e) — hướng tới', 'で (de) — nơi diễn ra'],
      rows: [
        ['Đi kèm động từ', '{行|い}きます・{来|き}ます・{帰|かえ}ります', '{食|た}べます・{飲|の}みます・{見|み}ます・{読|よ}みます・{買|か}います・{働|はたら}きます・{勉強|べんきょう}します・します…'],
        ['Ví dụ', '{図書館|としょかん}**へ**{行|い}きます。', '{図書館|としょかん}**で**{本|ほん}を{読|よ}みます。'],
        ['Ví dụ', '{公園|こうえん}**へ**{行|い}きます。', '{公園|こうえん}**で**バーベキューをします。'],
        ['Hai câu nối nhau (rất hay dùng khi thi)', '{海|うみ}**へ**{行|い}きます。', '{海|うみ}**で**{花火|はなび}を{見|み}ます。'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — [nơi] で [cái gì] を [động từ]',
      head: ['Nơi で', 'Cái gì を + động từ'],
      rows: [
        ['{図書館|としょかん}で', '{本|ほん}を{読|よ}みます・{日本語|にほんご}を{勉強|べんきょう}します'],
        ['{体育館|たいいくかん}で', 'テニスをします・サッカーをします'],
        ['コンビニで', '{牛乳|ぎゅうにゅう}を{買|か}います・アルバイトをします'],
        ['うちで', 'テレビを{見|み}ます・インターネットをします・CDを{聞|き}きます'],
        ['{公園|こうえん}で', '{桜|さくら}を{見|み}ます・お{弁当|べんとう}を{食|た}べます'],
        ['{会社|かいしゃ}で', '{働|はたら}きます (không có を)'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~{会社|かいしゃ}へ{働|はたら}きます~~ → **{会社|かいしゃ}で{働|はたら}きます**. ~~{図書館|としょかん}で{行|い}きます~~ → **{図書館|としょかん}へ{行|い}きます**.',
        'Tiếng Việt nói "ở" cho cả hai (ở nhà / đi về nhà) nên dễ lẫn: tự hỏi **"có di chuyển tới đó không?"** — có → へ; đang làm việc tại đó → で.',
        'Sai trợ từ trong phần Talking = **trừ 2 điểm mỗi lần**. へ/で/に là ba trợ từ bị trừ nhiều nhất ở Lesson 3.',
      ],
    },

    /* ── ポイント21 ── */
    { t: 'h', text: 'ポイント 21 — N（giờ・thứ・ngày）から N まで (từ … đến …)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は ～ から ～ まで です。',
          vi: 'N (mở cửa / diễn ra) từ A đến B.',
          examples: [
            { en: 'さくら{郵便局|ゆうびんきょく}は{午前|ごぜん}{9時|くじ}から{午後|ごご}{5時|ごじ}までです。', ro: 'Sakura yūbinkyoku wa gozen kuji kara gogo goji made desu.', vi: 'Bưu điện Sakura mở từ 9 giờ sáng đến 5 giờ chiều.' },
            { en: '{夏休|なつやす}みは{7月|しちがつ}{20日|はつか}から{8月|はちがつ}{31日|さんじゅういちにち}までです。', ro: 'Natsuyasumi wa shichigatsu hatsuka kara hachigatsu sanjūichinichi made desu.', vi: 'Nghỉ hè từ ngày 20/7 đến ngày 31/8.' },
          ],
        },
        {
          formula: '～ から ～ まで V ます。',
          vi: 'Làm V từ A đến B.',
          examples: [
            { en: '{私|わたし}は{1時|いちじ}から{3時|さんじ}まで{勉強|べんきょう}します。', ro: 'Watashi wa ichiji kara sanji made benkyō shimasu.', vi: 'Tôi học từ 1 giờ đến 3 giờ.' },
            { en: '{月曜日|げつようび}から{金曜日|きんようび}まで{働|はたら}きます。', ro: 'Getsuyōbi kara kin\'yōbi made hatarakimasu.', vi: 'Tôi làm việc từ thứ Hai đến thứ Sáu.' },
          ],
        },
        {
          formula: 'なんじからなんじまでですか。／なんようびからなんようびまでですか。／いつからいつまでですか。',
          vi: 'Ba câu hỏi chắc chắn gặp trong đề thi Lesson 3.',
          examples: [
            { en: '{病院|びょういん}は{何時|なんじ}から{何時|なんじ}までですか。——{9時半|くじはん}から{3時|さんじ}までです。', ro: 'Byōin wa nanji kara nanji made desu ka. — Kuji han kara sanji made desu.', vi: 'Bệnh viện mở từ mấy giờ đến mấy giờ? — Từ 9 rưỡi đến 3 giờ.' },
            { en: '{授業|じゅぎょう}は{何曜日|なんようび}から{何曜日|なんようび}までですか。——{月曜日|げつようび}から{金曜日|きんようび}までです。', ro: 'Jugyō wa nan\'yōbi kara nan\'yōbi made desu ka. — Getsuyōbi kara kin\'yōbi made desu.', vi: 'Có tiết học từ thứ mấy đến thứ mấy? — Từ thứ Hai đến thứ Sáu.' },
            { en: 'テストはいつからいつまでですか。——{2月|にがつ}{14日|じゅうよっか}から{15日|じゅうごにち}までです。', ro: 'Tesuto wa itsu kara itsu made desu ka. — Nigatsu jūyokka kara jūgonichi made desu.', vi: 'Kỳ thi từ bao giờ đến bao giờ? — Từ 14 đến 15 tháng 2.' },
          ],
        },
        {
          formula: 'N は ～ から です。／ N は ～ まで です。',
          vi: 'Chỉ nói một đầu cũng được: "từ A" hoặc "đến B".',
          examples: [
            { en: '{銀行|ぎんこう}は{3時|さんじ}までです。', ro: 'Ginkō wa sanji made desu.', vi: 'Ngân hàng làm đến 3 giờ.' },
            { en: 'パーティーは{6時|ろくじ}からです。', ro: 'Pātī wa rokuji kara desu.', vi: 'Tiệc bắt đầu từ 6 giờ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — hỏi giờ mở cửa và ngày nghỉ (số liệu mới để luyện)',
      head: ['Nơi', 'Giờ', 'Ngày nghỉ', 'Câu trả lời mẫu'],
      rows: [
        ['ひまわり{図書館|としょかん}', '9:00〜19:00', '{月曜日|げつようび}', '{9時|くじ}から{7時|しちじ}までです。{休|やす}みは{月曜日|げつようび}です。'],
        ['さくら{病院|びょういん}', '8:30〜17:00', '{日曜日|にちようび}', '{8時半|はちじはん}から{5時|ごじ}までです。{休|やす}みは{日曜日|にちようび}です。'],
        ['みどり{体育館|たいいくかん}', '6:00〜22:00', '{木曜日|もくようび}', '{午前|ごぜん}{6時|ろくじ}から{午後|ごご}{10時|じゅうじ}までです。{休|やす}みは{木曜日|もくようび}です。'],
        ['あおぞら{銀行|ぎんこう}', '9:00〜15:00', '{土曜日|どようび}・{日曜日|にちようび}', '{9時|くじ}から{3時|さんじ}までです。{休|やす}みは{土曜日|どようび}と{日曜日|にちようび}です。'],
        ['つばき{郵便局|ゆうびんきょく}', '9:00〜17:00', '{土曜日|どようび}・{日曜日|にちようび}', '{月曜日|げつようび}から{金曜日|きんようび}までです。{9時|くじ}から{5時|ごじ}までです。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~{9時|くじ}にから~~ → **{9時|くじ}から**: から／まで đã chỉ thời điểm, không thêm に.',
        'Thứ tự luôn là **から trước, まで sau**: ~~{5時|ごじ}まで{9時|くじ}から~~.',
        'Nghe {休|やす}みはいつですか thì trả lời **ngày/thứ**: {火曜日|かようび}です (không trả lời giờ).',
        'Giờ đóng cửa sau 12 giờ trưa: nói **{午後|ごご}{5時|ごじ}** hoặc chỉ **{5時|ごじ}** (người nghe tự hiểu). Không nói ~~{17時|じゅうしちじ}~~ khi trả lời hội thoại hằng ngày (giờ 24 tiếng chỉ thấy trên bảng, nhà ga).',
      ],
    },

    /* ── ポイント22 ── */
    { t: 'h', text: 'ポイント 22 — N1 や N2 など (… và … v.v.)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 や N2 （など）を V ます。',
          vi: 'Liệt kê VÀI thứ tiêu biểu, ngầm hiểu còn thứ khác. など = "v.v." (có thể bỏ).',
          examples: [
            { en: '{私|わたし}は{朝|あさ}、パンやサラダなどを{食|た}べます。', ro: 'Watashi wa asa, pan ya sarada nado o tabemasu.', vi: 'Buổi sáng tôi ăn bánh mì, salad, v.v.' },
            { en: 'コンビニで{牛乳|ぎゅうにゅう}やチーズを{買|か}います。', ro: 'Konbini de gyūnyū ya chīzu o kaimasu.', vi: 'Tôi mua sữa, phô mai (và vài thứ khác) ở cửa hàng tiện lợi.' },
          ],
        },
        {
          formula: 'なにを V ますか。 —— N1 や N2 などを V ます。',
          vi: 'Câu trả lời tự nhiên khi được hỏi ăn / uống / mua gì.',
          examples: [
            { en: '{朝|あさ}、{何|なに}を{食|た}べますか。——{卵|たまご}や{果物|くだもの}などを{食|た}べます。', ro: 'Asa, nani o tabemasu ka. — Tamago ya kudamono nado o tabemasu.', vi: 'Buổi sáng bạn ăn gì? — Tôi ăn trứng, hoa quả, v.v.' },
            { en: '{夜|よる}、{何|なに}をしますか。——テレビやインターネットなどをします。', ro: 'Yoru, nani o shimasu ka. — Terebi ya intānetto nado o shimasu.', vi: 'Buổi tối bạn làm gì? — Tôi xem TV, lên mạng, v.v.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'や khác と (ポイント 5, Bài 1) thế nào',
      head: ['', 'と (to)', 'や (ya) … など'],
      rows: [
        ['Ý nghĩa', 'liệt kê ĐỦ, chỉ có những thứ này', 'liệt kê VÍ DỤ, còn thứ khác'],
        ['Ví dụ', 'パン**と**{牛乳|ぎゅうにゅう}を{食|た}べます。(chỉ bánh mì và sữa)', 'パン**や**{牛乳|ぎゅうにゅう}**など**を…(bánh mì, sữa và vài thứ nữa)'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'や／と chỉ nối **danh từ**, không nối động từ: ~~{食|た}べますや{飲|の}みます~~ → hai câu riêng: **パンを{食|た}べます。{牛乳|ぎゅうにゅう}を{飲|の}みます。**',
        'など đứng **trước** を: ~~パンやサラダをなど~~ → **パンやサラダなどを**.',
      ],
    },

    /* ── ポイント23 ── */
    { t: 'h', text: 'ポイント 23 — {何|なに}も／どこ（へ）も V ません (không … gì cả / không đi đâu cả)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'なにも V ません。',
          vi: 'Không (ăn / uống / làm) gì cả. を biến mất.',
          examples: [
            { en: 'パクさんは{朝|あさ}、{何|なに}を{食|た}べますか。——{私|わたし}は{朝|あさ}、{何|なに}も{食|た}べません。', ro: 'Paku-san wa asa, nani o tabemasu ka. — Watashi wa asa, nanimo tabemasen.', vi: 'Park buổi sáng ăn gì? — Buổi sáng tôi không ăn gì cả.' },
            { en: '{日曜日|にちようび}、{何|なに}もしません。', ro: 'Nichiyōbi, nanimo shimasen.', vi: 'Chủ Nhật tôi không làm gì cả.' },
          ],
        },
        {
          formula: 'どこ（へ）も いきません。',
          vi: 'Không đi đâu cả. へ có thể bỏ: どこも.',
          examples: [
            { en: 'ナタポンさんは{午後|ごご}、どこへ{行|い}きますか。——どこへも{行|い}きません。', ro: 'Natapon-san wa gogo, doko e ikimasu ka. — Doko e mo ikimasen.', vi: 'Nattapon chiều nay đi đâu? — Tôi không đi đâu cả.' },
            { en: '{週末|しゅうまつ}、どこも{行|い}きません。うちでテレビを{見|み}ます。', ro: 'Shūmatsu, doko mo ikimasen. Uchi de terebi o mimasu.', vi: 'Cuối tuần tôi không đi đâu. Tôi xem TV ở nhà.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Câu hỏi → câu trả lời phủ định hoàn toàn',
      head: ['Câu hỏi', 'Trả lời "không gì / không đâu"'],
      rows: [
        ['{何|なに}を{食|た}べますか。(Nani o tabemasu ka.)', '{何|なに}も{食|た}べません。(Nanimo tabemasen.)'],
        ['{何|なに}を{飲|の}みますか。(Nani o nomimasu ka.)', '{何|なに}も{飲|の}みません。(Nanimo nomimasen.)'],
        ['{何|なに}を{買|か}いますか。(Nani o kaimasu ka.)', '{何|なに}も{買|か}いません。(Nanimo kaimasen.)'],
        ['{何|なに}をしますか。(Nani o shimasu ka.)', '{何|なに}もしません。(Nanimo shimasen.)'],
        ['どこへ{行|い}きますか。(Doko e ikimasu ka.)', 'どこへも{行|い}きません。(Doko e mo ikimasen.)'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '{何|なに}も／どこへも **chỉ đi với động từ phủ định**: ~~{何|なに}も{食|た}べます~~ (sai hoàn toàn nghĩa).',
        'Bỏ を: ~~{何|なに}もを{食|た}べません~~ → **{何|なに}も{食|た}べません**. Nhưng へ thì giữ được: どこ**へ**も.',
        'Đọc {何|なに}も là **なにも** (nanimo), không phải ~~なんも~~.',
        'Nói xong câu phủ định, thêm một câu nói bạn LÀM gì — câu trả lời thi sẽ trọn vẹn: **どこへも{行|い}きません。うちで{本|ほん}を{読|よ}みます。**',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — trật tự câu và 8 trợ từ của bài 3' },
    {
      t: 'table',
      caption: 'Khung câu động từ (thứ tự thường gặp; động từ LUÔN cuối câu)',
      head: ['Ai は', 'Khi nào (に)', 'Ở đâu で／Đi đâu へ', 'Cái gì を', 'Động từ'],
      rows: [
        ['{私|わたし}は', '{毎朝|まいあさ}', '', 'コーヒーを', '{飲|の}みます。'],
        ['{私|わたし}は', '{7時|しちじ}に', '', '', '{起|お}きます。'],
        ['{私|わたし}は', '{日曜日|にちようび}', '{図書館|としょかん}へ', '', '{行|い}きます。'],
        ['{私|わたし}は', '{土曜日|どようび}', '{図書館|としょかん}で', '{日本語|にほんご}を', '{勉強|べんきょう}します。'],
        ['{私|わたし}は', '{4時|よじ}から{8時|はちじ}まで', 'コンビニで', '', '{働|はたら}きます。'],
      ],
    },
    {
      t: 'table',
      caption: 'Trợ từ — một bảng để ôn trước khi thi',
      head: ['Trợ từ', 'Đọc', 'Chức năng', 'Ví dụ'],
      rows: [
        ['へ', 'e', 'hướng đi tới (ポイント 17)', '{学校|がっこう}へ{行|い}きます'],
        ['を', 'o', 'vật chịu tác động (ポイント 18)', 'パンを{食|た}べます'],
        ['に', 'ni', 'mốc thời gian (ポイント 19)', '{6時|ろくじ}に{起|お}きます'],
        ['で', 'de', 'nơi hành động diễn ra (ポイント 20)', '{図書館|としょかん}で{勉強|べんきょう}します'],
        ['から／まで', 'kara / made', 'từ … đến … (ポイント 21)', '{9時|くじ}から{5時|ごじ}まで'],
        ['や…など', 'ya … nado', 'liệt kê ví dụ (ポイント 22)', 'パンやサラダなど'],
        ['も', 'mo', '+ ません: không … gì/đâu cả (ポイント 23)', '{何|なに}も{食|た}べません'],
      ],
    },

    {
      t: 'build',
      id: 'b3-np-ghep',
      title: 'Ghép câu — dựng câu đúng thứ tự (có mảnh gây nhiễu)',
      items: [
        { vi: 'Sáng nào tôi cũng dậy lúc 7 giờ.', chips: ['{私|わたし}は', '{毎朝|まいあさ}', '{7時|しちじ}に', '{起|お}きます', 'を'], answer: ['{私|わたし}は', '{毎朝|まいあさ}', '{7時|しちじ}に', '{起|お}きます'], ro: 'Watashi wa maiasa shichiji ni okimasu.' },
        { vi: 'Chủ Nhật tôi đi thư viện.', chips: ['{日曜日|にちようび}', '{図書館|としょかん}', 'へ', '{行|い}きます', 'で'], answer: ['{日曜日|にちようび}', '{図書館|としょかん}', 'へ', '{行|い}きます'], ro: 'Nichiyōbi toshokan e ikimasu.' },
        { vi: 'Tôi học tiếng Nhật ở thư viện.', chips: ['{図書館|としょかん}', 'で', '{日本語|にほんご}', 'を', '{勉強|べんきょう}します', 'へ'], answer: ['{図書館|としょかん}', 'で', '{日本語|にほんご}', 'を', '{勉強|べんきょう}します'], alt: [['{日本語|にほんご}', 'を', '{図書館|としょかん}', 'で', '{勉強|べんきょう}します']], ro: 'Toshokan de nihongo o benkyō shimasu.' },
        { vi: 'Ngân hàng mở từ 9 giờ đến 3 giờ.', chips: ['{銀行|ぎんこう}は', '{9時|くじ}', 'から', '{3時|さんじ}', 'まで', 'です', 'に'], answer: ['{銀行|ぎんこう}は', '{9時|くじ}', 'から', '{3時|さんじ}', 'まで', 'です'], ro: 'Ginkō wa kuji kara sanji made desu.' },
        { vi: 'Tôi làm việc từ thứ Hai đến thứ Sáu.', chips: ['{月曜日|げつようび}', 'から', '{金曜日|きんようび}', 'まで', '{働|はたら}きます', 'を'], answer: ['{月曜日|げつようび}', 'から', '{金曜日|きんようび}', 'まで', '{働|はたら}きます'], ro: 'Getsuyōbi kara kin\'yōbi made hatarakimasu.' },
        { vi: 'Buổi sáng tôi ăn bánh mì, hoa quả, v.v.', chips: ['{朝|あさ}、', 'パン', 'や', '{果物|くだもの}', 'など', 'を', '{食|た}べます', 'と'], answer: ['{朝|あさ}、', 'パン', 'や', '{果物|くだもの}', 'など', 'を', '{食|た}べます'], ro: 'Asa, pan ya kudamono nado o tabemasu.' },
        { vi: 'Buổi sáng tôi không ăn gì cả.', chips: ['{朝|あさ}、', '{何|なに}も', '{食|た}べません', '{食|た}べます', 'を'], answer: ['{朝|あさ}、', '{何|なに}も', '{食|た}べません'], ro: 'Asa, nanimo tabemasen.' },
        { vi: 'Chiều nay tôi không đi đâu cả.', chips: ['{午後|ごご}、', 'どこへも', '{行|い}きません', '{行|い}きます', '{何|なに}も'], answer: ['{午後|ごご}、', 'どこへも', '{行|い}きません'], ro: 'Gogo, doko e mo ikimasen.' },
        { vi: 'Nghỉ hè bạn có về nước không?', chips: ['{夏休|なつやす}み、', '{国|くに}', 'へ', '{帰|かえ}りますか', 'を'], answer: ['{夏休|なつやす}み、', '{国|くに}', 'へ', '{帰|かえ}りますか'], ro: 'Natsuyasumi, kuni e kaerimasu ka.' },
        { vi: 'Hằng ngày bạn học từ mấy giờ đến mấy giờ?', chips: ['{毎日|まいにち}、', '{何時|なんじ}', 'から', '{何時|なんじ}', 'まで', '{勉強|べんきょう}しますか', 'に'], answer: ['{毎日|まいにち}、', '{何時|なんじ}', 'から', '{何時|なんじ}', 'まで', '{勉強|べんきょう}しますか'], ro: 'Mainichi, nanji kara nanji made benkyō shimasu ka.' },
        { vi: 'Tôi mua cơm hộp ở cửa hàng tiện lợi.', chips: ['コンビニ', 'で', 'お{弁当|べんとう}', 'を', '{買|か}います', 'へ'], answer: ['コンビニ', 'で', 'お{弁当|べんとう}', 'を', '{買|か}います'], alt: [['お{弁当|べんとう}', 'を', 'コンビニ', 'で', '{買|か}います']], ro: 'Konbini de obentō o kaimasu.' },
        { vi: 'Tối nào tôi cũng ngủ lúc 11 giờ.', chips: ['{毎晩|まいばん}', '{11時|じゅういちじ}', 'に', '{寝|ね}ます', 'を'], answer: ['{毎晩|まいばん}', '{11時|じゅういちじ}', 'に', '{寝|ね}ます'], ro: 'Maiban jūichiji ni nemasu.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-np-kiem',
      title: 'Kiểm tra nhanh ポイント 16–23',
      items: [
        { q: '{図書館|としょかん}（　）{本|ほん}を{読|よ}みます。', options: ['へ', 'で', 'を', 'に'], correct: 1, why: 'Đọc sách là hành động diễn ra TẠI thư viện → **で** (ポイント 20).' },
        { q: '{私|わたし}は{毎朝|まいあさ}（　）コーヒーを{飲|の}みます。', options: ['に', 'で', 'không cần trợ từ', 'を'], correct: 2, why: '{毎朝|まいあさ}, {毎日|まいにち}, {毎晩|まいばん} **không đi với に** (ポイント 19).' },
        { q: '{6時|ろくじ}（　）{起|お}きます。', options: ['に', 'で', 'を', 'へ'], correct: 0, why: 'Giờ có số → bắt buộc **に** (ポイント 19).' },
        { q: '{春休|はるやす}み、{国|くに}（　）{帰|かえ}ります。', options: ['を', 'で', 'へ', 'や'], correct: 2, why: 'Về (hướng tới) nước → **へ** (ポイント 17).' },
        { q: '{何|なに}を{食|た}べますか。——{何|なに}も（　）。', options: ['{食|た}べます', '{食|た}べません', 'を{食|た}べません', '{食|た}べますか'], correct: 1, why: '{何|なに}も luôn đi với **động từ phủ định**, và không có を (ポイント 23).' },
        { q: '{郵便局|ゆうびんきょく}は{9時|くじ}（　）{5時|ごじ}（　）です。', options: ['に・に', 'から・まで', 'まで・から', 'や・など'], correct: 1, why: 'Từ … đến … = **から … まで** (ポイント 21).' },
        { q: 'パン（　）{卵|たまご}（　）を{食|た}べます。(ăn bánh mì, trứng và vài thứ khác)', options: ['と・と', 'や・など', 'から・まで', 'も・も'], correct: 1, why: 'Liệt kê ví dụ, còn thứ khác → **や … など** (ポイント 22).' },
        { q: '{毎日|まいにち}、{新聞|しんぶん}を{読|よ}みますか。——いいえ、（　）。', options: ['そうです', '{読|よ}みます', '{読|よ}みません', 'じゃありません'], correct: 2, why: 'Hỏi bằng động từ thì trả lời bằng động từ: **いいえ、{読|よ}みません** (ポイント 16).' },
        { q: '{午後|ごご}、どこへ{行|い}きますか。——（　）。うちでテレビを{見|み}ます。', options: ['{何|なに}も{行|い}きません', 'どこへも{行|い}きません', 'どこへも{行|い}きます', 'どこへ{行|い}きません'], correct: 1, why: 'Không đi đâu cả = **どこへも{行|い}きません** (ポイント 23).' },
        { q: '{会社|かいしゃ}（　）{働|はたら}きます。', options: ['へ', 'を', 'で', 'に'], correct: 2, why: 'Làm việc TẠI công ty → **で**. ~~{会社|かいしゃ}へ{働|はたら}きます~~ là lỗi rất hay gặp.' },
        { q: '「4時」— cách đọc đúng? (không nhìn furigana)', options: ['よんじ', 'しじ', 'よじ', 'よっじ'], correct: 2, why: '4 giờ = **よじ** (bất quy tắc).' },
        { q: '「9月20日」— cách đọc đúng?', options: ['きゅうがつ にじゅうにち', 'くがつ はつか', 'くがつ にじゅうにち', 'きゅうがつ はつか'], correct: 1, why: 'Tháng 9 = **くがつ**, ngày 20 = **はつか**.' },
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const KANJI: Lesson = {
  id: 'b3-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — giờ, thứ, nơi chốn, động từ',
  goal: 'Nhận mặt và đọc đúng các chữ Hán trong từ vựng bài 3, nhất là 7 chữ của thứ trong tuần và chữ trong động từ.',
  minutes: 25,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán được gạch chân (12 điểm)** không có furigana. Bài 3 là bài có nhiều chữ Hán "đinh" nhất: thứ trong tuần, giờ, và động từ. **Âm On** (音読み, viết katakana) là âm gốc Hán, thường dùng khi chữ đứng cạnh chữ Hán khác; **âm Kun** (訓読み, viết hiragana) là âm Nhật, thường dùng khi chữ đứng một mình hoặc có đuôi kana.',
    },
    {
      t: 'table',
      caption: '1. Bảy chữ của thứ trong tuần + 曜',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['月', 'ゲツ・ガツ', 'つき', 'NGUYỆT (mặt trăng, tháng)', '{月曜日|げつようび} · {4月|しがつ}'],
        ['火', 'カ', 'ひ', 'HOẢ (lửa)', '{火曜日|かようび} · {花火|はなび}'],
        ['水', 'スイ', 'みず', 'THUỶ (nước)', '{水曜日|すいようび}'],
        ['木', 'モク', 'き', 'MỘC (cây)', '{木曜日|もくようび}'],
        ['金', 'キン', 'かね', 'KIM (vàng, tiền)', '{金曜日|きんようび}'],
        ['土', 'ド', 'つち', 'THỔ (đất)', '{土曜日|どようび}'],
        ['日', 'ニチ・ジツ', 'ひ・か', 'NHẬT (mặt trời, ngày)', '{日曜日|にちようび} · {毎日|まいにち} · {20日|はつか}'],
        ['曜', 'ヨウ', '—', 'DIỆU (ngày trong tuần)', '～{曜日|ようび}'],
      ],
    },
    {
      t: 'table',
      caption: '2. Thời gian',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['今', 'コン', 'いま', 'KIM (bây giờ)', '{今|いま}'],
        ['時', 'ジ', 'とき', 'THỜI (giờ, lúc)', '～{時|じ} · {時間|じかん}'],
        ['間', 'カン', 'あいだ', 'GIAN (khoảng)', '{時間|じかん}'],
        ['分', 'フン・ブン', 'わ(かる)', 'PHÂN (phút, chia)', '～{分|ふん} · {何分|なんぷん}'],
        ['半', 'ハン', 'なか(ば)', 'BÁN (một nửa)', '～{時半|じはん}'],
        ['午', 'ゴ', '—', 'NGỌ (giữa trưa)', '{午前|ごぜん} · {午後|ごご}'],
        ['前', 'ゼン', 'まえ', 'TIỀN (trước)', '{午前|ごぜん}'],
        ['後', 'ゴ・コウ', 'あと・うし(ろ)', 'HẬU (sau)', '{午後|ごご}'],
        ['朝', 'チョウ', 'あさ', 'TRIÊU (buổi sáng)', '{朝|あさ} · {毎朝|まいあさ} · {朝|あさ}ご{飯|はん}'],
        ['昼', 'チュウ', 'ひる', 'TRÚ (buổi trưa)', '{昼|ひる} · {昼|ひる}ごはん'],
        ['夜', 'ヤ', 'よる', 'DẠ (đêm)', '{夜|よる}'],
        ['晩', 'バン', '—', 'VÃN (buổi tối)', '{毎晩|まいばん}'],
        ['毎', 'マイ', '—', 'MỖI (mỗi)', '{毎日|まいにち} · {毎朝|まいあさ} · {毎晩|まいばん}'],
        ['年', 'ネン', 'とし', 'NIÊN (năm)', '{1年|いちねん}'],
        ['春', 'シュン', 'はる', 'XUÂN', '{春|はる}'],
        ['夏', 'カ', 'なつ', 'HẠ', '{夏|なつ}'],
        ['秋', 'シュウ', 'あき', 'THU', '{秋|あき}'],
        ['冬', 'トウ', 'ふゆ', 'ĐÔNG', '{冬|ふゆ}'],
        ['休', 'キュウ', 'やす(む)', 'HƯU (nghỉ)', '{休|やす}み'],
      ],
    },
    {
      t: 'table',
      caption: '3. Nơi chốn',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['図', 'ト・ズ', '—', 'ĐỒ (bản đồ)', '{図書館|としょかん}'],
        ['書', 'ショ', 'か(く)', 'THƯ (viết, sách)', '{図書館|としょかん}'],
        ['館', 'カン', '—', 'QUÁN (toà nhà lớn)', '{図書館|としょかん} · {体育館|たいいくかん}'],
        ['体', 'タイ', 'からだ', 'THỂ (cơ thể)', '{体育館|たいいくかん}'],
        ['育', 'イク', 'そだ(つ)', 'DỤC (nuôi dạy)', '{体育館|たいいくかん}'],
        ['銀', 'ギン', '—', 'NGÂN (bạc)', '{銀行|ぎんこう}'],
        ['行', 'コウ・ギョウ', 'い(く)', 'HÀNH / HÀNG (đi; hàng)', '{銀行|ぎんこう} · {行|い}きます'],
        ['病', 'ビョウ', 'やまい', 'BỆNH', '{病院|びょういん}'],
        ['院', 'イン', '—', 'VIỆN', '{病院|びょういん}'],
        ['郵', 'ユウ', '—', 'BƯU', '{郵便局|ゆうびんきょく}'],
        ['便', 'ビン・ベン', 'たよ(り)', 'TIỆN', '{郵便局|ゆうびんきょく}'],
        ['局', 'キョク', '—', 'CỤC (sở, cục)', '{郵便局|ゆうびんきょく}'],
        ['公', 'コウ', 'おおやけ', 'CÔNG', '{公園|こうえん}'],
        ['園', 'エン', 'その', 'VIÊN (vườn)', '{公園|こうえん}'],
        ['海', 'カイ', 'うみ', 'HẢI (biển)', '{海|うみ}'],
        ['家', 'カ・ケ', 'いえ・うち', 'GIA (nhà)', '{家|うち}'],
        ['会', 'カイ', 'あ(う)', 'HỘI (gặp)', '{会社|かいしゃ}'],
        ['社', 'シャ', 'やしろ', 'XÃ (công ty, đền)', '{会社|かいしゃ}'],
        ['学', 'ガク', 'まな(ぶ)', 'HỌC', '{学校|がっこう} · {留学生|りゅうがくせい}'],
        ['校', 'コウ', '—', 'HIỆU (trường)', '{学校|がっこう}'],
      ],
    },
    {
      t: 'table',
      caption: '4. Chữ trong 14 động từ',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['来', 'ライ', 'く(る)・き(ます)', 'LAI (đến)', '{来|き}ます'],
        ['帰', 'キ', 'かえ(る)', 'QUY (về)', '{帰|かえ}ります'],
        ['食', 'ショク', 'た(べる)', 'THỰC (ăn)', '{食|た}べます'],
        ['飲', 'イン', 'の(む)', 'ẨM (uống)', '{飲|の}みます'],
        ['見', 'ケン', 'み(る)', 'KIẾN (nhìn)', '{見|み}ます · お{花見|はなみ}'],
        ['聞', 'ブン', 'き(く)', 'VĂN (nghe)', '{聞|き}きます · {新聞|しんぶん}'],
        ['読', 'ドク', 'よ(む)', 'ĐỘC (đọc)', '{読|よ}みます'],
        ['買', 'バイ', 'か(う)', 'MÃI (mua)', '{買|か}います'],
        ['働', 'ドウ', 'はたら(く)', 'ĐỘNG (lao động)', '{働|はたら}きます'],
        ['起', 'キ', 'お(きる)', 'KHỞI (dậy)', '{起|お}きます'],
        ['寝', 'シン', 'ね(る)', 'TẨM (ngủ)', '{寝|ね}ます'],
        ['勉', 'ベン', '—', 'MIỄN (cố gắng)', '{勉強|べんきょう}します'],
        ['強', 'キョウ', 'つよ(い)', 'CƯỜNG (mạnh)', '{勉強|べんきょう}します'],
      ],
    },
    {
      t: 'table',
      caption: '5. Các chữ còn lại trong bài',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['何', 'カ', 'なに・なん', 'HÀ (gì)', '{何|なに} · {何時|なんじ} · {何|なに}も'],
        ['花', 'カ', 'はな', 'HOA', '{花火|はなび} · お{花見|はなみ}'],
        ['祭', 'サイ', 'まつ(り)', 'TẾ (lễ)', 'お{祭|まつ}り'],
        ['桜', 'オウ', 'さくら', 'ANH (hoa anh đào)', '{桜|さくら}'],
        ['酒', 'シュ', 'さけ', 'TỬU (rượu)', 'お{酒|さけ}'],
        ['弁', 'ベン', '—', 'BIỆN', 'お{弁当|べんとう}'],
        ['当', 'トウ', 'あ(たる)', 'ĐƯƠNG', 'お{弁当|べんとう}'],
        ['留', 'リュウ', 'と(める)', 'LƯU (ở lại)', '{留学生|りゅうがくせい}'],
        ['生', 'セイ', 'い(きる)・う(まれる)', 'SINH', '{留学生|りゅうがくせい}'],
        ['授', 'ジュ', 'さず(ける)', 'THỤ (trao)', '{授業|じゅぎょう}'],
        ['業', 'ギョウ', 'わざ', 'NGHIỆP', '{授業|じゅぎょう}'],
        ['牛', 'ギュウ', 'うし', 'NGƯU (bò)', '{牛乳|ぎゅうにゅう}'],
        ['乳', 'ニュウ', 'ちち', 'NHŨ (sữa)', '{牛乳|ぎゅうにゅう}'],
        ['果', 'カ', 'は(たす)', 'QUẢ', '{果物|くだもの} (đọc đặc biệt cả từ)'],
        ['物', 'ブツ・モツ', 'もの', 'VẬT', '{果物|くだもの}'],
        ['新', 'シン', 'あたら(しい)', 'TÂN (mới)', '{新聞|しんぶん}'],
        ['飯', 'ハン', 'めし', 'PHẠN (cơm)', '{朝|あさ}ご{飯|はん}'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ nhanh',
      items: [
        '**{午前|ごぜん} / {午後|ごご}** = NGỌ TIỀN / NGỌ HẬU — "trước giờ Ngọ / sau giờ Ngọ". Giờ Ngọ là 11–13 giờ, đúng như tiếng Việt.',
        '**{毎|まい}** + thời gian = "mỗi": {毎日|まいにち} (MỖI NHẬT), {毎朝|まいあさ}, {毎晩|まいばん}.',
        '**{見|み}** (KIẾN — có con mắt 目 trên hai chân) và **{聞|き}** (VĂN — cái tai 耳 trong cái cổng 門): nhìn bằng mắt, nghe bằng tai.',
        '**{休|やす}** = người 亻 dựa gốc cây 木 → nghỉ ngơi.',
        '**{果物|くだもの}** là cách đọc đặc biệt cho cả từ (không ghép từ âm từng chữ) — học thuộc như một khối.',
      ],
    },
    {
      t: 'mcq',
      id: 'b3-kanji-doc',
      title: 'Đọc chữ Hán (không furigana)',
      items: [
        { q: '水曜日', options: ['もくようび', 'すいようび', 'きんようび', 'かようび'], correct: 1, why: '水 = スイ (Thuỷ) → **すいようび** (thứ Tư).' },
        { q: '金曜日', options: ['きんようび', 'どようび', 'げつようび', 'にちようび'], correct: 0, why: '金 = キン → **きんようび** (thứ Sáu).' },
        { q: '図書館', options: ['としょかん', 'たいいくかん', 'ずしょかん', 'としょうかん'], correct: 0, why: '**としょかん** (thư viện). 図 ở đây đọc ト.' },
        { q: '郵便局', options: ['ゆうびんきょく', 'ゆびんきょく', 'ゆうべんきょく', 'ゆうびんこく'], correct: 0, why: '**ゆうびんきょく** — ゆう có trường âm.' },
        { q: '午後', options: ['ごぜん', 'ごご', 'ごこう', 'ひるご'], correct: 1, why: '午後 = **ごご** (buổi chiều).' },
        { q: '毎晩', options: ['まいあさ', 'まいにち', 'まいばん', 'まいよる'], correct: 2, why: '晩 = バン → **まいばん** (mỗi tối).' },
        { q: '起きます', options: ['ねます', 'おきます', 'いきます', 'ききます'], correct: 1, why: '起 = お(きる) → **おきます** (thức dậy).' },
        { q: '帰ります', options: ['かえります', 'かいます', 'きます', 'はいります'], correct: 0, why: '帰 = かえ(る) → **かえります** (về).' },
        { q: '働きます', options: ['はたらきます', 'べんきょうします', 'よみます', 'ききます'], correct: 0, why: '働 = はたら(く) → **はたらきます** (làm việc).' },
        { q: '牛乳', options: ['ぎゅうにゅう', 'ぎゅにゅう', 'うしちち', 'ぎゅうにゅ'], correct: 0, why: '**ぎゅうにゅう** — hai trường âm う.' },
        { q: '果物', options: ['かぶつ', 'くだもの', 'はもの', 'かもの'], correct: 1, why: 'Đọc đặc biệt: **くだもの** (hoa quả).' },
        { q: '授業', options: ['じゅぎょう', 'じゅうぎょう', 'じゅごう', 'しゅぎょう'], correct: 0, why: '**じゅぎょう** (giờ học) — じゅ ngắn, ぎょう dài.' },
        { q: '体育館', options: ['たいいくかん', 'たいくかん', 'たいいっかん', 'からだかん'], correct: 0, why: '**たいいくかん** — có hai い liền nhau.' },
        { q: '留学生', options: ['りゅうがくせい', 'りゅがくせい', 'りゅうがっせい', 'るがくせい'], correct: 0, why: '**りゅうがくせい** (du học sinh).' },
      ],
    },
    {
      t: 'write',
      id: 'b3-viet-kanji',
      title: 'Tập viết tay 77 chữ Hán của Bài 3',
      note: 'Mỗi nhóm 10 chữ (bấm dải chữ để chuyển nhóm). Bấm ▶ Thứ tự nét trước khi viết — chữ Hán viết đúng thứ tự (trên → dưới, trái → phải, ngang trước sổ sau) thì cân và đẹp. Viết xong nhờ ✨ AI xem chữ.',
      chars: ['月', '火', '水', '木', '金', '土', '日', '曜', '今', '時', '間', '分', '半', '午', '前', '後', '朝', '昼', '夜', '晩', '毎', '年', '春', '夏', '秋', '冬', '休', '図', '書', '館', '体', '育', '銀', '行', '病', '院', '郵', '便', '局', '公', '園', '海', '家', '会', '社', '学', '校', '来', '帰', '食', '飲', '見', '聞', '読', '買', '働', '起', '寝', '勉', '強', '何', '花', '祭', '桜', '酒', '弁', '当', '留', '生', '授', '業', '牛', '乳', '果', '物', '新', '飯'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b3-nghe',
  kind: 'listening',
  title: 'Luyện nghe — giờ mở cửa, lịch cả năm, một ngày',
  goal: 'Nghe và ghi lại được giờ, thứ, ngày tháng; nghe hiểu ai đi đâu, làm gì, lúc mấy giờ.',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        'Nghe lần 1 **không nhìn lời**, chỉ bắt con số: giờ (～じ), phút (～ふん／ぷん), thứ (～ようび), ngày (～か／にち).',
        'Nghe lần 2 trả lời câu hỏi. Sai câu nào thì mở lời thoại, tìm đúng câu đó, nghe lại 3 lần.',
        'Tai người Việt hay lẫn: **よじ (4 giờ) ↔ くじ (9 giờ)**, **しちじ (7) ↔ いちじ (1)**, **よっか (ngày 4) ↔ ようか (ngày 8)**, **はつか (20) ↔ はちか**.',
      ],
    },

    /* ── Bài 1: giờ mở cửa ── */
    { t: 'h', text: 'Bài 1 — Gọi điện hỏi giờ mở cửa (やってみよう)' },
    {
      t: 'listen',
      id: 'b3-nghe-1a',
      title: '① あおば{図書館|としょかん}',
      lines: [
        { who: '{図書館|としょかん}の{人|ひと}', voice: 'ja-nam', text: 'はい、あおば{図書館|としょかん}です。', ro: 'Hai, Aoba toshokan desu.', vi: 'Vâng, thư viện Aoba xin nghe.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'あのう、すみません。そちらは{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Anō, sumimasen. Sochira wa nanji kara nanji made desu ka.', vi: 'Dạ, xin lỗi, bên mình mở từ mấy giờ đến mấy giờ ạ?' },
        { who: '{図書館|としょかん}の{人|ひと}', voice: 'ja-nam', text: '{午前|ごぜん}{10時|じゅうじ}から{午後|ごご}{6時|ろくじ}までです。', ro: 'Gozen jūji kara gogo rokuji made desu.', vi: 'Từ 10 giờ sáng đến 6 giờ chiều.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'そうですか。{休|やす}みはいつですか。', ro: 'Sō desu ka. Yasumi wa itsu desu ka.', vi: 'Vậy ạ. Ngày nghỉ là khi nào ạ?' },
        { who: '{図書館|としょかん}の{人|ひと}', voice: 'ja-nam', text: '{金曜日|きんようび}です。', ro: 'Kin\'yōbi desu.', vi: 'Thứ Sáu.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{金曜日|きんようび}ですか。ありがとうございます。', ro: 'Kin\'yōbi desu ka. Arigatō gozaimasu.', vi: 'Thứ Sáu ạ. Cảm ơn anh.' },
      ],
    },
    {
      t: 'listen',
      id: 'b3-nghe-1b',
      title: '② ひかり{銀行|ぎんこう}',
      lines: [
        { who: '{銀行|ぎんこう}の{人|ひと}', voice: 'ja-nu', text: 'はい、ひかり{銀行|ぎんこう}です。', ro: 'Hai, Hikari ginkō desu.', vi: 'Vâng, ngân hàng Hikari xin nghe.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'すみません。そちらは{何時|なんじ}までですか。', ro: 'Sumimasen. Sochira wa nanji made desu ka.', vi: 'Xin lỗi, bên mình làm đến mấy giờ ạ?' },
        { who: '{銀行|ぎんこう}の{人|ひと}', voice: 'ja-nu', text: '{3時|さんじ}までです。{9時|くじ}から{3時|さんじ}までです。', ro: 'Sanji made desu. Kuji kara sanji made desu.', vi: 'Đến 3 giờ. Từ 9 giờ đến 3 giờ.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{休|やす}みは{何曜日|なんようび}ですか。', ro: 'Yasumi wa nan\'yōbi desu ka.', vi: 'Nghỉ vào thứ mấy ạ?' },
        { who: '{銀行|ぎんこう}の{人|ひと}', voice: 'ja-nu', text: '{土曜日|どようび}と{日曜日|にちようび}です。', ro: 'Doyōbi to nichiyōbi desu.', vi: 'Thứ Bảy và Chủ Nhật.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'そうですか。ありがとうございます。', ro: 'Sō desu ka. Arigatō gozaimasu.', vi: 'Vậy ạ. Cảm ơn chị.' },
      ],
    },
    {
      t: 'listen',
      id: 'b3-nghe-1c',
      title: '③ みなみ{病院|びょういん}',
      lines: [
        { who: '{病院|びょういん}の{人|ひと}', voice: 'ja-nam', text: 'はい、みなみ{病院|びょういん}です。', ro: 'Hai, Minami byōin desu.', vi: 'Vâng, bệnh viện Minami xin nghe.' },
        { who: 'パク', voice: 'ja-nu', text: 'すみません。{病院|びょういん}は{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Sumimasen. Byōin wa nanji kara nanji made desu ka.', vi: 'Xin lỗi, bệnh viện mở từ mấy giờ đến mấy giờ ạ?' },
        { who: '{病院|びょういん}の{人|ひと}', voice: 'ja-nam', text: '{午前|ごぜん}{8時半|はちじはん}から{午後|ごご}{4時半|よじはん}までです。', ro: 'Gozen hachiji han kara gogo yoji han made desu.', vi: 'Từ 8 rưỡi sáng đến 4 rưỡi chiều.' },
        { who: 'パク', voice: 'ja-nu', text: '{土曜日|どようび}は？', ro: 'Doyōbi wa?', vi: 'Còn thứ Bảy thì sao ạ?' },
        { who: '{病院|びょういん}の{人|ひと}', voice: 'ja-nam', text: '{土曜日|どようび}は{12時|じゅうにじ}までです。{日曜日|にちようび}は{休|やす}みです。', ro: 'Doyōbi wa jūniji made desu. Nichiyōbi wa yasumi desu.', vi: 'Thứ Bảy làm đến 12 giờ. Chủ Nhật nghỉ.' },
        { who: 'パク', voice: 'ja-nu', text: 'そうですか。ありがとうございます。', ro: 'Sō desu ka. Arigatō gozaimasu.', vi: 'Vậy ạ. Cảm ơn anh.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b3-nghe-1-gio',
      title: 'Ghi giờ nghe được (viết số, ví dụ: 10)',
      kind: 'fill',
      items: [
        { q: '① Thư viện mở cửa lúc mấy giờ sáng?', answers: ['10', '10時', 'じゅうじ', '10:00'] },
        { q: '① Thư viện đóng cửa lúc mấy giờ chiều?', answers: ['6', '6時', 'ろくじ', '18', '6:00', '18:00'] },
        { q: '② Ngân hàng đóng cửa lúc mấy giờ?', answers: ['3', '3時', 'さんじ', '15', '3:00', '15:00'] },
        { q: '③ Bệnh viện mở cửa lúc mấy giờ? (viết dạng 8:30)', answers: ['8:30', '8時半', '8時30分', 'はちじはん'] },
        { q: '③ Bệnh viện ngày thường đóng cửa lúc mấy giờ? (viết dạng 4:30)', answers: ['4:30', '4時半', '4時30分', 'よじはん', '16:30'] },
        { q: '③ Thứ Bảy bệnh viện làm đến mấy giờ?', answers: ['12', '12時', 'じゅうにじ', '12:00'] },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-1-nghi',
      title: 'Ngày nghỉ là khi nào?',
      items: [
        { q: '① あおば{図書館|としょかん}の{休|やす}みは？', options: ['{月曜日|げつようび}', '{水曜日|すいようび}', '{金曜日|きんようび}', '{日曜日|にちようび}'], correct: 2, why: '「{金曜日|きんようび}です。」— きんようび = thứ Sáu.' },
        { q: '② ひかり{銀行|ぎんこう}の{休|やす}みは？', options: ['{土曜日|どようび}', '{土曜日|どようび}と{日曜日|にちようび}', '{日曜日|にちようび}', '{月曜日|げつようび}'], correct: 1, why: '「{土曜日|どようび}と{日曜日|にちようび}です。」' },
        { q: '③ みなみ{病院|びょういん}の{休|やす}みは？', options: ['{土曜日|どようび}', '{日曜日|にちようび}', '{土曜日|どようび}と{日曜日|にちようび}', 'ありません'], correct: 1, why: 'Thứ Bảy vẫn làm đến 12 giờ; **{日曜日|にちようび}は{休|やす}みです**.' },
      ],
    },

    /* ── Bài 2: lịch cả năm ── */
    { t: 'h', text: 'Bài 2 — Thầy giới thiệu lịch cả năm' },
    {
      t: 'listen',
      id: 'b3-nghe-2',
      title: '{学校|がっこう}の{1年|いちねん}のスケジュール',
      lines: [
        { who: '{本田|ほんだ}{先生|せんせい}', voice: 'ja-nam', text: 'みなさん、これは{学校|がっこう}の{1年|いちねん}のスケジュールです。', ro: 'Minasan, kore wa gakkō no ichinen no sukejūru desu.', vi: 'Các em, đây là lịch cả năm của trường.' },
        { who: '{本田|ほんだ}{先生|せんせい}', voice: 'ja-nam', text: '{4月|しがつ}{12日|じゅうににち}はお{花見|はなみ}です。{公園|こうえん}で{桜|さくら}を{見|み}ます。お{弁当|べんとう}を{食|た}べます。', ro: 'Shigatsu jūninichi wa ohanami desu. Kōen de sakura o mimasu. Obentō o tabemasu.', vi: 'Ngày 12/4 là buổi ngắm hoa. Chúng ta ngắm hoa anh đào ở công viên, ăn cơm hộp.' },
        { who: '{本田|ほんだ}{先生|せんせい}', voice: 'ja-nam', text: '{6月|ろくがつ}{3日|みっか}と{4日|よっか}はテストです。', ro: 'Rokugatsu mikka to yokka wa tesuto desu.', vi: 'Ngày 3 và 4 tháng 6 là kỳ kiểm tra.' },
        { who: '{本田|ほんだ}{先生|せんせい}', voice: 'ja-nam', text: '{7月|しちがつ}{20日|はつか}は{花火|はなび}です。{夜|よる}{7時|しちじ}から{海|うみ}で{花火|はなび}を{見|み}ます。', ro: 'Shichigatsu hatsuka wa hanabi desu. Yoru shichiji kara umi de hanabi o mimasu.', vi: 'Ngày 20/7 là pháo hoa. Từ 7 giờ tối chúng ta xem pháo hoa ở biển.' },
        { who: '{本田|ほんだ}{先生|せんせい}', voice: 'ja-nam', text: '{夏休|なつやす}みは{7月|しちがつ}{25日|にじゅうごにち}から{8月|はちがつ}{31日|さんじゅういちにち}までです。', ro: 'Natsuyasumi wa shichigatsu nijūgonichi kara hachigatsu sanjūichinichi made desu.', vi: 'Nghỉ hè từ 25/7 đến 31/8.' },
        { who: '{本田|ほんだ}{先生|せんせい}', voice: 'ja-nam', text: '{10月|じゅうがつ}{9日|ここのか}はバス{旅行|りょこう}です。{京都|きょうと}へ{行|い}きます。{京都|きょうと}でお{祭|まつ}りを{見|み}ます。', ro: 'Jūgatsu kokonoka wa basu ryokō desu. Kyōto e ikimasu. Kyōto de omatsuri o mimasu.', vi: 'Ngày 9/10 là chuyến đi xe buýt. Chúng ta đi Kyoto và xem lễ hội ở Kyoto.' },
        { who: '{本田|ほんだ}{先生|せんせい}', voice: 'ja-nam', text: '{12月|じゅうにがつ}{19日|じゅうくにち}は{留学生|りゅうがくせい}パーティーです。{午後|ごご}{2時|にじ}からです。', ro: 'Jūnigatsu jūkunichi wa ryūgakusei pātī desu. Gogo niji kara desu.', vi: 'Ngày 19/12 là tiệc du học sinh, từ 2 giờ chiều.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-2-hoi',
      title: 'Trả lời theo bài nghe',
      items: [
        { q: 'お{花見|はなみ}はいつですか。', options: ['{4月|しがつ}{2日|ふつか}', '{4月|しがつ}{12日|じゅうににち}', '{4月|しがつ}{20日|はつか}', '{7月|しちがつ}{12日|じゅうににち}'], correct: 1, why: '「{4月|しがつ}{12日|じゅうににち}はお{花見|はなみ}です。」— しがつ じゅうににち.' },
        { q: 'お{花見|はなみ}で{何|なに}をしますか。', options: ['{海|うみ}で{花火|はなび}を{見|み}ます', '{公園|こうえん}で{桜|さくら}を{見|み}ます', 'バーベキューをします', 'おすしを{食|た}べます'], correct: 1, why: '「{公園|こうえん}で{桜|さくら}を{見|み}ます。お{弁当|べんとう}を{食|た}べます。」' },
        { q: 'テストはいつですか。', options: ['{6月|ろくがつ}{3日|みっか}と{4日|よっか}', '{6月|ろくがつ}{3日|みっか}と{8日|ようか}', '{4月|しがつ}{3日|みっか}と{4日|よっか}', '{6月|ろくがつ}{13日|じゅうさんにち}'], correct: 0, why: 'みっか (3) と よっか (4). Đừng nhầm よっか (4) với ようか (8).' },
        { q: '{花火|はなび}は{何時|なんじ}からですか。', options: ['{1時|いちじ}', '{4時|よじ}', '{7時|しちじ}', '{9時|くじ}'], correct: 2, why: '「{夜|よる}{7時|しちじ}から」— しちじ.' },
        { q: '{夏休|なつやす}みはいつまでですか。', options: ['{7月|しちがつ}{25日|にじゅうごにち}', '{8月|はちがつ}{25日|にじゅうごにち}', '{8月|はちがつ}{31日|さんじゅういちにち}', '{9月|くがつ}{1日|ついたち}'], correct: 2, why: '「{7月|しちがつ}{25日|にじゅうごにち}から{8月|はちがつ}{31日|さんじゅういちにち}までです。」' },
        { q: 'バス{旅行|りょこう}はどこへ{行|い}きますか。', options: ['{北海道|ほっかいどう}', '{富士山|ふじさん}', '{京都|きょうと}', '{海|うみ}'], correct: 2, why: '「{京都|きょうと}へ{行|い}きます。」' },
        { q: '{留学生|りゅうがくせい}パーティーは？', options: ['{12月|じゅうにがつ}{9日|ここのか}・{午前|ごぜん}{2時|にじ}から', '{12月|じゅうにがつ}{19日|じゅうくにち}・{午後|ごご}{2時|にじ}から', '{10月|じゅうがつ}{19日|じゅうくにち}・{午後|ごご}{2時|にじ}から', '{12月|じゅうにがつ}{19日|じゅうくにち}・{午後|ごご}{4時|よじ}から'], correct: 1, why: 'じゅうにがつ じゅうくにち、ごご にじ から.' },
      ],
    },

    /* ── Bài 3: kế hoạch nghỉ ── */
    { t: 'h', text: 'Bài 3 — Tuần lễ Vàng và nghỉ đông làm gì?' },
    {
      t: 'listen',
      id: 'b3-nghe-3',
      title: 'アンナさんとダニエルさん',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ダニエルさん、ゴールデンウイーク、{何|なに}をしますか。', ro: 'Danieru-san, gōruden uīku, nani o shimasu ka.', vi: 'Daniel, Tuần lễ Vàng bạn làm gì?' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{京都|きょうと}へ{行|い}きます。{京都|きょうと}でお{祭|まつ}りを{見|み}ます。', ro: 'Kyōto e ikimasu. Kyōto de omatsuri o mimasu.', vi: 'Mình đi Kyoto. Mình xem lễ hội ở Kyoto.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいですね。{冬休|ふゆやす}みは{国|くに}へ{帰|かえ}りますか。', ro: 'Ii desu ne. Fuyuyasumi wa kuni e kaerimasu ka.', vi: 'Hay nhỉ. Nghỉ đông bạn có về nước không?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'いいえ、{帰|かえ}りません。{北海道|ほっかいどう}でスキーをします。', ro: 'Iie, kaerimasen. Hokkaidō de sukī o shimasu.', vi: 'Không, mình không về. Mình trượt tuyết ở Hokkaido.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'えっ、スキー？いつからいつまでですか。', ro: 'E\', sukī? Itsu kara itsu made desu ka.', vi: 'Ơ, trượt tuyết á? Từ bao giờ đến bao giờ?' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{12月|じゅうにがつ}{27日|にじゅうしちにち}から{1月|いちがつ}{3日|みっか}までです。アンナさんは？', ro: 'Jūnigatsu nijūshichinichi kara ichigatsu mikka made desu. Anna-san wa?', vi: 'Từ 27/12 đến 3/1. Còn Anna?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{私|わたし}はどこへも{行|い}きません。コンビニでアルバイトをします。', ro: 'Watashi wa doko e mo ikimasen. Konbini de arubaito o shimasu.', vi: 'Mình không đi đâu cả. Mình làm thêm ở cửa hàng tiện lợi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-3-hoi',
      title: 'Ai làm gì?',
      items: [
        { q: 'ダニエルさんはゴールデンウイーク、{何|なに}をしますか。', options: ['{国|くに}へ{帰|かえ}ります', '{京都|きょうと}でお{祭|まつ}りを{見|み}ます', '{北海道|ほっかいどう}でスキーをします', 'アルバイトをします'], correct: 1, why: '「{京都|きょうと}へ{行|い}きます。{京都|きょうと}でお{祭|まつ}りを{見|み}ます。」' },
        { q: 'ダニエルさんは{冬休|ふゆやす}み、{国|くに}へ{帰|かえ}りますか。', options: ['はい、{帰|かえ}ります', 'いいえ、{帰|かえ}りません'], correct: 1, why: '「いいえ、{帰|かえ}りません。{北海道|ほっかいどう}でスキーをします。」' },
        { q: 'スキーはいつからいつまでですか。', options: ['{12月|じゅうにがつ}{17日|じゅうしちにち}〜{1月|いちがつ}{3日|みっか}', '{12月|じゅうにがつ}{27日|にじゅうしちにち}〜{1月|いちがつ}{3日|みっか}', '{12月|じゅうにがつ}{27日|にじゅうしちにち}〜{1月|いちがつ}{8日|ようか}', '{11月|じゅういちがつ}{27日|にじゅうしちにち}〜{1月|いちがつ}{3日|みっか}'], correct: 1, why: 'にじゅうしちにち (27) から いちがつ みっか (3/1) まで.' },
        { q: 'アンナさんは{冬休|ふゆやす}み、どこへ{行|い}きますか。', options: ['{北海道|ほっかいどう}へ{行|い}きます', '{国|くに}へ{帰|かえ}ります', 'どこへも{行|い}きません', '{京都|きょうと}へ{行|い}きます'], correct: 2, why: '「どこへも{行|い}きません。コンビニでアルバイトをします。」' },
      ],
    },

    /* ── Bài 4: một ngày ── */
    { t: 'h', text: 'Bài 4 — Ba người kể một ngày của mình' },
    {
      t: 'listen',
      id: 'b3-nghe-4',
      title: '{私|わたし}の{毎日|まいにち}',
      lines: [
        { who: '① {田中|たなか}', voice: 'ja-nam', text: '{私|わたし}は{会社員|かいしゃいん}です。{毎朝|まいあさ}{6時|ろくじ}に{起|お}きます。{朝|あさ}ご{飯|はん}は{食|た}べません。コーヒーを{飲|の}みます。{9時|くじ}から{6時|ろくじ}まで{会社|かいしゃ}で{働|はたら}きます。{夜|よる}、うちでテレビを{見|み}ます。{12時|じゅうにじ}に{寝|ね}ます。', ro: 'Watashi wa kaishain desu. Maiasa rokuji ni okimasu. Asagohan wa tabemasen. Kōhī o nomimasu. Kuji kara rokuji made kaisha de hatarakimasu. Yoru, uchi de terebi o mimasu. Jūniji ni nemasu.', vi: 'Tôi là nhân viên công ty. Sáng nào tôi cũng dậy lúc 6 giờ. Tôi không ăn sáng, chỉ uống cà phê. Tôi làm việc ở công ty từ 9 giờ đến 6 giờ. Buổi tối tôi xem TV ở nhà. Tôi ngủ lúc 12 giờ.' },
        { who: '② アンナ', voice: 'ja-nu', text: '{私|わたし}は{留学生|りゅうがくせい}です。{毎日|まいにち}、{9時|くじ}から{3時|さんじ}まで{学校|がっこう}で{日本語|にほんご}を{勉強|べんきょう}します。{昼|ひる}ごはんは{学校|がっこう}で{食|た}べます。{午後|ごご}、{図書館|としょかん}へ{行|い}きます。{図書館|としょかん}で{新聞|しんぶん}や{本|ほん}などを{読|よ}みます。', ro: 'Watashi wa ryūgakusei desu. Mainichi, kuji kara sanji made gakkō de nihongo o benkyō shimasu. Hirugohan wa gakkō de tabemasu. Gogo, toshokan e ikimasu. Toshokan de shinbun ya hon nado o yomimasu.', vi: 'Tôi là du học sinh. Hằng ngày tôi học tiếng Nhật ở trường từ 9 giờ đến 3 giờ. Bữa trưa tôi ăn ở trường. Buổi chiều tôi đi thư viện, đọc báo, sách, v.v. ở đó.' },
        { who: '③ ナタポン', voice: 'ja-nam', text: '{私|わたし}は{月曜日|げつようび}から{金曜日|きんようび}まで{大学|だいがく}へ{行|い}きます。{土曜日|どようび}と{日曜日|にちようび}、コンビニでアルバイトをします。{午前|ごぜん}{10時|じゅうじ}から{午後|ごご}{5時|ごじ}まで{働|はたら}きます。{夜|よる}、インターネットをします。', ro: 'Watashi wa getsuyōbi kara kin\'yōbi made daigaku e ikimasu. Doyōbi to nichiyōbi, konbini de arubaito o shimasu. Gozen jūji kara gogo goji made hatarakimasu. Yoru, intānetto o shimasu.', vi: 'Tôi đi học đại học từ thứ Hai đến thứ Sáu. Thứ Bảy và Chủ Nhật tôi làm thêm ở cửa hàng tiện lợi, từ 10 giờ sáng đến 5 giờ chiều. Buổi tối tôi lên mạng.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-4-hoi',
      title: 'Trả lời theo bài nghe',
      items: [
        { q: '{田中|たなか}さんは{毎朝|まいあさ}、{何時|なんじ}に{起|お}きますか。', options: ['{4時|よじ}', '{6時|ろくじ}', '{7時|しちじ}', '{9時|くじ}'], correct: 1, why: '「{毎朝|まいあさ}{6時|ろくじ}に{起|お}きます。」' },
        { q: '{田中|たなか}さんは{朝|あさ}、{何|なに}を{食|た}べますか。', options: ['パンを{食|た}べます', '{果物|くだもの}を{食|た}べます', '{何|なに}も{食|た}べません', 'お{弁当|べんとう}を{食|た}べます'], correct: 2, why: '「{朝|あさ}ご{飯|はん}は{食|た}べません。コーヒーを{飲|の}みます。」→ không ăn gì, chỉ uống cà phê.' },
        { q: 'アンナさんは{午後|ごご}、どこで{本|ほん}を{読|よ}みますか。', options: ['うちで', '{学校|がっこう}で', '{図書館|としょかん}で', 'コンビニで'], correct: 2, why: '「{図書館|としょかん}で{新聞|しんぶん}や{本|ほん}などを{読|よ}みます。」' },
        { q: 'アンナさんは{何時|なんじ}から{何時|なんじ}まで{勉強|べんきょう}しますか。', options: ['{9時|くじ}〜{3時|さんじ}', '{9時|くじ}〜{5時|ごじ}', '{4時|よじ}〜{3時|さんじ}', '{1時|いちじ}〜{3時|さんじ}'], correct: 0, why: 'くじ から さんじ まで.' },
        { q: 'ナタポンさんはいつアルバイトをしますか。', options: ['{月曜日|げつようび}から{金曜日|きんようび}まで', '{土曜日|どようび}と{日曜日|にちようび}', '{毎晩|まいばん}', '{金曜日|きんようび}と{土曜日|どようび}'], correct: 1, why: '「{土曜日|どようび}と{日曜日|にちようび}、コンビニでアルバイトをします。」' },
        { q: 'ナタポンさんのアルバイトは{何時|なんじ}までですか。', options: ['{午前|ごぜん}{10時|じゅうじ}', '{午後|ごご}{4時|よじ}', '{午後|ごご}{5時|ごじ}', '{午後|ごご}{9時|くじ}'], correct: 2, why: '「{午前|ごぜん}{10時|じゅうじ}から{午後|ごご}{5時|ごじ}まで」.' },
      ],
    },

    /* ── Bài 5: chép giờ ── */
    { t: 'h', text: 'Bài 5 — Chép giờ (nghe từng câu, viết dạng 4:10)' },
    {
      t: 'listen',
      id: 'b3-nghe-5',
      title: '{今|いま}、{何時|なんじ}ですか。',
      note: 'Mỗi câu một giờ. Bấm nghe từng câu, viết lại bằng số theo dạng giờ:phút (7 giờ rưỡi → 7:30).',
      lines: [
        { who: '1', voice: 'ja-nu', text: '{4時|よじ}{10分|じゅっぷん}です。', ro: 'Yoji juppun desu.', vi: '4:10' },
        { who: '2', voice: 'ja-nam', text: '{7時半|しちじはん}です。', ro: 'Shichiji han desu.', vi: '7:30' },
        { who: '3', voice: 'ja-nu', text: '{9時|くじ}{15分|じゅうごふん}です。', ro: 'Kuji jūgofun desu.', vi: '9:15' },
        { who: '4', voice: 'ja-nam', text: '{午後|ごご}{1時|いちじ}{20分|にじゅっぷん}です。', ro: 'Gogo ichiji nijuppun desu.', vi: '1:20 chiều' },
        { who: '5', voice: 'ja-nu', text: '{6時|ろくじ}{6分|ろっぷん}です。', ro: 'Rokuji roppun desu.', vi: '6:06' },
        { who: '6', voice: 'ja-nam', text: '{8時|はちじ}{45分|よんじゅうごふん}です。', ro: 'Hachiji yonjūgofun desu.', vi: '8:45' },
        { who: '7', voice: 'ja-nu', text: '{11時|じゅういちじ}{3分|さんぷん}です。', ro: 'Jūichiji sanpun desu.', vi: '11:03' },
        { who: '8', voice: 'ja-nam', text: '{午前|ごぜん}{2時|にじ}{40分|よんじゅっぷん}です。', ro: 'Gozen niji yonjuppun desu.', vi: '2:40 sáng' },
      ],
    },
    {
      t: 'quiz',
      id: 'b3-nghe-5-chep',
      title: 'Viết giờ bạn nghe được (dạng 4:10)',
      kind: 'fill',
      items: [
        { q: 'Câu 1', answers: ['4:10', '04:10', '4時10分'] },
        { q: 'Câu 2', answers: ['7:30', '07:30', '7時半', '7時30分'] },
        { q: 'Câu 3', answers: ['9:15', '09:15', '9時15分'] },
        { q: 'Câu 4 (buổi chiều — viết 1:20 hoặc 13:20)', answers: ['1:20', '13:20', '01:20', '午後1時20分'] },
        { q: 'Câu 5', answers: ['6:06', '06:06', '6時6分'] },
        { q: 'Câu 6', answers: ['8:45', '08:45', '8時45分'] },
        { q: 'Câu 7', answers: ['11:03', '11時3分'] },
        { q: 'Câu 8 (buổi sáng)', answers: ['2:40', '02:40', '午前2時40分', '2時40分'] },
      ],
    },

    /* ── Bài 6: chép ngày ── */
    { t: 'h', text: 'Bài 6 — Chép ngày tháng (dạng tháng/ngày, ví dụ 4/1)' },
    {
      t: 'listen',
      id: 'b3-nghe-6',
      title: '{何月何日|なんがつなんにち}ですか。',
      note: 'Người Nhật nói THÁNG trước, NGÀY sau. Viết lại dạng tháng/ngày: しがつ ついたち → 4/1.',
      lines: [
        { who: '1', voice: 'ja-nam', text: '{4月|しがつ}{1日|ついたち}です。', ro: 'Shigatsu tsuitachi desu.', vi: '4/1 (ngày 1 tháng 4)' },
        { who: '2', voice: 'ja-nu', text: '{5月|ごがつ}{20日|はつか}です。', ro: 'Gogatsu hatsuka desu.', vi: '5/20 (ngày 20 tháng 5)' },
        { who: '3', voice: 'ja-nam', text: '{9月|くがつ}{14日|じゅうよっか}です。', ro: 'Kugatsu jūyokka desu.', vi: '9/14 (ngày 14 tháng 9)' },
        { who: '4', voice: 'ja-nu', text: '{7月|しちがつ}{8日|ようか}です。', ro: 'Shichigatsu yōka desu.', vi: '7/8 (ngày 8 tháng 7)' },
        { who: '5', voice: 'ja-nam', text: '{3月|さんがつ}{24日|にじゅうよっか}です。', ro: 'Sangatsu nijūyokka desu.', vi: '3/24 (ngày 24 tháng 3)' },
        { who: '6', voice: 'ja-nu', text: '{10月|じゅうがつ}{9日|ここのか}です。', ro: 'Jūgatsu kokonoka desu.', vi: '10/9 (ngày 9 tháng 10)' },
      ],
    },
    {
      t: 'quiz',
      id: 'b3-nghe-6-chep',
      title: 'Viết ngày bạn nghe được (tháng/ngày)',
      kind: 'fill',
      items: [
        { q: 'Câu 1', answers: ['4/1', '4月1日'] },
        { q: 'Câu 2', answers: ['5/20', '5月20日'] },
        { q: 'Câu 3', answers: ['9/14', '9月14日'] },
        { q: 'Câu 4', answers: ['7/8', '7月8日'] },
        { q: 'Câu 5', answers: ['3/24', '3月24日'] },
        { q: 'Câu 6', answers: ['10/9', '10月9日'] },
      ],
    },
  ],
};

/* ══════════════════════════ 6. LUYỆN NÓI (dạng thi JPD113) ══════════════════════════ */

const NOI: Lesson = {
  id: 'b3-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi Lesson 3',
  goal: 'Trả lời trôi chảy, đủ câu, đúng trợ từ mọi câu hỏi Lesson 3 của đề thi nói JPD113 (giờ giấc, từ…đến…, ngày nghỉ, sinh hoạt hằng ngày) và đọc to được đoạn văn 100–110 chữ.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD113 (theo "Hướng dẫn ôn thi" của bộ môn)',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 3 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể một ngày / một tuần: giờ, thứ, へ・で・を.'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (biển giờ mở cửa, lịch…) trả lời 3 câu.', '{何時|なんじ}から{何時|なんじ}までですか・{休|やす}みは{何曜日|なんようび}ですか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{毎日|まいにち}、{何時|なんじ}に{起|お}きますか・{休|やす}みの{日|ひ}、{何|なに}をしますか…'],
        ['Presenting', '5', 'Chào khi vào và khi ra: しつれいします／ありがとうございました。', ''],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 3 có へ／で／に／を／から〜まで — soát kỹ nhất.',
        '**Câu Có/Không quên はい／いいえ**: bị trừ (tối đa 5 điểm).',
        '**Đúng ngữ pháp nhưng sai từ vựng**: chỉ được tối đa 3 điểm/câu. Nghe {何時|なんじ} (mấy giờ) mà trả lời thứ, nghe どこ (đâu) mà trả lời việc làm = sai hẳn.',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** (Mō ichido onegaishimasu) — hoặc nói chậm: **ゆっくりお{願|ねが}いします**.',
        'Luôn trả lời **câu đầy đủ** có động từ ～ます／～です, nhắc lại từ trong câu hỏi.',
      ],
    },

    /* ── Không tranh: giờ ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Giờ giấc' },
    {
      t: 'p',
      text: 'Các câu dưới đây lấy từ ngân hàng câu hỏi thi JPD113 (mục Lesson 3 của "Hướng dẫn ôn thi" và bộ câu hỏi không tranh). Câu trả lời là **mẫu** — thay giờ thật của bạn vào, nhưng **giữ nguyên khung câu**.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp về giờ',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{今|いま}は{何時|なんじ}ですか。', ro: 'Ima wa nanji desu ka.', vi: 'Bây giờ là mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{今|いま}は{2時|にじ}{15分|じゅうごふん}です。', ro: 'Ima wa niji jūgofun desu.', vi: 'Bây giờ là 2 giờ 15 phút. (Nhìn đồng hồ thật trong phòng thi.)' },
        { who: 'Giám thị', role: 'examiner', text: '{毎日|まいにち}、{何時|なんじ}に{起|お}きますか。', ro: 'Mainichi, nanji ni okimasu ka.', vi: 'Hằng ngày bạn dậy lúc mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}は{毎日|まいにち}、{6時半|ろくじはん}に{起|お}きます。', ro: 'Watashi wa mainichi, rokuji han ni okimasu.', vi: 'Hằng ngày tôi dậy lúc 6 rưỡi.' },
        { who: 'Giám thị', role: 'examiner', text: '{何時|なんじ}に{寝|ね}ますか。', ro: 'Nanji ni nemasu ka.', vi: 'Bạn ngủ lúc mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{毎晩|まいばん}、{11時|じゅういちじ}に{寝|ね}ます。', ro: 'Maiban, jūichiji ni nemasu.', vi: 'Tối nào tôi cũng ngủ lúc 11 giờ.' },
        { who: 'Giám thị', role: 'examiner', text: '{何時|なんじ}から{何時|なんじ}まで{勉強|べんきょう}しますか。', ro: 'Nanji kara nanji made benkyō shimasu ka.', vi: 'Bạn học từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{午前|ごぜん}{7時半|しちじはん}から{12時|じゅうにじ}まで{学校|がっこう}で{勉強|べんきょう}します。', ro: 'Gozen shichiji han kara jūniji made gakkō de benkyō shimasu.', vi: 'Tôi học ở trường từ 7 rưỡi sáng đến 12 giờ trưa.' },
        { who: 'Giám thị', role: 'examiner', text: '{何時|なんじ}から{何時|なんじ}まで{働|はたら}きますか。', ro: 'Nanji kara nanji made hatarakimasu ka.', vi: 'Bạn làm việc từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}は{学生|がくせい}です。{土曜日|どようび}、{1時|いちじ}から{6時|ろくじ}までコンビニで{働|はたら}きます。', ro: 'Watashi wa gakusei desu. Doyōbi, ichiji kara rokuji made konbini de hatarakimasu.', vi: 'Tôi là sinh viên. Thứ Bảy tôi làm ở cửa hàng tiện lợi từ 1 giờ đến 6 giờ.' },
        { who: 'Giám thị', role: 'examiner', text: 'あなたの{昼休|ひるやす}みは{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Anata no hiruyasumi wa nanji kara nanji made desu ka.', vi: 'Giờ nghỉ trưa của bạn từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{昼休|ひるやす}みは{12時|じゅうにじ}から{1時|いちじ}までです。', ro: 'Hiruyasumi wa jūniji kara ichiji made desu.', vi: 'Nghỉ trưa từ 12 giờ đến 1 giờ.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎朝|まいあさ}、{何時|なんじ}に{朝|あさ}ご{飯|はん}を{食|た}べますか。', ro: 'Maiasa, nanji ni asagohan o tabemasu ka.', vi: 'Sáng nào bạn cũng ăn sáng lúc mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{毎朝|まいあさ}、{7時|しちじ}に{朝|あさ}ご{飯|はん}を{食|た}べます。', ro: 'Maiasa, shichiji ni asagohan o tabemasu.', vi: 'Sáng nào tôi cũng ăn sáng lúc 7 giờ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm giờ',
      items: [
        '**{何時|なんじ}に** hỏi MỘT mốc → trả lời **～{時|じ}に** + động từ. **{何時|なんじ}から{何時|なんじ}まで** hỏi KHOẢNG → trả lời **～から～まで**.',
        'Đang đi làm thêm hay chưa đi làm cũng phải trả lời được câu {働|はたら}きますか — nói thật, nhưng **nói đủ câu**. Chưa đi làm: いいえ、{働|はたら}きません。{学生|がくせい}です。',
        'Kiểm tra lại cách đọc 4 giờ (よじ), 7 giờ (しちじ), 9 giờ (くじ) trước khi vào phòng thi.',
      ],
    },

    /* ── Không tranh: hoạt động ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Mỗi ngày làm gì, ăn uống gì' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp về sinh hoạt',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{毎日|まいにち}、{何|なに}をしますか。', ro: 'Mainichi, nani o shimasu ka.', vi: 'Hằng ngày bạn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{毎日|まいにち}、{学校|がっこう}へ{行|い}きます。{学校|がっこう}で{日本語|にほんご}を{勉強|べんきょう}します。', ro: 'Mainichi, gakkō e ikimasu. Gakkō de nihongo o benkyō shimasu.', vi: 'Hằng ngày tôi đến trường. Tôi học tiếng Nhật ở trường.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎朝|まいあさ}、{何|なに}を{食|た}べますか。', ro: 'Maiasa, nani o tabemasu ka.', vi: 'Sáng nào bạn cũng ăn gì?' },
        { who: 'Bạn', role: 'candidate', text: '{毎朝|まいあさ}、パンや{卵|たまご}などを{食|た}べます。', ro: 'Maiasa, pan ya tamago nado o tabemasu.', vi: 'Sáng nào tôi cũng ăn bánh mì, trứng, v.v.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎日|まいにち}、コーヒーを{飲|の}みますか。', ro: 'Mainichi, kōhī o nomimasu ka.', vi: 'Hằng ngày bạn có uống cà phê không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{飲|の}みます。{毎朝|まいあさ}、コーヒーを{飲|の}みます。', ro: 'Hai, nomimasu. Maiasa, kōhī o nomimasu.', vi: 'Có, tôi có uống. Sáng nào tôi cũng uống cà phê.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎日|まいにち}、{日本語|にほんご}を{勉強|べんきょう}しますか。', ro: 'Mainichi, nihongo o benkyō shimasu ka.', vi: 'Hằng ngày bạn có học tiếng Nhật không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{勉強|べんきょう}します。{毎晩|まいばん}、うちで{勉強|べんきょう}します。', ro: 'Hai, benkyō shimasu. Maiban, uchi de benkyō shimasu.', vi: 'Có. Tối nào tôi cũng học ở nhà.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎朝|まいあさ}、パンを{食|た}べますか。', ro: 'Maiasa, pan o tabemasu ka.', vi: 'Sáng nào bạn cũng ăn bánh mì à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{食|た}べません。ご{飯|はん}を{食|た}べます。', ro: 'Iie, tabemasen. Gohan o tabemasu.', vi: 'Không, tôi không ăn. Tôi ăn cơm.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎日|まいにち}、{音楽|おんがく}を{聞|き}きますか。', ro: 'Mainichi, ongaku o kikimasu ka.', vi: 'Hằng ngày bạn có nghe nhạc không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{聞|き}きます。{夜|よる}、うちで{音楽|おんがく}を{聞|き}きます。', ro: 'Hai, kikimasu. Yoru, uchi de ongaku o kikimasu.', vi: 'Có. Buổi tối tôi nghe nhạc ở nhà.' },
        { who: 'Giám thị', role: 'examiner', text: '{何|なに}を{読|よ}みますか。', ro: 'Nani o yomimasu ka.', vi: 'Bạn đọc gì?' },
        { who: 'Bạn', role: 'candidate', text: '{日本語|にほんご}の{本|ほん}を{読|よ}みます。', ro: 'Nihongo no hon o yomimasu.', vi: 'Tôi đọc sách tiếng Nhật.' },
        { who: 'Giám thị', role: 'examiner', text: 'コンビニで{何|なに}を{買|か}いますか。', ro: 'Konbini de nani o kaimasu ka.', vi: 'Bạn mua gì ở cửa hàng tiện lợi?' },
        { who: 'Bạn', role: 'candidate', text: 'お{弁当|べんとう}や{牛乳|ぎゅうにゅう}などを{買|か}います。', ro: 'Obentō ya gyūnyū nado o kaimasu.', vi: 'Tôi mua cơm hộp, sữa, v.v.' },
        { who: 'Giám thị', role: 'examiner', text: '{夜|よる}、{何|なに}を{見|み}ますか。', ro: 'Yoru, nani o mimasu ka.', vi: 'Buổi tối bạn xem gì?' },
        { who: 'Bạn', role: 'candidate', text: '{夜|よる}、テレビを{見|み}ます。', ro: 'Yoru, terebi o mimasu.', vi: 'Buổi tối tôi xem TV.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm hoạt động',
      items: [
        'Ngân hàng đề còn có **ばんごはんに{何|なに}を{飲|の}みますか** (Bữa tối bạn uống gì?) — ばんごはん = bữa tối (chưa có trong danh sách từ bài 3, cùng khuôn với {朝|あさ}ご{飯|はん}). Trả lời: **お{茶|ちゃ}を{飲|の}みます。**',
        '**あさごはんに{何|なに}を{食|た}べますか** = "bữa sáng ăn gì" — trả lời như trên: パンや{卵|たまご}などを{食|た}べます.',
        'Không ăn sáng thì nói đúng ポイント 23: **{何|なに}も{食|た}べません。コーヒーを{飲|の}みます。**',
      ],
    },

    /* ── Không tranh: nơi chốn, ngày nghỉ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Đi đâu, ở đâu, ngày nghỉ' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp về nơi chốn và ngày nghỉ',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{休|やす}みの{日|ひ}、どこへ{行|い}きますか。', ro: 'Yasumi no hi, doko e ikimasu ka.', vi: 'Ngày nghỉ bạn đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{休|やす}みの{日|ひ}、{公園|こうえん}へ{行|い}きます。', ro: 'Yasumi no hi, kōen e ikimasu.', vi: 'Ngày nghỉ tôi đi công viên.' },
        { who: 'Giám thị', role: 'examiner', text: '{休|やす}みの{日|ひ}、{何|なに}をしますか。', ro: 'Yasumi no hi, nani o shimasu ka.', vi: 'Ngày nghỉ bạn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{休|やす}みの{日|ひ}、{公園|こうえん}でテニスをします。', ro: 'Yasumi no hi, kōen de tenisu o shimasu.', vi: 'Ngày nghỉ tôi chơi tennis ở công viên.' },
        { who: 'Giám thị', role: 'examiner', text: '{日曜日|にちようび}はどこに{行|い}きますか。', ro: 'Nichiyōbi wa doko ni ikimasu ka.', vi: 'Chủ Nhật bạn đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{日曜日|にちようび}は{図書館|としょかん}へ{行|い}きます。', ro: 'Nichiyōbi wa toshokan e ikimasu.', vi: 'Chủ Nhật tôi đi thư viện.' },
        { who: 'Giám thị', role: 'examiner', text: '{図書館|としょかん}で{何|なに}をしますか。', ro: 'Toshokan de nani o shimasu ka.', vi: 'Bạn làm gì ở thư viện?' },
        { who: 'Bạn', role: 'candidate', text: '{図書館|としょかん}で{本|ほん}を{読|よ}みます。{日本語|にほんご}も{勉強|べんきょう}します。', ro: 'Toshokan de hon o yomimasu. Nihongo mo benkyō shimasu.', vi: 'Tôi đọc sách ở thư viện. Tôi cũng học tiếng Nhật.' },
        { who: 'Giám thị', role: 'examiner', text: 'どこで{勉強|べんきょう}しますか。', ro: 'Doko de benkyō shimasu ka.', vi: 'Bạn học ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{学校|がっこう}とうちで{勉強|べんきょう}します。', ro: 'Gakkō to uchi de benkyō shimasu.', vi: 'Tôi học ở trường và ở nhà.' },
        { who: 'Giám thị', role: 'examiner', text: '{夏休|なつやす}み、{国|くに}へ{帰|かえ}りますか。', ro: 'Natsuyasumi, kuni e kaerimasu ka.', vi: 'Nghỉ hè bạn có về quê không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{帰|かえ}ります。{国|くに}でアルバイトをします。', ro: 'Hai, kaerimasu. Kuni de arubaito o shimasu.', vi: 'Có, tôi về. Tôi làm thêm ở quê.' },
        { who: 'Giám thị', role: 'examiner', text: 'Aさんはどこへ{行|い}きますか。', ro: 'A-san wa doko e ikimasu ka.', vi: '(Nhìn tranh) A đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'Aさんは{銀行|ぎんこう}へ{行|い}きます。', ro: 'A-san wa ginkō e ikimasu.', vi: 'A đi ngân hàng.' },
        { who: 'Giám thị', role: 'examiner', text: '{休|やす}みの{日|ひ}、どこへ{行|い}きますか。', ro: 'Yasumi no hi, doko e ikimasu ka.', vi: 'Ngày nghỉ bạn đi đâu? (trả lời kiểu không đi đâu)' },
        { who: 'Bạn', role: 'candidate', text: 'どこへも{行|い}きません。うちでテレビを{見|み}ます。', ro: 'Doko e mo ikimasen. Uchi de terebi o mimasu.', vi: 'Tôi không đi đâu cả. Tôi xem TV ở nhà.' },
      ],
    },
    {
      t: 'note',
      title: 'BẪY lớn nhất: どこ hay なに?',
      items: [
        '**{休|やす}みの{日|ひ}、どこへ{行|い}きますか** hỏi NƠI → **～へ{行|い}きます**. **{休|やす}みの{日|ひ}、{何|なに}をしますか** hỏi VIỆC → **～を～ます**. Hai câu chỉ khác một từ — nghe kỹ từ để hỏi rồi mới đáp.',
        'Câu hỏi dùng **どこに** thì trả lời **～に{行|い}きます** hay **～へ{行|い}きます** đều đúng.',
        'Muốn an toàn thì trả lời cả hai: **{公園|こうえん}へ{行|い}きます。{公園|こうえん}でテニスをします。** — đúng dù giám thị hỏi どこ hay なに.',
        'Đừng cố nói dài bằng từ chưa học (~~{国|くに}で{家族|かぞく}と…~~ rồi bí): **はい、{帰|かえ}ります** + một câu chắc chắn đúng như **{国|くに}でアルバイトをします** là đủ điểm.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — biển giờ mở cửa, lịch' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Khung hỏi chỉ có vài câu: **これは{何|なん}ですか · {何時|なんじ}から{何時|なんじ}までですか · {何曜日|なんようび}から{何曜日|なんようび}までですか · {休|やす}みは{何曜日|なんようび}ですか／いつですか · ここで{何|なに}をしますか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — hai biển giờ (bài luyện nói của cô)',
      head: ['Biển', 'Giờ mở', 'Ngày nghỉ (Closed)'],
      rows: [
        ['A', '6:00 AM 〜 7:15 PM', 'Wed ({水曜日|すいようび})'],
        ['B', '9:00 AM 〜 5:00 PM', 'Sat, Sun ({土曜日|どようび}・{日曜日|にちようび})'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '（A）{何時|なんじ}から{何時|なんじ}までですか。', ro: '(A) Nanji kara nanji made desu ka.', vi: '(Biển A) Mở từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{午前|ごぜん}{6時|ろくじ}から{午後|ごご}{7時|しちじ}{15分|じゅうごふん}までです。', ro: 'Gozen rokuji kara gogo shichiji jūgofun made desu.', vi: 'Từ 6 giờ sáng đến 7 giờ 15 tối.' },
        { who: 'Giám thị', role: 'examiner', text: '（A）{休|やす}みは{何曜日|なんようび}ですか。', ro: '(A) Yasumi wa nan\'yōbi desu ka.', vi: '(Biển A) Nghỉ thứ mấy?' },
        { who: 'Bạn', role: 'candidate', text: '{休|やす}みは{水曜日|すいようび}です。', ro: 'Yasumi wa suiyōbi desu.', vi: 'Nghỉ thứ Tư.' },
        { who: 'Giám thị', role: 'examiner', text: '（B）{何時|なんじ}から{何時|なんじ}までですか。', ro: '(B) Nanji kara nanji made desu ka.', vi: '(Biển B) Mở từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{午前|ごぜん}{9時|くじ}から{午後|ごご}{5時|ごじ}までです。', ro: 'Gozen kuji kara gogo goji made desu.', vi: 'Từ 9 giờ sáng đến 5 giờ chiều.' },
        { who: 'Giám thị', role: 'examiner', text: '（B）{何曜日|なんようび}から{何曜日|なんようび}までですか。', ro: '(B) Nan\'yōbi kara nan\'yōbi made desu ka.', vi: '(Biển B) Mở từ thứ mấy đến thứ mấy?' },
        { who: 'Bạn', role: 'candidate', text: '{月曜日|げつようび}から{金曜日|きんようび}までです。{土曜日|どようび}と{日曜日|にちようび}は{休|やす}みです。', ro: 'Getsuyōbi kara kin\'yōbi made desu. Doyōbi to nichiyōbi wa yasumi desu.', vi: 'Từ thứ Hai đến thứ Sáu. Thứ Bảy và Chủ Nhật nghỉ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — ba biển hiệu toà nhà (ngân hàng câu hỏi có tranh JPD113)',
      head: ['Toà nhà', 'Giờ', 'Nghỉ'],
      rows: [
        ['さくら{病院|びょういん}', '9:30 〜 15:00', '—'],
        ['さくら{図書館|としょかん}', '9:00 〜 19:00', '{月曜日|げつようび}'],
        ['わかば{体育館|たいいくかん}', '8:30 〜 22:00', '{水曜日|すいようび}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: 'Đây là cái gì?' },
        { who: 'Bạn', role: 'candidate', text: 'それは{病院|びょういん}です。さくら{病院|びょういん}です。', ro: 'Sore wa byōin desu. Sakura byōin desu.', vi: 'Đó là bệnh viện. Bệnh viện Sakura.' },
        { who: 'Giám thị', role: 'examiner', text: '{病院|びょういん}は{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Byōin wa nanji kara nanji made desu ka.', vi: 'Bệnh viện mở từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{9時半|くじはん}から{午後|ごご}{3時|さんじ}までです。', ro: 'Kuji han kara gogo sanji made desu.', vi: 'Từ 9 rưỡi đến 3 giờ chiều.' },
        { who: 'Giám thị', role: 'examiner', text: '{図書館|としょかん}の{休|やす}みはいつですか。', ro: 'Toshokan no yasumi wa itsu desu ka.', vi: 'Thư viện nghỉ khi nào?' },
        { who: 'Bạn', role: 'candidate', text: '{図書館|としょかん}の{休|やす}みは{月曜日|げつようび}です。', ro: 'Toshokan no yasumi wa getsuyōbi desu.', vi: 'Thư viện nghỉ thứ Hai.' },
        { who: 'Giám thị', role: 'examiner', text: '{体育館|たいいくかん}は{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Taiikukan wa nanji kara nanji made desu ka.', vi: 'Nhà thi đấu mở từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{午前|ごぜん}{8時半|はちじはん}から{午後|ごご}{10時|じゅうじ}までです。', ro: 'Gozen hachiji han kara gogo jūji made desu.', vi: 'Từ 8 rưỡi sáng đến 10 giờ tối.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — bảng giờ nhà thi đấu (ngân hàng câu hỏi có tranh JPD113)',
      head: ['Nơi', 'Giờ mở', 'Ngày mở', 'Nghỉ'],
      rows: [['{体育館|たいいくかん}', '5:00 〜 23:30', '{月|げつ}〜{木|もく}・{土|ど}・{日|にち}', '{金曜日|きんようび}']],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ここはどこですか。', ro: 'Koko wa doko desu ka.', vi: 'Đây là đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'ここは{体育館|たいいくかん}です。', ro: 'Koko wa taiikukan desu.', vi: 'Đây là nhà thi đấu.' },
        { who: 'Giám thị', role: 'examiner', text: '{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Nanji kara nanji made desu ka.', vi: 'Mở từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{体育館|たいいくかん}は{午前|ごぜん}{5時|ごじ}から{午後|ごご}{11時半|じゅういちじはん}までです。', ro: 'Taiikukan wa gozen goji kara gogo jūichiji han made desu.', vi: 'Nhà thi đấu mở từ 5 giờ sáng đến 11 rưỡi đêm.' },
        { who: 'Giám thị', role: 'examiner', text: '{休|やす}みはいつですか。', ro: 'Yasumi wa itsu desu ka.', vi: 'Nghỉ khi nào?' },
        { who: 'Bạn', role: 'candidate', text: '{休|やす}みは{金曜日|きんようび}です。', ro: 'Yasumi wa kin\'yōbi desu.', vi: 'Nghỉ thứ Sáu.' },
        { who: 'Giám thị', role: 'examiner', text: 'ここで{何|なに}をしますか。', ro: 'Koko de nani o shimasu ka.', vi: 'Ở đây làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ここでスポーツをします。テニスやサッカーなどをします。', ro: 'Koko de supōtsu o shimasu. Tenisu ya sakkā nado o shimasu.', vi: 'Ở đây chơi thể thao. Chơi tennis, bóng đá, v.v.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 4 — một tuần của リンさん (tranh luyện thêm, dạng "{日曜日|にちようび}、どこへ{行|い}きますか")',
      head: ['Thứ', 'Nơi', 'Việc', 'Giờ'],
      rows: [
        ['{月|げつ}〜{金|きん}', '{学校|がっこう}', '{日本語|にほんご}を{勉強|べんきょう}します', '8:00 〜 12:00'],
        ['{土曜日|どようび}', 'コンビニ', 'アルバイトをします', '1:00 〜 6:00 PM'],
        ['{日曜日|にちようび}', '{公園|こうえん}', 'テニスをします', '—'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 4',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'リンさんは{日曜日|にちようび}、どこへ{行|い}きますか。', ro: 'Rin-san wa nichiyōbi, doko e ikimasu ka.', vi: 'Chủ Nhật Linh đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'リンさんは{日曜日|にちようび}、{公園|こうえん}へ{行|い}きます。', ro: 'Rin-san wa nichiyōbi, kōen e ikimasu.', vi: 'Chủ Nhật Linh đi công viên.' },
        { who: 'Giám thị', role: 'examiner', text: '{公園|こうえん}で{何|なに}をしますか。', ro: 'Kōen de nani o shimasu ka.', vi: 'Ở công viên làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{公園|こうえん}でテニスをします。', ro: 'Kōen de tenisu o shimasu.', vi: 'Chơi tennis ở công viên.' },
        { who: 'Giám thị', role: 'examiner', text: 'リンさんは{何曜日|なんようび}から{何曜日|なんようび}まで{学校|がっこう}へ{行|い}きますか。', ro: 'Rin-san wa nan\'yōbi kara nan\'yōbi made gakkō e ikimasu ka.', vi: 'Linh đi học từ thứ mấy đến thứ mấy?' },
        { who: 'Bạn', role: 'candidate', text: '{月曜日|げつようび}から{金曜日|きんようび}まで{学校|がっこう}へ{行|い}きます。', ro: 'Getsuyōbi kara kin\'yōbi made gakkō e ikimasu.', vi: 'Linh đi học từ thứ Hai đến thứ Sáu.' },
        { who: 'Giám thị', role: 'examiner', text: '{土曜日|どようび}、{何時|なんじ}から{何時|なんじ}まで{働|はたら}きますか。', ro: 'Doyōbi, nanji kara nanji made hatarakimasu ka.', vi: 'Thứ Bảy Linh làm từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{午後|ごご}{1時|いちじ}から{6時|ろくじ}までコンビニで{働|はたら}きます。', ro: 'Gogo ichiji kara rokuji made konbini de hatarakimasu.', vi: 'Linh làm ở cửa hàng tiện lợi từ 1 giờ đến 6 giờ chiều.' },
      ],
    },

    /* ── Nói dài: một ngày / một tuần ── */
    { t: 'h', text: 'Nói liền một đoạn — "Một ngày của tôi" / "Một tuần của tôi"' },
    {
      t: 'p',
      text: 'Học thuộc đoạn mẫu, rồi thay giờ và việc thật của bạn. Đoạn này trả lời được hầu hết câu hỏi không tranh ({毎日|まいにち}、{何|なに}をしますか · {何時|なんじ}に{起|お}きますか · {休|やす}みの{日|ひ}…).',
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{毎朝|まいあさ}、{6時半|ろくじはん}に{起|お}きます。', ro: 'Watashi wa maiasa, rokuji han ni okimasu.', vi: 'Sáng nào tôi cũng dậy lúc 6 rưỡi.' },
        { en: '{朝|あさ}ご{飯|はん}にパンや{果物|くだもの}などを{食|た}べます。{牛乳|ぎゅうにゅう}を{飲|の}みます。', ro: 'Asagohan ni pan ya kudamono nado o tabemasu. Gyūnyū o nomimasu.', vi: 'Bữa sáng tôi ăn bánh mì, hoa quả, v.v. Tôi uống sữa.' },
        { en: '{7時|しちじ}に{学校|がっこう}へ{行|い}きます。{7時半|しちじはん}から{12時|じゅうにじ}まで{日本語|にほんご}を{勉強|べんきょう}します。', ro: 'Shichiji ni gakkō e ikimasu. Shichiji han kara jūniji made nihongo o benkyō shimasu.', vi: 'Tôi đến trường lúc 7 giờ. Tôi học tiếng Nhật từ 7 rưỡi đến 12 giờ.' },
        { en: '{昼|ひる}ごはんは{学校|がっこう}で{食|た}べます。{午後|ごご}、{図書館|としょかん}で{本|ほん}を{読|よ}みます。', ro: 'Hirugohan wa gakkō de tabemasu. Gogo, toshokan de hon o yomimasu.', vi: 'Bữa trưa tôi ăn ở trường. Buổi chiều tôi đọc sách ở thư viện.' },
        { en: '{5時|ごじ}にうちへ{帰|かえ}ります。{夜|よる}、インターネットをします。{11時|じゅういちじ}に{寝|ね}ます。', ro: 'Goji ni uchi e kaerimasu. Yoru, intānetto o shimasu. Jūichiji ni nemasu.', vi: 'Tôi về nhà lúc 5 giờ. Buổi tối tôi lên mạng. Tôi ngủ lúc 11 giờ.' },
        { en: '{土曜日|どようび}、コンビニでアルバイトをします。{日曜日|にちようび}はどこへも{行|い}きません。うちでDVDを{見|み}ます。', ro: 'Doyōbi, konbini de arubaito o shimasu. Nichiyōbi wa doko e mo ikimasen. Uchi de dībuidī o mimasu.', vi: 'Thứ Bảy tôi làm thêm ở cửa hàng tiện lợi. Chủ Nhật tôi không đi đâu cả, xem DVD ở nhà.' },
      ],
    },

    /* ── Đọc to ── */
    { t: 'h', text: 'Reading (40 điểm) — đọc to đoạn văn' },
    {
      t: 'note',
      title: 'Cách đọc để không mất điểm',
      items: [
        'Mỗi ký tự đọc sai **−0,2 điểm**. Đọc chậm, rõ còn hơn nhanh mà vấp.',
        'Trợ từ: **は → wa, へ → e, を → o**. {学校|がっこう}へ = gakkō **e**, パンを = pan **o**.',
        'Giờ bất quy tắc: **{四時|よじ}**, **{七時|しちじ}**, **{九時|くじ}**. Trường âm kéo dài đủ: がっこう (gak-kō), きょう, べんきょう.',
        'Âm ngắt っ: ngừng một nhịp — がっこう, じゅっぷん, いっぷん.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'わたしは リンです。ベトナムじんです。まいあさ {六時|ろくじ}に おきます。パンや くだものなどを たべます。コーヒーを のみます。', ro: 'Watashi wa Rin desu. Betonamujin desu. Maiasa rokuji ni okimasu. Pan ya kudamono nado o tabemasu. Kōhī o nomimasu.', vi: 'Đoạn 1 (phần a): Tôi là Linh, người Việt Nam. Sáng nào tôi cũng dậy lúc 6 giờ. Tôi ăn bánh mì, hoa quả… Tôi uống cà phê.' },
        { en: '{月曜日|げつようび}から {金曜日|きんようび}まで、がっこうへ いきます。じゅぎょうは {九時|くじ}から {十二時|じゅうにじ}はんまでです。ごご、としょかんで にほんごを べんきょうします。', ro: 'Getsuyōbi kara kin\'yōbi made, gakkō e ikimasu. Jugyō wa kuji kara jūniji han made desu. Gogo, toshokan de nihongo o benkyō shimasu.', vi: 'Đoạn 1 (phần b): Từ thứ Hai đến thứ Sáu tôi đi học. Giờ học từ 9 giờ đến 12 rưỡi. Buổi chiều tôi học tiếng Nhật ở thư viện.' },
        { en: 'わたしは ナムです。{会社員|かいしゃいん}です。まいにち {八時|はちじ}に かいしゃへ いきます。{九時|くじ}から {六時|ろくじ}まで はたらきます。ひるごはんは コンビニで おべんとうを かいます。', ro: 'Watashi wa Namu desu. Kaishain desu. Mainichi hachiji ni kaisha e ikimasu. Kuji kara rokuji made hatarakimasu. Hirugohan wa konbini de obentō o kaimasu.', vi: 'Đoạn 2 (phần a): Tôi là Nam, nhân viên công ty. Hằng ngày tôi đến công ty lúc 8 giờ, làm từ 9 giờ đến 6 giờ. Bữa trưa tôi mua cơm hộp ở cửa hàng tiện lợi.' },
        { en: '{土曜日|どようび}、{体育館|たいいくかん}で テニスを します。{日曜日|にちようび}は どこへも いきません。うちで テレビや DVDなどを みます。よる {十一時|じゅういちじ}に ねます。', ro: 'Doyōbi, taiikukan de tenisu o shimasu. Nichiyōbi wa doko e mo ikimasen. Uchi de terebi ya dībuidī nado o mimasu. Yoru jūichiji ni nemasu.', vi: 'Đoạn 2 (phần b): Thứ Bảy tôi chơi tennis ở nhà thi đấu. Chủ Nhật tôi không đi đâu cả, ở nhà xem TV, DVD… Buổi tối tôi ngủ lúc 11 giờ.' },
        { en: 'わたしは ハノイの だいがくせいです。{夏休|なつやす}みは {七月|しちがつ}から {八月|はちがつ}までです。{七月|しちがつ}、ホームステイを します。{八月|はちがつ}、うみへ いきます。うみで バーベキューや はなびなどを します。', ro: 'Watashi wa Hanoi no daigakusei desu. Natsuyasumi wa shichigatsu kara hachigatsu made desu. Shichigatsu, hōmusutei o shimasu. Hachigatsu, umi e ikimasu. Umi de bābekyū ya hanabi nado o shimasu.', vi: 'Đoạn 3: Tôi là sinh viên đại học ở Hà Nội. Nghỉ hè từ tháng 7 đến tháng 8. Tháng 7 tôi đi homestay. Tháng 8 tôi đi biển, nướng BBQ, bắn pháo hoa… ở biển.' },
      ],
    },

    /* ── Ghi âm ── */
    {
      t: 'speak',
      id: 'b3-noi-ghi-1',
      part: '1',
      questions: [
        '{今|いま}は{何時|なんじ}ですか。',
        '{毎日|まいにち}、{何時|なんじ}に{起|お}きますか。',
        '{何時|なんじ}に{寝|ね}ますか。',
        '{何時|なんじ}から{何時|なんじ}まで{勉強|べんきょう}しますか。',
        '{毎朝|まいあさ}、{何|なに}を{食|た}べますか。',
        '{毎日|まいにち}、コーヒーを{飲|の}みますか。',
        '{休|やす}みの{日|ひ}、どこへ{行|い}きますか。',
        '{休|やす}みの{日|ひ}、{何|なに}をしますか。',
        'どこで{勉強|べんきょう}しますか。',
        '{夏休|なつやす}み、{国|くに}へ{帰|かえ}りますか。',
      ],
    },
    {
      t: 'speak',
      id: 'b3-noi-ghi-2',
      part: '2',
      questions: [
        'あなたの{1日|いちにち}について{話|はな}してください。(Kể về một ngày của bạn: mấy giờ dậy, ăn gì, học/làm từ mấy giờ đến mấy giờ, tối làm gì, mấy giờ ngủ.)',
        'あなたの{1週間|いっしゅうかん}について{話|はな}してください。(Kể về một tuần: thứ mấy đi học, thứ mấy làm thêm, cuối tuần đi đâu, làm gì.)',
      ],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b3-bai-tap',
  kind: 'homework',
  title: 'Bài tập — dịch, trợ từ, đọc giờ, ghép câu',
  goal: 'Tự viết và nói được câu bài 3 không cần nhìn mẫu: dịch Việt→Nhật, chọn đúng trợ từ, đọc đúng giờ/ngày bất quy tắc.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ kana (hiragana hoặc có chữ Hán đều được chấm đúng; có hay không dấu 、。 đều được). Không cần viết {私|わたし}は nếu đề không có "tôi".',
    },
    {
      t: 'quiz',
      id: 'b3-bt-dich',
      title: '1. Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'Khung câu: [Khi nào (に)] [Nơi で／へ] [Cái gì を] V ます／ません. から〜まで = từ…đến…; や〜など = …, … v.v.; 何も／どこへも + ません.',
      items: [
        { q: 'Bây giờ là 4 giờ 10 phút.', hint: '{今|いま} · {4時|よじ} · {10分|じゅっぷん} · です (ポイント giờ)', answers: A('今、4時10分です', 'いま、よじじゅっぷんです', '今4時10分です') },
        { q: 'Thư viện mở từ 9 giờ đến 7 giờ.', hint: '{図書館|としょかん}は · {9時|くじ}から · {7時|しちじ}まで · です (ポイント 21)', answers: A('図書館は9時から7時までです', 'としょかんはくじからしちじまでです') },
        { q: 'Ngày nghỉ là thứ mấy? — Là thứ Tư.', hint: '{休|やす}みは · {何曜日|なんようび} · {水曜日|すいようび} (viết câu hỏi rồi câu trả lời, ngăn bằng dấu 。)', answers: A('休みは何曜日ですか。水曜日です', '休みは何曜日ですか 水曜日です', 'やすみはなんようびですか。すいようびです', '休みは何曜日ですか水曜日です') },
        { q: 'Sáng nào tôi cũng dậy lúc 6 giờ.', hint: '{毎朝|まいあさ} (không に) · {6時|ろくじ}に · {起|お}きます (ポイント 19)', answers: A('毎朝6時に起きます', 'まいあさろくじにおきます', '私は毎朝6時に起きます', 'わたしはまいあさろくじにおきます', '毎朝、6時に起きます', '私は毎朝、6時に起きます') },
        { q: 'Tối nào tôi cũng ngủ lúc 11 giờ.', hint: '{毎晩|まいばん} · {11時|じゅういちじ}に · {寝|ね}ます', answers: A('毎晩11時に寝ます', 'まいばんじゅういちじにねます', '私は毎晩11時に寝ます', '毎晩、11時に寝ます') },
        { q: 'Chủ Nhật tôi đi thư viện.', hint: '{日曜日|にちようび} · {図書館|としょかん}へ · {行|い}きます (ポイント 17)', answers: A('日曜日図書館へ行きます', '日曜日、図書館へ行きます', '日曜日に図書館へ行きます', 'にちようびとしょかんへいきます', '日曜日図書館に行きます', '私は日曜日図書館へ行きます', '私は日曜日、図書館へ行きます') },
        { q: 'Tôi học tiếng Nhật ở thư viện.', hint: '{図書館|としょかん}で · {日本語|にほんご}を · {勉強|べんきょう}します (ポイント 18, 20)', answers: A('図書館で日本語を勉強します', 'としょかんでにほんごをべんきょうします', '私は図書館で日本語を勉強します', '日本語を図書館で勉強します') },
        { q: 'Nghỉ hè tôi về nước.', hint: '{夏休|なつやす}み · {国|くに}へ · {帰|かえ}ります', answers: A('夏休み国へ帰ります', '夏休み、国へ帰ります', '夏休みに国へ帰ります', 'なつやすみくにへかえります', '私は夏休み国へ帰ります', '私は夏休み、国へ帰ります', '夏休み国に帰ります') },
        { q: 'Tôi làm thêm ở cửa hàng tiện lợi từ 4 giờ đến 8 giờ.', hint: '{4時|よじ}から{8時|はちじ}まで · コンビニで · アルバイトをします', answers: A('4時から8時までコンビニでアルバイトをします', 'コンビニで4時から8時までアルバイトをします', 'よじからはちじまでコンビニでアルバイトをします', '私は4時から8時までコンビニでアルバイトをします') },
        { q: 'Buổi sáng tôi ăn bánh mì, salad, v.v.', hint: '{朝|あさ} · パンやサラダなど · を{食|た}べます (ポイント 22)', answers: A('朝パンやサラダなどを食べます', '朝、パンやサラダなどを食べます', 'あさパンやサラダなどをたべます', '私は朝パンやサラダなどを食べます', '私は朝、パンやサラダなどを食べます') },
        { q: 'Buổi sáng tôi không ăn gì cả.', hint: '{朝|あさ} · {何|なに}も · {食|た}べません (ポイント 23)', answers: A('朝何も食べません', '朝、何も食べません', 'あさなにもたべません', '私は朝何も食べません', '私は朝、何も食べません') },
        { q: 'Chiều nay tôi không đi đâu cả.', hint: '{午後|ごご} · どこへも · {行|い}きません (ポイント 23)', answers: A('午後どこへも行きません', '午後、どこへも行きません', 'ごごどこへもいきません', '午後どこも行きません', '私は午後どこへも行きません') },
        { q: 'Hằng ngày bạn có đọc báo không? — Không, tôi không đọc.', hint: '{毎日|まいにち} · {新聞|しんぶん}を{読|よ}みますか · いいえ、{読|よ}みません (ポイント 16)', answers: A('毎日新聞を読みますか。いいえ、読みません', '毎日、新聞を読みますか。いいえ、読みません', '毎日新聞を読みますか いいえ、読みません', 'まいにちしんぶんをよみますか。いいえ、よみません') },
        { q: 'Tuần lễ Vàng tôi nướng BBQ ở công viên.', hint: 'ゴールデンウイーク · {公園|こうえん}で · バーベキューをします', answers: A('ゴールデンウイーク公園でバーベキューをします', 'ゴールデンウイーク、公園でバーベキューをします', 'ゴールデンウィーク、公園でバーベキューをします', 'ゴールデンウィーク公園でバーベキューをします', 'ゴールデンウイークにこうえんでバーベキューをします', 'ゴールデンウイークに公園でバーベキューをします') },
        { q: 'Ngân hàng làm việc từ thứ Hai đến thứ Sáu.', hint: '{銀行|ぎんこう}は · {月曜日|げつようび}から{金曜日|きんようび}まで · です', answers: A('銀行は月曜日から金曜日までです', 'ぎんこうはげつようびからきんようびまでです') },
        { q: 'Mấy giờ bạn đến trường?', hint: '{何時|なんじ}に · {学校|がっこう}へ · {来|き}ますか', answers: A('何時に学校へ来ますか', 'なんじにがっこうへきますか', '何時に学校に来ますか', '何時に学校へ行きますか') },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-bt-tro-tu',
      title: '2. Chọn trợ từ đúng',
      items: [
        { q: '{毎晩|まいばん}、うち（　）テレビを{見|み}ます。', options: ['へ', 'で', 'に', 'を'], correct: 1, why: 'Xem TV Ở nhà → **で**.' },
        { q: '{冬休|ふゆやす}み、{北海道|ほっかいどう}（　）{行|い}きます。', options: ['で', 'を', 'へ', 'から'], correct: 2, why: 'Đi TỚI Hokkaido → **へ**.' },
        { q: '{北海道|ほっかいどう}（　）スキーをします。', options: ['で', 'へ', 'に', 'を'], correct: 0, why: 'Trượt tuyết Ở Hokkaido → **で**.' },
        { q: 'スキー（　）します。', options: ['で', 'を', 'に', 'へ'], correct: 1, why: 'Danh từ + **を**します.' },
        { q: '{11時|じゅういちじ}（　）{寝|ね}ます。', options: ['で', 'へ', 'に', 'を'], correct: 2, why: 'Mốc giờ có số → **に**.' },
        { q: '{毎日|まいにち}（　）{学校|がっこう}へ{行|い}きます。', options: ['に', 'không cần trợ từ', 'で', 'を'], correct: 1, why: '{毎日|まいにち} không đi với に (sách ghi rõ ~~{毎日|まいにち}に~~).' },
        { q: '{授業|じゅぎょう}は{9時|くじ}（　）です。(bắt đầu từ 9 giờ)', options: ['に', 'まで', 'から', 'で'], correct: 2, why: 'Từ 9 giờ → **から**.' },
        { q: '{図書館|としょかん}は{7時|しちじ}（　）です。(mở đến 7 giờ)', options: ['から', 'まで', 'に', 'や'], correct: 1, why: 'Đến 7 giờ → **まで**.' },
        { q: 'コンビニで{牛乳|ぎゅうにゅう}（　）チーズなどを{買|か}います。', options: ['と', 'や', 'を', 'も'], correct: 1, why: 'Có など phía sau → liệt kê ví dụ → **や**.' },
        { q: '{会社|かいしゃ}（　）{働|はたら}きます。', options: ['へ', 'を', 'で', 'に'], correct: 2, why: 'Làm việc TẠI công ty → **で**.' },
        { q: '{8時|はちじ}に{学校|がっこう}（　）{来|き}ます。', options: ['で', 'へ', 'を', 'から'], correct: 1, why: 'Đến trường (di chuyển tới) → **へ**.' },
        { q: '{朝|あさ}、{何|なに}（　）{飲|の}みません。(không uống gì cả)', options: ['を', 'も', 'や', 'で'], correct: 1, why: 'Phủ định hoàn toàn: **{何|なに}も**{飲|の}みません.' },
        { q: '{日曜日|にちようび}、どこ（　）{行|い}きますか。', options: ['で', 'を', 'へ', 'も'], correct: 2, why: 'Hỏi nơi đến: **どこへ**{行|い}きますか.' },
        { q: '{休|やす}みの{日|ひ}、どこで{何|なに}（　）しますか。', options: ['を', 'へ', 'で', 'に'], correct: 0, why: '{何|なに}**を**しますか.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b3-bt-doc-gio',
      title: '3. Viết cách đọc bằng hiragana',
      kind: 'fill',
      items: [
        { q: '4時', answers: ['よじ'] },
        { q: '9時', answers: ['くじ'] },
        { q: '7時', answers: ['しちじ'] },
        { q: '10分', answers: ['じゅっぷん', 'じっぷん'] },
        { q: '6分', answers: ['ろっぷん'] },
        { q: '3分', answers: ['さんぷん'] },
        { q: '9時半', answers: ['くじはん'] },
        { q: '何分', answers: ['なんぷん'] },
        { q: '4月', answers: ['しがつ'] },
        { q: '9月', answers: ['くがつ'] },
        { q: '1日 (ngày mùng 1)', answers: ['ついたち'] },
        { q: '8日', answers: ['ようか'] },
        { q: '20日', answers: ['はつか'] },
        { q: '14日', answers: ['じゅうよっか'] },
        { q: '水曜日', answers: ['すいようび'] },
        { q: '何曜日', answers: ['なんようび'] },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-bt-gio-ngay',
      title: '4. Chọn cách đọc đúng',
      items: [
        { q: '午後3時45分', options: ['ごご さんじ よんじゅうごふん', 'ごぜん さんじ よんじゅうごふん', 'ごご さんじ よんじゅうごぷん', 'ごご みっか よんじゅうごふん'], correct: 0, why: '45 phút = よんじゅう**ご**ふん (tận cùng 5 → ふん).' },
        { q: '午前8時20分', options: ['ごぜん はちじ にじゅうふん', 'ごぜん はちじ にじゅっぷん', 'ごご はちじ にじゅっぷん', 'ごぜん はっじ にじゅっぷん'], correct: 1, why: '20 phút = **にじゅっぷん** (tận cùng 0 → っぷん).' },
        { q: '7月24日', options: ['なながつ にじゅうよっか', 'しちがつ にじゅうよんにち', 'しちがつ にじゅうよっか', 'しがつ にじゅうよっか'], correct: 2, why: 'Tháng 7 = しちがつ; ngày 24 = にじゅう**よっか**.' },
        { q: '6月6日', options: ['ろくがつ むいか', 'ろくがつ ろくにち', 'ろっがつ むいか', 'むいがつ むいか'], correct: 0, why: 'Ngày 6 = **むいか**.' },
        { q: '9月9日', options: ['きゅうがつ ここのか', 'くがつ くにち', 'くがつ ここのか', 'きゅうがつ きゅうにち'], correct: 2, why: 'Tháng 9 = くがつ; ngày 9 = ここのか.' },
        { q: '4時4分', options: ['よじ よんぷん', 'よんじ よんぷん', 'よじ よんふん', 'しじ しふん'], correct: 0, why: '4 giờ = よじ, 4 phút = よんぷん — hai cách đọc 4 khác nhau.' },
        { q: '「なのか」— ngày mấy?', options: ['5日', '7日', '8日', '9日'], correct: 1, why: 'なのか = ngày **7**.' },
        { q: '「ようか」— ngày mấy?', options: ['4日', '8日', '10日', '14日'], correct: 1, why: 'ようか = ngày **8** (ngày 4 là よっか).' },
        { q: '「きんようび」は？', options: ['Thứ Hai', 'Thứ Tư', 'Thứ Sáu', 'Chủ Nhật'], correct: 2, why: '金曜日 = thứ Sáu.' },
        { q: '「もくようび」は？', options: ['Thứ Ba', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'], correct: 1, why: '木曜日 = thứ Năm.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b3-bt-chia',
      title: '5. Chia động từ sang thể phủ định (～ません)',
      kind: 'fill',
      items: [
        { q: '{行|い}きます → ?', answers: ['行きません', 'いきません'] },
        { q: '{帰|かえ}ります → ?', answers: ['帰りません', 'かえりません'] },
        { q: '{食|た}べます → ?', answers: ['食べません', 'たべません'] },
        { q: '{見|み}ます → ?', answers: ['見ません', 'みません'] },
        { q: 'します → ?', answers: ['しません'] },
        { q: '{来|き}ます → ?', answers: ['来ません', 'きません'] },
        { q: '{起|お}きます → ?', answers: ['起きません', 'おきません'] },
        { q: '{勉強|べんきょう}します → ?', answers: ['勉強しません', 'べんきょうしません'] },
      ],
    },
    {
      t: 'build',
      id: 'b3-bt-ghep',
      title: '6. Ghép câu hỏi – đáp',
      items: [
        { vi: 'Bưu điện mở từ mấy giờ đến mấy giờ?', chips: ['{郵便局|ゆうびんきょく}は', '{何時|なんじ}', 'から', '{何時|なんじ}', 'まで', 'ですか', 'に'], answer: ['{郵便局|ゆうびんきょく}は', '{何時|なんじ}', 'から', '{何時|なんじ}', 'まで', 'ですか'], ro: 'Yūbinkyoku wa nanji kara nanji made desu ka.' },
        { vi: 'Nghỉ hè từ bao giờ đến bao giờ?', chips: ['{夏休|なつやす}みは', 'いつ', 'から', 'いつ', 'まで', 'ですか', 'に'], answer: ['{夏休|なつやす}みは', 'いつ', 'から', 'いつ', 'まで', 'ですか'], ro: 'Natsuyasumi wa itsu kara itsu made desu ka.' },
        { vi: 'Ngày 5 tháng 4 là buổi ngắm hoa.', chips: ['{4月|しがつ}', '{5日|いつか}は', 'お{花見|はなみ}', 'です', '{4日|よっか}は'], answer: ['{4月|しがつ}', '{5日|いつか}は', 'お{花見|はなみ}', 'です'], ro: 'Shigatsu itsuka wa ohanami desu.' },
        { vi: 'Ở buổi ngắm hoa làm gì? — Ngắm hoa anh đào ở công viên.', chips: ['{公園|こうえん}', 'で', '{桜|さくら}', 'を', '{見|み}ます', 'へ'], answer: ['{公園|こうえん}', 'で', '{桜|さくら}', 'を', '{見|み}ます'], alt: [['{桜|さくら}', 'を', '{公園|こうえん}', 'で', '{見|み}ます']], ro: 'Kōen de sakura o mimasu.' },
        { vi: 'Tối nào bạn cũng học từ 8 giờ đến 10 giờ.', chips: ['{毎晩|まいばん}', '{8時|はちじ}', 'から', '{10時|じゅうじ}', 'まで', '{勉強|べんきょう}します', 'に'], answer: ['{毎晩|まいばん}', '{8時|はちじ}', 'から', '{10時|じゅうじ}', 'まで', '{勉強|べんきょう}します'], ro: 'Maiban hachiji kara jūji made benkyō shimasu.' },
        { vi: 'Buổi chiều tôi đi ngân hàng.', chips: ['{午後|ごご}', '{銀行|ぎんこう}', 'へ', '{行|い}きます', 'で'], answer: ['{午後|ごご}', '{銀行|ぎんこう}', 'へ', '{行|い}きます'], ro: 'Gogo ginkō e ikimasu.' },
        { vi: 'Bạn có về nhà lúc 6 giờ không? — Không, tôi không về.', chips: ['いいえ、', '{帰|かえ}りません', '{帰|かえ}ります', 'はい、'], answer: ['いいえ、', '{帰|かえ}りません'], ro: 'Iie, kaerimasen.' },
        { vi: 'Tôi xem TV, DVD, v.v. ở nhà.', chips: ['うち', 'で', 'テレビ', 'や', 'DVD', 'など', 'を', '{見|み}ます', 'と'], answer: ['うち', 'で', 'テレビ', 'や', 'DVD', 'など', 'を', '{見|み}ます'], ro: 'Uchi de terebi ya dībuidī nado o mimasu.' },
      ],
    },
  ],
};

/* ══════════════════════════ XUẤT ══════════════════════════ */

export const BAI_3: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
