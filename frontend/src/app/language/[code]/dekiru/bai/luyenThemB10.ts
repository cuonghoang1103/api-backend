/**
 * BỘ LUYỆN THÊM Bài 10 (khoá できる日本語 /language/ja/dekiru) — バスツアー — từ DỄ → VỪA → KHÓ.
 *
 * Mỗi lesson: mở đầu bằng "Học thế nào", chia 3 mức 🟢 Dễ · 🟡 Vừa · 🔴 Khó, mọi câu có đáp án + giải thích.
 * lt-b10-…: từ vựng (70 từ của danh sách chính thức 第１０課) · chữ Hán (右左立座歩待持近道橋危曲) · thể ない ·
 *   ngữ pháp 1 (ポイント 88, 89, 97 — いろいろな注意) · ngữ pháp 2 (91, 92, 94, 96 — 集合) ·
 *   ngữ pháp 3 (90, 93, 95 — 動物園で + TRỘN cả 10 điểm) · hội thoại · đọc hiểu · nghe · nói & viết · đề tổng hợp.
 * Mọi câu, hội thoại, kịch bản nghe, bài đọc VIẾT MỚI (không chép sách/đề của cô); chữ Hán có furigana {漢字|かな};
 * romaji cho mọi câu tiếng Nhật (nhúng trong câu hỏi dạng 〔romaji〕 hoặc trường ro).
 * Vai (bảng nhân vật sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン (giọng ja-nu, vai a/c) ·
 *   nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生 (ja-nam, vai b).
 * FILE SINH TỰ ĐỘNG từ bộ soạn trong scratchpad — nếu cần sửa nội dung thì sửa bản gốc rồi sinh lại.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export const LUYEN_THEM_B10: Lesson[] = [
  {
    "id": "lt-b10-tu-vung",
    "kind": "homework",
    "title": "Luyện thêm Bài 10 · Từ vựng — nhận mặt → điền câu → dịch (3 mức, ~253 câu)",
    "goal": "Nhớ chắc 70/70 từ của Bài 10 (chỉ đường, nghe–nhìn, nơi công cộng & lời nhắc, sở thú, cơ thể & cảm giác): nhìn từ biết nghĩa, nhớ từ từ nghĩa, điền đúng vào câu, dịch Việt → Nhật.",
    "minutes": 75,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đi **🟢 → 🟡 → 🔴**. Mức Dễ làm 2 lượt (Nhật → Việt, Việt → Nhật) cho cả 70 từ rồi mới sang mức Vừa. Sai từ nào, **đọc to 3 lần** (romaji trong câu hỏi) rồi làm lại cả khối sau 10 phút.",
          "Học **động từ kèm trợ từ**: 交差点**を** 右**に** 曲がる · 橋**を** 渡る · いす**に** 座る · 部屋**に** 入る · 時間**に** 遅れる · 海**が** 見える · 声**が** 聞こえる · 薬**を** 飲む · えさ**を** やる.",
          "Cặp dễ lẫn: **見ます / 見えます** · **聞きます / 聞こえます** · **音 (đồ vật) / 声 (người, con vật)** · **入り口 (いりぐち) / 入ります (はいります)** · **よく = thường (B9) / rõ (B10)** · **橋 (cầu) / はし (đũa)**."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhìn từ → biết nghĩa; nghe nghĩa → nhớ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-jv1",
        "title": "Nhật → Việt — nhóm A–B: chỉ đường · nghe, nhìn & câu nói ngắn (chủ đề 集合) (21 câu)",
        "items": [
          {
            "q": "「{右|みぎ}」 〔migi〕 nghĩa là gì?",
            "options": [
              "âm thanh, tiếng động (của đồ vật)",
              "một chút, một lát",
              "ờ…, để xem… (khi đang nghĩ)",
              "bên phải"
            ],
            "correct": 3,
            "why": "**{右|みぎ}** (migi) = bên phải — 右に曲がります = rẽ phải"
          },
          {
            "q": "「{左|ひだり}」 〔hidari〕 nghĩa là gì?",
            "options": [
              "thuốc",
              "ờ…, để xem… (khi đang nghĩ)",
              "băng qua, đi qua (cầu, đường)",
              "bên trái"
            ],
            "correct": 3,
            "why": "**{左|ひだり}** (hidari) = bên trái — 左に曲がります = rẽ trái"
          },
          {
            "q": "「{角|かど}」 〔kado〕 nghĩa là gì?",
            "options": [
              "ngã tư, giao lộ",
              "băng qua, đi qua (cầu, đường)",
              "tìm, tìm kiếm",
              "góc đường, góc phố"
            ],
            "correct": 3,
            "why": "**{角|かど}** (kado) = góc đường, góc phố — コンビニの角 = góc cửa hàng tiện lợi"
          },
          {
            "q": "「{交差点|こうさてん}」 〔kousaten〕 nghĩa là gì?",
            "options": [
              "ngã tư, giao lộ",
              "một chút, một lát",
              "thứ ~ (đếm thứ tự)",
              "uống (kể cả uống thuốc)"
            ],
            "correct": 0,
            "why": "**{交差点|こうさてん}** (kousaten) = ngã tư, giao lộ"
          },
          {
            "q": "「{信号|しんごう}」 〔shingou〕 nghĩa là gì?",
            "options": [
              "thuốc",
              "nhìn thấy (được)",
              "giọng nói, tiếng (người, con vật)",
              "đèn giao thông, đèn tín hiệu"
            ],
            "correct": 3,
            "why": "**{信号|しんごう}** (shingou) = đèn giao thông, đèn tín hiệu"
          },
          {
            "q": "「{橋|はし}」 〔hashi〕 nghĩa là gì?",
            "options": [
              "góc đường, góc phố",
              "cây cầu",
              "thuốc",
              "ờ…, để xem… (khi đang nghĩ)"
            ],
            "correct": 1,
            "why": "**{橋|はし}** (hashi) = cây cầu — cùng âm với はし (đũa) — nghe ngữ cảnh: 橋を渡ります"
          },
          {
            "q": "「{道|みち}」 〔michi〕 nghĩa là gì?",
            "options": [
              "con đường, đường đi",
              "rõ, kỹ (よく聞こえません)",
              "tìm, tìm kiếm",
              "băng qua, đi qua (cầu, đường)"
            ],
            "correct": 0,
            "why": "**{道|みち}** (michi) = con đường, đường đi — 道がわかりません = không biết đường"
          },
          {
            "q": "「～つ{目|め}」 〔~tsume〕 nghĩa là gì?",
            "options": [
              "thứ ~ (đếm thứ tự)",
              "ngã tư, giao lộ",
              "rẽ, quẹo",
              "ờ…, để xem… (khi đang nghĩ)"
            ],
            "correct": 0,
            "why": "**～つ{目|め}** (~tsume) = thứ ~ (đếm thứ tự) — 一つ目 ひとつめ, 二つ目 ふたつめ, 三つ目 みっつめ"
          },
          {
            "q": "「まっすぐ」 〔massugu〕 nghĩa là gì?",
            "options": [
              "giọng nói, tiếng (người, con vật)",
              "cây cầu",
              "thẳng",
              "nghe thấy (được)"
            ],
            "correct": 2,
            "why": "**まっすぐ** (massugu) = thẳng — まっすぐ行ってください = hãy đi thẳng"
          },
          {
            "q": "「{曲|ま}がります」 〔magarimasu〕 nghĩa là gì?",
            "options": [
              "rẽ, quẹo",
              "tìm, tìm kiếm",
              "cây cầu",
              "đèn giao thông, đèn tín hiệu"
            ],
            "correct": 0,
            "why": "**{曲|ま}がります** (magarimasu) = rẽ, quẹo — nhóm 1 — 交差点を右に曲がります"
          },
          {
            "q": "「{渡|わた}ります」 〔watarimasu〕 nghĩa là gì?",
            "options": [
              "thẳng",
              "băng qua, đi qua (cầu, đường)",
              "nhìn thấy (được)",
              "góc đường, góc phố"
            ],
            "correct": 1,
            "why": "**{渡|わた}ります** (watarimasu) = băng qua, đi qua (cầu, đường) — nhóm 1 — 橋を渡ります"
          },
          {
            "q": "「{探|さが}します」 〔sagashimasu〕 nghĩa là gì?",
            "options": [
              "giọng nói, tiếng (người, con vật)",
              "tìm, tìm kiếm",
              "cây cầu",
              "uống (kể cả uống thuốc)"
            ],
            "correct": 1,
            "why": "**{探|さが}します** (sagashimasu) = tìm, tìm kiếm — nhóm 1 — 探して → 探さない"
          },
          {
            "q": "「{音|おと}」 〔oto〕 nghĩa là gì?",
            "options": [
              "âm thanh, tiếng động (của đồ vật)",
              "thẳng",
              "uống (kể cả uống thuốc)",
              "nhìn thấy (được)"
            ],
            "correct": 0,
            "why": "**{音|おと}** (oto) = âm thanh, tiếng động (của đồ vật) — 車の音, 雨の音"
          },
          {
            "q": "「{声|こえ}」 〔koe〕 nghĩa là gì?",
            "options": [
              "giọng nói, tiếng (người, con vật)",
              "ờ…, để xem… (khi đang nghĩ)",
              "cây cầu",
              "thuốc"
            ],
            "correct": 0,
            "why": "**{声|こえ}** (koe) = giọng nói, tiếng (người, con vật) — 鳥の声, 子どもの声"
          },
          {
            "q": "「{見|み}えます」 〔miemasu〕 nghĩa là gì?",
            "options": [
              "đèn giao thông, đèn tín hiệu",
              "cây cầu",
              "nhìn thấy (được)",
              "giọng nói, tiếng (người, con vật)"
            ],
            "correct": 2,
            "why": "**{見|み}えます** (miemasu) = nhìn thấy (được) — nhóm 2 — N が 見えます"
          },
          {
            "q": "「{聞|き}こえます」 〔kikoemasu〕 nghĩa là gì?",
            "options": [
              "nghe thấy (được)",
              "ngã tư, giao lộ",
              "bên trái",
              "rõ, kỹ (よく聞こえません)"
            ],
            "correct": 0,
            "why": "**{聞|き}こえます** (kikoemasu) = nghe thấy (được) — nhóm 2 — N が 聞こえます"
          },
          {
            "q": "「{薬|くすり}」 〔kusuri〕 nghĩa là gì?",
            "options": [
              "thuốc",
              "âm thanh, tiếng động (của đồ vật)",
              "thẳng",
              "tìm, tìm kiếm"
            ],
            "correct": 0,
            "why": "**{薬|くすり}** (kusuri) = thuốc — 薬を飲みます = uống thuốc"
          },
          {
            "q": "「{飲|の}みます」 〔nomimasu〕 nghĩa là gì?",
            "options": [
              "đèn giao thông, đèn tín hiệu",
              "rẽ, quẹo",
              "âm thanh, tiếng động (của đồ vật)",
              "uống (kể cả uống thuốc)"
            ],
            "correct": 3,
            "why": "**{飲|の}みます** (nomimasu) = uống (kể cả uống thuốc) — nhóm 1 — 飲んで → 飲まない"
          },
          {
            "q": "「よく」 〔yoku〕 nghĩa là gì?",
            "options": [
              "bên trái",
              "ờ…, để xem… (khi đang nghĩ)",
              "nhìn thấy (được)",
              "rõ, kỹ (よく聞こえません)"
            ],
            "correct": 3,
            "why": "**よく** (yoku) = rõ, kỹ (よく聞こえません) — Bài 9 よく = thường xuyên; Bài 10 よく = rõ"
          },
          {
            "q": "「ちょっと」 〔chotto〕 nghĩa là gì?",
            "options": [
              "ngã tư, giao lộ",
              "băng qua, đi qua (cầu, đường)",
              "một chút, một lát",
              "rẽ, quẹo"
            ],
            "correct": 2,
            "why": "**ちょっと** (chotto) = một chút, một lát — ちょっと～てきます = đi … một lát rồi về"
          },
          {
            "q": "「ええと」 〔eeto〕 nghĩa là gì?",
            "options": [
              "ờ…, để xem… (khi đang nghĩ)",
              "thẳng",
              "băng qua, đi qua (cầu, đường)",
              "đèn giao thông, đèn tín hiệu"
            ],
            "correct": 0,
            "why": "**ええと** (eeto) = ờ…, để xem… (khi đang nghĩ)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-jv2",
        "title": "Nhật → Việt — nhóm C–D: trên xe, nơi công cộng · lời nhắc nhở (chủ đề いろいろな注意) (21 câu)",
        "items": [
          {
            "q": "「カーテン」 〔kaaten〕 nghĩa là gì?",
            "options": [
              "rèm cửa",
              "vứt, vứt bỏ",
              "quan trọng, quý giá",
              "tờ rơi, tờ giới thiệu"
            ],
            "correct": 0,
            "why": "**カーテン** (kaaten) = rèm cửa"
          },
          {
            "q": "「（お）{客|きゃく}（さん）」 〔(o)kyaku(san)〕 nghĩa là gì?",
            "options": [
              "vứt, vứt bỏ",
              "mang về",
              "khách, khách hàng",
              "làm mất, đánh mất"
            ],
            "correct": 2,
            "why": "**（お）{客|きゃく}（さん）** ((o)kyaku(san)) = khách, khách hàng — お客さん = cách gọi lịch sự"
          },
          {
            "q": "「ごみ」 〔gomi〕 nghĩa là gì?",
            "options": [
              "mang về",
              "khách, khách hàng",
              "rác",
              "làm mất, đánh mất"
            ],
            "correct": 2,
            "why": "**ごみ** (gomi) = rác"
          },
          {
            "q": "「{手|て}」 〔te〕 nghĩa là gì?",
            "options": [
              "tay, bàn tay",
              "muộn, trễ",
              "mang về",
              "tập trung, tập hợp"
            ],
            "correct": 0,
            "why": "**{手|て}** (te) = tay, bàn tay"
          },
          {
            "q": "「{荷物|にもつ}」 〔nimotsu〕 nghĩa là gì?",
            "options": [
              "hành lý, đồ đạc; bưu phẩm",
              "phiền phức, gây phiền",
              "vào, đi vào",
              "tờ rơi, tờ giới thiệu"
            ],
            "correct": 0,
            "why": "**{荷物|にもつ}** (nimotsu) = hành lý, đồ đạc; bưu phẩm"
          },
          {
            "q": "「パンフレット」 〔panfuretto〕 nghĩa là gì?",
            "options": [
              "tờ rơi, tờ giới thiệu",
              "làm mất, đánh mất",
              "nguy hiểm",
              "tập trung, tập hợp"
            ],
            "correct": 0,
            "why": "**パンフレット** (panfuretto) = tờ rơi, tờ giới thiệu"
          },
          {
            "q": "「{他|ほか}」 〔hoka〕 nghĩa là gì?",
            "options": [
              "khác (cái khác, người khác)",
              "quà lưu niệm (mua khi đi xa)",
              "hành lý, đồ đạc; bưu phẩm",
              "rác"
            ],
            "correct": 0,
            "why": "**{他|ほか}** (hoka) = khác (cái khác, người khác) — 他の人 = người khác"
          },
          {
            "q": "「{皆|みな}さん」 〔minasan〕 nghĩa là gì?",
            "options": [
              "tập trung, tập hợp",
              "tay, bàn tay",
              "mang về",
              "mọi người, các bạn"
            ],
            "correct": 3,
            "why": "**{皆|みな}さん** (minasan) = mọi người, các bạn"
          },
          {
            "q": "「（お）{土産|みやげ}」 〔(o)miyage〕 nghĩa là gì?",
            "options": [
              "rác",
              "mang về",
              "quà lưu niệm (mua khi đi xa)",
              "khác (cái khác, người khác)"
            ],
            "correct": 2,
            "why": "**（お）{土産|みやげ}** ((o)miyage) = quà lưu niệm (mua khi đi xa)"
          },
          {
            "q": "「{押|お}します」 〔oshimasu〕 nghĩa là gì?",
            "options": [
              "quà lưu niệm (mua khi đi xa)",
              "ngồi",
              "ấn, bấm; đẩy, chen lấn",
              "vứt, vứt bỏ"
            ],
            "correct": 2,
            "why": "**{押|お}します** (oshimasu) = ấn, bấm; đẩy, chen lấn — nhóm 1 — 押さないでください"
          },
          {
            "q": "「{座|すわ}ります」 〔suwarimasu〕 nghĩa là gì?",
            "options": [
              "ngồi",
              "làm mất, đánh mất",
              "đứng, đứng lên",
              "khách, khách hàng"
            ],
            "correct": 0,
            "why": "**{座|すわ}ります** (suwarimasu) = ngồi — nhóm 1 — chỗ ngồi + に: いすに座ります"
          },
          {
            "q": "「{立|た}ちます」 〔tachimasu〕 nghĩa là gì?",
            "options": [
              "quan trọng, quý giá",
              "khác (cái khác, người khác)",
              "nguy hiểm",
              "đứng, đứng lên"
            ],
            "correct": 3,
            "why": "**{立|た}ちます** (tachimasu) = đứng, đứng lên — nhóm 1 — 立って → 立たない"
          },
          {
            "q": "「なくします」 〔nakushimasu〕 nghĩa là gì?",
            "options": [
              "muộn, trễ",
              "phiền phức, gây phiền",
              "làm mất, đánh mất",
              "ngồi"
            ],
            "correct": 2,
            "why": "**なくします** (nakushimasu) = làm mất, đánh mất — nhóm 1 — なくさないでください"
          },
          {
            "q": "「{入|はい}ります」 〔hairimasu〕 nghĩa là gì?",
            "options": [
              "quà lưu niệm (mua khi đi xa)",
              "phiền phức, gây phiền",
              "vào, đi vào",
              "tay, bàn tay"
            ],
            "correct": 2,
            "why": "**{入|はい}ります** (hairimasu) = vào, đi vào — nhóm 1 (đội lốt nhóm 2) — 入らない; nơi + に"
          },
          {
            "q": "「{持|も}って{帰|かえ}ります」 〔motte kaerimasu〕 nghĩa là gì?",
            "options": [
              "tay, bàn tay",
              "vào, đi vào",
              "mang về",
              "tập trung, tập hợp"
            ],
            "correct": 2,
            "why": "**{持|も}って{帰|かえ}ります** (motte kaerimasu) = mang về — nhóm 1 — ごみを持って帰ります"
          },
          {
            "q": "「{遅|おく}れます」 〔okuremasu〕 nghĩa là gì?",
            "options": [
              "vào, đi vào",
              "làm mất, đánh mất",
              "muộn, trễ",
              "ngồi"
            ],
            "correct": 2,
            "why": "**{遅|おく}れます** (okuremasu) = muộn, trễ — nhóm 2 — 時間に遅れます"
          },
          {
            "q": "「{捨|す}てます」 〔sutemasu〕 nghĩa là gì?",
            "options": [
              "vứt, vứt bỏ",
              "hành lý, đồ đạc; bưu phẩm",
              "muộn, trễ",
              "ngồi"
            ],
            "correct": 0,
            "why": "**{捨|す}てます** (sutemasu) = vứt, vứt bỏ — nhóm 2 — ごみを捨てます"
          },
          {
            "q": "「{集合|しゅうごう}します」 〔shuugou shimasu〕 nghĩa là gì?",
            "options": [
              "rác",
              "làm mất, đánh mất",
              "tập trung, tập hợp",
              "vứt, vứt bỏ"
            ],
            "correct": 2,
            "why": "**{集合|しゅうごう}します** (shuugou shimasu) = tập trung, tập hợp — nhóm 3 — 集合時間 = giờ tập hợp"
          },
          {
            "q": "「{危|あぶ}ない」 〔abunai〕 nghĩa là gì?",
            "options": [
              "ấn, bấm; đẩy, chen lấn",
              "nguy hiểm",
              "tờ rơi, tờ giới thiệu",
              "mọi người, các bạn"
            ],
            "correct": 1,
            "why": "**{危|あぶ}ない** (abunai) = nguy hiểm — tính từ い"
          },
          {
            "q": "「{大切|たいせつ}（な）」 〔taisetsu (na)〕 nghĩa là gì?",
            "options": [
              "khách, khách hàng",
              "tờ rơi, tờ giới thiệu",
              "mang về",
              "quan trọng, quý giá"
            ],
            "correct": 3,
            "why": "**{大切|たいせつ}（な）** (taisetsu (na)) = quan trọng, quý giá — tính từ な — 大切な写真"
          },
          {
            "q": "「{迷惑|めいわく}（な）」 〔meiwaku (na)〕 nghĩa là gì?",
            "options": [
              "tay, bàn tay",
              "mọi người, các bạn",
              "hành lý, đồ đạc; bưu phẩm",
              "phiền phức, gây phiền"
            ],
            "correct": 3,
            "why": "**{迷惑|めいわく}（な）** (meiwaku (na)) = phiền phức, gây phiền — tính từ な — 他の人に迷惑です"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-jv3",
        "title": "Nhật → Việt — nhóm E–G: sở thú · cơ thể & cảm giác · động từ (chủ đề 動物園で) (28 câu)",
        "items": [
          {
            "q": "「{動物園|どうぶつえん}」 〔doubutsuen〕 nghĩa là gì?",
            "options": [
              "lối ra, cửa ra",
              "vườn bách thú, sở thú",
              "con khỉ",
              "Đúng thật! Thật này!"
            ],
            "correct": 1,
            "why": "**{動物園|どうぶつえん}** (doubutsuen) = vườn bách thú, sở thú"
          },
          {
            "q": "「クマ」 〔kuma〕 nghĩa là gì?",
            "options": [
              "con voi",
              "lối vào, cửa vào",
              "các ~, bọn ~ (số nhiều)",
              "con gấu"
            ],
            "correct": 3,
            "why": "**クマ** (kuma) = con gấu"
          },
          {
            "q": "「コアラ」 〔koara〕 nghĩa là gì?",
            "options": [
              "gấu koala",
              "con khỉ",
              "quả bóng",
              "gấu trúc"
            ],
            "correct": 0,
            "why": "**コアラ** (koara) = gấu koala"
          },
          {
            "q": "「サル」 〔saru〕 nghĩa là gì?",
            "options": [
              "quả chuối",
              "thức ăn cho động vật, mồi",
              "đau",
              "con khỉ"
            ],
            "correct": 3,
            "why": "**サル** (saru) = con khỉ"
          },
          {
            "q": "「ゾウ」 〔zou〕 nghĩa là gì?",
            "options": [
              "nghỉ, nghỉ ngơi",
              "sắp đến lúc, sắp sửa",
              "con voi",
              "vòng đu quay"
            ],
            "correct": 2,
            "why": "**ゾウ** (zou) = con voi"
          },
          {
            "q": "「{鳥|とり}」 〔tori〕 nghĩa là gì?",
            "options": [
              "mệt",
              "trở nên, trở thành",
              "con chim",
              "gấu koala"
            ],
            "correct": 2,
            "why": "**{鳥|とり}** (tori) = con chim"
          },
          {
            "q": "「パンダ」 〔panda〕 nghĩa là gì?",
            "options": [
              "đau",
              "gấu trúc",
              "các ~, bọn ~ (số nhiều)",
              "quả chuối"
            ],
            "correct": 1,
            "why": "**パンダ** (panda) = gấu trúc"
          },
          {
            "q": "「ペンギン」 〔pengin〕 nghĩa là gì?",
            "options": [
              "quả chuối",
              "cho (thú ăn); làm",
              "chim cánh cụt",
              "các ~, bọn ~ (số nhiều)"
            ],
            "correct": 2,
            "why": "**ペンギン** (pengin) = chim cánh cụt"
          },
          {
            "q": "「{入|い}り{口|ぐち}」 〔iriguchi〕 nghĩa là gì?",
            "options": [
              "đi bộ",
              "quả chuối",
              "lối vào, cửa vào",
              "bay"
            ],
            "correct": 2,
            "why": "**{入|い}り{口|ぐち}** (iriguchi) = lối vào, cửa vào — 入 ở đây đọc い (không phải はい)"
          },
          {
            "q": "「{出口|でぐち}」 〔deguchi〕 nghĩa là gì?",
            "options": [
              "gấu trúc",
              "con chim",
              "con khỉ",
              "lối ra, cửa ra"
            ],
            "correct": 3,
            "why": "**{出口|でぐち}** (deguchi) = lối ra, cửa ra"
          },
          {
            "q": "「えさ」 〔esa〕 nghĩa là gì?",
            "options": [
              "thức ăn cho động vật, mồi",
              "bay",
              "đau",
              "con gấu"
            ],
            "correct": 0,
            "why": "**えさ** (esa) = thức ăn cho động vật, mồi — えさをやります = cho (thú) ăn"
          },
          {
            "q": "「{観覧車|かんらんしゃ}」 〔kanransha〕 nghĩa là gì?",
            "options": [
              "gấu trúc",
              "vòng đu quay",
              "trở nên, trở thành",
              "sắp đến lúc, sắp sửa"
            ],
            "correct": 1,
            "why": "**{観覧車|かんらんしゃ}** (kanransha) = vòng đu quay"
          },
          {
            "q": "「バナナ」 〔banana〕 nghĩa là gì?",
            "options": [
              "các ~, bọn ~ (số nhiều)",
              "con chim",
              "quả chuối",
              "khát nước"
            ],
            "correct": 2,
            "why": "**バナナ** (banana) = quả chuối"
          },
          {
            "q": "「ボール」 〔booru〕 nghĩa là gì?",
            "options": [
              "vòng đu quay",
              "trở nên, trở thành",
              "bụng",
              "quả bóng"
            ],
            "correct": 3,
            "why": "**ボール** (booru) = quả bóng"
          },
          {
            "q": "「～たち」 〔~tachi〕 nghĩa là gì?",
            "options": [
              "con gấu",
              "đi bộ",
              "đói bụng",
              "các ~, bọn ~ (số nhiều)"
            ],
            "correct": 3,
            "why": "**～たち** (~tachi) = các ~, bọn ~ (số nhiều) — 私たち, 子どもたち"
          },
          {
            "q": "「おなか」 〔onaka〕 nghĩa là gì?",
            "options": [
              "đau",
              "bụng",
              "con khỉ",
              "lối vào, cửa vào"
            ],
            "correct": 1,
            "why": "**おなか** (onaka) = bụng"
          },
          {
            "q": "「おなかがすきます」 〔onaka ga sukimasu〕 nghĩa là gì?",
            "options": [
              "vườn bách thú, sở thú",
              "cho (thú ăn); làm",
              "đi bộ",
              "đói bụng"
            ],
            "correct": 3,
            "why": "**おなかがすきます** (onaka ga sukimasu) = đói bụng — thường nói おなかがすきました = đói rồi"
          },
          {
            "q": "「のどがかわきます」 〔nodo ga kawakimasu〕 nghĩa là gì?",
            "options": [
              "đi bộ",
              "khát nước",
              "quả bóng",
              "nghỉ, nghỉ ngơi"
            ],
            "correct": 1,
            "why": "**のどがかわきます** (nodo ga kawakimasu) = khát nước — のどがかわきました = khát rồi"
          },
          {
            "q": "「{疲|つか}れます」 〔tsukaremasu〕 nghĩa là gì?",
            "options": [
              "lối vào, cửa vào",
              "mệt",
              "gấu trúc",
              "lối ra, cửa ra"
            ],
            "correct": 1,
            "why": "**{疲|つか}れます** (tsukaremasu) = mệt — nhóm 2 — 疲れました = mệt rồi"
          },
          {
            "q": "「{痛|いた}い」 〔itai〕 nghĩa là gì?",
            "options": [
              "con khỉ",
              "cho (thú ăn); làm",
              "tối",
              "đau"
            ],
            "correct": 3,
            "why": "**{痛|いた}い** (itai) = đau — bộ phận + が痛いです"
          },
          {
            "q": "「{暗|くら}い」 〔kurai〕 nghĩa là gì?",
            "options": [
              "bay",
              "gấu koala",
              "tối",
              "con voi"
            ],
            "correct": 2,
            "why": "**{暗|くら}い** (kurai) = tối — ↔ 明るい (sáng)"
          },
          {
            "q": "「{歩|ある}きます」 〔arukimasu〕 nghĩa là gì?",
            "options": [
              "bụng",
              "đi bộ",
              "quả bóng",
              "lối vào, cửa vào"
            ],
            "correct": 1,
            "why": "**{歩|ある}きます** (arukimasu) = đi bộ — nhóm 1 — 歩いて10分 = đi bộ 10 phút"
          },
          {
            "q": "「{飛|と}びます」 〔tobimasu〕 nghĩa là gì?",
            "options": [
              "lối ra, cửa ra",
              "bay",
              "gấu trúc",
              "con voi"
            ],
            "correct": 1,
            "why": "**{飛|と}びます** (tobimasu) = bay — nhóm 1 — 飛んで → 飛ばない"
          },
          {
            "q": "「なります」 〔narimasu〕 nghĩa là gì?",
            "options": [
              "Đúng thật! Thật này!",
              "sắp đến lúc, sắp sửa",
              "trở nên, trở thành",
              "quả bóng"
            ],
            "correct": 2,
            "why": "**なります** (narimasu) = trở nên, trở thành — nhóm 1 — 寒くなります, 12時になります"
          },
          {
            "q": "「{休|やす}みます」 〔yasumimasu〕 nghĩa là gì?",
            "options": [
              "con chim",
              "Đúng thật! Thật này!",
              "nghỉ, nghỉ ngơi",
              "con khỉ"
            ],
            "correct": 2,
            "why": "**{休|やす}みます** (yasumimasu) = nghỉ, nghỉ ngơi — ベンチで休みましょう"
          },
          {
            "q": "「やります」 〔yarimasu〕 nghĩa là gì?",
            "options": [
              "cho (thú ăn); làm",
              "con khỉ",
              "bụng",
              "quả bóng"
            ],
            "correct": 0,
            "why": "**やります** (yarimasu) = cho (thú ăn); làm — nhóm 1 — えさをやります"
          },
          {
            "q": "「そろそろ」 〔sorosoro〕 nghĩa là gì?",
            "options": [
              "sắp đến lúc, sắp sửa",
              "đói bụng",
              "gấu trúc",
              "vườn bách thú, sở thú"
            ],
            "correct": 0,
            "why": "**そろそろ** (sorosoro) = sắp đến lúc, sắp sửa"
          },
          {
            "q": "「{本当|ほんとう}だ」 〔hontou da〕 nghĩa là gì?",
            "options": [
              "tối",
              "Đúng thật! Thật này!",
              "đau",
              "chim cánh cụt"
            ],
            "correct": 1,
            "why": "**{本当|ほんとう}だ** (hontou da) = Đúng thật! Thật này! — thể thường, nói với bạn bè"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-vj1",
        "title": "Việt → Nhật — nhóm A–B: chỉ đường · nghe, nhìn & câu nói ngắn (chủ đề 集合) (21 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"bên phải\" là từ nào?",
            "options": [
              "{道|みち} (michi)",
              "{信号|しんごう} (shingou)",
              "{右|みぎ} (migi)",
              "{渡|わた}ります (watarimasu)"
            ],
            "correct": 2,
            "why": "**{右|みぎ}** (migi) = bên phải — 右に曲がります = rẽ phải"
          },
          {
            "q": "Tiếng Nhật của \"bên trái\" là từ nào?",
            "options": [
              "{左|ひだり} (hidari)",
              "{聞|き}こえます (kikoemasu)",
              "{渡|わた}ります (watarimasu)",
              "{薬|くすり} (kusuri)"
            ],
            "correct": 0,
            "why": "**{左|ひだり}** (hidari) = bên trái — 左に曲がります = rẽ trái"
          },
          {
            "q": "Tiếng Nhật của \"góc đường, góc phố\" là từ nào?",
            "options": [
              "{角|かど} (kado)",
              "よく (yoku)",
              "{渡|わた}ります (watarimasu)",
              "{聞|き}こえます (kikoemasu)"
            ],
            "correct": 0,
            "why": "**{角|かど}** (kado) = góc đường, góc phố — コンビニの角 = góc cửa hàng tiện lợi"
          },
          {
            "q": "Tiếng Nhật của \"ngã tư, giao lộ\" là từ nào?",
            "options": [
              "{右|みぎ} (migi)",
              "{声|こえ} (koe)",
              "{交差点|こうさてん} (kousaten)",
              "{左|ひだり} (hidari)"
            ],
            "correct": 2,
            "why": "**{交差点|こうさてん}** (kousaten) = ngã tư, giao lộ"
          },
          {
            "q": "Tiếng Nhật của \"đèn giao thông, đèn tín hiệu\" là từ nào?",
            "options": [
              "{信号|しんごう} (shingou)",
              "ちょっと (chotto)",
              "{曲|ま}がります (magarimasu)",
              "{橋|はし} (hashi)"
            ],
            "correct": 0,
            "why": "**{信号|しんごう}** (shingou) = đèn giao thông, đèn tín hiệu"
          },
          {
            "q": "Tiếng Nhật của \"cây cầu\" là từ nào?",
            "options": [
              "よく (yoku)",
              "{橋|はし} (hashi)",
              "{渡|わた}ります (watarimasu)",
              "{声|こえ} (koe)"
            ],
            "correct": 1,
            "why": "**{橋|はし}** (hashi) = cây cầu — cùng âm với はし (đũa) — nghe ngữ cảnh: 橋を渡ります"
          },
          {
            "q": "Tiếng Nhật của \"con đường, đường đi\" là từ nào?",
            "options": [
              "{飲|の}みます (nomimasu)",
              "よく (yoku)",
              "まっすぐ (massugu)",
              "{道|みち} (michi)"
            ],
            "correct": 3,
            "why": "**{道|みち}** (michi) = con đường, đường đi — 道がわかりません = không biết đường"
          },
          {
            "q": "Tiếng Nhật của \"thứ ~ (đếm thứ tự)\" là từ nào?",
            "options": [
              "{左|ひだり} (hidari)",
              "{見|み}えます (miemasu)",
              "ええと (eeto)",
              "～つ{目|め} (~tsume)"
            ],
            "correct": 3,
            "why": "**～つ{目|め}** (~tsume) = thứ ~ (đếm thứ tự) — 一つ目 ひとつめ, 二つ目 ふたつめ, 三つ目 みっつめ"
          },
          {
            "q": "Tiếng Nhật của \"thẳng\" là từ nào?",
            "options": [
              "ちょっと (chotto)",
              "～つ{目|め} (~tsume)",
              "{橋|はし} (hashi)",
              "まっすぐ (massugu)"
            ],
            "correct": 3,
            "why": "**まっすぐ** (massugu) = thẳng — まっすぐ行ってください = hãy đi thẳng"
          },
          {
            "q": "Tiếng Nhật của \"rẽ, quẹo\" là từ nào?",
            "options": [
              "{飲|の}みます (nomimasu)",
              "{曲|ま}がります (magarimasu)",
              "{右|みぎ} (migi)",
              "ちょっと (chotto)"
            ],
            "correct": 1,
            "why": "**{曲|ま}がります** (magarimasu) = rẽ, quẹo — nhóm 1 — 交差点を右に曲がります"
          },
          {
            "q": "Tiếng Nhật của \"băng qua, đi qua (cầu, đường)\" là từ nào?",
            "options": [
              "ええと (eeto)",
              "{渡|わた}ります (watarimasu)",
              "{曲|ま}がります (magarimasu)",
              "{角|かど} (kado)"
            ],
            "correct": 1,
            "why": "**{渡|わた}ります** (watarimasu) = băng qua, đi qua (cầu, đường) — nhóm 1 — 橋を渡ります"
          },
          {
            "q": "Tiếng Nhật của \"tìm, tìm kiếm\" là từ nào?",
            "options": [
              "{声|こえ} (koe)",
              "{信号|しんごう} (shingou)",
              "{探|さが}します (sagashimasu)",
              "{聞|き}こえます (kikoemasu)"
            ],
            "correct": 2,
            "why": "**{探|さが}します** (sagashimasu) = tìm, tìm kiếm — nhóm 1 — 探して → 探さない"
          },
          {
            "q": "Tiếng Nhật của \"âm thanh, tiếng động (của đồ vật)\" là từ nào?",
            "options": [
              "{道|みち} (michi)",
              "{交差点|こうさてん} (kousaten)",
              "ええと (eeto)",
              "{音|おと} (oto)"
            ],
            "correct": 3,
            "why": "**{音|おと}** (oto) = âm thanh, tiếng động (của đồ vật) — 車の音, 雨の音"
          },
          {
            "q": "Tiếng Nhật của \"giọng nói, tiếng (người, con vật)\" là từ nào?",
            "options": [
              "{左|ひだり} (hidari)",
              "{信号|しんごう} (shingou)",
              "{声|こえ} (koe)",
              "{渡|わた}ります (watarimasu)"
            ],
            "correct": 2,
            "why": "**{声|こえ}** (koe) = giọng nói, tiếng (người, con vật) — 鳥の声, 子どもの声"
          },
          {
            "q": "Tiếng Nhật của \"nhìn thấy (được)\" là từ nào?",
            "options": [
              "～つ{目|め} (~tsume)",
              "{橋|はし} (hashi)",
              "{薬|くすり} (kusuri)",
              "{見|み}えます (miemasu)"
            ],
            "correct": 3,
            "why": "**{見|み}えます** (miemasu) = nhìn thấy (được) — nhóm 2 — N が 見えます"
          },
          {
            "q": "Tiếng Nhật của \"nghe thấy (được)\" là từ nào?",
            "options": [
              "{渡|わた}ります (watarimasu)",
              "{飲|の}みます (nomimasu)",
              "～つ{目|め} (~tsume)",
              "{聞|き}こえます (kikoemasu)"
            ],
            "correct": 3,
            "why": "**{聞|き}こえます** (kikoemasu) = nghe thấy (được) — nhóm 2 — N が 聞こえます"
          },
          {
            "q": "Tiếng Nhật của \"thuốc\" là từ nào?",
            "options": [
              "{聞|き}こえます (kikoemasu)",
              "まっすぐ (massugu)",
              "{左|ひだり} (hidari)",
              "{薬|くすり} (kusuri)"
            ],
            "correct": 3,
            "why": "**{薬|くすり}** (kusuri) = thuốc — 薬を飲みます = uống thuốc"
          },
          {
            "q": "Tiếng Nhật của \"uống (kể cả uống thuốc)\" là từ nào?",
            "options": [
              "{飲|の}みます (nomimasu)",
              "{渡|わた}ります (watarimasu)",
              "{右|みぎ} (migi)",
              "まっすぐ (massugu)"
            ],
            "correct": 0,
            "why": "**{飲|の}みます** (nomimasu) = uống (kể cả uống thuốc) — nhóm 1 — 飲んで → 飲まない"
          },
          {
            "q": "Tiếng Nhật của \"rõ, kỹ (よく聞こえません)\" là từ nào?",
            "options": [
              "{交差点|こうさてん} (kousaten)",
              "{音|おと} (oto)",
              "{道|みち} (michi)",
              "よく (yoku)"
            ],
            "correct": 3,
            "why": "**よく** (yoku) = rõ, kỹ (よく聞こえません) — Bài 9 よく = thường xuyên; Bài 10 よく = rõ"
          },
          {
            "q": "Tiếng Nhật của \"một chút, một lát\" là từ nào?",
            "options": [
              "まっすぐ (massugu)",
              "{道|みち} (michi)",
              "ちょっと (chotto)",
              "{飲|の}みます (nomimasu)"
            ],
            "correct": 2,
            "why": "**ちょっと** (chotto) = một chút, một lát — ちょっと～てきます = đi … một lát rồi về"
          },
          {
            "q": "Tiếng Nhật của \"ờ…, để xem… (khi đang nghĩ)\" là từ nào?",
            "options": [
              "よく (yoku)",
              "まっすぐ (massugu)",
              "ええと (eeto)",
              "{交差点|こうさてん} (kousaten)"
            ],
            "correct": 2,
            "why": "**ええと** (eeto) = ờ…, để xem… (khi đang nghĩ)"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-vj2",
        "title": "Việt → Nhật — nhóm C–D: trên xe, nơi công cộng · lời nhắc nhở (chủ đề いろいろな注意) (21 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"rèm cửa\" là từ nào?",
            "options": [
              "カーテン (kaaten)",
              "ごみ (gomi)",
              "{捨|す}てます (sutemasu)",
              "{座|すわ}ります (suwarimasu)"
            ],
            "correct": 0,
            "why": "**カーテン** (kaaten) = rèm cửa"
          },
          {
            "q": "Tiếng Nhật của \"khách, khách hàng\" là từ nào?",
            "options": [
              "（お）{客|きゃく}（さん） ((o)kyaku(san))",
              "{押|お}します (oshimasu)",
              "{入|はい}ります (hairimasu)",
              "{手|て} (te)"
            ],
            "correct": 0,
            "why": "**（お）{客|きゃく}（さん）** ((o)kyaku(san)) = khách, khách hàng — お客さん = cách gọi lịch sự"
          },
          {
            "q": "Tiếng Nhật của \"rác\" là từ nào?",
            "options": [
              "{皆|みな}さん (minasan)",
              "ごみ (gomi)",
              "（お）{土産|みやげ} ((o)miyage)",
              "パンフレット (panfuretto)"
            ],
            "correct": 1,
            "why": "**ごみ** (gomi) = rác"
          },
          {
            "q": "Tiếng Nhật của \"tay, bàn tay\" là từ nào?",
            "options": [
              "{手|て} (te)",
              "{座|すわ}ります (suwarimasu)",
              "{集合|しゅうごう}します (shuugou shimasu)",
              "{他|ほか} (hoka)"
            ],
            "correct": 0,
            "why": "**{手|て}** (te) = tay, bàn tay"
          },
          {
            "q": "Tiếng Nhật của \"hành lý, đồ đạc; bưu phẩm\" là từ nào?",
            "options": [
              "カーテン (kaaten)",
              "{荷物|にもつ} (nimotsu)",
              "{座|すわ}ります (suwarimasu)",
              "{持|も}って{帰|かえ}ります (motte kaerimasu)"
            ],
            "correct": 1,
            "why": "**{荷物|にもつ}** (nimotsu) = hành lý, đồ đạc; bưu phẩm"
          },
          {
            "q": "Tiếng Nhật của \"tờ rơi, tờ giới thiệu\" là từ nào?",
            "options": [
              "{持|も}って{帰|かえ}ります (motte kaerimasu)",
              "パンフレット (panfuretto)",
              "{捨|す}てます (sutemasu)",
              "{入|はい}ります (hairimasu)"
            ],
            "correct": 1,
            "why": "**パンフレット** (panfuretto) = tờ rơi, tờ giới thiệu"
          },
          {
            "q": "Tiếng Nhật của \"khác (cái khác, người khác)\" là từ nào?",
            "options": [
              "{押|お}します (oshimasu)",
              "{他|ほか} (hoka)",
              "（お）{土産|みやげ} ((o)miyage)",
              "{持|も}って{帰|かえ}ります (motte kaerimasu)"
            ],
            "correct": 1,
            "why": "**{他|ほか}** (hoka) = khác (cái khác, người khác) — 他の人 = người khác"
          },
          {
            "q": "Tiếng Nhật của \"mọi người, các bạn\" là từ nào?",
            "options": [
              "（お）{土産|みやげ} ((o)miyage)",
              "{荷物|にもつ} (nimotsu)",
              "なくします (nakushimasu)",
              "{皆|みな}さん (minasan)"
            ],
            "correct": 3,
            "why": "**{皆|みな}さん** (minasan) = mọi người, các bạn"
          },
          {
            "q": "Tiếng Nhật của \"quà lưu niệm (mua khi đi xa)\" là từ nào?",
            "options": [
              "{他|ほか} (hoka)",
              "{危|あぶ}ない (abunai)",
              "{皆|みな}さん (minasan)",
              "（お）{土産|みやげ} ((o)miyage)"
            ],
            "correct": 3,
            "why": "**（お）{土産|みやげ}** ((o)miyage) = quà lưu niệm (mua khi đi xa)"
          },
          {
            "q": "Tiếng Nhật của \"ấn, bấm; đẩy, chen lấn\" là từ nào?",
            "options": [
              "{捨|す}てます (sutemasu)",
              "{入|はい}ります (hairimasu)",
              "{押|お}します (oshimasu)",
              "カーテン (kaaten)"
            ],
            "correct": 2,
            "why": "**{押|お}します** (oshimasu) = ấn, bấm; đẩy, chen lấn — nhóm 1 — 押さないでください"
          },
          {
            "q": "Tiếng Nhật của \"ngồi\" là từ nào?",
            "options": [
              "{遅|おく}れます (okuremasu)",
              "{立|た}ちます (tachimasu)",
              "{他|ほか} (hoka)",
              "{座|すわ}ります (suwarimasu)"
            ],
            "correct": 3,
            "why": "**{座|すわ}ります** (suwarimasu) = ngồi — nhóm 1 — chỗ ngồi + に: いすに座ります"
          },
          {
            "q": "Tiếng Nhật của \"đứng, đứng lên\" là từ nào?",
            "options": [
              "{立|た}ちます (tachimasu)",
              "{皆|みな}さん (minasan)",
              "{迷惑|めいわく}（な） (meiwaku (na))",
              "{押|お}します (oshimasu)"
            ],
            "correct": 0,
            "why": "**{立|た}ちます** (tachimasu) = đứng, đứng lên — nhóm 1 — 立って → 立たない"
          },
          {
            "q": "Tiếng Nhật của \"làm mất, đánh mất\" là từ nào?",
            "options": [
              "{遅|おく}れます (okuremasu)",
              "カーテン (kaaten)",
              "なくします (nakushimasu)",
              "{皆|みな}さん (minasan)"
            ],
            "correct": 2,
            "why": "**なくします** (nakushimasu) = làm mất, đánh mất — nhóm 1 — なくさないでください"
          },
          {
            "q": "Tiếng Nhật của \"vào, đi vào\" là từ nào?",
            "options": [
              "{入|はい}ります (hairimasu)",
              "なくします (nakushimasu)",
              "パンフレット (panfuretto)",
              "{手|て} (te)"
            ],
            "correct": 0,
            "why": "**{入|はい}ります** (hairimasu) = vào, đi vào — nhóm 1 (đội lốt nhóm 2) — 入らない; nơi + に"
          },
          {
            "q": "Tiếng Nhật của \"mang về\" là từ nào?",
            "options": [
              "{皆|みな}さん (minasan)",
              "{遅|おく}れます (okuremasu)",
              "{持|も}って{帰|かえ}ります (motte kaerimasu)",
              "{迷惑|めいわく}（な） (meiwaku (na))"
            ],
            "correct": 2,
            "why": "**{持|も}って{帰|かえ}ります** (motte kaerimasu) = mang về — nhóm 1 — ごみを持って帰ります"
          },
          {
            "q": "Tiếng Nhật của \"muộn, trễ\" là từ nào?",
            "options": [
              "{他|ほか} (hoka)",
              "{遅|おく}れます (okuremasu)",
              "{大切|たいせつ}（な） (taisetsu (na))",
              "{荷物|にもつ} (nimotsu)"
            ],
            "correct": 1,
            "why": "**{遅|おく}れます** (okuremasu) = muộn, trễ — nhóm 2 — 時間に遅れます"
          },
          {
            "q": "Tiếng Nhật của \"vứt, vứt bỏ\" là từ nào?",
            "options": [
              "{遅|おく}れます (okuremasu)",
              "{座|すわ}ります (suwarimasu)",
              "{捨|す}てます (sutemasu)",
              "カーテン (kaaten)"
            ],
            "correct": 2,
            "why": "**{捨|す}てます** (sutemasu) = vứt, vứt bỏ — nhóm 2 — ごみを捨てます"
          },
          {
            "q": "Tiếng Nhật của \"tập trung, tập hợp\" là từ nào?",
            "options": [
              "{荷物|にもつ} (nimotsu)",
              "（お）{土産|みやげ} ((o)miyage)",
              "{皆|みな}さん (minasan)",
              "{集合|しゅうごう}します (shuugou shimasu)"
            ],
            "correct": 3,
            "why": "**{集合|しゅうごう}します** (shuugou shimasu) = tập trung, tập hợp — nhóm 3 — 集合時間 = giờ tập hợp"
          },
          {
            "q": "Tiếng Nhật của \"nguy hiểm\" là từ nào?",
            "options": [
              "{他|ほか} (hoka)",
              "（お）{客|きゃく}（さん） ((o)kyaku(san))",
              "{危|あぶ}ない (abunai)",
              "{荷物|にもつ} (nimotsu)"
            ],
            "correct": 2,
            "why": "**{危|あぶ}ない** (abunai) = nguy hiểm — tính từ い"
          },
          {
            "q": "Tiếng Nhật của \"quan trọng, quý giá\" là từ nào?",
            "options": [
              "{遅|おく}れます (okuremasu)",
              "なくします (nakushimasu)",
              "{立|た}ちます (tachimasu)",
              "{大切|たいせつ}（な） (taisetsu (na))"
            ],
            "correct": 3,
            "why": "**{大切|たいせつ}（な）** (taisetsu (na)) = quan trọng, quý giá — tính từ な — 大切な写真"
          },
          {
            "q": "Tiếng Nhật của \"phiền phức, gây phiền\" là từ nào?",
            "options": [
              "{座|すわ}ります (suwarimasu)",
              "{持|も}って{帰|かえ}ります (motte kaerimasu)",
              "{皆|みな}さん (minasan)",
              "{迷惑|めいわく}（な） (meiwaku (na))"
            ],
            "correct": 3,
            "why": "**{迷惑|めいわく}（な）** (meiwaku (na)) = phiền phức, gây phiền — tính từ な — 他の人に迷惑です"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-vj3",
        "title": "Việt → Nhật — nhóm E–G: sở thú · cơ thể & cảm giác · động từ (chủ đề 動物園で) (28 câu)",
        "items": [
          {
            "q": "Tiếng Nhật của \"vườn bách thú, sở thú\" là từ nào?",
            "options": [
              "{動物園|どうぶつえん} (doubutsuen)",
              "{入|い}り{口|ぐち} (iriguchi)",
              "{観覧車|かんらんしゃ} (kanransha)",
              "なります (narimasu)"
            ],
            "correct": 0,
            "why": "**{動物園|どうぶつえん}** (doubutsuen) = vườn bách thú, sở thú"
          },
          {
            "q": "Tiếng Nhật của \"con gấu\" là từ nào?",
            "options": [
              "クマ (kuma)",
              "{出口|でぐち} (deguchi)",
              "おなか (onaka)",
              "～たち (~tachi)"
            ],
            "correct": 0,
            "why": "**クマ** (kuma) = con gấu"
          },
          {
            "q": "Tiếng Nhật của \"gấu koala\" là từ nào?",
            "options": [
              "パンダ (panda)",
              "ボール (booru)",
              "～たち (~tachi)",
              "コアラ (koara)"
            ],
            "correct": 3,
            "why": "**コアラ** (koara) = gấu koala"
          },
          {
            "q": "Tiếng Nhật của \"con khỉ\" là từ nào?",
            "options": [
              "{入|い}り{口|ぐち} (iriguchi)",
              "ゾウ (zou)",
              "{疲|つか}れます (tsukaremasu)",
              "サル (saru)"
            ],
            "correct": 3,
            "why": "**サル** (saru) = con khỉ"
          },
          {
            "q": "Tiếng Nhật của \"con voi\" là từ nào?",
            "options": [
              "サル (saru)",
              "{疲|つか}れます (tsukaremasu)",
              "ゾウ (zou)",
              "{出口|でぐち} (deguchi)"
            ],
            "correct": 2,
            "why": "**ゾウ** (zou) = con voi"
          },
          {
            "q": "Tiếng Nhật của \"con chim\" là từ nào?",
            "options": [
              "のどがかわきます (nodo ga kawakimasu)",
              "おなか (onaka)",
              "やります (yarimasu)",
              "{鳥|とり} (tori)"
            ],
            "correct": 3,
            "why": "**{鳥|とり}** (tori) = con chim"
          },
          {
            "q": "Tiếng Nhật của \"gấu trúc\" là từ nào?",
            "options": [
              "{痛|いた}い (itai)",
              "{歩|ある}きます (arukimasu)",
              "パンダ (panda)",
              "{出口|でぐち} (deguchi)"
            ],
            "correct": 2,
            "why": "**パンダ** (panda) = gấu trúc"
          },
          {
            "q": "Tiếng Nhật của \"chim cánh cụt\" là từ nào?",
            "options": [
              "おなかがすきます (onaka ga sukimasu)",
              "ペンギン (pengin)",
              "{観覧車|かんらんしゃ} (kanransha)",
              "パンダ (panda)"
            ],
            "correct": 1,
            "why": "**ペンギン** (pengin) = chim cánh cụt"
          },
          {
            "q": "Tiếng Nhật của \"lối vào, cửa vào\" là từ nào?",
            "options": [
              "コアラ (koara)",
              "やります (yarimasu)",
              "パンダ (panda)",
              "{入|い}り{口|ぐち} (iriguchi)"
            ],
            "correct": 3,
            "why": "**{入|い}り{口|ぐち}** (iriguchi) = lối vào, cửa vào — 入 ở đây đọc い (không phải はい)"
          },
          {
            "q": "Tiếng Nhật của \"lối ra, cửa ra\" là từ nào?",
            "options": [
              "{出口|でぐち} (deguchi)",
              "{暗|くら}い (kurai)",
              "ペンギン (pengin)",
              "バナナ (banana)"
            ],
            "correct": 0,
            "why": "**{出口|でぐち}** (deguchi) = lối ra, cửa ra"
          },
          {
            "q": "Tiếng Nhật của \"thức ăn cho động vật, mồi\" là từ nào?",
            "options": [
              "{入|い}り{口|ぐち} (iriguchi)",
              "{本当|ほんとう}だ (hontou da)",
              "えさ (esa)",
              "{動物園|どうぶつえん} (doubutsuen)"
            ],
            "correct": 2,
            "why": "**えさ** (esa) = thức ăn cho động vật, mồi — えさをやります = cho (thú) ăn"
          },
          {
            "q": "Tiếng Nhật của \"vòng đu quay\" là từ nào?",
            "options": [
              "{動物園|どうぶつえん} (doubutsuen)",
              "{観覧車|かんらんしゃ} (kanransha)",
              "ボール (booru)",
              "{痛|いた}い (itai)"
            ],
            "correct": 1,
            "why": "**{観覧車|かんらんしゃ}** (kanransha) = vòng đu quay"
          },
          {
            "q": "Tiếng Nhật của \"quả chuối\" là từ nào?",
            "options": [
              "{出口|でぐち} (deguchi)",
              "バナナ (banana)",
              "{入|い}り{口|ぐち} (iriguchi)",
              "ペンギン (pengin)"
            ],
            "correct": 1,
            "why": "**バナナ** (banana) = quả chuối"
          },
          {
            "q": "Tiếng Nhật của \"quả bóng\" là từ nào?",
            "options": [
              "なります (narimasu)",
              "ボール (booru)",
              "そろそろ (sorosoro)",
              "{休|やす}みます (yasumimasu)"
            ],
            "correct": 1,
            "why": "**ボール** (booru) = quả bóng"
          },
          {
            "q": "Tiếng Nhật của \"các ~, bọn ~ (số nhiều)\" là từ nào?",
            "options": [
              "ゾウ (zou)",
              "やります (yarimasu)",
              "{本当|ほんとう}だ (hontou da)",
              "～たち (~tachi)"
            ],
            "correct": 3,
            "why": "**～たち** (~tachi) = các ~, bọn ~ (số nhiều) — 私たち, 子どもたち"
          },
          {
            "q": "Tiếng Nhật của \"bụng\" là từ nào?",
            "options": [
              "おなか (onaka)",
              "{疲|つか}れます (tsukaremasu)",
              "{観覧車|かんらんしゃ} (kanransha)",
              "ゾウ (zou)"
            ],
            "correct": 0,
            "why": "**おなか** (onaka) = bụng"
          },
          {
            "q": "Tiếng Nhật của \"đói bụng\" là từ nào?",
            "options": [
              "{入|い}り{口|ぐち} (iriguchi)",
              "{暗|くら}い (kurai)",
              "おなかがすきます (onaka ga sukimasu)",
              "{飛|と}びます (tobimasu)"
            ],
            "correct": 2,
            "why": "**おなかがすきます** (onaka ga sukimasu) = đói bụng — thường nói おなかがすきました = đói rồi"
          },
          {
            "q": "Tiếng Nhật của \"khát nước\" là từ nào?",
            "options": [
              "そろそろ (sorosoro)",
              "のどがかわきます (nodo ga kawakimasu)",
              "{飛|と}びます (tobimasu)",
              "サル (saru)"
            ],
            "correct": 1,
            "why": "**のどがかわきます** (nodo ga kawakimasu) = khát nước — のどがかわきました = khát rồi"
          },
          {
            "q": "Tiếng Nhật của \"mệt\" là từ nào?",
            "options": [
              "サル (saru)",
              "のどがかわきます (nodo ga kawakimasu)",
              "{疲|つか}れます (tsukaremasu)",
              "{歩|ある}きます (arukimasu)"
            ],
            "correct": 2,
            "why": "**{疲|つか}れます** (tsukaremasu) = mệt — nhóm 2 — 疲れました = mệt rồi"
          },
          {
            "q": "Tiếng Nhật của \"đau\" là từ nào?",
            "options": [
              "{休|やす}みます (yasumimasu)",
              "{痛|いた}い (itai)",
              "バナナ (banana)",
              "{入|い}り{口|ぐち} (iriguchi)"
            ],
            "correct": 1,
            "why": "**{痛|いた}い** (itai) = đau — bộ phận + が痛いです"
          },
          {
            "q": "Tiếng Nhật của \"tối\" là từ nào?",
            "options": [
              "コアラ (koara)",
              "パンダ (panda)",
              "{暗|くら}い (kurai)",
              "{動物園|どうぶつえん} (doubutsuen)"
            ],
            "correct": 2,
            "why": "**{暗|くら}い** (kurai) = tối — ↔ 明るい (sáng)"
          },
          {
            "q": "Tiếng Nhật của \"đi bộ\" là từ nào?",
            "options": [
              "ボール (booru)",
              "～たち (~tachi)",
              "{暗|くら}い (kurai)",
              "{歩|ある}きます (arukimasu)"
            ],
            "correct": 3,
            "why": "**{歩|ある}きます** (arukimasu) = đi bộ — nhóm 1 — 歩いて10分 = đi bộ 10 phút"
          },
          {
            "q": "Tiếng Nhật của \"bay\" là từ nào?",
            "options": [
              "{痛|いた}い (itai)",
              "{疲|つか}れます (tsukaremasu)",
              "{飛|と}びます (tobimasu)",
              "そろそろ (sorosoro)"
            ],
            "correct": 2,
            "why": "**{飛|と}びます** (tobimasu) = bay — nhóm 1 — 飛んで → 飛ばない"
          },
          {
            "q": "Tiếng Nhật của \"trở nên, trở thành\" là từ nào?",
            "options": [
              "クマ (kuma)",
              "バナナ (banana)",
              "やります (yarimasu)",
              "なります (narimasu)"
            ],
            "correct": 3,
            "why": "**なります** (narimasu) = trở nên, trở thành — nhóm 1 — 寒くなります, 12時になります"
          },
          {
            "q": "Tiếng Nhật của \"nghỉ, nghỉ ngơi\" là từ nào?",
            "options": [
              "ペンギン (pengin)",
              "そろそろ (sorosoro)",
              "おなかがすきます (onaka ga sukimasu)",
              "{休|やす}みます (yasumimasu)"
            ],
            "correct": 3,
            "why": "**{休|やす}みます** (yasumimasu) = nghỉ, nghỉ ngơi — ベンチで休みましょう"
          },
          {
            "q": "Tiếng Nhật của \"cho (thú ăn); làm\" là từ nào?",
            "options": [
              "サル (saru)",
              "やります (yarimasu)",
              "{入|い}り{口|ぐち} (iriguchi)",
              "バナナ (banana)"
            ],
            "correct": 1,
            "why": "**やります** (yarimasu) = cho (thú ăn); làm — nhóm 1 — えさをやります"
          },
          {
            "q": "Tiếng Nhật của \"sắp đến lúc, sắp sửa\" là từ nào?",
            "options": [
              "{入|い}り{口|ぐち} (iriguchi)",
              "そろそろ (sorosoro)",
              "{観覧車|かんらんしゃ} (kanransha)",
              "なります (narimasu)"
            ],
            "correct": 1,
            "why": "**そろそろ** (sorosoro) = sắp đến lúc, sắp sửa"
          },
          {
            "q": "Tiếng Nhật của \"Đúng thật! Thật này!\" là từ nào?",
            "options": [
              "ペンギン (pengin)",
              "～たち (~tachi)",
              "{出口|でぐち} (deguchi)",
              "{本当|ほんとう}だ (hontou da)"
            ],
            "correct": 3,
            "why": "**{本当|ほんとう}だ** (hontou da) = Đúng thật! Thật này! — thể thường, nói với bạn bè"
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · khác loại · điền từ vào câu · gõ từ"
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-khac-loai",
        "title": "Từ nào KHÁC loại? (11 câu)",
        "items": [
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (chỉ đường)",
            "options": [
              "{交差点|こうさてん} (Kousaten)",
              "{角|かど} (Kado)",
              "{信号|しんごう} (Shingou)",
              "{薬|くすり} (Kusuri)"
            ],
            "correct": 3,
            "why": "Ba từ kia là chỗ trên đường (dùng khi chỉ đường); **薬** là thuốc."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (con vật)",
            "options": [
              "ペンギン (Pengin)",
              "ゾウ (Zou)",
              "クマ (Kuma)",
              "{観覧車|かんらんしゃ} (Kanransha)"
            ],
            "correct": 3,
            "why": "Ba từ kia là con vật; **観覧車** là vòng đu quay."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (đồ vật/ thứ mang theo)",
            "options": [
              "お{土産|みやげ} (Omiyage)",
              "サル (Saru)",
              "パンフレット (Panfuretto)",
              "{荷物|にもつ} (Nimotsu)"
            ],
            "correct": 1,
            "why": "Ba từ kia là đồ vật; **サル** là con khỉ."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (động từ NHÓM 2)",
            "options": [
              "{遅|おく}れます (Okuremasu)",
              "{渡|わた}ります (Watarimasu)",
              "{見|み}えます (Miemasu)",
              "{捨|す}てます (Sutemasu)"
            ],
            "correct": 1,
            "why": "Ba từ kia nhóm 2 (見える, 遅れる, 捨てる); **渡ります** là nhóm 1 (渡る)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (động từ NHÓM 1)",
            "options": [
              "{座|すわ}ります (Suwarimasu)",
              "{曲|ま}がります (Magarimasu)",
              "{入|はい}ります (Hairimasu)",
              "{疲|つか}れます (Tsukaremasu)"
            ],
            "correct": 3,
            "why": "Ba từ kia nhóm 1 (曲がる, 座る, 入る); **疲れます** là nhóm 2 (疲れる)."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (tính từ)",
            "options": [
              "{歩|ある}きます (Arukimasu)",
              "{危|あぶ}ない (Abunai)",
              "{痛|いた}い (Itai)",
              "{暗|くら}い (Kurai)"
            ],
            "correct": 0,
            "why": "Ba từ kia là tính từ đuôi い; **歩きます** là động từ."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (nghe / nhìn)",
            "options": [
              "{見|み}えます (Miemasu)",
              "{探|さが}します (Sagashimasu)",
              "{声|こえ} (Koe)",
              "{聞|き}こえます (Kikoemasu)"
            ],
            "correct": 1,
            "why": "Ba từ kia liên quan đến nghe/nhìn; **探します** là tìm."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (cảm giác cơ thể)",
            "options": [
              "おなかがすきます (Onaka ga sukimasu)",
              "{疲|つか}れます (Tsukaremasu)",
              "のどがかわきます (Nodo ga kawakimasu)",
              "{交差点|こうさてん} (Kousaten)"
            ],
            "correct": 3,
            "why": "Ba từ kia là cảm giác cơ thể (mệt, đói, khát); **交差点** là ngã tư."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (chỗ trong sở thú)",
            "options": [
              "{薬|くすり} (Kusuri)",
              "{入|い}り{口|ぐち} (Iriguchi)",
              "{観覧車|かんらんしゃ} (Kanransha)",
              "{出口|でぐち} (Deguchi)"
            ],
            "correct": 0,
            "why": "Ba từ kia là chỗ ở sở thú/công viên; **薬** là thuốc."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (phó từ / câu nói)",
            "options": [
              "ボール (Booru)",
              "そろそろ (Sorosoro)",
              "ちょっと (Chotto)",
              "まっすぐ (Massugu)"
            ],
            "correct": 0,
            "why": "Ba từ kia là phó từ; **ボール** là quả bóng."
          },
          {
            "q": "Từ nào KHÁC loại với ba từ còn lại? (việc bị cấm ở nơi công cộng)",
            "options": [
              "なくします (Nakushimasu)",
              "{押|お}します (Oshimasu)",
              "{休|やす}みます (Yasumimasu)",
              "{捨|す}てます (Sutemasu)"
            ],
            "correct": 2,
            "why": "Ba từ kia hay xuất hiện trong 〜ないでください (đẩy, vứt, làm mất); **休みます** là nghỉ ngơi — việc nên làm."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-dien-cau",
        "title": "Điền từ vào câu — có nghĩa tiếng Việt kèm theo (34 câu)",
        "items": [
          {
            "q": "あの{信号|しんごう}を＿＿に{曲|ま}がってください。　〔Ano shingou o __ ni magatte kudasai.〕　— Đến đèn giao thông kia thì rẽ phải.",
            "options": [
              "{角|かど}",
              "{橋|はし}",
              "{右|みぎ}",
              "{道|みち}"
            ],
            "correct": 2,
            "why": "Hướng rẽ: 右に／左に 曲がります. → **あの{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。** 〔Ano shingou o migi ni magatte kudasai.〕 — Đến đèn giao thông kia thì rẽ phải."
          },
          {
            "q": "{二|ふた}つ{目|め}の＿＿を{左|ひだり}に{曲|ま}がります。　〔Futatsume no __ o hidari ni magarimasu.〕　— Rẽ trái ở ngã tư thứ hai.",
            "options": [
              "{交差点|こうさてん}",
              "{薬|くすり}",
              "{声|こえ}",
              "ごみ"
            ],
            "correct": 0,
            "why": "Chỗ rẽ: ngã tư (交差点). → **{二|ふた}つ{目|め}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がります。** 〔Futatsume no kousaten o hidari ni magarimasu.〕 — Rẽ trái ở ngã tư thứ hai."
          },
          {
            "q": "この{道|みち}を＿＿{行|い}ってください。　〔Kono michi o __ itte kudasai.〕　— Hãy đi thẳng con đường này.",
            "options": [
              "ちょっと",
              "そろそろ",
              "ええと",
              "まっすぐ"
            ],
            "correct": 3,
            "why": "Đi thẳng = まっすぐ 行きます. → **この{道|みち}をまっすぐ{行|い}ってください。** 〔Kono michi o massugu itte kudasai.〕 — Hãy đi thẳng con đường này."
          },
          {
            "q": "{大|おお}きい{橋|はし}を＿＿、{右|みぎ}に{曲|ま}がってください。　〔Ookii hashi o __, migi ni magatte kudasai.〕　— Qua cây cầu lớn rồi rẽ phải.",
            "options": [
              "{曲|ま}がって",
              "{渡|わた}って",
              "{座|すわ}って",
              "{探|さが}して"
            ],
            "correct": 1,
            "why": "Qua cầu = 橋を 渡ります. → **{大|おお}きい{橋|はし}を{渡|わた}って、{右|みぎ}に{曲|ま}がってください。** 〔Ookii hashi o watatte, migi ni magatte kudasai.〕 — Qua cây cầu lớn rồi rẽ phải."
          },
          {
            "q": "コンビニの＿＿を{右|みぎ}に{曲|ま}がります。　〔Konbini no __ o migi ni magarimasu.〕　— Rẽ phải ở góc cửa hàng tiện lợi.",
            "options": [
              "{音|おと}",
              "{信号|しんごう}",
              "{角|かど}",
              "{手|て}"
            ],
            "correct": 2,
            "why": "Góc của tiệm = コンビニの 角. → **コンビニの{角|かど}を{右|みぎ}に{曲|ま}がります。** 〔Konbini no kado o migi ni magarimasu.〕 — Rẽ phải ở góc cửa hàng tiện lợi."
          },
          {
            "q": "すみません、よく＿＿。もう{一度|いちど}お{願|ねが}いします。　〔Sumimasen, yoku __. Mou ichido onegaishimasu.〕　— Xin lỗi, tôi nghe không rõ. Nhờ bạn nói lại lần nữa.",
            "options": [
              "{聞|き}きません",
              "{見|み}ません",
              "{飲|の}みません",
              "{聞|き}こえません"
            ],
            "correct": 3,
            "why": "Điện thoại rè: よく 聞こえません (nghe không rõ). → **すみません、よく{聞|き}こえません。もう{一度|いちど}お{願|ねが}いします。** 〔Sumimasen, yoku kikoemasen. Mou ichido onegaishimasu.〕 — Xin lỗi, tôi nghe không rõ. Nhờ bạn nói lại lần nữa."
          },
          {
            "q": "ここから{高|たか}いビルが＿＿。　〔Koko kara takai biru ga __.〕　— Từ đây nhìn thấy toà nhà cao.",
            "options": [
              "{見|み}ます",
              "{見|み}えます",
              "{聞|き}こえます",
              "{探|さが}します"
            ],
            "correct": 1,
            "why": "Tự hiện ra trong mắt: が 見えます. → **ここから{高|たか}いビルが{見|み}えます。** 〔Koko kara takai biru ga miemasu.〕 — Từ đây nhìn thấy toà nhà cao."
          },
          {
            "q": "{鳥|とり}の＿＿が{聞|き}こえます。　〔Tori no __ ga kikoemasu.〕　— Nghe thấy tiếng chim.",
            "options": [
              "{道|みち}",
              "{声|こえ}",
              "{手|て}",
              "{音|おと}"
            ],
            "correct": 1,
            "why": "Tiếng của con vật/người = 声. → **{鳥|とり}の{声|こえ}が{聞|き}こえます。** 〔Tori no koe ga kikoemasu.〕 — Nghe thấy tiếng chim."
          },
          {
            "q": "{車|くるま}の＿＿がうるさいです。　〔Kuruma no __ ga urusai desu.〕　— Tiếng xe ồn quá.",
            "options": [
              "{音|おと}",
              "{薬|くすり}",
              "えさ",
              "{声|こえ}"
            ],
            "correct": 0,
            "why": "Tiếng của đồ vật (xe) = 音. → **{車|くるま}の{音|おと}がうるさいです。** 〔Kuruma no oto ga urusai desu.〕 — Tiếng xe ồn quá."
          },
          {
            "q": "バスに{乗|の}ります。＿＿を{飲|の}んでください。　〔Basu ni norimasu. __ o nonde kudasai.〕　— Sắp lên xe buýt rồi. Hãy uống thuốc.",
            "options": [
              "{荷物|にもつ}",
              "{薬|くすり}",
              "ごみ",
              "えさ"
            ],
            "correct": 1,
            "why": "Uống thuốc = 薬を 飲みます. → **バスに{乗|の}ります。{薬|くすり}を{飲|の}んでください。** 〔Basu ni norimasu. Kusuri o nonde kudasai.〕 — Sắp lên xe buýt rồi. Hãy uống thuốc."
          },
          {
            "q": "ワンさんがいません。ちょっと＿＿きます。　〔Wan-san ga imasen. Chotto __ kimasu.〕　— Wang không có ở đây. Tôi đi tìm một chút rồi quay lại.",
            "options": [
              "{渡|わた}って",
              "{捨|す}てて",
              "{探|さが}して",
              "{押|お}して"
            ],
            "correct": 2,
            "why": "Đi tìm rồi quay lại = 探して きます. → **ワンさんがいません。ちょっと{探|さが}してきます。** 〔Wan-san ga imasen. Chotto sagashite kimasu.〕 — Wang không có ở đây. Tôi đi tìm một chút rồi quay lại."
          },
          {
            "q": "ここにごみを＿＿ください。　〔Koko ni gomi o __ kudasai.〕　— Xin đừng vứt rác ở đây.",
            "options": [
              "{捨|す}てないで",
              "{捨|す}てない",
              "{捨|す}てません",
              "{捨|す}てても"
            ],
            "correct": 0,
            "why": "Xin đừng = Vない で ください. → **ここにごみを{捨|す}てないでください。** 〔Koko ni gomi o sutenaide kudasai.〕 — Xin đừng vứt rác ở đây."
          },
          {
            "q": "{危|あぶ}ないですから、{前|まえ}の{人|ひと}を＿＿ください。　〔Abunai desu kara, mae no hito o __ kudasai.〕　— Nguy hiểm nên đừng đẩy người phía trước.",
            "options": [
              "{押|お}さないで",
              "{押|お}さなくて",
              "{押|お}しないで",
              "{押|お}しません"
            ],
            "correct": 0,
            "why": "押します (nhóm 1) → 押さない + で. → **{危|あぶ}ないですから、{前|まえ}の{人|ひと}を{押|お}さないでください。** 〔Abunai desu kara, mae no hito o osanaide kudasai.〕 — Nguy hiểm nên đừng đẩy người phía trước."
          },
          {
            "q": "{隣|となり}に＿＿もいいですか。　〔Tonari ni __ mo ii desu ka.〕　— Tôi ngồi cạnh bạn được không?",
            "options": [
              "{遅|おく}れて",
              "{入|はい}って",
              "{立|た}って",
              "{座|すわ}って"
            ],
            "correct": 3,
            "why": "Xin phép ngồi = 座っても いいですか. → **{隣|となり}に{座|すわ}ってもいいですか。** 〔Tonari ni suwatte mo ii desu ka.〕 — Tôi ngồi cạnh bạn được không?"
          },
          {
            "q": "{皆|みな}さん、{八時|はちじ}に{駅|えき}の{前|まえ}に＿＿ください。　〔Minasan, hachiji ni eki no mae ni __ kudasai.〕　— Mọi người hãy tập hợp trước ga lúc 8 giờ.",
            "options": [
              "{捨|す}てて",
              "{遅|おく}れて",
              "{集合|しゅうごう}して",
              "なくして"
            ],
            "correct": 2,
            "why": "Tập hợp = 集合します. → **{皆|みな}さん、{八時|はちじ}に{駅|えき}の{前|まえ}に{集合|しゅうごう}してください。** 〔Minasan, hachiji ni eki no mae ni shuugou shite kudasai.〕 — Mọi người hãy tập hợp trước ga lúc 8 giờ."
          },
          {
            "q": "{集合|しゅうごう}{時間|じかん}に＿＿ください。　〔Shuugou jikan ni __ kudasai.〕　— Xin đừng trễ giờ tập hợp.",
            "options": [
              "{遅|おく}れて",
              "{遅|おく}れないで",
              "{入|はい}らないで",
              "{座|すわ}らないで"
            ],
            "correct": 1,
            "why": "Trễ giờ = 時間に 遅れます → đừng trễ. → **{集合|しゅうごう}{時間|じかん}に{遅|おく}れないでください。** 〔Shuugou jikan ni okurenaide kudasai.〕 — Xin đừng trễ giờ tập hợp."
          },
          {
            "q": "このチケットは＿＿ですから、なくさないでください。　〔Kono chiketto wa __ desu kara, nakusanaide kudasai.〕　— Vé này quan trọng nên đừng làm mất.",
            "options": [
              "{暗|くら}い",
              "{迷惑|めいわく}",
              "{大切|たいせつ}",
              "{危|あぶ}ない"
            ],
            "correct": 2,
            "why": "大切 = quan trọng. → **このチケットは{大切|たいせつ}ですから、なくさないでください。** 〔Kono chiketto wa taisetsu desu kara, nakusanaide kudasai.〕 — Vé này quan trọng nên đừng làm mất."
          },
          {
            "q": "{大|おお}きい{声|こえ}で{話|はな}さないでください。{他|ほか}の{人|ひと}に＿＿です。　〔Ookii koe de hanasanaide kudasai. Hoka no hito ni __ desu.〕　— Đừng nói to. Làm phiền người khác.",
            "options": [
              "まっすぐ",
              "{迷惑|めいわく}",
              "{本当|ほんとう}",
              "{大切|たいせつ}"
            ],
            "correct": 1,
            "why": "Gây phiền cho người khác = 他の人に 迷惑です. → **{大|おお}きい{声|こえ}で{話|はな}さないでください。{他|ほか}の{人|ひと}に{迷惑|めいわく}です。** 〔Ookii koe de hanasanaide kudasai. Hoka no hito ni meiwaku desu.〕 — Đừng nói to. Làm phiền người khác."
          },
          {
            "q": "ごみはうちへ＿＿ください。　〔Gomi wa uchi e __ kudasai.〕　— Rác thì hãy mang về nhà.",
            "options": [
              "{押|お}して",
              "{持|も}って{帰|かえ}って",
              "{探|さが}して",
              "{捨|す}てて"
            ],
            "correct": 1,
            "why": "Mang về = 持って帰ります. → **ごみはうちへ{持|も}って{帰|かえ}ってください。** 〔Gomi wa uchi e motte kaette kudasai.〕 — Rác thì hãy mang về nhà."
          },
          {
            "q": "{家族|かぞく}にお＿＿を{買|か}いました。　〔Kazoku ni o__ o kaimashita.〕　— Tôi đã mua quà lưu niệm cho gia đình.",
            "options": [
              "{荷物|にもつ}",
              "{土産|みやげ}",
              "{客|きゃく}",
              "{他|ほか}"
            ],
            "correct": 1,
            "why": "Quà khi đi xa = お土産. → **{家族|かぞく}にお{土産|みやげ}を{買|か}いました。** 〔Kazoku ni omiyage o kaimashita.〕 — Tôi đã mua quà lưu niệm cho gia đình."
          },
          {
            "q": "{受付|うけつけ}で＿＿をもらいました。{地図|ちず}があります。　〔Uketsuke de __ o moraimashita. Chizu ga arimasu.〕　— Tôi nhận tờ giới thiệu ở quầy. Có bản đồ trong đó.",
            "options": [
              "ボール",
              "バナナ",
              "パンフレット",
              "カーテン"
            ],
            "correct": 2,
            "why": "Tờ giới thiệu có bản đồ = パンフレット. → **{受付|うけつけ}でパンフレットをもらいました。{地図|ちず}があります。** 〔Uketsuke de panfuretto o moraimashita. Chizu ga arimasu.〕 — Tôi nhận tờ giới thiệu ở quầy. Có bản đồ trong đó."
          },
          {
            "q": "{窓|まど}の＿＿を{閉|し}めてもいいですか。　〔Mado no __ o shimete mo ii desu ka.〕　— Tôi kéo rèm cửa sổ lại được không?",
            "options": [
              "パンフレット",
              "ボール",
              "えさ",
              "カーテン"
            ],
            "correct": 3,
            "why": "Rèm cửa sổ = 窓の カーテン. → **{窓|まど}のカーテンを{閉|し}めてもいいですか。** 〔Mado no kaaten o shimete mo ii desu ka.〕 — Tôi kéo rèm cửa sổ lại được không?"
          },
          {
            "q": "あっ、サルが＿＿を{食|た}べています。　〔A, saru ga __ o tabete imasu.〕　— A, con khỉ đang ăn chuối.",
            "options": [
              "カーテン",
              "パンフレット",
              "バナナ",
              "ボール"
            ],
            "correct": 2,
            "why": "Khỉ ăn chuối = バナナ. → **あっ、サルがバナナを{食|た}べています。** 〔A, saru ga banana o tabete imasu.〕 — A, con khỉ đang ăn chuối."
          },
          {
            "q": "{動物|どうぶつ}に＿＿をやらないでください。　〔Doubutsu ni __ o yaranaide kudasai.〕　— Đừng cho thú ăn.",
            "options": [
              "えさ",
              "{薬|くすり}",
              "お{土産|みやげ}",
              "ごみ"
            ],
            "correct": 0,
            "why": "Cho thú ăn = えさを やります. → **{動物|どうぶつ}にえさをやらないでください。** 〔Doubutsu ni esa o yaranaide kudasai.〕 — Đừng cho thú ăn."
          },
          {
            "q": "{鳥|とり}が{空|そら}を＿＿います。　〔Tori ga sora o __ imasu.〕　— Con chim đang bay trên trời.",
            "options": [
              "{歩|ある}いて",
              "{飛|と}んで",
              "{座|すわ}って",
              "{泳|およ}いで"
            ],
            "correct": 1,
            "why": "Chim bay = 飛びます → 飛んで います. → **{鳥|とり}が{空|そら}を{飛|と}んでいます。** 〔Tori ga sora o tonde imasu.〕 — Con chim đang bay trên trời."
          },
          {
            "q": "たくさん{歩|ある}きましたから、＿＿。　〔Takusan arukimashita kara, __.〕　— Đi bộ nhiều nên mệt rồi.",
            "options": [
              "{疲|つか}れました",
              "{見|み}えました",
              "{遅|おく}れました",
              "なくしました"
            ],
            "correct": 0,
            "why": "Đi nhiều → mệt = 疲れました. → **たくさん{歩|ある}きましたから、{疲|つか}れました。** 〔Takusan arukimashita kara, tsukaremashita.〕 — Đi bộ nhiều nên mệt rồi."
          },
          {
            "q": "おなかが＿＿。{何|なに}か{食|た}べませんか。　〔Onaka ga __. Nanika tabemasen ka.〕　— Đói bụng rồi. Ăn gì đó không?",
            "options": [
              "かわきました",
              "なりました",
              "すきました",
              "{痛|いた}いました"
            ],
            "correct": 2,
            "why": "Đói = おなかが すきました. → **おなかがすきました。{何|なに}か{食|た}べませんか。** 〔Onaka ga sukimashita. Nanika tabemasen ka.〕 — Đói bụng rồi. Ăn gì đó không?"
          },
          {
            "q": "のどが＿＿。ジュースを{買|か}ってきます。　〔Nodo ga __. Juusu o katte kimasu.〕　— Khát rồi. Tôi đi mua nước ép rồi về.",
            "options": [
              "{疲|つか}れました",
              "すきました",
              "かわきました",
              "{休|やす}みました"
            ],
            "correct": 2,
            "why": "Khát = のどが かわきました. → **のどがかわきました。ジュースを{買|か}ってきます。** 〔Nodo ga kawakimashita. Juusu o katte kimasu.〕 — Khát rồi. Tôi đi mua nước ép rồi về."
          },
          {
            "q": "{足|あし}が＿＿です。あそこで{休|やす}みましょう。　〔Ashi ga __ desu. Asoko de yasumimashou.〕　— Chân tôi đau. Nghỉ ở đằng kia đi.",
            "options": [
              "{危|あぶ}ない",
              "{痛|いた}い",
              "{暗|くら}い",
              "{大切|たいせつ}"
            ],
            "correct": 1,
            "why": "Đau chân = 足が 痛いです. → **{足|あし}が{痛|いた}いです。あそこで{休|やす}みましょう。** 〔Ashi ga itai desu. Asoko de yasumimashou.〕 — Chân tôi đau. Nghỉ ở đằng kia đi."
          },
          {
            "q": "{暗|くら}くなりましたね。＿＿{帰|かえ}りましょう。　〔Kuraku narimashita ne. __ kaerimashou.〕　— Trời tối rồi nhỉ. Sắp về thôi.",
            "options": [
              "{他|ほか}",
              "そろそろ",
              "まっすぐ",
              "ええと"
            ],
            "correct": 1,
            "why": "Đã đến lúc = そろそろ. → **{暗|くら}くなりましたね。そろそろ{帰|かえ}りましょう。** 〔Kuraku narimashita ne. Sorosoro kaerimashou.〕 — Trời tối rồi nhỉ. Sắp về thôi."
          },
          {
            "q": "A：あっ、パンダが{寝|ね}ていますよ。B：あ、＿＿。　〔A: a, panda ga nete imasu yo. B: a, __.〕　— A: Ơ, gấu trúc đang ngủ kìa. B: À, thật này.",
            "options": [
              "ええと",
              "{本当|ほんとう}だ",
              "そろそろ",
              "まっすぐ"
            ],
            "correct": 1,
            "why": "Nhìn theo bạn chỉ và thấy đúng → 本当だ. → **A：あっ、パンダが{寝|ね}ていますよ。B：あ、{本当|ほんとう}だ。** 〔A: a, panda ga nete imasu yo. B: a, hontouda.〕 — A: Ơ, gấu trúc đang ngủ kìa. B: À, thật này."
          },
          {
            "q": "{子|こ}ども＿＿がゾウを{見|み}ています。　〔Kodomo__ ga zou o mite imasu.〕　— Bọn trẻ đang xem con voi.",
            "options": [
              "つ{目|め}",
              "たち",
              "さん",
              "{他|ほか}"
            ],
            "correct": 1,
            "why": "Số nhiều của người = ～たち. → **{子|こ}どもたちがゾウを{見|み}ています。** 〔Kodomotachi ga zou o mite imasu.〕 — Bọn trẻ đang xem con voi."
          },
          {
            "q": "{動物園|どうぶつえん}の＿＿で{地図|ちず}をもらいました。　〔Doubutsuen no __ de chizu o moraimashita.〕　— Tôi nhận bản đồ ở lối vào sở thú.",
            "options": [
              "えさ",
              "ボール",
              "{観覧車|かんらんしゃ}",
              "{入|い}り{口|ぐち}"
            ],
            "correct": 3,
            "why": "Lối vào = 入り口. → **{動物園|どうぶつえん}の{入|い}り{口|ぐち}で{地図|ちず}をもらいました。** 〔Doubutsuen no iriguchi de chizu o moraimashita.〕 — Tôi nhận bản đồ ở lối vào sở thú."
          },
          {
            "q": "＿＿から{海|うみ}が{見|み}えます。　〔__ kara umi ga miemasu.〕　— Từ vòng đu quay nhìn thấy biển.",
            "options": [
              "{観覧車|かんらんしゃ}",
              "{薬|くすり}",
              "ごみ",
              "{手|て}"
            ],
            "correct": 0,
            "why": "Từ vòng đu quay nhìn thấy biển. → **{観覧車|かんらんしゃ}から{海|うみ}が{見|み}えます。** 〔Kanransha kara umi ga miemasu.〕 — Từ vòng đu quay nhìn thấy biển."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-tv-go-tu",
        "title": "Gõ từ tiếng Nhật theo nghĩa (30 câu)",
        "kind": "translate",
        "items": [
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bên phải\"",
            "answers": [
              "右",
              "みぎ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"bên trái\"",
            "answers": [
              "左",
              "ひだり"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"ngã tư\"",
            "answers": [
              "交差点",
              "こうさてん"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đèn giao thông\"",
            "answers": [
              "信号",
              "しんごう"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"cây cầu\"",
            "answers": [
              "橋",
              "はし"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"con đường\"",
            "answers": [
              "道",
              "みち"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đi thẳng (phó từ \"thẳng\")\"",
            "answers": [
              "まっすぐ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"rẽ\"",
            "answers": [
              "曲がります",
              "まがります",
              "曲がる",
              "まがる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"băng qua (cầu)\"",
            "answers": [
              "渡ります",
              "わたります",
              "渡る",
              "わたる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tìm\"",
            "answers": [
              "探します",
              "さがします",
              "探す",
              "さがす"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"tiếng (người, con vật)\"",
            "answers": [
              "声",
              "こえ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"âm thanh (đồ vật)\"",
            "answers": [
              "音",
              "おと"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"thuốc\"",
            "answers": [
              "薬",
              "くすり"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"nhìn thấy (được)\"",
            "answers": [
              "見えます",
              "みえます",
              "見える",
              "みえる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"nghe thấy (được)\"",
            "answers": [
              "聞こえます",
              "きこえます",
              "聞こえる",
              "きこえる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"rác\"",
            "answers": [
              "ごみ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"hành lý\"",
            "answers": [
              "荷物",
              "にもつ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"quà lưu niệm\"",
            "answers": [
              "お土産",
              "おみやげ",
              "土産",
              "みやげ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"ngồi\"",
            "answers": [
              "座ります",
              "すわります",
              "座る",
              "すわる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đứng\"",
            "answers": [
              "立ちます",
              "たちます",
              "立つ",
              "たつ"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"vứt bỏ\"",
            "answers": [
              "捨てます",
              "すてます",
              "捨てる",
              "すてる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"muộn, trễ\"",
            "answers": [
              "遅れます",
              "おくれます",
              "遅れる",
              "おくれる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"nguy hiểm\"",
            "answers": [
              "危ない",
              "あぶない"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"quan trọng\"",
            "answers": [
              "大切",
              "たいせつ",
              "大切な",
              "たいせつな"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"sở thú\"",
            "answers": [
              "動物園",
              "どうぶつえん"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"con chim\"",
            "answers": [
              "鳥",
              "とり"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"lối ra\"",
            "answers": [
              "出口",
              "でぐち"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đi bộ\"",
            "answers": [
              "歩きます",
              "あるきます",
              "歩く",
              "あるく"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"mệt\"",
            "answers": [
              "疲れます",
              "つかれます",
              "疲れる",
              "つかれる"
            ],
            "hint": "Gõ hiragana/katakana cũng được."
          },
          {
            "q": "Gõ bằng tiếng Nhật (kana hoặc chữ Hán): \"đau\"",
            "answers": [
              "痛い",
              "いたい"
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
        "id": "lt-b10-tv-sai",
        "title": "Tìm câu SAI (9 câu)",
        "items": [
          {
            "q": "(見えます)　Câu nào SAI?",
            "options": [
              "ここから{海|うみ}が{見|み}えます。 (Koko kara umi ga miemasu.)",
              "ここから{橋|はし}が{見|み}えます。 (Koko kara hashi ga miemasu.)",
              "ここで{海|うみ}を{見|み}ます。 (Koko de umi o mimasu.)",
              "ここから{海|うみ}を{見|み}えます。 (Koko kara umi o miemasu.)"
            ],
            "correct": 3,
            "why": "見えます đi với **が** (cái tự hiện ra trước mắt); を chỉ dùng với 見ます."
          },
          {
            "q": "(聞こえます)　Câu nào SAI?",
            "options": [
              "{電車|でんしゃ}の{音|おと}が{聞|き}こえます。 (Densha no oto ga kikoemasu.)",
              "{鳥|とり}の{声|こえ}を{聞|き}こえます。 (Tori no koe o kikoemasu.)",
              "{音楽|おんがく}を{聞|き}きます。 (Ongaku o kikimasu.)",
              "{鳥|とり}の{声|こえ}が{聞|き}こえます。 (Tori no koe ga kikoemasu.)"
            ],
            "correct": 1,
            "why": "聞こえます đi với **が**."
          },
          {
            "q": "(音／声)　Câu nào SAI?",
            "options": [
              "{雨|あめ}の{音|おと}が{聞|き}こえます。 (Ame no oto ga kikoemasu.)",
              "{子|こ}どもの{声|こえ}が{聞|き}こえます。 (Kodomo no koe ga kikoemasu.)",
              "{車|くるま}の{声|こえ}が{聞|き}こえます。 (Kuruma no koe ga kikoemasu.)",
              "{車|くるま}の{音|おと}が{聞|き}こえます。 (Kuruma no oto ga kikoemasu.)"
            ],
            "correct": 2,
            "why": "Xe là đồ vật → **音**; 声 dùng cho người, con vật."
          },
          {
            "q": "(渡ります)　Câu nào SAI?",
            "options": [
              "{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。 (Kousaten o migi ni magatte kudasai.)",
              "{道|みち}を{渡|わた}ってください。 (Michi o watatte kudasai.)",
              "{橋|はし}を{渡|わた}ってください。 (Hashi o watatte kudasai.)",
              "{橋|はし}に{渡|わた}ってください。 (Hashi ni watatte kudasai.)"
            ],
            "correct": 3,
            "why": "Nơi đi qua → **を** (橋を 渡ります)."
          },
          {
            "q": "(入ります)　Câu nào SAI?",
            "options": [
              "{芝生|しばふ}に{入|はい}ないでください。 (Shibafu ni hainaide kudasai.)",
              "ここに{入|はい}ってもいいですか。 (Koko ni haitte mo ii desu ka.)",
              "{芝生|しばふ}に{入|はい}らないでください。 (Shibafu ni hairanaide kudasai.)",
              "{教室|きょうしつ}に{入|はい}ります。 (Kyoushitsu ni hairimasu.)"
            ],
            "correct": 0,
            "why": "入ります là **nhóm 1** → 入**らない**."
          },
          {
            "q": "(薬)　Câu nào SAI?",
            "options": [
              "{薬|くすり}を{飲|の}みます。 (Kusuri o nomimasu.)",
              "もう{薬|くすり}を{飲|の}みましたか。 (Mou kusuri o nomimashita ka.)",
              "{薬|くすり}を{食|た}べます。 (Kusuri o tabemasu.)",
              "{薬|くすり}を{買|か}ってきます。 (Kusuri o katte kimasu.)"
            ],
            "correct": 2,
            "why": "Tiếng Nhật cũng nói **薬を 飲みます** (uống thuốc)."
          },
          {
            "q": "(座ります)　Câu nào SAI?",
            "options": [
              "ここに{座|すわ}ってもいいですか。 (Koko ni suwatte mo ii desu ka.)",
              "ベンチに{座|すわ}って{休|やす}みます。 (Benchi ni suwatte yasumimasu.)",
              "いすを{座|すわ}ります。 (Isu o suwarimasu.)",
              "いすに{座|すわ}ります。 (Isu ni suwarimasu.)"
            ],
            "correct": 2,
            "why": "Chỗ ngồi → **に**: いすに 座ります."
          },
          {
            "q": "(大切／迷惑)　Câu nào SAI?",
            "options": [
              "{他|ほか}の{人|ひと}に{迷惑|めいわく}です。 (Hoka no hito ni meiwaku desu.)",
              "{迷惑|めいわく}な{人|ひと}ですね。 (Meiwaku na hito desu ne.)",
              "{大切|たいせつ}い{写真|しゃしん}です。 (Taisetsui shashin desu.)",
              "{大切|たいせつ}な{写真|しゃしん}です。 (Taisetsu na shashin desu.)"
            ],
            "correct": 2,
            "why": "大切 là tính từ **な** → 大切な + N."
          },
          {
            "q": "(～たち)　Câu nào SAI?",
            "options": [
              "サルたちがバナナを{食|た}べています。 (Sarutachi ga banana o tabete imasu.)",
              "{私|わたし}たちは{学生|がくせい}です。 (Watashitachi wa gakusei desu.)",
              "{机|つくえ}たちがあります。 (Tsukuetachi ga arimasu.)",
              "{子|こ}どもたちが{遊|あそ}んでいます。 (Kodomotachi ga asonde imasu.)"
            ],
            "correct": 2,
            "why": "～たち chỉ dùng cho **người, con vật** — không dùng cho đồ vật."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tv-nhat-viet",
        "title": "Đọc câu Nhật → chọn nghĩa Việt (9 câu)",
        "items": [
          {
            "q": "Câu này nghĩa là gì? {三|みっ}つ{目|め}の{角|かど}を{右|みぎ}に{曲|ま}がってください。　〔Mittsume no kado o migi ni magatte kudasai.〕",
            "options": [
              "Hãy rẽ trái ở góc phố thứ ba.",
              "Hãy rẽ phải ở ba góc phố.",
              "Góc phố thứ ba ở bên phải.",
              "Hãy rẽ phải ở góc phố thứ ba."
            ],
            "correct": 3,
            "why": "三つ目 = thứ ba; 右に 曲がります = rẽ phải."
          },
          {
            "q": "Câu này nghĩa là gì? すみません、よく{聞|き}こえません。　〔Sumimasen, yoku kikoemasen.〕",
            "options": [
              "Xin lỗi, tôi không hay nghe.",
              "Xin lỗi, tôi nghe không rõ.",
              "Xin lỗi, tôi không hiểu.",
              "Xin lỗi, tôi không hỏi."
            ],
            "correct": 1,
            "why": "よく 聞こえません = nghe không rõ."
          },
          {
            "q": "Câu này nghĩa là gì? {他|ほか}のお{客|きゃく}さんに{迷惑|めいわく}ですから、{静|しず}かにしてください。　〔Hoka no okyakusan ni meiwaku desu kara, shizuka ni shite kudasai.〕",
            "options": [
              "Khách khác đang làm phiền bạn.",
              "Hãy mời khách khác vào.",
              "Khách khác rất yên lặng.",
              "Vì làm phiền những khách khác nên hãy giữ yên lặng."
            ],
            "correct": 3,
            "why": "他の お客さんに 迷惑 = làm phiền khách khác."
          },
          {
            "q": "Câu này nghĩa là gì? {遅|おく}れないでください。バスは{九時|くじ}に{出|で}ます。　〔Okurenaide kudasai. Basu wa kuji ni demasu.〕",
            "options": [
              "Hãy đến trễ một chút. Xe chạy lúc 9 giờ.",
              "Xe buýt trễ đến 9 giờ.",
              "Đừng đến trễ. Xe buýt chạy lúc 9 giờ.",
              "Đừng chờ. Xe buýt đến lúc 9 giờ."
            ],
            "correct": 2,
            "why": "遅れないでください = đừng trễ."
          },
          {
            "q": "Câu này nghĩa là gì? この{写真|しゃしん}は{大切|たいせつ}です。　〔Kono shashin wa taisetsu desu.〕",
            "options": [
              "Tấm ảnh này phiền phức.",
              "Tấm ảnh này quý giá.",
              "Tấm ảnh này cũ.",
              "Tấm ảnh này đẹp."
            ],
            "correct": 1,
            "why": "大切 = quan trọng, quý."
          },
          {
            "q": "Câu này nghĩa là gì? {疲|つか}れました。あそこのベンチで{休|やす}みましょう。　〔Tsukaremashita. Asoko no benchi de yasumimashou.〕",
            "options": [
              "Mệt rồi. Nghỉ học thôi.",
              "Đói rồi. Ăn ở ghế dài đằng kia đi.",
              "Muộn rồi. Về nhà nghỉ đi.",
              "Mệt rồi. Nghỉ ở ghế dài đằng kia đi."
            ],
            "correct": 3,
            "why": "疲れました = mệt rồi; 休みましょう = nghỉ thôi."
          },
          {
            "q": "Câu này nghĩa là gì? {鳥|とり}が{飛|と}んでいます。　〔Tori ga tonde imasu.〕",
            "options": [
              "Con chim đã bay đi.",
              "Con chim đang bay.",
              "Con chim đang hót.",
              "Con chim đang đi bộ."
            ],
            "correct": 1,
            "why": "飛んで います = đang bay."
          },
          {
            "q": "Câu này nghĩa là gì? ちょっとパンフレットをもらってきます。　〔Chotto panfuretto o moratte kimasu.〕",
            "options": [
              "Tôi đã nhận tờ giới thiệu.",
              "Hãy lấy giúp tôi tờ giới thiệu.",
              "Tôi đi lấy tờ giới thiệu một lát rồi về.",
              "Tôi muốn mua tờ giới thiệu."
            ],
            "correct": 2,
            "why": "～て きます = đi … rồi quay lại."
          },
          {
            "q": "Câu này nghĩa là gì? そろそろ{暗|くら}くなります。　〔Sorosoro kuraku narimasu.〕",
            "options": [
              "Trời sắp tối rồi.",
              "Trời không tối.",
              "Trời đã rất tối.",
              "Trời tối dần từ từ."
            ],
            "correct": 0,
            "why": "そろそろ = sắp; 暗くなります = trở nên tối."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-tv-dich",
        "title": "Dịch Việt → Nhật bằng từ của bài (12 câu)",
        "kind": "translate",
        "grammar": "Vない で ください · Vて も いいですか · が 見えます／聞こえます",
        "items": [
          {
            "q": "Hãy rẽ trái ở đèn giao thông.",
            "answers": [
              "信号を左に曲がってください。",
              "信号を左にまがってください。",
              "信号をひだりに曲がってください。",
              "信号をひだりにまがってください。",
              "しんごうを左に曲がってください。",
              "しんごうを左にまがってください。",
              "しんごうをひだりに曲がってください。",
              "しんごうをひだりにまがってください。"
            ],
            "hint": "Nơi rẽ を, hướng に"
          },
          {
            "q": "Hãy qua cầu.",
            "answers": [
              "橋を渡ってください。",
              "橋をわたってください。",
              "はしを渡ってください。",
              "はしをわたってください。"
            ],
            "hint": "橋を 渡ります"
          },
          {
            "q": "Hãy đi thẳng.",
            "answers": [
              "まっすぐ行ってください。",
              "まっすぐいってください。"
            ],
            "hint": "まっすぐ"
          },
          {
            "q": "Nghe thấy tiếng chim.",
            "answers": [
              "鳥の声が聞こえます。",
              "鳥の声がきこえます。",
              "鳥のこえが聞こえます。",
              "鳥のこえがきこえます。",
              "とりの声が聞こえます。",
              "とりの声がきこえます。",
              "とりのこえが聞こえます。",
              "とりのこえがきこえます。"
            ],
            "hint": "N が 聞こえます"
          },
          {
            "q": "Hãy uống thuốc.",
            "answers": [
              "薬を飲んでください。",
              "薬をのんでください。",
              "くすりを飲んでください。",
              "くすりをのんでください。"
            ],
            "hint": "薬を 飲みます"
          },
          {
            "q": "Đừng vứt rác.",
            "answers": [
              "ごみを捨てないでください。",
              "ごみをすてないでください。"
            ],
            "hint": "Vない で ください"
          },
          {
            "q": "Tôi ngồi đây được không?",
            "answers": [
              "ここに座ってもいいですか。",
              "ここにすわってもいいですか。"
            ],
            "hint": "Vて も いいですか"
          },
          {
            "q": "Mọi người, hãy tập hợp lúc 10 giờ.",
            "answers": [
              "皆さん、十時に集合してください。",
              "皆さん、十時にしゅうごうしてください。",
              "皆さん、じゅうじに集合してください。",
              "皆さん、じゅうじにしゅうごうしてください。",
              "みなさん、十時に集合してください。",
              "みなさん、十時にしゅうごうしてください。",
              "みなさん、じゅうじに集合してください。",
              "みなさん、じゅうじにしゅうごうしてください。",
              "皆さん、10時に集合してください。",
              "皆さん、10時にしゅうごうしてください。",
              "みなさん、10時に集合してください。",
              "みなさん、10時にしゅうごうしてください。"
            ],
            "hint": "集合します"
          },
          {
            "q": "Tôi đói rồi.",
            "answers": [
              "おなかがすきました。"
            ],
            "hint": "おなかが すきました"
          },
          {
            "q": "Tôi mệt rồi.",
            "answers": [
              "疲れました。",
              "つかれました。"
            ],
            "hint": "疲れました"
          },
          {
            "q": "Tôi đau chân.",
            "answers": [
              "足が痛いです。",
              "足がいたいです。",
              "あしが痛いです。",
              "あしがいたいです。"
            ],
            "hint": "N が 痛いです"
          },
          {
            "q": "Đừng cho thú ăn.",
            "answers": [
              "動物にえさをやらないでください。",
              "どうぶつにえさをやらないでください。",
              "えさをやらないでください。"
            ],
            "hint": "えさを やります → やらないで"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-tv-ghep",
        "title": "Ghép câu bằng từ vựng Bài 10 (8 câu)",
        "items": [
          {
            "vi": "Rẽ phải ở ngã tư thứ hai.",
            "chips": [
              "{右|みぎ}に",
              "{交差点|こうさてん}に",
              "{二|ふた}つ{目|め}の",
              "{交差点|こうさてん}を",
              "{曲|ま}がります"
            ],
            "answer": [
              "{二|ふた}つ{目|め}の",
              "{交差点|こうさてん}を",
              "{右|みぎ}に",
              "{曲|ま}がります"
            ],
            "ro": "Futatsume no kousaten o migi ni magarimasu"
          },
          {
            "vi": "Từ đây nhìn thấy cây cầu lớn.",
            "chips": [
              "{大|おお}きい{橋|はし}が",
              "{見|み}えます",
              "{見|み}ます",
              "ここから"
            ],
            "answer": [
              "ここから",
              "{大|おお}きい{橋|はし}が",
              "{見|み}えます"
            ],
            "ro": "Koko kara ookii hashi ga miemasu"
          },
          {
            "vi": "Xin đừng đẩy người phía trước.",
            "chips": [
              "{前|まえ}の{人|ひと}を",
              "ください",
              "{押|お}しないで",
              "{押|お}さないで"
            ],
            "answer": [
              "{前|まえ}の{人|ひと}を",
              "{押|お}さないで",
              "ください"
            ],
            "ro": "Mae no hito o osanaide kudasai"
          },
          {
            "vi": "Rác thì hãy mang về nhà.",
            "chips": [
              "{捨|す}てて",
              "ごみは",
              "うちへ",
              "{持|も}って{帰|かえ}って",
              "ください"
            ],
            "answer": [
              "ごみは",
              "うちへ",
              "{持|も}って{帰|かえ}って",
              "ください"
            ],
            "ro": "Gomi wa uchi e motte kaette kudasai"
          },
          {
            "vi": "Khát rồi. Tôi đi mua nước ép rồi quay lại.",
            "chips": [
              "きます",
              "ジュースを",
              "のどがかわきました。",
              "すきました。",
              "{買|か}って"
            ],
            "answer": [
              "のどがかわきました。",
              "ジュースを",
              "{買|か}って",
              "きます"
            ],
            "ro": "Nodo ga kawakimashita. Juusu o katte kimasu"
          },
          {
            "vi": "Con khỉ đang ăn chuối.",
            "chips": [
              "サルが",
              "います",
              "バナナを",
              "{食|た}べて",
              "サルを"
            ],
            "answer": [
              "サルが",
              "バナナを",
              "{食|た}べて",
              "います"
            ],
            "ro": "Saru ga banana o tabete imasu"
          },
          {
            "vi": "Vé này quan trọng nên đừng làm mất.",
            "chips": [
              "なくさないで",
              "ください",
              "{迷惑|めいわく}ですから、",
              "このチケットは",
              "{大切|たいせつ}ですから、"
            ],
            "answer": [
              "このチケットは",
              "{大切|たいせつ}ですから、",
              "なくさないで",
              "ください"
            ],
            "ro": "Kono chiketto wa taisetsu desu kara, nakusanaide kudasai"
          },
          {
            "vi": "Trời tối rồi. Sắp về thôi.",
            "chips": [
              "そろそろ",
              "{暗|くら}くなりました。",
              "{帰|かえ}りましょう",
              "{暗|くら}いなりました。"
            ],
            "answer": [
              "{暗|くら}くなりました。",
              "そろそろ",
              "{帰|かえ}りましょう"
            ],
            "ro": "Kuraku narimashita. Sorosoro kaerimashou"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b10-chu-han",
    "kind": "kanji",
    "title": "Luyện thêm Bài 10 · Chữ Hán của lớp (右左立座歩待持近道橋危曲) — đọc · nghĩa · chọn chữ · đọc không furigana",
    "goal": "Đọc đúng, hiểu nghĩa 12 chữ Hán Bài 10 (chỉ đường, đứng–ngồi, đi bộ, chờ, mang, gần, đường, cầu, nguy hiểm, rẽ) và các từ (右側, 左右, 散歩, 最近, 歩道橋…), phân biệt chữ na ná (右/石, 左/在, 待/持/時, 近/遠, 道/通, 曲/由…), đọc câu/đoạn không furigana như đề thi.",
    "minutes": 65,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Học **chữ theo cụm chỉ đường**: 右に曲がります · 左に曲がります · 道をまっすぐ · 橋を渡ります · 駅から歩いて10分 · ここで待ってください · 荷物を持ちます · 駅の近く · 危ないです · ここに座ります · 立たないでください.",
          "Chữ **na ná**: 右/石 (右 có 口 bên dưới, 石 có nét ngang dài) · 左/在/友 · **待/持/時/特** (cùng phần 寺: 彳 = đi → chờ; 扌 = tay → cầm; 日 = mặt trời → giờ) · 近/遠/返 · 道/通/首 · 曲/由/田 · 立/位/音 · 座/庭/広 · 歩/止/少. Mỗi lần sai, viết chữ đúng 5 lần kèm từ.",
          "Mức Khó không furigana: chỉ dùng chữ đã học đến Bài 10 (còn lại viết hiragana như đề thi). Đọc to cả câu rồi mới bấm xem."
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
            "右",
            "bên phải",
            "HỮU — On ウ・ユウ · Kun みぎ",
            "右 · 右に曲がります · 左右"
          ],
          [
            "左",
            "bên trái",
            "TẢ — On サ · Kun ひだり",
            "左 · 左に曲がります · 左右"
          ],
          [
            "立",
            "đứng",
            "LẬP — On リツ · Kun た・ちます",
            "立ちます · 立ってください · 国立"
          ],
          [
            "座",
            "ngồi; chỗ ngồi",
            "TOẠ — On ザ · Kun すわ・ります",
            "座ります · 座ってください · 銀座"
          ],
          [
            "歩",
            "đi bộ, bước",
            "BỘ — On ホ・ポ · Kun ある・きます",
            "歩きます · 歩いて · 散歩"
          ],
          [
            "待",
            "chờ, đợi",
            "ĐÃI — On タイ · Kun ま・ちます",
            "待ちます · 待ってください · 待合室"
          ],
          [
            "持",
            "cầm, mang",
            "TRÌ — On ジ · Kun も・ちます",
            "持ちます · 持って行きます · 持って帰ります · 気持ち"
          ],
          [
            "近",
            "gần",
            "CẬN — On キン · Kun ちか・い",
            "近い · 近く · 最近"
          ],
          [
            "道",
            "con đường; đạo",
            "ĐẠO — On ドウ · Kun みち",
            "道 · 書道 · 北海道"
          ],
          [
            "橋",
            "cây cầu",
            "KIỀU — On キョウ · Kun はし",
            "橋 · 歩道橋"
          ],
          [
            "危",
            "nguy hiểm",
            "NGUY — On キ · Kun あぶ・ない",
            "危ない · 危険"
          ],
          [
            "曲",
            "cong, rẽ; bản nhạc",
            "KHÚC — On キョク · Kun ま・がります",
            "曲がります · 曲"
          ]
        ],
        "caption": "12 chữ Hán của lớp Bài 10"
      },
      {
        "t": "mcq",
        "id": "lt-b10-kj-nghia",
        "title": "Chữ → nghĩa (12 câu)",
        "items": [
          {
            "q": "Chữ 「右」 mang nghĩa nào?",
            "options": [
              "đi bộ, bước",
              "bên trái",
              "chờ, đợi",
              "bên phải"
            ],
            "correct": 3,
            "why": "**右** = bên phải (HỮU — On ウ・ユウ · Kun みぎ). Hay gặp: 右 · 右に曲がります · 左右."
          },
          {
            "q": "Chữ 「左」 mang nghĩa nào?",
            "options": [
              "chờ, đợi",
              "cây cầu",
              "đứng",
              "bên trái"
            ],
            "correct": 3,
            "why": "**左** = bên trái (TẢ — On サ · Kun ひだり). Hay gặp: 左 · 左に曲がります · 左右."
          },
          {
            "q": "Chữ 「立」 mang nghĩa nào?",
            "options": [
              "đi bộ, bước",
              "cây cầu",
              "đứng",
              "cầm, mang"
            ],
            "correct": 2,
            "why": "**立** = đứng (LẬP — On リツ · Kun た・ちます). Hay gặp: 立ちます · 立ってください · 国立."
          },
          {
            "q": "Chữ 「座」 mang nghĩa nào?",
            "options": [
              "ngồi; chỗ ngồi",
              "đứng",
              "cầm, mang",
              "con đường; đạo"
            ],
            "correct": 0,
            "why": "**座** = ngồi; chỗ ngồi (TOẠ — On ザ · Kun すわ・ります). Hay gặp: 座ります · 座ってください · 銀座."
          },
          {
            "q": "Chữ 「歩」 mang nghĩa nào?",
            "options": [
              "đi bộ, bước",
              "gần",
              "chờ, đợi",
              "bên trái"
            ],
            "correct": 0,
            "why": "**歩** = đi bộ, bước (BỘ — On ホ・ポ · Kun ある・きます). Hay gặp: 歩きます · 歩いて · 散歩."
          },
          {
            "q": "Chữ 「待」 mang nghĩa nào?",
            "options": [
              "con đường; đạo",
              "đi bộ, bước",
              "chờ, đợi",
              "bên phải"
            ],
            "correct": 2,
            "why": "**待** = chờ, đợi (ĐÃI — On タイ · Kun ま・ちます). Hay gặp: 待ちます · 待ってください · 待合室."
          },
          {
            "q": "Chữ 「持」 mang nghĩa nào?",
            "options": [
              "cong, rẽ; bản nhạc",
              "cây cầu",
              "cầm, mang",
              "bên trái"
            ],
            "correct": 2,
            "why": "**持** = cầm, mang (TRÌ — On ジ · Kun も・ちます). Hay gặp: 持ちます · 持って行きます · 持って帰ります · 気持ち."
          },
          {
            "q": "Chữ 「近」 mang nghĩa nào?",
            "options": [
              "cầm, mang",
              "gần",
              "con đường; đạo",
              "đứng"
            ],
            "correct": 1,
            "why": "**近** = gần (CẬN — On キン · Kun ちか・い). Hay gặp: 近い · 近く · 最近."
          },
          {
            "q": "Chữ 「道」 mang nghĩa nào?",
            "options": [
              "con đường; đạo",
              "cây cầu",
              "nguy hiểm",
              "cong, rẽ; bản nhạc"
            ],
            "correct": 0,
            "why": "**道** = con đường; đạo (ĐẠO — On ドウ · Kun みち). Hay gặp: 道 · 書道 · 北海道."
          },
          {
            "q": "Chữ 「橋」 mang nghĩa nào?",
            "options": [
              "cây cầu",
              "bên trái",
              "cầm, mang",
              "nguy hiểm"
            ],
            "correct": 0,
            "why": "**橋** = cây cầu (KIỀU — On キョウ · Kun はし). Hay gặp: 橋 · 歩道橋."
          },
          {
            "q": "Chữ 「危」 mang nghĩa nào?",
            "options": [
              "cong, rẽ; bản nhạc",
              "nguy hiểm",
              "ngồi; chỗ ngồi",
              "đứng"
            ],
            "correct": 1,
            "why": "**危** = nguy hiểm (NGUY — On キ · Kun あぶ・ない). Hay gặp: 危ない · 危険."
          },
          {
            "q": "Chữ 「曲」 mang nghĩa nào?",
            "options": [
              "nguy hiểm",
              "cong, rẽ; bản nhạc",
              "cầm, mang",
              "bên phải"
            ],
            "correct": 1,
            "why": "**曲** = cong, rẽ; bản nhạc (KHÚC — On キョク · Kun ま・がります). Hay gặp: 曲がります · 曲."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-kj-nghia2",
        "title": "Nghĩa → chữ (12 câu)",
        "items": [
          {
            "q": "Chữ nào có nghĩa \"bên phải\"?",
            "options": [
              "待",
              "右",
              "橋",
              "道"
            ],
            "correct": 1,
            "why": "**右** = bên phải (HỮU — On ウ・ユウ · Kun みぎ). Hay gặp: 右 · 右に曲がります · 左右."
          },
          {
            "q": "Chữ nào có nghĩa \"bên trái\"?",
            "options": [
              "道",
              "右",
              "立",
              "左"
            ],
            "correct": 3,
            "why": "**左** = bên trái (TẢ — On サ · Kun ひだり). Hay gặp: 左 · 左に曲がります · 左右."
          },
          {
            "q": "Chữ nào có nghĩa \"đứng\"?",
            "options": [
              "道",
              "待",
              "座",
              "立"
            ],
            "correct": 3,
            "why": "**立** = đứng (LẬP — On リツ · Kun た・ちます). Hay gặp: 立ちます · 立ってください · 国立."
          },
          {
            "q": "Chữ nào có nghĩa \"ngồi; chỗ ngồi\"?",
            "options": [
              "近",
              "曲",
              "危",
              "座"
            ],
            "correct": 3,
            "why": "**座** = ngồi; chỗ ngồi (TOẠ — On ザ · Kun すわ・ります). Hay gặp: 座ります · 座ってください · 銀座."
          },
          {
            "q": "Chữ nào có nghĩa \"đi bộ, bước\"?",
            "options": [
              "道",
              "歩",
              "持",
              "近"
            ],
            "correct": 1,
            "why": "**歩** = đi bộ, bước (BỘ — On ホ・ポ · Kun ある・きます). Hay gặp: 歩きます · 歩いて · 散歩."
          },
          {
            "q": "Chữ nào có nghĩa \"chờ, đợi\"?",
            "options": [
              "近",
              "待",
              "橋",
              "右"
            ],
            "correct": 1,
            "why": "**待** = chờ, đợi (ĐÃI — On タイ · Kun ま・ちます). Hay gặp: 待ちます · 待ってください · 待合室."
          },
          {
            "q": "Chữ nào có nghĩa \"cầm, mang\"?",
            "options": [
              "道",
              "立",
              "持",
              "橋"
            ],
            "correct": 2,
            "why": "**持** = cầm, mang (TRÌ — On ジ · Kun も・ちます). Hay gặp: 持ちます · 持って行きます · 持って帰ります · 気持ち."
          },
          {
            "q": "Chữ nào có nghĩa \"gần\"?",
            "options": [
              "橋",
              "危",
              "近",
              "立"
            ],
            "correct": 2,
            "why": "**近** = gần (CẬN — On キン · Kun ちか・い). Hay gặp: 近い · 近く · 最近."
          },
          {
            "q": "Chữ nào có nghĩa \"con đường; đạo\"?",
            "options": [
              "左",
              "曲",
              "待",
              "道"
            ],
            "correct": 3,
            "why": "**道** = con đường; đạo (ĐẠO — On ドウ · Kun みち). Hay gặp: 道 · 書道 · 北海道."
          },
          {
            "q": "Chữ nào có nghĩa \"cây cầu\"?",
            "options": [
              "道",
              "立",
              "持",
              "橋"
            ],
            "correct": 3,
            "why": "**橋** = cây cầu (KIỀU — On キョウ · Kun はし). Hay gặp: 橋 · 歩道橋."
          },
          {
            "q": "Chữ nào có nghĩa \"nguy hiểm\"?",
            "options": [
              "道",
              "歩",
              "右",
              "危"
            ],
            "correct": 3,
            "why": "**危** = nguy hiểm (NGUY — On キ · Kun あぶ・ない). Hay gặp: 危ない · 危険."
          },
          {
            "q": "Chữ nào có nghĩa \"cong, rẽ; bản nhạc\"?",
            "options": [
              "曲",
              "道",
              "左",
              "持"
            ],
            "correct": 0,
            "why": "**曲** = cong, rẽ; bản nhạc (KHÚC — On キョク · Kun ま・がります). Hay gặp: 曲がります · 曲."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-kj-doc",
        "title": "Đọc từ ghép / từ có chữ Hán của bài (20 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　【右】",
            "options": [
              "ゆう (yuu)",
              "う (u)",
              "ひだり (hidari)",
              "みぎ (migi)"
            ],
            "correct": 3,
            "why": "右 = みぎ (migi) — bên phải — Kun みぎ."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【左】",
            "options": [
              "さ (sa)",
              "みぎ (migi)",
              "ひたり (hitari)",
              "ひだり (hidari)"
            ],
            "correct": 3,
            "why": "左 = ひだり (hidari) — bên trái — Kun ひだり."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【左右】",
            "options": [
              "さゆう (sayuu)",
              "さう (sau)",
              "みぎひだり (migihidari)",
              "ざゆう (zayuu)"
            ],
            "correct": 0,
            "why": "左右 = さゆう (sayuu) — trái phải — On さ + ゆう."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【立ちます】",
            "options": [
              "だちます (dachimasu)",
              "りつちます (ritsuchimasu)",
              "たちます (tachimasu)",
              "たてます (tatemasu)"
            ],
            "correct": 2,
            "why": "立ちます = たちます (tachimasu) — đứng — Kun た(つ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【座ります】",
            "options": [
              "すいります (suirimasu)",
              "ざります (zarimasu)",
              "ずわります (zuwarimasu)",
              "すわります (suwarimasu)"
            ],
            "correct": 3,
            "why": "座ります = すわります (suwarimasu) — ngồi — Kun すわ(る)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【歩きます】",
            "options": [
              "あるきます (arukimasu)",
              "あるいます (aruimasu)",
              "ほきます (hokimasu)",
              "あゆきます (ayukimasu)"
            ],
            "correct": 0,
            "why": "歩きます = あるきます (arukimasu) — đi bộ — Kun ある(く)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【散歩】",
            "options": [
              "ちるある (chiruaru)",
              "さんぽ (sanpo)",
              "さんほ (sanho)",
              "さんぼ (sanbo)"
            ],
            "correct": 1,
            "why": "散歩 = さんぽ (sanpo) — đi dạo — 歩 đọc ぽ sau ん."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【待ちます】",
            "options": [
              "たいちます (taichimasu)",
              "もちます (mochimasu)",
              "まてます (matemasu)",
              "まちます (machimasu)"
            ],
            "correct": 3,
            "why": "待ちます = まちます (machimasu) — chờ — Kun ま(つ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【持ちます】",
            "options": [
              "じちます (jichimasu)",
              "まちます (machimasu)",
              "もちます (mochimasu)",
              "もてます (motemasu)"
            ],
            "correct": 2,
            "why": "持ちます = もちます (mochimasu) — cầm, mang — Kun も(つ)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【持って帰ります】",
            "options": [
              "もってかえります (mottekaerimasu)",
              "もってはいります (mottehairimasu)",
              "まってかえります (mattekaerimasu)",
              "もってきます (mottekimasu)"
            ],
            "correct": 0,
            "why": "持って帰ります = もってかえります (mottekaerimasu) — mang về."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【近い】",
            "options": [
              "ちかい (chikai)",
              "きんい (kin'i)",
              "とおい (tooi)",
              "ちがい (chigai)"
            ],
            "correct": 0,
            "why": "近い = ちかい (chikai) — gần — Kun ちか(い)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【最近】",
            "options": [
              "さいちか (saichika)",
              "さきん (sakin)",
              "さいこん (saikon)",
              "さいきん (saikin)"
            ],
            "correct": 3,
            "why": "最近 = さいきん (saikin) — gần đây (B9) — 近 đọc On きん."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【道】",
            "options": [
              "みち (michi)",
              "まち (machi)",
              "みず (mizu)",
              "どう (dou)"
            ],
            "correct": 0,
            "why": "道 = みち (michi) — con đường — Kun みち."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【書道】",
            "options": [
              "しょど (shodo)",
              "しょとう (shotou)",
              "しょどう (shodou)",
              "しょみち (shomichi)"
            ],
            "correct": 2,
            "why": "書道 = しょどう (shodou) — thư pháp (B9) — 道 đọc On どう."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【橋】",
            "options": [
              "はじ (haji)",
              "きょう (kyou)",
              "はし (hashi)",
              "ばし (bashi)"
            ],
            "correct": 2,
            "why": "橋 = はし (hashi) — cây cầu — Kun はし."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【危ない】",
            "options": [
              "きない (kinai)",
              "あぶいない (abuinai)",
              "あふない (afunai)",
              "あぶない (abunai)"
            ],
            "correct": 3,
            "why": "危ない = あぶない (abunai) — nguy hiểm — Kun あぶ(ない)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【曲がります】",
            "options": [
              "きょくります (kyokurimasu)",
              "わたります (watarimasu)",
              "まかります (makarimasu)",
              "まがります (magarimasu)"
            ],
            "correct": 3,
            "why": "曲がります = まがります (magarimasu) — rẽ — Kun ま(がる)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【曲】",
            "options": [
              "きょ (kyo)",
              "きょく (kyoku)",
              "ま (ma)",
              "まが (maga)"
            ],
            "correct": 1,
            "why": "曲 = きょく (kyoku) — bản nhạc — On きょく (một mình, không có đuôi kana)."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【二つ目の道】",
            "options": [
              "ふたつもくのみち (futatsumokunomichi)",
              "ふたつめのどう (futatsumenodou)",
              "ふたつめのみち (futatsumenomichi)",
              "につめのみち (nitsumenomichi)"
            ],
            "correct": 2,
            "why": "二つ目の道 = ふたつめのみち (futatsumenomichi) — con đường thứ hai."
          },
          {
            "q": "Đọc đúng phần trong 【 】:　【右に曲がります】",
            "options": [
              "みぎにまがります (miginimagarimasu)",
              "みぎにきょくがります (miginikyokugarimasu)",
              "うにまがります (unimagarimasu)",
              "ひだりにまがります (hidarinimagarimasu)"
            ],
            "correct": 0,
            "why": "右に曲がります = みぎにまがります (miginimagarimasu) — rẽ phải."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chọn chữ đúng · điền chữ vào câu · On hay Kun"
      },
      {
        "t": "mcq",
        "id": "lt-b10-kj-chon-chu",
        "title": "Chọn cách viết đúng (12 câu)",
        "items": [
          {
            "q": "Chọn cách viết đúng: みぎ (bên phải)",
            "options": [
              "左",
              "石",
              "古",
              "右"
            ],
            "correct": 3,
            "why": "右 = tay (ナ) + miệng (口); 石 là \"đá\"."
          },
          {
            "q": "Chọn cách viết đúng: ひだり (bên trái)",
            "options": [
              "友",
              "在",
              "右",
              "左"
            ],
            "correct": 3,
            "why": "左 = tay (ナ) + 工 (thước thợ)."
          },
          {
            "q": "Chọn cách viết đúng: たちます (đứng)",
            "options": [
              "立ちます",
              "音ちます",
              "辛ちます",
              "位ちます"
            ],
            "correct": 0,
            "why": "立 = người đứng trên mặt đất."
          },
          {
            "q": "Chọn cách viết đúng: すわります (ngồi)",
            "options": [
              "広ります",
              "席ります",
              "座ります",
              "庭ります"
            ],
            "correct": 2,
            "why": "座 = mái nhà 广 che hai người (人人) ngồi trên đất (土)."
          },
          {
            "q": "Chọn cách viết đúng: あるきます (đi bộ)",
            "options": [
              "走きます",
              "少きます",
              "止きます",
              "歩きます"
            ],
            "correct": 3,
            "why": "Bước chân: 止 (dừng) + 少 → 歩."
          },
          {
            "q": "Chọn cách viết đúng: まちます (chờ)",
            "options": [
              "特ちます",
              "持ちます",
              "待ちます",
              "時ちます"
            ],
            "correct": 2,
            "why": "彳 (đi) + 寺 → 待 = chờ; 扌 (tay) + 寺 → 持 = cầm."
          },
          {
            "q": "Chọn cách viết đúng: もちます (cầm, mang)",
            "options": [
              "時ちます",
              "特ちます",
              "待ちます",
              "持ちます"
            ],
            "correct": 3,
            "why": "持 có bộ 扌 (tay) — cầm bằng tay."
          },
          {
            "q": "Chọn cách viết đúng: ちかい (gần)",
            "options": [
              "迎い",
              "遠い",
              "近い",
              "返い"
            ],
            "correct": 2,
            "why": "近 = 辶 (đi) + 斤."
          },
          {
            "q": "Chọn cách viết đúng: みち (con đường)",
            "options": [
              "道",
              "首",
              "遠",
              "通"
            ],
            "correct": 0,
            "why": "道 = 辶 + 首 (cái đầu đi trước)."
          },
          {
            "q": "Chọn cách viết đúng: はし (cây cầu)",
            "options": [
              "橋",
              "喬",
              "端",
              "箸"
            ],
            "correct": 0,
            "why": "Cầu gỗ: 木 + 喬. はし (đũa) viết 箸 — chưa học."
          },
          {
            "q": "Chọn cách viết đúng: あぶない (nguy hiểm)",
            "options": [
              "色ない",
              "危ない",
              "厄ない",
              "危いない"
            ],
            "correct": 1,
            "why": "危 = người đứng trên vách đá."
          },
          {
            "q": "Chọn cách viết đúng: まがります (rẽ)",
            "options": [
              "田がります",
              "由がります",
              "曲がります",
              "典がります"
            ],
            "correct": 2,
            "why": "曲 = đường cong, khúc quanh."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-kj-dien-chu",
        "title": "Điền chữ Hán vào chỗ trống (12 câu)",
        "items": [
          {
            "q": "あの{信号|しんごう}を＿＿に{曲|ま}がってください。　〔Ano shingou o __ ni magatte kudasai.〕　— Rẽ phải (みぎ) ở đèn giao thông kia.",
            "options": [
              "石",
              "古",
              "右",
              "在"
            ],
            "correct": 2,
            "why": "みぎ = 右. → **あの{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。** 〔Ano shingou o migi ni magatte kudasai.〕 — Rẽ phải (みぎ) ở đèn giao thông kia."
          },
          {
            "q": "{二|ふた}つ{目|め}の{角|かど}を＿＿に{曲|ま}がります。　〔Futatsume no kado o __ ni magarimasu.〕　— Rẽ trái (ひだり) ở góc phố thứ hai.",
            "options": [
              "右",
              "左",
              "友",
              "在"
            ],
            "correct": 1,
            "why": "ひだり = 左. → **{二|ふた}つ{目|め}の{角|かど}を{左|ひだり}に{曲|ま}がります。** 〔Futatsume no kado o hidari ni magarimasu.〕 — Rẽ trái (ひだり) ở góc phố thứ hai."
          },
          {
            "q": "バスの{中|なか}で＿＿たないでください。　〔Basu no naka de __tanaide kudasai.〕　— Trong xe buýt đừng đứng lên (たたないで).",
            "options": [
              "位",
              "辛",
              "音",
              "立"
            ],
            "correct": 3,
            "why": "た(たない) = 立. → **バスの{中|なか}で{立|た}たないでください。** 〔Basu no naka de tatanaide kudasai.〕 — Trong xe buýt đừng đứng lên (たたないで)."
          },
          {
            "q": "ここに＿＿ってもいいですか。　〔Koko ni __tte mo ii desu ka.〕　— Tôi ngồi (すわって) đây được không?",
            "options": [
              "広",
              "座",
              "席",
              "庭"
            ],
            "correct": 1,
            "why": "すわ(って) = 座. → **ここに{座|すわ}ってもいいですか。** 〔Koko ni suwatte mo ii desu ka.〕 — Tôi ngồi (すわって) đây được không?"
          },
          {
            "q": "{駅|えき}から＿＿いて{十分|じゅっぷん}です。　〔Eki kara __ite juppun desu.〕　— Từ ga đi bộ (あるいて) mất 10 phút.",
            "options": [
              "歩",
              "走",
              "少",
              "止"
            ],
            "correct": 0,
            "why": "ある(いて) = 歩. → **{駅|えき}から{歩|ある}いて{十分|じゅっぷん}です。** 〔Eki kara aruite juppun desu.〕 — Từ ga đi bộ (あるいて) mất 10 phút."
          },
          {
            "q": "ここで{少|すこ}し＿＿ってください。　〔Koko de sukoshi __tte kudasai.〕　— Hãy chờ (まって) ở đây một chút.",
            "options": [
              "持",
              "待",
              "特",
              "時"
            ],
            "correct": 1,
            "why": "ま(って) — chờ = 待 (bộ 彳). → **ここで{少|すこ}し{待|ま}ってください。** 〔Koko de sukoshi matte kudasai.〕 — Hãy chờ (まって) ở đây một chút."
          },
          {
            "q": "{重|おも}い{荷物|にもつ}を＿＿ちましょうか。　〔Omoi nimotsu o __chimashou ka.〕　— Để tôi cầm (もちましょう) hành lý nặng cho nhé?",
            "options": [
              "時",
              "待",
              "特",
              "持"
            ],
            "correct": 3,
            "why": "も(ちましょう) — cầm = 持 (bộ 扌). → **{重|おも}い{荷物|にもつ}を{持|も}ちましょうか。** 〔Omoi nimotsu o mochimashou ka.〕 — Để tôi cầm (もちましょう) hành lý nặng cho nhé?"
          },
          {
            "q": "{駅|えき}はここから＿＿いです。　〔Eki wa koko kara __i desu.〕　— Ga ở gần (ちかい) đây.",
            "options": [
              "近",
              "迎",
              "遠",
              "返"
            ],
            "correct": 0,
            "why": "ちか(い) = 近. → **{駅|えき}はここから{近|ちか}いです。** 〔Eki wa koko kara chikai desu.〕 — Ga ở gần (ちかい) đây."
          },
          {
            "q": "この＿＿をまっすぐ{行|い}ってください。　〔Kono __ o massugu itte kudasai.〕　— Hãy đi thẳng con đường (みち) này.",
            "options": [
              "遠",
              "通",
              "首",
              "道"
            ],
            "correct": 3,
            "why": "みち = 道. → **この{道|みち}をまっすぐ{行|い}ってください。** 〔Kono michi o massugu itte kudasai.〕 — Hãy đi thẳng con đường (みち) này."
          },
          {
            "q": "{大|おお}きい＿＿を{渡|わた}ります。　〔Ookii __ o watarimasu.〕　— Băng qua cây cầu (はし) lớn.",
            "options": [
              "箸",
              "端",
              "喬",
              "橋"
            ],
            "correct": 3,
            "why": "はし (cầu) = 橋. → **{大|おお}きい{橋|はし}を{渡|わた}ります。** 〔Ookii hashi o watarimasu.〕 — Băng qua cây cầu (はし) lớn."
          },
          {
            "q": "{道|みち}で{遊|あそ}ばないでください。＿＿ないです。　〔Michi de asobanaide kudasai. __nai desu.〕　— Đừng chơi ngoài đường. Nguy hiểm (あぶない).",
            "options": [
              "岩",
              "危",
              "色",
              "厄"
            ],
            "correct": 1,
            "why": "あぶ(ない) = 危. → **{道|みち}で{遊|あそ}ばないでください。{危|あぶ}ないです。** 〔Michi de asobanaide kudasai. Abunai desu.〕 — Đừng chơi ngoài đường. Nguy hiểm (あぶない)."
          },
          {
            "q": "{交差点|こうさてん}を{右|みぎ}に＿＿がります。　〔Kousaten o migi ni __garimasu.〕　— Rẽ (まがります) phải ở ngã tư.",
            "options": [
              "田",
              "曲",
              "典",
              "由"
            ],
            "correct": 1,
            "why": "ま(がります) = 曲. → **{交差点|こうさてん}を{右|みぎ}に{曲|ま}がります。** 〔Kousaten o migi ni magarimasu.〕 — Rẽ (まがります) phải ở ngã tư."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-kj-on-kun",
        "title": "Cùng một chữ, đọc khác nhau tuỳ từ (13 câu)",
        "items": [
          {
            "q": "Chữ 「右」 trong 「右」 đọc là gì?",
            "options": [
              "ひだり",
              "みぎ",
              "う",
              "ゆう"
            ],
            "correct": 1,
            "why": "Đứng một mình → Kun みぎ."
          },
          {
            "q": "Chữ 「右」 trong 「左右」 đọc là gì?",
            "options": [
              "みぎ",
              "さ",
              "う",
              "ゆう"
            ],
            "correct": 3,
            "why": "Từ ghép On: さ + ゆう."
          },
          {
            "q": "Chữ 「左」 trong 「左」 đọc là gì?",
            "options": [
              "ひたり",
              "みぎ",
              "ひだり",
              "さ"
            ],
            "correct": 2,
            "why": "Đứng một mình → Kun ひだり."
          },
          {
            "q": "Chữ 「歩」 trong 「歩きます」 đọc là gì?",
            "options": [
              "ある",
              "ぽ",
              "ほ",
              "あゆ"
            ],
            "correct": 0,
            "why": "Có đuôi kana → Kun ある(く)."
          },
          {
            "q": "Chữ 「歩」 trong 「散歩」 đọc là gì?",
            "options": [
              "ほ",
              "ぼ",
              "ぽ",
              "ある"
            ],
            "correct": 2,
            "why": "On ほ biến âm thành ぽ sau ん: さんぽ."
          },
          {
            "q": "Chữ 「近」 trong 「近い」 đọc là gì?",
            "options": [
              "こん",
              "ちか",
              "きん",
              "ちが"
            ],
            "correct": 1,
            "why": "Có đuôi kana → Kun ちか(い)."
          },
          {
            "q": "Chữ 「近」 trong 「最近」 đọc là gì?",
            "options": [
              "きん",
              "ぎん",
              "こん",
              "ちか"
            ],
            "correct": 0,
            "why": "Từ ghép On: さい + きん."
          },
          {
            "q": "Chữ 「道」 trong 「道」 đọc là gì?",
            "options": [
              "とう",
              "みち",
              "みず",
              "どう"
            ],
            "correct": 1,
            "why": "Đứng một mình → Kun みち."
          },
          {
            "q": "Chữ 「道」 trong 「北海道」 đọc là gì?",
            "options": [
              "とう",
              "みち",
              "どう",
              "ど"
            ],
            "correct": 2,
            "why": "Tên vùng: ほっかい + どう."
          },
          {
            "q": "Chữ 「曲」 trong 「曲がります」 đọc là gì?",
            "options": [
              "ま",
              "まが",
              "きょ",
              "きょく"
            ],
            "correct": 0,
            "why": "Kun ま(がる)."
          },
          {
            "q": "Chữ 「曲」 trong 「いい曲」 đọc là gì?",
            "options": [
              "ま",
              "まが",
              "きょく",
              "きょ"
            ],
            "correct": 2,
            "why": "Một mình nghĩa \"bản nhạc\" → On きょく."
          },
          {
            "q": "Chữ 「立」 trong 「立ちます」 đọc là gì?",
            "options": [
              "た",
              "りゅう",
              "りつ",
              "たち"
            ],
            "correct": 0,
            "why": "Kun た(つ)."
          },
          {
            "q": "Chữ 「座」 trong 「座ります」 đọc là gì?",
            "options": [
              "ず",
              "ざ",
              "すわ",
              "すわり"
            ],
            "correct": 2,
            "why": "Kun すわ(る)."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · không furigana — như đề thi"
      },
      {
        "t": "mcq",
        "id": "lt-b10-kj-doc-cau",
        "title": "Đọc đúng phần trong 【 】 (12 câu)",
        "items": [
          {
            "q": "Đọc đúng phần trong 【 】:　あの信号を【右】に曲がってください。",
            "options": [
              "ひだり (hidari)",
              "う (u)",
              "ゆう (yuu)",
              "みぎ (migi)"
            ],
            "correct": 3,
            "why": "右 = みぎ. Cả câu: あの信号を【右】に曲がってください。 〔Ano shingou o [migi] ni magatte kudasai.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　二つ目の角を【左】に曲がります。",
            "options": [
              "ひたり (hitari)",
              "さ (sa)",
              "みぎ (migi)",
              "ひだり (hidari)"
            ],
            "correct": 3,
            "why": "左 = ひだり. Cả câu: 二つ目の角を【左】に曲がります。 〔Futatsume no kado o [hidari] ni magarimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　バスの中で【立たないで】ください。",
            "options": [
              "りつないで (ritsunaide)",
              "たてないで (tatenaide)",
              "たたないで (tatanaide)",
              "たちないで (tachinaide)"
            ],
            "correct": 2,
            "why": "立たないで = たたないで. Cả câu: バスの中で【立たないで】ください。 〔Basu no naka de [tatanaide] kudasai.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　ここに【座って】もいいですか。",
            "options": [
              "すわって (suwatte)",
              "すわりって (suwaritte)",
              "ずわって (zuwatte)",
              "ざって (zatte)"
            ],
            "correct": 0,
            "why": "座って = すわって. Cả câu: ここに【座って】もいいですか。 〔Koko ni [suwatte] mo ii desu ka.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　駅から【歩いて】五分です。",
            "options": [
              "あるいて (aruite)",
              "あるきて (arukite)",
              "ほいて (hoite)",
              "あゆいて (ayuite)"
            ],
            "correct": 0,
            "why": "歩いて = あるいて. Cả câu: 駅から【歩いて】五分です。 〔Eki kara [aruite] gofun desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　ここで少し【待って】ください。",
            "options": [
              "もって (motte)",
              "たいって (taitte)",
              "まちて (machite)",
              "まって (matte)"
            ],
            "correct": 3,
            "why": "待って = まって. Cả câu: ここで少し【待って】ください。 〔Koko de sukoshi [matte] kudasai.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　ごみは【持って】帰ってください。",
            "options": [
              "もちって (mochitte)",
              "じって (jitte)",
              "まって (matte)",
              "もって (motte)"
            ],
            "correct": 3,
            "why": "持って = もって. Cả câu: ごみは【持って】帰ってください。 〔Gomi wa [motte] kaette kudasai.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　駅の【近く】に銀行があります。",
            "options": [
              "ちかく (chikaku)",
              "とおく (tooku)",
              "きんく (kinku)",
              "ちがく (chigaku)"
            ],
            "correct": 0,
            "why": "近く = ちかく. Cả câu: 駅の【近く】に銀行があります。 〔Eki no [chikaku] ni ginkou ga arimasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　この【道】をまっすぐ行ってください。",
            "options": [
              "どう (dou)",
              "みず (mizu)",
              "みち (michi)",
              "まち (machi)"
            ],
            "correct": 2,
            "why": "道 = みち. Cả câu: この【道】をまっすぐ行ってください。 〔Kono [michi] o massugu itte kudasai.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　大きい【橋】が見えます。",
            "options": [
              "きょう (kyou)",
              "ばし (bashi)",
              "はじ (haji)",
              "はし (hashi)"
            ],
            "correct": 3,
            "why": "橋 = はし. Cả câu: 大きい【橋】が見えます。 〔Ookii [hashi] ga miemasu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　道で遊ばないでください。【危ない】です。",
            "options": [
              "きない (kinai)",
              "あふない (afunai)",
              "あぶない (abunai)",
              "あぶいない (abuinai)"
            ],
            "correct": 2,
            "why": "危ない = あぶない. Cả câu: 道で遊ばないでください。【危ない】です。 〔Michi de asobanaide kudasai. [abunai] desu.〕"
          },
          {
            "q": "Đọc đúng phần trong 【 】:　交差点を左に【曲がって】ください。",
            "options": [
              "まがりって (magaritte)",
              "まがって (magatte)",
              "きょくって (kyokutte)",
              "まかって (makatte)"
            ],
            "correct": 1,
            "why": "曲がって = まがって. Cả câu: 交差点を左に【曲がって】ください。 〔Kousaten o hidari ni [magatte] kudasai.〕"
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b10-kj-doc-cau-rk",
        "title": "Đọc to câu KHÔNG furigana, rồi bấm xem đáp án (22 câu)",
        "note": "Đọc to cả câu. Chỉ dùng chữ Hán đã học đến Bài 10; các từ khác viết hiragana như đề thi.",
        "items": [
          {
            "text": "あのしんごうを{右|みぎ}に{曲|ま}がってください。",
            "ro": "Ano shingou o migi ni magatte kudasai.",
            "vi": "Đến đèn giao thông kia thì rẽ phải."
          },
          {
            "text": "{二|ふた}つ{目|め}のかどを{左|ひだり}に{曲|ま}がります。",
            "ro": "Futatsume no kado o hidari ni magarimasu.",
            "vi": "Rẽ trái ở góc phố thứ hai."
          },
          {
            "text": "はしをわたって、{道|みち}をまっすぐ{行|い}ってください。",
            "ro": "Hashi o watatte, michi o massugu itte kudasai.",
            "vi": "Qua cầu rồi đi thẳng đường."
          },
          {
            "text": "えきから{歩|ある}いて{十分|じゅっぷん}です。",
            "ro": "Eki kara aruite juppun desu.",
            "vi": "Từ ga đi bộ mất 10 phút."
          },
          {
            "text": "ここに{座|すわ}ってもいいですか。",
            "ro": "Koko ni suwatte mo ii desu ka.",
            "vi": "Tôi ngồi đây được không?"
          },
          {
            "text": "バスのなかで{立|た}たないでください。{危|あぶ}ないです。",
            "ro": "Basu no naka de tatanaide kudasai. Abunai desu.",
            "vi": "Trong xe buýt đừng đứng lên. Nguy hiểm."
          },
          {
            "text": "ここですこし{待|ま}ってください。",
            "ro": "Koko de sukoshi matte kudasai.",
            "vi": "Hãy chờ ở đây một chút."
          },
          {
            "text": "ごみは{持|も}って{帰|かえ}ってください。",
            "ro": "Gomi wa motte kaette kudasai.",
            "vi": "Rác thì hãy mang về."
          },
          {
            "text": "えきの{近|ちか}くにぎんこうがあります。",
            "ro": "Eki no chikaku ni ginkou ga arimasu.",
            "vi": "Gần ga có ngân hàng."
          },
          {
            "text": "{大|おお}きい{橋|はし}が{見|み}えます。",
            "ro": "Ookii hashi ga miemasu.",
            "vi": "Nhìn thấy cây cầu lớn."
          },
          {
            "text": "この{道|みち}はくるまがおおいですから、{危|あぶ}ないです。",
            "ro": "Kono michi wa kuruma ga ooi desu kara, abunai desu.",
            "vi": "Đường này nhiều xe nên nguy hiểm."
          },
          {
            "text": "{道|みち}がわかりませんから、ともだちにでんわをかけます。",
            "ro": "Michi ga wakarimasen kara, tomodachi ni denwa o kakemasu.",
            "vi": "Vì không biết đường nên tôi gọi điện cho bạn."
          },
          {
            "text": "{右|みぎ}のしゃしんは{父|ちち}で、{左|ひだり}は{母|はは}です。",
            "ro": "Migi no shashin wa chichi de, hidari wa haha desu.",
            "vi": "Ảnh bên phải là bố, bên trái là mẹ."
          },
          {
            "text": "{近|ちか}いですから、{歩|ある}いて{行|い}きましょう。",
            "ro": "Chikai desu kara, aruite ikimashou.",
            "vi": "Gần nên đi bộ đi thôi."
          },
          {
            "text": "{子|こ}どもが{橋|はし}のうえに{立|た}っています。",
            "ro": "Kodomo ga hashi no ue ni tatte imasu.",
            "vi": "Một đứa trẻ đang đứng trên cầu."
          },
          {
            "text": "{母|はは}はいすに{座|すわ}って、{本|ほん}を{読|よ}んでいます。",
            "ro": "Haha wa isu ni suwatte, hon o yonde imasu.",
            "vi": "Mẹ đang ngồi trên ghế đọc sách."
          },
          {
            "text": "{今|いま}、{右|みぎ}にはしが{見|み}えます。",
            "ro": "Ima, migi ni hashi ga miemasu.",
            "vi": "Bây giờ bên phải nhìn thấy cây cầu."
          },
          {
            "text": "{何時|なんじ}まで{待|ま}ちますか。",
            "ro": "Nanji made machimasu ka.",
            "vi": "Chờ đến mấy giờ?"
          },
          {
            "text": "{兄|あに}は{大|おお}きいにもつを{持|も}っています。",
            "ro": "Ani wa ookii nimotsu o motte imasu.",
            "vi": "Anh tôi đang cầm hành lý lớn."
          },
          {
            "text": "{近|ちか}くにコンビニがありますか。",
            "ro": "Chikaku ni konbini ga arimasu ka.",
            "vi": "Gần đây có cửa hàng tiện lợi không?"
          },
          {
            "text": "{先生|せんせい}、すこし{休|やす}んでもいいですか。",
            "ro": "Sensei, sukoshi yasunde mo ii desu ka.",
            "vi": "Thưa cô, em nghỉ một chút được không ạ?"
          },
          {
            "text": "{右|みぎ}を{見|み}て、{左|ひだり}を{見|み}て、{道|みち}をわたります。",
            "ro": "Migi o mite, hidari o mite, michi o watarimasu.",
            "vi": "Nhìn bên phải, nhìn bên trái rồi mới băng qua đường."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b10-kj-doc-doan",
        "title": "Đọc to ĐOẠN văn ngắn không furigana (3 đoạn)",
        "items": [
          {
            "text": "えきをでて、{道|みち}をまっすぐ{歩|ある}いてください。{二|ふた}つ{目|め}のしんごうを{右|みぎ}に{曲|ま}がって、{橋|はし}をわたります。{橋|はし}の{近|ちか}くに{大|おお}きいビルが{見|み}えます。ビルの{前|まえ}で{待|ま}っています。",
            "ro": "Eki o dete, michi o massugu aruite kudasai. Futatsume no shingou o migi ni magatte, hashi o watarimasu. Hashi no chikaku ni ookii biru ga miemasu. Biru no mae de matte imasu.",
            "vi": "Ra khỏi ga, hãy đi bộ thẳng đường. Rẽ phải ở đèn giao thông thứ hai rồi qua cầu. Gần cầu nhìn thấy toà nhà lớn. Tôi đang chờ trước toà nhà."
          },
          {
            "text": "みなさん、バスのなかで{立|た}たないでください。{危|あぶ}ないです。{大|おお}きいにもつはうしろにおいてください。ごみは{持|も}って{帰|かえ}ってください。",
            "ro": "Minasan, basu no naka de tatanaide kudasai. Abunai desu. Ookii nimotsu wa ushiro ni oite kudasai. Gomi wa motte kaette kudasai.",
            "vi": "Mọi người, trong xe buýt xin đừng đứng lên. Nguy hiểm. Hành lý lớn hãy để ở phía sau. Rác thì hãy mang về."
          },
          {
            "text": "{日曜日|にちようび}、{母|はは}とどうぶつえんへ{行|い}きました。たくさん{歩|ある}きましたから、{足|あし}がいたくなりました。ベンチに{座|すわ}って、すこし{休|やす}みました。",
            "ro": "Nichiyoubi, haha to doubutsuen e ikimashita. Takusan arukimashita kara, ashi ga itaku narimashita. Benchi ni suwatte, sukoshi yasumimashita.",
            "vi": "Chủ nhật tôi đi sở thú với mẹ. Đi bộ nhiều nên đau chân. Tôi ngồi ghế dài nghỉ một chút."
          }
        ]
      },
      {
        "t": "write",
        "id": "lt-b10-kj-viet",
        "title": "Tập viết chữ Hán của lớp Bài 10 (12 chữ + 6 từ)",
        "chars": [
          "右",
          "左",
          "立",
          "座",
          "歩",
          "待",
          "持",
          "近",
          "道",
          "橋",
          "危",
          "曲",
          "右",
          "左",
          "散歩",
          "最近",
          "近く",
          "歩道橋"
        ],
        "goi": {
          "右": "みぎ · bên phải",
          "左": "ひだり · bên trái",
          "散歩": "さんぽ · đi dạo",
          "最近": "さいきん · gần đây",
          "近く": "ちかく · chỗ gần",
          "歩道橋": "ほどうきょう · cầu vượt cho người đi bộ"
        }
      }
    ]
  },
  {
    "id": "lt-b10-the-nai",
    "kind": "homework",
    "title": "Luyện thêm Bài 10 · Thể ない (ナイ形) — nhận nhóm → chia → bẫy い→わ, 来ない → gõ hàng loạt (~148 câu)",
    "goal": "Chia thể ない của mọi động từ đã học (thể ます → thể ない theo 3 nhóm), không mắc 4 bẫy (い → わ, 入る／帰る nhóm 1, 見る／起きる／借りる nhóm 2, 来ます → こない), và gắn được thể ない vào ～ないでください.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thể ない là **phủ định thể thường** (食べない = không ăn). Bài 10 dùng nó trong **～ないで ください** (xin đừng); từ Bài 11 trở đi còn gặp liên tục — học chắc bây giờ.",
          "Luôn đi từ **thể ます** đã thuộc, qua 3 bước: **① xác định nhóm → ② đổi âm → ③ thêm ない**. Đừng đoán theo \"nghe xuôi tai\".",
          "Làm theo thứ tự 🟢 → 🟡 → 🔴; phần gõ hàng loạt cứ sai là đọc to cặp \"ます → ない\" 3 lần (vd: すいます → すわない)."
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
            "âm trước ます (hàng い) → hàng **あ** + ない · riêng **い → わ**",
            "書きます → 書かない · 飲みます → 飲まない · 待ちます → 待たない · 遊びます → 遊ばない · 押します → 押さない · 入ります → 入らない · 吸います → 吸わない · 買います → 買わない"
          ],
          [
            "2",
            "bỏ ます + ない",
            "食べます → 食べない · 見ます → 見ない · 起きます → 起きない · 遅れます → 遅れない · 捨てます → 捨てない · 見えます → 見えない"
          ],
          [
            "3",
            "học thuộc",
            "します → しない · 来ます → **来ない (こない)** · 集合します → 集合しない · 持って来ます → 持って来ない"
          ],
          [
            "Đặc biệt",
            "あります → **ない**",
            "(không có ~~あらない~~)"
          ]
        ],
        "caption": "Bảng đổi thể ます → thể ない"
      },
      {
        "t": "recap",
        "title": "4 bẫy phải thuộc",
        "items": [
          "**い → わ** (không phải あ): 吸います → 吸**わ**ない · 買います → 買**わ**ない · 使います → 使**わ**ない · 言います → 言**わ**ない.",
          "**Nhóm 1 đội lốt nhóm 2**: 入ります → 入**ら**ない · 帰ります → 帰**ら**ない (KHÔNG phải ~~入ない~~, ~~帰ない~~).",
          "**Nhóm 2 có âm hàng い**: 見ます → 見ない · 起きます → 起きない · 借ります → 借りない · 降ります → 降りない (KHÔNG phải ~~借らない~~).",
          "**来ます → 来ない đọc こない** (chữ 来 đổi cách đọc き → こ)."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · nhận nhóm · chia từng nhóm"
      },
      {
        "t": "mcq",
        "id": "lt-b10-tn-nhom",
        "title": "Động từ này thuộc nhóm mấy? (19 câu)",
        "items": [
          {
            "q": "Động từ {曲|ま}がります 〔magarimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 3",
              "Nhóm 1"
            ],
            "correct": 2,
            "why": "{曲|ま}がります: âm trước ます ở hàng い, không thuộc danh sách nhóm 2 → **nhóm 1**."
          },
          {
            "q": "Động từ {降|お}ります 〔orimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 2,
            "why": "{降|お}ります là **nhóm 2** (bỏ ます + ない). Âm trước ます ở hàng い nhưng vẫn là nhóm 2 — nhóm \"đặc biệt\" phải thuộc."
          },
          {
            "q": "Động từ {疲|つか}れます 〔tsukaremasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 1",
              "Nhóm 2"
            ],
            "correct": 2,
            "why": "{疲|つか}れます là **nhóm 2** (bỏ ます + ない)."
          },
          {
            "q": "Động từ {座|すわ}ります 〔suwarimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 0,
            "why": "{座|すわ}ります: âm trước ます ở hàng い, không thuộc danh sách nhóm 2 → **nhóm 1**."
          },
          {
            "q": "Động từ {見|み}えます 〔miemasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 2,
            "why": "{見|み}えます là **nhóm 2** (bỏ ます + ない)."
          },
          {
            "q": "Động từ なります 〔narimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 0,
            "why": "なります: âm trước ます ở hàng い, không thuộc danh sách nhóm 2 → **nhóm 1**."
          },
          {
            "q": "Động từ {帰|かえ}ります 〔kaerimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 1",
              "Nhóm 3"
            ],
            "correct": 1,
            "why": "{帰|かえ}ります trông như nhóm 2 (đuôi ～ります, âm trước là i/e) nhưng là **nhóm 1** — phải học thuộc: thể ない {帰|かえ}らない."
          },
          {
            "q": "Động từ {来|き}ます 〔kimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 2",
              "Nhóm 1"
            ],
            "correct": 0,
            "why": "{来|き}ます là **nhóm 3** (する／来る, N + します)."
          },
          {
            "q": "Động từ {見|み}ます 〔mimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 1",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{見|み}ます là **nhóm 2** (bỏ ます + ない). Âm trước ます ở hàng い nhưng vẫn là nhóm 2 — nhóm \"đặc biệt\" phải thuộc."
          },
          {
            "q": "Động từ {持|も}って{来|き}ます 〔motte kimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 1",
              "Nhóm 3"
            ],
            "correct": 2,
            "why": "{持|も}って{来|き}ます là **nhóm 3** (する／来る, N + します)."
          },
          {
            "q": "Động từ {起|お}きます 〔okimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 3",
              "Nhóm 1"
            ],
            "correct": 0,
            "why": "{起|お}きます là **nhóm 2** (bỏ ます + ない). Âm trước ます ở hàng い nhưng vẫn là nhóm 2 — nhóm \"đặc biệt\" phải thuộc."
          },
          {
            "q": "Động từ {持|も}って{帰|かえ}ります 〔motte kaerimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 0,
            "why": "{持|も}って{帰|かえ}ります trông như nhóm 2 (đuôi ～ります, âm trước là i/e) nhưng là **nhóm 1** — phải học thuộc: thể ない {持|も}って{帰|かえ}らない."
          },
          {
            "q": "Động từ {借|か}ります 〔karimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 1",
              "Nhóm 3",
              "Nhóm 2"
            ],
            "correct": 2,
            "why": "{借|か}ります là **nhóm 2** (bỏ ます + ない). Âm trước ます ở hàng い nhưng vẫn là nhóm 2 — nhóm \"đặc biệt\" phải thuộc."
          },
          {
            "q": "Động từ {入|はい}ります 〔hairimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 2",
              "Nhóm 1"
            ],
            "correct": 2,
            "why": "{入|はい}ります trông như nhóm 2 (đuôi ～ります, âm trước là i/e) nhưng là **nhóm 1** — phải học thuộc: thể ない {入|はい}らない."
          },
          {
            "q": "Động từ {飛|と}びます 〔tobimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 3",
              "Nhóm 1"
            ],
            "correct": 2,
            "why": "{飛|と}びます: âm trước ます ở hàng い, không thuộc danh sách nhóm 2 → **nhóm 1**."
          },
          {
            "q": "Động từ {集合|しゅうごう}します 〔shuugou shimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 1",
              "Nhóm 2"
            ],
            "correct": 0,
            "why": "{集合|しゅうごう}します là **nhóm 3** (する／来る, N + します)."
          },
          {
            "q": "Động từ {吸|す}います 〔suimasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 3",
              "Nhóm 2",
              "Nhóm 1"
            ],
            "correct": 2,
            "why": "{吸|す}います: âm trước ます ở hàng い, không thuộc danh sách nhóm 2 → **nhóm 1**."
          },
          {
            "q": "Động từ {遅|おく}れます 〔okuremasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 1",
              "Nhóm 3"
            ],
            "correct": 0,
            "why": "{遅|おく}れます là **nhóm 2** (bỏ ます + ない)."
          },
          {
            "q": "Động từ {寝|ね}ます 〔nemasu〕 thuộc nhóm mấy?",
            "options": [
              "Nhóm 2",
              "Nhóm 3",
              "Nhóm 1"
            ],
            "correct": 0,
            "why": "{寝|ね}ます là **nhóm 2** (bỏ ます + ない)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tn-chia1",
        "title": "Chia thể ない — NHÓM 1 (18 câu)",
        "items": [
          {
            "q": "Thể ない của {言|い}います 〔iimasu〕 (nói) là gì?",
            "options": [
              "{言|い}あない",
              "{言|い}いない",
              "{言|い}うない",
              "{言|い}わない"
            ],
            "correct": 3,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない — riêng **い → わ**: {言|い}います → **{言|い}わない** 〔iwanai〕."
          },
          {
            "q": "Thể ない của {置|お}きます 〔okimasu〕 (đặt, để) là gì?",
            "options": [
              "{置|お}こない",
              "{置|お}くない",
              "{置|お}かない",
              "{置|お}きない"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {置|お}きます → **{置|お}かない** 〔okanai〕."
          },
          {
            "q": "Thể ない của {泳|およ}ぎます 〔oyogimasu〕 (bơi) là gì?",
            "options": [
              "{泳|およ}ごない",
              "{泳|およ}ぎない",
              "{泳|およ}ぐない",
              "{泳|およ}がない"
            ],
            "correct": 3,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {泳|およ}ぎます → **{泳|およ}がない** 〔oyoganai〕."
          },
          {
            "q": "Thể ない của {持|も}って{帰|かえ}ります 〔motte kaerimasu〕 (mang về) là gì?",
            "options": [
              "{持|も}って{帰|かえ}るない",
              "{持|も}って{帰|かえ}りない",
              "{持|も}って{帰|かえ}らない",
              "{持|も}って{帰|かえ}ろない"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {持|も}って{帰|かえ}ります → **{持|も}って{帰|かえ}らない** 〔motte kaeranai〕."
          },
          {
            "q": "Thể ない của {乗|の}ります 〔norimasu〕 (lên (xe)) là gì?",
            "options": [
              "{乗|の}りない",
              "{乗|の}るない",
              "{乗|の}ろない",
              "{乗|の}らない"
            ],
            "correct": 3,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {乗|の}ります → **{乗|の}らない** 〔noranai〕."
          },
          {
            "q": "Thể ない của {書|か}きます 〔kakimasu〕 (viết) là gì?",
            "options": [
              "{書|か}こない",
              "{書|か}くない",
              "{書|か}かない",
              "{書|か}きない"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {書|か}きます → **{書|か}かない** 〔kakanai〕."
          },
          {
            "q": "Thể ない của なくします 〔nakushimasu〕 (làm mất) là gì?",
            "options": [
              "なくしない",
              "なくすない",
              "なくさない",
              "なくそない"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: なくします → **なくさない** 〔nakusanai〕."
          },
          {
            "q": "Thể ない của {押|お}します 〔oshimasu〕 (đẩy, ấn) là gì?",
            "options": [
              "{押|お}すない",
              "{押|お}そない",
              "{押|お}しない",
              "{押|お}さない"
            ],
            "correct": 3,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {押|お}します → **{押|お}さない** 〔osanai〕."
          },
          {
            "q": "Thể ない của {渡|わた}ります 〔watarimasu〕 (băng qua) là gì?",
            "options": [
              "{渡|わた}りない",
              "{渡|わた}ろない",
              "{渡|わた}るない",
              "{渡|わた}らない"
            ],
            "correct": 3,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {渡|わた}ります → **{渡|わた}らない** 〔wataranai〕."
          },
          {
            "q": "Thể ない của やります 〔yarimasu〕 (cho (thú) ăn) là gì?",
            "options": [
              "やらない",
              "やりない",
              "やるない",
              "やろない"
            ],
            "correct": 0,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: やります → **やらない** 〔yaranai〕."
          },
          {
            "q": "Thể ない của {入|はい}ります 〔hairimasu〕 (vào) là gì?",
            "options": [
              "{入|はい}るない",
              "{入|はい}らない",
              "{入|はい}りない",
              "{入|はい}ろない"
            ],
            "correct": 1,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {入|はい}ります → **{入|はい}らない** 〔hairanai〕."
          },
          {
            "q": "Thể ない của {探|さが}します 〔sagashimasu〕 (tìm) là gì?",
            "options": [
              "{探|さが}さない",
              "{探|さが}そない",
              "{探|さが}しない",
              "{探|さが}すない"
            ],
            "correct": 0,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {探|さが}します → **{探|さが}さない** 〔sagasanai〕."
          },
          {
            "q": "Thể ない của {話|はな}します 〔hanashimasu〕 (nói chuyện) là gì?",
            "options": [
              "{話|はな}しない",
              "{話|はな}すない",
              "{話|はな}さない",
              "{話|はな}そない"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {話|はな}します → **{話|はな}さない** 〔hanasanai〕."
          },
          {
            "q": "Thể ない của {待|ま}ちます 〔machimasu〕 (chờ) là gì?",
            "options": [
              "{待|ま}つない",
              "{待|ま}たない",
              "{待|ま}ちない",
              "{待|ま}とない"
            ],
            "correct": 1,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {待|ま}ちます → **{待|ま}たない** 〔matanai〕."
          },
          {
            "q": "Thể ない của {使|つか}います 〔tsukaimasu〕 (dùng) là gì?",
            "options": [
              "{使|つか}わない",
              "{使|つか}うない",
              "{使|つか}あない",
              "{使|つか}いない"
            ],
            "correct": 0,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない — riêng **い → わ**: {使|つか}います → **{使|つか}わない** 〔tsukawanai〕."
          },
          {
            "q": "Thể ない của {買|か}います 〔kaimasu〕 (mua) là gì?",
            "options": [
              "{買|か}あない",
              "{買|か}うない",
              "{買|か}わない",
              "{買|か}いない"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない — riêng **い → わ**: {買|か}います → **{買|か}わない** 〔kawanai〕."
          },
          {
            "q": "Thể ない của {休|やす}みます 〔yasumimasu〕 (nghỉ) là gì?",
            "options": [
              "{休|やす}むない",
              "{休|やす}みない",
              "{休|やす}まない",
              "{休|やす}もない"
            ],
            "correct": 2,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {休|やす}みます → **{休|やす}まない** 〔yasumanai〕."
          },
          {
            "q": "Thể ない của {撮|と}ります 〔torimasu〕 (chụp) là gì?",
            "options": [
              "{撮|と}るない",
              "{撮|と}りない",
              "{撮|と}ろない",
              "{撮|と}らない"
            ],
            "correct": 3,
            "why": "**Nhóm 1**: âm trước ます (hàng い) → hàng **あ** + ない: {撮|と}ります → **{撮|と}らない** 〔toranai〕."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tn-chia2",
        "title": "Chia thể ない — NHÓM 2 (10 câu)",
        "items": [
          {
            "q": "Thể ない của {教|おし}えます 〔oshiemasu〕 (dạy, chỉ) là gì?",
            "options": [
              "{教|おし}えらない",
              "{教|おし}あない",
              "{教|おし}えません",
              "{教|おし}えない"
            ],
            "correct": 3,
            "why": "**Nhóm 2**: bỏ ます + ない: {教|おし}えます → **{教|おし}えない** 〔oshienai〕."
          },
          {
            "q": "Thể ない của {見|み}ます 〔mimasu〕 (xem) là gì?",
            "options": [
              "{見|み}らない",
              "{見|み}ない",
              "{見|み}ません",
              "{見|み}かない"
            ],
            "correct": 1,
            "why": "**Nhóm 2**: bỏ ます + ない: {見|み}ます → **{見|み}ない** 〔minai〕."
          },
          {
            "q": "Thể ない của {食|た}べます 〔tabemasu〕 (ăn) là gì?",
            "options": [
              "{食|た}べません",
              "{食|た}ばない",
              "{食|た}べらない",
              "{食|た}べない"
            ],
            "correct": 3,
            "why": "**Nhóm 2**: bỏ ます + ない: {食|た}べます → **{食|た}べない** 〔tabenai〕."
          },
          {
            "q": "Thể ない của {寝|ね}ます 〔nemasu〕 (ngủ) là gì?",
            "options": [
              "{寝|ね}らない",
              "{寝|ね}ません",
              "{寝|ね}ない",
              "{寝|ね}かない"
            ],
            "correct": 2,
            "why": "**Nhóm 2**: bỏ ます + ない: {寝|ね}ます → **{寝|ね}ない** 〔nenai〕."
          },
          {
            "q": "Thể ない của {閉|し}めます 〔shimemasu〕 (đóng) là gì?",
            "options": [
              "{閉|し}めない",
              "{閉|し}めらない",
              "{閉|し}めません",
              "{閉|し}まない"
            ],
            "correct": 0,
            "why": "**Nhóm 2**: bỏ ます + ない: {閉|し}めます → **{閉|し}めない** 〔shimenai〕."
          },
          {
            "q": "Thể ない của {遅|おく}れます 〔okuremasu〕 (trễ) là gì?",
            "options": [
              "{遅|おく}れない",
              "{遅|おく}れらない",
              "{遅|おく}らない",
              "{遅|おく}れません"
            ],
            "correct": 0,
            "why": "**Nhóm 2**: bỏ ます + ない: {遅|おく}れます → **{遅|おく}れない** 〔okurenai〕."
          },
          {
            "q": "Thể ない của {開|あ}けます 〔akemasu〕 (mở) là gì?",
            "options": [
              "{開|あ}けらない",
              "{開|あ}かない",
              "{開|あ}けません",
              "{開|あ}けない"
            ],
            "correct": 3,
            "why": "**Nhóm 2**: bỏ ます + ない: {開|あ}けます → **{開|あ}けない** 〔akenai〕."
          },
          {
            "q": "Thể ない của {起|お}きます 〔okimasu〕 (thức dậy) là gì?",
            "options": [
              "{起|お}きらない",
              "{起|お}きません",
              "{起|お}かない",
              "{起|お}きない"
            ],
            "correct": 3,
            "why": "**Nhóm 2**: bỏ ます + ない: {起|お}きます → **{起|お}きない** 〔okinai〕."
          },
          {
            "q": "Thể ない của {疲|つか}れます 〔tsukaremasu〕 (mệt) là gì?",
            "options": [
              "{疲|つか}れません",
              "{疲|つか}らない",
              "{疲|つか}れない",
              "{疲|つか}れらない"
            ],
            "correct": 2,
            "why": "**Nhóm 2**: bỏ ます + ない: {疲|つか}れます → **{疲|つか}れない** 〔tsukarenai〕."
          },
          {
            "q": "Thể ない của {降|お}ります 〔orimasu〕 (xuống (xe)) là gì?",
            "options": [
              "{降|お}らない",
              "{降|お}りらない",
              "{降|お}りない",
              "{降|お}りません"
            ],
            "correct": 2,
            "why": "**Nhóm 2**: bỏ ます + ない: {降|お}ります → **{降|お}りない** 〔orinai〕."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tn-chia3",
        "title": "Chia thể ない — NHÓM 3 (7 câu)",
        "items": [
          {
            "q": "Thể ない của します 〔shimasu〕 là gì?",
            "options": [
              "さない",
              "しません",
              "すない",
              "しない"
            ],
            "correct": 3,
            "why": "**Nhóm 3** học thuộc: します → しない · 来ます → 来ない (こない): します → **しない**."
          },
          {
            "q": "Thể ない của {来|き}ます 〔kimasu〕 là gì?",
            "options": [
              "{来|か}ない",
              "{来|こ}ない",
              "{来|く}ない",
              "{来|き}ない"
            ],
            "correct": 1,
            "why": "**来ます → 来ない**, chữ 来 đọc **こ**: こない (konai). ~~きない~~ là lỗi rất hay gặp."
          },
          {
            "q": "Thể ない của {集合|しゅうごう}します 〔shuugou shimasu〕 là gì?",
            "options": [
              "{集合|しゅうごう}すない",
              "{集合|しゅうごう}しない",
              "{集合|しゅうごう}こない",
              "{集合|しゅうごう}さない"
            ],
            "correct": 1,
            "why": "N + します → N + **しない**."
          },
          {
            "q": "Thể ない của {持|も}って{来|き}ます 〔motte kimasu〕 là gì?",
            "options": [
              "{持|も}って{来|き}ない",
              "{持|も}たない",
              "{持|も}って{来|く}ない",
              "{持|も}って{来|こ}ない"
            ],
            "correct": 3,
            "why": "持って来ます chia theo **来ます**: 持って来ない (もってこない)."
          },
          {
            "q": "Thể ない của {電話|でんわ}します 〔denwa shimasu〕 là gì?",
            "options": [
              "{電話|でんわ}しない",
              "{電話|でんわ}しません",
              "{電話|でんわ}さない",
              "{電話|でんわ}しらない"
            ],
            "correct": 0,
            "why": "N + します → **しない**."
          },
          {
            "q": "Thể ない của {運転|うんてん}します 〔unten shimasu〕 là gì?",
            "options": [
              "{運転|うんてん}さない",
              "{運転|うんてん}しなく",
              "{運転|うんてん}しない",
              "{運転|うんてん}すない"
            ],
            "correct": 2,
            "why": "N + します → **しない**."
          },
          {
            "q": "Thể ない của あります 〔arimasu〕 là gì?",
            "options": [
              "ありない",
              "あらない",
              "ない",
              "あない"
            ],
            "correct": 2,
            "why": "**あります → ない** (đặc biệt, không có ~~あらない~~)."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · gõ hàng loạt · đổi ngược · bẫy trong câu"
      },
      {
        "t": "quiz",
        "id": "lt-b10-tn-go",
        "title": "Gõ thể ない (54 câu)",
        "kind": "fill",
        "grammar": "Nhóm 1: hàng い → hàng あ (い→わ) + ない · Nhóm 2: bỏ ます + ない · Nhóm 3: しない／こない",
        "items": [
          {
            "q": "{探|さが}します 〔sagashimasu〕 (tìm) → ＿＿",
            "answers": [
              "探さない",
              "さがさない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{飲|の}みます 〔nomimasu〕 (uống) → ＿＿",
            "answers": [
              "飲まない",
              "のまない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{曲|ま}がります 〔magarimasu〕 (rẽ) → ＿＿",
            "answers": [
              "曲がらない",
              "まがらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{渡|わた}ります 〔watarimasu〕 (băng qua) → ＿＿",
            "answers": [
              "渡らない",
              "わたらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{押|お}します 〔oshimasu〕 (đẩy, ấn) → ＿＿",
            "answers": [
              "押さない",
              "おさない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{座|すわ}ります 〔suwarimasu〕 (ngồi) → ＿＿",
            "answers": [
              "座らない",
              "すわらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{立|た}ちます 〔tachimasu〕 (đứng) → ＿＿",
            "answers": [
              "立たない",
              "たたない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "なくします 〔nakushimasu〕 (làm mất) → ＿＿",
            "answers": [
              "なくさない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{入|はい}ります 〔hairimasu〕 (vào) → ＿＿",
            "answers": [
              "入らない",
              "はいらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{持|も}って{帰|かえ}ります 〔motte kaerimasu〕 (mang về) → ＿＿",
            "answers": [
              "持って帰らない",
              "持ってかえらない",
              "もって帰らない",
              "もってかえらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{歩|ある}きます 〔arukimasu〕 (đi bộ) → ＿＿",
            "answers": [
              "歩かない",
              "あるかない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{飛|と}びます 〔tobimasu〕 (bay) → ＿＿",
            "answers": [
              "飛ばない",
              "とばない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "なります 〔narimasu〕 (trở nên) → ＿＿",
            "answers": [
              "ならない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{休|やす}みます 〔yasumimasu〕 (nghỉ) → ＿＿",
            "answers": [
              "休まない",
              "やすまない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "やります 〔yarimasu〕 (cho (thú) ăn) → ＿＿",
            "answers": [
              "やらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{吸|す}います 〔suimasu〕 (hút (thuốc)) → ＿＿",
            "answers": [
              "吸わない",
              "すわない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{撮|と}ります 〔torimasu〕 (chụp) → ＿＿",
            "answers": [
              "撮らない",
              "とらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{置|お}きます 〔okimasu〕 (đặt, để) → ＿＿",
            "answers": [
              "置かない",
              "おかない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{書|か}きます 〔kakimasu〕 (viết) → ＿＿",
            "answers": [
              "書かない",
              "かかない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{泳|およ}ぎます 〔oyogimasu〕 (bơi) → ＿＿",
            "answers": [
              "泳がない",
              "およがない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{話|はな}します 〔hanashimasu〕 (nói chuyện) → ＿＿",
            "answers": [
              "話さない",
              "はなさない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{待|ま}ちます 〔machimasu〕 (chờ) → ＿＿",
            "answers": [
              "待たない",
              "またない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{遊|あそ}びます 〔asobimasu〕 (chơi) → ＿＿",
            "answers": [
              "遊ばない",
              "あそばない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{帰|かえ}ります 〔kaerimasu〕 (về) → ＿＿",
            "answers": [
              "帰らない",
              "かえらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{使|つか}います 〔tsukaimasu〕 (dùng) → ＿＿",
            "answers": [
              "使わない",
              "つかわない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{行|い}きます 〔ikimasu〕 (đi) → ＿＿",
            "answers": [
              "行かない",
              "いかない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{買|か}います 〔kaimasu〕 (mua) → ＿＿",
            "answers": [
              "買わない",
              "かわない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{言|い}います 〔iimasu〕 (nói) → ＿＿",
            "answers": [
              "言わない",
              "いわない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{乗|の}ります 〔norimasu〕 (lên (xe)) → ＿＿",
            "answers": [
              "乗らない",
              "のらない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{持|も}ちます 〔mochimasu〕 (cầm, mang) → ＿＿",
            "answers": [
              "持たない",
              "もたない"
            ],
            "hint": "Nhóm 1"
          },
          {
            "q": "{見|み}えます 〔miemasu〕 (nhìn thấy) → ＿＿",
            "answers": [
              "見えない",
              "みえない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{聞|き}こえます 〔kikoemasu〕 (nghe thấy) → ＿＿",
            "answers": [
              "聞こえない",
              "きこえない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{遅|おく}れます 〔okuremasu〕 (trễ) → ＿＿",
            "answers": [
              "遅れない",
              "おくれない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{捨|す}てます 〔sutemasu〕 (vứt) → ＿＿",
            "answers": [
              "捨てない",
              "すてない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{疲|つか}れます 〔tsukaremasu〕 (mệt) → ＿＿",
            "answers": [
              "疲れない",
              "つかれない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{開|あ}けます 〔akemasu〕 (mở) → ＿＿",
            "answers": [
              "開けない",
              "あけない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{閉|し}めます 〔shimemasu〕 (đóng) → ＿＿",
            "answers": [
              "閉めない",
              "しめない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{食|た}べます 〔tabemasu〕 (ăn) → ＿＿",
            "answers": [
              "食べない",
              "たべない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{見|み}ます 〔mimasu〕 (xem) → ＿＿",
            "answers": [
              "見ない",
              "みない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{起|お}きます 〔okimasu〕 (thức dậy) → ＿＿",
            "answers": [
              "起きない",
              "おきない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{寝|ね}ます 〔nemasu〕 (ngủ) → ＿＿",
            "answers": [
              "寝ない",
              "ねない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{降|お}ります 〔orimasu〕 (xuống (xe)) → ＿＿",
            "answers": [
              "降りない",
              "おりない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{借|か}ります 〔karimasu〕 (mượn) → ＿＿",
            "answers": [
              "借りない",
              "かりない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{教|おし}えます 〔oshiemasu〕 (dạy, chỉ) → ＿＿",
            "answers": [
              "教えない",
              "おしえない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{見|み}せます 〔misemasu〕 (cho xem) → ＿＿",
            "answers": [
              "見せない",
              "みせない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "{集|あつ}めます 〔atsumemasu〕 (sưu tầm) → ＿＿",
            "answers": [
              "集めない",
              "あつめない"
            ],
            "hint": "Nhóm 2"
          },
          {
            "q": "します 〔shimasu〕 (làm) → ＿＿",
            "answers": [
              "しない"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{来|き}ます 〔kimasu〕 (đến) → ＿＿",
            "answers": [
              "来ない",
              "こない"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{集合|しゅうごう}します 〔shuugou shimasu〕 (tập hợp) → ＿＿",
            "answers": [
              "集合しない",
              "しゅうごうしない"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{運転|うんてん}します 〔unten shimasu〕 (lái xe) → ＿＿",
            "answers": [
              "運転しない",
              "うんてんしない"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{予約|よやく}します 〔yoyaku shimasu〕 (đặt trước) → ＿＿",
            "answers": [
              "予約しない",
              "よやくしない"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{電話|でんわ}します 〔denwa shimasu〕 (gọi điện) → ＿＿",
            "answers": [
              "電話しない",
              "でんわしない"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{持|も}って{来|き}ます 〔motte kimasu〕 (mang đến) → ＿＿",
            "answers": [
              "持って来ない",
              "持ってこない",
              "もって来ない",
              "もってこない"
            ],
            "hint": "Nhóm 3"
          },
          {
            "q": "{勉強|べんきょう}します 〔benkyou shimasu〕 (học) → ＿＿",
            "answers": [
              "勉強しない",
              "べんきょうしない"
            ],
            "hint": "Nhóm 3"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tn-nguoc",
        "title": "Đổi ngược: thể ない → thể ます (10 câu)",
        "items": [
          {
            "q": "{吸|す}わない 〔suwanai〕 là thể ない của động từ nào?",
            "options": [
              "{吸|す}あります",
              "{吸|す}わります",
              "{吸|す}みます",
              "{吸|す}います"
            ],
            "correct": 3,
            "why": "わ ← い: 吸わない ← **吸います**."
          },
          {
            "q": "{入|はい}らない 〔hairanai〕 là thể ない của động từ nào?",
            "options": [
              "{入|はい}らます",
              "{入|はい}ります",
              "{入|はい}れます",
              "{入|はい}ます"
            ],
            "correct": 1,
            "why": "ら ← り: 入らない ← **入ります** (nhóm 1)."
          },
          {
            "q": "{待|ま}たない 〔matanai〕 là thể ない của động từ nào?",
            "options": [
              "{待|ま}ります",
              "{待|ま}ちます",
              "{待|ま}たます",
              "{待|ま}てます"
            ],
            "correct": 1,
            "why": "た ← ち: 待たない ← **待ちます**."
          },
          {
            "q": "{来|こ}ない 〔konai〕 là thể ない của động từ nào?",
            "options": [
              "{来|く}ります",
              "{来|き}ます",
              "{来|こ}ます",
              "こります"
            ],
            "correct": 1,
            "why": "来ない (こない) ← **来ます** (nhóm 3)."
          },
          {
            "q": "{遅|おく}れない 〔okurenai〕 là thể ない của động từ nào?",
            "options": [
              "{遅|おく}れります",
              "{遅|おく}らます",
              "{遅|おく}ります",
              "{遅|おく}れます"
            ],
            "correct": 3,
            "why": "Nhóm 2: 遅れ + ない ← **遅れます**."
          },
          {
            "q": "{飛|と}ばない 〔tobanai〕 là thể ない của động từ nào?",
            "options": [
              "{飛|と}ばます",
              "{飛|と}びます",
              "{飛|と}ります",
              "{飛|と}べます"
            ],
            "correct": 1,
            "why": "ば ← び: 飛ばない ← **飛びます**."
          },
          {
            "q": "{借|か}りない 〔karinai〕 là thể ない của động từ nào?",
            "options": [
              "{借|か}ります (nhóm 2)",
              "{借|か}れます",
              "{借|か}らます",
              "{借|か}ります (nhóm 1)"
            ],
            "correct": 0,
            "why": "借りない (bỏ ます + ない) ← 借ります là **nhóm 2**."
          },
          {
            "q": "なくさない 〔nakusanai〕 là thể ない của động từ nào?",
            "options": [
              "なくります",
              "なくします",
              "なくさます",
              "なくせます"
            ],
            "correct": 1,
            "why": "さ ← し: なくさない ← **なくします**."
          },
          {
            "q": "{休|やす}まない 〔yasumanai〕 là thể ない của động từ nào?",
            "options": [
              "{休|やす}めます",
              "{休|やす}ます",
              "{休|やす}みます",
              "{休|やす}まります"
            ],
            "correct": 2,
            "why": "ま ← み: 休まない ← **休みます**."
          },
          {
            "q": "{見|み}えない 〔mienai〕 là thể ない của động từ nào?",
            "options": [
              "{見|み}ます",
              "{見|み}えます",
              "{見|み}えります",
              "{見|み}あります"
            ],
            "correct": 1,
            "why": "Nhóm 2: 見え + ない ← **見えます** (khác 見ない ← 見ます)."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-tn-bay",
        "title": "Bẫy trong câu — chọn câu ĐÚNG (10 câu)",
        "items": [
          {
            "q": "Câu nào ĐÚNG? (hút thuốc)",
            "options": [
              "ここでたばこを{吸|す}まないでください。 (Koko de tabako o sumanaide kudasai.)",
              "ここでたばこを{吸|す}あないでください。 (Koko de tabako o suanaide kudasai.)",
              "ここでたばこを{吸|す}いないでください。 (Koko de tabako o suinaide kudasai.)",
              "ここでたばこを{吸|す}わないでください。 (Koko de tabako o suwanaide kudasai.)"
            ],
            "correct": 3,
            "why": "吸います: い → **わ** → 吸わないで."
          },
          {
            "q": "Câu nào ĐÚNG? (vào)",
            "options": [
              "{芝生|しばふ}に{入|はい}ないでください。 (Shibafu ni hainaide kudasai.)",
              "{芝生|しばふ}に{入|はい}れないでください。 (Shibafu ni hairenaide kudasai.)",
              "{芝生|しばふ}に{入|はい}りないでください。 (Shibafu ni hairinaide kudasai.)",
              "{芝生|しばふ}に{入|はい}らないでください。 (Shibafu ni hairanaide kudasai.)"
            ],
            "correct": 3,
            "why": "入ります là **nhóm 1** → 入らない."
          },
          {
            "q": "Câu nào ĐÚNG? (đến)",
            "options": [
              "{明日|あした}は{来|く}ないでください。 (Ashita wa kunaide kudasai.)",
              "{明日|あした}は{来|き}ませんでください。 (Ashita wa kimasende kudasai.)",
              "{明日|あした}は{来|き}ないでください。 (Ashita wa kinaide kudasai.)",
              "{明日|あした}は{来|こ}ないでください。 (Ashita wa konaide kudasai.)"
            ],
            "correct": 3,
            "why": "来ます → **来ない (こない)**."
          },
          {
            "q": "Câu nào ĐÚNG? (mượn)",
            "options": [
              "この{本|ほん}を{借|か}れないでください。 (Kono hon o karenaide kudasai.)",
              "この{本|ほん}を{借|か}らないでください。 (Kono hon o karanaide kudasai.)",
              "この{本|ほん}を{借|か}りらないでください。 (Kono hon o kariranaide kudasai.)",
              "この{本|ほん}を{借|か}りないでください。 (Kono hon o karinaide kudasai.)"
            ],
            "correct": 3,
            "why": "借ります là **nhóm 2** → 借りない."
          },
          {
            "q": "Câu nào ĐÚNG? (đứng)",
            "options": [
              "バスの{中|なか}で{立|た}てないでください。 (Basu no naka de tatenaide kudasai.)",
              "バスの{中|なか}で{立|た}ちないでください。 (Basu no naka de tachinaide kudasai.)",
              "バスの{中|なか}で{立|た}たないでください。 (Basu no naka de tatanaide kudasai.)",
              "バスの{中|なか}で{立|た}つないでください。 (Basu no naka de tatsunaide kudasai.)"
            ],
            "correct": 2,
            "why": "立ちます: ち → **た** → 立たない."
          },
          {
            "q": "Câu nào ĐÚNG? (dậy muộn — nhắc bạn)",
            "options": [
              "{明日|あした}は{遅|おそ}く{起|お}きないでください。 (Ashita wa osoku okinaide kudasai.)",
              "{明日|あした}は{遅|おそ}く{起|お}きらないでください。 (Ashita wa osoku okiranaide kudasai.)",
              "{明日|あした}は{遅|おそ}く{起|お}けないでください。 (Ashita wa osoku okenaide kudasai.)",
              "{明日|あした}は{遅|おそ}く{起|お}かないでください。 (Ashita wa osoku okanaide kudasai.)"
            ],
            "correct": 0,
            "why": "起きます là **nhóm 2** → 起きない."
          },
          {
            "q": "Câu nào ĐÚNG? (về)",
            "options": [
              "まだ{帰|かえ}ないでください。 (Mada kaenaide kudasai.)",
              "まだ{帰|かえ}りないでください。 (Mada kaerinaide kudasai.)",
              "まだ{帰|かえ}れないでください。 (Mada kaerenaide kudasai.)",
              "まだ{帰|かえ}らないでください。 (Mada kaeranaide kudasai.)"
            ],
            "correct": 3,
            "why": "帰ります là **nhóm 1** → 帰らない."
          },
          {
            "q": "Câu nào ĐÚNG? (vứt)",
            "options": [
              "ここにごみを{捨|す}たないでください。 (Koko ni gomi o sutanaide kudasai.)",
              "ここにごみを{捨|す}てないでください。 (Koko ni gomi o sutenaide kudasai.)",
              "ここにごみを{捨|す}てらないでください。 (Koko ni gomi o suteranaide kudasai.)",
              "ここにごみを{捨|す}ちないでください。 (Koko ni gomi o suchinaide kudasai.)"
            ],
            "correct": 1,
            "why": "捨てます là **nhóm 2** → 捨てない."
          },
          {
            "q": "Câu nào ĐÚNG? (dùng)",
            "options": [
              "ここでパソコンを{使|つか}わないでください。 (Koko de pasokon o tsukawanaide kudasai.)",
              "ここでパソコンを{使|つか}いないでください。 (Koko de pasokon o tsukainaide kudasai.)",
              "ここでパソコンを{使|つか}かないでください。 (Koko de pasokon o tsukakanaide kudasai.)",
              "ここでパソコンを{使|つか}あないでください。 (Koko de pasokon o tsukaanaide kudasai.)"
            ],
            "correct": 0,
            "why": "使います: い → **わ** → 使わない."
          },
          {
            "q": "Câu nào ĐÚNG? (nói chuyện)",
            "options": [
              "{大|おお}きい{声|こえ}で{話|はな}すないでください。 (Ookii koe de hanasunaide kudasai.)",
              "{大|おお}きい{声|こえ}で{話|はな}そないでください。 (Ookii koe de hanasonaide kudasai.)",
              "{大|おお}きい{声|こえ}で{話|はな}さないでください。 (Ookii koe de hanasanaide kudasai.)",
              "{大|おお}きい{声|こえ}で{話|はな}しないでください。 (Ookii koe de hanashinaide kudasai.)"
            ],
            "correct": 2,
            "why": "話します: し → **さ** → 話さない (đừng nhầm với nhóm 3 する)."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · gõ thể ない ngay trong câu · ghép câu"
      },
      {
        "t": "quiz",
        "id": "lt-b10-tn-cau",
        "title": "Gõ thể ない của động từ trong gợi ý (14 câu)",
        "kind": "fill",
        "grammar": "Vない + で ください = xin đừng V",
        "items": [
          {
            "q": "{写真|しゃしん}を＿＿でください。　〔Shashin o __ de kudasai.〕",
            "answers": [
              "撮らない",
              "とらない"
            ],
            "hint": "とります (chụp)"
          },
          {
            "q": "{窓|まど}を＿＿でください。{寒|さむ}いです。　〔Mado o __ de kudasai. Samui desu.〕",
            "answers": [
              "開けない",
              "あけない"
            ],
            "hint": "あけます (mở)"
          },
          {
            "q": "{前|まえ}の{人|ひと}を＿＿でください。　〔Mae no hito o __ de kudasai.〕",
            "answers": [
              "押さない",
              "おさない"
            ],
            "hint": "おします (đẩy)"
          },
          {
            "q": "{集合|しゅうごう}{時間|じかん}に＿＿でください。　〔Shuugou jikan ni __ de kudasai.〕",
            "answers": [
              "遅れない",
              "おくれない"
            ],
            "hint": "おくれます (trễ)"
          },
          {
            "q": "このチケットを＿＿でください。　〔Kono chiketto o __ de kudasai.〕",
            "answers": [
              "なくさない"
            ],
            "hint": "なくします (làm mất)"
          },
          {
            "q": "ここでたばこを＿＿でください。　〔Koko de tabako o __ de kudasai.〕",
            "answers": [
              "吸わない",
              "すわない"
            ],
            "hint": "すいます (hút) — bẫy い→わ"
          },
          {
            "q": "{動物|どうぶつ}にえさを＿＿でください。　〔Doubutsu ni esa o __ de kudasai.〕",
            "answers": [
              "やらない"
            ],
            "hint": "やります (cho ăn)"
          },
          {
            "q": "{道|みち}で＿＿でください。{危|あぶ}ないです。　〔Michi de __ de kudasai. Abunai desu.〕",
            "answers": [
              "遊ばない",
              "あそばない"
            ],
            "hint": "あそびます (chơi)"
          },
          {
            "q": "{芝生|しばふ}に＿＿でください。　〔Shibafu ni __ de kudasai.〕",
            "answers": [
              "入らない",
              "はいらない"
            ],
            "hint": "はいります (vào) — nhóm 1"
          },
          {
            "q": "{明日|あした}は{学校|がっこう}へ＿＿でください。{休|やす}みです。　〔Ashita wa gakkou e __ de kudasai. Yasumi desu.〕",
            "answers": [
              "来ない",
              "こない"
            ],
            "hint": "きます (đến) — nhóm 3"
          },
          {
            "q": "バスの{中|なか}で＿＿でください。　〔Basu no naka de __ de kudasai.〕",
            "answers": [
              "立たない",
              "たたない"
            ],
            "hint": "たちます (đứng)"
          },
          {
            "q": "{薬|くすり}を{飲|の}みましたから、{車|くるま}を＿＿でください。　〔Kusuri o nomimashita kara, kuruma o __ de kudasai.〕",
            "answers": [
              "運転しない",
              "うんてんしない"
            ],
            "hint": "うんてんします (lái xe)"
          },
          {
            "q": "{夜|よる}、{遅|おそ}くまでテレビを＿＿でください。　〔Yoru, osoku made terebi o __ de kudasai.〕",
            "answers": [
              "見ない",
              "みない"
            ],
            "hint": "みます (xem) — nhóm 2"
          },
          {
            "q": "{大切|たいせつ}な{写真|しゃしん}ですから、{他|ほか}の{人|ひと}に＿＿でください。　〔Taisetsu na shashin desu kara, hoka no hito ni __ de kudasai.〕",
            "answers": [
              "見せない",
              "みせない"
            ],
            "hint": "みせます (cho xem) — nhóm 2"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-tn-ghep",
        "title": "Ghép câu với thể ない (6 câu)",
        "items": [
          {
            "vi": "Xin đừng chụp ảnh ở đây.",
            "chips": [
              "{撮|と}りないで",
              "ください",
              "ここで",
              "{撮|と}らないで",
              "{写真|しゃしん}を"
            ],
            "answer": [
              "ここで",
              "{写真|しゃしん}を",
              "{撮|と}らないで",
              "ください"
            ],
            "ro": "Koko de shashin o toranaide kudasai"
          },
          {
            "vi": "Xin đừng hút thuốc.",
            "chips": [
              "たばこを",
              "{吸|す}あないで",
              "ください",
              "{吸|す}わないで"
            ],
            "answer": [
              "たばこを",
              "{吸|す}わないで",
              "ください"
            ],
            "ro": "Tabako o suwanaide kudasai"
          },
          {
            "vi": "Xin đừng vào phòng này.",
            "chips": [
              "この{部屋|へや}に",
              "{入|はい}らないで",
              "ください",
              "{入|はい}ないで"
            ],
            "answer": [
              "この{部屋|へや}に",
              "{入|はい}らないで",
              "ください"
            ],
            "ro": "Kono heya ni hairanaide kudasai"
          },
          {
            "vi": "Ngày mai xin đừng đến trễ.",
            "chips": [
              "{明日|あした}は",
              "ください",
              "{遅|おく}れないで",
              "{遅|おく}らないで"
            ],
            "answer": [
              "{明日|あした}は",
              "{遅|おく}れないで",
              "ください"
            ],
            "ro": "Ashita wa okurenaide kudasai"
          },
          {
            "vi": "Xin đừng mang đồ ăn vào.",
            "chips": [
              "ください",
              "{食|た}べ{物|もの}を",
              "{持|も}って{来|こ}ないで",
              "{持|も}って{来|き}ないで"
            ],
            "answer": [
              "{食|た}べ{物|もの}を",
              "{持|も}って{来|こ}ないで",
              "ください"
            ],
            "ro": "Tabemono o motte konaide kudasai"
          },
          {
            "vi": "Nguy hiểm nên đừng đẩy.",
            "chips": [
              "{押|お}しないで",
              "ください",
              "{押|お}さないで",
              "{危|あぶ}ないですから、"
            ],
            "answer": [
              "{危|あぶ}ないですから、",
              "{押|お}さないで",
              "ください"
            ],
            "ro": "Abunai desu kara, osanaide kudasai"
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "Thể ない = **thể thường phủ định**; lịch sự thì vẫn dùng ～ません. Bài 10: **Vない + で ください** (không phải ~~Vないください~~, ~~Vませんでください~~).",
          "Đọc to mỗi ngày 8 cặp bẫy: すいます→すわない · かいます→かわない · はいります→はいらない · かえります→かえらない · みます→みない · おきます→おきない · かります→かりない · きます→こない."
        ]
      }
    ]
  },
  {
    "id": "lt-b10-np-1",
    "kind": "homework",
    "title": "Luyện thêm Bài 10 · Ngữ pháp 1 (ポイント 88, 89, 97) — いろいろな注意: ～ないでください · ～てもいいですか · N は (đưa tân ngữ lên) (~94 câu)",
    "goal": "Nhắc người khác đừng làm gì (Vないでください), xin phép và trả lời xin phép (Vてもいいですか → はい、どうぞ／すみません、ちょっと…), và chỉ cách khác bằng \"N は ～てください\" — như hướng dẫn viên trên xe buýt, ở bảo tàng, ở công viên.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**ポイント 88 — Vない で ください** = \"xin đừng V\". Chia thể ない trước (xem lesson Thể ない), rồi thêm **で ください**. Hay dùng kèm lý do: 危ないですから、～ないでください.",
          "**ポイント 89 — Vて も いいですか** = \"tôi V có được không?\" (xin phép). Đáp đồng ý: **はい、どうぞ** / はい、いいですよ. Từ chối khéo: **すみません、ちょっと……** (không nói thẳng \"không\").",
          "**ポイント 97 — N は** = đưa **tân ngữ** (vốn đi với を) lên đầu câu làm chủ đề, thường để **đối chiếu/chỉ cách khác**: (Ở đây không được hút.) たばこ**は** あそこで 吸ってください. Khi đưa lên thì **を biến mất**, không viết ~~たばこをは~~."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**Vない で ください。** (ポイント 88) — 写真を 撮らないで ください.",
          "**Vて も いいですか。** → はい、どうぞ。／すみません、ちょっと……。(ポイント 89)",
          "**N は (nơi) で／に Vて ください。** (ポイント 97) — 荷物は あそこに 置いてください · ごみは うちへ 持って帰ってください."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng ポイント một"
      },
      {
        "t": "mcq",
        "id": "lt-b10-np1-88",
        "title": "ポイント 88: Vない で ください (12 câu)",
        "items": [
          {
            "q": "ここで{写真|しゃしん}を＿＿ください。　〔Koko de shashin o __ kudasai.〕　— Xin đừng chụp ảnh ở đây.",
            "options": [
              "{撮|と}って",
              "{撮|と}らないで",
              "{撮|と}らない",
              "{撮|と}りませんで"
            ],
            "correct": 1,
            "why": "Xin đừng = Vない + **で** ください. → **ここで{写真|しゃしん}を{撮|と}らないでください。** 〔Koko de shashin o toranaide kudasai.〕 — Xin đừng chụp ảnh ở đây."
          },
          {
            "q": "{窓|まど}から{手|て}を＿＿でください。　〔Mado kara te o __ de kudasai.〕　— Đừng thò tay ra ngoài cửa sổ.",
            "options": [
              "{出|だ}しない",
              "{出|だ}すない",
              "{出|だ}さない",
              "{出|だ}さなくて"
            ],
            "correct": 2,
            "why": "出します (nhóm 1): し → さ → **出さない**. → **{窓|まど}から{手|て}を{出|だ}さないでください。** 〔Mado kara te o dasanai de kudasai.〕 — Đừng thò tay ra ngoài cửa sổ."
          },
          {
            "q": "{危|あぶ}ないですから、{押|お}さない＿＿ください。　〔Abunai desu kara, osanai __ kudasai.〕　— Nguy hiểm nên xin đừng đẩy.",
            "options": [
              "に",
              "で",
              "を",
              "て"
            ],
            "correct": 1,
            "why": "Vない **で** ください. → **{危|あぶ}ないですから、{押|お}さないでください。** 〔Abunai desu kara, osanai de kudasai.〕 — Nguy hiểm nên xin đừng đẩy."
          },
          {
            "q": "{美術館|びじゅつかん}の{中|なか}で{大|おお}きい{声|こえ}で＿＿ください。　〔Bijutsukan no naka de ookii koe de __ kudasai.〕　— Trong bảo tàng xin đừng nói to.",
            "options": [
              "{話|はな}さないで",
              "{話|はな}しないで",
              "{話|はな}すないで",
              "{話|はな}してないで"
            ],
            "correct": 0,
            "why": "話します: し → さ → **話さないで**. → **{美術館|びじゅつかん}の{中|なか}で{大|おお}きい{声|こえ}で{話|はな}さないでください。** 〔Bijutsukan no naka de ookii koe de hanasanaide kudasai.〕 — Trong bảo tàng xin đừng nói to."
          },
          {
            "q": "{観覧車|かんらんしゃ}の{中|なか}で＿＿ください。{危|あぶ}ないです。　〔Kanransha no naka de __ kudasai. Abunai desu.〕　— Trong vòng đu quay xin đừng đứng lên. Nguy hiểm.",
            "options": [
              "{立|た}ちないで",
              "{立|た}たなくて",
              "{立|た}ってないで",
              "{立|た}たないで"
            ],
            "correct": 3,
            "why": "立ちます: ち → た → **立たないで**. → **{観覧車|かんらんしゃ}の{中|なか}で{立|た}たないでください。{危|あぶ}ないです。** 〔Kanransha no naka de tatanaide kudasai. Abunai desu.〕 — Trong vòng đu quay xin đừng đứng lên. Nguy hiểm."
          },
          {
            "q": "ここに{自転車|じてんしゃ}を＿＿ください。　〔Koko ni jitensha o __ kudasai.〕　— Xin đừng để xe đạp ở đây.",
            "options": [
              "{置|お}くないで",
              "{置|お}かないで",
              "{置|お}いてないで",
              "{置|お}きないで"
            ],
            "correct": 1,
            "why": "置きます: き → か → **置かないで**. → **ここに{自転車|じてんしゃ}を{置|お}かないでください。** 〔Koko ni jitensha o okanaide kudasai.〕 — Xin đừng để xe đạp ở đây."
          },
          {
            "q": "{芝生|しばふ}に＿＿ください。　〔Shibafu ni __ kudasai.〕　— Xin đừng giẫm lên bãi cỏ.",
            "options": [
              "{入|はい}って",
              "{入|はい}ないで",
              "{入|はい}りないで",
              "{入|はい}らないで"
            ],
            "correct": 3,
            "why": "入ります là nhóm 1 → **入らないで**. → **{芝生|しばふ}に{入|はい}らないでください。** 〔Shibafu ni hairanaide kudasai.〕 — Xin đừng giẫm lên bãi cỏ."
          },
          {
            "q": "{集合|しゅうごう}{時間|じかん}に＿＿ください。　〔Shuugou jikan ni __ kudasai.〕　— Xin đừng trễ giờ tập hợp.",
            "options": [
              "{遅|おく}れないで",
              "{遅|おく}れません",
              "{遅|おく}れなくて",
              "{遅|おく}らないで"
            ],
            "correct": 0,
            "why": "遅れます (nhóm 2) → **遅れないで**. → **{集合|しゅうごう}{時間|じかん}に{遅|おく}れないでください。** 〔Shuugou jikan ni okurenaide kudasai.〕 — Xin đừng trễ giờ tập hợp."
          },
          {
            "q": "{動物|どうぶつ}にえさを＿＿ください。　〔Doubutsu ni esa o __ kudasai.〕　— Xin đừng cho thú ăn.",
            "options": [
              "やないで",
              "やりないで",
              "やってないで",
              "やらないで"
            ],
            "correct": 3,
            "why": "やります: り → ら → **やらないで**. → **{動物|どうぶつ}にえさをやらないでください。** 〔Doubutsu ni esa o yaranaide kudasai.〕 — Xin đừng cho thú ăn."
          },
          {
            "q": "この{部屋|へや}でたばこを＿＿ください。　〔Kono heya de tabako o __ kudasai.〕　— Xin đừng hút thuốc trong phòng này.",
            "options": [
              "{吸|す}わなくて",
              "{吸|す}あないで",
              "{吸|す}わないで",
              "{吸|す}いないで"
            ],
            "correct": 2,
            "why": "吸います: い → **わ** → 吸わないで. → **この{部屋|へや}でたばこを{吸|す}わないでください。** 〔Kono heya de tabako o suwanaide kudasai.〕 — Xin đừng hút thuốc trong phòng này."
          },
          {
            "q": "{大切|たいせつ}なチケットですから、＿＿ください。　〔Taisetsu na chiketto desu kara, __ kudasai.〕　— Vé quan trọng nên xin đừng làm mất.",
            "options": [
              "なくしないで",
              "なくすないで",
              "なくさないで",
              "なくさなくて"
            ],
            "correct": 2,
            "why": "なくします: し → さ → **なくさないで**. → **{大切|たいせつ}なチケットですから、なくさないでください。** 〔Taisetsu na chiketto desu kara, nakusanaide kudasai.〕 — Vé quan trọng nên xin đừng làm mất."
          },
          {
            "q": "ここにごみを＿＿ください。{持|も}って{帰|かえ}ってください。　〔Koko ni gomi o __ kudasai. Motte kaette kudasai.〕　— Đừng vứt rác ở đây. Hãy mang về.",
            "options": [
              "{捨|す}たないで",
              "{捨|す}てないで",
              "{捨|す}てて",
              "{捨|す}てらないで"
            ],
            "correct": 1,
            "why": "捨てます (nhóm 2) → **捨てないで**; câu sau chỉ cách đúng. → **ここにごみを{捨|す}てないでください。{持|も}って{帰|かえ}ってください。** 〔Koko ni gomi o sutenaide kudasai. Motte kaette kudasai.〕 — Đừng vứt rác ở đây. Hãy mang về."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np1-89",
        "title": "ポイント 89: Vて も いいですか (12 câu)",
        "items": [
          {
            "q": "{隣|となり}に＿＿もいいですか。　〔Tonari ni __ mo ii desu ka.〕　— Tôi ngồi cạnh được không?",
            "options": [
              "{座|すわ}る",
              "{座|すわ}り",
              "{座|すわ}らない",
              "{座|すわ}って"
            ],
            "correct": 3,
            "why": "Xin phép = **Vて** も いいですか. → **{隣|となり}に{座|すわ}ってもいいですか。** 〔Tonari ni suwatte mo ii desu ka.〕 — Tôi ngồi cạnh được không?"
          },
          {
            "q": "{窓|まど}を{開|あ}けて＿＿いいですか。　〔Mado o akete __ ii desu ka.〕　— Tôi mở cửa sổ được không?",
            "options": [
              "を",
              "が",
              "は",
              "も"
            ],
            "correct": 3,
            "why": "Vて **も** いいですか. → **{窓|まど}を{開|あ}けてもいいですか。** 〔Mado o akete mo ii desu ka.〕 — Tôi mở cửa sổ được không?"
          },
          {
            "q": "ここで{写真|しゃしん}を＿＿もいいですか。　〔Koko de shashin o __ mo ii desu ka.〕　— Tôi chụp ảnh ở đây được không?",
            "options": [
              "{撮|と}りて",
              "{撮|と}って",
              "{撮|と}んで",
              "{撮|と}いて"
            ],
            "correct": 1,
            "why": "撮ります → thể て **撮って**. → **ここで{写真|しゃしん}を{撮|と}ってもいいですか。** 〔Koko de shashin o totte mo ii desu ka.〕 — Tôi chụp ảnh ở đây được không?"
          },
          {
            "q": "このパンフレットを＿＿もいいですか。　〔Kono panfuretto o __ mo ii desu ka.〕　— Tôi lấy tờ giới thiệu này được không?",
            "options": [
              "もらいて",
              "もらて",
              "もらんで",
              "もらって"
            ],
            "correct": 3,
            "why": "もらいます → **もらって**. → **このパンフレットをもらってもいいですか。** 〔Kono panfuretto o moratte mo ii desu ka.〕 — Tôi lấy tờ giới thiệu này được không?"
          },
          {
            "q": "カーテンを＿＿もいいですか。　〔Kaaten o __ mo ii desu ka.〕　— Tôi kéo rèm được không?",
            "options": [
              "{閉|し}めて",
              "{閉|し}まって",
              "{閉|し}めいて",
              "{閉|し}めって"
            ],
            "correct": 0,
            "why": "閉めます (nhóm 2) → **閉めて**. → **カーテンを{閉|し}めてもいいですか。** 〔Kaaten o shimete mo ii desu ka.〕 — Tôi kéo rèm được không?"
          },
          {
            "q": "すみません、ここでたばこを＿＿もいいですか。　〔Sumimasen, koko de tabako o __ mo ii desu ka.〕　— Xin lỗi, tôi hút thuốc ở đây được không?",
            "options": [
              "{吸|す}んで",
              "{吸|す}って",
              "{吸|す}わって",
              "{吸|す}いて"
            ],
            "correct": 1,
            "why": "吸います → **吸って**. → **すみません、ここでたばこを{吸|す}ってもいいですか。** 〔Sumimasen, koko de tabako o sutte mo ii desu ka.〕 — Xin lỗi, tôi hút thuốc ở đây được không?"
          },
          {
            "q": "A：{窓|まど}を{開|あ}けてもいいですか。B：はい、＿＿。　〔A: mado o akete mo ii desu ka. B: hai, __.〕　— A: Tôi mở cửa sổ được không? B: Vâng, xin mời.",
            "options": [
              "そろそろ",
              "ええと",
              "どうぞ",
              "ちょっと"
            ],
            "correct": 2,
            "why": "Đồng ý lịch sự: **はい、どうぞ**. → **A：{窓|まど}を{開|あ}けてもいいですか。B：はい、どうぞ。** 〔A: mado o akete mo ii desu ka. B: hai, douzo.〕 — A: Tôi mở cửa sổ được không? B: Vâng, xin mời."
          },
          {
            "q": "A：ここに{座|すわ}ってもいいですか。B：すみません。＿＿……。　〔A: koko ni suwatte mo ii desu ka. B: sumimasen. __....〕　— A: Tôi ngồi đây được không? B: Xin lỗi, hơi… (không tiện).",
            "options": [
              "どうぞ",
              "ちょっと",
              "{本当|ほんとう}だ",
              "まっすぐ"
            ],
            "correct": 1,
            "why": "Từ chối khéo: **すみません、ちょっと……**. → **A：ここに{座|すわ}ってもいいですか。B：すみません。ちょっと……。** 〔A: koko ni suwatte mo ii desu ka. B: sumimasen. Chotto....〕 — A: Tôi ngồi đây được không? B: Xin lỗi, hơi… (không tiện)."
          },
          {
            "q": "{先生|せんせい}、トイレに＿＿もいいですか。　〔Sensei, toire ni __ mo ii desu ka.〕　— Thưa cô, em đi vệ sinh được không ạ?",
            "options": [
              "{行|い}きて",
              "{行|い}いて",
              "{行|い}って",
              "{行|い}んで"
            ],
            "correct": 2,
            "why": "行きます → **行って** (ngoại lệ). → **{先生|せんせい}、トイレに{行|い}ってもいいですか。** 〔Sensei, toire ni itte mo ii desu ka.〕 — Thưa cô, em đi vệ sinh được không ạ?"
          },
          {
            "q": "{少|すこ}し＿＿もいいですか。{疲|つか}れました。　〔Sukoshi __ mo ii desu ka. Tsukaremashita.〕　— Tôi nghỉ một chút được không? Mệt rồi.",
            "options": [
              "{休|やす}みて",
              "{休|やす}いて",
              "{休|やす}って",
              "{休|やす}んで"
            ],
            "correct": 3,
            "why": "休みます → **休んで**. → **{少|すこ}し{休|やす}んでもいいですか。{疲|つか}れました。** 〔Sukoshi yasunde mo ii desu ka. Tsukaremashita.〕 — Tôi nghỉ một chút được không? Mệt rồi."
          },
          {
            "q": "このボールを{使|つか}って＿＿。　〔Kono booru o tsukatte __.〕　— Tôi dùng quả bóng này được không?",
            "options": [
              "くださいか",
              "ないでください",
              "もいいです",
              "もいいですか"
            ],
            "correct": 3,
            "why": "Hỏi xin phép: Vて **も いいですか**. → **このボールを{使|つか}ってもいいですか。** 〔Kono booru o tsukatte mo ii desu ka.〕 — Tôi dùng quả bóng này được không?"
          },
          {
            "q": "A：{電話|でんわ}をかけてもいいですか。B：はい、いいです＿＿。　〔A: denwa o kakete mo ii desu ka. B: hai, ii desu __.〕　— A: Tôi gọi điện được không? B: Được chứ.",
            "options": [
              "よ",
              "を",
              "か",
              "の"
            ],
            "correct": 0,
            "why": "Đồng ý thân mật: はい、いいです**よ**. → **A：{電話|でんわ}をかけてもいいですか。B：はい、いいですよ。** 〔A: denwa o kakete mo ii desu ka. B: hai, ii desu yo.〕 — A: Tôi gọi điện được không? B: Được chứ."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np1-97",
        "title": "ポイント 97: N は — đưa tân ngữ lên làm chủ đề (8 câu)",
        "items": [
          {
            "q": "（ここに{置|お}かないでください。）{荷物|にもつ}＿＿あそこに{置|お}いてください。　〔(Koko ni okanaide kudasai.) nimotsu __ asoko ni oite kudasai.〕　— (Đừng để ở đây.) Hành lý thì hãy để đằng kia.",
            "options": [
              "は",
              "に",
              "が",
              "を"
            ],
            "correct": 0,
            "why": "Đưa tân ngữ lên đầu để chỉ cách khác → **は** (を biến mất). → **（ここに{置|お}かないでください。）{荷物|にもつ}はあそこに{置|お}いてください。** 〔(Koko ni okanaide kudasai.) nimotsu wa asoko ni oite kudasai.〕 — (Đừng để ở đây.) Hành lý thì hãy để đằng kia."
          },
          {
            "q": "（ここで{吸|す}わないでください。）たばこ＿＿あそこで{吸|す}ってください。　〔(Koko de suwanaide kudasai.) tabako __ asoko de sutte kudasai.〕　— (Đừng hút ở đây.) Thuốc lá thì hãy hút ở đằng kia.",
            "options": [
              "で",
              "を",
              "が",
              "は"
            ],
            "correct": 3,
            "why": "たばこを 吸います → たばこ**は** … 吸ってください. → **（ここで{吸|す}わないでください。）たばこはあそこで{吸|す}ってください。** 〔(Koko de suwanaide kudasai.) tabako wa asoko de sutte kudasai.〕 — (Đừng hút ở đây.) Thuốc lá thì hãy hút ở đằng kia."
          },
          {
            "q": "ごみ＿＿うちへ{持|も}って{帰|かえ}ってください。　〔Gomi __ uchi e motte kaette kudasai.〕　— Rác thì hãy mang về nhà.",
            "options": [
              "は",
              "へ",
              "に",
              "をは"
            ],
            "correct": 0,
            "why": "Không viết ~~をは~~ — chỉ **は**. → **ごみはうちへ{持|も}って{帰|かえ}ってください。** 〔Gomi wa uchi e motte kaette kudasai.〕 — Rác thì hãy mang về nhà."
          },
          {
            "q": "お{弁当|べんとう}＿＿あちらのテーブルで{食|た}べてください。　〔Obentou __ achira no teeburu de tabete kudasai.〕　— Cơm hộp thì hãy ăn ở bàn đằng kia.",
            "options": [
              "の",
              "は",
              "を",
              "が"
            ],
            "correct": 1,
            "why": "Chủ đề đối chiếu: お弁当**は** ～で食べてください. → **お{弁当|べんとう}はあちらのテーブルで{食|た}べてください。** 〔Obentou wa achira no teeburu de tabete kudasai.〕 — Cơm hộp thì hãy ăn ở bàn đằng kia."
          },
          {
            "q": "{写真|しゃしん}＿＿ここで{撮|と}ってください。{中|なか}はだめです。　〔Shashin __ koko de totte kudasai. Naka wa dame desu.〕　— Ảnh thì hãy chụp ở đây. Bên trong thì không được.",
            "options": [
              "も",
              "を",
              "が",
              "は"
            ],
            "correct": 3,
            "why": "Ảnh thì (chỉ) chụp ở đây → **は**. → **{写真|しゃしん}はここで{撮|と}ってください。{中|なか}はだめです。** 〔Shashin wa koko de totte kudasai. Naka wa dame desu.〕 — Ảnh thì hãy chụp ở đây. Bên trong thì không được."
          },
          {
            "q": "A：ここでボールを{借|か}りることができますか。B：いいえ。ボール＿＿{受付|うけつけ}で{借|か}りてください。　〔A: koko de booru o kariru koto ga dekimasu ka. B: iie. Booru __ uketsuke de karite kudasai.〕　— A: Ở đây mượn bóng được không? B: Không. Bóng thì hãy mượn ở quầy lễ tân.",
            "options": [
              "に",
              "は",
              "が",
              "を"
            ],
            "correct": 1,
            "why": "Từ chối rồi chỉ chỗ khác: ボール**は** 受付で…. → **A：ここでボールを{借|か}りることができますか。B：いいえ。ボールは{受付|うけつけ}で{借|か}りてください。** 〔A: koko de booru o kariru koto ga dekimasu ka. B: iie. Booru wa uketsuke de karite kudasai.〕 — A: Ở đây mượn bóng được không? B: Không. Bóng thì hãy mượn ở quầy lễ tân."
          },
          {
            "q": "{大|おお}きい{荷物|にもつ}＿＿バスの{後|うし}ろに{置|お}いてください。　〔Ookii nimotsu __ basu no ushiro ni oite kudasai.〕　— Hành lý lớn thì hãy để ở phía sau xe buýt.",
            "options": [
              "を",
              "が",
              "は",
              "で"
            ],
            "correct": 2,
            "why": "Hành lý lớn (khác hành lý nhỏ) → **は**. → **{大|おお}きい{荷物|にもつ}はバスの{後|うし}ろに{置|お}いてください。** 〔Ookii nimotsu wa basu no ushiro ni oite kudasai.〕 — Hành lý lớn thì hãy để ở phía sau xe buýt."
          },
          {
            "q": "{薬|くすり}＿＿{朝|あさ}と{晩|ばん}に{飲|の}んでください。　〔Kusuri __ asa to ban ni nonde kudasai.〕　— Thuốc thì hãy uống vào buổi sáng và buổi tối.",
            "options": [
              "をは",
              "は",
              "に",
              "が"
            ],
            "correct": 1,
            "why": "Đưa 薬 lên đầu làm chủ đề → **は** (không ~~をは~~). → **{薬|くすり}は{朝|あさ}と{晩|ばん}に{飲|の}んでください。** 〔Kusuri wa asa to ban ni nonde kudasai.〕 — Thuốc thì hãy uống vào buổi sáng và buổi tối."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · biển báo · hỏi–đáp xin phép · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b10-np1-bien",
        "title": "Nhìn biển báo → câu nhắc nhở đúng (8 câu)",
        "items": [
          {
            "q": "Biển: 📷 gạch chéo (trong bảo tàng).",
            "options": [
              "{写真|しゃしん}を{撮|と}ってもいいですか。 (Shashin o totte mo ii desu ka.)",
              "{写真|しゃしん}を{撮|と}らないでください。 (Shashin o toranaide kudasai.)",
              "{写真|しゃしん}を{撮|と}りないでください。 (Shashin o torinaide kudasai.)",
              "{写真|しゃしん}を{撮|と}ってください。 (Shashin o totte kudasai.)"
            ],
            "correct": 1,
            "why": "Cấm chụp → 撮らないで ください."
          },
          {
            "q": "Biển: 🚬 gạch chéo.",
            "options": [
              "たばこを{吸|す}いませんでください。 (Tabako o suimasen de kudasai.)",
              "たばこを{吸|す}わないでください。 (Tabako o suwanaide kudasai.)",
              "たばこを{吸|す}あないでください。 (Tabako o suanaide kudasai.)",
              "たばこを{吸|す}ってください。 (Tabako o sutte kudasai.)"
            ],
            "correct": 1,
            "why": "Cấm hút → 吸**わ**ないで ください."
          },
          {
            "q": "Biển: bãi cỏ 🌱 có hình chân gạch chéo.",
            "options": [
              "{芝生|しばふ}に{入|はい}ってください。 (Shibafu ni haitte kudasai.)",
              "{芝生|しばふ}を{入|はい}らないでください。 (Shibafu o hairanaide kudasai.)",
              "{芝生|しばふ}に{入|はい}らないでください。 (Shibafu ni hairanaide kudasai.)",
              "{芝生|しばふ}に{入|はい}ないでください。 (Shibafu ni hainaide kudasai.)"
            ],
            "correct": 2,
            "why": "Nơi vào + **に**; 入ります nhóm 1 → 入らないで."
          },
          {
            "q": "Biển ở chuồng khỉ: 🍌 gạch chéo.",
            "options": [
              "サルにえさをやりないでください。 (Saru ni esa o yarinaide kudasai.)",
              "サルにえさをやってください。 (Saru ni esa o yatte kudasai.)",
              "サルにえさをやらないでください。 (Saru ni esa o yaranaide kudasai.)",
              "サルをえさにやらないでください。 (Saru o esa ni yaranaide kudasai.)"
            ],
            "correct": 2,
            "why": "Cấm cho ăn: (con vật) **に** えさを やらないで."
          },
          {
            "q": "Biển: 🗑 gạch chéo + mũi tên về nhà.",
            "options": [
              "ごみが{持|も}って{帰|かえ}ってください。 (Gomi ga motte kaette kudasai.)",
              "ごみは{持|も}って{帰|かえ}ってください。 (Gomi wa motte kaette kudasai.)",
              "ごみは{持|も}って{帰|かえ}らないでください。 (Gomi wa motte kaeranaide kudasai.)",
              "ごみを{捨|す}ててください。 (Gomi o sutete kudasai.)"
            ],
            "correct": 1,
            "why": "Chỉ cách đúng: ごみ**は** 持って帰ってください (ポイント 97)."
          },
          {
            "q": "Biển ở cửa xe buýt: ✋ không thò tay ra cửa sổ.",
            "options": [
              "{窓|まど}に{手|て}が{出|だ}さないでください。 (Mado ni te ga dasanaide kudasai.)",
              "{窓|まど}から{手|て}を{出|だ}してください。 (Mado kara te o dashite kudasai.)",
              "{窓|まど}から{手|て}を{出|だ}しないでください。 (Mado kara te o dashinaide kudasai.)",
              "{窓|まど}から{手|て}を{出|だ}さないでください。 (Mado kara te o dasanaide kudasai.)"
            ],
            "correct": 3,
            "why": "出します → 出さないで."
          },
          {
            "q": "Biển ở thang máy/cửa: \"đừng chen lấn\".",
            "options": [
              "{押|お}さないでください。 (Osanaide kudasai.)",
              "{押|お}してください。 (Oshite kudasai.)",
              "{押|お}すないでください。 (Osunaide kudasai.)",
              "{押|お}しないでください。 (Oshinaide kudasai.)"
            ],
            "correct": 0,
            "why": "押します → 押さないで."
          },
          {
            "q": "Biển ở thư viện: 🔇 (không nói chuyện).",
            "options": [
              "{大|おお}きい{声|こえ}で{話|はな}してください。 (Ookii koe de hanashite kudasai.)",
              "{大|おお}きい{声|こえ}が{話|はな}さないでください。 (Ookii koe ga hanasanaide kudasai.)",
              "{大|おお}きい{声|こえ}で{話|はな}さないでください。 (Ookii koe de hanasanaide kudasai.)",
              "{大|おお}きい{音|おと}で{話|はな}さないでください。 (Ookii oto de hanasanaide kudasai.)"
            ],
            "correct": 2,
            "why": "Nói to = 大きい**声**で 話します → 話さないで."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np1-dap",
        "title": "Hỏi – đáp xin phép: chọn câu đúng (8 câu)",
        "items": [
          {
            "q": "{窓|まど}を{開|あ}けてもいいですか。　〔Mado o akete mo ii desu ka.〕　(Bạn đồng ý.)",
            "options": [
              "はい、どうぞ。 (Hai, douzo.)",
              "はい、{開|あ}けます。 (Hai, akemasu.)",
              "はい、{開|あ}けないでください。 (Hai, akenaide kudasai.)",
              "いいえ、{開|あ}けてください。 (Iie, akete kudasai.)"
            ],
            "correct": 0,
            "why": "Cho phép: **はい、どうぞ**."
          },
          {
            "q": "ここに{座|すわ}ってもいいですか。　〔Koko ni suwatte mo ii desu ka.〕　(Chỗ có người rồi — từ chối khéo.)",
            "options": [
              "すみません。ちょっと……。 (Sumimasen. Chotto....)",
              "いいえ、{座|すわ}ってください。 (Iie, suwatte kudasai.)",
              "はい、どうぞ。 (Hai, douzo.)",
              "いいえ、{座|すわ}りません。 (Iie, suwarimasen.)"
            ],
            "correct": 0,
            "why": "Từ chối lịch sự: **すみません、ちょっと……**."
          },
          {
            "q": "ここでたばこを{吸|す}ってもいいですか。　〔Koko de tabako o sutte mo ii desu ka.〕　(Không được — chỉ khu hút thuốc 喫煙所.)",
            "options": [
              "はい、どうぞ。 (Hai, douzo.)",
              "すみません。たばこは{喫煙所|きつえんじょ}で{吸|す}ってください。 (Sumimasen. Tabako wa kitsuenjo de sutte kudasai.)",
              "すみません。たばこを{喫煙所|きつえんじょ}で{吸|す}わないでください。 (Sumimasen. Tabako o kitsuenjo de suwanaide kudasai.)",
              "いいえ、たばこが{喫煙所|きつえんじょ}で{吸|す}ってください。 (Iie, tabako ga kitsuenjo de sutte kudasai.)"
            ],
            "correct": 1,
            "why": "Từ chối + chỉ cách khác: たばこ**は** 外で 吸ってください (ポイント 97)."
          },
          {
            "q": "{写真|しゃしん}を{撮|と}ってもいいですか。　〔Shashin o totte mo ii desu ka.〕　(Bạn là nhân viên, đồng ý thân mật.)",
            "options": [
              "はい、{撮|と}らないでください。 (Hai, toranaide kudasai.)",
              "はい、{撮|と}りましょう。 (Hai, torimashou.)",
              "はい、いいですよ。 (Hai, ii desu yo.)",
              "いいえ、いいです。 (Iie, ii desu.)"
            ],
            "correct": 2,
            "why": "はい、いいですよ = được chứ."
          },
          {
            "q": "このパンフレットをもらってもいいですか。　〔Kono panfuretto o moratte mo ii desu ka.〕　(Đồng ý.)",
            "options": [
              "はい、あげません。 (Hai, agemasen.)",
              "いいえ、どうぞ。 (Iie, douzo.)",
              "はい、もらいます。 (Hai, moraimasu.)",
              "はい、どうぞ。 (Hai, douzo.)"
            ],
            "correct": 3,
            "why": "はい、どうぞ."
          },
          {
            "q": "ここに{荷物|にもつ}を{置|お}いてもいいですか。　〔Koko ni nimotsu o oite mo ii desu ka.〕　(Không được, để ở tủ khoá.)",
            "options": [
              "はい、どうぞ。 (Hai, douzo.)",
              "すみません。{荷物|にもつ}をロッカーに{置|お}かないでください。 (Sumimasen. Nimotsu o rokkaa ni okanaide kudasai.)",
              "すみません。{荷物|にもつ}がロッカーに{置|お}いてください。 (Sumimasen. Nimotsu ga rokkaa ni oite kudasai.)",
              "すみません。{荷物|にもつ}はロッカーに{置|お}いてください。 (Sumimasen. Nimotsu wa rokkaa ni oite kudasai.)"
            ],
            "correct": 3,
            "why": "荷物**は** ロッカーに 置いてください."
          },
          {
            "q": "Bạn muốn xin phép cô giáo về sớm. Nói thế nào?",
            "options": [
              "{先生|せんせい}、{早|はや}く{帰|かえ}ってください。 (Sensei, hayaku kaette kudasai.)",
              "{先生|せんせい}、{早|はや}く{帰|かえ}りますもいいですか。 (Sensei, hayaku kaerimasu mo ii desu ka.)",
              "{先生|せんせい}、{早|はや}く{帰|かえ}らないでください。 (Sensei, hayaku kaeranaide kudasai.)",
              "{先生|せんせい}、{早|はや}く{帰|かえ}ってもいいですか。 (Sensei, hayaku kaette mo ii desu ka.)"
            ],
            "correct": 3,
            "why": "Xin phép: Vて も いいですか → 帰って も いいですか."
          },
          {
            "q": "Bạn trên xe buýt thấy nóng, muốn mở cửa sổ. Hỏi người ngồi cạnh:",
            "options": [
              "すみません、{窓|まど}を{開|あ}けてもいいですか。 (Sumimasen, mado o akete mo ii desu ka.)",
              "すみません、{窓|まど}が{開|あ}けてもいいですか。 (Sumimasen, mado ga akete mo ii desu ka.)",
              "すみません、{窓|まど}を{開|あ}けないでください。 (Sumimasen, mado o akenaide kudasai.)",
              "すみません、{窓|まど}を{開|あ}けましたか。 (Sumimasen, mado o akemashita ka.)"
            ],
            "correct": 0,
            "why": "すみません + Vて も いいですか."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np1-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "{写真|しゃしん}を{撮|と}らないでください。 (Shashin o toranaide kudasai.)",
              "{写真|しゃしん}を{撮|と}ってもいいですか。 (Shashin o totte mo ii desu ka.)",
              "{写真|しゃしん}を{撮|と}らないください。 (Shashin o toranai kudasai.)",
              "{写真|しゃしん}はあそこで{撮|と}ってください。 (Shashin wa asoko de totte kudasai.)"
            ],
            "correct": 2,
            "why": "Thiếu **で**: Vない**で** ください."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "ここで{写真|しゃしん}を{撮|と}らないでください。 (Koko de shashin o toranaide kudasai.)",
              "{写真|しゃしん}を{撮|と}りませんでください。 (Shashin o torimasende kudasai.)",
              "{写真|しゃしん}は{撮|と}らないでください。 (Shashin wa toranaide kudasai.)",
              "{写真|しゃしん}を{撮|と}らないでください。 (Shashin o toranaide kudasai.)"
            ],
            "correct": 1,
            "why": "Không dùng ～ません trước で ください — phải là **thể ない**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "ここに{座|すわ}らないでください。 (Koko ni suwaranaide kudasai.)",
              "ここに{座|すわ}ってもいいですか。 (Koko ni suwatte mo ii desu ka.)",
              "あそこに{座|すわ}ってください。 (Asoko ni suwatte kudasai.)",
              "ここに{座|すわ}るもいいですか。 (Koko ni suwaru mo ii desu ka.)"
            ],
            "correct": 3,
            "why": "Xin phép dùng **thể て**: 座って も いいですか."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "たばこをはあそこで{吸|す}ってください。 (Tabako o wa asoko de sutte kudasai.)",
              "ここでたばこを{吸|す}わないでください。 (Koko de tabako o suwanaide kudasai.)",
              "たばこはあそこで{吸|す}ってください。 (Tabako wa asoko de sutte kudasai.)",
              "たばこを{吸|す}ってもいいですか。 (Tabako o sutte mo ii desu ka.)"
            ],
            "correct": 0,
            "why": "Đưa tân ngữ lên: を **biến mất** → たばこ**は** (không ~~をは~~)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{窓|まど}を{開|あ}けていいですか。 (Mado o akete ii desu ka.)",
              "{窓|まど}は{開|あ}けないでください。 (Mado wa akenaide kudasai.)",
              "{窓|まど}を{開|あ}けてもいいですか。 (Mado o akete mo ii desu ka.)",
              "{窓|まど}を{開|あ}けないでください。 (Mado o akenaide kudasai.)"
            ],
            "correct": 0,
            "why": "Thiếu **も**: Vて **も** いいですか."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{教室|きょうしつ}に{入|はい}ってください。 (Kyoushitsu ni haitte kudasai.)",
              "{教室|きょうしつ}に{入|はい}ないでください。 (Kyoushitsu ni hainaide kudasai.)",
              "{教室|きょうしつ}に{入|はい}ってもいいですか。 (Kyoushitsu ni haitte mo ii desu ka.)",
              "{教室|きょうしつ}に{入|はい}らないでください。 (Kyoushitsu ni hairanaide kudasai.)"
            ],
            "correct": 1,
            "why": "入ります nhóm 1 → 入**ら**ないで."
          },
          {
            "q": "Bạn được hỏi 「ここに 座っても いいですか」 và muốn ĐỒNG Ý. Câu nào SAI?",
            "options": [
              "はい、どうぞ。 (Hai, douzo.)",
              "ええ、どうぞ。 (Ee, douzo.)",
              "はい、いいですよ。 (Hai, ii desu yo.)",
              "はい、{座|すわ}らないでください。 (Hai, suwaranaide kudasai.)"
            ],
            "correct": 3,
            "why": "Đồng ý thì nói **はい、どうぞ／いいですよ**; \"はい、座らないでください\" vừa \"vâng\" vừa cấm — mâu thuẫn."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{集合|しゅうごう}{時間|じかん}に{遅|おく}らないでください。 (Shuugou jikan ni okuranaide kudasai.)",
              "{遅|おく}れないでください。 (Okurenaide kudasai.)",
              "{明日|あした}は{遅|おく}れないでください。 (Ashita wa okurenaide kudasai.)",
              "{皆|みな}さん、{遅|おく}れないでください。 (Minasan, okurenaide kudasai.)"
            ],
            "correct": 0,
            "why": "遅れます là nhóm 2 → **遅れないで**; ~~遅らないで~~ sai."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-np1-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 88, 89, 97",
        "items": [
          {
            "q": "Xin đừng chụp ảnh.",
            "answers": [
              "写真を撮らないでください。",
              "写真をとらないでください。",
              "しゃしんを撮らないでください。",
              "しゃしんをとらないでください。"
            ],
            "hint": "Vない で ください"
          },
          {
            "q": "Xin đừng vứt rác.",
            "answers": [
              "ごみを捨てないでください。",
              "ごみをすてないでください。"
            ],
            "hint": "Vない で ください"
          },
          {
            "q": "Xin đừng đến trễ.",
            "answers": [
              "遅れないでください。",
              "おくれないでください。"
            ],
            "hint": "Vない で ください"
          },
          {
            "q": "Tôi ngồi đây được không?",
            "answers": [
              "ここに座ってもいいですか。",
              "ここにすわってもいいですか。"
            ],
            "hint": "Vて も いいですか"
          },
          {
            "q": "Tôi mở cửa sổ được không?",
            "answers": [
              "窓を開けてもいいですか。",
              "窓をあけてもいいですか。",
              "まどを開けてもいいですか。",
              "まどをあけてもいいですか。"
            ],
            "hint": "Vて も いいですか"
          },
          {
            "q": "Vâng, xin mời.",
            "answers": [
              "はい、どうぞ。"
            ],
            "hint": "Đồng ý"
          },
          {
            "q": "Hành lý thì hãy để đằng kia.",
            "answers": [
              "荷物はあそこに置いてください。",
              "荷物はあそこにおいてください。",
              "にもつはあそこに置いてください。",
              "にもつはあそこにおいてください。"
            ],
            "hint": "N は ～て ください"
          },
          {
            "q": "Xin đừng hút thuốc ở đây.",
            "answers": [
              "ここでたばこを吸わないでください。",
              "ここでたばこをすわないでください。",
              "たばこをここで吸わないでください。",
              "たばこをここですわないでください。"
            ],
            "hint": "い → わ"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-np1-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Nguy hiểm nên xin đừng đứng lên.",
            "chips": [
              "ください",
              "{立|た}ちないで",
              "{危|あぶ}ないですから、",
              "{立|た}たないで"
            ],
            "answer": [
              "{危|あぶ}ないですから、",
              "{立|た}たないで",
              "ください"
            ],
            "ro": "Abunai desu kara, tatanaide kudasai"
          },
          {
            "vi": "Tôi chụp ảnh ở đây được không?",
            "chips": [
              "{写真|しゃしん}を",
              "ここで",
              "{撮|と}っても",
              "{撮|と}るも",
              "いいですか"
            ],
            "answer": [
              "ここで",
              "{写真|しゃしん}を",
              "{撮|と}っても",
              "いいですか"
            ],
            "ro": "Koko de shashin o totte mo ii desu ka"
          },
          {
            "vi": "Rác thì hãy mang về nhà.",
            "chips": [
              "ください",
              "うちへ",
              "{持|も}って{帰|かえ}って",
              "ごみは",
              "ごみをは"
            ],
            "answer": [
              "ごみは",
              "うちへ",
              "{持|も}って{帰|かえ}って",
              "ください"
            ],
            "ro": "Gomi wa uchi e motte kaette kudasai"
          },
          {
            "vi": "Xin đừng cho thú ăn.",
            "chips": [
              "やりないで",
              "えさを",
              "ください",
              "{動物|どうぶつ}に",
              "やらないで"
            ],
            "answer": [
              "{動物|どうぶつ}に",
              "えさを",
              "やらないで",
              "ください"
            ],
            "ro": "Doubutsu ni esa o yaranaide kudasai"
          },
          {
            "vi": "Tôi lấy tờ giới thiệu này được không?",
            "chips": [
              "いいですか",
              "もらっても",
              "このパンフレットを",
              "もらうも"
            ],
            "answer": [
              "このパンフレットを",
              "もらっても",
              "いいですか"
            ],
            "ro": "Kono panfuretto o moratte mo ii desu ka"
          },
          {
            "vi": "Vé quan trọng nên đừng làm mất.",
            "chips": [
              "チケットは",
              "{大切|たいせつ}ですから、",
              "なくさないで",
              "ください",
              "なくしないで"
            ],
            "answer": [
              "チケットは",
              "{大切|たいせつ}ですから、",
              "なくさないで",
              "ください"
            ],
            "ro": "Chiketto wa taisetsu desu kara, nakusanaide kudasai"
          },
          {
            "vi": "Thuốc lá thì hãy hút ở khu hút thuốc.",
            "chips": [
              "ください",
              "{吸|す}って",
              "{喫煙所|きつえんじょ}で",
              "{吸|す}わないで",
              "たばこは"
            ],
            "answer": [
              "たばこは",
              "{喫煙所|きつえんじょ}で",
              "{吸|す}って",
              "ください"
            ],
            "ro": "Tabako wa kitsuenjo de sutte kudasai"
          },
          {
            "vi": "Xin lỗi, tôi dùng điện thoại được không?",
            "chips": [
              "いいですか",
              "{使|つか}っても",
              "すみません、",
              "{電話|でんわ}を",
              "{使|つか}わないで"
            ],
            "answer": [
              "すみません、",
              "{電話|でんわ}を",
              "{使|つか}っても",
              "いいですか"
            ],
            "ro": "Sumimasen, denwa o tsukatte mo ii desu ka"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch · nhiều ô trống · tình huống hướng dẫn viên"
      },
      {
        "t": "quiz",
        "id": "lt-b10-np1-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 88, 89, 97",
        "items": [
          {
            "q": "Mọi người, trong xe buýt xin đừng đứng lên. Nguy hiểm.",
            "answers": [
              "皆さん、バスの中で立たないでください。危ないです。",
              "皆さん、バスの中で立たないでください。あぶないです。",
              "皆さん、バスの中でたたないでください。危ないです。",
              "皆さん、バスの中でたたないでください。あぶないです。",
              "皆さん、バスのなかで立たないでください。危ないです。",
              "皆さん、バスのなかで立たないでください。あぶないです。",
              "皆さん、バスのなかでたたないでください。危ないです。",
              "皆さん、バスのなかでたたないでください。あぶないです。",
              "みなさん、バスの中で立たないでください。危ないです。",
              "みなさん、バスの中で立たないでください。あぶないです。",
              "みなさん、バスの中でたたないでください。危ないです。",
              "みなさん、バスの中でたたないでください。あぶないです。",
              "みなさん、バスのなかで立たないでください。危ないです。",
              "みなさん、バスのなかで立たないでください。あぶないです。",
              "みなさん、バスのなかでたたないでください。危ないです。",
              "みなさん、バスのなかでたたないでください。あぶないです。",
              "皆さん、バスの中で立たないでください。危ないですから。",
              "皆さん、バスの中で立たないでください。あぶないですから。",
              "皆さん、バスの中でたたないでください。危ないですから。",
              "皆さん、バスの中でたたないでください。あぶないですから。",
              "皆さん、バスのなかで立たないでください。危ないですから。",
              "皆さん、バスのなかで立たないでください。あぶないですから。",
              "皆さん、バスのなかでたたないでください。危ないですから。",
              "皆さん、バスのなかでたたないでください。あぶないですから。",
              "みなさん、バスの中で立たないでください。危ないですから。",
              "みなさん、バスの中で立たないでください。あぶないですから。",
              "みなさん、バスの中でたたないでください。危ないですから。",
              "みなさん、バスの中でたたないでください。あぶないですから。",
              "みなさん、バスのなかで立たないでください。危ないですから。",
              "みなさん、バスのなかで立たないでください。あぶないですから。",
              "みなさん、バスのなかでたたないでください。危ないですから。",
              "みなさん、バスのなかでたたないでください。あぶないですから。"
            ],
            "hint": "Vない で ください"
          },
          {
            "q": "Trong bảo tàng xin đừng chụp ảnh.",
            "answers": [
              "美術館の中で写真を撮らないでください。",
              "美術館の中で写真をとらないでください。",
              "美術館の中でしゃしんを撮らないでください。",
              "美術館の中でしゃしんをとらないでください。",
              "美術館のなかで写真を撮らないでください。",
              "美術館のなかで写真をとらないでください。",
              "美術館のなかでしゃしんを撮らないでください。",
              "美術館のなかでしゃしんをとらないでください。",
              "びじゅつかんの中で写真を撮らないでください。",
              "びじゅつかんの中で写真をとらないでください。",
              "びじゅつかんの中でしゃしんを撮らないでください。",
              "びじゅつかんの中でしゃしんをとらないでください。",
              "びじゅつかんのなかで写真を撮らないでください。",
              "びじゅつかんのなかで写真をとらないでください。",
              "びじゅつかんのなかでしゃしんを撮らないでください。",
              "びじゅつかんのなかでしゃしんをとらないでください。",
              "美術館で写真を撮らないでください。",
              "美術館で写真をとらないでください。",
              "美術館でしゃしんを撮らないでください。",
              "美術館でしゃしんをとらないでください。",
              "びじゅつかんで写真を撮らないでください。",
              "びじゅつかんで写真をとらないでください。",
              "びじゅつかんでしゃしんを撮らないでください。",
              "びじゅつかんでしゃしんをとらないでください。"
            ],
            "hint": "Vない で ください"
          },
          {
            "q": "Ở đây đừng vứt rác. Rác thì hãy mang về.",
            "answers": [
              "ここにごみを捨てないでください。ごみは持って帰ってください。",
              "ここにごみを捨てないでください。ごみは持ってかえってください。",
              "ここにごみを捨てないでください。ごみはもって帰ってください。",
              "ここにごみを捨てないでください。ごみはもってかえってください。",
              "ここにごみをすてないでください。ごみは持って帰ってください。",
              "ここにごみをすてないでください。ごみは持ってかえってください。",
              "ここにごみをすてないでください。ごみはもって帰ってください。",
              "ここにごみをすてないでください。ごみはもってかえってください。"
            ],
            "hint": "ないで + N は"
          },
          {
            "q": "Tôi kéo rèm lại được không? — Vâng, xin mời.",
            "answers": [
              "カーテンを閉めてもいいですか。はい、どうぞ。",
              "カーテンをしめてもいいですか。はい、どうぞ。"
            ],
            "hint": "Vて も いいですか"
          },
          {
            "q": "Tôi ngồi cạnh được không? — Xin lỗi, hơi… (không tiện).",
            "answers": [
              "隣に座ってもいいですか。すみません、ちょっと。",
              "隣にすわってもいいですか。すみません、ちょっと。",
              "となりに座ってもいいですか。すみません、ちょっと。",
              "となりにすわってもいいですか。すみません、ちょっと。",
              "隣に座ってもいいですか。すみません。ちょっと。",
              "隣にすわってもいいですか。すみません。ちょっと。",
              "となりに座ってもいいですか。すみません。ちょっと。",
              "となりにすわってもいいですか。すみません。ちょっと。"
            ],
            "hint": "Từ chối khéo"
          },
          {
            "q": "Thưa thầy, hôm nay em về sớm được không ạ?",
            "answers": [
              "先生、今日は早く帰ってもいいですか。",
              "先生、今日は早くかえってもいいですか。",
              "先生、今日ははやく帰ってもいいですか。",
              "先生、今日ははやくかえってもいいですか。",
              "先生、きょうは早く帰ってもいいですか。",
              "先生、きょうは早くかえってもいいですか。",
              "先生、きょうははやく帰ってもいいですか。",
              "先生、きょうははやくかえってもいいですか。",
              "せんせい、今日は早く帰ってもいいですか。",
              "せんせい、今日は早くかえってもいいですか。",
              "せんせい、今日ははやく帰ってもいいですか。",
              "せんせい、今日ははやくかえってもいいですか。",
              "せんせい、きょうは早く帰ってもいいですか。",
              "せんせい、きょうは早くかえってもいいですか。",
              "せんせい、きょうははやく帰ってもいいですか。",
              "せんせい、きょうははやくかえってもいいですか。",
              "先生、今日早く帰ってもいいですか。",
              "先生、今日早くかえってもいいですか。",
              "先生、今日はやく帰ってもいいですか。",
              "先生、今日はやくかえってもいいですか。",
              "先生、きょう早く帰ってもいいですか。",
              "先生、きょう早くかえってもいいですか。",
              "先生、きょうはやく帰ってもいいですか。",
              "先生、きょうはやくかえってもいいですか。",
              "せんせい、今日早く帰ってもいいですか。",
              "せんせい、今日早くかえってもいいですか。",
              "せんせい、今日はやく帰ってもいいですか。",
              "せんせい、今日はやくかえってもいいですか。",
              "せんせい、きょう早く帰ってもいいですか。",
              "せんせい、きょう早くかえってもいいですか。",
              "せんせい、きょうはやく帰ってもいいですか。",
              "せんせい、きょうはやくかえってもいいですか。"
            ],
            "hint": "早く + Vて も いいですか"
          },
          {
            "q": "Đừng nói to. Làm phiền khách khác.",
            "answers": [
              "大きい声で話さないでください。他のお客さんに迷惑です。",
              "おおきいこえではなさないでください。ほかのおきゃくさんにめいわくです。",
              "おおきい声で話さないでください。他のお客さんに迷惑です。",
              "大きいこえではなさないでください。ほかのおきゃくさんにめいわくです。",
              "大きいこえで話さないでください。他のお客さんに迷惑です。",
              "おおきい声ではなさないでください。ほかのおきゃくさんにめいわくです。",
              "大きい声ではなさないでください。他のお客さんに迷惑です。",
              "おおきいこえで話さないでください。ほかのおきゃくさんにめいわくです。",
              "大きい声で話さないでください。ほかのお客さんに迷惑です。",
              "おおきいこえではなさないでください。他のおきゃくさんにめいわくです。",
              "大きい声で話さないでください。他のおきゃくさんに迷惑です。",
              "おおきいこえではなさないでください。ほかのお客さんにめいわくです。",
              "大きい声で話さないでください。他のお客さんにめいわくです。",
              "おおきいこえではなさないでください。ほかのおきゃくさんに迷惑です。",
              "大きい声で話さないでください。他の客に迷惑です。",
              "おおきいこえではなさないでください。ほかのきゃくにめいわくです。",
              "おおきい声で話さないでください。他の客に迷惑です。",
              "大きいこえではなさないでください。ほかのきゃくにめいわくです。",
              "大きいこえで話さないでください。他の客に迷惑です。",
              "おおきい声ではなさないでください。ほかのきゃくにめいわくです。",
              "大きい声ではなさないでください。他の客に迷惑です。",
              "おおきいこえで話さないでください。ほかのきゃくにめいわくです。",
              "大きい声で話さないでください。ほかの客に迷惑です。",
              "おおきいこえではなさないでください。他のきゃくにめいわくです。",
              "大きい声で話さないでください。他のきゃくに迷惑です。",
              "おおきいこえではなさないでください。ほかの客にめいわくです。",
              "大きい声で話さないでください。他の客にめいわくです。",
              "おおきいこえではなさないでください。ほかのきゃくに迷惑です。"
            ],
            "hint": "迷惑"
          },
          {
            "q": "Hành lý lớn thì hãy để ở phía sau.",
            "answers": [
              "大きい荷物は後ろに置いてください。",
              "大きい荷物は後ろにおいてください。",
              "大きい荷物はうしろに置いてください。",
              "大きい荷物はうしろにおいてください。",
              "大きいにもつは後ろに置いてください。",
              "大きいにもつは後ろにおいてください。",
              "大きいにもつはうしろに置いてください。",
              "大きいにもつはうしろにおいてください。",
              "おおきい荷物は後ろに置いてください。",
              "おおきい荷物は後ろにおいてください。",
              "おおきい荷物はうしろに置いてください。",
              "おおきい荷物はうしろにおいてください。",
              "おおきいにもつは後ろに置いてください。",
              "おおきいにもつは後ろにおいてください。",
              "おおきいにもつはうしろに置いてください。",
              "おおきいにもつはうしろにおいてください。"
            ],
            "hint": "N は"
          },
          {
            "q": "Vé này quan trọng nên đừng làm mất.",
            "answers": [
              "このチケットは大切ですから、なくさないでください。",
              "このチケットはたいせつですから、なくさないでください。"
            ],
            "hint": "から + ないで"
          },
          {
            "q": "Tôi đi vệ sinh được không?",
            "answers": [
              "トイレに行ってもいいですか。",
              "トイレにいってもいいですか。"
            ],
            "hint": "Vて も いいですか"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np1-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "ここでたばこを{吸|す}（①）でください。たばこ（②）あそこで{吸|す}ってください。　〔Koko de tabako o su((1)) de kudasai. Tabako ((2)) asoko de sutte kudasai.〕　— Đừng hút thuốc ở đây. Thuốc lá thì hút ở đằng kia.",
            "options": [
              "① わない　② は",
              "① あない　② を",
              "① いない　② が",
              "① わない　② を は"
            ],
            "correct": 0,
            "why": "吸**わ**ない + đưa tân ngữ lên bằng **は**. → **ここでたばこを{吸|す}わないでください。たばこはあそこで{吸|す}ってください。** 〔Koko de tabako o suwanaide kudasai. Tabako wa asoko de sutte kudasai.〕 — Đừng hút thuốc ở đây. Thuốc lá thì hút ở đằng kia."
          },
          {
            "q": "{窓|まど}を{開|あ}け（①）もいいですか。——はい、（②）。　〔Mado o ake((1)) mo ii desu ka. — Hai, ((2)).〕　— Tôi mở cửa sổ được không? — Vâng, mời.",
            "options": [
              "① て　② ちょっと",
              "① る　② どうぞ",
              "① て　② どうぞ",
              "① ない　② いいです"
            ],
            "correct": 2,
            "why": "Vて も いいですか → はい、どうぞ. → **{窓|まど}を{開|あ}けてもいいですか。はい、どうぞ。** 〔Mado o akete mo ii desu ka. Hai, douzo.〕 — Tôi mở cửa sổ được không? — Vâng, mời."
          },
          {
            "q": "{危|あぶ}ないです（①）、{押|お}（②）でください。　〔Abunai desu ((1)), o((2)) de kudasai.〕　— Nguy hiểm nên đừng đẩy.",
            "options": [
              "① から　② しない",
              "① が　② さない",
              "① から　② さない",
              "① まで　② して"
            ],
            "correct": 2,
            "why": "Lý do **から** + 押**さ**ないで. → **{危|あぶ}ないですから、{押|お}さないでください。** 〔Abunai desu kara, osanaide kudasai.〕 — Nguy hiểm nên đừng đẩy."
          },
          {
            "q": "{芝生|しばふ}（①）{入|はい}（②）でください。　〔Shibafu ((1)) hai((2)) de kudasai.〕　— Đừng vào bãi cỏ.",
            "options": [
              "① を　② らない",
              "① で　② りない",
              "① に　② らない",
              "① に　② ない"
            ],
            "correct": 2,
            "why": "Nơi vào + **に**; 入ります nhóm 1 → 入**らない**. → **{芝生|しばふ}に{入|はい}らないでください。** 〔Shibafu ni hairanaide kudasai.〕 — Đừng vào bãi cỏ."
          },
          {
            "q": "お{弁当|べんとう}（①）ここで{食|た}べ（②）でください。あちらのテーブルで{食|た}べてください。　〔Obentou ((1)) koko de tabe((2)) de kudasai. Achira no teeburu de tabete kudasai.〕　— Cơm hộp thì đừng ăn ở đây. Hãy ăn ở bàn đằng kia.",
            "options": [
              "① は　② ない",
              "① を　② ない",
              "① は　② らない",
              "① が　② ないて"
            ],
            "correct": 0,
            "why": "Chủ đề **は** + 食べ**ない**で (nhóm 2). → **お{弁当|べんとう}はここで{食|た}べないでください。あちらのテーブルで{食|た}べてください。** 〔Obentou wa koko de tabenaide kudasai. Achira no teeburu de tabete kudasai.〕 — Cơm hộp thì đừng ăn ở đây. Hãy ăn ở bàn đằng kia."
          },
          {
            "q": "{先生|せんせい}、このペンを{使|つか}っ（①）いいですか。——すみません、（②）……。　〔Sensei, kono pen o tsuka((1)) ii desu ka. — Sumimasen, ((2))....〕　— Thưa cô, em dùng cây bút này được không? — Xin lỗi, hơi…",
            "options": [
              "① て　② どうぞ",
              "① ても　② ちょっと",
              "① たら　② ちょっと",
              "① ても　② どうぞ"
            ],
            "correct": 1,
            "why": "Vて**も** いいですか → từ chối khéo **ちょっと……**. → **{先生|せんせい}、このペンを{使|つか}ってもいいですか。すみません、ちょっと。** 〔Sensei, kono pen o tsukatte mo ii desu ka. Sumimasen, chotto.〕 — Thưa cô, em dùng cây bút này được không? — Xin lỗi, hơi…"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np1-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Bạn là hướng dẫn viên. Xe sắp chạy, nhắc mọi người đừng trễ giờ tập hợp lần sau.",
            "options": [
              "{皆|みな}さん、{集合|しゅうごう}{時間|じかん}に{遅|おく}れてもいいですか。 (Minasan, shuugou jikan ni okurete mo ii desu ka.)",
              "{皆|みな}さん、{集合|しゅうごう}{時間|じかん}を{遅|おく}らないでください。 (Minasan, shuugou jikan o okuranaide kudasai.)",
              "{皆|みな}さん、{集合|しゅうごう}{時間|じかん}に{遅|おく}れないでください。 (Minasan, shuugou jikan ni okurenaide kudasai.)",
              "{皆|みな}さん、{集合|しゅうごう}{時間|じかん}に{遅|おく}れてください。 (Minasan, shuugou jikan ni okurete kudasai.)"
            ],
            "correct": 2,
            "why": "Nhắc nhở: 遅れないで ください (時間**に** 遅れます)."
          },
          {
            "q": "Ở bảo tàng bạn muốn hỏi nhân viên có được chụp ảnh không.",
            "options": [
              "すみません、{写真|しゃしん}を{撮|と}ってもいいですか。 (Sumimasen, shashin o totte mo ii desu ka.)",
              "すみません、{写真|しゃしん}を{撮|と}らないでください。 (Sumimasen, shashin o toranaide kudasai.)",
              "すみません、{写真|しゃしん}が{撮|と}ってもいいですか。 (Sumimasen, shashin ga totte mo ii desu ka.)",
              "すみません、{写真|しゃしん}を{撮|と}りましょう。 (Sumimasen, shashin o torimashou.)"
            ],
            "correct": 0,
            "why": "Xin phép: 撮って も いいですか."
          },
          {
            "q": "Khách hỏi để hành lý ở lối đi được không. Bạn (nhân viên) muốn khách để ở tủ khoá.",
            "options": [
              "すみません。{荷物|にもつ}はロッカーに{置|お}いてください。 (Sumimasen. Nimotsu wa rokkaa ni oite kudasai.)",
              "{荷物|にもつ}がロッカーに{置|お}いてください。 (Nimotsu ga rokkaa ni oite kudasai.)",
              "はい、どうぞ。 (Hai, douzo.)",
              "{荷物|にもつ}をロッカーに{置|お}かないでください。 (Nimotsu o rokkaa ni okanaide kudasai.)"
            ],
            "correct": 0,
            "why": "Chỉ cách khác: 荷物**は** ～てください."
          },
          {
            "q": "Bạn thấy trẻ con chơi gần đường xe chạy.",
            "options": [
              "{危|あぶ}ないですから、{道|みち}で{遊|あそ}ばないでください。 (Abunai desu kara, michi de asobanaide kudasai.)",
              "{危|あぶ}ないですけど、{道|みち}で{遊|あそ}んでもいいですか。 (Abunai desu kedo, michi de asonde mo ii desu ka.)",
              "{危|あぶ}ないですから、{道|みち}で{遊|あそ}びないでください。 (Abunai desu kara, michi de asobinaide kudasai.)",
              "{危|あぶ}ないですから、{道|みち}で{遊|あそ}んでください。 (Abunai desu kara, michi de asonde kudasai.)"
            ],
            "correct": 0,
            "why": "遊びます: び → ば → 遊ばないで."
          },
          {
            "q": "Bạn ngồi trên xe buýt; người bên cạnh hỏi 「カーテンを閉めてもいいですか」. Bạn muốn ngắm cảnh nên từ chối khéo.",
            "options": [
              "いいえ、{閉|し}めないでくださいよ。だめです。 (Iie, shimenaide kudasai yo. Dame desu.)",
              "すみません。ちょっと……。 (Sumimasen. Chotto....)",
              "はい、どうぞ。 (Hai, douzo.)",
              "カーテンを{閉|し}めてください。 (Kaaten o shimete kudasai.)"
            ],
            "correct": 1,
            "why": "Từ chối lịch sự: すみません、ちょっと……."
          },
          {
            "q": "Bạn muốn nói với cả đoàn: tờ giới thiệu thì lấy ở lối vào.",
            "options": [
              "パンフレットは{入|い}り{口|ぐち}をもらってください。 (Panfuretto wa iriguchi o moratte kudasai.)",
              "パンフレットを{入|い}り{口|ぐち}でもらわないでください。 (Panfuretto o iriguchi de morawanaide kudasai.)",
              "パンフレットが{入|い}り{口|ぐち}でもらってください。 (Panfuretto ga iriguchi de moratte kudasai.)",
              "パンフレットは{入|い}り{口|ぐち}でもらってください。 (Panfuretto wa iriguchi de moratte kudasai.)"
            ],
            "correct": 3,
            "why": "N は + nơi で + Vて ください."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**Vない で ください** (đừng) ↔ **Vて ください** (hãy) ↔ **Vて も いいですか** (xin phép). Ba mẫu này đi thành bộ ở mọi nơi công cộng.",
          "Trả lời xin phép: đồng ý **はい、どうぞ／いいですよ**; từ chối khéo **すみません、ちょっと……**; rồi chỉ cách khác bằng **N は ～てください** (を biến mất)."
        ]
      }
    ]
  },
  {
    "id": "lt-b10-np-2",
    "kind": "homework",
    "title": "Luyện thêm Bài 10 · Ngữ pháp 2 (ポイント 91, 92, 94, 96) — 集合: まだ～ていません · ～てきます · が見えます／聞こえます · N(nơi)を (~94 câu)",
    "goal": "Nói \"chưa làm\" bằng まだVていません, \"đi làm việc gì rồi quay lại ngay\" bằng Vてきます, nói cái mình nhìn thấy/nghe thấy bằng Nが見えます／聞こえます, và chỉ đường qua điện thoại bằng N(nơi)を渡ります／曲がります／歩きます — đúng tình huống gọi bạn đến điểm tập hợp.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**ポイント 91 — まだ Vて いません** = \"chưa V\" (việc lẽ ra sẽ làm nhưng tới giờ vẫn chưa). Câu hỏi đi kèm: **もう Vましたか** (đã V chưa?). Trả lời: はい、もう Vました／いいえ、**まだ Vて いません**. KHÔNG dùng ~~まだ Vませんでした~~ (đó là \"đã không làm\" — một việc trong quá khứ).",
          "**ポイント 92 — Vて きます** = \"đi V rồi quay lại\" (người nói sẽ trở về chỗ cũ): ちょっと トイレに 行って**きます** · ジュースを 買って**きます**. Khác hẳn Vて ください.",
          "**ポイント 94 — N が 見えます／聞こえます** = N tự hiện ra trong mắt / tự lọt vào tai (không cố ý). Luôn đi với **が**. Khác 見ます／聞きます (chủ động xem/nghe, đi với を).",
          "**ポイント 96 — N(nơi) を V** = đi QUA / rẽ Ở / băng QUA nơi đó: 橋**を** 渡ります · 交差点**を** 右**に** 曲がります · 道**を** まっすぐ 歩きます · 空**を** 飛びます. Hướng rẽ thì dùng **に**."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**もう Vましたか。** → はい、もう Vました。／いいえ、**まだ Vて いません**。(ポイント 91)",
          "**(ちょっと) Vて きます。** (ポイント 92) — 薬を 買ってきます · ワンさんを 探してきます.",
          "**(nơi) から N が 見えます／聞こえます。** · **よく 聞こえません。** (ポイント 94)",
          "**N(nơi) を 渡ります／歩きます · N(chỗ rẽ) を 右／左 に 曲がります。** (ポイント 96)"
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng ポイント một"
      },
      {
        "t": "mcq",
        "id": "lt-b10-np2-91",
        "title": "ポイント 91: まだ Vて いません (10 câu)",
        "items": [
          {
            "q": "A：もうチケットを{買|か}いましたか。B：いいえ、まだ＿＿。　〔A: mou chiketto o kaimashita ka. B: iie, mada __.〕　— A: Bạn mua vé chưa? B: Chưa, tôi chưa mua.",
            "options": [
              "{買|か}いませんでした",
              "{買|か}っています",
              "{買|か}いません",
              "{買|か}っていません"
            ],
            "correct": 3,
            "why": "Chưa = まだ **Vて いません**. → **A：もうチケットを{買|か}いましたか。B：いいえ、まだ{買|か}っていません。** 〔A: mou chiketto o kaimashita ka. B: iie, mada katte imasen.〕 — A: Bạn mua vé chưa? B: Chưa, tôi chưa mua."
          },
          {
            "q": "A：もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。B：はい、＿＿{食|た}べました。　〔A: mou hirugohan o tabemashita ka. B: hai, __ tabemashita.〕　— A: Bạn ăn trưa chưa? B: Rồi, tôi ăn rồi.",
            "options": [
              "まだ",
              "ちょっと",
              "もう",
              "よく"
            ],
            "correct": 2,
            "why": "Đã làm rồi: はい、**もう** Vました. → **A：もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。B：はい、もう{食|た}べました。** 〔A: mou hirugohan o tabemashita ka. B: hai, mou tabemashita.〕 — A: Bạn ăn trưa chưa? B: Rồi, tôi ăn rồi."
          },
          {
            "q": "{宿題|しゅくだい}はまだ＿＿。　〔Shukudai wa mada __.〕　— Bài tập thì tôi vẫn chưa viết.",
            "options": [
              "{書|か}きました",
              "{書|か}きませんでした",
              "{書|か}いています",
              "{書|か}いていません"
            ],
            "correct": 3,
            "why": "まだ + Vて いません. → **{宿題|しゅくだい}はまだ{書|か}いていません。** 〔Shukudai wa mada kaite imasen.〕 — Bài tập thì tôi vẫn chưa viết."
          },
          {
            "q": "A：もう{薬|くすり}を{飲|の}みましたか。B：いいえ、まだ＿＿。　〔A: mou kusuri o nomimashita ka. B: iie, mada __.〕　— A: Bạn uống thuốc chưa? B: Chưa, tôi chưa uống.",
            "options": [
              "{飲|の}んでいません",
              "{飲|の}んでいます",
              "{飲|の}みませんでした",
              "{飲|の}まないでください"
            ],
            "correct": 0,
            "why": "飲みます → 飲んで → まだ **飲んで いません**. → **A：もう{薬|くすり}を{飲|の}みましたか。B：いいえ、まだ{飲|の}んでいません。** 〔A: mou kusuri o nomimashita ka. B: iie, mada nonde imasen.〕 — A: Bạn uống thuốc chưa? B: Chưa, tôi chưa uống."
          },
          {
            "q": "マルコさんはまだ＿＿。{電話|でんわ}をかけましょう。　〔Maruko-san wa mada __. Denwa o kakemashou.〕　— Marco vẫn chưa đến. Gọi điện cho cậu ấy đi.",
            "options": [
              "{来|き}ています",
              "{来|き}ていません",
              "{来|き}ませんでした",
              "{来|こ}ないです"
            ],
            "correct": 1,
            "why": "Bạn chưa đến (tới giờ vẫn chưa) → まだ **来て いません**. → **マルコさんはまだ{来|き}ていません。{電話|でんわ}をかけましょう。** 〔Maruko-san wa mada kite imasen. Denwa o kakemashou.〕 — Marco vẫn chưa đến. Gọi điện cho cậu ấy đi."
          },
          {
            "q": "A：もう{集合|しゅうごう}{場所|ばしょ}を{探|さが}しましたか。B：いいえ、まだ＿＿。　〔A: mou shuugou basho o sagashimashita ka. B: iie, mada __.〕　— A: Bạn tìm điểm tập hợp chưa? B: Chưa, tôi chưa tìm.",
            "options": [
              "{探|さが}していました",
              "{探|さが}しませんでした",
              "{探|さが}していません",
              "{探|さが}しません"
            ],
            "correct": 2,
            "why": "探します → 探して → まだ **探して いません**. → **A：もう{集合|しゅうごう}{場所|ばしょ}を{探|さが}しましたか。B：いいえ、まだ{探|さが}していません。** 〔A: mou shuugou basho o sagashimashita ka. B: iie, mada sagashite imasen.〕 — A: Bạn tìm điểm tập hợp chưa? B: Chưa, tôi chưa tìm."
          },
          {
            "q": "A：もうお{土産|みやげ}を{買|か}いましたか。B：＿＿、まだです。　〔A: mou omiyage o kaimashita ka. B: __, mada desu.〕　— A: Bạn mua quà chưa? B: Chưa, vẫn chưa.",
            "options": [
              "ええと",
              "はい",
              "もう",
              "いいえ"
            ],
            "correct": 3,
            "why": "まだです = chưa (câu ngắn, Bài 6). → **A：もうお{土産|みやげ}を{買|か}いましたか。B：いいえ、まだです。** 〔A: mou omiyage o kaimashita ka. B: iie, mada desu.〕 — A: Bạn mua quà chưa? B: Chưa, vẫn chưa."
          },
          {
            "q": "{映画|えいが}のチケットはもう{予約|よやく}しましたか。——いいえ、まだ{予約|よやく}して＿＿。　〔Eiga no chiketto wa mou yoyaku shimashita ka. — Iie, mada yoyaku shite __.〕　— Vé xem phim bạn đặt chưa? — Chưa, vẫn chưa đặt.",
            "options": [
              "いました",
              "ありません",
              "いません",
              "ください"
            ],
            "correct": 2,
            "why": "まだ Vて **いません**. → **{映画|えいが}のチケットはもう{予約|よやく}しましたか。——いいえ、まだ{予約|よやく}していません。** 〔Eiga no chiketto wa mou yoyaku shimashita ka. — Iie, mada yoyaku shite imasen.〕 — Vé xem phim bạn đặt chưa? — Chưa, vẫn chưa đặt."
          },
          {
            "q": "A：もうレポートを{出|だ}しましたか。B：はい、{昨日|きのう}＿＿。　〔A: mou repooto o dashimashita ka. B: hai, kinou __.〕　— A: Bạn nộp báo cáo chưa? B: Rồi, nộp hôm qua.",
            "options": [
              "まだです",
              "{出|だ}しました",
              "{出|だ}していません",
              "{出|だ}しません"
            ],
            "correct": 1,
            "why": "Đã làm (có thời điểm 昨日) → **Vました**. → **A：もうレポートを{出|だ}しましたか。B：はい、{昨日|きのう}{出|だ}しました。** 〔A: mou repooto o dashimashita ka. B: hai, kinou dashimashita.〕 — A: Bạn nộp báo cáo chưa? B: Rồi, nộp hôm qua."
          },
          {
            "q": "バスはまだ＿＿。{十時|じゅうじ}に{出|で}ます。　〔Basu wa mada __. Juuji ni demasu.〕　— Xe buýt vẫn chưa chạy. 10 giờ mới xuất phát.",
            "options": [
              "{出|で}ていません",
              "{出|で}ました",
              "{出|で}ませんでした",
              "{出|で}ています"
            ],
            "correct": 0,
            "why": "Xe vẫn chưa chạy → まだ **出て いません**. → **バスはまだ{出|で}ていません。{十時|じゅうじ}に{出|で}ます。** 〔Basu wa mada dete imasen. Juuji ni demasu.〕 — Xe buýt vẫn chưa chạy. 10 giờ mới xuất phát."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np2-92",
        "title": "ポイント 92: Vて きます (đi V rồi quay lại) (10 câu)",
        "items": [
          {
            "q": "ちょっとトイレに＿＿きます。　〔Chotto toire ni __ kimasu.〕　— Tôi đi vệ sinh một lát rồi quay lại.",
            "options": [
              "{行|い}き",
              "{行|い}って",
              "{行|い}く",
              "{行|い}かない"
            ],
            "correct": 1,
            "why": "Đi rồi về = **Vて** きます → 行って きます. → **ちょっとトイレに{行|い}ってきます。** 〔Chotto toire ni itte kimasu.〕 — Tôi đi vệ sinh một lát rồi quay lại."
          },
          {
            "q": "のどがかわきました。ジュースを{買|か}って＿＿。　〔Nodo ga kawakimashita. Juusu o katte __.〕　— Khát rồi. Tôi đi mua nước ép rồi về.",
            "options": [
              "きます",
              "いきます",
              "います",
              "ください"
            ],
            "correct": 0,
            "why": "Đi mua rồi quay lại = 買って **きます**. → **のどがかわきました。ジュースを{買|か}ってきます。** 〔Nodo ga kawakimashita. Juusu o katte kimasu.〕 — Khát rồi. Tôi đi mua nước ép rồi về."
          },
          {
            "q": "ワンさんがいませんね。ちょっと＿＿きます。　〔Wan-san ga imasen ne. Chotto __ kimasu.〕　— Không thấy Wang nhỉ. Tôi đi tìm một chút rồi quay lại.",
            "options": [
              "{探|さが}し",
              "{探|さが}して",
              "{探|さが}さない",
              "{探|さが}す"
            ],
            "correct": 1,
            "why": "探します → **探して** きます. → **ワンさんがいませんね。ちょっと{探|さが}してきます。** 〔Wan-san ga imasen ne. Chotto sagashite kimasu.〕 — Không thấy Wang nhỉ. Tôi đi tìm một chút rồi quay lại."
          },
          {
            "q": "{荷物|にもつ}をバスに＿＿きます。　〔Nimotsu o basu ni __ kimasu.〕　— Tôi đi để hành lý lên xe buýt rồi quay lại.",
            "options": [
              "{置|お}きて",
              "{置|お}いて",
              "{置|お}って",
              "{置|お}んで"
            ],
            "correct": 1,
            "why": "置きます → **置いて** きます. → **{荷物|にもつ}をバスに{置|お}いてきます。** 〔Nimotsu o basu ni oite kimasu.〕 — Tôi đi để hành lý lên xe buýt rồi quay lại."
          },
          {
            "q": "パンフレットを＿＿きます。ここで{待|ま}っていてください。　〔Panfuretto o __ kimasu. Koko de matte ite kudasai.〕　— Tôi đi lấy tờ giới thiệu rồi về. Bạn chờ ở đây nhé.",
            "options": [
              "もらいて",
              "もらう",
              "もらんで",
              "もらって"
            ],
            "correct": 3,
            "why": "もらいます → **もらって** きます. → **パンフレットをもらってきます。ここで{待|ま}っていてください。** 〔Panfuretto o moratte kimasu. Koko de matte ite kudasai.〕 — Tôi đi lấy tờ giới thiệu rồi về. Bạn chờ ở đây nhé."
          },
          {
            "q": "A：どこへ{行|い}きますか。B：ちょっと{郵便局|ゆうびんきょく}へ＿＿。　〔A: doko e ikimasu ka. B: chotto yuubinkyoku e __.〕　— A: Bạn đi đâu đấy? B: Tôi đi bưu điện một chút rồi về.",
            "options": [
              "{行|い}きました",
              "{行|い}ってきます",
              "{行|い}ってください",
              "{行|い}かないでください"
            ],
            "correct": 1,
            "why": "Trả lời khi rời đi một lát: **行って きます**. → **A：どこへ{行|い}きますか。B：ちょっと{郵便局|ゆうびんきょく}へ{行|い}ってきます。** 〔A: doko e ikimasu ka. B: chotto yuubinkyoku e itte kimasu.〕 — A: Bạn đi đâu đấy? B: Tôi đi bưu điện một chút rồi về."
          },
          {
            "q": "お{金|かね}がありません。ちょっと{銀行|ぎんこう}へ{行|い}って＿＿。　〔Okane ga arimasen. Chotto ginkou e itte __.〕　— Tôi hết tiền. Tôi đi ngân hàng một lát rồi về.",
            "options": [
              "きます",
              "います",
              "いません",
              "ください"
            ],
            "correct": 0,
            "why": "Đi ngân hàng rồi quay lại = 行って **きます**. → **お{金|かね}がありません。ちょっと{銀行|ぎんこう}へ{行|い}ってきます。** 〔Okane ga arimasen. Chotto ginkou e itte kimasu.〕 — Tôi hết tiền. Tôi đi ngân hàng một lát rồi về."
          },
          {
            "q": "{家|いえ}に{電話|でんわ}を＿＿きます。　〔Ie ni denwa o __ kimasu.〕　— Tôi đi gọi điện về nhà rồi quay lại.",
            "options": [
              "かけて",
              "かけ",
              "かけって",
              "かきて"
            ],
            "correct": 0,
            "why": "かけます (nhóm 2) → **かけて** きます. → **{家|いえ}に{電話|でんわ}をかけてきます。** 〔Ie ni denwa o kakete kimasu.〕 — Tôi đi gọi điện về nhà rồi quay lại."
          },
          {
            "q": "おなかがすきました。パンを＿＿きます。　〔Onaka ga sukimashita. Pan o __ kimasu.〕　— Đói rồi. Tôi đi mua bánh mì rồi về.",
            "options": [
              "{買|か}って",
              "{買|か}う",
              "{買|か}んで",
              "{買|か}いて"
            ],
            "correct": 0,
            "why": "買います → **買って** きます. → **おなかがすきました。パンを{買|か}ってきます。** 〔Onaka ga sukimashita. Pan o katte kimasu.〕 — Đói rồi. Tôi đi mua bánh mì rồi về."
          },
          {
            "q": "A：ちょっと{写真|しゃしん}を{撮|と}ってきます。B：はい、{早|はや}く＿＿ね。　〔A: chotto shashin o totte kimasu. B: hai, hayaku __ ne.〕　— A: Tôi đi chụp ảnh một chút rồi quay lại. B: Ừ, về nhanh nhé.",
            "options": [
              "{撮|と}らないでください",
              "{帰|かえ}ってきてください",
              "{行|い}ってください",
              "{帰|かえ}らないでください"
            ],
            "correct": 1,
            "why": "Bảo người kia quay lại nhanh nhé: 早く **帰ってきて** ください. → **A：ちょっと{写真|しゃしん}を{撮|と}ってきます。B：はい、{早|はや}く{帰|かえ}ってきてくださいね。** 〔A: chotto shashin o totte kimasu. B: hai, hayaku kaette kite kudasai ne.〕 — A: Tôi đi chụp ảnh một chút rồi quay lại. B: Ừ, về nhanh nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np2-94",
        "title": "ポイント 94: N が 見えます／聞こえます (10 câu)",
        "items": [
          {
            "q": "ここから{海|うみ}＿＿{見|み}えます。　〔Koko kara umi __ miemasu.〕　— Từ đây nhìn thấy biển.",
            "options": [
              "を",
              "で",
              "に",
              "が"
            ],
            "correct": 3,
            "why": "見えます đi với **が**. → **ここから{海|うみ}が{見|み}えます。** 〔Koko kara umi ga miemasu.〕 — Từ đây nhìn thấy biển."
          },
          {
            "q": "{鳥|とり}の{声|こえ}＿＿{聞|き}こえます。　〔Tori no koe __ kikoemasu.〕　— Nghe thấy tiếng chim.",
            "options": [
              "へ",
              "を",
              "で",
              "が"
            ],
            "correct": 3,
            "why": "聞こえます đi với **が**. → **{鳥|とり}の{声|こえ}が{聞|き}こえます。** 〔Tori no koe ga kikoemasu.〕 — Nghe thấy tiếng chim."
          },
          {
            "q": "すみません、よく＿＿。もう{一度|いちど}{言|い}ってください。　〔Sumimasen, yoku __. Mou ichido itte kudasai.〕　— Xin lỗi, tôi nghe không rõ. Nói lại lần nữa giúp tôi.",
            "options": [
              "{見|み}えません",
              "わかりません",
              "{聞|き}こえません",
              "{聞|き}きません"
            ],
            "correct": 2,
            "why": "Điện thoại rè, không nghe rõ → よく **聞こえません**. → **すみません、よく{聞|き}こえません。もう{一度|いちど}{言|い}ってください。** 〔Sumimasen, yoku kikoemasen. Mou ichido itte kudasai.〕 — Xin lỗi, tôi nghe không rõ. Nói lại lần nữa giúp tôi."
          },
          {
            "q": "A：そこから{何|なに}が＿＿か。B：{大|おお}きい{橋|はし}が{見|み}えます。　〔A: soko kara nani ga __ ka. B: ookii hashi ga miemasu.〕　— A: Từ đó bạn nhìn thấy gì? B: Tôi thấy cây cầu lớn.",
            "options": [
              "{見|み}ます",
              "{聞|き}きます",
              "{見|み}えます",
              "{探|さが}します"
            ],
            "correct": 2,
            "why": "Hỏi bạn đang thấy gì: 何が **見えますか**. → **A：そこから{何|なに}が{見|み}えますか。B：{大|おお}きい{橋|はし}が{見|み}えます。** 〔A: soko kara nani ga miemasu ka. B: ookii hashi ga miemasu.〕 — A: Từ đó bạn nhìn thấy gì? B: Tôi thấy cây cầu lớn."
          },
          {
            "q": "{観覧車|かんらんしゃ}から{富士山|ふじさん}が＿＿。　〔Kanransha kara Fujisan ga __.〕　— Từ vòng đu quay nhìn thấy núi Phú Sĩ.",
            "options": [
              "{見|み}えます",
              "{見|み}ます",
              "{聞|き}こえます",
              "{見|み}せます"
            ],
            "correct": 0,
            "why": "Núi Phú Sĩ tự hiện ra trong mắt → **見えます**. → **{観覧車|かんらんしゃ}から{富士山|ふじさん}が{見|み}えます。** 〔Kanransha kara Fujisan ga miemasu.〕 — Từ vòng đu quay nhìn thấy núi Phú Sĩ."
          },
          {
            "q": "{夜|よる}、{電車|でんしゃ}の＿＿が{聞|き}こえます。　〔Yoru, densha no __ ga kikoemasu.〕　— Ban đêm nghe thấy tiếng tàu điện.",
            "options": [
              "{道|みち}",
              "{音|おと}",
              "{声|こえ}",
              "{手|て}"
            ],
            "correct": 1,
            "why": "Tiếng của đồ vật → **音**. → **{夜|よる}、{電車|でんしゃ}の{音|おと}が{聞|き}こえます。** 〔Yoru, densha no oto ga kikoemasu.〕 — Ban đêm nghe thấy tiếng tàu điện."
          },
          {
            "q": "{前|まえ}に{大|おお}きいビルがありますから、{海|うみ}が＿＿。　〔Mae ni ookii biru ga arimasu kara, umi ga __.〕　— Phía trước có toà nhà lớn nên không nhìn thấy biển.",
            "options": [
              "{見|み}せません",
              "{聞|き}こえません",
              "{見|み}えません",
              "{見|み}ません"
            ],
            "correct": 2,
            "why": "Bị toà nhà che nên biển không hiện ra trong mắt → **見えません**. → **{前|まえ}に{大|おお}きいビルがありますから、{海|うみ}が{見|み}えません。** 〔Mae ni ookii biru ga arimasu kara, umi ga miemasen.〕 — Phía trước có toà nhà lớn nên không nhìn thấy biển."
          },
          {
            "q": "{毎晩|まいばん}ラジオで{日本|にほん}の{音楽|おんがく}を＿＿。　〔Maiban rajio de Nihon no ongaku o __.〕　— Tối nào tôi cũng nghe nhạc Nhật trên radio.",
            "options": [
              "{聞|き}こえません",
              "{聞|き}きます",
              "{見|み}えます",
              "{聞|き}こえます"
            ],
            "correct": 1,
            "why": "Chủ động nghe radio → **聞きます** (を). → **{毎晩|まいばん}ラジオで{日本|にほん}の{音楽|おんがく}を{聞|き}きます。** 〔Maiban rajio de Nihon no ongaku o kikimasu.〕 — Tối nào tôi cũng nghe nhạc Nhật trên radio."
          },
          {
            "q": "{窓|まど}から{子|こ}どもたちの＿＿が{聞|き}こえます。　〔Mado kara kodomo tachi no __ ga kikoemasu.〕　— Từ cửa sổ nghe thấy tiếng bọn trẻ.",
            "options": [
              "{声|こえ}",
              "{手|て}",
              "{音|おと}",
              "えさ"
            ],
            "correct": 0,
            "why": "Tiếng người → **声**. → **{窓|まど}から{子|こ}どもたちの{声|こえ}が{聞|き}こえます。** 〔Mado kara kodomo tachi no koe ga kikoemasu.〕 — Từ cửa sổ nghe thấy tiếng bọn trẻ."
          },
          {
            "q": "A：{右|みぎ}に{何|なに}が{見|み}えますか。B：ええと……{銀行|ぎんこう}＿＿{見|み}えます。　〔A: migi ni nani ga miemasu ka. B: eeto... Ginkou __ miemasu.〕　— A: Bên phải bạn thấy gì? B: Ờ… tôi thấy ngân hàng.",
            "options": [
              "に",
              "は",
              "が",
              "を"
            ],
            "correct": 2,
            "why": "N **が** 見えます. → **A：{右|みぎ}に{何|なに}が{見|み}えますか。B：ええと……{銀行|ぎんこう}が{見|み}えます。** 〔A: migi ni nani ga miemasu ka. B: eeto... Ginkou ga miemasu.〕 — A: Bên phải bạn thấy gì? B: Ờ… tôi thấy ngân hàng."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np2-96",
        "title": "ポイント 96: N (nơi) を V — đi qua, rẽ ở, băng qua (10 câu)",
        "items": [
          {
            "q": "あの{橋|はし}＿＿{渡|わた}ってください。　〔Ano hashi __ watatte kudasai.〕　— Hãy qua cây cầu kia.",
            "options": [
              "に",
              "へ",
              "で",
              "を"
            ],
            "correct": 3,
            "why": "Nơi đi qua → **を**. → **あの{橋|はし}を{渡|わた}ってください。** 〔Ano hashi o watatte kudasai.〕 — Hãy qua cây cầu kia."
          },
          {
            "q": "{次|つぎ}の{交差点|こうさてん}＿＿{右|みぎ}に{曲|ま}がってください。　〔Tsugi no kousaten __ migi ni magatte kudasai.〕　— Đến ngã tư tiếp theo thì rẽ phải.",
            "options": [
              "が",
              "に",
              "を",
              "で"
            ],
            "correct": 2,
            "why": "Chỗ rẽ → **を**; hướng rẽ → に. → **{次|つぎ}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。** 〔Tsugi no kousaten o migi ni magatte kudasai.〕 — Đến ngã tư tiếp theo thì rẽ phải."
          },
          {
            "q": "{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}＿＿{曲|ま}がります。　〔Futatsume no shingou o hidari __ magarimasu.〕　— Rẽ trái ở đèn giao thông thứ hai.",
            "options": [
              "が",
              "に",
              "を",
              "で"
            ],
            "correct": 1,
            "why": "Hướng rẽ → **に** (左に 曲がります). → **{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}に{曲|ま}がります。** 〔Futatsume no shingou o hidari ni magarimasu.〕 — Rẽ trái ở đèn giao thông thứ hai."
          },
          {
            "q": "この{道|みち}＿＿まっすぐ{歩|ある}いてください。　〔Kono michi __ massugu aruite kudasai.〕　— Hãy đi bộ thẳng con đường này.",
            "options": [
              "で",
              "に",
              "が",
              "を"
            ],
            "correct": 3,
            "why": "Đi dọc con đường → 道**を** 歩きます. → **この{道|みち}をまっすぐ{歩|ある}いてください。** 〔Kono michi o massugu aruite kudasai.〕 — Hãy đi bộ thẳng con đường này."
          },
          {
            "q": "{鳥|とり}が{空|そら}＿＿{飛|と}んでいます。　〔Tori ga sora __ tonde imasu.〕　— Con chim đang bay trên trời.",
            "options": [
              "で",
              "に",
              "が",
              "を"
            ],
            "correct": 3,
            "why": "Bay ngang qua bầu trời → 空**を** 飛びます. → **{鳥|とり}が{空|そら}を{飛|と}んでいます。** 〔Tori ga sora o tonde imasu.〕 — Con chim đang bay trên trời."
          },
          {
            "q": "{日曜日|にちようび}は{公園|こうえん}＿＿{歩|ある}きます。　〔Nichiyoubi wa kouen __ arukimasu.〕　— Chủ nhật tôi đi dạo trong công viên.",
            "options": [
              "へ",
              "が",
              "を",
              "の"
            ],
            "correct": 2,
            "why": "Đi dạo khắp công viên → 公園**を** 歩きます. → **{日曜日|にちようび}は{公園|こうえん}を{歩|ある}きます。** 〔Nichiyoubi wa kouen o arukimasu.〕 — Chủ nhật tôi đi dạo trong công viên."
          },
          {
            "q": "コンビニの{角|かど}を＿＿。　〔Konbini no kado o __.〕　— Rẽ phải ở góc cửa hàng tiện lợi.",
            "options": [
              "{右|みぎ}を{曲|ま}がります",
              "{右|みぎ}が{曲|ま}がります",
              "{右|みぎ}に{曲|ま}がります",
              "{右|みぎ}で{曲|ま}がります"
            ],
            "correct": 2,
            "why": "Chỗ rẽ を + hướng **に** + 曲がります. → **コンビニの{角|かど}を{右|みぎ}に{曲|ま}がります。** 〔Konbini no kado o migi ni magarimasu.〕 — Rẽ phải ở góc cửa hàng tiện lợi."
          },
          {
            "q": "{橋|はし}を＿＿、{左|ひだり}に{曲|ま}がってください。　〔Hashi o __, hidari ni magatte kudasai.〕　— Qua cầu rồi rẽ trái.",
            "options": [
              "{渡|わた}って",
              "{渡|わた}いて",
              "{渡|わた}んで",
              "{渡|わた}りて"
            ],
            "correct": 0,
            "why": "渡ります → **渡って** (nối bước, Bài 9). → **{橋|はし}を{渡|わた}って、{左|ひだり}に{曲|ま}がってください。** 〔Hashi o watatte, hidari ni magatte kudasai.〕 — Qua cầu rồi rẽ trái."
          },
          {
            "q": "{信号|しんごう}＿＿{渡|わた}って、まっすぐ{行|い}ってください。　〔Shingou __ watatte, massugu itte kudasai.〕　— Băng qua chỗ đèn giao thông rồi đi thẳng.",
            "options": [
              "で",
              "へ",
              "に",
              "を"
            ],
            "correct": 3,
            "why": "Băng qua chỗ đèn (băng qua đường) → **を**. → **{信号|しんごう}を{渡|わた}って、まっすぐ{行|い}ってください。** 〔Shingou o watatte, massugu itte kudasai.〕 — Băng qua chỗ đèn giao thông rồi đi thẳng."
          },
          {
            "q": "{三|みっ}つ{目|め}の{角|かど}を＿＿に{曲|ま}がってください。　〔Mittsume no kado o __ ni magatte kudasai.〕　— Rẽ trái ở góc phố thứ ba.",
            "options": [
              "{左|ひだり}で",
              "{左|ひだり}",
              "{左|ひだり}を",
              "{左|ひだり}の"
            ],
            "correct": 1,
            "why": "Hướng: 左**に**. → **{三|みっ}つ{目|め}の{角|かど}を{左|ひだり}に{曲|ま}がってください。** 〔Mittsume no kado o hidari ni magatte kudasai.〕 — Rẽ trái ở góc phố thứ ba."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chỉ đường theo bản đồ · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b10-np2-ban-do",
        "title": "Nhìn bản đồ (mô tả) → câu chỉ đường đúng (8 câu)",
        "items": [
          {
            "q": "Bản đồ: từ ga đi thẳng, đến đèn giao thông THỨ HAI rẽ PHẢI.",
            "options": [
              "{駅|えき}からまっすぐ{行|い}って、{二|ふた}つ{目|め}の{信号|しんごう}に{右|みぎ}を{曲|ま}がってください。 (Eki kara massugu itte, futatsume no shingou ni migi o magatte kudasai.)",
              "{駅|えき}からまっすぐ{行|い}って、{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}に{曲|ま}がってください。 (Eki kara massugu itte, futatsume no shingou o hidari ni magatte kudasai.)",
              "{駅|えき}からまっすぐ{行|い}って、{二|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。 (Eki kara massugu itte, futatsume no shingou o migi ni magatte kudasai.)",
              "{駅|えき}からまっすぐ{行|い}って、{二|ふた}つ{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。 (Eki kara massugu itte, futatsu shingou o migi ni magatte kudasai.)"
            ],
            "correct": 2,
            "why": "\"thứ hai\" = 二つ目の; chỗ rẽ を, hướng に."
          },
          {
            "q": "Bản đồ: qua cầu, rồi rẽ trái ở ngã tư đầu tiên.",
            "options": [
              "{橋|はし}を{渡|わた}って、{一|ひと}つ{目|め}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。 (Hashi o watatte, hitotsume no kousaten o migi ni magatte kudasai.)",
              "{橋|はし}に{渡|わた}って、{一|ひと}つ{目|め}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がってください。 (Hashi ni watatte, hitotsume no kousaten o hidari ni magatte kudasai.)",
              "{橋|はし}を{渡|わた}って、{一|ひと}つの{交差点|こうさてん}で{左|ひだり}に{曲|ま}がりますか。 (Hashi o watatte, hitotsu no kousaten de hidari ni magarimasu ka.)",
              "{橋|はし}を{渡|わた}って、{一|ひと}つ{目|め}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がってください。 (Hashi o watatte, hitotsume no kousaten o hidari ni magatte kudasai.)"
            ],
            "correct": 3,
            "why": "橋**を** 渡って · 一つ目の 交差点**を** 左**に**."
          },
          {
            "q": "Bản đồ: rẽ phải ở góc cửa hàng tiện lợi, đi thẳng, bên trái thấy ngân hàng.",
            "options": [
              "コンビニの{角|かど}に{右|みぎ}を{曲|ま}がって、まっすぐ{行|い}ってください。{左|ひだり}に{銀行|ぎんこう}が{見|み}ます。 (Konbini no kado ni migi o magatte, massugu itte kudasai. Hidari ni ginkou ga mimasu.)",
              "コンビニの{角|かど}を{左|ひだり}に{曲|ま}がって、まっすぐ{行|い}ってください。{右|みぎ}に{銀行|ぎんこう}が{見|み}えます。 (Konbini no kado o hidari ni magatte, massugu itte kudasai. Migi ni ginkou ga miemasu.)",
              "コンビニの{角|かど}を{右|みぎ}に{曲|ま}がって、まっすぐ{行|い}ってください。{左|ひだり}に{銀行|ぎんこう}が{見|み}えます。 (Konbini no kado o migi ni magatte, massugu itte kudasai. Hidari ni ginkou ga miemasu.)",
              "コンビニの{角|かど}を{右|みぎ}に{曲|ま}がって、まっすぐ{行|い}ってください。{左|ひだり}に{銀行|ぎんこう}を{見|み}えます。 (Konbini no kado o migi ni magatte, massugu itte kudasai. Hidari ni ginkou o miemasu.)"
            ],
            "correct": 2,
            "why": "Rẽ phải ở góc; ngân hàng bên trái **が 見えます**."
          },
          {
            "q": "Bản đồ: điểm tập hợp ở trước toà nhà KS, ngay sau đèn giao thông thứ ba.",
            "options": [
              "{三|みっ}つ{目|め}の{信号|しんごう}に{渡|わた}ってください。KSビルの{前|まえ}が{集合|しゅうごう}{場所|ばしょ}です。 (Mittsume no shingou ni watatte kudasai. KS biru no mae ga shuugou basho desu.)",
              "{三|みっ}つ{目|め}の{信号|しんごう}を{渡|わた}ってください。KSビルの{前|まえ}が{集合|しゅうごう}{場所|ばしょ}です。 (Mittsume no shingou o watatte kudasai. KS biru no mae ga shuugou basho desu.)",
              "{三|さん}の{信号|しんごう}を{渡|わた}ってください。KSビルの{前|まえ}が{集合|しゅうごう}{場所|ばしょ}です。 (San no shingou o watatte kudasai. KS biru no mae ga shuugou basho desu.)",
              "{三|みっ}つ{目|め}の{信号|しんごう}を{渡|わた}らないでください。KSビルの{前|まえ}が{集合|しゅうごう}{場所|ばしょ}です。 (Mittsume no shingou o wataranaide kudasai. KS biru no mae ga shuugou basho desu.)"
            ],
            "correct": 1,
            "why": "三つ目の 信号**を** 渡って."
          },
          {
            "q": "Bạn đang đứng ở ngã tư, hỏi bạn qua điện thoại: \"Từ đó bạn thấy gì?\"",
            "options": [
              "そこで{何|なに}を{見|み}ていますか。 (Soko de nani o mite imasu ka.)",
              "そこから{何|なに}が{見|み}ますか。 (Soko kara nani ga mimasu ka.)",
              "そこから{何|なに}を{見|み}えますか。 (Soko kara nani o miemasu ka.)",
              "そこから{何|なに}が{見|み}えますか。 (Soko kara nani ga miemasu ka.)"
            ],
            "correct": 3,
            "why": "Hỏi cái đang hiện ra trong tầm mắt: 何**が** 見えますか."
          },
          {
            "q": "Bạn nói: \"Tôi đang ở góc phố, thấy đèn giao thông và một cây cầu.\"",
            "options": [
              "{今|いま}、{角|かど}をいます。{信号|しんごう}と{橋|はし}が{見|み}えます。 (Ima, kado o imasu. Shingou to hashi ga miemasu.)",
              "{今|いま}、{角|かど}にいます。{信号|しんごう}と{橋|はし}が{見|み}えます。 (Ima, kado ni imasu. Shingou to hashi ga miemasu.)",
              "{今|いま}、{角|かど}にあります。{信号|しんごう}と{橋|はし}が{見|み}えます。 (Ima, kado ni arimasu. Shingou to hashi ga miemasu.)",
              "{今|いま}、{角|かど}にいます。{信号|しんごう}と{橋|はし}を{見|み}えます。 (Ima, kado ni imasu. Shingou to hashi o miemasu.)"
            ],
            "correct": 1,
            "why": "Người ở → います; N **が** 見えます."
          },
          {
            "q": "Bản đồ: đi bộ dọc bờ sông, qua cầu thứ hai.",
            "options": [
              "{川|かわ}の{道|みち}に{歩|ある}いて、{二|ふた}つ{目|め}の{橋|はし}を{渡|わた}ってください。 (Kawa no michi ni aruite, futatsume no hashi o watatte kudasai.)",
              "{川|かわ}の{道|みち}を{歩|ある}いて、{二|ふた}つ{目|め}の{橋|はし}に{渡|わた}ってください。 (Kawa no michi o aruite, futatsume no hashi ni watatte kudasai.)",
              "{川|かわ}の{道|みち}を{歩|ある}きて、{二|ふた}つ{目|め}の{橋|はし}を{渡|わた}ってください。 (Kawa no michi o arukite, futatsume no hashi o watatte kudasai.)",
              "{川|かわ}の{道|みち}を{歩|ある}いて、{二|ふた}つ{目|め}の{橋|はし}を{渡|わた}ってください。 (Kawa no michi o aruite, futatsume no hashi o watatte kudasai.)"
            ],
            "correct": 3,
            "why": "道**を** 歩いて · 橋**を** 渡って (歩きます → 歩いて)."
          },
          {
            "q": "Bạn đến muộn, chưa tìm thấy điểm tập hợp. Gọi điện báo bạn:",
            "options": [
              "すみません。まだ{集合|しゅうごう}{場所|ばしょ}がわかりません。{道|みち}を{探|さが}してきますか。 (Sumimasen. Mada shuugou basho ga wakarimasen. Michi o sagashite kimasu ka.)",
              "すみません。まだ{集合|しゅうごう}{場所|ばしょ}がわかりません。{道|みち}を{探|さが}しています。 (Sumimasen. Mada shuugou basho ga wakarimasen. Michi o sagashite imasu.)",
              "すみません。もう{集合|しゅうごう}{場所|ばしょ}がわかりません。{道|みち}が{探|さが}しています。 (Sumimasen. Mou shuugou basho ga wakarimasen. Michi ga sagashite imasu.)",
              "すみません。まだ{集合|しゅうごう}{場所|ばしょ}をわかりません。{道|みち}を{探|さが}しています。 (Sumimasen. Mada shuugou basho o wakarimasen. Michi o sagashite imasu.)"
            ],
            "correct": 1,
            "why": "わかります đi với **が**; 道を 探して います = đang tìm đường."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np2-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "いいえ、まだです。 (Iie, mada desu.)",
              "いいえ、まだ{食|た}べていません。 (Iie, mada tabete imasen.)",
              "いいえ、まだ{食|た}べませんでした。 (Iie, mada tabemasendeshita.)",
              "はい、もう{食|た}べました。 (Hai, mou tabemashita.)"
            ],
            "correct": 2,
            "why": "Trả lời \"chưa\" cho もう～ましたか: まだ **Vて いません**, không dùng ～ませんでした."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "ここから{山|やま}を{見|み}えます。 (Koko kara yama o miemasu.)",
              "ここで{山|やま}の{写真|しゃしん}を{見|み}ます。 (Koko de yama no shashin o mimasu.)",
              "ここから{山|やま}が{見|み}えます。 (Koko kara yama ga miemasu.)",
              "ここから{山|やま}は{見|み}えません。 (Koko kara yama wa miemasen.)"
            ],
            "correct": 0,
            "why": "見えます đi với **が** (phủ định đối chiếu dùng は được)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{音|おと}が{聞|き}こえません。 (Oto ga kikoemasen.)",
              "よく{聞|き}こえません。もう{一度|いちど}お{願|ねが}いします。 (Yoku kikoemasen. Mou ichido onegaishimasu.)",
              "{声|こえ}がよく{聞|き}こえます。 (Koe ga yoku kikoemasu.)",
              "よく{聞|き}きません。もう{一度|いちど}お{願|ねが}いします。 (Yoku kikimasen. Mou ichido onegaishimasu.)"
            ],
            "correct": 3,
            "why": "Không nghe rõ = よく **聞こえません**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{橋|はし}に{渡|わた}ってください。 (Hashi ni watatte kudasai.)",
              "{交差点|こうさてん}を{渡|わた}ってください。 (Kousaten o watatte kudasai.)",
              "{道|みち}を{渡|わた}ってください。 (Michi o watatte kudasai.)",
              "{橋|はし}を{渡|わた}ってください。 (Hashi o watatte kudasai.)"
            ],
            "correct": 0,
            "why": "Nơi đi qua → **を**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{角|かど}を{左|ひだり}に{曲|ま}がります。 (Kado o hidari ni magarimasu.)",
              "{交差点|こうさてん}を{右|みぎ}に{曲|ま}がります。 (Kousaten o migi ni magarimasu.)",
              "{二|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がります。 (Futatsume no shingou o migi ni magarimasu.)",
              "{交差点|こうさてん}を{右|みぎ}を{曲|ま}がります。 (Kousaten o migi o magarimasu.)"
            ],
            "correct": 3,
            "why": "Hướng rẽ dùng **に**: 右**に** 曲がります."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "ちょっと{電話|でんわ}をかけてきます。 (Chotto denwa o kakete kimasu.)",
              "ちょっとトイレに{行|い}ってきます。 (Chotto toire ni itte kimasu.)",
              "ちょっとジュースを{買|か}ってきます。 (Chotto juusu o katte kimasu.)",
              "ちょっとトイレに{行|い}きてきます。 (Chotto toire ni ikite kimasu.)"
            ],
            "correct": 3,
            "why": "行きます → **行って** (ngoại lệ) → 行って きます."
          },
          {
            "q": "Câu nào SAI? (đang thấy trước mắt)",
            "options": [
              "{大|おお}きいビルが{見|み}えません。 (Ookii biru ga miemasen.)",
              "{大|おお}きいビルが{見|み}ます。 (Ookii biru ga mimasu.)",
              "{右|みぎ}に{大|おお}きいビルが{見|み}えます。 (Migi ni ookii biru ga miemasu.)",
              "{大|おお}きいビルが{見|み}えます。 (Ookii biru ga miemasu.)"
            ],
            "correct": 1,
            "why": "Cái tự hiện ra trong mắt → **見えます** (見ます cần người chủ động xem + を)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "もう{薬|くすり}を{飲|の}みましたか。——はい、もう{飲|の}みました。 (Mou kusuri o nomimashita ka. — Hai, mou nomimashita.)",
              "もう{薬|くすり}を{飲|の}みましたか。——いいえ、まだ{飲|の}んでいません。 (Mou kusuri o nomimashita ka. — Iie, mada nonde imasen.)",
              "もう{薬|くすり}を{飲|の}みましたか。——いいえ、まだです。 (Mou kusuri o nomimashita ka. — Iie, mada desu.)",
              "もう{薬|くすり}を{飲|の}みましたか。——はい、まだ{飲|の}みました。 (Mou kusuri o nomimashita ka. — Hai, mada nomimashita.)"
            ],
            "correct": 3,
            "why": "\"Rồi\" đi với **もう**; まだ đi với phủ định (chưa)."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-np2-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 91, 92, 94, 96",
        "items": [
          {
            "q": "Chưa, tôi chưa ăn.",
            "answers": [
              "いいえ、まだ食べていません。",
              "いいえ、まだたべていません。"
            ],
            "hint": "まだ Vて いません"
          },
          {
            "q": "Tôi đi vệ sinh một lát rồi về.",
            "answers": [
              "ちょっとトイレに行ってきます。",
              "ちょっとトイレにいってきます。",
              "トイレに行ってきます。",
              "トイレにいってきます。"
            ],
            "hint": "Vて きます"
          },
          {
            "q": "Tôi đi mua nước rồi về.",
            "answers": [
              "水を買ってきます。",
              "水をかってきます。",
              "みずを買ってきます。",
              "みずをかってきます。",
              "ちょっと水を買ってきます。",
              "ちょっと水をかってきます。",
              "ちょっとみずを買ってきます。",
              "ちょっとみずをかってきます。"
            ],
            "hint": "Vて きます"
          },
          {
            "q": "Từ đây nhìn thấy biển.",
            "answers": [
              "ここから海が見えます。",
              "ここから海がみえます。",
              "ここからうみが見えます。",
              "ここからうみがみえます。"
            ],
            "hint": "N が 見えます"
          },
          {
            "q": "Xin lỗi, tôi nghe không rõ.",
            "answers": [
              "すみません、よく聞こえません。",
              "すみません、よくきこえません。"
            ],
            "hint": "よく 聞こえません"
          },
          {
            "q": "Hãy qua cầu.",
            "answers": [
              "橋を渡ってください。",
              "橋をわたってください。",
              "はしを渡ってください。",
              "はしをわたってください。"
            ],
            "hint": "N を 渡ります"
          },
          {
            "q": "Hãy rẽ phải ở ngã tư.",
            "answers": [
              "交差点を右に曲がってください。",
              "交差点を右にまがってください。",
              "交差点をみぎに曲がってください。",
              "交差点をみぎにまがってください。",
              "こうさてんを右に曲がってください。",
              "こうさてんを右にまがってください。",
              "こうさてんをみぎに曲がってください。",
              "こうさてんをみぎにまがってください。"
            ],
            "hint": "を + に"
          },
          {
            "q": "Từ đó bạn thấy gì?",
            "answers": [
              "そこから何が見えますか。",
              "そこから何がみえますか。",
              "そこからなにが見えますか。",
              "そこからなにがみえますか。"
            ],
            "hint": "何が 見えますか"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-np2-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "Tôi vẫn chưa mua vé.",
            "chips": [
              "{買|か}いませんでした",
              "チケットは",
              "いません",
              "まだ",
              "{買|か}って"
            ],
            "answer": [
              "チケットは",
              "まだ",
              "{買|か}って",
              "いません"
            ],
            "ro": "Chiketto wa mada katte imasen"
          },
          {
            "vi": "Tôi đi tìm Wang một chút rồi quay lại.",
            "chips": [
              "{探|さが}し",
              "ちょっと",
              "{探|さが}して",
              "ワンさんを",
              "きます"
            ],
            "answer": [
              "ちょっと",
              "ワンさんを",
              "{探|さが}して",
              "きます"
            ],
            "ro": "Chotto Wan-san o sagashite kimasu"
          },
          {
            "vi": "Từ đó bạn nhìn thấy gì?",
            "chips": [
              "{見|み}えますか",
              "{何|なに}を",
              "{何|なに}が",
              "そこから"
            ],
            "answer": [
              "そこから",
              "{何|なに}が",
              "{見|み}えますか"
            ],
            "ro": "Soko kara nani ga miemasu ka"
          },
          {
            "vi": "Rẽ trái ở đèn giao thông thứ hai.",
            "chips": [
              "{左|ひだり}を",
              "{二|ふた}つ{目|め}の",
              "{曲|ま}がってください",
              "{左|ひだり}に",
              "{信号|しんごう}を"
            ],
            "answer": [
              "{二|ふた}つ{目|め}の",
              "{信号|しんごう}を",
              "{左|ひだり}に",
              "{曲|ま}がってください"
            ],
            "ro": "Futatsume no shingou o hidari ni magatte kudasai"
          },
          {
            "vi": "Qua cầu rồi đi thẳng.",
            "chips": [
              "{橋|はし}を",
              "まっすぐ",
              "{橋|はし}に",
              "{行|い}ってください",
              "{渡|わた}って、"
            ],
            "answer": [
              "{橋|はし}を",
              "{渡|わた}って、",
              "まっすぐ",
              "{行|い}ってください"
            ],
            "ro": "Hashi o watatte, massugu itte kudasai"
          },
          {
            "vi": "Nghe thấy tiếng tàu điện.",
            "chips": [
              "{電車|でんしゃ}の",
              "{聞|き}こえます",
              "{音|おと}が",
              "{声|こえ}が"
            ],
            "answer": [
              "{電車|でんしゃ}の",
              "{音|おと}が",
              "{聞|き}こえます"
            ],
            "ro": "Densha no oto ga kikoemasu"
          },
          {
            "vi": "Marco vẫn chưa đến.",
            "chips": [
              "マルコさんは",
              "{来|き}て",
              "まだ",
              "いません",
              "{来|き}ません"
            ],
            "answer": [
              "マルコさんは",
              "まだ",
              "{来|き}て",
              "いません"
            ],
            "ro": "Maruko-san wa mada kite imasen"
          },
          {
            "vi": "Bên phải nhìn thấy toà nhà cao.",
            "chips": [
              "{高|たか}いビルが",
              "{見|み}ます",
              "{右|みぎ}に",
              "{見|み}えます"
            ],
            "answer": [
              "{右|みぎ}に",
              "{高|たか}いビルが",
              "{見|み}えます"
            ],
            "ro": "Migi ni takai biru ga miemasu"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · dịch · nhiều ô trống · tình huống gọi điện đến điểm tập hợp"
      },
      {
        "t": "quiz",
        "id": "lt-b10-np2-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 91, 92, 94, 96",
        "items": [
          {
            "q": "Bạn mua vé chưa? — Chưa, tôi chưa mua.",
            "answers": [
              "もうチケットを買いましたか。いいえ、まだ買っていません。",
              "もうチケットを買いましたか。いいえ、まだかっていません。",
              "もうチケットをかいましたか。いいえ、まだ買っていません。",
              "もうチケットをかいましたか。いいえ、まだかっていません。"
            ],
            "hint": "もう～ましたか · まだ～ていません"
          },
          {
            "q": "Xin lỗi, đi tàu điện nên nghe không rõ.",
            "answers": [
              "すみません、電車の中ですから、よく聞こえません。",
              "すみません、電車の中ですから、よくきこえません。",
              "すみません、電車のなかですから、よく聞こえません。",
              "すみません、電車のなかですから、よくきこえません。",
              "すみません、でんしゃの中ですから、よく聞こえません。",
              "すみません、でんしゃの中ですから、よくきこえません。",
              "すみません、でんしゃのなかですから、よく聞こえません。",
              "すみません、でんしゃのなかですから、よくきこえません。",
              "すみません、電車ですから、よく聞こえません。",
              "すみません、電車ですから、よくきこえません。",
              "すみません、でんしゃですから、よく聞こえません。",
              "すみません、でんしゃですから、よくきこえません。"
            ],
            "hint": "から + よく 聞こえません"
          },
          {
            "q": "Từ đó bạn thấy gì? — Ờ… tôi thấy ngân hàng.",
            "answers": [
              "そこから何が見えますか。ええと、銀行が見えます。",
              "そこから何が見えますか。ええと、銀行がみえます。",
              "そこから何が見えますか。ええと、ぎんこうが見えます。",
              "そこから何が見えますか。ええと、ぎんこうがみえます。",
              "そこから何がみえますか。ええと、銀行が見えます。",
              "そこから何がみえますか。ええと、銀行がみえます。",
              "そこから何がみえますか。ええと、ぎんこうが見えます。",
              "そこから何がみえますか。ええと、ぎんこうがみえます。",
              "そこからなにが見えますか。ええと、銀行が見えます。",
              "そこからなにが見えますか。ええと、銀行がみえます。",
              "そこからなにが見えますか。ええと、ぎんこうが見えます。",
              "そこからなにが見えますか。ええと、ぎんこうがみえます。",
              "そこからなにがみえますか。ええと、銀行が見えます。",
              "そこからなにがみえますか。ええと、銀行がみえます。",
              "そこからなにがみえますか。ええと、ぎんこうが見えます。",
              "そこからなにがみえますか。ええと、ぎんこうがみえます。"
            ],
            "hint": "何が 見えますか"
          },
          {
            "q": "Đi thẳng con đường này, rồi rẽ phải ở góc phố thứ hai.",
            "answers": [
              "この道をまっすぐ行って、二つ目の角を右に曲がってください。",
              "このみちをまっすぐいって、ふたつめのかどをみぎにまがってください。",
              "このみちをまっすぐ行って、二つ目の角を右に曲がってください。",
              "この道をまっすぐいって、ふたつめのかどをみぎにまがってください。",
              "この道をまっすぐいって、二つ目の角を右に曲がってください。",
              "このみちをまっすぐ行って、ふたつめのかどをみぎにまがってください。",
              "この道をまっすぐ行って、ふたつ目の角を右に曲がってください。",
              "このみちをまっすぐいって、二つめのかどをみぎにまがってください。",
              "この道をまっすぐ行って、二つめの角を右に曲がってください。",
              "このみちをまっすぐいって、ふたつ目のかどをみぎにまがってください。",
              "この道をまっすぐ行って、二つ目のかどを右に曲がってください。",
              "このみちをまっすぐいって、ふたつめの角をみぎにまがってください。",
              "この道をまっすぐ行って、二つ目の角をみぎに曲がってください。",
              "このみちをまっすぐいって、ふたつめのかどを右にまがってください。",
              "この道をまっすぐ行って、二つ目の角を右にまがってください。",
              "このみちをまっすぐいって、ふたつめのかどをみぎに曲がってください。",
              "この道をまっすぐ行って、二つ目の角を右に曲がります。",
              "このみちをまっすぐいって、ふたつめのかどをみぎにまがります。",
              "このみちをまっすぐ行って、二つ目の角を右に曲がります。",
              "この道をまっすぐいって、ふたつめのかどをみぎにまがります。",
              "この道をまっすぐいって、二つ目の角を右に曲がります。",
              "このみちをまっすぐ行って、ふたつめのかどをみぎにまがります。",
              "この道をまっすぐ行って、ふたつ目の角を右に曲がります。",
              "このみちをまっすぐいって、二つめのかどをみぎにまがります。",
              "この道をまっすぐ行って、二つめの角を右に曲がります。",
              "このみちをまっすぐいって、ふたつ目のかどをみぎにまがります。",
              "この道をまっすぐ行って、二つ目のかどを右に曲がります。",
              "このみちをまっすぐいって、ふたつめの角をみぎにまがります。",
              "この道をまっすぐ行って、二つ目の角をみぎに曲がります。",
              "このみちをまっすぐいって、ふたつめのかどを右にまがります。",
              "この道をまっすぐ行って、二つ目の角を右にまがります。",
              "このみちをまっすぐいって、ふたつめのかどをみぎに曲がります。"
            ],
            "hint": "を + に · Vて nối bước"
          },
          {
            "q": "Còn thời gian. Tôi đi mua quà rồi về.",
            "answers": [
              "まだ時間がありますから、お土産を買ってきます。",
              "まだ時間がありますから、お土産をかってきます。",
              "まだ時間がありますから、おみやげを買ってきます。",
              "まだ時間がありますから、おみやげをかってきます。",
              "まだじかんがありますから、お土産を買ってきます。",
              "まだじかんがありますから、お土産をかってきます。",
              "まだじかんがありますから、おみやげを買ってきます。",
              "まだじかんがありますから、おみやげをかってきます。",
              "まだ時間があります。お土産を買ってきます。",
              "まだ時間があります。お土産をかってきます。",
              "まだ時間があります。おみやげを買ってきます。",
              "まだ時間があります。おみやげをかってきます。",
              "まだじかんがあります。お土産を買ってきます。",
              "まだじかんがあります。お土産をかってきます。",
              "まだじかんがあります。おみやげを買ってきます。",
              "まだじかんがあります。おみやげをかってきます。"
            ],
            "hint": "Vて きます"
          },
          {
            "q": "Qua cầu, rồi rẽ trái ở đèn giao thông.",
            "answers": [
              "橋を渡って、信号を左に曲がってください。",
              "橋を渡って、信号を左にまがってください。",
              "橋を渡って、信号をひだりに曲がってください。",
              "橋を渡って、信号をひだりにまがってください。",
              "橋を渡って、しんごうを左に曲がってください。",
              "橋を渡って、しんごうを左にまがってください。",
              "橋を渡って、しんごうをひだりに曲がってください。",
              "橋を渡って、しんごうをひだりにまがってください。",
              "橋をわたって、信号を左に曲がってください。",
              "橋をわたって、信号を左にまがってください。",
              "橋をわたって、信号をひだりに曲がってください。",
              "橋をわたって、信号をひだりにまがってください。",
              "橋をわたって、しんごうを左に曲がってください。",
              "橋をわたって、しんごうを左にまがってください。",
              "橋をわたって、しんごうをひだりに曲がってください。",
              "橋をわたって、しんごうをひだりにまがってください。",
              "はしを渡って、信号を左に曲がってください。",
              "はしを渡って、信号を左にまがってください。",
              "はしを渡って、信号をひだりに曲がってください。",
              "はしを渡って、信号をひだりにまがってください。",
              "はしを渡って、しんごうを左に曲がってください。",
              "はしを渡って、しんごうを左にまがってください。",
              "はしを渡って、しんごうをひだりに曲がってください。",
              "はしを渡って、しんごうをひだりにまがってください。",
              "はしをわたって、信号を左に曲がってください。",
              "はしをわたって、信号を左にまがってください。",
              "はしをわたって、信号をひだりに曲がってください。",
              "はしをわたって、信号をひだりにまがってください。",
              "はしをわたって、しんごうを左に曲がってください。",
              "はしをわたって、しんごうを左にまがってください。",
              "はしをわたって、しんごうをひだりに曲がってください。",
              "はしをわたって、しんごうをひだりにまがってください。",
              "橋を渡って、信号を左に曲がります。",
              "橋を渡って、信号を左にまがります。",
              "橋を渡って、信号をひだりに曲がります。",
              "橋を渡って、信号をひだりにまがります。",
              "橋を渡って、しんごうを左に曲がります。",
              "橋を渡って、しんごうを左にまがります。",
              "橋を渡って、しんごうをひだりに曲がります。",
              "橋を渡って、しんごうをひだりにまがります。",
              "橋をわたって、信号を左に曲がります。",
              "橋をわたって、信号を左にまがります。",
              "橋をわたって、信号をひだりに曲がります。",
              "橋をわたって、信号をひだりにまがります。",
              "橋をわたって、しんごうを左に曲がります。",
              "橋をわたって、しんごうを左にまがります。",
              "橋をわたって、しんごうをひだりに曲がります。",
              "橋をわたって、しんごうをひだりにまがります。",
              "はしを渡って、信号を左に曲がります。",
              "はしを渡って、信号を左にまがります。",
              "はしを渡って、信号をひだりに曲がります。",
              "はしを渡って、信号をひだりにまがります。",
              "はしを渡って、しんごうを左に曲がります。",
              "はしを渡って、しんごうを左にまがります。",
              "はしを渡って、しんごうをひだりに曲がります。",
              "はしを渡って、しんごうをひだりにまがります。",
              "はしをわたって、信号を左に曲がります。",
              "はしをわたって、信号を左にまがります。",
              "はしをわたって、信号をひだりに曲がります。",
              "はしをわたって、信号をひだりにまがります。",
              "はしをわたって、しんごうを左に曲がります。",
              "はしをわたって、しんごうを左にまがります。",
              "はしをわたって、しんごうをひだりに曲がります。",
              "はしをわたって、しんごうをひだりにまがります。"
            ],
            "hint": "を 渡って · を 左に"
          },
          {
            "q": "Bài tập thì tôi vẫn chưa làm.",
            "answers": [
              "宿題はまだやっていません。",
              "しゅくだいはまだやっていません。",
              "宿題はまだしていません。",
              "しゅくだいはまだしていません。"
            ],
            "hint": "まだ Vて いません"
          },
          {
            "q": "Từ vòng đu quay nhìn thấy núi Phú Sĩ.",
            "answers": [
              "観覧車から富士山が見えます。",
              "観覧車から富士山がみえます。",
              "観覧車からふじさんが見えます。",
              "観覧車からふじさんがみえます。",
              "かんらんしゃから富士山が見えます。",
              "かんらんしゃから富士山がみえます。",
              "かんらんしゃからふじさんが見えます。",
              "かんらんしゃからふじさんがみえます。"
            ],
            "hint": "から + が 見えます"
          },
          {
            "q": "Con chim đang bay trên trời.",
            "answers": [
              "鳥が空を飛んでいます。",
              "鳥が空をとんでいます。",
              "鳥がそらを飛んでいます。",
              "鳥がそらをとんでいます。",
              "とりが空を飛んでいます。",
              "とりが空をとんでいます。",
              "とりがそらを飛んでいます。",
              "とりがそらをとんでいます。"
            ],
            "hint": "N を 飛びます"
          },
          {
            "q": "Wang chưa đến. Tôi đi tìm rồi quay lại.",
            "answers": [
              "ワンさんがまだ来ていません。探してきます。",
              "ワンさんがまだ来ていません。さがしてきます。",
              "ワンさんがまだきていません。探してきます。",
              "ワンさんがまだきていません。さがしてきます。",
              "ワンさんはまだ来ていません。ちょっと探してきます。",
              "ワンさんはまだ来ていません。ちょっとさがしてきます。",
              "ワンさんはまだきていません。ちょっと探してきます。",
              "ワンさんはまだきていません。ちょっとさがしてきます。"
            ],
            "hint": "まだ～ていません · Vてきます"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np2-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "{橋|はし}（①）{渡|わた}って、{交差点|こうさてん}を{右|みぎ}（②）{曲|ま}がってください。　〔Hashi ((1)) watatte, kousaten o migi ((2)) magatte kudasai.〕　— Qua cầu rồi rẽ phải ở ngã tư.",
            "options": [
              "① に　② を",
              "① で　② に",
              "① を　② に",
              "① を　② を"
            ],
            "correct": 2,
            "why": "Nơi đi qua **を** · hướng rẽ **に**. → **{橋|はし}を{渡|わた}って、{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。** 〔Hashi o watatte, kousaten o migi ni magatte kudasai.〕 — Qua cầu rồi rẽ phải ở ngã tư."
          },
          {
            "q": "A：（①）{昼|ひる}ご{飯|はん}を{食|た}べましたか。B：いいえ、（②）{食|た}べていません。　〔A: ((1)) hirugohan o tabemashita ka. B: iie, ((2)) tabete imasen.〕　— A: Ăn trưa chưa? B: Chưa, vẫn chưa ăn.",
            "options": [
              "① よく　② まだ",
              "① まだ　② もう",
              "① もう　② まだ",
              "① もう　② もう"
            ],
            "correct": 2,
            "why": "もう ～ましたか → まだ ～ていません. → **もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。いいえ、まだ{食|た}べていません。** 〔Mou hirugohan o tabemashita ka. Iie, mada tabete imasen.〕 — A: Ăn trưa chưa? B: Chưa, vẫn chưa ăn."
          },
          {
            "q": "そこから{何|なに}（①）{見|み}えますか。——{大|おお}きい{橋|はし}（②）{見|み}えます。　〔Soko kara nani ((1)) miemasu ka. — Ookii hashi ((2)) miemasu.〕　— Từ đó thấy gì? — Thấy cây cầu lớn.",
            "options": [
              "① が　② を",
              "① を　② が",
              "① を　② を",
              "① が　② が"
            ],
            "correct": 3,
            "why": "見えます luôn đi với **が**. → **そこから{何|なに}が{見|み}えますか。{大|おお}きい{橋|はし}が{見|み}えます。** 〔Soko kara nani ga miemasu ka. Ookii hashi ga miemasu.〕 — Từ đó thấy gì? — Thấy cây cầu lớn."
          },
          {
            "q": "のどがかわきましたから、ちょっとジュースを{買|か}っ（①）。ここで{待|ま}っ（②）ください。　〔Nodo ga kawakimashita kara, chotto juusu o ka((1)). Koko de ma((2)) kudasai.〕　— Khát rồi nên tôi đi mua nước ép rồi về. Bạn chờ ở đây nhé.",
            "options": [
              "① ます　② て",
              "① て きます　② ないで",
              "① て きます　② て",
              "① て ください　② て"
            ],
            "correct": 2,
            "why": "Đi mua rồi về **買ってきます** · nhờ chờ **待って** ください. → **のどがかわきましたから、ちょっとジュースを{買|か}ってきます。ここで{待|ま}ってください。** 〔Nodo ga kawakimashita kara, chotto juusu o katte kimasu. Koko de matte kudasai.〕 — Khát rồi nên tôi đi mua nước ép rồi về. Bạn chờ ở đây nhé."
          },
          {
            "q": "すみません、{電車|でんしゃ}の{音|おと}でよく（①）。もう{一度|いちど}（②）ください。　〔Sumimasen, densha no oto de yoku ((1)). Mou ichido ((2)) kudasai.〕　— Xin lỗi, tiếng tàu ồn nên tôi nghe không rõ. Nói lại lần nữa giúp tôi.",
            "options": [
              "① {聞|き}こえません　② {言|い}って",
              "① {見|み}えません　② {言|い}って",
              "① {聞|き}こえません　② {言|い}わないで",
              "① {聞|き}きません　② {言|い}って"
            ],
            "correct": 0,
            "why": "Bị tiếng tàu át → 聞こえません; nhờ nói lại → 言って ください. → **すみません、{電車|でんしゃ}の{音|おと}でよく{聞|き}こえません。もう{一度|いちど}{言|い}ってください。** 〔Sumimasen, densha no oto de yoku kikoemasen. Mou ichido itte kudasai.〕 — Xin lỗi, tiếng tàu ồn nên tôi nghe không rõ. Nói lại lần nữa giúp tôi."
          },
          {
            "q": "この{道|みち}（①）まっすぐ{歩|ある}いて、{二|ふた}つ（②）の{角|かど}を{左|ひだり}に{曲|ま}がってください。　〔Kono michi ((1)) massugu aruite, futatsu((2)) no kado o hidari ni magatte kudasai.〕　— Đi bộ thẳng đường này rồi rẽ trái ở góc thứ hai.",
            "options": [
              "① で　② {番|ばん}",
              "① を　② {目|め}",
              "① を　② の",
              "① に　② {目|め}"
            ],
            "correct": 1,
            "why": "道**を** 歩いて · thứ hai = 二つ**目**. → **この{道|みち}をまっすぐ{歩|ある}いて、{二|ふた}つ{目|め}の{角|かど}を{左|ひだり}に{曲|ま}がってください。** 〔Kono michi o massugu aruite, futatsume no kado o hidari ni magatte kudasai.〕 — Đi bộ thẳng đường này rồi rẽ trái ở góc thứ hai."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np2-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Bạn đã đến điểm tập hợp; bạn của bạn chưa đến. Bạn gọi điện hỏi bạn ấy đang ở đâu, thấy gì.",
            "options": [
              "もしもし、{今|いま}どこですか。そこで{何|なに}が{見|み}せますか。 (Moshimoshi, ima doko desu ka. Soko de nani ga misemasu ka.)",
              "もしもし、{今|いま}どこですか。そこから{何|なに}を{見|み}ますか。 (Moshimoshi, ima doko desu ka. Soko kara nani o mimasu ka.)",
              "もしもし、{今|いま}どこですか。そこから{何|なに}が{見|み}えますか。 (Moshimoshi, ima doko desu ka. Soko kara nani ga miemasu ka.)",
              "もしもし、{今|いま}どこにありますか。そこから{何|なに}を{見|み}えますか。 (Moshimoshi, ima doko ni arimasu ka. Soko kara nani o miemasu ka.)"
            ],
            "correct": 2,
            "why": "Người → どこですか; cái đang thấy → 何が 見えますか."
          },
          {
            "q": "Bạn cần đi vệ sinh trước khi xe chạy, báo hướng dẫn viên.",
            "options": [
              "すみません、ちょっとトイレに{行|い}きます。{帰|かえ}りません。 (Sumimasen, chotto toire ni ikimasu. Kaerimasen.)",
              "すみません、ちょっとトイレに{行|い}ってきます。 (Sumimasen, chotto toire ni itte kimasu.)",
              "すみません、ちょっとトイレに{行|い}ってください。 (Sumimasen, chotto toire ni itte kudasai.)",
              "すみません、ちょっとトイレに{行|い}かないでください。 (Sumimasen, chotto toire ni ikanaide kudasai.)"
            ],
            "correct": 1,
            "why": "Đi rồi quay lại → 行って きます."
          },
          {
            "q": "Điện thoại rè, bạn không nghe được bạn nói gì.",
            "options": [
              "すみません、よく{聞|き}こえません。 (Sumimasen, yoku kikoemasen.)",
              "すみません、よく{見|み}えません。 (Sumimasen, yoku miemasen.)",
              "すみません、よくわかりました。 (Sumimasen, yoku wakarimashita.)",
              "すみません、よく{聞|き}きません。 (Sumimasen, yoku kikimasen.)"
            ],
            "correct": 0,
            "why": "よく 聞こえません."
          },
          {
            "q": "Bạn chỉ đường cho bạn qua điện thoại: qua cầu rồi rẽ phải ở ngã tư đầu tiên.",
            "options": [
              "{橋|はし}に{渡|わた}って、{一|ひと}つ{目|め}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。 (Hashi ni watatte, hitotsume no kousaten o migi ni magatte kudasai.)",
              "{橋|はし}を{渡|わた}って、{一|ひと}つの{交差点|こうさてん}に{右|みぎ}を{曲|ま}がってください。 (Hashi o watatte, hitotsu no kousaten ni migi o magatte kudasai.)",
              "{橋|はし}を{渡|わた}って、{一|ひと}つ{目|め}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。 (Hashi o watatte, hitotsume no kousaten o migi ni magatte kudasai.)",
              "{橋|はし}を{渡|わた}りて、{一|ひと}つ{目|め}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。 (Hashi o watarite, hitotsume no kousaten o migi ni magatte kudasai.)"
            ],
            "correct": 2,
            "why": "橋を 渡って · 一つ目の 交差点を 右に."
          },
          {
            "q": "Bạn được hỏi 「もう お土産を 買いましたか」. Bạn chưa mua, định mua bây giờ.",
            "options": [
              "いいえ、まだ{買|か}いませんでした。{今|いま}から{買|か}ってきます。 (Iie, mada kaimasendeshita. Ima kara katte kimasu.)",
              "はい、まだ{買|か}っていません。{今|いま}から{買|か}ってきます。 (Hai, mada katte imasen. Ima kara katte kimasu.)",
              "いいえ、もう{買|か}っていません。{今|いま}から{買|か}います。 (Iie, mou katte imasen. Ima kara kaimasu.)",
              "いいえ、まだ{買|か}っていません。{今|いま}から{買|か}ってきます。 (Iie, mada katte imasen. Ima kara katte kimasu.)"
            ],
            "correct": 3,
            "why": "Chưa → まだ 買って いません; đi mua rồi về → 買って きます."
          },
          {
            "q": "Bạn nói với cả nhóm: từ đây nhìn thấy biển và cây cầu.",
            "options": [
              "ここから{海|うみ}と{橋|はし}が{見|み}えますよ。 (Koko kara umi to hashi ga miemasu yo.)",
              "ここから{海|うみ}と{橋|はし}が{聞|き}こえますよ。 (Koko kara umi to hashi ga kikoemasu yo.)",
              "ここから{海|うみ}と{橋|はし}を{見|み}えますよ。 (Koko kara umi to hashi o miemasu yo.)",
              "ここで{海|うみ}と{橋|はし}が{見|み}ますよ。 (Koko de umi to hashi ga mimasu yo.)"
            ],
            "correct": 0,
            "why": "N と N **が** 見えます."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**まだ Vて いません** (chưa — đến giờ) ≠ **Vませんでした** (đã không làm). **Vて きます** = đi làm rồi quay lại ngay.",
          "**が** 見えます／聞こえます · よく 聞こえません · **(nơi) を** 渡ります／歩きます · **(chỗ rẽ) を (hướng) に** 曲がります."
        ]
      }
    ]
  },
  {
    "id": "lt-b10-np-3",
    "kind": "homework",
    "title": "Luyện thêm Bài 10 · Ngữ pháp 3 (ポイント 90, 93, 95) + TRỘN cả 10 điểm — 動物園で: あっ、N が Vています · ここで～ができます · ～くなります／～になります (~102 câu)",
    "goal": "Chỉ cho bạn thấy điều đang diễn ra trước mắt (あっ、N が Vています), hỏi–nói nơi này làm được gì (ここで N／Vこと が できます), nói sự thay đổi và đề xuất việc tiếp theo (寒くなりました／12時になりました → ～ませんか), rồi trộn đủ 10 điểm ngữ pháp của Bài 10.",
    "minutes": 85,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**ポイント 90 — (あっ、) N が Vて います** = người nói vừa THẤY một việc đang diễn ra và chỉ cho người kia: あっ、サル**が** バナナを 食べています. Dùng **が** (thông tin mới). Đáp: 本当だ／本当ですね.",
          "**ポイント 93 — (nơi) で N／V辞書形 こと が できます** = ở chỗ này có thể làm gì (dịch vụ, quy định). Bài 9 nói về khả năng của NGƯỜI; Bài 10 nói về khả năng của NƠI CHỐN: ここで 食事**が** できます · 観覧車に 乗る**こと**が できます.",
          "**ポイント 95 — thay đổi**: tính từ い: **い → く なります** (寒い → 寒く なりました); tính từ な / danh từ: **に なります** (静か → 静かに なりました · 12時 → 12時に なります). Hay đi kèm **đề xuất**: 寒く なりましたね。コーヒーを 飲みませんか.",
          "Mức Khó TRỘN cả 10 điểm (88–97) + thể ない: đọc kỹ tình huống trong ngoặc trước khi chọn."
        ]
      },
      {
        "t": "recap",
        "title": "Công thức nhớ nhanh",
        "items": [
          "**あっ、N が Vて います。** → 本当だ。(ポイント 90)",
          "**(nơi) で N が できます。／V辞書形 こと が できます。** Hỏi: ここで ～ことが できますか. (ポイント 93)",
          "**イA: ～い → ～く なります · ナA／N: ～に なります。** いい → **よく** なります (đặc biệt). (ポイント 95)"
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · từng ポイント một"
      },
      {
        "t": "mcq",
        "id": "lt-b10-np3-90",
        "title": "ポイント 90: あっ、N が Vて います (10 câu)",
        "items": [
          {
            "q": "あっ、サル＿＿バナナを{食|た}べています。　〔A, saru __ banana o tabete imasu.〕　— A, con khỉ đang ăn chuối.",
            "options": [
              "で",
              "が",
              "を",
              "に"
            ],
            "correct": 1,
            "why": "Vừa thấy, chỉ cho bạn → N **が** Vています. → **あっ、サルがバナナを{食|た}べています。** 〔A, saru ga banana o tabete imasu.〕 — A, con khỉ đang ăn chuối."
          },
          {
            "q": "{見|み}てください。パンダが＿＿。　〔Mite kudasai. Panda ga __.〕　— Nhìn kìa. Gấu trúc đang ngủ.",
            "options": [
              "{寝|ね}ないでください",
              "{寝|ね}ています",
              "{寝|ね}ます",
              "{寝|ね}ました"
            ],
            "correct": 1,
            "why": "Việc đang diễn ra trước mắt → **Vて います**. → **{見|み}てください。パンダが{寝|ね}ています。** 〔Mite kudasai. Panda ga nete imasu.〕 — Nhìn kìa. Gấu trúc đang ngủ."
          },
          {
            "q": "あっ、{鳥|とり}が{空|そら}を＿＿います。　〔A, tori ga sora o __ imasu.〕　— A, con chim đang bay trên trời.",
            "options": [
              "{飛|と}びて",
              "{飛|と}いて",
              "{飛|と}んで",
              "{飛|と}って"
            ],
            "correct": 2,
            "why": "飛びます → **飛んで** います. → **あっ、{鳥|とり}が{空|そら}を{飛|と}んでいます。** 〔A, tori ga sora o tonde imasu.〕 — A, con chim đang bay trên trời."
          },
          {
            "q": "A：あっ、ゾウが{水|みず}を{飲|の}んでいますよ。B：＿＿。　〔A: a, zou ga mizu o nonde imasu yo. B: __.〕　— A: Ơ, con voi đang uống nước kìa. B: Thật này.",
            "options": [
              "どうぞ",
              "まだです",
              "ちょっと",
              "{本当|ほんとう}だ"
            ],
            "correct": 3,
            "why": "Nhìn theo và thấy đúng → **本当だ**. → **A：あっ、ゾウが{水|みず}を{飲|の}んでいますよ。B：{本当|ほんとう}だ。** 〔A: a, zou ga mizu o nonde imasu yo. B: hontouda.〕 — A: Ơ, con voi đang uống nước kìa. B: Thật này."
          },
          {
            "q": "あっ、ペンギンが＿＿。かわいいですね。　〔A, pengin ga __. Kawaii desu ne.〕　— A, chim cánh cụt đang đi. Dễ thương nhỉ.",
            "options": [
              "{歩|ある}かないで",
              "{歩|ある}いてください",
              "{歩|ある}きます",
              "{歩|ある}いています"
            ],
            "correct": 3,
            "why": "Đang đi → **歩いて います**. → **あっ、ペンギンが{歩|ある}いています。かわいいですね。** 〔A, pengin ga aruite imasu. Kawaii desu ne.〕 — A, chim cánh cụt đang đi. Dễ thương nhỉ."
          },
          {
            "q": "{見|み}て、クマが{泳|およ}いで＿＿よ。　〔Mite, kuma ga oyoide __ yo.〕　— Nhìn kìa, con gấu đang bơi đấy.",
            "options": [
              "ください",
              "いません",
              "います",
              "きます"
            ],
            "correct": 2,
            "why": "Đang bơi → 泳いで **います**. → **{見|み}て、クマが{泳|およ}いでいますよ。** 〔Mite, kuma ga oyoide imasu yo.〕 — Nhìn kìa, con gấu đang bơi đấy."
          },
          {
            "q": "あっ、コアラが{木|き}の{上|うえ}で＿＿。　〔A, koara ga ki no ue de __.〕　— A, con koala đang ngủ trên cây.",
            "options": [
              "{寝|ね}ません",
              "{寝|ね}ることができます",
              "{寝|ね}ています",
              "{寝|ね}てきます"
            ],
            "correct": 2,
            "why": "Đang ngủ trên cây → **寝て います**. → **あっ、コアラが{木|き}の{上|うえ}で{寝|ね}ています。** 〔A, koara ga ki no ue de nete imasu.〕 — A, con koala đang ngủ trên cây."
          },
          {
            "q": "あっ、{子|こ}どもたち＿＿ゾウにえさをやっています。　〔A, kodomo tachi __ zou ni esa o yatte imasu.〕　— A, bọn trẻ đang cho voi ăn.",
            "options": [
              "が",
              "に",
              "を",
              "で"
            ],
            "correct": 0,
            "why": "Chủ thể của việc đang thấy → **が**. → **あっ、{子|こ}どもたちがゾウにえさをやっています。** 〔A, kodomo tachi ga zou ni esa o yatte imasu.〕 — A, bọn trẻ đang cho voi ăn."
          },
          {
            "q": "あ、アンナさんがゾウの{写真|しゃしん}を＿＿います。　〔A, Anna-san ga zou no shashin o __ imasu.〕　— A, Anna đang chụp ảnh con voi.",
            "options": [
              "{撮|と}りて",
              "{撮|と}いて",
              "{撮|と}って",
              "{撮|と}んで"
            ],
            "correct": 2,
            "why": "撮ります → **撮って** います. → **あ、アンナさんがゾウの{写真|しゃしん}を{撮|と}っています。** 〔A, Anna-san ga zou no shashin o totte imasu.〕 — A, Anna đang chụp ảnh con voi."
          },
          {
            "q": "{見|み}てください。サルがボールで＿＿。　〔Mite kudasai. Saru ga booru de __.〕　— Nhìn kìa. Con khỉ đang chơi với quả bóng.",
            "options": [
              "{遊|あそ}ばないでください",
              "{遊|あそ}びます",
              "{遊|あそ}んでいます",
              "{遊|あそ}んできます"
            ],
            "correct": 2,
            "why": "遊びます → **遊んで います**. → **{見|み}てください。サルがボールで{遊|あそ}んでいます。** 〔Mite kudasai. Saru ga booru de asonde imasu.〕 — Nhìn kìa. Con khỉ đang chơi với quả bóng."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np3-93",
        "title": "ポイント 93: (nơi) で N／Vこと が できます (10 câu)",
        "items": [
          {
            "q": "ここで{食事|しょくじ}＿＿できます。　〔Koko de shokuji __ dekimasu.〕　— Ở đây có thể ăn uống.",
            "options": [
              "に",
              "が",
              "で",
              "を"
            ],
            "correct": 1,
            "why": "N **が** できます. → **ここで{食事|しょくじ}ができます。** 〔Koko de shokuji ga dekimasu.〕 — Ở đây có thể ăn uống."
          },
          {
            "q": "この{動物園|どうぶつえん}でゾウにえさを＿＿ことができます。　〔Kono doubutsuen de zou ni esa o __ koto ga dekimasu.〕　— Ở sở thú này có thể cho voi ăn.",
            "options": [
              "やります",
              "やる",
              "やらない",
              "やって"
            ],
            "correct": 1,
            "why": "Trước こと → **thể từ điển**: やる. → **この{動物園|どうぶつえん}でゾウにえさをやることができます。** 〔Kono doubutsuen de zou ni esa o yaru koto ga dekimasu.〕 — Ở sở thú này có thể cho voi ăn."
          },
          {
            "q": "{入|い}り{口|ぐち}でパンフレットを＿＿ことができます。　〔Iriguchi de panfuretto o __ koto ga dekimasu.〕　— Ở lối vào có thể nhận tờ giới thiệu.",
            "options": [
              "もらって",
              "もらい",
              "もらいます",
              "もらう"
            ],
            "correct": 3,
            "why": "もらいます → **もらう** こと. → **{入|い}り{口|ぐち}でパンフレットをもらうことができます。** 〔Iriguchi de panfuretto o morau koto ga dekimasu.〕 — Ở lối vào có thể nhận tờ giới thiệu."
          },
          {
            "q": "すみません、ここで{写真|しゃしん}を{撮|と}ること＿＿できますか。　〔Sumimasen, koko de shashin o toru koto __ dekimasu ka.〕　— Xin lỗi, ở đây chụp ảnh được không?",
            "options": [
              "を",
              "は",
              "に",
              "が"
            ],
            "correct": 3,
            "why": "こと **が** できます. → **すみません、ここで{写真|しゃしん}を{撮|と}ることができますか。** 〔Sumimasen, koko de shashin o toru koto ga dekimasu ka.〕 — Xin lỗi, ở đây chụp ảnh được không?"
          },
          {
            "q": "{観覧車|かんらんしゃ}に＿＿ことができますか。　〔Kanransha ni __ koto ga dekimasu ka.〕　— Có thể đi vòng đu quay được không?",
            "options": [
              "{乗|の}って",
              "{乗|の}り",
              "{乗|の}る",
              "{乗|の}ります"
            ],
            "correct": 2,
            "why": "乗ります → **乗る**. → **{観覧車|かんらんしゃ}に{乗|の}ることができますか。** 〔Kanransha ni noru koto ga dekimasu ka.〕 — Có thể đi vòng đu quay được không?"
          },
          {
            "q": "A：ここでボールを{借|か}りることができますか。B：はい、＿＿。　〔A: koko de booru o kariru koto ga dekimasu ka. B: hai, __.〕　— A: Ở đây mượn bóng được không? B: Vâng, được.",
            "options": [
              "どうぞ{借|か}りません",
              "できます",
              "{借|か}ります",
              "あります"
            ],
            "correct": 1,
            "why": "Trả lời: はい、**できます**. → **A：ここでボールを{借|か}りることができますか。B：はい、できます。** 〔A: koko de booru o kariru koto ga dekimasu ka. B: hai, dekimasu.〕 — A: Ở đây mượn bóng được không? B: Vâng, được."
          },
          {
            "q": "この{公園|こうえん}でサッカー＿＿できません。　〔Kono kouen de sakkaa __ dekimasen.〕　— Ở công viên này không thể đá bóng.",
            "options": [
              "に",
              "へ",
              "は",
              "を"
            ],
            "correct": 2,
            "why": "Phủ định đối chiếu → N **は** できません. → **この{公園|こうえん}でサッカーはできません。** 〔Kono kouen de sakkaa wa dekimasen.〕 — Ở công viên này không thể đá bóng."
          },
          {
            "q": "コンビニで{切手|きって}を＿＿ことができます。　〔Konbini de kitte o __ koto ga dekimasu.〕　— Ở cửa hàng tiện lợi có thể mua tem.",
            "options": [
              "{買|か}います",
              "{買|か}わない",
              "{買|か}う",
              "{買|か}って"
            ],
            "correct": 2,
            "why": "買います → **買う**. → **コンビニで{切手|きって}を{買|か}うことができます。** 〔Konbini de kitte o kau koto ga dekimasu.〕 — Ở cửa hàng tiện lợi có thể mua tem."
          },
          {
            "q": "A：ここで{何|なに}ができますか。B：{買|か}い{物|もの}や{食事|しょくじ}＿＿できます。　〔A: koko de nani ga dekimasu ka. B: kaimono ya shokuji __ dekimasu.〕　— A: Ở đây làm được gì? B: Có thể mua sắm, ăn uống.",
            "options": [
              "で",
              "が",
              "を",
              "へ"
            ],
            "correct": 1,
            "why": "N や N **が** できます. → **A：ここで{何|なに}ができますか。B：{買|か}い{物|もの}や{食事|しょくじ}ができます。** 〔A: koko de nani ga dekimasu ka. B: kaimono ya shokuji ga dekimasu.〕 — A: Ở đây làm được gì? B: Có thể mua sắm, ăn uống."
          },
          {
            "q": "この{図書館|としょかん}では{本|ほん}を{十冊|じゅっさつ}＿＿ことができます。　〔Kono toshokan de wa hon o jussatsu __ koto ga dekimasu.〕　— Ở thư viện này có thể mượn 10 quyển sách.",
            "options": [
              "{借|か}ります",
              "{借|か}りる",
              "{借|か}りて",
              "{借|か}らる"
            ],
            "correct": 1,
            "why": "借ります (nhóm 2) → **借りる**. → **この{図書館|としょかん}では{本|ほん}を{十冊|じゅっさつ}{借|か}りることができます。** 〔Kono toshokan de wa hon o jussatsu kariru koto ga dekimasu.〕 — Ở thư viện này có thể mượn 10 quyển sách."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np3-95",
        "title": "ポイント 95: ～く なります／～に なります (12 câu)",
        "items": [
          {
            "q": "{寒|さむ}い→{寒|さむ}＿なりましたね。　〔Samui → samu_ narimashita ne.〕　— Trời lạnh rồi nhỉ.",
            "options": [
              "くに",
              "いに",
              "に",
              "く"
            ],
            "correct": 3,
            "why": "Tính từ い: い → **く** なります. → **{寒|さむ}い→{寒|さむ}＿なりましたね。** 〔Samui → samu_ narimashita ne.〕 — Trời lạnh rồi nhỉ."
          },
          {
            "q": "{暗|くら}い→{暗|くら}＿なりましたから、{帰|かえ}りましょう。　〔Kurai → kura_ narimashita kara, kaerimashou.〕　— Trời tối rồi nên về thôi.",
            "options": [
              "いく",
              "く",
              "に",
              "で"
            ],
            "correct": 1,
            "why": "暗い → **暗く** なりました. → **{暗|くら}い→{暗|くら}＿なりましたから、{帰|かえ}りましょう。** 〔Kurai → kura_ narimashita kara, kaerimashou.〕 — Trời tối rồi nên về thôi."
          },
          {
            "q": "{静|しず}か→{静|しず}か＿なりました。　〔Shizuka → shizuka_ narimashita.〕　— Đã trở nên yên tĩnh.",
            "options": [
              "な",
              "で",
              "く",
              "に"
            ],
            "correct": 3,
            "why": "Tính từ な: **に** なります. → **{静|しず}か→{静|しず}か＿なりました。** 〔Shizuka → shizuka_ narimashita.〕 — Đã trở nên yên tĩnh."
          },
          {
            "q": "もうすぐ{十二時|じゅうにじ}＿＿なります。　〔Mousugu juuniji __ narimasu.〕　— Sắp 12 giờ rồi.",
            "options": [
              "く",
              "が",
              "で",
              "に"
            ],
            "correct": 3,
            "why": "Danh từ: **に** なります. → **もうすぐ{十二時|じゅうにじ}になります。** 〔Mousugu juuniji ni narimasu.〕 — Sắp 12 giờ rồi."
          },
          {
            "q": "{薬|くすり}を{飲|の}みましたから、＿＿なりました。　〔Kusuri o nomimashita kara, __ narimashita.〕　— Uống thuốc rồi nên đã khoẻ lại.",
            "options": [
              "{元気|げんき}く",
              "{元気|げんき}で",
              "{元気|げんき}に",
              "{元気|げんき}な"
            ],
            "correct": 2,
            "why": "元気 (な) → **元気に** なりました. → **{薬|くすり}を{飲|の}みましたから、{元気|げんき}になりました。** 〔Kusuri o nomimashita kara, genki ni narimashita.〕 — Uống thuốc rồi nên đã khoẻ lại."
          },
          {
            "q": "いい→＿＿なりました。(thờitiếtđẹplên)　〔Ii → __ narimashita. (Thời tiết đẹp lên)〕　— Trời đã đẹp lên.",
            "options": [
              "いく",
              "よく",
              "よい",
              "いいに"
            ],
            "correct": 1,
            "why": "**いい → よく** なります (đặc biệt). → **いい→よくなりました。(thờitiếtđẹplên)** 〔Ii → yoku narimashita. (Thời tiết đẹp lên)〕 — Trời đã đẹp lên."
          },
          {
            "q": "{暑|あつ}く＿＿ね。ジュースを{飲|の}みませんか。　〔Atsuku __ ne. Juusu o nomimasen ka.〕　— Trời nóng lên rồi nhỉ. Uống nước ép không?",
            "options": [
              "いました",
              "しました",
              "なりました",
              "ありました"
            ],
            "correct": 2,
            "why": "Thay đổi → **なりました**. → **{暑|あつ}くなりましたね。ジュースを{飲|の}みませんか。** 〔Atsuku narimashita ne. Juusu o nomimasen ka.〕 — Trời nóng lên rồi nhỉ. Uống nước ép không?"
          },
          {
            "q": "{来年|らいねん}、{兄|あに}は{先生|せんせい}＿＿なります。　〔Rainen, ani wa sensei __ narimasu.〕　— Năm sau anh tôi sẽ trở thành giáo viên.",
            "options": [
              "が",
              "く",
              "に",
              "を"
            ],
            "correct": 2,
            "why": "Danh từ (nghề) → **に** なります. → **{来年|らいねん}、{兄|あに}は{先生|せんせい}になります。** 〔Rainen, ani wa sensei ni narimasu.〕 — Năm sau anh tôi sẽ trở thành giáo viên."
          },
          {
            "q": "{日本語|にほんご}が{上手|じょうず}＿＿なりましたね。　〔Nihongo ga jouzu __ narimashita ne.〕　— Tiếng Nhật của bạn giỏi lên rồi nhỉ.",
            "options": [
              "で",
              "に",
              "な",
              "く"
            ],
            "correct": 1,
            "why": "上手 (な) → **上手に** なりました. → **{日本語|にほんご}が{上手|じょうず}になりましたね。** 〔Nihongo ga jouzu ni narimashita ne.〕 — Tiếng Nhật của bạn giỏi lên rồi nhỉ."
          },
          {
            "q": "たくさん{歩|ある}きましたから、{足|あし}が{痛|いた}＿なりました。　〔Takusan arukimashita kara, ashi ga ita_ narimashita.〕　— Đi bộ nhiều nên chân bắt đầu đau.",
            "options": [
              "に",
              "く",
              "くて",
              "い"
            ],
            "correct": 1,
            "why": "痛い → **痛く** なりました. → **たくさん{歩|ある}きましたから、{足|あし}が{痛|いた}＿なりました。** 〔Takusan arukimashita kara, ashi ga ita_ narimashita.〕 — Đi bộ nhiều nên chân bắt đầu đau."
          },
          {
            "q": "{部屋|へや}がきれい＿＿なりました。　〔Heya ga kirei __ narimashita.〕　— Căn phòng đã sạch đẹp.",
            "options": [
              "な",
              "い",
              "く",
              "に"
            ],
            "correct": 3,
            "why": "きれい là tính từ **な** (dù kết thúc bằng い) → きれい**に** なります. → **{部屋|へや}がきれいになりました。** 〔Heya ga kirei ni narimashita.〕 — Căn phòng đã sạch đẹp."
          },
          {
            "q": "{夜|よる}になって、{道|みち}が{危|あぶ}＿なりました。　〔Yoru ni natte, michi ga abu_ narimashita.〕　— Đêm xuống, đường trở nên nguy hiểm.",
            "options": [
              "ないく",
              "なに",
              "ないに",
              "なく"
            ],
            "correct": 3,
            "why": "危ない → **危なく** なりました (い → く). → **{夜|よる}になって、{道|みち}が{危|あぶ}＿なりました。** 〔Yoru ni natte, michi ga abu_ narimashita.〕 — Đêm xuống, đường trở nên nguy hiểm."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · tình hình → đề xuất · sửa câu sai · gõ · ghép"
      },
      {
        "t": "mcq",
        "id": "lt-b10-np3-de-xuat",
        "title": "Tình hình thay đổi → đề xuất việc tiếp theo (6 câu)",
        "items": [
          {
            "q": "(Nhiệt kế tụt xuống; có máy bán cà phê.) Bạn nói:",
            "options": [
              "{寒|さむ}いになりましたね。コーヒーを{飲|の}みませんか。 (Samui ni narimashita ne. Koohii o nomimasen ka.)",
              "{寒|さむ}くなりましたね。コーヒーを{飲|の}まないでください。 (Samuku narimashita ne. Koohii o nomanaide kudasai.)",
              "{寒|さむ}くしましたね。コーヒーを{飲|の}みませんか。 (Samuku shimashita ne. Koohii o nomimasen ka.)",
              "{寒|さむ}くなりましたね。コーヒーを{飲|の}みませんか。 (Samuku narimashita ne. Koohii o nomimasen ka.)"
            ],
            "correct": 3,
            "why": "寒く なりました + 〜ませんか (rủ)."
          },
          {
            "q": "(Trời tối dần, đèn trang trí bật.) Bạn nói:",
            "options": [
              "{暗|くら}になりましたね。そろそろ{帰|かえ}りましょう。 (Kurani narimashita ne. Sorosoro kaerimashou.)",
              "{暗|くら}くなりましたね。まだ{帰|かえ}っていません。 (Kuraku narimashita ne. Mada kaette imasen.)",
              "{暗|くら}くなりましたね。そろそろ{帰|かえ}りましょう。 (Kuraku narimashita ne. Sorosoro kaerimashou.)",
              "{暗|くら}いなりましたね。そろそろ{帰|かえ}りましょう。 (Kurai narimashita ne. Sorosoro kaerimashou.)"
            ],
            "correct": 2,
            "why": "暗く なりました + そろそろ ～ましょう."
          },
          {
            "q": "(Đồng hồ chỉ 12 giờ; cả hai đói.) Bạn nói:",
            "options": [
              "{十二時|じゅうにじ}くなりましたね。お{昼|ひる}を{食|た}べませんか。 (Juuniji ku narimashita ne. Ohiru o tabemasen ka.)",
              "{十二時|じゅうにじ}になりましたね。お{昼|ひる}を{食|た}べませんか。 (Juuniji ni narimashita ne. Ohiru o tabemasen ka.)",
              "{十二時|じゅうにじ}になりましたね。お{昼|ひる}を{食|た}べないでください。 (Juuniji ni narimashita ne. Ohiru o tabenaide kudasai.)",
              "{十二時|じゅうにじ}がなりましたね。お{昼|ひる}を{食|た}べませんか。 (Juuniji ga narimashita ne. Ohiru o tabemasen ka.)"
            ],
            "correct": 1,
            "why": "Danh từ + **に** なります."
          },
          {
            "q": "(Đi bộ nhiều, chân đau; có ghế dài.) Bạn nói:",
            "options": [
              "{足|あし}が{痛|いた}いになりました。あそこのベンチで{休|やす}みましょう。 (Ashi ga itai ni narimashita. Asoko no benchi de yasumimashou.)",
              "{足|あし}を{痛|いた}くなりました。あそこのベンチで{休|やす}みましょう。 (Ashi o itaku narimashita. Asoko no benchi de yasumimashou.)",
              "{足|あし}が{痛|いた}くなりました。あそこのベンチで{休|やす}みましょう。 (Ashi ga itaku narimashita. Asoko no benchi de yasumimashou.)",
              "{足|あし}が{痛|いた}くなりました。あそこのベンチで{休|やす}まないでください。 (Ashi ga itaku narimashita. Asoko no benchi de yasumanaide kudasai.)"
            ],
            "correct": 2,
            "why": "足**が** 痛く なりました + 〜ましょう."
          },
          {
            "q": "(Trời nóng lên; có quầy kem.) Bạn nói:",
            "options": [
              "{暑|あつ}くなりましたね。アイスクリームを{買|か}いになります。 (Atsuku narimashita ne. Aisukuriimu o kaini narimasu.)",
              "{暑|あつ}いになりましたね。アイスクリームを{買|か}ってきます。 (Atsui ni narimashita ne. Aisukuriimu o katte kimasu.)",
              "{暑|あつ}くなりましたね。アイスクリームが{買|か}ってきます。 (Atsuku narimashita ne. Aisukuriimu ga katte kimasu.)",
              "{暑|あつ}くなりましたね。アイスクリームを{買|か}ってきます。 (Atsuku narimashita ne. Aisukuriimu o katte kimasu.)"
            ],
            "correct": 3,
            "why": "暑く なりました + 買って きます (đi mua rồi về)."
          },
          {
            "q": "(Mọi người đã về hết, công viên vắng.) Bạn nói:",
            "options": [
              "{静|しず}かになりましたね。 (Shizuka ni narimashita ne.)",
              "{静|しず}かななりましたね。 (Shizuka na narimashita ne.)",
              "{静|しず}かくなりましたね。 (Shizuka ku narimashita ne.)",
              "{静|しず}かいになりましたね。 (Shizukai ni narimashita ne.)"
            ],
            "correct": 0,
            "why": "Tính từ な → **に** なります."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np3-sai",
        "title": "Tìm câu SAI (8 câu)",
        "items": [
          {
            "q": "Câu nào SAI?",
            "options": [
              "{寒|さむ}くなりました。 (Samuku narimashita.)",
              "{寒|さむ}いになりました。 (Samui ni narimashita.)",
              "{暗|くら}くなりました。 (Kuraku narimashita.)",
              "{静|しず}かになりました。 (Shizuka ni narimashita.)"
            ],
            "correct": 1,
            "why": "Tính từ い: い → **く** なります."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{十時|じゅうじ}になりました。 (Juuji ni narimashita.)",
              "{上手|じょうず}になりました。 (Jouzu ni narimashita.)",
              "{元気|げんき}になりました。 (Genki ni narimashita.)",
              "{元気|げんき}くなりました。 (Genki ku narimashita.)"
            ],
            "correct": 3,
            "why": "Tính từ な: **に** なります."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{痛|いた}くなりました。 (Itaku narimashita.)",
              "{暑|あつ}くなりました。 (Atsuku narimashita.)",
              "よくなりました。 (Yoku narimashita.)",
              "いくなりました。 (Iku narimashita.)"
            ],
            "correct": 3,
            "why": "いい → **よく** なります (không phải ~~いく~~)."
          },
          {
            "q": "Câu nào SAI? (vừa nhìn thấy, chỉ cho bạn)",
            "options": [
              "あっ、サルがバナナを{食|た}べています。 (A, saru ga banana o tabete imasu.)",
              "あっ、パンダが{寝|ね}ています。 (A, panda ga nete imasu.)",
              "あっ、サルをバナナを{食|た}べています。 (A, saru o banana o tabete imasu.)",
              "あっ、{鳥|とり}が{飛|と}んでいます。 (A, tori ga tonde imasu.)"
            ],
            "correct": 2,
            "why": "Chủ thể: サル**が**; tân ngữ: バナナ**を**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "ここで{食事|しょくじ}ができます。 (Koko de shokuji ga dekimasu.)",
              "ここで{切手|きって}を{買|か}うことができます。 (Koko de kitte o kau koto ga dekimasu.)",
              "ここで{写真|しゃしん}を{撮|と}りますことができます。 (Koko de shashin o torimasu koto ga dekimasu.)",
              "ここで{写真|しゃしん}を{撮|と}ることができます。 (Koko de shashin o toru koto ga dekimasu.)"
            ],
            "correct": 2,
            "why": "Trước こと → **thể từ điển** (撮る)."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "ここで{買|か}い{物|もの}ができます。 (Koko de kaimono ga dekimasu.)",
              "ここで{食事|しょくじ}をできます。 (Koko de shokuji o dekimasu.)",
              "ここで{食事|しょくじ}ができます。 (Koko de shokuji ga dekimasu.)",
              "ここで{休|やす}むことができます。 (Koko de yasumu koto ga dekimasu.)"
            ],
            "correct": 1,
            "why": "できます đi với **が**."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{部屋|へや}が{静|しず}かになりました。 (Heya ga shizuka ni narimashita.)",
              "{部屋|へや}がきれくなりました。 (Heya ga kireku narimashita.)",
              "{部屋|へや}がきれいになりました。 (Heya ga kirei ni narimashita.)",
              "{部屋|へや}が{暗|くら}くなりました。 (Heya ga kuraku narimashita.)"
            ],
            "correct": 1,
            "why": "きれい là tính từ **な** → きれい**に** なります."
          },
          {
            "q": "Câu nào SAI?",
            "options": [
              "{来年|らいねん}、{医者|いしゃ}になります。 (Rainen, isha ni narimasu.)",
              "もうすぐ{十二月|じゅうにがつ}になります。 (Mousugu juunigatsu ni narimasu.)",
              "{来年|らいねん}、{医者|いしゃ}くなります。 (Rainen, isha ku narimasu.)",
              "もうすぐ{五時|ごじ}になります。 (Mousugu goji ni narimasu.)"
            ],
            "correct": 2,
            "why": "Danh từ: **に** なります."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-np3-go",
        "title": "Gõ câu theo nghĩa Việt (8 câu)",
        "kind": "translate",
        "grammar": "ポイント 90, 93, 95",
        "items": [
          {
            "q": "A, con khỉ đang ăn chuối.",
            "answers": [
              "あっ、サルがバナナを食べています。",
              "あっ、サルがバナナをたべています。",
              "あ、サルがバナナを食べています。",
              "あ、サルがバナナをたべています。"
            ],
            "hint": "あっ、N が Vています"
          },
          {
            "q": "Thật này!",
            "answers": [
              "本当だ。",
              "ほんとうだ。",
              "本当ですね。",
              "ほんとうですね。"
            ],
            "hint": "本当だ"
          },
          {
            "q": "Ở đây có thể ăn uống.",
            "answers": [
              "ここで食事ができます。",
              "ここでしょくじができます。"
            ],
            "hint": "N が できます"
          },
          {
            "q": "Ở đây chụp ảnh được không?",
            "answers": [
              "ここで写真を撮ることができますか。",
              "ここで写真をとることができますか。",
              "ここでしゃしんを撮ることができますか。",
              "ここでしゃしんをとることができますか。"
            ],
            "hint": "Vこと が できますか"
          },
          {
            "q": "Trời lạnh rồi nhỉ.",
            "answers": [
              "寒くなりましたね。",
              "さむくなりましたね。"
            ],
            "hint": "い → く なります"
          },
          {
            "q": "Trời tối rồi.",
            "answers": [
              "暗くなりました。",
              "くらくなりました。"
            ],
            "hint": "い → く なります"
          },
          {
            "q": "Sắp 12 giờ rồi.",
            "answers": [
              "もうすぐ十二時になります。",
              "もうすぐじゅうにじになります。",
              "もうすぐ12時になります。"
            ],
            "hint": "N に なります"
          },
          {
            "q": "Đã yên tĩnh rồi.",
            "answers": [
              "静かになりました。",
              "しずかになりました。"
            ],
            "hint": "ナA に なります"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-np3-ghep",
        "title": "Ghép câu (8 câu)",
        "items": [
          {
            "vi": "A, gấu trúc đang ngủ.",
            "chips": [
              "あっ、",
              "{寝|ね}て",
              "パンダを",
              "パンダが",
              "います"
            ],
            "answer": [
              "あっ、",
              "パンダが",
              "{寝|ね}て",
              "います"
            ],
            "ro": "A, panda ga nete imasu"
          },
          {
            "vi": "Ở sở thú này có thể cho voi ăn.",
            "chips": [
              "やることが",
              "やりますことが",
              "この{動物園|どうぶつえん}で",
              "ゾウにえさを",
              "できます"
            ],
            "answer": [
              "この{動物園|どうぶつえん}で",
              "ゾウにえさを",
              "やることが",
              "できます"
            ],
            "ro": "Kono doubutsuen de zou ni esa o yaru koto ga dekimasu"
          },
          {
            "vi": "Trời lạnh rồi. Uống cà phê không?",
            "chips": [
              "{寒|さむ}いに",
              "なりました。",
              "{寒|さむ}く",
              "{飲|の}みませんか",
              "コーヒーを"
            ],
            "answer": [
              "{寒|さむ}く",
              "なりました。",
              "コーヒーを",
              "{飲|の}みませんか"
            ],
            "ro": "Samuku narimashita. Koohii o nomimasen ka"
          },
          {
            "vi": "Trời tối rồi nên về thôi.",
            "chips": [
              "{暗|くら}いなりました",
              "{暗|くら}くなりました",
              "{帰|かえ}りましょう",
              "そろそろ",
              "から、"
            ],
            "answer": [
              "{暗|くら}くなりました",
              "から、",
              "そろそろ",
              "{帰|かえ}りましょう"
            ],
            "ro": "Kuraku narimashita kara, sorosoro kaerimashou"
          },
          {
            "vi": "Ở lối vào có thể nhận bản đồ.",
            "chips": [
              "{地図|ちず}を",
              "もらうことが",
              "{入|い}り{口|ぐち}で",
              "できます",
              "もらうことを"
            ],
            "answer": [
              "{入|い}り{口|ぐち}で",
              "{地図|ちず}を",
              "もらうことが",
              "できます"
            ],
            "ro": "Iriguchi de chizu o morau koto ga dekimasu"
          },
          {
            "vi": "Nhìn kìa, con chim đang bay.",
            "chips": [
              "{飛|と}びて",
              "います",
              "{見|み}てください。",
              "{飛|と}んで",
              "{鳥|とり}が"
            ],
            "answer": [
              "{見|み}てください。",
              "{鳥|とり}が",
              "{飛|と}んで",
              "います"
            ],
            "ro": "Mite kudasai. Tori ga tonde imasu"
          },
          {
            "vi": "Tiếng Nhật giỏi lên rồi nhỉ.",
            "chips": [
              "{日本語|にほんご}が",
              "なりましたね",
              "{上手|じょうず}く",
              "{上手|じょうず}に"
            ],
            "answer": [
              "{日本語|にほんご}が",
              "{上手|じょうず}に",
              "なりましたね"
            ],
            "ro": "Nihongo ga jouzu ni narimashita ne"
          },
          {
            "vi": "Ở đây có thể mua sắm và ăn uống.",
            "chips": [
              "できます",
              "{買|か}い{物|もの}や{食事|しょくじ}を",
              "{買|か}い{物|もの}や{食事|しょくじ}が",
              "ここで"
            ],
            "answer": [
              "ここで",
              "{買|か}い{物|もの}や{食事|しょくじ}が",
              "できます"
            ],
            "ro": "Koko de kaimono ya shokuji ga dekimasu"
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · TRỘN cả 10 điểm (88–97) · dịch · nhiều ô trống · tình huống"
      },
      {
        "t": "mcq",
        "id": "lt-b10-np3-tron",
        "title": "TRỘN ポイント 88–97 + thể ない (18 câu)",
        "items": [
          {
            "q": "ここで{写真|しゃしん}を＿＿ください。(biểncấmchụp)　〔Koko de shashin o __ kudasai. (Biển cấm chụp)〕　— Xin đừng chụp ảnh ở đây.",
            "options": [
              "{撮|と}ってきて",
              "{撮|と}らないで",
              "{撮|と}っても",
              "{撮|と}ることが"
            ],
            "correct": 1,
            "why": "Cấm → Vない で ください (88). → **ここで{写真|しゃしん}を{撮|と}らないでください。(biểncấmchụp)** 〔Koko de shashin o toranaide kudasai. (Biển cấm chụp)〕 — Xin đừng chụp ảnh ở đây."
          },
          {
            "q": "すみません、{窓|まど}を{開|あ}けて＿＿。(xinphép)　〔Sumimasen, mado o akete __. (Xin phép)〕　— Xin lỗi, tôi mở cửa sổ được không?",
            "options": [
              "いません",
              "もいいですか",
              "きます",
              "ください"
            ],
            "correct": 1,
            "why": "Xin phép → Vて も いいですか (89). → **すみません、{窓|まど}を{開|あ}けてもいいですか。(xinphép)** 〔Sumimasen, mado o akete mo ii desu ka. (Xin phép)〕 — Xin lỗi, tôi mở cửa sổ được không?"
          },
          {
            "q": "あっ、ペンギン＿＿{泳|およ}いでいます。(vừanhìnthấy)　〔A, pengin __ oyoide imasu. (Vừa nhìn thấy)〕　— A, chim cánh cụt đang bơi.",
            "options": [
              "は",
              "に",
              "が",
              "を"
            ],
            "correct": 2,
            "why": "Vừa thấy → N **が** Vています (90). → **あっ、ペンギンが{泳|およ}いでいます。(vừanhìnthấy)** 〔A, pengin ga oyoide imasu. (Vừa nhìn thấy)〕 — A, chim cánh cụt đang bơi."
          },
          {
            "q": "A：もう{薬|くすり}を{飲|の}みましたか。B：いいえ、まだ＿＿。　〔A: mou kusuri o nomimashita ka. B: iie, mada __.〕　— A: Uống thuốc chưa? B: Chưa, chưa uống.",
            "options": [
              "{飲|の}まないでください",
              "{飲|の}んできます",
              "{飲|の}みませんでした",
              "{飲|の}んでいません"
            ],
            "correct": 3,
            "why": "Chưa → まだ Vて いません (91). → **A：もう{薬|くすり}を{飲|の}みましたか。B：いいえ、まだ{飲|の}んでいません。** 〔A: mou kusuri o nomimashita ka. B: iie, mada nonde imasen.〕 — A: Uống thuốc chưa? B: Chưa, chưa uống."
          },
          {
            "q": "ちょっと{水|みず}を{買|か}って＿＿。(đimuarồivề)　〔Chotto mizu o katte __. (đi mua rồi về)〕　— Tôi đi mua nước một chút rồi về.",
            "options": [
              "きます",
              "ください",
              "います",
              "もいいですか"
            ],
            "correct": 0,
            "why": "Đi rồi quay lại → Vて きます (92). → **ちょっと{水|みず}を{買|か}ってきます。(đimuarồivề)** 〔Chotto mizu o katte kimasu. (đi mua rồi về)〕 — Tôi đi mua nước một chút rồi về."
          },
          {
            "q": "ここでボールを{借|か}りる＿＿ができますか。　〔Koko de booru o kariru __ ga dekimasu ka.〕　— Ở đây mượn bóng được không?",
            "options": [
              "ところ",
              "こと",
              "の",
              "もの"
            ],
            "correct": 1,
            "why": "Vこと が できます (93). → **ここでボールを{借|か}りることができますか。** 〔Koko de booru o kariru koto ga dekimasu ka.〕 — Ở đây mượn bóng được không?"
          },
          {
            "q": "ここから{海|うみ}＿＿よく{見|み}えます。　〔Koko kara umi __ yoku miemasu.〕　— Từ đây nhìn thấy biển rất rõ.",
            "options": [
              "を",
              "が",
              "で",
              "に"
            ],
            "correct": 1,
            "why": "が 見えます (94). → **ここから{海|うみ}がよく{見|み}えます。** 〔Koko kara umi ga yoku miemasu.〕 — Từ đây nhìn thấy biển rất rõ."
          },
          {
            "q": "{暗|くら}＿なりましたから、そろそろ{帰|かえ}りましょう。　〔Kura_ narimashita kara, sorosoro kaerimashou.〕　— Trời tối rồi nên sắp về thôi.",
            "options": [
              "に",
              "くて",
              "く",
              "い"
            ],
            "correct": 2,
            "why": "い → く なります (95). → **{暗|くら}＿なりましたから、そろそろ{帰|かえ}りましょう。** 〔Kura_ narimashita kara, sorosoro kaerimashou.〕 — Trời tối rồi nên sắp về thôi."
          },
          {
            "q": "その{橋|はし}＿＿{渡|わた}って、{右|みぎ}に{曲|ま}がってください。　〔Sono hashi __ watatte, migi ni magatte kudasai.〕　— Qua cây cầu đó rồi rẽ phải.",
            "options": [
              "に",
              "が",
              "で",
              "を"
            ],
            "correct": 3,
            "why": "Nơi đi qua → を (96). → **その{橋|はし}を{渡|わた}って、{右|みぎ}に{曲|ま}がってください。** 〔Sono hashi o watatte, migi ni magatte kudasai.〕 — Qua cây cầu đó rồi rẽ phải."
          },
          {
            "q": "（ここに{捨|す}てないでください。）ごみ＿＿{持|も}って{帰|かえ}ってください。　〔(Koko ni sutenaide kudasai.) gomi __ motte kaette kudasai.〕　— (Đừng vứt ở đây.) Rác thì hãy mang về.",
            "options": [
              "を",
              "に",
              "が",
              "は"
            ],
            "correct": 3,
            "why": "Đưa tân ngữ lên làm chủ đề → **は** (97). → **（ここに{捨|す}てないでください。）ごみは{持|も}って{帰|かえ}ってください。** 〔(Koko ni sutenaide kudasai.) gomi wa motte kaette kudasai.〕 — (Đừng vứt ở đây.) Rác thì hãy mang về."
          },
          {
            "q": "{芝生|しばふ}に＿＿でください。　〔Shibafu ni __ de kudasai.〕　— Xin đừng vào bãi cỏ.",
            "options": [
              "{入|はい}らない",
              "{入|はい}れない",
              "{入|はい}りない",
              "{入|はい}ない"
            ],
            "correct": 0,
            "why": "入ります nhóm 1 → 入らない (thể ない). → **{芝生|しばふ}に{入|はい}らないでください。** 〔Shibafu ni hairanai de kudasai.〕 — Xin đừng vào bãi cỏ."
          },
          {
            "q": "A：ここに{座|すわ}ってもいいですか。B：はい、＿＿。　〔A: koko ni suwatte mo ii desu ka. B: hai, __.〕　— A: Tôi ngồi đây được không? B: Vâng, mời.",
            "options": [
              "どうぞ",
              "{本当|ほんとう}だ",
              "まだです",
              "ちょっと{見|み}えます"
            ],
            "correct": 0,
            "why": "Đồng ý: はい、どうぞ (89). → **A：ここに{座|すわ}ってもいいですか。B：はい、どうぞ。** 〔A: koko ni suwatte mo ii desu ka. B: hai, douzo.〕 — A: Tôi ngồi đây được không? B: Vâng, mời."
          },
          {
            "q": "すみません、{電話|でんわ}がよく＿＿。　〔Sumimasen, denwa ga yoku __.〕　— Xin lỗi, điện thoại nghe không rõ.",
            "options": [
              "{聞|き}こえません",
              "{聞|き}かないでください",
              "{聞|き}いていません",
              "{聞|き}きません"
            ],
            "correct": 0,
            "why": "Nghe không rõ → よく 聞こえません (94). → **すみません、{電話|でんわ}がよく{聞|き}こえません。** 〔Sumimasen, denwa ga yoku kikoemasen.〕 — Xin lỗi, điện thoại nghe không rõ."
          },
          {
            "q": "{寒|さむ}くなりましたね。{喫茶店|きっさてん}でコーヒーを＿＿。　〔Samuku narimashita ne. Kissaten de koohii o __.〕　— Lạnh rồi nhỉ. Vào quán uống cà phê không?",
            "options": [
              "{飲|の}むこと",
              "{飲|の}みませんか",
              "{飲|の}んでいません",
              "{飲|の}まないでください"
            ],
            "correct": 1,
            "why": "Thay đổi (95) → rủ ～ませんか. → **{寒|さむ}くなりましたね。{喫茶店|きっさてん}でコーヒーを{飲|の}みませんか。** 〔Samuku narimashita ne. Kissaten de koohii o nomimasen ka.〕 — Lạnh rồi nhỉ. Vào quán uống cà phê không?"
          },
          {
            "q": "{観覧車|かんらんしゃ}に{乗|の}ることができます。{上|うえ}から{町|まち}＿＿{見|み}えますよ。　〔Kanransha ni noru koto ga dekimasu. Ue kara machi __ miemasu yo.〕　— Có thể đi vòng đu quay. Từ trên cao nhìn thấy cả thành phố đấy.",
            "options": [
              "が",
              "に",
              "を",
              "で"
            ],
            "correct": 0,
            "why": "93 + 94: 町**が** 見えます. → **{観覧車|かんらんしゃ}に{乗|の}ることができます。{上|うえ}から{町|まち}が{見|み}えますよ。** 〔Kanransha ni noru koto ga dekimasu. Ue kara machi ga miemasu yo.〕 — Có thể đi vòng đu quay. Từ trên cao nhìn thấy cả thành phố đấy."
          },
          {
            "q": "{皆|みな}さん、{集合|しゅうごう}{時間|じかん}に＿＿ください。{三時|さんじ}にバスの{前|まえ}に{集合|しゅうごう}してください。　〔Minasan, shuugou jikan ni __ kudasai. Sanji ni basu no mae ni shuugou shite kudasai.〕　— Mọi người đừng trễ giờ tập hợp. 3 giờ tập trung trước xe buýt.",
            "options": [
              "{遅|おく}れないで",
              "{遅|おく}れても",
              "{遅|おく}れて",
              "{遅|おく}らないで"
            ],
            "correct": 0,
            "why": "遅れます nhóm 2 → 遅れないで (88). → **{皆|みな}さん、{集合|しゅうごう}{時間|じかん}に{遅|おく}れないでください。{三時|さんじ}にバスの{前|まえ}に{集合|しゅうごう}してください。** 〔Minasan, shuugou jikan ni okurenaide kudasai. Sanji ni basu no mae ni shuugou shite kudasai.〕 — Mọi người đừng trễ giờ tập hợp. 3 giờ tập trung trước xe buýt."
          },
          {
            "q": "{次|つぎ}の{交差点|こうさてん}を{左|ひだり}＿＿{曲|ま}がって、まっすぐ{歩|ある}いてください。　〔Tsugi no kousaten o hidari __ magatte, massugu aruite kudasai.〕　— Rẽ trái ở ngã tư tiếp theo rồi đi bộ thẳng.",
            "options": [
              "を",
              "で",
              "が",
              "に"
            ],
            "correct": 3,
            "why": "Hướng rẽ → に (96). → **{次|つぎ}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がって、まっすぐ{歩|ある}いてください。** 〔Tsugi no kousaten o hidari ni magatte, massugu aruite kudasai.〕 — Rẽ trái ở ngã tư tiếp theo rồi đi bộ thẳng."
          },
          {
            "q": "A：あっ、クマが{立|た}っていますよ。B：あ、＿＿。すごいですね。　〔A: a, kuma ga tatte imasu yo. B: a, __. Sugoi desu ne.〕　— A: Ơ, con gấu đang đứng kìa. B: Thật này. Giỏi quá.",
            "options": [
              "{危|あぶ}ないでください",
              "{本当|ほんとう}だ",
              "まだです",
              "どうぞ"
            ],
            "correct": 1,
            "why": "Đáp lời chỉ (90) → 本当だ. → **A：あっ、クマが{立|た}っていますよ。B：あ、{本当|ほんとう}だ。すごいですね。** 〔A: a, kuma ga tatte imasu yo. B: a, hontouda. Sugoi desu ne.〕 — A: Ơ, con gấu đang đứng kìa. B: Thật này. Giỏi quá."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-np3-dich",
        "title": "Dịch Việt → Nhật (10 câu)",
        "kind": "translate",
        "grammar": "ポイント 88–97",
        "items": [
          {
            "q": "Nhìn kìa, con voi đang uống nước.",
            "answers": [
              "見てください。ゾウが水を飲んでいます。",
              "見てください。ゾウが水をのんでいます。",
              "見てください。ゾウがみずを飲んでいます。",
              "見てください。ゾウがみずをのんでいます。",
              "みてください。ゾウが水を飲んでいます。",
              "みてください。ゾウが水をのんでいます。",
              "みてください。ゾウがみずを飲んでいます。",
              "みてください。ゾウがみずをのんでいます。",
              "あっ、ゾウが水を飲んでいます。",
              "あっ、ゾウが水をのんでいます。",
              "あっ、ゾウがみずを飲んでいます。",
              "あっ、ゾウがみずをのんでいます。"
            ],
            "hint": "N が Vています"
          },
          {
            "q": "Ở sở thú này có thể cho khỉ ăn.",
            "answers": [
              "この動物園でサルにえさをやることができます。",
              "このどうぶつえんでサルにえさをやることができます。"
            ],
            "hint": "Vこと が できます"
          },
          {
            "q": "Trời lạnh rồi nhỉ. Uống cà phê không?",
            "answers": [
              "寒くなりましたね。コーヒーを飲みませんか。",
              "寒くなりましたね。コーヒーをのみませんか。",
              "さむくなりましたね。コーヒーを飲みませんか。",
              "さむくなりましたね。コーヒーをのみませんか。"
            ],
            "hint": "く なりました + ませんか"
          },
          {
            "q": "Sắp 5 giờ rồi. Về thôi.",
            "answers": [
              "もうすぐ五時になります。帰りましょう。",
              "もうすぐ五時になります。かえりましょう。",
              "もうすぐごじになります。帰りましょう。",
              "もうすぐごじになります。かえりましょう。",
              "もうすぐ5時になります。帰りましょう。",
              "もうすぐ5時になります。かえりましょう。",
              "そろそろ五時になります。帰りましょう。",
              "そろそろ五時になります。かえりましょう。",
              "そろそろごじになります。帰りましょう。",
              "そろそろごじになります。かえりましょう。"
            ],
            "hint": "N に なります"
          },
          {
            "q": "Ở đây không mượn được bóng. Bóng thì hãy mượn ở quầy lễ tân.",
            "answers": [
              "ここでボールを借りることができません。ボールは受付で借りてください。",
              "ここでボールを借りることができません。ボールは受付でかりてください。",
              "ここでボールを借りることができません。ボールはうけつけで借りてください。",
              "ここでボールを借りることができません。ボールはうけつけでかりてください。",
              "ここでボールをかりることができません。ボールは受付で借りてください。",
              "ここでボールをかりることができません。ボールは受付でかりてください。",
              "ここでボールをかりることができません。ボールはうけつけで借りてください。",
              "ここでボールをかりることができません。ボールはうけつけでかりてください。"
            ],
            "hint": "93 + 97"
          },
          {
            "q": "Đi bộ nhiều nên mệt rồi. Nghỉ ở ghế dài đằng kia đi.",
            "answers": [
              "たくさん歩きましたから、疲れました。あそこのベンチで休みましょう。",
              "たくさん歩きましたから、疲れました。あそこのベンチでやすみましょう。",
              "たくさん歩きましたから、つかれました。あそこのベンチで休みましょう。",
              "たくさん歩きましたから、つかれました。あそこのベンチでやすみましょう。",
              "たくさんあるきましたから、疲れました。あそこのベンチで休みましょう。",
              "たくさんあるきましたから、疲れました。あそこのベンチでやすみましょう。",
              "たくさんあるきましたから、つかれました。あそこのベンチで休みましょう。",
              "たくさんあるきましたから、つかれました。あそこのベンチでやすみましょう。"
            ],
            "hint": "から + ましょう"
          },
          {
            "q": "Đường trở nên nguy hiểm nên đừng chạy ra đường chơi.",
            "answers": [
              "道が危なくなりましたから、道で遊ばないでください。",
              "道が危なくなりましたから、道であそばないでください。",
              "道が危なくなりましたから、みちで遊ばないでください。",
              "道が危なくなりましたから、みちであそばないでください。",
              "道があぶなくなりましたから、道で遊ばないでください。",
              "道があぶなくなりましたから、道であそばないでください。",
              "道があぶなくなりましたから、みちで遊ばないでください。",
              "道があぶなくなりましたから、みちであそばないでください。",
              "みちが危なくなりましたから、道で遊ばないでください。",
              "みちが危なくなりましたから、道であそばないでください。",
              "みちが危なくなりましたから、みちで遊ばないでください。",
              "みちが危なくなりましたから、みちであそばないでください。",
              "みちがあぶなくなりましたから、道で遊ばないでください。",
              "みちがあぶなくなりましたから、道であそばないでください。",
              "みちがあぶなくなりましたから、みちで遊ばないでください。",
              "みちがあぶなくなりましたから、みちであそばないでください。"
            ],
            "hint": "95 + 88"
          },
          {
            "q": "Đã yên tĩnh rồi nhỉ. Bọn trẻ về rồi.",
            "answers": [
              "静かになりましたね。子どもたちが帰りました。",
              "静かになりましたね。子どもたちがかえりました。",
              "静かになりましたね。こどもたちが帰りました。",
              "静かになりましたね。こどもたちがかえりました。",
              "しずかになりましたね。子どもたちが帰りました。",
              "しずかになりましたね。子どもたちがかえりました。",
              "しずかになりましたね。こどもたちが帰りました。",
              "しずかになりましたね。こどもたちがかえりました。",
              "静かになりましたね。子どもたちは帰りました。",
              "静かになりましたね。子どもたちはかえりました。",
              "静かになりましたね。こどもたちは帰りました。",
              "静かになりましたね。こどもたちはかえりました。",
              "しずかになりましたね。子どもたちは帰りました。",
              "しずかになりましたね。子どもたちはかえりました。",
              "しずかになりましたね。こどもたちは帰りました。",
              "しずかになりましたね。こどもたちはかえりました。"
            ],
            "hint": "ナA に なります · ～たち"
          },
          {
            "q": "Ở cửa hàng tiện lợi có thể mua tem.",
            "answers": [
              "コンビニで切手を買うことができます。",
              "コンビニで切手をかうことができます。",
              "コンビニできってを買うことができます。",
              "コンビニできってをかうことができます。"
            ],
            "hint": "Vこと が できます"
          },
          {
            "q": "Thuốc thì uống rồi, nên khoẻ lại rồi.",
            "answers": [
              "薬はもう飲みましたから、元気になりました。",
              "薬はもう飲みましたから、げんきになりました。",
              "薬はもうのみましたから、元気になりました。",
              "薬はもうのみましたから、げんきになりました。",
              "くすりはもう飲みましたから、元気になりました。",
              "くすりはもう飲みましたから、げんきになりました。",
              "くすりはもうのみましたから、元気になりました。",
              "くすりはもうのみましたから、げんきになりました。"
            ],
            "hint": "97 + 95"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np3-nhieu-o",
        "title": "Nhiều ô trống — chọn bộ đúng (6 câu)",
        "items": [
          {
            "q": "あっ、サル（①）バナナ（②）{食|た}べています。　〔A, saru ((1)) banana ((2)) tabete imasu.〕　— A, con khỉ đang ăn chuối.",
            "options": [
              "① が　② に",
              "① は　② が",
              "① を　② が",
              "① が　② を"
            ],
            "correct": 3,
            "why": "Chủ thể **が** · tân ngữ **を**. → **あっ、サルがバナナを{食|た}べています。** 〔A, saru ga banana o tabete imasu.〕 — A, con khỉ đang ăn chuối."
          },
          {
            "q": "{寒|さむ}（①）なりましたね。{喫茶店|きっさてん}に{入|はい}り（②）か。　〔Samu((1)) narimashita ne. Kissaten ni hairi((2)) ka.〕　— Lạnh rồi nhỉ. Vào quán cà phê không?",
            "options": [
              "① い　② ません",
              "① く　② ましょう",
              "① く　② ません",
              "① に　② ません"
            ],
            "correct": 2,
            "why": "寒**く** なりました · rủ 入り**ません**か. → **{寒|さむ}くなりましたね。{喫茶店|きっさてん}に{入|はい}りませんか。** 〔Samuku narimashita ne. Kissaten ni hairimasen ka.〕 — Lạnh rồi nhỉ. Vào quán cà phê không?"
          },
          {
            "q": "ここで{写真|しゃしん}を{撮|と}る（①）が（②）か。　〔Koko de shashin o toru ((1)) ga ((2)) ka.〕　— Ở đây chụp ảnh được không?",
            "options": [
              "① こと　② あります",
              "① こと　② できます",
              "① の　② します",
              "① もの　② できます"
            ],
            "correct": 1,
            "why": "Vこと が できますか. → **ここで{写真|しゃしん}を{撮|と}ることができますか。** 〔Koko de shashin o toru koto ga dekimasu ka.〕 — Ở đây chụp ảnh được không?"
          },
          {
            "q": "{観覧車|かんらんしゃ}から{海|うみ}（①）{見|み}えます。{夜|よる}は{暗|くら}（②）なりますから、{昼|ひる}に{乗|の}りましょう。　〔Kanransha kara umi ((1)) miemasu. Yoru wa kura((2)) narimasu kara, hiru ni norimashou.〕　— Từ vòng đu quay thấy biển. Buổi tối trời tối nên hãy đi buổi trưa.",
            "options": [
              "① を　② い",
              "① が　② く",
              "① が　② に",
              "① を　② く"
            ],
            "correct": 1,
            "why": "海**が** 見えます · 暗**く** なります. → **{観覧車|かんらんしゃ}から{海|うみ}が{見|み}えます。{夜|よる}は{暗|くら}くなりますから、{昼|ひる}に{乗|の}りましょう。** 〔Kanransha kara umi ga miemasu. Yoru wa kuraku narimasu kara, hiru ni norimashou.〕 — Từ vòng đu quay thấy biển. Buổi tối trời tối nên hãy đi buổi trưa."
          },
          {
            "q": "{静|しず}か（①）なりました。パンダが（②）います。　〔Shizuka ((1)) narimashita. Panda ga ((2)) imasu.〕　— Đã yên tĩnh rồi. Gấu trúc đang ngủ.",
            "options": [
              "① に　② {寝|ね}て",
              "① な　② {寝|ね}って",
              "① に　② {寝|ね}ます",
              "① く　② {寝|ね}て"
            ],
            "correct": 0,
            "why": "静か**に** なりました · 寝**て** います. → **{静|しず}かになりました。パンダが{寝|ね}ています。** 〔Shizuka ni narimashita. Panda ga nete imasu.〕 — Đã yên tĩnh rồi. Gấu trúc đang ngủ."
          },
          {
            "q": "えさは{入|い}り{口|ぐち}で{買|か}うこと（①）できます。でも、サルには（②）でください。　〔Esa wa iriguchi de kau koto ((1)) dekimasu. Demo, saru ni wa ((2)) de kudasai.〕　— Thức ăn có thể mua ở lối vào. Nhưng đừng cho khỉ ăn.",
            "options": [
              "① が　② やらない",
              "① は　② やって",
              "① を　② やらない",
              "① が　② やりない"
            ],
            "correct": 0,
            "why": "こと**が** できます · cấm: やら**ない**で. → **えさは{入|い}り{口|ぐち}で{買|か}うことができます。でも、サルにはやらないでください。** 〔Esa wa iriguchi de kau koto ga dekimasu. Demo, saru ni wa yaranaide kudasai.〕 — Thức ăn có thể mua ở lối vào. Nhưng đừng cho khỉ ăn."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-np3-tinh-huong",
        "title": "Tình huống: nên nói câu nào? (6 câu)",
        "items": [
          {
            "q": "Ở sở thú, bạn thấy con khỉ đang ăn chuối, chỉ cho bạn mình.",
            "options": [
              "あっ、サルをバナナが{食|た}べていますよ。 (A, saru o banana ga tabete imasu yo.)",
              "あっ、サルがバナナを{食|た}べましたか。 (A, saru ga banana o tabemashita ka.)",
              "あっ、サルはバナナを{食|た}べます。 (A, saru wa banana o tabemasu.)",
              "あっ、サルがバナナを{食|た}べていますよ。 (A, saru ga banana o tabete imasu yo.)"
            ],
            "correct": 3,
            "why": "Vừa thấy → N **が** Vています."
          },
          {
            "q": "Bạn hỏi nhân viên sở thú có cho voi ăn được không.",
            "options": [
              "すみません、ゾウにえさをやらないでください。 (Sumimasen, zou ni esa o yaranaide kudasai.)",
              "すみません、ゾウがえさをやっていますか。 (Sumimasen, zou ga esa o yatte imasu ka.)",
              "すみません、ゾウにえさをやることができますか。 (Sumimasen, zou ni esa o yaru koto ga dekimasu ka.)",
              "すみません、ゾウにえさをやりますことができますか。 (Sumimasen, zou ni esa o yarimasu koto ga dekimasu ka.)"
            ],
            "correct": 2,
            "why": "Hỏi nơi này làm được gì: Vこと が できますか."
          },
          {
            "q": "Trời trở lạnh. Bạn rủ bạn vào quán uống đồ nóng.",
            "options": [
              "{寒|さむ}いになりましたね。{喫茶店|きっさてん}で{何|なに}か{飲|の}みませんか。 (Samui ni narimashita ne. Kissaten de nanika nomimasen ka.)",
              "{寒|さむ}くなりましたね。{喫茶店|きっさてん}で{何|なに}か{飲|の}んでいません。 (Samuku narimashita ne. Kissaten de nanika nonde imasen.)",
              "{寒|さむ}くしますね。{喫茶店|きっさてん}で{何|なに}か{飲|の}みませんか。 (Samuku shimasu ne. Kissaten de nanika nomimasen ka.)",
              "{寒|さむ}くなりましたね。{喫茶店|きっさてん}で{何|なに}か{飲|の}みませんか。 (Samuku narimashita ne. Kissaten de nanika nomimasen ka.)"
            ],
            "correct": 3,
            "why": "寒く なりました + ～ませんか."
          },
          {
            "q": "Nhân viên hỏi bạn: 「ここで 何が できますか」 (ở trung tâm mua sắm). Bạn trả lời.",
            "options": [
              "{買|か}い{物|もの}と{食事|しょくじ}がします。 (Kaimono to shokuji ga shimasu.)",
              "{買|か}い{物|もの}と{食事|しょくじ}ができます。 (Kaimono to shokuji ga dekimasu.)",
              "{買|か}い{物|もの}と{食事|しょくじ}をできます。 (Kaimono to shokuji o dekimasu.)",
              "{買|か}い{物|もの}と{食事|しょくじ}をしますことができます。 (Kaimono to shokuji o shimasu koto ga dekimasu.)"
            ],
            "correct": 1,
            "why": "N と N **が** できます."
          },
          {
            "q": "Đã 6 giờ, trời tối. Bạn đề nghị cả nhóm về.",
            "options": [
              "{暗|くら}いになりましたから、そろそろ{帰|かえ}りましょう。 (Kurai ni narimashita kara, sorosoro kaerimashou.)",
              "{暗|くら}くなりましたから、そろそろ{帰|かえ}りましょう。 (Kuraku narimashita kara, sorosoro kaerimashou.)",
              "{暗|くら}くなりましたから、まだ{帰|かえ}っていません。 (Kuraku narimashita kara, mada kaette imasen.)",
              "{暗|くら}くなりましたから、{帰|かえ}らないでください。 (Kuraku narimashita kara, kaeranaide kudasai.)"
            ],
            "correct": 1,
            "why": "暗く なりました + そろそろ ～ましょう."
          },
          {
            "q": "Bạn ở trên vòng đu quay, gọi điện cho bạn ở dưới: \"Từ đây nhìn thấy biển!\"",
            "options": [
              "ここから{海|うみ}が{見|み}えますよ。 (Koko kara umi ga miemasu yo.)",
              "ここから{海|うみ}が{見|み}せますよ。 (Koko kara umi ga misemasu yo.)",
              "ここから{海|うみ}を{見|み}えますよ。 (Koko kara umi o miemasu yo.)",
              "ここで{海|うみ}が{見|み}ますよ。 (Koko de umi ga mimasu yo.)"
            ],
            "correct": 0,
            "why": "N が 見えます."
          }
        ]
      },
      {
        "t": "note",
        "title": "Ghi nhớ",
        "items": [
          "**あっ、N が Vて います** (thấy ngay trước mắt) · **(nơi) で N が／Vこと が できます** · **い → く なります / な・N → に なります** (いい → よく).",
          "Bài 10 có 10 điểm + thể ない: nhắc nhở (88), xin phép (89), chỉ cho xem (90), chưa (91), đi rồi về (92), nơi làm được (93), thấy/nghe (94), thay đổi (95), nơi đi qua を (96), N は đối chiếu (97)."
        ]
      }
    ]
  },
  {
    "id": "lt-b10-hoi-thoai",
    "kind": "conversation",
    "title": "Luyện thêm Bài 10 · Hội thoại — lạc đường đến điểm tập hợp · trước giờ xe chạy · hướng dẫn viên nhắc · ở bảo tàng · ở sở thú (5 hội thoại mới, ~55 câu)",
    "goal": "Hiểu và tự nói được hội thoại Bài 10: gọi điện chỉ đường đến điểm tập hợp, nói đã/chưa và \"đi … rồi về\", xin phép – từ chối khéo – chỉ cách khác, nghe hiểu lời nhắc nơi công cộng, chỉ cho bạn thấy con vật đang làm gì, hỏi nơi này làm được gì và đề xuất theo tình hình.",
    "minutes": 80,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Mỗi hội thoại làm 4 bước: **đọc + nghe** → **câu hỏi hiểu** → **điền chỗ trống** → **sắp xếp lượt thoại**; cuối bài là phần **tự nói** (che một vai).",
          "Khi nghe, bắt 4 thứ: **đã/chưa** (もう～ましたか → まだ～ていません), **được phép không** (～てもいいですか → どうぞ／ちょっと…), **cấm gì** (～ないでください), **thấy gì – đi đường nào** (～が見えます · ～を渡って、～を右に曲がって).",
          "Lỗi hay mắc: dùng ~~まだ～ませんでした~~ thay cho まだ～ていません; ~~海を見えます~~ (phải が); quên **で** trong ～ないでください; ~~寒いになりました~~ (phải 寒くなりました)."
        ]
      },
      {
        "t": "recap",
        "title": "Khuôn chung của Bài 10 (バスツアー)",
        "items": [
          "**Tập hợp (集合)**: もしもし、今 どこですか → まだ 駅です → そこから 何が 見えますか → ～を 渡って、～を 右に 曲がってください · ちょっと ～て きます.",
          "**Lời nhắc (注意)**: ～ないで ください · ～ても いいですか → はい、どうぞ／すみません、ちょっと…… · N は ～てください (chỉ cách khác).",
          "**Sở thú (動物園で)**: あっ、N が ～ています → 本当だ · ここで ～ことが できますか · 寒く なりましたね → ～ませんか · そろそろ 帰りましょう."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · Hội thoại 1–2: gọi điện đến điểm tập hợp · trước giờ xe chạy"
      },
      {
        "t": "p",
        "text": "**Tình huống 1.** Sáng thứ Bảy, cả lớp tập hợp trước toà nhà KS để đi tour xe buýt. Đã 8 giờ 50 mà Marco chưa đến. Anna gọi điện cho Marco."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 1 — Marco lạc đường đến điểm tập hợp",
        "lines": [
          {
            "who": "アンナ",
            "role": "a",
            "text": "もしもし、マルコさん？{今|いま}、どこですか。バスは{九時|くじ}に{出|で}ますよ。",
            "ro": "Moshimoshi, Maruko-san? Ima, doko desu ka. Basu wa kuji ni demasu yo.",
            "vi": "Alô, Marco à? Bây giờ bạn ở đâu? Xe buýt 9 giờ chạy đấy."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "すみません。{駅|えき}から{歩|ある}いていますが、{道|みち}がよくわかりません。",
            "ro": "Sumimasen. Eki kara aruite imasu ga, michi ga yoku wakarimasen.",
            "vi": "Xin lỗi. Mình đang đi bộ từ ga mà không rõ đường lắm."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "そこから{何|なに}が{見|み}えますか。",
            "ro": "Soko kara nani ga miemasu ka.",
            "vi": "Từ chỗ bạn thấy gì?"
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "ええと……{大|おお}きい{橋|はし}が{見|み}えます。{右|みぎ}に{銀行|ぎんこう}もあります。",
            "ro": "Eeto... Ookii hashi ga miemasu. Migi ni ginkou mo arimasu.",
            "vi": "Ờ… mình thấy một cây cầu lớn. Bên phải có cả ngân hàng."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "じゃあ、その{橋|はし}を{渡|わた}って、{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}に{曲|ま}がってください。",
            "ro": "Jaa, sono hashi o watatte, futatsume no shingou o hidari ni magatte kudasai.",
            "vi": "Vậy bạn qua cây cầu đó rồi rẽ trái ở đèn giao thông thứ hai nhé."
          },
          {
            "who": "マルコ",
            "role": "b",
            "text": "{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}ですね。わかりました。すぐ{行|い}きます。",
            "ro": "Futatsume no shingou o hidari desu ne. Wakarimashita. Sugu ikimasu.",
            "vi": "Đèn thứ hai rẽ trái nhỉ. Mình hiểu rồi. Mình đến ngay."
          },
          {
            "who": "アンナ",
            "role": "a",
            "text": "KSビルの{前|まえ}で{待|ま}っています。{早|はや}く{来|き}てくださいね。",
            "ro": "KS biru no mae de matte imasu. Hayaku kite kudasai ne.",
            "vi": "Mình đang chờ trước toà nhà KS. Đến nhanh nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-ht1-hieu",
        "title": "Hội thoại 1 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Xe buýt chạy lúc mấy giờ?",
            "options": [
              "10 giờ",
              "9 giờ",
              "Không nói",
              "8 giờ 50"
            ],
            "correct": 1,
            "why": "バスは 九時に 出ますよ."
          },
          {
            "q": "Marco đang ở đâu, làm gì?",
            "options": [
              "Đang chờ ở toà nhà KS",
              "Đang ở nhà, mới dậy",
              "Đang trên xe buýt",
              "Đang đi bộ từ ga, không rõ đường"
            ],
            "correct": 3,
            "why": "駅から 歩いていますが、道が よく わかりません."
          },
          {
            "q": "Marco nhìn thấy gì?",
            "options": [
              "Một cây cầu lớn",
              "Một ngân hàng lớn bên trái",
              "Đèn giao thông thứ hai",
              "Toà nhà KS"
            ],
            "correct": 0,
            "why": "大きい 橋が 見えます (ngân hàng thì ở bên PHẢI)."
          },
          {
            "q": "Anna chỉ đường thế nào?",
            "options": [
              "Rẽ trái ở cầu, đi thẳng",
              "Qua cầu, rẽ trái ở đèn giao thông thứ hai",
              "Qua cầu, rẽ phải ở đèn thứ hai",
              "Qua đèn thứ hai rồi qua cầu"
            ],
            "correct": 1,
            "why": "橋を 渡って、二つ目の 信号を 左に 曲がって."
          },
          {
            "q": "Anna chờ ở đâu?",
            "options": [
              "Trên cầu",
              "Trước ga",
              "Trước ngân hàng",
              "Trước toà nhà KS"
            ],
            "correct": 3,
            "why": "KSビルの 前で 待っています."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "Marco đã đến điểm tập hợp",
              "Anna sẽ ra ga đón Marco",
              "Marco nói sẽ đến ngay",
              "Xe buýt sẽ chờ Marco đến 10 giờ"
            ],
            "correct": 2,
            "why": "すぐ 行きます."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-ht1-dien",
        "title": "Hội thoại 1 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "アンナ：そこから{何|なに}＿＿{見|み}えますか。　〔Anna: soko kara nani __ miemasu ka.〕",
            "answers": [
              "が"
            ],
            "hint": "N が 見えます"
          },
          {
            "q": "マルコ：{大|おお}きい{橋|はし}が＿＿。　〔Maruko: ookii hashi ga __.〕",
            "answers": [
              "見えます",
              "みえます"
            ],
            "hint": "Nhìn thấy"
          },
          {
            "q": "アンナ：その{橋|はし}＿＿{渡|わた}ってください。　〔Anna: sono hashi __ watatte kudasai.〕",
            "answers": [
              "を"
            ],
            "hint": "Nơi đi qua"
          },
          {
            "q": "アンナ：{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}＿＿{曲|ま}がってください。　〔Anna: futatsume no shingou o hidari __ magatte kudasai.〕",
            "answers": [
              "に"
            ],
            "hint": "Hướng rẽ"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-ht1-sx",
        "title": "Hội thoại 1 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi đang ở đâu → nói không rõ đường → hỏi thấy gì → nói thấy cầu.",
            "chips": [
              "もしもし、マルコさん？{今|いま}、どこですか。バスは{九時|くじ}に{出|で}ますよ。",
              "すみません。{駅|えき}から{歩|ある}いていますが、{道|みち}がよくわかりません。",
              "そこから{何|なに}が{見|み}えますか。",
              "ええと……{大|おお}きい{橋|はし}が{見|み}えます。{右|みぎ}に{銀行|ぎんこう}もあります。"
            ],
            "answer": [
              "もしもし、マルコさん？{今|いま}、どこですか。バスは{九時|くじ}に{出|で}ますよ。",
              "すみません。{駅|えき}から{歩|ある}いていますが、{道|みち}がよくわかりません。",
              "そこから{何|なに}が{見|み}えますか。",
              "ええと……{大|おお}きい{橋|はし}が{見|み}えます。{右|みぎ}に{銀行|ぎんこう}もあります。"
            ],
            "ro": "Moshimoshi, Maruko-san? Ima, doko desu ka. Basu wa kuji ni demasu yo. Sumimasen. Eki kara aruite imasu ga, michi ga yoku wakarimasen. Soko kara nani ga miemasu ka. Eeto... Ookii hashi ga miemasu. Migi ni ginkou mo arimasu."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 2.** Trước giờ xe chạy 15 phút. Park và Daniel đứng cạnh xe buýt."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 2 — Còn 15 phút — đi mua đồ rồi quay lại",
        "lines": [
          {
            "who": "パク",
            "role": "a",
            "text": "ダニエルさん、もうお{弁当|べんとう}を{買|か}いましたか。",
            "ro": "Danieru-san, mou obentou o kaimashita ka.",
            "vi": "Daniel, bạn mua cơm hộp chưa?"
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "いいえ、まだ{買|か}っていません。パクさんは？",
            "ro": "Iie, mada katte imasen. Paku-san wa?",
            "vi": "Chưa, mình chưa mua. Còn Park?"
          },
          {
            "who": "パク",
            "role": "a",
            "text": "{私|わたし}はもう{買|か}いました。あそこのコンビニで{買|か}うことができますよ。",
            "ro": "Watashi wa mou kaimashita. Asoko no konbini de kau koto ga dekimasu yo.",
            "vi": "Mình mua rồi. Có thể mua ở cửa hàng tiện lợi đằng kia đấy."
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "じゃあ、ちょっと{買|か}ってきます。あ、{薬|くすり}もまだ{飲|の}んでいません。",
            "ro": "Jaa, chotto katte kimasu. A, kusuri mo mada nonde imasen.",
            "vi": "Vậy mình đi mua một chút rồi quay lại. À, thuốc mình cũng chưa uống."
          },
          {
            "who": "パク",
            "role": "a",
            "text": "バスは{二時間|にじかん}ですよ。{今|いま}{飲|の}んでください。",
            "ro": "Basu wa nijikan desu yo. Ima nonde kudasai.",
            "vi": "Đi xe buýt những hai tiếng đấy. Uống ngay bây giờ đi."
          },
          {
            "who": "ダニエル",
            "role": "b",
            "text": "はい。{荷物|にもつ}をここに{置|お}いてもいいですか。",
            "ro": "Hai. Nimotsu o koko ni oite mo ii desu ka.",
            "vi": "Ừ. Mình để hành lý ở đây được không?"
          },
          {
            "who": "パク",
            "role": "a",
            "text": "はい、どうぞ。{見|み}ていますから。{遅|おく}れないでくださいね。",
            "ro": "Hai, douzo. Mite imasu kara. Okurenaide kudasai ne.",
            "vi": "Ừ, cứ để. Mình trông cho. Đừng về trễ nhé."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-ht2-hieu",
        "title": "Hội thoại 2 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Daniel đã mua cơm hộp chưa?",
            "options": [
              "Rồi",
              "Chưa",
              "Không định mua",
              "Park mua giúp rồi"
            ],
            "correct": 1,
            "why": "まだ 買って いません."
          },
          {
            "q": "Park thì sao?",
            "options": [
              "Đã mua rồi",
              "Cũng chưa mua",
              "Không ăn trưa",
              "Mua ở ga"
            ],
            "correct": 0,
            "why": "私は もう 買いました."
          },
          {
            "q": "Có thể mua cơm hộp ở đâu?",
            "options": [
              "Cửa hàng tiện lợi đằng kia",
              "Trên xe buýt",
              "Ở nhà hàng gần cầu",
              "Ở ga"
            ],
            "correct": 0,
            "why": "あそこの コンビニで 買う ことが できます."
          },
          {
            "q": "Daniel còn chưa làm việc gì?",
            "options": [
              "Uống thuốc",
              "Gọi điện cho cô giáo",
              "Để hành lý lên xe",
              "Mua vé"
            ],
            "correct": 0,
            "why": "薬も まだ 飲んで いません."
          },
          {
            "q": "Vì sao Park bảo Daniel uống thuốc ngay?",
            "options": [
              "Vì cô giáo dặn",
              "Vì Daniel đang đau bụng",
              "Vì đi xe buýt mất hai tiếng",
              "Vì thuốc sắp hết"
            ],
            "correct": 2,
            "why": "バスは 二時間ですよ。今 飲んで ください."
          },
          {
            "q": "Daniel xin phép điều gì?",
            "options": [
              "Để hành lý ở đây",
              "Mượn tiền Park",
              "Đi vệ sinh",
              "Ngồi cạnh Park"
            ],
            "correct": 0,
            "why": "荷物を ここに 置いても いいですか."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-ht2-dien",
        "title": "Hội thoại 2 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "ダニエル：いいえ、まだ{買|か}って＿＿。　〔Danieru: iie, mada katte __.〕",
            "answers": [
              "いません"
            ],
            "hint": "まだ Vて いません"
          },
          {
            "q": "ダニエル：じゃあ、ちょっと{買|か}って＿＿。　〔Danieru: jaa, chotto katte __.〕",
            "answers": [
              "きます"
            ],
            "hint": "Đi rồi quay lại"
          },
          {
            "q": "ダニエル：{荷物|にもつ}をここに{置|お}いて＿＿いいですか。　〔Danieru: nimotsu o koko ni oite __ ii desu ka.〕",
            "answers": [
              "も"
            ],
            "hint": "Xin phép"
          },
          {
            "q": "パク：{遅|おく}れない＿＿くださいね。　〔Paku: okurenai __ kudasai ne.〕",
            "answers": [
              "で"
            ],
            "hint": "Xin đừng"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-ht2-sx",
        "title": "Hội thoại 2 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: hỏi mua cơm chưa → chưa → mình mua rồi, mua ở cửa hàng tiện lợi → đi mua rồi về.",
            "chips": [
              "ダニエルさん、もうお{弁当|べんとう}を{買|か}いましたか。",
              "じゃあ、ちょっと{買|か}ってきます。あ、{薬|くすり}もまだ{飲|の}んでいません。",
              "{私|わたし}はもう{買|か}いました。あそこのコンビニで{買|か}うことができますよ。",
              "いいえ、まだ{買|か}っていません。パクさんは？"
            ],
            "answer": [
              "ダニエルさん、もうお{弁当|べんとう}を{買|か}いましたか。",
              "いいえ、まだ{買|か}っていません。パクさんは？",
              "{私|わたし}はもう{買|か}いました。あそこのコンビニで{買|か}うことができますよ。",
              "じゃあ、ちょっと{買|か}ってきます。あ、{薬|くすり}もまだ{飲|の}んでいません。"
            ],
            "ro": "Danieru-san, mou obentou o kaimashita ka. Iie, mada katte imasen. Paku-san wa? Watashi wa mou kaimashita. Asoko no konbini de kau koto ga dekimasu yo. Jaa, chotto katte kimasu. A, kusuri mo mada nonde imasen."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · Hội thoại 3–4: trên xe buýt · ở bảo tàng"
      },
      {
        "t": "p",
        "text": "**Tình huống 3.** Xe buýt đang chạy trên đường cao tốc. Hướng dẫn viên Nishikawa nói với cả đoàn; Wang ngồi gần cửa sổ."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 3 — Hướng dẫn viên nhắc cả đoàn",
        "lines": [
          {
            "who": "西川",
            "role": "b",
            "text": "{皆|みな}さん、バスの{中|なか}で{立|た}たないでください。{危|あぶ}ないですから。",
            "ro": "Minasan, basu no naka de tatanaide kudasai. Abunai desu kara.",
            "vi": "Mọi người ơi, xin đừng đứng lên trong xe buýt. Vì nguy hiểm."
          },
          {
            "who": "西川",
            "role": "b",
            "text": "それから、{窓|まど}から{手|て}を{出|だ}さないでください。",
            "ro": "Sorekara, mado kara te o dasanaide kudasai.",
            "vi": "Ngoài ra, xin đừng thò tay ra ngoài cửa sổ."
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "すみません。{暑|あつ}いですから、{窓|まど}を{開|あ}けてもいいですか。",
            "ro": "Sumimasen. Atsui desu kara, mado o akete mo ii desu ka.",
            "vi": "Xin lỗi. Nóng quá, tôi mở cửa sổ được không ạ?"
          },
          {
            "who": "西川",
            "role": "b",
            "text": "すみません。{窓|まど}はちょっと……。カーテンは{閉|し}めてもいいですよ。",
            "ro": "Sumimasen. Mado wa chotto.... Kaaten wa shimete mo ii desu yo.",
            "vi": "Xin lỗi. Cửa sổ thì hơi… Rèm thì chị cứ kéo lại."
          },
          {
            "who": "ワン",
            "role": "a",
            "text": "ありがとうございます。あの、ごみはどこに{捨|す}てますか。",
            "ro": "Arigatou gozaimasu. Ano, gomi wa doko ni sutemasu ka.",
            "vi": "Cảm ơn anh. À, rác thì vứt ở đâu ạ?"
          },
          {
            "who": "西川",
            "role": "b",
            "text": "バスではごみを{捨|す}てることができません。ごみはうちへ{持|も}って{帰|かえ}ってください。",
            "ro": "Basu de wa gomi o suteru koto ga dekimasen. Gomi wa uchi e motte kaette kudasai.",
            "vi": "Trên xe không vứt rác được. Rác thì xin mang về nhà."
          },
          {
            "who": "西川",
            "role": "b",
            "text": "あ、{皆|みな}さん、{右|みぎ}を{見|み}てください。{富士山|ふじさん}が{見|み}えますよ。",
            "ro": "A, minasan, migi o mite kudasai. Fujisan ga miemasu yo.",
            "vi": "A, mọi người nhìn bên phải. Thấy núi Phú Sĩ đấy."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-ht3-hieu",
        "title": "Hội thoại 3 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Hướng dẫn viên nhắc ĐẦU TIÊN điều gì?",
            "options": [
              "Đừng ăn trên xe",
              "Đừng mở cửa sổ",
              "Đừng đứng lên trong xe",
              "Đừng nói to"
            ],
            "correct": 2,
            "why": "バスの 中で 立たないで ください."
          },
          {
            "q": "Vì sao không được đứng lên?",
            "options": [
              "Vì nguy hiểm",
              "Vì làm phiền người khác",
              "Vì xe sắp đến nơi",
              "Vì không nhìn thấy cảnh"
            ],
            "correct": 0,
            "why": "危ないですから."
          },
          {
            "q": "Wang xin phép làm gì? Vì sao?",
            "options": [
              "Mở cửa sổ — vì lạnh",
              "Kéo rèm — vì nắng",
              "Đổi chỗ — vì say xe",
              "Mở cửa sổ — vì nóng"
            ],
            "correct": 3,
            "why": "暑いですから、窓を 開けても いいですか."
          },
          {
            "q": "Hướng dẫn viên trả lời thế nào?",
            "options": [
              "Đồng ý: はい、どうぞ",
              "Từ chối mở cửa sổ, nhưng cho kéo rèm",
              "Cho mở cửa sổ một chút",
              "Bảo Wang đổi chỗ"
            ],
            "correct": 1,
            "why": "窓は ちょっと…… (từ chối) · カーテンは 閉めても いいですよ (N は — cái khác thì được)."
          },
          {
            "q": "Rác thì làm thế nào?",
            "options": [
              "Mang về nhà",
              "Vứt vào thùng rác trên xe",
              "Đưa cho hướng dẫn viên",
              "Vứt ở trạm nghỉ"
            ],
            "correct": 0,
            "why": "ごみは うちへ 持って 帰って ください."
          },
          {
            "q": "Ở bên phải nhìn thấy gì?",
            "options": [
              "Biển",
              "Núi Phú Sĩ",
              "Cây cầu lớn",
              "Sở thú"
            ],
            "correct": 1,
            "why": "富士山が 見えますよ."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-ht3-dien",
        "title": "Hội thoại 3 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "{西川|にしかわ}：バスの{中|なか}で{立|た}た＿＿ください。　〔Nishikawa: basu no naka de tata__ kudasai.〕",
            "answers": [
              "ないで"
            ],
            "hint": "Xin đừng — 立ちます"
          },
          {
            "q": "ワン：{窓|まど}を{開|あ}けても＿＿ですか。　〔Wan: mado o akete mo __ desu ka.〕",
            "answers": [
              "いい"
            ],
            "hint": "Xin phép"
          },
          {
            "q": "{西川|にしかわ}：ごみ＿＿うちへ{持|も}って{帰|かえ}ってください。　〔Nishikawa: gomi __ uchi e motte kaette kudasai.〕",
            "answers": [
              "は"
            ],
            "hint": "Đưa tân ngữ lên làm chủ đề"
          },
          {
            "q": "{西川|にしかわ}：{富士山|ふじさん}＿＿{見|み}えますよ。　〔Nishikawa: Fujisan __ miemasu yo.〕",
            "answers": [
              "が"
            ],
            "hint": "N が 見えます"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-ht3-sx",
        "title": "Hội thoại 3 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: nhắc đừng đứng lên → đừng thò tay → Wang xin mở cửa sổ → từ chối khéo.",
            "chips": [
              "すみません。{窓|まど}はちょっと……。カーテンは{閉|し}めてもいいですよ。",
              "すみません。{暑|あつ}いですから、{窓|まど}を{開|あ}けてもいいですか。",
              "それから、{窓|まど}から{手|て}を{出|だ}さないでください。",
              "{皆|みな}さん、バスの{中|なか}で{立|た}たないでください。{危|あぶ}ないですから。"
            ],
            "answer": [
              "{皆|みな}さん、バスの{中|なか}で{立|た}たないでください。{危|あぶ}ないですから。",
              "それから、{窓|まど}から{手|て}を{出|だ}さないでください。",
              "すみません。{暑|あつ}いですから、{窓|まど}を{開|あ}けてもいいですか。",
              "すみません。{窓|まど}はちょっと……。カーテンは{閉|し}めてもいいですよ。"
            ],
            "ro": "Minasan, basu no naka de tatanaide kudasai. Abunai desu kara. Sorekara, mado kara te o dasanaide kudasai. Sumimasen. Atsui desu kara, mado o akete mo ii desu ka. Sumimasen. Mado wa chotto.... Kaaten wa shimete mo ii desu yo."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Tình huống 4.** Đoàn dừng ở một bảo tàng mỹ thuật. Carlos hỏi nhân viên Yamaguchi ở quầy."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 4 — Ở bảo tàng — chụp ảnh được không?",
        "lines": [
          {
            "who": "カルロス",
            "role": "b",
            "text": "すみません。{中|なか}で{写真|しゃしん}を{撮|と}ってもいいですか。",
            "ro": "Sumimasen. Naka de shashin o totte mo ii desu ka.",
            "vi": "Xin lỗi. Bên trong tôi chụp ảnh được không ạ?"
          },
          {
            "who": "山口",
            "role": "a",
            "text": "すみません。{中|なか}では{写真|しゃしん}を{撮|と}らないでください。{写真|しゃしん}は{外|そと}で{撮|と}ってください。",
            "ro": "Sumimasen. Naka de wa shashin o toranaide kudasai. Shashin wa soto de totte kudasai.",
            "vi": "Xin lỗi. Bên trong xin đừng chụp ảnh. Ảnh thì hãy chụp ở bên ngoài."
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "わかりました。この{大|おお}きい{荷物|にもつ}を{持|も}って{入|はい}ってもいいですか。",
            "ro": "Wakarimashita. Kono ookii nimotsu o motte haitte mo ii desu ka.",
            "vi": "Tôi hiểu rồi. Tôi mang hành lý lớn này vào được không?"
          },
          {
            "who": "山口",
            "role": "a",
            "text": "いいえ、{大|おお}きい{荷物|にもつ}はあそこのロッカーに{入|い}れてください。",
            "ro": "Iie, ookii nimotsu wa asoko no rokkaa ni irete kudasai.",
            "vi": "Không ạ, hành lý lớn thì xin cho vào tủ khoá đằng kia."
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "はい。それから、{日本語|にほんご}のパンフレットをもらってもいいですか。",
            "ro": "Hai. Sorekara, Nihongo no panfuretto o moratte mo ii desu ka.",
            "vi": "Vâng. Thêm nữa, tôi lấy tờ giới thiệu tiếng Nhật được không?"
          },
          {
            "who": "山口",
            "role": "a",
            "text": "はい、どうぞ。{英語|えいご}のパンフレットもありますよ。",
            "ro": "Hai, douzo. Eigo no panfuretto mo arimasu yo.",
            "vi": "Vâng, xin mời. Có cả tờ giới thiệu tiếng Anh nữa đấy."
          },
          {
            "who": "カルロス",
            "role": "b",
            "text": "じゃ、{日本語|にほんご}のをください。{勉強|べんきょう}していますから。",
            "ro": "Ja, Nihongo no o kudasai. Benkyou shite imasu kara.",
            "vi": "Vậy cho tôi tờ tiếng Nhật. Vì tôi đang học mà."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-ht4-hieu",
        "title": "Hội thoại 4 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Carlos có được chụp ảnh bên trong không?",
            "options": [
              "Không nói",
              "Được nếu không dùng đèn flash",
              "Không được",
              "Được"
            ],
            "correct": 2,
            "why": "中では 写真を 撮らないで ください."
          },
          {
            "q": "Chụp ảnh ở đâu thì được?",
            "options": [
              "Ở tầng 2",
              "Ở bên ngoài",
              "Ở lối vào bên trong",
              "Ở quầy"
            ],
            "correct": 1,
            "why": "写真は 外で 撮って ください."
          },
          {
            "q": "Hành lý lớn thì làm thế nào?",
            "options": [
              "Mang vào trong",
              "Để ở quầy",
              "Để trên xe buýt",
              "Cho vào tủ khoá đằng kia"
            ],
            "correct": 3,
            "why": "大きい 荷物は あそこの ロッカーに 入れて ください."
          },
          {
            "q": "Carlos xin lấy cái gì?",
            "options": [
              "Bản đồ thành phố",
              "Tờ giới thiệu tiếng Nhật",
              "Tờ giới thiệu tiếng Anh",
              "Vé vào cửa"
            ],
            "correct": 1,
            "why": "日本語の パンフレットを もらっても いいですか."
          },
          {
            "q": "Vì sao Carlos chọn tờ tiếng Nhật?",
            "options": [
              "Vì tờ tiếng Nhật miễn phí",
              "Vì hết tờ tiếng Anh",
              "Vì nhân viên bảo thế",
              "Vì anh ấy đang học tiếng Nhật"
            ],
            "correct": 3,
            "why": "勉強して いますから."
          },
          {
            "q": "Trong hội thoại, nhân viên dùng \"N は ～てください\" mấy lần để chỉ cách khác?",
            "options": [
              "Không lần nào",
              "Một lần",
              "Ba lần",
              "Hai lần (ảnh, hành lý)"
            ],
            "correct": 3,
            "why": "写真は 外で… · 大きい 荷物は ロッカーに…."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-ht4-dien",
        "title": "Hội thoại 4 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "カルロス：{中|なか}で{写真|しゃしん}を{撮|と}ってもいいです＿＿。　〔Karurosu: naka de shashin o totte mo ii desu __.〕",
            "answers": [
              "か"
            ],
            "hint": "Câu hỏi xin phép"
          },
          {
            "q": "{山口|やまぐち}：{中|なか}では{写真|しゃしん}を{撮|と}ら＿＿ください。　〔Yamaguchi: naka de wa shashin o tora__ kudasai.〕",
            "answers": [
              "ないで"
            ],
            "hint": "撮ります → 撮らない"
          },
          {
            "q": "{山口|やまぐち}：{写真|しゃしん}＿＿{外|そと}で{撮|と}ってください。　〔Yamaguchi: shashin __ soto de totte kudasai.〕",
            "answers": [
              "は"
            ],
            "hint": "Chỉ cách khác"
          },
          {
            "q": "{山口|やまぐち}：はい、＿＿。{英語|えいご}のパンフレットもありますよ。　〔Yamaguchi: hai, __. Eigo no panfuretto mo arimasu yo.〕",
            "answers": [
              "どうぞ"
            ],
            "hint": "Đồng ý"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-ht4-sx",
        "title": "Hội thoại 4 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: xin chụp ảnh → không được, chụp ở vườn → xin mang hành lý vào → để tủ khoá.",
            "chips": [
              "わかりました。この{大|おお}きい{荷物|にもつ}を{持|も}って{入|はい}ってもいいですか。",
              "すみません。{中|なか}で{写真|しゃしん}を{撮|と}ってもいいですか。",
              "すみません。{中|なか}では{写真|しゃしん}を{撮|と}らないでください。{写真|しゃしん}は{外|そと}で{撮|と}ってください。",
              "いいえ、{大|おお}きい{荷物|にもつ}はあそこのロッカーに{入|い}れてください。"
            ],
            "answer": [
              "すみません。{中|なか}で{写真|しゃしん}を{撮|と}ってもいいですか。",
              "すみません。{中|なか}では{写真|しゃしん}を{撮|と}らないでください。{写真|しゃしん}は{外|そと}で{撮|と}ってください。",
              "わかりました。この{大|おお}きい{荷物|にもつ}を{持|も}って{入|はい}ってもいいですか。",
              "いいえ、{大|おお}きい{荷物|にもつ}はあそこのロッカーに{入|い}れてください。"
            ],
            "ro": "Sumimasen. Naka de shashin o totte mo ii desu ka. Sumimasen. Naka de wa shashin o toranaide kudasai. Shashin wa soto de totte kudasai. Wakarimashita. Kono ookii nimotsu o motte haitte mo ii desu ka. Iie, ookii nimotsu wa asoko no rokkaa ni irete kudasai."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · Hội thoại 5: ở sở thú — chỉ cho xem, hỏi dịch vụ, đề xuất theo tình hình"
      },
      {
        "t": "p",
        "text": "**Tình huống 5.** Chiều thứ Bảy, Mary và Natapon đi sở thú. Nhân viên là chị Kimura."
      },
      {
        "t": "dialogue",
        "title": "Hội thoại 5 — Ở sở thú — từ chuồng gấu trúc đến lúc về",
        "lines": [
          {
            "who": "メアリー",
            "role": "a",
            "text": "あっ、ナタポンさん、{見|み}て。パンダが{木|き}の{上|うえ}で{寝|ね}ていますよ。",
            "ro": "A, Natapon-san, mite. Panda ga ki no ue de nete imasu yo.",
            "vi": "A, Natapon, nhìn kìa. Gấu trúc đang ngủ trên cây đấy."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "{本当|ほんとう}だ。かわいいですね。あ、すみません。ここで{動物|どうぶつ}にえさをやることができますか。",
            "ro": "Hontouda. Kawaii desu ne. A, sumimasen. Koko de doubutsu ni esa o yaru koto ga dekimasu ka.",
            "vi": "Thật này. Dễ thương nhỉ. À, xin lỗi chị. Ở đây có thể cho thú ăn không ạ?"
          },
          {
            "who": "木村",
            "role": "a",
            "text": "パンダにはやらないでください。でも、ゾウには{三時|さんじ}からえさをやることができますよ。",
            "ro": "Panda ni wa yaranaide kudasai. Demo, zou ni wa sanji kara esa o yaru koto ga dekimasu yo.",
            "vi": "Gấu trúc thì xin đừng cho ăn. Nhưng voi thì từ 3 giờ có thể cho ăn đấy."
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "{今|いま}、{二時半|にじはん}ですね。それまで{観覧車|かんらんしゃ}に{乗|の}りませんか。{上|うえ}から{海|うみ}が{見|み}えますよ。",
            "ro": "Ima, nijihan desu ne. Soremade kanransha ni norimasen ka. Ue kara umi ga miemasu yo.",
            "vi": "Bây giờ là 2 rưỡi nhỉ. Trong lúc chờ, đi vòng đu quay không? Từ trên cao thấy biển đấy."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "いいですね。……あ、{寒|さむ}くなりましたね。のどもかわきました。",
            "ro": "Ii desu ne.... A, samuku narimashita ne. Nodo mo kawakimashita.",
            "vi": "Hay đấy. … À, trời lạnh rồi nhỉ. Mình cũng khát nữa."
          },
          {
            "who": "メアリー",
            "role": "a",
            "text": "じゃあ、{観覧車|かんらんしゃ}に{乗|の}って、{喫茶店|きっさてん}で{温|あたた}かいコーヒーを{飲|の}みましょう。",
            "ro": "Jaa, kanransha ni notte, kissaten de atatakai koohii o nomimashou.",
            "vi": "Vậy đi vòng đu quay xong mình vào quán uống cà phê nóng nhé."
          },
          {
            "who": "ナタポン",
            "role": "b",
            "text": "そうしましょう。それから、ゾウにえさをやって、{帰|かえ}りましょう。{五時|ごじ}ごろ{暗|くら}くなりますから。",
            "ro": "Sou shimashou. Sorekara, zou ni esa o yatte, kaerimashou. Goji goro kuraku narimasu kara.",
            "vi": "Ừ thế đi. Sau đó cho voi ăn rồi về nhé. Vì khoảng 5 giờ trời sẽ tối."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-ht5-hieu",
        "title": "Hội thoại 5 — câu hỏi hiểu (6 câu)",
        "items": [
          {
            "q": "Mary chỉ cho Natapon thấy gì?",
            "options": [
              "Gấu trúc đang ngủ trên cây",
              "Khỉ đang chơi",
              "Voi đang uống nước",
              "Gấu trúc đang ăn"
            ],
            "correct": 0,
            "why": "パンダが 木の 上で 寝て います."
          },
          {
            "q": "Có được cho gấu trúc ăn không?",
            "options": [
              "Không được",
              "Được từ 3 giờ",
              "Được, chỉ chuối",
              "Không nói"
            ],
            "correct": 0,
            "why": "パンダには やらないで ください."
          },
          {
            "q": "Con vật nào được cho ăn, từ mấy giờ?",
            "options": [
              "Voi, từ 3 giờ",
              "Voi, từ 2 giờ rưỡi",
              "Gấu trúc, từ 3 giờ",
              "Khỉ, từ 3 giờ"
            ],
            "correct": 0,
            "why": "ゾウには 三時から えさを やる ことが できます."
          },
          {
            "q": "Trong lúc chờ, Mary rủ làm gì? Vì sao?",
            "options": [
              "Về nhà — vì trời tối",
              "Đi vòng đu quay — từ trên cao thấy biển",
              "Vào quán cà phê — vì lạnh",
              "Xem chim cánh cụt — vì gần"
            ],
            "correct": 1,
            "why": "観覧車に 乗りませんか。上から 海が 見えますよ."
          },
          {
            "q": "Natapon nhận thấy điều gì thay đổi?",
            "options": [
              "Trời tối, và anh ấy đói",
              "Sở thú đông người hơn",
              "Trời trở lạnh, và anh ấy khát",
              "Trời nóng lên"
            ],
            "correct": 2,
            "why": "寒く なりましたね。のども かわきました."
          },
          {
            "q": "Thứ tự kế hoạch của hai người là gì?",
            "options": [
              "Cho voi ăn → vòng đu quay → quán cà phê",
              "Vòng đu quay → về → quán cà phê",
              "Quán cà phê → vòng đu quay → về",
              "Vòng đu quay → quán cà phê → cho voi ăn → về"
            ],
            "correct": 3,
            "why": "観覧車に 乗って、喫茶店で … · それから、ゾウに えさを やって、帰りましょう."
          }
        ]
      },
      {
        "t": "quiz",
        "id": "lt-b10-ht5-dien",
        "title": "Hội thoại 5 — điền chỗ trống (4 câu)",
        "kind": "fill",
        "items": [
          {
            "q": "メアリー：パンダ＿＿{木|き}の{上|うえ}で{寝|ね}ていますよ。　〔Mearii: panda __ ki no ue de nete imasu yo.〕",
            "answers": [
              "が"
            ],
            "hint": "Vừa thấy → が"
          },
          {
            "q": "ナタポン：ここでえさをやる＿＿ができますか。　〔Natapon: koko de esa o yaru __ ga dekimasu ka.〕",
            "answers": [
              "こと"
            ],
            "hint": "Vこと が できます"
          },
          {
            "q": "ナタポン：{寒|さむ}＿なりましたね。　〔Natapon: samu_ narimashita ne.〕",
            "answers": [
              "く"
            ],
            "hint": "い → く"
          },
          {
            "q": "メアリー：{上|うえ}から{海|うみ}＿＿{見|み}えますよ。　〔Mearii: ue kara umi __ miemasu yo.〕",
            "answers": [
              "が"
            ],
            "hint": "N が 見えます"
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-ht5-sx",
        "title": "Hội thoại 5 — sắp xếp lượt thoại",
        "items": [
          {
            "vi": "Sắp xếp 4 lượt thoại: chỉ gấu trúc → 本当だ + hỏi cho ăn → chỉ voi từ 3 giờ → rủ đi vòng đu quay.",
            "chips": [
              "パンダにはやらないでください。でも、ゾウには{三時|さんじ}からえさをやることができますよ。",
              "あっ、ナタポンさん、{見|み}て。パンダが{木|き}の{上|うえ}で{寝|ね}ていますよ。",
              "{本当|ほんとう}だ。かわいいですね。あ、すみません。ここで{動物|どうぶつ}にえさをやることができますか。",
              "{今|いま}、{二時半|にじはん}ですね。それまで{観覧車|かんらんしゃ}に{乗|の}りませんか。{上|うえ}から{海|うみ}が{見|み}えますよ。"
            ],
            "answer": [
              "あっ、ナタポンさん、{見|み}て。パンダが{木|き}の{上|うえ}で{寝|ね}ていますよ。",
              "{本当|ほんとう}だ。かわいいですね。あ、すみません。ここで{動物|どうぶつ}にえさをやることができますか。",
              "パンダにはやらないでください。でも、ゾウには{三時|さんじ}からえさをやることができますよ。",
              "{今|いま}、{二時半|にじはん}ですね。それまで{観覧車|かんらんしゃ}に{乗|の}りませんか。{上|うえ}から{海|うみ}が{見|み}えますよ。"
            ],
            "ro": "A, Natapon-san, mite. Panda ga ki no ue de nete imasu yo. Hontouda. Kawaii desu ne. A, sumimasen. Koko de doubutsu ni esa o yaru koto ga dekimasu ka. Panda ni wa yaranaide kudasai. Demo, zou ni wa sanji kara esa o yaru koto ga dekimasu yo. Ima, nijihan desu ne. Soremade kanransha ni norimasen ka. Ue kara umi ga miemasu yo."
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
          "Thay từ: 橋 → 信号／交差点／角; 左 → 右; お弁当 → 飲み物／お土産; 写真を撮る → たばこを吸う／ここに座る; 寒く → 暗く／暑く／12時に."
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 1 — Hỏi bạn đang ở đâu, thấy gì",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "もしもし、{今|いま}どこですか。そこから{何|なに}が{見|み}えますか。",
            "ro": "Moshimoshi, ima doko desu ka. Soko kara nani ga miemasu ka.",
            "vi": "Alô, bạn đang ở đâu? Từ đó thấy gì?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "ええと、{交差点|こうさてん}にいます。{右|みぎ}にコンビニが{見|み}えます。",
            "ro": "Eeto, kousaten ni imasu. Migi ni konbini ga miemasu.",
            "vi": "Ờ, mình đang ở ngã tư. Bên phải thấy cửa hàng tiện lợi."
          },
          {
            "who": "A",
            "role": "a",
            "text": "じゃあ、その{交差点|こうさてん}を{右|みぎ}に{曲|ま}がって、まっすぐ{来|き}てください。",
            "ro": "Jaa, sono kousaten o migi ni magatte, massugu kite kudasai.",
            "vi": "Vậy rẽ phải ở ngã tư đó rồi đi thẳng đến đây nhé."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 2 — Đã … chưa? · đi rồi về",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "もう{飲|の}み{物|もの}を{買|か}いましたか。",
            "ro": "Mou nomimono o kaimashita ka.",
            "vi": "Bạn mua đồ uống chưa?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "いいえ、まだ{買|か}っていません。ちょっと{買|か}ってきます。",
            "ro": "Iie, mada katte imasen. Chotto katte kimasu.",
            "vi": "Chưa, mình chưa mua. Mình đi mua một chút rồi về."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 3 — Xin phép · từ chối khéo · chỉ cách khác",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "すみません、ここでたばこを{吸|す}ってもいいですか。",
            "ro": "Sumimasen, koko de tabako o sutte mo ii desu ka.",
            "vi": "Xin lỗi, tôi hút thuốc ở đây được không?"
          },
          {
            "who": "B",
            "role": "b",
            "text": "すみません。ここはちょっと……。たばこは{喫煙所|きつえんじょ}で{吸|す}ってください。",
            "ro": "Sumimasen. Koko wa chotto.... Tabako wa kitsuenjo de sutte kudasai.",
            "vi": "Xin lỗi. Ở đây thì hơi… Thuốc lá xin hút ở khu hút thuốc."
          }
        ]
      },
      {
        "t": "dialogue",
        "title": "Mẫu tự nói 4 — Ở sở thú: chỉ cho xem · đề xuất",
        "lines": [
          {
            "who": "A",
            "role": "a",
            "text": "あっ、サルがバナナを{食|た}べていますよ。",
            "ro": "A, saru ga banana o tabete imasu yo.",
            "vi": "A, con khỉ đang ăn chuối kìa."
          },
          {
            "who": "B",
            "role": "b",
            "text": "{本当|ほんとう}だ。……{暗|くら}くなりましたね。そろそろ{帰|かえ}りませんか。",
            "ro": "Hontouda.... Kuraku narimashita ne. Sorosoro kaerimasen ka.",
            "vi": "Thật này. … Trời tối rồi nhỉ. Sắp về chưa?"
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b10-ht-noi",
        "part": "1",
        "questions": [
          "もう ひるごはんを たべましたか。",
          "いま、どこですか。そこから なにが みえますか。",
          "ここで しゃしんを とっても いいですか。",
          "バスの なかで なにを しないで ください か。",
          "どうぶつえんで なにが できますか。",
          "さむく なりましたね。なにを しましょうか。",
          "えきから がっこうまで どうやって いきますか。みちを おしえて ください。",
          "のどが かわきました。どう しますか。"
        ]
      }
    ]
  },
  {
    "id": "lt-b10-doc-hieu",
    "kind": "reading",
    "title": "Luyện thêm Bài 10 · Đọc hiểu — 4 đoạn dài dần + 4 đoạn KHÔNG furigana (~43 câu)",
    "goal": "Đọc hiểu tin nhắn chỉ đường, thông báo tour xe buýt, tờ giới thiệu sở thú và nhật ký chuyến đi: tìm đúng đường đi, giờ tập hợp, điều bị cấm / được phép, chỗ làm được gì; đọc được đoạn không furigana như đề thi.",
    "minutes": 70,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Đọc **2 lượt**: lượt 1 tìm **ai – ở đâu – làm gì**; lượt 2 gạch dưới **đường đi** (～を渡って · ～を右に曲がって · ～つ目), **giờ** (集合時間), **cấm gì** (～ないでください) và **được làm gì** (～ことができます · ～てもいいです).",
          "Bẫy hay gặp: **N は ～てください** (đổi chỗ: \"cái này thì ở chỗ khác\") · **まだ～ていません** (chưa) ≠ もう～ました (rồi) · **見えます** (thấy) ≠ 見ます (xem) · **でも** đổi ý.",
          "Mức Khó dùng **readkanji** không furigana: chỉ chữ Hán đã học đến Bài 10. Đọc to, rồi bấm xem."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · đoạn 1 — tin nhắn chỉ đường"
      },
      {
        "t": "passage",
        "title": "Đoạn 1 — Tin nhắn của Anna",
        "intro": "Có furigana. Tìm: điểm tập hợp ở đâu · mấy giờ · đi đường nào · đến nơi thấy gì.",
        "paras": [
          {
            "label": "A",
            "text": "マリヤムさん、{明日|あした}のバスツアーの{集合|しゅうごう}{場所|ばしょ}はKSビルの{前|まえ}です。{集合|しゅうごう}{時間|じかん}は{八時半|はちじはん}です。{駅|えき}を{出|で}て、まっすぐ{歩|ある}いてください。{二|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がって、{橋|はし}を{渡|わた}ります。{橋|はし}の{近|ちか}くに{大|おお}きいビルが{見|み}えます。それがKSビルです。{遅|おく}れないでくださいね。アンナ"
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
            "en": "マリヤムさん、{明日|あした}のバスツアーの{集合|しゅうごう}{場所|ばしょ}はKSビルの{前|まえ}です。",
            "ro": "Mariyamu-san, ashita no basutsuaa no shuugou basho wa KS biru no mae desu.",
            "vi": "Mariyam ơi, điểm tập hợp của tour xe buýt ngày mai là trước toà nhà KS."
          },
          {
            "en": "{集合|しゅうごう}{時間|じかん}は{八時半|はちじはん}です。",
            "ro": "Shuugou jikan wa hachijihan desu.",
            "vi": "Giờ tập hợp là 8 giờ rưỡi."
          },
          {
            "en": "{駅|えき}を{出|で}て、まっすぐ{歩|ある}いてください。",
            "ro": "Eki o dete, massugu aruite kudasai.",
            "vi": "Ra khỏi ga rồi đi bộ thẳng."
          },
          {
            "en": "{二|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がって、{橋|はし}を{渡|わた}ります。",
            "ro": "Futatsume no shingou o migi ni magatte, hashi o watarimasu.",
            "vi": "Rẽ phải ở đèn giao thông thứ hai rồi qua cầu."
          },
          {
            "en": "{橋|はし}の{近|ちか}くに{大|おお}きいビルが{見|み}えます。",
            "ro": "Hashi no chikaku ni ookii biru ga miemasu.",
            "vi": "Gần cây cầu sẽ thấy một toà nhà lớn."
          },
          {
            "en": "それがKSビルです。{遅|おく}れないでくださいね。アンナ",
            "ro": "Sore ga KS biru desu. Okurenaide kudasai ne. Anna",
            "vi": "Đó là toà nhà KS. Đừng đến trễ nhé. Anna"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-doc1-q",
        "title": "Đoạn 1 — câu hỏi (6 câu)",
        "items": [
          {
            "q": "Tin nhắn này Anna gửi cho ai?",
            "options": [
              "Mariyam",
              "Cả lớp",
              "Lin",
              "Marco"
            ],
            "correct": 0,
            "why": "マリヤムさん、…."
          },
          {
            "q": "Điểm tập hợp ở đâu?",
            "options": [
              "Trên cầu",
              "Ở đèn giao thông thứ hai",
              "Trước toà nhà KS",
              "Trước ga"
            ],
            "correct": 2,
            "why": "集合場所は KSビルの 前です."
          },
          {
            "q": "Giờ tập hợp là mấy giờ?",
            "options": [
              "9 giờ 30",
              "9 giờ",
              "8 giờ",
              "8 giờ 30"
            ],
            "correct": 3,
            "why": "集合時間は 八時半です."
          },
          {
            "q": "Ra khỏi ga thì làm gì đầu tiên?",
            "options": [
              "Lên xe buýt",
              "Đi bộ thẳng",
              "Qua cầu",
              "Rẽ phải"
            ],
            "correct": 1,
            "why": "駅を 出て、まっすぐ 歩いて ください."
          },
          {
            "q": "Rẽ ở đâu, hướng nào?",
            "options": [
              "Đèn giao thông thứ hai, rẽ trái",
              "Đèn giao thông thứ hai, rẽ phải",
              "Góc phố thứ hai, rẽ phải",
              "Đèn giao thông thứ nhất, rẽ phải"
            ],
            "correct": 1,
            "why": "二つ目の 信号を 右に 曲がって."
          },
          {
            "q": "Làm sao biết đã đến toà nhà KS?",
            "options": [
              "Gần cầu thấy một toà nhà lớn",
              "Có biển ghi KS ở cửa ga",
              "Thấy xe buýt màu trắng",
              "Anna đứng chờ ở cầu"
            ],
            "correct": 0,
            "why": "橋の 近くに 大きい ビルが 見えます。それが KSビルです."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · đoạn 2–3 — thông báo tour · tờ giới thiệu sở thú"
      },
      {
        "t": "passage",
        "title": "Đoạn 2 — Thông báo: Tour xe buýt ngày mai",
        "intro": "Kiểu tờ thông báo của hướng dẫn viên: tìm giờ – nơi tập hợp · ăn ở đâu · cấm gì · được làm gì · thuốc · số điện thoại.",
        "paras": [
          {
            "label": "A",
            "text": "【{明日|あした}のバスツアー】{皆|みな}さん、{明日|あした}は{八時|はちじ}に{大学|だいがく}の{門|もん}の{前|まえ}に{集合|しゅうごう}してください。バスは{八時十五分|はちじじゅうごふん}に{出|で}ます。{遅|おく}れないでください。"
          },
          {
            "label": "B",
            "text": "お{昼|ひる}ご{飯|はん}は{動物園|どうぶつえん}のレストランで{食|た}べることができます。お{弁当|べんとう}を{持|も}って{来|き}てもいいです。でも、バスの{中|なか}では{食|た}べないでください。{飲|の}み{物|もの}は{飲|の}んでもいいです。"
          },
          {
            "label": "C",
            "text": "ごみは{持|も}って{帰|かえ}ってください。{動物園|どうぶつえん}までバスで{二時間|にじかん}ですから、{薬|くすり}はうちで{飲|の}んで{来|き}てください。{西川|にしかわ}の{電話番号|でんわばんごう}は090-1234-5678です。"
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
            "en": "【{明日|あした}のバスツアー】",
            "ro": "【 ashita no basutsuaa 】",
            "vi": "[Tour xe buýt ngày mai]"
          },
          {
            "en": "{皆|みな}さん、{明日|あした}は{八時|はちじ}に{大学|だいがく}の{門|もん}の{前|まえ}に{集合|しゅうごう}してください。",
            "ro": "Minasan, ashita wa hachiji ni daigaku no mon no mae ni shuugou shite kudasai.",
            "vi": "Mọi người, ngày mai hãy tập hợp trước cổng trường lúc 8 giờ."
          },
          {
            "en": "バスは{八時十五分|はちじじゅうごふん}に{出|で}ます。{遅|おく}れないでください。",
            "ro": "Basu wa hachijijuugofun ni demasu. Okurenaide kudasai.",
            "vi": "Xe buýt chạy lúc 8 giờ 15. Xin đừng đến trễ."
          },
          {
            "en": "お{昼|ひる}ご{飯|はん}は{動物園|どうぶつえん}のレストランで{食|た}べることができます。",
            "ro": "Ohirugohan wa doubutsuen no resutoran de taberu koto ga dekimasu.",
            "vi": "Bữa trưa có thể ăn ở nhà hàng của sở thú."
          },
          {
            "en": "お{弁当|べんとう}を{持|も}って{来|き}てもいいです。",
            "ro": "Obentou o motte kite mo ii desu.",
            "vi": "Mang cơm hộp theo cũng được."
          },
          {
            "en": "でも、バスの{中|なか}では{食|た}べないでください。{飲|の}み{物|もの}は{飲|の}んでもいいです。",
            "ro": "Demo, basu no naka de wa tabenaide kudasai. Nomimono wa nonde mo ii desu.",
            "vi": "Nhưng trong xe buýt thì xin đừng ăn. Đồ uống thì uống được."
          },
          {
            "en": "ごみは{持|も}って{帰|かえ}ってください。",
            "ro": "Gomi wa motte kaette kudasai.",
            "vi": "Rác thì xin mang về."
          },
          {
            "en": "{動物園|どうぶつえん}までバスで{二時間|にじかん}ですから、{薬|くすり}はうちで{飲|の}んで{来|き}てください。",
            "ro": "Doubutsuen made basu de nijikan desu kara, kusuri wa uchi de nonde kite kudasai.",
            "vi": "Đến sở thú đi xe buýt mất hai tiếng, nên thuốc thì hãy uống ở nhà rồi đến."
          },
          {
            "en": "{西川|にしかわ}の{電話番号|でんわばんごう}は090-1234-5678です。",
            "ro": "Nishikawa no denwabangou wa 090-1234-5678 desu.",
            "vi": "Số điện thoại của Nishikawa là 090-1234-5678."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-doc2-q",
        "title": "Đoạn 2 — câu hỏi (7 câu)",
        "items": [
          {
            "q": "Tập hợp ở đâu, mấy giờ?",
            "options": [
              "Ở ga, 8 giờ",
              "Trước cổng trường, 8 giờ",
              "Ở sở thú, 8 giờ",
              "Trước cổng trường, 8 giờ 15"
            ],
            "correct": 1,
            "why": "八時に 大学の 門の 前に 集合."
          },
          {
            "q": "Xe buýt chạy lúc mấy giờ?",
            "options": [
              "8 giờ 15",
              "8 giờ",
              "9 giờ",
              "8 giờ 30"
            ],
            "correct": 0,
            "why": "バスは 八時十五分に 出ます."
          },
          {
            "q": "Bữa trưa ăn ở đâu được?",
            "options": [
              "Nhà hàng của sở thú (hoặc mang cơm hộp)",
              "Chỉ trên xe buýt",
              "Chỉ ở nhà hàng gần trường",
              "Không nói"
            ],
            "correct": 0,
            "why": "動物園の レストランで 食べる ことが できます · お弁当を 持って来ても いいです."
          },
          {
            "q": "Trên xe buýt KHÔNG được làm gì?",
            "options": [
              "Ăn",
              "Uống thuốc",
              "Uống nước",
              "Ngồi"
            ],
            "correct": 0,
            "why": "バスの 中では 食べないで ください."
          },
          {
            "q": "Trên xe buýt được làm gì?",
            "options": [
              "Đứng lên đi lại",
              "Ăn cơm hộp",
              "Uống đồ uống",
              "Vứt rác"
            ],
            "correct": 2,
            "why": "飲み物は 飲んでも いいです."
          },
          {
            "q": "Thuốc thì dặn thế nào?",
            "options": [
              "Uống trên xe buýt",
              "Uống ở nhà rồi mới đến",
              "Mang thuốc đưa hướng dẫn viên",
              "Không cần uống"
            ],
            "correct": 1,
            "why": "薬は うちで 飲んで 来て ください (Vて きます — làm rồi mới đến)."
          },
          {
            "q": "Số điện thoại 090-1234-5678 là của ai?",
            "options": [
              "Sở thú",
              "Trường đại học",
              "Nishikawa (hướng dẫn viên)",
              "Nhà hàng"
            ],
            "correct": 2,
            "why": "西川の 電話番号は 090-1234-5678 です."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đoạn 3 — Tờ giới thiệu: Sở thú Sakura",
        "intro": "Kiểu パンフレット: ở mỗi chỗ làm được gì (～ことができます) và cấm gì (～ないでください).",
        "paras": [
          {
            "label": "A",
            "text": "【さくら{動物園|どうぶつえん}】{入|い}り{口|ぐち}で{地図|ちず}をもらうことができます。{午前|ごぜん}{九時|くじ}から{午後|ごご}{五時|ごじ}までです。{月曜日|げつようび}は{休|やす}みです。"
          },
          {
            "label": "B",
            "text": "ゾウの{家|いえ}：{毎日|まいにち}{二時|にじ}からゾウにえさをやることができます。{一回|いっかい}{二百円|にひゃくえん}です。パンダの{家|いえ}：{写真|しゃしん}を{撮|と}ってもいいです。でも、{大|おお}きい{声|こえ}で{話|はな}さないでください。パンダはよく{寝|ね}ていますから。"
          },
          {
            "label": "C",
            "text": "サルの{山|やま}：サルに{食|た}べ{物|もの}をやらないでください。{観覧車|かんらんしゃ}：{出口|でぐち}の{近|ちか}くにあります。{上|うえ}から{海|うみ}が{見|み}えます。{食事|しょくじ}は{入|い}り{口|ぐち}の{隣|となり}のレストランでできます。"
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
            "en": "【さくら{動物園|どうぶつえん}】",
            "ro": "【 sakura doubutsuen 】",
            "vi": "[Sở thú Sakura]"
          },
          {
            "en": "{入|い}り{口|ぐち}で{地図|ちず}をもらうことができます。",
            "ro": "Iriguchi de chizu o morau koto ga dekimasu.",
            "vi": "Có thể nhận bản đồ ở lối vào."
          },
          {
            "en": "{午前|ごぜん}{九時|くじ}から{午後|ごご}{五時|ごじ}までです。{月曜日|げつようび}は{休|やす}みです。",
            "ro": "Gozen kuji kara gogo goji made desu. Getsuyoubi wa yasumi desu.",
            "vi": "Mở từ 9 giờ sáng đến 5 giờ chiều. Thứ Hai nghỉ."
          },
          {
            "en": "ゾウの{家|いえ}：{毎日|まいにち}{二時|にじ}からゾウにえさをやることができます。{一回|いっかい}{二百円|にひゃくえん}です。",
            "ro": "Zou no ie: mainichi niji kara zou ni esa o yaru koto ga dekimasu. Ikkai nihyakuen desu.",
            "vi": "Nhà voi: hằng ngày từ 2 giờ có thể cho voi ăn. Mỗi lần 200 yên."
          },
          {
            "en": "パンダの{家|いえ}：{写真|しゃしん}を{撮|と}ってもいいです。",
            "ro": "Panda no ie: shashin o totte mo ii desu.",
            "vi": "Nhà gấu trúc: được chụp ảnh."
          },
          {
            "en": "でも、{大|おお}きい{声|こえ}で{話|はな}さないでください。パンダはよく{寝|ね}ていますから。",
            "ro": "Demo, ookii koe de hanasanaide kudasai. Panda wa yoku nete imasu kara.",
            "vi": "Nhưng xin đừng nói to. Vì gấu trúc hay ngủ."
          },
          {
            "en": "サルの{山|やま}：サルに{食|た}べ{物|もの}をやらないでください。",
            "ro": "Saru no yama: saru ni tabemono o yaranaide kudasai.",
            "vi": "Núi khỉ: xin đừng cho khỉ đồ ăn."
          },
          {
            "en": "{観覧車|かんらんしゃ}：{出口|でぐち}の{近|ちか}くにあります。{上|うえ}から{海|うみ}が{見|み}えます。",
            "ro": "Kanransha: deguchi no chikaku ni arimasu. Ue kara umi ga miemasu.",
            "vi": "Vòng đu quay: ở gần lối ra. Từ trên cao nhìn thấy biển."
          },
          {
            "en": "{食事|しょくじ}は{入|い}り{口|ぐち}の{隣|となり}のレストランでできます。",
            "ro": "Shokuji wa iriguchi no tonari no resutoran de dekimasu.",
            "vi": "Ăn uống thì có thể ở nhà hàng cạnh lối vào."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-doc3-q",
        "title": "Đoạn 3 — câu hỏi (9 câu)",
        "items": [
          {
            "q": "Lấy bản đồ ở đâu?",
            "options": [
              "Ở nhà hàng",
              "Ở vòng đu quay",
              "Ở lối ra",
              "Ở lối vào"
            ],
            "correct": 3,
            "why": "入り口で 地図を もらう ことが できます."
          },
          {
            "q": "Sở thú nghỉ ngày nào?",
            "options": [
              "Không nghỉ ngày nào",
              "Thứ Hai",
              "Chủ nhật",
              "Thứ Bảy"
            ],
            "correct": 1,
            "why": "月曜日は 休みです."
          },
          {
            "q": "Cho voi ăn: khi nào, giá bao nhiêu?",
            "options": [
              "Hằng ngày từ 2 giờ, miễn phí",
              "Hằng ngày từ 2 giờ, 200 yên/lần",
              "Chỉ thứ Hai, 200 yên",
              "Từ 9 giờ, 200 yên"
            ],
            "correct": 1,
            "why": "毎日 二時から … 一回 二百円."
          },
          {
            "q": "Ở nhà gấu trúc được làm gì?",
            "options": [
              "Vào trong chuồng",
              "Chụp ảnh",
              "Cho ăn",
              "Nói to"
            ],
            "correct": 1,
            "why": "写真を 撮っても いいです."
          },
          {
            "q": "Vì sao không được nói to ở nhà gấu trúc?",
            "options": [
              "Vì là thư viện",
              "Vì gấu trúc hay ngủ",
              "Vì có em bé",
              "Vì gấu trúc sợ người"
            ],
            "correct": 1,
            "why": "パンダは よく 寝ています から."
          },
          {
            "q": "Ở núi khỉ thì cấm gì?",
            "options": [
              "Cho khỉ đồ ăn",
              "Đi bộ",
              "Đứng xem",
              "Chụp ảnh"
            ],
            "correct": 0,
            "why": "サルに 食べ物を やらないで ください."
          },
          {
            "q": "Vòng đu quay ở đâu, có gì hay?",
            "options": [
              "Gần nhà voi, thấy biển",
              "Gần lối ra, từ trên cao thấy biển",
              "Cạnh nhà hàng, thấy cả sở thú",
              "Gần lối vào, thấy núi"
            ],
            "correct": 1,
            "why": "出口の 近く · 上から 海が 見えます."
          },
          {
            "q": "Nhà hàng ở đâu?",
            "options": [
              "Cạnh lối vào",
              "Gần núi khỉ",
              "Trên vòng đu quay",
              "Cạnh lối ra"
            ],
            "correct": 0,
            "why": "入り口の 隣の レストラン."
          },
          {
            "q": "Câu nào SAI theo tờ giới thiệu?",
            "options": [
              "Có thể cho voi ăn từ 2 giờ",
              "Ở nhà gấu trúc được chụp ảnh",
              "Thứ Hai sở thú nghỉ",
              "Có thể cho gấu trúc ăn"
            ],
            "correct": 3,
            "why": "Chỉ voi được cho ăn; gấu trúc chỉ được chụp ảnh."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · đoạn 4 dài + đoạn không furigana"
      },
      {
        "t": "passage",
        "title": "Đoạn 4 — Nhật ký tour xe buýt của Natapon",
        "intro": "Đoạn dài: tách 3 khối (buổi sáng – lạc đường · trên xe – lời nhắc · sở thú – buổi chiều). Chú ý ～が見えます, ～てきます, なりました.",
        "paras": [
          {
            "label": "A",
            "text": "{土曜日|どようび}、クラスのバスツアーに{行|い}きました。{集合|しゅうごう}{時間|じかん}は{八時|はちじ}でしたが、{私|わたし}は{道|みち}がわかりませんでした。{七時五十五分|しちじごじゅうごふん}にアンナさんから{電話|でんわ}がありました。「そこから{何|なに}が{見|み}えますか。」「{郵便局|ゆうびんきょく}が{見|み}えます。」「じゃあ、{郵便局|ゆうびんきょく}の{角|かど}を{左|ひだり}に{曲|ま}がってください。」{八時|はちじ}ちょうどにバスの{前|まえ}に{行|い}くことができました。"
          },
          {
            "label": "B",
            "text": "バスの{中|なか}で、{西川|にしかわ}さんが{皆|みな}さんに{注意|ちゅうい}しました。「{窓|まど}から{手|て}を{出|だ}さないでください。{立|た}たないでください。」{十時|じゅうじ}にバスを{降|お}りて、{少|すこ}し{休|やす}みました。{私|わたし}は{朝|あさ}ご{飯|はん}を{食|た}べませんでしたから、コンビニでパンを{買|か}ってきました。"
          },
          {
            "label": "C",
            "text": "{動物園|どうぶつえん}では、サルがボールで{遊|あそ}んでいました。とてもおもしろかったです。{三時|さんじ}ごろ{寒|さむ}くなりましたから、みんなで{喫茶店|きっさてん}に{入|はい}って、コーヒーを{飲|の}みました。{帰|かえ}りのバスでは、{疲|つか}れましたから、すぐ{寝|ね}ました。"
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
            "en": "{土曜日|どようび}、クラスのバスツアーに{行|い}きました。",
            "ro": "Doyoubi, kurasu no basutsuaa ni ikimashita.",
            "vi": "Thứ Bảy tôi đi tour xe buýt của lớp."
          },
          {
            "en": "{集合|しゅうごう}{時間|じかん}は{八時|はちじ}でしたが、{私|わたし}は{道|みち}がわかりませんでした。",
            "ro": "Shuugou jikan wa hachiji deshita ga, watashi wa michi ga wakarimasen deshita.",
            "vi": "Giờ tập hợp là 8 giờ nhưng tôi không biết đường."
          },
          {
            "en": "{七時五十五分|しちじごじゅうごふん}にアンナさんから{電話|でんわ}がありました。",
            "ro": "Shichijigojuugofun ni Anna-san kara denwa ga arimashita.",
            "vi": "Lúc 7 giờ 55 có điện thoại của Anna."
          },
          {
            "en": "「そこから{何|なに}が{見|み}えますか。」「{郵便局|ゆうびんきょく}が{見|み}えます。」",
            "ro": "\"Soko kara nani ga miemasu ka.\" \"yuubinkyoku ga miemasu.\"",
            "vi": "\"Từ đó thấy gì?\" \"Thấy bưu điện.\""
          },
          {
            "en": "「じゃあ、{郵便局|ゆうびんきょく}の{角|かど}を{左|ひだり}に{曲|ま}がってください。」",
            "ro": "\"Jaa, yuubinkyoku no kado o hidari ni magatte kudasai.\"",
            "vi": "\"Vậy rẽ trái ở góc bưu điện nhé.\""
          },
          {
            "en": "{八時|はちじ}ちょうどにバスの{前|まえ}に{行|い}くことができました。",
            "ro": "Hachiji choudo ni basu no mae ni iku koto ga dekimashita.",
            "vi": "Đúng 8 giờ tôi đã đến được trước xe buýt."
          },
          {
            "en": "バスの{中|なか}で、{西川|にしかわ}さんが{皆|みな}さんに{注意|ちゅうい}しました。",
            "ro": "Basu no naka de, Nishikawa-san ga minasan ni chuui shimashita.",
            "vi": "Trên xe, anh Nishikawa nhắc nhở mọi người."
          },
          {
            "en": "「{窓|まど}から{手|て}を{出|だ}さないでください。{立|た}たないでください。」",
            "ro": "\"Mado kara te o dasanaide kudasai. Tatanaide kudasai.\"",
            "vi": "\"Đừng thò tay ra cửa sổ. Đừng đứng lên.\""
          },
          {
            "en": "{十時|じゅうじ}にバスを{降|お}りて、{少|すこ}し{休|やす}みました。",
            "ro": "Juuji ni basu o orite, sukoshi yasumimashita.",
            "vi": "10 giờ cả đoàn xuống xe nghỉ một chút."
          },
          {
            "en": "{私|わたし}は{朝|あさ}ご{飯|はん}を{食|た}べませんでしたから、コンビニでパンを{買|か}ってきました。",
            "ro": "Watashi wa asagohan o tabemasen deshita kara, konbini de pan o katte kimashita.",
            "vi": "Tôi chưa ăn sáng nên đã đi mua bánh mì ở cửa hàng tiện lợi rồi quay lại."
          },
          {
            "en": "{動物園|どうぶつえん}では、サルがボールで{遊|あそ}んでいました。とてもおもしろかったです。",
            "ro": "Doubutsuen de wa, saru ga booru de asonde imashita. Totemo omoshirokatta desu.",
            "vi": "Ở sở thú, con khỉ đang chơi với quả bóng. Rất thú vị."
          },
          {
            "en": "{三時|さんじ}ごろ{寒|さむ}くなりましたから、みんなで{喫茶店|きっさてん}に{入|はい}って、コーヒーを{飲|の}みました。",
            "ro": "Sanji goro samuku narimashita kara, minna de kissaten ni haitte, koohii o nomimashita.",
            "vi": "Khoảng 3 giờ trời trở lạnh nên cả nhóm vào quán uống cà phê."
          },
          {
            "en": "{帰|かえ}りのバスでは、{疲|つか}れましたから、すぐ{寝|ね}ました。",
            "ro": "Kaeri no basu de wa, tsukaremashita kara, sugu nemashita.",
            "vi": "Trên xe về, vì mệt nên tôi ngủ ngay."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-doc4-q",
        "title": "Đoạn 4 — câu hỏi (9 câu)",
        "items": [
          {
            "q": "Vì sao Natapon suýt đến muộn?",
            "options": [
              "Vì không biết đường",
              "Vì dậy muộn",
              "Vì quên vé",
              "Vì đi nhầm xe"
            ],
            "correct": 0,
            "why": "道が わかりませんでした."
          },
          {
            "q": "Ai gọi điện cho Natapon, lúc mấy giờ?",
            "options": [
              "Anna, 8 giờ",
              "Nishikawa, 8 giờ",
              "Anna, 7 giờ 55",
              "Marco, 7 giờ 55"
            ],
            "correct": 2,
            "why": "七時五十五分に アンナさんから 電話が ありました."
          },
          {
            "q": "Lúc đó Natapon nhìn thấy gì?",
            "options": [
              "Cây cầu",
              "Bưu điện",
              "Ngân hàng",
              "Toà nhà KS"
            ],
            "correct": 1,
            "why": "郵便局が 見えます."
          },
          {
            "q": "Anna chỉ đường thế nào?",
            "options": [
              "Qua cầu cạnh bưu điện",
              "Rẽ phải ở góc bưu điện",
              "Đi thẳng qua bưu điện",
              "Rẽ trái ở góc bưu điện"
            ],
            "correct": 3,
            "why": "郵便局の 角を 左に 曲がって."
          },
          {
            "q": "Natapon có đến muộn không?",
            "options": [
              "Không đến được",
              "Có — muộn 5 phút",
              "Có — xe phải chờ",
              "Không — đến đúng 8 giờ"
            ],
            "correct": 3,
            "why": "八時 ちょうどに バスの 前に 行く ことが できました."
          },
          {
            "q": "Trên xe, Nishikawa nhắc những gì?",
            "options": [
              "Đừng mở cửa sổ, đừng nói to",
              "Đừng vứt rác",
              "Đừng thò tay ra cửa sổ, đừng đứng lên",
              "Đừng ăn, đừng ngủ"
            ],
            "correct": 2,
            "why": "窓から 手を 出さないで · 立たないで."
          },
          {
            "q": "Lúc nghỉ giữa đường Natapon làm gì? Vì sao?",
            "options": [
              "Uống thuốc — vì đau bụng",
              "Gọi điện — vì quên đồ",
              "Đi mua bánh mì rồi quay lại — vì chưa ăn sáng",
              "Đi vệ sinh — vì say xe"
            ],
            "correct": 2,
            "why": "朝ご飯を 食べません でしたから、パンを 買って きました (Vて きます)."
          },
          {
            "q": "Ở sở thú Natapon thấy gì thú vị?",
            "options": [
              "Chim cánh cụt bơi",
              "Con khỉ chơi với quả bóng",
              "Voi ăn chuối",
              "Gấu trúc ngủ"
            ],
            "correct": 1,
            "why": "サルが ボールで 遊んで いました."
          },
          {
            "q": "Vì sao cả nhóm vào quán cà phê?",
            "options": [
              "Vì sở thú đóng cửa",
              "Vì khoảng 3 giờ trời trở lạnh",
              "Vì đói",
              "Vì trời mưa"
            ],
            "correct": 1,
            "why": "三時ごろ 寒く なりましたから."
          }
        ]
      },
      {
        "t": "readkanji",
        "id": "lt-b10-doc-rk",
        "title": "Đọc to 4 đoạn KHÔNG furigana, rồi bấm xem (4 đoạn)",
        "note": "Đọc cả câu to, kể cả hiragana. Sau đó làm 8 câu hỏi bên dưới.",
        "items": [
          {
            "text": "えきをでて、{道|みち}をまっすぐ{歩|ある}いてください。{二|ふた}つ{目|め}のかどを{右|みぎ}に{曲|ま}がって、{橋|はし}をわたります。{橋|はし}の{近|ちか}くで{待|ま}っています。",
            "ro": "Eki o dete, michi o massugu aruite kudasai. Futatsume no kado o migi ni magatte, hashi o watarimasu. Hashi no chikaku de matte imasu.",
            "vi": "Ra khỏi ga, hãy đi bộ thẳng đường. Rẽ phải ở góc phố thứ hai rồi qua cầu. Tôi đang chờ gần cây cầu."
          },
          {
            "text": "バスのなかで{立|た}たないでください。{危|あぶ}ないです。{大|おお}きいにもつはうしろにおいてください。ごみは{持|も}って{帰|かえ}ってください。",
            "ro": "Basu no naka de tatanaide kudasai. Abunai desu. Ookii nimotsu wa ushiro ni oite kudasai. Gomi wa motte kaette kudasai.",
            "vi": "Trong xe buýt xin đừng đứng lên. Nguy hiểm. Hành lý lớn hãy để ở phía sau. Rác thì xin mang về."
          },
          {
            "text": "{日曜日|にちようび}、{父|ちち}と{母|はは}とどうぶつえんへ{行|い}きました。サルがバナナを{食|た}べていました。たくさん{歩|ある}きましたから、{足|あし}がいたくなりました。",
            "ro": "Nichiyoubi, chichi to haha to doubutsuen e ikimashita. Saru ga banana o tabete imashita. Takusan arukimashita kara, ashi ga itaku narimashita.",
            "vi": "Chủ nhật tôi đi sở thú với bố mẹ. Con khỉ đang ăn chuối. Đi bộ nhiều nên chân bắt đầu đau."
          },
          {
            "text": "{先生|せんせい}、ここに{座|すわ}ってもいいですか。——はい、どうぞ。でも、{四時|よじ}になりましたから、そろそろ{帰|かえ}りましょう。",
            "ro": "Sensei, koko ni suwatte mo ii desu ka. — Hai, douzo. Demo, yoji ni narimashita kara, sorosoro kaerimashou.",
            "vi": "Thưa thầy, em ngồi đây được không ạ? — Ừ, mời em. Nhưng 4 giờ rồi, sắp về thôi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-doc-rk-q",
        "title": "Câu hỏi về 4 đoạn không furigana (8 câu)",
        "items": [
          {
            "q": "(Đoạn 1) Ra khỏi ga thì làm gì?",
            "options": [
              "Lên xe buýt",
              "Đi bộ thẳng đường",
              "Qua cầu ngay",
              "Rẽ phải ngay"
            ],
            "correct": 1,
            "why": "道を まっすぐ 歩いて ください."
          },
          {
            "q": "(Đoạn 1) Người viết đang chờ ở đâu?",
            "options": [
              "Ở góc phố thứ hai",
              "Bên phải đường",
              "Gần cây cầu",
              "Trước ga"
            ],
            "correct": 2,
            "why": "橋の 近くで 待って います."
          },
          {
            "q": "(Đoạn 2) Vì sao không được đứng trong xe?",
            "options": [
              "Vì sắp đến nơi",
              "Vì xe đông",
              "Vì làm phiền người khác",
              "Vì nguy hiểm"
            ],
            "correct": 3,
            "why": "危ないです."
          },
          {
            "q": "(Đoạn 2) Hành lý lớn để ở đâu?",
            "options": [
              "Dưới ghế",
              "Phía sau",
              "Mang theo người",
              "Phía trước"
            ],
            "correct": 1,
            "why": "うしろに おいて ください."
          },
          {
            "q": "(Đoạn 3) Tác giả đi sở thú với ai?",
            "options": [
              "Bạn cùng lớp",
              "Anh trai",
              "Một mình",
              "Bố và mẹ"
            ],
            "correct": 3,
            "why": "父と 母と."
          },
          {
            "q": "(Đoạn 3) Vì sao chân bị đau?",
            "options": [
              "Vì giày mới",
              "Vì đứng lâu",
              "Vì đi bộ nhiều",
              "Vì bị ngã"
            ],
            "correct": 2,
            "why": "たくさん 歩きました から."
          },
          {
            "q": "(Đoạn 4) Học sinh xin phép làm gì?",
            "options": [
              "Đứng lên",
              "Ngồi ở đây",
              "Chụp ảnh",
              "Về nhà"
            ],
            "correct": 1,
            "why": "ここに 座っても いいですか."
          },
          {
            "q": "(Đoạn 4) Thầy đề nghị gì? Vì sao?",
            "options": [
              "Ngồi thêm — vì còn sớm",
              "Sắp về thôi — vì đã 4 giờ",
              "Đi bộ — vì gần",
              "Ăn gì đó — vì đói"
            ],
            "correct": 1,
            "why": "四時に なりましたから、そろそろ 帰りましょう."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b10-nghe",
    "kind": "listening",
    "title": "Luyện thêm Bài 10 · Nghe — xin phép, đã/chưa, đang làm gì → chỉ đường, thấy gì, đi rồi về → bẫy chỗ khác, đổi ý, 音／声 (19 đoạn, ~39 câu)",
    "goal": "Nghe ra được hay không được (kể cả từ chối khéo), đã hay chưa, việc đang diễn ra, đường đi (rẽ ở đâu, hướng nào, thứ mấy), cái nhìn thấy/nghe thấy, giờ tập hợp và điều bị cấm — không bị lừa khi người nói chỉ chỗ khác (N は), đổi ý (でも) hay phân biệt 音／声.",
    "minutes": 65,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Nghe **2 lần**: lần 1 bắt ý chính (được hay không, đã hay chưa, đang làm gì); lần 2 ghi **chi tiết**: hướng rẽ (右／左), thứ tự (～つ目), giờ, cái nhìn thấy.",
          "Bẫy quen thuộc: **すみません、ちょっと……** = từ chối (dù không có chữ \"không\") · **N は ～てください** = được, nhưng ở CHỖ KHÁC · **まだ～ていません** = chưa · người nói **đổi ý** (でも…) · **音 / 声**.",
          "Luyện shadowing: bật lại từng đoạn và nói đuổi theo — rất tốt cho câu thi nói 「もう～ましたか」「～てもいいですか」「そこから何が見えますか」."
        ]
      },
      {
        "t": "recap",
        "title": "Từ khoá cần bắt tai",
        "items": [
          "**Được / không**: はい、どうぞ · いいですよ · すみません、ちょっと…… · ～ないでください · だめです.",
          "**Đã / chưa / đi rồi về**: もう～ました · まだ～ていません · ～てきます.",
          "**Đường đi / thấy gì**: ～を渡って · ～を右／左に曲がって · ～つ目 · ～が見えます · よく聞こえません. **Thay đổi**: ～くなりました · ～になりました."
        ]
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · chậm, ngắn — được hay không, đã hay chưa"
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-1a",
        "title": "① (chậm)",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "ここに{座|すわ}ってもいいですか。",
            "ro": "Koko ni suwatte mo ii desu ka.",
            "vi": "Tôi ngồi đây được không?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "はい、どうぞ。",
            "ro": "Hai, douzo.",
            "vi": "Vâng, mời bạn."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-1b",
        "title": "② (chậm)",
        "lines": [
          {
            "who": "マリヤム",
            "voice": "ja-nu",
            "text": "{窓|まど}を{開|あ}けてもいいですか。",
            "ro": "Mado o akete mo ii desu ka.",
            "vi": "Tôi mở cửa sổ được không?"
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "すみません。ちょっと……。{寒|さむ}いですから。",
            "ro": "Sumimasen. Chotto.... Samui desu kara.",
            "vi": "Xin lỗi. Hơi… Vì lạnh."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-1c",
        "title": "③",
        "lines": [
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "もうお{弁当|べんとう}を{買|か}いましたか。",
            "ro": "Mou obentou o kaimashita ka.",
            "vi": "Bạn mua cơm hộp chưa?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "いいえ、まだ{買|か}っていません。",
            "ro": "Iie, mada katte imasen.",
            "vi": "Chưa, tôi chưa mua."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-1d",
        "title": "④",
        "lines": [
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "あっ、ゾウが{水|みず}を{飲|の}んでいますよ。",
            "ro": "A, zou ga mizu o nonde imasu yo.",
            "vi": "A, con voi đang uống nước kìa."
          },
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "{本当|ほんとう}だ。{大|おお}きいですね。",
            "ro": "Hontouda. Ookii desu ne.",
            "vi": "Thật này. To nhỉ."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-1e",
        "title": "⑤",
        "lines": [
          {
            "who": "本田先生",
            "voice": "ja-nam",
            "text": "{皆|みな}さん、ここで{写真|しゃしん}を{撮|と}らないでください。",
            "ro": "Minasan, koko de shashin o toranaide kudasai.",
            "vi": "Các em, ở đây đừng chụp ảnh nhé."
          },
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "はい、わかりました。",
            "ro": "Hai, wakarimashita.",
            "vi": "Vâng, em hiểu rồi."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-ng-1-q",
        "title": "Câu hỏi ①–⑤ (7 câu)",
        "items": [
          {
            "q": "① Daniel có được ngồi không?",
            "options": [
              "○ được",
              "× không"
            ],
            "correct": 0,
            "why": "はい、どうぞ."
          },
          {
            "q": "② Mariyam có được mở cửa sổ không?",
            "options": [
              "○ được",
              "× không (từ chối khéo)"
            ],
            "correct": 1,
            "why": "すみません。ちょっと…… = từ chối."
          },
          {
            "q": "② Vì sao Carlos không muốn mở cửa sổ?",
            "options": [
              "Vì ồn",
              "Vì lạnh",
              "Vì nguy hiểm",
              "Vì bụi"
            ],
            "correct": 1,
            "why": "寒いですから."
          },
          {
            "q": "③ Marco đã mua cơm hộp chưa?",
            "options": [
              "○ rồi",
              "× chưa"
            ],
            "correct": 1,
            "why": "まだ 買って いません."
          },
          {
            "q": "④ Con voi đang làm gì?",
            "options": [
              "Ngủ",
              "Uống nước",
              "Ăn chuối",
              "Bơi"
            ],
            "correct": 1,
            "why": "ゾウが 水を 飲んで います."
          },
          {
            "q": "⑤ Thầy Honda nhắc điều gì?",
            "options": [
              "Hãy chụp ảnh ở đây",
              "Đừng chụp ảnh ở đây",
              "Đừng ăn ở đây",
              "Đừng nói to"
            ],
            "correct": 1,
            "why": "写真を 撮らないで ください."
          },
          {
            "q": "Trong ①–⑤, ai bị từ chối lời xin phép?",
            "options": [
              "Park",
              "Mariyam",
              "Natapon",
              "Daniel"
            ],
            "correct": 1,
            "why": "Mariyam: すみません。ちょっと……."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · chỉ đường · nhìn thấy gì · đi rồi về · nơi này làm được gì"
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-2a",
        "title": "⑥ Chỉ đường đến ngân hàng",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "すみません、{銀行|ぎんこう}はどこですか。",
            "ro": "Sumimasen, ginkou wa doko desu ka.",
            "vi": "Xin lỗi, ngân hàng ở đâu ạ?"
          },
          {
            "who": "西川",
            "voice": "ja-nam",
            "text": "この{道|みち}をまっすぐ{行|い}って、{二|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。",
            "ro": "Kono michi o massugu itte, futatsume no shingou o migi ni magatte kudasai.",
            "vi": "Chị đi thẳng đường này, rẽ phải ở đèn giao thông thứ hai."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-2b",
        "title": "⑦ Gọi điện: thấy gì?",
        "lines": [
          {
            "who": "山口",
            "voice": "ja-nu",
            "text": "もしもし、そこから{何|なに}が{見|み}えますか。",
            "ro": "Moshimoshi, soko kara nani ga miemasu ka.",
            "vi": "Alô, từ chỗ bạn thấy gì?"
          },
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "ええと……{左|ひだり}に{大|おお}きい{橋|はし}が{見|み}えます。",
            "ro": "Eeto... Hidari ni ookii hashi ga miemasu.",
            "vi": "Ờ… bên trái thấy cây cầu lớn."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-2c",
        "title": "⑧ Đi rồi về",
        "lines": [
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "ちょっとトイレに{行|い}ってきます。",
            "ro": "Chotto toire ni itte kimasu.",
            "vi": "Tôi đi vệ sinh một lát rồi về."
          },
          {
            "who": "木村",
            "voice": "ja-nu",
            "text": "はい。バスは{十分後|じゅっぷんご}に{出|で}ますから、{早|はや}く{帰|かえ}ってきてくださいね。",
            "ro": "Hai. Basu wa juppungo ni demasu kara, hayaku kaette kite kudasai ne.",
            "vi": "Vâng. Xe chạy sau 10 phút nữa nên về nhanh nhé."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-2d",
        "title": "⑨ Ở đây làm được gì?",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "すみません、ここで{切手|きって}を{買|か}うことができますか。",
            "ro": "Sumimasen, koko de kitte o kau koto ga dekimasu ka.",
            "vi": "Xin lỗi, ở đây mua tem được không ạ?"
          },
          {
            "who": "西川",
            "voice": "ja-nam",
            "text": "はい、できます。パンフレットももらうことができますよ。",
            "ro": "Hai, dekimasu. Panfuretto mo morau koto ga dekimasu yo.",
            "vi": "Vâng, được. Còn có thể lấy tờ giới thiệu nữa đấy."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-2e",
        "title": "⑩ Thay đổi → đề xuất",
        "lines": [
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{暗|くら}くなりましたね。",
            "ro": "Kuraku narimashita ne.",
            "vi": "Trời tối rồi nhỉ."
          },
          {
            "who": "ワン",
            "voice": "ja-nu",
            "text": "そうですね。そろそろ{帰|かえ}りましょう。",
            "ro": "Sou desu ne. Sorosoro kaerimashou.",
            "vi": "Ừ nhỉ. Về thôi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-2f",
        "title": "⑪ Điện thoại rè",
        "lines": [
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "もしもし、リンさん？{今|いま}どこですか。",
            "ro": "Moshimoshi, Rin-san? Ima doko desu ka.",
            "vi": "Alô, Lin à? Bây giờ bạn ở đâu?"
          },
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "すみません、{電車|でんしゃ}の{音|おと}でよく{聞|き}こえません。もう{一度|いちど}お{願|ねが}いします。",
            "ro": "Sumimasen, densha no oto de yoku kikoemasen. Mou ichido onegaishimasu.",
            "vi": "Xin lỗi, tiếng tàu ồn nên mình nghe không rõ. Nhắc lại giúp mình."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-2g",
        "title": "⑫ Ở chuồng chim",
        "lines": [
          {
            "who": "メアリー",
            "voice": "ja-nu",
            "text": "{見|み}てください。{鳥|とり}がたくさん{飛|と}んでいます。",
            "ro": "Mite kudasai. Tori ga takusan tonde imasu.",
            "vi": "Nhìn kìa. Nhiều chim đang bay."
          },
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "あ、{声|こえ}も{聞|き}こえますね。きれいです。",
            "ro": "A, koe mo kikoemasu ne. Kirei desu.",
            "vi": "À, nghe cả tiếng hót nữa nhỉ. Hay thật."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-ng-2-q",
        "title": "Câu hỏi ⑥–⑫ (12 câu)",
        "items": [
          {
            "q": "⑥ Rẽ ở đâu?",
            "options": [
              "Góc phố thứ hai",
              "Đèn giao thông thứ nhất",
              "Đèn giao thông thứ hai",
              "Ngã tư thứ hai"
            ],
            "correct": 2,
            "why": "二つ目の 信号."
          },
          {
            "q": "⑥ Rẽ hướng nào?",
            "options": [
              "Đi thẳng, không rẽ",
              "Phải",
              "Không nói",
              "Trái"
            ],
            "correct": 1,
            "why": "右に 曲がって."
          },
          {
            "q": "⑦ Natapon thấy gì, ở phía nào?",
            "options": [
              "Cây cầu lớn, bên phải",
              "Toà nhà cao, bên trái",
              "Cây cầu lớn, bên trái",
              "Ngân hàng, bên trái"
            ],
            "correct": 2,
            "why": "左に 大きい 橋が 見えます."
          },
          {
            "q": "⑧ Carlos đi đâu?",
            "options": [
              "Đi mua đồ uống",
              "Đi vệ sinh rồi quay lại",
              "Đi về nhà",
              "Đi tìm bạn"
            ],
            "correct": 1,
            "why": "トイレに 行って きます."
          },
          {
            "q": "⑧ Xe buýt chạy khi nào?",
            "options": [
              "Ngay bây giờ",
              "Lúc 10 giờ",
              "Sau 1 tiếng",
              "Sau 10 phút nữa"
            ],
            "correct": 3,
            "why": "十分 後に 出ます."
          },
          {
            "q": "⑨ Ở đó làm được những gì?",
            "options": [
              "Chỉ mua tem",
              "Không làm được gì",
              "Chỉ lấy tờ giới thiệu",
              "Mua tem và lấy tờ giới thiệu"
            ],
            "correct": 3,
            "why": "切手を 買う ことが できます · パンフレットも もらう ことが できます."
          },
          {
            "q": "⑩ Vì sao Wang đề nghị về?",
            "options": [
              "Vì trời tối rồi",
              "Vì trời lạnh",
              "Vì mệt",
              "Vì 12 giờ rồi"
            ],
            "correct": 0,
            "why": "暗く なりましたね → そろそろ 帰りましょう."
          },
          {
            "q": "⑪ Vì sao Lin nghe không rõ?",
            "options": [
              "Vì điện thoại hết pin",
              "Vì Daniel nói nhỏ",
              "Vì đang ở trong bảo tàng",
              "Vì tiếng tàu điện ồn"
            ],
            "correct": 3,
            "why": "電車の 音で よく 聞こえません."
          },
          {
            "q": "⑪ Lin nhờ Daniel làm gì?",
            "options": [
              "Gọi lại sau",
              "Nói lại một lần nữa",
              "Gửi tin nhắn",
              "Nói to hơn"
            ],
            "correct": 1,
            "why": "もう 一度 お願いします."
          },
          {
            "q": "⑫ Hai người thấy gì?",
            "options": [
              "Nhiều chim đang bay",
              "Chim đang ăn",
              "Chim đang ngủ",
              "Chim cánh cụt đang bơi"
            ],
            "correct": 0,
            "why": "鳥が たくさん 飛んで います."
          },
          {
            "q": "⑫ Họ còn nghe thấy gì?",
            "options": [
              "Tiếng xe",
              "Tiếng trẻ con",
              "Tiếng nhạc",
              "Tiếng chim"
            ],
            "correct": 3,
            "why": "声も 聞こえますね (声 = tiếng của con vật)."
          },
          {
            "q": "Đoạn nào có người dùng 「～てきます」?",
            "options": [
              "⑫",
              "⑥",
              "⑧",
              "⑨"
            ],
            "correct": 2,
            "why": "トイレに 行って きます · 帰って きて ください."
          }
        ]
      },
      {
        "t": "h",
        "text": "🔴 Mức 3 — KHÓ · bẫy: chỗ khác (N は), đổi ý, chưa/rồi, thứ tự đường đi dài"
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-3a",
        "title": "⑬ Hút thuốc ở đâu?",
        "lines": [
          {
            "who": "カルロス",
            "voice": "ja-nam",
            "text": "すみません、ここでたばこを{吸|す}ってもいいですか。",
            "ro": "Sumimasen, koko de tabako o sutte mo ii desu ka.",
            "vi": "Xin lỗi, tôi hút thuốc ở đây được không?"
          },
          {
            "who": "木村",
            "voice": "ja-nu",
            "text": "すみません。ここはちょっと……。たばこは{出口|でぐち}の{近|ちか}くの{喫煙所|きつえんじょ}で{吸|す}ってください。",
            "ro": "Sumimasen. Koko wa chotto.... Tabako wa deguchi no chikaku no kitsuenjo de sutte kudasai.",
            "vi": "Xin lỗi. Ở đây thì hơi… Thuốc lá xin hút ở khu hút thuốc gần lối ra."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-3b",
        "title": "⑭ Đổi ý: ăn ở đâu",
        "lines": [
          {
            "who": "マリヤム",
            "voice": "ja-nu",
            "text": "お{弁当|べんとう}はバスの{中|なか}で{食|た}べてもいいですか。",
            "ro": "Obentou wa basu no naka de tabete mo ii desu ka.",
            "vi": "Cơm hộp ăn trên xe được không?"
          },
          {
            "who": "西川",
            "voice": "ja-nam",
            "text": "バスの{中|なか}はだめです。お{弁当|べんとう}は{公園|こうえん}のテーブルで{食|た}べてください。あ、でも、{今日|きょう}は{暑|あつ}いですから、あそこの{木|き}の{下|した}で{食|た}べましょう。",
            "ro": "Basu no naka wa dame desu. Obentou wa kouen no teeburu de tabete kudasai. A, demo, kyou wa atsui desu kara, asoko no ki no shita de tabemashou.",
            "vi": "Trên xe thì không được. Cơm hộp hãy ăn ở bàn công viên. À, nhưng hôm nay nóng nên ta ăn dưới gốc cây đằng kia đi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-3c",
        "title": "⑮ Đã làm / chưa làm",
        "lines": [
          {
            "who": "アンナ",
            "voice": "ja-nu",
            "text": "もう{皆|みな}さんにパンフレットをあげましたか。",
            "ro": "Mou minasan ni panfuretto o agemashita ka.",
            "vi": "Anh đã phát tờ giới thiệu cho mọi người chưa?"
          },
          {
            "who": "西川",
            "voice": "ja-nam",
            "text": "ダニエルさんとワンさんにはもうあげました。でも、マルコさんにはまだあげていません。マルコさんはトイレに{行|い}っていますから。",
            "ro": "Danieru-san to Wan-san ni wa mou agemashita. Demo, Maruko-san ni wa mada agete imasen. Maruko-san wa toire ni itte imasu kara.",
            "vi": "Daniel và Wang thì tôi đưa rồi. Nhưng Marco thì chưa. Vì Marco đang đi vệ sinh."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-3d",
        "title": "⑯ Đường đi dài",
        "lines": [
          {
            "who": "リン",
            "voice": "ja-nu",
            "text": "もしもし、{今|いま}{駅|えき}の{前|まえ}です。{動物園|どうぶつえん}へどうやって{行|い}きますか。",
            "ro": "Moshimoshi, ima eki no mae desu. Doubutsuen e douyatte ikimasu ka.",
            "vi": "Alô, mình đang ở trước ga. Đến sở thú đi thế nào?"
          },
          {
            "who": "ダニエル",
            "voice": "ja-nam",
            "text": "{駅|えき}の{前|まえ}からまっすぐ{行|い}ってください。{一|ひと}つ{目|め}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がって、{橋|はし}を{渡|わた}ってください。{橋|はし}を{渡|わた}って、{右|みぎ}に{動物園|どうぶつえん}の{入|い}り{口|ぐち}が{見|み}えます。",
            "ro": "Eki no mae kara massugu itte kudasai. Hitotsume no kousaten o hidari ni magatte, hashi o watatte kudasai. Hashi o watatte, migi ni doubutsuen no iriguchi ga miemasu.",
            "vi": "Từ trước ga đi thẳng. Rẽ trái ở ngã tư đầu tiên rồi qua cầu. Qua cầu xong, bên phải sẽ thấy lối vào sở thú."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-3e",
        "title": "⑰ Âm thanh gì?",
        "lines": [
          {
            "who": "パク",
            "voice": "ja-nu",
            "text": "あれ、{何|なん}の{音|おと}ですか。",
            "ro": "Are, nan no oto desu ka.",
            "vi": "Ơ, tiếng gì thế?"
          },
          {
            "who": "マルコ",
            "voice": "ja-nam",
            "text": "{音|おと}じゃありませんよ。サルの{声|こえ}です。あそこでサルたちが{遊|あそ}んでいます。",
            "ro": "Oto ja arimasen yo. Saru no koe desu. Asoko de saru tachi ga asonde imasu.",
            "vi": "Không phải tiếng đồ vật đâu. Là tiếng khỉ. Đằng kia bọn khỉ đang chơi."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-3f",
        "title": "⑱ Ở đây làm được gì — và không được gì",
        "lines": [
          {
            "who": "ナタポン",
            "voice": "ja-nam",
            "text": "この{公園|こうえん}でボールで{遊|あそ}ぶことができますか。",
            "ro": "Kono kouen de booru de asobu koto ga dekimasu ka.",
            "vi": "Ở công viên này chơi bóng được không?"
          },
          {
            "who": "山口",
            "voice": "ja-nu",
            "text": "はい、{入|い}り{口|ぐち}の{近|ちか}くでできます。でも、{花|はな}の{近|ちか}くでは{遊|あそ}ばないでください。それから、{自転車|じてんしゃ}は{入|い}り{口|ぐち}に{置|お}いてください。",
            "ro": "Hai, iriguchi no chikaku de dekimasu. Demo, hana no chikaku de wa asobanaide kudasai. Sorekara, jitensha wa iriguchi ni oite kudasai.",
            "vi": "Vâng, ở gần lối vào thì được. Nhưng gần khu hoa thì xin đừng chơi. Còn xe đạp thì xin để ở lối vào."
          }
        ]
      },
      {
        "t": "listen",
        "id": "lt-b10-ng-3g",
        "title": "⑲ Thông báo của hướng dẫn viên",
        "lines": [
          {
            "who": "西川",
            "voice": "ja-nam",
            "text": "{皆|みな}さん、{今|いま}{十二時|じゅうにじ}です。{一時半|いちじはん}にこのバスの{前|まえ}に{集合|しゅうごう}してください。{一時半|いちじはん}ですよ。{遅|おく}れないでください。それから、{大切|たいせつ}なものはバスに{置|お}かないでください。{持|も}って{行|い}ってください。",
            "ro": "Minasan, ima juuniji desu. Ichijihan ni kono basu no mae ni shuugou shite kudasai. Ichijihan desu yo. Okurenaide kudasai. Sorekara, taisetsu na mono wa basu ni okanaide kudasai. Motte itte kudasai.",
            "vi": "Mọi người, bây giờ là 12 giờ. Hãy tập hợp trước xe buýt này lúc 1 giờ rưỡi. 1 rưỡi nhé. Xin đừng trễ. Ngoài ra, đồ quý giá thì đừng để trên xe mà hãy mang theo."
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-ng-3-q",
        "title": "Câu hỏi ⑬–⑲ (14 câu)",
        "items": [
          {
            "q": "⑬ Carlos có được hút thuốc ở đó không?",
            "options": [
              "Có",
              "Có, nếu ít người",
              "Không",
              "Không nói"
            ],
            "correct": 2,
            "why": "すみません。ここは ちょっと……."
          },
          {
            "q": "⑬ Hút thuốc ở đâu thì được?",
            "options": [
              "Khu hút thuốc gần lối vào",
              "Bên ngoài cổng",
              "Khu hút thuốc gần lối ra",
              "Trên xe buýt"
            ],
            "correct": 2,
            "why": "たばこは 出口の 近くの 喫煙所で 吸って ください."
          },
          {
            "q": "⑭ Cuối cùng cơm hộp ăn ở đâu?",
            "options": [
              "Trên xe buýt",
              "Dưới gốc cây đằng kia",
              "Ở bàn công viên",
              "Ở nhà hàng"
            ],
            "correct": 1,
            "why": "でも、今日は 暑いですから、あそこの 木の 下で 食べましょう — thông tin sau でも là quyết định cuối."
          },
          {
            "q": "⑭ Vì sao đổi chỗ?",
            "options": [
              "Vì bàn đã có người",
              "Vì lạnh",
              "Vì trời nóng",
              "Vì trời mưa"
            ],
            "correct": 2,
            "why": "今日は 暑いですから."
          },
          {
            "q": "⑮ Ai CHƯA nhận tờ giới thiệu?",
            "options": [
              "Daniel",
              "Wang",
              "Marco",
              "Anna"
            ],
            "correct": 2,
            "why": "マルコさんには まだ あげて いません."
          },
          {
            "q": "⑮ Vì sao?",
            "options": [
              "Marco đang đi vệ sinh",
              "Marco chưa đến",
              "Marco không cần",
              "Hết tờ giới thiệu"
            ],
            "correct": 0,
            "why": "トイレに 行って いますから."
          },
          {
            "q": "⑯ Lin đang ở đâu?",
            "options": [
              "Lối vào sở thú",
              "Trước ga",
              "Trên cầu",
              "Ở ngã tư đầu tiên"
            ],
            "correct": 1,
            "why": "今 駅の 前です."
          },
          {
            "q": "⑯ Thứ tự đường đi đúng?",
            "options": [
              "Đi thẳng → rẽ trái ở ngã tư đầu → qua cầu → lối vào bên phải",
              "Đi thẳng → qua cầu → rẽ trái → lối vào bên phải",
              "Rẽ trái → đi thẳng → qua cầu → lối vào bên trái",
              "Đi thẳng → rẽ phải ở ngã tư đầu → qua cầu"
            ],
            "correct": 0,
            "why": "まっすぐ → 一つ目の 交差点を 左に → 橋を 渡って → 右に 入り口."
          },
          {
            "q": "⑰ Âm thanh Park nghe là gì?",
            "options": [
              "Tiếng trẻ con chơi",
              "Tiếng nhạc",
              "Tiếng xe",
              "Tiếng khỉ"
            ],
            "correct": 3,
            "why": "サルの 声です (声 vì là con vật)."
          },
          {
            "q": "⑰ Bọn khỉ đang làm gì?",
            "options": [
              "Đang ăn",
              "Đang chơi",
              "Đang ngủ",
              "Đang bơi"
            ],
            "correct": 1,
            "why": "サルたちが 遊んで います."
          },
          {
            "q": "⑱ Chơi bóng ở đâu thì được?",
            "options": [
              "Gần lối vào",
              "Giữa công viên",
              "Gần khu hoa",
              "Không chỗ nào"
            ],
            "correct": 0,
            "why": "入り口の 近くで できます."
          },
          {
            "q": "⑱ Xe đạp để ở đâu?",
            "options": [
              "Ở lối vào",
              "Gần khu hoa",
              "Mang vào trong",
              "Giữa công viên"
            ],
            "correct": 0,
            "why": "自転車は 入り口に 置いて ください."
          },
          {
            "q": "⑲ Giờ tập hợp là mấy giờ?",
            "options": [
              "1 giờ rưỡi",
              "2 giờ rưỡi",
              "12 giờ",
              "1 giờ"
            ],
            "correct": 0,
            "why": "一時半に … 集合して ください (nhắc lại 2 lần)."
          },
          {
            "q": "⑲ Đồ quý giá thì làm sao?",
            "options": [
              "Để trên xe",
              "Để ở tủ khoá",
              "Gửi hướng dẫn viên",
              "Mang theo, đừng để trên xe"
            ],
            "correct": 3,
            "why": "大切な ものは バスに 置かないで、持って 行って ください."
          }
        ]
      },
      {
        "t": "h",
        "text": "Nghe điền chỗ trống — nghe lại các đoạn trên rồi gõ"
      },
      {
        "t": "quiz",
        "id": "lt-b10-ng-dien",
        "title": "Nghe điền chỗ trống (6 câu)",
        "kind": "fill",
        "grammar": "Nghe lại đoạn được ghi trong gợi ý",
        "items": [
          {
            "q": "リン：はい、＿＿。　〔Rin: hai, __.〕",
            "answers": [
              "どうぞ"
            ],
            "hint": "nghe ① — đồng ý"
          },
          {
            "q": "マルコ：いいえ、まだ{買|か}って＿＿。　〔Maruko: iie, mada katte __.〕",
            "answers": [
              "いません"
            ],
            "hint": "nghe ③"
          },
          {
            "q": "{西川|にしかわ}：{二|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}＿＿{曲|ま}がってください。　〔Nishikawa: futatsume no shingou o migi __ magatte kudasai.〕",
            "answers": [
              "に"
            ],
            "hint": "nghe ⑥"
          },
          {
            "q": "カルロス：ちょっとトイレに{行|い}って＿＿。　〔Karurosu: chotto toire ni itte __.〕",
            "answers": [
              "きます"
            ],
            "hint": "nghe ⑧"
          },
          {
            "q": "リン：{電車|でんしゃ}の{音|おと}でよく＿＿。　〔Rin: densha no oto de yoku __.〕",
            "answers": [
              "聞こえません",
              "きこえません"
            ],
            "hint": "nghe ⑪"
          },
          {
            "q": "{木村|きむら}：たばこ＿＿{出口|でぐち}の{近|ちか}くの{喫煙所|きつえんじょ}で{吸|す}ってください。　〔Kimura: tabako __ deguchi no chikaku no kitsuenjo de sutte kudasai.〕",
            "answers": [
              "は"
            ],
            "hint": "nghe ⑬ — chỉ chỗ khác"
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b10-noi-viet",
    "kind": "speaking",
    "title": "Luyện thêm Bài 10 · Nói & viết — 5 bộ tranh kiểu thi nói (3 câu tranh + 1 cá nhân) · đọc to · viết 3–5 câu",
    "goal": "Trả lời trọn câu các câu hỏi thi nói Bài 10 (đã/chưa, xin phép – biển cấm, con vật đang làm gì, nơi làm được gì, thay đổi → đề xuất, chỉ đường qua điện thoại), đọc to trôi chảy, viết lời nhắc / tin nhắn chỉ đường / một ngày đi chơi / hội thoại đến muộn 3–5 câu.",
    "minutes": 90,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "Thi nói: **nghe → nghĩ không quá 10 giây → trả lời TRỌN CÂU → thêm 1 câu phụ**. Mỗi bộ có 3 câu nhìn \"tranh\" (mô tả trong khung) + 1 câu cá nhân: che lời \"Bạn\", tự nói, rồi nghe mẫu.",
          "Năm khung \"ăn điểm\" của Bài 10: **đã/chưa** (もう～ました／まだ～ていません) · **xin phép – cấm** (～てもいいですか／～ないでください) · **đang thấy gì** (あっ、N が ～ています · N が 見えます) · **nơi làm được gì** (ここで ～ことが できます) · **thay đổi → đề xuất** (～く／～に なりました → ～ませんか) · **chỉ đường** (～を 渡って、～を 右に 曲がって).",
          "Viết ngắn: 3–5 câu; soát **で** trong ～ないでください, **も** trong ～てもいいですか, **が** với 見えます／聞こえます／できます, **を** với nơi đi qua, **く／に** trước なります."
        ]
      },
      {
        "t": "recap",
        "title": "Cách tự chấm",
        "items": [
          "✅ Trả lời TRỌN CÂU · ✅ đúng thông tin theo tranh · ✅ thêm 1 câu phụ (lý do ～から, đề xuất ～ませんか, ～てきます…) · ✅ không im lặng quá 10 giây.",
          "Nghe không rõ: 「すみません、よく 聞こえません。もう いちど おねがいします。」 — chính là câu của Bài 10!"
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
            "もう ～を ～ましたか",
            "はい、もう ～ました。／いいえ、まだ ～ていません。",
            "これから ～て きます"
          ],
          [
            "ここで ～ても いいですか",
            "はい、どうぞ。／すみません、ちょっと……。",
            "N は あそこで ～てください"
          ],
          [
            "ここで なにを しないで くださいか (biển cấm)",
            "～ないで ください。",
            "～ですから (lý do)"
          ],
          [
            "なにが みえますか／きこえますか",
            "～が 見えます／聞こえます。",
            "右に／左に ～も 見えます"
          ],
          [
            "ここで なにが できますか",
            "～が できます／～ことが できます。",
            "でも、～は できません"
          ],
          [
            "さむく なりましたね",
            "そうですね。～ませんか。",
            "～で ～を 飲みましょう"
          ],
          [
            "えきから ～まで どうやって いきますか",
            "～を まっすぐ 行って、～を 右に 曲がって ください。",
            "～が 見えます"
          ]
        ],
        "caption": "Khung trả lời Bài 10 — luôn trả lời TRỌN CÂU rồi thêm 1 câu phụ"
      },
      {
        "t": "h",
        "text": "🟢 Mức 1 — DỄ · bộ tranh 1–2: đã/chưa · biển báo"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Ba ô: ① người A cầm vé tour (dấu ✓); ② người B đứng trước cửa hàng tiện lợi, tay không, đồng hồ 8:50 (dấu ✗ cạnh hình cơm hộp); ③ người B chạy vào cửa hàng, mũi tên quay lại xe buýt."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Đã … chưa? · đi rồi về",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{人|ひと}はもうチケットを{買|か}いましたか。",
            "ro": "Kono hito wa mou chiketto o kaimashita ka.",
            "vi": "(Tranh ①) Người này đã mua vé chưa?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、もう{買|か}いました。",
            "ro": "Hai, mou kaimashita.",
            "vi": "Rồi, đã mua rồi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{人|ひと}はもうお{弁当|べんとう}を{買|か}いましたか。",
            "ro": "Kono hito wa mou obentou o kaimashita ka.",
            "vi": "(Tranh ②) Người này đã mua cơm hộp chưa?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいえ、まだ{買|か}っていません。",
            "ro": "Iie, mada katte imasen.",
            "vi": "Chưa, vẫn chưa mua."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "この{人|ひと}は{何|なに}と{言|い}いますか。",
            "ro": "Kono hito wa nani to iimasu ka.",
            "vi": "(Tranh ③) Người này nói gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ちょっとお{弁当|べんとう}を{買|か}ってきます。",
            "ro": "Chotto obentou o katte kimasu.",
            "vi": "Tôi đi mua cơm hộp một chút rồi quay lại."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。",
            "ro": "Mou hirugohan o tabemashita ka.",
            "vi": "(Cá nhân) Bạn ăn trưa chưa?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいえ、まだ{食|た}べていません。これから{食|た}べに{行|い}きます。",
            "ro": "Iie, mada tabete imasen. Korekara tabeni ikimasu.",
            "vi": "Chưa, tôi chưa ăn. Bây giờ tôi đi ăn."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Ba biển trong một công viên: ① 📷 gạch chéo cạnh tượng; ② 🚬 gạch chéo, mũi tên chỉ \"喫煙所\"; ③ ghế dài 🪑 dấu ○."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Biển báo — được và không được",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ここで{写真|しゃしん}を{撮|と}ってもいいですか。",
            "ro": "Koko de shashin o totte mo ii desu ka.",
            "vi": "(Biển ①) Ở đây chụp ảnh được không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "いいえ、{撮|と}らないでください。",
            "ro": "Iie, toranaide kudasai.",
            "vi": "Không, xin đừng chụp."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "たばこはどこで{吸|す}ってもいいですか。",
            "ro": "Tabako wa doko de sutte mo ii desu ka.",
            "vi": "(Biển ②) Thuốc lá thì hút ở đâu được?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "たばこは{喫煙所|きつえんじょ}で{吸|す}ってください。",
            "ro": "Tabako wa kitsuenjo de sutte kudasai.",
            "vi": "Thuốc lá thì hãy hút ở khu hút thuốc."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ここに{座|すわ}ってもいいですか。",
            "ro": "Koko ni suwatte mo ii desu ka.",
            "vi": "(Biển ③) Ngồi ở đây được không?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、どうぞ。{座|すわ}ってもいいです。",
            "ro": "Hai, douzo. Suwatte mo ii desu.",
            "vi": "Vâng, mời. Ngồi được."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{教室|きょうしつ}で{何|なに}をしないでくださいか。",
            "ro": "Kyoushitsu de nani o shinaide kudasai ka.",
            "vi": "(Cá nhân) Trong lớp học, điều gì không được làm?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{教室|きょうしつ}で{食|た}べ{物|もの}を{食|た}べないでください。それから、{大|おお}きい{声|こえ}で{話|はな}さないでください。",
            "ro": "Kyoushitsu de tabemono o tabenaide kudasai. Sorekara, ookii koe de hanasanaide kudasai.",
            "vi": "Trong lớp xin đừng ăn. Và đừng nói to."
          }
        ]
      },
      {
        "t": "h",
        "text": "🟡 Mức 2 — VỪA · bộ tranh 3–4: ở sở thú · thay đổi → đề xuất"
      },
      {
        "t": "note",
        "title": "Tranh 1 (mô tả)",
        "items": [
          "Ba ô: ① khỉ đang ăn chuối; ② bảng ở chuồng voi: \"えさ 200円 ○\"; ③ vòng đu quay, trên cao vẽ biển."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Ở sở thú — đang làm gì · làm được gì",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "サルは{何|なに}をしていますか。",
            "ro": "Saru wa nani o shite imasu ka.",
            "vi": "(Tranh ①) Con khỉ đang làm gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "サルがバナナを{食|た}べています。",
            "ro": "Saru ga banana o tabete imasu.",
            "vi": "Con khỉ đang ăn chuối."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "ここで{何|なに}ができますか。",
            "ro": "Koko de nani ga dekimasu ka.",
            "vi": "(Tranh ②) Ở chỗ này làm được gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "ゾウにえさをやることができます。{二百円|にひゃくえん}です。",
            "ro": "Zou ni esa o yaru koto ga dekimasu. Nihyakuen desu.",
            "vi": "Có thể cho voi ăn. 200 yên."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{観覧車|かんらんしゃ}から{何|なに}が{見|み}えますか。",
            "ro": "Kanransha kara nani ga miemasu ka.",
            "vi": "(Tranh ③) Từ vòng đu quay thấy gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{海|うみ}が{見|み}えます。",
            "ro": "Umi ga miemasu.",
            "vi": "Thấy biển."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "あなたの{町|まち}で{何|なに}ができますか。",
            "ro": "Anata no machi de nani ga dekimasu ka.",
            "vi": "(Cá nhân) Ở thành phố của bạn làm được gì?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{私|わたし}の{町|まち}では{海|うみ}で{泳|およ}ぐことができます。おいしい{魚|さかな}も{食|た}べることができます。",
            "ro": "Watashi no machi de wa umi de oyogu koto ga dekimasu. Oishii sakana mo taberu koto ga dekimasu.",
            "vi": "Ở thành phố tôi có thể bơi ở biển. Cũng có thể ăn cá ngon."
          }
        ]
      },
      {
        "t": "note",
        "title": "Tranh 2 (mô tả)",
        "items": [
          "Ba ô: ① nhiệt kế tụt, người run, máy bán cà phê; ② đồng hồ 12:00, bụng kêu; ③ trời tối, đèn trang trí sáng."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 2 — Thay đổi → đề xuất",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{寒|さむ}くなりましたね。",
            "ro": "Samuku narimashita ne.",
            "vi": "(Tranh ①) Trời lạnh rồi nhỉ."
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "そうですね。{温|あたた}かいコーヒーを{飲|の}みませんか。",
            "ro": "Sou desu ne. Atatakai koohii o nomimasen ka.",
            "vi": "Ừ nhỉ. Uống cà phê nóng không?"
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{今|いま}、{何時|なんじ}ですか。どうしましょうか。",
            "ro": "Ima, nanji desu ka. Dou shimashou ka.",
            "vi": "(Tranh ②) Mấy giờ rồi? Làm gì nhỉ?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{十二時|じゅうにじ}になりました。おなかがすきましたから、{昼|ひる}ご{飯|はん}を{食|た}べましょう。",
            "ro": "Juuniji ni narimashita. Onaka ga sukimashita kara, hirugohan o tabemashou.",
            "vi": "12 giờ rồi. Đói rồi nên ăn trưa thôi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{外|そと}はどうですか。",
            "ro": "Soto wa dou desu ka.",
            "vi": "(Tranh ③) Bên ngoài thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{暗|くら}くなりました。そろそろ{帰|かえ}りましょう。",
            "ro": "Kuraku narimashita. Sorosoro kaerimashou.",
            "vi": "Trời tối rồi. Sắp về thôi."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{日本語|にほんご}が{上手|じょうず}になりましたか。",
            "ro": "Nihongo ga jouzu ni narimashita ka.",
            "vi": "(Cá nhân) Tiếng Nhật của bạn đã giỏi lên chưa?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "はい、{少|すこ}し{上手|じょうず}になりました。でも、{漢字|かんじ}はまだ{難|むずか}しいです。",
            "ro": "Hai, sukoshi jouzu ni narimashita. Demo, kanji wa mada muzukashii desu.",
            "vi": "Vâng, giỏi lên một chút. Nhưng chữ Hán vẫn còn khó."
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
          "Bản đồ: ga (xuất phát) → đi thẳng → ngã tư thứ nhất (có cửa hàng tiện lợi ở góc) → rẽ trái → cây cầu → qua cầu → bên phải: toà nhà KS (điểm tập hợp ★)."
        ]
      },
      {
        "t": "dialogue",
        "title": "Bộ tranh 1 — Chỉ đường qua điện thoại",
        "lines": [
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "もしもし、{今|いま}{駅|えき}の{前|まえ}です。KSビルへどうやって{行|い}きますか。",
            "ro": "Moshimoshi, ima eki no mae desu. KS biru e douyatte ikimasu ka.",
            "vi": "(Bản đồ) Alô, tôi đang trước ga. Đến toà nhà KS đi thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "まっすぐ{行|い}って、{一|ひと}つ{目|め}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がってください。",
            "ro": "Massugu itte, hitotsume no kousaten o hidari ni magatte kudasai.",
            "vi": "Đi thẳng, rẽ trái ở ngã tư thứ nhất."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "それから？",
            "ro": "Sorekara?",
            "vi": "Rồi sao nữa?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{橋|はし}を{渡|わた}ってください。{右|みぎ}にKSビルが{見|み}えます。",
            "ro": "Hashi o watatte kudasai. Migi ni KS biru ga miemasu.",
            "vi": "Qua cầu. Bên phải sẽ thấy toà nhà KS."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "すみません、よく{聞|き}こえません。もう{一度|いちど}お{願|ねが}いします。",
            "ro": "Sumimasen, yoku kikoemasen. Mou ichido onegaishimasu.",
            "vi": "(Điện thoại rè) Xin lỗi, nghe không rõ. Nói lại giúp."
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{橋|はし}を{渡|わた}って、{右|みぎ}です。KSビルの{前|まえ}で{待|ま}っています。",
            "ro": "Hashi o watatte, migi desu. KS biru no mae de matte imasu.",
            "vi": "Qua cầu rồi bên phải. Tôi đang chờ trước toà nhà KS."
          },
          {
            "who": "Giám khảo",
            "role": "examiner",
            "text": "{駅|えき}からあなたのうちまでどうやって{行|い}きますか。",
            "ro": "Eki kara anata no uchi made douyatte ikimasu ka.",
            "vi": "(Cá nhân) Từ ga đến nhà bạn đi thế nào?"
          },
          {
            "who": "Bạn",
            "role": "candidate",
            "text": "{駅|えき}を{出|で}て、まっすぐ{歩|ある}いてください。{二|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。{左|ひだり}に{私|わたし}のうちが{見|み}えます。",
            "ro": "Eki o dete, massugu aruite kudasai. Futatsume no shingou o migi ni magatte kudasai. Hidari ni watashi no uchi ga miemasu.",
            "vi": "Ra khỏi ga, đi bộ thẳng. Rẽ phải ở đèn thứ hai. Bên trái sẽ thấy nhà tôi."
          }
        ]
      },
      {
        "t": "h",
        "text": "Đọc to (Reading 40 điểm)"
      },
      {
        "t": "passage",
        "title": "Đọc to 1 (Reading) — Lời nhắc của hướng dẫn viên",
        "intro": "Chuẩn bị 20 giây rồi đọc to, chậm, rõ. Chú ý thể ない: たたないで・ださないで・すわないで.",
        "paras": [
          {
            "text": "{皆|みな}さん、バスの{中|なか}で{立|た}たないでください。{窓|まど}から{手|て}を{出|だ}さないでください。たばこは{吸|す}わないでください。ごみはうちへ{持|も}って{帰|かえ}ってください。{十二時|じゅうにじ}にバスの{前|まえ}に{集合|しゅうごう}してください。{遅|おく}れないでください。"
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
            "en": "{皆|みな}さん、バスの{中|なか}で{立|た}たないでください。",
            "ro": "Minasan, basu no naka de tatanaide kudasai.",
            "vi": "Mọi người, trong xe buýt xin đừng đứng lên."
          },
          {
            "en": "{窓|まど}から{手|て}を{出|だ}さないでください。",
            "ro": "Mado kara te o dasanaide kudasai.",
            "vi": "Xin đừng thò tay ra ngoài cửa sổ."
          },
          {
            "en": "たばこは{吸|す}わないでください。",
            "ro": "Tabako wa suwanaide kudasai.",
            "vi": "Thuốc lá thì xin đừng hút."
          },
          {
            "en": "ごみはうちへ{持|も}って{帰|かえ}ってください。",
            "ro": "Gomi wa uchi e motte kaette kudasai.",
            "vi": "Rác thì xin mang về nhà."
          },
          {
            "en": "{十二時|じゅうにじ}にバスの{前|まえ}に{集合|しゅうごう}してください。",
            "ro": "Juuniji ni basu no mae ni shuugou shite kudasai.",
            "vi": "Hãy tập hợp trước xe buýt lúc 12 giờ."
          },
          {
            "en": "{遅|おく}れないでください。",
            "ro": "Okurenaide kudasai.",
            "vi": "Xin đừng đến trễ."
          }
        ]
      },
      {
        "t": "passage",
        "title": "Đọc to 2 (Reading) — Ở sở thú",
        "intro": "Nhiều âm dài và âm ngắt: どうぶつえん・かんらんしゃ・ほんとうだ・いって.",
        "paras": [
          {
            "text": "{日曜日|にちようび}、{友達|ともだち}と{動物園|どうぶつえん}へ{行|い}きました。パンダが{木|き}の{上|うえ}で{寝|ね}ていました。ゾウにえさをやることができました。{観覧車|かんらんしゃ}から{海|うみ}が{見|み}えました。{五時|ごじ}ごろ{暗|くら}くなりましたから、{帰|かえ}りました。"
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
            "en": "{日曜日|にちようび}、{友達|ともだち}と{動物園|どうぶつえん}へ{行|い}きました。",
            "ro": "Nichiyoubi, tomodachi to doubutsuen e ikimashita.",
            "vi": "Chủ nhật tôi đi sở thú với bạn."
          },
          {
            "en": "パンダが{木|き}の{上|うえ}で{寝|ね}ていました。",
            "ro": "Panda ga ki no ue de nete imashita.",
            "vi": "Gấu trúc đang ngủ trên cây."
          },
          {
            "en": "ゾウにえさをやることができました。",
            "ro": "Zou ni esa o yaru koto ga dekimashita.",
            "vi": "Tôi đã được cho voi ăn."
          },
          {
            "en": "{観覧車|かんらんしゃ}から{海|うみ}が{見|み}えました。",
            "ro": "Kanransha kara umi ga miemashita.",
            "vi": "Từ vòng đu quay đã nhìn thấy biển."
          },
          {
            "en": "{五時|ごじ}ごろ{暗|くら}くなりましたから、{帰|かえ}りました。",
            "ro": "Goji goro kuraku narimashita kara, kaerimashita.",
            "vi": "Khoảng 5 giờ trời tối nên chúng tôi về."
          }
        ]
      },
      {
        "t": "speak",
        "id": "lt-b10-noi-ghi-am",
        "part": "1",
        "questions": [
          "もう ひるごはんを たべましたか。",
          "ここで しゃしんを とっても いいですか。",
          "としょかんで なにを しないで くださいか。",
          "あなたの まちで なにが できますか。",
          "あなたの へやから なにが みえますか。",
          "さむく なりましたね。なにを しましょうか。",
          "えきから あなたの うちまで みちを おしえて ください。",
          "にほんごが じょうずに なりましたか。"
        ]
      },
      {
        "t": "h",
        "text": "Viết ngắn 3–5 câu — 4 đề có bài mẫu"
      },
      {
        "t": "p",
        "text": "**Đề 1.** Viết 4 lời nhắc cho bạn mới vào thư viện của trường (～ないでください · ～てもいいです · N は ～てください). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{図書館|としょかん}で{大|おお}きい{声|こえ}で{話|はな}さないでください。",
            "ro": "Toshokan de ookii koe de hanasanaide kudasai.",
            "vi": "Trong thư viện xin đừng nói to."
          },
          {
            "en": "{食|た}べ{物|もの}を{食|た}べないでください。{飲|の}み{物|もの}は{飲|の}んでもいいです。",
            "ro": "Tabemono o tabenaide kudasai. Nomimono wa nonde mo ii desu.",
            "vi": "Xin đừng ăn. Đồ uống thì uống được."
          },
          {
            "en": "{電話|でんわ}は{外|そと}でかけてください。",
            "ro": "Denwa wa soto de kakete kudasai.",
            "vi": "Điện thoại thì hãy gọi ở bên ngoài."
          },
          {
            "en": "{本|ほん}は{一週間|いっしゅうかん}{借|か}りることができます。",
            "ro": "Hon wa isshuukan kariru koto ga dekimasu.",
            "vi": "Sách có thể mượn một tuần."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 2.** Viết tin nhắn chỉ đường từ ga đến nhà bạn (3–4 câu, dùng ～を渡って／～を右に曲がって／～が見えます). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{駅|えき}を{出|で}て、まっすぐ{歩|ある}いてください。",
            "ro": "Eki o dete, massugu aruite kudasai.",
            "vi": "Ra khỏi ga rồi đi bộ thẳng."
          },
          {
            "en": "{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}に{曲|ま}がって、{橋|はし}を{渡|わた}ってください。",
            "ro": "Futatsume no shingou o hidari ni magatte, hashi o watatte kudasai.",
            "vi": "Rẽ trái ở đèn thứ hai rồi qua cầu."
          },
          {
            "en": "{右|みぎ}に{大|おお}きいマンションが{見|み}えます。",
            "ro": "Migi ni ookii manshon ga miemasu.",
            "vi": "Bên phải sẽ thấy một toà chung cư lớn."
          },
          {
            "en": "{私|わたし}のうちはそのマンションの{三階|さんがい}です。",
            "ro": "Watashi no uchi wa sono manshon no sangai desu.",
            "vi": "Nhà tôi ở tầng 3 của toà đó."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 3.** Kể một ngày đi sở thú / công viên (4 câu, dùng ～ていました · ～ことができました · ～くなりました). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "{先週|せんしゅう}の{土曜日|どようび}、{家族|かぞく}と{動物園|どうぶつえん}へ{行|い}きました。",
            "ro": "Senshuu no doyoubi, kazoku to doubutsuen e ikimashita.",
            "vi": "Thứ Bảy tuần trước tôi đi sở thú với gia đình."
          },
          {
            "en": "ペンギンが{泳|およ}いでいました。とてもかわいかったです。",
            "ro": "Pengin ga oyoide imashita. Totemo kawaikatta desu.",
            "vi": "Chim cánh cụt đang bơi. Rất dễ thương."
          },
          {
            "en": "サルにえさをやることができました。",
            "ro": "Saru ni esa o yaru koto ga dekimashita.",
            "vi": "Tôi đã được cho khỉ ăn."
          },
          {
            "en": "{五時|ごじ}ごろ{寒|さむ}くなりましたから、{帰|かえ}りました。",
            "ro": "Goji goro samuku narimashita kara, kaerimashita.",
            "vi": "Khoảng 5 giờ trời trở lạnh nên chúng tôi về."
          }
        ]
      },
      {
        "t": "p",
        "text": "**Đề 4.** Viết đoạn hội thoại ngắn: bạn đến muộn, gọi điện cho bạn ở điểm tập hợp (4 lượt). Bài mẫu:"
      },
      {
        "t": "examples",
        "items": [
          {
            "en": "A：もしもし、{今|いま}どこですか。バスはもうすぐ{出|で}ますよ。",
            "ro": "A: moshimoshi, ima doko desu ka. Basu wa mou sugu demasu yo.",
            "vi": "A: Alô, bạn đang ở đâu? Xe buýt sắp chạy rồi đấy."
          },
          {
            "en": "B：すみません。まだ{駅|えき}です。{道|みち}がよくわかりません。",
            "ro": "B: sumimasen. Mada eki desu. Michi ga yoku wakarimasen.",
            "vi": "B: Xin lỗi. Mình vẫn ở ga. Không rõ đường lắm."
          },
          {
            "en": "A：そこから{何|なに}が{見|み}えますか。",
            "ro": "A: soko kara nani ga miemasu ka.",
            "vi": "A: Từ đó bạn thấy gì?"
          },
          {
            "en": "B：{大|おお}きい{橋|はし}が{見|み}えます。——A：じゃあ、その{橋|はし}を{渡|わた}ってください。",
            "ro": "B: ookii hashi ga miemasu. — A: jaa, sono hashi o watatte kudasai.",
            "vi": "B: Mình thấy cây cầu lớn. — A: Vậy qua cây cầu đó đi."
          }
        ]
      },
      {
        "t": "note",
        "title": "Checklist trước khi nộp bài viết",
        "items": [
          "**Vない + で ください** (không ~~Vないください~~, ~~Vませんでください~~) · **Vて + も いいですか** · **まだ Vて いません** (không ~~まだVませんでした~~).",
          "Soát trợ từ: **が** 見えます／聞こえます／できます · **を** 渡ります／歩きます · **を** (chỗ rẽ) + **に** (hướng) 曲がります · **N は** khi chỉ cách khác.",
          "なります: tính từ い → **く** なります (いい → よく) · tính từ な / danh từ → **に** なります."
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-viet-chon",
        "title": "Chọn bài viết đúng và tự nhiên (6 câu)",
        "items": [
          {
            "q": "Viết: \"Trong thư viện xin đừng nói chuyện.\"",
            "options": [
              "{図書館|としょかん}で{話|はな}さないでください。 (Toshokan de hanasanaide kudasai.)",
              "{図書館|としょかん}で{話|はな}しませんでください。 (Toshokan de hanashimasende kudasai.)",
              "{図書館|としょかん}で{話|はな}しないでください。 (Toshokan de hanashinaide kudasai.)",
              "{図書館|としょかん}で{話|はな}さないください。 (Toshokan de hanasanai kudasai.)"
            ],
            "correct": 0,
            "why": "話します → 話さない + で ください."
          },
          {
            "q": "Viết: \"Đồ uống thì uống được.\"",
            "options": [
              "{飲|の}み{物|もの}は{飲|の}むもいいです。 (Nomimono wa nomu mo ii desu.)",
              "{飲|の}み{物|もの}は{飲|の}んでもいいです。 (Nomimono wa nonde mo ii desu.)",
              "{飲|の}み{物|もの}をは{飲|の}んでもいいです。 (Nomimono o wa nonde mo ii desu.)",
              "{飲|の}み{物|もの}は{飲|の}んでいいもです。 (Nomimono wa nonde ii mo desu.)"
            ],
            "correct": 1,
            "why": "N は + Vて も いいです."
          },
          {
            "q": "Viết chỉ đường: \"Qua cầu rồi rẽ phải ở ngã tư.\"",
            "options": [
              "{橋|はし}を{渡|わた}って、{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。 (Hashi o watatte, kousaten o migi ni magatte kudasai.)",
              "{橋|はし}に{渡|わた}って、{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。 (Hashi ni watatte, kousaten o migi ni magatte kudasai.)",
              "{橋|はし}を{渡|わた}りて、{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。 (Hashi o watarite, kousaten o migi ni magatte kudasai.)",
              "{橋|はし}を{渡|わた}って、{交差点|こうさてん}に{右|みぎ}を{曲|ま}がってください。 (Hashi o watatte, kousaten ni migi o magatte kudasai.)"
            ],
            "correct": 0,
            "why": "橋を 渡って · 交差点を 右に."
          },
          {
            "q": "Viết: \"Bên phải nhìn thấy toà nhà cao.\"",
            "options": [
              "{右|みぎ}を{高|たか}いビルが{見|み}えます。 (Migi o takai biru ga miemasu.)",
              "{右|みぎ}に{高|たか}いビルを{見|み}えます。 (Migi ni takai biru o miemasu.)",
              "{右|みぎ}に{高|たか}いビルが{見|み}えます。 (Migi ni takai biru ga miemasu.)",
              "{右|みぎ}に{高|たか}いビルが{見|み}ます。 (Migi ni takai biru ga mimasu.)"
            ],
            "correct": 2,
            "why": "N が 見えます."
          },
          {
            "q": "Viết: \"Trời trở lạnh nên chúng tôi đã về.\"",
            "options": [
              "{寒|さむ}くしましたから、{帰|かえ}りました。 (Samuku shimashita kara, kaerimashita.)",
              "{寒|さむ}いになりましたから、{帰|かえ}りました。 (Samui ni narimashita kara, kaerimashita.)",
              "{寒|さむ}くなりましたから、{帰|かえ}りました。 (Samuku narimashita kara, kaerimashita.)",
              "{寒|さむ}くなりましたから、{帰|かえ}っていません。 (Samuku narimashita kara, kaette imasen.)"
            ],
            "correct": 2,
            "why": "寒い → 寒く なりました."
          },
          {
            "q": "Viết: \"Tôi vẫn chưa nộp bài tập.\"",
            "options": [
              "{宿題|しゅくだい}をまだ{出|だ}さないでください。 (Shukudai o mada dasanaide kudasai.)",
              "{宿題|しゅくだい}をもう{出|だ}していません。 (Shukudai o mou dashite imasen.)",
              "{宿題|しゅくだい}をまだ{出|だ}していません。 (Shukudai o mada dashite imasen.)",
              "{宿題|しゅくだい}をまだ{出|だ}しませんでした。 (Shukudai o mada dashimasendeshita.)"
            ],
            "correct": 2,
            "why": "まだ + Vて いません."
          }
        ]
      },
      {
        "t": "build",
        "id": "lt-b10-viet-sx",
        "title": "Sắp xếp thành đoạn văn hoàn chỉnh (2 câu)",
        "items": [
          {
            "vi": "Sắp xếp tin nhắn chỉ đường: ra ga đi thẳng → rẽ ở đèn → qua cầu → thấy nhà.",
            "chips": [
              "{橋|はし}を{渡|わた}ってください。",
              "{右|みぎ}に{私|わたし}のうちが{見|み}えます。",
              "{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}に{曲|ま}がってください。",
              "{駅|えき}を{出|で}て、まっすぐ{歩|ある}いてください。"
            ],
            "answer": [
              "{駅|えき}を{出|で}て、まっすぐ{歩|ある}いてください。",
              "{二|ふた}つ{目|め}の{信号|しんごう}を{左|ひだり}に{曲|ま}がってください。",
              "{橋|はし}を{渡|わた}ってください。",
              "{右|みぎ}に{私|わたし}のうちが{見|み}えます。"
            ],
            "ro": "Eki o dete, massugu aruite kudasai. Futatsume no shingou o hidari ni magatte kudasai. Hashi o watatte kudasai. Migi ni watashi no uchi ga miemasu."
          },
          {
            "vi": "Sắp xếp đoạn \"một ngày ở sở thú\": đi → thấy → làm được → trời tối thì về.",
            "chips": [
              "ゾウにえさをやることができました。",
              "{暗|くら}くなりましたから、{帰|かえ}りました。",
              "パンダが{寝|ね}ていました。",
              "{日曜日|にちようび}、{動物園|どうぶつえん}へ{行|い}きました。"
            ],
            "answer": [
              "{日曜日|にちようび}、{動物園|どうぶつえん}へ{行|い}きました。",
              "パンダが{寝|ね}ていました。",
              "ゾウにえさをやることができました。",
              "{暗|くら}くなりましたから、{帰|かえ}りました。"
            ],
            "ro": "Nichiyoubi, doubutsuen e ikimashita. Panda ga nete imashita. Zou ni esa o yaru koto ga dekimashita. Kuraku narimashita kara, kaerimashita."
          }
        ]
      }
    ]
  },
  {
    "id": "lt-b10-de-tong-hop",
    "kind": "review",
    "title": "Luyện thêm Bài 10 · Đề tổng hợp cuối bài — đúng khuôn kiểm tra của cô (65 câu · 50 phút)",
    "goal": "Làm thử một đề đủ các phần: từ vựng, chữ Hán (chữ nhiễu), ngữ pháp 10 điểm, gõ thể ない/thể て, đọc hiểu, dịch — bấm giờ 50 phút, tự chấm theo thang điểm và biết mình yếu phần nào.",
    "minutes": 50,
    "blocks": [
      {
        "t": "note",
        "title": "Học thế nào",
        "items": [
          "**Bấm giờ 50 phút**, không mở bài ôn. Làm theo thứ tự I → VI; câu chưa chắc thì đánh dấu, quay lại sau.",
          "Phần II (chữ Hán) có **chữ na ná**: 右/石 · 左/在 · 待/持/時 · 近/遠 · 道/通 · 曲/由 · 立/位 · 座/庭. Phần IV gõ **thể ない** và **thể て** — nhớ các bẫy 吸わない (い→わ) · 入らない／帰らない (nhóm 1) · 見ない／起きない／借りない (nhóm 2) · 来ない (こない).",
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
            "Ngữ pháp — ないでください, てもいいですか, ています, まだ～ていません, てきます, ことができます, 見えます, なります, を, は",
            "20",
            "20"
          ],
          [
            "IV",
            "Gõ thể ない / thể て",
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
        "caption": "Cấu trúc đề tổng hợp Bài 10"
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
            "Sang Bài 11; làm lại phần IV sau 3 ngày để giữ thể ない"
          ],
          [
            "46–54 (70–85%)",
            "Khá, còn sơ hở",
            "Xem lại phần sai nhiều nhất; làm lại lesson tương ứng ở mức Vừa"
          ],
          [
            "< 46 (< 70%)",
            "Chưa chắc",
            "Làm lại \"Thể ない\" + 3 lesson ngữ pháp từ mức Dễ, rồi làm lại đề này sau 2 ngày"
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
        "id": "lt-b10-de-i",
        "title": "I. Từ vựng",
        "items": [
          {
            "q": "{二|ふた}つ{目|め}の＿＿を{右|みぎ}に{曲|ま}がってください。　〔Futatsume no __ o migi ni magatte kudasai.〕　— Rẽ phải ở đèn giao thông thứ hai.",
            "options": [
              "えさ",
              "{声|こえ}",
              "{薬|くすり}",
              "{信号|しんごう}"
            ],
            "correct": 3,
            "why": "Chỗ rẽ: đèn giao thông. → **{二|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。** 〔Futatsume no shingou o migi ni magatte kudasai.〕 — Rẽ phải ở đèn giao thông thứ hai."
          },
          {
            "q": "{大|おお}きい{橋|はし}を＿＿ください。　〔Ookii hashi o __ kudasai.〕　— Hãy qua cây cầu lớn.",
            "options": [
              "{渡|わた}って",
              "{曲|ま}がって",
              "{座|すわ}って",
              "{押|お}して"
            ],
            "correct": 0,
            "why": "橋を 渡ります. → **{大|おお}きい{橋|はし}を{渡|わた}ってください。** 〔Ookii hashi o watatte kudasai.〕 — Hãy qua cây cầu lớn."
          },
          {
            "q": "{鳥|とり}の＿＿が{聞|き}こえます。　〔Tori no __ ga kikoemasu.〕　— Nghe thấy tiếng chim.",
            "options": [
              "{道|みち}",
              "{声|こえ}",
              "{手|て}",
              "{音|おと}"
            ],
            "correct": 1,
            "why": "Tiếng con vật → 声. → **{鳥|とり}の{声|こえ}が{聞|き}こえます。** 〔Tori no koe ga kikoemasu.〕 — Nghe thấy tiếng chim."
          },
          {
            "q": "おなかが{痛|いた}いですから、＿＿を{飲|の}みます。　〔Onaka ga itai desu kara, __ o nomimasu.〕　— Tôi đau bụng nên uống thuốc.",
            "options": [
              "{薬|くすり}",
              "えさ",
              "ごみ",
              "カーテン"
            ],
            "correct": 0,
            "why": "薬を 飲みます. → **おなかが{痛|いた}いですから、{薬|くすり}を{飲|の}みます。** 〔Onaka ga itai desu kara, kusuri o nomimasu.〕 — Tôi đau bụng nên uống thuốc."
          },
          {
            "q": "{危|あぶ}ないですから、{前|まえ}の{人|ひと}を＿＿ください。　〔Abunai desu kara, mae no hito o __ kudasai.〕　— Nguy hiểm nên đừng đẩy người phía trước.",
            "options": [
              "{渡|わた}らないで",
              "{押|お}さないで",
              "{座|すわ}らないで",
              "{探|さが}さないで"
            ],
            "correct": 1,
            "why": "Đẩy → 押さないで. → **{危|あぶ}ないですから、{前|まえ}の{人|ひと}を{押|お}さないでください。** 〔Abunai desu kara, mae no hito o osanaide kudasai.〕 — Nguy hiểm nên đừng đẩy người phía trước."
          },
          {
            "q": "この{写真|しゃしん}は＿＿ですから、なくさないでください。　〔Kono shashin wa __ desu kara, nakusanaide kudasai.〕　— Ảnh này quý giá nên đừng làm mất.",
            "options": [
              "{暗|くら}い",
              "{大切|たいせつ}",
              "{迷惑|めいわく}",
              "{危|あぶ}ない"
            ],
            "correct": 1,
            "why": "大切 = quý giá. → **この{写真|しゃしん}は{大切|たいせつ}ですから、なくさないでください。** 〔Kono shashin wa taisetsu desu kara, nakusanaide kudasai.〕 — Ảnh này quý giá nên đừng làm mất."
          },
          {
            "q": "たくさん{歩|ある}きました。＿＿。　〔Takusan arukimashita. __.〕　— Đi bộ nhiều rồi. Mệt quá.",
            "options": [
              "{遅|おく}れました",
              "{見|み}えました",
              "{捨|す}てました",
              "{疲|つか}れました"
            ],
            "correct": 3,
            "why": "Đi nhiều → mệt. → **たくさん{歩|ある}きました。{疲|つか}れました。** 〔Takusan arukimashita. Tsukaremashita.〕 — Đi bộ nhiều rồi. Mệt quá."
          },
          {
            "q": "サルが＿＿を{食|た}べています。　〔Saru ga __ o tabete imasu.〕　— Con khỉ đang ăn chuối.",
            "options": [
              "パンフレット",
              "バナナ",
              "ボール",
              "カーテン"
            ],
            "correct": 1,
            "why": "Khỉ ăn chuối. → **サルがバナナを{食|た}べています。** 〔Saru ga banana o tabete imasu.〕 — Con khỉ đang ăn chuối."
          },
          {
            "q": "{暗|くら}くなりましたね。＿＿{帰|かえ}りましょう。　〔Kuraku narimashita ne. __ kaerimashou.〕　— Trời tối rồi nhỉ. Sắp về thôi.",
            "options": [
              "ええと",
              "そろそろ",
              "よく",
              "まっすぐ"
            ],
            "correct": 1,
            "why": "Đã đến lúc → そろそろ. → **{暗|くら}くなりましたね。そろそろ{帰|かえ}りましょう。** 〔Kuraku narimashita ne. Sorosoro kaerimashou.〕 — Trời tối rồi nhỉ. Sắp về thôi."
          },
          {
            "q": "{家族|かぞく}にお＿＿を{買|か}いました。　〔Kazoku ni o__ o kaimashita.〕　— Tôi đã mua quà lưu niệm cho gia đình.",
            "options": [
              "{荷物|にもつ}",
              "{他|ほか}",
              "{客|きゃく}",
              "{土産|みやげ}"
            ],
            "correct": 3,
            "why": "Quà lưu niệm = お土産. → **{家族|かぞく}にお{土産|みやげ}を{買|か}いました。** 〔Kazoku ni omiyage o kaimashita.〕 — Tôi đã mua quà lưu niệm cho gia đình."
          }
        ]
      },
      {
        "t": "h",
        "text": "II. Chữ Hán (12 câu · 12 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b10-de-ii",
        "title": "II. Chữ Hán",
        "items": [
          {
            "q": "Chọn cách viết đúng: みぎ (bên phải)",
            "options": [
              "左",
              "石",
              "古",
              "右"
            ],
            "correct": 3,
            "why": "右 = みぎ; 石 là \"đá\"."
          },
          {
            "q": "Chọn cách viết đúng: ひだり (bên trái)",
            "options": [
              "友",
              "右",
              "左",
              "在"
            ],
            "correct": 2,
            "why": "左 = ひだり."
          },
          {
            "q": "Chọn cách viết đúng: まちます (chờ)",
            "options": [
              "持ちます",
              "特ちます",
              "待ちます",
              "時ちます"
            ],
            "correct": 2,
            "why": "Chờ: 待 (bộ 彳); cầm: 持 (bộ 扌)."
          },
          {
            "q": "Chọn cách viết đúng: もちます (cầm)",
            "options": [
              "特ちます",
              "詩ちます",
              "待ちます",
              "持ちます"
            ],
            "correct": 3,
            "why": "持 có bộ 扌 (tay)."
          },
          {
            "q": "Chọn cách viết đúng: ちかい (gần)",
            "options": [
              "返い",
              "遠い",
              "近い",
              "迎い"
            ],
            "correct": 2,
            "why": "近 = gần."
          },
          {
            "q": "Chọn cách viết đúng: みち (con đường)",
            "options": [
              "道",
              "通",
              "首",
              "遠"
            ],
            "correct": 0,
            "why": "道 = 辶 + 首."
          },
          {
            "q": "Chọn cách viết đúng: まがります (rẽ)",
            "options": [
              "典がります",
              "曲がります",
              "由がります",
              "田がります"
            ],
            "correct": 1,
            "why": "曲 = rẽ, cong."
          },
          {
            "q": "Chọn cách viết đúng: すわります (ngồi)",
            "options": [
              "座ります",
              "広ります",
              "席ります",
              "庭ります"
            ],
            "correct": 0,
            "why": "座 = ngồi."
          },
          {
            "q": "Đọc đúng: 【歩きます】",
            "options": [
              "あるきます (arukimasu)",
              "あるいます (aruimasu)",
              "ほきます (hokimasu)",
              "あゆきます (ayukimasu)"
            ],
            "correct": 0,
            "why": "歩 Kun ある(く)."
          },
          {
            "q": "Đọc đúng: 【危ない】",
            "options": [
              "あやない (ayanai)",
              "きない (kinai)",
              "あふない (afunai)",
              "あぶない (abunai)"
            ],
            "correct": 3,
            "why": "危 Kun あぶ(ない)."
          },
          {
            "q": "Đọc đúng: 【橋】",
            "options": [
              "はじ (haji)",
              "きょう (kyou)",
              "はし (hashi)",
              "ばし (bashi)"
            ],
            "correct": 2,
            "why": "橋 đứng một mình → Kun はし."
          },
          {
            "q": "Đọc đúng: 【立たないで】",
            "options": [
              "たてないで (tatenaide)",
              "たたないで (tatanaide)",
              "たちないで (tachinaide)",
              "りつないで (ritsunaide)"
            ],
            "correct": 1,
            "why": "立ちます → 立たない."
          }
        ]
      },
      {
        "t": "h",
        "text": "III. Ngữ pháp (20 câu · 20 điểm)"
      },
      {
        "t": "mcq",
        "id": "lt-b10-de-iii",
        "title": "III. Ngữ pháp",
        "items": [
          {
            "q": "ここで{写真|しゃしん}を{撮|と}らない＿＿ください。　〔Koko de shashin o toranai __ kudasai.〕　— Xin đừng chụp ảnh ở đây.",
            "options": [
              "と",
              "で",
              "て",
              "に"
            ],
            "correct": 1,
            "why": "Vない **で** ください. → **ここで{写真|しゃしん}を{撮|と}らないでください。** 〔Koko de shashin o toranai de kudasai.〕 — Xin đừng chụp ảnh ở đây."
          },
          {
            "q": "ここでたばこを＿＿でください。　〔Koko de tabako o __ de kudasai.〕　— Xin đừng hút thuốc ở đây.",
            "options": [
              "{吸|す}いない",
              "{吸|す}わない",
              "{吸|す}あない",
              "{吸|す}わなく"
            ],
            "correct": 1,
            "why": "い → わ. → **ここでたばこを{吸|す}わないでください。** 〔Koko de tabako o suwanai de kudasai.〕 — Xin đừng hút thuốc ở đây."
          },
          {
            "q": "{芝生|しばふ}に＿＿でください。　〔Shibafu ni __ de kudasai.〕　— Xin đừng vào bãi cỏ.",
            "options": [
              "{入|はい}りない",
              "{入|はい}れない",
              "{入|はい}らない",
              "{入|はい}ない"
            ],
            "correct": 2,
            "why": "入ります nhóm 1. → **{芝生|しばふ}に{入|はい}らないでください。** 〔Shibafu ni hairanai de kudasai.〕 — Xin đừng vào bãi cỏ."
          },
          {
            "q": "{窓|まど}を{開|あ}けて＿＿いいですか。　〔Mado o akete __ ii desu ka.〕　— Tôi mở cửa sổ được không?",
            "options": [
              "は",
              "が",
              "も",
              "を"
            ],
            "correct": 2,
            "why": "Vて **も** いいですか. → **{窓|まど}を{開|あ}けてもいいですか。** 〔Mado o akete mo ii desu ka.〕 — Tôi mở cửa sổ được không?"
          },
          {
            "q": "ここに＿＿もいいですか。　〔Koko ni __ mo ii desu ka.〕　— Tôi ngồi đây được không?",
            "options": [
              "{座|すわ}って",
              "{座|すわ}り",
              "{座|すわ}る",
              "{座|すわ}らない"
            ],
            "correct": 0,
            "why": "Thể て + も いいですか. → **ここに{座|すわ}ってもいいですか。** 〔Koko ni suwatte mo ii desu ka.〕 — Tôi ngồi đây được không?"
          },
          {
            "q": "A：ここで{写真|しゃしん}を{撮|と}ってもいいですか。B：すみません、＿＿。　〔A: koko de shashin o totte mo ii desu ka. B: sumimasen, __.〕　— A: Tôi chụp ảnh ở đây được không? B: Xin lỗi, hơi… (không được).",
            "options": [
              "どうぞ",
              "ちょっと……",
              "{本当|ほんとう}だ",
              "いいですよ"
            ],
            "correct": 1,
            "why": "Từ chối khéo: すみません、ちょっと……. → **A：ここで{写真|しゃしん}を{撮|と}ってもいいですか。B：すみません、ちょっと……。** 〔A: koko de shashin o totte mo ii desu ka. B: sumimasen, chotto....〕 — A: Tôi chụp ảnh ở đây được không? B: Xin lỗi, hơi… (không được)."
          },
          {
            "q": "あっ、パンダ＿＿{寝|ね}ています。　〔A, panda __ nete imasu.〕　— A, gấu trúc đang ngủ.",
            "options": [
              "に",
              "を",
              "が",
              "で"
            ],
            "correct": 2,
            "why": "Vừa thấy → が. → **あっ、パンダが{寝|ね}ています。** 〔A, panda ga nete imasu.〕 — A, gấu trúc đang ngủ."
          },
          {
            "q": "A：もう{宿題|しゅくだい}をしましたか。B：いいえ、まだ＿＿。　〔A: mou shukudai o shimashita ka. B: iie, mada __.〕　— A: Bạn làm bài tập chưa? B: Chưa, chưa làm.",
            "options": [
              "していません",
              "しないでください",
              "しています",
              "しませんでした"
            ],
            "correct": 0,
            "why": "まだ Vて いません. → **A：もう{宿題|しゅくだい}をしましたか。B：いいえ、まだしていません。** 〔A: mou shukudai o shimashita ka. B: iie, mada shite imasen.〕 — A: Bạn làm bài tập chưa? B: Chưa, chưa làm."
          },
          {
            "q": "ちょっとジュースを{買|か}って＿＿。　〔Chotto juusu o katte __.〕　— Tôi đi mua nước ép rồi về.",
            "options": [
              "いません",
              "います",
              "きます",
              "ください"
            ],
            "correct": 2,
            "why": "Đi rồi về → Vて きます. → **ちょっとジュースを{買|か}ってきます。** 〔Chotto juusu o katte kimasu.〕 — Tôi đi mua nước ép rồi về."
          },
          {
            "q": "ここで{切手|きって}を＿＿ことができます。　〔Koko de kitte o __ koto ga dekimasu.〕　— Ở đây có thể mua tem.",
            "options": [
              "{買|か}って",
              "{買|か}う",
              "{買|か}わない",
              "{買|か}います"
            ],
            "correct": 1,
            "why": "Trước こと → thể từ điển. → **ここで{切手|きって}を{買|か}うことができます。** 〔Koko de kitte o kau koto ga dekimasu.〕 — Ở đây có thể mua tem."
          },
          {
            "q": "この{動物園|どうぶつえん}でゾウにえさをやること＿＿できます。　〔Kono doubutsuen de zou ni esa o yaru koto __ dekimasu.〕　— Ở sở thú này có thể cho voi ăn.",
            "options": [
              "で",
              "が",
              "を",
              "に"
            ],
            "correct": 1,
            "why": "こと **が** できます. → **この{動物園|どうぶつえん}でゾウにえさをやることができます。** 〔Kono doubutsuen de zou ni esa o yaru koto ga dekimasu.〕 — Ở sở thú này có thể cho voi ăn."
          },
          {
            "q": "ここから{富士山|ふじさん}＿＿{見|み}えます。　〔Koko kara Fujisan __ miemasu.〕　— Từ đây nhìn thấy núi Phú Sĩ.",
            "options": [
              "が",
              "に",
              "を",
              "へ"
            ],
            "correct": 0,
            "why": "見えます + が. → **ここから{富士山|ふじさん}が{見|み}えます。** 〔Koko kara Fujisan ga miemasu.〕 — Từ đây nhìn thấy núi Phú Sĩ."
          },
          {
            "q": "すみません、よく＿＿。もう{一度|いちど}お{願|ねが}いします。　〔Sumimasen, yoku __. Mou ichido onegaishimasu.〕　— Xin lỗi, tôi nghe không rõ. Nói lại giúp.",
            "options": [
              "{見|み}えません",
              "{聞|き}こえません",
              "{聞|き}きません",
              "{聞|き}かないで"
            ],
            "correct": 1,
            "why": "Nghe không rõ → 聞こえません. → **すみません、よく{聞|き}こえません。もう{一度|いちど}お{願|ねが}いします。** 〔Sumimasen, yoku kikoemasen. Mou ichido onegaishimasu.〕 — Xin lỗi, tôi nghe không rõ. Nói lại giúp."
          },
          {
            "q": "{寒|さむ}い→{寒|さむ}＿なりました。　〔Samui → samu_ narimashita.〕　— Trời đã lạnh.",
            "options": [
              "く",
              "くに",
              "いに",
              "に"
            ],
            "correct": 0,
            "why": "い → く. → **{寒|さむ}い→{寒|さむ}＿なりました。** 〔Samui → samu_ narimashita.〕 — Trời đã lạnh."
          },
          {
            "q": "{静|しず}か＿＿なりました。　〔Shizuka __ narimashita.〕　— Đã trở nên yên tĩnh.",
            "options": [
              "で",
              "く",
              "な",
              "に"
            ],
            "correct": 3,
            "why": "Tính từ な → に. → **{静|しず}かになりました。** 〔Shizuka ni narimashita.〕 — Đã trở nên yên tĩnh."
          },
          {
            "q": "もうすぐ{十二時|じゅうにじ}＿＿なります。　〔Mousugu juuniji __ narimasu.〕　— Sắp 12 giờ.",
            "options": [
              "に",
              "が",
              "を",
              "く"
            ],
            "correct": 0,
            "why": "Danh từ → に なります. → **もうすぐ{十二時|じゅうにじ}になります。** 〔Mousugu juuniji ni narimasu.〕 — Sắp 12 giờ."
          },
          {
            "q": "あの{橋|はし}＿＿{渡|わた}ってください。　〔Ano hashi __ watatte kudasai.〕　— Hãy qua cây cầu kia.",
            "options": [
              "で",
              "へ",
              "に",
              "を"
            ],
            "correct": 3,
            "why": "Nơi đi qua → を. → **あの{橋|はし}を{渡|わた}ってください。** 〔Ano hashi o watatte kudasai.〕 — Hãy qua cây cầu kia."
          },
          {
            "q": "{次|つぎ}の{交差点|こうさてん}を{左|ひだり}＿＿{曲|ま}がってください。　〔Tsugi no kousaten o hidari __ magatte kudasai.〕　— Rẽ trái ở ngã tư tiếp theo.",
            "options": [
              "に",
              "で",
              "が",
              "を"
            ],
            "correct": 0,
            "why": "Hướng rẽ → に. → **{次|つぎ}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がってください。** 〔Tsugi no kousaten o hidari ni magatte kudasai.〕 — Rẽ trái ở ngã tư tiếp theo."
          },
          {
            "q": "（ここに{置|お}かないでください。）{荷物|にもつ}＿＿あそこに{置|お}いてください。　〔(Koko ni okanaide kudasai.) nimotsu __ asoko ni oite kudasai.〕　— (Đừng để ở đây.) Hành lý thì để đằng kia.",
            "options": [
              "が",
              "を",
              "は",
              "に"
            ],
            "correct": 2,
            "why": "Đưa tân ngữ lên làm chủ đề → は. → **（ここに{置|お}かないでください。）{荷物|にもつ}はあそこに{置|お}いてください。** 〔(Koko ni okanaide kudasai.) nimotsu wa asoko ni oite kudasai.〕 — (Đừng để ở đây.) Hành lý thì để đằng kia."
          },
          {
            "q": "{寒|さむ}くなりましたね。コーヒーを＿＿。　〔Samuku narimashita ne. Koohii o __.〕　— Lạnh rồi nhỉ. Uống cà phê không?",
            "options": [
              "{飲|の}んでいません",
              "{飲|の}むことが",
              "{飲|の}まないでください",
              "{飲|の}みませんか"
            ],
            "correct": 3,
            "why": "Thay đổi → rủ ～ませんか. → **{寒|さむ}くなりましたね。コーヒーを{飲|の}みませんか。** 〔Samuku narimashita ne. Koohii o nomimasen ka.〕 — Lạnh rồi nhỉ. Uống cà phê không?"
          }
        ]
      },
      {
        "t": "h",
        "text": "IV. Gõ thể ない / thể て (10 câu · 10 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b10-de-iv",
        "title": "IV. Gõ dạng đúng của động từ trong gợi ý",
        "kind": "fill",
        "grammar": "Thể ない: nhóm 1 hàng い → hàng あ (い→わ) · nhóm 2 bỏ ます · しない／こない — Thể て: Bài 7",
        "items": [
          {
            "q": "ここで{写真|しゃしん}を＿＿でください。　〔Koko de shashin o __ de kudasai.〕",
            "answers": [
              "撮らない",
              "とらない"
            ],
            "hint": "とります → thể ない"
          },
          {
            "q": "{集合|しゅうごう}{時間|じかん}に＿＿でください。　〔Shuugou jikan ni __ de kudasai.〕",
            "answers": [
              "遅れない",
              "おくれない"
            ],
            "hint": "おくれます → thể ない"
          },
          {
            "q": "この{部屋|へや}に＿＿でください。　〔Kono heya ni __ de kudasai.〕",
            "answers": [
              "入らない",
              "はいらない"
            ],
            "hint": "はいります → thể ない (nhóm 1)"
          },
          {
            "q": "{明日|あした}は＿＿でください。{休|やす}みです。　〔Ashita wa __ de kudasai. Yasumi desu.〕",
            "answers": [
              "来ない",
              "こない"
            ],
            "hint": "きます → thể ない"
          },
          {
            "q": "たばこを＿＿でください。　〔Tabako o __ de kudasai.〕",
            "answers": [
              "吸わない",
              "すわない"
            ],
            "hint": "すいます → thể ない"
          },
          {
            "q": "ここに＿＿もいいですか。　〔Koko ni __ mo ii desu ka.〕",
            "answers": [
              "座って",
              "すわって"
            ],
            "hint": "すわります → thể て"
          },
          {
            "q": "{窓|まど}を＿＿もいいですか。　〔Mado o __ mo ii desu ka.〕",
            "answers": [
              "開けて",
              "あけて"
            ],
            "hint": "あけます → thể て"
          },
          {
            "q": "{橋|はし}を＿＿、{右|みぎ}に{曲|ま}がってください。　〔Hashi o __, migi ni magatte kudasai.〕",
            "answers": [
              "渡って",
              "わたって"
            ],
            "hint": "わたります → thể て"
          },
          {
            "q": "ちょっとワンさんを＿＿きます。　〔Chotto Wan-san o __ kimasu.〕",
            "answers": [
              "探して",
              "さがして"
            ],
            "hint": "さがします → thể て"
          },
          {
            "q": "あっ、{鳥|とり}が＿＿います。　〔A, tori ga __ imasu.〕",
            "answers": [
              "飛んで",
              "とんで"
            ],
            "hint": "とびます → thể て"
          }
        ]
      },
      {
        "t": "h",
        "text": "V. Đọc hiểu (4 câu · 4 điểm)"
      },
      {
        "t": "passage",
        "title": "V. Đọc hiểu — Tin nhắn của Lin",
        "intro": "Đọc đoạn rồi trả lời 4 câu.",
        "paras": [
          {
            "text": "ダニエルさん、{今|いま}どこですか。{私|わたし}はもう{動物園|どうぶつえん}の{入|い}り{口|ぐち}にいます。{駅|えき}を{出|で}て、{一|ひと}つ{目|め}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。{橋|はし}を{渡|わた}って、{左|ひだり}に{入|い}り{口|ぐち}が{見|み}えます。{私|わたし}はまだチケットを{買|か}っていません。{一緒|いっしょ}に{買|か}いましょう。リン"
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
            "en": "ダニエルさん、{今|いま}どこですか。",
            "ro": "Danieru-san, ima doko desu ka.",
            "vi": "Daniel, bây giờ bạn ở đâu?"
          },
          {
            "en": "{私|わたし}はもう{動物園|どうぶつえん}の{入|い}り{口|ぐち}にいます。",
            "ro": "Watashi wa mou doubutsuen no iriguchi ni imasu.",
            "vi": "Mình đã ở lối vào sở thú rồi."
          },
          {
            "en": "{駅|えき}を{出|で}て、{一|ひと}つ{目|め}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。",
            "ro": "Eki o dete, hitotsume no kousaten o migi ni magatte kudasai.",
            "vi": "Ra khỏi ga, rẽ phải ở ngã tư thứ nhất."
          },
          {
            "en": "{橋|はし}を{渡|わた}って、{左|ひだり}に{入|い}り{口|ぐち}が{見|み}えます。",
            "ro": "Hashi o watatte, hidari ni iriguchi ga miemasu.",
            "vi": "Qua cầu, bên trái sẽ thấy lối vào."
          },
          {
            "en": "{私|わたし}はまだチケットを{買|か}っていません。",
            "ro": "Watashi wa mada chiketto o katte imasen.",
            "vi": "Mình vẫn chưa mua vé."
          },
          {
            "en": "{一緒|いっしょ}に{買|か}いましょう。リン",
            "ro": "Issho ni kaimashou. Rin",
            "vi": "Cùng mua nhé. Lin"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-de-v",
        "title": "V. Câu hỏi đọc hiểu",
        "items": [
          {
            "q": "Lin đang ở đâu?",
            "options": [
              "Ở ga",
              "Trên cầu",
              "Ở ngã tư",
              "Ở lối vào sở thú"
            ],
            "correct": 3,
            "why": "もう 動物園の 入り口に います."
          },
          {
            "q": "Từ ga, rẽ ở đâu, hướng nào?",
            "options": [
              "Ngã tư thứ nhất, rẽ trái",
              "Ngã tư thứ nhất, rẽ phải",
              "Đèn thứ nhất, rẽ phải",
              "Ngã tư thứ hai, rẽ phải"
            ],
            "correct": 1,
            "why": "一つ目の 交差点を 右に."
          },
          {
            "q": "Qua cầu thì lối vào ở phía nào?",
            "options": [
              "Không nói",
              "Ngay trước mặt",
              "Bên trái",
              "Bên phải"
            ],
            "correct": 2,
            "why": "左に 入り口が 見えます."
          },
          {
            "q": "Câu nào ĐÚNG?",
            "options": [
              "Daniel đã đến sở thú",
              "Lin đang chờ ở ga",
              "Lin chưa mua vé, muốn mua cùng Daniel",
              "Lin đã mua vé cho Daniel"
            ],
            "correct": 2,
            "why": "まだ チケットを 買って いません。一緒に 買いましょう."
          }
        ]
      },
      {
        "t": "h",
        "text": "VI. Dịch (9 câu · 9 điểm)"
      },
      {
        "t": "quiz",
        "id": "lt-b10-de-vi-a",
        "title": "VI-a. Dịch Việt → Nhật",
        "kind": "translate",
        "grammar": "ポイント 88–97",
        "items": [
          {
            "q": "Xin đừng vứt rác ở đây.",
            "answers": [
              "ここにごみを捨てないでください。",
              "ここにごみをすてないでください。",
              "ここでごみを捨てないでください。",
              "ここでごみをすてないでください。"
            ],
            "hint": "Vない で ください"
          },
          {
            "q": "Tôi chụp ảnh được không?",
            "answers": [
              "写真を撮ってもいいですか。",
              "写真をとってもいいですか。",
              "しゃしんを撮ってもいいですか。",
              "しゃしんをとってもいいですか。"
            ],
            "hint": "Vて も いいですか"
          },
          {
            "q": "Tôi vẫn chưa ăn trưa.",
            "answers": [
              "まだ昼ご飯を食べていません。",
              "まだ昼ご飯をたべていません。",
              "まだ昼ごはんを食べていません。",
              "まだ昼ごはんをたべていません。",
              "まだひるご飯を食べていません。",
              "まだひるご飯をたべていません。",
              "まだひるごはんを食べていません。",
              "まだひるごはんをたべていません。",
              "昼ご飯はまだ食べていません。",
              "昼ご飯はまだたべていません。",
              "昼ごはんはまだ食べていません。",
              "昼ごはんはまだたべていません。",
              "ひるご飯はまだ食べていません。",
              "ひるご飯はまだたべていません。",
              "ひるごはんはまだ食べていません。",
              "ひるごはんはまだたべていません。"
            ],
            "hint": "まだ Vて いません"
          },
          {
            "q": "Từ đây nhìn thấy biển.",
            "answers": [
              "ここから海が見えます。",
              "ここから海がみえます。",
              "ここからうみが見えます。",
              "ここからうみがみえます。"
            ],
            "hint": "N が 見えます"
          },
          {
            "q": "Trời tối rồi.",
            "answers": [
              "暗くなりました。",
              "くらくなりました。"
            ],
            "hint": "い → く なります"
          }
        ]
      },
      {
        "t": "mcq",
        "id": "lt-b10-de-vi-b",
        "title": "VI-b. Dịch Nhật → Việt",
        "items": [
          {
            "q": "Câu này nghĩa là gì? ちょっとトイレに{行|い}ってきます。　〔Chotto toire ni itte kimasu.〕",
            "options": [
              "Nhà vệ sinh ở gần đây.",
              "Tôi đã đi vệ sinh.",
              "Hãy đi vệ sinh đi.",
              "Tôi đi vệ sinh một chút rồi quay lại."
            ],
            "correct": 3,
            "why": "Vて きます = đi rồi quay lại."
          },
          {
            "q": "Câu này nghĩa là gì? ここでボールを{借|か}りることができます。　〔Koko de booru o kariru koto ga dekimasu.〕",
            "options": [
              "Ở đây có thể mượn bóng.",
              "Ở đây không cho mượn bóng.",
              "Tôi biết mượn bóng.",
              "Hãy mượn bóng ở đây."
            ],
            "correct": 0,
            "why": "(nơi) で V こと が できます."
          },
          {
            "q": "Câu này nghĩa là gì? あっ、サルが{木|き}の{上|うえ}で{寝|ね}ています。　〔A, saru ga ki no ue de nete imasu.〕",
            "options": [
              "Con khỉ đã ngủ trên cây.",
              "Con khỉ muốn ngủ trên cây.",
              "Con khỉ thường ngủ trên cây.",
              "A, con khỉ đang ngủ trên cây."
            ],
            "correct": 3,
            "why": "あっ、N が Vています = (kìa) N đang V."
          },
          {
            "q": "Câu này nghĩa là gì? {荷物|にもつ}はあそこに{置|お}いてください。　〔Nimotsu wa asoko ni oite kudasai.〕",
            "options": [
              "Tôi để hành lý đằng kia được không?",
              "Hành lý ở đằng kia.",
              "Đừng để hành lý đằng kia.",
              "Hành lý thì hãy để đằng kia."
            ],
            "correct": 3,
            "why": "N は ～て ください (ポイント 97)."
          }
        ]
      }
    ]
  }
];
