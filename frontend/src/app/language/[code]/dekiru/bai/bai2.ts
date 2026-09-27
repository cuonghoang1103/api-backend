/**
 * Bài 2 — 買い物・食事 (Mua sắm, ăn uống) · できる日本語 初級 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 7–15 (これ/それ/あれ · この/その/あのN · ここ/そこ/あそこ/どこ ·
 * Nを(~つ)ください · いくら · 何のN · どこのN · 誰のN · N(~語)で) + bảng số đếm/giá tiền,
 * ~階, ~つ (表 p.285, p.287).
 * Từ vựng: đủ 82 mục trong danh sách từ mới Bài 2 của cô (sổ tra JPD123).
 * Hội thoại, câu ví dụ, bài nghe, bài đọc: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Toà nhà "みどりショッピングビル" và cửa hàng trong bài là tự đặt.
 */
import type { Lesson } from '@/components/sach-hoc/types';

/**
 * Đáp án gõ tiếng Nhật: máy so chỉ bỏ dấu . ? ! cuối câu và gộp dấu cách, nên
 * sinh sẵn các biến thể có/không 。, có/không dấu cách, có/không 、, số nửa/toàn
 * khổ. Phần tử đầu (có 。) là đáp án hiển thị.
 */
const A = (...xs: string[]): string[] => {
  const out = new Set<string>();
  const full = (s: string) => s.replace(/[0-9]/g, (d) => String.fromCharCode(d.charCodeAt(0) + 0xfee0));
  for (const x of xs) {
    const base = x.replace(/[。．.]$/, '');
    const forms = [base, base.replace(/[\s　]+/g, ''), base.replace(/、/g, ''), base.replace(/[\s　、]+/g, '')];
    for (const f of forms) {
      for (const g of [f, full(f)]) {
        out.add(g + '。');
        out.add(g);
      }
    }
  }
  return [...out];
};

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b2-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — Hỏi chỗ, hỏi giá, gọi món',
  goal: 'Hỏi được đồ mình cần mua ở tầng nào/chỗ nào, hỏi giá rồi mua, gọi món ở nhà hàng và hỏi đồ bỏ quên là của ai.',
  minutes: 30,
  blocks: [
    { t: 'h', text: 'Học xong bài này bạn làm được gì? (できる)' },
    {
      t: 'table',
      head: ['#', 'Mục tiêu (できる)', 'Câu then chốt'],
      rows: [
        ['1', 'Hỏi được **đồ mình muốn mua ở đâu** (tầng mấy, chỗ nào).', '～は{何階|なんがい}ですか。・～はどこですか。'],
        ['2', 'Hỏi được **giá** của đồ mình muốn mua, rồi chọn mua.', '～はいくらですか。・～をください。'],
        ['3', '**Gọi món** ở nhà hàng; hỏi món làm từ gì, của nước nào, tiếng Anh gọi là gì.', '{注文|ちゅうもん}をお{願|ねが}いします。・～を～つください。'],
        ['4', 'Hỏi **đồ bỏ quên là của ai**.', 'これは{誰|だれ}の～ですか。'],
      ],
    },
    {
      t: 'p',
      text: 'Cả bài diễn ra trong một toà nhà mua sắm tự đặt tên là **みどりショッピングビル** (Midori shoppingu biru). Bảng dưới đây dùng suốt bài — ở phần ngữ pháp, bài nghe và bài nói bạn sẽ gặp lại nó.',
    },
    {
      t: 'table',
      caption: 'Sơ đồ tầng — みどりショッピングビル',
      head: ['Tầng', 'Đọc là', 'Có gì'],
      rows: [
        ['5{階|かい}', 'ごかい (go-kai)', 'レストラン · トイレ'],
        ['4{階|かい}', 'よんかい (yon-kai)', 'サクラ{電器|でんき} (điện máy): カメラ · {携帯電話|けいたいでんわ} · {電子辞書|でんしじしょ} · パソコン'],
        ['3{階|かい}', '**さんがい** (san-gai)', '{100円|ひゃくえん}ショップ · きつえんじょ · トイレ'],
        ['2{階|かい}', 'にかい (ni-kai)', 'くつ{屋|や} · {本屋|ほんや} · quần áo, phụ kiện: Tシャツ · ズボン · かばん · {時計|とけい}'],
        ['1{階|かい}', '**いっかい** (ikkai)', 'インフォメーション · ATM · きっさてん · ケーキ{屋|や} · トイレ'],
        ['{地下|ちか}1{階|かい}', '**ちかいっかい** (chika ikkai)', 'スーパー: {魚|さかな} · {肉|にく} · {野菜|やさい} · {米|こめ} · {卵|たまご} · {油|あぶら} · パン · {水|みず}'],
      ],
    },

    { t: 'h', text: 'Tình huống 1 — どこですか: Hỏi chỗ bán đồ' },
    {
      t: 'p',
      text: 'Marco muốn mua sách. Anh hỏi nhân viên ở **quầy thông tin** (インフォメーション) xem hiệu sách ở tầng mấy, rồi hỏi luôn siêu thị.',
    },
    {
      t: 'dialogue',
      title: '① Ở quầy thông tin',
      lines: [
        { who: 'マルコ', role: 'a', text: 'あのう、すみません。{本屋|ほんや}は{何階|なんがい}ですか。', ro: 'Anoo, sumimasen. Hon-ya wa nan-gai desu ka.', vi: 'Anh chị ơi, cho tôi hỏi. Hiệu sách ở tầng mấy ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: '{本屋|ほんや}ですか。{2階|にかい}です。', ro: 'Hon-ya desu ka. Ni-kai desu.', vi: 'Hiệu sách ạ? Ở tầng 2.' },
        { who: 'マルコ', role: 'a', text: 'そうですか。じゃ、スーパーは{何階|なんがい}ですか。', ro: 'Sou desu ka. Ja, suupaa wa nan-gai desu ka.', vi: 'Thế à. Vậy siêu thị ở tầng mấy ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'スーパーは{地下|ちか}{1階|いっかい}です。', ro: 'Suupaa wa chika ikkai desu.', vi: 'Siêu thị ở tầng hầm 1.' },
        { who: 'マルコ', role: 'a', text: '{地下|ちか}{1階|いっかい}…。どうもありがとうございます。', ro: 'Chika ikkai… Doumo arigatou gozaimasu.', vi: 'Tầng hầm 1… Cảm ơn chị nhiều.' },
      ],
    },
    {
      t: 'p',
      text: 'Park đang ở sảnh tầng 1. Cậu hỏi một người khách khác (Wang) chỗ nhà vệ sinh và máy ATM.',
    },
    {
      t: 'dialogue',
      title: '② Hỏi người bên cạnh',
      lines: [
        { who: 'パク', role: 'a', text: 'あのう、すみません。トイレはどこですか。', ro: 'Anoo, sumimasen. Toire wa doko desu ka.', vi: 'Xin lỗi, cho tôi hỏi. Nhà vệ sinh ở đâu ạ?' },
        { who: 'ワン', role: 'c', text: 'トイレですか。トイレはあそこですよ。', ro: 'Toire desu ka. Toire wa asoko desu yo.', vi: 'Nhà vệ sinh à? Nhà vệ sinh ở đằng kia kìa.' },
        { who: 'パク', role: 'a', text: 'あそこですか。ATMもあそこですか。', ro: 'Asoko desu ka. Ee-tii-emu mo asoko desu ka.', vi: 'Đằng kia ạ. ATM cũng ở đằng kia ạ?' },
        { who: 'ワン', role: 'c', text: 'いいえ、ATMはそこですよ。', ro: 'Iie, ee-tii-emu wa soko desu yo.', vi: 'Không, ATM ở ngay chỗ bạn đấy (ngay cạnh bạn).' },
        { who: 'パク', role: 'a', text: 'あ、ここですね。どうもありがとうございます。', ro: 'A, koko desu ne. Doumo arigatou gozaimasu.', vi: 'A, ở đây à. Cảm ơn bạn nhiều.' },
      ],
    },
    {
      t: 'p',
      text: 'Park lên tầng 4, vào cửa hàng điện máy サクラ{電器|でんき}. Nhân viên đón khách, Park hỏi chỗ bày kim từ điển và máy ảnh.',
    },
    {
      t: 'dialogue',
      title: '③ Trong cửa hàng',
      lines: [
        { who: '{店員|てんいん}', role: 'b', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { who: 'パク', role: 'a', text: 'すみません、{電子辞書|でんしじしょ}はどこですか。', ro: 'Sumimasen, denshi jisho wa doko desu ka.', vi: 'Xin lỗi, kim từ điển ở đâu ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: '{電子辞書|でんしじしょ}はこちらです。', ro: 'Denshi jisho wa kochira desu.', vi: 'Kim từ điển ở phía này ạ.' },
        { who: 'パク', role: 'a', text: 'ありがとうございます。あのう、カメラはどちらですか。', ro: 'Arigatou gozaimasu. Anoo, kamera wa dochira desu ka.', vi: 'Cảm ơn chị. À, máy ảnh ở phía nào ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'カメラはあちらです。', ro: 'Kamera wa achira desu.', vi: 'Máy ảnh ở phía đằng kia ạ.' },
        { who: 'パク', role: 'a', text: 'あちらですか。どうもありがとうございます。', ro: 'Achira desu ka. Doumo arigatou gozaimasu.', vi: 'Đằng kia ạ. Cảm ơn chị nhiều.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '～は{何階|なんがい}ですか。', ro: '~ wa nan-gai desu ka.', vi: '～ ở tầng mấy? (hỏi ở quầy thông tin)' },
        { en: '～はどこですか。／～はどちらですか。', ro: '~ wa doko desu ka. / ~ wa dochira desu ka.', vi: '～ ở đâu? (どちら lịch sự hơn)' },
        { en: '～はここ／そこ／あそこです。', ro: '~ wa koko / soko / asoko desu.', vi: '～ ở đây / ở chỗ bạn / ở đằng kia.' },
        { en: '～はこちら／そちら／あちらです。', ro: '~ wa kochira / sochira / achira desu.', vi: 'Cách nói lịch sự của nhân viên: phía này / phía đó / phía kia.' },
        { en: 'あのう、すみません。', ro: 'Anoo, sumimasen.', vi: 'Câu mở lời trước khi hỏi người lạ (đã học Bài 1).' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        'Trả lời xong, người Nhật hay **nhắc lại** chữ vừa nghe để xác nhận: {本屋|ほんや}ですか。/ あちらですか。— bạn cũng nên làm vậy, vừa lịch sự vừa có thời gian nghĩ.',
        '…ですよ ở cuối câu (あそこですよ) là "…đấy/kìa", báo cho người kia một điều họ chưa biết. Bài 6 mới học kỹ; giờ chỉ cần hiểu khi nghe.',
        '…ですね (ここですね) là "…nhỉ/à" khi xác nhận. Cũng chỉ cần nghe hiểu.',
      ],
    },

    { t: 'h', text: 'Tình huống 2 — いくらですか: Hỏi giá rồi mua' },
    {
      t: 'p',
      text: 'Nataphon ở khu quần áo tầng 2. Cô hỏi giá cái áo phông mình đang cầm, cái quần ở xa, rồi quyết định mua.',
    },
    {
      t: 'dialogue',
      title: '④ Ở khu quần áo',
      lines: [
        { who: '{店員|てんいん}', role: 'b', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { who: 'ナタポン', role: 'a', text: 'すみません。このTシャツはいくらですか。', ro: 'Sumimasen. Kono tii shatsu wa ikura desu ka.', vi: 'Xin lỗi. Cái áo phông này bao nhiêu tiền ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'そのTシャツは{1,800円|せんはっぴゃくえん}です。', ro: 'Sono tii shatsu wa sen happyaku en desu.', vi: 'Cái áo phông đó 1.800 yên ạ.' },
        { who: 'ナタポン', role: 'a', text: 'そうですか。あのズボンはいくらですか。', ro: 'Sou desu ka. Ano zubon wa ikura desu ka.', vi: 'Thế à. Cái quần đằng kia bao nhiêu ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'あれは{4,500円|よんせんごひゃくえん}です。', ro: 'Are wa yonsen gohyaku en desu.', vi: 'Cái kia 4.500 yên ạ.' },
        { who: 'ナタポン', role: 'a', text: 'じゃ、このTシャツをください。', ro: 'Ja, kono tii shatsu o kudasai.', vi: 'Vậy cho tôi cái áo phông này.' },
        { who: '{店員|てんいん}', role: 'b', text: 'ありがとうございます。{1,800円|せんはっぴゃくえん}です。', ro: 'Arigatou gozaimasu. Sen happyaku en desu.', vi: 'Cảm ơn quý khách. Của quý khách 1.800 yên ạ.' },
      ],
    },
    {
      t: 'dialogue',
      title: '⑤ Ở quầy đồng hồ — so hai cái rồi chọn',
      lines: [
        { who: 'ナタポン', role: 'a', text: 'すみません、この{時計|とけい}はいくらですか。', ro: 'Sumimasen, kono tokei wa ikura desu ka.', vi: 'Xin lỗi, cái đồng hồ này bao nhiêu ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'それは{12,000円|いちまんにせんえん}です。', ro: 'Sore wa ichiman nisen en desu.', vi: 'Cái đó 12.000 yên ạ.' },
        { who: 'ナタポン', role: 'a', text: 'そうですか。その{時計|とけい}はいくらですか。', ro: 'Sou desu ka. Sono tokei wa ikura desu ka.', vi: 'Thế à. Cái đồng hồ chị đang cầm bao nhiêu ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'これですか。これは{6,800円|ろくせんはっぴゃくえん}です。', ro: 'Kore desu ka. Kore wa rokusen happyaku en desu.', vi: 'Cái này ạ? Cái này 6.800 yên.' },
        { who: 'ナタポン', role: 'a', text: 'じゃ、それをください。', ro: 'Ja, sore o kudasai.', vi: 'Vậy cho tôi cái đó.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'これはいくらですか。', ro: 'Kore wa ikura desu ka.', vi: 'Cái này bao nhiêu tiền?' },
        { en: 'この／その／あの ～はいくらですか。', ro: 'Kono / sono / ano ~ wa ikura desu ka.', vi: 'Cái ～ này / đó / kia bao nhiêu tiền?' },
        { en: '～{円|えん}です。', ro: '~ en desu.', vi: '～ yên.' },
        { en: 'じゃ、それをください。', ro: 'Ja, sore o kudasai.', vi: 'Vậy thì cho tôi cái đó.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý: これ ↔ それ đổi theo người cầm',
      items: [
        'Nataphon cầm áo nên nói **この**Tシャツ; nhân viên nhìn áo trong tay khách nên đáp **その**Tシャツ. Đồ ở xa cả hai → **あの**／**あれ**.',
        'Khi thi, **giám thị cầm tranh** và hỏi これは…？ → bạn đáp **それは…**. Xem kỹ ở phần Ngữ pháp, ポイント 7.',
      ],
    },

    { t: 'h', text: 'Tình huống 3 — レストラン: Gọi món' },
    {
      t: 'p',
      text: 'Wang, Park và Marco ăn trưa ở nhà hàng tầng 5. Wang hỏi một món trong thực đơn làm từ gì và tiếng Anh gọi là gì; Park hỏi bia của nước nào; rồi cả ba gọi món.',
    },
    {
      t: 'dialogue',
      title: '⑥ Gọi món',
      lines: [
        { who: '{店員|てんいん}', role: 'b', text: 'いらっしゃいませ。こちらへどうぞ。', ro: 'Irasshaimase. Kochira e douzo.', vi: 'Kính chào quý khách. Mời quý khách đi lối này.' },
        { who: 'ワン', role: 'a', text: 'すみません、{注文|ちゅうもん}をお{願|ねが}いします。', ro: 'Sumimasen, chuumon o onegai shimasu.', vi: 'Xin lỗi, cho chúng tôi gọi món.' },
        { who: '{店員|てんいん}', role: 'b', text: 'はい、どうぞ。', ro: 'Hai, douzo.', vi: 'Vâng, xin mời.' },
        { who: 'ワン', role: 'a', text: 'これは{何|なん}の{料理|りょうり}ですか。', ro: 'Kore wa nan no ryouri desu ka.', vi: 'Đây là món (làm từ) gì vậy?' },
        { who: '{店員|てんいん}', role: 'b', text: 'それは{鶏肉|とりにく}の{料理|りょうり}です。', ro: 'Sore wa toriniku no ryouri desu.', vi: 'Đó là món thịt gà ạ.' },
        { who: 'ワン', role: 'a', text: 'とりにく？「とりにく」は{英語|えいご}で{何|なん}ですか。', ro: 'Toriniku? "Toriniku" wa eigo de nan desu ka.', vi: 'Toriniku? "Toriniku" tiếng Anh là gì ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: '「chicken」です。', ro: '"Chicken" desu.', vi: 'Là "chicken" ạ.' },
        { who: 'ワン', role: 'a', text: 'そうですか。じゃ、これを{1|ひと}つください。', ro: 'Sou desu ka. Ja, kore o hitotsu kudasai.', vi: 'Thế à. Vậy cho tôi một phần món này.' },
        { who: 'パク', role: 'c', text: 'このビールはどこのビールですか。', ro: 'Kono biiru wa doko no biiru desu ka.', vi: 'Bia này là bia nước nào ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'ドイツのビールです。', ro: 'Doitsu no biiru desu.', vi: 'Là bia Đức ạ.' },
        { who: 'パク', role: 'c', text: 'じゃ、ハンバーグを{1|ひと}つとビールを{2|ふた}つください。', ro: 'Ja, hanbaagu o hitotsu to biiru o futatsu kudasai.', vi: 'Vậy cho tôi một thịt băm viên và hai bia.' },
        { who: 'マルコ', role: 'a', text: '{私|わたし}はとんかつとご{飯|はん}をください。それから、コーヒーを{1|ひと}つ。', ro: 'Watashi wa tonkatsu to gohan o kudasai. Sorekara, koohii o hitotsu.', vi: 'Tôi lấy thịt lợn chiên xù và cơm. Thêm một cà phê nữa.' },
        { who: '{店員|てんいん}', role: 'b', text: 'はい。{少々|しょうしょう}お{待|ま}ちください。', ro: 'Hai. Shoushou omachi kudasai.', vi: 'Vâng. Xin quý khách chờ một chút.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{注文|ちゅうもん}をお{願|ねが}いします。', ro: 'Chuumon o onegai shimasu.', vi: 'Cho tôi gọi món. (gọi nhân viên lại bàn)' },
        { en: 'これは{何|なん}の{料理|りょうり}ですか。', ro: 'Kore wa nan no ryouri desu ka.', vi: 'Đây là món (làm từ) gì?' },
        { en: 'これはどこのビールですか。', ro: 'Kore wa doko no biiru desu ka.', vi: 'Đây là bia nước nào?' },
        { en: '「～」は{英語|えいご}で{何|なん}ですか。', ro: '"~" wa eigo de nan desu ka.', vi: '"～" tiếng Anh là gì?' },
        { en: 'カレーを{2|ふた}つとビールを{1|ひと}つください。', ro: 'Karee o futatsu to biiru o hitotsu kudasai.', vi: 'Cho tôi hai cà ri và một bia.' },
      ],
    },
    {
      t: 'note',
      title: 'Câu nhân viên hay nói (chỉ cần nghe hiểu)',
      items: [
        'こちらへどうぞ (kochira e douzo) — Mời đi lối này.',
        'メニューです／どうぞ、メニューです (menyuu) — Thực đơn đây ạ.',
        '{少々|しょうしょう}お{待|ま}ちください (shoushou omachi kudasai) — Xin chờ một chút.',
        'それから (sorekara) — "thêm nữa là…" (Bài 5 mới học kỹ).',
      ],
    },

    { t: 'h', text: 'Tình huống 4 — Đồ bỏ quên: của ai?' },
    {
      t: 'p',
      text: 'Ăn xong, cả nhóm ra quầy tính tiền. Park thấy trên bàn còn một cái ví và một cái điện thoại.',
    },
    {
      t: 'dialogue',
      title: '⑦ Cái ví của ai?',
      lines: [
        { who: 'パク', role: 'a', text: 'あ、{財布|さいふ}！これは{誰|だれ}の{財布|さいふ}ですか。', ro: 'A, saifu! Kore wa dare no saifu desu ka.', vi: 'Ơ, cái ví! Đây là ví của ai vậy?' },
        { who: 'ワン', role: 'b', text: 'あ、それは{私|わたし}の{財布|さいふ}です。ありがとうございます。', ro: 'A, sore wa watashi no saifu desu. Arigatou gozaimasu.', vi: 'A, đó là ví của tôi. Cảm ơn cậu.' },
        { who: 'パク', role: 'a', text: 'この{携帯電話|けいたいでんわ}もワンさんのですか。', ro: 'Kono keitai denwa mo Wan-san no desu ka.', vi: 'Cái điện thoại này cũng là của Wang à?' },
        { who: 'ワン', role: 'b', text: 'いいえ、それはマルコさんの{携帯電話|けいたいでんわ}です。マルコさん、{携帯電話|けいたいでんわ}！', ro: 'Iie, sore wa Maruko-san no keitai denwa desu. Maruko-san, keitai denwa!', vi: 'Không, đó là điện thoại của Marco. Marco ơi, điện thoại!' },
        { who: 'マルコ', role: 'c', text: 'あ、すみません。どうもありがとうございます。', ro: 'A, sumimasen. Doumo arigatou gozaimasu.', vi: 'A, xin lỗi. Cảm ơn nhiều nhé.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'これは{誰|だれ}の～ですか。', ro: 'Kore wa dare no ~ desu ka.', vi: 'Đây là ～ của ai?' },
        { en: 'それは{私|わたし}の～です。', ro: 'Sore wa watashi no ~ desu.', vi: 'Đó là ～ của tôi.' },
        { en: 'それは～さんのです。', ro: 'Sore wa ~-san no desu.', vi: 'Đó là của anh/chị ～. (bỏ danh từ sau の)' },
      ],
    },

    { t: 'h', text: 'できる！— Chợ đồ cũ trong lớp (フリーマーケット)' },
    {
      t: 'p',
      text: 'Trong lớp, một nửa làm **người bán** (tự đặt giá cho đồ của mình — ở Nhật món này khoảng bao nhiêu yên?), nửa kia làm **khách**: hỏi đồ bày ở đâu, hỏi giá, rồi mua. Đoạn mẫu dưới đây: Nataphon bán, Marco mua.',
    },
    {
      t: 'dialogue',
      title: '⑧ Chợ đồ cũ',
      lines: [
        { who: 'ナタポン', role: 'b', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Mời vào xem ạ.' },
        { who: 'マルコ', role: 'a', text: 'すみません、{本|ほん}はどこですか。', ro: 'Sumimasen, hon wa doko desu ka.', vi: 'Cho hỏi, sách ở đâu?' },
        { who: 'ナタポン', role: 'b', text: '{本|ほん}はそこです。', ro: 'Hon wa soko desu.', vi: 'Sách ở chỗ bạn đứng đó.' },
        { who: 'マルコ', role: 'a', text: 'この{本|ほん}はいくらですか。', ro: 'Kono hon wa ikura desu ka.', vi: 'Quyển sách này bao nhiêu?' },
        { who: 'ナタポン', role: 'b', text: 'それは{300円|さんびゃくえん}です。', ro: 'Sore wa sanbyaku en desu.', vi: 'Quyển đó 300 yên.' },
        { who: 'マルコ', role: 'a', text: 'じゃ、これをください。それから、そのペンはいくらですか。', ro: 'Ja, kore o kudasai. Sorekara, sono pen wa ikura desu ka.', vi: 'Vậy cho mình quyển này. Còn cái bút đó bao nhiêu?' },
        { who: 'ナタポン', role: 'b', text: 'ペンは{1|ひと}つ{100円|ひゃくえん}です。', ro: 'Pen wa hitotsu hyaku en desu.', vi: 'Bút 100 yên một cái.' },
        { who: 'マルコ', role: 'a', text: 'じゃ、ペンを{2|ふた}つください。', ro: 'Ja, pen o futatsu kudasai.', vi: 'Vậy cho mình hai cái bút.' },
        { who: 'ナタポン', role: 'b', text: 'ありがとうございます。', ro: 'Arigatou gozaimasu.', vi: 'Cảm ơn bạn.' },
      ],
    },

    { t: 'h', text: 'Đọc – nói: 好きな店 (Cửa hàng tôi thích)' },
    {
      t: 'p',
      text: 'Đoạn văn mẫu giới thiệu một cửa hàng mình thích (tự đặt). Đọc to từng câu, rồi thay tên quán, món, giá để nói về quán **của bạn**.',
    },
    {
      t: 'examples',
      items: [
        { en: 'ここは「ひまわり」です。', ro: 'Koko wa "Himawari" desu.', vi: 'Đây là quán "Himawari".' },
        { en: 'きっさてんです。{地下|ちか}{1階|いっかい}です。', ro: 'Kissaten desu. Chika ikkai desu.', vi: 'Là một quán giải khát. Ở tầng hầm 1.' },
        { en: 'これはひまわりのイチゴのケーキです。', ro: 'Kore wa Himawari no ichigo no keeki desu.', vi: 'Đây là bánh dâu tây của quán Himawari.' },
        { en: '{1|ひと}つ{450円|よんひゃくごじゅうえん}です。', ro: 'Hitotsu yonhyaku gojuu en desu.', vi: '450 yên một cái.' },
        { en: 'コーヒーは{380円|さんびゃくはちじゅうえん}です。おいしいです。', ro: 'Koohii wa sanbyaku hachijuu en desu. Oishii desu.', vi: 'Cà phê 380 yên. Ngon lắm.' },
      ],
    },
    {
      t: 'table',
      caption: 'Ba câu để phỏng vấn bạn cùng lớp về cửa hàng họ thích',
      head: ['Câu hỏi', 'Romaji', 'Nghĩa'],
      rows: [
        ['{店|みせ}の{名前|なまえ}は{何|なん}ですか。', 'Mise no namae wa nan desu ka.', 'Tên quán là gì?'],
        ['{何|なに}がありますか。', 'Nani ga arimasu ka.', 'Ở đó có gì? (あります: Bài 4 — học như một khối)'],
        ['いくらですか。', 'Ikura desu ka.', 'Bao nhiêu tiền?'],
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b2-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 82 từ của danh sách Bài 2',
  goal: 'Thuộc đủ 82 mục trong danh sách từ mới Bài 2 của cô, mỗi từ nói được trong một câu hỏi–đáp mua sắm hoặc gọi món.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **82 mục** theo đúng danh sách cô phát (sổ tra JPD123), chia thành 7 nhóm theo tình huống. Câu ví dụ chỉ dùng từ của Bài 1–2 nên bạn nói lại được ngay. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa và tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết đúng theo chữ kana: えいご → **eigo**, こうちゃ → **koucha**, コーヒー (ー kéo dài) → **koohii**, ビール → **biiru**.',
        'Âm ngắt っ viết đôi phụ âm: きっさてん → **kissaten**, いっかい → **ikkai**.',
        'Trợ từ は đọc **wa**, を đọc **o**.',
      ],
    },

    { t: 'h', text: '1. Chỉ nơi chốn: ここ・そこ・あそこ・どこ' },
    {
      t: 'vocab',
      items: [
        { w: 'ここ／こちら', pos: 'đại từ chỉ nơi', ipa: 'koko / kochira', vi: 'Chỗ này, đây / phía này (こちら lịch sự hơn)', ex: 'トイレはここです。', exRo: 'Toire wa koko desu.', exVi: 'Nhà vệ sinh ở đây.' },
        { w: 'そこ／そちら', pos: 'đại từ chỉ nơi', ipa: 'soko / sochira', vi: 'Chỗ đó (gần người nghe) / phía đó', ex: 'ATMはそこです。', exRo: 'Ee-tii-emu wa soko desu.', exVi: 'ATM ở chỗ bạn đó.' },
        { w: 'あそこ／あちら', pos: 'đại từ chỉ nơi', ipa: 'asoko / achira', vi: 'Chỗ kia (xa cả hai người) / phía kia', ex: 'エレベーターはあちらです。', exRo: 'Erebeetaa wa achira desu.', exVi: 'Thang máy ở phía đằng kia ạ.' },
        { w: 'どこ', pos: 'từ để hỏi', ipa: 'doko', vi: 'Ở đâu, chỗ nào', ex: 'レジはどこですか。', exRo: 'Reji wa doko desu ka.', exVi: 'Quầy thu ngân ở đâu?' },
      ],
    },

    { t: 'h', text: '2. Trong toà nhà mua sắm' },
    {
      t: 'vocab',
      items: [
        { w: 'インフォメーション', pos: 'danh từ', ipa: 'infomeeshon', vi: 'Quầy thông tin', ex: 'インフォメーションは{1階|いっかい}です。', exRo: 'Infomeeshon wa ikkai desu.', exVi: 'Quầy thông tin ở tầng 1.' },
        { w: 'ATM', pos: 'danh từ', ipa: 'ee-tii-emu', vi: 'Máy rút tiền tự động', ex: 'すみません、ATMはどこですか。', exRo: 'Sumimasen, ee-tii-emu wa doko desu ka.', exVi: 'Xin lỗi, máy ATM ở đâu ạ?' },
        { w: 'エスカレーター', pos: 'danh từ', ipa: 'esukareetaa', vi: 'Thang cuốn', ex: 'エスカレーターはあそこです。', exRo: 'Esukareetaa wa asoko desu.', exVi: 'Thang cuốn ở đằng kia.' },
        { w: 'エレベーター', pos: 'danh từ', ipa: 'erebeetaa', vi: 'Thang máy', ex: 'エレベーターはこちらです。', exRo: 'Erebeetaa wa kochira desu.', exVi: 'Thang máy ở phía này ạ.' },
        { w: 'きつえんじょ', pos: 'danh từ', ipa: 'kitsuenjo', vi: 'Nơi hút thuốc (sách viết {喫煙所|きつえんじょ})', ex: 'きつえんじょは{3階|さんがい}です。', exRo: 'Kitsuenjo wa san-gai desu.', exVi: 'Chỗ hút thuốc ở tầng 3.' },
        { w: 'トイレ', pos: 'danh từ', ipa: 'toire', vi: 'Nhà vệ sinh', ex: 'トイレはどこですか。', exRo: 'Toire wa doko desu ka.', exVi: 'Nhà vệ sinh ở đâu?' },
        { w: 'レジ', pos: 'danh từ', ipa: 'reji', vi: 'Quầy thu ngân', ex: 'レジはあちらです。', exRo: 'Reji wa achira desu.', exVi: 'Quầy thu ngân ở phía kia ạ.' },
        { w: 'きっさてん', pos: 'danh từ', ipa: 'kissaten', vi: 'Quán giải khát, quán cà phê (sách viết {喫茶店|きっさてん})', ex: 'きっさてんは{1階|いっかい}です。', exRo: 'Kissaten wa ikkai desu.', exVi: 'Quán giải khát ở tầng 1.' },
        { w: 'スーパー', pos: 'danh từ', ipa: 'suupaa', vi: 'Siêu thị', ex: 'スーパーは{地下|ちか}{1階|いっかい}です。', exRo: 'Suupaa wa chika ikkai desu.', exVi: 'Siêu thị ở tầng hầm 1.' },
        { w: '{100円|ひゃくえん}ショップ', pos: 'danh từ', ipa: 'hyaku-en shoppu', vi: 'Cửa hàng 100 yên (đồng giá)', ex: '{100円|ひゃくえん}ショップは{何階|なんがい}ですか。', exRo: 'Hyaku-en shoppu wa nan-gai desu ka.', exVi: 'Cửa hàng 100 yên ở tầng mấy?' },
        { w: 'レストラン', pos: 'danh từ', ipa: 'resutoran', vi: 'Nhà hàng, quán ăn', ex: 'レストランは{5階|ごかい}です。', exRo: 'Resutoran wa go-kai desu.', exVi: 'Nhà hàng ở tầng 5.' },
        { w: '{地下|ちか}', pos: 'danh từ', ipa: 'chika', vi: 'Dưới lòng đất, tầng hầm', ex: '{地下|ちか}{1階|いっかい}はスーパーです。', exRo: 'Chika ikkai wa suupaa desu.', exVi: 'Tầng hầm 1 là siêu thị.' },
        { w: '～{階|かい}', pos: 'hậu tố (đếm tầng)', ipa: '~kai / ~gai', vi: 'Tầng ～ (3階 = さんがい, 何階 = なんがい)', ex: '{本屋|ほんや}は{2階|にかい}です。', exRo: 'Hon-ya wa ni-kai desu.', exVi: 'Hiệu sách ở tầng 2.' },
        { w: '～{屋|や}（{例|れい}：{本屋|ほんや}）', pos: 'hậu tố', ipa: '~ya (rei: hon-ya)', vi: 'Cửa hàng ～, hiệu ～ (ví dụ: hiệu sách)', ex: 'くつ{屋|や}は{何階|なんがい}ですか。', exRo: 'Kutsu-ya wa nan-gai desu ka.', exVi: 'Cửa hàng giày ở tầng mấy?' },
      ],
    },

    { t: 'h', text: '3. Đồ điện tử, đồ dùng, quần áo' },
    {
      t: 'vocab',
      items: [
        { w: 'カメラ', pos: 'danh từ', ipa: 'kamera', vi: 'Máy ảnh', ex: 'このカメラはいくらですか。', exRo: 'Kono kamera wa ikura desu ka.', exVi: 'Cái máy ảnh này bao nhiêu tiền?' },
        { w: '{携帯電話|けいたいでんわ}', pos: 'danh từ', ipa: 'keitai denwa', vi: 'Điện thoại di động', ex: 'これは{誰|だれ}の{携帯電話|けいたいでんわ}ですか。', exRo: 'Kore wa dare no keitai denwa desu ka.', exVi: 'Đây là điện thoại của ai?' },
        { w: '{電子辞書|でんしじしょ}', pos: 'danh từ', ipa: 'denshi jisho', vi: 'Kim từ điển (từ điển điện tử)', ex: '{電子辞書|でんしじしょ}はどこですか。', exRo: 'Denshi jisho wa doko desu ka.', exVi: 'Kim từ điển ở đâu?' },
        { w: 'パソコン', pos: 'danh từ', ipa: 'pasokon', vi: 'Máy tính cá nhân', ex: 'パソコンは{4階|よんかい}です。', exRo: 'Pasokon wa yon-kai desu.', exVi: 'Máy tính ở tầng 4.' },
        { w: 'くつ', pos: 'danh từ', ipa: 'kutsu', vi: 'Giày (sách viết {靴|くつ})', ex: 'このくつはいくらですか。', exRo: 'Kono kutsu wa ikura desu ka.', exVi: 'Đôi giày này bao nhiêu tiền?' },
        { w: '{消|け}しゴム', pos: 'danh từ', ipa: 'keshigomu', vi: 'Cục tẩy', ex: '{消|け}しゴムを{1|ひと}つください。', exRo: 'Keshigomu o hitotsu kudasai.', exVi: 'Cho tôi một cục tẩy.' },
        { w: 'ペン', pos: 'danh từ', ipa: 'pen', vi: 'Bút', ex: 'このペンは{100円|ひゃくえん}です。', exRo: 'Kono pen wa hyaku en desu.', exVi: 'Cái bút này 100 yên.' },
        { w: 'トイレットペーパー', pos: 'danh từ', ipa: 'toirettopeepaa', vi: 'Giấy vệ sinh', ex: 'トイレットペーパーはどこですか。', exRo: 'Toirettopeepaa wa doko desu ka.', exVi: 'Giấy vệ sinh (bày) ở đâu?' },
        { w: '{本|ほん}', pos: 'danh từ', ipa: 'hon', vi: 'Sách', ex: 'その{本|ほん}はいくらですか。', exRo: 'Sono hon wa ikura desu ka.', exVi: 'Quyển sách đó bao nhiêu tiền?' },
        { w: 'かばん', pos: 'danh từ', ipa: 'kaban', vi: 'Cặp, túi xách', ex: 'あのかばんはいくらですか。', exRo: 'Ano kaban wa ikura desu ka.', exVi: 'Cái túi đằng kia bao nhiêu tiền?' },
        { w: 'ズボン', pos: 'danh từ', ipa: 'zubon', vi: 'Quần dài', ex: 'このズボンは{3,000円|さんぜんえん}です。', exRo: 'Kono zubon wa sanzen en desu.', exVi: 'Cái quần này 3.000 yên.' },
        { w: 'Tシャツ', pos: 'danh từ', ipa: 'tii shatsu', vi: 'Áo phông', ex: 'そのTシャツをください。', exRo: 'Sono tii shatsu o kudasai.', exVi: 'Cho tôi cái áo phông đó.' },
        { w: '{時計|とけい}', pos: 'danh từ', ipa: 'tokei', vi: 'Đồng hồ', ex: 'この{時計|とけい}は{誰|だれ}のですか。', exRo: 'Kono tokei wa dare no desu ka.', exVi: 'Cái đồng hồ này là của ai?' },
        { w: '{財布|さいふ}', pos: 'danh từ', ipa: 'saifu', vi: 'Ví tiền', ex: 'それは{私|わたし}の{財布|さいふ}です。', exRo: 'Sore wa watashi no saifu desu.', exVi: 'Đó là ví của tôi.' },
      ],
    },

    { t: 'h', text: '4. Ở siêu thị: thực phẩm' },
    {
      t: 'vocab',
      items: [
        { w: '{油|あぶら}', pos: 'danh từ', ipa: 'abura', vi: 'Dầu (dầu ăn)', ex: '{油|あぶら}はどこですか。', exRo: 'Abura wa doko desu ka.', exVi: 'Dầu ăn ở đâu?' },
        { w: 'ケーキ', pos: 'danh từ', ipa: 'keeki', vi: 'Bánh ngọt', ex: 'このケーキは{1|ひと}つ{400円|よんひゃくえん}です。', exRo: 'Kono keeki wa hitotsu yonhyaku en desu.', exVi: 'Bánh này 400 yên một cái.' },
        { w: '{米|こめ}', pos: 'danh từ', ipa: 'kome', vi: 'Gạo', ex: 'すみません、{米|こめ}はどこですか。', exRo: 'Sumimasen, kome wa doko desu ka.', exVi: 'Xin lỗi, gạo ở đâu ạ?' },
        { w: '{卵|たまご}', pos: 'danh từ', ipa: 'tamago', vi: 'Trứng', ex: 'この{卵|たまご}はいくらですか。', exRo: 'Kono tamago wa ikura desu ka.', exVi: 'Trứng này bao nhiêu tiền?' },
        { w: 'パン', pos: 'danh từ', ipa: 'pan', vi: 'Bánh mì', ex: 'パンを{2|ふた}つください。', exRo: 'Pan o futatsu kudasai.', exVi: 'Cho tôi hai cái bánh mì.' },
        { w: '{水|みず}', pos: 'danh từ', ipa: 'mizu', vi: 'Nước', ex: '{水|みず}は{100円|ひゃくえん}です。', exRo: 'Mizu wa hyaku en desu.', exVi: 'Nước (chai) 100 yên.' },
        { w: '{魚|さかな}', pos: 'danh từ', ipa: 'sakana', vi: 'Cá', ex: '{魚|さかな}は{地下|ちか}{1階|いっかい}です。', exRo: 'Sakana wa chika ikkai desu.', exVi: 'Cá (bán) ở tầng hầm 1.' },
        { w: '{肉|にく}', pos: 'danh từ', ipa: 'niku', vi: 'Thịt', ex: '{肉|にく}はあちらです。', exRo: 'Niku wa achira desu.', exVi: 'Thịt ở phía đằng kia ạ.' },
        { w: '{牛肉|ぎゅうにく}', pos: 'danh từ', ipa: 'gyuuniku', vi: 'Thịt bò', ex: 'これは{牛肉|ぎゅうにく}のカレーです。', exRo: 'Kore wa gyuuniku no karee desu.', exVi: 'Đây là cà ri bò.' },
        { w: '{鶏肉|とりにく}', pos: 'danh từ', ipa: 'toriniku', vi: 'Thịt gà', ex: '「{鶏肉|とりにく}」は{英語|えいご}で「chicken」です。', exRo: '"Toriniku" wa eigo de "chicken" desu.', exVi: '"Toriniku" tiếng Anh là "chicken".' },
        { w: '{豚肉|ぶたにく}', pos: 'danh từ', ipa: 'butaniku', vi: 'Thịt lợn', ex: 'とんかつは{豚肉|ぶたにく}の{料理|りょうり}です。', exRo: 'Tonkatsu wa butaniku no ryouri desu.', exVi: 'Tonkatsu là món thịt lợn.' },
        { w: '{野菜|やさい}', pos: 'danh từ', ipa: 'yasai', vi: 'Rau', ex: 'これは{野菜|やさい}のスープです。', exRo: 'Kore wa yasai no suupu desu.', exVi: 'Đây là súp rau.' },
        { w: 'イチゴ', pos: 'danh từ', ipa: 'ichigo', vi: 'Quả dâu tây', ex: 'これはイチゴのケーキです。', exRo: 'Kore wa ichigo no keeki desu.', exVi: 'Đây là bánh dâu tây.' },
        { w: 'リンゴ', pos: 'danh từ', ipa: 'ringo', vi: 'Quả táo', ex: 'リンゴを{3|みっ}つください。', exRo: 'Ringo o mittsu kudasai.', exVi: 'Cho tôi ba quả táo.' },
      ],
    },

    { t: 'h', text: '5. Ở nhà hàng: món ăn & đồ uống' },
    {
      t: 'vocab',
      items: [
        { w: '{料理|りょうり}', pos: 'danh từ', ipa: 'ryouri', vi: 'Món ăn / nấu ăn', ex: 'これは{何|なん}の{料理|りょうり}ですか。', exRo: 'Kore wa nan no ryouri desu ka.', exVi: 'Đây là món (làm từ) gì?' },
        { w: 'これは{魚|さかな}の{料理|りょうり}です。', pos: 'câu mẫu', ipa: 'Kore wa sakana no ryouri desu.', vi: 'Đây là món ăn (làm từ) cá.', ex: 'A：これは{何|なん}の{料理|りょうり}ですか。 B：{魚|さかな}の{料理|りょうり}です。', exRo: 'A: Kore wa nan no ryouri desu ka. B: Sakana no ryouri desu.', exVi: 'A: Đây là món gì? B: Món cá.' },
        { w: 'カレー', pos: 'danh từ', ipa: 'karee', vi: 'Món cà ri', ex: 'カレーを{1|ひと}つください。', exRo: 'Karee o hitotsu kudasai.', exVi: 'Cho tôi một cà ri.' },
        { w: 'スープ', pos: 'danh từ', ipa: 'suupu', vi: 'Canh, súp', ex: 'これは{何|なん}のスープですか。', exRo: 'Kore wa nan no suupu desu ka.', exVi: 'Đây là súp gì?' },
        { w: 'とんかつ', pos: 'danh từ', ipa: 'tonkatsu', vi: 'Thịt lợn chiên xù', ex: 'とんかつを{2|ふた}つください。', exRo: 'Tonkatsu o futatsu kudasai.', exVi: 'Cho tôi hai phần thịt lợn chiên xù.' },
        { w: 'ハンバーグ', pos: 'danh từ', ipa: 'hanbaagu', vi: 'Thịt băm viên (hamburger steak, không phải bánh hamburger)', ex: 'ハンバーグは{980円|きゅうひゃくはちじゅうえん}です。', exRo: 'Hanbaagu wa kyuuhyaku hachijuu en desu.', exVi: 'Thịt băm viên 980 yên.' },
        { w: 'ご{飯|はん}', pos: 'danh từ', ipa: 'gohan', vi: 'Cơm', ex: 'とんかつとご{飯|はん}をください。', exRo: 'Tonkatsu to gohan o kudasai.', exVi: 'Cho tôi thịt lợn chiên xù và cơm.' },
        { w: 'ご{飯|はん}を{2|ふた}つください。', pos: 'câu mẫu', ipa: 'Gohan o futatsu kudasai.', vi: 'Cho tôi 2 bát/suất cơm.', ex: 'カレーを{1|ひと}つとご{飯|はん}を{2|ふた}つください。', exRo: 'Karee o hitotsu to gohan o futatsu kudasai.', exVi: 'Cho tôi một cà ri và hai suất cơm.' },
        { w: 'ライス', pos: 'danh từ', ipa: 'raisu', vi: 'Cơm (kiểu Tây, bày trên đĩa ăn kèm)', ex: 'ハンバーグとライスをください。', exRo: 'Hanbaagu to raisu o kudasai.', exVi: 'Cho tôi thịt băm viên và cơm.' },
        { w: 'ジュース', pos: 'danh từ', ipa: 'juusu', vi: 'Nước ngọt, nước hoa quả', ex: 'これはリンゴのジュースです。', exRo: 'Kore wa ringo no juusu desu.', exVi: 'Đây là nước táo.' },
        { w: 'コーヒー', pos: 'danh từ', ipa: 'koohii', vi: 'Cà phê', ex: 'コーヒーを{3|みっ}つください。', exRo: 'Koohii o mittsu kudasai.', exVi: 'Cho tôi ba cà phê.' },
        { w: '{紅茶|こうちゃ}', pos: 'danh từ', ipa: 'koucha', vi: 'Trà đen (hồng trà)', ex: '{紅茶|こうちゃ}は{500円|ごひゃくえん}です。', exRo: 'Koucha wa gohyaku en desu.', exVi: 'Trà đen 500 yên.' },
        { w: '（お）{茶|ちゃ}', pos: 'danh từ', ipa: '(o)cha', vi: 'Trà, nước chè (trà xanh)', ex: 'これは{日本|にほん}のお{茶|ちゃ}です。', exRo: 'Kore wa Nihon no ocha desu.', exVi: 'Đây là trà Nhật.' },
        { w: 'ビール', pos: 'danh từ', ipa: 'biiru', vi: 'Bia', ex: 'これはどこのビールですか。', exRo: 'Kore wa doko no biiru desu ka.', exVi: 'Đây là bia nước nào?' },
        { w: 'ワイン', pos: 'danh từ', ipa: 'wain', vi: 'Rượu vang', ex: 'このワインはフランスのワインです。', exRo: 'Kono wain wa Furansu no wain desu.', exVi: 'Rượu vang này là vang Pháp.' },
      ],
    },

    { t: 'h', text: '6. Mua bán & gọi món: từ và câu giao tiếp' },
    {
      t: 'vocab',
      items: [
        { w: '{店員|てんいん}', pos: 'danh từ', ipa: 'ten-in', vi: 'Nhân viên bán hàng', ex: 'パクさんは{店員|てんいん}じゃありません。{学生|がくせい}です。', exRo: 'Paku-san wa ten-in ja arimasen. Gakusei desu.', exVi: 'Park không phải nhân viên bán hàng. Cậu ấy là sinh viên.' },
        { w: 'いらっしゃいませ', pos: 'câu chào cố định', ipa: 'irasshaimase', vi: 'Kính chào quý khách (nhân viên nói khi khách vào)', ex: '{店員|てんいん}：いらっしゃいませ。', exRo: 'Ten-in: Irasshaimase.', exVi: 'Nhân viên: Kính chào quý khách.' },
        { w: '（どうも）ありがとうございます', pos: 'câu cảm ơn', ipa: '(doumo) arigatou gozaimasu', vi: 'Xin cảm ơn (nhiều)', ex: 'そうですか。どうもありがとうございます。', exRo: 'Sou desu ka. Doumo arigatou gozaimasu.', exVi: 'Thế à. Cảm ơn nhiều.' },
        { w: '～{円|えん}', pos: 'hậu tố (tiền Nhật)', ipa: '~en', vi: '～ yên', ex: 'この{本|ほん}は{1,500円|せんごひゃくえん}です。', exRo: 'Kono hon wa sen gohyaku en desu.', exVi: 'Quyển sách này 1.500 yên.' },
        { w: 'いくら', pos: 'từ để hỏi', ipa: 'ikura', vi: 'Bao nhiêu tiền', ex: 'このかばんはいくらですか。', exRo: 'Kono kaban wa ikura desu ka.', exVi: 'Cái túi này bao nhiêu tiền?' },
        { w: 'じゃ', pos: 'từ nối', ipa: 'ja', vi: 'Thế thì, vậy thì (sau khi đã quyết)', ex: 'じゃ、それをください。', exRo: 'Ja, sore o kudasai.', exVi: 'Vậy thì cho tôi cái đó.' },
        { w: '～つ', pos: 'hậu tố đếm (đồ vật)', ipa: '~tsu', vi: '～ cái, ～ chiếc (ひとつ, ふたつ, みっつ…)', ex: 'ケーキを{2|ふた}つください。', exRo: 'Keeki o futatsu kudasai.', exVi: 'Cho tôi hai cái bánh.' },
        { w: '{注文|ちゅうもん}をお{願|ねが}いします', pos: 'câu cố định', ipa: 'chuumon o onegai shimasu', vi: 'Cho tôi gọi đồ / gọi món', ex: 'すみません、{注文|ちゅうもん}をお{願|ねが}いします。', exRo: 'Sumimasen, chuumon o onegai shimasu.', exVi: 'Xin lỗi, cho tôi gọi món.' },
        { w: 'どうぞ', pos: 'câu mời', ipa: 'douzo', vi: 'Xin mời', ex: '{店員|てんいん}：はい、どうぞ。', exRo: 'Ten-in: Hai, douzo.', exVi: 'Nhân viên: Vâng, xin mời.' },
      ],
    },

    { t: 'h', text: '7. Chỉ đồ vật: これ・それ・あれ / この・その・あの' },
    {
      t: 'vocab',
      items: [
        { w: 'これ', pos: 'đại từ chỉ vật', ipa: 'kore', vi: 'Cái này (gần người nói)', ex: 'これはいくらですか。', exRo: 'Kore wa ikura desu ka.', exVi: 'Cái này bao nhiêu tiền?' },
        { w: 'それ', pos: 'đại từ chỉ vật', ipa: 'sore', vi: 'Cái đó (gần người nghe)', ex: 'それは{私|わたし}のペンです。', exRo: 'Sore wa watashi no pen desu.', exVi: 'Cái đó là bút của tôi.' },
        { w: 'あれ', pos: 'đại từ chỉ vật', ipa: 'are', vi: 'Cái kia (xa cả hai)', ex: 'あれは{何|なん}ですか。', exRo: 'Are wa nan desu ka.', exVi: 'Cái kia là cái gì?' },
        { w: 'この～', pos: 'từ chỉ định + danh từ', ipa: 'kono ~', vi: 'Cái ～ này', ex: 'このケーキは{300円|さんびゃくえん}です。', exRo: 'Kono keeki wa sanbyaku en desu.', exVi: 'Cái bánh này 300 yên.' },
        { w: 'その～', pos: 'từ chỉ định + danh từ', ipa: 'sono ~', vi: 'Cái ～ đó', ex: 'その{時計|とけい}はいくらですか。', exRo: 'Sono tokei wa ikura desu ka.', exVi: 'Cái đồng hồ đó bao nhiêu tiền?' },
        { w: 'あの～', pos: 'từ chỉ định + danh từ', ipa: 'ano ~', vi: 'Cái ～ kia', ex: 'あのパソコンはどこのパソコンですか。', exRo: 'Ano pasokon wa doko no pasokon desu ka.', exVi: 'Cái máy tính kia là máy của nước (hãng) nào?' },
      ],
    },

    { t: 'h', text: '8. Nước, tiếng, người' },
    {
      t: 'vocab',
      items: [
        { w: 'インド', pos: 'danh từ (nước)', ipa: 'Indo', vi: 'Ấn Độ', ex: 'これはインドのカレーです。', exRo: 'Kore wa Indo no karee desu.', exVi: 'Đây là cà ri Ấn Độ.' },
        { w: 'ドイツ', pos: 'danh từ (nước)', ipa: 'Doitsu', vi: 'Đức', ex: 'これはドイツのビールです。', exRo: 'Kore wa Doitsu no biiru desu.', exVi: 'Đây là bia Đức.' },
        { w: 'フランス', pos: 'danh từ (nước)', ipa: 'Furansu', vi: 'Pháp', ex: 'そのワインはフランスのワインです。', exRo: 'Sono wain wa Furansu no wain desu.', exVi: 'Rượu vang đó là vang Pháp.' },
        { w: '{英語|えいご}', pos: 'danh từ', ipa: 'eigo', vi: 'Tiếng Anh', ex: '「{水|みず}」は{英語|えいご}で「water」です。', exRo: '"Mizu" wa eigo de "water" desu.', exVi: '"Mizu" tiếng Anh là "water".' },
        { w: '～{語|ご}', pos: 'hậu tố (ngôn ngữ)', ipa: '~go', vi: 'Tiếng (nước nào): {日本語|にほんご}, ベトナム{語|ご}…', ex: '「ペン」はベトナム{語|ご}で「bút」です。', exRo: '"Pen" wa Betonamu-go de "bút" desu.', exVi: '"Pen" tiếng Việt là "bút".' },
        { w: 'だれ（{誰|だれ}）', pos: 'từ để hỏi', ipa: 'dare', vi: 'Ai', ex: 'これはだれのかばんですか。', exRo: 'Kore wa dare no kaban desu ka.', exVi: 'Đây là túi của ai?' },
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có, danh sách của cô không có — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{何階|なんがい}', 'nan-gai (cũng nói なんかい)', 'Tầng mấy'],
        ['メニュー', 'menyuu', 'Thực đơn'],
        ['こちらへどうぞ', 'kochira e douzo', 'Mời đi lối này'],
        ['{少々|しょうしょう}お{待|ま}ちください', 'shoushou omachi kudasai', 'Xin chờ một chút'],
        ['おいしい', 'oishii', 'Ngon (tính từ — Bài 4)'],
        ['いくつ', 'ikutsu', 'Bao nhiêu cái (hỏi số lượng)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b2-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 7–15 + số đếm, giá tiền',
  goal: 'Dùng đúng こ・そ・あ・ど, đọc được mọi giá tiền đến hàng vạn, và tự đặt/trả lời các câu hỏi いくら・何の・どこの・誰の・～語で.',
  minutes: 60,
  blocks: [
    {
      t: 'p',
      text: 'Bài 2 có **9 điểm ngữ pháp** (ポイント 7–15). Tất cả đều dựng trên khung Bài 1: **N1 は N2 です**. Chỉ khác là chỗ N1, N2 giờ có thể là これ/この～/ここ, và có thêm các từ để hỏi mới. Thêm một phần rất quan trọng: **đọc số và giá tiền** — thi nói gần như chắc chắn có một câu いくらですか.',
    },
    {
      t: 'table',
      caption: 'Bức tranh chung: bộ こ・そ・あ・ど',
      head: ['', 'こ (gần người nói)', 'そ (gần người nghe)', 'あ (xa cả hai)', 'ど (hỏi)'],
      rows: [
        ['Vật (đứng một mình) — ポイント 7', 'これ', 'それ', 'あれ', '（どれ — Bài 7）'],
        ['Vật + danh từ — ポイント 8', 'この N', 'その N', 'あの N', '（どの N — Bài 7）'],
        ['Nơi chốn — ポイント 9', 'ここ', 'そこ', 'あそこ', 'どこ'],
        ['Phía / nơi (lịch sự) — ポイント 9', 'こちら', 'そちら', 'あちら', 'どちら'],
      ],
    },

    /* ── ポイント 7 ── */
    { t: 'h', text: 'ポイント 7 — これ／それ／あれ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'これ／それ／あれ は N です。',
          vi: 'Cái này / cái đó / cái kia là N.',
          examples: [
            { en: 'これは{電子辞書|でんしじしょ}です。', ro: 'Kore wa denshi jisho desu.', vi: 'Cái này là kim từ điển.' },
            { en: 'それは{私|わたし}の{財布|さいふ}です。', ro: 'Sore wa watashi no saifu desu.', vi: 'Cái đó là ví của tôi.' },
            { en: 'あれはレストランです。', ro: 'Are wa resutoran desu.', vi: 'Cái kia là nhà hàng.' },
          ],
        },
        {
          formula: 'これ／それ／あれ は N ですか。',
          vi: 'Cái này / đó / kia có phải là N không? → はい、～です／いいえ、～じゃありません。',
          examples: [
            { en: 'それはカメラですか。', ro: 'Sore wa kamera desu ka.', vi: 'Cái đó là máy ảnh à?' },
            { en: 'いいえ、これはカメラじゃありません。{携帯電話|けいたいでんわ}です。', ro: 'Iie, kore wa kamera ja arimasen. Keitai denwa desu.', vi: 'Không, cái này không phải máy ảnh. Là điện thoại.' },
          ],
        },
        {
          formula: 'これ／それ／あれ は {何|なん} ですか。',
          vi: 'Cái này / đó / kia là cái gì?',
          examples: [
            { en: 'あれは{何|なん}ですか。', ro: 'Are wa nan desu ka.', vi: 'Cái kia là gì vậy?' },
            { en: 'あれはATMです。', ro: 'Are wa ee-tii-emu desu.', vi: 'Cái kia là máy ATM.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      head: ['Từ', 'Vật ở đâu', 'Tiếng Việt gần nhất'],
      rows: [
        ['**これ** (kore)', 'Trong tay / sát cạnh **người nói**', 'cái này'],
        ['**それ** (sore)', 'Trong tay / sát cạnh **người nghe**', 'cái đó (chỗ bạn)'],
        ['**あれ** (are)', 'Xa **cả hai** người', 'cái kia, cái đằng kia'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: người hỏi cầm đồ → người đáp dùng それ',
      lines: [
        { who: 'A', role: 'a', text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: '(A cầm một vật) Cái này là gì?' },
        { who: 'B', role: 'b', text: 'それは{電子辞書|でんしじしょ}です。', ro: 'Sore wa denshi jisho desu.', vi: 'Cái đó là kim từ điển.' },
        { who: 'A', role: 'a', text: 'それはカメラですか。', ro: 'Sore wa kamera desu ka.', vi: '(A chỉ vật trong tay B) Cái đó là máy ảnh à?' },
        { who: 'B', role: 'b', text: 'いいえ、これはカメラじゃありません。{携帯電話|けいたいでんわ}です。', ro: 'Iie, kore wa kamera ja arimasen. Keitai denwa desu.', vi: 'Không, cái này không phải máy ảnh. Là điện thoại.' },
        { who: 'A', role: 'a', text: 'あれも{携帯電話|けいたいでんわ}ですか。', ro: 'Are mo keitai denwa desu ka.', vi: '(chỉ ra xa) Cái kia cũng là điện thoại à?' },
        { who: 'B', role: 'b', text: 'はい、あれも{携帯電話|けいたいでんわ}です。', ro: 'Hai, are mo keitai denwa desu.', vi: 'Vâng, cái kia cũng là điện thoại.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — nói được câu mới',
      head: ['これ／それ／あれ は', 'N', 'です。'],
      rows: [
        ['これは', 'パソコン · {本|ほん} · ペン · {消|け}しゴム', 'です。'],
        ['それは', '{私|わたし}の{時計|とけい} · ワンさんのかばん', 'です。'],
        ['あれは', 'エスカレーター · レジ · きっさてん', 'です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — これ/それ bị nhầm khi thi',
      items: [
        'Giám thị cầm tranh và hỏi **これは**{何|なん}ですか → vật ở phía giám thị → bạn đáp **それは**～です. Đáp ~~これは～です~~ không sai nghĩa nhưng mất điểm tự nhiên.',
        'これ／それ／あれ **đứng một mình**, không đi liền danh từ: ~~これ{本|ほん}は~~ → **この{本|ほん}は** (xem ポイント 8).',
        'Không dùng これ／それ／あれ để chỉ **người** một cách lịch sự. Giới thiệu người: こちらは～さんです.',
      ],
    },

    /* ── ポイント 8 ── */
    { t: 'h', text: 'ポイント 8 — この／その／あの N' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'この／その／あの N は ～です。',
          vi: 'Cái N này / đó / kia thì ～. (phải có danh từ đi liền sau)',
          examples: [
            { en: 'あのTシャツは{3,000円|さんぜんえん}です。', ro: 'Ano tii shatsu wa sanzen en desu.', vi: 'Cái áo phông kia 3.000 yên.' },
            { en: 'このカメラは{日本|にほん}のカメラです。', ro: 'Kono kamera wa Nihon no kamera desu.', vi: 'Cái máy ảnh này là máy ảnh Nhật.' },
            { en: 'その{時計|とけい}は{私|わたし}の{時計|とけい}です。', ro: 'Sono tokei wa watashi no tokei desu.', vi: 'Cái đồng hồ đó là đồng hồ của tôi.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'これ và この khác nhau thế nào?',
      head: ['Đứng một mình (ポイント 7)', 'Đi với danh từ (ポイント 8)', 'Nghĩa'],
      rows: [
        ['**これ**はいくらですか。', '**この**かばんはいくらですか。', 'Cái này / cái túi này bao nhiêu?'],
        ['**それ**をください。', '**その**Tシャツをください。', 'Cho tôi cái đó / cái áo đó.'],
        ['**あれ**は{何|なん}ですか。', '**あの**{店|みせ}は{何|なん}ですか。', 'Cái kia / cửa hàng kia là gì?'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'このかばんはいくらですか。', ro: 'Kono kaban wa ikura desu ka.', vi: 'Cái túi này bao nhiêu tiền?' },
        { who: '{店員|てんいん}', role: 'b', text: 'そのかばんは{5,000円|ごせんえん}です。', ro: 'Sono kaban wa gosen en desu.', vi: 'Cái túi đó 5.000 yên ạ.' },
        { who: 'A', role: 'a', text: 'じゃ、あのかばんはいくらですか。', ro: 'Ja, ano kaban wa ikura desu ka.', vi: 'Vậy cái túi đằng kia bao nhiêu?' },
        { who: '{店員|てんいん}', role: 'b', text: 'あのかばんは{8,000円|はっせんえん}です。', ro: 'Ano kaban wa hassen en desu.', vi: 'Cái túi kia 8.000 yên ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['この／その／あの', 'N', 'は いくらですか。'],
      rows: [
        ['この', 'Tシャツ · ズボン · くつ · {時計|とけい}', 'は いくらですか。'],
        ['その', 'カメラ · パソコン · {電子辞書|でんしじしょ}', 'は いくらですか。'],
        ['あの', 'ケーキ · ワイン · {本|ほん}', 'は いくらですか。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — この đứng một mình',
      items: [
        '~~このはいくらですか~~ → **これは**いくらですか, hoặc **この**ペンはいくらですか. この／その／あの **luôn cần** một danh từ theo sau.',
        'Tiếng Việt nói "cái áo **này**" (này đứng sau), tiếng Nhật nói "**この** áo" (đứng trước). Đừng viết ~~Tシャツこの~~.',
      ],
    },

    /* ── ポイント 9 ── */
    { t: 'h', text: 'ポイント 9 — ここ／そこ／あそこ／どこ（こちら／そちら／あちら／どちら）' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は どこですか。 → N は ここ／そこ／あそこ です。',
          vi: 'N ở đâu? → N ở đây / ở chỗ bạn / ở đằng kia.',
          examples: [
            { en: 'トイレはどこですか。', ro: 'Toire wa doko desu ka.', vi: 'Nhà vệ sinh ở đâu?' },
            { en: 'あそこです。', ro: 'Asoko desu.', vi: 'Ở đằng kia.' },
          ],
        },
        {
          formula: 'N は {何階|なんがい} ですか。 → N は ～{階|かい} です。',
          vi: 'N ở tầng mấy? → N ở tầng ～.',
          examples: [
            { en: '{100円|ひゃくえん}ショップは{何階|なんがい}ですか。', ro: 'Hyaku-en shoppu wa nan-gai desu ka.', vi: 'Cửa hàng 100 yên ở tầng mấy?' },
            { en: '{3階|さんがい}です。', ro: 'San-gai desu.', vi: 'Tầng 3.' },
          ],
        },
        {
          formula: 'N は こちら／そちら／あちら です。',
          vi: 'Cách nói lịch sự (nhân viên với khách): N ở phía này / đó / kia.',
          examples: [
            { en: '{携帯電話|けいたいでんわ}はこちらです。', ro: 'Keitai denwa wa kochira desu.', vi: 'Điện thoại ở phía này ạ.' },
            { en: 'すみません、レジはどちらですか。', ro: 'Sumimasen, reji wa dochira desu ka.', vi: 'Xin lỗi, quầy thu ngân ở phía nào ạ?' },
          ],
        },
        {
          formula: 'ここ／そこ／あそこ は N です。',
          vi: 'Chỗ này / đó / kia là N. (giới thiệu nơi chốn)',
          examples: [
            { en: 'ここはレストランです。', ro: 'Koko wa resutoran desu.', vi: 'Đây là nhà hàng. (câu mở đầu hay gặp trong đề thi)' },
            { en: 'あそこはきっさてんです。', ro: 'Asoko wa kissaten desu.', vi: 'Chỗ kia là quán giải khát.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Hiểu đúng',
      items: [
        '**N は どこですか** đặt thứ cần tìm lên đầu (N は), từ để hỏi ở chỗ của đáp án. Đáp: giữ nguyên, thay どこ bằng câu trả lời: トイレは**どこ**ですか → トイレは**あそこ**です.',
        '**そこ** là chỗ gần **người nghe**. Nếu bạn đứng cạnh ATM và hỏi, người kia đáp "ATMは**そこ**ですよ" = "ngay chỗ bạn đấy"; bạn nhắc lại thì nói "**ここ**ですね".',
        '**こちら・そちら・あちら・どちら** nghĩa gốc là "phía này/đó/kia/nào", dùng thay ここ… để **lịch sự hơn**. Nhân viên cửa hàng gần như luôn dùng こちら／あちら. Bài 1 bạn đã gặp: お{国|くに}は**どちら**ですか.',
      ],
    },
    {
      t: 'table',
      caption: 'Đếm tầng: ～{階|かい} (表 p.287) — chú ý các ô tô đậm',
      head: ['Tầng', 'Đọc', 'Romaji'],
      rows: [
        ['1{階|かい}', '**いっかい**', 'ikkai'],
        ['2{階|かい}', 'にかい', 'ni-kai'],
        ['3{階|かい}', '**さんがい**（さんかい）', 'san-gai'],
        ['4{階|かい}', '**よんかい**', 'yon-kai'],
        ['5{階|かい}', 'ごかい', 'go-kai'],
        ['6{階|かい}', '**ろっかい**', 'rokkai'],
        ['7{階|かい}', 'ななかい', 'nana-kai'],
        ['8{階|かい}', '**はちかい／はっかい**', 'hachi-kai / hakkai'],
        ['9{階|かい}', 'きゅうかい', 'kyuu-kai'],
        ['10{階|かい}', '**じゅっかい**', 'jukkai'],
        ['{地下|ちか}1{階|かい}', 'ちかいっかい', 'chika ikkai (tầng hầm 1, B1)'],
        ['？', '**なんがい**／なんかい', 'nan-gai / nan-kai'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp theo sơ đồ みどりショッピングビル',
      lines: [
        { who: 'A', role: 'a', text: 'すみません、くつ{屋|や}は{何階|なんがい}ですか。', ro: 'Sumimasen, kutsu-ya wa nan-gai desu ka.', vi: 'Xin lỗi, cửa hàng giày ở tầng mấy ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'くつ{屋|や}は{2階|にかい}です。', ro: 'Kutsu-ya wa ni-kai desu.', vi: 'Cửa hàng giày ở tầng 2.' },
        { who: 'A', role: 'a', text: 'きつえんじょも{2階|にかい}ですか。', ro: 'Kitsuenjo mo ni-kai desu ka.', vi: 'Chỗ hút thuốc cũng ở tầng 2 à?' },
        { who: '{店員|てんいん}', role: 'b', text: 'いいえ、{2階|にかい}じゃありません。{3階|さんがい}です。', ro: 'Iie, ni-kai ja arimasen. San-gai desu.', vi: 'Không, không phải tầng 2. Tầng 3 ạ.' },
        { who: 'A', role: 'a', text: 'そうですか。エレベーターはどこですか。', ro: 'Sou desu ka. Erebeetaa wa doko desu ka.', vi: 'Thế à. Thang máy ở đâu ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'エレベーターはあちらです。', ro: 'Erebeetaa wa achira desu.', vi: 'Thang máy ở phía kia ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['N は', 'どこですか／{何階|なんがい}ですか。', '→ Trả lời'],
      rows: [
        ['トイレ · ATM · エスカレーター · レジ', 'どこですか。', 'ここ／そこ／あそこ／こちら／あちら です。'],
        ['スーパー · {本屋|ほんや} · ケーキ{屋|や} · レストラン', '{何階|なんがい}ですか。', '{地下|ちか}{1階|いっかい}／{2階|にかい}／{1階|いっかい}／{5階|ごかい} です。'],
        ['{電子辞書|でんしじしょ} · カメラ · {米|こめ} · {卵|たまご}', 'どちらですか。', 'こちら／あちら です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — sai cách đọc tầng',
      items: [
        '~~さんかい~~ không sai hẳn, nhưng chuẩn là **さんがい**; hỏi thì **なんがい**. Giám thị hay hỏi đúng tầng 3 để bắt lỗi này.',
        '~~いちかい~~ → **いっかい**; ~~ろくかい~~ → **ろっかい**; ~~じゅうかい~~ → **じゅっかい**.',
        'Hỏi "ở đâu" thì trả lời NƠI CHỐN. Nghe "～は**どこ**ですか" mà đáp giá tiền hay tên đồ vật là mất trọn điểm câu đó.',
      ],
    },

    /* ── SỐ & GIÁ TIỀN ── */
    { t: 'h', text: 'Số đếm & đọc giá tiền (表 数字) — nền cho ポイント 10, 11' },
    {
      t: 'table',
      caption: 'Số 1–10 (và 0)',
      head: ['Số', 'Đọc', 'Romaji', 'Ghi chú'],
      rows: [
        ['0', 'ゼロ／れい', 'zero / rei', ''],
        ['1', 'いち', 'ichi', ''],
        ['2', 'に', 'ni', ''],
        ['3', 'さん', 'san', ''],
        ['4', '**よん**／し', 'yon / shi', 'Trong giá tiền dùng **よん**'],
        ['5', 'ご', 'go', ''],
        ['6', 'ろく', 'roku', ''],
        ['7', '**なな**／しち', 'nana / shichi', 'Trong giá tiền dùng **なな**'],
        ['8', 'はち', 'hachi', ''],
        ['9', '**きゅう**／く', 'kyuu / ku', 'Trong giá tiền dùng **きゅう**'],
        ['10', 'じゅう', 'juu', ''],
      ],
    },
    {
      t: 'p',
      text: 'Từ 11 trở đi **ghép như tiếng Việt**: 11 = じゅう + いち = **じゅういち**, 20 = に + じゅう = **にじゅう** ("hai mươi"), 35 = さんじゅう + ご = **さんじゅうご**, 99 = **きゅうじゅうきゅう**.',
    },
    {
      t: 'table',
      caption: 'Hàng chục · trăm · nghìn · vạn — ô tô đậm là biến âm, phải thuộc',
      head: ['', '×10 (じゅう)', '×100 (ひゃく)', '×1.000 (せん)', '×10.000 (まん)'],
      rows: [
        ['1', 'じゅう', 'ひゃく', '**せん**', '**いちまん**'],
        ['2', 'にじゅう', 'にひゃく', 'にせん', 'にまん'],
        ['3', 'さんじゅう', '**さんびゃく**', '**さんぜん**', 'さんまん'],
        ['4', 'よんじゅう', 'よんひゃく', 'よんせん', 'よんまん'],
        ['5', 'ごじゅう', 'ごひゃく', 'ごせん', 'ごまん'],
        ['6', 'ろくじゅう', '**ろっぴゃく**', 'ろくせん', 'ろくまん'],
        ['7', 'ななじゅう', 'ななひゃく', 'ななせん', 'ななまん'],
        ['8', 'はちじゅう', '**はっぴゃく**', '**はっせん**', 'はちまん'],
        ['9', 'きゅうじゅう', 'きゅうひゃく', 'きゅうせん', 'きゅうまん'],
        ['?', 'なんじゅう', '**なんびゃく**', '**なんぜん**', 'なんまん'],
      ],
    },
    {
      t: 'note',
      title: 'Bí quyết đọc số lớn: chia theo 万 (vạn), không theo nghìn',
      items: [
        'Tiếng Việt chia 3 số một (nghìn, triệu). Tiếng Nhật chia **4 số một**: 1 **万** = 10.000. Vì vậy 12.000 không phải "mười hai nghìn" mà là **1万 2千** = いちまん にせん.',
        'Cách làm: đếm 4 số từ phải sang, đặt dấu ở đó → phần bên trái đọc + **まん**, phần bên phải đọc như số dưới 10.000. 29.800 → 2|9800 → **にまん きゅうせん はっぴゃく**.',
        '**100 = ひゃく** (không nói いちひゃく), **1.000 = せん** (không nói いちせん), nhưng **10.000 = いちまん** (phải có いち).',
        'Số 0 ở giữa thì bỏ qua: 3.050 = さんぜん ごじゅう; 10.500 = いちまん ごひゃく.',
        'Giá tiền Việt: 55.000 đồng = 5万 5千 = **ごまん ごせん ドン**; 550.000 = 55万 = **ごじゅうごまん ドン**.',
      ],
    },
    {
      t: 'table',
      caption: 'Đọc thử giá tiền — che cột "Đọc" rồi tự nói',
      head: ['Giá', 'Tách', 'Đọc', 'Romaji'],
      rows: [
        ['{100円|ひゃくえん}', '100', 'ひゃくえん', 'hyaku en'],
        ['{350円|さんびゃくごじゅうえん}', '3百 + 50', 'さんびゃく ごじゅう えん', 'sanbyaku gojuu en'],
        ['{680円|ろっぴゃくはちじゅうえん}', '6百 + 80', 'ろっぴゃく はちじゅう えん', 'roppyaku hachijuu en'],
        ['{800円|はっぴゃくえん}', '8百', 'はっぴゃく えん', 'happyaku en'],
        ['{1,800円|せんはっぴゃくえん}', '千 + 8百', 'せん はっぴゃく えん', 'sen happyaku en'],
        ['{3,000円|さんぜんえん}', '3千', 'さんぜん えん', 'sanzen en'],
        ['{4,500円|よんせんごひゃくえん}', '4千 + 5百', 'よんせん ごひゃく えん', 'yonsen gohyaku en'],
        ['{8,300円|はっせんさんびゃくえん}', '8千 + 3百', 'はっせん さんびゃく えん', 'hassen sanbyaku en'],
        ['{12,000円|いちまんにせんえん}', '1万 + 2千', 'いちまん にせん えん', 'ichiman nisen en'],
        ['{29,800円|にまんきゅうせんはっぴゃくえん}', '2万 + 9千 + 8百', 'にまん きゅうせん はっぴゃく えん', 'niman kyuusen happyaku en'],
        ['{35,600円|さんまんごせんろっぴゃくえん}', '3万 + 5千 + 6百', 'さんまん ごせん ろっぴゃく えん', 'sanman gosen roppyaku en'],
        ['{50,000円|ごまんえん}', '5万', 'ごまん えん', 'goman en'],
      ],
    },
    {
      t: 'quiz',
      id: 'b2-np-doc-gia',
      title: 'Luyện đọc giá: viết cách đọc bằng hiragana (hoặc romaji)',
      kind: 'fill',
      grammar: 'Chia theo 万: phần trái + まん · rồi せん · ひゃく · じゅう. Nhớ: 300 さんびゃく · 600 ろっぴゃく · 800 はっぴゃく · 3000 さんぜん · 8000 はっせん.',
      items: [
        { q: '300円', answers: A('さんびゃくえん', 'さんびゃく えん', 'sanbyaku en', 'sanbyakuen'), hint: '3 × 100 — biến âm ひゃく → びゃく' },
        { q: '600円', answers: A('ろっぴゃくえん', 'ろっぴゃく えん', 'roppyaku en', 'roppyakuen'), hint: '6 × 100 — biến âm' },
        { q: '980円', answers: A('きゅうひゃくはちじゅうえん', 'きゅうひゃく はちじゅう えん', 'kyuuhyaku hachijuu en', 'kyuuhyakuhachijuuen'), hint: '9百 + 80' },
        { q: '1,500円', answers: A('せんごひゃくえん', 'せん ごひゃく えん', 'sen gohyaku en', 'sengohyakuen'), hint: '1.000 = せん (không có いち)' },
        { q: '3,800円', answers: A('さんぜんはっぴゃくえん', 'さんぜん はっぴゃく えん', 'sanzen happyaku en', 'sanzenhappyakuen'), hint: '3千 + 8百 — hai biến âm' },
        { q: '8,000円', answers: A('はっせんえん', 'はっせん えん', 'hassen en', 'hassenen'), hint: '8 × 1.000' },
        { q: '10,000円', answers: A('いちまんえん', 'いちまん えん', 'ichiman en', 'ichimanen'), hint: '1万 — phải có いち' },
        { q: '16,000円', answers: A('いちまんろくせんえん', 'いちまん ろくせん えん', 'ichiman rokusen en', 'ichimanrokusenen'), hint: '1万 + 6千' },
        { q: '23,400円', answers: A('にまんさんぜんよんひゃくえん', 'にまん さんぜん よんひゃく えん', 'niman sanzen yonhyaku en', 'nimansanzenyonhyakuen'), hint: '2万 + 3千 + 4百' },
        { q: '47,700円', answers: A('よんまんななせんななひゃくえん', 'よんまん ななせん ななひゃく えん', 'yonman nanasen nanahyaku en', 'yonmannanasennanahyakuen'), hint: '4 = よん, 7 = なな' },
      ],
    },

    /* ── ポイント 10 ── */
    { t: 'h', text: 'ポイント 10 — N を（～つ）ください' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N を ください。',
          vi: 'Cho tôi N. (mua hàng, gọi món)',
          examples: [
            { en: 'そのTシャツをください。', ro: 'Sono tii shatsu o kudasai.', vi: 'Cho tôi cái áo phông đó.' },
            { en: 'じゃ、これをください。', ro: 'Ja, kore o kudasai.', vi: 'Vậy cho tôi cái này.' },
          ],
        },
        {
          formula: 'N を ～つ ください。',
          vi: 'Cho tôi ～ cái N. (số lượng đứng NGAY SAU を, trước ください)',
          examples: [
            { en: 'ケーキを{2|ふた}つください。', ro: 'Keeki o futatsu kudasai.', vi: 'Cho tôi hai cái bánh.' },
            { en: 'コーヒーを{3|みっ}つください。', ro: 'Koohii o mittsu kudasai.', vi: 'Cho tôi ba cà phê.' },
          ],
        },
        {
          formula: 'N1 を ～つ と N2 を ～つ ください。',
          vi: 'Cho tôi ～ N1 và ～ N2. (と nối hai cụm "N を ～つ")',
          examples: [
            { en: 'ハンバーグを{2|ふた}つとカレーを{1|ひと}つください。', ro: 'Hanbaagu o futatsu to karee o hitotsu kudasai.', vi: 'Cho tôi hai thịt băm viên và một cà ri.' },
            { en: 'とんかつを{1|ひと}つとビールを{2|ふた}つください。', ro: 'Tonkatsu o hitotsu to biiru o futatsu kudasai.', vi: 'Cho tôi một thịt lợn chiên xù và hai bia.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**を** (đọc "o") đánh dấu **đồ vật mình muốn lấy**. **ください** = "xin hãy cho tôi". Không cần số lượng thì bỏ ～つ; muốn số lượng thì đặt ～つ ngay trước ください, **không** thêm の hay を nữa.',
    },
    {
      t: 'table',
      caption: 'Đếm đồ vật: ～つ (表 p.287) — thuộc cả 10 cái, từ 11 trở đi dùng số thường (じゅういち…)',
      head: ['Số', 'Đọc', 'Romaji'],
      rows: [
        ['1つ', 'ひとつ', 'hitotsu'],
        ['2つ', 'ふたつ', 'futatsu'],
        ['3つ', 'みっつ', 'mittsu'],
        ['4つ', 'よっつ', 'yottsu'],
        ['5つ', 'いつつ', 'itsutsu'],
        ['6つ', 'むっつ', 'muttsu'],
        ['7つ', 'ななつ', 'nanatsu'],
        ['8つ', 'やっつ', 'yattsu'],
        ['9つ', 'ここのつ', 'kokonotsu'],
        ['10', '**とお** (không có つ)', 'too'],
        ['?', '**いくつ**', 'ikutsu — bao nhiêu cái'],
      ],
    },
    {
      t: 'table',
      caption: 'Xem trước: các cách đếm khác sẽ gặp ở Bài 6, 9 (～{枚|まい} vật mỏng · ～{本|ほん} vật dài/chai · ～{杯|はい} cốc/bát)',
      head: ['Số', '～{階|かい} (tầng)', '～つ (cái)', '～{枚|まい} (tờ, áo)', '～{本|ほん} (chai, bút)', '～{杯|はい} (cốc, bát)'],
      rows: [
        ['1', 'いっかい', 'ひとつ', 'いちまい', '**いっぽん**', '**いっぱい**'],
        ['2', 'にかい', 'ふたつ', 'にまい', 'にほん', 'にはい'],
        ['3', '**さんがい**', 'みっつ', 'さんまい', '**さんぼん**', '**さんばい**'],
        ['4', 'よんかい', 'よっつ', 'よんまい', 'よんほん', 'よんはい'],
        ['5', 'ごかい', 'いつつ', 'ごまい', 'ごほん', 'ごはい'],
        ['6', 'ろっかい', 'むっつ', 'ろくまい', '**ろっぽん**', '**ろっぱい**'],
        ['?', 'なんがい', 'いくつ', 'なんまい', 'なんぼん', 'なんばい'],
      ],
    },
    {
      t: 'note',
      title: 'Ở Bài 2 dùng ～つ cho mọi thứ',
      items: [
        'Gọi món, mua đồ ở Bài 2 cứ dùng **～つ**: ビールを{2|ふた}つ, ご{飯|はん}を{2|ふた}つ, Tシャツを{1|ひと}つ — đúng và tự nhiên. ～{本|ほん}／～{杯|はい}／～{枚|まい} để sau.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: gọi món',
      lines: [
        { who: 'A', role: 'a', text: 'すみません、{注文|ちゅうもん}をお{願|ねが}いします。', ro: 'Sumimasen, chuumon o onegai shimasu.', vi: 'Xin lỗi, cho tôi gọi món.' },
        { who: '{店員|てんいん}', role: 'b', text: 'はい、どうぞ。', ro: 'Hai, douzo.', vi: 'Vâng, xin mời.' },
        { who: 'A', role: 'a', text: 'カレーを{2|ふた}つとスープを{1|ひと}つください。', ro: 'Karee o futatsu to suupu o hitotsu kudasai.', vi: 'Cho tôi hai cà ri và một súp.' },
        { who: '{店員|てんいん}', role: 'b', text: 'はい。カレーを{2|ふた}つとスープを{1|ひと}つですね。', ro: 'Hai. Karee o futatsu to suupu o hitotsu desu ne.', vi: 'Vâng. Hai cà ri và một súp phải không ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['N1 を', '～つ', 'と N2 を', '～つ', 'ください。'],
      rows: [
        ['とんかつを', '{1|ひと}つ', 'とライスを', '{1|ひと}つ', 'ください。'],
        ['ハンバーグを', '{2|ふた}つ', 'とジュースを', '{2|ふた}つ', 'ください。'],
        ['コーヒーを', '{3|みっ}つ', 'とケーキを', '{3|みっ}つ', 'ください。'],
        ['{紅茶|こうちゃ}を', '{4|よっ}つ', 'とパンを', '{5|いつ}つ', 'ください。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~コーヒーを{2|ふた}つをください~~ → **コーヒーを{2|ふた}つください** (chỉ một を, sau danh từ).',
        '~~{2|ふた}つコーヒー~~ (dịch từng chữ "hai cà phê") → **コーヒーを{2|ふた}つ**. Danh từ trước, số lượng sau.',
        '~~ふたつ~~ đọc thành ~~につ~~: ～つ có cách đọc riêng (ひと・ふた・みっ・よっ…), không dùng いち・に・さん.',
        'Quên を khi thi bị trừ **2 điểm** (lỗi trợ từ).',
      ],
    },

    /* ── ポイント 11 ── */
    { t: 'h', text: 'ポイント 11 — いくら' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は いくらですか。 → ～{円|えん}です。',
          vi: 'N bao nhiêu tiền? → ～ yên.',
          examples: [
            { en: 'これはいくらですか。', ro: 'Kore wa ikura desu ka.', vi: 'Cái này bao nhiêu tiền?' },
            { en: '{10,000円|いちまんえん}です。', ro: 'Ichiman en desu.', vi: '10.000 yên.' },
          ],
        },
        {
          formula: '{1|ひと}つ いくらですか。 → {1|ひと}つ ～{円|えん}です。',
          vi: 'Bao nhiêu tiền một cái? → ～ yên một cái.',
          examples: [
            { en: 'このリンゴは{1|ひと}ついくらですか。', ro: 'Kono ringo wa hitotsu ikura desu ka.', vi: 'Táo này bao nhiêu một quả?' },
            { en: '{1|ひと}つ{150円|ひゃくごじゅうえん}です。', ro: 'Hitotsu hyaku gojuu en desu.', vi: '150 yên một quả.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: hỏi hai giá rồi chọn',
      lines: [
        { who: 'A', role: 'a', text: 'すみません。このくつはいくらですか。', ro: 'Sumimasen. Kono kutsu wa ikura desu ka.', vi: 'Xin lỗi. Đôi giày này bao nhiêu tiền?' },
        { who: '{店員|てんいん}', role: 'b', text: '{7,900円|ななせんきゅうひゃくえん}です。', ro: 'Nanasen kyuuhyaku en desu.', vi: '7.900 yên ạ.' },
        { who: 'A', role: 'a', text: 'そうですか。そのくつはいくらですか。', ro: 'Sou desu ka. Sono kutsu wa ikura desu ka.', vi: 'Thế à. Còn đôi giày đó bao nhiêu?' },
        { who: '{店員|てんいん}', role: 'b', text: 'これは{5,600円|ごせんろっぴゃくえん}です。', ro: 'Kore wa gosen roppyaku en desu.', vi: 'Đôi này 5.600 yên ạ.' },
        { who: 'A', role: 'a', text: 'じゃ、それをください。', ro: 'Ja, sore o kudasai.', vi: 'Vậy cho tôi đôi đó.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['この／その／あの N は', 'いくらですか。', '→ ～{円|えん}です。'],
      rows: [
        ['この{電子辞書|でんしじしょ}は', 'いくらですか。', '{18,000円|いちまんはっせんえん}です。'],
        ['そのかばんは', 'いくらですか。', '{6,500円|ろくせんごひゃくえん}です。'],
        ['あのワインは', 'いくらですか。', '{2,800円|にせんはっぴゃくえん}です。'],
        ['{卵|たまご}は', 'いくらですか。', '{280円|にひゃくはちじゅうえん}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Dễ nhầm: いくら ・ いくつ ・ おいくつ',
      items: [
        '**いくら** = bao nhiêu **tiền**. → ～{円|えん}です.',
        '**いくつ** = bao nhiêu **cái**. → ～つです. (ケーキはいくつですか → {3|みっ}つです)',
        '**おいくつ** = bao nhiêu **tuổi** (lịch sự, Bài 1). → ～{歳|さい}です.',
        'Trả lời giá mà quên {円|えん} khi thi vẫn hiểu được, nhưng nói đủ "～{円|えん}です" mới trọn điểm.',
      ],
    },

    /* ── ポイント 12 ── */
    { t: 'h', text: 'ポイント 12 — {何|なん}の N' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'これは {何|なん}の N ですか。 → N1 の N です。',
          vi: 'Đây là N (làm từ / về) cái gì? → Là N (làm từ) N1.',
          examples: [
            { en: 'これは{何|なん}のカレーですか。', ro: 'Kore wa nan no karee desu ka.', vi: 'Đây là cà ri gì?' },
            { en: '{豚肉|ぶたにく}のカレーです。', ro: 'Butaniku no karee desu.', vi: 'Cà ri thịt lợn.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '{何|なん}の N hỏi **nội dung / nguyên liệu / loại** của N: cà ri **gì** (bò hay gà?), bánh **gì** (dâu hay táo?), sách **gì** (sách tiếng Nhật?). Trả lời thay {何|なん} bằng danh từ trả lời. So với "これは{何|なん}ですか" (cái này là **cái gì**?) — câu này đã biết là cà ri rồi, chỉ hỏi **loại** cà ri.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'これは{何|なん}の{料理|りょうり}ですか。', ro: 'Kore wa nan no ryouri desu ka.', vi: 'Đây là món gì?' },
        { who: '{店員|てんいん}', role: 'b', text: 'それは{牛肉|ぎゅうにく}の{料理|りょうり}です。', ro: 'Sore wa gyuuniku no ryouri desu.', vi: 'Đó là món thịt bò.' },
        { who: 'A', role: 'a', text: 'じゃ、これは{何|なん}のジュースですか。', ro: 'Ja, kore wa nan no juusu desu ka.', vi: 'Vậy đây là nước ép gì?' },
        { who: '{店員|てんいん}', role: 'b', text: 'リンゴのジュースです。', ro: 'Ringo no juusu desu.', vi: 'Nước táo ạ.' },
        { who: 'A', role: 'a', text: 'それは{野菜|やさい}のスープですか。', ro: 'Sore wa yasai no suupu desu ka.', vi: 'Kia là súp rau à?' },
        { who: '{店員|てんいん}', role: 'b', text: 'いいえ、{野菜|やさい}のスープじゃありません。{魚|さかな}のスープです。', ro: 'Iie, yasai no suupu ja arimasen. Sakana no suupu desu.', vi: 'Không, không phải súp rau. Là súp cá.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['これは {何|なん}の', 'N', 'ですか。', '→ Trả lời'],
      rows: [
        ['これは{何|なん}の', 'カレー', 'ですか。', '{牛肉|ぎゅうにく}／{鶏肉|とりにく}／{豚肉|ぶたにく}／{野菜|やさい} のカレーです。'],
        ['これは{何|なん}の', 'ケーキ', 'ですか。', 'イチゴ／リンゴ のケーキです。'],
        ['これは{何|なん}の', 'スープ', 'ですか。', '{野菜|やさい}／{魚|さかな}／{肉|にく} のスープです。'],
        ['これは{何|なん}の', '{本|ほん}', 'ですか。', '{日本語|にほんご}／{英語|えいご}／{料理|りょうり} の{本|ほん}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '{何|なん}の đọc **なん**の, không đọc ~~なにの~~ (một số tài liệu viết なにの — nghe hiểu được, nhưng nói なんの).',
        'Đáp phải là **danh từ + の + N**: ~~{牛肉|ぎゅうにく}カレーです~~ → **{牛肉|ぎゅうにく}のカレーです** (thiếu の là lỗi trợ từ).',
      ],
    },

    /* ── ポイント 13 ── */
    { t: 'h', text: 'ポイント 13 — どこの N' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'これは どこの N ですか。 → （{国|くに}／{会社|かいしゃ}）の N です。',
          vi: 'Đây là N của nước nào / hãng nào? → Là N của (nước / công ty) ～.',
          examples: [
            { en: 'これはどこのビールですか。', ro: 'Kore wa doko no biiru desu ka.', vi: 'Đây là bia nước nào?' },
            { en: 'ドイツのビールです。', ro: 'Doitsu no biiru desu.', vi: 'Bia Đức.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'どこの N hỏi **xuất xứ**: của nước nào, hãng nào, trường nào. Bài 1 bạn đã gặp dạng này với người: どこの{大学|だいがく}の{学生|がくせい}ですか. Đừng nhầm với **N はどこですか** (N ở đâu — hỏi vị trí).',
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'このワインはどこのワインですか。', ro: 'Kono wain wa doko no wain desu ka.', vi: 'Rượu vang này là vang nước nào?' },
        { who: '{店員|てんいん}', role: 'b', text: 'フランスのワインです。', ro: 'Furansu no wain desu.', vi: 'Vang Pháp ạ.' },
        { who: 'A', role: 'a', text: 'そのカレーもフランスのカレーですか。', ro: 'Sono karee mo Furansu no karee desu ka.', vi: 'Cà ri đó cũng là cà ri Pháp à?' },
        { who: '{店員|てんいん}', role: 'b', text: 'いいえ、インドのカレーです。', ro: 'Iie, Indo no karee desu.', vi: 'Không, là cà ri Ấn Độ.' },
        { who: 'A', role: 'a', text: 'あのカメラはどこのカメラですか。', ro: 'Ano kamera wa doko no kamera desu ka.', vi: 'Cái máy ảnh kia là máy nước nào?' },
        { who: '{店員|てんいん}', role: 'b', text: '{日本|にほん}のカメラです。', ro: 'Nihon no kamera desu.', vi: 'Máy ảnh Nhật ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['これは どこの', 'N', 'ですか。', '→ ～の N です。'],
      rows: [
        ['これはどこの', 'ビール', 'ですか。', 'ドイツ／アメリカ／{日本|にほん} のビールです。'],
        ['これはどこの', 'ワイン', 'ですか。', 'フランス／イタリア のワインです。'],
        ['これはどこの', '{紅茶|こうちゃ}', 'ですか。', 'インド のです。'],
        ['これはどこの', 'パソコン', 'ですか。', 'アメリカ／{韓国|かんこく}／{中国|ちゅうごく} のパソコンです。'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp: どこの N ≠ N はどこ',
      items: [
        '**これはどこのビールですか** → hỏi bia **của nước nào** → ドイツのビールです.',
        '**ビールはどこですか** → hỏi bia **ở chỗ nào** → あそこです／{地下|ちか}{1階|いっかい}です.',
        'Câu trả lời ngắn có thể bỏ N lặp lại: ドイツの**です** (xem thêm ポイント 14).',
      ],
    },

    /* ── ポイント 14 ── */
    { t: 'h', text: 'ポイント 14 — {誰|だれ}の N' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'これは {誰|だれ}の N ですか。 → （{人|ひと}）の N です。',
          vi: 'Đây là N của ai? → Là N của (người) ～.',
          examples: [
            { en: 'これは{誰|だれ}の{財布|さいふ}ですか。', ro: 'Kore wa dare no saifu desu ka.', vi: 'Đây là ví của ai?' },
            { en: '{私|わたし}の{財布|さいふ}です。', ro: 'Watashi no saifu desu.', vi: 'Ví của tôi.' },
          ],
        },
        {
          formula: 'この N は {誰|だれ}のですか。 → ～さんのです。',
          vi: 'Cái N này là của ai? → Của ～. (đã rõ là N nên bỏ N sau の)',
          examples: [
            { en: 'このかばんは{誰|だれ}のですか。', ro: 'Kono kaban wa dare no desu ka.', vi: 'Cái túi này là của ai?' },
            { en: 'ワンさんのです。', ro: 'Wan-san no desu.', vi: 'Của Wang.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: hai nhánh trả lời',
      lines: [
        { who: 'A', role: 'a', text: 'あ、{時計|とけい}！これは{誰|だれ}の{時計|とけい}ですか。', ro: 'A, tokei! Kore wa dare no tokei desu ka.', vi: 'Ơ, đồng hồ! Đây là đồng hồ của ai?' },
        { who: 'B', role: 'b', text: 'あ、それは{私|わたし}の{時計|とけい}です。ありがとうございます。', ro: 'A, sore wa watashi no tokei desu. Arigatou gozaimasu.', vi: '(Nhánh 1 — của mình) A, đó là đồng hồ của tôi. Cảm ơn.' },
        { who: 'A', role: 'a', text: 'この{携帯電話|けいたいでんわ}もBさんのですか。', ro: 'Kono keitai denwa mo B-san no desu ka.', vi: 'Điện thoại này cũng của B à?' },
        { who: 'B', role: 'b', text: 'いいえ、{私|わたし}のじゃありません。Cさんのです。Cさん、{携帯電話|けいたいでんわ}！', ro: 'Iie, watashi no ja arimasen. C-san no desu. C-san, keitai denwa!', vi: '(Nhánh 2 — của người khác) Không, không phải của tôi. Của C. C ơi, điện thoại!' },
        { who: 'C', role: 'c', text: 'あ、すみません。', ro: 'A, sumimasen.', vi: 'A, xin lỗi (cảm ơn nhé).' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['これは {誰|だれ}の', 'N', 'ですか。', '→ Trả lời'],
      rows: [
        ['これは{誰|だれ}の', 'カメラ', 'ですか。', '{私|わたし}のカメラです。／{私|わたし}のです。'],
        ['これは{誰|だれ}の', 'かばん', 'ですか。', 'マルコさんのかばんです。／マルコさんのです。'],
        ['これは{誰|だれ}の', '{財布|さいふ}', 'ですか。', 'ナタポンさんの{財布|さいふ}です。'],
        ['これは{誰|だれ}の', '{電子辞書|でんしじしょ}', 'ですか。', '{先生|せんせい}の{電子辞書|でんしじしょ}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '{誰|だれ} viết kana là **だれ** (dare). Cô viết だれ; sách viết {誰|だれ}. Lịch sự hơn là **どなた** (chỉ cần biết).',
        'Bỏ N chỉ khi đã rõ đang nói về N: ワンさん**の**です ✓. Nhưng ~~ワンさんです~~ (thiếu の) lại thành "Đây là anh Wang" — sai nghĩa hoàn toàn.',
        'Tự nói về mình: ~~{私|わたし}のさん~~ ✗, ~~わたしのさいふさん~~ ✗ — さん chỉ gắn vào **tên người khác**.',
      ],
    },

    /* ── ポイント 15 ── */
    { t: 'h', text: 'ポイント 15 — N（～{語|ご}）で' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '「X」は ～{語|ご}で {何|なん}ですか。 → 「Y」です。',
          vi: '"X" tiếng ～ là gì? → Là "Y". (で = "bằng" ngôn ngữ ～)',
          examples: [
            { en: '「ぶたにく」は{英語|えいご}で{何|なん}ですか。', ro: '"Butaniku" wa eigo de nan desu ka.', vi: '"Butaniku" tiếng Anh là gì?' },
            { en: '「pork」です。', ro: '"Pork" desu.', vi: 'Là "pork".' },
          ],
        },
        {
          formula: '「X」は ～{語|ご}で 「Y」です。',
          vi: 'Câu trả lời đầy đủ (được điểm cao hơn khi thi).',
          examples: [
            { en: '「ぶたにく」は{英語|えいご}で「pork」です。', ro: '"Butaniku" wa eigo de "pork" desu.', vi: '"Butaniku" tiếng Anh là "pork".' },
            { en: '「pen」は{日本語|にほんご}で「ペン」です。', ro: '"Pen" wa Nihongo de "pen" desu.', vi: '"Pen" tiếng Nhật là "ペン".' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**で** ở đây là trợ từ chỉ **phương tiện**: "bằng tiếng Anh". Dùng khi không biết một từ, hoặc muốn hỏi người Nhật một từ trong tiếng họ. Tên tiếng: tên nước + **{語|ご}**: {日本語|にほんご}, {英語|えいご} (ngoại lệ — không phải イギリス{語|ご}), ベトナム{語|ご}, {中国語|ちゅうごくご}, {韓国語|かんこくご}, フランス{語|ご}, ドイツ{語|ご}.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: '「{鶏肉|とりにく}」は{英語|えいご}で{何|なん}ですか。', ro: '"Toriniku" wa eigo de nan desu ka.', vi: '"Toriniku" tiếng Anh là gì?' },
        { who: 'B', role: 'b', text: '「chicken」です。', ro: '"Chicken" desu.', vi: 'Là "chicken".' },
        { who: 'A', role: 'a', text: '「{時計|とけい}」はベトナム{語|ご}で{何|なん}ですか。', ro: '"Tokei" wa Betonamu-go de nan desu ka.', vi: '"Tokei" tiếng Việt là gì?' },
        { who: 'B', role: 'b', text: '「{時計|とけい}」はベトナム{語|ご}で「đồng hồ」です。', ro: '"Tokei" wa Betonamu-go de "đồng hồ" desu.', vi: '"Tokei" tiếng Việt là "đồng hồ".' },
        { who: 'A', role: 'a', text: '「apple」は{日本語|にほんご}で{何|なん}ですか。', ro: '"Apple" wa Nihongo de nan desu ka.', vi: '"Apple" tiếng Nhật là gì?' },
        { who: 'B', role: 'b', text: '「リンゴ」です。', ro: '"Ringo" desu.', vi: 'Là "ringo".' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['「X」は', '～{語|ご}で', '{何|なん}ですか。', '→ 「Y」です。'],
      rows: [
        ['「{牛肉|ぎゅうにく}」は', '{英語|えいご}で', '{何|なん}ですか。', '「beef」です。'],
        ['「{野菜|やさい}」は', '{英語|えいご}で', '{何|なん}ですか。', '「vegetable」です。'],
        ['「{卵|たまご}」は', 'ベトナム{語|ご}で', '{何|なん}ですか。', '「trứng」です。'],
        ['「water」は', '{日本語|にほんご}で', '{何|なん}ですか。', '「{水|みず}」です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~{英語|えいご}は{何|なん}ですか~~ (= "Tiếng Anh là gì?") — thiếu で, sai nghĩa. Phải là **「X」は{英語|えいご}で{何|なん}ですか**.',
        'Đề thi có câu 「コンピュータ」はベトナム{語|ご}で{何|なん}ですか — trả lời bằng **tiếng Việt** trong ngoặc: 「máy tính」です.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — các câu hỏi của Bài 2 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['これは{何|なん}ですか。', 'Là cái gì', 'それは{電子辞書|でんしじしょ}です。', '7'],
        ['この N はいくらですか。', 'Giá', 'その N は～{円|えん}です。', '8, 11'],
        ['N はどこですか。', 'Vị trí', 'あそこです。／こちらです。', '9'],
        ['N は{何階|なんがい}ですか。', 'Tầng', '{3階|さんがい}です。', '9'],
        ['{注文|ちゅうもん}、どうぞ。', 'Gọi món', 'N を～つください。', '10'],
        ['これは{何|なん}の N ですか。', 'Nguyên liệu, loại', '{豚肉|ぶたにく}の N です。', '12'],
        ['これはどこの N ですか。', 'Xuất xứ', 'ドイツの N です。', '13'],
        ['これは{誰|だれ}の N ですか。', 'Chủ sở hữu', '{私|わたし}の N です。／～さんのです。', '14'],
        ['「X」は～{語|ご}で{何|なん}ですか。', 'Nghĩa trong tiếng khác', '「X」は～{語|ご}で「Y」です。', '15'],
      ],
    },

    {
      t: 'build',
      id: 'b2-np-ghep',
      title: 'Ghép câu — dùng đủ 9 điểm ngữ pháp',
      items: [
        { vi: 'Cái kia là quầy thu ngân.', chips: ['あれ', 'は', 'レジ', 'です', 'あの', 'を'], answer: ['あれ', 'は', 'レジ', 'です'], ro: 'Are wa reji desu.' },
        { vi: 'Cái áo phông này bao nhiêu tiền?', chips: ['この', 'Tシャツ', 'は', 'いくら', 'ですか', 'これ'], answer: ['この', 'Tシャツ', 'は', 'いくら', 'ですか'], ro: 'Kono tii shatsu wa ikura desu ka.' },
        { vi: 'Nhà vệ sinh ở đâu?', chips: ['トイレ', 'は', 'どこ', 'ですか', 'どこの', 'を'], answer: ['トイレ', 'は', 'どこ', 'ですか'], ro: 'Toire wa doko desu ka.' },
        { vi: 'Cửa hàng 100 yên ở tầng 3.', chips: ['{100円|ひゃくえん}ショップ', 'は', '{3階|さんがい}', 'です', 'の', 'を'], answer: ['{100円|ひゃくえん}ショップ', 'は', '{3階|さんがい}', 'です'], ro: 'Hyaku-en shoppu wa san-gai desu.' },
        { vi: 'Cho tôi hai thịt băm viên và một cà ri.', chips: ['ハンバーグ', 'を', '{2|ふた}つ', 'と', 'カレー', 'を', '{1|ひと}つ', 'ください', 'の'], answer: ['ハンバーグ', 'を', '{2|ふた}つ', 'と', 'カレー', 'を', '{1|ひと}つ', 'ください'], ro: 'Hanbaagu o futatsu to karee o hitotsu kudasai.' },
        { vi: 'Đây là cà ri gì? (làm từ gì)', chips: ['これ', 'は', '{何|なん}の', 'カレー', 'ですか', 'どこ'], answer: ['これ', 'は', '{何|なん}の', 'カレー', 'ですか'], ro: 'Kore wa nan no karee desu ka.' },
        { vi: 'Đây là bia Đức.', chips: ['これ', 'は', 'ドイツ', 'の', 'ビール', 'です', 'を'], answer: ['これ', 'は', 'ドイツ', 'の', 'ビール', 'です'], ro: 'Kore wa Doitsu no biiru desu.' },
        { vi: 'Cái ví này là của ai?', chips: ['この', '{財布|さいふ}', 'は', '{誰|だれ}', 'の', 'ですか', 'どこ'], answer: ['この', '{財布|さいふ}', 'は', '{誰|だれ}', 'の', 'ですか'], ro: 'Kono saifu wa dare no desu ka.' },
        { vi: '"Butaniku" tiếng Anh là gì?', chips: ['「ぶたにく」', 'は', '{英語|えいご}', 'で', '{何|なん}', 'ですか', 'の'], answer: ['「ぶたにく」', 'は', '{英語|えいご}', 'で', '{何|なん}', 'ですか'], ro: '"Butaniku" wa eigo de nan desu ka.' },
        { vi: 'Vậy thì cho tôi cái đó.', chips: ['じゃ、', 'それ', 'を', 'ください', 'その', 'は'], answer: ['じゃ、', 'それ', 'を', 'ください'], ro: 'Ja, sore o kudasai.' },
        { vi: 'Máy ảnh ở phía kia ạ. (nhân viên nói)', chips: ['カメラ', 'は', 'あちら', 'です', 'あれ', 'の'], answer: ['カメラ', 'は', 'あちら', 'です'], ro: 'Kamera wa achira desu.' },
        { vi: 'Cái đồng hồ đó là đồng hồ Nhật.', chips: ['その', '{時計|とけい}', 'は', '{日本|にほん}', 'の', '{時計|とけい}', 'です', 'それ'], answer: ['その', '{時計|とけい}', 'は', '{日本|にほん}', 'の', '{時計|とけい}', 'です'], ro: 'Sono tokei wa Nihon no tokei desu.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 2',
      items: [
        { q: 'Giám thị cầm cái bút và hỏi 「これは{何|なん}ですか」. Bạn đáp:', options: ['これはペンです。', 'それはペンです。', 'あれはペンです。', 'このペンです。'], correct: 1, why: 'Vật ở phía người hỏi (gần người nghe là bạn nhìn sang) → dùng **それ**.' },
        { q: '「＿＿ かばんはいくらですか。」 (cái túi kia)', options: ['あれ', 'あの', 'あそこ', 'あちら'], correct: 1, why: 'Có danh từ theo sau → **あの** N (ポイント 8).' },
        { q: 'Hỏi tầng của nhà hàng:', options: ['レストランはいくらですか。', 'レストランは{何階|なんがい}ですか。', 'レストランは{何|なん}のですか。', 'レストランはだれですか。'], correct: 1, why: 'Tầng mấy = **{何階|なんがい}** (ポイント 9).' },
        { q: '「3{階|かい}」 đọc là:', options: ['さんかい (chỉ cách này)', 'さんがい', 'みっかい', 'さんばい'], correct: 1, why: '3階 = **さんがい** (biến âm). さんかい đôi khi nghe thấy nhưng chuẩn là さんがい.' },
        { q: '「コーヒー＿ {2|ふた}つください。」', options: ['は', 'の', 'を', 'で'], correct: 2, why: 'Đồ muốn lấy + **を** + số lượng + ください (ポイント 10).' },
        { q: '8,000円 đọc là:', options: ['はちせんえん', 'はっせんえん', 'はっぴゃくえん', 'はちまんえん'], correct: 1, why: '8 × 1000 = **はっせん** (biến âm). はっぴゃく = 800, はちまん = 80.000.' },
        { q: '「これは＿＿のビールですか。」 — 「ドイツのビールです。」', options: ['{何|なん}', 'どこ', 'だれ', 'いくら'], correct: 1, why: 'Hỏi xuất xứ (nước nào) → **どこの** N (ポイント 13).' },
        { q: '「これは＿＿のスープですか。」 — 「{野菜|やさい}のスープです。」', options: ['どこ', 'だれ', '{何|なん}', 'いくつ'], correct: 2, why: 'Hỏi làm từ gì → **{何|なん}の** N (ポイント 12).' },
        { q: '「このかばんは{誰|だれ}のですか。」 Câu trả lời đúng:', options: ['マルコさんです。', 'マルコさんのです。', 'マルコさんをです。', 'マルコのさんです。'], correct: 1, why: '"Của Marco" = マルコさん**の**です. Thiếu の thành "là anh Marco" (ポイント 14).' },
        { q: '"Tokei" tiếng Anh là gì?', options: ['「とけい」は{英語|えいご}の{何|なん}ですか。', '「とけい」は{英語|えいご}で{何|なん}ですか。', '「とけい」は{英語|えいご}を{何|なん}ですか。', '{英語|えいご}は「とけい」ですか。'], correct: 1, why: 'Bằng ngôn ngữ ～ → **～{語|ご}で** (ポイント 15).' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b2-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 2 + chữ số viết giá',
  goal: 'Đọc được mọi chữ Hán trong từ vựng Bài 2 và đọc được giá tiền viết bằng chữ Hán như 三万五千六百円.',
  minutes: 25,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của bài thi có **4 từ chữ Hán gạch chân không có furigana** (12 điểm). Chữ Hán trong đề chính là chữ của từ vựng các bài — và **giá tiền rất hay được viết bằng chữ Hán** (vd. 三万五千六百円). Học theo **từ** (đọc cả cụm {店員|てんいん}), đừng học từng chữ rời.',
    },
    {
      t: 'table',
      caption: 'Nhóm 1 — Chữ số và tiền (bắt buộc cho phần đọc giá)',
      head: ['Chữ', 'Hán Việt', 'Đọc trong số', 'Ví dụ'],
      rows: [
        ['一', 'NHẤT', 'いち・ひと(つ)', '一つ ひとつ · 一万 いちまん'],
        ['二', 'NHỊ', 'に・ふた(つ)', '二つ ふたつ · 二階 にかい'],
        ['三', 'TAM', 'さん・みっ(つ)', '三階 さんがい · 三百 さんびゃく'],
        ['四', 'TỨ', 'よん・し・よっ(つ)', '四階 よんかい · 四千 よんせん'],
        ['五', 'NGŨ', 'ご・いつ(つ)', '五百円 ごひゃくえん'],
        ['六', 'LỤC', 'ろく・むっ(つ)', '六百 ろっぴゃく'],
        ['七', 'THẤT', 'なな・しち', '七千 ななせん'],
        ['八', 'BÁT', 'はち・やっ(つ)', '八百 はっぴゃく · 八千 はっせん'],
        ['九', 'CỬU', 'きゅう・く', '九百 きゅうひゃく'],
        ['十', 'THẬP', 'じゅう・とお', '十 とお (10 cái) · 三十 さんじゅう'],
        ['百', 'BÁCH', 'ひゃく (びゃく・ぴゃく)', '百円 ひゃくえん · 三百 さんびゃく'],
        ['千', 'THIÊN', 'せん (ぜん)', '千円 せんえん · 三千 さんぜん'],
        ['万', 'VẠN', 'まん', '一万円 いちまんえん'],
        ['円', 'VIÊN', 'えん', '百円ショップ ひゃくえんショップ'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 2 — Nơi chốn, cửa hàng, đồ vật',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['階', 'GIAI', 'かい', '—', '{何階|なんがい} · {3階|さんがい}'],
        ['屋', 'ỐC', 'おく', 'や', '{本屋|ほんや} · くつ{屋|や}'],
        ['地', 'ĐỊA', 'ち・じ', '—', '{地下|ちか}'],
        ['下', 'HẠ', 'か・げ', 'した', '{地下|ちか}'],
        ['店', 'ĐIẾM', 'てん', 'みせ', '{店員|てんいん} · {店|みせ}'],
        ['員', 'VIÊN', 'いん', '—', '{店員|てんいん} · {会社員|かいしゃいん}'],
        ['本', 'BẢN', 'ほん', 'もと', '{本|ほん} · {本屋|ほんや} · {日本|にほん}'],
        ['携', 'HUỀ', 'けい', 'たずさ(える)', '{携帯電話|けいたいでんわ}'],
        ['帯', 'ĐỚI', 'たい', 'おび', '{携帯電話|けいたいでんわ}'],
        ['電', 'ĐIỆN', 'でん', '—', '{電話|でんわ} · {電子辞書|でんしじしょ}'],
        ['話', 'THOẠI', 'わ', 'はな(す)', '{電話|でんわ}'],
        ['子', 'TỬ', 'し', 'こ', '{電子辞書|でんしじしょ}'],
        ['辞', 'TỪ', 'じ', 'や(める)', '{辞書|じしょ}'],
        ['書', 'THƯ', 'しょ', 'か(く)', '{辞書|じしょ}'],
        ['消', 'TIÊU', 'しょう', 'け(す)', '{消|け}しゴム'],
        ['時', 'THỜI', 'じ', 'とき', '{時計|とけい}'],
        ['計', 'KẾ', 'けい', 'はか(る)', '{時計|とけい}'],
        ['財', 'TÀI', 'ざい・さい', '—', '{財布|さいふ}'],
        ['布', 'BỐ', 'ふ', 'ぬの', '{財布|さいふ}'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 3 — Đồ ăn, thức uống',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['油', 'DU', 'ゆ', 'あぶら', '{油|あぶら}'],
        ['米', 'MỄ', 'べい・まい', 'こめ', '{米|こめ}'],
        ['卵', 'NOÃN', 'らん', 'たまご', '{卵|たまご}'],
        ['水', 'THUỶ', 'すい', 'みず', '{水|みず}'],
        ['魚', 'NGƯ', 'ぎょ', 'さかな', '{魚|さかな}'],
        ['肉', 'NHỤC', 'にく', '—', '{肉|にく} · {牛肉|ぎゅうにく}'],
        ['牛', 'NGƯU', 'ぎゅう', 'うし', '{牛肉|ぎゅうにく}'],
        ['鶏', 'KÊ', 'けい', 'にわとり・とり', '{鶏肉|とりにく}'],
        ['豚', 'ĐỒN', 'とん', 'ぶた', '{豚肉|ぶたにく} · とんかつ (とん = 豚)'],
        ['野', 'DÃ', 'や', 'の', '{野菜|やさい}'],
        ['菜', 'THÁI', 'さい', 'な', '{野菜|やさい}'],
        ['料', 'LIỆU', 'りょう', '—', '{料理|りょうり}'],
        ['理', 'LÝ', 'り', '—', '{料理|りょうり}'],
        ['飯', 'PHẠN', 'はん', 'めし', 'ご{飯|はん}'],
        ['紅', 'HỒNG', 'こう', 'べに', '{紅茶|こうちゃ}'],
        ['茶', 'TRÀ', 'ちゃ・さ', '—', 'お{茶|ちゃ} · {紅茶|こうちゃ}'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 4 — Hỏi, nói, gọi món',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['何', 'HÀ', 'か', 'なに・なん', '{何|なん}の · {何階|なんがい}'],
        ['誰', 'THUỲ', '—', 'だれ', '{誰|だれ}の'],
        ['英', 'ANH', 'えい', '—', '{英語|えいご}'],
        ['語', 'NGỮ', 'ご', 'かた(る)', '{英語|えいご} · {日本語|にほんご}'],
        ['注', 'CHÚ', 'ちゅう', 'そそ(ぐ)', '{注文|ちゅうもん}'],
        ['文', 'VĂN', 'ぶん・もん', 'ふみ', '{注文|ちゅうもん} (đọc **もん**)'],
        ['願', 'NGUYỆN', 'がん', 'ねが(う)', 'お{願|ねが}いします'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Chữ Hán Việt giúp đoán nghĩa**: 電話 = ĐIỆN THOẠI, 料理 = LIỆU LÝ (nấu nướng), 注文 = CHÚ VĂN (ghi đơn), 店員 = ĐIẾM VIÊN (nhân viên cửa hàng), 時計 = THỜI KẾ (đo thời gian).',
        '**肉 luôn là にく**: 牛肉 ぎゅう·にく, 鶏肉 とり·にく, 豚肉 ぶた·にく. Chỉ cần nhớ con vật: 牛 ぎゅう (bò), 鶏 とり (gà), 豚 ぶた (lợn).',
        'Sách viết {靴|くつ}, {喫茶店|きっさてん}, {喫煙所|きつえんじょ} bằng chữ Hán nhưng cô cho học bằng kana — gặp trong đề sẽ có furigana.',
      ],
    },
    {
      t: 'mcq',
      id: 'b2-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '店員', options: ['みせいん', 'てんいん', 'てんにん', 'みせにん'], correct: 1, why: '店 てん + 員 いん = **てんいん** (nhân viên bán hàng).' },
        { q: '地下', options: ['じか', 'ちした', 'ちか', 'ちげ'], correct: 2, why: '**ちか** — tầng hầm.' },
        { q: '本屋', options: ['ほんや', 'ほんおく', 'もとや', 'ほにゃ'], correct: 0, why: '屋 làm hậu tố cửa hàng đọc **や**: ほんや.' },
        { q: '時計', options: ['じけい', 'ときけい', 'とけい', 'じかん'], correct: 2, why: 'Đọc đặc biệt: **とけい**.' },
        { q: '財布', options: ['ざいふ', 'さいふ', 'さいぬの', 'ざいぬの'], correct: 1, why: '**さいふ** — ví tiền.' },
        { q: '牛肉', options: ['うしにく', 'ぎゅうにく', 'ぎゅにく', 'ぶたにく'], correct: 1, why: '牛 ぎゅう (trường âm) + 肉 にく.' },
        { q: '鶏肉', options: ['けいにく', 'にわとりにく', 'とりにく', 'ぶたにく'], correct: 2, why: '**とりにく** — thịt gà.' },
        { q: '豚肉', options: ['とんにく', 'ぶたにく', 'ぎゅうにく', 'ぶたにっく'], correct: 1, why: '**ぶたにく** — thịt lợn (とん chỉ dùng trong とんかつ).' },
        { q: '野菜', options: ['のさい', 'やさい', 'やな', 'やさえ'], correct: 1, why: '**やさい** — rau.' },
        { q: '紅茶', options: ['こうちゃ', 'べにちゃ', 'こちゃ', 'こうさ'], correct: 0, why: '**こうちゃ** — trà đen (trường âm こう).' },
        { q: '注文', options: ['ちゅうぶん', 'ちゅうもん', 'ちゅもん', 'しゅうもん'], correct: 1, why: '文 ở đây đọc **もん**: ちゅうもん.' },
        { q: '携帯電話', options: ['けいたいでんわ', 'けいだいでんわ', 'けたいでんわ', 'けいたいでんは'], correct: 0, why: '**けいたいでんわ** — hai trường âm けい.' },
        { q: '三百円', options: ['さんひゃくえん', 'さんびゃくえん', 'さんぴゃくえん', 'みっつひゃくえん'], correct: 1, why: '300 = **さんびゃく** (ひゃく → びゃく).' },
        { q: '六百円', options: ['ろくひゃくえん', 'ろくびゃくえん', 'ろっぴゃくえん', 'むっぴゃくえん'], correct: 2, why: '600 = **ろっぴゃく**.' },
        { q: '三千円', options: ['さんせんえん', 'さんぜんえん', 'みっせんえん', 'さんまんえん'], correct: 1, why: '3000 = **さんぜん** (せん → ぜん).' },
        { q: '八千円', options: ['はちせんえん', 'はっせんえん', 'はっぴゃくえん', 'はちまんえん'], correct: 1, why: '8000 = **はっせん**.' },
        { q: '三万五千六百円', options: ['さんまんごせんろっぴゃくえん', 'さんぜんごひゃくろくじゅうえん', 'さんまんごせんろくひゃくえん', 'さんびゃくごまんろくせんえん'], correct: 0, why: '3万 + 5千 + 6百 → さんまん ごせん **ろっぴゃく** えん = 35.600 yên.' },
        { q: '一万二千円', options: ['まんにせんえん', 'いちまんにせんえん', 'いちまんふたせんえん', 'じゅうにせんえん'], correct: 1, why: '12.000 = 1万 + 2千: **いちまん にせん**. Không nói じゅうにせん.' },
      ],
    },
    {
      t: 'write',
      id: 'b2-viet-kanji',
      title: 'Tập viết tay 56 chữ Hán của Bài 2',
      note: 'Mỗi nhóm 10 chữ (bấm dải chữ để chuyển nhóm). Bấm ▶ Thứ tự nét trước khi viết — chữ Hán viết đúng thứ tự (trên → dưới, trái → phải, ngang trước sổ sau) thì cân và đẹp. Viết xong nhờ ✨ AI xem chữ.',
      chars: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '円', '階', '屋', '地', '下', '店', '員', '本', '携', '帯', '電', '話', '子', '辞', '書', '消', '時', '計', '財', '布', '油', '米', '卵', '水', '魚', '肉', '牛', '鶏', '豚', '野', '菜', '料', '理', '飯', '紅', '茶', '何', '誰', '英', '語', '注', '文', '願'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b2-nghe',
  kind: 'listening',
  title: 'Luyện nghe — tầng, giá tiền, gọi món, đồ của ai',
  goal: 'Nghe và bắt đúng con số tầng, giá tiền, số lượng món, và người sở hữu trong các hội thoại cửa hàng – nhà hàng.',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        'Đọc **câu hỏi trước**, biết mình cần bắt con số hay tên gì, rồi mới bấm nghe.',
        'Nghe 1–2 lần, trả lời, **rồi mới** mở lời thoại để kiểm tra. Lần sau tắt romaji, nghe lại.',
        'Bẫy hay gặp: người nói **hỏi hai món rồi mới chọn một**, hoặc nói "～も～ですか" rồi bị đáp いいえ.',
      ],
    },

    { t: 'h', text: 'Bài 1 — Ở quầy thông tin' },
    {
      t: 'listen',
      id: 'b2-ng-1',
      title: 'Nataphon hỏi tầng',
      note: 'Nghe và cho biết mỗi cửa hàng ở tầng mấy.',
      lines: [
        { who: 'ナタポン', voice: 'ja-nu', text: 'あのう、すみません。くつ{屋|や}は{何階|なんがい}ですか。', ro: 'Anoo, sumimasen. Kutsu-ya wa nan-gai desu ka.', vi: 'Xin lỗi, cửa hàng giày ở tầng mấy ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: 'くつ{屋|や}ですか。{2階|にかい}です。', ro: 'Kutsu-ya desu ka. Ni-kai desu.', vi: 'Cửa hàng giày ạ? Tầng 2.' },
        { who: 'ナタポン', voice: 'ja-nu', text: '{2階|にかい}ですね。じゃ、{100円|ひゃくえん}ショップは{何階|なんがい}ですか。', ro: 'Ni-kai desu ne. Ja, hyaku-en shoppu wa nan-gai desu ka.', vi: 'Tầng 2 ạ. Vậy cửa hàng 100 yên ở tầng mấy ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: '{100円|ひゃくえん}ショップは{3階|さんがい}です。', ro: 'Hyaku-en shoppu wa san-gai desu.', vi: 'Cửa hàng 100 yên ở tầng 3.' },
        { who: 'ナタポン', voice: 'ja-nu', text: 'そうですか。ケーキ{屋|や}も{3階|さんがい}ですか。', ro: 'Sou desu ka. Keeki-ya mo san-gai desu ka.', vi: 'Thế à. Tiệm bánh cũng ở tầng 3 ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: 'いいえ、ケーキ{屋|や}は{1階|いっかい}です。あちらです。', ro: 'Iie, keeki-ya wa ikkai desu. Achira desu.', vi: 'Không, tiệm bánh ở tầng 1. Ở phía kia ạ.' },
        { who: 'ナタポン', voice: 'ja-nu', text: 'あ、ここですか。どうもありがとうございます。', ro: 'A, koko desu ka. Doumo arigatou gozaimasu.', vi: 'A, ở tầng này ạ. Cảm ơn anh nhiều.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: 'くつ{屋|や}は{何階|なんがい}ですか。', options: ['{1階|いっかい}', '{2階|にかい}', '{3階|さんがい}', '{地下|ちか}{1階|いっかい}'], correct: 1, why: '{店員|てんいん}：くつ屋ですか。**{2階|にかい}**です。' },
        { q: '{100円|ひゃくえん}ショップは{何階|なんがい}ですか。', options: ['{2階|にかい}', '{3階|さんがい}', '{4階|よんかい}', '{5階|ごかい}'], correct: 1, why: '**さんがい** — nghe được biến âm が.' },
        { q: 'ケーキ{屋|や}は{何階|なんがい}ですか。', options: ['{3階|さんがい}', '{1階|いっかい}', '{2階|にかい}', 'Không nói'], correct: 1, why: 'Bẫy: ナタポン hỏi "cũng tầng 3 à?" → いいえ、**{1階|いっかい}**です.' },
      ],
    },

    { t: 'h', text: 'Bài 2 — Ở cửa hàng điện máy' },
    {
      t: 'listen',
      id: 'b2-ng-2',
      title: 'Park mua kim từ điển',
      note: 'Nghe: kim từ điển ở đâu, hai cái giá bao nhiêu, Park mua cái nào?',
      lines: [
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { who: 'パク', voice: 'ja-nam', text: 'すみません、{電子辞書|でんしじしょ}はどこですか。', ro: 'Sumimasen, denshi jisho wa doko desu ka.', vi: 'Xin lỗi, kim từ điển ở đâu ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nu', text: '{電子辞書|でんしじしょ}ですか。あちらです。', ro: 'Denshi jisho desu ka. Achira desu.', vi: 'Kim từ điển ạ? Ở phía kia.' },
        { who: 'パク', voice: 'ja-nam', text: 'すみません、これはいくらですか。', ro: 'Sumimasen, kore wa ikura desu ka.', vi: 'Xin lỗi, cái này bao nhiêu ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'それは{18,000円|いちまんはっせんえん}です。', ro: 'Sore wa ichiman hassen en desu.', vi: 'Cái đó 18.000 yên ạ.' },
        { who: 'パク', voice: 'ja-nam', text: 'そうですか。その{電子辞書|でんしじしょ}はいくらですか。', ro: 'Sou desu ka. Sono denshi jisho wa ikura desu ka.', vi: 'Thế à. Còn cái chị đang cầm bao nhiêu?' },
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'これは{23,500円|にまんさんぜんごひゃくえん}です。', ro: 'Kore wa niman sanzen gohyaku en desu.', vi: 'Cái này 23.500 yên ạ.' },
        { who: 'パク', voice: 'ja-nam', text: 'うーん…。じゃ、これをください。', ro: 'Uun… Ja, kore o kudasai.', vi: 'Ừm… Vậy cho tôi cái này.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-ng-2-q',
      title: 'Câu hỏi bài 2',
      items: [
        { q: '{電子辞書|でんしじしょ}はどこですか。', options: ['こちら', 'そちら', 'あちら', '{5階|ごかい}'], correct: 2, why: '{店員|てんいん}：**あちら**です。' },
        { q: 'パクさんの「これ」はいくらですか。', options: ['{8,000円|はっせんえん}', '{18,000円|いちまんはっせんえん}', '{23,500円|にまんさんぜんごひゃくえん}', '{13,500円|いちまんさんぜんごひゃくえん}'], correct: 1, why: 'いちまん はっせん = 18.000.' },
        { q: '{店員|てんいん}さんの{電子辞書|でんしじしょ}はいくらですか。', options: ['{23,500円|にまんさんぜんごひゃくえん}', '{32,500円|さんまんにせんごひゃくえん}', '{25,300円|にまんごせんさんびゃくえん}', '{18,000円|いちまんはっせんえん}'], correct: 0, why: 'にまん さんぜん ごひゃく = 23.500.' },
        { q: 'パクさんはどれを{買|か}いますか。(Park mua cái nào?)', options: ['Cái 18.000 yên (cái Park đang cầm)', 'Cái 23.500 yên (cái nhân viên cầm)', 'Cả hai', 'Không mua'], correct: 0, why: 'Park nói **これ**をください → cái trong tay Park = 18.000 yên. Nếu mua cái của nhân viên thì phải nói それを.' },
      ],
    },

    { t: 'h', text: 'Bài 3 — Nghe giá ở siêu thị' },
    {
      t: 'listen',
      id: 'b2-ng-3',
      title: 'Wang hỏi giá ở siêu thị',
      note: 'Chỉ bắt con số: mỗi món giá bao nhiêu?',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'すみません、このリンゴは{1|ひと}ついくらですか。', ro: 'Sumimasen, kono ringo wa hitotsu ikura desu ka.', vi: 'Xin lỗi, táo này bao nhiêu một quả?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: '{1|ひと}つ{150円|ひゃくごじゅうえん}です。', ro: 'Hitotsu hyaku gojuu en desu.', vi: '150 yên một quả.' },
        { who: 'ワン', voice: 'ja-nu', text: 'この{卵|たまご}はいくらですか。', ro: 'Kono tamago wa ikura desu ka.', vi: 'Trứng này bao nhiêu?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: '{卵|たまご}は{260円|にひゃくろくじゅうえん}です。', ro: 'Tamago wa nihyaku rokujuu en desu.', vi: 'Trứng 260 yên.' },
        { who: 'ワン', voice: 'ja-nu', text: 'あの{米|こめ}はいくらですか。', ro: 'Ano kome wa ikura desu ka.', vi: 'Gạo đằng kia bao nhiêu?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: 'あれは{2,980円|にせんきゅうひゃくはちじゅうえん}です。', ro: 'Are wa nisen kyuuhyaku hachijuu en desu.', vi: 'Cái kia 2.980 yên.' },
        { who: 'ワン', voice: 'ja-nu', text: 'そうですか。じゃ、この{油|あぶら}は？', ro: 'Sou desu ka. Ja, kono abura wa?', vi: 'Thế à. Còn dầu ăn này?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: 'それは{430円|よんひゃくさんじゅうえん}です。', ro: 'Sore wa yonhyaku sanjuu en desu.', vi: 'Cái đó 430 yên.' },
        { who: 'ワン', voice: 'ja-nu', text: 'じゃ、リンゴを{3|みっ}つと{卵|たまご}をください。', ro: 'Ja, ringo o mittsu to tamago o kudasai.', vi: 'Vậy cho tôi ba quả táo và trứng.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b2-ng-3-q',
      title: 'Viết giá bằng chữ số (chỉ số, không cần 円)',
      kind: 'fill',
      items: [
        { q: 'リンゴ ({1|ひと}つ)', answers: ['150', '150円', '１５０', '１５０円'] },
        { q: '{卵|たまご}', answers: ['260', '260円', '２６０', '２６０円'] },
        { q: '{米|こめ}', answers: ['2980', '2,980', '2980円', '2,980円', '２９８０', '２，９８０'] },
        { q: '{油|あぶら}', answers: ['430', '430円', '４３０', '４３０円'] },
        { q: 'ワンさんはリンゴをいくつ{買|か}いますか。(mấy quả?)', answers: ['3', '3つ', 'みっつ', '３', '３つ', 'mittsu'], hint: 'Nghe câu cuối: リンゴを～つ' },
      ],
    },

    { t: 'h', text: 'Bài 4 — Gọi món ở nhà hàng' },
    {
      t: 'listen',
      id: 'b2-ng-4',
      title: 'Marco và Nataphon gọi món',
      note: 'Ghi lại mỗi món gọi mấy phần.',
      lines: [
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'いらっしゃいませ。こちらへどうぞ。', ro: 'Irasshaimase. Kochira e douzo.', vi: 'Kính chào quý khách. Mời đi lối này.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'すみません、{注文|ちゅうもん}をお{願|ねが}いします。', ro: 'Sumimasen, chuumon o onegai shimasu.', vi: 'Xin lỗi, cho chúng tôi gọi món.' },
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'はい、どうぞ。', ro: 'Hai, douzo.', vi: 'Vâng, xin mời.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'とんかつを{2|ふた}つとカレーを{1|ひと}つください。', ro: 'Tonkatsu o futatsu to karee o hitotsu kudasai.', vi: 'Cho hai thịt lợn chiên xù và một cà ri.' },
        { who: 'ナタポン', voice: 'ja-nu', text: 'それから、ライスを{2|ふた}つお{願|ねが}いします。', ro: 'Sorekara, raisu o futatsu onegai shimasu.', vi: 'Thêm hai suất cơm nữa ạ.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'ビールを{2|ふた}つとジュースを{1|ひと}つください。', ro: 'Biiru o futatsu to juusu o hitotsu kudasai.', vi: 'Cho hai bia và một nước ép.' },
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'はい。とんかつを{2|ふた}つ、カレーを{1|ひと}つ、ライスを{2|ふた}つ、ビールを{2|ふた}つ、ジュースを{1|ひと}つですね。', ro: 'Hai. Tonkatsu o futatsu, karee o hitotsu, raisu o futatsu, biiru o futatsu, juusu o hitotsu desu ne.', vi: 'Vâng. Hai thịt lợn chiên xù, một cà ri, hai cơm, hai bia, một nước ép phải không ạ.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'あ、ジュースじゃありません。コーヒーです。', ro: 'A, juusu ja arimasen. Koohii desu.', vi: 'À, không phải nước ép. Là cà phê.' },
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'コーヒーを{1|ひと}つですね。{少々|しょうしょう}お{待|ま}ちください。', ro: 'Koohii o hitotsu desu ne. Shoushou omachi kudasai.', vi: 'Một cà phê ạ. Xin chờ một chút.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b2-ng-4-q',
      title: 'Mỗi món mấy phần? (viết số; không gọi thì viết 0)',
      kind: 'fill',
      items: [
        { q: 'とんかつ', answers: ['2', '２', 'ふたつ', '2つ'] },
        { q: 'カレー', answers: ['1', '１', 'ひとつ', '1つ'] },
        { q: 'ライス', answers: ['2', '２', 'ふたつ', '2つ'] },
        { q: 'ビール', answers: ['2', '２', 'ふたつ', '2つ'] },
        { q: 'ジュース', answers: ['0', '０'], hint: 'Nghe câu sửa lại của Marco ở cuối.' },
        { q: 'コーヒー', answers: ['1', '１', 'ひとつ', '1つ'] },
      ],
    },

    { t: 'h', text: 'Bài 5 — Hỏi món trong thực đơn' },
    {
      t: 'listen',
      id: 'b2-ng-5',
      title: 'Wang hỏi về thực đơn',
      note: 'Nghe: súp làm từ gì, nước ép gì, vang nước nào, "ichigo" tiếng Anh là gì.',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'すみません、これは{何|なん}のスープですか。', ro: 'Sumimasen, kore wa nan no suupu desu ka.', vi: 'Xin lỗi, đây là súp gì ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: '{野菜|やさい}のスープです。', ro: 'Yasai no suupu desu.', vi: 'Súp rau ạ.' },
        { who: 'ワン', voice: 'ja-nu', text: 'じゃ、このジュースは{何|なん}のジュースですか。', ro: 'Ja, kono juusu wa nan no juusu desu ka.', vi: 'Vậy nước ép này là nước ép gì ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: 'イチゴのジュースです。', ro: 'Ichigo no juusu desu.', vi: 'Nước ép dâu tây ạ.' },
        { who: 'ワン', voice: 'ja-nu', text: 'イチゴ？「イチゴ」は{英語|えいご}で{何|なん}ですか。', ro: 'Ichigo? "Ichigo" wa eigo de nan desu ka.', vi: 'Ichigo? "Ichigo" tiếng Anh là gì ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: '「strawberry」です。', ro: '"Strawberry" desu.', vi: 'Là "strawberry".' },
        { who: 'ワン', voice: 'ja-nu', text: 'そうですか。このワインはどこのワインですか。フランスのワインですか。', ro: 'Sou desu ka. Kono wain wa doko no wain desu ka. Furansu no wain desu ka.', vi: 'Thế à. Rượu vang này là vang nước nào? Vang Pháp ạ?' },
        { who: '{店員|てんいん}', voice: 'ja-nam', text: 'いいえ、イタリアのワインです。', ro: 'Iie, Itaria no wain desu.', vi: 'Không, là vang Ý ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-ng-5-q',
      title: 'Câu hỏi bài 5',
      items: [
        { q: 'スープは{何|なん}のスープですか。', options: ['{魚|さかな}のスープ', '{野菜|やさい}のスープ', '{肉|にく}のスープ', '{鶏肉|とりにく}のスープ'], correct: 1, why: '**{野菜|やさい}**のスープです。' },
        { q: 'ジュースは{何|なん}のジュースですか。', options: ['リンゴ', 'イチゴ', 'Không nói', 'コーヒー'], correct: 1, why: '**イチゴ**のジュースです。' },
        { q: 'ワインはどこのワインですか。', options: ['フランス', 'ドイツ', 'イタリア', 'アメリカ'], correct: 2, why: 'Bẫy: Wang đoán フランス → いいえ、**イタリア**のワインです。' },
        { q: '「イチゴ」は{英語|えいご}で{何|なん}ですか。', options: ['apple', 'strawberry', 'orange', 'grape'], correct: 1, why: '「strawberry」です。' },
      ],
    },

    { t: 'h', text: 'Bài 6 — Đồ bỏ quên' },
    {
      t: 'listen',
      id: 'b2-ng-6',
      title: 'Cái túi và cái đồng hồ của ai?',
      lines: [
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'あのう、すみません。これは{誰|だれ}のかばんですか。', ro: 'Anoo, sumimasen. Kore wa dare no kaban desu ka.', vi: 'Xin lỗi quý khách. Đây là túi của ai ạ?' },
        { who: 'パク', voice: 'ja-nam', text: 'あ、それはワンさんのかばんです。ワンさん、かばん！', ro: 'A, sore wa Wan-san no kaban desu. Wan-san, kaban!', vi: 'A, đó là túi của Wang. Wang ơi, túi!' },
        { who: 'ワン', voice: 'ja-nu', text: 'あ、すみません。ありがとうございます。', ro: 'A, sumimasen. Arigatou gozaimasu.', vi: 'A, xin lỗi. Cảm ơn chị.' },
        { who: '{店員|てんいん}', voice: 'ja-nu', text: 'この{時計|とけい}もワンさんのですか。', ro: 'Kono tokei mo Wan-san no desu ka.', vi: 'Đồng hồ này cũng của chị ạ?' },
        { who: 'ワン', voice: 'ja-nu', text: 'いいえ、{私|わたし}のじゃありません。', ro: 'Iie, watashi no ja arimasen.', vi: 'Không, không phải của tôi.' },
        { who: 'パク', voice: 'ja-nam', text: 'あ、それは{私|わたし}の{時計|とけい}です！どうもすみません。', ro: 'A, sore wa watashi no tokei desu! Doumo sumimasen.', vi: 'A, đó là đồng hồ của tôi! Xin lỗi nhé.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-ng-6-q',
      title: 'Câu hỏi bài 6',
      items: [
        { q: 'かばんは{誰|だれ}のですか。', options: ['パクさんの', 'ワンさんの', '{店員|てんいん}さんの', 'マルコさんの'], correct: 1, why: 'それは**ワンさん**のかばんです。' },
        { q: '{時計|とけい}は{誰|だれ}のですか。', options: ['ワンさんの', 'パクさんの', '{店員|てんいん}さんの', 'Không rõ'], correct: 1, why: 'ワン nói không phải của mình; **パク**: それは{私|わたし}の{時計|とけい}です。' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b2-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi JPD113 của Bài 2',
  goal: 'Trả lời trọn câu, đúng trợ từ mọi câu hỏi Bài 2 trong đề thi nói (hỏi chỗ, hỏi giá, gọi món, của ai, xuất xứ, ～語で), và đọc to trôi chảy đoạn văn có giá tiền.',
  minutes: 40,
  blocks: [
    {
      t: 'table',
      caption: 'Nhắc lại cách chấm phần Talking (hướng dẫn ôn thi JPD113)',
      head: ['Lỗi', 'Bị trừ'],
      rows: [
        ['Sai làm đổi nghĩa cả câu (vd. hỏi どこ mà đáp giá tiền)', '**mất hết** điểm câu đó'],
        ['Sai không đổi nghĩa (vd. quên はい／いいえ)', 'tối đa 5 điểm'],
        ['Đúng ngữ pháp nhưng dùng sai từ vựng', 'chỉ được tối đa 3 điểm'],
        ['Sai **trợ từ** (quên を, の, で…)', '2 điểm'],
        ['Lưu loát, phát âm', '2 điểm mỗi câu'],
      ],
    },
    {
      t: 'note',
      title: 'Ba quy tắc vàng',
      items: [
        '**Trả lời bằng câu đầy đủ**, nhắc lại danh từ của câu hỏi: スーパーは{地下|ちか}{1階|いっかい}です hơn hẳn ~~{地下|ちか}{1階|いっかい}~~.',
        'Câu hỏi có/không (～ですか) → **はい／いいえ trước**, rồi nói cả câu: いいえ、{3階|さんがい}じゃありません。{2階|にかい}です。',
        'Giám thị cầm tranh nói **これ／この** → bạn đáp **それ／その**. Được xin nhắc lại câu hỏi tối đa 2 lần không bị trừ: もう{一度|いちど}お{願|ねが}いします。',
      ],
    },

    { t: 'h', text: 'Câu hỏi KHÔNG có tranh (10 điểm) — đề mẫu Bài 2' },
    {
      t: 'dialogue',
      title: 'Hỏi vị trí, tầng',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'FPT{大学|だいがく}のとしょかんは{3階|さんがい}ですか。', ro: 'FPT daigaku no toshokan wa san-gai desu ka.', vi: 'Thư viện Đại học FPT ở tầng 3 phải không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{3階|さんがい}じゃありません。{2階|にかい}です。', ro: 'Iie, san-gai ja arimasen. Ni-kai desu.', vi: 'Không, không phải tầng 3. Tầng 2. (thay bằng tầng thật ở cơ sở của bạn)' },
        { who: 'Giám thị', role: 'examiner', text: 'FPT{大学|だいがく}のとしょかんは{何階|なんがい}ですか。', ro: 'FPT daigaku no toshokan wa nan-gai desu ka.', vi: 'Thư viện Đại học FPT ở tầng mấy?' },
        { who: 'Bạn', role: 'candidate', text: 'FPT{大学|だいがく}のとしょかんは{2階|にかい}です。', ro: 'FPT daigaku no toshokan wa ni-kai desu.', vi: 'Thư viện Đại học FPT ở tầng 2.' },
        { who: 'Giám thị', role: 'examiner', text: 'トイレはどこですか。', ro: 'Toire wa doko desu ka.', vi: 'Nhà vệ sinh ở đâu? (hỏi ngay trong phòng thi)' },
        { who: 'Bạn', role: 'candidate', text: 'トイレはあそこです。', ro: 'Toire wa asoko desu.', vi: 'Nhà vệ sinh ở đằng kia. (hoặc {1階|いっかい}です)' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi "～語で何ですか"',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '「pen」は{日本語|にほんご}で{何|なん}ですか。', ro: '"Pen" wa Nihongo de nan desu ka.', vi: '"Pen" tiếng Nhật là gì?' },
        { who: 'Bạn', role: 'candidate', text: '「pen」は{日本語|にほんご}で「ペン」です。', ro: '"Pen" wa Nihongo de "pen" desu.', vi: '"Pen" tiếng Nhật là "ペン".' },
        { who: 'Giám thị', role: 'examiner', text: '「ぶたにく」は{英語|えいご}で{何|なん}ですか。', ro: '"Butaniku" wa eigo de nan desu ka.', vi: '"Butaniku" tiếng Anh là gì?' },
        { who: 'Bạn', role: 'candidate', text: '「ぶたにく」は{英語|えいご}で「pork」です。', ro: '"Butaniku" wa eigo de "pork" desu.', vi: '"Butaniku" tiếng Anh là "pork".' },
        { who: 'Giám thị', role: 'examiner', text: '「コンピュータ」はベトナム{語|ご}で{何|なん}ですか。', ro: '"Konpyuuta" wa Betonamu-go de nan desu ka.', vi: '"Konpyuuta" tiếng Việt là gì?' },
        { who: 'Bạn', role: 'candidate', text: '「コンピュータ」はベトナム{語|ご}で「máy tính」です。', ro: '"Konpyuuta" wa Betonamu-go de "máy tính" desu.', vi: '"Konpyuuta" tiếng Việt là "máy tính".' },
        { who: 'Giám thị', role: 'examiner', text: 'これはベトナム{語|ご}で{何|なん}ですか。', ro: 'Kore wa Betonamu-go de nan desu ka.', vi: '(giơ một vật, vd. cái đồng hồ) Cái này tiếng Việt là gì?' },
        { who: 'Bạn', role: 'candidate', text: 'それはベトナム{語|ご}で「đồng hồ」です。', ro: 'Sore wa Betonamu-go de "đồng hồ" desu.', vi: 'Cái đó tiếng Việt là "đồng hồ".' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi về đồ của bạn',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'それは{誰|だれ}のペンですか。', ro: 'Sore wa dare no pen desu ka.', vi: 'Cái bút đó là của ai?' },
        { who: 'Bạn', role: 'candidate', text: 'これは{私|わたし}のペンです。', ro: 'Kore wa watashi no pen desu.', vi: 'Cái này là bút của tôi.' },
        { who: 'Giám thị', role: 'examiner', text: 'そのかばんはどこのかばんですか。', ro: 'Sono kaban wa doko no kaban desu ka.', vi: 'Cái túi đó là túi nước nào?' },
        { who: 'Bạn', role: 'candidate', text: 'このかばんはベトナムのかばんです。', ro: 'Kono kaban wa Betonamu no kaban desu.', vi: 'Cái túi này là túi Việt Nam.' },
        { who: 'Giám thị', role: 'examiner', text: 'そのかばんはいくらですか。', ro: 'Sono kaban wa ikura desu ka.', vi: 'Cái túi đó bao nhiêu tiền?' },
        { who: 'Bạn', role: 'candidate', text: 'このかばんは{30万|さんじゅうまん}ドンです。', ro: 'Kono kaban wa sanjuuman don desu.', vi: 'Cái túi này 300.000 đồng.' },
      ],
    },

    { t: 'h', text: 'Câu hỏi CÓ tranh (15 điểm/câu)' },
    {
      t: 'p',
      text: 'Đề thật cho một tranh; giám thị hỏi một câu về tranh đó. Dưới đây là 4 kiểu tranh hay gặp của Bài 2 (dữ liệu tranh viết thành bảng) và mọi câu giám thị có thể hỏi.',
    },
    {
      t: 'table',
      caption: 'Tranh A — Sơ đồ tầng toà nhà',
      head: ['Tầng', 'Có gì'],
      rows: [
        ['5{階|かい}', 'レストラン · トイレ'],
        ['4{階|かい}', 'カメラ · パソコン ({電器|でんき}の{店|みせ})'],
        ['3{階|かい}', '{100円|ひゃくえん}ショップ · きつえんじょ · トイレ'],
        ['2{階|かい}', 'くつ{屋|や} · {本屋|ほんや}'],
        ['1{階|かい}', 'ケーキ{屋|や} · きっさてん · ATM · トイレ'],
        ['{地下|ちか}1{階|かい}', 'スーパー'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh A — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'スーパーはどこですか。', ro: 'Suupaa wa doko desu ka.', vi: 'Siêu thị ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'スーパーは{地下|ちか}{1階|いっかい}です。', ro: 'Suupaa wa chika ikkai desu.', vi: 'Siêu thị ở tầng hầm 1.' },
        { who: 'Giám thị', role: 'examiner', text: '{百円|ひゃくえん}ショップは{三階|さんがい}ですか。', ro: 'Hyaku-en shoppu wa san-gai desu ka.', vi: 'Cửa hàng 100 yên ở tầng 3 phải không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{百円|ひゃくえん}ショップは{三階|さんがい}です。', ro: 'Hai, hyaku-en shoppu wa san-gai desu.', vi: 'Vâng, cửa hàng 100 yên ở tầng 3.' },
        { who: 'Giám thị', role: 'examiner', text: 'くつやは{何階|なんがい}ですか。', ro: 'Kutsu-ya wa nan-gai desu ka.', vi: 'Cửa hàng giày ở tầng mấy?' },
        { who: 'Bạn', role: 'candidate', text: 'くつやは{二階|にかい}です。', ro: 'Kutsu-ya wa ni-kai desu.', vi: 'Cửa hàng giày ở tầng 2.' },
        { who: 'Giám thị', role: 'examiner', text: 'トイレはどこですか。', ro: 'Toire wa doko desu ka.', vi: 'Nhà vệ sinh ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'トイレは{1階|いっかい}と{3階|さんがい}と{5階|ごかい}です。', ro: 'Toire wa ikkai to san-gai to go-kai desu.', vi: 'Nhà vệ sinh ở tầng 1, tầng 3 và tầng 5. (と — Bài 1)' },
        { who: 'Giám thị', role: 'examiner', text: 'レストランは{何階|なんがい}ですか。', ro: 'Resutoran wa nan-gai desu ka.', vi: 'Nhà hàng ở tầng mấy?' },
        { who: 'Bạn', role: 'candidate', text: 'レストランは{5階|ごかい}です。', ro: 'Resutoran wa go-kai desu.', vi: 'Nhà hàng ở tầng 5.' },
        { who: 'Giám thị', role: 'examiner', text: 'きつえんじょは{2階|にかい}ですか。', ro: 'Kitsuenjo wa ni-kai desu ka.', vi: 'Chỗ hút thuốc ở tầng 2 à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{2階|にかい}じゃありません。{3階|さんがい}です。', ro: 'Iie, ni-kai ja arimasen. San-gai desu.', vi: 'Không, không phải tầng 2. Tầng 3.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh B — Người, đồ vật, xuất xứ, giá (kiểu đề của cô: きみえさん／ナタポンさん)',
      head: ['Người', 'Đồ', 'Của nước', 'Giá'],
      rows: [
        ['きみえさん', 'かばん', '{韓国|かんこく}', '{30,000円|さんまんえん}'],
        ['ナタポンさん', 'ワイン', 'フランス', '{2,800円|にせんはっぴゃくえん}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh B — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'これは{誰|だれ}のかばんですか。', ro: 'Kore wa dare no kaban desu ka.', vi: 'Đây là túi của ai?' },
        { who: 'Bạn', role: 'candidate', text: 'それはきみえさんのかばんです。', ro: 'Sore wa Kimie-san no kaban desu.', vi: 'Đó là túi của chị Kimie.' },
        { who: 'Giám thị', role: 'examiner', text: 'このかばんはどこのかばんですか。', ro: 'Kono kaban wa doko no kaban desu ka.', vi: 'Cái túi này là túi nước nào?' },
        { who: 'Bạn', role: 'candidate', text: 'そのかばんは{韓国|かんこく}のかばんです。', ro: 'Sono kaban wa Kankoku no kaban desu.', vi: 'Cái túi đó là túi Hàn Quốc.' },
        { who: 'Giám thị', role: 'examiner', text: 'このかばんはいくらですか。', ro: 'Kono kaban wa ikura desu ka.', vi: 'Cái túi này bao nhiêu tiền?' },
        { who: 'Bạn', role: 'candidate', text: 'そのかばんは{30,000円|さんまんえん}です。', ro: 'Sono kaban wa sanman en desu.', vi: 'Cái túi đó 30.000 yên.' },
        { who: 'Giám thị', role: 'examiner', text: 'このワインは{誰|だれ}のですか。', ro: 'Kono wain wa dare no desu ka.', vi: 'Chai vang này là của ai?' },
        { who: 'Bạn', role: 'candidate', text: 'そのワインはナタポンさんのです。', ro: 'Sono wain wa Natapon-san no desu.', vi: 'Chai vang đó là của Nataphon.' },
        { who: 'Giám thị', role: 'examiner', text: 'このワインはフランスのワインですか。', ro: 'Kono wain wa Furansu no wain desu ka.', vi: 'Chai vang này là vang Pháp à?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、そのワインはフランスのワインです。', ro: 'Hai, sono wain wa Furansu no wain desu.', vi: 'Vâng, chai vang đó là vang Pháp.' },
        { who: 'Giám thị', role: 'examiner', text: 'このワインはいくらですか。', ro: 'Kono wain wa ikura desu ka.', vi: 'Chai vang này bao nhiêu?' },
        { who: 'Bạn', role: 'candidate', text: 'そのワインは{2,800円|にせんはっぴゃくえん}です。', ro: 'Sono wain wa nisen happyaku en desu.', vi: 'Chai vang đó 2.800 yên.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh C — Điện thoại (kiểu đề: hãng, chủ, giá bằng tiền Việt)',
      head: ['Đồ vật', 'Hãng / nước', 'Chủ', 'Giá'],
      rows: [['{携帯電話|けいたいでんわ}', 'ノキア (Nokia)', 'カルロスさん', '550.000 VND = {55万|ごじゅうごまん}ドン']],
    },
    {
      t: 'dialogue',
      title: 'Tranh C — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: 'Đây là cái gì?' },
        { who: 'Bạn', role: 'candidate', text: 'それはノキアの{携帯電話|けいたいでんわ}です。', ro: 'Sore wa Nokia no keitai denwa desu.', vi: 'Đó là điện thoại Nokia.' },
        { who: 'Giám thị', role: 'examiner', text: 'その{携帯電話|けいたいでんわ}は{誰|だれ}のですか。', ro: 'Sono keitai denwa wa dare no desu ka.', vi: 'Cái điện thoại đó là của ai?' },
        { who: 'Bạn', role: 'candidate', text: 'この{携帯電話|けいたいでんわ}はカルロスさんのです。', ro: 'Kono keitai denwa wa Karurosu-san no desu.', vi: 'Cái điện thoại này là của Carlos. (Bạn đang cầm tranh → この)' },
        { who: 'Giám thị', role: 'examiner', text: 'この{携帯電話|けいたいでんわ}はいくらですか。', ro: 'Kono keitai denwa wa ikura desu ka.', vi: 'Cái điện thoại này bao nhiêu tiền?' },
        { who: 'Bạn', role: 'candidate', text: 'その{携帯電話|けいたいでんわ}は{55万|ごじゅうごまん}ドンです。', ro: 'Sono keitai denwa wa gojuugoman don desu.', vi: 'Cái điện thoại đó 550.000 đồng.' },
      ],
    },
    {
      t: 'note',
      title: 'これ hay それ khi trả lời tranh?',
      items: [
        'Nghe giám thị: nói **これ/この** (tranh ở phía họ) → bạn đáp **それ/その**. Nói **その/それ** (tranh đưa cho bạn cầm) → bạn đáp **この/これ**.',
        'Không chắc thì bỏ luôn chủ ngữ: 「カルロスさんのです。」「{55万|ごじゅうごまん}ドンです。」 vẫn đúng hoàn toàn.',
      ],
    },
    {
      t: 'table',
      caption: 'Tranh D — Thực đơn nhà hàng (レストランで)',
      head: ['Món', 'Làm từ / của nước', 'Giá'],
      rows: [
        ['カレー', '{牛肉|ぎゅうにく} · インド', '{900円|きゅうひゃくえん}'],
        ['とんかつ', '{豚肉|ぶたにく}', '{1,200円|せんにひゃくえん}'],
        ['ビール', 'ドイツ', '{600円|ろっぴゃくえん}'],
        ['コーヒー', '—', '{350円|さんびゃくごじゅうえん}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh D — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ここはレストランです。ご{注文|ちゅうもん}、どうぞ。', ro: 'Koko wa resutoran desu. Gochuumon, douzo.', vi: 'Đây là nhà hàng. Mời quý khách gọi món.' },
        { who: 'Bạn', role: 'candidate', text: 'カレーを{1|ひと}つとコーヒーを{2|ふた}つください。', ro: 'Karee o hitotsu to koohii o futatsu kudasai.', vi: 'Cho tôi một cà ri và hai cà phê.' },
        { who: 'Giám thị', role: 'examiner', text: 'これは{何|なん}のカレーですか。', ro: 'Kore wa nan no karee desu ka.', vi: 'Đây là cà ri gì?' },
        { who: 'Bạn', role: 'candidate', text: 'それは{牛肉|ぎゅうにく}のカレーです。', ro: 'Sore wa gyuuniku no karee desu.', vi: 'Đó là cà ri bò.' },
        { who: 'Giám thị', role: 'examiner', text: 'これはどこのビールですか。', ro: 'Kore wa doko no biiru desu ka.', vi: 'Đây là bia nước nào?' },
        { who: 'Bạn', role: 'candidate', text: 'それはドイツのビールです。', ro: 'Sore wa Doitsu no biiru desu.', vi: 'Đó là bia Đức.' },
        { who: 'Giám thị', role: 'examiner', text: 'とんかつはいくらですか。', ro: 'Tonkatsu wa ikura desu ka.', vi: 'Thịt lợn chiên xù bao nhiêu tiền?' },
        { who: 'Bạn', role: 'candidate', text: 'とんかつは{1,200円|せんにひゃくえん}です。', ro: 'Tonkatsu wa sen nihyaku en desu.', vi: 'Thịt lợn chiên xù 1.200 yên.' },
        { who: 'Giám thị', role: 'examiner', text: 'レストランはどこですか。', ro: 'Resutoran wa doko desu ka.', vi: 'Nhà hàng ở đâu? (nếu tranh có sơ đồ tầng)' },
        { who: 'Bạn', role: 'candidate', text: 'レストランは{5階|ごかい}です。', ro: 'Resutoran wa go-kai desu.', vi: 'Nhà hàng ở tầng 5.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy "ご注文、どうぞ"',
      items: [
        'Câu này **không có từ để hỏi** nên nhiều bạn đứng im. Đây là lời mời gọi món → trả lời bằng **N を～つください**. Gọi hai món nối bằng と để ghi điểm ngữ pháp.',
        'Nghe **どこの** (của nước nào) ≠ **どこ** (ở đâu) ≠ **{何|なん}の** (làm từ gì). Ba câu này đi liền nhau trong đề — nghe kỹ từ để hỏi trước khi mở miệng.',
      ],
    },

    { t: 'h', text: 'Đóng vai — mua sắm rồi đi ăn (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Ở cửa hàng',
      lines: [
        { who: '{店員|てんいん}', role: 'b', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { who: 'Khách', role: 'a', text: 'すみません、かばんはどこですか。', ro: 'Sumimasen, kaban wa doko desu ka.', vi: 'Xin lỗi, túi xách ở đâu ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'かばんはこちらです。どうぞ。', ro: 'Kaban wa kochira desu. Douzo.', vi: 'Túi xách ở phía này ạ. Mời quý khách.' },
        { who: 'Khách', role: 'a', text: 'このかばんはいくらですか。', ro: 'Kono kaban wa ikura desu ka.', vi: 'Cái túi này bao nhiêu ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'そのかばんは{9,800円|きゅうせんはっぴゃくえん}です。', ro: 'Sono kaban wa kyuusen happyaku en desu.', vi: 'Cái túi đó 9.800 yên ạ.' },
        { who: 'Khách', role: 'a', text: 'どこのかばんですか。', ro: 'Doko no kaban desu ka.', vi: 'Túi của nước nào ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'イタリアのかばんです。', ro: 'Itaria no kaban desu.', vi: 'Túi Ý ạ.' },
        { who: 'Khách', role: 'a', text: 'そうですか。あのかばんはいくらですか。', ro: 'Sou desu ka. Ano kaban wa ikura desu ka.', vi: 'Thế à. Cái túi đằng kia bao nhiêu ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: 'あれは{4,300円|よんせんさんびゃくえん}です。', ro: 'Are wa yonsen sanbyaku en desu.', vi: 'Cái kia 4.300 yên ạ.' },
        { who: 'Khách', role: 'a', text: 'じゃ、あれをください。', ro: 'Ja, are o kudasai.', vi: 'Vậy cho tôi cái kia.' },
        { who: '{店員|てんいん}', role: 'b', text: 'ありがとうございます。', ro: 'Arigatou gozaimasu.', vi: 'Cảm ơn quý khách.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ở nhà hàng',
      lines: [
        { who: 'Khách', role: 'a', text: 'すみません、{注文|ちゅうもん}をお{願|ねが}いします。', ro: 'Sumimasen, chuumon o onegai shimasu.', vi: 'Xin lỗi, cho tôi gọi món.' },
        { who: '{店員|てんいん}', role: 'b', text: 'はい、どうぞ。', ro: 'Hai, douzo.', vi: 'Vâng, xin mời.' },
        { who: 'Khách', role: 'a', text: 'これは{何|なん}の{料理|りょうり}ですか。', ro: 'Kore wa nan no ryouri desu ka.', vi: 'Đây là món gì ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: '{魚|さかな}の{料理|りょうり}です。', ro: 'Sakana no ryouri desu.', vi: 'Món cá ạ.' },
        { who: 'Khách', role: 'a', text: '「さかな」は{英語|えいご}で{何|なん}ですか。', ro: '"Sakana" wa eigo de nan desu ka.', vi: '"Sakana" tiếng Anh là gì ạ?' },
        { who: '{店員|てんいん}', role: 'b', text: '「fish」です。', ro: '"Fish" desu.', vi: 'Là "fish".' },
        { who: 'Khách', role: 'a', text: 'じゃ、これを{1|ひと}つとご{飯|はん}を{1|ひと}つください。それから、お{茶|ちゃ}を{2|ふた}つください。', ro: 'Ja, kore o hitotsu to gohan o hitotsu kudasai. Sorekara, ocha o futatsu kudasai.', vi: 'Vậy cho tôi một phần món này và một cơm. Thêm hai trà nữa.' },
        { who: '{店員|てんいん}', role: 'b', text: 'はい。{少々|しょうしょう}お{待|ま}ちください。', ro: 'Hai. Shoushou omachi kudasai.', vi: 'Vâng. Xin chờ một chút.' },
      ],
    },

    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, đọc sai một ký tự trừ 0,2đ). Có 30 giây chuẩn bị. Bốn đoạn dưới đây viết theo đúng khuôn đó và chỉ dùng từ Bài 1–2. Tắt furigana khi đã quen.',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'ここはみどりショッピングビルです。スーパーは{地下|ちか}{一階|いっかい}です。{本屋|ほんや}は{二階|にかい}です。{三階|さんがい}は{百円|ひゃくえん}ショップです。この{店|みせ}のペンは{一|ひと}つ{百円|ひゃくえん}です。レストランは{五階|ごかい}です。',
          ro: 'Koko wa Midori shoppingu biru desu. Suupaa wa chika ikkai desu. Hon-ya wa ni-kai desu. San-gai wa hyaku-en shoppu desu. Kono mise no pen wa hitotsu hyaku en desu. Resutoran wa go-kai desu.',
          vi: 'Đây là toà nhà Midori. Siêu thị ở tầng hầm 1. Hiệu sách ở tầng 2. Tầng 3 là cửa hàng 100 yên. Bút của cửa hàng này 100 yên một cái. Nhà hàng ở tầng 5.',
        },
        {
          en: 'ここはレストランです。これはインドのカレーです。{牛肉|ぎゅうにく}のカレーです。{一|ひと}つ{九百八十円|きゅうひゃくはちじゅうえん}です。あれはドイツのビールです。{六百五十円|ろっぴゃくごじゅうえん}です。カレーを{一|ひと}つとビールを{二|ふた}つください。',
          ro: 'Koko wa resutoran desu. Kore wa Indo no karee desu. Gyuuniku no karee desu. Hitotsu kyuuhyaku hachijuu en desu. Are wa Doitsu no biiru desu. Roppyaku gojuu en desu. Karee o hitotsu to biiru o futatsu kudasai.',
          vi: 'Đây là nhà hàng. Đây là cà ri Ấn Độ. Là cà ri bò. Một phần 980 yên. Kia là bia Đức. 650 yên. Cho tôi một cà ri và hai bia.',
        },
        {
          en: 'これは{私|わたし}の{財布|さいふ}です。あれはワンさんのかばんです。その{時計|とけい}はマルコさんのです。{日本|にほん}の{時計|とけい}です。{三万八千円|さんまんはっせんえん}です。このカメラは{誰|だれ}のですか。',
          ro: 'Kore wa watashi no saifu desu. Are wa Wan-san no kaban desu. Sono tokei wa Maruko-san no desu. Nihon no tokei desu. Sanman hassen en desu. Kono kamera wa dare no desu ka.',
          vi: 'Đây là ví của tôi. Kia là túi của Wang. Cái đồng hồ đó là của Marco. Là đồng hồ Nhật. 38.000 yên. Cái máy ảnh này là của ai?',
        },
        {
          en: 'パソコン{屋|や}は{四階|よんかい}です。{日本|にほん}のパソコンは{八万九千円|はちまんきゅうせんえん}です。アメリカのは{六万四千円|ろくまんよんせんえん}です。{電子辞書|でんしじしょ}は{二万三千六百円|にまんさんぜんろっぴゃくえん}です。じゃ、アメリカのパソコンをください。',
          ro: 'Pasokon-ya wa yon-kai desu. Nihon no pasokon wa hachiman kyuusen en desu. Amerika no wa rokuman yonsen en desu. Denshi jisho wa niman sanzen roppyaku en desu. Ja, Amerika no pasokon o kudasai.',
          vi: 'Cửa hàng máy tính ở tầng 4. Máy tính Nhật 89.000 yên. Máy của Mỹ 64.000 yên. Kim từ điển 23.600 yên. Vậy cho tôi máy tính Mỹ.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '一階 **いっかい**, 三階 **さんがい**, 四階 **よんかい** — không đọc ~~いちかい~~, ~~しかい~~.',
        '一つ **ひとつ**, 二つ **ふたつ** — không đọc ~~いちつ~~.',
        '六百 **ろっぴゃく**, 八千 **はっせん**, 三千 **さんぜん** — ba biến âm hay bị hỏi nhất.',
        'アメリカ**の**は = "cái của Mỹ" (bỏ パソコン sau の, giống ～さんのです).',
      ],
    },

    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b2-noi-ghi-am',
      part: '1',
      questions: [
        'すみません、トイレはどこですか。',
        'FPTだいがくのとしょかんはなんがいですか。',
        'ひゃくえんショップはさんがいですか。',
        'それはだれのペンですか。',
        'そのかばんはいくらですか。',
        'そのとけいはどこのとけいですか。',
        'ここはレストランです。ごちゅうもん、どうぞ。',
        'これはなんのカレーですか。',
        '「ぶたにく」はえいごでなんですか。',
        '「コンピュータ」はベトナムごでなんですか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b2-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 2 (có đáp án)',
  goal: 'Tự dịch, chọn trợ từ, đọc giá và ghép câu Bài 2 không cần nhìn bài học.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận ở những từ hay gặp; nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b2-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'N は どこ／何階 ですか · この／その／あの N · N を ～つ ください · 何の／どこの／誰の N · 「X」は ～語で 何ですか',
      items: [
        { q: 'Xin lỗi, thang máy ở đâu ạ?', answers: A('すみません、エレベーターはどこですか。', 'あのう、すみません、エレベーターはどこですか。', 'エレベーターはどこですか。'), hint: 'エレベーター · どこ — ポイント 9' },
        { q: 'Siêu thị ở tầng hầm 1.', answers: A('スーパーは地下1階です。', 'スーパーはちかいっかいです。', 'スーパーは地下一階です。', 'スーパーはちか1かいです。'), hint: 'スーパー · 地下(ちか) · 1階(いっかい)' },
        { q: 'Cửa hàng 100 yên ở tầng mấy?', answers: A('100円ショップは何階ですか。', 'ひゃくえんショップはなんがいですか。', '100円ショップはなんがいですか。', '百円ショップは何階ですか。', '100円ショップはなんかいですか。'), hint: '何階(なんがい)' },
        { q: 'Kim từ điển ở phía này ạ. (nhân viên nói)', answers: A('電子辞書はこちらです。', 'でんしじしょはこちらです。'), hint: '電子辞書(でんしじしょ) · こちら' },
        { q: 'Cái này bao nhiêu tiền?', answers: A('これはいくらですか。'), hint: 'これ · いくら — ポイント 7, 11' },
        { q: 'Cái đồng hồ kia bao nhiêu tiền?', answers: A('あの時計はいくらですか。', 'あのとけいはいくらですか。'), hint: 'あの + 時計(とけい) — ポイント 8' },
        { q: 'Cái áo phông đó 2.000 yên.', answers: A('そのTシャツは2000円です。', 'そのTシャツは2,000円です。', 'そのTシャツはにせんえんです。', 'そのTシャツは二千円です。', 'そのＴシャツは2000円です。'), hint: 'その · Tシャツ · にせんえん' },
        { q: 'Vậy thì cho tôi cái đó.', answers: A('じゃ、それをください。'), hint: 'じゃ · それ · を · ください' },
        { q: 'Cho tôi ba cà phê.', answers: A('コーヒーを3つください。', 'コーヒーをみっつください。', 'コーヒーを三つください。'), hint: 'コーヒー · を · みっつ — ポイント 10' },
        { q: 'Cho tôi hai thịt lợn chiên xù và một cơm.', answers: A('とんかつを2つとご飯を1つください。', 'とんかつをふたつとごはんをひとつください。', 'とんかつを2つとごはんを1つください。', 'とんかつを二つとご飯を一つください。', 'とんかつを2つとライスを1つください。', 'とんかつをふたつとライスをひとつください。'), hint: 'N1 を ～つ と N2 を ～つ ください' },
        { q: 'Đây là món (làm từ) gì?', answers: A('これは何の料理ですか。', 'これはなんのりょうりですか。', 'これは何のりょうりですか。'), hint: '何の(なんの) · 料理(りょうり) — ポイント 12' },
        { q: 'Đây là cà ri gà.', answers: A('これは鶏肉のカレーです。', 'これはとりにくのカレーです。'), hint: '鶏肉(とりにく) の カレー' },
        { q: 'Đây là bia nước nào?', answers: A('これはどこのビールですか。'), hint: 'どこの — ポイント 13' },
        { q: 'Rượu vang này là vang Pháp.', answers: A('このワインはフランスのワインです。', 'このワインはフランスのです。'), hint: 'この · ワイン · フランス の' },
        { q: 'Đây là ví của ai?', answers: A('これは誰の財布ですか。', 'これはだれのさいふですか。', 'これはだれの財布ですか。', 'これは誰のさいふですか。'), hint: '誰(だれ) の 財布(さいふ) — ポイント 14' },
        { q: 'Cái túi đó là của Wang.', answers: A('そのかばんはワンさんのです。', 'そのかばんはワンさんのかばんです。', 'それはワンさんのかばんです。'), hint: '～さんのです' },
        { q: '"Yasai" tiếng Anh là gì?', answers: A('「やさい」は英語で何ですか。', '「やさい」はえいごでなんですか。', 'やさいはえいごでなんですか。', '「野菜」は英語で何ですか。', '野菜は英語で何ですか。', '「やさい」は英語でなんですか。'), hint: '「X」は 英語(えいご) で 何(なん) ですか — ポイント 15' },
        { q: 'Nhà vệ sinh không phải ở tầng 2. Ở tầng 3.', answers: A('トイレは2階じゃありません。3階です。', 'トイレはにかいじゃありません。さんがいです。', 'トイレは二階じゃありません。三階です。'), hint: '～じゃありません (Bài 1) · 3階(さんがい)' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: 'トイレ＿どこですか。', options: ['は', 'を', 'の', 'で'], correct: 0, why: 'Chủ đề câu hỏi: N **は** どこですか.' },
        { q: 'そのTシャツ＿ください。', options: ['は', 'を', 'の', 'と'], correct: 1, why: 'Đồ muốn lấy + **を** ください.' },
        { q: 'ハンバーグを2つ＿カレーを1つください。', options: ['を', 'の', 'と', 'も'], correct: 2, why: '**と** nối hai cụm gọi món.' },
        { q: 'これはドイツ＿ビールです。', options: ['の', 'を', 'で', 'は'], correct: 0, why: 'Xuất xứ: ドイツ**の**ビール.' },
        { q: '「ぶたにく」は英語＿何ですか。', options: ['の', 'は', 'で', 'を'], correct: 2, why: 'Bằng ngôn ngữ → **で**.' },
        { q: 'このかばんはワンさん＿です。', options: ['は', 'の', 'を', 'と'], correct: 1, why: 'Của Wang = ワンさん**の**です (bỏ かばん).' },
        { q: 'ATMはあそこです。トイレ＿あそこです。(nhà vệ sinh cũng ở đằng kia)', options: ['は', 'も', 'の', 'を'], correct: 1, why: '"cũng" = **も** (Bài 1, ポイント 6).' },
        { q: 'これは何＿料理ですか。', options: ['の', 'を', 'で', 'は'], correct: 0, why: '**何の** + N.' },
        { q: 'コーヒー＿3つください。', options: ['は', 'が', 'を', 'の'], correct: 2, why: 'N **を** ～つ ください.' },
        { q: 'すみません、注文＿お願いします。', options: ['を', 'は', 'の', 'で'], correct: 0, why: 'Câu cố định: 注文**を**お願いします.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-bt-kosoado',
      title: 'こ・そ・あ・ど — chọn từ đúng',
      items: [
        { q: 'Bạn cầm một cuốn sách và hỏi giá: 「＿はいくらですか。」', options: ['これ', 'それ', 'あれ', 'この'], correct: 0, why: 'Vật trong tay người nói, đứng một mình → **これ**.' },
        { q: 'Nhân viên đang cầm cái túi. Bạn hỏi: 「＿かばんはいくらですか。」', options: ['この', 'その', 'あの', 'それ'], correct: 1, why: 'Vật gần người nghe + danh từ → **その**.' },
        { q: 'Chỉ lên thang cuốn ở xa: 「＿はエスカレーターです。」', options: ['ここ', 'これ', 'あれ', 'あの'], correct: 2, why: 'Vật ở xa cả hai, đứng một mình → **あれ**.' },
        { q: 'Hỏi nơi chốn: 「レジは＿ですか。」', options: ['どれ', 'どこ', 'どの', 'だれ'], correct: 1, why: 'Hỏi ở đâu → **どこ**.' },
        { q: 'Nhân viên nói lịch sự "ở phía này ạ": 「カメラは＿です。」', options: ['ここ', 'これ', 'こちら', 'この'], correct: 2, why: 'Cách nói lịch sự của ここ → **こちら**.' },
        { q: 'Bạn đứng ngay cạnh ATM. Người khác chỉ vào chỗ bạn và nói: 「ATMは＿ですよ。」', options: ['ここ', 'そこ', 'あそこ', 'どこ'], correct: 1, why: 'Nơi gần **người nghe** (bạn) → **そこ**.' },
        { q: 'Câu nào SAI?', options: ['このペンは100円です。', 'これは100円です。', 'このは100円です。', 'そのペンは100円です。'], correct: 2, why: 'この phải có danh từ theo sau: ~~このは~~ → これは.' },
        { q: 'Hỏi lịch sự "ở phía nào ạ?"', options: ['どちらですか', 'どれですか', 'だれですか', 'いくらですか'], correct: 0, why: '**どちら** = どこ lịch sự.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-bt-tu-vung',
      title: 'Từ vựng',
      items: [
        { q: 'Quầy thu ngân là:', options: ['レジ', 'トイレ', 'インフォメーション', 'エレベーター'], correct: 0, why: '**レジ** (reji).' },
        { q: '「エスカレーター」 là:', options: ['Thang máy', 'Thang cuốn', 'Máy rút tiền', 'Quầy thông tin'], correct: 1, why: 'エスカレーター = thang cuốn; エレベーター = thang máy.' },
        { q: '「きっさてん」 là:', options: ['Nơi hút thuốc', 'Siêu thị', 'Quán giải khát', 'Nhà hàng'], correct: 2, why: 'きっさてん = quán giải khát; きつえんじょ = nơi hút thuốc.' },
        { q: 'Kim từ điển:', options: ['けいたいでんわ', 'でんしじしょ', 'パソコン', 'カメラ'], correct: 1, why: '**でんしじしょ** ({電子辞書|でんしじしょ}).' },
        { q: '「{豚肉|ぶたにく}」 là:', options: ['Thịt bò', 'Thịt gà', 'Thịt lợn', 'Cá'], correct: 2, why: '豚 = lợn.' },
        { q: '「{紅茶|こうちゃ}」 là:', options: ['Trà xanh', 'Trà đen', 'Cà phê', 'Nước ép'], correct: 1, why: 'こうちゃ = trà đen; お茶 = trà (xanh).' },
        { q: 'Nhân viên nói gì khi khách bước vào?', options: ['ありがとうございます', 'いらっしゃいませ', 'どうぞ', 'すみません'], correct: 1, why: '**いらっしゃいませ** = kính chào quý khách.' },
        { q: '「じゃ、それをください」 — じゃ nghĩa là:', options: ['Không', 'Vậy thì', 'Và', 'Cũng'], correct: 1, why: 'じゃ = thế thì, vậy thì.' },
        { q: '「{財布|さいふ}」 là:', options: ['Túi xách', 'Ví tiền', 'Đồng hồ', 'Giày'], correct: 1, why: 'さいふ = ví; かばん = túi.' },
        { q: 'Tiếng Anh là:', options: ['えいご', 'にほんご', 'ベトナムご', 'ドイツご'], correct: 0, why: '**えいご** ({英語|えいご}).' },
        { q: '「{卵|たまご}」 là:', options: ['Gạo', 'Trứng', 'Dầu', 'Nước'], correct: 1, why: 'たまご = trứng; こめ = gạo; あぶら = dầu; みず = nước.' },
        { q: 'Món "thịt băm viên" là:', options: ['とんかつ', 'ハンバーグ', 'カレー', 'スープ'], correct: 1, why: '**ハンバーグ** (hamburger steak).' },
      ],
    },
    {
      t: 'quiz',
      id: 'b2-bt-doc-gia',
      title: 'Đọc giá — viết bằng hiragana (hoặc romaji)',
      kind: 'fill',
      grammar: 'Chia theo 万 (4 chữ số). 1000 = せん · 10000 = いちまん · 300 さんびゃく · 600 ろっぴゃく · 800 はっぴゃく · 3000 さんぜん · 8000 はっせん',
      items: [
        { q: '450円', answers: A('よんひゃくごじゅうえん', 'よんひゃく ごじゅう えん', 'yonhyaku gojuu en', 'yonhyakugojuuen') },
        { q: '800円', answers: A('はっぴゃくえん', 'はっぴゃく えん', 'happyaku en', 'happyakuen') },
        { q: '1,300円', answers: A('せんさんびゃくえん', 'せん さんびゃく えん', 'sen sanbyaku en', 'sensanbyakuen') },
        { q: '3,600円', answers: A('さんぜんろっぴゃくえん', 'さんぜん ろっぴゃく えん', 'sanzen roppyaku en', 'sanzenroppyakuen') },
        { q: '7,000円', answers: A('ななせんえん', 'ななせん えん', 'nanasen en', 'nanasenen') },
        { q: '9,900円', answers: A('きゅうせんきゅうひゃくえん', 'きゅうせん きゅうひゃく えん', 'kyuusen kyuuhyaku en', 'kyuusenkyuuhyakuen') },
        { q: '14,000円', answers: A('いちまんよんせんえん', 'いちまん よんせん えん', 'ichiman yonsen en', 'ichimanyonsenen') },
        { q: '28,000円', answers: A('にまんはっせんえん', 'にまん はっせん えん', 'niman hassen en', 'nimanhassenen') },
        { q: '36,300円', answers: A('さんまんろくせんさんびゃくえん', 'さんまん ろくせん さんびゃく えん', 'sanman rokusen sanbyaku en', 'sanmanrokusensanbyakuen') },
        { q: '三万五千六百円 (chữ Hán)', answers: A('さんまんごせんろっぴゃくえん', 'さんまん ごせん ろっぴゃく えん', 'sanman gosen roppyaku en', 'sanmangosenroppyakuen') },
      ],
    },
    {
      t: 'quiz',
      id: 'b2-bt-dem',
      title: 'Đếm tầng & đếm cái — viết cách đọc bằng hiragana',
      kind: 'fill',
      items: [
        { q: '1階', answers: A('いっかい', 'ikkai') },
        { q: '3階', answers: A('さんがい', 'さんかい', 'sangai', 'sankai') },
        { q: '6階', answers: A('ろっかい', 'rokkai') },
        { q: '何階', answers: A('なんがい', 'なんかい', 'nangai', 'nankai') },
        { q: '地下1階', answers: A('ちかいっかい', 'ちか いっかい', 'chika ikkai', 'chikaikkai') },
        { q: '1つ', answers: A('ひとつ', 'hitotsu') },
        { q: '3つ', answers: A('みっつ', 'mittsu') },
        { q: '4つ', answers: A('よっつ', 'yottsu') },
        { q: '8つ', answers: A('やっつ', 'yattsu') },
        { q: '10 (cái)', answers: A('とお', 'too', 'tō') },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-bt-hoi-dap',
      title: 'Chọn câu trả lời đúng cho câu hỏi',
      items: [
        { q: 'レストランは{何階|なんがい}ですか。', options: ['{900円|きゅうひゃくえん}です。', '{5階|ごかい}です。', 'インドのレストランです。', 'はい、レストランです。'], correct: 1, why: 'Hỏi tầng → trả lời ～階です.' },
        { q: 'これはどこのワインですか。', options: ['あそこです。', 'フランスのワインです。', 'ブドウのワインです。', '{私|わたし}のワインです。'], correct: 1, why: 'どこの = của nước nào → フランスの.' },
        { q: 'これは{誰|だれ}のかばんですか。', options: ['イタリアのかばんです。', 'マルコさんのかばんです。', '{3,000円|さんぜんえん}です。', 'かばんはあそこです。'], correct: 1, why: '誰の = của ai.' },
        { q: 'これは{何|なん}のケーキですか。', options: ['イチゴのケーキです。', 'ドイツのケーキです。', '{1階|いっかい}です。', 'ケーキを{1|ひと}つください。'], correct: 0, why: '何の = làm từ gì → イチゴの.' },
        { q: 'この{時計|とけい}はいくらですか。', options: ['{日本|にほん}の{時計|とけい}です。', 'その{時計|とけい}は{12,000円|いちまんにせんえん}です。', '{私|わたし}のです。', 'あちらです。'], correct: 1, why: 'いくら = giá tiền.' },
        { q: 'ここはレストランです。ご{注文|ちゅうもん}、どうぞ。', options: ['はい、レストランです。', 'とんかつを{1|ひと}つとコーヒーを{1|ひと}つください。', 'レストランは{5階|ごかい}です。', 'ありがとうございます。'], correct: 1, why: 'Lời mời gọi món → N を～つください.' },
        { q: '{本屋|ほんや}は{3階|さんがい}ですか。 (Hiệu sách thật ra ở tầng 2)', options: ['はい、{3階|さんがい}です。', 'いいえ、{3階|さんがい}じゃありません。{2階|にかい}です。', '{2階|にかい}じゃありません。', 'いいえ、{本屋|ほんや}です。'], correct: 1, why: 'いいえ + phủ định + nói đáp án đúng = trọn điểm.' },
        { q: '「{水|みず}」は{英語|えいご}で{何|なん}ですか。', options: ['「{水|みず}」は{英語|えいご}で「water」です。', '{英語|えいご}です。', '「water」は{日本語|にほんご}です。', 'いいえ、{水|みず}じゃありません。'], correct: 0, why: 'Mẫu đầy đủ của ポイント 15.' },
      ],
    },
    {
      t: 'build',
      id: 'b2-bt-ghep',
      title: 'Ghép câu — hội thoại cửa hàng & nhà hàng',
      items: [
        { vi: 'Xin lỗi, cửa hàng giày ở tầng mấy?', chips: ['すみません、', 'くつ{屋|や}', 'は', '{何階|なんがい}', 'ですか', 'いくら', 'を'], answer: ['すみません、', 'くつ{屋|や}', 'は', '{何階|なんがい}', 'ですか'], ro: 'Sumimasen, kutsu-ya wa nan-gai desu ka.' },
        { vi: 'Cái quần kia bao nhiêu tiền?', chips: ['あの', 'ズボン', 'は', 'いくら', 'ですか', 'あれ', 'どこ'], answer: ['あの', 'ズボン', 'は', 'いくら', 'ですか'], ro: 'Ano zubon wa ikura desu ka.' },
        { vi: 'Cho tôi hai cái bánh dâu tây.', chips: ['イチゴ', 'の', 'ケーキ', 'を', '{2|ふた}つ', 'ください', 'と', 'は'], answer: ['イチゴ', 'の', 'ケーキ', 'を', '{2|ふた}つ', 'ください'], ro: 'Ichigo no keeki o futatsu kudasai.' },
        { vi: 'Đây là súp rau.', chips: ['これ', 'は', '{野菜|やさい}', 'の', 'スープ', 'です', 'を'], answer: ['これ', 'は', '{野菜|やさい}', 'の', 'スープ', 'です'], ro: 'Kore wa yasai no suupu desu.' },
        { vi: 'Cái máy ảnh đó là máy ảnh Nhật.', chips: ['その', 'カメラ', 'は', '{日本|にほん}', 'の', 'カメラ', 'です', 'それ'], answer: ['その', 'カメラ', 'は', '{日本|にほん}', 'の', 'カメラ', 'です'], ro: 'Sono kamera wa Nihon no kamera desu.' },
        { vi: 'Cái điện thoại này là của ai?', chips: ['この', '{携帯電話|けいたいでんわ}', 'は', '{誰|だれ}', 'の', 'ですか', 'どこ', 'これ'], answer: ['この', '{携帯電話|けいたいでんわ}', 'は', '{誰|だれ}', 'の', 'ですか'], ro: 'Kono keitai denwa wa dare no desu ka.' },
        { vi: '"Ringo" tiếng Anh là "apple".', chips: ['「リンゴ」', 'は', '{英語|えいご}', 'で', '「apple」', 'です', 'の'], answer: ['「リンゴ」', 'は', '{英語|えいご}', 'で', '「apple」', 'です'], ro: '"Ringo" wa eigo de "apple" desu.' },
        { vi: 'Cho tôi một cà ri và hai nước ép.', chips: ['カレー', 'を', '{1|ひと}つ', 'と', 'ジュース', 'を', '{2|ふた}つ', 'ください', 'の'], answer: ['カレー', 'を', '{1|ひと}つ', 'と', 'ジュース', 'を', '{2|ふた}つ', 'ください'], ro: 'Karee o hitotsu to juusu o futatsu kudasai.' },
      ],
    },
  ],
};

export const BAI_2: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
