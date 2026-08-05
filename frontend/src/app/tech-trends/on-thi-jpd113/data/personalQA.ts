/**
 * JPD113 — HỎI ĐÁP VỀ CHÍNH BẠN (phần TALKING của thi nói).
 *
 * Khác `speaking.ts` ở chỗ nào: `TALK_QUESTIONS` trong speaking.ts là 22 câu
 * CÓ TRONG NGÂN HÀNG CHÍNH THỨC. File này bổ sung những câu giám thị hay hỏi
 * VỐNG RA ngoài ngân hàng — trường, năm mấy, ngành, năm sinh, nơi ở — cộng
 * toàn bộ dạng câu ĐÚNG/SAI (はい／いいえ) mà ngân hàng không dạy cách trả lời.
 *
 * Dạng đúng/sai là chỗ mất điểm âm thầm nhất: sinh viên biết đáp án nhưng chỉ
 * nói "はい" hoặc "いいえ" rồi im, trong khi giám thị đang chấm xem bạn có
 * DỰNG được câu phủ định không. Hai thể phủ định khác nhau (じゃありません cho
 * danh từ, ません cho động từ) và chọn nhầm là sai ngữ pháp.
 *
 * Câu trả lời dùng placeholder {{key}} — dùng chung `fillAnswer()` và hồ sơ
 * cá nhân của speaking.ts, nên người học nhập một lần là cả trang đổi theo.
 */

export interface PersonalQ {
  n: number;
  group: PersonalGroup;
  /** Câu hỏi tiếng Nhật */
  jp: string;
  /** Phiên âm để đọc được ngay */
  romaji?: string;
  /** Nghĩa câu hỏi */
  vi: string;
  /** Mẫu trả lời, có thể chứa {{key}} */
  answer: string;
  /** Nghĩa câu trả lời */
  answerVi: string;
  /** Cảnh báo bẫy */
  note?: string;
}

export type PersonalGroup =
  | 'Tên & chào hỏi'
  | 'Quê quán & quốc tịch'
  | 'Trường & công việc'
  | 'Tuổi, năm sinh, sinh nhật'
  | 'Sở thích'
  | 'Sinh hoạt hằng ngày'
  | 'Ngày nghỉ';

export const PERSONAL_GROUPS: PersonalGroup[] = [
  'Tên & chào hỏi',
  'Quê quán & quốc tịch',
  'Trường & công việc',
  'Tuổi, năm sinh, sinh nhật',
  'Sở thích',
  'Sinh hoạt hằng ngày',
  'Ngày nghỉ',
];

export const PERSONAL_QUESTIONS: PersonalQ[] = [
  /* ───────── Tên & chào hỏi ───────── */
  {
    n: 1,
    group: 'Tên & chào hỏi',
    jp: 'おなまえは。',
    romaji: 'onamae wa',
    vi: 'Tên bạn là gì?',
    answer: 'わたしの なまえは {{name}} です。',
    answerVi: 'Tên tôi là {{name}}.',
    note: 'Câu ĐẦU TIÊN giám thị hỏi, gần như 100%. KHÔNG nói {{name}}さんです — さん không dùng cho chính mình.',
  },
  {
    n: 2,
    group: 'Tên & chào hỏi',
    jp: 'はじめまして。',
    romaji: 'hajimemashite',
    vi: 'Rất vui được gặp bạn.',
    answer: 'はじめまして。{{name}} です。よろしく おねがいします。',
    answerVi: 'Rất vui được gặp. Tôi là {{name}}. Mong được giúp đỡ.',
  },
  {
    n: 3,
    group: 'Tên & chào hỏi',
    jp: 'おなまえを カタカナで おねがいします。',
    vi: 'Đọc/viết tên bạn bằng katakana giúp tôi.',
    answer: '{{name}} です。',
    answerVi: 'Là {{name}} ạ. (đọc tách từng chữ, ví dụ ク・オ・ン)',
    note: 'Đọc CHẬM, tách từng ký tự katakana. Nếu tên có âm khó thì tập trước ở mục tra tên trong tab này.',
  },

  /* ───────── Quê quán ───────── */
  {
    n: 4,
    group: 'Quê quán & quốc tịch',
    jp: 'おくには どちらですか。',
    romaji: 'okuni wa dochira desu ka',
    vi: 'Bạn đến từ nước nào?',
    answer: '{{country}} です。',
    answerVi: 'Là {{country}}.',
    note: 'おくに = "quý quốc", cách hỏi lịch sự. どちら là どこ lịch sự.',
  },
  {
    n: 5,
    group: 'Quê quán & quốc tịch',
    jp: 'なにじんですか。／何人ですか。',
    romaji: 'nanijin desu ka',
    vi: 'Bạn là người nước nào?',
    answer: 'ベトナムじんです。',
    answerVi: 'Tôi là người Việt Nam.',
    note: 'Hỏi 何人 thì đáp có ĐUÔI じん. Hỏi おくに thì đáp KHÔNG có じん. Sai chỗ này là mất điểm ngữ pháp.',
  },
  {
    n: 6,
    group: 'Quê quán & quốc tịch',
    jp: 'どこの くにの 人ですか。',
    vi: 'Bạn là người của nước nào?',
    answer: 'ベトナムの 人です。',
    answerVi: 'Tôi là người Việt Nam.',
  },
  {
    n: 7,
    group: 'Quê quán & quốc tịch',
    jp: 'どこから きましたか。',
    romaji: 'doko kara kimashita ka',
    vi: 'Bạn đến từ đâu?',
    answer: '{{country}} から きました。',
    answerVi: 'Tôi đến từ {{country}}.',
  },
  {
    n: 8,
    group: 'Quê quán & quốc tịch',
    jp: 'いま どこに すんでいますか。',
    vi: 'Bây giờ bạn sống ở đâu?',
    answer: '{{city}} に すんでいます。',
    answerVi: 'Tôi đang sống ở {{city}}.',
    note: 'Nếu quên すんでいます thì nói {{city}} です。 vẫn được chấp nhận.',
  },

  /* ───────── Trường & công việc ───────── */
  {
    n: 9,
    group: 'Trường & công việc',
    jp: 'おしごとは なんですか。',
    romaji: 'oshigoto wa nan desu ka',
    vi: 'Công việc của bạn là gì?',
    answer: '{{job}} です。',
    answerVi: 'Tôi là {{job}}.',
  },
  {
    n: 10,
    group: 'Trường & công việc',
    jp: 'どこの がくせいですか。',
    vi: 'Bạn là sinh viên trường nào?',
    answer: '{{school}} の がくせいです。',
    answerVi: 'Tôi là sinh viên {{school}}.',
  },
  {
    n: 11,
    group: 'Trường & công việc',
    jp: 'がっこうは どこですか。',
    vi: 'Trường bạn ở đâu?',
    answer: '{{school}} です。',
    answerVi: 'Là {{school}}.',
    note: 'FPT đọc là エフピーティー. Đại học = だいがく.',
  },
  {
    n: 12,
    group: 'Trường & công việc',
    jp: 'なんねんせいですか。',
    romaji: 'nan-nensei desu ka',
    vi: 'Bạn học năm mấy?',
    answer: '{{grade}} ねんせいです。',
    answerVi: 'Tôi học năm {{grade}}.',
    note: '1ねんせい いちねんせい · 2ねんせい にねんせい · 3ねんせい さんねんせい · 4ねんせい よねんせい (KHÔNG phải しねんせい).',
  },
  {
    n: 13,
    group: 'Trường & công việc',
    jp: 'なにを べんきょうしますか。',
    vi: 'Bạn học ngành gì?',
    answer: '{{major}} を べんきょうします。',
    answerVi: 'Tôi học {{major}}.',
    note: 'IT đọc là アイティー. Kinh tế = けいざい. Tiếng Nhật = にほんご.',
  },
  {
    n: 14,
    group: 'Trường & công việc',
    jp: '日本語を べんきょうしますか。',
    vi: 'Bạn có học tiếng Nhật không?',
    answer: 'はい、日本語を べんきょうします。',
    answerVi: 'Vâng, tôi học tiếng Nhật.',
  },
  {
    n: 15,
    group: 'Trường & công việc',
    jp: '日本語の べんきょうは どうですか。',
    vi: 'Việc học tiếng Nhật thế nào?',
    answer: 'むずかしいです。でも おもしろいです。',
    answerVi: 'Khó ạ. Nhưng thú vị.',
    note: 'Câu này ăn điểm vì có HAI vế. Chỉ nói むずかしいです cũng đúng nhưng ít điểm hơn.',
  },
  {
    n: 16,
    group: 'Trường & công việc',
    jp: 'がっこうは なんじから なんじまでですか。',
    vi: 'Trường bạn học từ mấy giờ đến mấy giờ?',
    answer: 'ごぜん 7じから ごご 5じまでです。',
    answerVi: 'Từ 7 giờ sáng đến 5 giờ chiều.',
  },
  {
    n: 17,
    group: 'Trường & công việc',
    jp: 'やすみは なんようびですか。',
    vi: 'Bạn nghỉ thứ mấy?',
    answer: 'どようびと にちようびです。',
    answerVi: 'Thứ Bảy và Chủ Nhật.',
  },

  /* ───────── Tuổi & năm sinh ───────── */
  {
    n: 18,
    group: 'Tuổi, năm sinh, sinh nhật',
    jp: 'なんさいですか。',
    romaji: 'nansai desu ka',
    vi: 'Bạn bao nhiêu tuổi?',
    answer: '{{age}} です。',
    answerVi: 'Tôi {{age}}.',
    note: '⚠ 20 tuổi đọc はたち, KHÔNG phải にじゅっさい. 21 = にじゅういっさい (có っ).',
  },
  {
    n: 19,
    group: 'Tuổi, năm sinh, sinh nhật',
    jp: 'おいくつですか。',
    romaji: 'oikutsu desu ka',
    vi: 'Bạn bao nhiêu tuổi ạ? (lịch sự hơn)',
    answer: '{{age}} です。',
    answerVi: 'Tôi {{age}}.',
    note: 'おいくつ và なんさい hỏi CÙNG một thứ. Đừng nhầm với いくら (bao nhiêu tiền).',
  },
  {
    n: 20,
    group: 'Tuổi, năm sinh, sinh nhật',
    jp: 'たんじょうびは いつですか。',
    romaji: 'tanjoubi wa itsu desu ka',
    vi: 'Sinh nhật bạn khi nào?',
    answer: '{{birthday}} です。',
    answerVi: 'Là {{birthday}}.',
    note: '⚠ Ngày 1–10 bất quy tắc hoàn toàn: ついたち ふつか みっか よっか いつか むいか なのか ようか ここのか とおか.',
  },
  {
    n: 21,
    group: 'Tuổi, năm sinh, sinh nhật',
    jp: 'たんじょうびは 何月何日ですか。',
    romaji: 'nangatsu nannichi desu ka',
    vi: 'Sinh nhật bạn ngày mấy tháng mấy?',
    answer: '{{birthday}} です。',
    answerVi: 'Là {{birthday}}.',
    note: '⚠ Tháng bất quy tắc: 4月 しがつ · 7月 しちがつ · 9月 くがつ.',
  },
  {
    n: 22,
    group: 'Tuổi, năm sinh, sinh nhật',
    jp: 'なんねん うまれですか。',
    romaji: 'nan-nen umare desu ka',
    vi: 'Bạn sinh năm nào?',
    answer: '{{birthyear}} ねん うまれです。',
    answerVi: 'Tôi sinh năm {{birthyear}}.',
    note: '2005 = にせんごねん · 2006 = にせんろくねん · 2004 = にせんよねん (KHÔNG phải にせんしねん).',
  },
  {
    n: 23,
    group: 'Tuổi, năm sinh, sinh nhật',
    jp: 'なんねんに うまれましたか。',
    vi: 'Bạn sinh vào năm bao nhiêu?',
    answer: '{{birthyear}} ねんに うまれました。',
    answerVi: 'Tôi sinh năm {{birthyear}}.',
    note: 'Nếu quên うまれました thì trả lời {{birthyear}} ねんです。 vẫn hiểu được.',
  },
  {
    n: 24,
    group: 'Tuổi, năm sinh, sinh nhật',
    jp: 'きょうは 何日ですか。／きょうは 何曜日ですか。',
    vi: 'Hôm nay ngày mấy? / Hôm nay thứ mấy?',
    answer: '（ngày thi）です。／（thứ）です。',
    answerVi: 'Là ngày… / Là thứ…',
    note: 'Trước khi vào phòng thi, NHẨM SẴN ngày hôm đó và thứ hôm đó bằng tiếng Nhật.',
  },

  /* ───────── Sở thích ───────── */
  {
    n: 25,
    group: 'Sở thích',
    jp: 'しゅみは なんですか。',
    romaji: 'shumi wa nan desu ka',
    vi: 'Sở thích của bạn là gì?',
    answer: 'わたしの しゅみは {{hobby}} です。',
    answerVi: 'Sở thích của tôi là {{hobby}}.',
  },
  {
    n: 26,
    group: 'Sở thích',
    jp: 'なにが すきですか。',
    vi: 'Bạn thích gì?',
    answer: '{{hobby}} が すきです。',
    answerVi: 'Tôi thích {{hobby}}.',
    note: 'Chú ý trợ từ が (không phải は) đi với すきです.',
  },
  {
    n: 27,
    group: 'Sở thích',
    jp: 'にほんの りょうりは どうですか。',
    vi: 'Bạn thấy món ăn Nhật thế nào?',
    answer: 'とても おいしいです。',
    answerVi: 'Rất ngon.',
  },
  {
    n: 28,
    group: 'Sở thích',
    jp: 'ベトナムりょうりで なにが すきですか。',
    vi: 'Món Việt bạn thích món gì?',
    answer: 'フォーが すきです。',
    answerVi: 'Tôi thích phở.',
  },

  /* ───────── Sinh hoạt ───────── */
  {
    n: 29,
    group: 'Sinh hoạt hằng ngày',
    jp: 'まいにち なんじに おきますか。',
    vi: 'Hằng ngày bạn dậy lúc mấy giờ?',
    answer: 'まいにち {{wake}} に おきます。',
    answerVi: 'Hằng ngày tôi dậy lúc {{wake}}.',
    note: '⚠ 4時 よじ · 7時 しちじ · 9時 くじ. Có SỐ giờ thì bắt buộc có に.',
  },
  {
    n: 30,
    group: 'Sinh hoạt hằng ngày',
    jp: 'なんじに ねますか。',
    vi: 'Bạn ngủ lúc mấy giờ?',
    answer: 'よる {{sleep}} に ねます。',
    answerVi: 'Tôi ngủ lúc {{sleep}} tối.',
  },
  {
    n: 31,
    group: 'Sinh hoạt hằng ngày',
    jp: 'なんじから なんじまで べんきょうしますか。',
    vi: 'Bạn học từ mấy giờ đến mấy giờ?',
    answer: 'ごぜん 8じから ごご 5じまで べんきょうします。',
    answerVi: 'Tôi học từ 8 giờ sáng đến 5 giờ chiều.',
  },
  {
    n: 32,
    group: 'Sinh hoạt hằng ngày',
    jp: 'あさごはんに なにを たべますか。',
    vi: 'Bữa sáng bạn ăn gì?',
    answer: '{{breakfast}} を たべます。',
    answerVi: 'Tôi ăn {{breakfast}}.',
  },
  {
    n: 33,
    group: 'Sinh hoạt hằng ngày',
    jp: 'ばんごはんに なにを のみますか。',
    vi: 'Bữa tối bạn uống gì?',
    answer: 'おちゃを のみます。',
    answerVi: 'Tôi uống trà.',
  },
  {
    n: 34,
    group: 'Sinh hoạt hằng ngày',
    jp: '学校へは なんで いきますか。',
    romaji: 'gakkou e wa nande ikimasu ka',
    vi: 'Bạn đến trường bằng gì?',
    answer: '{{transport}} で いきます。',
    answerVi: 'Tôi đi bằng {{transport}}.',
    note: '⚠⚠ なんで ở đây là "BẰNG PHƯƠNG TIỆN GÌ", KHÔNG phải "tại sao". Đi bộ = あるいて いきます (KHÔNG có で).',
  },
  {
    n: 35,
    group: 'Sinh hoạt hằng ngày',
    jp: 'いま なんじですか。',
    vi: 'Bây giờ là mấy giờ?',
    answer: 'いま ○じ ○ふんです。',
    answerVi: 'Bây giờ là … giờ … phút.',
    note: 'Phải nhìn đồng hồ nói THẬT. Ôn kỹ bảng phút: 1いっぷん 6ろっぷん 8はっぷん 10じゅっぷん.',
  },

  /* ───────── Ngày nghỉ ───────── */
  {
    n: 36,
    group: 'Ngày nghỉ',
    jp: 'やすみの日 なにを しますか。',
    vi: 'Ngày nghỉ bạn làm GÌ?',
    answer: '{{weekend}}。',
    answerVi: 'Tôi {{weekend}}.',
    note: '⚠ Hỏi なに → đáp HOẠT ĐỘNG (động từ).',
  },
  {
    n: 37,
    group: 'Ngày nghỉ',
    jp: 'やすみの日 どこへ いきますか。',
    vi: 'Ngày nghỉ bạn đi ĐÂU?',
    answer: 'こうえんへ いきます。',
    answerVi: 'Tôi đi công viên.',
    note: '⚠ Hỏi どこ → đáp NƠI CHỐN. Đây là cặp bẫy lớn nhất cả bài thi: câu 36 và 37 nghe rất giống nhau.',
  },
  {
    n: 38,
    group: 'Ngày nghỉ',
    jp: 'にちようび なにを しますか。',
    vi: 'Chủ Nhật bạn làm gì?',
    answer: 'ともだちと サッカーを します。',
    answerVi: 'Tôi đá bóng với bạn.',
  },
  {
    n: 39,
    group: 'Ngày nghỉ',
    jp: 'アルバイトを しますか。',
    vi: 'Bạn có làm thêm không?',
    answer: 'はい、コンビニで アルバイトを します。',
    answerVi: 'Có, tôi làm thêm ở cửa hàng tiện lợi.',
    note: 'Không làm thêm thì: いいえ、アルバイトを しません。',
  },
  {
    n: 40,
    group: 'Ngày nghỉ',
    jp: 'しゅうまつ どこへ いきますか。',
    vi: 'Cuối tuần bạn đi đâu?',
    answer: 'としょかんへ いきます。',
    answerVi: 'Tôi đi thư viện.',
  },
];

/* ══════════════ CÂU HỎI ĐÚNG / SAI ══════════════ */

export interface YesNoQ {
  jp: string;
  vi: string;
  /** Trả lời khi ĐÚNG */
  yes: string;
  yesVi: string;
  /** Trả lời khi SAI — luôn gồm phủ định + sự thật đúng */
  no: string;
  noVi: string;
  /** 'noun' = phủ định じゃありません · 'verb' = phủ định ません */
  kind: 'noun' | 'verb';
}

export const YESNO_QUESTIONS: YesNoQ[] = [
  {
    jp: 'がくせいですか。',
    vi: 'Bạn là sinh viên phải không?',
    yes: 'はい、がくせいです。',
    yesVi: 'Vâng, tôi là sinh viên.',
    no: 'いいえ、がくせい じゃありません。',
    noVi: 'Không, tôi không phải sinh viên.',
    kind: 'noun',
  },
  {
    jp: 'かいしゃいんですか。',
    vi: 'Bạn là nhân viên công ty à?',
    yes: 'はい、かいしゃいんです。',
    yesVi: 'Vâng, tôi là nhân viên công ty.',
    no: 'いいえ、かいしゃいん じゃありません。がくせいです。',
    noVi: 'Không, tôi không phải nhân viên công ty. Tôi là sinh viên.',
    kind: 'noun',
  },
  {
    jp: 'せんせいですか。',
    vi: 'Bạn là giáo viên à?',
    yes: 'はい、せんせいです。',
    yesVi: 'Vâng, tôi là giáo viên.',
    no: 'いいえ、せんせい じゃありません。がくせいです。',
    noVi: 'Không, tôi không phải giáo viên. Tôi là sinh viên.',
    kind: 'noun',
  },
  {
    jp: 'ベトナムじんですか。',
    vi: 'Bạn là người Việt Nam phải không?',
    yes: 'はい、ベトナムじんです。',
    yesVi: 'Vâng, tôi là người Việt Nam.',
    no: 'いいえ、ベトナムじん じゃありません。',
    noVi: 'Không, tôi không phải người Việt Nam.',
    kind: 'noun',
  },
  {
    jp: 'にほんじんですか。',
    vi: 'Bạn là người Nhật à?',
    yes: '—',
    yesVi: '(không dùng)',
    no: 'いいえ、にほんじん じゃありません。ベトナムじんです。',
    noVi: 'Không, tôi không phải người Nhật. Tôi là người Việt Nam.',
    kind: 'noun',
  },
  {
    jp: 'はたちですか。',
    vi: 'Bạn 20 tuổi à?',
    yes: 'はい、はたちです。',
    yesVi: 'Vâng, tôi 20 tuổi.',
    no: 'いいえ、はたち じゃありません。21さいです。',
    noVi: 'Không, tôi không phải 20 tuổi. Tôi 21 tuổi.',
    kind: 'noun',
  },
  {
    jp: 'コーヒーを のみますか。',
    vi: 'Bạn có uống cà phê không?',
    yes: 'はい、のみます。',
    yesVi: 'Vâng, tôi có uống.',
    no: 'いいえ、のみません。おちゃを のみます。',
    noVi: 'Không, tôi không uống. Tôi uống trà.',
    kind: 'verb',
  },
  {
    jp: 'まいにち べんきょうしますか。',
    vi: 'Hằng ngày bạn có học bài không?',
    yes: 'はい、まいにち べんきょうします。',
    yesVi: 'Vâng, hằng ngày tôi học bài.',
    no: 'いいえ、べんきょうしません。',
    noVi: 'Không, tôi không học.',
    kind: 'verb',
  },
  {
    jp: 'あさごはんを たべますか。',
    vi: 'Bạn có ăn sáng không?',
    yes: 'はい、たべます。',
    yesVi: 'Vâng, tôi có ăn.',
    no: 'いいえ、たべません。',
    noVi: 'Không, tôi không ăn.',
    kind: 'verb',
  },
  {
    jp: 'たばこを すいますか。',
    vi: 'Bạn có hút thuốc không?',
    yes: 'はい、すいます。',
    yesVi: 'Vâng, tôi có hút.',
    no: 'いいえ、すいません。',
    noVi: 'Không, tôi không hút.',
    kind: 'verb',
  },
  {
    jp: 'バイクで きますか。',
    vi: 'Bạn đi xe máy đến à?',
    yes: 'はい、バイクで きます。',
    yesVi: 'Vâng, tôi đi bằng xe máy.',
    no: 'いいえ、バスで きます。',
    noVi: 'Không, tôi đi bằng xe buýt.',
    kind: 'verb',
  },
  {
    jp: 'スポーツが すきですか。',
    vi: 'Bạn có thích thể thao không?',
    yes: 'はい、すきです。',
    yesVi: 'Vâng, tôi thích.',
    no: 'いいえ、すき じゃありません。',
    noVi: 'Không, tôi không thích.',
    kind: 'noun',
  },
  {
    jp: 'にちようびに がっこうへ いきますか。',
    vi: 'Chủ Nhật bạn có đi học không?',
    yes: 'はい、いきます。',
    yesVi: 'Vâng, tôi có đi.',
    no: 'いいえ、いきません。うちに います。',
    noVi: 'Không, tôi không đi. Tôi ở nhà.',
    kind: 'verb',
  },
];

export const YESNO_RULE = {
  title: 'Công thức trả lời câu ĐÚNG/SAI',
  yes: 'はい、＋ nhắc lại ＋ です／ます。  (hoặc gọn: はい、そうです。)',
  noNoun: 'Câu hỏi kết thúc 〜ですか (danh từ) → phủ định là 〜じゃありません',
  noVerb: 'Câu hỏi kết thúc 〜ますか (động từ) → phủ định là 〜ません',
  generic: 'Câu chối chung dùng được mọi lúc: いいえ、ちがいます。 (Không, không phải ạ.)',
  gold:
    'MẪU VÀNG 3 BƯỚC: いいえ、[phủ định]。[sự thật đúng]です。 — thêm vế thứ hai là cách ăn điểm ' +
    'dễ nhất, vì giám thị thấy bạn DỰNG được câu chứ không chỉ gật/lắc.',
};

/* ══════════════ CÂU CỨU HỘ ══════════════ */

export const RESCUE_PHRASES: { jp: string; romaji: string; vi: string; when: string }[] = [
  {
    jp: 'もういちど おねがいします。',
    romaji: 'mou ichido onegaishimasu',
    vi: 'Xin nhắc lại một lần nữa ạ.',
    when: 'Không nghe rõ câu hỏi — hỏi lại KHÔNG bị trừ điểm, đoán bừa mới mất.',
  },
  {
    jp: 'ゆっくり おねがいします。',
    romaji: 'yukkuri onegaishimasu',
    vi: 'Xin nói chậm lại ạ.',
    when: 'Giám thị nói nhanh quá.',
  },
  {
    jp: 'ちょっと まってください。',
    romaji: 'chotto matte kudasai',
    vi: 'Xin đợi tôi một chút.',
    when: 'Cần vài giây để nghĩ — tốt hơn là im lặng.',
  },
  {
    jp: 'すみません、わかりません。',
    romaji: 'sumimasen, wakarimasen',
    vi: 'Xin lỗi, tôi không hiểu ạ.',
    when: 'Bí thật sự. IM LẶNG mới là thứ mất điểm, nói câu này vẫn còn điểm thái độ.',
  },
];

/* ══════════════ KỊCH BẢN DIỄN THỬ ══════════════ */

export interface ScriptLine {
  who: 'examiner' | 'you';
  jp: string;
  vi: string;
}

export const MOCK_SCRIPT: ScriptLine[] = [
  { who: 'you', jp: 'しつれいします。', vi: 'Em xin phép ạ.' },
  { who: 'examiner', jp: 'どうぞ、すわってください。', vi: 'Mời em, ngồi xuống đi.' },
  {
    who: 'you',
    jp: 'はじめまして。{{name}} です。よろしく おねがいします。',
    vi: 'Rất vui được gặp. Em là {{name}}. Mong được giúp đỡ.',
  },
  { who: 'examiner', jp: 'おなまえは。', vi: 'Tên em là gì?' },
  { who: 'you', jp: 'わたしの なまえは {{name}} です。', vi: 'Tên em là {{name}}.' },
  { who: 'examiner', jp: 'おくには どちらですか。', vi: 'Em đến từ nước nào?' },
  { who: 'you', jp: '{{country}} です。', vi: 'Là {{country}} ạ.' },
  { who: 'examiner', jp: 'おしごとは なんですか。', vi: 'Công việc của em là gì?' },
  {
    who: 'you',
    jp: '{{job}} です。{{school}} の がくせいです。',
    vi: 'Em là {{job}}. Em là sinh viên {{school}}.',
  },
  { who: 'examiner', jp: 'かいしゃいんですか。', vi: 'Em là nhân viên công ty à?' },
  {
    who: 'you',
    jp: 'いいえ、かいしゃいん じゃありません。がくせいです。',
    vi: 'Không ạ, em không phải nhân viên công ty. Em là sinh viên.',
  },
  { who: 'examiner', jp: 'なんさいですか。', vi: 'Em bao nhiêu tuổi?' },
  { who: 'you', jp: '{{age}} です。', vi: 'Em {{age}}.' },
  { who: 'examiner', jp: 'たんじょうびは いつですか。', vi: 'Sinh nhật em khi nào?' },
  { who: 'you', jp: '{{birthday}} です。', vi: 'Là {{birthday}}.' },
  { who: 'examiner', jp: 'しゅみは なんですか。', vi: 'Sở thích của em là gì?' },
  { who: 'you', jp: 'わたしの しゅみは {{hobby}} です。', vi: 'Sở thích của em là {{hobby}}.' },
  { who: 'examiner', jp: 'まいにち なんじに おきますか。', vi: 'Hằng ngày em dậy lúc mấy giờ?' },
  { who: 'you', jp: 'まいにち {{wake}} に おきます。', vi: 'Hằng ngày em dậy lúc {{wake}}.' },
  { who: 'examiner', jp: '学校へは なんで いきますか。', vi: 'Em đến trường bằng gì?' },
  { who: 'you', jp: '{{transport}} で いきます。', vi: 'Em đi bằng {{transport}}.' },
  { who: 'examiner', jp: 'じゃ、おわりです。', vi: 'Vậy nhé, kết thúc rồi.' },
  { who: 'you', jp: 'ありがとうございました。しつれいします。', vi: 'Em xin cảm ơn ạ. Em xin phép.' },
];

export const GOLDEN_RULES = [
  'Luôn kết thúc bằng です／ます — nói はたちです chứ đừng nói cụt はたち.',
  'Chối thì phải nói thêm sự thật đúng: いいえ、〜じゃありません。〜です。',
  'KHÔNG nói さん cho chính mình — chỉ nói クオンです, không phải クオンさんです.',
  'Nghe kỹ từ để hỏi trước khi đáp: どこ (đâu) / なに (gì) / いつ (khi nào) / だれ (ai) / いくら (bao nhiêu tiền) / なんじ (mấy giờ).',
];
