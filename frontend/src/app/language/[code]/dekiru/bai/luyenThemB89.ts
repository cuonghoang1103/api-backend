/**
 * BỘ LUYỆN THÊM Bài 8 và Bài 9 (khoá できる日本語 /language/ja/dekiru) — từ DỄ → VỪA → KHÓ.
 *
 * Mỗi lesson: mở đầu bằng "Học thế nào", chia 3 mức 🟢 Dễ · 🟡 Vừa · 🔴 Khó, mọi câu có đáp án + giải thích.
 * Bài 8 (lt-b8-…): từ vựng (84 từ) · chữ Hán (父母兄弟姉妹子目口耳足長) · ngữ pháp 1 (ポイント 72, 73, 79, 80) ·
 *   ngữ pháp 2 (74, 75) · ngữ pháp 3 (76–78 + trộn) · hội thoại · đọc hiểu · nghe · nói & viết · đề tổng hợp.
 * Bài 9 (lt-b9-…): từ vựng (61 từ) · chữ Hán (泳乗習運転集描歌遊) · thể từ điển · ngữ pháp 1 (81, 82) ·
 *   ngữ pháp 2 (83, 84, 86) · ngữ pháp 3 (85, 87 + trộn) · hội thoại · đọc hiểu · nghe · nói & viết · đề tổng hợp.
 * Mọi câu, hội thoại, kịch bản nghe, bài đọc VIẾT MỚI (không chép sách/đề của cô); chữ Hán có furigana {漢字|かな};
 * romaji cho mọi câu tiếng Nhật (nhúng trong câu hỏi dạng 〔romaji〕 hoặc trường ro).
 * Vai (theo bai8.ts/bai9.ts): nữ = アンナ, パク, ワン, メアリー, 山口, 木村 (giọng ja-nu) · nam = マルコ, ダニエル, ナタポン, カルロス (ja-nam).
 * FILE SINH TỰ ĐỘNG từ bộ soạn trong scratchpad — nếu cần sửa nội dung thì sửa bản gốc rồi sinh lại.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export const LUYEN_THEM_B8: Lesson[] = [
  {
    "id": "lt-b8-tu-vung",
    "kind": "homework",
    "title": "Luyện thêm Bài 8 · Từ vựng — nhận mặt → điền câu → dịch (3 mức, ~262 câu)",
    "goal": "Nhớ chắc 84/84 từ của Bài 8 (gia đình mình / người khác, cơ thể, tính từ tả người, quà và động từ cho–nhận): nhìn từ biết nghĩa, nhớ từ từ nghĩa, điền đúng vào câu, dịch Việt → Nhật.",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đi **🟢 → 🟡 → 🔴**. Mức Dễ làm 2 lượt (Nhật → Việt, Việt → Nhật): hết 84 từ mới sang mức Vừa. Sai từ nào, **đọc to từ đó 3 lần** (romaji ở ngay trong câu hỏi) rồi làm lại cả khối sau 10 phút.",
          "Bài 8 có **hai bộ từ gọi người nhà**: của MÌNH (父・母・兄・姉・弟・妹・夫・妻) và của NGƯỜI KHÁC (お父さん・お母さん・お兄さん・お姉さん・弟さん・妹さん・ご主人・奥さん). Học theo cặp: 父 ↔ お父さん, 妻 ↔ 奥さん, 夫 ↔ ご主人.",
          "Cặp dễ lẫn: **あげます / くれます / もらいます** · **鼻 (mũi) / 花 (hoa)** · **上手 (giỏi) / 下手 (dở)** · **長い / 短い** · **先輩 / 後輩** · đếm **～人 (người)** / **～匹 (con vật)**."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhìn từ → biết nghĩa; nghe nghĩa → nhớ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-jv1",
        "title": "Nhật → Việt — nhóm A–C: gia đình mình · gia đình người khác · thú cưng, nghề, đếm (30 câu)",
        "items": [
          {
            "q": "「{両親|りょうしん}」 〔ryoushin〕 nghĩa là gì?",
            "options": [
              "vợ (của mình)",
              "con; trẻ con",
              "mẹ (của người khác)",
              "bố mẹ (của mình)"
            ],
            "correct": 3,
            "why": "**{両親|りょうしん}** (ryoushin) = bố mẹ (của mình) — nói về bố mẹ người khác: ご{両親|りょうしん}"
          },
          {
            "q": "「{父|ちち}」 〔chichi〕 nghĩa là gì?",
            "options": [
              "em trai (của mình)",
              "em gái (của mình)",
              "bố (của mình)",
              "học sinh cấp 3"
            ],
            "correct": 2,
            "why": "**{父|ちち}** (chichi) = bố (của mình) — kể với người ngoài: {父|ちち}は…"
          },
          {
            "q": "「{母|はは}」 〔haha〕 nghĩa là gì?",
            "options": [
              "mẹ (của mình)",
              "thú cưng",
              "em trai (của người khác)",
              "mẹ (của người khác)"
            ],
            "correct": 0,
            "why": "**{母|はは}** (haha) = mẹ (của mình)"
          },
          {
            "q": "「{兄弟|きょうだい}」 〔kyoudai〕 nghĩa là gì?",
            "options": [
              "anh trai (của người khác)",
              "em trai (của mình)",
              "con trai (của mình)",
              "anh chị em"
            ],
            "correct": 3,
            "why": "**{兄弟|きょうだい}** (kyoudai) = anh chị em — không tính bản thân"
          },
          {
            "q": "「{兄|あに}」 〔ani〕 nghĩa là gì?",
            "options": [
              "anh trai (của mình)",
              "con; trẻ con",
              "anh chị em",
              "~ con (đếm con vật nhỏ)"
            ],
            "correct": 0,
            "why": "**{兄|あに}** (ani) = anh trai (của mình)"
          },
          {
            "q": "「{姉|あね}」 〔ane〕 nghĩa là gì?",
            "options": [
              "anh trai (của người khác)",
              "chị gái (của mình)",
              "đàn piano",
              "mẹ (của mình)"
            ],
            "correct": 1,
            "why": "**{姉|あね}** (ane) = chị gái (của mình)"
          },
          {
            "q": "「{弟|おとうと}」 〔otouto〕 nghĩa là gì?",
            "options": [
              "con (của người khác)",
              "con gái (của mình)",
              "em trai (của mình)",
              "em gái (của người khác)"
            ],
            "correct": 2,
            "why": "**{弟|おとうと}** (otouto) = em trai (của mình)"
          },
          {
            "q": "「{妹|いもうと}」 〔imouto〕 nghĩa là gì?",
            "options": [
              "vợ (của mình)",
              "em gái (của mình)",
              "anh chị em",
              "em trai (của mình)"
            ],
            "correct": 1,
            "why": "**{妹|いもうと}** (imouto) = em gái (của mình)"
          },
          {
            "q": "「{夫|おっと}」 〔otto〕 nghĩa là gì?",
            "options": [
              "em trai (của mình)",
              "chồng (của mình)",
              "bác sĩ",
              "em trai (của người khác)"
            ],
            "correct": 1,
            "why": "**{夫|おっと}** (otto) = chồng (của mình)"
          },
          {
            "q": "「{妻|つま}」 〔tsuma〕 nghĩa là gì?",
            "options": [
              "vợ (của mình)",
              "con (của người khác)",
              "em trai (của người khác)",
              "anh trai (của mình)"
            ],
            "correct": 0,
            "why": "**{妻|つま}** (tsuma) = vợ (của mình)"
          },
          {
            "q": "「{子|こ}ども」 〔kodomo〕 nghĩa là gì?",
            "options": [
              "mẹ (của người khác)",
              "con; trẻ con",
              "bố mẹ (của mình)",
              "sống, cư trú"
            ],
            "correct": 1,
            "why": "**{子|こ}ども** (kodomo) = con; trẻ con"
          },
          {
            "q": "「{息子|むすこ}」 〔musuko〕 nghĩa là gì?",
            "options": [
              "con gái (của mình)",
              "đàn piano",
              "con trai (của mình)",
              "sống, cư trú"
            ],
            "correct": 2,
            "why": "**{息子|むすこ}** (musuko) = con trai (của mình)"
          },
          {
            "q": "「{娘|むすめ}」 〔musume〕 nghĩa là gì?",
            "options": [
              "con gái (của mình)",
              "bác sĩ",
              "bố (của mình)",
              "chị gái (của mình)"
            ],
            "correct": 0,
            "why": "**{娘|むすめ}** (musume) = con gái (của mình)"
          },
          {
            "q": "「お{父|とう}さん」 〔otousan〕 nghĩa là gì?",
            "options": [
              "~ con (đếm con vật nhỏ)",
              "mẹ (của người khác)",
              "chị gái (của mình)",
              "bố (của người khác)"
            ],
            "correct": 3,
            "why": "**お{父|とう}さん** (otousan) = bố (của người khác) — cũng là tiếng gọi \"bố ơi\" trong nhà"
          },
          {
            "q": "「お{母|かあ}さん」 〔okaasan〕 nghĩa là gì?",
            "options": [
              "em gái (của mình)",
              "em trai (của người khác)",
              "mẹ (của người khác)",
              "~ con (đếm con vật nhỏ)"
            ],
            "correct": 2,
            "why": "**お{母|かあ}さん** (okaasan) = mẹ (của người khác) — cũng là tiếng gọi \"mẹ ơi\""
          },
          {
            "q": "「お{兄|にい}さん」 〔oniisan〕 nghĩa là gì?",
            "options": [
              "anh trai (của người khác)",
              "~ người (đếm người)",
              "bác sĩ",
              "bố mẹ (của mình)"
            ],
            "correct": 0,
            "why": "**お{兄|にい}さん** (oniisan) = anh trai (của người khác)"
          },
          {
            "q": "「お{姉|ねえ}さん」 〔oneesan〕 nghĩa là gì?",
            "options": [
              "sinh viên đại học",
              "chị gái (của người khác)",
              "học sinh cấp 3",
              "chồng (của mình)"
            ],
            "correct": 1,
            "why": "**お{姉|ねえ}さん** (oneesan) = chị gái (của người khác)"
          },
          {
            "q": "「{弟|おとうと}さん」 〔otoutosan〕 nghĩa là gì?",
            "options": [
              "bác sĩ",
              "chị gái (của mình)",
              "em gái (của người khác)",
              "em trai (của người khác)"
            ],
            "correct": 3,
            "why": "**{弟|おとうと}さん** (otoutosan) = em trai (của người khác)"
          },
          {
            "q": "「{妹|いもうと}さん」 〔imoutosan〕 nghĩa là gì?",
            "options": [
              "mẹ (của người khác)",
              "con; trẻ con",
              "em gái (của người khác)",
              "em gái (của mình)"
            ],
            "correct": 2,
            "why": "**{妹|いもうと}さん** (imoutosan) = em gái (của người khác)"
          },
          {
            "q": "「お{子|こ}さん」 〔okosan〕 nghĩa là gì?",
            "options": [
              "chị gái (của mình)",
              "~ con (đếm con vật nhỏ)",
              "bố mẹ (của mình)",
              "con (của người khác)"
            ],
            "correct": 3,
            "why": "**お{子|こ}さん** (okosan) = con (của người khác)"
          },
          {
            "q": "「ペット」 〔petto〕 nghĩa là gì?",
            "options": [
              "con mèo",
              "có (người, con vật)",
              "thú cưng",
              "em gái (của người khác)"
            ],
            "correct": 2,
            "why": "**ペット** (petto) = thú cưng"
          },
          {
            "q": "「{猫|ねこ}」 〔neko〕 nghĩa là gì?",
            "options": [
              "con gái (của mình)",
              "em trai (của người khác)",
              "~ người (đếm người)",
              "con mèo"
            ],
            "correct": 3,
            "why": "**{猫|ねこ}** (neko) = con mèo"
          },
          {
            "q": "「ピアノ」 〔piano〕 nghĩa là gì?",
            "options": [
              "đàn piano",
              "con (của người khác)",
              "sinh viên đại học",
              "em trai (của người khác)"
            ],
            "correct": 0,
            "why": "**ピアノ** (piano) = đàn piano — chơi piano: ピアノを{弾|ひ}きます"
          },
          {
            "q": "「{医者|いしゃ}」 〔isha〕 nghĩa là gì?",
            "options": [
              "em gái (của mình)",
              "sống, cư trú",
              "bác sĩ",
              "vợ (của mình)"
            ],
            "correct": 2,
            "why": "**{医者|いしゃ}** (isha) = bác sĩ"
          },
          {
            "q": "「{高校生|こうこうせい}」 〔koukousei〕 nghĩa là gì?",
            "options": [
              "anh trai (của người khác)",
              "học sinh cấp 3",
              "chồng (của mình)",
              "mẹ (của mình)"
            ],
            "correct": 1,
            "why": "**{高校生|こうこうせい}** (koukousei) = học sinh cấp 3"
          },
          {
            "q": "「{大学生|だいがくせい}」 〔daigakusei〕 nghĩa là gì?",
            "options": [
              "con; trẻ con",
              "sinh viên đại học",
              "có (người, con vật)",
              "bố mẹ (của mình)"
            ],
            "correct": 1,
            "why": "**{大学生|だいがくせい}** (daigakusei) = sinh viên đại học"
          },
          {
            "q": "「～{人|にん}」 〔~nin〕 nghĩa là gì?",
            "options": [
              "~ con (đếm con vật nhỏ)",
              "~ người (đếm người)",
              "con (của người khác)",
              "học sinh cấp 3"
            ],
            "correct": 1,
            "why": "**～{人|にん}** (~nin) = ~ người (đếm người) — 1 ひとり, 2 ふたり là đặc biệt; 4 よにん"
          },
          {
            "q": "「～{匹|ひき}」 〔~hiki〕 nghĩa là gì?",
            "options": [
              "~ con (đếm con vật nhỏ)",
              "bố (của người khác)",
              "con trai (của mình)",
              "em gái (của người khác)"
            ],
            "correct": 0,
            "why": "**～{匹|ひき}** (~hiki) = ~ con (đếm con vật nhỏ) — いっぴき・にひき・さんびき・ろっぴき"
          },
          {
            "q": "「{住|す}みます」 〔sumimasu〕 nghĩa là gì?",
            "options": [
              "có (người, con vật)",
              "con; trẻ con",
              "bố (của mình)",
              "sống, cư trú"
            ],
            "correct": 3,
            "why": "**{住|す}みます** (sumimasu) = sống, cư trú — dùng dạng {住|す}んでいます; nơi ở + に"
          },
          {
            "q": "「います」 〔imasu〕 nghĩa là gì?",
            "options": [
              "con gái (của mình)",
              "sống, cư trú",
              "em trai (của người khác)",
              "có (người, con vật)"
            ],
            "correct": 3,
            "why": "**います** (imasu) = có (người, con vật) — {兄弟|きょうだい}がいます = có anh chị em"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-jv2",
        "title": "Nhật → Việt — nhóm D–F: người quanh mình · cơ thể · tính từ tả người (28 câu)",
        "items": [
          {
            "q": "「ご{主人|しゅじん}」 〔goshujin〕 nghĩa là gì?",
            "options": [
              "chồng (của người khác)",
              "tóc",
              "đàn anh, đàn chị (vào trước)",
              "dễ thương, đáng yêu"
            ],
            "correct": 0,
            "why": "**ご{主人|しゅじん}** (goshujin) = chồng (của người khác)"
          },
          {
            "q": "「{奥|おく}さん」 〔okusan〕 nghĩa là gì?",
            "options": [
              "cơ thể, sức khoẻ",
              "vợ (của người khác)",
              "mũi",
              "đàn anh, đàn chị (vào trước)"
            ],
            "correct": 1,
            "why": "**{奥|おく}さん** (okusan) = vợ (của người khác)"
          },
          {
            "q": "「{先輩|せんぱい}」 〔senpai〕 nghĩa là gì?",
            "options": [
              "tốt bụng, tử tế",
              "chăm chỉ, nghiêm túc",
              "đàn anh, đàn chị (vào trước)",
              "đen, màu đen"
            ],
            "correct": 2,
            "why": "**{先輩|せんぱい}** (senpai) = đàn anh, đàn chị (vào trước)"
          },
          {
            "q": "「{後輩|こうはい}」 〔kouhai〕 nghĩa là gì?",
            "options": [
              "khoẻ mạnh, năng động",
              "đàn em (vào sau)",
              "chồng (của người khác)",
              "cơ thể, sức khoẻ"
            ],
            "correct": 1,
            "why": "**{後輩|こうはい}** (kouhai) = đàn em (vào sau)"
          },
          {
            "q": "「うさぎ」 〔usagi〕 nghĩa là gì?",
            "options": [
              "mặt, khuôn mặt",
              "con thỏ",
              "dài",
              "đàn em (vào sau)"
            ],
            "correct": 1,
            "why": "**うさぎ** (usagi) = con thỏ"
          },
          {
            "q": "「{体|からだ}」 〔karada〕 nghĩa là gì?",
            "options": [
              "cơ thể, sức khoẻ",
              "đàn anh, đàn chị (vào trước)",
              "chân, bàn chân",
              "đẹp trai, ngầu"
            ],
            "correct": 0,
            "why": "**{体|からだ}** (karada) = cơ thể, sức khoẻ"
          },
          {
            "q": "「{足|あし}」 〔ashi〕 nghĩa là gì?",
            "options": [
              "đẹp trai, ngầu",
              "đàn anh, đàn chị (vào trước)",
              "miệng",
              "chân, bàn chân"
            ],
            "correct": 3,
            "why": "**{足|あし}** (ashi) = chân, bàn chân"
          },
          {
            "q": "「{顔|かお}」 〔kao〕 nghĩa là gì?",
            "options": [
              "chân, bàn chân",
              "dễ thương, đáng yêu",
              "mặt, khuôn mặt",
              "chăm chỉ, nghiêm túc"
            ],
            "correct": 2,
            "why": "**{顔|かお}** (kao) = mặt, khuôn mặt"
          },
          {
            "q": "「{髪|かみ}」 〔kami〕 nghĩa là gì?",
            "options": [
              "tóc",
              "miệng",
              "mũi",
              "giỏi (một kỹ năng)"
            ],
            "correct": 0,
            "why": "**{髪|かみ}** (kami) = tóc"
          },
          {
            "q": "「{口|くち}」 〔kuchi〕 nghĩa là gì?",
            "options": [
              "trắng, màu trắng",
              "kém, dở (một kỹ năng)",
              "miệng",
              "đàn anh, đàn chị (vào trước)"
            ],
            "correct": 2,
            "why": "**{口|くち}** (kuchi) = miệng"
          },
          {
            "q": "「{鼻|はな}」 〔hana〕 nghĩa là gì?",
            "options": [
              "tốt bụng, tử tế",
              "mắt",
              "tai",
              "mũi"
            ],
            "correct": 3,
            "why": "**{鼻|はな}** (hana) = mũi — cùng âm với {花|はな} \"hoa\""
          },
          {
            "q": "「{目|め}」 〔me〕 nghĩa là gì?",
            "options": [
              "dễ thương, đáng yêu",
              "mắt",
              "màu nâu",
              "tai"
            ],
            "correct": 1,
            "why": "**{目|め}** (me) = mắt"
          },
          {
            "q": "「{耳|みみ}」 〔mimi〕 nghĩa là gì?",
            "options": [
              "ngắn",
              "tai",
              "cơ thể, sức khoẻ",
              "con thỏ"
            ],
            "correct": 1,
            "why": "**{耳|みみ}** (mimi) = tai"
          },
          {
            "q": "「{頭|あたま}がいい」 〔atama ga ii〕 nghĩa là gì?",
            "options": [
              "thông minh",
              "đàn em (vào sau)",
              "hiền, dịu dàng",
              "mũi"
            ],
            "correct": 0,
            "why": "**{頭|あたま}がいい** (atama ga ii) = thông minh — nối: {頭|あたま}がよくて"
          },
          {
            "q": "「かっこいい」 〔kakkoii〕 nghĩa là gì?",
            "options": [
              "đen, màu đen",
              "đẹp trai, ngầu",
              "dễ thương, đáng yêu",
              "đàn em (vào sau)"
            ],
            "correct": 1,
            "why": "**かっこいい** (kakkoii) = đẹp trai, ngầu — nối: かっこよくて"
          },
          {
            "q": "「かわいい」 〔kawaii〕 nghĩa là gì?",
            "options": [
              "dễ thương, đáng yêu",
              "tốt bụng, tử tế",
              "giỏi (một kỹ năng)",
              "thông minh"
            ],
            "correct": 0,
            "why": "**かわいい** (kawaii) = dễ thương, đáng yêu"
          },
          {
            "q": "「{背|せ}が{高|たか}い」 〔se ga takai〕 nghĩa là gì?",
            "options": [
              "cao (dáng người)",
              "mặt, khuôn mặt",
              "tai",
              "chăm chỉ, nghiêm túc"
            ],
            "correct": 0,
            "why": "**{背|せ}が{高|たか}い** (se ga takai) = cao (dáng người)"
          },
          {
            "q": "「{長|なが}い」 〔nagai〕 nghĩa là gì?",
            "options": [
              "mắt",
              "dài",
              "tai",
              "chồng (của người khác)"
            ],
            "correct": 1,
            "why": "**{長|なが}い** (nagai) = dài"
          },
          {
            "q": "「{短|みじか}い」 〔mijikai〕 nghĩa là gì?",
            "options": [
              "miệng",
              "màu nâu",
              "ngắn",
              "đàn em (vào sau)"
            ],
            "correct": 2,
            "why": "**{短|みじか}い** (mijikai) = ngắn"
          },
          {
            "q": "「{優|やさ}しい」 〔yasashii〕 nghĩa là gì?",
            "options": [
              "màu nâu",
              "hiền, dịu dàng",
              "dễ thương, đáng yêu",
              "vợ (của người khác)"
            ],
            "correct": 1,
            "why": "**{優|やさ}しい** (yasashii) = hiền, dịu dàng"
          },
          {
            "q": "「{黒|くろ}い」 〔kuroi〕 nghĩa là gì?",
            "options": [
              "đen, màu đen",
              "dễ thương, đáng yêu",
              "con thỏ",
              "chân, bàn chân"
            ],
            "correct": 0,
            "why": "**{黒|くろ}い** (kuroi) = đen, màu đen"
          },
          {
            "q": "「{白|しろ}い」 〔shiroi〕 nghĩa là gì?",
            "options": [
              "đàn anh, đàn chị (vào trước)",
              "trắng, màu trắng",
              "chân, bàn chân",
              "giỏi (một kỹ năng)"
            ],
            "correct": 1,
            "why": "**{白|しろ}い** (shiroi) = trắng, màu trắng"
          },
          {
            "q": "「{茶色|ちゃいろ}い」 〔chairoi〕 nghĩa là gì?",
            "options": [
              "màu nâu",
              "thông minh",
              "kém, dở (một kỹ năng)",
              "cơ thể, sức khoẻ"
            ],
            "correct": 0,
            "why": "**{茶色|ちゃいろ}い** (chairoi) = màu nâu"
          },
          {
            "q": "「{元気|げんき}（な）」 〔genki (na)〕 nghĩa là gì?",
            "options": [
              "đẹp trai, ngầu",
              "thông minh",
              "ngắn",
              "khoẻ mạnh, năng động"
            ],
            "correct": 3,
            "why": "**{元気|げんき}（な）** (genki (na)) = khoẻ mạnh, năng động"
          },
          {
            "q": "「{親切|しんせつ}（な）」 〔shinsetsu (na)〕 nghĩa là gì?",
            "options": [
              "đen, màu đen",
              "mũi",
              "ngắn",
              "tốt bụng, tử tế"
            ],
            "correct": 3,
            "why": "**{親切|しんせつ}（な）** (shinsetsu (na)) = tốt bụng, tử tế"
          },
          {
            "q": "「まじめ（な）」 〔majime (na)〕 nghĩa là gì?",
            "options": [
              "đẹp trai, ngầu",
              "chăm chỉ, nghiêm túc",
              "con thỏ",
              "kém, dở (một kỹ năng)"
            ],
            "correct": 1,
            "why": "**まじめ（な）** (majime (na)) = chăm chỉ, nghiêm túc"
          },
          {
            "q": "「{上手|じょうず}（な）」 〔jouzu (na)〕 nghĩa là gì?",
            "options": [
              "màu nâu",
              "chân, bàn chân",
              "giỏi (một kỹ năng)",
              "dễ thương, đáng yêu"
            ],
            "correct": 2,
            "why": "**{上手|じょうず}（な）** (jouzu (na)) = giỏi (một kỹ năng) — thường dùng khen người khác"
          },
          {
            "q": "「{下手|へた}（な）」 〔heta (na)〕 nghĩa là gì?",
            "options": [
              "khoẻ mạnh, năng động",
              "con thỏ",
              "chăm chỉ, nghiêm túc",
              "kém, dở (một kỹ năng)"
            ],
            "correct": 3,
            "why": "**{下手|へた}（な）** (heta (na)) = kém, dở (một kỹ năng)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-jv3",
        "title": "Nhật → Việt — nhóm G–J: quà, dịp tặng · động từ cho–nhận · từ thêm (26 câu)",
        "items": [
          {
            "q": "「カード」 〔kaado〕 nghĩa là gì?",
            "options": [
              "bà (của mình)",
              "thiệp; thẻ",
              "ngày Valentine (14/2)",
              "cho, tặng (cho tôi)"
            ],
            "correct": 1,
            "why": "**カード** (kaado) = thiệp; thẻ"
          },
          {
            "q": "「{傘|かさ}」 〔kasa〕 nghĩa là gì?",
            "options": [
              "nhận",
              "cái ô, cái dù",
              "thiệp; thẻ",
              "kinh tế"
            ],
            "correct": 1,
            "why": "**{傘|かさ}** (kasa) = cái ô, cái dù"
          },
          {
            "q": "「（お）{金|かね}」 〔(o)kane〕 nghĩa là gì?",
            "options": [
              "sắp, sắp sửa",
              "tốt quá nhỉ",
              "tiền",
              "cái gì đó"
            ],
            "correct": 2,
            "why": "**（お）{金|かね}** ((o)kane) = tiền"
          },
          {
            "q": "「{靴下|くつした}」 〔kutsushita〕 nghĩa là gì?",
            "options": [
              "bà (của mình)",
              "cái gì đó",
              "tất, vớ",
              "Giáng sinh, Noel"
            ],
            "correct": 2,
            "why": "**{靴下|くつした}** (kutsushita) = tất, vớ"
          },
          {
            "q": "「{辞書|じしょ}」 〔jisho〕 nghĩa là gì?",
            "options": [
              "Giáng sinh, Noel",
              "cho, tặng (người khác)",
              "dây chuyền, vòng cổ",
              "từ điển"
            ],
            "correct": 3,
            "why": "**{辞書|じしょ}** (jisho) = từ điển"
          },
          {
            "q": "「チョコレート」 〔chokoreeto〕 nghĩa là gì?",
            "options": [
              "quyển vở",
              "kinh tế",
              "cho, tặng (cho tôi)",
              "sô-cô-la"
            ],
            "correct": 3,
            "why": "**チョコレート** (chokoreeto) = sô-cô-la"
          },
          {
            "q": "「{手紙|てがみ}」 〔tegami〕 nghĩa là gì?",
            "options": [
              "ngày Valentine (14/2)",
              "lá thư",
              "cái ô, cái dù",
              "Giáng sinh, Noel"
            ],
            "correct": 1,
            "why": "**{手紙|てがみ}** (tegami) = lá thư"
          },
          {
            "q": "「ネックレス」 〔nekkuresu〕 nghĩa là gì?",
            "options": [
              "lễ cưới, đám cưới",
              "dây chuyền, vòng cổ",
              "kinh tế",
              "bà (của mình)"
            ],
            "correct": 1,
            "why": "**ネックレス** (nekkuresu) = dây chuyền, vòng cổ"
          },
          {
            "q": "「ノート」 〔nooto〕 nghĩa là gì?",
            "options": [
              "sắp, sắp sửa",
              "quyển vở",
              "kinh tế",
              "kết hôn"
            ],
            "correct": 1,
            "why": "**ノート** (nooto) = quyển vở"
          },
          {
            "q": "「プレゼント」 〔purezento〕 nghĩa là gì?",
            "options": [
              "email, tin nhắn",
              "kinh tế",
              "cái ô, cái dù",
              "quà tặng"
            ],
            "correct": 3,
            "why": "**プレゼント** (purezento) = quà tặng"
          },
          {
            "q": "「メール」 〔meeru〕 nghĩa là gì?",
            "options": [
              "thiệp; thẻ",
              "email, tin nhắn",
              "lá thư",
              "dây chuyền, vòng cổ"
            ],
            "correct": 1,
            "why": "**メール** (meeru) = email, tin nhắn"
          },
          {
            "q": "「{祖母|そぼ}」 〔sobo〕 nghĩa là gì?",
            "options": [
              "thiệp; thẻ",
              "tất, vớ",
              "tốt quá nhỉ",
              "bà (của mình)"
            ],
            "correct": 3,
            "why": "**{祖母|そぼ}** (sobo) = bà (của mình) — bà của người khác: おばあさん"
          },
          {
            "q": "「クリスマス」 〔kurisumasu〕 nghĩa là gì?",
            "options": [
              "quyển vở",
              "ngày Valentine (14/2)",
              "kết hôn",
              "Giáng sinh, Noel"
            ],
            "correct": 3,
            "why": "**クリスマス** (kurisumasu) = Giáng sinh, Noel"
          },
          {
            "q": "「{結婚式|けっこんしき}」 〔kekkonshiki〕 nghĩa là gì?",
            "options": [
              "lễ cưới, đám cưới",
              "ngày Valentine (14/2)",
              "bà (của mình)",
              "Giáng sinh, Noel"
            ],
            "correct": 0,
            "why": "**{結婚式|けっこんしき}** (kekkonshiki) = lễ cưới, đám cưới"
          },
          {
            "q": "「バレンタインデー」 〔barentaindee〕 nghĩa là gì?",
            "options": [
              "nhận",
              "lá thư",
              "bà (của mình)",
              "ngày Valentine (14/2)"
            ],
            "correct": 3,
            "why": "**バレンタインデー** (barentaindee) = ngày Valentine (14/2)"
          },
          {
            "q": "「{何|なに}か」 〔nanika〕 nghĩa là gì?",
            "options": [
              "cái gì đó",
              "sô-cô-la",
              "cho, tặng (cho tôi)",
              "tất, vớ"
            ],
            "correct": 0,
            "why": "**{何|なに}か** (nanika) = cái gì đó"
          },
          {
            "q": "「{送|おく}ります」 〔okurimasu〕 nghĩa là gì?",
            "options": [
              "bà (của mình)",
              "gửi",
              "gọi điện thoại",
              "sô-cô-la"
            ],
            "correct": 1,
            "why": "**{送|おく}ります** (okurimasu) = gửi — nhóm 1 — thể て: {送|おく}って"
          },
          {
            "q": "「もらいます」 〔moraimasu〕 nghĩa là gì?",
            "options": [
              "nhận",
              "thiệp; thẻ",
              "Giáng sinh, Noel",
              "cho, tặng (cho tôi)"
            ],
            "correct": 0,
            "why": "**もらいます** (moraimasu) = nhận — người cho + に／から"
          },
          {
            "q": "「あげます」 〔agemasu〕 nghĩa là gì?",
            "options": [
              "dây chuyền, vòng cổ",
              "email, tin nhắn",
              "cho, tặng (người khác)",
              "đẹp, tuyệt (khen)"
            ],
            "correct": 2,
            "why": "**あげます** (agemasu) = cho, tặng (người khác) — người nhận + に; không dùng khi người nhận là tôi"
          },
          {
            "q": "「くれます」 〔kuremasu〕 nghĩa là gì?",
            "options": [
              "cho, tặng (cho tôi)",
              "quyển vở",
              "cái gì đó",
              "sắp, sắp sửa"
            ],
            "correct": 0,
            "why": "**くれます** (kuremasu) = cho, tặng (cho tôi) — người khác → tôi / người nhà tôi"
          },
          {
            "q": "「{電話|でんわ}します」 〔denwa shimasu〕 nghĩa là gì?",
            "options": [
              "tốt quá nhỉ",
              "sô-cô-la",
              "sắp, sắp sửa",
              "gọi điện thoại"
            ],
            "correct": 3,
            "why": "**{電話|でんわ}します** (denwa shimasu) = gọi điện thoại — người được gọi + に"
          },
          {
            "q": "「もうすぐ」 〔mousugu〕 nghĩa là gì?",
            "options": [
              "từ điển",
              "sắp, sắp sửa",
              "nhận",
              "cái gì đó"
            ],
            "correct": 1,
            "why": "**もうすぐ** (mousugu) = sắp, sắp sửa"
          },
          {
            "q": "「よかったですね」 〔yokatta desu ne〕 nghĩa là gì?",
            "options": [
              "tất, vớ",
              "tốt quá nhỉ",
              "kinh tế",
              "cho, tặng (người khác)"
            ],
            "correct": 1,
            "why": "**よかったですね** (yokatta desu ne) = tốt quá nhỉ — khi nghe tin vui của người khác"
          },
          {
            "q": "「{経済|けいざい}」 〔keizai〕 nghĩa là gì?",
            "options": [
              "kinh tế",
              "kết hôn",
              "quà tặng",
              "tất, vớ"
            ],
            "correct": 0,
            "why": "**{経済|けいざい}** (keizai) = kinh tế"
          },
          {
            "q": "「{結婚|けっこん}します」 〔kekkon shimasu〕 nghĩa là gì?",
            "options": [
              "kết hôn",
              "thiệp; thẻ",
              "quyển vở",
              "Giáng sinh, Noel"
            ],
            "correct": 0,
            "why": "**{結婚|けっこん}します** (kekkon shimasu) = kết hôn — đã có gia đình: {結婚|けっこん}しています"
          },
          {
            "q": "「{素敵|すてき}（な）」 〔suteki (na)〕 nghĩa là gì?",
            "options": [
              "sô-cô-la",
              "đẹp, tuyệt (khen)",
              "lá thư",
              "từ điển"
            ],
            "correct": 1,
            "why": "**{素敵|すてき}（な）** (suteki (na)) = đẹp, tuyệt (khen)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-vj1",
        "title": "Việt → Nhật — nhóm A–C: gia đình mình · gia đình người khác · thú cưng, nghề, đếm (30 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"bố mẹ (của mình)\" là từ nào?",
            "options": [
              "{兄弟|きょうだい} (kyoudai)",
              "{夫|おっと} (otto)",
              "{両親|りょうしん} (ryoushin)",
              "ピアノ (piano)"
            ],
            "correct": 2,
            "why": "**{両親|りょうしん}** (ryoushin) = bố mẹ (của mình) — nói về bố mẹ người khác: ご{両親|りょうしん}"
          },
          {
            "q": "Tiếng Nhật của \"bố (của mình)\" là từ nào?",
            "options": [
              "{妹|いもうと} (imouto)",
              "お{姉|ねえ}さん (oneesan)",
              "{父|ちち} (chichi)",
              "{姉|あね} (ane)"
            ],
            "correct": 2,
            "why": "**{父|ちち}** (chichi) = bố (của mình) — kể với người ngoài: {父|ちち}は…"
          },
          {
            "q": "Tiếng Nhật của \"mẹ (của mình)\" là từ nào?",
            "options": [
              "{妹|いもうと}さん (imoutosan)",
              "{母|はは} (haha)",
              "{姉|あね} (ane)",
              "{妻|つま} (tsuma)"
            ],
            "correct": 1,
            "why": "**{母|はは}** (haha) = mẹ (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"anh chị em\" là từ nào?",
            "options": [
              "{夫|おっと} (otto)",
              "{兄弟|きょうだい} (kyoudai)",
              "ピアノ (piano)",
              "{住|す}みます (sumimasu)"
            ],
            "correct": 1,
            "why": "**{兄弟|きょうだい}** (kyoudai) = anh chị em — không tính bản thân"
          },
          {
            "q": "Tiếng Nhật của \"anh trai (của mình)\" là từ nào?",
            "options": [
              "{両親|りょうしん} (ryoushin)",
              "ペット (petto)",
              "{兄弟|きょうだい} (kyoudai)",
              "{兄|あに} (ani)"
            ],
            "correct": 3,
            "why": "**{兄|あに}** (ani) = anh trai (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"chị gái (của mình)\" là từ nào?",
            "options": [
              "{医者|いしゃ} (isha)",
              "{父|ちち} (chichi)",
              "お{兄|にい}さん (oniisan)",
              "{姉|あね} (ane)"
            ],
            "correct": 3,
            "why": "**{姉|あね}** (ane) = chị gái (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"em trai (của mình)\" là từ nào?",
            "options": [
              "{弟|おとうと}さん (otoutosan)",
              "ペット (petto)",
              "{弟|おとうと} (otouto)",
              "{兄|あに} (ani)"
            ],
            "correct": 2,
            "why": "**{弟|おとうと}** (otouto) = em trai (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"em gái (của mình)\" là từ nào?",
            "options": [
              "お{母|かあ}さん (okaasan)",
              "{高校生|こうこうせい} (koukousei)",
              "{妹|いもうと} (imouto)",
              "{医者|いしゃ} (isha)"
            ],
            "correct": 2,
            "why": "**{妹|いもうと}** (imouto) = em gái (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"chồng (của mình)\" là từ nào?",
            "options": [
              "お{兄|にい}さん (oniisan)",
              "{猫|ねこ} (neko)",
              "{夫|おっと} (otto)",
              "{住|す}みます (sumimasu)"
            ],
            "correct": 2,
            "why": "**{夫|おっと}** (otto) = chồng (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"vợ (của mình)\" là từ nào?",
            "options": [
              "います (imasu)",
              "ピアノ (piano)",
              "{兄|あに} (ani)",
              "{妻|つま} (tsuma)"
            ],
            "correct": 3,
            "why": "**{妻|つま}** (tsuma) = vợ (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"con; trẻ con\" là từ nào?",
            "options": [
              "{父|ちち} (chichi)",
              "います (imasu)",
              "{母|はは} (haha)",
              "{子|こ}ども (kodomo)"
            ],
            "correct": 3,
            "why": "**{子|こ}ども** (kodomo) = con; trẻ con"
          },
          {
            "q": "Tiếng Nhật của \"con trai (của mình)\" là từ nào?",
            "options": [
              "～{人|にん} (~nin)",
              "{娘|むすめ} (musume)",
              "{大学生|だいがくせい} (daigakusei)",
              "{息子|むすこ} (musuko)"
            ],
            "correct": 3,
            "why": "**{息子|むすこ}** (musuko) = con trai (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"con gái (của mình)\" là từ nào?",
            "options": [
              "{母|はは} (haha)",
              "{兄弟|きょうだい} (kyoudai)",
              "{娘|むすめ} (musume)",
              "{妻|つま} (tsuma)"
            ],
            "correct": 2,
            "why": "**{娘|むすめ}** (musume) = con gái (của mình)"
          },
          {
            "q": "Tiếng Nhật của \"bố (của người khác)\" là từ nào?",
            "options": [
              "{弟|おとうと} (otouto)",
              "お{父|とう}さん (otousan)",
              "～{人|にん} (~nin)",
              "{大学生|だいがくせい} (daigakusei)"
            ],
            "correct": 1,
            "why": "**お{父|とう}さん** (otousan) = bố (của người khác) — cũng là tiếng gọi \"bố ơi\" trong nhà"
          },
          {
            "q": "Tiếng Nhật của \"mẹ (của người khác)\" là từ nào?",
            "options": [
              "ピアノ (piano)",
              "お{父|とう}さん (otousan)",
              "{弟|おとうと} (otouto)",
              "お{母|かあ}さん (okaasan)"
            ],
            "correct": 3,
            "why": "**お{母|かあ}さん** (okaasan) = mẹ (của người khác) — cũng là tiếng gọi \"mẹ ơi\""
          },
          {
            "q": "Tiếng Nhật của \"anh trai (của người khác)\" là từ nào?",
            "options": [
              "{大学生|だいがくせい} (daigakusei)",
              "{高校生|こうこうせい} (koukousei)",
              "{子|こ}ども (kodomo)",
              "お{兄|にい}さん (oniisan)"
            ],
            "correct": 3,
            "why": "**お{兄|にい}さん** (oniisan) = anh trai (của người khác)"
          },
          {
            "q": "Tiếng Nhật của \"chị gái (của người khác)\" là từ nào?",
            "options": [
              "{弟|おとうと} (otouto)",
              "～{人|にん} (~nin)",
              "お{姉|ねえ}さん (oneesan)",
              "{弟|おとうと}さん (otoutosan)"
            ],
            "correct": 2,
            "why": "**お{姉|ねえ}さん** (oneesan) = chị gái (của người khác)"
          },
          {
            "q": "Tiếng Nhật của \"em trai (của người khác)\" là từ nào?",
            "options": [
              "{弟|おとうと}さん (otoutosan)",
              "お{母|かあ}さん (okaasan)",
              "{両親|りょうしん} (ryoushin)",
              "{妻|つま} (tsuma)"
            ],
            "correct": 0,
            "why": "**{弟|おとうと}さん** (otoutosan) = em trai (của người khác)"
          },
          {
            "q": "Tiếng Nhật của \"em gái (của người khác)\" là từ nào?",
            "options": [
              "ピアノ (piano)",
              "{妹|いもうと}さん (imoutosan)",
              "{息子|むすこ} (musuko)",
              "お{姉|ねえ}さん (oneesan)"
            ],
            "correct": 1,
            "why": "**{妹|いもうと}さん** (imoutosan) = em gái (của người khác)"
          },
          {
            "q": "Tiếng Nhật của \"con (của người khác)\" là từ nào?",
            "options": [
              "{子|こ}ども (kodomo)",
              "{医者|いしゃ} (isha)",
              "ペット (petto)",
              "お{子|こ}さん (okosan)"
            ],
            "correct": 3,
            "why": "**お{子|こ}さん** (okosan) = con (của người khác)"
          },
          {
            "q": "Tiếng Nhật của \"thú cưng\" là từ nào?",
            "options": [
              "{子|こ}ども (kodomo)",
              "ペット (petto)",
              "お{姉|ねえ}さん (oneesan)",
              "{息子|むすこ} (musuko)"
            ],
            "correct": 1,
            "why": "**ペット** (petto) = thú cưng"
          },
          {
            "q": "Tiếng Nhật của \"con mèo\" là từ nào?",
            "options": [
              "～{匹|ひき} (~hiki)",
              "{猫|ねこ} (neko)",
              "お{兄|にい}さん (oniisan)",
              "お{姉|ねえ}さん (oneesan)"
            ],
            "correct": 1,
            "why": "**{猫|ねこ}** (neko) = con mèo"
          },
          {
            "q": "Tiếng Nhật của \"đàn piano\" là từ nào?",
            "options": [
              "{息子|むすこ} (musuko)",
              "ペット (petto)",
              "{子|こ}ども (kodomo)",
              "ピアノ (piano)"
            ],
            "correct": 3,
            "why": "**ピアノ** (piano) = đàn piano — chơi piano: ピアノを{弾|ひ}きます"
          },
          {
            "q": "Tiếng Nhật của \"bác sĩ\" là từ nào?",
            "options": [
              "お{兄|にい}さん (oniisan)",
              "ピアノ (piano)",
              "{医者|いしゃ} (isha)",
              "{妻|つま} (tsuma)"
            ],
            "correct": 2,
            "why": "**{医者|いしゃ}** (isha) = bác sĩ"
          },
          {
            "q": "Tiếng Nhật của \"học sinh cấp 3\" là từ nào?",
            "options": [
              "お{子|こ}さん (okosan)",
              "{姉|あね} (ane)",
              "{高校生|こうこうせい} (koukousei)",
              "{弟|おとうと} (otouto)"
            ],
            "correct": 2,
            "why": "**{高校生|こうこうせい}** (koukousei) = học sinh cấp 3"
          },
          {
            "q": "Tiếng Nhật của \"sinh viên đại học\" là từ nào?",
            "options": [
              "{弟|おとうと} (otouto)",
              "{弟|おとうと}さん (otoutosan)",
              "{夫|おっと} (otto)",
              "{大学生|だいがくせい} (daigakusei)"
            ],
            "correct": 3,
            "why": "**{大学生|だいがくせい}** (daigakusei) = sinh viên đại học"
          },
          {
            "q": "Tiếng Nhật của \"~ người (đếm người)\" là từ nào?",
            "options": [
              "{父|ちち} (chichi)",
              "{姉|あね} (ane)",
              "お{母|かあ}さん (okaasan)",
              "～{人|にん} (~nin)"
            ],
            "correct": 3,
            "why": "**～{人|にん}** (~nin) = ~ người (đếm người) — 1 ひとり, 2 ふたり là đặc biệt; 4 よにん"
          },
          {
            "q": "Tiếng Nhật của \"~ con (đếm con vật nhỏ)\" là từ nào?",
            "options": [
              "～{匹|ひき} (~hiki)",
              "{高校生|こうこうせい} (koukousei)",
              "います (imasu)",
              "～{人|にん} (~nin)"
            ],
            "correct": 0,
            "why": "**～{匹|ひき}** (~hiki) = ~ con (đếm con vật nhỏ) — いっぴき・にひき・さんびき・ろっぴき"
          },
          {
            "q": "Tiếng Nhật của \"sống, cư trú\" là từ nào?",
            "options": [
              "{弟|おとうと} (otouto)",
              "{妻|つま} (tsuma)",
              "{住|す}みます (sumimasu)",
              "{母|はは} (haha)"
            ],
            "correct": 2,
            "why": "**{住|す}みます** (sumimasu) = sống, cư trú — dùng dạng {住|す}んでいます; nơi ở + に"
          },
          {
            "q": "Tiếng Nhật của \"có (người, con vật)\" là từ nào?",
            "options": [
              "お{兄|にい}さん (oniisan)",
              "お{母|かあ}さん (okaasan)",
              "います (imasu)",
              "{高校生|こうこうせい} (koukousei)"
            ],
            "correct": 2,
            "why": "**います** (imasu) = có (người, con vật) — {兄弟|きょうだい}がいます = có anh chị em"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-vj2",
        "title": "Việt → Nhật — nhóm D–F: người quanh mình · cơ thể · tính từ tả người (28 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"chồng (của người khác)\" là từ nào?",
            "options": [
              "かわいい (kawaii)",
              "ご{主人|しゅじん} (goshujin)",
              "{下手|へた}（な） (heta (na))",
              "{親切|しんせつ}（な） (shinsetsu (na))"
            ],
            "correct": 1,
            "why": "**ご{主人|しゅじん}** (goshujin) = chồng (của người khác)"
          },
          {
            "q": "Tiếng Nhật của \"vợ (của người khác)\" là từ nào?",
            "options": [
              "{髪|かみ} (kami)",
              "{耳|みみ} (mimi)",
              "{奥|おく}さん (okusan)",
              "まじめ（な） (majime (na))"
            ],
            "correct": 2,
            "why": "**{奥|おく}さん** (okusan) = vợ (của người khác)"
          },
          {
            "q": "Tiếng Nhật của \"đàn anh, đàn chị (vào trước)\" là từ nào?",
            "options": [
              "{足|あし} (ashi)",
              "{先輩|せんぱい} (senpai)",
              "{頭|あたま}がいい (atama ga ii)",
              "ご{主人|しゅじん} (goshujin)"
            ],
            "correct": 1,
            "why": "**{先輩|せんぱい}** (senpai) = đàn anh, đàn chị (vào trước)"
          },
          {
            "q": "Tiếng Nhật của \"đàn em (vào sau)\" là từ nào?",
            "options": [
              "{黒|くろ}い (kuroi)",
              "{後輩|こうはい} (kouhai)",
              "{顔|かお} (kao)",
              "{長|なが}い (nagai)"
            ],
            "correct": 1,
            "why": "**{後輩|こうはい}** (kouhai) = đàn em (vào sau)"
          },
          {
            "q": "Tiếng Nhật của \"con thỏ\" là từ nào?",
            "options": [
              "かっこいい (kakkoii)",
              "うさぎ (usagi)",
              "{口|くち} (kuchi)",
              "{下手|へた}（な） (heta (na))"
            ],
            "correct": 1,
            "why": "**うさぎ** (usagi) = con thỏ"
          },
          {
            "q": "Tiếng Nhật của \"cơ thể, sức khoẻ\" là từ nào?",
            "options": [
              "{下手|へた}（な） (heta (na))",
              "{髪|かみ} (kami)",
              "{体|からだ} (karada)",
              "{顔|かお} (kao)"
            ],
            "correct": 2,
            "why": "**{体|からだ}** (karada) = cơ thể, sức khoẻ"
          },
          {
            "q": "Tiếng Nhật của \"chân, bàn chân\" là từ nào?",
            "options": [
              "{口|くち} (kuchi)",
              "{親切|しんせつ}（な） (shinsetsu (na))",
              "{先輩|せんぱい} (senpai)",
              "{足|あし} (ashi)"
            ],
            "correct": 3,
            "why": "**{足|あし}** (ashi) = chân, bàn chân"
          },
          {
            "q": "Tiếng Nhật của \"mặt, khuôn mặt\" là từ nào?",
            "options": [
              "{上手|じょうず}（な） (jouzu (na))",
              "{茶色|ちゃいろ}い (chairoi)",
              "かっこいい (kakkoii)",
              "{顔|かお} (kao)"
            ],
            "correct": 3,
            "why": "**{顔|かお}** (kao) = mặt, khuôn mặt"
          },
          {
            "q": "Tiếng Nhật của \"tóc\" là từ nào?",
            "options": [
              "うさぎ (usagi)",
              "{先輩|せんぱい} (senpai)",
              "{髪|かみ} (kami)",
              "{目|め} (me)"
            ],
            "correct": 2,
            "why": "**{髪|かみ}** (kami) = tóc"
          },
          {
            "q": "Tiếng Nhật của \"miệng\" là từ nào?",
            "options": [
              "かっこいい (kakkoii)",
              "まじめ（な） (majime (na))",
              "{口|くち} (kuchi)",
              "かわいい (kawaii)"
            ],
            "correct": 2,
            "why": "**{口|くち}** (kuchi) = miệng"
          },
          {
            "q": "Tiếng Nhật của \"mũi\" là từ nào?",
            "options": [
              "{目|め} (me)",
              "{背|せ}が{高|たか}い (se ga takai)",
              "{鼻|はな} (hana)",
              "うさぎ (usagi)"
            ],
            "correct": 2,
            "why": "**{鼻|はな}** (hana) = mũi — cùng âm với {花|はな} \"hoa\""
          },
          {
            "q": "Tiếng Nhật của \"mắt\" là từ nào?",
            "options": [
              "{目|め} (me)",
              "{後輩|こうはい} (kouhai)",
              "{上手|じょうず}（な） (jouzu (na))",
              "かっこいい (kakkoii)"
            ],
            "correct": 0,
            "why": "**{目|め}** (me) = mắt"
          },
          {
            "q": "Tiếng Nhật của \"tai\" là từ nào?",
            "options": [
              "{長|なが}い (nagai)",
              "{元気|げんき}（な） (genki (na))",
              "{先輩|せんぱい} (senpai)",
              "{耳|みみ} (mimi)"
            ],
            "correct": 3,
            "why": "**{耳|みみ}** (mimi) = tai"
          },
          {
            "q": "Tiếng Nhật của \"thông minh\" là từ nào?",
            "options": [
              "{頭|あたま}がいい (atama ga ii)",
              "{長|なが}い (nagai)",
              "かわいい (kawaii)",
              "{顔|かお} (kao)"
            ],
            "correct": 0,
            "why": "**{頭|あたま}がいい** (atama ga ii) = thông minh — nối: {頭|あたま}がよくて"
          },
          {
            "q": "Tiếng Nhật của \"đẹp trai, ngầu\" là từ nào?",
            "options": [
              "かっこいい (kakkoii)",
              "{白|しろ}い (shiroi)",
              "{茶色|ちゃいろ}い (chairoi)",
              "{体|からだ} (karada)"
            ],
            "correct": 0,
            "why": "**かっこいい** (kakkoii) = đẹp trai, ngầu — nối: かっこよくて"
          },
          {
            "q": "Tiếng Nhật của \"dễ thương, đáng yêu\" là từ nào?",
            "options": [
              "{上手|じょうず}（な） (jouzu (na))",
              "かわいい (kawaii)",
              "かっこいい (kakkoii)",
              "{髪|かみ} (kami)"
            ],
            "correct": 1,
            "why": "**かわいい** (kawaii) = dễ thương, đáng yêu"
          },
          {
            "q": "Tiếng Nhật của \"cao (dáng người)\" là từ nào?",
            "options": [
              "{足|あし} (ashi)",
              "{背|せ}が{高|たか}い (se ga takai)",
              "{髪|かみ} (kami)",
              "{上手|じょうず}（な） (jouzu (na))"
            ],
            "correct": 1,
            "why": "**{背|せ}が{高|たか}い** (se ga takai) = cao (dáng người)"
          },
          {
            "q": "Tiếng Nhật của \"dài\" là từ nào?",
            "options": [
              "{長|なが}い (nagai)",
              "{背|せ}が{高|たか}い (se ga takai)",
              "{優|やさ}しい (yasashii)",
              "かわいい (kawaii)"
            ],
            "correct": 0,
            "why": "**{長|なが}い** (nagai) = dài"
          },
          {
            "q": "Tiếng Nhật của \"ngắn\" là từ nào?",
            "options": [
              "{短|みじか}い (mijikai)",
              "{髪|かみ} (kami)",
              "{目|め} (me)",
              "{顔|かお} (kao)"
            ],
            "correct": 0,
            "why": "**{短|みじか}い** (mijikai) = ngắn"
          },
          {
            "q": "Tiếng Nhật của \"hiền, dịu dàng\" là từ nào?",
            "options": [
              "かっこいい (kakkoii)",
              "{優|やさ}しい (yasashii)",
              "{下手|へた}（な） (heta (na))",
              "{先輩|せんぱい} (senpai)"
            ],
            "correct": 1,
            "why": "**{優|やさ}しい** (yasashii) = hiền, dịu dàng"
          },
          {
            "q": "Tiếng Nhật của \"đen, màu đen\" là từ nào?",
            "options": [
              "{白|しろ}い (shiroi)",
              "{背|せ}が{高|たか}い (se ga takai)",
              "{足|あし} (ashi)",
              "{黒|くろ}い (kuroi)"
            ],
            "correct": 3,
            "why": "**{黒|くろ}い** (kuroi) = đen, màu đen"
          },
          {
            "q": "Tiếng Nhật của \"trắng, màu trắng\" là từ nào?",
            "options": [
              "{白|しろ}い (shiroi)",
              "{上手|じょうず}（な） (jouzu (na))",
              "{背|せ}が{高|たか}い (se ga takai)",
              "{短|みじか}い (mijikai)"
            ],
            "correct": 0,
            "why": "**{白|しろ}い** (shiroi) = trắng, màu trắng"
          },
          {
            "q": "Tiếng Nhật của \"màu nâu\" là từ nào?",
            "options": [
              "{茶色|ちゃいろ}い (chairoi)",
              "{体|からだ} (karada)",
              "{短|みじか}い (mijikai)",
              "{髪|かみ} (kami)"
            ],
            "correct": 0,
            "why": "**{茶色|ちゃいろ}い** (chairoi) = màu nâu"
          },
          {
            "q": "Tiếng Nhật của \"khoẻ mạnh, năng động\" là từ nào?",
            "options": [
              "かわいい (kawaii)",
              "{口|くち} (kuchi)",
              "{元気|げんき}（な） (genki (na))",
              "{体|からだ} (karada)"
            ],
            "correct": 2,
            "why": "**{元気|げんき}（な）** (genki (na)) = khoẻ mạnh, năng động"
          },
          {
            "q": "Tiếng Nhật của \"tốt bụng, tử tế\" là từ nào?",
            "options": [
              "まじめ（な） (majime (na))",
              "{足|あし} (ashi)",
              "{親切|しんせつ}（な） (shinsetsu (na))",
              "{短|みじか}い (mijikai)"
            ],
            "correct": 2,
            "why": "**{親切|しんせつ}（な）** (shinsetsu (na)) = tốt bụng, tử tế"
          },
          {
            "q": "Tiếng Nhật của \"chăm chỉ, nghiêm túc\" là từ nào?",
            "options": [
              "まじめ（な） (majime (na))",
              "{鼻|はな} (hana)",
              "{頭|あたま}がいい (atama ga ii)",
              "{白|しろ}い (shiroi)"
            ],
            "correct": 0,
            "why": "**まじめ（な）** (majime (na)) = chăm chỉ, nghiêm túc"
          },
          {
            "q": "Tiếng Nhật của \"giỏi (một kỹ năng)\" là từ nào?",
            "options": [
              "{耳|みみ} (mimi)",
              "{上手|じょうず}（な） (jouzu (na))",
              "{体|からだ} (karada)",
              "かわいい (kawaii)"
            ],
            "correct": 1,
            "why": "**{上手|じょうず}（な）** (jouzu (na)) = giỏi (một kỹ năng) — thường dùng khen người khác"
          },
          {
            "q": "Tiếng Nhật của \"kém, dở (một kỹ năng)\" là từ nào?",
            "options": [
              "{顔|かお} (kao)",
              "{上手|じょうず}（な） (jouzu (na))",
              "{下手|へた}（な） (heta (na))",
              "{白|しろ}い (shiroi)"
            ],
            "correct": 2,
            "why": "**{下手|へた}（な）** (heta (na)) = kém, dở (một kỹ năng)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-vj3",
        "title": "Việt → Nhật — nhóm G–J: quà, dịp tặng · động từ cho–nhận · từ thêm (26 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"thiệp; thẻ\" là từ nào?",
            "options": [
              "カード (kaado)",
              "（お）{金|かね} ((o)kane)",
              "もうすぐ (mousugu)",
              "プレゼント (purezento)"
            ],
            "correct": 0,
            "why": "**カード** (kaado) = thiệp; thẻ"
          },
          {
            "q": "Tiếng Nhật của \"cái ô, cái dù\" là từ nào?",
            "options": [
              "もらいます (moraimasu)",
              "{傘|かさ} (kasa)",
              "ネックレス (nekkuresu)",
              "{祖母|そぼ} (sobo)"
            ],
            "correct": 1,
            "why": "**{傘|かさ}** (kasa) = cái ô, cái dù"
          },
          {
            "q": "Tiếng Nhật của \"tiền\" là từ nào?",
            "options": [
              "ネックレス (nekkuresu)",
              "（お）{金|かね} ((o)kane)",
              "{結婚式|けっこんしき} (kekkonshiki)",
              "もらいます (moraimasu)"
            ],
            "correct": 1,
            "why": "**（お）{金|かね}** ((o)kane) = tiền"
          },
          {
            "q": "Tiếng Nhật của \"tất, vớ\" là từ nào?",
            "options": [
              "{靴下|くつした} (kutsushita)",
              "{結婚|けっこん}します (kekkon shimasu)",
              "バレンタインデー (barentaindee)",
              "くれます (kuremasu)"
            ],
            "correct": 0,
            "why": "**{靴下|くつした}** (kutsushita) = tất, vớ"
          },
          {
            "q": "Tiếng Nhật của \"từ điển\" là từ nào?",
            "options": [
              "チョコレート (chokoreeto)",
              "{辞書|じしょ} (jisho)",
              "カード (kaado)",
              "{何|なに}か (nanika)"
            ],
            "correct": 1,
            "why": "**{辞書|じしょ}** (jisho) = từ điển"
          },
          {
            "q": "Tiếng Nhật của \"sô-cô-la\" là từ nào?",
            "options": [
              "メール (meeru)",
              "プレゼント (purezento)",
              "{靴下|くつした} (kutsushita)",
              "チョコレート (chokoreeto)"
            ],
            "correct": 3,
            "why": "**チョコレート** (chokoreeto) = sô-cô-la"
          },
          {
            "q": "Tiếng Nhật của \"lá thư\" là từ nào?",
            "options": [
              "もうすぐ (mousugu)",
              "{結婚式|けっこんしき} (kekkonshiki)",
              "{手紙|てがみ} (tegami)",
              "くれます (kuremasu)"
            ],
            "correct": 2,
            "why": "**{手紙|てがみ}** (tegami) = lá thư"
          },
          {
            "q": "Tiếng Nhật của \"dây chuyền, vòng cổ\" là từ nào?",
            "options": [
              "{辞書|じしょ} (jisho)",
              "ネックレス (nekkuresu)",
              "クリスマス (kurisumasu)",
              "もうすぐ (mousugu)"
            ],
            "correct": 1,
            "why": "**ネックレス** (nekkuresu) = dây chuyền, vòng cổ"
          },
          {
            "q": "Tiếng Nhật của \"quyển vở\" là từ nào?",
            "options": [
              "{送|おく}ります (okurimasu)",
              "ノート (nooto)",
              "あげます (agemasu)",
              "{電話|でんわ}します (denwa shimasu)"
            ],
            "correct": 1,
            "why": "**ノート** (nooto) = quyển vở"
          },
          {
            "q": "Tiếng Nhật của \"quà tặng\" là từ nào?",
            "options": [
              "ノート (nooto)",
              "メール (meeru)",
              "{結婚|けっこん}します (kekkon shimasu)",
              "プレゼント (purezento)"
            ],
            "correct": 3,
            "why": "**プレゼント** (purezento) = quà tặng"
          },
          {
            "q": "Tiếng Nhật của \"email, tin nhắn\" là từ nào?",
            "options": [
              "メール (meeru)",
              "{祖母|そぼ} (sobo)",
              "{手紙|てがみ} (tegami)",
              "くれます (kuremasu)"
            ],
            "correct": 0,
            "why": "**メール** (meeru) = email, tin nhắn"
          },
          {
            "q": "Tiếng Nhật của \"bà (của mình)\" là từ nào?",
            "options": [
              "{送|おく}ります (okurimasu)",
              "{何|なに}か (nanika)",
              "{素敵|すてき}（な） (suteki (na))",
              "{祖母|そぼ} (sobo)"
            ],
            "correct": 3,
            "why": "**{祖母|そぼ}** (sobo) = bà (của mình) — bà của người khác: おばあさん"
          },
          {
            "q": "Tiếng Nhật của \"Giáng sinh, Noel\" là từ nào?",
            "options": [
              "もらいます (moraimasu)",
              "{送|おく}ります (okurimasu)",
              "{結婚|けっこん}します (kekkon shimasu)",
              "クリスマス (kurisumasu)"
            ],
            "correct": 3,
            "why": "**クリスマス** (kurisumasu) = Giáng sinh, Noel"
          },
          {
            "q": "Tiếng Nhật của \"lễ cưới, đám cưới\" là từ nào?",
            "options": [
              "{結婚|けっこん}します (kekkon shimasu)",
              "{結婚式|けっこんしき} (kekkonshiki)",
              "くれます (kuremasu)",
              "{電話|でんわ}します (denwa shimasu)"
            ],
            "correct": 1,
            "why": "**{結婚式|けっこんしき}** (kekkonshiki) = lễ cưới, đám cưới"
          },
          {
            "q": "Tiếng Nhật của \"ngày Valentine (14/2)\" là từ nào?",
            "options": [
              "バレンタインデー (barentaindee)",
              "{結婚|けっこん}します (kekkon shimasu)",
              "プレゼント (purezento)",
              "よかったですね (yokatta desu ne)"
            ],
            "correct": 0,
            "why": "**バレンタインデー** (barentaindee) = ngày Valentine (14/2)"
          },
          {
            "q": "Tiếng Nhật của \"cái gì đó\" là từ nào?",
            "options": [
              "{何|なに}か (nanika)",
              "メール (meeru)",
              "{経済|けいざい} (keizai)",
              "くれます (kuremasu)"
            ],
            "correct": 0,
            "why": "**{何|なに}か** (nanika) = cái gì đó"
          },
          {
            "q": "Tiếng Nhật của \"gửi\" là từ nào?",
            "options": [
              "プレゼント (purezento)",
              "よかったですね (yokatta desu ne)",
              "{送|おく}ります (okurimasu)",
              "{靴下|くつした} (kutsushita)"
            ],
            "correct": 2,
            "why": "**{送|おく}ります** (okurimasu) = gửi — nhóm 1 — thể て: {送|おく}って"
          },
          {
            "q": "Tiếng Nhật của \"nhận\" là từ nào?",
            "options": [
              "もらいます (moraimasu)",
              "メール (meeru)",
              "{靴下|くつした} (kutsushita)",
              "プレゼント (purezento)"
            ],
            "correct": 0,
            "why": "**もらいます** (moraimasu) = nhận — người cho + に／から"
          },
          {
            "q": "Tiếng Nhật của \"cho, tặng (người khác)\" là từ nào?",
            "options": [
              "（お）{金|かね} ((o)kane)",
              "あげます (agemasu)",
              "クリスマス (kurisumasu)",
              "{辞書|じしょ} (jisho)"
            ],
            "correct": 1,
            "why": "**あげます** (agemasu) = cho, tặng (người khác) — người nhận + に; không dùng khi người nhận là tôi"
          },
          {
            "q": "Tiếng Nhật của \"cho, tặng (cho tôi)\" là từ nào?",
            "options": [
              "バレンタインデー (barentaindee)",
              "{経済|けいざい} (keizai)",
              "くれます (kuremasu)",
              "{辞書|じしょ} (jisho)"
            ],
            "correct": 2,
            "why": "**くれます** (kuremasu) = cho, tặng (cho tôi) — người khác → tôi / người nhà tôi"
          },
          {
            "q": "Tiếng Nhật của \"gọi điện thoại\" là từ nào?",
            "options": [
              "もうすぐ (mousugu)",
              "{辞書|じしょ} (jisho)",
              "{祖母|そぼ} (sobo)",
              "{電話|でんわ}します (denwa shimasu)"
            ],
            "correct": 3,
            "why": "**{電話|でんわ}します** (denwa shimasu) = gọi điện thoại — người được gọi + に"
          },
          {
            "q": "Tiếng Nhật của \"sắp, sắp sửa\" là từ nào?",
            "options": [
              "もうすぐ (mousugu)",
              "{辞書|じしょ} (jisho)",
              "もらいます (moraimasu)",
              "ノート (nooto)"
            ],
            "correct": 0,
            "why": "**もうすぐ** (mousugu) = sắp, sắp sửa"
          },
          {
            "q": "Tiếng Nhật của \"tốt quá nhỉ\" là từ nào?",
            "options": [
              "カード (kaado)",
              "{傘|かさ} (kasa)",
              "{経済|けいざい} (keizai)",
              "よかったですね (yokatta desu ne)"
            ],
            "correct": 3,
            "why": "**よかったですね** (yokatta desu ne) = tốt quá nhỉ — khi nghe tin vui của người khác"
          },
          {
            "q": "Tiếng Nhật của \"kinh tế\" là từ nào?",
            "options": [
              "もらいます (moraimasu)",
              "{経済|けいざい} (keizai)",
              "ネックレス (nekkuresu)",
              "よかったですね (yokatta desu ne)"
            ],
            "correct": 1,
            "why": "**{経済|けいざい}** (keizai) = kinh tế"
          },
          {
            "q": "Tiếng Nhật của \"kết hôn\" là từ nào?",
            "options": [
              "{結婚|けっこん}します (kekkon shimasu)",
              "{電話|でんわ}します (denwa shimasu)",
              "メール (meeru)",
              "{手紙|てがみ} (tegami)"
            ],
            "correct": 0,
            "why": "**{結婚|けっこん}します** (kekkon shimasu) = kết hôn — đã có gia đình: {結婚|けっこん}しています"
          },
          {
            "q": "Tiếng Nhật của \"đẹp, tuyệt (khen)\" là từ nào?",
            "options": [
              "{経済|けいざい} (keizai)",
              "プレゼント (purezento)",
              "チョコレート (chokoreeto)",
              "{素敵|すてき}（な） (suteki (na))"
            ],
            "correct": 3,
            "why": "**{素敵|すてき}（な）** (suteki (na)) = đẹp, tuyệt (khen)"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · khác loại · điền từ vào câu · gõ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-khac-loai",
        "title": "Từ nào KHÁC loại? (10 câu)",
        "items": [
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (người nhà MÌNH)",
            "options": [
              "お{姉|ねえ}さん (Oneesan)",
              "{兄|あに} (Ani)",
              "{父|ちち} (Chichi)",
              "{母|はは} (Haha)"
            ],
            "correct": 0,
            "why": "Ba từ kia gọi người nhà mình; **お姉さん** là chị gái của người khác."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (người nhà NGƯỜI KHÁC)",
            "options": [
              "お{父|とう}さん (Otousan)",
              "ご{主人|しゅじん} (Goshujin)",
              "{妹|いもうと} (Imouto)",
              "{奥|おく}さん (Okusan)"
            ],
            "correct": 2,
            "why": "Ba từ kia nói về gia đình người khác; **妹** là em gái của mình."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (bộ phận cơ thể)",
            "options": [
              "{耳|みみ} (Mimi)",
              "{目|め} (Me)",
              "{傘|かさ} (Kasa)",
              "{鼻|はな} (Hana)"
            ],
            "correct": 2,
            "why": "Ba từ kia là bộ phận cơ thể; **傘** là cái ô."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (tính từ đuôi い)",
            "options": [
              "{黒|くろ}い (Kuroi)",
              "{親切|しんせつ} (Shinsetsu)",
              "{長|なが}い (Nagai)",
              "かわいい (Kawaii)"
            ],
            "correct": 1,
            "why": "Ba từ kia là tính từ い; **親切** là tính từ な (親切な人)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (tính từ đuôi な)",
            "options": [
              "{上手|じょうず} (Jouzu)",
              "{優|やさ}しい (Yasashii)",
              "{元気|げんき} (Genki)",
              "まじめ (Majime)"
            ],
            "correct": 1,
            "why": "Ba từ kia là tính từ な; **優しい** là tính từ い."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (đồ làm quà)",
            "options": [
              "ネックレス (Nekkuresu)",
              "{後輩|こうはい} (Kouhai)",
              "チョコレート (Chokoreeto)",
              "{靴下|くつした} (Kutsushita)"
            ],
            "correct": 1,
            "why": "Ba từ kia là đồ vật để tặng; **後輩** là người (đàn em)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (dịp, ngày lễ)",
            "options": [
              "クリスマス (Kurisumasu)",
              "{経済|けいざい} (Keizai)",
              "バレンタインデー (Barentaindee)",
              "{結婚式|けっこんしき} (Kekkonshiki)"
            ],
            "correct": 1,
            "why": "Ba từ kia là dịp tặng quà; **経済** là kinh tế."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (con vật)",
            "options": [
              "{犬|いぬ} (Inu)",
              "うさぎ (Usagi)",
              "{猫|ねこ} (Neko)",
              "ピアノ (Piano)"
            ],
            "correct": 3,
            "why": "Ba từ kia là con vật; **ピアノ** là đàn piano."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (màu sắc)",
            "options": [
              "{短|みじか}い (Mijikai)",
              "{黒|くろ}い (Kuroi)",
              "{白|しろ}い (Shiroi)",
              "{茶色|ちゃいろ}い (Chairoi)"
            ],
            "correct": 0,
            "why": "Ba từ kia là màu; **短い** là ngắn."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (người ở trường / công ty)",
            "options": [
              "{先輩|せんぱい} (Senpai)",
              "{大学生|だいがくせい} (Daigakusei)",
              "{後輩|こうはい} (Kouhai)",
              "{手紙|てがみ} (Tegami)"
            ],
            "correct": 3,
            "why": "Ba từ kia là người; **手紙** là lá thư."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-dien-cau",
        "title": "Điền từ vào câu — có nghĩa tiếng Việt kèm theo (25 câu)",
        "items": [
          {
            "q": "{私|わたし}は＿＿が{二人|ふたり}います。　〔Watashi wa __ ga futari imasu.〕　— Tôi có hai em gái.",
            "options": [
              "{奥|おく}さん",
              "{妹|いもうと}さん",
              "{妹|いもうと}",
              "お{姉|ねえ}さん"
            ],
            "correct": 2,
            "why": "Kể người nhà MÌNH → 妹 (không thêm さん). → **{私|わたし}は{妹|いもうと}が{二人|ふたり}います。** 〔Watashi wa imouto ga futari imasu.〕 — Tôi có hai em gái."
          },
          {
            "q": "＿＿は{病院|びょういん}で{働|はたら}いています。　〔__ wa byouin de hataraite imasu.〕　— Bố tôi làm việc ở bệnh viện.",
            "options": [
              "{父|ちち}",
              "お{父|とう}さん",
              "ご{主人|しゅじん}",
              "{奥|おく}さん"
            ],
            "correct": 0,
            "why": "Bố của MÌNH → 父. → **{父|ちち}は{病院|びょういん}で{働|はたら}いています。** 〔Chichi wa byouin de hataraite imasu.〕 — Bố tôi làm việc ở bệnh viện."
          },
          {
            "q": "{兄|あに}は＿＿で、{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。　〔Ani wa __ de, daigaku de keizai o benkyou shite imasu.〕　— Anh tôi là sinh viên, đang học kinh tế ở đại học.",
            "options": [
              "ペット",
              "{高校生|こうこうせい}",
              "{医者|いしゃ}",
              "{大学生|だいがくせい}"
            ],
            "correct": 3,
            "why": "大学で勉強しています → 大学生. → **{兄|あに}は{大学生|だいがくせい}で、{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。** 〔Ani wa daigakusei de, daigaku de keizai o benkyou shite imasu.〕 — Anh tôi là sinh viên, đang học kinh tế ở đại học."
          },
          {
            "q": "うさぎは＿＿が{長|なが}いです。　〔Usagi wa __ ga nagai desu.〕　— Con thỏ tai dài.",
            "options": [
              "{口|くち}",
              "{耳|みみ}",
              "{目|め}",
              "{鼻|はな}"
            ],
            "correct": 1,
            "why": "耳 = tai. → **うさぎは{耳|みみ}が{長|なが}いです。** 〔Usagi wa mimi ga nagai desu.〕 — Con thỏ tai dài."
          },
          {
            "q": "ナタポンさんは＿＿が{高|たか}いです。　〔Natapon-san wa __ ga takai desu.〕　— Natapon cao.",
            "options": [
              "{顔|かお}",
              "{頭|あたま}",
              "{背|せ}",
              "{髪|かみ}"
            ],
            "correct": 2,
            "why": "Người cao = 背が高い. → **ナタポンさんは{背|せ}が{高|たか}いです。** 〔Natapon-san wa se ga takai desu.〕 — Natapon cao."
          },
          {
            "q": "{妹|いもうと}は{髪|かみ}が＿＿です。　〔Imouto wa kami ga __ desu.〕　— Em gái tôi tóc dài.",
            "options": [
              "{元気|げんき}",
              "{高|たか}い",
              "{上手|じょうず}",
              "{長|なが}い"
            ],
            "correct": 3,
            "why": "Tóc dài = 髪が長い. → **{妹|いもうと}は{髪|かみ}が{長|なが}いです。** 〔Imouto wa kami ga nagai desu.〕 — Em gái tôi tóc dài."
          },
          {
            "q": "アンナさんはピアノが＿＿です。　〔Anna-san wa piano ga __ desu.〕　— Anna chơi piano giỏi.",
            "options": [
              "{優|やさ}しい",
              "{上手|じょうず}",
              "{長|なが}い",
              "{黒|くろ}い"
            ],
            "correct": 1,
            "why": "Kỹ năng giỏi → 上手. → **アンナさんはピアノが{上手|じょうず}です。** 〔Anna-san wa piano ga jouzu desu.〕 — Anna chơi piano giỏi."
          },
          {
            "q": "{私|わたし}は{歌|うた}が＿＿です。　〔Watashi wa uta ga __ desu.〕　— Tôi hát dở.",
            "options": [
              "{白|しろ}い",
              "{下手|へた}",
              "{親切|しんせつ}",
              "かわいい"
            ],
            "correct": 1,
            "why": "Kỹ năng kém → 下手. → **{私|わたし}は{歌|うた}が{下手|へた}です。** 〔Watashi wa uta ga heta desu.〕 — Tôi hát dở."
          },
          {
            "q": "{母|はは}は{優|やさ}しくて、＿＿な{人|ひと}です。　〔Haha wa yasashikute, __ na hito desu.〕　— Mẹ tôi là người hiền và tốt bụng.",
            "options": [
              "{親切|しんせつ}",
              "{経済|けいざい}",
              "{結婚式|けっこんしき}",
              "{下手|へた}"
            ],
            "correct": 0,
            "why": "Tính từ な tả người tốt → 親切な人. → **{母|はは}は{優|やさ}しくて、{親切|しんせつ}な{人|ひと}です。** 〔Haha wa yasashikute, shinsetsu na hito desu.〕 — Mẹ tôi là người hiền và tốt bụng."
          },
          {
            "q": "{誕生日|たんじょうび}に{友達|ともだち}に＿＿を{送|おく}りました。　〔Tanjoubi ni tomodachi ni __ o okurimashita.〕　— Tôi đã gửi thiệp cho bạn vào ngày sinh nhật.",
            "options": [
              "{経済|けいざい}",
              "カード",
              "{体|からだ}",
              "{後輩|こうはい}"
            ],
            "correct": 1,
            "why": "Gửi thiệp = カードを送ります. → **{誕生日|たんじょうび}に{友達|ともだち}にカードを{送|おく}りました。** 〔Tanjoubi ni tomodachi ni kaado o okurimashita.〕 — Tôi đã gửi thiệp cho bạn vào ngày sinh nhật."
          },
          {
            "q": "{雨|あめ}ですから、＿＿を{持|も}って{行|い}きます。　〔Ame desu kara, __ o motte ikimasu.〕　— Vì trời mưa nên tôi mang ô đi.",
            "options": [
              "{靴下|くつした}",
              "ノート",
              "{傘|かさ}",
              "ネックレス"
            ],
            "correct": 2,
            "why": "Trời mưa → mang ô (傘). → **{雨|あめ}ですから、{傘|かさ}を{持|も}って{行|い}きます。** 〔Ame desu kara, kasa o motte ikimasu.〕 — Vì trời mưa nên tôi mang ô đi."
          },
          {
            "q": "バレンタインデーに{恋人|こいびと}に＿＿をあげました。　〔Barentaindee ni koibito ni __ o agemashita.〕　— Ngày Valentine tôi tặng người yêu sô-cô-la.",
            "options": [
              "チョコレート",
              "{医者|いしゃ}",
              "{両親|りょうしん}",
              "{鼻|はな}"
            ],
            "correct": 0,
            "why": "Quà Valentine → チョコレート. → **バレンタインデーに{恋人|こいびと}にチョコレートをあげました。** 〔Barentaindee ni koibito ni chokoreeto o agemashita.〕 — Ngày Valentine tôi tặng người yêu sô-cô-la."
          },
          {
            "q": "{日本語|にほんご}の＿＿を{買|か}いました。{毎日|まいにち}{使|つか}っています。　〔Nihongo no __ o kaimashita. Mainichi tsukatte imasu.〕　— Tôi đã mua từ điển tiếng Nhật. Ngày nào tôi cũng dùng.",
            "options": [
              "{辞書|じしょ}",
              "うさぎ",
              "{靴下|くつした}",
              "{結婚式|けっこんしき}"
            ],
            "correct": 0,
            "why": "辞書 = từ điển. → **{日本語|にほんご}の{辞書|じしょ}を{買|か}いました。{毎日|まいにち}{使|つか}っています。** 〔Nihongo no jisho o kaimashita. Mainichi tsukatte imasu.〕 — Tôi đã mua từ điển tiếng Nhật. Ngày nào tôi cũng dùng."
          },
          {
            "q": "{姉|あね}は{来月|らいげつ}＿＿します。{結婚式|けっこんしき}は{京都|きょうと}でします。　〔Ane wa raigetsu __ shimasu. Kekkonshiki wa Kyouto de shimasu.〕　— Tháng sau chị tôi kết hôn. Lễ cưới tổ chức ở Kyoto.",
            "options": [
              "{勉強|べんきょう}",
              "{経済|けいざい}",
              "{電話|でんわ}",
              "{結婚|けっこん}"
            ],
            "correct": 3,
            "why": "Có 結婚式 (lễ cưới) → 結婚します. → **{姉|あね}は{来月|らいげつ}{結婚|けっこん}します。{結婚式|けっこんしき}は{京都|きょうと}でします。** 〔Ane wa raigetsu kekkon shimasu. Kekkonshiki wa Kyouto de shimasu.〕 — Tháng sau chị tôi kết hôn. Lễ cưới tổ chức ở Kyoto."
          },
          {
            "q": "＿＿クリスマスですね。{何|なに}かプレゼントをあげますか。　〔__ Kurisumasu desu ne. Nanika purezento o agemasu ka.〕　— Sắp Giáng sinh rồi nhỉ. Bạn có tặng quà gì không?",
            "options": [
              "いちばん",
              "{何|なに}か",
              "もうすぐ",
              "よかったですね"
            ],
            "correct": 2,
            "why": "もうすぐ = sắp. → **もうすぐクリスマスですね。{何|なに}かプレゼントをあげますか。** 〔Mousugu Kurisumasu desu ne. Nanika purezento o agemasu ka.〕 — Sắp Giáng sinh rồi nhỉ. Bạn có tặng quà gì không?"
          },
          {
            "q": "A：{大学|だいがく}に{入|はい}りました。B：それは＿＿。　〔A: daigaku ni hairimashita. B: sore wa __.〕　— A: Tôi đã vào đại học. B: Thế thì tốt quá nhỉ.",
            "options": [
              "もうすぐです",
              "よかったですね",
              "ざんねんですね",
              "{何|なに}かです"
            ],
            "correct": 1,
            "why": "Nghe tin vui → よかったですね. → **A：{大学|だいがく}に{入|はい}りました。B：それはよかったですね。** 〔A: daigaku ni hairimashita. B: sore wa yokatta desu ne.〕 — A: Tôi đã vào đại học. B: Thế thì tốt quá nhỉ."
          },
          {
            "q": "{私|わたし}は{東京|とうきょう}に＿＿います。　〔Watashi wa Toukyou ni __ imasu.〕　— Tôi đang sống ở Tokyo.",
            "options": [
              "くれて",
              "{送|おく}って",
              "{住|す}んで",
              "もらって"
            ],
            "correct": 2,
            "why": "Nơi ở + に + 住んでいます. → **{私|わたし}は{東京|とうきょう}に{住|す}んでいます。** 〔Watashi wa Toukyou ni sunde imasu.〕 — Tôi đang sống ở Tokyo."
          },
          {
            "q": "{毎週|まいしゅう}{日曜日|にちようび}、{両親|りょうしん}に＿＿。　〔Maishuu nichiyoubi, ryoushin ni __.〕　— Chủ nhật hàng tuần tôi gọi điện cho bố mẹ.",
            "options": [
              "{住|す}みます",
              "{電話|でんわ}します",
              "くれます",
              "もらいます"
            ],
            "correct": 1,
            "why": "Người được gọi + に + 電話します. → **{毎週|まいしゅう}{日曜日|にちようび}、{両親|りょうしん}に{電話|でんわ}します。** 〔Maishuu nichiyoubi, ryoushin ni denwa shimasu.〕 — Chủ nhật hàng tuần tôi gọi điện cho bố mẹ."
          },
          {
            "q": "{猫|ねこ}が＿＿います。　〔Neko ga __ imasu.〕　— Có ba con mèo.",
            "options": [
              "{三枚|さんまい}",
              "{三匹|さんびき}",
              "{三|みっ}つ",
              "{三人|さんにん}"
            ],
            "correct": 1,
            "why": "Con vật nhỏ đếm bằng 匹: 三匹 = さんびき. → **{猫|ねこ}が{三匹|さんびき}います。** 〔Neko ga sanbiki imasu.〕 — Có ba con mèo."
          },
          {
            "q": "{家族|かぞく}は＿＿です。{父|ちち}と{母|はは}と{私|わたし}です。　〔Kazoku wa __ desu. Chichi to haha to watashi desu.〕　— Nhà tôi ba người: bố, mẹ và tôi.",
            "options": [
              "{三|みっ}つ",
              "{三人|さんにん}",
              "{三匹|さんびき}",
              "{三枚|さんまい}"
            ],
            "correct": 1,
            "why": "Người đếm bằng 人. → **{家族|かぞく}は{三人|さんにん}です。{父|ちち}と{母|はは}と{私|わたし}です。** 〔Kazoku wa sannin desu. Chichi to haha to watashi desu.〕 — Nhà tôi ba người: bố, mẹ và tôi."
          },
          {
            "q": "{山田|やまだ}さんの＿＿は{高校|こうこう}の{先生|せんせい}です。　〔Yamada-san no __ wa koukou no sensei desu.〕　— Vợ của anh Yamada là giáo viên cấp 3.",
            "options": [
              "{夫|おっと}",
              "{母|はは}",
              "{奥|おく}さん",
              "{妻|つま}"
            ],
            "correct": 2,
            "why": "Vợ của NGƯỜI KHÁC → 奥さん (妻 = vợ mình). → **{山田|やまだ}さんの{奥|おく}さんは{高校|こうこう}の{先生|せんせい}です。** 〔Yamada-san no okusan wa koukou no sensei desu.〕 — Vợ của anh Yamada là giáo viên cấp 3."
          },
          {
            "q": "{私|わたし}の＿＿は{銀行|ぎんこう}で{働|はたら}いています。　〔Watashi no __ wa ginkou de hataraite imasu.〕　— Chồng tôi làm việc ở ngân hàng.",
            "options": [
              "ご{主人|しゅじん}",
              "{奥|おく}さん",
              "お{子|こ}さん",
              "{夫|おっと}"
            ],
            "correct": 3,
            "why": "Chồng của MÌNH → 夫 (ご主人 = chồng người khác). → **{私|わたし}の{夫|おっと}は{銀行|ぎんこう}で{働|はたら}いています。** 〔Watashi no otto wa ginkou de hataraite imasu.〕 — Chồng tôi làm việc ở ngân hàng."
          },
          {
            "q": "{会社|かいしゃ}の＿＿に{仕事|しごと}を{教|おし}えます。　〔Kaisha no __ ni shigoto o oshiemasu.〕　— Tôi dạy việc cho đàn em ở công ty.",
            "options": [
              "{経済|けいざい}",
              "{靴下|くつした}",
              "{後輩|こうはい}",
              "{先輩|せんぱい}"
            ],
            "correct": 2,
            "why": "Dạy việc cho người vào SAU → 後輩. → **{会社|かいしゃ}の{後輩|こうはい}に{仕事|しごと}を{教|おし}えます。** 〔Kaisha no kouhai ni shigoto o oshiemasu.〕 — Tôi dạy việc cho đàn em ở công ty."
          },
          {
            "q": "このネックレス、＿＿ですね。——ありがとうございます。　〔Kono nekkuresu, __ desu ne. — Arigatou gozaimasu.〕　— Sợi dây chuyền này đẹp nhỉ. — Cảm ơn.",
            "options": [
              "{素敵|すてき}",
              "まじめ",
              "{元気|げんき}",
              "{下手|へた}"
            ],
            "correct": 0,
            "why": "Khen đồ đẹp → 素敵. → **このネックレス、{素敵|すてき}ですね。——ありがとうございます。** 〔Kono nekkuresu, suteki desu ne. — Arigatou gozaimasu.〕 — Sợi dây chuyền này đẹp nhỉ. — Cảm ơn."
          },
          {
            "q": "{犬|いぬ}は{白|しろ}くて、{猫|ねこ}は＿＿です。　〔Inu wa shirokute, neko wa __ desu.〕　— Con chó màu trắng, con mèo màu đen.",
            "options": [
              "{長|なが}い",
              "{黒|くろ}い",
              "かっこいい",
              "{優|やさ}しい"
            ],
            "correct": 1,
            "why": "黒い = đen. → **{犬|いぬ}は{白|しろ}くて、{猫|ねこ}は{黒|くろ}いです。** 〔Inu wa shirokute, neko wa kuroi desu.〕 — Con chó màu trắng, con mèo màu đen."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-tv-go-tu",
        "title": "Gõ từ tiếng Nhật theo nghĩa (24 câu)",
        "kind": "translate",
        "items": [
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"con mèo\"",
            "answers": [
              "猫",
              "ねこ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tai\"",
            "answers": [
              "耳",
              "みみ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"mắt\"",
            "answers": [
              "目",
              "め"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"miệng\"",
            "answers": [
              "口",
              "くち"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"chân\"",
            "answers": [
              "足",
              "あし"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tóc\"",
            "answers": [
              "髪",
              "かみ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"mặt, khuôn mặt\"",
            "answers": [
              "顔",
              "かお"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cái ô\"",
            "answers": [
              "傘",
              "かさ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"từ điển\"",
            "answers": [
              "辞書",
              "じしょ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"lá thư\"",
            "answers": [
              "手紙",
              "てがみ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tất, vớ\"",
            "answers": [
              "靴下",
              "くつした"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tiền\"",
            "answers": [
              "お金",
              "おかね",
              "金",
              "かね"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bố (của mình)\"",
            "answers": [
              "父",
              "ちち"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"mẹ (của mình)\"",
            "answers": [
              "母",
              "はは"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"anh trai (của mình)\"",
            "answers": [
              "兄",
              "あに"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"em gái (của mình)\"",
            "answers": [
              "妹",
              "いもうと"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bác sĩ\"",
            "answers": [
              "医者",
              "いしゃ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"kinh tế\"",
            "answers": [
              "経済",
              "けいざい"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"quà tặng\"",
            "answers": [
              "プレゼント"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"sắp, sắp sửa\"",
            "answers": [
              "もうすぐ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đàn anh, đàn chị\"",
            "answers": [
              "先輩",
              "せんぱい"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"dài\"",
            "answers": [
              "長い",
              "ながい"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"ngắn\"",
            "answers": [
              "短い",
              "みじかい"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"con thỏ\"",
            "answers": [
              "うさぎ",
              "ウサギ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · tìm câu SAI · đọc câu · dịch · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-sai",
        "title": "Tìm câu SAI (7 câu)",
        "items": [
          {
            "q": "(mẹ mình / mẹ người khác)　Câu nào SAI khi kể với cô giáo về mẹ của mình?",
            "options": [
              "{山田|やまだ}さんのお{母|かあ}さんも{先生|せんせい}です。 (Yamada-san no okaasan mo sensei desu.)",
              "{私|わたし}の{母|はは}は{先生|せんせい}です。 (Watashi no haha wa sensei desu.)",
              "{母|はは}は{先生|せんせい}です。 (Haha wa sensei desu.)",
              "{私|わたし}のお{母|かあ}さんは{先生|せんせい}です。 (Watashi no okaasan wa sensei desu.)"
            ],
            "correct": 3,
            "why": "Kể về mẹ MÌNH với người ngoài → **母**; お母さん dùng cho mẹ người khác (hoặc gọi mẹ ở nhà)."
          },
          {
            "q": "(います／あります)　Câu nào SAI?",
            "options": [
              "{辞書|じしょ}があります。 (Jisho ga arimasu.)",
              "{私|わたし}は{妹|いもうと}が{一人|ひとり}あります。 (Watashi wa imouto ga hitori arimasu.)",
              "{猫|ねこ}が{二匹|にひき}います。 (Neko ga nihiki imasu.)",
              "{私|わたし}は{妹|いもうと}が{一人|ひとり}います。 (Watashi wa imouto ga hitori imasu.)"
            ],
            "correct": 1,
            "why": "Người, con vật → **います**; đồ vật → あります."
          },
          {
            "q": "(đếm người)　Câu nào SAI?",
            "options": [
              "{子|こ}どもが{二人|ふたり}います。 (Kodomo ga futari imasu.)",
              "{兄弟|きょうだい}が{四人|よんにん}います。 (Kyoudai ga yonnin imasu.)",
              "{兄弟|きょうだい}が{四人|よにん}います。 (Kyoudai ga yonin imasu.)",
              "{猫|ねこ}が{一匹|いっぴき}います。 (Neko ga ippiki imasu.)"
            ],
            "correct": 1,
            "why": "4 người đọc **よにん** (không phải よんにん)."
          },
          {
            "q": "(tả người)　Câu nào SAI về nghĩa?",
            "options": [
              "うさぎは{耳|みみ}が{長|なが}いです。 (Usagi wa mimi ga nagai desu.)",
              "{父|ちち}は{背|せ}が{高|たか}いです。 (Chichi wa se ga takai desu.)",
              "{姉|あね}は{髪|かみ}が{短|みじか}いです。 (Ane wa kami ga mijikai desu.)",
              "{父|ちち}は{高|たか}いです。 (Chichi wa takai desu.)"
            ],
            "correct": 3,
            "why": "「父は高いです」 nghe như \"bố tôi ĐẮT\". Người cao phải nói **背が高い**."
          },
          {
            "q": "(cho – nhận)　Câu nào SAI?",
            "options": [
              "{私|わたし}は{友達|ともだち}に{本|ほん}をくれました。 (Watashi wa tomodachi ni hon o kuremashita.)",
              "{友達|ともだち}が{私|わたし}に{本|ほん}をくれました。 (Tomodachi ga watashi ni hon o kuremashita.)",
              "{私|わたし}は{友達|ともだち}に{本|ほん}をあげました。 (Watashi wa tomodachi ni hon o agemashita.)",
              "{私|わたし}は{友達|ともだち}に{本|ほん}をもらいました。 (Watashi wa tomodachi ni hon o moraimashita.)"
            ],
            "correct": 0,
            "why": "くれます = người khác cho TÔI; \"tôi cho bạn\" phải là **あげました**."
          },
          {
            "q": "(sống ở)　Câu nào SAI?",
            "options": [
              "{兄|あに}は{大阪|おおさか}に{住|す}んでいます。 (Ani wa Oosaka ni sunde imasu.)",
              "{兄|あに}は{大阪|おおさか}で{住|す}んでいます。 (Ani wa Oosaka de sunde imasu.)",
              "{兄|あに}は{大阪|おおさか}にいます。 (Ani wa Oosaka ni imasu.)",
              "{兄|あに}は{大阪|おおさか}で{働|はたら}いています。 (Ani wa Oosaka de hataraite imasu.)"
            ],
            "correct": 1,
            "why": "住んでいます đi với **に** (nơi ở); で dùng cho nơi làm việc (働いています)."
          },
          {
            "q": "(chồng / vợ)　Câu nào SAI?",
            "options": [
              "{田中|たなか}さんのご{主人|しゅじん}は{医者|いしゃ}です。 (Tanaka-san no goshujin wa isha desu.)",
              "{私|わたし}の{夫|おっと}は{医者|いしゃ}です。 (Watashi no otto wa isha desu.)",
              "{田中|たなか}さんの{奥|おく}さんは{先生|せんせい}です。 (Tanaka-san no okusan wa sensei desu.)",
              "{私|わたし}のご{主人|しゅじん}は{医者|いしゃ}です。 (Watashi no goshujin wa isha desu.)"
            ],
            "correct": 3,
            "why": "Chồng MÌNH → **夫**; ご主人 chỉ dùng cho chồng người khác."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-tv-nhat-viet",
        "title": "Đọc câu Nhật → chọn nghĩa Việt (8 câu)",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {妹|いもうと}さんはかわいいですね。　〔Imouto-san wa kawaii desu ne.〕",
            "options": [
              "Em gái bạn dễ thương nhỉ.",
              "Em gái tôi dễ thương lắm.",
              "Con gái bạn dễ thương nhỉ.",
              "Chị gái bạn đẹp nhỉ."
            ],
            "correct": 0,
            "why": "妹さん = em gái của người khác; かわいい = dễ thương."
          },
          {
            "q": "Câu này nghĩa là gì? {兄|あに}は{頭|あたま}がいいです。　〔Ani wa atama ga ii desu.〕",
            "options": [
              "Anh trai tôi thông minh.",
              "Anh trai bạn thông minh.",
              "Anh trai tôi tóc đẹp.",
              "Anh trai tôi bị đau đầu."
            ],
            "correct": 0,
            "why": "兄 = anh trai mình; 頭がいい = thông minh."
          },
          {
            "q": "Câu này nghĩa là gì? {祖母|そぼ}に{手紙|てがみ}を{送|おく}りました。　〔Sobo ni tegami o okurimashita.〕",
            "options": [
              "Tôi đã gửi thiệp cho mẹ.",
              "Bà đã gửi thư cho tôi.",
              "Tôi đã gửi thư cho bà.",
              "Tôi đã nhận thư của bà."
            ],
            "correct": 2,
            "why": "祖母に = cho bà; 手紙 = thư; 送りました = đã gửi."
          },
          {
            "q": "Câu này nghĩa là gì? {先輩|せんぱい}に{辞書|じしょ}をもらいました。　〔Senpai ni jisho o moraimashita.〕",
            "options": [
              "Tôi đã tặng đàn anh từ điển.",
              "Tôi đã mượn từ điển của đàn anh.",
              "Đàn em đã tặng tôi từ điển.",
              "Tôi đã nhận từ điển của đàn anh (chị)."
            ],
            "correct": 3,
            "why": "もらいました = (tôi) đã nhận; người cho + に."
          },
          {
            "q": "Câu này nghĩa là gì? {山田|やまだ}さんのご{主人|しゅじん}は{医者|いしゃ}です。　〔Yamada-san no goshujin wa isha desu.〕",
            "options": [
              "Anh Yamada là bác sĩ.",
              "Chồng của chị Yamada là bác sĩ.",
              "Vợ của anh Yamada là bác sĩ.",
              "Chồng tôi là bác sĩ."
            ],
            "correct": 1,
            "why": "ご主人 = chồng của người khác."
          },
          {
            "q": "Câu này nghĩa là gì? もうすぐ{結婚式|けっこんしき}ですね。　〔Mousugu kekkonshiki desu ne.〕",
            "options": [
              "Bao giờ thì là lễ cưới?",
              "Lễ cưới vui quá nhỉ.",
              "Sắp đến lễ cưới rồi nhỉ.",
              "Lễ cưới đã xong rồi nhỉ."
            ],
            "correct": 2,
            "why": "もうすぐ = sắp."
          },
          {
            "q": "Câu này nghĩa là gì? {弟|おとうと}は{足|あし}が{長|なが}くて、かっこいいです。　〔Otouto wa ashi ga nagakute, kakkoii desu.〕",
            "options": [
              "Anh trai tôi tóc dài và đẹp trai.",
              "Em trai bạn chân dài và đẹp trai.",
              "Em trai tôi chân ngắn nhưng đẹp trai.",
              "Em trai tôi chân dài và đẹp trai."
            ],
            "correct": 3,
            "why": "弟 = em trai mình; 長くて = dài và…"
          },
          {
            "q": "Câu này nghĩa là gì? {田中|たなか}さんは{親切|しんせつ}で、まじめな{人|ひと}です。　〔Tanaka-san wa shinsetsu de, majime na hito desu.〕",
            "options": [
              "Anh Tanaka là người tốt bụng và chăm chỉ.",
              "Anh Tanaka là người vui tính và thông minh.",
              "Anh Tanaka khoẻ mạnh và chăm chỉ.",
              "Anh Tanaka tốt bụng nhưng không chăm chỉ."
            ],
            "correct": 0,
            "why": "親切で = tốt bụng và…; まじめな人 = người chăm chỉ."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-tv-dich",
        "title": "Dịch Việt → Nhật bằng từ của bài (12 câu)",
        "kind": "translate",
        "grammar": "N1 は N2 が A です · N に N を あげます／もらいます · N が N を くれます",
        "items": [
          {
            "q": "Tôi có một anh trai và một em gái.",
            "answers": [
              "私は兄が一人と妹が一人います。",
              "私は兄が一人と妹がひとりいます。",
              "私は兄が一人といもうとが一人います。",
              "私は兄が一人といもうとがひとりいます。",
              "私は兄がひとりと妹が一人います。",
              "私は兄がひとりと妹がひとりいます。",
              "私は兄がひとりといもうとが一人います。",
              "私は兄がひとりといもうとがひとりいます。",
              "私はあにが一人と妹が一人います。",
              "私はあにが一人と妹がひとりいます。",
              "私はあにが一人といもうとが一人います。",
              "私はあにが一人といもうとがひとりいます。",
              "私はあにがひとりと妹が一人います。",
              "私はあにがひとりと妹がひとりいます。",
              "私はあにがひとりといもうとが一人います。",
              "私はあにがひとりといもうとがひとりいます。",
              "わたしは兄が一人と妹が一人います。",
              "わたしは兄が一人と妹がひとりいます。",
              "わたしは兄が一人といもうとが一人います。",
              "わたしは兄が一人といもうとがひとりいます。",
              "わたしは兄がひとりと妹が一人います。",
              "わたしは兄がひとりと妹がひとりいます。",
              "わたしは兄がひとりといもうとが一人います。",
              "わたしは兄がひとりといもうとがひとりいます。",
              "わたしはあにが一人と妹が一人います。",
              "わたしはあにが一人と妹がひとりいます。",
              "わたしはあにが一人といもうとが一人います。",
              "わたしはあにが一人といもうとがひとりいます。",
              "わたしはあにがひとりと妹が一人います。",
              "わたしはあにがひとりと妹がひとりいます。",
              "わたしはあにがひとりといもうとが一人います。",
              "わたしはあにがひとりといもうとがひとりいます。",
              "兄が一人と妹が一人います。",
              "兄が一人と妹がひとりいます。",
              "兄が一人といもうとが一人います。",
              "兄が一人といもうとがひとりいます。",
              "兄がひとりと妹が一人います。",
              "兄がひとりと妹がひとりいます。",
              "兄がひとりといもうとが一人います。",
              "兄がひとりといもうとがひとりいます。",
              "あにが一人と妹が一人います。",
              "あにが一人と妹がひとりいます。",
              "あにが一人といもうとが一人います。",
              "あにが一人といもうとがひとりいます。",
              "あにがひとりと妹が一人います。",
              "あにがひとりと妹がひとりいます。",
              "あにがひとりといもうとが一人います。",
              "あにがひとりといもうとがひとりいます。",
              "兄が1人と妹が1人います。",
              "兄が1人と妹がひとりいます。",
              "兄が1人といもうとが1人います。",
              "兄が1人といもうとがひとりいます。",
              "兄がひとりと妹が1人います。",
              "兄がひとりといもうとが1人います。",
              "あにが1人と妹が1人います。",
              "あにが1人と妹がひとりいます。",
              "あにが1人といもうとが1人います。",
              "あにが1人といもうとがひとりいます。",
              "あにがひとりと妹が1人います。",
              "あにがひとりといもうとが1人います。"
            ],
            "hint": "N が ～人 と N が ～人 います"
          },
          {
            "q": "Bố tôi là bác sĩ.",
            "answers": [
              "父は医者です。",
              "父はいしゃです。",
              "ちちは医者です。",
              "ちちはいしゃです。",
              "私の父は医者です。",
              "私の父はいしゃです。",
              "私のちちは医者です。",
              "私のちちはいしゃです。",
              "わたしの父は医者です。",
              "わたしの父はいしゃです。",
              "わたしのちちは医者です。",
              "わたしのちちはいしゃです。"
            ],
            "hint": "Bố mình = 父"
          },
          {
            "q": "Mẹ bạn có khoẻ không?",
            "answers": [
              "お母さんは元気ですか。",
              "お母さんはげんきですか。",
              "おかあさんは元気ですか。",
              "おかあさんはげんきですか。",
              "お母さんはお元気ですか。",
              "お母さんはおげんきですか。",
              "おかあさんはお元気ですか。",
              "おかあさんはおげんきですか。"
            ],
            "hint": "Mẹ người khác = お母さん"
          },
          {
            "q": "Em gái tôi tóc dài.",
            "answers": [
              "妹は髪が長いです。",
              "妹は髪がながいです。",
              "妹はかみが長いです。",
              "妹はかみがながいです。",
              "いもうとは髪が長いです。",
              "いもうとは髪がながいです。",
              "いもうとはかみが長いです。",
              "いもうとはかみがながいです。",
              "私の妹は髪が長いです。",
              "私の妹は髪がながいです。",
              "私の妹はかみが長いです。",
              "私の妹はかみがながいです。",
              "私のいもうとは髪が長いです。",
              "私のいもうとは髪がながいです。",
              "私のいもうとはかみが長いです。",
              "私のいもうとはかみがながいです。",
              "わたしの妹は髪が長いです。",
              "わたしの妹は髪がながいです。",
              "わたしの妹はかみが長いです。",
              "わたしの妹はかみがながいです。",
              "わたしのいもうとは髪が長いです。",
              "わたしのいもうとは髪がながいです。",
              "わたしのいもうとはかみが長いです。",
              "わたしのいもうとはかみがながいです。"
            ],
            "hint": "N1 は N2 が A です"
          },
          {
            "q": "Con thỏ tai dài.",
            "answers": [
              "うさぎは耳が長いです。",
              "うさぎは耳がながいです。",
              "うさぎはみみが長いです。",
              "うさぎはみみがながいです。",
              "ウサギは耳が長いです。",
              "ウサギは耳がながいです。",
              "ウサギはみみが長いです。",
              "ウサギはみみがながいです。"
            ],
            "hint": "N1 は N2 が A です"
          },
          {
            "q": "Tôi đã tặng bà sợi dây chuyền.",
            "answers": [
              "私は祖母にネックレスをあげました。",
              "私はそぼにネックレスをあげました。",
              "わたしは祖母にネックレスをあげました。",
              "わたしはそぼにネックレスをあげました。",
              "祖母にネックレスをあげました。",
              "そぼにネックレスをあげました。"
            ],
            "hint": "người nhận に あげます"
          },
          {
            "q": "Tôi đã nhận sô-cô-la của đàn em.",
            "answers": [
              "私は後輩にチョコレートをもらいました。",
              "私はこうはいにチョコレートをもらいました。",
              "わたしは後輩にチョコレートをもらいました。",
              "わたしはこうはいにチョコレートをもらいました。",
              "後輩にチョコレートをもらいました。",
              "こうはいにチョコレートをもらいました。",
              "後輩からチョコレートをもらいました。",
              "こうはいからチョコレートをもらいました。",
              "私は後輩からチョコレートをもらいました。",
              "私はこうはいからチョコレートをもらいました。",
              "わたしは後輩からチョコレートをもらいました。",
              "わたしはこうはいからチョコレートをもらいました。"
            ],
            "hint": "người cho に／から もらいます"
          },
          {
            "q": "Chị gái tôi đã cho tôi cái ô.",
            "answers": [
              "姉が傘をくれました。",
              "姉がかさをくれました。",
              "あねが傘をくれました。",
              "あねがかさをくれました。",
              "姉が私に傘をくれました。",
              "姉が私にかさをくれました。",
              "姉がわたしに傘をくれました。",
              "姉がわたしにかさをくれました。",
              "あねが私に傘をくれました。",
              "あねが私にかさをくれました。",
              "あねがわたしに傘をくれました。",
              "あねがわたしにかさをくれました。",
              "姉は私に傘をくれました。",
              "姉は私にかさをくれました。",
              "姉はわたしに傘をくれました。",
              "姉はわたしにかさをくれました。",
              "あねは私に傘をくれました。",
              "あねは私にかさをくれました。",
              "あねはわたしに傘をくれました。",
              "あねはわたしにかさをくれました。",
              "姉は傘をくれました。",
              "姉はかさをくれました。",
              "あねは傘をくれました。",
              "あねはかさをくれました。"
            ],
            "hint": "người cho が (私に) N を くれます"
          },
          {
            "q": "Sắp đến Giáng sinh rồi.",
            "answers": [
              "もうすぐクリスマスです。",
              "もうすぐクリスマスですね。"
            ],
            "hint": "もうすぐ N です"
          },
          {
            "q": "Tôi gọi điện cho bố mẹ.",
            "answers": [
              "両親に電話します。",
              "両親にでんわします。",
              "りょうしんに電話します。",
              "りょうしんにでんわします。",
              "私は両親に電話します。",
              "私は両親にでんわします。",
              "私はりょうしんに電話します。",
              "私はりょうしんにでんわします。",
              "わたしは両親に電話します。",
              "わたしは両親にでんわします。",
              "わたしはりょうしんに電話します。",
              "わたしはりょうしんにでんわします。"
            ],
            "hint": "người được gọi に 電話します"
          },
          {
            "q": "Anh Marco cao và đẹp trai.",
            "answers": [
              "マルコさんは背が高くて、かっこいいです。",
              "マルコさんは背がたかくて、かっこいいです。",
              "マルコさんはせが高くて、かっこいいです。",
              "マルコさんはせがたかくて、かっこいいです。"
            ],
            "hint": "イA くて、～"
          },
          {
            "q": "Chồng của cô Yamada là người tốt bụng.",
            "answers": [
              "山田さんのご主人は親切な人です。",
              "山田さんのご主人は親切なひとです。",
              "山田さんのご主人はしんせつな人です。",
              "山田さんのご主人はしんせつなひとです。",
              "山田さんのごしゅじんは親切な人です。",
              "山田さんのごしゅじんは親切なひとです。",
              "山田さんのごしゅじんはしんせつな人です。",
              "山田さんのごしゅじんはしんせつなひとです。",
              "やまださんのご主人は親切な人です。",
              "やまださんのご主人は親切なひとです。",
              "やまださんのご主人はしんせつな人です。",
              "やまださんのご主人はしんせつなひとです。",
              "やまださんのごしゅじんは親切な人です。",
              "やまださんのごしゅじんは親切なひとです。",
              "やまださんのごしゅじんはしんせつな人です。",
              "やまださんのごしゅじんはしんせつなひとです。",
              "山田さんのご主人は親切です。",
              "山田さんのご主人はしんせつです。",
              "山田さんのごしゅじんは親切です。",
              "山田さんのごしゅじんはしんせつです。",
              "やまださんのご主人は親切です。",
              "やまださんのご主人はしんせつです。",
              "やまださんのごしゅじんは親切です。",
              "やまださんのごしゅじんはしんせつです。"
            ],
            "hint": "ご主人 = chồng người khác"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-tv-ghep",
        "title": "Ghép câu bằng từ vựng Bài 8 (8 câu)",
        "items": [
          {
            "vi": "Tôi có hai em trai.",
            "chips": [
              "{二人|ふたり}",
              "{私|わたし}は",
              "います",
              "{弟|おとうと}が",
              "あります"
            ],
            "answer": [
              "{私|わたし}は",
              "{弟|おとうと}が",
              "{二人|ふたり}",
              "います"
            ],
            "ro": "Watashi wa otouto ga futari imasu"
          },
          {
            "vi": "Em gái tôi mắt to.",
            "chips": [
              "{目|め}が",
              "{耳|みみ}が",
              "{大|おお}きいです",
              "{妹|いもうと}は"
            ],
            "answer": [
              "{妹|いもうと}は",
              "{目|め}が",
              "{大|おお}きいです"
            ],
            "ro": "Imouto wa me ga ookii desu"
          },
          {
            "vi": "Tôi đã nhận thiệp của bạn.",
            "chips": [
              "もらいました",
              "くれました",
              "{友達|ともだち}に",
              "カードを",
              "{私|わたし}は"
            ],
            "answer": [
              "{私|わたし}は",
              "{友達|ともだち}に",
              "カードを",
              "もらいました"
            ],
            "ro": "Watashi wa tomodachi ni kaado o moraimashita"
          },
          {
            "vi": "Bà đã cho tôi tiền.",
            "chips": [
              "お{金|かね}を",
              "くれました",
              "あげました",
              "{祖母|そぼ}が"
            ],
            "answer": [
              "{祖母|そぼ}が",
              "お{金|かね}を",
              "くれました"
            ],
            "ro": "Sobo ga okane o kuremashita"
          },
          {
            "vi": "Anh trai tôi đang sống ở Osaka.",
            "chips": [
              "{兄|あに}は",
              "{大阪|おおさか}に",
              "{住|す}んでいます",
              "{大阪|おおさか}で"
            ],
            "answer": [
              "{兄|あに}は",
              "{大阪|おおさか}に",
              "{住|す}んでいます"
            ],
            "ro": "Ani wa Oosaka ni sunde imasu"
          },
          {
            "vi": "Mẹ của Anna hiền và tốt bụng.",
            "chips": [
              "{親切|しんせつ}です",
              "{優|やさ}しくて、",
              "{優|やさ}しい、",
              "アンナさんの",
              "お{母|かあ}さんは"
            ],
            "answer": [
              "アンナさんの",
              "お{母|かあ}さんは",
              "{優|やさ}しくて、",
              "{親切|しんせつ}です"
            ],
            "ro": "Anna-san no okaasan wa yasashikute, shinsetsu desu"
          },
          {
            "vi": "Sắp đến ngày Valentine rồi nhỉ.",
            "chips": [
              "ですね",
              "{何|なに}か",
              "もうすぐ",
              "バレンタインデー"
            ],
            "answer": [
              "もうすぐ",
              "バレンタインデー",
              "ですね"
            ],
            "ro": "Mousugu Barentaindee desu ne"
          },
          {
            "vi": "Tôi đã tặng đàn anh quyển vở.",
            "chips": [
              "くれました",
              "ノートを",
              "{私|わたし}は",
              "あげました",
              "{先輩|せんぱい}に"
            ],
            "answer": [
              "{私|わたし}は",
              "{先輩|せんぱい}に",
              "ノートを",
              "あげました"
            ],
            "ro": "Watashi wa senpai ni nooto o agemashita"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b8-chu-han",
    "kind": "kanji",
    "title": "Luyện thêm Bài 8 · Chữ Hán của lớp (父母兄弟姉妹子目口耳足長) — đọc · nghĩa · chọn chữ · đọc không furigana",
    "goal": "Đọc đúng, hiểu nghĩa 12 chữ Hán Bài 8 (gia đình + cơ thể) và các từ ghép, phân biệt cách đọc của cùng một chữ (父 ちち/とう, 母 はは/かあ/ぼ, 兄 あに/にい/きょう…), chọn đúng chữ giữa các chữ na ná, đọc câu/đoạn không furigana như đề thi.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Học **chữ theo từ**: 父 ちち – お父さん おとうさん, 母 はは – お母さん おかあさん – 祖母 そぼ, 兄 あに – お兄さん おにいさん – 兄弟 きょうだい. Một chữ có nhiều cách đọc: nhớ theo TỪ, đừng nhớ chữ trơ trọi.",
          "Chữ **na ná** hay làm bẫy: 父/交/夫 · 母/毎/海 · 兄/元/見 · 弟/第 · 姉/妹/市 · 目/日/白/自 · 耳/取 · 足/走. Mỗi lần sai, viết chữ đúng 5 lần kèm từ.",
          "Mức Khó không furigana: chỉ dùng chữ đã học đến Bài 8 (các chữ còn lại viết hiragana như đề thi). Đọc to cả câu rồi mới bấm xem."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nghĩa chữ · cách đọc từ ghép"
      },
      {
        "t": "table",
        "head": [
          "Chữ",
          "Nghĩa",
          "Hán Việt · On/Kun",
          "Từ hay gặp"
        ],
        "rows": [
          [
            "父",
            "bố, cha",
            "PHỤ — On フ · Kun ちち",
            "父 · お父さん · 祖父"
          ],
          [
            "母",
            "mẹ",
            "MẪU — On ボ · Kun はは",
            "母 · お母さん · 祖母"
          ],
          [
            "兄",
            "anh trai",
            "HUYNH — On キョウ・ケイ · Kun あに",
            "兄 · お兄さん · 兄弟"
          ],
          [
            "弟",
            "em trai",
            "ĐỆ — On ダイ・テイ · Kun おとうと",
            "弟 · 弟さん · 兄弟"
          ],
          [
            "姉",
            "chị gái",
            "TỶ — On シ · Kun あね",
            "姉 · お姉さん · 姉妹"
          ],
          [
            "妹",
            "em gái",
            "MUỘI — On マイ · Kun いもうと",
            "妹 · 妹さん · 姉妹"
          ],
          [
            "子",
            "con, đứa trẻ",
            "TỬ — On シ・ス · Kun こ",
            "子ども · お子さん · 息子 · 帽子 · お菓子"
          ],
          [
            "目",
            "mắt; thứ (~つ目)",
            "MỤC — On モク · Kun め",
            "目 · 一つ目 · 目薬"
          ],
          [
            "口",
            "miệng; cửa",
            "KHẨU — On コウ · Kun くち",
            "口 · 出口 · 入り口 · 人口"
          ],
          [
            "耳",
            "tai",
            "NHĨ — On ジ · Kun みみ",
            "耳 · 耳が痛いです"
          ],
          [
            "足",
            "chân; đủ",
            "TÚC — On ソク · Kun あし・た・ります",
            "足 · 遠足 · 一足"
          ],
          [
            "長",
            "dài; người đứng đầu",
            "TRƯỜNG, TRƯỞNG — On チョウ · Kun なが・い",
            "長い · 店長 · 社長 · 部長"
          ]
        ],
        "caption": "12 chữ Hán của lớp Bài 8"
      },
      {
        "t": "mcq",
        "id": "lt-b8-kj-nghia",
        "title": "Chữ → nghĩa (12 câu)",
        "items": [
          {
            "q": "Chữ 「父」 mang nghĩa nào?",
            "options": [
              "mắt; thứ (~つ目)",
              "tai",
              "anh trai",
              "bố, cha"
            ],
            "correct": 3,
            "why": "**父** = bố, cha (PHỤ — On フ · Kun ちち). Hay gặp: 父 · お父さん · 祖父."
          },
          {
            "q": "Chữ 「母」 mang nghĩa nào?",
            "options": [
              "con, đứa trẻ",
              "mẹ",
              "bố, cha",
              "dài; người đứng đầu"
            ],
            "correct": 1,
            "why": "**母** = mẹ (MẪU — On ボ · Kun はは). Hay gặp: 母 · お母さん · 祖母."
          },
          {
            "q": "Chữ 「兄」 mang nghĩa nào?",
            "options": [
              "chân; đủ",
              "con, đứa trẻ",
              "anh trai",
              "bố, cha"
            ],
            "correct": 2,
            "why": "**兄** = anh trai (HUYNH — On キョウ・ケイ · Kun あに). Hay gặp: 兄 · お兄さん · 兄弟."
          },
          {
            "q": "Chữ 「弟」 mang nghĩa nào?",
            "options": [
              "em trai",
              "chân; đủ",
              "anh trai",
              "mắt; thứ (~つ目)"
            ],
            "correct": 0,
            "why": "**弟** = em trai (ĐỆ — On ダイ・テイ · Kun おとうと). Hay gặp: 弟 · 弟さん · 兄弟."
          },
          {
            "q": "Chữ 「姉」 mang nghĩa nào?",
            "options": [
              "chân; đủ",
              "bố, cha",
              "mắt; thứ (~つ目)",
              "chị gái"
            ],
            "correct": 3,
            "why": "**姉** = chị gái (TỶ — On シ · Kun あね). Hay gặp: 姉 · お姉さん · 姉妹."
          },
          {
            "q": "Chữ 「妹」 mang nghĩa nào?",
            "options": [
              "chân; đủ",
              "em gái",
              "bố, cha",
              "mẹ"
            ],
            "correct": 1,
            "why": "**妹** = em gái (MUỘI — On マイ · Kun いもうと). Hay gặp: 妹 · 妹さん · 姉妹."
          },
          {
            "q": "Chữ 「子」 mang nghĩa nào?",
            "options": [
              "chị gái",
              "bố, cha",
              "tai",
              "con, đứa trẻ"
            ],
            "correct": 3,
            "why": "**子** = con, đứa trẻ (TỬ — On シ・ス · Kun こ). Hay gặp: 子ども · お子さん · 息子 · 帽子 · お菓子."
          },
          {
            "q": "Chữ 「目」 mang nghĩa nào?",
            "options": [
              "mắt; thứ (~つ目)",
              "con, đứa trẻ",
              "miệng; cửa",
              "anh trai"
            ],
            "correct": 0,
            "why": "**目** = mắt; thứ (~つ目) (MỤC — On モク · Kun め). Hay gặp: 目 · 一つ目 · 目薬."
          },
          {
            "q": "Chữ 「口」 mang nghĩa nào?",
            "options": [
              "mẹ",
              "miệng; cửa",
              "mắt; thứ (~つ目)",
              "chân; đủ"
            ],
            "correct": 1,
            "why": "**口** = miệng; cửa (KHẨU — On コウ · Kun くち). Hay gặp: 口 · 出口 · 入り口 · 人口."
          },
          {
            "q": "Chữ 「耳」 mang nghĩa nào?",
            "options": [
              "mẹ",
              "mắt; thứ (~つ目)",
              "miệng; cửa",
              "tai"
            ],
            "correct": 3,
            "why": "**耳** = tai (NHĨ — On ジ · Kun みみ). Hay gặp: 耳 · 耳が痛いです."
          },
          {
            "q": "Chữ 「足」 mang nghĩa nào?",
            "options": [
              "chân; đủ",
              "bố, cha",
              "mắt; thứ (~つ目)",
              "con, đứa trẻ"
            ],
            "correct": 0,
            "why": "**足** = chân; đủ (TÚC — On ソク · Kun あし・た・ります). Hay gặp: 足 · 遠足 · 一足."
          },
          {
            "q": "Chữ 「長」 mang nghĩa nào?",
            "options": [
              "mắt; thứ (~つ目)",
              "em trai",
              "chân; đủ",
              "dài; người đứng đầu"
            ],
            "correct": 3,
            "why": "**長** = dài; người đứng đầu (TRƯỜNG, TRƯỞNG — On チョウ · Kun なが・い). Hay gặp: 長い · 店長 · 社長 · 部長."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-kj-nghia2",
        "title": "Nghĩa → chữ (12 câu)",
        "items": [
          {
            "q": "Chữ nào có nghĩa \"bố, cha\"?",
            "options": [
              "弟",
              "姉",
              "妹",
              "父"
            ],
            "correct": 3,
            "why": "**父** = bố, cha (PHỤ — On フ · Kun ちち). Hay gặp: 父 · お父さん · 祖父."
          },
          {
            "q": "Chữ nào có nghĩa \"mẹ\"?",
            "options": [
              "子",
              "兄",
              "目",
              "母"
            ],
            "correct": 3,
            "why": "**母** = mẹ (MẪU — On ボ · Kun はは). Hay gặp: 母 · お母さん · 祖母."
          },
          {
            "q": "Chữ nào có nghĩa \"anh trai\"?",
            "options": [
              "妹",
              "口",
              "長",
              "兄"
            ],
            "correct": 3,
            "why": "**兄** = anh trai (HUYNH — On キョウ・ケイ · Kun あに). Hay gặp: 兄 · お兄さん · 兄弟."
          },
          {
            "q": "Chữ nào có nghĩa \"em trai\"?",
            "options": [
              "口",
              "弟",
              "子",
              "長"
            ],
            "correct": 1,
            "why": "**弟** = em trai (ĐỆ — On ダイ・テイ · Kun おとうと). Hay gặp: 弟 · 弟さん · 兄弟."
          },
          {
            "q": "Chữ nào có nghĩa \"chị gái\"?",
            "options": [
              "姉",
              "妹",
              "足",
              "長"
            ],
            "correct": 0,
            "why": "**姉** = chị gái (TỶ — On シ · Kun あね). Hay gặp: 姉 · お姉さん · 姉妹."
          },
          {
            "q": "Chữ nào có nghĩa \"em gái\"?",
            "options": [
              "妹",
              "姉",
              "子",
              "耳"
            ],
            "correct": 0,
            "why": "**妹** = em gái (MUỘI — On マイ · Kun いもうと). Hay gặp: 妹 · 妹さん · 姉妹."
          },
          {
            "q": "Chữ nào có nghĩa \"con, đứa trẻ\"?",
            "options": [
              "子",
              "妹",
              "耳",
              "足"
            ],
            "correct": 0,
            "why": "**子** = con, đứa trẻ (TỬ — On シ・ス · Kun こ). Hay gặp: 子ども · お子さん · 息子 · 帽子 · お菓子."
          },
          {
            "q": "Chữ nào có nghĩa \"mắt; thứ (~つ目)\"?",
            "options": [
              "目",
              "耳",
              "口",
              "父"
            ],
            "correct": 0,
            "why": "**目** = mắt; thứ (~つ目) (MỤC — On モク · Kun め). Hay gặp: 目 · 一つ目 · 目薬."
          },
          {
            "q": "Chữ nào có nghĩa \"miệng; cửa\"?",
            "options": [
              "口",
              "耳",
              "姉",
              "母"
            ],
            "correct": 0,
            "why": "**口** = miệng; cửa (KHẨU — On コウ · Kun くち). Hay gặp: 口 · 出口 · 入り口 · 人口."
          },
          {
            "q": "Chữ nào có nghĩa \"tai\"?",
            "options": [
              "目",
              "耳",
              "長",
              "母"
            ],
            "correct": 1,
            "why": "**耳** = tai (NHĨ — On ジ · Kun みみ). Hay gặp: 耳 · 耳が痛いです."
          },
          {
            "q": "Chữ nào có nghĩa \"chân; đủ\"?",
            "options": [
              "姉",
              "妹",
              "母",
              "足"
            ],
            "correct": 3,
            "why": "**足** = chân; đủ (TÚC — On ソク · Kun あし・た・ります). Hay gặp: 足 · 遠足 · 一足."
          },
          {
            "q": "Chữ nào có nghĩa \"dài; người đứng đầu\"?",
            "options": [
              "子",
              "長",
              "兄",
              "弟"
            ],
            "correct": 1,
            "why": "**長** = dài; người đứng đầu (TRƯỜNG, TRƯỞNG — On チョウ · Kun なが・い). Hay gặp: 長い · 店長 · 社長 · 部長."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-kj-doc",
        "title": "Đọc từ ghép / từ có chữ Hán của bài (22 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　【父】",
            "options": [
              "はは (haha)",
              "ふ (fu)",
              "とう (tou)",
              "ちち (chichi)"
            ],
            "correct": 3,
            "why": "父 = ちち (chichi) — đứng một mình (bố của mình) đọc Kun ちち."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【お父さん】",
            "options": [
              "おとうさん (otousan)",
              "おとさん (otosan)",
              "おちちさん (ochichisan)",
              "おふさん (ofusan)"
            ],
            "correct": 0,
            "why": "お父さん = おとうさん (otousan) — cách đọc đặc biệt とう — nhớ cả cụm."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【母】",
            "options": [
              "はは (haha)",
              "かあ (kaa)",
              "ちち (chichi)",
              "ぼ (bo)"
            ],
            "correct": 0,
            "why": "母 = はは (haha) — mẹ của mình."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【お母さん】",
            "options": [
              "おぼさん (obosan)",
              "おかあさん (okaasan)",
              "おかさん (okasan)",
              "おははさん (ohahasan)"
            ],
            "correct": 1,
            "why": "お母さん = おかあさん (okaasan) — đọc đặc biệt かあ."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【祖母】",
            "options": [
              "そぼ (sobo)",
              "そうぼ (soubo)",
              "そはは (sohaha)",
              "そも (somo)"
            ],
            "correct": 0,
            "why": "祖母 = そぼ (sobo) — bà (của mình) — 母 đọc On ぼ."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【兄】",
            "options": [
              "にい (nii)",
              "きょう (kyou)",
              "あね (ane)",
              "あに (ani)"
            ],
            "correct": 3,
            "why": "兄 = あに (ani) — anh trai của mình."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【お兄さん】",
            "options": [
              "おきょうさん (okyousan)",
              "おにさん (onisan)",
              "おにいさん (oniisan)",
              "おあにさん (oanisan)"
            ],
            "correct": 2,
            "why": "お兄さん = おにいさん (oniisan) — đọc đặc biệt にい."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【兄弟】",
            "options": [
              "きょうてい (kyoutei)",
              "きょうだい (kyoudai)",
              "けいてい (keitei)",
              "あにおとうと (aniotouto)"
            ],
            "correct": 1,
            "why": "兄弟 = きょうだい (kyoudai) — anh chị em — 弟 ở đây đọc だい."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【弟】",
            "options": [
              "いもうと (imouto)",
              "おとと (ototo)",
              "おとうと (otouto)",
              "だい (dai)"
            ],
            "correct": 2,
            "why": "弟 = おとうと (otouto) — em trai của mình (おとうと có う dài)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【姉】",
            "options": [
              "あに (ani)",
              "し (shi)",
              "ねえ (nee)",
              "あね (ane)"
            ],
            "correct": 3,
            "why": "姉 = あね (ane) — chị gái của mình."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【お姉さん】",
            "options": [
              "おねさん (onesan)",
              "おしさん (oshisan)",
              "おねえさん (oneesan)",
              "おあねさん (oanesan)"
            ],
            "correct": 2,
            "why": "お姉さん = おねえさん (oneesan) — đọc đặc biệt ねえ."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【妹】",
            "options": [
              "いもと (imoto)",
              "いもうと (imouto)",
              "おとうと (otouto)",
              "まい (mai)"
            ],
            "correct": 1,
            "why": "妹 = いもうと (imouto) — em gái của mình."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【子ども】",
            "options": [
              "こどうも (kodoumo)",
              "こども (kodomo)",
              "ごども (godomo)",
              "しども (shidomo)"
            ],
            "correct": 1,
            "why": "子ども = こども (kodomo) — con, trẻ con."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【お子さん】",
            "options": [
              "おこさん (okosan)",
              "おこうさん (okousan)",
              "おすさん (osusan)",
              "おしさん (oshisan)"
            ],
            "correct": 0,
            "why": "お子さん = おこさん (okosan) — con của người khác."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【目】",
            "options": [
              "み (mi)",
              "もく (moku)",
              "め (me)",
              "ま (ma)"
            ],
            "correct": 2,
            "why": "目 = め (me) — mắt."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【口】",
            "options": [
              "くち (kuchi)",
              "こう (kou)",
              "ぐち (guchi)",
              "くつ (kutsu)"
            ],
            "correct": 0,
            "why": "口 = くち (kuchi) — miệng."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【耳】",
            "options": [
              "じ (ji)",
              "みみ (mimi)",
              "み (mi)",
              "にみ (nimi)"
            ],
            "correct": 1,
            "why": "耳 = みみ (mimi) — tai."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【足】",
            "options": [
              "そく (soku)",
              "あし (ashi)",
              "あつ (atsu)",
              "たし (tashi)"
            ],
            "correct": 1,
            "why": "足 = あし (ashi) — chân."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【長い】",
            "options": [
              "なかい (nakai)",
              "ちょうい (choui)",
              "ながい (nagai)",
              "たかい (takai)"
            ],
            "correct": 2,
            "why": "長い = ながい (nagai) — dài — な không có dấu ゛."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【社長】",
            "options": [
              "かいちょう (kaichou)",
              "しゃなが (shanaga)",
              "しゃちょう (shachou)",
              "しゃちょ (shacho)"
            ],
            "correct": 2,
            "why": "社長 = しゃちょう (shachou) — giám đốc — 長 đọc On ちょう (う dài)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【妹さん】",
            "options": [
              "まいさん (maisan)",
              "おとうとさん (otoutosan)",
              "いもさん (imosan)",
              "いもうとさん (imoutosan)"
            ],
            "correct": 3,
            "why": "妹さん = いもうとさん (imoutosan) — em gái của người khác."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【入り口】",
            "options": [
              "いりぐち (iriguchi)",
              "いりくち (irikuchi)",
              "はいりこう (hairikou)",
              "いれぐち (ireguchi)"
            ],
            "correct": 0,
            "why": "入り口 = いりぐち (iriguchi) — lối vào — くち → ぐち khi đứng sau."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn chữ đúng · điền chữ vào câu · On hay Kun"
      },
      {
        "t": "mcq",
        "id": "lt-b8-kj-chon-chu",
        "title": "Chọn cách viết đúng (13 câu)",
        "items": [
          {
            "q": "Chọn cách viết đúng: ちち (bố của mình)",
            "options": [
              "夫",
              "父",
              "交",
              "文"
            ],
            "correct": 1,
            "why": "父 = hai tay cầm gậy bắt chéo; 交 (giao), 文 (văn), 夫 (chồng) là chữ khác."
          },
          {
            "q": "Chọn cách viết đúng: はは (mẹ của mình)",
            "options": [
              "舟",
              "母",
              "海",
              "毎"
            ],
            "correct": 1,
            "why": "母 có hai chấm bên trong; 毎 (mỗi) có 母 bên dưới nhưng thêm nét trên."
          },
          {
            "q": "Chọn cách viết đúng: あに (anh trai)",
            "options": [
              "先",
              "見",
              "元",
              "兄"
            ],
            "correct": 3,
            "why": "兄 = 口 trên 儿; 元 (nguyên), 見 (nhìn), 先 (trước) khác."
          },
          {
            "q": "Chọn cách viết đúng: おとうと (em trai)",
            "options": [
              "弟",
              "弓",
              "第",
              "美"
            ],
            "correct": 0,
            "why": "弟; 第 (đệ — thứ tự) có bộ trúc ⺮ ở trên."
          },
          {
            "q": "Chọn cách viết đúng: あね (chị gái)",
            "options": [
              "妹",
              "市",
              "姉",
              "始"
            ],
            "correct": 2,
            "why": "姉 = 女 + 市; 妹 = 女 + 未 (em gái)."
          },
          {
            "q": "Chọn cách viết đúng: いもうと (em gái)",
            "options": [
              "妹",
              "未",
              "姉",
              "味"
            ],
            "correct": 0,
            "why": "妹 = 女 + 未; 味 (vị) có bộ 口."
          },
          {
            "q": "Chọn cách viết đúng: こども (trẻ con)",
            "options": [
              "子ども",
              "字ども",
              "学ども",
              "了ども"
            ],
            "correct": 0,
            "why": "子 = em bé quấn tã; 字, 学 có 子 bên dưới nhưng là chữ khác."
          },
          {
            "q": "Chọn cách viết đúng: め (mắt)",
            "options": [
              "白",
              "自",
              "日",
              "目"
            ],
            "correct": 3,
            "why": "目 có HAI nét ngang bên trong; 日 có một."
          },
          {
            "q": "Chọn cách viết đúng: くち (miệng)",
            "options": [
              "日",
              "中",
              "回",
              "口"
            ],
            "correct": 3,
            "why": "口 là ô vuông trống."
          },
          {
            "q": "Chọn cách viết đúng: みみ (tai)",
            "options": [
              "取",
              "耳",
              "聞",
              "目"
            ],
            "correct": 1,
            "why": "耳; 取 = 耳 + 又 (lấy); 聞 = tai trong cổng (nghe)."
          },
          {
            "q": "Chọn cách viết đúng: あし (chân)",
            "options": [
              "足",
              "定",
              "是",
              "走"
            ],
            "correct": 0,
            "why": "足 có 口 ở trên."
          },
          {
            "q": "Chọn cách viết đúng: ながい (dài)",
            "options": [
              "表い",
              "長い",
              "張い",
              "帳い"
            ],
            "correct": 1,
            "why": "長 = ông già tóc dài."
          },
          {
            "q": "Chọn cách viết đúng: きょうだい (anh chị em)",
            "options": [
              "元弟",
              "兄弟",
              "見弟",
              "兄第"
            ],
            "correct": 1,
            "why": "兄 + 弟."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-kj-dien-chu",
        "title": "Điền chữ Hán vào chỗ trống (11 câu)",
        "items": [
          {
            "q": "{私|わたし}は＿＿が{二人|ふたり}います。　〔Watashi wa __ ga futari imasu.〕　— Tôi có hai em gái (いもうと).",
            "options": [
              "始",
              "妹",
              "姉",
              "味"
            ],
            "correct": 1,
            "why": "いもうと = 妹. → **{私|わたし}は{妹|いもうと}が{二人|ふたり}います。** 〔Watashi wa imouto ga futari imasu.〕 — Tôi có hai em gái (いもうと)."
          },
          {
            "q": "＿＿は{医者|いしゃ}です。　〔__ wa isha desu.〕　— Bố tôi (ちち) là bác sĩ.",
            "options": [
              "文",
              "父",
              "交",
              "夫"
            ],
            "correct": 1,
            "why": "ちち = 父. → **{父|ちち}は{医者|いしゃ}です。** 〔Chichi wa isha desu.〕 — Bố tôi (ちち) là bác sĩ."
          },
          {
            "q": "うさぎは＿＿が{長|なが}いです。　〔Usagi wa __ ga nagai desu.〕　— Con thỏ tai (みみ) dài.",
            "options": [
              "耳",
              "目",
              "取",
              "自"
            ],
            "correct": 0,
            "why": "みみ = 耳. → **うさぎは{耳|みみ}が{長|なが}いです。** 〔Usagi wa mimi ga nagai desu.〕 — Con thỏ tai (みみ) dài."
          },
          {
            "q": "{姉|あね}は{髪|かみ}が＿＿いです。　〔Ane wa kami ga __i desu.〕　— Chị tôi tóc dài (ながい).",
            "options": [
              "帳",
              "長",
              "表",
              "張"
            ],
            "correct": 1,
            "why": "なが(い) = 長. → **{姉|あね}は{髪|かみ}が{長|なが}いです。** 〔Ane wa kami ga nagai desu.〕 — Chị tôi tóc dài (ながい)."
          },
          {
            "q": "{弟|おとうと}は＿＿が{大|おお}きいです。　〔Otouto wa __ ga ookii desu.〕　— Em trai tôi mắt (め) to.",
            "options": [
              "自",
              "日",
              "目",
              "白"
            ],
            "correct": 2,
            "why": "め = 目. → **{弟|おとうと}は{目|め}が{大|おお}きいです。** 〔Otouto wa me ga ookii desu.〕 — Em trai tôi mắt (め) to."
          },
          {
            "q": "＿＿を{大|おお}きく{開|あ}けてください。　〔__ o ookiku akete kudasai.〕　— Hãy há miệng (くち) thật to.",
            "options": [
              "中",
              "口",
              "日",
              "回"
            ],
            "correct": 1,
            "why": "くち = 口. → **{口|くち}を{大|おお}きく{開|あ}けてください。** 〔Kuchi o ookiku akete kudasai.〕 — Hãy há miệng (くち) thật to."
          },
          {
            "q": "{兄|あに}は＿＿が{長|なが}くて、かっこいいです。　〔Ani wa __ ga nagakute, kakkoii desu.〕　— Anh tôi chân (あし) dài, đẹp trai.",
            "options": [
              "走",
              "足",
              "是",
              "定"
            ],
            "correct": 1,
            "why": "あし = 足. → **{兄|あに}は{足|あし}が{長|なが}くて、かっこいいです。** 〔Ani wa ashi ga nagakute, kakkoii desu.〕 — Anh tôi chân (あし) dài, đẹp trai."
          },
          {
            "q": "{兄|あに}が{一人|ひとり}と＿＿が{一人|ひとり}います。　〔Ani ga hitori to __ ga hitori imasu.〕　— Tôi có một anh trai và một chị gái (あね).",
            "options": [
              "姉",
              "妹",
              "市",
              "始"
            ],
            "correct": 0,
            "why": "あね = 姉. → **{兄|あに}が{一人|ひとり}と{姉|あね}が{一人|ひとり}います。** 〔Ani ga hitori to ane ga hitori imasu.〕 — Tôi có một anh trai và một chị gái (あね)."
          },
          {
            "q": "{母|はは}は＿＿どもが{好|す}きです。　〔Haha wa __domo ga suki desu.〕　— Mẹ tôi thích trẻ con (こども).",
            "options": [
              "子",
              "了",
              "学",
              "字"
            ],
            "correct": 0,
            "why": "こ(ども) = 子. → **{母|はは}は{子|こ}どもが{好|す}きです。** 〔Haha wa kodomo ga suki desu.〕 — Mẹ tôi thích trẻ con (こども)."
          },
          {
            "q": "＿＿は{料理|りょうり}が{上手|じょうず}です。　〔__ wa ryouri ga jouzu desu.〕　— Mẹ tôi (はは) nấu ăn giỏi.",
            "options": [
              "毎",
              "女",
              "海",
              "母"
            ],
            "correct": 3,
            "why": "はは = 母. → **{母|はは}は{料理|りょうり}が{上手|じょうず}です。** 〔Haha wa ryouri ga jouzu desu.〕 — Mẹ tôi (はは) nấu ăn giỏi."
          },
          {
            "q": "お＿＿さんは{高校生|こうこうせい}ですか。　〔O__san wa koukousei desu ka.〕　— Anh trai bạn (おにいさん) là học sinh cấp 3 à?",
            "options": [
              "元",
              "見",
              "先",
              "兄"
            ],
            "correct": 3,
            "why": "お兄さん = おにいさん. → **お{兄|にい}さんは{高校生|こうこうせい}ですか。** 〔Oniisan wa koukousei desu ka.〕 — Anh trai bạn (おにいさん) là học sinh cấp 3 à?"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-kj-on-kun",
        "title": "Cùng một chữ, đọc khác nhau tuỳ từ (12 câu)",
        "items": [
          {
            "q": "Chữ 「父」 trong 「父」 đọc là gì?",
            "options": [
              "ぼ",
              "ふ",
              "ちち",
              "とう"
            ],
            "correct": 2,
            "why": "Đứng một mình → Kun ちち."
          },
          {
            "q": "Chữ 「父」 trong 「お父さん」 đọc là gì?",
            "options": [
              "ちち",
              "とう",
              "かあ",
              "ふ"
            ],
            "correct": 1,
            "why": "お父さん: đọc đặc biệt とう."
          },
          {
            "q": "Chữ 「母」 trong 「母」 đọc là gì?",
            "options": [
              "かあ",
              "ぼ",
              "ちち",
              "はは"
            ],
            "correct": 3,
            "why": "Đứng một mình → Kun はは."
          },
          {
            "q": "Chữ 「母」 trong 「祖母」 đọc là gì?",
            "options": [
              "かあ",
              "も",
              "ぼ",
              "はは"
            ],
            "correct": 2,
            "why": "Từ ghép On: 祖母 そぼ."
          },
          {
            "q": "Chữ 「母」 trong 「お母さん」 đọc là gì?",
            "options": [
              "ねえ",
              "はは",
              "かあ",
              "ぼ"
            ],
            "correct": 2,
            "why": "お母さん: đọc đặc biệt かあ."
          },
          {
            "q": "Chữ 「兄」 trong 「兄弟」 đọc là gì?",
            "options": [
              "あに",
              "にい",
              "けい",
              "きょう"
            ],
            "correct": 3,
            "why": "Từ ghép On: 兄弟 きょうだい."
          },
          {
            "q": "Chữ 「兄」 trong 「お兄さん」 đọc là gì?",
            "options": [
              "あに",
              "きょう",
              "にい",
              "ねえ"
            ],
            "correct": 2,
            "why": "お兄さん: đọc đặc biệt にい."
          },
          {
            "q": "Chữ 「弟」 trong 「兄弟」 đọc là gì?",
            "options": [
              "てい",
              "おとうと",
              "と",
              "だい"
            ],
            "correct": 3,
            "why": "兄弟 = きょう + だい (đặc biệt)."
          },
          {
            "q": "Chữ 「姉」 trong 「お姉さん」 đọc là gì?",
            "options": [
              "し",
              "ねえ",
              "あね",
              "にい"
            ],
            "correct": 1,
            "why": "お姉さん: đọc đặc biệt ねえ."
          },
          {
            "q": "Chữ 「長」 trong 「長い」 đọc là gì?",
            "options": [
              "たか",
              "みじか",
              "なが",
              "ちょう"
            ],
            "correct": 2,
            "why": "Có đuôi kana い → Kun なが(い)."
          },
          {
            "q": "Chữ 「長」 trong 「社長」 đọc là gì?",
            "options": [
              "ちょ",
              "ちょう",
              "しゃ",
              "なが"
            ],
            "correct": 1,
            "why": "Từ ghép On: 社長 しゃちょう."
          },
          {
            "q": "Chữ 「口」 trong 「入り口」 đọc là gì?",
            "options": [
              "こう",
              "ぐち",
              "ぐつ",
              "くち"
            ],
            "correct": 1,
            "why": "くち đứng sau từ khác → ぐち (biến âm)."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · không furigana — như đề thi"
      },
      {
        "t": "mcq",
        "id": "lt-b8-kj-doc-cau",
        "title": "Đọc đúng phần trong 【 】 (13 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　【兄弟】がいますか。",
            "options": [
              "きょうだい (kyoudai)",
              "きょうてい (kyoutei)",
              "あにおとうと (aniotouto)",
              "けいてい (keitei)"
            ],
            "correct": 0,
            "why": "兄弟 = きょうだい. Cả câu: 【兄弟】がいますか。 〔[kyoudai] ga imasu ka.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【父】は会社員です。",
            "options": [
              "ちち (chichi)",
              "ふ (fu)",
              "はは (haha)",
              "とう (tou)"
            ],
            "correct": 0,
            "why": "父 = ちち. Cả câu: 【父】は会社員です。 〔[chichi] wa kaishain desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【お母さん】はおげんきですか。",
            "options": [
              "おかさん (okasan)",
              "おぼさん (obosan)",
              "おかあさん (okaasan)",
              "おははさん (ohahasan)"
            ],
            "correct": 2,
            "why": "お母さん = おかあさん. Cả câu: 【お母さん】はおげんきですか。 〔[okaasan] wa ogenki desu ka.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　姉はかみが【長い】です。",
            "options": [
              "たかい (takai)",
              "ながい (nagai)",
              "なかい (nakai)",
              "ちょうい (choui)"
            ],
            "correct": 1,
            "why": "長い = ながい. Cả câu: 姉はかみが【長い】です。 〔Ane wa kami ga [nagai] desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【妹】はこうこうせいです。",
            "options": [
              "おとうと (otouto)",
              "いもうと (imouto)",
              "まい (mai)",
              "あね (ane)"
            ],
            "correct": 1,
            "why": "妹 = いもうと. Cả câu: 【妹】はこうこうせいです。 〔[imouto] wa koukousei desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　うさぎは【耳】が長いです。",
            "options": [
              "め (me)",
              "みみ (mimi)",
              "じ (ji)",
              "くち (kuchi)"
            ],
            "correct": 1,
            "why": "耳 = みみ. Cả câu: うさぎは【耳】が長いです。 〔Usagi wa [mimi] ga nagai desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【目】が大きいですね。",
            "options": [
              "ま (ma)",
              "もく (moku)",
              "み (mi)",
              "め (me)"
            ],
            "correct": 3,
            "why": "目 = め. Cả câu: 【目】が大きいですね。 〔[me] ga ookii desu ne.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【子ども】が二人います。",
            "options": [
              "すども (sudomo)",
              "ごども (godomo)",
              "こども (kodomo)",
              "しども (shidomo)"
            ],
            "correct": 2,
            "why": "子ども = こども. Cả câu: 【子ども】が二人います。 〔[kodomo] ga futari imasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【お兄さん】は何をしていますか。",
            "options": [
              "おきょうさん (okyousan)",
              "おあにさん (oanisan)",
              "おにさん (onisan)",
              "おにいさん (oniisan)"
            ],
            "correct": 3,
            "why": "お兄さん = おにいさん. Cả câu: 【お兄さん】は何をしていますか。 〔[oniisan] wa nani o shite imasu ka.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　弟は【足】が長いです。",
            "options": [
              "そく (soku)",
              "あつ (atsu)",
              "あし (ashi)",
              "たし (tashi)"
            ],
            "correct": 2,
            "why": "足 = あし. Cả câu: 弟は【足】が長いです。 〔Otouto wa [ashi] ga nagai desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【社長】はしんせつな人です。",
            "options": [
              "しゃなが (shanaga)",
              "しゃちょう (shachou)",
              "かいちょう (kaichou)",
              "しゃちょ (shacho)"
            ],
            "correct": 1,
            "why": "社長 = しゃちょう. Cả câu: 【社長】はしんせつな人です。 〔[shachou] wa shinsetsu na hito desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　この子は【口】が小さいです。",
            "options": [
              "ぐち (guchi)",
              "くち (kuchi)",
              "くつ (kutsu)",
              "こう (kou)"
            ],
            "correct": 1,
            "why": "口 = くち. Cả câu: この子は【口】が小さいです。 〔Kono ko wa [kuchi] ga chiisai desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【祖母】にてがみをおくりました。",
            "options": [
              "そぼ (sobo)",
              "そぶ (sobu)",
              "そも (somo)",
              "そはは (sohaha)"
            ],
            "correct": 0,
            "why": "祖母 = そぼ. Cả câu: 【祖母】にてがみをおくりました。 〔[sobo] ni tegami o okurimashita.〕"
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b8-kj-doc-cau-rk",
        "title": "Đọc to câu KHÔNG furigana, rồi bấm xem đáp án (22 câu)",
        "note": "Đọc to cả câu. Chỉ dùng chữ Hán đã học đến Bài 8; các từ khác viết hiragana như đề thi.",
        "items": [
          {
            "text": "{私|わたし}の{父|ちち}は{会社員|かいしゃいん}です。",
            "ro": "Watashi no chichi wa kaishain desu.",
            "vi": "Bố tôi là nhân viên công ty."
          },
          {
            "text": "{母|はは}は{日本語|にほんご}の{先生|せんせい}です。",
            "ro": "Haha wa Nihongo no sensei desu.",
            "vi": "Mẹ tôi là giáo viên tiếng Nhật."
          },
          {
            "text": "{兄|あに}は{東京|とうきょう}にすんでいます。",
            "ro": "Ani wa Toukyou ni sunde imasu.",
            "vi": "Anh trai tôi đang sống ở Tokyo."
          },
          {
            "text": "{姉|あね}は{大学|だいがく}で{英語|えいご}をおしえています。",
            "ro": "Ane wa daigaku de eigo o oshiete imasu.",
            "vi": "Chị gái tôi dạy tiếng Anh ở trường đại học."
          },
          {
            "text": "{弟|おとうと}はこうこうせいです。",
            "ro": "Otouto wa koukousei desu.",
            "vi": "Em trai tôi là học sinh cấp 3."
          },
          {
            "text": "{妹|いもうと}は{目|め}が{大|おお}きいです。",
            "ro": "Imouto wa me ga ookii desu.",
            "vi": "Em gái tôi mắt to."
          },
          {
            "text": "{子|こ}どもが{二人|ふたり}います。",
            "ro": "Kodomo ga futari imasu.",
            "vi": "Tôi có hai con."
          },
          {
            "text": "うさぎは{耳|みみ}が{長|なが}いです。",
            "ro": "Usagi wa mimi ga nagai desu.",
            "vi": "Con thỏ tai dài."
          },
          {
            "text": "{父|ちち}は{足|あし}が{長|なが}くて、せがたかいです。",
            "ro": "Chichi wa ashi ga nagakute, se ga takai desu.",
            "vi": "Bố tôi chân dài và cao."
          },
          {
            "text": "お{父|とう}さんは{何|なに}をしていますか。",
            "ro": "Otousan wa nani o shite imasu ka.",
            "vi": "Bố bạn làm nghề gì?"
          },
          {
            "text": "お{母|かあ}さんはおげんきですか。",
            "ro": "Okaasan wa ogenki desu ka.",
            "vi": "Mẹ bạn có khoẻ không?"
          },
          {
            "text": "{兄弟|きょうだい}は{何人|なんにん}ですか。",
            "ro": "Kyoudai wa nannin desu ka.",
            "vi": "Bạn có mấy anh chị em?"
          },
          {
            "text": "{私|わたし}は{姉|あね}に{本|ほん}をもらいました。",
            "ro": "Watashi wa ane ni hon o moraimashita.",
            "vi": "Tôi đã nhận quyển sách của chị gái."
          },
          {
            "text": "{妹|いもうと}が{私|わたし}にかさをくれました。",
            "ro": "Imouto ga watashi ni kasa o kuremashita.",
            "vi": "Em gái đã cho tôi cái ô."
          },
          {
            "text": "{母|はは}のたんじょうびにはなをあげました。",
            "ro": "Haha no tanjoubi ni hana o agemashita.",
            "vi": "Tôi đã tặng hoa vào ngày sinh nhật mẹ."
          },
          {
            "text": "{社長|しゃちょう}のお{子|こ}さんは{小学生|しょうがくせい}です。",
            "ro": "Shachou no okosan wa shougakusei desu.",
            "vi": "Con của giám đốc là học sinh tiểu học."
          },
          {
            "text": "{兄|あに}と{二人|ふたり}ですんでいます。",
            "ro": "Ani to futari de sunde imasu.",
            "vi": "Tôi sống hai người với anh trai."
          },
          {
            "text": "{弟|おとうと}さんは{大学生|だいがくせい}ですか。",
            "ro": "Otouto-san wa daigakusei desu ka.",
            "vi": "Em trai bạn là sinh viên đại học à?"
          },
          {
            "text": "{私|わたし}は{兄|あに}が{一人|ひとり}と{妹|いもうと}が{二人|ふたり}います。",
            "ro": "Watashi wa ani ga hitori to imouto ga futari imasu.",
            "vi": "Tôi có một anh trai và hai em gái."
          },
          {
            "text": "{姉|あね}は{料理|りょうり}がじょうずです。",
            "ro": "Ane wa ryouri ga jouzu desu.",
            "vi": "Chị gái tôi nấu ăn giỏi."
          },
          {
            "text": "{父|ちち}と{母|はは}はハノイにすんでいます。",
            "ro": "Chichi to haha wa Hanoi ni sunde imasu.",
            "vi": "Bố mẹ tôi sống ở Hà Nội."
          },
          {
            "text": "{子|こ}どもの{口|くち}は{小|ちい}さいです。",
            "ro": "Kodomo no kuchi wa chiisai desu.",
            "vi": "Miệng của trẻ con nhỏ."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b8-kj-doc-doan",
        "title": "Đọc to ĐOẠN văn ngắn không furigana (3 đoạn)",
        "items": [
          {
            "text": "{私|わたし}のかぞくは{五人|ごにん}です。{父|ちち}と{母|はは}と{兄|あに}と{妹|いもうと}と{私|わたし}です。{父|ちち}は{会社員|かいしゃいん}で、{母|はは}は{日本語|にほんご}の{先生|せんせい}です。{兄|あに}は{東京|とうきょう}にすんでいます。",
            "ro": "Watashi no kazoku wa gonin desu. Chichi to haha to ani to imouto to watashi desu. Chichi wa kaishain de, haha wa Nihongo no sensei desu. Ani wa Toukyou ni sunde imasu.",
            "vi": "Gia đình tôi có 5 người: bố, mẹ, anh trai, em gái và tôi. Bố tôi là nhân viên công ty, mẹ là giáo viên tiếng Nhật. Anh trai tôi sống ở Tokyo."
          },
          {
            "text": "{姉|あね}は{目|め}が{大|おお}きくて、かみが{長|なが}いです。やさしくて、おもしろい{人|ひと}です。{料理|りょうり}がじょうずです。{私|わたし}の{大|だい}すきな{姉|あね}です。",
            "ro": "Ane wa me ga ookikute, kami ga nagai desu. Yasashikute, omoshiroi hito desu. Ryouri ga jouzu desu. Watashi no daisuki na ane desu.",
            "vi": "Chị tôi mắt to, tóc dài. Chị hiền và vui tính. Chị nấu ăn giỏi. Đó là người chị tôi rất yêu quý."
          },
          {
            "text": "{先週|せんしゅう}は{母|はは}のたんじょうびでした。{私|わたし}は{母|はは}にはなをあげました。{兄|あに}はネックレスをあげました。よる、{父|ちち}と{母|はは}は{二人|ふたり}でレストランへ{行|い}きました。",
            "ro": "Senshuu wa haha no tanjoubi deshita. Watashi wa haha ni hana o agemashita. Ani wa nekkuresu o agemashita. Yoru, chichi to haha wa futari de resutoran e ikimashita.",
            "vi": "Tuần trước là sinh nhật mẹ. Tôi tặng mẹ hoa. Anh tôi tặng dây chuyền. Buổi tối bố mẹ đi nhà hàng hai người."
          }
        ]
      },
      {
        "t": "write",
        "id": "lt-b8-kj-viet",
        "title": "Tập viết chữ Hán của lớp Bài 8 (12 chữ + 5 từ)",
        "chars": [
          "父",
          "母",
          "兄",
          "弟",
          "姉",
          "妹",
          "子",
          "目",
          "口",
          "耳",
          "足",
          "長",
          "兄弟",
          "姉妹",
          "社長",
          "人口",
          "父母"
        ],
        "goi": {
          "兄弟": "きょうだい · anh chị em",
          "姉妹": "しまい · chị em gái",
          "社長": "しゃちょう · giám đốc",
          "人口": "じんこう · dân số",
          "父母": "ふぼ · cha mẹ"
        }
      }
    ]
  },
  {
    "id": "lt-b8-np-1",
    "kind": "homework",
    "title": "Luyện thêm Bài 8 · Ngữ pháp 1 (ポイント 72, 73, 79, 80) — sống ở đâu · làm nghề gì · có mấy anh chị em · sống cùng mấy người (~114 câu)",
    "goal": "Nói đúng nơi đang sống (N に 住んでいます), nghề nghiệp/việc làm lâu dài (N で V ています), có mấy anh chị em/con/thú cưng (N が ～人 います) và sống/đi cùng tổng cộng mấy người (～人で) — không nhầm に/で, không nhầm đọc số người.",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Ba mẫu dùng **V ています** nhưng khác nghĩa: **住んでいます / 結婚しています** = trạng thái kéo dài (ポイント 72) · **働いています / 教えています** = nghề, việc làm lâu dài (ポイント 73). (Còn \"đang làm ngay lúc này\" là ポイント 64 của Bài 7.)",
          "Trợ từ là chỗ mất điểm nhiều nhất: **nơi ở → に** (横浜に住んでいます) · **nơi làm việc → で** (病院で働いています) · **sống với ai → と** · **tổng số người → ～人で** (tính cả mình).",
          "Đếm người: **ひとり・ふたり・さんにん・よにん・ごにん…**; đếm con vật nhỏ: **いっぴき・にひき・さんびき・よんひき・ごひき・ろっぴき…**. Người, con vật → **います**; không có trợ từ sau con số."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**N(người) は N(nơi) に 住んでいます。** · **N は 結婚しています／結婚していません。** (ポイント 72)",
          "**N(người) は N(nơi) で V ています。** — nghề, việc làm lâu dài. Hỏi nghề: **お父さんは 何を していますか。** (ポイント 73)",
          "**（私は）N(người/con vật) が（số）います。** · Hỏi: **兄弟が 何人 いますか。** · Cả nhà: **家族は 何人ですか — ～人です。** (ポイント 79)",
          "**（N と）～人 で V ます。** — tổng cộng ~ người, TÍNH CẢ MÌNH. **一人で** = một mình. (ポイント 80)"
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng ポイント một"
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-72",
        "title": "ポイント 72: N に 住んでいます／結婚しています (10 câu)",
        "items": [
          {
            "q": "{私|わたし}は{横浜|よこはま}＿＿{住|す}んでいます。　〔Watashi wa Yokohama __ sunde imasu.〕　— Tôi đang sống ở Yokohama.",
            "options": [
              "を",
              "に",
              "が",
              "で"
            ],
            "correct": 1,
            "why": "Nơi ở đi với **に** (ポイント 72). → **{私|わたし}は{横浜|よこはま}に{住|す}んでいます。** 〔Watashi wa Yokohama ni sunde imasu.〕 — Tôi đang sống ở Yokohama."
          },
          {
            "q": "{両親|りょうしん}はハノイに＿＿。　〔Ryoushin wa Hanoi ni __.〕　— Bố mẹ tôi sống ở Hà Nội.",
            "options": [
              "{住|す}むいます",
              "{住|す}みます",
              "{住|す}みています",
              "{住|す}んでいます"
            ],
            "correct": 3,
            "why": "住みます → **住んで** (み → んで) + います = đang sống (trạng thái). → **{両親|りょうしん}はハノイに{住|す}んでいます。** 〔Ryoushin wa Hanoi ni sunde imasu.〕 — Bố mẹ tôi sống ở Hà Nội."
          },
          {
            "q": "{姉|あね}は＿＿。{子|こ}どもが{二人|ふたり}います。　〔Ane wa __. Kodomo ga futari imasu.〕　— Chị tôi đã lập gia đình. Chị có hai con.",
            "options": [
              "{結婚|けっこん}します",
              "{結婚|けっこん}しましょう",
              "{結婚|けっこん}してください",
              "{結婚|けっこん}しています"
            ],
            "correct": 3,
            "why": "Đã có gia đình (trạng thái kéo dài) → **結婚しています**. → **{姉|あね}は{結婚|けっこん}しています。{子|こ}どもが{二人|ふたり}います。** 〔Ane wa kekkon shite imasu. Kodomo ga futari imasu.〕 — Chị tôi đã lập gia đình. Chị có hai con."
          },
          {
            "q": "A：どこに{住|す}んでいますか。B：{大学|だいがく}の{近|ちか}く＿＿{住|す}んでいます。　〔A: doko ni sunde imasu ka. B: daigaku no chikaku __ sunde imasu.〕　— A: Bạn sống ở đâu? B: Tôi sống gần trường đại học.",
            "options": [
              "へ",
              "を",
              "に",
              "で"
            ],
            "correct": 2,
            "why": "Nơi ở → **に**, kể cả khi là \"gần ~\" (近くに). → **A：どこに{住|す}んでいますか。B：{大学|だいがく}の{近|ちか}くに{住|す}んでいます。** 〔A: doko ni sunde imasu ka. B: daigaku no chikaku ni sunde imasu.〕 — A: Bạn sống ở đâu? B: Tôi sống gần trường đại học."
          },
          {
            "q": "{兄|あに}は{大阪|おおさか}に＿＿。　〔Ani wa Oosaka ni __.〕　— Anh trai tôi sống ở Osaka.",
            "options": [
              "{住|す}んであります",
              "{住|す}んでください",
              "{住|す}みましょう",
              "{住|す}んでいます"
            ],
            "correct": 3,
            "why": "Người đang sống ở đâu → **住んでいます**. → **{兄|あに}は{大阪|おおさか}に{住|す}んでいます。** 〔Ani wa Oosaka ni sunde imasu.〕 — Anh trai tôi sống ở Osaka."
          },
          {
            "q": "{山田|やまだ}さんは{結婚|けっこん}していますか。——いいえ、＿＿。　〔Yamada-san wa kekkon shite imasu ka. — Iie, __.〕　— Anh Yamada đã lập gia đình chưa? — Chưa, anh ấy chưa kết hôn.",
            "options": [
              "{結婚|けっこん}しません",
              "{結婚|けっこん}しないです",
              "{結婚|けっこん}じゃありません",
              "{結婚|けっこん}していません"
            ],
            "correct": 3,
            "why": "Chưa có gia đình → **結婚していません** (phủ định của trạng thái). 結婚しません = \"sẽ không cưới\". → **{山田|やまだ}さんは{結婚|けっこん}していますか。——いいえ、{結婚|けっこん}していません。** 〔Yamada-san wa kekkon shite imasu ka. — Iie, kekkon shite imasen.〕 — Anh Yamada đã lập gia đình chưa? — Chưa, anh ấy chưa kết hôn."
          },
          {
            "q": "{祖母|そぼ}はダナン＿＿{住|す}んでいます。　〔Sobo wa Danan __ sunde imasu.〕　— Bà tôi sống ở Đà Nẵng.",
            "options": [
              "の",
              "で",
              "と",
              "に"
            ],
            "correct": 3,
            "why": "Nơi ở → **に**. → **{祖母|そぼ}はダナンに{住|す}んでいます。** 〔Sobo wa Danan ni sunde imasu.〕 — Bà tôi sống ở Đà Nẵng."
          },
          {
            "q": "A：ご{両親|りょうしん}はどこに{住|す}んでいますか。B：＿＿。　〔A: goryoushin wa doko ni sunde imasu ka. B: __.〕　— A: Bố mẹ bạn sống ở đâu? B: Bố mẹ tôi sống ở Hà Nội.",
            "options": [
              "{両親|りょうしん}はハノイに{住|す}みます",
              "ご{両親|りょうしん}はハノイに{住|す}んでいます",
              "{両親|りょうしん}はハノイで{住|す}んでいます",
              "{両親|りょうしん}はハノイに{住|す}んでいます"
            ],
            "correct": 3,
            "why": "Nói bố mẹ MÌNH → bỏ ご (両親); nơi ở + に; dạng 住んでいます. → **A：ご{両親|りょうしん}はどこに{住|す}んでいますか。B：{両親|りょうしん}はハノイに{住|す}んでいます。** 〔A: goryoushin wa doko ni sunde imasu ka. B: ryoushin wa Hanoi ni sunde imasu.〕 — A: Bố mẹ bạn sống ở đâu? B: Bố mẹ tôi sống ở Hà Nội."
          },
          {
            "q": "{田中|たなか}さんは＿＿が、{子|こ}どもはいません。　〔Tanaka-san wa __ ga, kodomo wa imasen.〕　— Anh Tanaka đã kết hôn nhưng chưa có con.",
            "options": [
              "{結婚|けっこん}しています",
              "{結婚|けっこん}します",
              "{結婚|けっこん}です",
              "{住|す}んでいます"
            ],
            "correct": 0,
            "why": "Đã có gia đình (trạng thái) → **結婚しています**; ～が、～ = nhưng. → **{田中|たなか}さんは{結婚|けっこん}していますが、{子|こ}どもはいません。** 〔Tanaka-san wa kekkon shite imasu ga, kodomo wa imasen.〕 — Anh Tanaka đã kết hôn nhưng chưa có con."
          },
          {
            "q": "マルコさんは{日本|にほん}に{住|す}んでいますか。——はい、＿＿。　〔Maruko-san wa Nihon ni sunde imasu ka. — Hai, __.〕　— Marco có sống ở Nhật không? — Có, tôi đang sống ở Nhật.",
            "options": [
              "{住|す}んでください",
              "{住|す}んでいません",
              "{住|す}みます",
              "{住|す}んでいます"
            ],
            "correct": 3,
            "why": "Trả lời \"có\" → lặp lại **住んでいます**. → **マルコさんは{日本|にほん}に{住|す}んでいますか。——はい、{住|す}んでいます。** 〔Maruko-san wa Nihon ni sunde imasu ka. — Hai, sunde imasu.〕 — Marco có sống ở Nhật không? — Có, tôi đang sống ở Nhật."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-73",
        "title": "ポイント 73: N で V ています — nghề, việc làm lâu dài (10 câu)",
        "items": [
          {
            "q": "{父|ちち}は{銀行|ぎんこう}＿＿{働|はたら}いています。　〔Chichi wa ginkou __ hataraite imasu.〕　— Bố tôi làm việc ở ngân hàng.",
            "options": [
              "へ",
              "を",
              "に",
              "で"
            ],
            "correct": 3,
            "why": "Nơi làm việc → **で** (nơi diễn ra hành động). → **{父|ちち}は{銀行|ぎんこう}で{働|はたら}いています。** 〔Chichi wa ginkou de hataraite imasu.〕 — Bố tôi làm việc ở ngân hàng."
          },
          {
            "q": "{母|はは}は{高校|こうこう}で{英語|えいご}を＿＿。　〔Haha wa koukou de eigo o __.〕　— Mẹ tôi dạy tiếng Anh ở trường cấp 3.",
            "options": [
              "{教|おし}えっています",
              "{教|おし}えますです",
              "{教|おし}えています",
              "{教|おし}えりています"
            ],
            "correct": 2,
            "why": "教えます (nhóm 2) → **教えて** + います = nghề dạy học. → **{母|はは}は{高校|こうこう}で{英語|えいご}を{教|おし}えています。** 〔Haha wa koukou de eigo o oshiete imasu.〕 — Mẹ tôi dạy tiếng Anh ở trường cấp 3."
          },
          {
            "q": "{弟|おとうと}は{大学|だいがく}で{経済|けいざい}を＿＿。　〔Otouto wa daigaku de keizai o __.〕　— Em trai tôi học kinh tế ở đại học.",
            "options": [
              "{勉強|べんきょう}しています",
              "{勉強|べんきょう}いています",
              "{勉強|べんきょう}しっています",
              "{勉強|べんきょう}してあります"
            ],
            "correct": 0,
            "why": "します → **して** + います. → **{弟|おとうと}は{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。** 〔Otouto wa daigaku de keizai o benkyou shite imasu.〕 — Em trai tôi học kinh tế ở đại học."
          },
          {
            "q": "A：お{父|とう}さんは{何|なに}をしていますか。B：＿＿。　〔A: otousan wa nani o shite imasu ka. B: __.〕　— A: Bố bạn làm nghề gì? B: Bố tôi là bác sĩ.",
            "options": [
              "お{父|とう}さんは{医者|いしゃ}です",
              "{父|ちち}は{医者|いしゃ}にいます",
              "{父|ちち}は{医者|いしゃ}です",
              "{父|ちち}は{病院|びょういん}をしています"
            ],
            "correct": 2,
            "why": "Trả lời nghề: **父は 医者です** (bố MÌNH → 父). → **A：お{父|とう}さんは{何|なに}をしていますか。B：{父|ちち}は{医者|いしゃ}です。** 〔A: otousan wa nani o shite imasu ka. B: chichi wa isha desu.〕 — A: Bố bạn làm nghề gì? B: Bố tôi là bác sĩ."
          },
          {
            "q": "{姉|あね}はデパートで＿＿。　〔Ane wa depaato de __.〕　— Chị tôi làm việc ở trung tâm thương mại.",
            "options": [
              "{働|はたら}きています",
              "{働|はたら}んでいます",
              "{働|はたら}っています",
              "{働|はたら}いています"
            ],
            "correct": 3,
            "why": "働きます → **働いて** (き → いて). → **{姉|あね}はデパートで{働|はたら}いています。** 〔Ane wa depaato de hataraite imasu.〕 — Chị tôi làm việc ở trung tâm thương mại."
          },
          {
            "q": "{妹|いもうと}は{高校生|こうこうせい}です。{高校|こうこう}で{日本語|にほんご}を＿＿。　〔Imouto wa koukousei desu. Koukou de Nihongo o __.〕　— Em gái tôi là học sinh cấp 3. Em ấy đang học tiếng Nhật ở trường.",
            "options": [
              "{勉強|べんきょう}しています",
              "{勉強|べんきょう}してください",
              "{勉強|べんきょう}しませんか",
              "{勉強|べんきょう}しましょう"
            ],
            "correct": 0,
            "why": "Việc học lâu dài → **勉強しています**. → **{妹|いもうと}は{高校生|こうこうせい}です。{高校|こうこう}で{日本語|にほんご}を{勉強|べんきょう}しています。** 〔Imouto wa koukousei desu. Koukou de Nihongo o benkyou shite imasu.〕 — Em gái tôi là học sinh cấp 3. Em ấy đang học tiếng Nhật ở trường."
          },
          {
            "q": "{兄|あに}は{会社員|かいしゃいん}です。{東京|とうきょう}の{会社|かいしゃ}＿＿{働|はたら}いています。　〔Ani wa kaishain desu. Toukyou no kaisha __ hataraite imasu.〕　— Anh tôi là nhân viên công ty. Anh làm ở một công ty tại Tokyo.",
            "options": [
              "を",
              "が",
              "で",
              "に"
            ],
            "correct": 2,
            "why": "Nơi làm việc → **で**. → **{兄|あに}は{会社員|かいしゃいん}です。{東京|とうきょう}の{会社|かいしゃ}で{働|はたら}いています。** 〔Ani wa kaishain desu. Toukyou no kaisha de hataraite imasu.〕 — Anh tôi là nhân viên công ty. Anh làm ở một công ty tại Tokyo."
          },
          {
            "q": "{田中|たなか}さんは＿＿をしていますか。——{先生|せんせい}です。　〔Tanaka-san wa __ o shite imasu ka. — Sensei desu.〕　— Anh Tanaka làm nghề gì? — Là giáo viên.",
            "options": [
              "{何|なに}",
              "{誰|だれ}",
              "どこ",
              "いつ"
            ],
            "correct": 0,
            "why": "Hỏi nghề: **何を していますか**. → **{田中|たなか}さんは{何|なに}をしていますか。——{先生|せんせい}です。** 〔Tanaka-san wa nani o shite imasu ka. — Sensei desu.〕 — Anh Tanaka làm nghề gì? — Là giáo viên."
          },
          {
            "q": "{私|わたし}は{週末|しゅうまつ}、レストランでアルバイトを＿＿。　〔Watashi wa shuumatsu, resutoran de arubaito o __.〕　— Cuối tuần tôi làm thêm ở nhà hàng.",
            "options": [
              "しますです",
              "しっています",
              "いています",
              "しています"
            ],
            "correct": 3,
            "why": "Việc làm thêm đều đặn → **しています**. → **{私|わたし}は{週末|しゅうまつ}、レストランでアルバイトをしています。** 〔Watashi wa shuumatsu, resutoran de arubaito o shite imasu.〕 — Cuối tuần tôi làm thêm ở nhà hàng."
          },
          {
            "q": "Câu nào nói về NGHỀ (việc làm lâu dài) của mẹ?",
            "options": [
              "{母|はは}は{病院|びょういん}へ{行|い}きます。 (Haha wa byouin e ikimasu.)",
              "{母|はは}は{病院|びょういん}で{働|はたら}いています。 (Haha wa byouin de hataraite imasu.)",
              "{母|はは}はハノイに{住|す}んでいます。 (Haha wa Hanoi ni sunde imasu.)",
              "{母|はは}は{今|いま}、{電話|でんわ}をかけています。 (Haha wa ima, denwa o kakete imasu.)"
            ],
            "correct": 1,
            "why": "V ています có 3 nghĩa: đang làm lúc này (ポイント 64), trạng thái (72), nghề/việc lâu dài (73). **病院で働いています** = nghề."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-79",
        "title": "ポイント 79: N が（～人）います (10 câu)",
        "items": [
          {
            "q": "{私|わたし}は{妹|いもうと}が{二人|ふたり}＿＿。　〔Watashi wa imouto ga futari __.〕　— Tôi có hai em gái.",
            "options": [
              "います",
              "あります",
              "です",
              "します"
            ],
            "correct": 0,
            "why": "Người → **います**. → **{私|わたし}は{妹|いもうと}が{二人|ふたり}います。** 〔Watashi wa imouto ga futari imasu.〕 — Tôi có hai em gái."
          },
          {
            "q": "{私|わたし}は{兄|あに}が＿＿います。　〔Watashi wa ani ga __ imasu.〕　— Tôi có một anh trai.",
            "options": [
              "{一匹|いっぴき}",
              "{一|ひと}つ",
              "{一人|ひとり}",
              "{一人|いちにん}"
            ],
            "correct": 2,
            "why": "1 người = **一人 ひとり** (đặc biệt). → **{私|わたし}は{兄|あに}が{一人|ひとり}います。** 〔Watashi wa ani ga hitori imasu.〕 — Tôi có một anh trai."
          },
          {
            "q": "{兄弟|きょうだい}が＿＿いますか。——{三人|さんにん}います。　〔Kyoudai ga __ imasu ka. — Sannin imasu.〕　— Bạn có mấy anh chị em? — Ba người.",
            "options": [
              "{何人|なんにん}",
              "{何時|なんじ}",
              "いくつ",
              "{何匹|なんびき}"
            ],
            "correct": 0,
            "why": "Hỏi số người → **何人**. → **{兄弟|きょうだい}が{何人|なんにん}いますか。——{三人|さんにん}います。** 〔Kyoudai ga nannin imasu ka. — Sannin imasu.〕 — Bạn có mấy anh chị em? — Ba người."
          },
          {
            "q": "ペットがいますか。——はい、{猫|ねこ}が＿＿います。　〔Petto ga imasu ka. — Hai, neko ga __ imasu.〕　— Bạn có nuôi thú cưng không? — Có, hai con mèo.",
            "options": [
              "{二|ふた}つ",
              "{二枚|にまい}",
              "{二人|ふたり}",
              "{二匹|にひき}"
            ],
            "correct": 3,
            "why": "Con vật nhỏ → **匹**: 2 con = にひき. → **ペットがいますか。——はい、{猫|ねこ}が{二匹|にひき}います。** 〔Petto ga imasu ka. — Hai, neko ga nihiki imasu.〕 — Bạn có nuôi thú cưng không? — Có, hai con mèo."
          },
          {
            "q": "{兄弟|きょうだい}がいますか。——いいえ、＿＿。　〔Kyoudai ga imasu ka. — Iie, __.〕　— Bạn có anh chị em không? — Không, tôi không có.",
            "options": [
              "いますか",
              "です",
              "いません",
              "ありません"
            ],
            "correct": 2,
            "why": "Không có (người) → **いません**. → **{兄弟|きょうだい}がいますか。——いいえ、いません。** 〔Kyoudai ga imasu ka. — Iie, imasen.〕 — Bạn có anh chị em không? — Không, tôi không có."
          },
          {
            "q": "{家族|かぞく}は{何人|なんにん}ですか。——＿＿。　〔Kazoku wa nannin desu ka. — __.〕　— Nhà bạn mấy người? — Bốn người.",
            "options": [
              "{四人|よにん}です",
              "{四匹|よんひき}です",
              "{四人|よにん}あります",
              "{四|よっ}つです"
            ],
            "correct": 0,
            "why": "Hỏi 家族は何人ですか → đáp **～人です** (tính cả mình). → **{家族|かぞく}は{何人|なんにん}ですか。——{四人|よにん}です。** 〔Kazoku wa nannin desu ka. — Yonin desu.〕 — Nhà bạn mấy người? — Bốn người."
          },
          {
            "q": "{私|わたし}は{子|こ}ども＿＿{三人|さんにん}います。　〔Watashi wa kodomo __ sannin imasu.〕　— Tôi có ba con.",
            "options": [
              "を",
              "が",
              "で",
              "に"
            ],
            "correct": 1,
            "why": "N **が** (số) います. → **{私|わたし}は{子|こ}どもが{三人|さんにん}います。** 〔Watashi wa kodomo ga sannin imasu.〕 — Tôi có ba con."
          },
          {
            "q": "{妹|いもうと}が{二人|ふたり}（　）います。　〔Imouto ga futari ( ) imasu.〕　— Tôi có hai em gái. Điền gì vào （　）?",
            "options": [
              "が",
              "を",
              "に",
              "không điền gì — số đứng ngay trước います"
            ],
            "correct": 3,
            "why": "Số đếm đứng **ngay trước います**, không có trợ từ sau số: **妹が 二人 います**."
          },
          {
            "q": "{私|わたし}は{兄|あに}が{一人|ひとり}＿＿{姉|あね}が{一人|ひとり}います。　〔Watashi wa ani ga hitori __ ane ga hitori imasu.〕　— Tôi có một anh trai và một chị gái.",
            "options": [
              "が",
              "も",
              "で",
              "と"
            ],
            "correct": 3,
            "why": "Nối hai cụm \"N が số\" bằng **と**. → **{私|わたし}は{兄|あに}が{一人|ひとり}と{姉|あね}が{一人|ひとり}います。** 〔Watashi wa ani ga hitori to ane ga hitori imasu.〕 — Tôi có một anh trai và một chị gái."
          },
          {
            "q": "{田中|たなか}さんはお{子|こ}さんが＿＿か。——はい、{息子|むすこ}が{一人|ひとり}います。　〔Tanaka-san wa okosan ga __ ka. — Hai, musuko ga hitori imasu.〕　— Anh Tanaka có con không? — Có, một con trai.",
            "options": [
              "します",
              "います",
              "あります",
              "です"
            ],
            "correct": 1,
            "why": "Con (người) → **います**. → **{田中|たなか}さんはお{子|こ}さんがいますか。——はい、{息子|むすこ}が{一人|ひとり}います。** 〔Tanaka-san wa okosan ga imasu ka. — Hai, musuko ga hitori imasu.〕 — Anh Tanaka có con không? — Có, một con trai."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-80",
        "title": "ポイント 80: ～人で (8 câu)",
        "items": [
          {
            "q": "{私|わたし}はルームメイトと{三人|さんにん}＿＿{住|す}んでいます。　〔Watashi wa ruumumeito to sannin __ sunde imasu.〕　— Tôi sống cùng các bạn cùng phòng, tổng cộng ba người.",
            "options": [
              "を",
              "で",
              "に",
              "が"
            ],
            "correct": 1,
            "why": "Tổng số người + **で**. → **{私|わたし}はルームメイトと{三人|さんにん}で{住|す}んでいます。** 〔Watashi wa ruumumeito to sannin de sunde imasu.〕 — Tôi sống cùng các bạn cùng phòng, tổng cộng ba người."
          },
          {
            "q": "{兄|あに}と＿＿で{住|す}んでいます。　〔Ani to __ de sunde imasu.〕　— Tôi sống với anh trai, hai người.",
            "options": [
              "{二人|ふたり}",
              "{一人|ひとり}",
              "{二匹|にひき}",
              "{三人|さんにん}"
            ],
            "correct": 0,
            "why": "Số + で TÍNH CẢ MÌNH: tôi + anh = 2 → **二人で**. → **{兄|あに}と{二人|ふたり}で{住|す}んでいます。** 〔Ani to futari de sunde imasu.〕 — Tôi sống với anh trai, hai người."
          },
          {
            "q": "{誰|だれ}と{住|す}んでいますか。——＿＿{住|す}んでいます。　〔Dare to sunde imasu ka. — __ sunde imasu.〕　— Bạn sống với ai? — Tôi sống một mình.",
            "options": [
              "{一人|ひとり}に",
              "{一人|ひとり}と",
              "{一人|ひとり}で",
              "{一人|ひとり}が"
            ],
            "correct": 2,
            "why": "Một mình = **一人で**. → **{誰|だれ}と{住|す}んでいますか。——{一人|ひとり}で{住|す}んでいます。** 〔Dare to sunde imasu ka. — Hitori de sunde imasu.〕 — Bạn sống với ai? — Tôi sống một mình."
          },
          {
            "q": "{友達|ともだち}{二人|ふたり}と{旅行|りょこう}に{行|い}きました。＿＿で{行|い}きました。　〔Tomodachi futari to ryokou ni ikimashita. __ de ikimashita.〕　— Tôi đi du lịch với hai người bạn — tổng cộng ba người.",
            "options": [
              "{二人|ふたり}",
              "{一人|ひとり}",
              "{三人|さんにん}",
              "{四人|よにん}"
            ],
            "correct": 2,
            "why": "Hai bạn + tôi = **三人で**. → **{友達|ともだち}{二人|ふたり}と{旅行|りょこう}に{行|い}きました。{三人|さんにん}で{行|い}きました。** 〔Tomodachi futari to ryokou ni ikimashita. Sannin de ikimashita.〕 — Tôi đi du lịch với hai người bạn — tổng cộng ba người."
          },
          {
            "q": "{家族|かぞく}＿＿{住|す}んでいます。　〔Kazoku __ sunde imasu.〕　— Tôi sống với gia đình.",
            "options": [
              "に",
              "で",
              "と",
              "を"
            ],
            "correct": 2,
            "why": "Sống CÙNG ai → **と**. → **{家族|かぞく}と{住|す}んでいます。** 〔Kazoku to sunde imasu.〕 — Tôi sống với gia đình."
          },
          {
            "q": "{週末|しゅうまつ}、{一人|ひとり}＿＿{映画|えいが}を{見|み}ました。　〔Shuumatsu, hitori __ eiga o mimashita.〕　— Cuối tuần tôi xem phim một mình.",
            "options": [
              "と",
              "に",
              "で",
              "が"
            ],
            "correct": 2,
            "why": "Một mình = **一人で**. → **{週末|しゅうまつ}、{一人|ひとり}で{映画|えいが}を{見|み}ました。** 〔Shuumatsu, hitori de eiga o mimashita.〕 — Cuối tuần tôi xem phim một mình."
          },
          {
            "q": "Câu nào nghĩa là \"Tôi có HAI anh trai\"?",
            "options": [
              "{兄|あに}と{二人|ふたり}で{住|す}んでいます。 (Ani to futari de sunde imasu.)",
              "{兄|あに}と{二人|ふたり}います。 (Ani to futari imasu.)",
              "{兄|あに}に{二人|ふたり}でいます。 (Ani ni futari de imasu.)",
              "{兄|あに}が{二人|ふたり}います。 (Ani ga futari imasu.)"
            ],
            "correct": 3,
            "why": "**兄が 二人 います** = đếm số anh (ポイント 79). 兄と二人で = tôi + anh (ポイント 80)."
          },
          {
            "q": "Câu nào nghĩa là \"Tôi sống với anh trai (tổng hai người)\"?",
            "options": [
              "{兄|あに}が{二人|ふたり}{住|す}んでいます。 (Ani ga futari sunde imasu.)",
              "{兄|あに}と{一人|ひとり}で{住|す}んでいます。 (Ani to hitori de sunde imasu.)",
              "{兄|あに}と{二人|ふたり}に{住|す}んでいます。 (Ani to futari ni sunde imasu.)",
              "{兄|あに}と{二人|ふたり}で{住|す}んでいます。 (Ani to futari de sunde imasu.)"
            ],
            "correct": 3,
            "why": "N と ～人で: **兄と 二人で 住んでいます**."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đọc số · に hay で · hỏi–đáp · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-doc-so",
        "title": "Đọc đúng số người / số con vật (12 câu)",
        "items": [
          {
            "q": "Đọc đúng số đếm: 【1人】 (1 người)",
            "options": [
              "ひとり (hitori)",
              "いちにん (ichinin)",
              "いちり (ichiri)",
              "ひとにん (hitonin)"
            ],
            "correct": 0,
            "why": "1 người đọc đặc biệt **ひとり**."
          },
          {
            "q": "Đọc đúng số đếm: 【2人】 (2 người)",
            "options": [
              "ふたり (futari)",
              "ふたにん (futanin)",
              "にり (niri)",
              "ににん (ninin)"
            ],
            "correct": 0,
            "why": "2 người đọc đặc biệt **ふたり**."
          },
          {
            "q": "Đọc đúng số đếm: 【3人】 (3 người)",
            "options": [
              "さにん (sanin)",
              "みにん (minin)",
              "さんり (sanri)",
              "さんにん (sannin)"
            ],
            "correct": 3,
            "why": "Từ 3 người: số + にん → **さんにん**."
          },
          {
            "q": "Đọc đúng số đếm: 【4人】 (4 người)",
            "options": [
              "しにん (shinin)",
              "よんにん (yonnin)",
              "よにん (yonin)",
              "よっにん (yonnin)"
            ],
            "correct": 2,
            "why": "4 người = **よにん** (không phải よんにん) — lỗi bị trừ điểm nói nhiều nhất."
          },
          {
            "q": "Đọc đúng số đếm: 【7人】 (7 người)",
            "options": [
              "なのにん (nanonin)",
              "ななり (nanari)",
              "しちり (shichiri)",
              "しちにん／ななにん (shichinin／nananin)"
            ],
            "correct": 3,
            "why": "7 người: **しちにん** hoặc **ななにん** đều đúng."
          },
          {
            "q": "Đọc đúng số đếm: 【9人】 (9 người)",
            "options": [
              "きゅうり (kyuuri)",
              "くうにん (kuunin)",
              "きゅにん (kyunin)",
              "きゅうにん (kyuunin)"
            ],
            "correct": 3,
            "why": "9 người = **きゅうにん**."
          },
          {
            "q": "Đọc đúng số đếm: 【何人】 (mấy người)",
            "options": [
              "なんびと (nanbito)",
              "なんり (nanri)",
              "なにひと (nanihito)",
              "なんにん (nannin)"
            ],
            "correct": 3,
            "why": "Mấy người = **なんにん**."
          },
          {
            "q": "Đọc đúng số đếm: 【1匹】 (1 con)",
            "options": [
              "いっぴき (ippiki)",
              "ひとひき (hitohiki)",
              "いちびき (ichibiki)",
              "いちひき (ichihiki)"
            ],
            "correct": 0,
            "why": "1 con = **いっぴき** (biến âm)."
          },
          {
            "q": "Đọc đúng số đếm: 【3匹】 (3 con)",
            "options": [
              "さんびき (sanbiki)",
              "さんぴき (sanpiki)",
              "さんひき (sanhiki)",
              "みひき (mihiki)"
            ],
            "correct": 0,
            "why": "3 con = **さんびき** (ひ → び)."
          },
          {
            "q": "Đọc đúng số đếm: 【6匹】 (6 con)",
            "options": [
              "ろくびき (rokubiki)",
              "ろっぴき (roppiki)",
              "ろっひき (rohhiki)",
              "ろくひき (rokuhiki)"
            ],
            "correct": 1,
            "why": "6 con = **ろっぴき**."
          },
          {
            "q": "Đọc đúng số đếm: 【8匹】 (8 con)",
            "options": [
              "はっぴき (happiki)",
              "はちびき (hachibiki)",
              "はっびき (habbiki)",
              "やっぴき (yappiki)"
            ],
            "correct": 0,
            "why": "8 con = **はっぴき** (はちひき cũng có người nói, nhưng はっぴき là chuẩn trong bài)."
          },
          {
            "q": "Đọc đúng số đếm: 【10匹】 (10 con)",
            "options": [
              "とおひき (toohiki)",
              "じゅうびき (juubiki)",
              "じゅうひき (juuhiki)",
              "じゅっぴき (juppiki)"
            ],
            "correct": 3,
            "why": "10 con = **じゅっぴき** (じっぴき)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-ni-de",
        "title": "に, で hay と? (10 câu)",
        "items": [
          {
            "q": "{兄|あに}は{大阪|おおさか}＿＿{住|す}んでいます。　〔Ani wa Oosaka __ sunde imasu.〕　— Anh tôi sống ở Osaka.",
            "options": [
              "に",
              "で",
              "を"
            ],
            "correct": 0,
            "why": "Nơi ở → に. → **{兄|あに}は{大阪|おおさか}に{住|す}んでいます。** 〔Ani wa Oosaka ni sunde imasu.〕 — Anh tôi sống ở Osaka."
          },
          {
            "q": "{兄|あに}は{大阪|おおさか}＿＿{働|はたら}いています。　〔Ani wa Oosaka __ hataraite imasu.〕　— Anh tôi làm việc ở Osaka.",
            "options": [
              "に",
              "を",
              "で"
            ],
            "correct": 2,
            "why": "Nơi làm việc → で. → **{兄|あに}は{大阪|おおさか}で{働|はたら}いています。** 〔Ani wa Oosaka de hataraite imasu.〕 — Anh tôi làm việc ở Osaka."
          },
          {
            "q": "{妹|いもうと}は{大学|だいがく}＿＿{経済|けいざい}を{勉強|べんきょう}しています。　〔Imouto wa daigaku __ keizai o benkyou shite imasu.〕　— Em gái tôi học kinh tế ở đại học.",
            "options": [
              "を",
              "に",
              "で"
            ],
            "correct": 2,
            "why": "Nơi học → で. → **{妹|いもうと}は{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。** 〔Imouto wa daigaku de keizai o benkyou shite imasu.〕 — Em gái tôi học kinh tế ở đại học."
          },
          {
            "q": "{猫|ねこ}はへや＿＿います。　〔Neko wa heya __ imasu.〕　— Con mèo ở trong phòng.",
            "options": [
              "で",
              "を",
              "に"
            ],
            "correct": 2,
            "why": "Nơi tồn tại (Bài 7) → に. → **{猫|ねこ}はへやにいます。** 〔Neko wa heya ni imasu.〕 — Con mèo ở trong phòng."
          },
          {
            "q": "{私|わたし}は{一人|ひとり}＿＿{住|す}んでいます。　〔Watashi wa hitori __ sunde imasu.〕　— Tôi sống một mình.",
            "options": [
              "で",
              "に",
              "と"
            ],
            "correct": 0,
            "why": "Một mình → 一人で. → **{私|わたし}は{一人|ひとり}で{住|す}んでいます。** 〔Watashi wa hitori de sunde imasu.〕 — Tôi sống một mình."
          },
          {
            "q": "{父|ちち}は{病院|びょういん}＿＿{医者|いしゃ}をしています。　〔Chichi wa byouin __ isha o shite imasu.〕　— Bố tôi làm bác sĩ ở bệnh viện.",
            "options": [
              "で",
              "に",
              "を"
            ],
            "correct": 0,
            "why": "Nơi làm việc → で. → **{父|ちち}は{病院|びょういん}で{医者|いしゃ}をしています。** 〔Chichi wa byouin de isha o shite imasu.〕 — Bố tôi làm bác sĩ ở bệnh viện."
          },
          {
            "q": "{友達|ともだち}＿＿{二人|ふたり}で{住|す}んでいます。　〔Tomodachi __ futari de sunde imasu.〕　— Tôi sống với bạn, hai người.",
            "options": [
              "に",
              "で",
              "と"
            ],
            "correct": 2,
            "why": "Cùng ai → と; tổng số → 二人で. → **{友達|ともだち}と{二人|ふたり}で{住|す}んでいます。** 〔Tomodachi to futari de sunde imasu.〕 — Tôi sống với bạn, hai người."
          },
          {
            "q": "{田中|たなか}さんは{高校|こうこう}＿＿{英語|えいご}を{教|おし}えています。　〔Tanaka-san wa koukou __ eigo o oshiete imasu.〕　— Anh Tanaka dạy tiếng Anh ở trường cấp 3.",
            "options": [
              "で",
              "を",
              "に"
            ],
            "correct": 0,
            "why": "Nơi dạy → で. → **{田中|たなか}さんは{高校|こうこう}で{英語|えいご}を{教|おし}えています。** 〔Tanaka-san wa koukou de eigo o oshiete imasu.〕 — Anh Tanaka dạy tiếng Anh ở trường cấp 3."
          },
          {
            "q": "{祖母|そぼ}は{一人|ひとり}＿＿ダナンに{住|す}んでいます。　〔Sobo wa hitori __ Danan ni sunde imasu.〕　— Bà tôi sống một mình ở Đà Nẵng.",
            "options": [
              "で",
              "と",
              "に"
            ],
            "correct": 0,
            "why": "Một mình → 一人で. → **{祖母|そぼ}は{一人|ひとり}でダナンに{住|す}んでいます。** 〔Sobo wa hitori de Danan ni sunde imasu.〕 — Bà tôi sống một mình ở Đà Nẵng."
          },
          {
            "q": "{私|わたし}は{学校|がっこう}の{近|ちか}く＿＿{住|す}んでいます。　〔Watashi wa gakkou no chikaku __ sunde imasu.〕　— Tôi sống gần trường.",
            "options": [
              "を",
              "に",
              "で"
            ],
            "correct": 1,
            "why": "Nơi ở → に. → **{私|わたし}は{学校|がっこう}の{近|ちか}くに{住|す}んでいます。** 〔Watashi wa gakkou no chikaku ni sunde imasu.〕 — Tôi sống gần trường."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-dap",
        "title": "Hỏi – đáp: chọn câu trả lời đúng (8 câu)",
        "items": [
          {
            "q": "どこに{住|す}んでいますか。　〔Doko ni sunde imasu ka.〕　(Bạn sống ở Hà Nội.)",
            "options": [
              "ハノイで{住|す}んでいます。 (Hanoi de sunde imasu.)",
              "ハノイに{住|す}みます。 (Hanoi ni sumimasu.)",
              "はい、{住|す}んでいます。 (Hai, sunde imasu.)",
              "ハノイに{住|す}んでいます。 (Hanoi ni sunde imasu.)"
            ],
            "correct": 3,
            "why": "Nơi ở + **に** + 住んでいます."
          },
          {
            "q": "{兄弟|きょうだい}がいますか。　〔Kyoudai ga imasu ka.〕　(Bạn có một chị gái.)",
            "options": [
              "はい、{姉|あね}が{一人|ひとり}います。 (Hai, ane ga hitori imasu.)",
              "はい、{姉|あね}が{一人|ひとり}あります。 (Hai, ane ga hitori arimasu.)",
              "はい、お{姉|ねえ}さんが{一人|ひとり}います。 (Hai, oneesan ga hitori imasu.)",
              "はい、{姉|あね}が{一|ひと}ついます。 (Hai, ane ga hitotsu imasu.)"
            ],
            "correct": 0,
            "why": "Chị MÌNH → 姉; người → 一人, います."
          },
          {
            "q": "お{父|とう}さんは{何|なに}をしていますか。　〔Otousan wa nani o shite imasu ka.〕　(Bố bạn là giáo viên cấp 3.)",
            "options": [
              "{父|ちち}は{高校|こうこう}の{先生|せんせい}です。 (Chichi wa koukou no sensei desu.)",
              "{父|ちち}は{高校|こうこう}をしています。 (Chichi wa koukou o shite imasu.)",
              "お{父|とう}さんは{高校|こうこう}の{先生|せんせい}です。 (Otousan wa koukou no sensei desu.)",
              "{父|ちち}は{先生|せんせい}にいます。 (Chichi wa sensei ni imasu.)"
            ],
            "correct": 0,
            "why": "Bố mình → 父; nghề → N です."
          },
          {
            "q": "{誰|だれ}と{住|す}んでいますか。　〔Dare to sunde imasu ka.〕　(Bạn sống với 2 bạn cùng phòng.)",
            "options": [
              "ルームメイトが{三人|さんにん}{住|す}んでいます。 (Ruumumeito ga sannin sunde imasu.)",
              "ルームメイトに{三人|さんにん}で{住|す}んでいます。 (Ruumumeito ni sannin de sunde imasu.)",
              "ルームメイトと{二人|ふたり}で{住|す}んでいます。 (Ruumumeito to futari de sunde imasu.)",
              "ルームメイトと{三人|さんにん}で{住|す}んでいます。 (Ruumumeito to sannin de sunde imasu.)"
            ],
            "correct": 3,
            "why": "Bạn + 2 bạn cùng phòng = **三人で** (tính cả mình)."
          },
          {
            "q": "{家族|かぞく}は{何人|なんにん}ですか。　〔Kazoku wa nannin desu ka.〕　(Bố, mẹ, em trai và bạn.)",
            "options": [
              "{四人|よんにん}です。{父|ちち}と{母|はは}と{弟|おとうと}と{私|わたし}です。 (Yonnin desu. Chichi to haha to otouto to watashi desu.)",
              "{四人|よにん}あります。 (Yonin arimasu.)",
              "{四人|よにん}です。{父|ちち}と{母|はは}と{弟|おとうと}と{私|わたし}です。 (Yonin desu. Chichi to haha to otouto to watashi desu.)",
              "{三人|さんにん}です。{父|ちち}と{母|はは}と{弟|おとうと}です。 (Sannin desu. Chichi to haha to otouto desu.)"
            ],
            "correct": 2,
            "why": "家族は～人 TÍNH cả mình: 4 người, đọc **よにん**."
          },
          {
            "q": "ペットがいますか。　〔Petto ga imasu ka.〕　(Bạn không nuôi con nào.)",
            "options": [
              "いいえ、ありません。 (Iie, arimasen.)",
              "いいえ、いません。 (Iie, imasen.)",
              "はい、いません。 (Hai, imasen.)",
              "いいえ、ペットです。 (Iie, petto desu.)"
            ],
            "correct": 1,
            "why": "Con vật → **いません**."
          },
          {
            "q": "{山田|やまだ}さんは{結婚|けっこん}していますか。　〔Yamada-san wa kekkon shite imasu ka.〕　(Anh Yamada đã kết hôn, có một con gái.)",
            "options": [
              "はい、します。{娘|むすめ}さんが{一人|ひとり}います。 (Hai, shimasu. Musume-san ga hitori imasu.)",
              "いいえ、しています。{娘|むすめ}さんが{一人|ひとり}います。 (Iie, shite imasu. Musume-san ga hitori imasu.)",
              "はい、しています。{娘|むすめ}さんが{一人|ひとり}います。 (Hai, shite imasu. Musume-san ga hitori imasu.)",
              "はい、しています。{娘|むすめ}さんが{一人|ひとり}あります。 (Hai, shite imasu. Musume-san ga hitori arimasu.)"
            ],
            "correct": 2,
            "why": "Đã kết hôn → **しています**; con của người khác → 娘さん, います."
          },
          {
            "q": "お{姉|ねえ}さんはどこで{働|はたら}いていますか。　〔Oneesan wa doko de hataraite imasu ka.〕　(Chị bạn làm ở bệnh viện.)",
            "options": [
              "{姉|あね}は{病院|びょういん}を{働|はたら}いています。 (Ane wa byouin o hataraite imasu.)",
              "{姉|あね}は{病院|びょういん}に{働|はたら}いています。 (Ane wa byouin ni hataraite imasu.)",
              "お{姉|ねえ}さんは{病院|びょういん}で{働|はたら}いています。 (Oneesan wa byouin de hataraite imasu.)",
              "{姉|あね}は{病院|びょういん}で{働|はたら}いています。 (Ane wa byouin de hataraite imasu.)"
            ],
            "correct": 3,
            "why": "Chị mình → 姉; nơi làm việc → **で**."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "(nơi ở)　Câu nào SAI?",
            "options": [
              "{横浜|よこはま}で{働|はたら}いています。 (Yokohama de hataraite imasu.)",
              "{横浜|よこはま}で{住|す}んでいます。 (Yokohama de sunde imasu.)",
              "{横浜|よこはま}に{両親|りょうしん}がいます。 (Yokohama ni ryoushin ga imasu.)",
              "{横浜|よこはま}に{住|す}んでいます。 (Yokohama ni sunde imasu.)"
            ],
            "correct": 1,
            "why": "住んでいます đi với **に**: ~~横浜で住んでいます~~ → 横浜**に**住んでいます."
          },
          {
            "q": "(thể て)　Câu nào SAI?",
            "options": [
              "{東京|とうきょう}に{住|す}みています。 (Toukyou ni sumite imasu.)",
              "{東京|とうきょう}で{働|はたら}いています。 (Toukyou de hataraite imasu.)",
              "{東京|とうきょう}に{住|す}んでいます。 (Toukyou ni sunde imasu.)",
              "{東京|とうきょう}で{勉強|べんきょう}しています。 (Toukyou de benkyou shite imasu.)"
            ],
            "correct": 0,
            "why": "住みます → **住んで** (み → んで)."
          },
          {
            "q": "(số đếm)　Câu nào SAI?",
            "options": [
              "{私|わたし}は{妹|いもうと}が{二人|ふたり}がいます。 (Watashi wa imouto ga futari ga imasu.)",
              "{私|わたし}は{姉|あね}が{一人|ひとり}います。 (Watashi wa ane ga hitori imasu.)",
              "{私|わたし}は{妹|いもうと}が{二人|ふたり}います。 (Watashi wa imouto ga futari imasu.)",
              "{私|わたし}は{猫|ねこ}が{三匹|さんびき}います。 (Watashi wa neko ga sanbiki imasu.)"
            ],
            "correct": 0,
            "why": "Không có trợ từ sau con số: 妹が **二人** います."
          },
          {
            "q": "(います／あります)　Câu nào SAI?",
            "options": [
              "{弟|おとうと}が{一人|ひとり}あります。 (Otouto ga hitori arimasu.)",
              "うさぎが{一匹|いっぴき}います。 (Usagi ga ippiki imasu.)",
              "{辞書|じしょ}が{二|ふた}つあります。 (Jisho ga futatsu arimasu.)",
              "{弟|おとうと}が{一人|ひとり}います。 (Otouto ga hitori imasu.)"
            ],
            "correct": 0,
            "why": "Người → **います**."
          },
          {
            "q": "(～人で)　Câu nào SAI?",
            "options": [
              "{兄|あに}と{二人|ふたり}で{住|す}んでいます。 (Ani to futari de sunde imasu.)",
              "{兄|あに}と{二人|ふたり}{住|す}んでいます。 (Ani to futari sunde imasu.)",
              "{一人|ひとり}で{住|す}んでいます。 (Hitori de sunde imasu.)",
              "{家族|かぞく}と{住|す}んでいます。 (Kazoku to sunde imasu.)"
            ],
            "correct": 1,
            "why": "Thiếu **で**: 兄と 二人**で** 住んでいます."
          },
          {
            "q": "(nơi làm việc)　Câu nào SAI?",
            "options": [
              "{母|はは}は{病院|びょういん}に{働|はたら}いています。 (Haha wa byouin ni hataraite imasu.)",
              "{母|はは}は{病院|びょういん}で{働|はたら}いています。 (Haha wa byouin de hataraite imasu.)",
              "{母|はは}は{医者|いしゃ}です。 (Haha wa isha desu.)",
              "{母|はは}は{病院|びょういん}の{医者|いしゃ}です。 (Haha wa byouin no isha desu.)"
            ],
            "correct": 0,
            "why": "Nơi làm việc → **で**."
          },
          {
            "q": "(結婚)　Câu nào SAI về nghĩa?",
            "options": [
              "{姉|あね}は{結婚|けっこん}していません。 (Ane wa kekkon shite imasen.)",
              "{姉|あね}は{結婚|けっこん}しています。{子|こ}どもが{二人|ふたり}います。 (Ane wa kekkon shite imasu. Kodomo ga futari imasu.)",
              "{姉|あね}は{結婚|けっこん}します。{子|こ}どもが{二人|ふたり}います。 (Ane wa kekkon shimasu. Kodomo ga futari imasu.)",
              "{姉|あね}は{来月|らいげつ}{結婚|けっこん}します。 (Ane wa raigetsu kekkon shimasu.)"
            ],
            "correct": 2,
            "why": "Đã có 2 con → đang trong tình trạng có gia đình → **結婚しています**. 結婚します = sẽ cưới."
          },
          {
            "q": "(câu hỏi)　Câu nào SAI?",
            "options": [
              "どこに{住|す}んでいますか。 (Doko ni sunde imasu ka.)",
              "どこで{働|はたら}いていますか。 (Doko de hataraite imasu ka.)",
              "どこで{住|す}んでいますか。 (Doko de sunde imasu ka.)",
              "{誰|だれ}と{住|す}んでいますか。 (Dare to sunde imasu ka.)"
            ],
            "correct": 2,
            "why": "Hỏi nơi ở → **どこに** 住んでいますか."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-np1-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 72, 73, 79, 80",
        "items": [
          {
            "q": "Tôi đang sống ở Hà Nội.",
            "answers": [
              "私はハノイに住んでいます。",
              "私はハノイにすんでいます。",
              "わたしはハノイに住んでいます。",
              "わたしはハノイにすんでいます。",
              "ハノイに住んでいます。",
              "ハノイにすんでいます。"
            ],
            "hint": "N に 住んでいます"
          },
          {
            "q": "Chị tôi đã có gia đình.",
            "answers": [
              "姉は結婚しています。",
              "姉はけっこんしています。",
              "あねは結婚しています。",
              "あねはけっこんしています。"
            ],
            "hint": "結婚しています"
          },
          {
            "q": "Bố tôi làm việc ở ngân hàng.",
            "answers": [
              "父は銀行で働いています。",
              "父は銀行ではたらいています。",
              "父はぎんこうで働いています。",
              "父はぎんこうではたらいています。",
              "ちちは銀行で働いています。",
              "ちちは銀行ではたらいています。",
              "ちちはぎんこうで働いています。",
              "ちちはぎんこうではたらいています。"
            ],
            "hint": "N で 働いています"
          },
          {
            "q": "Tôi có ba anh chị em.",
            "answers": [
              "私は兄弟が三人います。",
              "私は兄弟がさんにんいます。",
              "私はきょうだいが三人います。",
              "私はきょうだいがさんにんいます。",
              "わたしは兄弟が三人います。",
              "わたしは兄弟がさんにんいます。",
              "わたしはきょうだいが三人います。",
              "わたしはきょうだいがさんにんいます。",
              "兄弟が三人います。",
              "兄弟がさんにんいます。",
              "きょうだいが三人います。",
              "きょうだいがさんにんいます。",
              "兄弟が3人います。",
              "きょうだいが3人います。"
            ],
            "hint": "N が ～人 います"
          },
          {
            "q": "Tôi có hai con mèo.",
            "answers": [
              "猫が二匹います。",
              "猫がにひきいます。",
              "ねこが二匹います。",
              "ねこがにひきいます。",
              "私は猫が二匹います。",
              "私は猫がにひきいます。",
              "私はねこが二匹います。",
              "私はねこがにひきいます。",
              "わたしは猫が二匹います。",
              "わたしは猫がにひきいます。",
              "わたしはねこが二匹います。",
              "わたしはねこがにひきいます。",
              "猫が2匹います。",
              "ねこが2匹います。"
            ],
            "hint": "N が ～匹 います"
          },
          {
            "q": "Tôi sống một mình.",
            "answers": [
              "一人で住んでいます。",
              "一人ですんでいます。",
              "ひとりで住んでいます。",
              "ひとりですんでいます。",
              "私は一人で住んでいます。",
              "私は一人ですんでいます。",
              "私はひとりで住んでいます。",
              "私はひとりですんでいます。",
              "わたしは一人で住んでいます。",
              "わたしは一人ですんでいます。",
              "わたしはひとりで住んでいます。",
              "わたしはひとりですんでいます。",
              "1人で住んでいます。",
              "1人ですんでいます。"
            ],
            "hint": "一人で"
          },
          {
            "q": "Bạn có anh chị em không?",
            "answers": [
              "兄弟がいますか。",
              "きょうだいがいますか。",
              "ご兄弟がいますか。",
              "ごきょうだいがいますか。",
              "兄弟はいますか。",
              "きょうだいはいますか。",
              "ご兄弟はいますか。",
              "ごきょうだいはいますか。"
            ],
            "hint": "N が いますか"
          },
          {
            "q": "Mẹ tôi dạy tiếng Nhật ở trường đại học.",
            "answers": [
              "母は大学で日本語を教えています。",
              "母は大学で日本語をおしえています。",
              "母は大学でにほんごを教えています。",
              "母は大学でにほんごをおしえています。",
              "母はだいがくで日本語を教えています。",
              "母はだいがくで日本語をおしえています。",
              "母はだいがくでにほんごを教えています。",
              "母はだいがくでにほんごをおしえています。",
              "ははは大学で日本語を教えています。",
              "ははは大学で日本語をおしえています。",
              "ははは大学でにほんごを教えています。",
              "ははは大学でにほんごをおしえています。",
              "はははだいがくで日本語を教えています。",
              "はははだいがくで日本語をおしえています。",
              "はははだいがくでにほんごを教えています。",
              "はははだいがくでにほんごをおしえています。"
            ],
            "hint": "N で N を 教えています"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-np1-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Tôi đang sống ở Yokohama.",
            "chips": [
              "{私|わたし}は",
              "{住|す}んでいます",
              "{住|す}みます",
              "{横浜|よこはま}で",
              "{横浜|よこはま}に"
            ],
            "answer": [
              "{私|わたし}は",
              "{横浜|よこはま}に",
              "{住|す}んでいます"
            ],
            "ro": "Watashi wa Yokohama ni sunde imasu"
          },
          {
            "vi": "Anh tôi dạy tiếng Anh ở trường cấp 3.",
            "chips": [
              "{兄|あに}は",
              "{高校|こうこう}に",
              "{高校|こうこう}で",
              "{教|おし}えています",
              "{英語|えいご}を"
            ],
            "answer": [
              "{兄|あに}は",
              "{高校|こうこう}で",
              "{英語|えいご}を",
              "{教|おし}えています"
            ],
            "ro": "Ani wa koukou de eigo o oshiete imasu"
          },
          {
            "vi": "Tôi có một anh trai và hai em gái.",
            "chips": [
              "{兄|あに}が{一人|ひとり}と",
              "{二人|ふたり}",
              "あります",
              "います",
              "{妹|いもうと}が",
              "{私|わたし}は"
            ],
            "answer": [
              "{私|わたし}は",
              "{兄|あに}が{一人|ひとり}と",
              "{妹|いもうと}が",
              "{二人|ふたり}",
              "います"
            ],
            "ro": "Watashi wa ani ga hitori to imouto ga futari imasu"
          },
          {
            "vi": "Tôi sống với bạn, tổng cộng hai người.",
            "chips": [
              "{三人|さんにん}で",
              "{二人|ふたり}で",
              "{住|す}んでいます",
              "{友達|ともだち}と"
            ],
            "answer": [
              "{友達|ともだち}と",
              "{二人|ふたり}で",
              "{住|す}んでいます"
            ],
            "ro": "Tomodachi to futari de sunde imasu"
          },
          {
            "vi": "Chị tôi đã có gia đình.",
            "chips": [
              "{姉|あね}は",
              "します",
              "{結婚|けっこん}",
              "しています"
            ],
            "answer": [
              "{姉|あね}は",
              "{結婚|けっこん}",
              "しています"
            ],
            "ro": "Ane wa kekkon shite imasu"
          },
          {
            "vi": "Em trai tôi đang học kinh tế ở đại học.",
            "chips": [
              "{弟|おとうと}は",
              "{勉強|べんきょう}しています",
              "{経済|けいざい}を",
              "{大学|だいがく}に",
              "{大学|だいがく}で"
            ],
            "answer": [
              "{弟|おとうと}は",
              "{大学|だいがく}で",
              "{経済|けいざい}を",
              "{勉強|べんきょう}しています"
            ],
            "ro": "Otouto wa daigaku de keizai o benkyou shite imasu"
          },
          {
            "vi": "Nhà bạn mấy người?",
            "chips": [
              "{何匹|なんびき}",
              "ご{家族|かぞく}は",
              "ですか",
              "{何人|なんにん}"
            ],
            "answer": [
              "ご{家族|かぞく}は",
              "{何人|なんにん}",
              "ですか"
            ],
            "ro": "Gokazoku wa nannin desu ka"
          },
          {
            "vi": "Bạn sống với ai?",
            "chips": [
              "{誰|だれ}に",
              "{誰|だれ}と",
              "いますか",
              "{住|す}んで"
            ],
            "answer": [
              "{誰|だれ}と",
              "{住|す}んで",
              "いますか"
            ],
            "ro": "Dare to sunde imasu ka"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch đoạn · nhiều ô trống · tình huống thi nói"
      },
      {
        "t": "quiz",
        "id": "lt-b8-np1-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 72, 73, 79, 80",
        "items": [
          {
            "q": "Bố mẹ tôi sống ở Đà Nẵng. Bố tôi làm việc ở bệnh viện.",
            "answers": [
              "両親はダナンに住んでいます。父は病院で働いています。",
              "両親はダナンに住んでいます。父は病院ではたらいています。",
              "両親はダナンに住んでいます。父はびょういんで働いています。",
              "両親はダナンに住んでいます。父はびょういんではたらいています。",
              "両親はダナンに住んでいます。ちちは病院で働いています。",
              "両親はダナンに住んでいます。ちちは病院ではたらいています。",
              "両親はダナンに住んでいます。ちちはびょういんで働いています。",
              "両親はダナンに住んでいます。ちちはびょういんではたらいています。",
              "両親はダナンにすんでいます。父は病院で働いています。",
              "両親はダナンにすんでいます。父は病院ではたらいています。",
              "両親はダナンにすんでいます。父はびょういんで働いています。",
              "両親はダナンにすんでいます。父はびょういんではたらいています。",
              "両親はダナンにすんでいます。ちちは病院で働いています。",
              "両親はダナンにすんでいます。ちちは病院ではたらいています。",
              "両親はダナンにすんでいます。ちちはびょういんで働いています。",
              "両親はダナンにすんでいます。ちちはびょういんではたらいています。",
              "りょうしんはダナンに住んでいます。父は病院で働いています。",
              "りょうしんはダナンに住んでいます。父は病院ではたらいています。",
              "りょうしんはダナンに住んでいます。父はびょういんで働いています。",
              "りょうしんはダナンに住んでいます。父はびょういんではたらいています。",
              "りょうしんはダナンに住んでいます。ちちは病院で働いています。",
              "りょうしんはダナンに住んでいます。ちちは病院ではたらいています。",
              "りょうしんはダナンに住んでいます。ちちはびょういんで働いています。",
              "りょうしんはダナンに住んでいます。ちちはびょういんではたらいています。",
              "りょうしんはダナンにすんでいます。父は病院で働いています。",
              "りょうしんはダナンにすんでいます。父は病院ではたらいています。",
              "りょうしんはダナンにすんでいます。父はびょういんで働いています。",
              "りょうしんはダナンにすんでいます。父はびょういんではたらいています。",
              "りょうしんはダナンにすんでいます。ちちは病院で働いています。",
              "りょうしんはダナンにすんでいます。ちちは病院ではたらいています。",
              "りょうしんはダナンにすんでいます。ちちはびょういんで働いています。",
              "りょうしんはダナンにすんでいます。ちちはびょういんではたらいています。"
            ],
            "hint": "に 住んでいます · で 働いています"
          },
          {
            "q": "Bạn có anh chị em không? — Có, tôi có một chị gái.",
            "answers": [
              "兄弟がいますか。はい、姉が一人います。",
              "兄弟がいますか。はい、姉がひとりいます。",
              "兄弟がいますか。はい、あねが一人います。",
              "兄弟がいますか。はい、あねがひとりいます。",
              "きょうだいがいますか。はい、姉が一人います。",
              "きょうだいがいますか。はい、姉がひとりいます。",
              "きょうだいがいますか。はい、あねが一人います。",
              "きょうだいがいますか。はい、あねがひとりいます。",
              "ご兄弟がいますか。はい、姉が一人います。",
              "ご兄弟がいますか。はい、姉がひとりいます。",
              "ご兄弟がいますか。はい、あねが一人います。",
              "ご兄弟がいますか。はい、あねがひとりいます。",
              "ごきょうだいがいますか。はい、姉が一人います。",
              "ごきょうだいがいますか。はい、姉がひとりいます。",
              "ごきょうだいがいますか。はい、あねが一人います。",
              "ごきょうだいがいますか。はい、あねがひとりいます。",
              "ご兄弟はいますか。はい、姉が一人います。",
              "ご兄弟はいますか。はい、姉がひとりいます。",
              "ご兄弟はいますか。はい、あねが一人います。",
              "ご兄弟はいますか。はい、あねがひとりいます。",
              "ごきょうだいはいますか。はい、姉が一人います。",
              "ごきょうだいはいますか。はい、姉がひとりいます。",
              "ごきょうだいはいますか。はい、あねが一人います。",
              "ごきょうだいはいますか。はい、あねがひとりいます。"
            ],
            "hint": "N が いますか"
          },
          {
            "q": "Nhà tôi có năm người: bố, mẹ, anh trai, em gái và tôi.",
            "answers": [
              "家族は五人です。父と母と兄と妹と私です。",
              "かぞくはごにんです。ちちとははとあにといもうととわたしです。",
              "かぞくは五人です。父と母と兄と妹と私です。",
              "家族はごにんです。ちちとははとあにといもうととわたしです。",
              "家族はごにんです。父と母と兄と妹と私です。",
              "かぞくは五人です。ちちとははとあにといもうととわたしです。",
              "家族は五人です。ちちと母と兄と妹と私です。",
              "かぞくはごにんです。父とははとあにといもうととわたしです。",
              "家族は五人です。父とははと兄と妹と私です。",
              "かぞくはごにんです。ちちと母とあにといもうととわたしです。",
              "家族は五人です。父と母とあにと妹と私です。",
              "かぞくはごにんです。ちちとははと兄といもうととわたしです。",
              "家族は五人です。父と母と兄といもうとと私です。",
              "かぞくはごにんです。ちちとははとあにと妹とわたしです。",
              "家族は五人です。父と母と兄と妹とわたしです。",
              "かぞくはごにんです。ちちとははとあにといもうとと私です。",
              "家族は5人です。父と母と兄と妹と私です。",
              "かぞくは5人です。父と母と兄と妹と私です。",
              "かぞくは5人です。ちちとははとあにといもうととわたしです。",
              "家族は5人です。ちちと母と兄と妹と私です。",
              "家族は5人です。父とははと兄と妹と私です。",
              "家族は5人です。父と母とあにと妹と私です。",
              "家族は5人です。父と母と兄といもうとと私です。",
              "家族は5人です。父と母と兄と妹とわたしです。"
            ],
            "hint": "家族は ～人です"
          },
          {
            "q": "Tôi sống cùng hai bạn cùng phòng.",
            "answers": [
              "ルームメイトと三人で住んでいます。",
              "ルームメイトと三人ですんでいます。",
              "ルームメイトとさんにんで住んでいます。",
              "ルームメイトとさんにんですんでいます。",
              "私はルームメイトと三人で住んでいます。",
              "私はルームメイトと三人ですんでいます。",
              "私はルームメイトとさんにんで住んでいます。",
              "私はルームメイトとさんにんですんでいます。",
              "わたしはルームメイトと三人で住んでいます。",
              "わたしはルームメイトと三人ですんでいます。",
              "わたしはルームメイトとさんにんで住んでいます。",
              "わたしはルームメイトとさんにんですんでいます。",
              "ルームメイトと3人で住んでいます。",
              "ルームメイトと3人ですんでいます。"
            ],
            "hint": "Số + で tính cả mình"
          },
          {
            "q": "Anh trai bạn làm nghề gì?",
            "answers": [
              "お兄さんは何をしていますか。",
              "お兄さんはなにをしていますか。",
              "おにいさんは何をしていますか。",
              "おにいさんはなにをしていますか。",
              "お兄さんのお仕事は何ですか。",
              "お兄さんのお仕事はなんですか。",
              "お兄さんのおしごとは何ですか。",
              "お兄さんのおしごとはなんですか。",
              "おにいさんのお仕事は何ですか。",
              "おにいさんのお仕事はなんですか。",
              "おにいさんのおしごとは何ですか。",
              "おにいさんのおしごとはなんですか。"
            ],
            "hint": "何を していますか"
          },
          {
            "q": "Anh Tanaka đã lập gia đình chưa? — Chưa.",
            "answers": [
              "田中さんは結婚していますか。いいえ、結婚していません。",
              "田中さんは結婚していますか。いいえ、けっこんしていません。",
              "田中さんはけっこんしていますか。いいえ、結婚していません。",
              "田中さんはけっこんしていますか。いいえ、けっこんしていません。",
              "たなかさんは結婚していますか。いいえ、結婚していません。",
              "たなかさんは結婚していますか。いいえ、けっこんしていません。",
              "たなかさんはけっこんしていますか。いいえ、結婚していません。",
              "たなかさんはけっこんしていますか。いいえ、けっこんしていません。",
              "田中さんは結婚していますか。いいえ、していません。",
              "田中さんはけっこんしていますか。いいえ、していません。",
              "たなかさんは結婚していますか。いいえ、していません。",
              "たなかさんはけっこんしていますか。いいえ、していません。"
            ],
            "hint": "結婚して いません"
          },
          {
            "q": "Tôi có ba con thỏ.",
            "answers": [
              "うさぎが三匹います。",
              "うさぎがさんびきいます。",
              "私はうさぎが三匹います。",
              "私はうさぎがさんびきいます。",
              "わたしはうさぎが三匹います。",
              "わたしはうさぎがさんびきいます。",
              "うさぎが3匹います。"
            ],
            "hint": "～匹 います"
          },
          {
            "q": "Em gái tôi là học sinh cấp 3. Em ấy đang học tiếng Anh ở trường.",
            "answers": [
              "妹は高校生です。高校で英語を勉強しています。",
              "妹は高校生です。高校で英語をべんきょうしています。",
              "妹は高校生です。高校でえいごを勉強しています。",
              "妹は高校生です。高校でえいごをべんきょうしています。",
              "妹は高校生です。こうこうで英語を勉強しています。",
              "妹は高校生です。こうこうで英語をべんきょうしています。",
              "妹は高校生です。こうこうでえいごを勉強しています。",
              "妹は高校生です。こうこうでえいごをべんきょうしています。",
              "妹はこうこうせいです。高校で英語を勉強しています。",
              "妹はこうこうせいです。高校で英語をべんきょうしています。",
              "妹はこうこうせいです。高校でえいごを勉強しています。",
              "妹はこうこうせいです。高校でえいごをべんきょうしています。",
              "妹はこうこうせいです。こうこうで英語を勉強しています。",
              "妹はこうこうせいです。こうこうで英語をべんきょうしています。",
              "妹はこうこうせいです。こうこうでえいごを勉強しています。",
              "妹はこうこうせいです。こうこうでえいごをべんきょうしています。",
              "いもうとは高校生です。高校で英語を勉強しています。",
              "いもうとは高校生です。高校で英語をべんきょうしています。",
              "いもうとは高校生です。高校でえいごを勉強しています。",
              "いもうとは高校生です。高校でえいごをべんきょうしています。",
              "いもうとは高校生です。こうこうで英語を勉強しています。",
              "いもうとは高校生です。こうこうで英語をべんきょうしています。",
              "いもうとは高校生です。こうこうでえいごを勉強しています。",
              "いもうとは高校生です。こうこうでえいごをべんきょうしています。",
              "いもうとはこうこうせいです。高校で英語を勉強しています。",
              "いもうとはこうこうせいです。高校で英語をべんきょうしています。",
              "いもうとはこうこうせいです。高校でえいごを勉強しています。",
              "いもうとはこうこうせいです。高校でえいごをべんきょうしています。",
              "いもうとはこうこうせいです。こうこうで英語を勉強しています。",
              "いもうとはこうこうせいです。こうこうで英語をべんきょうしています。",
              "いもうとはこうこうせいです。こうこうでえいごを勉強しています。",
              "いもうとはこうこうせいです。こうこうでえいごをべんきょうしています。",
              "妹は高校生です。学校で英語を勉強しています。",
              "妹は高校生です。学校で英語をべんきょうしています。",
              "妹は高校生です。学校でえいごを勉強しています。",
              "妹は高校生です。学校でえいごをべんきょうしています。",
              "妹は高校生です。がっこうで英語を勉強しています。",
              "妹は高校生です。がっこうで英語をべんきょうしています。",
              "妹は高校生です。がっこうでえいごを勉強しています。",
              "妹は高校生です。がっこうでえいごをべんきょうしています。",
              "妹はこうこうせいです。学校で英語を勉強しています。",
              "妹はこうこうせいです。学校で英語をべんきょうしています。",
              "妹はこうこうせいです。学校でえいごを勉強しています。",
              "妹はこうこうせいです。学校でえいごをべんきょうしています。",
              "妹はこうこうせいです。がっこうで英語を勉強しています。",
              "妹はこうこうせいです。がっこうで英語をべんきょうしています。",
              "妹はこうこうせいです。がっこうでえいごを勉強しています。",
              "妹はこうこうせいです。がっこうでえいごをべんきょうしています。",
              "いもうとは高校生です。学校で英語を勉強しています。",
              "いもうとは高校生です。学校で英語をべんきょうしています。",
              "いもうとは高校生です。学校でえいごを勉強しています。",
              "いもうとは高校生です。学校でえいごをべんきょうしています。",
              "いもうとは高校生です。がっこうで英語を勉強しています。",
              "いもうとは高校生です。がっこうで英語をべんきょうしています。",
              "いもうとは高校生です。がっこうでえいごを勉強しています。",
              "いもうとは高校生です。がっこうでえいごをべんきょうしています。",
              "いもうとはこうこうせいです。学校で英語を勉強しています。",
              "いもうとはこうこうせいです。学校で英語をべんきょうしています。",
              "いもうとはこうこうせいです。学校でえいごを勉強しています。",
              "いもうとはこうこうせいです。学校でえいごをべんきょうしています。",
              "いもうとはこうこうせいです。がっこうで英語を勉強しています。",
              "いもうとはこうこうせいです。がっこうで英語をべんきょうしています。",
              "いもうとはこうこうせいです。がっこうでえいごを勉強しています。",
              "いもうとはこうこうせいです。がっこうでえいごをべんきょうしています。"
            ],
            "hint": "で 勉強しています"
          },
          {
            "q": "Cuối tuần tôi đi du lịch với bạn bè, tổng cộng bốn người.",
            "answers": [
              "週末、友達と四人で旅行に行きます。",
              "週末、友達と四人で旅行にいきます。",
              "週末、友達と四人でりょこうに行きます。",
              "週末、友達と四人でりょこうにいきます。",
              "週末、友達とよにんで旅行に行きます。",
              "週末、友達とよにんで旅行にいきます。",
              "週末、友達とよにんでりょこうに行きます。",
              "週末、友達とよにんでりょこうにいきます。",
              "週末、ともだちと四人で旅行に行きます。",
              "週末、ともだちと四人で旅行にいきます。",
              "週末、ともだちと四人でりょこうに行きます。",
              "週末、ともだちと四人でりょこうにいきます。",
              "週末、ともだちとよにんで旅行に行きます。",
              "週末、ともだちとよにんで旅行にいきます。",
              "週末、ともだちとよにんでりょこうに行きます。",
              "週末、ともだちとよにんでりょこうにいきます。",
              "しゅうまつ、友達と四人で旅行に行きます。",
              "しゅうまつ、友達と四人で旅行にいきます。",
              "しゅうまつ、友達と四人でりょこうに行きます。",
              "しゅうまつ、友達と四人でりょこうにいきます。",
              "しゅうまつ、友達とよにんで旅行に行きます。",
              "しゅうまつ、友達とよにんで旅行にいきます。",
              "しゅうまつ、友達とよにんでりょこうに行きます。",
              "しゅうまつ、友達とよにんでりょこうにいきます。",
              "しゅうまつ、ともだちと四人で旅行に行きます。",
              "しゅうまつ、ともだちと四人で旅行にいきます。",
              "しゅうまつ、ともだちと四人でりょこうに行きます。",
              "しゅうまつ、ともだちと四人でりょこうにいきます。",
              "しゅうまつ、ともだちとよにんで旅行に行きます。",
              "しゅうまつ、ともだちとよにんで旅行にいきます。",
              "しゅうまつ、ともだちとよにんでりょこうに行きます。",
              "しゅうまつ、ともだちとよにんでりょこうにいきます。",
              "週末、友達と四人で旅行に行きました。",
              "週末、友達と四人で旅行にいきました。",
              "週末、友達と四人でりょこうに行きました。",
              "週末、友達と四人でりょこうにいきました。",
              "週末、友達とよにんで旅行に行きました。",
              "週末、友達とよにんで旅行にいきました。",
              "週末、友達とよにんでりょこうに行きました。",
              "週末、友達とよにんでりょこうにいきました。",
              "週末、ともだちと四人で旅行に行きました。",
              "週末、ともだちと四人で旅行にいきました。",
              "週末、ともだちと四人でりょこうに行きました。",
              "週末、ともだちと四人でりょこうにいきました。",
              "週末、ともだちとよにんで旅行に行きました。",
              "週末、ともだちとよにんで旅行にいきました。",
              "週末、ともだちとよにんでりょこうに行きました。",
              "週末、ともだちとよにんでりょこうにいきました。",
              "しゅうまつ、友達と四人で旅行に行きました。",
              "しゅうまつ、友達と四人で旅行にいきました。",
              "しゅうまつ、友達と四人でりょこうに行きました。",
              "しゅうまつ、友達と四人でりょこうにいきました。",
              "しゅうまつ、友達とよにんで旅行に行きました。",
              "しゅうまつ、友達とよにんで旅行にいきました。",
              "しゅうまつ、友達とよにんでりょこうに行きました。",
              "しゅうまつ、友達とよにんでりょこうにいきました。",
              "しゅうまつ、ともだちと四人で旅行に行きました。",
              "しゅうまつ、ともだちと四人で旅行にいきました。",
              "しゅうまつ、ともだちと四人でりょこうに行きました。",
              "しゅうまつ、ともだちと四人でりょこうにいきました。",
              "しゅうまつ、ともだちとよにんで旅行に行きました。",
              "しゅうまつ、ともだちとよにんで旅行にいきました。",
              "しゅうまつ、ともだちとよにんでりょこうに行きました。",
              "しゅうまつ、ともだちとよにんでりょこうにいきました。",
              "週末、友達と4人で旅行に行きます。",
              "週末、友達と4人で旅行にいきます。",
              "週末、友達と4人でりょこうに行きます。",
              "週末、友達と4人でりょこうにいきます。",
              "週末、ともだちと4人で旅行に行きます。",
              "週末、ともだちと4人で旅行にいきます。",
              "週末、ともだちと4人でりょこうに行きます。",
              "週末、ともだちと4人でりょこうにいきます。",
              "しゅうまつ、友達と4人で旅行に行きます。",
              "しゅうまつ、友達と4人で旅行にいきます。",
              "しゅうまつ、友達と4人でりょこうに行きます。",
              "しゅうまつ、友達と4人でりょこうにいきます。",
              "しゅうまつ、ともだちと4人で旅行に行きます。",
              "しゅうまつ、ともだちと4人で旅行にいきます。",
              "しゅうまつ、ともだちと4人でりょこうに行きます。",
              "しゅうまつ、ともだちと4人でりょこうにいきます。"
            ],
            "hint": "N と ～人で"
          },
          {
            "q": "Bà tôi sống một mình ở Hà Nội.",
            "answers": [
              "祖母は一人でハノイに住んでいます。",
              "祖母は一人でハノイにすんでいます。",
              "祖母はひとりでハノイに住んでいます。",
              "祖母はひとりでハノイにすんでいます。",
              "そぼは一人でハノイに住んでいます。",
              "そぼは一人でハノイにすんでいます。",
              "そぼはひとりでハノイに住んでいます。",
              "そぼはひとりでハノイにすんでいます。",
              "祖母はハノイに一人で住んでいます。",
              "祖母はハノイに一人ですんでいます。",
              "祖母はハノイにひとりで住んでいます。",
              "祖母はハノイにひとりですんでいます。",
              "そぼはハノイに一人で住んでいます。",
              "そぼはハノイに一人ですんでいます。",
              "そぼはハノイにひとりで住んでいます。",
              "そぼはハノイにひとりですんでいます。"
            ],
            "hint": "一人で · に 住んでいます"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{父|ちち}は{銀行|ぎんこう}（①）{働|はたら}いています。{大阪|おおさか}（②）{住|す}んでいます。　〔Chichi wa ginkou ((1)) hataraite imasu. Oosaka ((2)) sunde imasu.〕　— Bố tôi làm ở ngân hàng. Bố sống ở Osaka.",
            "options": [
              "① に　② に",
              "① で　② に",
              "① に　② で",
              "① で　② で"
            ],
            "correct": 1,
            "why": "Nơi làm việc **で**, nơi ở **に**. → **{父|ちち}は{銀行|ぎんこう}で{働|はたら}いています。{大阪|おおさか}に{住|す}んでいます。** 〔Chichi wa ginkou de hataraite imasu. Oosaka ni sunde imasu.〕 — Bố tôi làm ở ngân hàng. Bố sống ở Osaka."
          },
          {
            "q": "{私|わたし}は{姉|あね}（①）{一人|ひとり}（②）{弟|おとうと}が{一人|ひとり}います。　〔Watashi wa ane ((1)) hitori ((2)) otouto ga hitori imasu.〕　— Tôi có một chị gái và một em trai.",
            "options": [
              "① を　② と",
              "① は　② で",
              "① が　② と",
              "① が　② も"
            ],
            "correct": 2,
            "why": "N **が** số **と** N が số います. → **{私|わたし}は{姉|あね}が{一人|ひとり}と{弟|おとうと}が{一人|ひとり}います。** 〔Watashi wa ane ga hitori to otouto ga hitori imasu.〕 — Tôi có một chị gái và một em trai."
          },
          {
            "q": "{友達|ともだち}（①）{三人|さんにん}（②）{住|す}んでいます。　〔Tomodachi ((1)) sannin ((2)) sunde imasu.〕　— Tôi sống với bạn bè, tổng cộng ba người.",
            "options": [
              "① が　② に",
              "① と　② に",
              "① で　② と",
              "① と　② で"
            ],
            "correct": 3,
            "why": "Cùng ai **と**, tổng số **で**. → **{友達|ともだち}と{三人|さんにん}で{住|す}んでいます。** 〔Tomodachi to sannin de sunde imasu.〕 — Tôi sống với bạn bè, tổng cộng ba người."
          },
          {
            "q": "お{母|かあ}さんは{何|なに}（①）していますか。——{母|はは}は{高校|こうこう}（②）{先生|せんせい}です。　〔Okaasan wa nani ((1)) shite imasu ka. — Haha wa koukou ((2)) sensei desu.〕　— Mẹ bạn làm nghề gì? — Mẹ tôi là giáo viên cấp 3.",
            "options": [
              "① は　② の",
              "① が　② で",
              "① を　② に",
              "① を　② の"
            ],
            "correct": 3,
            "why": "何**を** していますか · 高校**の**先生. → **お{母|かあ}さんは{何|なに}をしていますか。——{母|はは}は{高校|こうこう}の{先生|せんせい}です。** 〔Okaasan wa nani o shite imasu ka. — Haha wa koukou no sensei desu.〕 — Mẹ bạn làm nghề gì? — Mẹ tôi là giáo viên cấp 3."
          },
          {
            "q": "{猫|ねこ}（①）{二匹|にひき}（②）。　〔Neko ((1)) nihiki ((2)).〕　— Có hai con mèo.",
            "options": [
              "① を　② あります",
              "① が　② あります",
              "① に　② います",
              "① が　② います"
            ],
            "correct": 3,
            "why": "Con vật **が** … **います**. → **{猫|ねこ}が{二匹|にひき}います。** 〔Neko ga nihiki imasu.〕 — Có hai con mèo."
          },
          {
            "q": "{妹|いもうと}は{結婚|けっこん}（①）いません。{両親|りょうしん}（②）{住|す}んでいます。　〔Imouto wa kekkon ((1)) imasen. Ryoushin ((2)) sunde imasu.〕　— Em gái tôi chưa kết hôn. Em sống cùng bố mẹ.",
            "options": [
              "① し　② と",
              "① して　② と",
              "① して　② で",
              "① する　② に"
            ],
            "correct": 1,
            "why": "結婚**して**いません · 両親**と** (cùng bố mẹ). → **{妹|いもうと}は{結婚|けっこん}していません。{両親|りょうしん}と{住|す}んでいます。** 〔Imouto wa kekkon shite imasen. Ryoushin to sunde imasu.〕 — Em gái tôi chưa kết hôn. Em sống cùng bố mẹ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np1-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Cô giáo hỏi bạn sống ở đâu. Bạn sống ở Mitaka. Bạn nói:",
            "options": [
              "{三鷹|みたか}に{住|す}みます。 (Mitaka ni sumimasu.)",
              "{三鷹|みたか}で{住|す}んでいます。 (Mitaka de sunde imasu.)",
              "{三鷹|みたか}に{住|す}んでいます。 (Mitaka ni sunde imasu.)",
              "{三鷹|みたか}へ{住|す}んでいます。 (Mitaka e sunde imasu.)"
            ],
            "correct": 2,
            "why": "に + 住んでいます."
          },
          {
            "q": "Kể với bạn mới: bố bạn là bác sĩ, làm ở bệnh viện.",
            "options": [
              "{父|ちち}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。 (Chichi wa isha desu. Byouin de hataraite imasu.)",
              "{父|ちち}は{医者|いしゃ}です。{病院|びょういん}に{働|はたら}いています。 (Chichi wa isha desu. Byouin ni hataraite imasu.)",
              "お{父|とう}さんは{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。 (Otousan wa isha desu. Byouin de hataraite imasu.)",
              "{父|ちち}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}きています。 (Chichi wa isha desu. Byouin de hatarakite imasu.)"
            ],
            "correct": 0,
            "why": "Bố mình 父 · nơi làm việc で · 働いて."
          },
          {
            "q": "Bạn muốn hỏi lịch sự người mới quen xem họ có anh chị em không.",
            "options": [
              "ご{兄弟|きょうだい}をいますか。 (Gokyoudai o imasu ka.)",
              "ご{兄弟|きょうだい}がいますか。 (Gokyoudai ga imasu ka.)",
              "ご{兄弟|きょうだい}は{何|なん}ですか。 (Gokyoudai wa nan desu ka.)",
              "ご{兄弟|きょうだい}がありますか。 (Gokyoudai ga arimasu ka.)"
            ],
            "correct": 1,
            "why": "ご兄弟 (lịch sự) + が + いますか."
          },
          {
            "q": "Bạn sống với 3 bạn cùng phòng (tổng 4 người).",
            "options": [
              "ルームメイトと{三人|さんにん}で{住|す}んでいます。 (Ruumumeito to sannin de sunde imasu.)",
              "ルームメイトと{四人|よにん}で{住|す}んでいます。 (Ruumumeito to yonin de sunde imasu.)",
              "ルームメイトが{四人|よにん}で{住|す}んでいます。 (Ruumumeito ga yonin de sunde imasu.)",
              "ルームメイトと{四人|よんにん}に{住|す}んでいます。 (Ruumumeito to yonnin ni sunde imasu.)"
            ],
            "correct": 1,
            "why": "3 bạn + mình = **四人で** (よにん)."
          },
          {
            "q": "Giám khảo hỏi 「ペットが いますか」. Bạn nuôi một con chó.",
            "options": [
              "はい、{犬|いぬ}が{一人|ひとり}います。 (Hai, inu ga hitori imasu.)",
              "はい、{犬|いぬ}が{一匹|いっぴき}あります。 (Hai, inu ga ippiki arimasu.)",
              "はい、{犬|いぬ}を{一匹|いちひき}います。 (Hai, inu o ichihiki imasu.)",
              "はい、{犬|いぬ}が{一匹|いっぴき}います。 (Hai, inu ga ippiki imasu.)"
            ],
            "correct": 3,
            "why": "Con vật: が · 一匹 いっぴき · います."
          },
          {
            "q": "Giới thiệu anh trai: là nhân viên công ty và đã kết hôn.",
            "options": [
              "{兄|あに}は{会社員|かいしゃいん}です。{結婚|けっこん}しています。 (Ani wa kaishain desu. Kekkon shite imasu.)",
              "{兄|あに}は{会社員|かいしゃいん}です。{結婚|けっこん}します。 (Ani wa kaishain desu. Kekkon shimasu.)",
              "{兄|あに}は{会社員|かいしゃいん}をしています。{結婚|けっこん}です。 (Ani wa kaishain o shite imasu. Kekkon desu.)",
              "お{兄|にい}さんは{会社員|かいしゃいん}です。{結婚|けっこん}しています。 (Oniisan wa kaishain desu. Kekkon shite imasu.)"
            ],
            "correct": 0,
            "why": "Anh mình 兄 · trạng thái → 結婚しています."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**に** = nơi ở (住んでいます), nơi tồn tại (います) · **で** = nơi làm việc/học (働いています, 勉強しています) · **と** = cùng ai · **～人で** = tổng số người, tính cả mình.",
          "Thi nói hay hỏi: 「どこに すんでいますか」「かぞくは なんにんですか」「きょうだいが いますか」「おとうさんは なにを していますか」 — trả lời TRỌN CÂU, nhớ đổi お父さん → **父**."
        ]
      }
    ]
  },
  {
    "id": "lt-b8-np-2",
    "kind": "homework",
    "title": "Luyện thêm Bài 8 · Ngữ pháp 2 (ポイント 74, 75) — tả người: N1 は N2 が A · nối tính từ ～くて／～で (~100 câu)",
    "goal": "Tả ngoại hình, tính cách, kỹ năng của một người bằng N1 は N2 が A です; nối hai ý bằng イA‑くて／ナA・N で (いい → よくて); dùng cụm tả trước danh từ (背が高い人, サッカーが上手な人).",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Tả người luôn có HAI tầng: **người (は)** — **đặc điểm (が)** — tính từ. Tiếng Việt \"Daniel cao\" → tiếng Nhật \"Daniel thì **chiều cao** cao\": ダニエルさんは **背が** 高いです.",
          "Nối hai ý: **イA bỏ い + くて** (大きい → 大きくて; **いい → よくて**, かっこいい → かっこよくて) · **ナA bỏ な + で** (親切 → 親切で; **きれい → きれいで**) · **N + で** (学生で). KHÔNG dùng と để nối tính từ.",
          "Phủ định: イA → ～くないです (いい → よくないです) · ナA → ～じゃありません. Quá khứ chỉ đặt ở tính từ CUỐI câu."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**N1(người) は N2(bộ phận / kỹ năng) が A です。** — 姉は髪が長いです · マルコさんはサッカーが上手です.",
          "**イA‑くて、～** · **ナA で、～** · **N で、～** — 目が大きくて、髪が長いです · まじめで、親切です · 医者で、横浜に住んでいます.",
          "**Cụm tả + 人**: 背が高い人 · 髪が長い人 · サッカーが上手**な**人 (ナA thêm な). Hỏi: **～さんは どんな人ですか。**"
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · trợ từ は／が · chia ～くて／～で"
      },
      {
        "t": "mcq",
        "id": "lt-b8-np2-74",
        "title": "ポイント 74: N1 は N2 が A です (12 câu)",
        "items": [
          {
            "q": "ダニエルさんは{背|せ}＿＿{高|たか}いです。　〔Danieru-san wa se __ takai desu.〕　— Daniel cao.",
            "options": [
              "は",
              "が",
              "を",
              "で"
            ],
            "correct": 1,
            "why": "Người **は** — đặc điểm **が**. → **ダニエルさんは{背|せ}が{高|たか}いです。** 〔Danieru-san wa se ga takai desu.〕 — Daniel cao."
          },
          {
            "q": "アンナさん＿＿{髪|かみ}が{長|なが}いです。　〔Anna-san __ kami ga nagai desu.〕　— Anna tóc dài.",
            "options": [
              "に",
              "を",
              "は",
              "が"
            ],
            "correct": 2,
            "why": "Người là chủ đề → **は**. → **アンナさんは{髪|かみ}が{長|なが}いです。** 〔Anna-san wa kami ga nagai desu.〕 — Anna tóc dài."
          },
          {
            "q": "マルコさんはサッカー＿＿{上手|じょうず}です。　〔Maruko-san wa sakkaa __ jouzu desu.〕　— Marco đá bóng giỏi.",
            "options": [
              "に",
              "で",
              "が",
              "を"
            ],
            "correct": 2,
            "why": "Kỹ năng + **が** + 上手. → **マルコさんはサッカーが{上手|じょうず}です。** 〔Maruko-san wa sakkaa ga jouzu desu.〕 — Marco đá bóng giỏi."
          },
          {
            "q": "{私|わたし}は{歌|うた}が＿＿。　〔Watashi wa uta ga __.〕　— Tôi hát dở.",
            "options": [
              "{下手|へた}いです",
              "{下手|へた}なです",
              "{下手|へた}です",
              "{下手|へた}くです"
            ],
            "correct": 2,
            "why": "下手 là ナA: **下手です** (không thêm な trước です). → **{私|わたし}は{歌|うた}が{下手|へた}です。** 〔Watashi wa uta ga heta desu.〕 — Tôi hát dở."
          },
          {
            "q": "{妹|いもうと}は{目|め}が＿＿。　〔Imouto wa me ga __.〕　— Em gái tôi mắt to.",
            "options": [
              "{大|おお}きなです",
              "{大|おお}きいなです",
              "{大|おお}きいです",
              "{大|おお}きです"
            ],
            "correct": 2,
            "why": "イA + です. → **{妹|いもうと}は{目|め}が{大|おお}きいです。** 〔Imouto wa me ga ookii desu.〕 — Em gái tôi mắt to."
          },
          {
            "q": "キムさんは{頭|あたま}が＿＿。　〔Kimu-san wa atama ga __.〕　— Kim thông minh.",
            "options": [
              "いいです",
              "いいなです",
              "いくです",
              "よいなです"
            ],
            "correct": 0,
            "why": "頭がいい = thông minh. → **キムさんは{頭|あたま}がいいです。** 〔Kimu-san wa atama ga ii desu.〕 — Kim thông minh."
          },
          {
            "q": "{兄|あに}は{背|せ}が{高|たか}く＿＿。　〔Ani wa se ga takaku __.〕　— Anh tôi không cao.",
            "options": [
              "ないです",
              "じゃありません",
              "ないなです",
              "いです"
            ],
            "correct": 0,
            "why": "イA phủ định: 高い → **高くないです**. → **{兄|あに}は{背|せ}が{高|たか}くないです。** 〔Ani wa se ga takaku nai desu.〕 — Anh tôi không cao."
          },
          {
            "q": "{私|わたし}はテニスが{上手|じょうず}＿＿。　〔Watashi wa tenisu ga jouzu __.〕　— Tôi chơi tennis không giỏi.",
            "options": [
              "くないです",
              "ないです",
              "じゃありません",
              "くありません"
            ],
            "correct": 2,
            "why": "ナA phủ định: **上手じゃありません**. → **{私|わたし}はテニスが{上手|じょうず}じゃありません。** 〔Watashi wa tenisu ga jouzu ja arimasen.〕 — Tôi chơi tennis không giỏi."
          },
          {
            "q": "{背|せ}が{高|たか}い＿＿は{誰|だれ}ですか。　〔Se ga takai __ wa dare desu ka.〕　— Người cao là ai?",
            "options": [
              "の{人|ひと}",
              "{人|ひと}",
              "で{人|ひと}",
              "な{人|ひと}"
            ],
            "correct": 1,
            "why": "イA đứng thẳng trước danh từ: **背が高い人**. → **{背|せ}が{高|たか}い{人|ひと}は{誰|だれ}ですか。** 〔Se ga takai hito wa dare desu ka.〕 — Người cao là ai?"
          },
          {
            "q": "サッカーが{上手|じょうず}＿＿{人|ひと}です。　〔Sakkaa ga jouzu __ hito desu.〕　— Là người đá bóng giỏi.",
            "options": [
              "の",
              "で",
              "い",
              "な"
            ],
            "correct": 3,
            "why": "ナA trước danh từ thêm **な**: 上手な人. → **サッカーが{上手|じょうず}な{人|ひと}です。** 〔Sakkaa ga jouzu na hito desu.〕 — Là người đá bóng giỏi."
          },
          {
            "q": "A：メアリーさんは＿＿{人|ひと}ですか。B：{目|め}が{大|おお}きい{人|ひと}です。　〔A: Mearii-san wa __ hito desu ka. B: me ga ookii hito desu.〕　— A: Mary là người như thế nào? B: Là người mắt to.",
            "options": [
              "どれ",
              "どこ",
              "どの",
              "どんな"
            ],
            "correct": 3,
            "why": "Hỏi người thế nào → **どんな人**. → **A：メアリーさんはどんな{人|ひと}ですか。B：{目|め}が{大|おお}きい{人|ひと}です。** 〔A: Mearii-san wa donna hito desu ka. B: me ga ookii hito desu.〕 — A: Mary là người như thế nào? B: Là người mắt to."
          },
          {
            "q": "Câu nào nghĩa là \"Bố tôi cao\"?",
            "options": [
              "{父|ちち}は{背|せ}が{高|たか}いです。 (Chichi wa se ga takai desu.)",
              "{父|ちち}が{背|せ}を{高|たか}いです。 (Chichi ga se o takai desu.)",
              "{父|ちち}は{高|たか}いです。 (Chichi wa takai desu.)",
              "{父|ちち}の{高|たか}い{背|せ}です。 (Chichi no takai se desu.)"
            ],
            "correct": 0,
            "why": "Người cao phải có **背が**: 父は背が高いです. (父は高いです = bố tôi đắt!)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np2-75",
        "title": "ポイント 75: イA‑くて／ナA・N で (14 câu)",
        "items": [
          {
            "q": "{目|め}が＿＿、{髪|かみ}が{長|なが}いです。　〔Me ga __, kami ga nagai desu.〕　— Mắt to và tóc dài.",
            "options": [
              "{大|おお}きで",
              "{大|おお}きいくて",
              "{大|おお}きいで",
              "{大|おお}きくて"
            ],
            "correct": 3,
            "why": "大きい → bỏ い + **くて**. → **{目|め}が{大|おお}きくて、{髪|かみ}が{長|なが}いです。** 〔Me ga ookikute, kami ga nagai desu.〕 — Mắt to và tóc dài."
          },
          {
            "q": "まじめ＿＿、{親切|しんせつ}です。　〔Majime __, shinsetsu desu.〕　— Chăm chỉ và tốt bụng.",
            "options": [
              "で",
              "と",
              "な",
              "くて"
            ],
            "correct": 0,
            "why": "ナA + **で**. → **まじめで、{親切|しんせつ}です。** 〔Majime de, shinsetsu desu.〕 — Chăm chỉ và tốt bụng."
          },
          {
            "q": "{兄|あに}は{頭|あたま}が＿＿、かっこいいです。　〔Ani wa atama ga __, kakkoii desu.〕　— Anh tôi thông minh và đẹp trai.",
            "options": [
              "よくて",
              "よいで",
              "いくて",
              "いいで"
            ],
            "correct": 0,
            "why": "いい → **よくて** (đặc biệt). → **{兄|あに}は{頭|あたま}がよくて、かっこいいです。** 〔Ani wa atama ga yokute, kakkoii desu.〕 — Anh tôi thông minh và đẹp trai."
          },
          {
            "q": "{妹|いもうと}は{十六歳|じゅうろくさい}＿＿、{高校生|こうこうせい}です。　〔Imouto wa juurokusai __, koukousei desu.〕　— Em gái tôi 16 tuổi, là học sinh cấp 3.",
            "options": [
              "の",
              "で",
              "くて",
              "と"
            ],
            "correct": 1,
            "why": "Danh từ (16歳) + **で**. → **{妹|いもうと}は{十六歳|じゅうろくさい}で、{高校生|こうこうせい}です。** 〔Imouto wa juurokusai de, koukousei desu.〕 — Em gái tôi 16 tuổi, là học sinh cấp 3."
          },
          {
            "q": "この{町|まち}は＿＿、{静|しず}かです。　〔Kono machi wa __, shizuka desu.〕　— Thị trấn này đẹp và yên tĩnh.",
            "options": [
              "きれくて",
              "きれいで",
              "きれいな",
              "きれいくて"
            ],
            "correct": 1,
            "why": "きれい là **ナA** (dù tận cùng い) → **きれいで**. → **この{町|まち}はきれいで、{静|しず}かです。** 〔Kono machi wa kirei de, shizuka desu.〕 — Thị trấn này đẹp và yên tĩnh."
          },
          {
            "q": "{弟|おとうと}は＿＿、おもしろいです。　〔Otouto wa __, omoshiroi desu.〕　— Em trai tôi năng động và vui tính.",
            "options": [
              "{元気|げんき}くて",
              "{元気|げんき}な",
              "{元気|げんき}と",
              "{元気|げんき}で"
            ],
            "correct": 3,
            "why": "元気 (ナA) → **元気で**. → **{弟|おとうと}は{元気|げんき}で、おもしろいです。** 〔Otouto wa genki de, omoshiroi desu.〕 — Em trai tôi năng động và vui tính."
          },
          {
            "q": "{父|ちち}は{背|せ}が＿＿、{優|やさ}しいです。　〔Chichi wa se ga __, yasashii desu.〕　— Bố tôi cao và hiền.",
            "options": [
              "{高|たか}いくて",
              "{高|たか}くて",
              "{高|たか}いで",
              "{高|たか}くで"
            ],
            "correct": 1,
            "why": "高い → **高くて**. → **{父|ちち}は{背|せ}が{高|たか}くて、{優|やさ}しいです。** 〔Chichi wa se ga takakute, yasashii desu.〕 — Bố tôi cao và hiền."
          },
          {
            "q": "メアリーさんは＿＿、{頭|あたま}がいいです。　〔Mearii-san wa __, atama ga ii desu.〕　— Mary dễ thương và thông minh.",
            "options": [
              "かわいで",
              "かわいって",
              "かわいくて",
              "かわいいで"
            ],
            "correct": 2,
            "why": "かわいい → **かわいくて**. → **メアリーさんはかわいくて、{頭|あたま}がいいです。** 〔Mearii-san wa kawaikute, atama ga ii desu.〕 — Mary dễ thương và thông minh."
          },
          {
            "q": "{田中|たなか}さんは{医者|いしゃ}＿＿、{横浜|よこはま}に{住|す}んでいます。　〔Tanaka-san wa isha __, Yokohama ni sunde imasu.〕　— Anh Tanaka là bác sĩ, sống ở Yokohama.",
            "options": [
              "です",
              "で",
              "くて",
              "と"
            ],
            "correct": 1,
            "why": "N です → **N で**. → **{田中|たなか}さんは{医者|いしゃ}で、{横浜|よこはま}に{住|す}んでいます。** 〔Tanaka-san wa isha de, Yokohama ni sunde imasu.〕 — Anh Tanaka là bác sĩ, sống ở Yokohama."
          },
          {
            "q": "マルコさんは＿＿、{背|せ}が{高|たか}いです。　〔Maruko-san wa __, se ga takai desu.〕　— Marco đẹp trai và cao.",
            "options": [
              "かっこいいで",
              "かっこよくて",
              "かっこよいで",
              "かっこいくて"
            ],
            "correct": 1,
            "why": "かっこいい → **かっこよくて**. → **マルコさんはかっこよくて、{背|せ}が{高|たか}いです。** 〔Maruko-san wa kakkoyokute, se ga takai desu.〕 — Marco đẹp trai và cao."
          },
          {
            "q": "このネックレスは＿＿、{安|やす}いです。　〔Kono nekkuresu wa __, yasui desu.〕　— Sợi dây chuyền này đẹp và rẻ.",
            "options": [
              "{素敵|すてき}な",
              "{素敵|すてき}で",
              "{素敵|すてき}くて",
              "{素敵|すてき}だ"
            ],
            "correct": 1,
            "why": "素敵 (ナA) → **素敵で**. → **このネックレスは{素敵|すてき}で、{安|やす}いです。** 〔Kono nekkuresu wa suteki de, yasui desu.〕 — Sợi dây chuyền này đẹp và rẻ."
          },
          {
            "q": "うさぎは{耳|みみ}が＿＿、かわいいです。　〔Usagi wa mimi ga __, kawaii desu.〕　— Con thỏ tai dài, dễ thương.",
            "options": [
              "{長|なが}くて",
              "{長|なが}いで",
              "{長|なが}かって",
              "{長|なが}で"
            ],
            "correct": 0,
            "why": "長い → **長くて**. → **うさぎは{耳|みみ}が{長|なが}くて、かわいいです。** 〔Usagi wa mimi ga nagakute, kawaii desu.〕 — Con thỏ tai dài, dễ thương."
          },
          {
            "q": "{先輩|せんぱい}は＿＿、おもしろい{人|ひと}です。　〔Senpai wa __, omoshiroi hito desu.〕　— Đàn anh là người hiền và vui tính.",
            "options": [
              "{優|やさ}しくて",
              "{優|やさ}しいくて",
              "{優|やさ}しいで",
              "{優|やさ}しで"
            ],
            "correct": 0,
            "why": "優しい → **優しくて**. → **{先輩|せんぱい}は{優|やさ}しくて、おもしろい{人|ひと}です。** 〔Senpai wa yasashikute, omoshiroi hito desu.〕 — Đàn anh là người hiền và vui tính."
          },
          {
            "q": "{私|わたし}のへやは＿＿、きれいです。　〔Watashi no heya wa __, kirei desu.〕　— Phòng tôi rộng và sạch.",
            "options": [
              "{広|ひろ}で",
              "{広|ひろ}いで",
              "{広|ひろ}くて",
              "{広|ひろ}かって"
            ],
            "correct": 2,
            "why": "広い → **広くて**. → **{私|わたし}のへやは{広|ひろ}くて、きれいです。** 〔Watashi no heya wa hirokute, kirei desu.〕 — Phòng tôi rộng và sạch."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · gõ thể て · chọn câu tả · đọc bảng nhân vật · sửa câu sai · ghép"
      },
      {
        "t": "quiz",
        "id": "lt-b8-np2-chia",
        "title": "Gõ dạng nối của từ trong gợi ý (14 câu)",
        "kind": "fill",
        "grammar": "イA: い → くて (いい → よくて) · ナA／N: + で",
        "items": [
          {
            "q": "{目|め}が＿＿、{口|くち}が{小|ちい}さいです。　〔Me ga __, kuchi ga chiisai desu.〕",
            "answers": [
              "大きくて",
              "おおきくて"
            ],
            "hint": "大きい"
          },
          {
            "q": "{山田|やまだ}さんは＿＿、おもしろいです。　〔Yamada-san wa __, omoshiroi desu.〕",
            "answers": [
              "親切で",
              "しんせつで"
            ],
            "hint": "親切（な）"
          },
          {
            "q": "{頭|あたま}が＿＿、{優|やさ}しいです。　〔Atama ga __, yasashii desu.〕",
            "answers": [
              "よくて"
            ],
            "hint": "いい (đặc biệt)"
          },
          {
            "q": "{弟|おとうと}は＿＿、{東京|とうきょう}に{住|す}んでいます。　〔Otouto wa __, Toukyou ni sunde imasu.〕",
            "answers": [
              "学生で",
              "がくせいで"
            ],
            "hint": "学生 (danh từ)"
          },
          {
            "q": "{髪|かみ}が＿＿、きれいです。　〔Kami ga __, kirei desu.〕",
            "answers": [
              "長くて",
              "ながくて"
            ],
            "hint": "長い"
          },
          {
            "q": "{祖母|そぼ}は＿＿、{優|やさ}しいです。　〔Sobo wa __, yasashii desu.〕",
            "answers": [
              "元気で",
              "げんきで"
            ],
            "hint": "元気（な）"
          },
          {
            "q": "{兄|あに}は＿＿、{親切|しんせつ}です。　〔Ani wa __, shinsetsu desu.〕",
            "answers": [
              "かっこよくて"
            ],
            "hint": "かっこいい (đặc biệt)"
          },
          {
            "q": "{父|ちち}は{髪|かみ}が＿＿、{背|せ}が{高|たか}いです。　〔Chichi wa kami ga __, se ga takai desu.〕",
            "answers": [
              "短くて",
              "みじかくて"
            ],
            "hint": "短い"
          },
          {
            "q": "{姉|あね}は＿＿、{頭|あたま}がいいです。　〔Ane wa __, atama ga ii desu.〕",
            "answers": [
              "きれいで"
            ],
            "hint": "きれい（な）"
          },
          {
            "q": "この{猫|ねこ}は＿＿、かわいいです。　〔Kono neko wa __, kawaii desu.〕",
            "answers": [
              "白くて",
              "しろくて"
            ],
            "hint": "白い"
          },
          {
            "q": "{後輩|こうはい}は＿＿、{元気|げんき}です。　〔Kouhai wa __, genki desu.〕",
            "answers": [
              "まじめで"
            ],
            "hint": "まじめ（な）"
          },
          {
            "q": "{母|はは}は＿＿、{病院|びょういん}で{働|はたら}いています。　〔Haha wa __, byouin de hataraite imasu.〕",
            "answers": [
              "医者で",
              "いしゃで"
            ],
            "hint": "医者 (danh từ)"
          },
          {
            "q": "{先生|せんせい}は＿＿、おもしろいです。　〔Sensei wa __, omoshiroi desu.〕",
            "answers": [
              "優しくて",
              "やさしくて"
            ],
            "hint": "優しい"
          },
          {
            "q": "ワンさんはピアノが＿＿、{歌|うた}も{上手|じょうず}です。　〔Wan-san wa piano ga __, uta mo jouzu desu.〕",
            "answers": [
              "上手で",
              "じょうずで"
            ],
            "hint": "上手（な）"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np2-chon",
        "title": "Chọn câu đúng theo nghĩa (8 câu)",
        "items": [
          {
            "q": "Câu nào đúng nghĩa: \"Natapon chăm chỉ và tốt bụng.\"?",
            "options": [
              "ナタポンさんはまじめくて、{親切|しんせつ}です。 (Natapon-san wa majime kute, shinsetsu desu.)",
              "ナタポンさんはまじめと{親切|しんせつ}です。 (Natapon-san wa majime to shinsetsu desu.)",
              "ナタポンさんはまじめで、{親切|しんせつ}です。 (Natapon-san wa majime de, shinsetsu desu.)",
              "ナタポンさんはまじめな、{親切|しんせつ}です。 (Natapon-san wa majime na, shinsetsu desu.)"
            ],
            "correct": 2,
            "why": "まじめ (ナA) → **まじめで**."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Mary mắt to và tóc dài.\"?",
            "options": [
              "メアリーさんは{目|め}が{大|おお}きいと{髪|かみ}が{長|なが}いです。 (Mearii-san wa me ga ookii to kami ga nagai desu.)",
              "メアリーさんは{目|め}が{大|おお}きくて、{髪|かみ}が{長|なが}いです。 (Mearii-san wa me ga ookikute, kami ga nagai desu.)",
              "メアリーさんは{目|め}が{大|おお}きいで、{髪|かみ}が{長|なが}いです。 (Mearii-san wa me ga ookii de, kami ga nagai desu.)",
              "メアリーさんは{目|め}を{大|おお}きくて、{髪|かみ}を{長|なが}いです。 (Mearii-san wa me o ookikute, kami o nagai desu.)"
            ],
            "correct": 1,
            "why": "大きい → 大きくて; đặc điểm + が."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Anh tôi thông minh và đẹp trai.\"?",
            "options": [
              "お{兄|にい}さんは{頭|あたま}がよくて、かっこいいです。 (Oniisan wa atama ga yokute, kakkoii desu.)",
              "{兄|あに}は{頭|あたま}がいいで、かっこいいです。 (Ani wa atama ga ii de, kakkoii desu.)",
              "{兄|あに}は{頭|あたま}がよくて、かっこいいです。 (Ani wa atama ga yokute, kakkoii desu.)",
              "{兄|あに}は{頭|あたま}がいくて、かっこいいです。 (Ani wa atama ga ikute, kakkoii desu.)"
            ],
            "correct": 2,
            "why": "いい → よくて; anh mình → 兄."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Daniel năng động và vui tính.\"?",
            "options": [
              "ダニエルさんは{元気|げんき}くて、おもしろいです。 (Danieru-san wa genki kute, omoshiroi desu.)",
              "ダニエルさんは{元気|げんき}で、おもしろいです。 (Danieru-san wa genki de, omoshiroi desu.)",
              "ダニエルさんは{元気|げんき}、おもしろくてです。 (Danieru-san wa genki, omoshirokute desu.)",
              "ダニエルさんは{元気|げんき}とおもしろいです。 (Danieru-san wa genki to omoshiroi desu.)"
            ],
            "correct": 1,
            "why": "元気 → 元気で."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Em gái tôi 16 tuổi, là học sinh cấp 3.\"?",
            "options": [
              "{妹|いもうと}は{十六歳|じゅうろくさい}くて、{高校生|こうこうせい}です。 (Imouto wa juurokusai kute, koukousei desu.)",
              "{妹|いもうと}は{十六歳|じゅうろくさい}で、{高校生|こうこうせい}です。 (Imouto wa juurokusai de, koukousei desu.)",
              "{妹|いもうと}は{十六歳|じゅうろくさい}と{高校生|こうこうせい}です。 (Imouto wa juurokusai to koukousei desu.)",
              "{妹|いもうと}は{十六歳|じゅうろくさい}の{高校生|こうこうせい}で。 (Imouto wa juurokusai no koukousei de.)"
            ],
            "correct": 1,
            "why": "N + で."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Thị trấn này đẹp và yên tĩnh.\"?",
            "options": [
              "この{町|まち}はきれくて、{静|しず}かです。 (Kono machi wa kirekute, shizuka desu.)",
              "この{町|まち}はきれいくて、{静|しず}かです。 (Kono machi wa kireikute, shizuka desu.)",
              "この{町|まち}はきれいと{静|しず}かです。 (Kono machi wa kirei to shizuka desu.)",
              "この{町|まち}はきれいで、{静|しず}かです。 (Kono machi wa kirei de, shizuka desu.)"
            ],
            "correct": 3,
            "why": "きれい là ナA → きれいで."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Anna chơi tennis giỏi.\"?",
            "options": [
              "アンナさんがテニスが{上手|じょうず}いです。 (Anna-san ga tenisu ga jouzui desu.)",
              "アンナさんはテニスが{上手|じょうず}なです。 (Anna-san wa tenisu ga jouzu na desu.)",
              "アンナさんはテニスが{上手|じょうず}です。 (Anna-san wa tenisu ga jouzu desu.)",
              "アンナさんはテニスを{上手|じょうず}です。 (Anna-san wa tenisu o jouzu desu.)"
            ],
            "correct": 2,
            "why": "Kỹ năng **が** 上手です."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Người tóc dài là ai?\"?",
            "options": [
              "{髪|かみ}が{長|なが}いな{人|ひと}は{誰|だれ}ですか。 (Kami ga nagai na hito wa dare desu ka.)",
              "{髪|かみ}は{長|なが}くて{人|ひと}は{誰|だれ}ですか。 (Kami wa nagakute hito wa dare desu ka.)",
              "{髪|かみ}が{長|なが}い{人|ひと}は{誰|だれ}ですか。 (Kami ga nagai hito wa dare desu ka.)",
              "{長|なが}い{髪|かみ}が{人|ひと}は{誰|だれ}ですか。 (Nagai kami ga hito wa dare desu ka.)"
            ],
            "correct": 2,
            "why": "Cụm tả trước danh từ: 髪が長い人."
          }
        ]
      },
      {
        "t": "table",
        "head": [
          "Ai",
          "Ngoại hình",
          "Tính cách",
          "Giỏi / dở"
        ],
        "rows": [
          [
            "マルコ",
            "cao, tóc ngắn màu đen",
            "năng động, vui tính",
            "đá bóng giỏi"
          ],
          [
            "メアリー",
            "mắt to, tóc dài màu nâu",
            "hiền, tốt bụng",
            "piano giỏi · hát dở"
          ],
          [
            "ダニエル",
            "cao, chân dài, đẹp trai",
            "chăm chỉ",
            "tiếng Nhật giỏi"
          ],
          [
            "アンナ",
            "tóc ngắn, mắt to",
            "thông minh, vui tính",
            "tennis giỏi"
          ],
          [
            "ナタポン",
            "không cao lắm, tóc đen",
            "tốt bụng, chăm chỉ",
            "vẽ giỏi"
          ],
          [
            "木村",
            "tóc ngắn màu trắng",
            "hiền, vui tính",
            "nấu ăn giỏi"
          ]
        ],
        "caption": "Bảng nhân vật — \"tranh\" dùng cho 8 câu dưới đây"
      },
      {
        "t": "mcq",
        "id": "lt-b8-np2-tranh",
        "title": "Nhìn bảng nhân vật rồi trả lời (8 câu)",
        "items": [
          {
            "q": "マルコさんはどんな{人|ひと}ですか。　〔Maruko-san wa donna hito desu ka.〕",
            "options": [
              "{背|せ}が{高|たか}いで、{元気|げんき}な{人|ひと}です。 (Se ga takai de, genki na hito desu.)",
              "{背|せ}が{高|たか}くて、{元気|げんき}の{人|ひと}です。 (Se ga takakute, genki no hito desu.)",
              "{背|せ}が{高|たか}くて、{元気|げんき}な{人|ひと}です。 (Se ga takakute, genki na hito desu.)",
              "{目|め}が{大|おお}きくて、{優|やさ}しい{人|ひと}です。 (Me ga ookikute, yasashii hito desu.)"
            ],
            "correct": 2,
            "why": "Marco: cao, năng động → 背が高くて、元気な人."
          },
          {
            "q": "メアリーさんは{髪|かみ}が{短|みじか}いですか。　〔Mearii-san wa kami ga mijikai desu ka.〕",
            "options": [
              "いいえ、{短|みじか}くないです。{長|なが}くて、{茶色|ちゃいろ}いです。 (Iie, mijikakunai desu. Nagakute, chairoi desu.)",
              "いいえ、{長|なが}いくて、{茶色|ちゃいろ}いです。 (Iie, nagai kute, chairoi desu.)",
              "はい、{短|みじか}いです。 (Hai, mijikai desu.)",
              "いいえ、{短|みじか}いじゃありません。 (Iie, mijikai ja arimasen.)"
            ],
            "correct": 0,
            "why": "Mary tóc dài màu nâu; 短い → 短くないです."
          },
          {
            "q": "{誰|だれ}がピアノが{上手|じょうず}ですか。　〔Dare ga piano ga jouzu desu ka.〕",
            "options": [
              "ナタポンさんです。 (Natapon-san desu.)",
              "マルコさんです。 (Maruko-san desu.)",
              "メアリーさんです。 (Mearii-san desu.)",
              "アンナさんです。 (Anna-san desu.)"
            ],
            "correct": 2,
            "why": "Bảng: Mary piano giỏi."
          },
          {
            "q": "ダニエルさんは{足|あし}が{長|なが}いですか。　〔Danieru-san wa ashi ga nagai desu ka.〕",
            "options": [
              "いいえ、{長|なが}くないです。 (Iie, nagakunai desu.)",
              "はい、{長|なが}いなです。 (Hai, nagai na desu.)",
              "はい、{長|なが}いです。 (Hai, nagai desu.)",
              "はい、{長|なが}くです。 (Hai, nagaku desu.)"
            ],
            "correct": 2,
            "why": "Daniel chân dài → はい、長いです."
          },
          {
            "q": "アンナさんはどんな{人|ひと}ですか。　〔Anna-san wa donna hito desu ka.〕",
            "options": [
              "{背|せ}が{高|たか}くて、まじめな{人|ひと}です。 (Se ga takakute, majime na hito desu.)",
              "{頭|あたま}がいくて、おもしろい{人|ひと}です。 (Atama ga ikute, omoshiroi hito desu.)",
              "{頭|あたま}がよくて、おもしろい{人|ひと}です。 (Atama ga yokute, omoshiroi hito desu.)",
              "{頭|あたま}がよくて、おもしろいな{人|ひと}です。 (Atama ga yokute, omoshiroi na hito desu.)"
            ],
            "correct": 2,
            "why": "Anna thông minh, vui tính → 頭がよくて、おもしろい人."
          },
          {
            "q": "ナタポンさんは{何|なに}が{上手|じょうず}ですか。　〔Natapon-san wa nani ga jouzu desu ka.〕",
            "options": [
              "ピアノが{上手|じょうず}です。 (Piano ga jouzu desu.)",
              "{絵|え}を{上手|じょうず}です。 (E o jouzu desu.)",
              "{絵|え}が{上手|じょうず}です。 (E ga jouzu desu.)",
              "サッカーが{上手|じょうず}です。 (Sakkaa ga jouzu desu.)"
            ],
            "correct": 2,
            "why": "Natapon vẽ giỏi → 絵が上手です."
          },
          {
            "q": "{木村|きむら}さんはどんな{人|ひと}ですか。　〔Kimura-san wa donna hito desu ka.〕",
            "options": [
              "まじめで、{頭|あたま}がいい{人|ひと}です。 (Majime de, atama ga ii hito desu.)",
              "{優|やさ}しくて、おもしろい{人|ひと}です。{料理|りょうり}が{上手|じょうず}です。 (Yasashikute, omoshiroi hito desu. Ryouri ga jouzu desu.)",
              "{優|やさ}しくて、{料理|りょうり}が{下手|へた}です。 (Yasashikute, ryouri ga heta desu.)",
              "{優|やさ}しいで、おもしろい{人|ひと}です。 (Yasashii de, omoshiroi hito desu.)"
            ],
            "correct": 1,
            "why": "Kimura: hiền, vui, nấu ăn giỏi."
          },
          {
            "q": "メアリーさんは{歌|うた}が{上手|じょうず}ですか。　〔Mearii-san wa uta ga jouzu desu ka.〕",
            "options": [
              "いいえ、{上手|じょうず}くないです。 (Iie, jouzu kunai desu.)",
              "いいえ、{下手|へた}じゃありません。 (Iie, heta ja arimasen.)",
              "はい、{上手|じょうず}です。 (Hai, jouzu desu.)",
              "いいえ、{上手|じょうず}じゃありません。{下手|へた}です。 (Iie, jouzu ja arimasen. Heta desu.)"
            ],
            "correct": 3,
            "why": "Mary hát dở; ナA phủ định → 上手じゃありません."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np2-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "(nối イA)　Câu nào SAI?",
            "options": [
              "{母|はは}は{優|やさ}しくて、{元気|げんき}です。 (Haha wa yasashikute, genki desu.)",
              "{母|はは}は{元気|げんき}で、{優|やさ}しいです。 (Haha wa genki de, yasashii desu.)",
              "{母|はは}は{優|やさ}しいで、{元気|げんき}です。 (Haha wa yasashii de, genki desu.)",
              "{母|はは}は{優|やさ}しい{人|ひと}です。 (Haha wa yasashii hito desu.)"
            ],
            "correct": 2,
            "why": "イA nối bằng **くて**: 優しくて."
          },
          {
            "q": "(いい)　Câu nào SAI?",
            "options": [
              "{兄|あに}は{頭|あたま}がいくて、まじめです。 (Ani wa atama ga ikute, majime desu.)",
              "{兄|あに}は{頭|あたま}がよくて、まじめです。 (Ani wa atama ga yokute, majime desu.)",
              "{兄|あに}は{頭|あたま}がいいです。 (Ani wa atama ga ii desu.)",
              "{兄|あに}はまじめで、{頭|あたま}がいいです。 (Ani wa majime de, atama ga ii desu.)"
            ],
            "correct": 0,
            "why": "いい → **よくて**."
          },
          {
            "q": "(きれい)　Câu nào SAI?",
            "options": [
              "{姉|あね}は{優|やさ}しくて、きれいです。 (Ane wa yasashikute, kirei desu.)",
              "{姉|あね}はきれいな{人|ひと}です。 (Ane wa kirei na hito desu.)",
              "{姉|あね}はきれいで、{優|やさ}しいです。 (Ane wa kirei de, yasashii desu.)",
              "{姉|あね}はきれくて、{優|やさ}しいです。 (Ane wa kirekute, yasashii desu.)"
            ],
            "correct": 3,
            "why": "きれい là ナA → **きれいで**."
          },
          {
            "q": "(trợ từ)　Câu nào SAI?",
            "options": [
              "{私|わたし}の{目|め}は{大|おお}きいです。 (Watashi no me wa ookii desu.)",
              "{私|わたし}は{目|め}が{大|おお}きいです。 (Watashi wa me ga ookii desu.)",
              "{私|わたし}は{目|め}が{大|おお}きくないです。 (Watashi wa me ga ookikunai desu.)",
              "{私|わたし}は{目|め}を{大|おお}きいです。 (Watashi wa me o ookii desu.)"
            ],
            "correct": 3,
            "why": "Đặc điểm đi với **が**, không dùng を."
          },
          {
            "q": "(と)　Câu nào SAI?",
            "options": [
              "おもしろくて、{親切|しんせつ}な{人|ひと}です。 (Omoshirokute, shinsetsu na hito desu.)",
              "{親切|しんせつ}で、おもしろい{人|ひと}です。 (Shinsetsu de, omoshiroi hito desu.)",
              "おもしろい{人|ひと}です。 (Omoshiroi hito desu.)",
              "おもしろいと{親切|しんせつ}な{人|ひと}です。 (Omoshiroi to shinsetsu na hito desu.)"
            ],
            "correct": 3,
            "why": "と chỉ nối DANH TỪ; nối tính từ dùng **くて／で**."
          },
          {
            "q": "(trước danh từ)　Câu nào SAI?",
            "options": [
              "サッカーが{上手|じょうず}の{人|ひと}はマルコさんです。 (Sakkaa ga jouzu no hito wa Maruko-san desu.)",
              "サッカーが{上手|じょうず}な{人|ひと}はマルコさんです。 (Sakkaa ga jouzu na hito wa Maruko-san desu.)",
              "マルコさんはサッカーが{上手|じょうず}です。 (Maruko-san wa sakkaa ga jouzu desu.)",
              "{背|せ}が{高|たか}い{人|ひと}はマルコさんです。 (Se ga takai hito wa Maruko-san desu.)"
            ],
            "correct": 0,
            "why": "ナA trước danh từ → **な**: 上手な人."
          },
          {
            "q": "(danh từ)　Câu nào SAI?",
            "options": [
              "{弟|おとうと}は{元気|げんき}な{学生|がくせい}です。 (Otouto wa genki na gakusei desu.)",
              "{弟|おとうと}は{大学生|だいがくせい}です。 (Otouto wa daigakusei desu.)",
              "{弟|おとうと}は{学生|がくせい}で、{元気|げんき}です。 (Otouto wa gakusei de, genki desu.)",
              "{弟|おとうと}は{学生|がくせい}くて、{元気|げんき}です。 (Otouto wa gakusei kute, genki desu.)"
            ],
            "correct": 3,
            "why": "Danh từ nối bằng **で**: 学生で."
          },
          {
            "q": "(thì quá khứ)　Câu nào SAI?",
            "options": [
              "{兄|あに}は{背|せ}が{高|たか}いです。 (Ani wa se ga takai desu.)",
              "{兄|あに}は{背|せ}が{高|たか}くて、かっこいいでした。 (Ani wa se ga takakute, kakkoii deshita.)",
              "{兄|あに}は{背|せ}が{高|たか}くて、かっこよかったです。 (Ani wa se ga takakute, kakkoyokatta desu.)",
              "{兄|あに}は{背|せ}が{高|たか}くて、かっこいいです。 (Ani wa se ga takakute, kakkoii desu.)"
            ],
            "correct": 1,
            "why": "イA quá khứ: かっこいい → **かっこよかったです** (không phải いいでした)."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-np2-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Daniel cao và đẹp trai.",
            "chips": [
              "{高|たか}くて、",
              "{背|せ}が",
              "{高|たか}い、",
              "かっこいいです",
              "ダニエルさんは"
            ],
            "answer": [
              "ダニエルさんは",
              "{背|せ}が",
              "{高|たか}くて、",
              "かっこいいです"
            ],
            "ro": "Danieru-san wa se ga takakute, kakkoii desu"
          },
          {
            "vi": "Mẹ tôi hiền và nấu ăn giỏi.",
            "chips": [
              "{料理|りょうり}が",
              "{母|はは}は",
              "{料理|りょうり}を",
              "{上手|じょうず}です",
              "{優|やさ}しくて、"
            ],
            "answer": [
              "{母|はは}は",
              "{優|やさ}しくて、",
              "{料理|りょうり}が",
              "{上手|じょうず}です"
            ],
            "ro": "Haha wa yasashikute, ryouri ga jouzu desu"
          },
          {
            "vi": "Anh Tanaka là người tốt bụng và vui tính.",
            "chips": [
              "{親切|しんせつ}くて、",
              "{田中|たなか}さんは",
              "{親切|しんせつ}で、",
              "おもしろい",
              "{人|ひと}です"
            ],
            "answer": [
              "{田中|たなか}さんは",
              "{親切|しんせつ}で、",
              "おもしろい",
              "{人|ひと}です"
            ],
            "ro": "Tanaka-san wa shinsetsu de, omoshiroi hito desu"
          },
          {
            "vi": "Em gái tôi mắt to, tóc ngắn.",
            "chips": [
              "{妹|いもうと}は",
              "{髪|かみ}が",
              "{大|おお}きくて、",
              "{目|め}が",
              "{大|おお}きいで、",
              "{短|みじか}いです"
            ],
            "answer": [
              "{妹|いもうと}は",
              "{目|め}が",
              "{大|おお}きくて、",
              "{髪|かみ}が",
              "{短|みじか}いです"
            ],
            "ro": "Imouto wa me ga ookikute, kami ga mijikai desu"
          },
          {
            "vi": "Người hát giỏi là Anna.",
            "chips": [
              "{人|ひと}は",
              "{上手|じょうず}の",
              "{上手|じょうず}な",
              "{歌|うた}が",
              "アンナさんです"
            ],
            "answer": [
              "{歌|うた}が",
              "{上手|じょうず}な",
              "{人|ひと}は",
              "アンナさんです"
            ],
            "ro": "Uta ga jouzu na hito wa Anna-san desu"
          },
          {
            "vi": "Chị tôi là bác sĩ, sống ở Yokohama.",
            "chips": [
              "{横浜|よこはま}に",
              "{医者|いしゃ}くて、",
              "{姉|あね}は",
              "{住|す}んでいます",
              "{医者|いしゃ}で、"
            ],
            "answer": [
              "{姉|あね}は",
              "{医者|いしゃ}で、",
              "{横浜|よこはま}に",
              "{住|す}んでいます"
            ],
            "ro": "Ane wa isha de, Yokohama ni sunde imasu"
          },
          {
            "vi": "Con mèo này trắng và dễ thương.",
            "chips": [
              "{白|しろ}いで、",
              "この{猫|ねこ}は",
              "{白|しろ}くて、",
              "かわいいです"
            ],
            "answer": [
              "この{猫|ねこ}は",
              "{白|しろ}くて、",
              "かわいいです"
            ],
            "ro": "Kono neko wa shirokute, kawaii desu"
          },
          {
            "vi": "Tôi chơi piano không giỏi.",
            "chips": [
              "{私|わたし}は",
              "じゃありません",
              "ピアノが",
              "{上手|じょうず}",
              "くないです"
            ],
            "answer": [
              "{私|わたし}は",
              "ピアノが",
              "{上手|じょうず}",
              "じゃありません"
            ],
            "ro": "Watashi wa piano ga jouzu ja arimasen"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np2-nhat-viet",
        "title": "Nhật → Việt (6 câu)",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {姉|あね}は{背|せ}が{高|たか}くて、{髪|かみ}が{長|なが}いです。　〔Ane wa se ga takakute, kami ga nagai desu.〕",
            "options": [
              "Chị tôi tóc dài hơn tôi.",
              "Chị tôi cao và tóc dài.",
              "Chị bạn cao và tóc dài.",
              "Chị tôi cao nhưng tóc ngắn."
            ],
            "correct": 1,
            "why": "姉 = chị mình; 高くて = cao và…"
          },
          {
            "q": "Câu này nghĩa là gì? {先輩|せんぱい}はまじめで、{親切|しんせつ}な{人|ひと}です。　〔Senpai wa majime de, shinsetsu na hito desu.〕",
            "options": [
              "Đàn anh là người vui tính và tốt bụng.",
              "Đàn anh là người chăm chỉ và tốt bụng.",
              "Đàn anh chăm chỉ nhưng không tốt bụng.",
              "Đàn em là người chăm chỉ và tốt bụng."
            ],
            "correct": 1,
            "why": "先輩 = đàn anh/chị; まじめで = chăm chỉ và…"
          },
          {
            "q": "Câu này nghĩa là gì? {父|ちち}は{料理|りょうり}が{下手|へた}です。　〔Chichi wa ryouri ga heta desu.〕",
            "options": [
              "Bố tôi nấu ăn giỏi.",
              "Bố tôi không thích nấu ăn.",
              "Bố bạn nấu ăn dở.",
              "Bố tôi nấu ăn dở."
            ],
            "correct": 3,
            "why": "下手 = dở."
          },
          {
            "q": "Câu này nghĩa là gì? サッカーが{上手|じょうず}な{人|ひと}は{誰|だれ}ですか。　〔Sakkaa ga jouzu na hito wa dare desu ka.〕",
            "options": [
              "Bạn đá bóng có giỏi không?",
              "Ai thích bóng đá?",
              "Ai là người đá bóng dở?",
              "Người đá bóng giỏi là ai?"
            ],
            "correct": 3,
            "why": "上手な人 = người giỏi."
          },
          {
            "q": "Câu này nghĩa là gì? {弟|おとうと}は{二十歳|はたち}で、{大学生|だいがくせい}です。　〔Otouto wa hatachi de, daigakusei desu.〕",
            "options": [
              "Em trai tôi 20 tuổi và muốn vào đại học.",
              "Em trai tôi 20 tuổi, là sinh viên đại học.",
              "Em trai tôi học đại học được 2 năm.",
              "Em trai bạn 20 tuổi, là sinh viên."
            ],
            "correct": 1,
            "why": "二十歳 = 20 tuổi (はたち); N で = là N và…"
          },
          {
            "q": "Câu này nghĩa là gì? この{町|まち}は{静|しず}かで、きれいです。　〔Kono machi wa shizuka de, kirei desu.〕",
            "options": [
              "Thị trấn này náo nhiệt và đẹp.",
              "Thị trấn này sạch hơn thị trấn kia.",
              "Thị trấn này yên tĩnh nhưng không đẹp.",
              "Thị trấn này yên tĩnh và đẹp."
            ],
            "correct": 3,
            "why": "静かで = yên tĩnh và…"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch · nhiều ô trống · tình huống thi nói"
      },
      {
        "t": "quiz",
        "id": "lt-b8-np2-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 74, 75",
        "items": [
          {
            "q": "Mary mắt to và tóc dài.",
            "answers": [
              "メアリーさんは目が大きくて、髪が長いです。",
              "メアリーさんは目が大きくて、髪がながいです。",
              "メアリーさんは目が大きくて、かみが長いです。",
              "メアリーさんは目が大きくて、かみがながいです。",
              "メアリーさんは目がおおきくて、髪が長いです。",
              "メアリーさんは目がおおきくて、髪がながいです。",
              "メアリーさんは目がおおきくて、かみが長いです。",
              "メアリーさんは目がおおきくて、かみがながいです。",
              "メアリーさんはめが大きくて、髪が長いです。",
              "メアリーさんはめが大きくて、髪がながいです。",
              "メアリーさんはめが大きくて、かみが長いです。",
              "メアリーさんはめが大きくて、かみがながいです。",
              "メアリーさんはめがおおきくて、髪が長いです。",
              "メアリーさんはめがおおきくて、髪がながいです。",
              "メアリーさんはめがおおきくて、かみが長いです。",
              "メアリーさんはめがおおきくて、かみがながいです。"
            ],
            "hint": "イA くて"
          },
          {
            "q": "Anh tôi thông minh và đẹp trai.",
            "answers": [
              "兄は頭がよくて、かっこいいです。",
              "兄はあたまがよくて、かっこいいです。",
              "あには頭がよくて、かっこいいです。",
              "あにはあたまがよくて、かっこいいです。"
            ],
            "hint": "いい → よくて"
          },
          {
            "q": "Natapon chăm chỉ và tốt bụng.",
            "answers": [
              "ナタポンさんはまじめで、親切です。",
              "ナタポンさんはまじめで、しんせつです。"
            ],
            "hint": "ナA で"
          },
          {
            "q": "Em gái tôi 16 tuổi, là học sinh cấp 3.",
            "answers": [
              "妹は十六歳で、高校生です。",
              "妹は十六歳で、こうこうせいです。",
              "妹はじゅうろくさいで、高校生です。",
              "妹はじゅうろくさいで、こうこうせいです。",
              "いもうとは十六歳で、高校生です。",
              "いもうとは十六歳で、こうこうせいです。",
              "いもうとはじゅうろくさいで、高校生です。",
              "いもうとはじゅうろくさいで、こうこうせいです。",
              "妹は16歳で、高校生です。",
              "妹は16歳で、こうこうせいです。",
              "いもうとは16歳で、高校生です。",
              "いもうとは16歳で、こうこうせいです。"
            ],
            "hint": "N で"
          },
          {
            "q": "Bà tôi khoẻ mạnh và hiền.",
            "answers": [
              "祖母は元気で、優しいです。",
              "祖母は元気で、やさしいです。",
              "祖母はげんきで、優しいです。",
              "祖母はげんきで、やさしいです。",
              "そぼは元気で、優しいです。",
              "そぼは元気で、やさしいです。",
              "そぼはげんきで、優しいです。",
              "そぼはげんきで、やさしいです。"
            ],
            "hint": "ナA で"
          },
          {
            "q": "Marco đá bóng giỏi.",
            "answers": [
              "マルコさんはサッカーが上手です。",
              "マルコさんはサッカーがじょうずです。"
            ],
            "hint": "N1 は N2 が 上手です"
          },
          {
            "q": "Tôi hát không giỏi.",
            "answers": [
              "私は歌が上手じゃありません。",
              "私は歌がじょうずじゃありません。",
              "私はうたが上手じゃありません。",
              "私はうたがじょうずじゃありません。",
              "わたしは歌が上手じゃありません。",
              "わたしは歌がじょうずじゃありません。",
              "わたしはうたが上手じゃありません。",
              "わたしはうたがじょうずじゃありません。",
              "歌が上手じゃありません。",
              "歌がじょうずじゃありません。",
              "うたが上手じゃありません。",
              "うたがじょうずじゃありません。",
              "私は歌が上手ではありません。",
              "私は歌がじょうずではありません。",
              "私はうたが上手ではありません。",
              "私はうたがじょうずではありません。",
              "わたしは歌が上手ではありません。",
              "わたしは歌がじょうずではありません。",
              "わたしはうたが上手ではありません。",
              "わたしはうたがじょうずではありません。",
              "私は歌が下手です。",
              "私は歌がへたです。",
              "私はうたが下手です。",
              "私はうたがへたです。",
              "わたしは歌が下手です。",
              "わたしは歌がへたです。",
              "わたしはうたが下手です。",
              "わたしはうたがへたです。"
            ],
            "hint": "ナA じゃありません"
          },
          {
            "q": "Daniel là người như thế nào? — Là người cao và vui tính.",
            "answers": [
              "ダニエルさんはどんな人ですか。背が高くて、おもしろい人です。",
              "ダニエルさんはどんな人ですか。背が高くて、おもしろいひとです。",
              "ダニエルさんはどんな人ですか。背がたかくて、おもしろい人です。",
              "ダニエルさんはどんな人ですか。背がたかくて、おもしろいひとです。",
              "ダニエルさんはどんな人ですか。せが高くて、おもしろい人です。",
              "ダニエルさんはどんな人ですか。せが高くて、おもしろいひとです。",
              "ダニエルさんはどんな人ですか。せがたかくて、おもしろい人です。",
              "ダニエルさんはどんな人ですか。せがたかくて、おもしろいひとです。",
              "ダニエルさんはどんなひとですか。背が高くて、おもしろい人です。",
              "ダニエルさんはどんなひとですか。背が高くて、おもしろいひとです。",
              "ダニエルさんはどんなひとですか。背がたかくて、おもしろい人です。",
              "ダニエルさんはどんなひとですか。背がたかくて、おもしろいひとです。",
              "ダニエルさんはどんなひとですか。せが高くて、おもしろい人です。",
              "ダニエルさんはどんなひとですか。せが高くて、おもしろいひとです。",
              "ダニエルさんはどんなひとですか。せがたかくて、おもしろい人です。",
              "ダニエルさんはどんなひとですか。せがたかくて、おもしろいひとです。"
            ],
            "hint": "どんな人 · くて"
          },
          {
            "q": "Con chó của tôi màu trắng và chân ngắn.",
            "answers": [
              "私の犬は白くて、足が短いです。",
              "私の犬は白くて、足がみじかいです。",
              "私の犬は白くて、あしが短いです。",
              "私の犬は白くて、あしがみじかいです。",
              "私の犬はしろくて、足が短いです。",
              "私の犬はしろくて、足がみじかいです。",
              "私の犬はしろくて、あしが短いです。",
              "私の犬はしろくて、あしがみじかいです。",
              "私のいぬは白くて、足が短いです。",
              "私のいぬは白くて、足がみじかいです。",
              "私のいぬは白くて、あしが短いです。",
              "私のいぬは白くて、あしがみじかいです。",
              "私のいぬはしろくて、足が短いです。",
              "私のいぬはしろくて、足がみじかいです。",
              "私のいぬはしろくて、あしが短いです。",
              "私のいぬはしろくて、あしがみじかいです。",
              "わたしの犬は白くて、足が短いです。",
              "わたしの犬は白くて、足がみじかいです。",
              "わたしの犬は白くて、あしが短いです。",
              "わたしの犬は白くて、あしがみじかいです。",
              "わたしの犬はしろくて、足が短いです。",
              "わたしの犬はしろくて、足がみじかいです。",
              "わたしの犬はしろくて、あしが短いです。",
              "わたしの犬はしろくて、あしがみじかいです。",
              "わたしのいぬは白くて、足が短いです。",
              "わたしのいぬは白くて、足がみじかいです。",
              "わたしのいぬは白くて、あしが短いです。",
              "わたしのいぬは白くて、あしがみじかいです。",
              "わたしのいぬはしろくて、足が短いです。",
              "わたしのいぬはしろくて、足がみじかいです。",
              "わたしのいぬはしろくて、あしが短いです。",
              "わたしのいぬはしろくて、あしがみじかいです。"
            ],
            "hint": "白くて · N が A"
          },
          {
            "q": "Người tóc ngắn là chị gái tôi.",
            "answers": [
              "髪が短い人は姉です。",
              "髪が短い人はあねです。",
              "髪が短いひとは姉です。",
              "髪が短いひとはあねです。",
              "髪がみじかい人は姉です。",
              "髪がみじかい人はあねです。",
              "髪がみじかいひとは姉です。",
              "髪がみじかいひとはあねです。",
              "かみが短い人は姉です。",
              "かみが短い人はあねです。",
              "かみが短いひとは姉です。",
              "かみが短いひとはあねです。",
              "かみがみじかい人は姉です。",
              "かみがみじかい人はあねです。",
              "かみがみじかいひとは姉です。",
              "かみがみじかいひとはあねです。",
              "髪が短い人は私の姉です。",
              "髪が短い人は私のあねです。",
              "髪が短い人はわたしの姉です。",
              "髪が短い人はわたしのあねです。",
              "髪が短いひとは私の姉です。",
              "髪が短いひとは私のあねです。",
              "髪が短いひとはわたしの姉です。",
              "髪が短いひとはわたしのあねです。",
              "髪がみじかい人は私の姉です。",
              "髪がみじかい人は私のあねです。",
              "髪がみじかい人はわたしの姉です。",
              "髪がみじかい人はわたしのあねです。",
              "髪がみじかいひとは私の姉です。",
              "髪がみじかいひとは私のあねです。",
              "髪がみじかいひとはわたしの姉です。",
              "髪がみじかいひとはわたしのあねです。",
              "かみが短い人は私の姉です。",
              "かみが短い人は私のあねです。",
              "かみが短い人はわたしの姉です。",
              "かみが短い人はわたしのあねです。",
              "かみが短いひとは私の姉です。",
              "かみが短いひとは私のあねです。",
              "かみが短いひとはわたしの姉です。",
              "かみが短いひとはわたしのあねです。",
              "かみがみじかい人は私の姉です。",
              "かみがみじかい人は私のあねです。",
              "かみがみじかい人はわたしの姉です。",
              "かみがみじかい人はわたしのあねです。",
              "かみがみじかいひとは私の姉です。",
              "かみがみじかいひとは私のあねです。",
              "かみがみじかいひとはわたしの姉です。",
              "かみがみじかいひとはわたしのあねです。"
            ],
            "hint": "Cụm tả + 人"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np2-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{兄|あに}は{背|せ}（①）{高|たか}（②）、かっこいいです。　〔Ani wa se ((1)) taka((2)), kakkoii desu.〕　— Anh tôi cao và đẹp trai.",
            "options": [
              "① が　② いくて",
              "① は　② いで",
              "① を　② くて",
              "① が　② くて"
            ],
            "correct": 3,
            "why": "Đặc điểm **が**; 高い → 高**くて**. → **{兄|あに}は{背|せ}が{高|たか}くて、かっこいいです。** 〔Ani wa se ga takakute, kakkoii desu.〕 — Anh tôi cao và đẹp trai."
          },
          {
            "q": "{母|はは}は{親切|しんせつ}（①）、{料理|りょうり}（②）{上手|じょうず}です。　〔Haha wa shinsetsu((1)), ryouri ((2)) jouzu desu.〕　— Mẹ tôi tốt bụng và nấu ăn giỏi.",
            "options": [
              "① な　② が",
              "① で　② が",
              "① くて　② を",
              "① で　② を"
            ],
            "correct": 1,
            "why": "親切**で** · 料理**が** 上手. → **{母|はは}は{親切|しんせつ}で、{料理|りょうり}が{上手|じょうず}です。** 〔Haha wa shinsetsu de, ryouri ga jouzu desu.〕 — Mẹ tôi tốt bụng và nấu ăn giỏi."
          },
          {
            "q": "{妹|いもうと}は{頭|あたま}が（①）、{元気|げんき}（②）{人|ひと}です。　〔Imouto wa atama ga ((1)), genki((2)) hito desu.〕　— Em gái tôi là người thông minh và năng động.",
            "options": [
              "① いいで　② な",
              "① よくて　② な",
              "① よくて　② の",
              "① いくて　② な"
            ],
            "correct": 1,
            "why": "いい → **よくて**; ナA + 人 → **な**. → **{妹|いもうと}は{頭|あたま}がよくて、{元気|げんき}な{人|ひと}です。** 〔Imouto wa atama ga yokute, genki na hito desu.〕 — Em gái tôi là người thông minh và năng động."
          },
          {
            "q": "{田中|たなか}さんは{会社員|かいしゃいん}（①）、{大阪|おおさか}（②）{住|す}んでいます。　〔Tanaka-san wa kaishain((1)), Oosaka ((2)) sunde imasu.〕　— Anh Tanaka là nhân viên công ty, sống ở Osaka.",
            "options": [
              "① で　② に",
              "① くて　② に",
              "① で　② で",
              "① と　② に"
            ],
            "correct": 0,
            "why": "N **で** · nơi ở **に**. → **{田中|たなか}さんは{会社員|かいしゃいん}で、{大阪|おおさか}に{住|す}んでいます。** 〔Tanaka-san wa kaishain de, Oosaka ni sunde imasu.〕 — Anh Tanaka là nhân viên công ty, sống ở Osaka."
          },
          {
            "q": "メアリーさんは{髪|かみ}（①）{茶色|ちゃいろ}くて、{目|め}（②）{大|おお}きいです。　〔Mearii-san wa kami ((1)) chairokute, me ((2)) ookii desu.〕　— Mary tóc nâu và mắt to.",
            "options": [
              "① が　② を",
              "① が　② が",
              "① に　② の",
              "① を　② が"
            ],
            "correct": 1,
            "why": "Đặc điểm **が** … **が**. → **メアリーさんは{髪|かみ}が{茶色|ちゃいろ}くて、{目|め}が{大|おお}きいです。** 〔Mearii-san wa kami ga chairokute, me ga ookii desu.〕 — Mary tóc nâu và mắt to."
          },
          {
            "q": "{弟|おとうと}は{十八歳|じゅうはっさい}（①）、（②）な{学生|がくせい}です。　〔Otouto wa juuhassai((1)), ((2)) na gakusei desu.〕　— Em trai tôi 18 tuổi, là học sinh chăm chỉ.",
            "options": [
              "① くて　② まじめ",
              "① の　② まじめ",
              "① で　② {優|やさ}しい",
              "① で　② まじめ"
            ],
            "correct": 3,
            "why": "N **で**; ナA + な + N (優しい là イA, không có な). → **{弟|おとうと}は{十八歳|じゅうはっさい}で、まじめな{学生|がくせい}です。** 〔Otouto wa juuhassai de, majime na gakusei desu.〕 — Em trai tôi 18 tuổi, là học sinh chăm chỉ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np2-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Bạn hỏi 「お母さんは どんな人ですか」. Mẹ bạn hiền và vui tính.",
            "options": [
              "{母|はは}は{優|やさ}しくて、おもしろい{人|ひと}です。 (Haha wa yasashikute, omoshiroi hito desu.)",
              "{母|はは}は{優|やさ}しいとおもしろい{人|ひと}です。 (Haha wa yasashii to omoshiroi hito desu.)",
              "{母|はは}は{優|やさ}しいで、おもしろい{人|ひと}です。 (Haha wa yasashii de, omoshiroi hito desu.)",
              "お{母|かあ}さんは{優|やさ}しくて、おもしろい{人|ひと}です。 (Okaasan wa yasashikute, omoshiroi hito desu.)"
            ],
            "correct": 0,
            "why": "Mẹ mình → 母; 優しい → 優しくて."
          },
          {
            "q": "Bạn khen Anna chơi tennis giỏi.",
            "options": [
              "アンナさんはテニスが{下手|へた}ですね。 (Anna-san wa tenisu ga heta desu ne.)",
              "アンナさんはテニスが{上手|じょうず}ですね。 (Anna-san wa tenisu ga jouzu desu ne.)",
              "アンナさんはテニスが{上手|じょうず}なですね。 (Anna-san wa tenisu ga jouzu na desu ne.)",
              "アンナさんはテニスを{上手|じょうず}ですね。 (Anna-san wa tenisu o jouzu desu ne.)"
            ],
            "correct": 1,
            "why": "Khen người khác: N が 上手ですね."
          },
          {
            "q": "Ai đó khen: 「日本語が 上手ですね」. Bạn đáp khiêm tốn.",
            "options": [
              "はい、{上手|じょうず}です。 (Hai, jouzu desu.)",
              "いいえ、{上手|じょうず}です。 (Iie, jouzu desu.)",
              "はい、{下手|へた}ですね。 (Hai, heta desu ne.)",
              "いいえ、まだ{上手|じょうず}じゃありません。 (Iie, mada jouzu ja arimasen.)"
            ],
            "correct": 3,
            "why": "Người Nhật khiêm tốn khi được khen: いいえ、まだ上手じゃありません."
          },
          {
            "q": "Tả bạn cùng phòng: cao, tóc ngắn.",
            "options": [
              "ルームメイトの{背|せ}が{高|たか}くて{髪|かみ}です。 (Ruumumeito no se ga takakute kami desu.)",
              "ルームメイトは{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}いです。 (Ruumumeito wa se ga takakute, kami ga mijikai desu.)",
              "ルームメイトは{背|せ}が{高|たか}いで、{髪|かみ}が{短|みじか}いです。 (Ruumumeito wa se ga takai de, kami ga mijikai desu.)",
              "ルームメイトは{高|たか}くて、{短|みじか}いです。 (Ruumumeito wa takakute, mijikai desu.)"
            ],
            "correct": 1,
            "why": "N1 は N2 が A くて、N3 が A."
          },
          {
            "q": "Xem ảnh lớp, bạn hỏi: \"Người mắt to là ai?\"",
            "options": [
              "{大|おお}きい{目|め}は{誰|だれ}ですか。 (Ookii me wa dare desu ka.)",
              "{目|め}が{大|おお}きい{人|ひと}は{誰|だれ}ですか。 (Me ga ookii hito wa dare desu ka.)",
              "{目|め}が{大|おお}きいな{人|ひと}は{誰|だれ}ですか。 (Me ga ookii na hito wa dare desu ka.)",
              "{目|め}が{大|おお}きくて{人|ひと}は{誰|だれ}ですか。 (Me ga ookikute hito wa dare desu ka.)"
            ],
            "correct": 1,
            "why": "Cụm tả + 人: 目が大きい人."
          },
          {
            "q": "Nói về em trai: 20 tuổi, sinh viên chăm chỉ.",
            "options": [
              "{弟|おとうと}は{二十歳|はたち}くて、まじめな{大学生|だいがくせい}です。 (Otouto wa hatachi kute, majime na daigakusei desu.)",
              "{弟|おとうと}は{二十歳|はたち}で、まじめな{大学生|だいがくせい}です。 (Otouto wa hatachi de, majime na daigakusei desu.)",
              "{弟|おとうと}さんは{二十歳|はたち}で、まじめな{大学生|だいがくせい}です。 (Otouto-san wa hatachi de, majime na daigakusei desu.)",
              "{弟|おとうと}は{二十歳|はたち}で、まじめの{大学生|だいがくせい}です。 (Otouto wa hatachi de, majime no daigakusei desu.)"
            ],
            "correct": 1,
            "why": "N で · まじめな + N · em mình → 弟."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**Người は — đặc điểm が — tính từ**. Thi nói hỏi 「〜さんは どんな人ですか」 → trả lời **A1 くて／で、A2 人です** + thêm 1 câu (〜が上手です).",
          "Ba chữ đặc biệt: **いい → よくて**, **かっこいい → かっこよくて**, **きれい → きれいで** (ナA)."
        ]
      }
    ]
  },
  {
    "id": "lt-b8-np-3",
    "kind": "homework",
    "title": "Luyện thêm Bài 8 · Ngữ pháp 3 (ポイント 76, 77, 78) + TRỘN cả 9 điểm — あげます · もらいます · くれます (~114 câu)",
    "goal": "Chọn đúng あげます／もらいます／くれます theo chiều tặng (ai → ai, người nhận có phải tôi không), đúng trợ từ に／から／が, hỏi ai tặng; rồi làm bài trộn cả 9 điểm ngữ pháp Bài 8.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Trước mỗi câu, vẽ **mũi tên người cho → người nhận** rồi hỏi 3 câu: ① Chủ ngữ là người NHẬN? → **もらいます** (người cho + に／から). ② Chủ ngữ là người CHO và người nhận là **TÔI / người nhà tôi**? → **くれます**. ③ Chủ ngữ là người CHO, người nhận là người khác? → **あげます**.",
          "Lỗi số MỘT của bài: ~~友達は私に本をあげました~~ → **友達が（私に）本をくれました**. Người nhận là tôi thì KHÔNG BAO GIỜ dùng あげます.",
          "Dịp/ngày lễ + **に** (誕生日に, クリスマスに). Người cho là tổ chức (学校, 会社) → chỉ dùng **から** với もらいます."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**（người cho）は N(người nhận) に N(vật) を あげます。** — tôi → người khác, người khác → người khác (ポイント 76).",
          "**（người nhận）は N(người cho) に／から N(vật) を もらいます。** (ポイント 77).",
          "**N(người cho) が（私に）N(vật) を くれます。** — người khác → TÔI / người nhà tôi (ポイント 78).",
          "Hỏi: **誰が くれましたか** · **誰に もらいましたか** · **何を あげますか／あげませんか**."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng động từ"
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-76",
        "title": "ポイント 76: N に N を あげます (8 câu)",
        "items": [
          {
            "q": "{私|わたし}は{母|はは}＿＿{花|はな}をあげました。　〔Watashi wa haha __ hana o agemashita.〕　— Tôi đã tặng mẹ hoa.",
            "options": [
              "が",
              "で",
              "に",
              "を"
            ],
            "correct": 2,
            "why": "Người NHẬN + **に**. → **{私|わたし}は{母|はは}に{花|はな}をあげました。** 〔Watashi wa haha ni hana o agemashita.〕 — Tôi đã tặng mẹ hoa."
          },
          {
            "q": "カルロスさんはパクさんに{花|はな}を＿＿。　〔Karurosu-san wa Paku-san ni hana o __.〕　— Carlos đã tặng hoa cho Park.",
            "options": [
              "いました",
              "もらいました",
              "くれました",
              "あげました"
            ],
            "correct": 3,
            "why": "Carlos (cho) → Park (người khác) → **あげました**. → **カルロスさんはパクさんに{花|はな}をあげました。** 〔Karurosu-san wa Paku-san ni hana o agemashita.〕 — Carlos đã tặng hoa cho Park."
          },
          {
            "q": "バレンタインデーに{恋人|こいびと}にチョコレート＿＿あげます。　〔Barentaindee ni koibito ni chokoreeto __ agemasu.〕　— Ngày Valentine tôi tặng sô-cô-la cho người yêu.",
            "options": [
              "が",
              "を",
              "に",
              "と"
            ],
            "correct": 1,
            "why": "Vật tặng + **を**. → **バレンタインデーに{恋人|こいびと}にチョコレートをあげます。** 〔Barentaindee ni koibito ni chokoreeto o agemasu.〕 — Ngày Valentine tôi tặng sô-cô-la cho người yêu."
          },
          {
            "q": "パクさんの{誕生日|たんじょうび}に{何|なに}を＿＿か。　〔Paku-san no tanjoubi ni nani o __ ka.〕　— Sinh nhật Park, mình tặng gì đây?",
            "options": [
              "います",
              "あります",
              "くれます",
              "あげます"
            ],
            "correct": 3,
            "why": "Mình tặng Park (người khác) → **あげます**. → **パクさんの{誕生日|たんじょうび}に{何|なに}をあげますか。** 〔Paku-san no tanjoubi ni nani o agemasu ka.〕 — Sinh nhật Park, mình tặng gì đây?"
          },
          {
            "q": "{何|なに}かプレゼントをあげ＿＿か。——いいですね。　〔Nanika purezento o age __ ka. — Ii desu ne.〕　— Mình tặng quà gì đó không? — Hay đấy.",
            "options": [
              "ました",
              "ます",
              "たい",
              "ません"
            ],
            "correct": 3,
            "why": "Rủ (Bài 6): **V ませんか**. → **{何|なに}かプレゼントをあげませんか。——いいですね。** 〔Nanika purezento o age masen ka. — Ii desu ne.〕 — Mình tặng quà gì đó không? — Hay đấy."
          },
          {
            "q": "{私|わたし}は{花|はな}をあげ＿＿です。　〔Watashi wa hana o age __ desu.〕　— Tôi muốn tặng hoa.",
            "options": [
              "ません",
              "ます",
              "たい",
              "て"
            ],
            "correct": 2,
            "why": "Muốn làm (Bài 5): **V たいです**. → **{私|わたし}は{花|はな}をあげたいです。** 〔Watashi wa hana o age tai desu.〕 — Tôi muốn tặng hoa."
          },
          {
            "q": "{弟|おとうと}は{友達|ともだち}にゲームを＿＿。　〔Otouto wa tomodachi ni geemu o __.〕　— Em trai tôi đã tặng bạn nó trò chơi.",
            "options": [
              "あげました",
              "もらいました",
              "くれました",
              "いました"
            ],
            "correct": 0,
            "why": "Em trai tôi → bạn của nó (không phải tôi) → **あげました**. → **{弟|おとうと}は{友達|ともだち}にゲームをあげました。** 〔Otouto wa tomodachi ni geemu o agemashita.〕 — Em trai tôi đã tặng bạn nó trò chơi."
          },
          {
            "q": "クリスマス＿＿{家族|かぞく}にカードをあげます。　〔Kurisumasu __ kazoku ni kaado o agemasu.〕　— Giáng sinh tôi tặng thiệp cho gia đình.",
            "options": [
              "を",
              "が",
              "に",
              "で"
            ],
            "correct": 2,
            "why": "Dịp lễ + **に**. → **クリスマスに{家族|かぞく}にカードをあげます。** 〔Kurisumasu ni kazoku ni kaado o agemasu.〕 — Giáng sinh tôi tặng thiệp cho gia đình."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-77",
        "title": "ポイント 77: N に／から N を もらいます (8 câu)",
        "items": [
          {
            "q": "パクさんはカルロスさん＿＿{花|はな}をもらいました。　〔Paku-san wa Karurosu-san __ hana o moraimashita.〕　— Park đã nhận hoa của Carlos.",
            "options": [
              "に",
              "を",
              "が",
              "で"
            ],
            "correct": 0,
            "why": "Người CHO + **に** (hoặc から). → **パクさんはカルロスさんに{花|はな}をもらいました。** 〔Paku-san wa Karurosu-san ni hana o moraimashita.〕 — Park đã nhận hoa của Carlos."
          },
          {
            "q": "{私|わたし}は{姉|あね}にカメラを＿＿。　〔Watashi wa ane ni kamera o __.〕　— Tôi đã nhận máy ảnh của chị gái.",
            "options": [
              "あげました",
              "いました",
              "もらいました",
              "くれました"
            ],
            "correct": 2,
            "why": "Chủ ngữ là người NHẬN (tôi) → **もらいました**. → **{私|わたし}は{姉|あね}にカメラをもらいました。** 〔Watashi wa ane ni kamera o moraimashita.〕 — Tôi đã nhận máy ảnh của chị gái."
          },
          {
            "q": "{学校|がっこう}＿＿{辞書|じしょ}をもらいました。　〔Gakkou __ jisho o moraimashita.〕　— Tôi đã nhận từ điển từ nhà trường.",
            "options": [
              "に",
              "を",
              "から",
              "が"
            ],
            "correct": 2,
            "why": "Người cho là TỔ CHỨC → chỉ dùng **から**. → **{学校|がっこう}から{辞書|じしょ}をもらいました。** 〔Gakkou kara jisho o moraimashita.〕 — Tôi đã nhận từ điển từ nhà trường."
          },
          {
            "q": "その{時計|とけい}、{誰|だれ}＿＿もらいましたか。——{父|ちち}にもらいました。　〔Sono tokei, dare __ moraimashita ka. — Chichi ni moraimashita.〕　— Cái đồng hồ đó bạn nhận của ai? — Tôi nhận của bố.",
            "options": [
              "を",
              "が",
              "に",
              "で"
            ],
            "correct": 2,
            "why": "もらいます: người cho + **に**. → **その{時計|とけい}、{誰|だれ}にもらいましたか。——{父|ちち}にもらいました。** 〔Sono tokei, dare ni moraimashita ka. — Chichi ni moraimashita.〕 — Cái đồng hồ đó bạn nhận của ai? — Tôi nhận của bố."
          },
          {
            "q": "{誕生日|たんじょうび}に{何|なに}を＿＿か。——{靴下|くつした}をもらいました。　〔Tanjoubi ni nani o __ ka. — Kutsushita o moraimashita.〕　— Sinh nhật bạn đã nhận được gì? — Tôi nhận được đôi tất.",
            "options": [
              "いました",
              "あげました",
              "くれました",
              "もらいました"
            ],
            "correct": 3,
            "why": "Hỏi \"bạn đã nhận gì\" → **もらいましたか**. → **{誕生日|たんじょうび}に{何|なに}をもらいましたか。——{靴下|くつした}をもらいました。** 〔Tanjoubi ni nani o moraimashita ka. — Kutsushita o moraimashita.〕 — Sinh nhật bạn đã nhận được gì? — Tôi nhận được đôi tất."
          },
          {
            "q": "{妹|いもうと}は{祖母|そぼ}＿＿お{金|かね}をもらいました。　〔Imouto wa sobo __ okane o moraimashita.〕　— Em gái tôi đã nhận tiền của bà.",
            "options": [
              "が",
              "と",
              "を",
              "に"
            ],
            "correct": 3,
            "why": "Người cho + **に**. → **{妹|いもうと}は{祖母|そぼ}にお{金|かね}をもらいました。** 〔Imouto wa sobo ni okane o moraimashita.〕 — Em gái tôi đã nhận tiền của bà."
          },
          {
            "q": "{私|わたし}は{先輩|せんぱい}＿＿メールをもらいました。　〔Watashi wa senpai __ meeru o moraimashita.〕　— Tôi đã nhận được email của đàn anh.",
            "options": [
              "を",
              "で",
              "から",
              "が"
            ],
            "correct": 2,
            "why": "Người cho + **から** (に cũng được). → **{私|わたし}は{先輩|せんぱい}からメールをもらいました。** 〔Watashi wa senpai kara meeru o moraimashita.〕 — Tôi đã nhận được email của đàn anh."
          },
          {
            "q": "アンナさんは{友達|ともだち}にネックレスを＿＿。とても{素敵|すてき}です。　〔Anna-san wa tomodachi ni nekkuresu o __. Totemo suteki desu.〕　— Anna đã nhận dây chuyền của bạn. Rất đẹp.",
            "options": [
              "くれました",
              "いました",
              "もらいました",
              "あげてください"
            ],
            "correct": 2,
            "why": "Anna là người NHẬN → **もらいました**. → **アンナさんは{友達|ともだち}にネックレスをもらいました。とても{素敵|すてき}です。** 〔Anna-san wa tomodachi ni nekkuresu o moraimashita. Totemo suteki desu.〕 — Anna đã nhận dây chuyền của bạn. Rất đẹp."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-78",
        "title": "ポイント 78: N が（私に）N を くれます (8 câu)",
        "items": [
          {
            "q": "メアリーさんが{私|わたし}にかばんを＿＿。　〔Mearii-san ga watashi ni kaban o __.〕　— Mary đã tặng tôi cái túi.",
            "options": [
              "あげました",
              "もらいました",
              "くれました",
              "いました"
            ],
            "correct": 2,
            "why": "Người khác → TÔI → **くれました**. → **メアリーさんが{私|わたし}にかばんをくれました。** 〔Mearii-san ga watashi ni kaban o kuremashita.〕 — Mary đã tặng tôi cái túi."
          },
          {
            "q": "{友達|ともだち}＿＿CDをくれました。　〔Tomodachi __ CD o kuremashita.〕　— Bạn đã tặng tôi đĩa CD.",
            "options": [
              "が",
              "に",
              "を",
              "で"
            ],
            "correct": 0,
            "why": "Người CHO đi với **が** (私に lược đi). → **{友達|ともだち}がCDをくれました。** 〔Tomodachi ga CD o kuremashita.〕 — Bạn đã tặng tôi đĩa CD."
          },
          {
            "q": "{祖母|そぼ}が{妹|いもうと}にネックレスを＿＿。　〔Sobo ga imouto ni nekkuresu o __.〕　— Bà đã tặng em gái tôi sợi dây chuyền.",
            "options": [
              "もらいました",
              "くれました",
              "あげました",
              "いました"
            ],
            "correct": 1,
            "why": "Người nhận là người nhà tôi → **くれました**. → **{祖母|そぼ}が{妹|いもうと}にネックレスをくれました。** 〔Sobo ga imouto ni nekkuresu o kuremashita.〕 — Bà đã tặng em gái tôi sợi dây chuyền."
          },
          {
            "q": "その{時計|とけい}、{誰|だれ}＿＿くれましたか。——{父|ちち}がくれました。　〔Sono tokei, dare __ kuremashita ka. — Chichi ga kuremashita.〕　— Cái đồng hồ đó ai tặng bạn vậy? — Bố tôi tặng.",
            "options": [
              "で",
              "が",
              "を",
              "に"
            ],
            "correct": 1,
            "why": "くれます: người cho + **が**. → **その{時計|とけい}、{誰|だれ}がくれましたか。——{父|ちち}がくれました。** 〔Sono tokei, dare ga kuremashita ka. — Chichi ga kuremashita.〕 — Cái đồng hồ đó ai tặng bạn vậy? — Bố tôi tặng."
          },
          {
            "q": "{誕生日|たんじょうび}に{兄|あに}が{傘|かさ}を＿＿。　〔Tanjoubi ni ani ga kasa o __.〕　— Sinh nhật, anh trai đã tặng tôi cái ô.",
            "options": [
              "あげました",
              "います",
              "くれました",
              "もらいました"
            ],
            "correct": 2,
            "why": "Anh → tôi → **くれました**. → **{誕生日|たんじょうび}に{兄|あに}が{傘|かさ}をくれました。** 〔Tanjoubi ni ani ga kasa o kuremashita.〕 — Sinh nhật, anh trai đã tặng tôi cái ô."
          },
          {
            "q": "{先輩|せんぱい}が{辞書|じしょ}をくれました。＝{私|わたし}は{先輩|せんぱい}に{辞書|じしょ}を＿＿。　〔Senpai ga jisho o kuremashita. ＝ watashi wa senpai ni jisho o __.〕　— Đàn anh tặng tôi từ điển. = Tôi nhận từ điển của đàn anh.",
            "options": [
              "あげました",
              "くれました",
              "もらいました",
              "{送|おく}りました"
            ],
            "correct": 2,
            "why": "Cùng sự việc, chủ ngữ là tôi (người nhận) → **もらいました**. → **{先輩|せんぱい}が{辞書|じしょ}をくれました。＝{私|わたし}は{先輩|せんぱい}に{辞書|じしょ}をもらいました。** 〔Senpai ga jisho o kuremashita. ＝ watashi wa senpai ni jisho o moraimashita.〕 — Đàn anh tặng tôi từ điển. = Tôi nhận từ điển của đàn anh."
          },
          {
            "q": "{山田|やまだ}さんが{私|わたし}の{息子|むすこ}に{本|ほん}を＿＿。　〔Yamada-san ga watashi no musuko ni hon o __.〕　— Anh Yamada đã tặng con trai tôi quyển sách.",
            "options": [
              "いました",
              "くれました",
              "もらいました",
              "あげました"
            ],
            "correct": 1,
            "why": "Người nhận là con tôi (người nhà) → **くれました**. → **{山田|やまだ}さんが{私|わたし}の{息子|むすこ}に{本|ほん}をくれました。** 〔Yamada-san ga watashi no musuko ni hon o kuremashita.〕 — Anh Yamada đã tặng con trai tôi quyển sách."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Bạn tôi tặng tôi sô-cô-la.\"?",
            "options": [
              "{友達|ともだち}がチョコレートをくれました。 (Tomodachi ga chokoreeto o kuremashita.)",
              "{私|わたし}は{友達|ともだち}がチョコレートをもらいました。 (Watashi wa tomodachi ga chokoreeto o moraimashita.)",
              "{友達|ともだち}にチョコレートをくれました。 (Tomodachi ni chokoreeto o kuremashita.)",
              "{友達|ともだち}がチョコレートをあげました。 (Tomodachi ga chokoreeto o agemashita.)"
            ],
            "correct": 0,
            "why": "Người cho が + くれました."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · mũi tên → động từ · hỏi ai tặng · đọc bảng quà · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-mui-ten",
        "title": "Nhìn mũi tên (người cho → người nhận), chọn động từ / trợ từ (12 câu)",
        "items": [
          {
            "q": "アンナさんはマルコさんに{本|ほん}を＿＿。　〔Anna-san wa Maruko-san ni hon o __.〕　— (Anna → Marco) Anna đã tặng Marco quyển sách.",
            "options": [
              "あげました",
              "くれました",
              "もらいました"
            ],
            "correct": 0,
            "why": "Chủ ngữ = người cho, người nhận không phải tôi → **あげました**. → **アンナさんはマルコさんに{本|ほん}をあげました。** 〔Anna-san wa Maruko-san ni hon o agemashita.〕 — (Anna → Marco) Anna đã tặng Marco quyển sách."
          },
          {
            "q": "マルコさんはアンナさんに{本|ほん}を＿＿。　〔Maruko-san wa Anna-san ni hon o __.〕　— (Anna → Marco) Marco đã nhận sách của Anna.",
            "options": [
              "くれました",
              "あげました",
              "もらいました"
            ],
            "correct": 2,
            "why": "Chủ ngữ = người NHẬN → **もらいました**. → **マルコさんはアンナさんに{本|ほん}をもらいました。** 〔Maruko-san wa Anna-san ni hon o moraimashita.〕 — (Anna → Marco) Marco đã nhận sách của Anna."
          },
          {
            "q": "アンナさんが{本|ほん}を＿＿。　〔Anna-san ga hon o __.〕　— (Anna → tôi) Anna đã tặng tôi quyển sách.",
            "options": [
              "もらいました",
              "あげました",
              "くれました"
            ],
            "correct": 2,
            "why": "Người nhận là TÔI → **くれました**. → **アンナさんが{本|ほん}をくれました。** 〔Anna-san ga hon o kuremashita.〕 — (Anna → tôi) Anna đã tặng tôi quyển sách."
          },
          {
            "q": "{私|わたし}はアンナさんに{本|ほん}を＿＿。　〔Watashi wa Anna-san ni hon o __.〕　— (tôi → Anna) Tôi đã tặng Anna quyển sách.",
            "options": [
              "あげました",
              "くれました",
              "もらいました"
            ],
            "correct": 0,
            "why": "Tôi cho người khác → **あげました**. → **{私|わたし}はアンナさんに{本|ほん}をあげました。** 〔Watashi wa Anna-san ni hon o agemashita.〕 — (tôi → Anna) Tôi đã tặng Anna quyển sách."
          },
          {
            "q": "{私|わたし}はアンナさんに{本|ほん}を＿＿。　〔Watashi wa Anna-san ni hon o __.〕　— (Anna → tôi) Tôi đã nhận sách của Anna.",
            "options": [
              "くれました",
              "もらいました",
              "あげました"
            ],
            "correct": 1,
            "why": "Tôi là người NHẬN → **もらいました**. → **{私|わたし}はアンナさんに{本|ほん}をもらいました。** 〔Watashi wa Anna-san ni hon o moraimashita.〕 — (Anna → tôi) Tôi đã nhận sách của Anna."
          },
          {
            "q": "{先生|せんせい}が{弟|おとうと}に{辞書|じしょ}を＿＿。　〔Sensei ga otouto ni jisho o __.〕　— (thầy giáo → em trai tôi) Thầy giáo đã tặng em trai tôi cuốn từ điển.",
            "options": [
              "もらいました",
              "あげました",
              "くれました"
            ],
            "correct": 2,
            "why": "Người ngoài → người nhà tôi → **くれました**. → **{先生|せんせい}が{弟|おとうと}に{辞書|じしょ}をくれました。** 〔Sensei ga otouto ni jisho o kuremashita.〕 — (thầy giáo → em trai tôi) Thầy giáo đã tặng em trai tôi cuốn từ điển."
          },
          {
            "q": "{私|わたし}は{祖母|そぼ}に{靴下|くつした}を＿＿。　〔Watashi wa sobo ni kutsushita o __.〕　— (tôi → bà) Tôi đã tặng bà đôi tất.",
            "options": [
              "もらいました",
              "あげました",
              "くれました"
            ],
            "correct": 1,
            "why": "Tôi → bà → **あげました**. → **{私|わたし}は{祖母|そぼ}に{靴下|くつした}をあげました。** 〔Watashi wa sobo ni kutsushita o agemashita.〕 — (tôi → bà) Tôi đã tặng bà đôi tất."
          },
          {
            "q": "カルロスさんはパクさんにカードを＿＿。　〔Karurosu-san wa Paku-san ni kaado o __.〕　— (Carlos → Park) Carlos đã tặng Park tấm thiệp.",
            "options": [
              "あげました",
              "くれました",
              "もらいました"
            ],
            "correct": 0,
            "why": "Hai người khác: chủ ngữ là người cho → **あげました**. → **カルロスさんはパクさんにカードをあげました。** 〔Karurosu-san wa Paku-san ni kaado o agemashita.〕 — (Carlos → Park) Carlos đã tặng Park tấm thiệp."
          },
          {
            "q": "パクさんはカルロスさんにカードを＿＿。　〔Paku-san wa Karurosu-san ni kaado o __.〕　— (Carlos → Park) Park đã nhận thiệp của Carlos.",
            "options": [
              "もらいました",
              "あげました",
              "くれました"
            ],
            "correct": 0,
            "why": "Chủ ngữ là người nhận → **もらいました**. → **パクさんはカルロスさんにカードをもらいました。** 〔Paku-san wa Karurosu-san ni kaado o moraimashita.〕 — (Carlos → Park) Park đã nhận thiệp của Carlos."
          },
          {
            "q": "メアリーさん＿＿{私|わたし}にチョコレートをくれました。　〔Mearii-san __ watashi ni chokoreeto o kuremashita.〕　— (Mary → tôi) Mary đã tặng tôi sô-cô-la.",
            "options": [
              "に",
              "を",
              "が"
            ],
            "correct": 2,
            "why": "くれます: người cho + **が**. → **メアリーさんが{私|わたし}にチョコレートをくれました。** 〔Mearii-san ga watashi ni chokoreeto o kuremashita.〕 — (Mary → tôi) Mary đã tặng tôi sô-cô-la."
          },
          {
            "q": "{私|わたし}はメアリーさん＿＿チョコレートをもらいました。　〔Watashi wa Mearii-san __ chokoreeto o moraimashita.〕　— (Mary → tôi) Tôi đã nhận sô-cô-la của Mary.",
            "options": [
              "が",
              "を",
              "に"
            ],
            "correct": 2,
            "why": "もらいます: người cho + **に** (hoặc から). → **{私|わたし}はメアリーさんにチョコレートをもらいました。** 〔Watashi wa Mearii-san ni chokoreeto o moraimashita.〕 — (Mary → tôi) Tôi đã nhận sô-cô-la của Mary."
          },
          {
            "q": "パクさんはアンナさん＿＿ネックレスをあげました。　〔Paku-san wa Anna-san __ nekkuresu o agemashita.〕　— (Park → Anna) Park đã tặng Anna sợi dây chuyền.",
            "options": [
              "から",
              "に",
              "が"
            ],
            "correct": 1,
            "why": "あげます: người nhận + **に** (không dùng から). → **パクさんはアンナさんにネックレスをあげました。** 〔Paku-san wa Anna-san ni nekkuresu o agemashita.〕 — (Park → Anna) Park đã tặng Anna sợi dây chuyền."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-hoi-ai",
        "title": "Hỏi ai tặng — chọn câu trả lời đúng (8 câu)",
        "items": [
          {
            "q": "A：{素敵|すてき}な{時計|とけい}ですね。{誰|だれ}がくれましたか。B：＿＿。　〔A: suteki na tokei desu ne. Dare ga kuremashita ka. B: __.〕　— A: Đồng hồ đẹp nhỉ. Ai tặng bạn vậy? B: Bố tôi tặng.",
            "options": [
              "{父|ちち}にくれました",
              "{父|ちち}にあげました",
              "{父|ちち}がもらいました",
              "{父|ちち}がくれました"
            ],
            "correct": 3,
            "why": "Hỏi 誰が くれましたか → **N が くれました**. → **A：{素敵|すてき}な{時計|とけい}ですね。{誰|だれ}がくれましたか。B：{父|ちち}がくれました。** 〔A: suteki na tokei desu ne. Dare ga kuremashita ka. B: chichi ga kuremashita.〕 — A: Đồng hồ đẹp nhỉ. Ai tặng bạn vậy? B: Bố tôi tặng."
          },
          {
            "q": "A：そのかばん、{誰|だれ}にもらいましたか。B：＿＿。　〔A: sono kaban, dare ni moraimashita ka. B: __.〕　— A: Cái túi đó bạn nhận của ai? B: Tôi nhận của chị gái.",
            "options": [
              "{姉|あね}がもらいました",
              "{姉|あね}をもらいました",
              "{姉|あね}にもらいました",
              "{姉|あね}にくれました"
            ],
            "correct": 2,
            "why": "Hỏi 誰に もらいましたか → **N に もらいました**. → **A：そのかばん、{誰|だれ}にもらいましたか。B：{姉|あね}にもらいました。** 〔A: sono kaban, dare ni moraimashita ka. B: ane ni moraimashita.〕 — A: Cái túi đó bạn nhận của ai? B: Tôi nhận của chị gái."
          },
          {
            "q": "A：{誕生日|たんじょうび}に{何|なに}をもらいましたか。B：＿＿。　〔A: tanjoubi ni nani o moraimashita ka. B: __.〕　— A: Sinh nhật bạn đã nhận được gì? B: Tôi nhận được dây chuyền.",
            "options": [
              "ネックレスをくれました",
              "ネックレスをもらいました",
              "ネックレスがもらいました",
              "ネックレスにもらいました"
            ],
            "correct": 1,
            "why": "Vật + **を** もらいました. → **A：{誕生日|たんじょうび}に{何|なに}をもらいましたか。B：ネックレスをもらいました。** 〔A: tanjoubi ni nani o moraimashita ka. B: nekkuresu o moraimashita.〕 — A: Sinh nhật bạn đã nhận được gì? B: Tôi nhận được dây chuyền."
          },
          {
            "q": "A：お{母|かあ}さんに{何|なに}をあげますか。B：＿＿。　〔A: okaasan ni nani o agemasu ka. B: __.〕　— A: Bạn tặng mẹ cái gì? B: Tôi muốn tặng hoa.",
            "options": [
              "{花|はな}にあげたいです",
              "{花|はな}をくれたいです",
              "{花|はな}をあげたいです",
              "{花|はな}をもらいたいです"
            ],
            "correct": 2,
            "why": "Tôi tặng mẹ → **あげたいです**. → **A：お{母|かあ}さんに{何|なに}をあげますか。B：{花|はな}をあげたいです。** 〔A: okaasan ni nani o agemasu ka. B: hana o agetai desu.〕 — A: Bạn tặng mẹ cái gì? B: Tôi muốn tặng hoa."
          },
          {
            "q": "A：{誰|だれ}がこの{花|はな}をくれましたか。B：＿＿。　〔A: dare ga kono hana o kuremashita ka. B: __.〕　— A: Ai đã tặng bạn bó hoa này? B: Đàn em tặng tôi.",
            "options": [
              "{後輩|こうはい}をくれました",
              "{後輩|こうはい}があげました",
              "{後輩|こうはい}がくれました",
              "{後輩|こうはい}にくれました"
            ],
            "correct": 2,
            "why": "N **が** くれました. → **A：{誰|だれ}がこの{花|はな}をくれましたか。B：{後輩|こうはい}がくれました。** 〔A: dare ga kono hana o kuremashita ka. B: kouhai ga kuremashita.〕 — A: Ai đã tặng bạn bó hoa này? B: Đàn em tặng tôi."
          },
          {
            "q": "A：クリスマスに{何|なに}かもらいましたか。B：はい、＿＿。　〔A: Kurisumasu ni nanika moraimashita ka. B: hai, __.〕　— A: Giáng sinh bạn có nhận được gì không? B: Có, tôi nhận cái ô của bố mẹ.",
            "options": [
              "{両親|りょうしん}に{傘|かさ}をくれました",
              "{両親|りょうしん}に{傘|かさ}をもらいました",
              "{両親|りょうしん}を{傘|かさ}にもらいました",
              "{両親|りょうしん}が{傘|かさ}をもらいました"
            ],
            "correct": 1,
            "why": "Người cho **に**, vật **を** もらいました. → **A：クリスマスに{何|なに}かもらいましたか。B：はい、{両親|りょうしん}に{傘|かさ}をもらいました。** 〔A: Kurisumasu ni nanika moraimashita ka. B: hai, ryoushin ni kasa o moraimashita.〕 — A: Giáng sinh bạn có nhận được gì không? B: Có, tôi nhận cái ô của bố mẹ."
          },
          {
            "q": "A：パクさんに{何|なに}をあげましたか。B：＿＿。　〔A: Paku-san ni nani o agemashita ka. B: __.〕　— A: Bạn đã tặng Park cái gì? B: Tôi tặng sô-cô-la.",
            "options": [
              "チョコレートをくれました",
              "チョコレートがあげました",
              "チョコレートをあげました",
              "チョコレートをもらいました"
            ],
            "correct": 2,
            "why": "Tôi → Park → **あげました**. → **A：パクさんに{何|なに}をあげましたか。B：チョコレートをあげました。** 〔A: Paku-san ni nani o agemashita ka. B: chokoreeto o agemashita.〕 — A: Bạn đã tặng Park cái gì? B: Tôi tặng sô-cô-la."
          },
          {
            "q": "A：これ、{誰|だれ}にもらいましたか。B：＿＿。　〔A: kore, dare ni moraimashita ka. B: __.〕　— A: Cái này bạn nhận của ai? B: Tôi nhận của anh Yamada.",
            "options": [
              "{山田|やまだ}さんにもらいました",
              "{山田|やまだ}さんにあげました",
              "{山田|やまだ}さんがもらいました",
              "{山田|やまだ}さんをもらいました"
            ],
            "correct": 0,
            "why": "N **に** もらいました. → **A：これ、{誰|だれ}にもらいましたか。B：{山田|やまだ}さんにもらいました。** 〔A: kore, dare ni moraimashita ka. B: Yamada-san ni moraimashita.〕 — A: Cái này bạn nhận của ai? B: Tôi nhận của anh Yamada."
          }
        ]
      },
      {
        "t": "table",
        "head": [
          "Dịp",
          "Ai → ai",
          "Quà"
        ],
        "rows": [
          [
            "Sinh nhật tôi",
            "bố → tôi",
            "đồng hồ"
          ],
          [
            "Sinh nhật tôi",
            "chị gái → tôi",
            "cái ô"
          ],
          [
            "Giáng sinh",
            "tôi → bà",
            "đôi tất"
          ],
          [
            "Valentine",
            "Anna → Marco",
            "sô-cô-la"
          ],
          [
            "Lễ cưới chị Yamada",
            "tôi → chị Yamada",
            "hoa"
          ],
          [
            "Sinh nhật em gái tôi",
            "Mary → em gái tôi",
            "dây chuyền"
          ]
        ],
        "caption": "Bảng quà tặng (dùng cho 8 câu dưới đây)"
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-bang",
        "title": "Nhìn bảng quà tặng rồi trả lời (8 câu)",
        "items": [
          {
            "q": "{誕生日|たんじょうび}にお{父|とう}さんは{何|なに}をくれましたか。　〔Tanjoubi ni otousan wa nani o kuremashita ka.〕",
            "options": [
              "{傘|かさ}をくれました。 (Kasa o kuremashita.)",
              "{時計|とけい}をもらいました。 (Tokei o moraimashita.)",
              "{時計|とけい}をくれました。 (Tokei o kuremashita.)",
              "{時計|とけい}をあげました。 (Tokei o agemashita.)"
            ],
            "correct": 2,
            "why": "Bố → tôi: đồng hồ → 時計を くれました."
          },
          {
            "q": "{傘|かさ}は{誰|だれ}にもらいましたか。　〔Kasa wa dare ni moraimashita ka.〕",
            "options": [
              "{父|ちち}にもらいました。 (Chichi ni moraimashita.)",
              "{姉|あね}がもらいました。 (Ane ga moraimashita.)",
              "{祖母|そぼ}にもらいました。 (Sobo ni moraimashita.)",
              "{姉|あね}にもらいました。 (Ane ni moraimashita.)"
            ],
            "correct": 3,
            "why": "Ô là của chị gái tặng → 姉に もらいました."
          },
          {
            "q": "クリスマスに{誰|だれ}に{靴下|くつした}をあげましたか。　〔Kurisumasu ni dare ni kutsushita o agemashita ka.〕",
            "options": [
              "{祖母|そぼ}がくれました。 (Sobo ga kuremashita.)",
              "{祖母|そぼ}にもらいました。 (Sobo ni moraimashita.)",
              "{姉|あね}にあげました。 (Ane ni agemashita.)",
              "{祖母|そぼ}にあげました。 (Sobo ni agemashita.)"
            ],
            "correct": 3,
            "why": "Tôi → bà → 祖母に あげました."
          },
          {
            "q": "バレンタインデーにマルコさんは{何|なに}をもらいましたか。　〔Barentaindee ni Maruko-san wa nani o moraimashita ka.〕",
            "options": [
              "アンナさんがチョコレートをもらいました。 (Anna-san ga chokoreeto o moraimashita.)",
              "アンナさんにチョコレートをもらいました。 (Anna-san ni chokoreeto o moraimashita.)",
              "アンナさんにチョコレートをあげました。 (Anna-san ni chokoreeto o agemashita.)",
              "アンナさんに{花|はな}をもらいました。 (Anna-san ni hana o moraimashita.)"
            ],
            "correct": 1,
            "why": "Marco là người nhận → もらいました, người cho + に."
          },
          {
            "q": "バレンタインデーにアンナさんは{何|なに}をしましたか。　〔Barentaindee ni Anna-san wa nani o shimashita ka.〕",
            "options": [
              "マルコさんにチョコレートをくれました。 (Maruko-san ni chokoreeto o kuremashita.)",
              "マルコさんがチョコレートをあげました。 (Maruko-san ga chokoreeto o agemashita.)",
              "マルコさんにチョコレートをあげました。 (Maruko-san ni chokoreeto o agemashita.)",
              "マルコさんにチョコレートをもらいました。 (Maruko-san ni chokoreeto o moraimashita.)"
            ],
            "correct": 2,
            "why": "Anna là người cho, Marco không phải tôi → あげました."
          },
          {
            "q": "{山田|やまだ}さんの{結婚式|けっこんしき}に{何|なに}をあげましたか。　〔Yamada-san no kekkonshiki ni nani o agemashita ka.〕",
            "options": [
              "{花|はな}をくれました。 (Hana o kuremashita.)",
              "{花|はな}をもらいました。 (Hana o moraimashita.)",
              "ネックレスをあげました。 (Nekkuresu o agemashita.)",
              "{花|はな}をあげました。 (Hana o agemashita.)"
            ],
            "correct": 3,
            "why": "Tôi → chị Yamada: hoa."
          },
          {
            "q": "{妹|いもうと}さんの{誕生日|たんじょうび}に、メアリーさんは{何|なに}をくれましたか。　〔Imouto-san no tanjoubi ni, Mearii-san wa nani o kuremashita ka.〕",
            "options": [
              "ネックレスをくれました。 (Nekkuresu o kuremashita.)",
              "ネックレスをあげましたか。 (Nekkuresu o agemashita ka.)",
              "ネックレスをもらいました。 (Nekkuresu o moraimashita.)",
              "{靴下|くつした}をくれました。 (Kutsushita o kuremashita.)"
            ],
            "correct": 0,
            "why": "Mary → em gái TÔI (người nhà) → くれました."
          },
          {
            "q": "{時計|とけい}は{誰|だれ}がくれましたか。　〔Tokei wa dare ga kuremashita ka.〕",
            "options": [
              "{姉|あね}がくれました。 (Ane ga kuremashita.)",
              "{父|ちち}にくれました。 (Chichi ni kuremashita.)",
              "{父|ちち}がくれました。 (Chichi ga kuremashita.)",
              "{父|ちち}があげました。 (Chichi ga agemashita.)"
            ],
            "correct": 2,
            "why": "Bố → tôi → 父が くれました."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "{友達|ともだち}が{私|わたし}に{本|ほん}をくれました。 (Tomodachi ga watashi ni hon o kuremashita.)",
              "{私|わたし}は{友達|ともだち}に{本|ほん}をもらいました。 (Watashi wa tomodachi ni hon o moraimashita.)",
              "{友達|ともだち}は{私|わたし}に{本|ほん}をあげました。 (Tomodachi wa watashi ni hon o agemashita.)",
              "{私|わたし}は{友達|ともだち}に{本|ほん}をあげました。 (Watashi wa tomodachi ni hon o agemashita.)"
            ],
            "correct": 2,
            "why": "Người nhận là TÔI → **くれました**, không dùng あげました."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{私|わたし}は{姉|あね}にカメラをもらいました。 (Watashi wa ane ni kamera o moraimashita.)",
              "{私|わたし}は{姉|あね}がカメラをもらいました。 (Watashi wa ane ga kamera o moraimashita.)",
              "{姉|あね}がカメラをくれました。 (Ane ga kamera o kuremashita.)",
              "{私|わたし}は{姉|あね}からカメラをもらいました。 (Watashi wa ane kara kamera o moraimashita.)"
            ],
            "correct": 1,
            "why": "もらいます: người cho + **に／から**, không phải が."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{母|はは}が{花|はな}をくれました。 (Haha ga hana o kuremashita.)",
              "{私|わたし}は{母|はは}に{花|はな}をあげました。 (Watashi wa haha ni hana o agemashita.)",
              "{私|わたし}は{母|はは}に{花|はな}をくれました。 (Watashi wa haha ni hana o kuremashita.)",
              "{母|はは}に{花|はな}をもらいました。 (Haha ni hana o moraimashita.)"
            ],
            "correct": 2,
            "why": "Tôi → mẹ → **あげました**; くれます chỉ dùng khi người nhận là tôi."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{会社|かいしゃ}から{時計|とけい}をもらいました。 (Kaisha kara tokei o moraimashita.)",
              "{会社|かいしゃ}に{時計|とけい}をもらいました。 (Kaisha ni tokei o moraimashita.)",
              "{社長|しゃちょう}に{時計|とけい}をもらいました。 (Shachou ni tokei o moraimashita.)",
              "{社長|しゃちょう}が{時計|とけい}をくれました。 (Shachou ga tokei o kuremashita.)"
            ],
            "correct": 1,
            "why": "Người cho là TỔ CHỨC → chỉ **から**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{誕生日|たんじょうび}で{友達|ともだち}にカードをあげました。 (Tanjoubi de tomodachi ni kaado o agemashita.)",
              "{誕生日|たんじょうび}に{友達|ともだち}にカードをあげました。 (Tanjoubi ni tomodachi ni kaado o agemashita.)",
              "バレンタインデーにチョコレートをあげました。 (Barentaindee ni chokoreeto o agemashita.)",
              "クリスマスに{父|ちち}に{時計|とけい}をもらいました。 (Kurisumasu ni chichi ni tokei o moraimashita.)"
            ],
            "correct": 0,
            "why": "Dịp + **に**: 誕生日に."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{誰|だれ}にくれましたか。 (Dare ni kuremashita ka.)",
              "{誰|だれ}にもらいましたか。 (Dare ni moraimashita ka.)",
              "{誰|だれ}がくれましたか。 (Dare ga kuremashita ka.)",
              "{誰|だれ}にあげましたか。 (Dare ni agemashita ka.)"
            ],
            "correct": 0,
            "why": "くれます: người cho + **が** → 誰が くれましたか."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "カルロスさんはパクさんに{花|はな}をくれました。 (Karurosu-san wa Paku-san ni hana o kuremashita.)",
              "カルロスさんが{私|わたし}に{花|はな}をくれました。 (Karurosu-san ga watashi ni hana o kuremashita.)",
              "パクさんはカルロスさんに{花|はな}をもらいました。 (Paku-san wa Karurosu-san ni hana o moraimashita.)",
              "カルロスさんはパクさんに{花|はな}をあげました。 (Karurosu-san wa Paku-san ni hana o agemashita.)"
            ],
            "correct": 0,
            "why": "Không ai trong hai người là tôi → **あげました**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{妹|いもうと}が{私|わたし}に{花|はな}をあげました。 (Imouto ga watashi ni hana o agemashita.)",
              "{妹|いもうと}が{私|わたし}に{花|はな}をくれました。 (Imouto ga watashi ni hana o kuremashita.)",
              "{私|わたし}は{妹|いもうと}に{花|はな}をもらいました。 (Watashi wa imouto ni hana o moraimashita.)",
              "{私|わたし}は{妹|いもうと}に{花|はな}をあげました。 (Watashi wa imouto ni hana o agemashita.)"
            ],
            "correct": 0,
            "why": "Em gái → TÔI → **くれました**."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-np3-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 76–78",
        "items": [
          {
            "q": "Tôi đã tặng mẹ hoa.",
            "answers": [
              "私は母に花をあげました。",
              "私は母にはなをあげました。",
              "私はははに花をあげました。",
              "私はははにはなをあげました。",
              "わたしは母に花をあげました。",
              "わたしは母にはなをあげました。",
              "わたしはははに花をあげました。",
              "わたしはははにはなをあげました。",
              "母に花をあげました。",
              "母にはなをあげました。",
              "ははに花をあげました。",
              "ははにはなをあげました。"
            ],
            "hint": "người nhận に あげます"
          },
          {
            "q": "Tôi đã nhận thư của bà.",
            "answers": [
              "私は祖母に手紙をもらいました。",
              "私は祖母にてがみをもらいました。",
              "私はそぼに手紙をもらいました。",
              "私はそぼにてがみをもらいました。",
              "わたしは祖母に手紙をもらいました。",
              "わたしは祖母にてがみをもらいました。",
              "わたしはそぼに手紙をもらいました。",
              "わたしはそぼにてがみをもらいました。",
              "祖母に手紙をもらいました。",
              "祖母にてがみをもらいました。",
              "そぼに手紙をもらいました。",
              "そぼにてがみをもらいました。",
              "祖母から手紙をもらいました。",
              "祖母からてがみをもらいました。",
              "そぼから手紙をもらいました。",
              "そぼからてがみをもらいました。",
              "私は祖母から手紙をもらいました。",
              "私は祖母からてがみをもらいました。",
              "私はそぼから手紙をもらいました。",
              "私はそぼからてがみをもらいました。",
              "わたしは祖母から手紙をもらいました。",
              "わたしは祖母からてがみをもらいました。",
              "わたしはそぼから手紙をもらいました。",
              "わたしはそぼからてがみをもらいました。"
            ],
            "hint": "người cho に／から もらいます"
          },
          {
            "q": "Bạn tôi đã tặng tôi cái ô.",
            "answers": [
              "友達が傘をくれました。",
              "友達がかさをくれました。",
              "ともだちが傘をくれました。",
              "ともだちがかさをくれました。",
              "友達が私に傘をくれました。",
              "友達が私にかさをくれました。",
              "友達がわたしに傘をくれました。",
              "友達がわたしにかさをくれました。",
              "ともだちが私に傘をくれました。",
              "ともだちが私にかさをくれました。",
              "ともだちがわたしに傘をくれました。",
              "ともだちがわたしにかさをくれました。",
              "友達は私に傘をくれました。",
              "友達は私にかさをくれました。",
              "友達はわたしに傘をくれました。",
              "友達はわたしにかさをくれました。",
              "ともだちは私に傘をくれました。",
              "ともだちは私にかさをくれました。",
              "ともだちはわたしに傘をくれました。",
              "ともだちはわたしにかさをくれました。"
            ],
            "hint": "người cho が くれます"
          },
          {
            "q": "Cái đồng hồ đó ai tặng bạn vậy?",
            "answers": [
              "その時計、誰がくれましたか。",
              "その時計、だれがくれましたか。",
              "そのとけい、誰がくれましたか。",
              "そのとけい、だれがくれましたか。",
              "その時計は誰がくれましたか。",
              "その時計はだれがくれましたか。",
              "そのとけいは誰がくれましたか。",
              "そのとけいはだれがくれましたか。"
            ],
            "hint": "誰が くれましたか"
          },
          {
            "q": "Bạn đã nhận nó của ai?",
            "answers": [
              "誰にもらいましたか。",
              "だれにもらいましたか。",
              "誰からもらいましたか。",
              "だれからもらいましたか。"
            ],
            "hint": "誰に もらいましたか"
          },
          {
            "q": "Tôi muốn tặng sô-cô-la.",
            "answers": [
              "チョコレートをあげたいです。",
              "私はチョコレートをあげたいです。",
              "わたしはチョコレートをあげたいです。"
            ],
            "hint": "あげたいです"
          },
          {
            "q": "Giáng sinh, tôi đã nhận quà của bố mẹ.",
            "answers": [
              "クリスマスに両親にプレゼントをもらいました。",
              "クリスマスにりょうしんにプレゼントをもらいました。",
              "クリスマスに両親からプレゼントをもらいました。",
              "クリスマスにりょうしんからプレゼントをもらいました。"
            ],
            "hint": "Dịp に · người cho に もらいます"
          },
          {
            "q": "Mình tặng Park cái gì đó không?",
            "answers": [
              "パクさんに何かあげませんか。",
              "パクさんになにかあげませんか。",
              "パクさんに何かプレゼントをあげませんか。",
              "パクさんになにかプレゼントをあげませんか。"
            ],
            "hint": "何か あげませんか"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-np3-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Tôi đã tặng bạn đĩa CD.",
            "chips": [
              "{友達|ともだち}に",
              "CDを",
              "あげました",
              "くれました",
              "{私|わたし}は"
            ],
            "answer": [
              "{私|わたし}は",
              "{友達|ともだち}に",
              "CDを",
              "あげました"
            ],
            "ro": "Watashi wa tomodachi ni CD o agemashita"
          },
          {
            "vi": "Tôi đã nhận máy ảnh của chị gái.",
            "chips": [
              "もらいました",
              "カメラを",
              "{姉|あね}が",
              "{私|わたし}は",
              "{姉|あね}に"
            ],
            "answer": [
              "{私|わたし}は",
              "{姉|あね}に",
              "カメラを",
              "もらいました"
            ],
            "ro": "Watashi wa ane ni kamera o moraimashita"
          },
          {
            "vi": "Bố đã tặng tôi cái đồng hồ.",
            "chips": [
              "{時計|とけい}を",
              "{父|ちち}に",
              "{父|ちち}が",
              "くれました"
            ],
            "answer": [
              "{父|ちち}が",
              "{時計|とけい}を",
              "くれました"
            ],
            "ro": "Chichi ga tokei o kuremashita"
          },
          {
            "vi": "Sinh nhật, tôi đã nhận thiệp của bạn.",
            "chips": [
              "もらいました",
              "{誕生日|たんじょうび}に",
              "{誕生日|たんじょうび}で",
              "{友達|ともだち}に",
              "カードを"
            ],
            "answer": [
              "{誕生日|たんじょうび}に",
              "{友達|ともだち}に",
              "カードを",
              "もらいました"
            ],
            "ro": "Tanjoubi ni tomodachi ni kaado o moraimashita"
          },
          {
            "vi": "Mình tặng thầy cái gì đó không?",
            "chips": [
              "くれませんか",
              "{先生|せんせい}に",
              "{何|なに}か",
              "あげませんか"
            ],
            "answer": [
              "{先生|せんせい}に",
              "{何|なに}か",
              "あげませんか"
            ],
            "ro": "Sensei ni nanika agemasen ka"
          },
          {
            "vi": "Ai đã tặng bạn hoa?",
            "chips": [
              "{誰|だれ}に",
              "{花|はな}を",
              "{誰|だれ}が",
              "くれましたか"
            ],
            "answer": [
              "{誰|だれ}が",
              "{花|はな}を",
              "くれましたか"
            ],
            "ro": "Dare ga hana o kuremashita ka"
          },
          {
            "vi": "Tôi đã nhận từ điển từ nhà trường.",
            "chips": [
              "もらいました",
              "{学校|がっこう}から",
              "{辞書|じしょ}を",
              "{学校|がっこう}が"
            ],
            "answer": [
              "{学校|がっこう}から",
              "{辞書|じしょ}を",
              "もらいました"
            ],
            "ro": "Gakkou kara jisho o moraimashita"
          },
          {
            "vi": "Bà đã tặng em gái tôi dây chuyền.",
            "chips": [
              "{妹|いもうと}に",
              "{祖母|そぼ}が",
              "ネックレスを",
              "あげました",
              "くれました"
            ],
            "answer": [
              "{祖母|そぼ}が",
              "{妹|いもうと}に",
              "ネックレスを",
              "くれました"
            ],
            "ro": "Sobo ga imouto ni nekkuresu o kuremashita"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · TRỘN cả 9 điểm · dịch · nhiều ô trống · tình huống"
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-tron",
        "title": "TRỘN ポイント 72–80 (16 câu)",
        "items": [
          {
            "q": "{兄|あに}は{東京|とうきょう}の{会社|かいしゃ}＿＿{働|はたら}いています。　〔Ani wa Toukyou no kaisha __ hataraite imasu.〕　— Anh tôi làm việc ở một công ty tại Tokyo.",
            "options": [
              "に",
              "を",
              "で",
              "が"
            ],
            "correct": 2,
            "why": "(73) Nơi làm việc → で. → **{兄|あに}は{東京|とうきょう}の{会社|かいしゃ}で{働|はたら}いています。** 〔Ani wa Toukyou no kaisha de hataraite imasu.〕 — Anh tôi làm việc ở một công ty tại Tokyo."
          },
          {
            "q": "{私|わたし}は{弟|おとうと}＿＿{一人|ひとり}います。　〔Watashi wa otouto __ hitori imasu.〕　— Tôi có một em trai.",
            "options": [
              "に",
              "を",
              "が",
              "で"
            ],
            "correct": 2,
            "why": "(79) N が số います. → **{私|わたし}は{弟|おとうと}が{一人|ひとり}います。** 〔Watashi wa otouto ga hitori imasu.〕 — Tôi có một em trai."
          },
          {
            "q": "{友達|ともだち}と{四人|よにん}＿＿{旅行|りょこう}に{行|い}きました。　〔Tomodachi to yonin __ ryokou ni ikimashita.〕　— Tôi đi du lịch với bạn bè, tổng cộng bốn người.",
            "options": [
              "で",
              "に",
              "が",
              "と"
            ],
            "correct": 0,
            "why": "(80) Tổng số người + で. → **{友達|ともだち}と{四人|よにん}で{旅行|りょこう}に{行|い}きました。** 〔Tomodachi to yonin de ryokou ni ikimashita.〕 — Tôi đi du lịch với bạn bè, tổng cộng bốn người."
          },
          {
            "q": "{母|はは}は{目|め}が＿＿、{優|やさ}しいです。　〔Haha wa me ga __, yasashii desu.〕　— Mẹ tôi mắt to và hiền.",
            "options": [
              "{大|おお}きく",
              "{大|おお}きい",
              "{大|おお}きくて",
              "{大|おお}きいで"
            ],
            "correct": 2,
            "why": "(75) イA → くて. → **{母|はは}は{目|め}が{大|おお}きくて、{優|やさ}しいです。** 〔Haha wa me ga ookikute, yasashii desu.〕 — Mẹ tôi mắt to và hiền."
          },
          {
            "q": "{姉|あね}は＿＿。{横浜|よこはま}に{住|す}んでいます。　〔Ane wa __. Yokohama ni sunde imasu.〕　— Chị tôi đã lập gia đình. Chị sống ở Yokohama.",
            "options": [
              "{結婚|けっこん}です",
              "{結婚|けっこん}しています",
              "{結婚|けっこん}してください",
              "{結婚|けっこん}しますです"
            ],
            "correct": 1,
            "why": "(72) Trạng thái → 結婚しています. → **{姉|あね}は{結婚|けっこん}しています。{横浜|よこはま}に{住|す}んでいます。** 〔Ane wa kekkon shite imasu. Yokohama ni sunde imasu.〕 — Chị tôi đã lập gia đình. Chị sống ở Yokohama."
          },
          {
            "q": "{友達|ともだち}が{私|わたし}に{本|ほん}を＿＿。　〔Tomodachi ga watashi ni hon o __.〕　— Bạn đã tặng tôi quyển sách.",
            "options": [
              "いました",
              "あげました",
              "くれました",
              "もらいました"
            ],
            "correct": 2,
            "why": "(78) → tôi: くれました. → **{友達|ともだち}が{私|わたし}に{本|ほん}をくれました。** 〔Tomodachi ga watashi ni hon o kuremashita.〕 — Bạn đã tặng tôi quyển sách."
          },
          {
            "q": "パクさんはアンナさん＿＿{花|はな}をもらいました。　〔Paku-san wa Anna-san __ hana o moraimashita.〕　— Park đã nhận hoa của Anna.",
            "options": [
              "が",
              "を",
              "で",
              "に"
            ],
            "correct": 3,
            "why": "(77) Người cho + に. → **パクさんはアンナさんに{花|はな}をもらいました。** 〔Paku-san wa Anna-san ni hana o moraimashita.〕 — Park đã nhận hoa của Anna."
          },
          {
            "q": "{田中|たなか}さんは{親切|しんせつ}＿＿、まじめな{人|ひと}です。　〔Tanaka-san wa shinsetsu __, majime na hito desu.〕　— Anh Tanaka là người tốt bụng và chăm chỉ.",
            "options": [
              "くて",
              "な",
              "で",
              "と"
            ],
            "correct": 2,
            "why": "(75) ナA → で. → **{田中|たなか}さんは{親切|しんせつ}で、まじめな{人|ひと}です。** 〔Tanaka-san wa shinsetsu de, majime na hito desu.〕 — Anh Tanaka là người tốt bụng và chăm chỉ."
          },
          {
            "q": "{兄弟|きょうだい}が＿＿いますか。　〔Kyoudai ga __ imasu ka.〕　— Bạn có mấy anh chị em?",
            "options": [
              "{何匹|なんびき}",
              "{何人|なんにん}",
              "{何歳|なんさい}",
              "いくら"
            ],
            "correct": 1,
            "why": "(79) Hỏi số người → 何人. → **{兄弟|きょうだい}が{何人|なんにん}いますか。** 〔Kyoudai ga nannin imasu ka.〕 — Bạn có mấy anh chị em?"
          },
          {
            "q": "{私|わたし}は{先輩|せんぱい}にネックレスを＿＿。　〔Watashi wa senpai ni nekkuresu o __.〕　— Tôi đã tặng đàn chị sợi dây chuyền.",
            "options": [
              "いました",
              "あげました",
              "くれました",
              "{住|す}みました"
            ],
            "correct": 1,
            "why": "(76) Tôi → đàn anh → あげました. → **{私|わたし}は{先輩|せんぱい}にネックレスをあげました。** 〔Watashi wa senpai ni nekkuresu o agemashita.〕 — Tôi đã tặng đàn chị sợi dây chuyền."
          },
          {
            "q": "ナタポンさんは{絵|え}＿＿{上手|じょうず}です。　〔Natapon-san wa e __ jouzu desu.〕　— Natapon vẽ giỏi.",
            "options": [
              "に",
              "を",
              "が",
              "で"
            ],
            "correct": 2,
            "why": "(74) Kỹ năng + が. → **ナタポンさんは{絵|え}が{上手|じょうず}です。** 〔Natapon-san wa e ga jouzu desu.〕 — Natapon vẽ giỏi."
          },
          {
            "q": "{父|ちち}は{医者|いしゃ}＿＿、{病院|びょういん}で{働|はたら}いています。　〔Chichi wa isha __, byouin de hataraite imasu.〕　— Bố tôi là bác sĩ, làm việc ở bệnh viện.",
            "options": [
              "に",
              "で",
              "くて",
              "と"
            ],
            "correct": 1,
            "why": "(75) N → で. → **{父|ちち}は{医者|いしゃ}で、{病院|びょういん}で{働|はたら}いています。** 〔Chichi wa isha de, byouin de hataraite imasu.〕 — Bố tôi là bác sĩ, làm việc ở bệnh viện."
          },
          {
            "q": "{私|わたし}は{一人|ひとり}＿＿{住|す}んでいます。　〔Watashi wa hitori __ sunde imasu.〕　— Tôi sống một mình.",
            "options": [
              "で",
              "に",
              "が",
              "を"
            ],
            "correct": 0,
            "why": "(80) 一人で. → **{私|わたし}は{一人|ひとり}で{住|す}んでいます。** 〔Watashi wa hitori de sunde imasu.〕 — Tôi sống một mình."
          },
          {
            "q": "{妹|いもうと}は{高校|こうこう}で{日本語|にほんご}を＿＿。　〔Imouto wa koukou de Nihongo o __.〕　— Em gái tôi học tiếng Nhật ở trường cấp 3.",
            "options": [
              "{勉強|べんきょう}しっています",
              "{勉強|べんきょう}しますか",
              "{勉強|べんきょう}です",
              "{勉強|べんきょう}しています"
            ],
            "correct": 3,
            "why": "(73) Việc học lâu dài → しています. → **{妹|いもうと}は{高校|こうこう}で{日本語|にほんご}を{勉強|べんきょう}しています。** 〔Imouto wa koukou de Nihongo o benkyou shite imasu.〕 — Em gái tôi học tiếng Nhật ở trường cấp 3."
          },
          {
            "q": "{猫|ねこ}が＿＿います。{一匹|いっぴき}は{白|しろ}くて、{一匹|いっぴき}は{黒|くろ}いです。　〔Neko ga __ imasu. Ippiki wa shirokute, ippiki wa kuroi desu.〕　— Tôi có hai con mèo. Một con trắng, một con đen.",
            "options": [
              "{二|ふた}つ",
              "{二人|ふたり}",
              "{二匹|にひき}",
              "{二枚|にまい}"
            ],
            "correct": 2,
            "why": "(79) Con vật → 匹. → **{猫|ねこ}が{二匹|にひき}います。{一匹|いっぴき}は{白|しろ}くて、{一匹|いっぴき}は{黒|くろ}いです。** 〔Neko ga nihiki imasu. Ippiki wa shirokute, ippiki wa kuroi desu.〕 — Tôi có hai con mèo. Một con trắng, một con đen."
          },
          {
            "q": "{誰|だれ}＿＿くれましたか。　〔Dare __ kuremashita ka.〕　— Ai đã tặng bạn vậy?",
            "options": [
              "に",
              "を",
              "が",
              "で"
            ],
            "correct": 2,
            "why": "(78) くれます: người cho + が. → **{誰|だれ}がくれましたか。** 〔Dare ga kuremashita ka.〕 — Ai đã tặng bạn vậy?"
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-np3-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 72–80",
        "items": [
          {
            "q": "Tôi sống với gia đình ở Hà Nội. Nhà tôi có bốn người.",
            "answers": [
              "家族とハノイに住んでいます。家族は四人です。",
              "家族とハノイに住んでいます。家族はよにんです。",
              "家族とハノイに住んでいます。かぞくは四人です。",
              "家族とハノイに住んでいます。かぞくはよにんです。",
              "家族とハノイにすんでいます。家族は四人です。",
              "家族とハノイにすんでいます。家族はよにんです。",
              "家族とハノイにすんでいます。かぞくは四人です。",
              "家族とハノイにすんでいます。かぞくはよにんです。",
              "かぞくとハノイに住んでいます。家族は四人です。",
              "かぞくとハノイに住んでいます。家族はよにんです。",
              "かぞくとハノイに住んでいます。かぞくは四人です。",
              "かぞくとハノイに住んでいます。かぞくはよにんです。",
              "かぞくとハノイにすんでいます。家族は四人です。",
              "かぞくとハノイにすんでいます。家族はよにんです。",
              "かぞくとハノイにすんでいます。かぞくは四人です。",
              "かぞくとハノイにすんでいます。かぞくはよにんです。",
              "私は家族とハノイに住んでいます。家族は四人です。",
              "私は家族とハノイに住んでいます。家族はよにんです。",
              "私は家族とハノイに住んでいます。かぞくは四人です。",
              "私は家族とハノイに住んでいます。かぞくはよにんです。",
              "私は家族とハノイにすんでいます。家族は四人です。",
              "私は家族とハノイにすんでいます。家族はよにんです。",
              "私は家族とハノイにすんでいます。かぞくは四人です。",
              "私は家族とハノイにすんでいます。かぞくはよにんです。",
              "私はかぞくとハノイに住んでいます。家族は四人です。",
              "私はかぞくとハノイに住んでいます。家族はよにんです。",
              "私はかぞくとハノイに住んでいます。かぞくは四人です。",
              "私はかぞくとハノイに住んでいます。かぞくはよにんです。",
              "私はかぞくとハノイにすんでいます。家族は四人です。",
              "私はかぞくとハノイにすんでいます。家族はよにんです。",
              "私はかぞくとハノイにすんでいます。かぞくは四人です。",
              "私はかぞくとハノイにすんでいます。かぞくはよにんです。",
              "わたしは家族とハノイに住んでいます。家族は四人です。",
              "わたしは家族とハノイに住んでいます。家族はよにんです。",
              "わたしは家族とハノイに住んでいます。かぞくは四人です。",
              "わたしは家族とハノイに住んでいます。かぞくはよにんです。",
              "わたしは家族とハノイにすんでいます。家族は四人です。",
              "わたしは家族とハノイにすんでいます。家族はよにんです。",
              "わたしは家族とハノイにすんでいます。かぞくは四人です。",
              "わたしは家族とハノイにすんでいます。かぞくはよにんです。",
              "わたしはかぞくとハノイに住んでいます。家族は四人です。",
              "わたしはかぞくとハノイに住んでいます。家族はよにんです。",
              "わたしはかぞくとハノイに住んでいます。かぞくは四人です。",
              "わたしはかぞくとハノイに住んでいます。かぞくはよにんです。",
              "わたしはかぞくとハノイにすんでいます。家族は四人です。",
              "わたしはかぞくとハノイにすんでいます。家族はよにんです。",
              "わたしはかぞくとハノイにすんでいます。かぞくは四人です。",
              "わたしはかぞくとハノイにすんでいます。かぞくはよにんです。"
            ],
            "hint": "72 · 79"
          },
          {
            "q": "Anh trai tôi là bác sĩ và đã kết hôn.",
            "answers": [
              "兄は医者で、結婚しています。",
              "兄は医者で、けっこんしています。",
              "兄はいしゃで、結婚しています。",
              "兄はいしゃで、けっこんしています。",
              "あには医者で、結婚しています。",
              "あには医者で、けっこんしています。",
              "あにはいしゃで、結婚しています。",
              "あにはいしゃで、けっこんしています。"
            ],
            "hint": "75 · 72"
          },
          {
            "q": "Mary đã tặng tôi cái túi.",
            "answers": [
              "メアリーさんがかばんをくれました。",
              "メアリーさんが私にかばんをくれました。",
              "メアリーさんがわたしにかばんをくれました。",
              "メアリーさんは私にかばんをくれました。",
              "メアリーさんはわたしにかばんをくれました。"
            ],
            "hint": "78"
          },
          {
            "q": "Park đã nhận hoa của Carlos.",
            "answers": [
              "パクさんはカルロスさんに花をもらいました。",
              "パクさんはカルロスさんにはなをもらいました。",
              "パクさんはカルロスさんから花をもらいました。",
              "パクさんはカルロスさんからはなをもらいました。"
            ],
            "hint": "77"
          },
          {
            "q": "Sinh nhật mẹ, tôi muốn tặng mẹ dây chuyền.",
            "answers": [
              "母の誕生日にネックレスをあげたいです。",
              "母のたんじょうびにネックレスをあげたいです。",
              "ははの誕生日にネックレスをあげたいです。",
              "ははのたんじょうびにネックレスをあげたいです。",
              "母の誕生日に母にネックレスをあげたいです。",
              "母の誕生日にははにネックレスをあげたいです。",
              "母のたんじょうびに母にネックレスをあげたいです。",
              "母のたんじょうびにははにネックレスをあげたいです。",
              "ははの誕生日に母にネックレスをあげたいです。",
              "ははの誕生日にははにネックレスをあげたいです。",
              "ははのたんじょうびに母にネックレスをあげたいです。",
              "ははのたんじょうびにははにネックレスをあげたいです。"
            ],
            "hint": "76 · たい"
          },
          {
            "q": "Bạn tôi là người dễ thương và tốt bụng.",
            "answers": [
              "友達はかわいくて、親切な人です。",
              "友達はかわいくて、親切なひとです。",
              "友達はかわいくて、しんせつな人です。",
              "友達はかわいくて、しんせつなひとです。",
              "ともだちはかわいくて、親切な人です。",
              "ともだちはかわいくて、親切なひとです。",
              "ともだちはかわいくて、しんせつな人です。",
              "ともだちはかわいくて、しんせつなひとです。",
              "私の友達はかわいくて、親切な人です。",
              "私の友達はかわいくて、親切なひとです。",
              "私の友達はかわいくて、しんせつな人です。",
              "私の友達はかわいくて、しんせつなひとです。",
              "私のともだちはかわいくて、親切な人です。",
              "私のともだちはかわいくて、親切なひとです。",
              "私のともだちはかわいくて、しんせつな人です。",
              "私のともだちはかわいくて、しんせつなひとです。",
              "わたしの友達はかわいくて、親切な人です。",
              "わたしの友達はかわいくて、親切なひとです。",
              "わたしの友達はかわいくて、しんせつな人です。",
              "わたしの友達はかわいくて、しんせつなひとです。",
              "わたしのともだちはかわいくて、親切な人です。",
              "わたしのともだちはかわいくて、親切なひとです。",
              "わたしのともだちはかわいくて、しんせつな人です。",
              "わたしのともだちはかわいくて、しんせつなひとです。"
            ],
            "hint": "75"
          },
          {
            "q": "Em trai tôi đang học kinh tế ở một trường đại học tại Tokyo.",
            "answers": [
              "弟は東京の大学で経済を勉強しています。",
              "弟は東京の大学で経済をべんきょうしています。",
              "弟は東京の大学でけいざいを勉強しています。",
              "弟は東京の大学でけいざいをべんきょうしています。",
              "弟は東京のだいがくで経済を勉強しています。",
              "弟は東京のだいがくで経済をべんきょうしています。",
              "弟は東京のだいがくでけいざいを勉強しています。",
              "弟は東京のだいがくでけいざいをべんきょうしています。",
              "弟はとうきょうの大学で経済を勉強しています。",
              "弟はとうきょうの大学で経済をべんきょうしています。",
              "弟はとうきょうの大学でけいざいを勉強しています。",
              "弟はとうきょうの大学でけいざいをべんきょうしています。",
              "弟はとうきょうのだいがくで経済を勉強しています。",
              "弟はとうきょうのだいがくで経済をべんきょうしています。",
              "弟はとうきょうのだいがくでけいざいを勉強しています。",
              "弟はとうきょうのだいがくでけいざいをべんきょうしています。",
              "おとうとは東京の大学で経済を勉強しています。",
              "おとうとは東京の大学で経済をべんきょうしています。",
              "おとうとは東京の大学でけいざいを勉強しています。",
              "おとうとは東京の大学でけいざいをべんきょうしています。",
              "おとうとは東京のだいがくで経済を勉強しています。",
              "おとうとは東京のだいがくで経済をべんきょうしています。",
              "おとうとは東京のだいがくでけいざいを勉強しています。",
              "おとうとは東京のだいがくでけいざいをべんきょうしています。",
              "おとうとはとうきょうの大学で経済を勉強しています。",
              "おとうとはとうきょうの大学で経済をべんきょうしています。",
              "おとうとはとうきょうの大学でけいざいを勉強しています。",
              "おとうとはとうきょうの大学でけいざいをべんきょうしています。",
              "おとうとはとうきょうのだいがくで経済を勉強しています。",
              "おとうとはとうきょうのだいがくで経済をべんきょうしています。",
              "おとうとはとうきょうのだいがくでけいざいを勉強しています。",
              "おとうとはとうきょうのだいがくでけいざいをべんきょうしています。"
            ],
            "hint": "73"
          },
          {
            "q": "Cái ô đó ai tặng bạn vậy? — Đàn anh tặng tôi.",
            "answers": [
              "その傘、誰がくれましたか。先輩がくれました。",
              "その傘、誰がくれましたか。せんぱいがくれました。",
              "その傘、だれがくれましたか。先輩がくれました。",
              "その傘、だれがくれましたか。せんぱいがくれました。",
              "そのかさ、誰がくれましたか。先輩がくれました。",
              "そのかさ、誰がくれましたか。せんぱいがくれました。",
              "そのかさ、だれがくれましたか。先輩がくれました。",
              "そのかさ、だれがくれましたか。せんぱいがくれました。",
              "その傘は誰がくれましたか。先輩がくれました。",
              "その傘は誰がくれましたか。せんぱいがくれました。",
              "その傘はだれがくれましたか。先輩がくれました。",
              "その傘はだれがくれましたか。せんぱいがくれました。",
              "そのかさは誰がくれましたか。先輩がくれました。",
              "そのかさは誰がくれましたか。せんぱいがくれました。",
              "そのかさはだれがくれましたか。先輩がくれました。",
              "そのかさはだれがくれましたか。せんぱいがくれました。"
            ],
            "hint": "78"
          },
          {
            "q": "Tôi có hai em gái. Em gái tôi tóc dài và mắt to.",
            "answers": [
              "妹が二人います。妹は髪が長くて、目が大きいです。",
              "いもうとがふたりいます。いもうとはかみがながくて、めがおおきいです。",
              "いもうとが二人います。妹は髪が長くて、目が大きいです。",
              "妹がふたりいます。いもうとはかみがながくて、めがおおきいです。",
              "妹がふたりいます。妹は髪が長くて、目が大きいです。",
              "いもうとが二人います。いもうとはかみがながくて、めがおおきいです。",
              "妹が二人います。いもうとは髪が長くて、目が大きいです。",
              "いもうとがふたりいます。妹はかみがながくて、めがおおきいです。",
              "妹が二人います。妹はかみが長くて、目が大きいです。",
              "いもうとがふたりいます。いもうとは髪がながくて、めがおおきいです。",
              "妹が二人います。妹は髪がながくて、目が大きいです。",
              "いもうとがふたりいます。いもうとはかみが長くて、めがおおきいです。",
              "妹が二人います。妹は髪が長くて、めが大きいです。",
              "いもうとがふたりいます。いもうとはかみがながくて、目がおおきいです。",
              "妹が二人います。妹は髪が長くて、目がおおきいです。",
              "いもうとがふたりいます。いもうとはかみがながくて、めが大きいです。",
              "私は妹が二人います。妹は髪が長くて、目が大きいです。",
              "わたしはいもうとがふたりいます。いもうとはかみがながくて、めがおおきいです。",
              "わたしは妹が二人います。妹は髪が長くて、目が大きいです。",
              "私はいもうとがふたりいます。いもうとはかみがながくて、めがおおきいです。",
              "私はいもうとが二人います。妹は髪が長くて、目が大きいです。",
              "わたしは妹がふたりいます。いもうとはかみがながくて、めがおおきいです。",
              "私は妹がふたりいます。妹は髪が長くて、目が大きいです。",
              "わたしはいもうとが二人います。いもうとはかみがながくて、めがおおきいです。",
              "私は妹が二人います。いもうとは髪が長くて、目が大きいです。",
              "わたしはいもうとがふたりいます。妹はかみがながくて、めがおおきいです。",
              "私は妹が二人います。妹はかみが長くて、目が大きいです。",
              "わたしはいもうとがふたりいます。いもうとは髪がながくて、めがおおきいです。",
              "私は妹が二人います。妹は髪がながくて、目が大きいです。",
              "わたしはいもうとがふたりいます。いもうとはかみが長くて、めがおおきいです。",
              "私は妹が二人います。妹は髪が長くて、めが大きいです。",
              "わたしはいもうとがふたりいます。いもうとはかみがながくて、目がおおきいです。",
              "私は妹が二人います。妹は髪が長くて、目がおおきいです。",
              "わたしはいもうとがふたりいます。いもうとはかみがながくて、めが大きいです。"
            ],
            "hint": "79 · 74 · 75"
          },
          {
            "q": "Tôi sống với bạn cùng phòng, hai người. Bạn ấy chăm chỉ và thông minh.",
            "answers": [
              "ルームメイトと二人で住んでいます。ルームメイトはまじめで、頭がいいです。",
              "ルームメイトと二人で住んでいます。ルームメイトはまじめで、あたまがいいです。",
              "ルームメイトと二人ですんでいます。ルームメイトはまじめで、頭がいいです。",
              "ルームメイトと二人ですんでいます。ルームメイトはまじめで、あたまがいいです。",
              "ルームメイトとふたりで住んでいます。ルームメイトはまじめで、頭がいいです。",
              "ルームメイトとふたりで住んでいます。ルームメイトはまじめで、あたまがいいです。",
              "ルームメイトとふたりですんでいます。ルームメイトはまじめで、頭がいいです。",
              "ルームメイトとふたりですんでいます。ルームメイトはまじめで、あたまがいいです。"
            ],
            "hint": "80 · 75"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{姉|あね}は{医者|いしゃ}（①）、{大阪|おおさか}（②）{住|す}んでいます。　〔Ane wa isha((1)), Oosaka ((2)) sunde imasu.〕　— Chị tôi là bác sĩ, sống ở Osaka.",
            "options": [
              "① くて　② で",
              "① で　② に",
              "① に　② に",
              "① で　② で"
            ],
            "correct": 1,
            "why": "N **で** · nơi ở **に**. → **{姉|あね}は{医者|いしゃ}で、{大阪|おおさか}に{住|す}んでいます。** 〔Ane wa isha de, Oosaka ni sunde imasu.〕 — Chị tôi là bác sĩ, sống ở Osaka."
          },
          {
            "q": "{友達|ともだち}（①）{私|わたし}に{花|はな}を（②）。　〔Tomodachi ((1)) watashi ni hana o ((2)).〕　— Bạn đã tặng tôi hoa.",
            "options": [
              "① に　② くれました",
              "① が　② あげました",
              "① が　② くれました",
              "① に　② もらいました"
            ],
            "correct": 2,
            "why": "Người cho **が** … **くれました**. → **{友達|ともだち}が{私|わたし}に{花|はな}をくれました。** 〔Tomodachi ga watashi ni hana o kuremashita.〕 — Bạn đã tặng tôi hoa."
          },
          {
            "q": "{私|わたし}は{母|はは}（①）カードを（②）。　〔Watashi wa haha ((1)) kaado o ((2)).〕　— Tôi đã tặng mẹ tấm thiệp.",
            "options": [
              "① を　② あげました",
              "① に　② あげました",
              "① に　② くれました",
              "① が　② あげました"
            ],
            "correct": 1,
            "why": "Người nhận **に** · tôi cho → **あげました**. → **{私|わたし}は{母|はは}にカードをあげました。** 〔Watashi wa haha ni kaado o agemashita.〕 — Tôi đã tặng mẹ tấm thiệp."
          },
          {
            "q": "{私|わたし}は{先輩|せんぱい}（①）{辞書|じしょ}を（②）。　〔Watashi wa senpai ((1)) jisho o ((2)).〕　— Tôi đã nhận từ điển của đàn anh.",
            "options": [
              "① を　② もらいました",
              "① が　② もらいました",
              "① に　② もらいました",
              "① に　② くれました"
            ],
            "correct": 2,
            "why": "Người cho **に** · tôi nhận → **もらいました**. → **{私|わたし}は{先輩|せんぱい}に{辞書|じしょ}をもらいました。** 〔Watashi wa senpai ni jisho o moraimashita.〕 — Tôi đã nhận từ điển của đàn anh."
          },
          {
            "q": "{兄|あに}は{背|せ}が{高|たか}（①）、サッカー（②）{上手|じょうず}です。　〔Ani wa se ga taka((1)), sakkaa ((2)) jouzu desu.〕　— Anh tôi cao và đá bóng giỏi.",
            "options": [
              "① い　② に",
              "① いで　② が",
              "① くて　② を",
              "① くて　② が"
            ],
            "correct": 3,
            "why": "高**くて** · サッカー**が** 上手. → **{兄|あに}は{背|せ}が{高|たか}くて、サッカーが{上手|じょうず}です。** 〔Ani wa se ga takakute, sakkaa ga jouzu desu.〕 — Anh tôi cao và đá bóng giỏi."
          },
          {
            "q": "ルームメイト（①）{三人|さんにん}（②）{住|す}んでいます。　〔Ruumumeito ((1)) sannin ((2)) sunde imasu.〕　— Tôi sống với các bạn cùng phòng, tổng cộng ba người.",
            "options": [
              "① と　② に",
              "① で　② と",
              "① と　② で",
              "① が　② に"
            ],
            "correct": 2,
            "why": "Cùng ai **と** · tổng số **で**. → **ルームメイトと{三人|さんにん}で{住|す}んでいます。** 〔Ruumumeito to sannin de sunde imasu.〕 — Tôi sống với các bạn cùng phòng, tổng cộng ba người."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-np3-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Bạn thấy bạn mình có cái đồng hồ mới rất đẹp. Bạn hỏi ai tặng.",
            "options": [
              "{素敵|すてき}{時計|とけい}ですね。{誰|だれ}にあげましたか。 (Suteki tokei desu ne. Dare ni agemashita ka.)",
              "{素敵|すてき}な{時計|とけい}ですね。{誰|だれ}にくれましたか。 (Suteki na tokei desu ne. Dare ni kuremashita ka.)",
              "{素敵|すてき}な{時計|とけい}ですね。{誰|だれ}がもらいましたか。 (Suteki na tokei desu ne. Dare ga moraimashita ka.)",
              "{素敵|すてき}な{時計|とけい}ですね。{誰|だれ}がくれましたか。 (Suteki na tokei desu ne. Dare ga kuremashita ka.)"
            ],
            "correct": 3,
            "why": "素敵な + N · 誰が くれましたか."
          },
          {
            "q": "Bạn rủ bạn cùng tặng quà sinh nhật cho Park.",
            "options": [
              "パクさんに{何|なに}かプレゼントをもらいませんか。 (Paku-san ni nanika purezento o moraimasen ka.)",
              "パクさんに{何|なに}かプレゼントをあげませんか。 (Paku-san ni nanika purezento o agemasen ka.)",
              "パクさんが{何|なに}かプレゼントをあげませんか。 (Paku-san ga nanika purezento o agemasen ka.)",
              "パクさんに{何|なに}かプレゼントをくれませんか。 (Paku-san ni nanika purezento o kuremasen ka.)"
            ],
            "correct": 1,
            "why": "Tặng Park (người khác) → あげませんか."
          },
          {
            "q": "Bạn kể: sinh nhật, chị gái tặng bạn cái ô.",
            "options": [
              "{誕生日|たんじょうび}に{姉|あね}が{傘|かさ}をくれました。 (Tanjoubi ni ane ga kasa o kuremashita.)",
              "{誕生日|たんじょうび}で{姉|あね}に{傘|かさ}をくれました。 (Tanjoubi de ane ni kasa o kuremashita.)",
              "{誕生日|たんじょうび}にお{姉|ねえ}さんが{傘|かさ}をくれました。 (Tanjoubi ni oneesan ga kasa o kuremashita.)",
              "{誕生日|たんじょうび}に{姉|あね}が{傘|かさ}をあげました。 (Tanjoubi ni ane ga kasa o agemashita.)"
            ],
            "correct": 0,
            "why": "Dịp に · chị mình 姉 · → tôi くれました."
          },
          {
            "q": "Bạn nghe bạn nói: 「来月、結婚します」. Bạn đáp.",
            "options": [
              "いいえ、{大丈夫|だいじょうぶ}です。 (Iie, daijoubu desu.)",
              "そうですか。ざんねんですね。 (Sou desu ka. Zannen desu ne.)",
              "そうですか。よかったですね。 (Sou desu ka. Yokatta desu ne.)",
              "もうすぐですか。{何|なに}かですね。 (Mousugu desu ka. Nanika desu ne.)"
            ],
            "correct": 2,
            "why": "Tin vui → よかったですね."
          },
          {
            "q": "Giám khảo: 「たんじょうびに なにを もらいましたか」. Bạn nhận sách của bạn.",
            "options": [
              "{友達|ともだち}に{本|ほん}をくれました。 (Tomodachi ni hon o kuremashita.)",
              "{友達|ともだち}が{本|ほん}をもらいました。 (Tomodachi ga hon o moraimashita.)",
              "{本|ほん}をあげました。 (Hon o agemashita.)",
              "{友達|ともだち}に{本|ほん}をもらいました。 (Tomodachi ni hon o moraimashita.)"
            ],
            "correct": 3,
            "why": "Người cho に + もらいました."
          },
          {
            "q": "Giới thiệu: \"Đây là đàn anh của tôi. Anh ấy giỏi tiếng Anh và tốt bụng.\"",
            "options": [
              "こちらは{後輩|こうはい}です。{英語|えいご}が{上手|じょうず}で、{親切|しんせつ}です。 (Kochira wa kouhai desu. Eigo ga jouzu de, shinsetsu desu.)",
              "こちらは{先輩|せんぱい}です。{英語|えいご}を{上手|じょうず}で、{親切|しんせつ}です。 (Kochira wa senpai desu. Eigo o jouzu de, shinsetsu desu.)",
              "こちらは{先輩|せんぱい}です。{英語|えいご}が{上手|じょうず}で、{親切|しんせつ}です。 (Kochira wa senpai desu. Eigo ga jouzu de, shinsetsu desu.)",
              "こちらは{先輩|せんぱい}です。{英語|えいご}が{上手|じょうず}くて、{親切|しんせつ}です。 (Kochira wa senpai desu. Eigo ga jouzu kute, shinsetsu desu.)"
            ],
            "correct": 2,
            "why": "先輩 · 英語が 上手で、親切です."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**あげます** = (tôi / người khác) cho người khác · **くれます** = người khác cho TÔI (người nhà tôi) · **もらいます** = (ai đó) nhận. Một sự việc nói được 2 cách: 友達が くれました ＝ 友達に もらいました.",
          "Trợ từ: あげます → người nhận **に** · もらいます → người cho **に／から** (tổ chức chỉ から) · くれます → người cho **が**."
        ]
      }
    ]
  },
  {
    "id": "lt-b8-hoi-thoai",
    "kind": "conversation",
    "title": "Luyện thêm Bài 8 · Hội thoại — ảnh gia đình · anh chị em, thú cưng · người trong ảnh · quà cưới · quà sinh nhật (5 hội thoại mới, ~55 câu)",
    "goal": "Hiểu và tự nói được hội thoại Bài 8: giới thiệu gia đình (nghề, nơi ở), hỏi anh chị em/thú cưng, tả một người, bàn chọn quà, kể ai tặng gì cho mình.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Mỗi hội thoại làm 4 bước: **đọc + nghe** → **câu hỏi hiểu** → **điền chỗ trống** → **sắp xếp lượt thoại**; cuối bài là phần **tự nói** (che một vai).",
          "Khi nghe, bắt 3 thứ: **ai** (người nhà mình hay người khác: 父 ↔ お父さん), **ở đâu / làm gì** (に住んでいます, で働いています), **ai tặng ai** (あげます／くれます／もらいます).",
          "Lỗi hay mắc: gọi người nhà mình bằng お～さん, quên **が** trong 背が高い, dùng あげます khi người nhận là mình."
        ]
      },
      {
        "t": "recap",
        "title": "Khuôn chung của Bài 8",
        "items": [
          "**Hỏi gia đình**: ご家族は何人ですか · 兄弟がいますか · お父さんは何をしていますか → 父は～です。～で働いています。",
          "**Tả người**: ～さんはどんな人ですか → A くて／で、～人です · N が 上手です.",
          "**Quà**: 何かあげませんか → いいですね · 誰がくれましたか → ～がくれました · 誰にもらいましたか → ～にもらいました · tin vui → **よかったですね**."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · Hội thoại 1–2: ảnh gia đình · anh chị em và thú cưng"
      },
      {
        "t": "p",
        "text": "**Tình huống 1.** Marco xem ảnh gia đình trên điện thoại của Anna."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 1 — Marco hỏi về ảnh gia đình của Anna",
        "lines": [
          {
            "who": "マルコ",
            "role": "b",
            "text": "アンナさん、それは{家族|かぞく}の{写真|しゃしん}ですか。",
            "ro": "Anna-san, sore wa kazoku no shashin desu ka.",
            "vi": "Anna, đó là ảnh gia đình bạn à?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "はい。{父|ちち}と{母|はは}と{姉|あね}です。",
            "ro": "Hai. Chichi to haha to ane desu.",
            "vi": "Ừ. Bố, mẹ và chị gái mình."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "お{姉|ねえ}さんは{何|なに}をしていますか。",
            "ro": "Oneesan wa nani o shite imasu ka.",
            "vi": "Chị bạn làm nghề gì?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "{姉|あね}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。",
            "ro": "Ane wa isha desu. Byouin de hataraite imasu.",
            "vi": "Chị mình là bác sĩ. Chị làm việc ở bệnh viện."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "そうですか。ご{両親|りょうしん}はどこに{住|す}んでいますか。",
            "ro": "Sou desu ka. Goryoushin wa doko ni sunde imasu ka.",
            "vi": "Vậy à. Bố mẹ bạn sống ở đâu?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "{国|くに}に{住|す}んでいます。{姉|あね}も{両親|りょうしん}と{一緒|いっしょ}に{住|す}んでいます。",
            "ro": "Kuni ni sunde imasu. Ane mo ryoushin to issho ni sunde imasu.",
            "vi": "Bố mẹ mình sống ở nước mình. Chị mình cũng sống cùng bố mẹ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-ht1-hieu",
        "title": "Hội thoại 1 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Marco đang xem gì?",
            "options": [
              "Ảnh gia đình Anna",
              "Ảnh lớp học",
              "Ảnh đám cưới",
              "Ảnh con mèo"
            ],
            "correct": 0,
            "why": "それは 家族の 写真ですか."
          },
          {
            "q": "Trong ảnh có những ai?",
            "options": [
              "Bố mẹ của Marco",
              "Bố, mẹ và chị gái Anna",
              "Bố, mẹ và anh trai Anna",
              "Anna và bạn bè"
            ],
            "correct": 1,
            "why": "父と 母と 姉です."
          },
          {
            "q": "Chị Anna làm nghề gì?",
            "options": [
              "Giáo viên",
              "Sinh viên",
              "Nhân viên công ty",
              "Bác sĩ"
            ],
            "correct": 3,
            "why": "姉は 医者です."
          },
          {
            "q": "Chị Anna làm việc ở đâu?",
            "options": [
              "Ngân hàng",
              "Trường đại học",
              "Bệnh viện",
              "Công ty"
            ],
            "correct": 2,
            "why": "病院で 働いています."
          },
          {
            "q": "Bố mẹ Anna sống ở đâu?",
            "options": [
              "Ở Tokyo",
              "Ở nước của Anna",
              "Cùng Anna ở Nhật",
              "Ở Yokohama"
            ],
            "correct": 1,
            "why": "国に 住んでいます."
          },
          {
            "q": "Chị Anna sống với ai?",
            "options": [
              "Với Anna",
              "Với chồng",
              "Với bố mẹ",
              "Một mình"
            ],
            "correct": 2,
            "why": "姉も 両親と 一緒に 住んでいます."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-ht1-dien",
        "title": "Hội thoại 1 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "アンナ：{父|ちち}＿＿{母|はは}と{姉|あね}です。　〔Anna: chichi __ haha to ane desu.〕",
            "answers": [
              "と"
            ],
            "hint": "Nối danh từ"
          },
          {
            "q": "マルコ：お{姉|ねえ}さんは{何|なに}＿＿していますか。　〔Maruko: oneesan wa nani __ shite imasu ka.〕",
            "answers": [
              "を"
            ],
            "hint": "Hỏi nghề: 何を していますか"
          },
          {
            "q": "アンナ：{病院|びょういん}＿＿{働|はたら}いています。　〔Anna: byouin __ hataraite imasu.〕",
            "answers": [
              "で"
            ],
            "hint": "Nơi làm việc"
          },
          {
            "q": "アンナ：{国|くに}＿＿{住|す}んでいます。　〔Anna: kuni __ sunde imasu.〕",
            "answers": [
              "に"
            ],
            "hint": "Nơi ở"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-ht1-sx",
        "title": "Hội thoại 1 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi ảnh → giới thiệu người trong ảnh → hỏi nghề → trả lời nghề.",
            "chips": [
              "{姉|あね}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。",
              "お{姉|ねえ}さんは{何|なに}をしていますか。",
              "アンナさん、それは{家族|かぞく}の{写真|しゃしん}ですか。",
              "はい。{父|ちち}と{母|はは}と{姉|あね}です。"
            ],
            "answer": [
              "アンナさん、それは{家族|かぞく}の{写真|しゃしん}ですか。",
              "はい。{父|ちち}と{母|はは}と{姉|あね}です。",
              "お{姉|ねえ}さんは{何|なに}をしていますか。",
              "{姉|あね}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。"
            ],
            "ro": "Anna-san, sore wa kazoku no shashin desu ka. Hai. Chichi to haha to ane desu. Oneesan wa nani o shite imasu ka. Ane wa isha desu. Byouin de hataraite imasu."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 2.** Giờ nghỉ, Daniel và Mary nói chuyện về anh chị em và thú cưng."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 2 — Daniel và Mary: anh chị em, thú cưng",
        "lines": [
          {
            "who": "ダニエル",
            "role": "b",
            "text": "メアリーさんは{兄弟|きょうだい}がいますか。",
            "ro": "Mearii-san wa kyoudai ga imasu ka.",
            "vi": "Mary có anh chị em không?"
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "はい、{弟|おとうと}が{二人|ふたり}います。ダニエルさんは？",
            "ro": "Hai, otouto ga futari imasu. Danieru-san wa?",
            "vi": "Có, mình có hai em trai. Còn Daniel?"
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "{兄弟|きょうだい}はいませんが、{犬|いぬ}が{一匹|いっぴき}います。",
            "ro": "Kyoudai wa imasen ga, inu ga ippiki imasu.",
            "vi": "Mình không có anh chị em, nhưng có một con chó."
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "いいですね。どんな{犬|いぬ}ですか。",
            "ro": "Ii desu ne. Donna inu desu ka.",
            "vi": "Hay nhỉ. Con chó thế nào?"
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "{白|しろ}くて、{耳|みみ}が{長|なが}いです。とてもかわいいですよ。",
            "ro": "Shirokute, mimi ga nagai desu. Totemo kawaii desu yo.",
            "vi": "Lông trắng, tai dài. Dễ thương lắm đấy."
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "{私|わたし}は{猫|ねこ}が{二匹|にひき}います。{黒|くろ}い{猫|ねこ}と{茶色|ちゃいろ}い{猫|ねこ}です。",
            "ro": "Watashi wa neko ga nihiki imasu. Kuroi neko to chairoi neko desu.",
            "vi": "Mình có hai con mèo: một con đen và một con nâu."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-ht2-hieu",
        "title": "Hội thoại 2 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Mary có mấy em trai?",
            "options": [
              "Hai",
              "Không có",
              "Ba",
              "Một"
            ],
            "correct": 0,
            "why": "弟が 二人 います."
          },
          {
            "q": "Daniel có anh chị em không?",
            "options": [
              "Có một anh trai",
              "Có một chị gái",
              "Có hai em gái",
              "Không có"
            ],
            "correct": 3,
            "why": "兄弟は いません."
          },
          {
            "q": "Daniel nuôi con gì?",
            "options": [
              "Hai con mèo",
              "Không nuôi con nào",
              "Một con chó",
              "Một con thỏ"
            ],
            "correct": 2,
            "why": "犬が 一匹 います."
          },
          {
            "q": "Con chó của Daniel thế nào?",
            "options": [
              "Đen, tai ngắn",
              "Trắng, chân ngắn",
              "Nâu, chân dài",
              "Trắng, tai dài"
            ],
            "correct": 3,
            "why": "白くて、耳が 長いです."
          },
          {
            "q": "Mary nuôi mấy con mèo?",
            "options": [
              "Một con",
              "Hai con",
              "Ba con",
              "Không nuôi"
            ],
            "correct": 1,
            "why": "猫が 二匹 います."
          },
          {
            "q": "Mèo của Mary màu gì?",
            "options": [
              "Một con đen, một con nâu",
              "Một con trắng, một con đen",
              "Cả hai đều trắng",
              "Cả hai đều nâu"
            ],
            "correct": 0,
            "why": "黒い猫と 茶色い猫."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-ht2-dien",
        "title": "Hội thoại 2 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ダニエル：メアリーさんは{兄弟|きょうだい}＿＿いますか。　〔Danieru: Mearii-san wa kyoudai __ imasu ka.〕",
            "answers": [
              "が"
            ],
            "hint": "N が いますか"
          },
          {
            "q": "メアリー：{弟|おとうと}が＿＿います。　〔Mearii: otouto ga __ imasu.〕",
            "answers": [
              "二人",
              "ふたり"
            ],
            "hint": "Hai người (đọc đặc biệt)"
          },
          {
            "q": "ダニエル：{白|しろ}＿＿、{耳|みみ}が{長|なが}いです。　〔Danieru: shiro__, mimi ga nagai desu.〕",
            "answers": [
              "くて"
            ],
            "hint": "イA nối"
          },
          {
            "q": "メアリー：{猫|ねこ}が＿＿います。　〔Mearii: neko ga __ imasu.〕",
            "answers": [
              "二匹",
              "にひき"
            ],
            "hint": "Hai con (mèo)"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-ht2-sx",
        "title": "Hội thoại 2 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi anh chị em → trả lời + hỏi lại → không có anh chị em, có chó → hỏi con chó thế nào.",
            "chips": [
              "{兄弟|きょうだい}はいませんが、{犬|いぬ}が{一匹|いっぴき}います。",
              "いいですね。どんな{犬|いぬ}ですか。",
              "メアリーさんは{兄弟|きょうだい}がいますか。",
              "はい、{弟|おとうと}が{二人|ふたり}います。ダニエルさんは？"
            ],
            "answer": [
              "メアリーさんは{兄弟|きょうだい}がいますか。",
              "はい、{弟|おとうと}が{二人|ふたり}います。ダニエルさんは？",
              "{兄弟|きょうだい}はいませんが、{犬|いぬ}が{一匹|いっぴき}います。",
              "いいですね。どんな{犬|いぬ}ですか。"
            ],
            "ro": "Mearii-san wa kyoudai ga imasu ka. Hai, otouto ga futari imasu. Danieru-san wa? Kyoudai wa imasen ga, inu ga ippiki imasu. Ii desu ne. Donna inu desu ka."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · Hội thoại 3–4: người trong ảnh · chọn quà cưới"
      },
      {
        "t": "p",
        "text": "**Tình huống 3.** Natapon xem ảnh câu lạc bộ, hỏi Wang về một người."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 3 — Natapon hỏi Wang: người tóc dài là ai?",
        "lines": [
          {
            "who": "ナタポン",
            "role": "b",
            "text": "ワンさん、この{髪|かみ}が{長|なが}い{人|ひと}は{誰|だれ}ですか。",
            "ro": "Wan-san, kono kami ga nagai hito wa dare desu ka.",
            "vi": "Wang, người tóc dài này là ai vậy?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "{山口|やまぐち}さんです。{私|わたし}の{先輩|せんぱい}です。",
            "ro": "Yamaguchi-san desu. Watashi no senpai desu.",
            "vi": "Là chị Yamaguchi. Đàn chị của mình."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "どんな{人|ひと}ですか。",
            "ro": "Donna hito desu ka.",
            "vi": "Chị ấy là người thế nào?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "{優|やさ}しくて、{頭|あたま}がいい{人|ひと}です。{英語|えいご}がとても{上手|じょうず}です。",
            "ro": "Yasashikute, atama ga ii hito desu. Eigo ga totemo jouzu desu.",
            "vi": "Là người hiền và thông minh. Tiếng Anh rất giỏi."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "そうですか。{山口|やまぐち}さんは{結婚|けっこん}していますか。",
            "ro": "Sou desu ka. Yamaguchi-san wa kekkon shite imasu ka.",
            "vi": "Vậy à. Chị Yamaguchi đã lập gia đình chưa?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "はい、しています。ご{主人|しゅじん}は{高校|こうこう}の{先生|せんせい}です。",
            "ro": "Hai, shite imasu. Goshujin wa koukou no sensei desu.",
            "vi": "Rồi. Chồng chị ấy là giáo viên cấp 3."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "へえ。どこに{住|す}んでいますか。",
            "ro": "Hee. Doko ni sunde imasu ka.",
            "vi": "Ồ. Chị ấy sống ở đâu?"
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "{大学|だいがく}の{近|ちか}くです。ご{主人|しゅじん}と{二人|ふたり}で{住|す}んでいます。",
            "ro": "Daigaku no chikaku desu. Goshujin to futari de sunde imasu.",
            "vi": "Gần trường đại học. Chị sống hai người với chồng."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-ht3-hieu",
        "title": "Hội thoại 3 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Người tóc dài trong ảnh là ai?",
            "options": [
              "Yamaguchi — đàn em của Wang",
              "Chị gái của Wang",
              "Cô giáo của Natapon",
              "Yamaguchi — đàn chị của Wang"
            ],
            "correct": 3,
            "why": "山口さんです。私の 先輩です."
          },
          {
            "q": "Yamaguchi là người thế nào?",
            "options": [
              "Nghiêm khắc",
              "Vui tính và năng động",
              "Hiền và thông minh",
              "Chăm chỉ và tốt bụng"
            ],
            "correct": 2,
            "why": "優しくて、頭が いい人です."
          },
          {
            "q": "Yamaguchi giỏi gì?",
            "options": [
              "Nấu ăn",
              "Tiếng Anh",
              "Tiếng Nhật",
              "Bóng đá"
            ],
            "correct": 1,
            "why": "英語が とても 上手です."
          },
          {
            "q": "Yamaguchi đã kết hôn chưa?",
            "options": [
              "Không nói",
              "Chưa",
              "Tháng sau sẽ cưới",
              "Rồi"
            ],
            "correct": 3,
            "why": "はい、しています."
          },
          {
            "q": "Chồng Yamaguchi làm nghề gì?",
            "options": [
              "Sinh viên",
              "Giáo viên cấp 3",
              "Bác sĩ",
              "Nhân viên ngân hàng"
            ],
            "correct": 1,
            "why": "ご主人は 高校の 先生です."
          },
          {
            "q": "Yamaguchi sống với ai, ở đâu?",
            "options": [
              "Với Wang, gần trường",
              "Với chồng, gần trường đại học",
              "Một mình, gần ga",
              "Với bố mẹ, ở Tokyo"
            ],
            "correct": 1,
            "why": "大学の 近く · ご主人と 二人で."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-ht3-dien",
        "title": "Hội thoại 3 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ナタポン：この{髪|かみ}＿＿{長|なが}い{人|ひと}は{誰|だれ}ですか。　〔Natapon: kono kami __ nagai hito wa dare desu ka.〕",
            "answers": [
              "が"
            ],
            "hint": "Cụm tả: 髪が長い人"
          },
          {
            "q": "ワン：{優|やさ}し＿＿、{頭|あたま}がいい{人|ひと}です。　〔Wan: yasashi__, atama ga ii hito desu.〕",
            "answers": [
              "くて"
            ],
            "hint": "優しい → 優しくて"
          },
          {
            "q": "ワン：ご{主人|しゅじん}は{高校|こうこう}＿＿{先生|せんせい}です。　〔Wan: goshujin wa koukou __ sensei desu.〕",
            "answers": [
              "の"
            ],
            "hint": "N の N"
          },
          {
            "q": "ワン：ご{主人|しゅじん}と{二人|ふたり}＿＿{住|す}んでいます。　〔Wan: goshujin to futari __ sunde imasu.〕",
            "answers": [
              "で"
            ],
            "hint": "～人で"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-ht3-sx",
        "title": "Hội thoại 3 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi người trong ảnh → giới thiệu → hỏi người thế nào → tả người.",
            "chips": [
              "どんな{人|ひと}ですか。",
              "{優|やさ}しくて、{頭|あたま}がいい{人|ひと}です。{英語|えいご}がとても{上手|じょうず}です。",
              "ワンさん、この{髪|かみ}が{長|なが}い{人|ひと}は{誰|だれ}ですか。",
              "{山口|やまぐち}さんです。{私|わたし}の{先輩|せんぱい}です。"
            ],
            "answer": [
              "ワンさん、この{髪|かみ}が{長|なが}い{人|ひと}は{誰|だれ}ですか。",
              "{山口|やまぐち}さんです。{私|わたし}の{先輩|せんぱい}です。",
              "どんな{人|ひと}ですか。",
              "{優|やさ}しくて、{頭|あたま}がいい{人|ひと}です。{英語|えいご}がとても{上手|じょうず}です。"
            ],
            "ro": "Wan-san, kono kami ga nagai hito wa dare desu ka. Yamaguchi-san desu. Watashi no senpai desu. Donna hito desu ka. Yasashikute, atama ga ii hito desu. Eigo ga totemo jouzu desu."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 4.** Carlos và Park bàn mua quà cho lễ cưới của chị Kimura."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 4 — Carlos và Park chọn quà cưới",
        "lines": [
          {
            "who": "カルロス",
            "role": "b",
            "text": "パクさん、もうすぐ{木村|きむら}さんの{結婚式|けっこんしき}ですね。",
            "ro": "Paku-san, mousugu Kimura-san no kekkonshiki desu ne.",
            "vi": "Park, sắp đến lễ cưới của chị Kimura rồi nhỉ."
          },
          {
            "who": "パク",
            "role": "a",
            "text": "ええ、{来週|らいしゅう}の{土曜日|どようび}です。{何|なに}かプレゼントをあげませんか。",
            "ro": "Ee, raishuu no doyoubi desu. Nanika purezento o agemasen ka.",
            "vi": "Ừ, thứ Bảy tuần sau. Mình tặng quà gì đó không?"
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "いいですね。{何|なに}がいいですか。",
            "ro": "Ii desu ne. Nani ga ii desu ka.",
            "vi": "Hay đấy. Cái gì thì được nhỉ?"
          },
          {
            "who": "パク",
            "role": "a",
            "text": "{木村|きむら}さんは{料理|りょうり}が{好|す}きですから、{素敵|すてき}なお{皿|さら}はどうですか。",
            "ro": "Kimura-san wa ryouri ga suki desu kara, suteki na osara wa dou desu ka.",
            "vi": "Chị Kimura thích nấu ăn, nên mấy cái đĩa đẹp thì sao?"
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "いいですね。それから、カードも{書|か}きましょう。",
            "ro": "Ii desu ne. Sorekara, kaado mo kakimashou.",
            "vi": "Hay đấy. Rồi mình viết cả thiệp nữa nhé."
          },
          {
            "who": "パク",
            "role": "a",
            "text": "そうしましょう。{私|わたし}は{花|はな}もあげたいです。",
            "ro": "Sou shimashou. Watashi wa hana mo agetai desu.",
            "vi": "Làm vậy đi. Mình muốn tặng cả hoa nữa."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-ht4-hieu",
        "title": "Hội thoại 4 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Đây là lễ cưới của ai?",
            "options": [
              "Chị gái Park",
              "Chị Kimura",
              "Park",
              "Carlos"
            ],
            "correct": 1,
            "why": "木村さんの 結婚式."
          },
          {
            "q": "Lễ cưới vào lúc nào?",
            "options": [
              "Tháng sau",
              "Chủ nhật tuần sau",
              "Thứ Bảy tuần sau",
              "Thứ Bảy tuần này"
            ],
            "correct": 2,
            "why": "来週の 土曜日です."
          },
          {
            "q": "Ai rủ tặng quà?",
            "options": [
              "Park",
              "Chị Kimura",
              "Cả hai cùng lúc",
              "Carlos"
            ],
            "correct": 0,
            "why": "何か プレゼントを あげませんか (Park)."
          },
          {
            "q": "Vì sao Park gợi ý tặng đĩa?",
            "options": [
              "Vì chị Kimura không có đĩa",
              "Vì đĩa rẻ",
              "Vì chị Kimura thích nấu ăn",
              "Vì Carlos thích đĩa"
            ],
            "correct": 2,
            "why": "料理が 好きですから."
          },
          {
            "q": "Carlos đề nghị làm thêm gì?",
            "options": [
              "Viết thiệp",
              "Mua sô-cô-la",
              "Mua hoa",
              "Gọi điện cho chị Kimura"
            ],
            "correct": 0,
            "why": "カードも 書きましょう."
          },
          {
            "q": "Park còn muốn tặng gì?",
            "options": [
              "Ô",
              "Hoa",
              "Dây chuyền",
              "Sách"
            ],
            "correct": 1,
            "why": "花も あげたいです."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-ht4-dien",
        "title": "Hội thoại 4 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "パク：{何|なに}かプレゼントをあげ＿＿か。　〔Paku: nanika purezento o age__ ka.〕",
            "answers": [
              "ません"
            ],
            "hint": "Rủ: V ませんか"
          },
          {
            "q": "パク：{料理|りょうり}が{好|す}きです＿＿、お{皿|さら}はどうですか。　〔Paku: ryouri ga suki desu __, osara wa dou desu ka.〕",
            "answers": [
              "から"
            ],
            "hint": "Lý do: ～から"
          },
          {
            "q": "カルロス：カード＿＿{書|か}きましょう。　〔Karurosu: kaado __ kakimashou.〕",
            "answers": [
              "も"
            ],
            "hint": "Cũng: も"
          },
          {
            "q": "パク：{花|はな}もあげ＿＿です。　〔Paku: hana mo age__ desu.〕",
            "answers": [
              "たい"
            ],
            "hint": "Muốn: V たいです"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-ht4-sx",
        "title": "Hội thoại 4 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: nhắc lễ cưới → rủ tặng quà → hỏi tặng gì → gợi ý đĩa.",
            "chips": [
              "ええ、{来週|らいしゅう}の{土曜日|どようび}です。{何|なに}かプレゼントをあげませんか。",
              "{木村|きむら}さんは{料理|りょうり}が{好|す}きですから、{素敵|すてき}なお{皿|さら}はどうですか。",
              "いいですね。{何|なに}がいいですか。",
              "パクさん、もうすぐ{木村|きむら}さんの{結婚式|けっこんしき}ですね。"
            ],
            "answer": [
              "パクさん、もうすぐ{木村|きむら}さんの{結婚式|けっこんしき}ですね。",
              "ええ、{来週|らいしゅう}の{土曜日|どようび}です。{何|なに}かプレゼントをあげませんか。",
              "いいですね。{何|なに}がいいですか。",
              "{木村|きむら}さんは{料理|りょうり}が{好|す}きですから、{素敵|すてき}なお{皿|さら}はどうですか。"
            ],
            "ro": "Paku-san, mousugu Kimura-san no kekkonshiki desu ne. Ee, raishuu no doyoubi desu. Nanika purezento o agemasen ka. Ii desu ne. Nani ga ii desu ka. Kimura-san wa ryouri ga suki desu kara, suteki na osara wa dou desu ka."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · Hội thoại 5 dài hơn + tự nói"
      },
      {
        "t": "p",
        "text": "**Tình huống 5.** Sau sinh nhật Anna, Marco hỏi Anna đã nhận được quà gì; rồi Marco kể về em gái mình."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 5 — Quà sinh nhật của Anna — ai tặng gì?",
        "lines": [
          {
            "who": "マルコ",
            "role": "b",
            "text": "アンナさん、{先週|せんしゅう}は{誕生日|たんじょうび}でしたね。{何|なに}かもらいましたか。",
            "ro": "Anna-san, senshuu wa tanjoubi deshita ne. Nanika moraimashita ka.",
            "vi": "Anna, tuần trước là sinh nhật bạn nhỉ. Bạn có nhận được gì không?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "はい。{両親|りょうしん}が{国|くに}からカードとお{金|かね}を{送|おく}りました。",
            "ro": "Hai. Ryoushin ga kuni kara kaado to okane o okurimashita.",
            "vi": "Có. Bố mẹ mình gửi thiệp và tiền từ nước mình sang."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "よかったですね。{友達|ともだち}からも{何|なに}かもらいましたか。",
            "ro": "Yokatta desu ne. Tomodachi kara mo nanika moraimashita ka.",
            "vi": "Tốt quá nhỉ. Bạn bè cũng tặng gì không?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "ええ。メアリーさんがこのネックレスをくれました。",
            "ro": "Ee. Mearii-san ga kono nekkuresu o kuremashita.",
            "vi": "Có. Mary đã tặng mình sợi dây chuyền này."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{素敵|すてき}なネックレスですね。",
            "ro": "Suteki na nekkuresu desu ne.",
            "vi": "Sợi dây chuyền đẹp nhỉ."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "ありがとう。{山口|やまぐち}さんにも{傘|かさ}をもらいました。{白|しろ}くて、かわいい{傘|かさ}です。",
            "ro": "Arigatou. Yamaguchi-san ni mo kasa o moraimashita. Shirokute, kawaii kasa desu.",
            "vi": "Cảm ơn. Mình cũng nhận cái ô của Yamaguchi. Là cái ô trắng, dễ thương."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "いいですね。{私|わたし}の{妹|いもうと}ももうすぐ{誕生日|たんじょうび}です。",
            "ro": "Ii desu ne. Watashi no imouto mo mousugu tanjoubi desu.",
            "vi": "Hay nhỉ. Em gái mình cũng sắp sinh nhật."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "そうですか。{何|なに}をあげますか。",
            "ro": "Sou desu ka. Nani o agemasu ka.",
            "vi": "Vậy à. Bạn tặng gì?"
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{妹|いもうと}は{音楽|おんがく}が{好|す}きですから、CDをあげたいです。",
            "ro": "Imouto wa ongaku ga suki desu kara, CD o agetai desu.",
            "vi": "Em mình thích âm nhạc nên mình muốn tặng đĩa CD."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-ht5-hieu",
        "title": "Hội thoại 5 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Bố mẹ Anna gửi gì?",
            "options": [
              "Thiệp và tiền",
              "Dây chuyền",
              "Cái ô",
              "Đĩa CD"
            ],
            "correct": 0,
            "why": "カードと お金を 送りました."
          },
          {
            "q": "Ai tặng Anna sợi dây chuyền?",
            "options": [
              "Marco",
              "Mary",
              "Yamaguchi",
              "Bố mẹ Anna"
            ],
            "correct": 1,
            "why": "メアリーさんが この ネックレスを くれました."
          },
          {
            "q": "Anna nhận gì của Yamaguchi?",
            "options": [
              "Sô-cô-la",
              "Cái ô trắng",
              "Thiệp",
              "Dây chuyền"
            ],
            "correct": 1,
            "why": "山口さんにも 傘を もらいました。白くて…"
          },
          {
            "q": "Ai sắp sinh nhật?",
            "options": [
              "Yamaguchi",
              "Mary",
              "Em gái Marco",
              "Marco"
            ],
            "correct": 2,
            "why": "私の 妹も もうすぐ 誕生日です."
          },
          {
            "q": "Marco muốn tặng gì?",
            "options": [
              "Đĩa CD",
              "Hoa",
              "Thiệp",
              "Cái ô"
            ],
            "correct": 0,
            "why": "CDを あげたいです."
          },
          {
            "q": "Vì sao Marco chọn món quà đó?",
            "options": [
              "Vì CD rẻ",
              "Vì Anna gợi ý",
              "Vì em gái thích âm nhạc",
              "Vì em gái thích hát karaoke"
            ],
            "correct": 2,
            "why": "音楽が 好きですから."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b8-ht5-dien",
        "title": "Hội thoại 5 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "アンナ：メアリーさん＿＿このネックレスをくれました。　〔Anna: Mearii-san __ kono nekkuresu o kuremashita.〕",
            "answers": [
              "が"
            ],
            "hint": "くれます: người cho が"
          },
          {
            "q": "アンナ：{山口|やまぐち}さんにも{傘|かさ}を＿＿。　〔Anna: Yamaguchi-san ni mo kasa o __.〕",
            "answers": [
              "もらいました"
            ],
            "hint": "Tôi nhận → もらいました"
          },
          {
            "q": "マルコ：{妹|いもうと}は{音楽|おんがく}が{好|す}きです＿＿、CDをあげたいです。　〔Maruko: imouto wa ongaku ga suki desu __, CD o agetai desu.〕",
            "answers": [
              "から"
            ],
            "hint": "Lý do"
          },
          {
            "q": "アンナ：{両親|りょうしん}が{国|くに}からカードとお{金|かね}を＿＿。　〔Anna: ryoushin ga kuni kara kaado to okane o __.〕",
            "answers": [
              "送りました",
              "おくりました"
            ],
            "hint": "Gửi (quá khứ)"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-ht5-sx",
        "title": "Hội thoại 5 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi quà → bố mẹ gửi → hỏi quà của bạn → Mary tặng dây chuyền.",
            "chips": [
              "アンナさん、{先週|せんしゅう}は{誕生日|たんじょうび}でしたね。{何|なに}かもらいましたか。",
              "はい。{両親|りょうしん}が{国|くに}からカードとお{金|かね}を{送|おく}りました。",
              "ええ。メアリーさんがこのネックレスをくれました。",
              "よかったですね。{友達|ともだち}からも{何|なに}かもらいましたか。"
            ],
            "answer": [
              "アンナさん、{先週|せんしゅう}は{誕生日|たんじょうび}でしたね。{何|なに}かもらいましたか。",
              "はい。{両親|りょうしん}が{国|くに}からカードとお{金|かね}を{送|おく}りました。",
              "よかったですね。{友達|ともだち}からも{何|なに}かもらいましたか。",
              "ええ。メアリーさんがこのネックレスをくれました。"
            ],
            "ro": "Anna-san, senshuu wa tanjoubi deshita ne. Nanika moraimashita ka. Hai. Ryoushin ga kuni kara kaado to okane o okurimashita. Yokatta desu ne. Tomodachi kara mo nanika moraimashita ka. Ee. Mearii-san ga kono nekkuresu o kuremashita."
          }
        ]
      },
      {
        "t": "h",
        "text": "Tự nói có mẫu — che một vai và nói vai đó"
      },
      {
        "t": "note",
        "title": "Cách tự nói",
        "items": [
          "Nghe cả bài một lần. Che lời của **B**, tự nói vai B, nghe mẫu để so. Đổi vai.",
          "Thay từ: 学校の近く → 駅の近く／大学の近く; 二人で → 三人で／一人で; 姉が くれました → 友達が くれました／祖母が くれました; 優しくて → 元気で／まじめで."
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 1 — Sống ở đâu, sống với ai",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "どこに{住|す}んでいますか。",
            "ro": "Doko ni sunde imasu ka.",
            "vi": "Bạn sống ở đâu?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{学校|がっこう}の{近|ちか}くに{住|す}んでいます。",
            "ro": "Gakkou no chikaku ni sunde imasu.",
            "vi": "Mình sống gần trường."
          },
          {
            "who": "A",
            "role": "a",
            "text": "{誰|だれ}と{住|す}んでいますか。",
            "ro": "Dare to sunde imasu ka.",
            "vi": "Bạn sống với ai?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "ルームメイトと{二人|ふたり}で{住|す}んでいます。",
            "ro": "Ruumumeito to futari de sunde imasu.",
            "vi": "Mình sống hai người với bạn cùng phòng."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 2 — Gia đình và nghề",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "ご{家族|かぞく}は{何人|なんにん}ですか。",
            "ro": "Gokazoku wa nannin desu ka.",
            "vi": "Nhà bạn mấy người?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{四人|よにん}です。{父|ちち}と{母|はは}と{妹|いもうと}と{私|わたし}です。",
            "ro": "Yonin desu. Chichi to haha to imouto to watashi desu.",
            "vi": "Bốn người: bố, mẹ, em gái và mình."
          },
          {
            "who": "A",
            "role": "a",
            "text": "お{父|とう}さんは{何|なに}をしていますか。",
            "ro": "Otousan wa nani o shite imasu ka.",
            "vi": "Bố bạn làm nghề gì?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{父|ちち}は{会社員|かいしゃいん}です。{銀行|ぎんこう}で{働|はたら}いています。",
            "ro": "Chichi wa kaishain desu. Ginkou de hataraite imasu.",
            "vi": "Bố mình là nhân viên công ty. Bố làm ở ngân hàng."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 3 — Người thế nào",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "お{母|かあ}さんはどんな{人|ひと}ですか。",
            "ro": "Okaasan wa donna hito desu ka.",
            "vi": "Mẹ bạn là người thế nào?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{優|やさ}しくて、おもしろい{人|ひと}です。{料理|りょうり}が{上手|じょうず}です。",
            "ro": "Yasashikute, omoshiroi hito desu. Ryouri ga jouzu desu.",
            "vi": "Mẹ mình hiền và vui tính. Mẹ nấu ăn giỏi."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 4 — Khen đồ, hỏi ai tặng",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "{素敵|すてき}なかばんですね。",
            "ro": "Suteki na kaban desu ne.",
            "vi": "Cái túi đẹp nhỉ."
          },
          {
            "who": "B",
            "role": "b",
            "text": "ありがとうございます。{姉|あね}がくれました。",
            "ro": "Arigatou gozaimasu. Ane ga kuremashita.",
            "vi": "Cảm ơn. Chị gái mình tặng."
          },
          {
            "who": "A",
            "role": "a",
            "text": "そうですか。{誕生日|たんじょうび}にもらいましたか。",
            "ro": "Sou desu ka. Tanjoubi ni moraimashita ka.",
            "vi": "Vậy à. Bạn nhận vào sinh nhật à?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "はい、{誕生日|たんじょうび}にもらいました。",
            "ro": "Hai, tanjoubi ni moraimashita.",
            "vi": "Vâng, mình nhận vào sinh nhật."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b8-ht-noi",
        "part": "1",
        "questions": [
          "どこに すんでいますか。",
          "だれと すんでいますか。",
          "ごかぞくは なんにんですか。",
          "きょうだいが いますか。",
          "おとうさんは なにを していますか。",
          "おかあさんは どんな ひとですか。",
          "ペットが いますか。",
          "たんじょうびに なにを もらいましたか。",
          "ともだちの たんじょうびに なにを あげますか。"
        ]
      }
    ]
  },
  {
    "id": "lt-b8-doc-hieu",
    "kind": "reading",
    "title": "Luyện thêm Bài 8 · Đọc hiểu — 4 đoạn dài dần + 4 đoạn KHÔNG furigana (~44 câu)",
    "goal": "Đọc hiểu đoạn văn về gia đình, người quan trọng, thư gửi gia đình và ảnh lớp: tìm đúng số người, nghề, nơi ở, ngoại hình, ai tặng ai; đọc được đoạn không furigana như đề thi.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đọc **2 lượt**: lượt 1 để biết bài nói về ai (gia đình mình hay người khác); lượt 2 tìm chi tiết: **số người, nghề, nơi ở, ngoại hình, ai tặng ai**.",
          "Mẹo: gạch dưới **に住んでいます** (nơi ở), **で働いています** (nơi làm), **が ～人 います** (số người), **あげました／くれました／もらいました** (chiều tặng).",
          "Mức Khó dùng **readkanji** không furigana: chỉ chữ Hán đã học đến Bài 8, còn lại là hiragana. Đọc to, rồi bấm xem."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đoạn 1 — gia đình tôi"
      },
      {
        "t": "passage",
        "title": "Đoạn 1 — Gia đình tôi",
        "intro": "Có furigana. Đếm số người khi đọc.",
        "paras": [
          {
            "label": "A",
            "text": "{私|わたし}の{家族|かぞく}は{五人|ごにん}です。{父|ちち}と{母|はは}と{兄|あに}と{妹|いもうと}と{私|わたし}です。{父|ちち}は{会社員|かいしゃいん}です。{銀行|ぎんこう}で{働|はたら}いています。{母|はは}は{高校|こうこう}の{先生|せんせい}です。{兄|あに}は{結婚|けっこん}しています。{大阪|おおさか}に{住|す}んでいます。{妹|いもうと}は{高校生|こうこうせい}です。{猫|ねこ}がとても{好|す}きです。うちに{猫|ねこ}が{二匹|にひき}います。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}の{家族|かぞく}は{五人|ごにん}です。",
            "ro": "Watashi no kazoku wa gonin desu.",
            "vi": "Gia đình tôi có năm người."
          },
          {
            "en": "{父|ちち}と{母|はは}と{兄|あに}と{妹|いもうと}と{私|わたし}です。",
            "ro": "Chichi to haha to ani to imouto to watashi desu.",
            "vi": "Bố, mẹ, anh trai, em gái và tôi."
          },
          {
            "en": "{父|ちち}は{会社員|かいしゃいん}です。",
            "ro": "Chichi wa kaishain desu.",
            "vi": "Bố tôi là nhân viên công ty."
          },
          {
            "en": "{銀行|ぎんこう}で{働|はたら}いています。",
            "ro": "Ginkou de hataraite imasu.",
            "vi": "Bố làm việc ở ngân hàng."
          },
          {
            "en": "{母|はは}は{高校|こうこう}の{先生|せんせい}です。",
            "ro": "Haha wa koukou no sensei desu.",
            "vi": "Mẹ tôi là giáo viên cấp 3."
          },
          {
            "en": "{兄|あに}は{結婚|けっこん}しています。",
            "ro": "Ani wa kekkon shite imasu.",
            "vi": "Anh tôi đã lập gia đình."
          },
          {
            "en": "{大阪|おおさか}に{住|す}んでいます。",
            "ro": "Oosaka ni sunde imasu.",
            "vi": "Anh sống ở Osaka."
          },
          {
            "en": "{妹|いもうと}は{高校生|こうこうせい}です。",
            "ro": "Imouto wa koukousei desu.",
            "vi": "Em gái tôi là học sinh cấp 3."
          },
          {
            "en": "{猫|ねこ}がとても{好|す}きです。",
            "ro": "Neko ga totemo suki desu.",
            "vi": "Em rất thích mèo."
          },
          {
            "en": "うちに{猫|ねこ}が{二匹|にひき}います。",
            "ro": "Uchi ni neko ga nihiki imasu.",
            "vi": "Nhà tôi có hai con mèo."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-doc1-q",
        "title": "Đoạn 1 — câu hỏi (6 câu)",
        "items": [
          {
            "q": "Gia đình tác giả có mấy người?",
            "options": [
              "Sáu",
              "Năm",
              "Bốn",
              "Ba"
            ],
            "correct": 1,
            "why": "家族は 五人です."
          },
          {
            "q": "Bố làm việc ở đâu?",
            "options": [
              "Bệnh viện",
              "Trường cấp 3",
              "Ngân hàng",
              "Osaka"
            ],
            "correct": 2,
            "why": "銀行で 働いています."
          },
          {
            "q": "Mẹ làm nghề gì?",
            "options": [
              "Bác sĩ",
              "Nhân viên ngân hàng",
              "Giáo viên cấp 3",
              "Học sinh cấp 3"
            ],
            "correct": 2,
            "why": "高校の 先生です."
          },
          {
            "q": "Anh trai sống ở đâu?",
            "options": [
              "Không nói",
              "Osaka",
              "Cùng gia đình",
              "Tokyo"
            ],
            "correct": 1,
            "why": "大阪に 住んでいます."
          },
          {
            "q": "Ai là học sinh cấp 3?",
            "options": [
              "Mẹ",
              "Em gái",
              "Anh trai",
              "Tác giả"
            ],
            "correct": 1,
            "why": "妹は 高校生です."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "Anh trai chưa kết hôn",
              "Mẹ làm ở ngân hàng",
              "Em gái không thích mèo",
              "Nhà có hai con mèo"
            ],
            "correct": 3,
            "why": "うちに 猫が 二匹 います."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đoạn 2–3 — người quan trọng · email gửi mẹ"
      },
      {
        "t": "passage",
        "title": "Đoạn 2 — Người quan trọng của tôi",
        "intro": "Tìm: bà là người thế nào — tác giả làm gì cho bà — bà làm gì cho tác giả.",
        "paras": [
          {
            "label": "A",
            "text": "{私|わたし}の{大切|たいせつ}な{人|ひと}は{祖母|そぼ}です。{祖母|そぼ}は{七十五歳|ななじゅうごさい}で、{国|くに}に{住|す}んでいます。{髪|かみ}が{白|しろ}くて、{背|せ}があまり{高|たか}くないです。とても{優|やさ}しくて、{元気|げんき}な{人|ひと}です。{料理|りょうり}が{上手|じょうず}です。"
          },
          {
            "label": "B",
            "text": "{毎週|まいしゅう}{日曜日|にちようび}、{私|わたし}は{祖母|そぼ}に{電話|でんわ}します。{去年|きょねん}の{誕生日|たんじょうび}に、{祖母|そぼ}は{私|わたし}に{手紙|てがみ}と{靴下|くつした}を{送|おく}りました。クリスマスに、{私|わたし}は{祖母|そぼ}に{素敵|すてき}な{傘|かさ}をあげたいです。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}の{大切|たいせつ}な{人|ひと}は{祖母|そぼ}です。",
            "ro": "Watashi no taisetsu na hito wa sobo desu.",
            "vi": "Người quan trọng của tôi là bà."
          },
          {
            "en": "{祖母|そぼ}は{七十五歳|ななじゅうごさい}で、{国|くに}に{住|す}んでいます。",
            "ro": "Sobo wa nanajuugosai de, kuni ni sunde imasu.",
            "vi": "Bà 75 tuổi, sống ở quê nhà (nước tôi)."
          },
          {
            "en": "{髪|かみ}が{白|しろ}くて、{背|せ}があまり{高|たか}くないです。",
            "ro": "Kami ga shirokute, se ga amari takakunai desu.",
            "vi": "Tóc bà bạc trắng, bà không cao lắm."
          },
          {
            "en": "とても{優|やさ}しくて、{元気|げんき}な{人|ひと}です。",
            "ro": "Totemo yasashikute, genki na hito desu.",
            "vi": "Bà rất hiền và khoẻ mạnh."
          },
          {
            "en": "{料理|りょうり}が{上手|じょうず}です。",
            "ro": "Ryouri ga jouzu desu.",
            "vi": "Bà nấu ăn giỏi."
          },
          {
            "en": "{毎週|まいしゅう}{日曜日|にちようび}、{私|わたし}は{祖母|そぼ}に{電話|でんわ}します。",
            "ro": "Maishuu nichiyoubi, watashi wa sobo ni denwa shimasu.",
            "vi": "Chủ nhật hàng tuần tôi gọi điện cho bà."
          },
          {
            "en": "{去年|きょねん}の{誕生日|たんじょうび}に、{祖母|そぼ}は{私|わたし}に{手紙|てがみ}と{靴下|くつした}を{送|おく}りました。",
            "ro": "Kyonen no tanjoubi ni, sobo wa watashi ni tegami to kutsushita o okurimashita.",
            "vi": "Sinh nhật năm ngoái, bà gửi cho tôi thư và đôi tất."
          },
          {
            "en": "クリスマスに、{私|わたし}は{祖母|そぼ}に{素敵|すてき}な{傘|かさ}をあげたいです。",
            "ro": "Kurisumasu ni, watashi wa sobo ni suteki na kasa o agetai desu.",
            "vi": "Giáng sinh này, tôi muốn tặng bà một chiếc ô đẹp."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-doc2-q",
        "title": "Đoạn 2 — câu hỏi (8 câu)",
        "items": [
          {
            "q": "Người quan trọng của tác giả là ai?",
            "options": [
              "Bạn thân",
              "Mẹ",
              "Chị gái",
              "Bà"
            ],
            "correct": 3,
            "why": "大切な人は 祖母です."
          },
          {
            "q": "Bà bao nhiêu tuổi?",
            "options": [
              "57",
              "75",
              "70",
              "65"
            ],
            "correct": 1,
            "why": "七十五歳 = 75 tuổi."
          },
          {
            "q": "Bà sống ở đâu?",
            "options": [
              "Ở Tokyo",
              "Cùng tác giả ở Nhật",
              "Ở Osaka",
              "Ở nước của tác giả"
            ],
            "correct": 3,
            "why": "国に 住んでいます."
          },
          {
            "q": "Ngoại hình của bà?",
            "options": [
              "Tóc đen, cao",
              "Tóc dài, cao",
              "Tóc trắng, không cao lắm",
              "Tóc ngắn, mắt to"
            ],
            "correct": 2,
            "why": "髪が 白くて、背が あまり 高くないです."
          },
          {
            "q": "Bà là người thế nào?",
            "options": [
              "Hiền và khoẻ mạnh",
              "Hiền nhưng yếu",
              "Vui tính và thông minh",
              "Nghiêm và chăm chỉ"
            ],
            "correct": 0,
            "why": "優しくて、元気な人."
          },
          {
            "q": "Tác giả gọi điện cho bà khi nào?",
            "options": [
              "Thứ Bảy hàng tuần",
              "Sinh nhật bà",
              "Mỗi ngày",
              "Chủ nhật hàng tuần"
            ],
            "correct": 3,
            "why": "毎週 日曜日."
          },
          {
            "q": "Sinh nhật năm ngoái, bà làm gì?",
            "options": [
              "Tặng tác giả cái ô",
              "Gửi thư và đôi tất cho tác giả",
              "Đến Nhật thăm tác giả",
              "Gọi điện cho tác giả"
            ],
            "correct": 1,
            "why": "手紙と 靴下を 送りました."
          },
          {
            "q": "Tác giả muốn tặng bà gì vào Giáng sinh?",
            "options": [
              "Dây chuyền",
              "Thư",
              "Một chiếc ô đẹp",
              "Đôi tất"
            ],
            "correct": 2,
            "why": "素敵な 傘を あげたいです."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đoạn 3 — Email của Mary gửi mẹ",
        "intro": "Thư cho mẹ mình: Mary gọi mẹ là お母さん (cách gọi trong nhà). Tìm: Mary sống với ai, người đó thế nào, Mary nhờ mẹ việc gì.",
        "paras": [
          {
            "label": "A",
            "text": "お{母|かあ}さんへ。お{元気|げんき}ですか。{私|わたし}は{元気|げんき}です。{先月|せんげつ}から、ルームメイトと{二人|ふたり}で{住|す}んでいます。ルームメイトの{名前|なまえ}はワンさんです。ワンさんは{中国人|ちゅうごくじん}で、{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。"
          },
          {
            "label": "B",
            "text": "{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}いです。まじめで、{親切|しんせつ}な{人|ひと}です。{来月|らいげつ}、ワンさんの{誕生日|たんじょうび}です。ワンさんに{国|くに}のチョコレートをあげたいです。すみませんが、チョコレートを{送|おく}ってください。メアリー"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "お{母|かあ}さんへ。",
            "ro": "Okaasan e.",
            "vi": "Gửi mẹ,"
          },
          {
            "en": "お{元気|げんき}ですか。{私|わたし}は{元気|げんき}です。",
            "ro": "Ogenki desu ka. Watashi wa genki desu.",
            "vi": "Mẹ có khoẻ không? Con khoẻ."
          },
          {
            "en": "{先月|せんげつ}から、ルームメイトと{二人|ふたり}で{住|す}んでいます。",
            "ro": "Sengetsu kara, ruumumeito to futari de sunde imasu.",
            "vi": "Từ tháng trước, con sống cùng bạn cùng phòng, hai người."
          },
          {
            "en": "ルームメイトの{名前|なまえ}はワンさんです。",
            "ro": "Ruumumeito no namae wa Wan-san desu.",
            "vi": "Bạn cùng phòng tên là Wang."
          },
          {
            "en": "ワンさんは{中国人|ちゅうごくじん}で、{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。",
            "ro": "Wan-san wa Chuugokujin de, daigaku de keizai o benkyou shite imasu.",
            "vi": "Wang là người Trung Quốc, học kinh tế ở đại học."
          },
          {
            "en": "{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}いです。",
            "ro": "Se ga takakute, kami ga mijikai desu.",
            "vi": "Bạn ấy cao, tóc ngắn."
          },
          {
            "en": "まじめで、{親切|しんせつ}な{人|ひと}です。",
            "ro": "Majime de, shinsetsu na hito desu.",
            "vi": "Là người chăm chỉ và tốt bụng."
          },
          {
            "en": "{来月|らいげつ}、ワンさんの{誕生日|たんじょうび}です。",
            "ro": "Raigetsu, Wan-san no tanjoubi desu.",
            "vi": "Tháng sau là sinh nhật Wang."
          },
          {
            "en": "ワンさんに{国|くに}のチョコレートをあげたいです。",
            "ro": "Wan-san ni kuni no chokoreeto o agetai desu.",
            "vi": "Con muốn tặng Wang sô-cô-la của nước mình."
          },
          {
            "en": "すみませんが、チョコレートを{送|おく}ってください。",
            "ro": "Sumimasen ga, chokoreeto o okutte kudasai.",
            "vi": "Mẹ ơi, gửi giúp con sô-cô-la nhé."
          },
          {
            "en": "メアリー",
            "ro": "Mearii",
            "vi": "Mary"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-doc3-q",
        "title": "Đoạn 3 — câu hỏi (9 câu)",
        "items": [
          {
            "q": "Ai viết email, gửi cho ai?",
            "options": [
              "Mary gửi Wang",
              "Mẹ gửi Mary",
              "Mary gửi mẹ",
              "Wang gửi Mary"
            ],
            "correct": 2,
            "why": "お母さんへ … メアリー."
          },
          {
            "q": "Từ khi nào Mary sống cùng bạn cùng phòng?",
            "options": [
              "Từ tháng trước",
              "Từ tháng sau",
              "Từ tuần trước",
              "Từ năm ngoái"
            ],
            "correct": 0,
            "why": "先月から."
          },
          {
            "q": "Mary sống cùng mấy người (tính cả Mary)?",
            "options": [
              "Ba người",
              "Bốn người",
              "Hai người",
              "Một mình"
            ],
            "correct": 2,
            "why": "ルームメイトと 二人で."
          },
          {
            "q": "Wang là người nước nào?",
            "options": [
              "Việt Nam",
              "Hàn Quốc",
              "Nhật Bản",
              "Trung Quốc"
            ],
            "correct": 3,
            "why": "中国人."
          },
          {
            "q": "Wang học gì?",
            "options": [
              "Y khoa",
              "Kinh tế",
              "Tiếng Nhật",
              "Tiếng Anh"
            ],
            "correct": 1,
            "why": "経済を 勉強しています."
          },
          {
            "q": "Ngoại hình của Wang?",
            "options": [
              "Cao, tóc ngắn",
              "Thấp, tóc dài",
              "Mắt to, tóc nâu",
              "Cao, tóc dài"
            ],
            "correct": 0,
            "why": "背が 高くて、髪が 短い."
          },
          {
            "q": "Wang là người thế nào?",
            "options": [
              "Hiền, thông minh",
              "Vui tính, năng động",
              "Đẹp trai, ngầu",
              "Chăm chỉ, tốt bụng"
            ],
            "correct": 3,
            "why": "まじめで、親切な人."
          },
          {
            "q": "Khi nào là sinh nhật Wang?",
            "options": [
              "Tháng sau",
              "Tuần sau",
              "Tháng này",
              "Tháng trước"
            ],
            "correct": 0,
            "why": "来月."
          },
          {
            "q": "Mary nhờ mẹ làm gì?",
            "options": [
              "Gửi sô-cô-la",
              "Gọi điện cho Wang",
              "Đến Nhật chơi",
              "Mua quà cho Wang"
            ],
            "correct": 0,
            "why": "チョコレートを 送ってください."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đoạn 4 dài + đoạn không furigana"
      },
      {
        "t": "passage",
        "title": "Đoạn 4 — Ảnh lớp tiếng Nhật",
        "intro": "Nhiều người: vẽ sơ đồ vị trí (giữa · bên cạnh · phía trước) rồi ghi ai thế nào.",
        "paras": [
          {
            "label": "A",
            "text": "これは{日本語|にほんご}のクラスの{写真|しゃしん}です。{真|ま}ん{中|なか}の{人|ひと}は{田中|たなか}{先生|せんせい}です。{髪|かみ}が{短|みじか}くて、{優|やさ}しい{先生|せんせい}です。{先生|せんせい}の{横|よこ}の{背|せ}が{高|たか}い{人|ひと}はダニエルさんです。ダニエルさんは{頭|あたま}がよくて、{日本語|にほんご}がとても{上手|じょうず}です。"
          },
          {
            "label": "B",
            "text": "ダニエルさんの{前|まえ}の{髪|かみ}が{長|なが}い{人|ひと}はアンナさんです。アンナさんはテニスが{上手|じょうず}で、{毎週|まいしゅう}{土曜日|どようび}にテニスをします。アンナさんの{隣|となり}の{人|ひと}はナタポンさんです。ナタポンさんは{背|せ}があまり{高|たか}くないですが、サッカーが{上手|じょうず}です。お{兄|にい}さんと{二人|ふたり}で{住|す}んでいます。"
          },
          {
            "label": "C",
            "text": "この{日|ひ}は{先生|せんせい}の{誕生日|たんじょうび}でした。みんなで{先生|せんせい}に{花|はな}とカードをあげました。{楽|たの}しい{一日|いちにち}でした。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "これは{日本語|にほんご}のクラスの{写真|しゃしん}です。",
            "ro": "Kore wa Nihongo no kurasu no shashin desu.",
            "vi": "Đây là ảnh lớp tiếng Nhật."
          },
          {
            "en": "{真|ま}ん{中|なか}の{人|ひと}は{田中|たなか}{先生|せんせい}です。",
            "ro": "Mannaka no hito wa Tanaka sensei desu.",
            "vi": "Người ở giữa là thầy Tanaka."
          },
          {
            "en": "{髪|かみ}が{短|みじか}くて、{優|やさ}しい{先生|せんせい}です。",
            "ro": "Kami ga mijikakute, yasashii sensei desu.",
            "vi": "Thầy tóc ngắn và hiền."
          },
          {
            "en": "{先生|せんせい}の{横|よこ}の{背|せ}が{高|たか}い{人|ひと}はダニエルさんです。",
            "ro": "Sensei no yoko no se ga takai hito wa Danieru-san desu.",
            "vi": "Người cao bên cạnh thầy là Daniel."
          },
          {
            "en": "ダニエルさんは{頭|あたま}がよくて、{日本語|にほんご}がとても{上手|じょうず}です。",
            "ro": "Danieru-san wa atama ga yokute, Nihongo ga totemo jouzu desu.",
            "vi": "Daniel thông minh và tiếng Nhật rất giỏi."
          },
          {
            "en": "ダニエルさんの{前|まえ}の{髪|かみ}が{長|なが}い{人|ひと}はアンナさんです。",
            "ro": "Danieru-san no mae no kami ga nagai hito wa Anna-san desu.",
            "vi": "Người tóc dài phía trước Daniel là Anna."
          },
          {
            "en": "アンナさんはテニスが{上手|じょうず}で、{毎週|まいしゅう}{土曜日|どようび}にテニスをします。",
            "ro": "Anna-san wa tenisu ga jouzu de, maishuu doyoubi ni tenisu o shimasu.",
            "vi": "Anna chơi tennis giỏi, thứ Bảy hàng tuần đều chơi tennis."
          },
          {
            "en": "アンナさんの{隣|となり}の{人|ひと}はナタポンさんです。",
            "ro": "Anna-san no tonari no hito wa Natapon-san desu.",
            "vi": "Người bên cạnh Anna là Natapon."
          },
          {
            "en": "ナタポンさんは{背|せ}があまり{高|たか}くないですが、サッカーが{上手|じょうず}です。",
            "ro": "Natapon-san wa se ga amari takakunai desu ga, sakkaa ga jouzu desu.",
            "vi": "Natapon không cao lắm nhưng đá bóng giỏi."
          },
          {
            "en": "お{兄|にい}さんと{二人|ふたり}で{住|す}んでいます。",
            "ro": "Oniisan to futari de sunde imasu.",
            "vi": "Bạn ấy sống hai người với anh trai."
          },
          {
            "en": "この{日|ひ}は{先生|せんせい}の{誕生日|たんじょうび}でした。",
            "ro": "Kono hi wa sensei no tanjoubi deshita.",
            "vi": "Hôm đó là sinh nhật thầy."
          },
          {
            "en": "みんなで{先生|せんせい}に{花|はな}とカードをあげました。",
            "ro": "Minna de sensei ni hana to kaado o agemashita.",
            "vi": "Cả lớp tặng thầy hoa và thiệp."
          },
          {
            "en": "{楽|たの}しい{一日|いちにち}でした。",
            "ro": "Tanoshii ichinichi deshita.",
            "vi": "Đó là một ngày vui."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-doc4-q",
        "title": "Đoạn 4 — câu hỏi (9 câu)",
        "items": [
          {
            "q": "Ai đứng ở giữa ảnh?",
            "options": [
              "Daniel",
              "Anna",
              "Natapon",
              "Thầy Tanaka"
            ],
            "correct": 3,
            "why": "真ん中の 人は 田中先生."
          },
          {
            "q": "Thầy Tanaka thế nào?",
            "options": [
              "Cao, đẹp trai",
              "Tóc ngắn, hiền",
              "Tóc trắng, vui tính",
              "Tóc dài, nghiêm"
            ],
            "correct": 1,
            "why": "髪が 短くて、優しい."
          },
          {
            "q": "Người cao bên cạnh thầy là ai?",
            "options": [
              "Marco",
              "Daniel",
              "Natapon",
              "Anna"
            ],
            "correct": 1,
            "why": "先生の 横の 背が 高い人は ダニエルさん."
          },
          {
            "q": "Daniel giỏi gì?",
            "options": [
              "Tiếng Nhật",
              "Nấu ăn",
              "Bóng đá",
              "Tennis"
            ],
            "correct": 0,
            "why": "日本語が とても 上手."
          },
          {
            "q": "Ai tóc dài, đứng trước Daniel?",
            "options": [
              "Thầy Tanaka",
              "Không có ai",
              "Natapon",
              "Anna"
            ],
            "correct": 3,
            "why": "ダニエルさんの 前の 髪が 長い人は アンナさん."
          },
          {
            "q": "Anna chơi tennis khi nào?",
            "options": [
              "Thứ Bảy tuần sau",
              "Chủ nhật hàng tuần",
              "Mỗi ngày",
              "Thứ Bảy hàng tuần"
            ],
            "correct": 3,
            "why": "毎週 土曜日に テニスを します."
          },
          {
            "q": "Câu nào ĐÚNG về Natapon?",
            "options": [
              "Sống một mình",
              "Không cao lắm nhưng đá bóng giỏi",
              "Rất cao và đá bóng giỏi",
              "Sống với em trai"
            ],
            "correct": 1,
            "why": "背が あまり 高くないですが、サッカーが 上手 · お兄さんと 二人で."
          },
          {
            "q": "Hôm chụp ảnh là ngày gì?",
            "options": [
              "Lễ cưới của thầy",
              "Sinh nhật Anna",
              "Sinh nhật thầy Tanaka",
              "Giáng sinh"
            ],
            "correct": 2,
            "why": "この日は 先生の 誕生日でした."
          },
          {
            "q": "Cả lớp tặng thầy gì?",
            "options": [
              "Hoa và thiệp",
              "Đồng hồ",
              "Sách và thiệp",
              "Sô-cô-la"
            ],
            "correct": 0,
            "why": "花と カードを あげました."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b8-doc-rk",
        "title": "Đọc to 4 đoạn KHÔNG furigana, rồi bấm xem (4 đoạn)",
        "note": "Đọc cả câu to, kể cả hiragana. Sau đó làm 8 câu hỏi bên dưới.",
        "items": [
          {
            "text": "{私|わたし}の{父|ちち}は{日本語|にほんご}の{先生|せんせい}です。{大学|だいがく}で{日本語|にほんご}をおしえています。{母|はは}は{会社員|かいしゃいん}です。",
            "ro": "Watashi no chichi wa Nihongo no sensei desu. Daigaku de Nihongo o oshiete imasu. Haha wa kaishain desu.",
            "vi": "Bố tôi là giáo viên tiếng Nhật. Bố dạy tiếng Nhật ở trường đại học. Mẹ tôi là nhân viên công ty."
          },
          {
            "text": "{姉|あね}は{目|め}が{大|おお}きくて、かみが{長|なが}いです。{東京|とうきょう}にすんでいます。{子|こ}どもが{二人|ふたり}います。",
            "ro": "Ane wa me ga ookikute, kami ga nagai desu. Toukyou ni sunde imasu. Kodomo ga futari imasu.",
            "vi": "Chị tôi mắt to, tóc dài. Chị sống ở Tokyo. Chị có hai con."
          },
          {
            "text": "{先週|せんしゅう}の{日曜日|にちようび}は{弟|おとうと}のたんじょうびでした。{私|わたし}は{弟|おとうと}に{本|ほん}をあげました。{兄|あに}はとけいをあげました。",
            "ro": "Senshuu no nichiyoubi wa otouto no tanjoubi deshita. Watashi wa otouto ni hon o agemashita. Ani wa tokei o agemashita.",
            "vi": "Chủ nhật tuần trước là sinh nhật em trai tôi. Tôi tặng em quyển sách. Anh tôi tặng đồng hồ."
          },
          {
            "text": "{妹|いもうと}は{料理|りょうり}がじょうずです。{毎日|まいにち}{母|はは}と{二人|ふたり}で{晩|ばん}ごはんをつくります。{父|ちち}は{料理|りょうり}がへたです。",
            "ro": "Imouto wa ryouri ga jouzu desu. Mainichi haha to futari de bangohan o tsukurimasu. Chichi wa ryouri ga heta desu.",
            "vi": "Em gái tôi nấu ăn giỏi. Ngày nào em cũng nấu cơm tối cùng mẹ. Bố tôi nấu ăn dở."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-doc-rk-q",
        "title": "Câu hỏi về 4 đoạn không furigana (8 câu)",
        "items": [
          {
            "q": "(Đoạn 1) Bố tác giả làm gì?",
            "options": [
              "Bác sĩ",
              "Nhân viên công ty",
              "Dạy tiếng Nhật ở đại học",
              "Học tiếng Nhật"
            ],
            "correct": 2,
            "why": "大学で 日本語を おしえています."
          },
          {
            "q": "(Đoạn 1) Mẹ tác giả làm gì?",
            "options": [
              "Nhân viên công ty",
              "Không đi làm",
              "Giáo viên",
              "Sinh viên"
            ],
            "correct": 0,
            "why": "母は 会社員です."
          },
          {
            "q": "(Đoạn 2) Chị gái trông thế nào?",
            "options": [
              "Mắt nhỏ, tóc ngắn",
              "Mắt to, tóc dài",
              "Cao, tóc dài",
              "Mắt to, tóc ngắn"
            ],
            "correct": 1,
            "why": "目が 大きくて、かみが 長い."
          },
          {
            "q": "(Đoạn 2) Chị có mấy con?",
            "options": [
              "Ba",
              "Hai",
              "Một",
              "Không có"
            ],
            "correct": 1,
            "why": "子どもが 二人 います."
          },
          {
            "q": "(Đoạn 3) Chủ nhật tuần trước là ngày gì?",
            "options": [
              "Sinh nhật anh trai",
              "Lễ cưới",
              "Sinh nhật tác giả",
              "Sinh nhật em trai"
            ],
            "correct": 3,
            "why": "弟の たんじょうび でした."
          },
          {
            "q": "(Đoạn 3) Anh trai tặng gì?",
            "options": [
              "Đồng hồ",
              "Ô",
              "Thiệp",
              "Sách"
            ],
            "correct": 0,
            "why": "兄は とけいを あげました."
          },
          {
            "q": "(Đoạn 4) Ai nấu ăn giỏi?",
            "options": [
              "Tác giả",
              "Anh trai",
              "Bố",
              "Em gái"
            ],
            "correct": 3,
            "why": "妹は 料理が じょうず."
          },
          {
            "q": "(Đoạn 4) Bố nấu ăn thế nào?",
            "options": [
              "Giỏi",
              "Dở",
              "Hay nấu cùng mẹ",
              "Không nói"
            ],
            "correct": 1,
            "why": "父は 料理が へたです."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b8-nghe",
    "kind": "listening",
    "title": "Luyện thêm Bài 8 · Nghe — có/không → nơi ở, nghề, số người, tả người, quà → bẫy đổi ý, nơi ở/nơi làm (19 đoạn, ~39 câu)",
    "goal": "Nghe ra có hay không có (anh chị em, thú cưng, đã kết hôn), nơi ở và nơi làm việc, số người/số con vật, người được tả thế nào, ai tặng ai — không bị lừa khi người nói đổi ý hay đính chính.",
    "minutes": 65,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Nghe **2 lần**: lần 1 bắt ý chính (nói về ai, có hay không); lần 2 ghi **số người / nghề / nơi ở / ai tặng ai**. Xem lời thoại + romaji sau cùng để kiểm.",
          "Bẫy quen thuộc: **住んでいる nơi** khác **働いている nơi** · người nói **đổi ý** (thông tin sau cùng mới chốt) · **くれました ↔ もらいました** (cùng một món quà, hai cách nói) · đếm **người** và **con vật** trong cùng một câu.",
          "Luyện shadowing: bật lại từng đoạn và nói đuổi theo — rất tốt cho câu hỏi thi nói về gia đình."
        ]
      },
      {
        "t": "recap",
        "title": "Từ khoá cần bắt tai",
        "items": [
          "**Gia đình**: 父・母・兄・姉・弟・妹 (của mình) ↔ お父さん・お母さん・お兄さん・お姉さん (của người khác) · ～人 · ～匹.",
          "**Nghề / nơi**: ～に 住んでいます · ～で 働いています · 結婚しています.",
          "**Quà**: ～が くれました · ～に もらいました · ～に あげました · よかったですね."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · chậm, ngắn — ○ hay ×"
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-1a",
        "title": "① (chậm)",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{兄弟|きょうだい}がいますか。",
            "ro": "Kyoudai ga imasu ka.",
            "vi": "Bạn có anh chị em không?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "はい、{姉|あね}が{一人|ひとり}います。",
            "ro": "Hai, ane ga hitori imasu.",
            "vi": "Có, mình có một chị gái."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-1b",
        "title": "② (chậm)",
        "lines": [
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "ペットがいますか。",
            "ro": "Petto ga imasu ka.",
            "vi": "Bạn có thú cưng không?"
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "いいえ、いません。",
            "ro": "Iie, imasen.",
            "vi": "Không, mình không có."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-1c",
        "title": "③",
        "lines": [
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "{田中|たなか}さんは{結婚|けっこん}していますか。",
            "ro": "Tanaka-san wa kekkon shite imasu ka.",
            "vi": "Anh Tanaka đã lập gia đình chưa?"
          },
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "はい、しています。{子|こ}どもが{二人|ふたり}います。",
            "ro": "Hai, shite imasu. Kodomo ga futari imasu.",
            "vi": "Rồi. Anh ấy có hai con."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-1d",
        "title": "④",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "{一人|ひとり}で{住|す}んでいますか。",
            "ro": "Hitori de sunde imasu ka.",
            "vi": "Bạn sống một mình à?"
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "いいえ、{友達|ともだち}と{二人|ふたり}で{住|す}んでいます。",
            "ro": "Iie, tomodachi to futari de sunde imasu.",
            "vi": "Không, mình sống hai người với bạn."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-1e",
        "title": "⑤",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "その{傘|かさ}、{誰|だれ}がくれましたか。",
            "ro": "Sono kasa, dare ga kuremashita ka.",
            "vi": "Cái ô đó ai tặng bạn vậy?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{母|はは}がくれました。",
            "ro": "Haha ga kuremashita.",
            "vi": "Mẹ mình tặng."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-ng-1-q",
        "title": "Câu hỏi ①–⑤ (7 câu)",
        "items": [
          {
            "q": "① Anna có anh chị em không?",
            "options": [
              "○ có",
              "× không"
            ],
            "correct": 0,
            "why": "はい、姉が 一人 います."
          },
          {
            "q": "① Anna có ai?",
            "options": [
              "Hai chị gái",
              "Một anh trai",
              "Một chị gái",
              "Một em gái"
            ],
            "correct": 2,
            "why": "姉が 一人."
          },
          {
            "q": "② Daniel có thú cưng không?",
            "options": [
              "○ có",
              "× không"
            ],
            "correct": 1,
            "why": "いいえ、いません."
          },
          {
            "q": "③ Anh Tanaka đã kết hôn chưa?",
            "options": [
              "○ rồi",
              "× chưa"
            ],
            "correct": 0,
            "why": "はい、しています."
          },
          {
            "q": "③ Anh Tanaka có mấy con?",
            "options": [
              "Hai",
              "Không có",
              "Một",
              "Ba"
            ],
            "correct": 0,
            "why": "子どもが 二人."
          },
          {
            "q": "④ Carlos sống một mình à?",
            "options": [
              "○ đúng",
              "× không — sống với bạn"
            ],
            "correct": 1,
            "why": "友達と 二人で 住んでいます."
          },
          {
            "q": "⑤ Ai tặng Anna cái ô?",
            "options": [
              "Marco",
              "Mẹ Anna",
              "Chị gái Anna",
              "Bố Anna"
            ],
            "correct": 1,
            "why": "母が くれました."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · nơi ở · nghề · số người · tả người · quà"
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-2a",
        "title": "⑥ Sống ở đâu?",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{山口|やまぐち}さんはどこに{住|す}んでいますか。",
            "ro": "Yamaguchi-san wa doko ni sunde imasu ka.",
            "vi": "Yamaguchi sống ở đâu?"
          },
          {
            "who": "山口",
            "voice": "ja-nu",
            "text": "{横浜|よこはま}に{住|す}んでいます。{駅|えき}の{近|ちか}くです。",
            "ro": "Yokohama ni sunde imasu. Eki no chikaku desu.",
            "vi": "Mình sống ở Yokohama. Gần ga."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-2b",
        "title": "⑦ Bố mẹ làm gì?",
        "lines": [
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "お{父|とう}さんは{何|なに}をしていますか。",
            "ro": "Otousan wa nani o shite imasu ka.",
            "vi": "Bố bạn làm nghề gì?"
          },
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "{父|ちち}は{医者|いしゃ}です。{母|はは}も{病院|びょういん}で{働|はたら}いています。",
            "ro": "Chichi wa isha desu. Haha mo byouin de hataraite imasu.",
            "vi": "Bố mình là bác sĩ. Mẹ mình cũng làm ở bệnh viện."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-2c",
        "title": "⑧ Nhà mấy người?",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "ナタポンさんのご{家族|かぞく}は{何人|なんにん}ですか。",
            "ro": "Natapon-san no gokazoku wa nannin desu ka.",
            "vi": "Nhà Natapon mấy người?"
          },
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "{六人|ろくにん}です。{両親|りょうしん}と{兄|あに}が{二人|ふたり}と{妹|いもうと}と{私|わたし}です。",
            "ro": "Rokunin desu. Ryoushin to ani ga futari to imouto to watashi desu.",
            "vi": "Sáu người. Bố mẹ, hai anh trai, em gái và mình."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-2d",
        "title": "⑨ Người thế nào?",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "マルコさんのお{姉|ねえ}さんはどんな{人|ひと}ですか。",
            "ro": "Maruko-san no oneesan wa donna hito desu ka.",
            "vi": "Chị gái Marco là người thế nào?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{姉|あね}は{背|せ}が{高|たか}くて、{髪|かみ}が{長|なが}いです。{元気|げんき}で、おもしろい{人|ひと}です。",
            "ro": "Ane wa se ga takakute, kami ga nagai desu. Genki de, omoshiroi hito desu.",
            "vi": "Chị mình cao, tóc dài. Chị năng động và vui tính."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-2e",
        "title": "⑩ Người trong ảnh",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "この{人|ひと}はお{兄|にい}さんですか。",
            "ro": "Kono hito wa oniisan desu ka.",
            "vi": "Người này là anh trai bạn à?"
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "いいえ、{弟|おとうと}です。{背|せ}が{高|たか}いですが、まだ{高校生|こうこうせい}です。",
            "ro": "Iie, otouto desu. Se ga takai desu ga, mada koukousei desu.",
            "vi": "Không, em trai mình. Cao vậy nhưng vẫn là học sinh cấp 3."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-2f",
        "title": "⑪ Dây chuyền",
        "lines": [
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "{素敵|すてき}なネックレスですね。",
            "ro": "Suteki na nekkuresu desu ne.",
            "vi": "Dây chuyền đẹp nhỉ."
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "ありがとう。{誕生日|たんじょうび}に{姉|あね}にもらいました。",
            "ro": "Arigatou. Tanjoubi ni ane ni moraimashita.",
            "vi": "Cảm ơn. Mình nhận của chị gái vào sinh nhật."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-2g",
        "title": "⑫ Chọn quà",
        "lines": [
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "{田中|たなか}さんに{何|なに}をあげますか。",
            "ro": "Tanaka-san ni nani o agemasu ka.",
            "vi": "Bạn tặng anh Tanaka gì?"
          },
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "{田中|たなか}さんは{本|ほん}が{好|す}きですから、{辞書|じしょ}をあげたいです。",
            "ro": "Tanaka-san wa hon ga suki desu kara, jisho o agetai desu.",
            "vi": "Anh Tanaka thích sách nên mình muốn tặng từ điển."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-ng-2-q",
        "title": "Câu hỏi ⑥–⑫ (12 câu)",
        "items": [
          {
            "q": "⑥ Yamaguchi sống ở đâu?",
            "options": [
              "Yokohama, gần trường",
              "Gần nhà Daniel",
              "Yokohama, gần ga",
              "Tokyo, gần ga"
            ],
            "correct": 2,
            "why": "横浜 · 駅の 近く."
          },
          {
            "q": "⑦ Bố Mary làm nghề gì?",
            "options": [
              "Giáo viên",
              "Nhân viên ngân hàng",
              "Nhân viên công ty",
              "Bác sĩ"
            ],
            "correct": 3,
            "why": "父は 医者です."
          },
          {
            "q": "⑦ Mẹ Mary làm việc ở đâu?",
            "options": [
              "Ở nhà",
              "Bệnh viện",
              "Ngân hàng",
              "Trường học"
            ],
            "correct": 1,
            "why": "母も 病院で 働いています."
          },
          {
            "q": "⑧ Nhà Natapon mấy người?",
            "options": [
              "Sáu",
              "Bốn",
              "Bảy",
              "Năm"
            ],
            "correct": 0,
            "why": "六人です."
          },
          {
            "q": "⑧ Natapon có mấy anh trai?",
            "options": [
              "Ba",
              "Một",
              "Không có",
              "Hai"
            ],
            "correct": 3,
            "why": "兄が 二人."
          },
          {
            "q": "⑨ Ngoại hình chị gái Marco?",
            "options": [
              "Mắt to, tóc ngắn",
              "Cao, tóc ngắn",
              "Cao, tóc dài",
              "Thấp, tóc dài"
            ],
            "correct": 2,
            "why": "背が 高くて、髪が 長い."
          },
          {
            "q": "⑨ Tính cách chị gái Marco?",
            "options": [
              "Nghiêm túc",
              "Năng động, vui tính",
              "Chăm chỉ, tốt bụng",
              "Hiền, thông minh"
            ],
            "correct": 1,
            "why": "元気で、おもしろい人."
          },
          {
            "q": "⑩ Người trong ảnh là ai?",
            "options": [
              "Bố Daniel",
              "Em trai Daniel",
              "Bạn của Daniel",
              "Anh trai Daniel"
            ],
            "correct": 1,
            "why": "いいえ、弟です."
          },
          {
            "q": "⑩ Người đó là gì?",
            "options": [
              "Học sinh cấp 3",
              "Sinh viên đại học",
              "Nhân viên công ty",
              "Bác sĩ"
            ],
            "correct": 0,
            "why": "まだ 高校生です."
          },
          {
            "q": "⑪ Ai tặng Anna dây chuyền?",
            "options": [
              "Mẹ Anna",
              "Mary",
              "Bạn trai",
              "Chị gái Anna"
            ],
            "correct": 3,
            "why": "姉に もらいました."
          },
          {
            "q": "⑫ Park muốn tặng anh Tanaka gì?",
            "options": [
              "Từ điển",
              "Thiệp",
              "Đồng hồ",
              "Sách truyện"
            ],
            "correct": 0,
            "why": "辞書を あげたいです."
          },
          {
            "q": "⑫ Vì sao?",
            "options": [
              "Vì Carlos gợi ý",
              "Vì từ điển rẻ",
              "Vì anh Tanaka học tiếng Nhật",
              "Vì anh Tanaka thích sách"
            ],
            "correct": 3,
            "why": "本が 好きですから."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bẫy đổi ý, nơi ở/nơi làm, đếm người và con vật"
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-3a",
        "title": "⑬ Đổi ý quà",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "パクさんの{誕生日|たんじょうび}に{花|はな}をあげませんか。",
            "ro": "Paku-san no tanjoubi ni hana o agemasen ka.",
            "vi": "Sinh nhật Park, mình tặng hoa không?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{花|はな}もいいですが、パクさんはチョコレートがとても{好|す}きですよ。",
            "ro": "Hana mo ii desu ga, Paku-san wa chokoreeto ga totemo suki desu yo.",
            "vi": "Hoa cũng được, nhưng Park rất thích sô-cô-la đấy."
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "じゃ、チョコレートをあげましょう。",
            "ro": "Ja, chokoreeto o agemashou.",
            "vi": "Vậy mình tặng sô-cô-la đi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-3b",
        "title": "⑭ Nhà mấy người — và mấy con",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "ご{家族|かぞく}は{何人|なんにん}ですか。",
            "ro": "Gokazoku wa nannin desu ka.",
            "vi": "Nhà bạn mấy người?"
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "{五人|ごにん}です。{父|ちち}と{母|はは}と{兄|あに}と{弟|おとうと}と{私|わたし}です。{犬|いぬ}も{一匹|いっぴき}いますよ。",
            "ro": "Gonin desu. Chichi to haha to ani to otouto to watashi desu. Inu mo ippiki imasu yo.",
            "vi": "Năm người: bố, mẹ, anh trai, em trai và mình. Còn có một con chó nữa đấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-3c",
        "title": "⑮ Ai tặng ai?",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "その{時計|とけい}、{誰|だれ}にもらいましたか。",
            "ro": "Sono tokei, dare ni moraimashita ka.",
            "vi": "Cái đồng hồ đó bạn nhận của ai?"
          },
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "{兄|あに}がくれました。{私|わたし}は{兄|あに}にかばんをあげました。",
            "ro": "Ani ga kuremashita. Watashi wa ani ni kaban o agemashita.",
            "vi": "Anh trai mình tặng. Còn mình tặng anh cái cặp."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-3d",
        "title": "⑯ Sống ở đâu, làm ở đâu?",
        "lines": [
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "お{兄|にい}さんは{東京|とうきょう}に{住|す}んでいますか。",
            "ro": "Oniisan wa Toukyou ni sunde imasu ka.",
            "vi": "Anh bạn sống ở Tokyo à?"
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "いいえ、{兄|あに}は{横浜|よこはま}に{住|す}んでいます。{東京|とうきょう}の{会社|かいしゃ}で{働|はたら}いています。",
            "ro": "Iie, ani wa Yokohama ni sunde imasu. Toukyou no kaisha de hataraite imasu.",
            "vi": "Không, anh mình sống ở Yokohama. Anh làm ở một công ty tại Tokyo."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-3e",
        "title": "⑰ Đi mấy người?",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "{来週|らいしゅう}、{誰|だれ}と{京都|きょうと}へ{行|い}きますか。",
            "ro": "Raishuu, dare to Kyouto e ikimasu ka.",
            "vi": "Tuần sau bạn đi Kyoto với ai?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{友達|ともだち}{二人|ふたり}と{行|い}きます。{三人|さんにん}で{行|い}きます。",
            "ro": "Tomodachi futari to ikimasu. Sannin de ikimasu.",
            "vi": "Mình đi với hai người bạn. Tổng cộng ba người."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-3f",
        "title": "⑱ Bạn cùng phòng là ai?",
        "lines": [
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "アンナさんのルームメイトはどの{人|ひと}ですか。あの{髪|かみ}が{長|なが}い{人|ひと}ですか。",
            "ro": "Anna-san no ruumumeito wa dono hito desu ka. Ano kami ga nagai hito desu ka.",
            "vi": "Bạn cùng phòng của Anna là người nào? Người tóc dài kia à?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "いいえ、その{隣|となり}の{人|ひと}です。{髪|かみ}が{短|みじか}くて、{背|せ}が{高|たか}い{人|ひと}です。",
            "ro": "Iie, sono tonari no hito desu. Kami ga mijikakute, se ga takai hito desu.",
            "vi": "Không, người bên cạnh. Người tóc ngắn, cao ấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b8-ng-3g",
        "title": "⑲ Gia đình anh Tanaka",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "{田中|たなか}さんは{結婚|けっこん}していますか。",
            "ro": "Tanaka-san wa kekkon shite imasu ka.",
            "vi": "Anh Tanaka đã lập gia đình chưa?"
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "はい。{奥|おく}さんは{医者|いしゃ}です。お{子|こ}さんはいませんが、{猫|ねこ}が{三匹|さんびき}います。",
            "ro": "Hai. Okusan wa isha desu. Okosan wa imasen ga, neko ga sanbiki imasu.",
            "vi": "Rồi. Vợ anh ấy là bác sĩ. Anh ấy chưa có con nhưng có ba con mèo."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-ng-3-q",
        "title": "Câu hỏi ⑬–⑲ (14 câu)",
        "items": [
          {
            "q": "⑬ Cuối cùng họ tặng Park gì?",
            "options": [
              "Chưa quyết định",
              "Hoa",
              "Sô-cô-la",
              "Cả hoa và sô-cô-la"
            ],
            "correct": 2,
            "why": "じゃ、チョコレートを あげましょう — thông tin sau cùng là chốt."
          },
          {
            "q": "⑭ Nhà Carlos mấy người?",
            "options": [
              "Ba",
              "Năm",
              "Bốn",
              "Sáu"
            ],
            "correct": 1,
            "why": "五人です (con chó không tính)."
          },
          {
            "q": "⑭ Carlos có chị gái không?",
            "options": [
              "Không",
              "Có hai chị",
              "Không nói",
              "Có một chị"
            ],
            "correct": 0,
            "why": "父と 母と 兄と 弟と 私."
          },
          {
            "q": "⑭ Nhà Carlos nuôi gì?",
            "options": [
              "Không nuôi",
              "Một con mèo",
              "Một con chó",
              "Hai con chó"
            ],
            "correct": 2,
            "why": "犬も 一匹 います."
          },
          {
            "q": "⑮ Ai tặng Natapon đồng hồ?",
            "options": [
              "Anh trai",
              "Bố",
              "Em trai",
              "Park"
            ],
            "correct": 0,
            "why": "兄が くれました."
          },
          {
            "q": "⑮ Natapon tặng anh cái gì?",
            "options": [
              "Sách",
              "Đồng hồ",
              "Không tặng gì",
              "Cái cặp"
            ],
            "correct": 3,
            "why": "兄に かばんを あげました."
          },
          {
            "q": "⑯ Anh trai Carlos sống ở đâu?",
            "options": [
              "Tokyo",
              "Kyoto",
              "Yokohama",
              "Osaka"
            ],
            "correct": 2,
            "why": "横浜に 住んでいます."
          },
          {
            "q": "⑯ Anh trai Carlos làm việc ở đâu?",
            "options": [
              "Công ty ở Yokohama",
              "Công ty ở Tokyo",
              "Bệnh viện ở Tokyo",
              "Ngân hàng ở Yokohama"
            ],
            "correct": 1,
            "why": "東京の 会社で 働いています."
          },
          {
            "q": "⑰ Anna đi Kyoto tổng cộng mấy người?",
            "options": [
              "Ba",
              "Bốn",
              "Một mình",
              "Hai"
            ],
            "correct": 0,
            "why": "三人で 行きます."
          },
          {
            "q": "⑰ Anna đi cùng mấy người bạn?",
            "options": [
              "Hai",
              "Bốn",
              "Ba",
              "Một"
            ],
            "correct": 0,
            "why": "友達 二人と."
          },
          {
            "q": "⑱ Bạn cùng phòng của Anna là ai?",
            "options": [
              "Người tóc ngắn, thấp",
              "Người tóc ngắn, cao, bên cạnh người tóc dài",
              "Người tóc dài",
              "Natapon"
            ],
            "correct": 1,
            "why": "いいえ、その 隣の 人 · 髪が 短くて、背が 高い."
          },
          {
            "q": "⑲ Vợ anh Tanaka làm nghề gì?",
            "options": [
              "Không đi làm",
              "Giáo viên",
              "Nhân viên công ty",
              "Bác sĩ"
            ],
            "correct": 3,
            "why": "奥さんは 医者です."
          },
          {
            "q": "⑲ Anh Tanaka có con không?",
            "options": [
              "Không",
              "Có hai con",
              "Có ba con",
              "Có một con"
            ],
            "correct": 0,
            "why": "お子さんは いません."
          },
          {
            "q": "⑲ Anh Tanaka nuôi gì?",
            "options": [
              "Một con mèo",
              "Ba con chó",
              "Ba con mèo",
              "Không nuôi"
            ],
            "correct": 2,
            "why": "猫が 三匹 います."
          }
        ]
      },
      {
        "t": "h",
        "text": "Nghe điền chỗ trống — nghe lại các đoạn trên rồi gõ"
      },
      {
        "t": "quiz",
        "id": "lt-b8-ng-dien",
        "title": "Nghe điền chỗ trống (6 câu)",
        "kind": "fill",
        "grammar": "Nghe lại đoạn được ghi trong gợi ý",
        "items": [
          {
            "q": "アンナ：はい、{姉|あね}が＿＿います。　〔Anna: hai, ane ga __ imasu.〕",
            "answers": [
              "一人",
              "ひとり"
            ],
            "hint": "Một người (nghe ①)"
          },
          {
            "q": "カルロス：{友達|ともだち}と{二人|ふたり}＿＿{住|す}んでいます。　〔Karurosu: tomodachi to futari __ sunde imasu.〕",
            "answers": [
              "で"
            ],
            "hint": "Tổng số người (nghe ④)"
          },
          {
            "q": "メアリー：{母|はは}も{病院|びょういん}＿＿{働|はたら}いています。　〔Mearii: haha mo byouin __ hataraite imasu.〕",
            "answers": [
              "で"
            ],
            "hint": "Nơi làm việc (nghe ⑦)"
          },
          {
            "q": "マルコ：{姉|あね}は{背|せ}が{高|たか}＿＿、{髪|かみ}が{長|なが}いです。　〔Maruko: ane wa se ga taka__, kami ga nagai desu.〕",
            "answers": [
              "くて"
            ],
            "hint": "Nối tính từ (nghe ⑨)"
          },
          {
            "q": "アンナ：{誕生日|たんじょうび}に{姉|あね}に＿＿。　〔Anna: tanjoubi ni ane ni __.〕",
            "answers": [
              "もらいました"
            ],
            "hint": "Nhận (nghe ⑪)"
          },
          {
            "q": "ナタポン：{兄|あに}が＿＿。　〔Natapon: ani ga __.〕",
            "answers": [
              "くれました"
            ],
            "hint": "Anh → tôi (nghe ⑮)"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b8-noi-viet",
    "kind": "speaking",
    "title": "Luyện thêm Bài 8 · Nói & viết — 5 bộ tranh kiểu thi nói (3 câu tranh + 1 cá nhân) · đọc to · viết 3–5 câu",
    "goal": "Trả lời trọn câu các câu hỏi thi nói Bài 8 (gia đình, nghề, nơi ở, người thế nào, ai tặng gì), đọc to trôi chảy, viết đoạn giới thiệu gia đình / tả bạn / cảm ơn quà 3–5 câu.",
    "minutes": 90,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thi nói: **nghe → nghĩ không quá 10 giây → trả lời TRỌN CÂU → thêm 1 câu phụ**. Mỗi bộ có 3 câu nhìn \"tranh\" (mô tả trong khung) + 1 câu cá nhân: che lời \"Bạn\", tự nói, rồi nghe mẫu.",
          "Ba khung \"ăn điểm\" của Bài 8: **gia đình** (～人です · 父は～です。～で働いています) · **tả người** (～くて／～で、～人です · N が 上手です) · **quà** (～が くれました · ～に もらいました · ～に あげました).",
          "Viết ngắn: 3–5 câu, mỗi câu một ý; soát **người nhà mình / người khác**, trợ từ **に／で／が**, và **あげます／くれます／もらいます**."
        ]
      },
      {
        "t": "recap",
        "title": "Cách tự chấm",
        "items": [
          "✅ Trả lời TRỌN CÂU · ✅ đúng thông tin theo tranh · ✅ thêm 1 câu phụ · ✅ không im lặng quá 10 giây.",
          "Nghe không rõ: 「もう いちど おねがいします。」 Quên từ: nói cách khác bằng từ chắc chắn (ví dụ quên 医者 → 病院で 働いています)."
        ]
      },
      {
        "t": "table",
        "head": [
          "Câu hỏi của giám khảo",
          "Khung trả lời an toàn",
          "Thêm 1 câu phụ"
        ],
        "rows": [
          [
            "ごかぞくは なんにんですか",
            "～人です。父と 母と … と 私です。",
            "ペットも います／～に 住んでいます"
          ],
          [
            "きょうだいが いますか",
            "はい、～が ～人 います。／いいえ、いません。",
            "兄は ～で 働いています"
          ],
          [
            "おとうさんは なにを していますか",
            "父は ～です。",
            "～で 働いています"
          ],
          [
            "どこに すんでいますか／だれと すんでいますか",
            "～に 住んでいます。／～と ～人で 住んでいます。",
            "駅の 近くです"
          ],
          [
            "〜さんは どんな ひとですか",
            "～くて／～で、～人です。",
            "～が 上手です"
          ],
          [
            "たんじょうびに なにを もらいましたか",
            "～を もらいました。～が くれました。",
            "素敵な ～です／毎日 使っています"
          ],
          [
            "〜さんに なにを あげますか",
            "～を あげたいです。",
            "～が 好きですから"
          ]
        ],
        "caption": "Khung trả lời Bài 8 — luôn trả lời TRỌN CÂU rồi thêm 1 câu phụ"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · bộ tranh 1–2: ảnh gia đình · hai người bạn"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Ảnh gia đình 5 người: bố, mẹ, anh trai (mặc áo blouse trắng — bác sĩ), em gái (đồng phục cấp 3), bạn; dưới chân có hai con mèo (một trắng, một đen)."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Ảnh gia đình (3 câu theo tranh + 1 câu cá nhân)",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ご{家族|かぞく}は{何人|なんにん}ですか。",
            "ro": "Gokazoku wa nannin desu ka.",
            "vi": "(Tranh) Nhà bạn mấy người?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{五人|ごにん}です。{父|ちち}と{母|はは}と{兄|あに}と{妹|いもうと}と{私|わたし}です。",
            "ro": "Gonin desu. Chichi to haha to ani to imouto to watashi desu.",
            "vi": "Năm người: bố, mẹ, anh trai, em gái và tôi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "お{兄|にい}さんは{何|なに}をしていますか。",
            "ro": "Oniisan wa nani o shite imasu ka.",
            "vi": "(Tranh: anh trai mặc áo bác sĩ) Anh bạn làm nghề gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{兄|あに}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。",
            "ro": "Ani wa isha desu. Byouin de hataraite imasu.",
            "vi": "Anh tôi là bác sĩ. Anh làm ở bệnh viện."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ペットがいますか。",
            "ro": "Petto ga imasu ka.",
            "vi": "(Tranh: hai con mèo) Bạn có thú cưng không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、{猫|ねこ}が{二匹|にひき}います。{白|しろ}い{猫|ねこ}と{黒|くろ}い{猫|ねこ}です。",
            "ro": "Hai, neko ga nihiki imasu. Shiroi neko to kuroi neko desu.",
            "vi": "Có, tôi có hai con mèo: một con trắng và một con đen."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{今|いま}、どこに{住|す}んでいますか。",
            "ro": "Ima, doko ni sunde imasu ka.",
            "vi": "(Cá nhân) Bây giờ bạn sống ở đâu?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ハノイに{住|す}んでいます。{家族|かぞく}と{住|す}んでいます。",
            "ro": "Hanoi ni sunde imasu. Kazoku to sunde imasu.",
            "vi": "Tôi sống ở Hà Nội. Tôi sống với gia đình."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Hai người: Daniel (cao, tóc ngắn, ôm quả bóng đá) và Mary (tóc dài, mắt to, ngồi bên đàn piano)."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Hai người bạn — người thế nào",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ダニエルさんはどんな{人|ひと}ですか。",
            "ro": "Danieru-san wa donna hito desu ka.",
            "vi": "(Tranh) Daniel là người thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}い{人|ひと}です。サッカーが{上手|じょうず}です。",
            "ro": "Se ga takakute, kami ga mijikai hito desu. Sakkaa ga jouzu desu.",
            "vi": "Là người cao, tóc ngắn. Anh ấy đá bóng giỏi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{髪|かみ}が{長|なが}い{人|ひと}は{誰|だれ}ですか。",
            "ro": "Kami ga nagai hito wa dare desu ka.",
            "vi": "(Tranh) Người tóc dài là ai?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "メアリーさんです。{目|め}も{大|おお}きいです。",
            "ro": "Mearii-san desu. Me mo ookii desu.",
            "vi": "Là Mary. Mắt cô ấy cũng to."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "メアリーさんは{何|なに}が{上手|じょうず}ですか。",
            "ro": "Mearii-san wa nani ga jouzu desu ka.",
            "vi": "(Tranh: bên đàn piano) Mary giỏi gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ピアノが{上手|じょうず}です。",
            "ro": "Piano ga jouzu desu.",
            "vi": "Cô ấy chơi piano giỏi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "お{母|かあ}さんはどんな{人|ひと}ですか。",
            "ro": "Okaasan wa donna hito desu ka.",
            "vi": "(Cá nhân) Mẹ bạn là người thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{母|はは}は{優|やさ}しくて、おもしろい{人|ひと}です。{料理|りょうり}が{上手|じょうず}です。",
            "ro": "Haha wa yasashikute, omoshiroi hito desu. Ryouri ga jouzu desu.",
            "vi": "Mẹ tôi hiền và vui tính. Mẹ nấu ăn giỏi."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · bộ tranh 3–4: quà tặng · ai sống ở đâu"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Ba mũi tên: bố → tôi (đồng hồ, bánh sinh nhật); Anna → tôi (tấm thiệp); tôi → mẹ (bó hoa)."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Quà tặng — ai tặng ai",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{誕生日|たんじょうび}にお{父|とう}さんに{何|なに}をもらいましたか。",
            "ro": "Tanjoubi ni otousan ni nani o moraimashita ka.",
            "vi": "(Tranh) Sinh nhật bạn nhận gì của bố?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{時計|とけい}をもらいました。{父|ちち}がくれました。",
            "ro": "Tokei o moraimashita. Chichi ga kuremashita.",
            "vi": "Tôi nhận đồng hồ. Bố tặng tôi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{誰|だれ}がカードをくれましたか。",
            "ro": "Dare ga kaado o kuremashita ka.",
            "vi": "(Tranh) Ai đã tặng bạn tấm thiệp?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "アンナさんがくれました。",
            "ro": "Anna-san ga kuremashita.",
            "vi": "Anna tặng tôi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "お{母|かあ}さんに{何|なに}をあげましたか。",
            "ro": "Okaasan ni nani o agemashita ka.",
            "vi": "(Tranh) Bạn đã tặng mẹ cái gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{花|はな}をあげました。{母|はは}は{花|はな}が{好|す}きです。",
            "ro": "Hana o agemashita. Haha wa hana ga suki desu.",
            "vi": "Tôi tặng hoa. Mẹ tôi thích hoa."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{友達|ともだち}の{誕生日|たんじょうび}に{何|なに}をあげたいですか。",
            "ro": "Tomodachi no tanjoubi ni nani o agetai desu ka.",
            "vi": "(Cá nhân) Sinh nhật bạn bè, bạn muốn tặng gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{本|ほん}をあげたいです。{友達|ともだち}は{本|ほん}が{好|す}きですから。",
            "ro": "Hon o agetai desu. Tomodachi wa hon ga suki desu kara.",
            "vi": "Tôi muốn tặng sách. Vì bạn tôi thích sách."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Hai ngôi nhà: nhà Natapon ở gần trường (Natapon + anh trai); căn hộ ở Yokohama của chị Kimura (một mình), mũi tên từ Yokohama sang toà nhà công ty ở Tokyo."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Ai sống ở đâu, với ai",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ナタポンさんは{誰|だれ}と{住|す}んでいますか。",
            "ro": "Natapon-san wa dare to sunde imasu ka.",
            "vi": "(Tranh) Natapon sống với ai?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "お{兄|にい}さんと{二人|ふたり}で{住|す}んでいます。",
            "ro": "Oniisan to futari de sunde imasu.",
            "vi": "Bạn ấy sống hai người với anh trai."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ナタポンさんのうちはどこにありますか。",
            "ro": "Natapon-san no uchi wa doko ni arimasu ka.",
            "vi": "(Tranh) Nhà Natapon ở đâu?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{学校|がっこう}の{近|ちか}くにあります。",
            "ro": "Gakkou no chikaku ni arimasu.",
            "vi": "Ở gần trường."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{木村|きむら}さんはどこで{働|はたら}いていますか。",
            "ro": "Kimura-san wa doko de hataraite imasu ka.",
            "vi": "(Tranh) Chị Kimura làm việc ở đâu?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{東京|とうきょう}の{会社|かいしゃ}で{働|はたら}いています。{横浜|よこはま}に{一人|ひとり}で{住|す}んでいます。",
            "ro": "Toukyou no kaisha de hataraite imasu. Yokohama ni hitori de sunde imasu.",
            "vi": "Chị làm ở một công ty tại Tokyo. Chị sống một mình ở Yokohama."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{誰|だれ}と{住|す}んでいますか。",
            "ro": "Dare to sunde imasu ka.",
            "vi": "(Cá nhân) Bạn sống với ai?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ルームメイトと{二人|ふたり}で{住|す}んでいます。",
            "ro": "Ruumumeito to futari de sunde imasu.",
            "vi": "Tôi sống hai người với bạn cùng phòng."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bộ tranh 5 · đọc to · viết ngắn"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Giám khảo đóng vai bạn cùng lớp đeo sợi dây chuyền mới; bạn khen và hỏi tiếp về chị gái của bạn ấy."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Nhập vai — khen đồ rồi hỏi về gia đình",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "このネックレス、{姉|あね}がくれました。",
            "ro": "Kono nekkuresu, ane ga kuremashita.",
            "vi": "(Nhập vai) Sợi dây chuyền này chị tôi tặng đấy."
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{素敵|すてき}ですね。お{姉|ねえ}さんは{何|なに}をしていますか。",
            "ro": "Suteki desu ne. Oneesan wa nani o shite imasu ka.",
            "vi": "Đẹp quá nhỉ. Chị bạn làm nghề gì?"
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{姉|あね}は{会社員|かいしゃいん}です。{大阪|おおさか}に{住|す}んでいます。",
            "ro": "Ane wa kaishain desu. Oosaka ni sunde imasu.",
            "vi": "Chị tôi là nhân viên công ty. Chị sống ở Osaka."
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "そうですか。お{姉|ねえ}さんは{結婚|けっこん}していますか。",
            "ro": "Sou desu ka. Oneesan wa kekkon shite imasu ka.",
            "vi": "Vậy à. Chị bạn đã lập gia đình chưa?"
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "はい、しています。{子|こ}どもが{一人|ひとり}います。",
            "ro": "Hai, shite imasu. Kodomo ga hitori imasu.",
            "vi": "Rồi. Chị có một con."
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいですね。",
            "ro": "Ii desu ne.",
            "vi": "Hay quá nhỉ."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{兄弟|きょうだい}がいますか。",
            "ro": "Kyoudai ga imasu ka.",
            "vi": "(Cá nhân) Bạn có anh chị em không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、{弟|おとうと}が{一人|ひとり}います。{高校生|こうこうせい}で、サッカーが{上手|じょうず}です。",
            "ro": "Hai, otouto ga hitori imasu. Koukousei de, sakkaa ga jouzu desu.",
            "vi": "Có, tôi có một em trai. Em là học sinh cấp 3, đá bóng giỏi."
          }
        ]
      },
      {
        "t": "h",
        "text": "Đọc to (Reading 40 điểm)"
      },
      {
        "t": "passage",
        "title": "Đọc to 1 (Reading) — Gia đình tôi",
        "intro": "Chuẩn bị 20 giây rồi đọc to, chậm, rõ. Chú ý số người: よにん, ふたり, にひき.",
        "paras": [
          {
            "text": "{私|わたし}の{家族|かぞく}は{四人|よにん}です。{父|ちち}は{銀行|ぎんこう}で{働|はたら}いています。{母|はは}は{優|やさ}しくて、{料理|りょうり}が{上手|じょうず}です。{姉|あね}は{結婚|けっこん}して、{大阪|おおさか}に{住|す}んでいます。うちに{猫|ねこ}が{二匹|にひき}います。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}の{家族|かぞく}は{四人|よにん}です。",
            "ro": "Watashi no kazoku wa yonin desu.",
            "vi": "Gia đình tôi có bốn người."
          },
          {
            "en": "{父|ちち}は{銀行|ぎんこう}で{働|はたら}いています。",
            "ro": "Chichi wa ginkou de hataraite imasu.",
            "vi": "Bố tôi làm ở ngân hàng."
          },
          {
            "en": "{母|はは}は{優|やさ}しくて、{料理|りょうり}が{上手|じょうず}です。",
            "ro": "Haha wa yasashikute, ryouri ga jouzu desu.",
            "vi": "Mẹ tôi hiền và nấu ăn giỏi."
          },
          {
            "en": "{姉|あね}は{結婚|けっこん}して、{大阪|おおさか}に{住|す}んでいます。",
            "ro": "Ane wa kekkon shite, Oosaka ni sunde imasu.",
            "vi": "Chị tôi đã lập gia đình và sống ở Osaka."
          },
          {
            "en": "うちに{猫|ねこ}が{二匹|にひき}います。",
            "ro": "Uchi ni neko ga nihiki imasu.",
            "vi": "Nhà tôi có hai con mèo."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đọc to 2 (Reading) — Quà sinh nhật",
        "intro": "Nhiều động từ cho–nhận: đọc rõ あげました／くれました／もらいました.",
        "paras": [
          {
            "text": "{先週|せんしゅう}は{私|わたし}の{誕生日|たんじょうび}でした。{両親|りょうしん}が{時計|とけい}をくれました。{友達|ともだち}に{素敵|すてき}なカードももらいました。{来月|らいげつ}は{母|はは}の{誕生日|たんじょうび}です。{私|わたし}は{母|はは}に{花|はな}をあげたいです。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{先週|せんしゅう}は{私|わたし}の{誕生日|たんじょうび}でした。",
            "ro": "Senshuu wa watashi no tanjoubi deshita.",
            "vi": "Tuần trước là sinh nhật tôi."
          },
          {
            "en": "{両親|りょうしん}が{時計|とけい}をくれました。",
            "ro": "Ryoushin ga tokei o kuremashita.",
            "vi": "Bố mẹ tặng tôi đồng hồ."
          },
          {
            "en": "{友達|ともだち}に{素敵|すてき}なカードももらいました。",
            "ro": "Tomodachi ni suteki na kaado mo moraimashita.",
            "vi": "Tôi cũng nhận được tấm thiệp đẹp của bạn."
          },
          {
            "en": "{来月|らいげつ}は{母|はは}の{誕生日|たんじょうび}です。",
            "ro": "Raigetsu wa haha no tanjoubi desu.",
            "vi": "Tháng sau là sinh nhật mẹ."
          },
          {
            "en": "{私|わたし}は{母|はは}に{花|はな}をあげたいです。",
            "ro": "Watashi wa haha ni hana o agetai desu.",
            "vi": "Tôi muốn tặng mẹ hoa."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b8-noi-ghi-am",
        "part": "1",
        "questions": [
          "ごかぞくは なんにんですか。",
          "きょうだいが いますか。",
          "おとうさんは なにを していますか。",
          "いま、どこに すんでいますか。",
          "だれと すんでいますか。",
          "おかあさんは どんな ひとですか。",
          "ともだちは どんな ひとですか。",
          "たんじょうびに なにを もらいましたか。",
          "おかあさんの たんじょうびに なにを あげたいですか。"
        ]
      },
      {
        "t": "h",
        "text": "Viết ngắn 3–5 câu — 4 đề có bài mẫu"
      },
      {
        "t": "p",
        "text": "**Đề 1.** Giới thiệu gia đình bạn (4 câu) — số người, nghề, nơi ở. Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}の{家族|かぞく}は{五人|ごにん}です。",
            "ro": "Watashi no kazoku wa gonin desu.",
            "vi": "Gia đình tôi có năm người."
          },
          {
            "en": "{父|ちち}は{会社員|かいしゃいん}で、{母|はは}は{先生|せんせい}です。",
            "ro": "Chichi wa kaishain de, haha wa sensei desu.",
            "vi": "Bố tôi là nhân viên công ty, mẹ tôi là giáo viên."
          },
          {
            "en": "{兄|あに}は{東京|とうきょう}に{住|す}んでいます。",
            "ro": "Ani wa Toukyou ni sunde imasu.",
            "vi": "Anh trai tôi sống ở Tokyo."
          },
          {
            "en": "{妹|いもうと}は{高校生|こうこうせい}で、{絵|え}が{上手|じょうず}です。",
            "ro": "Imouto wa koukousei de, e ga jouzu desu.",
            "vi": "Em gái tôi là học sinh cấp 3, vẽ giỏi."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 2.** Tả một người bạn (4 câu) — ngoại hình, tính cách, giỏi gì. Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}の{友達|ともだち}はキムさんです。",
            "ro": "Watashi no tomodachi wa Kimu-san desu.",
            "vi": "Bạn tôi là Kim."
          },
          {
            "en": "キムさんは{背|せ}が{高|たか}くて、{髪|かみ}が{長|なが}いです。",
            "ro": "Kimu-san wa se ga takakute, kami ga nagai desu.",
            "vi": "Kim cao và tóc dài."
          },
          {
            "en": "まじめで、{親切|しんせつ}な{人|ひと}です。",
            "ro": "Majime de, shinsetsu na hito desu.",
            "vi": "Bạn ấy là người chăm chỉ và tốt bụng."
          },
          {
            "en": "{英語|えいご}がとても{上手|じょうず}です。",
            "ro": "Eigo ga totemo jouzu desu.",
            "vi": "Tiếng Anh của bạn ấy rất giỏi."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 3.** Viết tin nhắn cảm ơn món quà sinh nhật (3–4 câu). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{山口|やまぐち}さんへ",
            "ro": "Yamaguchi-san e",
            "vi": "Gửi Yamaguchi,"
          },
          {
            "en": "{誕生日|たんじょうび}に{素敵|すてき}な{傘|かさ}をありがとうございました。",
            "ro": "Tanjoubi ni suteki na kasa o arigatou gozaimashita.",
            "vi": "Cảm ơn bạn vì chiếc ô đẹp tặng mình hôm sinh nhật."
          },
          {
            "en": "{白|しろ}くて、とてもかわいいです。",
            "ro": "Shirokute, totemo kawaii desu.",
            "vi": "Ô màu trắng, rất dễ thương."
          },
          {
            "en": "{毎日|まいにち}{使|つか}っています。",
            "ro": "Mainichi tsukatte imasu.",
            "vi": "Ngày nào mình cũng dùng."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 4.** Kể một món quà bạn đã nhận và một món bạn đã tặng (3 câu). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "クリスマスに{祖母|そぼ}が{靴下|くつした}をくれました。",
            "ro": "Kurisumasu ni sobo ga kutsushita o kuremashita.",
            "vi": "Giáng sinh bà tặng tôi đôi tất."
          },
          {
            "en": "{私|わたし}は{祖母|そぼ}にカードをあげました。",
            "ro": "Watashi wa sobo ni kaado o agemashita.",
            "vi": "Tôi tặng bà tấm thiệp."
          },
          {
            "en": "{来年|らいねん}は{祖母|そぼ}に{電話|でんわ}もしたいです。",
            "ro": "Rainen wa sobo ni denwa mo shitai desu.",
            "vi": "Năm sau tôi cũng muốn gọi điện cho bà."
          }
        ]
      },
      {
        "t": "note",
        "title": "Checklist trước khi nộp bài viết",
        "items": [
          "Người nhà MÌNH: 父・母・兄・姉・弟・妹 (không さん) · người nhà NGƯỜI KHÁC: お父さん・お母さん・お兄さん…",
          "Soát: nơi ở **に**, nơi làm **で**; người/con vật **います**; đặc điểm **が**; nối tính từ **くて／で**; người nhận là tôi → **くれました**.",
          "Mỗi câu kết thúc bằng です／ます／ました／たいです — không để câu cụt."
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-viet-chon",
        "title": "Chọn bài viết đúng và tự nhiên (6 câu)",
        "items": [
          {
            "q": "Viết: \"Bố tôi làm ở ngân hàng.\"　Câu nào đúng?",
            "options": [
              "{父|ちち}は{銀行|ぎんこう}で{働|はたら}いています。 (Chichi wa ginkou de hataraite imasu.)",
              "お{父|とう}さんは{銀行|ぎんこう}で{働|はたら}いています。 (Otousan wa ginkou de hataraite imasu.)",
              "{父|ちち}は{銀行|ぎんこう}に{働|はたら}いています。 (Chichi wa ginkou ni hataraite imasu.)",
              "{父|ちち}は{銀行|ぎんこう}を{働|はたら}きます。 (Chichi wa ginkou o hatarakimasu.)"
            ],
            "correct": 0,
            "why": "Bố mình 父 · nơi làm で · 働いています."
          },
          {
            "q": "Viết: \"Em gái tôi mắt to và dễ thương.\"",
            "options": [
              "{妹|いもうと}は{目|め}を{大|おお}きくて、かわいいです。 (Imouto wa me o ookikute, kawaii desu.)",
              "{妹|いもうと}は{目|め}が{大|おお}きくて、かわいいです。 (Imouto wa me ga ookikute, kawaii desu.)",
              "{妹|いもうと}さんは{目|め}が{大|おお}きくて、かわいいです。 (Imouto-san wa me ga ookikute, kawaii desu.)",
              "{妹|いもうと}は{目|め}が{大|おお}きいで、かわいいです。 (Imouto wa me ga ookii de, kawaii desu.)"
            ],
            "correct": 1,
            "why": "が + 大きくて; em mình 妹."
          },
          {
            "q": "Viết: \"Bạn tôi tặng tôi cuốn từ điển.\"",
            "options": [
              "{友達|ともだち}が{辞書|じしょ}をあげました。 (Tomodachi ga jisho o agemashita.)",
              "{友達|ともだち}に{辞書|じしょ}をくれました。 (Tomodachi ni jisho o kuremashita.)",
              "{友達|ともだち}が{辞書|じしょ}をくれました。 (Tomodachi ga jisho o kuremashita.)",
              "{友達|ともだち}は{私|わたし}に{辞書|じしょ}をもらいました。 (Tomodachi wa watashi ni jisho o moraimashita.)"
            ],
            "correct": 2,
            "why": "Người cho が + くれました."
          },
          {
            "q": "Viết: \"Anh tôi sống ở Kyoto với vợ.\"",
            "options": [
              "お{兄|にい}さんは{奥|おく}さんと{京都|きょうと}に{住|す}んでいます。 (Oniisan wa okusan to Kyouto ni sunde imasu.)",
              "{兄|あに}は{奥|おく}さんと{京都|きょうと}に{住|す}んでいます。 (Ani wa okusan to Kyouto ni sunde imasu.)",
              "{兄|あに}は{奥|おく}さんと{京都|きょうと}で{住|す}んでいます。 (Ani wa okusan to Kyouto de sunde imasu.)",
              "{兄|あに}は{妻|つま}と{京都|きょうと}に{住|す}んでいます。 (Ani wa tsuma to Kyouto ni sunde imasu.)"
            ],
            "correct": 1,
            "why": "Vợ của anh (người khác, không phải vợ mình) → 奥さん; 妻 = vợ CỦA MÌNH. Nơi ở に."
          },
          {
            "q": "Viết: \"Gia đình tôi có ba người.\"",
            "options": [
              "{家族|かぞく}は{三|みっ}つです。 (Kazoku wa mittsu desu.)",
              "{家族|かぞく}が{三人|さんにん}がいます。 (Kazoku ga sannin ga imasu.)",
              "{家族|かぞく}は{三人|さんにん}あります。 (Kazoku wa sannin arimasu.)",
              "{家族|かぞく}は{三人|さんにん}です。 (Kazoku wa sannin desu.)"
            ],
            "correct": 3,
            "why": "家族は ～人です."
          },
          {
            "q": "Viết: \"Tôi muốn tặng mẹ dây chuyền.\"",
            "options": [
              "お{母|かあ}さんにネックレスをもらいたいです。 (Okaasan ni nekkuresu o moraitai desu.)",
              "{母|はは}にネックレスをくれたいです。 (Haha ni nekkuresu o kuretai desu.)",
              "{母|はは}がネックレスをあげたいです。 (Haha ga nekkuresu o agetai desu.)",
              "{母|はは}にネックレスをあげたいです。 (Haha ni nekkuresu o agetai desu.)"
            ],
            "correct": 3,
            "why": "Người nhận に + あげたいです."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b8-viet-sx",
        "title": "Sắp xếp thành đoạn văn hoàn chỉnh (2 câu)",
        "items": [
          {
            "vi": "Sắp xếp thành đoạn giới thiệu: số người → nghề của bố → nơi ở của anh trai.",
            "chips": [
              "{私|わたし}の{家族|かぞく}は{四人|よにん}です。",
              "{兄|あに}は{東京|とうきょう}に{住|す}んでいます。",
              "{父|ちち}は{医者|いしゃ}で、{病院|びょういん}で{働|はたら}いています。"
            ],
            "answer": [
              "{私|わたし}の{家族|かぞく}は{四人|よにん}です。",
              "{父|ちち}は{医者|いしゃ}で、{病院|びょういん}で{働|はたら}いています。",
              "{兄|あに}は{東京|とうきょう}に{住|す}んでいます。"
            ],
            "ro": "Watashi no kazoku wa yonin desu. Chichi wa isha de, byouin de hataraite imasu. Ani wa Toukyou ni sunde imasu."
          },
          {
            "vi": "Sắp xếp thành tin nhắn cảm ơn: gọi tên → cảm ơn món quà → khen món quà.",
            "chips": [
              "とても{素敵|すてき}です。",
              "ネックレスをありがとうございました。",
              "アンナさんへ"
            ],
            "answer": [
              "アンナさんへ",
              "ネックレスをありがとうございました。",
              "とても{素敵|すてき}です。"
            ],
            "ro": "Anna-san e nekkuresu o arigatou gozaimashita. Totemo suteki desu."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b8-de-tong-hop",
    "kind": "review",
    "title": "Luyện thêm Bài 8 · Đề tổng hợp cuối bài — đúng khuôn kiểm tra của cô (65 câu · 50 phút)",
    "goal": "Làm thử một đề đủ các phần: từ vựng, chữ Hán (chữ nhiễu), ngữ pháp, gõ dạng đúng, đọc hiểu, dịch — bấm giờ 50 phút, tự chấm theo thang điểm và biết mình yếu phần nào.",
    "minutes": 50,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Bấm giờ 50 phút**, không mở bài ôn. Làm theo thứ tự I → VI; câu chưa chắc thì đánh dấu, quay lại sau.",
          "Phần II (chữ Hán) có **chữ na ná**: 父/交 · 母/毎 · 兄/元 · 姉/妹 · 目/日 · 耳/取 · 足/走. Phần IV gõ dạng nối tính từ và động từ cho–nhận.",
          "Hết giờ, nộp từng phần để xem đáp án + giải thích, ghi điểm vào bảng tự chấm."
        ]
      },
      {
        "t": "table",
        "head": [
          "Phần",
          "Dạng",
          "Số câu",
          "Điểm"
        ],
        "rows": [
          [
            "I",
            "Từ vựng — điền từ vào câu",
            "10",
            "10"
          ],
          [
            "II",
            "Chữ Hán — chọn cách viết / cách đọc (có chữ nhiễu)",
            "12",
            "12"
          ],
          [
            "III",
            "Ngữ pháp — trợ từ, thể, cho–nhận",
            "20",
            "20"
          ],
          [
            "IV",
            "Gõ dạng đúng (くて／で · あげます／くれます／もらいます · 住んで…)",
            "10",
            "10"
          ],
          [
            "V",
            "Đọc hiểu",
            "4",
            "4"
          ],
          [
            "VI",
            "Dịch Việt → Nhật (5) · Nhật → Việt (4)",
            "9",
            "9"
          ],
          [
            "Tổng",
            "",
            "65",
            "65"
          ]
        ],
        "caption": "Cấu trúc đề tổng hợp Bài 8"
      },
      {
        "t": "table",
        "head": [
          "Điểm của bạn",
          "Nhận xét",
          "Làm gì tiếp"
        ],
        "rows": [
          [
            "≥ 55 / 65 (≥ 85%)",
            "Sẵn sàng",
            "Sang Bài 9; thỉnh thoảng làm lại phần III"
          ],
          [
            "46–54 (70–85%)",
            "Khá, còn sơ hở",
            "Xem lại phần sai nhiều nhất; làm lại lesson tương ứng ở mức Vừa"
          ],
          [
            "< 46 (< 70%)",
            "Chưa chắc",
            "Làm lại 3 lesson ngữ pháp từ mức Dễ, rồi làm lại đề này sau 2 ngày"
          ]
        ],
        "caption": "Thang điểm tự chấm"
      },
      {
        "t": "h",
        "text": "I. Từ vựng (10 câu · 10 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b8-de-i",
        "title": "I. Từ vựng",
        "items": [
          {
            "q": "{私|わたし}の＿＿は{会社員|かいしゃいん}です。　〔Watashi no __ wa kaishain desu.〕　— Bố tôi là nhân viên công ty.",
            "options": [
              "ご{主人|しゅじん}",
              "お{父|とう}さん",
              "{父|ちち}",
              "{奥|おく}さん"
            ],
            "correct": 2,
            "why": "Bố MÌNH → 父. → **{私|わたし}の{父|ちち}は{会社員|かいしゃいん}です。** 〔Watashi no chichi wa kaishain desu.〕 — Bố tôi là nhân viên công ty."
          },
          {
            "q": "うさぎは＿＿が{長|なが}いです。　〔Usagi wa __ ga nagai desu.〕　— Con thỏ tai dài.",
            "options": [
              "{鼻|はな}",
              "{顔|かお}",
              "{口|くち}",
              "{耳|みみ}"
            ],
            "correct": 3,
            "why": "耳 = tai. → **うさぎは{耳|みみ}が{長|なが}いです。** 〔Usagi wa mimi ga nagai desu.〕 — Con thỏ tai dài."
          },
          {
            "q": "ダニエルさんは{背|せ}が＿＿です。　〔Danieru-san wa se ga __ desu.〕　— Daniel cao.",
            "options": [
              "{高|たか}い",
              "かわいい",
              "{大|おお}きい",
              "{長|なが}い"
            ],
            "correct": 0,
            "why": "Người cao → 背が高い. → **ダニエルさんは{背|せ}が{高|たか}いです。** 〔Danieru-san wa se ga takai desu.〕 — Daniel cao."
          },
          {
            "q": "{雨|あめ}ですから、＿＿を{持|も}って{行|い}きます。　〔Ame desu kara, __ o motte ikimasu.〕　— Vì trời mưa nên tôi mang ô đi.",
            "options": [
              "{靴下|くつした}",
              "{傘|かさ}",
              "ネックレス",
              "ノート"
            ],
            "correct": 1,
            "why": "傘 = ô. → **{雨|あめ}ですから、{傘|かさ}を{持|も}って{行|い}きます。** 〔Ame desu kara, kasa o motte ikimasu.〕 — Vì trời mưa nên tôi mang ô đi."
          },
          {
            "q": "{日本語|にほんご}の＿＿を{毎日|まいにち}{使|つか}います。　〔Nihongo no __ o mainichi tsukaimasu.〕　— Ngày nào tôi cũng dùng từ điển tiếng Nhật.",
            "options": [
              "{手紙|てがみ}",
              "メール",
              "{辞書|じしょ}",
              "{靴下|くつした}"
            ],
            "correct": 2,
            "why": "辞書 = từ điển. → **{日本語|にほんご}の{辞書|じしょ}を{毎日|まいにち}{使|つか}います。** 〔Nihongo no jisho o mainichi tsukaimasu.〕 — Ngày nào tôi cũng dùng từ điển tiếng Nhật."
          },
          {
            "q": "{山田|やまだ}さんの＿＿は{医者|いしゃ}です。　〔Yamada-san no __ wa isha desu.〕　— Chồng chị Yamada là bác sĩ.",
            "options": [
              "{夫|おっと}",
              "ご{主人|しゅじん}",
              "{父|ちち}",
              "{兄|あに}"
            ],
            "correct": 1,
            "why": "Chồng của người khác → ご主人. → **{山田|やまだ}さんのご{主人|しゅじん}は{医者|いしゃ}です。** 〔Yamada-san no goshujin wa isha desu.〕 — Chồng chị Yamada là bác sĩ."
          },
          {
            "q": "＿＿クリスマスですね。　〔__ Kurisumasu desu ne.〕　— Sắp Giáng sinh rồi nhỉ.",
            "options": [
              "よかった",
              "いちばん",
              "もうすぐ",
              "{何|なに}か"
            ],
            "correct": 2,
            "why": "もうすぐ = sắp. → **もうすぐクリスマスですね。** 〔Mousugu Kurisumasu desu ne.〕 — Sắp Giáng sinh rồi nhỉ."
          },
          {
            "q": "{会社|かいしゃ}の＿＿は{親切|しんせつ}で、いろいろ{教|おし}えます。　〔Kaisha no __ wa shinsetsu de, iroiro oshiemasu.〕　— Đàn anh ở công ty tốt bụng, chỉ bảo đủ thứ.",
            "options": [
              "{後輩|こうはい}",
              "{子|こ}ども",
              "{先輩|せんぱい}",
              "{経済|けいざい}"
            ],
            "correct": 2,
            "why": "Người vào trước, chỉ bảo mình → 先輩. → **{会社|かいしゃ}の{先輩|せんぱい}は{親切|しんせつ}で、いろいろ{教|おし}えます。** 〔Kaisha no senpai wa shinsetsu de, iroiro oshiemasu.〕 — Đàn anh ở công ty tốt bụng, chỉ bảo đủ thứ."
          },
          {
            "q": "{兄|あに}は{大学|だいがく}で＿＿を{勉強|べんきょう}しています。　〔Ani wa daigaku de __ o benkyou shite imasu.〕　— Anh tôi học kinh tế ở đại học.",
            "options": [
              "ペット",
              "{結婚式|けっこんしき}",
              "{経済|けいざい}",
              "{体|からだ}"
            ],
            "correct": 2,
            "why": "経済 = kinh tế. → **{兄|あに}は{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。** 〔Ani wa daigaku de keizai o benkyou shite imasu.〕 — Anh tôi học kinh tế ở đại học."
          },
          {
            "q": "A：{来月|らいげつ}、{姉|あね}が{結婚|けっこん}します。B：それは＿＿。　〔A: raigetsu, ane ga kekkon shimasu. B: sore wa __.〕　— A: Tháng sau chị tôi kết hôn. B: Thế thì tốt quá nhỉ.",
            "options": [
              "もうすぐです",
              "ざんねんですね",
              "よかったですね",
              "{素敵|すてき}です"
            ],
            "correct": 2,
            "why": "Nghe tin vui → よかったですね. → **A：{来月|らいげつ}、{姉|あね}が{結婚|けっこん}します。B：それはよかったですね。** 〔A: raigetsu, ane ga kekkon shimasu. B: sore wa yokatta desu ne.〕 — A: Tháng sau chị tôi kết hôn. B: Thế thì tốt quá nhỉ."
          }
        ]
      },
      {
        "t": "h",
        "text": "II. Chữ Hán (12 câu · 12 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b8-de-ii",
        "title": "II. Chữ Hán",
        "items": [
          {
            "q": "「ちち」 (bố của mình) là cách viết nào?",
            "options": [
              "交",
              "夫",
              "文",
              "父"
            ],
            "correct": 3,
            "why": "父 (phụ)."
          },
          {
            "q": "「はは」 (mẹ của mình) là cách viết nào?",
            "options": [
              "毎",
              "女",
              "海",
              "母"
            ],
            "correct": 3,
            "why": "母 (mẫu); 毎 có thêm nét trên."
          },
          {
            "q": "「きょうだい」 là cách viết nào?",
            "options": [
              "元弟",
              "兄弟",
              "見弟",
              "兄第"
            ],
            "correct": 1,
            "why": "兄 + 弟."
          },
          {
            "q": "「あね」 là cách viết nào?",
            "options": [
              "始",
              "妹",
              "姉",
              "市"
            ],
            "correct": 2,
            "why": "姉 = 女 + 市."
          },
          {
            "q": "「いもうと」 là cách viết nào?",
            "options": [
              "味",
              "未",
              "妹",
              "姉"
            ],
            "correct": 2,
            "why": "妹 = 女 + 未."
          },
          {
            "q": "「みみ」 là cách viết nào?",
            "options": [
              "聞",
              "取",
              "目",
              "耳"
            ],
            "correct": 3,
            "why": "耳 = tai."
          },
          {
            "q": "「あし」 là cách viết nào?",
            "options": [
              "足",
              "走",
              "是",
              "定"
            ],
            "correct": 0,
            "why": "足 = chân."
          },
          {
            "q": "「め」 là cách viết nào?",
            "options": [
              "自",
              "日",
              "白",
              "目"
            ],
            "correct": 3,
            "why": "目 có hai nét ngang bên trong."
          },
          {
            "q": "「お父さん」 đọc là gì?",
            "options": [
              "おちちさん",
              "おとさん",
              "おふさん",
              "おとうさん"
            ],
            "correct": 3,
            "why": "đọc đặc biệt とう."
          },
          {
            "q": "「祖母」 đọc là gì?",
            "options": [
              "そも",
              "そはは",
              "そぼ",
              "そうぼ"
            ],
            "correct": 2,
            "why": "母 đọc On ぼ."
          },
          {
            "q": "「長い」 đọc là gì?",
            "options": [
              "ながい",
              "なかい",
              "ちょうい",
              "たかい"
            ],
            "correct": 0,
            "why": "Kun なが(い)."
          },
          {
            "q": "「社長」 đọc là gì?",
            "options": [
              "かいちょう",
              "しゃなが",
              "しゃちょ",
              "しゃちょう"
            ],
            "correct": 3,
            "why": "長 đọc On ちょう."
          }
        ]
      },
      {
        "t": "h",
        "text": "III. Ngữ pháp (20 câu · 20 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b8-de-iii",
        "title": "III. Ngữ pháp",
        "items": [
          {
            "q": "{私|わたし}は{横浜|よこはま}＿＿{住|す}んでいます。　〔Watashi wa Yokohama __ sunde imasu.〕　— Tôi sống ở Yokohama.",
            "options": [
              "が",
              "に",
              "で",
              "を"
            ],
            "correct": 1,
            "why": "Nơi ở → に. → **{私|わたし}は{横浜|よこはま}に{住|す}んでいます。** 〔Watashi wa Yokohama ni sunde imasu.〕 — Tôi sống ở Yokohama."
          },
          {
            "q": "{姉|あね}はデパート＿＿{働|はたら}いています。　〔Ane wa depaato __ hataraite imasu.〕　— Chị tôi làm ở trung tâm thương mại.",
            "options": [
              "で",
              "へ",
              "を",
              "に"
            ],
            "correct": 0,
            "why": "Nơi làm việc → で. → **{姉|あね}はデパートで{働|はたら}いています。** 〔Ane wa depaato de hataraite imasu.〕 — Chị tôi làm ở trung tâm thương mại."
          },
          {
            "q": "{私|わたし}は{妹|いもうと}が{二人|ふたり}＿＿。　〔Watashi wa imouto ga futari __.〕　— Tôi có hai em gái.",
            "options": [
              "あります",
              "います",
              "します",
              "です"
            ],
            "correct": 1,
            "why": "Người → います. → **{私|わたし}は{妹|いもうと}が{二人|ふたり}います。** 〔Watashi wa imouto ga futari imasu.〕 — Tôi có hai em gái."
          },
          {
            "q": "{兄|あに}と{二人|ふたり}＿＿{住|す}んでいます。　〔Ani to futari __ sunde imasu.〕　— Tôi sống hai người với anh trai.",
            "options": [
              "と",
              "が",
              "に",
              "で"
            ],
            "correct": 3,
            "why": "Tổng số người + で. → **{兄|あに}と{二人|ふたり}で{住|す}んでいます。** 〔Ani to futari de sunde imasu.〕 — Tôi sống hai người với anh trai."
          },
          {
            "q": "{山田|やまだ}さんは＿＿。お{子|こ}さんが{一人|ひとり}います。　〔Yamada-san wa __. Okosan ga hitori imasu.〕　— Anh Yamada đã lập gia đình. Anh có một con.",
            "options": [
              "{結婚|けっこん}でした",
              "{結婚|けっこん}します",
              "{結婚|けっこん}しましょう",
              "{結婚|けっこん}しています"
            ],
            "correct": 3,
            "why": "Trạng thái → 結婚しています. → **{山田|やまだ}さんは{結婚|けっこん}しています。お{子|こ}さんが{一人|ひとり}います。** 〔Yamada-san wa kekkon shite imasu. Okosan ga hitori imasu.〕 — Anh Yamada đã lập gia đình. Anh có một con."
          },
          {
            "q": "マルコさんは{背|せ}＿＿{高|たか}いです。　〔Maruko-san wa se __ takai desu.〕　— Marco cao.",
            "options": [
              "を",
              "に",
              "で",
              "が"
            ],
            "correct": 3,
            "why": "Đặc điểm + が. → **マルコさんは{背|せ}が{高|たか}いです。** 〔Maruko-san wa se ga takai desu.〕 — Marco cao."
          },
          {
            "q": "アンナさんはテニスが＿＿。　〔Anna-san wa tenisu ga __.〕　— Anna chơi tennis giỏi.",
            "options": [
              "{上手|じょうず}なです",
              "{上手|じょうず}いです",
              "{上手|じょうず}です",
              "{上手|じょうず}のです"
            ],
            "correct": 2,
            "why": "ナA + です. → **アンナさんはテニスが{上手|じょうず}です。** 〔Anna-san wa tenisu ga jouzu desu.〕 — Anna chơi tennis giỏi."
          },
          {
            "q": "{目|め}が＿＿、{髪|かみ}が{短|みじか}いです。　〔Me ga __, kami ga mijikai desu.〕　— Mắt to và tóc ngắn.",
            "options": [
              "{大|おお}きい",
              "{大|おお}きくて",
              "{大|おお}きいで",
              "{大|おお}きな"
            ],
            "correct": 1,
            "why": "イA → くて. → **{目|め}が{大|おお}きくて、{髪|かみ}が{短|みじか}いです。** 〔Me ga ookikute, kami ga mijikai desu.〕 — Mắt to và tóc ngắn."
          },
          {
            "q": "{兄|あに}は{頭|あたま}が＿＿、まじめです。　〔Ani wa atama ga __, majime desu.〕　— Anh tôi thông minh và chăm chỉ.",
            "options": [
              "よいで",
              "よくて",
              "いくて",
              "いいで"
            ],
            "correct": 1,
            "why": "いい → よくて. → **{兄|あに}は{頭|あたま}がよくて、まじめです。** 〔Ani wa atama ga yokute, majime desu.〕 — Anh tôi thông minh và chăm chỉ."
          },
          {
            "q": "{田中|たなか}さんは{親切|しんせつ}＿＿、おもしろい{人|ひと}です。　〔Tanaka-san wa shinsetsu __, omoshiroi hito desu.〕　— Anh Tanaka tốt bụng và vui tính.",
            "options": [
              "と",
              "で",
              "くて",
              "な"
            ],
            "correct": 1,
            "why": "ナA → で. → **{田中|たなか}さんは{親切|しんせつ}で、おもしろい{人|ひと}です。** 〔Tanaka-san wa shinsetsu de, omoshiroi hito desu.〕 — Anh Tanaka tốt bụng và vui tính."
          },
          {
            "q": "{弟|おとうと}は{大学生|だいがくせい}＿＿、{東京|とうきょう}に{住|す}んでいます。　〔Otouto wa daigakusei __, Toukyou ni sunde imasu.〕　— Em trai tôi là sinh viên, sống ở Tokyo.",
            "options": [
              "くて",
              "で",
              "です",
              "の"
            ],
            "correct": 1,
            "why": "N → で. → **{弟|おとうと}は{大学生|だいがくせい}で、{東京|とうきょう}に{住|す}んでいます。** 〔Otouto wa daigakusei de, Toukyou ni sunde imasu.〕 — Em trai tôi là sinh viên, sống ở Tokyo."
          },
          {
            "q": "サッカーが{上手|じょうず}＿＿{人|ひと}は{誰|だれ}ですか。　〔Sakkaa ga jouzu __ hito wa dare desu ka.〕　— Người đá bóng giỏi là ai?",
            "options": [
              "で",
              "が",
              "の",
              "な"
            ],
            "correct": 3,
            "why": "ナA + な + N. → **サッカーが{上手|じょうず}な{人|ひと}は{誰|だれ}ですか。** 〔Sakkaa ga jouzu na hito wa dare desu ka.〕 — Người đá bóng giỏi là ai?"
          },
          {
            "q": "{私|わたし}は{母|はは}＿＿{花|はな}をあげました。　〔Watashi wa haha __ hana o agemashita.〕　— Tôi đã tặng mẹ hoa.",
            "options": [
              "に",
              "が",
              "を",
              "で"
            ],
            "correct": 0,
            "why": "Người nhận + に. → **{私|わたし}は{母|はは}に{花|はな}をあげました。** 〔Watashi wa haha ni hana o agemashita.〕 — Tôi đã tặng mẹ hoa."
          },
          {
            "q": "{友達|ともだち}が{私|わたし}に{本|ほん}を＿＿。　〔Tomodachi ga watashi ni hon o __.〕　— Bạn đã tặng tôi quyển sách.",
            "options": [
              "あげました",
              "いました",
              "もらいました",
              "くれました"
            ],
            "correct": 3,
            "why": "→ tôi: くれました. → **{友達|ともだち}が{私|わたし}に{本|ほん}をくれました。** 〔Tomodachi ga watashi ni hon o kuremashita.〕 — Bạn đã tặng tôi quyển sách."
          },
          {
            "q": "{私|わたし}は{姉|あね}＿＿カメラをもらいました。　〔Watashi wa ane __ kamera o moraimashita.〕　— Tôi đã nhận máy ảnh của chị gái.",
            "options": [
              "を",
              "へ",
              "に",
              "が"
            ],
            "correct": 2,
            "why": "もらいます: người cho + に. → **{私|わたし}は{姉|あね}にカメラをもらいました。** 〔Watashi wa ane ni kamera o moraimashita.〕 — Tôi đã nhận máy ảnh của chị gái."
          },
          {
            "q": "{学校|がっこう}＿＿{辞書|じしょ}をもらいました。　〔Gakkou __ jisho o moraimashita.〕　— Tôi đã nhận từ điển từ nhà trường.",
            "options": [
              "で",
              "が",
              "から",
              "に"
            ],
            "correct": 2,
            "why": "Tổ chức → から. → **{学校|がっこう}から{辞書|じしょ}をもらいました。** 〔Gakkou kara jisho o moraimashita.〕 — Tôi đã nhận từ điển từ nhà trường."
          },
          {
            "q": "カルロスさんはパクさんに{花|はな}を＿＿。　〔Karurosu-san wa Paku-san ni hana o __.〕　— Carlos đã tặng hoa cho Park.",
            "options": [
              "いました",
              "もらいました",
              "くれました",
              "あげました"
            ],
            "correct": 3,
            "why": "Người khác → người khác: あげました. → **カルロスさんはパクさんに{花|はな}をあげました。** 〔Karurosu-san wa Paku-san ni hana o agemashita.〕 — Carlos đã tặng hoa cho Park."
          },
          {
            "q": "その{時計|とけい}、{誰|だれ}＿＿くれましたか。　〔Sono tokei, dare __ kuremashita ka.〕　— Cái đồng hồ đó ai tặng bạn vậy?",
            "options": [
              "で",
              "が",
              "を",
              "に"
            ],
            "correct": 1,
            "why": "くれます: người cho + が. → **その{時計|とけい}、{誰|だれ}がくれましたか。** 〔Sono tokei, dare ga kuremashita ka.〕 — Cái đồng hồ đó ai tặng bạn vậy?"
          },
          {
            "q": "{誕生日|たんじょうび}＿＿{父|ちち}に{時計|とけい}をもらいました。　〔Tanjoubi __ chichi ni tokei o moraimashita.〕　— Sinh nhật tôi nhận đồng hồ của bố.",
            "options": [
              "が",
              "に",
              "で",
              "を"
            ],
            "correct": 1,
            "why": "Dịp + に. → **{誕生日|たんじょうび}に{父|ちち}に{時計|とけい}をもらいました。** 〔Tanjoubi ni chichi ni tokei o moraimashita.〕 — Sinh nhật tôi nhận đồng hồ của bố."
          },
          {
            "q": "{兄弟|きょうだい}が＿＿いますか。——{四人|よにん}います。　〔Kyoudai ga __ imasu ka. — Yonin imasu.〕　— Bạn có mấy anh chị em? — Bốn người.",
            "options": [
              "どこ",
              "{何人|なんにん}",
              "いくつ",
              "{何匹|なんびき}"
            ],
            "correct": 1,
            "why": "Hỏi số người → 何人. → **{兄弟|きょうだい}が{何人|なんにん}いますか。——{四人|よにん}います。** 〔Kyoudai ga nannin imasu ka. — Yonin imasu.〕 — Bạn có mấy anh chị em? — Bốn người."
          }
        ]
      },
      {
        "t": "h",
        "text": "IV. Gõ dạng đúng (10 câu · 10 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b8-de-iv",
        "title": "IV. Gõ dạng đúng của từ trong gợi ý",
        "kind": "fill",
        "grammar": "イA: い → くて (いい → よくて) · ナA／N: で · thể て của động từ · あげます／くれます／もらいます",
        "items": [
          {
            "q": "{姉|あね}は{髪|かみ}が＿＿、{目|め}が{大|おお}きいです。　〔Ane wa kami ga __, me ga ookii desu.〕",
            "answers": [
              "長くて",
              "ながくて"
            ],
            "hint": "長い"
          },
          {
            "q": "{父|ちち}は＿＿、{優|やさ}しいです。　〔Chichi wa __, yasashii desu.〕",
            "answers": [
              "元気で",
              "げんきで"
            ],
            "hint": "元気（な）"
          },
          {
            "q": "{兄|あに}は＿＿、{背|せ}が{高|たか}いです。　〔Ani wa __, se ga takai desu.〕",
            "answers": [
              "かっこよくて"
            ],
            "hint": "かっこいい"
          },
          {
            "q": "{母|はは}は{先生|せんせい}＿＿、{料理|りょうり}も{上手|じょうず}です。　〔Haha wa sensei __, ryouri mo jouzu desu.〕",
            "answers": [
              "で"
            ],
            "hint": "N で"
          },
          {
            "q": "{私|わたし}はハノイに＿＿います。　〔Watashi wa Hanoi ni __ imasu.〕",
            "answers": [
              "住んで",
              "すんで"
            ],
            "hint": "住みます (thể て)"
          },
          {
            "q": "{姉|あね}は{病院|びょういん}で＿＿います。　〔Ane wa byouin de __ imasu.〕",
            "answers": [
              "働いて",
              "はたらいて"
            ],
            "hint": "働きます (thể て)"
          },
          {
            "q": "{友達|ともだち}が{私|わたし}にカードを＿＿。　〔Tomodachi ga watashi ni kaado o __.〕",
            "answers": [
              "くれました"
            ],
            "hint": "cho tôi (quá khứ)"
          },
          {
            "q": "{私|わたし}は{先輩|せんぱい}に{辞書|じしょ}を＿＿。　〔Watashi wa senpai ni jisho o __.〕",
            "answers": [
              "もらいました"
            ],
            "hint": "tôi nhận (quá khứ)"
          },
          {
            "q": "{私|わたし}は{祖母|そぼ}に{手紙|てがみ}を＿＿。　〔Watashi wa sobo ni tegami o __.〕",
            "answers": [
              "あげました"
            ],
            "hint": "tôi cho/tặng (quá khứ) — hoặc 送りました"
          },
          {
            "q": "{妹|いもうと}は{結婚|けっこん}＿＿いません。　〔Imouto wa kekkon __ imasen.〕",
            "answers": [
              "して"
            ],
            "hint": "します (thể て)"
          }
        ]
      },
      {
        "t": "h",
        "text": "V. Đọc hiểu (4 câu · 4 điểm)"
      },
      {
        "t": "passage",
        "title": "V. Đọc hiểu — Bạn cùng phòng của tôi",
        "intro": "Đọc đoạn rồi trả lời 4 câu.",
        "paras": [
          {
            "text": "{私|わたし}は{大学|だいがく}の{近|ちか}くに{住|す}んでいます。ルームメイトのキムさんと{二人|ふたり}で{住|す}んでいます。キムさんは{韓国人|かんこくじん}で、{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。{背|せ}が{高|たか}くて、{頭|あたま}がいいです。{先週|せんしゅう}、キムさんは{私|わたし}に{韓国|かんこく}のチョコレートをくれました。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}は{大学|だいがく}の{近|ちか}くに{住|す}んでいます。",
            "ro": "Watashi wa daigaku no chikaku ni sunde imasu.",
            "vi": "Tôi sống gần trường đại học."
          },
          {
            "en": "ルームメイトのキムさんと{二人|ふたり}で{住|す}んでいます。",
            "ro": "Ruumumeito no Kimu-san to futari de sunde imasu.",
            "vi": "Tôi sống hai người với bạn cùng phòng là Kim."
          },
          {
            "en": "キムさんは{韓国人|かんこくじん}で、{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。",
            "ro": "Kimu-san wa Kankokujin de, daigaku de keizai o benkyou shite imasu.",
            "vi": "Kim là người Hàn Quốc, học kinh tế ở đại học."
          },
          {
            "en": "{背|せ}が{高|たか}くて、{頭|あたま}がいいです。",
            "ro": "Se ga takakute, atama ga ii desu.",
            "vi": "Kim cao và thông minh."
          },
          {
            "en": "{先週|せんしゅう}、キムさんは{私|わたし}に{韓国|かんこく}のチョコレートをくれました。",
            "ro": "Senshuu, Kimu-san wa watashi ni Kankoku no chokoreeto o kuremashita.",
            "vi": "Tuần trước Kim tặng tôi sô-cô-la Hàn Quốc."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-de-v",
        "title": "V. Câu hỏi đọc hiểu",
        "items": [
          {
            "q": "Tác giả sống với ai?",
            "options": [
              "Với Kim, hai người",
              "Với Kim và một bạn khác",
              "Một mình",
              "Với gia đình"
            ],
            "correct": 0,
            "why": "キムさんと 二人で 住んでいます."
          },
          {
            "q": "Kim học gì?",
            "options": [
              "Kinh tế",
              "Y khoa",
              "Tiếng Nhật",
              "Tiếng Hàn"
            ],
            "correct": 0,
            "why": "経済を 勉強しています."
          },
          {
            "q": "Kim là người thế nào?",
            "options": [
              "Thấp và vui tính",
              "Thông minh nhưng không cao",
              "Cao và tốt bụng",
              "Cao và thông minh"
            ],
            "correct": 3,
            "why": "背が 高くて、頭が いい."
          },
          {
            "q": "Tuần trước chuyện gì xảy ra?",
            "options": [
              "Kim tặng tác giả sô-cô-la Hàn Quốc",
              "Kim về Hàn Quốc",
              "Tác giả tặng Kim sô-cô-la",
              "Tác giả nhận thư của Kim"
            ],
            "correct": 0,
            "why": "キムさんは 私に チョコレートを くれました."
          }
        ]
      },
      {
        "t": "h",
        "text": "VI. Dịch (9 câu · 9 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b8-de-vi-a",
        "title": "VI-a. Dịch Việt → Nhật",
        "kind": "translate",
        "grammar": "ポイント 72–80",
        "items": [
          {
            "q": "Bố mẹ tôi sống ở Hà Nội.",
            "answers": [
              "両親はハノイに住んでいます。",
              "両親はハノイにすんでいます。",
              "りょうしんはハノイに住んでいます。",
              "りょうしんはハノイにすんでいます。",
              "私の両親はハノイに住んでいます。",
              "私の両親はハノイにすんでいます。",
              "私のりょうしんはハノイに住んでいます。",
              "私のりょうしんはハノイにすんでいます。",
              "わたしの両親はハノイに住んでいます。",
              "わたしの両親はハノイにすんでいます。",
              "わたしのりょうしんはハノイに住んでいます。",
              "わたしのりょうしんはハノイにすんでいます。"
            ],
            "hint": "N に 住んでいます"
          },
          {
            "q": "Tôi có một anh trai.",
            "answers": [
              "兄が一人います。",
              "兄がひとりいます。",
              "あにが一人います。",
              "あにがひとりいます。",
              "私は兄が一人います。",
              "私は兄がひとりいます。",
              "私はあにが一人います。",
              "私はあにがひとりいます。",
              "わたしは兄が一人います。",
              "わたしは兄がひとりいます。",
              "わたしはあにが一人います。",
              "わたしはあにがひとりいます。",
              "兄が1人います。",
              "あにが1人います。"
            ],
            "hint": "N が ～人 います"
          },
          {
            "q": "Chị tôi tóc dài và hiền.",
            "answers": [
              "姉は髪が長くて、優しいです。",
              "姉は髪が長くて、やさしいです。",
              "姉は髪がながくて、優しいです。",
              "姉は髪がながくて、やさしいです。",
              "姉はかみが長くて、優しいです。",
              "姉はかみが長くて、やさしいです。",
              "姉はかみがながくて、優しいです。",
              "姉はかみがながくて、やさしいです。",
              "あねは髪が長くて、優しいです。",
              "あねは髪が長くて、やさしいです。",
              "あねは髪がながくて、優しいです。",
              "あねは髪がながくて、やさしいです。",
              "あねはかみが長くて、優しいです。",
              "あねはかみが長くて、やさしいです。",
              "あねはかみがながくて、優しいです。",
              "あねはかみがながくて、やさしいです。"
            ],
            "hint": "N が A くて"
          },
          {
            "q": "Mary đã tặng tôi sô-cô-la.",
            "answers": [
              "メアリーさんがチョコレートをくれました。",
              "メアリーさんが私にチョコレートをくれました。",
              "メアリーさんがわたしにチョコレートをくれました。",
              "メアリーさんは私にチョコレートをくれました。",
              "メアリーさんはわたしにチョコレートをくれました。"
            ],
            "hint": "N が くれました"
          },
          {
            "q": "Tôi đã nhận thiệp của đàn em.",
            "answers": [
              "後輩にカードをもらいました。",
              "こうはいにカードをもらいました。",
              "私は後輩にカードをもらいました。",
              "私はこうはいにカードをもらいました。",
              "わたしは後輩にカードをもらいました。",
              "わたしはこうはいにカードをもらいました。",
              "後輩からカードをもらいました。",
              "こうはいからカードをもらいました。"
            ],
            "hint": "N に もらいました"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b8-de-vi-b",
        "title": "VI-b. Dịch Nhật → Việt",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {兄|あに}は{結婚|けっこん}して、{大阪|おおさか}に{住|す}んでいます。　〔Ani wa kekkon shite, Oosaka ni sunde imasu.〕",
            "options": [
              "Anh tôi sẽ kết hôn ở Osaka.",
              "Anh tôi đã lập gia đình và sống ở Osaka.",
              "Anh tôi sống một mình ở Osaka.",
              "Anh bạn đã kết hôn và sống ở Osaka."
            ],
            "correct": 1,
            "why": "結婚して = đã kết hôn và…; 住んでいます = đang sống."
          },
          {
            "q": "Câu này nghĩa là gì? {妹|いもうと}さんは{歌|うた}が{上手|じょうず}ですね。　〔Imouto-san wa uta ga jouzu desu ne.〕",
            "options": [
              "Em gái bạn hát hay nhỉ.",
              "Em gái bạn thích hát nhỉ.",
              "Em gái tôi hát hay lắm.",
              "Em gái bạn hát dở nhỉ."
            ],
            "correct": 0,
            "why": "妹さん = em gái người khác; 上手 = giỏi."
          },
          {
            "q": "Câu này nghĩa là gì? {祖母|そぼ}が{妹|いもうと}にネックレスをくれました。　〔Sobo ga imouto ni nekkuresu o kuremashita.〕",
            "options": [
              "Tôi đã tặng bà sợi dây chuyền.",
              "Bà đã tặng em gái tôi sợi dây chuyền.",
              "Bà đã nhận sợi dây chuyền của em gái tôi.",
              "Em gái tôi đã tặng bà sợi dây chuyền."
            ],
            "correct": 1,
            "why": "くれました: người cho (bà) → người nhà tôi."
          },
          {
            "q": "Câu này nghĩa là gì? {友達|ともだち}と{三人|さんにん}で{旅行|りょこう}に{行|い}きました。　〔Tomodachi to sannin de ryokou ni ikimashita.〕",
            "options": [
              "Tôi đã đi du lịch với ba người bạn.",
              "Ba người bạn đã đi du lịch.",
              "Tôi muốn đi du lịch với bạn bè.",
              "Tôi đã đi du lịch cùng bạn bè, tổng cộng ba người."
            ],
            "correct": 3,
            "why": "三人で = tổng cộng 3 người (tính cả mình)."
          }
        ]
      }
    ]
  }
];

export const LUYEN_THEM_B9: Lesson[] = [
  {
    "id": "lt-b9-tu-vung",
    "kind": "homework",
    "title": "Luyện thêm Bài 9 · Từ vựng — nhận mặt → điền câu → dịch (3 mức, ~219 câu)",
    "goal": "Nhớ chắc 61/61 từ của Bài 9 (sở thích, từ đếm & khoảng thời gian, tần suất, lớp học/CLB, thủ tục, đi xe): nhìn từ biết nghĩa, nhớ từ từ nghĩa, điền đúng vào câu, dịch Việt → Nhật.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đi **🟢 → 🟡 → 🔴**. Mức Dễ làm 2 lượt (Nhật → Việt, Việt → Nhật): hết 61 từ mới sang mức Vừa. Sai từ nào, **đọc to 3 lần** (romaji trong câu hỏi) rồi làm lại cả khối sau 10 phút.",
          "Học **động từ kèm trợ từ + thể từ điển**: バス**に**乗る · バス**を**降りる · クラブ**に**入る · イベント**に**参加する · 教室**に**申し込む · スキー**が**できる.",
          "Cặp dễ lẫn: **書きます (viết) / 描きます (vẽ)** · **乗ります / 降ります** · **～か月 (mấy tháng) / ～月 (tháng mấy)** · **杯 (cốc) / 本 (chai, cây) / 冊 (quyển) / 回 (lần)** · **あまり / 全然** (đều cần ～ません)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhìn từ → biết nghĩa; nghe nghĩa → nhớ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-jv1",
        "title": "Nhật → Việt — nhóm A–C: sở thích · khoảng thời gian & từ đếm · động từ chủ đề 1 (23 câu)",
        "items": [
          {
            "q": "「アクション」 〔akushon〕 nghĩa là gì?",
            "options": [
              "hành động (phim hành động)",
              "~ ngày (khoảng thời gian)",
              "tem thư",
              "~ tháng (khoảng thời gian)"
            ],
            "correct": 0,
            "why": "**アクション** (akushon) = hành động (phim hành động) — アクション映画 = phim hành động"
          },
          {
            "q": "「（お）{菓子|かし}」 〔(o)kashi〕 nghĩa là gì?",
            "options": [
              "tiểu thuyết",
              "bánh kẹo",
              "lái (xe)",
              "~ quyển (sách, vở)"
            ],
            "correct": 1,
            "why": "**（お）{菓子|かし}** ((o)kashi) = bánh kẹo"
          },
          {
            "q": "「{切手|きって}」 〔kitte〕 nghĩa là gì?",
            "options": [
              "tem thư",
              "nhạc cổ điển",
              "câu cá",
              "vẽ (tranh)"
            ],
            "correct": 0,
            "why": "**{切手|きって}** (kitte) = tem thư"
          },
          {
            "q": "「クラシック」 〔kurashikku〕 nghĩa là gì?",
            "options": [
              "nhạc cổ điển",
              "~ chai, cây (vật dài)",
              "tiểu thuyết",
              "~ lần"
            ],
            "correct": 0,
            "why": "**クラシック** (kurashikku) = nhạc cổ điển"
          },
          {
            "q": "「ポップス」 〔poppusu〕 nghĩa là gì?",
            "options": [
              "nhạc pop",
              "câu cá",
              "truyện tranh",
              "phim truyền hình (phim bộ)"
            ],
            "correct": 0,
            "why": "**ポップス** (poppusu) = nhạc pop"
          },
          {
            "q": "「{小説|しょうせつ}」 〔shousetsu〕 nghĩa là gì?",
            "options": [
              "hành động (phim hành động)",
              "nhạc pop",
              "tiểu thuyết",
              "lái (xe)"
            ],
            "correct": 2,
            "why": "**{小説|しょうせつ}** (shousetsu) = tiểu thuyết"
          },
          {
            "q": "「{漫画|まんが}」 〔manga〕 nghĩa là gì?",
            "options": [
              "~ cốc, ly, bát",
              "~ tuần (khoảng thời gian)",
              "~ quyển (sách, vở)",
              "truyện tranh"
            ],
            "correct": 3,
            "why": "**{漫画|まんが}** (manga) = truyện tranh"
          },
          {
            "q": "「{釣|つ}り」 〔tsuri〕 nghĩa là gì?",
            "options": [
              "câu cá",
              "~ tháng (khoảng thời gian)",
              "món ~, ẩm thực ~",
              "~ cốc, ly, bát"
            ],
            "correct": 0,
            "why": "**{釣|つ}り** (tsuri) = câu cá — 釣りをします = đi câu"
          },
          {
            "q": "「ドラマ」 〔dorama〕 nghĩa là gì?",
            "options": [
              "tiểu thuyết",
              "nhạc cổ điển",
              "sưu tầm, thu thập",
              "phim truyền hình (phim bộ)"
            ],
            "correct": 3,
            "why": "**ドラマ** (dorama) = phim truyền hình (phim bộ)"
          },
          {
            "q": "「プール」 〔puuru〕 nghĩa là gì?",
            "options": [
              "tiểu thuyết",
              "~ lần",
              "sưu tầm, thu thập",
              "bể bơi"
            ],
            "correct": 3,
            "why": "**プール** (puuru) = bể bơi"
          },
          {
            "q": "「～{料理|りょうり}」 〔~ryouri〕 nghĩa là gì?",
            "options": [
              "nhạc pop",
              "~ tuần (khoảng thời gian)",
              "câu cá",
              "món ~, ẩm thực ~"
            ],
            "correct": 3,
            "why": "**～{料理|りょうり}** (~ryouri) = món ~, ẩm thực ~ — イタリア料理 = món Ý"
          },
          {
            "q": "「～{日|にち}」 〔~nichi〕 nghĩa là gì?",
            "options": [
              "~ quyển (sách, vở)",
              "câu cá",
              "~ ngày (khoảng thời gian)",
              "~ lần"
            ],
            "correct": 2,
            "why": "**～{日|にち}** (~nichi) = ~ ngày (khoảng thời gian) — 1日 いちにち, 2日 ふつか, 3日 みっか"
          },
          {
            "q": "「～{週間|しゅうかん}」 〔~shuukan〕 nghĩa là gì?",
            "options": [
              "~ tuần (khoảng thời gian)",
              "lái (xe)",
              "sưu tầm, thu thập",
              "tem thư"
            ],
            "correct": 0,
            "why": "**～{週間|しゅうかん}** (~shuukan) = ~ tuần (khoảng thời gian) — 1週間 いっしゅうかん"
          },
          {
            "q": "「～か{月|げつ}」 〔~kagetsu〕 nghĩa là gì?",
            "options": [
              "câu cá",
              "lái (xe)",
              "~ tháng (khoảng thời gian)",
              "món ~, ẩm thực ~"
            ],
            "correct": 2,
            "why": "**～か{月|げつ}** (~kagetsu) = ~ tháng (khoảng thời gian) — 1か月 いっかげつ; khác 1月 いちがつ = tháng Một"
          },
          {
            "q": "「～{年|ねん}」 〔~nen〕 nghĩa là gì?",
            "options": [
              "~ năm",
              "tem thư",
              "sưu tầm, thu thập",
              "truyện tranh"
            ],
            "correct": 0,
            "why": "**～{年|ねん}** (~nen) = ~ năm — 4年 よねん"
          },
          {
            "q": "「～{回|かい}」 〔~kai〕 nghĩa là gì?",
            "options": [
              "~ lần",
              "truyện tranh",
              "phim truyền hình (phim bộ)",
              "~ ngày (khoảng thời gian)"
            ],
            "correct": 0,
            "why": "**～{回|かい}** (~kai) = ~ lần — 1回 いっかい, 6回 ろっかい, 10回 じゅっかい"
          },
          {
            "q": "「～{冊|さつ}」 〔~satsu〕 nghĩa là gì?",
            "options": [
              "tiểu thuyết",
              "~ quyển (sách, vở)",
              "~ cốc, ly, bát",
              "tem thư"
            ],
            "correct": 1,
            "why": "**～{冊|さつ}** (~satsu) = ~ quyển (sách, vở) — 1冊 いっさつ"
          },
          {
            "q": "「～{杯|はい}」 〔~hai〕 nghĩa là gì?",
            "options": [
              "truyện tranh",
              "vẽ (tranh)",
              "~ cốc, ly, bát",
              "~ chai, cây (vật dài)"
            ],
            "correct": 2,
            "why": "**～{杯|はい}** (~hai) = ~ cốc, ly, bát — 1杯 いっぱい, 3杯 さんばい, 6杯 ろっぱい"
          },
          {
            "q": "「～{本|ほん}」 〔~hon〕 nghĩa là gì?",
            "options": [
              "bơi",
              "~ năm",
              "~ quyển (sách, vở)",
              "~ chai, cây (vật dài)"
            ],
            "correct": 3,
            "why": "**～{本|ほん}** (~hon) = ~ chai, cây (vật dài) — 1本 いっぽん, 3本 さんぼん, 6本 ろっぽん"
          },
          {
            "q": "「{泳|およ}ぎます」 〔oyogimasu〕 nghĩa là gì?",
            "options": [
              "bơi",
              "~ cốc, ly, bát",
              "bể bơi",
              "nhạc cổ điển"
            ],
            "correct": 0,
            "why": "**{泳|およ}ぎます** (oyogimasu) = bơi — nhóm 1 — từ điển: {泳|およ}ぐ"
          },
          {
            "q": "「{描|か}きます」 〔kakimasu〕 nghĩa là gì?",
            "options": [
              "~ quyển (sách, vở)",
              "vẽ (tranh)",
              "sưu tầm, thu thập",
              "bơi"
            ],
            "correct": 1,
            "why": "**{描|か}きます** (kakimasu) = vẽ (tranh) — cùng âm với {書|か}きます (viết chữ)"
          },
          {
            "q": "「{集|あつ}めます」 〔atsumemasu〕 nghĩa là gì?",
            "options": [
              "~ chai, cây (vật dài)",
              "sưu tầm, thu thập",
              "~ tháng (khoảng thời gian)",
              "hành động (phim hành động)"
            ],
            "correct": 1,
            "why": "**{集|あつ}めます** (atsumemasu) = sưu tầm, thu thập — nhóm 2 — từ điển: {集|あつ}める"
          },
          {
            "q": "「{運転|うんてん}します」 〔unten shimasu〕 nghĩa là gì?",
            "options": [
              "~ năm",
              "lái (xe)",
              "sưu tầm, thu thập",
              "bể bơi"
            ],
            "correct": 1,
            "why": "**{運転|うんてん}します** (unten shimasu) = lái (xe) — 運転ができます = biết lái"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-jv2",
        "title": "Nhật → Việt — nhóm D–F: tần suất · lớp học, CLB, sự kiện · tham gia, làm được (25 câu)",
        "items": [
          {
            "q": "「{最近|さいきん}」 〔saikin〕 nghĩa là gì?",
            "options": [
              "giỏi quá, tuyệt quá",
              "gần đây, dạo này",
              "đặc biệt là",
              "lặn biển"
            ],
            "correct": 1,
            "why": "**{最近|さいきん}** (saikin) = gần đây, dạo này"
          },
          {
            "q": "「{特|とく}に」 〔toku ni〕 nghĩa là gì?",
            "options": [
              "đặc biệt là",
              "nhưng (đầu câu sau)",
              "sự kiện",
              "lặn biển"
            ],
            "correct": 0,
            "why": "**{特|とく}に** (toku ni) = đặc biệt là"
          },
          {
            "q": "「いつも」 〔itsumo〕 nghĩa là gì?",
            "options": [
              "thỉnh thoảng",
              "vào, tham gia (CLB)",
              "lên, đi (xe, tàu)",
              "luôn luôn, lúc nào cũng"
            ],
            "correct": 3,
            "why": "**いつも** (itsumo) = luôn luôn, lúc nào cũng"
          },
          {
            "q": "「よく」 〔yoku〕 nghĩa là gì?",
            "options": [
              "thường, hay",
              "vào, tham gia (CLB)",
              "nhiều loại, đủ thứ",
              "học (có người dạy)"
            ],
            "correct": 0,
            "why": "**よく** (yoku) = thường, hay"
          },
          {
            "q": "「ときどき」 〔tokidoki〕 nghĩa là gì?",
            "options": [
              "thỉnh thoảng",
              "gần đây, dạo này",
              "lớp học ~",
              "(không) … lắm, (không) mấy"
            ],
            "correct": 0,
            "why": "**ときどき** (tokidoki) = thỉnh thoảng"
          },
          {
            "q": "「あまり」 〔amari〕 nghĩa là gì?",
            "options": [
              "(không) … lắm, (không) mấy",
              "thư pháp",
              "gần đây, dạo này",
              "thỉnh thoảng"
            ],
            "correct": 0,
            "why": "**あまり** (amari) = (không) … lắm, (không) mấy — đi với thể phủ định"
          },
          {
            "q": "「{全然|ぜんぜん}」 〔zenzen〕 nghĩa là gì?",
            "options": [
              "một cách giỏi, khéo",
              "tham gia (sự kiện)",
              "hoàn toàn (không)",
              "câu lạc bộ ~"
            ],
            "correct": 2,
            "why": "**{全然|ぜんぜん}** (zenzen) = hoàn toàn (không) — đi với thể phủ định"
          },
          {
            "q": "「でも」 〔demo〕 nghĩa là gì?",
            "options": [
              "một cách giỏi, khéo",
              "nhưng (đầu câu sau)",
              "lớp học ~",
              "đặc biệt là"
            ],
            "correct": 1,
            "why": "**でも** (demo) = nhưng (đầu câu sau)"
          },
          {
            "q": "「だけ」 〔dake〕 nghĩa là gì?",
            "options": [
              "học (có người dạy)",
              "lặn biển",
              "chỉ",
              "nhưng (đầu câu sau)"
            ],
            "correct": 2,
            "why": "**だけ** (dake) = chỉ"
          },
          {
            "q": "「イベント」 〔ibento〕 nghĩa là gì?",
            "options": [
              "gần đây, dạo này",
              "có thể, làm được",
              "thư pháp",
              "sự kiện"
            ],
            "correct": 3,
            "why": "**イベント** (ibento) = sự kiện"
          },
          {
            "q": "「コンテスト」 〔kontesuto〕 nghĩa là gì?",
            "options": [
              "đăng ký",
              "chỉ",
              "giỏi quá, tuyệt quá",
              "cuộc thi"
            ],
            "correct": 3,
            "why": "**コンテスト** (kontesuto) = cuộc thi"
          },
          {
            "q": "「{書道|しょどう}」 〔shodou〕 nghĩa là gì?",
            "options": [
              "thư pháp",
              "câu lạc bộ ~",
              "tham gia (sự kiện)",
              "lớp học ~"
            ],
            "correct": 0,
            "why": "**{書道|しょどう}** (shodou) = thư pháp"
          },
          {
            "q": "「ダイビング」 〔daibingu〕 nghĩa là gì?",
            "options": [
              "thường, hay",
              "một cách giỏi, khéo",
              "lặn biển",
              "nhảy, khiêu vũ"
            ],
            "correct": 2,
            "why": "**ダイビング** (daibingu) = lặn biển"
          },
          {
            "q": "「ダンス」 〔dansu〕 nghĩa là gì?",
            "options": [
              "câu lạc bộ ~",
              "hoàn toàn (không)",
              "gần đây, dạo này",
              "nhảy, khiêu vũ"
            ],
            "correct": 3,
            "why": "**ダンス** (dansu) = nhảy, khiêu vũ"
          },
          {
            "q": "「～クラブ」 〔~kurabu〕 nghĩa là gì?",
            "options": [
              "hoàn toàn (không)",
              "câu lạc bộ ~",
              "giỏi quá, tuyệt quá",
              "cuộc thi"
            ],
            "correct": 1,
            "why": "**～クラブ** (~kurabu) = câu lạc bộ ~ — ダンスクラブ"
          },
          {
            "q": "「～{教室|きょうしつ}」 〔~kyoushitsu〕 nghĩa là gì?",
            "options": [
              "một cách giỏi, khéo",
              "lớp học ~",
              "nhảy, khiêu vũ",
              "gần đây, dạo này"
            ],
            "correct": 1,
            "why": "**～{教室|きょうしつ}** (~kyoushitsu) = lớp học ~ — 書道教室, 料理教室"
          },
          {
            "q": "「{習|なら}います」 〔naraimasu〕 nghĩa là gì?",
            "options": [
              "luôn luôn, lúc nào cũng",
              "cuộc thi",
              "đăng ký",
              "học (có người dạy)"
            ],
            "correct": 3,
            "why": "**{習|なら}います** (naraimasu) = học (có người dạy) — nhóm 1 — từ điển: {習|なら}う"
          },
          {
            "q": "「{乗|の}ります」 〔norimasu〕 nghĩa là gì?",
            "options": [
              "lên, đi (xe, tàu)",
              "luôn luôn, lúc nào cũng",
              "câu lạc bộ ~",
              "gần đây, dạo này"
            ],
            "correct": 0,
            "why": "**{乗|の}ります** (norimasu) = lên, đi (xe, tàu) — N **に** 乗ります"
          },
          {
            "q": "「{入|はい}ります」 〔hairimasu〕 nghĩa là gì?",
            "options": [
              "giỏi quá, tuyệt quá",
              "vào, tham gia (CLB)",
              "có thể, làm được",
              "lên, đi (xe, tàu)"
            ],
            "correct": 1,
            "why": "**{入|はい}ります** (hairimasu) = vào, tham gia (CLB) — N **に** 入ります; nhóm 1"
          },
          {
            "q": "「{申|もう}し{込|こ}みます」 〔moushikomimasu〕 nghĩa là gì?",
            "options": [
              "vào, tham gia (CLB)",
              "thỉnh thoảng",
              "lớp học ~",
              "đăng ký"
            ],
            "correct": 3,
            "why": "**{申|もう}し{込|こ}みます** (moushikomimasu) = đăng ký — N **に** 申し込みます"
          },
          {
            "q": "「できます」 〔dekimasu〕 nghĩa là gì?",
            "options": [
              "chỉ",
              "có thể, làm được",
              "luôn luôn, lúc nào cũng",
              "một cách giỏi, khéo"
            ],
            "correct": 1,
            "why": "**できます** (dekimasu) = có thể, làm được — N **が** できます"
          },
          {
            "q": "「{参加|さんか}します」 〔sanka shimasu〕 nghĩa là gì?",
            "options": [
              "học (có người dạy)",
              "gần đây, dạo này",
              "tham gia (sự kiện)",
              "nhiều loại, đủ thứ"
            ],
            "correct": 2,
            "why": "**{参加|さんか}します** (sanka shimasu) = tham gia (sự kiện) — N **に** 参加します"
          },
          {
            "q": "「すごい」 〔sugoi〕 nghĩa là gì?",
            "options": [
              "gần đây, dạo này",
              "giỏi quá, tuyệt quá",
              "có thể, làm được",
              "sự kiện"
            ],
            "correct": 1,
            "why": "**すごい** (sugoi) = giỏi quá, tuyệt quá"
          },
          {
            "q": "「いろいろ（な）」 〔iroiro (na)〕 nghĩa là gì?",
            "options": [
              "nhiều loại, đủ thứ",
              "đăng ký",
              "tham gia (sự kiện)",
              "lặn biển"
            ],
            "correct": 0,
            "why": "**いろいろ（な）** (iroiro (na)) = nhiều loại, đủ thứ"
          },
          {
            "q": "「{上手|じょうず}に」 〔jouzu ni〕 nghĩa là gì?",
            "options": [
              "gần đây, dạo này",
              "vào, tham gia (CLB)",
              "lặn biển",
              "một cách giỏi, khéo"
            ],
            "correct": 3,
            "why": "**{上手|じょうず}に** (jouzu ni) = một cách giỏi, khéo"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-jv3",
        "title": "Nhật → Việt — nhóm G–H: thủ tục, giấy tờ · đi lại, trả tiền, đặt trước (13 câu)",
        "items": [
          {
            "q": "「{受付|うけつけ}」 〔uketsuke〕 nghĩa là gì?",
            "options": [
              "bài tập về nhà",
              "quầy lễ tân, tiếp tân",
              "thẻ (thẻ thư viện…)",
              "thẻ đăng ký người nước ngoài"
            ],
            "correct": 1,
            "why": "**{受付|うけつけ}** (uketsuke) = quầy lễ tân, tiếp tân"
          },
          {
            "q": "「カード」 〔kaado〕 nghĩa là gì?",
            "options": [
              "thẻ đăng ký người nước ngoài",
              "trả (tiền)",
              "thẻ (thẻ thư viện…)",
              "cho xem"
            ],
            "correct": 2,
            "why": "**カード** (kaado) = thẻ (thẻ thư viện…)"
          },
          {
            "q": "「{外国人登録証|がいこくじんとうろくしょう}」 〔gaikokujin tourokushou〕 nghĩa là gì?",
            "options": [
              "quầy lễ tân, tiếp tân",
              "nói",
              "thẻ đăng ký người nước ngoài",
              "số ~ (số thứ tự)"
            ],
            "correct": 2,
            "why": "**{外国人登録証|がいこくじんとうろくしょう}** (gaikokujin tourokushou) = thẻ đăng ký người nước ngoài"
          },
          {
            "q": "「{住所|じゅうしょ}」 〔juusho〕 nghĩa là gì?",
            "options": [
              "bài tập về nhà",
              "thẻ đăng ký người nước ngoài",
              "địa chỉ",
              "đặt trước"
            ],
            "correct": 2,
            "why": "**{住所|じゅうしょ}** (juusho) = địa chỉ"
          },
          {
            "q": "「{宿題|しゅくだい}」 〔shukudai〕 nghĩa là gì?",
            "options": [
              "số điện thoại",
              "bài tập về nhà",
              "thẻ (thẻ thư viện…)",
              "đặt trước"
            ],
            "correct": 1,
            "why": "**{宿題|しゅくだい}** (shukudai) = bài tập về nhà"
          },
          {
            "q": "「{電話番号|でんわばんごう}」 〔denwa bangou〕 nghĩa là gì?",
            "options": [
              "số điện thoại",
              "xuống (xe, tàu)",
              "bài tập về nhà",
              "địa chỉ"
            ],
            "correct": 0,
            "why": "**{電話番号|でんわばんごう}** (denwa bangou) = số điện thoại"
          },
          {
            "q": "「～{番|ばん}」 〔~ban〕 nghĩa là gì?",
            "options": [
              "cho xem",
              "đặt trước",
              "số ~ (số thứ tự)",
              "quầy lễ tân, tiếp tân"
            ],
            "correct": 2,
            "why": "**～{番|ばん}** (~ban) = số ~ (số thứ tự) — 3番のバス = xe buýt số 3"
          },
          {
            "q": "「{言|い}います」 〔iimasu〕 nghĩa là gì?",
            "options": [
              "cho xem",
              "nói",
              "làm thế nào, bằng cách nào",
              "số ~ (số thứ tự)"
            ],
            "correct": 1,
            "why": "**{言|い}います** (iimasu) = nói"
          },
          {
            "q": "「{払|はら}います」 〔haraimasu〕 nghĩa là gì?",
            "options": [
              "quầy lễ tân, tiếp tân",
              "thẻ đăng ký người nước ngoài",
              "cho xem",
              "trả (tiền)"
            ],
            "correct": 3,
            "why": "**{払|はら}います** (haraimasu) = trả (tiền)"
          },
          {
            "q": "「{降|お}ります」 〔orimasu〕 nghĩa là gì?",
            "options": [
              "xuống (xe, tàu)",
              "quầy lễ tân, tiếp tân",
              "thẻ đăng ký người nước ngoài",
              "bài tập về nhà"
            ],
            "correct": 0,
            "why": "**{降|お}ります** (orimasu) = xuống (xe, tàu) — N **を** 降ります; nhóm 2"
          },
          {
            "q": "「{見|み}せます」 〔misemasu〕 nghĩa là gì?",
            "options": [
              "trả (tiền)",
              "số ~ (số thứ tự)",
              "quầy lễ tân, tiếp tân",
              "cho xem"
            ],
            "correct": 3,
            "why": "**{見|み}せます** (misemasu) = cho xem"
          },
          {
            "q": "「{予約|よやく}します」 〔yoyaku shimasu〕 nghĩa là gì?",
            "options": [
              "quầy lễ tân, tiếp tân",
              "đặt trước",
              "địa chỉ",
              "xuống (xe, tàu)"
            ],
            "correct": 1,
            "why": "**{予約|よやく}します** (yoyaku shimasu) = đặt trước"
          },
          {
            "q": "「どうやって」 〔dou yatte〕 nghĩa là gì?",
            "options": [
              "trả (tiền)",
              "làm thế nào, bằng cách nào",
              "địa chỉ",
              "xuống (xe, tàu)"
            ],
            "correct": 1,
            "why": "**どうやって** (dou yatte) = làm thế nào, bằng cách nào"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-vj1",
        "title": "Việt → Nhật — nhóm A–C: sở thích · khoảng thời gian & từ đếm · động từ chủ đề 1 (23 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"hành động (phim hành động)\" là từ nào?",
            "options": [
              "{泳|およ}ぎます (oyogimasu)",
              "アクション (akushon)",
              "～{年|ねん} (~nen)",
              "（お）{菓子|かし} ((o)kashi)"
            ],
            "correct": 1,
            "why": "**アクション** (akushon) = hành động (phim hành động) — アクション映画 = phim hành động"
          },
          {
            "q": "Tiếng Nhật của \"bánh kẹo\" là từ nào?",
            "options": [
              "～{回|かい} (~kai)",
              "（お）{菓子|かし} ((o)kashi)",
              "{運転|うんてん}します (unten shimasu)",
              "～{料理|りょうり} (~ryouri)"
            ],
            "correct": 1,
            "why": "**（お）{菓子|かし}** ((o)kashi) = bánh kẹo"
          },
          {
            "q": "Tiếng Nhật của \"tem thư\" là từ nào?",
            "options": [
              "{切手|きって} (kitte)",
              "～{本|ほん} (~hon)",
              "～{冊|さつ} (~satsu)",
              "アクション (akushon)"
            ],
            "correct": 0,
            "why": "**{切手|きって}** (kitte) = tem thư"
          },
          {
            "q": "Tiếng Nhật của \"nhạc cổ điển\" là từ nào?",
            "options": [
              "～{冊|さつ} (~satsu)",
              "ポップス (poppusu)",
              "クラシック (kurashikku)",
              "{集|あつ}めます (atsumemasu)"
            ],
            "correct": 2,
            "why": "**クラシック** (kurashikku) = nhạc cổ điển"
          },
          {
            "q": "Tiếng Nhật của \"nhạc pop\" là từ nào?",
            "options": [
              "{泳|およ}ぎます (oyogimasu)",
              "ポップス (poppusu)",
              "～{週間|しゅうかん} (~shuukan)",
              "{切手|きって} (kitte)"
            ],
            "correct": 1,
            "why": "**ポップス** (poppusu) = nhạc pop"
          },
          {
            "q": "Tiếng Nhật của \"tiểu thuyết\" là từ nào?",
            "options": [
              "{描|か}きます (kakimasu)",
              "アクション (akushon)",
              "{小説|しょうせつ} (shousetsu)",
              "ポップス (poppusu)"
            ],
            "correct": 2,
            "why": "**{小説|しょうせつ}** (shousetsu) = tiểu thuyết"
          },
          {
            "q": "Tiếng Nhật của \"truyện tranh\" là từ nào?",
            "options": [
              "{漫画|まんが} (manga)",
              "～{冊|さつ} (~satsu)",
              "～{回|かい} (~kai)",
              "ポップス (poppusu)"
            ],
            "correct": 0,
            "why": "**{漫画|まんが}** (manga) = truyện tranh"
          },
          {
            "q": "Tiếng Nhật của \"câu cá\" là từ nào?",
            "options": [
              "～{年|ねん} (~nen)",
              "{漫画|まんが} (manga)",
              "アクション (akushon)",
              "{釣|つ}り (tsuri)"
            ],
            "correct": 3,
            "why": "**{釣|つ}り** (tsuri) = câu cá — 釣りをします = đi câu"
          },
          {
            "q": "Tiếng Nhật của \"phim truyền hình (phim bộ)\" là từ nào?",
            "options": [
              "～か{月|げつ} (~kagetsu)",
              "ドラマ (dorama)",
              "{小説|しょうせつ} (shousetsu)",
              "（お）{菓子|かし} ((o)kashi)"
            ],
            "correct": 1,
            "why": "**ドラマ** (dorama) = phim truyền hình (phim bộ)"
          },
          {
            "q": "Tiếng Nhật của \"bể bơi\" là từ nào?",
            "options": [
              "～{料理|りょうり} (~ryouri)",
              "プール (puuru)",
              "～{本|ほん} (~hon)",
              "（お）{菓子|かし} ((o)kashi)"
            ],
            "correct": 1,
            "why": "**プール** (puuru) = bể bơi"
          },
          {
            "q": "Tiếng Nhật của \"món ~, ẩm thực ~\" là từ nào?",
            "options": [
              "～{料理|りょうり} (~ryouri)",
              "～{年|ねん} (~nen)",
              "～{本|ほん} (~hon)",
              "～{回|かい} (~kai)"
            ],
            "correct": 0,
            "why": "**～{料理|りょうり}** (~ryouri) = món ~, ẩm thực ~ — イタリア料理 = món Ý"
          },
          {
            "q": "Tiếng Nhật của \"~ ngày (khoảng thời gian)\" là từ nào?",
            "options": [
              "～{日|にち} (~nichi)",
              "～{料理|りょうり} (~ryouri)",
              "～{冊|さつ} (~satsu)",
              "アクション (akushon)"
            ],
            "correct": 0,
            "why": "**～{日|にち}** (~nichi) = ~ ngày (khoảng thời gian) — 1日 いちにち, 2日 ふつか, 3日 みっか"
          },
          {
            "q": "Tiếng Nhật của \"~ tuần (khoảng thời gian)\" là từ nào?",
            "options": [
              "（お）{菓子|かし} ((o)kashi)",
              "～{日|にち} (~nichi)",
              "～{週間|しゅうかん} (~shuukan)",
              "～{杯|はい} (~hai)"
            ],
            "correct": 2,
            "why": "**～{週間|しゅうかん}** (~shuukan) = ~ tuần (khoảng thời gian) — 1週間 いっしゅうかん"
          },
          {
            "q": "Tiếng Nhật của \"~ tháng (khoảng thời gian)\" là từ nào?",
            "options": [
              "{描|か}きます (kakimasu)",
              "～か{月|げつ} (~kagetsu)",
              "（お）{菓子|かし} ((o)kashi)",
              "～{料理|りょうり} (~ryouri)"
            ],
            "correct": 1,
            "why": "**～か{月|げつ}** (~kagetsu) = ~ tháng (khoảng thời gian) — 1か月 いっかげつ; khác 1月 いちがつ = tháng Một"
          },
          {
            "q": "Tiếng Nhật của \"~ năm\" là từ nào?",
            "options": [
              "～{年|ねん} (~nen)",
              "～か{月|げつ} (~kagetsu)",
              "{集|あつ}めます (atsumemasu)",
              "～{回|かい} (~kai)"
            ],
            "correct": 0,
            "why": "**～{年|ねん}** (~nen) = ~ năm — 4年 よねん"
          },
          {
            "q": "Tiếng Nhật của \"~ lần\" là từ nào?",
            "options": [
              "{描|か}きます (kakimasu)",
              "{切手|きって} (kitte)",
              "プール (puuru)",
              "～{回|かい} (~kai)"
            ],
            "correct": 3,
            "why": "**～{回|かい}** (~kai) = ~ lần — 1回 いっかい, 6回 ろっかい, 10回 じゅっかい"
          },
          {
            "q": "Tiếng Nhật của \"~ quyển (sách, vở)\" là từ nào?",
            "options": [
              "～{冊|さつ} (~satsu)",
              "{運転|うんてん}します (unten shimasu)",
              "～{回|かい} (~kai)",
              "アクション (akushon)"
            ],
            "correct": 0,
            "why": "**～{冊|さつ}** (~satsu) = ~ quyển (sách, vở) — 1冊 いっさつ"
          },
          {
            "q": "Tiếng Nhật của \"~ cốc, ly, bát\" là từ nào?",
            "options": [
              "{泳|およ}ぎます (oyogimasu)",
              "～{杯|はい} (~hai)",
              "アクション (akushon)",
              "{切手|きって} (kitte)"
            ],
            "correct": 1,
            "why": "**～{杯|はい}** (~hai) = ~ cốc, ly, bát — 1杯 いっぱい, 3杯 さんばい, 6杯 ろっぱい"
          },
          {
            "q": "Tiếng Nhật của \"~ chai, cây (vật dài)\" là từ nào?",
            "options": [
              "～{本|ほん} (~hon)",
              "～{回|かい} (~kai)",
              "～{杯|はい} (~hai)",
              "～{年|ねん} (~nen)"
            ],
            "correct": 0,
            "why": "**～{本|ほん}** (~hon) = ~ chai, cây (vật dài) — 1本 いっぽん, 3本 さんぼん, 6本 ろっぽん"
          },
          {
            "q": "Tiếng Nhật của \"bơi\" là từ nào?",
            "options": [
              "{小説|しょうせつ} (shousetsu)",
              "アクション (akushon)",
              "{運転|うんてん}します (unten shimasu)",
              "{泳|およ}ぎます (oyogimasu)"
            ],
            "correct": 3,
            "why": "**{泳|およ}ぎます** (oyogimasu) = bơi — nhóm 1 — từ điển: {泳|およ}ぐ"
          },
          {
            "q": "Tiếng Nhật của \"vẽ (tranh)\" là từ nào?",
            "options": [
              "アクション (akushon)",
              "{描|か}きます (kakimasu)",
              "～{日|にち} (~nichi)",
              "～{杯|はい} (~hai)"
            ],
            "correct": 1,
            "why": "**{描|か}きます** (kakimasu) = vẽ (tranh) — cùng âm với {書|か}きます (viết chữ)"
          },
          {
            "q": "Tiếng Nhật của \"sưu tầm, thu thập\" là từ nào?",
            "options": [
              "アクション (akushon)",
              "{泳|およ}ぎます (oyogimasu)",
              "～{料理|りょうり} (~ryouri)",
              "{集|あつ}めます (atsumemasu)"
            ],
            "correct": 3,
            "why": "**{集|あつ}めます** (atsumemasu) = sưu tầm, thu thập — nhóm 2 — từ điển: {集|あつ}める"
          },
          {
            "q": "Tiếng Nhật của \"lái (xe)\" là từ nào?",
            "options": [
              "～{冊|さつ} (~satsu)",
              "{運転|うんてん}します (unten shimasu)",
              "{漫画|まんが} (manga)",
              "～{週間|しゅうかん} (~shuukan)"
            ],
            "correct": 1,
            "why": "**{運転|うんてん}します** (unten shimasu) = lái (xe) — 運転ができます = biết lái"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-vj2",
        "title": "Việt → Nhật — nhóm D–F: tần suất · lớp học, CLB, sự kiện · tham gia, làm được (25 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"gần đây, dạo này\" là từ nào?",
            "options": [
              "いろいろ（な） (iroiro (na))",
              "{最近|さいきん} (saikin)",
              "{書道|しょどう} (shodou)",
              "{特|とく}に (toku ni)"
            ],
            "correct": 1,
            "why": "**{最近|さいきん}** (saikin) = gần đây, dạo này"
          },
          {
            "q": "Tiếng Nhật của \"đặc biệt là\" là từ nào?",
            "options": [
              "いろいろ（な） (iroiro (na))",
              "よく (yoku)",
              "コンテスト (kontesuto)",
              "{特|とく}に (toku ni)"
            ],
            "correct": 3,
            "why": "**{特|とく}に** (toku ni) = đặc biệt là"
          },
          {
            "q": "Tiếng Nhật của \"luôn luôn, lúc nào cũng\" là từ nào?",
            "options": [
              "ときどき (tokidoki)",
              "いつも (itsumo)",
              "でも (demo)",
              "{乗|の}ります (norimasu)"
            ],
            "correct": 1,
            "why": "**いつも** (itsumo) = luôn luôn, lúc nào cũng"
          },
          {
            "q": "Tiếng Nhật của \"thường, hay\" là từ nào?",
            "options": [
              "ダンス (dansu)",
              "よく (yoku)",
              "{全然|ぜんぜん} (zenzen)",
              "{特|とく}に (toku ni)"
            ],
            "correct": 1,
            "why": "**よく** (yoku) = thường, hay"
          },
          {
            "q": "Tiếng Nhật của \"thỉnh thoảng\" là từ nào?",
            "options": [
              "できます (dekimasu)",
              "ときどき (tokidoki)",
              "～{教室|きょうしつ} (~kyoushitsu)",
              "{最近|さいきん} (saikin)"
            ],
            "correct": 1,
            "why": "**ときどき** (tokidoki) = thỉnh thoảng"
          },
          {
            "q": "Tiếng Nhật của \"(không) … lắm, (không) mấy\" là từ nào?",
            "options": [
              "{上手|じょうず}に (jouzu ni)",
              "あまり (amari)",
              "すごい (sugoi)",
              "コンテスト (kontesuto)"
            ],
            "correct": 1,
            "why": "**あまり** (amari) = (không) … lắm, (không) mấy — đi với thể phủ định"
          },
          {
            "q": "Tiếng Nhật của \"hoàn toàn (không)\" là từ nào?",
            "options": [
              "すごい (sugoi)",
              "{全然|ぜんぜん} (zenzen)",
              "{最近|さいきん} (saikin)",
              "ダイビング (daibingu)"
            ],
            "correct": 1,
            "why": "**{全然|ぜんぜん}** (zenzen) = hoàn toàn (không) — đi với thể phủ định"
          },
          {
            "q": "Tiếng Nhật của \"nhưng (đầu câu sau)\" là từ nào?",
            "options": [
              "でも (demo)",
              "{全然|ぜんぜん} (zenzen)",
              "イベント (ibento)",
              "ダイビング (daibingu)"
            ],
            "correct": 0,
            "why": "**でも** (demo) = nhưng (đầu câu sau)"
          },
          {
            "q": "Tiếng Nhật của \"chỉ\" là từ nào?",
            "options": [
              "よく (yoku)",
              "{入|はい}ります (hairimasu)",
              "{乗|の}ります (norimasu)",
              "だけ (dake)"
            ],
            "correct": 3,
            "why": "**だけ** (dake) = chỉ"
          },
          {
            "q": "Tiếng Nhật của \"sự kiện\" là từ nào?",
            "options": [
              "イベント (ibento)",
              "{入|はい}ります (hairimasu)",
              "いろいろ（な） (iroiro (na))",
              "{習|なら}います (naraimasu)"
            ],
            "correct": 0,
            "why": "**イベント** (ibento) = sự kiện"
          },
          {
            "q": "Tiếng Nhật của \"cuộc thi\" là từ nào?",
            "options": [
              "コンテスト (kontesuto)",
              "{最近|さいきん} (saikin)",
              "～{教室|きょうしつ} (~kyoushitsu)",
              "ときどき (tokidoki)"
            ],
            "correct": 0,
            "why": "**コンテスト** (kontesuto) = cuộc thi"
          },
          {
            "q": "Tiếng Nhật của \"thư pháp\" là từ nào?",
            "options": [
              "{書道|しょどう} (shodou)",
              "コンテスト (kontesuto)",
              "{最近|さいきん} (saikin)",
              "ときどき (tokidoki)"
            ],
            "correct": 0,
            "why": "**{書道|しょどう}** (shodou) = thư pháp"
          },
          {
            "q": "Tiếng Nhật của \"lặn biển\" là từ nào?",
            "options": [
              "{上手|じょうず}に (jouzu ni)",
              "{参加|さんか}します (sanka shimasu)",
              "ダイビング (daibingu)",
              "～クラブ (~kurabu)"
            ],
            "correct": 2,
            "why": "**ダイビング** (daibingu) = lặn biển"
          },
          {
            "q": "Tiếng Nhật của \"nhảy, khiêu vũ\" là từ nào?",
            "options": [
              "{上手|じょうず}に (jouzu ni)",
              "ダンス (dansu)",
              "～{教室|きょうしつ} (~kyoushitsu)",
              "{特|とく}に (toku ni)"
            ],
            "correct": 1,
            "why": "**ダンス** (dansu) = nhảy, khiêu vũ"
          },
          {
            "q": "Tiếng Nhật của \"câu lạc bộ ~\" là từ nào?",
            "options": [
              "{習|なら}います (naraimasu)",
              "{書道|しょどう} (shodou)",
              "～クラブ (~kurabu)",
              "でも (demo)"
            ],
            "correct": 2,
            "why": "**～クラブ** (~kurabu) = câu lạc bộ ~ — ダンスクラブ"
          },
          {
            "q": "Tiếng Nhật của \"lớp học ~\" là từ nào?",
            "options": [
              "{最近|さいきん} (saikin)",
              "できます (dekimasu)",
              "コンテスト (kontesuto)",
              "～{教室|きょうしつ} (~kyoushitsu)"
            ],
            "correct": 3,
            "why": "**～{教室|きょうしつ}** (~kyoushitsu) = lớp học ~ — 書道教室, 料理教室"
          },
          {
            "q": "Tiếng Nhật của \"học (có người dạy)\" là từ nào?",
            "options": [
              "{申|もう}し{込|こ}みます (moushikomimasu)",
              "だけ (dake)",
              "すごい (sugoi)",
              "{習|なら}います (naraimasu)"
            ],
            "correct": 3,
            "why": "**{習|なら}います** (naraimasu) = học (có người dạy) — nhóm 1 — từ điển: {習|なら}う"
          },
          {
            "q": "Tiếng Nhật của \"lên, đi (xe, tàu)\" là từ nào?",
            "options": [
              "{乗|の}ります (norimasu)",
              "ダンス (dansu)",
              "{参加|さんか}します (sanka shimasu)",
              "～クラブ (~kurabu)"
            ],
            "correct": 0,
            "why": "**{乗|の}ります** (norimasu) = lên, đi (xe, tàu) — N **に** 乗ります"
          },
          {
            "q": "Tiếng Nhật của \"vào, tham gia (CLB)\" là từ nào?",
            "options": [
              "よく (yoku)",
              "{上手|じょうず}に (jouzu ni)",
              "{入|はい}ります (hairimasu)",
              "ダイビング (daibingu)"
            ],
            "correct": 2,
            "why": "**{入|はい}ります** (hairimasu) = vào, tham gia (CLB) — N **に** 入ります; nhóm 1"
          },
          {
            "q": "Tiếng Nhật của \"đăng ký\" là từ nào?",
            "options": [
              "ダンス (dansu)",
              "{全然|ぜんぜん} (zenzen)",
              "{最近|さいきん} (saikin)",
              "{申|もう}し{込|こ}みます (moushikomimasu)"
            ],
            "correct": 3,
            "why": "**{申|もう}し{込|こ}みます** (moushikomimasu) = đăng ký — N **に** 申し込みます"
          },
          {
            "q": "Tiếng Nhật của \"có thể, làm được\" là từ nào?",
            "options": [
              "{全然|ぜんぜん} (zenzen)",
              "できます (dekimasu)",
              "すごい (sugoi)",
              "コンテスト (kontesuto)"
            ],
            "correct": 1,
            "why": "**できます** (dekimasu) = có thể, làm được — N **が** できます"
          },
          {
            "q": "Tiếng Nhật của \"tham gia (sự kiện)\" là từ nào?",
            "options": [
              "{上手|じょうず}に (jouzu ni)",
              "{参加|さんか}します (sanka shimasu)",
              "ダンス (dansu)",
              "{最近|さいきん} (saikin)"
            ],
            "correct": 1,
            "why": "**{参加|さんか}します** (sanka shimasu) = tham gia (sự kiện) — N **に** 参加します"
          },
          {
            "q": "Tiếng Nhật của \"giỏi quá, tuyệt quá\" là từ nào?",
            "options": [
              "いつも (itsumo)",
              "コンテスト (kontesuto)",
              "{入|はい}ります (hairimasu)",
              "すごい (sugoi)"
            ],
            "correct": 3,
            "why": "**すごい** (sugoi) = giỏi quá, tuyệt quá"
          },
          {
            "q": "Tiếng Nhật của \"nhiều loại, đủ thứ\" là từ nào?",
            "options": [
              "いろいろ（な） (iroiro (na))",
              "いつも (itsumo)",
              "～クラブ (~kurabu)",
              "{最近|さいきん} (saikin)"
            ],
            "correct": 0,
            "why": "**いろいろ（な）** (iroiro (na)) = nhiều loại, đủ thứ"
          },
          {
            "q": "Tiếng Nhật của \"một cách giỏi, khéo\" là từ nào?",
            "options": [
              "{参加|さんか}します (sanka shimasu)",
              "{上手|じょうず}に (jouzu ni)",
              "{申|もう}し{込|こ}みます (moushikomimasu)",
              "{乗|の}ります (norimasu)"
            ],
            "correct": 1,
            "why": "**{上手|じょうず}に** (jouzu ni) = một cách giỏi, khéo"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-vj3",
        "title": "Việt → Nhật — nhóm G–H: thủ tục, giấy tờ · đi lại, trả tiền, đặt trước (13 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"quầy lễ tân, tiếp tân\" là từ nào?",
            "options": [
              "～{番|ばん} (~ban)",
              "{受付|うけつけ} (uketsuke)",
              "{外国人登録証|がいこくじんとうろくしょう} (gaikokujin tourokushou)",
              "{予約|よやく}します (yoyaku shimasu)"
            ],
            "correct": 1,
            "why": "**{受付|うけつけ}** (uketsuke) = quầy lễ tân, tiếp tân"
          },
          {
            "q": "Tiếng Nhật của \"thẻ (thẻ thư viện…)\" là từ nào?",
            "options": [
              "カード (kaado)",
              "どうやって (dou yatte)",
              "{外国人登録証|がいこくじんとうろくしょう} (gaikokujin tourokushou)",
              "{言|い}います (iimasu)"
            ],
            "correct": 0,
            "why": "**カード** (kaado) = thẻ (thẻ thư viện…)"
          },
          {
            "q": "Tiếng Nhật của \"thẻ đăng ký người nước ngoài\" là từ nào?",
            "options": [
              "{見|み}せます (misemasu)",
              "{受付|うけつけ} (uketsuke)",
              "{外国人登録証|がいこくじんとうろくしょう} (gaikokujin tourokushou)",
              "{電話番号|でんわばんごう} (denwa bangou)"
            ],
            "correct": 2,
            "why": "**{外国人登録証|がいこくじんとうろくしょう}** (gaikokujin tourokushou) = thẻ đăng ký người nước ngoài"
          },
          {
            "q": "Tiếng Nhật của \"địa chỉ\" là từ nào?",
            "options": [
              "{受付|うけつけ} (uketsuke)",
              "{住所|じゅうしょ} (juusho)",
              "{電話番号|でんわばんごう} (denwa bangou)",
              "～{番|ばん} (~ban)"
            ],
            "correct": 1,
            "why": "**{住所|じゅうしょ}** (juusho) = địa chỉ"
          },
          {
            "q": "Tiếng Nhật của \"bài tập về nhà\" là từ nào?",
            "options": [
              "どうやって (dou yatte)",
              "{降|お}ります (orimasu)",
              "{言|い}います (iimasu)",
              "{宿題|しゅくだい} (shukudai)"
            ],
            "correct": 3,
            "why": "**{宿題|しゅくだい}** (shukudai) = bài tập về nhà"
          },
          {
            "q": "Tiếng Nhật của \"số điện thoại\" là từ nào?",
            "options": [
              "{見|み}せます (misemasu)",
              "{外国人登録証|がいこくじんとうろくしょう} (gaikokujin tourokushou)",
              "{受付|うけつけ} (uketsuke)",
              "{電話番号|でんわばんごう} (denwa bangou)"
            ],
            "correct": 3,
            "why": "**{電話番号|でんわばんごう}** (denwa bangou) = số điện thoại"
          },
          {
            "q": "Tiếng Nhật của \"số ~ (số thứ tự)\" là từ nào?",
            "options": [
              "どうやって (dou yatte)",
              "～{番|ばん} (~ban)",
              "{降|お}ります (orimasu)",
              "{払|はら}います (haraimasu)"
            ],
            "correct": 1,
            "why": "**～{番|ばん}** (~ban) = số ~ (số thứ tự) — 3番のバス = xe buýt số 3"
          },
          {
            "q": "Tiếng Nhật của \"nói\" là từ nào?",
            "options": [
              "{宿題|しゅくだい} (shukudai)",
              "{見|み}せます (misemasu)",
              "どうやって (dou yatte)",
              "{言|い}います (iimasu)"
            ],
            "correct": 3,
            "why": "**{言|い}います** (iimasu) = nói"
          },
          {
            "q": "Tiếng Nhật của \"trả (tiền)\" là từ nào?",
            "options": [
              "{払|はら}います (haraimasu)",
              "{見|み}せます (misemasu)",
              "{降|お}ります (orimasu)",
              "{受付|うけつけ} (uketsuke)"
            ],
            "correct": 0,
            "why": "**{払|はら}います** (haraimasu) = trả (tiền)"
          },
          {
            "q": "Tiếng Nhật của \"xuống (xe, tàu)\" là từ nào?",
            "options": [
              "どうやって (dou yatte)",
              "{降|お}ります (orimasu)",
              "{電話番号|でんわばんごう} (denwa bangou)",
              "{受付|うけつけ} (uketsuke)"
            ],
            "correct": 1,
            "why": "**{降|お}ります** (orimasu) = xuống (xe, tàu) — N **を** 降ります; nhóm 2"
          },
          {
            "q": "Tiếng Nhật của \"cho xem\" là từ nào?",
            "options": [
              "どうやって (dou yatte)",
              "{見|み}せます (misemasu)",
              "{電話番号|でんわばんごう} (denwa bangou)",
              "カード (kaado)"
            ],
            "correct": 1,
            "why": "**{見|み}せます** (misemasu) = cho xem"
          },
          {
            "q": "Tiếng Nhật của \"đặt trước\" là từ nào?",
            "options": [
              "{外国人登録証|がいこくじんとうろくしょう} (gaikokujin tourokushou)",
              "{見|み}せます (misemasu)",
              "{払|はら}います (haraimasu)",
              "{予約|よやく}します (yoyaku shimasu)"
            ],
            "correct": 3,
            "why": "**{予約|よやく}します** (yoyaku shimasu) = đặt trước"
          },
          {
            "q": "Tiếng Nhật của \"làm thế nào, bằng cách nào\" là từ nào?",
            "options": [
              "{受付|うけつけ} (uketsuke)",
              "どうやって (dou yatte)",
              "{予約|よやく}します (yoyaku shimasu)",
              "カード (kaado)"
            ],
            "correct": 1,
            "why": "**どうやって** (dou yatte) = làm thế nào, bằng cách nào"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · khác loại · điền từ vào câu · gõ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-khac-loai",
        "title": "Từ nào KHÁC loại? (10 câu)",
        "items": [
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (âm nhạc)",
            "options": [
              "ポップス (Poppusu)",
              "クラシック (Kurashikku)",
              "ジャズ (Jazu)",
              "{切手|きって} (Kitte)"
            ],
            "correct": 3,
            "why": "Ba từ kia là thể loại nhạc; **切手** là tem thư."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (từ đếm đồ vật)",
            "options": [
              "～{冊|さつ} (~satsu)",
              "～{本|ほん} (~hon)",
              "{受付|うけつけ} (Uketsuke)",
              "～{杯|はい} (~hai)"
            ],
            "correct": 2,
            "why": "Ba từ kia là từ đếm; **受付** là quầy lễ tân."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (khoảng thời gian)",
            "options": [
              "～{週間|しゅうかん} (~shuukan)",
              "～か{月|げつ} (~kagetsu)",
              "～{年|ねん} (~nen)",
              "～{杯|はい} (~hai)"
            ],
            "correct": 3,
            "why": "Ba từ kia nói khoảng thời gian; **～杯** là từ đếm cốc."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (tần suất)",
            "options": [
              "ときどき (Tokidoki)",
              "いつも (Itsumo)",
              "よく (Yoku)",
              "{住所|じゅうしょ} (Juusho)"
            ],
            "correct": 3,
            "why": "Ba từ kia là phó từ tần suất; **住所** là địa chỉ."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (động từ NHÓM 2)",
            "options": [
              "{見|み}せます (Misemasu)",
              "{泳|およ}ぎます (Oyogimasu)",
              "{降|お}ります (Orimasu)",
              "{集|あつ}めます (Atsumemasu)"
            ],
            "correct": 1,
            "why": "Ba từ kia là nhóm 2 (集める, 降りる, 見せる); **泳ぎます** là nhóm 1 (泳ぐ)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (động từ NHÓM 1)",
            "options": [
              "{降|お}ります (Orimasu)",
              "{泳|およ}ぎます (Oyogimasu)",
              "{習|なら}います (Naraimasu)",
              "{払|はら}います (Haraimasu)"
            ],
            "correct": 0,
            "why": "Ba từ kia là nhóm 1; **降ります** là nhóm 2 (降りる) dù trông giống 乗ります."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (động từ NHÓM 3)",
            "options": [
              "{運転|うんてん}します (Untenshimasu)",
              "{予約|よやく}します (Yoyakushimasu)",
              "{参加|さんか}します (Sankashimasu)",
              "{乗|の}ります (Norimasu)"
            ],
            "correct": 3,
            "why": "Ba từ kia là N + します (nhóm 3); **乗ります** là nhóm 1."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (giấy tờ, thông tin cá nhân)",
            "options": [
              "ダンス (Dansu)",
              "{電話番号|でんわばんごう} (Denwabangou)",
              "{外国人登録証|がいこくじんとうろくしょう} (Gaikokujintourokushou)",
              "{住所|じゅうしょ} (Juusho)"
            ],
            "correct": 0,
            "why": "Ba từ kia là thông tin khi làm thủ tục; **ダンス** là nhảy."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (môn học ở lớp / CLB)",
            "options": [
              "ダンス (Dansu)",
              "{受付|うけつけ} (Uketsuke)",
              "{書道|しょどう} (Shodou)",
              "ダイビング (Daibingu)"
            ],
            "correct": 1,
            "why": "Ba từ kia là môn để học; **受付** là quầy lễ tân."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (thứ để đọc)",
            "options": [
              "プール (Puuru)",
              "{本|ほん} (Hon)",
              "{小説|しょうせつ} (Shousetsu)",
              "{漫画|まんが} (Manga)"
            ],
            "correct": 0,
            "why": "Ba từ kia là thứ để đọc; **プール** là bể bơi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-dien-cau",
        "title": "Điền từ vào câu — có nghĩa tiếng Việt kèm theo (28 câu)",
        "items": [
          {
            "q": "{私|わたし}の{趣味|しゅみ}は＿＿を{集|あつ}めることです。　〔Watashi no shumi wa __ o atsumeru koto desu.〕　— Sở thích của tôi là sưu tầm tem.",
            "options": [
              "{切手|きって}",
              "プール",
              "ダイビング",
              "{釣|つ}り"
            ],
            "correct": 0,
            "why": "Sưu tầm tem = 切手を集めます. → **{私|わたし}の{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。** 〔Watashi no shumi wa kitte o atsumeru koto desu.〕 — Sở thích của tôi là sưu tầm tem."
          },
          {
            "q": "{週末|しゅうまつ}、{川|かわ}で＿＿をします。　〔Shuumatsu, kawa de __ o shimasu.〕　— Cuối tuần tôi đi câu cá ở sông.",
            "options": [
              "{切手|きって}",
              "{小説|しょうせつ}",
              "クラシック",
              "{釣|つ}り"
            ],
            "correct": 3,
            "why": "Đi câu = 釣りをします. → **{週末|しゅうまつ}、{川|かわ}で{釣|つ}りをします。** 〔Shuumatsu, kawa de tsuri o shimasu.〕 — Cuối tuần tôi đi câu cá ở sông."
          },
          {
            "q": "{夏|なつ}は{毎日|まいにち}＿＿で{泳|およ}ぎます。　〔Natsu wa mainichi __ de oyogimasu.〕　— Mùa hè ngày nào tôi cũng bơi ở bể bơi.",
            "options": [
              "{受付|うけつけ}",
              "{書道|しょどう}",
              "プール",
              "ドラマ"
            ],
            "correct": 2,
            "why": "Bơi ở bể bơi = プールで泳ぎます. → **{夏|なつ}は{毎日|まいにち}プールで{泳|およ}ぎます。** 〔Natsu wa mainichi puuru de oyogimasu.〕 — Mùa hè ngày nào tôi cũng bơi ở bể bơi."
          },
          {
            "q": "{毎晩|まいばん}、{日本|にほん}の＿＿を{見|み}ます。　〔Maiban, Nihon no __ o mimasu.〕　— Tối nào tôi cũng xem phim truyền hình Nhật.",
            "options": [
              "{釣|つ}り",
              "プール",
              "ドラマ",
              "{切手|きって}"
            ],
            "correct": 2,
            "why": "ドラマ = phim truyền hình. → **{毎晩|まいばん}、{日本|にほん}のドラマを{見|み}ます。** 〔Maiban, Nihon no dorama o mimasu.〕 — Tối nào tôi cũng xem phim truyền hình Nhật."
          },
          {
            "q": "{電車|でんしゃ}の{中|なか}で＿＿を{読|よ}みます。　〔Densha no naka de __ o yomimasu.〕　— Tôi đọc truyện tranh trên tàu.",
            "options": [
              "{釣|つ}り",
              "ダンス",
              "{漫画|まんが}",
              "ダイビング"
            ],
            "correct": 2,
            "why": "Đọc truyện tranh = 漫画を読みます. → **{電車|でんしゃ}の{中|なか}で{漫画|まんが}を{読|よ}みます。** 〔Densha no naka de manga o yomimasu.〕 — Tôi đọc truyện tranh trên tàu."
          },
          {
            "q": "{静|しず}かな{音楽|おんがく}が{好|す}きですから、よく＿＿を{聞|き}きます。　〔Shizuka na ongaku ga suki desu kara, yoku __ o kikimasu.〕　— Tôi thích nhạc yên tĩnh nên hay nghe nhạc cổ điển.",
            "options": [
              "{書道|しょどう}",
              "アクション",
              "ダイビング",
              "クラシック"
            ],
            "correct": 3,
            "why": "Nhạc yên tĩnh → nhạc cổ điển (クラシック). → **{静|しず}かな{音楽|おんがく}が{好|す}きですから、よくクラシックを{聞|き}きます。** 〔Shizuka na ongaku ga suki desu kara, yoku kurashikku o kikimasu.〕 — Tôi thích nhạc yên tĩnh nên hay nghe nhạc cổ điển."
          },
          {
            "q": "＿＿{映画|えいが}をよく{見|み}ます。　〔__ eiga o yoku mimasu.〕　— Tôi hay xem phim hành động.",
            "options": [
              "アクション",
              "{切手|きって}",
              "{受付|うけつけ}",
              "プール"
            ],
            "correct": 0,
            "why": "Phim hành động = アクション映画. → **アクション{映画|えいが}をよく{見|み}ます。** 〔Akushon eiga o yoku mimasu.〕 — Tôi hay xem phim hành động."
          },
          {
            "q": "{書道|しょどう}＿＿で{漢字|かんじ}を{習|なら}っています。　〔Shodou __ de kanji o naratte imasu.〕　— Tôi đang học chữ Hán ở lớp thư pháp.",
            "options": [
              "{教室|きょうしつ}",
              "{料理|りょうり}",
              "{回|かい}",
              "{番|ばん}"
            ],
            "correct": 0,
            "why": "Lớp học ~ = ～教室. → **{書道|しょどう}{教室|きょうしつ}で{漢字|かんじ}を{習|なら}っています。** 〔Shodou kyoushitsu de kanji o naratte imasu.〕 — Tôi đang học chữ Hán ở lớp thư pháp."
          },
          {
            "q": "{大学|だいがく}のダンス＿＿に{入|はい}りました。　〔Daigaku no dansu __ ni hairimashita.〕　— Tôi đã vào câu lạc bộ nhảy của trường.",
            "options": [
              "クラブ",
              "{杯|はい}",
              "{番|ばん}",
              "{冊|さつ}"
            ],
            "correct": 0,
            "why": "Câu lạc bộ ~ = ～クラブ. → **{大学|だいがく}のダンスクラブに{入|はい}りました。** 〔Daigaku no dansu kurabu ni hairimashita.〕 — Tôi đã vào câu lạc bộ nhảy của trường."
          },
          {
            "q": "{一日|いちにち}にコーヒーを＿＿{飲|の}みます。　〔Ichinichi ni koohii o __ nomimasu.〕　— Một ngày tôi uống ba cốc cà phê.",
            "options": [
              "{三冊|さんさつ}",
              "{三杯|さんばい}",
              "{三匹|さんびき}",
              "{三本|さんぼん}"
            ],
            "correct": 1,
            "why": "Cốc → 杯; 3 cốc = さんばい. → **{一日|いちにち}にコーヒーを{三杯|さんばい}{飲|の}みます。** 〔Ichinichi ni koohii o sanbai nomimasu.〕 — Một ngày tôi uống ba cốc cà phê."
          },
          {
            "q": "{一|いっ}か{月|げつ}に{本|ほん}を＿＿{読|よ}みます。　〔Ikkagetsu ni hon o __ yomimasu.〕　— Một tháng tôi đọc bốn quyển sách.",
            "options": [
              "{四本|よんほん}",
              "{四匹|よんひき}",
              "{四杯|よんはい}",
              "{四冊|よんさつ}"
            ],
            "correct": 3,
            "why": "Sách → 冊. → **{一|いっ}か{月|げつ}に{本|ほん}を{四冊|よんさつ}{読|よ}みます。** 〔Ikkagetsu ni hon o yonsatsu yomimasu.〕 — Một tháng tôi đọc bốn quyển sách."
          },
          {
            "q": "{一週間|いっしゅうかん}に＿＿{泳|およ}ぎます。　〔Isshuukan ni __ oyogimasu.〕　— Một tuần tôi bơi hai lần.",
            "options": [
              "{二杯|にはい}",
              "{二回|にかい}",
              "{二冊|にさつ}",
              "{二本|にほん}"
            ],
            "correct": 1,
            "why": "Số lần → 回. → **{一週間|いっしゅうかん}に{二回|にかい}{泳|およ}ぎます。** 〔Isshuukan ni nikai oyogimasu.〕 — Một tuần tôi bơi hai lần."
          },
          {
            "q": "{水|みず}を＿＿{買|か}いました。　〔Mizu o __ kaimashita.〕　— Tôi đã mua hai chai nước.",
            "options": [
              "{二匹|にひき}",
              "{二本|にほん}",
              "{二人|ふたり}",
              "{二冊|にさつ}"
            ],
            "correct": 1,
            "why": "Chai (vật dài) → 本. → **{水|みず}を{二本|にほん}{買|か}いました。** 〔Mizu o nihon kaimashita.〕 — Tôi đã mua hai chai nước."
          },
          {
            "q": "{私|わたし}は{車|くるま}の＿＿ができます。　〔Watashi wa kuruma no __ ga dekimasu.〕　— Tôi biết lái ô tô.",
            "options": [
              "{運転|うんてん}",
              "{住所|じゅうしょ}",
              "{予約|よやく}",
              "{受付|うけつけ}"
            ],
            "correct": 0,
            "why": "車の運転 = việc lái ô tô. → **{私|わたし}は{車|くるま}の{運転|うんてん}ができます。** 〔Watashi wa kuruma no unten ga dekimasu.〕 — Tôi biết lái ô tô."
          },
          {
            "q": "{毎週|まいしゅう}{土曜日|どようび}、ピアノを＿＿います。　〔Maishuu doyoubi, piano o __ imasu.〕　— Thứ Bảy hàng tuần tôi học piano.",
            "options": [
              "{乗|の}って",
              "{習|なら}って",
              "{降|お}りて",
              "{集|あつ}めて"
            ],
            "correct": 1,
            "why": "Học (có thầy) = 習います → 習っています. → **{毎週|まいしゅう}{土曜日|どようび}、ピアノを{習|なら}っています。** 〔Maishuu doyoubi, piano o naratte imasu.〕 — Thứ Bảy hàng tuần tôi học piano."
          },
          {
            "q": "{三番|さんばん}のバスに＿＿、{駅|えき}で{降|お}ります。　〔Sanban no basu ni __, eki de orimasu.〕　— Lên xe buýt số 3 rồi xuống ở ga.",
            "options": [
              "{入|はい}って",
              "{降|お}りて",
              "{払|はら}って",
              "{乗|の}って"
            ],
            "correct": 3,
            "why": "Lên xe = N に 乗ります. → **{三番|さんばん}のバスに{乗|の}って、{駅|えき}で{降|お}ります。** 〔Sanban no basu ni notte, eki de orimasu.〕 — Lên xe buýt số 3 rồi xuống ở ga."
          },
          {
            "q": "あの{駅|えき}で{電車|でんしゃ}を＿＿。　〔Ano eki de densha o __.〕　— Tôi xuống tàu ở ga đó.",
            "options": [
              "{乗|の}ります",
              "{習|なら}います",
              "{降|お}ります",
              "{入|はい}ります"
            ],
            "correct": 2,
            "why": "Xuống tàu = 電車を降ります (乗ります đi với に). → **あの{駅|えき}で{電車|でんしゃ}を{降|お}ります。** 〔Ano eki de densha o orimasu.〕 — Tôi xuống tàu ở ga đó."
          },
          {
            "q": "{日本語|にほんご}のコンテストに＿＿。　〔Nihongo no kontesuto ni __.〕　— Tôi tham gia cuộc thi tiếng Nhật.",
            "options": [
              "{予約|よやく}します",
              "{降|お}ります",
              "{参加|さんか}します",
              "{運転|うんてん}します"
            ],
            "correct": 2,
            "why": "Tham gia = N に 参加します. → **{日本語|にほんご}のコンテストに{参加|さんか}します。** 〔Nihongo no kontesuto ni sanka shimasu.〕 — Tôi tham gia cuộc thi tiếng Nhật."
          },
          {
            "q": "インターネットでレストランを＿＿。　〔Intaanetto de resutoran o __.〕　— Tôi đã đặt chỗ nhà hàng trên mạng.",
            "options": [
              "{降|お}りました",
              "{予約|よやく}しました",
              "{参加|さんか}しました",
              "{払|はら}いました"
            ],
            "correct": 1,
            "why": "Đặt trước = 予約します. → **インターネットでレストランを{予約|よやく}しました。** 〔Intaanetto de resutoran o yoyaku shimashita.〕 — Tôi đã đặt chỗ nhà hàng trên mạng."
          },
          {
            "q": "レジでお{金|かね}を＿＿。　〔Reji de okane o __.〕　— Tôi trả tiền ở quầy thu ngân.",
            "options": [
              "{描|か}きます",
              "{泳|およ}ぎます",
              "{見|み}せます",
              "{払|はら}います"
            ],
            "correct": 3,
            "why": "Trả tiền = お金を払います. → **レジでお{金|かね}を{払|はら}います。** 〔Reji de okane o haraimasu.〕 — Tôi trả tiền ở quầy thu ngân."
          },
          {
            "q": "{受付|うけつけ}で{外国人登録証|がいこくじんとうろくしょう}を＿＿。　〔Uketsuke de gaikokujintourokushou o __.〕　— Tôi xuất trình thẻ ngoại kiều ở quầy lễ tân.",
            "options": [
              "{泳|およ}ぎます",
              "{払|はら}います",
              "{見|み}せます",
              "{乗|の}ります"
            ],
            "correct": 2,
            "why": "Cho xem giấy tờ = 見せます. → **{受付|うけつけ}で{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。** 〔Uketsuke de gaikokujintourokushou o misemasu.〕 — Tôi xuất trình thẻ ngoại kiều ở quầy lễ tân."
          },
          {
            "q": "ここに{名前|なまえ}と＿＿を{書|か}いてください。　〔Koko ni namae to __ o kaite kudasai.〕　— Hãy viết tên và địa chỉ vào đây.",
            "options": [
              "{宿題|しゅくだい}",
              "{釣|つ}り",
              "{住所|じゅうしょ}",
              "プール"
            ],
            "correct": 2,
            "why": "住所 = địa chỉ. → **ここに{名前|なまえ}と{住所|じゅうしょ}を{書|か}いてください。** 〔Koko ni namae to juusho o kaite kudasai.〕 — Hãy viết tên và địa chỉ vào đây."
          },
          {
            "q": "{今日|きょう}は＿＿がたくさんありますから、{遊|あそ}びに{行|い}きません。　〔Kyou wa __ ga takusan arimasu kara, asobini ikimasen.〕　— Hôm nay có nhiều bài tập nên tôi không đi chơi.",
            "options": [
              "{宿題|しゅくだい}",
              "{受付|うけつけ}",
              "ポップス",
              "{住所|じゅうしょ}"
            ],
            "correct": 0,
            "why": "宿題 = bài tập về nhà. → **{今日|きょう}は{宿題|しゅくだい}がたくさんありますから、{遊|あそ}びに{行|い}きません。** 〔Kyou wa shukudai ga takusan arimasu kara, asobini ikimasen.〕 — Hôm nay có nhiều bài tập nên tôi không đi chơi."
          },
          {
            "q": "{田中|たなか}さんの＿＿は{何番|なんばん}ですか。　〔Tanaka-san no __ wa nanban desu ka.〕　— Số điện thoại của anh Tanaka là số mấy?",
            "options": [
              "{宿題|しゅくだい}",
              "{住所|じゅうしょ}",
              "{電話番号|でんわばんごう}",
              "{受付|うけつけ}"
            ],
            "correct": 2,
            "why": "電話番号 = số điện thoại. → **{田中|たなか}さんの{電話番号|でんわばんごう}は{何番|なんばん}ですか。** 〔Tanaka-san no denwabangou wa nanban desu ka.〕 — Số điện thoại của anh Tanaka là số mấy?"
          },
          {
            "q": "{私|わたし}は{泳|およ}ぐことが＿＿。　〔Watashi wa oyogu koto ga __.〕　— Tôi biết bơi.",
            "options": [
              "{入|はい}ります",
              "{参加|さんか}します",
              "{習|なら}います",
              "できます"
            ],
            "correct": 3,
            "why": "V こと が できます = làm được. → **{私|わたし}は{泳|およ}ぐことができます。** 〔Watashi wa oyogu koto ga dekimasu.〕 — Tôi biết bơi."
          },
          {
            "q": "この{町|まち}には＿＿なイベントがあります。　〔Kono machi ni wa __ na ibento ga arimasu.〕　— Thị trấn này có nhiều loại sự kiện.",
            "options": [
              "いろいろ",
              "すごい",
              "{全然|ぜんぜん}",
              "{上手|じょうず}に"
            ],
            "correct": 0,
            "why": "いろいろな + N = nhiều loại N. → **この{町|まち}にはいろいろなイベントがあります。** 〔Kono machi ni wa iroiro na ibento ga arimasu.〕 — Thị trấn này có nhiều loại sự kiện."
          },
          {
            "q": "A：{私|わたし}は{日本語|にほんご}と{英語|えいご}と{中国語|ちゅうごくご}ができます。B：＿＿ですね。　〔A: watashi wa Nihongo to eigo to Chuugokugo ga dekimasu. B: __ desu ne.〕　— A: Tôi biết tiếng Nhật, tiếng Anh và tiếng Trung. B: Giỏi quá nhỉ.",
            "options": [
              "すごい",
              "{全然|ぜんぜん}",
              "だけ",
              "いろいろ"
            ],
            "correct": 0,
            "why": "Khen ngạc nhiên → すごいですね. → **A：{私|わたし}は{日本語|にほんご}と{英語|えいご}と{中国語|ちゅうごくご}ができます。B：すごいですね。** 〔A: watashi wa Nihongo to eigo to Chuugokugo ga dekimasu. B: sugoi desu ne.〕 — A: Tôi biết tiếng Nhật, tiếng Anh và tiếng Trung. B: Giỏi quá nhỉ."
          },
          {
            "q": "{私|わたし}は{音楽|おんがく}が{好|す}きです。＿＿ポップスが{好|す}きです。　〔Watashi wa ongaku ga suki desu. __ poppusu ga suki desu.〕　— Tôi thích âm nhạc. Đặc biệt là nhạc pop.",
            "options": [
              "{全然|ぜんぜん}",
              "{特|とく}に",
              "あまり",
              "だけ"
            ],
            "correct": 1,
            "why": "特に = đặc biệt là. → **{私|わたし}は{音楽|おんがく}が{好|す}きです。{特|とく}にポップスが{好|す}きです。** 〔Watashi wa ongaku ga suki desu. Tokuni poppusu ga suki desu.〕 — Tôi thích âm nhạc. Đặc biệt là nhạc pop."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-tv-go-tu",
        "title": "Gõ từ tiếng Nhật theo nghĩa (24 câu)",
        "kind": "translate",
        "items": [
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tem thư\"",
            "answers": [
              "切手",
              "きって"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tiểu thuyết\"",
            "answers": [
              "小説",
              "しょうせつ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"truyện tranh\"",
            "answers": [
              "漫画",
              "まんが",
              "マンガ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"câu cá\"",
            "answers": [
              "釣り",
              "つり"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bể bơi\"",
            "answers": [
              "プール"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bơi\"",
            "answers": [
              "泳ぎます",
              "およぎます",
              "泳ぐ",
              "およぐ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"vẽ (tranh)\"",
            "answers": [
              "描きます",
              "かきます",
              "描く",
              "かく"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"sưu tầm\"",
            "answers": [
              "集めます",
              "あつめます",
              "集める",
              "あつめる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"lái (xe)\"",
            "answers": [
              "運転します",
              "うんてんします",
              "運転する",
              "うんてんする"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"gần đây, dạo này\"",
            "answers": [
              "最近",
              "さいきん"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"luôn luôn\"",
            "answers": [
              "いつも"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"thỉnh thoảng\"",
            "answers": [
              "ときどき"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"hoàn toàn (không)\"",
            "answers": [
              "全然",
              "ぜんぜん"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"chỉ\"",
            "answers": [
              "だけ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"thư pháp\"",
            "answers": [
              "書道",
              "しょどう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"học (có người dạy)\"",
            "answers": [
              "習います",
              "ならいます",
              "習う",
              "ならう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đăng ký\"",
            "answers": [
              "申し込みます",
              "申しこみます",
              "もうし込みます",
              "もうしこみます",
              "申し込む",
              "申しこむ",
              "もうし込む",
              "もうしこむ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"địa chỉ\"",
            "answers": [
              "住所",
              "じゅうしょ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bài tập về nhà\"",
            "answers": [
              "宿題",
              "しゅくだい"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"số điện thoại\"",
            "answers": [
              "電話番号",
              "でんわばんごう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"trả (tiền)\"",
            "answers": [
              "払います",
              "はらいます",
              "払う",
              "はらう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"xuống (xe, tàu)\"",
            "answers": [
              "降ります",
              "おります",
              "降りる",
              "おりる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đặt trước\"",
            "answers": [
              "予約します",
              "よやくします",
              "予約する",
              "よやくする"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"làm thế nào\"",
            "answers": [
              "どうやって"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · tìm câu SAI · đọc câu · dịch · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-sai",
        "title": "Tìm câu SAI (7 câu)",
        "items": [
          {
            "q": "(乗ります)　Câu nào SAI?",
            "options": [
              "バスに{乗|の}ります。 (Basu ni norimasu.)",
              "バスを{乗|の}ります。 (Basu o norimasu.)",
              "{駅|えき}でバスを{降|お}ります。 (Eki de basu o orimasu.)",
              "バスを{降|お}ります。 (Basu o orimasu.)"
            ],
            "correct": 1,
            "why": "Lên xe: N **に** 乗ります; xuống xe: N **を** 降ります."
          },
          {
            "q": "(できます)　Câu nào SAI?",
            "options": [
              "スキーができます。 (Sukii ga dekimasu.)",
              "{泳|およ}ぐことができます。 (Oyogu koto ga dekimasu.)",
              "スキーをできます。 (Sukii o dekimasu.)",
              "{日本語|にほんご}が{少|すこ}しできます。 (Nihongo ga sukoshi dekimasu.)"
            ],
            "correct": 2,
            "why": "できます đi với **が**."
          },
          {
            "q": "(あまり)　Câu nào SAI?",
            "options": [
              "{映画|えいが}をあまり{見|み}ます。 (Eiga o amari mimasu.)",
              "{映画|えいが}をときどき{見|み}ます。 (Eiga o tokidoki mimasu.)",
              "{映画|えいが}をよく{見|み}ます。 (Eiga o yoku mimasu.)",
              "{映画|えいが}をあまり{見|み}ません。 (Eiga o amari mimasen.)"
            ],
            "correct": 0,
            "why": "あまり luôn đi với thể **phủ định** (～ません)."
          },
          {
            "q": "(描きます／書きます)　Câu nào SAI?",
            "options": [
              "{絵|え}を{描|か}きます。 (E o kakimasu.)",
              "{名前|なまえ}を{書|か}きます。 (Namae o kakimasu.)",
              "{手紙|てがみ}を{描|か}きます。 (Tegami o kakimasu.)",
              "{手紙|てがみ}を{書|か}きます。 (Tegami o kakimasu.)"
            ],
            "correct": 2,
            "why": "Viết chữ, thư → **書きます**; vẽ tranh → 描きます."
          },
          {
            "q": "(từ đếm)　Câu nào SAI?",
            "options": [
              "{本|ほん}を{二冊|にさつ}{読|よ}みました。 (Hon o nisatsu yomimashita.)",
              "コーヒーを{二冊|にさつ}{飲|の}みました。 (Koohii o nisatsu nomimashita.)",
              "コーヒーを{二杯|にはい}{飲|の}みました。 (Koohii o nihai nomimashita.)",
              "ペンを{二本|にほん}{買|か}いました。 (Pen o nihon kaimashita.)"
            ],
            "correct": 1,
            "why": "Cà phê (cốc) → **杯**; 冊 dùng cho sách."
          },
          {
            "q": "(入ります)　Câu nào SAI?",
            "options": [
              "イベントに{参加|さんか}しました。 (Ibento ni sanka shimashita.)",
              "{書道|しょどう}{教室|きょうしつ}に{申|もう}し{込|こ}みました。 (Shodou kyoushitsu ni moushikomimashita.)",
              "ダンスクラブを{入|はい}りました。 (Dansu kurabu o hairimashita.)",
              "ダンスクラブに{入|はい}りました。 (Dansu kurabu ni hairimashita.)"
            ],
            "correct": 2,
            "why": "Vào CLB: N **に** 入ります."
          },
          {
            "q": "(だけ)　Câu nào SAI?",
            "options": [
              "だけ{日曜日|にちようび}{休|やす}みます。 (Dake nichiyoubi yasumimasu.)",
              "コーヒーだけ{飲|の}みます。 (Koohii dake nomimasu.)",
              "{日曜日|にちようび}だけ{休|やす}みます。 (Nichiyoubi dake yasumimasu.)",
              "{一回|いっかい}だけ{行|い}きました。 (Ikkai dake ikimashita.)"
            ],
            "correct": 0,
            "why": "だけ đứng **sau** từ được giới hạn: 日曜日だけ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-tv-nhat-viet",
        "title": "Đọc câu Nhật → chọn nghĩa Việt (8 câu)",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。　〔Shumi wa kitte o atsumeru koto desu.〕",
            "options": [
              "Sở thích của tôi là gửi thư.",
              "Sở thích của tôi là vẽ tem.",
              "Tôi đã mua tem.",
              "Sở thích của tôi là sưu tầm tem."
            ],
            "correct": 3,
            "why": "切手を 集める こと = việc sưu tầm tem."
          },
          {
            "q": "Câu này nghĩa là gì? {最近|さいきん}、{全然|ぜんぜん}{泳|およ}ぎません。　〔Saikin, zenzen oyogimasen.〕",
            "options": [
              "Dạo này tôi hoàn toàn không bơi.",
              "Gần đây tôi bơi một chút.",
              "Dạo này tôi không bơi giỏi.",
              "Dạo này tôi bơi rất nhiều."
            ],
            "correct": 0,
            "why": "全然 + ません = hoàn toàn không."
          },
          {
            "q": "Câu này nghĩa là gì? {一週間|いっしゅうかん}に{三回|さんかい}ダンスを{習|なら}っています。　〔Isshuukan ni sankai dansu o naratte imasu.〕",
            "options": [
              "Ba tuần tôi học nhảy một lần.",
              "Tôi dạy nhảy ba lần một tuần.",
              "Tôi học nhảy được ba tuần.",
              "Mỗi tuần tôi học nhảy ba buổi."
            ],
            "correct": 3,
            "why": "一週間に 三回 = một tuần ba lần."
          },
          {
            "q": "Câu này nghĩa là gì? {受付|うけつけ}で{住所|じゅうしょ}を{言|い}ってください。　〔Uketsuke de juusho o itte kudasai.〕",
            "options": [
              "Hãy nói địa chỉ ở quầy lễ tân.",
              "Quầy lễ tân ở địa chỉ này.",
              "Hãy viết địa chỉ ở quầy lễ tân.",
              "Hãy hỏi địa chỉ quầy lễ tân."
            ],
            "correct": 0,
            "why": "言って ください = hãy nói."
          },
          {
            "q": "Câu này nghĩa là gì? どうやって{図書館|としょかん}のカードを{作|つく}りますか。　〔Douyatte toshokan no kaado o tsukurimasu ka.〕",
            "options": [
              "Tại sao phải làm thẻ thư viện?",
              "Thẻ thư viện ở đâu?",
              "Làm thẻ thư viện bằng cách nào?",
              "Khi nào làm thẻ thư viện?"
            ],
            "correct": 2,
            "why": "どうやって = bằng cách nào."
          },
          {
            "q": "Câu này nghĩa là gì? {私|わたし}は{車|くるま}の{運転|うんてん}ができません。　〔Watashi wa kuruma no unten ga dekimasen.〕",
            "options": [
              "Tôi không lái ô tô hôm nay.",
              "Tôi không có ô tô.",
              "Tôi không thích lái ô tô.",
              "Tôi không biết lái ô tô."
            ],
            "correct": 3,
            "why": "運転が できません = không lái được."
          },
          {
            "q": "Câu này nghĩa là gì? {特|とく}にアクション{映画|えいが}が{好|す}きです。　〔Tokuni akushon eiga ga suki desu.〕",
            "options": [
              "Tôi chỉ xem phim hành động.",
              "Tôi đặc biệt thích phim hành động.",
              "Phim hành động rất đặc biệt.",
              "Tôi không thích phim hành động."
            ],
            "correct": 1,
            "why": "特に = đặc biệt là."
          },
          {
            "q": "Câu này nghĩa là gì? コーヒーだけ{飲|の}みます。　〔Koohii dake nomimasu.〕",
            "options": [
              "Tôi chỉ uống cà phê.",
              "Tôi uống cà phê nhiều.",
              "Tôi uống cà phê và trà.",
              "Tôi không uống cà phê."
            ],
            "correct": 0,
            "why": "だけ = chỉ."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-tv-dich",
        "title": "Dịch Việt → Nhật bằng từ của bài (12 câu)",
        "kind": "translate",
        "grammar": "V辞書形 こと · N が できます · ～に～回 · どうやって",
        "items": [
          {
            "q": "Sở thích của tôi là đọc truyện tranh.",
            "answers": [
              "私の趣味は漫画を読むことです。",
              "私の趣味は漫画をよむことです。",
              "私の趣味はまんがを読むことです。",
              "私の趣味はまんがをよむことです。",
              "私のしゅみは漫画を読むことです。",
              "私のしゅみは漫画をよむことです。",
              "私のしゅみはまんがを読むことです。",
              "私のしゅみはまんがをよむことです。",
              "わたしの趣味は漫画を読むことです。",
              "わたしの趣味は漫画をよむことです。",
              "わたしの趣味はまんがを読むことです。",
              "わたしの趣味はまんがをよむことです。",
              "わたしのしゅみは漫画を読むことです。",
              "わたしのしゅみは漫画をよむことです。",
              "わたしのしゅみはまんがを読むことです。",
              "わたしのしゅみはまんがをよむことです。",
              "趣味は漫画を読むことです。",
              "趣味は漫画をよむことです。",
              "趣味はまんがを読むことです。",
              "趣味はまんがをよむことです。",
              "しゅみは漫画を読むことです。",
              "しゅみは漫画をよむことです。",
              "しゅみはまんがを読むことです。",
              "しゅみはまんがをよむことです。",
              "趣味は漫画です。",
              "趣味はまんがです。",
              "しゅみは漫画です。",
              "しゅみはまんがです。"
            ],
            "hint": "趣味は V こと です"
          },
          {
            "q": "Tôi biết lái ô tô.",
            "answers": [
              "車の運転ができます。",
              "車のうんてんができます。",
              "くるまの運転ができます。",
              "くるまのうんてんができます。",
              "私は車の運転ができます。",
              "私は車のうんてんができます。",
              "私はくるまの運転ができます。",
              "私はくるまのうんてんができます。",
              "わたしは車の運転ができます。",
              "わたしは車のうんてんができます。",
              "わたしはくるまの運転ができます。",
              "わたしはくるまのうんてんができます。",
              "車を運転することができます。",
              "車をうんてんすることができます。",
              "くるまを運転することができます。",
              "くるまをうんてんすることができます。"
            ],
            "hint": "N が できます"
          },
          {
            "q": "Một ngày tôi uống hai cốc cà phê.",
            "answers": [
              "一日にコーヒーを二杯飲みます。",
              "一日にコーヒーを二杯のみます。",
              "一日にコーヒーをにはい飲みます。",
              "一日にコーヒーをにはいのみます。",
              "いちにちにコーヒーを二杯飲みます。",
              "いちにちにコーヒーを二杯のみます。",
              "いちにちにコーヒーをにはい飲みます。",
              "いちにちにコーヒーをにはいのみます。",
              "1日にコーヒーを2杯飲みます。",
              "1日にコーヒーを2杯のみます。",
              "1日にコーヒーをにはい飲みます。",
              "1日にコーヒーをにはいのみます。",
              "いちにちにコーヒーを2杯飲みます。",
              "いちにちにコーヒーを2杯のみます。"
            ],
            "hint": "～に ～杯"
          },
          {
            "q": "Thỉnh thoảng tôi đi câu cá.",
            "answers": [
              "ときどき釣りをします。",
              "ときどきつりをします。",
              "私はときどき釣りをします。",
              "私はときどきつりをします。",
              "わたしはときどき釣りをします。",
              "わたしはときどきつりをします。",
              "ときどき釣りに行きます。",
              "ときどき釣りにいきます。",
              "ときどきつりに行きます。",
              "ときどきつりにいきます。"
            ],
            "hint": "ときどき"
          },
          {
            "q": "Tôi đã đăng ký lớp thư pháp.",
            "answers": [
              "書道教室に申し込みました。",
              "書道教室に申しこみました。",
              "書道教室にもうし込みました。",
              "書道教室にもうしこみました。",
              "書道きょうしつに申し込みました。",
              "書道きょうしつに申しこみました。",
              "書道きょうしつにもうし込みました。",
              "書道きょうしつにもうしこみました。",
              "しょどう教室に申し込みました。",
              "しょどう教室に申しこみました。",
              "しょどう教室にもうし込みました。",
              "しょどう教室にもうしこみました。",
              "しょどうきょうしつに申し込みました。",
              "しょどうきょうしつに申しこみました。",
              "しょどうきょうしつにもうし込みました。",
              "しょどうきょうしつにもうしこみました。",
              "私は書道教室に申し込みました。",
              "私は書道教室に申しこみました。",
              "私は書道教室にもうし込みました。",
              "私は書道教室にもうしこみました。",
              "私は書道きょうしつに申し込みました。",
              "私は書道きょうしつに申しこみました。",
              "私は書道きょうしつにもうし込みました。",
              "私は書道きょうしつにもうしこみました。",
              "私はしょどう教室に申し込みました。",
              "私はしょどう教室に申しこみました。",
              "私はしょどう教室にもうし込みました。",
              "私はしょどう教室にもうしこみました。",
              "私はしょどうきょうしつに申し込みました。",
              "私はしょどうきょうしつに申しこみました。",
              "私はしょどうきょうしつにもうし込みました。",
              "私はしょどうきょうしつにもうしこみました。",
              "わたしは書道教室に申し込みました。",
              "わたしは書道教室に申しこみました。",
              "わたしは書道教室にもうし込みました。",
              "わたしは書道教室にもうしこみました。",
              "わたしは書道きょうしつに申し込みました。",
              "わたしは書道きょうしつに申しこみました。",
              "わたしは書道きょうしつにもうし込みました。",
              "わたしは書道きょうしつにもうしこみました。",
              "わたしはしょどう教室に申し込みました。",
              "わたしはしょどう教室に申しこみました。",
              "わたしはしょどう教室にもうし込みました。",
              "わたしはしょどう教室にもうしこみました。",
              "わたしはしょどうきょうしつに申し込みました。",
              "わたしはしょどうきょうしつに申しこみました。",
              "わたしはしょどうきょうしつにもうし込みました。",
              "わたしはしょどうきょうしつにもうしこみました。"
            ],
            "hint": "N に 申し込みます"
          },
          {
            "q": "Hãy trả tiền ở quầy lễ tân.",
            "answers": [
              "受付でお金を払ってください。",
              "受付でお金をはらってください。",
              "受付でおかねを払ってください。",
              "受付でおかねをはらってください。",
              "うけつけでお金を払ってください。",
              "うけつけでお金をはらってください。",
              "うけつけでおかねを払ってください。",
              "うけつけでおかねをはらってください。"
            ],
            "hint": "V て ください"
          },
          {
            "q": "Hãy lên xe buýt số 5.",
            "answers": [
              "五番のバスに乗ってください。",
              "五番のバスにのってください。",
              "ごばんのバスに乗ってください。",
              "ごばんのバスにのってください。",
              "5番のバスに乗ってください。",
              "5番のバスにのってください。"
            ],
            "hint": "N に 乗ります"
          },
          {
            "q": "Dạo này tôi hoàn toàn không xem phim truyền hình.",
            "answers": [
              "最近、全然ドラマを見ません。",
              "最近、全然ドラマをみません。",
              "最近、ぜんぜんドラマを見ません。",
              "最近、ぜんぜんドラマをみません。",
              "さいきん、全然ドラマを見ません。",
              "さいきん、全然ドラマをみません。",
              "さいきん、ぜんぜんドラマを見ません。",
              "さいきん、ぜんぜんドラマをみません。",
              "最近、ドラマを全然見ません。",
              "最近、ドラマを全然みません。",
              "最近、ドラマをぜんぜん見ません。",
              "最近、ドラマをぜんぜんみません。",
              "さいきん、ドラマを全然見ません。",
              "さいきん、ドラマを全然みません。",
              "さいきん、ドラマをぜんぜん見ません。",
              "さいきん、ドラマをぜんぜんみません。"
            ],
            "hint": "全然 ～ません"
          },
          {
            "q": "Tôi đặc biệt thích nhạc pop.",
            "answers": [
              "特にポップスが好きです。",
              "特にポップスがすきです。",
              "とくにポップスが好きです。",
              "とくにポップスがすきです。"
            ],
            "hint": "特に"
          },
          {
            "q": "Đi đến bể bơi bằng cách nào?",
            "answers": [
              "どうやってプールへ行きますか。",
              "どうやってプールへいきますか。",
              "どうやってプールに行きますか。",
              "どうやってプールにいきますか。"
            ],
            "hint": "どうやって"
          },
          {
            "q": "Tôi muốn tham gia sự kiện.",
            "answers": [
              "イベントに参加したいです。",
              "イベントにさんかしたいです。",
              "私はイベントに参加したいです。",
              "私はイベントにさんかしたいです。",
              "わたしはイベントに参加したいです。",
              "わたしはイベントにさんかしたいです。"
            ],
            "hint": "N に 参加します"
          },
          {
            "q": "Tôi chỉ đọc một quyển.",
            "answers": [
              "一冊だけ読みます。",
              "一冊だけよみます。",
              "いっさつだけ読みます。",
              "いっさつだけよみます。",
              "一冊だけ読みました。",
              "一冊だけよみました。",
              "いっさつだけ読みました。",
              "いっさつだけよみました。",
              "1冊だけ読みます。",
              "1冊だけよみます。"
            ],
            "hint": "～だけ"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-tv-ghep",
        "title": "Ghép câu bằng từ vựng Bài 9 (8 câu)",
        "items": [
          {
            "vi": "Sở thích của tôi là sưu tầm tem.",
            "chips": [
              "{私|わたし}の{趣味|しゅみ}は",
              "ことです",
              "{集|あつ}めます",
              "{切手|きって}を",
              "{集|あつ}める"
            ],
            "answer": [
              "{私|わたし}の{趣味|しゅみ}は",
              "{切手|きって}を",
              "{集|あつ}める",
              "ことです"
            ],
            "ro": "Watashi no shumi wa kitte o atsumeru koto desu"
          },
          {
            "vi": "Tôi biết bơi.",
            "chips": [
              "を",
              "できます",
              "が",
              "{私|わたし}は",
              "{泳|およ}ぐこと"
            ],
            "answer": [
              "{私|わたし}は",
              "{泳|およ}ぐこと",
              "が",
              "できます"
            ],
            "ro": "Watashi wa oyogu koto ga dekimasu"
          },
          {
            "vi": "Một tuần tôi đi bể bơi hai lần.",
            "chips": [
              "プールへ",
              "{二杯|にはい}",
              "{一週間|いっしゅうかん}に",
              "{二回|にかい}",
              "{行|い}きます"
            ],
            "answer": [
              "{一週間|いっしゅうかん}に",
              "{二回|にかい}",
              "プールへ",
              "{行|い}きます"
            ],
            "ro": "Isshuukan ni nikai puuru e ikimasu",
            "alt": [
              [
                "{一週間|いっしゅうかん}に",
                "プールへ",
                "{二回|にかい}",
                "{行|い}きます"
              ]
            ]
          },
          {
            "vi": "Lên tàu điện rồi xuống ở ga Shinjuku.",
            "chips": [
              "{電車|でんしゃ}に",
              "{新宿|しんじゅく}{駅|えき}で",
              "{電車|でんしゃ}を",
              "{乗|の}って、",
              "{降|お}ります"
            ],
            "answer": [
              "{電車|でんしゃ}に",
              "{乗|の}って、",
              "{新宿|しんじゅく}{駅|えき}で",
              "{降|お}ります"
            ],
            "ro": "Densha ni notte, Shinjuku eki de orimasu"
          },
          {
            "vi": "Tôi đã đặt trước nhà hàng.",
            "chips": [
              "に",
              "しました",
              "{予約|よやく}",
              "レストランを"
            ],
            "answer": [
              "レストランを",
              "{予約|よやく}",
              "しました"
            ],
            "ro": "Resutoran o yoyaku shimashita"
          },
          {
            "vi": "Dạo này tôi không đọc sách mấy.",
            "chips": [
              "{読|よ}みます",
              "{本|ほん}を",
              "{最近|さいきん}、",
              "あまり",
              "{読|よ}みません"
            ],
            "answer": [
              "{最近|さいきん}、",
              "{本|ほん}を",
              "あまり",
              "{読|よ}みません"
            ],
            "ro": "Saikin, hon o amari yomimasen",
            "alt": [
              [
                "{最近|さいきん}、",
                "あまり",
                "{本|ほん}を",
                "{読|よ}みません"
              ]
            ]
          },
          {
            "vi": "Hãy cho tôi xem thẻ ngoại kiều.",
            "chips": [
              "{外国人登録証|がいこくじんとうろくしょう}を",
              "{見|み}て",
              "ください",
              "{見|み}せて"
            ],
            "answer": [
              "{外国人登録証|がいこくじんとうろくしょう}を",
              "{見|み}せて",
              "ください"
            ],
            "ro": "Gaikokujintourokushou o misete kudasai"
          },
          {
            "vi": "Tôi đã vào câu lạc bộ nhảy của trường.",
            "chips": [
              "ダンスクラブを",
              "ダンスクラブに",
              "{大学|だいがく}の",
              "{入|はい}りました"
            ],
            "answer": [
              "{大学|だいがく}の",
              "ダンスクラブに",
              "{入|はい}りました"
            ],
            "ro": "Daigaku no dansu kurabu ni hairimashita"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b9-chu-han",
    "kind": "kanji",
    "title": "Luyện thêm Bài 9 · Chữ Hán của lớp (泳乗習運転集描歌遊) — đọc · nghĩa · chọn chữ · đọc không furigana",
    "goal": "Đọc đúng, hiểu nghĩa 9 chữ Hán Bài 9 (sở thích, khả năng) và các từ ghép (水泳, 運転, 自転車, 練習, 歌手…), phân biệt chữ na ná (泳/永/氷, 描/猫/書, 遊/旅/族…), đọc câu/đoạn không furigana như đề thi.",
    "minutes": 65,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Học **chữ theo từ + động từ**: 泳ぎます – 水泳 · 乗ります – 乗り物 · 習います – 練習 · 運転 – 自転車 · 集めます – 集まります · 描きます · 歌 – 歌います – 歌手 · 遊びます – 遊園地.",
          "Chữ **na ná**: 泳/永/氷 (có bộ 氵 mới là bơi) · 描/猫/苗 · 描 (vẽ) vs 書 (viết) — cùng đọc かきます · 習/羽 · 運/連/軍 · 転/伝 · 遊/旅/族. Mỗi lần sai, viết chữ đúng 5 lần kèm từ.",
          "Mức Khó không furigana: chỉ dùng chữ đã học đến Bài 9 (còn lại viết hiragana như đề thi). Đọc to cả câu rồi mới bấm xem."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nghĩa chữ · cách đọc từ ghép"
      },
      {
        "t": "table",
        "head": [
          "Chữ",
          "Nghĩa",
          "Hán Việt · On/Kun",
          "Từ hay gặp"
        ],
        "rows": [
          [
            "泳",
            "bơi",
            "VỊNH — On エイ · Kun およ・ぎます",
            "泳ぎます · 水泳"
          ],
          [
            "乗",
            "lên, đi (xe, tàu)",
            "THỪA — On ジョウ · Kun の・ります",
            "乗ります · 乗り物"
          ],
          [
            "習",
            "học, luyện tập",
            "TẬP — On シュウ · Kun なら・います",
            "習います · 練習 · 習慣"
          ],
          [
            "運",
            "chở, vận chuyển; vận may",
            "VẬN — On ウン · Kun はこ・びます",
            "運転 · 運動"
          ],
          [
            "転",
            "lăn, chuyển",
            "CHUYỂN — On テン · Kun ころ・びます",
            "運転 · 自転車"
          ],
          [
            "集",
            "tụ tập, thu thập",
            "TẬP — On シュウ · Kun あつ・めます・あつ・まります",
            "集めます · 集まります · 集合"
          ],
          [
            "描",
            "vẽ (tranh), miêu tả",
            "MIÊU — On ビョウ · Kun か・きます",
            "描きます · 絵を描きます"
          ],
          [
            "歌",
            "bài hát, hát",
            "CA — On カ · Kun うた・うた・います",
            "歌 · 歌います · 歌手"
          ],
          [
            "遊",
            "chơi, đi chơi",
            "DU — On ユウ · Kun あそ・びます",
            "遊びます · 遊びに行きます · 遊園地"
          ]
        ],
        "caption": "9 chữ Hán của lớp Bài 9"
      },
      {
        "t": "mcq",
        "id": "lt-b9-kj-nghia",
        "title": "Chữ → nghĩa (9 câu)",
        "items": [
          {
            "q": "Chữ 「泳」 mang nghĩa nào?",
            "options": [
              "học, luyện tập",
              "lên, đi (xe, tàu)",
              "bơi",
              "bài hát, hát"
            ],
            "correct": 2,
            "why": "**泳** = bơi (VỊNH — On エイ · Kun およ・ぎます). Hay gặp: 泳ぎます · 水泳."
          },
          {
            "q": "Chữ 「乗」 mang nghĩa nào?",
            "options": [
              "lên, đi (xe, tàu)",
              "vẽ (tranh), miêu tả",
              "học, luyện tập",
              "tụ tập, thu thập"
            ],
            "correct": 0,
            "why": "**乗** = lên, đi (xe, tàu) (THỪA — On ジョウ · Kun の・ります). Hay gặp: 乗ります · 乗り物."
          },
          {
            "q": "Chữ 「習」 mang nghĩa nào?",
            "options": [
              "bài hát, hát",
              "học, luyện tập",
              "bơi",
              "lên, đi (xe, tàu)"
            ],
            "correct": 1,
            "why": "**習** = học, luyện tập (TẬP — On シュウ · Kun なら・います). Hay gặp: 習います · 練習 · 習慣."
          },
          {
            "q": "Chữ 「運」 mang nghĩa nào?",
            "options": [
              "chơi, đi chơi",
              "tụ tập, thu thập",
              "chở, vận chuyển; vận may",
              "lăn, chuyển"
            ],
            "correct": 2,
            "why": "**運** = chở, vận chuyển; vận may (VẬN — On ウン · Kun はこ・びます). Hay gặp: 運転 · 運動."
          },
          {
            "q": "Chữ 「転」 mang nghĩa nào?",
            "options": [
              "lăn, chuyển",
              "chơi, đi chơi",
              "tụ tập, thu thập",
              "học, luyện tập"
            ],
            "correct": 0,
            "why": "**転** = lăn, chuyển (CHUYỂN — On テン · Kun ころ・びます). Hay gặp: 運転 · 自転車."
          },
          {
            "q": "Chữ 「集」 mang nghĩa nào?",
            "options": [
              "tụ tập, thu thập",
              "học, luyện tập",
              "chở, vận chuyển; vận may",
              "vẽ (tranh), miêu tả"
            ],
            "correct": 0,
            "why": "**集** = tụ tập, thu thập (TẬP — On シュウ · Kun あつ・めます・あつ・まります). Hay gặp: 集めます · 集まります · 集合."
          },
          {
            "q": "Chữ 「描」 mang nghĩa nào?",
            "options": [
              "chở, vận chuyển; vận may",
              "bài hát, hát",
              "lăn, chuyển",
              "vẽ (tranh), miêu tả"
            ],
            "correct": 3,
            "why": "**描** = vẽ (tranh), miêu tả (MIÊU — On ビョウ · Kun か・きます). Hay gặp: 描きます · 絵を描きます."
          },
          {
            "q": "Chữ 「歌」 mang nghĩa nào?",
            "options": [
              "vẽ (tranh), miêu tả",
              "bơi",
              "học, luyện tập",
              "bài hát, hát"
            ],
            "correct": 3,
            "why": "**歌** = bài hát, hát (CA — On カ · Kun うた・うた・います). Hay gặp: 歌 · 歌います · 歌手."
          },
          {
            "q": "Chữ 「遊」 mang nghĩa nào?",
            "options": [
              "bài hát, hát",
              "chơi, đi chơi",
              "tụ tập, thu thập",
              "vẽ (tranh), miêu tả"
            ],
            "correct": 1,
            "why": "**遊** = chơi, đi chơi (DU — On ユウ · Kun あそ・びます). Hay gặp: 遊びます · 遊びに行きます · 遊園地."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-kj-nghia2",
        "title": "Nghĩa → chữ (9 câu)",
        "items": [
          {
            "q": "Chữ nào có nghĩa \"bơi\"?",
            "options": [
              "泳",
              "転",
              "歌",
              "運"
            ],
            "correct": 0,
            "why": "**泳** = bơi (VỊNH — On エイ · Kun およ・ぎます). Hay gặp: 泳ぎます · 水泳."
          },
          {
            "q": "Chữ nào có nghĩa \"lên, đi (xe, tàu)\"?",
            "options": [
              "集",
              "泳",
              "乗",
              "習"
            ],
            "correct": 2,
            "why": "**乗** = lên, đi (xe, tàu) (THỪA — On ジョウ · Kun の・ります). Hay gặp: 乗ります · 乗り物."
          },
          {
            "q": "Chữ nào có nghĩa \"học, luyện tập\"?",
            "options": [
              "転",
              "歌",
              "習",
              "遊"
            ],
            "correct": 2,
            "why": "**習** = học, luyện tập (TẬP — On シュウ · Kun なら・います). Hay gặp: 習います · 練習 · 習慣."
          },
          {
            "q": "Chữ nào có nghĩa \"chở, vận chuyển; vận may\"?",
            "options": [
              "泳",
              "描",
              "運",
              "習"
            ],
            "correct": 2,
            "why": "**運** = chở, vận chuyển; vận may (VẬN — On ウン · Kun はこ・びます). Hay gặp: 運転 · 運動."
          },
          {
            "q": "Chữ nào có nghĩa \"lăn, chuyển\"?",
            "options": [
              "歌",
              "描",
              "転",
              "乗"
            ],
            "correct": 2,
            "why": "**転** = lăn, chuyển (CHUYỂN — On テン · Kun ころ・びます). Hay gặp: 運転 · 自転車."
          },
          {
            "q": "Chữ nào có nghĩa \"tụ tập, thu thập\"?",
            "options": [
              "習",
              "乗",
              "歌",
              "集"
            ],
            "correct": 3,
            "why": "**集** = tụ tập, thu thập (TẬP — On シュウ · Kun あつ・めます・あつ・まります). Hay gặp: 集めます · 集まります · 集合."
          },
          {
            "q": "Chữ nào có nghĩa \"vẽ (tranh), miêu tả\"?",
            "options": [
              "遊",
              "集",
              "習",
              "描"
            ],
            "correct": 3,
            "why": "**描** = vẽ (tranh), miêu tả (MIÊU — On ビョウ · Kun か・きます). Hay gặp: 描きます · 絵を描きます."
          },
          {
            "q": "Chữ nào có nghĩa \"bài hát, hát\"?",
            "options": [
              "集",
              "歌",
              "習",
              "転"
            ],
            "correct": 1,
            "why": "**歌** = bài hát, hát (CA — On カ · Kun うた・うた・います). Hay gặp: 歌 · 歌います · 歌手."
          },
          {
            "q": "Chữ nào có nghĩa \"chơi, đi chơi\"?",
            "options": [
              "運",
              "集",
              "遊",
              "転"
            ],
            "correct": 2,
            "why": "**遊** = chơi, đi chơi (DU — On ユウ · Kun あそ・びます). Hay gặp: 遊びます · 遊びに行きます · 遊園地."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-kj-doc",
        "title": "Đọc từ ghép / từ có chữ Hán của bài (20 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　【泳ぎます】",
            "options": [
              "ながぎます (nagagimasu)",
              "およぎます (oyogimasu)",
              "およきます (oyokimasu)",
              "えいぎます (eigimasu)"
            ],
            "correct": 1,
            "why": "泳ぎます = およぎます (oyogimasu) — bơi — Kun およ(ぐ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【水泳】",
            "options": [
              "すいえ (suie)",
              "すいえい (suiei)",
              "みずおよぎ (mizuoyogi)",
              "すいおよ (suioyo)"
            ],
            "correct": 1,
            "why": "水泳 = すいえい (suiei) — bơi lội (môn thể thao) — On えい."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【乗ります】",
            "options": [
              "かります (karimasu)",
              "のります (norimasu)",
              "のりります (noririmasu)",
              "じょうります (jourimasu)"
            ],
            "correct": 1,
            "why": "乗ります = のります (norimasu) — lên, đi (xe) — Kun の(る)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【乗り物】",
            "options": [
              "じょうぶつ (joubutsu)",
              "のりもの (norimono)",
              "のるもの (norumono)",
              "のりぶつ (noributsu)"
            ],
            "correct": 1,
            "why": "乗り物 = のりもの (norimono) — phương tiện, trò chơi có ngồi lên."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【習います】",
            "options": [
              "ならいいます (naraiimasu)",
              "ならいます (naraimasu)",
              "しゅういます (shuuimasu)",
              "ならします (narashimasu)"
            ],
            "correct": 1,
            "why": "習います = ならいます (naraimasu) — học (có người dạy) — Kun なら(う)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【練習】",
            "options": [
              "ねんしゅう (nenshuu)",
              "れんしゅ (renshu)",
              "れんしゅう (renshuu)",
              "れんならい (rennarai)"
            ],
            "correct": 2,
            "why": "練習 = れんしゅう (renshuu) — luyện tập — 習 đọc On しゅう (う dài)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【運転】",
            "options": [
              "ゆんてん (yunten)",
              "うんでん (unden)",
              "うんてん (unten)",
              "うんて (unte)"
            ],
            "correct": 2,
            "why": "運転 = うんてん (unten) — lái xe — 運 うん + 転 てん."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【運動】",
            "options": [
              "うんとう (untou)",
              "うんどう (undou)",
              "うんど (undo)",
              "うごき (ugoki)"
            ],
            "correct": 1,
            "why": "運動 = うんどう (undou) — vận động, thể dục."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【自転車】",
            "options": [
              "じでんしゃ (jidensha)",
              "じしゃ (jisha)",
              "じてんくるま (jitenkuruma)",
              "じてんしゃ (jitensha)"
            ],
            "correct": 3,
            "why": "自転車 = じてんしゃ (jitensha) — xe đạp — 転 đọc てん (không có ゛)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【集めます】",
            "options": [
              "しゅうめます (shuumemasu)",
              "あつめます (atsumemasu)",
              "あづめます (azumemasu)",
              "しゅめます (shumemasu)"
            ],
            "correct": 1,
            "why": "集めます = あつめます (atsumemasu) — sưu tầm — Kun あつ(める)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【集まります】",
            "options": [
              "あづまります (azumarimasu)",
              "あつまります (atsumarimasu)",
              "あつめます (atsumemasu)",
              "しゅうまります (shuumarimasu)"
            ],
            "correct": 1,
            "why": "集まります = あつまります (atsumarimasu) — tập trung, tụ tập (tự động từ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【描きます】",
            "options": [
              "かいきます (kaikimasu)",
              "びょうきます (byoukimasu)",
              "かきます (kakimasu)",
              "がきます (gakimasu)"
            ],
            "correct": 2,
            "why": "描きます = かきます (kakimasu) — vẽ — đọc giống 書きます."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【絵を描きます】",
            "options": [
              "えをびょうきます (eobyoukimasu)",
              "かいをかきます (kaiokakimasu)",
              "えをかきます (eokakimasu)",
              "えをえきます (eoekimasu)"
            ],
            "correct": 2,
            "why": "絵を描きます = えをかきます (eokakimasu) — vẽ tranh."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【歌】",
            "options": [
              "うと (uto)",
              "うた (uta)",
              "か (ka)",
              "うたう (utau)"
            ],
            "correct": 1,
            "why": "歌 = うた (uta) — bài hát — Kun うた."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【歌います】",
            "options": [
              "かいます (kaimasu)",
              "うたいます (utaimasu)",
              "うたります (utarimasu)",
              "うだいます (udaimasu)"
            ],
            "correct": 1,
            "why": "歌います = うたいます (utaimasu) — hát — nhóm 1."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【歌手】",
            "options": [
              "うたしゅ (utashu)",
              "うたて (utate)",
              "かて (kate)",
              "かしゅ (kashu)"
            ],
            "correct": 3,
            "why": "歌手 = かしゅ (kashu) — ca sĩ — 歌 đọc On か."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【遊びます】",
            "options": [
              "あそします (asoshimasu)",
              "あそぶます (asobumasu)",
              "あそびます (asobimasu)",
              "ゆうびます (yuubimasu)"
            ],
            "correct": 2,
            "why": "遊びます = あそびます (asobimasu) — chơi — Kun あそ(ぶ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【遊園地】",
            "options": [
              "ゆえんち (yuenchi)",
              "あそびえんち (asobienchi)",
              "ゆうえんじ (yuuenji)",
              "ゆうえんち (yuuenchi)"
            ],
            "correct": 3,
            "why": "遊園地 = ゆうえんち (yuuenchi) — công viên giải trí — 遊 đọc On ゆう."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【運びます】",
            "options": [
              "はこびます (hakobimasu)",
              "うんびます (unbimasu)",
              "はくびます (hakubimasu)",
              "はこべます (hakobemasu)"
            ],
            "correct": 0,
            "why": "運びます = はこびます (hakobimasu) — chở, vận chuyển — Kun はこ(ぶ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【乗ります／降ります】",
            "options": [
              "のります／おります (norimasu／orimasu)",
              "じょうります／おります (jourimasu／orimasu)",
              "のります／こうります (norimasu／kourimasu)",
              "のります／ふります (norimasu／furimasu)"
            ],
            "correct": 0,
            "why": "乗ります／降ります = のります／おります (norimasu／orimasu) — lên ↔ xuống (xe). 降 chưa phải chữ của lớp nhưng hay đi cặp."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn chữ đúng · điền chữ vào câu · On hay Kun"
      },
      {
        "t": "mcq",
        "id": "lt-b9-kj-chon-chu",
        "title": "Chọn cách viết đúng (12 câu)",
        "items": [
          {
            "q": "Chọn cách viết đúng: およぎます (bơi)",
            "options": [
              "決ぎます",
              "永ぎます",
              "氷ぎます",
              "泳ぎます"
            ],
            "correct": 3,
            "why": "泳 = 氵 (nước) + 永."
          },
          {
            "q": "Chọn cách viết đúng: のります (lên xe)",
            "options": [
              "東ります",
              "来ります",
              "垂ります",
              "乗ります"
            ],
            "correct": 3,
            "why": "乗 = người trèo lên cây."
          },
          {
            "q": "Chọn cách viết đúng: ならいます (học)",
            "options": [
              "習います",
              "羽います",
              "白います",
              "翌います"
            ],
            "correct": 0,
            "why": "習 = 羽 (cánh) trên 白."
          },
          {
            "q": "Chọn cách viết đúng: うんてん (lái xe)",
            "options": [
              "連転",
              "軍転",
              "運伝",
              "運転"
            ],
            "correct": 3,
            "why": "運 + 転 (có bộ 車)."
          },
          {
            "q": "Chọn cách viết đúng: じてんしゃ (xe đạp)",
            "options": [
              "自転車",
              "白転車",
              "自転東",
              "自伝車"
            ],
            "correct": 0,
            "why": "自 + 転 + 車."
          },
          {
            "q": "Chọn cách viết đúng: あつめます (sưu tầm)",
            "options": [
              "集めます",
              "隻めます",
              "進めます",
              "焦めます"
            ],
            "correct": 0,
            "why": "集 = chim (隹) trên cây (木)."
          },
          {
            "q": "Chọn cách viết đúng: かきます (vẽ tranh)",
            "options": [
              "書きます",
              "猫きます",
              "描きます",
              "苗きます"
            ],
            "correct": 2,
            "why": "描 = vẽ; 書 = viết chữ (cùng đọc かきます nhưng khác nghĩa)."
          },
          {
            "q": "Chọn cách viết đúng: うた (bài hát)",
            "options": [
              "欧",
              "可",
              "哥",
              "歌"
            ],
            "correct": 3,
            "why": "歌 = 哥 + 欠 (há miệng)."
          },
          {
            "q": "Chọn cách viết đúng: あそびます (chơi)",
            "options": [
              "旅びます",
              "遊びます",
              "逆びます",
              "族びます"
            ],
            "correct": 1,
            "why": "遊 = 辶 + 方 + 子."
          },
          {
            "q": "Chọn cách viết đúng: かしゅ (ca sĩ)",
            "options": [
              "歌主",
              "歌手",
              "可手",
              "欧手"
            ],
            "correct": 1,
            "why": "歌 + 手."
          },
          {
            "q": "Chọn cách viết đúng: すいえい (bơi lội)",
            "options": [
              "水氷",
              "水泳",
              "水永",
              "氷泳"
            ],
            "correct": 1,
            "why": "水 + 泳."
          },
          {
            "q": "Chọn cách viết đúng: のりもの (phương tiện)",
            "options": [
              "垂り物",
              "乗り勿",
              "乗り物",
              "来り物"
            ],
            "correct": 2,
            "why": "乗 + り + 物."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-kj-dien-chu",
        "title": "Điền chữ Hán vào chỗ trống (11 câu)",
        "items": [
          {
            "q": "{私|わたし}は＿＿ぐことができません。　〔Watashi wa __gu koto ga dekimasen.〕　— Tôi không biết bơi (およぐ).",
            "options": [
              "決",
              "氷",
              "永",
              "泳"
            ],
            "correct": 3,
            "why": "およ(ぐ) = 泳. → **{私|わたし}は{泳|およ}ぐことができません。** 〔Watashi wa oyogu koto ga dekimasen.〕 — Tôi không biết bơi (およぐ)."
          },
          {
            "q": "{毎朝|まいあさ}バスに＿＿ります。　〔Maiasa basu ni __rimasu.〕　— Sáng nào tôi cũng lên xe buýt (のります).",
            "options": [
              "垂",
              "乗",
              "来",
              "東"
            ],
            "correct": 1,
            "why": "の(ります) = 乗. → **{毎朝|まいあさ}バスに{乗|の}ります。** 〔Maiasa basu ni norimasu.〕 — Sáng nào tôi cũng lên xe buýt (のります)."
          },
          {
            "q": "{先月|せんげつ}からピアノを＿＿っています。　〔Sengetsu kara piano o __tte imasu.〕　— Từ tháng trước tôi học (ならって) piano.",
            "options": [
              "習",
              "翌",
              "白",
              "羽"
            ],
            "correct": 0,
            "why": "なら(って) = 習. → **{先月|せんげつ}からピアノを{習|なら}っています。** 〔Sengetsu kara piano o naratte imasu.〕 — Từ tháng trước tôi học (ならって) piano."
          },
          {
            "q": "{兄|あに}は{車|くるま}の＿＿ができます。　〔Ani wa kuruma no __ ga dekimasu.〕　— Anh tôi biết lái (うんてん) ô tô.",
            "options": [
              "運転",
              "軍転",
              "連転",
              "運伝"
            ],
            "correct": 0,
            "why": "うんてん = 運転. → **{兄|あに}は{車|くるま}の{運転|うんてん}ができます。** 〔Ani wa kuruma no unten ga dekimasu.〕 — Anh tôi biết lái (うんてん) ô tô."
          },
          {
            "q": "{趣味|しゅみ}は{切手|きって}を＿＿めることです。　〔Shumi wa kitte o __meru koto desu.〕　— Sở thích của tôi là sưu tầm (あつめる) tem.",
            "options": [
              "隻",
              "集",
              "焦",
              "進"
            ],
            "correct": 1,
            "why": "あつ(める) = 集. → **{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。** 〔Shumi wa kitte o atsumeru koto desu.〕 — Sở thích của tôi là sưu tầm (あつめる) tem."
          },
          {
            "q": "{公園|こうえん}で{絵|え}を＿＿きます。　〔Kouen de e o __kimasu.〕　— Tôi vẽ (かきます) tranh ở công viên.",
            "options": [
              "描",
              "苗",
              "書",
              "猫"
            ],
            "correct": 0,
            "why": "Vẽ tranh → 描 (書 là viết chữ). → **{公園|こうえん}で{絵|え}を{描|か}きます。** 〔Kouen de e o kakimasu.〕 — Tôi vẽ (かきます) tranh ở công viên."
          },
          {
            "q": "カラオケで＿＿を{歌|うた}います。　〔Karaoke de __ o utaimasu.〕　— Tôi hát bài hát (うた) ở quán karaoke.",
            "options": [
              "歌",
              "可",
              "欧",
              "哥"
            ],
            "correct": 0,
            "why": "うた = 歌. → **カラオケで{歌|うた}を{歌|うた}います。** 〔Karaoke de uta o utaimasu.〕 — Tôi hát bài hát (うた) ở quán karaoke."
          },
          {
            "q": "{日曜日|にちようび}、{友達|ともだち}と＿＿びました。　〔Nichiyoubi, tomodachi to __bimashita.〕　— Chủ nhật tôi đi chơi (あそびました) với bạn.",
            "options": [
              "旅",
              "族",
              "逆",
              "遊"
            ],
            "correct": 3,
            "why": "あそ(びました) = 遊. → **{日曜日|にちようび}、{友達|ともだち}と{遊|あそ}びました。** 〔Nichiyoubi, tomodachi to asobimashita.〕 — Chủ nhật tôi đi chơi (あそびました) với bạn."
          },
          {
            "q": "{自|じ}＿＿{車|しゃ}で{学校|がっこう}へ{行|い}きます。　〔Ji__sha de gakkou e ikimasu.〕　— Tôi đi xe đạp (じてんしゃ) đến trường.",
            "options": [
              "伝",
              "運",
              "軽",
              "転"
            ],
            "correct": 3,
            "why": "じてんしゃ = 自転車. → **{自|じ}{転|てん}{車|しゃ}で{学校|がっこう}へ{行|い}きます。** 〔Jitensha de gakkou e ikimasu.〕 — Tôi đi xe đạp (じてんしゃ) đến trường."
          },
          {
            "q": "{日本語|にほんご}を{先生|せんせい}に＿＿います。　〔Nihongo o sensei ni __imasu.〕　— Tôi học (ならいます) tiếng Nhật với thầy.",
            "options": [
              "白",
              "翌",
              "習",
              "羽"
            ],
            "correct": 2,
            "why": "なら(います) = 習. → **{日本語|にほんご}を{先生|せんせい}に{習|なら}います。** 〔Nihongo o sensei ni naraimasu.〕 — Tôi học (ならいます) tiếng Nhật với thầy."
          },
          {
            "q": "みんなが{駅|えき}の{前|まえ}に＿＿まりました。　〔Minna ga eki no mae ni __marimashita.〕　— Mọi người đã tập trung (あつまりました) trước ga.",
            "options": [
              "雑",
              "焦",
              "集",
              "進"
            ],
            "correct": 2,
            "why": "あつ(まりました) = 集. → **みんなが{駅|えき}の{前|まえ}に{集|あつ}まりました。** 〔Minna ga eki no mae ni atsumarimashita.〕 — Mọi người đã tập trung (あつまりました) trước ga."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-kj-on-kun",
        "title": "Cùng một chữ, đọc khác nhau tuỳ từ (12 câu)",
        "items": [
          {
            "q": "Chữ 「泳」 trong 「泳ぎます」 đọc là gì?",
            "options": [
              "およ",
              "なが",
              "えい",
              "すい"
            ],
            "correct": 0,
            "why": "Có đuôi kana → Kun およ(ぐ)."
          },
          {
            "q": "Chữ 「泳」 trong 「水泳」 đọc là gì?",
            "options": [
              "よう",
              "およ",
              "すい",
              "えい"
            ],
            "correct": 3,
            "why": "Từ ghép On: すい + えい."
          },
          {
            "q": "Chữ 「乗」 trong 「乗ります」 đọc là gì?",
            "options": [
              "じょ",
              "の",
              "じょう",
              "じん"
            ],
            "correct": 1,
            "why": "Kun の(る)."
          },
          {
            "q": "Chữ 「習」 trong 「習います」 đọc là gì?",
            "options": [
              "しゅ",
              "ならい",
              "しゅう",
              "なら"
            ],
            "correct": 3,
            "why": "Kun なら(う)."
          },
          {
            "q": "Chữ 「習」 trong 「練習」 đọc là gì?",
            "options": [
              "しゅう",
              "なら",
              "じゅう",
              "しゅ"
            ],
            "correct": 0,
            "why": "Từ ghép On: れん + しゅう."
          },
          {
            "q": "Chữ 「運」 trong 「運転」 đọc là gì?",
            "options": [
              "うん",
              "おん",
              "はこ",
              "うで"
            ],
            "correct": 0,
            "why": "On うん."
          },
          {
            "q": "Chữ 「転」 trong 「自転車」 đọc là gì?",
            "options": [
              "でん",
              "てん",
              "ころ",
              "しゃ"
            ],
            "correct": 1,
            "why": "On てん (không biến âm)."
          },
          {
            "q": "Chữ 「集」 trong 「集めます」 đọc là gì?",
            "options": [
              "しゅう",
              "あつめ",
              "あつ",
              "しゅ"
            ],
            "correct": 2,
            "why": "Kun あつ(める)."
          },
          {
            "q": "Chữ 「歌」 trong 「歌」 đọc là gì?",
            "options": [
              "うだ",
              "よう",
              "か",
              "うた"
            ],
            "correct": 3,
            "why": "Đứng một mình → Kun うた."
          },
          {
            "q": "Chữ 「歌」 trong 「歌手」 đọc là gì?",
            "options": [
              "かい",
              "が",
              "か",
              "うた"
            ],
            "correct": 2,
            "why": "Từ ghép On: か + しゅ."
          },
          {
            "q": "Chữ 「遊」 trong 「遊びます」 đọc là gì?",
            "options": [
              "ゆう",
              "あそ",
              "ゆ",
              "あし"
            ],
            "correct": 1,
            "why": "Kun あそ(ぶ)."
          },
          {
            "q": "Chữ 「遊」 trong 「遊園地」 đọc là gì?",
            "options": [
              "あそ",
              "ゆ",
              "ゆう",
              "よう"
            ],
            "correct": 2,
            "why": "Từ ghép On: ゆう + えん + ち."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · không furigana — như đề thi"
      },
      {
        "t": "mcq",
        "id": "lt-b9-kj-doc-cau",
        "title": "Đọc đúng phần trong 【 】 (12 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　私は【泳ぐ】ことができます。",
            "options": [
              "ながぐ (nagagu)",
              "えいぐ (eigu)",
              "およぐ (oyogu)",
              "おうぐ (ougu)"
            ],
            "correct": 2,
            "why": "泳ぐ = およぐ. Cả câu: 私は【泳ぐ】ことができます。 〔Watashi wa [oyogu] koto ga dekimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　電車に【乗って】、学校へ行きます。",
            "options": [
              "のって (notte)",
              "じょうって (joutte)",
              "かって (katte)",
              "のりって (noritte)"
            ],
            "correct": 0,
            "why": "乗って = のって. Cả câu: 電車に【乗って】、学校へ行きます。 〔Densha ni [notte], gakkou e ikimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　毎週ダンスを【習って】います。",
            "options": [
              "ならって (naratte)",
              "しゅうって (shuutte)",
              "ならいって (naraitte)",
              "しゅって (shutte)"
            ],
            "correct": 0,
            "why": "習って = ならって. Cả câu: 毎週ダンスを【習って】います。 〔Maishuu dansu o [naratte] imasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　父は車の【運転】が上手です。",
            "options": [
              "おんてん (onten)",
              "うんてん (unten)",
              "うんて (unte)",
              "うんでん (unden)"
            ],
            "correct": 1,
            "why": "運転 = うんてん. Cả câu: 父は車の【運転】が上手です。 〔Chichi wa kuruma no [unten] ga jouzu desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　趣味は切手を【集める】ことです。",
            "options": [
              "あつまる (atsumaru)",
              "あつめる (atsumeru)",
              "しゅうめる (shuumeru)",
              "あづめる (azumeru)"
            ],
            "correct": 1,
            "why": "集める = あつめる. Cả câu: 趣味は切手を【集める】ことです。 〔Shumi wa kitte o [atsumeru] koto desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　公園で絵を【描きます】。",
            "options": [
              "かいきます (kaikimasu)",
              "かきます (kakimasu)",
              "びょうきます (byoukimasu)",
              "がきます (gakimasu)"
            ],
            "correct": 1,
            "why": "描きます = かきます. Cả câu: 公園で絵を【描きます】。 〔Kouen de e o [kakimasu].〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　カラオケで【歌】を歌います。",
            "options": [
              "うだ (uda)",
              "うたい (utai)",
              "か (ka)",
              "うた (uta)"
            ],
            "correct": 3,
            "why": "歌 = うた. Cả câu: カラオケで【歌】を歌います。 〔Karaoke de [uta] o utaimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　日曜日、友達と【遊びました】。",
            "options": [
              "あそびました (asobimashita)",
              "ゆうびました (yuubimashita)",
              "あそぶました (asobumashita)",
              "ゆびました (yubimashita)"
            ],
            "correct": 0,
            "why": "遊びました = あそびました. Cả câu: 日曜日、友達と【遊びました】。 〔Nichiyoubi, tomodachi to [asobimashita].〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【自転車】で大学へ行きます。",
            "options": [
              "じしゃ (jisha)",
              "じてんしゃ (jitensha)",
              "じてんくるま (jitenkuruma)",
              "じでんしゃ (jidensha)"
            ],
            "correct": 1,
            "why": "自転車 = じてんしゃ. Cả câu: 【自転車】で大学へ行きます。 〔[jitensha] de daigaku e ikimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　毎朝【運動】をします。",
            "options": [
              "うんどう (undou)",
              "うごき (ugoki)",
              "うんとう (untou)",
              "うんど (undo)"
            ],
            "correct": 0,
            "why": "運動 = うんどう. Cả câu: 毎朝【運動】をします。 〔Maiasa [undou] o shimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　妹は【歌手】です。",
            "options": [
              "かて (kate)",
              "かしゅ (kashu)",
              "かじゅ (kaju)",
              "うたしゅ (utashu)"
            ],
            "correct": 1,
            "why": "歌手 = かしゅ. Cả câu: 妹は【歌手】です。 〔Imouto wa [kashu] desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【水泳】が好きです。",
            "options": [
              "すいえ (suie)",
              "すいえい (suiei)",
              "みずおよぎ (mizuoyogi)",
              "ずいえい (zuiei)"
            ],
            "correct": 1,
            "why": "水泳 = すいえい. Cả câu: 【水泳】が好きです。 〔[suiei] ga suki desu.〕"
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b9-kj-doc-cau-rk",
        "title": "Đọc to câu KHÔNG furigana, rồi bấm xem đáp án (22 câu)",
        "note": "Đọc to cả câu. Chỉ dùng chữ Hán đã học đến Bài 9; các từ khác viết hiragana như đề thi.",
        "items": [
          {
            "text": "{私|わたし}のしゅみは{本|ほん}を{読|よ}むことです。",
            "ro": "Watashi no shumi wa hon o yomu koto desu.",
            "vi": "Sở thích của tôi là đọc sách."
          },
          {
            "text": "{兄|あに}はくるまの{運転|うんてん}ができます。",
            "ro": "Ani wa kuruma no unten ga dekimasu.",
            "vi": "Anh tôi biết lái ô tô."
          },
          {
            "text": "{毎朝|まいあさ}、プールで{泳|およ}ぎます。",
            "ro": "Maiasa, puuru de oyogimasu.",
            "vi": "Sáng nào tôi cũng bơi ở bể bơi."
          },
          {
            "text": "{毎日|まいにち}、でんしゃに{乗|の}って{会社|かいしゃ}へ{行|い}きます。",
            "ro": "Mainichi, densha ni notte kaisha e ikimasu.",
            "vi": "Ngày nào tôi cũng đi tàu điện đến công ty."
          },
          {
            "text": "{先月|せんげつ}からしょどうを{習|なら}っています。",
            "ro": "Sengetsu kara shodou o naratte imasu.",
            "vi": "Từ tháng trước tôi học thư pháp."
          },
          {
            "text": "{父|ちち}のしゅみはきってを{集|あつ}めることです。",
            "ro": "Chichi no shumi wa kitte o atsumeru koto desu.",
            "vi": "Sở thích của bố tôi là sưu tầm tem."
          },
          {
            "text": "{休|やす}みの{日|ひ}はこうえんでえを{描|か}きます。",
            "ro": "Yasumi no hi wa kouen de e o kakimasu.",
            "vi": "Ngày nghỉ tôi vẽ tranh ở công viên."
          },
          {
            "text": "{姉|あね}は{歌|うた}がじょうずです。",
            "ro": "Ane wa uta ga jouzu desu.",
            "vi": "Chị tôi hát hay."
          },
          {
            "text": "{日曜日|にちようび}、ともだちと{遊|あそ}びました。",
            "ro": "Nichiyoubi, tomodachi to asobimashita.",
            "vi": "Chủ nhật tôi đã đi chơi với bạn."
          },
          {
            "text": "{一|いっ}か{月|げつ}に{本|ほん}を{四|よん}さつ{読|よ}みます。",
            "ro": "Ikkagetsu ni hon o yonsatsu yomimasu.",
            "vi": "Một tháng tôi đọc bốn quyển sách."
          },
          {
            "text": "{一日|いちにち}にコーヒーを{二|に}はい{飲|の}みます。",
            "ro": "Ichinichi ni koohii o nihai nomimasu.",
            "vi": "Một ngày tôi uống hai cốc cà phê."
          },
          {
            "text": "{日本語|にほんご}で{話|はな}すことができます。",
            "ro": "Nihongo de hanasu koto ga dekimasu.",
            "vi": "Tôi có thể nói bằng tiếng Nhật."
          },
          {
            "text": "{毎晩|まいばん}、{日本|にほん}のおんがくを{聞|き}きます。",
            "ro": "Maiban, Nihon no ongaku o kikimasu.",
            "vi": "Tối nào tôi cũng nghe nhạc Nhật."
          },
          {
            "text": "{今日|きょう}はしゅくだいがありますから、{遊|あそ}びに{行|い}きません。",
            "ro": "Kyou wa shukudai ga arimasu kara, asobini ikimasen.",
            "vi": "Hôm nay có bài tập nên tôi không đi chơi."
          },
          {
            "text": "{私|わたし}はさいきんぜんぜん{泳|およ}ぎません。",
            "ro": "Watashi wa saikin zenzen oyogimasen.",
            "vi": "Dạo này tôi hoàn toàn không bơi."
          },
          {
            "text": "{大学|だいがく}のダンスクラブにはいりました。",
            "ro": "Daigaku no dansu kurabu ni hairimashita.",
            "vi": "Tôi đã vào câu lạc bộ nhảy của trường."
          },
          {
            "text": "{三|さん}ばんのバスに{乗|の}って、{大学|だいがく}の{前|まえ}でおります。",
            "ro": "Sanban no basu ni notte, daigaku no mae de orimasu.",
            "vi": "Lên xe buýt số 3, xuống trước trường đại học."
          },
          {
            "text": "{料理|りょうり}きょうしつで{日本|にほん}の{料理|りょうり}を{習|なら}います。",
            "ro": "Ryouri kyoushitsu de Nihon no ryouri o naraimasu.",
            "vi": "Tôi học món Nhật ở lớp nấu ăn."
          },
          {
            "text": "{何|なに}を{集|あつ}めていますか。",
            "ro": "Nani o atsumete imasu ka.",
            "vi": "Bạn đang sưu tầm gì vậy?"
          },
          {
            "text": "どうやって{東京|とうきょう}へ{行|い}きますか。",
            "ro": "Douyatte Toukyou e ikimasu ka.",
            "vi": "Đi Tokyo bằng cách nào?"
          },
          {
            "text": "{母|はは}は{歌|うた}を{歌|うた}うことが{大|だい}すきです。",
            "ro": "Haha wa uta o utau koto ga daisuki desu.",
            "vi": "Mẹ tôi rất thích hát."
          },
          {
            "text": "{弟|おとうと}はえを{描|か}くことができます。",
            "ro": "Otouto wa e o kaku koto ga dekimasu.",
            "vi": "Em trai tôi biết vẽ tranh."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b9-kj-doc-doan",
        "title": "Đọc to ĐOẠN văn ngắn không furigana (3 đoạn)",
        "items": [
          {
            "text": "{私|わたし}のしゅみは{泳|およ}ぐことです。{毎週|まいしゅう}{土曜日|どようび}にプールへ{行|い}きます。{一|いち}じかんぐらい{泳|およ}いで、{帰|かえ}ります。{百|ひゃく}メートル{泳|およ}ぐことができます。",
            "ro": "Watashi no shumi wa oyogu koto desu. Maishuu doyoubi ni puuru e ikimasu. Ichijikan gurai oyoide, kaerimasu. Hyakumeetoru oyogu koto ga dekimasu.",
            "vi": "Sở thích của tôi là bơi. Thứ Bảy hàng tuần tôi đến bể bơi. Bơi khoảng một tiếng rồi về. Tôi bơi được 100 mét."
          },
          {
            "text": "{兄|あに}はくるまの{運転|うんてん}がじょうずです。{日曜日|にちようび}は{兄|あに}と{二人|ふたり}でうみへ{行|い}きます。うみで{泳|およ}いで、{歌|うた}を{歌|うた}って、{晩|ばん}ごはんを{食|た}べて、{帰|かえ}ります。",
            "ro": "Ani wa kuruma no unten ga jouzu desu. Nichiyoubi wa ani to futari de umi e ikimasu. Umi de oyoide, uta o utatte, bangohan o tabete, kaerimasu.",
            "vi": "Anh tôi lái ô tô giỏi. Chủ nhật tôi đi biển hai người với anh. Bơi ở biển, hát, ăn tối rồi về."
          },
          {
            "text": "{先月|せんげつ}からしょどうきょうしつで{習|なら}っています。{一|いっ}しゅうかんに{一|いっ}かいです。まだじょうずに{書|か}くことができません。でも、とてもたのしいです。",
            "ro": "Sengetsu kara shodou kyoushitsu de naratte imasu. Isshuukan ni ikkai desu. Mada jouzu ni kaku koto ga dekimasen. Demo, totemo tanoshii desu.",
            "vi": "Từ tháng trước tôi học ở lớp thư pháp. Một tuần một buổi. Tôi vẫn chưa viết đẹp được. Nhưng rất vui."
          }
        ]
      },
      {
        "t": "write",
        "id": "lt-b9-kj-viet",
        "title": "Tập viết chữ Hán của lớp Bài 9 (9 chữ + 6 từ)",
        "chars": [
          "泳",
          "乗",
          "習",
          "運",
          "転",
          "集",
          "描",
          "歌",
          "遊",
          "水泳",
          "乗り物",
          "練習",
          "運転",
          "自転車",
          "歌手"
        ],
        "goi": {
          "水泳": "すいえい · bơi lội",
          "乗り物": "のりもの · phương tiện",
          "練習": "れんしゅう · luyện tập",
          "運転": "うんてん · lái xe",
          "自転車": "じてんしゃ · xe đạp",
          "歌手": "かしゅ · ca sĩ"
        }
      }
    ]
  },
  {
    "id": "lt-b9-the-tu-dien",
    "kind": "homework",
    "title": "Luyện thêm Bài 9 · Thể từ điển (辞書形) — nhận nhóm → chia → bẫy → gõ hàng loạt (~124 câu)",
    "goal": "Đổi đúng thể ます → thể từ điển cho cả 3 nhóm (kể cả các bẫy 帰る・入る・切る là nhóm 1; 見る・起きる・降りる là nhóm 2; 来る đọc くる), rồi dùng thể từ điển trước こと trong câu.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thể từ điển là dạng **gốc** của động từ — dạng phải đứng trước **こと** (ポイント 81, 82). Chìa khoá vẫn là **nhóm** (đã học ở thể て Bài 7): nhận nhóm trước, rồi mới đổi.",
          "**Bẫy**: nhóm 2 \"trá hình\" có い trước ます: 見ます, 起きます, 降ります, 借ります, できます → +る. Còn **帰ります, 入ります, 切ります** trông giống nhóm 2 nhưng là **nhóm 1** → 帰る, 入る, 切る (り → る). **来ます** → **来る (くる)**: chữ Hán giữ nguyên, cách đọc đổi.",
          "Làm theo thứ tự 🟢 → 🟡 → 🔴; phần gõ hàng loạt cứ sai là đọc to cặp \"ます → từ điển\" 3 lần."
        ]
      },
      {
        "t": "table",
        "head": [
          "Nhóm",
          "Cách đổi",
          "Ví dụ"
        ],
        "rows": [
          [
            "1",
            "âm hàng い trước ます → hàng う",
            "泳ぎます → 泳ぐ · 習います → 習う · 乗ります → 乗る · 待ちます → 待つ · 読みます → 読む · 遊びます → 遊ぶ · 話します → 話す"
          ],
          [
            "2",
            "bỏ ます + る",
            "見ます → 見る · 食べます → 食べる · 集めます → 集める · 降ります → 降りる · できます → できる"
          ],
          [
            "3",
            "します → する · 来ます → 来る (くる)",
            "運転します → 運転する · 予約します → 予約する"
          ]
        ],
        "caption": "Bảng đổi thể ます → thể từ điển"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhận nhóm · chia từng nhóm"
      },
      {
        "t": "mcq",
        "id": "lt-b9-ttd-nhom",
        "title": "Động từ này thuộc nhóm mấy? (16 câu)",
        "items": [
          {
            "q": "Động từ 「{泳|およ}ぎます」 〔oyogimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "ぎ là hàng い, không thuộc dạng đặc biệt → nhóm 1 (泳ぐ)."
          },
          {
            "q": "Động từ 「{見|み}ます」 〔mimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 2,
            "why": "Chỉ một âm trước ます (み) → nhóm 2 (見る)."
          },
          {
            "q": "Động từ 「{起|お}きます」 〔okimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 2",
              "Nhóm 1"
            ],
            "correct": 1,
            "why": "Nhóm 2 \"trá hình\" → 起きる."
          },
          {
            "q": "Động từ 「{帰|かえ}ります」 〔kaerimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 1",
              "Nhóm 2"
            ],
            "correct": 1,
            "why": "BẪY: trông giống nhóm 2 nhưng là nhóm 1 → 帰る."
          },
          {
            "q": "Động từ 「{入|はい}ります」 〔hairimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 3",
              "Nhóm 1"
            ],
            "correct": 2,
            "why": "BẪY: nhóm 1 → 入る."
          },
          {
            "q": "Động từ 「{降|お}ります」 〔orimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 2,
            "why": "BẪY ngược: giống 乗ります nhưng là nhóm 2 → 降りる."
          },
          {
            "q": "Động từ 「{借|か}ります」 〔karimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 2",
              "Nhóm 1"
            ],
            "correct": 1,
            "why": "Nhóm 2 → 借りる."
          },
          {
            "q": "Động từ 「{乗|の}ります」 〔norimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 1",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "Nhóm 1 → 乗る."
          },
          {
            "q": "Động từ 「{集|あつ}めます」 〔atsumemasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 2",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "め là hàng え → nhóm 2 → 集める."
          },
          {
            "q": "Động từ 「{習|なら}います」 〔naraimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 3",
              "Nhóm 1"
            ],
            "correct": 2,
            "why": "い → う: nhóm 1 → 習う."
          },
          {
            "q": "Động từ 「{運転|うんてん}します」 〔untenshimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 1",
              "Nhóm 2"
            ],
            "correct": 0,
            "why": "N + します → nhóm 3 → 運転する."
          },
          {
            "q": "Động từ 「{来|き}ます」 〔kimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 1",
              "Nhóm 2"
            ],
            "correct": 0,
            "why": "Nhóm 3 (bất quy tắc) → 来る (くる)."
          },
          {
            "q": "Động từ 「{切|き}ります」 〔kirimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 1",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "BẪY: nhóm 1 → 切る (thể て: 切って)."
          },
          {
            "q": "Động từ 「できます」 〔dekimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 1",
              "Nhóm 2"
            ],
            "correct": 2,
            "why": "Nhóm 2 → できる."
          },
          {
            "q": "Động từ 「{見|み}せます」 〔misemasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 1",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "せ là hàng え → nhóm 2 → 見せる."
          },
          {
            "q": "Động từ 「{遊|あそ}びます」 〔asobimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 0,
            "why": "び → ぶ: nhóm 1 → 遊ぶ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ttd-chia1",
        "title": "Chia thể từ điển — NHÓM 1 (16 câu)",
        "items": [
          {
            "q": "Thể từ điển của 「{泳|およ}ぎます 〔oyogimasu〕」 (bơi) là gì?",
            "options": [
              "{泳|およ}ぐ (oyogu)",
              "{泳|およ}ぎ (oyogi)",
              "{泳|およ}ぎます (oyogimasu)",
              "{泳|およ}ぎる (oyogiru)"
            ],
            "correct": 0,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{泳|およ}ぐ**"
          },
          {
            "q": "Thể từ điển của 「{描|か}きます 〔kakimasu〕」 (vẽ) là gì?",
            "options": [
              "{描|か}く (kaku)",
              "{描|か}きます (kakimasu)",
              "{描|か}き (kaki)",
              "{描|か}きる (kakiru)"
            ],
            "correct": 0,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{描|か}く**"
          },
          {
            "q": "Thể từ điển của 「{書|か}きます 〔kakimasu〕」 (viết) là gì?",
            "options": [
              "{書|か}く (kaku)",
              "{書|か}きる (kakiru)",
              "{書|か}き (kaki)",
              "{書|か}きます (kakimasu)"
            ],
            "correct": 0,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{書|か}く**"
          },
          {
            "q": "Thể từ điển của 「{聞|き}きます 〔kikimasu〕」 (nghe) là gì?",
            "options": [
              "{聞|き}き (kiki)",
              "{聞|き}きる (kikiru)",
              "{聞|き}く (kiku)",
              "{聞|き}きます (kikimasu)"
            ],
            "correct": 2,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{聞|き}く**"
          },
          {
            "q": "Thể từ điển của 「{行|い}きます 〔ikimasu〕」 (đi) là gì?",
            "options": [
              "{行|い}きる (ikiru)",
              "{行|い}きます (ikimasu)",
              "{行|い}く (iku)",
              "{行|い}き (iki)"
            ],
            "correct": 2,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{行|い}く**"
          },
          {
            "q": "Thể từ điển của 「{働|はたら}きます 〔hatarakimasu〕」 (làm việc) là gì?",
            "options": [
              "{働|はたら}きる (hatarakiru)",
              "{働|はたら}き (hataraki)",
              "{働|はたら}く (hataraku)",
              "{働|はたら}きます (hatarakimasu)"
            ],
            "correct": 2,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{働|はたら}く**"
          },
          {
            "q": "Thể từ điển của 「{習|なら}います 〔naraimasu〕」 (học) là gì?",
            "options": [
              "{習|なら}う (narau)",
              "{習|なら}い (narai)",
              "{習|なら}いる (narairu)",
              "{習|なら}います (naraimasu)"
            ],
            "correct": 0,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{習|なら}う**"
          },
          {
            "q": "Thể từ điển của 「{言|い}います 〔iimasu〕」 (nói) là gì?",
            "options": [
              "{言|い}いる (iiru)",
              "{言|い}う (iu)",
              "{言|い}い (ii)",
              "{言|い}います (iimasu)"
            ],
            "correct": 1,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{言|い}う**"
          },
          {
            "q": "Thể từ điển của 「{払|はら}います 〔haraimasu〕」 (trả tiền) là gì?",
            "options": [
              "{払|はら}い (harai)",
              "{払|はら}います (haraimasu)",
              "{払|はら}う (harau)",
              "{払|はら}いる (harairu)"
            ],
            "correct": 2,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{払|はら}う**"
          },
          {
            "q": "Thể từ điển của 「{買|か}います 〔kaimasu〕」 (mua) là gì?",
            "options": [
              "{買|か}い (kai)",
              "{買|か}います (kaimasu)",
              "{買|か}う (kau)",
              "{買|か}いる (kairu)"
            ],
            "correct": 2,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{買|か}う**"
          },
          {
            "q": "Thể từ điển của 「{会|あ}います 〔aimasu〕」 (gặp) là gì?",
            "options": [
              "{会|あ}う (au)",
              "{会|あ}いる (airu)",
              "{会|あ}い (ai)",
              "{会|あ}います (aimasu)"
            ],
            "correct": 0,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{会|あ}う**"
          },
          {
            "q": "Thể từ điển của 「{使|つか}います 〔tsukaimasu〕」 (dùng) là gì?",
            "options": [
              "{使|つか}い (tsukai)",
              "{使|つか}います (tsukaimasu)",
              "{使|つか}いる (tsukairu)",
              "{使|つか}う (tsukau)"
            ],
            "correct": 3,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{使|つか}う**"
          },
          {
            "q": "Thể từ điển của 「{歌|うた}います 〔utaimasu〕」 (hát) là gì?",
            "options": [
              "{歌|うた}う (utau)",
              "{歌|うた}いる (utairu)",
              "{歌|うた}います (utaimasu)",
              "{歌|うた}い (utai)"
            ],
            "correct": 0,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{歌|うた}う**"
          },
          {
            "q": "Thể từ điển của 「{乗|の}ります 〔norimasu〕」 (lên (xe)) là gì?",
            "options": [
              "{乗|の}りる (noriru)",
              "{乗|の}り (nori)",
              "{乗|の}る (noru)",
              "{乗|の}ります (norimasu)"
            ],
            "correct": 2,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{乗|の}る**"
          },
          {
            "q": "Thể từ điển của 「{入|はい}ります 〔hairimasu〕」 (vào) là gì?",
            "options": [
              "{入|はい}ります (hairimasu)",
              "{入|はい}り (hairi)",
              "{入|はい}りる (hairiru)",
              "{入|はい}る (hairu)"
            ],
            "correct": 3,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{入|はい}る**"
          },
          {
            "q": "Thể từ điển của 「{帰|かえ}ります 〔kaerimasu〕」 (về) là gì?",
            "options": [
              "{帰|かえ}る (kaeru)",
              "{帰|かえ}ります (kaerimasu)",
              "{帰|かえ}り (kaeri)",
              "{帰|かえ}りる (kaeriru)"
            ],
            "correct": 0,
            "why": "Nhóm 1: âm trước ます thuộc hàng **い** (き・ぎ・い・り・ち・み・び・し) → đổi sang hàng **う** (く・ぐ・う・る・つ・む・ぶ・す). → **{帰|かえ}る**"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ttd-chia2",
        "title": "Chia thể từ điển — NHÓM 2 (10 câu)",
        "items": [
          {
            "q": "Thể từ điển của 「{見|み}ます 〔mimasu〕」 là gì?",
            "options": [
              "{見|み} (mi)",
              "{見|み}う (miu)",
              "{見|み}む (mimu)",
              "{見|み}る (miru)"
            ],
            "correct": 3,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{見|み}る**"
          },
          {
            "q": "Thể từ điển của 「{食|た}べます 〔tabemasu〕」 là gì?",
            "options": [
              "{食|た}べう (tabeu)",
              "{食|た}べる (taberu)",
              "{食|た}ぶ (tabu)",
              "{食|た}べ (tabe)"
            ],
            "correct": 1,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{食|た}べる**"
          },
          {
            "q": "Thể từ điển của 「{起|お}きます 〔okimasu〕」 là gì?",
            "options": [
              "{起|お}き (oki)",
              "{起|お}きう (okiu)",
              "{起|お}きる (okiru)",
              "{起|お}く (oku)"
            ],
            "correct": 2,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{起|お}きる**"
          },
          {
            "q": "Thể từ điển của 「{降|お}ります 〔orimasu〕」 là gì?",
            "options": [
              "{降|お}りる (oriru)",
              "{降|お}る (oru)",
              "{降|お}りう (oriu)",
              "{降|お}り (ori)"
            ],
            "correct": 0,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{降|お}りる**"
          },
          {
            "q": "Thể từ điển của 「{集|あつ}めます 〔atsumemasu〕」 là gì?",
            "options": [
              "{集|あつ}む (atsumu)",
              "{集|あつ}める (atsumeru)",
              "{集|あつ}めう (atsumeu)",
              "{集|あつ}め (atsume)"
            ],
            "correct": 1,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{集|あつ}める**"
          },
          {
            "q": "Thể từ điển của 「{見|み}せます 〔misemasu〕」 là gì?",
            "options": [
              "{見|み}せる (miseru)",
              "{見|み}せ (mise)",
              "{見|み}せう (miseu)",
              "{見|み}す (misu)"
            ],
            "correct": 0,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{見|み}せる**"
          },
          {
            "q": "Thể từ điển của 「{借|か}ります 〔karimasu〕」 là gì?",
            "options": [
              "{借|か}りう (kariu)",
              "{借|か}りる (kariru)",
              "{借|か}り (kari)",
              "{借|か}る (karu)"
            ],
            "correct": 1,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{借|か}りる**"
          },
          {
            "q": "Thể từ điển của 「できます 〔dekimasu〕」 là gì?",
            "options": [
              "でく (deku)",
              "でき (deki)",
              "できう (dekiu)",
              "できる (dekiru)"
            ],
            "correct": 3,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **できる**"
          },
          {
            "q": "Thể từ điển của 「{教|おし}えます 〔oshiemasu〕」 là gì?",
            "options": [
              "{教|おし}える (oshieru)",
              "{教|おし}え (oshie)",
              "{教|おし}う (oshiu)",
              "{教|おし}えう (oshieu)"
            ],
            "correct": 0,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{教|おし}える**"
          },
          {
            "q": "Thể từ điển của 「{寝|ね}ます 〔nemasu〕」 là gì?",
            "options": [
              "{寝|ね}る (neru)",
              "{寝|ね} (ne)",
              "{寝|ね}う (neu)",
              "{寝|ね}ぬ (nenu)"
            ],
            "correct": 0,
            "why": "Nhóm 2: bỏ ます, thêm **る**. → **{寝|ね}る**"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ttd-chia3",
        "title": "Chia thể từ điển — NHÓM 3 (6 câu)",
        "items": [
          {
            "q": "Thể từ điển của 「します 〔shimasu〕」 là gì?",
            "options": [
              "しう (shiu)",
              "しる (shiru)",
              "す (su)",
              "する (suru)"
            ],
            "correct": 3,
            "why": "Nhóm 3: します → **する**; 来ます (きます) → **来る (くる)**. → **する**"
          },
          {
            "q": "Thể từ điển của 「{来|き}ます 〔kimasu〕」 là gì?",
            "options": [
              "{来|く}る (kuru)",
              "{来|く}ます (kumasu)",
              "{来|こ}る (koru)",
              "{来|き}る (kiru)"
            ],
            "correct": 0,
            "why": "Nhóm 3: します → **する**; 来ます (きます) → **来る (くる)**. → **{来|く}る**"
          },
          {
            "q": "Thể từ điển của 「{運転|うんてん}します 〔untenshimasu〕」 là gì?",
            "options": [
              "{運転|うんてん}すう (untensuu)",
              "{運転|うんてん}する (untensuru)",
              "{運転|うんてん}しる (untenshiru)",
              "{運転|うんてん}す (untensu)"
            ],
            "correct": 1,
            "why": "Nhóm 3: します → **する**; 来ます (きます) → **来る (くる)**. → **{運転|うんてん}する**"
          },
          {
            "q": "Thể từ điển của 「{予約|よやく}します 〔yoyakushimasu〕」 là gì?",
            "options": [
              "{予約|よやく}しう (yoyakushiu)",
              "{予約|よやく}しる (yoyakushiru)",
              "{予約|よやく}す (yoyakusu)",
              "{予約|よやく}する (yoyakusuru)"
            ],
            "correct": 3,
            "why": "Nhóm 3: します → **する**; 来ます (きます) → **来る (くる)**. → **{予約|よやく}する**"
          },
          {
            "q": "Thể từ điển của 「{参加|さんか}します 〔sankashimasu〕」 là gì?",
            "options": [
              "{参加|さんか}しう (sankashiu)",
              "{参加|さんか}する (sankasuru)",
              "{参加|さんか}す (sankasu)",
              "{参加|さんか}しる (sankashiru)"
            ],
            "correct": 1,
            "why": "Nhóm 3: します → **する**; 来ます (きます) → **来る (くる)**. → **{参加|さんか}する**"
          },
          {
            "q": "Thể từ điển của 「{勉強|べんきょう}します 〔benkyoushimasu〕」 là gì?",
            "options": [
              "{勉強|べんきょう}しる (benkyoushiru)",
              "{勉強|べんきょう}しう (benkyoushiu)",
              "{勉強|べんきょう}する (benkyousuru)",
              "{勉強|べんきょう}す (benkyousu)"
            ],
            "correct": 2,
            "why": "Nhóm 3: します → **する**; 来ます (きます) → **来る (くる)**. → **{勉強|べんきょう}する**"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · gõ hàng loạt · đổi ngược · bẫy trong câu"
      },
      {
        "t": "quiz",
        "id": "lt-b9-ttd-go",
        "title": "Gõ thể từ điển (38 câu)",
        "kind": "fill",
        "grammar": "Nhóm 1: い段 → う段 · Nhóm 2: bỏ ます + る · Nhóm 3: する／来る",
        "items": [
          {
            "q": "{泳|およ}ぎます 〔oyogimasu〕 (bơi) → ＿＿",
            "answers": [
              "泳ぐ",
              "およぐ"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{描|か}きます 〔kakimasu〕 (vẽ) → ＿＿",
            "answers": [
              "描く",
              "かく"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{書|か}きます 〔kakimasu〕 (viết) → ＿＿",
            "answers": [
              "書く",
              "かく"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{聞|き}きます 〔kikimasu〕 (nghe) → ＿＿",
            "answers": [
              "聞く",
              "きく"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{行|い}きます 〔ikimasu〕 (đi) → ＿＿",
            "answers": [
              "行く",
              "いく"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{習|なら}います 〔naraimasu〕 (học) → ＿＿",
            "answers": [
              "習う",
              "ならう"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{言|い}います 〔iimasu〕 (nói) → ＿＿",
            "answers": [
              "言う",
              "いう"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{払|はら}います 〔haraimasu〕 (trả tiền) → ＿＿",
            "answers": [
              "払う",
              "はらう"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{買|か}います 〔kaimasu〕 (mua) → ＿＿",
            "answers": [
              "買う",
              "かう"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{会|あ}います 〔aimasu〕 (gặp) → ＿＿",
            "answers": [
              "会う",
              "あう"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{使|つか}います 〔tsukaimasu〕 (dùng) → ＿＿",
            "answers": [
              "使う",
              "つかう"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{歌|うた}います 〔utaimasu〕 (hát) → ＿＿",
            "answers": [
              "歌う",
              "うたう"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{乗|の}ります 〔norimasu〕 (lên (xe)) → ＿＿",
            "answers": [
              "乗る",
              "のる"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{入|はい}ります 〔hairimasu〕 (vào) → ＿＿",
            "answers": [
              "入る",
              "はいる"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{帰|かえ}ります 〔kaerimasu〕 (về) → ＿＿",
            "answers": [
              "帰る",
              "かえる"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{作|つく}ります 〔tsukurimasu〕 (làm, nấu) → ＿＿",
            "answers": [
              "作る",
              "つくる"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{待|ま}ちます 〔machimasu〕 (chờ) → ＿＿",
            "answers": [
              "待つ",
              "まつ"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{飲|の}みます 〔nomimasu〕 (uống) → ＿＿",
            "answers": [
              "飲む",
              "のむ"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{読|よ}みます 〔yomimasu〕 (đọc) → ＿＿",
            "answers": [
              "読む",
              "よむ"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{住|す}みます 〔sumimasu〕 (sống) → ＿＿",
            "answers": [
              "住む",
              "すむ"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{遊|あそ}びます 〔asobimasu〕 (chơi) → ＿＿",
            "answers": [
              "遊ぶ",
              "あそぶ"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{話|はな}します 〔hanashimasu〕 (nói chuyện) → ＿＿",
            "answers": [
              "話す",
              "はなす"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{申|もう}し{込|こ}みます 〔moushikomimasu〕 (đăng ký) → ＿＿",
            "answers": [
              "申し込む",
              "申しこむ",
              "もうし込む",
              "もうしこむ"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{見|み}ます 〔mimasu〕 (xem) → ＿＿",
            "answers": [
              "見る",
              "みる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{食|た}べます 〔tabemasu〕 (ăn) → ＿＿",
            "answers": [
              "食べる",
              "たべる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{起|お}きます 〔okimasu〕 (thức dậy) → ＿＿",
            "answers": [
              "起きる",
              "おきる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{集|あつ}めます 〔atsumemasu〕 (sưu tầm) → ＿＿",
            "answers": [
              "集める",
              "あつめる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{降|お}ります 〔orimasu〕 (xuống (xe)) → ＿＿",
            "answers": [
              "降りる",
              "おりる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{見|み}せます 〔misemasu〕 (cho xem) → ＿＿",
            "answers": [
              "見せる",
              "みせる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{借|か}ります 〔karimasu〕 (mượn) → ＿＿",
            "answers": [
              "借りる",
              "かりる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{教|おし}えます 〔oshiemasu〕 (dạy) → ＿＿",
            "answers": [
              "教える",
              "おしえる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "できます 〔dekimasu〕 (làm được) → ＿＿",
            "answers": [
              "できる"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "します 〔shimasu〕 (làm) → ＿＿",
            "answers": [
              "する"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{来|き}ます 〔kimasu〕 (đến) → ＿＿",
            "answers": [
              "来る",
              "くる"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{運転|うんてん}します 〔untenshimasu〕 (lái xe) → ＿＿",
            "answers": [
              "運転する",
              "うんてんする"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{予約|よやく}します 〔yoyakushimasu〕 (đặt trước) → ＿＿",
            "answers": [
              "予約する",
              "よやくする"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{参加|さんか}します 〔sankashimasu〕 (tham gia) → ＿＿",
            "answers": [
              "参加する",
              "さんかする"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{勉強|べんきょう}します 〔benkyoushimasu〕 (học) → ＿＿",
            "answers": [
              "勉強する",
              "べんきょうする"
            ],
            "hint": "Nhóm 3"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ttd-nguoc",
        "title": "Đổi ngược: thể từ điển → thể ます (10 câu)",
        "items": [
          {
            "q": "Thể ます của 「{集|あつ}める 〔atsumeru〕」 là gì?",
            "options": [
              "{集|あつ}めます (atsumemasu)",
              "{集|あつ}まります (atsumarimasu)",
              "{集|あつ}みます (atsumimasu)",
              "{集|あつ}めります (atsumerimasu)"
            ],
            "correct": 0,
            "why": "Nhóm 2: bỏ る + ます."
          },
          {
            "q": "Thể ます của 「{降|お}りる 〔oriru〕」 là gì?",
            "options": [
              "{降|お}りますです (orimasudesu)",
              "{降|お}らます (oramasu)",
              "{降|お}りります (oririmasu)",
              "{降|お}ります (orimasu)"
            ],
            "correct": 3,
            "why": "Nhóm 2: 降りる → 降ります."
          },
          {
            "q": "Thể ます của 「{帰|かえ}る 〔kaeru〕」 là gì?",
            "options": [
              "{帰|かえ}るます (kaerumasu)",
              "{帰|かえ}ます (kaemasu)",
              "{帰|かえ}ります (kaerimasu)",
              "{帰|かえ}れます (kaeremasu)"
            ],
            "correct": 2,
            "why": "Nhóm 1: る → ります."
          },
          {
            "q": "Thể ます của 「{入|はい}る 〔hairu〕」 là gì?",
            "options": [
              "{入|はい}ます (haimasu)",
              "{入|はい}れます (hairemasu)",
              "{入|はい}るます (hairumasu)",
              "{入|はい}ります (hairimasu)"
            ],
            "correct": 3,
            "why": "Nhóm 1: る → ります."
          },
          {
            "q": "Thể ます của 「{来|く}る 〔kuru〕」 là gì?",
            "options": [
              "{来|こ}ます (komasu)",
              "{来|く}ます (kumasu)",
              "{来|く}ります (kurimasu)",
              "{来|き}ます (kimasu)"
            ],
            "correct": 3,
            "why": "Bất quy tắc: くる → きます."
          },
          {
            "q": "Thể ます của 「する 〔suru〕」 là gì?",
            "options": [
              "さます (samasu)",
              "します (shimasu)",
              "しります (shirimasu)",
              "すます (sumasu)"
            ],
            "correct": 1,
            "why": "Bất quy tắc."
          },
          {
            "q": "Thể ます của 「{泳|およ}ぐ 〔oyogu〕」 là gì?",
            "options": [
              "{泳|およ}ぐます (oyogumasu)",
              "{泳|およ}ぎます (oyogimasu)",
              "{泳|およ}きます (oyokimasu)",
              "{泳|およ}げます (oyogemasu)"
            ],
            "correct": 1,
            "why": "Nhóm 1: ぐ → ぎます."
          },
          {
            "q": "Thể ます của 「{言|い}う 〔iu〕」 là gì?",
            "options": [
              "{言|い}うます (iumasu)",
              "{言|い}います (iimasu)",
              "{言|い}えます (iemasu)",
              "{言|い}ます (imasu)"
            ],
            "correct": 1,
            "why": "Nhóm 1: う → います."
          },
          {
            "q": "Thể ます của 「{待|ま}つ 〔matsu〕」 là gì?",
            "options": [
              "{待|ま}てます (matemasu)",
              "{待|ま}ます (mamasu)",
              "{待|ま}ちます (machimasu)",
              "{待|ま}つます (matsumasu)"
            ],
            "correct": 2,
            "why": "Nhóm 1: つ → ちます."
          },
          {
            "q": "Thể ます của 「{遊|あそ}ぶ 〔asobu〕」 là gì?",
            "options": [
              "{遊|あそ}ぶます (asobumasu)",
              "{遊|あそ}びます (asobimasu)",
              "{遊|あそ}みます (asomimasu)",
              "{遊|あそ}べます (asobemasu)"
            ],
            "correct": 1,
            "why": "Nhóm 1: ぶ → びます."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ttd-bay",
        "title": "Bẫy trong câu — chọn câu ĐÚNG (10 câu)",
        "items": [
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{趣味|しゅみ}は{映画|えいが}を{見|み}てことです。 (Shumi wa eiga o mite koto desu.)",
              "{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。 (Shumi wa eiga o miru koto desu.)",
              "{趣味|しゅみ}は{映画|えいが}を{見|み}むことです。 (Shumi wa eiga o mimu koto desu.)",
              "{趣味|しゅみ}は{映画|えいが}を{見|み}ますことです。 (Shumi wa eiga o mimasu koto desu.)"
            ],
            "correct": 1,
            "why": "見ます (nhóm 2) → **見る**; trước こと luôn là thể từ điển."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{一人|ひとり}で{帰|かえ}ることができます。 (Hitori de kaeru koto ga dekimasu.)",
              "{一人|ひとり}で{帰|かえ}ってことができます。 (Hitori de kaette koto ga dekimasu.)",
              "{一人|ひとり}で{帰|かえ}りることができます。 (Hitori de kaeriru koto ga dekimasu.)",
              "{一人|ひとり}で{帰|かえ}りますことができます。 (Hitori de kaerimasu koto ga dekimasu.)"
            ],
            "correct": 0,
            "why": "帰ります là nhóm 1 → **帰る**."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{明日|あした}{来|こ}ることができます。 (Ashita koru koto ga dekimasu.)",
              "{明日|あした}{来|き}ることができます。 (Ashita kiru koto ga dekimasu.)",
              "{明日|あした}{来|き}ますことができます。 (Ashita kimasu koto ga dekimasu.)",
              "{明日|あした}{来|く}ることができます。 (Ashita kuru koto ga dekimasu.)"
            ],
            "correct": 3,
            "why": "来ます → **来る (くる)**."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "はしを{使|つか}うことができます。 (Hashi o tsukau koto ga dekimasu.)",
              "はしを{使|つか}うることができます。 (Hashi o tsukauru koto ga dekimasu.)",
              "はしを{使|つか}いますことができます。 (Hashi o tsukaimasu koto ga dekimasu.)",
              "はしを{使|つか}いることができます。 (Hashi o tsukairu koto ga dekimasu.)"
            ],
            "correct": 0,
            "why": "使います (い → う) → **使う**."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{一人|ひとり}でバスを{降|お}りってことができます。 (Hitori de basu o oritte koto ga dekimasu.)",
              "{一人|ひとり}でバスを{降|お}りることができます。 (Hitori de basu o oriru koto ga dekimasu.)",
              "{一人|ひとり}でバスを{降|お}ることができます。 (Hitori de basu o oru koto ga dekimasu.)",
              "{一人|ひとり}でバスを{降|お}りますことができます。 (Hitori de basu o orimasu koto ga dekimasu.)"
            ],
            "correct": 1,
            "why": "降ります là nhóm 2 → **降りる**."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "クラブに{入|はい}ることができます。 (Kurabu ni hairu koto ga dekimasu.)",
              "クラブに{入|はい}りますことができます。 (Kurabu ni hairimasu koto ga dekimasu.)",
              "クラブに{入|はい}りることができます。 (Kurabu ni hairiru koto ga dekimasu.)",
              "クラブに{入|はい}ってことができます。 (Kurabu ni haitte koto ga dekimasu.)"
            ],
            "correct": 0,
            "why": "入ります là nhóm 1 → **入る**."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{車|くるま}を{運転|うんてん}しますことができます。 (Kuruma o unten shimasu koto ga dekimasu.)",
              "{車|くるま}を{運転|うんてん}しることができます。 (Kuruma o unten shiru koto ga dekimasu.)",
              "{車|くるま}を{運転|うんてん}することができます。 (Kuruma o unten suru koto ga dekimasu.)",
              "{車|くるま}を{運転|うんてん}すうことができます。 (Kuruma o unten suu koto ga dekimasu.)"
            ],
            "correct": 2,
            "why": "します → **する**."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{六時|ろくじ}に{起|お}きうことができます。 (Rokuji ni okiu koto ga dekimasu.)",
              "{六時|ろくじ}に{起|お}くことができます。 (Rokuji ni oku koto ga dekimasu.)",
              "{六時|ろくじ}に{起|お}きますことができます。 (Rokuji ni okimasu koto ga dekimasu.)",
              "{六時|ろくじ}に{起|お}きることができます。 (Rokuji ni okiru koto ga dekimasu.)"
            ],
            "correct": 3,
            "why": "起きます là nhóm 2 → **起きる**."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{日本語|にほんご}で{話|はな}しすことができます。 (Nihongo de hanashisu koto ga dekimasu.)",
              "{日本語|にほんご}で{話|はな}しますことができます。 (Nihongo de hanashimasu koto ga dekimasu.)",
              "{日本語|にほんご}で{話|はな}すことができます。 (Nihongo de hanasu koto ga dekimasu.)",
              "{日本語|にほんご}で{話|はな}しることができます。 (Nihongo de hanashiru koto ga dekimasu.)"
            ],
            "correct": 2,
            "why": "し → す: **話す**."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "{一時間|いちじかん}{待|ま}ちることができます。 (Ichijikan machiru koto ga dekimasu.)",
              "{一時間|いちじかん}{待|ま}つことができます。 (Ichijikan matsu koto ga dekimasu.)",
              "{一時間|いちじかん}{待|ま}ちますことができます。 (Ichijikan machimasu koto ga dekimasu.)",
              "{一時間|いちじかん}{待|ま}てことができます。 (Ichijikan mate koto ga dekimasu.)"
            ],
            "correct": 1,
            "why": "ち → つ: **待つ**."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · gõ thể từ điển ngay trong câu · ghép câu"
      },
      {
        "t": "quiz",
        "id": "lt-b9-ttd-cau",
        "title": "Gõ thể từ điển của động từ trong gợi ý (12 câu)",
        "kind": "fill",
        "grammar": "Trước こと luôn là THỂ TỪ ĐIỂN",
        "items": [
          {
            "q": "{趣味|しゅみ}は{切手|きって}を＿＿ことです。　〔Shumi wa kitte o __ koto desu.〕",
            "answers": [
              "集める",
              "あつめる"
            ],
            "hint": "集めます"
          },
          {
            "q": "{趣味|しゅみ}は{山|やま}に＿＿ことです。　〔Shumi wa yama ni __ koto desu.〕",
            "answers": [
              "登る",
              "のぼる"
            ],
            "hint": "登ります"
          },
          {
            "q": "{私|わたし}は{車|くるま}を＿＿ことができます。　〔Watashi wa kuruma o __ koto ga dekimasu.〕",
            "answers": [
              "運転する",
              "うんてんする"
            ],
            "hint": "運転します"
          },
          {
            "q": "{一人|ひとり}でうちへ＿＿ことができます。　〔Hitori de uchi e __ koto ga dekimasu.〕",
            "answers": [
              "帰る",
              "かえる"
            ],
            "hint": "帰ります (nhóm 1!)"
          },
          {
            "q": "{趣味|しゅみ}は{音楽|おんがく}を＿＿ことです。　〔Shumi wa ongaku o __ koto desu.〕",
            "answers": [
              "聞く",
              "きく"
            ],
            "hint": "聞きます"
          },
          {
            "q": "{日本語|にほんご}で{手紙|てがみ}を＿＿ことができます。　〔Nihongo de tegami o __ koto ga dekimasu.〕",
            "answers": [
              "書く",
              "かく"
            ],
            "hint": "書きます"
          },
          {
            "q": "{趣味|しゅみ}は{友達|ともだち}と＿＿ことです。　〔Shumi wa tomodachi to __ koto desu.〕",
            "answers": [
              "遊ぶ",
              "あそぶ"
            ],
            "hint": "遊びます"
          },
          {
            "q": "{私|わたし}は{朝|あさ}{五時|ごじ}に＿＿ことができません。　〔Watashi wa asa goji ni __ koto ga dekimasen.〕",
            "answers": [
              "起きる",
              "おきる"
            ],
            "hint": "起きます (nhóm 2!)"
          },
          {
            "q": "{明日|あした}、{学校|がっこう}へ＿＿ことができますか。　〔Ashita, gakkou e __ koto ga dekimasu ka.〕",
            "answers": [
              "来る",
              "くる"
            ],
            "hint": "来ます"
          },
          {
            "q": "{趣味|しゅみ}は{写真|しゃしん}を＿＿ことです。　〔Shumi wa shashin o __ koto desu.〕",
            "answers": [
              "撮る",
              "とる"
            ],
            "hint": "撮ります"
          },
          {
            "q": "{私|わたし}は{日本|にほん}の{料理|りょうり}を＿＿ことができます。　〔Watashi wa Nihon no ryouri o __ koto ga dekimasu.〕",
            "answers": [
              "作る",
              "つくる"
            ],
            "hint": "作ります"
          },
          {
            "q": "{弟|おとうと}は{自転車|じてんしゃ}に＿＿ことができます。　〔Otouto wa jitensha ni __ koto ga dekimasu.〕",
            "answers": [
              "乗る",
              "のる"
            ],
            "hint": "乗ります"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-ttd-ghep",
        "title": "Ghép câu với thể từ điển (6 câu)",
        "items": [
          {
            "vi": "Sở thích của tôi là hát.",
            "chips": [
              "{私|わたし}の{趣味|しゅみ}は",
              "{歌|うた}を",
              "{歌|うた}う",
              "{歌|うた}います",
              "ことです"
            ],
            "answer": [
              "{私|わたし}の{趣味|しゅみ}は",
              "{歌|うた}を",
              "{歌|うた}う",
              "ことです"
            ],
            "ro": "Watashi no shumi wa uta o utau koto desu"
          },
          {
            "vi": "Tôi có thể đến lúc 9 giờ.",
            "chips": [
              "{来|く}ることが",
              "{来|き}ることが",
              "{九時|くじ}に",
              "できます"
            ],
            "answer": [
              "{九時|くじ}に",
              "{来|く}ることが",
              "できます"
            ],
            "ro": "Kuji ni kuru koto ga dekimasu"
          },
          {
            "vi": "Tôi không dậy sớm được.",
            "chips": [
              "{早|はや}く",
              "{起|お}くことが",
              "{起|お}きることが",
              "できません"
            ],
            "answer": [
              "{早|はや}く",
              "{起|お}きることが",
              "できません"
            ],
            "ro": "Hayaku okiru koto ga dekimasen"
          },
          {
            "vi": "Sở thích của anh tôi là chơi game.",
            "chips": [
              "ことです",
              "します",
              "ゲームを",
              "{兄|あに}の{趣味|しゅみ}は",
              "する"
            ],
            "answer": [
              "{兄|あに}の{趣味|しゅみ}は",
              "ゲームを",
              "する",
              "ことです"
            ],
            "ro": "Ani no shumi wa geemu o suru koto desu"
          },
          {
            "vi": "Tôi có thể về nhà một mình.",
            "chips": [
              "うちへ",
              "{一人|ひとり}で",
              "{帰|かえ}りることが",
              "{帰|かえ}ることが",
              "できます"
            ],
            "answer": [
              "{一人|ひとり}で",
              "うちへ",
              "{帰|かえ}ることが",
              "できます"
            ],
            "ro": "Hitori de uchi e kaeru koto ga dekimasu"
          },
          {
            "vi": "Bạn đọc được chữ Hán không?",
            "chips": [
              "{読|よ}むことが",
              "{漢字|かんじ}を",
              "{読|よ}みることが",
              "できますか"
            ],
            "answer": [
              "{漢字|かんじ}を",
              "{読|よ}むことが",
              "できますか"
            ],
            "ro": "Kanji o yomu koto ga dekimasu ka"
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "Ba \"bẫy\" phải thuộc lòng: **帰る・入る・切る** (nhóm 1) · **見る・起きる・降りる・借りる・できる** (nhóm 2) · **来る = くる**.",
          "Thể từ điển chỉ dùng trước こと trong Bài 9 — câu vẫn kết bằng です／できます (lịch sự)."
        ]
      }
    ]
  },
  {
    "id": "lt-b9-np-1",
    "kind": "homework",
    "title": "Luyện thêm Bài 9 · Ngữ pháp 1 (ポイント 81, 82) — 趣味は V こと · N／V こと が できます (~86 câu)",
    "goal": "Nói sở thích bằng 趣味は N です／V辞書形 ことです, nói làm được / không làm được bằng N が できます và V辞書形 こと が できます (đúng trợ từ が, đúng 上手に), trả lời câu hỏi thi nói về sở thích và khả năng.",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**こと** biến cả cụm động từ thành DANH TỪ: 映画を見る → 映画を見る**こと** (\"việc xem phim\"). Trước こと luôn là **thể từ điển**, không bao giờ là ～ます.",
          "**できます** đi với **が**: スキー**が** できます · 泳ぐこと**が** できます. Danh từ kỹ năng (スキー, ダンス, 日本語, 運転) dùng thẳng N が できます; hoạt động cụ thể có tân ngữ → V こと が できます.",
          "**上手に** (phó từ, trước động từ): 上手に ピアノを 弾くことが できます · khác **N が 上手です** (Bài 8)."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**（私の）趣味は N です。** · **趣味は（N を）V辞書形 こと です。** (ポイント 81)",
          "**N が できます／できません。** · **V辞書形 こと が できます／できません。** (ポイント 82)",
          "Mức độ: **少し** できます · **あまり** できません · **全然** できません. Hỏi: **～が できますか** → はい、できます／いいえ、できません."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng ポイント một"
      },
      {
        "t": "mcq",
        "id": "lt-b9-np1-81",
        "title": "ポイント 81: 趣味は V辞書形 こと です (12 câu)",
        "items": [
          {
            "q": "{私|わたし}の{趣味|しゅみ}は{映画|えいが}を＿＿ことです。　〔Watashi no shumi wa eiga o __ koto desu.〕　— Sở thích của tôi là xem phim.",
            "options": [
              "{見|み}て",
              "{見|み}ます",
              "{見|み}る",
              "{見|み}"
            ],
            "correct": 2,
            "why": "Trước こと → thể từ điển: **見る**. → **{私|わたし}の{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。** 〔Watashi no shumi wa eiga o miru koto desu.〕 — Sở thích của tôi là xem phim."
          },
          {
            "q": "{趣味|しゅみ}は{切手|きって}を{集|あつ}める＿＿です。　〔Shumi wa kitte o atsumeru __ desu.〕　— Sở thích của tôi là sưu tầm tem.",
            "options": [
              "もの",
              "とき",
              "こと",
              "ところ"
            ],
            "correct": 2,
            "why": "V辞書形 + **こと** = việc V. → **{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。** 〔Shumi wa kitte o atsumeru koto desu.〕 — Sở thích của tôi là sưu tầm tem."
          },
          {
            "q": "{趣味|しゅみ}はプールで＿＿ことです。　〔Shumi wa puuru de __ koto desu.〕　— Sở thích của tôi là bơi ở bể bơi.",
            "options": [
              "{泳|およ}ぎます",
              "{泳|およ}いで",
              "{泳|およ}ぎ",
              "{泳|およ}ぐ"
            ],
            "correct": 3,
            "why": "泳ぎます → **泳ぐ**. → **{趣味|しゅみ}はプールで{泳|およ}ぐことです。** 〔Shumi wa puuru de oyogu koto desu.〕 — Sở thích của tôi là bơi ở bể bơi."
          },
          {
            "q": "{趣味|しゅみ}は{絵|え}を＿＿ことです。　〔Shumi wa e o __ koto desu.〕　— Sở thích của tôi là vẽ tranh.",
            "options": [
              "{描|か}きる",
              "{描|か}く",
              "{描|か}いて",
              "{描|か}きます"
            ],
            "correct": 1,
            "why": "描きます → **描く**. → **{趣味|しゅみ}は{絵|え}を{描|か}くことです。** 〔Shumi wa e o kaku koto desu.〕 — Sở thích của tôi là vẽ tranh."
          },
          {
            "q": "{趣味|しゅみ}は{写真|しゃしん}を＿＿ことです。　〔Shumi wa shashin o __ koto desu.〕　— Sở thích của tôi là chụp ảnh.",
            "options": [
              "{撮|と}りる",
              "{撮|と}ります",
              "{撮|と}って",
              "{撮|と}る"
            ],
            "correct": 3,
            "why": "撮ります → **撮る**. → **{趣味|しゅみ}は{写真|しゃしん}を{撮|と}ることです。** 〔Shumi wa shashin o toru koto desu.〕 — Sở thích của tôi là chụp ảnh."
          },
          {
            "q": "{趣味|しゅみ}はいろいろな{国|くに}の{料理|りょうり}を＿＿ことです。　〔Shumi wa iroiro na kuni no ryouri o __ koto desu.〕　— Sở thích của tôi là nấu món ăn của nhiều nước.",
            "options": [
              "{作|つく}る",
              "{作|つく}って",
              "{作|つく}りる",
              "{作|つく}ります"
            ],
            "correct": 0,
            "why": "作ります → **作る**. → **{趣味|しゅみ}はいろいろな{国|くに}の{料理|りょうり}を{作|つく}ることです。** 〔Shumi wa iroiro na kuni no ryouri o tsukuru koto desu.〕 — Sở thích của tôi là nấu món ăn của nhiều nước."
          },
          {
            "q": "{趣味|しゅみ}は{山|やま}に＿＿ことです。　〔Shumi wa yama ni __ koto desu.〕　— Sở thích của tôi là leo núi.",
            "options": [
              "{登|のぼ}って",
              "{登|のぼ}ります",
              "{登|のぼ}る",
              "{登|のぼ}りる"
            ],
            "correct": 2,
            "why": "登ります → **登る**. → **{趣味|しゅみ}は{山|やま}に{登|のぼ}ることです。** 〔Shumi wa yama ni noboru koto desu.〕 — Sở thích của tôi là leo núi."
          },
          {
            "q": "{趣味|しゅみ}は＿＿です。　〔Shumi wa __ desu.〕　— Sở thích của tôi là âm nhạc.",
            "options": [
              "{音楽|おんがく}を{聞|き}きます",
              "{音楽|おんがく}を{聞|き}く",
              "{音楽|おんがく}",
              "{音楽|おんがく}する"
            ],
            "correct": 2,
            "why": "Sở thích là DANH TỪ → nói thẳng **N です** (V thì phải có こと). → **{趣味|しゅみ}は{音楽|おんがく}です。** 〔Shumi wa ongaku desu.〕 — Sở thích của tôi là âm nhạc."
          },
          {
            "q": "{趣味|しゅみ}は{釣|つ}りを＿＿ことです。　〔Shumi wa tsuri o __ koto desu.〕　— Sở thích của tôi là đi câu cá.",
            "options": [
              "して",
              "し",
              "する",
              "します"
            ],
            "correct": 2,
            "why": "します → **する**. → **{趣味|しゅみ}は{釣|つ}りをすることです。** 〔Shumi wa tsuri o suru koto desu.〕 — Sở thích của tôi là đi câu cá."
          },
          {
            "q": "{趣味|しゅみ}はカラオケで{歌|うた}を＿＿ことです。　〔Shumi wa karaoke de uta o __ koto desu.〕　— Sở thích của tôi là hát karaoke.",
            "options": [
              "{歌|うた}う",
              "{歌|うた}る",
              "{歌|うた}います",
              "{歌|うた}い"
            ],
            "correct": 0,
            "why": "歌います → **歌う**. → **{趣味|しゅみ}はカラオケで{歌|うた}を{歌|うた}うことです。** 〔Shumi wa karaoke de uta o utau koto desu.〕 — Sở thích của tôi là hát karaoke."
          },
          {
            "q": "A：{趣味|しゅみ}は{何|なん}ですか。B：＿＿。　〔A: shumi wa nan desu ka. B: __.〕　— A: Sở thích của bạn là gì? B: Là đọc sách.",
            "options": [
              "{本|ほん}を{読|よ}むです",
              "{本|ほん}を{読|よ}みます",
              "{本|ほん}を{読|よ}むことです",
              "{本|ほん}を{読|よ}みますことです"
            ],
            "correct": 2,
            "why": "Trả lời đúng mẫu: **V辞書形 こと です**. → **A：{趣味|しゅみ}は{何|なん}ですか。B：{本|ほん}を{読|よ}むことです。** 〔A: shumi wa nan desu ka. B: hon o yomu koto desu.〕 — A: Sở thích của bạn là gì? B: Là đọc sách."
          },
          {
            "q": "{弟|おとうと}の{趣味|しゅみ}はゲームを＿＿ことです。　〔Otouto no shumi wa geemu o __ koto desu.〕　— Sở thích của em trai tôi là chơi game.",
            "options": [
              "する",
              "しる",
              "します",
              "すり"
            ],
            "correct": 0,
            "why": "します → **する**. → **{弟|おとうと}の{趣味|しゅみ}はゲームをすることです。** 〔Otouto no shumi wa geemu o suru koto desu.〕 — Sở thích của em trai tôi là chơi game."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np1-82",
        "title": "ポイント 82: N／V こと が できます (12 câu)",
        "items": [
          {
            "q": "{私|わたし}はスキー＿＿できます。　〔Watashi wa sukii __ dekimasu.〕　— Tôi trượt tuyết được.",
            "options": [
              "を",
              "に",
              "が",
              "で"
            ],
            "correct": 2,
            "why": "できます đi với **が**. → **{私|わたし}はスキーができます。** 〔Watashi wa sukii ga dekimasu.〕 — Tôi trượt tuyết được."
          },
          {
            "q": "{私|わたし}は{泳|およ}ぐこと＿＿できます。　〔Watashi wa oyogu koto __ dekimasu.〕　— Tôi biết bơi.",
            "options": [
              "を",
              "が",
              "に",
              "で"
            ],
            "correct": 1,
            "why": "V こと **が** できます. → **{私|わたし}は{泳|およ}ぐことができます。** 〔Watashi wa oyogu koto ga dekimasu.〕 — Tôi biết bơi."
          },
          {
            "q": "{兄|あに}は{車|くるま}の{運転|うんてん}が＿＿。　〔Ani wa kuruma no unten ga __.〕　— Anh tôi biết lái ô tô.",
            "options": [
              "します",
              "います",
              "あります",
              "できます"
            ],
            "correct": 3,
            "why": "Biết làm → **できます**. → **{兄|あに}は{車|くるま}の{運転|うんてん}ができます。** 〔Ani wa kuruma no unten ga dekimasu.〕 — Anh tôi biết lái ô tô."
          },
          {
            "q": "{私|わたし}は{料理|りょうり}を＿＿ことができません。　〔Watashi wa ryouri o __ koto ga dekimasen.〕　— Tôi không nấu ăn được.",
            "options": [
              "{作|つく}って",
              "{作|つく}る",
              "{作|つく}り",
              "{作|つく}ります"
            ],
            "correct": 1,
            "why": "Trước こと → **作る**. → **{私|わたし}は{料理|りょうり}を{作|つく}ることができません。** 〔Watashi wa ryouri o tsukuru koto ga dekimasen.〕 — Tôi không nấu ăn được."
          },
          {
            "q": "{日本語|にほんご}＿＿できますか。——はい、{少|すこ}しできます。　〔Nihongo __ dekimasu ka. — Hai, sukoshi dekimasu.〕　— Bạn biết tiếng Nhật không? — Có, một chút.",
            "options": [
              "を",
              "に",
              "と",
              "が"
            ],
            "correct": 3,
            "why": "N **が** できますか. → **{日本語|にほんご}ができますか。——はい、{少|すこ}しできます。** 〔Nihongo ga dekimasu ka. — Hai, sukoshi dekimasu.〕 — Bạn biết tiếng Nhật không? — Có, một chút."
          },
          {
            "q": "パクさんは＿＿ピアノを{弾|ひ}くことができます。　〔Paku-san wa __ piano o hiku koto ga dekimasu.〕　— Park chơi piano giỏi.",
            "options": [
              "{上手|じょうず}な",
              "{上手|じょうず}に",
              "{上手|じょうず}が",
              "{上手|じょうず}で"
            ],
            "correct": 1,
            "why": "Trước động từ dùng phó từ **上手に**. → **パクさんは{上手|じょうず}にピアノを{弾|ひ}くことができます。** 〔Paku-san wa jouzuni piano o hiku koto ga dekimasu.〕 — Park chơi piano giỏi."
          },
          {
            "q": "{私|わたし}はダンスが＿＿できません。　〔Watashi wa dansu ga __ dekimasen.〕　— Tôi hoàn toàn không nhảy được.",
            "options": [
              "ときどき",
              "いつも",
              "{全然|ぜんぜん}",
              "とても"
            ],
            "correct": 2,
            "why": "全然 + ～ません = hoàn toàn không. → **{私|わたし}はダンスが{全然|ぜんぜん}できません。** 〔Watashi wa dansu ga zenzen dekimasen.〕 — Tôi hoàn toàn không nhảy được."
          },
          {
            "q": "スキーができますか。——いいえ、＿＿。　〔Sukii ga dekimasu ka. — Iie, __.〕　— Bạn trượt tuyết được không? — Không, tôi không trượt được.",
            "options": [
              "ありません",
              "しません",
              "いません",
              "できません"
            ],
            "correct": 3,
            "why": "Trả lời phủ định: **できません**. → **スキーができますか。——いいえ、できません。** 〔Sukii ga dekimasu ka. — Iie, dekimasen.〕 — Bạn trượt tuyết được không? — Không, tôi không trượt được."
          },
          {
            "q": "{私|わたし}は{漢字|かんじ}を＿＿ができます。　〔Watashi wa kanji o __ ga dekimasu.〕　— Tôi viết được chữ Hán.",
            "options": [
              "{書|か}いてこと",
              "{書|か}きますこと",
              "{書|か}くこと",
              "{書|か}く"
            ],
            "correct": 2,
            "why": "V辞書形 + **こと** + が. → **{私|わたし}は{漢字|かんじ}を{書|か}くことができます。** 〔Watashi wa kanji o kaku koto ga dekimasu.〕 — Tôi viết được chữ Hán."
          },
          {
            "q": "{妹|いもうと}は{百|ひゃく}メートル＿＿ことができます。　〔Imouto wa hyakumeetoru __ koto ga dekimasu.〕　— Em gái tôi bơi được 100 mét.",
            "options": [
              "{泳|およ}ぎ",
              "{泳|およ}ぎる",
              "{泳|およ}ぐ",
              "{泳|およ}いで"
            ],
            "correct": 2,
            "why": "泳ぎます → **泳ぐ**. → **{妹|いもうと}は{百|ひゃく}メートル{泳|およ}ぐことができます。** 〔Imouto wa hyakumeetoru oyogu koto ga dekimasu.〕 — Em gái tôi bơi được 100 mét."
          },
          {
            "q": "{私|わたし}は{自転車|じてんしゃ}に＿＿ことができません。　〔Watashi wa jitensha ni __ koto ga dekimasen.〕　— Tôi không đi được xe đạp.",
            "options": [
              "{乗|の}ります",
              "{乗|の}りる",
              "{乗|の}って",
              "{乗|の}る"
            ],
            "correct": 3,
            "why": "乗ります (nhóm 1) → **乗る**. → **{私|わたし}は{自転車|じてんしゃ}に{乗|の}ることができません。** 〔Watashi wa jitensha ni noru koto ga dekimasen.〕 — Tôi không đi được xe đạp."
          },
          {
            "q": "{料理|りょうり}を{作|つく}ることができませんから、{料理|りょうり}{教室|きょうしつ}で＿＿たいです。　〔Ryouri o tsukuru koto ga dekimasen kara, ryouri kyoushitsu de __ tai desu.〕　— Vì không nấu ăn được nên tôi muốn học ở lớp nấu ăn.",
            "options": [
              "{習|なら}う",
              "{習|なら}って",
              "{習|なら}え",
              "{習|なら}い"
            ],
            "correct": 3,
            "why": "Muốn: gốc ます + **たい** → 習いたい. → **{料理|りょうり}を{作|つく}ることができませんから、{料理|りょうり}{教室|きょうしつ}で{習|なら}いたいです。** 〔Ryouri o tsukuru koto ga dekimasen kara, ryouri kyoushitsu de narai tai desu.〕 — Vì không nấu ăn được nên tôi muốn học ở lớp nấu ăn."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · N hay V こと · hỏi–đáp · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b9-np1-n-v",
        "title": "N が できます hay V こと が できます? — chọn câu đúng (8 câu)",
        "items": [
          {
            "q": "Câu nào đúng nghĩa: \"Tôi biết tiếng Anh.\"?",
            "options": [
              "{英語|えいご}することができます。 (Eigo suru koto ga dekimasu.)",
              "{英語|えいご}をできます。 (Eigo o dekimasu.)",
              "{英語|えいご}ができます。 (Eigo ga dekimasu.)",
              "{英語|えいご}ことができます。 (Eigo koto ga dekimasu.)"
            ],
            "correct": 2,
            "why": "Ngôn ngữ (danh từ) → **N が できます**."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Tôi nhảy được.\"?",
            "options": [
              "ダンスことができます。 (Dansu koto ga dekimasu.)",
              "ダンスするができます。 (Dansu suru ga dekimasu.)",
              "ダンスをできます。 (Dansu o dekimasu.)",
              "ダンスができます。 (Dansu ga dekimasu.)"
            ],
            "correct": 3,
            "why": "ダンス (danh từ) → **ダンスが できます**."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Tôi biết chơi guitar.\"?",
            "options": [
              "ギターが{弾|ひ}くことができます。 (Gitaa ga hiku koto ga dekimasu.)",
              "ギターを{弾|ひ}きますことができます。 (Gitaa o hikimasu koto ga dekimasu.)",
              "ギターを{弾|ひ}くことができます。 (Gitaa o hiku koto ga dekimasu.)",
              "ギターを{弾|ひ}くができます。 (Gitaa o hiku ga dekimasu.)"
            ],
            "correct": 2,
            "why": "Có tân ngữ → **N を V辞書形 こと が できます**."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Tôi viết chữ Hán đẹp được.\"?",
            "options": [
              "{上手|じょうず}に{漢字|かんじ}が{書|か}くことをできます。 (Jouzu ni kanji ga kaku koto o dekimasu.)",
              "{上手|じょうず}で{漢字|かんじ}を{書|か}くことができます。 (Jouzu de kanji o kaku koto ga dekimasu.)",
              "{上手|じょうず}に{漢字|かんじ}を{書|か}きますことができます。 (Jouzu ni kanji o kakimasu koto ga dekimasu.)",
              "{上手|じょうず}に{漢字|かんじ}を{書|か}くことができます。 (Jouzu ni kanji o kaku koto ga dekimasu.)"
            ],
            "correct": 3,
            "why": "上手に + V こと が できます."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Anh tôi biết lái ô tô.\"?",
            "options": [
              "{兄|あに}は{車|くるま}の{運転|うんてん}をできます。 (Ani wa kuruma no unten o dekimasu.)",
              "{兄|あに}は{車|くるま}の{運転|うんてん}ができます。 (Ani wa kuruma no unten ga dekimasu.)",
              "{兄|あに}は{車|くるま}の{運転|うんてん}することができます。 (Ani wa kuruma no unten suru koto ga dekimasu.)",
              "{兄|あに}は{車|くるま}を{運転|うんてん}ができます。 (Ani wa kuruma o unten ga dekimasu.)"
            ],
            "correct": 1,
            "why": "N の 運転 が できます (hoặc 車を 運転する こと が できます)."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Bạn có trượt tuyết được không?\"?",
            "options": [
              "スキーをできますか。 (Sukii o dekimasu ka.)",
              "スキーができますか。 (Sukii ga dekimasu ka.)",
              "スキーがしますか。 (Sukii ga shimasu ka.)",
              "スキーのことができますか。 (Sukii no koto ga dekimasu ka.)"
            ],
            "correct": 1,
            "why": "N が できますか."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Tôi không ăn được đồ cay.\"?",
            "options": [
              "からいものを{食|た}べることをできません。 (Karai mono o taberu koto o dekimasen.)",
              "からいものを{食|た}べますことができません。 (Karai mono o tabemasu koto ga dekimasen.)",
              "からいものが{食|た}べることができません。 (Karai mono ga taberu koto ga dekimasen.)",
              "からいものを{食|た}べることができません。 (Karai mono o taberu koto ga dekimasen.)"
            ],
            "correct": 3,
            "why": "N を V辞書形 こと が できません."
          },
          {
            "q": "Câu nào đúng nghĩa: \"Mary biết tiếng Nhật một chút.\"?",
            "options": [
              "メアリーさんは{日本語|にほんご}を{少|すこ}しできます。 (Mearii-san wa Nihongo o sukoshi dekimasu.)",
              "メアリーさんは{日本語|にほんご}が{少|すこ}しできます。 (Mearii-san wa Nihongo ga sukoshi dekimasu.)",
              "メアリーさんは{日本語|にほんご}が{全然|ぜんぜん}できます。 (Mearii-san wa Nihongo ga zenzen dekimasu.)",
              "メアリーさんは{日本語|にほんご}が{少|すこ}しできません。 (Mearii-san wa Nihongo ga sukoshi dekimasen.)"
            ],
            "correct": 1,
            "why": "少し できます; 全然 phải đi với ～ません."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np1-dap",
        "title": "Hỏi – đáp: chọn câu trả lời đúng (8 câu)",
        "items": [
          {
            "q": "{趣味|しゅみ}は{何|なん}ですか。　〔Shumi wa nan desu ka.〕　(Bạn thích chụp ảnh.)",
            "options": [
              "{写真|しゃしん}を{撮|と}ることです。 (Shashin o toru koto desu.)",
              "{写真|しゃしん}を{撮|と}るです。 (Shashin o toru desu.)",
              "{写真|しゃしん}を{撮|と}ります。 (Shashin o torimasu.)",
              "{写真|しゃしん}を{撮|と}りますことです。 (Shashin o torimasu koto desu.)"
            ],
            "correct": 0,
            "why": "趣味は V辞書形 こと です."
          },
          {
            "q": "{泳|およ}ぐことができますか。　〔Oyogu koto ga dekimasu ka.〕　(Bạn không biết bơi.)",
            "options": [
              "いいえ、{泳|およ}ぎません。 (Iie, oyogimasen.)",
              "いいえ、{泳|およ}ぐことです。 (Iie, oyogu koto desu.)",
              "いいえ、できません。 (Iie, dekimasen.)",
              "いいえ、ありません。 (Iie, arimasen.)"
            ],
            "correct": 2,
            "why": "Hỏi \"làm được không\" → đáp **できません**."
          },
          {
            "q": "{日本|にほん}の{料理|りょうり}を{作|つく}ることができますか。　〔Nihon no ryouri o tsukuru koto ga dekimasu ka.〕　(Bạn làm được một chút.)",
            "options": [
              "はい、{全然|ぜんぜん}できます。 (Hai, zenzen dekimasu.)",
              "はい、{少|すこ}しあります。 (Hai, sukoshi arimasu.)",
              "はい、{少|すこ}し{作|つく}ることです。 (Hai, sukoshi tsukuru koto desu.)",
              "はい、{少|すこ}しできます。 (Hai, sukoshi dekimasu.)"
            ],
            "correct": 3,
            "why": "少し できます."
          },
          {
            "q": "どんなスポーツができますか。　〔Donna supootsu ga dekimasu ka.〕　(Bạn chơi tennis và bơi được.)",
            "options": [
              "テニスと{水泳|すいえい}です。できません。 (Tenisu to suiei desu. Dekimasen.)",
              "テニスをすると{泳|およ}ぐができます。 (Tenisu o suru to oyogu ga dekimasu.)",
              "テニスと{水泳|すいえい}ができます。 (Tenisu to suiei ga dekimasu.)",
              "テニスと{水泳|すいえい}をできます。 (Tenisu to suiei o dekimasu.)"
            ],
            "correct": 2,
            "why": "N と N が できます."
          },
          {
            "q": "ピアノを{弾|ひ}くことができますか。　〔Piano o hiku koto ga dekimasu ka.〕　(Bạn chơi được, ngày nào cũng chơi.)",
            "options": [
              "はい、できます。{毎日|まいにち}{弾|ひ}きています。 (Hai, dekimasu. Mainichi hikite imasu.)",
              "はい、します。{毎日|まいにち}{弾|ひ}いています。 (Hai, shimasu. Mainichi hiite imasu.)",
              "はい、できます。{毎日|まいにち}{弾|ひ}いています。 (Hai, dekimasu. Mainichi hiite imasu.)",
              "はい、あります。{毎日|まいにち}{弾|ひ}いています。 (Hai, arimasu. Mainichi hiite imasu.)"
            ],
            "correct": 2,
            "why": "はい、できます + 弾いています (thể て: き → いて)."
          },
          {
            "q": "どうして{料理|りょうり}{教室|きょうしつ}に{入|はい}りましたか。　〔Doushite ryouri kyoushitsu ni hairimashita ka.〕　(Vì bạn không nấu ăn được.)",
            "options": [
              "{料理|りょうり}を{作|つく}るができませんから。 (Ryouri o tsukuru ga dekimasen kara.)",
              "{料理|りょうり}を{作|つく}ることができませんから。 (Ryouri o tsukuru koto ga dekimasen kara.)",
              "{料理|りょうり}が{作|つく}ることですから。 (Ryouri ga tsukuru koto desu kara.)",
              "{料理|りょうり}を{作|つく}りますことができませんから。 (Ryouri o tsukurimasu koto ga dekimasen kara.)"
            ],
            "correct": 1,
            "why": "Lý do: V こと が できません **から**."
          },
          {
            "q": "{趣味|しゅみ}は{音楽|おんがく}ですか。　〔Shumi wa ongaku desu ka.〕　(Đúng, đặc biệt là nhạc cổ điển.)",
            "options": [
              "はい。{特|とく}にクラシックが{好|す}くです。 (Hai. Tokuni kurashikku ga suku desu.)",
              "はい。{特|とく}にクラシックが{好|す}きです。 (Hai. Tokuni kurashikku ga suki desu.)",
              "はい。{全然|ぜんぜん}クラシックが{好|す}きです。 (Hai. Zenzen kurashikku ga suki desu.)",
              "はい。{特|とく}にクラシックを{好|す}きです。 (Hai. Tokuni kurashikku o suki desu.)"
            ],
            "correct": 1,
            "why": "特に N が 好きです."
          },
          {
            "q": "{漢字|かんじ}を{書|か}くことができますか。　〔Kanji o kaku koto ga dekimasu ka.〕　(Bạn viết được một ít.)",
            "options": [
              "{少|すこ}し{書|か}きますことができます。 (Sukoshi kakimasu koto ga dekimasu.)",
              "{少|すこ}し{書|か}くことができます。 (Sukoshi kaku koto ga dekimasu.)",
              "{少|すこ}し{書|か}くことをできます。 (Sukoshi kaku koto o dekimasu.)",
              "{少|すこ}し{書|か}くができます。 (Sukoshi kaku ga dekimasu.)"
            ],
            "correct": 1,
            "why": "少し V こと が できます."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np1-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "{私|わたし}の{趣味|しゅみ}は{映画|えいが}です。 (Watashi no shumi wa eiga desu.)",
              "{私|わたし}の{趣味|しゅみ}は{映画|えいが}を{見|み}ますことです。 (Watashi no shumi wa eiga o mimasu koto desu.)",
              "{私|わたし}の{趣味|しゅみ}は{映画|えいが}を{見|み}ることと{本|ほん}を{読|よ}むことです。 (Watashi no shumi wa eiga o miru koto to hon o yomu koto desu.)",
              "{私|わたし}の{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。 (Watashi no shumi wa eiga o miru koto desu.)"
            ],
            "correct": 1,
            "why": "Trước こと không dùng thể ます."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{趣味|しゅみ}は{水泳|すいえい}です。 (Shumi wa suiei desu.)",
              "{趣味|しゅみ}はプールで{泳|およ}ぐことです。 (Shumi wa puuru de oyogu koto desu.)",
              "{趣味|しゅみ}は{泳|およ}ぐことです。 (Shumi wa oyogu koto desu.)",
              "{趣味|しゅみ}は{泳|およ}ぐです。 (Shumi wa oyogu desu.)"
            ],
            "correct": 3,
            "why": "Động từ không đứng thẳng trước です — phải có **こと**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{料理|りょうり}が{少|すこ}しできます。 (Ryouri ga sukoshi dekimasu.)",
              "{料理|りょうり}ができます。 (Ryouri ga dekimasu.)",
              "{料理|りょうり}を{作|つく}ることができます。 (Ryouri o tsukuru koto ga dekimasu.)",
              "{料理|りょうり}を{作|つく}ることをできます。 (Ryouri o tsukuru koto o dekimasu.)"
            ],
            "correct": 3,
            "why": "できます đi với **が**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{日本語|にほんご}ができます。 (Nihongo ga dekimasu.)",
              "{日本語|にほんご}がわかります。 (Nihongo ga wakarimasu.)",
              "{日本語|にほんご}をわかります。 (Nihongo o wakarimasu.)",
              "{日本語|にほんご}を{話|はな}すことができます。 (Nihongo o hanasu koto ga dekimasu.)"
            ],
            "correct": 2,
            "why": "わかります cũng đi với **が** (Bài 7)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{朝|あさ}{早|はや}く{起|お}くことができます。 (Asa hayaku oku koto ga dekimasu.)",
              "{日本語|にほんご}で{話|はな}すことができます。 (Nihongo de hanasu koto ga dekimasu.)",
              "{朝|あさ}{早|はや}く{起|お}きることができます。 (Asa hayaku okiru koto ga dekimasu.)",
              "{一人|ひとり}で{電車|でんしゃ}に{乗|の}ることができます。 (Hitori de densha ni noru koto ga dekimasu.)"
            ],
            "correct": 0,
            "why": "起きます là nhóm 2 → **起きる**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{一人|ひとり}で{来|き}ることができます。 (Hitori de kiru koto ga dekimasu.)",
              "{一人|ひとり}で{行|い}くことができます。 (Hitori de iku koto ga dekimasu.)",
              "{一人|ひとり}で{帰|かえ}ることができます。 (Hitori de kaeru koto ga dekimasu.)",
              "{一人|ひとり}で{来|く}ることができます。 (Hitori de kuru koto ga dekimasu.)"
            ],
            "correct": 0,
            "why": "来ます → **来る (くる)**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "パクさんはピアノを{弾|ひ}くことができます。 (Paku-san wa piano o hiku koto ga dekimasu.)",
              "パクさんはピアノが{上手|じょうず}です。 (Paku-san wa piano ga jouzu desu.)",
              "パクさんは{上手|じょうず}でピアノを{弾|ひ}くことができます。 (Paku-san wa jouzu de piano o hiku koto ga dekimasu.)",
              "パクさんは{上手|じょうず}にピアノを{弾|ひ}くことができます。 (Paku-san wa jouzu ni piano o hiku koto ga dekimasu.)"
            ],
            "correct": 2,
            "why": "Trước động từ dùng **上手に**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{一人|ひとり}で{電車|でんしゃ}を{降|お}りることができます。 (Hitori de densha o oriru koto ga dekimasu.)",
              "{一人|ひとり}でうちへ{帰|かえ}ることができます。 (Hitori de uchi e kaeru koto ga dekimasu.)",
              "{一人|ひとり}でうちへ{帰|かえ}りることができます。 (Hitori de uchi e kaeriru koto ga dekimasu.)",
              "{一人|ひとり}でうちへ{帰|かえ}ります。 (Hitori de uchi e kaerimasu.)"
            ],
            "correct": 2,
            "why": "帰ります là nhóm 1 → **帰る**."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-np1-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 81, 82",
        "items": [
          {
            "q": "Sở thích của tôi là đọc sách.",
            "answers": [
              "私の趣味は本を読むことです。",
              "私の趣味は本をよむことです。",
              "私の趣味はほんを読むことです。",
              "私の趣味はほんをよむことです。",
              "私のしゅみは本を読むことです。",
              "私のしゅみは本をよむことです。",
              "私のしゅみはほんを読むことです。",
              "私のしゅみはほんをよむことです。",
              "わたしの趣味は本を読むことです。",
              "わたしの趣味は本をよむことです。",
              "わたしの趣味はほんを読むことです。",
              "わたしの趣味はほんをよむことです。",
              "わたしのしゅみは本を読むことです。",
              "わたしのしゅみは本をよむことです。",
              "わたしのしゅみはほんを読むことです。",
              "わたしのしゅみはほんをよむことです。",
              "趣味は本を読むことです。",
              "趣味は本をよむことです。",
              "趣味はほんを読むことです。",
              "趣味はほんをよむことです。",
              "しゅみは本を読むことです。",
              "しゅみは本をよむことです。",
              "しゅみはほんを読むことです。",
              "しゅみはほんをよむことです。",
              "趣味は読書です。",
              "趣味はどくしょです。",
              "しゅみは読書です。",
              "しゅみはどくしょです。"
            ],
            "hint": "趣味は V こと です"
          },
          {
            "q": "Sở thích của tôi là bơi.",
            "answers": [
              "趣味は泳ぐことです。",
              "趣味はおよぐことです。",
              "しゅみは泳ぐことです。",
              "しゅみはおよぐことです。",
              "私の趣味は泳ぐことです。",
              "私の趣味はおよぐことです。",
              "私のしゅみは泳ぐことです。",
              "私のしゅみはおよぐことです。",
              "わたしの趣味は泳ぐことです。",
              "わたしの趣味はおよぐことです。",
              "わたしのしゅみは泳ぐことです。",
              "わたしのしゅみはおよぐことです。",
              "趣味は水泳です。",
              "趣味はすいえいです。",
              "しゅみは水泳です。",
              "しゅみはすいえいです。"
            ],
            "hint": "趣味は V こと です"
          },
          {
            "q": "Tôi trượt tuyết được.",
            "answers": [
              "スキーができます。",
              "私はスキーができます。",
              "わたしはスキーができます。"
            ],
            "hint": "N が できます"
          },
          {
            "q": "Tôi không nấu ăn được.",
            "answers": [
              "料理を作ることができません。",
              "料理をつくることができません。",
              "りょうりを作ることができません。",
              "りょうりをつくることができません。",
              "私は料理を作ることができません。",
              "私は料理をつくることができません。",
              "私はりょうりを作ることができません。",
              "私はりょうりをつくることができません。",
              "わたしは料理を作ることができません。",
              "わたしは料理をつくることができません。",
              "わたしはりょうりを作ることができません。",
              "わたしはりょうりをつくることができません。",
              "料理ができません。",
              "りょうりができません。"
            ],
            "hint": "V こと が できません"
          },
          {
            "q": "Bạn có biết lái ô tô không?",
            "answers": [
              "車の運転ができますか。",
              "車のうんてんができますか。",
              "くるまの運転ができますか。",
              "くるまのうんてんができますか。",
              "車を運転することができますか。",
              "車をうんてんすることができますか。",
              "くるまを運転することができますか。",
              "くるまをうんてんすることができますか。"
            ],
            "hint": "N が できますか"
          },
          {
            "q": "Tôi biết tiếng Nhật một chút.",
            "answers": [
              "日本語が少しできます。",
              "日本語がすこしできます。",
              "にほんごが少しできます。",
              "にほんごがすこしできます。",
              "私は日本語が少しできます。",
              "私は日本語がすこしできます。",
              "私はにほんごが少しできます。",
              "私はにほんごがすこしできます。",
              "わたしは日本語が少しできます。",
              "わたしは日本語がすこしできます。",
              "わたしはにほんごが少しできます。",
              "わたしはにほんごがすこしできます。"
            ],
            "hint": "少し できます"
          },
          {
            "q": "Sở thích của em gái tôi là vẽ tranh.",
            "answers": [
              "妹の趣味は絵を描くことです。",
              "妹の趣味は絵をかくことです。",
              "妹の趣味はえを描くことです。",
              "妹の趣味はえをかくことです。",
              "妹のしゅみは絵を描くことです。",
              "妹のしゅみは絵をかくことです。",
              "妹のしゅみはえを描くことです。",
              "妹のしゅみはえをかくことです。",
              "いもうとの趣味は絵を描くことです。",
              "いもうとの趣味は絵をかくことです。",
              "いもうとの趣味はえを描くことです。",
              "いもうとの趣味はえをかくことです。",
              "いもうとのしゅみは絵を描くことです。",
              "いもうとのしゅみは絵をかくことです。",
              "いもうとのしゅみはえを描くことです。",
              "いもうとのしゅみはえをかくことです。"
            ],
            "hint": "趣味は V こと です"
          },
          {
            "q": "Tôi đi được xe đạp.",
            "answers": [
              "自転車に乗ることができます。",
              "自転車にのることができます。",
              "じてんしゃに乗ることができます。",
              "じてんしゃにのることができます。",
              "私は自転車に乗ることができます。",
              "私は自転車にのることができます。",
              "私はじてんしゃに乗ることができます。",
              "私はじてんしゃにのることができます。",
              "わたしは自転車に乗ることができます。",
              "わたしは自転車にのることができます。",
              "わたしはじてんしゃに乗ることができます。",
              "わたしはじてんしゃにのることができます。"
            ],
            "hint": "N に 乗る こと が できます"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-np1-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Sở thích của tôi là chơi piano.",
            "chips": [
              "ことです",
              "{私|わたし}の{趣味|しゅみ}は",
              "ピアノを",
              "{弾|ひ}きます",
              "{弾|ひ}く"
            ],
            "answer": [
              "{私|わたし}の{趣味|しゅみ}は",
              "ピアノを",
              "{弾|ひ}く",
              "ことです"
            ],
            "ro": "Watashi no shumi wa piano o hiku koto desu"
          },
          {
            "vi": "Tôi bơi được 100 mét.",
            "chips": [
              "できます",
              "{泳|およ}ぐことが",
              "{泳|およ}ぎますことが",
              "{百|ひゃく}メートル",
              "{私|わたし}は"
            ],
            "answer": [
              "{私|わたし}は",
              "{百|ひゃく}メートル",
              "{泳|およ}ぐことが",
              "できます"
            ],
            "ro": "Watashi wa hyakumeetoru oyogu koto ga dekimasu"
          },
          {
            "vi": "Anh tôi biết lái ô tô.",
            "chips": [
              "できます",
              "{運転|うんてん}を",
              "{兄|あに}は",
              "{運転|うんてん}が",
              "{車|くるま}の"
            ],
            "answer": [
              "{兄|あに}は",
              "{車|くるま}の",
              "{運転|うんてん}が",
              "できます"
            ],
            "ro": "Ani wa kuruma no unten ga dekimasu"
          },
          {
            "vi": "Bạn có viết được chữ Hán không?",
            "chips": [
              "{書|か}くことが",
              "{書|か}きます",
              "{漢字|かんじ}を",
              "できますか"
            ],
            "answer": [
              "{漢字|かんじ}を",
              "{書|か}くことが",
              "できますか"
            ],
            "ro": "Kanji o kaku koto ga dekimasu ka"
          },
          {
            "vi": "Tôi hoàn toàn không nhảy được.",
            "chips": [
              "できます",
              "ダンスが",
              "{全然|ぜんぜん}",
              "できません",
              "{私|わたし}は"
            ],
            "answer": [
              "{私|わたし}は",
              "ダンスが",
              "{全然|ぜんぜん}",
              "できません"
            ],
            "ro": "Watashi wa dansu ga zenzen dekimasen"
          },
          {
            "vi": "Sở thích của bố tôi là câu cá.",
            "chips": [
              "{釣|つ}り",
              "{父|ちち}の",
              "{趣味|しゅみ}は",
              "です",
              "する"
            ],
            "answer": [
              "{父|ちち}の",
              "{趣味|しゅみ}は",
              "{釣|つ}り",
              "です"
            ],
            "ro": "Chichi no shumi wa tsuri desu"
          },
          {
            "vi": "Vì không biết tiếng Anh nên tôi muốn học.",
            "chips": [
              "です",
              "{習|なら}いたい",
              "できますから、",
              "{英語|えいご}が",
              "できませんから、"
            ],
            "answer": [
              "{英語|えいご}が",
              "できませんから、",
              "{習|なら}いたい",
              "です"
            ],
            "ro": "Eigo ga dekimasen kara, naraitai desu"
          },
          {
            "vi": "Park chơi piano giỏi.",
            "chips": [
              "パクさんは",
              "できます",
              "{上手|じょうず}に",
              "{上手|じょうず}な",
              "ピアノを{弾|ひ}くことが"
            ],
            "answer": [
              "パクさんは",
              "{上手|じょうず}に",
              "ピアノを{弾|ひ}くことが",
              "できます"
            ],
            "ro": "Paku-san wa jouzu ni piano o hiku koto ga dekimasu"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch · nhiều ô trống · tình huống thi nói"
      },
      {
        "t": "quiz",
        "id": "lt-b9-np1-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 81, 82",
        "items": [
          {
            "q": "Sở thích của tôi là xem phim. Đặc biệt là phim hành động.",
            "answers": [
              "私の趣味は映画を見ることです。特にアクション映画が好きです。",
              "わたしのしゅみはえいがをみることです。とくにアクションえいががすきです。",
              "わたしの趣味は映画を見ることです。特にアクション映画が好きです。",
              "私のしゅみはえいがをみることです。とくにアクションえいががすきです。",
              "私のしゅみは映画を見ることです。特にアクション映画が好きです。",
              "わたしの趣味はえいがをみることです。とくにアクションえいががすきです。",
              "私の趣味はえいがを見ることです。特にアクション映画が好きです。",
              "わたしのしゅみは映画をみることです。とくにアクションえいががすきです。",
              "私の趣味は映画をみることです。特にアクション映画が好きです。",
              "わたしのしゅみはえいがを見ることです。とくにアクションえいががすきです。",
              "私の趣味は映画を見ることです。とくにアクション映画が好きです。",
              "わたしのしゅみはえいがをみることです。特にアクションえいががすきです。",
              "私の趣味は映画を見ることです。特にアクションえいがが好きです。",
              "わたしのしゅみはえいがをみることです。とくにアクション映画がすきです。",
              "私の趣味は映画を見ることです。特にアクション映画がすきです。",
              "わたしのしゅみはえいがをみることです。とくにアクションえいがが好きです。",
              "趣味は映画を見ることです。特にアクション映画が好きです。",
              "しゅみはえいがをみることです。とくにアクションえいががすきです。",
              "しゅみは映画を見ることです。特にアクション映画が好きです。",
              "趣味はえいがをみることです。とくにアクションえいががすきです。",
              "趣味はえいがを見ることです。特にアクション映画が好きです。",
              "しゅみは映画をみることです。とくにアクションえいががすきです。",
              "趣味は映画をみることです。特にアクション映画が好きです。",
              "しゅみはえいがを見ることです。とくにアクションえいががすきです。",
              "趣味は映画を見ることです。とくにアクション映画が好きです。",
              "しゅみはえいがをみることです。特にアクションえいががすきです。",
              "趣味は映画を見ることです。特にアクションえいがが好きです。",
              "しゅみはえいがをみることです。とくにアクション映画がすきです。",
              "趣味は映画を見ることです。特にアクション映画がすきです。",
              "しゅみはえいがをみることです。とくにアクションえいがが好きです。"
            ],
            "hint": "趣味は V こと · 特に"
          },
          {
            "q": "Tôi không bơi được nên muốn học bơi.",
            "answers": [
              "泳ぐことができませんから、水泳を習いたいです。",
              "泳ぐことができませんから、水泳をならいたいです。",
              "泳ぐことができませんから、すいえいを習いたいです。",
              "泳ぐことができませんから、すいえいをならいたいです。",
              "およぐことができませんから、水泳を習いたいです。",
              "およぐことができませんから、水泳をならいたいです。",
              "およぐことができませんから、すいえいを習いたいです。",
              "およぐことができませんから、すいえいをならいたいです。",
              "泳ぐことができませんから、泳ぎを習いたいです。",
              "泳ぐことができませんから、泳ぎをならいたいです。",
              "泳ぐことができませんから、およぎを習いたいです。",
              "泳ぐことができませんから、およぎをならいたいです。",
              "およぐことができませんから、泳ぎを習いたいです。",
              "およぐことができませんから、泳ぎをならいたいです。",
              "およぐことができませんから、およぎを習いたいです。",
              "およぐことができませんから、およぎをならいたいです。"
            ],
            "hint": "V こと が できません から"
          },
          {
            "q": "Wang biết tiếng Nhật, tiếng Anh và tiếng Trung.",
            "answers": [
              "ワンさんは日本語と英語と中国語ができます。",
              "ワンさんは日本語と英語とちゅうごくごができます。",
              "ワンさんは日本語とえいごと中国語ができます。",
              "ワンさんは日本語とえいごとちゅうごくごができます。",
              "ワンさんはにほんごと英語と中国語ができます。",
              "ワンさんはにほんごと英語とちゅうごくごができます。",
              "ワンさんはにほんごとえいごと中国語ができます。",
              "ワンさんはにほんごとえいごとちゅうごくごができます。"
            ],
            "hint": "N と N が できます"
          },
          {
            "q": "Bạn có nấu được món Nhật không? — Không, tôi không nấu được.",
            "answers": [
              "日本の料理を作ることができますか。いいえ、できません。",
              "日本の料理をつくることができますか。いいえ、できません。",
              "日本のりょうりを作ることができますか。いいえ、できません。",
              "日本のりょうりをつくることができますか。いいえ、できません。",
              "にほんの料理を作ることができますか。いいえ、できません。",
              "にほんの料理をつくることができますか。いいえ、できません。",
              "にほんのりょうりを作ることができますか。いいえ、できません。",
              "にほんのりょうりをつくることができますか。いいえ、できません。",
              "日本料理を作ることができますか。いいえ、できません。",
              "日本料理をつくることができますか。いいえ、できません。",
              "にほんりょうりを作ることができますか。いいえ、できません。",
              "にほんりょうりをつくることができますか。いいえ、できません。"
            ],
            "hint": "V こと が できますか"
          },
          {
            "q": "Sở thích của anh tôi là chụp ảnh.",
            "answers": [
              "兄の趣味は写真を撮ることです。",
              "兄の趣味は写真をとることです。",
              "兄の趣味はしゃしんを撮ることです。",
              "兄の趣味はしゃしんをとることです。",
              "兄のしゅみは写真を撮ることです。",
              "兄のしゅみは写真をとることです。",
              "兄のしゅみはしゃしんを撮ることです。",
              "兄のしゅみはしゃしんをとることです。",
              "あにの趣味は写真を撮ることです。",
              "あにの趣味は写真をとることです。",
              "あにの趣味はしゃしんを撮ることです。",
              "あにの趣味はしゃしんをとることです。",
              "あにのしゅみは写真を撮ることです。",
              "あにのしゅみは写真をとることです。",
              "あにのしゅみはしゃしんを撮ることです。",
              "あにのしゅみはしゃしんをとることです。",
              "兄の趣味は写真です。",
              "兄の趣味はしゃしんです。",
              "兄のしゅみは写真です。",
              "兄のしゅみはしゃしんです。",
              "あにの趣味は写真です。",
              "あにの趣味はしゃしんです。",
              "あにのしゅみは写真です。",
              "あにのしゅみはしゃしんです。"
            ],
            "hint": "趣味は V こと"
          },
          {
            "q": "Em gái tôi đi được xe đạp.",
            "answers": [
              "妹は自転車に乗ることができます。",
              "妹は自転車にのることができます。",
              "妹はじてんしゃに乗ることができます。",
              "妹はじてんしゃにのることができます。",
              "いもうとは自転車に乗ることができます。",
              "いもうとは自転車にのることができます。",
              "いもうとはじてんしゃに乗ることができます。",
              "いもうとはじてんしゃにのることができます。"
            ],
            "hint": "に 乗る こと が できます"
          },
          {
            "q": "Tôi trượt tuyết được một chút.",
            "answers": [
              "スキーが少しできます。",
              "スキーがすこしできます。",
              "私はスキーが少しできます。",
              "私はスキーがすこしできます。",
              "わたしはスキーが少しできます。",
              "わたしはスキーがすこしできます。"
            ],
            "hint": "少し できます"
          },
          {
            "q": "Mary hát hay.",
            "answers": [
              "メアリーさんは上手に歌を歌うことができます。",
              "メアリーさんは上手に歌をうたうことができます。",
              "メアリーさんは上手にうたを歌うことができます。",
              "メアリーさんは上手にうたをうたうことができます。",
              "メアリーさんはじょうずに歌を歌うことができます。",
              "メアリーさんはじょうずに歌をうたうことができます。",
              "メアリーさんはじょうずにうたを歌うことができます。",
              "メアリーさんはじょうずにうたをうたうことができます。",
              "メアリーさんは歌が上手です。",
              "メアリーさんは歌がじょうずです。",
              "メアリーさんはうたが上手です。",
              "メアリーさんはうたがじょうずです。"
            ],
            "hint": "上手に V こと が できます"
          },
          {
            "q": "Sở thích của tôi là du lịch và nấu ăn.",
            "answers": [
              "私の趣味は旅行と料理です。",
              "私の趣味は旅行とりょうりです。",
              "私の趣味はりょこうと料理です。",
              "私の趣味はりょこうとりょうりです。",
              "私のしゅみは旅行と料理です。",
              "私のしゅみは旅行とりょうりです。",
              "私のしゅみはりょこうと料理です。",
              "私のしゅみはりょこうとりょうりです。",
              "わたしの趣味は旅行と料理です。",
              "わたしの趣味は旅行とりょうりです。",
              "わたしの趣味はりょこうと料理です。",
              "わたしの趣味はりょこうとりょうりです。",
              "わたしのしゅみは旅行と料理です。",
              "わたしのしゅみは旅行とりょうりです。",
              "わたしのしゅみはりょこうと料理です。",
              "わたしのしゅみはりょこうとりょうりです。",
              "趣味は旅行と料理です。",
              "趣味は旅行とりょうりです。",
              "趣味はりょこうと料理です。",
              "趣味はりょこうとりょうりです。",
              "しゅみは旅行と料理です。",
              "しゅみは旅行とりょうりです。",
              "しゅみはりょこうと料理です。",
              "しゅみはりょこうとりょうりです。"
            ],
            "hint": "趣味は N と N です"
          },
          {
            "q": "Tôi không đọc được báo tiếng Nhật.",
            "answers": [
              "日本語の新聞を読むことができません。",
              "日本語の新聞をよむことができません。",
              "日本語のしんぶんを読むことができません。",
              "日本語のしんぶんをよむことができません。",
              "にほんごの新聞を読むことができません。",
              "にほんごの新聞をよむことができません。",
              "にほんごのしんぶんを読むことができません。",
              "にほんごのしんぶんをよむことができません。",
              "私は日本語の新聞を読むことができません。",
              "私は日本語の新聞をよむことができません。",
              "私は日本語のしんぶんを読むことができません。",
              "私は日本語のしんぶんをよむことができません。",
              "私はにほんごの新聞を読むことができません。",
              "私はにほんごの新聞をよむことができません。",
              "私はにほんごのしんぶんを読むことができません。",
              "私はにほんごのしんぶんをよむことができません。",
              "わたしは日本語の新聞を読むことができません。",
              "わたしは日本語の新聞をよむことができません。",
              "わたしは日本語のしんぶんを読むことができません。",
              "わたしは日本語のしんぶんをよむことができません。",
              "わたしはにほんごの新聞を読むことができません。",
              "わたしはにほんごの新聞をよむことができません。",
              "わたしはにほんごのしんぶんを読むことができません。",
              "わたしはにほんごのしんぶんをよむことができません。"
            ],
            "hint": "V こと が できません"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np1-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{趣味|しゅみ}は{写真|しゃしん}（①）{撮|と}る（②）です。　〔Shumi wa shashin ((1)) toru ((2)) desu.〕　— Sở thích là chụp ảnh.",
            "options": [
              "① を　② の",
              "① を　② こと",
              "① が　② こと",
              "① に　② もの"
            ],
            "correct": 1,
            "why": "N **を** V辞書形 **こと** です. → **{趣味|しゅみ}は{写真|しゃしん}を{撮|と}ることです。** 〔Shumi wa shashin o toru koto desu.〕 — Sở thích là chụp ảnh."
          },
          {
            "q": "{私|わたし}は{車|くるま}（①）{運転|うんてん}（②）できます。　〔Watashi wa kuruma ((1)) unten ((2)) dekimasu.〕　— Tôi biết lái ô tô.",
            "options": [
              "① を　② を",
              "① に　② が",
              "① の　② が",
              "① が　② の"
            ],
            "correct": 2,
            "why": "車**の**運転**が** できます. → **{私|わたし}は{車|くるま}の{運転|うんてん}ができます。** 〔Watashi wa kuruma no unten ga dekimasu.〕 — Tôi biết lái ô tô."
          },
          {
            "q": "{妹|いもうと}は{上手|じょうず}（①）ピアノを{弾|ひ}く（②）ができます。　〔Imouto wa jouzu ((1)) piano o hiku ((2)) ga dekimasu.〕　— Em gái tôi chơi piano giỏi.",
            "options": [
              "① に　② こと",
              "① で　② もの",
              "① に　② の",
              "① な　② こと"
            ],
            "correct": 0,
            "why": "上手**に** + V **こと** が できます. → **{妹|いもうと}は{上手|じょうず}にピアノを{弾|ひ}くことができます。** 〔Imouto wa jouzu ni piano o hiku koto ga dekimasu.〕 — Em gái tôi chơi piano giỏi."
          },
          {
            "q": "{日本語|にほんご}が{少|すこ}し（①）から、{日本|にほん}のドラマを（②）ことができます。　〔Nihongo ga sukoshi ((1)) kara, Nihon no dorama o ((2)) koto ga dekimasu.〕　— Vì biết tiếng Nhật một chút nên tôi xem được phim Nhật.",
            "options": [
              "① できます　② {見|み}る",
              "① できます　② {見|み}ます",
              "① します　② {見|み}て",
              "① できません　② {見|み}る"
            ],
            "correct": 0,
            "why": "Lý do hợp lý: biết một chút **できます** → có thể **見る**. → **{日本語|にほんご}が{少|すこ}しできますから、{日本|にほん}のドラマを{見|み}ることができます。** 〔Nihongo ga sukoshi dekimasu kara, Nihon no dorama o miru koto ga dekimasu.〕 — Vì biết tiếng Nhật một chút nên tôi xem được phim Nhật."
          },
          {
            "q": "{趣味|しゅみ}は{音楽|おんがく}です。{特|とく}にポップス（①）{好|す}きです。ギターも（②）ことができます。　〔Shumi wa ongaku desu. Tokuni poppusu ((1)) suki desu. Gitaa mo ((2)) koto ga dekimasu.〕　— Sở thích là âm nhạc. Đặc biệt thích nhạc pop. Tôi cũng chơi được guitar.",
            "options": [
              "① を　② {弾|ひ}く",
              "① が　② {弾|ひ}きます",
              "① が　② {弾|ひ}く",
              "① を　② {弾|ひ}いて"
            ],
            "correct": 2,
            "why": "好き đi với **が**; trước こと → **弾く**. → **{趣味|しゅみ}は{音楽|おんがく}です。{特|とく}にポップスが{好|す}きです。ギターも{弾|ひ}くことができます。** 〔Shumi wa ongaku desu. Tokuni poppusu ga suki desu. Gitaa mo hiku koto ga dekimasu.〕 — Sở thích là âm nhạc. Đặc biệt thích nhạc pop. Tôi cũng chơi được guitar."
          },
          {
            "q": "{自転車|じてんしゃ}（①）{乗|の}ること（②）できますか。　〔Jitensha ((1)) noru koto ((2)) dekimasu ka.〕　— Bạn đi được xe đạp không?",
            "options": [
              "① に　② が",
              "① で　② が",
              "① を　② を",
              "① に　② を"
            ],
            "correct": 0,
            "why": "N **に** 乗る こと **が** できますか. → **{自転車|じてんしゃ}に{乗|の}ることができますか。** 〔Jitensha ni noru koto ga dekimasu ka.〕 — Bạn đi được xe đạp không?"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np1-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Giám khảo hỏi 「しゅみは なんですか」. Bạn thích nghe nhạc.",
            "options": [
              "{音楽|おんがく}を{聞|き}くです。 (Ongaku o kiku desu.)",
              "{音楽|おんがく}を{聞|き}くことです。 (Ongaku o kiku koto desu.)",
              "{音楽|おんがく}を{聞|き}きます。 (Ongaku o kikimasu.)",
              "{音楽|おんがく}を{聞|き}きますことです。 (Ongaku o kikimasu koto desu.)"
            ],
            "correct": 1,
            "why": "V辞書形 こと です."
          },
          {
            "q": "Bạn muốn nói: không biết bơi nên muốn học.",
            "options": [
              "{泳|およ}ぎますことができませんから、{習|なら}いたいです。 (Oyogimasu koto ga dekimasen kara, naraitai desu.)",
              "{泳|およ}ぐことができますから、{習|なら}いたいです。 (Oyogu koto ga dekimasu kara, naraitai desu.)",
              "{泳|およ}ぐことができませんから、{習|なら}いたいです。 (Oyogu koto ga dekimasen kara, naraitai desu.)",
              "{泳|およ}ぐことをできませんから、{習|なら}いますたいです。 (Oyogu koto o dekimasen kara, naraimasu tai desu.)"
            ],
            "correct": 2,
            "why": "V こと が できません から、～たいです."
          },
          {
            "q": "Bạn hỏi bạn mới có biết lái ô tô không.",
            "options": [
              "{車|くるま}の{運転|うんてん}がありますか。 (Kuruma no unten ga arimasu ka.)",
              "{車|くるま}の{運転|うんてん}をできますか。 (Kuruma no unten o dekimasu ka.)",
              "{車|くるま}を{運転|うんてん}がしますか。 (Kuruma o unten ga shimasu ka.)",
              "{車|くるま}の{運転|うんてん}ができますか。 (Kuruma no unten ga dekimasu ka.)"
            ],
            "correct": 3,
            "why": "N が できますか."
          },
          {
            "q": "Bạn khen bạn viết chữ Hán đẹp.",
            "options": [
              "すごいですね。{漢字|かんじ}が{上手|じょうず}ですね。 (Sugoi desu ne. Kanji ga jouzu desu ne.)",
              "すごくですね。{漢字|かんじ}が{上手|じょうず}ですね。 (Sugoku desu ne. Kanji ga jouzu desu ne.)",
              "すごいですね。{漢字|かんじ}を{上手|じょうず}ですね。 (Sugoi desu ne. Kanji o jouzu desu ne.)",
              "すごいですね。{漢字|かんじ}が{上手|じょうず}にですね。 (Sugoi desu ne. Kanji ga jouzu ni desu ne.)"
            ],
            "correct": 0,
            "why": "すごいですね + N が 上手ですね."
          },
          {
            "q": "Bạn giới thiệu: sở thích là sưu tầm tem, đặc biệt tem Nhật.",
            "options": [
              "{趣味|しゅみ}は{切手|きって}が{集|あつ}めることです。{特|とく}に{日本|にほん}の{切手|きって}が{好|す}きです。 (Shumi wa kitte ga atsumeru koto desu. Tokuni Nihon no kitte ga suki desu.)",
              "{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。{特|とく}に{日本|にほん}の{切手|きって}が{好|す}きです。 (Shumi wa kitte o atsumeru koto desu. Tokuni Nihon no kitte ga suki desu.)",
              "{趣味|しゅみ}は{切手|きって}を{集|あつ}めますことです。{特|とく}に{日本|にほん}の{切手|きって}が{好|す}きです。 (Shumi wa kitte o atsumemasu koto desu. Tokuni Nihon no kitte ga suki desu.)",
              "{趣味|しゅみ}は{切手|きって}を{集|あつ}めるです。{特|とく}に{日本|にほん}の{切手|きって}が{好|す}きです。 (Shumi wa kitte o atsumeru desu. Tokuni Nihon no kitte ga suki desu.)"
            ],
            "correct": 1,
            "why": "N を 集める こと です."
          },
          {
            "q": "Bạn nói mình biết tiếng Nhật một chút.",
            "options": [
              "{日本語|にほんご}が{全然|ぜんぜん}できます。 (Nihongo ga zenzen dekimasu.)",
              "{日本語|にほんご}が{少|すこ}しできます。 (Nihongo ga sukoshi dekimasu.)",
              "{日本語|にほんご}を{少|すこ}しできます。 (Nihongo o sukoshi dekimasu.)",
              "{日本語|にほんご}が{少|すこ}ししません。 (Nihongo ga sukoshi shimasen.)"
            ],
            "correct": 1,
            "why": "N が 少し できます."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "Trước **こと** luôn là **thể từ điển** · **できます** luôn đi với **が** · **上手に** đứng trước động từ.",
          "Thi nói: 「しゅみは なんですか」→ **わたしの しゅみは ～ことです** + 1 câu (特に～が好きです／一週間に～回 します). 「～が できますか」→ **はい、できます／いいえ、できません** + lý do hoặc mức độ."
        ]
      }
    ]
  },
  {
    "id": "lt-b9-np-2",
    "kind": "homework",
    "title": "Luyện thêm Bài 9 · Ngữ pháp 2 (ポイント 83, 84, 86) — Vて、Vて、V · ～に～回 · どうやって (~104 câu)",
    "goal": "Kể chuỗi việc theo thứ tự bằng Vて、Vて、V (chỉ động từ cuối mang thì), nói bao lâu bao nhiêu lần/cái (一週間に二回 · 一日に三杯), dùng đúng từ đếm 回・杯・本・冊, và hỏi–chỉ cách làm/cách đi bằng どうやって.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Vて、Vて、V**: thứ tự trong câu = thứ tự thời gian; **chỉ động từ CUỐI** mang thì (～ます/～ました). Thể て ôn lại Bài 7: 行く → **行って**, 泳ぐ → **泳いで**, 乗る → **乗って**.",
          "**[khoảng thời gian] に [số lượng] V**: 一週間**に** 二回 · 一日**に** 三杯 — đừng quên **に**. Từ đếm: lần **回**, cốc **杯**, chai/cây **本**, quyển **冊**. Biến âm: いっかい・ろっかい・じゅっかい · いっぱい・さんばい・ろっぱい · いっぽん・さんぼん・ろっぽん · いっさつ.",
          "**どうやって** hỏi CÁCH làm → trả lời bằng chuỗi **Vて、Vて、Vます** (thì hiện tại). Xe: N **に** 乗ります · N **を** 降ります · nơi xuống **で**."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**V1て、V2て、V3ます／ました。** (ポイント 83)",
          "**[一日・一週間・一か月・一年] に [～回・～杯・～本・～冊] V。** Hỏi: **一週間に 何回 ～ますか** · **どのくらい ～ますか**. (ポイント 84)",
          "**どうやって V ますか。** → **N に 乗って、N で 降ります。** (ポイント 86)"
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng ポイント một"
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-83",
        "title": "ポイント 83: Vて、Vて、V (10 câu)",
        "items": [
          {
            "q": "{朝|あさ}{起|お}きて、ご{飯|はん}を＿＿、{学校|がっこう}へ{行|い}きます。　〔Asa okite, gohan o __, gakkou e ikimasu.〕　— Sáng tôi dậy, ăn cơm rồi đến trường.",
            "options": [
              "{食|た}べた",
              "{食|た}べて",
              "{食|た}べる",
              "{食|た}べます"
            ],
            "correct": 1,
            "why": "Việc ở giữa → thể て: **食べて**. → **{朝|あさ}{起|お}きて、ご{飯|はん}を{食|た}べて、{学校|がっこう}へ{行|い}きます。** 〔Asa okite, gohan o tabete, gakkou e ikimasu.〕 — Sáng tôi dậy, ăn cơm rồi đến trường."
          },
          {
            "q": "{昨日|きのう}、{映画|えいが}を{見|み}て、{買|か}い{物|もの}を＿＿。　〔Kinou, eiga o mite, kaimono o __.〕　— Hôm qua tôi xem phim rồi mua sắm.",
            "options": [
              "する",
              "しました",
              "します",
              "して"
            ],
            "correct": 1,
            "why": "Động từ CUỐI mang thì: hôm qua → **しました**. → **{昨日|きのう}、{映画|えいが}を{見|み}て、{買|か}い{物|もの}をしました。** 〔Kinou, eiga o mite, kaimono o shimashita.〕 — Hôm qua tôi xem phim rồi mua sắm."
          },
          {
            "q": "{週末|しゅうまつ}、プールへ＿＿、{泳|およ}ぎます。　〔Shuumatsu, puuru e __, oyogimasu.〕　— Cuối tuần tôi đến bể bơi rồi bơi.",
            "options": [
              "{行|い}って",
              "{行|い}く",
              "{行|い}いて",
              "{行|い}きて"
            ],
            "correct": 0,
            "why": "行きます → **行って** (ngoại lệ). → **{週末|しゅうまつ}、プールへ{行|い}って、{泳|およ}ぎます。** 〔Shuumatsu, puuru e itte, oyogimasu.〕 — Cuối tuần tôi đến bể bơi rồi bơi."
          },
          {
            "q": "{海|うみ}で＿＿、{魚|さかな}を{食|た}べました。　〔Umi de __, sakana o tabemashita.〕　— Tôi bơi ở biển rồi ăn cá.",
            "options": [
              "{泳|およ}ぎて",
              "{泳|およ}いで",
              "{泳|およ}んで",
              "{泳|およ}いて"
            ],
            "correct": 1,
            "why": "泳ぎます → **泳いで** (ぎ → いで). → **{海|うみ}で{泳|およ}いで、{魚|さかな}を{食|た}べました。** 〔Umi de oyoide, sakana o tabemashita.〕 — Tôi bơi ở biển rồi ăn cá."
          },
          {
            "q": "バスに＿＿、{駅|えき}へ{行|い}きます。　〔Basu ni __, eki e ikimasu.〕　— Tôi lên xe buýt đi đến ga.",
            "options": [
              "{乗|の}んで",
              "{乗|の}りて",
              "{乗|の}いて",
              "{乗|の}って"
            ],
            "correct": 3,
            "why": "乗ります → **乗って**. → **バスに{乗|の}って、{駅|えき}へ{行|い}きます。** 〔Basu ni notte, eki e ikimasu.〕 — Tôi lên xe buýt đi đến ga."
          },
          {
            "q": "{受付|うけつけ}で{名前|なまえ}を＿＿、カードを{作|つく}ります。　〔Uketsuke de namae o __, kaado o tsukurimasu.〕　— Viết tên ở quầy lễ tân rồi làm thẻ.",
            "options": [
              "{書|か}って",
              "{書|か}いて",
              "{書|か}く",
              "{書|か}きて"
            ],
            "correct": 1,
            "why": "書きます → **書いて**. → **{受付|うけつけ}で{名前|なまえ}を{書|か}いて、カードを{作|つく}ります。** 〔Uketsuke de namae o kaite, kaado o tsukurimasu.〕 — Viết tên ở quầy lễ tân rồi làm thẻ."
          },
          {
            "q": "{友達|ともだち}に{会|あ}って、{一緒|いっしょ}に＿＿、{帰|かえ}りました。　〔Tomodachi ni atte, issho ni __, kaerimashita.〕　— Tôi gặp bạn, cùng đi chơi rồi về.",
            "options": [
              "{遊|あそ}びて",
              "{遊|あそ}って",
              "{遊|あそ}いで",
              "{遊|あそ}んで"
            ],
            "correct": 3,
            "why": "遊びます → **遊んで** (び → んで). → **{友達|ともだち}に{会|あ}って、{一緒|いっしょ}に{遊|あそ}んで、{帰|かえ}りました。** 〔Tomodachi ni atte, issho ni asonde, kaerimashita.〕 — Tôi gặp bạn, cùng đi chơi rồi về."
          },
          {
            "q": "{土曜日|どようび}は{料理|りょうり}を{作|つく}って、{友達|ともだち}と＿＿。　〔Doyoubi wa ryouri o tsukutte, tomodachi to __.〕　— Thứ Bảy tôi nấu ăn rồi ăn cùng bạn.",
            "options": [
              "{食|た}べて",
              "{食|た}べました",
              "{食|た}べる",
              "{食|た}べ"
            ],
            "correct": 1,
            "why": "Động từ cuối mang thì → **食べました**. → **{土曜日|どようび}は{料理|りょうり}を{作|つく}って、{友達|ともだち}と{食|た}べました。** 〔Doyoubi wa ryouri o tsukutte, tomodachi to tabemashita.〕 — Thứ Bảy tôi nấu ăn rồi ăn cùng bạn."
          },
          {
            "q": "Câu nào nghĩa là \"Tôi XEM PHIM trước rồi mới ĂN\"?",
            "options": [
              "{映画|えいが}を{見|み}ます、ご{飯|はん}を{食|た}べました。 (Eiga o mimasu, gohan o tabemashita.)",
              "ご{飯|はん}を{食|た}べました、{映画|えいが}を{見|み}て。 (Gohan o tabemashita, eiga o mite.)",
              "ご{飯|はん}を{食|た}べて、{映画|えいが}を{見|み}ました。 (Gohan o tabete, eiga o mimashita.)",
              "{映画|えいが}を{見|み}て、ご{飯|はん}を{食|た}べました。 (Eiga o mite, gohan o tabemashita.)"
            ],
            "correct": 3,
            "why": "Việc nào nói trước thì xảy ra trước."
          },
          {
            "q": "{日本語|にほんご}を＿＿、{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいです。　〔Nihongo o __, Nihon no kaisha de hatarakitai desu.〕　— Tôi muốn học tiếng Nhật rồi làm việc ở công ty Nhật.",
            "options": [
              "{勉強|べんきょう}します",
              "{勉強|べんきょう}して",
              "{勉強|べんきょう}しって",
              "{勉強|べんきょう}すて"
            ],
            "correct": 1,
            "why": "します → **して**. → **{日本語|にほんご}を{勉強|べんきょう}して、{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいです。** 〔Nihongo o benkyou shite, Nihon no kaisha de hatarakitai desu.〕 — Tôi muốn học tiếng Nhật rồi làm việc ở công ty Nhật."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-84",
        "title": "ポイント 84: [thời gian] に [số lượng] V (10 câu)",
        "items": [
          {
            "q": "{一週間|いっしゅうかん}＿＿{二回|にかい}テニスをします。　〔Isshuukan __ nikai tenisu o shimasu.〕　— Một tuần tôi chơi tennis hai lần.",
            "options": [
              "を",
              "に",
              "で",
              "が"
            ],
            "correct": 1,
            "why": "Khoảng thời gian + **に** + số lần. → **{一週間|いっしゅうかん}に{二回|にかい}テニスをします。** 〔Isshuukan ni nikai tenisu o shimasu.〕 — Một tuần tôi chơi tennis hai lần."
          },
          {
            "q": "{一日|いちにち}にコーヒーを＿＿{飲|の}みます。　〔Ichinichi ni koohii o __ nomimasu.〕　— Một ngày tôi uống ba cốc cà phê.",
            "options": [
              "{三杯|さんぱい}",
              "{三杯|さんばい}",
              "{三本|さんぼん}",
              "{三杯|さんはい}"
            ],
            "correct": 1,
            "why": "3 cốc đọc **さんばい**. → **{一日|いちにち}にコーヒーを{三杯|さんばい}{飲|の}みます。** 〔Ichinichi ni koohii o sanbai nomimasu.〕 — Một ngày tôi uống ba cốc cà phê."
          },
          {
            "q": "{一|いっ}か{月|げつ}に{本|ほん}を＿＿{読|よ}みます。　〔Ikkagetsu ni hon o __ yomimasu.〕　— Một tháng tôi đọc hai quyển sách.",
            "options": [
              "{二匹|にひき}",
              "{二杯|にはい}",
              "{二冊|にさつ}",
              "{二本|にほん}"
            ],
            "correct": 2,
            "why": "Sách → **冊**. → **{一|いっ}か{月|げつ}に{本|ほん}を{二冊|にさつ}{読|よ}みます。** 〔Ikkagetsu ni hon o nisatsu yomimasu.〕 — Một tháng tôi đọc hai quyển sách."
          },
          {
            "q": "{一年|いちねん}に＿＿、{国|くに}へ{帰|かえ}ります。　〔Ichinen ni __, kuni e kaerimasu.〕　— Một năm tôi về nước một lần.",
            "options": [
              "{一回|いちかい}",
              "{一回|いっかい}",
              "{一冊|いっさつ}",
              "{一杯|いっぱい}"
            ],
            "correct": 1,
            "why": "1 lần đọc **いっかい**. → **{一年|いちねん}に{一回|いっかい}、{国|くに}へ{帰|かえ}ります。** 〔Ichinen ni ikkai, kuni e kaerimasu.〕 — Một năm tôi về nước một lần."
          },
          {
            "q": "{一週間|いっしゅうかん}に＿＿{泳|およ}ぎますか。——{三回|さんかい}{泳|およ}ぎます。　〔Isshuukan ni __ oyogimasu ka. — Sankai oyogimasu.〕　— Một tuần bạn bơi mấy lần? — Ba lần.",
            "options": [
              "{何杯|なんばい}",
              "{何本|なんぼん}",
              "{何回|なんかい}",
              "{何冊|なんさつ}"
            ],
            "correct": 2,
            "why": "Hỏi số lần → **何回**. → **{一週間|いっしゅうかん}に{何回|なんかい}{泳|およ}ぎますか。——{三回|さんかい}{泳|およ}ぎます。** 〔Isshuukan ni nankai oyogimasu ka. — Sankai oyogimasu.〕 — Một tuần bạn bơi mấy lần? — Ba lần."
          },
          {
            "q": "{一日|いちにち}に{水|みず}を＿＿{飲|の}みます。　〔Ichinichi ni mizu o __ nomimasu.〕　— Một ngày tôi uống hai chai nước.",
            "options": [
              "{二本|にほん}",
              "{二冊|にさつ}",
              "{二人|ふたり}",
              "{二匹|にひき}"
            ],
            "correct": 0,
            "why": "Chai nước → **本**. → **{一日|いちにち}に{水|みず}を{二本|にほん}{飲|の}みます。** 〔Ichinichi ni mizu o nihon nomimasu.〕 — Một ngày tôi uống hai chai nước."
          },
          {
            "q": "ペンを＿＿{買|か}いました。　〔Pen o __ kaimashita.〕　— Tôi đã mua sáu cây bút.",
            "options": [
              "{六本|ろくほん}",
              "{六本|ろくぼん}",
              "{六冊|ろくさつ}",
              "{六本|ろっぽん}"
            ],
            "correct": 3,
            "why": "6 cây đọc **ろっぽん**. → **ペンを{六本|ろっぽん}{買|か}いました。** 〔Pen o roppon kaimashita.〕 — Tôi đã mua sáu cây bút."
          },
          {
            "q": "{一日|いちにち}に{二時間|にじかん}＿＿{勉強|べんきょう}します。　〔Ichinichi ni nijikan __ benkyou shimasu.〕　— Một ngày tôi học khoảng hai tiếng.",
            "options": [
              "くらい",
              "で",
              "ごろ",
              "に"
            ],
            "correct": 0,
            "why": "Số lượng (khoảng) → **くらい**; ごろ dùng cho thời điểm. → **{一日|いちにち}に{二時間|にじかん}くらい{勉強|べんきょう}します。** 〔Ichinichi ni nijikan kurai benkyou shimasu.〕 — Một ngày tôi học khoảng hai tiếng."
          },
          {
            "q": "どのくらい{日本語|にほんご}を{勉強|べんきょう}しますか。——＿＿。　〔Donokurai Nihongo o benkyou shimasu ka. — __.〕　— Bạn học tiếng Nhật thường xuyên thế nào? — Một tuần năm lần.",
            "options": [
              "{五回|ごかい}に{一週間|いっしゅうかん}{勉強|べんきょう}します",
              "{一週間|いっしゅうかん}を{五回|ごかい}{勉強|べんきょう}します",
              "{一週間|いっしゅうかん}{五回|ごかい}に{勉強|べんきょう}します",
              "{一週間|いっしゅうかん}に{五回|ごかい}{勉強|べんきょう}します"
            ],
            "correct": 3,
            "why": "Thứ tự: [thời gian] **に** [số lần] V. → **どのくらい{日本語|にほんご}を{勉強|べんきょう}しますか。——{一週間|いっしゅうかん}に{五回|ごかい}{勉強|べんきょう}します。** 〔Donokurai Nihongo o benkyou shimasu ka. — Isshuukan ni gokai benkyou shimasu.〕 — Bạn học tiếng Nhật thường xuyên thế nào? — Một tuần năm lần."
          },
          {
            "q": "＿＿に{三回|さんかい}{山|やま}に{登|のぼ}ります。　〔__ ni sankai yama ni noborimasu.〕　— Một tháng tôi leo núi ba lần.",
            "options": [
              "{一日|ついたち}",
              "{一月|いちがつ}",
              "{一年|いちねん}",
              "{一|いっ}か{月|げつ}"
            ],
            "correct": 3,
            "why": "\"Một tháng\" (khoảng) = **一か月 いっかげつ**; 一月 = tháng Một. → **{一|いっ}か{月|げつ}に{三回|さんかい}{山|やま}に{登|のぼ}ります。** 〔Ikkagetsu ni sankai yama ni noborimasu.〕 — Một tháng tôi leo núi ba lần."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-86",
        "title": "ポイント 86: どうやって (8 câu)",
        "items": [
          {
            "q": "＿＿{美術館|びじゅつかん}へ{行|い}きますか。——バスに{乗|の}って、{美術館|びじゅつかん}{前|まえ}で{降|お}ります。　〔__ bijutsukan e ikimasu ka. — Basu ni notte, bijutsukan mae de orimasu.〕　— Đi bảo tàng bằng cách nào? — Lên xe buýt, xuống ở trạm trước bảo tàng.",
            "options": [
              "どうやって",
              "どこ",
              "どれ",
              "どうして"
            ],
            "correct": 0,
            "why": "Hỏi CÁCH đi → **どうやって** (どうして = tại sao). → **どうやって{美術館|びじゅつかん}へ{行|い}きますか。——バスに{乗|の}って、{美術館|びじゅつかん}{前|まえ}で{降|お}ります。** 〔Douyatte bijutsukan e ikimasu ka. — Basu ni notte, bijutsukan mae de orimasu.〕 — Đi bảo tàng bằng cách nào? — Lên xe buýt, xuống ở trạm trước bảo tàng."
          },
          {
            "q": "どうやって{図書館|としょかん}のカードを{作|つく}りますか。——{受付|うけつけ}で{住所|じゅうしょ}を＿＿、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。　〔Douyatte toshokan no kaado o tsukurimasu ka. — Uketsuke de juusho o __, gaikokujintourokushou o misemasu.〕　— Làm thẻ thư viện thế nào? — Viết địa chỉ ở quầy rồi xuất trình thẻ ngoại kiều.",
            "options": [
              "{書|か}きて",
              "{書|か}きます",
              "{書|か}いて",
              "{書|か}く"
            ],
            "correct": 2,
            "why": "Các bước → thể て: **書いて**. → **どうやって{図書館|としょかん}のカードを{作|つく}りますか。——{受付|うけつけ}で{住所|じゅうしょ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。** 〔Douyatte toshokan no kaado o tsukurimasu ka. — Uketsuke de juusho o kaite, gaikokujintourokushou o misemasu.〕 — Làm thẻ thư viện thế nào? — Viết địa chỉ ở quầy rồi xuất trình thẻ ngoại kiều."
          },
          {
            "q": "{三番|さんばん}のバス＿＿{乗|の}ってください。　〔Sanban no basu __ notte kudasai.〕　— Hãy lên xe buýt số 3.",
            "options": [
              "を",
              "で",
              "に",
              "へ"
            ],
            "correct": 2,
            "why": "N **に** 乗ります. → **{三番|さんばん}のバスに{乗|の}ってください。** 〔Sanban no basu ni notte kudasai.〕 — Hãy lên xe buýt số 3."
          },
          {
            "q": "{駅|えき}＿＿{電車|でんしゃ}を{降|お}ります。　〔Eki __ densha o orimasu.〕　— Tôi xuống tàu ở ga.",
            "options": [
              "に",
              "を",
              "で",
              "へ"
            ],
            "correct": 2,
            "why": "Nơi xuống → **で**. → **{駅|えき}で{電車|でんしゃ}を{降|お}ります。** 〔Eki de densha o orimasu.〕 — Tôi xuống tàu ở ga."
          },
          {
            "q": "どうやってチケットを{買|か}いますか。——インターネットで＿＿、コンビニでお{金|かね}を{払|はら}います。　〔Douyatte chiketto o kaimasu ka. — Intaanetto de __, konbini de okane o haraimasu.〕　— Mua vé thế nào? — Đặt trên mạng rồi trả tiền ở cửa hàng tiện lợi.",
            "options": [
              "{予約|よやく}すて",
              "{予約|よやく}しって",
              "{予約|よやく}して",
              "{予約|よやく}します"
            ],
            "correct": 2,
            "why": "します → **して**. → **どうやってチケットを{買|か}いますか。——インターネットで{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。** 〔Douyatte chiketto o kaimasu ka. — Intaanetto de yoyaku shite, konbini de okane o haraimasu.〕 — Mua vé thế nào? — Đặt trên mạng rồi trả tiền ở cửa hàng tiện lợi."
          },
          {
            "q": "A：どうやって{大学|だいがく}へ{来|き}ますか。B：＿＿。　〔A: douyatte daigaku e kimasu ka. B: __.〕　— A: Bạn đến trường bằng gì? B: Tôi đến bằng xe đạp.",
            "options": [
              "{自転車|じてんしゃ}で{来|く}るです",
              "{自転車|じてんしゃ}に{来|き}ます",
              "{自転車|じてんしゃ}で{来|き}ます",
              "{自転車|じてんしゃ}を{乗|の}ります"
            ],
            "correct": 2,
            "why": "Phương tiện + **で** + 来ます. → **A：どうやって{大学|だいがく}へ{来|き}ますか。B：{自転車|じてんしゃ}で{来|き}ます。** 〔A: douyatte daigaku e kimasu ka. B: jitensha de kimasu.〕 — A: Bạn đến trường bằng gì? B: Tôi đến bằng xe đạp."
          },
          {
            "q": "どうやって＿＿か。——{受付|うけつけ}で{名前|なまえ}を{言|い}って、お{金|かね}を{払|はら}います。　〔Douyatte __ ka. — Uketsuke de namae o itte, okane o haraimasu.〕　— Đăng ký thế nào? — Nói tên ở quầy rồi trả tiền.",
            "options": [
              "{泳|およ}ぎます",
              "{申|もう}し{込|こ}みます",
              "{集|あつ}めます",
              "{降|お}ります"
            ],
            "correct": 1,
            "why": "Các bước ở quầy → hỏi cách **đăng ký**. → **どうやって{申|もう}し{込|こ}みますか。——{受付|うけつけ}で{名前|なまえ}を{言|い}って、お{金|かね}を{払|はら}います。** 〔Douyatte moushikomimasu ka. — Uketsuke de namae o itte, okane o haraimasu.〕 — Đăng ký thế nào? — Nói tên ở quầy rồi trả tiền."
          },
          {
            "q": "どうやってカレーを{作|つく}りますか。——{肉|にく}と{野菜|やさい}を{切|き}って、{水|みず}を{入|い}れて、＿＿。　〔Douyatte karee o tsukurimasu ka. — Niku to yasai o kitte, mizu o irete, __.〕　— Nấu cà ri thế nào? — Cắt thịt và rau, cho nước vào rồi nấu.",
            "options": [
              "{作|つく}る",
              "{作|つく}ります",
              "{作|つく}って",
              "{作|つく}りました"
            ],
            "correct": 1,
            "why": "Cách làm nói chung → thì **hiện tại** ～ます ở cuối. → **どうやってカレーを{作|つく}りますか。——{肉|にく}と{野菜|やさい}を{切|き}って、{水|みず}を{入|い}れて、{作|つく}ります。** 〔Douyatte karee o tsukurimasu ka. — Niku to yasai o kitte, mizu o irete, tsukurimasu.〕 — Nấu cà ri thế nào? — Cắt thịt và rau, cho nước vào rồi nấu."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn từ đếm · đọc số · hiểu chuỗi て · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-tu-dem",
        "title": "Đếm cái này bằng từ đếm nào? (10 câu)",
        "items": [
          {
            "q": "Đếm \"cà phê (cốc)\" bằng từ đếm nào?",
            "options": [
              "～冊 (~satsu)",
              "～杯 (~hai)",
              "～本 (~hon)",
              "～回 (~kai)"
            ],
            "correct": 1,
            "why": "Đồ uống trong cốc, bát → **杯**."
          },
          {
            "q": "Đếm \"chai nước\" bằng từ đếm nào?",
            "options": [
              "～杯 (~hai)",
              "～人 (~nin)",
              "～冊 (~satsu)",
              "～本 (~hon)"
            ],
            "correct": 3,
            "why": "Chai (vật dài) → **本**."
          },
          {
            "q": "Đếm \"tạp chí, quyển vở\" bằng từ đếm nào?",
            "options": [
              "～杯 (~hai)",
              "～本 (~hon)",
              "～枚 (~mai)",
              "～冊 (~satsu)"
            ],
            "correct": 3,
            "why": "Sách, vở, tạp chí → **冊**."
          },
          {
            "q": "Đếm \"cây bút\" bằng từ đếm nào?",
            "options": [
              "～回 (~kai)",
              "～冊 (~satsu)",
              "～本 (~hon)",
              "～枚 (~mai)"
            ],
            "correct": 2,
            "why": "Vật dài, mảnh → **本**."
          },
          {
            "q": "Đếm \"số lần đi bơi\" bằng từ đếm nào?",
            "options": [
              "～杯 (~hai)",
              "～本 (~hon)",
              "～回 (~kai)",
              "～冊 (~satsu)"
            ],
            "correct": 2,
            "why": "Số lần → **回**."
          },
          {
            "q": "Đếm \"bát cơm\" bằng từ đếm nào?",
            "options": [
              "～匹 (~hiki)",
              "～杯 (~hai)",
              "～冊 (~satsu)",
              "～本 (~hon)"
            ],
            "correct": 1,
            "why": "Bát → **杯**."
          },
          {
            "q": "Đếm \"cái ô (dù)\" bằng từ đếm nào?",
            "options": [
              "～本 (~hon)",
              "～枚 (~mai)",
              "～杯 (~hai)",
              "～冊 (~satsu)"
            ],
            "correct": 0,
            "why": "Ô dài → **本**."
          },
          {
            "q": "Đếm \"quyển tiểu thuyết\" bằng từ đếm nào?",
            "options": [
              "～回 (~kai)",
              "～本 (~hon)",
              "～冊 (~satsu)",
              "～枚 (~mai)"
            ],
            "correct": 2,
            "why": "Sách → **冊**."
          },
          {
            "q": "Đếm \"con mèo\" bằng từ đếm nào?",
            "options": [
              "～匹 (~hiki)",
              "～人 (~nin)",
              "～本 (~hon)",
              "～冊 (~satsu)"
            ],
            "correct": 0,
            "why": "Con vật nhỏ → **匹** (Bài 8)."
          },
          {
            "q": "Đếm \"vé xem phim\" bằng từ đếm nào?",
            "options": [
              "～本 (~hon)",
              "～枚 (~mai)",
              "～冊 (~satsu)",
              "～杯 (~hai)"
            ],
            "correct": 1,
            "why": "Vật mỏng (vé, đĩa, áo) → **枚** (Bài 6)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-doc-so",
        "title": "Đọc đúng số lần / số cốc / số chai (14 câu)",
        "items": [
          {
            "q": "Đọc đúng: 【1回】",
            "options": [
              "いちかい (ichikai)",
              "いっかい (ikkai)",
              "いっか (ikka)",
              "ひとかい (hitokai)"
            ],
            "correct": 1,
            "why": "1回 = **いっかい** (ikkai)."
          },
          {
            "q": "Đọc đúng: 【6回】",
            "options": [
              "ろっか (rokka)",
              "むかい (mukai)",
              "ろっかい (rokkai)",
              "ろくかい (rokukai)"
            ],
            "correct": 2,
            "why": "6回 = **ろっかい** (rokkai)."
          },
          {
            "q": "Đọc đúng: 【10回】",
            "options": [
              "じゅうかい (juukai)",
              "じゅっかい (jukkai)",
              "じゅっか (jukka)",
              "とおかい (tookai)"
            ],
            "correct": 1,
            "why": "10回 = **じゅっかい** (jukkai)."
          },
          {
            "q": "Đọc đúng: 【1冊】",
            "options": [
              "いちさつ (ichisatsu)",
              "いっさつ (issatsu)",
              "いっさ (issa)",
              "ひとさつ (hitosatsu)"
            ],
            "correct": 1,
            "why": "1冊 = **いっさつ** (issatsu)."
          },
          {
            "q": "Đọc đúng: 【1杯】",
            "options": [
              "いちはい (ichihai)",
              "いっぱい (ippai)",
              "ひとはい (hitohai)",
              "いっはい (ihhai)"
            ],
            "correct": 1,
            "why": "1杯 = **いっぱい** (ippai)."
          },
          {
            "q": "Đọc đúng: 【3杯】",
            "options": [
              "さんぱい (sanpai)",
              "さんはい (sanhai)",
              "さんばい (sanbai)",
              "みはい (mihai)"
            ],
            "correct": 2,
            "why": "3杯 = **さんばい** (sanbai)."
          },
          {
            "q": "Đọc đúng: 【6杯】",
            "options": [
              "ろっはい (rohhai)",
              "ろくはい (rokuhai)",
              "ろくばい (rokubai)",
              "ろっぱい (roppai)"
            ],
            "correct": 3,
            "why": "6杯 = **ろっぱい** (roppai)."
          },
          {
            "q": "Đọc đúng: 【1本】",
            "options": [
              "いっほん (ihhon)",
              "いちほん (ichihon)",
              "いっぽん (ippon)",
              "ひとほん (hitohon)"
            ],
            "correct": 2,
            "why": "1本 = **いっぽん** (ippon)."
          },
          {
            "q": "Đọc đúng: 【3本】",
            "options": [
              "さんほん (sanhon)",
              "さんぼん (sanbon)",
              "さんぽん (sanpon)",
              "みほん (mihon)"
            ],
            "correct": 1,
            "why": "3本 = **さんぼん** (sanbon)."
          },
          {
            "q": "Đọc đúng: 【6本】",
            "options": [
              "ろくほん (rokuhon)",
              "ろくぼん (rokubon)",
              "ろっほん (rohhon)",
              "ろっぽん (roppon)"
            ],
            "correct": 3,
            "why": "6本 = **ろっぽん** (roppon)."
          },
          {
            "q": "Đọc đúng: 【1週間】",
            "options": [
              "ひとしゅうかん (hitoshuukan)",
              "いちしゅうかん (ichishuukan)",
              "いっしゅうかん (isshuukan)",
              "いっしゅかん (isshukan)"
            ],
            "correct": 2,
            "why": "1週間 = **いっしゅうかん** (isshuukan)."
          },
          {
            "q": "Đọc đúng: 【1か月】",
            "options": [
              "いっかげつ (ikkagetsu)",
              "ひとかげつ (hitokagetsu)",
              "いっかがつ (ikkagatsu)",
              "いちかげつ (ichikagetsu)"
            ],
            "correct": 0,
            "why": "1か月 = **いっかげつ** (ikkagetsu)."
          },
          {
            "q": "Đọc đúng: 【何回】",
            "options": [
              "いくかい (ikukai)",
              "なにかい (nanikai)",
              "なんかい (nankai)",
              "なんがい (nangai)"
            ],
            "correct": 2,
            "why": "何回 = **なんかい** (nankai)."
          },
          {
            "q": "Đọc đúng: 【何杯】",
            "options": [
              "なにはい (nanihai)",
              "なんぱい (nanpai)",
              "なんはい (nanhai)",
              "なんばい (nanbai)"
            ],
            "correct": 3,
            "why": "何杯 = **なんばい** (nanbai)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-thu-tu",
        "title": "Hiểu chuỗi Vて — chọn nghĩa đúng (6 câu)",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {毎朝|まいあさ}{起|お}きて、{泳|およ}いで、{会社|かいしゃ}へ{行|い}きます。　〔Maiasa okite, oyoide, kaisha e ikimasu.〕",
            "options": [
              "Sáng nào tôi cũng dậy, đi bơi rồi đến công ty.",
              "Sáng nào tôi cũng dậy, đến công ty rồi đi bơi.",
              "Sáng nào tôi cũng đi bơi rồi mới dậy.",
              "Sáng tôi dậy nhưng không đi bơi."
            ],
            "correct": 0,
            "why": "Thứ tự: 起きて → 泳いで → 行きます."
          },
          {
            "q": "Câu này nghĩa là gì? インターネットで{予約|よやく}して、{受付|うけつけ}でお{金|かね}を{払|はら}います。　〔Intaanetto de yoyaku shite, uketsuke de okane o haraimasu.〕",
            "options": [
              "Đặt trước trên mạng rồi trả tiền ở quầy lễ tân.",
              "Trả tiền ở quầy rồi đặt trên mạng.",
              "Đặt trước ở quầy rồi trả tiền trên mạng.",
              "Không cần đặt trước, chỉ trả tiền."
            ],
            "correct": 0,
            "why": "予約して → 払います."
          },
          {
            "q": "Câu này nghĩa là gì? {昨日|きのう}、{友達|ともだち}と{映画|えいが}を{見|み}て、{食事|しょくじ}して、{帰|かえ}りました。　〔Kinou, tomodachi to eiga o mite, shokuji shite, kaerimashita.〕",
            "options": [
              "Hôm qua tôi đi ăn với bạn rồi xem phim.",
              "Hôm qua tôi xem phim với bạn, đi ăn rồi về.",
              "Hôm qua tôi về nhà rồi xem phim.",
              "Hôm nay tôi sẽ xem phim với bạn rồi đi ăn."
            ],
            "correct": 1,
            "why": "Động từ cuối ました → quá khứ cả chuỗi."
          },
          {
            "q": "Câu này nghĩa là gì? {電車|でんしゃ}に{乗|の}って、{新宿|しんじゅく}で{降|お}りて、バスに{乗|の}ります。　〔Densha ni notte, Shinjuku de orite, basu ni norimasu.〕",
            "options": [
              "Lên xe buýt, xuống ở Shinjuku rồi lên tàu.",
              "Xuống tàu ở Shinjuku rồi về nhà.",
              "Lên tàu đến Shinjuku rồi đi bộ.",
              "Lên tàu, xuống ở Shinjuku rồi lên xe buýt."
            ],
            "correct": 3,
            "why": "乗って → 降りて → 乗ります."
          },
          {
            "q": "Câu này nghĩa là gì? {一週間|いっしゅうかん}に{一回|いっかい}、{書道|しょどう}{教室|きょうしつ}へ{行|い}って、{漢字|かんじ}を{習|なら}います。　〔Isshuukan ni ikkai, shodou kyoushitsu e itte, kanji o naraimasu.〕",
            "options": [
              "Một ngày một lần tôi đến lớp thư pháp.",
              "Mỗi tuần một lần tôi đến lớp thư pháp học chữ Hán.",
              "Tôi học chữ Hán một tuần rồi đến lớp thư pháp.",
              "Mỗi tuần tôi dạy chữ Hán một lần."
            ],
            "correct": 1,
            "why": "一週間に 一回 = mỗi tuần một lần."
          },
          {
            "q": "Câu này nghĩa là gì? {名前|なまえ}と{住所|じゅうしょ}を{書|か}いて、カードを{見|み}せてください。　〔Namae to juusho o kaite, kaado o misete kudasai.〕",
            "options": [
              "Hãy viết tên và địa chỉ rồi cho xem thẻ.",
              "Hãy cho xem thẻ rồi viết tên và địa chỉ.",
              "Hãy viết tên lên thẻ.",
              "Hãy nói tên và địa chỉ rồi làm thẻ."
            ],
            "correct": 0,
            "why": "書いて → 見せて ください."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "バスを{乗|の}って、{駅|えき}で{降|お}ります。 (Basu o notte, eki de orimasu.)",
              "バスに{乗|の}って、{駅|えき}でバスを{降|お}ります。 (Basu ni notte, eki de basu o orimasu.)",
              "バスに{乗|の}って、{駅|えき}で{降|お}ります。 (Basu ni notte, eki de orimasu.)",
              "{電車|でんしゃ}に{乗|の}って、{新宿|しんじゅく}で{降|お}ります。 (Densha ni notte, Shinjuku de orimasu.)"
            ],
            "correct": 0,
            "why": "N **に** 乗ります."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{駅|えき}で{降|お}ります。 (Eki de orimasu.)",
              "{電車|でんしゃ}に{降|お}ります。 (Densha ni orimasu.)",
              "{電車|でんしゃ}に{乗|の}ります。 (Densha ni norimasu.)",
              "{電車|でんしゃ}を{降|お}ります。 (Densha o orimasu.)"
            ],
            "correct": 1,
            "why": "Xuống xe/tàu: N **を** 降ります."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{一|いっ}か{月|げつ}に{四回|よんかい}{泳|およ}ぎます。 (Ikkagetsu ni yonkai oyogimasu.)",
              "{一日|いちにち}に{一回|いっかい}{泳|およ}ぎます。 (Ichinichi ni ikkai oyogimasu.)",
              "{一週間|いっしゅうかん}に{二回|にかい}{泳|およ}ぎます。 (Isshuukan ni nikai oyogimasu.)",
              "{一週間|いっしゅうかん}{二回|にかい}{泳|およ}ぎます。 (Isshuukan nikai oyogimasu.)"
            ],
            "correct": 3,
            "why": "Thiếu **に** sau khoảng thời gian."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{海|うみ}へ{行|い}って、{泳|およ}ぎました。 (Umi e itte, oyogimashita.)",
              "{海|うみ}へ{行|い}いて、{泳|およ}ぎました。 (Umi e iite, oyogimashita.)",
              "{海|うみ}で{泳|およ}いで、{帰|かえ}りました。 (Umi de oyoide, kaerimashita.)",
              "{海|うみ}へ{行|い}きました。 (Umi e ikimashita.)"
            ],
            "correct": 1,
            "why": "行きます → **行って** (ngoại lệ)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{本|ほん}を{読|よ}んで、{寝|ね}ました。 (Hon o yonde, nemashita.)",
              "{友達|ともだち}と{遊|あそ}んで、{帰|かえ}りました。 (Tomodachi to asonde, kaerimashita.)",
              "プールで{泳|およ}いで、{帰|かえ}りました。 (Puuru de oyoide, kaerimashita.)",
              "プールで{泳|およ}いて、{帰|かえ}りました。 (Puuru de oyoite, kaerimashita.)"
            ],
            "correct": 3,
            "why": "泳ぎます → **泳いで** (ぎ → いで)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "コーヒーを{三本|さんぼん}{飲|の}みます。 (Koohii o sanbon nomimasu.)",
              "コーヒーを{三杯|さんばい}{飲|の}みます。 (Koohii o sanbai nomimasu.)",
              "{本|ほん}を{三冊|さんさつ}{読|よ}みます。 (Hon o sansatsu yomimasu.)",
              "ペンを{三本|さんぼん}{買|か}います。 (Pen o sanbon kaimasu.)"
            ],
            "correct": 0,
            "why": "Cà phê (cốc) → **杯**."
          },
          {
            "q": "Câu nào SAI về nghĩa?",
            "options": [
              "どうして{駅|えき}へ{行|い}きますか。——{友達|ともだち}に{会|あ}いますから。 (Doushite eki e ikimasu ka. — Tomodachi ni aimasu kara.)",
              "どうやって{行|い}きますか。——{歩|ある}いて{行|い}きます。 (Douyatte ikimasu ka. — Aruite ikimasu.)",
              "どうやって{駅|えき}へ{行|い}きますか。——バスに{乗|の}って{行|い}きます。 (Douyatte eki e ikimasu ka. — Basu ni notte ikimasu.)",
              "どうして{駅|えき}へ{行|い}きますか。——バスに{乗|の}って{行|い}きます。 (Doushite eki e ikimasu ka. — Basu ni notte ikimasu.)"
            ],
            "correct": 3,
            "why": "どうして hỏi LÝ DO (trả lời ～から); hỏi CÁCH đi phải dùng **どうやって**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{今晩|こんばん}、{本|ほん}を{読|よ}んで、{寝|ね}ます。 (Konban, hon o yonde, nemasu.)",
              "{毎晩|まいばん}、{本|ほん}を{読|よ}んで、{寝|ね}ます。 (Maiban, hon o yonde, nemasu.)",
              "{昨日|きのう}、{本|ほん}を{読|よ}んで、{寝|ね}ました。 (Kinou, hon o yonde, nemashita.)",
              "{昨日|きのう}、{本|ほん}を{読|よ}んで、{寝|ね}ます。 (Kinou, hon o yonde, nemasu.)"
            ],
            "correct": 3,
            "why": "Chuyện hôm qua → động từ CUỐI phải là **ました**."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-np2-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 83, 84, 86",
        "items": [
          {
            "q": "Một tuần tôi gọi điện cho gia đình hai lần.",
            "answers": [
              "一週間に二回家族に電話します。",
              "一週間に二回家族にでんわします。",
              "一週間に二回かぞくに電話します。",
              "一週間に二回かぞくにでんわします。",
              "一週間ににかい家族に電話します。",
              "一週間ににかい家族にでんわします。",
              "一週間ににかいかぞくに電話します。",
              "一週間ににかいかぞくにでんわします。",
              "いっしゅうかんに二回家族に電話します。",
              "いっしゅうかんに二回家族にでんわします。",
              "いっしゅうかんに二回かぞくに電話します。",
              "いっしゅうかんに二回かぞくにでんわします。",
              "いっしゅうかんににかい家族に電話します。",
              "いっしゅうかんににかい家族にでんわします。",
              "いっしゅうかんににかいかぞくに電話します。",
              "いっしゅうかんににかいかぞくにでんわします。",
              "家族に一週間に二回電話します。",
              "家族に一週間に二回でんわします。",
              "家族に一週間ににかい電話します。",
              "家族に一週間ににかいでんわします。",
              "家族にいっしゅうかんに二回電話します。",
              "家族にいっしゅうかんに二回でんわします。",
              "家族にいっしゅうかんににかい電話します。",
              "家族にいっしゅうかんににかいでんわします。",
              "かぞくに一週間に二回電話します。",
              "かぞくに一週間に二回でんわします。",
              "かぞくに一週間ににかい電話します。",
              "かぞくに一週間ににかいでんわします。",
              "かぞくにいっしゅうかんに二回電話します。",
              "かぞくにいっしゅうかんに二回でんわします。",
              "かぞくにいっしゅうかんににかい電話します。",
              "かぞくにいっしゅうかんににかいでんわします。",
              "1週間に2回家族に電話します。",
              "1週間に2回家族にでんわします。",
              "1週間に2回かぞくに電話します。",
              "1週間に2回かぞくにでんわします。",
              "1週間ににかい家族に電話します。",
              "1週間ににかい家族にでんわします。",
              "1週間ににかいかぞくに電話します。",
              "1週間ににかいかぞくにでんわします。",
              "いっしゅうかんに2回家族に電話します。",
              "いっしゅうかんに2回家族にでんわします。",
              "いっしゅうかんに2回かぞくに電話します。",
              "いっしゅうかんに2回かぞくにでんわします。"
            ],
            "hint": "～に ～回"
          },
          {
            "q": "Một ngày tôi uống ba cốc trà.",
            "answers": [
              "一日にお茶を三杯飲みます。",
              "一日にお茶を三杯のみます。",
              "一日にお茶をさんばい飲みます。",
              "一日にお茶をさんばいのみます。",
              "一日におちゃを三杯飲みます。",
              "一日におちゃを三杯のみます。",
              "一日におちゃをさんばい飲みます。",
              "一日におちゃをさんばいのみます。",
              "いちにちにお茶を三杯飲みます。",
              "いちにちにお茶を三杯のみます。",
              "いちにちにお茶をさんばい飲みます。",
              "いちにちにお茶をさんばいのみます。",
              "いちにちにおちゃを三杯飲みます。",
              "いちにちにおちゃを三杯のみます。",
              "いちにちにおちゃをさんばい飲みます。",
              "いちにちにおちゃをさんばいのみます。",
              "1日にお茶を3杯飲みます。",
              "1日にお茶を3杯のみます。",
              "1日にお茶をさんばい飲みます。",
              "1日にお茶をさんばいのみます。",
              "1日におちゃを3杯飲みます。",
              "1日におちゃを3杯のみます。",
              "1日におちゃをさんばい飲みます。",
              "1日におちゃをさんばいのみます。",
              "いちにちにお茶を3杯飲みます。",
              "いちにちにお茶を3杯のみます。",
              "いちにちにおちゃを3杯飲みます。",
              "いちにちにおちゃを3杯のみます。"
            ],
            "hint": "～に ～杯"
          },
          {
            "q": "Tôi lên xe buýt rồi xuống ở ga.",
            "answers": [
              "バスに乗って、駅で降ります。",
              "バスに乗って、駅でおります。",
              "バスに乗って、えきで降ります。",
              "バスに乗って、えきでおります。",
              "バスにのって、駅で降ります。",
              "バスにのって、駅でおります。",
              "バスにのって、えきで降ります。",
              "バスにのって、えきでおります。"
            ],
            "hint": "に 乗って · で 降ります"
          },
          {
            "q": "Cuối tuần tôi xem phim rồi mua sắm.",
            "answers": [
              "週末、映画を見て、買い物をします。",
              "週末、映画を見て、買いものをします。",
              "週末、映画を見て、かい物をします。",
              "週末、映画を見て、かいものをします。",
              "週末、映画をみて、買い物をします。",
              "週末、映画をみて、買いものをします。",
              "週末、映画をみて、かい物をします。",
              "週末、映画をみて、かいものをします。",
              "週末、えいがを見て、買い物をします。",
              "週末、えいがを見て、買いものをします。",
              "週末、えいがを見て、かい物をします。",
              "週末、えいがを見て、かいものをします。",
              "週末、えいがをみて、買い物をします。",
              "週末、えいがをみて、買いものをします。",
              "週末、えいがをみて、かい物をします。",
              "週末、えいがをみて、かいものをします。",
              "しゅうまつ、映画を見て、買い物をします。",
              "しゅうまつ、映画を見て、買いものをします。",
              "しゅうまつ、映画を見て、かい物をします。",
              "しゅうまつ、映画を見て、かいものをします。",
              "しゅうまつ、映画をみて、買い物をします。",
              "しゅうまつ、映画をみて、買いものをします。",
              "しゅうまつ、映画をみて、かい物をします。",
              "しゅうまつ、映画をみて、かいものをします。",
              "しゅうまつ、えいがを見て、買い物をします。",
              "しゅうまつ、えいがを見て、買いものをします。",
              "しゅうまつ、えいがを見て、かい物をします。",
              "しゅうまつ、えいがを見て、かいものをします。",
              "しゅうまつ、えいがをみて、買い物をします。",
              "しゅうまつ、えいがをみて、買いものをします。",
              "しゅうまつ、えいがをみて、かい物をします。",
              "しゅうまつ、えいがをみて、かいものをします。",
              "週末、映画を見て、買い物します。",
              "週末、映画を見て、買いものします。",
              "週末、映画を見て、かい物します。",
              "週末、映画を見て、かいものします。",
              "週末、映画をみて、買い物します。",
              "週末、映画をみて、買いものします。",
              "週末、映画をみて、かい物します。",
              "週末、映画をみて、かいものします。",
              "週末、えいがを見て、買い物します。",
              "週末、えいがを見て、買いものします。",
              "週末、えいがを見て、かい物します。",
              "週末、えいがを見て、かいものします。",
              "週末、えいがをみて、買い物します。",
              "週末、えいがをみて、買いものします。",
              "週末、えいがをみて、かい物します。",
              "週末、えいがをみて、かいものします。",
              "しゅうまつ、映画を見て、買い物します。",
              "しゅうまつ、映画を見て、買いものします。",
              "しゅうまつ、映画を見て、かい物します。",
              "しゅうまつ、映画を見て、かいものします。",
              "しゅうまつ、映画をみて、買い物します。",
              "しゅうまつ、映画をみて、買いものします。",
              "しゅうまつ、映画をみて、かい物します。",
              "しゅうまつ、映画をみて、かいものします。",
              "しゅうまつ、えいがを見て、買い物します。",
              "しゅうまつ、えいがを見て、買いものします。",
              "しゅうまつ、えいがを見て、かい物します。",
              "しゅうまつ、えいがを見て、かいものします。",
              "しゅうまつ、えいがをみて、買い物します。",
              "しゅうまつ、えいがをみて、買いものします。",
              "しゅうまつ、えいがをみて、かい物します。",
              "しゅうまつ、えいがをみて、かいものします。"
            ],
            "hint": "Vて、V"
          },
          {
            "q": "Đi đến bảo tàng mỹ thuật bằng cách nào?",
            "answers": [
              "どうやって美術館へ行きますか。",
              "どうやって美術館へいきますか。",
              "どうやってびじゅつかんへ行きますか。",
              "どうやってびじゅつかんへいきますか。",
              "どうやって美術館に行きますか。",
              "どうやって美術館にいきますか。",
              "どうやってびじゅつかんに行きますか。",
              "どうやってびじゅつかんにいきますか。"
            ],
            "hint": "どうやって"
          },
          {
            "q": "Một tháng tôi đọc năm quyển sách.",
            "answers": [
              "一か月に本を五冊読みます。",
              "一か月に本を五冊よみます。",
              "一か月に本をごさつ読みます。",
              "一か月に本をごさつよみます。",
              "一か月にほんを五冊読みます。",
              "一か月にほんを五冊よみます。",
              "一か月にほんをごさつ読みます。",
              "一か月にほんをごさつよみます。",
              "一かげつに本を五冊読みます。",
              "一かげつに本を五冊よみます。",
              "一かげつに本をごさつ読みます。",
              "一かげつに本をごさつよみます。",
              "一かげつにほんを五冊読みます。",
              "一かげつにほんを五冊よみます。",
              "一かげつにほんをごさつ読みます。",
              "一かげつにほんをごさつよみます。",
              "いっか月に本を五冊読みます。",
              "いっか月に本を五冊よみます。",
              "いっか月に本をごさつ読みます。",
              "いっか月に本をごさつよみます。",
              "いっか月にほんを五冊読みます。",
              "いっか月にほんを五冊よみます。",
              "いっか月にほんをごさつ読みます。",
              "いっか月にほんをごさつよみます。",
              "いっかげつに本を五冊読みます。",
              "いっかげつに本を五冊よみます。",
              "いっかげつに本をごさつ読みます。",
              "いっかげつに本をごさつよみます。",
              "いっかげつにほんを五冊読みます。",
              "いっかげつにほんを五冊よみます。",
              "いっかげつにほんをごさつ読みます。",
              "いっかげつにほんをごさつよみます。",
              "1か月に本を5冊読みます。",
              "1か月に本を5冊よみます。",
              "1か月に本をごさつ読みます。",
              "1か月に本をごさつよみます。",
              "1か月にほんを5冊読みます。",
              "1か月にほんを5冊よみます。",
              "1か月にほんをごさつ読みます。",
              "1か月にほんをごさつよみます。",
              "1かげつに本を5冊読みます。",
              "1かげつに本を5冊よみます。",
              "1かげつに本をごさつ読みます。",
              "1かげつに本をごさつよみます。",
              "1かげつにほんを5冊読みます。",
              "1かげつにほんを5冊よみます。",
              "1かげつにほんをごさつ読みます。",
              "1かげつにほんをごさつよみます。",
              "いっか月に本を5冊読みます。",
              "いっか月に本を5冊よみます。",
              "いっか月にほんを5冊読みます。",
              "いっか月にほんを5冊よみます。",
              "いっかげつに本を5冊読みます。",
              "いっかげつに本を5冊よみます。",
              "いっかげつにほんを5冊読みます。",
              "いっかげつにほんを5冊よみます。"
            ],
            "hint": "～に ～冊"
          },
          {
            "q": "Một năm tôi về nước một lần.",
            "answers": [
              "一年に一回国へ帰ります。",
              "一年に一回国へかえります。",
              "一年に一回くにへ帰ります。",
              "一年に一回くにへかえります。",
              "一年にいっかい国へ帰ります。",
              "一年にいっかい国へかえります。",
              "一年にいっかいくにへ帰ります。",
              "一年にいっかいくにへかえります。",
              "いちねんに一回国へ帰ります。",
              "いちねんに一回国へかえります。",
              "いちねんに一回くにへ帰ります。",
              "いちねんに一回くにへかえります。",
              "いちねんにいっかい国へ帰ります。",
              "いちねんにいっかい国へかえります。",
              "いちねんにいっかいくにへ帰ります。",
              "いちねんにいっかいくにへかえります。",
              "一年に一回国に帰ります。",
              "一年に一回国にかえります。",
              "一年に一回くにに帰ります。",
              "一年に一回くににかえります。",
              "一年にいっかい国に帰ります。",
              "一年にいっかい国にかえります。",
              "一年にいっかいくにに帰ります。",
              "一年にいっかいくににかえります。",
              "いちねんに一回国に帰ります。",
              "いちねんに一回国にかえります。",
              "いちねんに一回くにに帰ります。",
              "いちねんに一回くににかえります。",
              "いちねんにいっかい国に帰ります。",
              "いちねんにいっかい国にかえります。",
              "いちねんにいっかいくにに帰ります。",
              "いちねんにいっかいくににかえります。"
            ],
            "hint": "～に ～回"
          },
          {
            "q": "Viết tên rồi cho xem thẻ ngoại kiều.",
            "answers": [
              "名前を書いて、外国人登録証を見せます。",
              "名前を書いて、外国人登録証をみせます。",
              "名前を書いて、がいこくじんとうろくしょうを見せます。",
              "名前を書いて、がいこくじんとうろくしょうをみせます。",
              "名前をかいて、外国人登録証を見せます。",
              "名前をかいて、外国人登録証をみせます。",
              "名前をかいて、がいこくじんとうろくしょうを見せます。",
              "名前をかいて、がいこくじんとうろくしょうをみせます。",
              "なまえを書いて、外国人登録証を見せます。",
              "なまえを書いて、外国人登録証をみせます。",
              "なまえを書いて、がいこくじんとうろくしょうを見せます。",
              "なまえを書いて、がいこくじんとうろくしょうをみせます。",
              "なまえをかいて、外国人登録証を見せます。",
              "なまえをかいて、外国人登録証をみせます。",
              "なまえをかいて、がいこくじんとうろくしょうを見せます。",
              "なまえをかいて、がいこくじんとうろくしょうをみせます。"
            ],
            "hint": "Vて、V"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-np2-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Sáng tôi dậy, ăn cơm rồi đến trường.",
            "chips": [
              "{食|た}べます、",
              "{学校|がっこう}へ{行|い}きます",
              "{朝|あさ}{起|お}きて、",
              "ご{飯|はん}を{食|た}べて、"
            ],
            "answer": [
              "{朝|あさ}{起|お}きて、",
              "ご{飯|はん}を{食|た}べて、",
              "{学校|がっこう}へ{行|い}きます"
            ],
            "ro": "Asa okite, gohan o tabete, gakkou e ikimasu"
          },
          {
            "vi": "Một tuần tôi bơi ba lần.",
            "chips": [
              "{泳|およ}ぎます",
              "{三回|さんかい}",
              "{一週間|いっしゅうかん}に",
              "{三杯|さんばい}"
            ],
            "answer": [
              "{一週間|いっしゅうかん}に",
              "{三回|さんかい}",
              "{泳|およ}ぎます"
            ],
            "ro": "Isshuukan ni sankai oyogimasu"
          },
          {
            "vi": "Lên xe buýt số 3, xuống ở ga.",
            "chips": [
              "{降|お}ります",
              "{駅|えき}で",
              "{駅|えき}を",
              "{乗|の}って、",
              "{三番|さんばん}のバスに"
            ],
            "answer": [
              "{三番|さんばん}のバスに",
              "{乗|の}って、",
              "{駅|えき}で",
              "{降|お}ります"
            ],
            "ro": "Sanban no basu ni notte, eki de orimasu"
          },
          {
            "vi": "Làm thẻ thư viện bằng cách nào?",
            "chips": [
              "{図書館|としょかん}のカードを",
              "どうやって",
              "{作|つく}りますか",
              "どうして"
            ],
            "answer": [
              "どうやって",
              "{図書館|としょかん}のカードを",
              "{作|つく}りますか"
            ],
            "ro": "Douyatte toshokan no kaado o tsukurimasu ka"
          },
          {
            "vi": "Một ngày tôi uống hai cốc cà phê.",
            "chips": [
              "{二杯|にはい}",
              "コーヒーを",
              "{飲|の}みます",
              "{二本|にほん}",
              "{一日|いちにち}に"
            ],
            "answer": [
              "{一日|いちにち}に",
              "コーヒーを",
              "{二杯|にはい}",
              "{飲|の}みます"
            ],
            "ro": "Ichinichi ni koohii o nihai nomimasu",
            "alt": [
              [
                "{一日|いちにち}に",
                "{二杯|にはい}",
                "コーヒーを",
                "{飲|の}みます"
              ]
            ]
          },
          {
            "vi": "Đặt trước trên mạng rồi trả tiền ở cửa hàng tiện lợi.",
            "chips": [
              "インターネットで",
              "{予約|よやく}します、",
              "コンビニで",
              "{予約|よやく}して、",
              "お{金|かね}を{払|はら}います"
            ],
            "answer": [
              "インターネットで",
              "{予約|よやく}して、",
              "コンビニで",
              "お{金|かね}を{払|はら}います"
            ],
            "ro": "Intaanetto de yoyaku shite, konbini de okane o haraimasu"
          },
          {
            "vi": "Hôm qua tôi gặp bạn, đi chơi rồi về.",
            "chips": [
              "{遊|あそ}んで、",
              "{帰|かえ}りました",
              "{帰|かえ}ります",
              "{昨日|きのう}、",
              "{友達|ともだち}に{会|あ}って、"
            ],
            "answer": [
              "{昨日|きのう}、",
              "{友達|ともだち}に{会|あ}って、",
              "{遊|あそ}んで、",
              "{帰|かえ}りました"
            ],
            "ro": "Kinou, tomodachi ni atte, asonde, kaerimashita"
          },
          {
            "vi": "Một tháng tôi leo núi khoảng hai lần.",
            "chips": [
              "{二回|にかい}くらい",
              "{山|やま}に",
              "{一月|いちがつ}に",
              "{登|のぼ}ります",
              "{一|いっ}か{月|げつ}に"
            ],
            "answer": [
              "{一|いっ}か{月|げつ}に",
              "{二回|にかい}くらい",
              "{山|やま}に",
              "{登|のぼ}ります"
            ],
            "ro": "Ikkagetsu ni nikai kurai yama ni noborimasu",
            "alt": [
              [
                "{一|いっ}か{月|げつ}に",
                "{山|やま}に",
                "{二回|にかい}くらい",
                "{登|のぼ}ります"
              ]
            ]
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch · nhiều ô trống · tình huống"
      },
      {
        "t": "quiz",
        "id": "lt-b9-np2-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 83, 84, 86",
        "items": [
          {
            "q": "Cuối tuần tôi đi siêu thị, nấu ăn rồi ăn cùng bạn.",
            "answers": [
              "週末、スーパーへ行って、料理を作って、友達と食べます。",
              "しゅうまつ、スーパーへいって、りょうりをつくって、ともだちとたべます。",
              "しゅうまつ、スーパーへ行って、料理を作って、友達と食べます。",
              "週末、スーパーへいって、りょうりをつくって、ともだちとたべます。",
              "週末、スーパーへいって、料理を作って、友達と食べます。",
              "しゅうまつ、スーパーへ行って、りょうりをつくって、ともだちとたべます。",
              "週末、スーパーへ行って、りょうりを作って、友達と食べます。",
              "しゅうまつ、スーパーへいって、料理をつくって、ともだちとたべます。",
              "週末、スーパーへ行って、料理をつくって、友達と食べます。",
              "しゅうまつ、スーパーへいって、りょうりを作って、ともだちとたべます。",
              "週末、スーパーへ行って、料理を作って、ともだちと食べます。",
              "しゅうまつ、スーパーへいって、りょうりをつくって、友達とたべます。",
              "週末、スーパーへ行って、料理を作って、友達とたべます。",
              "しゅうまつ、スーパーへいって、りょうりをつくって、ともだちと食べます。",
              "週末、スーパーへ行って、料理を作って、友達と食べました。",
              "しゅうまつ、スーパーへいって、りょうりをつくって、ともだちとたべました。",
              "しゅうまつ、スーパーへ行って、料理を作って、友達と食べました。",
              "週末、スーパーへいって、りょうりをつくって、ともだちとたべました。",
              "週末、スーパーへいって、料理を作って、友達と食べました。",
              "しゅうまつ、スーパーへ行って、りょうりをつくって、ともだちとたべました。",
              "週末、スーパーへ行って、りょうりを作って、友達と食べました。",
              "しゅうまつ、スーパーへいって、料理をつくって、ともだちとたべました。",
              "週末、スーパーへ行って、料理をつくって、友達と食べました。",
              "しゅうまつ、スーパーへいって、りょうりを作って、ともだちとたべました。",
              "週末、スーパーへ行って、料理を作って、ともだちと食べました。",
              "しゅうまつ、スーパーへいって、りょうりをつくって、友達とたべました。",
              "週末、スーパーへ行って、料理を作って、友達とたべました。",
              "しゅうまつ、スーパーへいって、りょうりをつくって、ともだちと食べました。",
              "週末、スーパーに行って、料理を作って、友達と食べます。",
              "しゅうまつ、スーパーにいって、りょうりをつくって、ともだちとたべます。",
              "しゅうまつ、スーパーに行って、料理を作って、友達と食べます。",
              "週末、スーパーにいって、りょうりをつくって、ともだちとたべます。",
              "週末、スーパーにいって、料理を作って、友達と食べます。",
              "しゅうまつ、スーパーに行って、りょうりをつくって、ともだちとたべます。",
              "週末、スーパーに行って、りょうりを作って、友達と食べます。",
              "しゅうまつ、スーパーにいって、料理をつくって、ともだちとたべます。",
              "週末、スーパーに行って、料理をつくって、友達と食べます。",
              "しゅうまつ、スーパーにいって、りょうりを作って、ともだちとたべます。",
              "週末、スーパーに行って、料理を作って、ともだちと食べます。",
              "しゅうまつ、スーパーにいって、りょうりをつくって、友達とたべます。",
              "週末、スーパーに行って、料理を作って、友達とたべます。",
              "しゅうまつ、スーパーにいって、りょうりをつくって、ともだちと食べます。"
            ],
            "hint": "Vて、Vて、V"
          },
          {
            "q": "Một tuần tôi đến lớp thư pháp một lần.",
            "answers": [
              "一週間に一回書道教室へ行きます。",
              "一週間に一回書道教室へいきます。",
              "一週間に一回書道きょうしつへ行きます。",
              "一週間に一回書道きょうしつへいきます。",
              "一週間に一回しょどう教室へ行きます。",
              "一週間に一回しょどう教室へいきます。",
              "一週間に一回しょどうきょうしつへ行きます。",
              "一週間に一回しょどうきょうしつへいきます。",
              "一週間にいっかい書道教室へ行きます。",
              "一週間にいっかい書道教室へいきます。",
              "一週間にいっかい書道きょうしつへ行きます。",
              "一週間にいっかい書道きょうしつへいきます。",
              "一週間にいっかいしょどう教室へ行きます。",
              "一週間にいっかいしょどう教室へいきます。",
              "一週間にいっかいしょどうきょうしつへ行きます。",
              "一週間にいっかいしょどうきょうしつへいきます。",
              "いっしゅうかんに一回書道教室へ行きます。",
              "いっしゅうかんに一回書道教室へいきます。",
              "いっしゅうかんに一回書道きょうしつへ行きます。",
              "いっしゅうかんに一回書道きょうしつへいきます。",
              "いっしゅうかんに一回しょどう教室へ行きます。",
              "いっしゅうかんに一回しょどう教室へいきます。",
              "いっしゅうかんに一回しょどうきょうしつへ行きます。",
              "いっしゅうかんに一回しょどうきょうしつへいきます。",
              "いっしゅうかんにいっかい書道教室へ行きます。",
              "いっしゅうかんにいっかい書道教室へいきます。",
              "いっしゅうかんにいっかい書道きょうしつへ行きます。",
              "いっしゅうかんにいっかい書道きょうしつへいきます。",
              "いっしゅうかんにいっかいしょどう教室へ行きます。",
              "いっしゅうかんにいっかいしょどう教室へいきます。",
              "いっしゅうかんにいっかいしょどうきょうしつへ行きます。",
              "いっしゅうかんにいっかいしょどうきょうしつへいきます。",
              "一週間に一回書道教室に行きます。",
              "一週間に一回書道教室にいきます。",
              "一週間に一回書道きょうしつに行きます。",
              "一週間に一回書道きょうしつにいきます。",
              "一週間に一回しょどう教室に行きます。",
              "一週間に一回しょどう教室にいきます。",
              "一週間に一回しょどうきょうしつに行きます。",
              "一週間に一回しょどうきょうしつにいきます。",
              "一週間にいっかい書道教室に行きます。",
              "一週間にいっかい書道教室にいきます。",
              "一週間にいっかい書道きょうしつに行きます。",
              "一週間にいっかい書道きょうしつにいきます。",
              "一週間にいっかいしょどう教室に行きます。",
              "一週間にいっかいしょどう教室にいきます。",
              "一週間にいっかいしょどうきょうしつに行きます。",
              "一週間にいっかいしょどうきょうしつにいきます。",
              "いっしゅうかんに一回書道教室に行きます。",
              "いっしゅうかんに一回書道教室にいきます。",
              "いっしゅうかんに一回書道きょうしつに行きます。",
              "いっしゅうかんに一回書道きょうしつにいきます。",
              "いっしゅうかんに一回しょどう教室に行きます。",
              "いっしゅうかんに一回しょどう教室にいきます。",
              "いっしゅうかんに一回しょどうきょうしつに行きます。",
              "いっしゅうかんに一回しょどうきょうしつにいきます。",
              "いっしゅうかんにいっかい書道教室に行きます。",
              "いっしゅうかんにいっかい書道教室にいきます。",
              "いっしゅうかんにいっかい書道きょうしつに行きます。",
              "いっしゅうかんにいっかい書道きょうしつにいきます。",
              "いっしゅうかんにいっかいしょどう教室に行きます。",
              "いっしゅうかんにいっかいしょどう教室にいきます。",
              "いっしゅうかんにいっかいしょどうきょうしつに行きます。",
              "いっしゅうかんにいっかいしょどうきょうしつにいきます。"
            ],
            "hint": "～に ～回"
          },
          {
            "q": "Đến bảo tàng bằng cách nào? — Lên xe buýt số 3, xuống ở trước bảo tàng.",
            "answers": [
              "どうやって美術館へ行きますか。三番のバスに乗って、美術館の前で降ります。",
              "どうやってびじゅつかんへいきますか。さんばんのバスにのって、びじゅつかんのまえでおります。",
              "どうやってびじゅつかんへ行きますか。三番のバスに乗って、美術館の前で降ります。",
              "どうやって美術館へいきますか。さんばんのバスにのって、びじゅつかんのまえでおります。",
              "どうやって美術館へいきますか。三番のバスに乗って、美術館の前で降ります。",
              "どうやってびじゅつかんへ行きますか。さんばんのバスにのって、びじゅつかんのまえでおります。",
              "どうやって美術館へ行きますか。さんばんのバスに乗って、美術館の前で降ります。",
              "どうやってびじゅつかんへいきますか。三番のバスにのって、びじゅつかんのまえでおります。",
              "どうやって美術館へ行きますか。三番のバスにのって、美術館の前で降ります。",
              "どうやってびじゅつかんへいきますか。さんばんのバスに乗って、びじゅつかんのまえでおります。",
              "どうやって美術館へ行きますか。三番のバスに乗って、びじゅつかんの前で降ります。",
              "どうやってびじゅつかんへいきますか。さんばんのバスにのって、美術館のまえでおります。",
              "どうやって美術館へ行きますか。三番のバスに乗って、美術館のまえで降ります。",
              "どうやってびじゅつかんへいきますか。さんばんのバスにのって、びじゅつかんの前でおります。",
              "どうやって美術館へ行きますか。三番のバスに乗って、美術館の前でおります。",
              "どうやってびじゅつかんへいきますか。さんばんのバスにのって、びじゅつかんのまえで降ります。",
              "どうやって美術館に行きますか。三番のバスに乗って、美術館前で降ります。",
              "どうやってびじゅつかんにいきますか。さんばんのバスにのって、びじゅつかんまえでおります。",
              "どうやってびじゅつかんに行きますか。三番のバスに乗って、美術館前で降ります。",
              "どうやって美術館にいきますか。さんばんのバスにのって、びじゅつかんまえでおります。",
              "どうやって美術館にいきますか。三番のバスに乗って、美術館前で降ります。",
              "どうやってびじゅつかんに行きますか。さんばんのバスにのって、びじゅつかんまえでおります。",
              "どうやって美術館に行きますか。さんばんのバスに乗って、美術館前で降ります。",
              "どうやってびじゅつかんにいきますか。三番のバスにのって、びじゅつかんまえでおります。",
              "どうやって美術館に行きますか。三番のバスにのって、美術館前で降ります。",
              "どうやってびじゅつかんにいきますか。さんばんのバスに乗って、びじゅつかんまえでおります。",
              "どうやって美術館に行きますか。三番のバスに乗って、びじゅつかん前で降ります。",
              "どうやってびじゅつかんにいきますか。さんばんのバスにのって、美術館まえでおります。",
              "どうやって美術館に行きますか。三番のバスに乗って、美術館まえで降ります。",
              "どうやってびじゅつかんにいきますか。さんばんのバスにのって、びじゅつかん前でおります。",
              "どうやって美術館に行きますか。三番のバスに乗って、美術館前でおります。",
              "どうやってびじゅつかんにいきますか。さんばんのバスにのって、びじゅつかんまえで降ります。"
            ],
            "hint": "どうやって · に 乗って · で 降ります"
          },
          {
            "q": "Một ngày bạn uống mấy cốc cà phê?",
            "answers": [
              "一日にコーヒーを何杯飲みますか。",
              "一日にコーヒーを何杯のみますか。",
              "一日にコーヒーをなんばい飲みますか。",
              "一日にコーヒーをなんばいのみますか。",
              "いちにちにコーヒーを何杯飲みますか。",
              "いちにちにコーヒーを何杯のみますか。",
              "いちにちにコーヒーをなんばい飲みますか。",
              "いちにちにコーヒーをなんばいのみますか。",
              "一日に何杯コーヒーを飲みますか。",
              "一日に何杯コーヒーをのみますか。",
              "一日になんばいコーヒーを飲みますか。",
              "一日になんばいコーヒーをのみますか。",
              "いちにちに何杯コーヒーを飲みますか。",
              "いちにちに何杯コーヒーをのみますか。",
              "いちにちになんばいコーヒーを飲みますか。",
              "いちにちになんばいコーヒーをのみますか。"
            ],
            "hint": "何杯"
          },
          {
            "q": "Ở quầy lễ tân, hãy nói địa chỉ rồi trả tiền.",
            "answers": [
              "受付で住所を言って、お金を払ってください。",
              "受付で住所を言って、お金をはらってください。",
              "受付で住所を言って、おかねを払ってください。",
              "受付で住所を言って、おかねをはらってください。",
              "受付で住所をいって、お金を払ってください。",
              "受付で住所をいって、お金をはらってください。",
              "受付で住所をいって、おかねを払ってください。",
              "受付で住所をいって、おかねをはらってください。",
              "受付でじゅうしょを言って、お金を払ってください。",
              "受付でじゅうしょを言って、お金をはらってください。",
              "受付でじゅうしょを言って、おかねを払ってください。",
              "受付でじゅうしょを言って、おかねをはらってください。",
              "受付でじゅうしょをいって、お金を払ってください。",
              "受付でじゅうしょをいって、お金をはらってください。",
              "受付でじゅうしょをいって、おかねを払ってください。",
              "受付でじゅうしょをいって、おかねをはらってください。",
              "うけつけで住所を言って、お金を払ってください。",
              "うけつけで住所を言って、お金をはらってください。",
              "うけつけで住所を言って、おかねを払ってください。",
              "うけつけで住所を言って、おかねをはらってください。",
              "うけつけで住所をいって、お金を払ってください。",
              "うけつけで住所をいって、お金をはらってください。",
              "うけつけで住所をいって、おかねを払ってください。",
              "うけつけで住所をいって、おかねをはらってください。",
              "うけつけでじゅうしょを言って、お金を払ってください。",
              "うけつけでじゅうしょを言って、お金をはらってください。",
              "うけつけでじゅうしょを言って、おかねを払ってください。",
              "うけつけでじゅうしょを言って、おかねをはらってください。",
              "うけつけでじゅうしょをいって、お金を払ってください。",
              "うけつけでじゅうしょをいって、お金をはらってください。",
              "うけつけでじゅうしょをいって、おかねを払ってください。",
              "うけつけでじゅうしょをいって、おかねをはらってください。"
            ],
            "hint": "Vて、V て ください"
          },
          {
            "q": "Hôm qua tôi về nhà, làm bài tập rồi ngủ.",
            "answers": [
              "昨日、うちへ帰って、宿題をして、寝ました。",
              "昨日、うちへ帰って、宿題をして、ねました。",
              "昨日、うちへ帰って、しゅくだいをして、寝ました。",
              "昨日、うちへ帰って、しゅくだいをして、ねました。",
              "昨日、うちへかえって、宿題をして、寝ました。",
              "昨日、うちへかえって、宿題をして、ねました。",
              "昨日、うちへかえって、しゅくだいをして、寝ました。",
              "昨日、うちへかえって、しゅくだいをして、ねました。",
              "きのう、うちへ帰って、宿題をして、寝ました。",
              "きのう、うちへ帰って、宿題をして、ねました。",
              "きのう、うちへ帰って、しゅくだいをして、寝ました。",
              "きのう、うちへ帰って、しゅくだいをして、ねました。",
              "きのう、うちへかえって、宿題をして、寝ました。",
              "きのう、うちへかえって、宿題をして、ねました。",
              "きのう、うちへかえって、しゅくだいをして、寝ました。",
              "きのう、うちへかえって、しゅくだいをして、ねました。",
              "昨日、うちに帰って、宿題をして、寝ました。",
              "昨日、うちに帰って、宿題をして、ねました。",
              "昨日、うちに帰って、しゅくだいをして、寝ました。",
              "昨日、うちに帰って、しゅくだいをして、ねました。",
              "昨日、うちにかえって、宿題をして、寝ました。",
              "昨日、うちにかえって、宿題をして、ねました。",
              "昨日、うちにかえって、しゅくだいをして、寝ました。",
              "昨日、うちにかえって、しゅくだいをして、ねました。",
              "きのう、うちに帰って、宿題をして、寝ました。",
              "きのう、うちに帰って、宿題をして、ねました。",
              "きのう、うちに帰って、しゅくだいをして、寝ました。",
              "きのう、うちに帰って、しゅくだいをして、ねました。",
              "きのう、うちにかえって、宿題をして、寝ました。",
              "きのう、うちにかえって、宿題をして、ねました。",
              "きのう、うちにかえって、しゅくだいをして、寝ました。",
              "きのう、うちにかえって、しゅくだいをして、ねました。"
            ],
            "hint": "Vて、Vて、Vました"
          },
          {
            "q": "Một tháng tôi đọc khoảng ba quyển tiểu thuyết.",
            "answers": [
              "一か月に小説を三冊くらい読みます。",
              "一か月に小説を三冊くらいよみます。",
              "一か月に小説をさんさつくらい読みます。",
              "一か月に小説をさんさつくらいよみます。",
              "一か月にしょうせつを三冊くらい読みます。",
              "一か月にしょうせつを三冊くらいよみます。",
              "一か月にしょうせつをさんさつくらい読みます。",
              "一か月にしょうせつをさんさつくらいよみます。",
              "一かげつに小説を三冊くらい読みます。",
              "一かげつに小説を三冊くらいよみます。",
              "一かげつに小説をさんさつくらい読みます。",
              "一かげつに小説をさんさつくらいよみます。",
              "一かげつにしょうせつを三冊くらい読みます。",
              "一かげつにしょうせつを三冊くらいよみます。",
              "一かげつにしょうせつをさんさつくらい読みます。",
              "一かげつにしょうせつをさんさつくらいよみます。",
              "いっか月に小説を三冊くらい読みます。",
              "いっか月に小説を三冊くらいよみます。",
              "いっか月に小説をさんさつくらい読みます。",
              "いっか月に小説をさんさつくらいよみます。",
              "いっか月にしょうせつを三冊くらい読みます。",
              "いっか月にしょうせつを三冊くらいよみます。",
              "いっか月にしょうせつをさんさつくらい読みます。",
              "いっか月にしょうせつをさんさつくらいよみます。",
              "いっかげつに小説を三冊くらい読みます。",
              "いっかげつに小説を三冊くらいよみます。",
              "いっかげつに小説をさんさつくらい読みます。",
              "いっかげつに小説をさんさつくらいよみます。",
              "いっかげつにしょうせつを三冊くらい読みます。",
              "いっかげつにしょうせつを三冊くらいよみます。",
              "いっかげつにしょうせつをさんさつくらい読みます。",
              "いっかげつにしょうせつをさんさつくらいよみます。",
              "一か月に小説を三冊ぐらい読みます。",
              "一か月に小説を三冊ぐらいよみます。",
              "一か月に小説をさんさつぐらい読みます。",
              "一か月に小説をさんさつぐらいよみます。",
              "一か月にしょうせつを三冊ぐらい読みます。",
              "一か月にしょうせつを三冊ぐらいよみます。",
              "一か月にしょうせつをさんさつぐらい読みます。",
              "一か月にしょうせつをさんさつぐらいよみます。",
              "一かげつに小説を三冊ぐらい読みます。",
              "一かげつに小説を三冊ぐらいよみます。",
              "一かげつに小説をさんさつぐらい読みます。",
              "一かげつに小説をさんさつぐらいよみます。",
              "一かげつにしょうせつを三冊ぐらい読みます。",
              "一かげつにしょうせつを三冊ぐらいよみます。",
              "一かげつにしょうせつをさんさつぐらい読みます。",
              "一かげつにしょうせつをさんさつぐらいよみます。",
              "いっか月に小説を三冊ぐらい読みます。",
              "いっか月に小説を三冊ぐらいよみます。",
              "いっか月に小説をさんさつぐらい読みます。",
              "いっか月に小説をさんさつぐらいよみます。",
              "いっか月にしょうせつを三冊ぐらい読みます。",
              "いっか月にしょうせつを三冊ぐらいよみます。",
              "いっか月にしょうせつをさんさつぐらい読みます。",
              "いっか月にしょうせつをさんさつぐらいよみます。",
              "いっかげつに小説を三冊ぐらい読みます。",
              "いっかげつに小説を三冊ぐらいよみます。",
              "いっかげつに小説をさんさつぐらい読みます。",
              "いっかげつに小説をさんさつぐらいよみます。",
              "いっかげつにしょうせつを三冊ぐらい読みます。",
              "いっかげつにしょうせつを三冊ぐらいよみます。",
              "いっかげつにしょうせつをさんさつぐらい読みます。",
              "いっかげつにしょうせつをさんさつぐらいよみます。"
            ],
            "hint": "～冊 くらい"
          },
          {
            "q": "Mua vé bằng cách nào? — Đặt trước trên mạng.",
            "answers": [
              "どうやってチケットを買いますか。インターネットで予約します。",
              "どうやってチケットを買いますか。インターネットでよやくします。",
              "どうやってチケットをかいますか。インターネットで予約します。",
              "どうやってチケットをかいますか。インターネットでよやくします。"
            ],
            "hint": "どうやって"
          },
          {
            "q": "Một năm tôi về nước hai lần.",
            "answers": [
              "一年に二回国へ帰ります。",
              "一年に二回国へかえります。",
              "一年に二回くにへ帰ります。",
              "一年に二回くにへかえります。",
              "一年ににかい国へ帰ります。",
              "一年ににかい国へかえります。",
              "一年ににかいくにへ帰ります。",
              "一年ににかいくにへかえります。",
              "いちねんに二回国へ帰ります。",
              "いちねんに二回国へかえります。",
              "いちねんに二回くにへ帰ります。",
              "いちねんに二回くにへかえります。",
              "いちねんににかい国へ帰ります。",
              "いちねんににかい国へかえります。",
              "いちねんににかいくにへ帰ります。",
              "いちねんににかいくにへかえります。",
              "一年に二回国に帰ります。",
              "一年に二回国にかえります。",
              "一年に二回くにに帰ります。",
              "一年に二回くににかえります。",
              "一年ににかい国に帰ります。",
              "一年ににかい国にかえります。",
              "一年ににかいくにに帰ります。",
              "一年ににかいくににかえります。",
              "いちねんに二回国に帰ります。",
              "いちねんに二回国にかえります。",
              "いちねんに二回くにに帰ります。",
              "いちねんに二回くににかえります。",
              "いちねんににかい国に帰ります。",
              "いちねんににかい国にかえります。",
              "いちねんににかいくにに帰ります。",
              "いちねんににかいくににかえります。"
            ],
            "hint": "～に ～回"
          },
          {
            "q": "Sáng nào tôi cũng dậy lúc 6 giờ, đi bơi rồi đến công ty.",
            "answers": [
              "毎朝六時に起きて、泳いで、会社へ行きます。",
              "まいあさろくじにおきて、およいで、かいしゃへいきます。",
              "まいあさ六時に起きて、泳いで、会社へ行きます。",
              "毎朝ろくじにおきて、およいで、かいしゃへいきます。",
              "毎朝ろくじに起きて、泳いで、会社へ行きます。",
              "まいあさ六時におきて、およいで、かいしゃへいきます。",
              "毎朝六時におきて、泳いで、会社へ行きます。",
              "まいあさろくじに起きて、およいで、かいしゃへいきます。",
              "毎朝六時に起きて、およいで、会社へ行きます。",
              "まいあさろくじにおきて、泳いで、かいしゃへいきます。",
              "毎朝六時に起きて、泳いで、かいしゃへ行きます。",
              "まいあさろくじにおきて、およいで、会社へいきます。",
              "毎朝六時に起きて、泳いで、会社へいきます。",
              "まいあさろくじにおきて、およいで、かいしゃへ行きます。",
              "毎朝六時に起きて、泳いで、会社に行きます。",
              "まいあさろくじにおきて、およいで、かいしゃにいきます。",
              "まいあさ六時に起きて、泳いで、会社に行きます。",
              "毎朝ろくじにおきて、およいで、かいしゃにいきます。",
              "毎朝ろくじに起きて、泳いで、会社に行きます。",
              "まいあさ六時におきて、およいで、かいしゃにいきます。",
              "毎朝六時におきて、泳いで、会社に行きます。",
              "まいあさろくじに起きて、およいで、かいしゃにいきます。",
              "毎朝六時に起きて、およいで、会社に行きます。",
              "まいあさろくじにおきて、泳いで、かいしゃにいきます。",
              "毎朝六時に起きて、泳いで、かいしゃに行きます。",
              "まいあさろくじにおきて、およいで、会社にいきます。",
              "毎朝六時に起きて、泳いで、会社にいきます。",
              "まいあさろくじにおきて、およいで、かいしゃに行きます。"
            ],
            "hint": "Vて、Vて、V"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{一週間|いっしゅうかん}（①）{三回|さんかい}、プール（②）{泳|およ}ぎます。　〔Isshuukan ((1)) sankai, puuru ((2)) oyogimasu.〕　— Một tuần tôi bơi ở bể bơi ba lần.",
            "options": [
              "① に　② を",
              "① で　② に",
              "① を　② で",
              "① に　② で"
            ],
            "correct": 3,
            "why": "Khoảng thời gian **に** · nơi hành động **で**. → **{一週間|いっしゅうかん}に{三回|さんかい}、プールで{泳|およ}ぎます。** 〔Isshuukan ni sankai, puuru de oyogimasu.〕 — Một tuần tôi bơi ở bể bơi ba lần."
          },
          {
            "q": "バス（①）{乗|の}って、{駅|えき}（②）{降|お}ります。　〔Basu ((1)) notte, eki ((2)) orimasu.〕　— Lên xe buýt rồi xuống ở ga.",
            "options": [
              "① を　② に",
              "① に　② を",
              "① に　② で",
              "① で　② で"
            ],
            "correct": 2,
            "why": "**に** 乗ります · nơi xuống **で**. → **バスに{乗|の}って、{駅|えき}で{降|お}ります。** 〔Basu ni notte, eki de orimasu.〕 — Lên xe buýt rồi xuống ở ga."
          },
          {
            "q": "{朝|あさ}ご{飯|はん}を{食|た}べ（①）、{新聞|しんぶん}を{読|よ}ん（②）、{会社|かいしゃ}へ{行|い}きます。　〔Asa gohan o tabe((1)), shinbun o yon((2)), kaisha e ikimasu.〕　— Sáng tôi ăn cơm, đọc báo rồi đến công ty.",
            "options": [
              "① ます　② で",
              "① で　② て",
              "① て　② て",
              "① て　② で"
            ],
            "correct": 3,
            "why": "食べ**て** · 読ん**で**. → **{朝|あさ}ご{飯|はん}を{食|た}べて、{新聞|しんぶん}を{読|よ}んで、{会社|かいしゃ}へ{行|い}きます。** 〔Asa gohan o tabete, shinbun o yonde, kaisha e ikimasu.〕 — Sáng tôi ăn cơm, đọc báo rồi đến công ty."
          },
          {
            "q": "{一日|いちにち}にコーヒーを２（①）、{水|みず}を３（②）{飲|の}みます。　〔Ichinichi ni koohii o ２((1)), mizu o ３((2)) nomimasu.〕　— Một ngày tôi uống 2 cốc cà phê và 3 chai nước.",
            "options": [
              "① 冊　② 本",
              "① 本　② 杯",
              "① 杯　② 冊",
              "① 杯　② 本"
            ],
            "correct": 3,
            "why": "Cốc **杯** · chai **本**. → **{一日|いちにち}にコーヒーを{二杯|にはい}、{水|みず}を{三本|さんぼん}{飲|の}みます。** 〔Ichinichi ni koohii o nihai, mizu o sanbon nomimasu.〕 — Một ngày tôi uống 2 cốc cà phê và 3 chai nước."
          },
          {
            "q": "（①）{図書館|としょかん}のカードを{作|つく}りますか。——{受付|うけつけ}で{名前|なまえ}を{書|か}い（②）、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。　〔((1)) toshokan no kaado o tsukurimasu ka. — Uketsuke de namae o kai((2)), gaikokujintourokushou o misemasu.〕　— Làm thẻ thư viện thế nào? — Viết tên ở quầy rồi xuất trình thẻ ngoại kiều.",
            "options": [
              "① どうやって　② で",
              "① どこ　② た",
              "① どうやって　② て",
              "① どうして　② て"
            ],
            "correct": 2,
            "why": "Hỏi cách → **どうやって**; 書いて. → **どうやって{図書館|としょかん}のカードを{作|つく}りますか。——{受付|うけつけ}で{名前|なまえ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。** 〔Douyatte toshokan no kaado o tsukurimasu ka. — Uketsuke de namae o kaite, gaikokujintourokushou o misemasu.〕 — Làm thẻ thư viện thế nào? — Viết tên ở quầy rồi xuất trình thẻ ngoại kiều."
          },
          {
            "q": "{昨日|きのう}、{映画|えいが}を{見|み}（①）、{友達|ともだち}と{食事|しょくじ}（②）。　〔Kinou, eiga o mi((1)), tomodachi to shokuji ((2)).〕　— Hôm qua tôi xem phim rồi đi ăn với bạn.",
            "options": [
              "① て　② します",
              "① ます　② しました",
              "① で　② して",
              "① て　② しました"
            ],
            "correct": 3,
            "why": "Vて + động từ cuối quá khứ. → **{昨日|きのう}、{映画|えいが}を{見|み}て、{友達|ともだち}と{食事|しょくじ}しました。** 〔Kinou, eiga o mite, tomodachi to shokuji shimashita.〕 — Hôm qua tôi xem phim rồi đi ăn với bạn."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np2-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Bạn hỏi đường đến bảo tàng mỹ thuật.",
            "options": [
              "すみません、どうやって{美術館|びじゅつかん}へ{行|い}きますか。 (Sumimasen, douyatte bijutsukan e ikimasu ka.)",
              "すみません、どうして{美術館|びじゅつかん}へ{行|い}きますか。 (Sumimasen, doushite bijutsukan e ikimasu ka.)",
              "すみません、どうやって{美術館|びじゅつかん}を{行|い}きますか。 (Sumimasen, douyatte bijutsukan o ikimasu ka.)",
              "すみません、どこ{美術館|びじゅつかん}へ{行|い}きますか。 (Sumimasen, doko bijutsukan e ikimasu ka.)"
            ],
            "correct": 0,
            "why": "Hỏi cách đi → どうやって … へ 行きますか."
          },
          {
            "q": "Giám khảo hỏi 「よく えいがを みますか」. Bạn xem khoảng 1 tuần 2 lần.",
            "options": [
              "はい、{一週間|いっしゅうかん}に{二回|にかい}くらい{見|み}ます。 (Hai, isshuukan ni nikai kurai mimasu.)",
              "はい、{二回|にかい}に{一週間|いっしゅうかん}{見|み}ます。 (Hai, nikai ni isshuukan mimasu.)",
              "はい、{一週間|いっしゅうかん}{二回|にかい}に{見|み}ます。 (Hai, isshuukan nikai ni mimasu.)",
              "はい、{一週間|いっしゅうかん}に{二杯|にはい}{見|み}ます。 (Hai, isshuukan ni nihai mimasu.)"
            ],
            "correct": 0,
            "why": "一週間に 二回 くらい."
          },
          {
            "q": "Kể cuối tuần: đi bơi, ăn trưa với bạn rồi về nhà.",
            "options": [
              "プールで{泳|およ}いで、{友達|ともだち}と{昼|ひる}ご{飯|はん}を{食|た}べて、うちへ{帰|かえ}りました。 (Puuru de oyoide, tomodachi to hirugohan o tabete, uchi e kaerimashita.)",
              "プールで{泳|およ}いて、{友達|ともだち}と{昼|ひる}ご{飯|はん}を{食|た}べて、うちへ{帰|かえ}りました。 (Puuru de oyoite, tomodachi to hirugohan o tabete, uchi e kaerimashita.)",
              "プールで{泳|およ}ぎました、{友達|ともだち}と{昼|ひる}ご{飯|はん}を{食|た}べて、うちへ{帰|かえ}って。 (Puuru de oyogimashita, tomodachi to hirugohan o tabete, uchi e kaette.)",
              "プールで{泳|およ}いで、{友達|ともだち}と{昼|ひる}ご{飯|はん}を{食|た}べて、うちへ{帰|かえ}ります。 (Puuru de oyoide, tomodachi to hirugohan o tabete, uchi e kaerimasu.)"
            ],
            "correct": 0,
            "why": "泳いで · 食べて · 帰りました (cuối tuần đã qua)."
          },
          {
            "q": "Chỉ đường: lên tàu điện rồi xuống ở Shinjuku.",
            "options": [
              "{電車|でんしゃ}に{乗|の}って、{新宿|しんじゅく}で{降|お}りてください。 (Densha ni notte, Shinjuku de orite kudasai.)",
              "{電車|でんしゃ}を{乗|の}って、{新宿|しんじゅく}で{降|お}りてください。 (Densha o notte, Shinjuku de orite kudasai.)",
              "{電車|でんしゃ}に{乗|の}りて、{新宿|しんじゅく}で{降|お}りてください。 (Densha ni norite, Shinjuku de orite kudasai.)",
              "{電車|でんしゃ}に{乗|の}って、{新宿|しんじゅく}に{降|お}りてください。 (Densha ni notte, Shinjuku ni orite kudasai.)"
            ],
            "correct": 0,
            "why": "に 乗って · で 降りて."
          },
          {
            "q": "Nhân viên thư viện hướng dẫn làm thẻ.",
            "options": [
              "ここに{住所|じゅうしょ}と{名前|なまえ}を{書|か}きて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。 (Koko ni juusho to namae o kakite, gaikokujintourokushou o misete kudasai.)",
              "ここに{住所|じゅうしょ}と{名前|なまえ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。 (Koko ni juusho to namae o kaite, gaikokujintourokushou o misete kudasai.)",
              "ここで{住所|じゅうしょ}と{名前|なまえ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}が{見|み}せてください。 (Koko de juusho to namae o kaite, gaikokujintourokushou ga misete kudasai.)",
              "ここに{住所|じゅうしょ}と{名前|なまえ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}てください。 (Koko ni juusho to namae o kaite, gaikokujintourokushou o mite kudasai.)"
            ],
            "correct": 1,
            "why": "書いて · を 見せて ください (見て = hãy nhìn)."
          },
          {
            "q": "Bạn hỏi bạn: một ngày học tiếng Nhật mấy tiếng.",
            "options": [
              "{一日|いちにち}で{何時|なんじ}{日本語|にほんご}を{勉強|べんきょう}しますか。 (Ichinichi de nanji Nihongo o benkyou shimasu ka.)",
              "{何時間|なんじかん}に{一日|いちにち}{日本語|にほんご}を{勉強|べんきょう}しますか。 (Nanjikan ni ichinichi Nihongo o benkyou shimasu ka.)",
              "{一日|いちにち}に{何回|なんかい}{日本語|にほんご}が{勉強|べんきょう}しますか。 (Ichinichi ni nankai Nihongo ga benkyou shimasu ka.)",
              "{一日|いちにち}に{何時間|なんじかん}{日本語|にほんご}を{勉強|べんきょう}しますか。 (Ichinichi ni nanjikan Nihongo o benkyou shimasu ka.)"
            ],
            "correct": 3,
            "why": "一日に 何時間."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "Chuỗi Vて: **thứ tự = thời gian**, chỉ động từ cuối mang thì. Thể て hay sai: 行って · 泳いで · 乗って · 遊んで · 書いて.",
          "[thời gian] **に** [số] V · Lần **回** · cốc **杯** · chai/cây **本** · quyển **冊**. どうやって → các bước Vて; xe **に 乗る**, **を 降りる**, nơi xuống **で**."
        ]
      }
    ]
  },
  {
    "id": "lt-b9-np-3",
    "kind": "homework",
    "title": "Luyện thêm Bài 9 · Ngữ pháp 3 (ポイント 85, 87) + TRỘN cả 7 điểm — いつも／よく／ときどき／あまり／全然 · でも (~89 câu)",
    "goal": "Nói mức độ thường xuyên đúng (あまり, 全然 + ～ません), dùng だけ đúng chỗ, nối hai câu trái ý bằng でも (đầu câu sau), rồi làm bài trộn cả 7 điểm ngữ pháp Bài 9.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thang tần suất từ NHIỀU → ÍT: **いつも → よく → ときどき → あまり～ません → 全然～ません**. Thấy **あまり** hoặc **全然** là phải chờ **～ません**.",
          "**でも** đứng **đầu câu thứ hai**, sau dấu chấm: 「好きです。**でも**、上手じゃありません。」 Muốn nối trong một câu thì dùng **～が、～** (Bài 4). Hai ý cùng chiều thì KHÔNG dùng でも (dùng そして／それから).",
          "**だけ** (chỉ) đứng ngay **sau** từ được giới hạn và thay cho を／が: コーヒー**だけ** 飲みます · 日曜日**だけ** 休みます."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**（N は）いつも／よく／ときどき V ます。** · **（N は）あまり／全然 V ません。** (ポイント 85)",
          "Hỏi: **よく ～ますか** → はい、よく／ときどき～ます · いいえ、あまり／全然～ません. Kết hợp ポイント 84: **一週間に 二回くらい です**.",
          "**Câu 1。でも、Câu 2。** — hai ý trái ngược (ポイント 87). Hay đi với **最近**: 前は よく しました。でも、最近 全然 しません。"
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · phó từ tần suất · でも"
      },
      {
        "t": "mcq",
        "id": "lt-b9-np3-85",
        "title": "ポイント 85: いつも／よく／ときどき／あまり／全然 (12 câu)",
        "items": [
          {
            "q": "{私|わたし}は＿＿{七時|しちじ}に{起|お}きます。　〔Watashi wa __ shichiji ni okimasu.〕　— Tôi luôn dậy lúc 7 giờ.",
            "options": [
              "いつも",
              "あまり",
              "{全然|ぜんぜん}",
              "だけ"
            ],
            "correct": 0,
            "why": "Câu khẳng định, luôn luôn → **いつも**. → **{私|わたし}はいつも{七時|しちじ}に{起|お}きます。** 〔Watashi wa itsumo shichiji ni okimasu.〕 — Tôi luôn dậy lúc 7 giờ."
          },
          {
            "q": "テレビをあまり＿＿。　〔Terebi o amari __.〕　— Tôi không xem TV mấy.",
            "options": [
              "{見|み}る",
              "{見|み}ません",
              "{見|み}たいです",
              "{見|み}ます"
            ],
            "correct": 1,
            "why": "あまり + **～ません**. → **テレビをあまり{見|み}ません。** 〔Terebi o amari mimasen.〕 — Tôi không xem TV mấy."
          },
          {
            "q": "{最近|さいきん}、{全然|ぜんぜん}＿＿。　〔Saikin, zenzen __.〕　— Dạo này tôi hoàn toàn không bơi.",
            "options": [
              "{泳|およ}ぎません",
              "{泳|およ}いでいます",
              "{泳|およ}ぐことです",
              "{泳|およ}ぎます"
            ],
            "correct": 0,
            "why": "全然 + **～ません**. → **{最近|さいきん}、{全然|ぜんぜん}{泳|およ}ぎません。** 〔Saikin, zenzen oyogimasen.〕 — Dạo này tôi hoàn toàn không bơi."
          },
          {
            "q": "よく{映画|えいが}を{見|み}ますか。——いいえ、＿＿{見|み}ません。　〔Yoku eiga o mimasu ka. — Iie, __ mimasen.〕　— Bạn có hay xem phim không? — Không, không xem mấy.",
            "options": [
              "ときどき",
              "よく",
              "いつも",
              "あまり"
            ],
            "correct": 3,
            "why": "Phủ định \"không mấy\" → **あまり**. → **よく{映画|えいが}を{見|み}ますか。——いいえ、あまり{見|み}ません。** 〔Yoku eiga o mimasu ka. — Iie, amari mimasen.〕 — Bạn có hay xem phim không? — Không, không xem mấy."
          },
          {
            "q": "{私|わたし}は＿＿{友達|ともだち}と{釣|つ}りをします。{一|いっ}か{月|げつ}に{一回|いっかい}くらいです。　〔Watashi wa __ tomodachi to tsuri o shimasu. Ikkagetsu ni ikkai kurai desu.〕　— Thỉnh thoảng tôi đi câu cá với bạn, khoảng tháng một lần.",
            "options": [
              "ときどき",
              "{全然|ぜんぜん}",
              "あまり",
              "いつも"
            ],
            "correct": 0,
            "why": "Tháng 1 lần → **ときどき** (thỉnh thoảng). → **{私|わたし}はときどき{友達|ともだち}と{釣|つ}りをします。{一|いっ}か{月|げつ}に{一回|いっかい}くらいです。** 〔Watashi wa tokidoki tomodachi to tsuri o shimasu. Ikkagetsu ni ikkai kurai desu.〕 — Thỉnh thoảng tôi đi câu cá với bạn, khoảng tháng một lần."
          },
          {
            "q": "{父|ちち}は＿＿コーヒーを{飲|の}みます。{一日|いちにち}に{五杯|ごはい}{飲|の}みます。　〔Chichi wa __ koohii o nomimasu. Ichinichi ni gohai nomimasu.〕　— Bố tôi hay uống cà phê. Một ngày uống năm cốc.",
            "options": [
              "だけ",
              "{全然|ぜんぜん}",
              "よく",
              "あまり"
            ],
            "correct": 2,
            "why": "Uống nhiều (5 cốc/ngày) → **よく**. → **{父|ちち}はよくコーヒーを{飲|の}みます。{一日|いちにち}に{五杯|ごはい}{飲|の}みます。** 〔Chichi wa yoku koohii o nomimasu. Ichinichi ni gohai nomimasu.〕 — Bố tôi hay uống cà phê. Một ngày uống năm cốc."
          },
          {
            "q": "お{酒|さけ}は{全然|ぜんぜん}＿＿。　〔Osake wa zenzen __.〕　— Tôi hoàn toàn không uống rượu.",
            "options": [
              "{飲|の}みます",
              "{飲|の}みたいです",
              "{飲|の}みません",
              "{飲|の}みましょう"
            ],
            "correct": 2,
            "why": "全然 + **～ません**. → **お{酒|さけ}は{全然|ぜんぜん}{飲|の}みません。** 〔Osake wa zenzen nomimasen.〕 — Tôi hoàn toàn không uống rượu."
          },
          {
            "q": "{私|わたし}は{日曜日|にちようび}＿＿{休|やす}みます。　〔Watashi wa nichiyoubi __ yasumimasu.〕　— Tôi chỉ nghỉ vào chủ nhật.",
            "options": [
              "{全然|ぜんぜん}",
              "あまり",
              "だけ",
              "よく"
            ],
            "correct": 2,
            "why": "Chỉ chủ nhật → **日曜日だけ**. → **{私|わたし}は{日曜日|にちようび}だけ{休|やす}みます。** 〔Watashi wa nichiyoubi dake yasumimasu.〕 — Tôi chỉ nghỉ vào chủ nhật."
          },
          {
            "q": "{肉|にく}は{食|た}べません。{野菜|やさい}＿＿{食|た}べます。　〔Niku wa tabemasen. Yasai __ tabemasu.〕　— Tôi không ăn thịt. Tôi chỉ ăn rau.",
            "options": [
              "いつも",
              "だけ",
              "よく",
              "ときどき"
            ],
            "correct": 1,
            "why": "だけ thay cho を: **野菜だけ** 食べます. → **{肉|にく}は{食|た}べません。{野菜|やさい}だけ{食|た}べます。** 〔Niku wa tabemasen. Yasai dake tabemasu.〕 — Tôi không ăn thịt. Tôi chỉ ăn rau."
          },
          {
            "q": "{漢字|かんじ}が＿＿わかりません。　〔Kanji ga __ wakarimasen.〕　— Tôi hoàn toàn không hiểu chữ Hán.",
            "options": [
              "たくさん",
              "{全然|ぜんぜん}",
              "{特|とく}に",
              "いつも"
            ],
            "correct": 1,
            "why": "Hoàn toàn không hiểu → **全然** ～ません. → **{漢字|かんじ}が{全然|ぜんぜん}わかりません。** 〔Kanji ga zenzen wakarimasen.〕 — Tôi hoàn toàn không hiểu chữ Hán."
          },
          {
            "q": "A：よく{料理|りょうり}をしますか。B：はい、＿＿します。　〔A: yoku ryouri o shimasu ka. B: hai, __ shimasu.〕　— A: Bạn có hay nấu ăn không? B: Có, tôi hay nấu.",
            "options": [
              "あまり",
              "{全然|ぜんぜん}",
              "だけ",
              "よく"
            ],
            "correct": 3,
            "why": "Trả lời \"có\" → **よく** します. → **A：よく{料理|りょうり}をしますか。B：はい、よくします。** 〔A: yoku ryouri o shimasu ka. B: hai, yoku shimasu.〕 — A: Bạn có hay nấu ăn không? B: Có, tôi hay nấu."
          },
          {
            "q": "Sắp xếp từ NHIỀU → ÍT:",
            "options": [
              "いつも → よく → ときどき → あまり → 全然",
              "ときどき → いつも → よく → 全然 → あまり",
              "いつも → ときどき → よく → あまり → 全然",
              "よく → いつも → ときどき → 全然 → あまり"
            ],
            "correct": 0,
            "why": "Thang chuẩn: **いつも > よく > ときどき > あまり(～ません) > 全然(～ません)**."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np3-87",
        "title": "ポイント 87: でも (8 câu)",
        "items": [
          {
            "q": "{私|わたし}の{趣味|しゅみ}はスポーツです。＿＿、{最近|さいきん}{全然|ぜんぜん}しません。　〔Watashi no shumi wa supootsu desu. __, saikin zenzen shimasen.〕　— Sở thích của tôi là thể thao. Nhưng dạo này tôi hoàn toàn không chơi.",
            "options": [
              "それから",
              "そして",
              "{特|とく}に",
              "でも"
            ],
            "correct": 3,
            "why": "Hai ý trái ngược → **でも**. → **{私|わたし}の{趣味|しゅみ}はスポーツです。でも、{最近|さいきん}{全然|ぜんぜん}しません。** 〔Watashi no shumi wa supootsu desu. Demo, saikin zenzen shimasen.〕 — Sở thích của tôi là thể thao. Nhưng dạo này tôi hoàn toàn không chơi."
          },
          {
            "q": "{日本語|にほんご}の{勉強|べんきょう}は{難|むずか}しいです。＿＿、{楽|たの}しいです。　〔Nihongo no benkyou wa muzukashii desu. __, tanoshii desu.〕　— Học tiếng Nhật khó. Nhưng vui.",
            "options": [
              "でも",
              "そして",
              "だけ",
              "それから"
            ],
            "correct": 0,
            "why": "Khó ↔ vui (trái chiều) → **でも**. → **{日本語|にほんご}の{勉強|べんきょう}は{難|むずか}しいです。でも、{楽|たの}しいです。** 〔Nihongo no benkyou wa muzukashii desu. Demo, tanoshii desu.〕 — Học tiếng Nhật khó. Nhưng vui."
          },
          {
            "q": "{映画|えいが}が{好|す}きです。＿＿、{本|ほん}も{好|す}きです。　〔Eiga ga suki desu. __, hon mo suki desu.〕　— Tôi thích phim. Và tôi cũng thích sách.",
            "options": [
              "でも",
              "そして",
              "だけ",
              "{全然|ぜんぜん}"
            ],
            "correct": 1,
            "why": "Hai ý cùng chiều → **そして**, không dùng でも. → **{映画|えいが}が{好|す}きです。そして、{本|ほん}も{好|す}きです。** 〔Eiga ga suki desu. Soshite, hon mo suki desu.〕 — Tôi thích phim. Và tôi cũng thích sách."
          },
          {
            "q": "{私|わたし}もコンサートに{行|い}きたいです。＿＿、チケットの{買|か}い{方|かた}がわかりません。　〔Watashi mo konsaato ni ikitai desu. __, chiketto no kaikata ga wakarimasen.〕　— Tôi cũng muốn đi hoà nhạc. Nhưng tôi không biết cách mua vé.",
            "options": [
              "それから",
              "そして",
              "でも",
              "{特|とく}に"
            ],
            "correct": 2,
            "why": "Muốn đi ↔ không biết mua vé → **でも**. → **{私|わたし}もコンサートに{行|い}きたいです。でも、チケットの{買|か}い{方|かた}がわかりません。** 〔Watashi mo konsaato ni ikitai desu. Demo, chiketto no kaikata ga wakarimasen.〕 — Tôi cũng muốn đi hoà nhạc. Nhưng tôi không biết cách mua vé."
          },
          {
            "q": "でも đặt ở đâu là ĐÚNG?",
            "options": [
              "{泳|およ}ぐことが{好|す}きです。でも、{上手|じょうず}じゃありません。 (Oyogu koto ga suki desu. Demo, jouzu ja arimasen.)",
              "でも{泳|およ}ぐことが{好|す}きです。{上手|じょうず}じゃありません。 (Demo oyogu koto ga suki desu. Jouzu ja arimasen.)",
              "{泳|およ}ぐことが{好|す}きですでも、{上手|じょうず}じゃありません。 (Oyogu koto ga suki desu demo, jouzu ja arimasen.)",
              "{泳|およ}ぐことが{好|す}き。{上手|じょうず}じゃありませんでも。 (Oyogu koto ga suki. Jouzu ja arimasen demo.)"
            ],
            "correct": 0,
            "why": "でも ở **đầu câu thứ hai**, sau dấu 。."
          },
          {
            "q": "{好|す}きです＿＿、{上手|じょうず}じゃありません。　〔Suki desu __, jouzu ja arimasen.〕　— Tôi thích nhưng không giỏi.",
            "options": [
              "から",
              "が",
              "そして",
              "でも"
            ],
            "correct": 1,
            "why": "Nối trong MỘT câu → **～が、～**. → **{好|す}きですが、{上手|じょうず}じゃありません。** 〔Suki desu ga, jouzu ja arimasen.〕 — Tôi thích nhưng không giỏi."
          },
          {
            "q": "{前|まえ}は{毎週|まいしゅう}{泳|およ}ぎました。＿＿、{最近|さいきん}は{全然|ぜんぜん}{泳|およ}ぎません。　〔Mae wa maishuu oyogimashita. __, saikin wa zenzen oyogimasen.〕　— Trước đây tuần nào tôi cũng bơi. Nhưng dạo này hoàn toàn không bơi.",
            "options": [
              "そして",
              "それから",
              "でも",
              "よく"
            ],
            "correct": 2,
            "why": "Trước ↔ bây giờ (trái ngược) → **でも**. → **{前|まえ}は{毎週|まいしゅう}{泳|およ}ぎました。でも、{最近|さいきん}は{全然|ぜんぜん}{泳|およ}ぎません。** 〔Mae wa maishuu oyogimashita. Demo, saikin wa zenzen oyogimasen.〕 — Trước đây tuần nào tôi cũng bơi. Nhưng dạo này hoàn toàn không bơi."
          },
          {
            "q": "{書道|しょどう}を{習|なら}っています。＿＿、まだ{上手|じょうず}に{書|か}くことができません。　〔Shodou o naratte imasu. __, mada jouzu ni kaku koto ga dekimasen.〕　— Tôi đang học thư pháp. Nhưng vẫn chưa viết đẹp được.",
            "options": [
              "でも",
              "いつも",
              "だけ",
              "そして"
            ],
            "correct": 0,
            "why": "Đang học ↔ chưa viết đẹp → **でも**. → **{書道|しょどう}を{習|なら}っています。でも、まだ{上手|じょうず}に{書|か}くことができません。** 〔Shodou o naratte imasu. Demo, mada jouzu ni kaku koto ga dekimasen.〕 — Tôi đang học thư pháp. Nhưng vẫn chưa viết đẹp được."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đọc bảng lịch · sửa câu sai · gõ · ghép"
      },
      {
        "t": "table",
        "head": [
          "Việc",
          "Bao lâu một lần"
        ],
        "rows": [
          [
            "Bơi",
            "mỗi ngày"
          ],
          [
            "Xem phim",
            "1 tuần 3 lần"
          ],
          [
            "Câu cá",
            "1 tháng 1 lần"
          ],
          [
            "Đọc sách",
            "hầu như không"
          ],
          [
            "Uống rượu",
            "không bao giờ"
          ],
          [
            "Hát karaoke",
            "chỉ thứ Bảy"
          ]
        ],
        "caption": "Lịch sinh hoạt của Marco (dùng cho 8 câu dưới đây)"
      },
      {
        "t": "mcq",
        "id": "lt-b9-np3-bang",
        "title": "Nhìn lịch của Marco rồi chọn câu trả lời (8 câu)",
        "items": [
          {
            "q": "マルコさんはよく{泳|およ}ぎますか。　〔Maruko-san wa yoku oyogimasu ka.〕",
            "options": [
              "いいえ、{全然|ぜんぜん}{泳|およ}ぎません。 (Iie, zenzen oyogimasen.)",
              "いいえ、あまり{泳|およ}ぎません。 (Iie, amari oyogimasen.)",
              "はい、ときどき{泳|およ}ぎます。 (Hai, tokidoki oyogimasu.)",
              "はい、いつも{泳|およ}ぎます。{毎日|まいにち}{泳|およ}ぎます。 (Hai, itsumo oyogimasu. Mainichi oyogimasu.)"
            ],
            "correct": 3,
            "why": "Mỗi ngày → いつも／毎日."
          },
          {
            "q": "{映画|えいが}はどうですか。　〔Eiga wa dou desu ka.〕",
            "options": [
              "ときどき{見|み}ます。{一|いっ}か{月|げつ}に{一回|いっかい}です。 (Tokidoki mimasu. Ikkagetsu ni ikkai desu.)",
              "{全然|ぜんぜん}{見|み}ません。 (Zenzen mimasen.)",
              "よく{見|み}ます。{一週間|いっしゅうかん}に{三回|さんかい}{見|み}ます。 (Yoku mimasu. Isshuukan ni sankai mimasu.)",
              "あまり{見|み}ません。 (Amari mimasen.)"
            ],
            "correct": 2,
            "why": "1 tuần 3 lần → よく."
          },
          {
            "q": "{釣|つ}りをよくしますか。　〔Tsuri o yoku shimasu ka.〕",
            "options": [
              "はい、いつもします。 (Hai, itsumo shimasu.)",
              "はい、{一週間|いっしゅうかん}に{三回|さんかい}します。 (Hai, isshuukan ni sankai shimasu.)",
              "いいえ、{全然|ぜんぜん}しません。 (Iie, zenzen shimasen.)",
              "いいえ、ときどきします。{一|いっ}か{月|げつ}に{一回|いっかい}くらいです。 (Iie, tokidoki shimasu. Ikkagetsu ni ikkai kurai desu.)"
            ],
            "correct": 3,
            "why": "Tháng 1 lần → ときどき."
          },
          {
            "q": "{本|ほん}をよく{読|よ}みますか。　〔Hon o yoku yomimasu ka.〕",
            "options": [
              "いいえ、あまり{読|よ}みます。 (Iie, amari yomimasu.)",
              "いいえ、あまり{読|よ}みません。 (Iie, amari yomimasen.)",
              "はい、{全然|ぜんぜん}{読|よ}みません。 (Hai, zenzen yomimasen.)",
              "はい、よく{読|よ}みます。 (Hai, yoku yomimasu.)"
            ],
            "correct": 1,
            "why": "Hầu như không → あまり ～ません."
          },
          {
            "q": "お{酒|さけ}を{飲|の}みますか。　〔Osake o nomimasu ka.〕",
            "options": [
              "いいえ、{全然|ぜんぜん}{飲|の}みます。 (Iie, zenzen nomimasu.)",
              "はい、よく{飲|の}みます。 (Hai, yoku nomimasu.)",
              "いいえ、{全然|ぜんぜん}{飲|の}みません。 (Iie, zenzen nomimasen.)",
              "はい、ときどき{飲|の}みます。 (Hai, tokidoki nomimasu.)"
            ],
            "correct": 2,
            "why": "Không bao giờ → 全然 ～ません."
          },
          {
            "q": "カラオケによく{行|い}きますか。　〔Karaoke ni yoku ikimasu ka.〕",
            "options": [
              "{土曜日|どようび}だけ{行|い}きます。 (Doyoubi dake ikimasu.)",
              "だけ{土曜日|どようび}{行|い}きます。 (Dake doyoubi ikimasu.)",
              "{土曜日|どようび}だけを{行|い}きます。 (Doyoubi dake o ikimasu.)",
              "{全然|ぜんぜん}{行|い}きます。 (Zenzen ikimasu.)"
            ],
            "correct": 0,
            "why": "Chỉ thứ Bảy → 土曜日だけ."
          },
          {
            "q": "{一週間|いっしゅうかん}に{何回|なんかい}{映画|えいが}を{見|み}ますか。　〔Isshuukan ni nankai eiga o mimasu ka.〕",
            "options": [
              "{三冊|さんさつ}{見|み}ます。 (Sansatsu mimasu.)",
              "{三杯|さんばい}{見|み}ます。 (Sanbai mimasu.)",
              "{三本|さんぼん}{見|み}ます。 (Sanbon mimasu.)",
              "{三回|さんかい}{見|み}ます。 (Sankai mimasu.)"
            ],
            "correct": 3,
            "why": "Số lần → 回."
          },
          {
            "q": "{一|いっ}か{月|げつ}に{何回|なんかい}{釣|つ}りをしますか。　〔Ikkagetsu ni nankai tsuri o shimasu ka.〕",
            "options": [
              "{一回|いちかい}くらいします。 (Ichikai kurai shimasu.)",
              "{一杯|いっぱい}くらいします。 (Ippai kurai shimasu.)",
              "いつもします。 (Itsumo shimasu.)",
              "{一回|いっかい}くらいします。 (Ikkai kurai shimasu.)"
            ],
            "correct": 3,
            "why": "1 lần = いっかい."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np3-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "テレビをあまり{見|み}ます。 (Terebi o amari mimasu.)",
              "テレビをあまり{見|み}ません。 (Terebi o amari mimasen.)",
              "テレビをときどき{見|み}ます。 (Terebi o tokidoki mimasu.)",
              "テレビをよく{見|み}ます。 (Terebi o yoku mimasu.)"
            ],
            "correct": 0,
            "why": "あまり + ～ません."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "お{酒|さけ}を{全然|ぜんぜん}{飲|の}みません。 (Osake o zenzen nomimasen.)",
              "お{酒|さけ}を{全然|ぜんぜん}{飲|の}みます。 (Osake o zenzen nomimasu.)",
              "お{酒|さけ}をあまり{飲|の}みません。 (Osake o amari nomimasen.)",
              "お{酒|さけ}をときどき{飲|の}みます。 (Osake o tokidoki nomimasu.)"
            ],
            "correct": 1,
            "why": "全然 + ～ません."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{好|す}きです。でも、{上手|じょうず}じゃありません。 (Suki desu. Demo, jouzu ja arimasen.)",
              "{好|す}きですが、{上手|じょうず}じゃありません。 (Suki desu ga, jouzu ja arimasen.)",
              "{上手|じょうず}じゃありません。でも、{好|す}きです。 (Jouzu ja arimasen. Demo, suki desu.)",
              "{好|す}きですでも、{上手|じょうず}じゃありません。 (Suki desu demo, jouzu ja arimasen.)"
            ],
            "correct": 3,
            "why": "でも đứng đầu câu sau (sau 。), không dính vào cuối câu trước."
          },
          {
            "q": "Câu nào SAI về nghĩa?",
            "options": [
              "{映画|えいが}が{好|す}きです。そして、よく{見|み}ます。 (Eiga ga suki desu. Soshite, yoku mimasu.)",
              "{映画|えいが}が{好|す}きです。でも、よく{見|み}ます。 (Eiga ga suki desu. Demo, yoku mimasu.)",
              "{映画|えいが}が{好|す}きです。でも、{最近|さいきん}{全然|ぜんぜん}{見|み}ません。 (Eiga ga suki desu. Demo, saikin zenzen mimasen.)",
              "{映画|えいが}が{好|す}きです。{特|とく}にアクション{映画|えいが}が{好|す}きです。 (Eiga ga suki desu. Tokuni akushon eiga ga suki desu.)"
            ],
            "correct": 1,
            "why": "Thích → hay xem: cùng chiều, không dùng でも."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "だけコーヒーを{飲|の}みます。 (Dake koohii o nomimasu.)",
              "{日曜日|にちようび}だけ{休|やす}みます。 (Nichiyoubi dake yasumimasu.)",
              "コーヒーだけ{飲|の}みます。 (Koohii dake nomimasu.)",
              "{一冊|いっさつ}だけ{読|よ}みました。 (Issatsu dake yomimashita.)"
            ],
            "correct": 0,
            "why": "だけ đứng SAU từ được giới hạn."
          },
          {
            "q": "Câu nào SAI về nghĩa?",
            "options": [
              "{日本語|にほんご}は{難|むずか}しいですが、おもしろいです。 (Nihongo wa muzukashii desu ga, omoshiroi desu.)",
              "{日本語|にほんご}は{難|むずか}しいです。でも、{大変|たいへん}です。 (Nihongo wa muzukashii desu. Demo, taihen desu.)",
              "{日本語|にほんご}は{難|むずか}しいです。でも、おもしろいです。 (Nihongo wa muzukashii desu. Demo, omoshiroi desu.)",
              "{日本語|にほんご}はおもしろいです。そして、{楽|たの}しいです。 (Nihongo wa omoshiroi desu. Soshite, tanoshii desu.)"
            ],
            "correct": 1,
            "why": "Khó ↔ vất vả: cùng chiều → không dùng でも."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{昨日|きのう}はあまり{寝|ね}ませんでした。 (Kinou wa amari nemasendeshita.)",
              "{昨日|きのう}は{全然|ぜんぜん}{寝|ね}ませんでした。 (Kinou wa zenzen nemasendeshita.)",
              "{昨日|きのう}はよく{寝|ね}ました。 (Kinou wa yoku nemashita.)",
              "{昨日|きのう}はあまり{寝|ね}ました。 (Kinou wa amari nemashita.)"
            ],
            "correct": 3,
            "why": "あまり + phủ định (quá khứ: ～ませんでした)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "いつも{全然|ぜんぜん}{泳|およ}ぎません。 (Itsumo zenzen oyogimasen.)",
              "いつも{朝|あさ}{泳|およ}ぎます。 (Itsumo asa oyogimasu.)",
              "ときどき{泳|およ}ぎます。 (Tokidoki oyogimasu.)",
              "{最近|さいきん}、{全然|ぜんぜん}{泳|およ}ぎません。 (Saikin, zenzen oyogimasen.)"
            ],
            "correct": 0,
            "why": "Không dùng hai phó từ tần suất trái nghĩa cùng lúc (いつも + 全然)."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-np3-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 85, 87",
        "items": [
          {
            "q": "Tôi luôn dậy lúc 6 giờ.",
            "answers": [
              "いつも六時に起きます。",
              "いつも六時におきます。",
              "いつもろくじに起きます。",
              "いつもろくじにおきます。",
              "私はいつも六時に起きます。",
              "私はいつも六時におきます。",
              "私はいつもろくじに起きます。",
              "私はいつもろくじにおきます。",
              "わたしはいつも六時に起きます。",
              "わたしはいつも六時におきます。",
              "わたしはいつもろくじに起きます。",
              "わたしはいつもろくじにおきます。"
            ],
            "hint": "いつも"
          },
          {
            "q": "Tôi không xem TV mấy.",
            "answers": [
              "テレビをあまり見ません。",
              "テレビをあまりみません。",
              "あまりテレビを見ません。",
              "あまりテレビをみません。"
            ],
            "hint": "あまり ～ません"
          },
          {
            "q": "Tôi hoàn toàn không uống rượu.",
            "answers": [
              "お酒を全然飲みません。",
              "お酒を全然のみません。",
              "お酒をぜんぜん飲みません。",
              "お酒をぜんぜんのみません。",
              "おさけを全然飲みません。",
              "おさけを全然のみません。",
              "おさけをぜんぜん飲みません。",
              "おさけをぜんぜんのみません。",
              "全然お酒を飲みません。",
              "全然お酒をのみません。",
              "全然おさけを飲みません。",
              "全然おさけをのみません。",
              "ぜんぜんお酒を飲みません。",
              "ぜんぜんお酒をのみません。",
              "ぜんぜんおさけを飲みません。",
              "ぜんぜんおさけをのみません。",
              "お酒は全然飲みません。",
              "お酒は全然のみません。",
              "お酒はぜんぜん飲みません。",
              "お酒はぜんぜんのみません。",
              "おさけは全然飲みません。",
              "おさけは全然のみません。",
              "おさけはぜんぜん飲みません。",
              "おさけはぜんぜんのみません。"
            ],
            "hint": "全然 ～ません"
          },
          {
            "q": "Thỉnh thoảng tôi đi câu cá.",
            "answers": [
              "ときどき釣りをします。",
              "ときどきつりをします。",
              "ときどき釣りに行きます。",
              "ときどき釣りにいきます。",
              "ときどきつりに行きます。",
              "ときどきつりにいきます。"
            ],
            "hint": "ときどき"
          },
          {
            "q": "Tôi chỉ nghỉ chủ nhật.",
            "answers": [
              "日曜日だけ休みます。",
              "日曜日だけやすみます。",
              "にちようびだけ休みます。",
              "にちようびだけやすみます。",
              "日曜日だけ休みです。",
              "日曜日だけやすみです。",
              "にちようびだけ休みです。",
              "にちようびだけやすみです。"
            ],
            "hint": "N だけ"
          },
          {
            "q": "Tôi thích thể thao. Nhưng dạo này hoàn toàn không chơi.",
            "answers": [
              "スポーツが好きです。でも、最近全然しません。",
              "スポーツが好きです。でも、最近ぜんぜんしません。",
              "スポーツが好きです。でも、さいきん全然しません。",
              "スポーツが好きです。でも、さいきんぜんぜんしません。",
              "スポーツがすきです。でも、最近全然しません。",
              "スポーツがすきです。でも、最近ぜんぜんしません。",
              "スポーツがすきです。でも、さいきん全然しません。",
              "スポーツがすきです。でも、さいきんぜんぜんしません。",
              "私はスポーツが好きです。でも、最近全然しません。",
              "私はスポーツが好きです。でも、最近ぜんぜんしません。",
              "私はスポーツが好きです。でも、さいきん全然しません。",
              "私はスポーツが好きです。でも、さいきんぜんぜんしません。",
              "私はスポーツがすきです。でも、最近全然しません。",
              "私はスポーツがすきです。でも、最近ぜんぜんしません。",
              "私はスポーツがすきです。でも、さいきん全然しません。",
              "私はスポーツがすきです。でも、さいきんぜんぜんしません。",
              "わたしはスポーツが好きです。でも、最近全然しません。",
              "わたしはスポーツが好きです。でも、最近ぜんぜんしません。",
              "わたしはスポーツが好きです。でも、さいきん全然しません。",
              "わたしはスポーツが好きです。でも、さいきんぜんぜんしません。",
              "わたしはスポーツがすきです。でも、最近全然しません。",
              "わたしはスポーツがすきです。でも、最近ぜんぜんしません。",
              "わたしはスポーツがすきです。でも、さいきん全然しません。",
              "わたしはスポーツがすきです。でも、さいきんぜんぜんしません。"
            ],
            "hint": "でも"
          },
          {
            "q": "Bạn có hay đi xem hoà nhạc không?",
            "answers": [
              "よくコンサートに行きますか。",
              "よくコンサートにいきますか。",
              "コンサートによく行きますか。",
              "コンサートによくいきますか。"
            ],
            "hint": "よく ～ますか"
          },
          {
            "q": "Tôi đặc biệt thích nhạc cổ điển.",
            "answers": [
              "特にクラシックが好きです。",
              "特にクラシックがすきです。",
              "とくにクラシックが好きです。",
              "とくにクラシックがすきです。"
            ],
            "hint": "特に"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-np3-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Tôi không đọc tiểu thuyết mấy.",
            "chips": [
              "{私|わたし}は",
              "{読|よ}みません",
              "{読|よ}みます",
              "あまり",
              "{小説|しょうせつ}を"
            ],
            "answer": [
              "{私|わたし}は",
              "{小説|しょうせつ}を",
              "あまり",
              "{読|よ}みません"
            ],
            "ro": "Watashi wa shousetsu o amari yomimasen",
            "alt": [
              [
                "{私|わたし}は",
                "あまり",
                "{小説|しょうせつ}を",
                "{読|よ}みません"
              ]
            ]
          },
          {
            "vi": "Thỉnh thoảng tôi vẽ tranh ở công viên.",
            "chips": [
              "{描|か}きます",
              "{公園|こうえん}に",
              "ときどき",
              "{絵|え}を",
              "{公園|こうえん}で"
            ],
            "answer": [
              "ときどき",
              "{公園|こうえん}で",
              "{絵|え}を",
              "{描|か}きます"
            ],
            "ro": "Tokidoki kouen de e o kakimasu"
          },
          {
            "vi": "Tôi thích bơi. Nhưng tôi bơi không giỏi.",
            "chips": [
              "{泳|およ}ぐことが{好|す}きです。",
              "{上手|じょうず}じゃありません",
              "そして、",
              "でも、"
            ],
            "answer": [
              "{泳|およ}ぐことが{好|す}きです。",
              "でも、",
              "{上手|じょうず}じゃありません"
            ],
            "ro": "Oyogu koto ga suki desu. Demo, jouzu ja arimasen"
          },
          {
            "vi": "Tôi chỉ uống cà phê.",
            "chips": [
              "コーヒー",
              "だけ",
              "{飲|の}みます",
              "あまり"
            ],
            "answer": [
              "コーヒー",
              "だけ",
              "{飲|の}みます"
            ],
            "ro": "Koohii dake nomimasu"
          },
          {
            "vi": "Tôi luôn đi tàu điện đến trường.",
            "chips": [
              "{電車|でんしゃ}に{乗|の}って",
              "いつも",
              "{行|い}きます",
              "{学校|がっこう}へ",
              "{電車|でんしゃ}を"
            ],
            "answer": [
              "いつも",
              "{電車|でんしゃ}に{乗|の}って",
              "{学校|がっこう}へ",
              "{行|い}きます"
            ],
            "ro": "Itsumo densha ni notte gakkou e ikimasu"
          },
          {
            "vi": "Dạo này tôi hoàn toàn không đi karaoke.",
            "chips": [
              "カラオケに",
              "{行|い}きます",
              "{最近|さいきん}、",
              "{全然|ぜんぜん}",
              "{行|い}きません"
            ],
            "answer": [
              "{最近|さいきん}、",
              "{全然|ぜんぜん}",
              "カラオケに",
              "{行|い}きません"
            ],
            "ro": "Saikin, zenzen karaoke ni ikimasen",
            "alt": [
              [
                "{最近|さいきん}、",
                "カラオケに",
                "{全然|ぜんぜん}",
                "{行|い}きません"
              ]
            ]
          },
          {
            "vi": "Đặc biệt là tôi thích món Ý.",
            "chips": [
              "{好|す}きです",
              "{特|とく}に",
              "イタリア{料理|りょうり}が",
              "を"
            ],
            "answer": [
              "{特|とく}に",
              "イタリア{料理|りょうり}が",
              "{好|す}きです"
            ],
            "ro": "Tokuni Itaria-ryouri ga suki desu"
          },
          {
            "vi": "Tôi đang học tiếng Nhật. Nhưng vẫn chưa nói giỏi được.",
            "chips": [
              "そして、",
              "{日本語|にほんご}を{勉強|べんきょう}しています。",
              "でも、",
              "できません",
              "まだ{上手|じょうず}に{話|はな}すことが"
            ],
            "answer": [
              "{日本語|にほんご}を{勉強|べんきょう}しています。",
              "でも、",
              "まだ{上手|じょうず}に{話|はな}すことが",
              "できません"
            ],
            "ro": "Nihongo o benkyou shite imasu. Demo, mada jouzu ni hanasu koto ga dekimasen"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · TRỘN cả 7 điểm · dịch · nhiều ô trống · tình huống"
      },
      {
        "t": "mcq",
        "id": "lt-b9-np3-tron",
        "title": "TRỘN ポイント 81–87 (16 câu)",
        "items": [
          {
            "q": "{私|わたし}の{趣味|しゅみ}は{切手|きって}を＿＿ことです。　〔Watashi no shumi wa kitte o __ koto desu.〕　— Sở thích của tôi là sưu tầm tem.",
            "options": [
              "{集|あつ}めます",
              "{集|あつ}めて",
              "{集|あつ}む",
              "{集|あつ}める"
            ],
            "correct": 3,
            "why": "(81) Trước こと → thể từ điển. → **{私|わたし}の{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。** 〔Watashi no shumi wa kitte o atsumeru koto desu.〕 — Sở thích của tôi là sưu tầm tem."
          },
          {
            "q": "{私|わたし}はスキー＿＿できます。　〔Watashi wa sukii __ dekimasu.〕　— Tôi trượt tuyết được.",
            "options": [
              "が",
              "に",
              "で",
              "を"
            ],
            "correct": 0,
            "why": "(82) N が できます. → **{私|わたし}はスキーができます。** 〔Watashi wa sukii ga dekimasu.〕 — Tôi trượt tuyết được."
          },
          {
            "q": "{朝|あさ}{起|お}きて、＿＿、{会社|かいしゃ}へ{行|い}きます。　〔Asa okite, __, kaisha e ikimasu.〕　— Sáng tôi dậy, đi bơi rồi đến công ty.",
            "options": [
              "{泳|およ}いて",
              "{泳|およ}ぐ",
              "{泳|およ}ぎて",
              "{泳|およ}いで"
            ],
            "correct": 3,
            "why": "(83) 泳ぎます → 泳いで. → **{朝|あさ}{起|お}きて、{泳|およ}いで、{会社|かいしゃ}へ{行|い}きます。** 〔Asa okite, oyoide, kaisha e ikimasu.〕 — Sáng tôi dậy, đi bơi rồi đến công ty."
          },
          {
            "q": "{一週間|いっしゅうかん}＿＿{三回|さんかい}ダンスを{習|なら}います。　〔Isshuukan __ sankai dansu o naraimasu.〕　— Một tuần tôi học nhảy ba buổi.",
            "options": [
              "に",
              "で",
              "を",
              "が"
            ],
            "correct": 0,
            "why": "(84) Khoảng thời gian + に. → **{一週間|いっしゅうかん}に{三回|さんかい}ダンスを{習|なら}います。** 〔Isshuukan ni sankai dansu o naraimasu.〕 — Một tuần tôi học nhảy ba buổi."
          },
          {
            "q": "{最近|さいきん}、{本|ほん}をあまり＿＿。　〔Saikin, hon o amari __.〕　— Dạo này tôi không đọc sách mấy.",
            "options": [
              "{読|よ}む",
              "{読|よ}みます",
              "{読|よ}んで",
              "{読|よ}みません"
            ],
            "correct": 3,
            "why": "(85) あまり + ～ません. → **{最近|さいきん}、{本|ほん}をあまり{読|よ}みません。** 〔Saikin, hon o amari yomimasen.〕 — Dạo này tôi không đọc sách mấy."
          },
          {
            "q": "＿＿{駅|えき}へ{行|い}きますか。——バスに{乗|の}って{行|い}きます。　〔__ eki e ikimasu ka. — Basu ni notte ikimasu.〕　— Đi đến ga bằng cách nào? — Đi xe buýt.",
            "options": [
              "どこ",
              "いつ",
              "どうして",
              "どうやって"
            ],
            "correct": 3,
            "why": "(86) Hỏi cách đi → どうやって. → **どうやって{駅|えき}へ{行|い}きますか。——バスに{乗|の}って{行|い}きます。** 〔Douyatte eki e ikimasu ka. — Basu ni notte ikimasu.〕 — Đi đến ga bằng cách nào? — Đi xe buýt."
          },
          {
            "q": "テニスが{好|す}きです。＿＿、{上手|じょうず}じゃありません。　〔Tenisu ga suki desu. __, jouzu ja arimasen.〕　— Tôi thích tennis. Nhưng không giỏi.",
            "options": [
              "でも",
              "だけ",
              "それから",
              "そして"
            ],
            "correct": 0,
            "why": "(87) Trái ý → でも. → **テニスが{好|す}きです。でも、{上手|じょうず}じゃありません。** 〔Tenisu ga suki desu. Demo, jouzu ja arimasen.〕 — Tôi thích tennis. Nhưng không giỏi."
          },
          {
            "q": "{一日|いちにち}にコーヒーを＿＿{飲|の}みます。　〔Ichinichi ni koohii o __ nomimasu.〕　— Một ngày tôi uống hai cốc cà phê.",
            "options": [
              "{二本|にほん}",
              "{二杯|にはい}",
              "{二匹|にひき}",
              "{二冊|にさつ}"
            ],
            "correct": 1,
            "why": "(84) Cốc → 杯. → **{一日|いちにち}にコーヒーを{二杯|にはい}{飲|の}みます。** 〔Ichinichi ni koohii o nihai nomimasu.〕 — Một ngày tôi uống hai cốc cà phê."
          },
          {
            "q": "{妹|いもうと}は{上手|じょうず}＿＿{絵|え}を{描|か}くことができます。　〔Imouto wa jouzu __ e o kaku koto ga dekimasu.〕　— Em gái tôi vẽ tranh giỏi.",
            "options": [
              "に",
              "が",
              "な",
              "で"
            ],
            "correct": 0,
            "why": "(82) 上手に + V. → **{妹|いもうと}は{上手|じょうず}に{絵|え}を{描|か}くことができます。** 〔Imouto wa jouzu ni e o kaku koto ga dekimasu.〕 — Em gái tôi vẽ tranh giỏi."
          },
          {
            "q": "{昨日|きのう}、{友達|ともだち}に{会|あ}って、カラオケで{歌|うた}って、＿＿。　〔Kinou, tomodachi ni atte, karaoke de utatte, __.〕　— Hôm qua tôi gặp bạn, hát karaoke rồi về.",
            "options": [
              "{帰|かえ}って",
              "{帰|かえ}る",
              "{帰|かえ}ります",
              "{帰|かえ}りました"
            ],
            "correct": 3,
            "why": "(83) Hôm qua → động từ cuối ました. → **{昨日|きのう}、{友達|ともだち}に{会|あ}って、カラオケで{歌|うた}って、{帰|かえ}りました。** 〔Kinou, tomodachi ni atte, karaoke de utatte, kaerimashita.〕 — Hôm qua tôi gặp bạn, hát karaoke rồi về."
          },
          {
            "q": "バスを＿＿、{少|すこ}し{歩|ある}きます。　〔Basu o __, sukoshi arukimasu.〕　— Xuống xe buýt rồi đi bộ một chút.",
            "options": [
              "{降|お}りて",
              "{乗|の}って",
              "{降|お}りって",
              "{降|お}りで"
            ],
            "correct": 0,
            "why": "(83, 86) を 降ります → 降りて. → **バスを{降|お}りて、{少|すこ}し{歩|ある}きます。** 〔Basu o orite, sukoshi arukimasu.〕 — Xuống xe buýt rồi đi bộ một chút."
          },
          {
            "q": "{趣味|しゅみ}は{音楽|おんがく}です。＿＿ポップスが{好|す}きです。　〔Shumi wa ongaku desu. __ poppusu ga suki desu.〕　— Sở thích là âm nhạc. Đặc biệt là nhạc pop.",
            "options": [
              "でも",
              "{特|とく}に",
              "あまり",
              "{全然|ぜんぜん}"
            ],
            "correct": 1,
            "why": "(từ vựng) 特に = đặc biệt là. → **{趣味|しゅみ}は{音楽|おんがく}です。{特|とく}にポップスが{好|す}きです。** 〔Shumi wa ongaku desu. Tokuni poppusu ga suki desu.〕 — Sở thích là âm nhạc. Đặc biệt là nhạc pop."
          },
          {
            "q": "{私|わたし}は{料理|りょうり}を{作|つく}ることが＿＿。　〔Watashi wa ryouri o tsukuru koto ga __.〕　— Tôi không nấu ăn được.",
            "options": [
              "できません",
              "ありません",
              "いません",
              "しません"
            ],
            "correct": 0,
            "why": "(82) V こと が できません. → **{私|わたし}は{料理|りょうり}を{作|つく}ることができません。** 〔Watashi wa ryouri o tsukuru koto ga dekimasen.〕 — Tôi không nấu ăn được."
          },
          {
            "q": "{一|いっ}か{月|げつ}に{小説|しょうせつ}を＿＿くらい{読|よ}みます。　〔Ikkagetsu ni shousetsu o __ kurai yomimasu.〕　— Một tháng tôi đọc khoảng ba quyển tiểu thuyết.",
            "options": [
              "{三回|さんかい}",
              "{三杯|さんばい}",
              "{三本|さんぼん}",
              "{三冊|さんさつ}"
            ],
            "correct": 3,
            "why": "(84) Tiểu thuyết → 冊. → **{一|いっ}か{月|げつ}に{小説|しょうせつ}を{三冊|さんさつ}くらい{読|よ}みます。** 〔Ikkagetsu ni shousetsu o sansatsu kurai yomimasu.〕 — Một tháng tôi đọc khoảng ba quyển tiểu thuyết."
          },
          {
            "q": "{前|まえ}はよく{泳|およ}ぎました。でも、{最近|さいきん}は＿＿{泳|およ}ぎません。　〔Mae wa yoku oyogimashita. Demo, saikin wa __ oyogimasen.〕　— Trước đây tôi hay bơi. Nhưng dạo này hoàn toàn không bơi.",
            "options": [
              "いつも",
              "よく",
              "{特|とく}に",
              "{全然|ぜんぜん}"
            ],
            "correct": 3,
            "why": "(85, 87) でも + 全然 ～ません. → **{前|まえ}はよく{泳|およ}ぎました。でも、{最近|さいきん}は{全然|ぜんぜん}{泳|およ}ぎません。** 〔Mae wa yoku oyogimashita. Demo, saikin wa zenzen oyogimasen.〕 — Trước đây tôi hay bơi. Nhưng dạo này hoàn toàn không bơi."
          },
          {
            "q": "{受付|うけつけ}で{名前|なまえ}を{言|い}って、カードを＿＿ください。　〔Uketsuke de namae o itte, kaado o __ kudasai.〕　— Hãy nói tên ở quầy rồi cho xem thẻ.",
            "options": [
              "{見|み}せて",
              "{見|み}せる",
              "{見|み}せって",
              "{見|み}て"
            ],
            "correct": 0,
            "why": "(86) 見せます → 見せて. → **{受付|うけつけ}で{名前|なまえ}を{言|い}って、カードを{見|み}せてください。** 〔Uketsuke de namae o itte, kaado o misete kudasai.〕 — Hãy nói tên ở quầy rồi cho xem thẻ."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-np3-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 81–87",
        "items": [
          {
            "q": "Sở thích của tôi là chơi guitar. Nhưng tôi chơi không giỏi.",
            "answers": [
              "私の趣味はギターを弾くことです。でも、上手じゃありません。",
              "私の趣味はギターを弾くことです。でも、じょうずじゃありません。",
              "私の趣味はギターをひくことです。でも、上手じゃありません。",
              "私の趣味はギターをひくことです。でも、じょうずじゃありません。",
              "私のしゅみはギターを弾くことです。でも、上手じゃありません。",
              "私のしゅみはギターを弾くことです。でも、じょうずじゃありません。",
              "私のしゅみはギターをひくことです。でも、上手じゃありません。",
              "私のしゅみはギターをひくことです。でも、じょうずじゃありません。",
              "わたしの趣味はギターを弾くことです。でも、上手じゃありません。",
              "わたしの趣味はギターを弾くことです。でも、じょうずじゃありません。",
              "わたしの趣味はギターをひくことです。でも、上手じゃありません。",
              "わたしの趣味はギターをひくことです。でも、じょうずじゃありません。",
              "わたしのしゅみはギターを弾くことです。でも、上手じゃありません。",
              "わたしのしゅみはギターを弾くことです。でも、じょうずじゃありません。",
              "わたしのしゅみはギターをひくことです。でも、上手じゃありません。",
              "わたしのしゅみはギターをひくことです。でも、じょうずじゃありません。",
              "趣味はギターを弾くことです。でも、上手じゃありません。",
              "趣味はギターを弾くことです。でも、じょうずじゃありません。",
              "趣味はギターをひくことです。でも、上手じゃありません。",
              "趣味はギターをひくことです。でも、じょうずじゃありません。",
              "しゅみはギターを弾くことです。でも、上手じゃありません。",
              "しゅみはギターを弾くことです。でも、じょうずじゃありません。",
              "しゅみはギターをひくことです。でも、上手じゃありません。",
              "しゅみはギターをひくことです。でも、じょうずじゃありません。"
            ],
            "hint": "81 · 87"
          },
          {
            "q": "Một tuần tôi đi bể bơi ba lần.",
            "answers": [
              "一週間に三回プールへ行きます。",
              "一週間に三回プールへいきます。",
              "一週間にさんかいプールへ行きます。",
              "一週間にさんかいプールへいきます。",
              "いっしゅうかんに三回プールへ行きます。",
              "いっしゅうかんに三回プールへいきます。",
              "いっしゅうかんにさんかいプールへ行きます。",
              "いっしゅうかんにさんかいプールへいきます。",
              "一週間に三回プールに行きます。",
              "一週間に三回プールにいきます。",
              "一週間にさんかいプールに行きます。",
              "一週間にさんかいプールにいきます。",
              "いっしゅうかんに三回プールに行きます。",
              "いっしゅうかんに三回プールにいきます。",
              "いっしゅうかんにさんかいプールに行きます。",
              "いっしゅうかんにさんかいプールにいきます。",
              "一週間にプールへ三回行きます。",
              "一週間にプールへ三回いきます。",
              "一週間にプールへさんかい行きます。",
              "一週間にプールへさんかいいきます。",
              "いっしゅうかんにプールへ三回行きます。",
              "いっしゅうかんにプールへ三回いきます。",
              "いっしゅうかんにプールへさんかい行きます。",
              "いっしゅうかんにプールへさんかいいきます。"
            ],
            "hint": "84"
          },
          {
            "q": "Dạo này tôi hoàn toàn không xem phim.",
            "answers": [
              "最近、全然映画を見ません。",
              "最近、全然映画をみません。",
              "最近、全然えいがを見ません。",
              "最近、全然えいがをみません。",
              "最近、ぜんぜん映画を見ません。",
              "最近、ぜんぜん映画をみません。",
              "最近、ぜんぜんえいがを見ません。",
              "最近、ぜんぜんえいがをみません。",
              "さいきん、全然映画を見ません。",
              "さいきん、全然映画をみません。",
              "さいきん、全然えいがを見ません。",
              "さいきん、全然えいがをみません。",
              "さいきん、ぜんぜん映画を見ません。",
              "さいきん、ぜんぜん映画をみません。",
              "さいきん、ぜんぜんえいがを見ません。",
              "さいきん、ぜんぜんえいがをみません。",
              "最近、映画を全然見ません。",
              "最近、映画を全然みません。",
              "最近、映画をぜんぜん見ません。",
              "最近、映画をぜんぜんみません。",
              "最近、えいがを全然見ません。",
              "最近、えいがを全然みません。",
              "最近、えいがをぜんぜん見ません。",
              "最近、えいがをぜんぜんみません。",
              "さいきん、映画を全然見ません。",
              "さいきん、映画を全然みません。",
              "さいきん、映画をぜんぜん見ません。",
              "さいきん、映画をぜんぜんみません。",
              "さいきん、えいがを全然見ません。",
              "さいきん、えいがを全然みません。",
              "さいきん、えいがをぜんぜん見ません。",
              "さいきん、えいがをぜんぜんみません。"
            ],
            "hint": "85"
          },
          {
            "q": "Bạn có biết bơi không? — Có, tôi bơi được một chút.",
            "answers": [
              "泳ぐことができますか。はい、少しできます。",
              "泳ぐことができますか。はい、すこしできます。",
              "およぐことができますか。はい、少しできます。",
              "およぐことができますか。はい、すこしできます。",
              "泳ぐことができますか。はい、少し泳ぐことができます。",
              "泳ぐことができますか。はい、少しおよぐことができます。",
              "泳ぐことができますか。はい、すこし泳ぐことができます。",
              "泳ぐことができますか。はい、すこしおよぐことができます。",
              "およぐことができますか。はい、少し泳ぐことができます。",
              "およぐことができますか。はい、少しおよぐことができます。",
              "およぐことができますか。はい、すこし泳ぐことができます。",
              "およぐことができますか。はい、すこしおよぐことができます。"
            ],
            "hint": "82"
          },
          {
            "q": "Thứ Bảy tôi đến lớp nấu ăn, học món Nhật rồi về.",
            "answers": [
              "土曜日、料理教室へ行って、日本の料理を習って、帰ります。",
              "どようび、りょうりきょうしつへいって、にほんのりょうりをならって、かえります。",
              "どようび、料理教室へ行って、日本の料理を習って、帰ります。",
              "土曜日、りょうりきょうしつへいって、にほんのりょうりをならって、かえります。",
              "土曜日、りょうり教室へ行って、日本の料理を習って、帰ります。",
              "どようび、料理きょうしつへいって、にほんのりょうりをならって、かえります。",
              "土曜日、料理きょうしつへ行って、日本の料理を習って、帰ります。",
              "どようび、りょうり教室へいって、にほんのりょうりをならって、かえります。",
              "土曜日、料理教室へいって、日本の料理を習って、帰ります。",
              "どようび、りょうりきょうしつへ行って、にほんのりょうりをならって、かえります。",
              "土曜日、料理教室へ行って、にほんの料理を習って、帰ります。",
              "どようび、りょうりきょうしつへいって、日本のりょうりをならって、かえります。",
              "土曜日、料理教室へ行って、日本のりょうりを習って、帰ります。",
              "どようび、りょうりきょうしつへいって、にほんの料理をならって、かえります。",
              "土曜日、料理教室へ行って、日本の料理をならって、帰ります。",
              "どようび、りょうりきょうしつへいって、にほんのりょうりを習って、かえります。",
              "土曜日、料理教室へ行って、日本の料理を習って、かえります。",
              "どようび、りょうりきょうしつへいって、にほんのりょうりをならって、帰ります。",
              "土曜日に料理教室へ行って、日本の料理を習って、帰ります。",
              "どようびにりょうりきょうしつへいって、にほんのりょうりをならって、かえります。",
              "どようびに料理教室へ行って、日本の料理を習って、帰ります。",
              "土曜日にりょうりきょうしつへいって、にほんのりょうりをならって、かえります。",
              "土曜日にりょうり教室へ行って、日本の料理を習って、帰ります。",
              "どようびに料理きょうしつへいって、にほんのりょうりをならって、かえります。",
              "土曜日に料理きょうしつへ行って、日本の料理を習って、帰ります。",
              "どようびにりょうり教室へいって、にほんのりょうりをならって、かえります。",
              "土曜日に料理教室へいって、日本の料理を習って、帰ります。",
              "どようびにりょうりきょうしつへ行って、にほんのりょうりをならって、かえります。",
              "土曜日に料理教室へ行って、にほんの料理を習って、帰ります。",
              "どようびにりょうりきょうしつへいって、日本のりょうりをならって、かえります。",
              "土曜日に料理教室へ行って、日本のりょうりを習って、帰ります。",
              "どようびにりょうりきょうしつへいって、にほんの料理をならって、かえります。",
              "土曜日に料理教室へ行って、日本の料理をならって、帰ります。",
              "どようびにりょうりきょうしつへいって、にほんのりょうりを習って、かえります。",
              "土曜日に料理教室へ行って、日本の料理を習って、かえります。",
              "どようびにりょうりきょうしつへいって、にほんのりょうりをならって、帰ります。"
            ],
            "hint": "83"
          },
          {
            "q": "Tôi chỉ uống trà.",
            "answers": [
              "お茶だけ飲みます。",
              "お茶だけのみます。",
              "おちゃだけ飲みます。",
              "おちゃだけのみます。"
            ],
            "hint": "だけ"
          },
          {
            "q": "Đến thư viện bằng cách nào? — Đi xe đạp.",
            "answers": [
              "どうやって図書館へ行きますか。自転車で行きます。",
              "どうやって図書館へ行きますか。自転車でいきます。",
              "どうやって図書館へ行きますか。じてんしゃで行きます。",
              "どうやって図書館へ行きますか。じてんしゃでいきます。",
              "どうやって図書館へいきますか。自転車で行きます。",
              "どうやって図書館へいきますか。自転車でいきます。",
              "どうやって図書館へいきますか。じてんしゃで行きます。",
              "どうやって図書館へいきますか。じてんしゃでいきます。",
              "どうやってとしょかんへ行きますか。自転車で行きます。",
              "どうやってとしょかんへ行きますか。自転車でいきます。",
              "どうやってとしょかんへ行きますか。じてんしゃで行きます。",
              "どうやってとしょかんへ行きますか。じてんしゃでいきます。",
              "どうやってとしょかんへいきますか。自転車で行きます。",
              "どうやってとしょかんへいきますか。自転車でいきます。",
              "どうやってとしょかんへいきますか。じてんしゃで行きます。",
              "どうやってとしょかんへいきますか。じてんしゃでいきます。",
              "どうやって図書館に行きますか。自転車で行きます。",
              "どうやって図書館に行きますか。自転車でいきます。",
              "どうやって図書館に行きますか。じてんしゃで行きます。",
              "どうやって図書館に行きますか。じてんしゃでいきます。",
              "どうやって図書館にいきますか。自転車で行きます。",
              "どうやって図書館にいきますか。自転車でいきます。",
              "どうやって図書館にいきますか。じてんしゃで行きます。",
              "どうやって図書館にいきますか。じてんしゃでいきます。",
              "どうやってとしょかんに行きますか。自転車で行きます。",
              "どうやってとしょかんに行きますか。自転車でいきます。",
              "どうやってとしょかんに行きますか。じてんしゃで行きます。",
              "どうやってとしょかんに行きますか。じてんしゃでいきます。",
              "どうやってとしょかんにいきますか。自転車で行きます。",
              "どうやってとしょかんにいきますか。自転車でいきます。",
              "どうやってとしょかんにいきますか。じてんしゃで行きます。",
              "どうやってとしょかんにいきますか。じてんしゃでいきます。"
            ],
            "hint": "86"
          },
          {
            "q": "Thỉnh thoảng tôi đọc truyện tranh. Đặc biệt là truyện tranh Nhật.",
            "answers": [
              "ときどき漫画を読みます。特に日本の漫画が好きです。",
              "ときどきまんがをよみます。とくににほんのまんががすきです。",
              "ときどきまんがを読みます。特に日本の漫画が好きです。",
              "ときどき漫画をよみます。とくににほんのまんががすきです。",
              "ときどき漫画をよみます。特に日本の漫画が好きです。",
              "ときどきまんがを読みます。とくににほんのまんががすきです。",
              "ときどき漫画を読みます。とくに日本の漫画が好きです。",
              "ときどきまんがをよみます。特ににほんのまんががすきです。",
              "ときどき漫画を読みます。特ににほんの漫画が好きです。",
              "ときどきまんがをよみます。とくに日本のまんががすきです。",
              "ときどき漫画を読みます。特に日本のまんがが好きです。",
              "ときどきまんがをよみます。とくににほんの漫画がすきです。",
              "ときどき漫画を読みます。特に日本の漫画がすきです。",
              "ときどきまんがをよみます。とくににほんのまんがが好きです。"
            ],
            "hint": "85 · 特に"
          },
          {
            "q": "Học thư pháp khó. Nhưng rất vui.",
            "answers": [
              "書道は難しいです。でも、とても楽しいです。",
              "書道は難しいです。でも、とてもたのしいです。",
              "書道はむずかしいです。でも、とても楽しいです。",
              "書道はむずかしいです。でも、とてもたのしいです。",
              "しょどうは難しいです。でも、とても楽しいです。",
              "しょどうは難しいです。でも、とてもたのしいです。",
              "しょどうはむずかしいです。でも、とても楽しいです。",
              "しょどうはむずかしいです。でも、とてもたのしいです。",
              "書道の勉強は難しいです。でも、とても楽しいです。",
              "書道の勉強は難しいです。でも、とてもたのしいです。",
              "書道の勉強はむずかしいです。でも、とても楽しいです。",
              "書道の勉強はむずかしいです。でも、とてもたのしいです。",
              "書道のべんきょうは難しいです。でも、とても楽しいです。",
              "書道のべんきょうは難しいです。でも、とてもたのしいです。",
              "書道のべんきょうはむずかしいです。でも、とても楽しいです。",
              "書道のべんきょうはむずかしいです。でも、とてもたのしいです。",
              "しょどうの勉強は難しいです。でも、とても楽しいです。",
              "しょどうの勉強は難しいです。でも、とてもたのしいです。",
              "しょどうの勉強はむずかしいです。でも、とても楽しいです。",
              "しょどうの勉強はむずかしいです。でも、とてもたのしいです。",
              "しょどうのべんきょうは難しいです。でも、とても楽しいです。",
              "しょどうのべんきょうは難しいです。でも、とてもたのしいです。",
              "しょどうのべんきょうはむずかしいです。でも、とても楽しいです。",
              "しょどうのべんきょうはむずかしいです。でも、とてもたのしいです。"
            ],
            "hint": "87"
          },
          {
            "q": "Một ngày tôi uống khoảng hai chai nước.",
            "answers": [
              "一日に水を二本くらい飲みます。",
              "一日に水を二本くらいのみます。",
              "一日に水をにほんくらい飲みます。",
              "一日に水をにほんくらいのみます。",
              "一日にみずを二本くらい飲みます。",
              "一日にみずを二本くらいのみます。",
              "一日にみずをにほんくらい飲みます。",
              "一日にみずをにほんくらいのみます。",
              "いちにちに水を二本くらい飲みます。",
              "いちにちに水を二本くらいのみます。",
              "いちにちに水をにほんくらい飲みます。",
              "いちにちに水をにほんくらいのみます。",
              "いちにちにみずを二本くらい飲みます。",
              "いちにちにみずを二本くらいのみます。",
              "いちにちにみずをにほんくらい飲みます。",
              "いちにちにみずをにほんくらいのみます。",
              "一日に水を二本ぐらい飲みます。",
              "一日に水を二本ぐらいのみます。",
              "一日に水をにほんぐらい飲みます。",
              "一日に水をにほんぐらいのみます。",
              "一日にみずを二本ぐらい飲みます。",
              "一日にみずを二本ぐらいのみます。",
              "一日にみずをにほんぐらい飲みます。",
              "一日にみずをにほんぐらいのみます。",
              "いちにちに水を二本ぐらい飲みます。",
              "いちにちに水を二本ぐらいのみます。",
              "いちにちに水をにほんぐらい飲みます。",
              "いちにちに水をにほんぐらいのみます。",
              "いちにちにみずを二本ぐらい飲みます。",
              "いちにちにみずを二本ぐらいのみます。",
              "いちにちにみずをにほんぐらい飲みます。",
              "いちにちにみずをにほんぐらいのみます。"
            ],
            "hint": "84"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np3-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "テレビは（①）{見|み}ません。でも、ドラマは（②）{見|み}ます。　〔Terebi wa ((1)) mimasen. Demo, dorama wa ((2)) mimasu.〕　— Tôi không xem TV mấy. Nhưng thỉnh thoảng xem phim truyền hình.",
            "options": [
              "① よく　② ときどき",
              "① {全然|ぜんぜん}　② あまり",
              "① あまり　② {全然|ぜんぜん}",
              "① あまり　② ときどき"
            ],
            "correct": 3,
            "why": "あまり + ～ません; ときどき + ～ます. → **テレビはあまり{見|み}ません。でも、ドラマはときどき{見|み}ます。** 〔Terebi wa amari mimasen. Demo, dorama wa tokidoki mimasu.〕 — Tôi không xem TV mấy. Nhưng thỉnh thoảng xem phim truyền hình."
          },
          {
            "q": "{趣味|しゅみ}は{泳|およ}ぐ（①）です。{一週間|いっしゅうかん}（②）{二回|にかい}{泳|およ}ぎます。　〔Shumi wa oyogu ((1)) desu. Isshuukan ((2)) nikai oyogimasu.〕　— Sở thích là bơi. Một tuần bơi hai lần.",
            "options": [
              "① こと　② で",
              "① の　② で",
              "① こと　② に",
              "① もの　② に"
            ],
            "correct": 2,
            "why": "V **こと** · thời gian **に**. → **{趣味|しゅみ}は{泳|およ}ぐことです。{一週間|いっしゅうかん}に{二回|にかい}{泳|およ}ぎます。** 〔Shumi wa oyogu koto desu. Isshuukan ni nikai oyogimasu.〕 — Sở thích là bơi. Một tuần bơi hai lần."
          },
          {
            "q": "{日本語|にほんご}（①）{少|すこ}しできます。（②）、{漢字|かんじ}は{全然|ぜんぜん}{読|よ}むことができません。　〔Nihongo ((1)) sukoshi dekimasu. ((2)), kanji wa zenzen yomu koto ga dekimasen.〕　— Tôi biết tiếng Nhật một chút. Nhưng hoàn toàn không đọc được chữ Hán.",
            "options": [
              "① を　② でも",
              "① を　② だけ",
              "① が　② でも",
              "① が　② そして"
            ],
            "correct": 2,
            "why": "N **が** できます · trái ý → **でも**. → **{日本語|にほんご}が{少|すこ}しできます。でも、{漢字|かんじ}は{全然|ぜんぜん}{読|よ}むことができません。** 〔Nihongo ga sukoshi dekimasu. Demo, kanji wa zenzen yomu koto ga dekimasen.〕 — Tôi biết tiếng Nhật một chút. Nhưng hoàn toàn không đọc được chữ Hán."
          },
          {
            "q": "{電車|でんしゃ}（①）{乗|の}って、{駅|えき}で（②）、{歩|ある}いて{行|い}きます。　〔Densha ((1)) notte, eki de ((2)), aruite ikimasu.〕　— Lên tàu điện, xuống ở ga rồi đi bộ.",
            "options": [
              "① に　② {乗|の}って",
              "① を　② {降|お}りて",
              "① に　② {降|お}りて",
              "① で　② {降|お}りって"
            ],
            "correct": 2,
            "why": "に 乗って · 降りて. → **{電車|でんしゃ}に{乗|の}って、{駅|えき}で{降|お}りて、{歩|ある}いて{行|い}きます。** 〔Densha ni notte, eki de orite, aruite ikimasu.〕 — Lên tàu điện, xuống ở ga rồi đi bộ."
          },
          {
            "q": "{兄|あに}はお{酒|さけ}（①）{飲|の}みません。コーヒー（②）{飲|の}みます。　〔Ani wa osake ((1)) nomimasen. Koohii ((2)) nomimasu.〕　— Anh tôi hoàn toàn không uống rượu. Chỉ uống cà phê.",
            "options": [
              "① を {全然|ぜんぜん}　② だけ",
              "① を よく　② だけ",
              "① が {全然|ぜんぜん}　② だけ を",
              "① を {全然|ぜんぜん}　② も だけ"
            ],
            "correct": 0,
            "why": "全然 ～ません · N だけ. → **{兄|あに}はお{酒|さけ}を{全然|ぜんぜん}{飲|の}みません。コーヒーだけ{飲|の}みます。** 〔Ani wa osake o zenzen nomimasen. Koohii dake nomimasu.〕 — Anh tôi hoàn toàn không uống rượu. Chỉ uống cà phê."
          },
          {
            "q": "{前|まえ}は{毎週|まいしゅう}{山|やま}に{登|のぼ}りました。（①）、{最近|さいきん}は（②）{登|のぼ}りません。　〔Mae wa maishuu yama ni noborimashita. ((1)), saikin wa ((2)) noborimasen.〕　— Trước đây tuần nào tôi cũng leo núi. Nhưng dạo này không leo mấy.",
            "options": [
              "① でも　② あまり",
              "① それから　② いつも",
              "① でも　② よく",
              "① そして　② あまり"
            ],
            "correct": 0,
            "why": "Trái ý → でも; あまり + ～ません. → **{前|まえ}は{毎週|まいしゅう}{山|やま}に{登|のぼ}りました。でも、{最近|さいきん}はあまり{登|のぼ}りません。** 〔Mae wa maishuu yama ni noborimashita. Demo, saikin wa amari noborimasen.〕 — Trước đây tuần nào tôi cũng leo núi. Nhưng dạo này không leo mấy."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-np3-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (5 câu)",
        "items": [
          {
            "q": "Giám khảo: 「よく スポーツを しますか」. Bạn thích nhưng dạo này không chơi.",
            "options": [
              "スポーツが{好|す}きです。でも、{最近|さいきん}よくしません。 (Supootsu ga suki desu. Demo, saikin yoku shimasen.)",
              "スポーツが{好|す}きです。でも、{最近|さいきん}あまりしません。 (Supootsu ga suki desu. Demo, saikin amari shimasen.)",
              "スポーツが{好|す}きです。そして、{最近|さいきん}あまりしません。 (Supootsu ga suki desu. Soshite, saikin amari shimasen.)",
              "スポーツが{好|す}きですでも、{最近|さいきん}あまりします。 (Supootsu ga suki desu demo, saikin amari shimasu.)"
            ],
            "correct": 1,
            "why": "でも ở đầu câu sau · あまり ～ません."
          },
          {
            "q": "Bạn mới hỏi bạn có hay đi xem phim không. Bạn đi khoảng tháng 2 lần.",
            "options": [
              "ときどき{行|い}きます。{一|いっ}か{月|げつ}に{二回|にかい}くらいです。 (Tokidoki ikimasu. Ikkagetsu ni nikai kurai desu.)",
              "いつも{行|い}きます。{一|いっ}か{月|げつ}に{二回|にかい}くらいです。 (Itsumo ikimasu. Ikkagetsu ni nikai kurai desu.)",
              "ときどき{行|い}きません。{一|いっ}か{月|げつ}に{二回|にかい}くらいです。 (Tokidoki ikimasen. Ikkagetsu ni nikai kurai desu.)",
              "ときどき{行|い}きます。{一月|いちがつ}に{二回|にかい}くらいです。 (Tokidoki ikimasu. Ichigatsu ni nikai kurai desu.)"
            ],
            "correct": 0,
            "why": "Tháng 2 lần → ときどき; một tháng = 一か月."
          },
          {
            "q": "Bạn muốn nói: \"Tôi chỉ uống được một cốc bia\".",
            "options": [
              "ビールは{一杯|いっぱい}だけ{飲|の}むことができます。 (Biiru wa ippai dake nomu koto ga dekimasu.)",
              "ビールはだけ{一杯|いっぱい}{飲|の}むことができます。 (Biiru wa dake ippai nomu koto ga dekimasu.)",
              "ビールは{一杯|いっぱい}だけ{飲|の}みますことができます。 (Biiru wa ippai dake nomimasu koto ga dekimasu.)",
              "ビールは{一本|いっぽん}だけ{飲|の}むことをできます。 (Biiru wa ippon dake nomu koto o dekimasu.)"
            ],
            "correct": 0,
            "why": "Số + だけ · V辞書形 こと が できます."
          },
          {
            "q": "Bạn kể: thích nấu ăn, đặc biệt món Ý, tuần nào cũng nấu.",
            "options": [
              "{料理|りょうり}が{好|す}きです。{特|とく}にイタリア{料理|りょうり}を{好|す}きです。{毎週|まいしゅう}{作|つく}ります。 (Ryouri ga suki desu. Tokuni Itaria-ryouri o suki desu. Maishuu tsukurimasu.)",
              "{料理|りょうり}を{好|す}きです。{特|とく}にイタリア{料理|りょうり}が{好|す}きです。あまり{作|つく}ります。 (Ryouri o suki desu. Tokuni Itaria-ryouri ga suki desu. Amari tsukurimasu.)",
              "{料理|りょうり}が{好|す}きです。でも、イタリア{料理|りょうり}が{好|す}きです。{毎週|まいしゅう}{作|つく}ります。 (Ryouri ga suki desu. Demo, Itaria-ryouri ga suki desu. Maishuu tsukurimasu.)",
              "{料理|りょうり}が{好|す}きです。{特|とく}にイタリア{料理|りょうり}が{好|す}きです。{毎週|まいしゅう}{作|つく}ります。 (Ryouri ga suki desu. Tokuni Itaria-ryouri ga suki desu. Maishuu tsukurimasu.)"
            ],
            "correct": 3,
            "why": "特に (không phải でも) · が 好き · 毎週."
          },
          {
            "q": "Bạn bè hỏi 「どうやって 日本語を 勉強しますか」.",
            "options": [
              "どうしてドラマを{見|み}て、{新|あたら}しい{言葉|ことば}を{書|か}きます。 (Doushite dorama o mite, atarashii kotoba o kakimasu.)",
              "{毎日|まいにち}ドラマを{見|み}ます、{新|あたら}しい{言葉|ことば}をノートに{書|か}いて。 (Mainichi dorama o mimasu, atarashii kotoba o nooto ni kaite.)",
              "{毎日|まいにち}ドラマを{見|み}て、{新|あたら}しい{言葉|ことば}をノートに{書|か}きます。 (Mainichi dorama o mite, atarashii kotoba o nooto ni kakimasu.)",
              "{毎日|まいにち}ドラマを{見|み}て、{新|あたら}しい{言葉|ことば}をノートを{書|か}きます。 (Mainichi dorama o mite, atarashii kotoba o nooto o kakimasu.)"
            ],
            "correct": 2,
            "why": "どうやって → các bước Vて、Vます."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**あまり／全然 → ～ません** (kể cả quá khứ ～ませんでした) · **だけ** sau từ được giới hạn · **でも** đầu câu sau, chỉ cho ý trái ngược.",
          "Thi nói kết hợp: 「よく ～ますか」→ **はい、よく／ときどき ～ます。一週間に ～回くらいです。** hoặc **いいえ、あまり ～ません。でも、～。**"
        ]
      }
    ]
  },
  {
    "id": "lt-b9-hoi-thoai",
    "kind": "conversation",
    "title": "Luyện thêm Bài 9 · Hội thoại — sở thích · biết bơi không · đi lặn cuối tuần · đường đến sự kiện · piano và thư pháp (5 hội thoại mới, ~55 câu)",
    "goal": "Hiểu và tự nói được hội thoại Bài 9: hỏi–nói sở thích, làm được/không làm được, bao lâu một lần, kể chuỗi việc cuối tuần, hỏi–chỉ cách đi và cách đăng ký.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Mỗi hội thoại làm 4 bước: **đọc + nghe** → **câu hỏi hiểu** → **điền chỗ trống** → **sắp xếp lượt thoại**; cuối bài là phần **tự nói** (che một vai).",
          "Khi nghe, bắt 4 thứ: **sở thích** (～ことです), **làm được không** (～が できます／できません), **bao lâu một lần** (一週間に～回, よく／あまり), **các bước / cách đi** (Vて、Vて、V · どうやって).",
          "Lỗi hay mắc: dùng ～ます trước こと, quên **が** với できます, quên **に** trong 一週間に～回, nhầm **乗ります (に) / 降ります (を)**."
        ]
      },
      {
        "t": "recap",
        "title": "Khuôn chung của Bài 9",
        "items": [
          "**Sở thích**: 趣味は 何ですか → ～ことです。特に ～が 好きです。",
          "**Làm được**: ～が できますか → はい、できます／少し できます／いいえ、全然 できません.",
          "**Tần suất**: よく ～ますか → 一週間に ～回 ～ます · あまり ～ません · でも、最近 ～ません. **Cách làm**: どうやって ～ますか → ～て、～て、～ます."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · Hội thoại 1–2: sở thích · biết bơi không"
      },
      {
        "t": "p",
        "text": "**Tình huống 1.** Giờ ăn trưa, Daniel và Mary nói về sở thích của nhau."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 1 — Daniel và Mary: tem và truyện tranh",
        "lines": [
          {
            "who": "ダニエル",
            "role": "b",
            "text": "メアリーさんの{趣味|しゅみ}は{何|なん}ですか。",
            "ro": "Mearii-san no shumi wa nan desu ka.",
            "vi": "Sở thích của Mary là gì?"
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "{切手|きって}を{集|あつ}めることです。いろいろな{国|くに}の{切手|きって}があります。",
            "ro": "Kitte o atsumeru koto desu. Iroiro na kuni no kitte ga arimasu.",
            "vi": "Là sưu tầm tem. Mình có tem của nhiều nước."
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "へえ、{何枚|なんまい}ぐらいありますか。",
            "ro": "Hee, nanmai gurai arimasu ka.",
            "vi": "Ồ, có khoảng bao nhiêu tấm?"
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "{三百枚|さんびゃくまい}ぐらいです。ダニエルさんの{趣味|しゅみ}は？",
            "ro": "Sanbyakumai gurai desu. Danieru-san no shumi wa?",
            "vi": "Khoảng 300 tấm. Còn sở thích của Daniel?"
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "{漫画|まんが}を{読|よ}むことです。{特|とく}に{日本|にほん}の{漫画|まんが}が{好|す}きです。",
            "ro": "Manga o yomu koto desu. Tokuni Nihon no manga ga suki desu.",
            "vi": "Là đọc truyện tranh. Đặc biệt mình thích truyện tranh Nhật."
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "よく{読|よ}みますか。",
            "ro": "Yoku yomimasu ka.",
            "vi": "Bạn có hay đọc không?"
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "はい、{一週間|いっしゅうかん}に{三冊|さんさつ}ぐらい{読|よ}みます。",
            "ro": "Hai, isshuukan ni sansatsu gurai yomimasu.",
            "vi": "Có, một tuần khoảng ba quyển."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ht1-hieu",
        "title": "Hội thoại 1 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Sở thích của Mary là gì?",
            "options": [
              "Du lịch nhiều nước",
              "Sưu tầm tem",
              "Đọc truyện tranh",
              "Viết thư"
            ],
            "correct": 1,
            "why": "切手を 集める ことです."
          },
          {
            "q": "Mary có khoảng bao nhiêu tấm tem?",
            "options": [
              "300",
              "3.000",
              "100",
              "30"
            ],
            "correct": 0,
            "why": "三百枚 ぐらい."
          },
          {
            "q": "Tem của Mary là tem của đâu?",
            "options": [
              "Không nói",
              "Của nhiều nước",
              "Chỉ của nước Mary",
              "Chỉ của Nhật"
            ],
            "correct": 1,
            "why": "いろいろな 国の 切手."
          },
          {
            "q": "Sở thích của Daniel là gì?",
            "options": [
              "Đọc truyện tranh",
              "Sưu tầm tem",
              "Xem phim hoạt hình",
              "Vẽ truyện tranh"
            ],
            "correct": 0,
            "why": "漫画を 読む ことです."
          },
          {
            "q": "Daniel đặc biệt thích gì?",
            "options": [
              "Truyện tranh Nhật",
              "Tiểu thuyết Nhật",
              "Tem Nhật",
              "Truyện tranh Mỹ"
            ],
            "correct": 0,
            "why": "特に 日本の 漫画が 好きです."
          },
          {
            "q": "Daniel đọc bao nhiêu?",
            "options": [
              "Một ngày 3 quyển",
              "Không đọc mấy",
              "Một tuần khoảng 3 quyển",
              "Một tháng 3 quyển"
            ],
            "correct": 2,
            "why": "一週間に 三冊 ぐらい."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-ht1-dien",
        "title": "Hội thoại 1 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "メアリー：{切手|きって}を{集|あつ}める＿＿です。　〔Mearii: kitte o atsumeru __ desu.〕",
            "answers": [
              "こと"
            ],
            "hint": "V辞書形 + こと"
          },
          {
            "q": "メアリー：{三百枚|さんびゃくまい}＿＿です。　〔Mearii: sanbyakumai __ desu.〕",
            "answers": [
              "ぐらい",
              "くらい"
            ],
            "hint": "Khoảng"
          },
          {
            "q": "ダニエル：{特|とく}に{日本|にほん}の{漫画|まんが}＿＿{好|す}きです。　〔Danieru: tokuni Nihon no manga __ suki desu.〕",
            "answers": [
              "が"
            ],
            "hint": "N が 好きです"
          },
          {
            "q": "ダニエル：{一週間|いっしゅうかん}＿＿{三冊|さんさつ}ぐらい{読|よ}みます。　〔Danieru: isshuukan __ sansatsu gurai yomimasu.〕",
            "answers": [
              "に"
            ],
            "hint": "Khoảng thời gian + に"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-ht1-sx",
        "title": "Hội thoại 1 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi sở thích → trả lời (tem) → hỏi số lượng → trả lời + hỏi lại.",
            "chips": [
              "へえ、{何枚|なんまい}ぐらいありますか。",
              "メアリーさんの{趣味|しゅみ}は{何|なん}ですか。",
              "{切手|きって}を{集|あつ}めることです。いろいろな{国|くに}の{切手|きって}があります。",
              "{三百枚|さんびゃくまい}ぐらいです。ダニエルさんの{趣味|しゅみ}は？"
            ],
            "answer": [
              "メアリーさんの{趣味|しゅみ}は{何|なん}ですか。",
              "{切手|きって}を{集|あつ}めることです。いろいろな{国|くに}の{切手|きって}があります。",
              "へえ、{何枚|なんまい}ぐらいありますか。",
              "{三百枚|さんびゃくまい}ぐらいです。ダニエルさんの{趣味|しゅみ}は？"
            ],
            "ro": "Mearii-san no shumi wa nan desu ka. Kitte o atsumeru koto desu. Iroiro na kuni no kitte ga arimasu. Hee, nanmai gurai arimasu ka. Sanbyakumai gurai desu. Danieru-san no shumi wa?"
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 2.** Anna hỏi Natapon có biết bơi không và giới thiệu lớp bơi ở trường."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 2 — Natapon không biết bơi — lớp bơi của trường",
        "lines": [
          {
            "who": "アンナ",
            "role": "a",
            "text": "ナタポンさん、{泳|およ}ぐことができますか。",
            "ro": "Natapon-san, oyogu koto ga dekimasu ka.",
            "vi": "Natapon, bạn biết bơi không?"
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "いいえ、{全然|ぜんぜん}できません。でも、{習|なら}いたいです。",
            "ro": "Iie, zenzen dekimasen. Demo, naraitai desu.",
            "vi": "Không, mình hoàn toàn không biết. Nhưng mình muốn học."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "{大学|だいがく}のプールに{水泳|すいえい}{教室|きょうしつ}がありますよ。",
            "ro": "Daigaku no puuru ni suiei kyoushitsu ga arimasu yo.",
            "vi": "Bể bơi của trường có lớp dạy bơi đấy."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "そうですか。いつですか。",
            "ro": "Sou desu ka. Itsu desu ka.",
            "vi": "Vậy à. Khi nào?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "{毎週|まいしゅう}{水曜日|すいようび}の{午後|ごご}{五時|ごじ}からです。{一回|いっかい}{千円|せんえん}です。",
            "ro": "Maishuu suiyoubi no gogo goji kara desu. Ikkai sen'en desu.",
            "vi": "Thứ Tư hàng tuần, từ 5 giờ chiều. Mỗi buổi 1.000 yên."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "いいですね。{申|もう}し{込|こ}みたいです。どうやって{申|もう}し{込|こ}みますか。",
            "ro": "Ii desu ne. Moushikomitai desu. Douyatte moushikomimasu ka.",
            "vi": "Hay đấy. Mình muốn đăng ký. Đăng ký thế nào?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "{受付|うけつけ}で{名前|なまえ}と{電話番号|でんわばんごう}を{書|か}いて、お{金|かね}を{払|はら}います。",
            "ro": "Uketsuke de namae to denwabangou o kaite, okane o haraimasu.",
            "vi": "Viết tên và số điện thoại ở quầy lễ tân rồi trả tiền."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ht2-hieu",
        "title": "Hội thoại 2 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Natapon có biết bơi không?",
            "options": [
              "Không nói",
              "Biết một chút",
              "Biết bơi giỏi",
              "Hoàn toàn không"
            ],
            "correct": 3,
            "why": "全然 できません."
          },
          {
            "q": "Natapon muốn làm gì?",
            "options": [
              "Học bơi",
              "Đi biển",
              "Không muốn bơi",
              "Dạy bơi"
            ],
            "correct": 0,
            "why": "習いたいです."
          },
          {
            "q": "Lớp bơi ở đâu?",
            "options": [
              "Ở bể bơi của trường",
              "Ở nhà thi đấu thành phố",
              "Ở nhà Anna",
              "Ở biển"
            ],
            "correct": 0,
            "why": "大学の プールに 水泳教室が あります."
          },
          {
            "q": "Lớp học vào lúc nào?",
            "options": [
              "Thứ Năm hàng tuần, từ 5 giờ chiều",
              "Mỗi ngày từ 5 giờ",
              "Thứ Tư hàng tuần, từ 5 giờ sáng",
              "Thứ Tư hàng tuần, từ 5 giờ chiều"
            ],
            "correct": 3,
            "why": "毎週 水曜日の 午後 五時から."
          },
          {
            "q": "Học phí bao nhiêu?",
            "options": [
              "1.000 yên mỗi tháng",
              "10.000 yên",
              "Miễn phí",
              "1.000 yên mỗi buổi"
            ],
            "correct": 3,
            "why": "一回 千円です."
          },
          {
            "q": "Đăng ký thế nào?",
            "options": [
              "Chỉ cần đến bể bơi",
              "Viết tên, số điện thoại ở quầy rồi trả tiền",
              "Đặt trên mạng",
              "Gọi điện cho Anna"
            ],
            "correct": 1,
            "why": "受付で 名前と 電話番号を 書いて、お金を 払います."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-ht2-dien",
        "title": "Hội thoại 2 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "アンナ：{泳|およ}ぐこと＿＿できますか。　〔Anna: oyogu koto __ dekimasu ka.〕",
            "answers": [
              "が"
            ],
            "hint": "こと が できます"
          },
          {
            "q": "ナタポン：いいえ、{全然|ぜんぜん}＿＿。　〔Natapon: iie, zenzen __.〕",
            "answers": [
              "できません"
            ],
            "hint": "全然 + phủ định"
          },
          {
            "q": "ナタポン：どうやって{申|もう}し{込|こ}み＿＿か。　〔Natapon: douyatte moushikomi__ ka.〕",
            "answers": [
              "ます"
            ],
            "hint": "Hỏi cách làm"
          },
          {
            "q": "アンナ：{名前|なまえ}と{電話番号|でんわばんごう}を{書|か}い＿＿、お{金|かね}を{払|はら}います。　〔Anna: namae to denwabangou o kai__, okane o haraimasu.〕",
            "answers": [
              "て"
            ],
            "hint": "Thể て nối bước"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-ht2-sx",
        "title": "Hội thoại 2 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi biết bơi → không biết, muốn học → giới thiệu lớp → hỏi khi nào.",
            "chips": [
              "そうですか。いつですか。",
              "ナタポンさん、{泳|およ}ぐことができますか。",
              "{大学|だいがく}のプールに{水泳|すいえい}{教室|きょうしつ}がありますよ。",
              "いいえ、{全然|ぜんぜん}できません。でも、{習|なら}いたいです。"
            ],
            "answer": [
              "ナタポンさん、{泳|およ}ぐことができますか。",
              "いいえ、{全然|ぜんぜん}できません。でも、{習|なら}いたいです。",
              "{大学|だいがく}のプールに{水泳|すいえい}{教室|きょうしつ}がありますよ。",
              "そうですか。いつですか。"
            ],
            "ro": "Natapon-san, oyogu koto ga dekimasu ka. Iie, zenzen dekimasen. Demo, naraitai desu. Daigaku no puuru ni suiei kyoushitsu ga arimasu yo. Sou desu ka. Itsu desu ka."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · Hội thoại 3–4: cuối tuần đi lặn · đường đến sự kiện"
      },
      {
        "t": "p",
        "text": "**Tình huống 3.** Thứ Hai, Wang hỏi Carlos đã làm gì cuối tuần."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 3 — Carlos đi lặn biển",
        "lines": [
          {
            "who": "ワン",
            "role": "a",
            "text": "カルロスさん、{週末|しゅうまつ}{何|なに}をしましたか。",
            "ro": "Karurosu-san, shuumatsu nani o shimashita ka.",
            "vi": "Carlos, cuối tuần bạn làm gì?"
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "{友達|ともだち}と{海|うみ}へ{行|い}って、ダイビングをしました。",
            "ro": "Tomodachi to umi e itte, daibingu o shimashita.",
            "vi": "Mình đi biển với bạn và lặn biển."
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "すごいですね。ダイビングができますか。",
            "ro": "Sugoi desu ne. Daibingu ga dekimasu ka.",
            "vi": "Giỏi quá nhỉ. Bạn biết lặn à?"
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "はい、{国|くに}で{習|なら}いました。{一年|いちねん}に{五回|ごかい}ぐらいします。",
            "ro": "Hai, kuni de naraimashita. Ichinen ni gokai gurai shimasu.",
            "vi": "Ừ, mình học ở nước mình. Một năm mình lặn khoảng năm lần."
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "いいですね。{私|わたし}は{泳|およ}ぐことはできますが、ダイビングは{全然|ぜんぜん}できません。",
            "ro": "Ii desu ne. Watashi wa oyogu koto wa dekimasu ga, daibingu wa zenzen dekimasen.",
            "vi": "Hay nhỉ. Mình thì bơi được, nhưng lặn thì hoàn toàn không."
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "じゃ、{今度|こんど}{一緒|いっしょ}に{行|い}きませんか。{教|おし}えますよ。",
            "ro": "Ja, kondo issho ni ikimasen ka. Oshiemasu yo.",
            "vi": "Vậy lần tới đi cùng mình không? Mình dạy cho."
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "ありがとうございます。ぜひ。",
            "ro": "Arigatou gozaimasu. Zehi.",
            "vi": "Cảm ơn bạn. Nhất định rồi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ht3-hieu",
        "title": "Hội thoại 3 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Cuối tuần Carlos đã làm gì?",
            "options": [
              "Đi bơi ở bể bơi",
              "Ở nhà nghỉ",
              "Đi biển với bạn và lặn biển",
              "Đi câu cá"
            ],
            "correct": 2,
            "why": "海へ 行って、ダイビングを しました."
          },
          {
            "q": "Carlos học lặn ở đâu?",
            "options": [
              "Tự học",
              "Ở Nhật",
              "Ở câu lạc bộ của trường",
              "Ở nước của Carlos"
            ],
            "correct": 3,
            "why": "国で 習いました."
          },
          {
            "q": "Carlos lặn bao lâu một lần?",
            "options": [
              "Một năm khoảng năm lần",
              "Một tuần năm lần",
              "Mỗi cuối tuần",
              "Một tháng năm lần"
            ],
            "correct": 0,
            "why": "一年に 五回 ぐらい."
          },
          {
            "q": "Wang làm được gì?",
            "options": [
              "Bơi được, nhưng không lặn được",
              "Lặn được, nhưng không bơi được",
              "Không làm được gì",
              "Cả bơi và lặn đều được"
            ],
            "correct": 0,
            "why": "泳ぐことは できますが、ダイビングは 全然 できません."
          },
          {
            "q": "Carlos đề nghị gì?",
            "options": [
              "Wang dạy Carlos bơi",
              "Cùng đi bể bơi",
              "Lần tới đi cùng, Carlos sẽ dạy",
              "Wang đăng ký lớp lặn"
            ],
            "correct": 2,
            "why": "今度 一緒に 行きませんか。教えますよ."
          },
          {
            "q": "Wang trả lời thế nào?",
            "options": [
              "Nhận lời, rất muốn đi",
              "Hẹn lần sau",
              "Từ chối vì bận",
              "Không trả lời"
            ],
            "correct": 0,
            "why": "ありがとうございます。ぜひ."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-ht3-dien",
        "title": "Hội thoại 3 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "カルロス：{海|うみ}へ{行|い}っ＿＿、ダイビングをしました。　〔Karurosu: umi e i__, daibingu o shimashita.〕",
            "answers": [
              "て"
            ],
            "hint": "行きます → 行って"
          },
          {
            "q": "ワン：ダイビング＿＿できますか。　〔Wan: daibingu __ dekimasu ka.〕",
            "answers": [
              "が"
            ],
            "hint": "N が できます"
          },
          {
            "q": "カルロス：{一年|いちねん}に{五回|ごかい}＿＿します。　〔Karurosu: ichinen ni gokai __ shimasu.〕",
            "answers": [
              "ぐらい",
              "くらい"
            ],
            "hint": "Khoảng"
          },
          {
            "q": "カルロス：{今度|こんど}{一緒|いっしょ}に{行|い}き＿＿か。　〔Karurosu: kondo issho ni iki__ ka.〕",
            "answers": [
              "ません"
            ],
            "hint": "Rủ"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-ht3-sx",
        "title": "Hội thoại 3 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi cuối tuần → đi biển lặn → hỏi có biết lặn → học ở nước mình.",
            "chips": [
              "{友達|ともだち}と{海|うみ}へ{行|い}って、ダイビングをしました。",
              "すごいですね。ダイビングができますか。",
              "カルロスさん、{週末|しゅうまつ}{何|なに}をしましたか。",
              "はい、{国|くに}で{習|なら}いました。{一年|いちねん}に{五回|ごかい}ぐらいします。"
            ],
            "answer": [
              "カルロスさん、{週末|しゅうまつ}{何|なに}をしましたか。",
              "{友達|ともだち}と{海|うみ}へ{行|い}って、ダイビングをしました。",
              "すごいですね。ダイビングができますか。",
              "はい、{国|くに}で{習|なら}いました。{一年|いちねん}に{五回|ごかい}ぐらいします。"
            ],
            "ro": "Karurosu-san, shuumatsu nani o shimashita ka. Tomodachi to umi e itte, daibingu o shimashita. Sugoi desu ne. Daibingu ga dekimasu ka. Hai, kuni de naraimashita. Ichinen ni gokai gurai shimasu."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 4.** Park hỏi Marco đường đến sự kiện nhảy ở nhà thi đấu của trường."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 4 — Đến sự kiện nhảy bằng cách nào?",
        "lines": [
          {
            "who": "パク",
            "role": "a",
            "text": "マルコさん、{土曜日|どようび}のダンスのイベントに{行|い}きますか。",
            "ro": "Maruko-san, doyoubi no dansu no ibento ni ikimasu ka.",
            "vi": "Marco, bạn có đi sự kiện nhảy thứ Bảy không?"
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "はい、{行|い}きます。パクさんも{参加|さんか}しますか。",
            "ro": "Hai, ikimasu. Paku-san mo sanka shimasu ka.",
            "vi": "Có, mình đi. Park cũng tham gia à?"
          },
          {
            "who": "パク",
            "role": "a",
            "text": "ええ。でも、{体育館|たいいくかん}はどこですか。どうやって{行|い}きますか。",
            "ro": "Ee. Demo, taiikukan wa doko desu ka. Douyatte ikimasu ka.",
            "vi": "Ừ. Nhưng nhà thi đấu ở đâu? Đi bằng cách nào?"
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{駅|えき}から{五番|ごばん}のバスに{乗|の}って、{大学|だいがく}{前|まえ}で{降|お}ります。バスを{降|お}りて、{少|すこ}し{歩|ある}きます。",
            "ro": "Eki kara goban no basu ni notte, daigaku mae de orimasu. Basu o orite, sukoshi arukimasu.",
            "vi": "Từ ga lên xe buýt số 5, xuống ở trạm trước trường. Xuống xe rồi đi bộ một chút."
          },
          {
            "who": "パク",
            "role": "a",
            "text": "バスで{何分|なんぷん}ぐらいですか。",
            "ro": "Basu de nanpun gurai desu ka.",
            "vi": "Đi xe buýt mất khoảng mấy phút?"
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{十五分|じゅうごふん}ぐらいです。",
            "ro": "Juugofun gurai desu.",
            "vi": "Khoảng 15 phút."
          },
          {
            "who": "パク",
            "role": "a",
            "text": "わかりました。ありがとう。",
            "ro": "Wakarimashita. Arigatou.",
            "vi": "Mình hiểu rồi. Cảm ơn nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ht4-hieu",
        "title": "Hội thoại 4 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Sự kiện gì?",
            "options": [
              "Lớp thư pháp",
              "Cuộc thi hát",
              "Trận bóng đá",
              "Sự kiện nhảy"
            ],
            "correct": 3,
            "why": "ダンスの イベント."
          },
          {
            "q": "Sự kiện vào thứ mấy?",
            "options": [
              "Thứ Sáu",
              "Thứ Tư",
              "Thứ Bảy",
              "Chủ nhật"
            ],
            "correct": 2,
            "why": "土曜日の イベント."
          },
          {
            "q": "Sự kiện ở đâu?",
            "options": [
              "Bể bơi",
              "Nhà thi đấu của trường",
              "Công viên",
              "Ga"
            ],
            "correct": 1,
            "why": "体育館."
          },
          {
            "q": "Từ ga đi thế nào?",
            "options": [
              "Lên xe buýt số 5",
              "Lên xe buýt số 15",
              "Đi bộ",
              "Đi tàu điện"
            ],
            "correct": 0,
            "why": "五番の バスに 乗って."
          },
          {
            "q": "Xuống xe ở đâu?",
            "options": [
              "Trạm trước trường đại học",
              "Trước công viên",
              "Trước nhà thi đấu",
              "Ở ga"
            ],
            "correct": 0,
            "why": "大学前で 降ります."
          },
          {
            "q": "Đi xe buýt mất bao lâu?",
            "options": [
              "Khoảng 1 tiếng",
              "Khoảng 15 phút",
              "Khoảng 5 phút",
              "Khoảng 50 phút"
            ],
            "correct": 1,
            "why": "十五分 ぐらい."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-ht4-dien",
        "title": "Hội thoại 4 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "マルコ：{五番|ごばん}のバス＿＿{乗|の}って、…　〔Maruko: goban no basu __ notte,...〕",
            "answers": [
              "に"
            ],
            "hint": "N に 乗ります"
          },
          {
            "q": "マルコ：{大学|だいがく}{前|まえ}＿＿{降|お}ります。　〔Maruko: daigaku mae __ orimasu.〕",
            "answers": [
              "で"
            ],
            "hint": "Nơi xuống"
          },
          {
            "q": "マルコ：バス＿＿{降|お}りて、{少|すこ}し{歩|ある}きます。　〔Maruko: basu __ orite, sukoshi arukimasu.〕",
            "answers": [
              "を"
            ],
            "hint": "N を 降ります"
          },
          {
            "q": "パク：どう＿＿{行|い}きますか。　〔Paku: dou__ ikimasu ka.〕",
            "answers": [
              "やって"
            ],
            "hint": "Hỏi cách đi"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-ht4-sx",
        "title": "Hội thoại 4 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi có đi sự kiện → có, hỏi lại → hỏi đường → chỉ đường.",
            "chips": [
              "{駅|えき}から{五番|ごばん}のバスに{乗|の}って、{大学|だいがく}{前|まえ}で{降|お}ります。バスを{降|お}りて、{少|すこ}し{歩|ある}きます。",
              "マルコさん、{土曜日|どようび}のダンスのイベントに{行|い}きますか。",
              "ええ。でも、{体育館|たいいくかん}はどこですか。どうやって{行|い}きますか。",
              "はい、{行|い}きます。パクさんも{参加|さんか}しますか。"
            ],
            "answer": [
              "マルコさん、{土曜日|どようび}のダンスのイベントに{行|い}きますか。",
              "はい、{行|い}きます。パクさんも{参加|さんか}しますか。",
              "ええ。でも、{体育館|たいいくかん}はどこですか。どうやって{行|い}きますか。",
              "{駅|えき}から{五番|ごばん}のバスに{乗|の}って、{大学|だいがく}{前|まえ}で{降|お}ります。バスを{降|お}りて、{少|すこ}し{歩|ある}きます。"
            ],
            "ro": "Maruko-san, doyoubi no dansu no ibento ni ikimasu ka. Hai, ikimasu. Paku-san mo sanka shimasu ka. Ee. Demo, taiikukan wa doko desu ka. Douyatte ikimasu ka. Eki kara goban no basu ni notte, daigaku mae de orimasu. Basu o orite, sukoshi arukimasu."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · Hội thoại 5 dài hơn + tự nói"
      },
      {
        "t": "p",
        "text": "**Tình huống 5.** Chị Yamaguchi hỏi Anna về sở thích; Anna kể chuyện piano ngày trước và lớp thư pháp bây giờ."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 5 — Anna: piano ngày trước, thư pháp bây giờ",
        "lines": [
          {
            "who": "山口",
            "role": "c",
            "text": "アンナさん、{趣味|しゅみ}は{何|なん}ですか。",
            "ro": "Anna-san, shumi wa nan desu ka.",
            "vi": "Anna, sở thích của em là gì?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "ピアノを{弾|ひ}くことです。{国|くに}で{十年|じゅうねん}{習|なら}いました。",
            "ro": "Piano o hiku koto desu. Kuni de juunen naraimashita.",
            "vi": "Là chơi piano. Em đã học mười năm ở nước em."
          },
          {
            "who": "山口",
            "role": "c",
            "text": "すごいですね。{今|いま}もよく{弾|ひ}きますか。",
            "ro": "Sugoi desu ne. Ima mo yoku hikimasu ka.",
            "vi": "Giỏi quá nhỉ. Bây giờ em vẫn hay chơi chứ?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "いいえ、うちにピアノがありませんから、{最近|さいきん}{全然|ぜんぜん}{弾|ひ}きません。でも、{先月|せんげつ}から{書道|しょどう}を{習|なら}っています。",
            "ro": "Iie, uchi ni piano ga arimasen kara, saikin zenzen hikimasen. Demo, sengetsu kara shodou o naratte imasu.",
            "vi": "Không ạ, nhà em không có piano nên dạo này em hoàn toàn không chơi. Nhưng từ tháng trước em học thư pháp."
          },
          {
            "who": "山口",
            "role": "c",
            "text": "へえ、{書道|しょどう}ですか。{一週間|いっしゅうかん}に{何回|なんかい}{習|なら}いますか。",
            "ro": "Hee, shodou desu ka. Isshuukan ni nankai naraimasu ka.",
            "vi": "Ồ, thư pháp à. Một tuần em học mấy buổi?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "{二回|にかい}です。{火曜日|かようび}と{金曜日|きんようび}に{教室|きょうしつ}へ{行|い}きます。",
            "ro": "Nikai desu. Kayoubi to kin'youbi ni kyoushitsu e ikimasu.",
            "vi": "Hai buổi ạ. Thứ Ba và thứ Sáu em đến lớp."
          },
          {
            "who": "山口",
            "role": "c",
            "text": "{上手|じょうず}に{書|か}くことができますか。",
            "ro": "Jouzu ni kaku koto ga dekimasu ka.",
            "vi": "Em viết đẹp được chưa?"
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "まだあまりできません。でも、{来月|らいげつ}のコンテストに{参加|さんか}したいです。",
            "ro": "Mada amari dekimasen. Demo, raigetsu no kontesuto ni sanka shitai desu.",
            "vi": "Em vẫn chưa viết đẹp lắm. Nhưng em muốn tham gia cuộc thi tháng sau."
          },
          {
            "who": "山口",
            "role": "c",
            "text": "いいですね。{私|わたし}も{見|み}に{行|い}きますよ。",
            "ro": "Ii desu ne. Watashi mo mini ikimasu yo.",
            "vi": "Hay quá. Chị cũng sẽ đến xem đấy."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ht5-hieu",
        "title": "Hội thoại 5 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Sở thích của Anna là gì?",
            "options": [
              "Chơi piano",
              "Nghe nhạc cổ điển",
              "Hát",
              "Thư pháp"
            ],
            "correct": 0,
            "why": "ピアノを 弾く ことです."
          },
          {
            "q": "Anna đã học piano bao lâu, ở đâu?",
            "options": [
              "Mười năm, ở Nhật",
              "Một năm, ở nước mình",
              "Từ tháng trước",
              "Mười năm, ở nước mình"
            ],
            "correct": 3,
            "why": "国で 十年 習いました."
          },
          {
            "q": "Bây giờ Anna có hay chơi piano không? Vì sao?",
            "options": [
              "Hoàn toàn không, vì nhà không có piano",
              "Không chơi vì bận",
              "Thỉnh thoảng, ở trường",
              "Có, mỗi ngày"
            ],
            "correct": 0,
            "why": "うちに ピアノが ありませんから、最近 全然 弾きません."
          },
          {
            "q": "Từ tháng trước Anna học gì?",
            "options": [
              "Nhảy",
              "Thư pháp",
              "Nấu ăn",
              "Piano"
            ],
            "correct": 1,
            "why": "先月から 書道を 習っています."
          },
          {
            "q": "Anna học thư pháp mấy buổi một tuần?",
            "options": [
              "Hai buổi: thứ Ba và thứ Sáu",
              "Một buổi: thứ Sáu",
              "Ba buổi",
              "Hai buổi: thứ Hai và thứ Năm"
            ],
            "correct": 0,
            "why": "二回です。火曜日と 金曜日."
          },
          {
            "q": "Tháng sau Anna muốn làm gì?",
            "options": [
              "Mua piano",
              "Về nước",
              "Dạy thư pháp",
              "Tham gia cuộc thi thư pháp"
            ],
            "correct": 3,
            "why": "来月の コンテストに 参加したいです."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b9-ht5-dien",
        "title": "Hội thoại 5 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "アンナ：ピアノを{弾|ひ}く＿＿です。　〔Anna: piano o hiku __ desu.〕",
            "answers": [
              "こと"
            ],
            "hint": "V こと です"
          },
          {
            "q": "アンナ：{最近|さいきん}{全然|ぜんぜん}{弾|ひ}き＿＿。　〔Anna: saikin zenzen hiki__.〕",
            "answers": [
              "ません"
            ],
            "hint": "全然 + phủ định"
          },
          {
            "q": "アンナ：＿＿、{先月|せんげつ}から{書道|しょどう}を{習|なら}っています。　〔Anna: __, sengetsu kara shodou o naratte imasu.〕",
            "answers": [
              "でも"
            ],
            "hint": "Trái ý — đầu câu"
          },
          {
            "q": "アンナ：{来月|らいげつ}のコンテスト＿＿{参加|さんか}したいです。　〔Anna: raigetsu no kontesuto __ sanka shitai desu.〕",
            "answers": [
              "に"
            ],
            "hint": "N に 参加します"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-ht5-sx",
        "title": "Hội thoại 5 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi sở thích → piano, học 10 năm → hỏi bây giờ còn chơi không → không, nhưng học thư pháp.",
            "chips": [
              "ピアノを{弾|ひ}くことです。{国|くに}で{十年|じゅうねん}{習|なら}いました。",
              "アンナさん、{趣味|しゅみ}は{何|なん}ですか。",
              "いいえ、うちにピアノがありませんから、{最近|さいきん}{全然|ぜんぜん}{弾|ひ}きません。でも、{先月|せんげつ}から{書道|しょどう}を{習|なら}っています。",
              "すごいですね。{今|いま}もよく{弾|ひ}きますか。"
            ],
            "answer": [
              "アンナさん、{趣味|しゅみ}は{何|なん}ですか。",
              "ピアノを{弾|ひ}くことです。{国|くに}で{十年|じゅうねん}{習|なら}いました。",
              "すごいですね。{今|いま}もよく{弾|ひ}きますか。",
              "いいえ、うちにピアノがありませんから、{最近|さいきん}{全然|ぜんぜん}{弾|ひ}きません。でも、{先月|せんげつ}から{書道|しょどう}を{習|なら}っています。"
            ],
            "ro": "Anna-san, shumi wa nan desu ka. Piano o hiku koto desu. Kuni de juunen naraimashita. Sugoi desu ne. Ima mo yoku hikimasu ka. Iie, uchi ni piano ga arimasen kara, saikin zenzen hikimasen. Demo, sengetsu kara shodou o naratte imasu."
          }
        ]
      },
      {
        "t": "h",
        "text": "Tự nói có mẫu — che một vai và nói vai đó"
      },
      {
        "t": "note",
        "title": "Cách tự nói",
        "items": [
          "Nghe cả bài một lần. Che lời của **B**, tự nói vai B, nghe mẫu để so. Đổi vai.",
          "Thay từ: 写真を撮る → 絵を描く／音楽を聞く; スキー → 運転／ダンス; 一週間に二回 → 一か月に一回／一日に三杯; バスに乗って → 電車に乗って."
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 1 — Sở thích",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "{趣味|しゅみ}は{何|なん}ですか。",
            "ro": "Shumi wa nan desu ka.",
            "vi": "Sở thích của bạn là gì?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{写真|しゃしん}を{撮|と}ることです。{特|とく}に{山|やま}の{写真|しゃしん}が{好|す}きです。",
            "ro": "Shashin o toru koto desu. Tokuni yama no shashin ga suki desu.",
            "vi": "Là chụp ảnh. Mình đặc biệt thích ảnh núi."
          },
          {
            "who": "A",
            "role": "a",
            "text": "よく{撮|と}りに{行|い}きますか。",
            "ro": "Yoku torini ikimasu ka.",
            "vi": "Bạn có hay đi chụp không?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "はい、{一|いっ}か{月|げつ}に{二回|にかい}ぐらい{行|い}きます。",
            "ro": "Hai, ikkagetsu ni nikai gurai ikimasu.",
            "vi": "Có, khoảng một tháng hai lần."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 2 — Làm được không",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "スキーができますか。",
            "ro": "Sukii ga dekimasu ka.",
            "vi": "Bạn trượt tuyết được không?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "いいえ、{全然|ぜんぜん}できません。でも、{習|なら}いたいです。",
            "ro": "Iie, zenzen dekimasen. Demo, naraitai desu.",
            "vi": "Không, hoàn toàn không. Nhưng mình muốn học."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 3 — Cuối tuần đã làm gì",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "{週末|しゅうまつ}、{何|なに}をしましたか。",
            "ro": "Shuumatsu, nani o shimashita ka.",
            "vi": "Cuối tuần bạn đã làm gì?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{友達|ともだち}に{会|あ}って、{映画|えいが}を{見|み}て、{一緒|いっしょ}に{晩|ばん}ご{飯|はん}を{食|た}べました。",
            "ro": "Tomodachi ni atte, eiga o mite, issho ni bangohan o tabemashita.",
            "vi": "Mình gặp bạn, xem phim rồi cùng ăn tối."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 4 — Đi bằng cách nào",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "どうやって{学校|がっこう}へ{来|き}ますか。",
            "ro": "Douyatte gakkou e kimasu ka.",
            "vi": "Bạn đến trường bằng cách nào?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "{駅|えき}から{三番|さんばん}のバスに{乗|の}って、{学校|がっこう}の{前|まえ}で{降|お}ります。",
            "ro": "Eki kara sanban no basu ni notte, gakkou no mae de orimasu.",
            "vi": "Từ ga mình lên xe buýt số 3, xuống ở trước trường."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b9-ht-noi",
        "part": "1",
        "questions": [
          "しゅみは なんですか。",
          "なにが できますか。",
          "およぐ ことが できますか。",
          "よく えいがを みますか。",
          "いっしゅうかんに なんかい にほんごを べんきょうしますか。",
          "しゅうまつ、なにを しましたか。",
          "どうやって がっこうへ きますか。",
          "いちにちに コーヒーを なんばい のみますか。",
          "さいきん、なにか ならっていますか。"
        ]
      }
    ]
  },
  {
    "id": "lt-b9-doc-hieu",
    "kind": "reading",
    "title": "Luyện thêm Bài 9 · Đọc hiểu — 4 đoạn dài dần + 4 đoạn KHÔNG furigana (~43 câu)",
    "goal": "Đọc hiểu đoạn văn về sở thích, thông báo lớp học, email chỉ đường và cuối tuần: tìm đúng tần suất, số lần/số lượng, thời gian–giá, các bước và đường đi; đọc được đoạn không furigana như đề thi.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đọc **2 lượt**: lượt 1 tìm **sở thích / chủ đề**; lượt 2 gạch dưới **con số** (～回・～冊・～杯, giờ, giá), **tần suất** (いつも／よく／ときどき／あまり／全然) và **các bước** (Vて、Vて、V).",
          "Bẫy hay gặp: **でも** đổi ý (trước ↔ bây giờ) · **だけ** (chỉ) · từ đếm khác nhau trong cùng đoạn · **乗ります / 降ります** khi chỉ đường.",
          "Mức Khó dùng **readkanji** không furigana: chỉ chữ Hán đã học đến Bài 9. Đọc to, rồi bấm xem."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đoạn 1 — sở thích câu cá"
      },
      {
        "t": "passage",
        "title": "Đoạn 1 — Sở thích của Carlos",
        "intro": "Có furigana. Tìm: sở thích · bao lâu một lần · đi bằng gì · chuyện bất ngờ.",
        "paras": [
          {
            "label": "A",
            "text": "{私|わたし}の{趣味|しゅみ}は{釣|つ}りです。{一|いっ}か{月|げつ}に{二回|にかい}ぐらい、{川|かわ}へ{行|い}きます。{朝|あさ}{早|はや}く{起|お}きて、{車|くるま}を{運転|うんてん}して{行|い}きます。{川|かわ}に{魚|さかな}がたくさんいます。でも、{私|わたし}は{魚|さかな}を{食|た}べることができません。{魚|さかな}は{友達|ともだち}にあげます。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}の{趣味|しゅみ}は{釣|つ}りです。",
            "ro": "Watashi no shumi wa tsuri desu.",
            "vi": "Sở thích của tôi là câu cá."
          },
          {
            "en": "{一|いっ}か{月|げつ}に{二回|にかい}ぐらい、{川|かわ}へ{行|い}きます。",
            "ro": "Ikkagetsu ni nikai gurai, kawa e ikimasu.",
            "vi": "Một tháng tôi đi sông khoảng hai lần."
          },
          {
            "en": "{朝|あさ}{早|はや}く{起|お}きて、{車|くるま}を{運転|うんてん}して{行|い}きます。",
            "ro": "Asa hayaku okite, kuruma o unten shite ikimasu.",
            "vi": "Tôi dậy sớm rồi lái xe đi."
          },
          {
            "en": "{川|かわ}に{魚|さかな}がたくさんいます。",
            "ro": "Kawa ni sakana ga takusan imasu.",
            "vi": "Ở sông có nhiều cá."
          },
          {
            "en": "でも、{私|わたし}は{魚|さかな}を{食|た}べることができません。",
            "ro": "Demo, watashi wa sakana o taberu koto ga dekimasen.",
            "vi": "Nhưng tôi không ăn được cá."
          },
          {
            "en": "{魚|さかな}は{友達|ともだち}にあげます。",
            "ro": "Sakana wa tomodachi ni agemasu.",
            "vi": "Cá thì tôi cho bạn bè."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-doc1-q",
        "title": "Đoạn 1 — câu hỏi (6 câu)",
        "items": [
          {
            "q": "Sở thích của Carlos là gì?",
            "options": [
              "Nấu cá",
              "Lái xe",
              "Câu cá",
              "Bơi"
            ],
            "correct": 2,
            "why": "趣味は 釣りです."
          },
          {
            "q": "Carlos đi câu bao lâu một lần?",
            "options": [
              "Một năm hai lần",
              "Một tháng khoảng hai lần",
              "Một tuần hai lần",
              "Mỗi ngày"
            ],
            "correct": 1,
            "why": "一か月に 二回 ぐらい."
          },
          {
            "q": "Carlos đi câu ở đâu?",
            "options": [
              "Ở biển",
              "Ở bể bơi",
              "Ở sông",
              "Ở hồ trong công viên"
            ],
            "correct": 2,
            "why": "川へ 行きます."
          },
          {
            "q": "Carlos đến đó bằng gì?",
            "options": [
              "Tự lái ô tô",
              "Tàu điện",
              "Xe đạp",
              "Xe buýt"
            ],
            "correct": 0,
            "why": "車を 運転して 行きます."
          },
          {
            "q": "Điều gì bất ngờ về Carlos?",
            "options": [
              "Anh ấy không thích sông",
              "Anh ấy không có ô tô",
              "Anh ấy không ăn được cá",
              "Anh ấy không biết bơi"
            ],
            "correct": 2,
            "why": "でも、魚を 食べる ことが できません."
          },
          {
            "q": "Cá câu được thì làm gì?",
            "options": [
              "Nấu ăn ở nhà",
              "Cho bạn bè",
              "Thả lại sông",
              "Bán đi"
            ],
            "correct": 1,
            "why": "魚は 友達に あげます."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đoạn 2–3 — tờ thông báo lớp nấu ăn · email mời đi karaoke"
      },
      {
        "t": "passage",
        "title": "Đoạn 2 — Thông báo: Lớp nấu ăn",
        "intro": "Kiểu tờ thông báo dán ở bảng tin: tìm thời gian · giá · món · ai tham gia được · cách đăng ký.",
        "paras": [
          {
            "label": "A",
            "text": "【{料理|りょうり}{教室|きょうしつ}】いろいろな{国|くに}の{料理|りょうり}を{作|つく}りましょう。{毎週|まいしゅう}{土曜日|どようび}{午前|ごぜん}{十時|じゅうじ}から{十二時|じゅうにじ}まで。{一回|いっかい}{千五百円|せんごひゃくえん}です。"
          },
          {
            "label": "B",
            "text": "{今月|こんげつ}はイタリア{料理|りょうり}とタイ{料理|りょうり}です。{外国人|がいこくじん}も{参加|さんか}することができます。{受付|うけつけ}で{名前|なまえ}と{電話番号|でんわばんごう}を{書|か}いて、{申|もう}し{込|こ}んでください。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "【{料理|りょうり}{教室|きょうしつ}】",
            "ro": "【 ryouri kyoushitsu 】",
            "vi": "[Lớp nấu ăn]"
          },
          {
            "en": "いろいろな{国|くに}の{料理|りょうり}を{作|つく}りましょう。",
            "ro": "Iroiro na kuni no ryouri o tsukurimashou.",
            "vi": "Cùng nấu món ăn của nhiều nước nào."
          },
          {
            "en": "{毎週|まいしゅう}{土曜日|どようび}{午前|ごぜん}{十時|じゅうじ}から{十二時|じゅうにじ}まで。",
            "ro": "Maishuu doyoubi gozen juuji kara juuniji made.",
            "vi": "Thứ Bảy hàng tuần, từ 10 giờ sáng đến 12 giờ trưa."
          },
          {
            "en": "{一回|いっかい}{千五百円|せんごひゃくえん}です。",
            "ro": "Ikkai sengohyakuen desu.",
            "vi": "Mỗi buổi 1.500 yên."
          },
          {
            "en": "{今月|こんげつ}はイタリア{料理|りょうり}とタイ{料理|りょうり}です。",
            "ro": "Kongetsu wa Itaria-ryouri to Tai-ryouri desu.",
            "vi": "Tháng này là món Ý và món Thái."
          },
          {
            "en": "{外国人|がいこくじん}も{参加|さんか}することができます。",
            "ro": "Gaikokujin mo sanka suru koto ga dekimasu.",
            "vi": "Người nước ngoài cũng có thể tham gia."
          },
          {
            "en": "{受付|うけつけ}で{名前|なまえ}と{電話番号|でんわばんごう}を{書|か}いて、{申|もう}し{込|こ}んでください。",
            "ro": "Uketsuke de namae to denwabangou o kaite, moushikonde kudasai.",
            "vi": "Hãy viết tên và số điện thoại ở quầy lễ tân để đăng ký."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-doc2-q",
        "title": "Đoạn 2 — câu hỏi (7 câu)",
        "items": [
          {
            "q": "Đây là thông báo về cái gì?",
            "options": [
              "Chợ đồ ăn",
              "Nhà hàng mới",
              "Lớp nấu ăn",
              "Cuộc thi nấu ăn"
            ],
            "correct": 2,
            "why": "料理教室."
          },
          {
            "q": "Lớp học vào lúc nào?",
            "options": [
              "Mỗi ngày",
              "Thứ Bảy hàng tuần",
              "Chủ nhật hàng tuần",
              "Thứ Bảy tuần này"
            ],
            "correct": 1,
            "why": "毎週 土曜日."
          },
          {
            "q": "Lớp học kéo dài bao lâu?",
            "options": [
              "Hai tiếng (10 giờ – 12 giờ)",
              "Một tiếng",
              "Cả ngày",
              "Ba tiếng"
            ],
            "correct": 0,
            "why": "十時から 十二時まで."
          },
          {
            "q": "Học phí thế nào?",
            "options": [
              "1.500 yên mỗi buổi",
              "15.000 yên",
              "1.500 yên mỗi tháng",
              "Miễn phí"
            ],
            "correct": 0,
            "why": "一回 千五百円."
          },
          {
            "q": "Tháng này học món gì?",
            "options": [
              "Món Nhật",
              "Món Việt",
              "Món Ý và món Thái",
              "Món Ý và món Nhật"
            ],
            "correct": 2,
            "why": "イタリア料理と タイ料理."
          },
          {
            "q": "Người nước ngoài có tham gia được không?",
            "options": [
              "Được",
              "Không được",
              "Chỉ khi biết tiếng Nhật giỏi",
              "Không nói"
            ],
            "correct": 0,
            "why": "外国人も 参加する ことが できます."
          },
          {
            "q": "Đăng ký thế nào?",
            "options": [
              "Gửi email",
              "Viết tên và số điện thoại ở quầy lễ tân",
              "Đặt trên mạng",
              "Gọi điện"
            ],
            "correct": 1,
            "why": "受付で 名前と 電話番号を 書いて."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đoạn 3 — Email của Daniel: rủ đi karaoke",
        "intro": "Tìm: ngày, giờ, giá · đường đi (lên xe gì, xuống ở đâu) · vì sao mọi người muốn Natapon đến.",
        "paras": [
          {
            "label": "A",
            "text": "ナタポンさんへ。{今度|こんど}の{金曜日|きんようび}、クラスのみんなでカラオケに{行|い}きます。ナタポンさんも{一緒|いっしょ}に{行|い}きませんか。カラオケの{店|みせ}は{駅|えき}から{少|すこ}し{遠|とお}いです。"
          },
          {
            "label": "B",
            "text": "{駅|えき}の{前|まえ}から{七番|ななばん}のバスに{乗|の}って、{公園|こうえん}{前|まえ}で{降|お}りてください。バス{停|てい}の{隣|となり}に{店|みせ}があります。{七時|しちじ}から{九時|くじ}までです。{一人|ひとり}{千円|せんえん}です。みんなナタポンさんの{歌|うた}を{聞|き}きたいですよ。ダニエル"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "ナタポンさんへ。",
            "ro": "Natapon-san e.",
            "vi": "Gửi Natapon,"
          },
          {
            "en": "{今度|こんど}の{金曜日|きんようび}、クラスのみんなでカラオケに{行|い}きます。",
            "ro": "Kondo no kin'youbi, kurasu no minna de karaoke ni ikimasu.",
            "vi": "Thứ Sáu tới cả lớp đi karaoke."
          },
          {
            "en": "ナタポンさんも{一緒|いっしょ}に{行|い}きませんか。",
            "ro": "Natapon-san mo issho ni ikimasen ka.",
            "vi": "Natapon cũng đi cùng không?"
          },
          {
            "en": "カラオケの{店|みせ}は{駅|えき}から{少|すこ}し{遠|とお}いです。",
            "ro": "Karaoke no mise wa eki kara sukoshi tooi desu.",
            "vi": "Quán karaoke hơi xa ga."
          },
          {
            "en": "{駅|えき}の{前|まえ}から{七番|ななばん}のバスに{乗|の}って、{公園|こうえん}{前|まえ}で{降|お}りてください。",
            "ro": "Eki no mae kara nanaban no basu ni notte, kouen mae de orite kudasai.",
            "vi": "Từ trước ga, hãy lên xe buýt số 7 và xuống ở trạm trước công viên."
          },
          {
            "en": "バス{停|てい}の{隣|となり}に{店|みせ}があります。",
            "ro": "Basutei no tonari ni mise ga arimasu.",
            "vi": "Quán ở ngay cạnh trạm xe buýt."
          },
          {
            "en": "{七時|しちじ}から{九時|くじ}までです。{一人|ひとり}{千円|せんえん}です。",
            "ro": "Shichiji kara kuji made desu. Hitori sen'en desu.",
            "vi": "Từ 7 giờ đến 9 giờ. Mỗi người 1.000 yên."
          },
          {
            "en": "みんなナタポンさんの{歌|うた}を{聞|き}きたいですよ。",
            "ro": "Minna Natapon-san no uta o kikitai desu yo.",
            "vi": "Mọi người muốn nghe Natapon hát lắm đấy."
          },
          {
            "en": "ダニエル",
            "ro": "Danieru",
            "vi": "Daniel"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-doc3-q",
        "title": "Đoạn 3 — câu hỏi (9 câu)",
        "items": [
          {
            "q": "Ai gửi email cho ai?",
            "options": [
              "Natapon gửi Daniel",
              "Cô giáo gửi Daniel",
              "Daniel gửi cả lớp",
              "Daniel gửi Natapon"
            ],
            "correct": 3,
            "why": "ナタポンさんへ … ダニエル."
          },
          {
            "q": "Cả lớp đi karaoke khi nào?",
            "options": [
              "Thứ Sáu tới",
              "Thứ Sáu tuần trước",
              "Thứ Bảy tới",
              "Tối nay"
            ],
            "correct": 0,
            "why": "今度の 金曜日."
          },
          {
            "q": "Quán karaoke ở đâu so với ga?",
            "options": [
              "Rất gần ga",
              "Ngay trước ga",
              "Trong ga",
              "Hơi xa ga"
            ],
            "correct": 3,
            "why": "駅から 少し 遠いです."
          },
          {
            "q": "Đi đến quán thế nào?",
            "options": [
              "Đi tàu điện",
              "Lên xe buýt số 1 ở công viên",
              "Đi bộ từ ga",
              "Lên xe buýt số 7 ở trước ga"
            ],
            "correct": 3,
            "why": "七番の バスに 乗って."
          },
          {
            "q": "Xuống xe ở đâu?",
            "options": [
              "Trước quán karaoke",
              "Trạm trước ga",
              "Trạm trước công viên",
              "Trạm trước trường"
            ],
            "correct": 2,
            "why": "公園前で 降りてください."
          },
          {
            "q": "Quán ở đâu so với trạm xe buýt?",
            "options": [
              "Cách trạm 10 phút",
              "Ngay cạnh trạm",
              "Sau công viên",
              "Đối diện trạm"
            ],
            "correct": 1,
            "why": "バス停の 隣に 店が あります."
          },
          {
            "q": "Thời gian và giá?",
            "options": [
              "7 giờ – 9 giờ, 7.000 yên",
              "7 giờ – 9 giờ, miễn phí",
              "7 giờ – 9 giờ, 1.000 yên/người",
              "9 giờ – 11 giờ, 1.000 yên"
            ],
            "correct": 2,
            "why": "七時から 九時まで · 一人 千円."
          },
          {
            "q": "Vì sao mọi người muốn Natapon đến?",
            "options": [
              "Natapon trả tiền",
              "Muốn nghe Natapon hát",
              "Natapon biết đường",
              "Natapon có xe ô tô"
            ],
            "correct": 1,
            "why": "みんな ナタポンさんの 歌を 聞きたいです."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "Quán karaoke ở trong ga",
              "Natapon đã nhận lời",
              "Daniel rủ Natapon đi cùng",
              "Đi đến quán phải đổi xe hai lần"
            ],
            "correct": 2,
            "why": "一緒に 行きませんか (rủ — chưa biết Natapon trả lời)."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đoạn 4 dài + đoạn không furigana"
      },
      {
        "t": "passage",
        "title": "Đoạn 4 — Cuối tuần của tôi",
        "intro": "Đoạn dài: tách thành 3 khối (thứ Bảy · Chủ nhật · trước đây và bây giờ). Chú ý chuỗi Vて và でも.",
        "paras": [
          {
            "label": "A",
            "text": "{私|わたし}は{毎週|まいしゅう}{土曜日|どようび}に{書道|しょどう}{教室|きょうしつ}へ{行|い}きます。{先生|せんせい}は{七十歳|ななじゅっさい}ですが、とても{元気|げんき}です。{教室|きょうしつ}で{二時間|にじかん}ぐらい{漢字|かんじ}を{書|か}いて、{先生|せんせい}とお{茶|ちゃ}を{飲|の}んで、{帰|かえ}ります。"
          },
          {
            "label": "B",
            "text": "{日曜日|にちようび}は{朝|あさ}{九時|くじ}ごろ{起|お}きて、{洗濯|せんたく}をして、{部屋|へや}を{掃除|そうじ}します。{午後|ごご}はときどき{友達|ともだち}と{映画|えいが}を{見|み}に{行|い}きます。{特|とく}にアクション{映画|えいが}が{好|す}きです。"
          },
          {
            "label": "C",
            "text": "{前|まえ}はよくゲームをしました。でも、{最近|さいきん}は{全然|ぜんぜん}しません。{来月|らいげつ}、{書道|しょどう}のコンテストがありますから、{毎日|まいにち}うちで{少|すこ}し{書|か}いています。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}は{毎週|まいしゅう}{土曜日|どようび}に{書道|しょどう}{教室|きょうしつ}へ{行|い}きます。",
            "ro": "Watashi wa maishuu doyoubi ni shodou kyoushitsu e ikimasu.",
            "vi": "Thứ Bảy hàng tuần tôi đến lớp thư pháp."
          },
          {
            "en": "{先生|せんせい}は{七十歳|ななじゅっさい}ですが、とても{元気|げんき}です。",
            "ro": "Sensei wa nanajussai desu ga, totemo genki desu.",
            "vi": "Thầy 70 tuổi nhưng rất khoẻ."
          },
          {
            "en": "{教室|きょうしつ}で{二時間|にじかん}ぐらい{漢字|かんじ}を{書|か}いて、{先生|せんせい}とお{茶|ちゃ}を{飲|の}んで、{帰|かえ}ります。",
            "ro": "Kyoushitsu de nijikan gurai kanji o kaite, sensei to ocha o nonde, kaerimasu.",
            "vi": "Ở lớp tôi viết chữ Hán khoảng hai tiếng, uống trà với thầy rồi về."
          },
          {
            "en": "{日曜日|にちようび}は{朝|あさ}{九時|くじ}ごろ{起|お}きて、{洗濯|せんたく}をして、{部屋|へや}を{掃除|そうじ}します。",
            "ro": "Nichiyoubi wa asa kuji goro okite, sentaku o shite, heya o souji shimasu.",
            "vi": "Chủ nhật tôi dậy khoảng 9 giờ, giặt đồ rồi dọn phòng."
          },
          {
            "en": "{午後|ごご}はときどき{友達|ともだち}と{映画|えいが}を{見|み}に{行|い}きます。",
            "ro": "Gogo wa tokidoki tomodachi to eiga o mini ikimasu.",
            "vi": "Buổi chiều thỉnh thoảng tôi đi xem phim với bạn."
          },
          {
            "en": "{特|とく}にアクション{映画|えいが}が{好|す}きです。",
            "ro": "Tokuni akushon eiga ga suki desu.",
            "vi": "Tôi đặc biệt thích phim hành động."
          },
          {
            "en": "{前|まえ}はよくゲームをしました。",
            "ro": "Mae wa yoku geemu o shimashita.",
            "vi": "Trước đây tôi hay chơi game."
          },
          {
            "en": "でも、{最近|さいきん}は{全然|ぜんぜん}しません。",
            "ro": "Demo, saikin wa zenzen shimasen.",
            "vi": "Nhưng dạo này hoàn toàn không chơi."
          },
          {
            "en": "{来月|らいげつ}、{書道|しょどう}のコンテストがありますから、{毎日|まいにち}うちで{少|すこ}し{書|か}いています。",
            "ro": "Raigetsu, shodou no kontesuto ga arimasu kara, mainichi uchi de sukoshi kaite imasu.",
            "vi": "Tháng sau có cuộc thi thư pháp nên ngày nào tôi cũng viết một chút ở nhà."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-doc4-q",
        "title": "Đoạn 4 — câu hỏi (9 câu)",
        "items": [
          {
            "q": "Tác giả đến lớp thư pháp khi nào?",
            "options": [
              "Thứ Bảy tuần sau",
              "Mỗi ngày",
              "Chủ nhật hàng tuần",
              "Thứ Bảy hàng tuần"
            ],
            "correct": 3,
            "why": "毎週 土曜日に."
          },
          {
            "q": "Thầy dạy thư pháp thế nào?",
            "options": [
              "Không nói",
              "70 tuổi và hay ốm",
              "Còn trẻ và vui tính",
              "70 tuổi nhưng rất khoẻ"
            ],
            "correct": 3,
            "why": "七十歳ですが、とても 元気です."
          },
          {
            "q": "Ở lớp, tác giả làm gì theo thứ tự?",
            "options": [
              "Uống trà → viết chữ Hán → về",
              "Viết chữ Hán → về → uống trà",
              "Viết chữ Hán → uống trà với thầy → về",
              "Uống trà → về → viết chữ Hán"
            ],
            "correct": 2,
            "why": "書いて → 飲んで → 帰ります."
          },
          {
            "q": "Sáng chủ nhật tác giả làm gì?",
            "options": [
              "Đến lớp thư pháp",
              "Ngủ cả buổi sáng",
              "Dậy 7 giờ, đi xem phim",
              "Dậy khoảng 9 giờ, giặt đồ, dọn phòng"
            ],
            "correct": 3,
            "why": "九時ごろ 起きて、洗濯を して、部屋を 掃除します."
          },
          {
            "q": "Chiều chủ nhật tác giả hay làm gì?",
            "options": [
              "Chơi game",
              "Thỉnh thoảng đi xem phim với bạn",
              "Luôn đi xem phim một mình",
              "Viết thư pháp"
            ],
            "correct": 1,
            "why": "ときどき 友達と 映画を 見に 行きます."
          },
          {
            "q": "Tác giả thích loại phim nào?",
            "options": [
              "Phim tài liệu",
              "Phim hài",
              "Phim hành động",
              "Phim hoạt hình"
            ],
            "correct": 2,
            "why": "特に アクション映画が 好き."
          },
          {
            "q": "Bây giờ tác giả có chơi game không?",
            "options": [
              "Thỉnh thoảng chơi",
              "Chỉ chơi cuối tuần",
              "Vẫn hay chơi",
              "Hoàn toàn không (trước đây hay chơi)"
            ],
            "correct": 3,
            "why": "前は よく … でも、最近は 全然 しません."
          },
          {
            "q": "Vì sao tác giả viết thư pháp ở nhà mỗi ngày?",
            "options": [
              "Vì tháng sau có cuộc thi",
              "Vì thầy bắt làm bài tập",
              "Vì muốn làm giáo viên",
              "Vì không đến lớp được"
            ],
            "correct": 0,
            "why": "来月、コンテストが ありますから."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "Thầy dạy thư pháp 70 tuổi",
              "Tác giả thích phim hành động",
              "Tác giả viết ở nhà mỗi ngày một chút",
              "Tác giả học thư pháp mỗi ngày ở lớp"
            ],
            "correct": 3,
            "why": "Đến lớp chỉ thứ Bảy; ở nhà mới viết mỗi ngày."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b9-doc-rk",
        "title": "Đọc to 4 đoạn KHÔNG furigana, rồi bấm xem (4 đoạn)",
        "note": "Đọc cả câu to, kể cả hiragana. Sau đó làm 8 câu hỏi bên dưới.",
        "items": [
          {
            "text": "{私|わたし}のしゅみは{歌|うた}を{歌|うた}うことです。{一|いっ}しゅうかんに{一|いっ}かい、ともだちとカラオケへ{行|い}きます。",
            "ro": "Watashi no shumi wa uta o utau koto desu. Isshuukan ni ikkai, tomodachi to karaoke e ikimasu.",
            "vi": "Sở thích của tôi là hát. Một tuần một lần tôi đi karaoke với bạn."
          },
          {
            "text": "{兄|あに}はくるまの{運転|うんてん}ができます。{毎朝|まいあさ}、{兄|あに}のくるまに{乗|の}って{大学|だいがく}へ{行|い}きます。",
            "ro": "Ani wa kuruma no unten ga dekimasu. Maiasa, ani no kuruma ni notte daigaku e ikimasu.",
            "vi": "Anh tôi biết lái ô tô. Sáng nào tôi cũng đi xe của anh đến trường đại học."
          },
          {
            "text": "{先月|せんげつ}から{料理|りょうり}を{習|なら}っています。{日本|にほん}の{料理|りょうり}はすこしむずかしいです。でも、たのしいです。",
            "ro": "Sengetsu kara ryouri o naratte imasu. Nihon no ryouri wa sukoshi muzukashii desu. Demo, tanoshii desu.",
            "vi": "Từ tháng trước tôi học nấu ăn. Món Nhật hơi khó. Nhưng vui."
          },
          {
            "text": "{日曜日|にちようび}、{弟|おとうと}とこうえんへ{行|い}って、{遊|あそ}びました。{弟|おとうと}はえを{描|か}いて、{私|わたし}は{本|ほん}を{読|よ}みました。",
            "ro": "Nichiyoubi, otouto to kouen e itte, asobimashita. Otouto wa e o kaite, watashi wa hon o yomimashita.",
            "vi": "Chủ nhật tôi đi công viên chơi với em trai. Em vẽ tranh, còn tôi đọc sách."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-doc-rk-q",
        "title": "Câu hỏi về 4 đoạn không furigana (8 câu)",
        "items": [
          {
            "q": "(Đoạn 1) Sở thích của tác giả là gì?",
            "options": [
              "Nhảy",
              "Chơi guitar",
              "Hát",
              "Nghe nhạc"
            ],
            "correct": 2,
            "why": "歌を 歌う ことです."
          },
          {
            "q": "(Đoạn 1) Tác giả đi karaoke bao lâu một lần?",
            "options": [
              "Mỗi ngày",
              "Một tuần một lần",
              "Một tháng một lần",
              "Một tuần hai lần"
            ],
            "correct": 1,
            "why": "一しゅうかんに 一かい."
          },
          {
            "q": "(Đoạn 2) Ai biết lái ô tô?",
            "options": [
              "Tác giả",
              "Bố tác giả",
              "Bạn tác giả",
              "Anh trai tác giả"
            ],
            "correct": 3,
            "why": "兄は くるまの 運転が できます."
          },
          {
            "q": "(Đoạn 2) Tác giả đến trường bằng gì?",
            "options": [
              "Tự lái ô tô",
              "Đi xe ô tô của anh trai",
              "Tàu điện",
              "Xe buýt"
            ],
            "correct": 1,
            "why": "兄の くるまに 乗って."
          },
          {
            "q": "(Đoạn 3) Tác giả học gì từ tháng trước?",
            "options": [
              "Thư pháp",
              "Nấu ăn",
              "Bơi",
              "Tiếng Nhật"
            ],
            "correct": 1,
            "why": "料理を 習っています."
          },
          {
            "q": "(Đoạn 3) Tác giả thấy món Nhật thế nào?",
            "options": [
              "Dễ và vui",
              "Khó và chán",
              "Hơi khó nhưng vui",
              "Ngon nhưng đắt"
            ],
            "correct": 2,
            "why": "すこし むずかしい … でも、たのしい."
          },
          {
            "q": "(Đoạn 4) Chủ nhật tác giả đi đâu với ai?",
            "options": [
              "Công viên, với anh trai",
              "Biển, với bạn",
              "Thư viện, với em trai",
              "Công viên, với em trai"
            ],
            "correct": 3,
            "why": "弟と こうえんへ 行って."
          },
          {
            "q": "(Đoạn 4) Ở đó em trai làm gì?",
            "options": [
              "Chơi bóng đá",
              "Bơi",
              "Đọc sách",
              "Vẽ tranh"
            ],
            "correct": 3,
            "why": "弟は えを 描いて."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b9-nghe",
    "kind": "listening",
    "title": "Luyện thêm Bài 9 · Nghe — sở thích, làm được → bao lâu một lần, cách đi, chuỗi việc → bẫy でも, lần ↔ cốc, đổi ý (19 đoạn, ~39 câu)",
    "goal": "Nghe ra sở thích, làm được hay không, tần suất và số lượng (回・杯・冊), thứ tự các việc và cách đi/cách đăng ký — không bị lừa khi người nói dùng でも, だけ hay đổi ý.",
    "minutes": 65,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Nghe **2 lần**: lần 1 bắt ý chính (sở thích gì, làm được hay không); lần 2 ghi **con số** (～回・～杯・～冊, giờ, số xe buýt) và **thứ tự các bước**.",
          "Bẫy quen thuộc: **でも** — trước đây ↔ bây giờ · **だけ** (chỉ) · **回 ↔ 杯** trong cùng câu (lần ↔ cốc) · người nói **đổi ý** cách đi · **は** đối lập (泳ぐことは できますが、ダイビングは…).",
          "Luyện shadowing: bật lại từng đoạn và nói đuổi theo — rất tốt cho câu hỏi thi nói 「しゅみは なんですか」「よく ～ますか」."
        ]
      },
      {
        "t": "recap",
        "title": "Từ khoá cần bắt tai",
        "items": [
          "**Sở thích / làm được**: ～ことです · ～が できます／できません · 少し · 全然.",
          "**Tần suất / số lượng**: いつも・よく・ときどき・あまり・全然 · 一週間に ～回 · 一日に ～杯 · ～冊 · ～本.",
          "**Cách làm / đi**: どうやって · ～に 乗って · ～で 降ります · ～て、～て、～ます · でも (đổi ý)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · chậm, ngắn — ○ hay ×"
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-1a",
        "title": "① (chậm)",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{趣味|しゅみ}は{何|なん}ですか。",
            "ro": "Shumi wa nan desu ka.",
            "vi": "Sở thích của bạn là gì?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{写真|しゃしん}を{撮|と}ることです。",
            "ro": "Shashin o toru koto desu.",
            "vi": "Là chụp ảnh."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-1b",
        "title": "② (chậm)",
        "lines": [
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "スキーができますか。",
            "ro": "Sukii ga dekimasu ka.",
            "vi": "Bạn trượt tuyết được không?"
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "はい、できます。",
            "ro": "Hai, dekimasu.",
            "vi": "Có, mình trượt được."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-1c",
        "title": "③",
        "lines": [
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "{泳|およ}ぐことができますか。",
            "ro": "Oyogu koto ga dekimasu ka.",
            "vi": "Bạn biết bơi không?"
          },
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "いいえ、{全然|ぜんぜん}できません。",
            "ro": "Iie, zenzen dekimasen.",
            "vi": "Không, mình hoàn toàn không biết."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-1d",
        "title": "④",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "よく{映画|えいが}を{見|み}ますか。",
            "ro": "Yoku eiga o mimasu ka.",
            "vi": "Bạn có hay xem phim không?"
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "いいえ、あまり{見|み}ません。",
            "ro": "Iie, amari mimasen.",
            "vi": "Không, mình không xem mấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-1e",
        "title": "⑤",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{車|くるま}の{運転|うんてん}ができますか。",
            "ro": "Kuruma no unten ga dekimasu ka.",
            "vi": "Bạn biết lái ô tô không?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "はい、{少|すこ}しできます。",
            "ro": "Hai, sukoshi dekimasu.",
            "vi": "Có, mình lái được một chút."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ng-1-q",
        "title": "Câu hỏi ①–⑤ (7 câu)",
        "items": [
          {
            "q": "① Sở thích của Anna là gì?",
            "options": [
              "Xem phim",
              "Sưu tầm tem",
              "Vẽ tranh",
              "Chụp ảnh"
            ],
            "correct": 3,
            "why": "写真を 撮る ことです."
          },
          {
            "q": "② Daniel trượt tuyết được không?",
            "options": [
              "× không",
              "○ được"
            ],
            "correct": 1,
            "why": "はい、できます."
          },
          {
            "q": "③ Park biết bơi không?",
            "options": [
              "× hoàn toàn không",
              "○ biết"
            ],
            "correct": 0,
            "why": "全然 できません."
          },
          {
            "q": "④ Carlos có hay xem phim không?",
            "options": [
              "× không mấy",
              "○ hay xem"
            ],
            "correct": 0,
            "why": "あまり 見ません."
          },
          {
            "q": "⑤ Marco lái ô tô được không?",
            "options": [
              "○ được một chút",
              "× không"
            ],
            "correct": 0,
            "why": "少し できます."
          },
          {
            "q": "⑤ Mức độ lái xe của Marco?",
            "options": [
              "Rất giỏi",
              "Không nói",
              "Hoàn toàn không",
              "Một chút"
            ],
            "correct": 3,
            "why": "少し."
          },
          {
            "q": "Trong ①–⑤, ai KHÔNG làm được việc được hỏi?",
            "options": [
              "Marco (lái xe)",
              "Daniel (trượt tuyết)",
              "Anna (chụp ảnh)",
              "Park (bơi)"
            ],
            "correct": 3,
            "why": "Park: 全然 できません."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · bao lâu một lần · số lượng · cách đi · chuỗi việc · でも · だけ"
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-2a",
        "title": "⑥ Mấy lần một tuần?",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{一週間|いっしゅうかん}に{何回|なんかい}テニスをしますか。",
            "ro": "Isshuukan ni nankai tenisu o shimasu ka.",
            "vi": "Một tuần bạn chơi tennis mấy lần?"
          },
          {
            "who": "山口",
            "voice": "ja-nu",
            "text": "{二回|にかい}します。{火曜日|かようび}と{土曜日|どようび}です。",
            "ro": "Nikai shimasu. Kayoubi to doyoubi desu.",
            "vi": "Hai lần. Thứ Ba và thứ Bảy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-2b",
        "title": "⑦ Mấy cốc một ngày?",
        "lines": [
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "コーヒーが{好|す}きですか。",
            "ro": "Koohii ga suki desu ka.",
            "vi": "Bạn thích cà phê không?"
          },
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "はい。{一日|いちにち}に{四杯|よんはい}{飲|の}みます。",
            "ro": "Hai. Ichinichi ni yonhai nomimasu.",
            "vi": "Có. Một ngày mình uống bốn cốc."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-2c",
        "title": "⑧ Mấy quyển một tháng?",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "{一|いっ}か{月|げつ}に{何冊|なんさつ}ぐらい{本|ほん}を{読|よ}みますか。",
            "ro": "Ikkagetsu ni nansatsu gurai hon o yomimasu ka.",
            "vi": "Một tháng bạn đọc khoảng mấy quyển sách?"
          },
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "{五冊|ごさつ}ぐらいです。{特|とく}に{小説|しょうせつ}が{好|す}きです。",
            "ro": "Gosatsu gurai desu. Tokuni shousetsu ga suki desu.",
            "vi": "Khoảng năm quyển. Mình đặc biệt thích tiểu thuyết."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-2d",
        "title": "⑨ Đến bể bơi thế nào?",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "すみません、プールへどうやって{行|い}きますか。",
            "ro": "Sumimasen, puuru e douyatte ikimasu ka.",
            "vi": "Xin lỗi, đến bể bơi đi thế nào ạ?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{二番|にばん}のバスに{乗|の}って、{公園|こうえん}{前|まえ}で{降|お}ります。",
            "ro": "Niban no basu ni notte, kouen mae de orimasu.",
            "vi": "Bạn lên xe buýt số 2, xuống ở trạm trước công viên."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-2e",
        "title": "⑩ Cuối tuần làm gì?",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{週末|しゅうまつ}、{何|なに}をしましたか。",
            "ro": "Shuumatsu, nani o shimashita ka.",
            "vi": "Cuối tuần bạn làm gì?"
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "{友達|ともだち}と{山|やま}に{登|のぼ}って、{写真|しゃしん}を{撮|と}って、{温泉|おんせん}に{入|はい}りました。",
            "ro": "Tomodachi to yama ni nobotte, shashin o totte, onsen ni hairimashita.",
            "vi": "Mình leo núi với bạn, chụp ảnh rồi tắm suối nước nóng."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-2f",
        "title": "⑪ Thích nhảy không?",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "ダンスが{好|す}きですか。",
            "ro": "Dansu ga suki desu ka.",
            "vi": "Bạn thích nhảy không?"
          },
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "はい、{好|す}きです。でも、{上手|じょうず}じゃありません。",
            "ro": "Hai, suki desu. Demo, jouzu ja arimasen.",
            "vi": "Có, mình thích. Nhưng mình nhảy không giỏi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-2g",
        "title": "⑫ Uống rượu không?",
        "lines": [
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "お{酒|さけ}を{飲|の}みますか。",
            "ro": "Osake o nomimasu ka.",
            "vi": "Bạn có uống rượu không?"
          },
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "ビールだけ{飲|の}みます。ワインは{飲|の}みません。",
            "ro": "Biiru dake nomimasu. Wain wa nomimasen.",
            "vi": "Mình chỉ uống bia. Rượu vang thì không."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ng-2-q",
        "title": "Câu hỏi ⑥–⑫ (12 câu)",
        "items": [
          {
            "q": "⑥ Yamaguchi chơi tennis mấy lần một tuần?",
            "options": [
              "Một lần",
              "Mỗi ngày",
              "Ba lần",
              "Hai lần"
            ],
            "correct": 3,
            "why": "二回 します."
          },
          {
            "q": "⑥ Vào những ngày nào?",
            "options": [
              "Thứ Ba và thứ Bảy",
              "Thứ Tư và thứ Bảy",
              "Thứ Ba và chủ nhật",
              "Thứ Hai và thứ Bảy"
            ],
            "correct": 0,
            "why": "火曜日と 土曜日."
          },
          {
            "q": "⑦ Mary uống mấy cốc cà phê một ngày?",
            "options": [
              "Năm",
              "Bốn",
              "Ba",
              "Hai"
            ],
            "correct": 1,
            "why": "四杯 (よんはい)."
          },
          {
            "q": "⑧ Natapon đọc khoảng mấy quyển một tháng?",
            "options": [
              "Một",
              "Mười",
              "Ba",
              "Năm"
            ],
            "correct": 3,
            "why": "五冊 ぐらい."
          },
          {
            "q": "⑧ Natapon đặc biệt thích gì?",
            "options": [
              "Tiểu thuyết",
              "Tạp chí",
              "Truyện tranh",
              "Sách tiếng Anh"
            ],
            "correct": 0,
            "why": "特に 小説が 好き."
          },
          {
            "q": "⑨ Đi bể bơi lên xe buýt số mấy?",
            "options": [
              "Số 5",
              "Số 2",
              "Số 7",
              "Số 12"
            ],
            "correct": 1,
            "why": "二番の バス."
          },
          {
            "q": "⑨ Xuống xe ở đâu?",
            "options": [
              "Trước trường",
              "Trước ga",
              "Trước công viên",
              "Trước bể bơi"
            ],
            "correct": 2,
            "why": "公園前で 降ります."
          },
          {
            "q": "⑩ Carlos làm gì TRƯỚC khi chụp ảnh?",
            "options": [
              "Gặp bạn ở ga",
              "Ăn trưa",
              "Leo núi",
              "Tắm suối nóng"
            ],
            "correct": 2,
            "why": "登って → 撮って → 入りました."
          },
          {
            "q": "⑩ Việc CUỐI CÙNG Carlos làm?",
            "options": [
              "Tắm suối nước nóng",
              "Về nhà ngủ",
              "Chụp ảnh",
              "Leo núi"
            ],
            "correct": 0,
            "why": "温泉に 入りました."
          },
          {
            "q": "⑪ Park có thích nhảy không?",
            "options": [
              "Có thích",
              "Không thích",
              "Thích nhưng chưa từng nhảy",
              "Không nói"
            ],
            "correct": 0,
            "why": "はい、好きです."
          },
          {
            "q": "⑪ Park nhảy có giỏi không?",
            "options": [
              "Không nói",
              "Rất giỏi",
              "Không giỏi",
              "Giỏi một chút"
            ],
            "correct": 2,
            "why": "でも、上手じゃ ありません."
          },
          {
            "q": "⑫ Wang uống gì?",
            "options": [
              "Chỉ uống rượu vang",
              "Chỉ uống bia",
              "Bia và rượu vang",
              "Không uống gì"
            ],
            "correct": 1,
            "why": "ビールだけ 飲みます."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bẫy でも (trước ↔ nay), lần ↔ cốc, đổi ý, các bước"
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-3a",
        "title": "⑬ Trước đây và bây giờ",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "よく{泳|およ}ぎますか。",
            "ro": "Yoku oyogimasu ka.",
            "vi": "Bạn có hay bơi không?"
          },
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "{前|まえ}は{毎日|まいにち}{泳|およ}ぎました。でも、{最近|さいきん}は{一|いっ}か{月|げつ}に{一回|いっかい}ぐらいです。",
            "ro": "Mae wa mainichi oyogimashita. Demo, saikin wa ikkagetsu ni ikkai gurai desu.",
            "vi": "Trước đây ngày nào mình cũng bơi. Nhưng dạo này chỉ khoảng một tháng một lần."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-3b",
        "title": "⑭ Đăng ký lớp nấu ăn",
        "lines": [
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "{料理|りょうり}{教室|きょうしつ}に{申|もう}し{込|こ}みたいです。",
            "ro": "Ryouri kyoushitsu ni moushikomitai desu.",
            "vi": "Tôi muốn đăng ký lớp nấu ăn."
          },
          {
            "who": "山口",
            "voice": "ja-nu",
            "text": "では、ここに{名前|なまえ}と{住所|じゅうしょ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。",
            "ro": "Deha, koko ni namae to juusho o kaite, gaikokujintourokushou o misete kudasai.",
            "vi": "Vậy chị hãy viết tên và địa chỉ vào đây rồi cho xem thẻ ngoại kiều."
          },
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "{電話番号|でんわばんごう}も{書|か}きますか。",
            "ro": "Denwabangou mo kakimasu ka.",
            "vi": "Tôi có viết cả số điện thoại không?"
          },
          {
            "who": "山口",
            "voice": "ja-nu",
            "text": "はい、お{願|ねが}いします。",
            "ro": "Hai, onegaishimasu.",
            "vi": "Vâng, nhờ chị."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-3c",
        "title": "⑮ Lần và cốc",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{一日|いちにち}に{何回|なんかい}お{茶|ちゃ}を{飲|の}みますか。",
            "ro": "Ichinichi ni nankai ocha o nomimasu ka.",
            "vi": "Một ngày bạn uống trà mấy lần?"
          },
          {
            "who": "木村",
            "voice": "ja-nu",
            "text": "{三回|さんかい}です。{一回|いっかい}に{二杯|にはい}{飲|の}みますから、{全部|ぜんぶ}で{六杯|ろっぱい}ですね。",
            "ro": "Sankai desu. Ikkai ni nihai nomimasu kara, zenbu de roppai desu ne.",
            "vi": "Ba lần. Mỗi lần uống hai cốc nên tổng cộng là sáu cốc nhỉ."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-3d",
        "title": "⑯ Đổi cách đi",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "{駅|えき}からバスで{行|い}きますか。",
            "ro": "Eki kara basu de ikimasu ka.",
            "vi": "Từ ga bạn đi xe buýt à?"
          },
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "バスは{時間|じかん}がかかりますから、{自転車|じてんしゃ}で{行|い}きます。",
            "ro": "Basu wa jikan ga kakarimasu kara, jitensha de ikimasu.",
            "vi": "Xe buýt mất thời gian nên mình đi xe đạp."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-3e",
        "title": "⑰ Viết được gì?",
        "lines": [
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "{日本語|にほんご}で{手紙|てがみ}を{書|か}くことができますか。",
            "ro": "Nihongo de tegami o kaku koto ga dekimasu ka.",
            "vi": "Bạn viết thư bằng tiếng Nhật được không?"
          },
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "ひらがなは{書|か}くことができます。でも、{漢字|かんじ}はあまり{書|か}くことができません。",
            "ro": "Hiragana wa kaku koto ga dekimasu. Demo, kanji wa amari kaku koto ga dekimasen.",
            "vi": "Hiragana thì viết được. Nhưng chữ Hán thì không viết được mấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-3f",
        "title": "⑱ Mua vé xem phim",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "どうやって{映画|えいが}のチケットを{買|か}いますか。",
            "ro": "Douyatte eiga no chiketto o kaimasu ka.",
            "vi": "Mua vé xem phim thế nào?"
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "インターネットで{予約|よやく}して、{映画館|えいがかん}の{受付|うけつけ}でお{金|かね}を{払|はら}います。",
            "ro": "Intaanetto de yoyaku shite, eigakan no uketsuke de okane o haraimasu.",
            "vi": "Đặt trên mạng rồi trả tiền ở quầy của rạp."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b9-ng-3g",
        "title": "⑲ Sở thích của Natapon",
        "lines": [
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "{私|わたし}の{趣味|しゅみ}は{絵|え}を{描|か}くことです。{毎週|まいしゅう}{日曜日|にちようび}、{公園|こうえん}へ{行|い}って、{花|はな}や{木|き}を{描|か}きます。{人|ひと}を{描|か}くことは{難|むずか}しいですから、あまり{描|か}きません。",
            "ro": "Watashi no shumi wa e o kaku koto desu. Maishuu nichiyoubi, kouen e itte, hana ya ki o kakimasu. Hito o kaku koto wa muzukashii desu kara, amari kakimasen.",
            "vi": "Sở thích của tôi là vẽ tranh. Chủ nhật hàng tuần tôi ra công viên vẽ hoa và cây. Vẽ người khó nên tôi không vẽ mấy."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-ng-3-q",
        "title": "Câu hỏi ⑬–⑲ (14 câu)",
        "items": [
          {
            "q": "⑬ Dạo này Anna bơi bao lâu một lần?",
            "options": [
              "Một tuần một lần",
              "Khoảng một tháng một lần",
              "Không bơi nữa",
              "Mỗi ngày"
            ],
            "correct": 1,
            "why": "でも、最近は 一か月に 一回 ぐらい — thông tin sau でも là hiện tại."
          },
          {
            "q": "⑬ Trước đây Anna bơi thế nào?",
            "options": [
              "Một tháng một lần",
              "Ngày nào cũng bơi",
              "Không bơi",
              "Một tuần hai lần"
            ],
            "correct": 1,
            "why": "前は 毎日 泳ぎました."
          },
          {
            "q": "⑭ Mary phải viết những gì?",
            "options": [
              "Chỉ tên",
              "Tên và số điện thoại",
              "Tên, địa chỉ và số điện thoại",
              "Địa chỉ email"
            ],
            "correct": 2,
            "why": "名前と 住所 + 電話番号も."
          },
          {
            "q": "⑭ Mary phải cho xem gì?",
            "options": [
              "Không cần gì",
              "Thẻ thư viện",
              "Hộ chiếu",
              "Thẻ ngoại kiều"
            ],
            "correct": 3,
            "why": "外国人登録証を 見せてください."
          },
          {
            "q": "⑮ Kimura uống trà mấy LẦN một ngày?",
            "options": [
              "Hai lần",
              "Sáu lần",
              "Ba lần",
              "Một lần"
            ],
            "correct": 2,
            "why": "三回です."
          },
          {
            "q": "⑮ Tổng cộng mấy CỐC?",
            "options": [
              "Hai",
              "Sáu",
              "Năm",
              "Ba"
            ],
            "correct": 1,
            "why": "全部で 六杯 (ろっぱい)."
          },
          {
            "q": "⑯ Cuối cùng Natapon đi bằng gì?",
            "options": [
              "Đi bộ",
              "Tàu điện",
              "Xe buýt",
              "Xe đạp"
            ],
            "correct": 3,
            "why": "バスは 時間が かかりますから、自転車で 行きます."
          },
          {
            "q": "⑯ Vì sao Natapon không đi xe buýt?",
            "options": [
              "Không có xe buýt",
              "Thích đi bộ",
              "Xe buýt đắt",
              "Xe buýt mất thời gian"
            ],
            "correct": 3,
            "why": "時間が かかりますから."
          },
          {
            "q": "⑰ Wang viết được gì?",
            "options": [
              "Hiragana",
              "Cả hiragana và chữ Hán",
              "Không viết được gì",
              "Chữ Hán"
            ],
            "correct": 0,
            "why": "ひらがなは 書く ことが できます."
          },
          {
            "q": "⑰ Chữ Hán thì sao?",
            "options": [
              "Hoàn toàn không viết được",
              "Không viết được mấy",
              "Viết được một ít",
              "Viết giỏi"
            ],
            "correct": 1,
            "why": "あまり 書く ことが できません."
          },
          {
            "q": "⑱ Bước ĐẦU TIÊN để mua vé?",
            "options": [
              "Đặt trước trên mạng",
              "Gọi điện cho rạp",
              "Xếp hàng ở rạp",
              "Trả tiền ở quầy"
            ],
            "correct": 0,
            "why": "インターネットで 予約して…."
          },
          {
            "q": "⑱ Trả tiền ở đâu?",
            "options": [
              "Trên mạng",
              "Cửa hàng tiện lợi",
              "Ở ga",
              "Quầy của rạp phim"
            ],
            "correct": 3,
            "why": "映画館の 受付で 払います."
          },
          {
            "q": "⑲ Natapon vẽ khi nào, ở đâu?",
            "options": [
              "Chủ nhật, ở bảo tàng",
              "Chủ nhật hàng tuần, ở công viên",
              "Mỗi ngày, ở trường",
              "Thứ Bảy, ở nhà"
            ],
            "correct": 1,
            "why": "毎週 日曜日、公園へ 行って."
          },
          {
            "q": "⑲ Natapon KHÔNG vẽ mấy cái gì? Vì sao?",
            "options": [
              "Người — vì khó",
              "Hoa — vì khó",
              "Phong cảnh — vì xa",
              "Cây — vì chán"
            ],
            "correct": 0,
            "why": "人を 描く ことは 難しいですから、あまり 描きません."
          }
        ]
      },
      {
        "t": "h",
        "text": "Nghe điền chỗ trống — nghe lại các đoạn trên rồi gõ"
      },
      {
        "t": "quiz",
        "id": "lt-b9-ng-dien",
        "title": "Nghe điền chỗ trống (6 câu)",
        "kind": "fill",
        "grammar": "Nghe lại đoạn được ghi trong gợi ý",
        "items": [
          {
            "q": "アンナ：{写真|しゃしん}を{撮|と}る＿＿です。　〔Anna: shashin o toru __ desu.〕",
            "answers": [
              "こと"
            ],
            "hint": "nghe ①"
          },
          {
            "q": "パク：いいえ、{全然|ぜんぜん}＿＿。　〔Paku: iie, zenzen __.〕",
            "answers": [
              "できません"
            ],
            "hint": "nghe ③"
          },
          {
            "q": "{山口|やまぐち}：{一週間|いっしゅうかん}に＿＿します。　〔Yamaguchi: isshuukan ni __ shimasu.〕",
            "answers": [
              "二回",
              "にかい"
            ],
            "hint": "Hai lần (nghe ⑥)"
          },
          {
            "q": "マルコ：{二番|にばん}のバス＿＿{乗|の}って、{公園|こうえん}{前|まえ}で{降|お}ります。　〔Maruko: niban no basu __ notte, kouen mae de orimasu.〕",
            "answers": [
              "に"
            ],
            "hint": "nghe ⑨"
          },
          {
            "q": "ワン：ビール＿＿{飲|の}みます。　〔Wan: biiru __ nomimasu.〕",
            "answers": [
              "だけ"
            ],
            "hint": "Chỉ (nghe ⑫)"
          },
          {
            "q": "アンナ：＿＿、{最近|さいきん}は{一|いっ}か{月|げつ}に{一回|いっかい}ぐらいです。　〔Anna: __, saikin wa ikkagetsu ni ikkai gurai desu.〕",
            "answers": [
              "でも"
            ],
            "hint": "Đổi ý (nghe ⑬)"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b9-noi-viet",
    "kind": "speaking",
    "title": "Luyện thêm Bài 9 · Nói & viết — 5 bộ tranh kiểu thi nói (3 câu tranh + 1 cá nhân) · đọc to · viết 3–5 câu",
    "goal": "Trả lời trọn câu các câu hỏi thi nói Bài 9 (sở thích, làm được, tần suất, cuối tuần, cách đi / thủ tục), đọc to trôi chảy, viết đoạn sở thích / việc làm được / cuối tuần / chỉ đường 3–5 câu.",
    "minutes": 90,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thi nói: **nghe → nghĩ không quá 10 giây → trả lời TRỌN CÂU → thêm 1 câu phụ**. Mỗi bộ có 3 câu nhìn \"tranh\" (mô tả trong khung) + 1 câu cá nhân: che lời \"Bạn\", tự nói, rồi nghe mẫu.",
          "Bốn khung \"ăn điểm\" của Bài 9: **sở thích** (～ことです・特に～) · **làm được** (～が できます／V こと が できません) · **tần suất** (一週間に ～回・よく／あまり) · **chuỗi việc / cách đi** (～て、～て、～ます · どうやって).",
          "Viết ngắn: 3–5 câu; soát **thể từ điển trước こと**, **が できます**, **に** sau khoảng thời gian, **あまり／全然 + ～ません**, **でも** ở đầu câu."
        ]
      },
      {
        "t": "recap",
        "title": "Cách tự chấm",
        "items": [
          "✅ Trả lời TRỌN CÂU · ✅ đúng thông tin theo tranh · ✅ thêm 1 câu phụ (tần suất, 特に, でも…) · ✅ không im lặng quá 10 giây.",
          "Nghe không rõ: 「もう いちど おねがいします。」 Quên từ đếm: nói bằng ～回 (lần) hoặc ～ぐらい cho an toàn."
        ]
      },
      {
        "t": "table",
        "head": [
          "Câu hỏi của giám khảo",
          "Khung trả lời an toàn",
          "Thêm 1 câu phụ"
        ],
        "rows": [
          [
            "しゅみは なんですか",
            "私の 趣味は ～ことです。",
            "特に ～が 好きです"
          ],
          [
            "～が できますか",
            "はい、できます。／いいえ、できません。",
            "少し できます／～を 習いたいです"
          ],
          [
            "よく ～ますか",
            "はい、よく ～ます。／いいえ、あまり ～ません。",
            "一週間に ～回 ぐらいです"
          ],
          [
            "いちにちに ～を なんばい のみますか",
            "～杯 飲みます。",
            "特に 朝 飲みます"
          ],
          [
            "しゅうまつ、なにを しましたか",
            "～て、～て、～ました。",
            "とても 楽しかったです"
          ],
          [
            "どうやって ～へ いきますか",
            "～に 乗って、～で 降ります。",
            "～分 ぐらいです"
          ],
          [
            "さいきん、なにか ならっていますか",
            "～を 習っています。",
            "一週間に ～回です"
          ]
        ],
        "caption": "Khung trả lời Bài 9 — luôn trả lời TRỌN CÂU rồi thêm 1 câu phụ"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · bộ tranh 1–2: sở thích · làm được"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Hai người: người A ngồi đọc truyện tranh (chồng truyện bên cạnh); người B ngồi bên sông với cần câu. Bên dưới là lịch tháng có 2 ngày đánh dấu hình con cá."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Sở thích (3 câu theo tranh + 1 câu cá nhân)",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{人|ひと}の{趣味|しゅみ}は{何|なん}ですか。",
            "ro": "Kono hito no shumi wa nan desu ka.",
            "vi": "(Tranh: người đọc truyện tranh) Sở thích của người này là gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{漫画|まんが}を{読|よ}むことです。",
            "ro": "Manga o yomu koto desu.",
            "vi": "Là đọc truyện tranh."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{人|ひと}は{何|なに}をしていますか。",
            "ro": "Kono hito wa nani o shite imasu ka.",
            "vi": "(Tranh: người bên sông) Người này đang làm gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{川|かわ}で{釣|つ}りをしています。",
            "ro": "Kawa de tsuri o shite imasu.",
            "vi": "Đang câu cá ở sông."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "よく{釣|つ}りをしますか。",
            "ro": "Yoku tsuri o shimasu ka.",
            "vi": "(Tranh: lịch có 2 ngày đánh dấu) Người đó có hay đi câu không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ときどきします。{一|いっ}か{月|げつ}に{二回|にかい}ぐらいです。",
            "ro": "Tokidoki shimasu. Ikkagetsu ni nikai gurai desu.",
            "vi": "Thỉnh thoảng. Khoảng một tháng hai lần."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "あなたの{趣味|しゅみ}は{何|なん}ですか。",
            "ro": "Anata no shumi wa nan desu ka.",
            "vi": "(Cá nhân) Sở thích của bạn là gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}を{聞|き}くことです。{特|とく}にポップスが{好|す}きです。",
            "ro": "Watashi no shumi wa ongaku o kiku koto desu. Tokuni poppusu ga suki desu.",
            "vi": "Sở thích của tôi là nghe nhạc. Đặc biệt tôi thích nhạc pop."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Ba ô: người trượt tuyết (dấu ○); người đứng bên bể bơi lắc đầu (dấu ×); người ngồi bên đàn piano (dấu △ = một chút)."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Làm được — không làm được",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "スキーができますか。",
            "ro": "Sukii ga dekimasu ka.",
            "vi": "(Tranh: ○) Người này trượt tuyết được không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、できます。{上手|じょうず}ですよ。",
            "ro": "Hai, dekimasu. Jouzu desu yo.",
            "vi": "Được ạ. Trượt giỏi lắm."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{泳|およ}ぐことができますか。",
            "ro": "Oyogu koto ga dekimasu ka.",
            "vi": "(Tranh: ×) Người này bơi được không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいえ、できません。",
            "ro": "Iie, dekimasen.",
            "vi": "Không, không bơi được."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ピアノはどうですか。",
            "ro": "Piano wa dou desu ka.",
            "vi": "(Tranh: △) Còn piano thì sao?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{少|すこ}し{弾|ひ}くことができます。",
            "ro": "Sukoshi hiku koto ga dekimasu.",
            "vi": "Chơi được một chút."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{何|なに}ができますか。",
            "ro": "Nani ga dekimasu ka.",
            "vi": "(Cá nhân) Bạn làm được gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{料理|りょうり}ができます。ベトナム{料理|りょうり}を{作|つく}ることができます。",
            "ro": "Ryouri ga dekimasu. Betonamu-ryouri o tsukuru koto ga dekimasu.",
            "vi": "Tôi biết nấu ăn. Tôi nấu được món Việt."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · bộ tranh 3–4: bao lâu một lần · cuối tuần"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Bảng sinh hoạt: ☕ × 3 mỗi ngày; 🎾 thứ Ba và thứ Bảy; 📖 1 quyển mỗi tháng."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Bao lâu một lần — bao nhiêu",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{一日|いちにち}にコーヒーを{何杯|なんばい}{飲|の}みますか。",
            "ro": "Ichinichi ni koohii o nanbai nomimasu ka.",
            "vi": "(Tranh: 3 cốc) Một ngày người này uống mấy cốc cà phê?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{三杯|さんばい}{飲|の}みます。",
            "ro": "Sanbai nomimasu.",
            "vi": "Uống ba cốc."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{一週間|いっしゅうかん}に{何回|なんかい}テニスをしますか。",
            "ro": "Isshuukan ni nankai tenisu o shimasu ka.",
            "vi": "(Tranh: thứ Ba, thứ Bảy) Một tuần chơi tennis mấy lần?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{二回|にかい}します。{火曜日|かようび}と{土曜日|どようび}です。",
            "ro": "Nikai shimasu. Kayoubi to doyoubi desu.",
            "vi": "Hai lần. Thứ Ba và thứ Bảy."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "よく{本|ほん}を{読|よ}みますか。",
            "ro": "Yoku hon o yomimasu ka.",
            "vi": "(Tranh: 1 quyển/tháng) Người này có hay đọc sách không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいえ、あまり{読|よ}みません。{一|いっ}か{月|げつ}に{一冊|いっさつ}ぐらいです。",
            "ro": "Iie, amari yomimasen. Ikkagetsu ni issatsu gurai desu.",
            "vi": "Không, không đọc mấy. Khoảng một tháng một quyển."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "よく{映画|えいが}を{見|み}ますか。",
            "ro": "Yoku eiga o mimasu ka.",
            "vi": "(Cá nhân) Bạn có hay xem phim không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、よく{見|み}ます。{一週間|いっしゅうかん}に{一回|いっかい}{映画館|えいがかん}へ{行|い}きます。",
            "ro": "Hai, yoku mimasu. Isshuukan ni ikkai eigakan e ikimasu.",
            "vi": "Có, tôi hay xem. Một tuần tôi đến rạp một lần."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Ba ô theo thứ tự: ① siêu thị (giỏ rau, thịt) → ② bếp, nồi cà ri → ③ bàn ăn có 3 người bạn."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Cuối tuần — chuỗi việc",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{週末|しゅうまつ}、{何|なに}をしましたか。",
            "ro": "Shuumatsu, nani o shimashita ka.",
            "vi": "(Tranh ①→③) Cuối tuần người này đã làm gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "スーパーへ{行|い}って、{料理|りょうり}を{作|つく}って、{友達|ともだち}と{食|た}べました。",
            "ro": "Suupaa e itte, ryouri o tsukutte, tomodachi to tabemashita.",
            "vi": "Đi siêu thị, nấu ăn rồi ăn cùng bạn."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{何|なに}を{作|つく}りましたか。",
            "ro": "Nani o tsukurimashita ka.",
            "vi": "(Tranh ②: nồi cà ri) Người đó đã nấu món gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "カレーを{作|つく}りました。",
            "ro": "Karee o tsukurimashita.",
            "vi": "Nấu cà ri."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{何人|なんにん}で{食|た}べましたか。",
            "ro": "Nannin de tabemashita ka.",
            "vi": "(Tranh ③: 3 người bạn) Ăn tổng cộng mấy người?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{友達|ともだち}と{四人|よにん}で{食|た}べました。",
            "ro": "Tomodachi to yonin de tabemashita.",
            "vi": "Ăn bốn người cùng bạn bè."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{週末|しゅうまつ}はいつも{何|なに}をしますか。",
            "ro": "Shuumatsu wa itsumo nani o shimasu ka.",
            "vi": "(Cá nhân) Cuối tuần bạn thường làm gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いつも{洗濯|せんたく}をして、{部屋|へや}を{掃除|そうじ}して、{本|ほん}を{読|よ}みます。",
            "ro": "Itsumo sentaku o shite, heya o souji shite, hon o yomimasu.",
            "vi": "Tôi thường giặt đồ, dọn phòng rồi đọc sách."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bộ tranh 5 · đọc to · viết ngắn"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Bản đồ: ga → xe buýt số 3 → trạm \"図書館前\"; quầy thư viện với tờ đơn (tên, địa chỉ) và thẻ ngoại kiều; biển ghi \"本は 5冊まで\"."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Cách đi · làm thủ tục",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "どうやって{図書館|としょかん}へ{行|い}きますか。",
            "ro": "Douyatte toshokan e ikimasu ka.",
            "vi": "(Tranh: bản đồ) Đến thư viện bằng cách nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{駅|えき}から{三番|さんばん}のバスに{乗|の}って、{図書館|としょかん}{前|まえ}で{降|お}ります。",
            "ro": "Eki kara sanban no basu ni notte, toshokan mae de orimasu.",
            "vi": "Từ ga lên xe buýt số 3, xuống ở trạm trước thư viện."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "どうやってカードを{作|つく}りますか。",
            "ro": "Douyatte kaado o tsukurimasu ka.",
            "vi": "(Tranh: quầy thư viện) Làm thẻ thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{受付|うけつけ}で{名前|なまえ}と{住所|じゅうしょ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。",
            "ro": "Uketsuke de namae to juusho o kaite, gaikokujintourokushou o misemasu.",
            "vi": "Viết tên và địa chỉ ở quầy rồi xuất trình thẻ ngoại kiều."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{本|ほん}を{何冊|なんさつ}{借|か}りることができますか。",
            "ro": "Hon o nansatsu kariru koto ga dekimasu ka.",
            "vi": "(Tranh: biển \"5冊まで\") Mượn được mấy quyển sách?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{五冊|ごさつ}{借|か}りることができます。",
            "ro": "Gosatsu kariru koto ga dekimasu.",
            "vi": "Mượn được năm quyển."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "どうやって{学校|がっこう}へ{来|き}ますか。",
            "ro": "Douyatte gakkou e kimasu ka.",
            "vi": "(Cá nhân) Bạn đến trường bằng cách nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "うちからバスに{乗|の}って、{学校|がっこう}の{前|まえ}で{降|お}ります。{二十分|にじゅっぷん}ぐらいです。",
            "ro": "Uchi kara basu ni notte, gakkou no mae de orimasu. Nijuppun gurai desu.",
            "vi": "Từ nhà tôi lên xe buýt, xuống ở trước trường. Mất khoảng 20 phút."
          }
        ]
      },
      {
        "t": "h",
        "text": "Đọc to (Reading 40 điểm)"
      },
      {
        "t": "passage",
        "title": "Đọc to 1 (Reading) — Sở thích của tôi",
        "intro": "Chuẩn bị 20 giây rồi đọc to, chậm, rõ. Chú ý số đếm: いっしゅうかん, にかい, いっさつ.",
        "paras": [
          {
            "text": "{私|わたし}の{趣味|しゅみ}は{泳|およ}ぐことです。{一週間|いっしゅうかん}に{二回|にかい}プールへ{行|い}きます。{百|ひゃく}メートル{泳|およ}ぐことができます。{本|ほん}も{好|す}きですが、{最近|さいきん}はあまり{読|よ}みません。{一|いっ}か{月|げつ}に{一冊|いっさつ}ぐらいです。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}の{趣味|しゅみ}は{泳|およ}ぐことです。",
            "ro": "Watashi no shumi wa oyogu koto desu.",
            "vi": "Sở thích của tôi là bơi."
          },
          {
            "en": "{一週間|いっしゅうかん}に{二回|にかい}プールへ{行|い}きます。",
            "ro": "Isshuukan ni nikai puuru e ikimasu.",
            "vi": "Một tuần tôi đến bể bơi hai lần."
          },
          {
            "en": "{百|ひゃく}メートル{泳|およ}ぐことができます。",
            "ro": "Hyakumeetoru oyogu koto ga dekimasu.",
            "vi": "Tôi bơi được 100 mét."
          },
          {
            "en": "{本|ほん}も{好|す}きですが、{最近|さいきん}はあまり{読|よ}みません。",
            "ro": "Hon mo suki desu ga, saikin wa amari yomimasen.",
            "vi": "Tôi cũng thích sách, nhưng dạo này không đọc mấy."
          },
          {
            "en": "{一|いっ}か{月|げつ}に{一冊|いっさつ}ぐらいです。",
            "ro": "Ikkagetsu ni issatsu gurai desu.",
            "vi": "Khoảng một tháng một quyển."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đọc to 2 (Reading) — Cách làm thẻ thư viện",
        "intro": "Nhiều thể て nối bước: đọc rõ のって／おりて／かいて／みせて.",
        "paras": [
          {
            "text": "{図書館|としょかん}は{駅|えき}から{少|すこ}し{遠|とお}いです。{駅|えき}の{前|まえ}で{三番|さんばん}のバスに{乗|の}って、{図書館|としょかん}{前|まえ}で{降|お}ります。{受付|うけつけ}で{名前|なまえ}と{住所|じゅうしょ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。{本|ほん}は{五冊|ごさつ}{借|か}りることができます。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{図書館|としょかん}は{駅|えき}から{少|すこ}し{遠|とお}いです。",
            "ro": "Toshokan wa eki kara sukoshi tooi desu.",
            "vi": "Thư viện hơi xa ga."
          },
          {
            "en": "{駅|えき}の{前|まえ}で{三番|さんばん}のバスに{乗|の}って、{図書館|としょかん}{前|まえ}で{降|お}ります。",
            "ro": "Eki no mae de sanban no basu ni notte, toshokan mae de orimasu.",
            "vi": "Lên xe buýt số 3 ở trước ga, xuống ở trạm trước thư viện."
          },
          {
            "en": "{受付|うけつけ}で{名前|なまえ}と{住所|じゅうしょ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。",
            "ro": "Uketsuke de namae to juusho o kaite, gaikokujintourokushou o misete kudasai.",
            "vi": "Ở quầy, hãy viết tên và địa chỉ rồi xuất trình thẻ ngoại kiều."
          },
          {
            "en": "{本|ほん}は{五冊|ごさつ}{借|か}りることができます。",
            "ro": "Hon wa gosatsu kariru koto ga dekimasu.",
            "vi": "Được mượn năm quyển sách."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b9-noi-ghi-am",
        "part": "1",
        "questions": [
          "しゅみは なんですか。",
          "なにが できますか。",
          "スキーが できますか。",
          "よく えいがを みますか。",
          "いちにちに コーヒーを なんばい のみますか。",
          "いっしゅうかんに なんかい りょうりを しますか。",
          "しゅうまつ、なにを しましたか。",
          "どうやって がっこうへ きますか。",
          "さいきん、なにか ならっていますか。"
        ]
      },
      {
        "t": "h",
        "text": "Viết ngắn 3–5 câu — 4 đề có bài mẫu"
      },
      {
        "t": "p",
        "text": "**Đề 1.** Viết về sở thích của bạn (4 câu) — sở thích, đặc biệt thích gì, bao lâu một lần. Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}の{趣味|しゅみ}は{写真|しゃしん}を{撮|と}ることです。",
            "ro": "Watashi no shumi wa shashin o toru koto desu.",
            "vi": "Sở thích của tôi là chụp ảnh."
          },
          {
            "en": "{特|とく}に{山|やま}の{写真|しゃしん}が{好|す}きです。",
            "ro": "Tokuni yama no shashin ga suki desu.",
            "vi": "Tôi đặc biệt thích ảnh núi."
          },
          {
            "en": "{一|いっ}か{月|げつ}に{二回|にかい}ぐらい{山|やま}に{登|のぼ}って、{写真|しゃしん}を{撮|と}ります。",
            "ro": "Ikkagetsu ni nikai gurai yama ni nobotte, shashin o torimasu.",
            "vi": "Một tháng khoảng hai lần tôi leo núi và chụp ảnh."
          },
          {
            "en": "{来年|らいねん}、{写真|しゃしん}のコンテストに{参加|さんか}したいです。",
            "ro": "Rainen, shashin no kontesuto ni sanka shitai desu.",
            "vi": "Năm sau tôi muốn tham gia cuộc thi ảnh."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 2.** Viết điều bạn làm được và chưa làm được (3–4 câu). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{私|わたし}は{自転車|じてんしゃ}に{乗|の}ることができます。",
            "ro": "Watashi wa jitensha ni noru koto ga dekimasu.",
            "vi": "Tôi đi được xe đạp."
          },
          {
            "en": "{車|くるま}の{運転|うんてん}も{少|すこ}しできます。",
            "ro": "Kuruma no unten mo sukoshi dekimasu.",
            "vi": "Tôi cũng lái ô tô được một chút."
          },
          {
            "en": "でも、{泳|およ}ぐことができません。",
            "ro": "Demo, oyogu koto ga dekimasen.",
            "vi": "Nhưng tôi không biết bơi."
          },
          {
            "en": "{来月|らいげつ}から{水泳|すいえい}{教室|きょうしつ}で{習|なら}いたいです。",
            "ro": "Raigetsu kara suiei kyoushitsu de naraitai desu.",
            "vi": "Từ tháng sau tôi muốn học ở lớp bơi."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 3.** Kể cuối tuần vừa rồi (3 câu, dùng Vて、Vて、Vました). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{土曜日|どようび}、{友達|ともだち}に{会|あ}って、{映画|えいが}を{見|み}ました。",
            "ro": "Doyoubi, tomodachi ni atte, eiga o mimashita.",
            "vi": "Thứ Bảy tôi gặp bạn và xem phim."
          },
          {
            "en": "{日曜日|にちようび}は{部屋|へや}を{掃除|そうじ}して、{料理|りょうり}を{作|つく}って、{本|ほん}を{読|よ}みました。",
            "ro": "Nichiyoubi wa heya o souji shite, ryouri o tsukutte, hon o yomimashita.",
            "vi": "Chủ nhật tôi dọn phòng, nấu ăn rồi đọc sách."
          },
          {
            "en": "とても{楽|たの}しかったです。",
            "ro": "Totemo tanoshikatta desu.",
            "vi": "Rất vui."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 4.** Viết tin nhắn chỉ đường cho bạn đến nhà bạn (3–4 câu). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{駅|えき}から{五番|ごばん}のバスに{乗|の}ってください。",
            "ro": "Eki kara goban no basu ni notte kudasai.",
            "vi": "Từ ga hãy lên xe buýt số 5."
          },
          {
            "en": "{公園|こうえん}{前|まえ}で{降|お}りてください。",
            "ro": "Kouen mae de orite kudasai.",
            "vi": "Hãy xuống ở trạm trước công viên."
          },
          {
            "en": "バス{停|てい}の{隣|となり}に{私|わたし}のうちがあります。",
            "ro": "Basutei no tonari ni watashi no uchi ga arimasu.",
            "vi": "Nhà tôi ở ngay cạnh trạm xe buýt."
          },
          {
            "en": "バスで{十分|じゅっぷん}ぐらいです。",
            "ro": "Basu de juppun gurai desu.",
            "vi": "Đi xe buýt khoảng 10 phút."
          }
        ]
      },
      {
        "t": "note",
        "title": "Checklist trước khi nộp bài viết",
        "items": [
          "Trước こと: **thể từ điển** (見る・泳ぐ・する・来る) — không bao giờ ～ます.",
          "Soát: **が** できます · khoảng thời gian **に** + số lần · **あまり／全然 + ～ません** · xe **に** 乗って, **を／で** 降ります · **でも** ở đầu câu.",
          "Mỗi câu kết thúc bằng です／ます／ました／たいです／ください — không để câu cụt."
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-viet-chon",
        "title": "Chọn bài viết đúng và tự nhiên (6 câu)",
        "items": [
          {
            "q": "Viết: \"Sở thích của tôi là vẽ tranh.\"",
            "options": [
              "{私|わたし}の{趣味|しゅみ}は{絵|え}を{描|か}くです。 (Watashi no shumi wa e o kaku desu.)",
              "{私|わたし}の{趣味|しゅみ}は{絵|え}を{描|か}くことです。 (Watashi no shumi wa e o kaku koto desu.)",
              "{私|わたし}の{趣味|しゅみ}は{絵|え}が{描|か}くことです。 (Watashi no shumi wa e ga kaku koto desu.)",
              "{私|わたし}の{趣味|しゅみ}は{絵|え}を{描|か}きますことです。 (Watashi no shumi wa e o kakimasu koto desu.)"
            ],
            "correct": 1,
            "why": "N を V辞書形 こと です."
          },
          {
            "q": "Viết: \"Tôi không biết lái ô tô.\"",
            "options": [
              "{車|くるま}の{運転|うんてん}がしません。 (Kuruma no unten ga shimasen.)",
              "{車|くるま}の{運転|うんてん}ができません。 (Kuruma no unten ga dekimasen.)",
              "{車|くるま}の{運転|うんてん}をできません。 (Kuruma no unten o dekimasen.)",
              "{車|くるま}を{運転|うんてん}ができません。 (Kuruma o unten ga dekimasen.)"
            ],
            "correct": 1,
            "why": "N が できません."
          },
          {
            "q": "Viết: \"Một tuần tôi học nhảy hai lần.\"",
            "options": [
              "{一週間|いっしゅうかん}に{二回|にかい}ダンスを{習|なら}います。 (Isshuukan ni nikai dansu o naraimasu.)",
              "{一週間|いっしゅうかん}{二回|にかい}にダンスを{習|なら}います。 (Isshuukan nikai ni dansu o naraimasu.)",
              "{一週間|いっしゅうかん}に{二杯|にはい}ダンスを{習|なら}います。 (Isshuukan ni nihai dansu o naraimasu.)",
              "{一週間|いっしゅうかん}で{二回|にかい}ダンスが{習|なら}います。 (Isshuukan de nikai dansu ga naraimasu.)"
            ],
            "correct": 0,
            "why": "～に ～回 + N を 習います."
          },
          {
            "q": "Viết: \"Dạo này tôi không xem TV mấy.\"",
            "options": [
              "{最近|さいきん}、テレビをあまり{見|み}ません。 (Saikin, terebi o amari mimasen.)",
              "{最近|さいきん}、テレビを{全然|ぜんぜん}{見|み}ます。 (Saikin, terebi o zenzen mimasu.)",
              "{最近|さいきん}、あまりテレビが{見|み}ません。 (Saikin, amari terebi ga mimasen.)",
              "{最近|さいきん}、テレビをあまり{見|み}ます。 (Saikin, terebi o amari mimasu.)"
            ],
            "correct": 0,
            "why": "あまり + ～ません."
          },
          {
            "q": "Viết: \"Tôi thích bơi. Nhưng không giỏi.\"",
            "options": [
              "{泳|およ}ぐことが{好|す}きですでも、{上手|じょうず}じゃありません。 (Oyogu koto ga suki desu demo, jouzu ja arimasen.)",
              "{泳|およ}ぐことが{好|す}きです。でも、{上手|じょうず}じゃありません。 (Oyogu koto ga suki desu. Demo, jouzu ja arimasen.)",
              "{泳|およ}ぎますことが{好|す}きです。でも、{上手|じょうず}じゃありません。 (Oyogimasu koto ga suki desu. Demo, jouzu ja arimasen.)",
              "{泳|およ}ぐことが{好|す}きです。そして、{上手|じょうず}じゃありません。 (Oyogu koto ga suki desu. Soshite, jouzu ja arimasen.)"
            ],
            "correct": 1,
            "why": "でも ở đầu câu sau; thể từ điển trước こと."
          },
          {
            "q": "Viết chỉ đường: \"Lên xe buýt số 2, xuống ở trước ga.\"",
            "options": [
              "{二番|にばん}のバスを{乗|の}って、{駅|えき}の{前|まえ}で{降|お}ります。 (Niban no basu o notte, eki no mae de orimasu.)",
              "{二番|にばん}のバスに{乗|の}って、{駅|えき}の{前|まえ}に{降|お}ります。 (Niban no basu ni notte, eki no mae ni orimasu.)",
              "{二番|にばん}のバスに{乗|の}りて、{駅|えき}の{前|まえ}で{降|お}ります。 (Niban no basu ni norite, eki no mae de orimasu.)",
              "{二番|にばん}のバスに{乗|の}って、{駅|えき}の{前|まえ}で{降|お}ります。 (Niban no basu ni notte, eki no mae de orimasu.)"
            ],
            "correct": 3,
            "why": "に 乗って · で 降ります."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b9-viet-sx",
        "title": "Sắp xếp thành đoạn văn hoàn chỉnh (2 câu)",
        "items": [
          {
            "vi": "Sắp xếp đoạn \"sở thích\": sở thích → đặc biệt thích → bao lâu một lần.",
            "chips": [
              "{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}を{聞|き}くことです。",
              "{一|いっ}か{月|げつ}に{一回|いっかい}コンサートに{行|い}きます。",
              "{特|とく}にクラシックが{好|す}きです。"
            ],
            "answer": [
              "{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}を{聞|き}くことです。",
              "{特|とく}にクラシックが{好|す}きです。",
              "{一|いっ}か{月|げつ}に{一回|いっかい}コンサートに{行|い}きます。"
            ],
            "ro": "Watashi no shumi wa ongaku o kiku koto desu. Tokuni kurashikku ga suki desu. Ikkagetsu ni ikkai konsaato ni ikimasu."
          },
          {
            "vi": "Sắp xếp tin nhắn chỉ đường: lên xe → xuống xe → nhà ở đâu.",
            "chips": [
              "{公園|こうえん}{前|まえ}で{降|お}りてください。",
              "バス{停|てい}の{隣|となり}にうちがあります。",
              "{駅|えき}からバスに{乗|の}ってください。"
            ],
            "answer": [
              "{駅|えき}からバスに{乗|の}ってください。",
              "{公園|こうえん}{前|まえ}で{降|お}りてください。",
              "バス{停|てい}の{隣|となり}にうちがあります。"
            ],
            "ro": "Eki kara basu ni notte kudasai. Kouen mae de orite kudasai. Basutei no tonari ni uchi ga arimasu."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b9-de-tong-hop",
    "kind": "review",
    "title": "Luyện thêm Bài 9 · Đề tổng hợp cuối bài — đúng khuôn kiểm tra của cô (65 câu · 50 phút)",
    "goal": "Làm thử một đề đủ các phần: từ vựng, chữ Hán (chữ nhiễu), ngữ pháp, gõ thể từ điển/thể て, đọc hiểu, dịch — bấm giờ 50 phút, tự chấm theo thang điểm và biết mình yếu phần nào.",
    "minutes": 50,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Bấm giờ 50 phút**, không mở bài ôn. Làm theo thứ tự I → VI; câu chưa chắc thì đánh dấu, quay lại sau.",
          "Phần II (chữ Hán) có **chữ na ná**: 泳/永/氷 · 描/猫/書 · 習/羽 · 運/連 · 転/伝 · 遊/旅. Phần IV gõ **thể từ điển** và **thể て** — nhớ các bẫy 帰る・入る (nhóm 1), 起きる・降りる (nhóm 2), 来る (くる).",
          "Hết giờ, nộp từng phần để xem đáp án + giải thích, ghi điểm vào bảng tự chấm."
        ]
      },
      {
        "t": "table",
        "head": [
          "Phần",
          "Dạng",
          "Số câu",
          "Điểm"
        ],
        "rows": [
          [
            "I",
            "Từ vựng — điền từ vào câu",
            "10",
            "10"
          ],
          [
            "II",
            "Chữ Hán — chọn cách viết / cách đọc (có chữ nhiễu)",
            "12",
            "12"
          ],
          [
            "III",
            "Ngữ pháp — こと, できます, ～に～回, tần suất, でも, どうやって",
            "20",
            "20"
          ],
          [
            "IV",
            "Gõ thể từ điển / thể て",
            "10",
            "10"
          ],
          [
            "V",
            "Đọc hiểu",
            "4",
            "4"
          ],
          [
            "VI",
            "Dịch Việt → Nhật (5) · Nhật → Việt (4)",
            "9",
            "9"
          ],
          [
            "Tổng",
            "",
            "65",
            "65"
          ]
        ],
        "caption": "Cấu trúc đề tổng hợp Bài 9"
      },
      {
        "t": "table",
        "head": [
          "Điểm của bạn",
          "Nhận xét",
          "Làm gì tiếp"
        ],
        "rows": [
          [
            "≥ 55 / 65 (≥ 85%)",
            "Sẵn sàng",
            "Sang Bài 10; làm lại phần IV sau 3 ngày để giữ thể từ điển"
          ],
          [
            "46–54 (70–85%)",
            "Khá, còn sơ hở",
            "Xem lại phần sai nhiều nhất; làm lại lesson tương ứng ở mức Vừa"
          ],
          [
            "< 46 (< 70%)",
            "Chưa chắc",
            "Làm lại \"Thể từ điển\" + 3 lesson ngữ pháp từ mức Dễ, rồi làm lại đề này sau 2 ngày"
          ]
        ],
        "caption": "Thang điểm tự chấm"
      },
      {
        "t": "h",
        "text": "I. Từ vựng (10 câu · 10 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b9-de-i",
        "title": "I. Từ vựng",
        "items": [
          {
            "q": "{私|わたし}の{趣味|しゅみ}は＿＿を{集|あつ}めることです。　〔Watashi no shumi wa __ o atsumeru koto desu.〕　— Sở thích của tôi là sưu tầm tem.",
            "options": [
              "{切手|きって}",
              "ダンス",
              "{釣|つ}り",
              "プール"
            ],
            "correct": 0,
            "why": "切手を 集めます. → **{私|わたし}の{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。** 〔Watashi no shumi wa kitte o atsumeru koto desu.〕 — Sở thích của tôi là sưu tầm tem."
          },
          {
            "q": "{一日|いちにち}にコーヒーを{二|に}＿＿{飲|の}みます。　〔Ichinichi ni koohii o ni__ nomimasu.〕　— Một ngày tôi uống hai cốc cà phê.",
            "options": [
              "{人|にん}",
              "{本|ほん}",
              "{冊|さつ}",
              "{杯|はい}"
            ],
            "correct": 3,
            "why": "Cốc → 杯. → **{一日|いちにち}にコーヒーを{二|に}{杯|はい}{飲|の}みます。** 〔Ichinichi ni koohii o nihai nomimasu.〕 — Một ngày tôi uống hai cốc cà phê."
          },
          {
            "q": "{一|いっ}か{月|げつ}に{本|ほん}を{三|さん}＿＿{読|よ}みます。　〔Ikkagetsu ni hon o san__ yomimasu.〕　— Một tháng tôi đọc ba quyển sách.",
            "options": [
              "{冊|さつ}",
              "{枚|まい}",
              "{本|ぼん}",
              "{杯|ばい}"
            ],
            "correct": 0,
            "why": "Sách → 冊. → **{一|いっ}か{月|げつ}に{本|ほん}を{三|さん}{冊|さつ}{読|よ}みます。** 〔Ikkagetsu ni hon o sansatsu yomimasu.〕 — Một tháng tôi đọc ba quyển sách."
          },
          {
            "q": "{兄|あに}は{車|くるま}の＿＿ができます。　〔Ani wa kuruma no __ ga dekimasu.〕　— Anh tôi biết lái ô tô.",
            "options": [
              "{予約|よやく}",
              "{参加|さんか}",
              "{運転|うんてん}",
              "{受付|うけつけ}"
            ],
            "correct": 2,
            "why": "車の 運転. → **{兄|あに}は{車|くるま}の{運転|うんてん}ができます。** 〔Ani wa kuruma no unten ga dekimasu.〕 — Anh tôi biết lái ô tô."
          },
          {
            "q": "あの{駅|えき}で{電車|でんしゃ}を＿＿。　〔Ano eki de densha o __.〕　— Tôi xuống tàu ở ga đó.",
            "options": [
              "{入|はい}ります",
              "{降|お}ります",
              "{払|はら}います",
              "{乗|の}ります"
            ],
            "correct": 1,
            "why": "N を 降ります. → **あの{駅|えき}で{電車|でんしゃ}を{降|お}ります。** 〔Ano eki de densha o orimasu.〕 — Tôi xuống tàu ở ga đó."
          },
          {
            "q": "ホテルをインターネットで＿＿。　〔Hoteru o intaanetto de __.〕　— Tôi đã đặt khách sạn trên mạng.",
            "options": [
              "{予約|よやく}しました",
              "{降|お}りました",
              "{参加|さんか}しました",
              "{運転|うんてん}しました"
            ],
            "correct": 0,
            "why": "予約します = đặt trước. → **ホテルをインターネットで{予約|よやく}しました。** 〔Hoteru o intaanetto de yoyaku shimashita.〕 — Tôi đã đặt khách sạn trên mạng."
          },
          {
            "q": "{受付|うけつけ}で{外国人登録証|がいこくじんとうろくしょう}を＿＿ください。　〔Uketsuke de gaikokujintourokushou o __ kudasai.〕　— Hãy xuất trình thẻ ngoại kiều ở quầy lễ tân.",
            "options": [
              "{見|み}せて",
              "{払|はら}って",
              "{見|み}て",
              "{乗|の}って"
            ],
            "correct": 0,
            "why": "見せます = cho xem. → **{受付|うけつけ}で{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。** 〔Uketsuke de gaikokujintourokushou o misete kudasai.〕 — Hãy xuất trình thẻ ngoại kiều ở quầy lễ tân."
          },
          {
            "q": "{今日|きょう}は＿＿がたくさんあります。　〔Kyou wa __ ga takusan arimasu.〕　— Hôm nay có nhiều bài tập về nhà.",
            "options": [
              "{住所|じゅうしょ}",
              "{受付|うけつけ}",
              "{宿題|しゅくだい}",
              "イベント{教室|きょうしつ}"
            ],
            "correct": 2,
            "why": "宿題 = bài tập về nhà. → **{今日|きょう}は{宿題|しゅくだい}がたくさんあります。** 〔Kyou wa shukudai ga takusan arimasu.〕 — Hôm nay có nhiều bài tập về nhà."
          },
          {
            "q": "{音楽|おんがく}が{好|す}きです。＿＿ジャズが{好|す}きです。　〔Ongaku ga suki desu. __ jazu ga suki desu.〕　— Tôi thích âm nhạc. Đặc biệt là nhạc jazz.",
            "options": [
              "あまり",
              "{全然|ぜんぜん}",
              "{特|とく}に",
              "だけ"
            ],
            "correct": 2,
            "why": "特に = đặc biệt là. → **{音楽|おんがく}が{好|す}きです。{特|とく}にジャズが{好|す}きです。** 〔Ongaku ga suki desu. Tokuni jazu ga suki desu.〕 — Tôi thích âm nhạc. Đặc biệt là nhạc jazz."
          },
          {
            "q": "A：{私|わたし}は{百|ひゃく}メートル{泳|およ}ぐことができます。B：＿＿ですね。　〔A: watashi wa hyakumeetoru oyogu koto ga dekimasu. B: __ desu ne.〕　— A: Tôi bơi được 100 mét. B: Giỏi quá nhỉ.",
            "options": [
              "{上手|じょうず}に",
              "{全然|ぜんぜん}",
              "すごい",
              "いろいろ"
            ],
            "correct": 2,
            "why": "Khen → すごいですね. → **A：{私|わたし}は{百|ひゃく}メートル{泳|およ}ぐことができます。B：すごいですね。** 〔A: watashi wa hyakumeetoru oyogu koto ga dekimasu. B: sugoi desu ne.〕 — A: Tôi bơi được 100 mét. B: Giỏi quá nhỉ."
          }
        ]
      },
      {
        "t": "h",
        "text": "II. Chữ Hán (12 câu · 12 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b9-de-ii",
        "title": "II. Chữ Hán",
        "items": [
          {
            "q": "「およぎます」 là cách viết nào?",
            "options": [
              "氷ぎます",
              "決ぎます",
              "泳ぎます",
              "永ぎます"
            ],
            "correct": 2,
            "why": "泳 có bộ 氵."
          },
          {
            "q": "「のります」 là cách viết nào?",
            "options": [
              "来ります",
              "垂ります",
              "乗ります",
              "東ります"
            ],
            "correct": 2,
            "why": "乗."
          },
          {
            "q": "「ならいます」 là cách viết nào?",
            "options": [
              "習います",
              "羽います",
              "白います",
              "翌います"
            ],
            "correct": 0,
            "why": "習 = 羽 + 白."
          },
          {
            "q": "「うんてん」 là cách viết nào?",
            "options": [
              "軍転",
              "運伝",
              "運転",
              "連転"
            ],
            "correct": 2,
            "why": "運 + 転."
          },
          {
            "q": "「あつめます」 là cách viết nào?",
            "options": [
              "集めます",
              "進めます",
              "隻めます",
              "焦めます"
            ],
            "correct": 0,
            "why": "集."
          },
          {
            "q": "「えを かきます」 (vẽ tranh) là cách viết nào?",
            "options": [
              "絵を猫きます",
              "絵を描きます",
              "絵を書きます",
              "絵を苗きます"
            ],
            "correct": 1,
            "why": "Vẽ tranh → 描; 書 là viết chữ."
          },
          {
            "q": "「うた」 là cách viết nào?",
            "options": [
              "欧",
              "可",
              "哥",
              "歌"
            ],
            "correct": 3,
            "why": "歌."
          },
          {
            "q": "「あそびます」 là cách viết nào?",
            "options": [
              "旅びます",
              "逆びます",
              "遊びます",
              "族びます"
            ],
            "correct": 2,
            "why": "遊."
          },
          {
            "q": "「水泳」 đọc là gì?",
            "options": [
              "すいえ",
              "みずおよぎ",
              "すいえい",
              "ずいえい"
            ],
            "correct": 2,
            "why": "水 すい + 泳 えい."
          },
          {
            "q": "「自転車」 đọc là gì?",
            "options": [
              "じてんくるま",
              "じてんしゃ",
              "じしゃ",
              "じでんしゃ"
            ],
            "correct": 1,
            "why": "転 = てん."
          },
          {
            "q": "「歌手」 đọc là gì?",
            "options": [
              "かしゅ",
              "かて",
              "うたて",
              "うたしゅ"
            ],
            "correct": 0,
            "why": "歌 đọc On か."
          },
          {
            "q": "「練習」 đọc là gì?",
            "options": [
              "れんしゅう",
              "ねんしゅう",
              "れんならい",
              "れんしゅ"
            ],
            "correct": 0,
            "why": "習 đọc On しゅう."
          }
        ]
      },
      {
        "t": "h",
        "text": "III. Ngữ pháp (20 câu · 20 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b9-de-iii",
        "title": "III. Ngữ pháp",
        "items": [
          {
            "q": "{私|わたし}の{趣味|しゅみ}は{映画|えいが}を＿＿ことです。　〔Watashi no shumi wa eiga o __ koto desu.〕　— Sở thích của tôi là xem phim.",
            "options": [
              "{見|み}む",
              "{見|み}ます",
              "{見|み}て",
              "{見|み}る"
            ],
            "correct": 3,
            "why": "Trước こと → thể từ điển. → **{私|わたし}の{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。** 〔Watashi no shumi wa eiga o miru koto desu.〕 — Sở thích của tôi là xem phim."
          },
          {
            "q": "{趣味|しゅみ}は{山|やま}に{登|のぼ}る＿＿です。　〔Shumi wa yama ni noboru __ desu.〕　— Sở thích của tôi là leo núi.",
            "options": [
              "とき",
              "こと",
              "もの",
              "ので"
            ],
            "correct": 1,
            "why": "V辞書形 + こと. → **{趣味|しゅみ}は{山|やま}に{登|のぼ}ることです。** 〔Shumi wa yama ni noboru koto desu.〕 — Sở thích của tôi là leo núi."
          },
          {
            "q": "{私|わたし}はスキー＿＿できます。　〔Watashi wa sukii __ dekimasu.〕　— Tôi trượt tuyết được.",
            "options": [
              "に",
              "を",
              "で",
              "が"
            ],
            "correct": 3,
            "why": "N が できます. → **{私|わたし}はスキーができます。** 〔Watashi wa sukii ga dekimasu.〕 — Tôi trượt tuyết được."
          },
          {
            "q": "{私|わたし}は{料理|りょうり}を{作|つく}ることが＿＿。　〔Watashi wa ryouri o tsukuru koto ga __.〕　— Tôi không nấu ăn được.",
            "options": [
              "できません",
              "いません",
              "ありません",
              "しません"
            ],
            "correct": 0,
            "why": "V こと が できません. → **{私|わたし}は{料理|りょうり}を{作|つく}ることができません。** 〔Watashi wa ryouri o tsukuru koto ga dekimasen.〕 — Tôi không nấu ăn được."
          },
          {
            "q": "パクさんは＿＿ピアノを{弾|ひ}くことができます。　〔Paku-san wa __ piano o hiku koto ga dekimasu.〕　— Park chơi piano giỏi.",
            "options": [
              "{上手|じょうず}の",
              "{上手|じょうず}で",
              "{上手|じょうず}に",
              "{上手|じょうず}な"
            ],
            "correct": 2,
            "why": "Trước động từ → 上手に. → **パクさんは{上手|じょうず}にピアノを{弾|ひ}くことができます。** 〔Paku-san wa jouzuni piano o hiku koto ga dekimasu.〕 — Park chơi piano giỏi."
          },
          {
            "q": "{朝|あさ}{起|お}きて、ご{飯|はん}を＿＿、{学校|がっこう}へ{行|い}きます。　〔Asa okite, gohan o __, gakkou e ikimasu.〕　— Sáng tôi dậy, ăn cơm rồi đến trường.",
            "options": [
              "{食|た}べる",
              "{食|た}べた",
              "{食|た}べます",
              "{食|た}べて"
            ],
            "correct": 3,
            "why": "Việc giữa → thể て. → **{朝|あさ}{起|お}きて、ご{飯|はん}を{食|た}べて、{学校|がっこう}へ{行|い}きます。** 〔Asa okite, gohan o tabete, gakkou e ikimasu.〕 — Sáng tôi dậy, ăn cơm rồi đến trường."
          },
          {
            "q": "{昨日|きのう}、{映画|えいが}を{見|み}て、{買|か}い{物|もの}を＿＿。　〔Kinou, eiga o mite, kaimono o __.〕　— Hôm qua tôi xem phim rồi mua sắm.",
            "options": [
              "しました",
              "する",
              "して",
              "します"
            ],
            "correct": 0,
            "why": "Động từ cuối mang thì quá khứ. → **{昨日|きのう}、{映画|えいが}を{見|み}て、{買|か}い{物|もの}をしました。** 〔Kinou, eiga o mite, kaimono o shimashita.〕 — Hôm qua tôi xem phim rồi mua sắm."
          },
          {
            "q": "{海|うみ}で＿＿、{魚|さかな}を{食|た}べました。　〔Umi de __, sakana o tabemashita.〕　— Tôi bơi ở biển rồi ăn cá.",
            "options": [
              "{泳|およ}いで",
              "{泳|およ}いて",
              "{泳|およ}ぎて",
              "{泳|およ}んで"
            ],
            "correct": 0,
            "why": "泳ぎます → 泳いで. → **{海|うみ}で{泳|およ}いで、{魚|さかな}を{食|た}べました。** 〔Umi de oyoide, sakana o tabemashita.〕 — Tôi bơi ở biển rồi ăn cá."
          },
          {
            "q": "{一週間|いっしゅうかん}＿＿{三回|さんかい}テニスをします。　〔Isshuukan __ sankai tenisu o shimasu.〕　— Một tuần tôi chơi tennis ba lần.",
            "options": [
              "を",
              "が",
              "に",
              "で"
            ],
            "correct": 2,
            "why": "Khoảng thời gian + に. → **{一週間|いっしゅうかん}に{三回|さんかい}テニスをします。** 〔Isshuukan ni sankai tenisu o shimasu.〕 — Một tuần tôi chơi tennis ba lần."
          },
          {
            "q": "{一日|いちにち}に{何|なん}＿＿コーヒーを{飲|の}みますか。　〔Ichinichi ni nan__ koohii o nomimasu ka.〕　— Một ngày bạn uống mấy cốc cà phê?",
            "options": [
              "{杯|ばい}",
              "{本|ぼん}",
              "{人|にん}",
              "{冊|さつ}"
            ],
            "correct": 0,
            "why": "Hỏi số cốc → 何杯 (なんばい). → **{一日|いちにち}に{何|なん}{杯|ばい}コーヒーを{飲|の}みますか。** 〔Ichinichi ni nanbai koohii o nomimasu ka.〕 — Một ngày bạn uống mấy cốc cà phê?"
          },
          {
            "q": "ペンを＿＿{買|か}いました。　〔Pen o __ kaimashita.〕　— Tôi đã mua ba cây bút.",
            "options": [
              "{三本|さんぼん}",
              "{三冊|さんさつ}",
              "{三本|さんほん}",
              "{三本|さんぽん}"
            ],
            "correct": 0,
            "why": "3 cây = さんぼん. → **ペンを{三本|さんぼん}{買|か}いました。** 〔Pen o sanbon kaimashita.〕 — Tôi đã mua ba cây bút."
          },
          {
            "q": "テレビはあまり＿＿。　〔Terebi wa amari __.〕　— Tôi không xem TV mấy.",
            "options": [
              "{見|み}たいです",
              "{見|み}る",
              "{見|み}ません",
              "{見|み}ます"
            ],
            "correct": 2,
            "why": "あまり + ～ません. → **テレビはあまり{見|み}ません。** 〔Terebi wa amari mimasen.〕 — Tôi không xem TV mấy."
          },
          {
            "q": "{最近|さいきん}、{全然|ぜんぜん}{泳|およ}ぎ＿＿。　〔Saikin, zenzen oyogi__.〕　— Dạo này tôi hoàn toàn không bơi.",
            "options": [
              "たいです",
              "ました",
              "ません",
              "ます"
            ],
            "correct": 2,
            "why": "全然 + ～ません. → **{最近|さいきん}、{全然|ぜんぜん}{泳|およ}ぎません。** 〔Saikin, zenzen oyogimasen.〕 — Dạo này tôi hoàn toàn không bơi."
          },
          {
            "q": "{私|わたし}は＿＿{七時|しちじ}に{起|お}きます。　〔Watashi wa __ shichiji ni okimasu.〕　— Tôi luôn dậy lúc 7 giờ.",
            "options": [
              "いつも",
              "だけ",
              "あまり",
              "{全然|ぜんぜん}"
            ],
            "correct": 0,
            "why": "Luôn luôn → いつも. → **{私|わたし}はいつも{七時|しちじ}に{起|お}きます。** 〔Watashi wa itsumo shichiji ni okimasu.〕 — Tôi luôn dậy lúc 7 giờ."
          },
          {
            "q": "{日曜日|にちようび}＿＿{休|やす}みます。　〔Nichiyoubi __ yasumimasu.〕　— Tôi chỉ nghỉ chủ nhật.",
            "options": [
              "あまり",
              "だけ",
              "よく",
              "{全然|ぜんぜん}"
            ],
            "correct": 1,
            "why": "Chỉ → だけ (sau danh từ). → **{日曜日|にちようび}だけ{休|やす}みます。** 〔Nichiyoubi dake yasumimasu.〕 — Tôi chỉ nghỉ chủ nhật."
          },
          {
            "q": "スポーツが{好|す}きです。＿＿、{最近|さいきん}{全然|ぜんぜん}しません。　〔Supootsu ga suki desu. __, saikin zenzen shimasen.〕　— Tôi thích thể thao. Nhưng dạo này hoàn toàn không chơi.",
            "options": [
              "そして",
              "{特|とく}に",
              "それから",
              "でも"
            ],
            "correct": 3,
            "why": "Trái ý → でも. → **スポーツが{好|す}きです。でも、{最近|さいきん}{全然|ぜんぜん}しません。** 〔Supootsu ga suki desu. Demo, saikin zenzen shimasen.〕 — Tôi thích thể thao. Nhưng dạo này hoàn toàn không chơi."
          },
          {
            "q": "＿＿{美術館|びじゅつかん}へ{行|い}きますか。——バスに{乗|の}って{行|い}きます。　〔__ bijutsukan e ikimasu ka. — Basu ni notte ikimasu.〕　— Đi bảo tàng bằng cách nào? — Đi xe buýt.",
            "options": [
              "どうやって",
              "どうして",
              "いつ",
              "どこ"
            ],
            "correct": 0,
            "why": "Hỏi cách đi → どうやって. → **どうやって{美術館|びじゅつかん}へ{行|い}きますか。——バスに{乗|の}って{行|い}きます。** 〔Douyatte bijutsukan e ikimasu ka. — Basu ni notte ikimasu.〕 — Đi bảo tàng bằng cách nào? — Đi xe buýt."
          },
          {
            "q": "{三番|さんばん}のバス＿＿{乗|の}ってください。　〔Sanban no basu __ notte kudasai.〕　— Hãy lên xe buýt số 3.",
            "options": [
              "に",
              "へ",
              "で",
              "を"
            ],
            "correct": 0,
            "why": "N に 乗ります. → **{三番|さんばん}のバスに{乗|の}ってください。** 〔Sanban no basu ni notte kudasai.〕 — Hãy lên xe buýt số 3."
          },
          {
            "q": "{駅|えき}でバス＿＿{降|お}ります。　〔Eki de basu __ orimasu.〕　— Tôi xuống xe buýt ở ga.",
            "options": [
              "で",
              "に",
              "が",
              "を"
            ],
            "correct": 3,
            "why": "N を 降ります. → **{駅|えき}でバスを{降|お}ります。** 〔Eki de basu o orimasu.〕 — Tôi xuống xe buýt ở ga."
          },
          {
            "q": "{一人|ひとり}でうちへ＿＿ことができます。　〔Hitori de uchi e __ koto ga dekimasu.〕　— Tôi có thể về nhà một mình.",
            "options": [
              "{帰|かえ}って",
              "{帰|かえ}る",
              "{帰|かえ}ります",
              "{帰|かえ}りる"
            ],
            "correct": 1,
            "why": "帰ります (nhóm 1) → 帰る. → **{一人|ひとり}でうちへ{帰|かえ}ることができます。** 〔Hitori de uchi e kaeru koto ga dekimasu.〕 — Tôi có thể về nhà một mình."
          }
        ]
      },
      {
        "t": "h",
        "text": "IV. Gõ thể từ điển / thể て (10 câu · 10 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b9-de-iv",
        "title": "IV. Gõ dạng đúng của động từ trong gợi ý",
        "kind": "fill",
        "grammar": "Thể từ điển: nhóm 1 い段→う段 · nhóm 2 +る · する／来る — Thể て: Bài 7",
        "items": [
          {
            "q": "{趣味|しゅみ}は{絵|え}を＿＿ことです。　〔Shumi wa e o __ koto desu.〕",
            "answers": [
              "描く",
              "かく"
            ],
            "hint": "描きます → thể từ điển"
          },
          {
            "q": "{私|わたし}は{一人|ひとり}で{電車|でんしゃ}に＿＿ことができます。　〔Watashi wa hitori de densha ni __ koto ga dekimasu.〕",
            "answers": [
              "乗る",
              "のる"
            ],
            "hint": "乗ります → thể từ điển"
          },
          {
            "q": "{朝|あさ}{六時|ろくじ}に＿＿ことができません。　〔Asa rokuji ni __ koto ga dekimasen.〕",
            "answers": [
              "起きる",
              "おきる"
            ],
            "hint": "起きます → thể từ điển (nhóm 2)"
          },
          {
            "q": "{明日|あした}、{九時|くじ}に＿＿ことができますか。　〔Ashita, kuji ni __ koto ga dekimasu ka.〕",
            "answers": [
              "来る",
              "くる"
            ],
            "hint": "来ます → thể từ điển"
          },
          {
            "q": "{趣味|しゅみ}は{切手|きって}を＿＿ことです。　〔Shumi wa kitte o __ koto desu.〕",
            "answers": [
              "集める",
              "あつめる"
            ],
            "hint": "集めます → thể từ điển"
          },
          {
            "q": "{車|くるま}を＿＿ことができます。　〔Kuruma o __ koto ga dekimasu.〕",
            "answers": [
              "運転する",
              "うんてんする"
            ],
            "hint": "運転します → thể từ điển"
          },
          {
            "q": "バスに＿＿、{駅|えき}で{降|お}ります。　〔Basu ni __, eki de orimasu.〕",
            "answers": [
              "乗って",
              "のって"
            ],
            "hint": "乗ります → thể て"
          },
          {
            "q": "{海|うみ}へ＿＿、{泳|およ}ぎました。　〔Umi e __, oyogimashita.〕",
            "answers": [
              "行って",
              "いって"
            ],
            "hint": "行きます → thể て"
          },
          {
            "q": "{友達|ともだち}と＿＿、{帰|かえ}りました。　〔Tomodachi to __, kaerimashita.〕",
            "answers": [
              "遊んで",
              "あそんで"
            ],
            "hint": "遊びます → thể て"
          },
          {
            "q": "{名前|なまえ}を＿＿、カードを{見|み}せます。　〔Namae o __, kaado o misemasu.〕",
            "answers": [
              "書いて",
              "かいて"
            ],
            "hint": "書きます → thể て"
          }
        ]
      },
      {
        "t": "h",
        "text": "V. Đọc hiểu (4 câu · 4 điểm)"
      },
      {
        "t": "passage",
        "title": "V. Đọc hiểu — Sở thích của Mary",
        "intro": "Đọc đoạn rồi trả lời 4 câu.",
        "paras": [
          {
            "text": "メアリーさんの{趣味|しゅみ}はダンスです。{大学|だいがく}のダンスクラブに{入|はい}っています。{一週間|いっしゅうかん}に{三回|さんかい}{練習|れんしゅう}があります。メアリーさんはダンスがとても{上手|じょうず}です。でも、{歌|うた}は{全然|ぜんぜん}{歌|うた}いません。{来月|らいげつ}、ダンスのコンテストに{参加|さんか}します。"
          }
        ]
      },
      {
        "t": "note",
        "title": "Romaji và nghĩa từng câu (chỉ xem SAU khi đã tự đọc)",
        "items": [
          "Đọc đoạn trên trước, trả lời câu hỏi, rồi mới mở bảng dưới để đối chiếu."
        ]
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "メアリーさんの{趣味|しゅみ}はダンスです。",
            "ro": "Mearii-san no shumi wa dansu desu.",
            "vi": "Sở thích của Mary là nhảy."
          },
          {
            "en": "{大学|だいがく}のダンスクラブに{入|はい}っています。",
            "ro": "Daigaku no dansu kurabu ni haitte imasu.",
            "vi": "Cô ấy tham gia câu lạc bộ nhảy của trường."
          },
          {
            "en": "{一週間|いっしゅうかん}に{三回|さんかい}{練習|れんしゅう}があります。",
            "ro": "Isshuukan ni sankai renshuu ga arimasu.",
            "vi": "Một tuần có ba buổi tập."
          },
          {
            "en": "メアリーさんはダンスがとても{上手|じょうず}です。",
            "ro": "Mearii-san wa dansu ga totemo jouzu desu.",
            "vi": "Mary nhảy rất giỏi."
          },
          {
            "en": "でも、{歌|うた}は{全然|ぜんぜん}{歌|うた}いません。",
            "ro": "Demo, uta wa zenzen utaimasen.",
            "vi": "Nhưng cô ấy hoàn toàn không hát."
          },
          {
            "en": "{来月|らいげつ}、ダンスのコンテストに{参加|さんか}します。",
            "ro": "Raigetsu, dansu no kontesuto ni sanka shimasu.",
            "vi": "Tháng sau cô ấy sẽ tham gia cuộc thi nhảy."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-de-v",
        "title": "V. Câu hỏi đọc hiểu",
        "items": [
          {
            "q": "Mary tham gia câu lạc bộ gì?",
            "options": [
              "Câu lạc bộ nhảy của trường",
              "Câu lạc bộ hát",
              "Câu lạc bộ bơi",
              "Lớp thư pháp"
            ],
            "correct": 0,
            "why": "ダンスクラブに 入っています."
          },
          {
            "q": "Một tuần có mấy buổi tập?",
            "options": [
              "Mỗi ngày",
              "Hai buổi",
              "Ba buổi",
              "Một buổi"
            ],
            "correct": 2,
            "why": "一週間に 三回."
          },
          {
            "q": "Câu nào ĐÚNG về Mary?",
            "options": [
              "Hay hát karaoke",
              "Nhảy không giỏi",
              "Hát hay và nhảy giỏi",
              "Nhảy rất giỏi nhưng hoàn toàn không hát"
            ],
            "correct": 3,
            "why": "ダンスが とても 上手 · でも、歌は 全然 歌いません."
          },
          {
            "q": "Tháng sau Mary sẽ làm gì?",
            "options": [
              "Học hát",
              "Rời câu lạc bộ",
              "Tham gia cuộc thi nhảy",
              "Dạy nhảy"
            ],
            "correct": 2,
            "why": "コンテストに 参加します."
          }
        ]
      },
      {
        "t": "h",
        "text": "VI. Dịch (9 câu · 9 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b9-de-vi-a",
        "title": "VI-a. Dịch Việt → Nhật",
        "kind": "translate",
        "grammar": "ポイント 81–87",
        "items": [
          {
            "q": "Sở thích của tôi là đọc sách.",
            "answers": [
              "私の趣味は本を読むことです。",
              "私の趣味は本をよむことです。",
              "私の趣味はほんを読むことです。",
              "私の趣味はほんをよむことです。",
              "私のしゅみは本を読むことです。",
              "私のしゅみは本をよむことです。",
              "私のしゅみはほんを読むことです。",
              "私のしゅみはほんをよむことです。",
              "わたしの趣味は本を読むことです。",
              "わたしの趣味は本をよむことです。",
              "わたしの趣味はほんを読むことです。",
              "わたしの趣味はほんをよむことです。",
              "わたしのしゅみは本を読むことです。",
              "わたしのしゅみは本をよむことです。",
              "わたしのしゅみはほんを読むことです。",
              "わたしのしゅみはほんをよむことです。",
              "趣味は本を読むことです。",
              "趣味は本をよむことです。",
              "趣味はほんを読むことです。",
              "趣味はほんをよむことです。",
              "しゅみは本を読むことです。",
              "しゅみは本をよむことです。",
              "しゅみはほんを読むことです。",
              "しゅみはほんをよむことです。",
              "趣味は読書です。",
              "趣味はどくしょです。",
              "しゅみは読書です。",
              "しゅみはどくしょです。"
            ],
            "hint": "趣味は V こと です"
          },
          {
            "q": "Tôi không biết bơi.",
            "answers": [
              "泳ぐことができません。",
              "およぐことができません。",
              "私は泳ぐことができません。",
              "私はおよぐことができません。",
              "わたしは泳ぐことができません。",
              "わたしはおよぐことができません。"
            ],
            "hint": "V こと が できません"
          },
          {
            "q": "Một tuần tôi gọi điện cho mẹ hai lần.",
            "answers": [
              "一週間に二回母に電話します。",
              "一週間に二回母にでんわします。",
              "一週間に二回ははに電話します。",
              "一週間に二回ははにでんわします。",
              "一週間ににかい母に電話します。",
              "一週間ににかい母にでんわします。",
              "一週間ににかいははに電話します。",
              "一週間ににかいははにでんわします。",
              "いっしゅうかんに二回母に電話します。",
              "いっしゅうかんに二回母にでんわします。",
              "いっしゅうかんに二回ははに電話します。",
              "いっしゅうかんに二回ははにでんわします。",
              "いっしゅうかんににかい母に電話します。",
              "いっしゅうかんににかい母にでんわします。",
              "いっしゅうかんににかいははに電話します。",
              "いっしゅうかんににかいははにでんわします。",
              "母に一週間に二回電話します。",
              "母に一週間に二回でんわします。",
              "母に一週間ににかい電話します。",
              "母に一週間ににかいでんわします。",
              "母にいっしゅうかんに二回電話します。",
              "母にいっしゅうかんに二回でんわします。",
              "母にいっしゅうかんににかい電話します。",
              "母にいっしゅうかんににかいでんわします。",
              "ははに一週間に二回電話します。",
              "ははに一週間に二回でんわします。",
              "ははに一週間ににかい電話します。",
              "ははに一週間ににかいでんわします。",
              "ははにいっしゅうかんに二回電話します。",
              "ははにいっしゅうかんに二回でんわします。",
              "ははにいっしゅうかんににかい電話します。",
              "ははにいっしゅうかんににかいでんわします。"
            ],
            "hint": "～に ～回"
          },
          {
            "q": "Dạo này tôi không đọc truyện tranh mấy.",
            "answers": [
              "最近、漫画をあまり読みません。",
              "最近、漫画をあまりよみません。",
              "最近、まんがをあまり読みません。",
              "最近、まんがをあまりよみません。",
              "さいきん、漫画をあまり読みません。",
              "さいきん、漫画をあまりよみません。",
              "さいきん、まんがをあまり読みません。",
              "さいきん、まんがをあまりよみません。",
              "最近、あまり漫画を読みません。",
              "最近、あまり漫画をよみません。",
              "最近、あまりまんがを読みません。",
              "最近、あまりまんがをよみません。",
              "さいきん、あまり漫画を読みません。",
              "さいきん、あまり漫画をよみません。",
              "さいきん、あまりまんがを読みません。",
              "さいきん、あまりまんがをよみません。"
            ],
            "hint": "あまり ～ません"
          },
          {
            "q": "Lên tàu điện rồi xuống ở Shinjuku.",
            "answers": [
              "電車に乗って、新宿で降ります。",
              "電車に乗って、新宿でおります。",
              "電車に乗って、しんじゅくで降ります。",
              "電車に乗って、しんじゅくでおります。",
              "電車にのって、新宿で降ります。",
              "電車にのって、新宿でおります。",
              "電車にのって、しんじゅくで降ります。",
              "電車にのって、しんじゅくでおります。",
              "でんしゃに乗って、新宿で降ります。",
              "でんしゃに乗って、新宿でおります。",
              "でんしゃに乗って、しんじゅくで降ります。",
              "でんしゃに乗って、しんじゅくでおります。",
              "でんしゃにのって、新宿で降ります。",
              "でんしゃにのって、新宿でおります。",
              "でんしゃにのって、しんじゅくで降ります。",
              "でんしゃにのって、しんじゅくでおります。"
            ],
            "hint": "に 乗って · で 降ります"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b9-de-vi-b",
        "title": "VI-b. Dịch Nhật → Việt",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {兄|あに}は{上手|じょうず}に{車|くるま}を{運転|うんてん}することができます。　〔Ani wa jouzu ni kuruma o unten suru koto ga dekimasu.〕",
            "options": [
              "Anh tôi không lái được ô tô.",
              "Anh tôi lái ô tô giỏi.",
              "Anh tôi thích ô tô đẹp.",
              "Anh tôi đang học lái ô tô."
            ],
            "correct": 1,
            "why": "上手に V こと が できます = làm V giỏi."
          },
          {
            "q": "Câu này nghĩa là gì? {一|いっ}か{月|げつ}に{一回|いっかい}{国|くに}の{家族|かぞく}に{手紙|てがみ}を{書|か}きます。　〔Ikkagetsu ni ikkai kuni no kazoku ni tegami o kakimasu.〕",
            "options": [
              "Gia đình viết thư cho tôi mỗi tháng.",
              "Tháng Một tôi viết thư cho gia đình.",
              "Một tuần tôi viết thư cho gia đình một lần.",
              "Một tháng tôi viết thư cho gia đình ở quê một lần."
            ],
            "correct": 3,
            "why": "一か月に 一回 = một tháng một lần (khác 一月 = tháng Một)."
          },
          {
            "q": "Câu này nghĩa là gì? {前|まえ}はよく{釣|つ}りをしました。でも、{最近|さいきん}は{全然|ぜんぜん}しません。　〔Mae wa yoku tsuri o shimashita. Demo, saikin wa zenzen shimasen.〕",
            "options": [
              "Tôi hay đi câu, dạo này cũng vậy.",
              "Trước đây tôi hay đi câu. Nhưng dạo này hoàn toàn không đi.",
              "Dạo này tôi thỉnh thoảng đi câu.",
              "Trước đây tôi không đi câu. Nhưng dạo này hay đi."
            ],
            "correct": 1,
            "why": "でも đổi ý: trước ↔ nay."
          },
          {
            "q": "Câu này nghĩa là gì? どうやって{図書館|としょかん}のカードを{作|つく}りますか。　〔Douyatte toshokan no kaado o tsukurimasu ka.〕",
            "options": [
              "Bao giờ làm xong thẻ thư viện?",
              "Thẻ thư viện làm ở đâu?",
              "Tại sao phải làm thẻ thư viện?",
              "Làm thẻ thư viện bằng cách nào?"
            ],
            "correct": 3,
            "why": "どうやって = bằng cách nào."
          }
        ]
      }
    ]
  }
];
