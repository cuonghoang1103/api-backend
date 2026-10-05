/**
 * KHOÁ JP · Bài 3 — Ở đâu? Bao nhiêu tiền?: ここ・そこ・あそこ, どこ, いくら (05/10/2026).
 *
 * Soạn theo ../SOAN-BAI.md. Tự viết 100% (hội thoại, ví dụ, bài nghe, bài đọc).
 * Nối tiếp Bài 2 (これ・それ・あれ, この N, の, だれの): bộ こ・そ・あ・ど nay
 * dùng cho NƠI CHỐN (ここ・そこ・あそこ・どこ) và HƯỚNG / lịch sự (こちら…どちら);
 * thêm hỏi giá いくら, số đếm tới hàng vạn, ～円, ～かい (tầng).
 *
 * Nhân vật & giọng: ラン (Lan, nữ, vai a) · たなかさん (Tanaka, nam, vai b) ·
 * すずきさん (Suzuki, nhân viên cửa hàng, nam, vai b) · マイクさん (Mike, nam, vai b) ·
 * やまだ先生 / người hướng dẫn (nữ, vai c).
 */
import type { Lesson } from '@/components/sach-hoc/types';

/* ── Đáp án gõ tay ─────────────────────────────────────────────────────────
 * Bộ chấm bỏ dấu câu/khoảng trắng và đổi chữ/số toàn khổ về nửa khổ, nhưng
 * KHÔNG tự đổi chữ Hán ↔ kana. ans() nhận mẫu có furigana {漢字|かな} và sinh
 * mọi tổ hợp gõ Hán hoặc gõ kana cho từng chữ, cộng じゃ/では. Phần tử ĐẦU là
 * bản chữ Hán đầy đủ (trang hiện nó làm "Đáp án").
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
  id: 'b3-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: トイレはどこですか・これはいくらですか',
  goal: 'Hỏi đường trong trường và trong cửa hàng, hỏi tầng, hỏi giá và mua một món đồ.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 3 — hôm nay học gì',
      items: [
        'Bộ こ・そ・あ・ど cho **nơi chốn**: **ここ** (chỗ này), **そこ** (chỗ đó), **あそこ** (chỗ kia), **どこ** (ở đâu?).',
        'Bản **lịch sự / chỉ hướng**: **こちら・そちら・あちら・どちら** — nhân viên cửa hàng, lễ tân luôn dùng bộ này.',
        'Hỏi chỗ: **トイレはどこですか** · hỏi tầng: **{何|なん}がいですか** · hỏi nước/hãng: **どこの**ワインですか.',
        'Hỏi giá: **いくらですか** và đọc giá tới hàng vạn: **さんぜんはっぴゃく{円|えん}** (3.800 yên), **いちまん{円|えん}** (10.000 yên).',
        'Mua hàng: **これをください** (cho tôi cái này).',
      ],
    },
    { t: 'h', text: 'Học xong Bài 3 bạn nói được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Mẫu câu dùng'],
      rows: [
        ['1. Ngày đầu ở trường', 'Hỏi nhà vệ sinh, nhà ăn, văn phòng ở đâu; hỏi "chỗ này là đâu?".', 'ここ・そこ・あそこ, どこ, ～かい'],
        ['2. Ở trung tâm thương mại', 'Hỏi quầy bán hàng ở tầng mấy; hiểu nhân viên chỉ đường lịch sự.', 'こちら・そちら・あちら, どちら, {何|なん}がい'],
        ['3. Mua đồng hồ', 'Hỏi giá, hỏi hàng nước nào, quyết định mua.', 'いくら, ～{円|えん}, どこの N, N をください'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học: đọc **bối cảnh** → nghe cả đoạn → bấm từng câu, đọc to theo 3 lần → tắt furigana và romaji rồi đọc lại. Ở Tình huống 3, **che phần romaji và tự đọc giá tiền** — số tiền là chỗ người mới học hay vấp nhất.',
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Ngày đầu ở trường: トイレはどこですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Sáng đầu tiên ở trường tiếng, Lan đứng ở sảnh tầng 1 cùng Tanaka. Lan chưa biết gì trong toà nhà nên hỏi liên tục. Tanaka chỉ tay: chỗ hai người đang đứng là **ここ**, chỗ ở xa là **あそこ**.',
    },
    {
      t: 'dialogue',
      title: 'Ở sảnh trường',
      lines: [
        { who: 'ラン', role: 'a', text: 'たなかさん、ここはどこですか。', ro: 'Tanaka-san, koko wa doko desu ka.', vi: 'Anh Tanaka, chỗ này là đâu vậy?' },
        { who: 'たなか', role: 'b', text: 'ここはロビーです。', ro: 'Koko wa robī desu.', vi: 'Đây là sảnh.' },
        { who: 'ラン', role: 'a', text: 'すみません、トイレはどこですか。', ro: 'Sumimasen, toire wa doko desu ka.', vi: 'Cho mình hỏi, nhà vệ sinh ở đâu?' },
        { who: 'たなか', role: 'b', text: 'トイレはあそこです。エレベーターのとなりです。', ro: 'Toire wa asoko desu. Erebētā no tonari desu.', vi: 'Nhà vệ sinh ở đằng kia. Cạnh thang máy.' },
        { who: 'ラン', role: 'a', text: 'じゃ、しょくどうはどこですか。', ro: 'Ja, shokudō wa doko desu ka.', vi: 'Thế nhà ăn ở đâu?' },
        { who: 'たなか', role: 'b', text: 'しょくどうはちかです。', ro: 'Shokudō wa chika desu.', vi: 'Nhà ăn ở tầng hầm.' },
        { who: 'ラン', role: 'a', text: 'そうですか。{日本語|にほんご}のきょうしつは{何|なん}がいですか。', ro: 'Sō desu ka. Nihongo no kyōshitsu wa nangai desu ka.', vi: 'Vậy à. Lớp tiếng Nhật ở tầng mấy?' },
        { who: 'たなか', role: 'b', text: 'さんがいです。302きょうしつです。', ro: 'Sangai desu. San-zero-ni kyōshitsu desu.', vi: 'Tầng 3. Phòng 302.' },
        { who: 'ラン', role: 'a', text: 'ありがとうございます。', ro: 'Arigatō gozaimasu.', vi: 'Cảm ơn anh.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**ここはどこですか** = "chỗ này là đâu?" — câu cứu cánh khi bị lạc.',
        '**N はどこですか** = "N ở đâu?" — chỉ cần thay N: トイレ, しょくどう, じむしょ…',
        '**エレベーターのとなり** = "bên cạnh thang máy" — となり (bên cạnh) học kỹ ở Bài 10; ở đây chỉ cần nghe hiểu.',
        '**{何|なん}がい** = tầng mấy. Tầng 3 đọc **さんがい** (biến âm か → が), không phải ~~さんかい~~.',
        'Số phòng đọc từng chữ số: 302 = **さん・ぜろ・に** (hoặc さん・まる・に).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'ここはどこですか。', ro: 'Koko wa doko desu ka.', vi: 'Chỗ này là đâu?' },
        { en: 'トイレはどこですか。', ro: 'Toire wa doko desu ka.', vi: 'Nhà vệ sinh ở đâu?' },
        { en: 'トイレはあそこです。', ro: 'Toire wa asoko desu.', vi: 'Nhà vệ sinh ở đằng kia.' },
        { en: 'しょくどうはちかです。', ro: 'Shokudō wa chika desu.', vi: 'Nhà ăn ở tầng hầm.' },
        { en: 'きょうしつは{何|なん}がいですか。', ro: 'Kyōshitsu wa nangai desu ka.', vi: 'Lớp học ở tầng mấy?' },
        { en: 'さんがいです。', ro: 'Sangai desu.', vi: 'Tầng 3.' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Ở trung tâm thương mại: くつうりばはどちらですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Cuối tuần Lan đi デパート (trung tâm thương mại) mua giày. Lan hỏi chị nhân viên ở quầy hướng dẫn (うけつけ). Nhân viên nói với khách luôn dùng bộ **lịch sự こちら・そちら・あちら**, và Lan cũng hỏi lịch sự bằng **どちら**.',
    },
    {
      t: 'dialogue',
      title: 'Ở quầy hướng dẫn',
      lines: [
        { who: 'うけつけ', role: 'c', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { who: 'ラン', role: 'a', text: 'すみません、くつうりばはどちらですか。', ro: 'Sumimasen, kutsu-uriba wa dochira desu ka.', vi: 'Xin lỗi, quầy giày ở đâu ạ?' },
        { who: 'うけつけ', role: 'c', text: 'くつうりばはよんかいです。', ro: 'Kutsu-uriba wa yonkai desu.', vi: 'Quầy giày ở tầng 4 ạ.' },
        { who: 'ラン', role: 'a', text: 'エレベーターはどちらですか。', ro: 'Erebētā wa dochira desu ka.', vi: 'Thang máy ở phía nào ạ?' },
        { who: 'うけつけ', role: 'c', text: 'あちらです。エスカレーターはこちらです。', ro: 'Achira desu. Esukarētā wa kochira desu.', vi: 'Ở phía kia ạ. Thang cuốn thì ở phía này ạ.' },
        { who: 'ラン', role: 'a', text: 'どうも。あのう、ネクタイうりばもよんかいですか。', ro: 'Dōmo. Anō, nekutai-uriba mo yonkai desu ka.', vi: 'Cảm ơn. À… quầy cà vạt cũng ở tầng 4 ạ?' },
        { who: 'うけつけ', role: 'c', text: 'いいえ、ネクタイうりばはにかいです。', ro: 'Iie, nekutai-uriba wa nikai desu.', vi: 'Không ạ, quầy cà vạt ở tầng 2.' },
        { who: 'ラン', role: 'a', text: 'そうですか。ありがとうございました。', ro: 'Sō desu ka. Arigatō gozaimashita.', vi: 'Vậy ạ. Cảm ơn chị.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**どちら** = **どこ** nói lịch sự. Với nhân viên, người lạ, người lớn tuổi: hỏi **どちらですか** sẽ lịch sự hơn どこですか.',
        '**あちら／こちら** của nhân viên vừa là "chỗ kia / chỗ này" vừa là "**phía** kia / **phía** này" — họ thường đưa tay chỉ hướng.',
        '**くつうりば** = くつ (giày) + うりば (quầy bán) → quầy giày. Đổi くつ thành ネクタイ, とけい… là có quầy mới.',
        '**いらっしゃいませ** = "kính chào quý khách" — nghe ở MỌI cửa hàng; khách **không cần đáp lại**.',
        '**ありがとうございました** (đuôi -mashita) — cảm ơn khi việc đã xong, rời quầy.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'くつうりばはどちらですか。', ro: 'Kutsu-uriba wa dochira desu ka.', vi: 'Quầy giày ở đâu ạ? (lịch sự)' },
        { en: 'よんかいです。', ro: 'Yonkai desu.', vi: 'Ở tầng 4.' },
        { en: 'エレベーターはあちらです。', ro: 'Erebētā wa achira desu.', vi: 'Thang máy ở phía kia ạ.' },
        { en: 'エスカレーターはこちらです。', ro: 'Esukarētā wa kochira desu.', vi: 'Thang cuốn ở phía này ạ.' },
        { en: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { en: 'ありがとうございました。', ro: 'Arigatō gozaimashita.', vi: 'Cảm ơn (việc đã xong).' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Mua đồng hồ: これはいくらですか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Lan muốn mua một chiếc đồng hồ rẻ để đi học. Anh Suzuki là nhân viên quầy đồng hồ. Đồng hồ trong tủ kính ở **trước mặt anh Suzuki** — Lan chỉ và nói **その**とけい; chiếc ở tủ xa hơn là **あの**とけい.',
    },
    {
      t: 'dialogue',
      title: 'Quầy đồng hồ',
      lines: [
        { who: 'すずき', role: 'b', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { who: 'ラン', role: 'a', text: 'すみません、そのとけいはいくらですか。', ro: 'Sumimasen, sono tokei wa ikura desu ka.', vi: 'Anh ơi, cái đồng hồ đó bao nhiêu tiền ạ?' },
        { who: 'すずき', role: 'b', text: 'これですか。さんぜんはっぴゃく{円|えん}です。', ro: 'Kore desu ka. Sanzen happyaku en desu.', vi: 'Cái này ạ? 3.800 yên ạ.' },
        { who: 'ラン', role: 'a', text: 'どこのとけいですか。', ro: 'Doko no tokei desu ka.', vi: 'Đồng hồ của nước nào (hãng nào) ạ?' },
        { who: 'すずき', role: 'b', text: '{日本|にほん}のです。', ro: 'Nihon no desu.', vi: 'Của Nhật ạ.' },
        { who: 'ラン', role: 'a', text: 'じゃ、あのとけいは？', ro: 'Ja, ano tokei wa?', vi: 'Thế còn cái đồng hồ kia?' },
        { who: 'すずき', role: 'b', text: 'あれはスイスのとけいです。よんまんごせん{円|えん}です。', ro: 'Are wa Suisu no tokei desu. Yonman gosen en desu.', vi: 'Kia là đồng hồ Thuỵ Sĩ. 45.000 yên ạ.' },
        { who: 'ラン', role: 'a', text: 'よんまん……。じゃ、そのとけいをください。', ro: 'Yonman…… Ja, sono tokei o kudasai.', vi: '45 nghìn… Vậy cho em cái đồng hồ đó.' },
        { who: 'すずき', role: 'b', text: 'はい、さんぜんはっぴゃく{円|えん}です。ありがとうございます。', ro: 'Hai, sanzen happyaku en desu. Arigatō gozaimasu.', vi: 'Vâng, 3.800 yên ạ. Cảm ơn quý khách.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**いくらですか** = bao nhiêu tiền? — dùng cho GIÁ, không dùng hỏi số lượng.',
        '**さんぜん** (3.000) và **はっぴゃく** (800) là hai số **biến âm** — xem bảng số ở mục Ngữ pháp.',
        '**どこのとけい** = đồng hồ của nước nào / hãng nào. Trả lời: **{日本|にほん}のです** (bỏ とけい như Bài 2).',
        '**あのとけいは？** — hỏi rút gọn lên giọng, bỏ "いくらですか" vì đã rõ đang hỏi giá.',
        '**N をください** = "cho tôi N" (khi mua). を là trợ từ tân ngữ — Bài 6 học kỹ; giờ cứ thuộc nguyên cụm.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'そのとけいはいくらですか。', ro: 'Sono tokei wa ikura desu ka.', vi: 'Cái đồng hồ đó bao nhiêu tiền?' },
        { en: 'さんぜんはっぴゃく{円|えん}です。', ro: 'Sanzen happyaku en desu.', vi: '3.800 yên.' },
        { en: 'どこのとけいですか。', ro: 'Doko no tokei desu ka.', vi: 'Đồng hồ nước nào?' },
        { en: 'スイスのとけいです。', ro: 'Suisu no tokei desu.', vi: 'Đồng hồ Thuỵ Sĩ.' },
        { en: 'よんまんごせん{円|えん}です。', ro: 'Yonman gosen en desu.', vi: '45.000 yên.' },
        { en: 'じゃ、そのとけいをください。', ro: 'Ja, sono tokei o kudasai.', vi: 'Vậy cho tôi cái đồng hồ đó.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp khi nói theo hội thoại',
      items: [
        'Hỏi ~~トイレはなんですか~~ (nhà vệ sinh là CÁI GÌ?) → hỏi chỗ phải dùng **どこ**: トイレは**どこ**ですか.',
        'Đọc 3.000 là ~~さんせん~~ → **さんぜん**; 800 là ~~はちひゃく~~ → **はっぴゃく**.',
        'Hỏi nhân viên mà nói ~~どこ~~ cũng không sai, nhưng **どちら** lịch sự hơn — người Nhật để ý điều này.',
        'Nói ~~これはいくらえんですか~~ → chỉ cần **いくらですか** (いくら đã có nghĩa "bao nhiêu tiền").',
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b3-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng: nơi chốn, toà nhà, mua sắm, số tiền',
  goal: 'Nhớ 49 từ về nơi chốn trong trường, trong thành phố, ở cửa hàng và các số lớn — đủ để hỏi đường và hỏi giá.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      items: [
        '6 nhóm: **chỉ nơi chốn** (ここ…どちら), **trong toà nhà**, **nơi chốn ngoài phố**, **ở cửa hàng**, **đồ để mua**, **số lớn & tiền**.',
        'Bộ ここ・そこ・あそこ・どこ có cùng gốc こ・そ・あ・ど với これ・それ・あれ・どれ ở Bài 2 — học theo bộ.',
        'Nhiều từ địa điểm là katakana (トイレ, ロビー, デパート, コンビニ) — đọc theo nhịp Nhật.',
        'Từ vựng tiền: **{百|ひゃく}** (trăm), **{千|せん}** (nghìn), **{万|まん}** (vạn = 10.000), **{円|えん}** (yên).',
      ],
    },

    { t: 'h', text: '1. Chỉ nơi chốn & hướng' },
    {
      t: 'vocab',
      items: [
        { w: 'ここ', pos: 'đại từ chỉ nơi chốn', ipa: 'koko', vi: 'chỗ này, ở đây (gần người nói)', ex: 'ここはきょうしつです。', exRo: 'Koko wa kyōshitsu desu.', exVi: 'Đây là phòng học.', more: 'Bộ: これ (cái này) ↔ **ここ** (chỗ này).' },
        { w: 'そこ', pos: 'đại từ chỉ nơi chốn', ipa: 'soko', vi: 'chỗ đó, ở đó (gần người nghe)', ex: 'かばんはそこです。', exRo: 'Kaban wa soko desu.', exVi: 'Cái cặp ở chỗ đó (chỗ bạn).' },
        { w: 'あそこ', pos: 'đại từ chỉ nơi chốn', ipa: 'asoko', vi: 'chỗ kia, đằng kia (xa cả hai)', ex: 'トイレはあそこです。', exRo: 'Toire wa asoko desu.', exVi: 'Nhà vệ sinh ở đằng kia.', more: 'Chú ý: **あそこ** có thêm そ — không phải ~~あこ~~.' },
        { w: 'どこ', pos: 'từ để hỏi', ipa: 'doko', vi: 'ở đâu, chỗ nào', ex: 'えきはどこですか。', exRo: 'Eki wa doko desu ka.', exVi: 'Nhà ga ở đâu?', more: '**どこの** N = N của nước nào / hãng nào.' },
        { w: 'こちら', pos: 'đại từ (lịch sự)', ipa: 'kochira', vi: 'phía này; chỗ này (lịch sự)', ex: 'エスカレーターはこちらです。', exRo: 'Esukarētā wa kochira desu.', exVi: 'Thang cuốn ở phía này ạ.', more: 'Còn dùng giới thiệu người: こちらはやまだ{先生|せんせい}です (đây là cô Yamada).' },
        { w: 'そちら', pos: 'đại từ (lịch sự)', ipa: 'sochira', vi: 'phía đó; chỗ đó (lịch sự)', ex: 'うけつけはそちらです。', exRo: 'Uketsuke wa sochira desu.', exVi: 'Quầy lễ tân ở phía đó ạ.' },
        { w: 'あちら', pos: 'đại từ (lịch sự)', ipa: 'achira', vi: 'phía kia; chỗ kia (lịch sự)', ex: 'エレベーターはあちらです。', exRo: 'Erebētā wa achira desu.', exVi: 'Thang máy ở phía kia ạ.' },
        { w: 'どちら', pos: 'từ để hỏi (lịch sự)', ipa: 'dochira', vi: 'phía nào; ở đâu (lịch sự)', ex: 'お{国|くに}はどちらですか。', exRo: 'O-kuni wa dochira desu ka.', exVi: 'Anh/chị đến từ nước nào ạ?', more: 'Lịch sự hơn どこ. Hỏi nước, công ty, trường của người khác nên dùng どちら.' },
      ],
    },

    { t: 'h', text: '2. Trong toà nhà, trong trường' },
    {
      t: 'vocab',
      items: [
        { w: 'きょうしつ', pos: 'danh từ', ipa: 'kyōshitsu', vi: 'phòng học, lớp học', ex: 'きょうしつはさんがいです。', exRo: 'Kyōshitsu wa sangai desu.', exVi: 'Phòng học ở tầng 3.', more: 'Chữ Hán 教室 (GIÁO THẤT). Đọc **kyō-shi-tsu**, âm i gần như câm.' },
        { w: 'しょくどう', pos: 'danh từ', ipa: 'shokudō', vi: 'nhà ăn, căng tin', ex: 'しょくどうはどこですか。', exRo: 'Shokudō wa doko desu ka.', exVi: 'Nhà ăn ở đâu?', more: 'Chữ Hán 食堂 (THỰC ĐƯỜNG). Cũng là tên quán cơm bình dân.' },
        { w: 'じむしょ', pos: 'danh từ', ipa: 'jimusho', vi: 'văn phòng', ex: 'じむしょはいっかいです。', exRo: 'Jimusho wa ikkai desu.', exVi: 'Văn phòng ở tầng 1.', more: 'Chữ Hán 事務所 (SỰ VỤ SỞ).' },
        { w: 'うけつけ', pos: 'danh từ', ipa: 'uketsuke', vi: 'quầy lễ tân, quầy hướng dẫn', ex: 'うけつけはあちらです。', exRo: 'Uketsuke wa achira desu.', exVi: 'Quầy lễ tân ở phía kia ạ.' },
        { w: 'ロビー', pos: 'danh từ', ipa: 'robī', vi: 'sảnh', ex: 'ここはロビーです。', exRo: 'Koko wa robī desu.', exVi: 'Đây là sảnh.', more: 'Từ tiếng Anh *lobby*. R tiếng Nhật đọc gần "đ/l" nhẹ.' },
        { w: 'へや', pos: 'danh từ', ipa: 'heya', vi: 'phòng (ở)', ex: 'ランさんのへやはどこですか。', exRo: 'Ran-san no heya wa doko desu ka.', exVi: 'Phòng của Lan ở đâu?' },
        { w: 'トイレ', pos: 'danh từ', ipa: 'toire', vi: 'nhà vệ sinh', ex: 'すみません、トイレはどこですか。', exRo: 'Sumimasen, toire wa doko desu ka.', exVi: 'Xin lỗi, nhà vệ sinh ở đâu?', more: 'Lịch sự hơn: **おてあらい** (お手洗い).' },
        { w: 'エレベーター', pos: 'danh từ', ipa: 'erebētā', vi: 'thang máy', ex: 'エレベーターはそちらです。', exRo: 'Erebētā wa sochira desu.', exVi: 'Thang máy ở phía đó ạ.' },
        { w: 'エスカレーター', pos: 'danh từ', ipa: 'esukarētā', vi: 'thang cuốn', ex: 'エスカレーターはこちらです。', exRo: 'Esukarētā wa kochira desu.', exVi: 'Thang cuốn ở phía này ạ.', more: 'Tokyo: đứng bên **trái** thang cuốn, chừa bên phải cho người đi bộ.' },
        { w: 'かいだん', pos: 'danh từ', ipa: 'kaidan', vi: 'cầu thang (bộ)', ex: 'かいだんはあそこです。', exRo: 'Kaidan wa asoko desu.', exVi: 'Cầu thang ở đằng kia.' },
        { w: '{入口|いりぐち}', pos: 'danh từ', ipa: 'iriguchi', vi: 'lối vào', ex: '{入口|いりぐち}はこちらです。', exRo: 'Iriguchi wa kochira desu.', exVi: 'Lối vào ở phía này ạ.', more: '入 (NHẬP, vào) + 口 (KHẨU, cửa). Chú ý đọc **いりぐち**, không phải ~~はいりぐち~~.' },
        { w: '{出口|でぐち}', pos: 'danh từ', ipa: 'deguchi', vi: 'lối ra', ex: '{出口|でぐち}はどこですか。', exRo: 'Deguchi wa doko desu ka.', exVi: 'Lối ra ở đâu?', more: '出 (XUẤT, ra) + 口 → でぐち (く biến thành ぐ).' },
        { w: '～かい／～がい', pos: 'hậu tố đếm tầng', ipa: '-kai / -gai', vi: 'tầng …', ex: 'じむしょはにかいです。', exRo: 'Jimusho wa nikai desu.', exVi: 'Văn phòng ở tầng 2.', more: 'Chữ Hán 階. Biến âm: いっかい, さんがい, ろっかい, はっかい, じゅっかい, {何|なん}がい.' },
        { w: 'ちか', pos: 'danh từ', ipa: 'chika', vi: 'tầng hầm, dưới mặt đất', ex: 'しょくどうはちかです。', exRo: 'Shokudō wa chika desu.', exVi: 'Nhà ăn ở tầng hầm.', more: 'Chữ Hán 地下 (ĐỊA HẠ). Tầng hầm 1: ちかいっかい.' },
      ],
    },

    { t: 'h', text: '3. Nơi chốn ngoài phố' },
    {
      t: 'vocab',
      items: [
        { w: '{国|くに}', pos: 'danh từ', ipa: 'kuni', vi: 'đất nước', ex: 'お{国|くに}はどちらですか。', exRo: 'O-kuni wa dochira desu ka.', exVi: 'Bạn đến từ nước nào?', more: 'Nói về nước người khác thêm **お**: お{国|くに}. Nước mình: わたしの{国|くに}.' },
        { w: '{会社|かいしゃ}', pos: 'danh từ', ipa: 'kaisha', vi: 'công ty', ex: '{会社|かいしゃ}はどちらですか。', exRo: 'Kaisha wa dochira desu ka.', exVi: 'Anh/chị làm ở công ty nào ạ?', more: 'Hán Việt **HỘI XÃ**. Câu hỏi này hỏi TÊN công ty chứ không chỉ chỗ.' },
        { w: 'うち', pos: 'danh từ', ipa: 'uchi', vi: 'nhà (nhà mình)', ex: 'たなかさんのうちはどこですか。', exRo: 'Tanaka-san no uchi wa doko desu ka.', exVi: 'Nhà Tanaka ở đâu?' },
        { w: 'えき', pos: 'danh từ', ipa: 'eki', vi: 'nhà ga', ex: 'えきはあそこです。', exRo: 'Eki wa asoko desu.', exVi: 'Nhà ga ở đằng kia.', more: 'Chữ Hán 駅 (DỊCH). Ga Tokyo: とうきょうえき.' },
        { w: 'ぎんこう', pos: 'danh từ', ipa: 'ginkō', vi: 'ngân hàng', ex: 'ぎんこうはどこですか。', exRo: 'Ginkō wa doko desu ka.', exVi: 'Ngân hàng ở đâu?', more: 'Chữ Hán 銀行 (NGÂN HÀNG) — y hệt tiếng Việt.' },
        { w: 'コンビニ', pos: 'danh từ', ipa: 'konbini', vi: 'cửa hàng tiện lợi', ex: 'コンビニはえきのまえです。', exRo: 'Konbini wa eki no mae desu.', exVi: 'Cửa hàng tiện lợi ở trước nhà ga.', more: 'Rút gọn của コンビニエンスストア. **～のまえ** = phía trước ～ (Bài 10 học kỹ).' },
        { w: 'デパート', pos: 'danh từ', ipa: 'depāto', vi: 'trung tâm thương mại, bách hoá', ex: 'あのデパートは{日本|にほん}のデパートです。', exRo: 'Ano depāto wa Nihon no depāto desu.', exVi: 'Trung tâm thương mại kia là của Nhật.', more: 'Từ *department store*.' },
        { w: '{店|みせ}', pos: 'danh từ', ipa: 'mise', vi: 'cửa hàng, quán', ex: 'この{店|みせ}のコーヒーはいくらですか。', exRo: 'Kono mise no kōhī wa ikura desu ka.', exVi: 'Cà phê ở quán này bao nhiêu tiền?', more: '店 Hán Việt **ĐIẾM** (như "tửu điếm"). Nhân viên cửa hàng: {店|みせ}の{人|ひと}.' },
      ],
    },

    { t: 'h', text: '4. Ở cửa hàng' },
    {
      t: 'vocab',
      items: [
        { w: 'うりば', pos: 'danh từ', ipa: 'uriba', vi: 'quầy bán, gian hàng', ex: 'とけいうりばはごかいです。', exRo: 'Tokei-uriba wa gokai desu.', exVi: 'Quầy đồng hồ ở tầng 5.', more: 'Chữ Hán 売り場 (chỗ bán). Ghép: くつうりば, ワインうりば…' },
        { w: 'いくら', pos: 'từ để hỏi', ipa: 'ikura', vi: 'bao nhiêu tiền', ex: 'これはいくらですか。', exRo: 'Kore wa ikura desu ka.', exVi: 'Cái này bao nhiêu tiền?', more: 'Chỉ hỏi giá/tiền. Hỏi số lượng là いくつ (Bài 11).' },
        { w: '～{円|えん}', pos: 'hậu tố tiền', ipa: '-en', vi: '… yên (tiền Nhật)', ex: 'このパンはひゃくにじゅう{円|えん}です。', exRo: 'Kono pan wa hyaku nijū en desu.', exVi: 'Cái bánh mì này 120 yên.', more: '円 Hán Việt **VIÊN** (tròn — đồng xu tròn). Ký hiệu ¥. Chú ý: 4円 đọc **よえん**.' },
        { w: '（N を）ください', pos: 'cụm từ', ipa: '(o) kudasai', vi: 'cho tôi (N)', ex: 'じゃ、これをください。', exRo: 'Ja, kore o kudasai.', exVi: 'Vậy cho tôi cái này.', more: 'Câu chốt khi mua hàng, gọi món. を (đọc **o**) là trợ từ — học kỹ ở Bài 6.' },
        { w: 'いらっしゃいませ', pos: 'cụm từ', ipa: 'irasshaimase', vi: 'kính chào quý khách', ex: 'いらっしゃいませ。べんとうはこちらです。', exRo: 'Irasshaimase. Bentō wa kochira desu.', exVi: 'Kính chào quý khách. Cơm hộp ở phía này ạ.', more: 'Nhân viên nói; khách không cần đáp. Lan đi làm thêm ở コンビニ sẽ nói câu này cả ngày!' },
        { w: 'じゃ', pos: 'liên từ', ipa: 'ja', vi: 'vậy thì, thế thì', ex: 'じゃ、そのかばんをください。', exRo: 'Ja, sono kaban o kudasai.', exVi: 'Vậy cho tôi cái cặp đó.', more: 'Dạng trang trọng: では.' },
        { w: 'ありがとうございました', pos: 'cụm từ', ipa: 'arigatō gozaimashita', vi: 'cảm ơn (việc đã xong)', ex: 'どうも、ありがとうございました。', exRo: 'Dōmo, arigatō gozaimashita.', exVi: 'Cảm ơn rất nhiều (khi rời đi).', more: 'Nhân viên nói khi khách trả tiền xong; khách nói khi được giúp xong.' },
      ],
    },

    { t: 'h', text: '5. Đồ để mua' },
    {
      t: 'vocab',
      items: [
        { w: 'くつ', pos: 'danh từ', ipa: 'kutsu', vi: 'giày', ex: 'このくつはいくらですか。', exRo: 'Kono kutsu wa ikura desu ka.', exVi: 'Đôi giày này bao nhiêu tiền?', more: 'Âm u trong **ku-tsu** rất nhẹ: nghe như "kưts".' },
        { w: 'ネクタイ', pos: 'danh từ', ipa: 'nekutai', vi: 'cà vạt', ex: 'あのネクタイはイタリアのです。', exRo: 'Ano nekutai wa Itaria no desu.', exVi: 'Cái cà vạt kia là hàng Ý.' },
        { w: 'ワイン', pos: 'danh từ', ipa: 'wain', vi: 'rượu vang', ex: 'これはどこのワインですか。', exRo: 'Kore wa doko no wain desu ka.', exVi: 'Đây là rượu vang nước nào?' },
        { w: 'べんとう', pos: 'danh từ', ipa: 'bentō', vi: 'cơm hộp', ex: 'このべんとうはごひゃくごじゅう{円|えん}です。', exRo: 'Kono bentō wa gohyaku gojū en desu.', exVi: 'Hộp cơm này 550 yên.', more: 'Hay nói **おべんとう**. Ở コンビニ hỏi: あたためますか (hâm nóng không ạ?).' },
        { w: 'おにぎり', pos: 'danh từ', ipa: 'onigiri', vi: 'cơm nắm', ex: 'このおにぎりはひゃくごじゅう{円|えん}です。', exRo: 'Kono onigiri wa hyaku gojū en desu.', exVi: 'Nắm cơm này 150 yên.' },
        { w: 'パン', pos: 'danh từ', ipa: 'pan', vi: 'bánh mì', ex: 'このパンはいくらですか。', exRo: 'Kono pan wa ikura desu ka.', exVi: 'Bánh mì này bao nhiêu?', more: 'Gốc tiếng Bồ Đào Nha *pão* — vào tiếng Nhật từ thế kỷ 16.' },
        { w: 'みず', pos: 'danh từ', ipa: 'mizu', vi: 'nước (lạnh)', ex: 'みずはひゃく{円|えん}です。', exRo: 'Mizu wa hyaku en desu.', exVi: 'Nước 100 yên.', more: 'Chữ Hán 水 (THUỶ). Nước nóng gọi khác: おゆ.' },
      ],
    },

    { t: 'h', text: '6. Số lớn & tiền' },
    {
      t: 'vocab',
      items: [
        { w: '{百|ひゃく}', pos: 'số từ', ipa: 'hyaku', vi: 'một trăm (100)', ex: 'このボールペンは{百|ひゃく}{円|えん}です。', exRo: 'Kono bōrupen wa hyaku en desu.', exVi: 'Cây bút bi này 100 yên.', more: 'Hán Việt **BÁCH**. 100 là ひゃく (không nói ~~いちひゃく~~). Biến âm: さん**びゃく**, ろっ**ぴゃく**, はっ**ぴゃく**.' },
        { w: '{千|せん}', pos: 'số từ', ipa: 'sen', vi: 'một nghìn (1.000)', ex: 'このネクタイは{千|せん}{円|えん}です。', exRo: 'Kono nekutai wa sen en desu.', exVi: 'Cái cà vạt này 1.000 yên.', more: 'Hán Việt **THIÊN**. 1.000 là せん. Biến âm: さん**ぜん**, はっ**せん**.' },
        { w: '{万|まん}', pos: 'số từ', ipa: 'man', vi: 'vạn (10.000)', ex: 'このとけいはいち{万|まん}{円|えん}です。', exRo: 'Kono tokei wa ichiman en desu.', exVi: 'Cái đồng hồ này 10.000 yên.', more: 'Hán Việt **VẠN**. 10.000 PHẢI có いち: **いちまん**. Tiếng Nhật đếm theo VẠN, không theo nghìn.' },
        { w: '{何|なん}{円|えん}', pos: 'từ để hỏi', ipa: 'nan en', vi: 'bao nhiêu yên', ex: 'それは{何|なん}{円|えん}ですか。', exRo: 'Sore wa nan en desu ka.', exVi: 'Cái đó bao nhiêu yên?', more: 'Cùng nghĩa với いくら; いくら tự nhiên hơn.' },
        { w: 'ゼロ／れい', pos: 'số từ', ipa: 'zero / rei', vi: 'số 0', ex: 'へやは302です。', exRo: 'Heya wa san-zero-ni desu.', exVi: 'Phòng 302.', more: 'Đọc số phòng, số điện thoại: ゼロ hoặc まる. れい hay dùng trong toán, nhiệt độ.' },
      ],
    },

    {
      t: 'note',
      title: 'Người Việt hay nhầm khi học từ Bài 3',
      items: [
        '**どこ** (ở đâu) ≠ **どれ** (cái nào, Bài 2) ≠ **どの** + N. Hỏi chỗ luôn là どこ.',
        '**いくら** chỉ hỏi tiền. Hỏi "mấy tầng" là {何|なん}がい, hỏi "mấy cái" là いくつ.',
        '**いりぐち** (lối vào) — không phải ~~はいりぐち~~ dù động từ "vào" là はいります.',
        'Tiền Nhật đếm theo **vạn**: 20.000 = **に{万|まん}** (2 vạn), không phải ~~にじゅうせん~~ (20 nghìn).',
      ],
    },
    {
      t: 'mcq',
      id: 'b3-tv-nghia',
      title: 'Kiểm tra nghĩa từ — Bài 3',
      items: [
        { q: '**しょくどう** là gì?', options: ['nhà ăn', 'văn phòng', 'phòng học', 'nhà ga'], correct: 0, why: 'しょくどう (食堂) = nhà ăn. Văn phòng = じむしょ, phòng học = きょうしつ, nhà ga = えき.' },
        { q: '"Thang máy" là gì?', options: ['エスカレーター', 'エレベーター', 'かいだん', 'ロビー'], correct: 1, why: 'エレベーター = thang máy; エスカレーター = thang cuốn; かいだん = cầu thang bộ.' },
        { q: '**{出口|でぐち}** là gì?', options: ['lối vào', 'lối ra', 'quầy lễ tân', 'tầng hầm'], correct: 1, why: '出 = ra → 出口 = lối ra. Lối vào = 入口 (いりぐち).' },
        { q: '**どちら** khác **どこ** thế nào?', options: ['Không khác gì', 'どちら lịch sự hơn', 'どちら chỉ hỏi người', 'どちら chỉ hỏi giá'], correct: 1, why: 'どちら là cách nói lịch sự của どこ (và còn có nghĩa "phía nào").' },
        { q: '**いくら** hỏi gì?', options: ['bao nhiêu cái', 'bao nhiêu tiền', 'tầng mấy', 'mấy giờ'], correct: 1, why: 'いくら = bao nhiêu tiền.' },
        { q: '"Quầy bán giày" là:', options: ['くつうりば', 'くつのみせのひと', 'うりばくつ', 'くつうけつけ'], correct: 0, why: 'くつ + うりば → くつうりば.' },
        { q: '**{万|まん}** bằng bao nhiêu?', options: ['1.000', '10.000', '100.000', '1.000.000'], correct: 1, why: '1 万 = 10.000 (một vạn).' },
        { q: '**べんとう** là gì?', options: ['cơm nắm', 'bánh mì', 'cơm hộp', 'rượu vang'], correct: 2, why: 'べんとう = cơm hộp. Cơm nắm = おにぎり.' },
        { q: 'Nhân viên nói **いらっしゃいませ** nghĩa là:', options: ['Cảm ơn quý khách', 'Kính chào quý khách', 'Xin lỗi', 'Mời quý khách ngồi'], correct: 1, why: 'いらっしゃいませ = kính chào quý khách (khi khách bước vào).' },
        { q: '"Cửa hàng tiện lợi" là:', options: ['デパート', 'コンビニ', 'ぎんこう', 'うりば'], correct: 1, why: 'コンビニ = cửa hàng tiện lợi; デパート = trung tâm thương mại.' },
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b3-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp: ここ・そこ・あそこ, どこ, こちら, どこの N, số đếm, いくら',
  goal: 'Nói và hỏi chỗ của người/vật, hỏi lịch sự bằng どちら, hỏi xuất xứ bằng どこの, đọc mọi giá tiền từ 1 tới 99.999 yên và mua hàng.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      items: [
        '**6 điểm**: ① ここ は N です ② N は ここ／どこ です (+ ～かい) ③ こちら・どちら (lịch sự) ④ どこの N ⑤ số đếm tới hàng vạn ⑥ いくらですか, ～{円|えん}, N をください.',
        'Bảng こ・そ・あ・ど giờ đủ 3 hàng: **vật** (これ…), **vật + N** (この…), **chỗ** (ここ…), **hướng / lịch sự** (こちら…).',
        'Hai trật tự câu: **ここは N です** (chỗ này là N) và **N はここです** (N ở chỗ này) — nghĩa khác nhau!',
        'Số tiếng Nhật đếm theo **vạn** (4 chữ số một nhóm), có 6 số biến âm phải thuộc: さんびゃく, ろっぴゃく, はっぴゃく, さんぜん, はっせん, いちまん.',
      ],
    },

    /* ── Điểm 1 ── */
    { t: 'h', text: '① ここ・そこ・あそこ は N です — Chỗ này / đó / kia là N' },
    {
      t: 'p',
      text: 'Giống これ・それ・あれ ở Bài 2, nhưng chỉ **nơi chốn**: **ここ** = chỗ người nói đang đứng; **そこ** = chỗ người nghe; **あそこ** = chỗ xa cả hai. Khi hai người đứng **cùng một chỗ**, nơi đang đứng là ここ, chỗ hơi xa là そこ, chỗ rất xa là あそこ.',
    },
    {
      t: 'table',
      caption: 'Bảng こ・そ・あ・ど (Bài 2 + Bài 3)',
      head: ['', 'こ (gần người nói)', 'そ (gần người nghe)', 'あ (xa cả hai)', 'ど (hỏi)'],
      rows: [
        ['Vật', 'これ', 'それ', 'あれ', 'どれ'],
        ['Vật + N', 'この N', 'その N', 'あの N', 'どの N'],
        ['Chỗ', 'ここ', 'そこ', 'あそこ', 'どこ'],
        ['Hướng / lịch sự', 'こちら', 'そちら', 'あちら', 'どちら'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'ここ／そこ／あそこ は N（nơi chốn）です',
          vi: 'Chỗ này / đó / kia là N',
          examples: [
            { en: 'ここはきょうしつです。', ro: 'Koko wa kyōshitsu desu.', vi: 'Đây là phòng học.' },
            { en: 'そこはじむしょです。', ro: 'Soko wa jimusho desu.', vi: 'Chỗ đó là văn phòng.' },
            { en: 'あそこはしょくどうです。', ro: 'Asoko wa shokudō desu.', vi: 'Chỗ kia là nhà ăn.' },
            { en: 'ここはトイレじゃありません。', ro: 'Koko wa toire ja arimasen.', vi: 'Chỗ này không phải nhà vệ sinh.' },
            { en: 'ここはどこですか。——えきです。', ro: 'Koko wa doko desu ka. — Eki desu.', vi: 'Chỗ này là đâu? — Là nhà ga.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: ここは N です。',
      head: ['Từ lắp vào', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['ロビー', 'ここはロビーです。', 'Koko wa robī desu.', 'Đây là sảnh.'],
        ['うけつけ', 'ここはうけつけです。', 'Koko wa uketsuke desu.', 'Đây là quầy lễ tân.'],
        ['わたしのへや', 'ここはわたしのへやです。', 'Koko wa watashi no heya desu.', 'Đây là phòng của tôi.'],
        ['ぎんこう', 'ここはぎんこうです。', 'Koko wa ginkō desu.', 'Đây là ngân hàng.'],
      ],
    },
    { t: 'rule', formula: 'ここ／そこ／あそこ は N です', vi: 'Giới thiệu "chỗ này là gì" — chủ đề là NƠI CHỐN.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Dùng これ cho nơi chốn: ~~これはしょくどうです~~ (khi đứng trong nhà ăn) → **ここはしょくどうです**. これ = đồ vật, ここ = chỗ.',
        'Viết ~~あこ~~ → **あそこ** (ba âm: a-so-ko).',
      ],
    },

    /* ── Điểm 2 ── */
    { t: 'h', text: '② N は ここ／そこ／あそこ／どこ です — N ở đây / đó / kia / đâu?' },
    {
      t: 'p',
      text: 'Đảo trật tự so với điểm ①: đưa **đồ vật, nơi chốn hoặc người** lên làm chủ đề, rồi nói nó ở chỗ nào. Câu hỏi: thay chỗ bằng **どこ**. Chú ý tiếng Việt cần chữ "**ở**", tiếng Nhật thì không: "Nhà vệ sinh **ở** đằng kia" = トイレは**あそこ**です.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は ここ／そこ／あそこ です',
          vi: 'N ở đây / ở đó / ở đằng kia',
          examples: [
            { en: 'トイレはあそこです。', ro: 'Toire wa asoko desu.', vi: 'Nhà vệ sinh ở đằng kia.' },
            { en: 'じむしょはそこです。', ro: 'Jimusho wa soko desu.', vi: 'Văn phòng ở chỗ đó (gần bạn).' },
            { en: 'わたしのかさはここです。', ro: 'Watashi no kasa wa koko desu.', vi: 'Ô của tôi ở đây.' },
            { en: 'やまだ{先生|せんせい}はじむしょです。', ro: 'Yamada-sensei wa jimusho desu.', vi: 'Cô Yamada đang ở văn phòng.' },
          ],
        },
        {
          formula: 'N は どこ ですか',
          vi: 'N ở đâu?',
          examples: [
            { en: 'えきはどこですか。——あそこです。', ro: 'Eki wa doko desu ka. — Asoko desu.', vi: 'Nhà ga ở đâu? — Ở đằng kia.' },
            { en: 'ランさんのかばんはどこですか。——そこです。', ro: 'Ran-san no kaban wa doko desu ka. — Soko desu.', vi: 'Cặp của Lan ở đâu? — Ở chỗ đó (chỗ bạn).' },
            { en: 'たなかさんはどこですか。——しょくどうです。', ro: 'Tanaka-san wa doko desu ka. — Shokudō desu.', vi: 'Tanaka ở đâu? — Ở nhà ăn.' },
          ],
        },
        {
          formula: 'N は ～かい です ／ N は {何|なん}がい ですか',
          vi: 'N ở tầng … / N ở tầng mấy?',
          examples: [
            { en: 'きょうしつはさんがいです。', ro: 'Kyōshitsu wa sangai desu.', vi: 'Phòng học ở tầng 3.' },
            { en: 'しょくどうは{何|なん}がいですか。——ちかいっかいです。', ro: 'Shokudō wa nangai desu ka. — Chika ikkai desu.', vi: 'Nhà ăn ở tầng mấy? — Tầng hầm 1.' },
            { en: 'ワインうりばはろっかいです。', ro: 'Wain-uriba wa rokkai desu.', vi: 'Quầy rượu vang ở tầng 6.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đếm tầng ～かい — chú ý các ô in đậm (biến âm)',
      head: ['Tầng', 'Đọc', 'Romaji'],
      rows: [
        ['1', '**いっかい**', 'ikkai'],
        ['2', 'にかい', 'nikai'],
        ['3', '**さんがい**', 'sangai'],
        ['4', 'よんかい', 'yonkai'],
        ['5', 'ごかい', 'gokai'],
        ['6', '**ろっかい**', 'rokkai'],
        ['7', 'ななかい', 'nanakai'],
        ['8', '**はっかい** (cũng nói はちかい)', 'hakkai'],
        ['9', 'きゅうかい', 'kyūkai'],
        ['10', '**じゅっかい** (cũng nói じっかい)', 'jukkai'],
        ['?', '**{何|なん}がい**', 'nangai'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: tìm người, tìm chỗ',
      lines: [
        { who: 'ラン', role: 'a', text: 'すみません、やまだ{先生|せんせい}はどこですか。', ro: 'Sumimasen, Yamada-sensei wa doko desu ka.', vi: 'Xin lỗi, cô Yamada ở đâu ạ?' },
        { who: 'たなか', role: 'b', text: '{先生|せんせい}はじむしょです。', ro: 'Sensei wa jimusho desu.', vi: 'Cô ở văn phòng.' },
        { who: 'ラン', role: 'a', text: 'じむしょは{何|なん}がいですか。', ro: 'Jimusho wa nangai desu ka.', vi: 'Văn phòng ở tầng mấy?' },
        { who: 'たなか', role: 'b', text: 'いっかいです。かいだんのとなりです。', ro: 'Ikkai desu. Kaidan no tonari desu.', vi: 'Tầng 1. Cạnh cầu thang.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: N は どこですか。—— あそこです。',
      head: ['N', 'Câu hỏi', 'Romaji', 'Nghĩa'],
      rows: [
        ['{入口|いりぐち}', '{入口|いりぐち}はどこですか。', 'Iriguchi wa doko desu ka.', 'Lối vào ở đâu?'],
        ['{出口|でぐち}', '{出口|でぐち}はどこですか。', 'Deguchi wa doko desu ka.', 'Lối ra ở đâu?'],
        ['エレベーター', 'エレベーターはどこですか。', 'Erebētā wa doko desu ka.', 'Thang máy ở đâu?'],
        ['コンビニ', 'コンビニはどこですか。', 'Konbini wa doko desu ka.', 'Cửa hàng tiện lợi ở đâu?'],
      ],
    },
    { t: 'rule', formula: 'N は ここ／そこ／あそこ／どこ です（か）', vi: 'Nói / hỏi N ở chỗ nào — không cần chữ "ở".' },
    {
      t: 'table',
      caption: 'So sánh hai trật tự (rất hay nhầm)',
      head: ['Câu', 'Romaji', 'Nghĩa', 'Chủ đề'],
      rows: [
        ['ここはしょくどうです。', 'Koko wa shokudō desu.', 'Chỗ này là nhà ăn.', 'nơi đang đứng'],
        ['しょくどうはここです。', 'Shokudō wa koko desu.', 'Nhà ăn ở đây (chính là chỗ này).', 'nhà ăn'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Thêm chữ "ở" kiểu tiếng Việt: ~~トイレはにあそこです~~ → **トイレはあそこです**. (Trợ từ に chỉ vị trí học ở Bài 10.)',
        'Đọc tầng 3 ~~さんかい~~ → **さんがい**; tầng 6 ~~ろくかい~~ → **ろっかい**.',
        'Hỏi tầng bằng ~~いくら~~ → **{何|なん}がい**.',
      ],
    },

    /* ── Điểm 3 ── */
    { t: 'h', text: '③ こちら・そちら・あちら・どちら — lịch sự & chỉ hướng' },
    {
      t: 'p',
      text: 'Bộ **こちら** có hai việc: (1) thay ここ・そこ・あそこ・どこ khi nói **lịch sự** — nhân viên, lễ tân, hoặc khi bạn hỏi người lạ; (2) chỉ **hướng** ("phía này"). Ngoài ra, **どちら** dùng để hỏi lịch sự **nước, công ty, trường** của người đối diện.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は こちら／そちら／あちら です',
          vi: 'N ở phía này / đó / kia (lịch sự)',
          examples: [
            { en: 'うけつけはこちらです。', ro: 'Uketsuke wa kochira desu.', vi: 'Quầy lễ tân ở phía này ạ.' },
            { en: 'エレベーターはあちらです。', ro: 'Erebētā wa achira desu.', vi: 'Thang máy ở phía kia ạ.' },
            { en: 'トイレはそちらです。', ro: 'Toire wa sochira desu.', vi: 'Nhà vệ sinh ở phía đó ạ.' },
          ],
        },
        {
          formula: 'N は どちら ですか',
          vi: 'N ở đâu ạ? (lịch sự) · N là … nào ạ?',
          examples: [
            { en: 'すみません、{出口|でぐち}はどちらですか。', ro: 'Sumimasen, deguchi wa dochira desu ka.', vi: 'Xin lỗi, lối ra ở đâu ạ?' },
            { en: 'お{国|くに}はどちらですか。——ベトナムです。', ro: 'O-kuni wa dochira desu ka. — Betonamu desu.', vi: 'Bạn đến từ nước nào ạ? — Việt Nam.' },
            { en: '{会社|かいしゃ}はどちらですか。——さくらぎんこうです。', ro: 'Kaisha wa dochira desu ka. — Sakura ginkō desu.', vi: 'Anh làm ở công ty nào ạ? — Ngân hàng Sakura.' },
            { en: '{学校|がっこう}はどちらですか。——とうきょう{日本語学校|にほんごがっこう}です。', ro: 'Gakkō wa dochira desu ka. — Tōkyō nihongo gakkō desu.', vi: 'Bạn học trường nào ạ? — Trường tiếng Nhật Tokyo.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Thường (bạn bè) ↔ lịch sự (khách, người lạ, người trên)',
      head: ['Thường', 'Lịch sự', 'Nghĩa'],
      rows: [
        ['ここ', 'こちら', 'chỗ này / phía này'],
        ['そこ', 'そちら', 'chỗ đó / phía đó'],
        ['あそこ', 'あちら', 'chỗ kia / phía kia'],
        ['どこ', 'どちら', 'ở đâu / phía nào'],
        ['だれ (Bài 2)', 'どなた', 'ai'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: làm quen lịch sự',
      lines: [
        { who: 'マイク', role: 'b', text: 'はじめまして。マイクです。アメリカ{人|じん}です。', ro: 'Hajimemashite. Maiku desu. Amerika-jin desu.', vi: 'Rất vui được gặp. Tôi là Mike, người Mỹ.' },
        { who: 'ラン', role: 'a', text: 'ランです。よろしくおねがいします。', ro: 'Ran desu. Yoroshiku onegaishimasu.', vi: 'Tôi là Lan. Mong được giúp đỡ.' },
        { who: 'マイク', role: 'b', text: 'ランさん、お{国|くに}はどちらですか。', ro: 'Ran-san, o-kuni wa dochira desu ka.', vi: 'Lan đến từ nước nào ạ?' },
        { who: 'ラン', role: 'a', text: 'ベトナムです。ハノイです。', ro: 'Betonamu desu. Hanoi desu.', vi: 'Việt Nam. Hà Nội.' },
        { who: 'マイク', role: 'b', text: 'そうですか。{学校|がっこう}はどちらですか。', ro: 'Sō desu ka. Gakkō wa dochira desu ka.', vi: 'Vậy à. Lan học trường nào?' },
        { who: 'ラン', role: 'a', text: 'とうきょう{日本語学校|にほんごがっこう}です。', ro: 'Tōkyō nihongo gakkō desu.', vi: 'Trường tiếng Nhật Tokyo.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: N は どちらですか。',
      head: ['N', 'Câu hỏi', 'Romaji', 'Nghĩa'],
      rows: [
        ['お{国|くに}', 'お{国|くに}はどちらですか。', 'O-kuni wa dochira desu ka.', 'Bạn đến từ nước nào?'],
        ['{会社|かいしゃ}', '{会社|かいしゃ}はどちらですか。', 'Kaisha wa dochira desu ka.', 'Bạn làm công ty nào?'],
        ['うけつけ', 'うけつけはどちらですか。', 'Uketsuke wa dochira desu ka.', 'Quầy lễ tân ở đâu ạ?'],
        ['エスカレーター', 'エスカレーターはどちらですか。', 'Esukarētā wa dochira desu ka.', 'Thang cuốn ở phía nào ạ?'],
      ],
    },
    { t: 'rule', formula: 'こちら・そちら・あちら・どちら ＝ ここ・そこ・あそこ・どこ（lịch sự）', vi: 'Nói với khách, người lạ, người trên; hỏi nước/công ty/trường của người khác.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Trả lời **{会社|かいしゃ}はどちらですか** bằng vị trí (~~あそこです~~) — người hỏi muốn biết **tên** công ty: **ABCです**.',
        'Tự nói về nước mình mà thêm お: ~~わたしのお{国|くに}~~ → **わたしの{国|くに}**. お chỉ dùng cho nước của người khác.',
        'Lẫn **どちら** (lịch sự của どこ) với **どれ** (cái nào): hỏi chỗ thì không dùng どれ.',
      ],
    },

    /* ── Điểm 4 ── */
    { t: 'h', text: '④ どこの N ですか — N của nước nào / hãng nào?' },
    {
      t: 'p',
      text: 'Bài 2 có **ベトナムのコーヒー** (の chỉ xuất xứ). Muốn hỏi xuất xứ thì thay tên nước/hãng bằng **どこ** → **どこの N**. Trả lời bằng tên nước hoặc tên hãng + の. Phân biệt: **だれの** (của AI — chủ sở hữu) ↔ **どこの** (của NƯỚC/HÃNG nào — nơi làm ra).',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'これ／それ／あれ は どこの N ですか',
          vi: 'Đây / đó / kia là N của nước (hãng) nào?',
          examples: [
            { en: 'これはどこのワインですか。——フランスのワインです。', ro: 'Kore wa doko no wain desu ka. — Furansu no wain desu.', vi: 'Đây là rượu vang nước nào? — Rượu vang Pháp.' },
            { en: 'それはどこのとけいですか。——スイスのです。', ro: 'Sore wa doko no tokei desu ka. — Suisu no desu.', vi: 'Đó là đồng hồ nước nào? — Của Thuỵ Sĩ.' },
            { en: 'あれはどこの{車|くるま}ですか。——{日本|にほん}の{車|くるま}です。', ro: 'Are wa doko no kuruma desu ka. — Nihon no kuruma desu.', vi: 'Kia là xe nước nào? — Xe Nhật.' },
            { en: 'このパソコンはどこのですか。——アメリカのです。', ro: 'Kono pasokon wa doko no desu ka. — Amerika no desu.', vi: 'Máy tính này của nước nào? — Của Mỹ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'だれの ↔ どこの',
      head: ['Câu hỏi', 'Romaji', 'Hỏi gì', 'Trả lời mẫu'],
      rows: [
        ['このとけいはだれのですか。', 'Kono tokei wa dare no desu ka.', 'Của AI (chủ)', 'ランさんのです。'],
        ['このとけいはどこのですか。', 'Kono tokei wa doko no desu ka.', 'Của NƯỚC/HÃNG nào', 'スイスのです。'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: これは どこの N ですか。—— X の N です。',
      head: ['N', 'X', 'Trả lời', 'Nghĩa'],
      rows: [
        ['くつ', 'イタリア', 'イタリアのくつです。', 'Giày Ý.'],
        ['チョコレート', 'ベルギー', 'ベルギーのチョコレートです。', 'Sô-cô-la Bỉ.'],
        ['コーヒー', 'ベトナム', 'ベトナムのコーヒーです。', 'Cà phê Việt Nam.'],
        ['カメラ', '{日本|にほん}', '{日本|にほん}のカメラです。', 'Máy ảnh Nhật.'],
      ],
    },
    { t: 'rule', formula: 'どこの N ですか → X の（N）です', vi: 'Hỏi nơi làm ra / nước / hãng của món đồ.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Hỏi hàng nước nào mà dùng ~~だれの~~ → **どこの**. だれ chỉ dành cho người.',
        'Quên の: ~~どこワインですか~~ → **どこの**ワインですか.',
      ],
    },

    /* ── Điểm 5 ── */
    { t: 'h', text: '⑤ Số đếm tới hàng vạn — 11 → 99.999' },
    {
      t: 'p',
      text: 'Bài 1 đã học 0–10. Từ đó ghép lên như xếp gạch: **chục** = số + じゅう (20 = にじゅう), **trăm** = số + ひゃく, **nghìn** = số + せん, **vạn** = số + まん. Đọc từ hàng lớn xuống, **bỏ qua số 0**. Có **6 số biến âm** phải thuộc riêng (in đậm trong bảng).',
    },
    {
      t: 'table',
      caption: 'Hàng chục: 11 → 99',
      head: ['Số', 'Đọc', 'Romaji', 'Ghi chú'],
      rows: [
        ['11', 'じゅういち', 'jūichi', '10 + 1'],
        ['14', 'じゅうよん', 'jūyon', '(cũng nói じゅうし)'],
        ['17', 'じゅうなな', 'jūnana', '(cũng nói じゅうしち)'],
        ['19', 'じゅうきゅう', 'jūkyū', ''],
        ['20', 'にじゅう', 'nijū', '2 × 10'],
        ['40', 'よんじゅう', 'yonjū', '4 = よん'],
        ['70', 'ななじゅう', 'nanajū', '7 = なな'],
        ['90', 'きゅうじゅう', 'kyūjū', '9 = きゅう'],
        ['99', 'きゅうじゅうきゅう', 'kyūjūkyū', ''],
      ],
    },
    {
      t: 'table',
      caption: 'Hàng trăm, nghìn, vạn — ô in đậm là số BIẾN ÂM',
      head: ['', 'Trăm (百)', 'Nghìn (千)', 'Vạn (万)'],
      rows: [
        ['1', 'ひゃく (100)', 'せん (1.000)', '**いちまん** (10.000)'],
        ['2', 'にひゃく', 'にせん', 'にまん'],
        ['3', '**さんびゃく**', '**さんぜん**', 'さんまん'],
        ['4', 'よんひゃく', 'よんせん', 'よんまん'],
        ['5', 'ごひゃく', 'ごせん', 'ごまん'],
        ['6', '**ろっぴゃく**', 'ろくせん', 'ろくまん'],
        ['7', 'ななひゃく', 'ななせん', 'ななまん'],
        ['8', '**はっぴゃく**', '**はっせん**', 'はちまん'],
        ['9', 'きゅうひゃく', 'きゅうせん', 'きゅうまん'],
        ['?', '{何|なん}びゃく', '{何|なん}ぜん', '{何|なん}まん'],
      ],
    },
    {
      t: 'note',
      title: 'Ba luật vàng của số lớn',
      items: [
        '**100 và 1.000 không có いち**: ひゃく, せん (không nói ~~いちひゃく~~, ~~いちせん~~). Nhưng **10.000 bắt buộc có いち**: **いちまん**.',
        '**Đếm theo vạn**: tách 4 chữ số từ phải sang. 45.800 → 4 | 5800 → **よんまん ごせん はっぴゃく**. 20.000 = **にまん** (2 vạn), 100.000 = **じゅうまん** (10 vạn).',
        '**4, 7, 9** luôn đọc **よん, なな, きゅう** khi ghép với ひゃく／せん／まん (không dùng し, しち, く).',
      ],
    },
    {
      t: 'table',
      caption: 'Đọc thử — che cột "Đọc" và tự đọc trước',
      head: ['Số', 'Đọc', 'Romaji'],
      rows: [
        ['150', 'ひゃくごじゅう', 'hyaku gojū'],
        ['380', 'さんびゃくはちじゅう', 'sanbyaku hachijū'],
        ['640', 'ろっぴゃくよんじゅう', 'roppyaku yonjū'],
        ['805', 'はっぴゃくご', 'happyaku go'],
        ['1.200', 'せんにひゃく', 'sen nihyaku'],
        ['3.800', 'さんぜんはっぴゃく', 'sanzen happyaku'],
        ['8.050', 'はっせんごじゅう', 'hassen gojū'],
        ['12.000', 'いちまんにせん', 'ichiman nisen'],
        ['45.800', 'よんまんごせんはっぴゃく', 'yonman gosen happyaku'],
        ['99.999', 'きゅうまんきゅうせんきゅうひゃくきゅうじゅうきゅう', 'kyūman kyūsen kyūhyaku kyūjūkyū'],
      ],
    },
    { t: 'rule', formula: '[số] まん ＋ [số] せん ＋ [số] ひゃく ＋ [số] じゅう ＋ [số]', vi: 'Đọc từ vạn xuống đơn vị, bỏ hàng có số 0; nhớ 6 số biến âm.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Đọc 10.000 là ~~じゅうせん~~ (mười nghìn kiểu tiếng Việt) → **いちまん**.',
        'Đọc 300 là ~~さんひゃく~~ → **さんびゃく**; 3.000 là ~~さんせん~~ → **さんぜん**.',
        'Đọc 600 là ~~ろくひゃく~~ → **ろっぴゃく**; 800 là ~~はちひゃく~~ → **はっぴゃく**; 8.000 là ~~はちせん~~ → **はっせん**.',
        'Viết dấu chấm ngăn nghìn kiểu Việt (3.800) — người Nhật viết **3,800** (dấu phẩy) hoặc 3800.',
      ],
    },

    /* ── Điểm 6 ── */
    { t: 'h', text: '⑥ いくらですか・～円です・N をください — Hỏi giá và mua' },
    {
      t: 'p',
      text: '**いくら** = bao nhiêu tiền. Đặt vào chỗ vị ngữ như mọi từ để hỏi: **N はいくらですか**. Trả lời: **số + {円|えん} + です**. Quyết định mua thì nói **N をください** (cho tôi N) — đây là cụm cố định, Bài 6 sẽ giải thích を.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は いくら ですか → ～{円|えん} です',
          vi: 'N bao nhiêu tiền? → … yên',
          examples: [
            { en: 'このおにぎりはいくらですか。——ひゃくごじゅう{円|えん}です。', ro: 'Kono onigiri wa ikura desu ka. — Hyaku gojū en desu.', vi: 'Nắm cơm này bao nhiêu tiền? — 150 yên.' },
            { en: 'そのくつはいくらですか。——はっせん{円|えん}です。', ro: 'Sono kutsu wa ikura desu ka. — Hassen en desu.', vi: 'Đôi giày đó bao nhiêu tiền? — 8.000 yên.' },
            { en: 'あのワインはいくらですか。——にせんさんびゃく{円|えん}です。', ro: 'Ano wain wa ikura desu ka. — Nisen sanbyaku en desu.', vi: 'Chai rượu vang kia bao nhiêu? — 2.300 yên.' },
            { en: 'このパソコンはいくらですか。——きゅうまんはっせん{円|えん}です。', ro: 'Kono pasokon wa ikura desu ka. — Kyūman hassen en desu.', vi: 'Máy tính này bao nhiêu? — 98.000 yên.' },
          ],
        },
        {
          formula: 'N を ください',
          vi: 'Cho tôi N (mua, gọi món)',
          examples: [
            { en: 'これをください。', ro: 'Kore o kudasai.', vi: 'Cho tôi cái này.' },
            { en: 'じゃ、そのネクタイをください。', ro: 'Ja, sono nekutai o kudasai.', vi: 'Vậy cho tôi cái cà vạt đó.' },
            { en: 'このべんとうをください。', ro: 'Kono bentō o kudasai.', vi: 'Cho tôi hộp cơm này.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Giá có số lẻ — chú ý hai số đặc biệt khi đứng ngay trước 円',
      head: ['Giá', 'Đọc', 'Romaji'],
      rows: [
        ['4{円|えん}', '**よえん**', 'yoen'],
        ['9{円|えん}', 'きゅうえん', 'kyūen'],
        ['104{円|えん}', 'ひゃく**よえん**', 'hyaku yoen'],
        ['1,980{円|えん}', 'せんきゅうひゃくはちじゅうえん', 'sen kyūhyaku hachijū en'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: ở cửa hàng tiện lợi',
      lines: [
        { who: 'マイク', role: 'b', text: 'すみません、このべんとうはいくらですか。', ro: 'Sumimasen, kono bentō wa ikura desu ka.', vi: 'Xin lỗi, hộp cơm này bao nhiêu tiền?' },
        { who: 'ラン', role: 'a', text: 'ごひゃくはちじゅう{円|えん}です。', ro: 'Gohyaku hachijū en desu.', vi: '580 yên ạ.' },
        { who: 'マイク', role: 'b', text: 'じゃ、そのおちゃは？', ro: 'Ja, sono ocha wa?', vi: 'Thế chai trà đó?' },
        { who: 'ラン', role: 'a', text: 'これですか。ひゃくろくじゅう{円|えん}です。', ro: 'Kore desu ka. Hyaku rokujū en desu.', vi: 'Cái này ạ? 160 yên ạ.' },
        { who: 'マイク', role: 'b', text: 'じゃ、このべんとうとそのおちゃをください。', ro: 'Ja, kono bentō to sono ocha o kudasai.', vi: 'Vậy cho tôi hộp cơm này và chai trà đó.' },
        { who: 'ラン', role: 'a', text: 'はい。ななひゃくよんじゅう{円|えん}です。', ro: 'Hai. Nanahyaku yonjū en desu.', vi: 'Vâng. Tất cả 740 yên ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        '**N1 と N2** = "N1 và N2" — nối hai danh từ khi mua nhiều món.',
        '580 + 160 = 740 → **ななひゃくよんじゅう** — luyện cộng nhẩm bằng tiếng Nhật để đi siêu thị không bị bối rối.',
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: この N は いくらですか。—— ～円です。',
      head: ['N', 'Giá', 'Trả lời', 'Romaji'],
      rows: [
        ['パン', '120', 'ひゃくにじゅう{円|えん}です。', 'Hyaku nijū en desu.'],
        ['みず', '100', 'ひゃく{円|えん}です。', 'Hyaku en desu.'],
        ['ネクタイ', '3,000', 'さんぜん{円|えん}です。', 'Sanzen en desu.'],
        ['とけい', '16,800', 'いちまんろくせんはっぴゃく{円|えん}です。', 'Ichiman rokusen happyaku en desu.'],
      ],
    },
    { t: 'rule', formula: 'N は いくらですか → [số]{円|えん}です → N をください', vi: 'Hỏi giá, nghe giá, mua — đủ cho mọi lần đi chợ.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~これはいくら{円|えん}ですか~~ → **これはいくらですか** (いくら đã là "bao nhiêu tiền").',
        '~~これください~~ trong văn viết / khi luyện → nói đủ **これをください** (nói nhanh ngoài đời người Nhật vẫn hay bỏ を).',
        'Trả lời giá mà quên {円|えん}: ~~さんびゃくです~~ nghe vẫn hiểu, nhưng nhân viên luôn nói đủ **さんびゃく{円|えん}です**.',
      ],
    },

    /* ── Luyện tổng hợp ── */
    { t: 'h', text: 'Luyện tổng hợp' },
    {
      t: 'build',
      id: 'b3-np-ghep',
      title: 'Ghép câu — Bài 3',
      items: [
        { vi: 'Chỗ này là nhà ăn.', chips: ['ここは', 'しょくどう', 'です。', 'これは'], answer: ['ここは', 'しょくどう', 'です。'], ro: 'Koko wa shokudō desu.' },
        { vi: 'Nhà vệ sinh ở đằng kia.', chips: ['トイレは', 'あそこ', 'です。', 'あれ'], answer: ['トイレは', 'あそこ', 'です。'], ro: 'Toire wa asoko desu.' },
        { vi: 'Nhà ga ở đâu?', chips: ['えきは', 'どこ', 'ですか。', 'どれ'], answer: ['えきは', 'どこ', 'ですか。'], ro: 'Eki wa doko desu ka.' },
        { vi: 'Thang máy ở phía kia ạ.', chips: ['エレベーターは', 'あちら', 'です。', 'あの'], answer: ['エレベーターは', 'あちら', 'です。'], ro: 'Erebētā wa achira desu.' },
        { vi: 'Phòng học ở tầng mấy?', chips: ['きょうしつは', '{何|なん}がい', 'ですか。', 'いくら'], answer: ['きょうしつは', '{何|なん}がい', 'ですか。'], ro: 'Kyōshitsu wa nangai desu ka.' },
        { vi: 'Đây là rượu vang nước nào?', chips: ['これは', 'どこの', 'ワイン', 'ですか。', 'だれの'], answer: ['これは', 'どこの', 'ワイン', 'ですか。'], ro: 'Kore wa doko no wain desu ka.' },
        { vi: 'Đôi giày này bao nhiêu tiền?', chips: ['この', 'くつは', 'いくら', 'ですか。', 'えん'], answer: ['この', 'くつは', 'いくら', 'ですか。'], ro: 'Kono kutsu wa ikura desu ka.' },
        { vi: 'Vậy cho tôi cái này.', chips: ['じゃ、', 'これを', 'ください。', 'ここを'], answer: ['じゃ、', 'これを', 'ください。'], ro: 'Ja, kore o kudasai.' },
        { vi: 'Bạn đến từ nước nào ạ?', chips: ['お{国|くに}は', 'どちら', 'ですか。', 'どれ'], answer: ['お{国|くに}は', 'どちら', 'ですか。'], ro: 'O-kuni wa dochira desu ka.' },
        { vi: '3.800 yên.', chips: ['さんぜん', 'はっぴゃく', '{円|えん}です。', 'はちひゃく', 'さんせん'], answer: ['さんぜん', 'はっぴゃく', '{円|えん}です。'], ro: 'Sanzen happyaku en desu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b3-np-dien',
      title: 'Điền một từ (ここ／どこ／どちら／どこ の／いくら／số…)',
      kind: 'fill',
      items: [
        { q: '（Hai người đang đứng trong nhà ăn）___はしょくどうです。', answers: ['ここ'] },
        { q: 'トイレは ___ ですか。——あそこです。', answers: ['どこ', 'どちら'] },
        { q: '（Nói lịch sự với khách）エレベーターは ___ です。（phía kia）', answers: ['あちら'] },
        { q: 'これは ___ のワインですか。——フランスのです。', answers: ['どこ', 'どちら'] },
        { q: 'このくつは ___ ですか。——はっせん{円|えん}です。', answers: ['いくら', '何円', 'なんえん'] },
        { q: 'きょうしつは ___ ですか。——さんがいです。', answers: ['何がい', 'なんがい', '何階', 'なんかい', '何かい'] },
        { q: '300 = さん___', answers: ['びゃく'] },
        { q: '3.000 = さん___', answers: ['ぜん'] },
        { q: '10.000 = ___まん', answers: ['いち', '一'] },
        { q: 'じゃ、これ ___ ください。', answers: ['を'] },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-np-chon',
      title: 'Chọn câu / cách đọc đúng',
      items: [
        { q: 'Hỏi "Nhà ga ở đâu?":', options: ['えきは何ですか。', 'えきはどこですか。', 'えきはどれですか。', 'えきはいくらですか。'], correct: 1, why: 'Hỏi chỗ → どこ.' },
        { q: '800 đọc là:', options: ['はちひゃく', 'はっぴゃく', 'はっひゃく', 'はちびゃく'], correct: 1, why: 'Biến âm: はっぴゃく.' },
        { q: '20.000 đọc là:', options: ['にじゅうせん', 'にまん', 'にせんまん', 'にじゅうまん'], correct: 1, why: 'Đếm theo vạn: 2 vạn = にまん.' },
        { q: 'Hỏi lịch sự "Anh làm công ty nào ạ?":', options: ['会社はどこですか。', '会社はどちらですか。', '会社はだれですか。', '会社はどれですか。'], correct: 1, why: 'Hỏi lịch sự công ty/nước/trường → どちら.' },
        { q: '"Đây là đồng hồ của nước nào?":', options: ['これはだれのとけいですか。', 'これはどこのとけいですか。', 'これはどことけいですか。', 'これはいくらのとけいですか。'], correct: 1, why: 'Xuất xứ → どこの N.' },
        { q: '"Chỗ này là văn phòng" và "Văn phòng ở chỗ này" — câu nào là "Văn phòng ở chỗ này"?', options: ['ここはじむしょです。', 'じむしょはここです。', 'これはじむしょです。', 'じむしょはこれです。'], correct: 1, why: 'Chủ đề là văn phòng → じむしょはここです.' },
        { q: 'Tầng 6 đọc là:', options: ['ろくかい', 'ろっかい', 'ろくがい', 'ろっがい'], correct: 1, why: 'ろっかい (biến âm).' },
        { q: '4 yên đọc là:', options: ['よんえん', 'しえん', 'よえん', 'よっえん'], correct: 2, why: 'Riêng trước 円: 4円 = よえん.' },
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const KANJI: Lesson = {
  id: 'b3-kanji',
  kind: 'kanji',
  title: 'Chữ Hán: 円・百・千・万・店・入・出・口・国',
  goal: 'Đọc được giá tiền viết bằng chữ Hán (百円, 三千円, 一万円), biển 入口/出口 và chữ 店, 国; viết tay 7 chữ ✍.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Chữ của tiền**: 円 (yên) · 百 (trăm) · 千 (nghìn) · 万 (vạn) — gặp trên mọi bảng giá ở Nhật.',
        '**Chữ của biển báo**: 入 (vào) · 出 (ra) · 口 (cửa) → **入口** (lối vào), **出口** (lối ra) — gặp ở mọi nhà ga.',
        '**店** (cửa hàng) và **国** (đất nước) cho hai câu hỏi どちら／どこ của bài.',
        'Số đếm 一二三… bạn đã biết từ Bài 1 — giờ ghép với 百・千・万: {三百|さんびゃく}, {八千|はっせん}, {一万|いちまん}.',
      ],
    },
    {
      t: 'table',
      caption: 'Chữ Hán Bài 3 (✍ = nên viết thuộc · 👁 = nhìn nhận ra là đủ)',
      head: ['Chữ', 'Hán Việt', 'On', 'Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['円', 'VIÊN', 'エン', 'まる(い)', 'yên; tròn', '{円|えん} · {百円|ひゃくえん}', '✍'],
        ['百', 'BÁCH', 'ヒャク', '—', 'trăm', '{百|ひゃく} · {三百|さんびゃく} · {六百|ろっぴゃく}', '✍'],
        ['千', 'THIÊN', 'セン', 'ち', 'nghìn', '{千|せん} · {三千|さんぜん} · {八千|はっせん}', '✍'],
        ['万', 'VẠN', 'マン・バン', '—', 'vạn (10.000)', '{一万|いちまん} · {二万円|にまんえん}', '✍'],
        ['店', 'ĐIẾM', 'テン', 'みせ', 'cửa hàng', '{店|みせ} · {書店|しょてん} (hiệu sách)', '👁'],
        ['入', 'NHẬP', 'ニュウ', 'い(る)・はい(る)', 'vào', '{入口|いりぐち}', '👁'],
        ['出', 'XUẤT', 'シュツ', 'で(る)・だ(す)', 'ra', '{出口|でぐち}', '👁'],
        ['口', 'KHẨU', 'コウ・ク', 'くち', 'miệng; cửa', '{口|くち} · {入口|いりぐち} · {出口|でぐち}', '✍'],
        ['国', 'QUỐC', 'コク', 'くに', 'đất nước', '{国|くに} · {中国|ちゅうごく} · {外国|がいこく}', '✍'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ mặt chữ',
      items: [
        '**口**: cái miệng mở vuông → miệng, cửa ra vào. **入口** = cửa để vào, **出口** = cửa để ra.',
        '**入**: hai nét như người đang **bước vào** một cái lều. Đừng nhầm với **人** (người): 人 nét trái dài, 入 nét phải dài.',
        '**出**: hai ngọn núi nhỏ 山 chồng lên nhau → mọc lên, đi ra.',
        '**千** = 十 (mười) có thêm nét phẩy trên đầu. **万** khác 方 (phương) ở chỗ không có dấu chấm trên đầu.',
        '**国**: khung 囗 (biên giới) bao quanh 玉 (ngọc) → đất nước là kho báu trong biên giới.',
        '**店**: mái nhà 广 che chỗ bán hàng → cửa hàng.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc nhầm hay gặp',
      items: [
        '**入口** đọc ~~はいりぐち~~ / ~~にゅうこう~~ → **いりぐち**.',
        '**出口** đọc ~~でくち~~ → **でぐち** (く thành ぐ khi ghép).',
        '**三百** → **さんびゃく**, **六百** → **ろっぴゃく**, **八百** → **はっぴゃく**, **三千** → **さんぜん**, **八千** → **はっせん**: chữ Hán không đổi, chỉ cách đọc đổi.',
        '**一万** bắt buộc đọc **いちまん**; còn **百**, **千** đứng một mình đọc ひゃく, せん (không có いち).',
      ],
    },
    {
      t: 'readkanji',
      id: 'b3-kj-doc',
      title: 'Đọc to — giá tiền và biển báo',
      note: 'Đọc cả câu không nhìn furigana. Chỗ vấp nhiều nhất: 三千 (さんぜん), 八百 (はっぴゃく), 入口 (いりぐち).',
      items: [
        { text: 'この{本|ほん}は{千円|せんえん}です。', ro: 'Kono hon wa sen en desu.', vi: 'Quyển sách này 1.000 yên.' },
        { text: 'おにぎりは{百五十円|ひゃくごじゅうえん}です。', ro: 'Onigiri wa hyaku gojū en desu.', vi: 'Cơm nắm 150 yên.' },
        { text: 'このとけいは{一万円|いちまんえん}です。', ro: 'Kono tokei wa ichiman en desu.', vi: 'Cái đồng hồ này 10.000 yên.' },
        { text: 'そのネクタイは{三千円|さんぜんえん}です。', ro: 'Sono nekutai wa sanzen en desu.', vi: 'Cái cà vạt đó 3.000 yên.' },
        { text: 'べんとうは{八百円|はっぴゃくえん}です。', ro: 'Bentō wa happyaku en desu.', vi: 'Cơm hộp 800 yên.' },
        { text: 'パンは{三百円|さんびゃくえん}です。', ro: 'Pan wa sanbyaku en desu.', vi: 'Bánh mì 300 yên.' },
        { text: 'くつは{八千円|はっせんえん}です。', ro: 'Kutsu wa hassen en desu.', vi: 'Giày 8.000 yên.' },
        { text: '{入口|いりぐち}はこちらです。', ro: 'Iriguchi wa kochira desu.', vi: 'Lối vào ở phía này.' },
        { text: '{出口|でぐち}はどこですか。', ro: 'Deguchi wa doko desu ka.', vi: 'Lối ra ở đâu?' },
        { text: 'あの{店|みせ}は{日本|にほん}の{店|みせ}です。', ro: 'Ano mise wa Nihon no mise desu.', vi: 'Cửa hàng kia là cửa hàng Nhật.' },
        { text: 'お{国|くに}はどちらですか。', ro: 'O-kuni wa dochira desu ka.', vi: 'Bạn đến từ nước nào?' },
        { text: 'これは{中国|ちゅうごく}の{車|くるま}です。', ro: 'Kore wa Chūgoku no kuruma desu.', vi: 'Đây là xe Trung Quốc.' },
        { text: 'パソコンは{九万八千円|きゅうまんはっせんえん}です。', ro: 'Pasokon wa kyūman hassen en desu.', vi: 'Máy tính 98.000 yên.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-kj-chon',
      title: 'Chọn cách đọc đúng',
      items: [
        { q: '**三百円**', options: ['さんひゃくえん', 'さんびゃくえん', 'さんぴゃくえん', 'みつひゃくえん'], correct: 1, why: '3 × 百 biến âm: さんびゃく.' },
        { q: '**八千円**', options: ['はちせんえん', 'はっせんえん', 'はっぜんえん', 'はちぜんえん'], correct: 1, why: '8 × 千 biến âm: はっせん.' },
        { q: '**一万円**', options: ['まんえん', 'いちまんえん', 'ひとまんえん', 'いっまんえん'], correct: 1, why: '10.000 bắt buộc có いち: いちまん.' },
        { q: '**入口**', options: ['はいりぐち', 'いりぐち', 'にゅうぐち', 'いりくち'], correct: 1, why: '入口 = いりぐち (lối vào).' },
        { q: '**出口**', options: ['でくち', 'でぐち', 'しゅつこう', 'だしぐち'], correct: 1, why: '出口 = でぐち (lối ra).' },
        { q: '**店**', options: ['みせ', 'てん', 'まち', 'へや'], correct: 0, why: 'Đứng một mình đọc Kun: みせ (cửa hàng).' },
        { q: '**六百**', options: ['ろくひゃく', 'ろっぴゃく', 'ろくびゃく', 'むっぴゃく'], correct: 1, why: '6 × 百 biến âm: ろっぴゃく.' },
        { q: 'Biển ghi **出口** nghĩa là gì?', options: ['Lối vào', 'Lối ra', 'Quầy lễ tân', 'Cửa hàng'], correct: 1, why: '出 = ra, 口 = cửa → lối ra.' },
      ],
    },
    {
      t: 'write',
      id: 'b3-kj-viet',
      title: 'Tập viết chữ Hán Bài 3',
      note: '7 chữ đầu là ✍ (tiền + 口 + 国) — viết thuộc, ở Nhật bạn sẽ đọc chúng mỗi ngày trên bảng giá. 店・入・出 là 👁. Phân biệt 入 với 人 khi viết: 入 nét phải dài hơn.',
      chars: ['円', '百', '千', '万', '口', '国', '店', '入', '出'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b3-nghe',
  kind: 'listening',
  title: 'Nghe: ở đâu, tầng mấy, bao nhiêu tiền?',
  goal: 'Nghe kiểu đề JLPT N5 và bắt được: chỗ của một nơi, số tầng, giá tiền, tổng tiền phải trả.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '4 bài theo dạng đề **JLPT N5 聴解**: ポイント理解 (bắt một thông tin), 課題理解 (nghe rồi quyết định việc phải làm), 即時応答 (đáp ngay).',
        'Từ khoá phải bắt: **どこ／どちら**, **～かい／～がい**, **いくら**, số **ひゃく・せん・まん**.',
        'Mẹo nghe số: viết nháp từng phần khi nghe — **まん** → **せん** → **ひゃく** → **じゅう** — rồi mới ghép thành con số.',
      ],
    },
    {
      t: 'listen',
      id: 'b3-nghe-1',
      title: 'Bài nghe 1 — Quầy túi xách ở tầng mấy? (ポイント理解)',
      note: 'Dạng ポイント理解: câu hỏi là "Quầy túi xách ở tầng mấy?". Bẫy: nhân viên nói nhiều số tầng khác nhau.',
      lines: [
        { who: 'ラン', voice: 'ja-nu', text: 'すみません、かばんうりばはどちらですか。', ro: 'Sumimasen, kaban-uriba wa dochira desu ka.', vi: 'Xin lỗi, quầy túi xách ở đâu ạ?' },
        { who: 'うけつけ', voice: 'ja-nu', text: 'かばんうりばはごかいです。くつうりばはよんかいです。', ro: 'Kaban-uriba wa gokai desu. Kutsu-uriba wa yonkai desu.', vi: 'Quầy túi xách ở tầng 5. Quầy giày ở tầng 4.' },
        { who: 'ラン', voice: 'ja-nu', text: 'ごかいですね。エレベーターはどちらですか。', ro: 'Gokai desu ne. Erebētā wa dochira desu ka.', vi: 'Tầng 5 nhỉ. Thang máy ở đâu ạ?' },
        { who: 'うけつけ', voice: 'ja-nu', text: 'あちらです。かいだんはこちらです。', ro: 'Achira desu. Kaidan wa kochira desu.', vi: 'Ở phía kia ạ. Cầu thang ở phía này.' },
        { who: 'ラン', voice: 'ja-nu', text: 'ありがとうございました。', ro: 'Arigatō gozaimashita.', vi: 'Cảm ơn chị.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-1-cau',
      title: 'Câu hỏi bài nghe 1',
      items: [
        { q: 'Quầy túi xách ở tầng mấy?', options: ['Tầng 3', 'Tầng 4', 'Tầng 5', 'Tầng 6'], correct: 2, why: 'かばんうりばはごかいです — tầng 5. Tầng 4 là quầy giày.' },
        { q: 'Thang máy ở đâu?', options: ['Phía này (こちら)', 'Phía kia (あちら)', 'Ở tầng 5', 'Không có'], correct: 1, why: 'エレベーターは…あちらです.' },
        { q: '"ごかいですね" — ね ở cuối câu có tác dụng gì?', options: ['Hỏi lại cho chắc / xác nhận', 'Phủ định', 'Hỏi giá', 'Cảm ơn'], correct: 0, why: 'ね cuối câu = "nhỉ / phải không" — xác nhận lại điều vừa nghe.' },
      ],
    },
    {
      t: 'listen',
      id: 'b3-nghe-2',
      title: 'Bài nghe 2 — Mua ô (ポイント理解)',
      note: 'Dạng ポイント理解: câu hỏi là "Lan mua cái ô giá bao nhiêu?". Nghe cả hai giá, để ý câu cuối cùng.',
      lines: [
        { who: 'すずき', voice: 'ja-nam', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { who: 'ラン', voice: 'ja-nu', text: 'すみません、このかさはいくらですか。', ro: 'Sumimasen, kono kasa wa ikura desu ka.', vi: 'Anh ơi, cái ô này bao nhiêu tiền?' },
        { who: 'すずき', voice: 'ja-nam', text: 'それはせんごひゃく{円|えん}です。', ro: 'Sore wa sen gohyaku en desu.', vi: 'Cái đó 1.500 yên ạ.' },
        { who: 'ラン', voice: 'ja-nu', text: 'じゃ、あのかさは？', ro: 'Ja, ano kasa wa?', vi: 'Thế cái ô kia?' },
        { who: 'すずき', voice: 'ja-nam', text: 'あれは{日本|にほん}のかさです。にせんはっぴゃく{円|えん}です。', ro: 'Are wa Nihon no kasa desu. Nisen happyaku en desu.', vi: 'Kia là ô Nhật ạ. 2.800 yên.' },
        { who: 'ラン', voice: 'ja-nu', text: 'そうですか……。じゃ、このかさをください。', ro: 'Sō desu ka…… Ja, kono kasa o kudasai.', vi: 'Vậy à… Thế cho em cái ô này.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-2-cau',
      title: 'Câu hỏi bài nghe 2',
      items: [
        { q: 'Lan mua cái ô giá bao nhiêu?', options: ['1.500 yên', '2.800 yên', '1.800 yên', '2.500 yên'], correct: 0, why: 'Lan nói このかさをください — cái ô này, giá せんごひゃく (1.500) yên.' },
        { q: 'Cái ô Nhật giá bao nhiêu?', options: ['1.500 yên', '2.800 yên', '8.200 yên', '2.008 yên'], correct: 1, why: 'にせんはっぴゃく = 2.800.' },
        { q: '"はっぴゃく" là số nào?', options: ['80', '800', '8.000', '108'], correct: 1, why: 'はっぴゃく = 800 (8 × 百, biến âm).' },
      ],
    },
    {
      t: 'listen',
      id: 'b3-nghe-3',
      title: 'Bài nghe 3 — Ở cửa hàng tiện lợi: trả bao nhiêu? (課題理解)',
      note: 'Dạng 課題理解: nghe hội thoại rồi tính / quyết định. Câu hỏi: "Khách phải trả tất cả bao nhiêu tiền?". Ghi nháp giá từng món.',
      lines: [
        { who: 'ラン', voice: 'ja-nu', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
        { who: 'きゃく', voice: 'ja-nam', text: 'すみません、このおにぎりはいくらですか。', ro: 'Sumimasen, kono onigiri wa ikura desu ka.', vi: 'Xin lỗi, nắm cơm này bao nhiêu?' },
        { who: 'ラン', voice: 'ja-nu', text: 'ひゃくろくじゅう{円|えん}です。', ro: 'Hyaku rokujū en desu.', vi: '160 yên ạ.' },
        { who: 'きゃく', voice: 'ja-nam', text: 'そのおちゃは？', ro: 'Sono ocha wa?', vi: 'Còn chai trà đó?' },
        { who: 'ラン', voice: 'ja-nu', text: 'これはひゃくよんじゅう{円|えん}です。', ro: 'Kore wa hyaku yonjū en desu.', vi: 'Cái này 140 yên ạ.' },
        { who: 'きゃく', voice: 'ja-nam', text: 'じゃ、おにぎりとおちゃをください。', ro: 'Ja, onigiri to ocha o kudasai.', vi: 'Vậy cho tôi nắm cơm và chai trà.' },
        { who: 'ラン', voice: 'ja-nu', text: 'はい、ありがとうございます。', ro: 'Hai, arigatō gozaimasu.', vi: 'Vâng, cảm ơn quý khách.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-3-cau',
      title: 'Câu hỏi bài nghe 3',
      items: [
        { q: 'Khách phải trả tất cả bao nhiêu tiền?', options: ['260 yên', '300 yên', '340 yên', '400 yên'], correct: 1, why: 'Cơm nắm 160 + trà 140 = 300 yên (さんびゃく円).' },
        { q: 'Nắm cơm giá bao nhiêu?', options: ['140 yên', '160 yên', '106 yên', '610 yên'], correct: 1, why: 'ひゃくろくじゅう = 160.' },
        { q: 'Lan nói câu nào khi khách bước vào?', options: ['ありがとうございました', 'いらっしゃいませ', 'すみません', 'どうぞ'], correct: 1, why: 'Chào khách: いらっしゃいませ.' },
      ],
    },
    {
      t: 'listen',
      id: 'b3-nghe-4',
      title: 'Bài nghe 4 — Đáp ngay (即時応答)',
      note: 'Dạng 即時応答: nghe một câu, chọn câu đáp tự nhiên nhất. 3 câu nhỏ.',
      lines: [
        { who: 'Câu 1', voice: 'ja-nam', text: 'すみません、トイレはどちらですか。', ro: 'Sumimasen, toire wa dochira desu ka.', vi: 'Xin lỗi, nhà vệ sinh ở đâu ạ?' },
        { who: 'Câu 2', voice: 'ja-nu', text: 'このかばんはいくらですか。', ro: 'Kono kaban wa ikura desu ka.', vi: 'Cái cặp này bao nhiêu tiền?' },
        { who: 'Câu 3', voice: 'ja-nam', text: 'お{国|くに}はどちらですか。', ro: 'O-kuni wa dochira desu ka.', vi: 'Bạn đến từ nước nào?' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-4-cau',
      title: 'Câu hỏi bài nghe 4 — chọn câu đáp',
      items: [
        { q: 'Câu 1: すみません、トイレはどちらですか。', options: ['あちらです。', 'トイレです。', 'いいえ、ちがいます。'], correct: 0, why: 'Hỏi chỗ → trả lời chỗ: あちらです.' },
        { q: 'Câu 2: このかばんはいくらですか。', options: ['イタリアのです。', 'ごせん円です。', 'ごかいです。'], correct: 1, why: 'Hỏi giá → trả lời số tiền.' },
        { q: 'Câu 3: お国はどちらですか。', options: ['あそこです。', 'ベトナムです。', 'わたしのくにです。'], correct: 1, why: 'Hỏi nước → trả lời tên nước.' },
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b3-noi',
  kind: 'speaking',
  title: 'Nói: hỏi đường, hỏi tầng, hỏi giá',
  goal: 'Đọc trôi 11 câu mẫu (kể cả giá tiền biến âm), rồi tự trả lời câu hỏi về trường, nhà, đồ của mình bằng どこ・どちら・いくら.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Luyện phát âm** 11 câu từ ngắn tới dài — cũng là danh sách câu khi 📞 gọi **CuongMini** trong bài này.',
        'Chú trọng **số biến âm**: さんびゃく, はっぴゃく, さんぜん, いちまん — và trường âm trong **dō, kō, bentō**.',
        'Hội thoại mẫu "giám khảo ↔ thí sinh": hỏi nơi chốn và giá đồ vật.',
        'Ghi âm trả lời 5 câu hỏi về bản thân.',
      ],
    },
    {
      t: 'phatam',
      id: 'b3-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 11 câu Bài 3',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ âm ngắt っ trong **irasshaimase**, **happyaku**; đọc **ん** trọn một nhịp trong **san-ze-n**, **i-chi-ma-n**.',
      items: [
        { text: 'ここはどこですか。', ipa: 'koko wa doko desu ka', vi: 'Chỗ này là đâu?' },
        { text: 'トイレはあそこです。', ipa: 'toire wa asoko desu', vi: 'Nhà vệ sinh ở đằng kia.' },
        { text: 'いらっしゃいませ。', ipa: 'irasshaimase', vi: 'Kính chào quý khách.' },
        { text: 'これはいくらですか。', ipa: 'kore wa ikura desu ka', vi: 'Cái này bao nhiêu tiền?' },
        { text: 'さんびゃく{円|えん}です。', ipa: 'sanbyaku en desu', vi: '300 yên.' },
        { text: 'はっぴゃく{円|えん}です。', ipa: 'happyaku en desu', vi: '800 yên.' },
        { text: 'じゃ、これをください。', ipa: 'ja kore o kudasai', vi: 'Vậy cho tôi cái này.' },
        { text: 'エレベーターはあちらです。', ipa: 'erebētā wa achira desu', vi: 'Thang máy ở phía kia ạ.' },
        { text: 'お{国|くに}はどちらですか。', ipa: 'o kuni wa dochira desu ka', vi: 'Bạn đến từ nước nào?' },
        { text: 'くつうりばは{何|なん}がいですか。', ipa: 'kutsu uriba wa nangai desu ka', vi: 'Quầy giày ở tầng mấy?' },
        { text: 'このとけいはいちまんさんぜん{円|えん}です。', ipa: 'kono tokei wa ichiman sanzen en desu', vi: 'Cái đồng hồ này 13.000 yên.' },
      ],
    },
    {
      t: 'note',
      title: 'Phát âm người Việt hay sai',
      items: [
        '**ん** trước **b/p/m** đọc gần "m": さん**び**ゃく nghe như "sambyaku", **ん** trước các âm khác đọc gần "ng/n" — đừng cố, máy chấm vẫn nhận; chỉ cần giữ đủ **một nhịp** cho ん.',
        '**えん** (yên) là 2 nhịp **e-n**, không đọc thành "iên".',
        '**いらっしゃいませ**: i-ra-**s**-sha-i-ma-se — có một nhịp lặng trước しゃ.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Mẫu: giám khảo hỏi về trường và đồ dùng',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: 'お{国|くに}はどちらですか。', ro: 'O-kuni wa dochira desu ka.', vi: 'Em đến từ nước nào?' },
        { who: 'Thí sinh', role: 'candidate', text: 'ベトナムです。', ro: 'Betonamu desu.', vi: 'Việt Nam ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: '{学校|がっこう}はどちらですか。', ro: 'Gakkō wa dochira desu ka.', vi: 'Em học trường nào?' },
        { who: 'Thí sinh', role: 'candidate', text: 'ハノイ{大学|だいがく}です。', ro: 'Hanoi daigaku desu.', vi: 'Đại học Hà Nội ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'そのかばんはどこのかばんですか。', ro: 'Sono kaban wa doko no kaban desu ka.', vi: 'Cái cặp đó là cặp của nước nào?' },
        { who: 'Thí sinh', role: 'candidate', text: 'これはベトナムのかばんです。', ro: 'Kore wa Betonamu no kaban desu.', vi: 'Đây là cặp Việt Nam ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'いくらですか。', ro: 'Ikura desu ka.', vi: 'Bao nhiêu tiền?' },
        { who: 'Thí sinh', role: 'candidate', text: 'さんぜん{円|えん}です。', ro: 'Sanzen en desu.', vi: '3.000 yên ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bí quyết trả lời',
      items: [
        'Câu hỏi **どちらですか** về trường/công ty → trả lời **TÊN**, không trả lời vị trí.',
        'Không nhớ giá bằng yên? Cứ đổi ra con số dễ đọc: "khoảng 3.000 yên" = **さんぜん{円|えん}ぐらいです** (ぐらい = khoảng).',
        'Nói đủ câu: **これはベトナムのかばんです** hơn là chỉ "ベトナム".',
      ],
    },
    {
      t: 'speak',
      id: 'b3-noi-ghi-am',
      part: '1',
      questions: [
        'おくには どちらですか。',
        'がっこうは どちらですか。',
        'あなたの へやは なんがいですか。',
        'あなたの スマホは どこの スマホですか。',
        'その かばんは いくらですか。',
      ],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b3-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 3 — dịch, chọn từ, ghép câu, đọc hiểu',
  goal: 'Tự viết câu hỏi chỗ, hỏi tầng, hỏi giá; đọc đúng số tiền; hiểu một tờ hướng dẫn cửa hàng.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Dịch Việt → Nhật** 12 câu (gõ kana hay chữ Hán đều được, số tiền gõ bằng chữ số hoặc kana).',
        '**Trắc nghiệm** 12 câu: ここ/どこ/どちら, どこの, số biến âm, いくら.',
        '**Ghép câu** 6 câu và **đọc hiểu** bảng hướng dẫn trung tâm thương mại.',
      ],
    },
    {
      t: 'quiz',
      id: 'b3-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'ここ/そこ/あそこ は N です · N は どこ/どちら ですか · どこの N · N は いくらですか · N をください',
      items: [
        { q: 'Chỗ này là đâu?', answers: ans('ここはどこですか。'), hint: 'ここ, どこ' },
        { q: 'Nhà vệ sinh ở đằng kia.', answers: ans('トイレはあそこです。', 'トイレはあちらです。'), hint: 'トイレ, あそこ' },
        { q: 'Nhà ga ở đâu?', answers: ans('えきはどこですか。', 'えきはどちらですか。'), hint: 'えき, どこ' },
        { q: 'Thang máy ở phía kia ạ. (lịch sự)', answers: ans('エレベーターはあちらです。'), hint: 'エレベーター, あちら' },
        { q: 'Văn phòng ở tầng 1.', answers: ans('じむしょはいっかいです。', 'じむしょは1かいです。', 'じむしょは1階です。', 'じむしょは{一階|いっかい}です。'), hint: 'じむしょ, ～かい' },
        { q: 'Phòng học ở tầng mấy?', answers: ans('きょうしつは{何|なん}がいですか。', 'きょうしつは{何|なん}かいですか。', 'きょうしつは何階ですか。'), hint: 'きょうしつ, 何がい' },
        { q: 'Bạn đến từ nước nào? (lịch sự)', answers: ans('お{国|くに}はどちらですか。'), hint: '国, どちら' },
        { q: 'Đây là rượu vang nước nào?', answers: ans('これはどこのワインですか。'), hint: 'どこの, ワイン' },
        { q: 'Cái đồng hồ này bao nhiêu tiền?', answers: ans('このとけいはいくらですか。'), hint: 'この, とけい, いくら' },
        { q: '800 yên.', answers: ans('はっぴゃく{円|えん}です。', '800{円|えん}です。', '{八百円|はっぴゃくえん}です。', 'はっぴゃく{円|えん}', '800{円|えん}'), hint: 'はっぴゃく, 円' },
        { q: '3.500 yên.', answers: ans('さんぜんごひゃく{円|えん}です。', '3500{円|えん}です。', '3,500{円|えん}です。', 'さんぜんごひゃく{円|えん}', '3500{円|えん}'), hint: 'さんぜん, ごひゃく, 円' },
        { q: 'Vậy cho tôi cái cà vạt đó.', answers: ans('じゃ、そのネクタイをください。', 'では、そのネクタイをください。'), hint: 'その, ネクタイ, ください' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-bt-chon',
      title: 'Chọn từ đúng',
      items: [
        { q: '（Hai người đứng trong sảnh）___はロビーです。', options: ['これ', 'ここ', 'この', 'こちら'], correct: 1, why: 'Nói về chỗ đang đứng → ここ.' },
        { q: 'すみません、ぎんこうは ___ ですか。', options: ['なん', 'どこ', 'だれ', 'いくら'], correct: 1, why: 'Hỏi chỗ → どこ.' },
        { q: '（Nhân viên nói với khách）うけつけは ___ です。', options: ['あそこ', 'あちら', 'あれ', 'あの'], correct: 1, why: 'Nhân viên → lịch sự: あちら.' },
        { q: 'このくつは ___ ですか。——ごせん円です。', options: ['どこ', 'いくら', 'なんがい', 'どちら'], correct: 1, why: 'Trả lời là giá → hỏi いくら.' },
        { q: 'それは ___ のカメラですか。——日本のです。', options: ['だれ', 'どこ', 'なん', 'いくら'], correct: 1, why: 'Trả lời là nước → どこの.' },
        { q: '600 đọc là:', options: ['ろくひゃく', 'ろっぴゃく', 'ろくびゃく', 'むっぴゃく'], correct: 1, why: 'ろっぴゃく (biến âm).' },
        { q: '3.000 đọc là:', options: ['さんせん', 'さんぜん', 'みっせん', 'さっせん'], correct: 1, why: 'さんぜん (biến âm).' },
        { q: '50.000 đọc là:', options: ['ごじゅうせん', 'ごまん', 'ごせんまん', 'ごひゃくせん'], correct: 1, why: '5 vạn = ごまん.' },
        { q: '{会社|かいしゃ}はどちらですか。— Trả lời phù hợp:', options: ['あちらです。', 'ABCです。', 'さんがいです。', 'いくらですか。'], correct: 1, why: 'Hỏi lịch sự công ty nào → trả lời TÊN công ty.' },
        { q: '"Tầng 3" đọc là:', options: ['さんかい', 'さんがい', 'さっかい', 'みかい'], correct: 1, why: 'さんがい (か → が).' },
        { q: 'じゃ、これ ___ ください。', options: ['は', 'の', 'を', 'も'], correct: 2, why: 'Cụm cố định: N をください.' },
        { q: 'Biển ghi **入口** ở nhà ga có nghĩa là:', options: ['Lối ra', 'Lối vào', 'Quầy vé', 'Nhà vệ sinh'], correct: 1, why: '入 = vào, 口 = cửa → lối vào (いりぐち).' },
      ],
    },
    {
      t: 'build',
      id: 'b3-bt-ghep',
      title: 'Ghép câu — hỏi và đáp',
      items: [
        { vi: 'Nhà ăn ở tầng hầm.', chips: ['しょくどうは', 'ちか', 'です。', 'どこ'], answer: ['しょくどうは', 'ちか', 'です。'], ro: 'Shokudō wa chika desu.' },
        { vi: 'Lối ra ở đâu ạ? (lịch sự)', chips: ['{出口|でぐち}は', 'どちら', 'ですか。', '{入口|いりぐち}は'], answer: ['{出口|でぐち}は', 'どちら', 'ですか。'], ro: 'Deguchi wa dochira desu ka.' },
        { vi: 'Cái máy tính kia là của nước nào?', chips: ['あの', 'パソコンは', 'どこの', 'ですか。', 'だれ'], answer: ['あの', 'パソコンは', 'どこの', 'ですか。'], ro: 'Ano pasokon wa doko no desu ka.' },
        { vi: 'Quầy đồng hồ ở tầng 6.', chips: ['とけいうりばは', 'ろっかい', 'です。', 'ろくかい'], answer: ['とけいうりばは', 'ろっかい', 'です。'], ro: 'Tokei-uriba wa rokkai desu.' },
        { vi: 'Hộp cơm này 580 yên.', chips: ['この', 'べんとうは', 'ごひゃくはちじゅう', '{円|えん}です。', 'ごはっぴゃく'], answer: ['この', 'べんとうは', 'ごひゃくはちじゅう', '{円|えん}です。'], ro: 'Kono bentō wa gohyaku hachijū en desu.' },
        { vi: 'Đồng hồ này 12.000 yên.', chips: ['この', 'とけいは', 'いちまん', 'にせん', '{円|えん}です。', 'じゅうにせん'], answer: ['この', 'とけいは', 'いちまん', 'にせん', '{円|えん}です。'], ro: 'Kono tokei wa ichiman nisen en desu.' },
      ],
    },
    {
      t: 'passage',
      title: 'Đọc hiểu — さくらデパートのごあんない (Bảng hướng dẫn trung tâm thương mại Sakura)',
      intro: 'Lan chụp tấm bảng ở cửa vào và nhắn cho Mike. Đọc bảng và tin nhắn, rồi trả lời câu hỏi.',
      paras: [
        { label: 'Bảng', text: '６かい：レストラン　５かい：とけい・カメラ　４かい：くつ・かばん　３かい：ネクタイ　２かい：{本|ほん}・ざっし　１かい：うけつけ　ちか１かい：パン・べんとう・ワイン' },
        { label: 'Tin nhắn', text: 'マイクさん、ここはさくらデパートです。くつうりばはよんかいです。わたしのくつはさんぜんきゅうひゃく{円|えん}です。やすいです！ ワインうりばはちかです。フランスのワインはにせん{円|えん}です。' },
      ],
    },
    {
      t: 'note',
      title: 'Bản dịch & từ mới (xem sau khi làm)',
      items: [
        '**Bảng**: Tầng 6: nhà hàng · Tầng 5: đồng hồ, máy ảnh · Tầng 4: giày, túi xách · Tầng 3: cà vạt · Tầng 2: sách, tạp chí · Tầng 1: quầy lễ tân · Tầng hầm 1: bánh mì, cơm hộp, rượu vang.',
        '**Tin nhắn**: Mike ơi, đây là trung tâm thương mại Sakura. Quầy giày ở tầng 4. Giày của mình 3.900 yên. Rẻ lắm! Quầy rượu vang ở tầng hầm. Rượu vang Pháp 2.000 yên.',
        'Từ mới: **レストラン** = nhà hàng · **やすい** = rẻ (tính từ, học ở Bài 8) · **ごあんない** = bảng hướng dẫn.',
      ],
    },
    {
      t: 'mcq',
      id: 'b3-bt-doc',
      title: 'Câu hỏi đọc hiểu',
      items: [
        { q: 'Mike muốn mua đồng hồ. Mike đi tầng mấy?', options: ['Tầng 3', 'Tầng 4', 'Tầng 5', 'Tầng 6'], correct: 2, why: '５かい：とけい・カメラ.' },
        { q: 'Giày của Lan giá bao nhiêu?', options: ['3.090 yên', '3.900 yên', '9.300 yên', '2.000 yên'], correct: 1, why: 'さんぜんきゅうひゃく = 3.000 + 900 = 3.900.' },
        { q: 'Cơm hộp bán ở đâu?', options: ['Tầng 1', 'Tầng 2', 'Tầng hầm 1', 'Tầng 6'], correct: 2, why: 'ちか１かい：パン・べんとう・ワイン.' },
        { q: 'Rượu vang Pháp giá bao nhiêu?', options: ['200 yên', '2.000 yên', '20.000 yên', '1.200 yên'], correct: 1, why: 'にせん円 = 2.000 yên.' },
        { q: 'Quầy lễ tân ở tầng mấy?', options: ['Tầng hầm', 'Tầng 1', 'Tầng 2', 'Không có'], correct: 1, why: '１かい：うけつけ.' },
      ],
    },
  ],
};

export const BAI_3: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
